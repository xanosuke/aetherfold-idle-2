import * as THREE from "three";

/** Authored clip rate. Idle is 2s (48 frames), Walk is 1s (24 frames). */
export const CLIP_FPS = 24;

const LEG_UPPER = 0.34;
const LEG_LOWER = 0.32;
const LEG = LEG_UPPER + LEG_LOWER;
/** How far the planted foot sits ahead of the hip, in local Z. Short steps. */
const STEP_A = 0.32;
/**
 * Distance the root should travel over one Walk cycle so a planted foot
 * stays put. Two steps, each covering 2 * STEP_A.
 */
export const HUMANOID_STRIDE = STEP_A * 4;

const HIP_REST = 0.78;

export type SwingStyle = "chop" | "cut";

/** One animation family per retail weapon skill. */
export type WeaponFamily =
  | "h2h"
  | "dagger"
  | "sword"
  | "greatsword"
  | "axe"
  | "greataxe"
  | "scythe"
  | "polearm"
  | "katana"
  | "greatkatana"
  | "club"
  | "staff";

export type DrawStep = "reach" | "pull" | "lower" | "relax";

/** Sheathed weapons leave the hands empty. Hand-to-hand hangs on the hips too. */
export function carriedOutOfCombat(_family: WeaponFamily): boolean {
  return false;
}

export function familyOf(kind: string | null | undefined): WeaponFamily {
  switch (kind) {
    case "Hand-to-Hand":
      return "h2h";
    case "Dagger":
      return "dagger";
    case "Great Sword":
      return "greatsword";
    case "Axe":
      return "axe";
    case "Great Axe":
      return "greataxe";
    case "Scythe":
      return "scythe";
    case "Polearm":
      return "polearm";
    case "Katana":
      return "katana";
    case "Great Katana":
      return "greatkatana";
    case "Club":
      return "club";
    case "Staff":
      return "staff";
    default:
      return "sword";
  }
}

type Euler = { x: number; y: number; z: number };

type HumanPose = {
  hipsP: { x: number; y: number; z: number };
  hips: Euler;
  spine: Euler;
  head: Euler;
  upperArmR: Euler;
  lowerArmR: Euler;
  upperArmL: Euler;
  lowerArmL: Euler;
  upperLegR: Euler;
  lowerLegR: Euler;
  footR: Euler;
  upperLegL: Euler;
  lowerLegL: Euler;
  footL: Euler;
  weapon: Euler;
};

const E = (x = 0, y = 0, z = 0): Euler => ({ x, y, z });

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function smooth(t: number) {
  const x = clamp(t, 0, 1);
  return x * x * (3 - 2 * x);
}

function stanceHip(z: number) {
  return -Math.asin(clamp(z / LEG, -1, 1));
}

/** Straight-leg compass step: sole stays down while local Z moves linearly. */
function stanceFoot(z: number) {
  const hip = stanceHip(z);
  return { hip, knee: 0, foot: -hip, hipsY: 0.12 + LEG * Math.cos(hip) };
}

function legAt(t: number, offset: number) {
  const p = (((t + offset) % 1) + 1) % 1;
  if (p < 0.5) {
    const u = p / 0.5;
    const planted = stanceFoot(lerp(STEP_A, -STEP_A, u));
    return { ...planted, swing: false };
  }
  const u = (p - 0.5) / 0.5;
  const s = smooth(u);
  const hip = lerp(stanceHip(-STEP_A), stanceHip(STEP_A), s);
  const knee = Math.sin(u * Math.PI) * 1.15;
  const foot = -(hip + knee) + Math.sin(u * Math.PI) * 0.35;
  return { hip, knee, foot, hipsY: 0, swing: true };
}

type Hold = {
  upperArmR: Euler;
  lowerArmR: Euler;
  upperArmL: Euler;
  lowerArmL: Euler;
  weapon: Euler;
  spine: Euler;
  /** off: shield arm swings. both: empty-handed walk. none: both hands stay on the weapon. */
  swing: "off" | "both" | "none";
};

const HOLD = (swing: Hold["swing"], ux: number, uz: number, lx: number, lux: number, luz: number, llx: number, wx: number, wz: number, sy = 0, uy = 0, luy = 0): Hold => ({
  upperArmR: E(ux, uy, uz),
  lowerArmR: E(lx, 0, 0),
  upperArmL: E(lux, luy, luz),
  lowerArmL: E(llx, 0, 0),
  weapon: E(wx, 0, wz),
  spine: E(0.05, sy, 0),
  swing,
});

/** Combat-ready grip. Sword numbers are the tuned in-hand hold. */
function readyHold(family: WeaponFamily): Hold {
  switch (family) {
    case "h2h":
      return HOLD("none", -0.72, -0.48, -1.5, -0.68, 0.52, -1.45, 0, 0, 0, 0.05, -0.05);
    case "dagger":
      return HOLD("off", 0.28, -0.72, -0.95, 0.14, 0.38, -0.48, -0.85, -0.45);
    case "greatsword":
      // Hume combat: both hands on the hilt, in front of the chest, blade up.
      return HOLD("none", 0.48, -0.18, -1.28, 0.42, 0.08, -1.12, -1.08, -0.12);
    case "axe":
    case "club":
      // Same forward guard as the sword. The off hand stays free.
      return HOLD("off", 0.15, -0.15, -0.55, 0.12, 0.36, -0.42, -1.2, 0, 0, 0, -0.06);
    case "greataxe":
      return HOLD("none", 0.32, -0.42, -1.12, 0.36, 0.06, -1.02, -0.72, -0.38);
    case "scythe":
      return HOLD("none", 0.28, -0.5, -1.02, 0.32, 0.04, -0.95, -0.82, -0.42);
    case "polearm":
      return HOLD("none", 0.55, -0.32, -0.88, 0.48, 0.02, -0.78, -0.62, -0.28);
    case "katana":
      return HOLD("off", 0.04, -0.58, -1.02, 0.1, 0.36, -0.4, -1.02, -0.32);
    case "greatkatana":
      return HOLD("none", 0.38, -0.16, -1.18, 0.36, 0.06, -1.08, -1.12, -0.1);
    case "staff":
      return HOLD("none", 0.42, -0.28, -1.08, 0.4, 0.02, -0.98, -1.12, -0.06);
    default:
      return HOLD("off", 0.15, -0.15, -0.55, 0.12, 0.36, -0.42, -1.2, 0, 0, 0, -0.06);
  }
}

/** Out of combat. Sheathed weapons leave the arms hanging. Carried weapons rest low. */
function restHold(family: WeaponFamily): Hold {
  if (!carriedOutOfCombat(family)) {
    return HOLD("both", 0.2, -0.2, -0.24, 0.2, 0.24, -0.24, 0, 0, 0);
  }
  switch (family) {
    case "h2h":
      return HOLD("both", 0.22, -0.28, -0.42, 0.22, 0.28, -0.42, 0.1, 0);
    case "polearm":
      return HOLD("none", 0.08, -0.62, -0.7, 0.28, 0.55, -0.85, -0.2, -0.4);
    default:
      return HOLD("none", 0.12, -0.72, -0.82, 0.32, -0.15, -0.78, -0.55, -0.72);
  }
}

const GRAB_HIP_L = HOLD("none", 0.65, 0.28, -1.25, 0.14, 0.2, -0.24, -1.15, -0.7, 0.08);
const GRAB_HIP_R = HOLD("none", 0.42, -0.68, -0.88, 0.16, 0.2, -0.24, 0.12, -0.4, -0.14);
const GRAB_BACK = HOLD("none", -1.12, -0.12, -1.42, -0.82, 0.48, -1.32, -0.75, 0.35, 0.08);

function grabHold(family: WeaponFamily): Hold {
  if (family === "h2h") return HOLD("none", 0.72, -0.82, -0.78, 0.72, 0.82, -0.78, 0, 0);
  if (family === "dagger" || family === "axe" || family === "club") return GRAB_HIP_R;
  if (family === "sword" || family === "katana" || family === "greatkatana") return GRAB_HIP_L;
  return GRAB_BACK;
}

function lerpEuler(a: Euler, b: Euler, t: number): Euler {
  return { x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t), z: lerp(a.z, b.z, t) };
}

function lerpHold(a: Hold, b: Hold, t: number): Hold {
  return {
    upperArmR: lerpEuler(a.upperArmR, b.upperArmR, t),
    lowerArmR: lerpEuler(a.lowerArmR, b.lowerArmR, t),
    upperArmL: lerpEuler(a.upperArmL, b.upperArmL, t),
    lowerArmL: lerpEuler(a.lowerArmL, b.lowerArmL, t),
    weapon: lerpEuler(a.weapon, b.weapon, t),
    spine: lerpEuler(a.spine, b.spine, t),
    swing: b.swing,
  };
}

function holdFor(family: WeaponFamily, mode: "rest" | "ready"): Hold {
  const h = mode === "ready" ? readyHold(family) : restHold(family);
  if ((family === "sword" || family === "axe" || family === "club") && mode === "ready") {
    return {
      ...h,
      upperArmL: E(0.12, -0.06, 0.36),
      lowerArmL: E(-0.42, 0.15, 0),
    };
  }
  return h;
}

/** Live grip. Locomotion clips carry the same pose; the engine reapplies this after a draw. */
export function gripEuler(family: WeaponFamily, mode: "rest" | "ready"): Hold {
  return holdFor(family, mode);
}

function carry(): Hold {
  return holdFor("sword", "ready");
}

function humanIdle(t: number, hold?: Hold): HumanPose {
  const s = Math.sin(Math.PI * 2 * t);
  const bob = Math.sin(Math.PI * 4 * t);
  const base = hold ?? carry();
  return {
    hipsP: { x: s * 0.04, y: HIP_REST + bob * 0.012, z: 0 },
    hips: E(0, 0, s * 0.03),
    spine: E(base.spine.x, base.spine.y, -s * 0.06),
    head: E(bob * 0.05, -base.spine.y * 0.35, s * 0.04),
    upperArmR: base.upperArmR,
    lowerArmR: base.lowerArmR,
    upperArmL: base.upperArmL,
    lowerArmL: base.lowerArmL,
    upperLegR: E(0.02, 0, 0.03),
    lowerLegR: E(0.06, 0, 0),
    footR: E(-0.08, 0, -0.03),
    upperLegL: E(0.02, 0, -0.03),
    lowerLegL: E(0.06, 0, 0),
    footL: E(-0.08, 0, 0.03),
    weapon: E(base.weapon.x + bob * 0.02, base.weapon.y, base.weapon.z),
  };
}

