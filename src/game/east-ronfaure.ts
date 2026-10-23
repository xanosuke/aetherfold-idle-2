/**
 * East Ronfaure, the hunting wood east of San d'Oria.
 * Same 12 by 12 starter grid as West Ronfaure: column 0 is A, row 0 is 1,
 * each cell 48 yalms, north is -Z. The shore follows the retail map.
 *   Southern San d'Oria opens at G-4.
 *   West Ronfaure opens at F-7 and F-9.
 *   King Ranperre's Tomb opens at H-11. J-11 only receives the one-way drop.
 *   Ranguemont Pass is the horn at K-4.
 *   The Cavernous Maw sits at H-5, above the Cheval.
 * The Cheval River runs south out of the northern lake. Four bridges and
 * two fords cross it. The hunting camps stand on the banks and in the trees.
 */

import { squareOf, ZONE_GRIDS } from "./zone-grid";

export const EAST_CELL = 48;
export const EAST_X0 = 360;
export const EAST_Z0 = 220;
export const EAST_SIZE = EAST_CELL * 12;

type Span = { minX: number; maxX: number; minZ: number; maxZ: number };
type Add = (color: number, w: number, h: number, d: number, x: number, y: number, z: number) => void;
type Solid = { minX: number; maxX: number; minZ: number; maxZ: number; water?: boolean };

/** Shore in cell units. Each mouth is a dead end, so a gate cannot be walked around. */
export const EAST_COAST: readonly [number, number][] = [
  [6.4, 4.5],
  [6.22, 4.5],
  [6.22, 3.2],
  [6.78, 3.2],
  [6.78, 4.35],
  [6.85, 4.22],
  [7.28, 4.3],
  [7.28, 4.02],
  [7.56, 4.02],
  [7.56, 4.3],
  [8.05, 4.08],
  [8.55, 3.92],
  [9.05, 4.02],
  [9.45, 3.78],
  [9.9, 3.72],
  [10.32, 3.44],
  [10.78, 3.44],
  [10.78, 3.72],
  [10.32, 3.72],
  [9.85, 4.05],
  [9.55, 4.48],
  [10.05, 5.35],
  [9.75, 6.6],
  [9.42, 7.75],
  [9.72, 8.85],
  [10.08, 9.9],
  [10.15, 10.55],
  [9.72, 10.72],
  [9.5, 10.62],
  [9.5, 10.96],
  [9.22, 10.96],
  [9.22, 10.62],
  [8.85, 10.85],
  [8.55, 11.15],
  [8.15, 10.85],
  [7.7, 10.85],
  [7.4, 11.15],
  [7.26, 10.68],
  [7.26, 10.96],
  [6.98, 10.96],
  [6.98, 10.68],
  [6.55, 11.2],
  [6.15, 11.2],
  [5.75, 10.7],
  [5.45, 9.55],
  [5.28, 8.69],
  [5.02, 8.69],
  [5.02, 8.41],
  [5.28, 8.41],
  [5.45, 7.5],
  [5.28, 6.7],
  [5.02, 6.7],
  [5.02, 6.42],
  [5.28, 6.42],
  [5.7, 6.05],
  [6.48, 5.8],
  [5.55, 5.8],
  [5.55, 5.48],
  [6.48, 5.48],
  [6.48, 5.2],
  [6.4, 4.7],
];

const PTS = EAST_COAST.map(([col, row]) => ({ x: EAST_X0 + col * EAST_CELL, z: EAST_Z0 + row * EAST_CELL }));

function at(col: number, row: number): { x: number; z: number } {
  return { x: EAST_X0 + col * EAST_CELL, z: EAST_Z0 + row * EAST_CELL };
}

export function eastSquare(col: number, row: number): string {
  const c = Math.floor(col);
  const r = Math.floor(row);
  const grid = ZONE_GRIDS.find((g) => g.zone === "east-ronfaure");
  if (!grid || c < 0 || r < 0 || c >= grid.cols || r >= grid.rows) {
    const letter = "ABCDEFGHIJKL"[c] ?? "?";
    return `${letter}-${r + 1}`;
  }
  return squareOf(grid, grid.x0 + (c + 0.5) * grid.cell, grid.z0 + (r + 0.5) * grid.cell);
}

