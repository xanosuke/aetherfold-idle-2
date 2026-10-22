/**
 * Retail Paladin toolkit through level 75. No merits and no job points.
 *
 * The job page's brackets, at a level-75 cap with no master levels:
 * Holy Circle, Shield Bash, Sentinel, and Cover are inside a normal
 * subjob's reach. A support job here is level 37, so all four are learned.
 * Invincible sits above that bracket and is main only. Rampart and Majesty
 * are under the main-only line. Fealty and Chivalry are group-2 merits, so
 * they stay locked. Divine Emblem and everything after it are past 75.
 *
 * Traits through Max HP Boost are a normal subjob's. Defense Bonus III and
 * Shield Mastery II need a master-level sub. From Resist Sleep III up is
 * main only. Iron Will and Guardian are on the trait list at 75, and both
 * are merit traits: with no ranks unlocked they add nothing.
 *
 * Naked Hume Paladin grades, with no subjob: level 75 is 1167 HP, 312 MP,
 * STR 65, DEX 53, VIT 70, AGI 44, INT 44, MND 61, CHR 61.
 *
 * The model wears Gallant armor, the artifact set: Coronet, Surcoat,
 * Gauntlets, Breeches, and Leggings. White plate, gold trim, a San d'Oria
 * blue cross, and a closed helm. The pieces are not equipped, so their
 * stat lines are not on the sheet. The sword and shield in the hands are
 * the equipped weapon, not the armor.
 */

import { skillCap, type SkillRank } from "./skills";
import { characterBase, type JobId } from "./stats";
import type { JobAccess } from "./blm";

export const PLD_CAP = 75;

/** Shield Bash reaches this far. BG-Wiki prints 5.4 yalms. */
export const SHIELD_BASH_RANGE = 5.4;

/** Shield Bash stun uses the spell's length. The ability page does not print one. */
export const SHIELD_BASH_STUN = 2;

/** Rampart's printed radius. Special damage taken −25% for every damage type. */
export const RAMPART_RADIUS = 13;
export const RAMPART_CUT = 0.25;

/** Majesty's printed range for the Cure and Protect splash. */
export const MAJESTY_RADIUS = 10;

/** Cure Potency II and the Cure recast cut. Both are 25%. */
export const MAJESTY_CURE = 1.25;
export const MAJESTY_RECAST = 0.75;

