/**
 * Retail Rune Fencer toolkit through level 75. No merits and no job points.
 *
 * The job page's brackets, at a level-75 cap with no master levels:
 * through 49 a normal subjob can use the trait or ability. 50–58 need a
 * master-level sub. Max HP Boost III is 60 and the page allows it on a
 * master-level sub; this kit has no master levels, so a sub does not get it.
 * 65 and up are main job only. Elemental Sforzo is the one-hour and is
 * main only. Battuta, Rayke, Inspiration, and Sleight of Sword are merits
 * and are not unlocked. Liement, One for All, and Odyllic Subterfuge are
 * past 75 and are not learned.
 *
 * Naked Hume Rune Fencer grades, AirSkyBoat's row, with no subjob:
 * HP C, MP F, STR C, DEX D, VIT E, AGI B, INT D, MND D, CHR F.
 * Level 75 is 1167 HP, 312 MP, STR 61, DEX 56, VIT 53, AGI 65, INT 56,
 * MND 56, CHR 48. Max HP Boost is not in that HP number.
 *
 * The model wears Runeist Attire, the artifact set: cap rune, coat,
 * mitons, trousers, and bottes, with the winged fauld. The pieces are
 * not equipped, so their stat lines are not on the sheet. Rusty Greatsword
 * is the weapon in hand. Epeolatry is not in the bag.
 *
 * A rune is one buff per element. Power is the stack. Recasting that rune
 * refreshes the five minutes and adds a charge. The bank is 1, then 2 at
 * 35, then 3 at 65 and only on the main job. A level-37 sub holds 2.
 * At the cap, the oldest charge is the one that drops. Swipe spends one
 * charge of the newest. Lunge spends one charge per hit, newest first,
 * and stops when the target drops, so later charges can stay. Gambit
 * spends the bank.
 * Vallation and Pflug snapshot the bank. They do not spend it.
 * Valiance is that same cut for the party within 14'. It does not overwrite
 * Vallation. Vallation overwrites Valiance. The cut is stored, not rolled.
 * The eight runes share one recast. Using any of them starts the 0:05
 * clock on the other seven. Swipe is 1:30 and Lunge is 3:00. They do not share.
 * Swordplay's tick is not printed. This yard uses 3 seconds, the same
 * clock as Regen, and labels that a stand-in. Swipe and Lunge range is
 * not printed. This yard uses 10'.
 *
 * A connecting weapon hit also deals additional effect damage. The element
 * is the rune with the most copies. A tie uses the newest. The amount is a
 * band on main-hand DPS, not magic attack. Haste, Dual Wield, and Martial
 * Arts do not change that DPS. Day and elemental affinity are not rolled.
 * A storm still moves the hit by 10%.
 */

import { skillCap, type SkillRank } from "./skills";
import { characterBase, type JobId } from "./stats";
import type { JobAccess } from "./blm";

export type RuneName = "Ignis" | "Gelus" | "Flabra" | "Tellus" | "Sulpor" | "Unda" | "Lux" | "Tenebrae";

export const RUNE_NAMES: readonly RuneName[] = ["Ignis", "Gelus", "Flabra", "Tellus", "Sulpor", "Unda", "Lux", "Tenebrae"];

export type RunAbility = {
  name: string;
  level: number;
  recast: number;
  duration: number;
  access: JobAccess;
  effect: string;
  merit?: boolean;
};

export type RunTrait = {
  name: string;
  level: number;
  access: JobAccess;
  effect: string;
  merit?: boolean;
};

export type RunSkill = {
  name: string;
  rank: SkillRank;
};

const RUNE_SET = new Set<string>(RUNE_NAMES);

export function isRuneName(name: string): name is RuneName {
  return RUNE_SET.has(name);
}

/** 1 from the start, 2 at 35, 3 at 65 and only as main. A level-37 sub holds 2. */
export function runeCap(level: number, main: boolean): number {
  if (level < 1) return 0;
  if (level >= 65 && main) return 3;
  if (level >= 35) return 2;
  return 1;
}

/**
 * Rune enchantment. floor(49 * level / 99 + 5.5). Merits and job points are not unlocked.
 * Level 75 is floor(3675 / 99 + 5.5) = 42.
 */
export function runeResistance(level: number): number {
  if (level <= 0) return 0;
  return Math.floor((49 * level) / 99 + 5.5);
}

/** Two bits per rune, 0–3, in RUNE_NAMES order. Vallation and Pflug snapshot this. */
export function packRunes(runes: readonly { name: string; power?: number }[]): number {
  let pack = 0;
  for (let i = 0; i < RUNE_NAMES.length; i++) {
    const row = runes.find((rune) => rune.name === RUNE_NAMES[i]);
    const n = Math.max(0, Math.min(3, row?.power ?? 0));
    pack |= n << (i * 2);
  }
  return pack;
}

export function unpackRunes(pack: number): { name: RuneName; power: number }[] {
  const out: { name: RuneName; power: number }[] = [];
  for (let i = 0; i < RUNE_NAMES.length; i++) {
    const power = (pack >> (i * 2)) & 3;
    if (power > 0) out.push({ name: RUNE_NAMES[i], power });
  }
  return out;
}

/** Vallation cuts the element opposite the rune. Gambit raises damage of the rune's own element. */
const VALLATION_CUT: Record<RuneName, string> = {
  Ignis: "ice",
  Gelus: "wind",
  Flabra: "earth",
  Tellus: "thunder",
  Sulpor: "water",
  Unda: "fire",
  Lux: "dark",
  Tenebrae: "light",
};

const RUNE_ELEMENT: Record<RuneName, string> = {
  Ignis: "fire",
  Gelus: "ice",
  Flabra: "wind",
  Tellus: "earth",
  Sulpor: "thunder",
  Unda: "water",
  Lux: "light",
  Tenebrae: "dark",
};

const PFLUG_STATUS: Record<RuneName, string> = {
  Ignis: "Paralyze and Bind",
  Gelus: "Silence and Gravity",
  Flabra: "Petrify and Slow",
  Tellus: "Stun",
  Sulpor: "Poison",
  Unda: "Amnesia and Plague",
  Lux: "Sleep, Blind, and Curse",
  Tenebrae: "Sleep and Charm",
};

const PULSE_STAT: Record<Exclude<RuneName, "Tenebrae">, "str" | "dex" | "vit" | "agi" | "int" | "mnd" | "chr"> = {
  Ignis: "str",
  Gelus: "dex",
  Flabra: "vit",
  Tellus: "agi",
  Sulpor: "int",
  Unda: "mnd",
  Lux: "chr",
};

export function vallationElement(name: RuneName): string {
  return VALLATION_CUT[name];
}

/**
 * Equipment-screen elemental resistance from harbored runes.
 * Each charge adds runeResistance(level) to the element that rune resists, not the rune's own element.
 * Vallation, Pflug, and the other wards are not this number. Merits and job points are not unlocked.
 */
