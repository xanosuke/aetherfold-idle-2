/**
 * Offline camp. Elapsed time becomes kills against one monster group
 * placed in the zone the player is standing in. Towns and instances refuse.
 * The camp does not move the player. An old town id loads as West Ronfaure
 * and hunts the nearest group there. Notorious-monster mode uses the same
 * window, placeholder, and drop table the field uses.
 */
import { dropRate, type DropTier } from "./drops";
import { checkCon, type Con } from "./commands";
import { EAST_STAND } from "./east-ronfaure";
import { settleKill, type ChainClock } from "./exp";
import { type FovState } from "./fov";
import { GLACIER_ARRIVE } from "./glacier";
import { ORC_ZONES } from "./ghelsba";
import { findAction } from "./hotbar";
import { inPass, passSquare } from "./pass";
import { nearestPassCamp, PASS_CAMPS, PASS_GRAPH, gridToWorld } from "./pass-graph";
import { placedBodies, speciesFarm, nmCampModel, lotteryCamps, rollSpeciesItems } from "./ronfaure";
import { pointsFromExp, crystalChance } from "./signet";
import { TOMB_FOYER } from "./tomb";
import { FISHER, RON_SIZE, RON_X0, RON_Z0, regionName } from "./world";

/** Hours a camp will pay for. Raise this when the pace should run longer. */
export const MAX_AFK_HOURS = 12;

export type ZoneKind = "town" | "instance" | "field" | "dungeon";

/** Experience camp is saved as exp. Notorious-monster camp is saved as nm. */
export type CampMode = "exp" | "nm";

/** Shown when the zone has no Notorious Monster the camp can wait on. */
export const NO_NM = "No notorious monsters here.";

export type CheckRating =
  | "Too Weak"
  | "Easy Prey"
  | "Decent Challenge"
  | "Even Match"
  | "Tough"
  | "Very Tough"
  | "Incredibly Tough";

const RATING: Record<Con, CheckRating> = {
  "too-weak": "Too Weak",
  "easy-prey": "Easy Prey",
  "decent-challenge": "Decent Challenge",
  "even-match": "Even Match",
  "tough": "Tough",
  "very-tough": "Very Tough",
  "incredibly-tough": "Incredibly Tough",
};

/** /check against one prey level. Too Weak pays no experience. */
export function checkRating(playerLevel: number, mobLevel: number): CheckRating {
  return RATING[checkCon(playerLevel, mobLevel)];
}

/** Every region named in world.ts. Unknown ground is treated as a town. */
export const REGION_KIND: Record<string, ZoneKind> = {
  "Southern San d'Oria": "town",
  "Northern San d'Oria": "town",
  "Port San d'Oria": "town",
  "San d'Oria": "town",
  "Chocobo Circuit": "town",
  "Chateau d'Oraguille": "town",
  "West Ronfaure": "field",
  "East Ronfaure": "field",
  "Beaucedine Glacier": "field",
  "La Theine Plateau": "field",
  "Carpenters' Landing": "field",
  "Jugner Forest": "field",
  "Batallia Downs": "field",
  "Xarcabard": "field",
  "King Ranperre's Tomb": "dungeon",
  "Ranguemont Pass": "dungeon",
  "Ghelsba Outpost": "dungeon",
  "Fort Ghelsba": "dungeon",
  "Yughott Grotto": "dungeon",
  "Fei'Yin": "dungeon",
  "Pso'Xja": "dungeon",
  "Horlais Peak": "instance",
  "Cavernous Maw": "instance",
  "Dynamis - Beaucedine": "instance",
};

export function regionKind(name: string): ZoneKind {
  return REGION_KIND[name] ?? "town";
}

type ZoneCampId = "ronfaure-west" | "ronfaure-east" | "ranperre" | "beaucedine" | "ghelsba" | "fort-ghelsba" | "yughott";
export type FarmZoneId = ZoneCampId | (typeof PASS_CAMPS)[number]["id"] | `zone-${string}`;

export type FarmDrop = { id: string; found: string; tier: DropTier };

export type FarmSpot = {
  id: FarmZoneId;
  name: string;
  region: string;
  levelMin: number;
  levelMax: number;
  prey: string;
  level?: number;
  hpNatural?: number;
  weaponDamage?: number;
  delay?: number;
  drops?: readonly FarmDrop[];
};

/** One species placed in the zone the player is standing in. */
export type PreyGroup = {
  id: string;
  name: string;
  family: string;
  levelMin: number;
  levelMax: number;
  /** Species minimum. /check and kill experience both use this level. */
  level: number;
  hpNatural: number;
  weaponDamage: number;
  delay: number;
  drops: FarmDrop[];
  x: number;
  z: number;
  dist: number;
};

/** One Notorious Monster the zone can camp. Lottery NMs are listed from their placeholder. */
export type NmRow = PreyGroup & {
  phId: string | null;
  phName: string | null;
};

function orcMid(name: string): { x: number; z: number } {
  const zone = ORC_ZONES.find((row) => row.name === name);
  const rect = zone?.rects[0];
  if (!rect) return { x: 0, z: 0 };
  return { x: (rect.minX + rect.maxX) / 2, z: (rect.minZ + rect.maxZ) / 2 };
}

/** Interior points. Unbuilt regions (La Theine, Carpenters' Landing) have none. */
export const REGION_CENTRE: Record<string, { x: number; z: number }> = {
  "Southern San d'Oria": { x: 0, z: 0 },
  "Northern San d'Oria": { x: -10, z: -300 },
  "Port San d'Oria": FISHER,
  "San d'Oria": { x: 0, z: 40 },
  "West Ronfaure": { x: RON_X0 + RON_SIZE / 2, z: RON_Z0 + RON_SIZE / 2 },
  "East Ronfaure": EAST_STAND.sandoria,
  "King Ranperre's Tomb": TOMB_FOYER,
  "Beaucedine Glacier": GLACIER_ARRIVE,
  "Ranguemont Pass": gridToWorld(6.25, 6.75),
  "Ghelsba Outpost": orcMid("Ghelsba Outpost"),
  "Fort Ghelsba": orcMid("Fort Ghelsba"),
  "Yughott Grotto": orcMid("Yughott Grotto"),
  "Horlais Peak": orcMid("Horlais Peak"),
};

/** Stable ids for the zones that already have saves. Any other field gets zone-<slug>. */
const NAMED_CAMPS: Record<string, ZoneCampId> = {
  "West Ronfaure": "ronfaure-west",
  "East Ronfaure": "ronfaure-east",
  "King Ranperre's Tomb": "ranperre",
  "Beaucedine Glacier": "beaucedine",
  "Ghelsba Outpost": "ghelsba",
  "Fort Ghelsba": "fort-ghelsba",
  "Yughott Grotto": "yughott",
};

