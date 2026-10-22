/**
 * Party and trusts.
 *
 * A party holds 6. A raid party holds 18. Trusts fill the seats the
 * players do not. One adventurer leaves five trust seats. Another
 * adventurer takes one of those seats.
 *
 * Kupipi is the Windurst White Mage. Her battle level matches the
 * summoner, and her sheet is the same race and job grades a Tarutaru
 * White Mage uses here. The spells and abilities she may use stop
 * where the player's own job stops. A level-75 Warrior whose White
 * Mage is only 10 still calls a level-75 Kupipi, and she only knows
 * that level-10 White Mage list. A subjob is the same rule, then
 * cut again by the support-job level.
 */

import { DEFAULT_LOADOUT, ITEMS, LEVEL, derive, fitLoadout, type Loadout, type Sheet } from "./content";
import { gambitActionGroups, type GambitChoice } from "./gambits";
import { hotbarGroups } from "./hotbar";
import { PLAYABLE, jobSkill, subjobLevel } from "./jobs";
import { spellsKnown } from "./spells";
import type { JobId, RaceId } from "./stats";
import { JOB_NAME } from "./stats";
import { BLM_ABILITIES } from "./blm";
import { MNK_ABILITIES } from "./mnk";
import { RDM_ABILITIES } from "./rdm";
import { THF_ABILITIES } from "./thf";
import { SAM_ABILITIES } from "./sam";
import { RNG_ABILITIES } from "./rng";
import { PLD_ABILITIES } from "./pld";
import { NIN_ABILITIES } from "./nin";
import { BRD_ABILITIES } from "./brd";
import { DRK_ABILITIES } from "./drk";
import { DRG_ABILITIES } from "./drg";
import { SMN_ABILITIES } from "./smn";
import { BST_ABILITIES } from "./bst";
import { BLU_ABILITIES, blueSpellByName } from "./blu";
import { GEO_ABILITIES } from "./geo";
import { PUP_ABILITIES } from "./pup";
import { COR_ABILITIES } from "./cor";
import { DNC_ABILITIES } from "./dnc";
import { SCH_ABILITIES } from "./sch";
import { RUN_ABILITIES } from "./run";
import { WAR_ABILITIES } from "./war";
import { WHM_ABILITIES } from "./whm";
import {
  archeryByName,
  axeByName,
  clubByName,
  daggerByName,
  greatAxeByName,
  greatKatanaByName,
  greatSwordByName,
  handByName,
  katanaByName,
  marksmanshipByName,
  polearmByName,
  scytheByName,
  staffByName,
  swordByName,
} from "./weaponskills";

export const PARTY_MAX = 6;
export const RAID_MAX = 18;
export const KUPIPI_ID = "kupipi";

export type TrustProfile = {
  id: string;
  name: string;
  race: RaceId;
  raceName: string;
  job: JobId;
  jobName: string;
  home: string;
  /** Spoken when this trust is called. */
  line: string;
  /** Spoken when this trust is dismissed. */
  dismiss: string;
  /** Yard scale. Tarutaru stay the small size Kupipi already uses. */
  scale: number;
  gear: TrustGear;
};

/**
 * One iconic adventurer for each job.
 * The lines are the retail trust summon and dismiss, except Waoud.
 * No Blue Mage cipher exists. He is the Aht Urhgan mentor, and he
 * carries the spells set on the player's Blue Mage list.
 */
