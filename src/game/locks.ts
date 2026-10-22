/**
 * Retail animation locks. BG-Wiki Forced Delay and Casting Time Gauge.
 *
 * Job ability: 1 second where no action is possible, then 1 second where
 * another job ability can be used but auto-attack cannot. A job ability
 * during that second starts the 2 seconds over.
 *
 * Spell: auto-attack waits out the cast. When the cast finishes, spells,
 * abilities, and items wait 3 seconds. That 3 seconds does not stop melee.
 *
 * Item: Activate Time is the lock. Auto-attack and other actions wait it out.
 *
 * Weapon skill: 2 seconds where nothing can be done.
 *
 * The swing timer does not advance during an auto-attack lock.
 * A swing that has already started is not cancelled.
 *
 * Not a timed lock, so not applied here: paralysis can cancel one melee
 * round. Stun, sleep, petrify, and terror stop attacking while they last.
 * Ranged aiming pauses melee, then about 1 second more after the shot.
 */

export const JA_PHASE1 = 1;
export const JA_PHASE2 = 1;
export const SPELL_ACTION_LOCK = 3;
export const WS_LOCK = 2;
/** Delay page: about one second after the aiming phase. */
export const RANGED_OVERHEAD = 1;

export type ActionKind = "ability" | "spell" | "item" | "weaponskill" | "ranged";

type Locks = { melee: number; action: number; ability: number };

const OPEN: Locks = { melee: 0, action: 0, ability: 0 };

let locks: Locks = { ...OPEN };

export function readLocks(): Locks {
  return locks;
}

/** Whole seconds still on the hotbar lock. 0 when that lock is open. */
export function lockClock(): { action: number; ability: number } {
  const up = (n: number) => (n > 1e-6 ? Math.ceil(n) : 0);
  return { action: up(locks.action), ability: up(locks.ability) };
}

/**
 * Number the hotbar draws for one slot.
 * A job ability waits on the ability lock. Everything else waits on the action lock.
 * The slot's own recast is kept when it is longer. This does not write that recast.
 * Weapon skills have no recast, so they show only the lock.
 */
export function hotbarShown(kind: ActionKind, recastLeft: number, clock: { action: number; ability: number } = lockClock()): number {
  const own = kind === "weaponskill" ? 0 : Math.max(0, recastLeft);
  const lock = kind === "ability" ? clock.ability : clock.action;
  return Math.max(own, lock);
}

export function tickActionLocks(dt: number) {
  locks = {
    melee: Math.max(0, locks.melee - dt),
    action: Math.max(0, locks.action - dt),
    ability: Math.max(0, locks.ability - dt),
  };
}

export function blockedByLock(kind: ActionKind): string | null {
  if (kind === "ability") return locks.ability > 0 ? "Cannot act yet." : null;
  return locks.action > 0 ? "Cannot act yet." : null;
}

export function commitLock(kind: ActionKind, seconds = 0) {
  if (kind === "ability") {
    locks = { melee: JA_PHASE1 + JA_PHASE2, action: JA_PHASE1, ability: JA_PHASE1 };
    return;
  }
  if (kind === "spell") {
    locks = {
      melee: Math.max(locks.melee, seconds),
      action: Math.max(locks.action, seconds + SPELL_ACTION_LOCK),
      ability: Math.max(locks.ability, seconds + SPELL_ACTION_LOCK),
    };
    return;
  }
  if (kind === "item") {
    locks = {
      melee: Math.max(locks.melee, seconds),
      action: Math.max(locks.action, seconds),
      ability: Math.max(locks.ability, seconds),
    };
    return;
  }
  if (kind === "ranged") {
    const lock = rangedMeleeLock(seconds);
    locks = {
      melee: Math.max(locks.melee, lock),
      action: Math.max(locks.action, lock),
      ability: Math.max(locks.ability, lock),
    };
    return;
  }
  locks = {
    melee: Math.max(locks.melee, WS_LOCK),
    action: Math.max(locks.action, WS_LOCK),
    ability: Math.max(locks.ability, WS_LOCK),
  };
}

/**
 * Drops a spell's cast lock and the aftercast.
 * An interrupt does not leave the 3 seconds. A connecting physical hit
 * can break the cast. The chance is spellInterruptChance.
 */
export function clearActionLocks() {
  locks = { melee: 0, action: 0, ability: 0 };
}

/** Aim time plus the one second after the shot. Melee stays paused for both. */
export function rangedMeleeLock(aimSeconds: number): number {
  return aimSeconds + RANGED_OVERHEAD;
}

