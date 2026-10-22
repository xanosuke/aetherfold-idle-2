/**
 * Retail White Mage toolkit through level 75. No merits and no job points.
 *
 * The job page's brackets, at a level-75 cap with no master levels:
 * through 49 a normal subjob can use the trait. 50 and up need a
 * master-level sub or the main job. Benediction is main only, the same
 * way Manafont is. Divine Seal is inside the subjob bracket.
 *
 * Cure, Curaga, and Cura are in this kit. Cura II and Cura III are not.
 * Raise and Reraise are too.
 * Banish, Banishga, Flash, Holy, and Repose are in. Holy II is not.
 * The bar spells are on the spell list. Baramnesra is past 75.
 * Martyr and Devotion stay in this list. They are merit abilities.
 * Nothing here unlocks or ranks them, so they are not offered.
 */

import { skillCap, type SkillRank } from "./skills";
import { characterBase } from "./stats";
import type { JobAccess } from "./blm";

export type WhmAbility = {
  name: string;
  level: number;
  recast: number;
  duration: number;
  access: JobAccess;
  effect: string;
  /** Merit ability. Stored, and not usable until a merit unlocks it. */
  merit?: boolean;
};

export type WhmTrait = {
  name: string;
  level: number;
  access: JobAccess;
  effect: string;
};

export type WhmSkill = {
  name: string;
  rank: SkillRank;
};

/**
 * Benediction is the one-hour ability. It restores HP equal to
 * (your level / their level) × 100% and removes most ailments.
 * On yourself at 75 that is all of your HP. Its enmity scales with
 * the heal and is not a fixed number, so none is added.
 * Divine Seal doubles the next Cure or Curaga, then wears off.
 * It would also double Cura. That amount is not published, so the seal is not spent on Cura.
 * Undead damage is not doubled.
 * Afflatus Solace and Afflatus Misery last 2 hours, recast 1 minute,
 * and each replaces the other. A Cure under Solace adds stoneskin of
 * 25% of that cure before the HP bar, capped at 300. Curaga does not.
 * The notes only call that duration short; this yard keeps the shell for 30 seconds.
 * It does not replace a Stoneskin spell, and that spell replaces it.
 * Solace enmity is cumulative 1, volatile 80. Misery's enmity is not
 * printed here, so none is added. Martyr and Devotion are merit abilities. The base
 * numbers stay here. A merit has to unlock them before either is usable,
 * and further merits are what would change the transfer. Neither is unlocked.
 */
export const WHM_ABILITIES: WhmAbility[] = [
  {
    name: "Benediction",
    level: 1,
    recast: 3600,
    duration: 0,
    access: "main",
    effect: "Restores your HP. At 75 on yourself that is all of it. Main job only. Recast 1:00:00. Area 14'. The enmity scales with the heal and is not added.",
  },
  {
    name: "Divine Seal",
    level: 15,
    recast: 600,
    duration: 60,
    access: "sub",
    effect: "Doubles the next Cure or Curaga. Cura is a healing spell it would also double, but that amount is not published, so the seal is not spent on Cura. Recast 10:00. Duration 1:00 or that spell. Cumulative enmity 0, volatile enmity 80. Undead damage from Cure is not doubled.",
  },
  {
    name: "Afflatus Solace",
    level: 40,
    recast: 60,
    duration: 7200,
    access: "main",
    effect: "Stance for 2:00:00. Recast 1:00. Replaces Afflatus Misery. A Cure adds stoneskin of 25% of that cure before the HP bar, capped at 300. Curaga does not. Cura does not. The notes only call the duration short; this yard keeps it 30 seconds. It does not replace a Stoneskin spell. That spell replaces this shell. Holy's potency bonus is an unnumbered note, so it is not applied. Cumulative enmity 1, volatile enmity 80. Main job only.",
  },
  {
    name: "Afflatus Misery",
    level: 40,
    recast: 60,
    duration: 7200,
    access: "main",
    effect: "Stance for 2:00:00. Recast 1:00. Replaces Afflatus Solace. The most recent HP you actually lose is recorded. A 0-damage hit does not replace it. Cura spends that record. The HP bonus is an unnumbered note, so it is not added. Banish's potency bonus is an unnumbered note, so it is not applied. Main job only.",
  },
  {
    name: "Martyr",
    level: 75,
    recast: 600,
    duration: 0,
    access: "main",
    merit: true,
    effect: "Merit ability. Not unlocked. Base, before merits: 25% of your current HP, doubled onto a party member. Recast 10:00.",
  },
  {
    name: "Devotion",
    level: 75,
    recast: 600,
    duration: 0,
    access: "main",
    merit: true,
    effect: "Merit ability. Not unlocked. Base, before merits: sacrifices HP to grant a party member MP. Recast 10:00.",
  },
];

