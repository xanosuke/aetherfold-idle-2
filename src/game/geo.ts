/**
 * Retail Geomancer through level 75. No merits, no job points, no master levels.
 *
 * AirSkyBoat grades, the same scale as Rune Fencer in this kit:
 * HP C, MP B, STR F, DEX D, VIT E, AGI D, INT C, MND C, CHR D.
 * Current LandSandBoat grades are a different row and are not used.
 * Naked Hume 75, no sub: 1167 HP, 616 MP, STR 48, DEX 56, VIT 53,
 * AGI 56, INT 61, MND 61, CHR 56. Max MP Boost is not in that MP.
 *
 * The model wears Geomancy Attire. The pieces are not equipped.
 * Ash Club is in hand. A level-1 handbell with no stats sits in the
 * ranged slot so Handbell skill counts. Idris, Dunna, and the artifact
 * stats are item level 119 and are not in the bag.
 *
 * A normal subjob is 37. It gets Indi spells of level 37 or less,
 * Full Circle, Lasting Emanation, Ecliptic Attrition, Conserve MP II,
 * Clear Mind I, Cardinal Chant I, and Max MP Boost I.
 * Geocolure is main job only. Bolster is the one-hour and is main only.
 * Collimated Fervor is 40, so a level-37 sub does not have it.
 * Life Cycle needs a master-level sub. 60 and up are main only.
 * Merits are stored and refused.
 *
 * Luopan decay is floor(level / 4) HP a tick. Lasting Emanation subtracts
 * floor(level / 14). Ecliptic Attrition adds floor(level / 16). The tick
 * is 3 seconds, the same clock as Regen. Maximum HP is not published for
 * a level-75 pet, so this yard uses decay × 70: seventy ticks, then it fades.
 * At 75 that is 18 a tick and 1260 HP.
 */

import { skillCap, type SkillRank } from "./skills";
import { characterBase } from "./stats";
import type { JobAccess } from "./blm";
import type { JobId } from "./stats";

export type GeoAbility = {
  name: string;
  level: number;
  recast: number;
  duration: number;
  access: JobAccess;
  effect: string;
  merit?: boolean;
};

export type GeoTrait = {
  name: string;
  level: number;
  access: JobAccess;
  effect: string;
  merit?: boolean;
};

export type GeoSkill = { name: string; rank: SkillRank };

export type GeoEffect =
  | "poison"
  | "voidance"
  | "precision"
  | "regen"
  | "attunement"
  | "focus"
  | "barrier"
  | "refresh"
  | "chr"
  | "mnd"
  | "int"
  | "agi"
  | "dex"
  | "vit"
  | "str"
  | "fury"
  | "acumen"
  | "fend"
  | "slow"
  | "torpor"
  | "slip"
  | "languor"
  | "paralysis"
  | "vex";

export type GeoElement = "fire" | "ice" | "wind" | "earth" | "thunder" | "water" | "light" | "dark";

type PotencyRow = {
  allies: boolean;
  element: GeoElement;
  min: number;
  max: number;
  /** Combined Geomancy + Handbell where the effect reaches max. */
  skill: number;
};

/** LandSandBoat potency rows. No Geomancy+ gear. Haste, Frailty, and the rest past 75 are not here. */
const POTENCY: Record<GeoEffect, PotencyRow> = {
  poison: { allies: false, element: "water", min: 1, max: 30, skill: 600 },
  voidance: { allies: true, element: "wind", min: 1, max: 65, skill: 900 },
  precision: { allies: true, element: "thunder", min: 1, max: 50, skill: 900 },
  regen: { allies: true, element: "light", min: 1, max: 30, skill: 600 },
  attunement: { allies: true, element: "light", min: 1, max: 65, skill: 900 },
  focus: { allies: true, element: "dark", min: 1, max: 50, skill: 900 },
  barrier: { allies: true, element: "earth", min: 9.7, max: 39.8, skill: 900 },
  refresh: { allies: true, element: "light", min: 1, max: 6, skill: 900 },
  chr: { allies: true, element: "light", min: 1, max: 25, skill: 900 },
  mnd: { allies: true, element: "water", min: 1, max: 25, skill: 900 },
  int: { allies: true, element: "ice", min: 1, max: 25, skill: 900 },
  agi: { allies: true, element: "wind", min: 1, max: 25, skill: 900 },
  dex: { allies: true, element: "thunder", min: 1, max: 25, skill: 900 },
  vit: { allies: true, element: "earth", min: 1, max: 25, skill: 900 },
  str: { allies: true, element: "fire", min: 1, max: 25, skill: 900 },
  fury: { allies: true, element: "fire", min: 4.6, max: 34.7, skill: 900 },
  acumen: { allies: true, element: "ice", min: 3, max: 15, skill: 900 },
  fend: { allies: true, element: "water", min: 5, max: 20, skill: 900 },
  slow: { allies: false, element: "earth", min: 0.9, max: 14.9, skill: 900 },
  torpor: { allies: false, element: "ice", min: 1, max: 50, skill: 900 },
  slip: { allies: false, element: "earth", min: 1, max: 65, skill: 900 },
  languor: { allies: false, element: "dark", min: 1, max: 50, skill: 900 },
  paralysis: { allies: false, element: "ice", min: 1, max: 15, skill: 900 },
  vex: { allies: false, element: "light", min: 1, max: 65, skill: 900 },
};

