/**
 * Retail Red Mage toolkit through level 75. No merits and no job points.
 *
 * The job page's brackets, at a level-75 cap with no master levels:
 * through 49 a normal subjob can use the trait. 50–55 need a
 * master-level sub or the main job. 60 and up are main job only.
 * Chainspell is the one-hour ability and is main only. Convert is inside
 * the subjob bracket, at 40, so a level-37 sub has not learned it.
 * Composure is main only. The ability page says a subjob cannot use it.
 *
 * Fast Cast, Magic Attack Bonus, Magic Defense Bonus, Clear Mind, and
 * Resist Petrify replace earlier tiers. They do not add together.
 * Saboteur, Stymie, and Spontaneity are past 75.
 * Convert Recast, the elemental accuracy merits, Enfeebling Duration,
 * Magic Accuracy, Enhancing Duration, Immunobreak Chance, Enspell Damage,
 * and the Accuracy merit are not unlocked. Nothing here ranks them.
 */

import { skillCap, type SkillRank } from "./skills";
import { characterBase } from "./stats";
import type { JobAccess } from "./blm";

export type RdmAbility = {
  name: string;
  level: number;
  recast: number;
  duration: number;
  access: JobAccess;
  effect: string;
};

export type RdmTrait = {
  name: string;
  level: number;
  access: JobAccess;
  effect: string;
};

export type RdmSkill = {
  name: string;
  rank: SkillRank;
};

/**
 * Chainspell lasts one minute and recasts in one hour. The page says
 * every spell gets a very short cast and zero recast, and it does not
 * print the cast seconds. This yard plays that chant sped up, then the
 * land at full length. The spell's own recast is 0. MP is still spent.
 * An earlier recast is not cleared. Moving still interrupts.
 * A hit can still interrupt.
 * Job-point Chainspell Effect is not applied.
 * Convert swaps current HP and MP. It refuses 0 MP. Gear that changes
 * the HP side is not in this yard, so the swap is the current values,
 * capped at the pools. Volatile enmity is 80.
 * Composure lasts two hours and recasts in five minutes. Main only.
 * Accuracy is floor((24 × level + 74) / 49): 38 at 75. Self-targeted
 * enhancing magic lasts three times as long, and never past 30 minutes
 * unless the spell was already longer. Enspell damage, including
 * Enspell II, is tripled. Every spell recast is 25% longer.
 * The job-point accuracy ranks are not added.
 */

/** The card does not print the cast seconds. Long enough for one sped-up chant. The land is not shortened. */
export const CHAINSPELL_CAST_SECONDS = 0.3;

export const RDM_ABILITIES: RdmAbility[] = [
  {
    name: "Chainspell",
    level: 1,
    recast: 3600,
    duration: 60,
    access: "main",
    effect: "The chant still plays, sped up, and the land plays at full length. That spell's recast is 0. MP is still spent. Main job only. Recast 1:00:00. Duration 1:00. A recast that was already running stays. Moving still interrupts. A hit can still interrupt. Cumulative enmity 0, volatile enmity 0. The card does not print the cast seconds. Job-point elemental damage is not added.",
  },
  {
    name: "Convert",
    level: 40,
    recast: 600,
    duration: 0,
    access: "sub",
    effect: "Swaps current HP and MP. Cannot be used at 0 MP. Recast 10:00. Cumulative enmity 0, volatile enmity 80. A level-37 subjob has not learned it. Merit recast cuts are not unlocked. A pool cannot hold the overflow, so the extra is lost. The pose is two seconds. A red orb and a blue orb trade places on a circle at the chest.",
  },
  {
    name: "Composure",
    level: 50,
    recast: 300,
    duration: 7200,
    access: "main",
    effect: "Accuracy +38 at level 75, from floor((24 × level + 74) / 49). Self-targeted enhancing magic lasts three times as long, capped at 30:00 unless it was already longer. Enspell damage is tripled. Spell recast is 25% longer. Duration 2:00:00. Recast 5:00. Cumulative enmity 0, volatile enmity 80. Main job only. Job-point accuracy is not added.",
  },
];

