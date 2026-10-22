// @ts-nocheck
import { CHAIN_PROPERTIES } from "./skillchain";
/**
 * Restored from the last compiled copy after a bad write.
 * Types below are the ones other files import. The data is unchanged.
 */
export type StatKey = "str" | "dex" | "vit" | "agi" | "int" | "mnd" | "chr";

export type WsBonus =
  | { type: "damageHp"; rate: readonly number[] }
  | { type: "damageMp" }
  | { type: "skillMp"; rate: number; mult: readonly number[]; fromTarget: boolean }
  | { type: "pools"; hp: readonly number[]; mp: readonly number[] };

export type SwordWs = {
  name: string;
  motion?: string;
  skill: number | null;
  level?: number;
  jobs: readonly string[];
  hits: number;
  mods: Partial<Record<StatKey, number>>;
  ftp?: readonly number[];
  element?: string;
  chains: readonly string[];
  effect: string;
  kind: "physical" | "magical" | "breath" | "drain";
  radius?: readonly number[];
  hpRatio?: readonly number[];
  unavoidable?: boolean;
  warWeapons?: readonly string[];
  mainOnly?: boolean;
  replicating?: boolean;
  quest?: string;
  weapons?: readonly string[];
  drain?: readonly number[];
  bonus?: WsBonus;
  aftermath?: string;
  requires?: readonly string[];
  attackBonus?: readonly number[];
  defenseIgnored?: readonly number[];
  /** Ranged accuracy added at 1000 / 2000 / 3000 TP. Sidewinder's 3000 cell is blank, so it stays at the 2000 value. */
  rangedAcc?: readonly number[];
  critBonus?: readonly number[];
  self?: boolean;
  bypassSkill?: boolean;
  /** Level required when the skill is granted by its weapon list instead of the job. Exalted Bow and Kaja Bow are 99. */
  weaponLevel?: number;
};

export type DaggerWs = SwordWs;

export type WsContext = {
  job: string;
  main: boolean;
  level: number;
  skill: number;
  weaponName: string;
  quests: readonly string[];
  sub?: string | null;
  subLevel?: number;
};

/**
 * Sword weapon skills from the BG-Wiki sword category and the individual
 * pages checked for jobs, fTP, and Spirits Within.
 *
 * A level 75 Warrior with sword skill 250 and no quest weapon is offered
 * only the nine skills that job can actually use. The others stay here.
 *
 * Scaled fTP applies to the first hit. A single fTP value applies to every
 * hit. Swift Blade is the one marked replicating, so its fTP is on every hit.
 * Secondary hits of a scaled skill use fTP 1. pDIF is the sword auto-attack
 * roll. Magical skills keep their modifiers and do not use that physical roll.
 */



/**
 * A result that belongs to the weapon skill itself.
 * damageMp and damageHp use the damage the skill already dealt.
 * skillMp is floor(skill × rate) plus the weapon skill's stat modifier, times the TP multiplier.
 * pools is a fraction of maximum HP and MP.
 */






const SWORD_JOBS = ["PLD", "BLU", "RUN", "RDM", "WAR", "COR", "DRK", "SAM", "NIN", "BRD", "DRG", "DNC", "RNG", "THF", "BST"];







































































export const SWORD_SKILLS: readonly SwordWs[] = [
{ name: "Fast Blade", motion: "Fast Blade", skill: 5, jobs: SWORD_JOBS, hits: 2, mods: { str: 0.4, dex: 0.4 }, ftp: [1, 3, 5], chains: ["Scission"], effect: "Twofold attack. Damage varies with TP.", kind: "physical" },
{ name: "Burning Blade", motion: "Burning Blade", skill: 30, level: 10, jobs: SWORD_JOBS, hits: 1, mods: { str: 0.4, int: 0.4 }, ftp: [1, 2 + 25 / 256, 3 + 102 / 256], element: "Fire", chains: ["Liquefaction"], effect: "Fire elemental damage. Damage varies with TP.", kind: "magical" },
{ name: "Red Lotus Blade", motion: "Red Lotus Blade", skill: 50, jobs: ["WAR", "RDM", "PLD", "DRK", "BLU", "RUN"], hits: 1, mods: { str: 0.4, int: 0.4 }, ftp: [1, 2 + 98 / 256, 3.75], element: "Fire", chains: ["Liquefaction", "Detonation"], effect: "Fire elemental damage. Damage varies with TP.", kind: "magical" },
{ name: "Flat Blade", motion: "Flat Blade", skill: 75, jobs: SWORD_JOBS, hits: 1, mods: { str: 1 }, chains: ["Impaction"], effect: "Stuns the target. The chance varies with TP.", kind: "physical" },
{ name: "Shining Blade", motion: "Shining Blade", skill: 100, jobs: SWORD_JOBS, hits: 1, mods: { str: 0.4, mnd: 0.4 }, ftp: [1.125, 2 + 57 / 256, 3 + 134 / 256], element: "Light", chains: ["Scission"], effect: "Light elemental damage. Damage varies with TP.", kind: "magical" },
{ name: "Seraph Blade", motion: "Seraph Blade", skill: 125, jobs: ["WAR", "RDM", "PLD", "DRK", "BLU", "RUN"], hits: 1, mods: { str: 0.4, mnd: 0.4 }, ftp: [1.125, 2.625, 4.125], element: "Light", chains: ["Scission"], effect: "Light elemental damage. Damage varies with TP.", kind: "magical" },
{ name: "Circle Blade", motion: "Circle Blade", skill: 150, jobs: SWORD_JOBS, hits: 1, mods: { str: 1 }, ftp: [1], radius: [4, 4, 5], chains: ["Reverberation", "Impaction"], effect: "Area attack. Radius 4y / 4y / 5y. fTP 1.", kind: "physical" },
{ name: "Spirits Within", motion: "Spirits Within", skill: 175, level: 56, jobs: SWORD_JOBS, hits: 1, mods: {}, hpRatio: [0.125, 0.5, 1], unavoidable: true, chains: [], effect: "Unavoidable breath damage from current HP: 12.5% / 50% / 100%. Ignores defense and evasion.", kind: "breath" },
{ name: "Vorpal Blade", motion: "Vorpal Blade", skill: 200, level: 62, jobs: ["WAR", "RDM", "PLD", "DRK", "BLU", "RUN"], hits: 4, mods: { str: 0.6 }, ftp: [1.375], chains: ["Scission", "Impaction"], effect: "Fourfold attack. Critical hit chance varies with TP.", kind: "physical" },
{ name: "Swift Blade", motion: "Swift Blade", skill: 225, jobs: ["PLD", "RUN"], warWeapons: ["Hepatizon Sapara", "Hepatizon Sapara +1", "Hepatizon Rapier", "Hepatizon Rapier +1"], mainOnly: true, hits: 3, mods: { str: 0.5, mnd: 0.5 }, ftp: [1.5], replicating: true, chains: ["Gravitation"], effect: "Threefold attack. Accuracy varies with TP. Paladin or Rune Fencer main, or the listed swords.", kind: "physical" },
{ name: "Savage Blade", motion: "Savage Blade", skill: 240, level: 73, jobs: ["WAR", "RDM", "PLD", "DRK", "BLU", "COR", "RUN"], mainOnly: true, quest: "Old Wounds", hits: 2, mods: { str: 0.5, mnd: 0.5 }, ftp: [4, 10.25, 13.75], chains: ["Fragmentation", "Scission"], effect: "Twofold attack. Damage varies with TP. Unlock quest: Old Wounds.", kind: "physical" },
{ name: "Sanguine Blade", skill: 300, level: 85, jobs: ["WAR", "RDM", "PLD", "DRK", "BLU", "RUN"], hits: 1, mods: { str: 0.3, mnd: 0.5 }, ftp: [2.75], drain: [0.5, 1, 1.6], bonus: { type: "damageHp", rate: [0.5, 1, 1.6] }, chains: [], effect: "Converts 50% / 100% / 160% of damage dealt to HP. fTP 2.75. Undead do not heal the user.", kind: "drain" },
{ name: "Requiescat", skill: 357, jobs: ["WAR", "RDM", "PLD", "DRK", "SAM", "BLU", "COR", "RUN"], mainOnly: true, hits: 5, mods: { mnd: 0.73 }, chains: ["Gravitation", "Scission"], aftermath: "Darkness", effect: "Fivefold non-elemental attack. MND is 73% / 76% / 79% / 82% / 85%. Attack strength varies with TP.", kind: "physical" },
{ name: "Knights of Round", skill: null, jobs: ["WAR", "RDM", "PLD", "DRK", "BLU", "RUN"], warWeapons: ["Caliburn", "Excalibur", "Corbenic Sword"], hits: 1, mods: { str: 0.4, mnd: 0.4 }, chains: ["Light", "Fusion"], effect: "Relic skill. Regen +10 HP/tick on Caliburn and Excalibur. Aftermath duration varies with TP.", kind: "physical" },
{ name: "Chant du Cygne", skill: null, jobs: ["RDM", "PLD", "BLU"], hits: 3, mods: { dex: 0.8 }, chains: ["Light", "Distortion"], effect: "Threefold attack. Critical hit chance varies with TP. Empyrean. Red Mage, Paladin, or Blue Mage only.", kind: "physical" },
{ name: "Death Blossom", skill: null, jobs: ["RDM"], mainOnly: true, hits: 3, mods: { str: 0.3, mnd: 0.5 }, ftp: [4], chains: ["Fragmentation", "Distortion"], effect: "Threefold attack that can lower magic evasion. The chance varies with TP. Mythic, Red Mage only.", kind: "physical" },
{ name: "Atonement", skill: null, jobs: ["PLD"], mainOnly: true, hits: 2, mods: {}, chains: ["Fusion", "Reverberation"], effect: "Twofold breath attack from current enmity. Enmity multiplier 1.0 / 1.5 / 2.0. Mythic, Paladin main only.", kind: "breath" },
{ name: "Expiacion", skill: null, jobs: ["BLU"], mainOnly: true, hits: 2, mods: { str: 0.3, int: 0.3, dex: 0.2 }, ftp: [3.796875, 9.390625, 12.1875], chains: ["Distortion", "Scission"], effect: "Twofold attack. Damage varies with TP. Mythic, Blue Mage main only.", kind: "physical" },
{ name: "Uriel Blade", skill: null, jobs: SWORD_JOBS, warWeapons: ["Griffinclaw"], hits: 1, mods: { str: 0.32, mnd: 0.32 }, element: "Light", chains: ["Light", "Fragmentation", "Scission"], effect: "Area light damage. Additional effect: Flash. Campaign only, Griffinclaw equipped.", kind: "magical" },
{ name: "Glory Slash", skill: null, jobs: SWORD_JOBS, warWeapons: ["Lex Talionis"], hits: 1, mods: {}, chains: ["Light", "Fusion"], effect: "Area attack, triple damage. Additional effect: Stun. Campaign only, Lex Talionis equipped.", kind: "physical" },
{ name: "Fast Blade II", skill: null, jobs: SWORD_JOBS, warWeapons: ["Onion Sword III"], hits: 2, mods: { dex: 0.8 }, chains: ["Fusion"], effect: "Twofold attack. Damage varies with TP. Requires Onion Sword III.", kind: "physical" }];

























/**
 * Black Mage weapon skills. The Warrior checkers stay Warrior-only.
 * A quest tag does not lock the skill, matching the Warrior lists.
 * Main-only means Black Mage has to be the main job.
 */
export function blmCanUse(ws, ctx) {
  if (ctx.job !== "BLM") return `${ws.name} is not checked for this job.`;
  if (!ws.jobs.includes("BLM")) return `${ws.name} is not a Black Mage weapon skill.`;
  if (ws.mainOnly && !ctx.main) return `${ws.name} requires Black Mage as the main job.`;
  if (ws.level != null && ctx.level < ws.level) return `${ws.name} requires level ${ws.level}.`;
  const onWeapon = ws.weapons?.includes(ctx.weaponName) === true || ws.warWeapons?.includes(ctx.weaponName) === true;
  if (ws.skill != null && ctx.skill < ws.skill && !(ws.bypassSkill && onWeapon)) {
    return `${ws.name} needs skill ${ws.skill}.`;
  }
  if (ws.skill == null && !onWeapon) return `${ws.name} needs its weapon.`;
  return null;
}

/** White Mage weapon skills through level 75. Same gates as Black Mage, on this job. */
export function whmCanUse(ws, ctx) {
  if (ctx.job !== "WHM") return `${ws.name} is not checked for this job.`;
  if (!ws.jobs.includes("WHM")) return `${ws.name} is not a White Mage weapon skill.`;
  if (ws.mainOnly && !ctx.main) return `${ws.name} requires White Mage as the main job.`;
  if (ws.level != null && ctx.level < ws.level) return `${ws.name} requires level ${ws.level}.`;
  const onWeapon = ws.weapons?.includes(ctx.weaponName) === true || ws.warWeapons?.includes(ctx.weaponName) === true;
  if (ws.skill != null && ctx.skill < ws.skill && !(ws.bypassSkill && onWeapon)) {
    return `${ws.name} needs skill ${ws.skill}.`;
  }
  if (ws.skill == null && !onWeapon) return `${ws.name} needs its weapon.`;
  return null;
}

/** Red Mage weapon skills through level 75. A quest tag does not lock the skill. */
export function rdmCanUse(ws, ctx) {
  if (ctx.job !== "RDM") return `${ws.name} is not checked for this job.`;
  if (!ws.jobs.includes("RDM")) return `${ws.name} is not a Red Mage weapon skill.`;
  if (ws.requires && !ws.requires.includes(ctx.job) && !(ctx.sub && ws.requires.includes(ctx.sub))) {
    return `${ws.name} requires ${ws.requires.join(" or ")} as main or sub.`;
  }
  if (ws.mainOnly && !ctx.main) return `${ws.name} requires Red Mage as the main job.`;
  if (ws.level != null && ctx.level < ws.level) return `${ws.name} requires level ${ws.level}.`;
  const onWeapon = ws.weapons?.includes(ctx.weaponName) === true || ws.warWeapons?.includes(ctx.weaponName) === true;
  if (ws.skill != null && ctx.skill < ws.skill && !(ws.bypassSkill && onWeapon)) {
    return `${ws.name} needs skill ${ws.skill}.`;
  }
  if (ws.skill == null && !onWeapon) return `${ws.name} needs its weapon.`;
  return null;
}

/** Monk weapon skills through level 75. A quest tag does not lock the skill. */
export function mnkCanUse(ws, ctx) {
  if (ctx.job !== "MNK") return `${ws.name} is not checked for this job.`;
  if (!ws.jobs.includes("MNK")) return `${ws.name} is not a Monk weapon skill.`;
  if (ws.requires && !ws.requires.includes("MNK") && !(ctx.sub && ws.requires.includes(ctx.sub))) {
    return `${ws.name} requires ${ws.requires.join(" or ")} as main or sub.`;
  }
  if (ws.mainOnly && !ctx.main) return `${ws.name} requires Monk as the main job.`;
  if (ws.level != null && ctx.level < ws.level) return `${ws.name} requires level ${ws.level}.`;
  const onWeapon = ws.weapons?.includes(ctx.weaponName) === true || ws.warWeapons?.includes(ctx.weaponName) === true;
  if (ws.skill != null && ctx.skill < ws.skill && !(ws.bypassSkill && onWeapon)) {
    return `${ws.name} needs skill ${ws.skill}.`;
  }
  if (ws.skill == null && !onWeapon) return `${ws.name} needs its weapon.`;
  return null;
}

/** Thief weapon skills through level 75. A quest tag does not lock the skill. */
export function thfCanUse(ws, ctx) {
  if (ctx.job !== "THF") return `${ws.name} is not checked for this job.`;
  if (!ws.jobs.includes("THF")) return `${ws.name} is not a Thief weapon skill.`;
  if (ws.requires && !ws.requires.includes("THF") && !(ctx.sub && ws.requires.includes(ctx.sub))) {
    return `${ws.name} requires ${ws.requires.join(" or ")} as main or sub.`;
  }
  if (ws.mainOnly && !ctx.main) return `${ws.name} requires Thief as the main job.`;
  if (ws.level != null && ctx.level < ws.level) return `${ws.name} requires level ${ws.level}.`;
  const onWeapon = ws.weapons?.includes(ctx.weaponName) === true || ws.warWeapons?.includes(ctx.weaponName) === true;
  if (ws.skill != null && ctx.skill < ws.skill && !(ws.bypassSkill && onWeapon)) {
    return `${ws.name} needs skill ${ws.skill}.`;
  }
  if (ws.skill == null && !onWeapon) return `${ws.name} needs its weapon.`;
  return null;
}

export function swordByName(name) {
  return SWORD_SKILLS.find((ws) => ws.name === name);
}

export function warCanUse(ws, ctx) {
  if (ctx.job !== "WAR") return `${ws.name} is not checked for this job.`;
  const onWeapon = ws.warWeapons?.includes(ctx.weaponName) === true;
  if (!ws.jobs.includes("WAR") && !onWeapon) {
    return ws.warWeapons ? `${ws.name} needs ${ws.warWeapons.join(" or ")}.` : `${ws.name} is not a Warrior weapon skill.`;
  }
  if (ws.mainOnly && !ctx.main) return `${ws.name} requires Warrior as the main job.`;
  if (ws.level != null && ctx.level < ws.level) return `${ws.name} requires level ${ws.level}.`;
  if (ws.skill != null && ctx.skill < ws.skill) return `${ws.name} needs Sword skill ${ws.skill}.`;
  if (ws.skill == null && !onWeapon) return `${ws.name} needs ${ws.warWeapons?.join(" or ") ?? "its weapon"}.`;
  return null;
}

/** Sword skills this Warrior can put on the bar. */
export function warSwordList(ctx) {
  return SWORD_SKILLS.filter((ws) => warCanUse(ws, ctx) === null);
}

const GA_JOBS = ["WAR", "DRK", "RUN"];



/**
 * Great Axe weapon skills from the BG-Wiki category and the skill pages.
 * A level 75 Warrior has Great Axe 276, so Fell Cleave (300) and everything
 * past it stay in the database and off the bar. A quest tag is kept, but
 * it does not lock the skill.
 */
export const GREAT_AXE_SKILLS: readonly SwordWs[] = [
{ name: "Shield Break", motion: "Shield Break", skill: 5, level: 1, jobs: GA_JOBS, hits: 1, mods: { str: 0.6, vit: 0.6 }, ftp: [1], chains: ["Impaction"], effect: "Lowers evasion by 40. Duration 180s / 240s / 300s.", kind: "physical" },
{ name: "Iron Tempest", motion: "Iron Tempest", skill: 40, level: 13, jobs: GA_JOBS, hits: 1, mods: { str: 0.6 }, ftp: [1], attackBonus: [0, 1, 2.5], chains: ["Scission"], effect: "Damage varies with TP. Attack +0% / +100% / +250%.", kind: "physical" },
{ name: "Sturmwind", motion: "Sturmwind", skill: 70, level: 23, jobs: GA_JOBS, hits: 2, mods: { str: 0.6 }, ftp: [1], attackBonus: [0, 1, 2.5], chains: ["Reverberation", "Scission"], effect: "Twofold attack. Attack +0% / +100% / +250%.", kind: "physical" },
{ name: "Armor Break", motion: "Armor Break", skill: 100, level: 33, jobs: GA_JOBS, hits: 1, mods: { str: 0.6, vit: 0.6 }, ftp: [1], chains: ["Impaction"], effect: "Lowers defense by 25%. Duration 180s / 360s / 540s.", kind: "physical" },
{ name: "Keen Edge", motion: "Keen Edge", skill: 150, level: 49, jobs: GA_JOBS, hits: 1, mods: { str: 1 }, ftp: [1], chains: ["Compression"], effect: "Critical hit chance varies with TP.", kind: "physical" },
{ name: "Weapon Break", motion: "Weapon Break", skill: 175, level: 55, jobs: GA_JOBS, hits: 1, mods: { str: 0.6, vit: 0.6 }, ftp: [1], chains: ["Impaction"], effect: "Lowers attack by 25%. Duration 180s / 240s / 300s.", kind: "physical" },
{ name: "Raging Rush", motion: "Raging Rush", skill: 200, level: 60, jobs: ["WAR"], mainOnly: true, hits: 3, mods: { str: 0.5 }, ftp: [1], critBonus: [0.15, 0.3, 0.5], chains: ["Induration", "Reverberation"], effect: "Threefold attack. Critical hit rate +15% / +30% / +50%. Warrior only.", kind: "physical" },
{ name: "Full Break", motion: "Full Break", skill: 225, level: 65, jobs: ["WAR"], mainOnly: true, hits: 1, mods: { str: 0.5, vit: 0.5 }, ftp: [1], chains: ["Distortion"], effect: "Lowers attack and defense by 12.5%, and evasion and accuracy by 20. Duration 180s / 360s / 720s. Dark Knight and Rune Fencer need a Hepatizon Axe.", kind: "physical" },
{ name: "Steel Cyclone", motion: "Steel Cyclone", skill: 240, level: 68, jobs: GA_JOBS, mainOnly: true, quest: "The Weight of Your Limits", weapons: ["Kaja Chopper", "Lycurgos"], hits: 1, mods: { str: 0.6, vit: 0.6 }, ftp: [1.5, 2.5, 4], chains: ["Distortion", "Detonation"], effect: "Damage varies with TP. Warrior, Dark Knight, or Rune Fencer main, after The Weight of Your Limits. Kaja Chopper or Lycurgos can grant it.", kind: "physical" },
{ name: "Fell Cleave", motion: "Fell Cleave", skill: 300, level: 80, jobs: GA_JOBS, mainOnly: true, hits: 1, mods: { str: 0.6 }, ftp: [2.75], radius: [4, 4, 5], chains: ["Scission", "Detonation", "Impaction"], effect: "Area attack. Radius 4y / 4y / 5y. fTP 2.75.", kind: "physical" },
{ name: "Upheaval", motion: "Upheaval", skill: 357, level: 90, jobs: GA_JOBS, mainOnly: true, hits: 4, mods: { vit: 0.73 }, ftp: [1, 3.5, 6.5], chains: ["Fusion", "Compression"], aftermath: "Light", effect: "Fourfold attack. VIT is 73% / 76% / 79% / 82% / 85%. Aeonic.", kind: "physical" },
{ name: "Metatron Torment", skill: null, jobs: ["WAR"], weapons: ["Bravura", "Abaddon Killer", "Barbarus Bhuj"], hits: 1, mods: { str: 0.8 }, ftp: [2.75], chains: ["Light", "Fusion"], effect: "Lowers defense by 18.75% for 2 minutes. Relic. Bravura aftermath lowers damage taken. The page lists no skill number.", kind: "physical" },
{ name: "Ukko's Fury", skill: null, jobs: ["WAR"], mainOnly: true, quest: "Kupofried's Weapon Skill Moogle Magic", weapons: ["Ukonvasara", "Maschu", "Maschu +1", "Maschu +2", "Maschu +3", "Shamash"], hits: 2, mods: { str: 0.8 }, ftp: [2], critBonus: [0.2, 0.35, 0.65], chains: ["Light", "Fragmentation"], effect: "Twofold attack. Critical hit rate +20% / +35% / +65%. Additional effect: Slow 15%. Empyrean. The page lists no skill number.", kind: "physical" },
{ name: "King's Justice", skill: null, jobs: ["WAR"], mainOnly: true, quest: "Unlocking a Myth (Warrior)", weapons: ["Conqueror"], hits: 3, mods: { str: 0.5 }, ftp: [1, 3, 5], chains: ["Fragmentation", "Scission"], effect: "Threefold attack. Damage varies with TP. Mythic, Conqueror, Warrior main. The page lists no skill number.", kind: "physical" },
{ name: "Disaster", skill: null, jobs: ["WAR"], weapons: ["Laphria"], hits: 1, mods: { str: 0.6, vit: 0.6 }, chains: ["Transfixion", "Scission", "Gravitation"], effect: "Prime, Laphria. fTP 3.05 at 1000 TP and 9.15 at 3000 TP.", kind: "physical" }];


export function greatAxeByName(name) {
  return GREAT_AXE_SKILLS.find((ws) => ws.name === name);
}

export function warCanUseGreatAxe(ws, ctx) {
  if (ctx.job !== "WAR") return `${ws.name} is not checked for this job.`;
  const onWeapon = ws.weapons?.includes(ctx.weaponName) === true;
  if (!ws.jobs.includes("WAR") && !onWeapon) {
    return ws.weapons ? `${ws.name} needs ${ws.weapons.join(" or ")}.` : `${ws.name} is not a Warrior weapon skill.`;
  }
  if (ws.mainOnly && !ctx.main) return `${ws.name} requires Warrior as the main job.`;
  if (ws.level != null && ctx.level < ws.level) return `${ws.name} requires level ${ws.level}.`;
  if (ws.skill != null && ctx.skill < ws.skill && !onWeapon) return `${ws.name} needs Great Axe skill ${ws.skill}.`;
  if (ws.skill == null && !onWeapon) return `${ws.name} needs ${ws.weapons?.join(" or ") ?? "its weapon"}.`;
  return null;
}

/** Great Axe skills this Warrior can put on the bar. */
export function warGreatAxeList(ctx) {
  return GREAT_AXE_SKILLS.filter((ws) => warCanUseGreatAxe(ws, ctx) === null);
}

const GS_JOBS = ["WAR", "PLD", "DRK", "RUN"];