export const GEO_ABILITIES: GeoAbility[] = [
  {
    name: "Bolster",
    level: 1,
    recast: 3600,
    duration: 180,
    access: "main",
    effect: "Doubles geomancy potency for 3:00. Recast 1:00:00. An Indi already on you is doubled. A luopan already out is not. A Geocolure cast while this is up is doubled, and that bonus ends when Bolster does. If Blaze of Glory was also spent on that cast, the +50% remains and the luopan stays at half HP. An entrusted Indi is not doubled. Ecliptic Attrition cannot be used while this is up. The job-point luopan bonus is not applied. Cumulative enmity 0, volatile enmity 320. Main job only.",
  },
  {
    name: "Full Circle",
    level: 5,
    recast: 10,
    duration: 0,
    access: "sub",
    effect: "The luopan vanishes. MP returned is floor(half the spell's MP cost × the luopan's HP percent). Curative Recantation is a merit and is not unlocked, so no HP is returned. Cumulative enmity 0, volatile enmity 320.",
  },
  {
    name: "Lasting Emanation",
    level: 25,
    recast: 300,
    duration: 0,
    access: "sub",
    effect: "The luopan loses floor(level / 14) less HP each tick. At 75 the decay falls from 18 to 13, and it does not fall under 1. Shares its 5:00 recast with Ecliptic Attrition. The two effects stack when each is used on its own recast. Cumulative enmity 0, volatile enmity 320.",
  },
  {
    name: "Ecliptic Attrition",
    level: 25,
    recast: 300,
    duration: 0,
    access: "sub",
    effect: "Luopan potency ×1.25, floored, and decay gains floor(level / 16). At 75 that is +4 HP a tick. Cannot be used while Bolster is up. Shares its 5:00 recast with Lasting Emanation. Cumulative enmity 0, volatile enmity 320.",
  },
  {
    name: "Collimated Fervor",
    level: 40,
    recast: 300,
    duration: 60,
    access: "sub",
    effect: "Cardinal Chant +50% for 1:00. Recast 5:00. It does not raise geomancy potency. A level-37 sub has not learned it. Cumulative enmity 0, volatile enmity 320.",
  },
  {
    name: "Life Cycle",
    level: 50,
    recast: 600,
    duration: 0,
    access: "master-sub",
    effect: "Gives the luopan floor(25% of your current HP). Refused at 2 HP or less. Recast 10:00. A support job needs master levels. Cumulative enmity 0, volatile enmity 320.",
  },
  {
    name: "Blaze of Glory",
    level: 60,
    recast: 600,
    duration: 60,
    access: "main",
    effect: "The next Geocolure gains +50% potency, floored, and the luopan is placed at half HP. 1:00 or that spell. Recast 10:00. If Bolster is already up, the potency is doubled instead of raised by half, and the luopan is still placed at half HP. Main job only. Cumulative enmity 0, volatile enmity 320.",
  },
  {
    name: "Dematerialize",
    level: 70,
    recast: 600,
    duration: 60,
    access: "main",
    effect: "The luopan takes no damage for 1:00. Recast 10:00. The HP decay is not damage, so it keeps ticking. Merit recast is not unlocked. Main job only. Cumulative enmity 0, volatile enmity 320.",
  },
  {
    name: "Entrust",
    level: 75,
    recast: 600,
    duration: 60,
    access: "main",
    effect: "The next Indicolure can be cast on a party member. 1:00 or that spell. Recast 10:00. It is a second bubble and does not replace the one on you. Bolster does not double it. Main job only. Cumulative enmity 0, volatile enmity 320.",
  },
  {
    name: "Mending Halation",
    level: 75,
    recast: 300,
    duration: 0,
    access: "main",
    merit: true,
    effect: "Merit ability. Not unlocked.",
  },
  {
    name: "Radial Arcana",
    level: 75,
    recast: 300,
    duration: 0,
    access: "main",
    merit: true,
    effect: "Merit ability. Not unlocked.",
  },
];

