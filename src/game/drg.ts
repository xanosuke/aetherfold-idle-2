/**
 * Retail Dragoon toolkit through level 75. No merits and no job points.
 *
 * A support job here is level 37. Ancient Circle, Jump, Spirit Link, and
 * High Jump are inside that. Call Wyvern, Spirit Surge, Dismiss, and
 * Spirit Bond are main only. Super Jump is 50, which a master-level sub
 * could reach. This kit has no master levels, so only a main Dragoon
 * uses it. Deep Breathing and Angon are merits, so they stay locked.
 * Spirit Jump and everything after it are past 75.
 *
 * Traits through level 45 are a normal subjob's, except Smite, Strafe II,
 * Conserve TP, and Weapon Skill Damage Boost, which all start at 40 or 45
 * and are therefore not on a level-37 sub. From Strafe III up, the
 * Accuracy Bonus II and Damage Limit+ II tiers are main only. Empathy at
 * 75 is a base trait. Its merit ranks are not unlocked.
 *
 * Attack Bonus stays at +10. The next tier is level 91. Accuracy Bonus II
 * is +22. Damage Limit+ II is +51/256. Smite I is +25/256 on a two-handed
 * weapon, so the Harpoon gets it. Strafe's printed breath accuracy was not
 * on the job page. This yard uses +10 / +20 / +30. Conserve TP's rate and
 * Weapon Skill Damage Boost's percent were not printed, so neither is rolled.
 *
 * Naked Hume Dragoon grades, with no subjob: level 75 is 1167 HP, 0 MP,
 * STR 61, DEX 53, VIT 61, AGI 53, INT 48, MND 53, CHR 61.
 *
 * The model wears Drachen armor, the artifact set: Armet, Mail, Finger
 * Gauntlets, Brais, and Greaves. Cobalt scale, a pale crest, steel edges,
 * and a gold trim. The pieces are not equipped, so their stat lines are
 * not on the sheet. The polearm in the hands is the equipped weapon.
 * The Harpoon stands in.
 *
 * Current BG-Wiki letters, through this repo's level-75 skill cap:
 * Polearm A+ 276, Staff B− 240, Sword C− 220, Dagger E 200, Club E 200,
 * Parrying C 225, Evasion B− 240. Classic 75 charts called Evasion C−.
 * This kit uses the current letter.
 *
 * The Tropical Rarab is a rabbit, not a dragon. Dragon Killer and Ancient
 * Circle are on the sheet and in the log, and they do not change the fight.
 *
 * The wyvern's printed level-75 combat line, before the experience
 * parameter increase this yard does not track: 1066 HP, attack 331,
 * accuracy 362, defense 349, evasion 294. Defense is then +50%.
 * Damage taken is −40% before other pet reductions, and it stops at
 * −87.5%. Delay is 320. A connecting bite adds that delay's TP, 95,
 * and the bar stops at 3000. A physical hit taken adds one third of the
 * attacker's delay TP. A magical hit that deals its opening damage adds 50.
 * Healing Breath spends the whole bar. TP is not required to use it.
 * FFXIclopedia's July 2008 level-75 sheet uses the old 0–300 TP scale,
 * so 300 there is 3000 now. A full bar multiplies only the max-HP term
 * by 1 + 155/537. The flat base stays outside that product. The sheet
 * only prints the empty bar and the full bar, so the steps between are
 * linear. Helm, wyvern XP, HP gear, and Deep Breathing are columns on
 * that sheet and are not equipped here. Elemental Breath does not feed the foe,
 * and its damage is not affected by TP. It does spend the bar. FFXIclopedia
 * says the accuracy may rise, and a 2012 test says the bar raises magic
 * accuracy rather than the hit. Current BG prints that current HP affects
 * breath accuracy, and that a magic burst's accuracy bonus is undetermined.
 * Neither rate is printed. Weapon skills that say accuracy or effect
 * accuracy varies with TP leave the 1000, 2000, and 3000 cells blank, so
 * this yard does not invent a slope. Removal Breath spends the bar and
 * gains nothing from it. A breath that does not fire does not spend it.
 * The swing is slashing. Attack Bonus and
 * Accuracy Bonus are already inside those attack and accuracy numbers.
 * Subtle Blow is listed, and neither its level nor its amount is printed,
 * so a bite does not reduce the hare's TP. Strafe on the pet is the same
 * trait as the dragoon's. It is not added a second time.
 * The pet's base weapon damage is not on that table, so a connecting
 * bite still uses the yard's swing stand-in. Dragon Killer would multiply
 * it. The hare is not a dragon.
 *
 * Elemental breath damage is floor(floor(current HP / 6) + 15). No job
 * points, no breath gear, and Deep Breathing is locked, so those terms
 * stay out. TP does not change that hit. The accuracy bonus is not printed.
 * Healing Breath is floor(max HP × value / 256 × (1 + tpBonus) + base):
 * 35/256 + 8, then 48/256 + 24, then 55/256 + 42. tpBonus is (TP / 3000) × 155/537.
 * At 0 TP that is the current BG amount. Healing Breath IV is level 80.
 * The breath page's magic-burst accuracy bonus is not printed. A matching
 * element still uses the general burst step, 1.2 + 0.05 × weapon skills
 * in the chain. Two steps is 1.3. The hare's breath resistance rank is
 * not published, so a hit is not fractioned further. Strafe's printed
 * accuracy was not on the job page. Conserve TP's rate and Weapon Skill
 * Damage Boost's percent were not printed, so neither is rolled.
 *
 * Spirit Bond splits the wyvern's damage evenly. The dragoon's half is
 * not reduced by the dragoon's damage taken or Phalanx. Stoneskin can
 * absorb it. Healing Breath also heals the wyvern at full potency, and
 * the buff stays up. When the wyvern holds the hate, the hare's bite uses
 * the printed defense, evasion, and −40% damage taken, then this split.
 *
 * Spirit Link costs 12–17% of current HP and cannot knock you out.
 * Stoneskin is spent first. The heal is (HP lost + MND + wyvern level × 0.7) × 2.
 * The wyvern also gains Regen of floor(level / 3) for 90 seconds.
 * Empathy merits, which would allow the link at full HP, are not unlocked.
 */