/**
 * Great Sword weapon skills from the BG-Wiki category and the skill pages.
 * A level 75 Warrior has Great Sword 256. A quest tag is kept and does not lock the skill.
 */
export const GREAT_SWORD_SKILLS: readonly SwordWs[] = [
{ name: "Hard Slash", motion: "Hard Slash", skill: 5, level: 1, jobs: GS_JOBS, hits: 1, mods: { str: 1 }, ftp: [1.5, 2.5, 3.5], chains: ["Scission"], effect: "Single attack. Damage varies with TP.", kind: "physical" },
{ name: "Power Slash", motion: "Power Slash", skill: 30, level: 10, jobs: GS_JOBS, hits: 1, mods: { str: 0.6, vit: 0.6 }, ftp: [1], chains: ["Transfixion"], effect: "Critical hit chance varies with TP.", kind: "physical" },
{ name: "Frostbite", motion: "Frostbite", skill: 70, level: 24, jobs: GS_JOBS, hits: 1, mods: { str: 0.4, int: 0.4 }, ftp: [1.5, 3.25, 5], element: "Ice", chains: ["Induration"], effect: "Ice elemental damage. Damage varies with TP.", kind: "magical" },
{ name: "Freezebite", motion: "Freezebite", skill: 100, level: 34, jobs: GS_JOBS, hits: 1, mods: { str: 0.4, int: 0.4 }, ftp: [1.5, 3.5, 6], element: "Ice", chains: ["Induration", "Detonation"], effect: "Ice elemental damage. Damage varies with TP.", kind: "magical" },
{ name: "Shockwave", motion: "Shockwave", skill: 150, level: 51, jobs: GS_JOBS, hits: 1, mods: { str: 0.3, mnd: 0.3 }, ftp: [1], chains: ["Reverberation"], effect: "Area attack. Sleeps enemies. Duration varies with TP.", kind: "physical" },
{ name: "Crescent Moon", motion: "Crescent Moon", skill: 175, level: 56, jobs: GS_JOBS, hits: 1, mods: { str: 0.8 }, ftp: [1, 2.25, 4], chains: ["Scission"], effect: "Single attack. Damage varies with TP.", kind: "physical" },
{ name: "Sickle Moon", motion: "Sickle Moon", skill: 200, level: 62, jobs: ["DRK", "RUN", "PLD"], mainOnly: true, hits: 2, mods: { str: 0.4, agi: 0.4 }, ftp: [1.5, 3.5, 6.5], chains: ["Scission", "Impaction"], effect: "Twofold attack. Damage varies with TP. Dark Knight, Rune Fencer, or Paladin main only.", kind: "physical" },
{ name: "Spinning Slash", motion: "Spinning Slash", skill: 225, level: 69, jobs: ["PLD", "DRK", "RUN"], mainOnly: true, weapons: ["Beryllium Sword", "Beryllium Sword +1"], hits: 1, mods: { str: 0.3, int: 0.3 }, ftp: [2.5, 5, 7.5], chains: ["Fragmentation"], effect: "Damage varies with TP. Paladin, Dark Knight, or Rune Fencer main. Rune Fencer learns it at 65, Dark Knight at 66, Paladin at 69. Warrior needs a Beryllium Sword.", kind: "physical" },
{ name: "Ground Strike", motion: "Ground Strike", skill: 250, level: 74, jobs: GS_JOBS, mainOnly: true, quest: "Inheritance", bypassSkill: true, weapons: ["Kaja Claymore", "Nandaka"], hits: 1, mods: { str: 0.5, int: 0.5 }, ftp: [1.5, 3, 5], attackBonus: [0.75, 0.75, 0.75], chains: ["Fragmentation", "Distortion"], effect: "Single attack. Damage varies with TP. Attack modifier 1.75. Unlock quest: Inheritance. Kaja Claymore or Nandaka can grant it.", kind: "physical" },
{ name: "Herculean Slash", motion: "Herculean Slash", skill: 290, level: 82, jobs: GS_JOBS, hits: 1, mods: { vit: 0.8 }, ftp: [3.5], element: "Ice", chains: ["Induration", "Impaction", "Detonation"], effect: "Ice elemental damage. Paralyzes the target for 60s / 120s / 180s.", kind: "magical" },
{ name: "Resolution", motion: "Resolution", skill: 357, level: 96, jobs: GS_JOBS, hits: 5, mods: { str: 0.73 }, ftp: [0.71875, 1.5, 2.25], replicating: true, chains: ["Fragmentation", "Scission"], aftermath: "Light", effect: "Fivefold attack. STR is 73% / 76% / 79% / 82% / 85%. fTP replicates. Light requires Aeonic Aftermath.", kind: "physical" },
{ name: "Scourge", skill: null, jobs: ["WAR", "PLD", "DRK"], weapons: ["Valhalla", "Ragnarok", "Khloros Blade"], hits: 1, mods: { str: 0.4, vit: 0.4 }, ftp: [3], chains: ["Light", "Fusion"], effect: "Additional effect: Critical Hit Rate +5% for 20s / 40s / 60s. Relic. The page lists no skill number.", kind: "physical" },
{ name: "Torcleaver", skill: null, jobs: ["PLD", "DRK"], mainOnly: true, hits: 1, mods: { vit: 0.8 }, ftp: [4.75, 7.5, 9.765625], chains: ["Light", "Distortion"], effect: "Deals triple damage. Damage varies with TP. Empyrean. Paladin or Dark Knight main only, with Caladbolg, Espafut, or Xiphias.", kind: "physical" },
{ name: "Dimidiation", skill: null, jobs: ["RUN"], mainOnly: true, quest: "Rune Fencing the Night Away", hits: 2, mods: { dex: 0.8 }, ftp: [2.25, 4.5, 6.75], attackBonus: [0.25, 0.25, 0.25], chains: ["Light", "Fragmentation"], effect: "Twofold attack. Damage varies with TP. Attack modifier 1.25. Rune Fencer main only.", kind: "physical" },
{ name: "Fimbulvetr", skill: null, level: 99, jobs: GS_JOBS, weapons: ["Helheim"], hits: 1, mods: { str: 0.6, vit: 0.6 }, ftp: [3.3, 6.6, 9.9], chains: ["Detonation", "Compression", "Distortion"], effect: "Damage varies with TP. Prime, Helheim. The page lists no skill number.", kind: "physical" }];


export function greatSwordByName(name) {
  return GREAT_SWORD_SKILLS.find((ws) => ws.name === name);
}

export function warCanUseGreatSword(ws, ctx) {
  if (ctx.job !== "WAR") return `${ws.name} is not checked for this job.`;
  const onWeapon = ws.weapons?.includes(ctx.weaponName) === true;
  if (!ws.jobs.includes("WAR") && !onWeapon) {
    return ws.weapons ? `${ws.name} needs ${ws.weapons.join(" or ")}.` : `${ws.name} is not a Warrior weapon skill.`;
  }
  if (ws.mainOnly && !ctx.main) return `${ws.name} requires Warrior as the main job.`;
  if (ws.level != null && ctx.level < ws.level) return `${ws.name} requires level ${ws.level}.`;
  if (ws.skill != null && ctx.skill < ws.skill && !(ws.bypassSkill && onWeapon)) return `${ws.name} needs Great Sword skill ${ws.skill}.`;
  if (ws.skill == null && !onWeapon) return `${ws.name} needs ${ws.weapons?.join(" or ") ?? "its weapon"}.`;
  return null;
}

/** Great Sword skills this Warrior can put on the bar. */
export function warGreatSwordList(ctx) {
  return GREAT_SWORD_SKILLS.filter((ws) => warCanUseGreatSword(ws, ctx) === null);
}

const H2H_OPEN = ["MNK", "PUP", "WAR", "THF", "NIN", "DNC"];



/**
 * Hand-to-hand weapon skills from the BG-Wiki pages.
 * A level 75 Warrior has Hand-to-Hand 210. A quest tag does not lock the skill.
 * One Inch Punch and Raging Fists still need Monk or Puppetmaster as main or sub.
 */
export const HAND_SKILLS: readonly SwordWs[] = [
{ name: "Combo", skill: 5, level: 2, jobs: H2H_OPEN, hits: 3, mods: { str: 0.3, dex: 0.3 }, ftp: [1, 3.75, 5.5], replicating: true, chains: ["Impaction"], effect: "Threefold attack. Damage varies with TP.", kind: "physical" },
{ name: "Shoulder Tackle", skill: 40, level: 15, jobs: H2H_OPEN, hits: 1, mods: { vit: 1 }, ftp: [1], chains: ["Impaction", "Reverberation"], effect: "Stuns the target. The chance varies with TP.", kind: "physical" },
{ name: "One Inch Punch", skill: 75, level: 28, jobs: H2H_OPEN, requires: ["MNK", "PUP"], hits: 1, mods: { vit: 1 }, ftp: [1], defenseIgnored: [0, 0.25, 0.5], chains: ["Compression"], effect: "Ignores defense by 0% / 25% / 50%. Monk or Puppetmaster must be main or sub.", kind: "physical" },
{ name: "Backhand Blow", skill: 100, level: 37, jobs: H2H_OPEN, hits: 1, mods: { str: 0.5, dex: 0.5 }, ftp: [1], chains: ["Detonation"], effect: "Critical hit chance varies with TP.", kind: "physical" },
{ name: "Raging Fists", skill: 125, jobs: H2H_OPEN, requires: ["MNK", "PUP"], hits: 5, mods: { str: 0.3, dex: 0.3 }, ftp: [1, 2.1875, 3.75], replicating: true, chains: ["Impaction"], effect: "Fivefold attack. Damage varies with TP. Monk or Puppetmaster must be main or sub.", kind: "physical" },
{ name: "Spinning Attack", skill: 150, level: 53, jobs: H2H_OPEN, hits: 1, mods: { str: 1 }, ftp: [1], radius: [4, 4, 5], chains: ["Liquefaction", "Impaction"], effect: "Area attack. Radius 4y / 4y / 5y.", kind: "physical" },
{ name: "Howling Fist", skill: 200, level: 60, jobs: ["MNK", "PUP"], hits: 2, mods: { str: 0.2, vit: 0.5 }, ftp: [2.05, 3.55, 5.75], replicating: true, chains: ["Transfixion", "Impaction"], effect: "Twofold attack. Damage varies with TP. Monk or Puppetmaster only.", kind: "physical" },
{ name: "Dragon Kick", skill: 225, level: 65, jobs: ["MNK", "PUP"], weapons: ["Hepatizon Baghnakhs", "Hepatizon Baghnakhs +1"], hits: 2, mods: { str: 0.5, vit: 0.5 }, ftp: [1.7, 3, 5], replicating: true, chains: ["Fragmentation"], effect: "Twofold attack. Damage varies with TP. Monk 65, skill 225. Other jobs need Hepatizon Baghnakhs.", kind: "physical" },
{ name: "Asuran Fists", skill: 250, level: 71, jobs: ["MNK", "PUP"], quest: "The Walls of Your Mind", weapons: ["Kaja Knuckles", "Karambit"], hits: 8, mods: { str: 0.15, vit: 0.15 }, ftp: [1.25], replicating: true, chains: ["Gravitation", "Liquefaction"], effect: "Eightfold attack. Accuracy varies with TP. Monk 71, skill 250. Unlock quest: The Walls of Your Mind. The quest tag does not lock it here.", kind: "physical" },
{ name: "Tornado Kick", skill: 300, level: 94, jobs: H2H_OPEN, requires: ["MNK", "PUP"], hits: 3, mods: { str: 0.4, vit: 0.4 }, ftp: [1.7, 2.8, 4.5], chains: ["Induration", "Impaction", "Detonation"], effect: "Threefold attack. Damage varies with TP. Monk or Puppetmaster must be main or sub.", kind: "physical" },
{ name: "Shijin Spiral", skill: 357, level: 90, jobs: ["MNK", "PUP"], hits: 5, mods: { dex: 0.73 }, ftp: [1.5], replicating: true, chains: ["Fusion", "Reverberation"], aftermath: "Light", effect: "Fivefold attack. DEX is 73% / 76% / 79% / 82% / 85%. Plague, -50 TP per tick. Monk or Puppetmaster only.", kind: "physical" },
{ name: "Final Heaven", skill: null, jobs: ["MNK"], hits: 2, mods: { vit: 0.8 }, ftp: [3], chains: ["Light", "Fusion"], effect: "Twofold attack. Relic. Caestus or Spharai. Subtle Blow +10. The page lists no skill number.", kind: "physical" },
{ name: "Victory Smite", skill: null, jobs: ["MNK", "PUP"], mainOnly: true, quest: "Kupofried's Weapon Skill Moogle Magic", hits: 4, mods: { str: 0.8 }, ftp: [1.5], replicating: true, critBonus: [0.1, 0.25, 0.45], chains: ["Light", "Fragmentation"], effect: "Fourfold attack. Critical hit rate +10% / +25% / +45%. Empyrean, Verethragna. Monk or Puppetmaster main.", kind: "physical" },
{ name: "Ascetic's Fury", skill: null, jobs: ["MNK"], mainOnly: true, hits: 1, mods: { str: 0.5, vit: 0.5 }, ftp: [1], replicating: true, critBonus: [0.2, 0.3, 0.5], chains: ["Fusion", "Transfixion"], effect: "Critical hit rate +20% / +30% / +50%. Mythic, Glanzfaust. Monk main only.", kind: "physical" },
{ name: "Stringing Pummel", skill: null, jobs: ["PUP"], mainOnly: true, quest: "Unlocking a Myth (Puppetmaster)", hits: 6, mods: { str: 0.32, vit: 0.32 }, ftp: [1], replicating: true, chains: ["Gravitation", "Liquefaction"], effect: "Sixfold attack. Critical hit chance varies with TP. Mythic, Kenkonken. Puppetmaster main only.", kind: "physical" },
{ name: "Maru Kala", skill: null, level: 99, jobs: ["MNK", "PUP"], hits: 2, mods: {}, chains: ["Detonation", "Compression", "Distortion"], effect: "Twofold attack. Damage varies with TP. Prime, Varga Purnikawa. No stat modifier on the category page.", kind: "physical" },
{ name: "Dragon Blow", skill: null, level: 99, jobs: ["MNK", "PUP"], hits: 2, mods: { dex: 0.85 }, ftp: [3.675, 7, 10.4375], chains: ["Distortion"], effect: "Twofold attack. Damage varies with TP. Dragon Fangs. Monk or Puppetmaster.", kind: "physical" }];


export function handByName(name) {
  return HAND_SKILLS.find((ws) => ws.name === name);
}

export function warCanUseHand(ws, ctx) {
  if (ctx.job !== "WAR") return `${ws.name} is not checked for this job.`;
  const onWeapon = ws.weapons?.includes(ctx.weaponName) === true;
  if (!ws.jobs.includes("WAR") && !onWeapon) {
    return ws.weapons ? `${ws.name} needs ${ws.weapons.join(" or ")}.` : `${ws.name} is not a Warrior weapon skill.`;
  }
  if (ws.requires && !ws.requires.includes(ctx.job) && !(ctx.sub && ws.requires.includes(ctx.sub))) {
    const label = { MNK: "Monk", PUP: "Puppetmaster" };
    const names = ws.requires.map((job) => label[job] ?? job).join(" or ");
    return `${ws.name} requires ${names} as main or sub.`;
  }
  if (ws.mainOnly && !ctx.main) return `${ws.name} requires Warrior as the main job.`;
  if (ws.level != null && ctx.level < ws.level) return `${ws.name} requires level ${ws.level}.`;
  if (ws.skill != null && ctx.skill < ws.skill && !(ws.bypassSkill && onWeapon)) return `${ws.name} needs Hand-to-Hand skill ${ws.skill}.`;
  if (ws.skill == null && ws.weapons && !onWeapon) return `${ws.name} needs ${ws.weapons.join(" or ")}.`;
  return null;
}

/** Hand-to-hand skills this Warrior can put on the bar. */
export function warHandList(ctx) {
  return HAND_SKILLS.filter((ws) => warCanUseHand(ws, ctx) === null);
}

const DAGGER_JOBS = ["WAR", "RDM", "THF", "PLD", "DRK", "BST", "BRD", "RNG", "NIN", "COR", "DNC", "PUP", "GEO", "BLM", "SAM", "DRG", "SMN", "SCH"];
const DAGGER_SUB = ["RDM", "THF", "BRD", "RNG", "NIN", "DNC"];



/**
 * Dagger weapon skills from the BG-Wiki pages.
 * A level 75 Warrior has Dagger 240. A quest tag does not lock the skill.
 * Viper Bite, Cyclone, and Energy Drain still need one of the listed jobs as main or sub.
 */
export const DAGGER_SKILLS: readonly SwordWs[] = [
{ name: "Wasp Sting", skill: 5, level: 3, jobs: DAGGER_JOBS, hits: 1, mods: { dex: 1 }, ftp: [1], chains: ["Scission"], effect: "Poisons the target, -1 HP per tick. Duration 90s / 105s / 135s.", kind: "physical" },
{ name: "Gust Slash", skill: 40, level: 14, jobs: DAGGER_JOBS, hits: 1, mods: { dex: 0.4, int: 0.4 }, ftp: [1, 2, 3], element: "Wind", chains: ["Detonation"], effect: "Wind elemental damage. Damage varies with TP.", kind: "magical" },
{ name: "Shadowstitch", skill: 70, level: 24, jobs: DAGGER_JOBS, hits: 1, mods: { chr: 1 }, ftp: [1], chains: ["Reverberation"], effect: "Binds the target for about 15 to 30 seconds.", kind: "physical" },
{ name: "Viper Bite", skill: 100, level: 34, jobs: DAGGER_JOBS, requires: DAGGER_SUB, hits: 2, mods: { dex: 1 }, ftp: [1], attackBonus: [1, 1, 1], chains: ["Scission"], effect: "Attack modifier 2.0. Poisons the target, -3 HP per tick, for 90s / 120s / 180s. Red Mage, Thief, Bard, Ranger, Ninja, or Dancer must be main or sub.", kind: "physical" },
{ name: "Cyclone", skill: 125, level: 43, jobs: DAGGER_JOBS, requires: DAGGER_SUB, hits: 1, mods: { dex: 0.4, int: 0.4 }, ftp: [1, 2.375, 3.75], radius: [8, 8, 8], element: "Wind", chains: ["Detonation", "Impaction"], effect: "Wind elemental area attack. Radius 8y. Red Mage, Thief, Bard, Ranger, Ninja, or Dancer must be main or sub.", kind: "magical" },
{ name: "Energy Steal", skill: 150, level: 51, jobs: DAGGER_JOBS, hits: 1, mods: { mnd: 1 }, bonus: { type: "skillMp", rate: 0.11, mult: [1, 2.1, 3.4], fromTarget: true }, chains: [], effect: "Steals MP. (floor(dagger skill × 0.11) + MND) × 1.0 / 2.1 / 3.4. The target must have MP. Does not deal damage.", kind: "drain" },
{ name: "Energy Drain", skill: 175, level: 56, jobs: DAGGER_JOBS, requires: DAGGER_SUB, hits: 1, mods: { mnd: 1 }, bonus: { type: "skillMp", rate: 0.11, mult: [1.25, 2.5, 4.125], fromTarget: true }, chains: [], effect: "Steals MP. (floor(dagger skill × 0.11) + MND) × 1.25 / 2.5 / 4.125. The target must have MP. Red Mage, Thief, Bard, Ranger, Ninja, or Dancer must be main or sub.", kind: "drain" },
{ name: "Dancing Edge", skill: 200, level: 60, jobs: ["THF", "DNC"], hits: 5, mods: { dex: 0.4, chr: 0.4 }, ftp: [1.1875], replicating: true, chains: ["Scission", "Detonation"], effect: "Fivefold attack. Thief or Dancer only.", kind: "physical" },
{ name: "Shark Bite", skill: 225, level: 66, jobs: ["THF", "DNC"], hits: 2, mods: { dex: 0.4, agi: 0.4 }, ftp: [4.5, 6.8, 8.5], chains: ["Fragmentation"], effect: "Twofold attack. Damage varies with TP. Thief or Dancer only.", kind: "physical" },
{ name: "Evisceration", skill: 230, level: 73, jobs: ["WAR", "RDM", "THF", "BST", "BRD", "RNG", "NIN", "COR", "DNC"], mainOnly: true, quest: "Cloak and Dagger", weapons: ["Kaja Knife", "Tauret"], hits: 5, mods: { dex: 0.5 }, ftp: [1.25], replicating: true, chains: ["Gravitation", "Transfixion"], effect: "Fivefold attack. Unlock quest: Cloak and Dagger. Kaja Knife or Tauret can grant it to Puppetmaster.", kind: "physical" },
{ name: "Aeolian Edge", skill: 290, level: 85, jobs: DAGGER_JOBS, hits: 1, mods: { dex: 0.4, int: 0.4 }, ftp: [2, 3, 4.5], element: "Wind", chains: ["Scission", "Detonation", "Impaction"], effect: "Wind elemental area attack. Damage varies with TP.", kind: "magical" },
{ name: "Exenterator", skill: 357, level: 95, jobs: ["WAR", "RDM", "THF", "BST", "BRD", "RNG", "NIN", "COR", "DNC"], mainOnly: true, hits: 4, mods: { agi: 0.73 }, ftp: [1.1875], replicating: true, chains: ["Fragmentation", "Scission"], aftermath: "Light", effect: "Fourfold attack. AGI is 73% / 76% / 79% / 82% / 85%.", kind: "physical" },
{ name: "Mercy Stroke", skill: null, jobs: ["RDM", "THF", "BRD", "DNC"], hits: 1, mods: { str: 0.8 }, ftp: [5], chains: ["Darkness", "Gravitation"], effect: "Relic. Batardeau, Mandau, or Clement Skean. Aftermath Critical Hit Rate +5% for 20s / 40s / 60s. The page lists no skill number.", kind: "physical" },
{ name: "Rudra's Storm", skill: null, jobs: ["THF", "BRD", "DNC"], hits: 1, mods: { dex: 0.8 }, chains: ["Darkness", "Distortion"], effect: "Deals quintuple damage and weighs the target down. Empyrean, Twashtar.", kind: "physical" },
{ name: "Mandalic Stab", skill: null, jobs: ["THF"], mainOnly: true, hits: 1, mods: { dex: 0.6 }, chains: ["Fusion", "Compression"], effect: "Damage varies with TP. Mythic, Vajra. Thief main only.", kind: "physical" },
{ name: "Mordant Rime", skill: null, jobs: ["BRD"], mainOnly: true, hits: 2, mods: { dex: 0.3, chr: 0.7 }, chains: ["Fragmentation", "Distortion"], effect: "Twofold attack. Mythic, Carnwenhan. Bard main only.", kind: "physical" },
{ name: "Pyrrhic Kleos", skill: null, jobs: ["DNC"], mainOnly: true, hits: 4, mods: { str: 0.4, dex: 0.4 }, ftp: [1.75], replicating: true, chains: ["Distortion", "Scission"], effect: "Fourfold attack. Mythic, Terpsichore. Dancer main only.", kind: "physical" },
{ name: "Ruthless Stroke", skill: null, jobs: ["THF"], hits: 4, mods: { dex: 0.25, agi: 0.25 }, chains: ["Liquefaction", "Impaction", "Fragmentation"], effect: "Fourfold attack. Prime, Mpu Gandring. Thief only.", kind: "physical" }];


export function daggerByName(name) {
  return DAGGER_SKILLS.find((ws) => ws.name === name);
}

export function warCanUseDagger(ws, ctx) {
  if (ctx.job !== "WAR") return `${ws.name} is not checked for this job.`;
  const onWeapon = ws.weapons?.includes(ctx.weaponName) === true;
  if (!ws.jobs.includes("WAR") && !onWeapon) {
    return ws.weapons ? `${ws.name} needs ${ws.weapons.join(" or ")}.` : `${ws.name} is not a Warrior weapon skill.`;
  }
  if (ws.requires && !ws.requires.includes(ctx.job) && !(ctx.sub && ws.requires.includes(ctx.sub))) {
    const label = { RDM: "Red Mage", THF: "Thief", BRD: "Bard", RNG: "Ranger", NIN: "Ninja", DNC: "Dancer" };
    const names = ws.requires.map((job) => label[job] ?? job).join(" or ");
    return `${ws.name} requires ${names} as main or sub.`;
  }
  if (ws.mainOnly && !ctx.main) return `${ws.name} requires Warrior as the main job.`;
  if (ws.level != null && ctx.level < ws.level) return `${ws.name} requires level ${ws.level}.`;
  if (ws.skill != null && ctx.skill < ws.skill && !(ws.bypassSkill && onWeapon)) return `${ws.name} needs Dagger skill ${ws.skill}.`;
  if (ws.skill == null && ws.weapons && !onWeapon) return `${ws.name} needs ${ws.weapons.join(" or ")}.`;
  return null;
}

/** Dagger skills this Warrior can put on the bar. */
export function warDaggerList(ctx) {
  return DAGGER_SKILLS.filter((ws) => warCanUseDagger(ws, ctx) === null);
}

const AXE_JOBS = ["WAR", "BST", "DRK", "RNG", "RUN"];



/**
 * One-handed Axe weapon skills from the BG-Wiki pages.
 * A level 75 Warrior has Axe 269. A quest tag does not lock the skill.
 */
