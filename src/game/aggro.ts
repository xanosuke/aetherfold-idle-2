/**
 * Retail aggro through the level-75 cap. Distances are yalms.
 * BG-Wiki Aggro. No merits, and this yard does not add linking.
 * Two Tropical Rarab share the yard. They are the same family and they do not link.
 * A claim on one does not turn the other.
 *
 * Sight is a cone about 15' and 60° off the mob's nose. Invisible
 * blocks it unless the mob has True Sight.
 * Sound is a circle of 8'. True Sound hears out to 30' and ignores Sneak.
 * Scent does not start a fight. It only keeps one that already started,
 * from any range, until Deodorize. Water and weather are not in the yard.
 * Low HP, only when the mob detects it: green (75% and up) none,
 * yellow (under 75% through half) 8', orange (half through 25%) 18',
 * red (25% and under) 20'.
 * Magic aggro is White, Black, Blue, or Summoning while the cast is
 * still going. 20' outdoors, 8' indoors. Songs and ninjutsu do not.
 * A mob that /check calls too weak does not answer, even if aggressive.
 * Engaging, and landing a hit, are not aggro. Callers must not set
 * hadAggro from either. The Tropical Rarab stays passive until it is claimed.
 */

import { checkCon } from "./commands";
import type { SpellSchool } from "./spells";

/** Sight cone, yalms from the mob. */
export const SIGHT_RANGE = 15;
/** Degrees off the nose. The player is seen at this angle and inside it. */
export const SIGHT_ANGLE = 60;
/** Ordinary hearing, yalms. */
export const SOUND_RANGE = 8;
/** True Sound hearing, yalms. Sneak does not stop it. */
export const TRUE_SOUND_RANGE = 30;
/** Open ground. West Ronfaure uses this. */
export const MAGIC_RANGE_OUTDOORS = 20;
/** Indoors. */
export const MAGIC_RANGE_INDOORS = 8;

export type AggroReason = "sight" | "sound" | "hp" | "magic" | "scent";

export type Detect = {
  /** Will attack on its own when a sense connects. Passive mobs never start. */
  aggressive: boolean;
  sight: boolean;
  sound: boolean;
  /** Tracks a fight that already started. Does not open one. */
  scent: boolean;
  lowHp: boolean;
  magic: boolean;
  trueSight: boolean;
  trueSound: boolean;
};

/**
 * Bibiki Bay Tropical Rarab. The family lists sight and scent.
 * Aggressive stays off, so those senses do not open a fight.
 */
export const FOREST_HARE_DETECT: Detect = {
  aggressive: false,
  sight: true,
  sound: false,
  scent: true,
  lowHp: false,
  magic: false,
  trueSight: false,
  trueSound: false,
};

export type AggroQuery = {
  detect: Detect;
  playerLevel: number;
  mobLevel: number;
  /** Yalms between the two. */
  distance: number;
  /** Degrees between the mob's forward and the player. 0 is dead ahead. */
  sightAngle: number;
  /** Current HP divided by max HP. 1 is full. */
  hpRatio: number;
  invisible: boolean;
  sneak: boolean;
  deodorize: boolean;
  /** True only while White, Black, Blue, or Summoning is still casting. */
  castingMagic: boolean;
  indoors: boolean;
  /**
   * Already pulled by a real aggro. Engage and player damage do not set this.
   * Scent keeps it. Other senses keep it only while they still connect.
   */
  hadAggro: boolean;
};

export type AggroVerdict = {
  aggro: boolean;
  reason: AggroReason | null;
};

/** Yalms at which low HP would pull. 0 means this color does not. */
export function lowHpRange(hpRatio: number): number {
  if (hpRatio >= 0.75) return 0;
  if (hpRatio > 0.5) return 8;
  if (hpRatio > 0.25) return 18;
  return 20;
}

/** Degrees from a forward vector to a point. A zero length is dead ahead. */
export function angleFromForward(forwardX: number, forwardZ: number, toX: number, toZ: number): number {
  const len = Math.hypot(toX, toZ);
  const flen = Math.hypot(forwardX, forwardZ);
  if (len < 1e-8 || flen < 1e-8) return 0;
  const dot = (forwardX * toX + forwardZ * toZ) / (flen * len);
  const clamped = Math.max(-1, Math.min(1, dot));
  return (Math.acos(clamped) * 180) / Math.PI;
}

const MAGIC_AGGRO: ReadonlySet<SpellSchool> = new Set([
  "healing",
  "divine",
  "enhancing",
  "enfeebling",
  "elemental",
  "dark",
  "summoning",
  "blue",
  "geomancy",
]);

/** White, black, blue, and summoning. Singing and ninjutsu stay out. */
export function pullsMagic(school: SpellSchool | undefined): boolean {
  return school != null && MAGIC_AGGRO.has(school);
}

