/**
 * San d'Oria districts, traced from the retail Vana'diel atlas plates.
 * Grid units: gx 0 = column A, gy 0 = row 1, +gx east, +gy south.
 * World: x = x0 + gx * cell, z = z0 + gy * cell. Cell is 48 yalms.
 * (0,0) stays F-9 Southern. Northern F-7 is (0,-488). Port G-7 is (0,-874).
 * Walk polygons are the hand trace in scripts/hand-sandoria.py (plate pixels on the
 * A–O / 1–15 grid). Not an ink flood, and not a chain of square centres.
 */
import { SAN_CURB, SAN_PAINT } from "./sandoria-paint.generated.ts";
import { SAN_TRACE } from "./sandoria-trace.generated.ts";

export const SAN_CELL = 48;

export const SOUTH_GRID = { zone: "sandoria-south", x0: -264, z0: -408, cell: SAN_CELL, cols: 15, rows: 15 } as const;
export const NORTH_GRID = { zone: "sandoria-north", x0: -264, z0: -800, cell: SAN_CELL, cols: 15, rows: 15 } as const;
export const PORT_GRID = { zone: "sandoria-port", x0: -312, z0: -1186, cell: SAN_CELL, cols: 15, rows: 15 } as const;

export type SanGrid = { zone: string; x0: number; z0: number; cell: number; cols: number; rows: number };
export type SanNodeKind = "exit" | "junction" | "plaza" | "closed";
export type SanNode = { id: string; gx: number; gy: number; grid: string; kind: SanNodeKind; r?: number; to?: string };
export type SanEdge = { id: string; from: string; to: string; width?: number; pts: [number, number][] };
export type SanArea = { id: string; kind: "plaza" | "court" | "quay"; grid: string; pts: [number, number][] };
export type SanGraph = { id: "south" | "north" | "port"; nodes: SanNode[]; edges: SanEdge[]; areas: SanArea[] };

function cell(square: string): [number, number] {
  const col = square.charCodeAt(0) - 65;
  const row = Number(square.split("-")[1]) - 1;
  return [col + 0.5, row + 0.5];
}

function chain(id: string, width: number, squares: string[]): SanEdge {
  return { id, from: id, to: id, width, pts: squares.map(cell) };
}

/** Hand trace of the atlas streets. Not derived from the polylines below. */
export const SOUTH_RETAIL = [
  "B-5", "C-4", "C-5", "C-6", "C-7", "D-4", "D-5", "D-6", "D-7", "D-8",
  "E-6", "E-7", "E-8", "E-9", "F-5", "F-6", "F-7", "F-8", "F-9", "F-10", "F-11",
  "G-4", "G-5", "G-7", "G-8", "G-10", "G-11", "G-12",
  "H-3", "H-4", "H-5", "H-6", "H-7", "H-8", "H-10", "H-11",
  "I-3", "I-4", "I-6", "I-7", "I-9",
  "J-8", "J-9", "K-8", "K-9", "K-10", "L-6", "L-7", "L-8", "L-10",
  "M-4", "M-5", "M-6", "M-7", "N-4", "N-5",
] as const;

export const NORTH_RETAIL = [
  "C-4", "C-5", "C-6", "C-7", "C-8", "D-5", "D-6", "D-7", "D-8",
  "E-4", "E-5", "E-7", "E-8", "F-3", "F-4", "F-5", "F-7", "F-8",
  "G-6", "G-7", "G-8", "G-9", "H-5", "H-6", "H-7", "H-8", "H-9",
  "I-5", "I-6", "I-7", "I-8", "I-9", "I-10",
  "J-7", "J-8", "K-7", "K-8", "L-7", "L-8", "M-7", "M-8", "N-8",
] as const;

export const PORT_RETAIL = ["F-7", "F-8", "F-9", "F-10", "G-4", "G-5", "G-6", "G-7", "G-8", "G-9", "H-7"] as const;

export const SOUTH_GRAPH: SanGraph = {
  id: "south",
  nodes: [
    { id: "fountain", gx: 5.5, gy: 7.5, grid: "F-8", kind: "plaza", r: 0.22 },
    { id: "exit_ronfaure", gx: 5.5, gy: 9.5, grid: "F-10", kind: "exit", to: "ronfaure-south", r: 0.16 },
    { id: "exit_east", gx: 11.5, gy: 9.5, grid: "L-10", kind: "exit", to: "east-ronfaure", r: 0.16 },
    { id: "exit_north", gx: 8.5, gy: 6.5, grid: "I-7", kind: "exit", to: "sandoria-north", r: 0.16 },
    { id: "chocobo", gx: 7.5, gy: 10.5, grid: "H-11", kind: "closed", r: 0.14 },
  ],
  edges: [
    chain("west_spine", 0.52, ["F-8", "F-9", "F-10", "F-11"]),
    chain("watchdog", 0.34, ["G-8", "G-7", "H-7", "H-6"]),
    { id: "watch_link", from: "watchdog", to: "exit_north", width: 0.12, pts: [cell("H-6"), cell("I-6"), [8.5, 5.82]] },
    { id: "watch_gate", from: "watchdog", to: "exit_north", width: 0.48, pts: [[8.5, 5.82], cell("I-7")] },
    chain("west_shops", 0.32, ["B-5", "C-5", "C-4", "D-4", "D-5", "D-6", "C-6", "C-7", "D-7", "E-7", "E-6", "D-8", "E-8", "E-9", "F-9"]),
    chain("north_shops", 0.32, ["F-8", "F-7", "F-6", "F-5", "G-5", "G-4", "H-4", "H-5", "H-3", "I-3", "I-4"]),
    chain("cavalry", 0.48, ["H-8", "H-9", "I-9", "J-9", "K-9", "K-10", "L-10"]),
    chain("lion_square", 0.32, ["J-8", "K-8", "L-8", "L-7", "M-7", "L-6", "M-6", "M-5", "N-5", "N-4", "M-4"]),
    chain("chocobo_road", 0.46, ["F-11", "G-11", "G-10", "H-10", "H-11", "G-12"]),
  ],
  areas: [
    {
      id: "victory",
      kind: "plaza",
      grid: "F-8",
      pts: [
        [5.22, 7.28],
        [7.78, 7.28],
        [7.78, 7.74],
        [5.22, 7.74],
      ],
    },
  ],
};

export const NORTH_GRAPH: SanGraph = {
  id: "north",
  nodes: [
    { id: "court", gx: 5.5, gy: 6.5, grid: "F-7", kind: "plaza", r: 0.28 },
    { id: "exit_south", gx: 8.5, gy: 9.5, grid: "I-10", kind: "exit", to: "sandoria-south", r: 0.08 },
    { id: "exit_west", gx: 2.5, gy: 7.5, grid: "C-8", kind: "exit", to: "ronfaure-north", r: 0.16 },
    { id: "exit_d7", gx: 3.5, gy: 6.5, grid: "D-7", kind: "exit", to: "ronfaure-north", r: 0.16 },
    { id: "exit_port", gx: 5.5, gy: 2.5, grid: "F-3", kind: "exit", to: "sandoria-port", r: 0.16 },
    { id: "chateau", gx: 8.5, gy: 5.5, grid: "I-6", kind: "closed", r: 0.12 },
    { id: "landing", gx: 5.5, gy: 4.5, grid: "F-5", kind: "closed", r: 0.12 },
  ],
  edges: [
    chain("west_row", 0.52, ["C-8", "D-8", "E-8", "F-8", "G-8", "H-8"]),
    chain("row_seven", 0.56, ["D-7", "E-7", "F-7", "G-7", "H-7"]),
    chain("d7_jog", 0.4, ["D-8", "D-7"]),
    chain("guilds", 0.32, ["C-8", "C-7", "C-6", "C-5", "C-4", "D-5", "D-6"]),
    chain("to_port", 0.48, ["E-5", "F-5", "E-4", "F-4", "F-3"]),
    chain("chateau_way", 0.46, ["G-7", "G-6", "H-6", "I-6", "H-5", "I-5", "I-7", "I-8"]),
    chain("to_south", 0.24, ["H-8", "H-9", "G-9", "I-9", "I-10"]),
    chain("residential", 0.32, ["I-8", "J-8", "K-8", "L-8", "L-7", "M-7", "M-8", "N-8", "K-7", "J-7"]),
  ],
  areas: [
    {
      id: "parade",
      kind: "court",
      grid: "G-8",
      pts: [
        [5.15, 6.15],
        [7.85, 6.15],
        [7.85, 8.35],
        [6.2, 8.7],
        [5.15, 8.2],
      ],
    },
  ],
};

