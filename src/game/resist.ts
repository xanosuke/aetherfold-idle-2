import { dStatMagicAccuracy, elementResisted } from "./magic";
import { harboredResistance } from "./run";
import { skillCap } from "./skills";
import { weakenedMagicEvasion } from "./dnc";

/**
 * Resist chart. Level 75, no merits.
 *
 * Magic hit rate is dMAcc against magic evasion.
 * Below 0 it is 50 + floor(dMAcc / 2). At 0 and above it is 50 + dMAcc.
 * The rate stops at 95. A negative result is 0.
 *
 * Damaging magic then climbs resist states: full, 1/2, 1/4, 1/8.
 * 1/8 still deals damage. The published distribution stops there.
 * A fixed-duration enfeeble stops one step sooner: full duration, half, or a resist.
 * Bind, Gravity, and Stun are not on that duration step. Their shorter lengths were not published.
 * Dia and Inundation cannot be resisted. Bio's hit and its status are separate rolls.
 *
 * An elemental resistance rank multiplies the target's base magic evasion.
 * The printed table runs from 150% (low resistance) to 5% (high resistance).
 * Monsters use C on the combat skill table. 100% is ×1.
 * The Tropical Rarab has no published rank, so it stays 100%.
 * A player's base magic evasion is G rank. No job shows that letter, so it is not a SkillRank.
 * G is the skill-cap column: 171 at 75. It stays 1:1. The 0.9 step is physical evasion, not this.
 * Rank 5 or lower forces the last damage state. Rank 10 or lower holds the hit rate at 5%.
 * Rank 50 or lower is the high-resistance side of the table, not every rank of 50 and up.
 * That side is at least a half resist for damage. A 100% target is not forced to half.
 *
 * One bar-element point is one magic evasion against that element.
 * One equipment-screen point is the same. Harbored runes add theirs to the element they resist.
 * A player with none of that stops at 1/4. A positive total can reach 1/8. A negative total stops at 1/2.
 * A carol is magic evasion against its element. It is not that screen number, so it does not open 1/8 by itself.
 * One area bar-status point is one magic evasion against that status. The area value is 20.
 * A self-target status bar would be 30. This kit has none.
 * Frazzle, Weakened Daze, a matching ninjutsu resist down, and a matching Threnody subtract from magic evasion.
 *
 * Resist traits and resist gear are a separate check, not magic evasion.
 * One point is 1% against a normal monster and 0.5% against a notorious monster.
 * The check stops at 90%. Food is not in this yard.
 * Dust Cloud is a skill-less magical mobskill, so its magic accuracy is the A+ cap plus dINT.
 * The Tropical Rarab has no printed magic accuracy of its own. The blind is still Resist Blind, not this chart.
 */

export const NEUTRAL_RANK = 100;

export function magicHitRate(dMacc: number): number {
  const raw = dMacc < 0 ? 50 + Math.floor(dMacc / 2) : 50 + dMacc;
  return Math.min(95, Math.max(0, raw));
}

/** Monster base magic evasion. C rank on the combat skill table. */
export function monsterMagicEvasion(level: number): number {
  return skillCap("C", level);
}

/**
 * Player and trust base magic evasion. G rank on the same skill-cap table.
 * Levels 1–50 are (level − 1) × 2 + 3. 51–70 add 3 a level from 101. 71–75 add 2 a level from 161.
 * Above 75 stays at 171. This kit does not use the later columns.
 */
export function playerMagicEvasion(level: number): number {
  if (level <= 0) return 0;
  if (level > 75) level = 75;
  if (level <= 50) return (level - 1) * 2 + 3;
  if (level <= 70) return 101 + (level - 50) * 3;
  return 161 + (level - 70) * 2;
}

/** A magical mobskill with no magic skill. Dust Cloud is one. The base is the A+ cap. */
export function skilllessMagicAccuracy(level: number): number {
  return skillCap("A+", level);
}

