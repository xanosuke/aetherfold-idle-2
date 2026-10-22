/**
 * Retail FFXI melee math used by the training yard.
 * Delay / haste: bg-wiki Attack Speed. TP: bg-wiki Tactical Points.
 * fSTR, Accuracy, Hit Rate, Evasion, Defense, Critical Hit Rate: bg-wiki.
 * Swing seconds use the common 60 delay = 1s conversion
 * (the live denominator wobbles about 58.6–60.4).
 */

export type HasteInput = {
  /** Equipment haste in /1024. Cap 256 (25%). */
  equipment: number;
  /** Magic haste in /1024. Cap 448 (43.75%). */
  magic: number;
  /** Job-ability haste in /1024. Cap 256 (25%). */
  jobAbility: number;
  /** Dual Wield as a fraction, e.g. 0.30. Multiplies before the 80% floor. */
  dualWield: number;
};

export type SwingTiming = {
  baseDelay: number;
  modifiedDelay: number;
  seconds: number;
  equipment: number;
  magic: number;
  jobAbility: number;
  dualWield: number;
};

const HASTE_CAP_EQ = 256;
const HASTE_CAP_MAG = 448;
const HASTE_CAP_JA = 256;
/** Combined delay reduction cannot pass 80% (20% of base remains). */
const MIN_REMAINING = 0.2;

export function modifiedDelay(baseDelay: number, haste: HasteInput): number {
  const equipment = clamp(haste.equipment, 0, HASTE_CAP_EQ);
  const magic = clamp(haste.magic, 0, HASTE_CAP_MAG);
  const jobAbility = clamp(haste.jobAbility, 0, HASTE_CAP_JA);
  const dw = clamp(haste.dualWield, 0, 0.8);
  let remaining = (1 - dw) * ((1024 - (equipment + magic + jobAbility)) / 1024);
  if (remaining < MIN_REMAINING) remaining = MIN_REMAINING;
  return Math.max(1, Math.floor(baseDelay * remaining));
}

export function swingTiming(baseDelay: number, haste: HasteInput): SwingTiming {
  const modified = modifiedDelay(baseDelay, haste);
  return {
    baseDelay,
    modifiedDelay: modified,
    seconds: modified / 60,
    equipment: clamp(haste.equipment, 0, HASTE_CAP_EQ),
    magic: clamp(haste.magic, 0, HASTE_CAP_MAG),
    jobAbility: clamp(haste.jobAbility, 0, HASTE_CAP_JA),
    dualWield: clamp(haste.dualWield, 0, 0.8),
  };
}

/** Zero haste — the level 1 yard starts here. TP ignores this haste. */
export const NO_HASTE: HasteInput = {
  equipment: 0,
  magic: 0,
  jobAbility: 0,
  dualWield: 0,
};

/**
 * Melee TP from modified delay (Dual Wield / Martial Arts already applied).
 * Haste is intentionally not an input. Result is floored, matching in-game gain.
 * Bands are the current retail table (181–540 covers both level-1 swords).
 */
export function tpPerHit(delay: number): number {
  let tp: number;
  if (delay <= 180) tp = 61 + ((delay - 180) * 63) / 360;
  else if (delay <= 540) tp = 61 + ((delay - 180) * 88) / 360;
  else if (delay <= 630) tp = 149 + ((delay - 540) * 20) / 360;
  else if (delay <= 720) tp = 154 + ((delay - 630) * 28) / 360;
  else if (delay <= 900) tp = 161 + ((delay - 720) * 24) / 360;
  else tp = 173 + ((delay - 900) * 28) / 360;
  return Math.floor(tp);
}

/** A player, an avatar, and a wyvern all stop at 3000. */
export const TP_CAP = 3000;

/**
 * Opening damage from a spell or a magical ability.
 * A damage-over-time tick is not this, and a 0-damage landing is not this.
 */
export const MAGIC_TAKEN_TP = 50;

/**
 * TP gained when a physical blow of this delay deals damage.
 * One third of that delay's own TP, floored.
 * Store TP is not applied. The yard's pets have none.
 */
export function tpTakenPhysical(attackerDelay: number): number {
  return Math.floor(tpPerHit(attackerDelay) / 3);
}

