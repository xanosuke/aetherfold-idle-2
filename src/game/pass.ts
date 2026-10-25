/**
 * Ranguemont Pass. One retail floor, the tunnel under the Northern Wall.
 * Column 0 is A, row 0 is 1, each cell 48 yalms, north is -Z.
 * Walking follows the traced graph in pass-graph.ts.
 *   East Ronfaure comes in at G-12. Beaucedine Glacier leaves at L-4.
 *   The F-10 door lets you north. The E-10 door lets you out toward the entrance.
 * The stone follows the traced tunnels.
 */

import { EAST_MOUTH } from "./east-ronfaure";
import { GLACIER_ARRIVE, inGlacier } from "./glacier";
import { PASS_CELL, PASS_DISCS, PASS_GRAPH, PASS_WIDTH, PASS_X, PASS_Z, buildPassMask, clampPassGraph, gridToWorld, inPassGraph, passClearance } from "./pass-graph";
import { squareOf, ZONE_GRIDS } from "./zone-grid";

export { PASS_CELL };

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
type AddYaw = (color: number, w: number, h: number, d: number, x: number, y: number, z: number, yaw: number, tag?: string) => void;
type AddFlag = (w: number, d: number, x: number, z: number) => void;
type HangTorch = (x: number, z: number, y?: number) => void;
type AddSkirt = (length: number, mx: number, mz: number, ux: number, uz: number, ix: number, iz: number) => void;
type StonePart = { w: number; h: number; d: number; x: number; y: number; z: number };
type AddStone = (parts: readonly StonePart[], x: number, y: number, z: number, yaw: number, lean: number) => void;
type AddCue = (kind: "cap" | "glow", w: number, h: number, d: number, x: number, y: number, z: number, yaw: number) => void;
type AddRed = (
  w: number,
  h: number,
  lx: number,
  ly: number,
  lz: number,
  x: number,
  y: number,
  z: number,
  yaw: number,
  lean: number,
  camX?: number,
  camZ?: number,
) => void;
type Solid = { minX: number; maxX: number; minZ: number; maxZ: number };
type V2 = { x: number; z: number };