function humanWalk(t: number, hold?: Hold): HumanPose {
  const right = legAt(t, 0);
  const left = legAt(t, 0.5);
  const stance = right.swing ? left : right;
  const tip = Math.sin(Math.PI * 2 * t);
  const base = hold ?? carry();
  const swingR = base.swing === "both" ? -left.hip * 0.75 : 0;
  const swingL = base.swing === "none" ? 0 : -right.hip * 0.85;
  return {
    hipsP: { x: tip * 0.03, y: stance.hipsY, z: 0 },
    hips: E(0, 0, tip * 0.035),
    spine: E(base.spine.x, base.spine.y + tip * 0.1, -tip * 0.07),
    head: E(-0.04, -tip * 0.06 - base.spine.y * 0.3, tip * 0.03),
    upperArmR: E(base.upperArmR.x + swingR, base.upperArmR.y, base.upperArmR.z),
    lowerArmR: E(base.lowerArmR.x - Math.max(0, -swingR) * 0.25, base.lowerArmR.y, base.lowerArmR.z),
    upperArmL: E(base.upperArmL.x + swingL, base.upperArmL.y, base.upperArmL.z),
    lowerArmL: E(base.lowerArmL.x - Math.max(0, -swingL) * 0.2, base.lowerArmL.y, base.lowerArmL.z),
    upperLegR: E(right.hip, 0, 0.02),
    lowerLegR: E(right.knee, 0, 0),
    footR: E(right.foot, 0, 0),
    upperLegL: E(left.hip, 0, -0.02),
    lowerLegL: E(left.knee, 0, 0),
    footL: E(left.foot, 0, 0),
    weapon: E(base.weapon.x, base.weapon.y, base.weapon.z),
  };
}

type SwingKey = {
  ux: number;
  uy: number;
  uz: number;
  lx: number;
  lz: number;
  sy: number;
  wx: number;
  wz: number;
};

/**
 * One-handed sword autos, the way FFXI plays them.
 * The fist stays on the hilt (the weapon euler is the wrist). Every swing
 * starts and ends on the same forward hold.
 * Chop: the sword rises beside the head, then cuts down through the target
 * and follows through to the other side.
 * Cut: the sword draws out to the side, then slashes across the front.
 */
const CARRY_KEY: SwingKey = { ux: 0.15, uy: 0, uz: -0.15, lx: -0.55, lz: 0, sy: 0, wx: -1.2, wz: 0 };
const CHOP_CHAMBER: SwingKey = { ux: -0.4, uy: 0, uz: -1.2, lx: -1.3, lz: 0, sy: -0.22, wx: -0.8, wz: -0.4 };
const CHOP_HIGH: SwingKey = { ux: -1.3, uy: 0, uz: -0.45, lx: -0.7, lz: 0, sy: -0.05, wx: -0.2, wz: -0.15 };
const CHOP_STRIKE: SwingKey = { ux: -1.25, uy: 0, uz: 0.05, lx: -0.3, lz: 0, sy: 0.2, wx: -0.15, wz: 0.05 };
const CHOP_FOLLOW: SwingKey = { ux: -0.2, uy: 0, uz: 0.35, lx: -0.55, lz: 0, sy: 0.22, wx: 0.45, wz: 1 };
const CUT_CHAMBER: SwingKey = { ux: 0.9, uy: 0, uz: -0.7, lx: -1.1, lz: 0, sy: -0.22, wx: 0.2, wz: -1 };
const CUT_HIGH: SwingKey = { ux: 0.35, uy: 0, uz: -0.85, lx: -0.75, lz: 0, sy: -0.08, wx: -0.35, wz: -0.65 };
const CUT_STRIKE: SwingKey = { ux: -0.7, uy: 0, uz: 0.1, lx: -0.35, lz: 0, sy: 0.16, wx: -0.7, wz: 0.15 };
const CUT_FOLLOW: SwingKey = { ux: -0.15, uy: 0, uz: 0.55, lx: -0.4, lz: 0, sy: 0.2, wx: 0.15, wz: 0.85 };
const RECOVER_KEY: SwingKey = { ux: 0.12, uy: 0, uz: 0, lx: -0.5, lz: 0, sy: 0.04, wx: -0.9, wz: 0.12 };

const SWING_TIMES = [0, 0.18, 0.32, 0.44, 0.58, 0.78, 1];

function mixKey(a: SwingKey, b: SwingKey, t: number): SwingKey {
  const o = { ...a };
  (Object.keys(a) as (keyof SwingKey)[]).forEach((k) => {
    o[k] = a[k] + (b[k] - a[k]) * t;
  });
  return o;
}

function swingKey(u: number, style: SwingStyle): SwingKey {
  const keys =
    style === "chop"
      ? [CARRY_KEY, CHOP_CHAMBER, CHOP_HIGH, CHOP_STRIKE, CHOP_FOLLOW, RECOVER_KEY, CARRY_KEY]
      : [CARRY_KEY, CUT_CHAMBER, CUT_HIGH, CUT_STRIKE, CUT_FOLLOW, RECOVER_KEY, CARRY_KEY];
  const x = clamp(u, 0, 1);
  let seg = 0;
  while (seg < SWING_TIMES.length - 2 && x >= SWING_TIMES[seg + 1]) seg++;
  const span = SWING_TIMES[seg + 1] - SWING_TIMES[seg];
  const raw = span <= 0 ? 0 : (x - SWING_TIMES[seg]) / span;
  // Wind-up and recover ease. The cut through the target stays fast.
  const fast = seg === 2 || seg === 3;
  const t = fast ? raw : smooth(raw);
  return mixKey(keys[seg], keys[seg + 1], t);
}

export type HandPose = {
  upper: { x: number; y: number; z: number };
  lower: { x: number; y: number; z: number };
  weapon: { x: number; y: number; z: number };
  spineY: number;
};

/**
 * The one-handed auto a sword, axe, or club already plays alone.
 * Chop, then cut, on the same keys as makeSwordAttack. Not a thrust.
 */
export function oneHandAuto(family: WeaponFamily, u: number, variant: number): HandPose | null {
  if (family !== "sword" && family !== "axe" && family !== "club") return null;
  const k = swingKey(u, variant % 2 === 0 ? "chop" : "cut");
  return {
    upper: { x: k.ux, y: k.uy, z: k.uz },
    lower: { x: k.lx, y: 0, z: k.lz },
    weapon: { x: k.wx, y: 0, z: k.wz },
    spineY: k.sy,
  };
}

/** One sword swing, 0..1. The hit frame is the extended pose at u = 0.44. */
function slashPose(u: number, style: SwingStyle): HumanPose {
  const idle = humanIdle(0);
  const k = swingKey(u, style);
  return {
    ...idle,
    spine: E(0.05, k.sy, 0),
    head: E(-k.sy * 0.1, -k.sy * 0.35, 0),
    upperArmR: E(k.ux, k.uy, k.uz),
    lowerArmR: E(k.lx, 0, k.lz),
    upperArmL: E(idle.upperArmL.x - k.sy * 0.25, idle.upperArmL.y, idle.upperArmL.z + k.sy * 0.15),
    weapon: E(k.wx, 0, k.wz),
  };
}

function attackPose(t: number, style: SwingStyle, hits: number): HumanPose {
  if (hits <= 1) return slashPose(t, style);
  // Two shorter strikes inside the same clip. Each one still winds up and recovers.
  if (t < 0.46) return slashPose(t / 0.46, style);
  return slashPose((t - 0.46) / 0.54, style);
}

/** Frames of swing motion. About 0.58s at delay 231. Faster weapons finish sooner. A double is a shorter flurry. */
export function attackFrameCount(delay: number, hits: number): number {
  const single = Math.max(8, Math.min(20, Math.round(14 * (delay / 231))));
  if (hits <= 1) return single;
  return Math.max(8, Math.min(16, Math.round(single * 0.72)));
}

export function attackSeconds(delay: number, hits: number): number {
  return attackFrameCount(delay, hits) / CLIP_FPS;
}

export function styleForWeapon(id: string | null): SwingStyle {
  return id === "onion-sword" ? "cut" : "chop";
}

type PoseKey = {
  ux: number;
  uy: number;
  uz: number;
  lx: number;
  lz: number;
  lux: number;
  luy: number;
  luz: number;
  llx: number;
  sy: number;
  wx: number;
  wz: number;
};

function keyOf(h: Hold): PoseKey {
  return {
    ux: h.upperArmR.x,
    uy: h.upperArmR.y,
    uz: h.upperArmR.z,
    lx: h.lowerArmR.x,
    lz: h.lowerArmR.z,
    lux: h.upperArmL.x,
    luy: h.upperArmL.y,
    luz: h.upperArmL.z,
    llx: h.lowerArmL.x,
    sy: h.spine.y,
    wx: h.weapon.x,
    wz: h.weapon.z,
  };
}

function mixPose(a: PoseKey, b: PoseKey, t: number): PoseKey {
  const o = { ...a };
  (Object.keys(a) as (keyof PoseKey)[]).forEach((k) => {
    o[k] = a[k] + (b[k] - a[k]) * t;
  });
  return o;
}

function addPose(base: PoseKey, d: Partial<PoseKey>): PoseKey {
  const o = { ...base };
  (Object.keys(d) as (keyof PoseKey)[]).forEach((k) => {
    const n = d[k];
    if (n != null) o[k] = base[k] + n;
  });
  return o;
}

type Arc = { chamber: Partial<PoseKey>; strike: Partial<PoseKey>; follow: Partial<PoseKey> };

/**
 * Deltas off the combat hold. Two clips alternate, the way FFXI cycles autos.
 * Dagger and polearm thrust. Scythe reaps. Great weapons wind up over the shoulder.
 * Hand-to-hand is a jab, then a cross.
 */
