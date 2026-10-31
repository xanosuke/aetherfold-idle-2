/**
 * Versioned playtest save.
 *
 * One JSON blob in localStorage, mirrored to a single unowned yard row so a
 * preview reload can restore it when the browser copy is missing. Older blobs
 * keep their unknown keys and gain defaults for anything this build added.
 * A corrupt blob is never replaced by a blank game. Reset is the only wipe.
 * Gear, jobs, and party are also mirrored to the older first-swing keys.
 */

import { ALL_ITEM_IDS, DEFAULT_LOADOUT, HARE, ITEMS, JUG_STACK, LEVEL, OIL_STACK, ZETA_STACK, canWear, sanitizeLoadout, type Loadout } from "./content";
import { sanitizeCraftSkill, sanitizeCraftStock, sanitizeCrystals, assertCraft, type CraftSkills, type CrystalWallet } from "./craft";
import { sanitizeEquipSets, type EquipSets } from "./equipsets";
import { BAG_SLOTS, STACK_MAX, assertInventory } from "./inventory";
import { assertSignet } from "./signet";
import { assertDrops } from "./drops";
import { assertAfk, campZoneFromSave, type AfkFarmSave, type FarmDrop, type FarmZoneId } from "./afk";
import { BLUE_SPELLS, trimBlueSet, withGrantedBlue } from "./blu";
import { GAMBIT_KEY, gambitBookFrom, type GambitBook } from "./gambits";
import { mergeSkillSnapshot, PLAYABLE, skillSnapshot } from "./jobs";
import { JOB_LEVEL_KEY, PARTY_KEY, jobLevelsFrom, partyFrom, type JobLevels, type PartySave } from "./party";
import { CHAIN_PROPERTIES, type SkillchainSave } from "./skillchain";
import type { SpellElement } from "./spells";
import type { JobId, RaceId } from "./stats";
import { attachmentsThatFit, autoFrame, autoHead } from "./automaton";
import { NPC_TALK } from "./distance";
import { bankExp } from "./exp";
import { PLACE_MAX_X, PLACE_MAX_Z, PLACE_MIN_X, PLACE_MIN_Z } from "./world";
import { assertMagian, sanitizeMagian, type MagianBook } from "./magian";

export const SAVE_VERSION = 1;
export const PROGRESS_KEY = "aetherfold-idle-save";
export const BACKUP_KEY = "aetherfold-idle-save-bak";
export const CORRUPT_KEY = "aetherfold-idle-save-corrupt";

export const LOADOUT_KEY = "first-swing-loadout";
export const HOTBAR_KEY = "first-swing-hotbar";
export const JOB_KEY = "first-swing-jobs";
export const HOME_KEY = "first-swing-home";

const HOTBAR_SLOTS = 12;
const LEGACY_KEYS = [LOADOUT_KEY, HOTBAR_KEY, JOB_KEY, HOME_KEY, PARTY_KEY, JOB_LEVEL_KEY, GAMBIT_KEY];

const KNOWN = new Set([
  "version",
  "savedAt",
  "revision",
  "started",
  "level",
  "exp",
  "expByJob",
  "race",
  "mainJob",
  "subJob",
  "jobLevels",
  "skills",
  "gil",
  "inventory",
  "loadout",
  "gearBase",
  "equipSets",
  "hotbar",
  "party",
  "gambits",
  "homeAt",
  "zone",
  "position",
  "quests",
  "flags",
  "afk",
  "hp",
  "mp",
  "tp",
  "engaged",
  "ko",
  "buffs",
  "recasts",
  "hate",
  "hareHp",
  "hareTp",
  "skillchain",
  "log",
  "blueLearned",
  "blueSet",
  "autoHead",
  "autoFrame",
  "autoSet",
  "crystals",
  "craftSkill",
  "craftStock",
  "rankPoints",
  "conquestPoints",
  "afkFarm",
  "magian",
]);

const RACES = new Set<RaceId>(["hume", "elvaan", "tarutaru", "mithra", "galka"]);
const ZONES = new Set(["battle", "raids", "equipment", "gambits", "town"]);
const ELEMENTS = new Set<SpellElement>(["fire", "ice", "wind", "earth", "thunder", "water", "light", "dark"]);
const CHAIN_NAMES = new Set<string>(CHAIN_PROPERTIES);

export type ZoneName = "battle" | "raids" | "equipment" | "gambits" | "town";

export type SavedBuff = {
  name: string;
  left: number;
  spikeBase?: number;
  skin?: number;
  skinFrom?: "spell" | "solace" | "metal" | "hide";
  hasteFrom?: "spell" | "refuel" | "hastega";
  tier?: number;
  power?: number;
  acc?: number;
  charges?: number;
  hold?: boolean;
  told?: boolean;
  enspell?: { tier: 1 | 2; element: SpellElement; base: number; rounds: number };
};

export type ProgressSave = {
  version: number;
  savedAt: number;
  revision: number;
  started: boolean;
  level: number;
  exp: number;
  expByJob: Record<string, number>;
  race: RaceId;
  mainJob: JobId;
  subJob: JobId | null;
  jobLevels: JobLevels;
  skills: Record<string, number>;
  gil: number;
  inventory: Record<string, number>;
  loadout: Loadout;
  gearBase: Loadout;
  equipSets: EquipSets;
  hotbar: (string | null)[];
  party: PartySave;
  gambits: GambitBook;
  homeAt: "spawn" | "crystal" | "port";
  zone: ZoneName;
  position: { x: number; z: number };
  quests: Record<string, unknown>;
  flags: Record<string, unknown>;
  afk: { dealt: number; swings: number; seconds: number };
  hp: number | null;
  mp: number | null;
  tp: number;
  engaged: boolean;
  ko: boolean;
  buffs: SavedBuff[];
  recasts: Record<string, number>;
  hate: { ce: number; ve: number };
  hareHp: number;
  hareTp: number;
  skillchain: SkillchainSave | null;
  log: { text: string; kind: "hit" | "crit" | "miss" | "info" }[];
  blueLearned: string[];
  blueSet: string[];
  autoHead: string;
  autoFrame: string;
  autoSet: string[];
  crystals: CrystalWallet;
  craftSkill: CraftSkills;
  craftStock: Record<string, number>;
  rankPoints: number;
  conquestPoints: number;
  afkFarm: AfkFarmSave | null;
  magian: MagianBook;
};

export type BootKind = "fresh" | "saved" | "legacy" | "corrupt";

export type BootProgress = {
  kind: BootKind;
  save: ProgressSave;
  extra: Record<string, unknown>;
};

export type SaveStorage = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
};

export function browserStorage(): SaveStorage | null {
  try {
    if (typeof localStorage === "undefined") return null;
    return localStorage;
  } catch {
    return null;
  }
}

function finite(value: unknown, fallback: number, min: number, max: number): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, value));
}

function paidDaysOf(raw: unknown): Partial<Record<number, string>> {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const out: Partial<Record<number, string>> = {};
  for (const key of ["1", "2", "3", "4", "5", "11", "12", "13", "14", "15"]) {
    const value = (raw as Record<string, unknown>)[key];
    if (typeof value === "string" && value.length > 0) out[Number(key)] = value.slice(0, 24);
  }
  return out;
}