function span(c0: number, r0: number, c1: number, r1: number): PassRect {
  return {
    minX: PASS_X + Math.min(c0, c1) * PASS_CELL,
    maxX: PASS_X + Math.max(c0, c1) * PASS_CELL,
    minZ: PASS_Z + Math.min(r0, r1) * PASS_CELL,
    maxZ: PASS_Z + Math.max(r0, r1) * PASS_CELL,
  };
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

function graphNode(id: string) {
  const node = PASS_GRAPH.nodes.find((item) => item.id === id);
  if (!node) throw new Error(id);
  return node;
}

function graphPoi(id: string) {
  const poi = PASS_GRAPH.pois.find((item) => item.id === id);
  if (!poi) throw new Error(id);
  return poi;
}

/** Walk `squares` along an edge, starting at either endpoint. */
function pullInside(edgeId: string, fromId: string, squares: number): { x: number; z: number } {
  const edge = PASS_GRAPH.edges.find((item) => item.id === edgeId);
  if (!edge) throw new Error(edgeId);
  const pts = edge.from === fromId ? edge.pts : edge.to === fromId ? [...edge.pts].reverse() : null;
  if (!pts) throw new Error(`${edgeId} ${fromId}`);
  let left = squares;
  for (let i = 0; i + 1 < pts.length; i++) {
    const a = pts[i];
    const b = pts[i + 1];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (len >= left - 1e-9) {
      const t = len > 0 ? left / len : 0;
      return gridToWorld(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t);
    }
    left -= len;
  }
  const end = pts[pts.length - 1];
  return gridToWorld(end[0], end[1]);
}

/** Gate sits just mouth-ward of the stand so arrival is not on the zone line. */
function clearOfStand(
  stand: { x: number; z: number },
  mouth: { x: number; z: number },
  hx: number,
  hz: number,
): { x: number; z: number } {
  const dx = mouth.x - stand.x;
  const dz = mouth.z - stand.z;
  const len = Math.hypot(dx, dz) || 1;
  const ux = dx / len;
  const uz = dz / len;
  const tx = Math.abs(ux) > 1e-4 ? hx / Math.abs(ux) : Infinity;
  const tz = Math.abs(uz) > 1e-4 ? hz / Math.abs(uz) : Infinity;
  const t = Math.min(len - 0.05, Math.min(tx, tz) + 0.4);
  return { x: stand.x + ux * t, z: stand.z + uz * t };
}

const eastMouth = gridToWorld(graphNode("exit_east_ronfaure").gx, graphNode("exit_east_ronfaure").gy);
const iceMouth = gridToWorld(graphNode("exit_beaucedine").gx, graphNode("exit_beaucedine").gy);
const mouthStand = pullInside("e_exit_s", "exit_east_ronfaure", 0.25);
const glacierStand = pullInside("e_ne_exit", "exit_beaucedine", 0.25);
const eastGateAt = clearOfStand(mouthStand, eastMouth, 5.4, 2.1);
const iceGateAt = clearOfStand(glacierStand, iceMouth, 2.2, 5.2);

export const PASS_ARRIVE = { ...mouthStand, yaw: 0, log: "Ranguemont Pass." };
export const PASS_FROM_GLACIER = { ...glacierStand, yaw: Math.PI / 2, log: "Ranguemont Pass." };

export const PASS_NPCS = {
  perchond: {
    ...cell(5.28, 9.42),
    line: "Perchond: The north door lets you deeper in. It will not let you back.",
  },
  myffore: {
    ...cell(5.48, 9.32),
    line: "Myffore: The west door lets you out to East Ronfaure. The east end of the tunnel is Beaucedine Glacier.",
  },
};

const survival = graphPoi("survival_guide");
const trunk = graphNode("j_trunk_west");
const TOMES = [gridToWorld(survival.gx, survival.gy), gridToWorld(trunk.gx, trunk.gy), glacierStand];

export const PASS_GATES: readonly PassGate[] = [
  {
    id: "pass-east",
    name: "East Ronfaure",
    x: eastGateAt.x,
    z: eastGateAt.z,
    hx: 5.4,
    hz: 2.1,
    to: "east-ronfaure",
    side: "s",
    arrive: { ...EAST_MOUTH.ranguemont.stand, yaw: 0, log: "East Ronfaure." },
  },
  {
    id: "pass-beaucedine",
    name: "Beaucedine Glacier",
    x: iceGateAt.x,
    z: iceGateAt.z,
    hx: 2.2,
    hz: 5.2,
    to: "beaucedine",
    side: "e",
    arrive: GLACIER_ARRIVE,
  },
];

const enterAt = gridToWorld(graphNode("door_enter_only").gx, graphNode("door_enter_only").gy);
const exitAt = gridToWorld(graphNode("door_exit_only").gx, graphNode("door_exit_only").gy);
const westLoop = PASS_GRAPH.edges.find((edge) => edge.id === "e_west_loop");
if (!westLoop || westLoop.pts.length < 2) throw new Error("e_west_loop");
const exitSegA = westLoop.pts[westLoop.pts.length - 2];
const exitSegB = westLoop.pts[westLoop.pts.length - 1];
const exitDx = exitSegB[0] - exitSegA[0];
const exitDy = exitSegB[1] - exitSegA[1];
const exitAxis: "x" | "z" = Math.abs(exitDx) >= Math.abs(exitDy) ? "x" : "z";
const exitDir: 1 | -1 = (exitAxis === "x" ? exitDx : exitDy) >= 0 ? 1 : -1;
const doorSpan = 14;

/** F-10 lets you north. E-10 follows the last step of e_west_loop. */
export const PASS_DOORS: readonly PassDoor[] = [
  {
    axis: "z",
    dir: -1,
    at: enterAt.z,
    min: enterAt.x - doorSpan,
    max: enterAt.x + doorSpan,
  },
  {
    axis: exitAxis,
    dir: exitDir,
    at: exitAxis === "x" ? exitAt.x : exitAt.z,
    min: (exitAxis === "x" ? exitAt.z : exitAt.x) - doorSpan,
    max: (exitAxis === "x" ? exitAt.z : exitAt.x) + doorSpan,
  },
];

const watersNode = graphNode("waters_room");
const poolNode = graphNode("pool_round");
export const PASS_PLACES = [
  { name: "Waters of Oblivion", ...gridToWorld(watersNode.gx, watersNode.gy) },
  { name: "Strange Apparatus", ...gridToWorld(poolNode.gx, poolNode.gy) },
];

function onDisc(x: number, z: number, node: string): boolean {
  const disc = PASS_DISCS.find((item) => item.node === node);
  return !!disc && Math.hypot(x - disc.x, z - disc.z) <= disc.r;
}

export function passWet(x: number, z: number): boolean {
  return onDisc(x, z, "waters_room") || onDisc(x, z, "pool_round");
}

export function inPass(x: number, z: number, radius = 0): boolean {
  return inPassGraph(x, z, Math.max(0, radius));
}

export function clampPass(x: number, z: number, radius = 0): { x: number; z: number } | null {
  const snapped = clampPassGraph(x, z, Math.max(0, radius));
  if (Math.hypot(snapped.x - x, snapped.z - z) > 36) return null;
  return snapped;
}

export function passSquare(x: number, z: number): string {
  const grid = ZONE_GRIDS.find((g) => g.zone === "ranguemont");
  if (!grid) return "?";
  return squareOf(grid, x, z);
}

function poiName(id: string, label: string): string {
  if (id === "door_exit_only") return "Exit only";
  if (id === "door_enter_only") return "Enter only";
  return label.split(" (")[0];
}

/** Horizontal strips covering the waters_room disc. The pool disc stays dry on the map. */
function watersStrips(): PassRect[] {
  const disc = PASS_DISCS.find((item) => item.node === "waters_room");
  if (!disc) return [];
  const res = 16;
  const cell = PASS_CELL / res;
  const minI = Math.floor((disc.x - disc.r - PASS_X) / cell);
  const maxI = Math.ceil((disc.x + disc.r - PASS_X) / cell);
  const minJ = Math.floor((disc.z - disc.r - PASS_Z) / cell);
  const maxJ = Math.ceil((disc.z + disc.r - PASS_Z) / cell);
  const out: PassRect[] = [];
  for (let j = minJ; j <= maxJ; j++) {
    let i = minI;
    const cz = PASS_Z + (j + 0.5) * cell;
    while (i <= maxI) {
      if (Math.hypot(PASS_X + (i + 0.5) * cell - disc.x, cz - disc.z) > disc.r) {
        i += 1;
        continue;
      }
      const start = i;
      while (i <= maxI && Math.hypot(PASS_X + (i + 0.5) * cell - disc.x, cz - disc.z) <= disc.r) i += 1;
      out.push({
        minX: PASS_X + start * cell,
        maxX: PASS_X + i * cell,
        minZ: PASS_Z + j * cell,
        maxZ: PASS_Z + (j + 1) * cell,
      });
    }
  }
  return out;
}

function mulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function inStrips(rects: readonly PassRect[], x: number, z: number): boolean {
  for (const rect of rects) {
    if (x >= rect.minX && x <= rect.maxX && z >= rect.minZ && z <= rect.maxZ) return true;
  }
  return false;
}

/** Graph nodes, edges, and pois, padded half a square. The tunnel half-width fits inside. */
function passGraphBounds(): PassRect {
  let minGx = Infinity;
  let maxGx = -Infinity;
  let minGy = Infinity;
  let maxGy = -Infinity;
  const take = (gx: number, gy: number) => {
    minGx = Math.min(minGx, gx);
    maxGx = Math.max(maxGx, gx);
    minGy = Math.min(minGy, gy);
    maxGy = Math.max(maxGy, gy);
  };
  for (const node of PASS_GRAPH.nodes) take(node.gx, node.gy);
  for (const edge of PASS_GRAPH.edges) for (const pt of edge.pts) take(pt[0], pt[1]);
  for (const poi of PASS_GRAPH.pois) take(poi.gx, poi.gy);
  const pad = 0.5;
  return {
    minX: PASS_X + (minGx - pad) * PASS_CELL,
    maxX: PASS_X + (maxGx + pad) * PASS_CELL,
    minZ: PASS_Z + (minGy - pad) * PASS_CELL,
    maxZ: PASS_Z + (maxGy + pad) * PASS_CELL,
  };
}

/** The 500 points the minimap check and the chart repair both use. */
function chartPoints(bounds: PassRect): { x: number; z: number }[] {
  const rand = mulberry32(0x5eed);
  const pts: { x: number; z: number }[] = [];
  const spanX = bounds.maxX - bounds.minX;
  const spanZ = bounds.maxZ - bounds.minZ;
  for (let i = 0; i < 500; i++) pts.push({ x: bounds.minX + rand() * spanX, z: bounds.minZ + rand() * spanZ });
  return pts;
}

/**
 * Strips whose coverage matches inPass. A cell is kept only when clearance
 * says the whole cell is inside, so a coarse box cannot claim the rock.
 * The fixed 500-point sample then fills any inside point the leaves skipped.
 */
function chartStrips(bounds: PassRect): PassRect[] {
  const leaf = 0.35;
  const out: PassRect[] = [];
  const stack: PassRect[] = [bounds];
  while (stack.length) {
    const cell = stack.pop();
    if (!cell) break;
    const hx = (cell.maxX - cell.minX) / 2;
    const hz = (cell.maxZ - cell.minZ) / 2;
    const clearance = passClearance(cell.minX + hx, cell.minZ + hz);
    const halfDiag = Math.hypot(hx, hz);
    if (clearance >= halfDiag) {
      out.push(cell);
      continue;
    }
    if (clearance < -halfDiag) continue;
    if (cell.maxX - cell.minX <= leaf && cell.maxZ - cell.minZ <= leaf) continue;
    const mx = cell.minX + hx;
    const mz = cell.minZ + hz;
    stack.push(
      { minX: cell.minX, maxX: mx, minZ: cell.minZ, maxZ: mz },
      { minX: mx, maxX: cell.maxX, minZ: cell.minZ, maxZ: mz },
      { minX: cell.minX, maxX: mx, minZ: mz, maxZ: cell.maxZ },
      { minX: mx, maxX: cell.maxX, minZ: mz, maxZ: cell.maxZ },
    );
  }
  for (const pt of chartPoints(bounds)) {
    if (!inPass(pt.x, pt.z) || inStrips(out, pt.x, pt.z)) continue;
    const room = passClearance(pt.x, pt.z);
    if (room <= 1e-4) {
      out.push({ minX: pt.x, maxX: pt.x, minZ: pt.z, maxZ: pt.z });
      continue;
    }
    const half = room / Math.SQRT2;
    out.push({ minX: pt.x - half, maxX: pt.x + half, minZ: pt.z - half, maxZ: pt.z + half });
  }
  return out;
}

function graphNext(id: string, blocked: ReadonlySet<string>): string[] {
  const out: string[] = [];
  for (const edge of PASS_GRAPH.edges) {
    if (blocked.has(edge.id)) continue;
    if (edge.oneWay) {
      const [from, to] = edge.oneWay.split("->");
      if (id === from && to) out.push(to);
      continue;
    }
    if (edge.from === id) out.push(edge.to);
    else if (edge.to === id) out.push(edge.from);
  }
  return out;
}

function reachable(start: string, blocked: ReadonlySet<string>): Set<string> {
  const seen = new Set<string>([start]);
  const queue = [start];
  while (queue.length) {
    const id = queue.shift();
    if (!id) break;
    for (const next of graphNext(id, blocked)) {
      if (seen.has(next)) continue;
      seen.add(next);
      queue.push(next);
    }
  }
  return seen;
}

type PassChart = {
  rects: PassRect[];
  water: PassRect[];
  bounds: PassRect;
  marks: { x: number; z: number; name: string; role?: "nm" | "ph" }[];
  grid: { x0: number; z0: number; cell: number };
  paths: { pts: { x: number; z: number }[]; width: number }[];
  discs: { x: number; z: number; r: number }[];
};

let cachedChart: PassChart | null = null;

function buildPassChart(): PassChart {
  const bounds = passGraphBounds();
  const placeNames = new Set(PASS_PLACES.map((place) => place.name));
  return {
    rects: chartStrips(bounds),
    water: watersStrips(),
    bounds,
    marks: [
      ...PASS_GATES.map((gate) => ({ x: gate.x, z: gate.z, name: gate.name })),
      ...PASS_PLACES,
      ...PASS_GRAPH.pois
        .filter((poi) => !placeNames.has(poiName(poi.id, poi.label)))
        .map((poi) => ({
          ...gridToWorld(poi.gx, poi.gy),
          name: poiName(poi.id, poi.label),
          role: poi.id.startsWith("nm_") ? "nm" as const : undefined,
        })),
    ],
    grid: { x0: PASS_X, z0: PASS_Z, cell: PASS_CELL },
    paths: PASS_GRAPH.edges.map((edge) => ({
      width: edge.width ?? PASS_WIDTH,
      pts: edge.pts.map((pt) => gridToWorld(pt[0], pt[1])),
    })),
    discs: PASS_DISCS.map((disc) => ({ x: disc.x, z: disc.z, r: disc.r })),
  };
}

export function passChart(_x: number, _z: number): PassChart {
  if (!cachedChart) cachedChart = buildPassChart();
  return cachedChart;
}

/**
 * A save whose square is on the Ranguemont sheet but off the traced tunnel.
 * Null when the point is not on that sheet. Never a city point.
 */
export function seatPassSave(x: number, z: number): { x: number; z: number } | null {
  const col = Math.floor((x - PASS_X) / PASS_CELL);
  const row = Math.floor((z - PASS_Z) / PASS_CELL);
  if (col < 0 || col >= 15 || row < 0 || row >= 15) return null;
  if (inPass(x, z, 0.2)) return { x, z };
  const snapped = clampPassGraph(x, z, 0.36);
  if (Number.isFinite(snapped.x) && Number.isFinite(snapped.z) && inPass(snapped.x, snapped.z, 0)) return snapped;
  return { x: PASS_ARRIVE.x, z: PASS_ARRIVE.z };
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

function maskMiss(): string {
  const mask = buildPassMask(8);
  const { res, n, data } = mask;
  const at = (gx: number, gy: number) => ({ i: Math.floor(gx * res), j: Math.floor(gy * res) });
  const east = graphNode("exit_east_ronfaure");
  const start = at(east.gx, east.gy);
  const id = (i: number, j: number) => j * n + i;
  if (start.i < 0 || start.j < 0 || start.i >= n || start.j >= n || !data[id(start.i, start.j)]) return "exit_east_ronfaure";
  const seen = new Uint8Array(n * n);
  const queue = [start.i, start.j];
  seen[id(start.i, start.j)] = 1;
  const step = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ] as const;
  for (let head = 0; head < queue.length; head += 2) {
    const i = queue[head];
    const j = queue[head + 1];
    for (const [di, dj] of step) {
      const ni = i + di;
      const nj = j + dj;
      if (ni < 0 || nj < 0 || ni >= n || nj >= n) continue;
      const key = id(ni, nj);
      if (seen[key] || !data[key]) continue;
      seen[key] = 1;
      queue.push(ni, nj);
    }
  }
  const reached = new Set<string>();
  const pending: string[] = [];
  for (const node of PASS_GRAPH.nodes) {
    const cellAt = at(node.gx, node.gy);
    const onMask = cellAt.i >= 0 && cellAt.j >= 0 && cellAt.i < n && cellAt.j < n && seen[id(cellAt.i, cellAt.j)] === 1;
    if (onMask) reached.add(node.id);
    else pending.push(node.id);
  }
  // e_waters_pool is 0.1 squares wide. A res-8 cell is 0.125, so the mask
  // drops the neck even though the centerline stays inside. Follow that edge.
  let grew = true;
  while (grew && pending.length) {
    grew = false;
    for (let i = pending.length - 1; i >= 0; i--) {
      const idNode = pending[i];
      const linked = PASS_GRAPH.edges.some((edge) => {
        const other = edge.from === idNode ? edge.to : edge.to === idNode ? edge.from : "";
        if (!other || !reached.has(other)) return false;
        return edge.pts.every((pt) => {
          const atWorld = gridToWorld(pt[0], pt[1]);
          return inPass(atWorld.x, atWorld.z, 0);
        });
      });
      if (!linked) continue;
      reached.add(idNode);
      pending.splice(i, 1);
      grew = true;
    }
  }
  return pending.join(",");
}

let passGraphLogged = false;

function logPassGraph(): void {
  if (passGraphLogged || !import.meta.env?.DEV) return;
  passGraphLogged = true;
  console.log(`pass graph ${PASS_GRAPH.nodes.length} nodes, ${PASS_GRAPH.edges.length} edges`);
}

export function assertPass(): void {
  if (PASS_CELL !== 48) throw new Error("pass cell");
  const grid = ZONE_GRIDS.find((g) => g.zone === "ranguemont");
  if (!grid || grid.x0 !== PASS_X || grid.z0 !== PASS_Z || grid.cell !== PASS_CELL || grid.cols !== 15 || grid.rows !== 15) {
    throw new Error("pass grid");
  }
  if (passSquare(PASS_ARRIVE.x, PASS_ARRIVE.z) !== "G-12") throw new Error("arrival square");
  if (passSquare(glacierStand.x, glacierStand.z) !== "L-4") throw new Error("glacier stand");
  if (passSquare(PASS_FROM_GLACIER.x, PASS_FROM_GLACIER.z) !== "L-4") throw new Error("glacier return square");
  if (passSquare(gridToWorld(watersNode.gx, watersNode.gy).x, gridToWorld(watersNode.gx, watersNode.gy).z) !== "E-5") {
    throw new Error("waters square");
  }
  if (passSquare(enterAt.x, enterAt.z) !== "F-10") throw new Error("enter door square");
  if (passSquare(exitAt.x, exitAt.z) !== "E-10") throw new Error("exit door square");
  if (!inPass(PASS_FROM_GLACIER.x, PASS_FROM_GLACIER.z, 0.36)) throw new Error("return from the glacier");
  if (passSquare(TOMES[0].x, TOMES[0].z) !== "F-11") throw new Error("entrance tome");
  if (passSquare(TOMES[1].x, TOMES[1].z) !== "G-8") throw new Error("mid tome");
  if (passSquare(TOMES[2].x, TOMES[2].z) !== "L-4") throw new Error("glacier tome");
  if (!inPass(PASS_ARRIVE.x, PASS_ARRIVE.z, 0.36)) throw new Error("arrival stand");
  if (!inPass(PASS_NPCS.perchond.x, PASS_NPCS.perchond.z, 0.4) || !inPass(PASS_NPCS.myffore.x, PASS_NPCS.myffore.z, 0.4)) {
    throw new Error("entrance npc");
  }
  for (const node of PASS_GRAPH.nodes) {
    const at = gridToWorld(node.gx, node.gy);
    if (!inPass(at.x, at.z, 0)) throw new Error(`${node.id} left the pass`);
  }
  const poolDisc = PASS_DISCS.find((disc) => disc.node === "pool_round");
  const springDisc = PASS_DISCS.find((disc) => disc.node === "waters_room");
  if (!poolDisc || !springDisc || !passWet(poolDisc.x, poolDisc.z) || !passWet(springDisc.x, springDisc.z)) {
    throw new Error("pool water left the room");
  }
  const beside = gridToWorld(4.26, 3.875);
  if (passWet(beside.x, beside.z) || !inPass(beside.x, beside.z, 0)) throw new Error("tunnel beside the pool");
  const missed = maskMiss();
  if (missed) throw new Error(`pass is split ${missed}`);
  const hole = floorHoles();
  if (hole) throw new Error(`pass floor hole ${hole}`);
  for (const rect of ROOMS) {
    if (rect.minX < -1860 || rect.maxX > 980 || rect.minZ < -490 || rect.maxZ > 1720) throw new Error("pass leaves the place box");
    if (rect.maxZ > 180 || rect.minX < 120) throw new Error("pass climbed into another zone");
  }
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
  const inDoor = PASS_GRAPH.edges.find((edge) => edge.id === "e_in_door");
  if (!inDoor || inDoor.pts.length < 3) throw new Error("e_in_door");
  const room = gridToWorld(graphNode("room_inner").gx, graphNode("room_inner").gy);
  const pastEnter = gridToWorld(inDoor.pts[2][0], inDoor.pts[2][1]);
  const beforeExit = gridToWorld(exitSegA[0], exitSegA[1]);
  const atExit = gridToWorld(exitSegB[0], exitSegB[1]);
  if (oneWayBlocks(room.x, room.z, pastEnter.x, pastEnter.z)) throw new Error("enter door blocks the way in");
  if (!oneWayBlocks(pastEnter.x, pastEnter.z, room.x, room.z)) throw new Error("enter door lets you back out");
  if (oneWayBlocks(beforeExit.x, beforeExit.z, atExit.x, atExit.z)) throw new Error("exit door blocks the way out");
  if (!oneWayBlocks(atExit.x, atExit.z, beforeExit.x, beforeExit.z)) throw new Error("exit door lets you in");
  if (clampPass(EAST_MOUTH.ranguemont.x, EAST_MOUTH.ranguemont.z, 0)) throw new Error("pass clamp reaches East Ronfaure");
  if (clampPass(0, 0, 0) || clampPass(-8, -400, 0)) throw new Error("pass clamp reaches the city");
  if (passSquare(491.6, -348.7) !== "I-3") throw new Error("I-3 square");
  const seated = seatPassSave(491.6, -348.7);
  if (!seated || !inPass(seated.x, seated.z, 0)) throw new Error("pass save left the graph");
  if (Math.hypot(seated.x, seated.z + 300) < 120) throw new Error("pass save went to Northern San d'Oria");
  if (seatPassSave(0, 0) || seatPassSave(677.2, 493.4)) throw new Error("pass save grabbed another zone");
  const chart = passChart(0, 0);
  if (chart.paths.length !== PASS_GRAPH.edges.length || !chart.rects.length || !chart.water.length) throw new Error("pass chart");
  if (!chart.paths.some((path) => path.width === 0.1)) throw new Error("pass chart neck");
  const spring = PASS_DISCS.find((disc) => disc.node === "waters_room");
  if (!spring) throw new Error("waters disc");
  for (const strip of chart.water) {
    const cx = (strip.minX + strip.maxX) / 2;
    const cz = (strip.minZ + strip.maxZ) / 2;
    if (Math.hypot(cx - spring.x, cz - spring.z) > spring.r + 1) throw new Error("pass chart water");
  }
  if (PASS_GRAPH.nodes.length !== 17 || PASS_GRAPH.edges.length !== 17) {
    throw new Error(`pass graph ${PASS_GRAPH.nodes.length} nodes, ${PASS_GRAPH.edges.length} edges`);
  }
  for (const n of PASS_GRAPH.nodes) {
    const at = gridToWorld(n.gx, n.gy);
    const got = passSquare(at.x, at.z);
    if (got !== n.grid) throw new Error(`${n.id} ${n.grid} is ${got}`);
    for (const e of PASS_GRAPH.edges) {
      if (e.from === n.id) {
        const p = e.pts[0];
        if (!p || Math.hypot(p[0] - n.gx, p[1] - n.gy) > 0.05) throw new Error(`${e.id} leaves ${n.id}`);
      }
      if (e.to === n.id) {
        const p = e.pts[e.pts.length - 1];
        if (!p || Math.hypot(p[0] - n.gx, p[1] - n.gy) > 0.05) throw new Error(`${e.id} arrives ${n.id}`);
      }
    }
  }
  const east = PASS_GRAPH.nodes.find((n) => n.id === "exit_east_ronfaure");
  const ice = PASS_GRAPH.nodes.find((n) => n.id === "exit_beaucedine");
  if (east?.grid !== "G-12" || east.to !== "east_ronfaure" || ice?.grid !== "L-4" || ice.to !== "beaucedine_glacier") {
    throw new Error("pass graph exits");
  }
  const eastAt = gridToWorld(graphNode("exit_east_ronfaure").gx, graphNode("exit_east_ronfaure").gy);
  const iceAt = gridToWorld(graphNode("exit_beaucedine").gx, graphNode("exit_beaucedine").gy);
  const eastGate = PASS_GATES.find((gate) => gate.to === "east-ronfaure");
  const iceGate = PASS_GATES.find((gate) => gate.to === "beaucedine");
  if (!eastGate || eastGate.name !== "East Ronfaure") throw new Error("east gate name");
  if (!iceGate || !iceGate.name.includes("Beaucedine")) throw new Error("beaucedine gate name");
  const eastSquares = Math.hypot(eastGate.x - eastAt.x, eastGate.z - eastAt.z) / PASS_CELL;
  const iceSquares = Math.hypot(iceGate.x - iceAt.x, iceGate.z - iceAt.z) / PASS_CELL;
  if (eastSquares > 0.2) throw new Error(`east gate is ${eastSquares.toFixed(3)} squares out`);
  if (iceSquares > 0.2) throw new Error(`beaucedine gate is ${iceSquares.toFixed(3)} squares out`);
  for (const poi of PASS_GRAPH.pois) {
    const at = gridToWorld(poi.gx, poi.gy);
    if (!inPass(at.x, at.z)) throw new Error(`${poi.id} left the pass`);
    const got = passSquare(at.x, at.z);
    if (got !== poi.grid) throw new Error(`${poi.id} ${poi.grid} is ${got}`);
  }
  const open = new Set<string>();
  if (!reachable("exit_east_ronfaure", open).has("exit_beaucedine")) throw new Error("G-12 does not reach L-4");
  if (!reachable("west_fork", open).has("exit_east_ronfaure")) throw new Error("west fork cannot return south");
  if (!reachable("exit_beaucedine", open).has("exit_east_ronfaure")) throw new Error("L-4 cannot return south");
  if (graphNext("west_fork", open).includes("room_inner")) throw new Error("enter door lets the graph back south");
  const exitCut = new Set(
    PASS_GRAPH.edges.filter((edge) => edge.from === "door_exit_only" || edge.to === "door_exit_only").map((edge) => edge.id),
  );
  if (exitCut.size < 2) throw new Error("exit door edges");
  if (reachable("west_fork", exitCut).has("exit_east_ronfaure")) throw new Error("return skips the exit door");
  if (reachable("exit_beaucedine", exitCut).has("exit_east_ronfaure")) throw new Error("glacier return skips the exit door");
  if (reachable("west_fork", exitCut).has("room_inner")) throw new Error("south path skips the exit door");
  for (const pt of chartPoints(chart.bounds)) {
    const walk = inPass(pt.x, pt.z);
    const map = inStrips(chart.rects, pt.x, pt.z);
    if (walk !== map) throw new Error(`minimap ${pt.x.toFixed(2)},${pt.z.toFixed(2)} walk ${walk} map ${map}`);
  }
  const sheetX = PASS_X + 15 * PASS_CELL;
  const sheetZ = PASS_Z + 15 * PASS_CELL;
  for (let z = PASS_Z; z <= sheetZ; z += 3) {
    for (let x = PASS_X; x <= sheetX; x += 3) {
      if (!inPass(x, z)) continue;
      if (x < chart.bounds.minX || x > chart.bounds.maxX || z < chart.bounds.minZ || z > chart.bounds.maxZ) {
        throw new Error(`inPass outside the graph ${x.toFixed(1)},${z.toFixed(1)}`);
      }
    }
  }
  const gates = sealedGateSpots();
  if (gates.length !== 2) throw new Error(`sealed gates ${gates.length}`);
  const enterGate = gates.find((gate) => gate.id === "enter");
  const exitGate = gates.find((gate) => gate.id === "exit");
  if (!enterGate || Math.hypot(enterGate.x - enterAt.x, enterGate.z - enterAt.z) > PASS_CELL) throw new Error("enter gate left F-10");
  if (!exitGate || Math.hypot(exitGate.x - exitAt.x, exitGate.z - exitAt.z) > PASS_CELL) throw new Error("exit gate left E-10");
  for (const gate of gates) {
    const centre = gate.axis === "z" ? gate.z : gate.x;
    if (Math.abs(centre - gate.at) > PASS_CELL * 0.1) throw new Error(`${gate.id} panel left the door line`);
    if (!(gate.wallW >= gate.span * 0.95)) throw new Error(`${gate.id} wall spans ${gate.wallW.toFixed(2)} of ${gate.span.toFixed(2)}`);
    if (!(Math.abs(gate.tilt) <= (10 * Math.PI) / 180 + 1e-9)) {
      throw new Error(`${gate.id} tilts ${((gate.tilt * 180) / Math.PI).toFixed(2)} deg`);
    }
  }
  logPassGraph();
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

function torch(add: Add, hang: HangTorch, x: number, z: number, hung: V2[], force = false) {
  if (!force) for (const held of hung) if (Math.hypot(held.x - x, held.z - z) < 5.5) return;
  hung.push({ x, z });
  add(0x2a3138, 0.28, 1.5, 0.28, x, 0.75, z);
  hang(x, z);
}

/** Red sealed doorway across the one-way line. The rule stays in PASS_DOORS. */
const CROSS_H = 6.4;
const CROSS_T = 2.2;
const CROSS_JOIN = 2.6;
const OPEN_FRAC = 0.6;
const OPEN_H = 5;

/** True when the door face is within 35° of parallel to the camera view. E-10 is, F-10 is not. */
function faceParallel(yaw: number, cam: { x: number; z: number }): boolean {
  const cl = Math.hypot(cam.x, cam.z) || 1;
  const along = Math.abs(Math.sin(yaw) * (cam.x / cl) + Math.cos(yaw) * (cam.z / cl));
  return Math.asin(Math.min(1, along)) <= (35 * Math.PI) / 180;
}
function doorTilt(yaw: number, cam: { x: number; z: number }): number {
  const cl = Math.hypot(cam.x, cam.z) || 1;
  const facing = Math.min(1, Math.abs(Math.sin(yaw) * (cam.x / cl) + Math.cos(yaw) * (cam.z / cl)));
  return ((2 + 7.5 * (1 - facing)) * Math.PI) / 180;
}

/** Walkable chord where the blocking line crosses the tunnel. */
function crossSpan(axis: "x" | "z", at: number, cross: number): { mid: number; span: number } {
  const clear = (t: number) => passClearance(axis === "z" ? t : at, axis === "z" ? at : t);
  const walk = (dir: number) => {
    let t = cross;
    let room = clear(t);
    if (room < 0) return t;
    for (let i = 0; i < 500; i++) {
      const next = t + dir * 0.05;
      const ahead = clear(next);
      if (ahead < 0) {
        const gap = room - ahead;
        return gap > 1e-6 ? t + dir * 0.05 * (room / gap) : t;
      }
      t = next;
      room = ahead;
    }
    return t;
  };
  const lo = walk(-1);
  const hi = walk(1);
  return { mid: (lo + hi) / 2, span: Math.max(0, hi - lo) };
}

export type SealedGateSpot = {
  id: "enter" | "exit";
  x: number;
  z: number;
  yaw: number;
  panelW: number;
  wallW: number;
  tilt: number;
  axis: "x" | "z";
  at: number;
  span: number;
  dir: 1 | -1;
};

export function passDoorSpot(which: "enter" | "exit", cam: { x: number; z: number } = { x: 0, z: 1 }) {
  const gate = sealedGateSpots(cam).find((item) => item.id === which);
  if (!gate) throw new Error(which);
  return { x: gate.x, z: gate.z, yaw: gate.yaw };
}

/** The only two sealed doors. The panel sits on the blocking line; the wall crosses the tunnel. */
export function sealedGateSpots(cam: { x: number; z: number } = { x: 0, z: 1 }): SealedGateSpot[] {
  const enterDoor = PASS_DOORS[0];
  const exitDoor = PASS_DOORS[1];
  const enterSpan = crossSpan(enterDoor.axis, enterDoor.at, enterAt.x);
  const exitSpan = crossSpan(exitDoor.axis, exitDoor.at, exitAt.z);
  const spot = (
    id: "enter" | "exit",
    x: number,
    z: number,
    yaw: number,
    axis: "x" | "z",
    at: number,
    span: number,
    dir: 1 | -1,
  ): SealedGateSpot => ({
    id,
    x,
    z,
    yaw,
    panelW: span * OPEN_FRAC,
    wallW: span + CROSS_JOIN * 2,
    tilt: doorTilt(yaw, cam),
    axis,
    at,
    span,
    dir,
  });
  return [
    spot("enter", enterSpan.mid, enterDoor.at, 0, enterDoor.axis, enterDoor.at, enterSpan.span, enterDoor.dir),
    spot("exit", exitDoor.at, exitSpan.mid, -Math.PI / 2, exitDoor.axis, exitDoor.at, exitSpan.span, exitDoor.dir),
  ];
}

function sealedGate(
  addYaw: AddYaw,
  addRed: AddRed,
  addCue: AddCue,
  hang: HangTorch,
  hung: V2[],
  gate: SealedGateSpot,
  cam: { x: number; z: number },
): void {
  const { x, z, yaw } = gate;
  const openW = gate.panelW;
  const wallW = gate.wallW;
  const sideW = (wallW - openW) / 2;
  const y0 = -0.1;
  const top = y0 + CROSS_H;
  const openTop = y0 + OPEN_H;
  const wallZ = 0.3 - CROSS_T / 2;
  const c = Math.cos(yaw);
  const s = Math.sin(yaw);
  const place = (lx: number, ly: number, lz: number, w: number, h: number, d: number, tag: string) => {
    addYaw(0, w, h, d, x + lx * c + lz * s, ly, z - lx * s + lz * c, yaw, tag);
  };
  const jambH = openTop - y0 + 0.05;
  const sideX = openW / 2 + sideW / 2;
  place(-sideX, y0 + jambH / 2, wallZ, sideW, jambH, CROSS_T, "wall");
  place(sideX, y0 + jambH / 2, wallZ, sideW, jambH, CROSS_T, "wall");
  const lintelH = top - openTop + 0.08;
  place(0, (openTop - 0.08 + top) / 2, wallZ, wallW, lintelH, CROSS_T - 0.04, "lintel");
  addRed(openW + 0.28, OPEN_H + 0.12, 0, 0, 0, x, y0 + OPEN_H / 2, z, yaw, gate.tilt, cam.x, cam.z);
  const blocked = wallZ - CROSS_T / 2;
  const tread = 0.74;
  const rise = 0.16;
  for (let i = 0; i < 3; i++) {
    const h = rise * (3 - i);
    const zInner = blocked + 0.05 - i * (tread - 0.04);
    place(0, -0.06 + h / 2, zInner - tread / 2, openW, h, tread, "step");
  }
  for (const side of [-1, 1]) {
    const lx = side * (openW / 2 + 0.65);
    const lz = blocked - 0.22;
    place(lx, 3.15, lz, 0.36, 0.18, 0.5, "sconce");
    const tx = x + lx * c + (lz - 0.16) * s;
    const tz = z - lx * s + (lz - 0.16) * c;
    hung.push({ x: tx, z: tz });
    hang(tx, tz, 3.22);
  }
  if (!faceParallel(yaw, cam)) return;
  const at = (lx: number, lz: number) => ({ x: x + lx * c + lz * s, z: z - lx * s + lz * c });
  const capAt = at(0, wallZ);
  addCue("cap", openW, 0.25, 0.3, capAt.x, top + 0.125, capAt.z, yaw);
  const outer = blocked + 0.05 - 2 * (tread - 0.04) - tread;
  const glowAt = at(0, outer - 0.2);
  addCue("glow", openW, 0, 0.4, glowAt.x, 0.02, glowAt.z, yaw);
}

/** Stone still opens the old mouths. The live gates are the traced exits. */
const MESH_GATES: readonly PassGate[] = [
  {
    id: "pass-east",
    name: "East Ronfaure",
    x: cell(5.5, 11.95).x,
    z: cell(5.5, 11.95).z,
    hx: 5.4,
    hz: 2.1,
    to: "east-ronfaure",
    side: "s",
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
  },
];

function pointKey(p: V2): string {
  return `${Math.round(p.x * 1000)},${Math.round(p.z * 1000)}`;
}

function distPointSeg(p: V2, a: V2, b: V2): number {
  const dx = b.x - a.x;
  const dz = b.z - a.z;
  const len2 = dx * dx + dz * dz;
  if (len2 < 1e-8) return Math.hypot(p.x - a.x, p.z - a.z);
  const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.z - a.z) * dz) / len2));
  return Math.hypot(p.x - (a.x + t * dx), p.z - (a.z + t * dz));
}

