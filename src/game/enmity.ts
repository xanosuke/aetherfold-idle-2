/**
 * Retail enmity and the hare's chase.
 *
 * Damage CE is 80 × damage ÷ the target's standard damage, and VE is
 * three times that CE. A cure's CE is 40 × HP ÷ the level divisor, VE is
 * 240 × HP ÷ the same divisor, and a heal of at least 1 HP is at least 1 CE.
 * Both pools cap at 30,000. The first hit that claims a passive mob adds
 * 200 CE and 900 VE. A shadow costs 25 CE. Damage taken costs
 * 1800 × HP lost ÷ max HP CE.
 *
 * A pet is its own row. Damage and cures use these same formulas, credited
 * to the pet. Snarl and Ventriloquy only make sense if that row is not the master's.
 *
 * The rear arc starts at 135° off the mob's nose.
 */

export const ENMITY_CAP = 30000;
export const CLAIM_CE = 200;
export const CLAIM_VE = 900;
export const SHADOW_CE = 25;
export const BEHIND_FROM_NOSE = 135;

export const HARE_WALK = 4;
export const HARE_RUN_MULT = 2.5;
export const HARE_RUN = HARE_WALK * HARE_RUN_MULT;
export const HARE_MELEE_INSET = 0.4;
export const HARE_CHASE_DELAY = 0.4;
/** Never stand closer than this, even if the melee inset would. */
export const HARE_CHASE_GAP = 0.9;

/** Base damage of a 240-delay sword at that level. The enmity divisor. */
export function standardDamage(level: number): number {
  const lv = Math.max(0, Math.floor(level));
  return Math.round(lv * 0.62 + 5.4);
}

export function damageEnmity(level: number, damage: number): { ce: number; ve: number } {
  const dealt = Math.floor(damage);
  if (dealt <= 0) return { ce: 0, ve: 0 };
  const ce = Math.floor((80 * dealt) / standardDamage(level));
  return { ce, ve: ce * 3 };
}

/**
 * Cure divisor. 1–10 climb by 1 from 11. Then slower steps that land on
 * the sampled levels: 11 and 51 hold, 50 is 40, 75 is 55, 99 is 69.
 */
export function cureEnmityMod(level: number): number {
  const lv = Math.max(1, Math.floor(level));
  if (lv <= 10) return 10 + lv;
  if (lv <= 50) return 20 + Math.floor(((lv - 10) * 20) / 40);
  if (lv <= 51) return 40;
  if (lv <= 75) return 40 + Math.floor(((lv - 51) * 15) / 24);
  return 55 + Math.floor(((Math.min(lv, 99) - 75) * 14) / 24);
}

export function cureEnmity(level: number, amount: number): { ce: number; ve: number } {
  const healed = Math.floor(amount);
  if (healed <= 0) return { ce: 0, ve: 0 };
  const mod = cureEnmityMod(level);
  const ce = Math.max(1, Math.floor((healed * 40) / mod));
  const ve = Math.floor((healed * 240) / mod);
  return { ce, ve };
}

export function ceLostOnHit(hpLost: number, maxHp: number): number {
  if (hpLost <= 0 || maxHp <= 0) return 0;
  return Math.floor((1800 * hpLost) / maxHp);
}

export function foldHate(
  current: { ce: number; ve: number },
  addCe: number,
  addVe: number,
): { ce: number; ve: number } {
  return {
    ce: Math.min(ENMITY_CAP, Math.max(0, current.ce + addCe)),
    ve: Math.min(ENMITY_CAP, Math.max(0, current.ve + addVe)),
  };
}

/**
 * Charm break already calls 30 yalms too far to attack.
 * LandSandBoat then waits 25 seconds without detection before it drops the target.
 * This rarab's scent would hold a fight at any range until Deodorize. The yard
 * uses the 30-yalm line instead of that scent.
 */
export const HATE_NEAR_YARDS = 30;
export const HATE_DEAGGRO_SECONDS = 25;

/**
 * Damage, a lost shadow, and volatile enmity can all compute 0.
 * The row is not deleted for that. Inside 30 yalms it keeps 1 CE so the
 * mob still has a claim. foldHate itself still returns 0.
 */
export function holdClaim(ce: number, ve: number, near: boolean): { ce: number; ve: number } {
  const nextCe = Math.max(0, Math.floor(ce));
  const nextVe = Math.max(0, Math.floor(ve));
  if (nextCe > 0 || nextVe > 0) return { ce: nextCe, ve: nextVe };
  if (near) return { ce: 1, ve: 0 };
  return { ce: 0, ve: 0 };
}

export type HateRow = { id: string; ce: number; ve: number; stamp: number };

/**
 * Highest CE+VE still on the list. Equal totals go to the later stamp,
 * which is the actor who most recently changed that row.
 */
