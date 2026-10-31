/**
 * San d'Oria districts, traced from the retail Vana'diel atlas.
 * Grid units: gx 0 = column A, gy 0 = row 1, +gx east, +gy south.
 * World: x = x0 + gx * cell, z = z0 + gy * cell. Cell is 48 yalms.
 * (0,0) stays F-9 Southern. Northern F-7 is (0,-488). Port G-7 is (0,-874).
 * Walk = plaza polygons + street polylines. Not rectangle rooms.
 */
import { SAN_PAINT } from "./sandoria-paint.generated.ts";

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

const CREAM = 0xb08960;
const SLATE = 0xd5dee8;

/** Outlined landmarks. South faces stay about one yalm so the camera can see over them.
 * Portrait only shows about ±5 yalms of east-west, so the cluster sits on the street edge of that window. */
export const SAN_PROPS: Record<"south" | "north" | "port", SanProp[]> = {
  south: [
    { id: "fountain", shape: "cyl", color: 0xc4b496, x: 0, z: -48, sx: 12, sy: 0.7, sz: 12, y: 0.4 },
    { id: "nw-shop", shape: "box", color: CREAM, roof: SLATE, x: -4.2, z: -60, sx: 3.4, sy: 6.6, sz: 3.2, y: 3.3 },
    { id: "ne-shop", shape: "box", color: CREAM, roof: SLATE, x: 4.2, z: -60, sx: 3.2, sy: 6.0, sz: 3.0, y: 3.0 },
    { id: "west-hall", shape: "box", color: CREAM, roof: SLATE, x: -4.4, z: -8, sx: 2.8, sy: 6.2, sz: 3.6, y: 3.1 },
    { id: "ave-east", shape: "box", color: CREAM, roof: SLATE, x: 4.4, z: -6, sx: 2.6, sy: 5.6, sz: 3.4, y: 2.8 },
    { id: "sw-facade", shape: "box", color: CREAM, roof: SLATE, x: -3.4, z: -36, sx: 3.0, sy: 1.08, sz: 2.2, y: 0.56 },
    { id: "se-facade", shape: "box", color: CREAM, roof: SLATE, x: 3.4, z: -36, sx: 2.8, sy: 1.08, sz: 2.2, y: 0.56 },
    { id: "ave-low", shape: "box", color: CREAM, roof: SLATE, x: 3.2, z: 8, sx: 2.6, sy: 1.08, sz: 2.0, y: 0.56 },
    { id: "ave-low-w", shape: "box", color: CREAM, roof: SLATE, x: -3.2, z: 10, sx: 2.6, sy: 1.08, sz: 2.0, y: 0.56 },
    { id: "cart", shape: "box", color: 0x6a4428, x: 2.2, z: -40, sx: 1.6, sy: 0.6, sz: 1.0, y: 0.35 },
    { id: "crate", shape: "box", color: 0x6a4428, x: -2.0, z: -3, sx: 1.2, sy: 0.7, sz: 1.0, y: 0.4 },
  ],
  north: [
    { id: "nw-house", shape: "box", color: CREAM, roof: SLATE, x: -4.2, z: -500, sx: 3.2, sy: 6.4, sz: 3.2, y: 3.2 },
    { id: "ne-house", shape: "box", color: CREAM, roof: SLATE, x: 4.2, z: -500, sx: 3.0, sy: 5.8, sz: 3.0, y: 2.9 },
    { id: "west-hall", shape: "box", color: CREAM, roof: SLATE, x: -4.6, z: -488, sx: 2.4, sy: 5.4, sz: 3.2, y: 2.7 },
    { id: "sw-facade", shape: "box", color: CREAM, roof: SLATE, x: -3.3, z: -476, sx: 2.8, sy: 1.08, sz: 2.0, y: 0.56 },
    { id: "se-facade", shape: "box", color: CREAM, roof: SLATE, x: 3.3, z: -476, sx: 2.6, sy: 1.08, sz: 2.0, y: 0.56 },
    { id: "cart", shape: "box", color: 0x6a4428, x: 2.2, z: -482, sx: 1.5, sy: 0.6, sz: 1.0, y: 0.34 },
  ],
  port: [
    { id: "west-shed", shape: "box", color: CREAM, roof: SLATE, x: -4.4, z: -886, sx: 2.8, sy: 5.4, sz: 3.2, y: 2.7 },
    { id: "east-shed", shape: "box", color: CREAM, roof: SLATE, x: 4.4, z: -886, sx: 2.6, sy: 5.0, sz: 3.0, y: 2.5 },
    { id: "north-hall", shape: "box", color: CREAM, roof: SLATE, x: 4.2, z: -874, sx: 2.4, sy: 5.6, sz: 3.0, y: 2.8 },
    { id: "sw-facade", shape: "box", color: CREAM, roof: SLATE, x: -3.2, z: -862, sx: 2.6, sy: 1.08, sz: 1.8, y: 0.56 },
    { id: "se-facade", shape: "box", color: CREAM, roof: SLATE, x: 3.2, z: -862, sx: 2.4, sy: 1.08, sz: 1.8, y: 0.56 },
    { id: "cart", shape: "box", color: 0x6a4428, x: -2.0, z: -868, sx: 1.4, sy: 0.55, sz: 0.9, y: 0.32 },
  ],
};