export const PORT_GRAPH: SanGraph = {
  id: "port",
  nodes: [
    { id: "quay", gx: 6.5, gy: 6.5, grid: "G-7", kind: "plaza", r: 0.2 },
    { id: "exit_north", gx: 5.5, gy: 9.5, grid: "F-10", kind: "exit", to: "sandoria-north", r: 0.16 },
    { id: "pier_end", gx: 6.5, gy: 3.5, grid: "G-4", kind: "junction", r: 0.12 },
    { id: "fisher", gx: 6.62, gy: 3.38, grid: "G-4", kind: "junction", r: 0.08 },
    { id: "joulet", gx: 6.38, gy: 3.38, grid: "G-4", kind: "junction", r: 0.08 },
  ],
  edges: [
    chain("to_gate", 0.48, ["G-7", "G-8", "G-9", "F-9", "F-10"]),
    chain("side_lane", 0.32, ["F-8", "F-7", "G-7", "H-7"]),
    chain("pier", 0.28, ["G-7", "G-6", "G-5", "G-4"]),
  ],
  areas: [
    {
      id: "quay_plaza",
      kind: "quay",
      grid: "G-7",
      pts: [
        [6.05, 5.92],
        [6.95, 5.92],
        [6.95, 7.15],
        [6.05, 7.15],
      ],
    },
  ],
};

export type SanProp = {
  id: string;
  shape: "box" | "cyl";
  color: number;
  roof?: number;
  x: number;
  z: number;
  sx: number;
  sy: number;
  sz: number;
  y: number;
};

export const SAN_CREAM = 0x80684e;
export const SAN_SLATE = 0x5a6470;
export const SAN_RIDGE = 0x3a424c;
/** Warm slate blue-grey. Highlight stays within 8% of this. Shade is darker. */
export const SAN_ROOF = 0x6c737e;
export const SAN_ROOF_HI = 0x747c88;
export const SAN_ROOF_SHADE = 0x545a62;

/** Lion Springs, lamps, doors and street clutter. Walls stay at street height; these are the only tall pieces. */
export const SAN_PROPS: Record<"south" | "north" | "port", SanProp[]> = {
  south: [],
  north: [],
  port: [],
};

type GridId = "south" | "north" | "port";
const GRIDS: Record<GridId, SanGrid> = { south: SOUTH_GRID, north: NORTH_GRID, port: PORT_GRID };

function decodeMask(b64: string) {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i) & 255;
  return out;
}

const MASK: Record<GridId, Uint8Array> = {
  south: decodeMask(SAN_TRACE.south.mask),
  north: decodeMask(SAN_TRACE.north.mask),
  port: decodeMask(SAN_TRACE.port.mask),
};
const HULL: Record<GridId, Uint8Array> = {
  south: decodeMask(SAN_TRACE.south.hull),
  north: decodeMask(SAN_TRACE.north.hull),
  port: decodeMask(SAN_TRACE.port.hull),
};

function worldOf(id: GridId, gx: number, gy: number) {
  const g = GRIDS[id];
  return { x: g.x0 + gx * g.cell, z: g.z0 + gy * g.cell };
}

export const SAN_SPOT = {
  southRon: worldOf("south", 5.5, 9.5),
  southEast: worldOf("south", 11.5, 9.5),
  southNorth: worldOf("south", 8.5, 6.5),
  southChoco: worldOf("south", 7.5, 10.5),
  northSouth: worldOf("north", 8.5, 9.5),
  northWest: worldOf("north", 2.5, 7.5),
  northD7: worldOf("north", 3.5, 6.5),
  northPort: worldOf("north", 5.5, 2.5),
  northChateau: worldOf("north", 8.5, 5.5),
  northLanding: worldOf("north", 5.5, 4.5),
  portNorth: worldOf("port", 5.5, 9.5),
  portPier: worldOf("port", 6.5, 3.5),
  fisher: worldOf("port", 6.62, 3.38),
  joulet: worldOf("port", 6.38, 3.38),
};

function maskAt(id: GridId, x: number, z: number) {
  const g = GRIDS[id];
  const ix = Math.floor(x - g.x0);
  const iz = Math.floor(z - g.z0);
  const span = SAN_TRACE[id];
  if (ix < 0 || iz < 0 || ix >= span.w || iz >= span.h) return false;
  const i = iz * span.w + ix;
  return (MASK[id][i >> 3] & (128 >> (i & 7))) !== 0;
}

/** Street samples about every 24 yalms, staying off the zone gates. */
export function sanRoute(id: GridId, ax: number, az: number, bx: number, bz: number) {
  const g = GRIDS[id];
  const span = SAN_TRACE[id];
  const w = span.w;
  const h = span.h;
  const gates = Object.values(SAN_SPOT).filter((spot) => {
    const ix = spot.x - g.x0;
    const iz = spot.z - g.z0;
    return ix >= -8 && iz >= -8 && ix < w + 8 && iz < h + 8;
  });
  const nearGate = (x: number, z: number) => gates.some((spot) => Math.hypot(spot.x - x, spot.z - z) < 8);
  const cellOf = (x: number, z: number) => {
    const ix = Math.floor(x - g.x0);
    const iz = Math.floor(z - g.z0);
    if (ix < 0 || iz < 0 || ix >= w || iz >= h) return -1;
    return iz * w + ix;
  };
  const start = clampGraph(id, ax, az, 0);
  const goal = clampGraph(id, bx, bz, 0);
  const s = cellOf(start.x, start.z);
  const t = cellOf(goal.x, goal.z);
  const at = (i: number) => {
    const ix = i % w;
    const iz = Math.floor(i / w);
    return maskAt(id, g.x0 + ix + 0.5, g.z0 + iz + 0.5);
  };
  if (s < 0 || t < 0 || !at(s) || !at(t)) return [start, goal];
  const prev = new Int32Array(w * h);
  prev.fill(-1);
  const seen = new Uint8Array(w * h);
  const queue = [s];
  seen[s] = 1;
  for (let q = 0; q < queue.length && !seen[t]; q++) {
    const cur = queue[q];
    const ix = cur % w;
    const iz = Math.floor(cur / w);
    const next = [cur - 1, cur + 1, cur - w, cur + w];
    for (const ni of next) {
      if (ni < 0 || ni >= w * h || seen[ni]) continue;
      const nx = ni % w;
      const nz = Math.floor(ni / w);
      if (Math.abs(nx - ix) + Math.abs(nz - iz) !== 1) continue;
      if (!at(ni)) continue;
      const x = g.x0 + nx + 0.5;
      const z = g.z0 + nz + 0.5;
      if (nearGate(x, z) && ni !== t && ni !== s) continue;
      seen[ni] = 1;
      prev[ni] = cur;
      queue.push(ni);
    }
  }
  if (!seen[t]) return [start, goal];
  const cells = [t];
  for (let cur = t; cur !== s; ) {
    cur = prev[cur];
    cells.push(cur);
  }
  cells.reverse();
  const points = [start];
  let last = start;
  for (const i of cells) {
    const x = g.x0 + (i % w) + 0.5;
    const z = g.z0 + Math.floor(i / w) + 0.5;
    if (Math.hypot(x - last.x, z - last.z) < 24) continue;
    points.push({ x, z });
    last = { x, z };
  }
  if (Math.hypot(goal.x - last.x, goal.z - last.z) > 0.5) points.push(goal);
  return points;
}

function inGraph(id: GridId, x: number, z: number, radius: number) {
  if (!maskAt(id, x, z)) return false;
  if (radius <= 0) return true;
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    if (!maskAt(id, x + Math.cos(a) * radius, z + Math.sin(a) * radius)) return false;
  }
  return true;
}

function clampGraph(id: GridId, x: number, z: number, radius: number) {
  if (inGraph(id, x, z, radius)) return { x, z };
  let best = Infinity;
  let bx = x;
  let bz = z;
  for (let dz = -36; dz <= 36; dz++) {
    for (let dx = -36; dx <= 36; dx++) {
      const d2 = dx * dx + dz * dz;
      if (d2 === 0 || d2 >= best) continue;
      if (!inGraph(id, x + dx, z + dz, radius)) continue;
      best = d2;
      bx = x + dx;
      bz = z + dz;
    }
  }
  return { x: bx, z: bz };
}

