/**
 * Retail Samurai toolkit through level 75. No merits and no job points.
 *
 * The job page's brackets, at a level-75 cap with no master levels:
 * abilities through Seigan are inside a normal subjob's reach. A support
 * job here is level 37, so Sekkanoki (40) is not learned. Store TP III
 * and Zanshin III are 50. Resist Blind IV, Store TP IV, and Zanshin IV
 * are main only. Meikyo Shisui is the level-1 SP ability and is main
 * only. Konzen-ittai is 65 and main only.
 *
 * Blade Bash, Shikikoyo, Ikishoten, and Overwhelm are merits.
 * Sengikori, Hamanoha, Hagakure, and Yaegasumi are past 75.
 * None of those are in this kit.
 *
 * Naked Hume Samurai grades, with no subjob: level 75 is 1242 HP, 0 MP,
 * STR 61, DEX 61, VIT 61, AGI 56, INT 53, MND 53, CHR 56.
 *
 * The model wears Myochin, the artifact set: Kabuto, Domaru, Kote,
 * Haidate, and Sune-Ate. The pieces are not equipped, so their stat
 * lines are not on the sheet. Mumeito is the great katana in hand.
 */

import { skillCap, type SkillRank } from "./skills";
import { characterBase, type JobId } from "./stats";
import type { JobAccess } from "./blm";

export const SAM_CAP = 75;

/** Konzen-ittai's readied mark. BG-Wiki prints 4.4 yalms. */
export const KONZEN_RANGE = 4.4;

/**
 * Hasso's melee haste while a two-handed weapon is out.
 * 10% of the 1024 job-ability scale is 102. Magic haste is a different term.
 */
export const HASSO_HASTE = 102;

/** Meditate's later ticks are 3 seconds apart. The first tick is granted on use. */
export const MEDITATE_TICK = 3;

export type SamAbility = {
  name: string;
  level: number;
  recast: number;
  /** 0 when the page does not print a fixed duration. */
  duration: number;
  access: JobAccess;
  effect: string;
  ce: number;
  ve: number;
};

export type SamTrait = {
  name: string;
  level: number;
  access: JobAccess;
  effect: string;
};

export type SamSkill = {
  name: string;
  rank: SkillRank;
};

export function samJobLevel(job: JobId, sub: JobId | null, subLevel: number, mainLevel: number): number {
  if (job === "SAM") return mainLevel;
  if (sub === "SAM") return subLevel;
  return 0;
}

/** Great Katana, great sword, great axe, scythe, polearm, and staff. Hand-to-hand is not one. */
export function twoHandKind(kind: string): boolean {
  return kind === "Great Katana" || kind === "Great Sword" || kind === "Great Axe" || kind === "Scythe" || kind === "Polearm" || kind === "Staff";
}

/** Hasso STR. Floor(Samurai level / 7), and the trait stops at 14. Level 75 is 10. */
export function hassoStr(level: number): number {
  if (level < 25) return 0;
  return Math.min(14, Math.floor(level / 7));
}

/**
 * Store TP. The higher tier replaces the lower.
 * The gain is floor(base × (100 + bonus) / 100). A subjob stops at II.
 */
export function storeTpMultiplier(level: number, access: JobAccess): number {
  let bonus = 0;
  if (access === "main" && level >= 70) bonus = 25;
  else if (access !== "sub" && level >= 50) bonus = 20;
  else if (level >= 30) bonus = 15;
  else if (level >= 10) bonus = 10;
  return (100 + bonus) / 100;
}

/**
 * Zanshin. One extra melee swing after a miss. It does not roll off that extra swing.
 * I 15% at 20, II 25% at 35, III 35% at 50 (master sub), IV 45% at 75 (main).
 */
export function zanshinRate(level: number, access: JobAccess): number {
  if (access === "main" && level >= 75) return 0.45;
  if (access !== "sub" && level >= 50) return 0.35;
  if (level >= 35) return 0.25;
  if (level >= 20) return 0.15;
  return 0;
}

/**
 * Resist Blind. The higher tier replaces the lower.
 * I 10% at 5, II 15% at 25, III 20% at 45, IV 25% at 65 (main).
 * Dust Cloud can blind you. This percent is the Resist! check, not magic evasion.
 */
export function blindResist(level: number, access: JobAccess): number {
  if (access === "main" && level >= 65) return 0.25;
  if (level >= 45) return 0.2;
  if (level >= 25) return 0.15;
  if (level >= 5) return 0.1;
  return 0;
}

/** Damage Limit+ I is +26/256. Samurai has no second tier by 75. A level-37 sub has not learned it. */
export function samDamageLimit(level: number): number {
  return level >= 40 ? 26 / 256 : 0;
}

/** Demon Killer is learned. The Tropical Rarab is not a demon, so nothing is rolled. */
export function demonKiller(level: number): boolean {
  return level >= 40;
}