type GridId = "south" | "north" | "port";
const GRIDS: Record<GridId, SanGrid> = { south: SOUTH_GRID, north: NORTH_GRID, port: PORT_GRID };
const GRAPHS: Record<GridId, SanGraph> = { south: SOUTH_GRAPH, north: NORTH_GRAPH, port: PORT_GRAPH };

type Seg = { ax: number; az: number; bx: number; bz: number; half: number };
type Disc = { x: number; z: number; r: number };
type Poly = { pts: { x: number; z: number }[] };

const SEGS: Record<GridId, Seg[]> = { south: [], north: [], port: [] };
const DISCS: Record<GridId, Disc[]> = { south: [], north: [], port: [] };
const POLYS: Record<GridId, Poly[]> = { south: [], north: [], port: [] };

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

for (const id of ["south", "north", "port"] as const) {
  const graph = GRAPHS[id];
  for (const edge of graph.edges) {
    const half = ((edge.width ?? 0.35) * SAN_CELL) / 2;
    for (let i = 0; i + 1 < edge.pts.length; i++) {
      const a = worldOf(id, edge.pts[i][0], edge.pts[i][1]);
      const b = worldOf(id, edge.pts[i + 1][0], edge.pts[i + 1][1]);
      SEGS[id].push({ ax: a.x, az: a.z, bx: b.x, bz: b.z, half });
    }
  }
  for (const node of graph.nodes) {
    if (!node.r) continue;
    const c = worldOf(id, node.gx, node.gy);
    DISCS[id].push({ x: c.x, z: c.z, r: node.r * SAN_CELL });
  }
  for (const area of graph.areas) {
    POLYS[id].push({ pts: area.pts.map(([gx, gy]) => worldOf(id, gx, gy)) });
  }
}

function nearOnSeg(px: number, pz: number, s: Seg) {
  const dx = s.bx - s.ax;
  const dz = s.bz - s.az;
  const len2 = dx * dx + dz * dz;
  const t = len2 ? Math.max(0, Math.min(1, ((px - s.ax) * dx + (pz - s.az) * dz) / len2)) : 0;
  return { x: s.ax + t * dx, z: s.az + t * dz };
}

function insidePoly(x: number, z: number, poly: Poly) {
  const pts = poly.pts;
  let hit = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const a = pts[i];
    const b = pts[j];
    if ((a.z > z) !== (b.z > z) && x < ((b.x - a.x) * (z - a.z)) / (b.z - a.z + 0) + a.x) hit = !hit;
  }
  return hit;
}

function distToPoly(x: number, z: number, poly: Poly) {
  let best = Infinity;
  let qx = x;
  let qz = z;
  const pts = poly.pts;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const a = pts[j];
    const b = pts[i];
    const dx = b.x - a.x;
    const dz = b.z - a.z;
    const len2 = dx * dx + dz * dz;
    const t = len2 ? Math.max(0, Math.min(1, ((x - a.x) * dx + (z - a.z) * dz) / len2)) : 0;
    const px = a.x + t * dx;
    const pz = a.z + t * dz;
    const d = Math.hypot(x - px, z - pz);
    if (d < best) {
      best = d;
      qx = px;
      qz = pz;
    }
  }
  const inside = insidePoly(x, z, poly);
  return { inside, dist: best, x: qx, z: qz };
}

function clearance(id: GridId, x: number, z: number) {
  let best = -Infinity;
  for (const poly of POLYS[id]) {
    const hit = distToPoly(x, z, poly);
    best = Math.max(best, hit.inside ? hit.dist : -hit.dist);
  }
  for (const seg of SEGS[id]) {
    const q = nearOnSeg(x, z, seg);
    best = Math.max(best, seg.half - Math.hypot(x - q.x, z - q.z));
  }
  for (const disc of DISCS[id]) best = Math.max(best, disc.r - Math.hypot(x - disc.x, z - disc.z));
  return best;
}

