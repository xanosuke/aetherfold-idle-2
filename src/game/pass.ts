/**
 * Ranguemont Pass. One retail floor, the tunnel under the Northern Wall.
 * Column 0 is A, row 0 is 1, each cell 48 yalms, north is -Z.
 * The atlas, not the wiki labels, places the mouths:
 *   East Ronfaure comes in at F-12 and leaves the same way.
 *   Beaucedine Glacier is the east tip at K-3. That door is open.
 * The door ring at D-8 / D-9 / E-8 / E-9 only circulates.
 *   The E-9 door lets you north, into the deep tunnel.
 *   The D-9 door lets you east, back to the entrance.
 * Waters of Oblivion sit in the D-4 dead end. The strange apparatus
 * stands in the E-4 neck beside the pool. The monster list lives with the
 * other field rosters.
 */

import { EAST_MOUTH } from "./east-ronfaure";
import { GLACIER_ARRIVE, inGlacier } from "./glacier";

export const PASS_CELL = 48;
const PASS_X = 80;
const PASS_Z = -470;

export type PassRect = { minX: number; maxX: number; minZ: number; maxZ: number };

export type PassGate = {
  id: string;
  name: string;
  x: number;
  z: number;
  hx: number;
  hz: number;
  to: "ranguemont" | "east-ronfaure" | "beaucedine" | "closed";
  side: "n" | "s" | "e" | "w";
  arrive?: { x: number; z: number; yaw: number; log: string };
  retreat?: { x: number; z: number };
};

export type PassDoor = {
  axis: "x" | "z";
  /** +1 allows increasing axis. -1 allows decreasing (north, on z). */
  dir: 1 | -1;
  at: number;
  min: number;
  max: number;
};

type Add = (color: number, w: number, h: number, d: number, x: number, y: number, z: number) => void;
type Solid = { minX: number; maxX: number; minZ: number; maxZ: number };

function span(c0: number, r0: number, c1: number, r1: number): PassRect {
  return {
    minX: PASS_X + Math.min(c0, c1) * PASS_CELL,
    maxX: PASS_X + Math.max(c0, c1) * PASS_CELL,
    minZ: PASS_Z + Math.min(r0, r1) * PASS_CELL,
    maxZ: PASS_Z + Math.max(r0, r1) * PASS_CELL,
  };
}

function mid(rect: PassRect) {
  return { x: (rect.minX + rect.maxX) / 2, z: (rect.minZ + rect.maxZ) / 2 };
}

function cell(c: number, r: number) {
  return { x: PASS_X + c * PASS_CELL, z: PASS_Z + r * PASS_CELL };
}

