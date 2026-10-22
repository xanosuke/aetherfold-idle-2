/**
 * Retail Black Mage toolkit through level 75. No merits and no job points.
 *
 * Trait tiers replace each other. The numbers are the trait pages:
 * Magic Attack Bonus 20 / 24 / 28 / 32, Clear Mind 3 / 6 / 9 / 12 / 15 MP
 * per tick while resting, Conserve MP 25%, Elemental Celerity −10% /
 * −15% / −20% casting time, Magic Burst Bonus +5% / +7% / +9%.
 *
 * The job page's brackets, at a level-75 cap with no master levels:
 * through 45 a normal subjob can use the trait. 50–58 need a
 * master-level sub. 60 and up are main job only. Manafont sits above
 * the subjob bracket. Elemental Seal is inside it.
 */

import { skillCap, type SkillRank } from "./skills";
import { characterBase } from "./stats";

export type JobAccess = "sub" | "master-sub" | "main";

export type BlmAbility = {
  name: string;
  level: number;
  recast: number;
  duration: number;
  access: JobAccess;
  effect: string;
};

export type BlmTrait = {
  name: string;
  level: number;
  access: JobAccess;
  effect: string;
};

export type BlmSkill = {
  name: string;
  rank: SkillRank;
};

/**
 * Manafont recast is one hour and the duration is one minute, the same
 * shape as the other one-hour abilities. Spells cost no MP. While it is up,
 * a hit cannot break a cast. Moving, Stun, and Silence still can.
 * Elemental Seal is the ability page:
 * recast 10:00, duration 1:00 or the next completed spell. An interrupt
 * keeps it. Cumulative enmity is 0 and volatile enmity is 80. Its
 * magic-accuracy bonus is only described as on the order of +256, so it
 * is not applied as a flat number. Meteor, merits, and Laevateinn are
 * not in this kit.
 */
export const BLM_ABILITIES: BlmAbility[] = [
  {
    name: "Manafont",
    level: 1,
    recast: 3600,
    duration: 60,
    access: "main",
    effect: "Spells cost no MP. A hit cannot break the cast while this is up. Moving, Stun, and Silence still can. Main job only. Recast 60:00. Duration 1:00. Cumulative enmity 0, volatile enmity 0.",
  },
  {
    name: "Elemental Seal",
    level: 15,
    recast: 600,
    duration: 60,
    access: "sub",
    effect: "The next completed spell wears it off. An interrupted cast keeps it. Recast 10:00. Duration 1:00 or that spell. Cumulative enmity 0, volatile enmity 80. The accuracy bonus is only published as on the order of +256, so no flat bonus is added.",
  },
];

export const BLM_TRAITS: BlmTrait[] = [
  { name: "Magic Attack Bonus", level: 10, access: "sub", effect: "Magic Attack Bonus +20. The next tier replaces this." },
  { name: "Clear Mind", level: 15, access: "sub", effect: "+3 MP per tick while resting. The next tier replaces this." },
  { name: "Conserve MP", level: 20, access: "sub", effect: "25% chance to lower the MP cost. On a proc the cost is floor(cost × N / 16), and N is an even roll from 8 to 15." },
  { name: "Clear Mind II", level: 30, access: "sub", effect: "+6 MP per tick while resting. Replaces Clear Mind." },
  { name: "Magic Attack Bonus II", level: 30, access: "sub", effect: "Magic Attack Bonus +24. Replaces the earlier tier." },
  { name: "Clear Mind III", level: 45, access: "sub", effect: "+9 MP per tick while resting. Replaces Clear Mind II." },
  { name: "Mag. Burst Bonus", level: 45, access: "sub", effect: "Magic burst damage +5%. The next tier replaces this." },
  { name: "Magic Attack Bonus III", level: 50, access: "master-sub", effect: "Magic Attack Bonus +28. A support job needs master levels. Main job receives it." },
  { name: "Elemental Celerity", level: 50, access: "master-sub", effect: "Elemental spell casting time −10%. A support job needs master levels." },
  { name: "Mag. Burst Bonus II", level: 58, access: "master-sub", effect: "Magic burst damage +7%. A support job needs master levels." },
  { name: "Clear Mind IV", level: 60, access: "main", effect: "+12 MP per tick while resting. Main job only." },
  { name: "Elemental Celerity II", level: 60, access: "main", effect: "Elemental spell casting time −15%. Main job only. Replaces the earlier tier." },
  { name: "Magic Attack Bonus IV", level: 70, access: "main", effect: "Magic Attack Bonus +32. Main job only. Replaces the earlier tier." },
  { name: "Elemental Celerity III", level: 70, access: "main", effect: "Elemental spell casting time −20%. Main job only." },
  { name: "Mag. Burst Bonus III", level: 71, access: "main", effect: "Magic burst damage +9%. Main job only." },
  { name: "Clear Mind V", level: 75, access: "main", effect: "+15 MP per tick while resting. Main job only." },
];