export const TRUSTS: readonly TrustProfile[] = [
  {
    id: KUPIPI_ID,
    name: "Kupipi",
    race: "tarutaru",
    raceName: "Tarutaru",
    job: "WHM",
    jobName: JOB_NAME.WHM,
    home: "Heavens Tower",
    line: "You can entrust everything to the meticulous Kupipi.",
    dismiss: "What a wonderful time I had!",
    scale: 0.72,
    gear: { main: "Club", off: "", range: "" },
  },
  {
    id: "koru-moru",
    name: "Koru-Moru",
    race: "tarutaru",
    raceName: "Tarutaru",
    job: "RDM",
    jobName: JOB_NAME.RDM,
    home: "Windurst Waters",
    line: "Hoo hoo hoo hoo! Can it wait? I'm making lunch for my diddly-daddly-dear Mojiji!",
    dismiss: "Wiggly-waggly-wonderful! I was just starting to get bored-areeno!",
    scale: 0.72,
    gear: { main: "Sword", off: "", range: "" },
  },
  {
    id: "shantotto",
    name: "Shantotto",
    race: "tarutaru",
    raceName: "Tarutaru",
    job: "BLM",
    jobName: JOB_NAME.BLM,
    home: "Windurst Walls",
    line: "It's far too late for your foes to make amends, and with me at your side, they'll meet untimely ends!",
    dismiss: "I am hardly amazed at how well I've done, but I have to admit--it's been fun!",
    scale: 0.72,
    gear: { main: "Staff", off: "", range: "" },
  },
  {
    id: "nanaa-mihgo",
    name: "Nanaa Mihgo",
    race: "mithra",
    raceName: "Mithra",
    job: "THF",
    jobName: JOB_NAME.THF,
    home: "Windurst Woods",
    line: "Looking to make a new frrriend, are we?",
    dismiss: "Now you know how dangerous it is to be a prrroductive member of society!",
    scale: 0.84,
    gear: { main: "Dagger", off: "", range: "" },
  },
  {
    id: "naji",
    name: "Naji",
    race: "hume",
    raceName: "Hume",
    job: "WAR",
    jobName: JOB_NAME.WAR,
    home: "Bastok Markets",
    line: "All right! Let me at 'em!",
    dismiss: "Just one more step on my road to glory!",
    scale: 0.94,
    gear: { main: "Axe", off: "", range: "" },
  },
  {
    id: "maat",
    name: "Maat",
    race: "hume",
    raceName: "Hume",
    job: "MNK",
    jobName: JOB_NAME.MNK,
    home: "Waughroon Shrine",
    line: "Hoho! Let me at 'em!",
    dismiss: "If you don't need me, then I'll go help someone else!",
    scale: 0.94,
    gear: { main: "Hand-to-Hand", off: "", range: "" },
  },
  {
    id: "curilla",
    name: "Curilla",
    race: "elvaan",
    raceName: "Elvaan",
    job: "PLD",
    jobName: JOB_NAME.PLD,
    home: "Chateau d'Oraguille",
    line: "Even the mightiest birds give their all when hunting the smallest of prey!",
    dismiss: "Was this...what it feels like to be on a rite of courtship?",
    scale: 1.04,
    gear: { main: "Sword", off: "Shield", range: "" },
  },
  {
    id: "semih-lafihna",
    name: "Semih Lafihna",
    race: "mithra",
    raceName: "Mithra",
    job: "RNG",
    jobName: JOB_NAME.RNG,
    home: "Heavens Tower",
    line: "I am Semih Lafihna of Windurst's Sibyl Guards!",
    dismiss: "Time will surely bring us together once more.",
    scale: 0.84,
    gear: { main: "Sword", off: "", range: "Archery" },
  },
  {
    id: "ayame",
    name: "Ayame",
    race: "mithra",
    raceName: "Mithra",
    job: "SAM",
    jobName: JOB_NAME.SAM,
    home: "Metalworks",
    line: "Refining one's technique requires one to be their own harshest critic.",
    dismiss: "Remember to hold your family close. They will be your rock in times of need.",
    scale: 0.84,
    gear: { main: "Great Katana", off: "", range: "" },
  },
  {
    id: "gessho",
    name: "Gessho",
    race: "hume",
    raceName: "Hume",
    job: "NIN",
    jobName: JOB_NAME.NIN,
    home: "Giddeus",
    line: "Blades up and ready for battle!",
    dismiss: "I must take my leave.",
    scale: 0.94,
    gear: { main: "Katana", off: "", range: "" },
  },
  {
    id: "shikaree-z",
    name: "Shikaree Z",
    race: "mithra",
    raceName: "Mithra",
    job: "DRG",
    jobName: JOB_NAME.DRG,
    home: "Tavnazian Safehold",
    line: "I shall hold your future in my hands...for now, at least.",
    dismiss: "Think of this not as a goodbye, but as a new beginning.",
    scale: 0.84,
    gear: { main: "Polearm", off: "", range: "" },
  },
  {
    id: "karaha-baruha",
    name: "Karaha-Baruha",
    race: "tarutaru",
    raceName: "Tarutaru",
    job: "SMN",
    jobName: JOB_NAME.SMN,
    home: "Full Moon Fountain",
    line: "A grand welcome...to all of you.",
    dismiss: "I hope that the people of Windurst are able to rest easy at night.",
    scale: 0.72,
    gear: { main: "Staff", off: "", range: "" },
  },
  {
    id: "ulmia",
    name: "Ulmia",
    race: "hume",
    raceName: "Hume",
    job: "BRD",
    jobName: JOB_NAME.BRD,
    home: "Tavnazian Safehold",
    line: "No matter how many times the flames of oblivion flare up and threaten to consume civilization, people will always find a way to survive.",
    dismiss: "I want to continue to sing songs about the world. Surely you, of all people, understand why.",
    scale: 0.94,
    gear: { main: "Dagger", off: "", range: "" },
  },
  {
    id: "lilisette",
    name: "Lilisette",
    race: "hume",
    raceName: "Hume",
    job: "DNC",
    jobName: JOB_NAME.DNC,
    home: "Jeuno",
    line: "Be thankful to meet your end at the hands of Lilisette!",
    dismiss: "The future is ours to decide!",
    scale: 0.94,
    gear: { main: "Dagger", off: "", range: "" },
  },
  {
    id: "adelheid",
    name: "Adelheid",
    race: "hume",
    raceName: "Hume",
    job: "SCH",
    jobName: JOB_NAME.SCH,
    home: "Bastok Markets",
    line: "Ah, but my favorite assistant detective here wouldn't let me down. Just refrain from engaging in conduct that may hinder my--er, group progress.",
    dismiss: "Good luck!",
    scale: 0.94,
    gear: { main: "Staff", off: "", range: "" },
  },
  {
    id: "sylvie",
    name: "Sylvie",
    race: "hume",
    raceName: "Hume",
    job: "GEO",
    jobName: JOB_NAME.GEO,
    home: "Western Adoulin",
    line: "Hi! ...I'm Sylvie......the geomonger--I mean, geomancer!",
    dismiss: "Gotta go! You, you go get 'em, champs! Give them hell or high water!",
    scale: 0.94,
    gear: { main: "Club", off: "", range: "" },
  },
  {
    id: "amchuchu",
    name: "Amchuchu",
    race: "tarutaru",
    raceName: "Tarutaru",
    job: "RUN",
    jobName: JOB_NAME.RUN,
    home: "Eastern Adoulin",
    line: "Making your life better--one tomato-wato at a time!",
    dismiss: "A researcher's work is never over!",
    scale: 0.72,
    gear: { main: "Sword", off: "Shield", range: "" },
  },
  {
    id: "waoud",
    name: "Waoud",
    race: "hume",
    raceName: "Hume",
    job: "BLU",
    jobName: JOB_NAME.BLU,
    home: "Aht Urhgan Whitegate",
    line: "The spells you set are the ones I carry into battle.",
    dismiss: "Set them again, and I will return.",
    scale: 0.94,
    gear: { main: "Sword", off: "", range: "" },
  },
  {
    id: "nashmeira",
    name: "Nashmeira",
    race: "hume",
    raceName: "Hume",
    job: "PUP",
    jobName: JOB_NAME.PUP,
    home: "Aht Urhgan Whitegate",
    line: "You know more about us than any...you have come to us when we needed you most, and the time has come to return that favor.",
    dismiss: "Thank you...for everything.",
    scale: 0.94,
    gear: { main: "Hand-to-Hand", off: "", range: "" },
  },
  {
    id: "zeid",
    name: "Zeid",
    race: "hume",
    raceName: "Hume",
    job: "DRK",
    jobName: JOB_NAME.DRK,
    home: "Metalworks",
    line: "I don't play by others' rules...so get outta my way.",
    dismiss: "Dismiss me? You'll regret it!",
    scale: 0.94,
    gear: { main: "Scythe", off: "", range: "" },
  },
  {
    id: "lhu-mhakaracca",
    name: "Lhu Mhakaracca",
    race: "mithra",
    raceName: "Mithra",
    job: "BST",
    jobName: JOB_NAME.BST,
    home: "Nashmau",
    line: "Guttler, it's feeding time!",
    dismiss: "Hahaha, that was fun!",
    scale: 0.84,
    gear: { main: "Axe", off: "", range: "" },
  },
  {
    id: "qultada",
    name: "Qultada",
    race: "hume",
    raceName: "Hume",
    job: "COR",
    jobName: JOB_NAME.COR,
    home: "Abyssea - La Theine",
    line: "The tension and excitement of a true match...like walking on a tightrope...",
    dismiss: "Farewell for now, Seagull.",
    scale: 0.94,
    gear: { main: "Sword", off: "", range: "Marksmanship" },
  },
];

