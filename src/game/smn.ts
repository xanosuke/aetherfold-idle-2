/**
 * Retail Summoner toolkit through level 75. No merits and no job points.
 *
 * A support job here is level 37. Assault, Retreat, Release, and the
 * blood pacts learned by 37 are inside that. Astral Flow is the one-hour
 * and is main only. Elemental Siphon is 50, which a master-level sub
 * could reach. This kit has no master levels, so only a main Summoner
 * uses it. Apogee is 70 and sits after that bracket, so it is main only
 * as well. Mana Cede and Astral Conduit are past 75. Avatar's Favor is
 * 55 and needs master levels on a sub, so it stays out.
 *
 * Max MP Boost tiers replace. The printed gifts are +10, +20, +40, and
 * +60 at 10, 30, 50, and 70. Tier III is the master-level sub line, so a
 * level-37 subjob stops at +20. A main Summoner at 75 has +60. The old
 * +15 / +30 / +40 / +50 gifts were not the current table.
 *
 * Clear Mind uses the same steps as Black Mage: +3 / +6 / +9 / +12 / +15
 * at 15 / 30 / 45 / 60 / 75. A level-37 subjob has +6. Auto Refresh I is
 * 1 MP every 3 seconds at 25. Auto Refresh II is 90. Resist Slow follows
 * the trait page, not the job page's extra "75 Resist Slow IV" line.
 * The trait page puts IV at 81. The percents are the ones that page
 * marks as assumed from lore: 10% / 15% / 20% at 20 / 40 / 60. Nothing
 * in this fight inflicts Slow, so the trait is not rolled.
 *
 * Blood Boon I is 20% at 60 and II is 23% at 70. Both are main only.
 * The page says it occasionally cuts a blood pact's MP the way Conserve
 * MP does, in sixteenths, and never by more than half. It does not
 * touch an Astral Flow pact. The tier percent is the chance.
 *
 * Naked Hume Summoner, no subjob, with the +60 gift: 820 HP, 752 MP,
 * STR 44, DEX 56, VIT 44, AGI 56, INT 65, MND 61, CHR 61.
 * Ash Staff adds 2 HP and 2 MP. The staff is the equipped weapon.
 * Evoker's Horn, Doublet, Bracers, Spats, and Pigaches are the artifact
 * look. They are not equipped, so their stat lines are not on the sheet.
 * Kukulcan's Staff is the artifact weapon and is not in the bag.
 *
 * Current combat letters, at this repo's level-75 cap: Staff B 250,
 * Club C+ 230, Dagger E 200, Evasion E 200, Summoning Magic A 269.
 * The current page's Summoning letter is A. Older charts called that
 * column A−. Parrying is not on the combat table, so it is not given a
 * letter. The Tropical Rarab is not slowed, so Resist Slow is recorded
 * and not rolled.
 *
 * One pet at a time. A wyvern already out blocks a summon, and an avatar
 * out blocks Call Wyvern. Alexander and Odin can be cast only during
 * Astral Flow. Both print All MP. The spell row stores 0 so that is not
 * a free cast: the cast spends the MP you currently have. Conserve MP
 * does not cut that spend. Manafont can still make it free.
 * Odin uses Zantetsuken as soon as he arrives, ends Astral Flow, and leaves.
 * Alexander uses Perfect Defense as soon as he arrives, ends Astral Flow,
 * and leaves. He does not stay for the buff.
 *
 * Perpetuation is the current chart, MP per 3-second tick, from the
 * Summoner's own level. Carbuncle and Cait Sith at 75 are 9. Fenrir and
 * Siren are 11. The elemental avatars and Diabolos are 13. A spirit is 5.
 * The initial MP is the chart's summoning row: 5, 15, 7, 15, and 10.
 * Atomos is not on that chart. Its spell is 50 MP, cast on an enemy,
 * and it leaves after Deconstruction and Chronoshift.
 * Carbuncle's cast is 7 seconds. The recast used here is 30 seconds.
 * Other staying summons share that pair. Odin keeps it too.
 * Atomos is 6 seconds and 60. Alexander is 1 second and 60.
 * Day, weather, and perpetuation gear are not in this
 * yard, so the base cost is what is paid.
 *
 * Elemental Siphon needs a spirit, not an avatar. It does not dismiss
 * the spirit. No gear, no day, no weather, and no job points:
 * floor(Summoning Magic × 1.05 − 55). At 269 that is 227. The printed
 * minimum is 50. The spirit's own MP pool was not on the page, so the
 * "cannot exceed the spirit's MP" cap is not applied.
 *
 * Astral Flow lasts 3 minutes and recasts in 1 hour. Merit ranks that
 * would add 5 to avatar stats are locked, so the buff does not change
 * the sheet. The astral blood pacts are the full-strength commands.
 * A rage deals damage. A ward cures, buffs, or strikes. Pet melee uses
 * the yard's fSTR and pDIF. Blood pacts do not feed the foe TP.
 * An avatar keeps its own TP, capped at 3000, and starts at 0.
 * Delay 240 pays 75 TP on a connecting melee hit. A physical blood pact
 * pays that same 75 for each hit that lands. Double Punch and Double Slap
 * are two hits, and a miss pays nothing. The bar is not spent.
 * A magic blood pact spends the whole bar. Meteorite's hit scales with it.
 * Healing pacts spend it and still use the printed cure. Enhancing and
 * enfeebling pacts do not spend it. Astral Flow does not spend it.
 * Apogee makes the next pact cost 50% more MP, sets that recast to 0,
 * and shortens the next ward by about 25%.
 */

import type { JobAccess } from "./blm";
import { BLM_SKILLS } from "./blm";
import { drkAttackBonus, DRK_SKILLS } from "./drk";
import { accuracyFrom, baseDefense, evasionFrom, fStr, mainHandAttack, tpPerHit } from "./formulas";
import { aquaveilCharges, cureBase, elementalD, enspellTwoBase, holyDamage, type CureSpell, type ElementalSpell } from "./magic";
import { skillCap, type SkillRank } from "./skills";
import { characterBase, type JobId } from "./stats";
import { WAR_SKILLS } from "./war";
import { autoRegen, magicDefenseBonus, WHM_SKILLS } from "./whm";
import { RDM_SKILLS } from "./rdm";
import { BRD_SKILLS } from "./brd";

export const SMN_CAP = 75;

/** Astral Flow. One hour to recast, three minutes up. */
export const ASTRAL_FLOW_RECAST = 3600;
export const ASTRAL_FLOW_DURATION = 180;

/** Elemental Siphon. Five minutes. Master-level sub, so main only here. */
export const SIPHON_RECAST = 300;

/** Apogee. Three minutes to recast, one minute up. Main only. */
export const APOGEE_RECAST = 180;
export const APOGEE_DURATION = 60;

/** The next blood pact costs this much more MP. 0.5 is +50%. */
export const APOGEE_MP = 0.5;

/** The next ward lasts this fraction. The page says about −25%. */
export const APOGEE_WARD = 0.75;

/** Blood Pact recast. Rage shares one timer. Ward shares another. Base 60s. No delay gear. */
export const BLOOD_PACT_RECAST = 60;

/** The job ability row. Both rage and ward. This stays on the summoner. The pet's own damage hate is a separate row. */
export const BLOOD_PACT_CE = 1;
export const BLOOD_PACT_VE = 300;

/** Hastega. 153/1024. The Haste spell is 150/1024. */
export const HASTEGA_NUMER = 153;

/**
 * Aerial Armor. The page says 3 or 4 shadows, and that 3 is only at low levels.
 * The skill check is not printed, so this yard uses 4, not Blink's 2.
 */
export const AERIAL_SHADOWS = 4;

/** Shiva's Sleepga. The spell is 60 seconds. This page prints 90. */
export const SLEEPGA_PACT_SECONDS = 90;

/** Nightmare. Unresisted sleep is 90 seconds. Bio is 2 HP every 3 seconds, not the spell. */
export const NIGHTMARE_SECONDS = 90;
export const NIGHTMARE_BIO = 2;

/** Mewing Lullaby. The page's base duration is 35 seconds. A longer test note is not a formula. */
export const MEWING_SECONDS = 35;

/** Lunatic Voice. The page's base duration is 90 seconds. A note of "at least 90" is not a longer formula. */
export const LUNATIC_SECONDS = 90;

/** Bitter Elegy. The page says 50% elementally aligned Slow. 50% of 1024 is 512, the same power as Carnage Elegy. */
export const BITTER_ELEGY = 512;

/** Noctoshield. A flat Phalanx of 13. Not the enhancing-magic formula. */
export const NOCTOSHIELD_CUT = 13;

/** Shining Ruby. Defense +25/256. Magic damage taken −10/256. */
export const SHINING_DEF = 25;
export const SHINING_MDT = 10;

/**
 * Crimson Howl. floor((level ÷ 4) + 4.75), then that many 256ths of attack.
 * At 75 that is 23. At 99 it is 29, about 11.3%. The old flat 15% is not this page.
 */
export function crimsonHowlAttack(level: number): number {
  return Math.floor(Math.max(0, level) / 4 + 4.75);
}

/** Glittering Ruby. One random attribute. 3 + floor(level ÷ 5). At 75 that is 18. */
export const GLITTER_STATS = ["STR", "DEX", "VIT", "AGI", "INT", "MND", "CHR"] as const;
export type GlitterStat = (typeof GLITTER_STATS)[number];

export function glitteringRuby(level: number): number {
  return 3 + Math.floor(Math.max(0, level) / 5);
}

/**
 * Avatar melee delay. The perpetuation page does not print one.
 * Fenrir and Diabolos say they swing faster than the others and do not
 * print the number, so they keep this delay too.
 * 240 is four seconds at the yard's 60-delay conversion, the same delay
 * the Tropical Rarab swings. No pet haste is in this kit.
 */
export const AVATAR_DELAY = 240;

/** Carbuncle's printed cast. Shared where no other timer was retrieved. */
export const SUMMON_CAST = 7;
export const SUMMON_RECAST = 30;

/**
 * Atomos. Cast on an enemy, not on yourself.
 * The current card is 50 MP, a 6 second cast, 21', and a 1 minute recast.
 * The 75-era card said 1 second and did not print a range. This yard uses
 * the 6 second cast. The range is the same current card.
 * Deconstruction and Chronoshift fire on their own and cost no MP.
 * They do not touch Blood Pact: Rage or Blood Pact: Ward.
 * Astral Flow is not required. There is no perpetuation. It then vanishes.
 * The job box says Unknown, and it never stays to swing, so it has no sheet.
 */
export const ATOMOS_CAST = 6;
export const ATOMOS_RECAST = 60;
export const ATOMOS_RANGE = 21;
export const ATOMOS_MP = 50;

/**
 * Alexander. Cast on yourself during Astral Flow.
 * The current card is a 1 second cast and a 1 minute recast. The cost is
 * All MP, stored as 0 on the spell so the cast spends what you have.
 * Perfect Defense is on the pact bar and also fires on its own.
 * The data file calls it Rage. It acts as a ward. No skillchain property
 * and it does not magic burst. He then leaves, and Astral Flow ends.
 */
export const ALEXANDER_CAST = 1;
export const ALEXANDER_RECAST = 60;

/**
 * Perfect Defense. Duration is 30s + floor(Summoning Magic / 20), cap 60.
 * At 269 that is 43. The page says the damage cut and the resist rate
 * vary with remaining MP and does not print either, so neither is applied.
 * Decay after half the duration is not numbered, so it is not applied.
 */
export function perfectDefenseSeconds(summoning: number): number {
  return Math.min(60, 30 + Math.floor(Math.max(0, summoning) / 20));
}

/** Alexander and Odin. The 0 on the spell row means All MP, not a free cast. */
export function summonCostsAllMp(id: string): boolean {
  const spec = summonById(id);
  return !!spec && spec.astralGate && spec.mp === 0;
}

export type SummonId =
  | "carbuncle"
  | "cait-sith"
  | "ifrit"
  | "shiva"
  | "garuda"
  | "titan"
  | "ramuh"
  | "leviathan"
  | "fenrir"
  | "diabolos"
  | "siren"
  | "atomos"
  | "alexander"
  | "odin"
  | "light-spirit"
  | "fire-spirit"
  | "ice-spirit"
  | "air-spirit"
  | "earth-spirit"
  | "thunder-spirit"
  | "water-spirit"
  | "dark-spirit";

export type SummonFamily = "carbuncle" | "fenrir" | "avatar" | "spirit" | "astral" | "burst";

export type SummonSpec = {
  id: SummonId;
  name: string;
  /** Spell level. 75 is main only in this kit because a subjob is 37. */
  level: number;
  element: string;
  family: SummonFamily;
  /** Spell MP. Staying pets use the perpetuation chart's initial cost. Atomos is 50, and that is the whole cost. */
  mp: number;
  /** Only while Astral Flow is up. No perpetuation. */
  astralGate: boolean;
};

export const SUMMONS: readonly SummonSpec[] = [
  { id: "carbuncle", name: "Carbuncle", level: 1, element: "light", family: "carbuncle", mp: 5, astralGate: false },
  { id: "cait-sith", name: "Cait Sith", level: 1, element: "light", family: "carbuncle", mp: 5, astralGate: false },
  { id: "ifrit", name: "Ifrit", level: 1, element: "fire", family: "avatar", mp: 7, astralGate: false },
  { id: "shiva", name: "Shiva", level: 1, element: "ice", family: "avatar", mp: 7, astralGate: false },
  { id: "garuda", name: "Garuda", level: 1, element: "wind", family: "avatar", mp: 7, astralGate: false },
  { id: "titan", name: "Titan", level: 1, element: "earth", family: "avatar", mp: 7, astralGate: false },
  { id: "ramuh", name: "Ramuh", level: 1, element: "thunder", family: "avatar", mp: 7, astralGate: false },
  { id: "leviathan", name: "Leviathan", level: 1, element: "water", family: "avatar", mp: 7, astralGate: false },
  { id: "fenrir", name: "Fenrir", level: 1, element: "light", family: "fenrir", mp: 15, astralGate: false },
  { id: "diabolos", name: "Diabolos", level: 1, element: "dark", family: "avatar", mp: 15, astralGate: false },
  { id: "siren", name: "Siren", level: 1, element: "wind", family: "fenrir", mp: 15, astralGate: false },
  { id: "atomos", name: "Atomos", level: 75, element: "dark", family: "burst", mp: ATOMOS_MP, astralGate: false },
  { id: "alexander", name: "Alexander", level: 75, element: "light", family: "astral", mp: 0, astralGate: true },
  { id: "odin", name: "Odin", level: 75, element: "dark", family: "astral", mp: 0, astralGate: true },
  { id: "light-spirit", name: "Light Spirit", level: 1, element: "light", family: "spirit", mp: 10, astralGate: false },
  { id: "fire-spirit", name: "Fire Spirit", level: 1, element: "fire", family: "spirit", mp: 10, astralGate: false },
  { id: "ice-spirit", name: "Ice Spirit", level: 1, element: "ice", family: "spirit", mp: 10, astralGate: false },
  { id: "air-spirit", name: "Air Spirit", level: 1, element: "wind", family: "spirit", mp: 10, astralGate: false },
  { id: "earth-spirit", name: "Earth Spirit", level: 1, element: "earth", family: "spirit", mp: 10, astralGate: false },
  { id: "thunder-spirit", name: "Thunder Spirit", level: 1, element: "thunder", family: "spirit", mp: 10, astralGate: false },
  { id: "water-spirit", name: "Water Spirit", level: 1, element: "water", family: "spirit", mp: 10, astralGate: false },
  { id: "dark-spirit", name: "Dark Spirit", level: 1, element: "dark", family: "spirit", mp: 10, astralGate: false },
];

const SUMMON_BY_ID = new Map(SUMMONS.map((row) => [row.id, row]));
const SUMMON_BY_NAME = new Map(SUMMONS.map((row) => [row.name, row]));

export function summonById(id: string): SummonSpec | null {
  return SUMMON_BY_ID.get(id as SummonId) ?? null;
}

export function summonByName(name: string): SummonSpec | null {
  return SUMMON_BY_NAME.get(name) ?? null;
}

/**
 * MP per tick. The level is the Summoner's own level.
 * Each row is the level where that cost begins. The next row replaces it.
 * Alexander and Odin have none. Atomos is not on the chart either.
 * It is summoned on an enemy and leaves after Deconstruction and Chronoshift.
 */
const PERP: Record<Exclude<SummonFamily, "astral" | "burst">, readonly number[][]> = {
  carbuncle: [[1, 1], [2, 10], [3, 18], [4, 27], [5, 36], [6, 45], [7, 54], [8, 63], [9, 72], [10, 81], [11, 91]],
  fenrir: [[1, 1], [2, 8], [3, 15], [4, 22], [5, 30], [6, 37], [7, 45], [8, 51], [9, 59], [10, 66], [11, 73], [12, 81], [13, 91]],
  avatar: [[3, 1], [4, 10], [5, 19], [6, 28], [7, 38], [8, 47], [9, 56], [10, 65], [11, 68], [12, 71], [13, 74], [14, 81], [15, 91]],
  spirit: [[1, 1], [2, 19], [3, 38], [4, 57], [5, 75], [6, 81], [7, 91]],
};

export function perpetuation(id: string, level: number): number {
  const spec = summonById(id);
  if (!spec || spec.family === "astral" || spec.family === "burst" || level <= 0) return 0;
  let cost = 0;
  for (const [mp, at] of PERP[spec.family]) {
    if (level >= at) cost = mp;
  }
  return cost;
}

export function smnJobLevel(job: JobId, sub: JobId | null, subLevel: number, mainLevel: number): number {
  if (job === "SMN") return mainLevel;
  if (sub === "SMN") return subLevel;
  return 0;
}

/** Max MP Boost. Tiers replace. A subjob without master levels stops at II. */
export function maxMpBoost(level: number, access: JobAccess): number {
  if (access === "main") {
    if (level >= 70) return 60;
    if (level >= 50) return 40;
    if (level >= 30) return 20;
    if (level >= 10) return 10;
    return 0;
  }
  if (level >= 30) return 20;
  if (level >= 10) return 10;
  return 0;
}

/** Resist Slow. IV is 81, so 75 stops at III. The percents are the trait page's assumed values. */
export function resistSlow(level: number, access: JobAccess): number {
  if (access === "main" && level >= 60) return 0.2;
  if (level >= 40) return 0.15;
  if (level >= 20) return 0.1;
  return 0;
}

/** Auto Refresh I. 1 MP every 3 seconds. II is level 90. */
export function smnRefresh(level: number): number {
  return level >= 25 ? 1 : 0;
}

/**
 * Blood Boon proc chance. Main only. A proc then cuts MP like Conserve MP.
 * Astral Flow pacts are excluded by the caller.
 */
export function bloodBoon(level: number, access: JobAccess): number {
  if (access !== "main") return 0;
  if (level >= 70) return 0.23;
  if (level >= 60) return 0.2;
  return 0;
}

/** Elemental Siphon MP. Gear, day, weather, and job points are 0. Minimum 50. */
export function elementalSiphonMp(skill: number): number {
  const base = Math.floor(skill * 1.05 - 55);
  return Math.max(50, base);
}

/** Apogee's next pact MP. +50%, floored. */
export function apogeeMp(cost: number): number {
  if (cost <= 0) return 0;
  return Math.floor(cost * (1 + APOGEE_MP));
}

export type SmnAbility = {
  name: string;
  level: number;
  recast: number;
  duration: number;
  access: JobAccess;
  merit?: boolean;
  effect: string;
  ce: number;
  ve: number;
};

export type SmnTrait = {
  name: string;
  level: number;
  access: JobAccess;
  effect: string;
};

export type SmnSkill = {
  name: string;
  rank: SkillRank;
};

export const SMN_ABILITIES: SmnAbility[] = [
  {
    name: "Astral Flow",
    level: 1,
    recast: ASTRAL_FLOW_RECAST,
    duration: ASTRAL_FLOW_DURATION,
    access: "main",
    effect: "Avatars can use their astral blood pacts for 3 minutes. Odin's and Alexander's astral pacts would end it at once. Merit ranks that add 5 to an avatar's stats are locked, so the sheet does not change. Recast 1:00:00. Main job only.",
    ce: 0,
    ve: 0,
  },
  {
    name: "Elemental Siphon",
    level: 50,
    recast: SIPHON_RECAST,
    duration: 0,
    access: "master-sub",
    effect: "Drains MP from a summoned spirit. An avatar does not qualify, and the spirit is not dismissed. With no gear, day, weather, or job points the return is floor(Summoning Magic × 1.05 − 55), and at least 50. At skill 269 that is 227. The spirit's MP pool was not printed, so that cap is not applied. Recast 0:05:00. Cumulative enmity 1. A level-37 subjob has not learned it.",
    ce: 1,
    ve: 0,
  },
  {
    name: "Apogee",
    level: 70,
    recast: APOGEE_RECAST,
    duration: APOGEE_DURATION,
    access: "main",
    effect: "The next blood pact costs 50% more MP and its recast is 0. The next ward's duration is about 25% shorter. Lasts 1 minute. Recast 0:03:00. Main job only.",
    ce: 0,
    ve: 0,
  },
  {
    name: "Assault",
    level: 1,
    recast: 10,
    duration: 0,
    access: "sub",
    effect: "Orders the avatar to attack. Summoning while a foe is targeted does not, and Engage does not. A blood pact aimed at the foe sends it in, and it stays. Cumulative enmity 1. That command hate stays on you. When the avatar dies or is released, its own damage hate does not move, and the foe turns to whoever is left. Recast 0:00:10. A support job can use it.",
    ce: 1,
    ve: 0,
  },
  {
    name: "Retreat",
    level: 1,
    recast: 10,
    duration: 0,
    access: "sub",
    effect: "Orders the avatar to stop and return. It stays back until Assault, or a blood pact aimed at the foe. Recast 0:00:10. A support job can use it.",
    ce: 0,
    ve: 0,
  },
  {
    name: "Release",
    level: 1,
    recast: 0,
    duration: 0,
    access: "sub",
    effect: "Dismisses the avatar. Perpetuation stops. A support job can use it.",
    ce: 0,
    ve: 0,
  },
];

