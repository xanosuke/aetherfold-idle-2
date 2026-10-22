/**
 * Retail Scholar toolkit through level 75. No merits and no job points.
 *
 * The job page's brackets, at a level-75 cap with no master levels:
 * through 49 a normal subjob can use the trait or ability. 50–58 need a
 * master-level sub. 65 and up are main job only, except Resist Silence III
 * at 70, which sits past the subjob line the same way. Tabula Rasa is the
 * one-hour and is main only. Enlightenment is a merit and is not unlocked.
 *
 * Naked Hume Scholar grades, Darkstar's row, with no subjob:
 * HP E, MP D, STR F, DEX D, VIT E, AGI D, INT C, MND D, CHR C.
 * Level 75 is 971 HP, 464 MP, STR 48, DEX 56, VIT 53, AGI 56, INT 61,
 * MND 56, CHR 61. Max MP Boost is not in that MP number.
 *
 * The model wears Scholar's Attire, the artifact set: mortarboard, gown,
 * bracers, pants, and loafers, with the grimoire on the back. The pieces
 * are not equipped, so their stat lines are not on the sheet. Ash Club is
 * the weapon in hand. The book is the job look.
 *
 * Light Arts and Dark Arts replace each other, and the grimoire that goes
 * away takes its stratagems with it. Recasting the same arts does not.
 * Stratagems spend a charge. Tabula Rasa restores the bank and, while it
 * is up, arts and stratagems have no recast and stratagems spend nothing.
 * Tabula gives both arts their discount and nullifies both penalties.
 * Grimoire Recast merits are not unlocked, so the arts recast stays 60s.
 * Sublimation's tick is not printed. This yard uses 3 seconds, the same
 * clock as Regen, and labels that a stand-in.
 */

import { skillCap, type SkillRank } from "./skills";
import { characterBase } from "./stats";
import type { JobAccess } from "./blm";
import {
  STORM_MP,
  STORM_CAST,
  STORM_RECAST,
  STORM_RANGE,
  STORMS,
  stormByName,
  weatherAdjusted,
  KLIMAFORM_MP,
  KLIMAFORM_CAST,
  KLIMAFORM_RECAST,
  klimaformMacc,
} from "./weather";
import { castElement, spellByName, spellLevel, type Spell } from "./spells";
import type { JobId } from "./stats";

export {
  type StormElement,
  type StormRow,
  STORM_SECONDS,
  STORM_MP,
  STORM_CAST,
  STORM_RECAST,
  STORM_RANGE,
  STORM_CE,
  STORM_VE,
  STORM_BONUS,
  STORMS,
  STORM_OPPOSE,
  stormByName,
  activeStorm,
  weatherAdjusted,
  KLIMAFORM_MP,
  KLIMAFORM_CAST,
  KLIMAFORM_RECAST,
  KLIMAFORM_SECONDS,
  KLIMAFORM_MACC,
  KLIMAFORM_CE,
  KLIMAFORM_VE,
  klimaformMacc,
} from "./weather";

export type SchAbility = {
  name: string;
  level: number;
  recast: number;
  duration: number;
  access: JobAccess;
  effect: string;
  /** Merit ability. Stored, and not usable until a merit unlocks it. */
  merit?: boolean;
  /** Stratagem. No ability recast. It spends a charge unless Tabula Rasa is up. */
  stratagem?: "light" | "dark";
};

export type SchTrait = {
  name: string;
  level: number;
  access: JobAccess;
  effect: string;
  merit?: boolean;
};

export type SchSkill = {
  name: string;
  rank: SkillRank;
};

/**
 * Tabula Rasa is the one-hour. 3:00, recast 1:00:00.
 * Cumulative enmity 1, volatile 300.
 * Light Arts and Dark Arts are 2:00:00, recast 1:00, enmity 1 / 80.
 * Sublimation recasts in 30 seconds. The same enmity.
 * Modus Veritas recasts in 3:00. It is instant. The same enmity.
 * Stratagems last 60 seconds or the next matching spell.
 * Addendum lasts until that arts is replaced.
 * Ebullience is a 20% damage bonus. The page says that, and Savant's Bonnet +1
 * adds 5% to make 25%, so the base is 20. Merit ranks that add 2 damage are not unlocked.
 * Rapture is +50% healing potency and +50% damage on divine and white enfeebling.
 * Debuff potency is not boosted. The page says so.
 */
