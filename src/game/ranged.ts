/**
 * Retail ranged attack. BG-Wiki Delay, Ranged Attack, Base Damage, FSTR, PDIF.
 *
 * A compound shot (bow + arrow, crossbow + bolt) aims for
 * ranged-weapon delay / 106 seconds. Ammunition delay is not part of that
 * aim. It is added only when TP is counted. Thrown weapons have no separate
 * ranged weapon. BG says they seem to use the ammunition delay as the aim,
 * and that has not been fully tested, so a pebble uses the same divisor.
 * Snapshot, Rapid Shot, and Velocity Shot change the aim.
 * Delay is weapon delay × (1 − Snapshot) × (1 − Velocity Shot) × (1 − Rapid Shot).
 * Snapshot is a percent, capped at 70%, and does not change TP per hit.
 * Rapid Shot procs cut that shot to 50–98% of the delay.
 * Velocity Shot multiplies the aim by 0.85 and the ranged attack stat by +38/256.
 *
 * After the projectile lands, melee and other actions stay locked for the
 * one second already named in locks.ts. That second is the weapon being
 * put away. BG-Wiki Delay calls it about one second of overhead.
 *
 * The client animation, inside that aim, is:
 * bow — bring it into both hands, draw, hold on the target, loose;
 * crossbow — raise it to the shoulder, hold, a short kick, the bolt leaves;
 * throwing — the arm cocks and lets go. The bolt's flight is shorter and
 * flatter than an arrow. Damage is the moment the projectile arrives,
 * which is the end of the aim, not the button press.
 * Snapshot only shortens that same draw and hold. A Rapid Shot proc,
 * and every bow weapon skill, skip the hold: a short nock, the string
 * lets go at once, and the projectile is already in the air. It still
 * arrives when the aim ends.
 * A marksmanship weapon skill does not take that aim. Retail starts it
 * on the command, the way a melee weapon skill starts. The salute, the
 * charge, and the kick are the motion. The bullet is already leaving.
 * Damage is when that short flight arrives, not when the gun's delay
 * would have finished. An auto-shot still waits out shotAimSeconds.
 *
 * Base damage is weapon DMG + ammunition DMG + fSTR2.
 * Ranged Attack, the stat, is 8 + combat skill + STR.
 * Archery and Throwing pDIF cap at 3.25. Marksmanship caps at 3.50.
 * Damage Limit+ is added on top of that cap. A ranged critical hit uses
 * the melee pDIF roll: the crit adds 1, then the cap rises by 1.
 * Dead Aim multiplies that crit's damage. It does not change the crit rate.
 *
 * Ranged Attack and a ranged weapon skill do not spend ammunition.
 */

import { ITEMS } from "./content";
import { accuracyFrom, autoAttackDamage, critRate, hitRate, rollSwordPdif, tpPerHit } from "./formulas";
import { VELOCITY_AIM, VELOCITY_ATTACK, rapidShotFactor } from "./rng";
import { scale256 } from "./war";

export const RANGED_DELAY_DIVISOR = 106;
export const AMMO_STACK = 99;

const STACKED = new Set(["wooden-arrow", "bronze-bolt", "bronze-bullet"]);

export type RangedFamily = "archery" | "marksmanship" | "throwing";

export type RangedPair = {
  family: RangedFamily;
  skillName: "Archery" | "Marksmanship" | "Throwing";
  weaponDelay: number;
  ammoDelay: number;
  weaponDmg: number;
  ammoDmg: number;
  rank: number;
  ammoId: string;
};

export function ammoCount(id: string | null | undefined): number {
  return id && STACKED.has(id) ? AMMO_STACK : 0;
}

/** A shot and a ranged weapon skill both leave the stack untouched. */
export function keepAmmo(id: string | null | undefined): number {
  return ammoCount(id);
}

/** Seconds from a marksmanship weapon skill until the bullet lands.
 * Not the gun's delay. The motion starts on the command. Snapshot,
 * Rapid Shot, and Velocity Shot belong to the auto-shot and do not
 * change this. A musketoon auto-shot still aims for 360 / 106.
 */
export const MARKSMANSHIP_WS_AIM = 0.85;

/** Seconds from the command until the projectile lands. */
export function aimSeconds(weaponDelay: number): number {
  return weaponDelay / RANGED_DELAY_DIVISOR;
}