export function inSouthGraph(x: number, z: number, radius = 0) {
  return inGraph("south", x, z, radius);
}
export function inNorthGraph(x: number, z: number, radius = 0) {
  return inGraph("north", x, z, radius);
}
export function inPortGraph(x: number, z: number, radius = 0) {
  return inGraph("port", x, z, radius);
}
export function clampSouthGraph(x: number, z: number, radius = 0) {
  return clampGraph("south", x, z, radius);
}
export function clampNorthGraph(x: number, z: number, radius = 0) {
  return clampGraph("north", x, z, radius);
}
export function clampPortGraph(x: number, z: number, radius = 0) {
  return clampGraph("port", x, z, radius);
}

/** 1.5 on the far curb (normal points north), 0.6 on the camera curb (normal points south). */
export function sanCurbHeight(nz: number) {
  const z = Math.max(-1, Math.min(1, nz));
  return 1.05 - 0.45 * z;
}

export function sanLot(id: GridId, x: number, z: number) {
  const g = GRIDS[id];
  const ix = Math.floor(x - g.x0);
  const iz = Math.floor(z - g.z0);
  const span = SAN_TRACE[id];
  if (ix < 0 || iz < 0 || ix >= span.w || iz >= span.h) return false;
  const i = iz * span.w + ix;
  const on = (bits: Uint8Array) => (bits[i >> 3] & (128 >> (i & 7))) !== 0;
  return on(HULL[id]) && !on(MASK[id]);
}

function dressProp(id: string, shape: SanProp["shape"], color: number, x: number, z: number, sx: number, sy: number, sz: number, y: number, roof?: number): SanProp {
  return { id, shape, color, x, z, sx, sy, sz, y, roof };
}

function besideLot(id: GridId, x: number, z: number) {
  return sanLot(id, x + 2.4, z) || sanLot(id, x - 2.4, z) || sanLot(id, x, z + 2.4) || sanLot(id, x, z - 2.4);
}

function seatProp(id: GridId, x: number, z: number) {
  if (maskAt(id, x, z) && !sanLot(id, x, z)) return { x, z };
  const nudged = clampGraph(id, x, z, 0);
  return { x: nudged.x, z: nudged.z };
}

function dressDistrict(id: GridId, specials: SanProp[]) {
  const g = GRIDS[id];
  const out: SanProp[] = [];
  const seen: { x: number; z: number }[] = [];
  const push = (bit: SanProp) => {
    const seat = seatProp(id, bit.x, bit.z);
    if (sanLot(id, seat.x, seat.z)) return;
    for (const prev of seen) {
      if (Math.hypot(prev.x - seat.x, prev.z - seat.z) < 3.2) return;
    }
    out.push({ ...bit, x: seat.x, z: seat.z });
    seen.push(seat);
  };
  for (const bit of specials) push(bit);
  const kinds = ["lamp", "banner", "lamp", "crate", "lamp", "cart", "guard"] as const;
  let n = 0;
  for (let z = g.z0 + 6; z < g.z0 + g.rows * g.cell - 6; z += 9) {
    for (let x = g.x0 + 6; x < g.x0 + g.cols * g.cell - 6; x += 9) {
      if (!maskAt(id, x, z) || !besideLot(id, x, z)) continue;
      const kind = kinds[n % kinds.length];
      n++;
      if (kind === "lamp") push(dressProp("lamp", "cyl", 0x3c3832, x, z, 0.16, 1.35, 0.16, 0.7, 0xe0c36a));
      else if (kind === "banner") push(dressProp("banner", "box", 0x8d3a32, x, z, 0.12, 1.35, 0.55, 0.72, 0xc4b496));
      else if (kind === "crate") push(dressProp("crate", "box", 0x8a6238, x, z, 0.55, 0.42, 0.5, 0.26));
      else if (kind === "cart") push(dressProp("cart", "box", 0x6e5438, x, z, 0.9, 0.4, 0.55, 0.28, 0x4a3a2c));
      else push(dressProp("guard", "box", 0x2c3e55, x, z, 0.32, 1.4, 0.26, 0.72, 0xd4c4a4));
    }
  }
  return out;
}

const auction = worldOf("south", 7.4, 10.5);
const manor = worldOf("south", 2.1, 5.3);
const victoryView = { x: 88.8, z: 6.72 };
const f9 = { x: 1.2, z: 1.4 };
const lion = worldOf("south", 12.0, 6.0);
SAN_PROPS.south = dressDistrict("south", [
  dressProp("fountain", "cyl", 0xc4b496, lion.x, lion.z + 4, 6.4, 0.5, 6.4, 0.28),
  dressProp("guard", "box", 0x2c3e55, victoryView.x - 4.5, victoryView.z + 2.2, 0.34, 1.4, 0.26, 0.72, 0xd4c4a4),
  dressProp("banner", "box", 0x8d3a32, victoryView.x + 4.2, victoryView.z - 2.4, 0.14, 1.4, 0.7, 0.74, 0xc4b496),
  dressProp("lamp", "cyl", 0x3c3832, victoryView.x + 1.6, victoryView.z + 4.6, 0.16, 1.35, 0.16, 0.7, 0xe0c36a),
  dressProp("crate", "box", 0x8a6238, victoryView.x - 2.2, victoryView.z - 3.4, 0.5, 0.4, 0.45, 0.24),
  dressProp("lamp", "cyl", 0x3c3832, f9.x + 5, f9.z, 0.16, 1.35, 0.16, 0.7, 0xe0c36a),
  dressProp("banner", "box", 0x1e4d78, f9.x - 4, f9.z + 5, 0.12, 1.35, 0.5, 0.72, 0xc4b496),
  dressProp("crate", "box", 0x8a6238, f9.x + 2, f9.z - 4, 0.5, 0.4, 0.45, 0.24),
  dressProp("door", "box", 0x6a3a28, auction.x, auction.z, 0.28, 1.35, 0.12, 0.7, 0xc4b496),
  dressProp("cart", "box", 0x6e5438, auction.x + 4, auction.z + 2, 1.1, 0.42, 0.62, 0.28, 0x4a3a2c),
  dressProp("door", "box", 0x6a3a28, manor.x, manor.z, 0.28, 1.35, 0.12, 0.7, 0xe8d7bc),
  dressProp("guard", "box", 0x2c3e55, lion.x - 5, lion.z + 2, 0.34, 1.4, 0.26, 0.72, 0xd4c4a4),
  dressProp("lamp", "cyl", 0x3c3832, lion.x + 5.5, lion.z + 1, 0.16, 1.35, 0.16, 0.7, 0xe0c36a),
  dressProp("banner", "box", 0x8d3a32, lion.x - 2, lion.z + 7, 0.12, 1.35, 0.55, 0.72, 0xc4b496),
  dressProp("crate", "box", 0x8a6238, lion.x + 3, lion.z + 8, 0.5, 0.4, 0.45, 0.24),
]);
SAN_PROPS.north = dressDistrict("north", [
  dressProp("door", "box", 0x6a3a28, worldOf("north", 8.5, 5.5).x, worldOf("north", 8.5, 5.5).z + 4, 0.3, 1.4, 0.14, 0.72, 0xc4b496),
  dressProp("guard", "box", 0x2c3e55, 0, -488, 0.34, 1.4, 0.26, 0.72, 0xd4c4a4),
]);
SAN_PROPS.port = dressDistrict("port", [
  dressProp("crate", "box", 0x8a6238, 4, -870, 0.6, 0.45, 0.55, 0.26),
  dressProp("cart", "box", 0x6e5438, -5, -878, 1.0, 0.4, 0.6, 0.28, 0x4a3a2c),
]);

export type SanDraw = {
  areas: { x: number; z: number }[][];
  spans: { ax: number; az: number; bx: number; bz: number; width: number }[];
  rings: { x: number; z: number }[][];
  buildings: { x: number; z: number }[][];
};

function worldRings(id: GridId, rings: readonly (readonly (readonly [number, number])[])[]) {
  return rings.map((ring) => ring.map(([gx, gy]) => worldOf(id, gx, gy)));
}

const DRAW: Record<GridId, SanDraw> = {
  south: { areas: [], spans: [], rings: worldRings("south", SAN_TRACE.south.rings), buildings: worldRings("south", SAN_TRACE.south.buildings) },
  north: { areas: [], spans: [], rings: worldRings("north", SAN_TRACE.north.rings), buildings: worldRings("north", SAN_TRACE.north.buildings) },
  port: { areas: [], spans: [], rings: worldRings("port", SAN_TRACE.port.rings), buildings: worldRings("port", SAN_TRACE.port.buildings) },
};