export const RDM_TRAITS: RdmTrait[] = [
  { name: "Resist Petrify", level: 10, access: "sub", effect: "10% chance to resist Petrify. The next tier replaces this." },
  { name: "Fast Cast", level: 15, access: "sub", effect: "Casting time −10% on every spell. Recast time −5%, half of that. The next tier replaces this." },
  { name: "Magic Attack Bonus", level: 20, access: "sub", effect: "Magic Attack Bonus +20. The next tier replaces this. It does not stack with another job's Magic Attack Bonus." },
  { name: "Magic Defense Bonus", level: 25, access: "sub", effect: "Magic Defense Bonus +10. The next tier replaces this." },
  { name: "Tranquil Heart", level: 26, access: "sub", effect: "Healing magic generates less enmity, from Healing Magic skill, up to −25% at 500 skill. Cure enmity is not numbered here, so the reduction is not applied." },
  { name: "Resist Petrify II", level: 30, access: "sub", effect: "15% chance to resist Petrify. Replaces the earlier tier." },
  { name: "Clear Mind", level: 31, access: "sub", effect: "+3 MP per tick while resting. The next tier replaces this." },
  { name: "Fast Cast II", level: 35, access: "sub", effect: "Casting time −15%. Recast time −7.5%. Replaces Fast Cast." },
  { name: "Magic Attack Bonus II", level: 40, access: "sub", effect: "Magic Attack Bonus +24. Replaces the earlier tier. A level-37 subjob has not learned it." },
  { name: "Magic Defense Bonus II", level: 45, access: "sub", effect: "Magic Defense Bonus +12. Replaces the earlier tier. The next tier is 96." },
  { name: "Resist Petrify III", level: 50, access: "master-sub", effect: "20% chance to resist Petrify. A support job needs master levels." },
  { name: "Clear Mind II", level: 53, access: "master-sub", effect: "+6 MP per tick while resting. A support job needs master levels." },
  { name: "Fast Cast III", level: 55, access: "master-sub", effect: "Casting time −20%. Recast time −10%. A support job needs master levels. The next tier is 76." },
  { name: "Damage Limit+", level: 60, access: "main", effect: "Physical pDIF cap +26/256. Main job only. It does not raise the rolled pDIF. It does not stack with another job's Damage Limit+." },
  { name: "Resist Petrify IV", level: 70, access: "main", effect: "25% chance to resist Petrify. Main job only. The next tier is 81." },
  { name: "Clear Mind III", level: 75, access: "main", effect: "+9 MP per tick while resting, and the tick climbs one faster. Main job only." },
];

/** Combat and magic skills from the Red Mage job page. No rank means 0. Staff is not on that page. */
export const RDM_SKILLS: RdmSkill[] = [
  { name: "Dagger", rank: "B" },
  { name: "Sword", rank: "B" },
  { name: "Club", rank: "D" },
  { name: "Archery", rank: "D" },
  { name: "Throwing", rank: "F" },
  { name: "Evasion", rank: "D" },
  { name: "Parrying", rank: "E" },
  { name: "Shield", rank: "F" },
  { name: "Divine Magic", rank: "E" },
  { name: "Healing Magic", rank: "C-" },
  { name: "Enhancing Magic", rank: "B+" },
  { name: "Enfeebling Magic", rank: "A+" },
  { name: "Elemental Magic", rank: "C+" },
  { name: "Dark Magic", rank: "E" },
];

export function rdmSkill(name: string, level: number): number {
  const row = RDM_SKILLS.find((skill) => skill.name === name);
  return row ? skillCap(row.rank, level) : 0;
}

/** Casting time removed, as a fraction. 0.2 is −20%. Recast removed is half of this. A normal subjob stops at Fast Cast II. */
export function fastCast(level: number, access: "main" | "sub"): number {
  if (access === "main") {
    if (level >= 55) return 0.2;
    if (level >= 35) return 0.15;
    if (level >= 15) return 0.1;
    return 0;
  }
  if (level >= 35) return 0.15;
  if (level >= 15) return 0.1;
  return 0;
}