export function harboredResistance(buffs: readonly { name: string; power?: number }[], runLevel: number): Record<string, number> {
  const out: Record<string, number> = { fire: 0, ice: 0, wind: 0, earth: 0, thunder: 0, water: 0, light: 0, dark: 0 };
  const each = runeResistance(runLevel);
  if (each <= 0) return out;
  for (const buff of buffs) {
    if (!isRuneName(buff.name) || (buff.power ?? 0) <= 0) continue;
    const charges = Math.max(0, Math.min(3, Math.floor(buff.power ?? 0)));
    out[vallationElement(buff.name)] += each * charges;
  }
  return out;
}

export function runeElement(name: RuneName): string {
  return RUNE_ELEMENT[name];
}

/** −15% specific damage taken per rune of that opposing element. Not rolled: this yard has no elemental damage-taken path. */
export function vallationSdt(pack: number, element: string): number {
  let cut = 0;
  for (const row of unpackRunes(pack)) {
    if (VALLATION_CUT[row.name] === element) cut += 15 * row.power;
  }
  return cut;
}

/**
 * Swipe and Lunge. floor(skill * (0.5 + 0.25 * n)).
 * n is how many of that element are harbored. A subjob forces n to 1.
 * Swipe uses the rune it spends. Lunge hits once per charge. A charge of
 * the element you hold the most of uses that full count. A lesser element
 * uses one. No job points and no gear. Day, weather, resist, and magic
 * burst are not in this pipeline. Neither feeds TP.
 */
export function runeStrike(skill: number, count: number, main: boolean): number {
  const n = main ? Math.max(1, count) : 1;
  return Math.floor(Math.max(0, skill) * (0.5 + 0.25 * n));
}

/** Gambit's stored pack, as the status line. 10% per charge of the rune's own element. Not rolled. */
export function gambitLine(pack: number): string {
  const parts = unpackRunes(pack).map((rune) => `${runeElement(rune.name)} +${10 * rune.power}%`);
  return parts.length ? parts.join(", ") : "no runes";
}

/** Main-hand DPS for the rune additional effect. Two decimal places, then a cap of 21. */
export const RUNE_DPS_CAP = 21;

export type RuneDpsKind = "weapon" | "dual" | "h2h";

/**
 * Unmodified weapon DPS. Haste is not an input.
 * A two-handed or one-handed weapon is (DMG × 60) ÷ delay.
 * Dual wield is that main-hand number ÷ 2. The trait that shortens delay is not used.
 * Hand-to-hand ignores Martial Arts. The item delay includes the 480 base,
 * so the extra delay is delay − 480, and the denominator is 240 + that extra.
 */
export function runeEnhancementDps(dmg: number, delay: number, kind: RuneDpsKind): number {
  if (delay <= 0 || dmg < 0) return 0;
  let raw = 0;
  if (kind === "h2h") {
    const extra = Math.max(0, delay - 480);
    raw = ((dmg + 3) * 60) / (240 + extra);
  } else if (kind === "dual") raw = ((dmg * 60) / delay) / 2;
  else raw = (dmg * 60) / delay;
  return Math.min(RUNE_DPS_CAP, Math.floor(raw * 100) / 100);
}

/** Inclusive damage band for 1, 2, or 3 copies of the striking rune. */
export function runeEnhancementBand(dps: number, copies: number): { low: number; high: number } {
  const n = copies >= 3 ? 3 : copies === 2 ? 2 : 1;
  const lowRate = n === 3 ? 1.9 : n === 2 ? 1.4 : 0.97;
  const highRate = n === 3 ? 2.2 : n === 2 ? 1.7 : 1.3;
  const low = Math.floor(Math.max(0, dps) * lowRate);
  const high = Math.floor(Math.max(0, dps) * highRate);
  return { low, high: Math.max(low, high) };
}

/** roll is 0 through 1. 0 is the low end. Just under 1 is the high end. */
export function runeEnhancementDamage(dps: number, copies: number, roll: number): number {
  const band = runeEnhancementBand(dps, copies);
  if (band.high <= band.low) return band.low;
  const span = band.high - band.low;
  const t = Math.max(0, Math.min(0.999999, roll));
  return band.low + Math.floor(t * (span + 1));
}

/**
 * The rune a melee hit strikes with. The most copies win.
 * A tie, including three different runes, uses the newest.
 */
export function runeOffensive(runes: readonly { name: string; left?: number; power?: number }[]): { name: RuneName; element: string; copies: number } | null {
  const live: RuneRow[] = [];
  for (const row of runes) {
    if (!isRuneName(row.name) || (row.power ?? 0) <= 0) continue;
    live.push({ name: row.name, left: row.left ?? 0, power: Math.max(0, Math.min(3, row.power ?? 0)) });
  }
  if (!live.length) return null;
  const max = live.reduce((best, row) => Math.max(best, row.power), 0);
  const top = live.filter((row) => row.power === max);
  const pick = top.length === 1 ? top[0] : newestRune(top);
  if (!pick) return null;
  return { name: pick.name, element: runeElement(pick.name), copies: pick.power };
}

export type RuneRow = { name: RuneName; left: number; power: number };

/** Newest charge is the one with the most time left. A tie keeps the later row. */
export function newestRune(runes: readonly RuneRow[]): RuneRow | null {
  let best: RuneRow | null = null;
  for (const row of runes) {
    if (row.power <= 0) continue;
    if (!best || row.left >= best.left) best = row;
  }
  return best;
}

/** Spend one charge of the newest rune. Returns the next bank. */
export function spendNewest(runes: readonly RuneRow[]): RuneRow[] {
  const next = runes.map((row) => ({ ...row }));
  const hit = newestRune(next);
  if (!hit) return next.filter((row) => row.power > 0);
  hit.power -= 1;
  return next.filter((row) => row.power > 0);
}

/**
 * Add one charge. At the cap, one charge of the oldest rune drops first.
 * The refreshed rune lasts 5:00 and is the newest.
 */
export function harborRune(runes: readonly RuneRow[], name: RuneName, cap: number): RuneRow[] {
  const next = runes.map((row) => ({ ...row })).filter((row) => row.power > 0);
  const total = next.reduce((sum, row) => sum + row.power, 0);
  if (total >= cap && cap > 0) {
    let oldest = 0;
    for (let i = 1; i < next.length; i++) if (next[i].left < next[oldest].left) oldest = i;
    next[oldest].power -= 1;
    if (next[oldest].power <= 0) next.splice(oldest, 1);
  }
  const had = next.find((row) => row.name === name);
  if (had) {
    had.power += 1;
    had.left = 300;
    return next;
  }
  next.push({ name, left: 300, power: 1 });
  return next;
}

export function runeCount(runes: readonly { name: string; power?: number }[], name: RuneName): number {
  return runes.find((row) => row.name === name)?.power ?? 0;
}

/** Pflug. 15% per rune as main, 10% as sub, snapshotted. Not rolled: nothing here tests those statuses. */
export function pflugResist(pack: number, main: boolean): number {
  const each = main ? 15 : 10;
  return unpackRunes(pack).reduce((sum, row) => sum + each * row.power, 0);
}