export const KUPIPI = TRUSTS[0];

/** The player's Blue Mage set, filtered to spells that job has reached. */
let notedBlue: readonly string[] = [];

export function noteTrustBlue(names: readonly string[], level = LEVEL): void {
  const cap = Math.max(0, Math.min(LEVEL, Math.floor(level)));
  const next: string[] = [];
  for (const name of names) {
    if (typeof name !== "string" || next.includes(name)) continue;
    const card = blueSpellByName(name);
    if (!card || card.level > cap) continue;
    next.push(name);
  }
  notedBlue = next;
}

export function trustBlueNames(): readonly string[] {
  return notedBlue;
}

export function trustById(id: string): TrustProfile | null {
  return TRUSTS.find((trust) => trust.id === id) ?? null;
}
export const PARTY_KEY = "first-swing-party";
export const JOB_LEVEL_KEY = "first-swing-job-levels";

export type PartyMode = "party" | "raid";

export type PartySave = {
  mode: PartyMode;
  /** Real adventurers, including you. Trust seats are whatever is left. */
  players: number;
  summoned: string[];
  subs: Record<string, JobId | null>;
  gear: Record<string, TrustGear>;
};

export type JobLevels = Record<string, number>;

type AbilityRow = { name: string; level: number; access: string; merit?: boolean };

/** Main-hand kinds the trust menu can hand her. The name is the combat skill. */
export const TRUST_MAIN_KINDS = [
  "Sword",
  "Club",
  "Staff",
  "Dagger",
  "Hand-to-Hand",
  "Great Sword",
  "Axe",
  "Great Axe",
  "Scythe",
  "Polearm",
  "Katana",
  "Great Katana",
] as const;

export const TRUST_OFF_KINDS = ["Shield"] as const;
export const TRUST_RANGE_KINDS = ["Archery", "Marksmanship", "Throwing"] as const;

export type TrustMain = (typeof TRUST_MAIN_KINDS)[number];
export type TrustOff = (typeof TRUST_OFF_KINDS)[number];
export type TrustRange = (typeof TRUST_RANGE_KINDS)[number];

export type TrustGear = {
  main: TrustMain;
  off: TrustOff | "";
  range: TrustRange | "";
};

const TRUST_ITEM: Record<TrustMain | TrustOff | TrustRange, string> = {
  Sword: "bronze-sword",
  Club: "ash-club",
  Staff: "ash-staff",
  Dagger: "bronze-dagger",
  "Hand-to-Hand": "cesti",
  "Great Sword": "rusty-greatsword",
  Axe: "bronze-axe",
  "Great Axe": "butterfly-axe",
  Scythe: "bronze-zaghnal",
  Polearm: "harpoon",
  Katana: "trainee-burin",
  "Great Katana": "hardwood-katana",
  Shield: "lauan-shield",
  Archery: "shortbow",
  Marksmanship: "light-crossbow",
  Throwing: "pebble",
};

const TWO_HAND = new Set<TrustMain>(["Staff", "Great Sword", "Great Axe", "Scythe", "Polearm", "Great Katana", "Hand-to-Hand"]);