/** Resistance rank, as printed, to the magic evasion multiplier. */
export const ELEMENTAL_RANK_MEVA: Readonly<Record<number, number>> = {
  150: 0.95,
  130: 0.96019,
  115: 0.98,
  100: 1,
  85: 1.023,
  70: 1.049,
  60: 1.0905,
  50: 1.126,
  40: 1.2075,
  30: 1.3475,
  25: 1.70065,
  20: 2.141,
  15: 2.65,
  10: 5,
  5: 10,
};

export function elementalMeva(base: number, rankPercent: number): number {
  const mult = ELEMENTAL_RANK_MEVA[rankPercent] ?? 1;
  return Math.max(0, Math.floor(base * mult));
}

/** Skill, plus dSTAT magic accuracy, plus a printed spell bonus. Ninjutsu passes a null dSTAT. */
export function composedMagicAccuracy(skill: number, dStat: number | null, bonus = 0): number {
  const fromStat = dStat == null ? 0 : dStatMagicAccuracy(dStat);
  return Math.floor(skill) + fromStat + bonus;
}

export function canonElement(element: string): string {
  return element === "lightning" ? "thunder" : element;
}

/** Ninjutsu resist-down name to the element a later spell has to match. */
export function resistDownElement(name: string): string | null {
  if (name === "Fire Resist Down") return "fire";
  if (name === "Ice Resist Down") return "ice";
  if (name === "Wind Resist Down") return "wind";
  if (name === "Earth Resist Down") return "earth";
  if (name === "Lightning Resist Down") return "thunder";
  if (name === "Water Resist Down") return "water";
  return null;
}

/** Light Threnody lowers light. The song's own element is the opposite. */
export function threnodyElement(spellName: string): string | null {
  const word = spellName.split(" ")[0]?.toLowerCase() ?? "";
  if (word === "lightning") return "thunder";
  if (word === "light" || word === "dark" || word === "earth" || word === "water" || word === "wind" || word === "fire" || word === "ice") {
    return word;
  }
  return null;
}

/**
 * Magic evasion for one element.
 * Rank multiplies the C-rank base. Frazzle subtracts from every element.
 * A resist down or Threnody subtracts only when its element matches.
 */
export function adjustedMagicEvasion(
  level: number,
  element: string | null,
  rows: readonly { name: string; power?: number; element?: string }[],
  rank = NEUTRAL_RANK,
): number {
  let meva = elementalMeva(monsterMagicEvasion(level), rank);
  const want = element ? canonElement(element) : null;
  for (const row of rows) {
    const power = Math.max(0, row.power ?? 0);
    if (power <= 0) continue;
    if (row.name === "Frazzle") meva -= power;
    else if (row.name === "Weakened Daze") meva -= weakenedMagicEvasion(power);
    else if (want && row.name === "Threnody" && row.element === want) meva -= power;
    else if (want && resistDownElement(row.name) === want) meva -= power;
  }
  return Math.max(0, meva);
}

/** 0 is full damage. 3 is 1/8. `ceiling` stops a player who has no elemental resistance at 1/4. */
export function elementalResistState(
  dMacc: number,
  rankPercent: number,
  next: () => number,
  ceiling: 1 | 2 | 3 = 3,
): 0 | 1 | 2 | 3 {
  if (rankPercent <= 5) return 3;
  let rate = magicHitRate(dMacc);
  if (rankPercent <= 10) rate = Math.min(rate, 5);
  const p = rate / 100;
  let state = 0;
  while (state < ceiling && next() > p) state += 1;
  const floor = rankPercent <= 50 ? 1 : 0;
  return Math.min(ceiling, state < floor ? floor : state) as 0 | 1 | 2 | 3;
}

export function resistedDamage(raw: number, state: 0 | 1 | 2 | 3): number {
  return Math.floor(Math.max(0, raw) / 2 ** state);
}

/** 0 keeps the duration. 1 halves it. 2 is a full resist. */
export function fixedEnfeebleState(dMacc: number, next: () => number): 0 | 1 | 2 {
  const p = magicHitRate(dMacc) / 100;
  let state = 0;
  while (state < 2 && next() > p) state += 1;
  return state as 0 | 1 | 2;
}