function douglas(pts: V2[], tol: number): V2[] {
  if (pts.length < 3) return pts.slice();
  const a = pts[0];
  const b = pts[pts.length - 1];
  const closed = a.x === b.x && a.z === b.z;
  let far = 0;
  let idx = 0;
  for (let i = 1; i < pts.length - 1; i++) {
    const d = closed ? Math.hypot(pts[i].x - a.x, pts[i].z - a.z) : distPointSeg(pts[i], a, b);
    if (d > far) {
      far = d;
      idx = i;
    }
  }
  if (far <= tol) return [a, b];
  const left = douglas(pts.slice(0, idx + 1), tol);
  const right = douglas(pts.slice(idx), tol);
  return [...left.slice(0, -1), ...right];
}

function chainContours(segs: [V2, V2][]): V2[][] {
  const pts = new Map<string, V2>();
  const adj = new Map<string, string[]>();
  const link = (a: V2, b: V2) => {
    const ka = pointKey(a);
    const kb = pointKey(b);
    if (ka === kb) return;
    pts.set(ka, a);
    pts.set(kb, b);
    const la = adj.get(ka) ?? [];
    if (!la.includes(kb)) la.push(kb);
    adj.set(ka, la);
    const lb = adj.get(kb) ?? [];
    if (!lb.includes(ka)) lb.push(ka);
    adj.set(kb, lb);
  };
  for (const [a, b] of segs) link(a, b);
  const used = new Set<string>();
  const edgeKey = (a: string, b: string) => (a < b ? `${a}|${b}` : `${b}|${a}`);
  const loops: V2[][] = [];
  for (const start of adj.keys()) {
    for (const next of adj.get(start) ?? []) {
      if (used.has(edgeKey(start, next))) continue;
      const loop: V2[] = [pts.get(start)!];
      let prev = start;
      let cur = next;
      used.add(edgeKey(prev, cur));
      let guard = 0;
      while (cur !== start && guard++ < segs.length + 2) {
        loop.push(pts.get(cur)!);
        let found = "";
        for (const cand of adj.get(cur) ?? []) {
          if (cand === prev || used.has(edgeKey(cur, cand))) continue;
          found = cand;
          break;
        }
        if (!found) break;
        used.add(edgeKey(cur, found));
        prev = cur;
        cur = found;
      }
      if (loop.length < 2) continue;
      if (cur === start) loop.push(pts.get(start)!);
      loops.push(loop);
    }
  }
  return loops;
}