const mouth = span(5.3, 11.08, 5.7, 12);
const f11 = span(5.34, 10.05, 5.66, 11.28);
const f10 = span(5.12, 9.05, 5.88, 10.28);
const f9 = span(5.2, 8.48, 5.62, 9.28);
const toLoop = span(4.55, 8.42, 5.4, 8.78);
const e9 = span(4.15, 8.15, 4.85, 8.85);
const enterNeck = span(4.38, 7.62, 4.62, 8.32);
const e8 = span(4.15, 7.15, 4.85, 7.85);
const linkDE = span(3.62, 7.38, 4.38, 7.62);
const d8 = span(3.15, 7.15, 3.85, 7.85);
const linkNS = span(3.38, 7.62, 3.62, 8.38);
const d9 = span(3.15, 8.15, 3.85, 8.85);
const exitNeck = span(3.62, 8.38, 4.32, 8.62);
const d7 = span(3.36, 6.15, 3.64, 7.38);
const d6 = span(3.36, 5.15, 3.64, 6.38);
const d5 = span(3.38, 3.95, 3.62, 5.35);
const pool = span(2.95, 3.12, 4.05, 4.22);
const e4 = span(3.85, 3.55, 4.55, 4.05);
const e5 = span(3.42, 4.32, 4.72, 4.68);
const e6 = span(4.35, 4.5, 4.72, 5.7);
const f5 = span(4.5, 4.32, 5.7, 4.68);
const f6 = span(5.32, 4.5, 5.68, 5.72);
const g6 = span(5.48, 5.32, 6.68, 5.68);
const elbow = span(6.45, 4.7, 6.85, 5.55);
const h5 = span(6.62, 4.28, 7.55, 5.05);
const h4 = span(7.32, 3.35, 7.68, 4.55);
const i4 = span(7.48, 3.32, 8.55, 3.68);
const i3 = span(8.32, 2.35, 8.68, 3.55);
const j3 = span(8.48, 2.32, 10.05, 2.68);
const k3 = span(9.82, 2.12, 10.62, 2.88);
const k4 = span(10.05, 2.65, 10.48, 3.45);
const f8 = span(4.62, 7.32, 5.68, 7.68);
const g8 = span(5.45, 7.12, 7.05, 7.98);
const g9 = span(6.15, 7.75, 6.75, 8.45);
const h8 = span(6.82, 7.22, 8.05, 7.82);
const i8 = span(7.82, 7.48, 8.42, 8.12);
const g7 = span(5.85, 5.48, 6.35, 7.35);
const f7 = span(5.15, 5.95, 6.15, 6.48);

const ROOMS: PassRect[] = [
  mouth, f11, f10, f9, toLoop, e9, enterNeck, e8, linkDE, d8, linkNS, d9, exitNeck,
  d7, d6, d5, pool, e4, e5, e6, f5, f6, g6, elbow, h5, h4, i4, i3, j3, k3, k4,
  f8, g8, g9, h8, i8, g7, f7,
];

const WATER: PassRect = {
  minX: PASS_X + 3.12 * PASS_CELL,
  maxX: PASS_X + 3.8 * PASS_CELL,
  minZ: PASS_Z + 3.22 * PASS_CELL,
  maxZ: PASS_Z + 3.82 * PASS_CELL,
};

const mouthStand = cell(5.5, 11.72);
const glacierStand = cell(10.28, 2.5);

export const PASS_ARRIVE = { ...mouthStand, yaw: 0, log: "Ranguemont Pass." };
export const PASS_FROM_GLACIER = { ...glacierStand, yaw: Math.PI / 2, log: "Ranguemont Pass." };

export const PASS_NPCS = {
  perchond: {
    ...cell(5.28, 9.42),
    line: "Perchond: The north door lets you deeper in. It will not let you back.",
  },
  myffore: {
    ...cell(5.72, 9.55),
    line: "Myffore: The west door lets you out to East Ronfaure. The east end of the tunnel is Beaucedine Glacier.",
  },
};

const TOMES = [cell(5.4, 10.55), mid(g8), mid(k4)];

export const PASS_GATES: readonly PassGate[] = [
  {
    id: "pass-east",
    name: "East Ronfaure",
    x: cell(5.5, 11.95).x,
    z: cell(5.5, 11.95).z,
    hx: 5.4,
    hz: 2.1,
    to: "east-ronfaure",
    side: "s",
    arrive: { ...EAST_MOUTH.ranguemont.retreat, yaw: 0, log: "East Ronfaure." },
  },
  {
    id: "pass-beaucedine",
    name: "Beaucedine Glacier",
    x: cell(10.56, 2.5).x,
    z: cell(10.56, 2.5).z,
    hx: 2.2,
    hz: 5.2,
    to: "beaucedine",
    side: "e",
    arrive: GLACIER_ARRIVE,
  },
];

/** E-9 enter door faces north. D-9 exit door faces east. */
export const PASS_DOORS: readonly PassDoor[] = [
  {
    axis: "z",
    dir: -1,
    at: PASS_Z + 8 * PASS_CELL,
    min: enterNeck.minX - 1.2,
    max: enterNeck.maxX + 1.2,
  },
  {
    axis: "x",
    dir: 1,
    at: PASS_X + 4 * PASS_CELL,
    min: exitNeck.minZ - 1.2,
    max: exitNeck.maxZ + 1.2,
  },
];