export const AXE_SKILLS: readonly SwordWs[] = [
{ name: "Raging Axe", motion: "Raging Axe", skill: 5, level: 1, jobs: AXE_JOBS, hits: 2, mods: { str: 0.6 }, ftp: [1, 3, 6], chains: ["Detonation", "Impaction"], effect: "Twofold attack. Damage varies with TP.", kind: "physical" },
{ name: "Smash Axe", motion: "Smash Axe", skill: 40, level: 13, jobs: AXE_JOBS, hits: 1, mods: { str: 1 }, ftp: [1], chains: ["Induration", "Reverberation"], effect: "Stuns the target. The chance varies with TP.", kind: "physical" },
{ name: "Gale Axe", motion: "Gale Axe", skill: 70, level: 23, jobs: AXE_JOBS, hits: 1, mods: { str: 1 }, ftp: [1], chains: ["Detonation"], effect: "Single attack.", kind: "physical" },
{ name: "Avalanche Axe", motion: "Avalanche Axe", skill: 100, level: 33, jobs: AXE_JOBS, hits: 1, mods: { str: 0.6 }, ftp: [1.5, 3, 5.5], chains: ["Scission", "Impaction"], effect: "Damage varies with TP.", kind: "physical" },
{ name: "Spinning Axe", motion: "Spinning Axe", skill: 150, level: 49, jobs: AXE_JOBS, hits: 1, mods: { str: 0.6 }, ftp: [2, 4, 6.5], chains: ["Liquefaction", "Scission", "Impaction"], effect: "Damage varies with TP.", kind: "physical" },
{ name: "Rampage", motion: "Rampage", skill: 175, level: 55, jobs: AXE_JOBS, hits: 5, mods: { str: 0.5 }, ftp: [1], replicating: true, critBonus: [0, 0.2, 0.4], chains: ["Scission"], effect: "Fivefold attack. Critical hit rate +0% / +20% / +40%.", kind: "physical" },
{ name: "Calamity", motion: "Calamity", skill: 200, level: 60, jobs: ["WAR", "BST"], mainOnly: true, hits: 1, mods: { str: 0.5, vit: 0.5 }, ftp: [2.5, 6.5, 10.375], chains: ["Scission", "Impaction"], effect: "Single attack. Damage varies with TP. Warrior or Beastmaster main.", kind: "physical" },
{ name: "Mistral Axe", motion: "Mistral Axe", skill: 225, level: 66, jobs: ["WAR", "BST"], mainOnly: true, hits: 1, mods: { str: 0.5 }, ftp: [4, 10.5, 13.625], chains: ["Fusion"], effect: "Single attack. Damage varies with TP. Warrior or Beastmaster main.", kind: "physical" },
{ name: "Decimation", motion: "Decimation", skill: 240, level: 70, jobs: AXE_JOBS, mainOnly: true, quest: "Axe the Competition", weapons: ["Kaja Axe", "Dolichenus"], hits: 3, mods: { str: 0.5 }, ftp: [1.75], replicating: true, chains: ["Fusion", "Reverberation"], effect: "Threefold attack. Unlock quest: Axe the Competition. Kaja Axe or Dolichenus can grant it.", kind: "physical" },
{ name: "Bora Axe", motion: "Bora Axe", skill: 290, level: 80, jobs: AXE_JOBS, hits: 1, mods: { dex: 1 }, ftp: [4.5], chains: ["Scission", "Detonation"], effect: "Single attack.", kind: "physical" },
{ name: "Ruinator", skill: 357, level: 91, jobs: AXE_JOBS, mainOnly: true, hits: 4, mods: { str: 0.73 }, ftp: [1.08], replicating: true, chains: ["Distortion", "Detonation"], aftermath: "Darkness", effect: "Fourfold attack. STR is 73% / 76% / 79% / 82% / 85%. Aeonic Aftermath adds Darkness.", kind: "physical" },
{ name: "Onslaught", skill: null, jobs: ["BST"], hits: 1, mods: { dex: 0.8 }, chains: ["Darkness", "Gravitation"], effect: "Lowers accuracy by 30. Relic. Ogre Killer, Guttler, or Cleofun Axe. Beastmaster only. The page lists no skill number.", kind: "physical" },
{ name: "Cloudsplitter", skill: null, jobs: ["WAR", "BST"], mainOnly: true, weapons: ["Farsha", "Alard's Axe", "Alard's Axe +1", "Alard's Axe +2", "Alard's Axe +3", "Sacripante"], hits: 1, mods: { str: 0.4, mnd: 0.4 }, ftp: [3.75, 6.69921875, 8.5], element: "Lightning", chains: ["Darkness", "Fragmentation"], effect: "Lightning elemental damage. Damage varies with TP. Empyrean, Farsha. Warrior or Beastmaster main.", kind: "magical" },
{ name: "Primal Rend", skill: null, jobs: ["BST"], mainOnly: true, hits: 1, mods: { dex: 0.3, chr: 0.6 }, ftp: [3.0625, 5.8359375, 7.5625], element: "Light", chains: ["Gravitation", "Reverberation"], effect: "Light elemental damage. Damage varies with TP. Mythic, Aymur. Beastmaster main only.", kind: "magical" },
{ name: "Blitz", skill: null, level: 99, jobs: ["BST"], hits: 5, mods: { str: 0.32, dex: 0.32 }, ftp: [1.5, 7, 12.5], chains: ["Liquefaction", "Impaction", "Fragmentation"], effect: "Fivefold attack. Damage varies with TP. Prime, Spalirisos. Beastmaster only.", kind: "physical" }];


export function axeByName(name) {
  return AXE_SKILLS.find((ws) => ws.name === name);
}

export function warCanUseAxe(ws, ctx) {
  if (ctx.job !== "WAR") return `${ws.name} is not checked for this job.`;
  const onWeapon = ws.weapons?.includes(ctx.weaponName) === true;
  if (!ws.jobs.includes("WAR") && !onWeapon) {
    return ws.weapons ? `${ws.name} needs ${ws.weapons.join(" or ")}.` : `${ws.name} is not a Warrior weapon skill.`;
  }
  if (ws.requires && !ws.requires.includes(ctx.job) && !(ctx.sub && ws.requires.includes(ctx.sub))) {
    return `${ws.name} requires ${ws.requires.join(" or ")} as main or sub.`;
  }
  if (ws.mainOnly && !ctx.main) return `${ws.name} requires Warrior as the main job.`;
  if (ws.level != null && ctx.level < ws.level) return `${ws.name} requires level ${ws.level}.`;
  if (ws.skill != null && ctx.skill < ws.skill && !(ws.bypassSkill && onWeapon)) return `${ws.name} needs Axe skill ${ws.skill}.`;
  if (ws.skill == null && ws.weapons && !onWeapon) return `${ws.name} needs ${ws.weapons.join(" or ")}.`;
  return null;
}

/** One-handed Axe skills this Warrior can put on the bar. */
export function warAxeList(ctx) {
  return AXE_SKILLS.filter((ws) => warCanUseAxe(ws, ctx) === null);
}

const STAFF_JOBS = ["WAR", "MNK", "WHM", "BLM", "PLD", "BRD", "DRG", "SMN", "SCH", "GEO"];



/**
 * Staff weapon skills from the BG-Wiki pages.
 * A level 75 Warrior has Staff 250. A quest tag does not lock the skill.
 */
export const STAFF_SKILLS: readonly SwordWs[] = [
{ name: "Heavy Swing", skill: 5, level: 1, jobs: STAFF_JOBS, hits: 1, mods: { str: 1 }, ftp: [1, 2, 3], chains: ["Impaction"], effect: "Single attack. Damage varies with TP.", kind: "physical" },
{ name: "Rock Crusher", skill: 40, level: 14, jobs: STAFF_JOBS, hits: 1, mods: { str: 0.4, int: 0.4 }, ftp: [1, 3.27, 5.54], element: "Earth", chains: ["Impaction"], effect: "Earth elemental damage. Damage varies with TP.", kind: "magical" },
{ name: "Earth Crusher", skill: 70, level: 24, jobs: STAFF_JOBS, hits: 1, mods: { str: 0.4, int: 0.4 }, ftp: [1, 3.58, 6.16], element: "Earth", chains: ["Detonation", "Impaction"], effect: "Earth elemental area attack. Damage varies with TP.", kind: "magical" },
{ name: "Starburst", skill: 100, level: 34, jobs: STAFF_JOBS, hits: 1, mods: { str: 0.4, mnd: 0.4 }, ftp: [1, 3.27, 5.54], chains: ["Compression", "Reverberation"], effect: "Light or dark elemental damage, chosen at random. Damage varies with TP.", kind: "magical" },
{ name: "Sunburst", skill: 150, level: 51, jobs: STAFF_JOBS, hits: 1, mods: { str: 0.4, mnd: 0.4 }, ftp: [1, 3.58, 6.16], chains: ["Compression", "Reverberation"], effect: "Light or dark elemental damage, chosen at random. Damage varies with TP.", kind: "magical" },
{ name: "Shell Crusher", skill: 175, level: 56, jobs: STAFF_JOBS, hits: 1, mods: { str: 1 }, ftp: [1], chains: ["Detonation"], effect: "Lowers defense by 25% for 180s / 360s / 540s.", kind: "physical" },
{ name: "Full Swing", skill: 200, level: 62, jobs: STAFF_JOBS, hits: 1, mods: { str: 0.5 }, ftp: [1, 3, 9], chains: ["Liquefaction", "Impaction"], effect: "Single attack. Damage varies with TP.", kind: "physical" },
{ name: "Spirit Taker", skill: 215, level: 66, jobs: STAFF_JOBS, hits: 1, mods: { int: 0.5, mnd: 0.5 }, ftp: [1, 2, 3], bonus: { type: "damageMp" }, chains: [], effect: "Converts damage dealt to MP. Damage varies with TP.", kind: "physical" },
{ name: "Retribution", skill: 230, level: 71, jobs: STAFF_JOBS, mainOnly: true, quest: "Blood and Glory", bypassSkill: true, weapons: ["Kaja Staff", "Xoanon"], hits: 1, mods: { str: 0.3, mnd: 0.5 }, ftp: [2, 3, 5], attackBonus: [0.5, 0.5, 0.5], chains: ["Gravitation", "Reverberation"], effect: "Single attack. Damage varies with TP. Attack modifier 1.5. Unlock quest: Blood and Glory. Kaja Staff or Xoanon can grant it.", kind: "physical" },
{ name: "Cataclysm", skill: 290, level: 83, jobs: STAFF_JOBS, hits: 1, mods: { str: 0.3, int: 0.3 }, ftp: [1.75, 3.75, 6.5], element: "Dark", chains: ["Compression", "Reverberation"], effect: "Darkness elemental area attack. Damage varies with TP.", kind: "magical" },
{ name: "Shattersoul", skill: 357, level: 94, jobs: STAFF_JOBS, hits: 3, mods: { int: 0.73 }, ftp: [1.375], chains: ["Gravitation", "Induration"], aftermath: "Darkness", effect: "Threefold attack. INT is 73% / 76% / 79% / 82% / 85%. Aeonic Aftermath adds Darkness.", kind: "physical" },
{ name: "Gate of Tartarus", skill: null, jobs: ["BLM", "SMN"], hits: 1, mods: { int: 0.8 }, ftp: [3], chains: ["Darkness", "Distortion"], effect: "Lowers attack by 18.75% for 2 minutes. Relic. Thyrus, Claustrum, or Chthonic Staff. Black Mage or Summoner. The page lists no skill number.", kind: "physical" },
{ name: "Garland of Bliss", skill: null, jobs: ["SMN"], mainOnly: true, hits: 1, mods: { str: 0.3, mnd: 0.7 }, ftp: [2.25], chains: ["Fusion", "Reverberation"], effect: "Lowers defense by 12.5% for 60s / 120s / 180s. Mythic, Nirvana. Summoner main only.", kind: "magical" },
{ name: "Omniscience", skill: null, jobs: ["SCH"], mainOnly: true, hits: 1, mods: { mnd: 0.8 }, ftp: [2], chains: ["Gravitation", "Transfixion"], effect: "Lowers magic attack by 10 for 60s / 120s / 180s. Mythic, Tupsimati. Scholar main only.", kind: "magical" },
{ name: "Vidohunir", skill: null, jobs: ["BLM"], mainOnly: true, hits: 1, mods: { int: 0.8 }, ftp: [1.75], chains: ["Fragmentation", "Distortion"], effect: "Magic damage. dSTAT is twice the INT difference. Mythic, Laevateinn. Black Mage main only.", kind: "magical" },
{ name: "Myrkr", skill: null, jobs: ["BLM", "SMN", "SCH"], mainOnly: true, hits: 1, mods: {}, bonus: { type: "pools", hp: [0, 0, 0], mp: [0.2, 0.4, 0.6] }, chains: [], effect: "Restores 20% / 40% / 60% of max MP and removes up to 3 status effects. Empyrean, Hvergelmir. Black Mage, Summoner, or Scholar main.", kind: "drain" },
{ name: "Oshala", skill: null, level: 99, jobs: ["BLM", "SMN", "SCH"], hits: 1, mods: { mnd: 0.45, int: 0.45 }, ftp: [3.95, 7.89, 11.84], chains: ["Induration", "Reverberation", "Fusion"], effect: "Damage varies with TP. Prime, Opashoro. Black Mage, Summoner, or Scholar.", kind: "physical" },
{ name: "Tartarus Torpor", skill: null, jobs: STAFF_JOBS, weapons: ["Samudra"], hits: 1, mods: { str: 0.3, int: 0.3 }, chains: [], effect: "Area attack. Campaign only, while Samudra is equipped.", kind: "physical" }];


export function staffByName(name) {
  return STAFF_SKILLS.find((ws) => ws.name === name);
}

export function warCanUseStaff(ws, ctx) {
  if (ctx.job !== "WAR") return `${ws.name} is not checked for this job.`;
  const onWeapon = ws.weapons?.includes(ctx.weaponName) === true;
  if (!ws.jobs.includes("WAR") && !onWeapon) {
    return ws.weapons ? `${ws.name} needs ${ws.weapons.join(" or ")}.` : `${ws.name} is not a Warrior weapon skill.`;
  }
  if (ws.mainOnly && !ctx.main) return `${ws.name} requires Warrior as the main job.`;
  if (ws.level != null && ctx.level < ws.level) return `${ws.name} requires level ${ws.level}.`;
  if (ws.skill != null && ctx.skill < ws.skill && !(ws.bypassSkill && onWeapon)) return `${ws.name} needs Staff skill ${ws.skill}.`;
  if (ws.skill == null && ws.weapons && !onWeapon) return `${ws.name} needs ${ws.weapons.join(" or ")}.`;
  return null;
}

/** Staff skills this Warrior can put on the bar. */
export function warStaffList(ctx) {
  return STAFF_SKILLS.filter((ws) => warCanUseStaff(ws, ctx) === null);
}

const CLUB_OPEN = ["WAR", "MNK", "WHM", "BLM", "RDM", "THF", "PLD", "DRK", "BST", "BRD", "RNG", "SAM", "NIN", "DRG", "SMN", "BLU", "PUP", "SCH", "RUN", "GEO"];
const CLUB_SUB = ["WAR", "WHM", "PLD", "DRK", "SAM", "BLU", "GEO"];



/**
 * Club weapon skills from the BG-Wiki pages.
 * A level 75 Warrior has Club 240. Dancer and Corsair have no Club skill.
 * A quest tag does not lock the skill.
 */
export const CLUB_SKILLS: readonly SwordWs[] = [
{ name: "Shining Strike", skill: 5, level: 3, jobs: CLUB_OPEN, hits: 1, mods: { str: 0.4, mnd: 0.4 }, ftp: [1.625, 3, 4.625], element: "Light", chains: ["Impaction"], effect: "Light elemental damage. Damage varies with TP.", kind: "magical" },
{ name: "Seraph Strike", skill: 40, level: 14, jobs: CLUB_OPEN, requires: CLUB_SUB, hits: 1, mods: { str: 0.4, mnd: 0.4 }, ftp: [2.125, 3.675, 6.125], element: "Light", chains: ["Impaction"], effect: "Light elemental damage. Damage varies with TP. Main or sub must be Warrior, White Mage, Paladin, Dark Knight, Samurai, Blue Mage, or Geomancer.", kind: "magical" },
{ name: "Brainshaker", skill: 70, level: 24, jobs: CLUB_OPEN, hits: 1, mods: { str: 1 }, ftp: [1], chains: ["Reverberation"], effect: "Stuns the target. The chance varies with TP.", kind: "physical" },
{ name: "Starlight", skill: 100, jobs: CLUB_OPEN, hits: 1, mods: {}, self: true, bonus: { type: "skillMp", rate: 0.11, mult: [2, 3, 4], fromTarget: false }, chains: [], effect: "Restores MP: floor(club skill × 0.11) × 2 / 3 / 4. Does not deal damage.", kind: "drain" },
{ name: "Moonlight", skill: 125, level: 43, jobs: CLUB_OPEN, requires: CLUB_SUB, hits: 1, mods: {}, self: true, bonus: { type: "skillMp", rate: 0.11, mult: [2.25, 3.5, 4.75], fromTarget: false }, chains: [], effect: "Restores MP to party members in range: floor(club skill × 0.11) × 2.25 / 3.5 / 4.75. Does not deal damage.", kind: "drain" },
{ name: "Skullbreaker", skill: 150, level: 51, jobs: CLUB_OPEN, hits: 1, mods: { str: 1 }, ftp: [1], chains: ["Induration", "Reverberation"], effect: "Lowers INT by 10 for 140 seconds. The penalty decays by 1 every 10 seconds.", kind: "physical" },
{ name: "True Strike", skill: 175, level: 56, jobs: CLUB_OPEN, hits: 1, mods: { str: 1 }, ftp: [1], attackBonus: [1, 1, 1], critBonus: [1, 1, 1], chains: ["Detonation", "Impaction"], effect: "Always a critical hit. Attack modifier 2.0. Accuracy takes a large penalty.", kind: "physical" },
{ name: "Judgment", skill: 200, level: 62, jobs: CLUB_OPEN, requires: CLUB_SUB, hits: 1, mods: { str: 0.5, mnd: 0.5 }, ftp: [3.5, 8.75, 12], chains: ["Impaction"], effect: "Single attack. Damage varies with TP.", kind: "physical" },
{ name: "Hexa Strike", motion: "Hexa Strike", skill: 220, level: 67, jobs: ["WHM", "GEO"], mainOnly: true, hits: 6, mods: { str: 0.3, mnd: 0.3 }, ftp: [1.125], replicating: true, chains: ["Fusion"], effect: "Sixfold attack. STR 30% and MND 30%. fTP 1.125 on every hit. Fusion. Critical hit rate +10% at 1000 TP. The 2000 TP rate is not published, and 3000 TP is listed only as at least 25%, so this yard does not roll a critical-hit bonus. White Mage or Geomancer main, level 67, Club skill 220, any club. Warrior and Paladin can use it at level 99 with a Beryllium Mace or Beryllium Mace +1. Those weapons are not in this kit.", kind: "physical" },
{ name: "Black Halo", skill: 230, level: 73, jobs: ["WAR", "MNK", "WHM", "BLM", "PLD", "SMN", "BLU", "SCH", "GEO"], mainOnly: true, quest: "Orastery Woes", weapons: ["Kaja Rod", "Maxentius"], hits: 2, mods: { str: 0.3, mnd: 0.7 }, ftp: [3, 7.25, 9.75], chains: ["Fragmentation", "Compression"], effect: "Twofold attack. Damage varies with TP. Unlock quest: Orastery Woes. Kaja Rod or Maxentius can grant it.", kind: "physical" },
{ name: "Flash Nova", skill: 290, level: 85, jobs: CLUB_OPEN, hits: 1, mods: { str: 0.5, mnd: 0.5 }, ftp: [3], element: "Light", chains: ["Reverberation", "Induration"], effect: "Light elemental damage.", kind: "magical" },
{ name: "Realmrazer", skill: 357, level: 95, jobs: ["WAR", "MNK", "WHM", "BLM", "PLD", "SMN", "BLU", "SCH", "GEO"], mainOnly: true, hits: 7, mods: { mnd: 0.73 }, ftp: [0.9], replicating: true, chains: ["Fusion", "Impaction"], aftermath: "Light", effect: "Sevenfold attack. MND is 73% / 76% / 79% / 82% / 85%.", kind: "physical" },
{ name: "Randgrith", skill: null, jobs: ["WHM", "GEO", "SCH"], hits: 1, mods: { str: 0.4, mnd: 0.4 }, ftp: [4.25], chains: ["Light", "Fragmentation"], effect: "Lowers evasion by 32. Relic. Gullintani, Mjollnir, or Molva Maul. The page lists no skill number.", kind: "physical" },
{ name: "Dagan", skill: null, jobs: ["WHM"], mainOnly: true, hits: 1, mods: {}, self: true, bonus: { type: "pools", hp: [0.22, 0.33, 0.52], mp: [0.15, 0.22, 0.35] }, chains: [], effect: "Restores 22% HP and 15% MP / 33% HP and 22% MP / 52% HP and 35% MP. Empyrean, Gambanteinn. White Mage main only.", kind: "drain" },
{ name: "Mystic Boon", skill: null, jobs: ["WHM"], mainOnly: true, quest: "Unlocking a Myth (White Mage)", hits: 1, mods: { str: 0.3, mnd: 0.7 }, ftp: [2.5, 4, 7], bonus: { type: "damageMp" }, chains: [], effect: "Converts damage dealt to MP. Mythic, Yagrush. White Mage main only.", kind: "physical" },
{ name: "Exudation", skill: null, jobs: ["GEO"], hits: 1, mods: { int: 0.5, mnd: 0.5 }, chains: ["Darkness", "Fragmentation"], effect: "Ergon weapon skill. Geomancer only.", kind: "physical" },
{ name: "Dagda", skill: null, level: 99, jobs: ["WHM", "GEO"], hits: 2, mods: {}, chains: ["Transfixion", "Scission", "Gravitation"], effect: "Twofold attack. Damage varies with TP. Prime, Lorg Mor. The page left the STR and MND rates blank.", kind: "physical" }];


export function clubByName(name) {
  return CLUB_SKILLS.find((ws) => ws.name === name);
}

export function warCanUseClub(ws, ctx) {
  if (ctx.job !== "WAR") return `${ws.name} is not checked for this job.`;
  const onWeapon = ws.weapons?.includes(ctx.weaponName) === true;
  if (!ws.jobs.includes("WAR") && !onWeapon) {
    return ws.weapons ? `${ws.name} needs ${ws.weapons.join(" or ")}.` : `${ws.name} is not a Warrior weapon skill.`;
  }
  if (ws.requires && !ws.requires.includes(ctx.job) && !(ctx.sub && ws.requires.includes(ctx.sub))) {
    return `${ws.name} requires one of its listed jobs as main or sub.`;
  }
  if (ws.mainOnly && !ctx.main) return `${ws.name} requires Warrior as the main job.`;
  if (ws.level != null && ctx.level < ws.level) return `${ws.name} requires level ${ws.level}.`;
  if (ws.skill != null && ctx.skill < ws.skill && !(ws.bypassSkill && onWeapon)) return `${ws.name} needs Club skill ${ws.skill}.`;
  if (ws.skill == null && ws.weapons && !onWeapon) return `${ws.name} needs ${ws.weapons.join(" or ")}.`;
  return null;
}

/** Club skills this Warrior can put on the bar. */
export function warClubList(ctx) {
  return CLUB_SKILLS.filter((ws) => warCanUseClub(ws, ctx) === null);
}

const SCYTHE_JOBS = ["WAR", "DRK", "BST", "BLM"];



/**
 * Scythe weapon skills from the BG-Wiki pages.
 * A level 75 Warrior has Scythe 269. A quest tag does not lock the skill.
 */