/** Marching squares on the traced mask. Walls are visual; the tunnel clamp is the collider. */
function passWalls(addYaw: AddYaw, toCamera: { x: number; z: number }, spots: V2[], addSkirt: AddSkirt): void {
  const mask = buildPassMask(16);
  const cell = PASS_CELL / mask.res;
  const { n, data } = mask;
  const sx = (i: number) => PASS_X + (i + 0.5) * cell;
  const sz = (j: number) => PASS_Z + (j + 0.5) * cell;
  const on = (i: number, j: number) => i >= 0 && j >= 0 && i < n && j < n && data[j * n + i] === 1;
  const segs: [V2, V2][] = [];
  for (let j = 0; j < n - 1; j++) {
    for (let i = 0; i < n - 1; i++) {
      const code = (on(i, j) ? 1 : 0) | (on(i + 1, j) ? 2 : 0) | (on(i + 1, j + 1) ? 4 : 0) | (on(i, j + 1) ? 8 : 0);
      if (code === 0 || code === 15) continue;
      const north: V2 = { x: (sx(i) + sx(i + 1)) / 2, z: sz(j) };
      const south: V2 = { x: (sx(i) + sx(i + 1)) / 2, z: sz(j + 1) };
      const west: V2 = { x: sx(i), z: (sz(j) + sz(j + 1)) / 2 };
      const east: V2 = { x: sx(i + 1), z: (sz(j) + sz(j + 1)) / 2 };
      const cx = (sx(i) + sx(i + 1)) / 2;
      const cz = (sz(j) + sz(j + 1)) / 2;
      const centerIn = inPassGraph(cx, cz);
      const pair = (a: V2, b: V2) => segs.push([a, b]);
      if (code === 5) {
        if (centerIn) {
          pair(north, east);
          pair(west, south);
        } else {
          pair(north, west);
          pair(east, south);
        }
        continue;
      }
      if (code === 10) {
        if (centerIn) {
          pair(north, west);
          pair(east, south);
        } else {
          pair(north, east);
          pair(west, south);
        }
        continue;
      }
      const table: Record<number, [V2, V2]> = {
        1: [north, west],
        2: [north, east],
        3: [west, east],
        4: [east, south],
        6: [north, south],
        7: [west, south],
        8: [west, south],
        9: [north, south],
        11: [east, south],
        12: [east, west],
        13: [north, east],
        14: [north, west],
      };
      const hit = table[code];
      if (hit) pair(hit[0], hit[1]);
    }
  }
  const rock = 0x5c6772;
  const rockDark = 0x454e58;
  const tall = 6.4;
  const lipH = 0.6;
  const thick = 2.2;
  const camLen = Math.hypot(toCamera.x, toCamera.z) || 1;
  const camX = toCamera.x / camLen;
  const camZ = toCamera.z / camLen;
  let band = 0;
  for (const loop of chainContours(segs)) {
    const simple = douglas(loop, 1.5);
    let run = 0;
    for (let i = 0; i + 1 < simple.length; i++) {
      const a = simple[i];
      const b = simple[i + 1];
      const dx = b.x - a.x;
      const dz = b.z - a.z;
      const len = Math.hypot(dx, dz);
      if (len < 0.15) continue;
      const mx = (a.x + b.x) / 2;
      const mz = (a.z + b.z) / 2;
      const nx = -dz / len;
      const nz = dx / len;
      const reach = 3;
      const into = passClearance(mx + nx * reach, mz + nz * reach) <= passClearance(mx - nx * reach, mz - nz * reach)
        ? { x: nx, z: nz }
        : { x: -nx, z: -nz };
      const lip = into.x * camX + into.z * camZ > 0.3;
      const height = lip ? lipH : tall;
      const color = lip ? rockDark : band % 2 === 0 ? rock : rockDark;
      band += 1;
      if (!lip) {
        let walked = 0;
        const ux = dx / len;
        const uz = dz / len;
        while (run + (len - walked) >= 36 - 1e-6) {
          const need = 36 - run;
          walked += need;
          run = 0;
          let tx = a.x + ux * walked - into.x * 1.25;
          let tz = a.z + uz * walked - into.z * 1.25;
          if (!inPassGraph(tx, tz, 0.05)) {
            tx = a.x + ux * walked - into.x * 0.55;
            tz = a.z + uz * walked - into.z * 0.55;
          }
          if (inPassGraph(tx, tz, 0.02)) spots.push({ x: tx, z: tz });
        }
        run += len - walked;
      } else run = 0;
      addYaw(color, len + 0.4, height, thick, mx + into.x * 1.1, height / 2 - 0.1, mz + into.z * 1.1, -Math.atan2(dz, dx));
      addSkirt(len + 0.4, mx + into.x * 0.06, mz + into.z * 0.06, dx / len, dz / len, -into.x, -into.z);
    }
  }
}

