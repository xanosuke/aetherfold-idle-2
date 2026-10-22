/**
 * Retail Warrior toolkit through level 75. No merits and no job points.
 *
 * Job abilities and traits are the current BG-Wiki Warrior page, with the
 * effect numbers taken from each ability or trait page. Warrior's Charge,
 * Tomahawk, Savagery, and Aggressive Aim are Group 2 merits, so they are
 * not part of this kit. Merit stat bonuses are not included.
 *
 * Resist Virus is level 15 on the current Warrior job page and in the
 * original retail trait list. The trait page still says Warrior 5; this
 * kit follows the job page.
 *
 * Subjob: abilities through Aggressor, and traits through level 45, are
 * available to a normal subjob. Traits at 50–58 need a master-level sub.
 * Retaliation and traits from 65 up are main job only.
 *
 * Combat skills are always the cap for the job's current level. There are
 * no skill-ups. warSkill is the number attack, accuracy, and evasion use.
 */

import { skillCap, type SkillRank } from "./skills";

export const WAR_CAP = 75;

export type WarAccess = "sub" | "master-sub" | "main";

export type WarAbility = {
  name: string;
  level: number;
  recast: number;
  duration: number;
  access: WarAccess;
  /** Retail description plus the base numbers. No merit or job-point ranks. */
  effect: string;
  /** Cumulative and volatile enmity added on a successful use. */
  ce: number;
  ve: number;
};

export type WarTrait = {
  name: string;
  level: number;
  access: WarAccess;
  effect: string;
};

export type WarSkill = {
  name: string;
  rank: SkillRank;
};

/** floor((level / 4) + 4.75) / 256. At 75 that is 23/256. */
export function warcryFraction(level: number): number {
  return Math.floor(level / 4 + 4.75) / 256;
}

/**
 * Berserk's attack bonus. Base 64/256, then +5/256 at 50, 60, and 70.
 * At 75 that is 79/256. Defense stays a flat −25%.
 */
export function berserkAttackFraction(level: number): number {
  let numer = 64;
  for (const step of [50, 60, 70]) if (level >= step) numer += 5;
  return numer / 256;
}

/** Defender's defense bonus uses the same steps. The attack penalty stays −25%. */
export function defenderDefenseFraction(level: number): number {
  return berserkAttackFraction(level);
}

/** Flat HP from Max HP Boost. Tier III (+120) is the level-75 tier. */
export function maxHpBoost(level: number): number {
  if (level >= 70) return 120;
  if (level >= 50) return 60;
  if (level >= 30) return 30;
  return 0;
}

/** Double Attack proc chance. 0 before the trait. Tiers replace, they do not stack. */
export function doubleAttackRate(level: number): number {
  if (level >= 75) return 0.14;
  if (level >= 50) return 0.12;
  if (level >= 25) return 0.1;
  return 0;
}

/**
 * Defense Bonus. The recorded level-10 Warrior status screen adds this as
 * flat defense (+10), and the wiki prints 10 and 22 with no percent sign.
 * The higher tier replaces the lower one.
 */
export function defenseBonus(level: number): number {
  if (level >= 45) return 22;
  if (level >= 10) return 10;
  return 0;
}

/**
 * Attack Bonus. Same unlabeled wiki values as Defense Bonus, applied to
 * attack and ranged attack. The higher tier replaces the lower one.
 */
export function attackBonus(level: number): number {
  if (level >= 65) return 22;
  if (level >= 30) return 10;
  return 0;
}

/** Smite's attack bonus, in /256. The higher tier replaces the lower one. Hand-to-hand or two-handed only. Not ranged. */
export function smiteNumer(level: number): number {
  if (level >= 65) return 38;
  if (level >= 35) return 25;
  return 0;
}

export function smiteApplies(kind: string, grip?: string): boolean {
  return kind === "Hand-to-Hand" || grip === "two";
}

/** Damage Limit+ I adds this to the physical pDIF cap. It does not raise the rolled pDIF itself. */
export function damageLimitBonus(level: number): number {
  return level >= 40 ? 26 / 256 : 0;
}

/** Fencer's TP bonus and critical-hit rate, in percentage points. Higher tier replaces the lower. */
export function fencerBonus(level: number): { tp: number; crit: number } {
  if (level >= 71) return { tp: 400, crit: 7 };
  if (level >= 58) return { tp: 300, crit: 5 };
  if (level >= 45) return { tp: 200, crit: 3 };
  return { tp: 0, crit: 0 };
}

/**
 * Main hand only: a one-handed weapon, offhand empty or a shield.
 * A 2010 test on Talk:Fencer: sword, sword and shield, but not sword and sword.
 * Hand-to-hand and two-handed weapons do not qualify.
 */
export function fencerApplies(
  main: { kind: string; grip?: string } | null,
  sub: { kind: string } | null,
): boolean {
  if (!main || main.grip === "two" || main.kind === "Hand-to-Hand") return false;
  if (sub && sub.kind !== "Shield") return false;
  return true;
}