const ARCS: Record<WeaponFamily, [Arc, Arc]> = {
  h2h: [
    { chamber: { ux: 0.28, lx: -0.28 }, strike: { ux: 0.9, lx: 0.95, uz: 0.18 }, follow: { ux: 0.32, lx: 0.4 } },
    { chamber: { lux: 0.22, llx: -0.22 }, strike: { lux: 0.85, llx: 0.9, luz: -0.12 }, follow: { lux: 0.28, llx: 0.35 } },
  ],
  dagger: [
    { chamber: { ux: -0.28, lx: -0.28, wx: 0.18 }, strike: { ux: 0.58, lx: 0.58, wx: -0.38 }, follow: { ux: 0.18, lx: 0.16, wx: -0.08 } },
    { chamber: { uz: -0.48, wz: -0.65, sy: -0.16 }, strike: { uz: 0.72, wz: 0.75, sy: 0.2 }, follow: { uz: 0.3, wz: 0.35, sy: 0.08 } },
  ],
  sword: [
    { chamber: {}, strike: {}, follow: {} },
    { chamber: {}, strike: {}, follow: {} },
  ],
  greatsword: [
    {
      chamber: { ux: -0.95, lx: -0.22, lux: -0.75, llx: -0.16, wx: -0.58, sy: -0.2 },
      strike: { ux: 0.9, lx: 0.75, lux: 0.65, llx: 0.58, wx: 0.4, sy: 0.26 },
      follow: { ux: 0.38, uz: 0.48, lux: 0.22, wx: 0.65, wz: 0.45, sy: 0.12 },
    },
    {
      chamber: { uz: -0.58, luz: 0.28, wz: -0.72, sy: -0.24 },
      strike: { uz: 0.55, luz: -0.22, wz: 0.58, sy: 0.2 },
      follow: { uz: 0.28, wx: 0.28, wz: 0.38, sy: 0.1 },
    },
  ],
  axe: [
    { chamber: { ux: -0.88, lx: -0.28, wx: -0.48, sy: -0.14 }, strike: { ux: 0.72, lx: 0.58, wx: 0.42, sy: 0.2 }, follow: { ux: 0.22, uz: 0.38, wx: 0.32, wz: 0.42 } },
    { chamber: { uz: -0.42, wz: -0.58, sy: -0.18 }, strike: { uz: 0.58, wz: 0.62, sy: 0.18 }, follow: { uz: 0.24, wz: 0.32, wx: 0.18 } },
  ],
  greataxe: [
    {
      chamber: { ux: -0.62, lx: -0.16, lux: -0.48, llx: -0.12, wx: -0.38, sy: -0.16 },
      strike: { ux: 1.05, lx: 0.88, lux: 0.78, llx: 0.72, wx: 0.48, sy: 0.3 },
      follow: { ux: 0.42, uz: 0.42, wx: 0.52, wz: 0.38, sy: 0.1 },
    },
    {
      chamber: { ux: -0.72, uz: -0.48, lux: -0.48, wz: -0.62, sy: -0.22 },
      strike: { ux: 0.58, uz: 0.52, lux: 0.42, wz: 0.58, sy: 0.22 },
      follow: { ux: 0.18, uz: 0.28, wx: 0.28, wz: 0.32 },
    },
  ],
  scythe: [
    {
      chamber: { uz: -0.75, lx: -0.22, luz: 0.38, wz: -0.9, sy: -0.3 },
      strike: { uz: 0.9, luz: -0.48, wz: 0.95, sy: 0.28 },
      follow: { uz: 0.38, wx: 0.22, wz: 0.42, sy: 0.1 },
    },
    {
      chamber: { ux: -0.82, lux: -0.58, wx: -0.42, sy: -0.14 },
      strike: { ux: 0.72, lux: 0.52, wx: 0.48, sy: 0.22 },
      follow: { ux: 0.28, uz: 0.38, wz: 0.38 },
    },
  ],
  polearm: [
    { chamber: { ux: -0.22, lux: -0.16, lx: -0.22, wx: 0.16 }, strike: { ux: 0.48, lux: 0.38, lx: 0.42, llx: 0.32, wx: -0.28 }, follow: { ux: 0.14, lux: 0.1, wx: -0.08 } },
    { chamber: { ux: 0.12, wx: 0.28, sy: 0.08 }, strike: { ux: 0.52, lux: 0.42, wx: -0.16, sy: -0.04 }, follow: { ux: 0.18, wx: 0.06 } },
  ],
  katana: [
    {
      chamber: { ux: -0.78, uz: -0.38, lx: -0.28, wx: -0.42, wz: -0.38, sy: -0.18 },
      strike: { ux: 0.58, uz: 0.58, lx: 0.48, wx: 0.28, wz: 0.58, sy: 0.22 },
      follow: { ux: 0.14, uz: 0.28, wx: 0.28, wz: 0.38, sy: 0.08 },
    },
    { chamber: { uz: -0.58, wz: -0.72, sy: -0.22 }, strike: { uz: 0.68, wz: 0.78, sy: 0.18 }, follow: { uz: 0.28, wz: 0.38, wx: 0.14 } },
  ],
  greatkatana: [
    {
      chamber: { ux: -0.98, uz: -0.28, lux: -0.72, wx: -0.52, wz: -0.32, sy: -0.2 },
      strike: { ux: 0.72, uz: 0.48, lux: 0.58, wx: 0.32, wz: 0.52, sy: 0.24 },
      follow: { ux: 0.22, uz: 0.28, lux: 0.18, wx: 0.32, wz: 0.32, sy: 0.08 },
    },
    {
      chamber: { uz: -0.52, luz: 0.32, wz: -0.68, sy: -0.22 },
      strike: { uz: 0.58, luz: -0.26, wz: 0.62, sy: 0.2 },
      follow: { uz: 0.24, wx: 0.18, wz: 0.34 },
    },
  ],
  club: [
    { chamber: { ux: -0.82, lx: -0.32, wx: -0.48, sy: -0.12 }, strike: { ux: 0.78, lx: 0.62, wx: 0.52, sy: 0.18 }, follow: { ux: 0.18, wx: 0.18, wz: 0.22 } },
    { chamber: { uz: -0.42, wz: -0.52, sy: -0.14 }, strike: { uz: 0.52, wz: 0.58, sy: 0.16 }, follow: { uz: 0.18, wx: 0.14, wz: 0.28 } },
  ],
  staff: [
    { chamber: { uz: -0.48, luz: 0.32, wz: -0.58, sy: -0.2 }, strike: { uz: 0.58, luz: -0.32, wz: 0.62, sy: 0.2 }, follow: { uz: 0.22, wx: 0.18, wz: 0.28 } },
    { chamber: { ux: -0.88, lux: -0.62, wx: -0.52, sy: -0.12 }, strike: { ux: 0.72, lux: 0.58, wx: 0.48, sy: 0.2 }, follow: { ux: 0.22, wx: 0.18, wz: 0.22 } },
  ],
};

function poseKeys(family: WeaponFamily, variant: number): PoseKey[] {
  const ready = keyOf(readyHold(family));
  const arc = ARCS[family][variant % 2];
  const chamber = addPose(ready, arc.chamber);
  const strike = addPose(ready, arc.strike);
  const follow = addPose(ready, arc.follow);
  const high = mixPose(chamber, strike, 0.55);
  const recover = mixPose(follow, ready, 0.45);
  return [ready, chamber, high, strike, follow, recover, ready];
}

function poseAtU(keys: PoseKey[], u: number): PoseKey {
  const x = clamp(u, 0, 1);
  let seg = 0;
  while (seg < SWING_TIMES.length - 2 && x >= SWING_TIMES[seg + 1]) seg++;
  const span = SWING_TIMES[seg + 1] - SWING_TIMES[seg];
  const raw = span <= 0 ? 0 : (x - SWING_TIMES[seg]) / span;
  const fast = seg === 2 || seg === 3;
  return mixPose(keys[seg], keys[seg + 1], fast ? raw : smooth(raw));
}

function poseFromKey(k: PoseKey): HumanPose {
  const idle = humanIdle(0);
  return {
    ...idle,
    spine: E(0.05, k.sy, 0),
    head: E(-k.sy * 0.1, -k.sy * 0.35, 0),
    upperArmR: E(k.ux, k.uy, k.uz),
    lowerArmR: E(k.lx, 0, k.lz),
    upperArmL: E(k.lux, k.luy, k.luz),
    lowerArmL: E(k.llx, 0, 0),
    weapon: E(k.wx, 0, k.wz),
  };
}

function familySwing(u: number, family: WeaponFamily, variant: number): HumanPose {
  return poseFromKey(poseAtU(poseKeys(family, variant), u));
}

function familyAttackPose(t: number, family: WeaponFamily, variant: number, hits: number): HumanPose {
  if (hits <= 1) return familySwing(t, family, variant);
  if (t < 0.46) return familySwing(t / 0.46, family, variant);
  return familySwing((t - 0.46) / 0.54, family, variant === 0 ? 1 : 0);
}

function drawEnds(family: WeaponFamily, step: DrawStep): [Hold, Hold] {
  const rest = restHold(family);
  const ready = holdFor(family, "ready");
  const grab = grabHold(family);
  if (carriedOutOfCombat(family)) {
    if (step === "pull") return [rest, ready];
    if (step === "lower") return [ready, rest];
    return [rest, rest];
  }
  if (step === "reach") return [rest, grab];
  if (step === "pull") return [grab, ready];
  if (step === "lower") return [ready, grab];
  return [grab, rest];
}

function drawPose(family: WeaponFamily, step: DrawStep, t: number): HumanPose {
  const base = humanIdle(0, restHold(family));
  const [a, b] = drawEnds(family, step);
  const h = lerpHold(a, b, smooth(t));
  return {
    ...base,
    spine: h.spine,
    head: E(0, -h.spine.y * 0.35, 0),
    upperArmR: h.upperArmR,
    lowerArmR: h.lowerArmR,
    upperArmL: h.upperArmL,
    lowerArmL: h.lowerArmL,
    weapon: h.weapon,
  };
}

export function makeDrawClip(family: WeaponFamily, step: DrawStep): THREE.AnimationClip {
  const frames = step === "pull" || step === "lower" ? 10 : 7;
  const { tracks, duration } = sampleHuman(frames, (t) => drawPose(family, step, t), true, false);
  return new THREE.AnimationClip("Draw", duration, tracks);
}

export function makeWeaponAttack(family: WeaponFamily, variant: number, hits: number, delay: number): THREE.AnimationClip {
  if (family === "sword" || family === "axe" || family === "club") return makeSwordAttack(variant % 2 === 0 ? "chop" : "cut", hits, delay);
  // A hand-to-hand round is a short jab (or a jab and a cross). The delay is the wait after it.
  if (family === "h2h") {
    const frames = hits > 1 ? 28 : 16;
    const { tracks, duration } = sampleHuman(frames, (t) => familyAttackPose(t, family, variant % 2, hits), true, true);
    return new THREE.AnimationClip("Attack", duration, tracks);
  }
  if (family === "dagger" || family === "katana") {
    const frames = 22;
    const { tracks, duration } = sampleHuman(frames, (t) => familyAttackPose(t, family, variant % 2, hits), true, true);
    return new THREE.AnimationClip("Attack", duration, tracks);
  }
  // Greatsword and great axe need a readable wind-up. Delay between swings is unchanged.
  const frames = (family === "greatsword" || family === "greataxe" || family === "scythe" || family === "polearm" || family === "staff" || family === "greatkatana") && hits <= 1 ? 42 : attackFrameCount(delay, hits);
  const { tracks, duration } = sampleHuman(frames, (t) => familyAttackPose(t, family, variant % 2, hits), true, true);
  return new THREE.AnimationClip("Attack", duration, tracks);
}

const _euler = new THREE.Euler(0, 0, 0, "XYZ");
const _quat = new THREE.Quaternion();
const _prev = new THREE.Quaternion();