export const SCYTHE_SKILLS: readonly SwordWs[] = [
{ name: "Slice", skill: 5, level: 1, jobs: SCYTHE_JOBS, hits: 1, mods: { str: 1 }, ftp: [1, 2.5, 4.125], chains: ["Scission"], effect: "Single attack. Damage varies with TP.", kind: "physical" },
{ name: "Dark Harvest", skill: 30, level: 10, jobs: SCYTHE_JOBS, hits: 1, mods: { str: 0.4, int: 0.4 }, ftp: [1, 3.54, 6.07], element: "Dark", chains: ["Reverberation"], effect: "Dark elemental damage. Damage varies with TP.", kind: "magical" },
{ name: "Shadow of Death", skill: 70, level: 24, jobs: SCYTHE_JOBS, requires: ["WAR", "DRK"], hits: 1, mods: { str: 0.4, int: 0.4 }, ftp: [1, 4.17, 8.6], element: "Dark", chains: ["Induration", "Reverberation"], effect: "Dark elemental damage. Damage varies with TP. Main or sub must be Warrior or Dark Knight.", kind: "magical" },
{ name: "Nightmare Scythe", skill: 100, level: 34, jobs: SCYTHE_JOBS, hits: 1, mods: { str: 0.6, mnd: 0.6 }, ftp: [1], chains: ["Compression", "Scission"], effect: "Blinds the target for 60s / 120s / 180s.", kind: "physical" },
{ name: "Spinning Scythe", skill: 125, level: 43, jobs: SCYTHE_JOBS, hits: 1, mods: { str: 1 }, ftp: [1], radius: [4, 5, 6], chains: ["Reverberation", "Scission"], effect: "Area attack. Radius 4y / 5y / 6y.", kind: "physical" },
{ name: "Vorpal Scythe", skill: 150, level: 51, jobs: SCYTHE_JOBS, hits: 1, mods: { str: 1 }, ftp: [1], chains: ["Transfixion", "Scission"], effect: "Single attack.", kind: "physical" },
{ name: "Guillotine", skill: 200, level: 60, jobs: ["DRK"], hits: 4, mods: { str: 0.3, mnd: 0.5 }, ftp: [0.875], replicating: true, chains: ["Induration"], effect: "Fourfold attack. Silences the target for 60s / 120s / 180s. Dark Knight only.", kind: "physical" },
{ name: "Cross Reaper", skill: 225, level: 99, jobs: ["DRK"], weapons: ["Maliya Sickle", "Maliya Sickle +1"], hits: 2, mods: { str: 0.6, mnd: 0.6 }, ftp: [2, 4, 7], chains: ["Distortion"], effect: "Twofold attack. Damage varies with TP. Dark Knight. A Warrior needs a Maliya Sickle.", kind: "physical" },
{ name: "Spiral Hell", skill: 240, level: 72, jobs: ["WAR", "DRK", "BST"], mainOnly: true, quest: "Souls in Shadow", weapons: ["Kaja Scythe", "Drepanum"], hits: 1, mods: { str: 0.5, int: 0.5 }, ftp: [1.375, 2.75, 4.75], chains: ["Distortion", "Scission"], effect: "Single attack. Damage varies with TP. Unlock quest: Souls in Shadow. Kaja Scythe or Drepanum can grant it.", kind: "physical" },
{ name: "Infernal Scythe", skill: 300, level: 84, jobs: SCYTHE_JOBS, requires: ["WAR", "DRK"], hits: 1, mods: { str: 0.3, int: 0.7 }, ftp: [3.5], element: "Dark", chains: ["Compression", "Reverberation"], effect: "Darkness elemental damage. Main or sub must be Warrior or Dark Knight.", kind: "magical" },
{ name: "Entropy", skill: 357, level: 93, jobs: ["WAR", "DRK", "BST"], mainOnly: true, hits: 4, mods: { int: 0.73 }, ftp: [0.75, 1.25, 2], replicating: true, chains: ["Gravitation", "Reverberation"], aftermath: "Darkness", effect: "Fourfold attack. INT is 73% / 76% / 79% / 82% / 85%. Damage varies with TP.", kind: "physical" },
{ name: "Catastrophe", skill: null, jobs: ["DRK"], hits: 1, mods: { str: 0.4, int: 0.4 }, ftp: [2.75], chains: ["Darkness", "Gravitation"], effect: "Relic. Bec de Faucon, Apocalypse, or Crisis Scythe. Dark Knight only. The page lists no skill number.", kind: "physical" },
{ name: "Quietus", skill: null, jobs: ["DRK"], mainOnly: true, hits: 1, mods: { str: 0.6, mnd: 0.6 }, ftp: [3], defenseIgnored: [0.125, 0.375, 0.625], chains: ["Darkness", "Distortion"], effect: "Deals triple damage. Ignores 12.5% / 37.5% / 62.5% of defense. Empyrean, Redemption. Dark Knight main only.", kind: "physical" },
{ name: "Insurgency", skill: null, jobs: ["DRK"], mainOnly: true, hits: 4, mods: { str: 0.2, int: 0.2 }, ftp: [0.5, 3.25, 6], chains: ["Fusion", "Compression"], effect: "Fourfold attack. Damage varies with TP. Mythic. Dark Knight main only.", kind: "physical" },
{ name: "Origin", skill: null, level: 99, jobs: ["DRK"], hits: 1, mods: { str: 0.6, int: 0.6 }, ftp: [3, 6, 9], chains: ["Induration", "Reverberation", "Fusion"], effect: "Absorbs HP and MP. The ratio is not published, so no amount is invented. Damage varies with TP. Prime, Foenaria. Dark Knight only.", kind: "drain" }];


export function scytheByName(name) {
  return SCYTHE_SKILLS.find((ws) => ws.name === name);
}

export function warCanUseScythe(ws, ctx) {
  if (ctx.job !== "WAR") return `${ws.name} is not checked for this job.`;
  const onWeapon = ws.weapons?.includes(ctx.weaponName) === true;
  if (!ws.jobs.includes("WAR") && !onWeapon) {
    return ws.weapons ? `${ws.name} needs ${ws.weapons.join(" or ")}.` : `${ws.name} is not a Warrior weapon skill.`;
  }
  if (ws.requires && !ws.requires.includes(ctx.job) && !(ctx.sub && ws.requires.includes(ctx.sub))) {
    return `${ws.name} requires Warrior or Dark Knight as main or sub.`;
  }
  if (ws.mainOnly && !ctx.main) return `${ws.name} requires Warrior as the main job.`;
  if (ws.level != null && ctx.level < ws.level) return `${ws.name} requires level ${ws.level}.`;
  if (ws.skill != null && ctx.skill < ws.skill && !(ws.bypassSkill && onWeapon)) return `${ws.name} needs Scythe skill ${ws.skill}.`;
  if (ws.skill == null && ws.weapons && !onWeapon) return `${ws.name} needs ${ws.weapons.join(" or ")}.`;
  return null;
}

/** Scythe skills this Warrior can put on the bar. */
export function warScytheList(ctx) {
  return SCYTHE_SKILLS.filter((ws) => warCanUseScythe(ws, ctx) === null);
}

const POLE_JOBS = ["WAR", "PLD", "SAM", "DRG"];



/**
 * Polearm weapon skills from the BG-Wiki pages.
 * A level 75 Warrior has Polearm 250. A quest tag does not lock the skill.
 */
export const POLEARM_SKILLS: readonly SwordWs[] = [
{ name: "Double Thrust", skill: 5, level: 3, jobs: POLE_JOBS, hits: 2, mods: { str: 0.3, dex: 0.3 }, ftp: [1, 2.5, 4], chains: ["Transfixion"], effect: "Twofold attack. Damage varies with TP.", kind: "physical" },
{ name: "Thunder Thrust", skill: 30, level: 10, jobs: POLE_JOBS, hits: 1, mods: { str: 0.4, int: 0.4 }, ftp: [1.5, 3.28, 5.43], element: "Lightning", chains: ["Transfixion", "Impaction"], effect: "Lightning elemental damage. Damage varies with TP.", kind: "magical" },
{ name: "Raiden Thrust", skill: 70, level: 24, jobs: POLE_JOBS, requires: ["WAR", "PLD", "DRG"], hits: 1, mods: { str: 0.4, int: 0.4 }, ftp: [1, 3.91, 7.96], element: "Lightning", chains: ["Transfixion", "Impaction"], effect: "Lightning elemental damage. Damage varies with TP. Main or sub must be Warrior, Paladin, or Dragoon.", kind: "magical" },
{ name: "Leg Sweep", skill: 100, level: 34, jobs: POLE_JOBS, hits: 1, mods: { str: 1 }, ftp: [1], chains: ["Impaction"], effect: "Stuns the target. An unresisted stun lasts up to 10 seconds. The chance varies with TP. The page left that chance blank, so a hit stuns.", kind: "physical" },
{ name: "Penta Thrust", skill: 150, level: 51, jobs: POLE_JOBS, hits: 5, mods: { str: 0.2, dex: 0.2 }, ftp: [1], attackBonus: [-0.125, -0.125, -0.125], chains: ["Compression"], effect: "Fivefold attack. Attack modifier 0.875. Accuracy varies with TP. The page left the amounts blank, so accuracy is unchanged.", kind: "physical" },
{ name: "Vorpal Thrust", skill: 175, level: 56, jobs: POLE_JOBS, hits: 1, mods: { str: 0.5, agi: 0.5 }, ftp: [1], chains: ["Reverberation", "Transfixion"], effect: "Single attack. Deals critical damage. The page left the critical hit rates blank, so the extra critical hit is not rolled.", kind: "physical" },
{ name: "Skewer", skill: 200, level: 60, jobs: ["DRG"], hits: 3, mods: { str: 0.5 }, ftp: [1], chains: ["Transfixion", "Impaction"], effect: "Threefold attack. Dragoon only. Deals critical damage. The page left the critical hit rates blank, so the extra critical hit is not rolled.", kind: "physical" },
{ name: "Wheeling Thrust", skill: 225, jobs: ["DRG"], weapons: ["Exalted Spear", "Exalted Spear +1"], hits: 1, mods: { str: 0.8 }, ftp: [1.75], defenseIgnored: [0.5, 0.625, 0.75], chains: ["Fusion"], effect: "Ignores 50% / 62.5% / 75% of defense. Dragoon with Polearm skill 225. A Warrior, Paladin, or Samurai needs an Exalted Spear.", kind: "physical" },
{ name: "Impulse Drive", skill: 240, level: 75, jobs: ["WAR", "SAM", "DRG"], mainOnly: true, quest: "Methods Create Madness", bypassSkill: true, weapons: ["Kaja Lance", "Shining One"], hits: 2, mods: { str: 1 }, ftp: [1, 3, 5.5], chains: ["Gravitation", "Induration"], effect: "Twofold attack. Damage varies with TP. Dragoon learns it at 65. Warrior and Samurai learn it at 75. Unlock quest: Methods Create Madness. Kaja Lance or Shining One can grant it.", kind: "physical" },
{ name: "Sonic Thrust", skill: 300, level: 86, jobs: POLE_JOBS, requires: ["WAR", "PLD", "DRG"], hits: 1, mods: { str: 0.4, dex: 0.4 }, ftp: [3, 3.7, 4.5], chains: ["Transfixion", "Scission"], effect: "Frontal area attack. The page describes it as maybe 3 yalms wide and 10 long. Damage varies with TP. Main or sub must be Warrior, Paladin, or Dragoon.", kind: "physical" },
{ name: "Stardiver", skill: 357, level: 95, jobs: ["WAR", "SAM", "DRG"], mainOnly: true, hits: 4, mods: { str: 0.73 }, ftp: [0.75, 1.25, 1.75], replicating: true, chains: ["Gravitation", "Transfixion"], aftermath: "Darkness", effect: "Fourfold attack. STR is 73% / 76% / 79% / 82% / 85%. Damage varies with TP. Lowers critical hit evasion. Critical hit rate +5% for 60 seconds. Darkness only under Aeonic Aftermath.", kind: "physical" },
{ name: "Geirskogul", skill: null, jobs: ["DRG"], hits: 1, mods: { dex: 0.8 }, ftp: [3], chains: ["Light", "Distortion"], effect: "Relic. Gae Assail, Gungnir, or Skogul Lance. Aftermath Shock Spikes for 20s / 40s / 60s. Dragoon only. The page lists no skill number.", kind: "physical" },
{ name: "Camlann's Torment", skill: null, level: 85, jobs: ["DRG"], mainOnly: true, quest: "Kupofried's Weapon Skill Moogle Magic", hits: 1, mods: { str: 0.6, vit: 0.6 }, ftp: [3], defenseIgnored: [0.125, 0.375, 0.625], chains: ["Light", "Fragmentation"], effect: "Deals triple damage. Ignores 12.5% / 37.5% / 62.5% of defense. Empyrean, Rhongomiant. Dragoon main only.", kind: "physical" },
{ name: "Drakesbane", skill: null, jobs: ["DRG"], mainOnly: true, hits: 4, mods: { str: 0.5 }, ftp: [1], attackBonus: [-0.1875, -0.1875, -0.1875], critBonus: [0.1, 0.25, 0.4], chains: ["Fusion", "Transfixion"], effect: "Fourfold attack. Attack modifier 0.8125. Critical hit rate +10% / +25% / +40%. Mythic. Dragoon main only.", kind: "physical" },
{ name: "Diarmuid", skill: null, level: 99, jobs: ["DRG"], hits: 2, mods: { str: 0.55, vit: 0.55 }, ftp: [2.17, 5.36, 8.55], chains: ["Transfixion", "Scission", "Gravitation"], effect: "Twofold attack. Damage varies with TP. Prime, Gae Buide. Dragoon only.", kind: "physical" }];


export function polearmByName(name) {
  return POLEARM_SKILLS.find((ws) => ws.name === name);
}

export function warCanUsePolearm(ws, ctx) {
  if (ctx.job !== "WAR") return `${ws.name} is not checked for this job.`;
  const onWeapon = ws.weapons?.includes(ctx.weaponName) === true;
  if (!ws.jobs.includes("WAR") && !onWeapon) {
    return ws.weapons ? `${ws.name} needs ${ws.weapons.join(" or ")}.` : `${ws.name} is not a Warrior weapon skill.`;
  }
  if (ws.requires && !ws.requires.includes(ctx.job) && !(ctx.sub && ws.requires.includes(ctx.sub))) {
    return `${ws.name} requires Warrior, Paladin, or Dragoon as main or sub.`;
  }
  if (ws.mainOnly && !ctx.main) return `${ws.name} requires Warrior as the main job.`;
  if (ws.level != null && ctx.level < ws.level) return `${ws.name} requires level ${ws.level}.`;
  if (ws.skill != null && ctx.skill < ws.skill && !(ws.bypassSkill && onWeapon)) return `${ws.name} needs Polearm skill ${ws.skill}.`;
  if (ws.skill == null && ws.weapons && !onWeapon) return `${ws.name} needs ${ws.weapons.join(" or ")}.`;
  return null;
}

/** Polearm skills this Warrior can put on the bar. */
export function warPolearmList(ctx) {
  return POLEARM_SKILLS.filter((ws) => warCanUsePolearm(ws, ctx) === null);
}



/**
 * Katana weapon skills from the BG-Wiki pages.
 * Every one lists Ninja. Warrior has no Katana skill, so none are on the bar.
 * A quest tag does not lock the skill.
 */
export const KATANA_SKILLS: readonly SwordWs[] = [
{ name: "Blade: Rin", skill: 5, level: 1, jobs: ["NIN"], hits: 1, mods: { str: 0.6, dex: 0.6 }, ftp: [1], chains: ["Transfixion"], effect: "Single attack. Critical hit rate is about 25% at 1000 TP. The page left 2000 and 3000 blank, and this rate ignores outside critical hit bonuses. Ninja only.", kind: "physical" },
{ name: "Blade: Retsu", skill: 30, level: 9, jobs: ["NIN"], hits: 2, mods: { str: 0.2, dex: 0.6 }, ftp: [1], chains: ["Scission"], effect: "Twofold attack. Paralyzes the target. Potency is up to about 30%. Duration 30s / 60s / 120s. Ninja only.", kind: "physical" },
{ name: "Blade: Teki", skill: 70, level: 23, jobs: ["NIN"], hits: 1, mods: { str: 0.3, int: 0.3 }, ftp: [1], element: "Water", chains: ["Reverberation"], effect: "Hybrid water damage. The page prints the magic fTP as +0.5 / +1.375 / +2.25. Ninja only.", kind: "physical" },
{ name: "Blade: To", skill: 100, level: 33, jobs: ["NIN"], hits: 1, mods: { str: 0.4, int: 0.4 }, ftp: [1], element: "Ice", chains: ["Induration", "Detonation"], effect: "Hybrid ice damage. The page prints the magic fTP as +0.5 / +1.5 / +2.5. Ninja only.", kind: "physical" },
{ name: "Blade: Chi", skill: 150, level: 49, jobs: ["NIN"], hits: 2, mods: { str: 0.3, int: 0.3 }, ftp: [1], element: "Earth", chains: ["Impaction", "Transfixion"], effect: "Twofold hybrid earth attack. The page prints the magic fTP as +0.5 / +1.375 / +2.25. Ninja only.", kind: "physical" },
{ name: "Blade: Ei", skill: 175, level: 55, jobs: ["NIN"], hits: 1, mods: { str: 0.4, int: 0.4 }, ftp: [1, 3, 5], element: "Dark", chains: ["Compression"], effect: "Dark elemental damage. Damage varies with TP. dSTAT is (INT - target INT) / 2 + 8, capped at 32. Ignores Utsusemi and Blink. Ninja only.", kind: "magical" },
{ name: "Blade: Jin", skill: 200, level: 60, jobs: ["NIN"], mainOnly: true, hits: 3, mods: { str: 0.3, dex: 0.3 }, ftp: [1.375], replicating: true, chains: ["Impaction", "Detonation"], effect: "Threefold attack. Chance of critical hit varies with TP. The page left the rates blank. Ninja main only.", kind: "physical" },
{ name: "Blade: Ten", skill: 225, level: 66, jobs: ["NIN"], mainOnly: true, hits: 1, mods: { str: 0.3, dex: 0.3 }, ftp: [4.5, 11.5, 15.5], chains: ["Gravitation"], effect: "Single attack. Damage varies with TP. Ninja main only.", kind: "physical" },
{ name: "Blade: Ku", skill: 250, level: 72, jobs: ["NIN"], mainOnly: true, quest: "Bugi Soden", bypassSkill: true, weapons: ["Kaja Katana", "Gokotai"], hits: 5, mods: { str: 0.3, dex: 0.3 }, ftp: [1.25], replicating: true, chains: ["Gravitation", "Transfixion"], effect: "Fivefold attack. Accuracy varies with TP. The page left the amounts blank. Unlock quest: Bugi Soden. Kaja Katana or Gokotai grants it and adds 60% damage. Ninja main only.", kind: "physical" },
{ name: "Blade: Yu", skill: 290, level: 80, jobs: ["NIN"], mainOnly: true, hits: 1, mods: { dex: 0.4, int: 0.4 }, ftp: [3], element: "Water", chains: ["Reverberation", "Scission"], effect: "Water elemental damage. Poisons for -10 HP per tick for 90s / 180s / 270s. dSTAT is none. Ninja main only.", kind: "magical" },
{ name: "Blade: Shun", skill: 357, level: 91, jobs: ["NIN"], mainOnly: true, quest: "Martial Mastery", hits: 5, mods: { dex: 0.73 }, ftp: [1], attackBonus: [0, 1, 2], replicating: true, chains: ["Fusion", "Impaction"], aftermath: "Light", effect: "Fivefold attack. DEX is 73% / 76% / 79% / 82% / 85%. Attack +0% / +100% / +200%. Ninja main only.", kind: "physical" },
{ name: "Blade: Metsu", skill: null, jobs: ["NIN"], hits: 1, mods: { dex: 0.8 }, ftp: [5], chains: ["Darkness", "Fragmentation"], effect: "Relic. Yoshimitsu, Kikoku, or Sekirei. Aftermath Subtle Blow +10 for 20s / 40s / 60s. Ninja only. The page lists no skill number.", kind: "physical" },
{ name: "Blade: Kamu", skill: null, level: 75, jobs: ["NIN"], mainOnly: true, quest: "Unlocking a Myth (Ninja)", hits: 1, mods: { str: 0.6, int: 0.6 }, ftp: [1], attackBonus: [2, 2, 2], chains: ["Fragmentation", "Compression"], effect: "Lowers accuracy by 10 for 60s / 120s / 180s. Attack modifier about 3.0. Mythic, Nagi. Ninja main only.", kind: "physical" },
{ name: "Blade: Hi", skill: null, level: 85, jobs: ["NIN"], mainOnly: true, quest: "Kupofried's Weapon Skill Moogle Magic", hits: 1, mods: { agi: 0.8 }, ftp: [5], critBonus: [0.15, 0.2, 0.25], chains: ["Darkness", "Gravitation"], effect: "Deals quadruple damage. The page lists fTP 5.0. Critical hit rate +15% / +20% / +25%. Empyrean, Kannagi. Ninja main only.", kind: "physical" },
{ name: "Zesho Meppo", skill: null, level: 99, jobs: ["NIN"], hits: 4, mods: { dex: 0.25, agi: 0.25 }, ftp: [4, 4, 18.715], chains: ["Induration", "Reverberation", "Fusion"], effect: "Fourfold attack. fTP 4 at 1000 TP and 18.715 at 3000 TP. The 2000 TP cell is blank, so it stays at 4. Prime, Dokoku. Aftermath is physical damage limit+. Ninja only.", kind: "physical" }];


export function katanaByName(name) {
  return KATANA_SKILLS.find((ws) => ws.name === name);
}

export function warCanUseKatana(ws, ctx) {
  if (ctx.job !== "WAR") return `${ws.name} is not checked for this job.`;
  const onWeapon = ws.weapons?.includes(ctx.weaponName) === true;
  if (!ws.jobs.includes("WAR") && !onWeapon) {
    return ws.weapons ? `${ws.name} needs ${ws.weapons.join(" or ")}.` : `${ws.name} is not a Warrior weapon skill.`;
  }
  if (ws.mainOnly && !ctx.main) return `${ws.name} requires Warrior as the main job.`;
  if (ws.level != null && ctx.level < ws.level) return `${ws.name} requires level ${ws.level}.`;
  if (ws.skill != null && ctx.skill < ws.skill && !(ws.bypassSkill && onWeapon)) return `${ws.name} needs Katana skill ${ws.skill}.`;
  if (ws.skill == null && ws.weapons && !onWeapon) return `${ws.name} needs ${ws.weapons.join(" or ")}.`;
  return null;
}

/** Katana skills this Warrior can put on the bar. */
export function warKatanaList(ctx) {
  return KATANA_SKILLS.filter((ws) => warCanUseKatana(ws, ctx) === null);
}

const GK_OPEN = ["SAM", "NIN"];



/**
 * Great Katana weapon skills from the BG-Wiki pages.
 * Warrior has no Great Katana skill, and none of these list Warrior.
 * A quest tag does not lock the skill.
 */
export const GREAT_KATANA_SKILLS: readonly SwordWs[] = [
{ name: "Tachi: Enpi", skill: 5, level: 1, jobs: GK_OPEN, hits: 2, mods: { str: 0.6 }, ftp: [1, 2, 4], chains: ["Transfixion", "Scission"], effect: "Twofold attack. Damage varies with TP. Samurai or Ninja.", kind: "physical" },
{ name: "Tachi: Hobaku", skill: 30, level: 9, jobs: GK_OPEN, hits: 1, mods: { str: 0.6 }, ftp: [1], chains: ["Induration"], effect: "Stuns the target. The chance varies with TP. Samurai or Ninja.", kind: "physical" },
{ name: "Tachi: Goten", skill: 70, level: 23, jobs: GK_OPEN, hits: 1, mods: { str: 0.6 }, ftp: [1], element: "Lightning", chains: ["Transfixion", "Impaction"], effect: "Hybrid lightning damage. The page prints the magic fTP as +0.5 / +1.5 / +2.5. Samurai or Ninja.", kind: "physical" },
{ name: "Tachi: Kagero", skill: 100, level: 33, jobs: GK_OPEN, hits: 1, mods: { str: 0.75 }, ftp: [1], element: "Fire", chains: ["Liquefaction"], effect: "Hybrid fire damage. The page prints the magic fTP as +0.5 / +1.5 / +2.5. Samurai or Ninja.", kind: "physical" },
{ name: "Tachi: Jinpu", skill: 150, level: 49, jobs: GK_OPEN, hits: 2, mods: { str: 0.3 }, ftp: [1], element: "Wind", chains: ["Scission", "Detonation"], effect: "Twofold hybrid wind attack. The page prints the magic fTP as +0.5 / +1.5 / +2.5. Samurai or Ninja.", kind: "physical" },
{ name: "Tachi: Koki", skill: 175, level: 55, jobs: GK_OPEN, hits: 1, mods: { str: 0.5, mnd: 0.3 }, ftp: [1], element: "Light", chains: ["Reverberation", "Impaction"], effect: "Hybrid light damage. The page prints the magic fTP as +0.5 / +1.5 / +2.5. Samurai or Ninja.", kind: "physical" },
{ name: "Tachi: Yukikaze", skill: 200, level: 60, jobs: ["SAM"], mainOnly: true, hits: 1, mods: { str: 0.75 }, ftp: [1.5625, 2.6875, 4.125], chains: ["Induration", "Detonation"], effect: "Blinds the target for 60 seconds. Damage varies with TP. Samurai main only.", kind: "physical" },
{ name: "Tachi: Gekko", skill: 225, jobs: ["SAM"], mainOnly: true, hits: 1, mods: { str: 0.75 }, ftp: [1.5625, 2.6875, 4.125], chains: ["Distortion", "Reverberation"], effect: "Silences the target. Unresisted duration is 45 seconds. Samurai main. A Ninja needs a Beryllium Tachi.", kind: "physical" },
{ name: "Tachi: Kasha", skill: 250, level: 71, jobs: ["SAM"], mainOnly: true, quest: "The Potential Within", hits: 1, mods: { str: 0.75 }, ftp: [1.5625, 2.6875, 4.125], chains: ["Fusion", "Compression"], effect: "Paralyzes the target for 60 seconds. Damage varies with TP. Unlock quest: The Potential Within. A Ninja needs Kaja Tachi or Hachimonji. Samurai main only.", kind: "physical" },
{ name: "Tachi: Ageha", skill: 300, level: 80, jobs: GK_OPEN, hits: 1, mods: { str: 0.4, chr: 0.6 }, ftp: [2.625], chains: ["Compression", "Scission"], effect: "Lowers defense by 25% for 3 minutes, or 90 seconds on a resist. The chance varies with TP. Samurai or Ninja.", kind: "physical" },
{ name: "Tachi: Shoha", skill: 357, level: 90, jobs: ["SAM"], quest: "Martial Mastery", hits: 2, mods: { str: 0.73 }, ftp: [1.375, 3.25, 4.625], attackBonus: [0.375, 0.375, 0.375], chains: ["Fragmentation", "Compression"], aftermath: "Light", effect: "Twofold attack. STR is 73% / 76% / 79% / 82% / 85%. Attack modifier about 1.375. Unlock quest: Martial Mastery. Light can appear under Aeonic Aftermath. Samurai only.", kind: "physical" },
{ name: "Tachi: Kaiten", skill: null, jobs: ["SAM"], hits: 1, mods: { str: 0.8 }, ftp: [3], chains: ["Light", "Fragmentation"], effect: "Relic. Totsukanotsurugi, Amanomurakumo, Ame-no-ohabari, or Fusenaikyo. Aftermath Store TP +10 for 20s / 40s / 60s. Samurai only. The page lists no skill number.", kind: "physical" },
{ name: "Tachi: Fudo", skill: null, jobs: ["SAM"], mainOnly: true, hits: 1, mods: { str: 0.8 }, ftp: [3.75, 5.75, 8], chains: ["Light", "Distortion"], effect: "Deals double damage. Damage varies with TP. Empyrean, Masamune. Samurai main only.", kind: "physical" },
{ name: "Tachi: Rana", skill: null, level: 75, jobs: ["SAM"], mainOnly: true, quest: "Unlocking a Myth (Samurai)", hits: 3, mods: { str: 0.5 }, ftp: [1], chains: ["Gravitation", "Induration"], effect: "Threefold attack. Accuracy varies with TP. The page left the accuracy amounts blank. Mythic, Kogarasumaru. Samurai main only.", kind: "physical" },
{ name: "Tachi: Mumei", skill: null, level: 99, jobs: ["SAM"], hits: 1, mods: { str: 0.5, dex: 0.5 }, ftp: [3.66, 7.33, 11], chains: ["Detonation", "Compression", "Distortion"], effect: "Damage varies with TP. Prime, Kusanagi. Samurai only.", kind: "physical" }];