export const SWORDPLAY_TICK = 3;
export const SWORDPLAY_STEP = 3;
export const SWORDPLAY_CAP = 60;
/** Range is not printed. Stand-in, same yard as a short weapon ability. */
export const SWIPE_RANGE = 10;

export function tickSwordplay(power: number, acc: number, dt: number): { power: number; acc: number; gained: number } {
  let next = power;
  let clock = acc + dt;
  let gained = 0;
  while (clock >= SWORDPLAY_TICK && next < SWORDPLAY_CAP) {
    clock -= SWORDPLAY_TICK;
    const step = Math.min(SWORDPLAY_STEP, SWORDPLAY_CAP - next);
    next += step;
    gained += step;
  }
  if (next >= SWORDPLAY_CAP) clock = 0;
  return { power: next, acc: clock, gained };
}

export function vivaciousPulse(
  divine: number,
  runes: readonly { name: string; power?: number }[],
  stats: { str: number; dex: number; vit: number; agi: number; int: number; mnd: number; chr: number },
): { hp: number; mp: number } {
  let hp = 10 + Math.floor(divine / 2);
  let tenebrae = 0;
  for (const row of runes) {
    if (!isRuneName(row.name) || (row.power ?? 0) <= 0) continue;
    if (row.name === "Tenebrae") {
      tenebrae += row.power ?? 0;
      continue;
    }
    hp += Math.floor(stats[PULSE_STAT[row.name]] / 2) * (row.power ?? 0);
  }
  const mp = tenebrae > 0 ? Math.floor(divine / 10) * (tenebrae + 1) : 0;
  return { hp, mp };
}

/** Max HP Boost. Tiers replace. Does not stack with Warrior, Monk, Paladin, Ninja, or Blue Mage. */
export function runMaxHp(level: number, access: JobAccess): number {
  if (level >= 60 && access !== "sub") return 120;
  if (level >= 40) return 60;
  if (level >= 20) return 30;
  return 0;
}

/** 1 HP a tick at 35. 2 at 65, main only. The tick is the existing 3-second regen clock. */
export function runAutoRegen(level: number, access: JobAccess): number {
  if (level >= 65 && access === "main") return 2;
  if (level >= 35) return 1;
  return 0;
}

/** Accuracy Bonus. +10 at 50 on a master-level sub, +22 at 70 on main. Same scale as Ranger and Dancer. */
export function runAccuracy(level: number, access: JobAccess): number {
  if (level >= 70 && access === "main") return 22;
  if (level >= 50 && access !== "sub") return 10;
  return 0;
}

/** Magic Defense Bonus. Not on the sheet. No elemental damage-taken path reads it. */
export function runMagicDefense(level: number, access: JobAccess): number {
  if (level >= 70 && access === "main") return 16;
  if (level >= 50 && access !== "sub") return 14;
  if (level >= 30) return 12;
  if (level >= 10) return 10;
  return 0;
}

/** Tenacity. Status resist, not a damage absorb. Not rolled. */
export function runTenacity(level: number): number {
  if (level >= 75) return 0.11;
  if (level >= 45) return 0.09;
  if (level >= 25) return 0.07;
  if (level >= 5) return 0.05;
  return 0;
}

/** Inquartata. Added parry rate. No parry check exists, so it is not rolled. */
export function runInquartata(level: number): number {
  if (level >= 75) return 0.09;
  if (level >= 45) return 0.07;
  if (level >= 15) return 0.05;
  return 0;
}

/** Tactical Parry. TP on a parry. No parry proc exists, so it is not rolled. */
export function runTacticalParry(level: number, access: JobAccess): number {
  if (level >= 60 && access === "main") return 30;
  if (level >= 40) return 20;
  return 0;
}

/** Embolden. Enhancing potency +50% and duration −50% for a spell that lands on you. Potency before gear. */
export function emboldenPotency(active: boolean, value: number): number {
  if (!active) return value;
  return Math.floor(value * 1.5);
}

export function emboldenDuration(active: boolean, seconds: number): number {
  if (!active) return seconds;
  return Math.floor(seconds * 0.5);
}

/**
 * Elemental Sforzo is the one-hour. 0:30, recast 1:00:00. Cumulative enmity 1800, volatile 7000.
 * Runes last 5:00 and recast in 0:05. The eight share that clock. They add no enmity.
 * Vallation and Pflug are 2:00, recast 3:00, enmity 450 / 900.
 * Swordplay is 2:00, recast 5:00, enmity 160 / 320.
 * Swipe recasts in 1:30. Lunge recasts in 3:00. They do not share that clock.
 * Their enmity is dynamic, so none is added. Neither feeds TP.
 * Valiance is 3:00, recast 5:00, enmity 450 / 900.
 * Embolden is 1:00, recast 10:00, enmity 160 / 320.
 * Vivacious Pulse recasts in 1:00. Its enmity is not printed, so none is added.
 * Gambit is 1:00, recast 5:00, enmity 640 / 1280.
 */