function quatOf(e: Euler, prev: THREE.Quaternion | null, out: number[]) {
  _euler.set(e.x, e.y, e.z);
  _quat.setFromEuler(_euler);
  if (prev && prev.dot(_quat) < 0) _quat.set(-_quat.x, -_quat.y, -_quat.z, -_quat.w);
  out.push(_quat.x, _quat.y, _quat.z, _quat.w);
  if (prev) prev.copy(_quat);
  else _prev.copy(_quat);
}

function loopTimes(frames: number): { times: number[]; duration: number } {
  const duration = frames / CLIP_FPS;
  const times: number[] = [];
  for (let i = 0; i <= frames; i++) times.push(i / CLIP_FPS);
  times[frames] = duration;
  return { times, duration };
}

function seal(values: number[], stride: number) {
  for (let i = 0; i < stride; i++) values[values.length - stride + i] = values[i];
}

function quatTrack(name: string, times: number[], samples: Euler[], loop = true): THREE.QuaternionKeyframeTrack {
  const values: number[] = [];
  const prev = new THREE.Quaternion();
  let have = false;
  for (const e of samples) {
    quatOf(e, have ? prev : null, values);
    have = true;
  }
  if (loop) seal(values, 4);
  return new THREE.QuaternionKeyframeTrack(`${name}.quaternion`, times, values);
}

function posTrack(name: string, times: number[], samples: { x: number; y: number; z: number }[], loop = true) {
  const values: number[] = [];
  for (const p of samples) values.push(p.x, p.y, p.z);
  if (loop) seal(values, 3);
  return new THREE.VectorKeyframeTrack(`${name}.position`, times, values);
}

function sampleHuman(frames: number, poseAt: (t: number) => HumanPose, upperOnly = false, loop = true) {
  const { times, duration } = loopTimes(frames);
  const poses: HumanPose[] = [];
  for (let i = 0; i <= frames; i++) poses.push(poseAt(i / frames));
  const upper = [
    quatTrack("spine", times, poses.map((p) => p.spine), loop),
    quatTrack("head", times, poses.map((p) => p.head), loop),
    quatTrack("upperArmR", times, poses.map((p) => p.upperArmR), loop),
    quatTrack("lowerArmR", times, poses.map((p) => p.lowerArmR), loop),
    quatTrack("upperArmL", times, poses.map((p) => p.upperArmL), loop),
    quatTrack("lowerArmL", times, poses.map((p) => p.lowerArmL), loop),
    quatTrack("weapon", times, poses.map((p) => p.weapon), loop),
  ];
  const tracks = upperOnly
    ? upper
    : [
        posTrack("hips", times, poses.map((p) => p.hipsP), loop),
        quatTrack("hips", times, poses.map((p) => p.hips), loop),
        ...upper,
        quatTrack("upperLegR", times, poses.map((p) => p.upperLegR), loop),
        quatTrack("lowerLegR", times, poses.map((p) => p.lowerLegR), loop),
        quatTrack("footR", times, poses.map((p) => p.footR), loop),
        quatTrack("upperLegL", times, poses.map((p) => p.upperLegL), loop),
        quatTrack("lowerLegL", times, poses.map((p) => p.lowerLegL), loop),
        quatTrack("footL", times, poses.map((p) => p.footL), loop),
      ];
  return { tracks, duration, poses };
}

export function makeHumanoidClip(
  name: "Idle" | "Walk",
  family: WeaponFamily = "sword",
  mode: "rest" | "ready" = "ready",
): THREE.AnimationClip {
  const frames = name === "Idle" ? CLIP_FPS * 2 : CLIP_FPS;
  const hold = holdFor(family, mode);
  const poseAt = name === "Idle" ? (t: number) => humanIdle(t, hold) : (t: number) => humanWalk(t, hold);
  const { tracks, duration } = sampleHuman(frames, poseAt);
  return new THREE.AnimationClip(name, duration, tracks);
}

export function makeSwordAttack(style: SwingStyle, hits: number, delay: number): THREE.AnimationClip {
  const frames = attackFrameCount(delay, hits);
  const { tracks, duration } = sampleHuman(frames, (t) => attackPose(t, style, hits), true);
  // Attack is not a loop — don't force the last key onto the first's tail if the
  // motion shouldn't wrap, but the recover is authored to land on the carry.
  return new THREE.AnimationClip("Attack", duration, tracks);
}

/**
 * Sword weapon skill motions. Each clip belongs to that skill.
 * Paladin, Red Mage, Dark Knight, and the rest play the same motion
 * when they use the skill. Nothing here checks the job.
 */
const SWORD_SKILL_KEYS: Record<string, SwingKey[][]> = {
  "Fast Blade": [fastKeys(1), fastKeys(-1)],
  "Burning Blade": [burningKeys()],
  "Red Lotus Blade": [lotusKeys()],
  "Flat Blade": [flatKeys()],
  "Shining Blade": [shiningKeys()],
  "Seraph Blade": [seraphKeys()],
  "Circle Blade": [circleKeys()],
  "Spirits Within": [spiritsKeys()],
  "Vorpal Blade": [diagKeys(1), fastKeys(1), diagKeys(-1), fastKeys(-1)],
  "Swift Blade": [riseCut(1), fallCut(1), riseCut(-1)],
  "Savage Blade": [savageReady(), burningKeys(), burningKeys()],
};

function axeCut(side: number, wide = false): SwingKey[] {
  // Chest-high cut. The axe head hangs off the fist, so the arm stays raised
  // and the wrist stays pitched forward. A low sword cut puts the head in the dirt.
  const reach = wide ? 1.15 : 0.78;
  const raw: SwingKey[] = [
    CARRY_KEY,
    { ux: -0.5, uy: 0, uz: -reach, lx: -1.05, lz: 0, sy: -0.18, wx: -1.05, wz: -0.18 },
    { ux: -0.78, uy: 0, uz: -reach * 0.28, lx: -0.72, lz: 0, sy: -0.06, wx: -1.28, wz: -0.04 },
    { ux: -0.64, uy: 0, uz: reach * 0.32, lx: -0.52, lz: 0, sy: 0.14, wx: -1.22, wz: 0.08 },
    { ux: -0.32, uy: 0, uz: reach * 0.82, lx: -0.78, lz: 0, sy: 0.2, wx: -1.02, wz: 0.16 },
    { ux: 0.02, uy: 0, uz: 0.08, lx: -0.62, lz: 0, sy: 0.02, wx: -1.08, wz: 0.02 },
    CARRY_KEY,
  ];
  if (side > 0) return raw;
  return raw.map((k) => ({ ...k, uz: -k.uz, sy: -k.sy, wz: -k.wz }));
}

function fastKeys(side: number): SwingKey[] {
  // Level blade. The arm sweeps across the front and stays there. No chop.
  const raw: SwingKey[] = [
    CARRY_KEY,
    { ux: 0.42, uy: 0, uz: -1.25, lx: -0.35, lz: 0, sy: -0.42, wx: -0.05, wz: -0.85 },
    { ux: 0.28, uy: 0, uz: -0.55, lx: -0.2, lz: 0, sy: -0.18, wx: -0.02, wz: -0.25 },
    { ux: 0.18, uy: 0, uz: 0.35, lx: -0.15, lz: 0, sy: 0.16, wx: 0, wz: 0.35 },
    { ux: 0.22, uy: 0, uz: 1.05, lx: -0.22, lz: 0, sy: 0.36, wx: -0.04, wz: 0.75 },
    { ux: 0.16, uy: 0, uz: 0.15, lx: -0.4, lz: 0, sy: 0.04, wx: -0.55, wz: 0.08 },
    CARRY_KEY,
  ];
  if (side > 0) return raw;
  return raw.map((k) => ({ ...k, uz: -k.uz, sy: -k.sy, wz: -k.wz }));
}

function cutKeys(side: number): SwingKey[] {
  const flip = (k: SwingKey): SwingKey => ({ ...k, uz: k.uz * side, sy: k.sy * side, wz: k.wz * side });
  return [CARRY_KEY, CUT_CHAMBER, CUT_HIGH, CUT_STRIKE, CUT_FOLLOW, RECOVER_KEY, CARRY_KEY].map(flip);
}

function burningKeys(): SwingKey[] {
  // Lift in front to overhead, then down through the target. Positive arm pitch throws the sword behind the body.
  return [
    CARRY_KEY,
    { ux: -0.85, uy: 0, uz: -0.2, lx: -0.9, lz: 0, sy: -0.1, wx: -0.7, wz: -0.08 },
    { ux: -1.45, uy: 0, uz: 0.05, lx: -0.25, lz: 0, sy: 0, wx: -0.15, wz: 0 },
    { ux: -0.35, uy: 0, uz: 0.12, lx: -0.2, lz: 0, sy: 0.16, wx: 0.15, wz: 0.08 },
    { ux: 0.05, uy: 0, uz: 0.16, lx: -0.45, lz: 0, sy: 0.12, wx: 0.4, wz: 0.1 },
    RECOVER_KEY,
    CARRY_KEY,
  ];
}

function lotusKeys(): SwingKey[] {
  // One rising cut across the front. The arm stays in front of the body.
  return [
    CARRY_KEY,
    { ux: 0.35, uy: 0, uz: -1.15, lx: -0.55, lz: 0, sy: -0.32, wx: -0.15, wz: -0.7 },
    { ux: 0.12, uy: 0, uz: -0.4, lx: -0.28, lz: 0, sy: -0.1, wx: -0.05, wz: -0.18 },
    { ux: -0.35, uy: 0, uz: 0.45, lx: -0.18, lz: 0, sy: 0.2, wx: -0.08, wz: 0.42 },
    { ux: -0.5, uy: 0, uz: 0.95, lx: -0.22, lz: 0, sy: 0.26, wx: -0.04, wz: 0.68 },
    RECOVER_KEY,
    CARRY_KEY,
  ];
}

function flatKeys(): SwingKey[] {
  // The flat of the blade is turned toward the target, then the arm stops on the hit.
  const slap: SwingKey = { ux: -0.1, uy: 0, uz: 0.05, lx: -0.12, lz: 0, sy: 0.06, wx: 0.08, wz: 1.2 };
  return [
    CARRY_KEY,
    { ux: -0.9, uy: 0, uz: -0.28, lx: -0.8, lz: 0, sy: -0.1, wx: -0.3, wz: 1.05 },
    { ux: -1.15, uy: 0, uz: 0.02, lx: -0.35, lz: 0, sy: -0.02, wx: -0.08, wz: 1.25 },
    slap,
    slap,
    RECOVER_KEY,
    CARRY_KEY,
  ];
}