export const GEO_TRAITS: GeoTrait[] = [
  { name: "Conserve MP", level: 10, access: "sub", effect: "25% chance to lower a spell's MP cost. The numerator is an even 8 through 14 over 16." },
  { name: "Clear Mind", level: 20, access: "sub", effect: "+3 MP per tick while resting. The next tier replaces this." },
  { name: "Cardinal Chant", level: 25, access: "sub", effect: "Elemental magic only. The bonus is where the target stands when the spell lands, not which way you face. East is magic attack. South is magic accuracy. West is magic burst bonus, outside the gear cap, and it matters only while a burst window is open. North is magic crit rate. A true diagonal is half of each neighbor. The blend falls off across the quarter-turn and is floored. Tier I at a true cardinal is +5, or +8 for a -ra spell. West is +10, or +15. Stonega uses the lower column. The next tier replaces this." },
  { name: "Conserve MP II", level: 25, access: "sub", effect: "28% chance. Replaces Conserve MP." },
  { name: "Max MP Boost", level: 30, access: "sub", effect: "+10 MP. The next tier replaces this." },
  { name: "Clear Mind II", level: 40, access: "sub", effect: "+6 MP per tick while resting. A level-37 sub does not have it. Replaces Clear Mind." },
  { name: "Conserve MP III", level: 40, access: "sub", effect: "31% chance. A level-37 sub does not have it. Replaces the earlier tier." },
  { name: "Cardinal Chant II", level: 45, access: "sub", effect: "Replaces Cardinal Chant. At a true cardinal: magic attack, magic accuracy, and magic crit +7, or +10 for a -ra spell. Magic burst +14, or +19. A level-37 sub does not have it." },
  { name: "Elemental Celerity", level: 55, access: "master-sub", effect: "Elemental cast time −10%. A support job needs master levels. It does not change recast." },
  { name: "Conserve MP IV", level: 55, access: "master-sub", effect: "34% chance. A support job needs master levels. Replaces the earlier tier." },
  { name: "Clear Mind III", level: 60, access: "main", effect: "+9 MP per tick while resting. Main job only. Replaces the earlier tier." },
  { name: "Max MP Boost II", level: 60, access: "main", effect: "+20 MP. Main job only. Replaces Max MP Boost." },
  { name: "Cardinal Chant III", level: 65, access: "main", effect: "Replaces the earlier tier. Main job only. At a true cardinal: magic attack and magic accuracy +10, or +14 for a -ra spell. Magic burst +18, or +24. Magic crit +9, or +13. Collimated Fervor adds half, floored, after the angle. A magic crit is magic attack +10. No magic-crit-damage gear is equipped, so that stays +10." },
  { name: "Conserve MP V", level: 70, access: "main", effect: "37% chance. Main job only. Replaces the earlier tier." },
  { name: "Curative Recantation", level: 75, access: "main", merit: true, effect: "Merit trait. Not unlocked. Full Circle would also restore HP." },
  { name: "Primeval Zeal", level: 75, access: "main", merit: true, effect: "Merit trait. Not unlocked." },
];

/** Combat and magic skills from the Geomancer job page. No rank means 0. */
export const GEO_SKILLS: GeoSkill[] = [
  { name: "Club", rank: "B+" },
  { name: "Staff", rank: "C+" },
  { name: "Dagger", rank: "C-" },
  { name: "Evasion", rank: "D" },
  { name: "Parrying", rank: "E" },
  { name: "Elemental Magic", rank: "B+" },
  { name: "Enfeebling Magic", rank: "C+" },
  { name: "Dark Magic", rank: "C" },
  { name: "Geomancy", rank: "C" },
  { name: "Handbell", rank: "C" },
];

export function geoSkill(name: string, level: number): number {
  const row = GEO_SKILLS.find((skill) => skill.name === name);
  return row ? skillCap(row.rank, level) : 0;
}

export function geoEffect(name: GeoEffect): PotencyRow {
  return POTENCY[name];
}

/** Combined skill is clamped to 900. A missing handbell contributes 0. */
export function geomancyPotency(effect: GeoEffect, geomancy: number, handbell: number): number {
  const row = POTENCY[effect];
  const combined = Math.max(0, Math.min(900, geomancy + handbell));
  const span = row.max - row.min;
  const potency = row.min + (combined * span) / row.skill;
  return Math.max(row.min, Math.min(row.max, potency));
}

/** Integer tick. Slow stays a percent until the caller asks for the fixed-point form. */
export function tickPotency(effect: GeoEffect, potency: number): number {
  if (effect === "slow") return Math.floor(potency * 100);
  return Math.floor(potency);
}

/** A debuff colure is 6'. It does not reach a body that is not already on the hate list. */
export const COLURE_YARDS = 6;

export function colureFoe(effect: GeoEffect): boolean {
  return !POTENCY[effect].allies;
}

/** True when that body is already claimed and standing inside the bubble. */
export function colureReaches(onHateList: boolean, yards: number): boolean {
  return onHateList && yards <= COLURE_YARDS;
}

export function geoAllies(effect: GeoEffect): boolean {
  return POTENCY[effect].allies;
}

export function geoElement(effect: GeoEffect): GeoElement {
  return POTENCY[effect].element;
}

/** HP lost every 3 seconds. Lasting and Ecliptic change the rate, not the maximum. */
export function luopanDecay(level: number, lasting: boolean, ecliptic: boolean): number {
  let decay = Math.floor(level / 4);
  if (lasting) decay -= Math.floor(level / 14);
  if (ecliptic) decay += Math.floor(level / 16);
  return Math.max(1, decay);
}

/** Stand-in maximum. Seventy ticks of the spawn decay, so a naked 75 luopan lasts 210 seconds. */
export function luopanMaxHp(level: number): number {
  return luopanDecay(level, false, false) * 70;
}

export function fullCircleMp(mpCost: number, hp: number, maxHp: number): number {
  if (maxHp <= 0 || hp <= 0) return 0;
  const hpp = Math.max(0, Math.min(100, (hp / maxHp) * 100));
  return Math.floor((0.5 * mpCost * hpp) / 100);
}

/**
 * East, south, west, north. Each pair is the non-ra column, then the -ra column.
 * Tier IV is level 85 and is not in this yard. North tier III is not the same row as the other three.
 */