function box(col0: number, row0: number, col1: number, row1: number): Span {
  const a = at(col0, row0);
  const b = at(col1, row1);
  return {
    minX: Math.min(a.x, b.x),
    maxX: Math.max(a.x, b.x),
    minZ: Math.min(a.z, b.z),
    maxZ: Math.max(a.z, b.z),
  };
}

function pad(x: number, z: number, hx: number, hz: number): Span {
  return { minX: x - hx, maxX: x + hx, minZ: z - hz, maxZ: z + hz };
}

function hit(span: Span, x: number, z: number, radius = 0): boolean {
  return x >= span.minX - radius && x <= span.maxX + radius && z >= span.minZ - radius && z <= span.maxZ + radius;
}

function inside(x: number, z: number): boolean {
  let hitEdge = false;
  for (let i = 0, j = PTS.length - 1; i < PTS.length; j = i++) {
    const a = PTS[i];
    const b = PTS[j];
    if ((a.z > z) !== (b.z > z) && x < ((b.x - a.x) * (z - a.z)) / (b.z - a.z) + a.x) hitEdge = !hitEdge;
  }
  return hitEdge;
}

function nearest(x: number, z: number): { x: number; z: number; nx: number; nz: number; dist: number } {
  let best = Infinity;
  let hx = x;
  let hz = z;
  let nx = 0;
  let nz = 1;
  for (let i = 0; i < PTS.length; i++) {
    const a = PTS[i];
    const b = PTS[(i + 1) % PTS.length];
    const dx = b.x - a.x;
    const dz = b.z - a.z;
    const len2 = dx * dx + dz * dz;
    if (len2 < 1e-6) continue;
    const t = Math.max(0, Math.min(1, ((x - a.x) * dx + (z - a.z) * dz) / len2));
    const px = a.x + dx * t;
    const pz = a.z + dz * t;
    const dist = Math.hypot(x - px, z - pz);
    if (dist < best) {
      best = dist;
      hx = px;
      hz = pz;
      const len = Math.sqrt(len2);
      nx = -dz / len;
      nz = dx / len;
    }
  }
  return { x: hx, z: hz, nx, nz, dist: best };
}

export function inEast(x: number, z: number, radius = 0): boolean {
  if (x < EAST_X0 + 4 || x > EAST_X0 + EAST_SIZE - 4 || z < EAST_Z0 + 4 || z > EAST_Z0 + EAST_SIZE - 4) return false;
  if (!inside(x, z)) return false;
  if (radius <= 0) return true;
  return nearest(x, z).dist + 0.02 >= radius;
}

const HEART = at(7.4, 7.4);

export function clampEast(x: number, z: number, radius = 0): { x: number; z: number } {
  const r = Math.max(0, radius);
  if (inEast(x, z, r)) return { x, z };
  const gap = r + 0.45;
  const edge = nearest(x, z);
  for (const sign of [1, -1]) {
    const step = { x: edge.x + edge.nx * sign * gap, z: edge.z + edge.nz * sign * gap };
    if (inEast(step.x, step.z, r)) return step;
  }
  for (let i = 1; i <= 24; i++) {
    const t = i / 24;
    const step = { x: x + (HEART.x - x) * t, z: z + (HEART.z - z) * t };
    if (inEast(step.x, step.z, r)) return step;
  }
  return { x: HEART.x, z: HEART.z };
}

/** Where a zone line drops you, a few yalms inside the mouth. */
export const EAST_STAND = {
  sandoria: { ...at(6.5, 3.72), yaw: 0, log: "East Ronfaure." },
  westA: { ...at(5.7, 6.56), yaw: 0, log: "East Ronfaure." },
  westB: { ...at(5.7, 8.55), yaw: 0, log: "East Ronfaure." },
};

/** Field manuals. The San d'Oria book stays at G-6, south of the old road pocket. H-9 sits west of the Cheval, beside the road. */
export const EAST_MANUAL_GATE = at(6.72, 5.78);
export const EAST_MANUAL_ROAD = at(7.42, 8.66);

