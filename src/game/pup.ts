/**
 * Retail Puppetmaster toolkit through level 75. No merits and no job points.
 * The automaton is called with Activate while an Animator is in the ranged slot.
 *
 * A support job here is level 37. Activate, the eight maneuvers, Deploy,
 * Deactivate, Retrieve, Repair, and Deus Ex Automata are inside that.
 * Overdrive is the one-hour and is main only. Maintenance is 30 and the
 * job page files it under main only. Ventriloquy and Role Reversal are
 * group-2 merits. Tactical Switch, Cooldown, and Heady Artifice are past 75.
 *
 * Traits through 45 are a normal subjob's, except Evasion Bonus II, which
 * is 40, so a level-37 sub still has the first tier. Resist Slow II and
 * Martial Arts II are 50. Resist Amnesia III is 55. Those need a
 * master-level sub. From 60 up is main only, including Smite I, Evasion
 * Bonus III, Resist Slow III, and Martial Arts III. Fine-Tuning and
 * Optimization are merits. Stout Servant and Tactical Guard are past 75.
 *
 * Naked Hume Puppetmaster grades, with no subjob: level 75 is 1046 HP,
 * 0 MP, STR 53, DEX 65, VIT 56, AGI 61, INT 53, MND 48, CHR 61.
 * Darkstar's grade row is HP D, MP none, STR E, DEX B, VIT D, AGI C,
 * INT E, MND F, CHR C. Mind sits with Warrior, which is F.
 *
 * The model wears Puppetry Attire, the artifact set: Puppetry Taj, Tobe,
 * Dastanas, Churidars, and Babouches. Black cap and feather, red sleeves,
 * gold filigree, a purple sash. The pieces are not equipped, so their
 * stat lines are not on the sheet. Sainti is a later hand-to-hand weapon
 * and is not in the bag. Cat Baghnakhs is the level-1 pair a Puppetmaster
 * can hold. Cesti's job line does not include Puppetmaster.
 *
 * Current BG-Wiki job page, through this repo's level-75 skill cap.
 * Hand-to-Hand prints A+ and 150 at level 49, which is this table's A
 * group, so 75 is 276. Dagger C− 220, Club D 210, Throwing C+ 230,
 * Evasion B 250, Guard B 250, Parrying D 210. No innate magic skill.
 *
 * Maneuvers need the Animator and an active automaton. They do not buff the master.
 * All eight maneuvers share one 10-second recast. Burden and Overload are simulated.
 * Repair spends one Automaton Oil from the ammo slot.
 */

import { skillCap, type SkillRank } from "./skills";
import { characterBase, type JobId } from "./stats";
import type { JobAccess } from "./blm";
import { mnkWeaponDelay } from "./mnk";
import { assertAutomaton } from "./automaton";

export const PUP_CAP = 75;

/** Overdrive. One hour. The automaton stays augmented for 3 minutes. */
export const OVERDRIVE_RECAST = 60 * 60;
export const OVERDRIVE_SECONDS = 3 * 60;

/** Activate. Calls the automaton. Recast 0:20:00. */
export const ACTIVATE_RECAST = 20 * 60;

/** Deus Ex Automata. Recast 0:01:00. The automaton appears at level ÷ 3 HP. */
export const DEUS_RECAST = 60;

/** Repair. Recast 0:01:30. One equipped Automaton Oil. 10% HP, then 20 every 3 seconds for 15 seconds. */
export const REPAIR_RECAST = 90;
/** Instant share of the automaton's maximum HP. Automaton Oil, the only can in this yard. */
export const REPAIR_INSTANT = 0.1;
/** HP each 3-second tic while the oil is mending. Five tics, 100 HP. */
export const REPAIR_REGEN = 20;
export const REPAIR_REGEN_SECONDS = 15;
export const REPAIR_TICK = 3;

export function repairInstant(maxHp: number): number {
  if (maxHp <= 0) return 0;
  return Math.floor(maxHp * REPAIR_INSTANT);
}