/** Base cast multiplied by (1 − Fast Cast). No floor is published. */
export function fastCastSeconds(base: number, fraction: number): number {
  return base * (1 - fraction);
}

/** Recast multiplied by (1 − half the casting-time cut). 20% cast is 10% recast. */
export function fastCastRecast(base: number, fraction: number): number {
  return base * (1 - fraction / 2);
}

/** Highest Magic Attack Bonus. Tier II is 40, still inside the normal subjob bracket. Tier III is 86. */
export function rdmMagicAttackBonus(level: number): number {
  if (level >= 40) return 24;
  if (level >= 20) return 20;
  return 0;
}

/** Highest Magic Defense Bonus. Tier II is 45. Tier III is 96. */
export function rdmMagicDefenseBonus(level: number): number {
  if (level >= 45) return 12;
  if (level >= 25) return 10;
  return 0;
}

/** Clear Mind MP added while resting. II needs a master-level sub. III is main only. */
export function rdmClearMind(level: number, access: "main" | "sub"): number {
  if (access === "main") {
    if (level >= 75) return 9;
    if (level >= 53) return 6;
    if (level >= 31) return 3;
    return 0;
  }
  if (level >= 31) return 3;
  return 0;
}

/** Chance to fully resist Petrify. III needs a master-level sub. IV is main only. */
export function resistPetrify(level: number, access: "main" | "sub"): number {
  if (access === "main") {
    if (level >= 70) return 0.25;
    if (level >= 50) return 0.2;
    if (level >= 30) return 0.15;
    if (level >= 10) return 0.1;
    return 0;
  }
  if (level >= 30) return 0.15;
  if (level >= 10) return 0.1;
  return 0;
}

/** Damage Limit+ added to the physical pDIF cap. Main job only. The same +26/256 as the tier I page. */
export function rdmDamageLimit(level: number, access: "main" | "sub"): number {
  if (access !== "main" || level < 60) return 0;
  return 26 / 256;
}

/** floor((24 × level + 74) / 49). 26 at 50. 38 at 75. Job points are not included. */
export function composureAccuracy(level: number): number {
  if (level <= 0) return 0;
  return Math.floor((24 * level + 74) / 49);
}

/** Tripled, and not past 30 minutes, unless the spell was already longer than that. */
export function composureDuration(baseSeconds: number, active: boolean): number {
  if (!active || baseSeconds <= 0) return baseSeconds;
  if (baseSeconds > 1800) return baseSeconds;
  return Math.min(1800, baseSeconds * 3);
}

/** Spell recast only. +25% while Composure is up. */
export function composureRecast(seconds: number, active: boolean): number {
  return active ? seconds * 1.25 : seconds;
}

/** Enspell and Enspell II damage. Composure triples both. */
export function composureEnspell(damage: number, active: boolean): number {
  return active ? damage * 3 : damage;
}