export function sanDraw(id: GridId): SanDraw {
  return DRAW[id];
}

export function sanNorthHeight(x: number, z: number) {
  const n = Math.sin(x * 12.9898 + z * 78.233) * 43758.5453;
  return 4 + (n - Math.floor(n)) * 4;
}

/** South (+Z) eaves drop to about one yalm. North eaves stay 4–8. */
export function sanEave(z: number, zMin: number, zMax: number, north: number) {
  if (zMax - zMin < 0.35) return 1.05;
  const t = (z - zMin) / (zMax - zMin);
  return north + (1.05 - north) * t;
}

type V3 = { x: number; y: number; z: number };
type XZ = { x: number; z: number };

function ringArea(ring: XZ[]) {
  let area = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    area += ring[j].x * ring[i].z - ring[i].x * ring[j].z;
  }
  return area / 2;
}

function turn(a: XZ, b: XZ, c: XZ) {
  return (b.x - a.x) * (c.z - a.z) - (b.z - a.z) * (c.x - a.x);
}

/** Drop duplicates and collinear points. Positive area matches the existing wall winding. */
function cleanRing(ring: XZ[]): XZ[] {
  const out: XZ[] = [];
  for (const p of ring) {
    if (!Number.isFinite(p.x) || !Number.isFinite(p.z)) continue;
    const prev = out[out.length - 1];
    if (prev && Math.hypot(prev.x - p.x, prev.z - p.z) < 0.15) continue;
    out.push({ x: p.x, z: p.z });
  }
  if (out.length > 1 && Math.hypot(out[0].x - out[out.length - 1].x, out[0].z - out[out.length - 1].z) < 0.15) out.pop();
  let guard = 0;
  while (out.length >= 3 && guard++ < 12) {
    let dropped = false;
    for (let i = 0; i < out.length; i++) {
      const a = out[(i + out.length - 1) % out.length];
      const b = out[i];
      const c = out[(i + 1) % out.length];
      const cross = turn(a, b, c);
      const scale = (Math.hypot(b.x - a.x, b.z - a.z) || 1) * (Math.hypot(c.x - b.x, c.z - b.z) || 1);
      if (Math.abs(cross) <= 1e-4 * scale) {
        out.splice(i, 1);
        dropped = true;
        break;
      }
    }
    if (!dropped) break;
  }
  if (out.length < 3 || Math.abs(ringArea(out)) < 0.05) return [];
  if (ringArea(out) < 0) out.reverse();
  return out;
}

function pointInRing(ring: XZ[], x: number, z: number) {
  let hit = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const a = ring[i];
    const b = ring[j];
    if ((a.z > z) !== (b.z > z) && x < ((b.x - a.x) * (z - a.z)) / (b.z - a.z) + a.x) hit = !hit;
  }
  return hit;
}

/** 0 when the point is inside. Otherwise the distance to the nearest edge. */
export function sanOutside(ring: XZ[], x: number, z: number) {
  if (pointInRing(ring, x, z)) return 0;
  let best = Infinity;
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i];
    const b = ring[(i + 1) % ring.length];
    const dx = b.x - a.x;
    const dz = b.z - a.z;
    const l2 = dx * dx + dz * dz || 1;
    let t = ((x - a.x) * dx + (z - a.z) * dz) / l2;
    t = Math.max(0, Math.min(1, t));
    best = Math.min(best, Math.hypot(x - (a.x + dx * t), z - (a.z + dz * t)));
  }
  return best;
}

function crossPoint(a: XZ, b: XZ, c: XZ, d: XZ): XZ | null {
  const o1 = turn(a, b, c);
  const o2 = turn(a, b, d);
  const o3 = turn(c, d, a);
  const o4 = turn(c, d, b);
  if (!(o1 * o2 < -1e-8 && o3 * o4 < -1e-8)) return null;
  const den = (a.x - b.x) * (c.z - d.z) - (a.z - b.z) * (c.x - d.x);
  if (Math.abs(den) < 1e-12) return null;
  const t = ((a.x - c.x) * (c.z - d.z) - (a.z - c.z) * (c.x - d.x)) / den;
  if (t <= 1e-4 || t >= 1 - 1e-4) return null;
  return { x: a.x + t * (b.x - a.x), z: a.z + t * (b.z - a.z) };
}

function untangle(ring: XZ[], depth = 0): XZ[][] {
  if (ring.length < 3 || depth > 8) return [];
  const n = ring.length;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (Math.abs(i - j) <= 1 || Math.abs(i - j) === n - 1) continue;
      const hit = crossPoint(ring[i], ring[(i + 1) % n], ring[j], ring[(j + 1) % n]);
      if (!hit) continue;
      const left: XZ[] = [hit];
      for (let k = (i + 1) % n; ; k = (k + 1) % n) {
        left.push(ring[k]);
        if (k === j) break;
      }
      const right: XZ[] = [hit];
      for (let k = (j + 1) % n; ; k = (k + 1) % n) {
        right.push(ring[k]);
        if (k === i) break;
      }
      return [...untangle(cleanRing(left), depth + 1), ...untangle(cleanRing(right), depth + 1)];
    }
  }
  return [ring];
}

function isConvex(ring: XZ[]) {
  if (ring.length < 3) return false;
  for (let i = 0; i < ring.length; i++) {
    const a = ring[(i + ring.length - 1) % ring.length];
    const b = ring[i];
    const c = ring[(i + 1) % ring.length];
    if (turn(a, b, c) < -1e-6) return false;
  }
  return true;
}

function sliceRing(ring: XZ[], from: number, to: number) {
  const out: XZ[] = [];
  const n = ring.length;
  for (let t = from, guard = 0; guard <= n; t = (t + 1) % n, guard++) {
    out.push(ring[t]);
    if (t === to) break;
  }
  return out;
}

function diagonalFree(ring: XZ[], i: number, k: number) {
  const n = ring.length;
  const a = ring[i];
  const b = ring[k];
  for (let e = 0; e < n; e++) {
    const e2 = (e + 1) % n;
    if (e === i || e === k || e2 === i || e2 === k) continue;
    if (crossPoint(a, b, ring[e], ring[e2])) return false;
  }
  const mid = { x: (a.x + b.x) / 2, z: (a.z + b.z) / 2 };
  return sanOutside(ring, mid.x, mid.z) <= 0.05;
}

function convexParts(ring: XZ[], depth = 0): XZ[][] {
  if (ring.length < 3 || depth > 12) return [];
  if (isConvex(ring)) return [ring];
  const n = ring.length;
  for (let i = 0; i < n; i++) {
    const prev = ring[(i + n - 1) % n];
    const cur = ring[i];
    const next = ring[(i + 1) % n];
    if (turn(prev, cur, next) >= -1e-6) continue;
    for (let step = 2; step < n - 1; step++) {
      const k = (i + step) % n;
      if (!diagonalFree(ring, i, k)) continue;
      const left = cleanRing(sliceRing(ring, i, k));
      const right = cleanRing(sliceRing(ring, k, i));
      if (left.length < 3 || right.length < 3) continue;
      return [...convexParts(left, depth + 1), ...convexParts(right, depth + 1)];
    }
  }
  return earClip(ring);
}

function pointInTri(p: XZ, a: XZ, b: XZ, c: XZ) {
  const o1 = turn(a, b, p);
  const o2 = turn(b, c, p);
  const o3 = turn(c, a, p);
  const neg = o1 < -1e-8 || o2 < -1e-8 || o3 < -1e-8;
  const pos = o1 > 1e-8 || o2 > 1e-8 || o3 > 1e-8;
  return !(neg && pos);
}

function earClip(ring: XZ[]): XZ[][] {
  const poly = ring.map((p) => ({ x: p.x, z: p.z }));
  const tris: XZ[][] = [];
  let guard = 0;
  while (poly.length > 3 && guard++ < 16) {
    let clipped = false;
    for (let i = 0; i < poly.length; i++) {
      const a = poly[(i + poly.length - 1) % poly.length];
      const b = poly[i];
      const c = poly[(i + 1) % poly.length];
      if (turn(a, b, c) <= 1e-8) continue;
      let blocked = false;
      for (const p of poly) {
        if (p === a || p === b || p === c) continue;
        if (pointInTri(p, a, b, c)) {
          blocked = true;
          break;
        }
      }
      if (blocked) continue;
      tris.push([a, b, c]);
      poly.splice(i, 1);
      clipped = true;
      break;
    }
    if (!clipped) break;
  }
  if (poly.length === 3 && Math.abs(ringArea(poly)) > 0.05) tris.push(poly.slice());
  return tris;
}