export const PASS_PLACES = [
  { name: "Waters of Oblivion", ...mid(pool) },
  { name: "Strange Apparatus", ...mid(e4) },
];

function hit(x: number, z: number, radius: number): boolean {
  return ROOMS.some((rect) => x >= rect.minX + radius && x <= rect.maxX - radius && z >= rect.minZ + radius && z <= rect.maxZ - radius);
}

export function passWet(x: number, z: number): boolean {
  return x >= WATER.minX && x <= WATER.maxX && z >= WATER.minZ && z <= WATER.maxZ;
}

export function inPass(x: number, z: number, radius = 0): boolean {
  return hit(x, z, Math.max(0, radius));
}

function rectDist(x: number, z: number, rect: PassRect): number {
  const cx = Math.max(rect.minX, Math.min(rect.maxX, x));
  const cz = Math.max(rect.minZ, Math.min(rect.maxZ, z));
  return Math.hypot(x - cx, z - cz);
}

export function clampPass(x: number, z: number, radius = 0): { x: number; z: number } | null {
  const r = Math.max(0, radius);
  let best: PassRect | null = null;
  let bestD = Infinity;
  for (const rect of ROOMS) {
    const dist = rectDist(x, z, rect);
    if (dist < bestD) {
      bestD = dist;
      best = rect;
    }
  }
  if (!best || bestD > 36) return null;
  const insetX = Math.min(r, Math.max(0, (best.maxX - best.minX) / 2 - 0.05));
  const insetZ = Math.min(r, Math.max(0, (best.maxZ - best.minZ) / 2 - 0.05));
  return {
    x: Math.max(best.minX + insetX, Math.min(best.maxX - insetX, x)),
    z: Math.max(best.minZ + insetZ, Math.min(best.maxZ - insetZ, z)),
  };
}

export function passSquare(x: number, z: number): string {
  const col = Math.floor((x - PASS_X) / PASS_CELL);
  const row = Math.floor((z - PASS_Z) / PASS_CELL);
  const letter = "ABCDEFGHIJKLMNO"[col] ?? "?";
  return `${letter}-${row + 1}`;
}

export function passChart(_x: number, _z: number) {
  let minX = Infinity;
  let maxX = -Infinity;
  let minZ = Infinity;
  let maxZ = -Infinity;
  for (const rect of ROOMS) {
    minX = Math.min(minX, rect.minX);
    maxX = Math.max(maxX, rect.maxX);
    minZ = Math.min(minZ, rect.minZ);
    maxZ = Math.max(maxZ, rect.maxZ);
  }
  const pad = 22;
  const marks = [
    ...PASS_GATES.map((gate) => ({ x: gate.x, z: gate.z, name: gate.name })),
    ...PASS_PLACES,
  ];
  return {
    rects: ROOMS,
    water: [WATER],
    bounds: { minX: minX - pad, maxX: maxX + pad, minZ: minZ - pad, maxZ: maxZ + pad },
    marks,
    grid: { x0: PASS_X, z0: PASS_Z, cell: PASS_CELL },
  };
}

/** True when this step crosses a one-way door against its arrow. */
export function oneWayBlocks(x0: number, z0: number, x1: number, z1: number): boolean {
  for (const door of PASS_DOORS) {
    const a0 = door.axis === "x" ? x0 : z0;
    const a1 = door.axis === "x" ? x1 : z1;
    const c0 = door.axis === "x" ? z0 : x0;
    const c1 = door.axis === "x" ? z1 : x1;
    const delta = a1 - a0;
    if (door.dir === 1 && delta >= -0.001) continue;
    if (door.dir === -1 && delta <= 0.001) continue;
    const lo = Math.min(a0, a1);
    const hi = Math.max(a0, a1);
    if (hi < door.at || lo > door.at) continue;
    const cross = delta === 0 ? c0 : c0 + (c1 - c0) * ((door.at - a0) / delta);
    if (cross < door.min || cross > door.max) continue;
    return true;
  }
  return false;
}

