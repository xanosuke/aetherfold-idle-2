/**
 * Retail Dancer toolkit through level 75. No merits and no job points.
 * A support job here is level 37. Steps, waltzes, sambas, jigs, and
 * flourishes inside that level are a subjob's. Contradance is 50.
 * Chocobo Jig is 55. Both need a master-level sub, so a level-37
 * Dancer has not learned them. From 61 up is main only, including
 * Drain Samba III, Curing Waltz IV, and Chocobo Jig II. Trance is the
 * one-hour and is main only.
 *
 * Saber Dance, Fan Dance, and No Foot Rise are group-2 merits.
 * Closed Position is a merit trait. None of them are unlocked.
 * Presto, Grand Pas, Climactic Flourish, Striking Flourish,
 * Ternary Flourish, Feather Step, Divine Waltz II, and Curing Waltz V
 * are past 75.
 *
 * Naked Hume Dancer grades, Darkstar's row, with no subjob:
 * HP D, MP none, STR D, DEX C, VIT E, AGI B, INT F, MND F, CHR B.
 * Level 1 is 28 HP, 0 MP, STR 6, DEX 7, VIT 6, AGI 7, INT 5, MND 5, CHR 7.
 * Level 75 is 1046 HP, 0 MP, STR 56, DEX 61, VIT 53, AGI 65, INT 48,
 * MND 48, CHR 65. Dancer has no MP of its own.
 *
 * The model wears Dancer's Attire, the artifact set: Dancer's Tiara,
 * Casaque, Bangles, Tights, and Toe Shoes. Black-plum body, red bolero
 * sleeves, gold lace and hoop bangles, a green sash, gold buttons down
 * the tights, gold-laced toe shoes. The pieces are not equipped, so
 * their stat lines are not on the sheet. War Hoop is the level-40
 * artifact throwing weapon and is not in the bag. Bronze Dagger is the
 * level-1 knife, with a second one in the off hand.
 *
 * Current BG-Wiki job page, through this repo's level-75 skill cap.
 * Dagger A+ 276, Hand-to-Hand D 210, Sword D 210, Throwing C+ 230,
 * Evasion B+ 256, Parrying B 250. No magic skill. A level-37 sub is
 * 114 on A+, 101 on D, 105 on C+, and 109 on the B group.
 *
 * Current dances spend TP. Trance, for its minute, makes that cost 0.
 * Steps still build finishing moves, up to 5, and the stack lasts
 * two hours. Flourishes spend them. A samba stays on the dancer.
 * The next melee hit puts that samba's daze on the foe for 10
 * seconds, and the dancer's melee refreshes it. Party melee on
 * that foe gets the benefit. Only one daze is up. The newest hit
 * replaces the old one. Haste Samba's 5% is job-ability haste,
 * 51/1024, on the rounds that connect. It is not a buff you keep
 * while standing still. Drain and Aspir do not add damage.
 * A waltz is floor(M × (your CHR + their VIT)) + B. No waltz-potency
 * gear is equipped, and there are no job points, so that is the whole
 * cure. M is 1/4, 1/2, 3/4, and 1 from Curing Waltz through IV.
 * Divine Waltz uses 1/4. A subjob halves M. Curing, Divine, and
 * Healing keep separate recast timers. Contradance doubles the HP.
 * On Healing Waltz it is a 10' area instead. Reverse Flourish, with no merits
 * and no gear, is 95 × finishing moves + 5 × finishing moves².
 * Flourishes I share one clock. Animated Flourish is 30 seconds and
 * 1000 or 1500 volatile enmity. Desperate and Violent are 20 seconds.
 * Flourishes II share the other clock. Building Flourish is 10 seconds.
 * Reverse Flourish and Wild Flourish are 30. Wild Flourish is Chainbound.
 */
import { skillCap, type SkillRank } from "./skills";
import { characterBase, type JobId } from "./stats";
import type { JobAccess } from "./blm";

export const DNC_CAP = 75;

/** Trance. One hour. Main job only. Dances and steps cost no TP. */
export const TRANCE_RECAST = 60 * 60;
export const TRANCE_SECONDS = 60;

/** Finishing moves. Five is the cap. The stack lasts two hours. */
export const FINISHING_CAP = 5;
export const FINISHING_SECONDS = 2 * 60 * 60;

/** Steps share 0:00:05. Quickstep and Stutter Step reach 4.5'. Box Step reaches 4.8'. */
export const STEP_RECAST = 5;
export const STEP_RANGE = 4.8;
export const STEP_RANGE_SHORT = 4.5;
export const STEP_TP = 100;
export const STEP_SECONDS = 60;
/** A later step adds 30 seconds to the time still left. The daze stops at 2 minutes. */
export const STEP_EXTEND = 30;
export const STEP_MAX_SECONDS = 120;
/** Every step has 10 accuracy on top of the melee hit. Merits and Presto are not unlocked. */
export const STEP_ACCURACY = 10;

/** Samba category. One shared recast. Each samba spends its own TP. */
export const SAMBA_RECAST = 60;
/** The daze on the foe. A dancer's landed melee refreshes it. */
export const SAMBA_DAZE_SECONDS = 10;
export const HASTE_SAMBA_SECONDS = 90;
export const DRAIN_SAMBA_SECONDS = 120;
export const ASPIR_SAMBA_SECONDS = 120;
/** Haste daze: 5% job-ability haste, 51/1024. Merits are not unlocked. */
export const HASTE_SAMBA = 51;

/** Waltzes. Curing, Divine, and Healing each keep their own clock. */
export const WALTZ_RANGE = 20.6;
export const WALTZ_RANGE_HIGH = 20.7;
export const DIVINE_RANGE = 10.7;
export const DIVINE_RADIUS = 9.9;
export const HEALING_RANGE = 24.9;
/** Contradance turns Healing Waltz into an area around the target. */
export const HEALING_AOE = 10;

/** Flourishes I share one clock. Animated Flourish's own recast is 30 seconds. The other two are 20. */
export const ANIMATED_RECAST = 30;
export const FLOURISH_I_RECAST = 20;
/** Animated Flourish reaches about as far as Provoke. */
export const ANIMATED_RANGE = 17.6;
/** Desperate Flourish and Violent Flourish. */
export const FLOURISH_RANGE = 4.4;
/** Wild Flourish. */
export const WILD_RANGE = 4.9;
/** Flourishes II share one clock. Building Flourish is 10 seconds. Reverse Flourish and Wild Flourish are 30. */
export const BUILDING_RECAST = 10;
export const REVERSE_RECAST = 30;
export const BUILDING_SECONDS = 60;
/** Violent Flourish's physical accuracy bonus. The stun, if the hit lands, is 1 to 7 seconds. */
export const VIOLENT_ACC = 100;
/**
 * Desperate Flourish's hit-rate penalty is not printed.
 * The page puts it around 10–20%. This yard uses 15.
 */
export const DESPERATE_HIT_CUT = 15;

/** Contradance. Doubles the next curing or divine waltz. Healing Waltz becomes a 10' area. */
export const CONTRADANCE_RECAST = 5 * 60;
export const CONTRADANCE_SECONDS = 60;

/** Jigs share one timer. Spectral Jig is 3:00. Both chocobo jigs are 2:00. */
export const SPECTRAL_SECONDS = 180;
export const JIG_SECONDS = 120;
export const SPECTRAL_RECAST = 30;
export const CHOCOBO_RECAST = 60;
/**
 * Quickening. LandSandBoat stores power 10, and base speed is 50,
 * so 10/50 is +20%. BG-Wiki's ability pages say the same 20%.
 * The older category line that still says 25% is not used.
 * Flee is +60% and overwrites this. Mazurka shares the 20% cap.
 */
export const CHOCOBO_MOVE = 0.2;
/** The page does not print the yalms. Party members inside 10' receive Chocobo Jig II. */
export const CHOCOBO_JIG_II_RADIUS = 10;

/** Desperate Flourish. Weight is the yard's Gravity, −26% movement, and evasion −10. */
export const WEIGHT_SECONDS = 60;
export const WEIGHT_EVA = 10;

export type DncKind = "trance" | "samba" | "waltz" | "step" | "flourish" | "flourish2" | "jig" | "contradance";

export type DncAbility = {
  name: string;
  level: number;
  recast: number;
  duration: number;
  access: JobAccess;
  kind: DncKind;
  tp: number;
  effect: string;
  merit?: boolean;
};