export function repairTickCount(): number {
  return REPAIR_REGEN_SECONDS / REPAIR_TICK;
}

/** Maintenance. Recast 0:01:00. Main job only. */
export const MAINTENANCE_RECAST = 60;

/** Deploy and Retrieve. Recast 0:00:05. Deploy's reach is 17.5 yalms. */
export const PET_ORDER_RECAST = 5;
export const DEPLOY_RANGE = 17.5;

/** Deactivate. Recast 0:01:00. */
export const DEACTIVATE_RECAST = 60;

/** One maneuver. Recast 0:00:10. It lasts 0:01:00 on the automaton. */
export const MANEUVER_RECAST = 10;
export const MANEUVER_SECONDS = 60;

export const MANEUVERS = [
  "Fire Maneuver",
  "Ice Maneuver",
  "Wind Maneuver",
  "Earth Maneuver",
  "Thunder Maneuver",
  "Water Maneuver",
  "Light Maneuver",
  "Dark Maneuver",
] as const;

export function isManeuver(name: string): boolean {
  return (MANEUVERS as readonly string[]).includes(name);
}

export type PupAbility = {
  name: string;
  level: number;
  recast: number;
  duration: number;
  access: JobAccess;
  effect: string;
  merit?: boolean;
};

export type PupTrait = {
  name: string;
  level: number;
  access: JobAccess;
  effect: string;
  merit?: boolean;
};

export type PupSkill = {
  name: string;
  rank: SkillRank;
};

export function puppetmasterJobLevel(job: JobId, sub: JobId | null, subLevel: number, mainLevel: number): number {
  if (job === "PUP") return mainLevel;
  if (sub === "PUP") return subLevel;
  return 0;
}

/**
 * Hand-to-hand base delay after Martial Arts. 480 is the bare delay.
 * I is 400 at 25. II is 380 at 50 and needs a master-level sub. III is
 * 360 at 75 and is main only. A normal sub stays at 400.
 */
export function pupMartialArtsDelay(level: number, access: JobAccess = "sub"): number {
  if (access === "main" && level >= 75) return 360;
  if (access !== "sub" && level >= 50) return 380;
  if (level >= 25) return 400;
  return 480;
}

/** Stored hand-to-hand delay includes the 480 base. Martial Arts replaces that base. */
export function pupWeaponDelay(storedDelay: number, level: number, access: JobAccess = "sub"): number {
  if (level <= 0) return storedDelay;
  return pupMartialArtsDelay(level, access) + (storedDelay - 480);
}

/** The shorter Martial Arts base, Monk or Puppetmaster. A job at 0 contributes nothing. */
export function bestHandDelay(storedDelay: number, mnkLevel: number, pupLevel: number, pupAccess: JobAccess = "sub"): number {
  const mnk = mnkWeaponDelay(storedDelay, mnkLevel);
  if (pupLevel <= 0) return mnk;
  return Math.min(mnk, pupWeaponDelay(storedDelay, pupLevel, pupAccess));
}

/** Evasion Bonus. Tiers replace. III is main only. A level-37 sub has I. */
export function pupEvasionBonus(level: number, access: JobAccess): number {
  if (access === "main" && level >= 60) return 35;
  if (level >= 40) return 22;
  if (level >= 20) return 10;
  return 0;
}

/** Resist Slow. II needs a master-level sub. III is main only. */
export function pupResistSlow(level: number, access: JobAccess): number {
  if (access === "main" && level >= 70) return 0.2;
  if (access !== "sub" && level >= 50) return 0.15;
  if (level >= 10) return 0.1;
  return 0;
}

/** Resist Amnesia. Catalogued, and not rolled. III needs a master-level sub. IV is main only. */
export function pupResistAmnesia(level: number, access: JobAccess): number {
  if (access === "main" && level >= 75) return 0.25;
  if (access !== "sub" && level >= 55) return 0.2;
  if (level >= 35) return 0.15;
  if (level >= 15) return 0.1;
  return 0;
}