export const EAST_MOUTH = {
  sandoria: { ...at(6.5, 3.32), hx: 16, hz: 2.4 },
  westA: { ...at(5.14, 6.56), hx: 2.4, hz: 7.2 },
  westB: { ...at(5.14, 8.55), hx: 2.4, hz: 7.2 },
  ranguemont: { ...at(10.52, 3.58), hx: 2.6, hz: 7.2, retreat: at(9.35, 4.35), stand: at(10.68, 3.58) },
  tombH: { ...at(7.12, 10.84), hx: 7.2, hz: 2.4, retreat: at(7.12, 10.4) },
  tombJ: { ...at(9.36, 10.8), hx: 7.2, hz: 2.4, retreat: at(9.36, 10.32) },
  maw: { ...at(7.42, 4.14), hx: 7.2, hz: 2.2, retreat: at(6.72, 4.72) },
};

const TOWER_NORTH = at(8.52, 4.28);
const TOWER_SOUTH = at(9.62, 10.38);
const MONUMENT = at(6.22, 10.42);
const FOUNTAIN = at(6.62, 6.05);

const RIVER_COL = 7.86;
const RIVER_HALF = 0.16;
/** Rows the Cheval does not cover: four bridges, then two fords. */
const CROSSINGS: readonly [number, number][] = [
  [5.48, 5.9],
  [6.36, 6.76],
  [7.48, 7.8],
  [8.34, 8.76],
  [9.46, 9.78],
  [10.5, 10.92],
];

function riverSpans(): Span[] {
  const spans: Span[] = [box(7.18, 4.52, 8.28, 5.22)];
  let row = 5.15;
  const end = 10.98;
  const gaps = [...CROSSINGS].sort((a, b) => a[0] - b[0]);
  for (const [a, b] of gaps) {
    if (a > row + 0.04) spans.push(box(RIVER_COL - RIVER_HALF, row, RIVER_COL + RIVER_HALF, Math.min(a, end)));
    row = Math.max(row, b);
  }
  if (row < end - 0.04) spans.push(box(RIVER_COL - RIVER_HALF, row, RIVER_COL + RIVER_HALF, end));
  return spans;
}

const WATER = riverSpans();
export const EAST_WATER = WATER;

type Road = { x: number; z: number; w: number; d: number };

const ROADS: readonly Road[] = [
  { ...at(7.6, 5.68), w: (9.6 - 5.55) * EAST_CELL, d: 4.6 },
  { ...at(7.4, 6.56), w: (9.7 - 5.1) * EAST_CELL, d: 4.6 },
  { ...at(7.4, 8.55), w: (9.75 - 5.1) * EAST_CELL, d: 4.6 },
  { ...at(8.05, 10.7), w: (9.9 - 6.15) * EAST_CELL, d: 4.6 },
  { ...at(6.55, 8.35), w: 4.4, d: (10.7 - 6.0) * EAST_CELL },
  { ...at(9.25, 8.15), w: 4.4, d: (10.7 - 5.55) * EAST_CELL },
  { ...at(6.85, 5.05), w: 4.4, d: (5.68 - 4.4) * EAST_CELL },
  { ...at(8.15, 4.32), w: (9.3 - 6.85) * EAST_CELL, d: 4.4 },
  { ...at(10.05, 3.9), w: (10.55 - 9.3) * EAST_CELL, d: 4.2 },
];

export const EAST_PATHS = ROADS;

export const EAST_PLACES = [
  { ...TOWER_NORTH, name: "Northern Tower" },
  { ...TOWER_SOUTH, name: "Southeast Tower" },
  { ...MONUMENT, name: "Stone Monument" },
  { ...FOUNTAIN, name: "Fountain" },
];

function nearRoad(x: number, z: number, extra: number): boolean {
  return ROADS.some((road) => Math.abs(x - road.x) <= road.w / 2 + extra && Math.abs(z - road.z) <= road.d / 2 + extra);
}

function wet(x: number, z: number, radius = 0): boolean {
  return WATER.some((span) => hit(span, x, z, radius));
}

