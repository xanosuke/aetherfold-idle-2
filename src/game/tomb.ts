/**
 * King Ranperre's Tomb. Three retail floors.
 * Column 0 is A, row 0 is 1, each cell 48 yalms, north is -Z.
 *   Upper floor (map 1) — East Ronfaure in at G-5 (the H-11 door), one-way
 *     out at I-5 to East Ronfaure J-11, Jugner Forest shut at K-5, the king's
 *     sarcophagus at H-10. Two stairs drop to the lower crypts.
 *   Lower crypts — BG-Wiki's map 3. Stair from the entrance, stair from the
 *     west hall, a cross room, and Vrtra's hollow at K-9. The hollow is empty.
 *   Apparatus wing — BG-Wiki's map 2, E-7 / E-8. Three strange apparatuses.
 * The J-11 door in the wood stays one-way: the tomb can drop you there,
 * and the wood cannot walk back in.
 */

import { EAST_MOUTH } from "./east-ronfaure";
import { squareOf, ZONE_GRIDS, type ZoneGrid } from "./zone-grid";

export const TOMB_CELL = 48;

const M1X = 300;
const M1Z = 900;
const M2X = -820;
const M2Z = 900;
const M3X = 40;
const M3Z = 1320;

export type TombRect = { minX: number; maxX: number; minZ: number; maxZ: number };

export type TombGate = {
  id: string;
  name: string;
  x: number;
  z: number;
  hx: number;
  hz: number;
  to: "ranperre" | "east-ronfaure" | "closed";
  side: "n" | "s" | "e" | "w" | "floor";
  arrive?: { x: number; z: number; yaw: number; log: string };
  retreat?: { x: number; z: number };
};

type Add = (color: number, w: number, h: number, d: number, x: number, y: number, z: number) => void;
type Solid = { minX: number; maxX: number; minZ: number; maxZ: number };

function span(ox: number, oz: number, c0: number, r0: number, c1: number, r1: number): TombRect {
  return {
    minX: ox + Math.min(c0, c1) * TOMB_CELL,
    maxX: ox + Math.max(c0, c1) * TOMB_CELL,
    minZ: oz + Math.min(r0, r1) * TOMB_CELL,
    maxZ: oz + Math.max(r0, r1) * TOMB_CELL,
  };
}

function mid(rect: TombRect) {
  return { x: (rect.minX + rect.maxX) / 2, z: (rect.minZ + rect.maxZ) / 2 };
}

function pocket(rect: TombRect, side: "n" | "s" | "e" | "w", inset: number) {
  const c = mid(rect);
  if (side === "n") return { x: c.x, z: rect.minZ + inset };
  if (side === "s") return { x: c.x, z: rect.maxZ - inset };
  if (side === "w") return { x: rect.minX + inset, z: c.z };
  return { x: rect.maxX - inset, z: c.z };
}

const foyer = span(M1X, M1Z, 6.22, 4.36, 6.78, 4.94);
const fromDoor = span(M1X, M1Z, 6.36, 4.7, 6.64, 5.78);
const stairA1Alcove = span(M1X, M1Z, 6.36, 5.22, 7.02, 5.62);
const elbow = span(M1X, M1Z, 5.88, 5.46, 6.64, 5.84);
const westDown = span(M1X, M1Z, 5.68, 5.64, 6.08, 6.58);
const loopBottom = span(M1X, M1Z, 5.48, 6.36, 6.98, 6.74);
const loopBack = span(M1X, M1Z, 6.58, 6.02, 6.98, 6.52);
const stairB1Alcove = span(M1X, M1Z, 5.18, 6.52, 5.68, 7.28);
const junction = span(M1X, M1Z, 6.68, 6.12, 7.52, 6.96);
const toExit = span(M1X, M1Z, 7.12, 5.02, 7.5, 6.32);
const exitNeck = span(M1X, M1Z, 7.32, 4.52, 8.28, 5.42);
const exitRoom = span(M1X, M1Z, 8.02, 4.26, 8.64, 4.9);
const toPillar = span(M1X, M1Z, 7.7, 5.18, 8.98, 5.56);
const pillarN = span(M1X, M1Z, 8.8, 4.98, 9.6, 5.8);
const toJugner = span(M1X, M1Z, 9.4, 4.68, 10.24, 5.14);
const jugner = span(M1X, M1Z, 10.06, 4.36, 10.7, 4.98);
const pillarDrop = span(M1X, M1Z, 9.02, 5.62, 9.4, 6.98);
const pillarS = span(M1X, M1Z, 8.76, 6.78, 9.58, 7.62);
const southRun = span(M1X, M1Z, 7.08, 6.74, 7.55, 8.28);
const toTome = span(M1X, M1Z, 7.28, 8.02, 8.02, 8.4);
const tomeSouth = span(M1X, M1Z, 7.68, 7.92, 8.5, 8.55);
const cryptHall = span(M1X, M1Z, 6.9, 8.12, 8.4, 9.22);
const cryptL = span(M1X, M1Z, 6.78, 9.02, 7.8, 9.96);
const cryptR = span(M1X, M1Z, 7.5, 9.02, 8.52, 9.96);