function farmDrops(raw: unknown): FarmDrop[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  const tiers = new Set(["very-common", "common", "uncommon", "rare", "very-rare", "super-rare", "ultra-rare"]);
  const out: FarmDrop[] = [];
  for (const row of raw) {
    if (!row || typeof row !== "object") continue;
    const drop = row as Record<string, unknown>;
    if (typeof drop.id !== "string" || typeof drop.found !== "string" || typeof drop.tier !== "string" || !tiers.has(drop.tier)) continue;
    out.push({ id: drop.id.slice(0, 64), found: drop.found.slice(0, 80), tier: drop.tier as FarmDrop["tier"] });
  }
  return out;
}

function sanitizeAfkFarm(raw: unknown): AfkFarmSave | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const row = raw as Record<string, unknown>;
  if (row.active !== true) return null;
  const rawZone = typeof row.zoneId === "string" ? row.zoneId : "";
  const legacy = rawZone === "west-ronfaure" || rawZone === "ronfaure-forest";
  const zoneId: FarmZoneId | null = campZoneFromSave(rawZone);
  const start = finite(row.startTimestamp, 0, 0, 8.64e15);
  if (!zoneId || start <= 0) return null;
  const groupId = !legacy && typeof row.groupId === "string" && /^[a-z0-9-]{1,64}$/.test(row.groupId) ? row.groupId : undefined;
  const preyLevel = groupId && typeof row.preyLevel === "number" && Number.isFinite(row.preyLevel) ? Math.floor(row.preyLevel) : undefined;
  return {
    active: true,
    startTimestamp: start,
    zoneId,
    mode: row.mode === "nm" ? "nm" : "exp",
    groupId,
    groupName: groupId && typeof row.groupName === "string" ? row.groupName.slice(0, 80) : undefined,
    groupFamily: groupId && typeof row.groupFamily === "string" ? row.groupFamily.slice(0, 40) : undefined,
    farmingEfficiency: finite(row.farmingEfficiency, 0.05, 0, 8),
    level: Math.floor(finite(row.level, 1, 1, 75)),
    exp: Math.floor(finite(row.exp, 0, 0, 1e9)),
    job: typeof row.job === "string" ? row.job.slice(0, 8) : "WAR",
    treasureHunter: Math.floor(finite(row.treasureHunter, 0, 0, 14)),
    signetLeft: finite(row.signetLeft, 0, 0, 48 * 3600),
    crystalBonus: row.crystalBonus === true,
    dies: row.dies === true,
    sustainMinutes: finite(row.sustainMinutes, 12 * 60, 0, 12 * 60),
    note: typeof row.note === "string" ? row.note.slice(0, 160) : "",
    fovActive: row.fovActive === true,
    fovPage: Math.floor(finite(row.fovPage, 0, 0, 5)),
    fovBook: row.fovBook === "east" ? "east" : "west",
    fovCounts: Array.isArray(row.fovCounts)
      ? row.fovCounts.filter((value): value is number => typeof value === "number" && Number.isFinite(value)).slice(0, 4).map((value) => Math.floor(finite(value, 0, 0, 7)))
      : [],
    fovRepeat: row.fovRepeat === true,
    fovPaidDays: paidDaysOf(row.fovPaidDays),
    fovTabs: Math.floor(finite(row.fovTabs, 0, 0, 50_000)),
    preyLevel,
    preyHp: preyLevel != null ? finite(row.preyHp, 1, 1, 1e7) : undefined,
    preyWeapon: preyLevel != null ? finite(row.preyWeapon, 1, 1, 999) : undefined,
    preyDelay: preyLevel != null ? finite(row.preyDelay, 240, 60, 2000) : undefined,
    preyDrops: preyLevel != null ? farmDrops(row.preyDrops) : undefined,
    ...(row.mode === "nm"
      ? {
          fillerId: typeof row.fillerId === "string" && /^[a-z0-9-]{1,64}$/.test(row.fillerId) ? row.fillerId : undefined,
          fillerName: typeof row.fillerName === "string" ? row.fillerName.slice(0, 80) : undefined,
          nmCanKill: row.nmCanKill !== false,
          nmPerHour: finite(row.nmPerHour, 0, 0, 60),
        }
      : {}),
  };
}

function playable(value: unknown): JobId | null {
  return typeof value === "string" && (PLAYABLE as readonly string[]).includes(value) ? (value as JobId) : null;
}

function emptyHotbar(): (string | null)[] {
  return Array.from({ length: HOTBAR_SLOTS }, () => null);
}

function asRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return { ...(value as Record<string, unknown>) };
}

function sanitizeInventory(raw: unknown): Record<string, number> {
  const out: Record<string, number> = {};
  for (const id of ALL_ITEM_IDS) {
    const kind = ITEMS[id]?.kind;
    out[id] = id === "kingdom-aketon" || kind === "Material" ? 0 : kind === "Jug" ? JUG_STACK : kind === "Pet Food" ? ZETA_STACK : kind === "Oil" ? OIL_STACK : kind === "Bait" ? 12 : 1;
  }
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return out;
  for (const [id, count] of Object.entries(raw as Record<string, unknown>)) {
    if (typeof count !== "number" || !Number.isFinite(count)) continue;
    if (!/^[a-z0-9-]{1,64}$/.test(id)) continue;
    out[id] = Math.max(0, Math.min(BAG_SLOTS * STACK_MAX, Math.floor(count)));
  }
  return out;
}

function sanitizeHotbar(raw: unknown): (string | null)[] {
  const empty = emptyHotbar();
  if (!Array.isArray(raw)) return empty;
  return empty.map((_, index) => (typeof raw[index] === "string" ? raw[index] : null));
}

function sanitizeBuff(raw: unknown): SavedBuff | null {
  if (!raw || typeof raw !== "object") return null;
  const row = raw as Record<string, unknown>;
  if (typeof row.name !== "string" || row.name.length < 1 || row.name.length > 80) return null;
  if (typeof row.indiFrom === "string" || typeof row.from === "string") return null;
  if (row.hold === true && (row.name.startsWith("Indi-") || row.name.startsWith("Geo-"))) return null;
  if (typeof row.left !== "number" || !Number.isFinite(row.left)) return null;
  const buff: SavedBuff = { name: row.name, left: finite(row.left, 0, 0, 7200) };
  const copy = (key: "spikeBase" | "skin" | "tier" | "power" | "acc" | "charges", max: number) => {
    const value = row[key];
    if (typeof value === "number" && Number.isFinite(value)) buff[key] = finite(value, 0, 0, max);
  };
  copy("spikeBase", 9999);
  copy("skin", 9999);
  copy("tier", 20);
  copy("power", 9999);
  copy("acc", 999);
  copy("charges", 20);
  if (row.skinFrom === "spell" || row.skinFrom === "solace" || row.skinFrom === "metal" || row.skinFrom === "hide") buff.skinFrom = row.skinFrom;
  if (row.hasteFrom === "spell" || row.hasteFrom === "refuel" || row.hasteFrom === "hastega") buff.hasteFrom = row.hasteFrom;
  if (row.hold === true) buff.hold = true;
  if (row.told === true) buff.told = true;
  if (row.enspell && typeof row.enspell === "object") {
    const spell = row.enspell as Record<string, unknown>;
    if ((spell.tier === 1 || spell.tier === 2) && typeof spell.element === "string" && ELEMENTS.has(spell.element as SpellElement)) {
      buff.enspell = {
        tier: spell.tier,
        element: spell.element as SpellElement,
        base: finite(spell.base, 0, 0, 9999),
        rounds: Math.floor(finite(spell.rounds, 0, 0, 99)),
      };
    }
  }
  return buff;
}