export const SMN_TRAITS: SmnTrait[] = [
  { name: "Max MP Boost", level: 10, access: "sub", effect: "Maximum MP +10. A level-37 subjob has the next tier." },
  { name: "Clear Mind", level: 15, access: "sub", effect: "Resting MP +3 on top of the 12 MP base. Same steps as Black Mage." },
  { name: "Resist Slow", level: 20, access: "sub", effect: "10% chance to resist Slow. The trait page marks the percent as assumed. Nothing here inflicts Slow, so it is not rolled." },
  { name: "Auto Refresh", level: 25, access: "sub", effect: "1 MP every 3 seconds. The same tick as Paladin's Auto Refresh. They do not add." },
  { name: "Max MP Boost II", level: 30, access: "sub", effect: "Maximum MP +20. Replaces Max MP Boost. A level-37 subjob has this tier." },
  { name: "Clear Mind II", level: 30, access: "sub", effect: "Resting MP +6. Replaces Clear Mind. A level-37 subjob has this tier." },
  { name: "Resist Slow II", level: 40, access: "sub", effect: "15%. Replaces Resist Slow. A level-37 subjob has not learned it." },
  { name: "Clear Mind III", level: 45, access: "sub", effect: "Resting MP +9. Replaces Clear Mind II. A level-37 subjob has not learned it." },
  { name: "Max MP Boost III", level: 50, access: "master-sub", effect: "Maximum MP +40. Replaces Max MP Boost II. A support job needs master levels. A main Summoner has it, and then the next tier." },
  { name: "Clear Mind IV", level: 60, access: "main", effect: "Resting MP +12. Replaces Clear Mind III. Main job only." },
  { name: "Resist Slow III", level: 60, access: "main", effect: "20%. Replaces Resist Slow II. Main job only. Resist Slow IV is 81, so this is the tier at 75." },
  { name: "Blood Boon", level: 60, access: "main", effect: "20% chance to cut a blood pact's MP the way Conserve MP does. Not an Astral Flow pact. Main job only." },
  { name: "Max MP Boost IV", level: 70, access: "main", effect: "Maximum MP +60. Replaces Max MP Boost III. Main job only. The next tier is 76." },
  { name: "Blood Boon II", level: 70, access: "main", effect: "23% chance. Replaces Blood Boon. Main job only." },
  { name: "Clear Mind V", level: 75, access: "main", effect: "Resting MP +15. Replaces Clear Mind IV. Main job only." },
];

export const SMN_SKILLS: SmnSkill[] = [
  { name: "Staff", rank: "B" },
  { name: "Club", rank: "C+" },
  { name: "Dagger", rank: "E" },
  { name: "Evasion", rank: "E" },
  { name: "Summoning Magic", rank: "A" },
];

export function smnSkill(name: string, level: number): number {
  const row = SMN_SKILLS.find((skill) => skill.name === name);
  return row ? skillCap(row.rank, level) : 0;
}

export type BloodPact = {
  name: string;
  level: number;
  access: JobAccess;
  avatar: string;
  kind: "rage" | "ward";
  astral?: boolean;
  merit?: boolean;
  /** Printed MP. Absent when the page did not give one. */
  mp?: number;
  effect: string;
};

/**
 * Rage commands through 75 from the current Summoner page, plus Carbuncle's
 * wards from that avatar's page. Merit astral pacts stay locked.
 * Healing Ruby's page prints 6 MP. Flaming Crush prints 164. Searing Light
 * is the caster's level × 2. Other MP follows that level band.
 * Damage uses the yard's melee math or the matching elemental nuke.
 */
