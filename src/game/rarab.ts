/**
 * Tropical Rarab, Bibiki Bay. One specimen at 75, inside the 73–76 range.
 * The mob pool is WAR/WAR, scythe skill, delay 240, damage multiplier 100.
 * Family ranks are the rabbit row. Subjob stats are halved (ToAU, level 75).
 * Sight and scent are on the family card. This yard does not use them:
 * the rarab stays passive until something puts it on the hate list.
 * Snow Cloud is the arctic rabbit. This one does not have it.
 */
import { aggros, FOREST_HARE_DETECT } from "./aggro";
import { HARE_RADIUS, MOB_MELEE_REACH } from "./distance";
import {
  autoAttackDamage,
  critRate,
  fStr,
  hitRate,
  mainHandAttack,
  mobDefense,
  rollSwordPdif,
  tpPerHit,
} from "./formulas";
import { phalanxTaken, shellTaken } from "./magic";
import { sentinelCut } from "./pld";
import { skillCap } from "./skills";

const RANK_BASE = [0, 5, 4, 4, 3, 3, 2, 2];
const RANK_SLOPE = [0, 50, 45, 40, 35, 30, 25, 20];

/** LSB GetBaseToRank. Integer division. 1 is A, 7 is G. */
export function rankAt(rank: number, level: number): number {
  if (rank < 1 || rank > 7 || level < 1) return 0;
  return RANK_BASE[rank] + Math.floor(((level - 1) * RANK_SLOPE[rank]) / 100);
}

/** Family + main job + halved subjob. The subjob is the same letter as the main. */
function pooled(family: number, job: number, level: number): number {
  return rankAt(family, level) + rankAt(job, level) + Math.floor(rankAt(job, level) / 2);
}

/** f(level, rank) for defense and evasion above 50. Rank 3 is C. */
export function baseDefEva(rank: number, level: number): number {
  if (level <= 50) throw new Error("def/eva below 51 is not this specimen");
  const row =
    rank === 1 ? [153, 5] :
    rank === 2 ? [147, 4.9] :
    rank === 3 ? [142, 4.8] :
    rank === 4 ? [136, 4.7] :
    rank === 5 ? [126, 4.5] :
    null;
  if (!row) throw new Error("def/eva rank");
  return Math.floor(row[0] + (level - 50) * row[1]);
}

/** Main-job HP before the subjob term. Rank B is base 33, scale 8, scale-x 1. */
export function mainJobHp(level: number, base: number, jobScale: number, scaleX: number): number {
  if (level <= 0) return 0;
  const to5 = Math.min(level, 5);
  const to30 = Math.min(level, 30);
  let hp = base + (to5 - 1) * (jobScale + 5);
  hp += to5 >= 5 ? 14 : to5 === 4 ? 7 : to5 === 3 ? 3 : 0;
  if (level > 5) hp += Math.floor(((to30 - 5) * (2 * jobScale + to30 + 6)) / 2);
  if (level > 30) hp += (level - 30) * (63 + scaleX) + (level - 31) * (jobScale + 6);
  return hp;
}

/** Subjob HP at the scaled subjob level. Level 50 and up uses the full main level. */
export function subjobHp(level: number, jobScale: number, scaleX: number): number {
  const sj =
    jobScale * Math.max(level - 1, 0) +
    (0.5 + 0.5 * scaleX) * Math.max(level - 10, 0) +
    Math.max(level - 30, 0) +
    Math.max(level - 50, 0) +
    Math.max(level - 70, 0);
  return Math.ceil(sj / 2);
}

const LEVEL = 75;
/** Rabbit family: STR D, DEX C, VIT D, AGI D, INT D, MND D, CHR D. Defense and evasion stay C. */
const STR = pooled(4, 1, LEVEL);
const DEX = pooled(3, 3, LEVEL);
const VIT = pooled(4, 4, LEVEL);
const AGI = pooled(4, 3, LEVEL);
const INT = pooled(4, 6, LEVEL);
const MND = pooled(4, 6, LEVEL);
const CHR = pooled(4, 5, LEVEL);
const DEF_BASE = baseDefEva(3, LEVEL);
/** WAR evasion skill is C, which is GetBaseDefEva rank 3. Then + floor(AGI / 2). */
const EVA_SKILL = baseDefEva(3, LEVEL);
const COMBAT_SKILL = skillCap("A+", LEVEL);
const WEAPON = Math.floor(LEVEL * 1) + 10;