/** Damage Limit+ I is +26/256 at 45. A level-37 sub has not learned it. II is 90. */
export function pupDamageLimit(level: number): number {
  return level >= 45 ? 26 / 256 : 0;
}

/**
 * Smite I is +25/256 at 60, the same first rank the other jobs print.
 * Hand-to-hand or two-handed only. Main job only. A sub does not have it.
 */
export function pupSmiteNumer(level: number, access: JobAccess): number {
  if (access !== "main") return 0;
  return level >= 60 ? 25 : 0;
}

export const PUP_ABILITIES: readonly PupAbility[] = [
  {
    name: "Overdrive",
    level: 1,
    recast: OVERDRIVE_RECAST,
    duration: OVERDRIVE_SECONDS,
    access: "main",
    effect: "Augments the automaton for 3 minutes. Maneuver bonuses are doubled. Recast 1:00:00. Main job only. The automaton must be active.",
  },
  {
    name: "Activate",
    level: 1,
    recast: ACTIVATE_RECAST,
    duration: 0,
    access: "sub",
    effect: "Calls forth the automaton in its equipped head and frame. Needs an Animator in the ranged slot. Recast 0:20:00.",
  },
  {
    name: "Deactivate",
    level: 1,
    recast: DEACTIVATE_RECAST,
    duration: 0,
    access: "sub",
    effect: "Puts the automaton away. Recast 0:01:00.",
  },
  {
    name: "Deploy",
    level: 1,
    recast: PET_ORDER_RECAST,
    duration: 0,
    access: "sub",
    effect: "Orders the automaton to attack. Range 17.5'. Recast 0:00:05.",
  },
  {
    name: "Fire Maneuver",
    level: 1,
    recast: MANEUVER_RECAST,
    duration: MANEUVER_SECONDS,
    access: "sub",
    effect: "Fire maneuver. The automaton's Strength rises. Duration starts at 0:01:00. While the automaton is deployed it climbs 3 seconds every 3 seconds, up to 0:05:00. Retrieve keeps that bank. The timer ticks down when the automaton is not deployed. Only three maneuvers can be up. A fourth replaces the oldest. All eight maneuvers share recast 0:00:10. Needs an Animator and an active automaton. Repeating one element builds burden and can Overload.",
  },
  {
    name: "Ice Maneuver",
    level: 1,
    recast: MANEUVER_RECAST,
    duration: MANEUVER_SECONDS,
    access: "sub",
    effect: "Ice maneuver. The automaton's Intelligence rises. Duration starts at 0:01:00. While the automaton is deployed it climbs 3 seconds every 3 seconds, up to 0:05:00. Retrieve keeps that bank. The timer ticks down when the automaton is not deployed. Only three maneuvers can be up. A fourth replaces the oldest. All eight maneuvers share recast 0:00:10. Needs an Animator and an active automaton. Repeating one element builds burden and can Overload.",
  },
  {
    name: "Wind Maneuver",
    level: 1,
    recast: MANEUVER_RECAST,
    duration: MANEUVER_SECONDS,
    access: "sub",
    effect: "Wind maneuver. The automaton's Agility rises. Duration starts at 0:01:00. While the automaton is deployed it climbs 3 seconds every 3 seconds, up to 0:05:00. Retrieve keeps that bank. The timer ticks down when the automaton is not deployed. Only three maneuvers can be up. A fourth replaces the oldest. All eight maneuvers share recast 0:00:10. Needs an Animator and an active automaton. Repeating one element builds burden and can Overload.",
  },
  {
    name: "Earth Maneuver",
    level: 1,
    recast: MANEUVER_RECAST,
    duration: MANEUVER_SECONDS,
    access: "sub",
    effect: "Earth maneuver. The automaton's Vitality rises. Duration starts at 0:01:00. While the automaton is deployed it climbs 3 seconds every 3 seconds, up to 0:05:00. Retrieve keeps that bank. The timer ticks down when the automaton is not deployed. Only three maneuvers can be up. A fourth replaces the oldest. All eight maneuvers share recast 0:00:10. Needs an Animator and an active automaton. Repeating one element builds burden and can Overload.",
  },
  {
    name: "Thunder Maneuver",
    level: 1,
    recast: MANEUVER_RECAST,
    duration: MANEUVER_SECONDS,
    access: "sub",
    effect: "Thunder maneuver. The automaton's Dexterity rises. Duration starts at 0:01:00. While the automaton is deployed it climbs 3 seconds every 3 seconds, up to 0:05:00. Retrieve keeps that bank. The timer ticks down when the automaton is not deployed. Only three maneuvers can be up. A fourth replaces the oldest. All eight maneuvers share recast 0:00:10. Needs an Animator and an active automaton. Repeating one element builds burden and can Overload.",
  },
  {
    name: "Water Maneuver",
    level: 1,
    recast: MANEUVER_RECAST,
    duration: MANEUVER_SECONDS,
    access: "sub",
    effect: "Water maneuver. The automaton's Mind rises. Duration starts at 0:01:00. While the automaton is deployed it climbs 3 seconds every 3 seconds, up to 0:05:00. Retrieve keeps that bank. The timer ticks down when the automaton is not deployed. Only three maneuvers can be up. A fourth replaces the oldest. All eight maneuvers share recast 0:00:10. Needs an Animator and an active automaton. Repeating one element builds burden and can Overload.",
  },
  {
    name: "Light Maneuver",
    level: 1,
    recast: MANEUVER_RECAST,
    duration: MANEUVER_SECONDS,
    access: "sub",
    effect: "Light maneuver. The automaton's Charisma rises. Duration starts at 0:01:00. While the automaton is deployed it climbs 3 seconds every 3 seconds, up to 0:05:00. Retrieve keeps that bank. The timer ticks down when the automaton is not deployed. Only three maneuvers can be up. A fourth replaces the oldest. All eight maneuvers share recast 0:00:10. Needs an Animator and an active automaton. Repeating one element builds burden and can Overload.",
  },
  {
    name: "Dark Maneuver",
    level: 1,
    recast: MANEUVER_RECAST,
    duration: MANEUVER_SECONDS,
    access: "sub",
    effect: "Dark maneuver. The automaton's magic recovery rises. Duration starts at 0:01:00. While the automaton is deployed it climbs 3 seconds every 3 seconds, up to 0:05:00. Retrieve keeps that bank. The timer ticks down when the automaton is not deployed. Only three maneuvers can be up. A fourth replaces the oldest. All eight maneuvers share recast 0:00:10. Needs an Animator and an active automaton. Repeating one element builds burden and can Overload.",
  },
  {
    name: "Deus Ex Automata",
    level: 5,
    recast: DEUS_RECAST,
    duration: 0,
    access: "sub",
    effect: "Calls the automaton at Level ÷ 3 HP. Needs an Animator. Recast 0:01:00.",
  },
  {
    name: "Retrieve",
    level: 10,
    recast: PET_ORDER_RECAST,
    duration: 0,
    access: "sub",
    effect: "Orders the automaton back to your side. Recast 0:00:05.",
  },
  {
    name: "Repair",
    level: 15,
    recast: REPAIR_RECAST,
    duration: 0,
    access: "sub",
    effect: "Restores 10% of the automaton's maximum HP, then 20 HP every 3 seconds for 15 seconds. Spends one Automaton Oil from the ammo slot. Recast 0:01:30.",
  },
  {
    name: "Maintenance",
    level: 30,
    recast: MAINTENANCE_RECAST,
    duration: 0,
    access: "main",
    effect: "Cures the automaton's status ailments. Recast 0:01:00. Main job only.",
  },
  {
    name: "Ventriloquy",
    level: 75,
    recast: 60,
    duration: 0,
    access: "main",
    merit: true,
    effect: "Transfers enmity onto the automaton. Merit. Not unlocked.",
  },
  {
    name: "Role Reversal",
    level: 75,
    recast: 120,
    duration: 0,
    access: "main",
    merit: true,
    effect: "Swaps the master's HP with the automaton's HP. Merit. Not unlocked.",
  },
];