export type DncTrait = {
  name: string;
  level: number;
  access: JobAccess;
  effect: string;
  merit?: boolean;
};

export type DncSkill = {
  name: string;
  rank: SkillRank;
};

export function dancerJobLevel(job: JobId, sub: JobId | null, subLevel: number, mainLevel: number): number {
  if (job === "DNC") return mainLevel;
  if (sub === "DNC") return subLevel;
  return 0;
}

function learned(level: number): JobAccess {
  if (level >= 61) return "main";
  if (level >= 50) return "master-sub";
  return "sub";
}

/**
 * Dual Wield, as a fraction of delay removed. The higher tier replaces the lower.
 * The percents are the same trait Ninja uses. Dancer's levels are later.
 * I 10% at 20, II 15% at 40, III 25% at 60 (main). IV is 80.
 * A level-37 subjob has I.
 */
export function dncDualWield(level: number, access: JobAccess): number {
  if (access === "main" && level >= 60) return 0.25;
  if (level >= 40) return 0.15;
  if (level >= 20) return 0.1;
  return 0;
}

/**
 * Accuracy Bonus. I +10 at 30, II +22 at 60 (main). III is 76.
 * A level-37 subjob has I.
 */
export function dncAccuracyBonus(level: number, access: JobAccess): number {
  if (access === "main" && level >= 60) return 22;
  if (level >= 30) return 10;
  return 0;
}

/**
 * Subtle Blow. I 5 at 25, II 10 at 45, III 15 at 65 (main).
 * A level-37 subjob has I.
 */
export function dncSubtleBlow(level: number, access: JobAccess): number {
  if (access === "main" && level >= 65) return 15;
  if (level >= 45) return 10;
  if (level >= 25) return 5;
  return 0;
}

/**
 * Evasion Bonus. The same +10 / +22 / +35 steps as the other jobs.
 * I at 15, II at 45, III at 75 (main). A level-37 subjob has I.
 */
export function dncEvasionBonus(level: number, access: JobAccess): number {
  if (access === "main" && level >= 75) return 35;
  if (level >= 45) return 22;
  if (level >= 15) return 10;
  return 0;
}

/**
 * Resist Slow. I 10% at 20. II 15% at 55, and that tier needs a
 * master-level sub. III is 81. A level-37 subjob has I.
 */
export function dncResistSlow(level: number, access: JobAccess): number {
  if (access !== "sub" && level >= 55) return 0.15;
  if (level >= 20) return 0.1;
  return 0;
}

/** Damage Limit+ I is +26/256 at 45. II is 90. A normal subjob has not learned it. */
export function dncDamageLimit(level: number, access: JobAccess): number {
  if (access === "sub") return 0;
  return level >= 45 ? 26 / 256 : 0;
}

/** Lethargic Daze. Level 1 is −8 evasion, then −4 more each level. */
export function lethargicEvasion(level: number): number {
  if (level <= 0) return 0;
  return (level + 1) * 4;
}

/** Sluggish Daze. 5% defense at the first level, then 2% each level after. Level 10 is 23%. */
export function sluggishDefense(level: number): number {
  if (level <= 0) return 0;
  return 0.05 + 0.02 * (level - 1);
}

/** Weakened Daze. Magic evasion −3 for each level. Level 10 is −30. */
export function weakenedMagicEvasion(level: number): number {
  if (level <= 0) return 0;
  return Math.floor(level) * 3;
}

/** Quickstep and Stutter Step are 4.5'. Box Step is 4.8'. */
export function stepRange(name: string): number {
  return name === "Box Step" ? STEP_RANGE : STEP_RANGE_SHORT;
}

/**
 * The first step sets 60 seconds.
 * A later one adds 30 to whatever is still left, and the daze stops at 2 minutes.
 * Job points are not spent, so that cap does not move.
 */
export function stepSeconds(currentLevel: number, left = 0): number {
  if (currentLevel <= 0) return STEP_SECONDS;
  return Math.min(STEP_MAX_SECONDS, Math.max(0, left) + STEP_EXTEND);
}

/**
 * Step land rate. This yard's melee line is 75 + floor((accuracy − evasion) / 2).
 * Ten accuracy is five hit percent, then the same 20–99 clamp.
 * The category example is a 90% melee hit becoming a 95% step.
 */
export function stepHitRate(meleeHit: number): number {
  return Math.max(20, Math.min(99, Math.floor(meleeHit) + Math.floor(STEP_ACCURACY / 2)));
}

/** A main job stacks a daze to 10. A support job stops at 5. */
export function dazeCap(main: boolean): number {
  return main ? 10 : 5;
}

/**
 * Drain and Aspir return, from the hit that already landed.
 * A hit of 1 or less returns nothing. The return never adds damage.
 *
 * Drain caps are the FFXIclopedia delay line, floor(modified delay × N / 100):
 * I is 3, II is 8, III is 14. BG-Wiki also caps I at 50% of the damage
 * and II at 75%. III's percent is not printed, so it stops at the
 * damage itself or the delay cap, whichever is smaller.
 *
 * Aspir I is the printed 25% of damage, and floor(delay / 60), which
 * matches the observed 1–4 on a one-hander and 3–8 on a two-hander.
 * Aspir II's percent is not printed. floor(delay × 3 / 100) matches
 * the observed 1–8 and 3–15 band, and half the damage keeps that
 * cap in front on a normal hit. The foe must have MP. Undead give
 * no HP back.
 */
const SAMBA_RETURN: Record<string, { percent: number; num: number; den: number }> = {
  "Drain Samba": { percent: 0.5, num: 3, den: 100 },
  "Drain Samba II": { percent: 0.75, num: 8, den: 100 },
  "Drain Samba III": { percent: 1, num: 14, den: 100 },
  "Aspir Samba": { percent: 0.25, num: 1, den: 60 },
  "Aspir Samba II": { percent: 0.5, num: 3, den: 100 },
};

export function sambaTp(name: string): number {
  if (name === "Drain Samba") return 100;
  if (name === "Aspir Samba") return 150;
  if (name === "Drain Samba II" || name === "Aspir Samba II") return 250;
  if (name === "Haste Samba") return 350;
  if (name === "Drain Samba III") return 400;
  return 0;
}

export function sambaDaze(name: string): "Drain Daze" | "Aspir Daze" | "Haste Daze" | null {
  if (name.startsWith("Drain Samba")) return "Drain Daze";
  if (name.startsWith("Aspir Samba")) return "Aspir Daze";
  if (name === "Haste Samba") return "Haste Daze";
  return null;
}

export function sambaReturn(name: string, delay: number, damage: number): number {
  const spec = SAMBA_RETURN[name];
  if (!spec || damage < 2 || delay <= 0) return 0;
  const fromDelay = Math.floor(delay * spec.num / spec.den);
  const fromDamage = Math.floor(damage * spec.percent);
  return Math.max(0, Math.min(fromDelay, fromDamage));
}

export function drainFromHit(name: string, delay: number, damage: number): number {
  return name.startsWith("Drain Samba") ? sambaReturn(name, delay, damage) : 0;
}

export function aspirFromHit(name: string, delay: number, damage: number): number {
  return name.startsWith("Aspir Samba") ? sambaReturn(name, delay, damage) : 0;
}

/**
 * HP from a waltz. Your CHR, their VIT.
 * The category slopes are 1/4, 1/2, 3/4, and 1, plus 60, 130, 270, and 450.
 * Divine Waltz is the first slope. A subjob halves the slope.
 * No potency gear and no job points, so nothing else multiplies it.
 * Contradance doubles the finished amount.
 */
const WALTZ_LINE: Record<string, { num: number; den: number; b: number }> = {
  "Curing Waltz": { num: 1, den: 4, b: 60 },
  "Divine Waltz": { num: 1, den: 4, b: 60 },
  "Curing Waltz II": { num: 1, den: 2, b: 130 },
  "Curing Waltz III": { num: 3, den: 4, b: 270 },
  "Curing Waltz IV": { num: 1, den: 1, b: 450 },
};

export function waltzHeal(name: string, chr: number, vit: number, contradance = false, main = true): number {
  const line = WALTZ_LINE[name];
  if (!line) return 0;
  const sum = Math.max(0, Math.floor(chr)) + Math.max(0, Math.floor(vit));
  const den = main ? line.den : line.den * 2;
  const base = Math.floor(sum * line.num / den) + line.b;
  return contradance ? base * 2 : base;
}