function shiningKeys(): SwingKey[] {
  // One diagonal holy cut. The arm stays in front and comes down across the target.
  return [
    CARRY_KEY,
    { ux: -0.75, uy: 0, uz: -0.85, lx: -0.7, lz: 0, sy: -0.2, wx: -0.35, wz: -0.4 },
    { ux: -1.15, uy: 0, uz: -0.3, lx: -0.28, lz: 0, sy: -0.06, wx: -0.08, wz: -0.12 },
    { ux: -0.2, uy: 0, uz: 0.42, lx: -0.14, lz: 0, sy: 0.16, wx: 0.12, wz: 0.38 },
    { ux: 0.02, uy: 0, uz: 0.82, lx: -0.22, lz: 0, sy: 0.14, wx: 0.22, wz: 0.52 },
    RECOVER_KEY,
    CARRY_KEY,
  ];
}

function seraphKeys(): SwingKey[] {
  // Wide diagonal in front of the body. The arm does not pass behind the back.
  return [
    CARRY_KEY,
    { ux: -0.7, uy: 0, uz: -1.05, lx: -0.55, lz: 0, sy: -0.28, wx: -0.2, wz: -0.55 },
    { ux: -1.05, uy: 0, uz: -0.35, lx: -0.25, lz: 0, sy: -0.08, wx: -0.05, wz: -0.1 },
    { ux: -0.15, uy: 0, uz: 0.7, lx: -0.12, lz: 0, sy: 0.22, wx: 0.08, wz: 0.55 },
    { ux: 0.02, uy: 0, uz: 1.05, lx: -0.2, lz: 0, sy: 0.18, wx: 0.16, wz: 0.7 },
    RECOVER_KEY,
    CARRY_KEY,
  ];
}

function diagKeys(side: number): SwingKey[] {
  const raw = seraphKeys();
  if (side > 0) return raw;
  return raw.map((k) => ({ ...k, uz: -k.uz, sy: -k.sy, wz: -k.wz }));
}

function riseCut(side: number): SwingKey[] {
  const raw: SwingKey[] = [
    CARRY_KEY,
    { ux: 0.28, uy: 0, uz: -1.05, lx: -0.45, lz: 0, sy: -0.22, wx: -0.1, wz: -0.55 },
    { ux: 0.08, uy: 0, uz: -0.35, lx: -0.22, lz: 0, sy: -0.06, wx: -0.04, wz: -0.12 },
    { ux: -0.45, uy: 0, uz: 0.4, lx: -0.14, lz: 0, sy: 0.16, wx: -0.02, wz: 0.38 },
    { ux: -0.55, uy: 0, uz: 0.85, lx: -0.18, lz: 0, sy: 0.18, wx: 0, wz: 0.55 },
    RECOVER_KEY,
    CARRY_KEY,
  ];
  if (side > 0) return raw;
  return raw.map((k) => ({ ...k, uz: -k.uz, sy: -k.sy, wz: -k.wz }));
}

function fallCut(side: number): SwingKey[] {
  const raw: SwingKey[] = [
    CARRY_KEY,
    { ux: -0.85, uy: 0, uz: -0.7, lx: -0.55, lz: 0, sy: -0.16, wx: -0.25, wz: -0.3 },
    { ux: -1.15, uy: 0, uz: -0.2, lx: -0.22, lz: 0, sy: -0.04, wx: -0.06, wz: -0.06 },
    { ux: -0.2, uy: 0, uz: 0.35, lx: -0.12, lz: 0, sy: 0.12, wx: 0.12, wz: 0.28 },
    { ux: 0.02, uy: 0, uz: 0.7, lx: -0.2, lz: 0, sy: 0.1, wx: 0.2, wz: 0.4 },
    RECOVER_KEY,
    CARRY_KEY,
  ];
  if (side > 0) return raw;
  return raw.map((k) => ({ ...k, uz: -k.uz, sy: -k.sy, wz: -k.wz }));
}

function savageReady(): SwingKey[] {
  const cocked: SwingKey = { ux: -1.2, uy: 0, uz: -0.08, lx: -0.28, lz: 0, sy: 0.06, wx: -0.08, wz: 0 };
  return [CARRY_KEY, cocked, cocked, cocked, cocked, cocked, CARRY_KEY];
}

function circleKeys(): SwingKey[] {
  const out: SwingKey = { ux: 0.2, uy: 0, uz: -1.15, lx: -0.22, lz: 0, sy: 0, wx: -0.04, wz: -0.12 };
  return [CARRY_KEY, out, out, out, out, out, CARRY_KEY];
}

function spiritsKeys(): SwingKey[] {
  const planted: SwingKey = { ux: -0.15, uy: 0, uz: 0.04, lx: -0.4, lz: 0, sy: 0.02, wx: -0.35, wz: 0 };
  const thrust: SwingKey = { ux: -0.02, uy: 0, uz: 0.02, lx: -0.08, lz: 0, sy: 0.06, wx: -0.7, wz: 0 };
  return [CARRY_KEY, planted, planted, thrust, thrust, RECOVER_KEY, CARRY_KEY];
}

function poseFromSwing(k: SwingKey): HumanPose {
  const idle = humanIdle(0);
  return {
    ...idle,
    spine: E(0.05, k.sy, 0),
    head: E(-k.sy * 0.1, -k.sy * 0.35, 0),
    upperArmR: E(k.ux, k.uy, k.uz),
    lowerArmR: E(k.lx, 0, k.lz),
    upperArmL: E(idle.upperArmL.x - k.sy * 0.25, idle.upperArmL.y, idle.upperArmL.z + k.sy * 0.15),
    weapon: E(k.wx, 0, k.wz),
  };
}

function skillKeyAt(u: number, keys: SwingKey[]): SwingKey {
  const x = clamp(u, 0, 1);
  let seg = 0;
  while (seg < SWING_TIMES.length - 2 && x >= SWING_TIMES[seg + 1]) seg++;
  const span = SWING_TIMES[seg + 1] - SWING_TIMES[seg];
  const raw = span <= 0 ? 0 : (x - SWING_TIMES[seg]) / span;
  const fast = seg === 2 || seg === 3;
  return mixKey(keys[seg], keys[seg + 1], fast ? raw : smooth(raw));
}

export function makeSwordSkillClip(name: string): THREE.AnimationClip | null {
  const parts = SWORD_SKILL_KEYS[name];
  if (!parts) return null;
  const weights = name === "Vorpal Blade" ? [1, 1, 0.55, 0.55] : null;
  const frames =
    name === "Fast Blade" ? 20
    : name === "Burning Blade" ? 28
    : name === "Red Lotus Blade" ? 26
    : name === "Flat Blade" ? 24
    : name === "Shining Blade" ? 24
    : name === "Seraph Blade" ? 26
    : name === "Circle Blade" ? 28
    : name === "Spirits Within" ? 26
    : name === "Vorpal Blade" ? 32
    : name === "Swift Blade" ? 28
    : name === "Savage Blade" ? 36
    : parts.length >= 4 ? 36
    : parts.length === 2 ? 30
    : 22;
  const poseAt = (t: number) => {
    if (weights) {
      const hit = weightedPart(t, weights);
      return poseFromSwing(skillKeyAt(hit.local, parts[hit.slot]));
    }
    const n = parts.length;
    const slot = Math.min(n - 1, Math.floor(Math.min(t, 0.999) * n));
    const local = t * n - slot;
    return poseFromSwing(skillKeyAt(local, parts[slot]));
  };
  const { tracks, duration } = sampleHuman(frames, poseAt, true);
  return new THREE.AnimationClip(name, duration, tracks);
}

function weightedPart(t: number, weights: number[]): { slot: number; local: number } {
  const sum = weights.reduce((a, b) => a + b, 0);
  let acc = 0;
  const x = Math.min(t, 0.999);
  for (let i = 0; i < weights.length; i++) {
    const w = weights[i] / sum;
    if (x < acc + w || i === weights.length - 1) return { slot: i, local: Math.min(1, (x - acc) / w) };
    acc += w;
  }
  return { slot: 0, local: 0 };
}

/**
 * One-handed axe weapon skills. The arm does the swing. The axe bit
 * stays in the hand and turns toward the target in the yard, except
 * Smash Axe, which keeps the flat of the head.
 */
const AXE_SKILL_KEYS: Record<string, SwingKey[][]> = {
  "Raging Axe": [fastKeys(1), fastKeys(-1)],
  "Smash Axe": [flatKeys()],
  "Gale Axe": [fastKeys(1)],
  "Avalanche Axe": [burningKeys()],
  "Spinning Axe": [circleKeys()],
  "Rampage": [axeCut(1), axeCut(-1), axeCut(1), axeCut(-1), axeCut(1)],
  "Calamity": [burningKeys()],
  "Mistral Axe": [axeCut(1, true)],
  "Decimation": [axeCut(1), axeCut(-1), axeCut(1)],
  "Bora Axe": [cutKeys(1)],
};

const AXE_WEIGHTS: Record<string, number[]> = {
  Rampage: [1, 0.82, 0.58, 0.38, 0.26],
};

export function makeAxeSkillClip(name: string): THREE.AnimationClip | null {
  const parts = AXE_SKILL_KEYS[name];
  if (!parts) return null;
  const weights = AXE_WEIGHTS[name] ?? null;
  const frames =
    name === "Raging Axe" ? 18
    : name === "Rampage" ? 30
    : name === "Decimation" ? 24
    : name === "Avalanche Axe" || name === "Calamity" ? 28
    : name === "Spinning Axe" || name === "Mistral Axe" ? 26
    : 22;
  const poseAt = (t: number) => {
    if (weights) {
      const hit = weightedPart(t, weights);
      return poseFromSwing(skillKeyAt(hit.local, parts[hit.slot]));
    }
    const n = parts.length;
    const slot = Math.min(n - 1, Math.floor(Math.min(t, 0.999) * n));
    const local = t * n - slot;
    return poseFromSwing(skillKeyAt(local, parts[slot]));
  };
  const { tracks, duration } = sampleHuman(frames, poseAt, true);
  return new THREE.AnimationClip(name, duration, tracks);
}

/**
 * One-handed club weapon skills. The wrist stays pitched forward so the
 * head of the club leads. A sword chop would bury that head.
 */
const CLUB_CARRY: SwingKey = { ux: 0.15, uy: 0, uz: -0.15, lx: -0.55, lz: 0, sy: 0, wx: -1.15, wz: 0 };

function clubShining(): SwingKey[] {
  return [
    CLUB_CARRY,
    { ux: -0.55, uy: 0, uz: -0.12, lx: -0.75, lz: 0, sy: -0.06, wx: -1.12, wz: -0.04 },
    { ux: -1.15, uy: 0, uz: 0.02, lx: -0.28, lz: 0, sy: 0, wx: -1.22, wz: 0 },
    { ux: -0.62, uy: 0, uz: 0.1, lx: -0.28, lz: 0, sy: 0.06, wx: -0.38, wz: 0.04 },
    { ux: 0.05, uy: 0, uz: 0.06, lx: -0.42, lz: 0, sy: 0.06, wx: -1.1, wz: 0.02 },
    CLUB_CARRY,
    CLUB_CARRY,
  ];
}