const CHANT_BONUS: readonly (readonly (readonly [number, number])[])[] = [
  [[0, 0], [0, 0], [0, 0], [0, 0]],
  [[5, 8], [5, 8], [10, 15], [5, 8]],
  [[7, 10], [7, 10], [14, 19], [7, 10]],
  [[10, 14], [10, 14], [18, 24], [9, 13]],
];

/** Tier actually granted. A normal subjob stops before 45. Tier III is main only. */
export function cardinalTier(level: number, access: "main" | "sub"): number {
  if (access === "main") {
    if (level >= 65) return 3;
    if (level >= 45) return 2;
    if (level >= 25) return 1;
    return 0;
  }
  if (level >= 45) return 2;
  if (level >= 25) return 1;
  return 0;
}

export type CardinalChant = {
  /** East. Added to magic attack bonus. */
  attack: number;
  /** South. Added to magic accuracy. */
  accuracy: number;
  /** West. Magic burst bonus, in percentage points. 18 is +18%. */
  burst: number;
  /** North. Magic critical hit rate, in percentage points. */
  crit: number;
};

/**
 * World bearing from the geomancer to the target, in the retail 0–256 rotation.
 * 0 is east (+X). 64 is south (+Z). 128 is west. 192 is north.
 * Facing is not part of it. A target on the same tile has no direction.
 */
export function cardinalAngle(dx: number, dz: number): number | null {
  if (dx * dx + dz * dz < 1e-8) return null;
  let rad = Math.atan2(dz, dx);
  if (rad < 0) rad += Math.PI * 2;
  return (rad / (Math.PI * 2)) * 256;
}

/** 1 on the cardinal, 0 a quarter-turn away. The two neighbors meet at 1/2. */
function chantShare(angle: number, optimal: number): number {
  let d = Math.abs(angle - optimal);
  if (d > 128) d = 256 - d;
  if (d >= 64) return 0;
  return (64 - d) / 64;
}

function chantPart(base: number, fervor: boolean, share: number): number {
  if (base <= 0 || share <= 0) return 0;
  return Math.floor(base * (fervor ? 1.5 : 1) * share);
}

/**
 * What lands on an elemental spell. Collimated Fervor is ×1.5, then the floor.
 * Gear that raises Cardinal Chant is not in the bag. A null angle is no bonus.
 */
export function cardinalChant(level: number, access: "main" | "sub", ra: boolean, fervor: boolean, angle: number | null): CardinalChant {
  const none: CardinalChant = { attack: 0, accuracy: 0, burst: 0, crit: 0 };
  if (angle == null) return none;
  const row = CHANT_BONUS[cardinalTier(level, access)] ?? CHANT_BONUS[0];
  const col = ra ? 1 : 0;
  const wrapped = ((angle % 256) + 256) % 256;
  return {
    attack: chantPart(row[0][col], fervor, chantShare(wrapped, 0)),
    accuracy: chantPart(row[1][col], fervor, chantShare(wrapped, 64)),
    burst: chantPart(row[2][col], fervor, chantShare(wrapped, 128)),
    crit: chantPart(row[3][col], fervor, chantShare(wrapped, 192)),
  };
}

/** Clear Mind bonus added to the resting tick. Tiers replace. A sub stops at +3. */
export function geoClearMind(level: number, access: "main" | "sub"): number {
  if (access === "main") {
    if (level >= 60) return 9;
    if (level >= 40) return 6;
    if (level >= 20) return 3;
    return 0;
  }
  if (level >= 40) return 6;
  if (level >= 20) return 3;
  return 0;
}

/** Conserve MP proc chance. Tiers replace. A level-37 sub is 28%. */
export function geoConserveMp(level: number, access: "main" | "sub"): number {
  if (access === "main") {
    if (level >= 70) return 0.37;
    if (level >= 55) return 0.34;
    if (level >= 40) return 0.31;
    if (level >= 25) return 0.28;
    if (level >= 10) return 0.25;
    return 0;
  }
  if (level >= 40) return 0.31;
  if (level >= 25) return 0.28;
  if (level >= 10) return 0.25;
  return 0;
}

/** Max MP Boost. Tiers replace. A sub stops at +10. */
export function geoMaxMp(level: number, access: "main" | "sub"): number {
  if (access === "main") {
    if (level >= 60) return 20;
    if (level >= 30) return 10;
    return 0;
  }
  if (level >= 30) return 10;
  return 0;
}

/** Elemental Celerity as a fraction of cast time removed. Subjobs need master levels. */
export function geoCelerity(level: number, access: "main" | "sub"): number {
  if (access !== "main") return 0;
  return level >= 55 ? 0.1 : 0;
}

export type GeoCastCtx = {
  recastLeft: number;
  geoLevel: number;
  geoMain: boolean;
  hp: number;
  luopan: boolean;
  luopanHp: number;
  luopanMax: number;
  luopanMp: number;
  bolster: boolean;
  ecliptic: boolean;
  lasting: boolean;
};