export function waltzRange(name: string): number {
  if (name === "Healing Waltz") return HEALING_RANGE;
  if (name === "Divine Waltz") return DIVINE_RANGE;
  if (name === "Curing Waltz III" || name === "Curing Waltz IV") return WALTZ_RANGE_HIGH;
  return WALTZ_RANGE;
}

/** One ailment Healing Waltz may take. Not Doom, Amnesia, petrify, Helix, songs, Stun, Mute, Terror, or Kaustra. Curse does come off. */
const HEALING_OK = new Set<string>([
  "Poison", "Paralysis", "Blindness", "Silence", "Disease", "Plague", "Curse", "Bane",
  "Bio", "Dia", "Gravity", "Flash", "Addle", "Slow",
  "Burn", "Choke", "Drown", "Frost", "Rasp", "Shock",
  "STR Down", "DEX Down", "VIT Down", "AGI Down", "INT Down", "MND Down", "CHR Down",
  "Attack Down", "Defense Down", "Accuracy Down", "Evasion Down",
  "Magic Atk. Down", "Magic Def. Down", "Magic Acc. Down", "Magic Evasion Down",
]);

export function healingWaltzRemoves(name: string): boolean {
  return HEALING_OK.has(name);
}

export function isWaltz(name: string): boolean {
  return name === "Curing Waltz" || name === "Curing Waltz II" || name === "Curing Waltz III" || name === "Curing Waltz IV" || name === "Divine Waltz" || name === "Healing Waltz";
}

/** Reverse Flourish. No merit, no flourish-II gear, square mod 5. */
export function reverseTp(finishing: number): number {
  const fm = Math.max(0, Math.min(FINISHING_CAP, Math.floor(finishing)));
  if (fm <= 0) return 0;
  return 95 * fm + 5 * fm * fm;
}

/** Animated Flourish spends one finishing move, or two when they are there. No job points, so 1000 or 1500. */
export function animatedFlourish(finishing: number): { spent: number; ve: number } {
  const spent = Math.min(2, Math.max(0, Math.floor(finishing)));
  return { spent, ve: spent >= 2 ? 1500 : spent === 1 ? 1000 : 0 };
}

/** +100 accuracy is +50 hit rate, then the usual 20–99 clamp. */
export function violentHitChance(hit: number): number {
  return Math.min(99, Math.max(20, Math.floor(hit) + VIOLENT_ACC / 2));
}

/** Stand-in for the unprinted 10–20% penalty. Fifteen points of hit rate. */
export function desperateHitChance(hit: number): number {
  return Math.min(99, Math.max(20, Math.floor(hit) - DESPERATE_HIT_CUT));
}

/** Observed stun band. One through seven seconds, and the average of that band is 4. */
export function violentStunSeconds(roll: number): number {
  const u = Math.max(0, Math.min(0.999999, roll));
  return Math.floor(u * 7) + 1;
}

export function finishingGain(hit: boolean, capped: boolean, main: boolean): number {
  if (!hit) return 0;
  if (capped || !main) return 1;
  return 2;
}

const CURING_WALTZES = ["Curing Waltz", "Curing Waltz II", "Curing Waltz III", "Curing Waltz IV"] as const;

/** Curing waltzes share one clock. Divine and Healing keep their own. */
function waltzShare(name: string): string[] | undefined {
  if ((CURING_WALTZES as readonly string[]).includes(name)) return others(CURING_WALTZES, name);
  return undefined;
}
const STEPS = ["Quickstep", "Box Step", "Stutter Step"] as const;
const SAMBAS = ["Drain Samba", "Drain Samba II", "Drain Samba III", "Aspir Samba", "Aspir Samba II", "Haste Samba"] as const;
const FLOURISH_I = ["Animated Flourish", "Desperate Flourish", "Violent Flourish"] as const;
const FLOURISH_II = ["Reverse Flourish", "Building Flourish", "Wild Flourish"] as const;
const JIGS = ["Spectral Jig", "Chocobo Jig", "Chocobo Jig II"] as const;

function row(
  name: string,
  level: number,
  recast: number,
  duration: number,
  kind: DncKind,
  tp: number,
  effect: string,
  access?: JobAccess,
): DncAbility {
  return { name, level, recast, duration, access: access ?? learned(level), kind, tp, effect };
}