/** Subtle Blow I and Subtle Blow II each stop at 50%. Together they stop at 75%. */
const SUBTLE_BLOW_CAP = 50;
const SUBTLE_BLOW_II_CAP = 50;
const SUBTLE_BLOW_COMBINED = 0.75;

/**
 * TP one monster gains from one connecting hit.
 * A physical hit passes tpPerHit of the attacker's unhasted delay.
 * A damaging spell or a magical weapon skill passes 100.
 * Each hit is floored on its own. Haste is not an input. Store TP defaults to 1.
 * A miss, a damage-over-time tick, and a self weapon skill pass 0.
 */
export function monsterTpGain(baseTp: number, subtleBlow = 0, subtleBlowII = 0, storeTp = 1): number {
  if (baseTp <= 0 || storeTp <= 0) return 0;
  const sb = clamp(subtleBlow, 0, SUBTLE_BLOW_CAP) / 100;
  const sb2 = clamp(subtleBlowII, 0, SUBTLE_BLOW_II_CAP) / 100;
  const cut = Math.min(SUBTLE_BLOW_COMBINED, sb + sb2);
  return Math.floor(baseTp * storeTp * (1 - cut));
}

export function weaponDps(damage: number, delay: number): number {
  return (damage * 60) / delay;
}

/**
 * Melee fSTR from ΔSTR = attacker STR − target VIT.
 * Rank 0 lower cap is −1; otherwise lower cap is −rank. Upper cap is rank + 8.
 */
export function fStr(deltaStr: number, weaponRank: number): number {
  const lower = weaponRank <= 0 ? -1 : -weaponRank;
  const upper = weaponRank + 8;
  let value: number;
  if (deltaStr >= 12) value = Math.floor((deltaStr + 4) / 4);
  else if (deltaStr >= 6) value = Math.floor((deltaStr + 6) / 4);
  else if (deltaStr >= 1) value = Math.floor((deltaStr + 7) / 4);
  else if (deltaStr >= -2) value = Math.floor((deltaStr + 8) / 4);
  else if (deltaStr >= -7) value = Math.floor((deltaStr + 9) / 4);
  else if (deltaStr >= -15) value = Math.floor((deltaStr + 10) / 4);
  else if (deltaStr >= -21) value = Math.floor((deltaStr + 12) / 4);
  else value = Math.floor((deltaStr + 13) / 4);
  return clamp(value, lower, upper);
}

/** Main-hand attack: 8 + combat skill + STR (+ gear attack, added by the caller). */
export function mainHandAttack(str: number, combatSkill: number, gearAttack = 0): number {
  return 8 + combatSkill + str + gearAttack;
}

/** Levels 1–50 base defense, then armor DEF is added by the caller. */
export function baseDefense(vit: number, level: number): number {
  return Math.floor(vit * 1.5) + level + 8;
}

/**
 * Mob defense: floor(rank base + 8 + floor(VIT / 2)).
 * Rank E at level 1 is 4.
 */
export function mobDefense(rankBase: number, vit: number): number {
  return Math.floor(rankBase + 8 + Math.floor(vit / 2));
}

/** Accuracy from DEX, plus skill (skill ≤ 200 contributes 1:1). */
export function accuracyFrom(dex: number, skill: number, gear = 0): number {
  const fromSkill = skill <= 200 ? skill : Math.floor((skill - 200) * 0.9) + 200;
  return Math.floor(dex * 0.75) + fromSkill + gear;
}

/** Evasion from AGI and evasion skill (same skill curve, capped at the ≤200 band here). */
export function evasionFrom(agi: number, skill: number, gear = 0): number {
  const fromSkill = skill <= 200 ? skill : Math.floor((skill - 200) * 0.9) + 200;
  return Math.floor(agi / 2) + fromSkill + gear;
}

/**
 * One-handed main-hand hit rate.
 * Hit% = 75 + floor((ACC − EVA) / 2) − 2×dLVL, clamped 20–99.
 * dLVL = target level − attacker level. Same level → 0.
 */
export function hitRate(accuracy: number, evasion: number, dLevel = 0): number {
  const raw = 75 + Math.floor((accuracy - evasion) / 2) - 2 * dLevel;
  return clamp(raw, 20, 99);
}

