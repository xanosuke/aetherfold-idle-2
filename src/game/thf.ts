/**
 * Retail Thief toolkit through level 75. No merits and no job points.
 *
 * The job page's brackets, at a level-75 cap with no master levels:
 * abilities through Mug, and traits through Resist Gravity II, are inside
 * a normal subjob's reach. A support job here is level 37, so Hide (45)
 * is not learned. Treasure Hunter II is 45. Evasion Bonus III, Damage
 * Limit+ I, and Triple Attack I need a master-level sub. From 60 up is
 * main job only. Perfect Dodge is the level-1 SP ability and is main only.
 *
 * Assassin's Charge, Feint, Aura Steal, and Ambush are merits.
 * Despoil, Conspirator, Bully, Larceny, and Dual Wield are past 75.
 * None of those are in this kit. Thief has no Dual Wield at 75.
 *
 * Naked Hume Thief grades, with no subjob: level 75 is 1046 HP, 0 MP,
 * STR 56, DEX 70, VIT 56, AGI 65, INT 61, MND 44, CHR 44.
 *
 * The model wears Rogue's Attire, the artifact set: Rogue's Bonnet, Vest,
 * Armlets, Culottes, and Poulaines. The pieces are not equipped, so their
 * stat lines are not on the sheet. Marauder's Knife is the artifact dagger
 * and is not the body.
 */

import { skillCap, type SkillRank } from "./skills";
import { characterBase, type JobId } from "./stats";
import type { JobAccess } from "./blm";

export const THF_CAP = 75;

/** Steal and Mug connect inside this. BG-Wiki Steal is 4.4 yalms. */
export const STEAL_RANGE = 4.4;

/** Flee's movement bonus. Gear movement in the yard is 0, so this is +60%. */
export const FLEE_MOVE = 0.6;

/** Accomplice and Collaborator. BG-Wiki. Both steal the target's CE and VE onto you. */
export const ACCOMPLICE_RATE = 0.5;
export const COLLABORATOR_RATE = 0.25;
/** Party-member range. The same 12.6' on both abilities. */
export const HATE_STEAL_RANGE = 12.6;
/** You also have to be this close to the monster or nothing moves. */
export const HATE_STEAL_MOB = 20.6;

export type ThfAbility = {
  name: string;
  level: number;
  recast: number;
  /** 0 when the page does not print a fixed duration. Hide lasts until it breaks. */
  duration: number;
  access: JobAccess;
  effect: string;
  ce: number;
  ve: number;
};

export type ThfTrait = {
  name: string;
  level: number;
  access: JobAccess;
  effect: string;
};

export type ThfSkill = {
  name: string;
  rank: SkillRank;
};

export function thiefJobLevel(job: JobId, sub: JobId | null, subLevel: number, mainLevel: number): number {
  if (job === "THF") return mainLevel;
  if (sub === "THF") return subLevel;
  return 0;
}

/**
 * Evasion Bonus. The higher tier replaces the lower.
 * I +10 at 10, II +22 at 30, III +35 at 50 (master sub), IV +48 at 70 (main).
 */
export function thfEvasionBonus(level: number, access: JobAccess): number {
  if (access === "main" && level >= 70) return 48;
  if (access !== "sub" && level >= 50) return 35;
  if (level >= 30) return 22;
  if (level >= 10) return 10;
  return 0;
}

/** Treasure Hunter. II replaces I. A normal subjob stops at I. */
export function treasureHunter(level: number): number {
  if (level >= 45) return 2;
  if (level >= 15) return 1;
  return 0;
}

export function gilfinder(level: number): boolean {
  return level >= 5;
}

/**
 * Resist Gravity. The higher tier replaces the lower.
 * I 10% at 20, II 15% at 40, III 20% at 66 (main), IV 25% at 75 (main).
 */
export function gravityResist(level: number, access: JobAccess): number {
  if (access === "main" && level >= 75) return 0.25;
  if (access === "main" && level >= 66) return 0.2;
  if (level >= 40) return 0.15;
  if (level >= 20) return 0.1;
  return 0;
}