export const RUN_ABILITIES: RunAbility[] = [
  {
    name: "Elemental Sforzo",
    level: 1,
    recast: 3600,
    duration: 30,
    access: "main",
    effect: "Nullifies elemental magic damage for 0:30. Recast 1:00:00. The job-point absorb is not unlocked, so nothing is returned as HP or MP. Cumulative enmity 1800, volatile enmity 7000. Main job only.",
  },
  {
    name: "Ignis",
    level: 5,
    recast: 5,
    duration: 300,
    access: "sub",
    effect: "Harbors a fire rune for 5:00. Recast 0:05, shared with the other seven runes. The bank is 1, then 2 at 35, then 3 at 65 on the main job. A level-37 sub holds 2. Recasting adds a charge and refreshes the clock. At the cap the oldest charge drops. Resistance is floor(49 × level / 99 + 5.5). At 75 that is 42. A connecting weapon hit also deals additional effect damage of the rune you hold the most copies of. A tie uses the newest. Rusty Greatsword is DPS 1.84, so one copy is 1 to 2, two copies are 2 to 3, and three are 3 to 4. Magic attack bonus is not applied. Haste, Dual Wield, and Martial Arts do not change the DPS. Day and elemental affinity are not in this yard. A storm moves the hit by 10%. The merit that adds potency is not unlocked. No enmity.",
  },
  {
    name: "Gelus",
    level: 5,
    recast: 5,
    duration: 300,
    access: "sub",
    effect: "Harbors an ice rune for 5:00. Recast 0:05, shared with the other seven. Same bank as Ignis. Same melee additional effect as Ignis. No enmity.",
  },
  {
    name: "Flabra",
    level: 5,
    recast: 5,
    duration: 300,
    access: "sub",
    effect: "Harbors a wind rune for 5:00. Recast 0:05, shared with the other seven. Same bank as Ignis. Same melee additional effect as Ignis. No enmity.",
  },
  {
    name: "Tellus",
    level: 5,
    recast: 5,
    duration: 300,
    access: "sub",
    effect: "Harbors an earth rune for 5:00. Recast 0:05, shared with the other seven. Same bank as Ignis. Same melee additional effect as Ignis. No enmity.",
  },
  {
    name: "Sulpor",
    level: 5,
    recast: 5,
    duration: 300,
    access: "sub",
    effect: "Harbors a lightning rune for 5:00. Recast 0:05, shared with the other seven. Same bank as Ignis. Same melee additional effect as Ignis. No enmity.",
  },
  {
    name: "Unda",
    level: 5,
    recast: 5,
    duration: 300,
    access: "sub",
    effect: "Harbors a water rune for 5:00. Recast 0:05, shared with the other seven. Same bank as Ignis. Same melee additional effect as Ignis. No enmity.",
  },
  {
    name: "Lux",
    level: 5,
    recast: 5,
    duration: 300,
    access: "sub",
    effect: "Harbors a light rune for 5:00. Recast 0:05, shared with the other seven. Same bank as Ignis. Same melee additional effect as Ignis. No enmity.",
  },
  {
    name: "Tenebrae",
    level: 5,
    recast: 5,
    duration: 300,
    access: "sub",
    effect: "Harbors a dark rune for 5:00. Recast 0:05, shared with the other seven. Same bank as Ignis. Same melee additional effect as Ignis. No enmity.",
  },
  {
    name: "Vallation",
    level: 10,
    recast: 180,
    duration: 120,
    access: "sub",
    effect: "Snapshots the runes you hold. For 2:00, each rune cuts specific damage taken of the opposite element by 15%. Ignis cuts ice, Gelus wind, Flabra earth, Tellus lightning, Sulpor water, Unda fire, Lux dark, Tenebrae light. Recast 3:00. It overwrites Valiance. Valiance does not overwrite this. A merit that would add 1% is not unlocked. This yard has no elemental damage-taken roll, so the cut is stored and not applied. Cumulative enmity 450, volatile enmity 900.",
  },
  {
    name: "Swordplay",
    level: 20,
    recast: 300,
    duration: 120,
    access: "sub",
    effect: "Accuracy and evasion +3, then +3 more each tick, up to +60, for 2:00. Recast 5:00. The tick interval is not printed. This yard uses 3 seconds, the same clock as Regen. It does not end early when you take severe damage. That check is not in this yard. Cumulative enmity 160, volatile enmity 320.",
  },
  {
    name: "Swipe",
    level: 25,
    recast: 90,
    duration: 0,
    access: "sub",
    effect: "Deals damage from the newest rune and spends that one charge. Recast 1:30, not shared with Lunge. Damage is floor(main-hand skill × (0.5 + 0.25 × n)). n is how many of that rune you hold. A subjob forces n to 1. At Great Sword 276, one rune is 207 and three of the same is 345. Day, weather, resist, magic burst, job points, and Lunge gear are not in this pipeline. A shadow on the target nullifies it, and the rune is still spent. This foe has none. Your own Blink does not. It does not feed TP. Range is not printed. This yard uses 10'. Enmity is dynamic, so none is added.",
  },
  {
    name: "Lunge",
    level: 25,
    recast: 180,
    duration: 0,
    access: "sub",
    effect: "Swipe's formula once per charge, newest first. Recast 3:00, not shared with Swipe. A charge of the element you hold the most of uses that full count on every hit. A lesser element uses one. A subjob forces each hit to one. Three Ignis at Great Sword 276 is 345 a hit, 1035 in all. Three different elements are 207 each, 621 in all. A target shadow nullifies that one charge and the rune is still spent. If a hit would drop the target and more charges remain, that hit is the smallest count that still drops it, and the rest stay. It does not feed TP. Day, weather, resist, and magic burst are not applied. Range is not printed. This yard uses 10'. Enmity is dynamic, so none is added.",
  },
  {
    name: "Pflug",
    level: 40,
    recast: 180,
    duration: 120,
    access: "sub",
    effect: "Snapshots the runes you hold. Self only. For 2:00, each rune adds a status resist: 15% as main, 10% as sub. Ignis is Paralyze and Bind. Gelus is Silence and Gravity. Flabra is Petrify and Slow. Tellus is Stun. Sulpor is Poison. Unda is Amnesia and Plague. Lux is Sleep, Blind, and Curse. Tenebrae is Sleep and Charm. Recast 3:00. Nothing here rolls those resists, so the rate is stored and not applied. A level-37 sub has not learned it. Cumulative enmity 450, volatile enmity 900.",
  },
  {
    name: "Valiance",
    level: 50,
    recast: 300,
    duration: 180,
    access: "master-sub",
    effect: "The same cut as Vallation, for the party within 14', for 3:00. Recast 5:00. It snapshots the runes you hold and does not spend them. It does not overwrite Vallation. Someone who already has Vallation is unaffected, and the recast still starts. Vallation overwrites this. The cut is stored and not applied. A level-37 sub has not learned it. Master levels are not in this yard, so a sub cannot use it. Cumulative enmity 450, volatile enmity 900.",
  },
  {
    name: "Embolden",
    level: 60,
    recast: 600,
    duration: 60,
    access: "main",
    effect: "Enhancing magic that lands on you is +50% potency and −50% duration for 1:00. Recast 10:00. Potency is applied before gear. The job-point raise to 70% is not unlocked. A level-37 sub has not learned it. Cumulative enmity 160, volatile enmity 320. Main job only.",
  },
  {
    name: "Vivacious Pulse",
    level: 65,
    recast: 60,
    duration: 0,
    access: "main",
    effect: "Restores HP from Divine Magic and the runes you hold. Recast 1:00. HP is 10 + floor(divine skill / 2), plus floor(stat / 2) for each rune. Ignis is STR, Gelus DEX, Flabra VIT, Tellus AGI, Sulpor INT, Unda MND, Lux CHR. Tenebrae adds no HP. Any Tenebrae also restores floor(divine / 10) × (that count + 1) MP. Job points and gear potency are not applied. Enmity is not printed, so none is added. Main job only.",
  },
  {
    name: "Gambit",
    level: 70,
    recast: 300,
    duration: 60,
    access: "main",
    effect: "The foe takes 10% more damage of each rune's own element, per charge, for 1:00. Ignis is fire. The bank is spent and every element is stored. This yard does not roll that damage. Recast 5:00. The merit that would shorten it is not unlocked. Runeist Mitons are not equipped, so the duration is not extended. A level-37 sub has not learned it. Range is not printed. This yard uses 10'. Cumulative enmity 640, volatile enmity 1280. Main job only.",
  },
  {
    name: "Battuta",
    level: 75,
    recast: 300,
    duration: 90,
    access: "main",
    merit: true,
    effect: "Merit ability. Not unlocked.",
  },
  {
    name: "Rayke",
    level: 75,
    recast: 300,
    duration: 27,
    access: "main",
    merit: true,
    effect: "Merit effusion. Not unlocked.",
  },
];

