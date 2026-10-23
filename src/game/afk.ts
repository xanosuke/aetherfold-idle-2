/**
 * Offline camp. Elapsed time becomes kills against the monsters placed in
 * the zone the player is standing in. Towns and instances refuse. An old
 * Tropical Rarab camp still pays out once, then it is gone.
 */
import { HARE } from "./content";
import { RARAB_DROPS, dropRate, type DropTier } from "./drops";
import { EAST_STAND } from "./east-ronfaure";
import { settleKill, type ChainClock } from "./exp";
import { type FovState } from "./fov";
import { GLACIER_ARRIVE } from "./glacier";
import { ORC_ZONES } from "./ghelsba";
import { findAction } from "./hotbar";
import { inPass, passSquare } from "./pass";
import { nearestPassCamp, PASS_CAMPS, PASS_GRAPH, gridToWorld } from "./pass-graph";
import { placedBodies, speciesFarm } from "./ronfaure";
import { pointsFromExp, crystalChance } from "./signet";
import { TOMB_FOYER } from "./tomb";
import { FISHER, RON_SIZE, RON_X0, RON_Z0, regionName } from "./world";

/** Hours a camp will pay for. Raise this when the pace should run longer. */
export const MAX_AFK_HOURS = 12;

export const HARE_MEAT_GIL = 40;

export type ZoneKind = "town" | "instance" | "field" | "dungeon";

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
type LegacyFarmId = "west-ronfaure" | "ronfaure-forest";
export type FarmZoneId = LegacyFarmId | ZoneCampId | (typeof PASS_CAMPS)[number]["id"] | `zone-${string}`;

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

type PreyCard = { level: number; hpNatural: number; weaponDamage: number; delay: number; drops: readonly FarmDrop[] };