/** Triple Attack I is 5%. II is 95. A normal subjob does not have it. */
export function tripleAttackRate(level: number, access: JobAccess): number {
  if (access === "sub") return 0;
  return level >= 55 ? 0.05 : 0;
}

/** Damage Limit+ I is +26/256. Thief has no second tier by 75. A normal sub does not have it. */
export function thfDamageLimit(level: number, access: JobAccess): number {
  if (access === "sub") return 0;
  return level >= 50 ? 26 / 256 : 0;
}

/** Assassin is main only. It makes a lined-up Trick Attack critical. The AGI is the job ability. */
export function assassin(level: number, access: JobAccess): boolean {
  return access === "main" && level >= 60;
}

export const THF_ABILITIES: ThfAbility[] = [
  {
    name: "Perfect Dodge",
    level: 1,
    recast: 3600,
    duration: 30,
    access: "main",
    effect: "Dodges every melee swing for 30 seconds. Ranged attacks and spells still land. Duration 0:30. Recast 1:00:00. Main job only. The one-hour ability. Cumulative enmity 0, volatile enmity 0. Merit magic evasion is not added.",
    ce: 0,
    ve: 0,
  },
  {
    name: "Steal",
    level: 5,
    recast: 300,
    duration: 0,
    access: "sub",
    effect: "Steals an item. Range 4.4'. The Tropical Rarab has nothing to steal, so the attempt finds nothing and the recast still starts. Recast 5:00. Cumulative enmity 1, volatile enmity 320. Merit recast is not added.",
    ce: 1,
    ve: 320,
  },
  {
    name: "Sneak Attack",
    level: 15,
    recast: 60,
    duration: 60,
    access: "sub",
    effect: "The next auto-attack from behind is a critical hit, cannot miss, and, on Thief main, adds your DEX to that hit's weapon damage. The first hit of a physical weapon skill gets the same crit. The DEX is added after fTP, and only on that first hit. Triple Attack's extras do not get it. Magical weapon skills and ranged shots do not use it, and a ranged shot does not spend it. Hide lets it land from any side. A frontal swing does not spend it. Duration 1:00. Recast 1:00. Cumulative enmity 0, volatile enmity 0. Merit recast is not added. Bully is 93 and is not in this kit.",
    ce: 0,
    ve: 0,
  },
  {
    name: "Flee",
    level: 25,
    recast: 300,
    duration: 30,
    access: "sub",
    effect: "Movement speed +60%. Duration 0:30. Recast 5:00. Cumulative enmity 0, volatile enmity 80. It does not remove Gravity. Merit recast is not added.",
    ce: 0,
    ve: 80,
  },
  {
    name: "Trick Attack",
    level: 30,
    recast: 60,
    duration: 60,
    access: "sub",
    effect: "The next melee attack round, struck from behind a party member, cannot miss. That round's enmity, and a skillchain the weapon skill closes, goes to the member in front of you. Thief main adds AGI to the first hit of each hand, after fTP on a weapon skill. Assassin makes those hits critical. The off hand gets the accuracy too. Hide does not stand in for the party member. A swing with nobody on the line does not spend it. Ranged attacks do not spend it. Duration 1:00. Recast 1:00. Cumulative enmity 0, volatile enmity 0. Merit recast is not added.",
    ce: 0,
    ve: 0,
  },
  {
    name: "Mug",
    level: 35,
    recast: 300,
    duration: 0,
    access: "sub",
    effect: "Steals gil. Range 4.4'. The Tropical Rarab has no gil, so the attempt finds nothing and the recast still starts. Recast 5:00. Cumulative enmity 1, volatile enmity 320.",
    ce: 1,
    ve: 320,
  },
  {
    name: "Hide",
    level: 45,
    recast: 300,
    duration: 0,
    access: "sub",
    effect: "You drop off the hate list until you swing, weapon skill, cast, use another ability, or get hit. Sneak Attack and Trick Attack do not break it. They are what a hidden strike spends. A level-37 subjob has not learned it. It is not a short timer. Recast 5:00. Cumulative enmity 0, volatile enmity 0.",
    ce: 0,
    ve: 0,
  },
  {
    name: "Accomplice",
    level: 65,
    recast: 300,
    duration: 0,
    access: "main",
    effect: "Steals 50% of one party member's cumulative and volatile enmity and puts it on you. Range 12.6'. You must be within 20.6' of the monster. Shares its recast with Collaborator: using this locks both for 5:00. Main job only. Not an ability share. Trusts count.",
    ce: 0,
    ve: 0,
  },
  {
    name: "Collaborator",
    level: 65,
    recast: 60,
    duration: 0,
    access: "main",
    effect: "Steals 25% of one party member's cumulative and volatile enmity and puts it on you. Range 12.6'. You must be within 20.6' of the monster. Shares its recast with Accomplice: using this locks both for 1:00. Main job only. Not an ability share. Trusts count.",
    ce: 0,
    ve: 0,
  },
];