function clampGraph(id: GridId, x: number, z: number, radius: number) {
  if (clearance(id, x, z) >= radius) return { x, z };
  let best = -Infinity;
  let cx = x;
  let cz = z;
  let room = 0;
  let inwardX = 0;
  let inwardZ = 0;
  for (const poly of POLYS[id]) {
    const hit = distToPoly(x, z, poly);
    const c = hit.inside ? hit.dist : -hit.dist;
    if (c > best) {
      best = c;
      cx = hit.x;
      cz = hit.z;
      room = hit.inside ? hit.dist : 0;
      const dx = x - hit.x;
      const dz = z - hit.z;
      const len = Math.hypot(dx, dz) || 1;
      inwardX = hit.inside ? dx / len : -dx / len;
      inwardZ = hit.inside ? dz / len : -dz / len;
    }
  }
  for (const seg of SEGS[id]) {
    const q = nearOnSeg(x, z, seg);
    const c = seg.half - Math.hypot(x - q.x, z - q.z);
    if (c > best) {
      best = c;
      cx = q.x;
      cz = q.z;
      room = seg.half;
      inwardX = 0;
      inwardZ = 0;
    }
  }
  for (const disc of DISCS[id]) {
    const c = disc.r - Math.hypot(x - disc.x, z - disc.z);
    if (c > best) {
      best = c;
      cx = disc.x;
      cz = disc.z;
      room = disc.r;
      inwardX = 0;
      inwardZ = 0;
    }
  }
  if (inwardX || inwardZ) {
    const inset = Math.max(radius, 0.05);
    return { x: cx + inwardX * inset, z: cz + inwardZ * inset };
  }
  const dx = x - cx;
  const dz = z - cz;
  const len = Math.hypot(dx, dz) || 1;
  const keep = Math.max(0, room - radius);
  return { x: cx + (dx / len) * keep, z: cz + (dz / len) * keep };
}

export function inSouthGraph(x: number, z: number, radius = 0) {
  return clearance("south", x, z) >= radius;
}
export function inNorthGraph(x: number, z: number, radius = 0) {
  return clearance("north", x, z) >= radius;
}
export function inPortGraph(x: number, z: number, radius = 0) {
  return clearance("port", x, z) >= radius;
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

export type SanDraw = {
  areas: { x: number; z: number }[][];
  spans: { ax: number; az: number; bx: number; bz: number; width: number }[];
};

export function sanDraw(id: GridId): SanDraw {
  return {
    areas: POLYS[id].map((poly) => poly.pts),
    spans: SEGS[id].map((seg) => ({ ax: seg.ax, az: seg.az, bx: seg.bx, bz: seg.bz, width: seg.half * 2 })),
  };
}

const LETTERS = "ABCDEFGHIJKLMNOP";
export function sanSquare(id: GridId, x: number, z: number) {
  const g = GRIDS[id];
  const col = Math.floor((x - g.x0) / g.cell);
  const row = Math.floor((z - g.z0) / g.cell);
  if (col < 0 || row < 0 || col >= g.cols || row >= g.rows) return "?";
  return `${LETTERS[col]}-${row + 1}`;
}

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

function cover(id: GridId, squares: readonly string[]) {
  const inside = (x: number, z: number) => (id === "south" ? inSouthGraph(x, z, 0) : id === "north" ? inNorthGraph(x, z, 0) : inPortGraph(x, z, 0));
  const miss: string[] = [];
  for (const square of squares) {
    const at = centerOf(id, square);
    if (sanSquare(id, at.x, at.z) !== square || !inside(at.x, at.z)) miss.push(square);
  }
  return miss;
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
  const southMiss = cover("south", SOUTH_RETAIL);
  if (southMiss.length / SOUTH_RETAIL.length > 0.1) throw new Error(`south trace ${southMiss.join(" ")}`);
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
  const northMiss = cover("north", NORTH_RETAIL);
  if (northMiss.length / NORTH_RETAIL.length > 0.1) throw new Error(`north trace ${northMiss.join(" ")}`);
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
  const portMiss = cover("port", PORT_RETAIL);
  if (portMiss.length / PORT_RETAIL.length > 0.1) throw new Error(`port trace ${portMiss.join(" ")}`);
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
  let walls = 0;
  let low = 0;
  for (const id of ["south", "north", "port"] as const) {
    for (const bit of SAN_PROPS[id]) {
      if (bit.shape !== "box" || bit.sy < 1) continue;
      if (bit.roof == null) throw new Error(`${bit.id} has no roof`);
      if (!(lum(bit.color) < lum(bit.roof) - 0.05)) throw new Error(`${bit.id} walls are not darker than the roof`);
      walls++;
      if (bit.sy < 1.4) low++;
    }
  }
  if (walls < 6 || low < 3) throw new Error("building walls");
  for (const id of ["south", "north", "port"] as const) {
    const tile = SAN_PAINT[id];
    const spanX = tile.maxX - tile.minX;
    const spanZ = tile.maxZ - tile.minZ;
    if (tile.w / spanX < 3.9 || tile.h / spanZ < 3.9) throw new Error(`${id} paint is under 4 px/yalm`);
    if (!(tile.lum >= 0.3 && tile.lum <= 0.45)) throw new Error(`${id} floor luminance ${tile.lum}`);
  }
}