export function topHate(rows: readonly HateRow[]): HateRow | null {
  let best: HateRow | null = null;
  for (const row of rows) {
    if (row.ce + row.ve <= 0) continue;
    if (!best) {
      best = row;
      continue;
    }
    const total = row.ce + row.ve;
    const lead = best.ce + best.ve;
    if (total > lead || (total === lead && row.stamp > best.stamp)) best = row;
  }
  return best;
}

/** True when the angle off the mob's nose is the rear arc. */
export function isBehind(angleFromNose: number): boolean {
  return angleFromNose >= BEHIND_FROM_NOSE;
}

/**
 * The party member Trick Attack would hand enmity to.
 * Retail is a straight line: you, then that member, then the monster.
 * Being in the monster's rear arc is not enough, and Hide does not stand in.
 * Lateral slack is 1.8 yalms so a trust in front of you still counts.
 * Two members on the line: the one closer to the monster is the one in front.
 */
export function partnerOnLine(
  px: number,
  pz: number,
  mx: number,
  mz: number,
  allies: readonly { id: string; x: number; z: number }[],
): string | null {
  const dx = mx - px;
  const dz = mz - pz;
  const mob = Math.hypot(dx, dz);
  if (mob < 0.8) return null;
  const ux = dx / mob;
  const uz = dz / mob;
  let best: { id: string; along: number } | null = null;
  for (const ally of allies) {
    const ax = ally.x - px;
    const az = ally.z - pz;
    const along = ax * ux + az * uz;
    if (along < 0.6 || along > mob - 0.35) continue;
    const lat = Math.abs(ax * uz - az * ux);
    if (lat > 1.8) continue;
    if (!best || along > best.along) best = { id: ally.id, along };
  }
  return best?.id ?? null;
}

export function chaseWaitLeft(
  wait: number,
  wasOut: boolean,
  out: boolean,
  dt: number,
): { wait: number; wasOut: boolean } {
  if (!out) return { wait: 0, wasOut: false };
  if (!wasOut) return { wait: HARE_CHASE_DELAY, wasOut: true };
  return { wait: Math.max(0, wait - dt), wasOut: true };
}

export function harePace(dist: number, melee: number, gravity: number): number {
  const base = dist > melee ? HARE_RUN : HARE_WALK;
  return base * gravity;
}

export function chasesPlayer(dead: boolean, ce: number, ve: number): boolean {
  if (dead) return false;
  return ce > 0 || ve > 0;
}

export type ThiefKind = "melee" | "ranged" | "magic";

/**
 * Sneak Attack and Trick Attack on one swing.
 * Sneak Attack lands from behind, or from any side during Hide.
 * It forces a crit and a hit on that first melee swing, and on the
 * first hit of a physical weapon skill. DEX is added only for Thief main.
 * A frontal swing does not spend it. Ranged and magical weapon skills do not.
 * Trick Attack lands only when a party member is between you and the mob.
 * That round cannot miss. Thief main adds AGI. Assassin, main only, makes
 * it critical. Hide does not replace the party member. Ranged attacks do
 * not spend it. The store moves that round's enmity, including a skillchain
 * closed by the weapon skill, onto the member in front.
 */
export function thiefStrike(q: {
  kind: ThiefKind;
  behind: boolean;
  hidden: boolean;
  sneak: boolean;
  trick: boolean;
  /** Someone is standing on the line between you and the mob. */
  partner: boolean;
  dex: number;
  agi: number;
  mainThief: boolean;
  assassin: boolean;
}): {
  dex: number;
  agi: number;
  /** Critical hit. Sneak Attack, or Trick Attack with Assassin. */
  sure: boolean;
  /** Cannot miss. Sneak Attack, or a lined-up Trick Attack. */
  hit: boolean;
  via: string;
  spendSa: boolean;
  spendTa: boolean;
  dropHide: boolean;
  tell: "sa" | "ta" | "both" | null;
} {
  const none = {
    dex: 0,
    agi: 0,
    sure: false,
    hit: false,
    via: "",
    spendSa: false,
    spendTa: false,
    dropHide: false,
    tell: null as "sa" | "ta" | "both" | null,
  };
  if (q.kind !== "melee") return q.hidden ? { ...none, dropHide: true } : none;
  const saLines = q.sneak && (q.behind || q.hidden);
  const taLines = q.trick && q.partner;
  if (saLines || taLines) {
    const both = saLines && taLines;
    return {
      dex: saLines && q.mainThief ? q.dex : 0,
      agi: taLines && q.mainThief ? q.agi : 0,
      sure: saLines || (taLines && q.assassin),
      hit: true,
      via: both ? "Sneak Attack and Trick Attack" : saLines ? "Sneak Attack" : "Trick Attack",
      spendSa: saLines,
      spendTa: taLines,
      dropHide: q.hidden,
      tell: !taLines && q.trick ? "ta" : !saLines && q.sneak ? "sa" : null,
    };
  }
  const tellSa = q.sneak;
  const tellTa = q.trick;
  return {
    ...none,
    dropHide: q.hidden,
    tell: tellSa && tellTa ? "both" : tellSa ? "sa" : tellTa ? "ta" : null,
  };
}