/** Chance to fully resist Disease and Plague. Tiers replace. 0 before level 15. */
export function resistVirusChance(level: number): number {
  if (level >= 70) return 0.25;
  if (level >= 55) return 0.2;
  if (level >= 35) return 0.15;
  if (level >= 15) return 0.1;
  return 0;
}

export function virusResisted(level: number, ailment: string, roll: number): boolean {
  if (ailment !== "Disease" && ailment !== "Plague") return false;
  return roll < resistVirusChance(level);
}

/** floor(base * (256 + numer) / 256). Percent bonuses are summed in numer first. */
export function scale256(base: number, numer: number): number {
  return Math.floor((base * (256 + numer)) / 256);
}

/** 25% is 64/256. Berserk's defense penalty and Defender's attack penalty stay here. */
export const PENALTY_25 = 64;

/** Each ability plays its own animation. The motion name is the ability name. */
export const WAR_ABILITIES: WarAbility[] = [
  {
    name: "Mighty Strikes",
    level: 1,
    recast: 3600,
    duration: 45,
    access: "main",
    effect: "Turns all melee attacks into critical hits.",
    ce: 0,
    ve: 320,
  },
  {
    name: "Provoke",
    level: 5,
    recast: 30,
    duration: 0,
    access: "sub",
    effect: "Goads a target within 17.8'. Cumulative enmity 1, volatile enmity 1800.",
    ce: 1,
    ve: 1800,
  },
  {
    name: "Berserk",
    level: 15,
    recast: 300,
    duration: 180,
    access: "sub",
    effect: "Attack and ranged attack +25% (64/256), plus 5/256 at 50, 60, and 70 (79/256 at 75). Defense −25% (64/256). Volatile enmity 80.",
    ce: 0,
    ve: 80,
  },
  {
    name: "Defender",
    level: 25,
    recast: 180,
    duration: 180,
    access: "sub",
    effect: "Defense uses the same steps as Berserk's attack (79/256 at 75). Attack and ranged attack −25% (64/256). Volatile enmity 80.",
    ce: 0,
    ve: 80,
  },
  {
    name: "Warcry",
    level: 35,
    recast: 300,
    duration: 30,
    access: "sub",
    effect: "Party attack bonus floor((level ÷ 4) + 4.75) / 256. At 75 that is 23/256. Radius 13.9'. Does not stack with Boost. Volatile enmity 320.",
    ce: 0,
    ve: 320,
  },
  {
    name: "Aggressor",
    level: 45,
    recast: 300,
    duration: 180,
    access: "sub",
    effect: "Accuracy +25. Evasion −25. No ranged accuracy unless Aggressive Aim is merited, which this kit does not include. Volatile enmity 80.",
    ce: 0,
    ve: 80,
  },
  {
    name: "Retaliation",
    level: 60,
    recast: 180,
    duration: 180,
    access: "main",
    effect: "Counterattacks without negating the hit, and grants TP. Chance follows main-hand delay: 50% at delay 200, 20% at delay 999. A one-handed sword is about 49%, a two-handed weapon about 40%. Must be facing the attacker. No proc on a blocked hit. Movement −14%, added apart from gear. Does not generate enmity.",
    ce: 0,
    ve: 0,
  },
];

export const WAR_TRAITS: WarTrait[] = [
  { name: "Defense Bonus", level: 10, access: "sub", effect: "Defense +10. The next tier replaces this." },
  { name: "Defense Bonus II", level: 45, access: "sub", effect: "Defense +22. Replaces Defense Bonus." },
  { name: "Resist Virus", level: 15, access: "sub", effect: "10% chance to fully resist Disease and Plague." },
  { name: "Resist Virus II", level: 35, access: "sub", effect: "15% chance to fully resist Disease and Plague." },
  { name: "Resist Virus III", level: 55, access: "master-sub", effect: "20% chance to fully resist Disease and Plague." },
  { name: "Resist Virus IV", level: 70, access: "main", effect: "25% chance to fully resist Disease and Plague." },
  { name: "Double Attack", level: 25, access: "sub", effect: "10% chance of an extra melee swing." },
  { name: "Double Attack II", level: 50, access: "master-sub", effect: "12% chance of an extra melee swing." },
  { name: "Double Attack III", level: 75, access: "main", effect: "14% chance of an extra melee swing." },
  { name: "Max HP Boost", level: 30, access: "sub", effect: "+30 HP." },
  { name: "Max HP Boost II", level: 50, access: "master-sub", effect: "+60 HP." },
  { name: "Max HP Boost III", level: 70, access: "main", effect: "+120 HP." },
  { name: "Attack Bonus", level: 30, access: "sub", effect: "Attack and ranged attack +10. The next tier replaces this." },
  { name: "Attack Bonus II", level: 65, access: "main", effect: "Attack and ranged attack +22. Replaces Attack Bonus." },
  { name: "Smite", level: 35, access: "sub", effect: "Physical attack +25/256 with hand-to-hand or a two-handed weapon. Not ranged. The next tier replaces this." },
  { name: "Smite II", level: 65, access: "main", effect: "Physical attack +38/256 with hand-to-hand or a two-handed weapon. Not ranged. Replaces Smite." },
  { name: "Damage Limit+", level: 40, access: "sub", effect: "Physical pDIF cap +26/256. Does not raise the rolled pDIF, only the cap." },
  { name: "Fencer", level: 45, access: "sub", effect: "Main hand only: one-handed weapon, offhand empty or a shield. Not while dual wielding. +200 TP bonus, critical hit rate +3%." },
  { name: "Fencer II", level: 58, access: "master-sub", effect: "Main hand only: one-handed weapon, offhand empty or a shield. Not while dual wielding. +300 TP bonus, critical hit rate +5%." },
  { name: "Fencer III", level: 71, access: "main", effect: "Main hand only: one-handed weapon, offhand empty or a shield. Not while dual wielding. +400 TP bonus, critical hit rate +7%." },
];