export function greatKatanaByName(name) {
  return GREAT_KATANA_SKILLS.find((ws) => ws.name === name);
}

export function warCanUseGreatKatana(ws, ctx) {
  if (ctx.job !== "WAR") return `${ws.name} is not checked for this job.`;
  const onWeapon = ws.weapons?.includes(ctx.weaponName) === true;
  if (!ws.jobs.includes("WAR") && !onWeapon) {
    return ws.weapons ? `${ws.name} needs ${ws.weapons.join(" or ")}.` : `${ws.name} is not a Warrior weapon skill.`;
  }
  if (ws.mainOnly && !ctx.main) return `${ws.name} requires Warrior as the main job.`;
  if (ws.level != null && ctx.level < ws.level) return `${ws.name} requires level ${ws.level}.`;
  if (ws.skill != null && ctx.skill < ws.skill && !(ws.bypassSkill && onWeapon)) return `${ws.name} needs Great Katana skill ${ws.skill}.`;
  if (ws.skill == null && ws.weapons && !onWeapon) return `${ws.name} needs ${ws.weapons.join(" or ")}.`;
  return null;
}

/** Great Katana skills this Warrior can put on the bar. */
export function warGreatKatanaList(ctx) {
  return GREAT_KATANA_SKILLS.filter((ws) => warCanUseGreatKatana(ws, ctx) === null);
}

/** Samurai weapon skills through level 75. A quest tag does not lock the skill. */
export function samCanUse(ws, ctx) {
  if (ctx.job !== "SAM") return `${ws.name} is not checked for this job.`;
  if (!ws.jobs.includes("SAM")) return `${ws.name} is not a Samurai weapon skill.`;
  if (ws.requires && !ws.requires.includes("SAM") && !(ctx.sub && ws.requires.includes(ctx.sub))) {
    return `${ws.name} requires ${ws.requires.join(" or ")} as main or sub.`;
  }
  if (ws.mainOnly && !ctx.main) return `${ws.name} requires Samurai as the main job.`;
  if (ws.level != null && ctx.level < ws.level) return `${ws.name} requires level ${ws.level}.`;
  const onWeapon = ws.weapons?.includes(ctx.weaponName) === true || ws.warWeapons?.includes(ctx.weaponName) === true;
  if (ws.skill != null && ctx.skill < ws.skill && !(ws.bypassSkill && onWeapon)) {
    return `${ws.name} needs skill ${ws.skill}.`;
  }
  if (ws.skill == null && !onWeapon) return `${ws.name} needs its weapon.`;
  return null;
}

/** Great Katana skills this Samurai can put on the bar. */
export function samGreatKatanaList(ctx) {
  return GREAT_KATANA_SKILLS.filter((ws) => samCanUse(ws, ctx) === null);
}

/** Ranger weapon skills through level 75. A quest tag does not lock the skill. */
export function rngCanUse(ws, ctx) {
  if (ctx.job !== "RNG") return `${ws.name} is not checked for this job.`;
  if (!ws.jobs.includes("RNG")) return `${ws.name} is not a Ranger weapon skill.`;
  if (ws.requires && !ws.requires.includes("RNG") && !(ctx.sub && ws.requires.includes(ctx.sub))) {
    return `${ws.name} requires ${ws.requires.join(" or ")} as main or sub.`;
  }
  if (ws.mainOnly && !ctx.main) return `${ws.name} requires Ranger as the main job.`;
  if (ws.level != null && ctx.level < ws.level) return `${ws.name} requires level ${ws.level}.`;
  const onWeapon = ws.weapons?.includes(ctx.weaponName) === true || ws.warWeapons?.includes(ctx.weaponName) === true;
  if (ws.skill != null && ctx.skill < ws.skill && !(ws.bypassSkill && onWeapon)) {
    return `${ws.name} needs skill ${ws.skill}.`;
  }
  if (ws.skill == null && !onWeapon) return `${ws.name} needs its weapon.`;
  return null;
}

/** Corsair weapon skills through level 75. A quest tag does not lock the skill. */
export function corCanUse(ws, ctx) {
  if (ctx.job !== "COR") return `${ws.name} is not checked for this job.`;
  if (!ws.jobs.includes("COR")) return `${ws.name} is not a Corsair weapon skill.`;
  if (ws.requires && !ws.requires.includes("COR") && !(ctx.sub && ws.requires.includes(ctx.sub))) {
    return `${ws.name} requires ${ws.requires.join(" or ")} as main or sub.`;
  }
  if (ws.mainOnly && !ctx.main) return `${ws.name} requires Corsair as the main job.`;
  if (ws.level != null && ctx.level < ws.level) return `${ws.name} requires level ${ws.level}.`;
  const onWeapon = ws.weapons?.includes(ctx.weaponName) === true || ws.warWeapons?.includes(ctx.weaponName) === true;
  if (ws.skill != null && ctx.skill < ws.skill && !(ws.bypassSkill && onWeapon)) {
    return `${ws.name} needs skill ${ws.skill}.`;
  }
  if (ws.skill == null && !onWeapon) return `${ws.name} needs its weapon.`;
  return null;
}

/** Dancer weapon skills through level 75. A quest tag does not lock the skill. Mythic weapons are not in the bag. */
export function dncCanUse(ws, ctx) {
  if (ctx.job !== "DNC") return `${ws.name} is not checked for this job.`;
  if (!ws.jobs.includes("DNC")) return `${ws.name} is not a Dancer weapon skill.`;
  if (ws.requires && !ws.requires.includes("DNC") && !(ctx.sub && ws.requires.includes(ctx.sub))) {
    return `${ws.name} requires ${ws.requires.join(" or ")} as main or sub.`;
  }
  if (ws.mainOnly && !ctx.main) return `${ws.name} requires Dancer as the main job.`;
  if (ws.level != null && ctx.level < ws.level) return `${ws.name} requires level ${ws.level}.`;
  const onWeapon = ws.weapons?.includes(ctx.weaponName) === true || ws.warWeapons?.includes(ctx.weaponName) === true;
  if (ws.skill != null && ctx.skill < ws.skill && !(ws.bypassSkill && onWeapon)) {
    return `${ws.name} needs skill ${ws.skill}.`;
  }
  if (ws.skill == null && !onWeapon) return `${ws.name} needs its weapon.`;
  return null;
}

/** Scholar weapon skills through level 75. A quest tag does not lock the skill. Mythic and relic weapons are not in the bag. */
export function schCanUse(ws, ctx) {
  if (ctx.job !== "SCH") return `${ws.name} is not checked for this job.`;
  if (!ws.jobs.includes("SCH")) return `${ws.name} is not a Scholar weapon skill.`;
  if (ws.requires && !ws.requires.includes("SCH") && !(ctx.sub && ws.requires.includes(ctx.sub))) {
    return `${ws.name} requires ${ws.requires.join(" or ")} as main or sub.`;
  }
  if (ws.mainOnly && !ctx.main) return `${ws.name} requires Scholar as the main job.`;
  if (ws.level != null && ctx.level < ws.level) return `${ws.name} requires level ${ws.level}.`;
  const onWeapon = ws.weapons?.includes(ctx.weaponName) === true || ws.warWeapons?.includes(ctx.weaponName) === true;
  if (ws.skill != null && ctx.skill < ws.skill && !(ws.bypassSkill && onWeapon)) {
    return `${ws.name} needs skill ${ws.skill}.`;
  }
  if (ws.skill == null && !onWeapon) return `${ws.name} needs its weapon.`;
  return null;
}

/** Rune Fencer weapon skills through level 75. Great sword, sword, great axe, axe, and club. A quest tag does not lock the skill. Epeolatry is not in the bag, so Dimidiation stays locked. */
export function runCanUse(ws, ctx) {
  if (ctx.job !== "RUN") return `${ws.name} is not checked for this job.`;
  if (!ws.jobs.includes("RUN")) return `${ws.name} is not a Rune Fencer weapon skill.`;
  if (ws.requires && !ws.requires.includes("RUN") && !(ctx.sub && ws.requires.includes(ctx.sub))) {
    return `${ws.name} requires ${ws.requires.join(" or ")} as main or sub.`;
  }
  if (ws.mainOnly && !ctx.main) return `${ws.name} requires Rune Fencer as the main job.`;
  if (ws.level != null && ctx.level < ws.level) return `${ws.name} requires level ${ws.level}.`;
  const onWeapon = ws.weapons?.includes(ctx.weaponName) === true || ws.warWeapons?.includes(ctx.weaponName) === true;
  if (ws.skill != null && ctx.skill < ws.skill && !(ws.bypassSkill && onWeapon)) {
    return `${ws.name} needs skill ${ws.skill}.`;
  }
  if (ws.skill == null && !onWeapon) return `${ws.name} needs its weapon.`;
  return null;
}

/** Geomancer weapon skills through level 75. Club, staff, and dagger. A quest tag does not lock the skill. Idris is not in the bag. */
export function geoCanUse(ws, ctx) {
  if (ctx.job !== "GEO") return `${ws.name} is not checked for this job.`;
  if (!ws.jobs.includes("GEO")) return `${ws.name} is not a Geomancer weapon skill.`;
  if (ws.requires && !ws.requires.includes("GEO") && !(ctx.sub && ws.requires.includes(ctx.sub))) {
    return `${ws.name} requires ${ws.requires.join(" or ")} as main or sub.`;
  }
  if (ws.mainOnly && !ctx.main) return `${ws.name} requires Geomancer as the main job.`;
  if (ws.level != null && ctx.level < ws.level) return `${ws.name} requires level ${ws.level}.`;
  const onWeapon = ws.weapons?.includes(ctx.weaponName) === true || ws.warWeapons?.includes(ctx.weaponName) === true;
  if (ws.skill != null && ctx.skill < ws.skill && !(ws.bypassSkill && onWeapon)) {
    return `${ws.name} needs skill ${ws.skill}.`;
  }
  if (ws.skill == null && !onWeapon) return `${ws.name} needs its weapon.`;
  return null;
}

/** Paladin weapon skills through level 75. A quest tag does not lock the skill. */
export function pldCanUse(ws, ctx) {
  if (ctx.job !== "PLD") return `${ws.name} is not checked for this job.`;
  if (!ws.jobs.includes("PLD")) return `${ws.name} is not a Paladin weapon skill.`;
  if (ws.requires && !ws.requires.includes("PLD") && !(ctx.sub && ws.requires.includes(ctx.sub))) {
    return `${ws.name} requires ${ws.requires.join(" or ")} as main or sub.`;
  }
  if (ws.mainOnly && !ctx.main) return `${ws.name} requires Paladin as the main job.`;
  if (ws.level != null && ctx.level < ws.level) return `${ws.name} requires level ${ws.level}.`;
  const onWeapon = ws.weapons?.includes(ctx.weaponName) === true || ws.warWeapons?.includes(ctx.weaponName) === true;
  if (ws.skill != null && ctx.skill < ws.skill && !(ws.bypassSkill && onWeapon)) {
    return `${ws.name} needs skill ${ws.skill}.`;
  }
  if (ws.skill == null && !onWeapon) return `${ws.name} needs its weapon.`;
  return null;
}

/** Dark Knight weapon skills through level 75. A quest tag does not lock the skill. */
export function drkCanUse(ws, ctx) {
  if (ctx.job !== "DRK") return `${ws.name} is not checked for this job.`;
  if (!ws.jobs.includes("DRK")) return `${ws.name} is not a Dark Knight weapon skill.`;
  if (ws.requires && !ws.requires.includes("DRK") && !(ctx.sub && ws.requires.includes(ctx.sub))) {
    return `${ws.name} requires ${ws.requires.join(" or ")} as main or sub.`;
  }
  if (ws.mainOnly && !ctx.main) return `${ws.name} requires Dark Knight as the main job.`;
  if (ws.level != null && ctx.level < ws.level) return `${ws.name} requires level ${ws.level}.`;
  const onWeapon = ws.weapons?.includes(ctx.weaponName) === true || ws.warWeapons?.includes(ctx.weaponName) === true;
  if (ws.skill != null && ctx.skill < ws.skill && !(ws.bypassSkill && onWeapon)) {
    return `${ws.name} needs skill ${ws.skill}.`;
  }
  if (ws.skill == null && !onWeapon) return `${ws.name} needs its weapon.`;
  return null;
}

/** Dragoon weapon skills through level 75. A quest tag does not lock the skill. */
export function drgCanUse(ws, ctx) {
  if (ctx.job !== "DRG") return `${ws.name} is not checked for this job.`;
  if (!ws.jobs.includes("DRG")) return `${ws.name} is not a Dragoon weapon skill.`;
  if (ws.requires && !ws.requires.includes("DRG") && !(ctx.sub && ws.requires.includes(ctx.sub))) {
    return `${ws.name} requires ${ws.requires.join(" or ")} as main or sub.`;
  }
  if (ws.mainOnly && !ctx.main) return `${ws.name} requires Dragoon as the main job.`;
  if (ws.level != null && ctx.level < ws.level) return `${ws.name} requires level ${ws.level}.`;
  const onWeapon = ws.weapons?.includes(ctx.weaponName) === true || ws.warWeapons?.includes(ctx.weaponName) === true;
  if (ws.skill != null && ctx.skill < ws.skill && !(ws.bypassSkill && onWeapon)) {
    return `${ws.name} needs skill ${ws.skill}.`;
  }
  if (ws.skill == null && !onWeapon) return `${ws.name} needs its weapon.`;
  return null;
}

/** Summoner weapon skills through level 75. Staff, club, and dagger. A quest tag does not lock the skill. */
export function smnCanUse(ws, ctx) {
  if (ctx.job !== "SMN") return `${ws.name} is not checked for this job.`;
  if (!ws.jobs.includes("SMN")) return `${ws.name} is not a Summoner weapon skill.`;
  if (ws.requires && !ws.requires.includes("SMN") && !(ctx.sub && ws.requires.includes(ctx.sub))) {
    return `${ws.name} requires ${ws.requires.join(" or ")} as main or sub.`;
  }
  if (ws.mainOnly && !ctx.main) return `${ws.name} requires Summoner as the main job.`;
  if (ws.level != null && ctx.level < ws.level) return `${ws.name} requires level ${ws.level}.`;
  const onWeapon = ws.weapons?.includes(ctx.weaponName) === true || ws.warWeapons?.includes(ctx.weaponName) === true;
  if (ws.skill != null && ctx.skill < ws.skill && !(ws.bypassSkill && onWeapon)) {
    return `${ws.name} needs skill ${ws.skill}.`;
  }
  if (ws.skill == null && !onWeapon) return `${ws.name} needs its weapon.`;
  return null;
}

/** Beastmaster weapon skills through level 75. Axe, scythe, dagger, club, and sword. A quest tag does not lock the skill. */
export function bstCanUse(ws, ctx) {
  if (ctx.job !== "BST") return `${ws.name} is not checked for this job.`;
  if (!ws.jobs.includes("BST")) return `${ws.name} is not a Beastmaster weapon skill.`;
  if (ws.requires && !ws.requires.includes("BST") && !(ctx.sub && ws.requires.includes(ctx.sub))) {
    return `${ws.name} requires ${ws.requires.join(" or ")} as main or sub.`;
  }
  if (ws.mainOnly && !ctx.main) return `${ws.name} requires Beastmaster as the main job.`;
  if (ws.level != null && ctx.level < ws.level) return `${ws.name} requires level ${ws.level}.`;
  const onWeapon = ws.weapons?.includes(ctx.weaponName) === true || ws.warWeapons?.includes(ctx.weaponName) === true;
  if (ws.skill != null && ctx.skill < ws.skill && !(ws.bypassSkill && onWeapon)) {
    return `${ws.name} needs skill ${ws.skill}.`;
  }
  if (ws.skill == null && !onWeapon) return `${ws.name} needs its weapon.`;
  return null;
}

/** Blue Mage weapon skills through level 75. Sword and club. A quest tag does not lock the skill. */
export function bluCanUse(ws, ctx) {
  if (ctx.job !== "BLU") return `${ws.name} is not checked for this job.`;
  if (!ws.jobs.includes("BLU")) return `${ws.name} is not a Blue Mage weapon skill.`;
  if (ws.requires && !ws.requires.includes("BLU") && !(ctx.sub && ws.requires.includes(ctx.sub))) {
    return `${ws.name} requires ${ws.requires.join(" or ")} as main or sub.`;
  }
  if (ws.mainOnly && !ctx.main) return `${ws.name} requires Blue Mage as the main job.`;
  if (ws.level != null && ctx.level < ws.level) return `${ws.name} requires level ${ws.level}.`;
  const onWeapon = ws.weapons?.includes(ctx.weaponName) === true || ws.warWeapons?.includes(ctx.weaponName) === true;
  if (ws.skill != null && ctx.skill < ws.skill && !(ws.bypassSkill && onWeapon)) {
    return `${ws.name} needs skill ${ws.skill}.`;
  }
  if (ws.skill == null && !onWeapon) return `${ws.name} needs its weapon.`;
  return null;
}

/** Puppetmaster weapon skills through level 75. Hand-to-hand, dagger, and club. A quest tag does not lock the skill. */
export function pupCanUse(ws, ctx) {
  if (ctx.job !== "PUP") return `${ws.name} is not checked for this job.`;
  if (!ws.jobs.includes("PUP")) return `${ws.name} is not a Puppetmaster weapon skill.`;
  if (ws.requires && !ws.requires.includes("PUP") && !(ctx.sub && ws.requires.includes(ctx.sub))) {
    return `${ws.name} requires ${ws.requires.join(" or ")} as main or sub.`;
  }
  if (ws.mainOnly && !ctx.main) return `${ws.name} requires Puppetmaster as the main job.`;
  if (ws.level != null && ctx.level < ws.level) return `${ws.name} requires level ${ws.level}.`;
  const onWeapon = ws.weapons?.includes(ctx.weaponName) === true || ws.warWeapons?.includes(ctx.weaponName) === true;
  if (ws.skill != null && ctx.skill < ws.skill && !(ws.bypassSkill && onWeapon)) {
    return `${ws.name} needs skill ${ws.skill}.`;
  }
  if (ws.skill == null && !onWeapon) return `${ws.name} needs its weapon.`;
  return null;
}

/** Ninja weapon skills through level 75. A quest tag does not lock the skill. */
export function ninCanUse(ws, ctx) {
  if (ctx.job !== "NIN") return `${ws.name} is not checked for this job.`;
  if (!ws.jobs.includes("NIN")) return `${ws.name} is not a Ninja weapon skill.`;
  if (ws.requires && !ws.requires.includes("NIN") && !(ctx.sub && ws.requires.includes(ctx.sub))) {
    return `${ws.name} requires ${ws.requires.join(" or ")} as main or sub.`;
  }
  if (ws.mainOnly && !ctx.main) return `${ws.name} requires Ninja as the main job.`;
  if (ws.level != null && ctx.level < ws.level) return `${ws.name} requires level ${ws.level}.`;
  const onWeapon = ws.weapons?.includes(ctx.weaponName) === true || ws.warWeapons?.includes(ctx.weaponName) === true;
  if (ws.skill != null && ctx.skill < ws.skill && !(ws.bypassSkill && onWeapon)) {
    return `${ws.name} needs skill ${ws.skill}.`;
  }
  if (ws.skill == null && !onWeapon) return `${ws.name} needs its weapon.`;
  return null;
}

/** Bard weapon skills through level 75. Dagger, sword, staff, and club. A quest tag does not lock the skill. */
export function brdCanUse(ws, ctx) {
  if (ctx.job !== "BRD") return `${ws.name} is not checked for this job.`;
  if (!ws.jobs.includes("BRD")) return `${ws.name} is not a Bard weapon skill.`;
  if (ws.requires && !ws.requires.includes("BRD") && !(ctx.sub && ws.requires.includes(ctx.sub))) {
    return `${ws.name} requires ${ws.requires.join(" or ")} as main or sub.`;
  }
  if (ws.mainOnly && !ctx.main) return `${ws.name} requires Bard as the main job.`;
  if (ws.level != null && ctx.level < ws.level) return `${ws.name} requires level ${ws.level}.`;
  const onWeapon = ws.weapons?.includes(ctx.weaponName) === true || ws.warWeapons?.includes(ctx.weaponName) === true;
  if (ws.skill != null && ctx.skill < ws.skill && !(ws.bypassSkill && onWeapon)) {
    return `${ws.name} needs skill ${ws.skill}.`;
  }
  if (ws.skill == null && !onWeapon) return `${ws.name} needs its weapon.`;
  return null;
}

const ARCH_JOBS = ["WAR", "RDM", "THF", "RNG", "SAM", "NIN"];

/**
 * Archery weapon skills from the BG-Wiki pages.
 * Flaming Arrow, Piercing Arrow, Dulling Arrow, and Sidewinder can be
 * learned by any bow job, and each page says they can only be used with
 * Ranger as main or sub. A level 75 Warrior has Archery 210. Without
 * Ranger that list is empty. Warrior / Ranger at 210 keeps those four.
 * Blast Arrow stays Ranger main. Arching Arrow is Ranger main at 66,
 * Archery 225, fTP 3.5. Empyreal Arrow is Ranger main at 72, Archery 250,
 * fTP 1.5 / 2.5 / 5, attack modifier 2.0. Other jobs only get those two
 * from a level-99 bow, and those bows are not in this yard. A quest tag
 * does not lock a skill by itself. Refulgent Arrow is past 276.
 */