export type GeoCast = {
  ok: boolean;
  text: string;
  recast?: number;
  buff?: { name: string; duration: number; power?: number };
  hate?: { ce: number; ve: number };
  heal?: number;
  mpHeal?: number;
  share?: string[];
  /** Full Circle. The store dismisses the luopan. */
  fullCircle?: boolean;
  lasting?: boolean;
  ecliptic?: { potency: number };
  /** Seconds the luopan cannot be struck. */
  demat?: number;
  /** HP moved onto the luopan. The caster already paid `heal`. */
  life?: number;
};

const GEO_BY_NAME = new Map(GEO_ABILITIES.map((ability) => [ability.name, ability]));

function learned(row: GeoAbility, ctx: GeoCastCtx): boolean {
  if (ctx.geoLevel < row.level) return false;
  if (!ctx.geoMain && row.access !== "sub") return false;
  return true;
}

export function castGeo(name: string, ctx: GeoCastCtx): GeoCast | null {
  const row = GEO_BY_NAME.get(name);
  if (!row) return null;
  if (!learned(row, ctx)) return { ok: false, text: `${name} is not learned.` };
  if (row.merit) return { ok: false, text: `${name} is not unlocked.` };
  if (ctx.recastLeft > 0) return { ok: false, text: `${name} is not ready.` };
  const hate = { ce: 0, ve: 320 };
  if (name === "Bolster") {
    return {
      ok: true,
      text: "Bolster. Geomancy potency is doubled for 3:00. An Indi on you is doubled now. A luopan already out is not. Recast 1:00:00.",
      recast: row.recast,
      buff: { name, duration: row.duration },
      hate,
    };
  }
  if (name === "Full Circle") {
    if (!ctx.luopan) return { ok: false, text: "Full Circle needs a luopan." };
    const mp = fullCircleMp(ctx.luopanMp, ctx.luopanHp, ctx.luopanMax);
    return {
      ok: true,
      text: `Full Circle. The luopan vanishes. ${mp} MP returns.`,
      recast: row.recast,
      mpHeal: mp,
      fullCircle: true,
      hate,
    };
  }
  if (name === "Lasting Emanation") {
    if (!ctx.luopan) return { ok: false, text: "Lasting Emanation needs a luopan." };
    if (ctx.lasting) return { ok: false, text: "Lasting Emanation is already in effect." };
    return {
      ok: true,
      text: `Lasting Emanation. Decay drops by ${Math.floor(ctx.geoLevel / 14)} HP a tick. Recast is shared with Ecliptic Attrition.`,
      recast: row.recast,
      share: ["Ecliptic Attrition"],
      lasting: true,
      hate,
    };
  }
  if (name === "Ecliptic Attrition") {
    if (!ctx.luopan) return { ok: false, text: "Ecliptic Attrition needs a luopan." };
    if (ctx.bolster) return { ok: false, text: "Ecliptic Attrition cannot be used during Bolster." };
    if (ctx.ecliptic) return { ok: false, text: "Ecliptic Attrition is already in effect." };
    return {
      ok: true,
      text: `Ecliptic Attrition. Luopan potency is raised by a quarter, and decay gains ${Math.floor(ctx.geoLevel / 16)} HP a tick.`,
      recast: row.recast,
      share: ["Lasting Emanation"],
      ecliptic: { potency: 1.25 },
      hate,
    };
  }
  if (name === "Collimated Fervor") {
    return {
      ok: true,
      text: "Collimated Fervor. Cardinal Chant is raised by half for 1:00.",
      recast: row.recast,
      buff: { name, duration: row.duration },
      hate,
    };
  }
  if (name === "Life Cycle") {
    if (!ctx.luopan) return { ok: false, text: "Life Cycle needs a luopan." };
    if (ctx.hp <= 2) return { ok: false, text: "Life Cycle cannot be used at this HP." };
    const gift = Math.floor(ctx.hp * 0.25);
    return {
      ok: true,
      text: `Life Cycle. ${gift} HP moves to the luopan.`,
      recast: row.recast,
      heal: -gift,
      life: gift,
      hate,
    };
  }
  if (name === "Blaze of Glory") {
    return {
      ok: true,
      text: "Blaze of Glory. The next Geocolure is half again as strong, and the luopan is placed at half HP.",
      recast: row.recast,
      buff: { name, duration: row.duration },
      hate,
    };
  }
  if (name === "Dematerialize") {
    if (!ctx.luopan) return { ok: false, text: "Dematerialize needs a luopan." };
    return {
      ok: true,
      text: "Dematerialize. The luopan takes no damage for 1:00. Decay keeps ticking.",
      recast: row.recast,
      demat: row.duration,
      hate,
    };
  }
  if (name === "Entrust") {
    return {
      ok: true,
      text: "Entrust. The next Indicolure can be cast on a party member.",
      recast: row.recast,
      buff: { name, duration: row.duration },
      hate,
    };
  }
  return { ok: false, text: `${name} is not learned.` };
}

/** -ra nukes. Cardinal Chant uses the higher column for these and not for Stonega. */
export function isRaNuke(name: string): boolean {
  return /^(Stonera|Watera|Aera|Fira|Blizzara|Thundara)( II)?$/.test(name);
}

/**
 * Potency that lands. Bolster doubles and replaces Blaze of Glory's +50%.
 * Ecliptic Attrition is ×1.25, then the whole number is floored.
 * Slow is stored as the fixed-point percent. A new Geocolure cannot see
 * Ecliptic Attrition, because that ability needs a luopan already out.
 */
