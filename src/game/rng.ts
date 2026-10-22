/**
 * Retail Ranger toolkit through level 75. No merits and no job points.
 *
 * The job page's brackets, at a level-75 cap with no master levels:
 * Sharpshot, Scavenge, Camouflage, Barrage, and Shadowbind are inside a
 * normal subjob's reach. A support job here is level 37, so Shadowbind (40)
 * is not learned. Unlimited Shot is 51 and needs a master-level sub.
 * Eagle Eye Shot and Velocity Shot are main only. Flashy Shot and Stealth
 * Shot are merits and stay out. Snapshot is the group-2 merit. This yard
 * has no merit screen, so a level-75 Ranger main is treated as five ranks:
 * 2% aiming delay each, 10% total. A subjob has no merits. Double Shot and
 * everything after it are past 75. None of those other merits are in this kit.
 *
 * Naked Hume Ranger grades, with no subjob: level 75 is 971 HP, 0 MP,
 * STR 53, DEX 56, VIT 56, AGI 70, INT 53, MND 56, CHR 53.
 *
 * The model wears Hunter's Attire, the artifact set: Beret, Jerkin,
 * Bracers, Braccae, and Socks. Brown leather and forest green, with a
 * foliaged beret. The pieces are not equipped, so their stat lines are
 * not on the sheet. The bow in the range slot is a Shortbow.
 */

import { skillCap, type SkillRank } from "./skills";
import { characterBase, type JobId } from "./stats";
import type { JobAccess } from "./blm";

export const RNG_CAP = 75;

/** Sharpshot. Both main and sub are +40 ranged accuracy. No job points, so no ranged attack. */
export const SHARPSHOT_ACC = 40;

/**
 * Velocity Shot's published "about 15%".
 * 15% of the /256 attack term is 38.4, and the other percent terms in this yard floor through that scale.
 * Aiming delay is a separate −15%. Melee delay is +15%. Gear and job points are not added.
 */
export const VELOCITY_ATTACK = 38;
export const VELOCITY_AIM = 0.85;
export const VELOCITY_SLOW = 1.15;

/** Eagle Eye Shot is a fivefold ranged attack. The page does not print a separate accuracy bonus. */
export const EAGLE_EYE_FTP = 5;

/** Shadowbind's base duration. Job points and Hunter's Bracers are not equipped. */
export const SHADOWBIND_SECONDS = 30;

/** Shadowbind and Eagle Eye Shot reach. Archery's auto-attack range is the same 25. */
export const SHADOWBIND_RANGE = 25;
export const EAGLE_EYE_RANGE = 25;

export type RngAbility = {
  name: string;
  level: number;
  recast: number;
  duration: number;
  access: JobAccess;
  effect: string;
  ce: number;
  ve: number;
};

export type RngTrait = {
  name: string;
  level: number;
  access: JobAccess;
  effect: string;
};

export type RngSkill = {
  name: string;
  rank: SkillRank;
};

export function rngJobLevel(job: JobId, sub: JobId | null, subLevel: number, mainLevel: number): number {
  if (job === "RNG") return mainLevel;
  if (sub === "RNG") return subLevel;
  return 0;
}

/**
 * Barrage's shot count from Ranger level, with no gear.
 * 4 at 30, 5 at 50, 6 at 75, 7 at 90. A level-37 sub stays at 4.
 */
export function barrageShots(level: number): number {
  if (level >= 90) return 7;
  if (level >= 75) return 6;
  if (level >= 50) return 5;
  if (level >= 30) return 4;
  return 0;
}

/** Camouflage lasts somewhere from 30 seconds to 4 minutes. Hunter's Jerkin is not equipped. */
export function camouflageSeconds(roll: number): number {
  const t = Math.min(1, Math.max(0, roll));
  return 30 + Math.min(210, Math.floor(t * 211));
}

/**
 * Accuracy Bonus. The higher tier replaces the lower.
 * Physical attacks include ranged accuracy. I 10, II 22, III 35, IV 48.
 * III needs a master-level sub. IV is under the main-only bracket.
 */