/** Aim after Snapshot, Velocity Shot, and one Rapid Shot roll. A roll equal to the rate does not proc. Snapshot caps at 70%. */
export function shotAimSeconds(
  weaponDelay: number,
  opts: { velocity?: boolean; rapidRate?: number; rapidRoll?: number; rapidCut?: number; snapshot?: number } = {},
): number {
  const snapshot = Math.min(0.7, Math.max(0, opts.snapshot ?? 0));
  const velocity = opts.velocity ? VELOCITY_AIM : 1;
  const rapid = rapidShotFactor(opts.rapidRate ?? 0, opts.rapidRoll ?? 1, opts.rapidCut ?? 0);
  return aimSeconds(weaponDelay) * (1 - snapshot) * velocity * rapid;
}

/** Ranged hit rate. The cap is 95, or 99 while Sharpshot is up. */
export function rangedHitChance(accuracy: number, evasion: number, dLevel: number, sharpshot = false): number {
  return Math.min(sharpshot ? 99 : 95, hitRate(accuracy, evasion, dLevel));
}

/**
 * fSTR2. Same bands as melee fSTR, divided by 2 instead of 4.
 * Rank 0 lower cap is -2. Rank 1 lower cap is -3. Otherwise -rank × 2.
 * Upper cap is (rank + 8) × 2. BG-Wiki FSTR.
 */
export function fStr2(deltaStr: number, weaponRank: number): number {
  let value: number;
  if (deltaStr >= 12) value = Math.floor((deltaStr + 4) / 2);
  else if (deltaStr >= 6) value = Math.floor((deltaStr + 6) / 2);
  else if (deltaStr >= 1) value = Math.floor((deltaStr + 7) / 2);
  else if (deltaStr >= -2) value = Math.floor((deltaStr + 8) / 2);
  else if (deltaStr >= -7) value = Math.floor((deltaStr + 9) / 2);
  else if (deltaStr >= -15) value = Math.floor((deltaStr + 10) / 2);
  else if (deltaStr >= -21) value = Math.floor((deltaStr + 12) / 2);
  else value = Math.floor((deltaStr + 13) / 2);
  const lower = weaponRank <= 0 ? -2 : weaponRank === 1 ? -3 : -weaponRank * 2;
  const upper = (weaponRank + 8) * 2;
  return Math.max(lower, Math.min(upper, value));
}

/** Ranged Attack = 8 + combat skill + STR. BG-Wiki Ranged Attack. */
export function rangedAttack(str: number, skill: number): number {
  return 8 + skill + str;
}

export function rangedPdifCap(family: RangedFamily): number {
  return family === "marksmanship" ? 3.5 : 3.25;
}

/** Compound weapons add both delays. Throwing counts the ammunition delay once. */
export function rangedTpDelay(pair: RangedPair): number {
  if (pair.family === "throwing") return pair.ammoDelay;
  return pair.weaponDelay + pair.ammoDelay;
}

export function rangedTp(pair: RangedPair): number {
  return tpPerHit(rangedTpDelay(pair));
}

export function pairRanged(rangeId: string | null, ammoId: string | null): { ok: true; shot: RangedPair } | { ok: false; reason: string } {
  const range = rangeId ? ITEMS[rangeId] : null;
  const ammo = ammoId ? ITEMS[ammoId] : null;
  if (range?.kind === "Fishing Rod") return { ok: false, reason: "You do not have a ranged weapon equipped." };
  if (range?.kind === "Archery") {
    if (ammo?.id !== "wooden-arrow") return { ok: false, reason: "You do not have the proper ammunition equipped." };
    return {
      ok: true,
      shot: {
        family: "archery",
        skillName: "Archery",
        weaponDelay: range.delay ?? 0,
        ammoDelay: ammo.delay ?? 0,
        weaponDmg: range.dmg ?? 0,
        ammoDmg: ammo.dmg ?? 0,
        rank: range.rank ?? 0,
        ammoId: ammo.id,
      },
    };
  }
  if (range?.kind === "Marksmanship") {
    const bullet = range.id === "musketoon";
    const ammoId = bullet ? "bronze-bullet" : "bronze-bolt";
    if (ammo?.id !== ammoId) return { ok: false, reason: "You do not have the proper ammunition equipped." };
    return {
      ok: true,
      shot: {
        family: "marksmanship",
        skillName: "Marksmanship",
        weaponDelay: range.delay ?? 0,
        ammoDelay: ammo.delay ?? 0,
        weaponDmg: range.dmg ?? 0,
        ammoDmg: ammo.dmg ?? 0,
        rank: range.rank ?? 0,
        ammoId: ammo.id,
      },
    };
  }
  if (range) return { ok: false, reason: "You do not have the proper ammunition equipped." };
  if (ammo?.kind === "Throwing") {
    return {
      ok: true,
      shot: {
        family: "throwing",
        skillName: "Throwing",
        weaponDelay: ammo.delay ?? 0,
        ammoDelay: ammo.delay ?? 0,
        weaponDmg: ammo.dmg ?? 0,
        ammoDmg: 0,
        rank: ammo.rank ?? 0,
        ammoId: ammo.id,
      },
    };
  }
  if (ammo) return { ok: false, reason: "You do not have a ranged weapon equipped." };
  return { ok: false, reason: "You do not have a ranged weapon equipped." };
}