export const PUP_TRAITS: readonly PupTrait[] = [
  { name: "Resist Slow", level: 10, access: "sub", effect: "Slow resistance +10%. The next tier replaces this." },
  { name: "Resist Amnesia", level: 15, access: "sub", effect: "Amnesia resistance +10%. Nothing here inflicts amnesia, so it is not rolled." },
  { name: "Evasion Bonus", level: 20, access: "sub", effect: "Evasion +10. The next tier replaces this. A level-37 sub has not learned II." },
  { name: "Martial Arts", level: 25, access: "sub", effect: "Hand-to-hand base delay 400. Weapon delay is added after it. Cat Baghnakhs is +60." },
  { name: "Resist Amnesia II", level: 35, access: "sub", effect: "Amnesia resistance +15%. Replaces Resist Amnesia." },
  { name: "Evasion Bonus II", level: 40, access: "sub", effect: "Evasion +22. Replaces Evasion Bonus. A level-37 sub has not learned it." },
  { name: "Damage Limit+", level: 45, access: "sub", effect: "Physical pDIF cap +26/256. A level-37 sub has not learned it. It does not stack with another job's Damage Limit+." },
  { name: "Resist Slow II", level: 50, access: "master-sub", effect: "Slow resistance +15%. Replaces Resist Slow. A normal subjob has not learned it." },
  { name: "Martial Arts II", level: 50, access: "master-sub", effect: "Hand-to-hand base delay 380. Replaces Martial Arts. A normal subjob has not learned it." },
  { name: "Resist Amnesia III", level: 55, access: "master-sub", effect: "Amnesia resistance +20%. A normal subjob has not learned it." },
  { name: "Evasion Bonus III", level: 60, access: "main", effect: "Evasion +35. Replaces Evasion Bonus II. Main job only." },
  { name: "Smite", level: 60, access: "main", effect: "Physical attack +25/256 with a hand-to-hand or two-handed weapon. Main job only." },
  { name: "Resist Slow III", level: 70, access: "main", effect: "Slow resistance +20%. Replaces Resist Slow II. Main job only." },
  { name: "Martial Arts III", level: 75, access: "main", effect: "Hand-to-hand base delay 360. Replaces Martial Arts II. Main job only. Cat Baghnakhs then swings at 420." },
  { name: "Fine-Tuning", level: 75, access: "main", merit: true, effect: "Merit. Automaton accuracy and evasion. Not unlocked." },
  { name: "Optimization", level: 75, access: "main", merit: true, effect: "Merit. Automaton attack and defense. Not unlocked." },
  { name: "Resist Amnesia IV", level: 75, access: "main", effect: "Amnesia resistance +25%. Replaces Resist Amnesia III. Main job only. Not rolled." },
];