function ensureUp(face: V3[]): V3[] {
  if (face.length < 3) return face;
  const a = face[0];
  const b = face[1];
  const c = face[2];
  const y = (b.z - a.z) * (c.x - a.x) - (b.x - a.x) * (c.z - a.z);
  return y < 0 ? face.slice().reverse() : face;
}

function edgeLen(a: V3, b: V3) {
  return Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
}

function facesOk(ring: XZ[], faces: V3[][]) {
  for (const face of faces) {
    const tris = face.length === 4 ? [[0, 1, 2], [0, 2, 3]] : [[0, 1, 2]];
    for (const p of face) {
      if (!Number.isFinite(p.x) || !Number.isFinite(p.y) || !Number.isFinite(p.z)) return false;
      if (sanOutside(ring, p.x, p.z) > 1) return false;
    }
    for (const [i, j, k] of tris) {
      const a = face[i];
      const b = face[j];
      const c = face[k];
      if (edgeLen(a, b) > 20 || edgeLen(b, c) > 20 || edgeLen(c, a) > 20) return false;
    }
  }
  return faces.length > 0;
}

function splitLong(ring: XZ[], faces: V3[][]) {
  const stack: V3[][] = [];
  for (const face of faces) {
    if (face.length === 4) stack.push([face[0], face[1], face[2]], [face[0], face[2], face[3]]);
    else stack.push(face);
  }
  const out: V3[][] = [];
  let guard = 0;
  while (stack.length && guard++ < 64) {
    const face = stack.pop() as V3[];
    let worst = 0;
    let at = -1;
    for (let i = 0; i < face.length; i++) {
      const e = edgeLen(face[i], face[(i + 1) % face.length]);
      if (e > worst) {
        worst = e;
        at = i;
      }
    }
    if (worst <= 20 || face.length !== 3) {
      out.push(face);
      continue;
    }
    const a = face[at];
    const b = face[(at + 1) % 3];
    const c = face[(at + 2) % 3];
    const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, z: (a.z + b.z) / 2 };
    if (sanOutside(ring, mid.x, mid.z) > 1) {
      out.push(face);
      continue;
    }
    stack.push([a, mid, c], [mid, b, c]);
  }
  return out;
}

function eaveOf(ring: XZ[]) {
  let zMin = Infinity;
  let zMax = -Infinity;
  let cx = 0;
  let cz = 0;
  for (const p of ring) {
    zMin = Math.min(zMin, p.z);
    zMax = Math.max(zMax, p.z);
    cx += p.x;
    cz += p.z;
  }
  cx /= ring.length;
  cz /= ring.length;
  const north = sanNorthHeight(cx, cz);
  return {
    cx,
    cz,
    zMin,
    zMax,
    y: (z: number) => sanEave(z, zMin, zMax, north),
    north,
  };
}

function flatCap(ring: XZ[]): V3[][] {
  const eave = eaveOf(ring);
  const c = { x: eave.cx, z: eave.cz };
  if (sanOutside(ring, c.x, c.z) > 0.25) {
    return splitLong(
      ring,
      earClip(ring).map((tri) => ensureUp(tri.map((p) => ({ x: p.x, y: eave.y(p.z), z: p.z })))),
    );
  }
  const apex = { x: c.x, y: eave.y(c.z), z: c.z };
  const faces: V3[][] = [];
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i];
    const b = ring[(i + 1) % ring.length];
    faces.push(ensureUp([
      { x: a.x, y: eave.y(a.z), z: a.z },
      { x: b.x, y: eave.y(b.z), z: b.z },
      apex,
    ]));
  }
  return splitLong(ring, faces);
}

/** Pitched or hipped roof over one convex part. Flat slate cap when a ridge would leave the footprint. */
function roofConvex(ring: XZ[]): V3[][] {
  if (ring.length < 3) return [];
  let xMin = Infinity;
  let xMax = -Infinity;
  const eave = eaveOf(ring);
  for (const p of ring) {
    xMin = Math.min(xMin, p.x);
    xMax = Math.max(xMax, p.x);
  }
  const spanX = Math.max(0.001, xMax - xMin);
  const spanZ = Math.max(0.001, eave.zMax - eave.zMin);
  const alongX = spanX >= spanZ;
  let peak = 1.05;
  for (const p of ring) peak = Math.max(peak, eave.y(p.z));
  const ridgeY = Math.min(8.4, peak + 1.15);
  const axisLen = alongX ? spanX : spanZ;
  let half = Math.max(0.35, axisLen * 0.5 - Math.max(0.8, axisLen * 0.18));
  const lift = (p: XZ, y: number): V3 => ({ x: p.x, y, z: p.z });
  for (let attempt = 0; attempt < 6; attempt++) {
    const r1 = alongX ? { x: eave.cx - half, z: eave.cz } : { x: eave.cx, z: eave.cz - half };
    const r2 = alongX ? { x: eave.cx + half, z: eave.cz } : { x: eave.cx, z: eave.cz + half };
    const ridgeIn = sanOutside(ring, r1.x, r1.z) <= 0.05 && sanOutside(ring, r2.x, r2.z) <= 0.05;
    if (ridgeIn) {
      const faces: V3[][] = [];
      const lo = alongX ? Math.min(r1.x, r2.x) : Math.min(r1.z, r2.z);
      const hi = alongX ? Math.max(r1.x, r2.x) : Math.max(r1.z, r2.z);
      const tip1 = lift(r1, ridgeY);
      const tip2 = lift(r2, ridgeY);
      for (let i = 0; i < ring.length; i++) {
        const a = ring[i];
        const b = ring[(i + 1) % ring.length];
        const mid = alongX ? (a.x + b.x) / 2 : (a.z + b.z) / 2;
        const ea = lift(a, eave.y(a.z));
        const eb = lift(b, eave.y(b.z));
        if (half < 0.3 || mid < lo || mid > hi) {
          const use1 = Math.abs(mid - (alongX ? r1.x : r1.z)) <= Math.abs(mid - (alongX ? r2.x : r2.z));
          faces.push(ensureUp([ea, eb, use1 ? tip1 : tip2]));
        } else {
          faces.push(ensureUp([ea, eb, tip2, tip1]));
        }
      }
      const trimmed = splitLong(ring, faces);
      if (facesOk(ring, trimmed)) return trimmed;
    }
    half *= 0.5;
  }
  const cap = flatCap(ring);
  if (facesOk(ring, cap)) return cap;
  const ears = splitLong(
    ring,
    earClip(ring).map((tri) => ensureUp(tri.map((p) => lift(p, eave.y(p.z))))),
  );
  return facesOk(ring, ears) ? ears : cap;
}

function capRaw(ring: XZ[]): V3[][] {
  const pts = ring.filter((p) => Number.isFinite(p.x) && Number.isFinite(p.z));
  if (!pts.length) return [];
  let cx = 0;
  let cz = 0;
  for (const p of pts) {
    cx += p.x;
    cz += p.z;
  }
  cx /= pts.length;
  cz /= pts.length;
  const y = 1.05;
  const diamond = [
    { x: cx - 0.45, z: cz },
    { x: cx, z: cz - 0.45 },
    { x: cx + 0.45, z: cz },
    { x: cx, z: cz + 0.45 },
  ];
  return [ensureUp(diamond.map((p) => ({ x: p.x, y, z: p.z })))];
}

/**
 * Roof a footprint. Clean it, fix the winding, and split concave or crossing
 * shapes into convex parts. A part that cannot hold a ridge gets a flat cap.
 */
export function sanHip(ring: { x: number; z: number }[]): V3[][] {
  const cleaned = cleanRing(ring);
  if (cleaned.length < 3) return capRaw(ring);
  const faces: V3[][] = [];
  for (const simple of untangle(cleaned)) {
    if (simple.length < 3) continue;
    for (const part of convexParts(simple)) {
      if (part.length < 3) continue;
      faces.push(...roofConvex(part));
    }
  }
  const roof = faces.length ? faces : capRaw(ring);
  const tris: V3[][] = [];
  for (const face of roof) {
    const parts = face.length === 4 ? [[face[0], face[1], face[2]], [face[0], face[2], face[3]]] : [face];
    for (const tri of parts) {
      if (tri.length >= 3) tris.push(ensureUp(tri));
    }
  }
  return tris;
}

