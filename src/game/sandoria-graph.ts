/**
 * San d'Oria districts, traced from the retail Vana'diel atlas plates.
 * Grid units: gx 0 = column A, gy 0 = row 1, +gx east, +gy south.
 * World: x = x0 + gx * cell, z = z0 + gy * cell. Cell is 48 yalms.
 * (0,0) stays F-9 Southern. Northern F-7 is (0,-488). Port G-7 is (0,-874).
 * Walk polygons come from the traced plates, not chains of square centres.
 */
import { SAN_PAINT } from "./sandoria-paint.generated.ts";
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

export const SAN_CREAM = 0xb08960;
export const SAN_SLATE = 0xd5dee8;

/** Lion Springs basin. Building blocks come from the traced footprints, not these boxes. */
export const SAN_PROPS: Record<"south" | "north" | "port", SanProp[]> = {
  south: [{ id: "fountain", shape: "cyl", color: 0xc4b496, x: 0, z: -48, sx: 12, sy: 0.7, sz: 12, y: 0.4 }],
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
  if (!(lum(SAN_CREAM) < lum(SAN_SLATE) - 0.05)) throw new Error("walls are not darker than the roof");
  let blocks = 0;
  let low = 0;
  for (const id of ["south", "north", "port"] as const) {
    const score = traceScores(id);
    if (score.recall < 0.9 || score.precision < 0.9) throw new Error(`${id} trace overlap ${score.recall.toFixed(3)}/${score.precision.toFixed(3)}`);
    const fault = axisFault(id, score.poly);
    if (fault) throw new Error(`${id} axis street ${fault}`);
    for (const ring of DRAW[id].buildings) {
      if (ring.length < 3) continue;
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
      const south = sanEave(zMax, zMin, zMax, north);
      if (!(south < 1.4) || !(north >= 4 && north <= 8)) throw new Error(`${id} eave ${south}/${north}`);
      blocks++;
      if (south < 1.4) low++;
    }
  }
  if (blocks < 6 || low < 3) throw new Error("building walls");
  if (!portraitBuilding(0, -38) || !portraitBuilding(0, 0)) throw new Error("portrait buildings");
  for (const id of ["south", "north", "port"] as const) {
    const tile = SAN_PAINT[id];
    const spanX = tile.maxX - tile.minX;
    const spanZ = tile.maxZ - tile.minZ;
    if (tile.w / spanX < 3.9 || tile.h / spanZ < 3.9) throw new Error(`${id} paint is under 4 px/yalm`);
    if (!(tile.lum >= 0.3 && tile.lum <= 0.45)) throw new Error(`${id} floor luminance ${tile.lum}`);
  }
}