export const SCH_ABILITIES: SchAbility[] = [
  {
    name: "Tabula Rasa",
    level: 1,
    recast: 3600,
    duration: 180,
    access: "main",
    effect: "Optimizes white and black magic for 3:00. Both sides take the 10% MP cut when the cost is over 9, and both cast and recast clocks drop 10%. The 20% penalties are nullified. Recast 1:00:00. Restores every stratagem charge. While it is up, Light Arts, Dark Arts, and stratagems have no recast, and stratagems spend no charge. Both addenda are open. Regen under it is +36 HP a tick and +72 seconds, and that replaces the Light Arts regen bonus. The helix bonus on the page is a test-server +24 a tick and about +16% duration. The damage equation is not printed, so that bonus is not added. Cumulative enmity 1, volatile enmity 300. Main job only. The job-point MP return is not applied.",
  },
  {
    name: "Light Arts",
    level: 10,
    recast: 60,
    duration: 7200,
    access: "sub",
    effect: "White-magic arts for 2:00:00. Recast 1:00. Replaces Dark Arts and that grimoire's stratagems: Parsimony, Addendum: Black, Alacrity, Manifestation, and Ebullience. Casting Light Arts again does not remove Penury, Celerity, Accession, Rapture, or Addendum: White. Divine, Healing, Enhancing, and Enfeebling magic rise to B+ of the main job's level. A skill already past B+ stays. White magic cast and recast −10%. Black magic cast and recast +20%. White magic MP −10%, rounded down, and a spell of 9 MP or less is unchanged. Black magic MP +20%, rounded up. Regen, main job only, gains floor((level − 10) / 10) × 3 HP a tick and twice that many seconds. At 75 that is +18 HP and +36 seconds. Grimoire Recast merits are not unlocked. Cumulative enmity 1, volatile enmity 80.",
  },
  {
    name: "Dark Arts",
    level: 10,
    recast: 60,
    duration: 7200,
    access: "sub",
    effect: "Black-magic arts for 2:00:00. Recast 1:00. Replaces Light Arts and that grimoire's stratagems: Penury, Addendum: White, Celerity, Accession, and Rapture. Casting Dark Arts again does not remove Parsimony, Alacrity, Manifestation, Ebullience, or Addendum: Black. Dark, Elemental, and Enfeebling magic rise to B+ of the main job's level. Black magic MP −10%, rounded down, and a spell of 9 MP or less is unchanged. White magic MP +20%, rounded up. Black magic cast and recast −10%. White magic cast time +20%. The page does not print a white-magic recast increase, so recast is not lengthened. Helix, main job only, adds floor(level / 5) − 3 to the base damage. At 75 that is 12. At 99 the page's check is 16. The category page's +24 at 99 is still marked under testing, so it is not used. The level 99 duration of 168 seconds is not applied at 75. Cumulative enmity 1, volatile enmity 80.",
  },
  {
    name: "Sublimation",
    level: 35,
    recast: 30,
    duration: 7200,
    access: "sub",
    effect: "Stores MP while spending HP. Recast 0:30. 2 HP a tick becomes 2 MP at 35, 3 at 45, 4 at 55, 5 at 65, and 6 at 75. A level-37 sub stays at 2. The tick interval is not printed. This yard uses 3 seconds, the same clock as Regen. It completes at half of maximum HP, or when HP falls under half. Using it again returns the stored MP plus one extra tick, and that tick costs no HP. Stored MP can last 120 minutes. Starting it removes Refresh. A Refresh cast while Sublimation or Sublimation: Complete is up has no effect. Merits are not unlocked. Cumulative enmity 1, volatile enmity 80.",
  },
  {
    name: "Modus Veritas",
    level: 65,
    recast: 180,
    duration: 0,
    access: "main",
    effect: "Used on a foe already under Helix. Recast 0:03:00. The page doubles that helix's damage per tock and cuts the time left in half. It can be used once on that helix. A tock still cannot pass 9999. No magic-accuracy bonus is printed, so none is rolled. Cumulative enmity 1, volatile enmity 80. Main job only. Merit duration is not unlocked.",
  },
  {
    name: "Enlightenment",
    level: 75,
    recast: 600,
    duration: 0,
    access: "main",
    merit: true,
    effect: "Merit ability. Not unlocked.",
  },
  {
    name: "Penury",
    level: 10,
    recast: 0,
    duration: 60,
    access: "sub",
    stratagem: "light",
    effect: "Light stratagem. The next white magic spell costs half its MP, rounded down. 60 seconds or that spell. Needs Light Arts, or Tabula Rasa. Spends one charge unless Tabula Rasa is up. Cumulative enmity 1, volatile enmity 80.",
  },
  {
    name: "Addendum: White",
    level: 10,
    recast: 0,
    duration: 7200,
    access: "sub",
    stratagem: "light",
    effect: "Light stratagem. White magic that needs an addendum can be cast while Light Arts is up. It wears off when Light Arts does. Tabula Rasa opens both addenda without this. Spends one charge unless Tabula Rasa is up. Cumulative enmity 1, volatile enmity 80.",
  },
  {
    name: "Celerity",
    level: 25,
    recast: 0,
    duration: 60,
    access: "sub",
    stratagem: "light",
    effect: "Light stratagem. The next white magic cast time is halved. It is not instant. 60 seconds or that spell. Needs Light Arts, or Tabula Rasa. Spends one charge unless Tabula Rasa is up. Cumulative enmity 1, volatile enmity 80.",
  },
  {
    name: "Accession",
    level: 40,
    recast: 0,
    duration: 60,
    access: "sub",
    stratagem: "light",
    effect: "Light stratagem. The next enhancing or healing spell, other than Raise, Reraise, or Haste, costs twice the MP and takes twice the cast. The page makes it a 10' area. This yard's party is you, so no extra target is added. 60 seconds or that spell. Needs Light Arts, or Tabula Rasa. Spends one charge unless Tabula Rasa is up. Cumulative enmity 1, volatile enmity 80.",
  },
  {
    name: "Rapture",
    level: 55,
    recast: 0,
    duration: 60,
    access: "master-sub",
    stratagem: "light",
    effect: "Light stratagem. Healing potency +50% on Cure and Curaga, and the same 50% on Cure against undead, after the cure formula and before Majesty. Divine damage is +50% after magic attack and before the resist. Dia's light hit and its slip are +50%. Dia's defense down, Banish's defense down, and other enfeeble potency are not boosted. It is spent on the next white magic spell, including one it does not boost, such as Stoneskin. Merit ranks and Savant's Bonnet are not equipped. A level-37 sub has not learned it. 60 seconds or that spell. Needs Light Arts, or Tabula Rasa. Spends one charge unless Tabula Rasa is up. Cumulative enmity 1, volatile enmity 80.",
  },
  {
    name: "Altruism",
    level: 75,
    recast: 0,
    duration: 60,
    access: "main",
    merit: true,
    stratagem: "light",
    effect: "Merit stratagem. Not unlocked.",
  },
  {
    name: "Tranquility",
    level: 75,
    recast: 0,
    duration: 60,
    access: "main",
    merit: true,
    stratagem: "light",
    effect: "Merit stratagem. Not unlocked.",
  },
  {
    name: "Parsimony",
    level: 10,
    recast: 0,
    duration: 60,
    access: "sub",
    stratagem: "dark",
    effect: "Dark stratagem. The next black magic spell costs half its MP, rounded down. 60 seconds or that spell. Needs Dark Arts, or Tabula Rasa. Spends one charge unless Tabula Rasa is up. Cumulative enmity 1, volatile enmity 80.",
  },
  {
    name: "Alacrity",
    level: 25,
    recast: 0,
    duration: 60,
    access: "sub",
    stratagem: "dark",
    effect: "Dark stratagem. The next black magic cast time is halved. It is not instant. 60 seconds or that spell. Needs Dark Arts, or Tabula Rasa. Spends one charge unless Tabula Rasa is up. Cumulative enmity 1, volatile enmity 80.",
  },
  {
    name: "Addendum: Black",
    level: 30,
    recast: 0,
    duration: 7200,
    access: "sub",
    stratagem: "dark",
    effect: "Dark stratagem. Black magic that needs an addendum can be cast while Dark Arts is up. It wears off when Dark Arts does. Tabula Rasa opens both addenda without this. Spends one charge unless Tabula Rasa is up. Cumulative enmity 1, volatile enmity 80.",
  },
  {
    name: "Manifestation",
    level: 40,
    recast: 0,
    duration: 60,
    access: "sub",
    stratagem: "dark",
    effect: "Dark stratagem. The next enfeebling black magic spell, and Drain, Aspir, Bio, Stun, Kaustra, or Klimaform, costs three times the MP and takes twice the cast. An enfeeble, Drain, Aspir, Bio, Stun, or Kaustra becomes a 10' area centered on that foe. The other Tropical Rarab is caught when it stands inside that circle. Klimaform is centered on you. It would reach party members within 10'. This yard's party is you, so the rarab is not buffed. A charmed pet is not a foe. 60 seconds or that spell. Needs Dark Arts, or Tabula Rasa. Spends one charge unless Tabula Rasa is up. Cumulative enmity 1, volatile enmity 80.",
  },
  {
    name: "Ebullience",
    level: 55,
    recast: 0,
    duration: 60,
    access: "master-sub",
    stratagem: "dark",
    effect: "Dark stratagem. The next black magic spell spends it. Elemental damage, Drain, Aspir, and Bio's hit and slip gain 20%. Bio's attack down is not raised. Sleep and Stun are spent and not strengthened. Helix would take the 20%, and the damage equation is not printed, so no hit is added. The page states the 20% bonus, and Savant's Bonnet +1 is printed as +5% on top of it. A level-37 sub has not learned it. 60 seconds or that spell. Needs Dark Arts, or Tabula Rasa. Spends one charge unless Tabula Rasa is up. Merit damage ranks are not unlocked. Cumulative enmity 1, volatile enmity 80.",
  },
  {
    name: "Focalization",
    level: 75,
    recast: 0,
    duration: 60,
    access: "main",
    merit: true,
    stratagem: "dark",
    effect: "Merit stratagem. Not unlocked.",
  },
  {
    name: "Equanimity",
    level: 75,
    recast: 0,
    duration: 60,
    access: "main",
    merit: true,
    stratagem: "dark",
    effect: "Merit stratagem. Not unlocked.",
  },
];