function opening(a: PassRect, b: PassRect): number {
  const w = Math.min(a.maxX, b.maxX) - Math.max(a.minX, b.minX);
  const d = Math.min(a.maxZ, b.maxZ) - Math.max(a.minZ, b.minZ);
  if (w < 7 || d < 7) return 0;
  return Math.min(w, d);
}

function floodMiss(start: PassRect): string {
  const seen = new Set<PassRect>([start]);
  const queue = [start];
  while (queue.length) {
    const cur = queue.pop();
    if (!cur) break;
    for (const next of ROOMS) {
      if (seen.has(next) || opening(cur, next) < 7) continue;
      seen.add(next);
      queue.push(next);
    }
  }
  return ROOMS.filter((rect) => !seen.has(rect))
    .map((rect) => passSquare(mid(rect).x, mid(rect).z))
    .join(",");
}

function overlaps(a: PassRect, b: PassRect): boolean {
  return a.minX < b.maxX - 0.15 && a.maxX > b.minX + 0.15 && a.minZ < b.maxZ - 0.15 && a.maxZ > b.minZ + 0.15;
}

export function assertPass(): void {
  if (PASS_CELL !== 48) throw new Error("pass cell");
  const squareOf = (rect: PassRect) => passSquare(mid(rect).x, mid(rect).z);
  const expect: [PassRect, string][] = [
    [mouth, "F-12"],
    [f11, "F-11"],
    [f10, "F-10"],
    [e9, "E-9"],
    [e8, "E-8"],
    [d9, "D-9"],
    [d8, "D-8"],
    [pool, "D-4"],
    [e4, "E-4"],
    [g8, "G-8"],
    [h8, "H-8"],
    [k3, "K-3"],
    [k4, "K-4"],
    [f7, "F-7"],
    [g7, "G-7"],
    [i3, "I-3"],
    [j3, "J-3"],
  ];
  for (const [rect, name] of expect) {
    const got = squareOf(rect);
    if (got !== name) throw new Error(`${name} is ${got}`);
  }
  if (passSquare(PASS_ARRIVE.x, PASS_ARRIVE.z) !== "F-12") throw new Error("arrival square");
  if (passSquare(glacierStand.x, glacierStand.z) !== "K-3") throw new Error("glacier stand");
  if (passSquare(PASS_FROM_GLACIER.x, PASS_FROM_GLACIER.z) !== "K-3") throw new Error("glacier return square");
  if (!inPass(PASS_FROM_GLACIER.x, PASS_FROM_GLACIER.z, 0.36)) throw new Error("return from the glacier");
  if (passSquare(TOMES[0].x, TOMES[0].z) !== "F-11") throw new Error("entrance tome");
  if (passSquare(TOMES[1].x, TOMES[1].z) !== "G-8") throw new Error("mid tome");
  if (passSquare(TOMES[2].x, TOMES[2].z) !== "K-4") throw new Error("glacier tome");
  if (!inPass(PASS_ARRIVE.x, PASS_ARRIVE.z, 0.36)) throw new Error("arrival stand");
  if (!inPass(PASS_NPCS.perchond.x, PASS_NPCS.perchond.z, 0.4) || !inPass(PASS_NPCS.myffore.x, PASS_NPCS.myffore.z, 0.4)) {
    throw new Error("entrance npc");
  }
  if (!inPass(mid(pool).x, pool.maxZ - 4, 0.36)) throw new Error("pool lip");
  if (mid(pool).x >= WATER.minX && mid(pool).x <= WATER.maxX && pool.maxZ - 4 >= WATER.minZ && pool.maxZ - 4 <= WATER.maxZ) {
    throw new Error("pool lip is water");
  }
  if (!inPass((WATER.minX + WATER.maxX) / 2, (WATER.minZ + WATER.maxZ) / 2, 0)) throw new Error("pool water left the room");
  const miss = floodMiss(mouth);
  if (miss) throw new Error(`pass is split ${miss}`);
  for (const rect of ROOMS) {
    if (rect.minX < -1860 || rect.maxX > 980 || rect.minZ < -490 || rect.maxZ > 1720) throw new Error("pass leaves the place box");
    if (rect.maxZ > 180 || rect.minX < 120) throw new Error("pass climbed into another zone");
    if (rect.maxX - rect.minX < 8 || rect.maxZ - rect.minZ < 8) throw new Error("pass neck is too tight");
  }
  if (overlaps(WATER, e4)) throw new Error("apparatus sits in the water");
  for (const gate of PASS_GATES) {
    if (!inPass(gate.x, gate.z, 0)) throw new Error(`${gate.id} left the pass`);
    const stand = gate.arrive ?? gate.retreat;
    if (!stand) throw new Error(`${gate.id} has no stand`);
    if (gate.to === "closed" && !inPass(stand.x, stand.z, 0.36)) throw new Error(`${gate.id} retreat`);
  }
  if (zoneOverlap(PASS_GATES[0], PASS_ARRIVE)) throw new Error("arrival stands on the east gate");
  if (zoneOverlap(PASS_GATES[1], glacierStand)) throw new Error("glacier retreat stands on the gate");
  const intoIce = PASS_GATES[1];
  if (intoIce.to !== "beaucedine" || !intoIce.arrive) throw new Error("beaucedine door");
  if (inPass(intoIce.arrive.x, intoIce.arrive.z) || !inGlacier(intoIce.arrive.x, intoIce.arrive.z, 0.36)) throw new Error("beaucedine arrival");
  if (oneWayBlocks(mid(e9).x, mid(e9).z, mid(e8).x, mid(e8).z)) throw new Error("enter door blocks the way in");
  if (!oneWayBlocks(mid(e8).x, mid(e8).z, mid(e9).x, mid(e9).z)) throw new Error("enter door lets you back out");
  if (oneWayBlocks(mid(d9).x, mid(d9).z, mid(e9).x, mid(e9).z)) throw new Error("exit door blocks the way out");
  if (!oneWayBlocks(mid(e9).x, mid(e9).z, mid(d9).x, mid(d9).z)) throw new Error("exit door lets you in");
  if (clampPass(EAST_MOUTH.ranguemont.x, EAST_MOUTH.ranguemont.z, 0)) throw new Error("pass clamp reaches East Ronfaure");
  if (clampPass(0, 0, 0) || clampPass(-8, -400, 0)) throw new Error("pass clamp reaches the city");
}