/** Meditate, no gear. Main is 200 a tick up to 1000. A subjob is 120 a tick up to 600. */
export function meditateTick(main: boolean): { tp: number; cap: number } {
  return main ? { tp: 200, cap: 1000 } : { tp: 120, cap: 600 };
}

/**
 * One or more Meditate ticks. The first is spent on use, then one every 3 seconds.
 * Store TP does not change it. The cap is TP this use has added, not the 3000 bar.
 * A full bar does not burn the cap: a later weapon skill can still take the rest.
 */
export function meditateGain(main: boolean, gained: number, tp: number, ticks = 1): { gain: number; gained: number; tp: number } {
  const tick = meditateTick(main);
  const room = Math.max(0, tick.cap - gained);
  const want = Math.min(room, tick.tp * Math.max(0, ticks));
  const bar = Math.max(0, 3000 - tp);
  const gain = Math.min(want, bar);
  return { gain, gained: gained + gain, tp: Math.min(3000, tp + gain) };
}

export const SAM_ABILITIES: SamAbility[] = [
  {
    name: "Meikyo Shisui",
    level: 1,
    recast: 3600,
    duration: 30,
    access: "main",
    effect: "Grants 3000 TP, capped at 3000. Weapon skills cost 1000 TP, and the fTP still uses the TP you had when the swing connected. Melee does not give TP while it lasts. Meditate still does. Duration 0:30. Recast 1:00:00. Main job only. The one-hour ability. Cumulative enmity 1, volatile enmity 300.",
    ce: 1,
    ve: 300,
  },
  {
    name: "Warding Circle",
    level: 5,
    recast: 300,
    duration: 180,
    access: "sub",
    effect: "A circle on you. Against demons, main job is +15% damage dealt and +15% damage resisted. A subjob is 5% of that. The Tropical Rarab is not a demon, so the bonus is not rolled. Duration 3:00. Recast 5:00. Cumulative enmity 1, volatile enmity 20. Merit recast is not added.",
    ce: 1,
    ve: 20,
  },
  {
    name: "Third Eye",
    level: 15,
    recast: 60,
    duration: 30,
    access: "sub",
    effect: "Anticipates the next physical hit. That swing misses, and this is spent. It does not stop spells. Seigan, with a two-handed weapon, cuts the recast to 30 seconds and counters that hit 25% of the time. The keep rate is not a printed number, so the eye does not stay up. Duration 0:30. Recast 1:00. Cumulative enmity 1, volatile enmity 0. Merit recast is not added.",
    ce: 1,
    ve: 0,
  },
  {
    name: "Hasso",
    level: 25,
    recast: 60,
    duration: 300,
    access: "sub",
    effect: "Seigan wears off. While a two-handed weapon is out: STR +floor(Samurai level / 7), accuracy +10, and job-ability haste 102/1024. Level 75 is STR +10. A one-handed weapon keeps the stance and grants none of that. Duration 5:00. Recast 1:00. Cumulative enmity 1, volatile enmity 300.",
    ce: 1,
    ve: 300,
  },
  {
    name: "Meditate",
    level: 30,
    recast: 180,
    duration: 15,
    access: "sub",
    effect: "Kneel. The first tick is immediate: main job 200 TP, then 200 every 3 seconds, up to 1000 from this use. A subjob is 120, then 120 every 3 seconds, up to 600. Store TP does not change these numbers. No meditate gear is equipped, so the duration stays 15 seconds. It still ticks during Meikyo Shisui. Duration 0:15. Recast 3:00. Cumulative enmity 1, volatile enmity 320.",
    ce: 1,
    ve: 320,
  },
  {
    name: "Seigan",
    level: 35,
    recast: 60,
    duration: 300,
    access: "sub",
    effect: "Hasso wears off. Third Eye's recast becomes 30 seconds. With a two-handed weapon, the anticipated hit counters 25% of the time. The page does not print a flat defense bonus, so none is added. Duration 5:00. Recast 1:00. Cumulative enmity 1, volatile enmity 300.",
    ce: 1,
    ve: 300,
  },
  {
    name: "Sekkanoki",
    level: 40,
    recast: 300,
    duration: 60,
    access: "sub",
    effect: "The next weapon skill spends 1000 TP instead of the bar, then this wears off. The fTP still uses the TP you had. A level-37 subjob has not learned it. Duration 1:00 or until that weapon skill. Recast 5:00. Cumulative enmity 1, volatile enmity 80.",
    ce: 1,
    ve: 80,
  },
  {
    name: "Konzen-ittai",
    level: 65,
    recast: 180,
    duration: 60,
    access: "main",
    effect: "Readies the target. The next connecting weapon skill closes a skillchain of that skill's primary property, unless a real chain is already in the window. Range 4.4'. Duration 1:00 or until that weapon skill. Recast 3:00. Main job only. Cumulative enmity 1, volatile enmity 300.",
    ce: 1,
    ve: 300,
  },
];

