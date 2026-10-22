/**
 * Retail Dark Knight toolkit through level 75. No merits and no job points.
 *
 * The job page's brackets, at a level-75 cap with no master levels:
 * Arcane Circle, Last Resort, Weapon Bash, and Souleater are inside a
 * normal subjob's reach. A support job here is level 37, so all four
 * are learned. Blood Weapon is the one-hour and is main only. Consume
 * Mana is 55, which a master-level sub could reach. This kit has no
 * master levels, so only a main Dark Knight uses it. Dark Seal and
 * Diabolic Eye are group-2 merits, so they stay locked. Nether Void
 * and everything after it are past 75.
 *
 * Traits through Stalwart Soul I are a normal subjob's. Attack Bonus
 * III, Smite III, Damage Limit+ III, and Occult Acumen II need a
 * master-level sub. From Resist Paralyze III up is main only. Muted
 * Soul is a merit trait: with no ranks unlocked it adds nothing.
 *
 * Last Resort is +25% attack and −25% defense, both 64/256. Merits
 * that would push that to 89/256 are not taken. Desperate Blows is
 * job-ability haste on a two-handed weapon while Last Resort is up:
 * 5% at 15, 10% at 30, 15% at 45. That 15% is 153/1024. It stacks
 * with Hasso. The merit that would add more haste is not taken.
 *
 * Naked Hume Dark Knight grades, with no subjob: level 75 is 1167 HP,
 * 312 MP, STR 70, DEX 61, VIT 61, AGI 56, INT 61, MND 44, CHR 44.
 *
 * The model wears Chaos armor, the artifact set: Burgeonet, Cuirass,
 * Gauntlets, Flanchard, and Sollerets. Blackened plate, a crimson
 * cloth panel, a horned closed helm, and spiked pauldrons. Abyss, the
 * relic, is the same silhouette with purple instead of that crimson,
 * and it is not the set on the body. The pieces are not equipped, so
 * their stat lines are not on the sheet. The scythe in the hands is
 * the equipped weapon. Raven Scythe is the artifact weapon and is not
 * in the yard; the Bronze Zaghnal stands in.
 *
 * Absorb-STR through Absorb-TP, Tractor, Drain II, and Dread Spikes
 * are retail Dark Knight spells at or under 75. This yard does not
 * number them yet. The bar still has the dark, elemental, and
 * enfeebling spells the spell book already gives this job.
 */

import { skillCap, type SkillRank } from "./skills";
import { characterBase, type JobId } from "./stats";
import type { JobAccess } from "./blm";

export const DRK_CAP = 75;

/** Weapon Bash reaches this far. The page does not print a range, so it uses Shield Bash's 5.4 yalms. */
export const WEAPON_BASH_RANGE = 5.4;

/** Last Resort's attack bonus and defense penalty. 25% is 64/256. Merits are not added. */
export const LAST_RESORT_NUMER = 64;