const MARKS = [
  EAST_MOUTH.sandoria,
  EAST_MOUTH.westA,
  EAST_MOUTH.westB,
  EAST_MOUTH.ranguemont,
  EAST_MOUTH.ranguemont.stand,
  EAST_MOUTH.tombH,
  EAST_MOUTH.tombJ,
  EAST_MOUTH.maw,
  TOWER_NORTH,
  TOWER_SOUTH,
  MONUMENT,
  FOUNTAIN,
  EAST_STAND.sandoria,
  EAST_STAND.westA,
  EAST_STAND.westB,
  EAST_MANUAL_GATE,
  EAST_MANUAL_ROAD,
];

function nearMark(x: number, z: number, reach: number): boolean {
  return MARKS.some((mark) => Math.hypot(mark.x - x, mark.z - z) < reach);
}

/** Dry floor: on the shore, off the Cheval, and clear of the towers and fountain. */
export function eastDry(x: number, z: number, radius = 0): boolean {
  if (!inEast(x, z, radius)) return false;
  if (wet(x, z, Math.max(0.35, radius * 0.5))) return false;
  if (Math.hypot(x - TOWER_NORTH.x, z - TOWER_NORTH.z) < 3.1) return false;
  if (Math.hypot(x - TOWER_SOUTH.x, z - TOWER_SOUTH.z) < 3.1) return false;
  if (Math.hypot(x - MONUMENT.x, z - MONUMENT.z) < 1.1) return false;
  if (Math.hypot(x - FOUNTAIN.x, z - FOUNTAIN.z) < 1.6) return false;
  return true;
}

export function eastAt(col: number, row: number): { x: number; z: number } {
  return at(col, row);
}

/** A camp on the riverbank, not in the water and not on a bridge. */
export function eastBank(x: number, z: number): boolean {
  if (!eastDry(x, z, 0.3)) return false;
  for (let i = 0; i < 8; i++) {
    const ang = (i / 8) * Math.PI * 2;
    const px = x + Math.cos(ang) * 7;
    const pz = z + Math.sin(ang) * 7;
    if (inEast(px, pz, 0) && wet(px, pz, 0)) return true;
  }
  return false;
}

export function eastPath(x: number, z: number): boolean {
  return eastDry(x, z, 0.4) && nearRoad(x, z, 8);
}