export function defaultTrustGear(id: string = KUPIPI_ID): TrustGear {
  const gear = trustById(id)?.gear;
  return gear ? { main: gear.main, off: gear.off, range: gear.range } : { main: "Club", off: "", range: "" };
}

export function trustTwoHand(main: TrustMain): boolean {
  return TWO_HAND.has(main);
}

export function trustItemId(kind: TrustMain | TrustOff | TrustRange): string {
  return TRUST_ITEM[kind];
}

function asMain(value: unknown): TrustMain {
  return typeof value === "string" && (TRUST_MAIN_KINDS as readonly string[]).includes(value) ? (value as TrustMain) : "Club";
}

function asOff(value: unknown, main: TrustMain): TrustOff | "" {
  if (trustTwoHand(main)) return "";
  return value === "Shield" ? "Shield" : "";
}

function asRange(value: unknown): TrustRange | "" {
  return typeof value === "string" && (TRUST_RANGE_KINDS as readonly string[]).includes(value) ? (value as TrustRange) : "";
}

export function trustGearOf(party: PartySave, id: string): TrustGear {
  const row = party.gear[id];
  const fallback = defaultTrustGear(id);
  if (!row) return fallback;
  const main = asMain(row.main ?? fallback.main);
  return { main, off: asOff(row.off, main), range: asRange(row.range) };
}

export function memberCap(mode: PartyMode): number {
  return mode === "raid" ? RAID_MAX : PARTY_MAX;
}

/** Seats left for trusts after the real adventurers are counted. */
export function trustSeats(players: number, mode: PartyMode): number {
  const cap = memberCap(mode);
  const people = Math.max(1, Math.min(cap, Math.floor(players) || 1));
  return Math.max(0, cap - people);
}

export function defaultJobLevels(): JobLevels {
  return Object.fromEntries(PLAYABLE.map((job) => [job, LEVEL]));
}

export function blankParty(): PartySave {
  const subs: Record<string, JobId | null> = {};
  const gear: Record<string, TrustGear> = {};
  for (const trust of TRUSTS) {
    subs[trust.id] = null;
    gear[trust.id] = defaultTrustGear(trust.id);
  }
  return { mode: "party", players: 1, summoned: [], subs, gear };
}

function jobId(value: unknown): JobId | null {
  return typeof value === "string" && (PLAYABLE as readonly string[]).includes(value) ? (value as JobId) : null;
}

export function jobLevelsFrom(raw: unknown): JobLevels {
  const levels = defaultJobLevels();
  if (!raw || typeof raw !== "object") return levels;
  for (const [job, value] of Object.entries(raw as Record<string, unknown>)) {
    if (typeof value !== "number" || !Number.isFinite(value)) continue;
    if ((PLAYABLE as readonly string[]).includes(job)) levels[job] = Math.max(0, Math.min(LEVEL, Math.floor(value)));
    else if (/^[A-Z]{3}$/.test(job)) levels[job] = Math.max(0, Math.min(99, Math.floor(value)));
  }
  return levels;
}

export function loadJobLevels(): JobLevels {
  try {
    if (typeof localStorage === "undefined") return defaultJobLevels();
    const raw = localStorage.getItem(JOB_LEVEL_KEY);
    if (!raw) return defaultJobLevels();
    return jobLevelsFrom(JSON.parse(raw) as unknown);
  } catch {
    return defaultJobLevels();
  }
}

export function saveJobLevels(levels: JobLevels): void {
  try {
    localStorage.setItem(JOB_LEVEL_KEY, JSON.stringify(levels));
  } catch {
    /* private mode */
  }
}

export function partyFrom(raw: unknown): PartySave {
  const party = blankParty();
  if (!raw || typeof raw !== "object") return party;
  const row = raw as { mode?: unknown; players?: unknown; summoned?: unknown; subs?: unknown; gear?: unknown };
  party.mode = row.mode === "raid" ? "raid" : "party";
  if (typeof row.players === "number" && Number.isFinite(row.players)) {
    party.players = Math.max(1, Math.min(RAID_MAX, Math.floor(row.players)));
  }
  const known = new Set(TRUSTS.map((trust) => trust.id));
  if (Array.isArray(row.summoned)) {
    party.summoned = row.summoned.filter((id): id is string => typeof id === "string" && known.has(id));
  }
  const subs = row.subs && typeof row.subs === "object" ? (row.subs as Record<string, unknown>) : {};
  const gearBag = row.gear && typeof row.gear === "object" ? (row.gear as Record<string, unknown>) : {};
  for (const trust of TRUSTS) {
    const sub = jobId(subs[trust.id]);
    party.subs[trust.id] = sub && sub !== trust.job ? sub : null;
    const gear = gearBag[trust.id];
    const held = gear && typeof gear === "object" ? (gear as { main?: unknown; off?: unknown; range?: unknown }) : {};
    const main = asMain(held.main ?? trust.gear.main);
    party.gear[trust.id] = { main, off: asOff(held.off ?? trust.gear.off, main), range: asRange(held.range ?? trust.gear.range) };
  }
  const seats = trustSeats(party.players, party.mode);
  if (party.summoned.length > seats) party.summoned = party.summoned.slice(0, seats);
  return party;
}

export function loadParty(): PartySave {
  try {
    if (typeof localStorage === "undefined") return blankParty();
    const raw = localStorage.getItem(PARTY_KEY);
    if (!raw) return blankParty();
    return partyFrom(JSON.parse(raw) as unknown);
  } catch {
    return blankParty();
  }
}