export const TROPICAL_RARAB = {
  name: "Tropical Rarab",
  family: "Rabbit",
  job: "WAR/WAR",
  zone: "Bibiki Bay",
  level: LEVEL,
  levelMin: 73,
  levelMax: 76,
  hpNatural: mainJobHp(LEVEL, 33, 8, 1) + subjobHp(LEVEL, 8, 1),
  mp: 0,
  str: STR,
  dex: DEX,
  vit: VIT,
  agi: AGI,
  int: INT,
  mnd: MND,
  chr: CHR,
  evasion: EVA_SKILL + Math.floor(AGI / 2),
  /** f(level, defense rank C). mobDefense adds 8 + floor(VIT / 2). */
  defRankBase: DEF_BASE,
  accuracy: Math.floor(DEX * 0.75) + COMBAT_SKILL,
  attack: mainHandAttack(STR, COMBAT_SKILL),
  /**
   * Weapon skill on the swing. Normal mobs are given rank C on every weapon
   * skill, scythe included. Block rate uses this, not the accuracy rank.
   */
  combatSkill: skillCap("C", LEVEL),
  /** ToAU weapon offset is 10. Multiplier 100. Delay 240 is 4.0 seconds. */
  weaponDamage: WEAPON,
  delay: 240,
  /** floor(weapon damage / 9). The fSTR cap. A normal VIT does not reach it. */
  weaponRank: Math.floor(WEAPON / 9),
  /** Pool cmbSkill 7. Auto-attacks and the physical TP moves are slashing. */
  damageType: "slashing" as const,
  undead: false,
  /** It does not open a fight. A claim does. */
  aggressive: false,
};

export type RarabMove = "attack" | "Foot Kick" | "Whirl Claws" | "Dust Cloud" | "Wild Carrot";

/**
 * One roll. Under 1000 TP this is the auto-attack.
 * At 1000 or more, and below half HP, the first 35% is Wild Carrot.
 * The rest of the roll, or the whole roll at half HP and above, is
 * Foot Kick, then Whirl Claws, then Dust Cloud.
 * Skill-list 404 is not in this kit, so the mix is that split.
 */
export function chooseRarabMove(tp: number, hpRatio: number, roll: number): RarabMove {
  if (tp < 1000) return "attack";
  const r = Math.min(0.999999, Math.max(0, roll));
  if (hpRatio < 0.5 && r < 0.35) return "Wild Carrot";
  const band = hpRatio < 0.5 ? (r - 0.35) / 0.65 : r;
  if (band < 0.5) return "Foot Kick";
  if (band < 0.75) return "Whirl Claws";
  return "Dust Cloud";
}

/** Foot Kick is 1.0 below 50 and 2.0 from 50. It always crits when it hits. */
export function footKickFtp(level: number): number {
  return level >= 50 ? 2 : 1;
}

/** Dust Cloud is earth magic. Base is level + 2, then fTP 2. Day and weather stay out. Resist is the defender's, not this number. */
export function dustCloudRaw(level: number): number {
  return (level + 2) * 2;
}

/** Wild Carrot. floor(max HP × 104/1024). It does not damage the player. */
export function wildCarrotHeal(maxHp: number): number {
  return Math.floor((maxHp * 104) / 1024);
}

export function rarabShadows(move: RarabMove): number {
  if (move === "Whirl Claws") return 3;
  if (move === "attack" || move === "Foot Kick") return 1;
  return 0;
}

/** Auto is floor((weapon + fSTR) × pDIF). A physical TP move has no fSTR. */
export function physicalRaw(move: RarabMove, weaponDamage: number, fstr: number, pdif: number, level: number): number {
  if (move === "attack") return autoAttackDamage(weaponDamage, fstr, pdif);
  const ftp = move === "Foot Kick" ? footKickFtp(level) : 2;
  return Math.max(0, Math.floor(weaponDamage * ftp * Math.max(0, pdif)));
}