/**
 * Warrior combat skills. The fight uses skillCap(rank, level): always the
 * cap, never a partial skill. Katana and Great Katana are not on this list,
 * so those weapons contribute 0.
 */
export const WAR_SKILLS: WarSkill[] = [
  { name: "Great Axe", rank: "A+" },
  { name: "Axe", rank: "A" },
  { name: "Great Sword", rank: "B+" },
  { name: "Scythe", rank: "B+" },
  { name: "Sword", rank: "B" },
  { name: "Staff", rank: "B" },
  { name: "Club", rank: "B-" },
  { name: "Dagger", rank: "B-" },
  { name: "Polearm", rank: "B-" },
  { name: "Hand-to-Hand", rank: "D" },
  { name: "Archery", rank: "D" },
  { name: "Marksmanship", rank: "D" },
  { name: "Throwing", rank: "D" },
  { name: "Shield", rank: "C+" },
  { name: "Evasion", rank: "C" },
  { name: "Parrying", rank: "C-" },
];

/** Combat skill for this job at this level. No rank means 0. No skill-ups. */
export function warSkill(name: string, level: number): number {
  const row = WAR_SKILLS.find((skill) => skill.name === name);
  return row ? skillCap(row.rank, level) : 0;
}

export function assertWar(): void {
  if (warcryFraction(75) !== 23 / 256) throw new Error("Warcry at 75");
  if (warcryFraction(35) !== 13 / 256) throw new Error("Warcry at 35");
  if (berserkAttackFraction(75) !== 79 / 256) throw new Error("Berserk at 75");
  if (maxHpBoost(75) !== 120) throw new Error("Max HP Boost at 75");
  if (doubleAttackRate(1) !== 0 || doubleAttackRate(75) !== 0.14) throw new Error("Double Attack");
  if (defenseBonus(1) !== 0 || defenseBonus(10) !== 10 || defenseBonus(75) !== 22) throw new Error("Defense Bonus");
  if (attackBonus(1) !== 0 || attackBonus(30) !== 10 || attackBonus(75) !== 22) throw new Error("Attack Bonus");
  if (warSkill("Sword", 1) !== 5 || warSkill("Great Axe", 1) !== 6 || warSkill("Hand-to-Hand", 1) !== 4) {
    throw new Error("level 1 skill caps");
  }
  if (warSkill("Sword", 75) !== 250 || warSkill("Axe", 75) !== 269 || warSkill("Evasion", 75) !== 225) {
    throw new Error("level 75 skill caps");
  }
  if (warSkill("Katana", 1) !== 0 || warSkill("Great Katana", 75) !== 0) throw new Error("no katana rank");
  if (smiteNumer(1) !== 0 || smiteNumer(35) !== 25 || smiteNumer(75) !== 38) throw new Error("Smite");
  if (damageLimitBonus(1) !== 0 || damageLimitBonus(75) !== 26 / 256) throw new Error("Damage Limit+");
  if (fencerBonus(75).tp !== 400 || fencerBonus(75).crit !== 7 || fencerBonus(44).tp !== 0) throw new Error("Fencer");
  if (!fencerApplies({ kind: "Sword" }, null) || !fencerApplies({ kind: "Sword" }, { kind: "Shield" })) throw new Error("Fencer shield");
  if (fencerApplies({ kind: "Sword" }, { kind: "Dagger" })) throw new Error("Fencer dual wield");
  if (fencerApplies({ kind: "Great Sword", grip: "two" }, null)) throw new Error("Fencer two-hand");
  if (resistVirusChance(1) !== 0 || resistVirusChance(75) !== 0.25) throw new Error("Resist Virus");
  if (!virusResisted(75, "Disease", 0.24) || virusResisted(75, "Disease", 0.25) || virusResisted(75, "Poison", 0)) {
    throw new Error("virus check");
  }
  if (scale256(350, 79) !== 458) throw new Error("scale256");
  if (WAR_ABILITIES.some((a) => a.name === "Tomahawk" || a.name === "Warrior's Charge")) {
    throw new Error("merit ability in the level-75 kit");
  }
  if (WAR_TRAITS.some((t) => t.name === "Savagery" || t.name === "Aggressive Aim")) {
    throw new Error("merit trait in the level-75 kit");
  }
}