import { skillCap, type SkillRank } from "./skills";
import { characterBase, type JobId } from "./stats";
import type { JobAccess } from "./blm";

export const DRG_CAP = 75;

/** Jump's reach. High Jump and Super Jump step out from this. */
export const JUMP_RANGE = 9.5;
export const HIGH_JUMP_RANGE = 11.5;
export const SUPER_JUMP_RANGE = 12.5;

/** Spirit Surge's attack and defense bonus. 25% is 64/256. */
export const SPIRIT_SURGE_NUMER = 64;

/** Accuracy while Spirit Surge is up. */
export const SPIRIT_SURGE_ACC = 50;

/** The wyvern's attack and defense aura. About 10%, as 26/256. No job-point double attack. */
export const WYVERN_AURA = 26;

/**
 * Printed level-75 wyvern line, before the experience parameter increase.
 * Attack and accuracy already include Attack Bonus I and Accuracy Bonus II.
 * Defense on the table is before the innate +50%.
 */
export const WYVERN_HP = 1066;
export const WYVERN_ATTACK = 331;
export const WYVERN_ACCURACY = 362;
export const WYVERN_DEFENSE = 349;
export const WYVERN_DEFENSE_BONUS = 0.5;
export const WYVERN_EVASION = 294;
/** Innate damage taken, before other pet reductions. The cap with those is −87.5%. */
export const WYVERN_DAMAGE_TAKEN = 0.4;
/** Attack delay. 60 delay is one second. The swing is slashing. */
export const WYVERN_DELAY = 320;
/** Healing Breath's reach from the wyvern. */
export const BREATH_RANGE = 14;

/**
 * Defensive: Remove Breath after a weapon skill, Healing Breath after a spell.
 * Hybrid: elemental breath after a weapon skill, Healing Breath on you only.
 * Blue Mage, Scholar, Geomancer, and Rune Fencer are not jobs in this yard.
 * The current type table includes Summoner with the defensive wyverns that cure.
 */
const DEFENSIVE_SUBS: readonly JobId[] = ["WHM", "BLM", "RDM", "SMN"];
const HYBRID_SUBS: readonly JobId[] = ["PLD", "DRK", "BRD", "NIN"];

export const BREATHS = ["Flame", "Frost", "Gust", "Hydro", "Lightning", "Sand"] as const;
export type BreathName = (typeof BREATHS)[number];
export type WyvernKind = "offense" | "defensive" | "hybrid";

/** Tie-break when resistances are equal: Fire, Ice, Wind, Earth, Thunder, Water. */
const BREATH_ORDER: readonly { element: string; name: BreathName }[] = [
  { element: "fire", name: "Flame" },
  { element: "ice", name: "Frost" },
  { element: "wind", name: "Gust" },
  { element: "earth", name: "Sand" },
  { element: "thunder", name: "Lightning" },
  { element: "water", name: "Hydro" },
];

export function breathElement(name: BreathName): string {
  return BREATH_ORDER.find((row) => row.name === name)?.element ?? "fire";
}

