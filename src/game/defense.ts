/**
 * Evasion, shield block, and guard on a physical swing aimed at the player.
 *
 * Evasion is the melee hit check already used by the yard. A roll under the
 * hit rate connects. Anything else is an evade. Melee hit rate floors at 20
 * and caps at 99, so an evade cannot pass 80% and cannot fall under 1%.
 * It does not care which way you face, and you do not have to be engaged.
 *
 * Block is BG-Wiki's shield formula. Size sets the base rate and the base
 * cut. The skill term is 0.2325, the published average, because the exact
 * skill tiers are not public. The rate then floors at 5 and caps at 100.
 * Reprisal multiplies shield skill by 1.15 inside that term, then multiplies
 * the clamped rate by 1.5. A non-item-level shield adds DEF/2 to the size's
 * damage cut. The player has to be facing the swing. Engagement is not required.
 *
 * Guard is hand-to-hand only, and only while engaged and facing. BG-Wiki
 * states the rate depends on guard skill and the attacker's level, and that
 * a guard lowers pDIF by 1. The exact rate tiers are not published, so the
 * rate uses the same 0.2325 conversion against the attacker's level, then
 * the same 5–100 clamp. Dodge's approximate bonus is added before the floor.
 * A job with no Guard skill does not get the 5% floor.
 */
import { physicalRaw } from "./rarab";
import { skillCap } from "./skills";

/** Degrees off the nose. GE's shield check is about a 60-degree angle. */
export const DEFENSE_FRONT = 60;

const BLOCK_BASE = [0, 55, 40, 45, 30] as const;
const BLOCK_CUT = [0, 20, 40, 50, 65] as const;

/** Lauan Shield is size 2. Marine Shield is size 1. Same split as Shield Bash. */
export function shieldSize(id: string | null | undefined): number {
  if (id === "marine-shield") return 1;
  if (id === "lauan-shield") return 2;
  return 0;
}

function truncTowardZero(n: number): number {
  return n < 0 ? Math.ceil(n) : Math.floor(n);
}

/**
 * (shield skill − attacker combat skill) × 0.2325, truncated toward 0.
 * 0.2325 is 2325/10000. Skill may be fractional after Reprisal's ×1.15.
 */
export function blockSkillPoints(shieldSkill: number, attackerSkill: number): number {
  const hundredths = Math.round(shieldSkill * 100) - Math.round(attackerSkill * 100);
  return truncTowardZero((hundredths * 2325) / 1_000_000);
}

/**
 * Block rate in percent. 0 when nothing in the sub slot is a shield.
 * Reprisal is applied after the 5–100 clamp, then clamped again.
 */
export function blockRate(size: number, shieldSkill: number, attackerSkill: number, reprisal: boolean): number {
  if (size < 1 || size > 4) return 0;
  const skill = reprisal ? (Math.max(0, shieldSkill) * 115) / 100 : Math.max(0, shieldSkill);
  const raw = (BLOCK_BASE[size] ?? 0) + blockSkillPoints(skill, attackerSkill);
  const clamped = Math.min(100, Math.max(5, raw));
  if (!reprisal) return clamped;
  return Math.min(100, Math.max(5, Math.floor(clamped * 1.5)));
}

/**
 * Damage that gets past the shield, before Phalanx and Stoneskin.
 * Percent kept is the size cut plus DEF/2, in tenths, so 1 DEF is half a percent.
 */
export function blockTaken(incoming: number, size: number, shieldDef: number): number {
  if (size < 1 || size > 4) return Math.max(0, Math.floor(incoming));
  const tenths = (BLOCK_CUT[size] ?? 0) * 10 + Math.max(0, Math.floor(shieldDef)) * 5;
  const keep = Math.max(0, 1000 - tenths);
  return Math.max(0, Math.floor((Math.max(0, Math.floor(incoming)) * keep) / 1000));
}

/** What the shield removed. Reprisal reflects 33% of this, and only on an auto-attack. */
export function blockKept(incoming: number, size: number, shieldDef: number): number {
  return Math.max(0, Math.floor(incoming)) - blockTaken(incoming, size, shieldDef);
}

/**
 * Guard rate in percent. 0 when Guard skill is 0.
 * `dodgeBonus` is Dodge's approximate +(level + 1) × 0.2 while that buff is up.
 */
export function guardRate(guardSkill: number, attackerLevel: number, dodgeBonus = 0): number {
  if (guardSkill <= 0) return 0;
  const points = ((guardSkill - attackerLevel) * 2325) / 10000 + Math.max(0, dodgeBonus);
  return Math.min(100, Math.max(5, Math.floor(points)));
}

/** A successful guard subtracts 1 from pDIF. It cannot go below 0. */
export function guardedPdif(pdif: number): number {
  return Math.max(0, pdif - 1);
}

export function assertDefense(): void {
  if (DEFENSE_FRONT !== 60) throw new Error("front arc");
  if (shieldSize("marine-shield") !== 1 || shieldSize("lauan-shield") !== 2 || shieldSize("bronze-sword") !== 0) {
    throw new Error("shield size");
  }
  if (skillCap("C", 75) !== 225) throw new Error("mob weapon skill rank");
  if (blockSkillPoints(276, 225) !== 11) throw new Error("block skill points");
  if (blockRate(2, 276, 225, false) !== 51 || blockRate(1, 276, 225, false) !== 66) throw new Error("block rate");
  if (blockRate(2, 276, 225, true) !== 91) throw new Error("reprisal block rate");
  if (blockRate(2, 0, 225, false) !== 5 || blockRate(0, 276, 225, false) !== 0) throw new Error("block floor");
  if (blockRate(4, 2000, 0, false) !== 100) throw new Error("block cap");
  if (blockTaken(1000, 2, 1) !== 595 || blockTaken(100, 1, 1) !== 79 || blockTaken(0, 2, 1) !== 0) {
    throw new Error("block damage");
  }
  if (blockKept(1000, 2, 1) !== 405) throw new Error("block kept");
  if (guardRate(0, 75) !== 0 || guardRate(269, 75) !== 45 || guardRate(269, 75, 15.2) !== 60) {
    throw new Error("guard rate");
  }
  if (guardedPdif(1.5) !== 0.5 || guardedPdif(0.25) !== 0 || guardedPdif(2) !== 1) throw new Error("guard pdif");
  if (physicalRaw("attack", 85, 6, 1.5, 75) !== 136 || physicalRaw("attack", 85, 6, guardedPdif(1.5), 75) !== 45) {
    throw new Error("guarded auto");
  }
  if (physicalRaw("Foot Kick", 85, 6, 2, 75) !== 340 || physicalRaw("Foot Kick", 85, 6, guardedPdif(2), 75) !== 170) {
    throw new Error("guarded kick");
  }
}