export function assertLocks(): void {
  const seen = (): Locks => ({ melee: locks.melee, action: locks.action, ability: locks.ability });
  locks = { ...OPEN };
  commitLock("ability");
  const phase1 = seen();
  if (phase1.melee !== 2 || phase1.action !== 1 || phase1.ability !== 1) throw new Error("job ability lock");
  tickActionLocks(1);
  const phase2 = seen();
  if (phase2.ability !== 0 || phase2.melee !== 1 || phase2.action !== 0) throw new Error("job ability phase 2");
  if (blockedByLock("ability")) throw new Error("phase 2 blocks an ability");
  if (blockedByLock("spell") || blockedByLock("item") || blockedByLock("weaponskill")) throw new Error("phase 2 still blocks actions");
  commitLock("ability");
  const restarted = seen();
  if (restarted.melee !== 2 || restarted.ability !== 1) throw new Error("job ability did not restart");
  if (!blockedByLock("ability")) throw new Error("phase 1 allows an ability");
  locks = { ...OPEN };
  commitLock("spell", 2);
  const spell = seen();
  if (spell.melee !== 2 || spell.action !== 5 || spell.ability !== 5) throw new Error("spell lock");
  locks = { ...OPEN };
  commitLock("spell", 0);
  const aftercast = seen();
  if (aftercast.melee !== 0 || aftercast.action !== 3) throw new Error("spell aftercast");
  locks = { ...OPEN };
  commitLock("item", 1);
  const item = seen();
  if (item.melee !== 1 || item.action !== 1 || item.ability !== 1) throw new Error("item lock");
  commitLock("weaponskill");
  const weaponskill = seen();
  if (weaponskill.melee !== 2 || weaponskill.action !== 2 || weaponskill.ability !== 2) throw new Error("weapon skill lock");
  if (rangedMeleeLock(4) !== 5) throw new Error("ranged overhead");
  commitLock("spell", 4);
  clearActionLocks();
  const cleared = seen();
  if (cleared.melee !== 0 || cleared.action !== 0 || cleared.ability !== 0) throw new Error("spell interrupt clears locks");
  locks = { ...OPEN };
  commitLock("ability");
  const ja = lockClock();
  if (ja.action !== 1 || ja.ability !== 1) throw new Error("job ability clock");
  if (hotbarShown("ability", 30, ja) !== 30 || hotbarShown("ability", 0, ja) !== 1) throw new Error("ability recast wins");
  if (hotbarShown("spell", 0, ja) !== 1 || hotbarShown("weaponskill", 0, ja) !== 1 || hotbarShown("item", 0, ja) !== 1) {
    throw new Error("job ability covers the bar");
  }
  tickActionLocks(1);
  const open = lockClock();
  if (open.action !== 0 || open.ability !== 0 || hotbarShown("spell", 0, open) !== 0) throw new Error("phase 2 leaves the bar open");
  locks = { ...OPEN };
  commitLock("spell", 2);
  const casting = lockClock();
  if (casting.action !== 5 || casting.ability !== 5) throw new Error("spell clock");
  if (hotbarShown("spell", 60, casting) !== 60 || hotbarShown("ability", 0, casting) !== 5 || hotbarShown("weaponskill", 0, casting) !== 5) {
    throw new Error("spell lock does not replace a longer recast");
  }
  locks = { ...OPEN };
  commitLock("weaponskill");
  const ws = lockClock();
  if (ws.action !== 2 || ws.ability !== 2 || hotbarShown("weaponskill", 99, ws) !== 2) throw new Error("weapon skill clock");
  locks = { ...OPEN };
  commitLock("item", 1);
  const used = lockClock();
  if (used.action !== 1 || hotbarShown("item", 30, used) !== 30 || hotbarShown("spell", 0, used) !== 1) throw new Error("item clock");
  const recast = 30;
  if (hotbarShown("item", recast, used) !== recast) throw new Error("lock wrote over a recast");
  locks = { ...OPEN };
  commitLock("ranged", 360 / 106);
  const aimed = seen();
  const aimLock = 360 / 106 + 1;
  if (Math.abs(aimed.melee - aimLock) > 1e-9 || Math.abs(aimed.action - aimLock) > 1e-9 || Math.abs(aimed.ability - aimLock) > 1e-9) {
    throw new Error("ranged lock");
  }
  if (blockedByLock("ranged") !== "Cannot act yet.") throw new Error("ranged shot is not locked");
  if (hotbarShown("ranged", 0, lockClock()) !== Math.ceil(aimLock)) throw new Error("ranged clock");
  locks = { ...OPEN };
}