export type DrkAbility = {
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

export type DrkTrait = {
  name: string;
  level: number;
  access: JobAccess;
  effect: string;
};

export type DrkSkill = {
  name: string;
  rank: SkillRank;
};

export function drkJobLevel(job: JobId, sub: JobId | null, subLevel: number, mainLevel: number): number {
  if (job === "DRK") return mainLevel;
  if (sub === "DRK") return subLevel;
  return 0;
}

/**
 * Attack Bonus. The higher tier replaces the lower.
 * I +10 at 10, II +22 at 30, III +35 at 50 (master sub), IV +48 at 70 (main).
 * A normal subjob stops at II.
 */
export function drkAttackBonus(level: number, access: JobAccess): number {
  if (access === "main" && level >= 70) return 48;
  if (access !== "sub" && level >= 50) return 35;
  if (level >= 30) return 22;
  if (level >= 10) return 10;
  return 0;
}

/**
 * Smite's attack bonus, in /256. Hand-to-hand or two-handed only. Not ranged.
 * I 25 at 15, II 38 at 35, III 51 at 55 (master sub), IV 64 at 75 (main).
 */
export function drkSmiteNumer(level: number, access: JobAccess): number {
  if (access === "main" && level >= 75) return 64;
  if (access !== "sub" && level >= 55) return 51;
  if (level >= 35) return 38;
  if (level >= 15) return 25;
  return 0;
}

/**
 * Damage Limit+ added to the physical pDIF cap. It does not raise the rolled pDIF.
 * I +26/256 at 20, II +51/256 at 40, III +77/256 at 55 (master sub), IV +102/256 at 70 (main).
 */
export function drkDamageLimit(level: number, access: JobAccess): number {
  if (access === "main" && level >= 70) return 102 / 256;
  if (access !== "sub" && level >= 55) return 77 / 256;
  if (level >= 40) return 51 / 256;
  if (level >= 20) return 26 / 256;
  return 0;
}

/**
 * Desperate Blows, as job-ability haste in /1024, while Last Resort is up
 * and the weapon is two-handed. 5% is 51, 10% is 102, 15% is 153.
 * The higher tier replaces the lower. A level-37 subjob has the 10% tier.
 */
export function desperateBlowsHaste(level: number): number {
  if (level >= 45) return 153;
  if (level >= 30) return 102;
  if (level >= 15) return 51;
  return 0;
}

/**
 * Resist Paralyze. The higher tier replaces the lower.
 * I 10% at 20, II 15% at 40, III 20% at 60 (main), IV 25% at 75 (main).
 * Nothing here paralyzes you, so it is not rolled.
 */
export function resistParalyze(level: number, access: JobAccess): number {
  if (access === "main" && level >= 75) return 0.25;
  if (access === "main" && level >= 60) return 0.2;
  if (level >= 40) return 0.15;
  if (level >= 20) return 0.1;
  return 0;
}

/** Arcana Killer I is 8% at 25. The Tropical Rarab is not arcana, so it is not rolled. */
export function arcanaKiller(level: number): number {
  return level >= 25 ? 0.08 : 0;
}

/**
 * Occult Acumen stat. I 25 at 45, II 50 at 58 (master sub), III 75 at 71 (main).
 * TP from an elemental or dark spell is floor(MP × stat × Store TP / 100).
 * Store TP here is the multiplier, 1 when Samurai has not granted it.
 */
export function occultAcumen(level: number, access: JobAccess): number {
  if (access === "main" && level >= 71) return 75;
  if (access !== "sub" && level >= 58) return 50;
  if (level >= 45) return 25;
  return 0;
}

export function occultTp(acumen: number, mp: number, storeTp: number): number {
  if (acumen <= 0 || mp <= 0) return 0;
  const stp = storeTp > 0 ? storeTp : 1;
  return Math.floor((mp * acumen * stp) / 100);
}

/**
 * Souleater's HP price, as a fraction of current HP. The damage added stays
 * the full convert rate. I 8.5% at 45, II 7% at 60 (main), III 6% at 75 (main).
 * Before the trait, the price is 10%.
 */
export function stalwartConsume(level: number, access: JobAccess): number {
  if (access === "main" && level >= 75) return 0.06;
  if (access === "main" && level >= 60) return 0.07;
  if (level >= 45) return 0.085;
  return 0.1;
}

/**
 * One connecting Souleater hit. Main converts 10% of current HP into damage.
 * A subjob consumes 10% (or the Stalwart price) and converts 5%.
 * The price cannot drop you to 0. The yard has no self-KO from this swing.
 */
export function souleaterStrike(hp: number, main: boolean, consumeRate: number): { bonus: number; cost: number } {
  const pool = Math.max(0, Math.floor(hp));
  if (pool <= 1) return { bonus: 0, cost: 0 };
  const convert = main ? 0.1 : 0.05;
  const consume = consumeRate > 0 && consumeRate <= 0.1 ? consumeRate : 0.1;
  return {
    bonus: Math.floor(pool * convert),
    cost: Math.min(pool - 1, Math.floor(pool * consume)),
  };
}

/** Consume Mana adds 1 base damage for every 10 MP, then that MP is gone. */
export function consumeManaAdd(mp: number): number {
  return Math.floor(Math.max(0, mp) / 10);
}

/** Weapon Bash blunt damage. floor((level + 11) / 4). Level 75 is 21. Level 37 is 12. */
export function weaponBashDamage(level: number): number {
  return Math.floor((Math.max(0, level) + 11) / 4);
}

/** Arcane Circle's arcana bonuses, as a fraction. Main 15%. Sub 5%. The hare is not arcana. */
export function arcaneCircleBonus(main: boolean): number {
  return main ? 0.15 : 0.05;
}

export const DRK_ABILITIES: DrkAbility[] = [
  {
    name: "Blood Weapon",
    level: 1,
    recast: 3600,
    duration: 30,
    access: "main",
    effect: "Melee hits drain HP equal to the damage dealt. The motion is the one-hour pose: the scythe rises and a crimson column wraps the body. Often used with Souleater, and the drained amount includes the HP that Souleater just added. Duration 0:00:30. Recast 1:00:00. Cumulative enmity 0, volatile enmity 80. Main job only. Job points are not added.",
    ce: 0,
    ve: 80,
  },
  {
    name: "Arcane Circle",
    level: 5,
    recast: 300,
    duration: 180,
    access: "sub",
    effect: "Arcana resistance for party members in range. Main job: damage dealt to arcana +15%, damage taken from arcana −15%. A subjob is 5%. The extra Arcana Killer is described as likely, so it is not added on top of the trait. Only one Circle can be up. The Tropical Rarab is not arcana, so the fight does not change. The motion sweeps the scythe through a ring and a violet circle opens on the ground. The page does not print the radius. Duration 0:03:00. Recast 0:05:00. Volatile enmity 5. Merits are not applied.",
    ce: 0,
    ve: 5,
  },
  {
    name: "Last Resort",
    level: 15,
    recast: 300,
    duration: 180,
    access: "sub",
    effect: "Attack +25% (64/256) and defense −25% (64/256). Desperate Blows adds job-ability haste while this is up, on a two-handed weapon only: 51/1024, 102/1024, or 153/1024. The motion throws the scythe back and a red haze climbs the plate. Duration 0:03:00. Recast 0:05:00. Cumulative enmity 0, volatile enmity 1280. Merits are not applied. Abyss Sollerets, which would cut the defense penalty, are not equipped.",
    ce: 0,
    ve: 1280,
  },
  {
    name: "Weapon Bash",
    level: 20,
    recast: 180,
    duration: 0,
    access: "sub",
    effect: "A two-handed weapon strike that can stun. Needs a two-handed weapon. The page does not print the range, so it uses 5.4'. Damage is floor((level + 11) / 4) blunt, 21 at 75 and 12 at 37. The stun rate is described as near 100% since the August 2007 update, and unlike the spell it is said to pass shadows. The duration is not printed, so the stun uses the spell's 2 seconds. The motion cocks the haft and punches it into the target. A white hit flash marks the body, and stun stars turn over the enemy's head. Recast 0:03:00. Cumulative enmity 0, volatile enmity 900. Merits and job points are not added.",
    ce: 0,
    ve: 900,
  },
  {
    name: "Souleater",
    level: 30,
    recast: 360,
    duration: 60,
    access: "sub",
    effect: "Each connecting melee hit spends a fraction of your current HP and adds damage. A main job adds 10% of current HP. A subjob spends the same price and adds 5%. Stalwart Soul lowers the price and does not lower the damage. The price stops at 1 HP. The motion bites the blade into the air and a red thread runs from the body into the edge. A miss does not spend HP. Weapon skills are described the same way, and this yard applies the price on auto-attacks. Duration 0:01:00. Recast 0:06:00. Cumulative enmity 0, volatile enmity 1280. Muted Soul is not unlocked, so the enmity is not cut.",
    ce: 0,
    ve: 1280,
  },
  {
    name: "Consume Mana",
    level: 55,
    recast: 60,
    duration: 60,
    access: "master-sub",
    effect: "The next connecting attack or weapon skill adds 1 base damage for every 10 MP you hold, then that MP is gone and this ends. A miss does not spend it. The motion draws violet motes out of the hands and into the blade. Duration 0:01:00 or until that hit. Recast 0:01:00. A level-37 subjob has not learned it. A master-level sub could. This kit has no master levels.",
    ce: 0,
    ve: 0,
  },
  {
    name: "Dark Seal",
    level: 75,
    recast: 300,
    duration: 60,
    access: "main",
    merit: true,
    effect: "Merit ability. Not unlocked. Would raise the magic accuracy of the next dark spell and shorten dark-magic cast time. The motion would seal the visor with a black glyph. Recast 0:05:00.",
    ce: 0,
    ve: 0,
  },
  {
    name: "Diabolic Eye",
    level: 75,
    recast: 300,
    duration: 180,
    access: "main",
    merit: true,
    effect: "Merit ability. Not unlocked. Would lower maximum HP and raise accuracy. The motion would open a red eye in the helm. Recast 0:05:00.",
    ce: 0,
    ve: 0,
  },
];

export const DRK_TRAITS: DrkTrait[] = [
  { name: "Attack Bonus", level: 10, access: "sub", effect: "Attack and ranged attack +10. The next tier replaces this." },
  { name: "Desperate Blows", level: 15, access: "sub", effect: "Job-ability haste +51/1024 while Last Resort is up, on a two-handed weapon. The next tier replaces this." },
  { name: "Smite", level: 15, access: "sub", effect: "Physical attack +25/256 with hand-to-hand or a two-handed weapon. Not ranged. The next tier replaces this." },
  { name: "Resist Paralyze", level: 20, access: "sub", effect: "10% chance to fully resist Paralyze. Nothing here paralyzes you, so it is not rolled." },
  { name: "Damage Limit+", level: 20, access: "sub", effect: "Physical pDIF cap +26/256. Does not raise the rolled pDIF, only the cap." },
  { name: "Arcana Killer", level: 25, access: "sub", effect: "An edge against arcana. 8%. The Tropical Rarab is not arcana, so it is not rolled." },
  { name: "Attack Bonus II", level: 30, access: "sub", effect: "Attack and ranged attack +22. Replaces Attack Bonus. A level-37 subjob has this tier." },
  { name: "Desperate Blows II", level: 30, access: "sub", effect: "Job-ability haste +102/1024 during Last Resort, on a two-handed weapon. Replaces Desperate Blows. A level-37 subjob has this tier." },
  { name: "Smite II", level: 35, access: "sub", effect: "Physical attack +38/256 with hand-to-hand or a two-handed weapon. Replaces Smite. A level-37 subjob has this tier." },
  { name: "Resist Paralyze II", level: 40, access: "sub", effect: "15%. Replaces Resist Paralyze. A level-37 subjob has not learned it." },
  { name: "Damage Limit+ II", level: 40, access: "sub", effect: "Physical pDIF cap +51/256. Replaces Damage Limit+. A level-37 subjob has not learned it." },
  { name: "Occult Acumen", level: 45, access: "sub", effect: "Elemental and dark spells grant floor(MP × 25 × Store TP / 100) TP. A level-37 subjob has not learned it." },
  { name: "Desperate Blows III", level: 45, access: "sub", effect: "Job-ability haste +153/1024 during Last Resort, on a two-handed weapon. Replaces Desperate Blows II. A level-37 subjob has not learned it." },
  { name: "Stalwart Soul", level: 45, access: "sub", effect: "Souleater spends 8.5% of current HP and still adds the full convert amount. A level-37 subjob has not learned it." },
  { name: "Attack Bonus III", level: 50, access: "master-sub", effect: "Attack and ranged attack +35. Replaces Attack Bonus II. A support job needs master levels." },
  { name: "Smite III", level: 55, access: "master-sub", effect: "Physical attack +51/256 with hand-to-hand or a two-handed weapon. Replaces Smite II. A support job needs master levels." },
  { name: "Damage Limit+ III", level: 55, access: "master-sub", effect: "Physical pDIF cap +77/256. Replaces Damage Limit+ II. A support job needs master levels." },
  { name: "Occult Acumen II", level: 58, access: "master-sub", effect: "The Occult Acumen stat becomes 50. Replaces Occult Acumen. A support job needs master levels." },
  { name: "Resist Paralyze III", level: 60, access: "main", effect: "20%. Replaces Resist Paralyze II. Main job only. Not rolled here." },
  { name: "Stalwart Soul II", level: 60, access: "main", effect: "Souleater spends 7% of current HP. Replaces Stalwart Soul. Main job only." },
  { name: "Attack Bonus IV", level: 70, access: "main", effect: "Attack and ranged attack +48. Replaces Attack Bonus III. Main job only." },
  { name: "Damage Limit+ IV", level: 70, access: "main", effect: "Physical pDIF cap +102/256. Replaces Damage Limit+ III. Main job only." },
  { name: "Occult Acumen III", level: 71, access: "main", effect: "The Occult Acumen stat becomes 75. Replaces Occult Acumen II. Main job only." },
  { name: "Resist Paralyze IV", level: 75, access: "main", effect: "25%. Replaces Resist Paralyze III. Main job only. Not rolled here." },
  { name: "Stalwart Soul III", level: 75, access: "main", effect: "Souleater spends 6% of current HP and still adds 10% as damage. Replaces Stalwart Soul II. Main job only." },
  { name: "Muted Soul", level: 75, access: "main", effect: "Merit trait. No ranks are unlocked, so Souleater's enmity is not reduced." },
  { name: "Smite IV", level: 75, access: "main", effect: "Physical attack +64/256 with hand-to-hand or a two-handed weapon. Replaces Smite III. Main job only." },
];

/** Combat and magic skills from the Dark Knight job page. The letters are that page's ranks, at the level-75 caps. */
export const DRK_SKILLS: DrkSkill[] = [
  { name: "Scythe", rank: "A+" },
  { name: "Great Sword", rank: "A" },
  { name: "Axe", rank: "B-" },
  { name: "Great Axe", rank: "B-" },
  { name: "Sword", rank: "B-" },
  { name: "Dagger", rank: "C" },
  { name: "Club", rank: "C-" },
  { name: "Marksmanship", rank: "E" },
  { name: "Evasion", rank: "C" },
  { name: "Parrying", rank: "E" },
  { name: "Dark Magic", rank: "A" },
  { name: "Elemental Magic", rank: "B+" },
  { name: "Enfeebling Magic", rank: "C" },
];

export function drkSkill(name: string, level: number): number {
  const row = DRK_SKILLS.find((skill) => skill.name === name);
  return row ? skillCap(row.rank, level) : 0;
}

export function assertDrk(): void {
  const naked = characterBase("hume", "DRK", 75);
  if (naked.hp !== 1167 || naked.mp !== 312 || naked.str !== 70 || naked.dex !== 61 || naked.vit !== 61 || naked.agi !== 56 || naked.int !== 61 || naked.mnd !== 44 || naked.chr !== 44) {
    throw new Error(`Hume DRK 75 ${naked.hp}/${naked.mp}/${naked.str}/${naked.dex}/${naked.vit}/${naked.agi}/${naked.int}/${naked.mnd}/${naked.chr}`);
  }
  if (drkJobLevel("DRK", null, 0, 75) !== 75 || drkJobLevel("WAR", "DRK", 37, 75) !== 37 || drkJobLevel("WAR", null, 0, 75) !== 0) throw new Error("Dark Knight level");
  if (drkAttackBonus(9, "sub") !== 0 || drkAttackBonus(37, "sub") !== 22 || drkAttackBonus(75, "sub") !== 22 || drkAttackBonus(75, "main") !== 48 || drkAttackBonus(58, "master-sub") !== 35) {
    throw new Error("Attack Bonus");
  }
  if (drkSmiteNumer(37, "sub") !== 38 || drkSmiteNumer(75, "sub") !== 38 || drkSmiteNumer(55, "master-sub") !== 51 || drkSmiteNumer(75, "main") !== 64) throw new Error("Smite");
  if (drkDamageLimit(37, "sub") !== 26 / 256 || drkDamageLimit(75, "sub") !== 51 / 256 || drkDamageLimit(55, "master-sub") !== 77 / 256 || drkDamageLimit(75, "main") !== 102 / 256) {
    throw new Error("Damage Limit+");
  }
  if (desperateBlowsHaste(14) !== 0 || desperateBlowsHaste(37) !== 102 || desperateBlowsHaste(75) !== 153) throw new Error("Desperate Blows");
  if (resistParalyze(37, "sub") !== 0.1 || resistParalyze(75, "sub") !== 0.15 || resistParalyze(75, "main") !== 0.25) throw new Error("Resist Paralyze");
  if (arcanaKiller(24) !== 0 || arcanaKiller(75) !== 0.08) throw new Error("Arcana Killer");
  if (occultAcumen(37, "sub") !== 0 || occultAcumen(75, "sub") !== 25 || occultAcumen(58, "master-sub") !== 50 || occultAcumen(75, "main") !== 75) throw new Error("Occult Acumen");
  if (occultTp(0, 21, 1) !== 0 || occultTp(75, 21, 1) !== 15 || occultTp(75, 21, 1.25) !== 19) throw new Error("Occult TP");
  if (stalwartConsume(37, "sub") !== 0.1 || stalwartConsume(75, "sub") !== 0.085 || stalwartConsume(60, "main") !== 0.07 || stalwartConsume(75, "main") !== 0.06) {
    throw new Error("Stalwart Soul");
  }
  const eaten = souleaterStrike(1167, true, 0.06);
  if (eaten.bonus !== 116 || eaten.cost !== 70) throw new Error(`Souleater ${eaten.bonus}/${eaten.cost}`);
  const subEaten = souleaterStrike(1000, false, 0.1);
  if (subEaten.bonus !== 50 || subEaten.cost !== 100) throw new Error("Souleater sub");
  if (souleaterStrike(1, true, 0.06).bonus !== 0) throw new Error("Souleater floor");
  if (consumeManaAdd(0) !== 0 || consumeManaAdd(9) !== 0 || consumeManaAdd(312) !== 31) throw new Error("Consume Mana");
  if (weaponBashDamage(75) !== 21 || weaponBashDamage(37) !== 12 || weaponBashDamage(45) !== 14) throw new Error("Weapon Bash");
  if (arcaneCircleBonus(true) !== 0.15 || arcaneCircleBonus(false) !== 0.05) throw new Error("Arcane Circle");
  if (LAST_RESORT_NUMER !== 64 || WEAPON_BASH_RANGE !== 5.4) throw new Error("Last Resort card");
  if (drkSkill("Scythe", 75) !== 276 || drkSkill("Great Sword", 75) !== 269 || drkSkill("Dark Magic", 75) !== 269) throw new Error("high ranks");
  if (drkSkill("Axe", 75) !== 240 || drkSkill("Great Axe", 75) !== 240 || drkSkill("Sword", 75) !== 240) throw new Error("B- ranks");
  if (drkSkill("Dagger", 75) !== 225 || drkSkill("Club", 75) !== 220 || drkSkill("Marksmanship", 75) !== 200 || drkSkill("Evasion", 75) !== 225 || drkSkill("Parrying", 75) !== 200) {
    throw new Error("low ranks");
  }
  if (drkSkill("Elemental Magic", 75) !== 256 || drkSkill("Enfeebling Magic", 75) !== 225) throw new Error("magic ranks");
  if (drkSkill("Scythe", 37) !== 114 || drkSkill("Sword", 37) !== 109 || drkSkill("Dagger", 37) !== 105 || drkSkill("Parrying", 37) !== 94 || drkSkill("Katana", 75) !== 0 || drkSkill("Shield", 75) !== 0) {
    throw new Error("missing or sub rank");
  }
  const banned = ["Nether Void", "Arcane Crest", "Scarlet Delirium", "Soul Enslavement", "Endark"];
  if (DRK_ABILITIES.some((a) => banned.includes(a.name)) || DRK_TRAITS.some((t) => banned.includes(t.name))) throw new Error("post-75 in the level-75 kit");
  if (DRK_ABILITIES.filter((a) => a.access === "sub" && a.level <= 37 && !a.merit).map((a) => a.name).join(",") !== "Arcane Circle,Last Resort,Weapon Bash,Souleater") {
    throw new Error("subjob abilities");
  }
  if (DRK_ABILITIES.filter((a) => a.merit).map((a) => a.name).join(",") !== "Dark Seal,Diabolic Eye") throw new Error("merits");
}