/** dDEX crit bonus on top of the 5% melee base. Table tops out at +15. */
export function critRate(dex: number, targetAgi: number, gearPercent = 0): number {
  const d = dex - targetAgi;
  let bonus = 0;
  if (d >= 50) bonus = 15;
  else if (d >= 40) bonus = d - 35;
  else if (d >= 30) bonus = 4;
  else if (d >= 20) bonus = 3;
  else if (d >= 14) bonus = 2;
  else if (d >= 7) bonus = 1;
  return clamp(5 + bonus + gearPercent, 0, 100);
}

const SWORD_RATIO_CAP = 3.625;
const SWORD_PDIF_CAP = 3.25;

/**
 * One melee pDIF roll for a sword.
 * Ratio is attack/defense, clamped to the sword pre-cap. The roll is uniform
 * around that ratio (±0.3), a crit adds 1, then the sword cap 3.25 applies.
 * Auto-attacks have no WSC and fTP of 1, so damage is floor((DMG + fSTR) × pDIF).
 */
export function rollSwordPdif(ratio: number, crit: boolean, rng: () => number, cap = SWORD_PDIF_CAP): number {
  const r = clamp(ratio, 0, SWORD_RATIO_CAP);
  const low = Math.max(0, r - 0.3);
  const high = Math.min(cap, r + 0.3);
  let pdif = low + (high - low) * rng();
  if (crit) pdif += 1;
  const limit = crit ? cap + 1 : cap;
  if (pdif > limit) pdif = limit;
  if (pdif < 0) pdif = 0;
  return pdif;
}

export function autoAttackDamage(weaponDamage: number, fstr: number, pdif: number): number {
  return Math.max(0, Math.floor((weaponDamage + fstr) * pdif));
}

/** Hits in one auto-attack round. `extra` is Double Attack or Triple Attack. `kick` is Kick Attacks. */
export type RoundSwing = { extra: boolean; kick?: boolean; triple?: boolean };

/**
 * Strike times for one dual-wield round, as fractions of the swing clip.
 * The main hand's hits (including a multi-attack) land first. The off hand
 * lands once after that. Both hands share the Dual Wield delay; this does
 * not add a second timer.
 */
export function dualWieldMarks(mainHits: number): { u: number; offhand: boolean }[] {
  const n = Math.max(1, Math.min(8, Math.floor(mainHits)));
  const main = n === 1 ? [0.28] : Array.from({ length: n }, (_, i) => 0.14 + (0.3 * i) / (n - 1));
  return [...main.map((u) => ({ u, offhand: false })), { u: 0.74, offhand: true }];
}

/**
 * Hits in one auto-attack round.
 *
 * `fists` is 1 for a weapon, or 2 when Hand-to-Hand skill lets both hands
 * swing. Triple Attack is rolled once per fist, before Double Attack.
 * They do not both land on the same swing. Triple Attack adds two extra
 * hits. Double Attack adds one, and it cannot proc off an extra hit.
 * Kick Attacks, when the chance is above 0, is one more roll after the fists.
 * It is not a fist and it cannot proc either multi-attack. The round stops at 8.
 * BG-Wiki Triple Attack, Double Attack, and Kick Attacks.
 */
export function attackRound(fists: number, doubleAttack: number, random: () => number = Math.random, kickChance = 0, tripleAttack = 0): RoundSwing[] {
  const swings: RoundSwing[] = [];
  const n = Math.max(1, Math.min(8, fists));
  for (let i = 0; i < n && swings.length < 8; i++) {
    swings.push({ extra: false });
    if (swings.length < 8 && random() < tripleAttack) {
      swings.push({ extra: true, triple: true });
      if (swings.length < 8) swings.push({ extra: true, triple: true });
    } else if (swings.length < 8 && random() < doubleAttack) swings.push({ extra: true });
  }
  if (swings.length < 8 && kickChance > 0 && random() < kickChance) swings.push({ extra: false, kick: true });
  return swings;
}