function zoneOverlap(gate: { x: number; z: number; hx: number; hz: number }, stand: { x: number; z: number }): boolean {
  return Math.abs(stand.x - gate.x) <= gate.hx && Math.abs(stand.z - gate.z) <= gate.hz;
}

function floorSlab(add: Add, rect: PassRect, color: number, lift = 0) {
  add(color, rect.maxX - rect.minX, 0.16, rect.maxZ - rect.minZ, (rect.minX + rect.maxX) / 2, -0.1 + lift, (rect.minZ + rect.maxZ) / 2);
}

function mergeSpans(spans: [number, number][]): [number, number][] {
  if (!spans.length) return [];
  const sorted = spans.slice().sort((a, b) => a[0] - b[0]);
  const out: [number, number][] = [[sorted[0][0], sorted[0][1]]];
  for (let i = 1; i < sorted.length; i++) {
    const last = out[out.length - 1];
    if (sorted[i][0] <= last[1] + 0.4) last[1] = Math.max(last[1], sorted[i][1]);
    else out.push([sorted[i][0], sorted[i][1]]);
  }
  return out;
}

function cutSpans(full: [number, number], cuts: [number, number][]): [number, number][] {
  let open: [number, number][] = [full];
  for (const [c0, c1] of cuts) {
    const next: [number, number][] = [];
    for (const [a, b] of open) {
      if (c1 <= a + 0.05 || c0 >= b - 0.05) {
        next.push([a, b]);
        continue;
      }
      if (c0 > a + 0.7) next.push([a, c0]);
      if (c1 < b - 0.7) next.push([c1, b]);
    }
    open = next;
  }
  return open;
}