const RARAB_PREY: PreyCard = {
  level: HARE.level,
  hpNatural: HARE.hpNatural,
  weaponDamage: HARE.weaponDamage,
  delay: HARE.delay,
  drops: RARAB_DROPS,
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

export function knownFarmId(id: string): id is FarmZoneId {
  if (id === "west-ronfaure" || id === "ronfaure-forest") return true;
  if (PASS_CAMPS.some((camp) => camp.id === id)) return true;
  if ((Object.values(NAMED_CAMPS) as string[]).includes(id)) return true;
  return /^zone-[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id);
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

/** Old town camps. Not offered. A save that still names one pays the Rarab once. */
const LEGACY_SPOTS: FarmSpot[] = [
  { id: "west-ronfaure", name: "San d'Oria", region: "San d'Oria", levelMin: 70, levelMax: 75, prey: "Tropical Rarab", ...RARAB_PREY },
  { id: "ronfaure-forest", name: "Southern San d'Oria", region: "Southern San d'Oria", levelMin: 70, levelMax: 75, prey: "Tropical Rarab", ...RARAB_PREY },
];

/** Camps the panel may offer. Pass nodes, then one camp per walkable field or dungeon. No towns. */
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
  const legacy = LEGACY_SPOTS.find((spot) => spot.id === id);
  if (legacy) return legacy;
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

/** Legacy Rarab saves fall back. A field with no placed monsters does not. */
function preyOf(spot: FarmSpot): PreyCard | null {
  if (spot.id === "west-ronfaure" || spot.id === "ronfaure-forest") {
    return {
      level: spot.level ?? RARAB_PREY.level,
      hpNatural: spot.hpNatural ?? RARAB_PREY.hpNatural,
      weaponDamage: spot.weaponDamage ?? RARAB_PREY.weaponDamage,
      delay: spot.delay ?? RARAB_PREY.delay,
      drops: spot.drops ?? RARAB_PREY.drops,
    };
  }
  if (spot.level == null || spot.hpNatural == null) return null;
  return {
    level: spot.level,
    hpNatural: spot.hpNatural,
    weaponDamage: spot.weaponDamage ?? 1,
    delay: spot.delay ?? 240,
    drops: spot.drops ?? [],
  };
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
  sellMeat: boolean;
  note: string;
  fovActive: boolean;
  fovPage: number;
  /** Missing on an older camp. That camp was West. */
  fovBook?: "west" | "east";
  fovCounts: number[];
  fovRepeat: boolean;
  fovPaidDays: Partial<Record<number, string>>;
  fovTabs: number;
  /** Prey standing near the player when the camp started. Old saves omit this. */
  preyLevel?: number;
  preyHp?: number;
  preyWeapon?: number;
  preyDelay?: number;
  preyDrops?: FarmDrop[];
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
  soldMeat: number;
  crystals: number;
  rankPoints: number;
  conquestPoints: number;
  note: string;
  fov: FovState | null;
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
  const spot = spotById(input.zoneId);
  const card = preyOf(spot);
  const prey = input.preyHp != null && input.preyLevel != null
    ? {
        level: input.preyLevel,
        hpNatural: input.preyHp,
        weaponDamage: input.preyWeapon ?? card?.weaponDamage ?? 1,
        delay: input.preyDelay ?? card?.delay ?? 240,
        drops: card?.drops ?? [],
      }
    : card;
  if (!prey) return { kpm: 0, dies: false, sustainMinutes: MAX_AFK_HOURS * 60, note: "Nothing is camped here." };
  const delay = Math.max(60, input.delay || 240);
  const swingSec = delay / 60;
  const perHit = Math.max(1, Math.floor((Math.max(0, input.dmg) + input.fstr) * 1.2));
  const hit = Math.max(0.05, Math.min(0.95, input.hit / 100));
  let dps = (perHit * hit) / swingSec;
  if (input.gambitOn && input.hasWeaponskill) dps += (perHit * 3) / 20;
  dps += Math.min(5, Math.max(0, input.party)) * 12;
  if (!input.gambitOn) dps *= 0.9;
  const travel = input.zoneId === "ronfaure-forest" ? 12 : 7;
  const ttk = prey.hpNatural / Math.max(1, dps) + travel;
  let kpm = 60 / ttk;
  let note = "The prey is in your range.";
  const gap = input.level - prey.level;
  if (gap <= -20) {
    kpm *= 0.25;
    note = "Far under-leveled. Most of the camp is spent getting up.";
  } else if (gap < -5) {
    kpm *= 0.6;
    note = `Under-leveled for ${input.preyName ?? spot.prey}.`;
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

export function previewAfk(session: AfkFarmSave, now = Date.now()): AfkPreview {
  const spot = spotById(session.zoneId);
  const base = preyOf(spot);
  const prey = session.preyLevel != null && session.preyHp != null
    ? {
        level: session.preyLevel,
        hpNatural: session.preyHp,
        weaponDamage: session.preyWeapon ?? base?.weaponDamage ?? 1,
        delay: session.preyDelay ?? base?.delay ?? 240,
        drops: session.preyDrops ?? base?.drops ?? [],
      }
    : base;
  const cap = session.dies ? Math.min(session.sustainMinutes, MAX_AFK_HOURS * 60) : MAX_AFK_HOURS * 60;
  const minutes = elapsedMinutes(session.startTimestamp, now, cap);
  const kills = prey ? Math.floor(session.farmingEfficiency * minutes) : 0;
  let level = Math.max(1, Math.floor(session.level));
  let pool = Math.max(0, Math.floor(session.exp));
  let gained = 0;
  let clock: ChainClock = EMPTY_CLOCK;
  let gil = 0;
  let tabs = 0;
  let rankPoints = 0;
  let conquestPoints = 0;
  let crystals = 0;
  let soldMeat = 0;
  const items: Record<string, number> = {};
  const fov: FovState | null = session.fovActive
    ? {
        active: true,
        page: session.fovPage,
        book: session.fovBook === "east" ? "east" : "west",
        counts: session.fovCounts.slice(),
        repeat: session.fovRepeat,
        tabs: session.fovTabs,
        paidDays: { ...session.fovPaidDays },
      }
    : null;
  for (let i = 0; i < kills; i += 1) {
    if (!prey) break;
    const at = session.startTimestamp + ((i + 1) / Math.max(0.05, session.farmingEfficiency)) * 60000;
    const kill = settleKill(level, prey.level, pool, at, clock);
    clock = kill.clock;
    level = kill.level;
    pool = kill.exp;
    gained += kill.gained;
    const signed = session.signetLeft > 0 && at - session.startTimestamp <= session.signetLeft * 1000;
    if (signed && kill.gained > 0) {
      const cut = pointsFromExp(kill.gained, "battle");
      rankPoints += cut;
      conquestPoints += cut;
      const chance = session.crystalBonus ? crystalChance("kingdom-aketon") : crystalChance(null);
      if (unit(session.startTimestamp + i * 17 + 3) < chance) crystals += 1;
    }
    for (const drop of prey.drops) {
      if (unit(session.startTimestamp + i * 31 + drop.id.length * 13) >= dropRate(drop.tier, session.treasureHunter)) continue;
      if (drop.id === "hare-meat" && session.sellMeat) {
        soldMeat += 1;
        gil += HARE_MEAT_GIL;
        continue;
      }
      items[drop.id] = (items[drop.id] ?? 0) + 1;
    }
  }
  return {
    elapsedMinutes: Math.round(minutes * 10) / 10,
    remainingMinutes: Math.max(0, Math.round((MAX_AFK_HOURS * 60 - Math.min(MAX_AFK_HOURS * 60, (now - session.startTimestamp) / 60000)) * 10) / 10),
    kills,
    exp: gained,
    level,
    pool,
    gil,
    tabs,
    items,
    soldMeat,
    crystals,
    rankPoints,
    conquestPoints,
    note: session.note,
    fov,
  };
}

export function assertAfk(): void {
  if (MAX_AFK_HOURS !== 12) throw new Error("afk cap");
  if (farmZoneAt("town", 0, 0) !== null || farmZoneAt("gambits", 0, 40) !== null) throw new Error("town is not a camp");
  if (farmZoneAt("battle", 0, 0) !== null) throw new Error("pen camp");
  if (!REGION_KIND["San d'Oria"]) throw new Error("missing kind San d'Oria");
  const westAt = REGION_CENTRE["West Ronfaure"];
  if (farmZoneAt("menu", westAt.x, westAt.z) !== null) throw new Error("camp off the field");
  // Shut gates. They are fields on the map and have no interior, so there is no centre to stand in.
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
    if (id === "west-ronfaure" || id === "ronfaure-forest") throw new Error(`${name} kept a town camp`);
    if (spotById(id).prey === "Tropical Rarab") throw new Error(`${name} camped a rarab`);
  }
  const offered = farmSpots();
  if (!offered.some((spot) => spot.region === "West Ronfaure")) throw new Error("west was not offered");
  for (const spot of offered) {
    const kind = regionKind(spot.region);
    if (kind === "town" || kind === "instance") throw new Error(`${spot.region} was offered`);
    if (spot.prey === "Tropical Rarab" || spot.id === "west-ronfaure" || spot.id === "ronfaure-forest") throw new Error(`${spot.id} offered a rarab`);
  }
  if (!knownFarmId("west-ronfaure") || !knownFarmId("ronfaure-forest") || knownFarmId("not-a-camp")) throw new Error("old rarab save would not load");
  const west = farmZoneAt("battle", REGION_CENTRE["West Ronfaure"].x, REGION_CENTRE["West Ronfaure"].z);
  if (!west || west === "west-ronfaure" || west === "ronfaure-forest") throw new Error("west ronfaure camp");
  const f10 = gridToWorld(5.35, 9.4);
  if (passSquare(f10.x, f10.z) !== "F-10") throw new Error("F-10 stand");
  const f10Camp = farmZoneAt("battle", f10.x, f10.z);
  if (f10Camp !== "pass-mouth" && f10Camp !== "pass-early") throw new Error(`F-10 camp ${f10Camp}`);
  const fit = measureFarm({
    dmg: 40, fstr: 8, hit: 80, delay: 240, hp: 1400, defense: 200, level: 75,
    zoneId: "ronfaure-forest", gambitOn: true, hasWeaponskill: true, hasHeal: true, party: 4, healer: true,
  });
  if (fit.kpm < 0.4 || fit.kpm > 8 || fit.dies) throw new Error("healthy camp");
  const frail = measureFarm({
    dmg: 6, fstr: 0, hit: 40, delay: 480, hp: 80, defense: 10, level: 10,
    zoneId: "west-ronfaure", gambitOn: false, hasWeaponskill: false, hasHeal: false, party: 0, healer: false,
  });
  if (!frail.dies || frail.sustainMinutes >= MAX_AFK_HOURS * 60) throw new Error("frail camp falls");
  const start = 1_700_000_000_000;
  const session: AfkFarmSave = {
    active: true,
    startTimestamp: start,
    zoneId: "west-ronfaure",
    farmingEfficiency: 1,
    level: 75,
    exp: 0,
    job: "SAM",
    treasureHunter: 0,
    signetLeft: 0,
    crystalBonus: false,
    dies: false,
    sustainMinutes: MAX_AFK_HOURS * 60,
    sellMeat: true,
    note: "",
    fovActive: false,
    fovPage: 0,
    fovCounts: [],
    fovRepeat: false,
    fovPaidDays: {},
    fovTabs: 0,
  };
  const hour = previewAfk(session, start + 60 * 60 * 1000);
  const again = previewAfk(session, start + 60 * 60 * 1000);
  if (hour.kills !== 60 || hour.exp <= 0) throw new Error("hour of kills");
  if (hour.soldMeat !== again.soldMeat || JSON.stringify(hour.items) !== JSON.stringify(again.items)) throw new Error("camp is stable");
  if ((hour.items["hare-meat"] ?? 0) !== 0) throw new Error("meat was sold");
  const capped = previewAfk(session, start + 20 * 60 * 60 * 1000);
  if (capped.kills !== MAX_AFK_HOURS * 60) throw new Error("twelve hour cap");
  const fallen = previewAfk({ ...session, dies: true, sustainMinutes: 10, farmingEfficiency: 2 }, start + 60 * 60 * 1000);
  if (fallen.kills !== 20) throw new Error("death stops the camp");
  const faded = preyOf({ id: "west-ronfaure", name: "San d'Oria", region: "San d'Oria", levelMin: 70, levelMax: 75, prey: "Tropical Rarab" });
  if (!faded || faded.level !== HARE.level || faded.hpNatural !== HARE.hpNatural || faded.weaponDamage !== HARE.weaponDamage || faded.delay !== HARE.delay || faded.drops !== RARAB_DROPS) {
    throw new Error("old rarab save still pays the rarab");
  }
  const bareField = preyOf({ id: "ronfaure-west", name: "West Ronfaure", region: "West Ronfaure", levelMin: 1, levelMax: 1, prey: "Goblin Thug" });
  if (bareField) throw new Error("a field fell back to the rarab");
  for (const camp of PASS_CAMPS) {
    const node = PASS_GRAPH.nodes.find((row) => row.id === camp.node);
    if (!node) throw new Error(`camp node ${camp.node}`);
    const at = gridToWorld(node.gx, node.gy);
    if (!inPass(at.x, at.z, 0)) throw new Error(`${camp.id} is outside the pass`);
    if (farmZoneAt("battle", at.x, at.z) !== camp.id) throw new Error(`${camp.id} centre`);
    const spot = spotById(camp.id);
    const allowed = new Set((spot.drops ?? []).map((drop) => drop.id));
    if (!allowed.size) throw new Error(`${camp.id} has no drops`);
    const campHour = previewAfk(
      { ...session, zoneId: camp.id, sellMeat: false, level: 75, exp: 0, farmingEfficiency: 1, dies: false },
      start + 60 * 60 * 1000,
    );
    if (campHour.kills <= 0) throw new Error(`${camp.id} kills`);
    for (const id of Object.keys(campHour.items)) {
      if (!allowed.has(id)) throw new Error(`${camp.id} foreign drop ${id}`);
    }
  }
}