export function accuracyBonus(level: number, access: JobAccess): number {
  if (access === "main" && level >= 70) return 48;
  if (access !== "sub" && level >= 50) return 35;
  if (level >= 30) return 22;
  if (level >= 10) return 10;
  return 0;
}

/**
 * Rapid Shot. The page prints the rates with a tilde.
 * I about 25% at 15. II about 30% at 71, and that tier sits in the main-only bracket.
 * A proc cuts that shot's delay by 2% to 50%, flat across the span.
 */
export function rapidShotRate(level: number, access: JobAccess): number {
  if (access === "main" && level >= 71) return 0.3;
  if (level >= 15) return 0.25;
  return 0;
}

/** 1 when it does not proc. Otherwise 0.50 through 0.98 of the aim. */
export function rapidShotFactor(rate: number, proc: number, cut: number): number {
  if (rate <= 0 || proc >= rate) return 1;
  const reduced = 0.02 + Math.min(1, Math.max(0, cut)) * 0.48;
  return 1 - reduced;
}

/**
 * Snapshot. Ranger group-2 merit. Each rank cuts aiming delay by 2%.
 * Five ranks are 10%. Merits open at 75, and only on the main job.
 * The delay formula caps every Snapshot source at 70%. This does not
 * change TP per hit, and it is not inside Rapid Shot or Velocity Shot.
 */
export function snapshotRate(level: number, access: JobAccess): number {
  if (access === "main" && level >= 75) return 0.1;
  return 0;
}

/**
 * Recycle. Ammunition is not spent in this yard, so the trait is not rolled.
 * I 10% at 20, II 20% at 35, III 30% at 50 (master sub).
 */
export function recycleRate(level: number, access: JobAccess): number {
  if (access !== "sub" && level >= 50) return 0.3;
  if (level >= 35) return 0.2;
  if (level >= 20) return 0.1;
  return 0;
}

/** Damage Limit+ II is main only. The higher tier replaces the lower. */
export function rngDamageLimit(level: number, access: JobAccess): number {
  if (access === "main" && level >= 60) return 51 / 256;
  if (level >= 30) return 26 / 256;
  return 0;
}

/**
 * Dead Aim raises ranged critical-hit damage. It does not raise the crit rate.
 * I 10% at 50 (master sub), II 20% at 60 (main), III 30% at 70 (main).
 */
export function deadAim(level: number, access: JobAccess): number {
  if (access !== "main") {
    if (access === "master-sub" && level >= 50) return 0.1;
    return 0;
  }
  if (level >= 70) return 0.3;
  if (level >= 60) return 0.2;
  if (level >= 50) return 0.1;
  return 0;
}

