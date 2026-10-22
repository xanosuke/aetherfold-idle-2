/**
 * Retail combat-skill caps, levels 1–75.
 *
 * A combat skill is always this cap for the job's current level. There is
 * no skill-up. A job with no rank in a skill contributes 0, which is what
 * Warrior does with Katana and Great Katana.
 *
 * Levels 1–50 share one slope inside each letter. At 51 the step steepens,
 * and at 61 the plus and minus ranks split. 71–75 is the retail table.
 * This kit stops at 75: item level and merits are not in it.
 *
 * The "A" column is the retail cap that prints 269 at 75. Older charts
 * label that column A−. BG-Wiki's Warrior page calls Axe rank A.
 */

export type SkillRank =
  | "A+"
  | "A"
  | "B+"
  | "B"
  | "B-"
  | "C+"
  | "C"
  | "C-"
  | "D"
  | "E"
  | "F";

/** Levels 71–75, in order. Not a single slope. */
const PAST_70: Record<SkillRank, readonly [number, number, number, number, number]> = {
  "A+": [256, 261, 266, 271, 276],
  A: [249, 254, 259, 264, 269],
  "B+": [237, 241, 246, 251, 256],
  B: [232, 236, 240, 245, 250],
  "B-": [226, 229, 232, 236, 240],
  "C+": [218, 221, 224, 227, 230],
  C: [214, 217, 219, 222, 225],
  "C-": [212, 214, 216, 218, 220],
  D: [203, 205, 207, 208, 210],
  E: [192, 194, 196, 198, 200],
  F: [181, 183, 185, 187, 189],
};

function group(rank: SkillRank): "A" | "B" | "C" | "D" | "E" | "F" {
  if (rank === "A+" || rank === "A") return "A";
  if (rank === "B+" || rank === "B" || rank === "B-") return "B";
  if (rank === "C+" || rank === "C" || rank === "C-") return "C";
  if (rank === "D") return "D";
  if (rank === "E") return "E";
  return "F";
}

function div(n: number, d: number) {
  return Math.floor(n / d);
}

/** Cap through level 50. `n` is level − 1. */
function capTo50(rank: SkillRank, n: number) {
  switch (group(rank)) {
    case "A":
      return n * 3 + 6;
    case "B":
      return div(n * 29 + 50, 10);
    case "C":
      return div(n * 28 + 50, 10);
    case "D":
      return div(n * 27 + 40, 10);
    case "E":
      return div(n * 25 + 40, 10);
    case "F":
      return div(n * 23 + 40, 10);
  }
}

/** Added over the level-50 cap, for levels 51–60. */
function rise51(rank: SkillRank, n: number) {
  switch (group(rank)) {
    case "A":
      return n * 5;
    case "B":
      return div(n * 49, 10);
    case "C":
      return div(n * 48, 10);
    case "D":
      return div(n * 47, 10);
    case "E":
      return div(n * 45, 10);
    case "F":
      return div(n * 43, 10);
  }
}

/** Added over the level-60 cap, for levels 61–70. Tenths, so the ranks split. */
function rise61(rank: SkillRank, n: number) {
  switch (rank) {
    case "A+":
      return div(n * 485, 100);
    case "A":
      return div(n * 410, 100);
    case "B+":
      return div(n * 370, 100);
    case "B":
      return div(n * 323, 100);
    case "B-":
      return div(n * 270, 100);
    case "C+":
      return div(n * 250, 100);
    case "C":
      return div(n * 225, 100);
    case "C-":
      return n * 2;
    case "D":
      return div(n * 185, 100);
    case "E":
      return div(n * 195, 100);
    case "F":
      return div(n * 205, 100);
  }
}

/** Cap for one rank at a job level. Level 0 is 0. Above 75 stays at the 75 cap. */
export function skillCap(rank: SkillRank, level: number): number {
  if (level <= 0) return 0;
  if (level > 75) level = 75;
  if (level <= 50) return capTo50(rank, level - 1);
  if (level <= 60) return capTo50(rank, 49) + rise51(rank, level - 50);
  if (level <= 70) return capTo50(rank, 49) + rise51(rank, 10) + rise61(rank, level - 60);
  return PAST_70[rank][level - 71];
}

export function assertSkills(): void {
  const at = (rank: SkillRank, level: number, expected: number) => {
    const got = skillCap(rank, level);
    if (got !== expected) throw new Error(`${rank} ${level} is ${got}, expected ${expected}`);
  };
  at("A+", 1, 6);
  at("A", 1, 6);
  at("B+", 1, 5);
  at("B", 1, 5);
  at("B-", 1, 5);
  at("C+", 1, 5);
  at("C", 1, 5);
  at("C-", 1, 5);
  at("D", 1, 4);
  at("E", 1, 4);
  at("F", 1, 4);
  at("A+", 37, 114);
  at("B", 37, 109);
  at("C", 50, 142);
  at("A+", 60, 203);
  at("B-", 61, 198);
  at("D", 61, 184);
  at("A", 70, 244);
  at("F", 70, 179);
  at("A+", 75, 276);
  at("A", 75, 269);
  at("B+", 75, 256);
  at("B", 75, 250);
  at("B-", 75, 240);
  at("C+", 75, 230);
  at("C", 75, 225);
  at("C-", 75, 220);
  at("D", 75, 210);
  at("E", 75, 200);
  at("F", 75, 189);
  if (skillCap("B", 0) !== 0) throw new Error("level 0 skill");
  if (skillCap("A+", 99) !== 276) throw new Error("above 75 stays at the kit cap");
}