export const WHM_TRAITS: WhmTrait[] = [
  { name: "Magic Defense Bonus", level: 10, access: "sub", effect: "Magic Defense Bonus +10. The next tier replaces this." },
  { name: "Clear Mind", level: 20, access: "sub", effect: "+3 MP per tick while resting. The next tier replaces this." },
  { name: "Tranquil Heart", level: 21, access: "sub", effect: "Healing magic generates less enmity, from Healing Magic skill, up to −25% at 500 skill. Cure enmity is not numbered here, so the reduction is not applied." },
  { name: "Auto Regen", level: 25, access: "sub", effect: "1 HP every 3 seconds. The next tier is 76 and is not in this kit." },
  { name: "Magic Defense Bonus II", level: 30, access: "sub", effect: "Magic Defense Bonus +12. Replaces the earlier tier." },
  { name: "Clear Mind II", level: 35, access: "sub", effect: "+6 MP per tick while resting. Replaces Clear Mind." },
  { name: "Clear Mind III", level: 50, access: "master-sub", effect: "+9 MP per tick while resting. A support job needs master levels." },
  { name: "Divine Veil", level: 50, access: "master-sub", effect: "With Divine Seal up, an ailment-removing spell covers a small radius. Those spells are not in this kit." },
  { name: "Magic Defense Bonus III", level: 50, access: "master-sub", effect: "Magic Defense Bonus +14. A support job needs master levels." },
  { name: "Divine Benison", level: 50, access: "master-sub", effect: "Status-recovery spells cast 10% faster and generate 5 less enmity. A support job needs master levels. Those spells are not in this kit." },
  { name: "Divine Benison II", level: 60, access: "main", effect: "Status-recovery spells cast 20% faster and generate 10 less enmity. Main job only." },
  { name: "Clear Mind IV", level: 65, access: "main", effect: "+12 MP per tick while resting. Main job only. Replaces the earlier tier." },
  { name: "Magic Defense Bonus IV", level: 70, access: "main", effect: "Magic Defense Bonus +16. Main job only." },
  { name: "Divine Benison III", level: 70, access: "main", effect: "Status-recovery spells cast 30% faster and generate 15 less enmity. Main job only." },
  { name: "Animus Solace", level: 75, access: "main", effect: "Enhances Afflatus Solace. Main job only. Merit ranks would add to that cure stoneskin. No ranks are unlocked, so the extra is not applied." },
  { name: "Animus Misery", level: 75, access: "main", effect: "Enhances Afflatus Misery. Main job only. Merit ranks are not unlocked. Cura's bonus stays the unnumbered note." },
];

/** Combat and magic skills from the White Mage job page. No rank means 0. */
export const WHM_SKILLS: WhmSkill[] = [
  { name: "Club", rank: "B+" },
  { name: "Staff", rank: "C+" },
  { name: "Throwing", rank: "E" },
  { name: "Evasion", rank: "E" },
  { name: "Shield", rank: "D" },
  { name: "Divine Magic", rank: "A" },
  { name: "Healing Magic", rank: "A+" },
  { name: "Enhancing Magic", rank: "C+" },
  { name: "Enfeebling Magic", rank: "C" },
];

export function whmSkill(name: string, level: number): number {
  const row = WHM_SKILLS.find((skill) => skill.name === name);
  return row ? skillCap(row.rank, level) : 0;
}

/** Highest Magic Defense Bonus. A normal subjob stops before the level-50 tier. */
export function magicDefenseBonus(level: number, access: "main" | "sub"): number {
  if (access === "main") {
    if (level >= 70) return 16;
    if (level >= 50) return 14;
    if (level >= 30) return 12;
    if (level >= 10) return 10;
    return 0;
  }
  if (level >= 30) return 12;
  if (level >= 10) return 10;
  return 0;
}

/** Clear Mind MP added while resting. A normal subjob stops before the level-50 tier. */
export function whmClearMind(level: number, access: "main" | "sub"): number {
  if (access === "main") {
    if (level >= 65) return 12;
    if (level >= 50) return 9;
    if (level >= 35) return 6;
    if (level >= 20) return 3;
    return 0;
  }
  if (level >= 35) return 6;
  if (level >= 20) return 3;
  return 0;
}

/** Auto Regen HP per 3-second tick. Tier II is level 76. */
export function autoRegen(level: number): number {
  return level >= 25 ? 1 : 0;
}

export function assertWhm(): void {
  const naked = characterBase("hume", "WHM", 75);
  if (
    naked.hp !== 971 ||
    naked.mp !== 540 ||
    naked.str !== 56 ||
    naked.dex !== 48 ||
    naked.vit !== 56 ||
    naked.agi !== 53 ||
    naked.int !== 53 ||
    naked.mnd !== 70 ||
    naked.chr !== 61
  ) {
    throw new Error(`Hume WHM 75 ${naked.hp}/${naked.mp}/${naked.str}/${naked.dex}/${naked.vit}/${naked.agi}/${naked.int}/${naked.mnd}/${naked.chr}`);
  }
  if (magicDefenseBonus(75, "main") !== 16 || magicDefenseBonus(37, "sub") !== 12 || magicDefenseBonus(9, "main") !== 0) {
    throw new Error("Magic Defense Bonus");
  }
  if (whmClearMind(75, "main") !== 12 || whmClearMind(37, "sub") !== 6 || whmClearMind(49, "sub") !== 6) {
    throw new Error("WHM Clear Mind");
  }
  if (autoRegen(24) !== 0 || autoRegen(75) !== 1) throw new Error("Auto Regen");
  if (whmSkill("Club", 75) !== 256 || whmSkill("Staff", 75) !== 230 || whmSkill("Healing Magic", 75) !== 276 || whmSkill("Divine Magic", 75) !== 269) {
    throw new Error("WHM skill caps");
  }
  if (whmSkill("Enhancing Magic", 75) !== 230 || whmSkill("Enfeebling Magic", 75) !== 225 || whmSkill("Shield", 75) !== 210 || whmSkill("Sword", 75) !== 0) {
    throw new Error("WHM other skills");
  }
  if (WHM_ABILITIES.some((ability) => ability.level > 75 || ability.name === "Asylum" || ability.name === "Sacrosanctity")) {
    throw new Error("past-75 ability");
  }
  const martyr = WHM_ABILITIES.find((ability) => ability.name === "Martyr");
  const devotion = WHM_ABILITIES.find((ability) => ability.name === "Devotion");
  if (!martyr?.merit || !devotion?.merit || martyr.level !== 75 || devotion.level !== 75) {
    throw new Error("Martyr and Devotion stay merit-locked");
  }
}