export function saveParty(party: PartySave): void {
  try {
    localStorage.setItem(PARTY_KEY, JSON.stringify(party));
  } catch {
    /* private mode */
  }
}

/**
 * Levels a trust may actually use. The battle sheet stays at the
 * summoner's level. This map is only the spell and ability gate.
 */
export function trustAccessLevels(job: JobId, sub: JobId | null, jobLevels: JobLevels, battle = LEVEL): Partial<Record<JobId, number>> {
  const levels: Partial<Record<JobId, number>> = {};
  const main = jobLevels[job] ?? 0;
  if (main > 0) levels[job] = Math.min(main, battle);
  if (sub && sub !== job) {
    const known = jobLevels[sub] ?? 0;
    if (known > 0) levels[sub] = Math.min(known, subjobLevel(battle));
  }
  return levels;
}

export function trustSubChoices(job: JobId, jobLevels: JobLevels): JobId[] {
  return PLAYABLE.filter((choice) => choice !== job && (jobLevels[choice] ?? 0) > 0);
}

/** Same job sheet the yard builds, on that trust's race, at the summoner's level. */
export function trustSheet(id: string, sub: JobId | null): Sheet {
  return trustCombat(id, sub, defaultTrustGear(id));
}

/** The weapon in hand, without the job-equip lock. A sword stays a sword. */
export function trustLoadout(job: JobId, gear: TrustGear): Loadout {
  const next = fitLoadout(DEFAULT_LOADOUT, job);
  const main = asMain(gear.main);
  next.main = trustItemId(main);
  next.sub = asOff(gear.off, main) === "Shield" ? trustItemId("Shield") : null;
  const range = asRange(gear.range);
  next.range = range === "Archery" || range === "Marksmanship" ? trustItemId(range) : null;
  next.ammo = range === "Throwing" ? trustItemId("Throwing") : null;
  if (trustTwoHand(main)) next.sub = null;
  if (job === "NIN" && main === "Katana") next.main = "kunai";
  const held = next.main ? ITEMS[next.main] : null;
  if (job === "NIN" && held && held.grip !== "two" && held.kind !== "Hand-to-Hand" && !next.sub) next.sub = "kunai-off";
  return next;
}

export function trustCombat(id: string, sub: JobId | null, gear: TrustGear): Sheet {
  const who = trustById(id) ?? KUPIPI;
  const used = sub && sub !== who.job ? sub : null;
  return derive(trustLoadout(who.job, gear), who.race, who.job, used, who.job === "BLU" ? notedBlue : []);
}

export type TrustArm = { skillName: string; skill: number; weaponName: string };

/** Hands the gambit scan accepts. The equipped weapon is the skill, not the job list. */
export function trustArms(gear: TrustGear, sheet: Sheet): TrustArm[] {
  const arms: TrustArm[] = [{ skillName: gear.main, skill: 300, weaponName: sheet.weaponName }];
  if (gear.range) {
    const item = ITEMS[trustItemId(gear.range)];
    arms.push({ skillName: gear.range, skill: 300, weaponName: item?.name ?? gear.range });
  }
  return arms;
}

function abilityRows(job: JobId): readonly AbilityRow[] {
  if (job === "WAR") return WAR_ABILITIES;
  if (job === "BLM") return BLM_ABILITIES;
  if (job === "WHM") return WHM_ABILITIES;
  if (job === "RDM") return RDM_ABILITIES;
  if (job === "MNK") return MNK_ABILITIES;
  if (job === "THF") return THF_ABILITIES;
  if (job === "SAM") return SAM_ABILITIES;
  if (job === "RNG") return RNG_ABILITIES;
  if (job === "PLD") return PLD_ABILITIES;
  if (job === "NIN") return NIN_ABILITIES;
  if (job === "BRD") return BRD_ABILITIES;
  if (job === "DRK") return DRK_ABILITIES;
  if (job === "DRG") return DRG_ABILITIES;
  if (job === "SMN") return SMN_ABILITIES;
  if (job === "BST") return BST_ABILITIES;
  if (job === "BLU") return BLU_ABILITIES;
  if (job === "PUP") return PUP_ABILITIES;
  if (job === "COR") return COR_ABILITIES;
  if (job === "DNC") return DNC_ABILITIES;
  if (job === "SCH") return SCH_ABILITIES;
  if (job === "RUN") return RUN_ABILITIES;
  if (job === "GEO") return GEO_ABILITIES;
  return [];
}

export function trustAbilityNames(job: JobId, sub: JobId | null, levels: Partial<Record<JobId, number>>): string[] {
  const names: string[] = [];
  const mainLv = levels[job] ?? 0;
  for (const row of abilityRows(job)) {
    if (row.merit || row.level > mainLv) continue;
    names.push(row.name);
  }
  if (sub && sub !== job) {
    const subLv = levels[sub] ?? 0;
    for (const row of abilityRows(sub)) {
      if (row.merit || row.access !== "sub" || row.level > subLv || names.includes(row.name)) continue;
      names.push(row.name);
    }
  }
  return names;
}

