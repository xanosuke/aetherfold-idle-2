/**
 * Retail Monk toolkit through level 75. No merits and no job points.
 *
 * The job page's brackets, at a level-75 cap with no master levels:
 * abilities through Counterstance, and traits through Martial Arts IV,
 * are inside a normal subjob's reach. A support job here is level 37,
 * so Chi Blast (41), Counterstance (45), and Martial Arts IV (46) are
 * not learned. Kick Attacks I (51) and Max HP Boost V (55) need a
 * master-level sub. From 60 up is main job only.
 *
 * Hundred Fists is the level-1 SP ability and is main only.
 * Mantra, Formless Strikes, Invigorate, and Penance are Group 2 merits.
 * Focus Recast, Dodge Recast, Chakra Recast, Counter Rate, and Kick
 * Attack Rate are Group 1 merits. None of those are in this kit.
 *
 * Naked Hume Monk grades, with no Max HP Boost and no subjob:
 * level 75 is 1318 HP, 0 MP, STR 61, DEX 65, VIT 70, AGI 48, INT 44,
 * MND 56, CHR 53. The trait adds HP on the sheet. At 75 that is +430.
 *
 * The model wears Temple Attire, the artifact set: Temple Crown,
 * Cyclas, Gloves, Hose, and Gaiters. The pieces are not equipped, so
 * their stat lines are not on the sheet.
 */

import { skillCap, type SkillRank } from "./skills";
import { characterBase, type JobId } from "./stats";
import type { JobAccess } from "./blm";

export const MNK_CAP = 75;

export type MnkAbility = {
  name: string;
  level: number;
  recast: number;
  /** 0 when the page does not print a fixed duration. Boost's window is boostSeconds. */
  duration: number;
  access: JobAccess;
  effect: string;
  ce: number;
  ve: number;
};

export type MnkTrait = {
  name: string;
  level: number;
  access: JobAccess;
  effect: string;
};

export type MnkSkill = {
  name: string;
  rank: SkillRank;
};

/** Hundred Fists multiplies delay after Martial Arts and gear. It is not a Haste term. */
export const HUNDRED_FISTS_DELAY = 0.25;

/**
 * Hand-to-hand base delay after Martial Arts. The tier replaces the one
 * before it. 480 is the bare delay with no trait. A weapon's extra delay
 * is added by mnkWeaponDelay. Cesti is +48.
 */
export function martialArtsDelay(level: number): number {
  if (level >= 75) return 300;
  if (level >= 61) return 320;
  if (level >= 46) return 340;
  if (level >= 31) return 360;
  if (level >= 16) return 380;
  if (level >= 1) return 400;
  return 480;
}

/** Stored hand-to-hand delay includes the 480 base. Martial Arts replaces that base. */
export function mnkWeaponDelay(storedDelay: number, level: number): number {
  if (level <= 0) return storedDelay;
  return martialArtsDelay(level) + (storedDelay - 480);
}

/**
 * Max HP Boost. Tiers replace. The level-75 row is the wiki's "I (II)",
 * 430 HP, and it replaces the 280 from tier VI. It is not halved on a sub.
 */
export function mnkMaxHp(level: number): number {
  if (level >= 75) return 430;
  if (level >= 65) return 280;
  if (level >= 55) return 240;
  if (level >= 45) return 180;
  if (level >= 35) return 120;
  if (level >= 25) return 60;
  if (level >= 15) return 30;
  return 0;
}

/** Subtle Blow from the trait. The higher tier replaces the lower. Not the Auspice buff. */
export function mnkSubtleBlow(level: number): number {
  if (level >= 65) return 20;
  if (level >= 40) return 15;
  if (level >= 20) return 10;
  if (level >= 5) return 5;
  return 0;
}

/** Counter I is 10%. Counter II is 81 and is not in this kit. */
export function counterRate(level: number): number {
  return level >= 10 ? 0.1 : 0;
}

/**
 * Kick Attacks. Tier I is a master-level sub at 51. Tier II is main only
 * at 71. A normal subjob does not kick. The higher tier replaces the lower.
 */