export function colurePower(effect: GeoEffect, geomancy: number, handbell: number, bolster: boolean, blaze: boolean, ecliptic: boolean): number {
  let potency = geomancyPotency(effect, geomancy, handbell);
  if (bolster) potency *= 2;
  else if (blaze) potency *= 1.5;
  if (ecliptic) potency *= 1.25;
  return effect === "slow" ? Math.floor(potency * 100) : Math.floor(potency);
}
export function colureMelee(name: string, power: number): { attackNumer: number; defenseNumer: number; attackFlat: number; defenseFlat: number; accuracy: number; evasion: number } {
  const out = { attackNumer: 0, defenseNumer: 0, attackFlat: 0, defenseFlat: 0, accuracy: 0, evasion: 0 };
  if (power <= 0) return out;
  if (name.endsWith("Precision")) out.accuracy += power;
  else if (name.endsWith("Voidance")) out.evasion += power;
  else if (name.endsWith("Fury")) out.attackNumer += Math.round((power * 256) / 100);
  else if (name.endsWith("Barrier")) out.defenseNumer += Math.round((power * 256) / 100);
  else if (name.endsWith("STR")) out.attackFlat += power;
  else if (name.endsWith("DEX")) out.accuracy += Math.floor(power * 0.75);
  else if (name.endsWith("AGI")) out.evasion += Math.floor(power / 2);
  else if (name.endsWith("VIT")) out.defenseFlat += power;
  return out;
}

export function acumenBonus(buffs: readonly { name: string; power?: number }[]): number {
  return colureNamed(buffs, "Acumen");
}

/** A stat colure. STR, DEX, VIT, AGI, INT, MND, CHR. The spell name is the stat. */
export function colureStat(buffs: readonly { name: string; power?: number }[], stat: string): number {
  return colureNamed(buffs, stat);
}

/** Indi and Geo of one suffix. Focus, Fend, Languor, Vex, and the stat names. */
export function colureNamed(rows: readonly { name: string; power?: number }[], suffix: string): number {
  const indi = `Indi-${suffix}`;
  const geo = `Geo-${suffix}`;
  let n = 0;
  for (const row of rows) if (row.name === indi || row.name === geo) n += row.power ?? 0;
  return n;
}

/**
 * What a status line and a cast floater should print.
 * Slow is stored as the percent times 100. 1490 is 14.9%.
 */
export function colureBrief(name: string, power: number): string {
  const cut = name.indexOf("-");
  const effect = (cut < 0 ? name : name.slice(cut + 1)).toLowerCase();
  if (!Number.isFinite(power)) return "";
  switch (effect) {
    case "poison":
      return `${power}/tick`;
    case "regen":
      return `+${power}/tick`;
    case "refresh":
      return `+${power} MP/tick`;
    case "slow":
      return `${(power / 100).toFixed(1)}%`;
    case "paralysis":
      return `${power}%`;
    case "barrier":
    case "fury":
      return `+${power}%`;
    case "voidance":
      return `+${power} eva`;
    case "precision":
      return `+${power} acc`;
    case "attunement":
      return `+${power} meva`;
    case "focus":
      return `+${power} macc`;
    case "acumen":
      return `+${power} mab`;
    case "fend":
      return `+${power} mdb`;
    case "torpor":
      return `−${power} eva`;
    case "slip":
      return `−${power} acc`;
    case "languor":
      return `−${power} meva`;
    case "vex":
      return `−${power} macc`;
    case "str":
    case "dex":
    case "vit":
    case "agi":
    case "int":
    case "mnd":
    case "chr":
      return `+${power} ${effect.toUpperCase()}`;
    default:
      return String(power);
  }
}

/**
 * What the colure does, in the retail words.
 * Slow is stored as the percent times 100. 1490 is 14.9%.
 * The bubble is 6'. A debuff is not resisted. It only takes
 * an enemy that is already on the geomancer's hate list.
 * An Indi follows the caster for 3:00. A Geo stays on the luopan.
 */