export function assertFormulas(): void {
  if (tpPerHit(231) !== 73) throw new Error(`Bronze Sword TP ${tpPerHit(231)}`);
  if (tpPerHit(228) !== 72) throw new Error(`Onion Sword TP ${tpPerHit(228)}`);
  if (tpPerHit(240) !== 75 || tpTakenPhysical(240) !== 25) throw new Error("240 delay TP");
  if (tpPerHit(320) !== 95 || tpTakenPhysical(320) !== 31) throw new Error("320 delay TP");
  if (MAGIC_TAKEN_TP !== 50 || TP_CAP !== 3000) throw new Error("taken TP");
  const timing = swingTiming(231, NO_HASTE);
  if (timing.modifiedDelay !== 231) throw new Error("haste-free delay");
  if (Math.abs(timing.seconds - 231 / 60) > 1e-9) throw new Error("seconds");
  const hasted = swingTiming(231, { ...NO_HASTE, magic: 150 });
  if (hasted.modifiedDelay !== 197 || Math.abs(hasted.seconds - 197 / 60) > 1e-9) throw new Error("Haste 150 delay");
  if (fStr(4, 0) !== 2) throw new Error(`fSTR ${fStr(4, 0)}`);
  if (hitRate(10, 10, 0) !== 75) throw new Error("hit rate");
  if (mainHandAttack(8, 5) !== 21) throw new Error("attack");
  if (baseDefense(6, 1) !== 18) throw new Error("defense");
  const bare = attackRound(2, 0, () => 0);
  if (bare.length !== 2 || bare.some((swing) => swing.extra)) throw new Error("h2h without double attack");
  const doubled = attackRound(2, 1, () => 0);
  if (doubled.length !== 4 || doubled.filter((swing) => swing.extra).length !== 2) throw new Error("h2h both fists");
  const weapon = attackRound(1, 1, () => 0);
  if (weapon.length !== 2 || weapon[0].extra || !weapon[1].extra) throw new Error("weapon double attack");
  if (attackRound(8, 1, () => 0).length !== 8) throw new Error("eight hit cap");
  const kicked = attackRound(2, 0, () => 0, 1);
  if (kicked.length !== 3 || kicked[2].kick !== true || kicked[0].kick || kicked[1].kick) throw new Error("kick");
  if (attackRound(2, 0, () => 0.5, 0.12).some((swing) => swing.kick)) throw new Error("kick rate");
  if (attackRound(8, 0, () => 0, 1).some((swing) => swing.kick)) throw new Error("kick cap");
  const tripled = attackRound(1, 1, () => 0, 0, 1);
  if (tripled.length !== 3 || tripled[0].extra || tripled[1].triple !== true || tripled[2].triple !== true) throw new Error("triple attack");
  const doubledStill = attackRound(1, 1, () => 0, 0, 0);
  if (doubledStill.length !== 2 || doubledStill[1].triple) throw new Error("double attack unchanged");
  if (attackRound(1, 0.05, () => 0.99, 0, 0.05).length !== 1) throw new Error("neither multi-attack");
  if (attackRound(3, 0, () => 0, 0, 1).length !== 8) throw new Error("triple attack cap");
  const dw = dualWieldMarks(1);
  if (dw.length !== 2 || dw[0].offhand || dw[0].u !== 0.28 || !dw[1].offhand || dw[1].u !== 0.74 || dw[0].u >= dw[1].u) {
    throw new Error("dual wield marks");
  }
  const dwExtra = dualWieldMarks(2);
  if (dwExtra.length !== 3 || dwExtra.filter((mark) => mark.offhand).length !== 1 || dwExtra[0].u >= dwExtra[1].u) {
    throw new Error("dual wield extra");
  }
  if (rollSwordPdif(10, true, () => 1) !== 4.25) throw new Error("crit pDIF cap");
  if (rollSwordPdif(10, false, () => 1) !== 3.25) throw new Error("pDIF cap");
  if (tpPerHit(366) !== 106 || tpPerHit(264) !== 81) throw new Error("staff and club TP");
  if (monsterTpGain(106, 10) !== 95 || monsterTpGain(100, 10) !== 90) throw new Error("Auspice TP");
  if (monsterTpGain(81, 10) * 2 !== 144 || Math.floor(162 * 0.9) === 144) throw new Error("hits floor apart");
  if (monsterTpGain(100, 0) !== 100 || monsterTpGain(0, 10) !== 0 || monsterTpGain(100, 60) !== 50) throw new Error("Subtle Blow cap");
  if (monsterTpGain(100, 40, 40) !== 25 || monsterTpGain(100, 50, 50) !== 25) throw new Error("combined Subtle Blow");
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}