export type RangedStrike = {
  hit: boolean;
  crit: boolean;
  dmg: number;
  base: number;
  fstr2: number;
  attack: number;
  ratio: number;
  pdif: number;
};

export function rangedStrike(args: {
  pair: RangedPair;
  str: number;
  agi: number;
  skill: number;
  targetVit: number;
  targetEva: number;
  targetDef: number;
  targetLevel: number;
  attackerLevel: number;
  sneakDex: number;
  sure: boolean;
  rng: () => number;
  targetAgi?: number;
  accBonus?: number;
  sharpshot?: boolean;
  velocity?: boolean;
  deadAim?: number;
  pdifBonus?: number;
  /** Fury and other percent attack, in 256ths. Velocity Shot is added on top. */
  attackNumer?: number;
  ftp?: number;
}): RangedStrike {
  const fstr2 = fStr2(args.str - args.targetVit, args.pair.rank);
  const baseAttack = rangedAttack(args.str, args.skill);
  const numer = (args.velocity ? VELOCITY_ATTACK : 0) + (args.attackNumer ?? 0);
  const attack = numer !== 0 ? scale256(baseAttack, numer) : baseAttack;
  const chance = rangedHitChance(accuracyFrom(args.agi, args.skill) + (args.accBonus ?? 0), args.targetEva, args.targetLevel - args.attackerLevel, args.sharpshot === true);
  const ratio = attack / Math.max(1, args.targetDef);
  const baseWeapon = args.pair.weaponDmg + args.pair.ammoDmg;
  if (!args.sure && args.rng() * 100 >= chance) {
    return { hit: false, crit: false, dmg: 0, base: baseWeapon + fstr2, fstr2, attack, ratio, pdif: 0 };
  }
  const cap = rangedPdifCap(args.pair.family) + Math.max(0, args.pdifBonus ?? 0);
  const crit = args.sure || args.rng() * 100 < critRate(args.agi, args.targetAgi ?? args.agi);
  const pdif = rollSwordPdif(ratio, crit, args.rng, cap);
  const withSneak = baseWeapon + (crit ? args.sneakDex : 0);
  let dmg = autoAttackDamage(withSneak, fstr2, pdif);
  if (crit && (args.deadAim ?? 0) > 0) dmg = Math.floor(dmg * (1 + (args.deadAim ?? 0)));
  if (args.ftp != null && args.ftp !== 1) dmg = Math.floor(dmg * args.ftp);
  return {
    hit: true,
    crit,
    dmg,
    base: withSneak + fstr2,
    fstr2,
    attack,
    ratio,
    pdif,
  };
}