export const ARCHERY_SKILLS: readonly SwordWs[] = [
{ name: "Flaming Arrow", skill: 5, level: 2, jobs: ARCH_JOBS, requires: ["RNG"], hits: 1, mods: { str: 0.2, agi: 0.5 }, ftp: [0.5, 1.55, 2.1], element: "Fire", chains: ["Liquefaction", "Transfixion"], effect: "Hybrid fire damage. Damage varies with TP. Main or sub must be Ranger. Level 1 for Thief, Ranger, and Samurai. Level 2 for Warrior, Red Mage, and Ninja.", kind: "physical" },
{ name: "Piercing Arrow", skill: 40, level: 15, jobs: ARCH_JOBS, requires: ["RNG"], hits: 1, mods: { str: 0.2, agi: 0.5 }, ftp: [1], defenseIgnored: [0, 0.35, 0.5], chains: ["Reverberation", "Transfixion"], effect: "Ignores 0% / 35% / 50% of defense. Main or sub must be Ranger. Level 13 for Ranger, 14 for Thief and Samurai, 15 for Warrior and Red Mage, 16 for Ninja.", kind: "physical" },
{ name: "Dulling Arrow", skill: 80, level: 30, jobs: ARCH_JOBS, requires: ["RNG"], hits: 1, mods: { str: 0.2, agi: 0.5 }, ftp: [1], chains: ["Liquefaction", "Transfixion"], effect: "Lowers the target's INT. The page does not print the amount. Critical hit chance varies with TP. The page does not print the rates. Main or sub must be Ranger. Level 26 for Ranger, 28 for Thief and Samurai, 30 for Warrior and Red Mage, 32 for Ninja.", kind: "physical" },
{ name: "Sidewinder", skill: 175, level: 59, jobs: ARCH_JOBS, requires: ["RNG"], hits: 1, mods: { str: 0.2, agi: 0.5 }, ftp: [5], rangedAcc: [-50, 0, 0], chains: ["Reverberation", "Transfixion", "Detonation"], effect: "Quintuple damage. Ranged accuracy −50 / ±0. The 3000 TP cell is blank, so it stays ±0. Main or sub must be Ranger. Level 55 for Ranger, 57 for Thief and Samurai, 59 for Warrior and Red Mage, 63 for Ninja.", kind: "physical" },
{ name: "Blast Arrow", skill: 200, level: 60, jobs: ["RNG"], mainOnly: true, hits: 1, mods: { str: 0.2, agi: 0.5 }, ftp: [2], chains: ["Induration", "Transfixion"], effect: "Single attack. Ranger main only.", kind: "physical" },
{ name: "Arching Arrow", skill: 225, level: 66, jobs: ["RNG"], mainOnly: true, weapons: ["Exalted Bow", "Exalted Bow +1"], weaponLevel: 99, hits: 1, mods: { str: 0.2, agi: 0.5 }, ftp: [3.5], chains: ["Fusion"], effect: "Single attack. Critical hit chance varies with TP. The page does not print the rates. Ranger main only. Other jobs need an Exalted Bow at level 99.", kind: "physical" },
{ name: "Empyreal Arrow", skill: 250, level: 72, jobs: ["RNG"], mainOnly: true, quest: "From Saplings Grow", bypassSkill: true, weapons: ["Kaja Bow", "Ullr"], weaponLevel: 99, hits: 1, mods: { str: 0.2, agi: 0.5 }, ftp: [1.5, 2.5, 5], attackBonus: [1, 1, 1], chains: ["Fusion", "Transfixion"], effect: "Damage varies with TP. Attack modifier 2.0. Unlock quest: From Saplings Grow. Kaja Bow or Ullr can grant it and add 50% damage. Ranger main, or another job at level 99 with one of those bows.", kind: "physical" },
{ name: "Refulgent Arrow", skill: 290, level: 92, jobs: ARCH_JOBS, requires: ["RNG"], hits: 1, mods: { str: 0.6 }, ftp: [3, 4.25, 7], chains: ["Reverberation", "Transfixion"], effect: "Single attack. Damage varies with TP. Main or sub must be Ranger.", kind: "physical" },
{ name: "Apex Arrow", skill: 357, level: 91, jobs: ["RNG", "SAM"], mainOnly: true, hits: 1, mods: { agi: 0.73 }, ftp: [3], chains: ["Fragmentation", "Transfixion"], aftermath: "Light", effect: "Single attack. AGI is 73% / 76% / 79% / 82% / 85%. Ranger or Samurai main only.", kind: "physical" },
{ name: "Namas Arrow", skill: null, jobs: ["RNG", "SAM"], hits: 1, mods: { str: 0.4, agi: 0.4 }, ftp: [2.75], chains: ["Light", "Distortion"], effect: "Relic. Futatokoroto, Yoichinoyumi, or Murti Bow. Aftermath ranged accuracy +30 for 20s / 40s / 60s. Ranger or Samurai only. The page lists no skill number.", kind: "physical" },
{ name: "Jishnu's Radiance", skill: null, level: 85, jobs: ["RNG"], mainOnly: true, quest: "Kupofried's Weapon Skill Moogle Magic", hits: 3, mods: { dex: 0.8 }, ftp: [1.75], replicating: true, chains: ["Light", "Fusion"], effect: "Threefold attack, ammunition permitting. Critical hit rate varies with TP. The page left the percents blank. Empyrean, Gandiva. Ranger main only.", kind: "physical" },
{ name: "Sarv", skill: null, level: 99, jobs: ["RNG"], hits: 1, mods: { str: 0.65, agi: 0.65 }, ftp: [2.75, 5.5, 8.25], chains: ["Transfixion", "Scission", "Gravitation"], effect: "Damage varies with TP. Prime, Pinaka. Ranger only.", kind: "physical" }];


export function archeryByName(name) {
  return ARCHERY_SKILLS.find((ws) => ws.name === name);
}

export function warCanUseArchery(ws, ctx) {
  if (ctx.job !== "WAR") return `${ws.name} is not checked for this job.`;
  const onWeapon = ws.weapons?.includes(ctx.weaponName) === true;
  const native = ws.jobs.includes("WAR");
  if (!native && !onWeapon) {
    return ws.weapons ? `${ws.name} needs ${ws.weapons.join(" or ")}.` : `${ws.name} is not a Warrior weapon skill.`;
  }
  if (!native && ws.weaponLevel != null && ctx.level < ws.weaponLevel) {
    return `${ws.name} requires level ${ws.weaponLevel}.`;
  }
  if (ws.requires && !ws.requires.includes(ctx.job) && !(ctx.sub && ws.requires.includes(ctx.sub))) {
    return `${ws.name} requires Ranger as main or sub.`;
  }
  if (ws.mainOnly && !ctx.main) return `${ws.name} requires Warrior as the main job.`;
  if (ws.level != null && ctx.level < ws.level) return `${ws.name} requires level ${ws.level}.`;
  if (ws.skill != null && ctx.skill < ws.skill && !(ws.bypassSkill && onWeapon)) return `${ws.name} needs Archery skill ${ws.skill}.`;
  if (ws.skill == null && ws.weapons && !onWeapon) return `${ws.name} needs ${ws.weapons.join(" or ")}.`;
  return null;
}

/** Archery skills this Warrior can put on the bar. */
export function warArcheryList(ctx) {
  return ARCHERY_SKILLS.filter((ws) => warCanUseArchery(ws, ctx) === null);
}

const MARK_JOBS = ["WAR", "DRK", "THF", "NIN", "RNG", "COR"];



/**
 * Marksmanship weapon skills from the BG-Wiki pages.
 * A level 75 Warrior has Marksmanship 210. The shared shots need Ranger or Corsair as main or sub.
 * A quest tag does not lock the skill.
 * Slug Shot's ranged accuracy is −50 / ±0. The blank 3000 cell stays ±0.
 * Detonator's attack modifier is 2.0, read the same way as Empyreal Arrow.
 * Leaden Salute stays locked. It needs Death Penalty, which is not in this yard.
 */
export const MARKSMANSHIP_SKILLS: readonly SwordWs[] = [
{ name: "Hot Shot", skill: 5, level: 2, jobs: MARK_JOBS, requires: ["RNG", "COR"], hits: 1, mods: { agi: 0.7 }, ftp: [0.5, 1.55, 2.1], element: "Fire", chains: ["Liquefaction", "Transfixion"], effect: "Hybrid fire damage. Damage varies with TP. Main or sub must be Ranger or Corsair.", kind: "physical" },
{ name: "Split Shot", skill: 40, level: 15, jobs: MARK_JOBS, requires: ["RNG", "COR"], hits: 1, mods: { agi: 0.7 }, ftp: [1], defenseIgnored: [0, 0.35, 0.5], chains: ["Reverberation", "Transfixion"], effect: "Ignores 0% / 35% / 50% of defense. Main or sub must be Ranger or Corsair.", kind: "physical" },
{ name: "Sniper Shot", skill: 80, level: 30, jobs: MARK_JOBS, requires: ["RNG", "COR"], hits: 1, mods: { agi: 0.7 }, ftp: [1], chains: ["Liquefaction", "Transfixion"], effect: "Lowers INT by 10. The loss decays. Main or sub must be Ranger or Corsair.", kind: "physical" },
{ name: "Slug Shot", skill: 175, level: 59, jobs: MARK_JOBS, requires: ["RNG", "COR"], hits: 1, mods: { agi: 0.7 }, ftp: [5], rangedAcc: [-50, 0, 0], chains: ["Reverberation", "Transfixion", "Detonation"], effect: "Single attack. Ranged accuracy −50 / ±0. The 3000 TP cell is blank, so it stays ±0. Main or sub must be Ranger or Corsair.", kind: "physical" },
{ name: "Blast Shot", skill: 200, level: 60, jobs: ["RNG"], mainOnly: true, hits: 1, mods: { agi: 0.7 }, ftp: [2], chains: ["Induration", "Transfixion"], effect: "Single attack. Ranger main only.", kind: "physical" },
{ name: "Heavy Shot", skill: 225, level: 99, jobs: ["RNG"], weapons: ["Exalted Crossbow", "Exalted Crossbow +1"], hits: 1, mods: { agi: 0.7 }, ftp: [3.5], chains: ["Fusion"], effect: "Single attack. Ranger main. Warrior, Thief, or Dark Knight need an Exalted Crossbow at level 99.", kind: "physical" },
{ name: "Detonator", skill: 250, level: 72, jobs: ["RNG", "COR"], mainOnly: true, quest: "Shoot First, Ask Questions Later", hits: 1, mods: { agi: 0.7 }, ftp: [1.5, 2.5, 5], attackBonus: [1, 1, 1], chains: ["Fusion", "Transfixion"], effect: "Damage varies with TP. Attack modifier 2.0. Unlock quest: Shoot First, Ask Questions Later. Ranger or Corsair main only.", kind: "physical" },
{ name: "Numbing Shot", skill: 290, level: 92, jobs: MARK_JOBS, requires: ["RNG", "COR"], hits: 1, mods: { agi: 0.8 }, ftp: [3], chains: ["Induration", "Detonation", "Impaction"], effect: "Paralyzes the target for 60s / 120s / 180s. Main or sub must be Ranger or Corsair.", kind: "physical" },
{ name: "Last Stand", skill: 357, level: 91, jobs: ["RNG", "COR", "THF"], mainOnly: true, hits: 2, mods: { agi: 0.73 }, ftp: [2, 3, 4], replicating: true, chains: ["Fusion", "Reverberation"], aftermath: "Light", effect: "Twofold attack. AGI is 73% / 76% / 79% / 82% / 85%. Damage varies with TP. Ranger, Corsair, or Thief main only.", kind: "physical" },
{ name: "Coronach", skill: null, jobs: ["RNG", "COR"], hits: 1, mods: { dex: 0.4, agi: 0.4 }, ftp: [3], chains: ["Darkness", "Fragmentation"], effect: "Relic. Ferdinand, Annihilator, or Exequy Gun. Ranger, or Corsair with Exequy Gun. The page lists no skill number.", kind: "physical" },
{ name: "Wildfire", skill: null, jobs: ["RNG", "COR"], mainOnly: true, quest: "Kupofried's Weapon Skill Moogle Magic", hits: 1, mods: { agi: 0.6 }, ftp: [5.5], element: "Fire", chains: ["Darkness", "Gravitation"], effect: "Fire elemental damage. Enmity -10% / -40% / -75%. Empyrean, Armageddon. Ranger or Corsair main only.", kind: "magical" },
{ name: "Trueflight", skill: null, level: 75, jobs: ["RNG"], mainOnly: true, quest: "Unlocking a Myth (Ranger)", hits: 1, mods: { agi: 1 }, ftp: [3.890625, 6.4921875, 9.671875], element: "Light", chains: ["Fragmentation", "Scission"], effect: "Light elemental damage. Damage varies with TP. Mythic, Gastraphetes. Ranger main only.", kind: "magical" },
{ name: "Leaden Salute", skill: null, jobs: ["COR"], mainOnly: true, hits: 1, mods: { agi: 1 }, ftp: [4, 6.7, 10], element: "Dark", chains: ["Gravitation", "Transfixion"], effect: "Dark elemental damage. Damage varies with TP. Mythic. Corsair main only.", kind: "magical" },
{ name: "Terminus", skill: null, level: 99, jobs: ["RNG", "COR"], hits: 1, mods: { dex: 0.7, agi: 0.7 }, ftp: [2.5, 5, 7.5], chains: ["Induration", "Reverberation", "Fusion"], effect: "Damage varies with TP. Prime, Earp. Ranger or Corsair only.", kind: "physical" }];


export function marksmanshipByName(name) {
  return MARKSMANSHIP_SKILLS.find((ws) => ws.name === name);
}

export function warCanUseMarksmanship(ws, ctx) {
  if (ctx.job !== "WAR") return `${ws.name} is not checked for this job.`;
  const onWeapon = ws.weapons?.includes(ctx.weaponName) === true;
  if (!ws.jobs.includes("WAR") && !onWeapon) {
    return ws.weapons ? `${ws.name} needs ${ws.weapons.join(" or ")}.` : `${ws.name} is not a Warrior weapon skill.`;
  }
  if (ws.requires && !ws.requires.includes(ctx.job) && !(ctx.sub && ws.requires.includes(ctx.sub))) {
    return `${ws.name} requires Ranger or Corsair as main or sub.`;
  }
  if (ws.mainOnly && !ctx.main) return `${ws.name} requires Warrior as the main job.`;
  if (ws.level != null && ctx.level < ws.level) return `${ws.name} requires level ${ws.level}.`;
  if (ws.skill != null && ctx.skill < ws.skill && !(ws.bypassSkill && onWeapon)) return `${ws.name} needs Marksmanship skill ${ws.skill}.`;
  if (ws.skill == null && ws.weapons && !onWeapon) return `${ws.name} needs ${ws.weapons.join(" or ")}.`;
  return null;
}

/** Marksmanship skills this Warrior can put on the bar. */
export function warMarksmanshipList(ctx) {
  return MARKSMANSHIP_SKILLS.filter((ws) => warCanUseMarksmanship(ws, ctx) === null);
}

export function modText(ws) {
  const parts = Object.keys(ws.mods).filter((key) => ws.mods[key]).map((key) => `${key.toUpperCase()} ${Math.round((ws.mods[key] ?? 0) * 100)}%`);
  if (ws.hpRatio) parts.push("current HP");
  return parts.join(" ") || "no stat modifier";
}

/** Skillchain properties in check order. The Aftermath property is marked. */
export function chainText(ws) {
  const base = ws.chains.length ? ws.chains.join(" / ") : "no skillchain";
  return ws.aftermath ? `${base} / ${ws.aftermath} (Aeonic Aftermath)` : base;
}

export function wsc(ws, stats) {
  let total = 0;
  for (const key of Object.keys(ws.mods)) {
    const rate = ws.mods[key];
    if (rate) total += Math.floor(stats[key] * rate);
  }
  return total;
}

export function ftpAt(ftp, tp) {
  if (ftp.length === 1) return ftp[0];
  const [a, b, c] = [ftp[0], ftp[1] ?? ftp[0], ftp[2] ?? ftp[1] ?? ftp[0]];
  if (tp >= 3000) return c;
  if (tp >= 2000) return b + (c - b) * (tp - 2000) / 1000;
  const t = Math.max(1000, tp);
  return a + (b - a) * (t - 1000) / 1000;
}

/**
 * Magical weapon skill base, BG-Wiki, while the weapon's level is under 100.
 * floor(((5 + floor((level − 1) × 1.5) + WSC) × fTP) + dSTAT + magic damage).
 * This yard does not invent a dSTAT curve and has no magic-damage stat, so both are 0.
 * Day, weather, staff, affinity, and resist stay 1.
 */
export function magicalWsDamage(level, skill, ftp, dstat = 0) {
  const ranked = 5 + Math.floor((level - 1) * 1.5) + Math.max(0, skill);
  return Math.max(0, Math.floor(ranked * ftp + dstat));
}

/** Cyclone's printed line. (player INT − monster INT) / 2 + 8, capped at 32. */
export function cycloneDstat(playerInt, monsterInt) {
  return Math.max(0, Math.min(32, Math.floor((playerInt - monsterInt) / 2) + 8));
}

/** Melee TP for one hit, from the delay table on BG-Wiki Tactical Points. Floored. */
export function tpFromDelay(delay) {
  const gained =
  delay <= 180 ? 61 + (delay - 180) * 63 / 360 :
  delay <= 540 ? 61 + (delay - 180) * 88 / 360 :
  delay <= 630 ? 149 + (delay - 540) * 20 / 360 :
  delay <= 720 ? 154 + (delay - 630) * 28 / 360 :
  delay <= 900 ? 161 + (delay - 720) * 24 / 360 :
  173 + (delay - 900) * 28 / 360;
  return Math.floor(gained);
}

/**
 * Physical weapon skill TP return. The first landed hit grants a normal
 * swing of TP. Every later landed hit, including a listed hit or a Double
 * Attack hit, grants 10. A miss grants nothing.
 */
export function wsTpReturn(delay, hitsLanded) {
  if (hitsLanded <= 0) return 0;
  return tpFromDelay(delay) + 10 * (hitsLanded - 1);
}
export function effectiveTp(tp, bonus) {
  return Math.min(3000, tp + Math.max(0, bonus));
}

export function tpNote(ws, tp) {
  const parts = [`used TP ${Math.floor(tp)}`];
  if (ws.ftp && ws.ftp.length > 1) parts.push(`fTP ${Number(ftpAt(ws.ftp, tp).toFixed(4))}`);
  if (ws.attackBonus) parts.push(`attack +${Math.round(ftpAt(ws.attackBonus, tp) * 100)}%`);
  if (ws.radius) parts.push(`radius ${Number(ftpAt(ws.radius, tp).toFixed(2))}y`);
  if (ws.drain) parts.push(`drain ${Math.round(ftpAt(ws.drain, tp) * 100)}%`);
  if (ws.hpRatio) parts.push(`HP ${Math.round(ftpAt(ws.hpRatio, tp) * 1000) / 10}%`);
  return parts.join(". ");
}

export function spiritsDamage(ws, hp, tp) {
  const ratio = ws.hpRatio;
  if (!ratio) return 0;
  return Math.floor(hp * ftpAt(ratio, tp));
}

/** BG-Wiki Double Attack: at most two procs on one weapon skill, and eight hits in the round. */
export const WS_DOUBLE_ATTACK_CAP = 2;
export const WS_HIT_CAP = 8;

/**
 * Physical weapon-skill hits, including Warrior Double Attack.
 * Each listed hit rolls the trait rate. A proc adds one hit and does not roll
 * again. The whole skill stops at two procs or eight hits.
 * A scaled fTP stays on the first listed hit. Replicating skills, and skills
 * with one fTP, use that fTP on every hit including the extra ones.
 * Any other extra hit uses fTP 1. Each hit takes its own pDIF.
 */
export function physicalHits(
ws,
base,
tp,
doubleAttack,
random,
pdif,
firstBonus = 0)
{
  if (!ws.ftp) return { dmg: 0, hits: 0, doubles: 0 };
  const ftp = ftpAt(ws.ftp, tp);
  const shared = ws.replicating || ws.ftp.length === 1;
  let opened = false;
  const one = (rate) => {
    const bonus = opened ? 0 : firstBonus;
    opened = true;
    return Math.max(0, Math.floor((base * rate + bonus) * pdif()));
  };
  let dmg = 0;
  let hits = 0;
  let doubles = 0;
  for (let i = 0; i < ws.hits && hits < WS_HIT_CAP; i++) {
    dmg += one(shared || i === 0 ? ftp : 1);
    hits++;
    if (doubles < WS_DOUBLE_ATTACK_CAP && hits < WS_HIT_CAP && random() < doubleAttack) {
      dmg += one(shared ? ftp : 1);
      hits++;
      doubles++;
    }
  }
  return { dmg, hits, doubles };
}

export function castSword(input)
































{
  const calcTp = effectiveTp(input.tp, input.fencerTp);
  const ws = input.ws;
  const chain = chainText(ws);
  const mods = modText(ws);
  const used = tpNote(ws, calcTp);
  const finish = (text, kind, dmg, tp) => {
    const gain = wsRecovery(ws, calcTp, dmg, {
      skill: input.skill,
      stats: input.stats,
      hp: input.currentHp,
      maxHp: input.maxHp,
      mp: input.mp,
      maxMp: input.maxMp,
      targetMp: input.targetMp
    });
    return { text: `${text}${gain.note}`, kind, dmg, tp, hpGain: gain.hp, mpGain: gain.mp };
  };
  if (ws.unavoidable && ws.hpRatio) {
    const dmg = spiritsDamage(ws, input.hp, calcTp);
    return finish(`${ws.name}. ${mods}. ${chain}. ${used}. ${dmg} damage.`, "hit", dmg, 0);
  }
  if (ws.kind === "physical" && ws.ftp) {
    if (!input.sureHit && !input.trickHit && input.hitRoll >= input.hitRate) return finish(`${ws.name} misses. ${chain}. ${used}.`, "miss", 0, 0);
    const skill = wsc(ws, input.stats);
    const swung = physicalHits(ws, input.dmg + input.fstr + skill, calcTp, input.doubleAttack, Math.random, input.pdif, (input.sneakDex ?? 0) + (input.trickAgi ?? 0));
    const back = wsTpReturn(input.delay, swung.hits);
    const extra = swung.doubles > 0 ? ` Double Attack x${swung.doubles}.` : "";
    const dexBit = input.sneakDex ? ` +${input.sneakDex} DEX` : "";
    const agiBit = input.trickAgi ? ` +${input.trickAgi} AGI` : "";
    const sneak = input.sureHit || input.trickHit ?
    ` ${input.sneakVia || "Sneak Attack"}${dexBit}${agiBit}${input.sureHit ? " critical" : ""} on the first hit.` :
    "";
    return finish(`${ws.name}. ${mods}. WSC ${skill}. ${chain}. ${used}.${extra}${sneak} ${swung.dmg} damage. TP +${back}.`, "hit", swung.dmg, back);
  }
  if (ws.kind === "magical" && ws.ftp) {
    const skill = wsc(ws, input.stats);
    const dstat = ws.name === "Cyclone" || ws.name === "Blade: Ei" ? cycloneDstat(input.stats.int, input.targetInt ?? 0) : 0;
    const dealt = magicalWsDamage(input.level ?? 75, skill, ftpAt(ws.ftp, calcTp), dstat);
    const wind = dstat > 0 ? ` dSTAT ${dstat}.` : "";
    const element = ws.element ? `${ws.element.toLowerCase()} damage` : "damage";
    return finish(`${ws.name}. ${mods}. WSC ${skill}.${wind} ${ws.effect} ${chain}. ${used}. ${dealt} ${element}.`, "hit", dealt, 0);
  }
  return finish(`${ws.name}. ${mods}. WSC ${wsc(ws, input.stats)}. ${ws.effect} ${chain}. ${used}.`, "info", 0, 0);
}











export function room(current, max) {
  return Math.max(0, max - current);
}

/**
 * HP and MP the weapon skill itself returns.
 * Damage conversion uses the damage already dealt. A steal cannot exceed
 * the target's MP. Nothing here is Aftermath or Afterglow.
 */
export function wsRecovery(ws, tp, dmg, pools) {
  const none = { hp: 0, mp: 0, note: "" };
  const bonus = ws.bonus;
  if (!bonus) return none;
  if (bonus.type === "damageMp") {
    if (dmg <= 0) return none;
    const mp = Math.min(dmg, room(pools.mp, pools.maxMp));
    return mp > 0 ? { hp: 0, mp, note: ` MP +${mp}.` } : { hp: 0, mp: 0, note: " MP is full." };
  }
  if (bonus.type === "damageHp") {
    if (dmg <= 0) return none;
    const hp = Math.min(Math.floor(dmg * ftpAt(bonus.rate, tp)), room(pools.hp, pools.maxHp));
    return hp > 0 ? { hp, mp: 0, note: ` HP +${hp}.` } : { hp: 0, mp: 0, note: " HP is full." };
  }
  if (bonus.type === "skillMp") {
    const raw = Math.floor((Math.floor(pools.skill * bonus.rate) + wsc(ws, pools.stats)) * ftpAt(bonus.mult, tp));
    if (bonus.fromTarget && pools.targetMp <= 0) return { hp: 0, mp: 0, note: " No MP to steal." };
    const capped = bonus.fromTarget ? Math.min(raw, pools.targetMp) : raw;
    const mp = Math.min(Math.max(0, capped), room(pools.mp, pools.maxMp));
    return mp > 0 ? { hp: 0, mp, note: ` MP +${mp}.` } : { hp: 0, mp: 0, note: " MP is full." };
  }
  const hp = Math.min(Math.floor(pools.maxHp * ftpAt(bonus.hp, tp)), room(pools.hp, pools.maxHp));
  const mp = Math.min(Math.floor(pools.maxMp * ftpAt(bonus.mp, tp)), room(pools.mp, pools.maxMp));
  const parts = [hp > 0 ? `HP +${hp}` : "", mp > 0 ? `MP +${mp}` : ""].filter(Boolean);
  return { hp, mp, note: parts.length ? ` ${parts.join(". ")}.` : "" };
}