export const PUP_SKILLS: readonly PupSkill[] = [
  { name: "Hand-to-Hand", rank: "A+" },
  { name: "Dagger", rank: "C-" },
  { name: "Club", rank: "D" },
  { name: "Throwing", rank: "C+" },
  { name: "Evasion", rank: "B" },
  { name: "Guard", rank: "B" },
  { name: "Parrying", rank: "D" },
];

export function pupSkill(name: string, level: number): number {
  const row = PUP_SKILLS.find((skill) => skill.name === name);
  return row ? skillCap(row.rank, level) : 0;
}

export function assertPup(): void {
  const hume = characterBase("hume", "PUP", 75);
  if (hume.hp !== 1046 || hume.mp !== 0 || hume.str !== 53 || hume.dex !== 65 || hume.vit !== 56 || hume.agi !== 61 || hume.int !== 53 || hume.mnd !== 48 || hume.chr !== 61) {
    throw new Error(`Hume PUP 75 ${hume.hp}/${hume.mp}/${hume.str}/${hume.dex}/${hume.vit}/${hume.agi}/${hume.int}/${hume.mnd}/${hume.chr}`);
  }
  if (pupMartialArtsDelay(24) !== 480 || pupMartialArtsDelay(37, "sub") !== 400 || pupMartialArtsDelay(50, "master-sub") !== 380 || pupMartialArtsDelay(75, "main") !== 360 || pupMartialArtsDelay(75, "sub") !== 400) {
    throw new Error("Martial Arts");
  }
  if (pupWeaponDelay(540, 75, "main") !== 420 || pupWeaponDelay(540, 37, "sub") !== 460) throw new Error("Cat Baghnakhs delay");
  if (bestHandDelay(528, 75, 0) !== 348 || bestHandDelay(540, 0, 75, "main") !== 420 || bestHandDelay(540, 37, 75, "main") !== 420) {
    throw new Error("best hand delay");
  }
  if (pupEvasionBonus(37, "sub") !== 10 || pupEvasionBonus(40, "sub") !== 22 || pupEvasionBonus(75, "main") !== 35 || pupEvasionBonus(75, "sub") !== 22) {
    throw new Error("Evasion Bonus");
  }
  if (pupResistSlow(9, "sub") !== 0 || pupResistSlow(37, "sub") !== 0.1 || pupResistSlow(50, "master-sub") !== 0.15 || pupResistSlow(75, "main") !== 0.2 || pupResistSlow(75, "sub") !== 0.1) {
    throw new Error("Resist Slow");
  }
  if (pupResistAmnesia(14, "sub") !== 0 || pupResistAmnesia(37, "sub") !== 0.15 || pupResistAmnesia(55, "master-sub") !== 0.2 || pupResistAmnesia(75, "main") !== 0.25) {
    throw new Error("Resist Amnesia");
  }
  if (pupDamageLimit(37) !== 0 || pupDamageLimit(75) !== 26 / 256) throw new Error("Damage Limit+");
  if (pupSmiteNumer(75, "sub") !== 0 || pupSmiteNumer(59, "main") !== 0 || pupSmiteNumer(75, "main") !== 25) throw new Error("Smite");
  if (pupSkill("Hand-to-Hand", 75) !== 276 || pupSkill("Dagger", 75) !== 220 || pupSkill("Club", 75) !== 210 || pupSkill("Throwing", 75) !== 230) {
    throw new Error("PUP combat skills");
  }
  if (pupSkill("Evasion", 75) !== 250 || pupSkill("Guard", 75) !== 250 || pupSkill("Parrying", 75) !== 210 || pupSkill("Staff", 75) !== 0) {
    throw new Error("PUP defensive skills");
  }
  if (repairInstant(800) !== 80 || repairInstant(9) !== 0 || repairInstant(10) !== 1 || repairTickCount() !== 5) {
    throw new Error("Repair oil");
  }
  const repair = PUP_ABILITIES.find((ability) => ability.name === "Repair");
  if (!repair || repair.recast !== REPAIR_RECAST || !repair.effect.includes("Automaton Oil") || repair.effect.includes("not spent")) {
    throw new Error("Repair text");
  }
  if (puppetmasterJobLevel("PUP", null, 0, 75) !== 75 || puppetmasterJobLevel("WAR", "PUP", 37, 75) !== 37 || puppetmasterJobLevel("WAR", null, 0, 75) !== 0) {
    throw new Error("Puppetmaster level");
  }
  const names = PUP_ABILITIES.map((ability) => ability.name);
  for (const maneuver of MANEUVERS) {
    if (!names.includes(maneuver)) throw new Error(`${maneuver} missing`);
  }
  if (PUP_ABILITIES.filter((ability) => ability.merit).map((ability) => ability.name).join("|") !== "Ventriloquy|Role Reversal") {
    throw new Error("PUP merits");
  }
  assertAutomaton();
}