export const THF_TRAITS: ThfTrait[] = [
  { name: "Gilfinder", level: 5, access: "sub", effect: "Gil dropped by an enemy can be found. The Tropical Rarab has no gil, so nothing is rolled." },
  { name: "Evasion Bonus", level: 10, access: "sub", effect: "Evasion +10. The next tier replaces this." },
  { name: "Treasure Hunter", level: 15, access: "sub", effect: "Treasure Hunter +1. Common drops such as Rabbit Hide and Hare Meat rise from 15% to 30%. The next tier replaces this." },
  { name: "Resist Gravity", level: 20, access: "sub", effect: "10% chance to resist Gravity. The next tier replaces this. Nothing in this yard puts Gravity on you, so it is not rolled." },
  { name: "Evasion Bonus II", level: 30, access: "sub", effect: "Evasion +22. Replaces Evasion Bonus. A level-37 subjob has this tier." },
  { name: "Resist Gravity II", level: 40, access: "sub", effect: "15% chance to resist Gravity. Replaces Resist Gravity. A level-37 subjob has not learned it." },
  { name: "Treasure Hunter II", level: 45, access: "sub", effect: "Treasure Hunter +2. Replaces Treasure Hunter. A common drop rises to 40%. A level-37 subjob has not learned it." },
  { name: "Evasion Bonus III", level: 50, access: "master-sub", effect: "Evasion +35. Replaces Evasion Bonus II. A support job needs master levels." },
  { name: "Damage Limit+", level: 50, access: "master-sub", effect: "Physical pDIF cap +26/256. It does not raise the rolled pDIF. It does not stack with another job's Damage Limit+. A support job needs master levels. Thief has no second tier by 75." },
  { name: "Triple Attack", level: 55, access: "master-sub", effect: "5% chance of two extra hits on an attack. It is checked before Double Attack, and the two do not both land on the same swing. The extra hits are not kicks. A support job needs master levels. Triple Attack II is 95." },
  { name: "Assassin", level: 60, access: "main", effect: "A Trick Attack that is lined up behind a party member also critical hits. Main job only. The AGI added to weapon damage is Trick Attack itself, not this trait. Hide does not replace the party member." },
  { name: "Resist Gravity III", level: 66, access: "main", effect: "20% chance to resist Gravity. Replaces Resist Gravity II. Main job only. Not rolled here." },
  { name: "Evasion Bonus IV", level: 70, access: "main", effect: "Evasion +48. Replaces Evasion Bonus III. Main job only." },
  { name: "Resist Gravity IV", level: 75, access: "main", effect: "25% chance to resist Gravity. Replaces Resist Gravity III. Main job only. Not rolled here." },
];

/** Combat skills from the Thief job page. No rank means 0. No magic skills. */
export const THF_SKILLS: ThfSkill[] = [
  { name: "Dagger", rank: "A+" },
  { name: "Evasion", rank: "A+" },
  { name: "Parrying", rank: "A" },
  { name: "Marksmanship", rank: "C+" },
  { name: "Archery", rank: "C-" },
  { name: "Sword", rank: "D" },
  { name: "Throwing", rank: "D" },
  { name: "Hand-to-Hand", rank: "E" },
  { name: "Club", rank: "E" },
  { name: "Shield", rank: "F" },
];

export function thfSkill(name: string, level: number): number {
  const row = THF_SKILLS.find((skill) => skill.name === name);
  return row ? skillCap(row.rank, level) : 0;
}