const MAP1 = [
  foyer, fromDoor, stairA1Alcove, elbow, westDown, loopBottom, loopBack, stairB1Alcove,
  junction, toExit, exitNeck, exitRoom, toPillar, pillarN, toJugner, jugner,
  pillarDrop, pillarS, southRun, toTome, tomeSouth, cryptHall, cryptL, cryptR,
];

const upA = span(M2X, M2Z, 6.2, 6.08, 6.9, 6.92);
const wind = span(M2X, M2Z, 6.38, 6.68, 6.74, 7.46);
const toCrossN = span(M2X, M2Z, 6.52, 7.16, 7.38, 7.54);
const crossHall = span(M2X, M2Z, 6.98, 7.18, 7.82, 8.02);
const toWest = span(M2X, M2Z, 5.02, 7.38, 7.18, 7.8);
const west = span(M2X, M2Z, 4.08, 7.14, 5.22, 8.12);
const stairB2Alcove = span(M2X, M2Z, 4.32, 6.62, 4.96, 7.36);
const toDown = span(M2X, M2Z, 6.38, 7.78, 7.18, 8.76);
const down = span(M2X, M2Z, 6.18, 8.52, 6.92, 9.32);
const toEast = span(M2X, M2Z, 7.62, 7.38, 8.78, 7.8);
const eastBend = span(M2X, M2Z, 8.46, 7.55, 8.98, 8.28);
const eastRun = span(M2X, M2Z, 8.68, 7.98, 9.88, 8.4);
const vrtra = span(M2X, M2Z, 9.68, 7.9, 10.76, 8.92);

const MAP2 = [upA, wind, toCrossN, crossHall, toWest, west, stairB2Alcove, toDown, down, toEast, eastBend, eastRun, vrtra];

const gear = span(M3X, M3Z, 4.18, 6.08, 5.02, 6.92);
const neck = span(M3X, M3Z, 4.42, 6.68, 4.78, 7.38);
const deepStair = span(M3X, M3Z, 4.2, 7.14, 5.0, 7.92);

const MAP3 = [gear, neck, deepStair];

const FLOORS: { id: string; name: string; rects: TombRect[]; ox: number; oz: number }[] = [
  { id: "tomb-1", name: "King Ranperre's Tomb", rects: MAP1, ox: M1X, oz: M1Z },
  { id: "tomb-2", name: "King Ranperre's Tomb", rects: MAP2, ox: M2X, oz: M2Z },
  { id: "tomb-3", name: "King Ranperre's Tomb", rects: MAP3, ox: M3X, oz: M3Z },
];

function edgeGate(rect: TombRect, side: "n" | "s" | "e" | "w", inset: number) {
  const c = mid(rect);
  if (side === "n") return { x: c.x, z: rect.minZ + inset };
  if (side === "s") return { x: c.x, z: rect.maxZ - inset };
  if (side === "w") return { x: rect.minX + inset, z: c.z };
  return { x: rect.maxX - inset, z: c.z };
}

const foyerDoor = edgeGate(foyer, "n", 2.4);
const foyerStand = { x: mid(foyer).x, z: foyer.maxZ - 4.2 };
const exitDoor = edgeGate(exitRoom, "n", 2.4);
const jugnerDoor = edgeGate(jugner, "e", 2.6);
const jugnerStand = { x: jugner.minX + 4.2, z: mid(jugner).z };

