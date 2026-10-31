/**
 * San d'Oria districts, traced in the Ranguemont graph format.
 * Grid units: gx 0 = column A, gy 0 = row 1, +gx east, +gy south.
 * World: x = x0 + gx * cell, z = z0 + gy * cell. Cell is 12 yalms.
 * Walk = plaza polygons + street polylines. Not rectangle rooms.
 */
export const SAN_CELL = 12;

export const SOUTH_GRID = { zone: "sandoria-south", x0: -66, z0: -100, cell: SAN_CELL, cols: 12, rows: 12 } as const;
export const NORTH_GRID = { zone: "sandoria-north", x0: -70, z0: -382, cell: SAN_CELL, cols: 12, rows: 12 } as const;
export const PORT_GRID = { zone: "sandoria-port", x0: -74, z0: -500, cell: SAN_CELL, cols: 12, rows: 12 } as const;

export type SanGrid = { zone: string; x0: number; z0: number; cell: number; cols: number; rows: number };
export type SanNodeKind = "exit" | "junction" | "plaza" | "closed";
export type SanNode = { id: string; gx: number; gy: number; grid: string; kind: SanNodeKind; r?: number; to?: string };
export type SanEdge = { id: string; from: string; to: string; width?: number; pts: [number, number][] };
export type SanArea = { id: string; kind: "plaza" | "court" | "quay"; grid: string; pts: [number, number][] };
export type SanGraph = { id: "south" | "north" | "port"; nodes: SanNode[]; edges: SanEdge[]; areas: SanArea[] };

export const SOUTH_GRAPH: SanGraph = {
  id: "south",
  nodes: [
    { id: "plaza", gx: 5.5, gy: 8.333, grid: "F-9", kind: "plaza", r: 0.35 },
    { id: "exit_ronfaure", gx: 5.5, gy: 9.521, grid: "F-10", kind: "exit", to: "ronfaure-south" },
    { id: "exit_east", gx: 11.5, gy: 9.5, grid: "L-10", kind: "exit", to: "east-ronfaure" },
    { id: "exit_north", gx: 8.5, gy: 6.5, grid: "I-7", kind: "exit", to: "sandoria-north" },
    { id: "chocobo", gx: 7.217, gy: 9.55, grid: "H-10", kind: "closed", r: 0.16 },
  ],
  edges: [
    { id: "bridge", from: "plaza", to: "exit_ronfaure", width: 0.26, pts: [[5.5, 8.92], [5.5, 9.56]] },
    { id: "east_road", from: "plaza", to: "exit_east", width: 0.42, pts: [[6.7, 8.55], [8.1, 8.75], [9.55, 9.2], [10.5, 9.5], [11.55, 9.52]] },
    { id: "north_street", from: "plaza", to: "exit_north", width: 0.42, pts: [[6.15, 7.2], [6.55, 6.35], [6.5, 5.0], [6.5, 6.5], [8.5, 6.5], [8.5, 7.55]] },
    { id: "chocobo_spur", from: "plaza", to: "chocobo", width: 0.36, pts: [[6.35, 8.75], [7.217, 9.12], [7.217, 9.56]] },
  ],
  areas: [
    {
      id: "lion_square",
      kind: "plaza",
      grid: "F-9",
      pts: [
        [4.167, 7.333],
        [5.167, 7.0],
        [6.667, 7.167],
        [6.833, 8.0],
        [6.75, 8.833],
        [6.167, 9.1],
        [5.667, 9.083],
        [4.333, 9.0],
        [4.167, 8.333],
      ],
    },
  ],
};