function sanitizeRecasts(raw: unknown): Record<string, number> {
  const out: Record<string, number> = {};
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return out;
  for (const [name, value] of Object.entries(raw as Record<string, unknown>)) {
    if (!/^[A-Za-z0-9 :'+.-]{1,40}$/.test(name)) continue;
    if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) continue;
    out[name] = Math.min(3600, value);
  }
  return out;
}

function sanitizeChain(raw: unknown): SkillchainSave | null {
  if (!raw || typeof raw !== "object") return null;
  const row = raw as Record<string, unknown>;
  const props = Array.isArray(row.props) ? row.props.filter((name): name is string => typeof name === "string" && CHAIN_NAMES.has(name)).slice(0, 4) : [];
  if (!props.length) return null;
  const name = typeof row.name === "string" && CHAIN_NAMES.has(row.name) ? row.name : null;
  const elements = Array.isArray(row.elements) ? row.elements.filter((el): el is string => typeof el === "string" && el.length > 0 && el.length < 20).slice(0, 8) : [];
  return {
    props,
    age: finite(row.age, 0, 0, 30),
    name,
    elements,
    step: Math.floor(finite(row.step, 1, 1, 8)),
    burst: finite(row.burst, 0, 0, 10),
  };
}

function sanitizeBlueNames(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  const allow = new Set(BLUE_SPELLS.map((spell) => spell.name));
  const out: string[] = [];
  for (const name of raw) {
    if (typeof name !== "string" || !allow.has(name) || out.includes(name)) continue;
    out.push(name);
  }
  return out;
}

function sanitizeAutoHead(raw: unknown): string {
  return typeof raw === "string" && autoHead(raw) ? raw : "stormwaker";
}

function sanitizeAutoFrame(raw: unknown): string {
  return typeof raw === "string" && autoFrame(raw) ? raw : "stormwaker";
}

function sanitizeAutoSet(frameRaw: unknown, headRaw: unknown, raw: unknown): string[] {
  const frame = sanitizeAutoFrame(frameRaw);
  const head = sanitizeAutoHead(headRaw);
  if (!Array.isArray(raw)) return [];
  const names = raw.filter((name): name is string => typeof name === "string" && name.length > 0 && name.length < 80);
  return attachmentsThatFit(frame, head, names);
}

function sanitizeLog(raw: unknown): ProgressSave["log"] {
  if (!Array.isArray(raw)) return [];
  const lines: ProgressSave["log"] = [];
  for (const row of raw.slice(-40)) {
    if (!row || typeof row !== "object") continue;
    const line = row as Record<string, unknown>;
    if (typeof line.text !== "string" || line.text.length < 1) continue;
    const kind = line.kind === "hit" || line.kind === "crit" || line.kind === "miss" || line.kind === "info" ? line.kind : "info";
    lines.push({ text: line.text.slice(0, 240), kind });
  }
  return lines;
}

function readJobsFrom(storage: SaveStorage): { main: JobId; sub: JobId | null; race: RaceId } {
  const fallback = { main: "BLM" as JobId, sub: null, race: "hume" as RaceId };
  const parsed = parseObject(storage.getItem(JOB_KEY));
  if (!parsed) return fallback;
  const main = playable(parsed.main) ?? "BLM";
  const sub = playable(parsed.sub);
  const race = typeof parsed.race === "string" && RACES.has(parsed.race as RaceId) ? (parsed.race as RaceId) : "hume";
  return { main, sub: sub === main ? null : sub, race };
}

function readLoadoutFrom(storage: SaveStorage): Loadout {
  const parsed = parseObject(storage.getItem(LOADOUT_KEY));
  return parsed ? sanitizeLoadout(parsed) : { ...DEFAULT_LOADOUT };
}

function readHotbarFrom(storage: SaveStorage): (string | null)[] {
  const raw = storage.getItem(HOTBAR_KEY);
  if (!raw) return emptyHotbar();
  try {
    return sanitizeHotbar(JSON.parse(raw));
  } catch {
    return emptyHotbar();
  }
}

function readHomeFrom(storage: SaveStorage): "spawn" | "crystal" | "port" {
  const raw = storage.getItem(HOME_KEY);
  return raw === "crystal" || raw === "port" ? raw : "spawn";
}

function legacySave(storage: SaveStorage): ProgressSave | null {
  if (!LEGACY_KEYS.some((key) => storage.getItem(key) != null)) return null;
  const jobs = readJobsFrom(storage);
  return normalizeProgress({
    version: SAVE_VERSION,
    started: true,
    race: jobs.race,
    mainJob: jobs.main,
    subJob: jobs.sub,
    loadout: readLoadoutFrom(storage),
    hotbar: readHotbarFrom(storage),
    homeAt: readHomeFrom(storage),
    party: partyFrom(parseObject(storage.getItem(PARTY_KEY))),
    jobLevels: jobLevelsFrom(parseObject(storage.getItem(JOB_LEVEL_KEY))),
    gambits: gambitBookFrom(parseObject(storage.getItem(GAMBIT_KEY))),
    zone: "battle",
  }).save;
}

/** One experience pool per job. An older save's single bar belongs to the job that was on. */
function readJobExp(
  raw: unknown,
  legacy: unknown,
  main: JobId,
  levels: JobLevels,
): { expByJob: Record<string, number>; jobLevels: JobLevels; exp: number } {
  const present = raw != null && typeof raw === "object" && !Array.isArray(raw);
  const bag = present ? (raw as Record<string, unknown>) : null;
  const next: JobLevels = { ...levels };
  const expByJob: Record<string, number> = {};
  for (const job of PLAYABLE) {
    const stored = bag ? bag[job] : job === main ? legacy : 0;
    const banked = bankExp(next[job] ?? LEVEL, finite(stored, 0, 0, 1_000_000_000));
    next[job] = banked.level;
    expByJob[job] = banked.exp;
  }
  return { expByJob, jobLevels: next, exp: expByJob[main] ?? 0 };
}

/** Fill anything an older save left out. Unknown keys are returned beside the save. */
export function normalizeProgress(raw: unknown): { save: ProgressSave; extra: Record<string, unknown> } {
  const rec = raw && typeof raw === "object" && !Array.isArray(raw) ? (raw as Record<string, unknown>) : {};
  const extra: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(rec)) {
    if (!KNOWN.has(key)) extra[key] = value;
  }
  const main = playable(rec.mainJob) ?? "BLM";
  const subRaw = playable(rec.subJob);
  const sub = subRaw === main ? null : subRaw;
  const race = typeof rec.race === "string" && RACES.has(rec.race as RaceId) ? (rec.race as RaceId) : "hume";
  const jobLevels = jobLevelsFrom(rec.jobLevels);
  if (rec.jobLevels == null && typeof rec.level === "number" && Number.isFinite(rec.level)) {
    jobLevels[main] = Math.max(0, Math.min(LEVEL, Math.floor(rec.level)));
  }
  const banked = readJobExp(rec.expByJob, rec.exp, main, jobLevels);
  const level = banked.jobLevels[main] ?? LEVEL;
  const zone = typeof rec.zone === "string" && ZONES.has(rec.zone) ? (rec.zone as ZoneName) : "battle";
  const pos = rec.position && typeof rec.position === "object" ? (rec.position as { x?: unknown; z?: unknown }) : {};
  const afk = rec.afk && typeof rec.afk === "object" ? (rec.afk as { dealt?: unknown; swings?: unknown; seconds?: unknown }) : {};
  const hate = rec.hate && typeof rec.hate === "object" ? (rec.hate as { ce?: unknown; ve?: unknown }) : {};
  const learned = withGrantedBlue(sanitizeBlueNames(rec.blueLearned));
  const save: ProgressSave = {
    version: SAVE_VERSION,
    savedAt: finite(rec.savedAt, 0, 0, 8.64e15),
    revision: Math.floor(finite(rec.revision, 0, 0, 1e15)),
    started: rec.started === true,
    level,
    exp: banked.exp,
    expByJob: banked.expByJob,
    race,
    mainJob: main,
    subJob: sub,
    jobLevels: banked.jobLevels,
    skills: mergeSkillSnapshot(rec.skills, skillSnapshot(main, level, sub)),
    gil: Math.floor(finite(rec.gil, 0, 0, 999_999_999)),
    inventory: sanitizeInventory(rec.inventory),
    loadout: sanitizeLoadout(rec.loadout),
    gearBase: sanitizeLoadout(rec.gearBase ?? rec.loadout),
    equipSets: sanitizeEquipSets(rec.equipSets),
    hotbar: sanitizeHotbar(rec.hotbar),
    party: partyFrom(rec.party),
    gambits: gambitBookFrom(rec.gambits),
    homeAt: rec.homeAt === "crystal" || rec.homeAt === "port" ? rec.homeAt : "spawn",
    zone,
    position: { x: finite(pos.x, 0, PLACE_MIN_X, PLACE_MAX_X), z: finite(pos.z, 0, PLACE_MIN_Z, PLACE_MAX_Z) },
    quests: asRecord(rec.quests),
    flags: asRecord(rec.flags),
    afk: {
      dealt: Math.floor(finite(afk.dealt, 0, 0, 1e12)),
      swings: Math.floor(finite(afk.swings, 0, 0, 1e12)),
      seconds: finite(afk.seconds, 0, 0, 1e12),
    },
    hp: typeof rec.hp === "number" && Number.isFinite(rec.hp) ? Math.max(0, rec.hp) : null,
    mp: typeof rec.mp === "number" && Number.isFinite(rec.mp) ? Math.max(0, rec.mp) : null,
    tp: Math.floor(finite(rec.tp, 0, 0, 3000)),
    engaged: rec.engaged === true,
    ko: rec.ko === true,
    buffs: Array.isArray(rec.buffs) ? rec.buffs.map(sanitizeBuff).filter((buff): buff is SavedBuff => buff != null).slice(0, 40) : [],
    recasts: sanitizeRecasts(rec.recasts),
    hate: { ce: finite(hate.ce, 0, 0, 1e7), ve: finite(hate.ve, 0, 0, 1e7) },
    hareHp: typeof rec.hareHp === "number" && rec.hareHp > 0 ? finite(rec.hareHp, HARE.hpNatural, 1, HARE.hpNatural) : HARE.hpNatural,
    hareTp: Math.floor(finite(rec.hareTp, 0, 0, 3000)),
    skillchain: sanitizeChain(rec.skillchain),
    log: sanitizeLog(rec.log),
    blueLearned: learned,
    blueSet: trimBlueSet(sanitizeBlueNames(rec.blueSet).filter((name) => learned.includes(name)), LEVEL),
    autoHead: sanitizeAutoHead(rec.autoHead),
    autoFrame: sanitizeAutoFrame(rec.autoFrame),
    autoSet: sanitizeAutoSet(rec.autoFrame, rec.autoHead, rec.autoSet),
    crystals: sanitizeCrystals(rec.crystals),
    craftSkill: sanitizeCraftSkill(rec.craftSkill),
    craftStock: sanitizeCraftStock(rec.craftStock),
    rankPoints: Math.floor(finite(rec.rankPoints, 0, 0, 9_999_999)),
    conquestPoints: Math.floor(finite(rec.conquestPoints, 0, 0, 9_999_999)),
    afkFarm: sanitizeAfkFarm(rec.afkFarm),
    magian: sanitizeMagian(rec.magian),
  };
  return { save, extra };
}