export const SMN_PACTS: readonly BloodPact[] = [
  { name: "Searing Light", level: 1, access: "sub", avatar: "Carbuncle", kind: "rage", astral: true, effect: "Astral Flow only. Light damage in an area. MP is the caster's level × 2, so 150 at 75. No skillchain property. It magic bursts Transfixion, Fusion, Light, and Radiance, and it does not end that window. Astral Flow does not spend the avatar's TP. Blood pacts do not feed TP." },
  { name: "Inferno", level: 1, access: "sub", avatar: "Ifrit", kind: "rage", astral: true, effect: "Astral Flow only. Fire damage in an area. No skillchain property. It magic bursts Liquefaction, Fusion, Light, and Radiance, and it does not end that window. Astral Flow does not spend the avatar's TP, and that bar does not change the hit. Blood pacts do not feed TP." },
  { name: "Earthen Fury", level: 1, access: "sub", avatar: "Titan", kind: "rage", astral: true, effect: "Astral Flow only. Earth damage in an area. No skillchain property. It magic bursts Scission, Gravitation, Darkness, and Umbra, and it does not end that window. Astral Flow does not spend the avatar's TP, and that bar does not change the hit. Blood pacts do not feed TP." },
  { name: "Tidal Wave", level: 1, access: "sub", avatar: "Leviathan", kind: "rage", astral: true, effect: "Astral Flow only. Water damage in an area. No skillchain property. It magic bursts Reverberation, Distortion, Darkness, and Umbra, and it does not end that window. Astral Flow does not spend the avatar's TP, and that bar does not change the hit. Blood pacts do not feed TP." },
  { name: "Aerial Blast", level: 1, access: "sub", avatar: "Garuda", kind: "rage", astral: true, effect: "Astral Flow only. Wind damage in an area. No skillchain property. It magic bursts Detonation, Fragmentation, Light, and Radiance, and it does not end that window. Astral Flow does not spend the avatar's TP, and that bar does not change the hit. Blood pacts do not feed TP." },
  { name: "Diamond Dust", level: 1, access: "sub", avatar: "Shiva", kind: "rage", astral: true, effect: "Astral Flow only. Ice damage in an area. No skillchain property. It magic bursts Induration, Distortion, Darkness, and Umbra, and it does not end that window. Astral Flow does not spend the avatar's TP, and that bar does not change the hit. Blood pacts do not feed TP." },
  { name: "Judgment Bolt", level: 1, access: "sub", avatar: "Ramuh", kind: "rage", astral: true, effect: "Astral Flow only. Lightning damage in an area. No skillchain property. It magic bursts Impaction, Fragmentation, Light, and Radiance, and it does not end that window. Astral Flow does not spend the avatar's TP, and that bar does not change the hit. Blood pacts do not feed TP." },
  { name: "Howling Moon", level: 1, access: "sub", avatar: "Fenrir", kind: "rage", astral: true, effect: "Astral Flow only. Dark damage in an area. No skillchain property. It magic bursts Compression, Gravitation, Darkness, and Umbra, and it does not end that window. Astral Flow does not spend the avatar's TP, and that bar does not change the hit. The page says it lowers Strength. The amount and the duration are not printed, so the cut is not applied. Blood pacts do not feed TP." },
  { name: "Ruinous Omen", level: 1, access: "sub", avatar: "Diabolos", kind: "rage", astral: true, effect: "Astral Flow only. It lowers the HP of foes in an area by a random percentage. No skillchain property. It magic bursts Compression, Gravitation, Darkness, and Umbra, and it does not end that window. Astral Flow does not spend the avatar's TP, and that bar does not change the hit. The percentage is not printed. A cap of about 10% against notorious monsters is not a formula, so this yard does not roll a percent of HP. Blood pacts do not feed TP." },
  { name: "Clarsach Call", level: 1, access: "sub", avatar: "Siren", kind: "rage", astral: true, effect: "Astral Flow only. Wind damage in an area. No skillchain property. It magic bursts Detonation, Fragmentation, Light, and Radiance, and it does not end that window. Astral Flow does not spend the avatar's TP, and that bar does not change the hit. The notes list buffs on Siren for 3 minutes. The amounts are a player test, so they are not applied. Spends all MP. Blood pacts do not feed TP." },
  { name: "Poison Nails", level: 5, access: "sub", avatar: "Carbuncle", kind: "rage", effect: "One piercing hit. Additional effect: Poison. Skillchain property: Transfixion. It closes Compression into Transfixion. It opens Transfixion, which a later skill can close into Compression, Reverberation, or Distortion. A miss does not skillchain and does not give TP. A hit gives Carbuncle its full delay TP and does not spend the bar. The current page says accuracy varies with TP. That bonus is not printed as a formula, so it is not rolled. It does not magic burst. Blood pacts do not feed the foe TP." },
  { name: "Moonlit Charge", level: 5, access: "sub", avatar: "Fenrir", kind: "rage", effect: "One blunt hit. Additional effect: Blind. Skillchain property: Compression. It closes Transfixion or Induration into Compression, and Detonation into Gravitation. It opens Compression. A miss does not skillchain and does not give TP. A hit gives Fenrir its full delay TP and does not spend the bar. It does not magic burst. Blood pacts do not feed the foe TP." },
  { name: "Crescent Fang", level: 10, access: "sub", avatar: "Fenrir", kind: "rage", effect: "One piercing hit. Additional effect: Paralyze. Skillchain property: Transfixion. It closes Compression into Transfixion. It opens Transfixion, which a later skill can close into Compression, Reverberation, or Distortion. A miss does not skillchain and does not give TP. A hit gives Fenrir its full delay TP and does not spend the bar. It does not magic burst. Blood pacts do not feed the foe TP." },
  { name: "Fire II", level: 10, access: "sub", avatar: "Ifrit", kind: "rage", effect: "Magical fire pact on one foe. Not the black magic spell. No skillchain property. It magic bursts Liquefaction, Fusion, Light, and Radiance, and it does not end that window. Spends the avatar's TP. The current page does not print the TP anchors, so this yard's hit does not grow. Blood pacts do not feed the foe TP." },
  { name: "Stone II", level: 10, access: "sub", avatar: "Titan", kind: "rage", effect: "Magical earth pact on one foe. Not the black magic spell. No skillchain property. It magic bursts Scission, Gravitation, Darkness, and Umbra, and it does not end that window. Spends the avatar's TP. The current page says the hit uses TP and does not print the anchors, so this yard's hit does not grow. Blood pacts do not feed the foe TP." },
  { name: "Water II", level: 10, access: "sub", avatar: "Leviathan", kind: "rage", effect: "Magical water pact on one foe. Not the black magic spell. No skillchain property. It magic bursts Reverberation, Distortion, Darkness, and Umbra, and it does not end that window. Spends the avatar's TP. The current page says the hit uses TP and does not print the anchors, so this yard's hit does not grow. Blood pacts do not feed the foe TP." },
  { name: "Aero II", level: 10, access: "sub", avatar: "Garuda", kind: "rage", effect: "Magical wind pact on one foe. Not the black magic spell. No skillchain property. It magic bursts Detonation, Fragmentation, Light, and Radiance, and it does not end that window. Spends the avatar's TP. The current page says the hit uses TP and does not print the anchors, so this yard's hit does not grow. Blood pacts do not feed the foe TP." },
  { name: "Blizzard II", level: 10, access: "sub", avatar: "Shiva", kind: "rage", effect: "Magical ice pact on one foe. Not the black magic spell. No skillchain property. It magic bursts Induration, Distortion, Darkness, and Umbra, and it does not end that window. Spends the avatar's TP. The current page says the hit uses TP and does not print the anchors, so this yard's hit does not grow. Blood pacts do not feed the foe TP." },
  { name: "Thunder II", level: 10, access: "sub", avatar: "Ramuh", kind: "rage", effect: "Magical lightning pact on one foe. Not the black magic spell. No skillchain property. It magic bursts Impaction, Fragmentation, Light, and Radiance, and it does not end that window. Spends the avatar's TP. The current page says the hit uses TP and does not print the anchors, so this yard's hit does not grow. Blood pacts do not feed the foe TP." },
  { name: "Thunderspark", level: 19, access: "sub", avatar: "Ramuh", kind: "rage", effect: "Lightning damage and Paralyze in an area centered on Ramuh. No skillchain property. It magic bursts Impaction, Fragmentation, Light, and Radiance, and it does not end that window. Spends the avatar's TP. The page's damage note is an approximation, not printed anchors, so this yard's hit does not grow. The paralyze amount is not printed, so the spell's paralyze is used. Blood pacts do not feed the foe TP." },
  { name: "Rock Buster", level: 21, access: "sub", avatar: "Titan", kind: "rage", effect: "One blunt hit. Additional effect: Bind for 30 seconds. Damage removes it. Skillchain property: Reverberation. It closes Transfixion or Scission into Reverberation, and Induration into Fragmentation. It opens Reverberation, which a later skill can close into Impaction or Induration. A miss does not skillchain and does not give TP. A hit gives Titan its full delay TP and does not spend the bar. The current page says damage varies with TP. The anchors are not printed, so this yard's hit does not grow. It does not magic burst. Blood pacts do not feed the foe TP." },
  { name: "Burning Strike", level: 23, access: "sub", avatar: "Ifrit", kind: "rage", effect: "One blunt hit. Fire elemental. Skillchain property: Impaction. It closes Reverberation or Induration into Impaction, and Liquefaction into Fusion. It opens Impaction, which a later skill can close into Liquefaction or Detonation. A miss does not skillchain and does not give TP. A hit gives Ifrit its full delay TP and does not spend the bar. The current page says accuracy varies with TP. That bonus is not printed, so it is not rolled. It does not magic burst. Blood pacts do not feed the foe TP." },
  { name: "Tail Whip", level: 26, access: "sub", avatar: "Leviathan", kind: "rage", effect: "One blunt hit. Additional effect: Weight. The page says Weight is more potent than Gravity and is replaced by it. The cut and the duration are not printed, so this yard uses Gravity: movement is 74% of normal for 120 seconds. Skillchain property: Detonation. It closes Impaction, Compression, or Scission into Detonation. It opens Detonation, which a later skill can close into Scission or Gravitation. A miss does not skillchain and does not give TP. A hit gives Leviathan its full delay TP and does not spend the bar. The current page says damage varies with TP. The anchors are not printed, so this yard's hit does not grow. It does not magic burst. Blood pacts do not feed the foe TP." },
  { name: "Double Punch", level: 30, access: "sub", avatar: "Ifrit", kind: "rage", effect: "Two blunt hits, one accuracy roll. Skillchain property: Compression. It closes Transfixion or Induration into Compression, and Detonation into Gravitation. It opens Compression. A miss does not skillchain and does not give TP. A hit gives Ifrit its full delay TP twice and does not spend the bar. The current page says damage varies with TP and that one fTP is shared across the hits. The anchors are not printed, so this yard's hit does not grow. It does not magic burst. Blood pacts do not feed the foe TP." },
  { name: "Megalith Throw", level: 35, access: "sub", avatar: "Titan", kind: "rage", effect: "One blunt throw. Additional effect: Slow. The page does not print the slow, so the spell's amount is used. Skillchain property: Induration. It closes Reverberation into Induration. It opens Induration, which a later skill can close into Impaction, Compression, or Fragmentation. A miss does not skillchain and does not give TP. A hit gives Titan its full delay TP and does not spend the bar. The current page says accuracy varies with TP. That bonus is not printed, so it is not rolled. It does not magic burst. Blood pacts do not feed the foe TP." },
  { name: "Double Slap", level: 50, access: "master-sub", avatar: "Shiva", kind: "rage", mp: 96, effect: "Two blunt hits, one accuracy roll. Shiva, not Cait Sith. Skillchain property: Scission. It closes Liquefaction or Detonation into Scission, and Transfixion into Distortion. It opens Scission, which a later skill can close into Liquefaction, Detonation, or Reverberation. A miss does not skillchain and does not give TP. A hit gives Shiva its full delay TP twice and does not spend the bar. The current page says the accuracy bonus varies with TP. That bonus is not printed, so it is not rolled. It does not magic burst. A support job needs master levels. Blood pacts do not feed the foe TP." },
  { name: "Meteorite", level: 55, access: "master-sub", avatar: "Carbuncle", kind: "rage", effect: "Light magic on one foe. No skillchain property, so it does not open or close a chain and it does not end a burst. It magic bursts Transfixion, Fusion, Light, and Radiance. Damage scales with Carbuncle's TP, then the pact spends that bar. 0 TP is this yard's light hit. 1500 TP is 1024/896 of it. 3000 TP is 1088/896 of it. A support job needs master levels. Blood pacts do not feed the foe TP." },
  { name: "Fire IV", level: 60, access: "sub", avatar: "Ifrit", kind: "rage", effect: "Magical fire pact on one foe. Not the black magic spell, and not an area. No skillchain property. It magic bursts Liquefaction, Fusion, Light, and Radiance, and it does not end that window. Spends the avatar's TP. The current page does not print the TP anchors, so this yard's hit does not grow. Blood pacts do not feed the foe TP." },
  { name: "Stone IV", level: 60, access: "sub", avatar: "Titan", kind: "rage", effect: "Magical earth pact on one foe. Not the black magic spell, and not an area. No skillchain property. It magic bursts Scission, Gravitation, Darkness, and Umbra, and it does not end that window. Spends the avatar's TP. The current page does not print the TP anchors, so this yard's hit does not grow. Blood pacts do not feed the foe TP." },
  { name: "Water IV", level: 60, access: "sub", avatar: "Leviathan", kind: "rage", effect: "Magical water pact on one foe. Not the black magic spell, and not an area. No skillchain property. It magic bursts Reverberation, Distortion, Darkness, and Umbra, and it does not end that window. Spends the avatar's TP. The current page does not print the TP anchors, so this yard's hit does not grow. Blood pacts do not feed the foe TP." },
  { name: "Aero IV", level: 60, access: "sub", avatar: "Garuda", kind: "rage", effect: "Magical wind pact on one foe. Not the black magic spell, and not an area. No skillchain property. It magic bursts Detonation, Fragmentation, Light, and Radiance, and it does not end that window. Spends the avatar's TP. The current page does not print the TP anchors, so this yard's hit does not grow. Blood pacts do not feed the foe TP." },
  { name: "Blizzard IV", level: 60, access: "sub", avatar: "Shiva", kind: "rage", effect: "Magical ice pact on one foe. Not the black magic spell, and not an area. No skillchain property. It magic bursts Induration, Distortion, Darkness, and Umbra, and it does not end that window. Spends the avatar's TP. The current page does not print the TP anchors, so this yard's hit does not grow. Blood pacts do not feed the foe TP." },
  { name: "Thunder IV", level: 60, access: "sub", avatar: "Ramuh", kind: "rage", effect: "Magical lightning pact on one foe. Not the black magic spell, and not an area. No skillchain property. It magic bursts Impaction, Fragmentation, Light, and Radiance, and it does not end that window. Spends the avatar's TP. The current page does not print the TP anchors, so this yard's hit does not grow. Blood pacts do not feed the foe TP." },
  { name: "Sonic Buffet", level: 65, access: "sub", avatar: "Siren", kind: "rage", effect: "Wind magic on one foe. Not an area. Additional effect: Dispel. One effect, and it lands even when the damage does not. This foe has none. No skillchain property. It magic bursts Detonation, Fragmentation, Light, and Radiance, and it does not end that window. Spends the avatar's TP. The page does not print the damage, so the hit does not grow and INT is not a second formula. Blood pacts do not feed the foe TP." },
  { name: "Tornado II", level: 75, access: "sub", avatar: "Siren", kind: "rage", effect: "Wind magic on one foe. Not the black magic spell, and not an area. No skillchain property. It magic bursts Detonation, Fragmentation, Light, and Radiance, and it does not end that window. Spends the avatar's TP. The page does not print the damage, so this yard does not use the spell's table and the hit does not grow. INT is not a second formula. Blood pacts do not feed the foe TP." },
  { name: "Eclipse Bite", level: 65, access: "sub", avatar: "Fenrir", kind: "rage", effect: "Three slashing hits, one accuracy roll. Skillchain properties: Gravitation, then Scission. Gravitation closes Fusion into Gravitation and Distortion into Darkness. Scission is tried only if Gravitation does not close. It opens both. A miss does not skillchain and does not give TP. A hit gives Fenrir its full delay TP three times and does not spend the bar. The current page says damage varies with TP and that one fTP is shared across the hits. The anchors are not printed, so this yard's hit does not grow. It does not magic burst. Blood pacts do not feed the foe TP." },
  { name: "Nether Blast", level: 65, access: "sub", avatar: "Diabolos", kind: "rage", effect: "Darkness breath on one foe. Not an area. No skillchain property. It magic bursts Compression, Gravitation, Darkness, and Umbra, and it does not end that window. Spends the avatar's TP. The page says that bar does not change the damage. Its damage note is an approximation, so this yard's hit does not use that note and does not grow. Blood pacts do not feed the foe TP." },
  { name: "Flaming Crush", level: 70, access: "sub", avatar: "Ifrit", kind: "rage", effect: "Two blunt hits and one fire magic hit, one accuracy roll. The page ties the magic hit to the physical damage and does not print the rate, so a connecting hit adds this yard's fire. A miss deals none of it. Skillchain properties: Fusion, then Reverberation. Fusion closes Distortion into Fusion. Reverberation is tried only if Fusion does not close. It closes Transfixion or Scission into Reverberation, and Induration into Fragmentation. It opens both. The fire hit magic bursts Liquefaction, Fusion, Light, and Radiance, and that burst does not end the window. The skillchain still replaces the resonance. A miss does not skillchain and does not give TP. A hit gives Ifrit its full delay TP twice and does not spend the bar. The page says accuracy varies with TP. That bonus is not printed, so it is not rolled. Blood pacts do not feed the foe TP." },
  { name: "Mountain Buster", level: 70, access: "sub", avatar: "Titan", kind: "rage", effect: "One blunt hit. Additional effect: Bind. The page does not print the duration, so this yard uses Bind's 60 seconds. Damage removes it. Skillchain properties: Gravitation, then Induration. Gravitation closes Fusion into Gravitation and Distortion into Darkness. Induration is tried only if Gravitation does not close. It closes Reverberation into Induration. It opens both. A miss does not skillchain and does not give TP. A hit gives Titan its full delay TP and does not spend the bar. The current page says damage varies with TP. The anchors are not printed, so this yard's hit does not grow. It does not magic burst. Blood pacts do not feed the foe TP." },
  { name: "Spinning Dive", level: 70, access: "sub", avatar: "Leviathan", kind: "rage", effect: "One slashing hit. Physical, not a water magic hit. Skillchain properties: Distortion, then Detonation. Distortion closes Fragmentation into Distortion and Gravitation into Darkness. Detonation is tried only if Distortion does not close. It closes Impaction, Compression, or Scission into Detonation. It opens both. A miss does not skillchain and does not give TP. A hit gives Leviathan its full delay TP and does not spend the bar. The current page says accuracy varies with TP. That bonus is not printed, so it is not rolled. It does not magic burst. Blood pacts do not feed the foe TP." },
  { name: "Predator Claws", level: 70, access: "sub", avatar: "Garuda", kind: "rage", effect: "Three physical hits, one accuracy roll. Skillchain properties: Fragmentation, then Scission. Fragmentation closes Gravitation into Fragmentation and Fusion into Light. Scission is tried only if Fragmentation does not close. It closes Liquefaction or Detonation into Scission, and Transfixion into Distortion. It opens both. A miss does not skillchain and does not give TP. A hit gives Garuda its full delay TP three times and does not spend the bar. The current page says one fTP is shared across the hits. The anchors are not printed, so this yard's hit does not grow. The critical hit rate bonus varies with TP and is not printed, so it is not rolled. It does not magic burst. Blood pacts do not feed the foe TP." },
  { name: "Rush", level: 70, access: "sub", avatar: "Shiva", kind: "rage", effect: "Five physical hits, one accuracy roll. Not an ice magic hit. Skillchain properties: Distortion, then Scission. Distortion closes Fragmentation into Distortion and Gravitation into Darkness. Scission is tried only if Distortion does not close. It closes Liquefaction or Detonation into Scission, and Transfixion into Distortion. It opens both. A miss does not skillchain and does not give TP. A hit gives Shiva its full delay TP five times and does not spend the bar. The current page says one fTP is shared across the hits. The anchors are not printed, so this yard's hit does not grow. The accuracy bonus varies with TP and is not printed, so it is not rolled. It does not magic burst. Blood pacts do not feed the foe TP." },
  { name: "Chaotic Strike", level: 70, access: "sub", avatar: "Ramuh", kind: "rage", effect: "Three blunt hits, one accuracy roll. Additional effect: Stun. The page does not print the stun, so the spell's length is used. Skillchain properties: Fragmentation, then Transfixion. Fragmentation closes Gravitation into Fragmentation and Fusion into Light. Transfixion is tried only if Fragmentation does not close. It closes Compression into Transfixion. It opens both. A miss does not skillchain and does not give TP. A hit gives Ramuh its full delay TP three times and does not spend the bar. The current page says one fTP is shared across the hits. The anchors are not printed, so this yard's hit does not grow. The critical hit rate varies with TP and is not printed, so it is not rolled. It does not magic burst. Blood pacts do not feed the foe TP." },
  { name: "Zantetsuken", level: 75, access: "main", avatar: "Odin", kind: "rage", astral: true, effect: "Astral Flow only. Vanquishes foes in an area in one strike. This yard has one foe, so the printed chance is 100%. It is not a notorious monster, so the dark-damage path does not apply and there is no magic burst. No skillchain property. That other path does not print a damage formula. Astral Flow does not spend the avatar's TP. Odin leaves, and Astral Flow ends. Spends all MP. Blood pacts do not feed TP." },
  { name: "Perfect Defense", level: 75, access: "main", avatar: "Alexander", kind: "ward", astral: true, effect: "Astral Flow only. Party only. Reduces damage taken and resists status ailments. The duration is 30 seconds plus floor of Summoning Magic divided by 20, capped at 60. At 75 that is 43. The page does not print the cut or the resist rate, so neither is applied. Decay after half the duration is not numbered, so it is not applied. The data file calls this Rage. It acts as a ward. No skillchain property and it does not magic burst. Astral Flow does not spend the avatar's TP. Alexander leaves, and Astral Flow ends. Spends all MP." },
  { name: "Healing Ruby", level: 1, access: "sub", avatar: "Carbuncle", kind: "ward", mp: 6, effect: "Restores 8 + level × 2 HP. Not a Cure spell. No skillchain property, and a heal does not magic burst. A magic blood pact spends the avatar's TP. The printed cure does not grow with it." },
  { name: "Shining Ruby", level: 24, access: "sub", avatar: "Carbuncle", kind: "ward", effect: "Protect and Shell for 3 minutes. Defense +25/256. Magic damage taken −10/256. No skillchain property and it does not magic burst." },
  { name: "Glittering Ruby", level: 44, access: "sub", avatar: "Carbuncle", kind: "ward", effect: "One random attribute for 3 minutes. The bonus is 3 + floor(level ÷ 5). At 75 that is 18. No skillchain property and it does not magic burst. A level-37 subjob has not learned it." },
  { name: "Healing Ruby II", level: 65, access: "sub", avatar: "Carbuncle", kind: "ward", mp: 124, effect: "Restores 28 + level × 4 HP. No skillchain property, and a heal does not magic burst. A magic blood pact spends the avatar's TP. The printed cure does not grow with it." },
  { name: "Altana's Favor", level: 1, access: "sub", avatar: "Cait Sith", kind: "ward", astral: true, effect: "Astral Flow only. Party only. Alive, Reraise III with no timer. Dead, Arise is Raise III, and the Reraise III that follows lasts one hour. Any reraise replaces any other. No skillchain property and it does not magic burst. Astral Flow does not spend the avatar's TP. Spends all MP. Blood pacts do not feed TP." },
  { name: "Somnolence", level: 20, access: "sub", avatar: "Diabolos", kind: "ward", effect: "Dark magic and Weight on one foe. The weight matches Gravity and is replaced by it, so movement is 74% of normal for 120 seconds. The damage amount is not printed, so the hit does not grow. No skillchain property. It magic bursts Compression, Gravitation, Darkness, and Umbra, and it does not end that window. A ward does not spend the avatar's TP." },
  { name: "Lunar Cry", level: 21, access: "sub", avatar: "Fenrir", kind: "ward", effect: "Accuracy down and evasion down for 3 minutes. The two cuts add to 32 and follow the twelve moon phases. Full moon is accuracy −31 and evasion −1. New moon is accuracy −1 and evasion −31. No skillchain property. It does not use TP and it does not magic burst." },
  { name: "Aerial Armor", level: 25, access: "sub", avatar: "Garuda", kind: "ward", mp: 92, effect: "Blink for 15 minutes. Not an evasion bonus. The page says 3 or 4 shadows, and that 3 is only at low levels. The skill check is not printed, so this yard uses 4, not Blink's 2. No skillchain property and it does not magic burst." },
  { name: "Mewing Lullaby", level: 25, access: "sub", avatar: "Cait Sith", kind: "ward", effect: "Light-based sleep in an area, and it lowers TP. Unresisted sleep is 35 seconds. The page does not print a partial TP cut, so the bar is reset, and that reset cannot miss. No damage. No skillchain property and it does not magic burst. A ward does not spend the avatar's TP." },
  { name: "Raise II", level: 15, access: "sub", avatar: "Cait Sith", kind: "ward", effect: "Grants Raise II to one party member. A living target is no effect. The HP is 25% of the weakened pool. Experience is calculated and discarded. No skillchain property and it does not magic burst. A ward does not spend the avatar's TP." },
  { name: "Reraise II", level: 30, access: "sub", avatar: "Cait Sith", kind: "ward", effect: "Grants Reraise II to one party member for one hour. The HP on a later KO is Raise II, 25% of the weakened pool. Experience is calculated and discarded. It replaces any other reraise. No skillchain property and it does not magic burst. A ward does not spend the avatar's TP." },
  { name: "Eerie Eye", level: 55, access: "master-sub", avatar: "Cait Sith", kind: "ward", effect: "A gaze that inflicts Silence and Amnesia. This foe is in front, so the cone is not rolled. Silence lasts the spell's 120 seconds. Amnesia's length is not printed, so it is not timed. No damage. No skillchain property and it does not magic burst. A support job needs master levels. A ward does not spend the avatar's TP." },
  { name: "Frost Armor", level: 28, access: "sub", avatar: "Shiva", kind: "ward", effect: "Ice Spikes for 3 minutes. The page does not print the spike, so the spell's amount is used. No skillchain property and it does not magic burst." },
  { name: "Nightmare", level: 29, access: "sub", avatar: "Diabolos", kind: "ward", effect: "Sleep and Bio in an area. Unresisted sleep is 90 seconds. Bio slips 2 HP every 3 seconds and does not wake that sleep. A direct hit still does. The page's darkness line is that slip, not a second nuke, so there is no magic burst and no skillchain. A ward does not spend the avatar's TP. Not Shiva's Sleepga." },
  { name: "Rolling Thunder", level: 31, access: "sub", avatar: "Ramuh", kind: "ward", mp: 52, effect: "Enthunder for 2 minutes. Not an attack bonus. The page does not print the added damage, so the enspell curve uses Summoning Magic. No skillchain property and it does not magic burst." },
  { name: "Lunar Roar", level: 32, access: "sub", avatar: "Fenrir", kind: "ward", effect: "Dispels two effects in an area. This foe has none, so it has no effect. No skillchain property. It does not use TP and it does not magic burst." },
  { name: "Slowga", level: 33, access: "sub", avatar: "Leviathan", kind: "ward", mp: 48, effect: "Leviathan. Slow in an area. Not Diabolos. No skillchain property and it does not magic burst. The page does not print the slow, so the spell's amount is used. A note of about 30% is not a formula. A ward does not spend the avatar's TP." },
  { name: "Whispering Wind", level: 36, access: "sub", avatar: "Garuda", kind: "ward", mp: 119, effect: "Area heal. The page ties the cure to Garuda's maximum HP and does not print the coefficient. The yard still uses floor(level × 2.5 + 16). The cure does not grow with TP. The page says the range varies with the avatar's TP. That range is not printed, so it is not grown. A magic blood pact spends the avatar's TP. No skillchain property and it does not magic burst." },
  { name: "Ultimate Terror", level: 37, access: "sub", avatar: "Diabolos", kind: "ward", effect: "Lowers attributes of foes in an area centered on Diabolos. The page reports a start of 21 and a random number of stats, and the duration is not printed. Those notes are not a formula, so no stat is cut. No skillchain property and it does not magic burst. A ward does not spend the avatar's TP. A level-37 subjob has this." },
  { name: "Crimson Howl", level: 38, access: "sub", avatar: "Ifrit", kind: "ward", effect: "Attack up for 1 minute. The bonus is floor((level ÷ 4) + 4.75)/256. At 75 that is 23. No skillchain property and it does not magic burst. A level-37 subjob has not learned it." },
  { name: "Sleepga", level: 39, access: "sub", avatar: "Shiva", kind: "ward", mp: 54, effect: "Shiva. Sleep in an area. Not Diabolos. No damage. The page prints 90 seconds. The spell's Sleepga is 60, so this pact does not use that. No skillchain property and it does not magic burst. A level-37 subjob has not learned it." },
  { name: "Lightning Armor", level: 42, access: "sub", avatar: "Ramuh", kind: "ward", effect: "Shock Spikes for 3 minutes. The page does not print the spike, so the spell's amount is used. No skillchain property and it does not magic burst. A level-37 subjob has not learned it." },
  { name: "Ecliptic Growl", level: 43, access: "sub", avatar: "Fenrir", kind: "ward", effect: "STR, DEX, and VIT against AGI, INT, MND, and CHR, for 3 minutes. The two bonuses add to 8 and follow the twelve moon phases. Full moon is +7 and +1. New moon is +1 and +7. A stat Glittering Ruby already raised is skipped. No skillchain property and it does not magic burst. A level-37 subjob has not learned it." },
  { name: "Earthen Ward", level: 46, access: "sub", avatar: "Titan", kind: "ward", effect: "Stoneskin for 15 minutes. The shell is 2 × level + 50. At 75 that is 200. No skillchain property and it does not magic burst. A level-37 subjob has not learned it." },
  { name: "Spring Water", level: 47, access: "sub", avatar: "Leviathan", kind: "ward", mp: 99, effect: "Area heal, and it removes Poison, Paralysis, Blindness, Silence, Petrification, Disease, and Plague. Not Slow, and not Curse. Not Refresh. The current page ties the heal to Leviathan's maximum HP and does not print the coefficient. The yard still uses 47 + level × 3. No skillchain property and it does not magic burst. A magic blood pact spends the avatar's TP. That cure does not grow with it. The page says the range varies with the avatar's TP. That range is not printed, so it is not grown." },
  { name: "Hastega", level: 48, access: "sub", avatar: "Garuda", kind: "ward", effect: "Haste for 3 minutes. 153/1024, not the spell's 150. 129 MP. No skillchain property and it does not magic burst. A level-37 subjob has not learned it." },
  { name: "Noctoshield", level: 49, access: "sub", avatar: "Diabolos", kind: "ward", effect: "Phalanx for 3 minutes. A flat 13, not the enhancing formula. Either Phalanx spell overwrites it. No skillchain property and it does not magic burst. A level-37 subjob has not learned it." },
  { name: "Dream Shroud", level: 56, access: "master-sub", avatar: "Diabolos", kind: "ward", mp: 121, effect: "Magic attack and magic defense for 3 minutes. Vanadiel's hour sets both. Midnight is magic attack +13 and magic defense +1. Noon is +1 and +13. No skillchain property and it does not magic burst. A support job needs master levels. A level-37 subjob has not learned it." },
  { name: "Lunatic Voice", level: 15, access: "sub", avatar: "Siren", kind: "ward", effect: "Silence in an area for 90 seconds. It overwrites Silence and is overwritten by it. No damage. No skillchain property and it does not magic burst. A ward does not spend the avatar's TP." },
  { name: "Katabatic Blades", level: 31, access: "sub", avatar: "Siren", kind: "ward", effect: "Enaero for 2 minutes. Not an attack bonus. The page points at Rolling Thunder and does not print a separate formula, so the enspell curve uses Summoning Magic. No skillchain property and it does not magic burst. A ward does not spend the avatar's TP." },
  { name: "Chinook", level: 42, access: "sub", avatar: "Siren", kind: "ward", effect: "Aquaveil for 15 minutes. The page does not print the charges. A note of up to 3 is the spell's cap, so this yard uses that curve with Summoning Magic. At 75 that is 1. No skillchain property and it does not magic burst. A ward does not spend the avatar's TP." },
  { name: "Bitter Elegy", level: 50, access: "master-sub", avatar: "Siren", kind: "ward", effect: "Elegy for 3 minutes. Attack speed −512/1024. The page says 50% and that it is wind-aligned. This yard does not roll a separate resist. No skillchain property and it does not magic burst. A support job needs master levels. A ward does not spend the avatar's TP." },
  { name: "Punch", level: 1, access: "sub", avatar: "Ifrit", kind: "rage", effect: "One blunt hit. Skillchain property: Liquefaction. It closes Impaction or Scission into Liquefaction. It opens Liquefaction, which a later skill can close into Fusion or Scission. A miss does not skillchain and does not give TP. A hit gives Ifrit its full delay TP and does not spend the bar. The current page says accuracy varies with TP. That bonus is not printed, so it is not rolled. It does not magic burst. Blood pacts do not feed the foe TP." },
  { name: "Rock Throw", level: 1, access: "sub", avatar: "Titan", kind: "rage", effect: "One blunt throw. Additional effect: Slow. The page does not print the slow, so the spell's amount is used. Skillchain property: Scission. It closes Liquefaction or Detonation into Scission, and Transfixion into Distortion. It opens Scission, which a later skill can close into Liquefaction, Detonation, or Reverberation. A miss does not skillchain and does not give TP. A hit gives Titan its full delay TP and does not spend the bar. The current page says accuracy varies with TP. That bonus is not printed, so it is not rolled. It does not magic burst. Blood pacts do not feed the foe TP." },
  { name: "Barracuda Dive", level: 1, access: "sub", avatar: "Leviathan", kind: "rage", effect: "One slashing hit. Skillchain property: Reverberation. It closes Transfixion or Scission into Reverberation, and Induration into Fragmentation. It opens Reverberation, which a later skill can close into Impaction or Induration. A miss does not skillchain and does not give TP. A hit gives Leviathan its full delay TP and does not spend the bar. The current page says accuracy varies with TP. That bonus is not printed, so it is not rolled. It does not magic burst. Blood pacts do not feed the foe TP." },
  { name: "Claw", level: 1, access: "sub", avatar: "Garuda", kind: "rage", effect: "One piercing hit. Skillchain property: Detonation. It closes Impaction, Compression, or Scission into Detonation. It opens Detonation, which a later skill can close into Scission or Gravitation. A miss does not skillchain and does not give TP. A hit gives Garuda its full delay TP and does not spend the bar. The current page says the critical hit rate bonus varies with TP. That bonus is not printed, so it is not rolled. It does not magic burst. Blood pacts do not feed the foe TP." },
  { name: "Axe Kick", level: 1, access: "sub", avatar: "Shiva", kind: "rage", effect: "One blunt hit. Skillchain property: Induration. It closes Reverberation into Induration. It opens Induration, which a later skill can close into Impaction, Compression, or Fragmentation. A miss does not skillchain and does not give TP. A hit gives Shiva its full delay TP and does not spend the bar. The current page says damage varies with TP. The anchors are not printed, so this yard's hit does not grow. It does not magic burst. Blood pacts do not feed the foe TP." },
  { name: "Shock Strike", level: 1, access: "sub", avatar: "Ramuh", kind: "rage", effect: "One blunt hit. Additional effect: Stun. The page does not print the stun, so the spell's length is used. Skillchain property: Impaction. It closes Reverberation or Induration into Impaction, and Liquefaction into Fusion. It opens Impaction, which a later skill can close into Liquefaction or Detonation. A miss does not skillchain and does not give TP. A hit gives Ramuh its full delay TP and does not spend the bar. The current page says the critical hit rate varies with TP. That bonus is not printed, so it is not rolled. It does not magic burst. Blood pacts do not feed the foe TP." },
  { name: "Camisado", level: 1, access: "sub", avatar: "Diabolos", kind: "rage", effect: "One blunt hit. Skillchain property: Compression. It closes Transfixion or Induration into Compression, and Detonation into Gravitation. It opens Compression. A miss does not skillchain and does not give TP. A hit gives Diabolos its full delay TP and does not spend the bar. The current page says the accuracy bonus varies with TP. That bonus is not printed, so it is not rolled. The page names STR and MND. That is not a combine formula, so this yard does not add one. It does not magic burst. Blood pacts do not feed the foe TP." },
  { name: "Regal Scratch", level: 1, access: "sub", avatar: "Cait Sith", kind: "rage", effect: "Three physical hits, one accuracy roll. Skillchain property: Scission. It closes Liquefaction or Detonation into Scission, and Transfixion into Distortion. It opens Scission, which a later skill can close into Liquefaction, Detonation, or Reverberation. A miss does not skillchain and does not give TP. A hit gives Cait Sith its full delay TP three times and does not spend the bar. The current page says the accuracy bonus varies with TP. That bonus is not printed, so it is not rolled. The page names the avatar's INT. That is not a combine formula, so this yard does not add one. The damage type is not printed. It does not magic burst. Blood pacts do not feed the foe TP." },
  { name: "Level ? Holy", level: 75, access: "sub", avatar: "Cait Sith", kind: "rage", effect: "Light damage in an area. Not the Holy spell. A die from 1 to 6 hits a foe whose level is divisible by that face. 1 hits every level. A face that does not divide the level deals none and does not wake. The damage is proportional and no anchors are printed, so the hit does not grow with the face or with INT. No skillchain property. A connecting hit magic bursts Transfixion, Fusion, Light, and Radiance, and it does not end that window. A face that deals none does not burst. The page does not say the hit uses the avatar's TP, so the bar is not spent. Blood pacts do not feed the foe TP." },
  { name: "Roundhouse", level: 25, access: "sub", avatar: "Siren", kind: "rage", effect: "One hand-to-hand hit. Skillchain property: Detonation. It closes Impaction, Compression, or Scission into Detonation. It opens Detonation, which a later skill can close into Scission or Gravitation. A miss does not skillchain and does not give TP. A hit gives Siren its full delay TP and does not spend the bar. The stat line is not printed. The anchors are not printed, so this yard's hit does not grow. It does not magic burst. Blood pacts do not feed the foe TP." },
  { name: "Welt", level: 1, access: "sub", avatar: "Siren", kind: "rage", effect: "One physical hit. Skillchain property: Scission. It closes Liquefaction or Detonation into Scission, and Transfixion into Distortion. It opens Scission, which a later skill can close into Liquefaction, Detonation, or Reverberation. A miss does not skillchain and does not give TP. A hit gives Siren its full delay TP and does not spend the bar. The stat line is not printed. The damage type is not printed. It does not magic burst. Blood pacts do not feed the foe TP." },
  { name: "Meteor Strike", level: 75, access: "main", avatar: "Ifrit", kind: "rage", merit: true, effect: "Merit blood pact. Not unlocked." },
  { name: "Heavenly Strike", level: 75, access: "main", avatar: "Shiva", kind: "rage", merit: true, effect: "Merit blood pact. Not unlocked." },
  { name: "Wind Blade", level: 75, access: "main", avatar: "Garuda", kind: "rage", merit: true, effect: "Merit blood pact. Not unlocked." },
  { name: "Geocrush", level: 75, access: "main", avatar: "Titan", kind: "rage", merit: true, effect: "Merit blood pact. Not unlocked." },
  { name: "Thunderstorm", level: 75, access: "main", avatar: "Ramuh", kind: "rage", merit: true, effect: "Merit blood pact. Not unlocked." },
  { name: "Grand Fall", level: 75, access: "main", avatar: "Leviathan", kind: "rage", merit: true, effect: "Merit blood pact. Not unlocked." },
];

export type PactPose = "strike" | "flurry" | "whip" | "dive" | "cast" | "roar" | "ward" | "astral";

export type PactShow = {
  pose: PactPose;
  /** White hit flash on the foe. */
  hit?: boolean;
  nuke?: "fire" | "ice" | "wind" | "earth" | "thunder" | "water" | "light" | "dark";
  wide?: boolean;
  /** Cure column. The amount is pactCureAmount. */
  cure?: "Cure II" | "Cure III" | "Cure IV";
  at: "foe" | "player";
};

/**
 * Motion for every blood pact in the level-75 book.
 * Merit pacts stay locked, so the fight does not play them.
 * Damage, cures, and wards are rolled in pactPayoff. This table is only the pose.
 */