export const NORTH_GRAPH: SanGraph = {
  id: "north",
  nodes: [
    { id: "court", gx: 5.4, gy: 6.9, grid: "F-7", kind: "plaza", r: 0.4 },
    { id: "exit_south", gx: 8.5, gy: 9.5, grid: "I-10", kind: "exit", to: "sandoria-south" },
    { id: "exit_west", gx: 2.567, gy: 7.5, grid: "C-8", kind: "exit", to: "ronfaure-north" },
    { id: "exit_port", gx: 5.5, gy: 2.5, grid: "F-3", kind: "exit", to: "sandoria-port" },
    { id: "chateau", gx: 6.5, gy: 4.167, grid: "G-5", kind: "closed", r: 0.14 },
    { id: "landing", gx: 2.55, gy: 4.5, grid: "C-5", kind: "closed", r: 0.14 },
  ],
  edges: [
    { id: "to_south", from: "court", to: "exit_south", width: 0.4, pts: [[7.2, 8.15], [8.5, 8.833], [8.5, 9.55]] },
    { id: "to_west", from: "court", to: "exit_west", width: 0.4, pts: [[4.2, 7.05], [3.333, 6.5], [2.567, 7.5]] },
    { id: "to_port", from: "court", to: "exit_port", width: 0.4, pts: [[5.55, 5.7], [5.5, 3.2], [4.5, 3.167], [5.5, 3.2], [5.5, 2.45]] },
    { id: "to_chateau", from: "court", to: "chateau", width: 0.34, pts: [[6.35, 5.75], [6.5, 4.833], [6.5, 4.12]] },
    { id: "to_landing", from: "court", to: "landing", width: 0.32, pts: [[4.15, 7.35], [3.4, 6.1], [3.167, 4.5], [2.55, 4.5]] },
  ],
  areas: [
    {
      id: "watch_court",
      kind: "court",
      grid: "F-7",
      pts: [
        [4.0, 5.833],
        [5.333, 5.333],
        [6.667, 5.833],
        [7.833, 7.0],
        [7.667, 8.333],
        [6.5, 8.833],
        [5.167, 8.667],
        [4.167, 7.667],
      ],
    },
  ],
};

export const PORT_GRAPH: SanGraph = {
  id: "port",
  nodes: [
    { id: "quay", gx: 6.15, gy: 6.7, grid: "G-7", kind: "plaza", r: 0.35 },
    { id: "exit_north", gx: 5.5, gy: 9.5, grid: "F-10", kind: "exit", to: "sandoria-north" },
    { id: "pier_end", gx: 6.333, gy: 3.82, grid: "G-4", kind: "junction", r: 0.08 },
    { id: "fisher", gx: 6.575, gy: 3.817, grid: "G-4", kind: "junction", r: 0.08 },
    { id: "joulet", gx: 6.108, gy: 3.817, grid: "G-4", kind: "junction", r: 0.06 },
  ],
  edges: [
    { id: "to_north", from: "quay", to: "exit_north", width: 0.42, pts: [[5.7, 8.4], [5.5, 8.55], [5.5, 9.55]] },
    { id: "pier_deck", from: "quay", to: "pier_end", width: 0.7, pts: [[6.25, 5.2], [6.29, 4.35]] },
    { id: "pier_tip", from: "quay", to: "pier_end", width: 0.5, pts: [[6.333, 4.5], [6.333, 3.82]] },
  ],
  areas: [
    {
      id: "quay_plaza",
      kind: "quay",
      grid: "G-7",
      pts: [
        [4.833, 8.333],
        [5.0, 5.833],
        [5.667, 4.833],
        [6.833, 5.0],
        [7.167, 6.667],
        [7.0, 8.5],
        [6.167, 9.167],
        [5.167, 9.0],
      ],
    },
  ],
};

export type SanProp = { id: string; shape: "box" | "cyl"; color: number; x: number; z: number; sx: number; sy: number; sz: number; y: number };

