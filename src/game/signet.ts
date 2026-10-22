/** San d'Oria Signet. Rank points and conquest points share the region's experience cut. */

export const NATION = "San d'Oria";
export const KINGDOM_AKETON = "kingdom-aketon";

/** Cumulative rank points to hold each rank. Rank 1 needs none. Rank 10 is the last. */
const RANK_AT = [0, 0, 1000, 2500, 5000, 10000, 20000, 40000, 75000, 125000, 200000];

export function rankFromPoints(points: number): number {
  const n = Math.max(0, Math.floor(points));
  let rank = 1;
  for (let step = 2; step <= 10; step += 1) {
    if (n >= RANK_AT[step]) rank = step;
  }
  return rank;
}

export function rankGoal(rank: number): number | null {
  if (rank >= 10) return null;
  return RANK_AT[rank + 1];
}

/**
 * West Ronfaure is the yard. San d'Oria is the town. Both are held by San d'Oria.
 * Anywhere else is outside the home nation.
 */
export function homeControlled(screen: string): boolean {
  return screen === "battle" || screen === "town";
}

/** 10% at home. 15% in a region your nation does not hold. */
export function conquestRate(screen: string): number {
  return homeControlled(screen) ? 0.1 : 0.15;
}

export function pointsFromExp(gained: number, screen: string): number {
  if (gained <= 0) return 0;
  return Math.floor(gained * conquestRate(screen));
}

/**
 * Earth hours. Retail duration is your rank plus the nation's conquest place (1st, 2nd, or 3rd),
 * so it lasts 2–13 hours. San d'Oria is home, counted as first.
 */
export function signetHours(rank: number): number {
  const held = Math.max(1, Math.min(10, Math.floor(rank)));
  return held + 1;
}

/** Tropical Rarab's crystal is Fire. Solo Signet finds one about a tenth of the time. */
export const RARAB_CRYSTAL = "fire" as const;
export const CRYSTAL_CHANCE = 0.1;
/** Kingdom Aketon raises that chance. Retail never printed the size of the bonus. */
export const AKETON_CRYSTAL = 1.5;
export const AKETON_MOVE = 1.12;

export function crystalChance(body: string | null | undefined): number {
  return body === KINGDOM_AKETON ? CRYSTAL_CHANCE * AKETON_CRYSTAL : CRYSTAL_CHANCE;
}

/** +12% only while the aketon is worn in land San d'Oria holds. */
export function moveBonus(body: string | null | undefined, screen: string): number {
  if (body !== KINGDOM_AKETON || !homeControlled(screen)) return 1;
  return AKETON_MOVE;
}

export type ConquestOffer = {
  id: string;
  name: string;
  cost: number;
  rank: number;
  note: string;
};

export const CONQUEST_SHOP: ConquestOffer[] = [
  {
    id: KINGDOM_AKETON,
    name: "Kingdom Aketon",
    cost: 100,
    rank: 2,
    note: "DEF:1. Increases crystal drops. Movement speed +12% in San d'Oria lands.",
  },
];

export function assertSignet(): void {
  if (rankFromPoints(0) !== 1 || rankFromPoints(999) !== 1 || rankFromPoints(1000) !== 2) throw new Error("rank 1 until 1000");
  if (rankFromPoints(200000) !== 10) throw new Error("rank 10");
  if (pointsFromExp(200, "battle") !== 20 || pointsFromExp(200, "town") !== 20) throw new Error("ten percent at home");
  if (pointsFromExp(200, "raids") !== 30 || pointsFromExp(0, "battle") !== 0) throw new Error("fifteen percent abroad");
  if (signetHours(1) !== 2 || signetHours(10) !== 11) throw new Error("signet hours");
  if (rankGoal(1) !== 1000 || rankGoal(10) !== null) throw new Error("next rank");
  if (Math.abs(crystalChance(null) - 0.1) > 1e-9 || Math.abs(crystalChance(KINGDOM_AKETON) - 0.15) > 1e-9) throw new Error("aketon crystals");
  if (moveBonus(KINGDOM_AKETON, "battle") !== 1.12 || moveBonus(KINGDOM_AKETON, "raids") !== 1) throw new Error("aketon speed");
  if (!homeControlled("battle") || homeControlled("raids")) throw new Error("west ronfaure is home");
}