export const RUN_TRAITS: RunTrait[] = [
  { name: "Tenacity", level: 5, access: "sub", effect: "Status resist +5%. It is not a damage absorb. Nothing here rolls it." },
  { name: "Tenacity II", level: 25, access: "sub", effect: "Status resist +7%. Replaces Tenacity. Not rolled." },
  { name: "Tenacity III", level: 45, access: "sub", effect: "Status resist +9%. Replaces Tenacity II. A level-37 sub has not learned it. Not rolled." },
  { name: "Tenacity IV", level: 75, access: "main", effect: "Status resist +11%. Replaces Tenacity III. Main job only. Not rolled." },
  { name: "Magic Defense Bonus", level: 10, access: "sub", effect: "Magic defense +10. No elemental damage-taken path reads it." },
  { name: "Magic Defense Bonus II", level: 30, access: "sub", effect: "Magic defense +12. Replaces the first tier." },
  { name: "Magic Defense Bonus III", level: 50, access: "master-sub", effect: "Magic defense +14. A level-37 sub has not learned it. A master-level sub would." },
  { name: "Magic Defense Bonus IV", level: 70, access: "main", effect: "Magic defense +16. Main job only. The next tier is 76 and is not here." },
  { name: "Inquartata", level: 15, access: "sub", effect: "Parry rate +5%. No parry check exists, so it is not rolled." },
  { name: "Inquartata II", level: 45, access: "sub", effect: "Parry rate +7%. A level-37 sub has not learned it. Not rolled." },
  { name: "Inquartata III", level: 75, access: "main", effect: "Parry rate +9%. Main job only. Not rolled." },
  { name: "Max HP Boost", level: 20, access: "sub", effect: "Maximum HP +30. Does not stack with Warrior, Monk, Paladin, Ninja, or Blue Mage. The higher one wins." },
  { name: "Max HP Boost II", level: 40, access: "sub", effect: "Maximum HP +60. A level-37 sub has not learned it." },
  { name: "Max HP Boost III", level: 60, access: "master-sub", effect: "Maximum HP +120. The page allows a master-level sub. This kit has no master levels, so only the main job has it." },
  { name: "Auto Regen", level: 35, access: "sub", effect: "1 HP every 3 seconds. A level-37 sub has this tier." },
  { name: "Auto Regen II", level: 65, access: "main", effect: "2 HP every 3 seconds. Main job only." },
  { name: "Tactical Parry", level: 40, access: "sub", effect: "+20 TP when you parry. A level-37 sub has not learned it. No parry proc exists, so it is not rolled." },
  { name: "Tactical Parry II", level: 60, access: "main", effect: "+30 TP when you parry. Main job only. Not rolled." },
  { name: "Accuracy Bonus", level: 50, access: "master-sub", effect: "Accuracy +10. A level-37 sub has not learned it." },
  { name: "Accuracy Bonus II", level: 70, access: "main", effect: "Accuracy +22. Main job only. Same scale as Ranger and Dancer. They do not stack. The higher one wins." },
  { name: "Inspiration", level: 75, access: "main", merit: true, effect: "Merit trait. Not unlocked." },
  { name: "Sleight of Sword", level: 75, access: "main", merit: true, effect: "Merit trait. Not unlocked." },
];

export const RUN_SKILLS: RunSkill[] = [
  { name: "Great Sword", rank: "A+" },
  { name: "Sword", rank: "A" },
  { name: "Great Axe", rank: "B" },
  { name: "Axe", rank: "B-" },
  { name: "Club", rank: "C-" },
  { name: "Parrying", rank: "A+" },
  { name: "Evasion", rank: "B+" },
  { name: "Divine Magic", rank: "B" },
  { name: "Enhancing Magic", rank: "B-" },
];

export function runSkill(name: string, level: number): number {
  const row = RUN_SKILLS.find((skill) => skill.name === name);
  return row ? skillCap(row.rank, level) : 0;
}

export type RunCastCtx = {
  recastLeft: number;
  runLevel: number;
  runMain: boolean;
  runes: readonly RuneRow[];
  skill: number;
  targeted: boolean;
  distance: number;
  divine: number;
  stats: { str: number; dex: number; vit: number; agi: number; int: number; mnd: number; chr: number };
  /** Shadows on the target. One shadow nullifies one Swipe, or one charge of a Lunge. This foe has none. */
  shadows?: number;
  /** HP the Lunge is hitting. Omitted spends the whole bank. At 0 or below, no charge is spent. */
  targetHp?: number | null;
};

export type RunCast = {
  ok: boolean;
  text: string;
  recast?: number;
  buff?: { name: string; duration: number; power?: number };
  hate?: { ce: number; ve: number };
  /** The whole rune bank after this cast. Present only when the bank changes. */
  runes?: { name: RuneName; duration: number; power: number }[];
  heal?: number;
  mpHeal?: number;
  bash?: number;
  /** A target shadow was spent. This does not pop the caster's Blink. */
  shadowPop?: boolean;
  /** Swipe and Lunge do not feed TP. */
  noTp?: boolean;
  /** Other abilities that start this same recast. The eight runes share one clock. */
  share?: string[];
  replaces?: string[];
  gambit?: { element: string; power: number; left: number };
};

const RUN_BY_NAME = new Map(RUN_ABILITIES.map((ability) => [ability.name, ability]));

function learned(row: RunAbility, ctx: RunCastCtx): boolean {
  if (ctx.runLevel < row.level) return false;
  if (!ctx.runMain && row.access !== "sub") return false;
  return true;
}

function asRows(runes: readonly RuneRow[]): { name: RuneName; duration: number; power: number }[] {
  return runes.filter((row) => row.power > 0).map((row) => ({ name: row.name, duration: row.left, power: row.power }));
}