export const RNG_ABILITIES: RngAbility[] = [
  {
    name: "Eagle Eye Shot",
    level: 1,
    recast: 3600,
    duration: 0,
    access: "main",
    effect: "One ranged attack at five times the damage. It can critical hit. The page does not print an accuracy bonus, so the ranged hit rate is used. Blink and shadows are not in this yard. The page does not print the enmity numbers. It is described as low enmity, so none are added. Damage still grants enmity. Recast 1:00:00. Main job only. The one-hour ability. Job points are not added.",
    ce: 0,
    ve: 0,
  },
  {
    name: "Velocity Shot",
    level: 45,
    recast: 60,
    duration: 7200,
    access: "main",
    effect: "Ranged attack +38/256, about 15%. Melee attack −38/256. Ranged aiming delay −15%. Melee delay +15%. Snapshot and Rapid Shot stay separate, so this is not inside the Snapshot cap. No gear and no job points. Duration 2:00:00. Recast 1:00. Main job only. Cumulative enmity 1, volatile enmity 300.",
    ce: 1,
    ve: 300,
  },
  {
    name: "Sharpshot",
    level: 1,
    recast: 300,
    duration: 60,
    access: "sub",
    effect: "Ranged accuracy +40 for main or sub. The ranged hit cap becomes 99% instead of 95%. Distance correction is not modeled, so that penalty is not here to remove. Hunter's Braccae are not equipped. No job points, so no ranged attack. Duration 0:01:00. Recast 0:05:00. Cumulative enmity 1, volatile enmity 600.",
    ce: 1,
    ve: 600,
  },
  {
    name: "Scavenge",
    level: 10,
    recast: 300,
    duration: 0,
    access: "sub",
    effect: "Searches for spent ammunition. Nothing has been spent, so it finds nothing and the recast still starts. Hunter's Socks are not equipped. The page does not print enmity. Recast 0:05:00.",
    ce: 0,
    ve: 0,
  },
  {
    name: "Camouflage",
    level: 20,
    recast: 300,
    duration: 30,
    access: "sub",
    effect: "Harder to detect. The yard's detect radius is not given a Camouflage number, so it is not changed. Ranged-attack enmity is said to fall, and the page does not print the cut, so enmity is not changed. A ranged weapon skill or a ranged job ability ends it. A normal ranged attack's chance to end it is not printed, so the shot does not. Duration is 0:30 to 4:00. Hunter's Jerkin is not equipped. Recast 0:05:00. Cumulative enmity 1, volatile enmity 80.",
    ce: 1,
    ve: 80,
  },
  {
    name: "Barrage",
    level: 30,
    recast: 300,
    duration: 60,
    access: "sub",
    effect: "The next ranged attack fires several shots. Level 30 is 4, level 50 is 5, level 75 is 6. A level-37 subjob fires 4. It does not multiply a weapon skill. It overwrites Unlimited Shot, and Unlimited Shot overwrites it. Duration 0:01:00 or that shot. Recast 0:05:00. Cumulative enmity 1, volatile enmity 600. Gear is not added.",
    ce: 1,
    ve: 600,
  },
  {
    name: "Shadowbind",
    level: 40,
    recast: 300,
    duration: 0,
    access: "sub",
    effect: "Binds the target for 30 seconds. It is not a ranged attack. It can miss, and the check is the ranged hit rate. The subjob penalty is not a printed number, so none is added. Direct damage can wear the bind off. A level-37 subjob has not learned it. Recast 0:05:00. Cumulative enmity 1, volatile enmity 800. It ends Camouflage.",
    ce: 1,
    ve: 800,
  },
  {
    name: "Unlimited Shot",
    level: 51,
    recast: 180,
    duration: 60,
    access: "master-sub",
    effect: "The next ranged attack would spend no ammunition. This yard does not spend ammunition, so the shot is unchanged. It wears off on a hit, not on a miss, or after 60 seconds. It overwrites Barrage. A normal subjob has not learned it. Recast 0:03:00. Cumulative enmity 1, volatile enmity 300.",
    ce: 1,
    ve: 300,
  },
];