export function assertThf(): void {
  const naked = characterBase("hume", "THF", 75);
  if (naked.hp !== 1046 || naked.mp !== 0 || naked.str !== 56 || naked.dex !== 70 || naked.vit !== 56 || naked.agi !== 65 || naked.int !== 61 || naked.mnd !== 44 || naked.chr !== 44) {
    throw new Error(`Hume THF 75 ${naked.hp}/${naked.mp}/${naked.str}/${naked.dex}/${naked.vit}/${naked.agi}/${naked.int}/${naked.mnd}/${naked.chr}`);
  }
  if (thfEvasionBonus(9, "sub") !== 0 || thfEvasionBonus(10, "sub") !== 10 || thfEvasionBonus(37, "sub") !== 22 || thfEvasionBonus(50, "sub") !== 22) {
    throw new Error("Evasion Bonus sub");
  }
  if (thfEvasionBonus(75, "main") !== 48 || thfEvasionBonus(50, "master-sub") !== 35) throw new Error("Evasion Bonus main");
  if (treasureHunter(14) !== 0 || treasureHunter(37) !== 1 || treasureHunter(75) !== 2) throw new Error("Treasure Hunter");
  if (!gilfinder(5) || gilfinder(4)) throw new Error("Gilfinder");
  if (gravityResist(37, "sub") !== 0.1 || gravityResist(40, "sub") !== 0.15 || gravityResist(75, "main") !== 0.25 || gravityResist(66, "sub") !== 0.15) {
    throw new Error("Resist Gravity");
  }
  if (tripleAttackRate(75, "main") !== 0.05 || tripleAttackRate(75, "sub") !== 0 || tripleAttackRate(54, "main") !== 0) throw new Error("Triple Attack");
  if (thfDamageLimit(75, "main") !== 26 / 256 || thfDamageLimit(75, "sub") !== 0 || thfDamageLimit(49, "main") !== 0) throw new Error("Damage Limit+");
  if (!assassin(75, "main") || assassin(75, "sub") || assassin(59, "main")) throw new Error("Assassin");
  if (thfSkill("Dagger", 75) !== 276 || thfSkill("Evasion", 75) !== 276 || thfSkill("Parrying", 75) !== 269) throw new Error("A ranks");
  if (thfSkill("Marksmanship", 75) !== 230 || thfSkill("Archery", 75) !== 220 || thfSkill("Sword", 75) !== 210 || thfSkill("Throwing", 75) !== 210) throw new Error("mid ranks");
  if (thfSkill("Hand-to-Hand", 75) !== 200 || thfSkill("Club", 75) !== 200 || thfSkill("Shield", 75) !== 189) throw new Error("low ranks");
  if (thfSkill("Staff", 75) !== 0 || thfSkill("Dagger", 37) !== 114) throw new Error("skill edges");
  if (FLEE_MOVE !== 0.6 || STEAL_RANGE !== 4.4) throw new Error("Flee or Steal");
  if (ACCOMPLICE_RATE !== 0.5 || COLLABORATOR_RATE !== 0.25 || HATE_STEAL_RANGE !== 12.6 || HATE_STEAL_MOB !== 20.6) throw new Error("hate steal");
  const acc = THF_ABILITIES.find((a) => a.name === "Accomplice");
  const col = THF_ABILITIES.find((a) => a.name === "Collaborator");
  if (!acc || acc.recast !== 300 || acc.level !== 65 || acc.access !== "main" || !col || col.recast !== 60 || col.level !== 65) {
    throw new Error("Accomplice recast");
  }
  const banned = ["Assassin's Charge", "Feint", "Aura Steal", "Ambush", "Despoil", "Conspirator", "Bully", "Larceny", "Dual Wield"];
  if (THF_ABILITIES.some((a) => banned.includes(a.name)) || THF_TRAITS.some((t) => banned.includes(t.name))) {
    throw new Error("merit or post-75 in the level-75 kit");
  }
  if (THF_ABILITIES.filter((a) => a.access === "sub" && a.level <= 37).map((a) => a.name).join(",") !== "Steal,Sneak Attack,Flee,Trick Attack,Mug") {
    throw new Error("subjob abilities");
  }
}