export function serializeProgress(save: ProgressSave, extra: Record<string, unknown>): string {
  const body: Record<string, unknown> = { ...extra };
  for (const key of KNOWN) body[key] = (save as unknown as Record<string, unknown>)[key];
  body.version = SAVE_VERSION;
  body.savedAt = save.savedAt;
  return JSON.stringify(body);
}

function parseObject(raw: string | null): Record<string, unknown> | null {
  if (!raw) return null;
  const text = raw.trim();
  const take = (value: string): Record<string, unknown> | null => {
    try {
      const parsed = JSON.parse(value) as unknown;
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
      return parsed as Record<string, unknown>;
    } catch {
      return null;
    }
  };
  const direct = take(text);
  if (direct) return direct;
  // A trailing brace must not throw the whole yard away.
  const start = text.indexOf("{");
  if (start < 0) return null;
  let depth = 0;
  let inString = false;
  let escape = false;
  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    if (inString) {
      if (escape) escape = false;
      else if (ch === "\\") escape = true;
      else if (ch === "\"") inString = false;
      continue;
    }
    if (ch === "\"") inString = true;
    else if (ch === "{") depth += 1;
    else if (ch === "}") {
      depth -= 1;
      if (depth === 0) return take(text.slice(start, i + 1));
    }
  }
  return null;
}

/** Same normalize path as a stored blob. Null when the text is not a save. */
export function progressFromText(text: string | null): { save: ProgressSave; extra: Record<string, unknown> } | null {
  const parsed = parseObject(text);
  if (!parsed) return null;
  return normalizeProgress(parsed);
}

/**
 * Which copy wins when the page comes back.
 * localAt is the stamp from before this page's own writes. A fresh boot is 0,
 * so a default Black Mage stamp cannot replace a real server yard.
 * A blank boot that managed to get a newer stamp still loses to a real game.
 */
export function chooseYardSource(
  localAt: number,
  remoteAt: number,
  customized: boolean,
  wroteDuringHydrate: boolean,
  localReal = localAt > 0,
  remoteReal = remoteAt > 0,
): "remote" | "local" | "none" | "memory" {
  if (remoteReal && !localReal && remoteAt > 0) return "remote";
  if (localReal && !remoteReal && localAt > 0) return "local";
  if (wroteDuringHydrate && remoteAt > localAt && remoteAt > 0) return "remote";
  if (!customized && remoteAt > 0 && remoteAt >= localAt) return "remote";
  if (!customized && localAt > 0) return "local";
  if (!customized) return "none";
  if (remoteAt > localAt && remoteAt > 0) return "remote";
  if (localAt > 0 && localAt >= remoteAt) return "local";
  if (remoteAt > 0) return "remote";
  return "memory";
}

/** A default unstarted Black Mage is not a game. It must not replace one. */
export function isRealProgress(save: {
  started: boolean;
  mainJob: string;
  subJob: string | null;
  exp: number;
  gil: number;
  tp: number;
  engaged: boolean;
  ko: boolean;
  buffs: readonly unknown[];
  log: readonly unknown[];
}): boolean {
  if (save.started || save.engaged || save.ko) return true;
  if (save.exp > 0 || save.gil > 0 || save.tp > 0) return true;
  if (save.subJob) return true;
  if (save.mainJob !== "BLM") return true;
  if (save.buffs.length > 0 || save.log.length > 0) return true;
  return false;
}