function clubSeraph(): SwingKey[] {
  const high: SwingKey = { ux: -1.5, uy: 0, uz: -0.08, lx: -0.12, lz: 0, sy: -0.1, wx: -1.26, wz: -0.04 };
  return [
    CLUB_CARRY,
    { ux: -0.9, uy: 0, uz: -0.1, lx: -0.45, lz: 0, sy: -0.08, wx: -1.18, wz: -0.04 },
    high,
    high,
    { ux: -0.58, uy: 0, uz: 0.12, lx: -0.24, lz: 0, sy: 0.08, wx: -0.34, wz: 0.04 },
    { ux: 0.15, uy: 0, uz: 0.06, lx: -0.48, lz: 0, sy: 0.1, wx: -1.08, wz: 0.02 },
    CLUB_CARRY,
  ];
}

function clubBonk(): SwingKey[] {
  const stop: SwingKey = { ux: -0.48, uy: 0, uz: 0.55, lx: -0.32, lz: 0, sy: 0.16, wx: -0.42, wz: 0.06 };
  return [
    CLUB_CARRY,
    { ux: 0.28, uy: 0, uz: -0.95, lx: -0.7, lz: 0, sy: -0.32, wx: -1.08, wz: -0.12 },
    { ux: 0.16, uy: 0, uz: -0.15, lx: -0.4, lz: 0, sy: -0.04, wx: -1.14, wz: 0 },
    stop,
    stop,
    { ux: 0.1, uy: 0, uz: 0.2, lx: -0.48, lz: 0, sy: 0.06, wx: -1.12, wz: 0.02 },
    CLUB_CARRY,
  ];
}

function clubStarlight(): SwingKey[] {
  const up: SwingKey = { ux: -1.42, uy: 0, uz: 0.02, lx: -0.18, lz: 0, sy: -0.06, wx: -1.2, wz: 0 };
  return [
    CLUB_CARRY,
    { ux: -0.75, uy: 0, uz: 0, lx: -0.55, lz: 0, sy: -0.02, wx: -1.14, wz: 0 },
    up,
    up,
    up,
    { ux: -0.85, uy: 0, uz: 0, lx: -0.3, lz: 0, sy: 0, wx: -1.16, wz: 0 },
    CLUB_CARRY,
  ];
}

function clubMoon(): SwingKey[] {
  const up = (sy: number, wz: number): SwingKey => ({ ux: -1.25, uy: 0, uz: 0.04, lx: -0.22, lz: 0, sy, wx: -1.18, wz });
  return [CLUB_CARRY, up(-0.2, -0.16), up(-0.05, -0.04), up(0.18, 0.12), up(0.05, 0.04), up(-0.08, -0.06), CLUB_CARRY];
}

function clubSkull(): SwingKey[] {
  const smash: SwingKey = { ux: -0.62, uy: 0, uz: 0.12, lx: -0.22, lz: 0, sy: 0.08, wx: -0.36, wz: 0.04 };
  return [
    CLUB_CARRY,
    { ux: -0.7, uy: 0, uz: -0.18, lx: -0.85, lz: 0, sy: -0.16, wx: -1.1, wz: -0.08 },
    { ux: -1.35, uy: 0, uz: -0.04, lx: -0.2, lz: 0, sy: -0.08, wx: -1.24, wz: -0.02 },
    smash,
    smash,
    { ux: 0.18, uy: 0, uz: 0.08, lx: -0.55, lz: 0, sy: 0.12, wx: -1.08, wz: 0.02 },
    CLUB_CARRY,
  ];
}

function clubTrue(): SwingKey[] {
  const hit: SwingKey = { ux: -0.6, uy: 0, uz: 0.08, lx: -0.22, lz: 0, sy: 0.04, wx: -0.34, wz: 0.02 };
  return [
    CLUB_CARRY,
    { ux: -0.85, uy: 0, uz: -0.08, lx: -0.4, lz: 0, sy: -0.04, wx: -1.16, wz: -0.02 },
    hit,
    hit,
    { ux: 0.02, uy: 0, uz: 0.02, lx: -0.4, lz: 0, sy: 0.02, wx: -1.12, wz: 0 },
    CLUB_CARRY,
    CLUB_CARRY,
  ];
}

function clubJudgment(): SwingKey[] {
  // Overhead, then the head stops on the enemy. The old slam hung the arm
  // and the crouch carried the club into the ground.
  const cocked: SwingKey = { ux: -1.45, uy: 0, uz: -0.16, lx: -0.22, lz: 0, sy: -0.18, wx: -0.85, wz: -0.08 };
  const slam: SwingKey = { ux: -0.7, uy: 0, uz: 0.1, lx: -0.28, lz: 0, sy: 0.08, wx: -0.32, wz: 0.04 };
  return [
    CLUB_CARRY,
    cocked,
    cocked,
    { ux: -1.05, uy: 0, uz: -0.02, lx: -0.3, lz: 0, sy: -0.04, wx: -0.55, wz: -0.02 },
    slam,
    { ux: -0.48, uy: 0, uz: 0.06, lx: -0.5, lz: 0, sy: 0.04, wx: -0.62, wz: 0.02 },
    CLUB_CARRY,
  ];
}

function clubHaloSweep(): SwingKey[] {
  const cut: SwingKey = { ux: -0.52, uy: 0, uz: 0.62, lx: -0.3, lz: 0, sy: 0.18, wx: -0.4, wz: 0.08 };
  return [
    CLUB_CARRY,
    { ux: 0.22, uy: 0, uz: -1.05, lx: -0.65, lz: 0, sy: -0.34, wx: -1.08, wz: -0.14 },
    { ux: 0.1, uy: 0, uz: -0.35, lx: -0.4, lz: 0, sy: -0.1, wx: -1.12, wz: -0.04 },
    { ux: -0.05, uy: 0, uz: 0.25, lx: -0.22, lz: 0, sy: 0.12, wx: -1.16, wz: 0.06 },
    cut,
    { ux: -0.1, uy: 0, uz: 0.35, lx: -0.4, lz: 0, sy: 0.08, wx: -1.12, wz: 0.04 },
    CLUB_CARRY,
  ];
}

function clubHaloSmash(): SwingKey[] {
  return [
    CLUB_CARRY,
    { ux: -0.65, uy: 0, uz: -0.1, lx: -0.7, lz: 0, sy: -0.06, wx: -1.12, wz: -0.04 },
    { ux: -1.4, uy: 0, uz: 0, lx: -0.18, lz: 0, sy: -0.02, wx: -1.24, wz: 0 },
    { ux: -0.6, uy: 0, uz: 0.1, lx: -0.22, lz: 0, sy: 0.08, wx: -0.36, wz: 0.04 },
    { ux: 0.08, uy: 0, uz: 0.06, lx: -0.42, lz: 0, sy: 0.08, wx: -1.1, wz: 0.02 },
    CLUB_CARRY,
    CLUB_CARRY,
  ];
}

/** One stroke of the six-hit flurry. The head stays on the enemy, not the ground. */
function clubHexa(side: number, heavy = false): SwingKey[] {
  const cross = side > 0;
  const uz = cross ? 0.34 : 0.14;
  const wind: SwingKey = { ux: -0.48, uy: 0, uz: uz * 0.55, lx: -0.5, lz: 0, sy: cross ? -0.04 : 0.04, wx: -0.5, wz: 0 };
  const cock: SwingKey = { ux: -0.55, uy: 0, uz, lx: -0.36, lz: 0, sy: 0.02, wx: -0.4, wz: 0 };
  const hit: SwingKey = {
    ux: heavy ? -0.78 : -0.66,
    uy: 0,
    uz,
    lx: heavy ? -0.16 : -0.22,
    lz: 0,
    sy: heavy ? 0.06 : 0.04,
    wx: heavy ? -0.18 : -0.28,
    wz: 0,
  };
  const follow: SwingKey = { ux: -0.46, uy: 0, uz: uz * 0.7, lx: -0.42, lz: 0, sy: 0, wx: -0.46, wz: 0 };
  return [CLUB_CARRY, wind, cock, hit, hit, follow, CLUB_CARRY];
}

const CLUB_SKILL_KEYS: Record<string, SwingKey[][]> = {
  "Shining Strike": [clubShining()],
  "Seraph Strike": [clubSeraph()],
  Brainshaker: [clubBonk()],
  Starlight: [clubStarlight()],
  Moonlight: [clubMoon()],
  Skullbreaker: [clubSkull()],
  "True Strike": [clubTrue()],
  Judgment: [clubJudgment()],
  "Black Halo": [clubHaloSweep(), clubHaloSmash()],
  "Hexa Strike": [clubHexa(1), clubHexa(-1), clubHexa(1), clubHexa(-1), clubHexa(1), clubHexa(-1, true)],
};

const CLUB_WEIGHTS: Record<string, number[]> = {
  "Black Halo": [1, 1],
  "Hexa Strike": [1, 1, 1, 1, 1, 1],
};

export function makeClubSkillClip(name: string): THREE.AnimationClip | null {
  const parts = CLUB_SKILL_KEYS[name];
  if (!parts) return null;
  const weights = CLUB_WEIGHTS[name] ?? null;
  const frames =
    name === "True Strike" ? 14
    : name === "Shining Strike" ? 18
    : name === "Brainshaker" ? 20
    : name === "Starlight" ? 22
    : name === "Moonlight" || name === "Skullbreaker" ? 24
    : name === "Seraph Strike" ? 28
    : name === "Black Halo" ? 32
    : name === "Judgment" ? 36
    : name === "Hexa Strike" ? 48
    : 22;
  const poseAt = (t: number) => {
    if (weights) {
      const hit = weightedPart(t, weights);
      return poseFromSwing(skillKeyAt(hit.local, parts[hit.slot]));
    }
    const n = parts.length;
    const slot = Math.min(n - 1, Math.floor(Math.min(t, 0.999) * n));
    const local = t * n - slot;
    return poseFromSwing(skillKeyAt(local, parts[slot]));
  };
  const { tracks, duration } = sampleHuman(frames, poseAt, true);
  return new THREE.AnimationClip(name, duration, tracks);
}

type HarePose = HumanPose & { earL: Euler; earR: Euler };