function stoneWalls(add: Add, colliders: Solid[], rects: PassRect[], gates: readonly PassGate[]) {
  const rock = 0x5c6772;
  const rockDark = 0x454e58;
  const tall = 6.4;
  const thick = 2.2;
  const sides = ["n", "s", "e", "w"] as const;
  for (const rect of rects) {
    for (const side of sides) {
      const horizontal = side === "n" || side === "s";
      const edge = side === "n" ? rect.minZ : side === "s" ? rect.maxZ : side === "w" ? rect.minX : rect.maxX;
      const full: [number, number] = horizontal ? [rect.minX, rect.maxX] : [rect.minZ, rect.maxZ];
      const covered: [number, number][] = [];
      for (const other of rects) {
        if (other === rect) continue;
        let near = false;
        if (side === "n") near = other.minZ < edge - 0.15 && other.maxZ > edge - 0.25;
        else if (side === "s") near = other.maxZ > edge + 0.15 && other.minZ < edge + 0.25;
        else if (side === "w") near = other.minX < edge - 0.15 && other.maxX > edge - 0.25;
        else near = other.minX < edge + 0.25 && other.maxX > edge + 0.15;
        if (!near) continue;
        const a = Math.max(full[0], horizontal ? other.minX : other.minZ);
        const b = Math.min(full[1], horizontal ? other.maxX : other.maxZ);
        if (b - a > 0.25) covered.push([a, b]);
      }
      const cuts = mergeSpans(covered);
      for (const gate of gates) {
        if (gate.side !== side) continue;
        const along = horizontal ? gate.x : gate.z;
        const across = horizontal ? Math.abs(gate.z - edge) : Math.abs(gate.x - edge);
        if (across > 4.2 || along < full[0] - 2 || along > full[1] + 2) continue;
        cuts.push([along - 4.2, along + 4.2]);
      }
      const outward = side === "n" || side === "w" ? -1 : 1;
      for (const piece of cutSpans(full, cuts)) {
        let a = piece[0];
        let b = piece[1];
        if (b - a < 1) continue;
        if (Math.abs(a - full[0]) < 0.35) a -= thick * 0.85;
        if (Math.abs(b - full[1]) < 0.35) b += thick * 0.85;
        const len = b - a;
        const midA = (a + b) / 2;
        const acrossC = edge + outward * (thick / 2);
        const cx = horizontal ? midA : acrossC;
        const cz = horizontal ? acrossC : midA;
        const w = horizontal ? len : thick;
        const d = horizontal ? thick : len;
        add(rock, w, tall, d, cx, tall / 2 - 0.1, cz);
        colliders.push({ minX: cx - w / 2, maxX: cx + w / 2, minZ: cz - d / 2, maxZ: cz + d / 2 });
        add(rockDark, horizontal ? len : thick + 0.45, 1.35, horizontal ? thick + 0.45 : len, cx, 0.55, cz);
      }
    }
  }
}

function pillar(add: Add, colliders: Solid[], x: number, z: number, color: number) {
  add(color, 1.05, 4.4, 1.05, x, 2.2, z);
  add(0xc5cdd6, 1.35, 0.28, 1.35, x, 4.35, z);
  colliders.push({ minX: x - 0.7, maxX: x + 0.7, minZ: z - 0.7, maxZ: z + 0.7 });
}