export const DNC_ABILITIES: readonly DncAbility[] = [
  row("Trance", 1, TRANCE_RECAST, TRANCE_SECONDS, "trance", 0, "While it is up, dances and steps cost no TP. Duration 0:01:00. Recast 1:00:00. Main job only. The one-hour ability.", "main"),
  row("Drain Samba", 5, SAMBA_RECAST, DRAIN_SAMBA_SECONDS, "samba", sambaTp("Drain Samba"), "Drain Daze on the next foe you hit. It lasts 10 seconds, and your melee refreshes it. Party melee restores HP from damage already dealt, never extra damage. Under 2 damage restores nothing. At most 50% of the hit, and at most floor(delay × 3 / 100). 100 TP. Recast 0:01:00, shared. The samba lasts 0:02:00. Enmity 1 cumulative, 300 volatile."),
  row("Curing Waltz", 15, 6, 0, "waltz", 200, "Restores HP for one party member. floor((your CHR + their VIT) / 4) + 60. A subjob halves that slope. 200 TP. Recast 0:00:06, shared by the curing waltzes only. Range 20.6' when aimed at someone else. Contradance doubles the finished amount."),
  row("Animated Flourish", 20, ANIMATED_RECAST, 0, "flourish", 0, "Provokes. One finishing move is 1000 volatile enmity. Two is 1500. It spends two when you have them and leaves the rest. Cumulative enmity 1. Range 17.6'. Recast 0:00:30, shared by Flourishes I. No job-point enmity."),
  row("Quickstep", 20, STEP_RECAST, STEP_SECONDS, "step", STEP_TP, "Lethargic Daze. Evasion −(level + 1) × 4. Level 1 is −8, and level 10 is −44. A subjob stops at level 5. The first step lasts 60 seconds. Each later step adds 30 seconds to the time still left, and it stops at 2 minutes. A hit grants 2 finishing moves, or 1 if that daze is already capped or Dancer is the subjob. A miss grants none. It can miss. A shadow would stop it. This quarry has none. It deals no damage. 100 TP. Recast 0:00:05, shared by every step. Range 4.5'. Enmity 1 cumulative, 0 volatile. The land rate is the melee hit plus 10 accuracy."),
  row("Aspir Samba", 25, SAMBA_RECAST, ASPIR_SAMBA_SECONDS, "samba", sambaTp("Aspir Samba"), "Aspir Daze. Party melee restores MP, at most 25% of the damage and at most floor(delay / 60). The foe must have MP. This does not add damage, and it does not touch an undead. The Tropical Rarab has no MP. 150 TP. Duration 0:02:00. The daze lasts 10 seconds. The samba timer is shared."),
  row("Divine Waltz", 25, 13, 0, "waltz", 400, "Restores HP for every party member inside 9.9' of the target. Each one uses their own VIT: floor((your CHR + their VIT) / 4) + 60. A subjob halves the slope. 400 TP. Recast 0:00:13, its own timer. Begin within 10.7'. Contradance doubles each cure."),
  row("Spectral Jig", 25, SPECTRAL_RECAST, SPECTRAL_SECONDS, "jig", 0, "Sneak and Invisible for 3 minutes. If Sneak is already up, nothing is applied. The two effects wear off together when you attack, are attacked, cast a spell, or use another job ability. Recast 0:00:30, shared by the jigs. No TP. Enmity 1 cumulative, 300 volatile."),
  row("Box Step", 30, STEP_RECAST, STEP_SECONDS, "step", STEP_TP, "Sluggish Daze. Defense −5%, then −2% for each level after. Level 10 is −23%. The level cap, duration, finishing moves, and timer match Quickstep. A subjob stops at level 5. 100 TP. Range 4.8'. Enmity 1 cumulative, 0 volatile."),
  row("Curing Waltz II", 30, 8, 0, "waltz", 350, "Restores HP for one party member. floor((your CHR + their VIT) / 2) + 130. A subjob halves that slope. 350 TP. Recast 0:00:08, shared by the curing waltzes only. Range 20.6'. Contradance doubles the finished amount."),
  row("Desperate Flourish", 30, FLOURISH_I_RECAST, WEIGHT_SECONDS, "flourish", 0, "Weight. Movement −26% and evasion −10 for 60 seconds when it hits. The hit rate is the melee hit minus 15. The page only says that penalty is about 10 to 20, and the gravity resist ladder is not rolled. One finishing move. Range 4.4'. Recast 0:00:20, shared by Flourishes I. Enmity 1 cumulative, 0 volatile."),
  row("Drain Samba II", 35, SAMBA_RECAST, HASTE_SAMBA_SECONDS, "samba", sambaTp("Drain Samba II"), "Drain Daze, stronger. At most 75% of the damage and at most floor(delay × 8 / 100). 250 TP. Duration 0:01:30. The daze lasts 10 seconds. The samba timer is shared."),
  row("Healing Waltz", 35, 8, 0, "waltz", 200, "Removes one erasable ailment. Curse, Paralysis, Blindness, Poison, Disease, Plague, Silence, and the erase-like downs come off. Amnesia, Doom, Helix, Petrification, songs, Stun, Mute, Terror, and Kaustra stay. 200 TP. Recast 0:00:08, its own timer. Range 24.9'. Contradance makes it a 10' area around the target. Enmity 1 cumulative, 320 volatile."),
  row("Reverse Flourish", 40, REVERSE_RECAST, 0, "flourish2", 0, "Turns every finishing move into TP. 95 × moves + 5 × moves². One is 100. Five is 600. No merit TP and no job points. Recast 0:00:30, shared by Flourishes II. Enmity 1 cumulative, 0 volatile. /ja on yourself."),
  row("Stutter Step", 40, STEP_RECAST, STEP_SECONDS, "step", STEP_TP, "Weakened Daze. Magic evasion −3 for each level. Level 1 is −3, and level 10 is −30. A subjob stops at level 5, which is −15. Spells read it. The duration, finishing moves, and timer match Quickstep. 100 TP. Range 4.5'. A level-37 subjob has not learned it."),
  row("Curing Waltz III", 45, 10, 0, "waltz", 500, "Restores HP for one party member. floor((your CHR + their VIT) × 3 / 4) + 270. A subjob halves that slope. 500 TP. Recast 0:00:10, shared by the curing waltzes only. Range 20.7'. Contradance doubles the finished amount."),
  row("Haste Samba", 45, SAMBA_RECAST, HASTE_SAMBA_SECONDS, "samba", sambaTp("Haste Samba"), "Haste Daze for 10 seconds after your last landed melee. Anyone whose melee connects on that foe gains 51/1024 job-ability haste for the attack round. Extra hits do not add more. Spells and ranged attacks are not hasted. 350 TP. The samba lasts 0:01:30. Recast 0:01:00, shared."),
  row("Violent Flourish", 45, FLOURISH_I_RECAST, 0, "flourish", 0, "One non-crit melee hit, with accuracy +100. A miss does no damage and does not stun. A hit stuns for 1 to 7 seconds. The magic-accuracy roll is not printed, so the landed hit stuns. One finishing move. Range 4.4'. Recast 0:00:20, shared by Flourishes I. The swing timer resets. Enmity 1 cumulative, 0 volatile."),
  row("Building Flourish", 50, BUILDING_RECAST, BUILDING_SECONDS, "flourish2", 0, "The next weapon skill. One finishing move is accuracy +40. Two adds attack +25%. Three adds critical hit rate +10%. Moves past three are kept. It applies to every hit, and it does not add weapon-skill damage. That job point is not unlocked. Recast 0:00:10, shared by Flourishes II. Duration 0:01:00, or until that weapon skill. Enmity 1 cumulative, 0 volatile.", "master-sub"),
  row("Contradance", 50, CONTRADANCE_RECAST, CONTRADANCE_SECONDS, "contradance", 0, "The next curing or divine waltz restores twice the finished amount. Healing Waltz is not doubled. It becomes a 10' area around the target instead. Duration 0:01:00. Recast 0:05:00. A normal subjob has not learned it.", "master-sub"),
  row("Chocobo Jig", 55, CHOCOBO_RECAST, JIG_SECONDS, "jig", 0, "Quickening. Movement +20% for 2 minutes. Weight comes off. It does not add to Flee, and with Mazurka the two stop at 20% together. It wears off if you attack or are attacked. Recast 0:01:00, shared by the jigs. A normal subjob has not learned it.", "master-sub"),
  row("Aspir Samba II", 60, SAMBA_RECAST, HASTE_SAMBA_SECONDS, "samba", sambaTp("Aspir Samba II"), "A stronger Aspir Daze. At most half the damage, and at most floor(delay × 3 / 100), the observed one-hand and two-hand band. The foe still needs MP. 250 TP. Duration 0:01:30. A normal subjob has not learned it.", "master-sub"),
  row("Wild Flourish", 60, REVERSE_RECAST, 0, "flourish2", 0, "Chainbound for 10 seconds. Costs 2 finishing moves and leaves the rest. The next weapon skill uses its first level 1 property and makes that skillchain. A weapon skill with only level 2 or 3 properties does not chain, and Chainbound ends. A weapon skill with no properties leaves it. No effect if a skillchain is already open. It can miss, at the melee hit rate. Range 4.9'. Recast 0:00:30, shared by Flourishes II. The job-point skillchain damage is not unlocked.", "master-sub"),
  row("Drain Samba III", 65, SAMBA_RECAST, HASTE_SAMBA_SECONDS, "samba", sambaTp("Drain Samba III"), "Drain Daze. The delay cap is floor(delay × 14 / 100). The percent is not printed, so the return stops at the damage or that cap. 400 TP. Duration 0:01:30. Main job only. The daze lasts 10 seconds."),
  row("Curing Waltz IV", 70, 13, 0, "waltz", 650, "Restores HP for one party member. Your CHR + their VIT + 450. A subjob halves the slope, not the +450. 650 TP. Recast 0:00:13, shared by the curing waltzes only. Range 20.7'. Main job only. Fixed hate, 400 cumulative and 700 volatile. Contradance doubles the finished amount."),
  row("Chocobo Jig II", 70, CHOCOBO_RECAST, JIG_SECONDS, "jig", 0, "The same +20% Quickening, on party members inside 10'. The page does not print the radius. Main job only. The jig timer is shared. Weight comes off each person it reaches."),
  { name: "Saber Dance", level: 75, recast: 180, duration: 300, access: "main", kind: "trance", tp: 0, merit: true, effect: "Merit. Not unlocked. Would grant Double Attack that falls from 50% to 20%, and block waltzes." },
  { name: "Fan Dance", level: 75, recast: 180, duration: 300, access: "main", kind: "trance", tp: 0, merit: true, effect: "Merit. Not unlocked. Would cut physical damage taken and block steps." },
  { name: "No Foot Rise", level: 75, recast: 180, duration: 0, access: "main", kind: "trance", tp: 0, merit: true, effect: "Merit. Not unlocked. Would grant finishing moves at once." },
];

export const DNC_TRAITS: readonly DncTrait[] = [
  { name: "Evasion Bonus", level: 15, access: "sub", effect: "Evasion +10. The next tier replaces this." },
  { name: "Dual Wield", level: 20, access: "sub", effect: "Delay −10% while both hands hold a one-handed weapon. The next tier replaces this." },
  { name: "Resist Slow", level: 20, access: "sub", effect: "Slow resistance +10%. The next tier replaces this." },
  { name: "Subtle Blow", level: 25, access: "sub", effect: "Subtle Blow +5. The next tier replaces this." },
  { name: "Accuracy Bonus", level: 30, access: "sub", effect: "Accuracy +10, melee and ranged. The next tier replaces this." },
  { name: "Dual Wield II", level: 40, access: "sub", effect: "Delay −15%. Replaces Dual Wield. A level-37 subjob has not learned it." },
  { name: "Evasion Bonus II", level: 45, access: "sub", effect: "Evasion +22. Replaces Evasion Bonus. A level-37 subjob has not learned it." },
  { name: "Subtle Blow II", level: 45, access: "sub", effect: "Subtle Blow +10. Replaces Subtle Blow. A level-37 subjob has not learned it." },
  { name: "Skillchain Bonus", level: 45, access: "sub", effect: "Catalogued. No skillchain damage term reads it yet. A level-37 subjob has not learned it." },
  { name: "Damage Limit+", level: 45, access: "sub", effect: "Physical damage limit +26/256. A level-37 subjob has not learned it. II is 90." },
  { name: "Resist Slow II", level: 55, access: "master-sub", effect: "Slow resistance +15%. Replaces Resist Slow. A normal subjob has not learned it." },
  { name: "Skillchain Bonus II", level: 58, access: "master-sub", effect: "Catalogued. No skillchain damage term reads it yet. A normal subjob has not learned it." },
  { name: "Dual Wield III", level: 60, access: "main", effect: "Delay −25%. Replaces Dual Wield II. Main job only." },
  { name: "Accuracy Bonus II", level: 60, access: "main", effect: "Accuracy +22. Replaces Accuracy Bonus. Main job only." },
  { name: "Subtle Blow III", level: 65, access: "main", effect: "Subtle Blow +15. Replaces Subtle Blow II. Main job only." },
  { name: "Skillchain Bonus III", level: 71, access: "main", effect: "Catalogued. No skillchain damage term reads it yet. Main job only." },
  { name: "Evasion Bonus III", level: 75, access: "main", effect: "Evasion +35. Replaces Evasion Bonus II. Main job only." },
  { name: "Closed Position", level: 75, access: "main", merit: true, effect: "Merit trait. Not unlocked. Would add accuracy and evasion while you face the target." },
];