export function halvedDuration(seconds: number): number {
  return Math.floor(Math.max(0, seconds) / 2);
}

export function applyFixedDuration(seconds: number, dMacc: number, next: () => number): { state: 0 | 1 | 2; left: number } {
  const state = fixedEnfeebleState(dMacc, next);
  if (state === 2) return { state, left: 0 };
  if (state === 1) return { state, left: halvedDuration(seconds) };
  return { state, left: seconds };
}

export function statusResistChance(points: number, notorious = false): number {
  const per = notorious ? 0.5 : 1;
  return Math.min(0.9, Math.max(0, points) * per / 100);
}

export function statusResisted(points: number, notorious: boolean, roll: number): boolean {
  const chance = statusResistChance(points, notorious);
  return chance > 0 && roll < chance;
}

export function resistFractionLabel(state: number): string {
  if (state <= 0) return "";
  return `1/${2 ** state}`;
}

const CAROL_ELEMENT: Record<string, string> = {
  "Fire Carol": "fire",
  "Ice Carol": "ice",
  "Wind Carol": "wind",
  "Earth Carol": "earth",
  "Lightning Carol": "thunder",
  "Water Carol": "water",
  "Light Carol": "light",
  "Dark Carol": "dark",
};

/** Carol magic evasion for one element. Not the equipment-screen resistance. */
export function carolMagicEvasion(buffs: readonly { name: string; power?: number }[], element: string): number {
  const want = element === "lightning" ? "thunder" : element;
  let total = 0;
  for (const buff of buffs) {
    if ((buff.power ?? 0) <= 0) continue;
    if (CAROL_ELEMENT[buff.name] === want) total += buff.power ?? 0;
  }
  return total;
}

/**
 * The eight equipment-screen dots.
 * Harbored runes and an elemental bar spell. Status bars, carols, and wards are not this number.
 */
export function chartResistance(
  buffs: readonly { name: string; power?: number }[],
  runLevel: number,
): Record<string, number> {
  const out = harboredResistance(buffs, runLevel);
  for (const buff of buffs) {
    const element = elementResisted(buff.name);
    if (!element || (buff.power ?? 0) <= 0) continue;
    out[element] += buff.power ?? 0;
  }
  return out;
}

/** Positive screen resistance can reach 1/8. None stops at 1/4. A negative total stops at 1/2. */
export function playerResistCeiling(elementalResistance: number): 1 | 2 | 3 {
  if (elementalResistance < 0) return 1;
  if (elementalResistance === 0) return 2;
  return 3;
}

/**
 * Incoming magical mobskill on a player or trust.
 * Magic accuracy is the A+ cap plus dINT. Magic evasion is G, plus the screen resistance, plus a carol.
 * The ceiling reads only the screen number. Day, weather, and Vallation's damage cut stay out.
 */
export function resistIncomingMagic(
  raw: number,
  caster: { level: number; int: number },
  target: { level: number; int: number; elementalResistance: number; extraEvasion: number },
  next: () => number,
  casterMacc = 0,
): { state: 0 | 1 | 2 | 3; damage: number; macc: number; meva: number } {
  const macc = composedMagicAccuracy(skilllessMagicAccuracy(caster.level), caster.int - target.int, casterMacc);
  const meva = playerMagicEvasion(target.level) + target.elementalResistance + target.extraEvasion;
  const state = elementalResistState(macc - meva, NEUTRAL_RANK, next, playerResistCeiling(target.elementalResistance));
  return { state, damage: resistedDamage(raw, state), macc, meva };
}

/** Job-book sentence for a damaging spell. The evasion is the naked monster, before Frazzle. */
export function damageChart(macc: number, meva: number): string {
  const rate = magicHitRate(macc - meva);
  return `Magic accuracy ${macc} against magic evasion ${meva} keeps each step ${rate}% of the time. A miss cuts the hit to 1/2, then 1/4, then 1/8. 1/8 still deals damage. The Tropical Rarab has no published resistance rank, so 100% is not forced to half. Day, weather, and staff stay out. Frazzle and a matching resist down are not in this ${meva}.`;
}