export function castRune(name: string, ctx: RunCastCtx): RunCast | null {
  const row = RUN_BY_NAME.get(name);
  if (!row) return null;
  if (!learned(row, ctx)) return { ok: false, text: `${name} is not learned.` };
  if (row.merit) return { ok: false, text: `${name} is not unlocked.` };
  if (ctx.recastLeft > 0) return { ok: false, text: `${name} is not ready.` };
  if (isRuneName(name)) {
    const cap = runeCap(ctx.runLevel, ctx.runMain);
    const next = harborRune(ctx.runes, name, cap);
    const held = next.reduce((sum, rune) => sum + rune.power, 0);
    return {
      ok: true,
      text: `${name}. ${runeElement(name)} rune. ${held} of ${cap} harbored. Resistance ${runeResistance(ctx.runLevel)}. Shared recast 0:05.`,
      recast: row.recast,
      runes: asRows(next),
      share: RUNE_NAMES.filter((other) => other !== name),
    };
  }
  if (name === "Elemental Sforzo") {
    return {
      ok: true,
      text: "Elemental Sforzo. Elemental magic damage is nullified for 0:30. Nothing is absorbed. Cumulative enmity 1800, volatile enmity 7000.",
      recast: row.recast,
      buff: { name, duration: row.duration },
      hate: { ce: 1800, ve: 7000 },
    };
  }
  if (name === "Vallation" || name === "Valiance") {
    const pack = packRunes(ctx.runes);
    const cuts = unpackRunes(pack).map((rune) => `${vallationElement(rune.name)} −${15 * rune.power}%`);
    const listed = cuts.length ? cuts.join(", ") : "no runes snapshotted";
    const party = name === "Valiance";
    return {
      ok: true,
      text: party
        ? `Valiance. ${listed}. Party within 14'. It does not overwrite Vallation. The cut is stored and not applied. Cumulative enmity 450, volatile enmity 900.`
        : `Vallation. ${listed}. It overwrites Valiance. The cut is stored and not applied. Cumulative enmity 450, volatile enmity 900.`,
      recast: row.recast,
      buff: { name, duration: row.duration, power: pack },
      hate: { ce: 450, ve: 900 },
      ...(party ? {} : { replaces: ["Valiance"] }),
    };
  }
  if (name === "Swordplay") {
    return {
      ok: true,
      text: `Swordplay. Accuracy and evasion +3. The tick is ${SWORDPLAY_TICK} seconds, a stand-in, up to +${SWORDPLAY_CAP}. Cumulative enmity 160, volatile enmity 320.`,
      recast: row.recast,
      buff: { name, duration: row.duration, power: 3 },
      hate: { ce: 160, ve: 320 },
    };
  }
  if (name === "Swipe" || name === "Lunge") {
    if (!ctx.targeted) return { ok: false, text: `${name} needs a target.` };
    if (ctx.distance > SWIPE_RANGE) return { ok: false, text: `${name} is out of range.` };
    if (ctx.runes.every((rune) => rune.power <= 0)) return { ok: false, text: `${name} needs a rune.` };
    if (name === "Swipe") {
      const hit = newestRune(ctx.runes);
      if (!hit) return { ok: false, text: "Swipe needs a rune." };
      if ((ctx.shadows ?? 0) > 0) {
        return {
          ok: true,
          text: "Swipe is nullified by a shadow. The rune is spent.",
          recast: row.recast,
          runes: asRows(spendNewest(ctx.runes)),
          shadowPop: true,
          noTp: true,
        };
      }
      const dmg = runeStrike(ctx.skill, hit.power, ctx.runMain);
      return {
        ok: true,
        text: `Swipe. ${hit.name} deals ${dmg}. One charge is spent. Day, weather, and resist are not applied. It does not feed TP. Range ${SWIPE_RANGE}' is a stand-in.`,
        recast: row.recast,
        bash: dmg,
        runes: asRows(spendNewest(ctx.runes)),
        noTp: true,
      };
    }
    const bank = ctx.runes.filter((rune) => rune.power > 0).map((rune, index) => ({ rune: { ...rune }, index }));
    bank.sort((a, b) => b.rune.left - a.rune.left || b.index - a.index);
    const maxCount = bank.reduce((best, row) => Math.max(best, row.rune.power), 0);
    const charges: { rune: RuneRow; count: number }[] = [];
    for (const row of bank) {
      const count = row.rune.power;
      for (let n = 0; n < count; n++) charges.push({ rune: row.rune, count });
    }
    let hp = ctx.targetHp ?? null;
    let shade = Math.max(0, ctx.shadows ?? 0);
    let bash = 0;
    let pops = 0;
    const parts: string[] = [];
    for (let i = 0; i < charges.length; i++) {
      if (hp != null && hp <= 0) break;
      const { rune, count } = charges[i];
      rune.power -= 1;
      if (shade > 0) {
        shade -= 1;
        pops += 1;
        parts.push(`${rune.name} blinked`);
        continue;
      }
      const strength = ctx.runMain && count === maxCount ? count : 1;
      let hit = runeStrike(ctx.skill, strength, ctx.runMain);
      const later = i < charges.length - 1;
      if (later && strength > 1 && hp != null && hp - hit <= 0) {
        for (let smaller = strength - 1; smaller >= 1; smaller--) {
          const lower = runeStrike(ctx.skill, smaller, true);
          if (hp - lower <= 0) hit = lower;
          else break;
        }
      }
      bash += hit;
      parts.push(`${rune.name} ${hit}`);
      if (hp != null) hp -= hit;
    }
    const remain = bank.map((row) => row.rune).filter((rune) => rune.power > 0);
    const tail = parts.length
      ? `${parts.join(", ")}. ${bash} in all. ${remain.length ? "The target is down, so the rest stayed." : "The bank is spent."}`
      : "The target is already down. No rune is spent.";
    return {
      ok: true,
      text: `Lunge. ${tail} Day, weather, and resist are not applied. It does not feed TP.`,
      recast: row.recast,
      ...(bash > 0 ? { bash } : {}),
      runes: asRows(remain),
      ...(pops > 0 ? { shadowPop: true } : {}),
      noTp: true,
    };
  }
  if (name === "Pflug") {
    const pack = packRunes(ctx.runes);
    const rate = ctx.runMain ? 15 : 10;
    const listed = unpackRunes(pack).map((rune) => `${rune.name} ${PFLUG_STATUS[rune.name]} ${rate * rune.power}%`);
    return {
      ok: true,
      text: `Pflug. ${listed.length ? listed.join(", ") : "No runes snapshotted."} Not rolled. Cumulative enmity 450, volatile enmity 900.`,
      recast: row.recast,
      buff: { name, duration: row.duration, power: pack },
      hate: { ce: 450, ve: 900 },
    };
  }
  if (name === "Embolden") {
    return {
      ok: true,
      text: "Embolden. Enhancing magic that lands on you is +50% potency and −50% duration. Cumulative enmity 160, volatile enmity 320.",
      recast: row.recast,
      buff: { name, duration: row.duration },
      hate: { ce: 160, ve: 320 },
    };
  }
  if (name === "Vivacious Pulse") {
    const healed = vivaciousPulse(ctx.divine, ctx.runes, ctx.stats);
    const mp = healed.mp > 0 ? ` ${healed.mp} MP.` : "";
    return {
      ok: true,
      text: `Vivacious Pulse restores ${healed.hp} HP.${mp}`,
      recast: row.recast,
      heal: healed.hp,
      ...(healed.mp > 0 ? { mpHeal: healed.mp } : {}),
    };
  }
  if (name === "Gambit") {
    if (!ctx.targeted) return { ok: false, text: "Gambit needs a target." };
    if (ctx.distance > SWIPE_RANGE) return { ok: false, text: "Gambit is out of range." };
    if (ctx.runes.every((rune) => rune.power <= 0)) return { ok: false, text: "Gambit needs a rune." };
    const pack = packRunes(ctx.runes);
    const lead = newestRune(ctx.runes);
    return {
      ok: true,
      text: `Gambit. ${gambitLine(pack)}. The bank is spent. The extra damage is stored and not rolled. Cumulative enmity 640, volatile enmity 1280.`,
      recast: row.recast,
      runes: [],
      hate: { ce: 640, ve: 1280 },
      gambit: { element: lead ? runeElement(lead.name) : "fire", power: pack, left: 60 },
    };
  }
  return { ok: false, text: `${name} is not learned.` };
}