export function kickRate(level: number, access: JobAccess): number {
  if (access === "main" && level >= 71) return 0.12;
  if (access !== "sub" && level >= 51) return 0.1;
  return 0;
}

/** Smite I is +25/256. Smite II is 80. Hand-to-hand or two-handed, same rule as Warrior. */
export function mnkSmiteNumer(level: number): number {
  return level >= 40 ? 25 : 0;
}

/** Damage Limit+ II is main only. The higher tier replaces the lower. */
export function mnkDamageLimit(level: number, access: JobAccess): number {
  if (access === "main" && level >= 60) return 51 / 256;
  if (level >= 30) return 26 / 256;
  return 0;
}

/** Dodge's evasion bonus. The page's level-99 check is +100, which is 99 + 1. */
export function dodgeEvasion(level: number): number {
  return level + 1;
}

/** Added to the guard rate while Dodge is up. The page calls the bonus approximate. */
export function dodgeGuard(level: number): number {
  return (level + 1) * 0.2;
}

export function focusAccuracy(level: number): number {
  return level + 1;
}

/** The page says the critical-hit bonus "seems to be" this. +20% at 99. */
export function focusCrit(level: number): number {
  return (level + 1) * 0.2;
}

/**
 * Boost's window. Delay is the FFXI delay unit (60 = 1 second).
 * At least 5 seconds. Cesti after Martial Arts VI is delay 348, so 23.2s.
 */
export function boostSeconds(delay: number): number {
  return Math.max(5, (4 * delay) / 60);
}

/**
 * Chakra's HP share. The page only prints these bands, and calls them
 * an estimate. 75 is in 74–78. A level-37 sub is in 35–38. Other levels
 * are 0 rather than a guessed curve. Gear multiplier and job points are 0.
 */
export function chakraFraction(level: number): number {
  if (level >= 74 && level <= 78) return 0.15;
  if (level >= 49 && level <= 53) return 0.1;
  if (level >= 44 && level <= 48) return 0.09;
  if (level >= 35 && level <= 38) return 0.07;
  return 0;
}

export function chakraHeal(level: number, vit: number, maxHp: number): number {
  return Math.floor(vit * 2 + maxHp * chakraFraction(level));
}

export function monkJobLevel(job: JobId, sub: JobId | null, subLevel: number, mainLevel: number): number {
  if (job === "MNK") return mainLevel;
  if (sub === "MNK") return subLevel;
  return 0;
}