export const SAM_TRAITS: SamTrait[] = [
  { name: "Resist Blind", level: 5, access: "sub", effect: "10% chance to fully resist Blind. The next tier replaces this. Dust Cloud can blind you. This is a Resist! check, separate from magic evasion. One point is 1% against a normal monster. The Tropical Rarab is not notorious. The check stops at 90%." },
  { name: "Store TP", level: 10, access: "sub", effect: "TP gained +10%. The next tier replaces this." },
  { name: "Zanshin", level: 20, access: "sub", effect: "15% chance of an extra melee swing after a miss. It does not roll again off that swing. The next tier replaces this." },
  { name: "Resist Blind II", level: 25, access: "sub", effect: "15% chance to fully resist Blind. Replaces Resist Blind. Dust Cloud rolls this Resist! check." },
  { name: "Store TP II", level: 30, access: "sub", effect: "TP gained +15%. Replaces Store TP. A level-37 subjob has this tier." },
  { name: "Zanshin II", level: 35, access: "sub", effect: "25% chance. Replaces Zanshin. A level-37 subjob has this tier." },
  { name: "Demon Killer", level: 40, access: "sub", effect: "Bonus damage against demons. The page does not print one percent for the trait alone. The Tropical Rarab is not a demon, so nothing is rolled. A level-37 subjob has not learned it." },
  { name: "Damage Limit+", level: 40, access: "sub", effect: "Physical pDIF cap +26/256. It does not raise the rolled pDIF. It does not stack with another job's Damage Limit+. A level-37 subjob has not learned it. Samurai has no second tier by 75." },
  { name: "Resist Blind III", level: 45, access: "sub", effect: "20% chance to fully resist Blind. Replaces Resist Blind II. A level-37 subjob has not learned it. Dust Cloud rolls this Resist! check." },
  { name: "Store TP III", level: 50, access: "master-sub", effect: "TP gained +20%. Replaces Store TP II. A support job needs master levels." },
  { name: "Zanshin III", level: 50, access: "master-sub", effect: "35% chance. Replaces Zanshin II. A support job needs master levels." },
  { name: "Resist Blind IV", level: 65, access: "main", effect: "25% chance to fully resist Blind. Replaces Resist Blind III. Main job only. Dust Cloud rolls this Resist! check." },
  { name: "Store TP IV", level: 70, access: "main", effect: "TP gained +25%. Replaces Store TP III. Main job only." },
  { name: "Zanshin IV", level: 75, access: "main", effect: "45% chance. Replaces Zanshin III. Main job only." },
];

/** Combat skills from the Samurai job page, at the level-75 caps. No magic skills. */
export const SAM_SKILLS: SamSkill[] = [
  { name: "Great Katana", rank: "A+" },
  { name: "Parrying", rank: "A" },
  { name: "Evasion", rank: "B+" },
  { name: "Polearm", rank: "B-" },
  { name: "Sword", rank: "C+" },
  { name: "Archery", rank: "C+" },
  { name: "Throwing", rank: "C+" },
  { name: "Dagger", rank: "E" },
  { name: "Club", rank: "E" },
];

/**
 * TP left after a weapon skill.
 * Sekkanoki and Meikyo Shisui spend 1000. The fTP already used the TP you had when you swung.
 * A normal skill spends the bar and keeps only the weapon-skill return.
 */
export function tpAfterWeaponSkill(current: number, wsReturn: number, sekkanoki: boolean, meikyo: boolean): number {
  const now = Math.max(0, Math.floor(current));
  const back = Math.max(0, Math.floor(wsReturn));
  if (meikyo) return Math.min(3000, Math.max(0, now - 1000));
  if (sekkanoki) return Math.min(3000, Math.max(0, now - 1000) + back);
  return Math.min(3000, back);
}

export function samSkill(name: string, level: number): number {
  const row = SAM_SKILLS.find((skill) => skill.name === name);
  return row ? skillCap(row.rank, level) : 0;
}