function zoneCampId(region: string): FarmZoneId {
  const named = NAMED_CAMPS[region];
  if (named) return named;
  const slug = region.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return `zone-${slug}`;
}

/** Town-yard ids from older saves are not camps. They load as West Ronfaure. */
export function knownFarmId(id: string): id is FarmZoneId {
  if (PASS_CAMPS.some((camp) => camp.id === id)) return true;
  if ((Object.values(NAMED_CAMPS) as string[]).includes(id)) return true;
  return /^zone-[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id);
}

export function campZoneFromSave(id: string): FarmZoneId | null {
  if (id === "west-ronfaure" || id === "ronfaure-forest") return "ronfaure-west";
  return knownFarmId(id) ? id : null;
}

export function regionForZone(id: string): string | null {
  if (id === "west-ronfaure" || id === "ronfaure-forest") return "West Ronfaure";
  if (PASS_CAMPS.some((camp) => camp.id === id)) return "Ranguemont Pass";
  for (const [name, camp] of Object.entries(NAMED_CAMPS)) {
    if (camp === id) return name;
  }
  if (!id.startsWith("zone-")) return null;
  const slug = id.slice("zone-".length);
  for (const name of Object.keys(REGION_KIND)) {
    const next = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    if (next === slug) return name;
  }
  return null;
}

function campSpot(id: (typeof PASS_CAMPS)[number]["id"]): FarmSpot {
  const camp = PASS_CAMPS.find((row) => row.id === id);
  if (!camp) throw new Error(`missing camp ${id}`);
  const node = PASS_GRAPH.nodes.find((row) => row.id === camp.node);
  if (!node) throw new Error(`camp node ${camp.node}`);
  const rows = camp.monsters.map((monster) => speciesFarm(monster));
  const ordered = rows.slice().sort((a, b) => a.levelMin - b.levelMin || a.name.localeCompare(b.name));
  const lead = ordered[Math.floor((ordered.length - 1) / 2)] ?? ordered[0];
  const drops: FarmDrop[] = [];
  const seen = new Set<string>();
  for (const row of rows) {
    for (const drop of row.drops) {
      if (seen.has(drop.id)) continue;
      seen.add(drop.id);
      drops.push(drop);
    }
  }
  return {
    id,
    name: `Ranguemont ${node.grid}`,
    region: "Ranguemont Pass",
    levelMin: Math.min(...rows.map((row) => row.levelMin)),
    levelMax: Math.max(...rows.map((row) => row.levelMax)),
    prey: lead.name,
    level: lead.level,
    hpNatural: lead.hpNatural,
    weaponDamage: lead.weaponDamage,
    delay: lead.delay,
    drops,
  };
}