function book(add: Add, x: number, z: number) {
  add(0xf3e6d0, 0.7, 0.16, 0.9, x, 0.2, z);
  add(0x3d4a32, 0.16, 0.22, 0.7, x, 0.28, z);
}

function torch(add: Add, x: number, z: number) {
  add(0x2a3138, 0.28, 1.5, 0.28, x, 0.75, z);
  add(0xe3c57a, 0.22, 0.28, 0.22, x, 1.6, z);
}

function door(add: Add, colliders: Solid[], x: number, z: number, axis: "x" | "z") {
  const rock = 0x5c6772;
  const wood = 0x8a4e2c;
  const gap = 1.85;
  const jamb = 0.62;
  if (axis === "z") {
    for (const sign of [-1, 1]) {
      const jx = x + sign * (gap + jamb / 2);
      add(rock, jamb, 3.5, 0.7, jx, 1.75, z);
      colliders.push({ minX: jx - jamb / 2, maxX: jx + jamb / 2, minZ: z - 0.38, maxZ: z + 0.38 });
    }
    add(rock, gap * 2 + jamb * 2, 0.42, 0.7, x, 3.45, z);
    add(0xc47b3a, gap * 2 + 0.4, 0.18, 0.28, x, 3.15, z);
    add(wood, 0.22, 2.7, 1.35, x - gap + 0.2, 1.45, z);
    return;
  }
  for (const sign of [-1, 1]) {
    const jz = z + sign * (gap + jamb / 2);
    add(rock, 0.7, 3.5, jamb, x, 1.75, jz);
    colliders.push({ minX: x - 0.38, maxX: x + 0.38, minZ: jz - jamb / 2, maxZ: jz + jamb / 2 });
  }
  add(rock, 0.7, 0.42, gap * 2 + jamb * 2, x, 3.45, z);
  add(0xc47b3a, 0.28, 0.18, gap * 2 + 0.4, x, 3.15, z);
  add(wood, 1.35, 2.7, 0.22, x, 1.45, z - gap + 0.2);
}

export function buildPass(add: Add, colliders: Solid[]): void {
  const stone = 0x6a7580;
  ROOMS.forEach((rect, i) => floorSlab(add, rect, stone, i * 0.001));
  floorSlab(add, WATER, 0x2f8faf, 0.08);
  colliders.push({ minX: WATER.minX, maxX: WATER.maxX, minZ: WATER.minZ, maxZ: WATER.maxZ });
  stoneWalls(add, colliders, ROOMS, PASS_GATES);
  const enter = PASS_DOORS[0];
  const exit = PASS_DOORS[1];
  door(add, colliders, (enter.min + enter.max) / 2, enter.at, "z");
  door(add, colliders, exit.at, (exit.min + exit.max) / 2, "x");
  const rig = mid(e4);
  pillar(add, colliders, rig.x + 6, rig.z - 3.2, 0x6a5830);
  pillar(add, colliders, rig.x + 6, rig.z, 0x20c8c0);
  pillar(add, colliders, rig.x + 6, rig.z + 3.2, 0x3a3058);
  for (const tome of TOMES) book(add, tome.x, tome.z);
  const print = cell(5.56, 10.32);
  add(0x241c14, 0.85, 0.05, 1.25, print.x, 0.04, print.z);
  torch(add, mouth.minX + 1.6, mouth.maxZ - 6);
  torch(add, f10.maxX - 1.6, f10.minZ + 1.8);
  torch(add, e9.maxX - 1.5, e9.maxZ - 1.5);
  torch(add, d8.minX + 1.5, d8.minZ + 1.5);
  torch(add, pool.maxX - 2.2, pool.maxZ - 2.2);
  torch(add, g8.maxX - 2, g8.minZ + 2);
  torch(add, k3.minX + 2.4, k3.minZ + 2);
}
