/**
 * Retail distance. One world unit is one yalm.
 *
 * Run speed is 5.0 yalms/second, the base since the December 2013 update
 * (it was 4.0 before that). BG-Wiki Movement Speed. There is no movement
 * gear in the yard, and the cap of 8.0 is not in play.
 *
 * Auto-attack reach is the check the client uses: distance from foot to
 * foot must be within the two model radii plus the weapon reach.
 * Every melee weapon skill in the client resource list uses range id 2,
 * and that auto-attack reach is 3 yalms. A weapon skill would be about
 * 1 yalm longer; this yard only swings auto-attacks. Ranged attack stops
 * at 25 yalms. Horizon Distance.
 *
 * Talking to an NPC, trading, and checking an NPC all stop at 6 yalms.
 * Horizon Distance and the GamerEscape distance table both list that 6'.
 * Targeting an NPC is a separate 50 yalm draw range. The yard is smaller
 * than that, so only the talk check is applied.
 *
 * A monster's own melee is not that weapon check. It is the two bodies
 * plus 2 yalms. The hare walks until you are inside that, then it stops.
 * It steps again only if you leave it. Your weapon still reaches farther.
 */

/** Hume body used for the melee check, in yalms. Matches the yard capsule. */
export const HUME_RADIUS = 0.36;
/** Tropical Rarab body, in yalms. Matches the hare's horizontal hit box. */
export const HARE_RADIUS = 0.5;

/** Weapon contribution on top of the two bodies. Same for every melee type. */
export const MELEE_REACH = 3;
/** A monster's auto-attack, on top of the two bodies. Not a player's weapon. */
export const MOB_MELEE_REACH = 2;
/** Bow, crossbow, gun, and throwing. */
export const RANGED_MAX = 25;
/** Talk, trade, and checking an NPC. */
export const NPC_TALK = 6;

export const RUN_SPEED = 5;

const RANGED = new Set(["Archery", "Marksmanship", "Throwing"]);

/** Center-to-center yalms at which an auto-attack still connects. */
export function autoAttackRange(kind: string | null | undefined): number {
  if (kind && RANGED.has(kind)) return RANGED_MAX;
  return HUME_RADIUS + HARE_RADIUS + MELEE_REACH;
}

/** Center-to-center yalms at which the Tropical Rarab can still hit. */
export function hareMeleeRange(): number {
  return HARE_RADIUS + MOB_MELEE_REACH + HUME_RADIUS;
}

export function assertDistance(): void {
  const melee = HUME_RADIUS + HARE_RADIUS + MELEE_REACH;
  if (RUN_SPEED !== 5 || MELEE_REACH !== 3 || RANGED_MAX !== 25 || NPC_TALK !== 6) throw new Error("distance constants");
  if (autoAttackRange("Sword") !== melee) throw new Error("sword reach");
  if (autoAttackRange("Polearm") !== autoAttackRange("Dagger")) throw new Error("melee reach differs");
  if (autoAttackRange("Hand-to-Hand") !== autoAttackRange("Great Axe")) throw new Error("two-hand reach");
  if (autoAttackRange("Great Katana") !== autoAttackRange("Staff")) throw new Error("katana reach");
  if (autoAttackRange("Club") !== melee || autoAttackRange("Scythe") !== melee || autoAttackRange("Axe") !== melee) {
    throw new Error("melee kinds");
  }
  if (autoAttackRange(null) !== autoAttackRange("Hand-to-Hand")) throw new Error("unarmed reach");
  if (autoAttackRange("Archery") !== 25 || autoAttackRange("Marksmanship") !== 25 || autoAttackRange("Throwing") !== 25) {
    throw new Error("ranged reach");
  }
  if (MOB_MELEE_REACH !== 2) throw new Error("hare melee");
  const hareMelee = hareMeleeRange();
  if (hareMelee !== HARE_RADIUS + MOB_MELEE_REACH + HUME_RADIUS) throw new Error("hare melee");
  if (Math.abs(hareMelee - 2.86) > 1e-9) throw new Error("hare melee");
  if (hareMelee >= melee) throw new Error("hare outranges a weapon");
}