function hareBase(): HarePose {
  const idle = humanIdle(0);
  return {
    ...idle,
    hipsP: { x: 0, y: 0, z: 0 },
    hips: E(0, 0, 0),
    spine: E(0, 0, 0),
    head: E(0, 0, 0),
    upperArmR: E(0.15, 0, 0),
    lowerArmR: E(0, 0, 0),
    upperArmL: E(0.15, 0, 0),
    lowerArmL: E(0, 0, 0),
    upperLegR: E(-0.1, 0, 0),
    lowerLegR: E(0.15, 0, 0),
    footR: E(-0.05, 0, 0),
    upperLegL: E(-0.1, 0, 0),
    lowerLegL: E(0.15, 0, 0),
    footL: E(-0.05, 0, 0),
    weapon: E(0, 0, 0),
    earL: E(0, 0, 0.04),
    earR: E(0, 0, -0.04),
  };
}

function hareIdle(t: number): HarePose {
  const s = Math.sin(Math.PI * 2 * t);
  const bob = Math.sin(Math.PI * 4 * t);
  const base = hareBase();
  return {
    ...base,
    hipsP: { x: s * 0.03, y: bob * 0.015, z: 0 },
    hips: E(0, 0, s * 0.04),
    spine: E(bob * 0.03, 0, -s * 0.05),
    head: E(bob * 0.08, s * 0.05, 0),
    earL: E(0, 0, 0.04 + s * 0.1),
    earR: E(0, 0, -0.04 - s * 0.1),
    weapon: E(0, s * 0.04, 0),
  };
}

function hareWalk(t: number): HarePose {
  const tip = Math.sin(Math.PI * 2 * t);
  const step = Math.sin(Math.PI * 2 * t);
  const base = hareBase();
  // Quadruped trot: front (arms) opposite the hind legs. Stack tips, base steps.
  const hind = step * 0.55;
  const front = -step * 0.5;
  return {
    ...base,
    hipsP: { x: 0, y: Math.abs(tip) * 0.03, z: 0 },
    hips: E(tip * 0.12, 0, tip * 0.06),
    spine: E(0.08 + tip * 0.1, 0, -tip * 0.08),
    head: E(-0.05, 0, tip * 0.04),
    upperLegR: E(base.upperLegR.x + hind, 0, 0),
    lowerLegR: E(base.lowerLegR.x + Math.max(0, hind) * 0.8, 0, 0),
    footR: E(base.footR.x - hind, 0, 0),
    upperLegL: E(base.upperLegL.x - hind, 0, 0),
    lowerLegL: E(base.lowerLegL.x + Math.max(0, -hind) * 0.8, 0, 0),
    footL: E(base.footL.x + hind, 0, 0),
    upperArmR: E(base.upperArmR.x + front, 0, 0),
    lowerArmR: E(Math.max(0, front) * 0.7, 0, 0),
    upperArmL: E(base.upperArmL.x - front, 0, 0),
    lowerArmL: E(Math.max(0, -front) * 0.7, 0, 0),
    earL: E(-0.1, 0, 0.08),
    earR: E(-0.1, 0, -0.08),
    weapon: E(0, tip * 0.05, 0),
  };
}

function hareAttack(t: number): HarePose {
  const base = hareBase();
  const u = t < 0.3 ? smooth(t / 0.3) : t < 0.5 ? 1 : 1 - smooth((t - 0.5) / 0.5);
  return {
    ...base,
    spine: E(-0.35 * u, 0, 0),
    head: E(-0.55 * u, 0, 0),
    upperArmR: E(0.4 * u, 0, -0.2 * u),
    upperArmL: E(0.4 * u, 0, 0.2 * u),
    earL: E(-0.4 * u, 0, 0.2),
    earR: E(-0.4 * u, 0, -0.2),
  };
}

/**
 * Tropical Rarab mobskills. The auto stays the bite.
 * Foot Kick rears and thrusts both hind legs. Whirl Claws crouches with the
 * claws out; the yard spins the body on top of this pose. Dust Cloud hops
 * and stomps. Wild Carrot sits and looks up. The strike sits near 42% of
 * the clip, which is when the blow lands.
 */
function hareFootKick(t: number): HarePose {
  const base = hareBase();
  const rear = t < 0.22 ? smooth(t / 0.22) : t < 0.62 ? 1 : 1 - smooth((t - 0.62) / 0.38);
  const kick = t < 0.28 ? 0 : t < 0.46 ? smooth((t - 0.28) / 0.18) : Math.max(0, 1 - smooth((t - 0.46) / 0.28));
  return {
    ...base,
    hipsP: { x: 0, y: rear * 0.08, z: kick * 0.03 },
    hips: E(-0.4 * rear, 0, 0),
    spine: E(0.62 * rear, 0, 0),
    head: E(-0.15 * rear, 0, 0),
    earL: E(0.4 * rear, 0, 0.22),
    earR: E(0.4 * rear, 0, -0.22),
    upperArmR: E(-0.95 * rear, 0, -0.4 * rear),
    upperArmL: E(-0.95 * rear, 0, 0.4 * rear),
    lowerArmR: E(-0.45 * rear, 0, 0),
    lowerArmL: E(-0.45 * rear, 0, 0),
    upperLegR: E(base.upperLegR.x + 0.75 * rear - 1.45 * kick, 0, 0.14 * kick),
    upperLegL: E(base.upperLegL.x + 0.75 * rear - 1.45 * kick, 0, -0.14 * kick),
    lowerLegR: E(base.lowerLegR.x + 0.95 * rear * (1 - kick) + 0.12 * kick, 0, 0),
    lowerLegL: E(base.lowerLegL.x + 0.95 * rear * (1 - kick) + 0.12 * kick, 0, 0),
    footR: E(-0.45 * kick, 0, 0),
    footL: E(-0.45 * kick, 0, 0),
  };
}

function hareWhirlClaws(t: number): HarePose {
  const base = hareBase();
  const u = t < 0.12 ? smooth(t / 0.12) : t < 0.82 ? 1 : 1 - smooth((t - 0.82) / 0.18);
  const spin = t < 0.12 ? 0 : t < 0.82 ? (t - 0.12) / 0.7 : 1;
  const sway = Math.sin(spin * Math.PI * 2);
  return {
    ...base,
    hipsP: { x: sway * 0.02, y: -0.03 * u, z: 0 },
    hips: E(0.18 * u, sway * 0.2, sway * 0.08),
    spine: E(0.28 * u, sway * 0.22, -sway * 0.1),
    head: E(-0.08 * u, -sway * 0.18, 0),
    earL: E(-0.6 * u, 0, 0.38),
    earR: E(-0.6 * u, 0, -0.38),
    upperArmR: E(-0.15 * u, 0, -1.2 * u),
    upperArmL: E(-0.15 * u, 0, 1.2 * u),
    lowerArmR: E(-0.4 * u, 0, sway * 0.3),
    lowerArmL: E(-0.4 * u, 0, -sway * 0.3),
    upperLegR: E(base.upperLegR.x + 0.28 * u, 0, 0.12 * sway),
    upperLegL: E(base.upperLegL.x + 0.28 * u, 0, -0.12 * sway),
    lowerLegR: E(base.lowerLegR.x + 0.4 * u, 0, 0),
    lowerLegL: E(base.lowerLegL.x + 0.4 * u, 0, 0),
  };
}

function hareDustCloud(t: number): HarePose {
  const base = hareBase();
  const hop = t < 0.22 ? smooth(t / 0.22) : t < 0.4 ? 1 - smooth((t - 0.22) / 0.18) : 0;
  const stomp = t < 0.34 ? 0 : t < 0.5 ? smooth((t - 0.34) / 0.16) : Math.max(0, 1 - smooth((t - 0.5) / 0.35));
  return {
    ...base,
    hipsP: { x: 0, y: hop * 0.1 - stomp * 0.04, z: 0 },
    hips: E(0.22 * stomp, 0, 0),
    spine: E(0.5 * stomp - 0.12 * hop, 0, 0),
    head: E(0.4 * stomp, 0, 0),
    earL: E(0.25 * stomp, 0, 0.16),
    earR: E(0.25 * stomp, 0, -0.16),
    upperArmR: E(0.85 * stomp + 0.15 * hop, 0, -0.28 * stomp),
    upperArmL: E(0.85 * stomp + 0.15 * hop, 0, 0.28 * stomp),
    lowerArmR: E(0.35 * stomp, 0, 0),
    lowerArmL: E(0.35 * stomp, 0, 0),
    upperLegR: E(base.upperLegR.x - 0.85 * hop + 0.5 * stomp, 0, 0),
    upperLegL: E(base.upperLegL.x - 0.85 * hop + 0.5 * stomp, 0, 0),
    lowerLegR: E(base.lowerLegR.x + 0.75 * hop, 0, 0),
    lowerLegL: E(base.lowerLegL.x + 0.75 * hop, 0, 0),
    footR: E(0.35 * stomp, 0, 0),
    footL: E(0.35 * stomp, 0, 0),
  };
}

function hareWildCarrot(t: number): HarePose {
  const base = hareBase();
  const u = t < 0.2 ? smooth(t / 0.2) : t < 0.78 ? 1 : 1 - smooth((t - 0.78) / 0.22);
  return {
    ...base,
    hipsP: { x: 0, y: -0.04 * u, z: -0.03 * u },
    hips: E(-0.5 * u, 0, 0),
    spine: E(0.75 * u, 0, 0),
    head: E(-0.6 * u, 0, 0),
    earL: E(-0.75 * u, 0, 0.06),
    earR: E(-0.75 * u, 0, -0.06),
    upperArmR: E(-0.45 * u, 0, -0.5 * u),
    upperArmL: E(-0.45 * u, 0, 0.5 * u),
    lowerArmR: E(-0.85 * u, 0, 0),
    lowerArmL: E(-0.85 * u, 0, 0),
    upperLegR: E(0.95 * u, 0, 0.08 * u),
    upperLegL: E(0.95 * u, 0, -0.08 * u),
    lowerLegR: E(1.15 * u, 0, 0),
    lowerLegL: E(1.15 * u, 0, 0),
    footR: E(-0.4 * u, 0, 0),
    footL: E(-0.4 * u, 0, 0),
  };
}

function sampleHare(frames: number, poseAt: (t: number) => HarePose, upperOnly = false) {
  const { times } = loopTimes(frames);
  const poses: HarePose[] = [];
  for (let i = 0; i <= frames; i++) poses.push(poseAt(i / frames));
  const human = sampleHuman(frames, poseAt, upperOnly);
  const tracks = upperOnly
    ? [
        ...human.tracks,
        quatTrack("earL", times, poses.map((p) => p.earL)),
        quatTrack("earR", times, poses.map((p) => p.earR)),
      ]
    : [
        ...human.tracks,
        quatTrack("earL", times, poses.map((p) => p.earL)),
        quatTrack("earR", times, poses.map((p) => p.earR)),
      ];
  return { tracks, duration: human.duration };
}