function weightedSpot(id: FarmZoneId, region: string, x: number, z: number): FarmSpot {
  const weight = new Map<string, number>();
  for (const body of placedBodies()) {
    if (regionName(body.x, body.z) !== region) continue;
    const dist = Math.hypot(body.x - x, body.z - z);
    weight.set(body.species, (weight.get(body.species) ?? 0) + Math.exp(-dist / 36));
  }
  const ranked = [...weight.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  if (!ranked.length) {
    return { id, name: region, region, levelMin: 1, levelMax: 1, prey: "Nothing hunts here", drops: [] };
  }
  const total = ranked.reduce((sum, [, w]) => sum + w, 0);
  const keep: string[] = [];
  let acc = 0;
  for (const [species, w] of ranked) {
    keep.push(species);
    acc += w;
    if (acc >= total * 0.8) break;
  }
  const rows = keep.map((species) => speciesFarm(species));
  const lead = rows[0];
  const drops: FarmDrop[] = [];
  const seen = new Set<string>();
  for (const row of rows) {
    for (const drop of row.drops) {
      if (seen.has(drop.id)) continue;
      seen.add(drop.id);
      drops.push(drop);
    }
  }
  return {
    id,
    name: region,
    region,
    levelMin: Math.min(...rows.map((row) => row.levelMin)),
    levelMax: Math.max(...rows.map((row) => row.levelMax)),
    prey: lead.name,
    level: lead.level,
    hpNatural: lead.hpNatural,
    weaponDamage: lead.weaponDamage,
    delay: lead.delay,
    drops,
  };
}

const PASS_SPOTS = PASS_CAMPS.map((camp) => campSpot(camp.id));

/** Camps the field may stand in. Pass nodes, then one camp per walkable field or dungeon. No towns. */
export function farmSpots(): FarmSpot[] {
  const zones: FarmSpot[] = [];
  for (const [name, kind] of Object.entries(REGION_KIND)) {
    if (kind !== "field" && kind !== "dungeon") continue;
    if (name === "Ranguemont Pass") continue;
    const at = REGION_CENTRE[name];
    if (!at || regionName(at.x, at.z) !== name) continue;
    zones.push(weightedSpot(zoneCampId(name), name, at.x, at.z));
  }
  zones.sort((a, b) => a.name.localeCompare(b.name));
  return [...PASS_SPOTS, ...zones];
}

export function spotById(id: FarmZoneId): FarmSpot {
  const pass = PASS_SPOTS.find((spot) => spot.id === id);
  if (pass) return pass;
  const live = farmSpots().find((spot) => spot.id === id);
  if (live) return live;
  const region = Object.keys(REGION_KIND).find((name) => zoneCampId(name) === id);
  if (region) {
    const at = REGION_CENTRE[region];
    if (at && regionName(at.x, at.z) === region) return weightedSpot(id, region, at.x, at.z);
    return { id, name: region, region, levelMin: 1, levelMax: 1, prey: "Nothing hunts here", drops: [] };
  }
  return PASS_SPOTS[0];
}

/** Species in the region under this point, one row each. Empty in a town, an instance, or a zone with no spawns. */
export function zoneGroups(x: number, z: number): PreyGroup[] {
  const name = regionName(x, z);
  const kind = regionKind(name);
  if (kind !== "field" && kind !== "dungeon") return [];
  const nearest = new Map<string, { x: number; z: number; dist: number }>();
  for (const body of placedBodies()) {
    if (regionName(body.x, body.z) !== name) continue;
    const dist = Math.hypot(body.x - x, body.z - z);
    const prev = nearest.get(body.species);
    if (prev && prev.dist <= dist) continue;
    nearest.set(body.species, { x: body.x, z: body.z, dist });
  }
  const groups: PreyGroup[] = [];
  for (const [species, spot] of nearest) {
    const farm = speciesFarm(species);
    groups.push({
      id: species,
      name: farm.name,
      family: farm.family,
      levelMin: farm.levelMin,
      levelMax: farm.levelMax,
      level: farm.level,
      hpNatural: farm.hpNatural,
      weaponDamage: farm.weaponDamage,
      delay: farm.delay,
      drops: farm.drops,
      x: spot.x,
      z: spot.z,
      dist: spot.dist,
    });
  }
  groups.sort((a, b) => a.family.localeCompare(b.family) || a.levelMin - b.levelMin || a.name.localeCompare(b.name));
  return groups;
}

function groupFrom(species: string, x: number, z: number, dist: number): PreyGroup {
  const farm = speciesFarm(species);
  return {
    id: species,
    name: farm.name,
    family: farm.family,
    levelMin: farm.levelMin,
    levelMax: farm.levelMax,
    level: farm.level,
    hpNatural: farm.hpNatural,
    weaponDamage: farm.weaponDamage,
    delay: farm.delay,
    drops: farm.drops,
    x,
    z,
    dist,
  };
}

/** Notorious Monsters this zone can camp. A lottery NM is listed when its placeholder stands here. */
export function zoneNms(x: number, z: number): NmRow[] {
  const groups = zoneGroups(x, z);
  if (groups.length === 0 && regionKind(regionName(x, z)) !== "field" && regionKind(regionName(x, z)) !== "dungeon") return [];
  const byId = new Map(groups.map((group) => [group.id, group]));
  const rows: NmRow[] = [];
  const seen = new Set<string>();
  for (const group of groups) {
    const model = nmCampModel(group.id);
    if (!model) continue;
    const ph = model.ph ? byId.get(model.ph) : undefined;
    rows.push({ ...group, phId: ph?.id ?? model.ph, phName: ph?.name ?? (model.ph ? speciesFarm(model.ph).name : null) });
    seen.add(group.id);
  }
  for (const camp of lotteryCamps()) {
    if (seen.has(camp.nm)) continue;
    const ph = byId.get(camp.ph);
    if (!ph || !nmCampModel(camp.nm)) continue;
    const card = groupFrom(camp.nm, ph.x, ph.z, ph.dist);
    rows.push({ ...card, phId: ph.id, phName: ph.name });
    seen.add(camp.nm);
  }
  rows.sort((a, b) => a.levelMin - b.levelMin || a.name.localeCompare(b.name));
  return rows;
}

/** Closest Notorious Monster. A tie takes the earlier name. */
export function nearestNm(x: number, z: number): NmRow | null {
  let best: NmRow | null = null;
  for (const row of zoneNms(x, z)) {
    if (!best || row.dist < best.dist || (row.dist === best.dist && row.name.localeCompare(best.name) < 0)) best = row;
  }
  return best;
}

/**
 * What the camp kills while an NM window is shut.
 * A lottery NM uses its placeholder. A timed NM prefers the closest same-family
 * monster that is not itself an NM, then the closest other group.
 */
export function nmFiller(nmId: string, x: number, z: number): PreyGroup | null {
  const model = nmCampModel(nmId);
  if (!model) return null;
  const groups = zoneGroups(x, z);
  if (model.ph) {
    const placed = groups.find((group) => group.id === model.ph);
    if (placed) return placed;
    const nm = groups.find((group) => group.id === nmId) ?? zoneNms(x, z).find((row) => row.id === nmId);
    return groupFrom(model.ph, nm?.x ?? x, nm?.z ?? z, nm?.dist ?? 0);
  }
  const nm = speciesFarm(nmId);
  const ordinary = groups.filter((group) => group.id !== nmId && !nmCampModel(group.id));
  const family = ordinary.filter((group) => group.family === nm.family);
  const pile = family.length > 0 ? family : ordinary;
  let best: PreyGroup | null = null;
  for (const group of pile) {
    if (!best || group.dist < best.dist || (group.dist === best.dist && group.name.localeCompare(best.name) < 0)) best = group;
  }
  return best;
}

/** Expected NM kills per hour. Zero when the fight would be lost. */
export function nmPace(phKpm: number, nmKpm: number, model: { ph: string | null; cooldown: number; popChance: number }, canKill: boolean): number {
  if (!canKill || nmKpm <= 0) return 0;
  const cooldownMin = model.cooldown / 60;
  const wait = model.ph ? (1 / Math.max(0.0001, model.popChance)) / Math.max(0.05, phKpm) : 0;
  const cycle = cooldownMin + wait + 1 / nmKpm;
  return Math.round((60 / cycle) * 10) / 10;
}

/** Closest placed body. A tie takes the earlier name. */
export function nearestGroup(x: number, z: number): PreyGroup | null {
  let best: PreyGroup | null = null;
  for (const group of zoneGroups(x, z)) {
    if (!best || group.dist < best.dist || (group.dist === best.dist && group.name.localeCompare(best.name) < 0)) best = group;
  }
  return best;
}

/** The camp under the player. Towns, instances, and any screen but the field refuse. */
export function campHere(screen: string, x: number, z: number): { id: FarmZoneId; spot: FarmSpot } | null {
  if (screen !== "battle") return null;
  const name = regionName(x, z);
  const kind = regionKind(name);
  if (kind === "town" || kind === "instance") return null;
  if (name === "Ranguemont Pass") {
    const id = nearestPassCamp(x, z);
    const spot = PASS_SPOTS.find((row) => row.id === id) ?? campSpot(id);
    return { id, spot };
  }
  const id = zoneCampId(name);
  return { id, spot: weightedSpot(id, name, x, z) };
}

export function farmZoneAt(screen: string, x: number, z: number): FarmZoneId | null {
  return campHere(screen, x, z)?.id ?? null;
}

export function campRefusal(screen: string, x: number, z: number): string {
  void screen;
  const kind = regionKind(regionName(x, z));
  if (kind === "town" || kind === "instance") return "Towns and instances can't hold a camp.";
  return "You are not in a camp.";
}

export type AfkFarmSave = {
  active: true;
  startTimestamp: number;
  zoneId: FarmZoneId;
  farmingEfficiency: number;
  level: number;
  exp: number;
  job: string;
  treasureHunter: number;
  signetLeft: number;
  crystalBonus: boolean;
  dies: boolean;
  sustainMinutes: number;
  /** Experience camp is saved as exp. Notorious-monster camp is saved as nm. */
  mode: CampMode;
  /** Species the player chose. An older camp omits this and hunts the nearest group. */
  groupId?: string;
  groupName?: string;
  groupFamily?: string;
  note: string;
  fovActive: boolean;
  fovPage: number;
  /** Missing on an older camp. That camp was West. */
  fovBook?: "west" | "east";
  fovCounts: number[];
  fovRepeat: boolean;
  fovPaidDays: Partial<Record<number, string>>;
  fovTabs: number;
  /** Prey standing near the player when the camp started. On an NM camp this is the placeholder or filler, not the NM. */
  preyLevel?: number;
  preyHp?: number;
  preyWeapon?: number;
  preyDelay?: number;
  preyDrops?: FarmDrop[];
  /** Filler species on an NM camp. Absent on an experience camp. */
  fillerId?: string;
  fillerName?: string;
  /** False when measureFarm says the NM fight is lost. */
  nmCanKill?: boolean;
  /** Expected NM kills per hour, frozen when the camp started. */
  nmPerHour?: number;
};

export type AfkPreview = {
  elapsedMinutes: number;
  remainingMinutes: number;
  kills: number;
  exp: number;
  level: number;
  pool: number;
  gil: number;
  tabs: number;
  items: Record<string, number>;
  crystals: number;
  rankPoints: number;
  conquestPoints: number;
  note: string;
  fov: FovState | null;
  preyName: string;
  preyLevel: number;
  /** True only when this preview ran the NM camp. */
  nm: boolean;
  /** Placeholder or filler kills. On an experience camp this matches kills. */
  phKills: number;
  nmPops: number;
  nmKills: number;
  nmItems: Record<string, number>;
  fillerName: string;
  fillerId: string;
  /** True when the NM has a placeholder. */
  placeholder: boolean;
  /** Expected NM kills per hour. */
  perHour: number;
};

const EMPTY_CLOCK: ChainClock = { count: 0, until: 0 };

type MeasureInput = {
  dmg: number;
  fstr: number;
  hit: number;
  delay: number;
  hp: number;
  defense: number;
  level: number;
  zoneId: FarmZoneId;
  gambitOn: boolean;
  hasWeaponskill: boolean;
  hasHeal: boolean;
  party: number;
  healer: boolean;
  preyLevel?: number;
  preyHp?: number;
  preyWeapon?: number;
  preyDelay?: number;
  preyName?: string;
};

const HEALER_TRUSTS = new Set(["kupipi", "curilla", "karaha-baruha", "sylvie", "nashmeira", "adelheid", "koru-moru"]);

export function partyHelps(ids: readonly string[] | undefined): { party: number; healer: boolean } {
  const list = ids ?? [];
  return {
    party: Math.min(5, list.length),
    healer: list.some((id) => HEALER_TRUSTS.has(id)),
  };
}

/** Kills per minute from the live sheet, the open gambit board, and who is summoned. */
export function measureFarm(input: MeasureInput): { kpm: number; dies: boolean; sustainMinutes: number; note: string } {
  const region = regionForZone(input.zoneId);
  const centre = region ? REGION_CENTRE[region] : undefined;
  const near = centre && regionName(centre.x, centre.z) === region ? nearestGroup(centre.x, centre.z) : null;
  const prey = input.preyHp != null && input.preyLevel != null
    ? {
        level: input.preyLevel,
        hpNatural: input.preyHp,
        weaponDamage: input.preyWeapon ?? near?.weaponDamage ?? 1,
        delay: input.preyDelay ?? near?.delay ?? 240,
        name: input.preyName ?? near?.name ?? "the prey",
      }
    : near
      ? { level: near.level, hpNatural: near.hpNatural, weaponDamage: near.weaponDamage, delay: near.delay, name: near.name }
      : null;
  if (!prey) return { kpm: 0, dies: false, sustainMinutes: MAX_AFK_HOURS * 60, note: "Nothing is camped here." };
  const delay = Math.max(60, input.delay || 240);
  const swingSec = delay / 60;
  const perHit = Math.max(1, Math.floor((Math.max(0, input.dmg) + input.fstr) * 1.2));
  const hit = Math.max(0.05, Math.min(0.95, input.hit / 100));
  let dps = (perHit * hit) / swingSec;
  if (input.gambitOn && input.hasWeaponskill) dps += (perHit * 3) / 20;
  dps += Math.min(5, Math.max(0, input.party)) * 12;
  if (!input.gambitOn) dps *= 0.9;
  const travel = 7;
  const ttk = prey.hpNatural / Math.max(1, dps) + travel;
  let kpm = 60 / ttk;
  let note = "The prey is in your range.";
  const gap = input.level - prey.level;
  if (gap <= -20) {
    kpm *= 0.25;
    note = "Far under-leveled. Most of the camp is spent getting up.";
  } else if (gap < -5) {
    kpm *= 0.6;
    note = `Under-leveled for ${prey.name}.`;
  } else if (gap > 8) {
    note = "Over-leveled. The prey falls quickly and pays little.";
  }
  const preyHit = Math.max(1, prey.weaponDamage - Math.floor(input.defense / 8));
  const incoming = (preyHit * 0.65) / (prey.delay / 60);
  const kept = (input.gambitOn && input.hasHeal) || input.healer;
  const net = kept ? incoming * 0.2 : incoming;
  let dies = false;
  let sustainMinutes = MAX_AFK_HOURS * 60;
  if (!kept && input.hp > 0 && net > 0) {
    dies = true;
    sustainMinutes = Math.max(0.5, Math.round((input.hp / net / 60) * 10) / 10);
    note = "No one is healing you. Rewards stop when you fall.";
  }
  kpm = Math.max(0.05, Math.min(8, Math.round(kpm * 100) / 100));
  return { kpm, dies, sustainMinutes, note };
}

export function gambitShape(book: { on?: boolean; slots?: { action?: string }[] } | undefined): {
  on: boolean;
  weaponskill: boolean;
  heal: boolean;
  engage: boolean;
} {
  const slots = book?.slots ?? [];
  let weaponskill = false;
  let heal = false;
  let engage = false;
  for (const slot of slots) {
    const id = slot.action ?? "";
    if (!id) continue;
    if (id === "engage") engage = true;
    const action = findAction(id);
    if (action?.kind === "weaponskill") weaponskill = true;
    if (action?.kind === "spell" && /cure|curaga|raise|regen/i.test(action.name)) heal = true;
    if (/waltz|benediction|heal/i.test(id)) heal = true;
  }
  return { on: book?.on === true, weaponskill, heal, engage };
}

function unit(seed: number): number {
  let x = Math.imul(seed | 0, 0x6d2b79f5);
  x = Math.imul(x ^ (x >>> 15), x | 1);
  x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
  return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
}

export function elapsedMinutes(startTimestamp: number, now: number, capMinutes: number): number {
  const raw = Math.max(0, (now - startTimestamp) / 60000);
  return Math.min(raw, Math.max(0, capMinutes), MAX_AFK_HOURS * 60);
}

type ResolvedPrey = { name: string; level: number; hpNatural: number; drops: readonly FarmDrop[] };

/** A saved group with a prey snapshot stays put. Anything older hunts the nearest group where that camp stands. */
function resolvedPrey(session: AfkFarmSave, stand?: { x: number; z: number }): ResolvedPrey | null {
  if (session.groupId && session.preyLevel != null && session.preyHp != null) {
    return {
      name: session.groupName && session.groupName.length > 0 ? session.groupName : session.groupId,
      level: session.preyLevel,
      hpNatural: session.preyHp,
      drops: session.preyDrops ?? [],
    };
  }
  const region = regionForZone(session.zoneId);
  if (!region) return null;
  const stood = stand && regionName(stand.x, stand.z) === region ? stand : null;
  const centre = REGION_CENTRE[region];
  const at = stood ?? (centre && regionName(centre.x, centre.z) === region ? centre : null);
  if (!at) return null;
  const picked = session.groupId ? zoneGroups(at.x, at.z).find((group) => group.id === session.groupId) : undefined;
  const group = picked ?? nearestGroup(at.x, at.z);
  if (!group) return null;
  return { name: group.name, level: group.level, hpNatural: group.hpNatural, drops: group.drops };
}

type Bag = {
  level: number;
  pool: number;
  gained: number;
  gil: number;
  tabs: number;
  rankPoints: number;
  conquestPoints: number;
  crystals: number;
  items: Record<string, number>;
  clock: ChainClock;
  fov: FovState | null;
};

function emptyBag(session: AfkFarmSave): Bag {
  return {
    level: Math.max(1, Math.floor(session.level)),
    pool: Math.max(0, Math.floor(session.exp)),
    gained: 0,
    gil: 0,
    tabs: 0,
    rankPoints: 0,
    conquestPoints: 0,
    crystals: 0,
    items: {},
    clock: EMPTY_CLOCK,
    fov: session.fovActive
      ? {
          active: true,
          page: session.fovPage,
          book: session.fovBook === "east" ? "east" : "west",
          counts: session.fovCounts.slice(),
          repeat: session.fovRepeat,
          tabs: session.fovTabs,
          paidDays: { ...session.fovPaidDays },
        }
      : null,
  };
}

/** One placeholder or filler kill. Experience and the tier table both follow the live camp. */
function settleCampKill(session: AfkFarmSave, bag: Bag, prey: ResolvedPrey, at: number, salt: number): void {
  const kill = settleKill(bag.level, prey.level, bag.pool, at, bag.clock);
  bag.clock = kill.clock;
  bag.level = kill.level;
  bag.pool = kill.exp;
  bag.gained += kill.gained;
  const signed = session.signetLeft > 0 && at - session.startTimestamp <= session.signetLeft * 1000;
  if (signed && kill.gained > 0) {
    const cut = pointsFromExp(kill.gained, "battle");
    bag.rankPoints += cut;
    bag.conquestPoints += cut;
    const chance = session.crystalBonus ? crystalChance("kingdom-aketon") : crystalChance(null);
    if (unit(session.startTimestamp + salt) < chance) bag.crystals += 1;
  }
  for (const drop of prey.drops) {
    if (unit(session.startTimestamp + salt * 3 + drop.id.length * 13) >= dropRate(drop.tier, session.treasureHunter)) continue;
    bag.items[drop.id] = (bag.items[drop.id] ?? 0) + 1;
  }
}

function previewShell(session: AfkFarmSave, now: number, minutes: number, prey: ResolvedPrey | null, bag: Bag, kills: number, extra: Partial<AfkPreview> = {}): AfkPreview {
  return {
    elapsedMinutes: Math.round(minutes * 10) / 10,
    remainingMinutes: Math.max(0, Math.round((MAX_AFK_HOURS * 60 - Math.min(MAX_AFK_HOURS * 60, (now - session.startTimestamp) / 60000)) * 10) / 10),
    kills,
    exp: bag.gained,
    level: bag.level,
    pool: bag.pool,
    gil: bag.gil,
    tabs: bag.tabs,
    items: bag.items,
    crystals: bag.crystals,
    rankPoints: bag.rankPoints,
    conquestPoints: bag.conquestPoints,
    note: session.note,
    fov: bag.fov,
    preyName: prey?.name ?? "",
    preyLevel: prey?.level ?? 0,
    nm: false,
    phKills: kills,
    nmPops: 0,
    nmKills: 0,
    nmItems: {},
    fillerName: "",
    fillerId: "",
    placeholder: false,
    perHour: 0,
    ...extra,
  };
}

/**
 * Lottery: the window starts shut. Placeholder kills during the cooldown do not roll.
 * After it opens, each kill rolls the pop chance. A pop restarts the window.
 * Timed: the NM pops on the window whether or not the filler is being killed.
 * A fight measureFarm would lose still counts as a pop and yields no kill.
 */
function previewNm(session: AfkFarmSave, now: number, stand?: { x: number; z: number }): AfkPreview | null {
  const model = session.groupId ? nmCampModel(session.groupId) : null;
  if (!model || session.mode !== "nm") return null;
  const region = regionForZone(session.zoneId);
  const stood = stand && region && regionName(stand.x, stand.z) === region ? stand : null;
  const centre = region ? REGION_CENTRE[region] : undefined;
  const at = stood ?? (centre && region && regionName(centre.x, centre.z) === region ? centre : null);
  const filler = session.fillerId && session.preyLevel != null && session.preyHp != null
    ? {
        name: session.fillerName && session.fillerName.length > 0 ? session.fillerName : session.fillerId,
        level: session.preyLevel,
        hpNatural: session.preyHp,
        drops: session.preyDrops ?? [],
      }
    : at
      ? (() => {
          const group = nmFiller(model.nm, at.x, at.z);
          return group ? { name: group.name, level: group.level, hpNatural: group.hpNatural, drops: group.drops } : null;
        })()
      : null;
  const nmFarm = speciesFarm(model.nm);
  const nmPrey: ResolvedPrey = { name: nmFarm.name, level: nmFarm.level, hpNatural: nmFarm.hpNatural, drops: [] };
  const cap = session.dies ? Math.min(session.sustainMinutes, MAX_AFK_HOURS * 60) : MAX_AFK_HOURS * 60;
  const minutes = elapsedMinutes(session.startTimestamp, now, cap);
  const bag = emptyBag(session);
  const kpm = Math.max(0.05, session.farmingEfficiency);
  const canKill = session.nmCanKill !== false;
  let phKills = 0;
  let nmPops = 0;
  let nmKills = 0;
  const nmItems: Record<string, number> = {};
  if (model.ph) {
    const openAt0 = model.cooldown / 60;
    let openAt = openAt0;
    const count = filler ? Math.floor(kpm * minutes) : 0;
    for (let i = 0; i < count; i += 1) {
      const t = (i + 1) / kpm;
      if (t > minutes) break;
      phKills += 1;
      if (filler) settleCampKill(session, bag, filler, session.startTimestamp + t * 60000, i * 17 + 3);
      if (t <= openAt) continue;
      if (unit(session.startTimestamp + i * 97 + 11) >= model.popChance) continue;
      nmPops += 1;
      if (canKill) {
        nmKills += 1;
        const fight = 1 / Math.max(0.05, kpm);
        takeNmItems(session, model.nm, nmKills, nmItems);
        openAt = t + fight + model.cooldown / 60;
      } else {
        openAt = t + model.cooldown / 60;
      }
    }
  } else {
    const count = filler ? Math.floor(kpm * minutes) : 0;
    for (let i = 0; i < count; i += 1) {
      const t = (i + 1) / kpm;
      if (t > minutes) break;
      phKills += 1;
      if (filler) settleCampKill(session, bag, filler, session.startTimestamp + t * 60000, i * 17 + 3);
    }
    nmPops = Math.floor(minutes / (model.cooldown / 60));
    if (canKill) {
      nmKills = nmPops;
      for (let n = 1; n <= nmKills; n += 1) takeNmItems(session, model.nm, n, nmItems);
    }
  }
  const note = !canKill && nmPops > 0 ? `The ${nmFarm.name} was too strong.` : session.note;
  return previewShell(session, now, minutes, nmPrey, bag, phKills, {
    note,
    preyName: nmFarm.name,
    preyLevel: nmFarm.level,
    nm: true,
    phKills,
    nmPops,
    nmKills,
    nmItems,
    fillerName: filler?.name ?? session.fillerName ?? "",
    fillerId: session.fillerId ?? model.ph ?? "",
    placeholder: model.ph != null,
    perHour: session.nmPerHour ?? 0,
  });
}

function itemSalt(id: string): number {
  let n = 0;
  for (let i = 0; i < id.length; i += 1) n = (n + id.charCodeAt(i) * (i + 1)) % 997;
  return n;
}

/** Seeded draws for one NM's drop table. The same kill always yields the same pile. */
function nmRng(seed: number): () => number {
  let n = 0;
  return () => {
    n += 1;
    return unit(seed + n * 0x9e3779b1);
  };
}

function takeNmItems(session: AfkFarmSave, nmId: string, kill: number, into: Record<string, number>): void {
  const rng = nmRng(session.startTimestamp + kill * 131 + itemSalt(nmId));
  for (const item of rollSpeciesItems(nmId, session.treasureHunter, rng)) {
    into[item.id] = (into[item.id] ?? 0) + 1;
  }
}

export function previewAfk(session: AfkFarmSave, now = Date.now(), stand?: { x: number; z: number }): AfkPreview {
  const nmPreview = previewNm(session, now, stand);
  if (nmPreview) return nmPreview;
  const prey = resolvedPrey(session, stand);
  const cap = session.dies ? Math.min(session.sustainMinutes, MAX_AFK_HOURS * 60) : MAX_AFK_HOURS * 60;
  const minutes = elapsedMinutes(session.startTimestamp, now, cap);
  const kills = prey ? Math.floor(session.farmingEfficiency * minutes) : 0;
  const bag = emptyBag(session);
  for (let i = 0; i < kills; i += 1) {
    if (!prey) break;
    const at = session.startTimestamp + ((i + 1) / Math.max(0.05, session.farmingEfficiency)) * 60000;
    settleCampKill(session, bag, prey, at, i * 17 + 3);
  }
  return previewShell(session, now, minutes, prey, bag, kills);
}

export function assertAfk(): void {
  if (MAX_AFK_HOURS !== 12) throw new Error("afk cap");
  const modes: CampMode[] = ["exp", "nm"];
  if (modes.join(",") !== "exp,nm") throw new Error("camp mode");
  if (farmZoneAt("town", 0, 0) !== null || farmZoneAt("gambits", 0, 40) !== null) throw new Error("town is not a camp");
  if (farmZoneAt("battle", 0, 0) !== null) throw new Error("pen camp");
  if (zoneGroups(0, 0).length !== 0) throw new Error("town listed prey");
  if (!REGION_KIND["San d'Oria"]) throw new Error("missing kind San d'Oria");
  const westAt = REGION_CENTRE["West Ronfaure"];
  if (farmZoneAt("menu", westAt.x, westAt.z) !== null) throw new Error("camp off the field");
  const shut = new Set(["La Theine Plateau", "Carpenters' Landing", "Jugner Forest", "Batallia Downs", "Xarcabard", "Fei'Yin", "Pso'Xja"]);
  for (const [name, kind] of Object.entries(REGION_KIND)) {
    const centre = REGION_CENTRE[name];
    if (!centre) {
      if (shut.has(name)) {
        if (kind !== "field" && kind !== "dungeon") throw new Error(`${name} shut kind`);
        continue;
      }
      if (kind === "field" || kind === "dungeon") throw new Error(`${name} has no centre`);
      continue;
    }
    if (regionName(centre.x, centre.z) !== name) throw new Error(`${name} centre is ${regionName(centre.x, centre.z)}`);
    if (kind === "town" || kind === "instance") {
      if (farmZoneAt("battle", centre.x, centre.z) !== null) throw new Error(`${name} accepted a camp`);
      continue;
    }
    const id = farmZoneAt("battle", centre.x, centre.z);
    if (!id) throw new Error(`${name} has no camp`);
    const raw = id as string;
    if (raw === "west-ronfaure" || raw === "ronfaure-forest") throw new Error(`${name} kept a town camp`);
    if (spotById(id).prey === "Tropical Rarab") throw new Error(`${name} camped a rarab`);
  }
  const offered = farmSpots();
  if (!offered.some((spot) => spot.region === "West Ronfaure")) throw new Error("west was not offered");
  for (const spot of offered) {
    const kind = regionKind(spot.region);
    const raw = spot.id as string;
    if (kind === "town" || kind === "instance") throw new Error(`${spot.region} was offered`);
    if (spot.prey === "Tropical Rarab" || raw === "west-ronfaure" || raw === "ronfaure-forest") throw new Error(`${spot.id} offered a rarab`);
  }
  if (knownFarmId("west-ronfaure") || knownFarmId("ronfaure-forest") || knownFarmId("not-a-camp")) throw new Error("legacy camp still live");
  if (campZoneFromSave("west-ronfaure") !== "ronfaure-west" || campZoneFromSave("ronfaure-forest") !== "ronfaure-west") throw new Error("legacy camp did not move");
  if (campZoneFromSave("not-a-camp") !== null) throw new Error("unknown camp loaded");
  const west = farmZoneAt("battle", westAt.x, westAt.z);
  if (west !== "ronfaure-west") throw new Error("west ronfaure camp");
  const ice = REGION_CENTRE["Beaucedine Glacier"];
  if (!farmZoneAt("battle", ice.x, ice.z) || zoneGroups(ice.x, ice.z).length !== 0 || nearestGroup(ice.x, ice.z)) throw new Error("glacier invented prey");
  const westGroups = zoneGroups(westAt.x, westAt.z);
  if (westGroups.length < 2) throw new Error(`west groups ${westGroups.length}`);
  if (new Set(westGroups.map((group) => group.family)).size < 2) throw new Error("west families");
  const near = nearestGroup(westAt.x, westAt.z);
  if (!near) throw new Error("west nearest");
  let best = westGroups[0]!;
  for (const group of westGroups) {
    if (group.dist < best.dist || (group.dist === best.dist && group.name.localeCompare(best.name) < 0)) best = group;
  }
  if (near.id !== best.id) throw new Error(`nearest group ${near.id}`);
  const hareGroup = westGroups.find((group) => group.id === "forest-hare");
  const hare = speciesFarm("forest-hare");
  if (!hareGroup || hare.level !== 1 || !hareGroup.drops.some((drop) => drop.id === "hare-meat")) throw new Error("hare meat left the forest");
  if (checkRating(75, hare.level) !== "Too Weak") throw new Error("hare is not too weak");
  const f10 = gridToWorld(5.35, 9.4);
  if (passSquare(f10.x, f10.z) !== "F-10") throw new Error("F-10 stand");
  const f10Camp = farmZoneAt("battle", f10.x, f10.z);
  if (f10Camp !== "pass-mouth" && f10Camp !== "pass-early") throw new Error(`F-10 camp ${f10Camp}`);
  const fit = measureFarm({
    dmg: 40, fstr: 8, hit: 80, delay: 240, hp: 1400, defense: 200, level: hare.level,
    zoneId: "ronfaure-west", gambitOn: true, hasWeaponskill: true, hasHeal: true, party: 4, healer: true,
    preyLevel: hare.level, preyHp: hare.hpNatural, preyWeapon: hare.weaponDamage, preyDelay: hare.delay, preyName: hare.name,
  });
  if (fit.kpm < 0.4 || fit.kpm > 8 || fit.dies) throw new Error("healthy camp");
  const frail = measureFarm({
    dmg: 6, fstr: 0, hit: 40, delay: 480, hp: 80, defense: 10, level: 10,
    zoneId: "ronfaure-west", gambitOn: false, hasWeaponskill: false, hasHeal: false, party: 0, healer: false,
    preyLevel: hare.level, preyHp: hare.hpNatural, preyWeapon: hare.weaponDamage, preyDelay: hare.delay, preyName: hare.name,
  });
  if (!frail.dies || frail.sustainMinutes >= MAX_AFK_HOURS * 60) throw new Error("frail camp falls");
  const start = 1_700_000_000_000;
  const hourMs = 60 * 60 * 1000;
  function sessionFor(group: PreyGroup, level: number, zoneId: FarmZoneId = "ronfaure-west"): AfkFarmSave {
    return {
      active: true,
      startTimestamp: start,
      zoneId,
      mode: "exp",
      groupId: group.id,
      groupName: group.name,
      groupFamily: group.family,
      farmingEfficiency: 1,
      level,
      exp: 0,
      job: "SAM",
      treasureHunter: 0,
      signetLeft: 0,
      crystalBonus: false,
      dies: false,
      sustainMinutes: MAX_AFK_HOURS * 60,
      note: "",
      fovActive: false,
      fovPage: 0,
      fovCounts: [],
      fovRepeat: false,
      fovPaidDays: {},
      fovTabs: 0,
      preyLevel: group.level,
      preyHp: group.hpNatural,
      preyWeapon: group.weaponDamage,
      preyDelay: group.delay,
      preyDrops: group.drops,
    };
  }
  const even = sessionFor(near, near.level);
  const hour = previewAfk(even, start + hourMs);
  const again = previewAfk(even, start + hourMs);
  if (hour.kills !== 60 || hour.exp <= 0) throw new Error("hour of kills");
  if (JSON.stringify(hour.items) !== JSON.stringify(again.items)) throw new Error("camp is stable");
  const allowedNear = new Set(near.drops.map((drop) => drop.id));
  for (const id of Object.keys(hour.items)) {
    if (!allowedNear.has(id)) throw new Error(`near foreign drop ${id}`);
  }
  const capped = previewAfk(even, start + 20 * hourMs);
  if (capped.kills !== MAX_AFK_HOURS * 60) throw new Error("twelve hour cap");
  const fallen = previewAfk({ ...even, dies: true, sustainMinutes: 10, farmingEfficiency: 2 }, start + hourMs);
  if (fallen.kills !== 20) throw new Error("death stops the camp");
  const weak = previewAfk(sessionFor(hareGroup, 75), start + hourMs);
  if (weak.kills !== 60 || weak.exp !== 0 || weak.gil !== 0) throw new Error("too weak still paid");
  const picked = westGroups.find((group) => group.id !== near.id) ?? near;
  const pickedHour = previewAfk(sessionFor(picked, picked.level), start + hourMs, { x: 0, z: 0 });
  if (pickedHour.exp <= 0 || pickedHour.preyName !== picked.name) throw new Error("picked group");
  const allowedPick = new Set(picked.drops.map((drop) => drop.id));
  for (const id of Object.keys(pickedHour.items)) {
    if (!allowedPick.has(id)) throw new Error(`picked foreign drop ${id}`);
  }
  const blended = previewAfk({
    ...even,
    groupId: undefined,
    groupName: undefined,
    groupFamily: undefined,
    preyLevel: 70,
    preyHp: 9000,
    preyDrops: [{ id: "not-a-drop", found: "fake", tier: "common" }],
    level: near.level,
  }, start + hourMs, westAt);
  if (blended.preyName !== near.name || blended.items["not-a-drop"] || blended.kills !== 60) throw new Error("old blend did not take the nearest group");
  const asNm = previewAfk({ ...even, mode: "nm" }, start + hourMs);
  if (asNm.exp !== hour.exp || asNm.kills !== hour.kills || asNm.nm) throw new Error("nm mode still camps for exp");
  const passAt = gridToWorld(6.25, 6.75);
  const passNms = zoneNms(passAt.x, passAt.z);
  const hyaku = passNms.find((row) => row.id === "pass-hyakume");
  if (!hyaku || hyaku.phId !== "pass-hecteyes" || !hyaku.phName) throw new Error("hyakume row");
  if (!passNms.some((row) => row.id === "pass-gloom") || !passNms.some((row) => row.id === "pass-taisaijin")) throw new Error("lottery nm missing");
  if (passNms.some((row) => row.id === "pass-hyakume" && zoneGroups(passAt.x, passAt.z).some((group) => group.id === "pass-hyakume"))) throw new Error("hyakume was placed");
  const hyakuModel = nmCampModel("pass-hyakume");
  if (!hyakuModel) throw new Error("hyakume model");
  const hyakuFiller = nmFiller("pass-hyakume", passAt.x, passAt.z);
  if (!hyakuFiller || hyakuFiller.id !== "pass-hecteyes") throw new Error("hyakume filler");
  const nmSession = (id: string, minutesDie = false): AfkFarmSave => {
    const model = nmCampModel(id);
    const filler = nmFiller(id, passAt.x, passAt.z);
    const card = speciesFarm(id);
    if (!model || !filler) throw new Error(`nm session ${id}`);
    return {
      active: true,
      startTimestamp: start,
      zoneId: "pass-deep",
      mode: "nm",
      groupId: id,
      groupName: card.name,
      groupFamily: card.family,
      farmingEfficiency: 2,
      level: card.level,
      exp: 0,
      job: "SAM",
      treasureHunter: 0,
      signetLeft: 0,
      crystalBonus: false,
      dies: minutesDie,
      sustainMinutes: MAX_AFK_HOURS * 60,
      note: "",
      fovActive: false,
      fovPage: 0,
      fovCounts: [],
      fovRepeat: false,
      fovPaidDays: {},
      fovTabs: 0,
      preyLevel: filler.level,
      preyHp: filler.hpNatural,
      preyWeapon: filler.weaponDamage,
      preyDelay: filler.delay,
      preyDrops: filler.drops,
      fillerId: filler.id,
      fillerName: filler.name,
      nmCanKill: true,
      nmPerHour: nmPace(2, 2, model, true),
    };
  };
  const firstHalf = previewAfk(nmSession("pass-hyakume"), start + 30 * 60 * 1000, passAt);
  if (firstHalf.nmPops !== 0 || !firstHalf.nm || firstHalf.phKills <= 0) throw new Error("nm popped inside the window");
  const longNm = previewAfk(nmSession("pass-hyakume"), start + MAX_AFK_HOURS * hourMs, passAt);
  const longAgain = previewAfk(nmSession("pass-hyakume"), start + MAX_AFK_HOURS * hourMs, passAt);
  if (longNm.nmKills <= 0 || longNm.nmKills > 24) throw new Error(`twelve hour nm kills ${longNm.nmKills}`);
  if (JSON.stringify(longNm.nmItems) !== JSON.stringify(longAgain.nmItems) || longNm.nmKills !== longAgain.nmKills) throw new Error("nm camp is not stable");
  const lost = previewAfk({ ...nmSession("pass-hyakume"), nmCanKill: false }, start + MAX_AFK_HOURS * hourMs, passAt);
  if (lost.nmKills !== 0 || lost.nmPops <= 0 || !lost.note.includes("too strong")) throw new Error("lost nm still died");
  const mucoidCard = passNms.find((row) => row.id === "pass-mucoid");
  const mucoidBody = placedBodies().find((body) => body.species === "pass-mucoid");
  if (!mucoidCard || mucoidCard.phId || !mucoidBody) throw new Error("mucoid row");
  const mucoidFill = nmFiller("pass-mucoid", mucoidBody.x, mucoidBody.z);
  if (!mucoidFill || mucoidFill.id !== "pass-ooze" || mucoidFill.name !== "Ooze") throw new Error(`mucoid filler ${mucoidFill?.id}`);
  const mucoid = previewAfk({ ...nmSession("pass-mucoid"), fillerId: mucoidFill.id, fillerName: mucoidFill.name, preyLevel: mucoidFill.level, preyHp: mucoidFill.hpNatural, preyDrops: mucoidFill.drops }, start + MAX_AFK_HOURS * hourMs, { x: mucoidBody.x, z: mucoidBody.z });
  if (mucoid.fillerId !== "pass-ooze" && mucoid.fillerName !== "Ooze") throw new Error("mucoid claim filler");
  if (mucoid.nmPops !== Math.floor((MAX_AFK_HOURS * 60) / 30) || mucoid.nmKills !== mucoid.nmPops) throw new Error(`mucoid pops ${mucoid.nmPops}`);
  const mucoidShort = previewAfk(nmSession("pass-mucoid"), start + 15 * 60 * 1000, { x: mucoidBody.x, z: mucoidBody.z });
  if (mucoidShort.nmPops !== 0) throw new Error("mucoid popped early");
  if (zoneNms(ice.x, ice.z).length !== 0 || NO_NM !== "No notorious monsters here.") throw new Error("glacier invented an nm");
  if (farmZoneAt("battle", 0, 0) !== null || zoneNms(0, 0).length !== 0) throw new Error("town accepted an nm camp");
  for (const camp of PASS_CAMPS) {
    const node = PASS_GRAPH.nodes.find((row) => row.id === camp.node);
    if (!node) throw new Error(`camp node ${camp.node}`);
    const at = gridToWorld(node.gx, node.gy);
    if (!inPass(at.x, at.z, 0)) throw new Error(`${camp.id} is outside the pass`);
    if (farmZoneAt("battle", at.x, at.z) !== camp.id) throw new Error(`${camp.id} centre`);
    const group = nearestGroup(at.x, at.z);
    if (!group || group.drops.length === 0) throw new Error(`${camp.id} has no group`);
    const allowed = new Set(group.drops.map((drop) => drop.id));
    const campHour = previewAfk({
      ...sessionFor(group, group.level, camp.id),
      groupId: undefined,
      groupName: undefined,
      groupFamily: undefined,
      preyLevel: undefined,
      preyHp: undefined,
      preyDrops: undefined,
    }, start + hourMs, { x: at.x, z: at.z });
    if (campHour.kills <= 0 || campHour.preyName !== group.name) throw new Error(`${camp.id} kills`);
    for (const id of Object.keys(campHour.items)) {
      if (!allowed.has(id)) throw new Error(`${camp.id} foreign drop ${id}`);
    }
  }
}