export function assertRdm(): void {
  const at1 = characterBase("hume", "RDM", 1);
  if (at1.hp !== 28 || at1.mp !== 20 || at1.str !== 6 || at1.dex !== 6 || at1.vit !== 6 || at1.agi !== 6 || at1.int !== 7 || at1.mnd !== 7 || at1.chr !== 6) {
    throw new Error(`Hume RDM 1 ${at1.hp}/${at1.mp}/${at1.str}/${at1.dex}/${at1.vit}/${at1.agi}/${at1.int}/${at1.mnd}/${at1.chr}`);
  }
  const naked = characterBase("hume", "RDM", 75);
  if (
    naked.hp !== 1046 ||
    naked.mp !== 464 ||
    naked.str !== 56 ||
    naked.dex !== 56 ||
    naked.vit !== 53 ||
    naked.agi !== 53 ||
    naked.int !== 61 ||
    naked.mnd !== 61 ||
    naked.chr !== 56
  ) {
    throw new Error(`Hume RDM 75 ${naked.hp}/${naked.mp}/${naked.str}/${naked.dex}/${naked.vit}/${naked.agi}/${naked.int}/${naked.mnd}/${naked.chr}`);
  }
  const elvaan = characterBase("elvaan", "RDM", 75);
  if (elvaan.hp !== 1167 || elvaan.mp !== 388 || elvaan.str !== 65 || elvaan.mnd !== 70 || elvaan.chr !== 56) {
    throw new Error(`Elvaan RDM 75 ${elvaan.hp}/${elvaan.mp}/${elvaan.str}/${elvaan.mnd}/${elvaan.chr}`);
  }
  if (fastCast(75, "main") !== 0.2 || fastCast(37, "sub") !== 0.15 || fastCast(14, "main") !== 0 || fastCast(49, "sub") !== 0.15) {
    throw new Error("Fast Cast");
  }
  if (fastCastSeconds(2, 0.2) !== 1.6 || fastCastRecast(10, 0.2) !== 9 || fastCastRecast(10, 0.15) !== 9.25) throw new Error("Fast Cast seconds");
  if (rdmMagicAttackBonus(75) !== 24 || rdmMagicAttackBonus(37) !== 20 || rdmMagicAttackBonus(19) !== 0) throw new Error("RDM Magic Attack Bonus");
  if (rdmMagicDefenseBonus(75) !== 12 || rdmMagicDefenseBonus(37) !== 10 || rdmMagicDefenseBonus(24) !== 0) throw new Error("RDM Magic Defense Bonus");
  if (rdmClearMind(75, "main") !== 9 || rdmClearMind(53, "main") !== 6 || rdmClearMind(37, "sub") !== 3 || rdmClearMind(49, "sub") !== 3) {
    throw new Error("RDM Clear Mind");
  }
  if (resistPetrify(75, "main") !== 0.25 || resistPetrify(37, "sub") !== 0.15 || resistPetrify(9, "main") !== 0) throw new Error("Resist Petrify");
  if (rdmDamageLimit(75, "main") !== 26 / 256 || rdmDamageLimit(37, "sub") !== 0 || rdmDamageLimit(59, "main") !== 0) throw new Error("RDM Damage Limit");
  if (composureAccuracy(50) !== 26 || composureAccuracy(75) !== 38) throw new Error("Composure accuracy");
  if (composureDuration(180, false) !== 180 || composureDuration(180, true) !== 540 || composureDuration(700, true) !== 1800 || composureDuration(1900, true) !== 1900) {
    throw new Error("Composure duration");
  }
  if (composureRecast(10, true) !== 12.5 || composureEnspell(8, true) !== 24 || composureEnspell(8, false) !== 8) throw new Error("Composure recast");
  if (rdmSkill("Sword", 75) !== 250 || rdmSkill("Dagger", 75) !== 250 || rdmSkill("Club", 75) !== 210 || rdmSkill("Archery", 75) !== 210) {
    throw new Error("RDM weapon skills");
  }
  if (rdmSkill("Enfeebling Magic", 75) !== 276 || rdmSkill("Enhancing Magic", 75) !== 256 || rdmSkill("Elemental Magic", 75) !== 230 || rdmSkill("Healing Magic", 75) !== 220) {
    throw new Error("RDM magic skills");
  }
  if (rdmSkill("Divine Magic", 75) !== 200 || rdmSkill("Dark Magic", 75) !== 200 || rdmSkill("Evasion", 75) !== 210 || rdmSkill("Parrying", 75) !== 200) {
    throw new Error("RDM other skills");
  }
  if (rdmSkill("Shield", 75) !== 189 || rdmSkill("Throwing", 75) !== 189 || rdmSkill("Staff", 75) !== 0 || rdmSkill("Great Sword", 75) !== 0) {
    throw new Error("RDM missing skills");
  }
  if (RDM_ABILITIES.some((ability) => ability.level > 75 || ability.name === "Saboteur" || ability.name === "Stymie" || ability.name === "Spontaneity")) {
    throw new Error("past-75 ability");
  }
  if (RDM_ABILITIES.some((ability) => ability.name === "Convert" && ability.level !== 40)) throw new Error("Convert level");
  const composure = RDM_ABILITIES.find((ability) => ability.name === "Composure");
  if (!composure || composure.access !== "main" || composure.level !== 50 || composure.recast !== 300 || composure.duration !== 7200) {
    throw new Error("Composure");
  }
}