export type RarabStrike = {
  move: RarabMove;
  hit: boolean;
  crit: boolean;
  /** Before Rampart, Sentinel, Shell, Phalanx, Stoneskin, and Invincible. */
  raw: number;
  /** 0 ignores shadows. 1 is one shadow. 3 is Whirl Claws. */
  shadows: number;
  physical: boolean;
  magical: boolean;
  heal: number;
  /** Blindness power. 0 when this move does not blind. */
  blind: number;
  /** Sword pDIF on a physical hit. 0 when the swing did not roll one. */
  pdif: number;
  /** A TP move spends the bar even when it misses. An auto does not. */
  spendTp: boolean;
  /** TP an auto grants when the swing connects. A miss and a TP move grant 0. */
  tpGain: number;
};

/**
 * One swing. Hit rate, crit, fSTR, and pDIF are the yard's melee formulas.
 * A physical TP move is floor(weapon × fTP × pDIF), with no fSTR and no WSC.
 * An auto is floor((weapon + fSTR) × pDIF). pDIF is the sword roll this yard already uses.
 */
export function rollRarabStrike(input: {
  move: RarabMove;
  weaponDamage: number;
  level: number;
  attack: number;
  defense: number;
  accuracy: number;
  evasion: number;
  dLevel: number;
  dex: number;
  targetAgi: number;
  str: number;
  targetVit: number;
  weaponRank: number;
  maxHp: number;
  hitRoll: number;
  critRoll: number;
  pdifRoll: number;
}): RarabStrike {
  const move = input.move;
  const spendTp = move !== "attack";
  const shadows = rarabShadows(move);
  if (move === "Wild Carrot") {
    return { move, hit: true, crit: false, raw: 0, shadows: 0, physical: false, magical: false, heal: wildCarrotHeal(input.maxHp), blind: 0, pdif: 0, spendTp, tpGain: 0 };
  }
  if (move === "Dust Cloud") {
    return { move, hit: true, crit: false, raw: dustCloudRaw(input.level), shadows: 0, physical: false, magical: true, heal: 0, blind: 30, pdif: 0, spendTp, tpGain: 0 };
  }
  const chance = hitRate(input.accuracy, input.evasion, input.dLevel);
  const hit = input.hitRoll < chance;
  if (!hit) {
    return { move, hit: false, crit: false, raw: 0, shadows, physical: true, magical: false, heal: 0, blind: 0, pdif: 0, spendTp, tpGain: 0 };
  }
  const forced = move === "Foot Kick";
  const crit = forced || input.critRoll < critRate(input.dex, input.targetAgi);
  const defense = Math.max(1, input.defense);
  const pdif = rollSwordPdif(input.attack / defense, crit, () => input.pdifRoll);
  const raw = physicalRaw(move, input.weaponDamage, fStr(input.str - input.targetVit, input.weaponRank), pdif, input.level);
  return {
    move,
    hit: true,
    crit,
    raw,
    shadows,
    physical: true,
    magical: false,
    heal: 0,
    blind: 0,
    pdif,
    spendTp,
    tpGain: move === "attack" ? tpPerHit(TROPICAL_RARAB.delay) : 0,
  };
}

/** Center-to-center. Two rabbit bodies plus the monster melee reach. Not the player check. */
export const HARE_VS_HARE = HARE_RADIUS + MOB_MELEE_REACH + HARE_RADIUS;

export type RarabFoeMove = "attack" | "Foot Kick" | "Whirl Claws" | "Dust Cloud" | "Wild Carrot";

export type RarabOnRarab = {
  move: RarabFoeMove;
  /** A damaging blow connected. Wild Carrot is a self-heal, not a hit. */
  hit: boolean;
  crit: boolean;
  /** Damage on the other rarab. 0 on a miss, a heal, or a blow that never left. */
  damage: number;
  /** HP the attacker restores. Only Wild Carrot. */
  heal: number;
  /** TP a connecting auto grants. A miss and a TP move grant 0. */
  tpGain: number;
  spent: boolean;
  whiff: "none" | "dead" | "range" | "miss";
};