function junctionIds(): string[] {
  const degree = new Map<string, number>();
  for (const node of PASS_GRAPH.nodes) degree.set(node.id, 0);
  for (const edge of PASS_GRAPH.edges) {
    degree.set(edge.from, (degree.get(edge.from) ?? 0) + 1);
    degree.set(edge.to, (degree.get(edge.to) ?? 0) + 1);
  }
  return [...degree.entries()].filter(([, count]) => count >= 3).map(([id]) => id);
}

function propSpot(x: number, z: number, reach: number): V2 {
  for (let k = 0; k < 16; k++) {
    const ang = (k / 16) * Math.PI * 2;
    const px = x + Math.cos(ang) * reach;
    const pz = z + Math.sin(ang) * reach;
    if (inPassGraph(px, pz, 0.2)) return { x: px, z: pz };
  }
  return { x, z };
}

function discSlab(disc: { x: number; z: number; r: number }): PassRect {
  return { minX: disc.x - disc.r, maxX: disc.x + disc.r, minZ: disc.z - disc.r, maxZ: disc.z + disc.r };
}

function pillarAt(id: string): V2 {
  const node = graphNode(id);
  const at = gridToWorld(node.gx, node.gy);
  let best = at;
  let score = -1;
  for (const reach of [2.4, 1.8]) {
    for (let k = 0; k < 24; k++) {
      const ang = (k / 24) * Math.PI * 2;
      const x = at.x + Math.cos(ang) * reach;
      const z = at.z + Math.sin(ang) * reach;
      if (!inPassGraph(x, z, 0.8)) continue;
      let minLine = Infinity;
      for (const edge of PASS_GRAPH.edges) {
        if (edge.from !== id && edge.to !== id) continue;
        for (let i = 0; i + 1 < edge.pts.length; i++) {
          const a = gridToWorld(edge.pts[i][0], edge.pts[i][1]);
          const b = gridToWorld(edge.pts[i + 1][0], edge.pts[i + 1][1]);
          minLine = Math.min(minLine, distPointSeg({ x, z }, a, b));
        }
      }
      if (minLine > score) {
        score = minLine;
        best = { x, z };
      }
    }
    if (score >= 1.3) break;
  }
  return best;
}