function betterProgress(
  left: { save: ProgressSave; extra: Record<string, unknown> } | null,
  right: { save: ProgressSave; extra: Record<string, unknown> } | null,
): { save: ProgressSave; extra: Record<string, unknown> } | null {
  if (!left) return right;
  if (!right) return left;
  const leftReal = isRealProgress(left.save);
  const rightReal = isRealProgress(right.save);
  if (leftReal !== rightReal) return leftReal ? left : right;
  if (left.save.revision !== right.save.revision) return left.save.revision > right.save.revision ? left : right;
  return left.save.savedAt >= right.save.savedAt ? left : right;
}

/** Primary, then the backup, then the parked corrupt blob. A blank boot must not hide a real yard. */
function bestStored(storage: SaveStorage): { save: ProgressSave; extra: Record<string, unknown> } | null {
  return betterProgress(
    betterProgress(progressFromText(storage.getItem(PROGRESS_KEY)), progressFromText(storage.getItem(BACKUP_KEY))),
    progressFromText(storage.getItem(CORRUPT_KEY)),
  );
}

/** Read the newest usable blob. Does not write. Corrupt input leaves storage alone. */
function loadBoot(storage: SaveStorage | null, rememberCorrupt = false): BootProgress {
  const fresh = (): BootProgress => ({ kind: "fresh", ...normalizeProgress({}) });
  if (!storage) return fresh();
  const primary = storage.getItem(PROGRESS_KEY);
  const best = bestStored(storage);
  if (best && isRealProgress(best.save)) return { kind: "saved", ...best };
  if (primary != null) {
    const parsed = parseObject(primary);
    if (parsed) return { kind: "saved", ...normalizeProgress(parsed) };
    if (rememberCorrupt) corruptHold = primary;
    const backup = parseObject(storage.getItem(BACKUP_KEY));
    if (backup) return { kind: "saved", ...normalizeProgress(backup) };
    const legacy = legacySave(storage);
    if (legacy) return { kind: "corrupt", save: legacy, extra: {} };
    return { kind: "corrupt", ...normalizeProgress({}) };
  }
  const legacy = legacySave(storage);
  if (legacy) return { kind: "legacy", save: legacy, extra: {} };
  return fresh();
}

/** Last good blob for the Load button. Null when nothing readable is stored. */
export function readStoredSave(storage: SaveStorage | null): { save: ProgressSave; extra: Record<string, unknown> } | null {
  if (!storage) return null;
  const best = bestStored(storage);
  if (best && isRealProgress(best.save)) return best;
  const primary = storage.getItem(PROGRESS_KEY);
  if (primary != null) {
    const parsed = parseObject(primary);
    if (parsed) return normalizeProgress(parsed);
    const backup = parseObject(storage.getItem(BACKUP_KEY));
    if (backup) return normalizeProgress(backup);
    return null;
  }
  const legacy = legacySave(storage);
  return legacy ? { save: legacy, extra: {} } : null;
}

let corruptHold: string | null = null;
let place = { x: 0, z: 0 };
let placeGen = 0;
let afkBase = 0;
let afkAt = Date.now();
let extra: Record<string, unknown> = {};
export const boot: BootProgress = loadBoot(browserStorage(), true);
place = { ...boot.save.position };
afkBase = boot.save.afk.seconds;
afkAt = Date.now();
extra = boot.extra;
let revision = boot.save.revision;

/** The next write is one step past the snapshot we loaded. An older tab cannot catch up. */
export function nextRevision(): number {
  revision += 1;
  return revision;
}

/** A loaded snapshot sets the counter. The following write is the next one. */
export function adoptRevision(value: number): void {
  revision = Number.isFinite(value) && value > 0 ? Math.floor(value) : 0;
}

export function readPlace(): { x: number; z: number } {
  return place;
}

/** `teleport` asks the yard to move. A quiet write only updates the next save. */
export function writePlace(x: number, z: number, teleport = false): void {
  if (!Number.isFinite(x) || !Number.isFinite(z)) return;
  place = {
    x: Math.min(PLACE_MAX_X, Math.max(PLACE_MIN_X, x)),
    z: Math.min(PLACE_MAX_Z, Math.max(PLACE_MIN_Z, z)),
  };
  if (teleport) placeGen += 1;
}

export function placeGeneration(): number {
  return placeGen;
}

const CAM_YAW = 0.62;
/** Southern San d'Oria, in the yard. Port San d'Oria, on the quay east of the pier. */
export const HOME_POINTS = {
  crystal: { x: 3.5, z: -4.4 },
  port: { x: 5.184, z: -897.184 },
} as const;

/** Where Return and Warp stand you. The field manual still uses the southern crystal. */
export function homeStand(at: "spawn" | "crystal" | "port"): { x: number; z: number } {
  if (at === "port") return { x: HOME_POINTS.port.x, z: HOME_POINTS.port.z + 1.15 };
  if (at !== "crystal") return { x: 0, z: 0 };
  const lookX = -Math.sin(CAM_YAW);
  const lookZ = -Math.cos(CAM_YAW);
  return { x: HOME_POINTS.crystal.x - lookX * 0.95, z: HOME_POINTS.crystal.z - lookZ * 0.95 };
}

/** Center of the southern crystal to this point, in yalms. */
export function yardsFromCrystal(x: number, z: number): number {
  return Math.hypot(x - HOME_POINTS.crystal.x, z - HOME_POINTS.crystal.z);
}

/** The home point crystal within talk range, if you are standing at one. */
export function homeHere(x: number, z: number): "crystal" | "port" | null {
  const bailey = Math.hypot(x - HOME_POINTS.crystal.x, z - HOME_POINTS.crystal.z);
  const port = Math.hypot(x - HOME_POINTS.port.x, z - HOME_POINTS.port.z);
  if (bailey <= NPC_TALK && bailey <= port) return "crystal";
  if (port <= NPC_TALK) return "port";
  return null;
}

/** Retail NPC talk range. Six yalms from a crystal's center. */
export function nearHomeCrystal(x: number, z: number): boolean {
  return homeHere(x, z) != null;
}

export function readAfkSeconds(): number {
  return afkBase + Math.max(0, (Date.now() - afkAt) / 1000);
}

export function setAfkSeconds(seconds: number): void {
  afkBase = Number.isFinite(seconds) ? Math.max(0, seconds) : 0;
  afkAt = Date.now();
}

export function readExtra(): Record<string, unknown> {
  return extra;
}

export function setExtra(next: Record<string, unknown>): void {
  extra = next;
}

export function bootShouldPersist(): boolean {
  return boot.kind === "legacy" || boot.kind === "corrupt" || corruptHold != null;
}

export function writeSerialized(text: string, storage: SaveStorage | null = browserStorage()): void {
  if (!storage) return;
  try {
    if (corruptHold != null) {
      storage.setItem(CORRUPT_KEY, corruptHold);
      corruptHold = null;
    }
    const current = storage.getItem(PROGRESS_KEY);
    if (current && current !== text && parseObject(current)) storage.setItem(BACKUP_KEY, current);
    storage.setItem(PROGRESS_KEY, text);
  } catch {
    /* storage can be full or blocked */
  }
}