export const RNG_TRAITS: RngTrait[] = [
  { name: "Wide Scan III", level: 1, access: "sub", effect: "Widens the scan. This yard has no scan, so it is not rolled." },
  { name: "Alertness", level: 5, access: "sub", effect: "Improves detection of hidden enemies. Nothing here is hidden, so it is not rolled." },
  { name: "Accuracy Bonus", level: 10, access: "sub", effect: "Accuracy +10, melee and ranged. The next tier replaces this." },
  { name: "Rapid Shot", level: 15, access: "sub", effect: "About 25% chance to cut that shot's delay by 2% to 50%. The next tier replaces this." },
  { name: "Resist Poison", level: 20, access: "sub", effect: "Improves resistance to poison. The tier page did not print a percent, so it is not rolled. Nothing here poisons you." },
  { name: "Recycle", level: 20, access: "sub", effect: "10% chance a ranged attack would not spend ammunition. Ammunition is not spent here, so it is not rolled." },
  { name: "Wide Scan IV", level: 20, access: "sub", effect: "Replaces Wide Scan III. Not rolled here." },
  { name: "Accuracy Bonus II", level: 30, access: "sub", effect: "Accuracy +22. Replaces Accuracy Bonus. A level-37 subjob has this tier." },
  { name: "Damage Limit+", level: 30, access: "sub", effect: "Physical pDIF cap +26/256. It does not raise the rolled pDIF. It does not stack with another job's Damage Limit+." },
  { name: "Recycle II", level: 35, access: "sub", effect: "20%. Replaces Recycle. A level-37 subjob has this tier. Not rolled here." },
  { name: "Resist Poison II", level: 40, access: "sub", effect: "Replaces Resist Poison. The percent is not printed, so it is not rolled. A level-37 subjob has not learned it." },
  { name: "Wide Scan V", level: 40, access: "sub", effect: "Replaces Wide Scan IV. Not rolled here. A level-37 subjob has not learned it." },
  { name: "Accuracy Bonus III", level: 50, access: "master-sub", effect: "Accuracy +35. Replaces Accuracy Bonus II. A support job needs master levels." },
  { name: "Dead Aim", level: 50, access: "master-sub", effect: "Ranged critical damage +10%. It does not change the critical-hit rate. A support job needs master levels." },
  { name: "Recycle III", level: 50, access: "master-sub", effect: "30%. Replaces Recycle II. A support job needs master levels. Not rolled here." },
  { name: "Dead Aim II", level: 60, access: "main", effect: "Ranged critical damage +20%. Replaces Dead Aim. Main job only." },
  { name: "Resist Poison III", level: 60, access: "main", effect: "Replaces Resist Poison II. The percent is not printed, so it is not rolled. Main job only." },
  { name: "Wide Scan VI", level: 60, access: "main", effect: "Replaces Wide Scan V. Not rolled here. Main job only." },
  { name: "Damage Limit+ II", level: 60, access: "main", effect: "Physical pDIF cap +51/256. Replaces Damage Limit+. Main job only." },
  { name: "Accuracy Bonus IV", level: 70, access: "main", effect: "Accuracy +48. Replaces Accuracy Bonus III. Main job only." },
  { name: "Dead Aim III", level: 70, access: "main", effect: "Ranged critical damage +30%. Replaces Dead Aim II. Main job only." },
  { name: "Rapid Shot II", level: 71, access: "main", effect: "About 30%. Replaces Rapid Shot. Main job only." },
  { name: "Snapshot", level: 75, access: "main", effect: "Group 2 merit. Five ranks, 2% aiming delay each. A level-75 Ranger main has all five: 10%. The cap from every source is 70%. It does not change TP per hit. Rapid Shot and Velocity Shot stay separate multipliers. A subjob has no merits." },
];

/** Combat skills from the Ranger job page. The letters are that page's ranks, at the level-75 caps. No magic, no Parrying, no Guard. */
export const RNG_SKILLS: RngSkill[] = [
  { name: "Archery", rank: "A+" },
  { name: "Marksmanship", rank: "A+" },
  { name: "Dagger", rank: "B-" },
  { name: "Axe", rank: "B-" },
  { name: "Throwing", rank: "C-" },
  { name: "Sword", rank: "D" },
  { name: "Club", rank: "E" },
  { name: "Evasion", rank: "E" },
];

export function rngSkill(name: string, level: number): number {
  const row = RNG_SKILLS.find((skill) => skill.name === name);
  return row ? skillCap(row.rank, level) : 0;
}