export type HareClipName = "Idle" | "Walk" | "Attack" | "Foot Kick" | "Whirl Claws" | "Dust Cloud" | "Wild Carrot";

export function makeHareClip(name: HareClipName): THREE.AnimationClip {
  if (name === "Idle" || name === "Walk") {
    const frames = name === "Idle" ? CLIP_FPS * 2 : CLIP_FPS;
    const { tracks, duration } = sampleHare(frames, name === "Idle" ? hareIdle : hareWalk);
    return new THREE.AnimationClip(name, duration, tracks);
  }
  const motion =
    name === "Attack" ? hareAttack
    : name === "Foot Kick" ? hareFootKick
    : name === "Whirl Claws" ? hareWhirlClaws
    : name === "Dust Cloud" ? hareDustCloud
    : hareWildCarrot;
  const frames = name === "Attack" ? 10 : name === "Foot Kick" ? 16 : name === "Whirl Claws" ? 18 : name === "Dust Cloud" ? 18 : 20;
  const { tracks, duration } = sampleHare(frames, motion, name === "Attack");
  return new THREE.AnimationClip(name, duration, tracks);
}

export type Driver = {
  mixer: THREE.AnimationMixer;
  attackMixer: THREE.AnimationMixer;
  stride: number;
  playAttack: (clip: THREE.AnimationClip) => void;
  stopAttack: () => void;
  /** Seconds into the active Attack clip. Ignored when nothing is swinging. */
  setAttackTime: (time: number) => void;
  setLocomotion: (idleClip: THREE.AnimationClip, walkClip: THREE.AnimationClip) => void;
  getWalkPhase: () => number;
  update: (dt: number, distance: number, moving: boolean, reduced: boolean) => void;
};

export function bindDriver(
  root: THREE.Object3D,
  idleClipIn: THREE.AnimationClip,
  walkClipIn: THREE.AnimationClip,
  stride: number,
): Driver {
  const mixer = new THREE.AnimationMixer(root);
  const attackMixer = new THREE.AnimationMixer(root);
  let idleClip = idleClipIn;
  let walkClip = walkClipIn;
  let idle = mixer.clipAction(idleClip);
  let walk = mixer.clipAction(walkClip);
  idle.play();
  walk.play();
  idle.paused = true;
  walk.paused = true;
  idle.weight = 1;
  walk.weight = 0;
  let idleTime = 0;
  let walkTime = 0;
  let blend = 0;
  let attack: THREE.AnimationAction | null = null;

  const applyLocomotion = () => {
    mixer.update(0);
  };

  return {
    mixer,
    attackMixer,
    stride,
    playAttack(clip) {
      if (attack) attack.stop();
      attack = attackMixer.clipAction(clip);
      attack.setLoop(THREE.LoopOnce, 1);
      attack.clampWhenFinished = true;
      attack.paused = true;
      attack.enabled = true;
      attack.weight = 1;
      attack.time = 0;
      attack.play();
    },
    stopAttack() {
      if (!attack) return;
      attack.stop();
      attack = null;
      // Stopping restores the attack mixer's bind snapshot. Put the walk back.
      applyLocomotion();
    },
    setAttackTime(time) {
      if (!attack) return;
      attack.time = time;
    },
    setLocomotion(nextIdle, nextWalk) {
      if (nextIdle === idleClip && nextWalk === walkClip) return;
      const idleN = idleClip.duration > 0 ? idle.time / idleClip.duration : 0;
      const walkN = walkClip.duration > 0 ? walk.time / walkClip.duration : 0;
      const iw = idle.weight;
      const ww = walk.weight;
      idle.stop();
      walk.stop();
      mixer.uncacheAction(idleClip);
      mixer.uncacheAction(walkClip);
      idleClip = nextIdle;
      walkClip = nextWalk;
      idle = mixer.clipAction(idleClip);
      walk = mixer.clipAction(walkClip);
      idle.play();
      walk.play();
      idle.paused = true;
      walk.paused = true;
      idle.weight = iw;
      walk.weight = ww;
      idle.time = (idleN % 1) * idleClip.duration;
      walk.time = (walkN % 1) * walkClip.duration;
      idleTime = idle.time;
      walkTime = walkN % 1;
    },
    getWalkPhase() {
      return walkTime;
    },
    update(dt, distance, moving, reduced) {
      const target = moving ? 1 : 0;
      blend += (target - blend) * Math.min(1, dt * 10);
      if (!moving && blend < 0.02) blend = 0;
      if (moving && blend > 0.98) blend = 1;
      if (moving) {
        walkTime = (walkTime + distance / Math.max(0.001, stride)) % 1;
        walk.time = walkTime * walkClip.duration;
      }
      if (!reduced) idleTime += dt;
      idleTime %= idleClip.duration;
      idle.time = idleTime;
      walk.weight = blend;
      idle.weight = 1 - blend;
      applyLocomotion();
      if (attack) attackMixer.update(0);
    },
  };
}

export function assertGait(): void {
  const idle = makeHumanoidClip("Idle");
  const walk = makeHumanoidClip("Walk");
  const hareIdle = makeHareClip("Idle");
  const hareWalk = makeHareClip("Walk");
  for (const clip of [idle, walk, hareIdle, hareWalk]) {
    const frames = Math.round(clip.duration * CLIP_FPS);
    if (clip.duration !== frames / CLIP_FPS) throw new Error(`${clip.name} duration`);
    for (const track of clip.tracks) {
      const size = track.getValueSize();
      const n = track.times.length;
      if (n !== frames + 1) throw new Error(`${clip.name} ${track.name} keys`);
      for (let i = 0; i < size; i++) {
        const a = track.values[i];
        const b = track.values[(n - 1) * size + i];
        if (Math.abs(a - b) > 1e-5) throw new Error(`${clip.name} ${track.name} loop`);
      }
    }
  }
  if (idle.name !== "Idle" || walk.name !== "Walk") throw new Error("clip names");
  let prevZ = Infinity;
  for (let i = 0; i <= 12; i++) {
    const pose = humanWalk(i / 24);
    const hip = pose.upperLegR.x;
    const sole = pose.hipsP.y - 0.02 - LEG * Math.cos(hip) - 0.08;
    if (Math.abs(sole - 0.02) > 0.015) throw new Error(`plant ${sole.toFixed(3)}`);
    const z = -LEG * Math.sin(hip);
    if (z > prevZ + 1e-4) throw new Error("stance foot slid forward");
    prevZ = z;
  }
  const atk = makeSwordAttack("chop", 1, 231);
  if (atk.name !== "Attack" || atk.duration > 0.6 + 1e-6) throw new Error("attack timing");
  const dbl = makeSwordAttack("cut", 2, 231);
  if (dbl.duration > atk.duration + 1e-6) throw new Error("double should not run longer");
  for (const name of ["Fast Blade", "Burning Blade", "Red Lotus Blade", "Flat Blade", "Shining Blade", "Seraph Blade", "Circle Blade", "Spirits Within", "Vorpal Blade", "Savage Blade"]) {
    const clip = makeSwordSkillClip(name);
    if (!clip || clip.duration <= 0 || clip.tracks.length < 4) throw new Error(`${name} animation`);
  }
  const vorpal = makeSwordSkillClip("Vorpal Blade");
  const flat = makeSwordSkillClip("Flat Blade");
  if (!vorpal || !flat || vorpal.duration <= flat.duration) throw new Error("Vorpal should run longer");
  if (makeSwordSkillClip("Not a skill") !== null) throw new Error("a skill without a motion must not borrow one");
  for (const name of ["Raging Axe", "Smash Axe", "Gale Axe", "Avalanche Axe", "Spinning Axe", "Rampage", "Calamity", "Mistral Axe", "Decimation", "Bora Axe"]) {
    const clip = makeAxeSkillClip(name);
    if (!clip || clip.duration <= 0 || clip.tracks.length < 4) throw new Error(`${name} animation`);
  }
  const rampage = makeAxeSkillClip("Rampage");
  const raging = makeAxeSkillClip("Raging Axe");
  if (!rampage || !raging || rampage.duration <= raging.duration) throw new Error("Rampage should run longer");
  if (makeAxeSkillClip("Onslaught") !== null) throw new Error("an axe skill without a motion must not borrow one");
  for (const name of ["Shining Strike", "Seraph Strike", "Brainshaker", "Starlight", "Moonlight", "Skullbreaker", "True Strike", "Judgment", "Black Halo", "Hexa Strike"]) {
    const clip = makeClubSkillClip(name);
    if (!clip || clip.duration <= 0 || clip.tracks.length < 4) throw new Error(`${name} animation`);
  }
  const judgment = makeClubSkillClip("Judgment");
  const trueStrike = makeClubSkillClip("True Strike");
  const halo = makeClubSkillClip("Black Halo");
  const shining = makeClubSkillClip("Shining Strike");
  const hexa = makeClubSkillClip("Hexa Strike");
  if (!judgment || !trueStrike || judgment.duration <= trueStrike.duration) throw new Error("Judgment should run longer than True Strike");
  if (!halo || !shining || halo.duration <= shining.duration) throw new Error("Black Halo should run longer than Shining Strike");
  if (!hexa || !halo || hexa.duration <= halo.duration) throw new Error("Hexa Strike should run longer than Black Halo");
  if (makeClubSkillClip("Flash Nova") !== null) throw new Error("a club skill without a motion must not borrow one");
  const bite = makeHareClip("Attack");
  for (const name of ["Foot Kick", "Whirl Claws", "Dust Cloud", "Wild Carrot"] as const) {
    const clip = makeHareClip(name);
    if (clip.name !== name || clip.duration <= bite.duration || clip.tracks.length < 8) throw new Error(`${name} animation`);
    if (!clip.tracks.some((track) => track.name === "upperLegR.quaternion")) throw new Error(`${name} should move the hind legs`);
    if (!clip.tracks.some((track) => track.name === "earL.quaternion")) throw new Error(`${name} ears`);
  }
  const kick = makeHareClip("Foot Kick");
  const whirl = makeHareClip("Whirl Claws");
  const dust = makeHareClip("Dust Cloud");
  const carrot = makeHareClip("Wild Carrot");
  const legAt = (clip: THREE.AnimationClip) => {
    const track = clip.tracks.find((row) => row.name === "upperLegR.quaternion");
    if (!track) throw new Error(`${clip.name} legs`);
    const mid = Math.floor(track.times.length / 2) * track.getValueSize();
    return track.values[mid] ?? 0;
  };
  const legs = [legAt(kick), legAt(whirl), legAt(dust), legAt(carrot)];
  for (let i = 0; i < legs.length; i++) {
    for (let j = i + 1; j < legs.length; j++) {
      if (Math.abs(legs[i] - legs[j]) < 1e-4) throw new Error("rarab moves must not share a pose");
    }
  }
}