export const DNC_SKILLS: readonly DncSkill[] = [
  { name: "Dagger", rank: "A+" },
  { name: "Hand-to-Hand", rank: "D" },
  { name: "Sword", rank: "D" },
  { name: "Throwing", rank: "C+" },
  { name: "Evasion", rank: "B+" },
  { name: "Parrying", rank: "B" },
];

const DNC_BY_NAME = new Map(DNC_ABILITIES.map((ability) => [ability.name, ability]));

export function dncAbility(name: string): DncAbility | undefined {
  return DNC_BY_NAME.get(name);
}

export type DncCastCtx = {
  recastLeft: number;
  dncLevel: number;
  dncMain: boolean;
  tp: number;
  finishing: number;
  trance: boolean;
  contradance: boolean;
  targeted: boolean;
  distance: number;
  chr: number;
  vit: number;
  /** A party member is the target. Self ignores range. */
  ally?: boolean;
  /** "self", "player", or a trust id. The waltz is centered here. */
  waltzCenter?: string;
  /** 0–100 melee hit chance. Omitted cannot land a step or a hitting flourish. */
  hitChance?: number;
  /** 0–1. Omitted is a miss. */
  hitRoll?: number;
  /** Current stack of the daze this step would refresh. */
  dazeLevel?: number;
  /** Seconds still left on that daze. */
  dazeLeft?: number;
  /** A skillchain or burst is already open. Wild Flourish then has no effect. */
  chainOpen?: boolean;
  /** 0–1. Omitted is the middle of the 1–7 second stun band. */
  stunRoll?: number;
  /** Sneak is already up. Spectral Jig then does nothing. */
  sneak?: boolean;
  /** Flee overwrites Quickening, so a chocobo jig does not land. */
  flee?: boolean;
};

export type DncCast = {
  ok: boolean;
  text: string;
  recast?: number;
  share?: string[];
  buff?: { name: string; duration: number; power?: number };
  replaces?: string[];
  hate?: { ce: number; ve: number };
  claims?: boolean;
  heal?: number;
  partyHeal?: boolean;
  tpSpend?: number;
  tpGrant?: number;
  stun?: boolean;
  stunSeconds?: number;
  eraseOne?: boolean;
  weight?: boolean;
  jig?: "spectral" | "chocobo" | "chocobo2";
  daze?: { name: string; seconds: number; level?: number; cap?: number; evaDown?: number; defenseCut?: number; mevaDown?: number; text: string };
  /** Finishing moves left after a flourish. 0 removes the stack. */
  finishingLeft?: number;
  /** The store heals or cleanses. HP uses each receiver's VIT. */
  waltz?: DncWaltz;
  /** Which flourish just landed, so the yard can show it. */
  flourish?: "animated" | "desperate" | "violent" | "reverse" | "building" | "wild";
  /** Violent Flourish connected. The store deals one non-crit hit. */
  strike?: boolean;
  /** Wild Flourish put Chainbound on the foe. */
  chainbound?: boolean;
};

export type DncWaltz = {
  name: string;
  kind: "cure" | "divine" | "healing";
  main: boolean;
  chr: number;
  contradance: boolean;
  center: string;
  aoe?: boolean;
};

function others(names: readonly string[], name: string): string[] {
  return names.filter((row) => row !== name);
}

function missRoll(ctx: DncCastCtx): boolean {
  const chance = ctx.hitChance ?? 0;
  const roll = ctx.hitRoll ?? 1;
  return roll >= chance / 100;
}

function flourishMiss(ctx: DncCastCtx, chance: number): boolean {
  const roll = ctx.hitRoll ?? 1;
  return roll >= chance / 100;
}

function stepMiss(ctx: DncCastCtx): boolean {
  const roll = ctx.hitRoll ?? 1;
  return roll >= stepHitRate(ctx.hitChance ?? 0) / 100;
}