function faceArea(face: V3[]) {
  if (face.length < 3) return 0;
  const a = face[0];
  let area = 0;
  for (let i = 1; i + 1 < face.length; i++) {
    const b = face[i];
    const c = face[i + 1];
    const abx = b.x - a.x;
    const aby = b.y - a.y;
    const abz = b.z - a.z;
    const acx = c.x - a.x;
    const acy = c.y - a.y;
    const acz = c.z - a.z;
    area += 0.5 * Math.hypot(aby * acz - abz * acy, abz * acx - abx * acz, abx * acy - aby * acx);
  }
  return area;
}


const LETTERS = "ABCDEFGHIJKLMNOP";
export function sanSquare(id: GridId, x: number, z: number) {
  const g = GRIDS[id];
  const col = Math.floor((x - g.x0) / g.cell);
  const row = Math.floor((z - g.z0) / g.cell);
  if (col < 0 || row < 0 || col >= g.cols || row >= g.rows) return "?";
  return `${LETTERS[col]}-${row + 1}`;
}

/** South door of Victory Square, and the south door of Lion Square. */
export const SAN_VIEW = {
  victory: { x: 88.8, z: 6.72, square: "H-9" },
  lion: { x: 303.84, z: -91.68, square: "L-7" },
} as const;

function centerOf(id: GridId, square: string) {
  const [gx, gy] = cell(square);
  return worldOf(id, gx, gy);
}

function lum(hex: number) {
  const r = (hex >> 16) & 255;
  const g = (hex >> 8) & 255;
  const b = hex & 255;
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

function lumWorking(hex: number) {
  const ch = (u: number) => {
    const c = u / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  const r = ch((hex >> 16) & 255);
  const g = ch((hex >> 8) & 255);
  const b = ch(hex & 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function ringHas(rings: { x: number; z: number }[][], x: number, z: number) {
  for (const ring of rings) {
    let hit = false;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const a = ring[i];
      const b = ring[j];
      if ((a.z > z) !== (b.z > z) && x < ((b.x - a.x) * (z - a.z)) / (b.z - a.z) + a.x) hit = !hit;
    }
    if (hit) return true;
  }
  return false;
}

function traceScores(id: GridId) {
  const g = GRIDS[id];
  const draw = DRAW[id];
  const span = SAN_TRACE[id];
  const poly = new Uint8Array(span.w * span.h);
  for (let iz = 0; iz < span.h; iz++) {
    const z = g.z0 + iz + 0.5;
    const xs: number[] = [];
    for (const ring of draw.rings) {
      for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
        const a = ring[j];
        const b = ring[i];
        if ((a.z > z) === (b.z > z)) continue;
        xs.push(a.x + ((z - a.z) * (b.x - a.x)) / (b.z - a.z));
      }
    }
    xs.sort((p, q) => p - q);
    for (let k = 0; k + 1 < xs.length; k += 2) {
      let x0 = Math.floor(xs[k] - g.x0);
      let x1 = Math.floor(xs[k + 1] - g.x0);
      if (x1 < x0) {
        const swap = x0;
        x0 = x1;
        x1 = swap;
      }
      const a = Math.max(0, x0);
      const b = Math.min(span.w - 1, x1);
      const row = iz * span.w;
      for (let ix = a; ix <= b; ix++) poly[row + ix] = 1;
    }
  }
  const near = (buf: Uint8Array | null, ix: number, iz: number, onMask: boolean) => {
    for (let dz = -1; dz <= 1; dz++) {
      for (let dx = -1; dx <= 1; dx++) {
        const x = ix + dx;
        const z = iz + dz;
        if (x < 0 || z < 0 || x >= span.w || z >= span.h) continue;
        const on = onMask ? maskAt(id, g.x0 + x + 0.5, g.z0 + z + 0.5) : buf![z * span.w + x] === 1;
        if (on) return true;
      }
    }
    return false;
  };
  let maskN = 0;
  let polyN = 0;
  let recall = 0;
  let precision = 0;
  for (let iz = 0; iz < span.h; iz++) {
    for (let ix = 0; ix < span.w; ix++) {
      const m = maskAt(id, g.x0 + ix + 0.5, g.z0 + iz + 0.5);
      const p = poly[iz * span.w + ix] === 1;
      if (m) {
        maskN++;
        if (near(poly, ix, iz, false)) recall++;
      }
      if (p) {
        polyN++;
        if (near(null, ix, iz, true)) precision++;
      }
    }
  }
  return { recall: recall / Math.max(1, maskN), precision: precision / Math.max(1, polyN), poly };
}

function axisFault(id: GridId, poly: Uint8Array) {
  const g = GRIDS[id];
  const span = SAN_TRACE[id];
  const maskNear = (x: number, z: number) => {
    for (let dz = -1; dz <= 1; dz++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (maskAt(id, x + dx, z + dz)) return true;
      }
    }
    return false;
  };
  for (let col = 0; col < g.cols; col++) {
    for (let row = 0; row < g.rows; row++) {
      let full = 0;
      for (const horiz of [true, false]) {
        let polyOn = true;
        let maskOn = true;
        for (let t = 0; t < 8; t++) {
          const gx = horiz ? col + (t + 0.5) / 8 : col + 0.5;
          const gy = horiz ? row + 0.5 : row + (t + 0.5) / 8;
          const x = g.x0 + gx * g.cell;
          const z = g.z0 + gy * g.cell;
          const ix = Math.floor(x - g.x0);
          const iz = Math.floor(z - g.z0);
          if (ix < 0 || iz < 0 || ix >= span.w || iz >= span.h || poly[iz * span.w + ix] !== 1) polyOn = false;
          if (!maskNear(x, z)) maskOn = false;
        }
        if (polyOn && !maskOn) full++;
      }
      if (full === 2) return `${LETTERS[col]}-${row + 1}`;
    }
  }
  return "";
}

function polyArea(ring: { x: number; z: number }[]) {
  let area = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    area += ring[j].x * ring[i].z - ring[i].x * ring[j].z;
  }
  return Math.abs(area) / 2;
}

/** Connected walk, in yalms². One part means every stone reaches every exit. */
function walkParts(id: GridId) {
  const span = SAN_TRACE[id];
  const g = GRIDS[id];
  const seen = new Uint8Array(span.w * span.h);
  const areas: number[] = [];
  const at = (ix: number, iz: number) => {
    if (ix < 0 || iz < 0 || ix >= span.w || iz >= span.h) return false;
    return maskAt(id, g.x0 + ix + 0.5, g.z0 + iz + 0.5);
  };
  for (let iz = 0; iz < span.h; iz++) {
    for (let ix = 0; ix < span.w; ix++) {
      const start = iz * span.w + ix;
      if (seen[start] || !at(ix, iz)) continue;
      let n = 0;
      const stack = [start];
      seen[start] = 1;
      while (stack.length) {
        const cur = stack.pop() as number;
        n++;
        const x = cur % span.w;
        const z = Math.floor(cur / span.w);
        const next = [
          [x - 1, z],
          [x + 1, z],
          [x, z - 1],
          [x, z + 1],
        ];
        for (const [nx, nz] of next) {
          if (!at(nx, nz)) continue;
          const ni = nz * span.w + nx;
          if (seen[ni]) continue;
          seen[ni] = 1;
          stack.push(ni);
        }
      }
      if (n > 0) areas.push(n);
    }
  }
  return areas;
}

function bitAt(bits: Uint8Array, i: number) {
  return (bits[i >> 3] & (128 >> (i & 7))) !== 0;
}