export function assertRun(): void {
  const naked = characterBase("hume", "RUN", 75);
  if (
    naked.hp !== 1167 ||
    naked.mp !== 312 ||
    naked.str !== 61 ||
    naked.dex !== 56 ||
    naked.vit !== 53 ||
    naked.agi !== 65 ||
    naked.int !== 56 ||
    naked.mnd !== 56 ||
    naked.chr !== 48
  ) {
    throw new Error(`Hume RUN 75 ${naked.hp}/${naked.mp}/${naked.str}/${naked.dex}/${naked.vit}/${naked.agi}/${naked.int}/${naked.mnd}/${naked.chr}`);
  }
  if (runSkill("Great Sword", 75) !== 276 || runSkill("Sword", 75) !== 269 || runSkill("Great Axe", 75) !== 250) throw new Error("RUN great weapons");
  if (runSkill("Axe", 75) !== 240 || runSkill("Club", 75) !== 220 || runSkill("Parrying", 75) !== 276) throw new Error("RUN axe club parry");
  if (runSkill("Evasion", 75) !== 256 || runSkill("Divine Magic", 75) !== 250 || runSkill("Enhancing Magic", 75) !== 240) throw new Error("RUN magic skills");
  if (runSkill("Shield", 75) !== 0 || runSkill("Staff", 75) !== 0 || runSkill("Healing Magic", 75) !== 0) throw new Error("RUN has no shield");
  if (runeResistance(75) !== 42 || runeResistance(99) !== 54) throw new Error("rune resistance");
  const chart = harboredResistance(
    [
      { name: "Ignis", power: 2 },
      { name: "Sulpor", power: 1 },
      { name: "Vallation", power: 45 },
    ],
    75,
  );
  if (chart.ice !== 84 || chart.water !== 42 || chart.fire !== 0 || chart.thunder !== 0) throw new Error("rune chart");
  if (harboredResistance([{ name: "Ignis", power: 1 }], 0).ice !== 0) throw new Error("rune chart level");
  if (runeCap(75, true) !== 3 || runeCap(37, false) !== 2 || runeCap(34, true) !== 1 || runeCap(65, false) !== 2) throw new Error("rune cap");
  if (runeStrike(276, 1, true) !== 207 || runeStrike(276, 3, true) !== 345 || runeStrike(276, 3, false) !== 207) throw new Error("swipe");
  if (runeEnhancementDps(14, 456, "weapon") !== 1.84) throw new Error("rune dps");
  if (runeEnhancementDps(14, 456, "dual") !== 0.92) throw new Error("rune dual dps");
  if (runeEnhancementDps(4, 528, "h2h") !== 1.45) throw new Error("rune h2h dps");
  if (runeEnhancementDps(100, 60, "weapon") !== 21) throw new Error("rune dps cap");
  const oneBand = runeEnhancementBand(1.84, 1);
  const twoBand = runeEnhancementBand(1.84, 2);
  const threeBand = runeEnhancementBand(1.84, 3);
  if (oneBand.low !== 1 || oneBand.high !== 2 || twoBand.low !== 2 || twoBand.high !== 3 || threeBand.low !== 3 || threeBand.high !== 4) throw new Error("rune band");
  if (runeEnhancementDamage(1.84, 3, 0) !== 3 || runeEnhancementDamage(1.84, 3, 0.999) !== 4) throw new Error("rune roll");
  const majority = runeOffensive([{ name: "Ignis", left: 10, power: 2 }, { name: "Gelus", left: 80, power: 1 }]);
  if (majority?.element !== "fire" || majority.copies !== 2) throw new Error("rune majority");
  const tied = runeOffensive([{ name: "Ignis", left: 10, power: 1 }, { name: "Gelus", left: 80, power: 1 }]);
  if (tied?.name !== "Gelus" || tied.copies !== 1) throw new Error("rune newest strike");
  if (runMaxHp(75, "main") !== 120 || runMaxHp(37, "sub") !== 30 || runMaxHp(49, "sub") !== 60 || runMaxHp(60, "sub") !== 60) throw new Error("RUN max HP");
  if (runAutoRegen(75, "main") !== 2 || runAutoRegen(37, "sub") !== 1 || runAutoRegen(34, "sub") !== 0) throw new Error("RUN regen");
  if (runAccuracy(75, "main") !== 22 || runAccuracy(37, "sub") !== 0 || runAccuracy(50, "master-sub") !== 10) throw new Error("RUN accuracy");
  if (runMagicDefense(75, "main") !== 16 || runMagicDefense(37, "sub") !== 12 || runTenacity(37) !== 0.07 || runTenacity(75) !== 0.11) throw new Error("RUN defense traits");
  if (runInquartata(37) !== 0.05 || runInquartata(75) !== 0.09 || runTacticalParry(37, "sub") !== 0 || runTacticalParry(75, "main") !== 30) throw new Error("RUN parry traits");
  if (vallationElement("Ignis") !== "ice" || vallationElement("Unda") !== "fire" || vallationElement("Lux") !== "dark") throw new Error("vallation element");
  const empty = { recastLeft: 0, runLevel: 75, runMain: true, runes: [] as RuneRow[], skill: 276, targeted: true, distance: 1, divine: 250, stats: naked, shadows: 0 };
  const ignis = castRune("Ignis", empty);
  if (!ignis?.ok || ignis.runes?.length !== 1 || ignis.runes[0].power !== 1) throw new Error("ignis");
  if (ignis.share?.join(",") !== "Gelus,Flabra,Tellus,Sulpor,Unda,Lux,Tenebrae") throw new Error("rune share");
  const full = castRune("Ignis", { ...empty, runes: [{ name: "Gelus", left: 10, power: 1 }, { name: "Lux", left: 40, power: 1 }, { name: "Tellus", left: 80, power: 1 }] });
  const after = full?.runes ?? [];
  if (!full?.ok || after.some((row) => row.name === "Gelus") || after.find((row) => row.name === "Ignis")?.power !== 1 || after.length !== 3) throw new Error("oldest rune drops");
  const swipe = castRune("Swipe", { ...empty, runes: [{ name: "Ignis", left: 100, power: 3 }] });
  if (!swipe?.ok || swipe.bash !== 345 || swipe.runes?.[0]?.power !== 2 || swipe.share || !swipe.noTp || swipe.recast !== 90) throw new Error("swipe spend");
  const subSwipe = castRune("Swipe", { ...empty, runMain: false, runLevel: 37, runes: [{ name: "Ignis", left: 100, power: 2 }] });
  if (!subSwipe?.ok || subSwipe.bash !== 207) throw new Error("sub swipe");
  const far = castRune("Lunge", { ...empty, distance: 10.1, runes: [{ name: "Ignis", left: 10, power: 1 }] });
  if (far?.ok) throw new Error("lunge range");
  const shadow = castRune("Swipe", { ...empty, shadows: 1, runes: [{ name: "Lux", left: 10, power: 1 }] });
  if (!shadow?.ok || shadow.bash != null || !shadow.shadowPop || shadow.runes?.length !== 0) throw new Error("swipe shadow");
  const lungeSame = castRune("Lunge", { ...empty, runes: [{ name: "Ignis", left: 100, power: 3 }] });
  if (!lungeSame?.ok || lungeSame.bash !== 1035 || lungeSame.recast !== 180 || lungeSame.runes?.length !== 0 || !lungeSame.noTp) throw new Error("lunge same");
  const lungeMix = castRune("Lunge", {
    ...empty,
    runes: [
      { name: "Ignis", left: 30, power: 1 },
      { name: "Gelus", left: 20, power: 1 },
      { name: "Flabra", left: 10, power: 1 },
    ],
  });
  if (!lungeMix?.ok || lungeMix.bash !== 621 || lungeMix.runes?.length !== 0) throw new Error("lunge mix");
  const lungePair = castRune("Lunge", {
    ...empty,
    runes: [
      { name: "Gelus", left: 10, power: 1 },
      { name: "Ignis", left: 80, power: 2 },
    ],
  });
  if (!lungePair?.ok || lungePair.bash !== 759 || lungePair.runes?.length !== 0) throw new Error("lunge pair");
  const lungeKill = castRune("Lunge", {
    ...empty,
    targetHp: 50,
    runes: [
      { name: "Gelus", left: 10, power: 1 },
      { name: "Ignis", left: 80, power: 1 },
    ],
  });
  if (!lungeKill?.ok || lungeKill.bash !== 207 || lungeKill.runes?.length !== 1 || lungeKill.runes?.[0]?.name !== "Gelus") throw new Error("lunge kill");
  const lungeOver = castRune("Lunge", { ...empty, targetHp: 50, runes: [{ name: "Ignis", left: 100, power: 3 }] });
  if (!lungeOver?.ok || lungeOver.bash !== 207 || lungeOver.runes?.[0]?.power !== 2) throw new Error("lunge overkill");
  const lungeTrim = castRune("Lunge", { ...empty, targetHp: 250, runes: [{ name: "Ignis", left: 100, power: 3 }] });
  if (!lungeTrim?.ok || lungeTrim.bash !== 276 || lungeTrim.runes?.[0]?.power !== 2) throw new Error("lunge trim");
  const lungeShade = castRune("Lunge", {
    ...empty,
    shadows: 1,
    runes: [
      { name: "Gelus", left: 10, power: 1 },
      { name: "Ignis", left: 80, power: 1 },
    ],
  });
  if (!lungeShade?.ok || lungeShade.bash !== 207 || lungeShade.runes?.length !== 0 || !lungeShade.shadowPop) throw new Error("lunge shadow");
  const lungeBlink = castRune("Lunge", { ...empty, shadows: 1, runes: [{ name: "Ignis", left: 100, power: 3 }] });
  if (!lungeBlink?.ok || lungeBlink.bash !== 690 || lungeBlink.runes?.length !== 0 || !lungeBlink.shadowPop) throw new Error("lunge blink");
  const subLunge = castRune("Lunge", { ...empty, runMain: false, runLevel: 37, runes: [{ name: "Ignis", left: 100, power: 2 }] });
  if (!subLunge?.ok || subLunge.bash !== 414 || subLunge.runes?.length !== 0) throw new Error("sub lunge");
  const lungeDead = castRune("Lunge", { ...empty, targetHp: 0, runes: [{ name: "Ignis", left: 10, power: 2 }] });
  if (!lungeDead?.ok || lungeDead.bash != null || lungeDead.runes?.[0]?.power !== 2) throw new Error("lunge dead");
  const gambit = castRune("Gambit", {
    ...empty,
    runes: [
      { name: "Ignis", left: 40, power: 2 },
      { name: "Tenebrae", left: 10, power: 1 },
    ],
  });
  const gambitPack = packRunes([
    { name: "Ignis", power: 2 },
    { name: "Tenebrae", power: 1 },
  ]);
  if (!gambit?.ok || gambit.gambit?.power !== gambitPack || gambit.gambit?.left !== 60 || gambit.runes?.length !== 0) throw new Error("gambit pack");
  if (!gambitLine(gambitPack).includes("fire +20%") || !gambitLine(gambitPack).includes("dark +10%")) throw new Error("gambit line");
  const subGambit = castRune("Gambit", { ...empty, runLevel: 37, runMain: false, runes: [{ name: "Ignis", left: 10, power: 1 }] });
  if (subGambit?.ok) throw new Error("sub gambit");
  const pulse = castRune("Vivacious Pulse", { ...empty, runes: [{ name: "Tenebrae", left: 10, power: 1 }] });
  if (!pulse?.ok || pulse.heal !== 135 || pulse.mpHeal !== 50) throw new Error("pulse");
  const subPulse = castRune("Vivacious Pulse", { ...empty, runLevel: 37, runMain: false });
  if (subPulse?.ok) throw new Error("sub pulse");
  const merit = castRune("Battuta", empty);
  if (merit?.ok || merit?.text !== "Battuta is not unlocked.") throw new Error("battuta");
  const pflug = castRune("Pflug", { ...empty, runLevel: 37, runMain: false });
  if (pflug?.ok) throw new Error("sub pflug");
  const subValiance = castRune("Valiance", { ...empty, runLevel: 37, runMain: false });
  if (subValiance?.ok) throw new Error("sub valiance");
  const wall = castRune("Vallation", { ...empty, runes: [{ name: "Flabra", left: 100, power: 2 }] });
  if (!wall?.ok || wall.replaces?.join(",") !== "Valiance" || wall.buff?.duration !== 120 || wall.buff?.power !== packRunes([{ name: "Flabra", power: 2 }])) throw new Error("vallation replaces");
  const valiance = castRune("Valiance", { ...empty, runes: [{ name: "Flabra", left: 100, power: 1 }] });
  if (!valiance?.ok || valiance.replaces?.includes("Vallation") || valiance.buff?.name !== "Valiance" || valiance.buff?.duration !== 180 || valiance.recast !== 300) throw new Error("valiance");
  const valianceCard = RUN_ABILITIES.find((ability) => ability.name === "Valiance");
  if (!valianceCard || !valianceCard.effect.includes("14'") || valianceCard.effect.includes("party is you") || valianceCard.effect.includes("replaces Vallation")) throw new Error("valiance essay");
  if (vallationSdt(wall.buff?.power ?? 0, "earth") !== 30) throw new Error("vallation sdt stored");
  const emb = emboldenPotency(true, 100);
  if (emb !== 150 || emboldenDuration(true, 300) !== 150 || emboldenPotency(false, 100) !== 100) throw new Error("embolden");
  const ticked = tickSwordplay(3, 0, 3);
  if (ticked.power !== 6 || ticked.gained !== 3) throw new Error("swordplay tick");
  const capped = tickSwordplay(59, 0, 9);
  if (capped.power !== 60) throw new Error("swordplay cap");
  if (RUN_ABILITIES.some((ability) => ability.name === "Liement" || ability.name === "One for All")) throw new Error("past 75");
  const _job: JobId = "RUN";
  if (_job !== "RUN") throw new Error("job");
}