export function assertRng(): void {
  const naked = characterBase("hume", "RNG", 75);
  if (naked.hp !== 971 || naked.mp !== 0 || naked.str !== 53 || naked.dex !== 56 || naked.vit !== 56 || naked.agi !== 70 || naked.int !== 53 || naked.mnd !== 56 || naked.chr !== 53) {
    throw new Error(`Hume RNG 75 ${naked.hp}/${naked.mp}/${naked.str}/${naked.dex}/${naked.vit}/${naked.agi}/${naked.int}/${naked.mnd}/${naked.chr}`);
  }
  if (rngJobLevel("RNG", null, 0, 75) !== 75 || rngJobLevel("WAR", "RNG", 37, 75) !== 37 || rngJobLevel("WAR", null, 0, 75) !== 0) throw new Error("Ranger level");
  if (barrageShots(29) !== 0 || barrageShots(37) !== 4 || barrageShots(50) !== 5 || barrageShots(75) !== 6 || barrageShots(90) !== 7) throw new Error("Barrage shots");
  if (camouflageSeconds(0) !== 30 || camouflageSeconds(1) !== 240 || camouflageSeconds(0.5) < 30 || camouflageSeconds(0.5) > 240) throw new Error("Camouflage duration");
  if (accuracyBonus(9, "sub") !== 0 || accuracyBonus(37, "sub") !== 22 || accuracyBonus(50, "sub") !== 22 || accuracyBonus(50, "master-sub") !== 35 || accuracyBonus(75, "main") !== 48) {
    throw new Error("Accuracy Bonus");
  }
  if (rapidShotRate(14, "sub") !== 0 || rapidShotRate(37, "sub") !== 0.25 || rapidShotRate(75, "sub") !== 0.25 || rapidShotRate(75, "main") !== 0.3) throw new Error("Rapid Shot");
  if (rapidShotFactor(0, 0, 0) !== 1 || rapidShotFactor(0.25, 0.25, 0) !== 1 || rapidShotFactor(0.25, 0, 0) !== 0.98 || rapidShotFactor(0.25, 0, 1) !== 0.5) throw new Error("Rapid Shot delay");
  if (recycleRate(19, "sub") !== 0 || recycleRate(37, "sub") !== 0.2 || recycleRate(50, "sub") !== 0.2 || recycleRate(75, "main") !== 0.3) throw new Error("Recycle");
  if (rngDamageLimit(29, "sub") !== 0 || rngDamageLimit(37, "sub") !== 26 / 256 || rngDamageLimit(75, "sub") !== 26 / 256 || rngDamageLimit(75, "main") !== 51 / 256) throw new Error("Damage Limit+");
  if (deadAim(75, "sub") !== 0 || deadAim(50, "master-sub") !== 0.1 || deadAim(60, "main") !== 0.2 || deadAim(75, "main") !== 0.3) throw new Error("Dead Aim");
  if (snapshotRate(74, "main") !== 0 || snapshotRate(75, "sub") !== 0 || snapshotRate(75, "master-sub") !== 0 || snapshotRate(75, "main") !== 0.1) throw new Error("Snapshot");
  if (rngSkill("Archery", 75) !== 276 || rngSkill("Marksmanship", 75) !== 276 || rngSkill("Dagger", 75) !== 240 || rngSkill("Axe", 75) !== 240) throw new Error("high ranks");
  if (rngSkill("Throwing", 75) !== 220 || rngSkill("Sword", 75) !== 210 || rngSkill("Club", 75) !== 200 || rngSkill("Evasion", 75) !== 200) throw new Error("mid ranks");
  if (rngSkill("Archery", 37) !== 114 || rngSkill("Sword", 37) !== 101 || rngSkill("Parrying", 75) !== 0 || rngSkill("Guard", 75) !== 0) throw new Error("sub or missing ranks");
  const banned = ["Flashy Shot", "Stealth Shot", "Double Shot", "Bounty Shot", "Decoy Shot", "Hover Shot", "Overkill", "True Shot"];
  if (RNG_ABILITIES.some((a) => banned.includes(a.name)) || RNG_TRAITS.some((t) => banned.includes(t.name))) throw new Error("merit or post-75 in the level-75 kit");
  if (RNG_ABILITIES.filter((a) => a.access === "sub" && a.level <= 37).map((a) => a.name).join(",") !== "Sharpshot,Scavenge,Camouflage,Barrage") {
    throw new Error("subjob abilities");
  }
  if (SHARPSHOT_ACC !== 40 || EAGLE_EYE_FTP !== 5 || SHADOWBIND_SECONDS !== 30 || SHADOWBIND_RANGE !== 25 || EAGLE_EYE_RANGE !== 25 || VELOCITY_ATTACK !== 38 || VELOCITY_AIM !== 0.85 || VELOCITY_SLOW !== 1.15) {
    throw new Error("Ranger constants");
  }
}