export const MNK_ABILITIES: MnkAbility[] = [
  {
    name: "Hundred Fists",
    level: 1,
    recast: 3600,
    duration: 45,
    access: "main",
    effect: "Speeds up attacks. Delay −75% after weapon delay, Martial Arts, and gear, so it can pass the 80% attack-speed cap. Duration 0:45. Recast 1:00:00. Main job only. Cumulative enmity 0, volatile enmity 320. The merit accuracy and the job-point accuracy are not added. The swing timer uses the cut. TP per hit stays on the Martial Arts delay, the same way Haste does not change TP here.",
    ce: 0,
    ve: 320,
  },
  {
    name: "Boost",
    level: 5,
    recast: 60,
    duration: 23.2,
    access: "sub",
    effect: "The next auto-attack deals more damage and more TP, and it does not multi-attack. While the window is open, auto-attack delay triples. Duration is 4 × current attack delay, and at least 5 seconds. Cesti after Martial Arts VI is delay 348, so 23.2 seconds. Recast 1:00. Cumulative enmity 0, volatile enmity 320. The page prints the damage multiplier only at level 99: main 820/256 + STR/400 and +400% TP, sub 444/256 + STR/400 and +200% TP. Those are not applied at 75, and the swing is not tripled. This is not the old attack bonus, so it does not block Warcry.",
    ce: 0,
    ve: 320,
  },
  {
    name: "Dodge",
    level: 15,
    recast: 120,
    duration: 30,
    access: "sub",
    effect: "Evasion +(level + 1). At 75 that is +76. Guard rate about +(level + 1) × 0.2, +15.2 at 75. That bonus is added to the guard rate. Duration 0:30. Recast 2:00. Cumulative enmity 0, volatile enmity 320. Merit recast, job-point evasion, and Temple Gaiters are not added.",
    ce: 0,
    ve: 320,
  },
  {
    name: "Focus",
    level: 25,
    recast: 120,
    duration: 30,
    access: "sub",
    effect: "Accuracy +(level + 1). At 75 that is +76. Critical hit rate about +(level + 1) × 0.2, +15.2 at 75. Duration 0:30. Recast 2:00. Cumulative enmity 0, volatile enmity 320. Merit recast, job-point accuracy, and Temple Crown are not added.",
    ce: 0,
    ve: 320,
  },
  {
    name: "Chakra",
    level: 35,
    recast: 180,
    duration: 0,
    access: "sub",
    effect: "Restores floor(VIT × 2 + a share of max HP). The page estimates 15% at levels 74–78 and 7% at 35–38. Merit healing and job points are not added. Recast 3:00. Cumulative enmity 0, volatile enmity 320. The main job would also remove Blind, Poison, and Taint. A subjob does not. This yard has no player status list, so that removal is not applied.",
    ce: 0,
    ve: 320,
  },
  {
    name: "Chi Blast",
    level: 41,
    recast: 180,
    duration: 0,
    access: "sub",
    effect: "Spirit damage, the same family as breath. A level-37 subjob has not learned it. Recast 3:00. The published line is floor(floor(MND × a roll from 0.5 to 1) × (1 + Boost stacks × 0.5)) with no gear. Current Boost does not print a level-75 stack count, so no damage is rolled. Needs a target.",
    ce: 0,
    ve: 0,
  },
  {
    name: "Counterstance",
    level: 45,
    recast: 300,
    duration: 300,
    access: "sub",
    effect: "Counter rate +45%. Defense −50% (128/256). The counter's accuracy check still applies. Duration 5:00. Recast 5:00. Cumulative enmity 0, volatile enmity 900. A level-37 subjob has not learned it. Job-point DEX and Melee Gaiters are not added. Counter attacks are not rolled. The defense cut is.",
    ce: 0,
    ve: 900,
  },
  {
    name: "Footwork",
    level: 65,
    recast: 300,
    duration: 60,
    access: "main",
    effect: "Kick attack rate +20%. A kick's damage is the base hand-to-hand 3, plus the weapon's added damage and 20. Cesti is +1, so 24 before fSTR. Kick attack +25/256. Duration 1:00. Recast 5:00. Main job only. Cumulative enmity 0, volatile enmity 80. Job-point damage is not added. The kick is the last swing of a hand-to-hand round, and that swing is a kick.",
    ce: 0,
    ve: 80,
  },
];