const stairA1 = pocket(stairA1Alcove, "e", 3.4);
const stairA2 = pocket(upA, "n", 3.4);
const stairB1 = pocket(stairB1Alcove, "s", 3.4);
const stairB2 = pocket(stairB2Alcove, "n", 3.4);
const stairC2 = pocket(down, "s", 3.4);
const stairC3 = pocket(deepStair, "s", 3.4);

const upper = { x: foyerStand.x, z: foyerStand.z, yaw: Math.PI, log: "King Ranperre's Tomb." };
const lowerLog = "The lower crypts.";
const deepLog = "The deep crypt.";
const upperLog = "The upper tomb.";

const landA = { x: mid(upA).x, z: upA.maxZ - 5.2 };
const landABack = { x: mid(fromDoor).x, z: fromDoor.maxZ - 4.2 };
const landB = { x: mid(west).x, z: west.maxZ - 5 };
const landBBack = { x: mid(loopBottom).x, z: mid(loopBottom).z };
const landC = { x: mid(gear).x, z: mid(gear).z };
const landCBack = { x: mid(down).x, z: down.minZ + 5 };

export const TOMB_FOYER = upper;

export const TOMB_GATES: readonly TombGate[] = [
  {
    id: "tomb-east-in",
    name: "East Ronfaure",
    ...foyerDoor,
    hx: 5.1,
    hz: 2.3,
    to: "east-ronfaure",
    side: "n",
    arrive: { ...EAST_MOUTH.tombH.retreat, yaw: 0, log: "East Ronfaure." },
  },
  {
    id: "tomb-east-out",
    name: "East Ronfaure",
    ...exitDoor,
    hx: 5.1,
    hz: 2.3,
    to: "east-ronfaure",
    side: "n",
    arrive: { ...EAST_MOUTH.tombJ.retreat, yaw: 0, log: "East Ronfaure." },
  },
  {
    id: "tomb-jugner",
    name: "Jugner Forest",
    ...jugnerDoor,
    hx: 2.4,
    hz: 4.6,
    to: "closed",
    side: "e",
    retreat: jugnerStand,
  },
  {
    id: "tomb-stair-a-down",
    name: "Lower crypts",
    ...stairA1,
    hx: 2.6,
    hz: 3.4,
    to: "ranperre",
    side: "floor",
    arrive: { ...landA, yaw: Math.PI, log: lowerLog },
  },
  {
    id: "tomb-stair-a-up",
    name: "Upper tomb",
    ...stairA2,
    hx: 3.6,
    hz: 2.6,
    to: "ranperre",
    side: "floor",
    arrive: { ...landABack, yaw: 0, log: upperLog },
  },
  {
    id: "tomb-stair-b-down",
    name: "Lower crypts",
    ...stairB1,
    hx: 3.4,
    hz: 2.6,
    to: "ranperre",
    side: "floor",
    arrive: { ...landB, yaw: 0, log: lowerLog },
  },
  {
    id: "tomb-stair-b-up",
    name: "Upper tomb",
    ...stairB2,
    hx: 3.4,
    hz: 2.6,
    to: "ranperre",
    side: "floor",
    arrive: { ...landBBack, yaw: Math.PI, log: upperLog },
  },
  {
    id: "tomb-stair-c-down",
    name: "Deep crypt",
    ...stairC2,
    hx: 3.6,
    hz: 2.6,
    to: "ranperre",
    side: "floor",
    arrive: { ...landC, yaw: 0, log: deepLog },
  },
  {
    id: "tomb-stair-c-up",
    name: "Up",
    ...stairC3,
    hx: 3.6,
    hz: 2.6,
    to: "ranperre",
    side: "floor",
    arrive: { ...landCBack, yaw: 0, log: lowerLog },
  },
];

export const TOMB_HOLLOW = { x: mid(vrtra).x, z: mid(vrtra).z };

/** 1 upper tomb, 2 lower crypts, 3 apparatus wing. 0 is not the tomb. */
export function tombStory(x: number, z: number): 0 | 1 | 2 | 3 {
  const floor = floorAt(x, z, 0);
  if (!floor) return 0;
  if (floor.id === "tomb-1") return 1;
  if (floor.id === "tomb-2") return 2;
  return 3;
}