/** Combat and magic skills from the Black Mage job page. No rank means 0. */
export const BLM_SKILLS: BlmSkill[] = [
  { name: "Staff", rank: "B-" },
  { name: "Club", rank: "C+" },
  { name: "Dagger", rank: "D" },
  { name: "Scythe", rank: "E" },
  { name: "Throwing", rank: "D" },
  { name: "Evasion", rank: "E" },
  { name: "Elemental Magic", rank: "A+" },
  { name: "Dark Magic", rank: "A" },
  { name: "Enfeebling Magic", rank: "C+" },
  { name: "Enhancing Magic", rank: "E" },
];

export function blmSkill(name: string, level: number): number {
  const row = BLM_SKILLS.find((skill) => skill.name === name);
  return row ? skillCap(row.rank, level) : 0;
}

/** Highest Magic Attack Bonus tier. A normal subjob stops before the level-50 tier. */
export function magicAttackBonus(level: number, access: "main" | "sub"): number {
  if (access === "main") {
    if (level >= 70) return 32;
    if (level >= 50) return 28;
    if (level >= 30) return 24;
    if (level >= 10) return 20;
    return 0;
  }
  if (level >= 30) return 24;
  if (level >= 10) return 20;
  return 0;
}

/** Clear Mind bonus added to the 12 MP resting base. Tiers replace. IV and V are main only. */
export function clearMind(level: number, access: "main" | "sub"): number {
  if (access === "main") {
    if (level >= 75) return 15;
    if (level >= 60) return 12;
    if (level >= 45) return 9;
    if (level >= 30) return 6;
    if (level >= 15) return 3;
    return 0;
  }
  if (level >= 45) return 9;
  if (level >= 30) return 6;
  if (level >= 15) return 3;
  return 0;
}

/** Conserve MP proc chance. Tier II is level 76 and is not in this kit. */
export function conserveMp(level: number): number {
  return level >= 20 ? 0.25 : 0;
}

/** Casting-time removed, as a fraction. 0.2 is −20%. Subjobs need master levels for every tier. */
export function celerity(level: number, access: "main" | "sub"): number {
  if (access !== "main") return 0;
  if (level >= 70) return 0.2;
  if (level >= 60) return 0.15;
  if (level >= 50) return 0.1;
  return 0;
}

/** Magic Burst Bonus trait, as a fraction. 0.09 is +9%. */
export function magicBurstBonus(level: number, access: "main" | "sub"): number {
  if (access === "main") {
    if (level >= 71) return 0.09;
    if (level >= 58) return 0.07;
    if (level >= 45) return 0.05;
    return 0;
  }
  if (level >= 45) return 0.05;
  return 0;
}

export function assertBlm(): void {
  const naked = characterBase("hume", "BLM", 75);
  if (
    naked.hp !== 895 ||
    naked.mp !== 616 ||
    naked.str !== 48 ||
    naked.dex !== 61 ||
    naked.vit !== 48 ||
    naked.agi !== 61 ||
    naked.int !== 70 ||
    naked.mnd !== 53 ||
    naked.chr !== 56
  ) {
    throw new Error("Hume BLM 75");
  }
  const supported = characterBase("hume", "BLM", 75, "WAR", 37);
  if (supported.hp !== 1061 || supported.mp !== 616 || supported.str !== 59 || supported.int !== 75 || supported.mnd !== 58) {
    throw new Error("Hume BLM/WAR 37");
  }
  if (magicAttackBonus(75, "main") !== 32 || magicAttackBonus(37, "sub") !== 24 || magicAttackBonus(9, "main") !== 0) {
    throw new Error("Magic Attack Bonus");
  }
  if (clearMind(75, "main") !== 15 || clearMind(37, "sub") !== 6 || clearMind(49, "sub") !== 9) {
    throw new Error("Clear Mind");
  }
  if (conserveMp(19) !== 0 || conserveMp(75) !== 0.25) throw new Error("Conserve MP");
  if (celerity(75, "main") !== 0.2 || celerity(49, "sub") !== 0) throw new Error("Elemental Celerity");
  if (magicBurstBonus(75, "main") !== 0.09 || magicBurstBonus(37, "sub") !== 0 || magicBurstBonus(45, "sub") !== 0.05) {
    throw new Error("Magic Burst Bonus");
  }
  if (blmSkill("Staff", 75) !== 240 || blmSkill("Elemental Magic", 75) !== 276 || blmSkill("Sword", 75) !== 0) {
    throw new Error("BLM skill caps");
  }
  if (BLM_ABILITIES.some((ability) => ability.name === "Mana Wall" || ability.level > 75)) {
    throw new Error("past-75 ability");
  }
}