export const SCH_TRAITS: SchTrait[] = [
  { name: "Resist Silence", level: 10, access: "sub", effect: "10% chance to resist Silence. The next tier replaces this." },
  { name: "Clear Mind", level: 20, access: "sub", effect: "+3 MP per tick while resting. The next tier replaces this." },
  { name: "Conserve MP", level: 25, access: "sub", effect: "25% chance to lower a spell's MP cost. The numerator is an even 8 through 14 over 16. Conserve MP II is 96 and is not in this kit." },
  { name: "Max MP Boost", level: 30, access: "sub", effect: "+10 MP. Tier II is level 88 and is not in this kit." },
  { name: "Tranquil Heart", level: 30, access: "sub", effect: "Healing magic generates less enmity. Cure enmity is not numbered here, so the reduction is not applied." },
  { name: "Clear Mind II", level: 35, access: "sub", effect: "+6 MP per tick while resting. Replaces Clear Mind." },
  { name: "Resist Silence II", level: 40, access: "sub", effect: "15% chance to resist Silence. Replaces the earlier tier." },
  { name: "Tranquil Heart II", level: 45, access: "sub", effect: "Healing magic generates less enmity. Cure enmity is not numbered here, so the reduction is not applied." },
  { name: "Clear Mind III", level: 50, access: "master-sub", effect: "+9 MP per tick while resting. A support job needs master levels." },
  { name: "Clear Mind IV", level: 65, access: "main", effect: "+12 MP per tick while resting. Main job only. Replaces the earlier tier." },
  { name: "Resist Silence III", level: 70, access: "main", effect: "20% chance to resist Silence. Main job only. The yard does not cast Silence on you, so the chance is not rolled." },
  { name: "Stormsurge", level: 75, access: "main", merit: true, effect: "Merit trait. Not unlocked. With no ranks, a storm spell does not add the attribute. One rank is the base +3, then +1 a rank, through +7. Sandstorm is VIT, Rainstorm is MND, Windstorm is AGI, Firestorm is STR, Hailstorm is INT, Thunderstorm is DEX, and Aurorastorm is CHR. Voidstorm is every attribute at half of that, floored: +1 at one rank, +2 at two and three, and +3 at four and five. The spells themselves are in the kit." },
];

/** Combat and magic skills from the Scholar job page. No rank means 0. Grimoire B+ is not this rank. */
export const SCH_SKILLS: SchSkill[] = [
  { name: "Club", rank: "C+" },
  { name: "Staff", rank: "C+" },
  { name: "Dagger", rank: "D" },
  { name: "Throwing", rank: "D" },
  { name: "Evasion", rank: "E" },
  { name: "Parrying", rank: "E" },
  { name: "Divine Magic", rank: "D" },
  { name: "Healing Magic", rank: "D" },
  { name: "Enhancing Magic", rank: "D" },
  { name: "Enfeebling Magic", rank: "D" },
  { name: "Elemental Magic", rank: "D" },
  { name: "Dark Magic", rank: "D" },
];

export function schSkill(name: string, level: number): number {
  const row = SCH_SKILLS.find((skill) => skill.name === name);
  return row ? skillCap(row.rank, level) : 0;
}

const LIGHT_SKILLS = new Set(["Divine Magic", "Healing Magic", "Enhancing Magic", "Enfeebling Magic"]);
const DARK_SKILLS = new Set(["Dark Magic", "Elemental Magic", "Enfeebling Magic"]);

type ArtsBuff = { name: string };

/** Grimoire skill. Raises the named skill to B+ of the main job's level. A higher skill stays. Merits are not included. */
export function grimoireSkill(name: string, current: number, mainLevel: number, buffs: readonly ArtsBuff[]): number {
  const light = buffs.some((buff) => buff.name === "Light Arts" || buff.name === "Tabula Rasa");
  const dark = buffs.some((buff) => buff.name === "Dark Arts" || buff.name === "Tabula Rasa");
  const raised = (light && LIGHT_SKILLS.has(name)) || (dark && DARK_SKILLS.has(name));
  if (!raised) return current;
  return Math.max(current, skillCap("B+", mainLevel));
}