export function colureLine(effect: GeoEffect, power: number, side: "indi" | "geo"): string {
  const span = side === "indi" ? "for 3:00" : "while the luopan stands";
  const friends = side === "indi" ? "Party members within 6'" : "Allies within 6' of the luopan";
  const foes = "Enemies on your hate list within 6'" + (side === "geo" ? " of the luopan" : "");
  const slow = (power / 100).toFixed(1);
  switch (effect) {
    case "poison":
      return `${foes} are poisoned for ${power} HP a tick ${span}. It is not resisted.`;
    case "voidance":
      return `${friends} gain evasion +${power} ${span}.`;
    case "precision":
      return `${friends} gain accuracy and ranged accuracy +${power} ${span}.`;
    case "regen":
      return `${friends} recover ${power} HP every 3 seconds ${span}.`;
    case "attunement":
      return `${friends} gain magic evasion +${power} ${span}.`;
    case "focus":
      return `${friends} gain magic accuracy +${power} ${span}.`;
    case "barrier":
      return `${friends} gain defense +${power}% ${span}.`;
    case "refresh":
      return `${friends} recover ${power} MP every 3 seconds ${span}.`;
    case "chr":
    case "mnd":
    case "int":
    case "agi":
    case "dex":
    case "vit":
    case "str":
      return `${friends} gain ${effect.toUpperCase()} +${power} ${span}.`;
    case "fury":
      return `${friends} gain attack and ranged attack +${power}% ${span}.`;
    case "acumen":
      return `${friends} gain magic attack bonus +${power} ${span}.`;
    case "fend":
      return `${friends} gain magic defense bonus +${power} ${span}.`;
    case "slow":
      return `${foes} are slowed ${slow}% ${span}. It is not resisted.`;
    case "torpor":
      return `${foes} lose ${power} evasion ${span}. It is not resisted.`;
    case "slip":
      return `${foes} lose ${power} accuracy and ranged accuracy ${span}. It is not resisted.`;
    case "languor":
      return `${foes} lose ${power} magic evasion ${span}. It is not resisted.`;
    case "paralysis":
      return `${foes} are paralyzed. ${power}% chance to stop an action ${span}. It is not resisted.`;
    case "vex":
      return `${foes} lose ${power} magic accuracy ${span}. It is not resisted.`;
    default:
      return `Potency ${power} ${span}.`;
  }
}

