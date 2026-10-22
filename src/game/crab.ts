/**
 * Crab-family motion kit.
 *
 * Later zone crabs play these same ids. The rig is body + clawL + clawR,
 * local +z forward. poseCrab drives that rig. Do not invent a second
 * animation set when more crabs are placed in zones.
 *
 * Courier Carrie is the only crab skinned today. Her basket and her
 * damage are not part of this kit.
 *
 *   auto            alternate left and right claw lunge
 *   Big Scissors    both claws rise, then snap. Scission.
 *   Bubble Shower   the shell rears, then a pale-blue spray forward
 *   Bubble Curtain  bubbles wrap the shell for the cast only
 *   Scissor Guard   the claws cross in front for the cast
 *   Metallic Body   the shell flashes silver
 */
import { CARRIE_READY } from "./bst";

export const CRAB_MOTIONS = {
  auto: 0.88,
  "Big Scissors": 1.18,
  "Bubble Shower": 1.3,
  "Bubble Curtain": 1.15,
  "Scissor Guard": 1.05,
  "Metallic Body": 1.05,
} as const;

export type CrabMotion = keyof typeof CRAB_MOTIONS;

export function crabMotionSeconds(motion: CrabMotion): number {
  return CRAB_MOTIONS[motion];
}

/** The five Ready names are crab-family motions. A jug is ordered with Ready, not Sic. */
export function assertCrab(): void {
  const ready = CARRIE_READY.map((move) => move.name);
  if (ready.join(",") !== "Bubble Shower,Bubble Curtain,Big Scissors,Scissor Guard,Metallic Body") {
    throw new Error(`crab ready drifted: ${ready.join(",")}`);
  }
  for (const name of ready) {
    if (!(name in CRAB_MOTIONS)) throw new Error(`crab motion missing ${name}`);
    if (CRAB_MOTIONS[name] < 1) throw new Error(`crab motion short ${name}`);
  }
  if (CRAB_MOTIONS.auto !== 0.88) throw new Error("auto seconds");
  if (CRAB_MOTIONS["Big Scissors"] !== 1.18) throw new Error("scissors seconds");
  if (CRAB_MOTIONS["Bubble Shower"] !== 1.3) throw new Error("shower seconds");
  if (CRAB_MOTIONS["Bubble Curtain"] !== 1.15) throw new Error("curtain seconds");
  if (CRAB_MOTIONS["Scissor Guard"] !== 1.05) throw new Error("guard seconds");
  if (CRAB_MOTIONS["Metallic Body"] !== 1.05) throw new Error("metal seconds");
}