/** Clear Mind MP while resting. A normal subjob stops before the level-50 tier. */
export function schClearMind(level: number, access: "main" | "sub"): number {
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

/** Conserve MP proc chance. Same 25% as Black Mage. Tier II is 96. */
export function schConserveMp(level: number): number {
  return level >= 25 ? 0.25 : 0;
}

/** Max MP Boost. Only tier I is in this kit. */
export function schMaxMp(level: number): number {
  return level >= 30 ? 10 : 0;
}

/** Resist Silence chance. The yard does not silence the player, so this is not rolled. */
export function schResistSilence(level: number, access: "main" | "sub"): number {
  if (access === "main") {
    if (level >= 70) return 0.2;
    if (level >= 40) return 0.15;
    if (level >= 10) return 0.1;
    return 0;
  }
  if (level >= 40) return 0.15;
  if (level >= 10) return 0.1;
  return 0;
}

/** Charges in the bank, and seconds to regain one. A normal subjob stops at two. */
export function stratagemBank(level: number, access: "main" | "sub"): { charges: number; seconds: number } {
  if (access === "main") {
    if (level >= 70) return { charges: 4, seconds: 60 };
    if (level >= 50) return { charges: 3, seconds: 80 };
    if (level >= 30) return { charges: 2, seconds: 120 };
    if (level >= 10) return { charges: 1, seconds: 240 };
    return { charges: 0, seconds: 0 };
  }
  if (level >= 30) return { charges: 2, seconds: 120 };
  if (level >= 10) return { charges: 1, seconds: 240 };
  return { charges: 0, seconds: 0 };
}

/** MP stored per sublimation tick. HP spent is always 2. The tick gap is the 3-second stand-in. */
export function sublimationMp(level: number): number {
  if (level >= 95) return 8;
  if (level >= 85) return 7;
  if (level >= 75) return 6;
  if (level >= 65) return 5;
  if (level >= 55) return 4;
  if (level >= 45) return 3;
  if (level >= 35) return 2;
  return 0;
}

/** Light Arts regen bonus. Main job only. Tabula Rasa overwrites it. */
export function lightArtsRegen(level: number, main: boolean): { hp: number; seconds: number } {
  if (!main || level < 10) return { hp: 0, seconds: 0 };
  const step = Math.floor((level - 10) / 10);
  return { hp: step * 3, seconds: step * 6 };
}

export const TABULA_REGEN_HP = 36;
export const TABULA_REGEN_SECONDS = 72;
/** Sublimation's tick gap is not printed. Regen uses 3 seconds, so this yard does too. */
export const SUBLIMATION_TICK = 3;
export const SUBLIMATION_HP = 2;

/** Helix duration from the category table. A subjob uses the subjob level. */
export function helixSeconds(level: number): number {
  if (level >= 60) return 90;
  if (level >= 40) return 60;
  if (level >= 20) return 30;
  return 0;
}

/**
 * Dark Arts helix bonus, added to D before the other multipliers.
 * The ability page prints floor(level / 5) − 3, and +16 at level 99.
 * Main job only. A subjob's Dark Arts does not add it.
 */
export function darkArtsHelixBonus(level: number, main: boolean): number {
  if (!main || level < 15) return 0;
  return Math.floor(level / 5) - 3;
}

/** A tock cannot pass this. The opening hit is not capped. */
export const HELIX_TOCK_CAP = 9999;
/** Seconds from one tock to the next, after the first. */
export const HELIX_TOCK_GAP = 10;

/** First tock is 1 to 10 seconds after the hit. The roll is already in that range. */
export function helixFirstTock(roll: number): number {
  const n = Math.floor(roll);
  if (n < 1) return 1;
  if (n > 10) return 10;
  return n;
}

export type HelixRow = {
  name: string;
  left: number;
  dot?: number;
  acc?: number;
  power?: number;
  element?: string;
};

/**
 * Advance a helix. acc is the seconds until the next tock, not a 3-second slip.
 * A tock that lands as the effect ends still counts. Later tocks are 10 seconds apart.
 */
export function stepHelix(row: HelixRow, dt: number): { row: HelixRow | null; ticks: number[] } {
  let left = row.left;
  let acc = row.acc ?? 0;
  let time = dt;
  const dot = Math.min(HELIX_TOCK_CAP, Math.max(0, row.dot ?? 0));
  const ticks: number[] = [];
  while (time > 1e-9 && left > 1e-9) {
    if (acc <= 1e-9) {
      if (dot > 0) ticks.push(dot);
      acc = HELIX_TOCK_GAP;
      continue;
    }
    const step = Math.min(time, acc, left);
    const before = left;
    acc -= step;
    left -= step;
    time -= step;
    if (dot > 0 && acc <= 1e-6 && before > 1e-6) {
      ticks.push(dot);
      acc = HELIX_TOCK_GAP;
    }
  }
  if (left <= 1e-6) return { row: null, ticks };
  return { row: { ...row, left, acc, dot }, ticks };
}

/** Helix element from the spell name. The enfeeble row is only called Helix. */
export function helixElement(name: string): "fire" | "ice" | "wind" | "earth" | "thunder" | "water" | "light" | "dark" {
  if (name.startsWith("Pyro")) return "fire";
  if (name.startsWith("Cryo")) return "ice";
  if (name.startsWith("Anemo")) return "wind";
  if (name.startsWith("Geo")) return "earth";
  if (name.startsWith("Iono")) return "thunder";
  if (name.startsWith("Hydro")) return "water";
  if (name.startsWith("Lumino")) return "light";
  return "dark";
}

/** The element's level-1 skillchain property. Same as the matching nuke. Helix does not open a chain. */
export function helixProperty(name: string): "Liquefaction" | "Induration" | "Detonation" | "Scission" | "Impaction" | "Reverberation" | "Transfixion" | "Compression" {
  if (name.startsWith("Pyro")) return "Liquefaction";
  if (name.startsWith("Cryo")) return "Induration";
  if (name.startsWith("Anemo")) return "Detonation";
  if (name.startsWith("Geo")) return "Scission";
  if (name.startsWith("Iono")) return "Impaction";
  if (name.startsWith("Hydro")) return "Reverberation";
  if (name.startsWith("Lumino")) return "Transfixion";
  return "Compression";
}

/** Printed element. Lightning is the page's name for the thunder element. */
export function helixWord(name: string): string {
  const element = helixElement(name);
  if (element === "thunder") return "Lightning";
  if (element === "fire") return "Fire";
  if (element === "ice") return "Ice";
  if (element === "wind") return "Wind";
  if (element === "earth") return "Earth";
  if (element === "water") return "Water";
  if (element === "light") return "Light";
  return "Dark";
}

export function grimoireSide(spell: { school?: string; castGroup?: string; spike?: string; warp?: unknown }): "white" | "black" | null {
  if (spell.spike || spell.warp) return "black";
  if (spell.school === "healing" || spell.school === "divine") return "white";
  if (spell.school === "elemental" || spell.school === "dark") return "black";
  if (spell.school === "enfeebling") return spell.castGroup === "white" ? "white" : "black";
  if (spell.school === "enhancing") return "white";
  return null;
}

/** Arts MP. White under Light Arts, or black under Dark Arts, drops 10% rounded down when the cost is over 9. The other side rises 20% rounded up. Tabula Rasa gives both sides the cut and neither penalty. */
export function artsMp(cost: number, side: "white" | "black" | null, light: boolean, dark: boolean, tabula = false): number {
  if (cost <= 0 || side == null) return cost;
  if (tabula) return cost <= 9 ? cost : Math.floor(cost * 0.9);
  if (light && side === "white") return cost <= 9 ? cost : Math.floor(cost * 0.9);
  if (light && side === "black") return Math.ceil(cost * 1.2);
  if (dark && side === "black") return cost <= 9 ? cost : Math.floor(cost * 0.9);
  if (dark && side === "white") return Math.ceil(cost * 1.2);
  return cost;
}

/**
 * Arts cast or recast. Light Arts cuts white magic 10% and raises black magic 20%, both clocks.
 * Dark Arts cuts black magic 10% on both clocks and raises white cast time 20%.
 * White recast under Dark Arts is not printed, so it is left alone.
 * Tabula Rasa cuts both clocks 10% and does not lengthen either.
 */
export function artsClock(time: number, side: "white" | "black" | null, light: boolean, dark: boolean, which: "cast" | "recast", tabula = false): number {
  if (time <= 0 || side == null) return time;
  if (tabula) return time * 0.9;
  if (light && side === "white") return time * 0.9;
  if (light && side === "black") return time * 1.2;
  if (dark && side === "black") return time * 0.9;
  if (dark && side === "white" && which === "cast") return time * 1.2;
  return time;
}

type Know = { name: string; left?: number; power?: number; hold?: boolean; acc?: number };

function up(buffs: readonly Know[], name: string): boolean {
  return buffs.some((buff) => buff.name === name);
}

/** Addendum gate. A spell another equipped job already knows does not need it. Tabula Rasa opens both. */
export function addendumBlock(
  spell: Spell,
  buffs: readonly Know[],
  job: JobId,
  sub: JobId | null,
  mainLevel: number,
  subLevel: number,
): string | null {
  if (!spell.addendum) return null;
  if (job !== "SCH" && sub !== "SCH") return null;
  for (const other of spell.jobs) {
    if (other === "SCH") continue;
    const lv = other === job ? mainLevel : other === sub ? subLevel : 0;
    if (lv >= spellLevel(spell, other)) return null;
  }
  if (up(buffs, "Tabula Rasa")) return null;
  if (spell.addendum === "white") {
    if (!up(buffs, "Light Arts")) return "Addendum: White needs Light Arts.";
    if (!up(buffs, "Addendum: White")) return "Addendum: White is not up.";
    return null;
  }
  if (!up(buffs, "Dark Arts")) return "Addendum: Black needs Dark Arts.";
  if (!up(buffs, "Addendum: Black")) return "Addendum: Black is not up.";
  return null;
}

const MANIFEST = new Set(["Drain", "Aspir", "Bio", "Bio II", "Bio III", "Stun", "Kaustra", "Klimaform"]);
/** Helix is not in that set. The page says Manifestation does not spread a helix. */

function accessionSpell(spell: Spell): boolean {
  if (spell.raise || spell.reraise || spell.haste) return false;
  return spell.school === "enhancing" || spell.school === "healing";
}

function manifestationSpell(spell: Spell): boolean {
  if (MANIFEST.has(spell.name)) return true;
  return spell.school === "enfeebling" && grimoireSide(spell) === "black";
}

export type ScholarAdjust = {
  block: string | null;
  cost: number;
  cast: number;
  recast: number;
  spent: string[];
  cureMul: number;
  nukeMul: number;
  regenHp: number;
  regenSec: number;
};

/**
 * Cost and clocks for one Scholar cast.
 * Order: arts percent, then Penury or Parsimony, then Celerity or Alacrity on cast time only, then Accession or Manifestation.
 * Fast Cast and Elemental Celerity have already been applied by the caller.
 * Rapture is spent on any white-side spell. The 50% is only Cure, Curaga, divine damage, and Dia's hit and slip.
 * Ebullience is spent on any black-side spell. The 20% is elemental damage, Drain, Aspir, helix, and Bio's hit and slip.
 */
export function scholarCastAdjust(
  spell: Spell,
  buffs: readonly Know[],
  cost: number,
  cast: number,
  recast: number,
  job: JobId,
  sub: JobId | null,
  mainLevel = 75,
  subLevel = 37,
): ScholarAdjust {
  const none: ScholarAdjust = { block: null, cost, cast, recast, spent: [], cureMul: 1, nukeMul: 1, regenHp: 0, regenSec: 0 };
  if (job !== "SCH" && sub !== "SCH") return none;
  const block = addendumBlock(spell, buffs, job, sub, mainLevel, subLevel);
  if (block) return { ...none, block };
  const light = up(buffs, "Light Arts");
  const dark = up(buffs, "Dark Arts");
  const tabula = up(buffs, "Tabula Rasa");
  const side = grimoireSide(spell);
  let nextCost = artsMp(cost, side, light, dark, tabula);
  let nextCast = artsClock(cast, side, light, dark, "cast", tabula);
  let nextRecast = artsClock(recast, side, light, dark, "recast", tabula);
  const spent: string[] = [];
  if (side === "white" && up(buffs, "Penury")) {
    nextCost = Math.floor(nextCost / 2);
    spent.push("Penury");
  }
  if (side === "black" && up(buffs, "Parsimony")) {
    nextCost = Math.floor(nextCost / 2);
    spent.push("Parsimony");
  }
  if (side === "white" && up(buffs, "Celerity")) {
    nextCast *= 0.5;
    spent.push("Celerity");
  }
  if (side === "black" && up(buffs, "Alacrity")) {
    nextCast *= 0.5;
    spent.push("Alacrity");
  }
  if (up(buffs, "Accession") && accessionSpell(spell)) {
    nextCost *= 2;
    nextCast *= 2;
    spent.push("Accession");
  }
  if (up(buffs, "Manifestation") && manifestationSpell(spell)) {
    nextCost *= 3;
    nextCast *= 2;
    spent.push("Manifestation");
  }
  const schMain = job === "SCH";
  const schLevel = schMain ? mainLevel : subLevel;
  let regenHp = 0;
  let regenSec = 0;
  if (spell.regen && schMain) {
    if (tabula) {
      regenHp = TABULA_REGEN_HP;
      regenSec = TABULA_REGEN_SECONDS;
    } else if (light) {
      const bonus = lightArtsRegen(schLevel, true);
      regenHp = bonus.hp;
      regenSec = bonus.seconds;
    }
  }
  const diaLine = spell.name === "Dia" || spell.name === "Dia II" || spell.name === "Dia III" || spell.name === "Diaga";
  const cureMul = up(buffs, "Rapture") && (spell.school === "healing" || spell.school === "divine" || diaLine) ? 1.5 : 1;
  if (up(buffs, "Rapture") && side === "white") spent.push("Rapture");
  const bioLine = spell.name === "Bio" || spell.name === "Bio II" || spell.name === "Bio III";
  const nukeMul = up(buffs, "Ebullience") && (spell.school === "elemental" || spell.siphon != null || bioLine) ? 1.2 : 1;
  if (up(buffs, "Ebullience") && side === "black") spent.push("Ebullience");
  return { block: null, cost: nextCost, cast: nextCast, recast: nextRecast, spent, cureMul, nukeMul, regenHp, regenSec };
}

export type SchCastCtx = {
  recastLeft: number;
  schLevel: number;
  schMain: boolean;
  light: boolean;
  dark: boolean;
  tabula: boolean;
  charges: number;
  sublimation: number;
  sublimationComplete: boolean;
  helixLeft: number;
  /** Modus Veritas has already doubled this helix. */
  helixModus?: boolean;
  maxHp: number;
};

export type SchCast = {
  ok: boolean;
  text: string;
  recast?: number;
  buff?: { name: string; duration: number; power?: number; hold?: boolean };
  hate?: { ce: number; ve: number };
  replaces?: string[];
  /** Set the charge bank to this many and clear its timer. */
  charges?: number;
  /** MP returned by the second Sublimation. */
  sublimationMp?: number;
  /** Halve the helix still on the foe. */
  helixCut?: boolean;
  /** Spend one stratagem charge. */
  spend?: boolean;
};

const SCH_BY_NAME = new Map(SCH_ABILITIES.map((ability) => [ability.name, ability]));

export function castScholar(name: string, ctx: SchCastCtx): SchCast | null {
  const row = SCH_BY_NAME.get(name);
  if (!row) return null;
  if (ctx.schLevel < row.level || (!ctx.schMain && row.access !== "sub")) {
    return { ok: false, text: `${name} is not learned.` };
  }
  if (row.merit) return { ok: false, text: `${name} is not unlocked.` };
  const free = ctx.tabula && (row.stratagem != null || name === "Light Arts" || name === "Dark Arts");
  if (!free && ctx.recastLeft > 0) return { ok: false, text: `${name} is not ready.` };
  const bank = stratagemBank(ctx.schLevel, ctx.schMain ? "main" : "sub");
  if (row.stratagem) {
    const arts = row.stratagem === "light" ? ctx.light : ctx.dark;
    if (!arts && !ctx.tabula) {
      return { ok: false, text: `${name} needs ${row.stratagem === "light" ? "Light Arts" : "Dark Arts"}.` };
    }
    if (!ctx.tabula && ctx.charges < 1) return { ok: false, text: "No stratagem charge is ready." };
    const hate = { ce: 1, ve: 80 };
    return {
      ok: true,
      text: `${name}. ${ctx.tabula ? "Tabula Rasa spends no charge." : "One stratagem charge is spent."} Cumulative enmity 1, volatile enmity 80.`,
      recast: 0,
      buff: { name, duration: row.duration, hold: name.startsWith("Addendum") },
      hate,
      spend: !ctx.tabula,
    };
  }
  if (name === "Tabula Rasa") {
    return {
      ok: true,
      text: `Tabula Rasa. The stratagem bank is restored to ${bank.charges}. Cumulative enmity 1, volatile enmity 300.`,
      recast: row.recast,
      buff: { name, duration: row.duration },
      hate: { ce: 1, ve: 300 },
      charges: bank.charges,
    };
  }
  if (name === "Light Arts" || name === "Dark Arts") {
    const toLight = name === "Light Arts";
    const replaces = toLight
      ? ["Dark Arts", "Parsimony", "Addendum: Black", "Alacrity", "Manifestation", "Ebullience"]
      : ["Light Arts", "Penury", "Addendum: White", "Celerity", "Accession", "Rapture"];
    return {
      ok: true,
      text: `${name}. The other grimoire and its stratagems wear off. Recasting this arts does not remove its own. Cumulative enmity 1, volatile enmity 80.`,
      recast: free ? 0 : row.recast,
      buff: { name, duration: row.duration },
      hate: { ce: 1, ve: 80 },
      replaces,
    };
  }
  if (name === "Sublimation") {
    if (ctx.sublimation > 0 || ctx.sublimationComplete) {
      const extra = sublimationMp(ctx.schLevel);
      const total = ctx.sublimation + extra;
      return {
        ok: true,
        text: `Sublimation returns ${ctx.sublimation} MP, plus ${extra} for one tick that costs no HP.`,
        recast: row.recast,
        hate: { ce: 1, ve: 80 },
        replaces: ["Sublimation", "Sublimation: Complete"],
        sublimationMp: total,
      };
    }
    return {
      ok: true,
      text: `Sublimation. ${SUBLIMATION_HP} HP becomes ${sublimationMp(ctx.schLevel)} MP every ${SUBLIMATION_TICK} seconds. The tick gap is a stand-in. Refresh cannot stay up with it. Cumulative enmity 1, volatile enmity 80.`,
      recast: row.recast,
      buff: { name: "Sublimation", duration: row.duration, power: 0, hold: true },
      hate: { ce: 1, ve: 80 },
      replaces: ["Refresh"],
    };
  }
  if (name === "Modus Veritas") {
    if (ctx.helixLeft <= 0) return { ok: false, text: "Modus Veritas needs a Helix on the target." };
    if (ctx.helixModus) return { ok: false, text: "Modus Veritas has already been used on that Helix." };
    return {
      ok: true,
      text: "Modus Veritas. The time left on Helix is halved. Each tock is doubled, and a tock cannot pass 9999. Cumulative enmity 1, volatile enmity 80.",
      recast: row.recast,
      hate: { ce: 1, ve: 80 },
      helixCut: true,
    };
  }
  return { ok: false, text: `${name} is not learned.` };
}

export type ScholarTick = {
  buffs: Know[];
  hp: number;
  mp: number;
  logs: string[];
};

/** Charge regen and sublimation. Called once a combat tick while Scholar is equipped. */
export function tickScholar(
  buffs: readonly Know[],
  dt: number,
  schLevel: number,
  schMain: boolean,
  hp: number,
  maxHp: number,
  maxMp: number,
  mp: number,
): ScholarTick {
  const logs: string[] = [];
  let nextHp = hp;
  let nextMp = mp;
  let rows = buffs.map((buff) => ({ ...buff }));
  if (schLevel <= 0) {
    const drop = new Set(["Stratagem", "Light Arts", "Dark Arts", "Tabula Rasa", "Sublimation", "Sublimation: Complete", "Penury", "Celerity", "Accession", "Rapture", "Parsimony", "Alacrity", "Manifestation", "Ebullience", "Addendum: White", "Addendum: Black"]);
    return { buffs: rows.filter((buff) => !drop.has(buff.name)), hp, mp, logs };
  }
  const bank = stratagemBank(schLevel, schMain ? "main" : "sub");
  let strat = rows.find((buff) => buff.name === "Stratagem");
  if (!strat && bank.charges > 0) {
    strat = { name: "Stratagem", left: 7200, power: bank.charges, hold: true, acc: 0 };
    rows = [...rows, strat];
  }
  if (strat && bank.charges > 0 && bank.seconds > 0) {
    const power = Math.min(bank.charges, strat.power ?? 0);
    if (power < bank.charges) {
      let acc = (strat.acc ?? 0) + dt;
      let have = power;
      while (acc >= bank.seconds && have < bank.charges) {
        acc -= bank.seconds;
        have += 1;
      }
      if (have >= bank.charges) acc = 0;
      strat.power = have;
      strat.acc = acc;
      strat.left = 7200;
    } else {
      strat.power = bank.charges;
      strat.acc = 0;
    }
  }
  const charging = rows.find((buff) => buff.name === "Sublimation");
  if (charging) {
    const rate = sublimationMp(schLevel);
    const cap = Math.floor(maxHp * 0.5);
    let acc = (charging.acc ?? 0) + dt;
    let stored = charging.power ?? 0;
    while (acc >= SUBLIMATION_TICK && stored < cap && nextHp >= maxHp * 0.5) {
      acc -= SUBLIMATION_TICK;
      nextHp = Math.max(0, nextHp - SUBLIMATION_HP);
      stored += rate;
    }
    charging.acc = acc;
    charging.power = Math.min(cap, stored);
    if (stored >= cap || nextHp < maxHp * 0.5) {
      rows = rows.filter((buff) => buff.name !== "Sublimation");
      rows = [...rows, { name: "Sublimation: Complete", left: 120 * 60, power: Math.min(cap, stored) }];
      logs.push("Sublimation: Complete.");
    }
  }
  if (!rows.some((buff) => buff.name === "Light Arts")) {
    rows = rows.filter((buff) => buff.name !== "Addendum: White");
  }
  if (!rows.some((buff) => buff.name === "Dark Arts")) {
    rows = rows.filter((buff) => buff.name !== "Addendum: Black");
  }
  if (nextMp > maxMp) nextMp = maxMp;
  return { buffs: rows, hp: nextHp, mp: nextMp, logs };
}

export function assertSch(): void {
  const naked = characterBase("hume", "SCH", 75);
  if (
    naked.hp !== 971 ||
    naked.mp !== 464 ||
    naked.str !== 48 ||
    naked.dex !== 56 ||
    naked.vit !== 53 ||
    naked.agi !== 56 ||
    naked.int !== 61 ||
    naked.mnd !== 56 ||
    naked.chr !== 61
  ) {
    throw new Error(`Hume SCH 75 ${naked.hp}/${naked.mp}/${naked.str}/${naked.dex}/${naked.vit}/${naked.agi}/${naked.int}/${naked.mnd}/${naked.chr}`);
  }
  const one = characterBase("hume", "SCH", 1);
  if (one.hp !== 27 || one.mp !== 20 || one.str !== 5 || one.int !== 7 || one.chr !== 7) {
    throw new Error(`Hume SCH 1 ${one.hp}/${one.mp}/${one.str}/${one.int}/${one.chr}`);
  }
  if (schSkill("Club", 75) !== 230 || schSkill("Staff", 75) !== 230 || schSkill("Dagger", 75) !== 210) throw new Error("SCH combat skills");
  if (schSkill("Healing Magic", 75) !== 210 || schSkill("Elemental Magic", 75) !== 210 || schSkill("Evasion", 75) !== 200) throw new Error("SCH magic skills");
  if (schSkill("Sword", 75) !== 0) throw new Error("SCH has no sword");
  if (grimoireSkill("Healing Magic", 210, 75, [{ name: "Light Arts" }]) !== 256) throw new Error("Light Arts healing");
  if (grimoireSkill("Healing Magic", 276, 75, [{ name: "Light Arts" }]) !== 276) throw new Error("Light Arts does not lower a higher skill");
  if (grimoireSkill("Elemental Magic", 210, 75, [{ name: "Dark Arts" }]) !== 256) throw new Error("Dark Arts elemental");
  if (grimoireSkill("Elemental Magic", 0, 75, [{ name: "Dark Arts" }]) !== 256) throw new Error("Dark Arts raises a subjob to the main level");
  if (grimoireSkill("Healing Magic", 210, 75, []) !== 210) throw new Error("no arts");
  if (schClearMind(75, "main") !== 12 || schClearMind(37, "sub") !== 6 || schClearMind(19, "main") !== 0) throw new Error("SCH clear mind");
  if (schConserveMp(75) !== 0.25 || schConserveMp(24) !== 0) throw new Error("SCH conserve");
  if (schMaxMp(75) !== 10 || schMaxMp(37) !== 10 || schMaxMp(29) !== 0) throw new Error("SCH max MP");
  if (schResistSilence(75, "main") !== 0.2 || schResistSilence(37, "sub") !== 0.1) throw new Error("SCH resist silence");
  const mainBank = stratagemBank(75, "main");
  const subBank = stratagemBank(37, "sub");
  if (mainBank.charges !== 4 || mainBank.seconds !== 60 || subBank.charges !== 2 || subBank.seconds !== 120) throw new Error("stratagem bank");
  if (sublimationMp(75) !== 6 || sublimationMp(37) !== 2 || sublimationMp(34) !== 0) throw new Error("sublimation rate");
  const regen = lightArtsRegen(75, true);
  if (regen.hp !== 18 || regen.seconds !== 36 || lightArtsRegen(75, false).hp !== 0) throw new Error("light arts regen");
  if (darkArtsHelixBonus(75, true) !== 12 || darkArtsHelixBonus(99, true) !== 16 || darkArtsHelixBonus(75, false) !== 0 || darkArtsHelixBonus(37, true) !== 4) {
    throw new Error("dark arts helix");
  }
  const early = stepHelix({ name: "Helix", left: 90, dot: 28, acc: 5 }, 1);
  if (early.ticks.length !== 0 || early.row?.left !== 89 || early.row.acc !== 4) throw new Error("helix wait");
  const landed = stepHelix({ name: "Helix", left: 90, dot: 28, acc: 1 }, 1);
  if (landed.ticks.join() !== "28" || landed.row?.left !== 89 || landed.row.acc !== 10) throw new Error("helix tock");
  const expired = stepHelix({ name: "Helix", left: 2, dot: 28, acc: 5 }, 3);
  if (expired.row != null || expired.ticks.length !== 0) throw new Error("helix wore before the tock");
  const idle = stepHelix({ name: "Helix", left: 90, dot: 0, acc: 0 }, 1);
  if (idle.ticks.length !== 0 || idle.row?.left !== 89) throw new Error("helix zero");
  if (helixSeconds(75) !== 90 || helixSeconds(37) !== 30 || helixSeconds(50) !== 60) throw new Error("helix duration");
  if (artsMp(24, "white", true, false) !== 21 || artsMp(8, "white", true, false) !== 8 || artsMp(24, "black", true, false) !== 29) {
    throw new Error("light arts MP");
  }
  if (artsMp(22, "white", true, false) !== 19) throw new Error("penury base");
  if (artsClock(10, "white", true, false, "cast") !== 9 || artsClock(10, "black", false, true, "recast") !== 9) throw new Error("arts clock");
  if (artsClock(10, "white", false, true, "recast") !== 10 || artsClock(10, "white", false, true, "cast") !== 12) throw new Error("dark arts white recast");
  if (artsMp(24, "black", true, false, true) !== 21 || artsMp(8, "white", false, false, true) !== 8) throw new Error("tabula mp");
  if (artsClock(10, "white", false, true, "cast", true) !== 9 || artsClock(10, "black", true, false, "recast", true) !== 9) throw new Error("tabula clock");
  const penury = castScholar("Penury", {
    recastLeft: 0, schLevel: 75, schMain: true, light: true, dark: false, tabula: false, charges: 4,
    sublimation: 0, sublimationComplete: false, helixLeft: 0, maxHp: 971,
  });
  if (!penury?.ok || !penury.spend || penury.buff?.name !== "Penury") throw new Error("penury");
  const broke = castScholar("Penury", {
    recastLeft: 0, schLevel: 75, schMain: true, light: false, dark: false, tabula: false, charges: 4,
    sublimation: 0, sublimationComplete: false, helixLeft: 0, maxHp: 971,
  });
  if (broke?.ok) throw new Error("penury without arts");
  const free = castScholar("Ebullience", {
    recastLeft: 0, schLevel: 75, schMain: true, light: false, dark: false, tabula: true, charges: 0,
    sublimation: 0, sublimationComplete: false, helixLeft: 0, maxHp: 971,
  });
  if (!free?.ok || free.spend) throw new Error("tabula stratagem");
  const subRapture = castScholar("Rapture", {
    recastLeft: 0, schLevel: 37, schMain: false, light: true, dark: false, tabula: false, charges: 2,
    sublimation: 0, sublimationComplete: false, helixLeft: 0, maxHp: 400,
  });
  if (subRapture?.ok) throw new Error("sub rapture");
  const merit = castScholar("Enlightenment", {
    recastLeft: 0, schLevel: 75, schMain: true, light: true, dark: false, tabula: false, charges: 4,
    sublimation: 0, sublimationComplete: false, helixLeft: 0, maxHp: 971,
  });
  if (merit?.ok) throw new Error("enlightenment");
  const back = castScholar("Sublimation", {
    recastLeft: 0, schLevel: 75, schMain: true, light: false, dark: false, tabula: false, charges: 4,
    sublimation: 12, sublimationComplete: false, helixLeft: 0, maxHp: 971,
  });
  if (!back?.ok || back.sublimationMp !== 18) throw new Error("sublimation return");
  const switched = castScholar("Dark Arts", {
    recastLeft: 0, schLevel: 75, schMain: true, light: true, dark: false, tabula: false, charges: 4,
    sublimation: 0, sublimationComplete: false, helixLeft: 0, maxHp: 971,
  });
  if (!switched?.ok || !switched.replaces?.includes("Penury") || !switched.replaces.includes("Addendum: White") || !switched.replaces.includes("Rapture") || switched.replaces.includes("Parsimony")) {
    throw new Error("dark arts replaces");
  }
  const kept = castScholar("Light Arts", {
    recastLeft: 0, schLevel: 75, schMain: true, light: true, dark: false, tabula: false, charges: 4,
    sublimation: 0, sublimationComplete: false, helixLeft: 0, maxHp: 971,
  });
  const keptReplaces = kept?.replaces ?? [];
  if (!kept?.ok || keptReplaces.includes("Penury") || keptReplaces.includes("Celerity") || !keptReplaces.includes("Parsimony") || !keptReplaces.includes("Addendum: Black") || !keptReplaces.includes("Ebullience")) {
    throw new Error("light arts keeps its stratagems");
  }
  const opened = castScholar("Sublimation", {
    recastLeft: 0, schLevel: 75, schMain: true, light: false, dark: false, tabula: false, charges: 4,
    sublimation: 0, sublimationComplete: false, helixLeft: 0, maxHp: 971,
  });
  if (!opened?.ok || !opened.replaces?.includes("Refresh")) throw new Error("sublimation refresh");
  const cure2 = spellByName("Cure II");
  const stone = spellByName("Stone");
  const dia = spellByName("Dia");
  const skin = spellByName("Stoneskin");
  const sleep = spellByName("Sleep");
  const bio = spellByName("Bio");
  const drain = spellByName("Drain");
  if (!cure2 || !stone || !dia || !skin || !sleep || !bio || !drain) throw new Error("sch spell cards");
  const tabulaCure = scholarCastAdjust(cure2, [{ name: "Tabula Rasa" }, { name: "Light Arts" }], 24, 10, 10, "SCH", null);
  if (tabulaCure.cost !== 21 || tabulaCure.cast !== 9 || tabulaCure.recast !== 9) throw new Error(`tabula cure ${tabulaCure.cost}/${tabulaCure.cast}/${tabulaCure.recast}`);
  const tabulaStone = scholarCastAdjust(stone, [{ name: "Tabula Rasa" }, { name: "Light Arts" }], 24, 10, 10, "SCH", null);
  if (tabulaStone.cost !== 21 || tabulaStone.cast !== 9 || tabulaStone.recast !== 9) throw new Error(`tabula stone ${tabulaStone.cost}/${tabulaStone.cast}/${tabulaStone.recast}`);
  const lightStone = scholarCastAdjust(stone, [{ name: "Light Arts" }], 24, 10, 10, "SCH", null);
  if (lightStone.cost !== 29 || lightStone.cast !== 12 || lightStone.recast !== 12) throw new Error(`light stone penalty ${lightStone.cost}`);
  const raptureDia = scholarCastAdjust(dia, [{ name: "Rapture" }, { name: "Light Arts" }], 7, 1, 5, "SCH", null);
  if (raptureDia.cureMul !== 1.5 || !raptureDia.spent.includes("Rapture")) throw new Error("rapture dia");
  const raptureSkin = scholarCastAdjust(skin, [{ name: "Rapture" }], 29, 7, 30, "SCH", null);
  if (raptureSkin.cureMul !== 1 || !raptureSkin.spent.includes("Rapture")) throw new Error("rapture stoneskin");
  const raptureCure = scholarCastAdjust(cure2, [{ name: "Rapture" }], 24, 2, 5, "SCH", null);
  if (raptureCure.cureMul !== 1.5 || !raptureCure.spent.includes("Rapture")) throw new Error("rapture cure");
  const ebulSleep = scholarCastAdjust(sleep, [{ name: "Ebullience" }, { name: "Dark Arts" }, { name: "Addendum: Black" }], 19, 2.5, 30, "SCH", null);
  if (ebulSleep.nukeMul !== 1 || !ebulSleep.spent.includes("Ebullience")) throw new Error("ebullience sleep");
  const ebulBio = scholarCastAdjust(bio, [{ name: "Ebullience" }], 15, 1.5, 5, "SCH", null);
  if (ebulBio.nukeMul !== 1.2 || !ebulBio.spent.includes("Ebullience")) throw new Error("ebullience bio");
  const ebulDrain = scholarCastAdjust(drain, [{ name: "Ebullience" }], 21, 3, 60, "SCH", null);
  if (ebulDrain.nukeMul !== 1.2 || !ebulDrain.spent.includes("Ebullience")) throw new Error("ebullience drain");
  const ebulStone = scholarCastAdjust(stone, [{ name: "Ebullience" }], 4, 0.5, 2, "SCH", null);
  if (ebulStone.nukeMul !== 1.2 || !ebulStone.spent.includes("Ebullience")) throw new Error("ebullience stone");
  if (
    helixElement("Pyrohelix") !== "fire" ||
    helixElement("Cryohelix") !== "ice" ||
    helixElement("Anemohelix") !== "wind" ||
    helixElement("Geohelix") !== "earth" ||
    helixElement("Ionohelix") !== "thunder" ||
    helixElement("Hydrohelix") !== "water" ||
    helixElement("Luminohelix") !== "light" ||
    helixElement("Noctohelix") !== "dark" ||
    helixProperty("Pyrohelix") !== "Liquefaction" ||
    helixProperty("Cryohelix") !== "Induration" ||
    helixProperty("Anemohelix") !== "Detonation" ||
    helixProperty("Geohelix") !== "Scission" ||
    helixProperty("Ionohelix") !== "Impaction" ||
    helixProperty("Hydrohelix") !== "Reverberation" ||
    helixProperty("Luminohelix") !== "Transfixion" ||
    helixProperty("Noctohelix") !== "Compression" ||
    helixWord("Ionohelix") !== "Lightning" ||
    helixWord("Noctohelix") !== "Dark"
  ) {
    throw new Error("helix element");
  }
  const pyrohelix = spellByName("Pyrohelix");
  if (!pyrohelix) throw new Error("pyrohelix card");
  const manifestHelix = scholarCastAdjust(pyrohelix, [{ name: "Manifestation" }, { name: "Dark Arts" }], 26, 5, 45, "SCH", null);
  if (manifestHelix.spent.includes("Manifestation")) throw new Error("manifestation does not spread helix");
  const ebulHelix = scholarCastAdjust(pyrohelix, [{ name: "Ebullience" }, { name: "Dark Arts" }], 26, 5, 45, "SCH", null);
  if (ebulHelix.nukeMul !== 1.2 || !ebulHelix.spent.includes("Ebullience") || ebulHelix.cost !== 23) throw new Error("ebullience helix");
  const sand = spellByName("Sandstorm");
  const klima = spellByName("Klimaform");
  if (!sand?.storm || sand.mp !== STORM_MP || sand.cast !== STORM_CAST || sand.recast !== STORM_RECAST || sand.range !== STORM_RANGE || sand.school !== "enhancing" || sand.jobLevel?.SCH !== 41 || sand.storm.element !== "earth" || sand.storm.sky !== "dusty") {
    throw new Error("sandstorm card");
  }
  if (!klima?.klimaform || klima.school !== "dark" || klima.mp !== KLIMAFORM_MP || klima.cast !== KLIMAFORM_CAST || klima.recast !== KLIMAFORM_RECAST || klima.self !== true || klima.jobLevel?.SCH !== 46 || castElement(klima) !== "dark") {
    throw new Error("klimaform card");
  }
  if (stormByName("Thunderstorm")?.sky !== "thundery" || stormByName("Sandstorm")?.stat !== "VIT" || stormByName("Rainstorm")?.stat !== "MND" || stormByName("Windstorm")?.stat !== "AGI" || stormByName("Firestorm")?.stat !== "STR" || stormByName("Hailstorm")?.stat !== "INT" || stormByName("Thunderstorm")?.stat !== "DEX" || stormByName("Voidstorm")?.stat !== "all" || stormByName("Aurorastorm")?.stat !== "CHR" || stormByName("Aurorastorm")?.sky !== "auroras") {
    throw new Error("storm words");
  }
  if (STORMS.map((row) => `${row.name}:${row.level}:${row.element}`).join(",") !== "Sandstorm:41:earth,Rainstorm:42:water,Windstorm:43:wind,Firestorm:44:fire,Hailstorm:45:ice,Thunderstorm:46:thunder,Voidstorm:47:dark,Aurorastorm:48:light") {
    throw new Error("storm order");
  }
  if (spellByName("Sandstorm II") || spellByName("Aurorastorm II")) throw new Error("storm II is not in this kit");
  const dusty = weatherAdjusted(100, "earth", [{ name: "Sandstorm" }]);
  const blown = weatherAdjusted(100, "wind", [{ name: "Sandstorm" }]);
  const neutral = weatherAdjusted(100, "fire", [{ name: "Sandstorm" }]);
  const clear = weatherAdjusted(100, "earth", []);
  if (dusty.value !== 110 || !dusty.note.includes("10% higher") || blown.value !== 90 || !blown.note.includes("10% lower") || neutral.value !== 100 || neutral.note !== "" || clear.value !== 100) {
    throw new Error("storm weather");
  }
  if (klimaformMacc("earth", [{ name: "Klimaform" }, { name: "Sandstorm" }]) !== 15 || klimaformMacc("fire", [{ name: "Klimaform" }, { name: "Sandstorm" }]) !== 0 || klimaformMacc("earth", [{ name: "Klimaform" }]) !== 0) {
    throw new Error("klimaform accuracy");
  }
  if (!klima || !sand) throw new Error("storm cards");
  const darkKlima = scholarCastAdjust(klima, [{ name: "Dark Arts" }, { name: "Manifestation" }], KLIMAFORM_MP, KLIMAFORM_CAST, KLIMAFORM_RECAST, "SCH", null);
  if (darkKlima.cost !== 81 || darkKlima.cast !== 5.4 || !darkKlima.spent.includes("Manifestation")) throw new Error("klimaform manifestation");
  const lightSand = scholarCastAdjust(sand, [{ name: "Light Arts" }, { name: "Accession" }], STORM_MP, STORM_CAST, STORM_RECAST, "SCH", null);
  if (lightSand.cost !== 54 || lightSand.cast !== 3.6 || !lightSand.spent.includes("Accession")) throw new Error("sandstorm accession");
  const closed = scholarCastAdjust(sleep, [], 19, 2.5, 30, "SCH", null);
  if (closed.block !== "Addendum: Black needs Dark Arts.") throw new Error(`sleep gate ${closed.block}`);
  const artsOnly = scholarCastAdjust(sleep, [{ name: "Dark Arts" }], 19, 2.5, 30, "SCH", null);
  if (artsOnly.block !== "Addendum: Black is not up.") throw new Error(`sleep addendum ${artsOnly.block}`);
  const sleepOpen = scholarCastAdjust(sleep, [{ name: "Dark Arts" }, { name: "Addendum: Black" }], 19, 2.5, 30, "SCH", null);
  if (sleepOpen.block != null) throw new Error("sleep open");
  const tabulaSleep = scholarCastAdjust(sleep, [{ name: "Tabula Rasa" }], 19, 2.5, 30, "SCH", null);
  if (tabulaSleep.block != null) throw new Error("tabula opens sleep");
  const known = scholarCastAdjust(sleep, [], 19, 2.5, 30, "SCH", "BLM", 75, 37);
  if (known.block != null) throw new Error("sch/blm sleep");
  const still = scholarCastAdjust(sleep, [], 19, 2.5, 30, "SCH", "WHM", 75, 37);
  if (still.block !== "Addendum: Black needs Dark Arts.") throw new Error("sch/whm sleep");
  const spikes = spellByName("Blaze Spikes");
  const raised = spellByName("Raise");
  const stona = spellByName("Stona");
  const silena = spellByName("Silena");
  if (!spikes || !raised || !stona || !silena) throw new Error("addendum cards");
  if (scholarCastAdjust(spikes, [], spikes.mp ?? 0, spikes.cast ?? 0, spikes.recast ?? 0, "SCH", null).block != null) throw new Error("spikes gate");
  if (scholarCastAdjust(raised, [], raised.mp ?? 0, raised.cast ?? 0, raised.recast ?? 0, "SCH", null).block != null) throw new Error("raise gate");
  if (scholarCastAdjust(silena, [], silena.mp ?? 0, silena.cast ?? 0, silena.recast ?? 0, "SCH", "WHM", 75, 37).block != null) throw new Error("sch/whm silena");
  const stonaGate = scholarCastAdjust(stona, [{ name: "Light Arts" }], stona.mp ?? 0, stona.cast ?? 0, stona.recast ?? 0, "SCH", "WHM", 75, 37);
  if (stonaGate.block !== "Addendum: White is not up.") throw new Error(`stona gate ${stonaGate.block}`);
  const stoneFour = spellByName("Stone IV");
  if (!stoneFour || scholarCastAdjust(stoneFour, [], stoneFour.mp ?? 0, stoneFour.cast ?? 0, stoneFour.recast ?? 0, "BLM", "SCH", 75, 37).block != null) {
    throw new Error("blm/sch stone iv");
  }
}