export function assertWeaponSkills() {
  const ctx = { job: "WAR", main: true, level: 75, skill: 250, weaponName: "Bronze Sword", quests: [] };
  const names = warSwordList(ctx).map((ws) => ws.name);
  const expected = ["Fast Blade", "Burning Blade", "Red Lotus Blade", "Flat Blade", "Shining Blade", "Seraph Blade", "Circle Blade", "Spirits Within", "Vorpal Blade", "Savage Blade"];
  if (names.join("|") !== expected.join("|")) throw new Error(`WAR sword list ${names.join(", ")}`);
  for (const banned of ["Swift Blade", "Sanguine Blade", "Requiescat", "Chant du Cygne", "Atonement", "Expiacion", "Death Blossom"]) {
    if (names.includes(banned)) throw new Error(`${banned} listed for Warrior`);
    if (!swordByName(banned)) throw new Error(`${banned} missing from the database`);
  }
  if (wsc(swordByName("Fast Blade"), { str: 70, dex: 61, vit: 0, agi: 0, int: 0, mnd: 0, chr: 0 }) !== 52) throw new Error("Fast Blade WSC");
  if (wsc(swordByName("Savage Blade"), { str: 70, dex: 0, vit: 0, agi: 0, int: 0, mnd: 48, chr: 0 }) !== 59) throw new Error("Savage Blade WSC");
  if (spiritsDamage(swordByName("Spirits Within"), 1362, 1000) !== 170) throw new Error("Spirits Within");
  if (swordByName("Savage Blade").quest !== "Old Wounds" || warCanUse(swordByName("Savage Blade"), ctx) !== null) throw new Error("Savage Blade quest stays unlocked");
  if (warCanUse(swordByName("Swift Blade"), ctx)?.includes("Hepatizon") !== true) throw new Error("Swift Blade weapon");
  const axeCtx = { job: "WAR", main: true, level: 75, skill: 276, weaponName: "Butterfly Axe", quests: [] };
  const axes = warGreatAxeList(axeCtx).map((ws) => ws.name);
  const axeExpected = ["Shield Break", "Iron Tempest", "Sturmwind", "Armor Break", "Keen Edge", "Weapon Break", "Raging Rush", "Full Break", "Steel Cyclone"];
  if (axes.join("|") !== axeExpected.join("|")) throw new Error(`WAR great axe list ${axes.join(", ")}`);
  for (const banned of ["Fell Cleave", "Upheaval", "Metatron Torment", "Ukko's Fury", "King's Justice", "Disaster"]) {
    if (axes.includes(banned)) throw new Error(`${banned} listed for Warrior`);
    if (!greatAxeByName(banned)) throw new Error(`${banned} missing from the database`);
  }
  const cyclone = greatAxeByName("Steel Cyclone");
  if (cyclone.quest !== "The Weight of Your Limits" || warCanUseGreatAxe(cyclone, axeCtx) !== null) throw new Error("Steel Cyclone quest stays unlocked");
  const skillReq = {
    "Shield Break": 5,
    "Iron Tempest": 40,
    Sturmwind: 70,
    "Armor Break": 100,
    "Keen Edge": 150,
    "Weapon Break": 175,
    "Raging Rush": 200,
    "Full Break": 225,
    "Steel Cyclone": 240,
    "Fell Cleave": 300,
    Upheaval: 357
  };
  for (const [name, skill] of Object.entries(skillReq)) {
    const ws = greatAxeByName(name);
    if (!ws || ws.skill !== skill) throw new Error(`${name} skill requirement`);
    if (warCanUseGreatAxe(ws, { ...axeCtx, skill: skill - 1 }) === null) throw new Error(`${name} unlocked below skill ${skill}`);
  }
  for (const name of ["Metatron Torment", "Ukko's Fury", "King's Justice", "Disaster"]) {
    const ws = greatAxeByName(name);
    if (!ws || ws.skill !== null) throw new Error(`${name} has no skill number on the retail page`);
    if (warCanUseGreatAxe(ws, axeCtx) === null) throw new Error(`${name} needs its weapon`);
  }
  const gsCtx = { job: "WAR", main: true, level: 75, skill: 256, weaponName: "Rusty Greatsword", quests: [] };
  const swords = warGreatSwordList(gsCtx).map((ws) => ws.name);
  const gsExpected = ["Hard Slash", "Power Slash", "Frostbite", "Freezebite", "Shockwave", "Crescent Moon", "Ground Strike"];
  if (swords.join("|") !== gsExpected.join("|")) throw new Error(`WAR great sword list ${swords.join(", ")}`);
  for (const banned of ["Sickle Moon", "Spinning Slash", "Herculean Slash", "Resolution", "Scourge", "Torcleaver", "Dimidiation", "Fimbulvetr"]) {
    if (swords.includes(banned)) throw new Error(`${banned} listed for Warrior`);
    if (!greatSwordByName(banned)) throw new Error(`${banned} missing from the database`);
  }
  const ground = greatSwordByName("Ground Strike");
  if (ground.quest !== "Inheritance" || warCanUseGreatSword(ground, gsCtx) !== null) throw new Error("Ground Strike quest stays unlocked");
  if (warCanUseGreatSword(ground, { ...gsCtx, skill: 249 }) === null) throw new Error("Ground Strike skill");
  if (wsc(greatSwordByName("Hard Slash"), { str: 70, dex: 0, vit: 0, agi: 0, int: 0, mnd: 0, chr: 0 }) !== 70) throw new Error("Hard Slash WSC");
  if (wsc(greatSwordByName("Crescent Moon"), { str: 80, dex: 0, vit: 0, agi: 0, int: 0, mnd: 0, chr: 0 }) !== 64) throw new Error("Crescent Moon WSC");
  const gsSkill = {
    "Hard Slash": 5,
    "Power Slash": 30,
    Frostbite: 70,
    Freezebite: 100,
    Shockwave: 150,
    "Crescent Moon": 175,
    "Sickle Moon": 200,
    "Spinning Slash": 225,
    "Ground Strike": 250,
    "Herculean Slash": 290,
    Resolution: 357
  };
  for (const [name, skill] of Object.entries(gsSkill)) {
    const ws = greatSwordByName(name);
    if (!ws || ws.skill !== skill) throw new Error(`${name} skill requirement`);
  }
  const handCtx = { job: "WAR", main: true, level: 75, skill: 210, weaponName: "Cesti", quests: [] };
  const hands = warHandList(handCtx).map((ws) => ws.name);
  const handExpected = ["Combo", "Shoulder Tackle", "Backhand Blow", "Spinning Attack"];
  if (hands.join("|") !== handExpected.join("|")) throw new Error(`WAR hand list ${hands.join(", ")}`);
  for (const banned of ["One Inch Punch", "Raging Fists", "Howling Fist", "Dragon Kick", "Asuran Fists", "Tornado Kick", "Shijin Spiral", "Final Heaven", "Victory Smite", "Ascetic's Fury", "Stringing Pummel", "Maru Kala", "Dragon Blow"]) {
    if (hands.includes(banned)) throw new Error(`${banned} listed for Warrior`);
    if (!handByName(banned)) throw new Error(`${banned} missing from the database`);
  }
  if (warCanUseHand(handByName("One Inch Punch"), handCtx)?.includes("Monk") !== true) throw new Error("One Inch Punch job");
  if (warCanUseHand(handByName("Combo"), { ...handCtx, skill: 4 }) === null) throw new Error("Combo skill");
  if (handByName("Asuran Fists").quest !== "The Walls of Your Mind") throw new Error("Asuran Fists quest tag");
  if (handByName("Dragon Kick").level !== 65 || handByName("Asuran Fists").level !== 71) throw new Error("monk weapon skill levels");
  const mnkHands = HAND_SKILLS.filter((ws) => mnkCanUse(ws, { job: "MNK", main: true, level: 75, skill: 276, weaponName: "Cesti", quests: [] }) === null).map((ws) => ws.name);
  if (mnkHands.join("|") !== ["Combo", "Shoulder Tackle", "One Inch Punch", "Backhand Blow", "Raging Fists", "Spinning Attack", "Howling Fist", "Dragon Kick", "Asuran Fists"].join("|")) {
    throw new Error(`MNK hand list ${mnkHands.join(", ")}`);
  }
  if (mnkCanUse(handByName("Combo"), { job: "MNK", main: true, level: 75, skill: 276, weaponName: "Cesti", quests: [] }) !== null) throw new Error("MNK Combo");
  const pupHands = HAND_SKILLS.filter((ws) => pupCanUse(ws, { job: "PUP", main: true, level: 75, skill: 276, weaponName: "Cat Baghnakhs", quests: [] }) === null).map((ws) => ws.name);
  if (pupHands.join("|") !== ["Combo", "Shoulder Tackle", "One Inch Punch", "Backhand Blow", "Raging Fists", "Spinning Attack", "Howling Fist", "Dragon Kick", "Asuran Fists"].join("|")) {
    throw new Error(`PUP hand list ${pupHands.join(", ")}`);
  }
  const pupSubHands = HAND_SKILLS.filter((ws) => pupCanUse(ws, { job: "PUP", main: false, level: 37, skill: 114, weaponName: "Cat Baghnakhs", quests: [] }) === null).map((ws) => ws.name);
  if (pupSubHands.join("|") !== ["Combo", "Shoulder Tackle", "One Inch Punch", "Backhand Blow"].join("|")) {
    throw new Error(`PUP 37 hand list ${pupSubHands.join(", ")}`);
  }
  if (pupCanUse(handByName("Stringing Pummel"), { job: "PUP", main: true, level: 75, skill: 276, weaponName: "Cat Baghnakhs", quests: [] }) === null) {
    throw new Error("Stringing Pummel needs Kenkonken");
  }
  if (wsc(handByName("Combo"), { str: 70, dex: 61, vit: 0, agi: 0, int: 0, mnd: 0, chr: 0 }) !== 39) throw new Error("Combo WSC");
  const daggerCtx = { job: "WAR", main: true, level: 75, skill: 240, weaponName: "Bronze Dagger", quests: [] };
  const daggers = warDaggerList(daggerCtx).map((ws) => ws.name);
  const daggerExpected = ["Wasp Sting", "Gust Slash", "Shadowstitch", "Energy Steal", "Evisceration"];
  if (daggers.join("|") !== daggerExpected.join("|")) throw new Error(`WAR dagger list ${daggers.join(", ")}`);
  for (const banned of ["Viper Bite", "Cyclone", "Energy Drain", "Dancing Edge", "Shark Bite", "Aeolian Edge", "Exenterator", "Mercy Stroke", "Rudra's Storm", "Mandalic Stab", "Mordant Rime", "Pyrrhic Kleos", "Ruthless Stroke"]) {
    if (daggers.includes(banned)) throw new Error(`${banned} listed for Warrior`);
    if (!daggerByName(banned)) throw new Error(`${banned} missing from the database`);
  }
  const evisceration = daggerByName("Evisceration");
  if (evisceration.quest !== "Cloak and Dagger" || warCanUseDagger(evisceration, daggerCtx) !== null) throw new Error("Evisceration quest stays unlocked");
  if (warCanUseDagger(evisceration, { ...daggerCtx, skill: 229 }) === null) throw new Error("Evisceration skill");
  if (warCanUseDagger(daggerByName("Viper Bite"), daggerCtx)?.includes("Thief") !== true) throw new Error("Viper Bite job");
  if (wsc(daggerByName("Wasp Sting"), { str: 0, dex: 61, vit: 0, agi: 0, int: 0, mnd: 0, chr: 0 }) !== 61) throw new Error("Wasp Sting WSC");
  const oneCtx = { job: "WAR", main: true, level: 75, skill: 269, weaponName: "Bronze Axe", quests: [] };
  const oneHand = warAxeList(oneCtx).map((ws) => ws.name);
  const oneExpected = ["Raging Axe", "Smash Axe", "Gale Axe", "Avalanche Axe", "Spinning Axe", "Rampage", "Calamity", "Mistral Axe", "Decimation"];
  if (oneHand.join("|") !== oneExpected.join("|")) throw new Error(`WAR axe list ${oneHand.join(", ")}`);
  for (const banned of ["Bora Axe", "Ruinator", "Onslaught", "Cloudsplitter", "Primal Rend", "Blitz"]) {
    if (oneHand.includes(banned)) throw new Error(`${banned} listed for Warrior`);
    if (!axeByName(banned)) throw new Error(`${banned} missing from the database`);
  }
  const decimation = axeByName("Decimation");
  if (decimation.quest !== "Axe the Competition" || warCanUseAxe(decimation, oneCtx) !== null) throw new Error("Decimation quest stays unlocked");
  if (warCanUseAxe(decimation, { ...oneCtx, skill: 239 }) === null) throw new Error("Decimation skill");
  if (wsc(axeByName("Raging Axe"), { str: 70, dex: 0, vit: 0, agi: 0, int: 0, mnd: 0, chr: 0 }) !== 42) throw new Error("Raging Axe WSC");
  const staffCtx = { job: "WAR", main: true, level: 75, skill: 250, weaponName: "Ash Staff", quests: [] };
  const staves = warStaffList(staffCtx).map((ws) => ws.name);
  const staffExpected = ["Heavy Swing", "Rock Crusher", "Earth Crusher", "Starburst", "Sunburst", "Shell Crusher", "Full Swing", "Spirit Taker", "Retribution"];
  if (staves.join("|") !== staffExpected.join("|")) throw new Error(`WAR staff list ${staves.join(", ")}`);
  for (const banned of ["Cataclysm", "Shattersoul", "Gate of Tartarus", "Garland of Bliss", "Omniscience", "Vidohunir", "Myrkr", "Oshala", "Tartarus Torpor"]) {
    if (staves.includes(banned)) throw new Error(`${banned} listed for Warrior`);
    if (!staffByName(banned)) throw new Error(`${banned} missing from the database`);
  }
  const retribution = staffByName("Retribution");
  if (retribution.quest !== "Blood and Glory" || warCanUseStaff(retribution, staffCtx) !== null) throw new Error("Retribution quest stays unlocked");
  if (warCanUseStaff(retribution, { ...staffCtx, skill: 229 }) === null) throw new Error("Retribution skill");
  if (wsc(staffByName("Heavy Swing"), { str: 70, dex: 0, vit: 0, agi: 0, int: 0, mnd: 0, chr: 0 }) !== 70) throw new Error("Heavy Swing WSC");
  const clubCtx = { job: "WAR", main: true, level: 75, skill: 240, weaponName: "Ash Club", quests: [] };
  const clubs = warClubList(clubCtx).map((ws) => ws.name);
  const clubExpected = ["Shining Strike", "Seraph Strike", "Brainshaker", "Starlight", "Moonlight", "Skullbreaker", "True Strike", "Judgment", "Black Halo"];
  if (clubs.join("|") !== clubExpected.join("|")) throw new Error(`WAR club list ${clubs.join(", ")}`);
  for (const banned of ["Hexa Strike", "Flash Nova", "Realmrazer", "Randgrith", "Dagan", "Mystic Boon", "Exudation", "Dagda"]) {
    if (clubs.includes(banned)) throw new Error(`${banned} listed for Warrior`);
    if (!clubByName(banned)) throw new Error(`${banned} missing from the database`);
  }
  const halo = clubByName("Black Halo");
  if (halo.quest !== "Orastery Woes" || warCanUseClub(halo, clubCtx) !== null) throw new Error("Black Halo quest stays unlocked");
  if (warCanUseClub(halo, { ...clubCtx, skill: 229 }) === null) throw new Error("Black Halo skill");
  if (clubByName("Starlight").self !== true || clubByName("Moonlight").self !== true) throw new Error("cure weapon skills");
  if (wsc(clubByName("Shining Strike"), { str: 70, dex: 0, vit: 0, agi: 0, int: 0, mnd: 50, chr: 0 }) !== 48) throw new Error("Shining Strike WSC");
  if (magicalWsDamage(75, 48, 1.625) !== 266) throw new Error("Shining Strike damage");
  if (magicalWsDamage(75, 48, 6.125) !== 1004) throw new Error("Seraph Strike damage");
  const hexa = clubByName("Hexa Strike");
  const hexaCtx = { job: "WHM", main: true, level: 75, skill: 256, weaponName: "Ash Club", quests: [] };
  if (hexa.level !== 67 || hexa.mainOnly !== true || hexa.skill !== 220 || hexa.hits !== 6 || hexa.weapons != null || hexa.jobs.join(",") !== "WHM,GEO" || hexa.critBonus != null) {
    throw new Error("Hexa Strike gates");
  }
  if (whmCanUse(hexa, hexaCtx) !== null) throw new Error("WHM 75 Ash Club can use Hexa Strike");
  if (whmCanUse(hexa, { ...hexaCtx, main: false }) === null) throw new Error("Hexa Strike is main only");
  if (whmCanUse(hexa, { ...hexaCtx, level: 66 }) === null) throw new Error("Hexa Strike level");
  if (whmCanUse(hexa, { ...hexaCtx, skill: 219 }) === null) throw new Error("Hexa Strike skill");
  if (warCanUseClub(hexa, clubCtx) === null) throw new Error("Hexa Strike is not a level 75 Warrior skill");
  if (wsc(hexa, { str: 70, dex: 0, vit: 0, agi: 0, int: 0, mnd: 50, chr: 0 }) !== 36) throw new Error("Hexa Strike WSC");
  for (const banned of ["Randgrith", "Dagan", "Mystic Boon", "Flash Nova", "Realmrazer", "Exudation", "Dagda"]) {
    if (whmCanUse(clubByName(banned), hexaCtx) === null) throw new Error(`${banned} is not a level 75 Ash Club skill`);
  }
  const scytheCtx = { job: "WAR", main: true, level: 75, skill: 269, weaponName: "Bronze Zaghnal", quests: [] };
  const scythes = warScytheList(scytheCtx).map((ws) => ws.name);
  const scytheExpected = ["Slice", "Dark Harvest", "Shadow of Death", "Nightmare Scythe", "Spinning Scythe", "Vorpal Scythe", "Spiral Hell"];
  if (scythes.join("|") !== scytheExpected.join("|")) throw new Error(`WAR scythe list ${scythes.join(", ")}`);
  for (const banned of ["Guillotine", "Cross Reaper", "Infernal Scythe", "Entropy", "Catastrophe", "Quietus", "Insurgency", "Origin"]) {
    if (scythes.includes(banned)) throw new Error(`${banned} listed for Warrior`);
    if (!scytheByName(banned)) throw new Error(`${banned} missing from the database`);
  }
  const spiral = scytheByName("Spiral Hell");
  if (spiral.quest !== "Souls in Shadow" || warCanUseScythe(spiral, scytheCtx) !== null) throw new Error("Spiral Hell quest stays unlocked");
  if (warCanUseScythe(spiral, { ...scytheCtx, skill: 239 }) === null) throw new Error("Spiral Hell skill");
  if (wsc(scytheByName("Slice"), { str: 70, dex: 0, vit: 0, agi: 0, int: 0, mnd: 0, chr: 0 }) !== 70) throw new Error("Slice WSC");
  const poleCtx = { job: "WAR", main: true, level: 75, skill: 250, weaponName: "Harpoon", quests: [] };
  const poles = warPolearmList(poleCtx).map((ws) => ws.name);
  const poleExpected = ["Double Thrust", "Thunder Thrust", "Raiden Thrust", "Leg Sweep", "Penta Thrust", "Vorpal Thrust", "Impulse Drive"];
  if (poles.join("|") !== poleExpected.join("|")) throw new Error(`WAR polearm list ${poles.join(", ")}`);
  for (const banned of ["Skewer", "Wheeling Thrust", "Sonic Thrust", "Stardiver", "Geirskogul", "Camlann's Torment", "Drakesbane", "Diarmuid"]) {
    if (poles.includes(banned)) throw new Error(`${banned} listed for Warrior`);
    if (!polearmByName(banned)) throw new Error(`${banned} missing from the database`);
  }
  const impulse = polearmByName("Impulse Drive");
  if (impulse.quest !== "Methods Create Madness" || warCanUsePolearm(impulse, poleCtx) !== null) throw new Error("Impulse Drive quest stays unlocked");
  if (warCanUsePolearm(impulse, { ...poleCtx, skill: 239 }) === null) throw new Error("Impulse Drive skill");
  if (wsc(polearmByName("Double Thrust"), { str: 70, dex: 61, vit: 0, agi: 0, int: 0, mnd: 0, chr: 0 }) !== 39) throw new Error("Double Thrust WSC");
  const katanaCtx = { job: "WAR", main: true, level: 75, skill: 0, weaponName: "Trainee Burin", quests: [] };
  const katanas = warKatanaList(katanaCtx).map((ws) => ws.name);
  if (katanas.length !== 0) throw new Error(`WAR katana list ${katanas.join(", ")}`);
  for (const name of ["Blade: Rin", "Blade: Retsu", "Blade: Teki", "Blade: To", "Blade: Chi", "Blade: Ei", "Blade: Jin", "Blade: Ten", "Blade: Ku", "Blade: Yu", "Blade: Shun", "Blade: Metsu", "Blade: Kamu", "Blade: Hi", "Zesho Meppo"]) {
    if (!katanaByName(name)) throw new Error(`${name} missing from the database`);
  }
  const ku = katanaByName("Blade: Ku");
  if (ku.quest !== "Bugi Soden" || warCanUseKatana(ku, katanaCtx) === null) throw new Error("Blade: Ku stays off Warrior");
  if (wsc(katanaByName("Blade: Rin"), { str: 70, dex: 61, vit: 0, agi: 0, int: 0, mnd: 0, chr: 0 }) !== 78) throw new Error("Blade: Rin WSC");
  const ten = katanaByName("Blade: Ten");
  if (ten.mainOnly !== true || ten.ftp.join(",") !== "4.5,11.5,15.5" || ten.mods.str !== 0.3 || ten.mods.dex !== 0.3) throw new Error("Blade: Ten");
  const ei = katanaByName("Blade: Ei");
  if (ei.mainOnly === true || ei.kind !== "magical" || ei.element !== "Dark" || ei.ftp.join(",") !== "1,3,5") throw new Error("Blade: Ei");
  if (katanaByName("Blade: Chi").element !== "Earth" || katanaByName("Blade: Chi").hits !== 2) throw new Error("Blade: Chi earth");
  const shun = katanaByName("Blade: Shun");
  if (!shun.attackBonus || ftpAt(shun.attackBonus, 1000) !== 0 || ftpAt(shun.attackBonus, 2000) !== 1 || ftpAt(shun.attackBonus, 3000) !== 2) throw new Error("Blade: Shun attack");
  if (ftpAt(katanaByName("Blade: Kamu").attackBonus, 1000) !== 2 || katanaByName("Blade: Kamu").hits !== 1) throw new Error("Blade: Kamu attack");
  const hi = katanaByName("Blade: Hi");
  if (hi.ftp[0] !== 5 || hi.mods.agi !== 0.8 || hi.critBonus.join(",") !== "0.15,0.2,0.25") throw new Error("Blade: Hi");
  const zesho = katanaByName("Zesho Meppo");
  if (!zesho.ftp || zesho.hits !== 4 || ftpAt(zesho.ftp, 1000) !== 4 || ftpAt(zesho.ftp, 2000) !== 4 || Math.abs(ftpAt(zesho.ftp, 3000) - 18.715) > 1e-9) throw new Error("Zesho Meppo");
  if (katanaByName("Blade: Jin").replicating !== true || katanaByName("Blade: Jin").critBonus != null || katanaByName("Blade: Jin").mainOnly !== true) throw new Error("Blade: Jin");
  if (katanaByName("Blade: Yu").mainOnly !== true || katanaByName("Blade: Yu").ftp[0] !== 3) throw new Error("Blade: Yu");
  if (katanaByName("Blade: Ku").bypassSkill !== true || katanaByName("Blade: Ku").ftp[0] !== 1.25) throw new Error("Blade: Ku weapon grant");
  if (katanaByName("Blade: Retsu").mods.str !== 0.2 || katanaByName("Blade: Retsu").mods.dex !== 0.6 || katanaByName("Blade: Retsu").hits !== 2) throw new Error("Blade: Retsu");
  const eiHit = castSword({
    ws: ei,
    tp: 1000,
    fencerTp: 0,
    stats: { str: 0, dex: 0, vit: 0, agi: 0, int: 0, mnd: 0, chr: 0 },
    hp: 1000,
    currentHp: 1000,
    dmg: 0,
    fstr: 0,
    pdif: () => 1,
    hitRoll: 0,
    hitRate: 1,
    doubleAttack: 0,
    delay: 227,
    skill: 0,
    mp: 0,
    maxMp: 0,
    maxHp: 1000,
    targetMp: 0,
    level: 75,
    targetInt: 0
  });
  if (eiHit.dmg !== 124 || !eiHit.text.includes("dSTAT 8")) throw new Error(`Blade: Ei damage ${eiHit.dmg} ${eiHit.text}`);
  const gkCtx = { job: "WAR", main: true, level: 75, skill: 0, weaponName: "Hardwood Katana", quests: [] };
  const greatKatanas = warGreatKatanaList(gkCtx).map((ws) => ws.name);
  if (greatKatanas.length !== 0) throw new Error(`WAR great katana list ${greatKatanas.join(", ")}`);
  for (const name of ["Tachi: Enpi", "Tachi: Hobaku", "Tachi: Goten", "Tachi: Kagero", "Tachi: Jinpu", "Tachi: Koki", "Tachi: Yukikaze", "Tachi: Gekko", "Tachi: Kasha", "Tachi: Ageha", "Tachi: Shoha", "Tachi: Kaiten", "Tachi: Fudo", "Tachi: Rana", "Tachi: Mumei"]) {
    if (!greatKatanaByName(name)) throw new Error(`${name} missing from the database`);
  }
  const kasha = greatKatanaByName("Tachi: Kasha");
  if (kasha.quest !== "The Potential Within" || warCanUseGreatKatana(kasha, gkCtx) === null) throw new Error("Tachi: Kasha stays off Warrior");
  if (wsc(greatKatanaByName("Tachi: Enpi"), { str: 70, dex: 0, vit: 0, agi: 0, int: 0, mnd: 0, chr: 0 }) !== 42) throw new Error("Tachi: Enpi WSC");
  const samGk = { job: "SAM", main: true, level: 75, skill: 276, weaponName: "Mumeito", quests: [] };
  const samBlades = samGreatKatanaList(samGk).map((ws) => ws.name);
  const samExpected = ["Tachi: Enpi", "Tachi: Hobaku", "Tachi: Goten", "Tachi: Kagero", "Tachi: Jinpu", "Tachi: Koki", "Tachi: Yukikaze", "Tachi: Gekko", "Tachi: Kasha"];
  if (samBlades.join("|") !== samExpected.join("|")) throw new Error(`SAM great katana list ${samBlades.join(", ")}`);
  if (samCanUse(greatKatanaByName("Tachi: Ageha"), samGk) === null) throw new Error("Ageha is past 276");
  if (samCanUse(greatKatanaByName("Tachi: Kaiten"), samGk) === null) throw new Error("Kaiten needs its weapon");
  if (samCanUse(kasha, { ...samGk, main: false }) === null) throw new Error("Kasha is main only");
  const bowCtx = { job: "WAR", main: true, level: 75, skill: 210, weaponName: "Shortbow", quests: [] };
  const shots = warArcheryList(bowCtx).map((ws) => ws.name);
  if (shots.length !== 0) throw new Error(`WAR archery list ${shots.join(", ")}`);
  const shotExpected = ["Flaming Arrow", "Piercing Arrow", "Dulling Arrow", "Sidewinder"];
  if (warArcheryList({ ...bowCtx, sub: "RNG" }).map((ws) => ws.name).join("|") !== shotExpected.join("|")) throw new Error("Ranger sub opens the shared shots at 210");
  if (warCanUseArchery(archeryByName("Flaming Arrow"), bowCtx) !== "Flaming Arrow requires Ranger as main or sub.") throw new Error("Flaming Arrow job gate");
  if (warCanUseArchery(archeryByName("Sidewinder"), { ...bowCtx, sub: "RNG", skill: 174 }) === null) throw new Error("Sidewinder skill");
  for (const banned of ["Blast Arrow", "Arching Arrow", "Empyreal Arrow", "Refulgent Arrow", "Apex Arrow", "Namas Arrow", "Jishnu's Radiance", "Sarv"]) {
    if (shots.includes(banned)) throw new Error(`${banned} listed for Warrior`);
    if (!archeryByName(banned)) throw new Error(`${banned} missing from the database`);
  }
  const empyreal = archeryByName("Empyreal Arrow");
  if (empyreal.quest !== "From Saplings Grow" || warCanUseArchery(empyreal, { ...bowCtx, sub: "RNG" }) === null) throw new Error("Empyreal Arrow quest stays unlocked but gated");
  if (empyreal.level !== 72 || empyreal.skill !== 250 || empyreal.ftp.join(",") !== "1.5,2.5,5" || ftpAt(empyreal.attackBonus, 1000) !== 1 || ftpAt(empyreal.ftp, 3000) !== 5) throw new Error("Empyreal Arrow");
  if (warCanUseArchery(empyreal, { ...bowCtx, sub: "RNG", weaponName: "Kaja Bow", skill: 276 }) === null) throw new Error("Kaja Bow stays level 99");
  if (wsc(archeryByName("Flaming Arrow"), { str: 70, dex: 0, vit: 0, agi: 40, int: 0, mnd: 0, chr: 0 }) !== 34) throw new Error("Flaming Arrow WSC");
  if (ftpAt(archeryByName("Piercing Arrow").defenseIgnored, 1000) !== 0 || ftpAt(archeryByName("Piercing Arrow").defenseIgnored, 2000) !== 0.35 || ftpAt(archeryByName("Piercing Arrow").defenseIgnored, 3000) !== 0.5) throw new Error("Piercing Arrow defense");
  const side = archeryByName("Sidewinder");
  if (!side.rangedAcc || ftpAt(side.rangedAcc, 1000) !== -50 || ftpAt(side.rangedAcc, 2000) !== 0 || ftpAt(side.rangedAcc, 3000) !== 0 || side.ftp[0] !== 5) throw new Error("Sidewinder accuracy");
  const samBow = { job: "SAM", main: true, level: 75, skill: 230, weaponName: "Shortbow", quests: [] };
  if (ARCHERY_SKILLS.filter((ws) => samCanUse(ws, samBow) === null).length !== 0) throw new Error("SAM archery needs Ranger");
  if (ARCHERY_SKILLS.filter((ws) => samCanUse(ws, { ...samBow, sub: "RNG" }) === null).map((ws) => ws.name).join("|") !== shotExpected.join("|")) throw new Error("SAM/RNG archery list");
  if (samCanUse(archeryByName("Blast Arrow"), { ...samBow, sub: "RNG" }) === null || samCanUse(archeryByName("Arching Arrow"), samBow) === null) throw new Error("Blast and Arching stay Ranger");
  if (samCanUse(archeryByName("Sidewinder"), { ...samBow, sub: "RNG", skill: 174 }) === null) throw new Error("Sidewinder skill");
  const rngBow = { job: "RNG", main: true, level: 75, skill: 276, weaponName: "Shortbow", quests: [] };
  if (ARCHERY_SKILLS.filter((ws) => rngCanUse(ws, rngBow) === null).map((ws) => ws.name).join("|") !== [...shotExpected, "Blast Arrow", "Arching Arrow", "Empyreal Arrow"].join("|")) throw new Error("RNG archery list");
  if (rngCanUse(archeryByName("Blast Arrow"), { ...rngBow, main: false }) === null) throw new Error("Blast Arrow is main only");
  const arching = archeryByName("Arching Arrow");
  if (arching.level !== 66 || arching.skill !== 225 || arching.ftp[0] !== 3.5 || !arching.mainOnly || arching.chains[0] !== "Fusion") throw new Error("Arching Arrow");
  if (rngCanUse(arching, { ...rngBow, main: false }) === null) throw new Error("Arching Arrow is main only");
  if (rngCanUse(arching, { ...rngBow, level: 65 }) === null) throw new Error("Arching Arrow level");
  if (warCanUseArchery(arching, { ...bowCtx, sub: "RNG", weaponName: "Exalted Bow", skill: 276 }) === null) throw new Error("Exalted Bow stays level 99");
  if (rngCanUse(empyreal, rngBow) !== null) throw new Error("Empyreal Arrow opens at 72");
  if (rngCanUse(empyreal, { ...rngBow, level: 71 }) === null) throw new Error("Empyreal Arrow level");
  if (rngCanUse(archeryByName("Refulgent Arrow"), rngBow) === null) throw new Error("Refulgent Arrow is past 276");
  const rngGun = { job: "RNG", main: true, level: 75, skill: 276, weaponName: "Light Crossbow", quests: [] };
  const rngBullets = MARKSMANSHIP_SKILLS.filter((ws) => rngCanUse(ws, rngGun) === null).map((ws) => ws.name);
  if (rngBullets.join("|") !== ["Hot Shot", "Split Shot", "Sniper Shot", "Slug Shot", "Blast Shot", "Detonator"].join("|")) throw new Error(`RNG marksmanship ${rngBullets.join(", ")}`);
  const gunCtx = { job: "WAR", main: true, level: 75, skill: 210, weaponName: "Light Crossbow", quests: [] };
  if (warMarksmanshipList(gunCtx).length !== 0) throw new Error("marksmanship needs Ranger or Corsair");
  const bullets = warMarksmanshipList({ ...gunCtx, sub: "COR" }).map((ws) => ws.name);
  const bulletExpected = ["Hot Shot", "Split Shot", "Sniper Shot", "Slug Shot"];
  if (bullets.join("|") !== bulletExpected.join("|")) throw new Error(`WAR marksmanship list ${bullets.join(", ")}`);
  for (const banned of ["Blast Shot", "Heavy Shot", "Detonator", "Numbing Shot", "Last Stand", "Coronach", "Wildfire", "Trueflight", "Leaden Salute", "Terminus"]) {
    if (bullets.includes(banned)) throw new Error(`${banned} listed for Warrior`);
    if (!marksmanshipByName(banned)) throw new Error(`${banned} missing from the database`);
  }
  const detonator = marksmanshipByName("Detonator");
  if (detonator.quest !== "Shoot First, Ask Questions Later" || warCanUseMarksmanship(detonator, { ...gunCtx, sub: "RNG" }) === null) throw new Error("Detonator stays off Warrior");
  const slugShot = marksmanshipByName("Slug Shot");
  if (!slugShot.rangedAcc || ftpAt(slugShot.rangedAcc, 1000) !== -50 || ftpAt(slugShot.rangedAcc, 2000) !== 0 || ftpAt(slugShot.rangedAcc, 3000) !== 0 || slugShot.ftp[0] !== 5) throw new Error("Slug Shot accuracy");
  if (!detonator.attackBonus || ftpAt(detonator.attackBonus, 1000) !== 1 || detonator.ftp.join(",") !== "1.5,2.5,5") throw new Error("Detonator attack");
  const corGun = { job: "COR", main: true, level: 75, skill: 250, weaponName: "Musketoon", quests: [] };
  if (corCanUse(marksmanshipByName("Leaden Salute"), corGun) === null) throw new Error("Leaden Salute needs Death Penalty");
  if (corCanUse(marksmanshipByName("Wildfire"), corGun) === null || corCanUse(marksmanshipByName("Trueflight"), corGun) === null || corCanUse(marksmanshipByName("Coronach"), corGun) === null || corCanUse(marksmanshipByName("Terminus"), corGun) === null) {
    throw new Error("relic gun skill on a musketoon");
  }
  if (wsc(marksmanshipByName("Hot Shot"), { str: 0, dex: 0, vit: 0, agi: 40, int: 0, mnd: 0, chr: 0 }) !== 28) throw new Error("Hot Shot WSC");
  for (const name of ["Shield Break", "Iron Tempest", "Sturmwind", "Armor Break", "Keen Edge", "Weapon Break", "Raging Rush", "Full Break", "Steel Cyclone", "Fell Cleave", "Upheaval"]) {
    const ws = greatAxeByName(name);
    if (!ws || ws.motion !== name) throw new Error(`${name} motion`);
  }
  const aeonic = [
  ["Requiescat", "Gravitation / Scission", "Darkness"],
  ["Upheaval", "Fusion / Compression", "Light"],
  ["Resolution", "Fragmentation / Scission", "Light"],
  ["Shijin Spiral", "Fusion / Reverberation", "Light"],
  ["Exenterator", "Fragmentation / Scission", "Light"],
  ["Ruinator", "Distortion / Detonation", "Darkness"],
  ["Shattersoul", "Gravitation / Induration", "Darkness"],
  ["Realmrazer", "Fusion / Impaction", "Light"],
  ["Entropy", "Gravitation / Reverberation", "Darkness"],
  ["Stardiver", "Gravitation / Transfixion", "Darkness"],
  ["Blade: Shun", "Fusion / Impaction", "Light"],
  ["Tachi: Shoha", "Fragmentation / Compression", "Light"],
  ["Apex Arrow", "Fragmentation / Transfixion", "Light"],
  ["Last Stand", "Fusion / Reverberation", "Light"]];

  const all = [...SWORD_SKILLS, ...GREAT_AXE_SKILLS, ...GREAT_SWORD_SKILLS, ...HAND_SKILLS, ...DAGGER_SKILLS, ...AXE_SKILLS, ...STAFF_SKILLS, ...CLUB_SKILLS, ...SCYTHE_SKILLS, ...POLEARM_SKILLS, ...KATANA_SKILLS, ...GREAT_KATANA_SKILLS, ...ARCHERY_SKILLS, ...MARKSMANSHIP_SKILLS];
  for (const skill of all) {
    if (!skill.chains) throw new Error(`${skill.name} has no skillchain properties`);
    for (const prop of skill.chains) {
      if (!CHAIN_PROPERTIES.includes(prop)) throw new Error(`${skill.name} has an unknown skillchain property ${prop}`);
    }
    if (skill.aftermath && skill.aftermath !== "Light" && skill.aftermath !== "Darkness") {
      throw new Error(`${skill.name} aftermath property`);
    }
  }
  for (const [name, props, extra] of aeonic) {
    const skill = all.find((row) => row.name === name);
    if (!skill || skill.chains.join(" / ") !== props || skill.aftermath !== extra) throw new Error(`${name} skillchain`);
  }
  if (all.filter((skill) => skill.skill === 357).length !== aeonic.length) throw new Error("a level 357 weapon skill is missing its Aftermath property");
  if (warCanUseGreatAxe(greatAxeByName("Raging Rush"), { ...axeCtx, main: false }) === null) throw new Error("Raging Rush is main only");
  if (wsc(greatAxeByName("Shield Break"), { str: 70, dex: 0, vit: 60, agi: 0, int: 0, mnd: 0, chr: 0 }) !== 78) throw new Error("Shield Break WSC");
  if (Math.abs(ftpAt(greatAxeByName("Steel Cyclone").ftp, 2000) - 2.5) > 1e-9) throw new Error("Steel Cyclone fTP");
  const flat = () => 1;
  const fast = swordByName("Fast Blade");
  const opened = physicalHits(fast, 10, 3000, 0, () => 0, flat);
  if (opened.hits !== 2 || opened.doubles !== 0 || opened.dmg !== 60) throw new Error("Fast Blade without Double Attack");
  const doubled = physicalHits(fast, 10, 3000, 1, () => 0, flat);
  if (doubled.hits !== 4 || doubled.doubles !== 2 || doubled.dmg !== 80) throw new Error("Fast Blade Double Attack");
  const vorpal = physicalHits(swordByName("Vorpal Blade"), 10, 1000, 1, () => 0, flat);
  if (vorpal.hits !== 6 || vorpal.doubles !== 2 || vorpal.dmg !== 78) throw new Error("Vorpal Double Attack");
  const savage = physicalHits(swordByName("Savage Blade"), 10, 1000, 0.14, () => 0, flat);
  if (savage.doubles !== 2 || savage.hits !== 4) throw new Error("Savage Blade should roll each hit");
  if (effectiveTp(1000, 400) !== 1400 || effectiveTp(2800, 400) !== 3000) throw new Error("TP Bonus cap");
  if (Math.abs(ftpAt([1, 3, 5], 1400) - 1.8) > 1e-9) throw new Error("Fast Blade fTP at 1400");
  if (Math.abs(ftpAt([4, 10.25, 13.75], 1400) - 6.5) > 1e-9) throw new Error("Savage Blade fTP at 1400");
  const boosted = physicalHits(fast, 10, 1400, 0, () => 0, flat);
  if (boosted.dmg !== 28) throw new Error("Fast Blade damage at 1400 TP");
  const sneaked = physicalHits(fast, 10, 3000, 0, () => 0, flat, 70);
  if (sneaked.dmg !== 130) throw new Error("Sneak Attack DEX is outside fTP");
  if (ftpAt(swordByName("Circle Blade").radius, 1400) !== 4) throw new Error("Circle Blade radius");
  if (Math.abs(ftpAt(swordByName("Circle Blade").radius, 2500) - 4.5) > 1e-9) throw new Error("Circle Blade radius ramp");
  if (Math.abs(ftpAt(swordByName("Sanguine Blade").drain, 1400) - 0.7) > 1e-9) throw new Error("Sanguine drain");
  if (spiritsDamage(swordByName("Spirits Within"), 1362, 1400) !== 374) throw new Error("Spirits Within at 1400");
  if (tpFromDelay(231) !== 73) throw new Error("bronze sword TP");
  if (wsTpReturn(231, 2) !== 83 || wsTpReturn(231, 4) !== 103 || wsTpReturn(231, 0) !== 0) throw new Error("weapon skill TP return");
  const bare = (patch) => ({ str: 0, dex: 0, vit: 0, agi: 0, int: 0, mnd: 0, chr: 0, ...patch });
  const pools = (patch) => ({ skill: 0, stats: bare({}), hp: 0, maxHp: 2000, mp: 0, maxMp: 999, targetMp: 0, ...patch });
  const spirit = castSword({
    ws: staffByName("Spirit Taker"),
    tp: 1000,
    fencerTp: 0,
    stats: bare({ int: 70, mnd: 53 }),
    hp: 897,
    currentHp: 400,
    dmg: 10,
    fstr: 0,
    pdif: () => 1,
    hitRoll: 0,
    hitRate: 100,
    doubleAttack: 0,
    delay: 366,
    skill: 240,
    mp: 100,
    maxMp: 618,
    maxHp: 897,
    targetMp: 0
  });
  if (spirit.dmg !== 71 || spirit.mpGain !== 71 || spirit.hpGain !== 0 || !spirit.text.includes("MP +71")) throw new Error(`Spirit Taker ${spirit.dmg} ${spirit.mpGain}`);
  const spiritCap = castSword({ ...spirit, ws: staffByName("Spirit Taker"), tp: 1000, fencerTp: 0, stats: bare({ int: 70, mnd: 53 }), hp: 897, currentHp: 400, dmg: 10, fstr: 0, pdif: () => 1, hitRoll: 0, hitRate: 100, doubleAttack: 0, delay: 366, skill: 240, mp: 600, maxMp: 618, maxHp: 897, targetMp: 0 });
  if (spiritCap.dmg !== 71 || spiritCap.mpGain !== 18) throw new Error(`Spirit Taker cap ${spiritCap.mpGain}`);
  const spiritMiss = castSword({ ...spirit, ws: staffByName("Spirit Taker"), tp: 1000, fencerTp: 0, stats: bare({ int: 70, mnd: 53 }), hp: 897, currentHp: 400, dmg: 10, fstr: 0, pdif: () => 1, hitRoll: 100, hitRate: 50, doubleAttack: 0, delay: 366, skill: 240, mp: 100, maxMp: 618, maxHp: 897, targetMp: 0 });
  if (spiritMiss.kind !== "miss" || spiritMiss.dmg !== 0 || spiritMiss.mpGain !== 0 || spiritMiss.text.includes("MP")) throw new Error("Spirit Taker miss");
  const spiritFull = castSword({ ...spirit, ws: staffByName("Spirit Taker"), tp: 1000, fencerTp: 0, stats: bare({ int: 70, mnd: 53 }), hp: 897, currentHp: 897, dmg: 10, fstr: 0, pdif: () => 1, hitRoll: 0, hitRate: 100, doubleAttack: 0, delay: 366, skill: 240, mp: 618, maxMp: 618, maxHp: 897, targetMp: 0 });
  if (spiritFull.mpGain !== 0 || !spiritFull.text.includes("MP is full")) throw new Error("Spirit Taker full");
  const steal = (targetMp) => wsRecovery(daggerByName("Energy Steal"), 1000, 0, pools({ skill: 240, stats: bare({ mnd: 48 }), targetMp }));
  if (steal(0).mp !== 0 || !steal(0).note.includes("No MP")) throw new Error("Energy Steal needs MP on the target");
  if (steal(500).mp !== 74 || steal(10).mp !== 10) throw new Error(`Energy Steal ${steal(500).mp}`);
  const drained = wsRecovery(daggerByName("Energy Drain"), 1000, 0, pools({ skill: 240, stats: bare({ mnd: 48 }), targetMp: 500 }));
  if (drained.mp !== 92) throw new Error(`Energy Drain ${drained.mp}`);
  if (wsRecovery(daggerByName("Energy Drain"), 1000, 0, pools({ skill: 240, stats: bare({ mnd: 48 }), targetMp: 0 })).note.includes("No MP") !== true) throw new Error("Energy Drain empty");
  if (wsRecovery(clubByName("Starlight"), 1000, 0, pools({ skill: 240 })).mp !== 52) throw new Error("Starlight");
  if (wsRecovery(clubByName("Moonlight"), 3000, 0, pools({ skill: 240 })).mp !== 123) throw new Error("Moonlight");
  const cureWs = {
    tp: 1000,
    fencerTp: 0,
    stats: bare({}),
    hp: 971,
    currentHp: 971,
    dmg: 1,
    fstr: 0,
    pdif: () => 1,
    hitRoll: 0,
    hitRate: 100,
    doubleAttack: 0,
    delay: 264,
    skill: 256,
    mp: 400,
    maxMp: 540,
    maxHp: 971,
    targetMp: 0
  };
  const star = castSword({ ...cureWs, ws: clubByName("Starlight") });
  if (star.dmg !== 0 || star.mpGain !== 56 || !star.text.includes("MP +56")) throw new Error(`Starlight restore ${star.mpGain}`);
  const moon = castSword({ ...cureWs, ws: clubByName("Moonlight"), tp: 3000 });
  if (moon.mpGain !== 133 || !moon.text.includes("MP +133")) throw new Error(`Moonlight restore ${moon.mpGain}`);
  if (wsRecovery(staffByName("Myrkr"), 1000, 0, pools({ maxMp: 618 })).mp !== 123) throw new Error("Myrkr");
  const dagan = wsRecovery(clubByName("Dagan"), 1000, 0, pools({ maxHp: 1000, maxMp: 200 }));
  if (dagan.hp !== 220 || dagan.mp !== 30) throw new Error(`Dagan ${dagan.hp} ${dagan.mp}`);
  if (wsRecovery(swordByName("Sanguine Blade"), 1000, 100, pools({ hp: 0, maxHp: 2000 })).hp !== 50) throw new Error("Sanguine 1000");
  if (wsRecovery(swordByName("Sanguine Blade"), 3000, 100, pools({ hp: 0, maxHp: 2000 })).hp !== 160) throw new Error("Sanguine 3000");
  const sanguine = castSword({
    ws: swordByName("Sanguine Blade"),
    tp: 3000,
    fencerTp: 0,
    stats: bare({ str: 70, mnd: 48 }),
    hp: 1000,
    currentHp: 100,
    dmg: 40,
    fstr: 0,
    pdif: () => 1,
    hitRoll: 0,
    hitRate: 100,
    doubleAttack: 0,
    delay: 236,
    skill: 276,
    mp: 0,
    maxMp: 0,
    maxHp: 1000,
    targetMp: 0
  });
  if (sanguine.dmg !== 0 || sanguine.hpGain !== 0) throw new Error("Sanguine has no published physical damage");
  const boon = castSword({
    ws: clubByName("Mystic Boon"),
    tp: 1000,
    fencerTp: 0,
    stats: bare({ str: 30, mnd: 70 }),
    hp: 1000,
    currentHp: 1000,
    dmg: 10,
    fstr: 0,
    pdif: () => 1,
    hitRoll: 0,
    hitRate: 100,
    doubleAttack: 0,
    delay: 288,
    skill: 220,
    mp: 0,
    maxMp: 500,
    maxHp: 1000,
    targetMp: 0
  });
  if (boon.dmg !== 170 || boon.mpGain !== 170) throw new Error(`Mystic Boon ${boon.dmg} ${boon.mpGain}`);
  if (scytheByName("Origin").bonus) throw new Error("Origin absorb ratio is not published");
  const runCtx = { job: "RUN", main: true, level: 75, skill: 276, weaponName: "Rusty Greatsword", quests: [] };
  const runLists = {
    "Great Sword": ["Hard Slash", "Power Slash", "Frostbite", "Freezebite", "Shockwave", "Crescent Moon", "Sickle Moon", "Spinning Slash", "Ground Strike"],
    Sword: ["Fast Blade", "Burning Blade", "Red Lotus Blade", "Flat Blade", "Shining Blade", "Seraph Blade", "Circle Blade", "Spirits Within", "Vorpal Blade", "Swift Blade", "Savage Blade"],
    "Great Axe": ["Shield Break", "Iron Tempest", "Sturmwind", "Armor Break", "Keen Edge", "Weapon Break", "Steel Cyclone"],
    Axe: ["Raging Axe", "Smash Axe", "Gale Axe", "Avalanche Axe", "Spinning Axe", "Rampage", "Decimation"],
    Club: ["Shining Strike", "Brainshaker", "Starlight", "Skullbreaker", "True Strike"]
  };
  const runBooks = {
    "Great Sword": GREAT_SWORD_SKILLS,
    Sword: SWORD_SKILLS,
    "Great Axe": GREAT_AXE_SKILLS,
    Axe: AXE_SKILLS,
    Club: CLUB_SKILLS
  };
  const runSkill = { "Great Sword": 276, Sword: 269, "Great Axe": 250, Axe: 240, Club: 220 };
  for (const [weapon, expected] of Object.entries(runLists)) {
    const got = runBooks[weapon].filter((ws) => runCanUse(ws, { ...runCtx, skill: runSkill[weapon], weaponName: weapon }) === null).map((ws) => ws.name);
    if (got.join("|") !== expected.join("|")) throw new Error(`RUN ${weapon} ${got.join(", ")}`);
  }
  const spinning = greatSwordByName("Spinning Slash");
  if (spinning.level !== 69 || spinning.mainOnly !== true || runCanUse(spinning, { ...runCtx, level: 68 }) === null) throw new Error("Spinning Slash level");
  if (runCanUse(spinning, { ...runCtx, main: false }) === null) throw new Error("Spinning Slash is main only");
  for (const locked of ["Herculean Slash", "Resolution", "Scourge", "Torcleaver", "Dimidiation", "Fimbulvetr"]) {
    if (runCanUse(greatSwordByName(locked), runCtx) === null) throw new Error(`${locked} is not a level 75 Rune Fencer skill`);
  }
  if (runCanUse(swordByName("Sanguine Blade"), { ...runCtx, skill: 269 }) === null) throw new Error("Sanguine Blade is past sword 269");
  if (runCanUse(greatAxeByName("Full Break"), { ...runCtx, skill: 250 }) === null) throw new Error("Full Break needs a Hepatizon Axe");
  if (runCanUse(axeByName("Calamity"), { ...runCtx, skill: 240 }) === null) throw new Error("Calamity is not a Rune Fencer skill");
  if (runCanUse(clubByName("Judgment"), { ...runCtx, skill: 220 }) === null) throw new Error("Judgment needs a listed club job");
  const named = all.filter((skill) => skill.bonus).map((skill) => skill.name).sort().join("|");
  if (named !== "Dagan|Energy Drain|Energy Steal|Moonlight|Myrkr|Mystic Boon|Sanguine Blade|Spirit Taker|Starlight") throw new Error(`bonus set ${named}`);
} /* v9-b1ad8ea044622967 */