function sees(query: AggroQuery): boolean {
  if (!query.detect.sight) return false;
  if (query.invisible && !query.detect.trueSight) return false;
  if (query.distance > SIGHT_RANGE) return false;
  if (query.sightAngle > SIGHT_ANGLE) return false;
  return true;
}

function hears(query: AggroQuery): boolean {
  if (!query.detect.sound && !query.detect.trueSound) return false;
  if (query.sneak && !query.detect.trueSound) return false;
  const range = query.detect.trueSound ? TRUE_SOUND_RANGE : SOUND_RANGE;
  return query.distance <= range;
}

function bleeds(query: AggroQuery): boolean {
  if (!query.detect.lowHp) return false;
  const range = lowHpRange(query.hpRatio);
  return range > 0 && query.distance <= range;
}

function casting(query: AggroQuery): boolean {
  if (!query.detect.magic || !query.castingMagic) return false;
  const range = query.indoors ? MAGIC_RANGE_INDOORS : MAGIC_RANGE_OUTDOORS;
  return query.distance <= range;
}

/**
 * Whether this mob attacks. Too weak never does.
 * A passive mob does not start, scent included.
 * A fight already started is kept by scent, or by a sense that still connects.
 */
export function aggros(query: AggroQuery): AggroVerdict {
  if (checkCon(query.playerLevel, query.mobLevel) === "too-weak") return { aggro: false, reason: null };

  const sight = sees(query);
  const sound = hears(query);
  const hp = bleeds(query);
  const magic = casting(query);

  if (query.hadAggro) {
    if (query.detect.scent && !query.deodorize) return { aggro: true, reason: "scent" };
    if (sight) return { aggro: true, reason: "sight" };
    if (sound) return { aggro: true, reason: "sound" };
    if (hp) return { aggro: true, reason: "hp" };
    if (magic) return { aggro: true, reason: "magic" };
    return { aggro: false, reason: null };
  }

  if (!query.detect.aggressive) return { aggro: false, reason: null };
  if (sight) return { aggro: true, reason: "sight" };
  if (sound) return { aggro: true, reason: "sound" };
  if (hp) return { aggro: true, reason: "hp" };
  if (magic) return { aggro: true, reason: "magic" };
  return { aggro: false, reason: null };
}

function blank(detect: Detect, over: Partial<AggroQuery> = {}): AggroQuery {
  return {
    detect,
    playerLevel: 75,
    mobLevel: 75,
    distance: 10,
    sightAngle: 0,
    hpRatio: 1,
    invisible: false,
    sneak: false,
    deodorize: false,
    castingMagic: false,
    indoors: false,
    hadAggro: false,
    ...over,
  };
}

const SIGHT: Detect = {
  aggressive: true,
  sight: true,
  sound: false,
  scent: false,
  lowHp: false,
  magic: false,
  trueSight: false,
  trueSound: false,
};