/** Cells that touch the tunnel, not only cells whose center is inside. */
function passFloorRects(): PassRect[] {
  const res = 16;
  const n = 15 * res;
  const cell = PASS_CELL / res;
  const pad = cell / Math.SQRT2 + 0.05;
  const on = new Uint8Array(n * n);
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < n; i++) {
      const p = gridToWorld((i + 0.5) / res, (j + 0.5) / res);
      if (passClearance(p.x, p.z) >= -pad) on[j * n + i] = 1;
    }
  }
  const out: PassRect[] = [];
  for (let j = 0; j < n; j++) {
    let i = 0;
    while (i < n) {
      if (!on[j * n + i]) {
        i += 1;
        continue;
      }
      const start = i;
      while (i < n && on[j * n + i]) i += 1;
      out.push({
        minX: PASS_X + start * cell,
        maxX: PASS_X + i * cell,
        minZ: PASS_Z + j * cell,
        maxZ: PASS_Z + (j + 1) * cell,
      });
    }
  }
  return out;
}

function floorHoles(): string {
  const rects = passFloorRects();
  const covers = (x: number, z: number) =>
    rects.some((r) => x >= r.minX - 1e-4 && x <= r.maxX + 1e-4 && z >= r.minZ - 1e-4 && z <= r.maxZ + 1e-4);
  let seen = 0;
  for (let z = PASS_Z + 0.4; z < PASS_Z + 15 * PASS_CELL; z += 2.1) {
    for (let x = PASS_X + 0.4; x < PASS_X + 15 * PASS_CELL; x += 2.1) {
      if (!inPass(x, z, 0)) continue;
      seen += 1;
      if (!covers(x, z)) return `${x.toFixed(1)},${z.toFixed(1)} ${passSquare(x, z)}`;
    }
  }
  if (seen < 2000) return `only ${seen} floor samples`;
  return "";
}