export function buildEastRonfaure(add: Add, colliders: Solid[]): void {
  const moss = 4156216;
  const dirt = 9269316;
  const dirtDark = 7033908;
  const water = 3108230;
  const rock = 6050130;
  const rockDark = 3948594;
  const sand = 14272417;
  const blue = 2772614;
  const plaque = 14927226;
  add(moss, EAST_SIZE, 0.36, EAST_SIZE, EAST_X0 + EAST_SIZE / 2, -0.22, EAST_Z0 + EAST_SIZE / 2);
  for (let iz = 0; iz < 24; iz++) {
    for (let ix = 0; ix < 24; ix++) {
      const x = EAST_X0 + 12 + ix * 24;
      const z = EAST_Z0 + 12 + iz * 24;
      if (inEast(x, z, 0)) continue;
      add(5129788, 24.4, 0.22, 24.4, x, 0.04, z);
    }
  }
  for (let i = 0; i < PTS.length; i++) {
    const a = PTS[i];
    const b = PTS[(i + 1) % PTS.length];
    const dx = b.x - a.x;
    const dz = b.z - a.z;
    const len = Math.hypot(dx, dz) || 1;
    let ox = -dz / len;
    let oz = dx / len;
    const midX = (a.x + b.x) / 2;
    const midZ = (a.z + b.z) / 2;
    if (inside(midX + ox * 8, midZ + oz * 8)) {
      ox = -ox;
      oz = -oz;
    }
    const steps = Math.max(1, Math.round(len / 8));
    for (let s = 0; s < steps; s++) {
      const t = (s + 0.5) / steps;
      const x = a.x + dx * t + ox * 7;
      const z = a.z + dz * t + oz * 7;
      if (inside(x, z) || nearMark(x, z, 11)) continue;
      const h = 3.4 + (s % 4) * 0.45;
      const w = Math.min(7.2, len / steps + 0.8);
      add(s % 2 ? rock : rockDark, w, h, 4.2, x, h / 2 - 0.2, z);
    }
  }
  for (const span of WATER) {
    add(water, span.maxX - span.minX, 0.08, span.maxZ - span.minZ, (span.minX + span.maxX) / 2, 0.02, (span.minZ + span.maxZ) / 2);
    colliders.push({ ...span, water: true });
  }
  for (const [row0, row1] of CROSSINGS) {
    const span = box(RIVER_COL - RIVER_HALF - 0.02, row0, RIVER_COL + RIVER_HALF + 0.02, row1);
    add(sand, span.maxX - span.minX, 0.1, span.maxZ - span.minZ, (span.minX + span.maxX) / 2, 0.08, (span.minZ + span.maxZ) / 2);
    add(blue, span.maxX - span.minX + 0.4, 0.06, 0.28, (span.minX + span.maxX) / 2, 0.16, span.minZ + 0.4);
    add(blue, span.maxX - span.minX + 0.4, 0.06, 0.28, (span.minX + span.maxX) / 2, 0.16, span.maxZ - 0.4);
  }
  for (const road of ROADS) {
    add(dirt, road.w, 0.06, road.d, road.x, 0.05, road.z);
    add(dirtDark, Math.min(0.7, road.w * 0.12), 0.04, road.d, road.x - road.w * 0.18, 0.08, road.z);
  }
  const jamb = (x: number, z: number, across: "x" | "z") => {
    const hx = across === "x" ? 3.4 : 0;
    const hz = across === "z" ? 3.4 : 0;
    for (const sign of [-1, 1]) {
      const px = x + hx * sign;
      const pz = z + hz * sign;
      add(sand, 1.3, 3.6, 1.3, px, 1.8, pz);
      add(blue, 1.55, 0.28, 1.55, px, 3.7, pz);
      colliders.push(pad(px, pz, 0.7, 0.7));
    }
    if (across === "x") add(blue, 8.2, 0.42, 1.15, x, 3.85, z);
    else add(blue, 1.15, 0.42, 8.2, x, 3.85, z);
  };
  jamb(EAST_MOUTH.sandoria.x, EAST_MOUTH.sandoria.z, "x");
  jamb(EAST_MOUTH.westA.x, EAST_MOUTH.westA.z, "z");
  jamb(EAST_MOUTH.westB.x, EAST_MOUTH.westB.z, "z");
  jamb(EAST_MOUTH.ranguemont.x, EAST_MOUTH.ranguemont.z, "z");
  jamb(EAST_MOUTH.tombH.x, EAST_MOUTH.tombH.z, "x");
  jamb(EAST_MOUTH.tombJ.x, EAST_MOUTH.tombJ.z, "x");
  add(rockDark, 7.4, 2.6, 3.2, EAST_MOUTH.maw.x, 1.2, EAST_MOUTH.maw.z - 1.4);
  add(1316892, 2.2, 1.8, 0.4, EAST_MOUTH.maw.x, 0.95, EAST_MOUTH.maw.z + 0.4);
  const tower = (x: number, z: number) => {
    add(3815996, 5.4, 6.8, 5.4, x, 3.4, z);
    add(2764084, 6.2, 1.1, 6.2, x, 7.1, z);
    add(blue, 1.1, 0.55, 0.2, x, 4.6, z + 2.6);
    colliders.push(pad(x, z, 2.5, 2.5));
  };
  tower(TOWER_NORTH.x, TOWER_NORTH.z);
  tower(TOWER_SOUTH.x, TOWER_SOUTH.z);
  add(sand, 0.7, 2.3, 0.42, MONUMENT.x, 1.15, MONUMENT.z);
  add(plaque, 0.48, 0.12, 0.28, MONUMENT.x, 2.15, MONUMENT.z);
  colliders.push(pad(MONUMENT.x, MONUMENT.z, 0.45, 0.4));
  add(sand, 2.4, 0.55, 2.4, FOUNTAIN.x, 0.28, FOUNTAIN.z);
  add(water, 1.5, 0.16, 1.5, FOUNTAIN.x, 0.5, FOUNTAIN.z);
  colliders.push(pad(FOUNTAIN.x, FOUNTAIN.z, 1.15, 1.15));
  for (let iz = 0; iz < 26; iz++) {
    for (let ix = 0; ix < 26; ix++) {
      const col = 4.8 + ix * 0.25 + ((iz * 3) % 5) * 0.02;
      const row = 3.5 + iz * 0.32 + ((ix * 2) % 5) * 0.02;
      const spot = at(col, row);
      if (!inEast(spot.x, spot.z, 2.4)) continue;
      if (wet(spot.x, spot.z, 1.2) || nearRoad(spot.x, spot.z, 3.2) || nearMark(spot.x, spot.z, 9)) continue;
      const n = (ix * 13 + iz * 7) % 10;
      if (n === 0) continue;
      const s = 1.35 + (n % 4) * 0.22;
      const trunk = 1.2 * s;
      add(5913124, 0.32 * s, trunk, 0.32 * s, spot.x, trunk / 2, spot.z);
      add(2058808, 2.05 * s, 1.45 * s, 2.05 * s, spot.x, trunk + 0.25 * s, spot.z);
      add(3111488, 1.35 * s, 1.2 * s, 1.35 * s, spot.x, trunk + 1.2 * s, spot.z);
      add(4034373, 0.72 * s, 0.9 * s, 0.72 * s, spot.x, trunk + 2.05 * s, spot.z);
    }
  }
}