export function assertAggro(): void {
  const hare = FOREST_HARE_DETECT;
  if (hare.aggressive || !hare.sight || hare.sound || !hare.scent || hare.lowHp || hare.magic || hare.trueSight || hare.trueSound) {
    throw new Error("forest hare detect");
  }
  if (aggros(blank(hare, { mobLevel: 1, distance: 2, sightAngle: 0 })).aggro) throw new Error("hare in the cone");
  if (aggros(blank(hare, { playerLevel: 10, mobLevel: 10, distance: 2 })).aggro) throw new Error("passive hare");
  if (aggros(blank({ ...hare, aggressive: true }, { mobLevel: 1, distance: 2 })).aggro) throw new Error("too-weak hare");

  const ahead = blank(SIGHT, { distance: 10, sightAngle: 0 });
  if (!aggros(ahead).aggro || aggros(ahead).reason !== "sight") throw new Error("sight aggro");
  if (aggros(blank(SIGHT, { distance: 10, sightAngle: 0, invisible: true })).aggro) throw new Error("invisible");
  if (!aggros(blank({ ...SIGHT, trueSight: true }, { distance: 10, invisible: true })).aggro) throw new Error("true sight");
  if (aggros(blank(SIGHT, { distance: 10, sightAngle: 180 })).aggro) throw new Error("behind");
  if (aggros(blank(SIGHT, { distance: 16, sightAngle: 0 })).aggro) throw new Error("past sight");
  if (!aggros(blank(SIGHT, { distance: 15, sightAngle: 60 })).aggro) throw new Error("sight edge");
  if (aggros(blank(SIGHT, { distance: 15, sightAngle: 60.01 })).aggro) throw new Error("past the cone");
  if (aggros(blank(SIGHT, { distance: 15.01, sightAngle: 0 })).aggro) throw new Error("past 15");
  if (aggros(blank(SIGHT, { playerLevel: 75, mobLevel: 55, distance: 2 })).aggro) throw new Error("too weak");
  if (!aggros(blank(SIGHT, { playerLevel: 75, mobLevel: 56, distance: 2 })).aggro) throw new Error("easy prey still sees");
  if (!aggros(blank(SIGHT, { distance: 10, sneak: true })).aggro) throw new Error("sneak is not invis");

  const sound: Detect = { ...SIGHT, sight: false, sound: true };
  if (aggros(blank(sound, { distance: 7, sneak: true })).aggro) throw new Error("sneak");
  if (!aggros(blank(sound, { distance: 7 })).aggro || aggros(blank(sound, { distance: 7 })).reason !== "sound") throw new Error("sound");
  if (aggros(blank(sound, { distance: 8.01 })).aggro) throw new Error("past sound");
  if (!aggros(blank(sound, { distance: 8 })).aggro) throw new Error("sound edge");
  const loud: Detect = { ...sound, trueSound: true };
  if (!aggros(blank(loud, { distance: 7, sneak: true })).aggro) throw new Error("true sound");
  if (!aggros(blank(loud, { distance: 30, sneak: true })).aggro) throw new Error("true sound edge");
  if (aggros(blank(loud, { distance: 30.01, sneak: true })).aggro) throw new Error("past true sound");

  const weak: Detect = { ...SIGHT, sight: false, lowHp: true };
  if (lowHpRange(1) !== 0 || lowHpRange(0.75) !== 0 || lowHpRange(0.6) !== 8 || lowHpRange(0.5) !== 18 || lowHpRange(0.25) !== 20) {
    throw new Error("hp bands");
  }
  if (aggros(blank(weak, { distance: 1, hpRatio: 1 })).aggro) throw new Error("green");
  if (!aggros(blank(weak, { distance: 8, hpRatio: 0.6 })).aggro || aggros(blank(weak, { distance: 8, hpRatio: 0.6 })).reason !== "hp") {
    throw new Error("yellow");
  }
  if (aggros(blank(weak, { distance: 8.01, hpRatio: 0.6 })).aggro) throw new Error("past yellow");
  if (!aggros(blank(weak, { distance: 18, hpRatio: 0.4 })).aggro) throw new Error("orange");
  if (aggros(blank(weak, { distance: 18.01, hpRatio: 0.4 })).aggro) throw new Error("past orange");
  if (!aggros(blank(weak, { distance: 20, hpRatio: 0.1 })).aggro) throw new Error("red");
  if (aggros(blank(weak, { distance: 20.01, hpRatio: 0.1 })).aggro) throw new Error("past red");

  const mage: Detect = { ...SIGHT, sight: false, magic: true };
  if (aggros(blank(mage, { distance: 10, castingMagic: false })).aggro) throw new Error("not casting");
  if (!aggros(blank(mage, { distance: 20, castingMagic: true })).aggro || aggros(blank(mage, { distance: 20, castingMagic: true })).reason !== "magic") {
    throw new Error("magic");
  }
  if (aggros(blank(mage, { distance: 20.01, castingMagic: true })).aggro) throw new Error("past magic");
  if (aggros(blank(mage, { distance: 9, castingMagic: true, indoors: true })).aggro) throw new Error("indoors");
  if (!aggros(blank(mage, { distance: 8, castingMagic: true, indoors: true })).aggro) throw new Error("indoors edge");
  if (pullsMagic("healing") !== true || pullsMagic("elemental") !== true || pullsMagic("blue") !== true || pullsMagic("summoning") !== true) {
    throw new Error("magic schools");
  }
  if (pullsMagic("singing") || pullsMagic("ninjutsu") || pullsMagic(undefined)) throw new Error("songs and ninjutsu");

  const nose: Detect = { ...SIGHT, aggressive: true, sight: false, scent: true };
  if (aggros(blank(nose, { distance: 1 })).aggro) throw new Error("scent starts");
  if (aggros(blank({ ...FOREST_HARE_DETECT, aggressive: false }, { distance: 1, hadAggro: false })).aggro) throw new Error("hare scent");
  const kept = aggros(blank(nose, { distance: 500, invisible: true, hadAggro: true }));
  if (!kept.aggro || kept.reason !== "scent") throw new Error("scent keeps");
  if (aggros(blank(nose, { distance: 1, invisible: true, deodorize: true, hadAggro: true })).aggro) throw new Error("deodorize");
  const sightOnly: Detect = { ...SIGHT, scent: false };
  if (aggros(blank(sightOnly, { invisible: true, hadAggro: true })).aggro) throw new Error("sight drops");
  const still = aggros(blank({ ...nose, sight: true }, { distance: 10, sightAngle: 0, invisible: false, deodorize: true, hadAggro: true }));
  if (!still.aggro || still.reason !== "sight") throw new Error("sight holds after deodorize");

  if (Math.abs(angleFromForward(0, 1, 0, 1)) > 1e-6) throw new Error("ahead");
  if (Math.abs(angleFromForward(0, 1, 0, -1) - 180) > 1e-6) throw new Error("back");
  if (Math.abs(angleFromForward(0, 1, 1, 0) - 90) > 1e-6) throw new Error("flank");
  if (angleFromForward(0, 1, 0, 0) !== 0) throw new Error("zero");
}
