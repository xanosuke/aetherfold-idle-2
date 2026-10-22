/**
 * Moat carp is a level-11 fish. A catch can raise Fishing only while the
 * skill's whole level is still under that. The gain is in tenths, the same
 * unit the craft skills use. City water, no moon gear: the chance is the
 * retail curve that peaks when the fish is about eleven levels up.
 */

/** Whole skill levels still under the fish can rise. At the fish, they stop. */
export function fishingRiseTenths(currentTenths: number, fishLevel: number, roll: number): number {
  const tenths = Math.max(0, Math.floor(currentTenths));
  const skillLevel = Math.floor(tenths / 10);
  const fish = Math.max(0, Math.floor(fishLevel));
  const gap = fish - skillLevel;
  if (gap < 1 || gap > 50) return 0;
  const unit = Number.isFinite(roll) ? Math.min(0.999999, Math.max(0, roll)) : 1;
  let span = 90;
  if (skillLevel < 50) span -= 20 - Math.floor(skillLevel / 3);
  const norm = Math.exp(-0.5 * Math.log(2 * Math.PI) - Math.log(5) - (gap - 11) ** 2 / 50);
  const dist = Math.floor(norm * 200);
  const lower = Math.floor((100 - skillLevel) / 10);
  const penalty = Math.floor(skillLevel / 10);
  const maxChance = Math.max(4, dist + lower - penalty);
  const picked = Math.floor(unit * span);
  if (picked >= maxChance) return 0;
  const maxAmount = Math.min(1 + Math.floor(gap / 5), 3);
  const frac = maxChance <= 1 ? 0 : picked / maxChance;
  const amount = maxAmount > 1 && frac < 0.2 ? maxAmount : 1;
  return Math.min(amount, 1100 - tenths);
}

/** The line that floats on the player. X is the tenths just gained, as a skill point. */
export function fishingSkillLine(riseTenths: number): string {
  const n = Math.max(0, Math.floor(riseTenths));
  return `Fishing skill up ${(n / 10).toFixed(1)}`;
}

/** How many carp this click handed the angler. Empty when nothing moved. */
export function carpTurnLine(count: number): string {
  const n = Math.max(0, Math.floor(Number(count) || 0));
  if (n < 1) return "";
  return `${n} Moat Carp`;
}

export function assertFishing(): void {
  if (fishingRiseTenths(110, 11, 0) !== 0) throw new Error("moat carp stops at 11.0");
  if (fishingRiseTenths(109, 11, 0) !== 1) throw new Error("10.9 can still rise a tenth");
  if (fishingRiseTenths(0, 11, 0) !== 3) throw new Error("a fresh line rises 0.3 on the low roll");
  if (fishingRiseTenths(0, 11, 0.999) !== 0) throw new Error("a high roll does not skill up");
  if (fishingRiseTenths(100, 11, 0) !== 1) throw new Error("skill 10.0 rises 0.1");
  if (fishingSkillLine(1) !== "Fishing skill up 0.1") throw new Error("skill line");
  if (fishingSkillLine(3) !== "Fishing skill up 0.3") throw new Error("skill line tenths");
  if (carpTurnLine(0) !== "" || carpTurnLine(1) !== "1 Moat Carp" || carpTurnLine(12) !== "12 Moat Carp") {
    throw new Error("carp turn-in line");
  }
}
