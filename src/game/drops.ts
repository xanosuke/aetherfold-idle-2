/** Retail Treasure Hunter buckets. SE published these rates. */

export type DropTier = "very-common" | "common" | "uncommon" | "rare" | "very-rare" | "super-rare" | "ultra-rare";

const TH: Record<DropTier, readonly number[]> = {
  "very-common": [0.24, 0.48, 0.56, 0.6, 0.64, 0.6666, 0.68, 0.69, 0.705, 0.72, 0.735, 0.74, 0.76, 0.78, 0.8],
  common: [0.15, 0.3, 0.4, 0.425, 0.45, 0.475, 0.5, 0.525, 0.55, 0.575, 0.6, 0.625, 0.65, 0.675, 0.7],
  uncommon: [0.1, 0.12, 0.15, 0.165, 0.18, 0.19, 0.2, 0.21, 0.225, 0.24, 0.265, 0.28, 0.295, 0.31, 0.325],
  rare: [0.05, 0.06, 0.07, 0.075, 0.08, 0.085, 0.09, 0.095, 0.105, 0.115, 0.125, 0.135, 0.155, 0.175, 0.2],
  "very-rare": [0.01, 0.015, 0.02, 0.0225, 0.025, 0.03, 0.035, 0.04, 0.0475, 0.055, 0.065, 0.075, 0.0825, 0.09, 0.1],
  "super-rare": [0.005, 0.0075, 0.01, 0.012, 0.014, 0.016, 0.018, 0.02, 0.023, 0.026, 0.03, 0.035, 0.04, 0.045, 0.05],
  "ultra-rare": [0.001, 0.002, 0.003, 0.0035, 0.004, 0.0045, 0.005, 0.006, 0.007, 0.008, 0.009, 0.01, 0.0115, 0.013, 0.015],
};

export function dropRate(tier: DropTier, treasureHunter: number): number {
  const row = TH[tier];
  const step = Math.max(0, Math.min(row.length - 1, Math.floor(treasureHunter)));
  return row[step];
}

/** Published rates are blank. Both sit in the Common bucket, so Treasure Hunter follows that column. */
export const RARAB_DROPS = [
  { id: "rabbit-hide", found: "rabbit hide", tier: "common" as const },
  { id: "hare-meat", found: "hare meat", tier: "common" as const },
];

export function assertDrops(): void {
  if (dropRate("common", 0) !== 0.15 || dropRate("common", 1) !== 0.3 || dropRate("common", 2) !== 0.4) throw new Error("common treasure hunter");
  if (dropRate("very-common", 0) !== 0.24 || Math.abs(dropRate("ultra-rare", 14) - 0.015) > 1e-9) throw new Error("treasure hunter edges");
  if (dropRate("common", 99) !== dropRate("common", 14)) throw new Error("treasure hunter cap");
  if (RARAB_DROPS.length !== 2) throw new Error("rarab drops");
}
