/**
 * Retail /heal ticks and /check con, level cap 75. No merits.
 *
 * HP while healing starts at 10 and rises by 1 each tick (10, 11, 12…),
 * before any "HP recovered while healing" gear. This kit has none.
 * The first tick is 20 seconds in; later ticks are every 10 seconds.
 * Standing, moving, or starting a rest over resets to the first tick.
 * A hit, spell, or damage-over-time tick that removes HP also stands you up.
 * A miss, a 0-damage hit, or a blow Stoneskin or shadows absorb entirely does not.
 * Knockback with that damage mitigated does not. A cure does not.
 * A non-damaging spell that picks you as its target would (an enemy's Bind).
 * One you only stand inside (Bindga) would not. Nothing here casts either at you.
 *
 * MP starts at 12. Clear Mind adds its bonus to that base, not instead of it.
 * The step is +1 with no Clear Mind, Clear Mind I, or II; +2 at III and IV;
 * +3 at V; +4 at VI. Clear Mind V is 27, 30, 33. Each tick also drops 10 TP.
 *
 * /check level difference is mob level minus player level. The published
 * ends are level 1 and level 75. Boundaries in between are rounded.
 * Incredibly Easy Prey is not used: it was added after the level cap rose.
 * High defense and high evasion are not on the con line.
 * Every Notorious Monster is impossible to gauge, at any level.
 */

export type Con =
  | "too-weak"
  | "easy-prey"
  | "decent-challenge"
  | "even-match"
  | "tough"
  | "very-tough"
  | "incredibly-tough";

function edge(at1: number, at75: number, level: number): number {
  const clamped = Math.min(75, Math.max(1, level));
  const t = (clamped - 1) / 74;
  return Math.round(at1 + (at75 - at1) * t);
}

/** Relative strength. diff is mobLevel − playerLevel. */
export function checkCon(playerLevel: number, mobLevel: number): Con {
  const diff = mobLevel - playerLevel;
  const tooWeak = edge(7, 20, playerLevel);
  const easyPrey = edge(3, 8, playerLevel);
  const toughMax = edge(4, 3, playerLevel);
  const veryToughMax = edge(5, 7, playerLevel);
  if (diff <= -tooWeak) return "too-weak";
  if (diff <= -easyPrey) return "easy-prey";
  if (diff < 0) return "decent-challenge";
  if (diff === 0) return "even-match";
  if (diff <= toughMax) return "tough";
  if (diff <= veryToughMax) return "very-tough";
  return "incredibly-tough";
}

/** English client lines. The awkward "an easy prey" is the retail wording. */
export function checkLine(name: string, playerLevel: number, mobLevel: number, notorious = false): string {
  if (notorious) return `The ${name}'s strength is impossible to gauge.`;
  switch (checkCon(playerLevel, mobLevel)) {
    case "too-weak":
      return `The ${name} seems too weak to be worthwhile.`;
    case "easy-prey":
      return `The ${name} seems like an easy prey.`;
    case "decent-challenge":
      return `The ${name} seems like a decent challenge.`;
    case "even-match":
      return `The ${name} seems like an even match.`;
    case "tough":
      return `The ${name} seems tough.`;
    case "very-tough":
      return `The ${name} seems very tough.`;
    case "incredibly-tough":
      return `The ${name} seems incredibly tough.`;
  }
}

export type CheckMark = { text: string; where: "hare" | "kin" | "pack" | "field"; id: string | null };

let pendingCheck: CheckMark | null = null;

/** The yard paints this over the body that was checked. One at a time. */
export function queueCheckMark(mark: CheckMark): void {
  pendingCheck = mark;
}

export function takeCheckMark(): CheckMark | null {
  const mark = pendingCheck;
  pendingCheck = null;
  return mark;
}

/** How much the MP tick grows after the first. Keyed off the Clear Mind bonus. */
export function restMpStep(clearMindBonus: number): number {
  if (clearMindBonus >= 18) return 4;
  if (clearMindBonus >= 15) return 3;
  if (clearMindBonus >= 9) return 2;
  return 1;
}

/**
 * One resting tick. tickIndex 0 is the first tick.
 * hHp and hMp are "recovered while healing" gear. Both are 0 in this yard.
 */