function blocked(x: number, z: number): boolean {
  if (wet(x, z, 0.2)) return true;
  if (Math.hypot(x - TOWER_NORTH.x, z - TOWER_NORTH.z) < 3.1) return true;
  if (Math.hypot(x - TOWER_SOUTH.x, z - TOWER_SOUTH.z) < 3.1) return true;
  if (Math.hypot(x - MONUMENT.x, z - MONUMENT.z) < 1.1) return true;
  if (Math.hypot(x - FOUNTAIN.x, z - FOUNTAIN.z) < 1.6) return true;
  return false;
}

export function assertEast(): void {
  const grid = ZONE_GRIDS.find((g) => g.zone === "east-ronfaure");
  if (!grid || grid.x0 !== EAST_X0 || grid.z0 !== EAST_Z0 || grid.cell !== EAST_CELL || grid.cols !== 12 || grid.rows !== 12) {
    throw new Error("east grid");
  }
  const square = (col: number, row: number) => eastSquare(col, row);
  const colOf = (x: number) => (x - EAST_X0) / EAST_CELL;
  const rowOf = (z: number) => (z - EAST_Z0) / EAST_CELL;
  const named = (point: { x: number; z: number }, expect: string) => {
    const got = square(colOf(point.x), rowOf(point.z));
    if (got !== expect) throw new Error(`${expect} landed on ${got}`);
  };
  named(EAST_MOUTH.sandoria, "G-4");
  named(EAST_STAND.sandoria, "G-4");
  named(EAST_MOUTH.westA, "F-7");
  named(EAST_STAND.westA, "F-7");
  named(EAST_MOUTH.westB, "F-9");
  named(EAST_STAND.westB, "F-9");
  named(EAST_MOUTH.ranguemont, "K-4");
  named(EAST_MOUTH.ranguemont.stand, "K-4");
  named(EAST_MOUTH.ranguemont.retreat, "J-5");
  named(EAST_MOUTH.tombH, "H-11");
  named(EAST_MOUTH.tombJ, "J-11");
  named(EAST_MOUTH.maw, "H-5");
  named(TOWER_NORTH, "I-5");
  named(TOWER_SOUTH, "J-11");
  named(MONUMENT, "G-11");
  const walk = [
    EAST_STAND.sandoria,
    EAST_STAND.westA,
    EAST_STAND.westB,
    EAST_MOUTH.sandoria,
    EAST_MOUTH.westA,
    EAST_MOUTH.westB,
    EAST_MOUTH.ranguemont,
    EAST_MOUTH.ranguemont.stand,
    EAST_MOUTH.tombH,
    EAST_MOUTH.tombJ,
    EAST_MOUTH.maw,
    EAST_MOUTH.ranguemont.retreat,
    EAST_MOUTH.tombH.retreat,
    EAST_MOUTH.tombJ.retreat,
    EAST_MOUTH.maw.retreat,
    TOWER_NORTH,
    TOWER_SOUTH,
    MONUMENT,
  ];
  for (const point of walk) {
    if (!inEast(point.x, point.z, 0.36)) throw new Error(`off the shore ${colOf(point.x).toFixed(2)},${rowOf(point.z).toFixed(2)}`);
    if (wet(point.x, point.z, 0.3)) throw new Error(`standing in the Cheval ${colOf(point.x).toFixed(2)},${rowOf(point.z).toFixed(2)}`);
  }
  if (inEast(at(4.2, 7).x, at(4.2, 7).z)) throw new Error("west cliff is walkable");
  if (inEast(at(11.3, 7).x, at(11.3, 7).z)) throw new Error("east cliff is walkable");
  if (inEast(at(8, 2.4).x, at(8, 2.4).z)) throw new Error("north cliff is walkable");
  if (inEast(at(7, 12.2).x, at(7, 12.2).z)) throw new Error("south cliff is walkable");
  if (inEast(at(11.3, 3.5).x, at(11.3, 3.5).z)) throw new Error("past Ranguemont");
  if (inEast(at(5.2, 5.64).x, at(5.2, 5.64).z)) throw new Error("San d'Oria mouth can be walked around");
  if (inEast(at(5.9, 3.45).x, at(5.9, 3.45).z)) throw new Error("San d'Oria mouth can be walked around");
  if (inEast(at(7.05, 3.45).x, at(7.05, 3.45).z)) throw new Error("San d'Oria mouth can be walked around");
  if (inEast(at(4.75, 6.56).x, at(4.75, 6.56).z)) throw new Error("F-7 can be walked around");
  if (inEast(at(4.75, 8.55).x, at(4.75, 8.55).z)) throw new Error("F-9 can be walked around");
  if (inEast(at(7.42, 3.7).x, at(7.42, 3.7).z)) throw new Error("the maw can be walked around");
  if (inEast(at(7.12, 11.2).x, at(7.12, 11.2).z)) throw new Error("H-11 tomb can be walked around");
  if (inEast(at(9.36, 11.2).x, at(9.36, 11.2).z)) throw new Error("J-11 tomb can be walked around");
  const pulled = clampEast(at(4.2, 7).x, at(4.2, 7).z, 0.36);
  if (!inEast(pulled.x, pulled.z, 0.2)) throw new Error("clamp left East Ronfaure");
  const step = 16;
  const nodes: { x: number; z: number }[] = [];
  for (let z = EAST_Z0; z < EAST_Z0 + EAST_SIZE; z += step) {
    for (let x = EAST_X0; x < EAST_X0 + EAST_SIZE; x += step) {
      if (!inEast(x, z, 0.4) || blocked(x, z)) continue;
      nodes.push({ x, z });
    }
  }
  const start = nodes.find((node) => Math.hypot(node.x - EAST_STAND.sandoria.x, node.z - EAST_STAND.sandoria.z) < step * 1.5);
  if (!start) throw new Error("no path off the San d'Oria mouth");
  const seen = new Set<number>();
  const queue = [start];
  seen.add(nodes.indexOf(start));
  for (let head = 0; head < queue.length; head++) {
    const here = queue[head];
    for (let i = 0; i < nodes.length; i++) {
      if (seen.has(i)) continue;
      const next = nodes[i];
      if (Math.hypot(next.x - here.x, next.z - here.z) > step * 1.5) continue;
      seen.add(i);
      queue.push(next);
    }
  }
  const reached = (point: { x: number; z: number }, label: string) => {
    if (![...seen].some((index) => Math.hypot(nodes[index].x - point.x, nodes[index].z - point.z) < step * 1.6)) {
      throw new Error(`${label} is cut off`);
    }
  };
  reached(EAST_STAND.westA, "F-7");
  reached(EAST_STAND.westB, "F-9");
  reached(EAST_MOUTH.ranguemont.retreat, "Ranguemont");
  reached(EAST_MOUTH.ranguemont.stand, "Ranguemont stand");
  reached(EAST_MOUTH.tombH.retreat, "H-11 tomb");
  reached(EAST_MOUTH.tombJ.retreat, "J-11 tomb");
  reached(EAST_MOUTH.maw.retreat, "the maw");
  reached(at(6.55, 8.2), "the west bank");
  reached(at(9.25, 7.6), "the east bank");
  if (CROSSINGS.length !== 6) throw new Error("Cheval crossings");
}