export function castDancer(name: string, ctx: DncCastCtx): DncCast | null {
  const ability = DNC_BY_NAME.get(name);
  if (!ability) return null;
  if (ability.merit) return { ok: false, text: `${ability.name} is not unlocked.` };
  if (ctx.dncLevel < ability.level) return { ok: false, text: `${name} is not learned.` };
  if (ability.access === "main" && !ctx.dncMain) return { ok: false, text: `${name} requires Dancer as the main job.` };
  if (ability.access === "master-sub" && !ctx.dncMain) return { ok: false, text: `${name} needs a master-level subjob.` };
  if (ctx.recastLeft > 0) return { ok: false, text: `${ability.name} is not ready.` };
  const tp = ctx.trance && (ability.kind === "waltz" || ability.kind === "step" || ability.kind === "samba") ? 0 : ability.tp;
  if ((ctx.tp ?? 0) < tp) return { ok: false, text: `${ability.name} needs ${tp} TP.` };
  const share = ability.kind === "step" ? others(STEPS, name)
    : ability.kind === "samba" ? others(SAMBAS, name)
    : ability.kind === "waltz" ? waltzShare(name)
    : ability.kind === "flourish" ? others(FLOURISH_I, name)
    : ability.kind === "flourish2" ? others(FLOURISH_II, name)
    : ability.kind === "jig" ? others(JIGS, name)
    : undefined;
  const spent = tp > 0 ? { tpSpend: tp } : {};
  if (ability.kind === "trance") {
    return { ok: true, text: `${ability.name}. Dances and steps cost no TP.`, recast: ability.recast, buff: { name: ability.name, duration: ability.duration }, ...spent };
  }
  if (ability.kind === "contradance") {
    return { ok: true, text: "Contradance. The next curing or divine waltz is doubled. Healing Waltz becomes a 10' area.", recast: ability.recast, buff: { name: ability.name, duration: ability.duration }, ...spent };
  }
  if (ability.kind === "jig") {
    const hate = { hate: { ce: 1, ve: 300 }, claims: ctx.targeted === true };
    if (name === "Spectral Jig") {
      if (ctx.sneak) {
        return { ok: true, text: "Spectral Jig has no effect. Sneak is already up.", recast: ability.recast, share, ...spent };
      }
      return {
        ok: true,
        text: "Spectral Jig. Sneak and Invisible for 3 minutes.",
        recast: ability.recast,
        share,
        jig: "spectral",
        ...hate,
        ...spent,
      };
    }
    if (ctx.flee) {
      return { ok: true, text: `${name} has no effect. Flee is already up.`, recast: ability.recast, share, ...spent };
    }
    const area = name === "Chocobo Jig II";
    return {
      ok: true,
      text: area
        ? "Chocobo Jig II. Party members inside 10' move 20% faster. Weight comes off."
        : "Chocobo Jig. Movement +20%. Weight comes off.",
      recast: ability.recast,
      share,
      jig: area ? "chocobo2" : "chocobo",
      buff: { name: "Chocobo Jig", duration: ability.duration },
      ...hate,
      ...spent,
    };
  }
  if (ability.kind === "samba") {
    const daze = sambaDaze(name);
    return {
      ok: true,
      text: `${name}. The next melee hit puts ${daze} on the foe for ${SAMBA_DAZE_SECONDS} seconds.`,
      recast: ability.recast,
      share,
      replaces: others(SAMBAS, name),
      buff: { name, duration: ability.duration },
      hate: { ce: 1, ve: 300 },
      claims: ctx.targeted === true,
      ...spent,
    };
  }
  if (ability.kind === "waltz") {
    if (ctx.ally && ctx.distance > waltzRange(name)) return { ok: false, text: `${name} is out of range.` };
    const wide = name === "Healing Waltz" && ctx.contradance === true;
    const spentWaltz = { ...spent, replaces: ctx.contradance ? ["Contradance"] : undefined };
    if (name === "Healing Waltz") {
      return {
        ok: true,
        text: wide
          ? "Healing Waltz. Contradance makes it a 10' area. One ailment comes off each party member inside it."
          : "Healing Waltz. One ailment is removed.",
        recast: ability.recast,
        share,
        waltz: { name, kind: "healing", main: ctx.dncMain, chr: ctx.chr, contradance: wide, center: ctx.waltzCenter ?? "self", aoe: wide },
        ...spentWaltz,
      };
    }
    const heal = waltzHeal(name, ctx.chr, ctx.vit, ctx.contradance, ctx.dncMain);
    const doubled = ctx.contradance ? " Contradance doubles it." : "";
    const divine = name === "Divine Waltz";
    return {
      ok: true,
      text: divine ? `${name}. Party members inside 9.9' are healed.${doubled}` : `${name} restores ${heal} HP.${doubled}`,
      recast: ability.recast,
      share,
      heal,
      waltz: { name, kind: divine ? "divine" : "cure", main: ctx.dncMain, chr: ctx.chr, contradance: ctx.contradance === true, center: ctx.waltzCenter ?? "self" },
      ...spentWaltz,
    };
  }
  if (ability.kind === "step") {
    if (!ctx.targeted) return { ok: false, text: `${name} needs a target.` };
    if (ctx.distance > stepRange(name)) return { ok: false, text: `${name} is out of range.` };
    const hit = !stepMiss(ctx);
    const cap = dazeCap(ctx.dncMain);
    const current = Math.max(0, Math.floor(ctx.dazeLevel ?? 0));
    const next = hit ? Math.min(cap, Math.max(1, current + 1)) : current;
    const gain = finishingGain(hit, current >= cap, ctx.dncMain);
    const finishing = Math.min(FINISHING_CAP, ctx.finishing + gain);
    const seconds = stepSeconds(current, ctx.dazeLeft ?? (current > 0 ? STEP_SECONDS : 0));
    const hate = { hate: { ce: 1, ve: 0 }, claims: true };
    if (!hit) {
      return { ok: true, text: `${name} misses.`, recast: ability.recast, share, ...spent, ...hate };
    }
    const meva = weakenedMagicEvasion(next);
    const daze = name === "Quickstep"
      ? { name: "Lethargic Daze", seconds, level: next, cap, evaDown: lethargicEvasion(next), text: `Lethargic Daze ${next}. Evasion −${lethargicEvasion(next)}.` }
      : name === "Box Step"
      ? { name: "Sluggish Daze", seconds, level: next, cap, defenseCut: sluggishDefense(next), text: `Sluggish Daze ${next}. Defense −${Math.round(sluggishDefense(next) * 100)}%.` }
      : { name: "Weakened Daze", seconds, level: next, cap, mevaDown: meva, text: `Weakened Daze ${next}. Magic evasion −${meva}.` };
    return {
      ok: true,
      text: `${name} hits. ${daze.text} Finishing moves ${finishing}.`,
      recast: ability.recast,
      share,
      daze,
      buff: { name: "Finishing Move", duration: FINISHING_SECONDS, power: finishing },
      ...spent,
      ...hate,
    };
  }
  if (ctx.finishing < 1) return { ok: false, text: `${name} needs a finishing move.` };
  const selfHate = { hate: { ce: 1, ve: 0 } };
  if (name === "Reverse Flourish") {
    const gain = reverseTp(ctx.finishing);
    return {
      ok: true,
      text: `Reverse Flourish. ${ctx.finishing} finishing ${ctx.finishing === 1 ? "move becomes" : "moves become"} ${gain} TP.`,
      recast: ability.recast,
      share,
      tpGrant: gain,
      finishingLeft: 0,
      replaces: ["Finishing Move"],
      flourish: "reverse",
      ...selfHate,
      ...spent,
    };
  }
  if (name === "Building Flourish") {
    const spentMoves = Math.min(3, ctx.finishing);
    const bits = ["Accuracy +40"];
    if (spentMoves >= 2) bits.push("attack +25%");
    if (spentMoves >= 3) bits.push("critical hit rate +10%");
    return {
      ok: true,
      text: `Building Flourish. ${bits.join(", ")}. ${spentMoves} finishing ${spentMoves === 1 ? "move is" : "moves are"} spent.`,
      recast: ability.recast,
      share,
      buff: { name: "Building Flourish", duration: BUILDING_SECONDS, power: spentMoves },
      finishingLeft: ctx.finishing - spentMoves,
      flourish: "building",
      ...selfHate,
      ...spent,
    };
  }
  if (name === "Wild Flourish") {
    if (ctx.finishing < 2) return { ok: false, text: "Wild Flourish needs two finishing moves." };
    if (!ctx.targeted) return { ok: false, text: "Wild Flourish needs a target." };
    if (ctx.distance > WILD_RANGE) return { ok: false, text: "Wild Flourish is out of range." };
    const left = ctx.finishing - 2;
    const spentWild = { finishingLeft: left, hate: { ce: 1, ve: 0 }, claims: true as const, flourish: "wild" as const };
    if (ctx.chainOpen) {
      return { ok: true, text: "Wild Flourish. No effect.", recast: ability.recast, share, ...spentWild, ...spent };
    }
    if (missRoll(ctx)) {
      return { ok: true, text: "Wild Flourish misses.", recast: ability.recast, share, ...spentWild, ...spent };
    }
    return {
      ok: true,
      text: "Wild Flourish. Chainbound. The next weapon skill's first level 1 property skillchains.",
      recast: ability.recast,
      share,
      chainbound: true,
      ...spentWild,
      ...spent,
    };
  }
  if (name === "Animated Flourish") {
    if (!ctx.targeted) return { ok: false, text: "Animated Flourish needs a target." };
    if (ctx.distance > ANIMATED_RANGE) return { ok: false, text: "Animated Flourish is out of range." };
    const moved = animatedFlourish(ctx.finishing);
    return {
      ok: true,
      text: `Animated Flourish. Volatile enmity ${moved.ve}.`,
      recast: ability.recast,
      share,
      hate: { ce: 1, ve: moved.ve },
      claims: true,
      finishingLeft: ctx.finishing - moved.spent,
      flourish: "animated",
      ...spent,
    };
  }
  if (!ctx.targeted) return { ok: false, text: `${name} needs a target.` };
  if (ctx.distance > FLOURISH_RANGE) return { ok: false, text: `${name} is out of range.` };
  const after = Math.max(0, ctx.finishing - 1);
  if (name === "Violent Flourish") {
    const landed = !flourishMiss(ctx, violentHitChance(ctx.hitChance ?? 0));
    return {
      ok: true,
      text: landed ? "Violent Flourish hits." : "Violent Flourish misses.",
      recast: ability.recast,
      share,
      stun: landed,
      stunSeconds: landed ? violentStunSeconds(ctx.stunRoll ?? 0.5) : undefined,
      strike: landed,
      hate: { ce: 1, ve: 0 },
      claims: true,
      finishingLeft: after,
      flourish: "violent",
      ...spent,
    };
  }
  const weighed = !flourishMiss(ctx, desperateHitChance(ctx.hitChance ?? 0));
  return {
    ok: true,
    text: weighed ? "Desperate Flourish. Gravity lands." : "Desperate Flourish misses.",
    recast: ability.recast,
    share,
    weight: weighed,
    hate: { ce: 1, ve: 0 },
    claims: true,
    finishingLeft: after,
    flourish: "desperate",
    ...spent,
  };
}