export function restTick(
  clearMindBonus: number,
  tickIndex: number,
  hHp = 0,
  hMp = 0,
): { hp: number; mp: number } {
  const n = Math.max(0, tickIndex);
  return {
    hp: 10 + hHp + n,
    mp: 12 + clearMindBonus + hMp + restMpStep(clearMindBonus) * n,
  };
}

/** True when this HP loss breaks /heal. Zero and less do not. */
export function restBreaksOnDamage(hpLost: number): boolean {
  return hpLost > 0;
}

export function assertCommands(): void {
  if (checkCon(1, 1) !== "even-match" || checkCon(75, 75) !== "even-match") throw new Error("even match");
  if (checkCon(1, -6) !== "too-weak" || checkCon(1, -5) !== "easy-prey") throw new Error("level 1 too weak");
  if (checkCon(1, -2) !== "easy-prey" || checkCon(1, -1) !== "decent-challenge" || checkCon(1, 0) !== "decent-challenge") {
    throw new Error("level 1 prey");
  }
  if (checkCon(1, 5) !== "tough" || checkCon(1, 6) !== "very-tough" || checkCon(1, 7) !== "incredibly-tough") {
    throw new Error("level 1 high");
  }
  if (checkCon(75, 55) !== "too-weak" || checkCon(75, 56) !== "easy-prey" || checkCon(75, 67) !== "easy-prey") {
    throw new Error("level 75 low");
  }
  if (checkCon(75, 68) !== "decent-challenge" || checkCon(75, 74) !== "decent-challenge") throw new Error("level 75 decent");
  if (checkCon(75, 76) !== "tough" || checkCon(75, 78) !== "tough") throw new Error("level 75 tough");
  if (checkCon(75, 79) !== "very-tough" || checkCon(75, 82) !== "very-tough" || checkCon(75, 83) !== "incredibly-tough") {
    throw new Error("level 75 very tough");
  }
  if (checkLine("Tropical Rarab", 75, 1) !== "The Tropical Rarab seems too weak to be worthwhile.") throw new Error("hare check");
  if (checkLine("Tropical Rarab", 75, 75) !== "The Tropical Rarab seems like an even match.") throw new Error("hare even");
  if (checkLine("Jaggedy-Eared Jack", 75, 9, true) !== "The Jaggedy-Eared Jack's strength is impossible to gauge.") {
    throw new Error("nm check");
  }
  if (checkLine("Warchief Vatgit", 75, 75, true) !== "The Warchief Vatgit's strength is impossible to gauge.") {
    throw new Error("nm even check");
  }
  if (checkLine("Orcish Fodder", 75, 9, false) !== "The Orcish Fodder seems too weak to be worthwhile.") throw new Error("nm flag");
  queueCheckMark({ text: "Even", where: "pack", id: "mouth" });
  const taken = takeCheckMark();
  if (!taken || taken.where !== "pack" || taken.id !== "mouth" || takeCheckMark()) throw new Error("check mark");
  const five = [restTick(15, 0), restTick(15, 1), restTick(15, 2)];
  if (five[0].mp !== 27 || five[1].mp !== 30 || five[2].mp !== 33) throw new Error("Clear Mind V");
  if (restTick(0, 0).mp !== 12 || restTick(0, 1).mp !== 13 || restTick(6, 0).mp !== 18 || restTick(6, 1).mp !== 19) {
    throw new Error("Clear Mind I-II step");
  }
  if (restTick(9, 0).mp !== 21 || restTick(9, 1).mp !== 23 || restTick(12, 1).mp !== 26) throw new Error("Clear Mind III-IV");
  if (restTick(18, 0).mp !== 30 || restTick(18, 1).mp !== 34) throw new Error("Clear Mind VI");
  if (restTick(0, 0).hp !== 10 || restTick(0, 1).hp !== 11 || restTick(0, 2).hp !== 12) throw new Error("HP ticks");
  if (restTick(15, 0, 0, 0).hp !== 10) throw new Error("HP ignores Clear Mind");
  if (!restBreaksOnDamage(1) || restBreaksOnDamage(0) || restBreaksOnDamage(-4)) throw new Error("rest break");
}