/** Outlined landmarks. Few per district, off the street center. South faces stay about one yalm. */
export const SAN_PROPS: Record<"south" | "north" | "port", SanProp[]> = {
  south: [
    { id: "west-row", shape: "box", color: 0xd8c7a4, x: -4.6, z: -9.2, sx: 2.2, sy: 2.15, sz: 3.4, y: 1.12 },
    { id: "east-row", shape: "box", color: 0xcbb892, x: 4.4, z: -10.4, sx: 2.1, sy: 2.05, sz: 2.8, y: 1.08 },
    { id: "north-shop", shape: "box", color: 0xe4d3b0, x: 0.2, z: -13.6, sx: 4.6, sy: 2.25, sz: 1.15, y: 1.16 },
    { id: "south-stall", shape: "box", color: 0xc4b496, x: -4.4, z: 2.2, sx: 2.2, sy: 1.02, sz: 1.35, y: 0.55 },
    { id: "fountain", shape: "cyl", color: 0xb7a48a, x: 0, z: -6.3, sx: 2.5, sy: 0.38, sz: 2.5, y: 0.24 },
    { id: "fountain-water", shape: "cyl", color: 0x6aa4c8, x: 0, z: -6.3, sx: 1.7, sy: 0.12, sz: 1.7, y: 0.42 },
    { id: "brazier", shape: "box", color: 0x4a4038, x: -3.1, z: -4.6, sx: 0.42, sy: 0.55, sz: 0.42, y: 0.32 },
    { id: "cart", shape: "box", color: 0x6a4428, x: 3.15, z: -2.35, sx: 1.55, sy: 0.62, sz: 0.95, y: 0.38 },
    { id: "crate-a", shape: "box", color: 0x8a6844, x: 3.55, z: -1.35, sx: 0.48, sy: 0.44, sz: 0.48, y: 0.26 },
    { id: "crate-b", shape: "box", color: 0x7a5a38, x: 2.55, z: -1.55, sx: 0.4, sy: 0.36, sz: 0.4, y: 0.22 },
  ],
  north: [
    { id: "chateau-gate", shape: "box", color: 0xcfc3a4, x: 8, z: -333.4, sx: 5.2, sy: 2.4, sz: 0.7, y: 1.25 },
    { id: "chateau-door", shape: "box", color: 0x3a2a1c, x: 8, z: -332.9, sx: 1.3, sy: 1.7, sz: 0.2, y: 0.9 },
    { id: "house-w", shape: "box", color: 0xd8c7a4, x: -4.0, z: -305.2, sx: 2.4, sy: 2.05, sz: 1.2, y: 1.08 },
    { id: "house-e", shape: "box", color: 0xcbb892, x: 4.1, z: -305.4, sx: 2.3, sy: 2.0, sz: 1.15, y: 1.05 },
    { id: "north-fountain", shape: "cyl", color: 0x6aa4c8, x: 0.15, z: -307.2, sx: 1.8, sy: 0.28, sz: 1.8, y: 0.18 },
    { id: "cart", shape: "box", color: 0x6a4428, x: 2.4, z: -296.2, sx: 1.35, sy: 0.55, sz: 0.85, y: 0.32 },
    { id: "crate", shape: "box", color: 0x8a6844, x: -2.15, z: -296.6, sx: 0.46, sy: 0.4, sz: 0.46, y: 0.24 },
  ],
  port: [
    { id: "auction", shape: "box", color: 0xd8c7a0, x: -3.7, z: -426.4, sx: 2.5, sy: 2.1, sz: 1.15, y: 1.1 },
    { id: "auction-door", shape: "box", color: 0x3a2a1c, x: -3.7, z: -425.75, sx: 0.85, sy: 1.4, sz: 0.16, y: 0.74 },
    { id: "mog", shape: "box", color: 0xe4d7b8, x: 3.75, z: -426.6, sx: 2.4, sy: 2.05, sz: 1.1, y: 1.08 },
    { id: "mog-door", shape: "box", color: 0x6a4030, x: 3.75, z: -425.95, sx: 0.8, sy: 1.35, sz: 0.16, y: 0.72 },
    { id: "quay-shed", shape: "box", color: 0xc4b496, x: -3.3, z: -415.6, sx: 2.2, sy: 1.02, sz: 1.15, y: 0.54 },
    { id: "pier-house", shape: "box", color: 0xd8c7a4, x: 0.2, z: -432.4, sx: 2.4, sy: 1.9, sz: 1.05, y: 1.0 },
    { id: "cart", shape: "box", color: 0x6a4428, x: 2.15, z: -421.6, sx: 1.35, sy: 0.55, sz: 0.8, y: 0.32 },
    { id: "crate-a", shape: "box", color: 0x8a6844, x: -1.7, z: -422.2, sx: 0.46, sy: 0.4, sz: 0.46, y: 0.24 },
    { id: "crate-b", shape: "box", color: 0x7a5a38, x: -1.15, z: -421.7, sx: 0.36, sy: 0.32, sz: 0.36, y: 0.18 },
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

export function assertSanGraph(): void {
  const southIn: [number, number][] = [
    [0, 0],
    [0, 10],
    [0, 11.2],
    [0, 14.25],
    [12, -12],
    [12, -40],
    [36, -22],
    [36, -10],
    [72, 14],
    [60, 14],
    [20.6, 14.6],
    [20.6, 9.2],
    [3.5, -4.4],
    [4.2, 5.6],
    [7, 7.95],
  ];
  for (const [x, z] of southIn) {
    if (!inSouthGraph(x, z, 0)) throw new Error(`south graph misses ${x},${z}`);
  }
  const southSq: [number, number, string][] = [
    [0, 0, "F-9"],
    [0, 11.2, "F-10"],
    [0, 14.25, "F-10"],
    [36, -22, "I-7"],
    [36, -10, "I-8"],
    [72, 14, "L-10"],
    [60, 14, "K-10"],
    [12, -40, "G-6"],
  ];
  for (const [x, z, square] of southSq) {
    if (sanSquare("south", x, z) !== square) throw new Error(`south ${x},${z} is ${sanSquare("south", x, z)} not ${square}`);
  }
  for (const [x, z] of [[7, 12], [0, -20], [0, 40], [40, 20], [12, -80]] as const) {
    if (inSouthGraph(x, z, 0)) throw new Error(`south graph includes ${x},${z}`);
  }
  if (!inSouthGraph(7, 7.95, 0.2)) throw new Error("south clamp shoulder");
  const northIn: [number, number, string][] = [
    [-10, -300, "F-7"],
    [0, -300, "F-7"],
    [-39.2, -292, "C-8"],
    [-30, -304, "D-7"],
    [32, -268, "I-10"],
    [32, -276, "I-9"],
    [-4, -352, "F-3"],
    [-16, -344, "E-4"],
    [8, -332, "G-5"],
    [8, -324, "G-5"],
    [-39.4, -328, "C-5"],
    [-32, -328, "D-5"],
    [18, -290, "H-8"],
  ];
  for (const [x, z, square] of northIn) {
    if (!inNorthGraph(x, z, 0)) throw new Error(`north graph misses ${x},${z}`);
    if (sanSquare("north", x, z) !== square) throw new Error(`north ${x},${z} is ${sanSquare("north", x, z)} not ${square}`);
  }
  const portIn: [number, number, string][] = [
    [0, -420, "G-7"],
    [-8, -386, "F-10"],
    [-8, -396, "F-9"],
    [2, -454, "G-4"],
    [4.9, -454.2, "G-4"],
    [-0.7, -454.2, "G-4"],
    [5.2, -443.2, "G-5"],
    [5.2, -442.05, "G-5"],
  ];
  for (const [x, z, square] of portIn) {
    if (!inPortGraph(x, z, 0)) throw new Error(`port graph misses ${x},${z}`);
    if (sanSquare("port", x, z) !== square) throw new Error(`port ${x},${z} is ${sanSquare("port", x, z)} not ${square}`);
  }
  if (inPortGraph(2, -458, 0.2)) throw new Error("past the pier");
  if (inPortGraph(12, -460, 0)) throw new Error("harbor water");
  if (inSouthGraph(32, -276, 0) || inNorthGraph(0, 0, 0) || inPortGraph(-10, -300, 0)) throw new Error("districts overlap");
  const shoulder = clampSouthGraph(7, 12, 0.36);
  if (!inSouthGraph(shoulder.x, shoulder.z, 0.2)) throw new Error("south clamp");
}