export type PldAbility = {
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

export type PldTrait = {
  name: string;
  level: number;
  access: JobAccess;
  effect: string;
};

export type PldSkill = {
  name: string;
  rank: SkillRank;
};

export function pldJobLevel(job: JobId, sub: JobId | null, subLevel: number, mainLevel: number): number {
  if (job === "PLD") return mainLevel;
  if (sub === "PLD") return subLevel;
  return 0;
}

/**
 * Shield Bash base damage. The page prints 15 at level 45 and 27 at 99.
 * The line between those anchors is 12 / 54 per level. Level 75 is 21.
 * Job points and gear that add to the base are not in this kit.
 */
export function shieldBashBase(level: number): number {
  return Math.floor(15 + ((level - 45) * 12) / 54);
}

/**
 * Size bonus from the Shield Bash page.
 * 1 buckler +0, 2 round +13, 3 kite +40, 4 tower +67, 5 and 6 +0.
 * Lauan Shield is size 2. Marine Shield is size 1.
 */
export function shieldSizeBonus(id: string | null | undefined): number {
  if (id === "lauan-shield") return 13;
  if (id === "marine-shield") return 0;
  return 0;
}

/**
 * (base + size) × a roll from 1.00 to 1.05, then floored.
 * `roll` is 0 at the low end and 1 at the high end.
 */
export function shieldBashDamage(level: number, sizeBonus: number, roll: number): number {
  const span = Math.min(1, Math.max(0, roll));
  return Math.floor((shieldBashBase(level) + sizeBonus) * (1 + span * 0.05));
}

/**
 * Sentinel's physical cut. Starts at 90% and falls 8% each 3-second tick,
 * then holds at 50%. `elapsed` is seconds since the ability landed.
 * The cut is an exact percent, applied after ordinary damage taken.
 */
export function sentinelCut(elapsed: number): number {
  const ticks = Math.max(0, Math.floor(elapsed / 3));
  return Math.max(50, 90 - 8 * ticks) / 100;
}

/** Enmity+ granted for Sentinel's duration. Main is +100. A subjob is +50. */
export function sentinelEnmity(main: boolean): number {
  return main ? 2 : 1.5;
}

/**
 * Cover's base duration. 15 + the dSTAT term, and that term is 0 to 15.
 * floor((user VIT + user MND − target VIT × 2) / 4), clamped.
 * Merits and job points are not added. Gear that extends Cover is not equipped.
 */
export function coverSeconds(userVit: number, userMnd: number, targetVit: number): number {
  const raw = Math.floor((userVit + userMnd - targetVit * 2) / 4);
  return 15 + Math.min(15, Math.max(0, raw));
}

/**
 * Defense Bonus. The higher tier replaces the lower.
 * I +10 at 10, II +22 at 30, III +35 at 50 (master sub), IV +48 at 70 (main).
 * A normal subjob stops at II.
 */
export function pldDefenseBonus(level: number, access: JobAccess): number {
  if (access === "main") {
    if (level >= 70) return 48;
    if (level >= 50) return 35;
    if (level >= 30) return 22;
    if (level >= 10) return 10;
    return 0;
  }
  if (access === "master-sub") {
    if (level >= 50) return 35;
    if (level >= 30) return 22;
    if (level >= 10) return 10;
    return 0;
  }
  if (level >= 30) return 22;
  if (level >= 10) return 10;
  return 0;
}

/** Max HP Boost I is +30 at 45. Tier II is 85 and is not in this kit. A level-37 sub has not learned it. */
export function pldMaxHp(level: number, access: JobAccess): number {
  if (access === "sub" && level < 45) return 0;
  return level >= 45 ? 30 : 0;
}

/** Auto Refresh I is 1 MP per 3-second tick. Paladin has no second tier by 75. */
export function pldRefresh(level: number): number {
  return level >= 35 ? 1 : 0;
}

/**
 * Resist Sleep. The higher tier replaces the lower.
 * I 10% at 20, II 15% at 40, III 20% at 60 (main), IV 25% at 75 (main).
 * Nothing here puts Sleep on you, so it is not rolled.
 */
export function resistSleep(level: number, access: JobAccess): number {
  if (access === "main" && level >= 75) return 0.25;
  if (access === "main" && level >= 60) return 0.2;
  if (level >= 40) return 0.15;
  if (level >= 20) return 0.1;
  return 0;
}

/**
 * Bonus TP when a shield block connects. I +10, II +20, III +30.
 * A connecting block adds this TP. Stoneskin that would have eaten the
 * whole hit, before the shield's percent, does not.
 */
export function shieldMasteryTp(level: number, access: JobAccess): number {
  if (access === "main" && level >= 75) return 30;
  if (access !== "sub" && level >= 50) return 20;
  if (level >= 25) return 10;
  return 0;
}

/** Undead Killer I is 8%. Tier II is 86. The Tropical Rarab is not undead, so it is not rolled. */
export function undeadKiller(level: number): number {
  return level >= 5 ? 0.08 : 0;
}

/**
 * Shield Barrier adds the equipped shield's DEF to Protect cast by this Paladin.
 * Main only, level 70. No shield means no bonus.
 */
export function shieldBarrierDef(level: number, access: JobAccess, shieldDef: number): number {
  if (access !== "main" || level < 70 || shieldDef <= 0) return 0;
  return shieldDef;
}

/** Holy Circle's undead bonuses, as a fraction. Main 15%. Sub 5%. The hare is not undead. */
export function holyCircleBonus(main: boolean): number {
  return main ? 0.15 : 0.05;
}

export const PLD_ABILITIES: PldAbility[] = [
  {
    name: "Invincible",
    level: 1,
    recast: 3600,
    duration: 30,
    access: "main",
    effect: "Immune to physical damage for 30 seconds. Spells and magic damage still land. The motion is the one-hour pose: the sword goes up and a white-gold column wraps the body. A physical hit that connects prints 0. Recast 1:00:00. Cumulative enmity 0, volatile enmity 7200. Main job only. Job points are not added.",
    ce: 0,
    ve: 7200,
  },
  {
    name: "Holy Circle",
    level: 5,
    recast: 300,
    duration: 180,
    access: "sub",
    effect: "Undead resistance for party members in range. Main job: damage dealt to undead +15%, damage taken from undead −15%. A subjob is 5%. The extra Undead Killer is described as likely, so it is not added on top of the trait. Only one Circle can be up. The Tropical Rarab is not undead, so the fight does not change. The motion sweeps the sword through a ring and a gold circle opens on the ground. The page does not print the radius. Duration 0:03:00. Recast 0:05:00. Volatile enmity 5. Merits are not applied.",
    ce: 0,
    ve: 5,
  },
  {
    name: "Shield Bash",
    level: 15,
    recast: 60,
    duration: 0,
    access: "sub",
    effect: "A shield strike that can stun. Needs a shield. Range 5.4'. Damage is (base + shield size) × 1.00 to 1.05. Base is 15 at 45 and 27 at 99, so 21 at 75 and 13 at 37. Lauan Shield is size 2 (+13). Marine Shield is size 1 (+0). The stun rate is not printed. It is described as high, so the stun lands, for the spell Stun's 2 seconds. The motion cocks the shield beside the shoulder, then punches the shield face straight into the target. The sword stays back. A white hit flash marks the body, and stun stars turn over the enemy's head. The mob gains the TP of one melee hit from the main-hand delay. Recast 0:01:00. Cumulative enmity 450, volatile enmity 900. Merits and job points are not added.",
    ce: 450,
    ve: 900,
  },
  {
    name: "Sentinel",
    level: 30,
    recast: 300,
    duration: 30,
    access: "sub",
    effect: "Physical damage taken starts at −90% and falls 8% every 3 seconds, then holds at −50%. The cut is an exact percent, after Rampart and before Phalanx. Magic is not cut. The motion braces the shield across the body under a pale guard light. Enmity+100 while it lasts on a main Paladin, Enmity+50 on a sub, and that bonus is already in the opening spike: volatile enmity 900 becomes 1800 or 1350. Later enmity is multiplied the same way. Duration 0:00:30. Recast 0:05:00. Cumulative enmity 0. Merits are not applied. A connecting cut from the Tropical Rarab is reduced by that percent.",
    ce: 0,
    ve: 900,
  },
  {
    name: "Cover",
    level: 35,
    recast: 180,
    duration: 15,
    access: "sub",
    effect: "Take the blows meant for one party member who currently has hate, while you stand between them and the enemy. Area attacks and spells are not covered. Duration is 15 seconds plus up to 15 from VIT and MND against the ally's VIT. The motion is a step across that ally's line, shield held out. No one else here holds the hare's hate, so no blow is caught. Recast 0:03:00. Cumulative enmity 0, volatile enmity 1. An intercepted hit would be +200 cumulative enmity, and the covered player would lose 10% cumulative enmity. Merits and job points are not added.",
    ce: 0,
    ve: 1,
  },
  {
    name: "Rampart",
    level: 62,
    recast: 180,
    duration: 30,
    access: "main",
    effect: "Party members within 13' take 25% less damage of every type. The cut is floored, before Sentinel and Phalanx. The motion plants the shield and raises a pale wall of light. You are inside your own area. Duration 0:00:30. Recast 0:03:00. Cumulative enmity 320, volatile enmity 320. Main job only. Merits are not applied. A cut or Dust Cloud from the Tropical Rarab is reduced by that amount.",
    ce: 320,
    ve: 320,
  },
  {
    name: "Majesty",
    level: 70,
    recast: 60,
    duration: 180,
    access: "main",
    effect: "A stance. Cure potency +25% (Cure Potency II) and Cure recast −25%. Cure and Protect also splash to party members within 10'. The motion raises the sword and a small crown of light. It is not spent by the spell. Duration 0:03:00. Recast 0:01:00. Cumulative enmity 0, volatile enmity 340. Main job only. Shell is not splashed.",
    ce: 0,
    ve: 340,
  },
  {
    name: "Fealty",
    level: 75,
    recast: 600,
    duration: 60,
    access: "main",
    merit: true,
    effect: "Merit ability. Not unlocked. Would grant a strong resist to enfeebling magic, charm, and some added effects, for 60 seconds. The motion would be a kneeling oath and a gold seal. Recast 10:00. Volatile enmity 320.",
    ce: 0,
    ve: 320,
  },
  {
    name: "Chivalry",
    level: 75,
    recast: 600,
    duration: 0,
    access: "main",
    merit: true,
    effect: "Merit ability. Not unlocked. Would convert TP to MP: TP × 0.05 × merit ranks, plus TP × 0.0015 × MND. The motion would set the sword point-down while blue motes rise. Recast 10:00. Volatile enmity 320.",
    ce: 0,
    ve: 320,
  },
];

export const PLD_TRAITS: PldTrait[] = [
  { name: "Undead Killer", level: 5, access: "sub", effect: "An edge against undead. 8%. The Tropical Rarab is not undead, so it is not rolled." },
  { name: "Defense Bonus", level: 10, access: "sub", effect: "Defense +10. The next tier replaces this." },
  { name: "Resist Sleep", level: 20, access: "sub", effect: "10% chance to fully resist Sleep. Nothing here sleeps you, so it is not rolled." },
  { name: "Shield Mastery", level: 25, access: "sub", effect: "+10 TP when a shield block connects, if the hit would have passed Stoneskin before the shield's percent. The next tier replaces this." },
  { name: "Defense Bonus II", level: 30, access: "sub", effect: "Defense +22. Replaces Defense Bonus. A level-37 subjob has this tier." },
  { name: "Auto Refresh", level: 35, access: "sub", effect: "1 MP every 3 seconds. A level-37 subjob has this." },
  { name: "Resist Sleep II", level: 40, access: "sub", effect: "15%. Replaces Resist Sleep. A level-37 subjob has not learned it." },
  { name: "Max HP Boost", level: 45, access: "sub", effect: "+30 HP. A level-37 subjob has not learned it. It does not stack with another job's Max HP Boost. The higher one is used." },
  { name: "Defense Bonus III", level: 50, access: "master-sub", effect: "Defense +35. Replaces Defense Bonus II. A support job needs master levels." },
  { name: "Shield Mastery II", level: 50, access: "master-sub", effect: "+20 TP on a block. Replaces Shield Mastery. A support job needs master levels." },
  { name: "Resist Sleep III", level: 60, access: "main", effect: "20%. Replaces Resist Sleep II. Main job only. Not rolled here." },
  { name: "Defense Bonus IV", level: 70, access: "main", effect: "Defense +48. Replaces Defense Bonus III. Main job only." },
  { name: "Shield Barrier", level: 70, access: "main", effect: "Protect you cast, while a shield is equipped, also adds that shield's DEF. Main job only." },
  { name: "Resist Sleep IV", level: 75, access: "main", effect: "25%. Replaces Resist Sleep III. Main job only. Not rolled here." },
  { name: "Shield Mastery III", level: 75, access: "main", effect: "+30 TP on a block. Replaces Shield Mastery II. Main job only." },
  { name: "Iron Will", level: 75, access: "main", effect: "Merit trait. No ranks are unlocked, so Holy Circle gains nothing from it." },
  { name: "Guardian", level: 75, access: "main", effect: "Merit trait. No ranks are unlocked, so Sentinel's enmity loss is not reduced." },
];

/** Combat and magic skills from the Paladin job page. The letters are that page's ranks, at the level-75 caps. */
export const PLD_SKILLS: PldSkill[] = [
  { name: "Sword", rank: "A+" },
  { name: "Club", rank: "A" },
  { name: "Staff", rank: "A" },
  { name: "Great Sword", rank: "B" },
  { name: "Dagger", rank: "C-" },
  { name: "Polearm", rank: "E" },
  { name: "Shield", rank: "A+" },
  { name: "Evasion", rank: "C" },
  { name: "Parrying", rank: "C" },
  { name: "Divine Magic", rank: "B+" },
  { name: "Healing Magic", rank: "C" },
  { name: "Enhancing Magic", rank: "D" },
];

export function pldSkill(name: string, level: number): number {
  const row = PLD_SKILLS.find((skill) => skill.name === name);
  return row ? skillCap(row.rank, level) : 0;
}

export function assertPld(): void {
  const naked = characterBase("hume", "PLD", 75);
  if (naked.hp !== 1167 || naked.mp !== 312 || naked.str !== 65 || naked.dex !== 53 || naked.vit !== 70 || naked.agi !== 44 || naked.int !== 44 || naked.mnd !== 61 || naked.chr !== 61) {
    throw new Error(`Hume PLD 75 ${naked.hp}/${naked.mp}/${naked.str}/${naked.dex}/${naked.vit}/${naked.agi}/${naked.int}/${naked.mnd}/${naked.chr}`);
  }
  if (pldJobLevel("PLD", null, 0, 75) !== 75 || pldJobLevel("WAR", "PLD", 37, 75) !== 37 || pldJobLevel("WAR", null, 0, 75) !== 0) throw new Error("Paladin level");
  if (shieldBashBase(45) !== 15 || shieldBashBase(37) !== 13 || shieldBashBase(75) !== 21 || shieldBashBase(99) !== 27) throw new Error("Shield Bash base");
  if (shieldSizeBonus("lauan-shield") !== 13 || shieldSizeBonus("marine-shield") !== 0) throw new Error("shield size");
  if (shieldBashDamage(75, 13, 0) !== 34 || shieldBashDamage(75, 13, 1) !== 35 || shieldBashDamage(75, 0, 0) !== 21) throw new Error("Shield Bash damage");
  if (sentinelCut(0) !== 0.9 || sentinelCut(3) !== 0.82 || sentinelCut(15) !== 0.5 || sentinelCut(27) !== 0.5) throw new Error("Sentinel decay");
  if (sentinelEnmity(true) !== 2 || sentinelEnmity(false) !== 1.5) throw new Error("Sentinel enmity");
  if (coverSeconds(70, 61, 70) !== 15 || coverSeconds(70, 61, 0) !== 30) throw new Error("Cover duration");
  if (pldDefenseBonus(9, "sub") !== 0 || pldDefenseBonus(37, "sub") !== 22 || pldDefenseBonus(75, "sub") !== 22 || pldDefenseBonus(75, "main") !== 48) throw new Error("Defense Bonus");
  if (pldMaxHp(37, "sub") !== 0 || pldMaxHp(75, "main") !== 30 || pldMaxHp(44, "sub") !== 0) throw new Error("Max HP Boost");
  if (pldRefresh(34) !== 0 || pldRefresh(37) !== 1 || pldRefresh(75) !== 1) throw new Error("Auto Refresh");
  if (resistSleep(37, "sub") !== 0.1 || resistSleep(75, "sub") !== 0.15 || resistSleep(75, "main") !== 0.25) throw new Error("Resist Sleep");
  if (shieldMasteryTp(37, "sub") !== 10 || shieldMasteryTp(75, "sub") !== 10 || shieldMasteryTp(75, "main") !== 30) throw new Error("Shield Mastery");
  if (undeadKiller(4) !== 0 || undeadKiller(75) !== 0.08) throw new Error("Undead Killer");
  if (shieldBarrierDef(75, "sub", 1) !== 0 || shieldBarrierDef(69, "main", 1) !== 0 || shieldBarrierDef(75, "main", 1) !== 1 || shieldBarrierDef(75, "main", 0) !== 0) throw new Error("Shield Barrier");
  if (holyCircleBonus(true) !== 0.15 || holyCircleBonus(false) !== 0.05) throw new Error("Holy Circle");
  if (pldSkill("Sword", 75) !== 276 || pldSkill("Club", 75) !== 269 || pldSkill("Staff", 75) !== 269 || pldSkill("Great Sword", 75) !== 250) throw new Error("high ranks");
  if (pldSkill("Dagger", 75) !== 220 || pldSkill("Polearm", 75) !== 200 || pldSkill("Shield", 75) !== 276 || pldSkill("Evasion", 75) !== 225 || pldSkill("Parrying", 75) !== 225) throw new Error("combat ranks");
  if (pldSkill("Divine Magic", 75) !== 256 || pldSkill("Healing Magic", 75) !== 225 || pldSkill("Enhancing Magic", 75) !== 210) throw new Error("magic ranks");
  if (pldSkill("Axe", 75) !== 0 || pldSkill("Archery", 75) !== 0 || pldSkill("Guard", 75) !== 0 || pldSkill("Sword", 37) !== 114) throw new Error("missing or sub rank");
  const banned = ["Divine Emblem", "Sepulcher", "Palisade", "Intervene", "Enlight"];
  if (PLD_ABILITIES.some((a) => banned.includes(a.name)) || PLD_TRAITS.some((t) => banned.includes(t.name))) throw new Error("post-75 in the level-75 kit");
  if (PLD_ABILITIES.filter((a) => a.access === "sub" && a.level <= 37 && !a.merit).map((a) => a.name).join(",") !== "Holy Circle,Shield Bash,Sentinel,Cover") {
    throw new Error("subjob abilities");
  }
  if (PLD_ABILITIES.filter((a) => a.merit).map((a) => a.name).join(",") !== "Fealty,Chivalry") throw new Error("merits");
}