export const MNK_TRAITS: MnkTrait[] = [
  { name: "Martial Arts", level: 1, access: "sub", effect: "Hand-to-hand base delay 400. The next tier replaces this. Weapon delay is added after it. Cesti is +48." },
  { name: "Subtle Blow", level: 5, access: "sub", effect: "Subtle Blow +5. The next tier replaces this. It adds to Auspice. The 50% cap is applied when TP is given." },
  { name: "Counter", level: 10, access: "sub", effect: "10% counter rate. Counter II is 81. Counter attacks are not rolled in this yard." },
  { name: "Max HP Boost", level: 15, access: "sub", effect: "+30 HP. The next tier replaces this. Not halved on a subjob." },
  { name: "Martial Arts II", level: 16, access: "sub", effect: "Hand-to-hand base delay 380. Replaces Martial Arts." },
  { name: "Max HP Boost II", level: 25, access: "sub", effect: "+60 HP. Replaces Max HP Boost." },
  { name: "Subtle Blow II", level: 20, access: "sub", effect: "Subtle Blow +10. Replaces Subtle Blow." },
  { name: "Damage Limit+", level: 30, access: "sub", effect: "Physical pDIF cap +26/256. It does not raise the rolled pDIF. It does not stack with another job's Damage Limit+." },
  { name: "Martial Arts III", level: 31, access: "sub", effect: "Hand-to-hand base delay 360. Replaces Martial Arts II." },
  { name: "Max HP Boost III", level: 35, access: "sub", effect: "+120 HP. Replaces Max HP Boost II. A level-37 subjob has this tier." },
  { name: "Subtle Blow III", level: 40, access: "sub", effect: "Subtle Blow +15. Replaces Subtle Blow II. A level-37 subjob has not learned it." },
  { name: "Smite", level: 40, access: "sub", effect: "Physical attack +25/256 with hand-to-hand or a two-handed weapon. Not ranged. Smite II is 80. Does not stack with another job's Smite." },
  { name: "Max HP Boost IV", level: 45, access: "sub", effect: "+180 HP. Replaces Max HP Boost III. A level-37 subjob has not learned it." },
  { name: "Martial Arts IV", level: 46, access: "sub", effect: "Hand-to-hand base delay 340. Replaces Martial Arts III. A level-37 subjob has not learned it." },
  { name: "Kick Attacks", level: 51, access: "master-sub", effect: "10% chance of a kick at the end of a hand-to-hand round. A support job needs master levels. Damage is the base hand-to-hand 3, not the weapon's added damage. fSTR still applies. The merit rate is not added." },
  { name: "Max HP Boost V", level: 55, access: "master-sub", effect: "+240 HP. Replaces Max HP Boost IV. A support job needs master levels." },
  { name: "Damage Limit+ II", level: 60, access: "main", effect: "Physical pDIF cap +51/256. Replaces Damage Limit+. Main job only." },
  { name: "Martial Arts V", level: 61, access: "main", effect: "Hand-to-hand base delay 320. Replaces Martial Arts IV. Main job only." },
  { name: "Subtle Blow IV", level: 65, access: "main", effect: "Subtle Blow +20. Replaces Subtle Blow III. Main job only." },
  { name: "Max HP Boost VI", level: 65, access: "main", effect: "+280 HP. Replaces Max HP Boost V. Main job only." },
  { name: "Kick Attacks II", level: 71, access: "main", effect: "12% chance of a kick at the end of a hand-to-hand round. Replaces Kick Attacks. Main job only. Damage is the base hand-to-hand 3. Footwork adds 20% to the rate and adds the weapon's damage plus 20." },
  { name: "Martial Arts VI", level: 75, access: "main", effect: "Hand-to-hand base delay 300. Replaces Martial Arts V. Main job only. Cesti then swings at 348." },
  { name: "Max HP Boost II I", level: 75, access: "main", effect: "+430 HP. The wiki prints this row as I (II). It replaces Max HP Boost VI. The tiers are not added together." },
];

/** Combat skills from the Monk job page. No rank means 0. No magic skills. */
export const MNK_SKILLS: MnkSkill[] = [
  { name: "Hand-to-Hand", rank: "A+" },
  { name: "Staff", rank: "B" },
  { name: "Club", rank: "C+" },
  { name: "Throwing", rank: "E" },
  { name: "Evasion", rank: "B+" },
  { name: "Guard", rank: "A" },
  { name: "Parrying", rank: "E" },
];

export function mnkSkill(name: string, level: number): number {
  const row = MNK_SKILLS.find((skill) => skill.name === name);
  return row ? skillCap(row.rank, level) : 0;
}