export function assertRanged(): void {
  const arrow = ITEMS["wooden-arrow"];
  const bolt = ITEMS["bronze-bolt"];
  if (!arrow || arrow.slot !== "ammo" || arrow.jobs !== "All Jobs" || arrow.line !== "DMG:5 Delay:120" || arrow.dmg !== 5 || arrow.delay !== 120 || arrow.level !== 1) {
    throw new Error("wooden arrow");
  }
  if (!bolt || bolt.slot !== "ammo" || bolt.jobs !== "WAR DRK RNG" || bolt.line !== "DMG:10 Delay:192" || bolt.dmg !== 10 || bolt.delay !== 192 || bolt.level !== 1) {
    throw new Error("bronze bolt");
  }
  if (ammoCount("wooden-arrow") !== 99 || ammoCount("bronze-bolt") !== 99 || ammoCount("pebble") !== 0) throw new Error("ammo stack");
  if (keepAmmo("wooden-arrow") !== 99 || keepAmmo("bronze-bolt") !== 99) throw new Error("a shot spent ammunition");
  if (Math.abs(aimSeconds(360) - 360 / 106) > 1e-12 || Math.abs(aimSeconds(288) - 288 / 106) > 1e-12 || Math.abs(aimSeconds(276) - 276 / 106) > 1e-12) {
    throw new Error("aim time");
  }
  const bow = pairRanged("shortbow", "wooden-arrow");
  if (!bow.ok || bow.shot.family !== "archery" || bow.shot.weaponDelay !== 360 || bow.shot.ammoDelay !== 120) throw new Error("bow pair");
  if (pairRanged("shortbow", "bronze-bolt").ok || pairRanged("shortbow", "pebble").ok || pairRanged("shortbow", null).ok) throw new Error("bow accepts the wrong ammo");
  const xbow = pairRanged("light-crossbow", "bronze-bolt");
  if (!xbow.ok || xbow.shot.family !== "marksmanship" || xbow.shot.weaponDelay !== 288 || rangedPdifCap(xbow.shot.family) !== 3.5) throw new Error("crossbow pair");
  if (pairRanged("light-crossbow", "wooden-arrow").ok || pairRanged("light-crossbow", "bronze-bullet").ok) throw new Error("crossbow accepts an arrow");
  const gun = pairRanged("musketoon", "bronze-bullet");
  if (!gun.ok || gun.shot.family !== "marksmanship" || gun.shot.weaponDmg !== 8 || gun.shot.ammoDmg !== 10 || gun.shot.weaponDelay !== 360) throw new Error("musketoon pair");
  if (pairRanged("musketoon", "bronze-bolt").ok) throw new Error("musketoon accepts a bolt");
  const stone = pairRanged(null, "pebble");
  if (!stone.ok || stone.shot.family !== "throwing" || stone.shot.weaponDelay !== 276 || rangedTpDelay(stone.shot) !== 276) throw new Error("throwing pair");
  if (pairRanged(null, "wooden-arrow").ok || pairRanged(null, null).ok) throw new Error("loose ammo");
  if (pairRanged("bamboo-fishing-rod", "little-worm").ok) throw new Error("a fishing rod shoots");
  if (!bow.ok) return;
  if (rangedTpDelay(bow.shot) !== 480 || rangedTp(bow.shot) !== tpPerHit(480)) throw new Error("bow tp");
  if (fStr2(66, 0) !== 16 || fStr2(12, 0) !== 8 || rangedAttack(70, 210) !== 288) throw new Error("ranged attack stat");
  const struck = rangedStrike({
    pair: bow.shot,
    str: 70,
    agi: 60,
    skill: 210,
    targetVit: 4,
    targetEva: 10,
    targetDef: 20,
    targetLevel: 1,
    attackerLevel: 75,
    sneakDex: 0,
    sure: false,
    rng: () => 0,
  });
  if (!struck.hit || struck.dmg <= 0 || struck.fstr2 !== 16) throw new Error("ranged hit");
  if (keepAmmo(bow.shot.ammoId) !== 99) throw new Error("hit spent an arrow");
  const plainAim = shotAimSeconds(360);
  if (Math.abs(plainAim - aimSeconds(360)) > 1e-12) throw new Error("plain aim");
  if (Math.abs(shotAimSeconds(360, { velocity: true }) - aimSeconds(360) * 0.85) > 1e-12) throw new Error("velocity aim");
  if (Math.abs(shotAimSeconds(360, { rapidRate: 0.3, rapidRoll: 0, rapidCut: 1 }) - aimSeconds(360) * 0.5) > 1e-12) throw new Error("rapid aim");
  if (shotAimSeconds(360, { rapidRate: 0.3, rapidRoll: 0.3, rapidCut: 0 }) !== aimSeconds(360)) throw new Error("rapid shot does not proc on the rate");
  if (Math.abs(shotAimSeconds(360, { snapshot: 0.1 }) - aimSeconds(360) * 0.9) > 1e-12) throw new Error("snapshot aim");
  if (Math.abs(shotAimSeconds(360, { snapshot: 0.9 }) - aimSeconds(360) * 0.3) > 1e-12) throw new Error("snapshot cap");
  if (Math.abs(shotAimSeconds(360, { snapshot: 0.1, velocity: true, rapidRate: 0.3, rapidRoll: 0, rapidCut: 1 }) - aimSeconds(360) * 0.9 * 0.85 * 0.5) > 1e-12) throw new Error("snapshot stack");
  if (MARKSMANSHIP_WS_AIM >= aimSeconds(288) || MARKSMANSHIP_WS_AIM < 0.45) throw new Error("marksmanship weapon skill waits on the gun");
  if (rangedHitChance(9999, 0, 0, false) !== 95 || rangedHitChance(9999, 0, 0, true) !== 99) throw new Error("ranged hit cap");
}
