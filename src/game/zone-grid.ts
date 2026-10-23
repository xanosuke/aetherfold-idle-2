/**
 * Retail map squares. One grid per built zone (three for Ranperre, two for Yughott).
 * +X east, +Z south, column 0 = A, row 0 = row 1.
 * world x = x0 + col * cell, world z = z0 + row * cell. "C-7" is column 2, row 6.
 * Tomb labels must use tombSquare() (floor hit). Yughott labels must use
 * yughottSquare(): the two map boxes overlap, and gridAt asks the grotto which
 * floor a point is on.
 *
 * TODO: Horlais Peak has no retail grid.
 * TODO: San d'Oria (sandoria-south, sandoria-north, sandoria-port) has no retail grid.
 */
import { PASS_CELL, PASS_X, PASS_Z } from "./pass-graph";

export type ZoneGrid = {
  zone: string;
  map?: number;
  x0: number;
  z0: number;
  cell: number;
  cols: number;
  rows: number;
};

/** Same expression as ghelsba.ts CELL, so the chart lines do not shift. */
const GHELSBA_CELL = 32 * 2.05;

const LETTERS = "ABCDEFGHIJKLMNOP";

export const ZONE_GRIDS: readonly ZoneGrid[] = [
  { zone: "ronfaure-south", x0: -288, z0: 220, cell: 48, cols: 12, rows: 12 },
  { zone: "ronfaure-north", x0: -288, z0: 220, cell: 48, cols: 12, rows: 12 },
  { zone: "east-ronfaure", x0: 360, z0: 220, cell: 48, cols: 12, rows: 12 },
  { zone: "ranguemont", x0: PASS_X, z0: PASS_Z, cell: PASS_CELL, cols: 15, rows: 15 },
  { zone: "beaucedine", x0: 400, z0: -854, cell: 48, cols: 15, rows: 15 },
  { zone: "ranperre", map: 1, x0: 300, z0: 900, cell: 48, cols: 15, rows: 15 },
  { zone: "ranperre", map: 2, x0: -820, z0: 900, cell: 48, cols: 15, rows: 15 },
  { zone: "ranperre", map: 3, x0: 40, z0: 1320, cell: 48, cols: 15, rows: 15 },
  { zone: "ghelsba", x0: -1520, z0: 150, cell: GHELSBA_CELL, cols: 12, rows: 12 },
  { zone: "fort-ghelsba", x0: -1520, z0: 920, cell: GHELSBA_CELL, cols: 12, rows: 12 },
  { zone: "yughott", map: 1, x0: -1040, z0: 150, cell: GHELSBA_CELL, cols: 12, rows: 12 },
  // Map 2 origin matches ghelsba.ts Y2_X / Y2_Z. J-6 sits just south of map 1's I-9.
  { zone: "yughott", map: 2, x0: -1040 - 32 * 2.05, z0: 217.25 + 4 * 32 * 2.05, cell: GHELSBA_CELL, cols: 12, rows: 12 },
];

/** Grotto (and any later multi-map zone) tells gridAt which floor a point is on. */
let pickMap: ((zone: string, x: number, z: number) => number | null) | null = null;

export function registerZoneMap(fn: (zone: string, x: number, z: number) => number | null): void {
  pickMap = fn;
}

export function parseSquare(square: string): { col: number; row: number } | null {
  const match = /^([A-P])-(\d+)$/.exec(square);
  if (!match) return null;
  const row = Number(match[2]) - 1;
  if (row < 0) return null;
  return { col: match[1].charCodeAt(0) - 65, row };
}

export function squareOf(grid: ZoneGrid, x: number, z: number): string {
  const col = Math.floor((x - grid.x0) / grid.cell);
  const row = Math.floor((z - grid.z0) / grid.cell);
  if (col < 0 || row < 0 || col >= grid.cols || row >= grid.rows) return "?";
  return `${LETTERS[col]}-${row + 1}`;
}

export function squareCenter(grid: ZoneGrid, square: string): { x: number; z: number } | null {
  const parsed = parseSquare(square);
  if (!parsed || parsed.col >= grid.cols || parsed.row >= grid.rows) return null;
  return {
    x: grid.x0 + (parsed.col + 0.5) * grid.cell,
    z: grid.z0 + (parsed.row + 0.5) * grid.cell,
  };
}

/** Grid for a zone at a point. Tomb callers that need a stable label should use tombSquare. */
export function gridAt(zone: string, x: number, z: number): ZoneGrid | null {
  const rows = ZONE_GRIDS.filter((g) => g.zone === zone);
  if (!rows.length) return null;
  const forced = pickMap?.(zone, x, z);
  if (forced != null) {
    const chosen = rows.find((g) => g.map === forced);
    if (chosen) return chosen;
  }
  if (rows.length === 1) return rows[0];
  const inside = rows.filter((g) => {
    const col = Math.floor((x - g.x0) / g.cell);
    const row = Math.floor((z - g.z0) / g.cell);
    return col >= 0 && row >= 0 && col < g.cols && row < g.rows;
  });
  if (!inside.length) return rows.find((g) => g.map === 1) ?? rows[0];
  if (inside.length === 1) return inside[0];
  let best = inside[0];
  let bestD = Infinity;
  for (const g of inside) {
    const col = Math.floor((x - g.x0) / g.cell);
    const row = Math.floor((z - g.z0) / g.cell);
    const dist = Math.hypot(x - (g.x0 + (col + 0.5) * g.cell), z - (g.z0 + (row + 0.5) * g.cell));
    if (dist < bestD) {
      best = g;
      bestD = dist;
    }
  }
  return best;
}