export function resetStored(storage: SaveStorage | null = browserStorage()): void {
  if (!storage) return;
  corruptHold = null;
  const keys = [PROGRESS_KEY, BACKUP_KEY, CORRUPT_KEY, ...LEGACY_KEYS];
  for (const key of keys) {
    try {
      storage.removeItem(key);
    } catch {
      /* ignore */
    }
  }
}

export function writeJobs(main: JobId, sub: JobId | null, race: RaceId, storage: SaveStorage | null = browserStorage()): void {
  try {
    storage?.setItem(JOB_KEY, JSON.stringify({ main, sub, race }));
  } catch {
    /* ignore */
  }
}

export function writeLoadout(loadout: Loadout, storage: SaveStorage | null = browserStorage()): void {
  try {
    storage?.setItem(LOADOUT_KEY, JSON.stringify(loadout));
  } catch {
    /* ignore */
  }
}

export function writeHotbar(hotbar: (string | null)[], storage: SaveStorage | null = browserStorage()): void {
  try {
    storage?.setItem(HOTBAR_KEY, JSON.stringify(hotbar));
  } catch {
    /* ignore */
  }
}

export function writeHome(homeAt: "spawn" | "crystal" | "port", storage: SaveStorage | null = browserStorage()): void {
  try {
    storage?.setItem(HOME_KEY, homeAt);
  } catch {
    /* ignore */
  }
}

function memoryStorage(seed: Record<string, string> = {}): SaveStorage {
  const map = new Map(Object.entries(seed));
  return {
    getItem: (key) => (map.has(key) ? map.get(key)! : null),
    setItem: (key, value) => {
      map.set(key, value);
    },
    removeItem: (key) => {
      map.delete(key);
    },
  };
}

const GRANTED_BLUE = "Foot Kick,Pollen,Sandspin,Power Attack,Sprout Smack,Wild Oats,Cocoon,Metallic Body,Queasyshroom,Battle Dance,Head Butt,Feather Storm,Healing Breeze,Sheep Song,Helldive,Bludgeon,Cursed Sphere,Blastbomb,Claw Cyclone,Poison Breath,Soporific,Screwdriver,Bomb Toss,Grand Slam,Chaotic Eye,Sound Blast,Death Ray,Smite of Rage,Digest,Pinecone Bomb,MP Drainkiss,Blitzstrahl,Stinking Gas,Mandibular Bite,Magnetite Cloud,Uppercut,Blank Gaze,Jet Stream,Mysterious Light,Terror Touch,Venom Shell,Refueling,Magic Fruit,Memento Mori,Frenetic Rip,Zephyr Mantle,Cannonball,Disseverment,Mind Blast,Actinic Burst,Plasma Charge,Geist Wall,Awful Eye,Blood Saber,Jettatura,Ice Break,Self-Destruct,Frightful Roar,Cold Wave,Filamented Hold,Hecatomb Wave,Radiant Breath,Feather Barrier,Flying Hip Press,Light of Penance,Death Scissors,Dimensional Death,Spiral Spin,Maelstrom,Eyes On Me,Seedspray,Bad Breath,Body Slam,1000 Needles,Spinal Cleave,Frypan,Hydro Shot,Feather Tickle,Yawn,Voracious Trunk,Infrasonics,Frost Breath,Sandspray,Corrosive Ooze,Diamondhide,Enervation,Warm-Up,Firespit,Tail Slap,Hysteric Barrage,Regurgitation,Amplification,Asuran Claws,Lowing,Heat Breath,Triumphant Roar,Sickle Slash,Sub-zero Smash,Saline Coat,Ram Charge,Temporal Shift,Magic Hammer,Reactor Cool,Exuviation,Vertical Cleave";
const DEFAULT_BLUE = "Sandspin,Pollen,Power Attack,Sprout Smack,Wild Oats,Cocoon,Metallic Body,Queasyshroom,Battle Dance,Head Butt,Feather Storm,Healing Breeze,Sheep Song,Helldive,Bludgeon,Cursed Sphere,Blastbomb,Claw Cyclone,Poison Breath,Soporific,Screwdriver,Bomb Toss,Grand Slam,Chaotic Eye,Sound Blast,Death Ray,Smite of Rage,Digest,Pinecone Bomb,MP Drainkiss,Blitzstrahl,Stinking Gas,Mandibular Bite,Magnetite Cloud,Uppercut,Blank Gaze,Jet Stream,Mysterious Light,Terror Touch,Venom Shell,Refueling,Magic Fruit,Memento Mori,Frenetic Rip,Zephyr Mantle,Cannonball,Disseverment,Mind Blast,Actinic Burst,Plasma Charge,Geist Wall,Awful Eye,Blood Saber,Jettatura,Ice Break,Self-Destruct,Frightful Roar,Cold Wave,Filamented Hold,Hecatomb Wave,Radiant Breath,Feather Barrier,Flying Hip Press,Light of Penance,Death Scissors,Dimensional Death,Spiral Spin,Maelstrom,Eyes On Me,Seedspray,Bad Breath,Body Slam,1000 Needles,Spinal Cleave,Frypan,Hydro Shot,Feather Tickle,Yawn,Voracious Trunk,Infrasonics,Frost Breath,Sandspray,Corrosive Ooze,Diamondhide,Enervation,Warm-Up,Firespit,Tail Slap,Hysteric Barrage,Regurgitation,Amplification,Asuran Claws,Lowing,Heat Breath,Triumphant Roar,Sickle Slash,Sub-zero Smash,Saline Coat,Ram Charge,Temporal Shift,Magic Hammer,Reactor Cool,Exuviation,Vertical Cleave";