export function trustKit(id: string, sub: JobId | null, jobLevels: JobLevels) {
  const who = trustById(id) ?? KUPIPI;
  const levels = trustAccessLevels(who.job, sub && sub !== who.job ? sub : null, jobLevels);
  const sheet = trustSheet(id, sub);
  const blue = who.job === "BLU" ? new Set(notedBlue) : undefined;
  const spells = spellsKnown(levels, blue, who.job).filter((spell) => spell.recast != null && spell.recast > 0);
  const mainLevel = levels[who.job] ?? 0;
  const skill = jobSkill(who.job, who.gear.main, mainLevel > 0 ? mainLevel : 0);
  return { sheet, levels, spells, abilities: trustAbilityNames(who.job, sub && sub !== who.job ? sub : null, levels), skill, mainLevel, job: who.job };
}

function wsRecord(kind: string, name: string) {
  if (kind === "Great Axe") return greatAxeByName(name);
  if (kind === "Great Sword") return greatSwordByName(name);
  if (kind === "Hand-to-Hand") return handByName(name);
  if (kind === "Dagger") return daggerByName(name);
  if (kind === "Axe") return axeByName(name);
  if (kind === "Staff") return staffByName(name);
  if (kind === "Club") return clubByName(name);
  if (kind === "Scythe") return scytheByName(name);
  if (kind === "Polearm") return polearmByName(name);
  if (kind === "Katana") return katanaByName(name);
  if (kind === "Great Katana") return greatKatanaByName(name);
  if (kind === "Archery") return archeryByName(name);
  if (kind === "Marksmanship") return marksmanshipByName(name);
  return swordByName(name);
}

function weaponChoices(kind: string, weaponName: string, job: JobId, sub: JobId | null, level: number): GambitChoice[] {
  if (kind === "Throwing") return [];
  if (level <= 0) return [];
  const listed = new Map<string, GambitChoice>();
  const jobs = [...new Set<JobId>([job, "WAR", "WHM"])];
  for (const listedJob of jobs) {
    const groups = hotbarGroups(kind, 300, weaponName, listedJob, sub);
    for (const action of groups.find((group) => group.title === "Weapon skills")?.actions ?? []) {
      const ws = wsRecord(kind, action.name);
      if (ws?.level != null && ws.level > level) continue;
      if (ws?.level != null && ws.level > LEVEL) continue;
      listed.set(action.id, { id: action.id, label: action.name });
    }
  }
  return [...listed.values()];
}

export function trustActionGroups(id: string, sub: JobId | null, jobLevels: JobLevels, gear: TrustGear = defaultTrustGear(id)): { title: string; actions: GambitChoice[] }[] {
  const who = trustById(id) ?? KUPIPI;
  const kit = trustKit(id, sub, jobLevels);
  const held = { main: asMain(gear.main), off: asOff(gear.off, asMain(gear.main)), range: asRange(gear.range) };
  const sheet = trustCombat(id, sub, held);
  const allowed = new Set(kit.abilities);
  const usedSub = sub && sub !== who.job ? sub : null;
  const groups = gambitActionGroups({
    job: who.job,
    sub: usedSub,
    skillName: held.main,
    skill: Math.max(kit.skill, sheet.skill),
    weaponName: sheet.weaponName,
    levels: kit.levels,
    spellNames: kit.spells.map((spell) => spell.name),
  });
  const weapons = [
    ...weaponChoices(held.main, sheet.weaponName, who.job, usedSub, kit.mainLevel),
    ...(held.range ? weaponChoices(held.range, ITEMS[trustItemId(held.range)]?.name ?? "", who.job, usedSub, kit.mainLevel) : []),
  ];
  return groups.map((group) => {
    if (group.title === "Board") {
      return { ...group, actions: group.actions.filter((action) => action.id !== "ranged") };
    }
    if (group.title === "Job abilities") {
      return { ...group, actions: group.actions.filter((action) => allowed.has(action.label)) };
    }
    if (group.title === "Weapon skills") return { ...group, actions: weapons };
    return group;
  });
}

export function highestCure(names: readonly string[]): string | null {
  for (const name of ["Cure V", "Cure IV", "Cure III", "Cure II", "Cure"]) {
    if (names.includes(name)) return name;
  }
  return null;
}

/**
 * Seconds a trust stands after you are far enough away, before the first step.
 * This wait is hers. The Tropical Rarab swings on its own delay of 240.
 */
export const TRUST_FOLLOW_DELAY = 3.2;

/**
 * She does not start that wait while you are still nearby.
 * Around 9 yalms, inside the 8–10 band, is far enough.
 */
export const TRUST_FOLLOW_LEASH = 9;

export type TrustFollowPhase = "idle" | "wait" | "follow";

/**
 * The follow wait does not start until the player is about 9 yalms away.
 * A shorter gap leaves her where she stands. Once the wait finishes she
 * closes until she is back on her slot. A follow already running is not
 * paused, even if you step back inside that distance. Coming back before
 * the wait ends cancels it. Standing on the slot rearms the next departure.
 */
export function stepTrustFollow(
  phase: TrustFollowPhase,
  wait: number,
  slotOpen: boolean,
  playerFar: boolean,
  dt: number,
): { phase: TrustFollowPhase; wait: number; step: boolean } {
  const tick = Math.max(0, dt);
  if (phase === "wait") {
    if (!playerFar) return { phase: "idle", wait: 0, step: false };
    const left = wait - tick;
    if (left > 0) return { phase: "wait", wait: left, step: false };
    return { phase: slotOpen ? "follow" : "idle", wait: 0, step: slotOpen };
  }
  if (playerFar && phase !== "follow") {
    const left = TRUST_FOLLOW_DELAY - tick;
    if (left > 0) return { phase: "wait", wait: left, step: false };
    return { phase: slotOpen ? "follow" : "idle", wait: 0, step: slotOpen };
  }
  if (phase === "follow") {
    return { phase: slotOpen ? "follow" : "idle", wait: 0, step: slotOpen };
  }
  return { phase: "idle", wait: 0, step: false };
}