/**
 * One Tropical Rarab striking the other.
 * Same stats, dLevel 0, the mob's own defense. No player Rampart, Phalanx, or shadows.
 * Wild Carrot heals the attacker and does not need the other one alive.
 * A dead foe, or a gap past 3', spends a TP move without a blow. An auto simply does not swing.
 */
export function rarabOnRarab(input: {
  move: RarabFoeMove;
  otherAlive: boolean;
  yards: number;
  hitRoll?: number;
  critRoll?: number;
  pdifRoll?: number;
  maxHp?: number;
}): RarabOnRarab {
  const hare = TROPICAL_RARAB;
  const maxHp = input.maxHp ?? hare.hpNatural;
  if (input.move === "Wild Carrot") {
    return { move: input.move, hit: false, crit: false, damage: 0, heal: wildCarrotHeal(maxHp), tpGain: 0, spent: true, whiff: "none" };
  }
  if (!input.otherAlive) {
    return { move: input.move, hit: false, crit: false, damage: 0, heal: 0, tpGain: 0, spent: input.move !== "attack", whiff: "dead" };
  }
  if (input.yards > HARE_VS_HARE) {
    return { move: input.move, hit: false, crit: false, damage: 0, heal: 0, tpGain: 0, spent: input.move !== "attack", whiff: "range" };
  }
  const strike = rollRarabStrike({
    move: input.move,
    weaponDamage: hare.weaponDamage,
    level: hare.level,
    attack: hare.attack,
    defense: mobDefense(hare.defRankBase, hare.vit),
    accuracy: hare.accuracy,
    evasion: hare.evasion,
    dLevel: 0,
    dex: hare.dex,
    targetAgi: hare.agi,
    str: hare.str,
    targetVit: hare.vit,
    weaponRank: hare.weaponRank,
    maxHp,
    hitRoll: input.hitRoll ?? 0,
    critRoll: input.critRoll ?? 0,
    pdifRoll: input.pdifRoll ?? 0,
  });
  if (!strike.hit) {
    return { move: input.move, hit: false, crit: false, damage: 0, heal: 0, tpGain: 0, spent: strike.spendTp, whiff: "miss" };
  }
  return {
    move: input.move,
    hit: true,
    crit: strike.crit,
    damage: strike.raw,
    heal: 0,
    tpGain: strike.tpGain,
    spent: strike.spendTp || strike.tpGain > 0,
    whiff: "none",
  };
}

/**
 * Damage after the percent cuts and Phalanx.
 * Physical: Invincible is 0, then Perfect Defense, then Rampart, then Sentinel, then Phalanx.
 * Magical: Perfect Defense, then Rampart, then Shell, then Phalanx. Sentinel and Invincible do not cut it.
 * Perfect Defense is a percent on both kinds when a cut is passed.
 * The pact page does not print one, so the fight passes none. Decay is not numbered either.
 * Stoneskin is later, on the HP bar.
 */
export function rarabTaken(
  raw: number,
  kind: "physical" | "magical",
  mods: { rampart: boolean; sentinel: number; phalanx: number; shell: number; invincible: boolean; perfect?: number },
): number {
  if (kind === "physical" && mods.invincible) return 0;
  let dmg = Math.max(0, Math.floor(raw));
  const perfect = Math.max(0, Math.min(100, Math.floor(mods.perfect ?? 0)));
  if (perfect > 0) dmg = Math.floor((dmg * (100 - perfect)) / 100);
  if (mods.rampart) dmg = Math.floor((dmg * 75) / 100);
  if (kind === "physical" && mods.sentinel > 0) {
    const cut = Math.round(mods.sentinel * 100);
    dmg = Math.floor((dmg * (100 - cut)) / 100);
  }
  if (kind === "magical" && mods.shell > 0) dmg = shellTaken(dmg, mods.shell);
  return phalanxTaken(dmg, mods.phalanx);
}