export function assertSave(): void {
  assertInventory();
  assertCraft();
  assertSignet();
  assertDrops();
  assertAfk();
  const legacyCamp = normalizeProgress({
    afkFarm: {
      active: true,
      startTimestamp: 1_700_000_000_000,
      zoneId: "west-ronfaure",
      farmingEfficiency: 1,
      level: 75,
      exp: 0,
      sellMeat: true,
      mode: "nm",
      groupId: "tropical-rarab",
      preyLevel: 75,
      preyHp: 4000,
    },
  });
  const moved = legacyCamp.save.afkFarm;
  if (!moved || moved.zoneId !== "ronfaure-west" || moved.groupId || moved.preyLevel != null || moved.mode !== "nm" || "sellMeat" in moved) {
    throw new Error("old rarab camp did not migrate");
  }
  const blended = normalizeProgress({
    afkFarm: {
      active: true,
      startTimestamp: 1_700_000_000_000,
      zoneId: "ronfaure-west",
      preyLevel: 8,
      preyHp: 200,
      sellMeat: false,
      preyDrops: [{ id: "hare-meat", found: "hare meat", tier: "common" }],
    },
  });
  if (blended.save.afkFarm?.preyLevel != null || blended.save.afkFarm?.groupId || blended.save.afkFarm?.mode !== "exp") {
    throw new Error("blended camp kept a snapshot");
  }
  const keptGroup = normalizeProgress({
    afkFarm: {
      active: true,
      startTimestamp: 1_700_000_000_000,
      zoneId: "ronfaure-forest",
      mode: "exp",
      groupId: "forest-hare",
      groupName: "Forest Hare",
      groupFamily: "Rabbit",
      preyLevel: 1,
      preyHp: 20,
      preyDrops: [{ id: "hare-meat", found: "hare meat", tier: "rare" }],
    },
  });
  const legacyKept = keptGroup.save.afkFarm;
  if (!legacyKept || legacyKept.zoneId !== "ronfaure-west" || legacyKept.groupId || legacyKept.preyLevel != null) throw new Error("legacy zone kept a chosen group");
  const liveGroup = normalizeProgress({
    afkFarm: {
      active: true,
      startTimestamp: 1_700_000_000_000,
      zoneId: "ronfaure-west",
      mode: "exp",
      groupId: "forest-hare",
      groupName: "Forest Hare",
      groupFamily: "Rabbit",
      preyLevel: 1,
      preyHp: 20,
      preyDrops: [{ id: "hare-meat", found: "hare meat", tier: "rare" }],
    },
  });
  const live = liveGroup.save.afkFarm;
  if (!live || live.groupId !== "forest-hare" || live.groupName !== "Forest Hare" || live.preyLevel !== 1 || live.preyDrops?.[0]?.id !== "hare-meat" || live.mode !== "exp") {
    throw new Error("chosen group did not save");
  }
  assertMagian();
  const partial = normalizeProgress({ version: 1, mainJob: "WHM", gil: 15 });
  if (partial.save.gil !== 15 || partial.save.exp !== 0 || partial.save.subJob !== null) throw new Error("old save did not fill defaults");
  if (partial.save.zone !== "battle" || partial.save.position.x !== 0) throw new Error("missing place");
  if (partial.save.level !== 75) throw new Error("level default");
  if (partial.save.skills["Healing Magic"] !== 276) throw new Error("healing skill was not re-capped");
  if (partial.save.inventory["bronze-sword"] !== 1) throw new Error("new gear was not owned");
  if (partial.save.equipSets.tp.main !== null || partial.save.equipSets.idle.body !== null) throw new Error("old save grew equipment sets");
  if (!partial.save.magian || partial.save.magian.active || partial.save.magian.stones !== 0) throw new Error("old save grew a magian trial");
  const kept = normalizeProgress({ magian: { active: { itemId: "bronze-sword", trial: "str" }, augments: { "bronze-harness": "vit" }, stones: 2 } });
  if (kept.save.magian.active?.itemId !== "bronze-sword" || kept.save.magian.active.trial !== "str") throw new Error("magian trial did not round-trip");
  if (kept.save.magian.augments["bronze-harness"] !== "vit" || kept.save.magian.stones !== 2) throw new Error("magian enchantment did not round-trip");
  if (partial.save.gearBase.main !== partial.save.loadout.main) throw new Error("gear base");
  if (partial.save.inventory["fish-oil-broth"] !== 12) throw new Error("jug stack");
  if (partial.save.inventory["automaton-oil"] !== 12) throw new Error("oil stack");
  if (partial.save.inventory["pet-food-zeta"] !== 12) throw new Error("zeta stack");
  if (!ITEMS["pet-food-zeta"] || ITEMS["pet-food-zeta"].level !== 72 || canWear(ITEMS["pet-food-zeta"], "BST")) throw new Error("zeta item");
  if (partial.save.inventory["pet-food-alpha"] !== 12 || ITEMS["pet-food-alpha"]?.level !== 12 || canWear(ITEMS["pet-food-alpha"], "BST")) throw new Error("alpha stack");
  if (partial.save.started !== false) throw new Error("a partial save is not a finished run");
  const bubble = normalizeProgress({ buffs: [{ name: "Indi-Refresh", left: 180, hold: true, power: 5, indiFrom: "sylvie" }, { name: "Hasso", left: 300 }] });
  if (bubble.save.buffs.some((buff) => buff.name === "Indi-Refresh")) throw new Error("a borrowed Indi was saved");
  if (!bubble.save.buffs.some((buff) => buff.name === "Hasso")) throw new Error("Hasso was dropped with the bubble");
  const ownIndi = normalizeProgress({ buffs: [{ name: "Indi-Refresh", left: 90, power: 4 }] });
  if (ownIndi.save.buffs[0]?.name !== "Indi-Refresh" || ownIndi.save.buffs[0]?.hold === true) throw new Error("own Indi was dropped");
  const owned = normalizeProgress({ inventory: { "future-blade": 3, "bronze-sword": 0 } });
  if (owned.save.inventory["future-blade"] !== 3 || owned.save.inventory["bronze-sword"] !== 0) throw new Error("inventory counts");
  if (owned.save.inventory["ash-staff"] !== 1) throw new Error("a missing item id defaulted wrong");
  if (owned.save.inventory["pet-food-zeta"] !== 12) throw new Error("old save zeta");
  if (owned.save.inventory["pet-food-epsilon"] !== 12) throw new Error("old save epsilon");
  if (owned.save.inventory["automaton-oil"] !== 12) throw new Error("old save oil");
  const hinted = normalizeProgress({ mainJob: "NIN", level: 50 });
  if (hinted.save.jobLevels.NIN !== 50 || hinted.save.level !== 50) throw new Error("level hint");
  if (hinted.save.jobLevels.WAR !== 75) throw new Error("other jobs stay at the cap");
  const chain = normalizeProgress({ skillchain: { props: ["NotAProp", "Fusion"], age: 4, name: "Nope", step: 2, burst: 3 } });
  if (!chain.save.skillchain || chain.save.skillchain.props.join() !== "Fusion" || chain.save.skillchain.name !== null) throw new Error("bad skillchain props");
  if (chain.save.skillchain.age !== 4 || chain.save.skillchain.burst !== 3) throw new Error("skillchain window");
  if (normalizeProgress({ hareHp: 0 }).save.hareHp !== HARE.hpNatural) throw new Error("a dead hare must not stick at 0");
  const carried = normalizeProgress({ version: 1, futureFlag: { a: 1 }, gil: 9, madeUp: true });
  const text = serializeProgress(carried.save, carried.extra);
  const parsed = JSON.parse(text) as { futureFlag?: { a?: number }; madeUp?: boolean; gil?: number };
  if (parsed.futureFlag?.a !== 1 || parsed.madeUp !== true || parsed.gil !== 9) throw new Error("unknown key dropped");
  const again = normalizeProgress(parsed);
  const parsed2 = JSON.parse(serializeProgress(again.save, again.extra)) as { futureFlag?: { a?: number }; madeUp?: boolean };
  if (parsed2.futureFlag?.a !== 1 || parsed2.madeUp !== true) throw new Error("unknown key dropped on round trip");
  const empty = loadBoot(memoryStorage());
  if (empty.kind !== "fresh" || empty.save.started !== false) throw new Error("empty storage is a new game");
  const legacyStore = memoryStorage({ [JOB_KEY]: JSON.stringify({ main: "NIN", sub: "WAR", race: "mithra" }) });
  const legacy = loadBoot(legacyStore);
  if (legacy.kind !== "legacy" || legacy.save.mainJob !== "NIN" || legacy.save.subJob !== "WAR" || legacy.save.race !== "mithra") throw new Error("legacy jobs did not migrate");
  if (legacy.save.started !== true) throw new Error("legacy progress should resume");
  if (legacyStore.getItem(PROGRESS_KEY) != null) throw new Error("reading legacy wrote a blob");
  const junk = "{";
  const broken = memoryStorage({ [PROGRESS_KEY]: junk, [JOB_KEY]: JSON.stringify({ main: "SAM", sub: null, race: "galka" }) });
  const corrupt = loadBoot(broken);
  if (corrupt.kind !== "corrupt" || corrupt.save.mainJob !== "SAM" || corrupt.save.race !== "galka") throw new Error("corrupt did not keep legacy");
  if (broken.getItem(PROGRESS_KEY) !== junk) throw new Error("corrupt payload was wiped");
  const good = serializeProgress(normalizeProgress({ mainJob: "NIN", gil: 4 }).save, {});
  const backed = memoryStorage({ [PROGRESS_KEY]: junk, [BACKUP_KEY]: good });
  const fromBackup = loadBoot(backed);
  if (fromBackup.kind !== "saved" || fromBackup.save.mainJob !== "NIN" || fromBackup.save.gil !== 4) throw new Error("backup was ignored");
  if (backed.getItem(PROGRESS_KEY) !== junk) throw new Error("backup load wiped the corrupt blob");
  const yard = normalizeProgress({
    mainJob: "DRK",
    subJob: "WAR",
    gambits: { player: { on: true, slots: [{ target: "self", condition: "nothing", action: "ability:sentinel" }] } },
  });
  const brought = progressFromText(serializeProgress(yard.save, yard.extra));
  const broughtSlot = brought?.save.gambits.player?.slots[0];
  if (!brought || brought.save.mainJob !== "DRK" || brought.save.subJob !== "WAR") throw new Error("job did not round-trip");
  if (!brought.save.gambits.player?.on || broughtSlot?.action !== "ability:sentinel" || broughtSlot.target !== "self") throw new Error("gambit did not round-trip");
  if (chooseYardSource(0, 100, false, false) !== "remote") throw new Error("server yard lost to a fresh boot");
  if (chooseYardSource(200, 100, false, false) !== "local") throw new Error("newer local yard lost");
  if (chooseYardSource(0, 0, false, false) !== "none") throw new Error("empty yard invented a save");
  if (chooseYardSource(0, 100, true, true) !== "remote") throw new Error("blank boot overwrote the server yard");
  if (chooseYardSource(9000, 100, true, true) !== "local") throw new Error("a newer local yard was buried");
  if (chooseYardSource(9000, 0, true, true) !== "local") throw new Error("a new yard was dropped");
  if (chooseYardSource(0, 0, true, false) !== "memory") throw new Error("an edit with no blob was dropped");
  if (chooseYardSource(0, 0, false, true) !== "none") throw new Error("the default yard was uploaded");
  if (chooseYardSource(9000, 100, true, true, false, true) !== "remote") throw new Error("a newer blank boot buried the real yard");
  if (chooseYardSource(100, 9000, false, false, true, false) !== "local") throw new Error("a blank server yard buried a real local game");
  if (isRealProgress(normalizeProgress({}).save)) throw new Error("a fresh boot counted as progress");
  if (!isRealProgress(normalizeProgress({ mainJob: "SCH", started: true }).save)) throw new Error("a started scholar was dropped");
  if (isRealProgress(normalizeProgress({ started: false, mainJob: "BLM" }).save)) throw new Error("an unstarted black mage counted as progress");
  const numbered = normalizeProgress({ mainJob: "SCH", started: true, revision: 4 });
  if (numbered.save.revision !== 4) throw new Error("revision was dropped");
  const numberedBack = progressFromText(serializeProgress(numbered.save, numbered.extra));
  if (numberedBack?.save.revision !== 4 || numberedBack.save.mainJob !== "SCH") throw new Error("revision did not round-trip");
  const trailed = progressFromText(`${serializeProgress(numbered.save, numbered.extra)}}`);
  if (!trailed || trailed.save.revision !== 4 || trailed.save.mainJob !== "SCH" || !trailed.save.started) throw new Error("a trailing brace dropped the yard");
  const parked = memoryStorage({
    [PROGRESS_KEY]: serializeProgress(normalizeProgress({ started: false, mainJob: "BLM" }).save, {}),
    [CORRUPT_KEY]: `${serializeProgress(normalizeProgress({ mainJob: "BLU", subJob: "NIN", started: true, revision: 9 }).save, {})}}`,
  });
  const recovered = loadBoot(parked);
  if (recovered.kind !== "saved" || recovered.save.mainJob !== "BLU" || recovered.save.subJob !== "NIN" || recovered.save.revision !== 9 || !recovered.save.started) {
    throw new Error("a parked yard lost to a blank boot");
  }
  if (parked.getItem(PROGRESS_KEY)?.includes("\"BLM\"") !== true) throw new Error("recovering a parked yard rewrote the blank boot");
  const blue = normalizeProgress({ blueLearned: ["Foot Kick", "Pollen"], blueSet: ["Pollen", "Foot Kick"] });
  if (blue.save.blueLearned.join(",") !== GRANTED_BLUE || blue.save.blueSet.join(",") !== "Pollen,Foot Kick") throw new Error("blue spell save");
  if (normalizeProgress({}).save.blueLearned.join(",") !== DEFAULT_BLUE || normalizeProgress({}).save.blueSet.length !== 0) throw new Error("blue spell default");
  const broughtBlue = progressFromText(serializeProgress(blue.save, {}));
  if (broughtBlue?.save.blueLearned.join(",") !== GRANTED_BLUE || broughtBlue.save.blueSet.join(",") !== "Pollen,Foot Kick") throw new Error("blue spell round trip");
  if (normalizeProgress({}).save.autoHead !== "stormwaker" || normalizeProgress({}).save.autoFrame !== "stormwaker" || normalizeProgress({ autoHead: "nope" }).save.autoHead !== "stormwaker") {
    throw new Error("automaton default");
  }
  const puppet = normalizeProgress({ autoFrame: "stormwaker", autoSet: ["Tension Spring", "Tension Spring", "Nope", "Flame Holder"] });
  if (puppet.save.autoSet.join(",") !== "Tension Spring") throw new Error("automaton attachments");
  const samPool = normalizeProgress({ mainJob: "SAM", exp: 5000, jobLevels: { SAM: 75, WAR: 10 } });
  if (samPool.save.exp !== 5000 || samPool.save.expByJob.SAM !== 5000 || samPool.save.expByJob.WAR !== 0) throw new Error("legacy experience stays on the main job");
  if (samPool.save.jobLevels.WAR !== 10 || samPool.save.jobLevels.SAM !== 75) throw new Error("job levels were rewritten by an empty bar");
  const broughtExp = progressFromText(serializeProgress(samPool.save, samPool.extra));
  if (!broughtExp || broughtExp.save.expByJob.SAM !== 5000 || broughtExp.save.expByJob.WAR !== 0 || broughtExp.save.exp !== 5000) throw new Error("job experience did not round-trip");
  const split = normalizeProgress({ mainJob: "WHM", exp: 1, expByJob: { WHM: 10, BLM: 20 }, jobLevels: { WHM: 75, BLM: 74 } });
  if (split.save.exp !== 10 || split.save.expByJob.WHM !== 10 || split.save.expByJob.BLM !== 20 || split.save.jobLevels.BLM !== 74 || split.save.jobLevels.SAM !== 75) throw new Error("each job keeps its own experience");
  const monk = normalizeProgress({ mainJob: "MNK", exp: 0, expByJob: { MNK: 600 }, jobLevels: { MNK: 1 } });
  if (monk.save.jobLevels.MNK !== 2 || monk.save.exp !== 100 || monk.save.expByJob.MNK !== 100) throw new Error("banked experience levels the job");
}