export const TOMB_PLACES = [
  { name: "Tomb", x: mid(cryptL).x, z: mid(cryptL).z },
  { name: "Vrtra's Hollow", x: mid(vrtra).x, z: mid(vrtra).z },
  { name: "Strange Apparatus", x: mid(gear).x, z: mid(gear).z },
];

function hit(rects: readonly TombRect[], x: number, z: number, radius: number): boolean {
  return rects.some((rect) => x >= rect.minX + radius && x <= rect.maxX - radius && z >= rect.minZ + radius && z <= rect.maxZ - radius);
}

function floorAt(x: number, z: number, radius: number) {
  return FLOORS.find((floor) => hit(floor.rects, x, z, radius)) ?? null;
}

export function inTomb(x: number, z: number, radius = 0): boolean {
  return floorAt(x, z, Math.max(0, radius)) != null;
}

function rectDist(x: number, z: number, rect: TombRect): number {
  const cx = Math.max(rect.minX, Math.min(rect.maxX, x));
  const cz = Math.max(rect.minZ, Math.min(rect.maxZ, z));
  return Math.hypot(x - cx, z - cz);
}

export function clampTomb(x: number, z: number, radius = 0): { x: number; z: number } | null {
  const r = Math.max(0, radius);
  let best: TombRect | null = null;
  let bestD = Infinity;
  for (const floor of FLOORS) {
    for (const rect of floor.rects) {
      const dist = rectDist(x, z, rect);
      if (dist < bestD) {
        bestD = dist;
        best = rect;
      }
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

export function tombSquare(x: number, z: number): string {
  const floor = FLOORS.find((row) => hit(row.rects, x, z, 0));
  const map = floor?.id === "tomb-2" ? 2 : floor?.id === "tomb-3" ? 3 : 1;
  const grid = ZONE_GRIDS.find((g) => g.zone === "ranperre" && g.map === map);
  const ox = floor?.ox ?? grid?.x0 ?? M1X;
  const oz = floor?.oz ?? grid?.z0 ?? M1Z;
  if (!grid) return "?";
  const aligned: ZoneGrid = { ...grid, x0: ox, z0: oz, cell: TOMB_CELL };
  return squareOf(aligned, x, z);
}

export function tombChart(x: number, z: number) {
  const floor = floorAt(x, z, 0) ?? FLOORS[0];
  let minX = Infinity;
  let maxX = -Infinity;
  let minZ = Infinity;
  let maxZ = -Infinity;
  for (const rect of floor.rects) {
    minX = Math.min(minX, rect.minX);
    maxX = Math.max(maxX, rect.maxX);
    minZ = Math.min(minZ, rect.minZ);
    maxZ = Math.max(maxZ, rect.maxZ);
  }
  const pad = 22;
  const marks = [
    ...TOMB_GATES.filter((gate) => hit(floor.rects, gate.x, gate.z, 0)).map((gate) => ({ x: gate.x, z: gate.z, name: gate.name })),
    ...TOMB_PLACES.filter((place) => hit(floor.rects, place.x, place.z, 0)),
  ];
  return {
    rects: floor.rects,
    water: [] as TombRect[],
    bounds: { minX: minX - pad, maxX: maxX + pad, minZ: minZ - pad, maxZ: maxZ + pad },
    marks,
    grid: { x0: floor.ox, z0: floor.oz, cell: TOMB_CELL },
  };
}

function opening(a: TombRect, b: TombRect): number {
  const w = Math.min(a.maxX, b.maxX) - Math.max(a.minX, b.minX);
  const d = Math.min(a.maxZ, b.maxZ) - Math.max(a.minZ, b.minZ);
  if (w < 7 || d < 7) return 0;
  return Math.min(w, d);
}

function floodMiss(rects: TombRect[], start: TombRect): string {
  const seen = new Set<TombRect>([start]);
  const queue = [start];
  while (queue.length) {
    const cur = queue.pop();
    if (!cur) break;
    for (const next of rects) {
      if (seen.has(next) || opening(cur, next) < 7) continue;
      seen.add(next);
      queue.push(next);
    }
  }
  return rects
    .filter((rect) => !seen.has(rect))
    .map((rect) => `${tombSquare(mid(rect).x, mid(rect).z)}`)
    .join(",");
}

function padBox(gate: { x: number; z: number; hx: number; hz: number }): TombRect {
  return { minX: gate.x - gate.hx, maxX: gate.x + gate.hx, minZ: gate.z - gate.hz, maxZ: gate.z + gate.hz };
}

function overlaps(a: TombRect, b: TombRect): boolean {
  return a.minX < b.maxX - 0.15 && a.maxX > b.minX + 0.15 && a.minZ < b.maxZ - 0.15 && a.maxZ > b.minZ + 0.15;
}

function standClear(stand: { x: number; z: number }, gate: { x: number; z: number; hx: number; hz: number }): number {
  const dx = Math.abs(stand.x - gate.x) - gate.hx;
  const dz = Math.abs(stand.z - gate.z) - gate.hz;
  if (dx <= 0 && dz <= 0) return 0;
  return Math.hypot(Math.max(dx, 0), Math.max(dz, 0));
}

export function assertTomb(): void {
  if (TOMB_CELL !== 48) throw new Error("tomb cell");
  for (const [map, x0, z0] of [
    [1, M1X, M1Z],
    [2, M2X, M2Z],
    [3, M3X, M3Z],
  ] as const) {
    const grid = ZONE_GRIDS.find((g) => g.zone === "ranperre" && g.map === map);
    if (!grid || grid.x0 !== x0 || grid.z0 !== z0 || grid.cell !== TOMB_CELL || grid.cols !== 15 || grid.rows !== 15) {
      throw new Error(`tomb map ${map} grid`);
    }
  }
  if (!inTomb(foyerStand.x, foyerStand.z, 0.36)) throw new Error("foyer stand");
  if (tombSquare(mid(foyer).x, mid(foyer).z) !== "G-5") throw new Error("entrance square");
  if (tombSquare(mid(exitRoom).x, mid(exitRoom).z) !== "I-5") throw new Error("one-way square");
  if (tombSquare(mid(jugner).x, mid(jugner).z) !== "K-5") throw new Error("jugner square");
  if (tombSquare(mid(cryptL).x, mid(cryptL).z) !== "H-10") throw new Error("tomb square");
  if (tombSquare(mid(tomeSouth).x, mid(tomeSouth).z) !== "I-9") throw new Error("south tome square");
  if (tombSquare(mid(upA).x, mid(upA).z) !== "G-7") throw new Error("lower tome square");
  if (tombSquare(mid(vrtra).x, mid(vrtra).z) !== "K-9") throw new Error("vrtra square");
  if (tombSquare(mid(gear).x, mid(gear).z) !== "E-7") throw new Error("apparatus square");
  if (tombSquare(mid(deepStair).x, mid(deepStair).z) !== "E-8") throw new Error("deep stair square");
  if (tombSquare(mid(crossHall).x, mid(crossHall).z) !== "H-8") throw new Error("cross square");
  if (tombSquare(mid(west).x, mid(west).z) !== "E-8") throw new Error("west crypt square");
  if (tombSquare(mid(down).x, mid(down).z) !== "G-9") throw new Error("south stair square");
  const miss1 = floodMiss(MAP1, foyer);
  const miss2 = floodMiss(MAP2, upA);
  const miss3 = floodMiss(MAP3, gear);
  if (miss1) throw new Error(`map 1 is split ${miss1}`);
  if (miss2) throw new Error(`map 2 is split ${miss2}`);
  if (miss3) throw new Error(`map 3 is split ${miss3}`);
  for (const floor of FLOORS) {
    for (const rect of floor.rects) {
      if (rect.minX < -1860 || rect.maxX > 980 || rect.minZ < -490 || rect.maxZ > 1720) throw new Error(`${floor.id} leaves the place box`);
      if (rect.maxZ < 1000) throw new Error(`${floor.id} climbed into the woods`);
      if (rect.minX < -700 && rect.maxZ < 1050) throw new Error(`${floor.id} met the fort`);
    }
  }
  for (const gate of TOMB_GATES) {
    const stand = gate.arrive ?? gate.retreat;
    if (!stand) continue;
    for (const other of TOMB_GATES) {
      if (Math.abs(stand.x - other.x) <= other.hx && Math.abs(stand.z - other.z) <= other.hz) {
        throw new Error(`${gate.id} stand is on ${other.id}`);
      }
    }
  }
  const names = new Set(TOMB_GATES.map((gate) => gate.id));
  if (names.size !== TOMB_GATES.length) throw new Error("tomb gate id");
  for (const gate of TOMB_GATES) {
    if (!inTomb(gate.x, gate.z, 0)) throw new Error(`${gate.id} left the tomb`);
    const stand = gate.arrive ?? gate.retreat;
    if (!stand) throw new Error(`${gate.id} has no stand`);
    if (gate.to === "closed" && !inTomb(stand.x, stand.z, 0.3)) throw new Error(`${gate.id} retreat`);
    if (gate.to === "ranperre" && (!inTomb(stand.x, stand.z, 0.3) || Math.hypot(stand.x - gate.x, stand.z - gate.z) < 6)) {
      throw new Error(`${gate.id} lands on itself`);
    }
  }
  for (let i = 0; i < TOMB_GATES.length; i++) {
    for (let j = i + 1; j < TOMB_GATES.length; j++) {
      const a = TOMB_GATES[i];
      const b = TOMB_GATES[j];
      if (Math.abs(a.x - b.x) < a.hx + b.hx && Math.abs(a.z - b.z) < a.hz + b.hz) throw new Error(`${a.id} overlaps ${b.id}`);
    }
  }
  if (Math.hypot(stairA2.x - stairA1.x, stairA2.z - stairA1.z) < 80) throw new Error("stair A did not change floors");
  if (Math.hypot(stairB2.x - stairB1.x, stairB2.z - stairB1.z) < 80) throw new Error("stair B did not change floors");
  if (Math.hypot(stairC3.x - stairC2.x, stairC3.z - stairC2.z) < 80) throw new Error("stair C did not change floors");
  for (const gate of TOMB_GATES) {
    const stand = gate.arrive ?? gate.retreat;
    if (!stand) continue;
    for (const other of TOMB_GATES) {
      if (standClear(stand, other) < 3.2) throw new Error(`${gate.id} stand is close to ${other.id}`);
    }
    if (gate.side !== "floor") continue;
    const floor = FLOORS.find((row) => hit(row.rects, gate.x, gate.z, 0));
    const owners = floor ? floor.rects.filter((rect) => overlaps(rect, padBox(gate))) : [];
    if (owners.length !== 1) throw new Error(`${gate.id} stair blocks a hall`);
  }
}

function floorSlab(add: Add, rect: TombRect, color: number, lift = 0) {
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

function stoneWalls(add: Add, colliders: Solid[], rects: TombRect[], gates: readonly TombGate[]) {
  const rock = 4606546;
  const rockDark = 3026472;
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
        cuts.push([along - 3.5, along + 3.5]);
      }
      const outward = side === "n" || side === "w" ? -1 : 1;
      for (const span of cutSpans(full, cuts)) {
        let a = span[0];
        let b = span[1];
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
        add(rockDark, horizontal ? len : thick + 0.5, 1.4, horizontal ? thick + 0.5 : len, cx, 0.6, cz);
      }
    }
  }
}

function pillar(add: Add, colliders: Solid[], x: number, z: number, color = 5987163) {
  add(color, 1.15, 4.6, 1.15, x, 2.3, z);
  colliders.push({ minX: x - 0.7, maxX: x + 0.7, minZ: z - 0.7, maxZ: z + 0.7 });
}

function book(add: Add, x: number, z: number) {
  add(15921132, 0.7, 0.16, 0.9, x, 0.2, z);
  add(2433342, 0.16, 0.22, 0.7, x, 0.28, z);
}

function torch(add: Add, x: number, z: number) {
  add(4606546, 0.28, 1.5, 0.28, x, 0.75, z);
  add(14921430, 0.22, 0.28, 0.22, x, 1.6, z);
}

function steps(add: Add, x: number, z: number, axis: "x" | "z") {
  for (let i = 0; i < 4; i++) {
    const along = (i - 1.5) * 0.9;
    const px = axis === "x" ? x + along : x;
    const pz = axis === "z" ? z + along : z;
    const w = axis === "x" ? 0.85 : 4.2;
    const d = axis === "z" ? 0.85 : 4.2;
    add(3026472, w, 0.16 + i * 0.1, d, px, 0.08 + i * 0.07, pz);
  }
}

export function buildTomb(add: Add, colliders: Solid[]): void {
  const stone = 4734776;
  const crypt = 3816248;
  const sand = 5986392;
  MAP1.forEach((rect, i) => floorSlab(add, rect, stone, i * 0.004));
  MAP2.forEach((rect, i) => floorSlab(add, rect, stone, i * 0.004));
  MAP3.forEach((rect, i) => floorSlab(add, rect, crypt, i * 0.004));
  floorSlab(add, cryptL, sand, 0.12);
  floorSlab(add, cryptR, sand, 0.12);
  stoneWalls(add, colliders, MAP1, TOMB_GATES);
  stoneWalls(add, colliders, MAP2, TOMB_GATES);
  stoneWalls(add, colliders, MAP3, TOMB_GATES);
  const king = { x: mid(cryptL).x, z: cryptL.maxZ - 8 };
  add(5987163, 3.4, 1.2, 6.6, king.x, 0.6, king.z);
  add(14921430, 3.6, 0.16, 1.2, king.x, 1.24, king.z - 2.2);
  colliders.push({ minX: king.x - 1.8, maxX: king.x + 1.8, minZ: king.z - 3.4, maxZ: king.z + 3.4 });
  const bier = { x: mid(cryptR).x, z: cryptR.maxZ - 8 };
  add(5987163, 2.8, 0.72, 5.4, bier.x, 0.36, bier.z);
  cornerPillars(add, colliders, crossHall);
  cornerPillars(add, colliders, pillarN);
  cornerPillars(add, colliders, pillarS);
  const hollow = mid(vrtra);
  add(3026472, 10, 0.08, 10, hollow.x, 0.05, hollow.z);
  add(5987163, 4.2, 0.42, 4.2, hollow.x, 0.26, hollow.z);
  const rig = mid(gear);
  pillar(add, colliders, rig.x - 3.4, rig.z - 0.4, 3182626);
  pillar(add, colliders, rig.x, rig.z + 3.1, 2148670);
  pillar(add, colliders, rig.x + 3.4, rig.z - 0.4, 9388032);
  book(add, foyer.maxX - 3.2, foyer.maxZ - 3.4);
  book(add, exitRoom.maxX - 3, exitRoom.maxZ - 3.2);
  book(add, mid(tomeSouth).x, mid(tomeSouth).z);
  book(add, mid(upA).x, upA.maxZ - 4.4);
  add(5974574, 1.7, 0.08, 1.7, foyer.minX + 3.6, 0.08, foyer.maxZ - 3.6);
  steps(add, stairA1.x, stairA1.z, "x");
  steps(add, stairA2.x, stairA2.z, "z");
  steps(add, stairB1.x, stairB1.z, "z");
  steps(add, stairB2.x, stairB2.z, "z");
  steps(add, stairC2.x, stairC2.z, "z");
  steps(add, stairC3.x, stairC3.z, "z");
  torch(add, foyer.maxX - 1.5, foyer.maxZ - 1.5);
  torch(add, cryptL.minX + 2, cryptL.minZ + 2);
  torch(add, cryptR.maxX - 2, cryptR.minZ + 2);
  torch(add, west.minX + 2, west.maxZ - 2);
  torch(add, stairA1Alcove.minX + 1.4, stairA1Alcove.minZ + 1.4);
  torch(add, gear.minX + 1.6, gear.maxZ - 1.6);
  torch(add, vrtra.maxX - 2.2, vrtra.minZ + 2.2);
}

function cornerPillars(add: Add, colliders: Solid[], rect: TombRect) {
  const c = mid(rect);
  const ix = Math.min(6.5, (rect.maxX - rect.minX) * 0.28);
  const iz = Math.min(6.5, (rect.maxZ - rect.minZ) * 0.28);
  pillar(add, colliders, c.x - ix, c.z - iz);
  pillar(add, colliders, c.x + ix, c.z + iz);
  pillar(add, colliders, c.x - ix, c.z + iz);
  pillar(add, colliders, c.x + ix, c.z - iz);
}