export function assertParty(): void {
  if (memberCap("party") !== 6 || memberCap("raid") !== 18) throw new Error("party caps");
  if (trustSeats(1, "party") !== 5) throw new Error("solo trust seats");
  if (trustSeats(2, "party") !== 4) throw new Error("a second adventurer takes a trust seat");
  if (trustSeats(6, "party") !== 0) throw new Error("a full party has no trust seats");
  if (trustSeats(1, "raid") !== 17) throw new Error("a raid party holds 18");
  if (TRUSTS.length !== 22 || new Set(TRUSTS.map((trust) => trust.id)).size !== 22) throw new Error("trust roster");
  if (TRUSTS.map((trust) => trust.job).join(",") !== "WHM,RDM,BLM,THF,WAR,MNK,PLD,RNG,SAM,NIN,DRG,SMN,BRD,DNC,SCH,GEO,RUN,BLU,PUP,DRK,BST,COR") {
    throw new Error("trust jobs");
  }
  const sheet = trustSheet(KUPIPI_ID, null);
  if (sheet.job !== "WHM" || sheet.weaponName !== "Ash Club" || sheet.hp <= 0 || sheet.mp <= 0 || sheet.mnd <= 0) {
    throw new Error("Kupipi sheet");
  }
  const hume = derive(fitLoadout(DEFAULT_LOADOUT, "WHM"), "hume", "WHM", null);
  if (sheet.hp === hume.hp && sheet.mp === hume.mp) throw new Error("Kupipi should use Tarutaru grades");
  const low = trustKit(KUPIPI_ID, null, { ...defaultJobLevels(), WHM: 10 });
  const lowNames = low.spells.map((spell) => spell.name);
  if (!lowNames.includes("Cure") || lowNames.includes("Cure II")) throw new Error("level 10 White Mage stops at Cure");
  if (low.abilities.includes("Divine Seal") || !low.abilities.includes("Benediction")) throw new Error("level 10 abilities");
  const full = trustKit(KUPIPI_ID, "BLM", defaultJobLevels());
  const fullNames = full.spells.map((spell) => spell.name);
  if (!fullNames.includes("Cure V") || !fullNames.includes("Stone")) throw new Error("a learned subjob adds its list");
  if ((full.levels.BLM ?? 0) !== 37) throw new Error("subjob access stops at 37");
  if (trustSubChoices("WHM", { ...defaultJobLevels(), BLM: 0 }).includes("BLM")) throw new Error("an unlearned job is not a subjob");
  const empty = blankParty();
  if (empty.summoned.length !== 0 || empty.players !== 1 || empty.mode !== "party") throw new Error("party starts as you alone");
  if (empty.gear[KUPIPI_ID]?.main !== "Club" || empty.gear[KUPIPI_ID]?.off !== "" || trustTwoHand("Staff") !== true) {
    throw new Error("Kupipi starts with a club");
  }
  const shantotto = trustById("shantotto");
  const ayame = trustCombat("ayame", null, defaultTrustGear("ayame"));
  const curilla = trustCombat("curilla", null, defaultTrustGear("curilla"));
  const maat = trustCombat("maat", null, defaultTrustGear("maat"));
  if (!shantotto || shantotto.job !== "BLM" || shantotto.race !== "tarutaru" || ayame.job !== "SAM" || ayame.skillName !== "Great Katana") {
    throw new Error("trust jobs keep their own sheets");
  }
  if (curilla.job !== "PLD" || trustLoadout("PLD", defaultTrustGear("curilla")).sub == null || maat.skillName !== "Hand-to-Hand") {
    throw new Error("Curilla starts with a shield and Maat starts unarmed");
  }
  const gessho = trustCombat("gessho", null, defaultTrustGear("gessho"));
  const gesshoGear = trustLoadout("NIN", defaultTrustGear("gessho"));
  if (gessho.job !== "NIN" || gessho.skillName !== "Katana" || gessho.weaponName !== "Kunai" || gesshoGear.main !== "kunai" || gesshoGear.sub !== "kunai-off") {
    throw new Error("Gessho starts with dual kunai");
  }
  const sword = trustCombat(KUPIPI_ID, null, { main: "Sword", off: "Shield", range: "" });
  if (sword.weaponName !== "Bronze Sword" || sword.skillName !== "Sword") throw new Error("a sword stays in her main hand");
  const staff = trustCombat(KUPIPI_ID, null, { main: "Staff", off: "Shield", range: "" });
  if (staff.skillName !== "Staff" || trustLoadout("WHM", { main: "Staff", off: "Shield", range: "" }).sub != null) {
    throw new Error("a staff leaves no hand for a shield");
  }
  const names = (gear: TrustGear, levels: JobLevels) =>
    trustActionGroups(KUPIPI_ID, null, levels, gear).find((group) => group.title === "Weapon skills")?.actions.map((action) => action.label) ?? [];
  const clubWs = names(defaultTrustGear(), defaultJobLevels());
  if (!clubWs.includes("Shining Strike")) throw new Error("a club keeps club weapon skills");
  const swordWs = names({ main: "Sword", off: "Shield", range: "" }, defaultJobLevels());
  if (!swordWs.includes("Fast Blade") || swordWs.includes("Shining Strike")) throw new Error("a sword swaps the weapon skills");
  const lowSword = names({ main: "Sword", off: "", range: "" }, { ...defaultJobLevels(), WHM: 10 });
  if (!lowSword.includes("Fast Blade") || lowSword.includes("Savage Blade") || lowSword.includes("Spirits Within")) {
    throw new Error("level 10 stops before the later sword skills");
  }
  const semihGear = defaultTrustGear("semih-lafihna");
  const semihShots =
    trustActionGroups("semih-lafihna", null, defaultJobLevels(), semihGear).find((group) => group.title === "Weapon skills")?.actions.map((action) => action.label) ?? [];
  if (!semihShots.includes("Fast Blade") || !semihShots.includes("Sidewinder") || !semihShots.includes("Flaming Arrow")) {
    throw new Error("a bow adds archery weapon skills beside the sword");
  }
  const swordOnly =
    trustActionGroups("semih-lafihna", null, defaultJobLevels(), { main: "Sword", off: "", range: "" }).find((group) => group.title === "Weapon skills")?.actions.map((action) => action.label) ?? [];
  if (swordOnly.includes("Sidewinder") || swordOnly.includes("Flaming Arrow")) throw new Error("no bow means no archery weapon skill");
  if (TRUST_FOLLOW_DELAY !== 3.2) throw new Error("trust follow waits 3.2 seconds");
  if (TRUST_FOLLOW_LEASH < 8 || TRUST_FOLLOW_LEASH > 10) throw new Error("follow starts around 8 to 10 yalms");
  const near = stepTrustFollow("idle", 0, true, false, 0.016);
  if (near.phase !== "idle" || near.step) throw new Error("she does not follow until you are about 9 yalms away");
  const armed = stepTrustFollow("idle", 0, true, true, 0);
  if (armed.phase !== "wait" || armed.wait !== TRUST_FOLLOW_DELAY || armed.step) throw new Error("nine yalms arms the wait and does not move her");
  const ticking = stepTrustFollow("wait", TRUST_FOLLOW_DELAY, true, true, 0.5);
  if (ticking.phase !== "wait" || Math.abs(ticking.wait - 2.7) > 1e-9 || ticking.step) throw new Error("follow delay ticks");
  const returned = stepTrustFollow("wait", 2, true, false, 0.016);
  if (returned.phase !== "idle" || returned.step) throw new Error("coming back before the wait ends cancels it");
  const go = stepTrustFollow("wait", 0.1, true, true, 0.1);
  if (go.phase !== "follow" || !go.step) throw new Error("follow starts after the delay");
  const keep = stepTrustFollow("follow", 0, true, false, 0.016);
  if (keep.phase !== "follow" || !keep.step) throw new Error("a follow already running is not paused");
  const parked = stepTrustFollow("follow", 0, false, false, 0.016);
  if (parked.phase !== "idle" || parked.step) throw new Error("she stops on the slot");
  const dragoon = trustById("shikaree-z");
  const qultada = defaultTrustGear("qultada");
  const amchuchu = trustLoadout("RUN", defaultTrustGear("amchuchu"));
  const nashmeira = trustCombat("nashmeira", null, defaultTrustGear("nashmeira"));
  if (!dragoon || dragoon.job !== "DRG" || dragoon.gear.main !== "Polearm" || dragoon.race !== "mithra") throw new Error("Shikaree Z is the dragoon");
  if (qultada.range !== "Marksmanship" || trustById("qultada")?.job !== "COR") throw new Error("Qultada starts with a gun");
  if (amchuchu.sub == null || trustById("amchuchu")?.job !== "RUN") throw new Error("Amchuchu starts with a shield");
  if (nashmeira.job !== "PUP" || nashmeira.skillName !== "Hand-to-Hand") throw new Error("Nashmeira starts unarmed");
  const sylvie = trustKit("sylvie", null, defaultJobLevels());
  if (!sylvie.abilities.includes("Bolster") || !sylvie.abilities.includes("Full Circle")) throw new Error("Sylvie knows geomancy abilities");
  noteTrustBlue([], 75);
  const bare = trustCombat("waoud", null, defaultTrustGear("waoud"));
  const emptyKit = trustKit("waoud", null, defaultJobLevels());
  if (emptyKit.spells.some((spell) => spell.school === "blue")) throw new Error("Waoud knows no blue magic until a spell is set");
  noteTrustBlue(["Wild Carrot"], 75);
  const fed = trustCombat("waoud", null, defaultTrustGear("waoud"));
  if (fed.hp !== bare.hp + 5) throw new Error("Waoud wears the set's HP");
  noteTrustBlue(["Wild Carrot", "Cocoon"], 75);
  const setKit = trustKit("waoud", null, defaultJobLevels());
  const setNames = setKit.spells.map((spell) => spell.name);
  if (fed.hp !== bare.hp + 5) throw new Error("Waoud wears the set's HP");
  if (!setNames.includes("Wild Carrot") || !setNames.includes("Cocoon") || setNames.includes("Foot Kick")) {
    throw new Error("Waoud casts only the spells that are set");
  }
  const gated = trustKit("waoud", null, { ...defaultJobLevels(), BLU: 10 });
  const gatedNames = gated.spells.map((spell) => spell.name);
  if (!gatedNames.includes("Cocoon") || gatedNames.includes("Wild Carrot")) throw new Error("Waoud stops where your Blue Mage stops");
  noteTrustBlue([], 75);
}