export function assertDnc(): void {
  const naked = characterBase("hume", "DNC", 75);
  if (naked.hp !== 1046 || naked.mp !== 0 || naked.str !== 56 || naked.dex !== 61 || naked.vit !== 53 || naked.agi !== 65 || naked.int !== 48 || naked.mnd !== 48 || naked.chr !== 65) {
    throw new Error(`Hume DNC 75 ${naked.hp}/${naked.mp}/${naked.str}/${naked.dex}/${naked.vit}/${naked.agi}/${naked.int}/${naked.mnd}/${naked.chr}`);
  }
  const first = characterBase("hume", "DNC", 1);
  if (first.hp !== 28 || first.str !== 6 || first.dex !== 7 || first.agi !== 7 || first.chr !== 7 || first.int !== 5) {
    throw new Error(`Hume DNC 1 ${first.hp}/${first.str}/${first.dex}/${first.agi}/${first.chr}/${first.int}`);
  }
  if (skillCap("A+", 75) !== 276 || skillCap("D", 75) !== 210 || skillCap("C+", 75) !== 230 || skillCap("B+", 75) !== 256 || skillCap("B", 75) !== 250) {
    throw new Error("DNC skill caps");
  }
  if (dncDualWield(37, "sub") !== 0.1 || dncDualWield(75, "main") !== 0.25 || dncDualWield(45, "sub") !== 0.15) throw new Error("DNC dual wield");
  if (dncAccuracyBonus(37, "sub") !== 10 || dncAccuracyBonus(75, "main") !== 22) throw new Error("DNC accuracy");
  if (dncSubtleBlow(37, "sub") !== 5 || dncSubtleBlow(75, "main") !== 15) throw new Error("DNC subtle blow");
  if (dncEvasionBonus(37, "sub") !== 10 || dncEvasionBonus(75, "main") !== 35) throw new Error("DNC evasion");
  if (dncResistSlow(37, "sub") !== 0.1 || dncResistSlow(75, "main") !== 0.15 || dncResistSlow(75, "sub") !== 0.1) throw new Error("DNC resist slow");
  if (dncDamageLimit(37, "sub") !== 0 || dncDamageLimit(75, "main") !== 26 / 256) throw new Error("DNC damage limit");
  if (lethargicEvasion(1) !== 8 || lethargicEvasion(10) !== 44) throw new Error("lethargic");
  if (sluggishDefense(1) !== 0.05 || Math.abs(sluggishDefense(10) - 0.23) > 1e-9) throw new Error("sluggish");
  if (weakenedMagicEvasion(1) !== 3 || weakenedMagicEvasion(5) !== 15 || weakenedMagicEvasion(10) !== 30) throw new Error("weakened");
  if (stepHitRate(90) !== 95 || stepHitRate(99) !== 99 || stepHitRate(20) !== 25) throw new Error("step accuracy");
  if (stepSeconds(0, 0) !== 60 || stepSeconds(1, 10) !== 40 || stepSeconds(3, 100) !== 120) throw new Error("step duration");
  if (stepRange("Quickstep") !== 4.5 || stepRange("Stutter Step") !== 4.5 || stepRange("Box Step") !== 4.8) throw new Error("step range");
  if (waltzHeal("Curing Waltz", 65, 53, false) !== Math.floor((65 + 53) / 4) + 60) throw new Error("curing waltz");
  if (waltzHeal("Curing Waltz", 65, 53, true) !== (Math.floor((65 + 53) / 4) + 60) * 2) throw new Error("contradance");
  if (reverseTp(1) !== 100 || reverseTp(5) !== 600 || reverseTp(0) !== 0) throw new Error("reverse flourish");
  if (drainFromHit("Drain Samba", 1024, 100) !== 30 || drainFromHit("Drain Samba", 183, 100) !== 5 || drainFromHit("Drain Samba", 183, 1) !== 0) throw new Error("drain samba");
  if (drainFromHit("Drain Samba II", 183, 100) !== 14 || drainFromHit("Drain Samba III", 183, 40) !== 25) throw new Error("drain samba tiers");
  if (aspirFromHit("Aspir Samba", 240, 100) !== 4 || aspirFromHit("Aspir Samba II", 480, 100) !== 14 || aspirFromHit("Aspir Samba", 240, 1) !== 0) throw new Error("aspir samba");
  const sub = { recastLeft: 0, dncLevel: 37, dncMain: false, tp: 3000, finishing: 0, trance: false, contradance: false, targeted: true, distance: 2, chr: 40, vit: 40, hitChance: 100, hitRoll: 0 };
  if (castDancer("Trance", { ...sub, dncLevel: 75 })?.ok) throw new Error("Trance sub");
  if (castDancer("Stutter Step", sub)?.ok) throw new Error("Stutter Step sub");
  if (castDancer("Contradance", { ...sub, dncLevel: 75 })?.ok) throw new Error("Contradance sub");
  if (castDancer("Saber Dance", { ...sub, dncLevel: 75, dncMain: true })?.ok) throw new Error("Saber Dance merit");
  const step = castDancer("Quickstep", sub);
  if (!step?.ok || step.daze?.evaDown !== 8 || step.buff?.power !== 1) throw new Error("sub Quickstep");
  const main = { ...sub, dncLevel: 75, dncMain: true, chr: 65, vit: 53 };
  const samba = castDancer("Drain Samba", { ...main, tp: 100 });
  if (!samba?.ok || samba.tpSpend !== 100 || samba.buff?.duration !== 120 || samba.hate?.ve !== 300 || sambaDaze("Drain Samba") !== "Drain Daze") throw new Error("Drain Samba cast");
  if (castDancer("Drain Samba", { ...main, tp: 90 })?.ok) throw new Error("Drain Samba TP");
  const tranceSamba = castDancer("Aspir Samba", { ...main, tp: 0, trance: true });
  if (!tranceSamba?.ok || tranceSamba.tpSpend) throw new Error("Trance samba");
  const haste = castDancer("Haste Samba", main);
  if (haste?.tpSpend !== 350 || haste.buff?.duration !== 90) throw new Error("Haste Samba cost");
  const third = castDancer("Drain Samba III", main);
  if (third?.tpSpend !== 400 || third.buff?.duration !== 90 || sambaDaze("Drain Samba III") !== "Drain Daze") throw new Error("Drain Samba III");
  const quick = castDancer("Quickstep", main);
  if (!quick?.ok || quick.buff?.power !== 2 || quick.daze?.evaDown !== 8 || quick.tpSpend !== 100) throw new Error("Quickstep");
  const again = castDancer("Quickstep", { ...main, finishing: 2, dazeLevel: 10 });
  if (again?.buff?.power !== 3 || again.daze?.evaDown !== 44 || again.daze?.seconds !== 90) throw new Error("capped Quickstep");
  const extended = castDancer("Quickstep", { ...main, dazeLevel: 1, dazeLeft: 10, finishing: 2 });
  if (extended?.daze?.seconds !== 40 || extended.daze?.level !== 2 || extended.buff?.power !== 4) throw new Error("step extend");
  const boxed = castDancer("Box Step", { ...main, dazeLevel: 9, dazeLeft: 100 });
  if (Math.round((boxed?.daze?.defenseCut ?? 0) * 100) !== 23 || boxed?.daze?.seconds !== 120) throw new Error("box step cap");
  const stutter = castDancer("Stutter Step", main);
  if (stutter?.daze?.mevaDown !== 3 || stutter.daze?.level !== 1 || stutter.hate?.ce !== 1 || stutter.hate?.ve !== 0 || stutter.claims !== true) throw new Error("stutter step");
  const stutterTop = castDancer("Stutter Step", { ...main, dazeLevel: 9 });
  if (stutterTop?.daze?.mevaDown !== 30 || stutterTop.buff?.power !== 2) throw new Error("stutter step ten");
  const farStep = castDancer("Quickstep", { ...main, distance: 4.6 });
  if (farStep?.ok) throw new Error("quickstep range");
  const boxReach = castDancer("Box Step", { ...main, distance: 4.6 });
  if (!boxReach?.ok) throw new Error("box step range");
  const edged = castDancer("Quickstep", { ...main, hitChance: 90, hitRoll: 0.94 });
  if (!edged?.daze) throw new Error("step accuracy land");
  const steppedMiss = castDancer("Quickstep", { ...main, hitChance: 90, hitRoll: 0.95 });
  if (!steppedMiss?.ok || steppedMiss.daze || steppedMiss.buff) throw new Error("step accuracy miss");
  const trance = castDancer("Curing Waltz", { ...main, tp: 0, trance: true });
  if (!trance?.ok || trance.tpSpend) throw new Error("Trance waltz");
  const poor = castDancer("Curing Waltz", { ...main, tp: 100 });
  if (poor?.ok) throw new Error("waltz TP");
  const heal = castDancer("Curing Waltz", { ...main, contradance: true });
  if (heal?.heal !== waltzHeal("Curing Waltz", 65, 53, true) || !heal.replaces?.includes("Contradance")) throw new Error("doubled waltz");
  if (waltzHeal("Curing Waltz III", 65, 53, false) !== 358) throw new Error("curing waltz iii");
  if (waltzHeal("Curing Waltz IV", 65, 53, false) !== 568) throw new Error("curing waltz iv");
  if (waltzHeal("Curing Waltz II", 40, 40, false, false) !== 150) throw new Error("sub curing waltz ii");
  if (waltzHeal("Curing Waltz", 65, 53, false, false) !== 74) throw new Error("sub curing waltz");
  const four = castDancer("Curing Waltz IV", main);
  if (four?.recast !== 13 || four.tpSpend !== 650 || four.heal !== 568) throw new Error("curing waltz iv cast");
  if (!four?.share?.includes("Curing Waltz") || !four.share.includes("Curing Waltz II") || !four.share.includes("Curing Waltz III") || four.share.includes("Divine Waltz") || four.share.includes("Healing Waltz")) throw new Error("curing share");
  const divine = castDancer("Divine Waltz", { ...main, distance: 30 });
  if (!divine?.ok || divine.share?.length || divine.heal !== waltzHeal("Divine Waltz", 65, 53, false)) throw new Error("self divine");
  const healing = castDancer("Healing Waltz", { ...main, contradance: true, waltzCenter: "player" });
  if (healing?.waltz?.kind !== "healing" || healing.waltz.aoe !== true || healing.waltz.center !== "player" || !healing.replaces?.includes("Contradance") || healing.heal) throw new Error("healing contradance");
  if (healing.share?.length) throw new Error("healing share");
  const far = castDancer("Curing Waltz", { ...main, ally: true, distance: 21 });
  if (far?.ok) throw new Error("ally waltz range");
  const farDivine = castDancer("Divine Waltz", { ...main, ally: true, distance: 10.8 });
  if (farDivine?.ok) throw new Error("divine range");
  if (!healingWaltzRemoves("Curse") || !healingWaltzRemoves("Poison") || healingWaltzRemoves("Doom") || healingWaltzRemoves("Amnesia") || healingWaltzRemoves("Elegy") || healingWaltzRemoves("Helix") || healingWaltzRemoves("Stun")) throw new Error("healing list");
  const reverse = castDancer("Reverse Flourish", { ...main, finishing: 5 });
  if (reverse?.tpGrant !== 600 || !reverse.replaces?.includes("Finishing Move") || reverse.hate?.ce !== 1 || reverse.flourish !== "reverse") throw new Error("Reverse Flourish cast");
  const none = castDancer("Reverse Flourish", main);
  if (none?.ok) throw new Error("Reverse Flourish empty");
  const one = castDancer("Reverse Flourish", { ...main, finishing: 1 });
  if (one?.tpGrant !== 100 || !one.share?.includes("Building Flourish") || !one.share?.includes("Wild Flourish")) throw new Error("Reverse Flourish share");
  const animated = castDancer("Animated Flourish", { ...main, finishing: 1 });
  if (animated?.hate?.ve !== 1000 || animated.finishingLeft !== 0 || animated.recast !== 30 || !animated.share?.includes("Desperate Flourish") || !animated.share?.includes("Violent Flourish")) throw new Error("Animated Flourish one");
  const animatedTwo = castDancer("Animated Flourish", { ...main, finishing: 5 });
  if (animatedTwo?.hate?.ve !== 1500 || animatedTwo.finishingLeft !== 3) throw new Error("Animated Flourish two");
  const animatedFar = castDancer("Animated Flourish", { ...main, finishing: 1, distance: 17.7 });
  if (animatedFar?.ok) throw new Error("Animated Flourish range");
  const building = castDancer("Building Flourish", { ...main, finishing: 5 });
  if (building?.buff?.power !== 3 || building.finishingLeft !== 2 || building.recast !== 10 || !building.share?.includes("Reverse Flourish")) throw new Error("Building Flourish");
  const wildShort = castDancer("Wild Flourish", { ...main, finishing: 1 });
  if (wildShort?.ok) throw new Error("Wild Flourish one");
  const wild = castDancer("Wild Flourish", { ...main, finishing: 5, hitRoll: 0 });
  if (!wild?.chainbound || wild.finishingLeft !== 3 || wild.buff || wild.recast !== 30) throw new Error("Wild Flourish");
  const wildMiss = castDancer("Wild Flourish", { ...main, finishing: 2, hitRoll: 1 });
  if (!wildMiss?.ok || wildMiss.chainbound || wildMiss.finishingLeft !== 0) throw new Error("Wild Flourish miss");
  const wildBusy = castDancer("Wild Flourish", { ...main, finishing: 2, hitRoll: 0, chainOpen: true });
  if (!wildBusy?.ok || wildBusy.chainbound || wildBusy.text !== "Wild Flourish. No effect.") throw new Error("Wild Flourish open");
  const wildFar = castDancer("Wild Flourish", { ...main, finishing: 2, distance: 5 });
  if (wildFar?.ok) throw new Error("Wild Flourish range");
  const miss = castDancer("Violent Flourish", { ...main, finishing: 1, hitRoll: 1 });
  if (!miss?.ok || miss.stun || miss.strike) throw new Error("Violent Flourish miss");
  const stun = castDancer("Violent Flourish", { ...main, finishing: 1, hitRoll: 0 });
  if (!stun?.stun || stun.stunSeconds !== 4 || !stun.strike) throw new Error("Violent Flourish");
  if (violentStunSeconds(0) !== 1 || violentStunSeconds(0.5) !== 4 || violentStunSeconds(0.999) !== 7) throw new Error("stun band");
  const violentEdge = castDancer("Violent Flourish", { ...main, finishing: 1, hitChance: 20, hitRoll: 0.7 });
  if (violentEdge?.strike) throw new Error("violent accuracy");
  const violentHit = castDancer("Violent Flourish", { ...main, finishing: 1, hitChance: 20, hitRoll: 0.69 });
  if (!violentHit?.strike) throw new Error("violent accuracy hit");
  const heavy = castDancer("Desperate Flourish", { ...main, finishing: 1, hitChance: 50, hitRoll: 0.34 });
  if (!heavy?.weight) throw new Error("desperate hit");
  const heavyMiss = castDancer("Desperate Flourish", { ...main, finishing: 1, hitChance: 50, hitRoll: 0.35 });
  if (heavyMiss?.weight) throw new Error("desperate miss");
  const subWild = castDancer("Wild Flourish", { ...sub, dncLevel: 75, finishing: 5 });
  if (subWild?.ok) throw new Error("Wild Flourish sub");
  const spectral = castDancer("Spectral Jig", main);
  if (!spectral?.ok || spectral.jig !== "spectral" || spectral.recast !== 30 || spectral.buff || spectral.hate?.ce !== 1 || spectral.hate.ve !== 300 || !spectral.share?.includes("Chocobo Jig") || !spectral.share.includes("Chocobo Jig II")) {
    throw new Error("Spectral Jig");
  }
  const blocked = castDancer("Spectral Jig", { ...main, sneak: true });
  if (!blocked?.ok || blocked.jig || blocked.buff || blocked.hate || blocked.recast !== 30) throw new Error("Spectral Jig while Sneak is up");
  const jig = castDancer("Chocobo Jig", main);
  if (!jig?.ok || jig.jig !== "chocobo" || jig.buff?.name !== "Chocobo Jig" || jig.buff.duration !== 120 || jig.recast !== 60 || !jig.share?.includes("Spectral Jig")) {
    throw new Error("Chocobo Jig");
  }
  const fleeing = castDancer("Chocobo Jig", { ...main, flee: true });
  if (!fleeing?.ok || fleeing.jig || fleeing.buff || fleeing.recast !== 60) throw new Error("Chocobo Jig under Flee");
  const subJig = castDancer("Chocobo Jig", { ...sub, dncLevel: 37 });
  if (subJig?.ok) throw new Error("Chocobo Jig sub");
  const jig2 = castDancer("Chocobo Jig II", main);
  if (!jig2?.ok || jig2.jig !== "chocobo2" || jig2.buff?.duration !== 120 || jig2.recast !== 60) throw new Error("Chocobo Jig II");
  if (castDancer("Chocobo Jig II", { ...sub, dncLevel: 75 })?.ok) throw new Error("Chocobo Jig II sub");
  if (DNC_SKILLS.map((skill) => skill.name).join(",") !== "Dagger,Hand-to-Hand,Sword,Throwing,Evasion,Parrying") throw new Error("DNC skills");
}