export function assertRarab(): void {
  const r = TROPICAL_RARAB;
  if (r.name !== "Tropical Rarab" || r.level !== 75 || r.levelMin !== 73 || r.levelMax !== 76 || r.job !== "WAR/WAR" || r.aggressive) {
    throw new Error("rarab identity");
  }
  if (r.str !== 91 || r.dex !== 82 || r.vit !== 70 || r.agi !== 77 || r.int !== 58 || r.mnd !== 58 || r.chr !== 65) {
    throw new Error(`rarab stats ${r.str}/${r.dex}/${r.vit}/${r.agi}/${r.int}/${r.mnd}/${r.chr}`);
  }
  if (r.defRankBase !== 262 || r.evasion !== 300 || r.accuracy !== 337 || r.attack !== 375) {
    throw new Error(`rarab combat ${r.defRankBase}/${r.evasion}/${r.accuracy}/${r.attack}`);
  }
  if (r.weaponDamage !== 85 || r.delay !== 240 || r.weaponRank !== 9 || r.hpNatural !== 4611 || r.mp !== 0 || r.damageType !== "slashing" || r.combatSkill !== 225) {
    throw new Error("rarab weapon");
  }
  if (tpPerHit(r.delay) !== 75 || 13 * 75 >= 1000 || 14 * 75 < 1000) throw new Error("rarab tp");
  if (fStr(r.str - 70, r.weaponRank) !== 6) throw new Error("rarab fSTR");
  if (footKickFtp(49) !== 1 || footKickFtp(50) !== 2 || footKickFtp(75) !== 2) throw new Error("Foot Kick fTP");
  if (dustCloudRaw(75) !== 154 || wildCarrotHeal(4611) !== 468) throw new Error("rarab magic and heal");
  if (rarabShadows("attack") !== 1 || rarabShadows("Foot Kick") !== 1 || rarabShadows("Whirl Claws") !== 3 || rarabShadows("Dust Cloud") !== 0) {
    throw new Error("rarab shadows");
  }
  if (chooseRarabMove(999, 0.1, 0) !== "attack") throw new Error("tp move waits for 1000");
  if (chooseRarabMove(1000, 1, 0) !== "Foot Kick" || chooseRarabMove(1000, 1, 0.5) !== "Whirl Claws" || chooseRarabMove(1000, 1, 0.75) !== "Dust Cloud") {
    throw new Error("tp mix");
  }
  if (chooseRarabMove(1000, 0.49, 0.34) !== "Wild Carrot" || chooseRarabMove(1000, 0.49, 0.35) !== "Foot Kick") {
    throw new Error("Wild Carrot");
  }
  if (chooseRarabMove(1000, 0.49, 0.7) !== "Whirl Claws" || chooseRarabMove(1000, 0.49, 0.9) !== "Dust Cloud") {
    throw new Error("hurt mix");
  }
  const miss = rollRarabStrike({
    move: "attack", weaponDamage: 85, level: 75, attack: 375, defense: 200, accuracy: 0, evasion: 500,
    dLevel: 0, dex: 82, targetAgi: 40, str: 91, targetVit: 70, weaponRank: 9, maxHp: 4611,
    hitRoll: 99, critRoll: 0, pdifRoll: 0,
  });
  if (miss.hit || miss.tpGain !== 0 || miss.spendTp) throw new Error("auto miss");
  const kick = rollRarabStrike({
    move: "Foot Kick", weaponDamage: 85, level: 75, attack: 375, defense: 200, accuracy: 999, evasion: 0,
    dLevel: 0, dex: 82, targetAgi: 400, str: 91, targetVit: 70, weaponRank: 9, maxHp: 4611,
    hitRoll: 0, critRoll: 99, pdifRoll: 0,
  });
  if (!kick.hit || !kick.crit || kick.raw <= 0 || !kick.spendTp || kick.tpGain !== 0) throw new Error("Foot Kick crit");
  const cloud = rollRarabStrike({
    move: "Dust Cloud", weaponDamage: 85, level: 75, attack: 1, defense: 1, accuracy: 0, evasion: 999,
    dLevel: 0, dex: 1, targetAgi: 1, str: 1, targetVit: 1, weaponRank: 0, maxHp: 4611,
    hitRoll: 100, critRoll: 100, pdifRoll: 1,
  });
  if (!cloud.hit || cloud.raw !== 154 || cloud.blind !== 30 || cloud.physical || !cloud.magical) throw new Error("Dust Cloud");
  if (rarabTaken(100, "physical", { rampart: true, sentinel: 0, phalanx: 0, shell: 0, invincible: false }) !== 75) {
    throw new Error("Rampart");
  }
  if (rarabTaken(100, "physical", { rampart: false, sentinel: sentinelCut(0), phalanx: 0, shell: 0, invincible: false }) !== 10) {
    throw new Error("Sentinel");
  }
  if (rarabTaken(100, "physical", { rampart: false, sentinel: 0, phalanx: 20, shell: 0, invincible: false }) !== 80) {
    throw new Error("Phalanx");
  }
  if (rarabTaken(154, "magical", { rampart: false, sentinel: 0.9, phalanx: 0, shell: 27, invincible: true }) !== shellTaken(154, 27)) {
    throw new Error("Shell ignores Sentinel");
  }
  if (rarabTaken(80, "physical", { rampart: false, sentinel: 0, phalanx: 0, shell: 0, invincible: true }) !== 0) {
    throw new Error("Invincible");
  }
  if (rarabTaken(100, "physical", { rampart: false, sentinel: 0, phalanx: 0, shell: 0, invincible: false, perfect: 95 }) !== 5) {
    throw new Error("Perfect Defense");
  }
  if (rarabTaken(200, "magical", { rampart: false, sentinel: 0.9, phalanx: 0, shell: 0, invincible: true, perfect: 95 }) !== 10) {
    throw new Error("Perfect Defense magic");
  }
  const pulled = aggros({
    detect: FOREST_HARE_DETECT,
    playerLevel: 75,
    mobLevel: 75,
    distance: 1,
    sightAngle: 0,
    hpRatio: 0.1,
    invisible: false,
    sneak: false,
    deodorize: false,
    castingMagic: true,
    indoors: false,
    hadAggro: false,
  });
  if (FOREST_HARE_DETECT.aggressive || pulled.aggro) throw new Error("rarab stays passive");
  if (HARE_VS_HARE !== 3) throw new Error("hare vs hare reach");
  const kickOn = rarabOnRarab({ move: "Foot Kick", otherAlive: true, yards: 2.4, hitRoll: 0, critRoll: 99, pdifRoll: 0 });
  if (!kickOn.hit || !kickOn.crit || kickOn.damage <= 0 || kickOn.heal !== 0) throw new Error("rarab on rarab Foot Kick");
  const kickMiss = rarabOnRarab({ move: "Foot Kick", otherAlive: true, yards: 2.4, hitRoll: 100, critRoll: 0, pdifRoll: 0 });
  if (kickMiss.hit || kickMiss.damage !== 0 || kickMiss.whiff !== "miss") throw new Error("rarab on rarab miss");
  const cloudOn = rarabOnRarab({ move: "Dust Cloud", otherAlive: true, yards: 0, hitRoll: 100, critRoll: 100, pdifRoll: 1 });
  if (!cloudOn.hit || cloudOn.damage !== 154 || cloudOn.heal !== 0) throw new Error("rarab on rarab Dust Cloud");
  const carrotOn = rarabOnRarab({ move: "Wild Carrot", otherAlive: false, yards: 99 });
  if (carrotOn.hit || carrotOn.damage !== 0 || carrotOn.heal !== 468) throw new Error("rarab on rarab Wild Carrot");
  const tooFar = rarabOnRarab({ move: "Foot Kick", otherAlive: true, yards: 3.01, hitRoll: 0 });
  if (tooFar.hit || tooFar.whiff !== "range" || tooFar.damage !== 0) throw new Error("rarab on rarab range");
  const noFoe = rarabOnRarab({ move: "Dust Cloud", otherAlive: false, yards: 1 });
  if (noFoe.hit || noFoe.whiff !== "dead" || noFoe.damage !== 0) throw new Error("rarab on rarab dead");
}