/** Blocked ground with no roof, and cobbles sitting under a roof. Both must stay zero. */
function roofCoverFault(id: GridId) {
  const g = GRIDS[id];
  const span = SAN_TRACE[id];
  const buildings = DRAW[id].buildings;
  const bucket = 32;
  const cols = Math.ceil(span.w / bucket);
  const rows = Math.ceil(span.h / bucket);
  const bins: number[][] = Array.from({ length: cols * rows }, () => []);
  for (let ri = 0; ri < buildings.length; ri++) {
    const ring = buildings[ri];
    let minX = Infinity;
    let maxX = -Infinity;
    let minZ = Infinity;
    let maxZ = -Infinity;
    for (const p of ring) {
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
      if (p.z < minZ) minZ = p.z;
      if (p.z > maxZ) maxZ = p.z;
    }
    const c0 = Math.max(0, Math.floor((minX - g.x0) / bucket));
    const c1 = Math.min(cols - 1, Math.floor((maxX - g.x0) / bucket));
    const r0 = Math.max(0, Math.floor((minZ - g.z0) / bucket));
    const r1 = Math.min(rows - 1, Math.floor((maxZ - g.z0) / bucket));
    for (let r = r0; r <= r1; r++) {
      for (let c = c0; c <= c1; c++) bins[r * cols + c].push(ri);
    }
  }
  let bare = 0;
  let under = 0;
  const mask = MASK[id];
  const hull = HULL[id];
  for (let iz = 0; iz < span.h; iz++) {
    const z = g.z0 + iz + 0.5;
    const br = Math.floor(iz / bucket) * cols;
    for (let ix = 0; ix < span.w; ix++) {
      const i = iz * span.w + ix;
      const walk = bitAt(mask, i);
      const inside = bitAt(hull, i);
      if (!walk && !inside) continue;
      const x = g.x0 + ix + 0.5;
      const list = bins[br + Math.floor(ix / bucket)];
      let covered = false;
      for (let k = 0; k < list.length; k++) {
        if (pointInRing(buildings[list[k]], x, z)) {
          covered = true;
          break;
        }
      }
      if (inside && !walk && !covered) bare++;
      else if (walk && covered) under++;
    }
  }
  return { bare, under };
}

function curbTurn(a: readonly number[], b: readonly number[], c: readonly number[]): number {
  const ax = b[0] - a[0];
  const az = b[1] - a[1];
  const bx = c[0] - b[0];
  const bz = c[1] - b[1];
  return Math.abs(Math.atan2(ax * bz - az * bx, ax * bx + az * bz));
}

function curbWalk(loop: readonly (readonly number[])[], index: number, dir: number, dist: number): [number, number] | null {
  const n = loop.length;
  let left = dist;
  let i = index;
  let x = loop[i][0];
  let z = loop[i][1];
  for (let step = 0; step < n; step++) {
    const j = (i + dir + n) % n;
    const nx = loop[j][0];
    const nz = loop[j][1];
    const hop = Math.hypot(nx - x, nz - z);
    if (hop >= left) {
      const t = hop > 0 ? left / hop : 0;
      return [x + (nx - x) * t, z + (nz - z) * t];
    }
    left -= hop;
    x = nx;
    z = nz;
    i = j;
  }
  return null;
}

function curbWideCorner(loop: readonly (readonly number[])[], i: number): boolean {
  const back = curbWalk(loop, i, -1, 2.2);
  const fore = curbWalk(loop, i, 1, 2.2);
  if (!back || !fore) return false;
  const deg = (curbTurn(back, loop[i], fore) * 180) / Math.PI;
  return deg >= 58 && deg <= 122;
}

function curbDiagonalRun(loop: readonly (readonly number[])[], i0: number, count: number, sum: number): boolean {
  const n = loop.length;
  if (count < 1 || count >= n) return false;
  const at = (dist: number): [number, number] => {
    let left = dist;
    for (let k = 0; k < count; k++) {
      const a = loop[(i0 + k) % n];
      const b = loop[(i0 + k + 1) % n];
      const hop = Math.hypot(b[0] - a[0], b[1] - a[1]);
      if (hop >= left) {
        const t = hop > 0 ? left / hop : 0;
        return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
      }
      left -= hop;
    }
    const last = loop[(i0 + count) % n];
    return [last[0], last[1]];
  };
  const mid = sum * 0.5;
  const back = at(Math.max(0, mid - 4));
  const fore = at(Math.min(sum, mid + 4));
  const dx = fore[0] - back[0];
  const dz = fore[1] - back[1];
  const len = Math.hypot(dx, dz);
  if (len < 0.8) return false;
  return !(Math.abs(dx) <= 0.22 * len || Math.abs(dz) <= 0.22 * len);
}

function curbOutlineFault(loop: readonly (readonly number[])[]): string {
  const n = loop.length;
  if (n < 4) return "loop";
  const lens: number[] = [];
  const axis: number[] = [];
  const turn: number[] = [];
  for (let i = 0; i < n; i++) {
    const a = loop[i];
    const b = loop[(i + 1) % n];
    const dx = b[0] - a[0];
    const dz = b[1] - a[1];
    const len = Math.hypot(dx, dz);
    lens.push(len);
    axis.push(len > 1e-4 && (Math.abs(dx) <= 0.18 * len || Math.abs(dz) <= 0.18 * len) ? 1 : 0);
    turn.push(curbTurn(loop[(i - 1 + n) % n], a, b));
  }
  const sharp = (ang: number) => ang > 1.15 && ang < 2.15;
  for (let i = 0; i < n; i++) {
    const i1 = (i + 1) % n;
    const i2 = (i + 2) % n;
    if (lens[i] < 3 && lens[i1] < 3 && lens[i2] < 3 && sharp(turn[i1]) && sharp(turn[i2])) return "zigzag";
  }
  const keepsShort = (v: number) => {
    if (!curbWideCorner(loop, v)) return false;
    return lens[(v - 1 + n) % n] >= 1.5 || lens[v] >= 1.5;
  };
  for (let i = 0; i < n; i++) {
    if (lens[i] >= 1.5) continue;
    if (!keepsShort(i) && !keepsShort((i + 1) % n)) return "short";
  }
  const corner: number[] = [];
  for (let i = 0; i < n; i++) corner.push(curbWideCorner(loop, i) ? 1 : 0);
  let origin = -1;
  for (let i = 0; i < n; i++) {
    if (corner[i] || !axis[(i - 1 + n) % n]) {
      origin = i;
      break;
    }
  }
  const runs: { i0: number; count: number; sum: number }[] = [];
  if (origin < 0) {
    let sum = 0;
    for (const len of lens) sum += len;
    if (sum > 0) runs.push({ i0: 0, count: n, sum });
  } else {
    let i = origin;
    let seen = 0;
    while (seen < n) {
      if (!axis[i]) {
        i = (i + 1) % n;
        seen++;
        continue;
      }
      let count = 0;
      let sum = 0;
      while (count < n - seen && axis[(i + count) % n]) {
        const endV = (i + count + 1) % n;
        sum += lens[(i + count) % n];
        count++;
        if (corner[endV]) break;
      }
      runs.push({ i0: i, count, sum });
      i = (i + count) % n;
      seen += count;
    }
  }
  for (const run of runs) {
    if (run.sum <= 2.02) continue;
    if (curbDiagonalRun(loop, run.i0, run.count, run.sum)) return "axis";
  }
  return "";
}

/** Longest axis-aligned run whose street chord is diagonal. Straight walls stay out of this. */
function diagonalStair(loop: readonly (readonly number[])[]): number {
  const n = loop.length;
  if (n < 4) return 0;
  const lens: number[] = [];
  const axis: number[] = [];
  const corner: number[] = [];
  for (let i = 0; i < n; i++) {
    const a = loop[i];
    const b = loop[(i + 1) % n];
    const dx = b[0] - a[0];
    const dz = b[1] - a[1];
    const len = Math.hypot(dx, dz);
    lens.push(len);
    axis.push(len > 1e-4 && (Math.abs(dx) <= 0.18 * len || Math.abs(dz) <= 0.18 * len) ? 1 : 0);
    corner.push(curbWideCorner(loop, i) ? 1 : 0);
  }
  let origin = -1;
  for (let i = 0; i < n; i++) {
    if (corner[i] || !axis[(i - 1 + n) % n]) {
      origin = i;
      break;
    }
  }
  const runs: { i0: number; count: number; sum: number }[] = [];
  if (origin < 0) {
    let sum = 0;
    for (const len of lens) sum += len;
    if (sum > 0) runs.push({ i0: 0, count: n, sum });
  } else {
    let i = origin;
    let seen = 0;
    while (seen < n) {
      if (!axis[i]) {
        i = (i + 1) % n;
        seen++;
        continue;
      }
      let count = 0;
      let sum = 0;
      while (count < n - seen && axis[(i + count) % n]) {
        const endV = (i + count + 1) % n;
        sum += lens[(i + count) % n];
        count++;
        if (corner[endV]) break;
      }
      runs.push({ i0: i, count, sum });
      i = (i + count) % n;
      seen += count;
    }
  }
  let worst = 0;
  for (const run of runs) {
    if (run.sum > worst && curbDiagonalRun(loop, run.i0, run.count, run.sum)) worst = run.sum;
  }
  return worst;
}

function portraitBuilding(x: number, z: number) {
  const buildings = DRAW.south.buildings;
  for (let zz = z - 20; zz <= z + 14; zz += 1) {
    for (let xx = x - 5.4; xx <= x + 5.4; xx += 1) {
      if (ringHas(buildings, xx, zz)) return true;
    }
  }
  return false;
}