export function assertGeo(): void {
  const naked = characterBase("hume", "GEO", 75);
  if (naked.hp !== 1167 || naked.mp !== 616 || naked.str !== 48 || naked.dex !== 56 || naked.vit !== 53 || naked.agi !== 56 || naked.int !== 61 || naked.mnd !== 61 || naked.chr !== 56) {
    throw new Error(`naked Hume GEO ${naked.hp}/${naked.mp}/${naked.str}/${naked.dex}/${naked.vit}/${naked.agi}/${naked.int}/${naked.mnd}/${naked.chr}`);
  }
  if (geoSkill("Club", 75) !== 256 || geoSkill("Staff", 75) !== 230 || geoSkill("Dagger", 75) !== 220) throw new Error("GEO weapons");
  if (geoSkill("Evasion", 75) !== 210 || geoSkill("Parrying", 75) !== 200) throw new Error("GEO defense skills");
  if (geoSkill("Elemental Magic", 75) !== 256 || geoSkill("Enfeebling Magic", 75) !== 230 || geoSkill("Dark Magic", 75) !== 225) throw new Error("GEO magic skills");
  if (geoSkill("Geomancy", 75) !== 225 || geoSkill("Handbell", 75) !== 225 || geoSkill("Sword", 75) !== 0) throw new Error("GEO geomancy");
  if (geoSkill("Geomancy", 37) !== 105 || geoSkill("Handbell", 37) !== 105) throw new Error("GEO sub skill");
  if (geoClearMind(75, "main") !== 9 || geoClearMind(37, "sub") !== 3 || geoClearMind(40, "sub") !== 6) throw new Error("GEO clear mind");
  if (geoConserveMp(75, "main") !== 0.37 || geoConserveMp(37, "sub") !== 0.28 || geoConserveMp(9, "sub") !== 0) throw new Error("GEO conserve");
  if (geoMaxMp(75, "main") !== 20 || geoMaxMp(37, "sub") !== 10 || geoMaxMp(29, "main") !== 0) throw new Error("GEO max mp");
  if (geoCelerity(75, "main") !== 0.1 || geoCelerity(54, "main") !== 0 || geoCelerity(75, "sub") !== 0) throw new Error("GEO celerity");
  if (cardinalTier(75, "main") !== 3 || cardinalTier(37, "sub") !== 1 || cardinalTier(45, "sub") !== 2 || cardinalTier(65, "sub") !== 2) {
    throw new Error("GEO chant");
  }
  const south = cardinalChant(75, "main", false, false, 64);
  const southRa = cardinalChant(75, "main", true, false, 64);
  const southFervor = cardinalChant(75, "main", false, true, 64);
  const southRaFervor = cardinalChant(75, "main", true, true, 64);
  if (south.accuracy !== 10 || south.attack !== 0 || south.burst !== 0 || south.crit !== 0) throw new Error("GEO south");
  if (southRa.accuracy !== 14 || southFervor.accuracy !== 15 || southRaFervor.accuracy !== 21) throw new Error("GEO fervor");
  if (cardinalChant(37, "sub", false, false, 64).accuracy !== 5) throw new Error("GEO sub chant");
  const east = cardinalChant(75, "main", false, false, 0);
  const west = cardinalChant(75, "main", true, false, 128);
  const north = cardinalChant(75, "main", false, true, 192);
  if (east.attack !== 10 || east.accuracy !== 0 || west.burst !== 24 || north.crit !== 13) throw new Error("GEO cardinals");
  const between = cardinalChant(75, "main", false, false, 32);
  const northeast = cardinalChant(75, "main", false, true, 224);
  if (between.attack !== 5 || between.accuracy !== 5 || between.burst !== 0 || between.crit !== 0) throw new Error("GEO southeast");
  if (northeast.attack !== 7 || northeast.crit !== 6 || northeast.accuracy !== 0) throw new Error("GEO northeast");
  if (cardinalChant(75, "main", false, false, null).attack !== 0 || cardinalAngle(0, 0) !== null) throw new Error("GEO no bearing");
  if (cardinalAngle(1, 0) !== 0 || cardinalAngle(0, 1) !== 64 || cardinalAngle(-1, 0) !== 128 || cardinalAngle(0, -1) !== 192) throw new Error("GEO compass");
  if (isRaNuke("Stonega") || isRaNuke("Aeroga") || isRaNuke("Aerora") || !isRaNuke("Aera") || !isRaNuke("Stonera II") || !isRaNuke("Thundara")) throw new Error("GEO ra column");
  const regen = geomancyPotency("regen", 225, 225);
  if (regen !== 22.75 || tickPotency("regen", regen) !== 22) throw new Error(`GEO regen ${regen}`);
  const barrier = geomancyPotency("barrier", 225, 225);
  if (Math.abs(barrier - 24.75) > 0.001) throw new Error(`GEO barrier ${barrier}`);
  if (geomancyPotency("regen", 225, 0) !== 11.875) throw new Error("GEO regen without a bell");
  if (luopanDecay(75, false, false) !== 18 || luopanMaxHp(75) !== 1260 || luopanDecay(75, true, false) !== 13 || luopanDecay(75, true, true) !== 17) {
    throw new Error("GEO luopan decay");
  }
  if (fullCircleMp(74, 630, 1260) !== 18) throw new Error("GEO full circle");
  const bolster = castGeo("Bolster", { recastLeft: 0, geoLevel: 37, geoMain: false, hp: 100, luopan: false, luopanHp: 0, luopanMax: 0, luopanMp: 0, bolster: false, ecliptic: false, lasting: false });
  if (bolster?.ok !== false || bolster.text !== "Bolster is not learned.") throw new Error("GEO sub bolster");
  const circle = castGeo("Full Circle", { recastLeft: 0, geoLevel: 37, geoMain: false, hp: 100, luopan: false, luopanHp: 0, luopanMax: 1, luopanMp: 0, bolster: false, ecliptic: false, lasting: false });
  if (circle?.ok !== false) throw new Error("GEO full circle needs a luopan");
  const merit = castGeo("Mending Halation", { recastLeft: 0, geoLevel: 75, geoMain: true, hp: 100, luopan: true, luopanHp: 1, luopanMax: 1, luopanMp: 1, bolster: false, ecliptic: false, lasting: false });
  if (merit?.text !== "Mending Halation is not unlocked.") throw new Error("GEO merit");
  const life = castGeo("Life Cycle", { recastLeft: 0, geoLevel: 75, geoMain: true, hp: 100, luopan: true, luopanHp: 10, luopanMax: 100, luopanMp: 1, bolster: false, ecliptic: false, lasting: false });
  if (life?.heal !== -25 || life.life !== 25) throw new Error("GEO life cycle");
  const locked = castGeo("Life Cycle", { recastLeft: 0, geoLevel: 37, geoMain: false, hp: 100, luopan: true, luopanHp: 1, luopanMax: 1, luopanMp: 1, bolster: false, ecliptic: false, lasting: false });
  if (locked?.text !== "Life Cycle is not learned.") throw new Error("GEO sub life cycle");
  const ecliptic = castGeo("Ecliptic Attrition", { recastLeft: 0, geoLevel: 75, geoMain: true, hp: 100, luopan: true, luopanHp: 1, luopanMax: 1, luopanMp: 1, bolster: true, ecliptic: false, lasting: false });
  if (ecliptic?.ok !== false) throw new Error("GEO ecliptic during bolster");
  if (colureMelee("Indi-Precision", 22).accuracy !== 22 || colureMelee("Geo-Fury", 19).attackNumer !== Math.round((19 * 256) / 100)) throw new Error("GEO melee");
  if (colureMelee("Indi-DEX", 16).accuracy !== 12 || colureMelee("Indi-AGI", 16).evasion !== 8 || colureMelee("Indi-VIT", 10).defenseFlat !== 10) throw new Error("GEO stat colure");
  if (!colureLine("regen", 22, "indi").includes("22 HP") || !colureLine("vex", 32, "geo").includes("magic accuracy") || !colureLine("slow", 1490, "indi").includes("14.9%")) throw new Error("GEO colure line");
  if (!colureFoe("poison") || colureFoe("regen") || !colureReaches(true, 6) || colureReaches(true, 6.01) || colureReaches(false, 1)) {
    throw new Error("GEO colure hate");
  }
  if (colureNamed([{ name: "Indi-Focus", power: 9 }, { name: "Geo-Languor", power: 4 }], "Focus") !== 9) throw new Error("GEO focus");
  if (colureBrief("Indi-Regen", 12) !== "+12/tick" || colureBrief("Geo-Fury", 19) !== "+19%" || colureBrief("Indi-STR", 8) !== "+8 STR") throw new Error("GEO brief");
  if (colureBrief("Geo-Slow", 1490) !== "14.9%" || colureBrief("Geo-Poison", 8) !== "8/tick" || colureBrief("Indi-Vex", 20) !== "−20 macc") throw new Error("GEO brief foe");
  const jobs = new Set<JobId>(["GEO"]);
  if (!jobs.has("GEO")) throw new Error("GEO id");
}