export const PACT_SHOW: Record<string, PactShow> = {
  "Searing Light": { pose: "astral", nuke: "light", wide: true, at: "foe" },
  Inferno: { pose: "astral", at: "foe" },
  "Earthen Fury": { pose: "astral", at: "foe" },
  "Tidal Wave": { pose: "astral", at: "foe" },
  "Aerial Blast": { pose: "astral", at: "foe" },
  "Diamond Dust": { pose: "astral", at: "foe" },
  "Judgment Bolt": { pose: "astral", at: "foe" },
  "Howling Moon": { pose: "roar", at: "foe" },
  "Ruinous Omen": { pose: "astral", wide: true, at: "foe" },
  "Clarsach Call": { pose: "astral", wide: true, at: "foe" },
  "Poison Nails": { pose: "strike", hit: true, at: "foe" },
  "Moonlit Charge": { pose: "dive", hit: true, at: "foe" },
  "Crescent Fang": { pose: "strike", hit: true, at: "foe" },
  "Fire II": { pose: "cast", nuke: "fire", at: "foe" },
  "Stone II": { pose: "cast", nuke: "earth", at: "foe" },
  "Water II": { pose: "cast", nuke: "water", at: "foe" },
  "Aero II": { pose: "cast", nuke: "wind", at: "foe" },
  "Blizzard II": { pose: "cast", nuke: "ice", at: "foe" },
  "Thunder II": { pose: "cast", nuke: "thunder", at: "foe" },
  Thunderspark: { pose: "cast", nuke: "thunder", wide: true, at: "foe" },
  "Rock Buster": { pose: "strike", hit: true, at: "foe" },
  "Burning Strike": { pose: "strike", hit: true, at: "foe" },
  "Tail Whip": { pose: "whip", hit: true, at: "foe" },
  "Double Punch": { pose: "flurry", at: "foe" },
  "Megalith Throw": { pose: "strike", at: "foe" },
  "Double Slap": { pose: "flurry", at: "foe" },
  Meteorite: { pose: "cast", nuke: "light", at: "foe" },
  "Fire IV": { pose: "cast", nuke: "fire", at: "foe" },
  "Stone IV": { pose: "cast", nuke: "earth", at: "foe" },
  "Water IV": { pose: "cast", nuke: "water", at: "foe" },
  "Aero IV": { pose: "cast", nuke: "wind", at: "foe" },
  "Blizzard IV": { pose: "cast", nuke: "ice", at: "foe" },
  "Thunder IV": { pose: "cast", nuke: "thunder", at: "foe" },
  "Sonic Buffet": { pose: "cast", at: "foe" },
  "Tornado II": { pose: "cast", at: "foe" },
  "Eclipse Bite": { pose: "flurry", at: "foe" },
  "Nether Blast": { pose: "cast", at: "foe" },
  "Flaming Crush": { pose: "flurry", at: "foe" },
  "Mountain Buster": { pose: "strike", at: "foe" },
  "Spinning Dive": { pose: "dive", hit: true, at: "foe" },
  "Predator Claws": { pose: "flurry", at: "foe" },
  Rush: { pose: "flurry", at: "foe" },
  "Chaotic Strike": { pose: "flurry", at: "foe" },
  Zantetsuken: { pose: "astral", wide: true, at: "foe" },
  Deconstruction: { pose: "cast", at: "foe" },
  Chronoshift: { pose: "ward", wide: true, at: "player" },
  "Perfect Defense": { pose: "ward", wide: true, at: "player" },
  "Healing Ruby": { pose: "ward", cure: "Cure II", at: "player" },
  "Shining Ruby": { pose: "ward", nuke: "light", at: "player" },
  "Glittering Ruby": { pose: "ward", nuke: "light", at: "player" },
  "Healing Ruby II": { pose: "ward", cure: "Cure IV", at: "player" },
  "Altana's Favor": { pose: "ward", wide: true, at: "player" },
  Somnolence: { pose: "cast", at: "foe" },
  "Lunar Cry": { pose: "roar", at: "foe" },
  "Aerial Armor": { pose: "ward", at: "player" },
  "Mewing Lullaby": { pose: "roar", wide: true, at: "foe" },
  "Raise II": { pose: "ward", at: "player" },
  "Reraise II": { pose: "ward", at: "player" },
  "Eerie Eye": { pose: "cast", at: "foe" },
  "Frost Armor": { pose: "ward", at: "player" },
  Nightmare: { pose: "cast", wide: true, at: "foe" },
  "Rolling Thunder": { pose: "ward", at: "player" },
  "Lunar Roar": { pose: "roar", at: "foe" },
  Slowga: { pose: "cast", at: "foe" },
  "Whispering Wind": { pose: "ward", at: "player" },
  "Ultimate Terror": { pose: "roar", wide: true, at: "foe" },
  "Crimson Howl": { pose: "roar", at: "player" },
  Sleepga: { pose: "cast", at: "foe" },
  "Lightning Armor": { pose: "ward", at: "player" },
  "Ecliptic Growl": { pose: "roar", at: "player" },
  "Earthen Ward": { pose: "ward", at: "player" },
  "Spring Water": { pose: "ward", at: "player" },
  Hastega: { pose: "ward", at: "player" },
  Noctoshield: { pose: "ward", at: "player" },
  "Dream Shroud": { pose: "ward", at: "player" },
  "Lunatic Voice": { pose: "roar", wide: true, at: "foe" },
  "Katabatic Blades": { pose: "ward", at: "player" },
  Chinook: { pose: "ward", at: "player" },
  "Bitter Elegy": { pose: "cast", at: "foe" },
  Punch: { pose: "strike", hit: true, at: "foe" },
  "Rock Throw": { pose: "strike", at: "foe" },
  "Barracuda Dive": { pose: "dive", hit: true, at: "foe" },
  Claw: { pose: "strike", hit: true, at: "foe" },
  "Axe Kick": { pose: "strike", hit: true, at: "foe" },
  "Shock Strike": { pose: "strike", at: "foe" },
  Camisado: { pose: "dive", at: "foe" },
  "Regal Scratch": { pose: "flurry", at: "foe" },
  "Level ? Holy": { pose: "cast", wide: true, at: "foe" },
  Roundhouse: { pose: "strike", at: "foe" },
  Welt: { pose: "strike", at: "foe" },
  "Meteor Strike": { pose: "astral", nuke: "fire", wide: true, at: "foe" },
  "Heavenly Strike": { pose: "astral", nuke: "ice", wide: true, at: "foe" },
  "Wind Blade": { pose: "astral", nuke: "wind", wide: true, at: "foe" },
  Geocrush: { pose: "astral", nuke: "earth", wide: true, at: "foe" },
  Thunderstorm: { pose: "astral", nuke: "thunder", wide: true, at: "foe" },
  "Grand Fall": { pose: "astral", nuke: "water", wide: true, at: "foe" },
};

/** Pacts this avatar can show at this Summoner level. Merit pacts stay out. Astral is a separate pass. */
export function summonShowPacts(avatarName: string, level: number, main: boolean, astral: boolean): string[] {
  return SMN_PACTS.filter((pact) => {
    if (pact.avatar !== avatarName || pact.merit || pact.level > level || !!pact.astral !== astral) return false;
    if (!main && (pact.access === "main" || pact.access === "master-sub")) return false;
    return true;
  }).map((pact) => pact.name);
}

const PACT_BY_NAME = new Map(SMN_PACTS.map((pact) => [pact.name, pact]));
const AVATAR_RANK = new Map(SUMMONS.map((row, index) => [row.name, index]));

export function pactByName(name: string): BloodPact | null {
  return PACT_BY_NAME.get(name) ?? null;
}

/**
 * Menu order. One avatar's pacts stay together, in the summon list's order.
 * Inside that block the level climbs. A normal pact sits before an Astral Flow
 * pact of the same level, and a rage sits before a ward.
 */