export function assertSanGraph(): void {
  const southSq: [number, number, string][] = [
    [0, 0, "F-9"],
    [0, -48, "F-8"],
    [SAN_SPOT.southRon.x, SAN_SPOT.southRon.z, "F-10"],
    [SAN_SPOT.southEast.x, SAN_SPOT.southEast.z, "L-10"],
    [SAN_SPOT.southNorth.x, SAN_SPOT.southNorth.z, "I-7"],
    [SAN_SPOT.southChoco.x, SAN_SPOT.southChoco.z, "H-11"],
  ];
  for (const [x, z, square] of southSq) {
    if (!inSouthGraph(x, z, 0)) throw new Error(`south graph misses ${x},${z}`);
    if (sanSquare("south", x, z) !== square) throw new Error(`south ${x},${z} is ${sanSquare("south", x, z)} not ${square}`);
  }
  if (!inSouthGraph(0, 10, 0) || !inSouthGraph(12, -12, 0)) throw new Error("south avenue");
  if (inSouthGraph(30, 48, 0)) throw new Error("beside the south gate");
  const northHeart = centerOf("north", "F-7");
  const northSq: [number, number, string][] = [
    [northHeart.x, northHeart.z, "F-7"],
    [northHeart.x - 10, northHeart.z, "F-7"],
    [SAN_SPOT.northWest.x, SAN_SPOT.northWest.z, "C-8"],
    [SAN_SPOT.northD7.x, SAN_SPOT.northD7.z, "D-7"],
    [SAN_SPOT.northSouth.x, SAN_SPOT.northSouth.z, "I-10"],
    [SAN_SPOT.northPort.x, SAN_SPOT.northPort.z, "F-3"],
    [SAN_SPOT.northChateau.x, SAN_SPOT.northChateau.z, "I-6"],
    [SAN_SPOT.northLanding.x, SAN_SPOT.northLanding.z, "F-5"],
  ];
  for (const [x, z, square] of northSq) {
    if (!inNorthGraph(x, z, 0)) throw new Error(`north graph misses ${x},${z}`);
    if (sanSquare("north", x, z) !== square) throw new Error(`north ${x},${z} is ${sanSquare("north", x, z)} not ${square}`);
  }
  const portHeart = centerOf("port", "G-7");
  const portCrystal = worldOf("port", 6.608, 6.017);
  const portSq: [number, number, string][] = [
    [portHeart.x, portHeart.z, "G-7"],
    [portCrystal.x, portCrystal.z, "G-7"],
    [SAN_SPOT.portNorth.x, SAN_SPOT.portNorth.z, "F-10"],
    [SAN_SPOT.portPier.x, SAN_SPOT.portPier.z, "G-4"],
    [SAN_SPOT.fisher.x, SAN_SPOT.fisher.z, "G-4"],
    [SAN_SPOT.joulet.x, SAN_SPOT.joulet.z, "G-4"],
  ];
  for (const [x, z, square] of portSq) {
    if (!inPortGraph(x, z, 0)) throw new Error(`port graph misses ${x},${z}`);
    if (sanSquare("port", x, z) !== square) throw new Error(`port ${x},${z} is ${sanSquare("port", x, z)} not ${square}`);
  }
  if (inPortGraph(SAN_SPOT.portPier.x, SAN_SPOT.portPier.z - 28, 0.2)) throw new Error("past the pier");
  if (inPortGraph(SAN_SPOT.portPier.x + 24, SAN_SPOT.portPier.z - 20, 0)) throw new Error("harbor water");
  if (inSouthGraph(SAN_SPOT.northSouth.x, SAN_SPOT.northSouth.z, 0) || inNorthGraph(0, 0, 0) || inPortGraph(northHeart.x, northHeart.z, 0)) {
    throw new Error("districts overlap");
  }
  for (const spot of [SAN_SPOT.southRon, SAN_SPOT.southEast, SAN_SPOT.southNorth, { x: 0, z: 0 }]) {
    if (spot.z > 205) throw new Error("south street meets ronfaure");
  }
  const shoulder = clampSouthGraph(30, 48, 0.36);
  if (!inSouthGraph(shoulder.x, shoulder.z, 0.2)) throw new Error("south clamp");
  if (lum(SAN_SLATE) > 0.5 || lum(SAN_RIDGE) >= lum(SAN_SLATE)) throw new Error("white roof");
  if (lum(SAN_ROOF) > 0.5) throw new Error("white roof");
  if (!(lum(SAN_ROOF_HI) > lum(SAN_ROOF))) throw new Error("roof highlight");
  if (lum(SAN_ROOF_HI) > lum(SAN_ROOF) * 1.08 + 1e-4) throw new Error("roof highlight");
  if (!(lum(SAN_ROOF_SHADE) < lum(SAN_ROOF))) throw new Error("roof shade");
  if (!(lumWorking(SAN_ROOF_HI) > lumWorking(SAN_ROOF))) throw new Error("roof highlight");
  if (!(lumWorking(SAN_ROOF_SHADE) < lumWorking(SAN_ROOF))) throw new Error("roof shade");
  if (!(lumWorking(SAN_ROOF_HI) < lum(SAN_ROOF_HI))) throw new Error("roof highlight");
  if (!(lum(SAN_CREAM) < 0.45)) throw new Error("walls are not darker than the floor");
  if (!portraitBuilding(SAN_VIEW.victory.x, SAN_VIEW.victory.z) || !portraitBuilding(SAN_VIEW.lion.x, SAN_VIEW.lion.z)) {
    throw new Error("portrait buildings");
  }
  let blocks = 0;
  for (const id of ["south", "north", "port"] as const) {
    const score = traceScores(id);
    if (score.recall < 0.9 || score.precision < 0.9) throw new Error(`${id} trace overlap ${score.recall.toFixed(3)}/${score.precision.toFixed(3)}`);
    const fault = axisFault(id, score.poly);
    if (fault) throw new Error(`${id} axis street ${fault}`);
    const parts = walkParts(id);
    if (parts.some((n) => n < 20) || parts.filter((n) => n >= 20).length !== 1) throw new Error(`${id} walk is fragmented`);
    const share = SAN_TRACE[id].inside / SAN_TRACE[id].wall;
    if (!(share >= 0.25 && share <= 0.45)) throw new Error(`${id} streets ${(share * 100).toFixed(1)}% of the wall`);
    const cover = roofCoverFault(id);
    if (cover.bare || cover.under) throw new Error(`${id} roofless ${cover.bare} under ${cover.under}`);
    for (const bit of SAN_PROPS[id]) {
      if (bit.y + bit.sy * 0.5 > 1.5) throw new Error(`${id} ${bit.id} is taller than 1.5`);
    }
    for (const ring of DRAW[id].buildings) {
      if (ring.length < 3) continue;
      const footprint = polyArea(ring);
      if (footprint < 3.99) throw new Error(`${id} building under 4 yalm`);
      if (footprint > 200) throw new Error(`${id} roof plane ${footprint.toFixed(0)}`);
      blocks++;
    }
  }
  if (blocks < 6) throw new Error("building walls");
  if (sanCurbHeight(1) > 0.61 || sanCurbHeight(-1) > 1.5 || sanCurbHeight(0) > 1.5) throw new Error("street wall is too tall");
  for (const id of ["south", "north", "port"] as const) {
    const tile = SAN_PAINT[id];
    const spanX = tile.maxX - tile.minX;
    const spanZ = tile.maxZ - tile.minZ;
    if (tile.w / spanX < 8 || tile.h / spanZ < 8) throw new Error(`${id} paint is under 8 px/yalm`);
    if (!(tile.lum >= 0.3 && tile.lum <= 0.45)) throw new Error(`${id} floor luminance ${tile.lum}`);
    if (!(tile.axis <= 2)) throw new Error(`${id} bake edge ${tile.axis}`);
    if (!(tile.roofAxis <= 2)) throw new Error(`${id} roof axis ${tile.roofAxis}`);
    if (tile.roofGap !== 0) throw new Error(`${id} cobble gap ${tile.roofGap}`);
    if (!tile.cobble) throw new Error(`${id} cobble edge`);
    for (const loop of SAN_CURB[id]) {
      const fault = curbOutlineFault(loop);
      if (fault) throw new Error(`${id} curb ${fault}`);
      const stair = diagonalStair(loop);
      if (stair > 1) throw new Error(`${id} roof stair ${stair.toFixed(2)}`);
    }
  }
}