export function assertSam(): void {
  const naked = characterBase("hume", "SAM", 75);
  if (naked.hp !== 1242 || naked.mp !== 0 || naked.str !== 61 || naked.dex !== 61 || naked.vit !== 61 || naked.agi !== 56 || naked.int !== 53 || naked.mnd !== 53 || naked.chr !== 56) {
    throw new Error(`Hume SAM 75 ${naked.hp}/${naked.mp}/${naked.str}/${naked.dex}/${naked.vit}/${naked.agi}/${naked.int}/${naked.mnd}/${naked.chr}`);
  }
  if (hassoStr(24) !== 0 || hassoStr(25) !== 3 || hassoStr(75) !== 10 || hassoStr(99) !== 14) throw new Error("Hasso STR");
  if (storeTpMultiplier(9, "sub") !== 1 || storeTpMultiplier(37, "sub") !== 1.15 || storeTpMultiplier(50, "sub") !== 1.15 || storeTpMultiplier(75, "main") !== 1.25) {
    throw new Error("Store TP");
  }
  if (storeTpMultiplier(50, "master-sub") !== 1.2) throw new Error("Store TP III");
  if (zanshinRate(19, "sub") !== 0 || zanshinRate(37, "sub") !== 0.25 || zanshinRate(50, "sub") !== 0.25 || zanshinRate(75, "main") !== 0.45) {
    throw new Error("Zanshin");
  }
  if (zanshinRate(50, "master-sub") !== 0.35) throw new Error("Zanshin III");
  if (blindResist(4, "sub") !== 0 || blindResist(37, "sub") !== 0.15 || blindResist(45, "sub") !== 0.2 || blindResist(75, "main") !== 0.25 || blindResist(65, "sub") !== 0.2) {
    throw new Error("Resist Blind");
  }
  if (samDamageLimit(39) !== 0 || samDamageLimit(75) !== 26 / 256) throw new Error("Damage Limit+");
  if (demonKiller(39) || !demonKiller(40)) throw new Error("Demon Killer");
  if (meditateTick(true).tp !== 200 || meditateTick(true).cap !== 1000 || meditateTick(false).tp !== 120 || meditateTick(false).cap !== 600) {
    throw new Error("Meditate");
  }
  let gained = 0;
  let tp = 0;
  for (let i = 0; i < 5; i++) {
    const step = meditateGain(true, gained, tp, 1);
    gained = step.gained;
    tp = step.tp;
  }
  if (tp !== 1000 || gained !== 1000 || meditateGain(true, gained, tp, 1).gain !== 0) throw new Error("Meditate main cap");
  const sub = meditateGain(false, 0, 0, 5);
  if (sub.gain !== 600 || sub.tp !== 600 || sub.gained !== 600) throw new Error("Meditate sub cap");
  const clipped = meditateGain(true, 0, 2950, 1);
  if (clipped.gain !== 50 || clipped.tp !== 3000 || clipped.gained !== 50) throw new Error("Meditate bar");
  const afterWs = meditateGain(true, clipped.gained, 40, 1);
  if (afterWs.gain !== 200 || afterWs.tp !== 240) throw new Error("Meditate after a weapon skill");
  if (!twoHandKind("Great Katana") || twoHandKind("Sword") || twoHandKind("Hand-to-Hand")) throw new Error("two-hand");
  if (HASSO_HASTE !== 102 || KONZEN_RANGE !== 4.4 || MEDITATE_TICK !== 3) throw new Error("Hasso or Konzen");
  if (tpAfterWeaponSkill(3000, 160, true, false) !== 2160) throw new Error("Sekkanoki keeps the bar minus 1000");
  if (tpAfterWeaponSkill(1500, 0, true, false) !== 500) throw new Error("Sekkanoki on a miss still spends 1000");
  if (tpAfterWeaponSkill(3000, 160, false, true) !== 2000) throw new Error("Meikyo spends 1000 and returns none");
  if (tpAfterWeaponSkill(3000, 160, false, false) !== 160) throw new Error("a normal weapon skill spends the bar");
  if (tpAfterWeaponSkill(3000, 160, true, true) !== 2000) throw new Error("Meikyo wins when both are up");
  if (samSkill("Great Katana", 75) !== 276 || samSkill("Parrying", 75) !== 269 || samSkill("Evasion", 75) !== 256) throw new Error("high ranks");
  if (samSkill("Polearm", 75) !== 240 || samSkill("Sword", 75) !== 230 || samSkill("Archery", 75) !== 230 || samSkill("Throwing", 75) !== 230) throw new Error("mid ranks");
  if (samSkill("Dagger", 75) !== 200 || samSkill("Club", 75) !== 200 || samSkill("Great Katana", 37) !== 114) throw new Error("low ranks");
  if (samSkill("Katana", 75) !== 0 || samSkill("Staff", 75) !== 0) throw new Error("no rank");
  const banned = ["Blade Bash", "Shikikoyo", "Ikishoten", "Overwhelm", "Sengikori", "Hamanoha", "Hagakure", "Yaegasumi"];
  if (SAM_ABILITIES.some((a) => banned.includes(a.name)) || SAM_TRAITS.some((t) => banned.includes(t.name))) {
    throw new Error("merit or post-75 in the level-75 kit");
  }
  if (SAM_ABILITIES.filter((a) => a.access === "sub" && a.level <= 37).map((a) => a.name).join(",") !== "Warding Circle,Third Eye,Hasso,Meditate,Seigan") {
    throw new Error("subjob abilities");
  }
}