export function orderedPacts(pacts: readonly BloodPact[]): BloodPact[] {
  return [...pacts].sort((a, b) => {
    const rank = (AVATAR_RANK.get(a.avatar) ?? 999) - (AVATAR_RANK.get(b.avatar) ?? 999);
    if (rank !== 0) return rank;
    if (a.level !== b.level) return a.level - b.level;
    if (!!a.astral !== !!b.astral) return a.astral ? 1 : -1;
    if (a.kind !== b.kind) return a.kind === "rage" ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
}

/** Recast key. Separate from a spell that shares the printed name, such as Fire II. */
export function pactRecastId(name: string): string {
  return `pact:${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
}

/**
 * Weapon damage the perpetuation page does not print.
 * floor(level × 0.9 + 6). Rank is floor(damage / 9), the same fSTR cap as a weapon.
 * A job sheet does not replace this. No avatar page printed a weapon damage.
 */
export function avatarWeaponDamage(level: number): number {
  return Math.max(1, Math.floor(Math.max(0, level) * 0.9 + 6));
}

/**
 * Jobs a summon actually prints, at the avatar's own level.
 * Bartlett's summon page (英雄なき時代の英雄, 召喚獣データ) groups Ifrit
 * with Shiva, Garuda, Titan, Ramuh, Leviathan, Fenrir, Diabolos, and
 * Siren as 暗黒騎士／黒魔道士. Siren is that pair. She is not SMN/SMN,
 * and the Yuhtunga fight's Bard line is not this sheet.
 * Carbuncle and Cait Sith on that page are 白魔道士／黒魔道士. The classic
 * Carbuncle WHM/WAR pair is not used. Cait Sith is not a lone White Mage.
 * The printed totals on that page start at level 99 (Ifrit HP 1600,
 * Carbuncle HP 1533). Those are not copied. Stout Servant, the rank-2
 * regen, and the extra magic defense on that 99 card are not applied.
 * Odin is not in that summon block. Bartlett's Odin's Chamber line is
 * 暗／暗. Gamer Escape lists Dark Knight / Black Mage / Red Mage /
 * Summoner, and the previous sheet used the first of those pairs.
 * The summoned Odin is DRK/DRK. There is no four-job sheet.
 * Alexander is not on the Bartlett summon block. The fight says White
 * Mage and no sub. A missing sub is the same job twice, so WHM/WHM.
 * He leaves after Perfect Defense, but the brief line still names the pair.
 * Spirits use the elemental species row: 黒／黒. That replaces Black Mage /
 * Red Mage, and it replaces a separate Light White Mage and Dark Dark Knight.
 * Atomos's box says Unknown. It is not a staying pet, so no job is invented.
 * Species ranks on those rows are all D, which is why the Hume naked sheet
 * is the base. No second species formula is rolled.
 * The avatar's level is the Summoner's. A sub is half, floored, the same
 * rule as a player. It is not the monster note where the sub equals the main.
 * A trait of the same name does not stack, so a double job keeps the main's
 * tier only. Black Mage Magic Attack Bonus is not a second multiplier on
 * a pact or a spirit nuke.
 */
const AVATAR_JOBS: Partial<Record<SummonId, { main: JobId; sub: JobId | null }>> = {
  carbuncle: { main: "WHM", sub: "BLM" },
  "cait-sith": { main: "WHM", sub: "BLM" },
  ifrit: { main: "DRK", sub: "BLM" },
  shiva: { main: "DRK", sub: "BLM" },
  garuda: { main: "DRK", sub: "BLM" },
  titan: { main: "DRK", sub: "BLM" },
  ramuh: { main: "DRK", sub: "BLM" },
  leviathan: { main: "DRK", sub: "BLM" },
  fenrir: { main: "DRK", sub: "BLM" },
  diabolos: { main: "DRK", sub: "BLM" },
  siren: { main: "DRK", sub: "BLM" },
  odin: { main: "DRK", sub: "DRK" },
  alexander: { main: "WHM", sub: "WHM" },
  "fire-spirit": { main: "BLM", sub: "BLM" },
  "ice-spirit": { main: "BLM", sub: "BLM" },
  "air-spirit": { main: "BLM", sub: "BLM" },
  "earth-spirit": { main: "BLM", sub: "BLM" },
  "thunder-spirit": { main: "BLM", sub: "BLM" },
  "water-spirit": { main: "BLM", sub: "BLM" },
  "light-spirit": { main: "BLM", sub: "BLM" },
  "dark-spirit": { main: "BLM", sub: "BLM" },
};

type SkillRow = { name: string; rank: SkillRank };

function skillRows(job: JobId): readonly SkillRow[] {
  if (job === "WHM") return WHM_SKILLS;
  if (job === "WAR") return WAR_SKILLS;
  if (job === "DRK") return DRK_SKILLS;
  if (job === "BLM") return BLM_SKILLS;
  if (job === "RDM") return RDM_SKILLS;
  if (job === "BRD") return BRD_SKILLS;
  return [];
}

function oneSkill(job: JobId, name: string, level: number): number {
  const row = skillRows(job).find((skill) => skill.name === name);
  return row ? skillCap(row.rank, level) : 0;
}

/** Higher of the main job at the avatar's level and a different subjob at half. The same job twice does not add its own skill. */
function petSkill(name: string, main: JobId, level: number, sub: JobId | null, subLevel: number): number {
  const subCap = sub && sub !== main && subLevel > 0 ? oneSkill(sub, name, subLevel) : 0;
  return Math.max(oneSkill(main, name, level), subCap);
}

/** Singing and the instruments are not weapons. Bard's song skill must not beat the dagger. */
const NOT_A_WEAPON = new Set(["Evasion", "Parrying", "Shield", "Guard", "Singing", "String Instrument", "Wind Instrument"]);

function weaponSkill(main: JobId, level: number, sub: JobId | null, subLevel: number): { name: string; skill: number } {
  let best = { name: "Club", skill: 0 };
  const seen = new Set<string>();
  const rows = sub ? [...skillRows(main), ...skillRows(sub)] : [...skillRows(main)];
  for (const row of rows) {
    if (seen.has(row.name) || NOT_A_WEAPON.has(row.name) || row.name.endsWith("Magic")) continue;
    seen.add(row.name);
    const skill = petSkill(row.name, main, level, sub, subLevel);
    if (skill > best.skill) best = { name: row.name, skill };
  }
  return best;
}

export type AvatarSheet = {
  /** Printed pair, or the one job when the page printed no sub. */
  jobs: string;
  hp: number;
  mp: number;
  str: number;
  dex: number;
  vit: number;
  agi: number;
  int: number;
  mnd: number;
  chr: number;
  /** Highest physical weapon skill the pair has. */
  weapon: string;
  melee: number;
  attack: number;
  accuracy: number;
  defense: number;
  evasion: number;
  /** White Mage Magic Defense Bonus. 0 when the main is not White Mage. */
  mdb: number;
  /** White Mage Auto-Regen, HP every 3 seconds. Carbuncle's page lists it. The other White Mage pages did not reprint it, but it is that job's trait, so every White Mage main has it. */
  regen: number;
};

/**
 * Naked Hume of the printed jobs. No gear and no merits.
 * Race is Hume because that is the yard's naked sheet. The pages do not
 * print a race. Carbuncle's "54 INT at 75" and the DRK/BLM "82 INT at 75"
 * are not this total, so they are not used to pick a race or to fudge one.
 * Dark Knight Attack Bonus IV is +48 at 75 and is on the attack. The trait
 * list's "70" is the level that tier is learned, not a second +70.
 * Fenrir's printed +30% attack is applied after that. Diabolos's classic
 * page says +20% defense. Bartlett's current summon page says +30%
 * defense as well. This era-75 yard keeps the +20%.
 * Smite and Damage Limit+ are not folded into the
 * sword pDIF this yard already rolls. Black Mage Magic Attack Bonus is
 * +32 on a Black Mage main and +24 on a level-37 sub. A Black Mage /
 * Black Mage does not stack those. Pact nukes and spirit nukes use the
 * elemental D table and do not multiply by it.
 * White Mage Magic Defense Bonus and Auto-Regen are the main's tier only.
 * A White Mage sub, or a second White Mage, does not add another.
 * Dark Knight Attack Bonus is the main's +48 only. The sub's tier does not stack.
 */
export function avatarSheet(id: string, level: number): AvatarSheet | null {
  const pair = AVATAR_JOBS[id as SummonId];
  if (!pair || level <= 0) return null;
  const subLevel = pair.sub ? Math.floor(level / 2) : 0;
  const stats = characterBase("hume", pair.main, level, pair.sub, subLevel);
  const weapon = weaponSkill(pair.main, level, pair.sub, subLevel);
  const evasionSkill = petSkill("Evasion", pair.main, level, pair.sub, subLevel);
  let attack = mainHandAttack(stats.str, weapon.skill);
  if (pair.main === "DRK") attack += drkAttackBonus(level, "main");
  if (id === "fenrir") attack = Math.floor(attack * 1.3);
  let defense = baseDefense(stats.vit, level);
  if (id === "diabolos") defense = Math.floor(defense * 1.2);
  return {
    jobs: pair.sub ? `${pair.main}/${pair.sub}` : pair.main,
    hp: stats.hp,
    mp: stats.mp,
    str: stats.str,
    dex: stats.dex,
    vit: stats.vit,
    agi: stats.agi,
    int: stats.int,
    mnd: stats.mnd,
    chr: stats.chr,
    weapon: weapon.name,
    melee: weapon.skill,
    attack,
    accuracy: accuracyFrom(stats.dex, weapon.skill),
    defense,
    evasion: evasionFrom(stats.agi, evasionSkill),
    mdb: pair.main === "WHM" ? magicDefenseBonus(level, "main") : 0,
    regen: pair.main === "WHM" ? autoRegen(level) : 0,
  };
}

/** Stand-in STR for a pet whose page printed no job. */
export function avatarStr(level: number, id?: string | null): number {
  const sheet = id ? avatarSheet(id, level) : null;
  if (sheet) return sheet.str;
  return Math.max(1, Math.floor(Math.max(0, level) * 1.45 + 12));
}

export function avatarDex(level: number, id?: string | null): number {
  const sheet = id ? avatarSheet(id, level) : null;
  if (sheet) return sheet.dex;
  return Math.max(1, Math.floor(Math.max(0, level) * 1.15 + 10));
}

/** Stand-in INT. A pet with a printed job uses the sheet. Atomos does not swing, so this is not its INT. */
export function avatarInt(level: number, id?: string | null): number {
  const sheet = id ? avatarSheet(id, level) : null;
  if (sheet) return sheet.int;
  return Math.max(1, Math.floor(Math.max(0, level) * 1.55 + 14));
}

export function avatarMnd(level: number, id?: string | null): number {
  const sheet = id ? avatarSheet(id, level) : null;
  if (sheet) return sheet.mnd;
  return Math.max(1, Math.floor(Math.max(0, level) * 1.35 + 12));
}

/** Sheet attack when the pet has a job. Otherwise 8 + floor(level × 3) + the stand-in STR. */
export function avatarAttack(level: number, id?: string | null): number {
  const sheet = id ? avatarSheet(id, level) : null;
  if (sheet) return sheet.attack;
  return mainHandAttack(avatarStr(level), Math.floor(Math.max(0, level) * 3));
}

export function avatarAccuracy(level: number, id?: string | null): number {
  const sheet = id ? avatarSheet(id, level) : null;
  if (sheet) return sheet.accuracy;
  return accuracyFrom(avatarDex(level), Math.floor(Math.max(0, level) * 3.2));
}

/** Weapon damage + fSTR against this VIT. pDIF is applied by the fight. */
export function avatarMeleeBase(level: number, targetVit: number, id?: string | null): number {
  const dmg = avatarWeaponDamage(level);
  return dmg + fStr(avatarStr(level, id) - targetVit, Math.floor(dmg / 9));
}

export function avatarSwingSeconds(): number {
  return AVATAR_DELAY / 60;
}

/**
 * Printed MP from the pact pages.
 * Astral Flow pacts are not in this map. Those pages say the pact spends
 * all of your MP, and it will not fire unless you have at least level × 2.
 */
const PACT_MP: Record<string, number> = {
  Punch: 9,
  "Rock Throw": 10,
  "Barracuda Dive": 8,
  Claw: 7,
  "Axe Kick": 10,
  "Shock Strike": 6,
  Camisado: 20,
  "Regal Scratch": 5,
  "Poison Nails": 11,
  "Moonlit Charge": 17,
  "Crescent Fang": 19,
  "Fire II": 24,
  "Stone II": 24,
  "Water II": 24,
  "Aero II": 24,
  "Blizzard II": 24,
  "Thunder II": 24,
  Thunderspark: 38,
  "Rock Buster": 39,
  "Burning Strike": 48,
  "Tail Whip": 49,
  "Double Punch": 56,
  "Megalith Throw": 62,
  "Double Slap": 96,
  Meteorite: 108,
  "Fire IV": 118,
  "Stone IV": 118,
  "Water IV": 118,
  "Aero IV": 118,
  "Blizzard IV": 118,
  "Thunder IV": 118,
  "Eclipse Bite": 109,
  "Nether Blast": 109,
  "Flaming Crush": 164,
  "Mountain Buster": 164,
  "Spinning Dive": 164,
  "Predator Claws": 164,
  Rush: 164,
  "Chaotic Strike": 164,
  "Level ? Holy": 235,
  "Healing Ruby": 6,
  "Shining Ruby": 44,
  "Glittering Ruby": 62,
  "Healing Ruby II": 124,
  Somnolence: 30,
  "Lunar Cry": 41,
  "Aerial Armor": 92,
  "Mewing Lullaby": 61,
  "Raise II": 160,
  "Reraise II": 80,
  "Eerie Eye": 134,
  "Frost Armor": 63,
  Nightmare: 42,
  "Rolling Thunder": 52,
  "Lunar Roar": 27,
  Slowga: 48,
  "Whispering Wind": 119,
  "Ultimate Terror": 27,
  "Crimson Howl": 84,
  Sleepga: 54,
  "Lightning Armor": 91,
  "Ecliptic Growl": 46,
  "Earthen Ward": 92,
  "Spring Water": 99,
  Hastega: 129,
  Noctoshield: 92,
  "Dream Shroud": 121,
  "Lunatic Voice": 37,
  Welt: 9,
  Roundhouse: 52,
  "Katabatic Blades": 52,
  Chinook: 118,
  "Bitter Elegy": 96,
  "Sonic Buffet": 164,
  "Tornado II": 182,
};

/**
 * MP the command checks before an Astral Flow pact spends everything.
 * A 75-era astral pact needs at least the Summoner's level × 2, then
 * takes all of the MP you still have. The later fixed cost is not used.
 * A printed non-astral cost comes from the pact page.
 * A name missing from that map falls back to the old level band.
 */
export function pactMp(pact: BloodPact, level: number): number {
  if (pact.merit) return 0;
  if (pact.astral) return Math.max(1, level) * 2;
  const printed = PACT_MP[pact.name];
  if (printed != null) return printed;
  if (pact.level >= 65) return pact.kind === "ward" ? 96 : 118;
  if (pact.level >= 50) return 96;
  if (pact.level >= 30) return 48;
  if (pact.level >= 10) return 24;
  return pact.kind === "ward" ? 6 : 9;
}

/** Base seconds before Apogee. Skill over 300 is not in this yard. Healing and enfeebling wards are instant. */
export function pactWardSeconds(name: string): number {
  if (name === "Crimson Howl") return 60;
  if (name === "Reraise II") return 3600;
  if (name === "Lunatic Voice") return LUNATIC_SECONDS;
  if (name === "Rolling Thunder" || name === "Katabatic Blades") return 120;
  if (name === "Bitter Elegy" || name === "Hastega" || name === "Shining Ruby" || name === "Noctoshield" || name === "Dream Shroud" || name === "Ecliptic Growl" || name === "Lunar Cry" || name === "Frost Armor" || name === "Lightning Armor" || name === "Glittering Ruby") return 180;
  if (name === "Chinook" || name === "Aerial Armor" || name === "Earthen Ward") return 900;
  return 60;
}

/** Accuracy down across the twelve moon phases. Evasion down is the rest of 32. */
const LUNAR_ACC = [1, 6, 11, 16, 21, 26, 31, 26, 21, 16, 11, 6] as const;
/** STR, DEX, and VIT across the same phases. The other four stats are the rest of 8. */
const GROWL_BODY = [1, 2, 3, 4, 5, 6, 7, 6, 5, 4, 3, 2] as const;

export function lunarCryCut(phase: number): { acc: number; eva: number } {
  const acc = LUNAR_ACC[phase] ?? 16;
  return { acc, eva: 32 - acc };
}

export function eclipticGrowlCut(phase: number): { body: number; mind: number } {
  const body = GROWL_BODY[phase] ?? 4;
  return { body, mind: 8 - body };
}

/**
 * Dream Shroud. Hour 0 is magic attack 13 and magic defense 1.
 * Hour 12 is 1 and 13. The two hours on either side of midnight match.
 */
export function dreamShroudCut(hour: number): { mab: number; mdb: number } {
  const h = ((Math.floor(hour) % 24) + 24) % 24;
  const fromMidnight = Math.min(h, 24 - h);
  return { mab: 13 - fromMidnight, mdb: 1 + fromMidnight };
}

/**
 * Level ? Holy. The page says the damage is proportional and prints no anchors.
 * The stand-in does not grow with the face or with INT.
 */
export function levelHolyDamage(level: number): number {
  return level >= 60 ? 200 : 90;
}

/** Face 1 hits every level. Another face hits only when the level divides evenly. A face outside 1–6 does not. */
export function levelHolyHits(targetLevel: number, face: number): boolean {
  const die = Math.floor(face);
  if (die < 1 || die > 6) return false;
  if (die === 1) return true;
  return Math.floor(targetLevel) % die === 0;
}

/**
 * Sonic Buffet and Tornado II. The pages name INT and print no anchors.
 * The stand-in does not grow with TP and does not add a dINT term.
 * Both pacts use the same number. The black magic Tornado II table is not this.
 */
export function windPactHit(level: number): number {
  return level >= 60 ? 200 : 90;
}

export function targetEvasion(base: number, rows: readonly { evaDown?: number }[], extra = 0): number {
  const lunar = rows.reduce((n, row) => n + (row.evaDown ?? 0), 0);
  return Math.max(0, base - lunar - Math.max(0, Math.floor(extra)));
}

/**
 * Apogee first (+50%, floored), then Blood Boon.
 * A boon slot of 0..3 is the Conserve MP sixteenth (8, 10, 12, or 14).
 * Null means Blood Boon did not proc. An astral pact passes null.
 */
export function bloodPactCost(base: number, apogee: boolean, boonSlot: number | null): number {
  let cost = apogee ? apogeeMp(base) : base;
  if (boonSlot == null) return cost;
  const n = 8 + (((boonSlot % 4) + 4) % 4) * 2;
  return Math.floor((cost * n) / 16);
}

/** Multiplier on (weapon damage + fSTR), before pDIF. A miss uses none of it. */
const PHYS_FTP: Record<string, number> = {
  Punch: 1,
  "Rock Throw": 1.1,
  "Barracuda Dive": 1.1,
  Claw: 1,
  "Axe Kick": 1.15,
  "Shock Strike": 1.2,
  Camisado: 1.15,
  Welt: 1,
  Roundhouse: 1.7,
  "Regal Scratch": 1,
  "Poison Nails": 1.35,
  "Moonlit Charge": 1.4,
  "Crescent Fang": 1.6,
  "Rock Buster": 1.7,
  "Burning Strike": 1.8,
  "Tail Whip": 1.7,
  "Double Punch": 2,
  "Megalith Throw": 2.1,
  "Double Slap": 2,
  "Eclipse Bite": 2.4,
  "Flaming Crush": 2.6,
  "Mountain Buster": 2.8,
  "Spinning Dive": 2.7,
  "Predator Claws": 2.8,
  Rush: 2.6,
  "Chaotic Strike": 2.6,
};

const NUKE_NAME: Record<string, ElementalSpell> = {
  "Fire II": "Fire II",
  "Stone II": "Stone II",
  "Water II": "Water II",
  "Aero II": "Aero II",
  "Blizzard II": "Blizzard II",
  "Thunder II": "Thunder II",
  Thunderspark: "Thunder II",
  "Fire IV": "Fire IV",
  "Stone IV": "Stone IV",
  "Water IV": "Water IV",
  "Aero IV": "Aero IV",
  "Blizzard IV": "Blizzard IV",
  "Thunder IV": "Thunder IV",
};

const ASTRAL_NUKE: Record<string, ElementalSpell> = {
  Inferno: "Fire IV",
  "Earthen Fury": "Stone IV",
  "Tidal Wave": "Water IV",
  "Aerial Blast": "Aero IV",
  "Diamond Dust": "Blizzard IV",
  "Judgment Bolt": "Thunder IV",
  "Clarsach Call": "Aero IV",
};

/** Flaming Crush is the only hybrid. Sonic Buffet is wind magic, not a physical hit. */
const HYBRID = new Set(["Flaming Crush"]);

const CURE_OF: Record<string, "ruby" | "ruby2" | "wind" | "spring"> = {
  "Healing Ruby": "ruby",
  "Healing Ruby II": "ruby2",
  "Whispering Wind": "wind",
  "Spring Water": "spring",
};

/** Wards whose pages print a direct hit, not only a status. Nightmare's darkness is the Bio tick. */
const OFFENSIVE_WARD = new Set(["Somnolence"]);

/** A rage, or a ward aimed at the foe. Healing wards do not send the pet in. */
const FOE_WARD = new Set([
  "Somnolence",
  "Lunar Cry",
  "Mewing Lullaby",
  "Nightmare",
  "Lunar Roar",
  "Slowga",
  "Ultimate Terror",
  "Sleepga",
  "Lunatic Voice",
  "Bitter Elegy",
  "Eerie Eye",
]);

export function pactPresses(name: string): boolean {
  const pact = pactByName(name);
  if (!pact || pact.merit) return false;
  return pact.kind === "rage" || FOE_WARD.has(name);
}

/**
 * Skillchain properties on a physical blood pact.
 * Poison Nails is Transfixion only. It can close Compression into Transfixion,
 * and it can open Transfixion. It cannot close a level 2 chain by itself.
 * Moonlit Charge is Compression only. Crescent Fang is Transfixion only.
 * Eclipse Bite tries Gravitation first, then Scission, and opens both.
 * Punch is Liquefaction only. Burning Strike is Impaction only.
 * Double Punch is Compression only. Flaming Crush tries Fusion first, then Reverberation.
 * Rock Throw is Scission only. Rock Buster is Reverberation only.
 * Megalith Throw is Induration only. Mountain Buster tries Gravitation first, then Induration.
 * Barracuda Dive is Reverberation only. Tail Whip is Detonation only.
 * Spinning Dive tries Distortion first, then Detonation.
 * Claw is Detonation only. Predator Claws tries Fragmentation first, then Scission.
 * Axe Kick is Induration only. Double Slap is Scission only.
 * Rush tries Distortion first, then Scission.
 * Shock Strike is Impaction only. Chaotic Strike tries Fragmentation first, then Transfixion.
 * Camisado is Compression only. Regal Scratch is Scission only.
 * Welt is Scission only. Roundhouse is Detonation only.
 * A pure magical pact is not in this map. A ward is not in this map.
 */
const PACT_CHAIN: Record<string, readonly string[]> = {
  "Poison Nails": ["Transfixion"],
  "Moonlit Charge": ["Compression"],
  "Crescent Fang": ["Transfixion"],
  "Eclipse Bite": ["Gravitation", "Scission"],
  Punch: ["Liquefaction"],
  "Burning Strike": ["Impaction"],
  "Double Punch": ["Compression"],
  "Flaming Crush": ["Fusion", "Reverberation"],
  "Rock Throw": ["Scission"],
  "Rock Buster": ["Reverberation"],
  "Megalith Throw": ["Induration"],
  "Mountain Buster": ["Gravitation", "Induration"],
  "Barracuda Dive": ["Reverberation"],
  "Tail Whip": ["Detonation"],
  "Spinning Dive": ["Distortion", "Detonation"],
  Claw: ["Detonation"],
  "Predator Claws": ["Fragmentation", "Scission"],
  "Axe Kick": ["Induration"],
  "Double Slap": ["Scission"],
  Rush: ["Distortion", "Scission"],
  "Shock Strike": ["Impaction"],
  "Chaotic Strike": ["Fragmentation", "Transfixion"],
  Camisado: ["Compression"],
  "Regal Scratch": ["Scission"],
  Welt: ["Scission"],
  Roundhouse: ["Detonation"],
};

/** Element a magical hit can magic burst. A blunt pact with no magic hit is absent. The burst does not close the window. */
const PACT_BURST: Record<string, string> = {
  Meteorite: "light",
  "Searing Light": "light",
  "Howling Moon": "dark",
  "Fire II": "fire",
  "Fire IV": "fire",
  Inferno: "fire",
  "Flaming Crush": "fire",
  "Stone II": "earth",
  "Stone IV": "earth",
  "Earthen Fury": "earth",
  "Water II": "water",
  "Water IV": "water",
  "Tidal Wave": "water",
  "Aero II": "wind",
  "Aero IV": "wind",
  "Aerial Blast": "wind",
  "Blizzard II": "ice",
  "Blizzard IV": "ice",
  "Diamond Dust": "ice",
  "Thunder II": "thunder",
  "Thunder IV": "thunder",
  Thunderspark: "thunder",
  "Judgment Bolt": "thunder",
  "Nether Blast": "dark",
  "Ruinous Omen": "dark",
  Somnolence: "dark",
  "Level ? Holy": "light",
  "Sonic Buffet": "wind",
  "Tornado II": "wind",
  "Clarsach Call": "wind",
};

export function pactSkillchain(name: string): readonly string[] {
  return PACT_CHAIN[name] ?? [];
}

export function pactBurstElement(name: string): string | null {
  return PACT_BURST[name] ?? null;
}

/** Hits that each return the avatar's full delay TP. A miss returns none. */
const PACT_HITS: Record<string, number> = {
  "Double Punch": 2,
  "Double Slap": 2,
  "Eclipse Bite": 3,
  "Flaming Crush": 2,
  "Predator Claws": 3,
  Rush: 5,
  "Chaotic Strike": 3,
  "Regal Scratch": 3,
};

export function pactPhysicalHits(name: string): number {
  if (PACT_HITS[name]) return PACT_HITS[name];
  return (PHYS_FTP[name] ?? 0) > 0 ? 1 : 0;
}

/** Rock Buster prints 30 seconds. A null means the page did not, so Bind's 60 is kept. */
export function pactBindSeconds(name: string): number | null {
  if (name === "Rock Buster") return 30;
  return null;
}

/** Earthen Ward's Stoneskin. 2 × level + 50. At 75 that is 200. */
export function earthenWardSkin(level: number): number {
  return Math.max(0, Math.floor(level) * 2 + 50);
}

/**
 * Magic blood pacts spend the avatar's whole TP bar.
 * Physical, enhancing, and enfeebling pacts do not.
 * Level ? Holy does not. The page does not say that hit uses TP.
 * Sonic Buffet and Tornado II do. The pages do not print anchors, so the hit does not grow.
 * Astral Flow does not, even when the pact is magical.
 */
export function pactSpendsAvatarTp(name: string): boolean {
  const pact = pactByName(name);
  if (!pact || pact.merit || pact.astral) return false;
  if ((PHYS_FTP[name] ?? 0) > 0) return false;
  if (CURE_OF[name]) return true;
  if (name === "Sonic Buffet" || name === "Tornado II") return true;
  return !!NUKE_NAME[name] || name === "Meteorite" || name === "Nether Blast";
}

/**
 * Meteorite's fTP as a multiple of the 0 TP hit.
 * The anchors are 896/256, 1024/256, and 1088/256.
 */
export function meteoriteTpScale(tp: number): number {
  const t = Math.max(0, Math.min(3000, tp));
  const num = t <= 1500 ? 896 + (128 * t) / 1500 : 1024 + (64 * (t - 1500)) / 1500;
  return num / 896;
}

export type PactRider =
  | "poison"
  | "blind"
  | "paralyze"
  | "slow"
  | "bind"
  | "gravity"
  | "stun"
  | "sleepga"
  | "lullaby"
  | "silence"
  | "dispel"
  | "elegy"
  | "lunar"
  | "terror";

/** Additional effect the page names. The potency, when not printed, uses the matching spell. */
const RIDER: Record<string, PactRider> = {
  "Poison Nails": "poison",
  "Moonlit Charge": "blind",
  "Crescent Fang": "paralyze",
  "Rock Throw": "slow",
  "Megalith Throw": "slow",
  "Rock Buster": "bind",
  "Mountain Buster": "bind",
  "Shock Strike": "stun",
  "Chaotic Strike": "stun",
  "Tail Whip": "gravity",
  Thunderspark: "paralyze",
  Somnolence: "gravity",
  Nightmare: "sleepga",
  "Mewing Lullaby": "lullaby",
  Sleepga: "sleepga",
  "Lunatic Voice": "silence",
  "Eerie Eye": "silence",
  "Sonic Buffet": "dispel",
  "Bitter Elegy": "elegy",
  Slowga: "slow",
  "Lunar Roar": "dispel",
  "Lunar Cry": "lunar",
  "Ultimate Terror": "terror",
};

export type PactWard =
  | "haste"
  | "stoneskin"
  | "phalanx"
  | "howl"
  | "thunder"
  | "defense"
  | "glitter"
  | "growl"
  | "blink"
  | "favor"
  | "ice"
  | "shock"
  | "shroud"
  | "raise2"
  | "reraise2"
  | "enaero"
  | "veil"
  | "perfect";

const WARD_KIND: Record<string, PactWard> = {
  Hastega: "haste",
  "Earthen Ward": "stoneskin",
  Noctoshield: "phalanx",
  "Crimson Howl": "howl",
  "Rolling Thunder": "thunder",
  "Shining Ruby": "defense",
  "Glittering Ruby": "glitter",
  "Ecliptic Growl": "growl",
  "Aerial Armor": "blink",
  "Frost Armor": "ice",
  "Lightning Armor": "shock",
  "Altana's Favor": "favor",
  "Raise II": "raise2",
  "Reraise II": "reraise2",
  "Dream Shroud": "shroud",
  "Katabatic Blades": "enaero",
  Chinook: "veil",
  "Perfect Defense": "perfect",
};

export type PactPayoff = {
  /** Before pDIF. 0 when the pact is not a physical hit. */
  physical: number;
  /** Already a whole number. Resist, day, and weather stay 1. */
  magical: number;
  cure: number;
  ward: PactWard | null;
  endsFlow: boolean;
  /** Status the page names besides the hit. Null when the page names none. */
  rider: PactRider | null;
};

/**
 * Printed heal. Healing Ruby is 8 + level × 2. Healing Ruby II is 28 + level × 4.
 * Whispering Wind is floor(level × 2.5 + 16). Spring Water is 47 + level × 3.
 * These are not Cure spells, and Summoning Magic is not in the formula.
 */
export function pactCureAmount(name: string, level: number): number {
  const kind = CURE_OF[name];
  const lv = Math.max(0, level);
  if (kind === "ruby") return 8 + lv * 2;
  if (kind === "ruby2") return 28 + lv * 4;
  if (kind === "wind") return Math.floor(lv * 2.5 + 16);
  if (kind === "spring") return 47 + lv * 3;
  return 0;
}

function nukeDamage(spell: ElementalSpell, dInt: number): number {
  return Math.max(0, elementalD(spell, Math.max(0, dInt)) ?? 0);
}

function darkHit(level: number, dInt: number, scale: number): number {
  const v = level >= 60 ? 200 : 90;
  return Math.max(1, Math.floor((v + Math.max(0, dInt) * 1.5) * scale));
}

function hybridSpell(nuke: string | undefined): ElementalSpell {
  if (nuke === "ice") return "Blizzard II";
  if (nuke === "wind") return "Aero II";
  if (nuke === "earth") return "Stone II";
  if (nuke === "thunder") return "Thunder II";
  if (nuke === "water") return "Water II";
  return "Fire II";
}

/** Shining Ruby's defense cut. Crimson Howl is crimsonHowlAttack. Enthunder and Blink are not attack or evasion. */
export function pactWardPower(ward: PactWard | null): number {
  if (ward === "defense") return SHINING_DEF;
  return 0;
}

/**
 * What a blood pact does before the fight's accuracy and pDIF rolls.
 * A magical pact uses that nuke's D, or 1.5× the tier IV for an elemental astral.
 * Searing Light is Holy × 6. Zantetsuken vanquishes this foe and ends Astral Flow.
 * Meteorite reads the avatar's TP. 0 TP keeps the light hit. The caller spends the bar.
 */
export function pactPayoff(
  name: string,
  level: number,
  summoning: number,
  targetVit: number,
  targetInt: number,
  targetMnd: number,
  avatarTp = 0,
): PactPayoff {
  const empty: PactPayoff = { physical: 0, magical: 0, cure: 0, ward: null, endsFlow: false, rider: null };
  const pact = pactByName(name);
  if (!pact || pact.merit) return empty;
  const id = summonByName(pact.avatar)?.id ?? null;
  const dInt = avatarInt(level, id) - targetInt;
  const dMnd = avatarMnd(level, id) - targetMnd;
  const cure = pactCureAmount(name, level);
  const ward = WARD_KIND[name] ?? null;
  const rider = RIDER[name] ?? null;
  if (pact.kind === "ward") {
    const magical = OFFENSIVE_WARD.has(name) ? Math.max(1, Math.floor(level * 1.6 + Math.max(0, dInt) * 0.5)) : 0;
    return { physical: 0, magical, cure, ward, endsFlow: name === "Perfect Defense", rider };
  }
  const ftp = PHYS_FTP[name] ?? 0;
  const physical = ftp > 0 ? Math.max(1, Math.floor(avatarMeleeBase(level, targetVit, id) * ftp)) : 0;
  if (name === "Zantetsuken") return { physical: 0, magical: 0, cure: 0, ward: null, endsFlow: true, rider };
  if (name === "Searing Light") {
    const holy = Math.max(1, holyDamage(dMnd, 0));
    return { physical: 0, magical: holy * 6, cure: 0, ward: null, endsFlow: false, rider };
  }
  if (name === "Howling Moon") return { physical: 0, magical: darkHit(level, dInt, 1.6), cure: 0, ward: null, endsFlow: false, rider };
  if (name === "Ruinous Omen") return { physical: 0, magical: darkHit(level, dInt, 2.2), cure: 0, ward: null, endsFlow: false, rider };
  if (name === "Nether Blast") return { physical: 0, magical: darkHit(level, dInt, 1), cure: 0, ward: null, endsFlow: false, rider };
  if (name === "Level ? Holy") return { physical: 0, magical: levelHolyDamage(level), cure: 0, ward: null, endsFlow: false, rider };
  if (name === "Sonic Buffet" || name === "Tornado II") {
    return { physical: 0, magical: windPactHit(level), cure: 0, ward: null, endsFlow: false, rider };
  }
  if (name === "Meteorite") {
    const base = Math.max(1, holyDamage(dMnd, 0) * 2);
    const magical = avatarTp > 0 ? Math.max(1, Math.floor(base * meteoriteTpScale(avatarTp))) : base;
    return { physical: 0, magical, cure: 0, ward: null, endsFlow: false, rider };
  }
  const astralSpell = ASTRAL_NUKE[name];
  if (astralSpell) {
    return { physical: 0, magical: Math.max(1, Math.floor(nukeDamage(astralSpell, dInt) * 1.5)), cure: 0, ward: null, endsFlow: false, rider };
  }
  const named = NUKE_NAME[name];
  if (named && ftp <= 0) return { physical: 0, magical: Math.max(1, nukeDamage(named, dInt)), cure: 0, ward: null, endsFlow: false, rider };
  const magical = HYBRID.has(name) ? Math.max(1, Math.floor(nukeDamage(hybridSpell(PACT_SHOW[name]?.nuke), dInt) * 0.45)) : 0;
  return { physical, magical, cure: 0, ward: null, endsFlow: false, rider };
}

/**
 * A spirit's own spell. Tier IV from 60, tier II from 30, otherwise the first nuke.
 * Light uses Holy. Dark uses the Nether Blast line. Resist is not rolled.
 * Pass the spirit id so a printed job's INT and MND replace the stand-in.
 * No id keeps the stand-in, which is what an unjobbed pet still rolls.
 */
export function spiritSpellDamage(
  element: string,
  level: number,
  targetInt: number,
  targetMnd: number,
  id?: string | null,
): { name: string; damage: number } {
  if (element === "light") return { name: "Holy", damage: Math.max(1, holyDamage(avatarMnd(level, id) - targetMnd, 0)) };
  if (element === "dark") return { name: "Nether Blast", damage: darkHit(level, avatarInt(level, id) - targetInt, 1) };
  const stem =
    element === "ice" ? "Blizzard" :
    element === "wind" ? "Aero" :
    element === "earth" ? "Stone" :
    element === "thunder" ? "Thunder" :
    element === "water" ? "Water" :
    "Fire";
  const spell = (level >= 60 ? `${stem} IV` : level >= 30 ? `${stem} II` : stem) as ElementalSpell;
  return { name: spell, damage: Math.max(1, nukeDamage(spell, avatarInt(level, id) - targetInt)) };
}

export function pactBlurb(pact: BloodPact): string {
  if (pact.merit) return "Merit pact. Not unlocked.";
  if (pact.name === "Zantetsuken") return "Vanquishes one normal foe. No skillchain. Not a magic burst. Ends Astral Flow.";
  if (pact.name === "Perfect Defense") return "Damage taken and status resist. The amounts are not printed. No skillchain. Ends Astral Flow.";
  if (pact.name === "Howling Moon") return "Dark area damage. Magic bursts Compression, Gravitation, Darkness, and Umbra. No skillchain.";
  if (pact.name === "Inferno") return "Fire area damage. Magic bursts Liquefaction, Fusion, Light, and Radiance. No skillchain.";
  if (pact.name === "Earthen Fury") return "Earth area damage. Magic bursts Scission, Gravitation, Darkness, and Umbra. No skillchain.";
  if (pact.name === "Tidal Wave") return "Water area damage. Magic bursts Reverberation, Distortion, Darkness, and Umbra. No skillchain.";
  if (pact.name === "Aerial Blast") return "Wind area damage. Magic bursts Detonation, Fragmentation, Light, and Radiance. No skillchain.";
  if (pact.name === "Diamond Dust") return "Ice area damage. Magic bursts Induration, Distortion, Darkness, and Umbra. No skillchain.";
  if (pact.name === "Judgment Bolt") return "Lightning area damage. Magic bursts Impaction, Fragmentation, Light, and Radiance. No skillchain.";
  if (pact.name === "Ruinous Omen") return "Dark area damage by a random percent of HP. That percent is not printed. Magic bursts Compression, Gravitation, Darkness, and Umbra. No skillchain.";
  if (pact.name === "Clarsach Call") return "Wind area damage. Magic bursts Detonation, Fragmentation, Light, and Radiance. No skillchain. The Siren buff amounts are not applied.";
  if (pact.astral) return "Astral Flow only. Spends all your MP. Needs at least your level × 2.";
  if (pact.name === "Spring Water") return "Restores HP and removes Poison, Paralysis, Blindness, Silence, Petrification, Disease, and Plague. Spends the avatar's TP. The cure does not grow.";
  if (pact.name === "Whispering Wind") return "Restores HP. The range varies with TP and is not grown. Spends the avatar's TP. The cure does not grow.";
  if (CURE_OF[pact.name]) return "Restores HP. Spends the avatar's TP. The cure does not grow.";
  if (pact.name === "Fire II" || pact.name === "Fire IV") return "Fire magic. Magic bursts Liquefaction, Fusion, Light, and Radiance. Spends the avatar's TP.";
  if (pact.name === "Stone II" || pact.name === "Stone IV") return "Earth magic. Magic bursts Scission, Gravitation, Darkness, and Umbra. Spends the avatar's TP.";
  if (pact.name === "Water II" || pact.name === "Water IV") return "Water magic. Magic bursts Reverberation, Distortion, Darkness, and Umbra. Spends the avatar's TP.";
  if (pact.name === "Aero II" || pact.name === "Aero IV") return "Wind magic. Magic bursts Detonation, Fragmentation, Light, and Radiance. Spends the avatar's TP.";
  if (pact.name === "Blizzard II" || pact.name === "Blizzard IV") return "Ice magic. Magic bursts Induration, Distortion, Darkness, and Umbra. Spends the avatar's TP.";
  if (pact.name === "Thunder II" || pact.name === "Thunder IV") return "Lightning magic. Magic bursts Impaction, Fragmentation, Light, and Radiance. Spends the avatar's TP.";
  if (pact.name === "Thunderspark") return "Lightning and Paralyze in an area. Magic bursts Impaction, Fragmentation, Light, and Radiance. Spends the avatar's TP.";
  if (pact.name === "Nether Blast") return "Darkness breath on one foe. Magic bursts Compression, Gravitation, Darkness, and Umbra. Spends the avatar's TP. The bar does not change the hit.";
  if (pact.name === "Sonic Buffet") return "Wind magic and Dispel. Magic bursts Detonation, Fragmentation, Light, and Radiance. No skillchain. Spends the avatar's TP.";
  if (pact.name === "Tornado II") return "Wind magic on one foe. Not the black magic spell. Magic bursts Detonation, Fragmentation, Light, and Radiance. Spends the avatar's TP.";
  if (pactSpendsAvatarTp(pact.name)) return "Deals damage. Spends the avatar's TP. Does not feed the foe.";
  if (pact.name === "Moonlit Charge") return "Blunt. Blind. Skillchain: Compression. Does not magic burst.";
  if (pact.name === "Crescent Fang") return "Piercing. Paralyze. Skillchain: Transfixion. Does not magic burst.";
  if (pact.name === "Eclipse Bite") return "Three slashing hits. Gravitation, then Scission. Does not magic burst.";
  if (pact.name === "Punch") return "One blunt hit. Skillchain: Liquefaction. Does not magic burst.";
  if (pact.name === "Burning Strike") return "One blunt hit. Fire. Skillchain: Impaction. Does not magic burst.";
  if (pact.name === "Double Punch") return "Two blunt hits. Skillchain: Compression. Does not magic burst.";
  if (pact.name === "Flaming Crush") return "Two blunt hits and one fire hit. Fusion, then Reverberation. The fire hit magic bursts.";
  if (pact.name === "Crimson Howl") return "Attack up for 1 minute. No skillchain. Does not magic burst.";
  if (pact.name === "Rock Throw") return "One blunt throw. Slow. Skillchain: Scission. Does not magic burst.";
  if (pact.name === "Rock Buster") return "One blunt hit. Bind for 30 seconds. Skillchain: Reverberation. Does not magic burst.";
  if (pact.name === "Megalith Throw") return "One blunt throw. Slow. Skillchain: Induration. Does not magic burst.";
  if (pact.name === "Mountain Buster") return "One blunt hit. Bind. Gravitation, then Induration. Does not magic burst.";
  if (pact.name === "Earthen Ward") return "Stoneskin for 15 minutes. 2 × level + 50. No skillchain.";
  if (pact.name === "Barracuda Dive") return "One slashing hit. Skillchain: Reverberation. Does not magic burst.";
  if (pact.name === "Tail Whip") return "One blunt hit. Weight. Skillchain: Detonation. Does not magic burst.";
  if (pact.name === "Spinning Dive") return "One slashing hit. Distortion, then Detonation. Does not magic burst.";
  if (pact.name === "Slowga") return "Slow in an area. Not Diabolos. No skillchain. Does not magic burst.";
  if (pact.name === "Claw") return "One piercing hit. Skillchain: Detonation. Does not magic burst.";
  if (pact.name === "Predator Claws") return "Three physical hits. Fragmentation, then Scission. Does not magic burst.";
  if (pact.name === "Aerial Armor") return "Blink for 15 minutes. 4 shadows. No skillchain.";
  if (pact.name === "Hastega") return "Haste for 3 minutes. 153/1024. No skillchain. Does not magic burst.";
  if (pact.name === "Axe Kick") return "One blunt hit. Skillchain: Induration. Does not magic burst.";
  if (pact.name === "Double Slap") return "Two blunt hits. Skillchain: Scission. Does not magic burst.";
  if (pact.name === "Rush") return "Five physical hits. Distortion, then Scission. Does not magic burst.";
  if (pact.name === "Frost Armor") return "Ice Spikes for 3 minutes. No skillchain.";
  if (pact.name === "Sleepga") return "Sleep in an area for 90 seconds. Not Diabolos. No skillchain.";
  if (pact.name === "Shock Strike") return "One blunt hit. Stun. Skillchain: Impaction. Does not magic burst.";
  if (pact.name === "Chaotic Strike") return "Three blunt hits. Stun. Fragmentation, then Transfixion. Does not magic burst.";
  if (pact.name === "Rolling Thunder") return "Enthunder for 2 minutes. No skillchain.";
  if (pact.name === "Lightning Armor") return "Shock Spikes for 3 minutes. No skillchain.";
  if (pact.name === "Camisado") return "One blunt hit. Skillchain: Compression. Does not magic burst.";
  if (pact.name === "Somnolence") return "Dark magic and Weight. Magic bursts Compression, Gravitation, Darkness, and Umbra. No skillchain.";
  if (pact.name === "Nightmare") return "Sleep for 90 seconds and Bio for 2 every 3 seconds. The Bio does not wake the sleep. No skillchain.";
  if (pact.name === "Ultimate Terror") return "Attribute down in an area. The amounts are not printed. No skillchain.";
  if (pact.name === "Noctoshield") return "Phalanx for 3 minutes. A flat 13. No skillchain.";
  if (pact.name === "Dream Shroud") return "Magic attack and magic defense for 3 minutes. The hour sets both. No skillchain.";
  if (pact.name === "Regal Scratch") return "Three physical hits. Skillchain: Scission. Does not magic burst.";
  if (pact.name === "Level ? Holy") return "Light area damage. A die of 1 to 6. A connecting hit magic bursts Transfixion, Fusion, Light, and Radiance. No skillchain.";
  if (pact.name === "Altana's Favor") return "Astral Flow. Reraise III. Alive, it has no timer. Dead, Arise is Raise III and the reraise lasts one hour.";
  if (pact.name === "Raise II") return "Raise II on you. A living target is no effect.";
  if (pact.name === "Mewing Lullaby") return "Sleep for 35 seconds in an area, and TP is reset. No skillchain.";
  if (pact.name === "Reraise II") return "Reraise II for one hour. No skillchain.";
  if (pact.name === "Eerie Eye") return "Silence. Amnesia's length is not printed. No skillchain.";
  if (pact.name === "Welt") return "One physical hit. Skillchain: Scission. Does not magic burst.";
  if (pact.name === "Roundhouse") return "One hand-to-hand hit. Skillchain: Detonation. Does not magic burst.";
  if (pact.name === "Lunatic Voice") return "Silence in an area for 90 seconds. No skillchain.";
  if (pact.name === "Katabatic Blades") return "Enaero for 2 minutes. No skillchain.";
  if (pact.name === "Chinook") return "Aquaveil for 15 minutes. One charge at 75. No skillchain.";
  if (pact.name === "Bitter Elegy") return "Elegy for 3 minutes. Attack speed −512/1024. No skillchain.";
  if (pact.name === "Lunar Cry") return "Accuracy and evasion down for 3 minutes. The moon splits a total of 32.";
  if (pact.name === "Lunar Roar") return "Dispels two effects. This foe has none.";
  if (pact.name === "Ecliptic Growl") return "STR/DEX/VIT and AGI/INT/MND/CHR. The moon splits a total of 8.";
  if (pact.kind === "ward") return WARD_KIND[pact.name] ? "Ward on you." : "Strikes the foe.";
  return "Deals damage. Does not feed the foe TP.";
}

export function assertSmn(): void {
  const naked = characterBase("hume", "SMN", 75);
  if (
    naked.hp !== 820 ||
    naked.mp !== 752 ||
    naked.str !== 44 ||
    naked.dex !== 56 ||
    naked.vit !== 44 ||
    naked.agi !== 56 ||
    naked.int !== 65 ||
    naked.mnd !== 61 ||
    naked.chr !== 61
  ) {
    throw new Error(`Hume SMN 75 ${naked.hp}/${naked.mp}/${naked.str}/${naked.dex}/${naked.vit}/${naked.agi}/${naked.int}/${naked.mnd}/${naked.chr}`);
  }
  const sub = characterBase("hume", "WAR", 75, "SMN", 37);
  const war = characterBase("hume", "WAR", 75);
  if (sub.mp <= war.mp) throw new Error("WAR/SMN should gain MP");
  if (smnJobLevel("SMN", null, 0, 75) !== 75 || smnJobLevel("WAR", "SMN", 37, 75) !== 37 || smnJobLevel("WAR", null, 0, 75) !== 0) {
    throw new Error("Summoner level");
  }
  if (maxMpBoost(9, "sub") !== 0 || maxMpBoost(37, "sub") !== 20 || maxMpBoost(50, "sub") !== 20 || maxMpBoost(75, "main") !== 60 || maxMpBoost(50, "main") !== 40) {
    throw new Error("Max MP Boost");
  }
  if (resistSlow(19, "sub") !== 0 || resistSlow(37, "sub") !== 0.1 || resistSlow(40, "sub") !== 0.15 || resistSlow(75, "main") !== 0.2 || resistSlow(75, "sub") !== 0.15) {
    throw new Error("Resist Slow");
  }
  if (smnRefresh(24) !== 0 || smnRefresh(37) !== 1 || smnRefresh(75) !== 1) throw new Error("Auto Refresh");
  if (bloodBoon(75, "sub") !== 0 || bloodBoon(59, "main") !== 0 || bloodBoon(60, "main") !== 0.2 || bloodBoon(75, "main") !== 0.23) {
    throw new Error("Blood Boon");
  }
  if (elementalSiphonMp(269) !== 227 || elementalSiphonMp(0) !== 50) throw new Error("Elemental Siphon");
  if (apogeeMp(10) !== 15 || apogeeMp(0) !== 0 || APOGEE_WARD !== 0.75) throw new Error("Apogee");
  if (perpetuation("carbuncle", 75) !== 9 || perpetuation("cait-sith", 1) !== 1 || perpetuation("carbuncle", 37) !== 5) throw new Error("Carbuncle perpetuation");
  if (perpetuation("fenrir", 75) !== 11 || perpetuation("siren", 37) !== 6) throw new Error("Fenrir perpetuation");
  if (perpetuation("ifrit", 75) !== 13 || perpetuation("diabolos", 1) !== 3 || perpetuation("ifrit", 37) !== 6) throw new Error("avatar perpetuation");
  if (perpetuation("fire-spirit", 75) !== 5 || perpetuation("fire-spirit", 37) !== 2 || perpetuation("odin", 75) !== 0 || perpetuation("atomos", 75) !== 0) throw new Error("spirit perpetuation");
  if (summonByName("Carbuncle")?.mp !== 5 || summonByName("Diabolos")?.mp !== 15 || summonByName("Fire Spirit")?.mp !== 10) throw new Error("initial MP");
  if (summonByName("Alexander")?.astralGate !== true || summonByName("Odin")?.level !== 75 || summonByName("Atomos")?.mp !== ATOMOS_MP || summonByName("Atomos")?.family !== "burst" || summonByName("Atomos")?.astralGate) {
    throw new Error("special summons");
  }
  if (ATOMOS_CAST !== 6 || ALEXANDER_CAST !== 1 || ALEXANDER_RECAST !== 60) throw new Error("special cast");
  if (!summonCostsAllMp("alexander") || !summonCostsAllMp("odin") || summonCostsAllMp("atomos") || summonCostsAllMp("carbuncle")) {
    throw new Error("all MP");
  }
  if (perfectDefenseSeconds(269) !== 43 || perfectDefenseSeconds(0) !== 30 || perfectDefenseSeconds(800) !== 60) {
    throw new Error("Perfect Defense");
  }
  if (smnSkill("Staff", 75) !== 250 || smnSkill("Club", 75) !== 230 || smnSkill("Dagger", 75) !== 200) throw new Error("weapon ranks");
  if (smnSkill("Evasion", 75) !== 200 || smnSkill("Summoning Magic", 75) !== 269 || smnSkill("Sword", 75) !== 0 || smnSkill("Parrying", 75) !== 0) {
    throw new Error("magic and missing ranks");
  }
  if (smnSkill("Summoning Magic", 37) !== 114 || smnSkill("Staff", 37) !== 109) throw new Error("subjob ranks");
  const bar = SMN_ABILITIES.filter((a) => a.level <= 75 && !a.merit).map((a) => a.name);
  if (bar.join(",") !== "Astral Flow,Elemental Siphon,Apogee,Assault,Retreat,Release") throw new Error("ability bar");
  const subAbilities = SMN_ABILITIES.filter((a) => a.access === "sub" && a.level <= 37 && !a.merit).map((a) => a.name);
  if (subAbilities.join(",") !== "Assault,Retreat,Release") throw new Error("subjob abilities");
  if (SMN_PACTS.filter((p) => p.merit).map((p) => p.name).join(",") !== "Meteor Strike,Heavenly Strike,Wind Blade,Geocrush,Thunderstorm,Grand Fall") {
    throw new Error("merit pacts");
  }
  if (SMN_PACTS.some((p) => p.level > 75 && !p.merit)) throw new Error("pact past 75");
  const banned = ["Mana Cede", "Astral Conduit", "Avatar's Favor"];
  if (SMN_ABILITIES.some((a) => banned.includes(a.name)) || SMN_TRAITS.some((t) => t.name.startsWith("Stout") || t.name === "Auto Refresh II")) {
    throw new Error("post-75 in the level-75 kit");
  }
  for (const pact of SMN_PACTS) {
    if (!PACT_SHOW[pact.name]) throw new Error(`no show for ${pact.name}`);
  }
  const carbuncle = summonShowPacts("Carbuncle", 75, true, false).join(",");
  if (carbuncle !== "Poison Nails,Meteorite,Healing Ruby,Shining Ruby,Glittering Ruby,Healing Ruby II") throw new Error(`Carbuncle shows ${carbuncle}`);
  const carbuncleSub = summonShowPacts("Carbuncle", 37, false, false).join(",");
  if (carbuncleSub !== "Poison Nails,Healing Ruby,Shining Ruby") throw new Error(`Carbuncle sub shows ${carbuncleSub}`);
  if (summonShowPacts("Ifrit", 75, true, true).join(",") !== "Inferno") throw new Error("Ifrit astral");
  if (summonShowPacts("Odin", 75, true, true).join(",") !== "Zantetsuken") throw new Error("Odin astral");
  if (summonShowPacts("Alexander", 75, true, true).join(",") !== "Perfect Defense") throw new Error("Alexander astral");
  if (summonShowPacts("Atomos", 75, true, false).length !== 0 || summonShowPacts("Alexander", 75, true, false).length !== 0) throw new Error("no invented pact");
  if (summonShowPacts("Ifrit", 75, true, false).includes("Meteor Strike")) throw new Error("merit pact in the show");
  if (avatarWeaponDamage(75) !== 73 || avatarStr(75) !== 120 || avatarDex(75) !== 96 || avatarMeleeBase(75, 70) !== 86) {
    throw new Error(`avatar swing ${avatarWeaponDamage(75)}/${avatarStr(75)}/${avatarMeleeBase(75, 70)}`);
  }
  if (avatarAttack(75) !== 353 || avatarAccuracy(75) !== 308 || avatarSwingSeconds() !== 4) throw new Error("avatar rating");
  const rubyPet = avatarSheet("carbuncle", 75);
  const ifritPet = avatarSheet("ifrit", 75);
  const fenrirPet = avatarSheet("fenrir", 75);
  const diaPet = avatarSheet("diabolos", 75);
  const whmBlm = characterBase("hume", "WHM", 75, "BLM", 37);
  if (!rubyPet || rubyPet.jobs !== "WHM/BLM" || rubyPet.hp !== whmBlm.hp || rubyPet.mp !== whmBlm.mp || rubyPet.str !== whmBlm.str || rubyPet.int !== whmBlm.int || rubyPet.mnd !== whmBlm.mnd) {
    throw new Error(`carbuncle pool ${rubyPet?.jobs}/${rubyPet?.hp}/${rubyPet?.mp}/${rubyPet?.int}`);
  }
  if (!rubyPet || rubyPet.weapon !== "Club" || rubyPet.melee !== 256 || rubyPet.mdb !== 16 || rubyPet.regen !== 1) {
    throw new Error(`carbuncle combat ${rubyPet?.weapon}/${rubyPet?.melee}/${rubyPet?.mdb}/${rubyPet?.regen}`);
  }
  if (rubyPet.attack !== mainHandAttack(rubyPet.str, 256) || rubyPet.accuracy !== accuracyFrom(rubyPet.dex, 256) || rubyPet.defense !== baseDefense(rubyPet.vit, 75)) {
    throw new Error(`carbuncle ratings ${rubyPet.attack}/${rubyPet.accuracy}/${rubyPet.defense}`);
  }
  if (rubyPet.evasion !== evasionFrom(rubyPet.agi, skillCap("E", 75))) throw new Error("carbuncle evasion");
  const rubyLow = avatarSheet("carbuncle", 24);
  if (!rubyLow || rubyLow.regen !== 0 || rubyLow.mdb !== 10 || avatarSheet("carbuncle", 37)?.hp === rubyPet.hp) throw new Error("carbuncle scales");
  if (!ifritPet || ifritPet.jobs !== "DRK/BLM" || ifritPet.hp !== 1258 || ifritPet.int !== 72 || ifritPet.str !== 75) {
    throw new Error(`ifrit sheet ${ifritPet?.hp}/${ifritPet?.int}/${ifritPet?.str}`);
  }
  if (!ifritPet || ifritPet.weapon !== "Scythe" || ifritPet.melee !== 276 || ifritPet.attack !== 407 || ifritPet.accuracy !== 320) {
    throw new Error(`ifrit combat ${ifritPet?.weapon}/${ifritPet?.melee}/${ifritPet?.attack}/${ifritPet?.accuracy}`);
  }
  if (!ifritPet || ifritPet.defense !== 182 || ifritPet.evasion !== 254 || ifritPet.mdb !== 0 || ifritPet.regen !== 0) {
    throw new Error(`ifrit defense ${ifritPet?.defense}/${ifritPet?.evasion}`);
  }
  if (!fenrirPet || fenrirPet.attack !== Math.floor(ifritPet.attack * 1.3) || fenrirPet.defense !== ifritPet.defense) throw new Error("fenrir attack");
  if (!diaPet || diaPet.defense !== Math.floor(ifritPet.defense * 1.2) || diaPet.defense === Math.floor(ifritPet.defense * 1.3) || diaPet.attack !== ifritPet.attack) {
    throw new Error("diabolos defense");
  }
  if (avatarMeleeBase(75, 70, "ifrit") !== 76 || avatarMeleeBase(75, 70, "carbuncle") === avatarMeleeBase(75, 70)) throw new Error("jobbed fSTR");
  const whmWhm = characterBase("hume", "WHM", 75, "WHM", 37);
  const alex = avatarSheet("alexander", 75);
  const cait = avatarSheet("cait-sith", 75);
  if (!alex || alex.jobs !== "WHM/WHM" || alex.hp !== whmWhm.hp || alex.mp !== whmWhm.mp || alex.str !== whmWhm.str || alex.mnd !== whmWhm.mnd) {
    throw new Error(`alexander ${alex?.jobs}/${alex?.hp}/${alex?.mp}`);
  }
  if (alex.hp === characterBase("hume", "WHM", 75).hp || alex.weapon !== "Club" || alex.melee !== 256 || alex.mdb !== 16 || alex.regen !== 1) {
    throw new Error(`alexander combat ${alex.hp}/${alex.weapon}/${alex.regen}`);
  }
  if (!cait || cait.jobs !== "WHM/BLM" || cait.hp !== rubyPet.hp || cait.int !== rubyPet.int || cait.mdb !== 16 || cait.regen !== 1) {
    throw new Error(`cait ${cait?.jobs}/${cait?.hp}`);
  }
  const blmBlm = characterBase("hume", "BLM", 75, "BLM", 37);
  const fireSpirit = avatarSheet("fire-spirit", 75);
  if (!fireSpirit || fireSpirit.jobs !== "BLM/BLM" || fireSpirit.hp !== blmBlm.hp || fireSpirit.int !== blmBlm.int || fireSpirit.mp !== blmBlm.mp) {
    throw new Error(`fire spirit ${fireSpirit?.jobs}/${fireSpirit?.hp}/${fireSpirit?.int}`);
  }
  if (fireSpirit.weapon !== "Staff" || fireSpirit.melee !== skillCap("B-", 75) || fireSpirit.regen !== 0 || fireSpirit.mdb !== 0) {
    throw new Error(`fire spirit weapon ${fireSpirit.weapon}/${fireSpirit.melee}`);
  }
  for (const spiritId of ["ice-spirit", "air-spirit", "earth-spirit", "thunder-spirit", "water-spirit", "light-spirit", "dark-spirit"] as const) {
    const twin = avatarSheet(spiritId, 75);
    if (!twin || twin.hp !== fireSpirit.hp || twin.jobs !== "BLM/BLM" || twin.weapon !== "Staff" || twin.int !== fireSpirit.int) throw new Error(`${spiritId} sheet`);
  }
  const sirenPet = avatarSheet("siren", 75);
  if (!sirenPet || sirenPet.jobs !== "DRK/BLM" || sirenPet.hp !== ifritPet.hp || sirenPet.weapon !== "Scythe" || sirenPet.attack !== ifritPet.attack) {
    throw new Error(`siren ${sirenPet?.jobs}/${sirenPet?.hp}/${sirenPet?.weapon}`);
  }
  const drkDrk = characterBase("hume", "DRK", 75, "DRK", 37);
  const odinPet = avatarSheet("odin", 75);
  if (!odinPet || odinPet.jobs !== "DRK/DRK" || odinPet.hp !== drkDrk.hp || odinPet.str !== drkDrk.str || odinPet.int !== drkDrk.int) {
    throw new Error(`odin ${odinPet?.jobs}/${odinPet?.hp}/${odinPet?.str}`);
  }
  if (odinPet.weapon !== "Scythe" || odinPet.melee !== 276 || odinPet.attack !== mainHandAttack(odinPet.str, 276) + drkAttackBonus(75, "main") || odinPet.regen !== 0 || odinPet.mdb !== 0) {
    throw new Error(`odin combat ${odinPet.weapon}/${odinPet.attack}`);
  }
  if (odinPet.hp === ifritPet.hp || odinPet.attack === ifritPet.attack) throw new Error("odin is not the DRK/BLM sheet");
  if (avatarSheet("atomos", 75)) throw new Error("atomos job unknown");
  const ruby = pactByName("Healing Ruby");
  const crush = pactByName("Flaming Crush");
  const searing = pactByName("Searing Light");
  if (!ruby || !crush || !searing) throw new Error("pact lookup");
  if (pactMp(ruby, 75) !== 6 || pactMp(crush, 75) !== 164 || pactMp(searing, 75) !== 150 || pactMp(pactByName("Inferno")!, 75) !== 150) {
    throw new Error("pact mp");
  }
  if (bloodPactCost(16, false, 0) !== 8 || bloodPactCost(10, true, null) !== 15 || bloodPactCost(0, true, null) !== 0) throw new Error("pact cost");
  const punch = pactPayoff("Punch", 75, 269, 70, 58, 58);
  const flaming = pactPayoff("Flaming Crush", 75, 269, 70, 58, 58);
  if (punch.physical !== 76 || flaming.physical <= punch.physical || flaming.magical <= 0) throw new Error("physical pact");
  const fire = pactPayoff("Fire II", 75, 269, 70, 58, 58);
  const inferno = pactPayoff("Inferno", 75, 269, 70, 58, 58);
  if (fire.magical <= 0 || inferno.magical <= fire.magical) throw new Error("inferno scale");
  const zantetsu = pactPayoff("Zantetsuken", 75, 269, 70, 58, 58);
  if (!zantetsu.endsFlow || zantetsu.physical !== 0 || zantetsu.magical !== 0 || pactSkillchain("Zantetsuken").length !== 0 || pactBurstElement("Zantetsuken") || pactPhysicalHits("Zantetsuken") !== 0 || pactSpendsAvatarTp("Zantetsuken")) {
    throw new Error("zantetsuken");
  }
  if (pactPayoff("Perfect Defense", 75, 269, 70, 58, 58).ward !== "perfect" || pactPayoff("Perfect Defense", 75, 269, 70, 58, 58).magical !== 0 || !pactPayoff("Perfect Defense", 75, 269, 70, 58, 58).endsFlow || pactSkillchain("Perfect Defense").length !== 0 || pactBurstElement("Perfect Defense") || pactSpendsAvatarTp("Perfect Defense")) {
    throw new Error("perfect defense pact");
  }
  if (PACT_SHOW.Zantetsuken?.nuke || PACT_SHOW.Zantetsuken?.hit || !PACT_SHOW.Zantetsuken?.wide || PACT_SHOW.Deconstruction?.nuke || PACT_SHOW.Chronoshift?.nuke || !PACT_SHOW.Chronoshift?.wide || PACT_SHOW["Perfect Defense"]?.nuke || !PACT_SHOW["Perfect Defense"]?.wide) {
    throw new Error("astral gate show");
  }
  if (pactCureAmount("Healing Ruby", 75) !== 158 || pactCureAmount("Healing Ruby II", 75) !== 328 || pactCureAmount("Whispering Wind", 75) !== 203 || pactCureAmount("Spring Water", 75) !== 272) {
    throw new Error("ruby cure");
  }
  if (pactByName("Sleepga")?.avatar !== "Shiva" || pactByName("Slowga")?.avatar !== "Leviathan" || pactByName("Double Slap")?.avatar !== "Shiva") {
    throw new Error("pact avatar");
  }
  if (pactMp(pactByName("Poison Nails")!, 75) !== 11 || pactMp(pactByName("Aerial Armor")!, 75) !== 92 || pactMp(pactByName("Lunatic Voice")!, 75) !== 37 || pactMp(pactByName("Hastega")!, 75) !== 129) {
    throw new Error("printed pact mp");
  }
  if (crimsonHowlAttack(75) !== 23 || crimsonHowlAttack(99) !== 29 || pactWardPower("howl") !== 0 || pactWardPower("defense") !== 25) {
    throw new Error("howl and ruby");
  }
  if (pactWardSeconds("Crimson Howl") !== 60 || pactWardSeconds("Rolling Thunder") !== 120 || pactWardSeconds("Hastega") !== 180 || pactWardSeconds("Shining Ruby") !== 180 || pactWardSeconds("Aerial Armor") !== 900 || pactWardSeconds("Frost Armor") !== 180 || pactWardSeconds("Lightning Armor") !== 180 || pactWardSeconds("Glittering Ruby") !== 180 || pactWardSeconds("Ecliptic Growl") !== 180 || pactWardSeconds("Lunar Cry") !== 180 || glitteringRuby(75) !== 18) {
    throw new Error("ward seconds");
  }
  if (HASTEGA_NUMER !== 153 || NOCTOSHIELD_CUT !== 13 || SHINING_MDT !== 10 || BLOOD_PACT_CE !== 1 || BLOOD_PACT_VE !== 300) {
    throw new Error("pact constants");
  }
  if (pactSkillchain("Poison Nails").join(",") !== "Transfixion" || pactSkillchain("Meteorite").length !== 0 || pactSkillchain("Searing Light").length !== 0 || pactSkillchain("Healing Ruby").length !== 0) {
    throw new Error("carbuncle skillchain");
  }
  if (pactSkillchain("Moonlit Charge").join(",") !== "Compression" || pactSkillchain("Crescent Fang").join(",") !== "Transfixion" || pactSkillchain("Eclipse Bite").join(",") !== "Gravitation,Scission") {
    throw new Error("fenrir skillchain");
  }
  if (pactSkillchain("Howling Moon").length !== 0 || pactSkillchain("Lunar Cry").length !== 0 || pactSkillchain("Lunar Roar").length !== 0 || pactSkillchain("Ecliptic Growl").length !== 0) {
    throw new Error("fenrir ward skillchain");
  }
  if (pactBurstElement("Meteorite") !== "light" || pactBurstElement("Searing Light") !== "light" || pactBurstElement("Poison Nails") || pactBurstElement("Healing Ruby") || pactBurstElement("Healing Ruby II") || pactBurstElement("Shining Ruby") || pactBurstElement("Glittering Ruby")) {
    throw new Error("carbuncle burst");
  }
  if (pactBurstElement("Howling Moon") !== "dark" || pactBurstElement("Moonlit Charge") || pactBurstElement("Crescent Fang") || pactBurstElement("Eclipse Bite") || pactBurstElement("Lunar Cry") || pactBurstElement("Lunar Roar") || pactBurstElement("Ecliptic Growl")) {
    throw new Error("fenrir burst");
  }
  if (pactSkillchain("Punch").join(",") !== "Liquefaction" || pactSkillchain("Burning Strike").join(",") !== "Impaction" || pactSkillchain("Double Punch").join(",") !== "Compression" || pactSkillchain("Flaming Crush").join(",") !== "Fusion,Reverberation") {
    throw new Error("ifrit skillchain");
  }
  if (pactSkillchain("Fire II").length !== 0 || pactSkillchain("Fire IV").length !== 0 || pactSkillchain("Inferno").length !== 0 || pactSkillchain("Crimson Howl").length !== 0 || pactSkillchain("Meteor Strike").length !== 0) {
    throw new Error("ifrit magic skillchain");
  }
  if (pactBurstElement("Fire II") !== "fire" || pactBurstElement("Fire IV") !== "fire" || pactBurstElement("Inferno") !== "fire" || pactBurstElement("Flaming Crush") !== "fire" || pactBurstElement("Punch") || pactBurstElement("Burning Strike") || pactBurstElement("Double Punch") || pactBurstElement("Crimson Howl")) {
    throw new Error("ifrit burst");
  }
  if (pactPayoff("Burning Strike", 75, 269, 70, 58, 58).magical !== 0 || pactPayoff("Burning Strike", 75, 269, 70, 58, 58).physical <= 0) {
    throw new Error("burning strike is blunt");
  }
  if (pactSkillchain("Rock Throw").join(",") !== "Scission" || pactSkillchain("Rock Buster").join(",") !== "Reverberation" || pactSkillchain("Megalith Throw").join(",") !== "Induration" || pactSkillchain("Mountain Buster").join(",") !== "Gravitation,Induration") {
    throw new Error("titan skillchain");
  }
  if (pactSkillchain("Stone II").length !== 0 || pactSkillchain("Stone IV").length !== 0 || pactSkillchain("Earthen Fury").length !== 0 || pactSkillchain("Earthen Ward").length !== 0 || pactSkillchain("Geocrush").length !== 0) {
    throw new Error("titan magic skillchain");
  }
  if (pactBurstElement("Stone II") !== "earth" || pactBurstElement("Stone IV") !== "earth" || pactBurstElement("Earthen Fury") !== "earth" || pactBurstElement("Rock Throw") || pactBurstElement("Rock Buster") || pactBurstElement("Megalith Throw") || pactBurstElement("Mountain Buster") || pactBurstElement("Earthen Ward")) {
    throw new Error("titan burst");
  }
  if (pactPayoff("Mountain Buster", 75, 269, 70, 58, 58).magical !== 0 || earthenWardSkin(75) !== 200 || earthenWardSkin(46) !== 142 || pactBindSeconds("Rock Buster") !== 30 || pactBindSeconds("Mountain Buster") !== null) {
    throw new Error("titan ward and bind");
  }
  if (pactSkillchain("Barracuda Dive").join(",") !== "Reverberation" || pactSkillchain("Tail Whip").join(",") !== "Detonation" || pactSkillchain("Spinning Dive").join(",") !== "Distortion,Detonation") {
    throw new Error("leviathan skillchain");
  }
  if (pactSkillchain("Water II").length !== 0 || pactSkillchain("Water IV").length !== 0 || pactSkillchain("Tidal Wave").length !== 0 || pactSkillchain("Slowga").length !== 0 || pactSkillchain("Spring Water").length !== 0 || pactSkillchain("Grand Fall").length !== 0) {
    throw new Error("leviathan magic skillchain");
  }
  if (pactBurstElement("Water II") !== "water" || pactBurstElement("Water IV") !== "water" || pactBurstElement("Tidal Wave") !== "water" || pactBurstElement("Barracuda Dive") || pactBurstElement("Tail Whip") || pactBurstElement("Spinning Dive") || pactBurstElement("Slowga") || pactBurstElement("Spring Water")) {
    throw new Error("leviathan burst");
  }
  if (pactPayoff("Spinning Dive", 75, 269, 70, 58, 58).magical !== 0 || pactPayoff("Spinning Dive", 75, 269, 70, 58, 58).physical <= 0 || pactPayoff("Slowga", 75, 269, 70, 58, 58).magical !== 0 || pactPayoff("Barracuda Dive", 75, 269, 70, 58, 58).magical !== 0 || pactPayoff("Tail Whip", 75, 269, 70, 58, 58).magical !== 0) {
    throw new Error("leviathan physical");
  }
  if (PACT_SHOW["Water IV"]?.wide || PACT_SHOW["Spinning Dive"]?.nuke || PACT_SHOW.Slowga?.nuke || PACT_SHOW["Tidal Wave"]?.nuke || PACT_SHOW["Spring Water"]?.cure) {
    throw new Error("leviathan show");
  }
  if (pactSkillchain("Claw").join(",") !== "Detonation" || pactSkillchain("Predator Claws").join(",") !== "Fragmentation,Scission") {
    throw new Error("garuda skillchain");
  }
  if (pactSkillchain("Aero II").length !== 0 || pactSkillchain("Aero IV").length !== 0 || pactSkillchain("Aerial Blast").length !== 0 || pactSkillchain("Aerial Armor").length !== 0 || pactSkillchain("Whispering Wind").length !== 0 || pactSkillchain("Hastega").length !== 0 || pactSkillchain("Wind Blade").length !== 0) {
    throw new Error("garuda magic skillchain");
  }
  if (pactBurstElement("Aero II") !== "wind" || pactBurstElement("Aero IV") !== "wind" || pactBurstElement("Aerial Blast") !== "wind" || pactBurstElement("Claw") || pactBurstElement("Predator Claws") || pactBurstElement("Aerial Armor") || pactBurstElement("Whispering Wind") || pactBurstElement("Hastega")) {
    throw new Error("garuda burst");
  }
  if (pactPayoff("Claw", 75, 269, 70, 58, 58).magical !== 0 || pactPayoff("Predator Claws", 75, 269, 70, 58, 58).magical !== 0 || pactPayoff("Predator Claws", 75, 269, 70, 58, 58).physical <= 0 || pactPayoff("Aerial Armor", 75, 269, 70, 58, 58).magical !== 0 || AERIAL_SHADOWS !== 4) {
    throw new Error("garuda physical");
  }
  if (PACT_SHOW["Aero IV"]?.wide || PACT_SHOW["Aerial Blast"]?.nuke || PACT_SHOW["Aerial Armor"]?.nuke || PACT_SHOW.Hastega?.nuke || PACT_SHOW["Whispering Wind"]?.cure) {
    throw new Error("garuda show");
  }
  if (pactSkillchain("Axe Kick").join(",") !== "Induration" || pactSkillchain("Double Slap").join(",") !== "Scission" || pactSkillchain("Rush").join(",") !== "Distortion,Scission") {
    throw new Error("shiva skillchain");
  }
  if (pactSkillchain("Blizzard II").length !== 0 || pactSkillchain("Blizzard IV").length !== 0 || pactSkillchain("Diamond Dust").length !== 0 || pactSkillchain("Frost Armor").length !== 0 || pactSkillchain("Sleepga").length !== 0 || pactSkillchain("Heavenly Strike").length !== 0) {
    throw new Error("shiva magic skillchain");
  }
  if (pactBurstElement("Blizzard II") !== "ice" || pactBurstElement("Blizzard IV") !== "ice" || pactBurstElement("Diamond Dust") !== "ice" || pactBurstElement("Axe Kick") || pactBurstElement("Double Slap") || pactBurstElement("Rush") || pactBurstElement("Frost Armor") || pactBurstElement("Sleepga")) {
    throw new Error("shiva burst");
  }
  if (pactPayoff("Axe Kick", 75, 269, 70, 58, 58).magical !== 0 || pactPayoff("Rush", 75, 269, 70, 58, 58).magical !== 0 || pactPayoff("Rush", 75, 269, 70, 58, 58).physical <= 0 || pactPayoff("Sleepga", 75, 269, 70, 58, 58).magical !== 0 || pactPayoff("Frost Armor", 75, 269, 70, 58, 58).magical !== 0 || SLEEPGA_PACT_SECONDS !== 90 || pactMp(pactByName("Sleepga")!, 75) !== 54) {
    throw new Error("shiva physical");
  }
  if (PACT_SHOW["Blizzard IV"]?.wide || PACT_SHOW["Diamond Dust"]?.nuke || PACT_SHOW["Frost Armor"]?.nuke || PACT_SHOW.Sleepga?.nuke || PACT_SHOW.Rush?.nuke) {
    throw new Error("shiva show");
  }
  if (pactSkillchain("Shock Strike").join(",") !== "Impaction" || pactSkillchain("Chaotic Strike").join(",") !== "Fragmentation,Transfixion") {
    throw new Error("ramuh skillchain");
  }
  if (pactSkillchain("Thunder II").length !== 0 || pactSkillchain("Thunder IV").length !== 0 || pactSkillchain("Thunderspark").length !== 0 || pactSkillchain("Judgment Bolt").length !== 0 || pactSkillchain("Rolling Thunder").length !== 0 || pactSkillchain("Lightning Armor").length !== 0 || pactSkillchain("Thunderstorm").length !== 0) {
    throw new Error("ramuh magic skillchain");
  }
  if (pactBurstElement("Thunder II") !== "thunder" || pactBurstElement("Thunder IV") !== "thunder" || pactBurstElement("Thunderspark") !== "thunder" || pactBurstElement("Judgment Bolt") !== "thunder" || pactBurstElement("Shock Strike") || pactBurstElement("Chaotic Strike") || pactBurstElement("Rolling Thunder") || pactBurstElement("Lightning Armor")) {
    throw new Error("ramuh burst");
  }
  if (pactPayoff("Shock Strike", 75, 269, 70, 58, 58).magical !== 0 || pactPayoff("Chaotic Strike", 75, 269, 70, 58, 58).magical !== 0 || pactPayoff("Chaotic Strike", 75, 269, 70, 58, 58).physical <= 0 || pactPayoff("Rolling Thunder", 75, 269, 70, 58, 58).magical !== 0 || pactPayoff("Lightning Armor", 75, 269, 70, 58, 58).magical !== 0) {
    throw new Error("ramuh physical");
  }
  if (PACT_SHOW["Thunder IV"]?.wide || !PACT_SHOW.Thunderspark?.wide || PACT_SHOW["Judgment Bolt"]?.nuke || PACT_SHOW["Shock Strike"]?.nuke || PACT_SHOW["Chaotic Strike"]?.nuke || PACT_SHOW["Rolling Thunder"]?.nuke || PACT_SHOW["Lightning Armor"]?.nuke) {
    throw new Error("ramuh show");
  }
  if (pactSkillchain("Camisado").join(",") !== "Compression") throw new Error("diabolos skillchain");
  if (pactSkillchain("Nether Blast").length !== 0 || pactSkillchain("Ruinous Omen").length !== 0 || pactSkillchain("Somnolence").length !== 0 || pactSkillchain("Nightmare").length !== 0 || pactSkillchain("Ultimate Terror").length !== 0 || pactSkillchain("Noctoshield").length !== 0 || pactSkillchain("Dream Shroud").length !== 0) {
    throw new Error("diabolos magic skillchain");
  }
  if (pactBurstElement("Nether Blast") !== "dark" || pactBurstElement("Ruinous Omen") !== "dark" || pactBurstElement("Somnolence") !== "dark" || pactBurstElement("Camisado") || pactBurstElement("Nightmare") || pactBurstElement("Ultimate Terror") || pactBurstElement("Noctoshield") || pactBurstElement("Dream Shroud")) {
    throw new Error("diabolos burst");
  }
  if (pactPayoff("Camisado", 75, 269, 70, 58, 58).magical !== 0 || pactPayoff("Camisado", 75, 269, 70, 58, 58).physical <= 0 || pactPayoff("Nightmare", 75, 269, 70, 58, 58).magical !== 0 || pactPayoff("Somnolence", 75, 269, 70, 58, 58).magical <= 0 || pactPayoff("Nether Blast", 75, 269, 70, 58, 58).physical !== 0 || pactPayoff("Ultimate Terror", 75, 269, 70, 58, 58).magical !== 0 || pactPayoff("Dream Shroud", 75, 269, 70, 58, 58).ward !== "shroud") {
    throw new Error("diabolos physical");
  }
  if (PACT_SHOW["Nether Blast"]?.wide || PACT_SHOW["Nether Blast"]?.nuke || PACT_SHOW["Ruinous Omen"]?.nuke || !PACT_SHOW["Ruinous Omen"]?.wide || PACT_SHOW.Somnolence?.nuke || PACT_SHOW.Nightmare?.nuke || !PACT_SHOW.Nightmare?.wide || PACT_SHOW["Ultimate Terror"]?.nuke || PACT_SHOW.Noctoshield?.nuke || PACT_SHOW["Dream Shroud"]?.nuke || PACT_SHOW.Camisado?.nuke) {
    throw new Error("diabolos show");
  }
  if (NIGHTMARE_SECONDS !== 90 || NIGHTMARE_BIO !== 2 || pactWardSeconds("Dream Shroud") !== 180 || pactWardSeconds("Noctoshield") !== 180 || pactMp(pactByName("Dream Shroud")!, 75) !== 121 || pactMp(pactByName("Nightmare")!, 75) !== 42) {
    throw new Error("diabolos ward");
  }
  const midnight = dreamShroudCut(0);
  const noon = dreamShroudCut(12);
  const dusk = dreamShroudCut(18);
  const late = dreamShroudCut(23);
  if (midnight.mab !== 13 || midnight.mdb !== 1 || noon.mab !== 1 || noon.mdb !== 13 || dusk.mab !== 7 || dusk.mdb !== 7 || late.mab !== 12 || late.mdb !== 2) {
    throw new Error("dream shroud hour");
  }
  if (!summonShowPacts("Diabolos", 75, true, false).includes("Dream Shroud") || summonShowPacts("Diabolos", 37, false, false).includes("Dream Shroud") || summonShowPacts("Diabolos", 37, false, false).includes("Noctoshield") || !summonShowPacts("Diabolos", 37, false, false).includes("Ultimate Terror")) {
    throw new Error("diabolos access");
  }
  if (pactSkillchain("Regal Scratch").join(",") !== "Scission") throw new Error("cait skillchain");
  if (pactSkillchain("Level ? Holy").length !== 0 || pactSkillchain("Altana's Favor").length !== 0 || pactSkillchain("Mewing Lullaby").length !== 0 || pactSkillchain("Raise II").length !== 0 || pactSkillchain("Reraise II").length !== 0 || pactSkillchain("Eerie Eye").length !== 0) {
    throw new Error("cait magic skillchain");
  }
  if (pactBurstElement("Level ? Holy") !== "light" || pactBurstElement("Regal Scratch") || pactBurstElement("Altana's Favor") || pactBurstElement("Mewing Lullaby") || pactBurstElement("Raise II") || pactBurstElement("Reraise II") || pactBurstElement("Eerie Eye")) {
    throw new Error("cait burst");
  }
  if (pactPayoff("Regal Scratch", 75, 269, 70, 58, 58).magical !== 0 || pactPayoff("Regal Scratch", 75, 269, 70, 58, 58).physical <= 0 || pactPayoff("Mewing Lullaby", 75, 269, 70, 58, 58).magical !== 0 || pactPayoff("Eerie Eye", 75, 269, 70, 58, 58).magical !== 0 || pactPayoff("Raise II", 75, 269, 70, 58, 58).ward !== "raise2" || pactPayoff("Reraise II", 75, 269, 70, 58, 58).ward !== "reraise2" || pactPayoff("Altana's Favor", 75, 269, 70, 58, 58).ward !== "favor") {
    throw new Error("cait physical");
  }
  const holyLow = pactPayoff("Level ? Holy", 59, 114, 70, 1, 58);
  const holyHigh = pactPayoff("Level ? Holy", 75, 269, 70, 1, 58);
  const holyInt = pactPayoff("Level ? Holy", 75, 269, 70, 400, 58);
  if (holyLow.magical !== 90 || holyHigh.magical !== 200 || holyInt.magical !== holyHigh.magical || holyHigh.physical !== 0 || levelHolyDamage(60) !== 200 || levelHolyDamage(0) !== 90) {
    throw new Error("level holy damage");
  }
  if (!levelHolyHits(75, 1) || !levelHolyHits(75, 3) || !levelHolyHits(75, 5) || levelHolyHits(75, 2) || levelHolyHits(75, 4) || levelHolyHits(75, 6) || levelHolyHits(75, 0) || levelHolyHits(75, 7)) {
    throw new Error("level holy 75");
  }
  for (const face of [1, 2, 3, 4, 5, 6]) {
    if (!levelHolyHits(60, face) || !levelHolyHits(120, face)) throw new Error(`level holy divides ${face}`);
  }
  if (PACT_SHOW["Regal Scratch"]?.nuke || PACT_SHOW["Regal Scratch"]?.hit || PACT_SHOW["Altana's Favor"]?.nuke || PACT_SHOW["Mewing Lullaby"]?.nuke || !PACT_SHOW["Mewing Lullaby"]?.wide || PACT_SHOW["Level ? Holy"]?.nuke || !PACT_SHOW["Level ? Holy"]?.wide || PACT_SHOW["Eerie Eye"]?.nuke || PACT_SHOW["Raise II"]?.nuke || PACT_SHOW["Reraise II"]?.nuke) {
    throw new Error("cait show");
  }
  if (MEWING_SECONDS !== 35 || pactWardSeconds("Reraise II") !== 3600 || pactMp(pactByName("Regal Scratch")!, 75) !== 5 || pactMp(pactByName("Mewing Lullaby")!, 75) !== 61 || pactMp(pactByName("Raise II")!, 75) !== 160 || pactMp(pactByName("Reraise II")!, 75) !== 80 || pactMp(pactByName("Eerie Eye")!, 75) !== 134 || pactMp(pactByName("Level ? Holy")!, 75) !== 235) {
    throw new Error("cait ward");
  }
  if (SMN_PACTS.some((pact) => pact.name === "Regal Gash")) throw new Error("regal gash");
  const caitOrder = orderedPacts(SMN_PACTS.filter((pact) => pact.avatar === "Cait Sith")).map((pact) => pact.name).join(",");
  if (caitOrder !== "Regal Scratch,Altana's Favor,Raise II,Mewing Lullaby,Reraise II,Eerie Eye,Level ? Holy") {
    throw new Error(`cait order ${caitOrder}`);
  }
  const caitSub = summonShowPacts("Cait Sith", 37, false, false);
  if (caitSub.includes("Eerie Eye") || caitSub.includes("Level ? Holy") || caitSub.includes("Altana's Favor") || !caitSub.includes("Raise II") || !caitSub.includes("Reraise II") || !caitSub.includes("Mewing Lullaby") || !caitSub.includes("Regal Scratch")) {
    throw new Error(`cait sub ${caitSub.join(",")}`);
  }
  if (summonShowPacts("Cait Sith", 75, true, true).join(",") !== "Altana's Favor" || !summonShowPacts("Cait Sith", 75, true, false).includes("Eerie Eye") || !summonShowPacts("Cait Sith", 75, true, false).includes("Level ? Holy") || summonShowPacts("Cait Sith", 75, false, false).includes("Eerie Eye") || summonShowPacts("Cait Sith", 54, true, false).includes("Eerie Eye")) {
    throw new Error("cait access");
  }
  if (pactSkillchain("Welt").join(",") !== "Scission" || pactSkillchain("Roundhouse").join(",") !== "Detonation") throw new Error("siren skillchain");
  if (pactSkillchain("Sonic Buffet").length !== 0 || pactSkillchain("Tornado II").length !== 0 || pactSkillchain("Clarsach Call").length !== 0 || pactSkillchain("Lunatic Voice").length !== 0 || pactSkillchain("Katabatic Blades").length !== 0 || pactSkillchain("Chinook").length !== 0 || pactSkillchain("Bitter Elegy").length !== 0) {
    throw new Error("siren magic skillchain");
  }
  if (pactBurstElement("Sonic Buffet") !== "wind" || pactBurstElement("Tornado II") !== "wind" || pactBurstElement("Clarsach Call") !== "wind" || pactBurstElement("Welt") || pactBurstElement("Roundhouse") || pactBurstElement("Lunatic Voice") || pactBurstElement("Katabatic Blades") || pactBurstElement("Chinook") || pactBurstElement("Bitter Elegy")) {
    throw new Error("siren burst");
  }
  const buffet = pactPayoff("Sonic Buffet", 75, 269, 70, 1, 58);
  const buffetInt = pactPayoff("Sonic Buffet", 75, 269, 70, 400, 58);
  const tornadoPact = pactPayoff("Tornado II", 75, 269, 70, 400, 58);
  const buffetLow = pactPayoff("Sonic Buffet", 59, 114, 70, 1, 58);
  if (buffet.physical !== 0 || buffet.magical !== 200 || buffet.rider !== "dispel" || buffetInt.magical !== buffet.magical || tornadoPact.magical !== buffet.magical || tornadoPact.physical !== 0 || tornadoPact.rider != null || buffetLow.magical !== 90 || windPactHit(60) !== 200 || windPactHit(0) !== 90) {
    throw new Error("siren wind");
  }
  if (pactPayoff("Welt", 75, 269, 70, 58, 58).magical !== 0 || pactPayoff("Welt", 75, 269, 70, 58, 58).physical <= 0 || pactPayoff("Roundhouse", 75, 269, 70, 58, 58).magical !== 0 || pactPayoff("Roundhouse", 75, 269, 70, 58, 58).physical <= pactPayoff("Welt", 75, 269, 70, 58, 58).physical) {
    throw new Error("siren physical");
  }
  if (pactPayoff("Lunatic Voice", 75, 269, 70, 58, 58).magical !== 0 || pactPayoff("Lunatic Voice", 75, 269, 70, 58, 58).rider !== "silence" || pactPayoff("Katabatic Blades", 75, 269, 70, 58, 58).ward !== "enaero" || pactPayoff("Katabatic Blades", 75, 269, 70, 58, 58).magical !== 0 || pactPayoff("Chinook", 75, 269, 70, 58, 58).ward !== "veil" || pactPayoff("Bitter Elegy", 75, 269, 70, 58, 58).rider !== "elegy" || pactPayoff("Bitter Elegy", 75, 269, 70, 58, 58).magical !== 0 || pactPayoff("Clarsach Call", 75, 269, 70, 58, 58).physical !== 0 || pactPayoff("Clarsach Call", 75, 269, 70, 58, 58).magical <= pactPayoff("Aero IV", 75, 269, 70, 58, 58).magical) {
    throw new Error("siren wards");
  }
  if (PACT_SHOW["Clarsach Call"]?.nuke || !PACT_SHOW["Clarsach Call"]?.wide || PACT_SHOW.Welt?.hit || PACT_SHOW.Welt?.nuke || PACT_SHOW.Roundhouse?.hit || PACT_SHOW["Sonic Buffet"]?.nuke || PACT_SHOW["Sonic Buffet"]?.wide || PACT_SHOW["Sonic Buffet"]?.hit || PACT_SHOW["Tornado II"]?.nuke || PACT_SHOW["Tornado II"]?.wide || PACT_SHOW["Lunatic Voice"]?.nuke || !PACT_SHOW["Lunatic Voice"]?.wide || PACT_SHOW["Katabatic Blades"]?.nuke || PACT_SHOW.Chinook?.nuke || PACT_SHOW["Bitter Elegy"]?.nuke || PACT_SHOW["Bitter Elegy"]?.wide) {
    throw new Error("siren show");
  }
  if (LUNATIC_SECONDS !== 90 || BITTER_ELEGY !== 512 || pactWardSeconds("Lunatic Voice") !== 90 || pactWardSeconds("Katabatic Blades") !== 120 || pactWardSeconds("Chinook") !== 900 || pactWardSeconds("Bitter Elegy") !== 180 || aquaveilCharges(269) !== 1 || enspellTwoBase(269) !== 36) {
    throw new Error("siren constants");
  }
  if (pactMp(pactByName("Welt")!, 75) !== 9 || pactMp(pactByName("Roundhouse")!, 75) !== 52 || pactMp(pactByName("Sonic Buffet")!, 75) !== 164 || pactMp(pactByName("Tornado II")!, 75) !== 182 || pactMp(pactByName("Katabatic Blades")!, 75) !== 52 || pactMp(pactByName("Chinook")!, 75) !== 118 || pactMp(pactByName("Bitter Elegy")!, 75) !== 96 || pactMp(pactByName("Clarsach Call")!, 75) !== 150) {
    throw new Error("siren mp");
  }
  if (pactPhysicalHits("Welt") !== 1 || pactPhysicalHits("Roundhouse") !== 1 || pactPhysicalHits("Sonic Buffet") !== 0 || pactPhysicalHits("Tornado II") !== 0 || pactPhysicalHits("Clarsach Call") !== 0) {
    throw new Error("siren hits");
  }
  if (SMN_PACTS.some((pact) => pact.name === "Hysteric Assault" || pact.name === "Wind's Blessing")) throw new Error("siren post-75");
  const sirenOrder = orderedPacts(SMN_PACTS.filter((pact) => pact.avatar === "Siren")).map((pact) => pact.name).join(",");
  if (sirenOrder !== "Welt,Clarsach Call,Lunatic Voice,Roundhouse,Katabatic Blades,Chinook,Bitter Elegy,Sonic Buffet,Tornado II") {
    throw new Error(`siren order ${sirenOrder}`);
  }
  const sirenSub = summonShowPacts("Siren", 37, false, false);
  if (sirenSub.includes("Chinook") || sirenSub.includes("Bitter Elegy") || sirenSub.includes("Sonic Buffet") || sirenSub.includes("Tornado II") || sirenSub.includes("Clarsach Call") || !sirenSub.includes("Welt") || !sirenSub.includes("Lunatic Voice") || !sirenSub.includes("Roundhouse") || !sirenSub.includes("Katabatic Blades")) {
    throw new Error(`siren sub ${sirenSub.join(",")}`);
  }
  if (summonShowPacts("Siren", 75, true, true).join(",") !== "Clarsach Call" || !summonShowPacts("Siren", 75, true, false).includes("Bitter Elegy") || !summonShowPacts("Siren", 75, true, false).includes("Tornado II") || summonShowPacts("Siren", 75, false, false).includes("Bitter Elegy") || summonShowPacts("Siren", 41, true, false).includes("Chinook") || !summonShowPacts("Siren", 42, false, false).includes("Chinook")) {
    throw new Error("siren access");
  }
  if (pactBlurb(pactByName("Sonic Buffet")!).startsWith("Deals damage") || pactBlurb(pactByName("Clarsach Call")!).startsWith("Astral Flow only. Spends") || pactBlurb(pactByName("Welt")!) !== "One physical hit. Skillchain: Scission. Does not magic burst.") {
    throw new Error("siren blurb");
  }
  const newMoon = lunarCryCut(0);
  const fullMoon = lunarCryCut(6);
  const gibbous = lunarCryCut(8);
  if (newMoon.acc !== 1 || newMoon.eva !== 31 || fullMoon.acc !== 31 || fullMoon.eva !== 1 || gibbous.acc !== 21 || gibbous.eva !== 11 || newMoon.acc + newMoon.eva !== 32) {
    throw new Error("lunar cry moon");
  }
  const growlNew = eclipticGrowlCut(0);
  const growlFull = eclipticGrowlCut(6);
  const growlGibbous = eclipticGrowlCut(8);
  if (growlNew.body !== 1 || growlNew.mind !== 7 || growlFull.body !== 7 || growlFull.mind !== 1 || growlGibbous.body !== 5 || growlGibbous.mind !== 3 || growlNew.body + growlNew.mind !== 8) {
    throw new Error("ecliptic growl moon");
  }
  if (targetEvasion(100, [{ evaDown: 11 }], 5) !== 84) throw new Error("lunar evasion");
  if (pactPayoff("Sleepga", 75, 269, 70, 58, 58).rider !== "sleepga" || pactPayoff("Poison Nails", 75, 269, 70, 58, 58).rider !== "poison") {
    throw new Error("pact rider");
  }
  if (tpPerHit(AVATAR_DELAY) !== 75) throw new Error("avatar delay TP");
  if (pactPhysicalHits("Double Punch") !== 2 || pactPhysicalHits("Double Slap") !== 2 || pactPhysicalHits("Poison Nails") !== 1 || pactPhysicalHits("Meteorite") !== 0 || pactPhysicalHits("Zantetsuken") !== 0 || pactPhysicalHits("Eclipse Bite") !== 3 || pactPhysicalHits("Moonlit Charge") !== 1 || pactPhysicalHits("Crescent Fang") !== 1 || pactPhysicalHits("Howling Moon") !== 0 || pactPhysicalHits("Flaming Crush") !== 2 || pactPhysicalHits("Punch") !== 1 || pactPhysicalHits("Burning Strike") !== 1 || pactPhysicalHits("Fire II") !== 0 || pactPhysicalHits("Inferno") !== 0 || pactPhysicalHits("Rock Throw") !== 1 || pactPhysicalHits("Rock Buster") !== 1 || pactPhysicalHits("Megalith Throw") !== 1 || pactPhysicalHits("Mountain Buster") !== 1 || pactPhysicalHits("Stone II") !== 0 || pactPhysicalHits("Earthen Fury") !== 0 || pactPhysicalHits("Barracuda Dive") !== 1 || pactPhysicalHits("Tail Whip") !== 1 || pactPhysicalHits("Spinning Dive") !== 1 || pactPhysicalHits("Water II") !== 0 || pactPhysicalHits("Tidal Wave") !== 0 || pactPhysicalHits("Claw") !== 1 || pactPhysicalHits("Predator Claws") !== 3 || pactPhysicalHits("Aero II") !== 0 || pactPhysicalHits("Aerial Blast") !== 0 || pactPhysicalHits("Axe Kick") !== 1 || pactPhysicalHits("Rush") !== 5 || pactPhysicalHits("Blizzard II") !== 0 || pactPhysicalHits("Diamond Dust") !== 0 || pactPhysicalHits("Shock Strike") !== 1 || pactPhysicalHits("Chaotic Strike") !== 3 || pactPhysicalHits("Thunder II") !== 0 || pactPhysicalHits("Judgment Bolt") !== 0 || pactPhysicalHits("Thunderspark") !== 0 || pactPhysicalHits("Camisado") !== 1 || pactPhysicalHits("Nether Blast") !== 0 || pactPhysicalHits("Ruinous Omen") !== 0 || pactPhysicalHits("Regal Scratch") !== 3 || pactPhysicalHits("Level ? Holy") !== 0) {
    throw new Error("pact hits");
  }
  if (
    !pactSpendsAvatarTp("Meteorite") ||
    !pactSpendsAvatarTp("Fire IV") ||
    !pactSpendsAvatarTp("Thunderspark") ||
    !pactSpendsAvatarTp("Nether Blast") ||
    !pactSpendsAvatarTp("Healing Ruby") ||
    !pactSpendsAvatarTp("Healing Ruby II") ||
    !pactSpendsAvatarTp("Whispering Wind") ||
    !pactSpendsAvatarTp("Spring Water") ||
    !pactSpendsAvatarTp("Water II") ||
    !pactSpendsAvatarTp("Water IV") ||
    !pactSpendsAvatarTp("Aero II") ||
    !pactSpendsAvatarTp("Aero IV") ||
    !pactSpendsAvatarTp("Blizzard II") ||
    !pactSpendsAvatarTp("Blizzard IV") ||
    !pactSpendsAvatarTp("Thunder II") ||
    !pactSpendsAvatarTp("Thunder IV") ||
    !pactSpendsAvatarTp("Sonic Buffet") ||
    !pactSpendsAvatarTp("Tornado II")
  ) {
    throw new Error("pact spends");
  }
  if (
    pactSpendsAvatarTp("Poison Nails") ||
    pactSpendsAvatarTp("Shining Ruby") ||
    pactSpendsAvatarTp("Glittering Ruby") ||
    pactSpendsAvatarTp("Searing Light") ||
    pactSpendsAvatarTp("Inferno") ||
    pactSpendsAvatarTp("Nightmare") ||
    pactSpendsAvatarTp("Somnolence") ||
    pactSpendsAvatarTp("Sleepga") ||
    pactSpendsAvatarTp("Double Punch") ||
    pactSpendsAvatarTp("Flaming Crush") ||
    pactSpendsAvatarTp("Zantetsuken") ||
    pactSpendsAvatarTp("Moonlit Charge") ||
    pactSpendsAvatarTp("Crescent Fang") ||
    pactSpendsAvatarTp("Eclipse Bite") ||
    pactSpendsAvatarTp("Howling Moon") ||
    pactSpendsAvatarTp("Lunar Cry") ||
    pactSpendsAvatarTp("Punch") ||
    pactSpendsAvatarTp("Burning Strike") ||
    pactSpendsAvatarTp("Crimson Howl") ||
    pactSpendsAvatarTp("Rock Throw") ||
    pactSpendsAvatarTp("Rock Buster") ||
    pactSpendsAvatarTp("Megalith Throw") ||
    pactSpendsAvatarTp("Mountain Buster") ||
    pactSpendsAvatarTp("Earthen Fury") ||
    pactSpendsAvatarTp("Earthen Ward") ||
    pactSpendsAvatarTp("Barracuda Dive") ||
    pactSpendsAvatarTp("Tail Whip") ||
    pactSpendsAvatarTp("Spinning Dive") ||
    pactSpendsAvatarTp("Slowga") ||
    pactSpendsAvatarTp("Tidal Wave") ||
    pactSpendsAvatarTp("Claw") ||
    pactSpendsAvatarTp("Predator Claws") ||
    pactSpendsAvatarTp("Aerial Blast") ||
    pactSpendsAvatarTp("Aerial Armor") ||
    pactSpendsAvatarTp("Hastega") ||
    pactSpendsAvatarTp("Axe Kick") ||
    pactSpendsAvatarTp("Double Slap") ||
    pactSpendsAvatarTp("Rush") ||
    pactSpendsAvatarTp("Diamond Dust") ||
    pactSpendsAvatarTp("Frost Armor") ||
    pactSpendsAvatarTp("Shock Strike") ||
    pactSpendsAvatarTp("Chaotic Strike") ||
    pactSpendsAvatarTp("Judgment Bolt") ||
    pactSpendsAvatarTp("Rolling Thunder") ||
    pactSpendsAvatarTp("Lightning Armor") ||
    pactSpendsAvatarTp("Camisado") ||
    pactSpendsAvatarTp("Ruinous Omen") ||
    pactSpendsAvatarTp("Ultimate Terror") ||
    pactSpendsAvatarTp("Noctoshield") ||
    pactSpendsAvatarTp("Dream Shroud") ||
    pactSpendsAvatarTp("Regal Scratch") ||
    pactSpendsAvatarTp("Level ? Holy") ||
    pactSpendsAvatarTp("Altana's Favor") ||
    pactSpendsAvatarTp("Mewing Lullaby") ||
    pactSpendsAvatarTp("Raise II") ||
    pactSpendsAvatarTp("Reraise II") ||
    pactSpendsAvatarTp("Eerie Eye") ||
    pactSpendsAvatarTp("Welt") ||
    pactSpendsAvatarTp("Roundhouse") ||
    pactSpendsAvatarTp("Clarsach Call") ||
    pactSpendsAvatarTp("Lunatic Voice") ||
    pactSpendsAvatarTp("Katabatic Blades") ||
    pactSpendsAvatarTp("Chinook") ||
    pactSpendsAvatarTp("Bitter Elegy")
  ) {
    throw new Error("pact keeps TP");
  }
  const meteor = pactPayoff("Meteorite", 75, 269, 70, 58, 58);
  const meteorMid = pactPayoff("Meteorite", 75, 269, 70, 58, 58, 1500);
  const meteorTop = pactPayoff("Meteorite", 75, 269, 70, 58, 58, 3000);
  const meteorBare = Math.max(1, holyDamage(avatarMnd(75, "carbuncle") - 58, 0) * 2);
  if (meteoriteTpScale(0) !== 1 || meteoriteTpScale(1500) !== 1024 / 896 || meteoriteTpScale(3000) !== 1088 / 896) {
    throw new Error("meteorite anchors");
  }
  if (
    meteor.magical !== meteorBare ||
    meteorMid.magical !== Math.max(1, Math.floor(meteorBare * meteoriteTpScale(1500))) ||
    meteorTop.magical !== Math.max(1, Math.floor(meteorBare * meteoriteTpScale(3000))) ||
    meteorTop.magical <= meteor.magical
  ) {
    throw new Error(`meteorite TP ${meteor.magical}/${meteorMid.magical}/${meteorTop.magical}`);
  }
  for (const row of SMN_PACTS) {
    if (row.merit) continue;
    if (pactSpendsAvatarTp(row.name) && pactPhysicalHits(row.name) > 0) throw new Error(`${row.name} both spends and hits`);
  }
  const spirit = spiritSpellDamage("fire", 75, 58, 58);
  if (spirit.name !== "Fire IV" || spirit.damage <= fire.magical) throw new Error(`spirit ${spirit.name}/${spirit.damage}`);
  const spiritJob = spiritSpellDamage("fire", 75, 58, 58, "fire-spirit");
  if (spiritJob.name !== "Fire IV" || spiritJob.damage <= 0 || spiritJob.damage === spirit.damage) {
    throw new Error(`fire spirit nuke ${spiritJob.damage}/${spirit.damage}`);
  }
  for (const pact of SMN_PACTS) {
    if (pact.merit) continue;
    const pay = pactPayoff(pact.name, 75, 269, 70, 58, 58);
    if (pay.physical <= 0 && pay.magical <= 0 && pay.cure <= 0 && pay.ward == null && pay.rider == null && !pay.endsFlow) throw new Error(`${pact.name} does nothing`);
  }
}