export function buildPass(
  add: Add,
  colliders: Solid[],
  addYaw: AddYaw,
  toCamera: { x: number; z: number },
  addFlag: AddFlag,
  hangTorch: HangTorch,
  addSkirt: AddSkirt,
  addStone: AddStone,
  addRed: AddRed,
  addCue: AddCue,
): void {
  for (const rect of passFloorRects()) {
    addFlag(rect.maxX - rect.minX, rect.maxZ - rect.minZ, (rect.minX + rect.maxX) / 2, (rect.minZ + rect.maxZ) / 2);
  }
  for (const strip of watersStrips()) floorSlab(add, strip, 0x2f8faf, 0.05);
  const poolDisc = PASS_DISCS.find((disc) => disc.node === "pool_round");
  if (poolDisc) floorSlab(add, discSlab(poolDisc), 0x2f8faf, 0.05);
  const spots: V2[] = [];
  passWalls(addYaw, toCamera, spots, addSkirt);
  const camLen = Math.hypot(toCamera.x, toCamera.z) || 1;
  const northX = -toCamera.x / camLen;
  const northZ = -toCamera.z / camLen;
  for (const node of PASS_GRAPH.nodes) {
    if (node.kind !== "chamber") continue;
    const at = gridToWorld(node.gx, node.gy);
    let spot = at;
    for (const reach of [2.4, 1.6, 0.9]) {
      const x = at.x + northX * reach;
      const z = at.z + northZ * reach;
      if (inPassGraph(x, z, 0.15)) {
        spot = { x, z };
        break;
      }
    }
    spots.push(spot);
  }
  const hung: V2[] = [];
  for (const spot of spots) torch(add, hangTorch, spot.x, spot.z, hung);
  for (const gate of sealedGateSpots(toCamera)) sealedGate(addYaw, addRed, addCue, hangTorch, hung, gate, toCamera);
  for (const id of junctionIds()) {
    const at = pillarAt(id);
    pillar(add, colliders, at.x, at.z, 0x6a5830);
  }
  const joins = junctionIds().map((id) => pillarAt(id));
  for (const tome of TOMES) {
    const crowded = joins.some((at) => Math.hypot(tome.x - at.x, tome.z - at.z) < 1.3);
    const spot = crowded ? propSpot(tome.x, tome.z, 1.6) : tome;
    book(add, spot.x, spot.z);
  }
}