/** Job-book sentence for a fixed-duration enfeeble. */
export function durationChart(macc: number, meva: number, seconds: number): string {
  const rate = magicHitRate(macc - meva);
  const half = halvedDuration(seconds);
  return `Magic accuracy ${macc} against magic evasion ${meva} keeps each step ${rate}% of the time. One miss cuts ${seconds} seconds to ${half}. A second miss resists the status. Frazzle and a matching resist down are not in this ${meva}.`;
}

export function assertResist(): void {
  if (magicHitRate(0) !== 50 || magicHitRate(10) !== 60 || magicHitRate(45) !== 95 || magicHitRate(80) !== 95) {
    throw new Error("magic hit rate");
  }
  if (magicHitRate(-10) !== 45 || magicHitRate(-11) !== 44 || magicHitRate(-100) !== 0 || magicHitRate(-101) !== 0) {
    throw new Error("negative dMAcc");
  }
  if (monsterMagicEvasion(75) !== 225 || monsterMagicEvasion(1) !== 5) throw new Error("monster magic evasion");
  if (playerMagicEvasion(1) !== 3 || playerMagicEvasion(37) !== 75 || playerMagicEvasion(50) !== 101) throw new Error("player magic evasion");
  if (playerMagicEvasion(51) !== 104 || playerMagicEvasion(60) !== 131 || playerMagicEvasion(70) !== 161) throw new Error("player magic evasion rise");
  if (playerMagicEvasion(71) !== 163 || playerMagicEvasion(75) !== 171 || playerMagicEvasion(99) !== 171 || playerMagicEvasion(0) !== 0) {
    throw new Error("player magic evasion cap");
  }
  if (skilllessMagicAccuracy(75) !== 276) throw new Error("skill-less magic accuracy");
  if (playerResistCeiling(0) !== 2 || playerResistCeiling(42) !== 3 || playerResistCeiling(-1) !== 1) throw new Error("player resist ceiling");
  if (carolMagicEvasion([{ name: "Earth Carol", power: 40 }], "earth") !== 40) throw new Error("earth carol");
  if (carolMagicEvasion([{ name: "Lightning Carol", power: 40 }], "earth") !== 0) throw new Error("other carol");
  const naked = resistIncomingMagic(154, { level: 75, int: 58 }, { level: 75, int: 56, elementalResistance: 0, extraEvasion: 0 }, () => 0);
  if (naked.macc !== 278 || naked.meva !== 171 || naked.state !== 0 || naked.damage !== 154) throw new Error("naked dust cloud");
  const quarter = resistIncomingMagic(154, { level: 75, int: 58 }, { level: 75, int: 56, elementalResistance: 0, extraEvasion: 0 }, () => 0.99);
  if (quarter.state !== 2 || quarter.damage !== 38) throw new Error("no earth resistance stops at 1/4");
  const eighth = resistIncomingMagic(154, { level: 75, int: 58 }, { level: 75, int: 56, elementalResistance: 42, extraEvasion: 0 }, () => 0.99);
  if (eighth.state !== 3 || eighth.meva !== 213 || eighth.damage !== 19) throw new Error("one earth rune opens 1/8");
  const stacked = resistIncomingMagic(154, { level: 75, int: 58 }, { level: 75, int: 56, elementalResistance: 126, extraEvasion: 40 }, () => 0);
  if (stacked.meva !== 337 || stacked.macc !== 278 || magicHitRate(stacked.macc - stacked.meva) !== 20) throw new Error("three runes and a carol");
  const dots = chartResistance([{ name: "Ignis", power: 2 }, { name: "Barstone", power: 10 }, { name: "Lightning Carol", power: 40 }], 75);
  if (dots.ice !== 84 || dots.earth !== 10 || dots.fire !== 0) throw new Error("resistance chart");
  if (elementalMeva(225, 100) !== 225 || elementalMeva(100, 150) !== 95 || elementalMeva(100, 10) !== 500) {
    throw new Error("elemental rank");
  }
  if (elementalMeva(225, 99) !== 225) throw new Error("unknown rank stays at 1");
  if (composedMagicAccuracy(276, 12, 0) !== 276 + dStatMagicAccuracy(12)) throw new Error("skill plus dSTAT");
  if (composedMagicAccuracy(269, null, 0) !== 269) throw new Error("ninjutsu has no dSTAT");
  if (adjustedMagicEvasion(75, "fire", []) !== 225) throw new Error("naked hare evasion");
  if (adjustedMagicEvasion(75, "fire", [{ name: "Frazzle", power: 35 }]) !== 190) throw new Error("frazzle");
  if (adjustedMagicEvasion(75, "fire", [{ name: "Weakened Daze", power: 1 }]) !== 222) throw new Error("weakened daze");
  if (adjustedMagicEvasion(75, "fire", [{ name: "Weakened Daze", power: 10 }]) !== 195) throw new Error("weakened daze ten");
  if (adjustedMagicEvasion(75, "ice", [{ name: "Ice Resist Down", power: 30 }]) !== 195) throw new Error("resist down");
  if (adjustedMagicEvasion(75, "fire", [{ name: "Ice Resist Down", power: 30 }]) !== 225) throw new Error("other element");
  if (adjustedMagicEvasion(75, "light", [{ name: "Threnody", power: 50, element: "light" }]) !== 175) throw new Error("threnody");
  if (adjustedMagicEvasion(75, "dark", [{ name: "Threnody", power: 50, element: "light" }]) !== 225) throw new Error("threnody element");
  if (threnodyElement("Light Threnody") !== "light" || threnodyElement("Lightning Threnody") !== "thunder") throw new Error("threnody name");
  if (elementalResistState(999, 100, () => 0) !== 0) throw new Error("a sure hit does not resist");
  if (elementalResistState(0, 100, () => 0.99) !== 3) throw new Error("three misses reach 1/8");
  if (resistedDamage(80, 0) !== 80 || resistedDamage(80, 1) !== 40 || resistedDamage(80, 2) !== 20 || resistedDamage(80, 3) !== 10) {
    throw new Error("resist damage");
  }
  if (elementalResistState(999, 5, () => 0) !== 3) throw new Error("5% rank");
  if (elementalResistState(0, 40, () => 0) !== 1) throw new Error("high resistance is at least a half resist");
  if (elementalResistState(999, 100, () => 0) !== 0) throw new Error("100% is not forced to half");
  let step = 0;
  const ten = elementalResistState(999, 10, () => (step++ === 0 ? 0.04 : 0));
  if (ten !== 1) throw new Error("10% rank");
  if (fixedEnfeebleState(0, () => 0.9) !== 2) throw new Error("enfeeble resist");
  step = 0;
  if (fixedEnfeebleState(0, () => (step++ === 0 ? 0.9 : 0)) !== 1) throw new Error("half enfeeble");
  if (halvedDuration(60) !== 30 || halvedDuration(90) !== 45 || halvedDuration(1) !== 0) throw new Error("half duration");
  if (applyFixedDuration(60, 0, () => 0).left !== 60 || applyFixedDuration(60, 0, () => 0.9).state !== 2) throw new Error("apply duration");
  if (statusResistChance(0, false) !== 0 || statusResistChance(25, false) !== 0.25 || statusResistChance(25, true) !== 0.125) {
    throw new Error("status resist rate");
  }
  if (statusResistChance(90, false) !== 0.9 || statusResistChance(180, true) !== 0.9 || statusResistChance(200, false) !== 0.9) {
    throw new Error("status resist cap");
  }
  if (!statusResisted(25, false, 0.24) || statusResisted(25, false, 0.25) || statusResisted(0, false, 0)) {
    throw new Error("status resist roll");
  }
  if (resistFractionLabel(0) !== "" || resistFractionLabel(1) !== "1/2" || resistFractionLabel(3) !== "1/8") {
    throw new Error("resist label");
  }
  if (damageChart(287, 225).includes("—") || !durationChart(200, 225, 60).includes("30")) throw new Error("chart text");
}