export type DrgAbility = {
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

export type DrgTrait = {
  name: string;
  level: number;
  access: JobAccess;
  effect: string;
};

export type DrgSkill = {
  name: string;
  rank: SkillRank;
};

export function drgJobLevel(job: JobId, sub: JobId | null, subLevel: number, mainLevel: number): number {
  if (job === "DRG") return mainLevel;
  if (sub === "DRG") return subLevel;
  return 0;
}

/** Attack Bonus I is +10 at 10. Attack Bonus II is 91, so 75 stays at +10. */
export function drgAttackBonus(level: number): number {
  return level >= 10 ? 10 : 0;
}

/**
 * Strafe, breath magic accuracy. The job page did not print the amounts.
 * This yard uses +10 at 20, +20 at 40, and +30 at 60. The 60 tier is main only.
 * A level-37 subjob has the first tier.
 */
export function strafe(level: number, access: JobAccess): number {
  if (access === "main" && level >= 60) return 30;
  if (level >= 40) return 20;
  if (level >= 20) return 10;
  return 0;
}

/** Dragon Killer I is 8% at 25. The Tropical Rarab is not a dragon, so it is not rolled. */
export function dragonKiller(level: number): number {
  return level >= 25 ? 0.08 : 0;
}

/**
 * Accuracy Bonus. I +10 at 30. II +22 at 60, main only. III is 76.
 * A level-37 subjob has the first tier.
 */
export function drgAccuracyBonus(level: number, access: JobAccess): number {
  if (access === "main" && level >= 60) return 22;
  if (level >= 30) return 10;
  return 0;
}

/**
 * Damage Limit+ added to the physical pDIF cap. It does not raise the rolled pDIF.
 * I +26/256 at 30. II +51/256 at 60, main only. III is 90.
 */
export function drgDamageLimit(level: number, access: JobAccess): number {
  if (access === "main" && level >= 60) return 51 / 256;
  if (level >= 30) return 26 / 256;
  return 0;
}

/**
 * Smite's attack bonus, in /256. Hand-to-hand or two-handed only.
 * I is +25 at 40. II is 80. A level-37 subjob has not learned it.
 */
export function drgSmiteNumer(level: number): number {
  return level >= 40 ? 25 : 0;
}

/** Empathy. Main Dragoon 75. Spirit Link copies one beneficial effect. Merit ranks are not unlocked. */
export function empathy(level: number, access: JobAccess): boolean {
  return access === "main" && level >= 75;
}

/** Spirit Surge's STR gift. 1 + floor(level / 5). Level 75 is +16. Attack includes that STR. */
export function spiritSurgeStr(level: number): number {
  return 1 + Math.floor(Math.max(0, level) / 5);
}

/** Ancient Circle against dragons. Main 15%. Sub 5%. The hare is not a dragon. */
export function ancientCircleBonus(main: boolean): number {
  return main ? 0.15 : 0.05;
}

/**
 * Jump damage. floor((weapon damage + fSTR) × (1 + VIT / 256)).
 * One hit. The Harpoon is a single swing, so the VIT term applies once.
 */
export function jumpDamage(dmg: number, fstr: number, vit: number): number {
  const base = Math.max(0, dmg) + fstr;
  return Math.max(0, Math.floor(base * (1 + Math.max(0, vit) / 256)));
}

/** High Jump. A normal weapon hit's damage and fSTR, without Jump's VIT term and without a pDIF roll. */
export function highJumpDamage(dmg: number, fstr: number): number {
  return Math.max(0, Math.floor(Math.max(0, dmg) + fstr));
}

/**
 * Spirit Link's HP price. 12–17% of current HP.
 * `roll` is 0–1. 0 is 12%. 1 is 17%. It cannot drop you to 0.
 */
export function spiritLinkCost(hp: number, roll = 0): number {
  const pool = Math.max(0, Math.floor(hp));
  if (pool <= 1) return 0;
  const t = Math.min(1, Math.max(0, roll));
  const rate = 0.12 + t * 0.05;
  return Math.min(pool - 1, Math.floor(pool * rate));
}

/**
 * Spirit Link's heal. (HP lost + MND + wyvern level × 0.7) × 2.
 * HP lost is what left the HP bar. Stoneskin is not part of it.
 */
export function spiritLinkHeal(spent: number, mnd: number, level: number): number {
  const alpha = Math.max(0, level) * 0.7;
  return Math.max(0, Math.floor((Math.max(0, spent) + Math.max(0, mnd) + alpha) * 2));
}

/** Spirit Link's Regen. floor(level / 3) per 3-second tick, for 90 seconds. Level 75 is 25. */
export function spiritLinkRegen(level: number): number {
  return Math.max(0, Math.floor(Math.max(0, level) / 3));
}

export const SPIRIT_LINK_REGEN_SECONDS = 90;

/** DoTs Spirit Link removes at once. Empyrean hands, which would also erase, are not equipped. */
export const SPIRIT_LINK_DOTS = ["Burn", "Poison", "Requiem", "Dia", "Bio", "Doom"] as const;

/**
 * Spirit Bond's split. Half of the wyvern's damage, after the pet's own
 * damage taken, is redirected to the dragoon. An odd point stays on the wyvern.
 */
export function spiritBondSplit(damage: number): { pet: number; master: number } {
  const n = Math.max(0, Math.floor(damage));
  const master = Math.floor(n / 2);
  return { pet: n - master, master };
}

/** Wyvern type from the support job. No sub, and every other playable sub, is offensive. */
export function wyvernKind(sub: JobId | null): WyvernKind {
  if (sub != null && DEFENSIVE_SUBS.includes(sub)) return "defensive";
  if (sub != null && HYBRID_SUBS.includes(sub)) return "hybrid";
  return "offense";
}

/**
 * Healing Breath's HP threshold at spell completion.
 * Defensive cures the party at or below 1/3. Hybrid cures only the dragoon at or below 1/4.
 * Drachen Armet would raise those to 1/2 and 1/3. The armor is worn as a look, not equipped.
 * An offensive wyvern does not heal. Null.
 */
export function healingThreshold(kind: WyvernKind): number | null {
  if (kind === "defensive") return 1 / 3;
  if (kind === "hybrid") return 0.25;
  return null;
}

/**
 * Which breath a closed skillchain asks for.
 * The chain lowers those elements. The lowest one wins.
 * The Tropical Rarab's elemental ranks are not published, so an untouched set ties
 * and the breath is Flame. Light and dark are not breaths.
 */
export function wyvernBreathChoice(lowered: readonly string[]): BreathName {
  const weak = new Set(lowered);
  for (const row of BREATH_ORDER) {
    if (weak.has(row.element)) return row.name;
  }
  return "Flame";
}

/**
 * BG-Wiki Magic Burst. A wyvern breath that matches the chain raises
 * magic accuracy, not damage. The accuracy amount is not printed, so
 * this yard does not add it. The older damage step, 1.30 then +0.05
 * a stage, is not the current page, and it is not applied.
 */
export function breathBurstFactor(steps: number): number {
  void steps;
  return 1;
}

/**
 * Wyvern maximum HP at 75. The printed base is 1066. VIT is not in that line.
 * The experience parameter increase, up to +30% HP, is not tracked here.
 */
export function wyvernMaxHp(level: number): number {
  void level;
  return WYVERN_HP;
}

/** One swing, in seconds. Delay 320, no pet haste. */
export function wyvernSwingSeconds(): number {
  return WYVERN_DELAY / 60;
}

/**
 * A connecting bite. The published table has attack, not base weapon damage,
 * so the swing stays floor(level × 0.45 + 6). Dragon Killer is 8% at 25.
 * The Tropical Rarab is not a dragon, so the fight passes false.
 */
export function wyvernMeleeDamage(level: number, dragon = false): number {
  const base = Math.max(1, Math.floor(Math.max(0, level) * 0.45 + 6));
  if (!dragon || dragonKiller(level) <= 0) return base;
  return Math.max(1, Math.floor(base * (1 + dragonKiller(level))));
}

/**
 * Elemental breath from current HP. floor(floor(HP / 6) + 15).
 * Job points, breath gear, and Deep Breathing are not in this kit.
 * TP does not change the damage. The breath still spends the bar.
 */
export function wyvernBreathDamage(currentHp: number): number {
  const hp = Math.max(0, currentHp);
  return Math.floor(Math.floor(hp / 6) + 15);
}

/**
 * Magic accuracy Elemental Breath would add from TP.
 * Flash Nova's effect-accuracy row, and the accuracy rows on Asuran Fists,
 * Swift Blade, and Raiden Thrust, leave 1000 / 2000 / 3000 blank.
 * Sidewinder is the only printed accuracy curve in this book, and it is
 * a ranged penalty, not an elemental bonus. The slope stays 0.
 */
export function elementalBreathAccuracy(tp: number): number {
  void tp;
  return 0;
}

/**
 * Healing Breath tier through 75. IV is level 80 and is not used.
 * Value is the numerator over 256.
 */
export function healingBreathTier(level: number): { name: string; value: number; base: number } {
  if (level >= 40) return { name: "Healing Breath III", value: 55, base: 42 };
  if (level >= 20) return { name: "Healing Breath II", value: 48, base: 24 };
  return { name: "Healing Breath", value: 35, base: 8 };
}

/**
 * Full-bar bonus on Healing Breath's max-HP term. The July 2008 sheet's
 * Healing Breath III line is floor(0.1757 × (helm + tpBonus + 1) × HP + 42)
 * with no wyvern XP. 155/537 sits in the narrow band of full-bar tpBonus
 * values that match every cell that is not Deep Breathing. Deep Breathing is a merit.
 */
const HEALING_BREATH_TP = 155 / 537;

/** floor(max HP × value / 256 × (1 + TP / 3000 × 155/537) + base).
 * The flat base is not multiplied. 0 TP is the current BG amount.
 * No helm, no wyvern XP, no HP gear, no Deep Breathing. TP above 3000 counts as 3000.
 */
export function healingBreathAmount(maxHp: number, level: number, tp = 0): number {
  const tier = healingBreathTier(level);
  const hpPart = (Math.max(0, maxHp) * tier.value) / 256;
  const spent = Math.max(0, Math.min(3000, tp));
  const bonus = (spent / 3000) * HEALING_BREATH_TP;
  return Math.max(0, Math.floor(hpPart * (1 + bonus) + tier.base));
}

export type RemoveAilment = "Poison" | "Blindness" | "Paralysis" | "Curse" | "Doom";

/**
 * One Removal Breath after a weapon skill. The page does not print a priority,
 * so this follows the order the breaths are learned. Doom shares Remove Curse
 * at 60, and it is not guaranteed.
 */
export function removeBreathFor(level: number, names: readonly string[]): { name: string; ailment: RemoveAilment } | null {
  const have = new Set(names);
  if (level >= 1 && have.has("Poison")) return { name: "Remove Poison", ailment: "Poison" };
  if (level >= 20 && have.has("Blindness")) return { name: "Remove Blind", ailment: "Blindness" };
  if (level >= 40 && have.has("Paralysis")) return { name: "Remove Paralysis", ailment: "Paralysis" };
  if (level >= 60 && have.has("Curse")) return { name: "Remove Curse", ailment: "Curse" };
  if (level >= 60 && have.has("Doom")) return { name: "Remove Curse", ailment: "Doom" };
  return null;
}

/** Effective defense after the innate +50%. A bite aimed at the wyvern uses this. */
export function wyvernDefense(): number {
  return Math.floor(WYVERN_DEFENSE * (1 + WYVERN_DEFENSE_BONUS));
}

export const DRG_ABILITIES: DrgAbility[] = [
  {
    name: "Spirit Surge",
    level: 1,
    recast: 3600,
    duration: 60,
    access: "main",
    effect: "Absorbs the wyvern for 60 seconds. The wyvern must be out. It cannot be called again until this wears off. Accuracy +50. Attack and defense +25% (64/256). STR rises by 1 + floor(level / 5), which is +16 at 75, and attack includes that STR. Maximum HP rises by 25% of the wyvern's maximum, and you are healed by its remaining HP. Jump, High Jump, and Super Jump recasts reset. While it is up, those jumps cannot miss. Jump inflicts Defense Down (−20%) for 60 seconds. That does not replace a stronger Defense Down, and Dia still multiplies. High Jump cuts the target's TP by twice the damage. Super Jump halves the enmity of the nearest party member behind you, from the enemy's view. The motion is a column of light as the wyvern folds into the armor. Recast 1:00:00. Main job only. Job-ability haste of 25% is described and not applied. This yard has no job-ability haste reducer.",
    ce: 0,
    ve: 0,
  },
  {
    name: "Call Wyvern",
    level: 1,
    recast: 1200,
    duration: 0,
    access: "main",
    effect: "Calls one wyvern. White Mage, Black Mage, Red Mage, and Summoner call a defensive wyvern. It uses Remove Breath after a weapon skill, one ailment, and Healing Breath after you finish a spell when a party member is at or below one third HP. Paladin, Dark Knight, Bard, and Ninja call a hybrid. A weapon skill is an elemental breath, and a finished spell is Healing Breath for you only, at or below one quarter HP. Any other sub is offensive: an elemental breath after a weapon skill, and no heal. The element is the target's lowest resistance. A skillchain lowers the chain's elements, so the breath matches and can magic burst. With nothing lowered, the six elements tie and the breath is Flame. Summoning magic does not call a heal. Drachen Armet is not equipped, so the thresholds stay one third and one quarter. A breath that fires spends the wyvern's TP. Healing Breath's max-HP term grows with that bar. Elemental damage does not, and the accuracy cells on the weapon-skill pages are blank, so the hit rate does not grow. Removal Breath gains nothing from the bar. A breath that does not fire does not spend it. While it is alive, attack and defense +10% (26/256). No job-point double attack. It fails while Spirit Surge is up. The motion raises the polearm, and the wyvern appears at your side. Recast 20:00. Cumulative enmity 1, volatile enmity 300. Main job only. Dismiss has its own 5:00 recast. Dismiss at full HP resets this recast.",
    ce: 1,
    ve: 300,
  },
  {
    name: "Dismiss",
    level: 1,
    recast: 300,
    duration: 0,
    access: "main",
    effect: "Sends the wyvern away. Recast 0:05:00. If the wyvern is at full HP, Call Wyvern's recast resets. The motion is a short wave of the polearm. Main job only.",
    ce: 0,
    ve: 0,
  },
  {
    name: "Ancient Circle",
    level: 5,
    recast: 300,
    duration: 180,
    access: "sub",
    effect: "Dragon resistance for party members in range. Main job: damage dealt to dragons +15%, damage taken from dragons −15%. A subjob is 5%. It strengthens Dragon Killer, and that extra is not added on top of the trait. Only one Circle can be up. The Tropical Rarab is not a dragon, so the fight does not change. The page does not print the radius, so this yard uses 10'. The motion sweeps the polearm and a ring opens on the ground. Duration 0:03:00. Recast 0:05:00. Cumulative enmity 1, volatile enmity 20.",
    ce: 1,
    ve: 20,
  },
  {
    name: "Jump",
    level: 10,
    recast: 60,
    duration: 0,
    access: "sub",
    effect: "A leap and a polearm thrust. Range 9.5'. It uses your normal melee hit rate, unless Spirit Surge is up, which makes it a sure hit. Damage is floor((weapon damage + fSTR) × (1 + VIT / 256)). A hit gives you TP for one swing and does not give the target TP. A miss still spends the recast. During Spirit Surge a hit inflicts Defense Down (−20%) for 60 seconds. It does not replace a stronger Defense Down, and a longer one is not shortened. Dia still multiplies defense. The motion leaves the ground, thrusts, and lands. A hit flashes on the enemy. Recast 0:01:00.",
    ce: 0,
    ve: 0,
  },
  {
    name: "Spirit Link",
    level: 25,
    recast: 90,
    duration: 0,
    access: "sub",
    effect: "Spends 12–17% of your current HP to heal the wyvern. Stoneskin is spent first, and the price cannot knock you out. The heal is (HP lost + MND + wyvern level × 0.7) × 2. The wyvern gains Regen of floor(your level / 3) for 90 seconds, and Burn, Poison, Requiem, Dia, Bio, and Doom are removed. Half of the wyvern's TP would move to you. This wyvern does not store TP. It fails, and the recast is not spent, when no wyvern is out, or when the wyvern is already full. Empathy merits, which would allow a full wyvern, are not unlocked. The base Empathy trait still copies one beneficial effect into the log. The motion puts a hand toward the wyvern. Recast 0:01:30.",
    ce: 0,
    ve: 0,
  },
  {
    name: "High Jump",
    level: 35,
    recast: 120,
    duration: 0,
    access: "sub",
    effect: "A higher leap than Jump. Range 11.5'. Damage is weapon damage + fSTR, with no VIT term and no pDIF roll. It is not a sure hit. Hit or miss, cumulative and volatile enmity are reduced by 50% as a main job and by 30% as a subjob. Damage enmity is added after that cut. The target gains no TP. During Spirit Surge a hit also cuts the target's TP by twice the damage. Recast 0:02:00. The 1:00 / 2:00 / 3:00 pattern matches the Jump and Super Jump pages.",
    ce: 0,
    ve: 0,
  },
  {
    name: "Super Jump",
    level: 50,
    recast: 180,
    duration: 5,
    access: "master-sub",
    effect: "A leap that holds you in the air for about 5 seconds. Range 12.5'. No damage and no TP. If you already have enmity, cumulative enmity becomes 1. It does not put you on the list when you had none. The Tropical Rarab cannot start a swing at you while you are up. During Spirit Surge, the nearest party member behind you, from the enemy's view, loses half their enmity. The motion jumps and stays there, then lands. Recast 0:03:00. A level-37 subjob has not learned it. A master-level sub could. This kit has no master levels.",
    ce: 0,
    ve: 0,
  },
  {
    name: "Spirit Bond",
    level: 65,
    recast: 60,
    duration: 180,
    access: "main",
    effect: "For 3 minutes, damage the wyvern takes is split evenly. Your half is not reduced by your damage taken or by Phalanx. Stoneskin can absorb it, and it does not convert into MP or TP. Healing Breath also restores the wyvern, at the breath's full potency, and the buff does not end. The motion is a short pulse between you and the wyvern. Recast 0:01:00. Main job only.",
    ce: 0,
    ve: 0,
  },
  {
    name: "Deep Breathing",
    level: 75,
    recast: 180,
    duration: 0,
    access: "main",
    merit: true,
    effect: "Merit ability. Not unlocked. Would make the next breath stronger. The motion would be a deep inhale before the wyvern breathes.",
    ce: 0,
    ve: 0,
  },
  {
    name: "Angon",
    level: 75,
    recast: 180,
    duration: 0,
    access: "main",
    merit: true,
    effect: "Merit ability. Not unlocked. Would throw the polearm and lower the target's defense. The motion would be the throw.",
    ce: 0,
    ve: 0,
  },
];

export const DRG_TRAITS: DrgTrait[] = [
  { name: "Attack Bonus", level: 10, access: "sub", effect: "Attack +10. The next tier is level 91, so this is the tier at 75." },
  { name: "Strafe", level: 20, access: "sub", effect: "Wyvern breath accuracy +10. The page did not print the amount. This yard's step. A level-37 subjob has this tier." },
  { name: "Dragon Killer", level: 25, access: "sub", effect: "An edge against dragons. 8%. The Tropical Rarab is not a dragon, so it is not rolled." },
  { name: "Accuracy Bonus", level: 30, access: "sub", effect: "Accuracy +10. A level-37 subjob has this tier." },
  { name: "Damage Limit+", level: 30, access: "sub", effect: "Physical pDIF cap +26/256. Does not raise the rolled pDIF, only the cap. A level-37 subjob has this tier." },
  { name: "Smite", level: 40, access: "sub", effect: "Physical attack +25/256 with hand-to-hand or a two-handed weapon. A level-37 subjob has not learned it. The Harpoon is two-handed, so a main Dragoon has it." },
  { name: "Strafe II", level: 40, access: "sub", effect: "Wyvern breath accuracy +20. Replaces Strafe. A level-37 subjob has not learned it." },
  { name: "Conserve TP", level: 45, access: "sub", effect: "The page does not print the rate, so weapon skills do not refund TP. A level-37 subjob has not learned it." },
  { name: "Weapon Skill Damage Boost", level: 45, access: "sub", effect: "The page does not print the percent, so the weapon-skill roll is unchanged. A level-37 subjob has not learned it." },
  { name: "Weapon Skill Damage Boost II", level: 55, access: "master-sub", effect: "Replaces Weapon Skill Damage Boost. The percent is still not printed, so the roll is unchanged. A support job needs master levels." },
  { name: "Conserve TP II", level: 58, access: "master-sub", effect: "Replaces Conserve TP. The rate is not printed, so nothing is refunded. A support job needs master levels." },
  { name: "Strafe III", level: 60, access: "main", effect: "Wyvern breath accuracy +30. Replaces Strafe II. Main job only. The amount is this yard's step." },
  { name: "Accuracy Bonus II", level: 60, access: "main", effect: "Accuracy +22. Replaces Accuracy Bonus. Main job only." },
  { name: "Damage Limit+ II", level: 60, access: "main", effect: "Physical pDIF cap +51/256. Replaces Damage Limit+. Main job only." },
  { name: "Weapon Skill Damage Boost III", level: 65, access: "main", effect: "Replaces Weapon Skill Damage Boost II. The percent is not printed, so the roll is unchanged. Main job only." },
  { name: "Conserve TP III", level: 71, access: "main", effect: "Replaces Conserve TP II. The rate is not printed, so nothing is refunded. Main job only." },
  { name: "Weapon Skill Damage Boost IV", level: 75, access: "main", effect: "Replaces Weapon Skill Damage Boost III. The percent is not printed, so the roll is unchanged. Main job only." },
  { name: "Empathy", level: 75, access: "main", effect: "Spirit Link copies one beneficial effect onto the wyvern. Merit ranks, which would copy more, are not unlocked. Main job only." },
];

/**
 * Combat skills from the current Dragoon page, at the level-75 caps.
 * Classic 75 charts called Evasion C−. This kit uses the current B−.
 */
export const DRG_SKILLS: DrgSkill[] = [
  { name: "Polearm", rank: "A+" },
  { name: "Staff", rank: "B-" },
  { name: "Sword", rank: "C-" },
  { name: "Dagger", rank: "E" },
  { name: "Club", rank: "E" },
  { name: "Parrying", rank: "C" },
  { name: "Evasion", rank: "B-" },
];

export function drgSkill(name: string, level: number): number {
  const row = DRG_SKILLS.find((skill) => skill.name === name);
  return row ? skillCap(row.rank, level) : 0;
}

export function assertDrg(): void {
  const naked = characterBase("hume", "DRG", 75);
  if (naked.hp !== 1167 || naked.mp !== 0 || naked.str !== 61 || naked.dex !== 53 || naked.vit !== 61 || naked.agi !== 53 || naked.int !== 48 || naked.mnd !== 53 || naked.chr !== 61) {
    throw new Error(`Hume DRG 75 ${naked.hp}/${naked.mp}/${naked.str}/${naked.dex}/${naked.vit}/${naked.agi}/${naked.int}/${naked.mnd}/${naked.chr}`);
  }
  if (drgJobLevel("DRG", null, 0, 75) !== 75 || drgJobLevel("WAR", "DRG", 37, 75) !== 37 || drgJobLevel("WAR", null, 0, 75) !== 0) throw new Error("Dragoon level");
  if (drgAttackBonus(9) !== 0 || drgAttackBonus(37) !== 10 || drgAttackBonus(75) !== 10) throw new Error("Attack Bonus");
  if (strafe(19, "sub") !== 0 || strafe(37, "sub") !== 10 || strafe(40, "sub") !== 20 || strafe(75, "main") !== 30 || strafe(75, "sub") !== 20) throw new Error("Strafe");
  if (dragonKiller(24) !== 0 || dragonKiller(75) !== 0.08) throw new Error("Dragon Killer");
  if (drgAccuracyBonus(29, "sub") !== 0 || drgAccuracyBonus(37, "sub") !== 10 || drgAccuracyBonus(75, "sub") !== 10 || drgAccuracyBonus(75, "main") !== 22) throw new Error("Accuracy Bonus");
  if (drgDamageLimit(37, "sub") !== 26 / 256 || drgDamageLimit(75, "sub") !== 26 / 256 || drgDamageLimit(75, "main") !== 51 / 256) throw new Error("Damage Limit+");
  if (drgSmiteNumer(37) !== 0 || drgSmiteNumer(40) !== 25 || drgSmiteNumer(75) !== 25) throw new Error("Smite");
  if (empathy(75, "sub") || !empathy(75, "main") || empathy(74, "main")) throw new Error("Empathy");
  if (spiritSurgeStr(75) !== 16 || spiritSurgeStr(37) !== 8) throw new Error("Spirit Surge STR");
  if (ancientCircleBonus(true) !== 0.15 || ancientCircleBonus(false) !== 0.05) throw new Error("Ancient Circle");
  if (jumpDamage(8, 2, 61) !== 12 || highJumpDamage(8, 2) !== 10 || jumpDamage(0, 0, 0) !== 0) throw new Error("Jump damage");
  if (spiritLinkCost(1) !== 0 || spiritLinkCost(100, 0) !== 12 || spiritLinkCost(1167, 0) !== 140 || spiritLinkCost(1167, 1) !== 198) throw new Error("Spirit Link");
  if (spiritLinkHeal(140, 53, 75) !== 491 || spiritLinkRegen(75) !== 25 || spiritLinkRegen(99) !== 33) throw new Error("Spirit Link heal");
  if (wyvernKind(null) !== "offense" || wyvernKind("WAR") !== "offense" || wyvernKind("SAM") !== "offense" || wyvernKind("MNK") !== "offense") {
    throw new Error("offensive wyvern");
  }
  if (wyvernKind("WHM") !== "defensive" || wyvernKind("BLM") !== "defensive" || wyvernKind("RDM") !== "defensive" || wyvernKind("SMN") !== "defensive") {
    throw new Error("defensive wyvern");
  }
  if (wyvernKind("PLD") !== "hybrid" || wyvernKind("DRK") !== "hybrid" || wyvernKind("BRD") !== "hybrid" || wyvernKind("NIN") !== "hybrid") {
    throw new Error("hybrid wyvern");
  }
  if (healingThreshold("offense") !== null || healingThreshold("defensive") !== 1 / 3 || healingThreshold("hybrid") !== 0.25) throw new Error("heal threshold");
  if (wyvernMaxHp(75) !== 1066 || wyvernDefense() !== 523 || wyvernSwingSeconds() !== 320 / 60) throw new Error("wyvern line");
  if (WYVERN_ATTACK !== 331 || WYVERN_ACCURACY !== 362 || WYVERN_EVASION !== 294 || WYVERN_DAMAGE_TAKEN !== 0.4 || BREATH_RANGE !== 14) throw new Error("wyvern card");
  if (wyvernMeleeDamage(75) !== 39 || wyvernMeleeDamage(75, true) !== 42 || wyvernMeleeDamage(24, true) !== 16) throw new Error("wyvern bite");
  if (wyvernBreathDamage(1066) !== 192 || wyvernBreathDamage(0) !== 15) throw new Error("elemental breath");
  if (elementalBreathAccuracy(0) !== 0 || elementalBreathAccuracy(3000) !== 0) throw new Error("elemental breath accuracy");
  if (healingBreathTier(1).name !== "Healing Breath" || healingBreathTier(20).name !== "Healing Breath II" || healingBreathTier(75).name !== "Healing Breath III" || healingBreathTier(80).name !== "Healing Breath III") {
    throw new Error("Healing Breath tier");
  }
  if (healingBreathAmount(1066, 1) !== 153 || healingBreathAmount(1066, 20) !== 223 || healingBreathAmount(1066, 75) !== 271) throw new Error("Healing Breath");
  if (healingBreathAmount(1066, 75, 0) !== 271 || healingBreathAmount(1066, 75, 3000) !== 337 || healingBreathAmount(1066, 75, 9000) !== 337) throw new Error("Healing Breath TP");
  if (healingBreathAmount(1066, 1, 3000) !== 195 || healingBreathAmount(1066, 20, 3000) !== 281) throw new Error("Healing Breath TP tiers");
  if (wyvernBreathChoice([]) !== "Flame" || wyvernBreathChoice(["light", "fire"]) !== "Flame" || wyvernBreathChoice(["thunder", "wind"]) !== "Gust") {
    throw new Error("breath element");
  }
  if (wyvernBreathChoice(["earth", "water", "ice", "dark"]) !== "Frost" || wyvernBreathChoice(["water"]) !== "Hydro" || breathElement("Lightning") !== "thunder") {
    throw new Error("breath element");
  }
  if (breathBurstFactor(1) !== 1 || breathBurstFactor(2) !== 1 || breathBurstFactor(3) !== 1 || breathBurstFactor(4) !== 1) throw new Error("breath burst");
  if (removeBreathFor(75, ["Doom", "Poison"])?.ailment !== "Poison" || removeBreathFor(19, ["Blindness"]) !== null || removeBreathFor(75, ["Doom"])?.name !== "Remove Curse") {
    throw new Error("Remove Breath");
  }
  if (removeBreathFor(39, ["Paralysis"]) !== null || removeBreathFor(75, []) !== null) throw new Error("Remove Breath gate");
  const split = spiritBondSplit(90);
  if (split.pet !== 45 || split.master !== 45 || spiritBondSplit(91).master !== 45 || spiritBondSplit(91).pet !== 46) throw new Error("Spirit Bond");
  if (drgSkill("Polearm", 75) !== 276 || drgSkill("Staff", 75) !== 240 || drgSkill("Sword", 75) !== 220) throw new Error("weapon ranks");
  if (drgSkill("Dagger", 75) !== 200 || drgSkill("Club", 75) !== 200 || drgSkill("Parrying", 75) !== 225 || drgSkill("Evasion", 75) !== 240) throw new Error("low ranks");
  if (drgSkill("Polearm", 37) !== 114 || drgSkill("Scythe", 75) !== 0 || drgSkill("Katana", 75) !== 0) throw new Error("missing or sub rank");
  const banned = ["Spirit Jump", "Soul Jump", "Dragon Breaker", "Fly High", "Smiting Breath", "Restoring Breath", "Steady Wing"];
  if (DRG_ABILITIES.some((a) => banned.includes(a.name)) || DRG_TRAITS.some((t) => banned.includes(t.name))) throw new Error("post-75 in the level-75 kit");
  if (DRG_ABILITIES.filter((a) => a.access === "sub" && a.level <= 37 && !a.merit).map((a) => a.name).join(",") !== "Ancient Circle,Jump,Spirit Link,High Jump") {
    throw new Error("subjob abilities");
  }
  if (DRG_ABILITIES.filter((a) => a.merit).map((a) => a.name).join(",") !== "Deep Breathing,Angon") throw new Error("merits");
  if (JUMP_RANGE !== 9.5 || HIGH_JUMP_RANGE !== 11.5 || SUPER_JUMP_RANGE !== 12.5 || SPIRIT_SURGE_NUMER !== 64 || WYVERN_AURA !== 26) throw new Error("cards");
}