export function assertMnk(): void {
  const at1 = characterBase("hume", "MNK", 1);
  if (at1.hp !== 33 || at1.mp !== 0 || at1.str !== 7 || at1.dex !== 7 || at1.vit !== 8 || at1.agi !== 5 || at1.int !== 5 || at1.mnd !== 6 || at1.chr !== 6) {
    throw new Error(`Hume MNK 1 ${at1.hp}/${at1.str}/${at1.dex}/${at1.vit}/${at1.agi}/${at1.int}/${at1.mnd}/${at1.chr}`);
  }
  const naked = characterBase("hume", "MNK", 75);
  if (naked.hp !== 1318 || naked.mp !== 0 || naked.str !== 61 || naked.dex !== 65 || naked.vit !== 70 || naked.agi !== 48 || naked.int !== 44 || naked.mnd !== 56 || naked.chr !== 53) {
    throw new Error(`Hume MNK 75 ${naked.hp}/${naked.str}/${naked.dex}/${naked.vit}/${naked.agi}/${naked.int}/${naked.mnd}/${naked.chr}`);
  }
  if (martialArtsDelay(0) !== 480 || martialArtsDelay(1) !== 400 || martialArtsDelay(37) !== 360 || martialArtsDelay(75) !== 300) {
    throw new Error("Martial Arts");
  }
  if (mnkWeaponDelay(528, 75) !== 348 || mnkWeaponDelay(528, 0) !== 528 || mnkWeaponDelay(480, 75) !== 300) {
    throw new Error("hand delay");
  }
  if (mnkMaxHp(14) !== 0 || mnkMaxHp(15) !== 30 || mnkMaxHp(37) !== 120 || mnkMaxHp(65) !== 280 || mnkMaxHp(75) !== 430) {
    throw new Error("Max HP Boost");
  }
  if (mnkSubtleBlow(4) !== 0 || mnkSubtleBlow(19) !== 5 || mnkSubtleBlow(20) !== 10 || mnkSubtleBlow(37) !== 10 || mnkSubtleBlow(75) !== 20) throw new Error("Subtle Blow");
  if (counterRate(9) !== 0 || counterRate(75) !== 0.1) throw new Error("Counter");
  if (kickRate(75, "main") !== 0.12 || kickRate(51, "master-sub") !== 0.1 || kickRate(75, "sub") !== 0) throw new Error("Kick Attacks");
  if (mnkSmiteNumer(39) !== 0 || mnkSmiteNumer(75) !== 25) throw new Error("Smite");
  if (mnkDamageLimit(75, "main") !== 51 / 256 || mnkDamageLimit(37, "sub") !== 26 / 256 || mnkDamageLimit(60, "sub") !== 26 / 256) {
    throw new Error("Damage Limit+");
  }
  if (dodgeEvasion(75) !== 76 || Math.abs(dodgeGuard(75) - 15.2) > 1e-9 || focusAccuracy(75) !== 76 || Math.abs(focusCrit(75) - 15.2) > 1e-9) {
    throw new Error("Dodge Focus");
  }
  if (boostSeconds(348) !== 23.2 || boostSeconds(60) !== 5) throw new Error("Boost window");
  if (chakraFraction(75) !== 0.15 || chakraFraction(37) !== 0.07 || chakraHeal(75, 70, 1748) !== 402) throw new Error("Chakra");
  if (mnkSkill("Hand-to-Hand", 75) !== 276 || mnkSkill("Staff", 75) !== 250 || mnkSkill("Club", 75) !== 230) throw new Error("weapon skills");
  if (mnkSkill("Throwing", 75) !== 200 || mnkSkill("Evasion", 75) !== 256 || mnkSkill("Guard", 75) !== 269 || mnkSkill("Parrying", 75) !== 200) {
    throw new Error("defensive skills");
  }
  if (mnkSkill("Sword", 75) !== 0 || mnkSkill("Guard", 37) !== 114 || mnkSkill("Hand-to-Hand", 1) !== 6) throw new Error("skill edges");
  if (HUNDRED_FISTS_DELAY !== 0.25) throw new Error("Hundred Fists");
  const banned = ["Mantra", "Formless Strikes", "Invigorate", "Penance", "Perfect Counter", "Impetus", "Inner Strength"];
  if (MNK_ABILITIES.some((a) => banned.includes(a.name)) || MNK_TRAITS.some((t) => banned.includes(t.name))) {
    throw new Error("merit or post-75 in the level-75 kit");
  }
}