export function assertEnmity(): void {
  if (standardDamage(1) !== 6 || standardDamage(75) !== 52 || standardDamage(99) !== 67) throw new Error("standard damage");
  const one = damageEnmity(1, 6);
  if (one.ce !== 80 || one.ve !== 240) throw new Error("level 1 damage enmity");
  if (damageEnmity(1, 0).ce !== 0 || damageEnmity(75, 0).ve !== 0) throw new Error("zero damage");
  if (cureEnmityMod(1) !== 11 || cureEnmityMod(10) !== 20 || cureEnmityMod(11) !== 20 || cureEnmityMod(50) !== 40) {
    throw new Error("cure divisor");
  }
  if (cureEnmityMod(51) !== 40 || cureEnmityMod(75) !== 55 || cureEnmityMod(99) !== 69) throw new Error("cure divisor high");
  const cured = cureEnmity(75, 55);
  if (cured.ce !== 40 || cured.ve !== 240) throw new Error("level 75 cure enmity");
  if (cureEnmity(75, 1).ce !== 1 || cureEnmity(75, 1).ve !== 4) throw new Error("small cure enmity");
  if (cureEnmity(75, 0).ce !== 0 || cureEnmity(75, 0).ve !== 0) throw new Error("full cure enmity");
  const folded = foldHate({ ce: 0, ve: 0 }, 80 + CLAIM_CE, 240 + CLAIM_VE);
  if (folded.ce !== 280 || folded.ve !== 1140) throw new Error("claim fold");
  if (foldHate({ ce: ENMITY_CAP - 1, ve: 0 }, 50, 0).ce !== ENMITY_CAP) throw new Error("enmity cap");
  if (foldHate({ ce: 10, ve: 5 }, -25, 0).ce !== 0) throw new Error("ce floor");
  const held = holdClaim(0, 0, true);
  if (held.ce !== 1 || held.ve !== 0) throw new Error("near claim holds");
  const empty = holdClaim(0, 0, false);
  if (empty.ce !== 0 || empty.ve !== 0) throw new Error("far claim can empty");
  const live = holdClaim(4, 12, false);
  if (live.ce !== 4 || live.ve !== 12) throw new Error("live claim stays");
  if (HATE_NEAR_YARDS !== 30 || HATE_DEAGGRO_SECONDS !== 25) throw new Error("deaggro line");
  if (ceLostOnHit(0, 1000) !== 0 || ceLostOnHit(1000, 1000) !== 1800 || ceLostOnHit(500, 1000) !== 900) throw new Error("ce loss");
  if (!isBehind(180) || !isBehind(135) || isBehind(134.9) || isBehind(90) || isBehind(0)) throw new Error("behind arc");
  if (HARE_WALK !== 4 || HARE_RUN_MULT !== 2.5 || HARE_RUN !== 10 || HARE_MELEE_INSET !== 0.4 || HARE_CHASE_DELAY !== 0.4) {
    throw new Error("hare speed");
  }
  const left = chaseWaitLeft(0, false, true, 0);
  if (left.wait !== HARE_CHASE_DELAY || !left.wasOut) throw new Error("chase delay starts");
  const mid = chaseWaitLeft(HARE_CHASE_DELAY, true, true, 0.1);
  if (Math.abs(mid.wait - 0.3) > 1e-9 || !mid.wasOut) throw new Error("chase delay ticks");
  if (chaseWaitLeft(0.05, true, true, 0.1).wait !== 0) throw new Error("chase delay ends");
  const back = chaseWaitLeft(0.2, true, false, 0.1);
  if (back.wait !== 0 || back.wasOut) throw new Error("chase delay clears");
  const keep = chaseWaitLeft(0, true, true, 0.016);
  if (keep.wait !== 0 || !keep.wasOut) throw new Error("chase already running");
  if (harePace(4, 3.86, 1) !== 10 || harePace(3.87, 3.86, 1) !== 10) throw new Error("sprint outside melee");
  if (harePace(3.86, 3.86, 1) !== 4 || harePace(1.05, 3.86, 1) !== 4) throw new Error("walk inside melee");
  if (Math.abs(harePace(10, 3.86, 0.74) - 7.4) > 1e-9) throw new Error("gravity sprint");
  if (Math.abs(harePace(2, 3.86, 0.74) - 2.96) > 1e-9) throw new Error("gravity walk");
  if (chasesPlayer(true, 500, 900) || chasesPlayer(false, 0, 0) || !chasesPlayer(false, 1, 0) || !chasesPlayer(false, 0, 1)) {
    throw new Error("death is not a chase");
  }
  const older = { id: "player", ce: 10, ve: 10, stamp: 1 };
  const heavier = { id: "curilla", ce: 30, ve: 0, stamp: 1 };
  const later = { id: "kupipi", ce: 10, ve: 10, stamp: 2 };
  if (topHate([]) !== null || topHate([{ id: "gone", ce: 0, ve: 0, stamp: 9 }]) !== null) throw new Error("empty hate list");
  if (topHate([older, heavier])?.id !== "curilla") throw new Error("highest total holds the mob");
  if (topHate([older, later])?.id !== "kupipi") throw new Error("tie goes to the latest actor");
  const bare = { kind: "melee" as const, behind: false, hidden: false, sneak: false, trick: false, partner: false, dex: 70, agi: 65, mainThief: true, assassin: true };
  const behind = thiefStrike({ ...bare, behind: true, sneak: true });
  if (!behind.sure || !behind.hit || behind.dex !== 70 || behind.agi !== 0 || !behind.spendSa || behind.spendTa || behind.dropHide || behind.via !== "Sneak Attack") {
    throw new Error("sneak from behind");
  }
  const front = thiefStrike({ ...bare, sneak: true, trick: true });
  if (front.sure || front.hit || front.spendSa || front.spendTa || front.tell !== "both") throw new Error("frontal sneak stays");
  const sub = thiefStrike({ ...bare, behind: true, sneak: true, mainThief: false, assassin: false });
  if (!sub.sure || sub.dex !== 0 || !sub.spendSa) throw new Error("sub sneak has no DEX");
  const hidden = thiefStrike({ ...bare, hidden: true, sneak: true, trick: true });
  if (!hidden.sure || hidden.dex !== 70 || hidden.agi !== 0 || !hidden.spendSa || hidden.spendTa || !hidden.dropHide || hidden.via !== "Sneak Attack" || hidden.tell !== "ta") {
    throw new Error("hide lines sneak, not trick");
  }
  const trick = thiefStrike({ ...bare, behind: true, trick: true });
  if (trick.sure || trick.hit || trick.spendTa || trick.tell !== "ta") throw new Error("trick needs a body in front");
  const lined = thiefStrike({ ...bare, trick: true, partner: true });
  if (!lined.hit || !lined.sure || lined.dex !== 0 || lined.agi !== 65 || !lined.spendTa || lined.spendSa || lined.via !== "Trick Attack") {
    throw new Error("trick behind a party member");
  }
  const subTrick = thiefStrike({ ...bare, trick: true, partner: true, mainThief: false, assassin: false });
  if (!subTrick.hit || subTrick.sure || subTrick.agi !== 0 || !subTrick.spendTa) throw new Error("sub trick transfers hate only");
  const sata = thiefStrike({ ...bare, behind: true, sneak: true, trick: true, partner: true });
  if (!sata.sure || !sata.hit || sata.dex !== 70 || sata.agi !== 65 || !sata.spendSa || !sata.spendTa || sata.via !== "Sneak Attack and Trick Attack") {
    throw new Error("sneak and trick together");
  }
  const ranged = thiefStrike({ ...bare, kind: "ranged", behind: true, sneak: true });
  if (ranged.spendSa || ranged.sure || ranged.hit) throw new Error("ranged keeps sneak");
  const hidShot = thiefStrike({ ...bare, kind: "magic", behind: true, hidden: true, sneak: true });
  if (!hidShot.dropHide || hidShot.spendSa) throw new Error("magic breaks hide only");
  const onlyHide = thiefStrike({ ...bare, hidden: true });
  if (!onlyHide.dropHide || onlyHide.sure || onlyHide.spendSa) throw new Error("hide breaks on a swing");
  const onLine = partnerOnLine(0, 0, 0, 6, [
    { id: "dd", x: 0, z: 2 },
    { id: "tank", x: 0, z: 4 },
  ]);
  if (onLine !== "tank") throw new Error("trick target is the one closer to the mob");
  if (partnerOnLine(0, 0, 0, 6, [{ id: "side", x: 2.2, z: 3 }]) !== null) throw new Error("off the line is not trick");
  if (partnerOnLine(0, 0, 0, 6, [{ id: "back", x: 0, z: -1 }]) !== null) throw new Error("behind you is not trick");
  if (partnerOnLine(0, 0, 0, 6, []) !== null) throw new Error("no partner");
}
