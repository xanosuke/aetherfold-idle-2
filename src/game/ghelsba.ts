/**
 * Ghelsba Outpost and the three zones that open off it.
 * Retail grids: columns A–L are 0–11, rows 1–12 are 0–11, north is -Z.
 * Connections follow the retail maps, not a square dungeon:
 *   Ghelsba Outpost — traced retail floor. West Ronfaure J-11, Fort Ghelsba H-8,
 *   Yughott Grotto I-11, Hut Door F-10. Fort Ghelsba and Yughott keep their rooms.
 *   Fort Ghelsba — Outpost E-8, Yughott G-9 / J-7 / J-8
 *   Yughott Grotto — Outpost E-9, Fort H-8 / F-7 / K-5, Horlais Peak J-9 / K-6
 *   Horlais Peak — the two grotto mouths, the hot spring, and the Burning Circle
 * The three dens are drawn larger than the first pass so a retail camp
 * fits in each lobe without standing on a gate. Horlais Peak is unchanged.
 */

import { gridAt, registerZoneMap, squareOf, ZONE_GRIDS } from "./zone-grid";
import {
  GHELSBA_DISCS,
  GHELSBA_GRAPH,
  GHELSBA_RINGS,
  GHELSBA_SEGS,
  clampGhelsbaGraph,
  gridToWorld,
} from "./ghelsba-graph";

/** World box of the traced floor, padded by the widest path. Outside it, clearance cannot be positive. */
const GRAPH_BOX = (() => {
  let minX = Infinity;
  let maxX = -Infinity;
  let minZ = Infinity;
  let maxZ = -Infinity;
  let pad = 0;
  const cover = (gx: number, gy: number, extra = 0) => {
    const at = gridToWorld(gx, gy);
    minX = Math.min(minX, at.x);
    maxX = Math.max(maxX, at.x);
    minZ = Math.min(minZ, at.z);
    maxZ = Math.max(maxZ, at.z);
    pad = Math.max(pad, extra);
  };
  for (const node of GHELSBA_GRAPH.nodes) cover(node.gx, node.gy, (node.r ?? 0) * 65.6);
  for (const edge of GHELSBA_GRAPH.edges) {
    const extra = ((edge.width ?? 0.14) * 65.6) / 2;
    for (const [gx, gy] of edge.pts) cover(gx, gy, extra);
  }
  for (const area of GHELSBA_GRAPH.areas) {
    for (const [gx, gy] of area.pts) cover(gx, gy, 0);
    for (const hole of area.holes ?? []) for (const [gx, gy] of hole) cover(gx, gy, 0);
  }
  const slack = pad + 2;
  return { minX: minX - slack, maxX: maxX + slack, minZ: minZ - slack, maxZ: maxZ + slack };
})();

function outsideGraph(x: number, z: number, radius = 0): boolean {
  return x < GRAPH_BOX.minX - radius || x > GRAPH_BOX.maxX + radius || z < GRAPH_BOX.minZ - radius || z > GRAPH_BOX.maxZ + radius;
}

export type Rect = { minX: number; maxX: number; minZ: number; maxZ: number };

export type OrcGate = {
  id: string;
  name: string;
  x: number;
  z: number;
  hx: number;
  hz: number;
  to: string;
  side: "n" | "s" | "e" | "w";
  arrive: { x: number; z: number; yaw: number; log: string };
};

const DEN = 2.05;
const u = (n: number) => n * DEN;
const CELL = u(32);

// Shifted apart so the larger dens do not meet each other or West Ronfaure.
const OUT_X = -1520;
const OUT_Z = 150;
const FORT_X = -1520;
const FORT_Z = 920;
const YUG_X = -1040;
const YUG_Z = 150;
const PEAK_X = -1720;
const PEAK_Z = -40;

function cell(ox: number, oz: number, col: number, row: number) {
  return { x: ox + (col + 0.5) * CELL, z: oz + (row + 0.5) * CELL };
}

function room(ox: number, oz: number, col: number, row: number, w: number, d: number, dx = 0, dz = 0): Rect {
  const c = cell(ox, oz, col, row);
  const W = u(w);
  const D = u(d);
  const DX = u(dx);
  const DZ = u(dz);
  return { minX: c.x + DX - W / 2, maxX: c.x + DX + W / 2, minZ: c.z + DZ - D / 2, maxZ: c.z + DZ + D / 2 };
}

function boxAt(cx: number, cz: number, w: number, d: number): Rect {
  return { minX: cx - w / 2, maxX: cx + w / 2, minZ: cz - d / 2, maxZ: cz + d / 2 };
}

function paths(a: Rect, b: Rect, width: number): Rect[] {
  const ac = mid(a);
  const bc = mid(b);
  const h = width / 2;
  const horiz: Rect = {
    minX: Math.min(ac.x, bc.x) - h,
    maxX: Math.max(ac.x, bc.x) + h,
    minZ: ac.z - h,
    maxZ: ac.z + h,
  };
  const vert: Rect = {
    minX: bc.x - h,
    maxX: bc.x + h,
    minZ: Math.min(ac.z, bc.z) - h,
    maxZ: Math.max(ac.z, bc.z) + h,
  };
  if (Math.abs(ac.z - bc.z) < 1) return [horiz];
  if (Math.abs(ac.x - bc.x) < 1) return [vert];
  return [horiz, vert];
}

function join(rooms: Rect[], links: readonly [Rect, Rect, number][]): Rect[] {
  const out = rooms.slice();
  for (const [a, b, width] of links) out.push(...paths(a, b, u(width)));
  return out;
}

// Close the seam across the whole shared span. A thin center bridge leaves plus-shaped holes.
function weld(rooms: Rect[], links: readonly [Rect, Rect, number][]): Rect[] {
  const out = rooms.slice();
  for (const [a, b, width] of links) {
    const x0 = Math.max(a.minX, b.minX);
    const x1 = Math.min(a.maxX, b.maxX);
    const z0 = Math.max(a.minZ, b.minZ);
    const z1 = Math.min(a.maxZ, b.maxZ);
    if (x1 - x0 > 0 && z1 - z0 > 0) continue;
    if (x1 - x0 >= u(6)) {
      const minZ = Math.min(a.maxZ, b.maxZ);
      const maxZ = Math.max(a.minZ, b.minZ);
      if (maxZ > minZ && maxZ - minZ <= u(28)) out.push({ minX: x0, maxX: x1, minZ, maxZ });
      else out.push(...paths(a, b, u(width)));
      continue;
    }
    if (z1 - z0 >= u(6)) {
      const minX = Math.min(a.maxX, b.maxX);
      const maxX = Math.max(a.minX, b.minX);
      if (maxX > minX && maxX - minX <= u(28)) out.push({ minX, maxX, minZ: z0, maxZ: z1 });
      else out.push(...paths(a, b, u(width)));
      continue;
    }
    out.push(...paths(a, b, u(width)));
  }
  return out;
}

function mid(rect: Rect) {
  return { x: (rect.minX + rect.maxX) / 2, z: (rect.minZ + rect.maxZ) / 2 };
}

function mouth(rect: Rect, side: OrcGate["side"], name: string, id: string, to: string, log: string, stand: { x: number; z: number }): OrcGate {
  const c = mid(rect);
  const at = {
    n: { x: c.x, z: rect.minZ + 2.6 },
    s: { x: c.x, z: rect.maxZ - 2.6 },
    w: { x: rect.minX + 2.6, z: c.z },
    e: { x: rect.maxX - 2.6, z: c.z },
  }[side];
  return {
    id,
    name,
    x: at.x,
    z: at.z,
    hx: side === "e" || side === "w" ? 2.4 : 5.2,
    hz: side === "n" || side === "s" ? 2.4 : 5.2,
    to,
    side,
    arrive: { x: stand.x, z: stand.z, yaw: 0, log },
  };
}

// Outpost walk is the traced graph. Fort, Yughott and Horlais stay on rectangles.
type RingEdge = { ax: number; az: number; bx: number; bz: number; area: number };
const RING_BUCKET = 24;
const ringEdges: RingEdge[] = [];
let ringZ0 = 0;
let ringBuckets: RingEdge[][] = [];
{
  let minZ = Infinity;
  let maxZ = -Infinity;
  GHELSBA_RINGS.forEach((area, areaId) => {
    for (const ring of area.rings) {
      for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
        const a = ring[j];
        const b = ring[i];
        ringEdges.push({ ax: a.x, az: a.z, bx: b.x, bz: b.z, area: areaId });
        minZ = Math.min(minZ, a.z, b.z);
        maxZ = Math.max(maxZ, a.z, b.z);
      }
    }
  });
  ringZ0 = Number.isFinite(minZ) ? minZ - 1 : 0;
  const count = Math.max(1, Math.ceil(((Number.isFinite(maxZ) ? maxZ : 0) - ringZ0 + 2) / RING_BUCKET));
  ringBuckets = Array.from({ length: count }, () => []);
  for (const edge of ringEdges) {
    const lo = Math.max(0, Math.floor((Math.min(edge.az, edge.bz) - ringZ0) / RING_BUCKET));
    const hi = Math.min(count - 1, Math.floor((Math.max(edge.az, edge.bz) - ringZ0) / RING_BUCKET));
    for (let i = lo; i <= hi; i++) ringBuckets[i].push(edge);
  }
}

const SEG_CELL = 32;
const segGrid = new Map<number, (typeof GHELSBA_SEGS)[number][]>();
const segKey = (ix: number, iz: number) => ix * 8192 + iz;
for (const seg of GHELSBA_SEGS) {
  const pad = seg.half + 0.05;
  const minX = Math.floor((Math.min(seg.ax, seg.bx) - pad) / SEG_CELL);
  const maxX = Math.floor((Math.max(seg.ax, seg.bx) + pad) / SEG_CELL);
  const minZ = Math.floor((Math.min(seg.az, seg.bz) - pad) / SEG_CELL);
  const maxZ = Math.floor((Math.max(seg.az, seg.bz) + pad) / SEG_CELL);
  for (let ix = minX; ix <= maxX; ix++) {
    for (let iz = minZ; iz <= maxZ; iz++) {
      const key = segKey(ix, iz);
      const list = segGrid.get(key);
      if (list) list.push(seg);
      else segGrid.set(key, [seg]);
    }
  }
}

function segsAt(x: number, z: number) {
  return segGrid.get(segKey(Math.floor(x / SEG_CELL), Math.floor(z / SEG_CELL))) ?? [];
}

function segsAround(x: number, z: number) {
  const ix = Math.floor(x / SEG_CELL);
  const iz = Math.floor(z / SEG_CELL);
  const out: (typeof GHELSBA_SEGS)[number][] = [];
  for (let dx = -1; dx <= 1; dx++) {
    for (let dz = -1; dz <= 1; dz++) {
      const list = segGrid.get(segKey(ix + dx, iz + dz));
      if (list) out.push(...list);
    }
  }
  return out;
}

function nearPoint(px: number, pz: number, ax: number, az: number, bx: number, bz: number) {
  const dx = bx - ax;
  const dz = bz - az;
  const len2 = dx * dx + dz * dz;
  const t = len2 ? Math.max(0, Math.min(1, ((px - ax) * dx + (pz - az) * dz) / len2)) : 0;
  return { x: ax + t * dx, z: az + t * dz };
}

function ringBucket(z: number) {
  return Math.floor((z - ringZ0) / RING_BUCKET);
}

function ringsContain(area: number, x: number, z: number) {
  const list = ringBuckets[ringBucket(z)];
  if (!list) return false;
  let inside = false;
  for (const edge of list) {
    if (edge.area !== area) continue;
    if (edge.az > z !== edge.bz > z && x < ((edge.bx - edge.ax) * (z - edge.az)) / (edge.bz - edge.az) + edge.ax) inside = !inside;
  }
  return inside;
}

function ringDistance(area: number, x: number, z: number) {
  const idx = ringBucket(z);
  let best = Infinity;
  for (let rad = 0; rad < ringBuckets.length; rad++) {
    if (rad > 0 && (rad - 1) * RING_BUCKET > best) break;
    const ids = rad === 0 ? [idx] : [idx - rad, idx + rad];
    for (const id of ids) {
      const list = ringBuckets[id];
      if (!list) continue;
      for (const edge of list) {
        if (edge.area !== area) continue;
        const q = nearPoint(x, z, edge.ax, edge.az, edge.bx, edge.bz);
        const dd = Math.hypot(x - q.x, z - q.z);
        if (dd < best) best = dd;
      }
    }
  }
  return best;
}

function fastOnFloor(x: number, z: number) {
  if (outsideGraph(x, z, 0)) return false;
  for (let area = 0; area < GHELSBA_RINGS.length; area++) if (ringsContain(area, x, z)) return true;
  const near = segsAt(x, z);
  for (const seg of near) {
    const q = nearPoint(x, z, seg.ax, seg.az, seg.bx, seg.bz);
    if (Math.hypot(x - q.x, z - q.z) <= seg.half) return true;
  }
  for (const disc of GHELSBA_DISCS) if (Math.hypot(x - disc.x, z - disc.z) <= disc.r) return true;
  return false;
}

function ghelsbaClearance(x: number, z: number) {
  if (outsideGraph(x, z, 0)) return -1000;
  let best = -Infinity;
  for (const seg of segsAround(x, z)) {
    const q = nearPoint(x, z, seg.ax, seg.az, seg.bx, seg.bz);
    best = Math.max(best, seg.half - Math.hypot(x - q.x, z - q.z));
  }
  for (const disc of GHELSBA_DISCS) best = Math.max(best, disc.r - Math.hypot(x - disc.x, z - disc.z));
  for (let area = 0; area < GHELSBA_RINGS.length; area++) {
    const dist = ringDistance(area, x, z);
    best = Math.max(best, ringsContain(area, x, z) ? dist : -dist);
  }
  return best;
}

function inGhelsbaGraph(x: number, z: number, radius = 0) {
  if (radius <= 0) return !outsideGraph(x, z, 0) && fastOnFloor(x, z);
  return ghelsbaClearance(x, z) >= radius;
}

function buildGhelsbaMask(res = 16) {
  const n = 12 * res;
  const data = new Uint8Array(n * n);
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < n; i++) {
      const at = gridToWorld((i + 0.5) / res, (j + 0.5) / res);
      if (fastOnFloor(at.x, at.z)) data[j * n + i] = 1;
    }
  }
  return { res, n, data };
}

function ghelsbaMaskRects(res = 16): Rect[] {
  const mask = buildGhelsbaMask(res);
  const cell = CELL / res;
  const out: Rect[] = [];
  for (let j = 0; j < mask.n; j++) {
    let i = 0;
    while (i < mask.n) {
      if (!mask.data[j * mask.n + i]) {
        i++;
        continue;
      }
      const start = i;
      while (i < mask.n && mask.data[j * mask.n + i]) i++;
      out.push({
        minX: OUT_X + start * cell,
        maxX: OUT_X + i * cell,
        minZ: OUT_Z + j * cell,
        maxZ: OUT_Z + (j + 1) * cell,
      });
    }
  }
  return out;
}

const OUT_FLOOR: Rect[] = ghelsbaMaskRects(16);

function graphNode(id: string) {
  const node = GHELSBA_GRAPH.nodes.find((row) => row.id === id);
  if (!node) throw new Error(id);
  return node;
}

function nodeAt(id: string) {
  const node = graphNode(id);
  return gridToWorld(node.gx, node.gy);
}

function poiAt(id: string) {
  const poi = GHELSBA_GRAPH.pois.find((row) => row.id === id);
  if (!poi) throw new Error(id);
  return gridToWorld(poi.gx, poi.gy);
}

function distSeg(px: number, pz: number, ax: number, az: number, bx: number, bz: number) {
  const dx = bx - ax;
  const dz = bz - az;
  const len2 = dx * dx + dz * dz;
  const t = len2 ? Math.max(0, Math.min(1, ((px - ax) * dx + (pz - az) * dz) / len2)) : 0;
  return Math.hypot(px - (ax + t * dx), pz - (az + t * dz));
}

/** Walk back along an edge from a node, in yalms. The stand stays on the traced path. */
function retreatAlong(edgeId: string, fromId: string, yards: number) {
  const edge = GHELSBA_GRAPH.edges.find((row) => row.id === edgeId);
  const from = graphNode(fromId);
  if (!edge) throw new Error(edgeId);
  let pts = edge.pts.map(([gx, gy]) => ({ gx, gy }));
  const start = pts[0];
  const end = pts[pts.length - 1];
  const atEnd = Math.hypot(end.gx - from.gx, end.gy - from.gy) <= Math.hypot(start.gx - from.gx, start.gy - from.gy);
  if (!atEnd) pts.reverse();
  let left = yards;
  for (let i = pts.length - 1; i > 0; i--) {
    const a = gridToWorld(pts[i].gx, pts[i].gy);
    const b = gridToWorld(pts[i - 1].gx, pts[i - 1].gy);
    const len = Math.hypot(b.x - a.x, b.z - a.z);
    if (len >= left) {
      const t = len ? left / len : 0;
      return { x: a.x + (b.x - a.x) * t, z: a.z + (b.z - a.z) * t };
    }
    left -= len;
  }
  return gridToWorld(pts[0].gx, pts[0].gy);
}

function onEdgeCenter(x: number, z: number, pad: number) {
  for (const edge of GHELSBA_GRAPH.edges) {
    for (let i = 0; i + 1 < edge.pts.length; i++) {
      const a = gridToWorld(edge.pts[i][0], edge.pts[i][1]);
      const b = gridToWorld(edge.pts[i + 1][0], edge.pts[i + 1][1]);
      if (distSeg(x, z, a.x, a.z, b.x, b.z) <= pad) return true;
    }
  }
  return false;
}

const POND_NODES = ["pond_nw", "pond_sw", "pool_j10"] as const;

function inOutpostWater(x: number, z: number) {
  for (const id of POND_NODES) {
    const node = graphNode(id);
    const at = gridToWorld(node.gx, node.gy);
    if (Math.hypot(x - at.x, z - at.z) < (node.r ?? 0.1) * CELL * 0.82) return true;
  }
  for (const stream of GHELSBA_GRAPH.streams) {
    for (let i = 0; i + 1 < stream.length; i++) {
      const a = gridToWorld(stream[i][0], stream[i][1]);
      const b = gridToWorld(stream[i + 1][0], stream[i + 1][1]);
      if (distSeg(x, z, a.x, a.z, b.x, b.z) < 1.7) return true;
    }
  }
  return false;
}

function outpostWaterRects(): Rect[] {
  const water: Rect[] = [];
  for (const id of ["pond_nw", "pond_sw"] as const) {
    const node = graphNode(id);
    const at = gridToWorld(node.gx, node.gy);
    const r = (node.r ?? 0.1) * CELL * 0.7;
    water.push({ minX: at.x - r, maxX: at.x + r, minZ: at.z - r, maxZ: at.z + r });
  }
  for (const stream of GHELSBA_GRAPH.streams) {
    for (let i = 0; i + 1 < stream.length; i++) {
      const a = gridToWorld(stream[i][0], stream[i][1]);
      const b = gridToWorld(stream[i + 1][0], stream[i + 1][1]);
      const len = Math.hypot(b.x - a.x, b.z - a.z);
      const steps = Math.max(1, Math.ceil(len / 8));
      for (let s = 0; s <= steps; s++) {
        const t = s / steps;
        const x = a.x + (b.x - a.x) * t;
        const z = a.z + (b.z - a.z) * t;
        if (!inGhelsbaGraph(x, z, 0)) continue;
        water.push({ minX: x - 1.6, maxX: x + 1.6, minZ: z - 1.6, maxZ: z + 1.6 });
      }
    }
  }
  return water;
}

const OUT_WATER_MARKS = outpostWaterRects();

const fE8 = room(FORT_X, FORT_Z, 4, 7, 26, 26);
const fF8 = room(FORT_X, FORT_Z, 5, 7, 16, 16);
const fG8 = room(FORT_X, FORT_Z, 6, 7, 20, 20);
const fH8 = room(FORT_X, FORT_Z, 7, 7, 20, 20);
const fI8 = room(FORT_X, FORT_Z, 8, 7, 18, 18);
const fG6 = room(FORT_X, FORT_Z, 6, 5, 16, 16);
const fG7 = room(FORT_X, FORT_Z, 6, 6, 16, 16);
const fH7 = room(FORT_X, FORT_Z, 7, 6, 18, 18);
const fG9 = room(FORT_X, FORT_Z, 6, 8, 20, 26);
const fH9 = room(FORT_X, FORT_Z, 7, 8, 16, 16);
const fH10 = room(FORT_X, FORT_Z, 7, 9, 16, 16);
const fI10 = room(FORT_X, FORT_Z, 8, 9, 18, 18);
const fJ7 = room(FORT_X, FORT_Z, 9, 6, 26, 22);
const fJ8 = room(FORT_X, FORT_Z, 9, 7, 26, 22);
const fJ6 = room(FORT_X, FORT_Z, 9, 5, 16, 16);
const fJ9 = room(FORT_X, FORT_Z, 9, 8, 16, 16);

const FORT_ROOMS: Rect[] = weld(
  [fE8, fF8, fG8, fH8, fI8, fG6, fG7, fH7, fG9, fH9, fH10, fI10, fJ7, fJ8, fJ6, fJ9],
  [
    [fE8, fF8, 11],
    [fF8, fG8, 12],
    [fG8, fH8, 12],
    [fH8, fI8, 12],
    [fG8, fG7, 11],
    [fG7, fG6, 10],
    [fG8, fG9, 11],
    [fH8, fH7, 11],
    [fH8, fH9, 11],
    [fH9, fH10, 11],
    [fH10, fI10, 11],
    [fH7, fJ7, 11],
    [fI8, fJ8, 11],
    [fJ7, fJ8, 11],
    [fJ7, fJ6, 10],
    [fJ8, fJ9, 10],
  ],
);

const yE9 = room(YUG_X, YUG_Z, 4, 8, 26, 26);
const yF9 = room(YUG_X, YUG_Z, 5, 8, 14, 14);
const yG8 = room(YUG_X, YUG_Z, 6, 7, 22, 20);
const yF7 = room(YUG_X, YUG_Z, 5, 6, 18, 26);
const yH7 = room(YUG_X, YUG_Z, 7, 6, 26, 22);
const yH8 = room(YUG_X, YUG_Z, 7, 7, 16, 16);
const yI9 = room(YUG_X, YUG_Z, 8, 9, 28, 22);
const yI6 = room(YUG_X, YUG_Z, 8, 6, 28, 28, 6, 0);
// Map 2 has its own retail origin. The short hall south of I-9 is the stair; there is no elevation.
const Y2_X = -1040 - 32 * 2.05;
const Y2_Z = 217.25 + 4 * 32 * 2.05;
const y2J6 = room(Y2_X, Y2_Z, 9, 5, 30, 28);
const y2K5 = room(Y2_X, Y2_Z, 10, 4, 22, 22);
const y2K6 = room(Y2_X, Y2_Z, 10, 5, 24, 20);
const y2J9 = room(Y2_X, Y2_Z, 9, 8, 18, 22);
const y2Neck: Rect = { minX: mid(yI9).x - u(5), maxX: mid(yI9).x + u(5), minZ: yI9.maxZ - u(4), maxZ: y2J6.minZ + u(6) };

const YUG_ROOMS: Rect[] = weld(
  [yE9, yF9, yG8, yF7, yH7, yH8, yI9, yI6, y2Neck, y2J6, y2K5, y2K6, y2J9],
  [
    [yE9, yF9, 10],
    [yF9, yG8, 10],
    [yF9, yF7, 9],
    [yG8, yH7, 10],
    [yG8, yH8, 8],
    [yG8, yI9, 10],
    [yH7, yH8, 8],
    [yH7, yI6, 9],
    [y2J6, y2K5, 10],
    [y2J6, y2K6, 10],
    [y2J6, y2J9, 10],
  ],
);

const peak: Rect = { minX: PEAK_X - 30, maxX: PEAK_X + 30, minZ: PEAK_Z - 22, maxZ: PEAK_Z + 18 };
const peakPath: Rect = { minX: PEAK_X - 8, maxX: PEAK_X + 8, minZ: PEAK_Z + 12, maxZ: PEAK_Z + 36 };
const mouthL: Rect = { minX: PEAK_X - 24, maxX: PEAK_X - 6, minZ: PEAK_Z + 30, maxZ: PEAK_Z + 60 };
const mouthR: Rect = { minX: PEAK_X + 6, maxX: PEAK_X + 26, minZ: PEAK_Z + 30, maxZ: PEAK_Z + 60 };
const PEAK_ROOMS: Rect[] = weld([peak, peakPath, mouthL, mouthR], [
  [peakPath, mouthL, 10],
  [peakPath, mouthR, 10],
]);

function eastPool(rect: Rect): Rect {
  return { minX: rect.maxX - u(7.2), maxX: rect.maxX - u(1.5), minZ: rect.minZ + u(3.5), maxZ: rect.minZ + u(11.5) };
}

const pool = eastPool(yI9);
const spring: Rect = { minX: PEAK_X + 14, maxX: PEAK_X + 26, minZ: PEAK_Z - 14, maxZ: PEAK_Z - 2 };

function standIn(rect: Rect, gateSide: OrcGate["side"]) {
  const c = mid(rect);
  if (gateSide === "s") return { x: c.x, z: rect.maxZ - 14 };
  if (gateSide === "n") return { x: c.x, z: rect.minZ + 14 };
  if (gateSide === "w") return { x: rect.minX + 14, z: c.z };
  return { x: rect.maxX - 14, z: c.z };
}

function gateAt(id: string, name: string, gateId: string, to: string, log: string, stand: { x: number; z: number }, side: OrcGate["side"]): OrcGate {
  const at = nodeAt(id);
  const across = side === "n" || side === "s";
  return {
    id: gateId,
    name,
    x: at.x,
    z: at.z,
    hx: across ? 5.2 : 2.4,
    hz: across ? 2.4 : 5.2,
    to,
    side,
    arrive: { x: stand.x, z: stand.z, yaw: 0, log },
  };
}

const fortFromOut = standIn(fE8, "w");
const outFromFort = nodeAt("fort_arrival_i8");
const yugFromOut = standIn(yE9, "w");
const outFromYug = retreatAlong("e_yug_hook", "exit_yughott", 10);
const hutStand = retreatAlong("e_hut_door", "door_hut", 9);
const yugFromFortG9 = standIn(yH8, "s");
const yugFromFortJ7 = standIn(y2K5, "n");
const yugFromFortJ8 = standIn(yF7, "n");
const fortFromYugH8 = standIn(fG9, "s");
const fortFromYugK5 = standIn(fJ7, "e");
const fortFromYugF7 = standIn(fJ8, "e");
const peakFromJ9 = standIn(mouthL, "s");
const peakFromK6 = standIn(mouthR, "s");
const yugFromPeakL = standIn(y2J9, "s");
const yugFromPeakR = standIn(y2K6, "e");

const ronIn = poiAt("zone_in_default");
export const RON_TO_GHELSBA = { x: ronIn.x, z: ronIn.z, yaw: 0, log: "Ghelsba Outpost." };
// West Ronfaure E-4. cellX(4.37), cellZ(3.285), then 14 yalms south so the stand is off the mouth.
const RON_FROM_GHELSBA = { x: -78.24, z: 391.68, yaw: 0, log: "West Ronfaure." };
const ronMouth = nodeAt("exit_west_ronfaure");

export const ORC_GATES: readonly OrcGate[] = [
  {
    id: "ghelsba-ron",
    name: "West Ronfaure",
    x: ronMouth.x,
    z: ronMouth.z,
    hx: 5.2,
    hz: 2.4,
    to: "ronfaure-south",
    side: "s",
    arrive: { x: RON_FROM_GHELSBA.x, z: RON_FROM_GHELSBA.z, yaw: 0, log: RON_FROM_GHELSBA.log },
  },
  gateAt("exit_fort_ghelsba", "Fort Ghelsba", "ghelsba-fort", "fort-ghelsba", "Fort Ghelsba.", fortFromOut, "e"),
  gateAt("exit_yughott", "Yughott Grotto", "ghelsba-yughott", "yughott", "Yughott Grotto.", yugFromOut, "s"),
  gateAt("door_hut", "Hut Door", "ghelsba-hut", "closed", "The hut door is sealed.", hutStand, "w"),
  mouth(fE8, "w", "Ghelsba Outpost", "fort-out", "ghelsba", "Ghelsba Outpost.", outFromFort),
  mouth(fG9, "s", "Yughott Grotto", "fort-yug-g9", "yughott", "Yughott Grotto.", yugFromFortG9),
  mouth(fJ7, "e", "Yughott Grotto", "fort-yug-j7", "yughott", "Yughott Grotto.", yugFromFortJ7),
  mouth(fJ8, "e", "Yughott Grotto", "fort-yug-j8", "yughott", "Yughott Grotto.", yugFromFortJ8),
  mouth(yE9, "w", "Ghelsba Outpost", "yug-out", "ghelsba", "Ghelsba Outpost.", outFromYug),
  mouth(yH8, "s", "Fort Ghelsba", "yug-fort-h8", "fort-ghelsba", "Fort Ghelsba.", fortFromYugH8),
  mouth(yF7, "n", "Fort Ghelsba", "yug-fort-f7", "fort-ghelsba", "Fort Ghelsba.", fortFromYugF7),
  mouth(y2K5, "n", "Fort Ghelsba", "yug-fort-k5", "fort-ghelsba", "Fort Ghelsba.", fortFromYugK5),
  mouth(y2J9, "s", "Horlais Peak", "yug-horlais-j9", "horlais", "Horlais Peak.", peakFromJ9),
  mouth(y2K6, "e", "Horlais Peak", "yug-horlais-k6", "horlais", "Horlais Peak.", peakFromK6),
  mouth(mouthL, "s", "Yughott Grotto", "horlais-j9", "yughott", "Yughott Grotto.", yugFromPeakL),
  mouth(mouthR, "s", "Yughott Grotto", "horlais-k6", "yughott", "Yughott Grotto.", yugFromPeakR),
];

const GHELSBA_RETURN = ORC_GATES[0];

export const ORC_WATER: { rect: Rect; kind: "stream" | "pool" | "spring" }[] = [
  { rect: pool, kind: "pool" },
  { rect: spring, kind: "spring" },
];

export function ghelsbaReturnStand(): { x: number; z: number } {
  return { x: GHELSBA_RETURN.x, z: GHELSBA_RETURN.z };
}

export function seatGhelsbaSave(x: number, z: number): { x: number; z: number } | null {
  const col = Math.floor((x - OUT_X) / CELL);
  const row = Math.floor((z - OUT_Z) / CELL);
  if (col < 0 || col >= 12 || row < 0 || row >= 12) return null;
  if (inFort(x, z, 0) || inYughott(x, z, 0)) return null;
  if (inGhelsbaGraph(x, z, 0.2)) return { x, z };
  const snapped = clampGhelsbaGraph(x, z, 0.36);
  if (inGhelsbaGraph(snapped.x, snapped.z, 0)) return snapped;
  return null;
}

export const ORC_ZONES: { id: string; name: string; rects: Rect[]; fog: "canyon" | "cave" | "peak" }[] = [
  { id: "ghelsba", name: "Ghelsba Outpost", rects: OUT_FLOOR, fog: "canyon" },
  { id: "fort-ghelsba", name: "Fort Ghelsba", rects: FORT_ROOMS, fog: "canyon" },
  { id: "yughott", name: "Yughott Grotto", rects: YUG_ROOMS, fog: "cave" },
  { id: "horlais", name: "Horlais Peak", rects: PEAK_ROOMS, fog: "peak" },
];

function hit(rects: readonly Rect[], x: number, z: number, r: number) {
  return rects.some((rect) => x >= rect.minX + r && x <= rect.maxX - r && z >= rect.minZ + r && z <= rect.maxZ - r);
}

export function orcZoneAt(x: number, z: number, radius = 0): (typeof ORC_ZONES)[number] | null {
  const r = Math.max(0, radius);
  for (const zone of ORC_ZONES) {
    if (zone.id === "ghelsba") continue;
    if (hit(zone.rects, x, z, r)) return zone;
  }
  if (outsideGraph(x, z, r) || !inGhelsbaGraph(x, z, r)) return null;
  return ORC_ZONES[0];
}

export function inOrc(x: number, z: number, radius = 0): boolean {
  return orcZoneAt(x, z, radius) != null;
}

export function orcRegion(x: number, z: number): string | null {
  return orcZoneAt(x, z, 0)?.name ?? null;
}

export function orcFog(x: number, z: number): "canyon" | "cave" | "peak" | null {
  return orcZoneAt(x, z, 0)?.fog ?? null;
}

export function ghelsbaCell(col: number, row: number): { x: number; z: number } {
  return cell(OUT_X, OUT_Z, col, row);
}

export function fortCell(col: number, row: number): { x: number; z: number } {
  return cell(FORT_X, FORT_Z, col, row);
}

export function grottoCell(col: number, row: number): { x: number; z: number } {
  return cell(YUG_X, YUG_Z, col, row);
}

function zoneGrid(zone: string) {
  const grid = ZONE_GRIDS.find((g) => g.zone === zone);
  if (!grid) throw new Error(`${zone} grid`);
  return grid;
}

export function ghelsbaSquare(x: number, z: number): string {
  return squareOf(zoneGrid("ghelsba"), x, z);
}

export function fortSquare(x: number, z: number): string {
  return squareOf(zoneGrid("fort-ghelsba"), x, z);
}

export function yughottSquare(x: number, z: number): string {
  const grid = gridAt("yughott", x, z);
  return grid ? squareOf(grid, x, z) : "?";
}

/** Map 1 is the retail upper grotto. Map 2 is the lower grid; the neck is the stair. */
export function grottoMap(x: number, z: number): 1 | 2 | null {
  const map1Rooms = [yE9, yF9, yG8, yF7, yH7, yH8, yI9, yI6];
  const map2Rooms = [y2J6, y2K5, y2K6, y2J9];
  const map1 = hit(map1Rooms, x, z, 0);
  const map2 = hit(map2Rooms, x, z, 0) || (hit([y2Neck], x, z, 0) && !map1);
  if (map2 && !map1) return 2;
  if (map1) return 1;
  if (!hit(YUG_ROOMS, x, z, 0)) return null;
  const nearest = (rooms: Rect[]) => {
    let best = Infinity;
    for (const rect of rooms) {
      const cx = Math.max(rect.minX, Math.min(rect.maxX, x));
      const cz = Math.max(rect.minZ, Math.min(rect.maxZ, z));
      const dist = Math.hypot(x - cx, z - cz);
      if (dist < best) best = dist;
    }
    return best;
  };
  return nearest([...map2Rooms, y2Neck]) < nearest(map1Rooms) ? 2 : 1;
}

registerZoneMap((zone, x, z) => (zone === "yughott" ? grottoMap(x, z) : null));

/** J-6, the map 2 hall just south of I-9. */
export function grottoHall(): { x: number; z: number } {
  return mid(y2J6);
}

export function grottoMouth(which: "k5" | "k6" | "j9"): { x: number; z: number } {
  if (which === "k5") return mid(y2K5);
  if (which === "k6") return mid(y2K6);
  return mid(y2J9);
}

export function inGhelsba(x: number, z: number, radius = 0): boolean {
  return orcZoneAt(x, z, radius)?.id === "ghelsba";
}

export function inFort(x: number, z: number, radius = 0): boolean {
  return orcZoneAt(x, z, radius)?.id === "fort-ghelsba";
}

export function inYughott(x: number, z: number, radius = 0): boolean {
  return orcZoneAt(x, z, radius)?.id === "yughott";
}

function inOrcWater(x: number, z: number): boolean {
  if (inOutpostWater(x, z)) return true;
  return ORC_WATER.some((row) => x > row.rect.minX + 0.4 && x < row.rect.maxX - 0.4 && z > row.rect.minZ + 0.4 && z < row.rect.maxZ - 0.4);
}

export function ghelsbaDry(x: number, z: number): boolean {
  if (outsideGraph(x, z, 0.35) || !inGhelsbaGraph(x, z, 0.35)) return false;
  return !inOutpostWater(x, z);
}

/** Any orc zone, off the water. The grotto pool and the outpost streams stay empty. */
export function orcDry(x: number, z: number, radius = 0): boolean {
  if (!inOrc(x, z, radius)) return false;
  return !inOrcWater(x, z);
}

function rectDist(x: number, z: number, rect: Rect) {
  const cx = Math.max(rect.minX, Math.min(rect.maxX, x));
  const cz = Math.max(rect.minZ, Math.min(rect.maxZ, z));
  return Math.hypot(x - cx, z - cz);
}

export function clampOrc(x: number, z: number, radius = 0): { x: number; z: number } | null {
  const r = Math.max(0, radius);
  let best: Rect | null = null;
  let bestD = Infinity;
  for (const zone of ORC_ZONES) {
    if (zone.id === "ghelsba") continue;
    for (const rect of zone.rects) {
      const dist = rectDist(x, z, rect);
      if (dist < bestD) {
        bestD = dist;
        best = rect;
      }
    }
  }
  const graph = clampGhelsbaGraph(x, z, r);
  const graphD = inGhelsbaGraph(x, z, r) ? 0 : Math.hypot(graph.x - x, graph.z - z);
  const graphOk = graphD <= 70 && inGhelsbaGraph(graph.x, graph.z, 0);
  if (best && bestD <= 70 && (!graphOk || bestD <= graphD)) {
    const spanX = best.maxX - best.minX;
    const spanZ = best.maxZ - best.minZ;
    const insetX = Math.min(r, Math.max(0, spanX / 2 - 0.05));
    const insetZ = Math.min(r, Math.max(0, spanZ / 2 - 0.05));
    return {
      x: Math.max(best.minX + insetX, Math.min(best.maxX - insetX, x)),
      z: Math.max(best.minZ + insetZ, Math.min(best.maxZ - insetZ, z)),
    };
  }
  if (graphOk) return graph;
  return null;
}

export function orcArrival(to: string): { x: number; z: number; yaw: number; log: string } | null {
  if (to === "ghelsba") return RON_TO_GHELSBA;
  if (to === "fort-ghelsba") return { x: fortFromOut.x, z: fortFromOut.z, yaw: 0, log: "Fort Ghelsba." };
  if (to === "yughott") return { x: yugFromOut.x, z: yugFromOut.z, yaw: 0, log: "Yughott Grotto." };
  if (to === "horlais") return { x: peakFromJ9.x, z: peakFromJ9.z, yaw: 0, log: "Horlais Peak." };
  return null;
}

export type OrcChart = {
  rects: Rect[];
  water: Rect[];
  bounds: Rect;
  marks: { x: number; z: number; name: string }[];
  grid: { x0: number; z0: number; cell: number } | null;
  /** Traced tunnel centerlines, in yalms. The map strokes these instead of filling rects. */
  paths?: { pts: { x: number; z: number }[]; width: number }[];
  discs?: { x: number; z: number; r: number }[];
};

export function orcLayout(region: string): OrcChart | null {
  const zone = ORC_ZONES.find((row) => row.name === region);
  if (!zone) return null;
  let minX = Infinity;
  let maxX = -Infinity;
  let minZ = Infinity;
  let maxZ = -Infinity;
  for (const rect of zone.rects) {
    minX = Math.min(minX, rect.minX);
    maxX = Math.max(maxX, rect.maxX);
    minZ = Math.min(minZ, rect.minZ);
    maxZ = Math.max(maxZ, rect.maxZ);
  }
  const pad = 18;
  const marks = ORC_GATES.filter((gate) => (zone.id === "ghelsba" ? inGhelsbaGraph(gate.x, gate.z, 0) : hit(zone.rects, gate.x, gate.z, 0))).map((gate) => ({
    x: gate.x,
    z: gate.z,
    name: gate.name,
  }));
  if (region === "Ghelsba Outpost") {
    for (const poi of GHELSBA_GRAPH.pois) {
      const at = gridToWorld(poi.gx, poi.gy);
      const name = poi.label.split(" (")[0];
      if (marks.some((mark) => Math.hypot(mark.x - at.x, mark.z - at.z) < 6 && mark.name === name)) continue;
      marks.push({ x: at.x, z: at.z, name });
    }
  }
  if (region === "Horlais Peak") marks.push({ x: PEAK_X, z: PEAK_Z, name: "Burning Circle" });
  const outGrid = ZONE_GRIDS.find((g) => g.zone === "ghelsba");
  const fortGrid = ZONE_GRIDS.find((g) => g.zone === "fort-ghelsba");
  const grid =
    region === "Ghelsba Outpost" && outGrid
      ? { x0: outGrid.x0, z0: outGrid.z0, cell: outGrid.cell }
      : region === "Fort Ghelsba" && fortGrid
        ? { x0: fortGrid.x0, z0: fortGrid.z0, cell: fortGrid.cell }
        : null;
  return {
    rects: zone.rects,
    water: region === "Ghelsba Outpost"
      ? OUT_WATER_MARKS
      : ORC_WATER.filter((row) => hit(zone.rects, (row.rect.minX + row.rect.maxX) / 2, (row.rect.minZ + row.rect.maxZ) / 2, 0)).map((row) => row.rect),
    bounds: { minX: minX - pad, maxX: maxX + pad, minZ: minZ - pad, maxZ: maxZ + pad },
    marks,
    grid,
  };
}

type Add = (color: number, w: number, h: number, d: number, x: number, y: number, z: number, yaw?: number, pitch?: number) => void;
type Solid = { minX: number; maxX: number; minZ: number; maxZ: number };

function box(add: Add, colliders: Solid[] | null, color: number, w: number, h: number, d: number, x: number, y: number, z: number) {
  add(color, w, h, d, x, y, z);
  if (colliders) {
    colliders.push({ minX: x - w / 2, maxX: x + w / 2, minZ: z - d / 2, maxZ: z + d / 2 });
  }
}

function floor(add: Add, rect: Rect, color: number, y = -0.06) {
  add(color, rect.maxX - rect.minX, 0.18, rect.maxZ - rect.minZ, (rect.minX + rect.maxX) / 2, y, (rect.minZ + rect.maxZ) / 2);
}

function mergeSpans(spans: [number, number][]): [number, number][] {
  if (!spans.length) return [];
  const sorted = spans.slice().sort((a, b) => a[0] - b[0]);
  const out: [number, number][] = [[sorted[0][0], sorted[0][1]]];
  for (let i = 1; i < sorted.length; i++) {
    const last = out[out.length - 1];
    if (sorted[i][0] <= last[1] + 0.45) last[1] = Math.max(last[1], sorted[i][1]);
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

// One solid face along every exposed edge. Posts with gaps read as sky, not a wall.
// The outpost canyon is the tall style. South faces stay a low lip so the camera can see in.
function cliffWall(add: Add, colliders: Solid[], rects: Rect[], gates: readonly OrcGate[], style: "rock" | "timber" | "cave" | "canyon", fade?: Add) {
  const rock = 6050130;
  const rockLight = 10126180;
  const rockDark = 3948594;
  const caveFace = 2893862;
  const caveCap = 1442577;
  const timber = 6964012;
  const canyon = style === "canyon";
  const face = style === "timber" ? timber : style === "cave" ? caveFace : canyon ? rockLight : rock;
  const cap = style === "cave" ? caveCap : rockDark;
  const tall = style === "timber" ? 7.8 : style === "cave" ? 7.6 : canyon ? 12.4 : 8.4;
  const thick = 2.6;
  const sides: Array<"n" | "s" | "e" | "w"> = canyon ? ["n", "e", "w", "s"] : ["n", "e", "w"];
  for (const rect of rects) {
    for (const side of sides) {
      const horizontal = side === "n" || side === "s";
      const edge = side === "n" ? rect.minZ : side === "s" ? rect.maxZ : side === "w" ? rect.minX : rect.maxX;
      const full: [number, number] = horizontal ? [rect.minX, rect.maxX] : [rect.minZ, rect.maxZ];
      const covered: [number, number][] = [];
      for (const other of rects) {
        if (other === rect) continue;
        let near = false;
        // A door is a neighbor whose floor continues past this edge. Two rects that only
        // end on the same line are a corner, and each one used to delete the other's wall.
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
        if (across > 4.4 || along < full[0] - 3 || along > full[1] + 3) continue;
        cuts.push([along - 6.6, along + 6.6]);
      }
      const outward = side === "n" || side === "w" ? -1 : 1;
      for (const span of cutSpans(full, cuts)) {
        let a = span[0];
        let b = span[1];
        if (b - a < 1) continue;
        if (Math.abs(a - full[0]) < 0.35) a -= thick * 0.9;
        if (Math.abs(b - full[1]) < 0.35) b += thick * 0.9;
        const len = b - a;
        const midA = (a + b) / 2;
        const acrossC = edge + outward * (thick / 2);
        const cx = horizontal ? midA : acrossC;
        const cz = horizontal ? acrossC : midA;
        const w = horizontal ? len : thick;
        const d = horizontal ? thick : len;
        if (side === "s" && canyon) {
          if (!fade) continue;
          const lipH = 0.72;
          fade(cap, w, lipH, d, cx, lipH / 2, cz);
          continue;
        }
        if (style === "timber") {
          box(add, colliders, rockDark, w, 2.4, d, cx, 1.1, cz);
          add(timber, w, 5.6, d, cx, 5.15, cz);
          for (let t = a + 0.7; t < b - 0.35; t += 1.35) {
            const n = Math.abs(Math.sin(t * 0.37));
            const h = 6.6 + n * 1.5;
            const ox = horizontal ? t : edge + outward * (thick / 2 + 0.38);
            const oz = horizontal ? edge + outward * (thick / 2 + 0.38) : t;
            add(timber, horizontal ? 0.46 : 0.62, h, horizontal ? 0.62 : 0.46, ox, h / 2, oz);
          }
          for (let t = a + 0.45; t < b - 0.3; t += 1.7) {
            if (Math.floor(t * 0.37) % 2 === 0) continue;
            const ox = horizontal ? t : edge + outward * (thick / 2);
            const oz = horizontal ? edge + outward * (thick / 2) : t;
            add(timber, horizontal ? 0.74 : 0.9, 0.82, horizontal ? 0.9 : 0.74, ox, 8.2, oz);
          }
        } else {
          const body = style === "rock" ? tall : tall * (canyon ? 0.68 : 0.78);
          const capH = tall - body;
          box(add, colliders, face, w, body, d, cx, body / 2 - 0.12, cz);
          if (capH > 0.35) add(cap, w, capH, d, cx, body + capH / 2 - 0.1, cz);
          const baseT = thick + 0.7;
          const baseC = edge + outward * (baseT / 2);
          add(cap, horizontal ? len : baseT, 1.8, horizontal ? baseT : len, horizontal ? cx : baseC, 0.8, horizontal ? baseC : cz);
          for (let t = a + 1.4; t < b - 0.6; t += 4.6) {
            const n = Math.abs(Math.sin(t * 0.21 + edge * 0.05));
            const h = tall * (0.78 + n * 0.32);
            const ox = horizontal ? t : edge + outward * (thick / 2 + 0.2);
            const oz = horizontal ? edge + outward * (thick / 2 + 0.2) : t;
            add(cap, 1.45, h, 1.45, ox, h / 2 - 0.1, oz);
          }
        }
      }
    }
  }
  for (const gate of gates) {
    if (gate.side === "s") continue;
    const across = gate.side === "n";
    const lift = tall * 0.7;
    for (const sign of [-1, 1]) {
      const x = gate.x + (across ? sign * 5.6 : 0);
      const z = gate.z + (across ? 0 : sign * 5.6);
      box(add, colliders, face, across ? 1.5 : 2.2, lift, across ? 2.2 : 1.5, x, lift / 2, z);
    }
    add(face, across ? 10.8 : 1.25, 1.2, across ? 1.25 : 10.8, gate.x, lift * 0.94, gate.z);
  }
}

function sheet(add: Add, rect: Rect, color: number, y = 0.05) {
  const w = rect.maxX - rect.minX;
  const d = rect.maxZ - rect.minZ;
  if (w < 0.4 || d < 0.4) return;
  add(color, w, 0.05, d, (rect.minX + rect.maxX) / 2, y, (rect.minZ + rect.maxZ) / 2);
}

function cutsCenter(x: number, z: number, w: number, d: number): boolean {
  const rect = { minX: x - w / 2, maxX: x + w / 2, minZ: z - d / 2, maxZ: z + d / 2 };
  for (const edge of GHELSBA_GRAPH.edges) {
    for (let i = 0; i + 1 < edge.pts.length; i++) {
      const a = gridToWorld(edge.pts[i][0], edge.pts[i][1]);
      const b = gridToWorld(edge.pts[i + 1][0], edge.pts[i + 1][1]);
      const len = Math.hypot(b.x - a.x, b.z - a.z);
      const steps = Math.max(1, Math.ceil(len / 1.5));
      for (let s = 0; s <= steps; s++) {
        const t = s / steps;
        const px = a.x + (b.x - a.x) * t;
        const pz = a.z + (b.z - a.z) * t;
        const cx = Math.max(rect.minX, Math.min(rect.maxX, px));
        const cz = Math.max(rect.minZ, Math.min(rect.maxZ, pz));
        if (Math.hypot(px - cx, pz - cz) < 2.7 && inGhelsbaGraph(px, pz, 0)) return true;
      }
    }
  }
  return false;
}

function safeBox(add: Add, colliders: Solid[] | null, color: number, w: number, h: number, d: number, x: number, y: number, z: number) {
  add(color, w, h, d, x, y, z);
  if (colliders && !cutsCenter(x, z, w, d)) colliders.push({ minX: x - w / 2, maxX: x + w / 2, minZ: z - d / 2, maxZ: z + d / 2 });
}

function hut(add: Add, colliders: Solid[], x: number, z: number) {
  const wood = 6964012;
  safeBox(add, colliders, wood, 9.2, 2.3, 0.45, x, 1.15, z - 4.2);
  safeBox(add, colliders, wood, 9.2, 2.3, 0.45, x, 1.15, z + 4.2);
  safeBox(add, colliders, wood, 0.45, 2.3, 8.4, x - 4.4, 1.15, z);
  add(9127187, 1.4, 0.7, 1.4, x + 1.4, 0.15, z);
  add(14927226, 0.7, 0.35, 0.7, x + 1.4, 0.55, z);
}

function besideFloor(id: string, yards: number) {
  const at = nodeAt(id);
  let best = at;
  let score = -Infinity;
  for (let k = 0; k < 24; k++) {
    const ang = (k / 24) * Math.PI * 2;
    const x = at.x + Math.cos(ang) * yards;
    const z = at.z + Math.sin(ang) * yards;
    if (!inGhelsbaGraph(x, z, 0.5) || onEdgeCenter(x, z, 3.4)) continue;
    const room = ghelsbaClearance(x, z);
    if (room > score) {
      score = room;
      best = { x, z };
    }
  }
  return best;
}

const hutSpot = besideFloor("door_hut", 5.2);
const HUT_HOME = { x: hutSpot.x, z: hutSpot.z };
export const HUT_ROOF = { x: hutSpot.x, z: hutSpot.z, w: 10, d: 9.2, y: 2.45, h: 0.35, color: 0x393028 };

export function underHutRoof(x: number, z: number): boolean {
  return Math.abs(x - HUT_ROOF.x) <= HUT_ROOF.w / 2 && Math.abs(z - HUT_ROOF.z) <= HUT_ROOF.d / 2;
}

function tent(add: Add, colliders: Solid[], x: number, z: number) {
  safeBox(add, colliders, 9072712, 3.6, 1.45, 2.8, x, 0.72, z);
  add(9251362, 0.16, 1.9, 0.16, x, 0.95, z);
}

function catapult(add: Add, colliders: Solid[], x: number, z: number) {
  const wood = 6964012;
  box(add, colliders, wood, 4.2, 0.5, 2.4, x, 0.4, z);
  box(add, colliders, wood, 0.4, 1.6, 0.4, x - 1.5, 1.1, z - 0.7);
  box(add, colliders, wood, 0.4, 1.6, 0.4, x + 1.5, 1.1, z - 0.7);
  add(wood, 3.6, 0.35, 0.45, x, 1.7, z + 0.4);
  add(6050130, 1.1, 1.1, 1.1, x, 1.15, z + 1.3);
}

function ram(add: Add, colliders: Solid[], x: number, z: number) {
  const wood = 6964012;
  box(add, colliders, wood, 7.2, 0.7, 0.7, x, 0.7, z);
  box(add, colliders, 3948594, 1.1, 1.1, 1.1, x + 3.4, 0.7, z);
}

function banner(add: Add, x: number, z: number) {
  add(6964012, 0.18, 2.4, 0.18, x, 1.2, z);
  add(9251362, 0.15, 0.9, 1.3, x, 1.9, z + 0.5);
}

function torch(add: Add, x: number, z: number, side?: "n" | "e" | "w") {
  const wood = 6964012;
  const iron = 3948594;
  const flame = 16739994;
  const pegW = side === "n" ? 0.1 : 0.46;
  const pegD = side === "n" ? 0.46 : 0.1;
  add(wood, pegW, 0.08, pegD, x, 1.42, z);
  const tipX = side === "w" ? x + 0.2 : side === "e" ? x - 0.2 : x;
  const tipZ = side === "n" ? z + 0.2 : z;
  add(iron, 0.14, 0.08, 0.14, tipX, 1.48, tipZ);
  add(flame, 0.1, 0.16, 0.1, tipX, 1.6, tipZ);
}

function pine(add: Add, colliders: Solid[], x: number, z: number) {
  box(add, colliders, 5913124, 0.42, 1.35, 0.42, x, 0.67, z);
  add(2058808, 2.05, 1.35, 2.05, x, 1.7, z);
  add(3111488, 1.25, 1.05, 1.25, x, 2.55, z);
}

const ROPE = 12891508;
const ORC_RED = 9056304;

function watchstand(add: Add, colliders: Solid[], x: number, z: number) {
  const wood = 6964012;
  const deck = 8020548;
  for (const [dx, dz] of [[-2.1, -1.5], [2.1, -1.5], [-2.1, 1.5], [2.1, 1.5]] as const) {
    box(add, colliders, wood, 0.32, 2.35, 0.32, x + dx, 1.15, z + dz);
    add(ORC_RED, 0.4, 0.28, 0.4, x + dx, 2.05, z + dz);
  }
  add(deck, 5.0, 0.16, 3.8, x, 2.4, z);
  add(wood, 0.1, 2.15, 0.1, x - 0.32, 1.05, z + 2.05);
  add(wood, 0.1, 2.15, 0.1, x + 0.32, 1.05, z + 2.05);
  for (let i = 0; i < 5; i++) add(wood, 0.62, 0.07, 0.1, x, 0.35 + i * 0.38, z + 2.05);
  banner(add, x + 1.4, z - 0.4);
}

function shrub(add: Add, x: number, z: number) {
  if (!inGhelsbaGraph(x, z, 1.2)) return;
  if (onEdgeCenter(x, z, 2.4)) return;
  if (ORC_GATES.some((gate) => Math.hypot(gate.x - x, gate.z - z) < 7 || Math.hypot(gate.arrive.x - x, gate.arrive.z - z) < 5)) return;
  if (Math.hypot(x - RON_TO_GHELSBA.x, z - RON_TO_GHELSBA.z) < 6) return;
  if (inOutpostWater(x, z)) return;
  add(2058808, 1.35, 0.65, 1.15, x, 0.32, z);
  add(3111488, 0.75, 0.4, 0.65, x + 0.2, 0.7, z);
}

function boulder(add: Add, colliders: Solid[], x: number, z: number) {
  if (!inGhelsbaGraph(x, z, 1.1)) return;
  if (onEdgeCenter(x, z, 3.2)) return;
  if (ORC_GATES.some((gate) => Math.hypot(gate.x - x, gate.z - z) < 8 || Math.hypot(gate.arrive.x - x, gate.arrive.z - z) < 5)) return;
  if (Math.hypot(x - RON_TO_GHELSBA.x, z - RON_TO_GHELSBA.z) < 6) return;
  const h = 0.85 + (Math.abs(Math.round(x + z)) % 3) * 0.28;
  safeBox(add, colliders, 6050130, 1.15, h, 0.95, x, h / 2, z);
}

function lip(add: Add, colliders: Solid[], rect: Rect, open: OrcGate["side"]) {
  const t = 0.65;
  const h = 0.7;
  const cx = (rect.minX + rect.maxX) / 2;
  const cz = (rect.minZ + rect.maxZ) / 2;
  const w = rect.maxX - rect.minX + t;
  const d = rect.maxZ - rect.minZ + t;
  if (open !== "n") box(add, colliders, 3948594, w, h, t, cx, h / 2, rect.minZ);
  if (open !== "s") box(add, colliders, 3948594, w, h, t, cx, h / 2, rect.maxZ);
  if (open !== "w") box(add, colliders, 3948594, t, h, d, rect.minX, h / 2, cz);
  if (open !== "e") box(add, colliders, 3948594, t, h, d, rect.maxX, h / 2, cz);
}

function apron(add: Add, gate: OrcGate, color: number) {
  const x = gate.x + (gate.side === "w" ? 3.6 : gate.side === "e" ? -3.6 : 0);
  const z = gate.z + (gate.side === "n" ? 3.6 : gate.side === "s" ? -3.6 : 0);
  const across = gate.side === "n" || gate.side === "s";
  add(color, across ? 7.4 : 5.4, 0.05, across ? 5.4 : 7.4, x, 0.05, z);
}

function cornerRocks(add: Add, colliders: Solid[], rect: Rect) {
  if (rect.maxX - rect.minX < 16 || rect.maxZ - rect.minZ < 16) return;
  const spots: [number, number][] = [
    [rect.minX + 2.6, rect.minZ + 2.6],
    [rect.maxX - 2.6, rect.minZ + 2.6],
    [rect.minX + 2.6, rect.maxZ - 2.6],
    [rect.maxX - 2.6, rect.maxZ - 2.6],
  ];
  let n = 0;
  for (const [x, z] of spots) {
    if (ORC_GATES.some((gate) => Math.hypot(gate.x - x, gate.z - z) < 8 || Math.hypot(gate.arrive.x - x, gate.arrive.z - z) < 5)) continue;
    if (Math.hypot(x - RON_TO_GHELSBA.x, z - RON_TO_GHELSBA.z) < 5) continue;
    if (n >= 2) break;
    const h = 0.95 + (Math.abs(Math.round(x + z)) % 3) * 0.28;
    box(add, colliders, 3948594, 0.85, h, 0.85, x, h / 2, z);
    n += 1;
  }
}

function mountWallTorches(add: Add) {
  const inset = 0.28;
  const step = 18;
  const placed: { x: number; z: number }[] = [];
  const clear = (x: number, z: number) => {
    if (!hit(YUG_ROOMS, x, z, 0.2)) return false;
    if (ORC_GATES.some((gate) => Math.hypot(gate.x - x, gate.z - z) < 6.5 || Math.hypot(gate.arrive.x - x, gate.arrive.z - z) < 4)) return false;
    if (ORC_WATER.some((row) => x > row.rect.minX - 0.3 && x < row.rect.maxX + 0.3 && z > row.rect.minZ - 0.3 && z < row.rect.maxZ + 0.3)) return false;
    if (placed.some((spot) => Math.hypot(spot.x - x, spot.z - z) < 9)) return false;
    return true;
  };
  for (const rect of YUG_ROOMS) {
    for (const side of ["n", "e", "w"] as const) {
      const horizontal = side === "n";
      const edge = side === "n" ? rect.minZ : side === "w" ? rect.minX : rect.maxX;
      const full: [number, number] = horizontal ? [rect.minX, rect.maxX] : [rect.minZ, rect.maxZ];
      const covered: [number, number][] = [];
      for (const other of YUG_ROOMS) {
        if (other === rect) continue;
        let near = false;
        if (side === "n") near = other.minZ < edge - 0.15 && other.maxZ > edge - 0.25;
        else if (side === "w") near = other.minX < edge - 0.15 && other.maxX > edge - 0.25;
        else near = other.minX < edge + 0.25 && other.maxX > edge + 0.15;
        if (!near) continue;
        const a0 = Math.max(full[0], horizontal ? other.minX : other.minZ);
        const b0 = Math.min(full[1], horizontal ? other.maxX : other.maxZ);
        if (b0 - a0 > 0.25) covered.push([a0, b0]);
      }
      const cuts = mergeSpans(covered);
      for (const gate of ORC_GATES) {
        if (!hit(YUG_ROOMS, gate.x, gate.z, 0) || gate.side !== side) continue;
        const along = horizontal ? gate.x : gate.z;
        const across = horizontal ? Math.abs(gate.z - edge) : Math.abs(gate.x - edge);
        if (across > 4.4 || along < full[0] - 3 || along > full[1] + 3) continue;
        cuts.push([along - 6.6, along + 6.6]);
      }
      for (const span of cutSpans(full, cuts)) {
        const a = span[0] + 3;
        const b = span[1] - 3;
        if (b - a < 2) continue;
        const count = Math.max(1, Math.floor((b - a) / step));
        for (let i = 0; i < count; i++) {
          const t = a + step * 0.5 + i * step;
          if (t > b) continue;
          const x = horizontal ? t : side === "w" ? edge + inset : edge - inset;
          const z = horizontal ? edge + inset : t;
          const tipX = side === "w" ? x + 0.2 : side === "e" ? x - 0.2 : x;
          const tipZ = side === "n" ? z + 0.2 : z;
          if (!clear(tipX, tipZ)) continue;
          placed.push({ x: tipX, z: tipZ });
          torch(add, x, z, side);
        }
      }
    }
  }
}

function propClear(x: number, z: number, reach = 5): boolean {
  if (!inOrc(x, z, 0.25)) return false;
  if (ORC_GATES.some((gate) => Math.hypot(gate.x - x, gate.z - z) < reach || Math.hypot(gate.arrive.x - x, gate.arrive.z - z) < reach - 1)) return false;
  if (Math.hypot(x - RON_TO_GHELSBA.x, z - RON_TO_GHELSBA.z) < reach) return false;
  if (ORC_WATER.some((row) => x > row.rect.minX - 0.7 && x < row.rect.maxX + 0.7 && z > row.rect.minZ - 0.7 && z < row.rect.maxZ + 0.7)) return false;
  return true;
}

function towerFoot(x: number, z: number): boolean {
  const half = 1.5;
  for (const dx of [-half, 0, half]) {
    for (const dz of [-half, 0, half]) {
      if (ghelsbaClearance(x + dx, z + dz) > -0.15) return false;
    }
  }
  const room = ghelsbaClearance(x, z);
  if (room > -0.45 || room < -3.8) return false;
  if (ORC_GATES.some((gate) => Math.hypot(gate.x - x, gate.z - z) < 7 || Math.hypot(gate.arrive.x - x, gate.arrive.z - z) < 6)) return false;
  if (Math.hypot(x - RON_TO_GHELSBA.x, z - RON_TO_GHELSBA.z) < 7) return false;
  if (inOutpostWater(x, z)) return false;
  return true;
}

function seekRim(ax: number, az: number): { x: number; z: number } | null {
  for (const out of [4.2, 5.5, 7, 9, 12, 15, 18]) {
    for (let k = 0; k < 28; k++) {
      const ang = (k / 28) * Math.PI * 2;
      const x = ax + Math.cos(ang) * out;
      const z = az + Math.sin(ang) * out;
      if (towerFoot(x, z)) return { x, z };
    }
  }
  return null;
}

/** Watchtowers on the canyon rim, off the floor, beside the fort mouth and the Ronfaure mouth. */
export function orcTowers(): { x: number; z: number }[] {
  const fort = ORC_GATES.find((gate) => gate.id === "ghelsba-fort");
  const ron = ORC_GATES.find((gate) => gate.id === "ghelsba-ron");
  if (!fort || !ron) return [];
  const north = { x: fort.x, z: fort.z - 8 };
  const found = [seekRim(fort.x, fort.z), seekRim(north.x, north.z), seekRim(ron.x, ron.z)];
  const out: { x: number; z: number }[] = [];
  for (const spot of found) {
    if (!spot) continue;
    if (out.some((kept) => Math.hypot(kept.x - spot.x, kept.z - spot.z) < 7)) continue;
    out.push(spot);
  }
  return out.slice(0, 3);
}

function fireSpot(id: string): { x: number; z: number } | null {
  const at = nodeAt(id);
  for (const reach of [0, 3.5, 5.5, 7.5]) {
    const turns = reach === 0 ? 1 : 12;
    for (let k = 0; k < turns; k++) {
      const ang = (k / turns) * Math.PI * 2;
      const x = at.x + Math.cos(ang) * reach;
      const z = at.z + Math.sin(ang) * reach;
      if (ghelsbaClearance(x, z) < 4) continue;
      if (onEdgeCenter(x, z, 3)) continue;
      if (inOutpostWater(x, z)) continue;
      if (ORC_GATES.some((gate) => Math.hypot(gate.x - x, gate.z - z) < 4 || Math.hypot(gate.arrive.x - x, gate.arrive.z - z) < 4)) continue;
      if (Math.hypot(x - RON_TO_GHELSBA.x, z - RON_TO_GHELSBA.z) < 4) continue;
      return { x, z };
    }
  }
  return null;
}

const FIRE_CANDIDATES: { zone: string; x: number; z: number }[] = [
  ...(["area_plateau", "area_trench_h7", "area_hut", "area_camp_i6", "area_f7_room", "area_south_basin"] as const).flatMap((id) => {
    const spot = fireSpot(id);
    return spot ? [{ zone: "ghelsba", x: spot.x, z: spot.z }] : [];
  }),
  { zone: "fort-ghelsba", x: mid(fG6).x + 1.4, z: mid(fG6).z + 2.2 },
  { zone: "fort-ghelsba", x: mid(fH7).x - 2.4, z: mid(fH7).z + 2.6 },
  { zone: "fort-ghelsba", x: mid(fJ6).x + 1.2, z: mid(fJ6).z - 2.2 },
];

/** Campfires. At most six a zone; the engine lights only the nearest of these. */
export const ORC_FIRES: readonly { zone: string; x: number; z: number }[] = FIRE_CANDIDATES.filter((spot) => propClear(spot.x, spot.z, 4.2));

function watchtower(add: Add, colliders: Solid[], x: number, z: number) {
  const wood = 0x3d342a;
  const deck = 0x8a6844;
  const hide = 0x957d5e;
  const s = 1.15;
  const gy = Math.max(0, ghelsbaTerrainHeight(x, z));
  for (const [dx, dz] of [[-s, -s], [s, -s], [-s, s], [s, s]] as const) {
    safeBox(add, colliders, wood, 0.28, 3.6, 0.28, x + dx, gy + 1.8, z + dz);
  }
  add(deck, s * 2 + 0.7, 0.14, s * 2 + 0.7, x, gy + 3.62, z);
  add(hide, s * 2 + 1.15, 0.12, s * 2 + 0.9, x, gy + 4.35, z);
  add(hide, s * 2 + 0.4, 0.55, 0.08, x, gy + 4.05, z + s + 0.15);
  add(wood, 0.1, 2.5, 0.1, x + 0.28, gy + 1.3, z + s + 0.55);
  add(wood, 0.1, 2.5, 0.1, x - 0.28, gy + 1.3, z + s + 0.55);
  for (let i = 0; i < 6; i++) add(wood, 0.62, 0.06, 0.1, x, gy + 0.4 + i * 0.42, z + s + 0.55);
}

function lobeStakes(add: Add, id: string) {
  const wood = 6964012;
  const tip = 5255210;
  const at = nodeAt(id);
  for (let k = 0; k < 7; k++) {
    const ang = (k / 7) * Math.PI * 2;
    const x = at.x + Math.cos(ang) * 4.2;
    const z = at.z + Math.sin(ang) * 4.2;
    if (!inGhelsbaGraph(x, z, 0.2) || onEdgeCenter(x, z, 2.2) || inOutpostWater(x, z)) continue;
    add(wood, 0.2, 2.2, 0.2, x, 1.05, z);
    add(tip, 0.08, 0.28, 0.08, x, 2.2, z);
  }
}

type V2 = { x: number; z: number };

function pointKey(p: V2): string {
  return `${p.x.toFixed(2)}:${p.z.toFixed(2)}`;
}

function distPointSeg(p: V2, a: V2, b: V2): number {
  const dx = b.x - a.x;
  const dz = b.z - a.z;
  const len2 = dx * dx + dz * dz;
  const t = len2 ? Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.z - a.z) * dz) / len2)) : 0;
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

/** Drop the part of a run that stands in a gate mouth, and keep the rest. */
function cutGateGaps(a: V2, b: V2, gates: readonly { x: number; z: number }[]): [V2, V2][] {
  const len = Math.hypot(b.x - a.x, b.z - a.z);
  const steps = Math.max(1, Math.ceil(len / 1.4));
  const open = (p: V2) => gates.every((gate) => Math.hypot(p.x - gate.x, p.z - gate.z) >= 8);
  const parts: [V2, V2][] = [];
  let start: V2 | null = null;
  let prev: V2 | null = null;
  for (let s = 0; s <= steps; s++) {
    const t = s / steps;
    const p = { x: a.x + (b.x - a.x) * t, z: a.z + (b.z - a.z) * t };
    if (open(p)) {
      if (!start) start = p;
      prev = p;
    } else if (start && prev) {
      if (Math.hypot(prev.x - start.x, prev.z - start.z) > 0.8) parts.push([start, prev]);
      start = null;
      prev = null;
    }
  }
  if (start && prev && Math.hypot(prev.x - start.x, prev.z - start.z) > 0.8) parts.push([start, prev]);
  return parts;
}

/** Outpost heightfield. 12 columns by 12 rows, about 2 yalms between vertices, 64-yalm chunks. */
export const GHELSBA_TERRAIN = { x: OUT_X, z: OUT_Z, span: 12 * CELL, step: 2, chunk: 64 };

const TERRAIN_DIRT = 0x7a5a38;
const TERRAIN_GRASS = 0x5f6a34;
const TERRAIN_ROCK = 0x6e5a48;
const TERRAIN_MOSS = 0x46583a;
/** Canyon haze. Near enough that only the far edges tint. The clear color uses the same value. */
export const GHELSBA_FOG = { color: 0x8a8f78, near: 70, far: 160 };

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function terrainHash(x: number, z: number) {
  const n = Math.sin(x * 12.9898 + z * 78.233) * 43758.5453;
  return n - Math.floor(n);
}

function varyRgb(hex: number, x: number, z: number, amp: number, shade = 1) {
  const k = Math.max(0, Math.min(1.35, shade * (1 + (terrainHash(x, z) * 2 - 1) * amp)));
  return [((hex >> 16) & 255) / 255 * k, ((hex >> 8) & 255) / 255 * k, (hex & 255) / 255 * k] as const;
}

function mixRgb(a: readonly number[], b: readonly number[], t: number) {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t] as const;
}

/** 1 on the trodden center of a graph edge, 0 at the edge of its half-width. Areas and discs stay grass. */
function pathDirt(x: number, z: number) {
  let best = 0;
  for (const seg of segsAround(x, z)) {
    if (seg.half <= 0) continue;
    const q = nearPoint(x, z, seg.ax, seg.az, seg.bx, seg.bz);
    const dist = Math.hypot(x - q.x, z - q.z);
    if (dist >= seg.half) continue;
    const t = 1 - smoothstep(seg.half * 0.6, seg.half, dist);
    if (t > best) best = t;
  }
  return best;
}

function inBuiltRoom(x: number, z: number) {
  return hit(FORT_ROOMS, x, z, 0) || hit(YUG_ROOMS, x, z, 0) || hit(PEAK_ROOMS, x, z, 0);
}

/** Camera-side cliffs are a low lip. The mesh is baked once, so it does not follow the player. */
function buildTerrainGrid() {
  const step = GHELSBA_TERRAIN.step;
  const x0 = GHELSBA_TERRAIN.x;
  const z0 = GHELSBA_TERRAIN.z;
  const n = Math.round(GHELSBA_TERRAIN.span / step);
  const vert = n + 1;
  const ys = new Float32Array(vert * vert);
  const off = new Uint8Array(vert * vert);
  const minX = Math.floor(x0) - 2;
  const minZ = Math.floor(z0) - 2;
  const maxX = Math.ceil(x0 + n * step) + 2;
  const maxZ = Math.ceil(z0 + n * step) + 2;
  const gw = maxX - minX + 1;
  const clear = new Float32Array(gw * (maxZ - minZ + 1));
  clear.fill(Number.NaN);
  const clearance = (x: number, z: number) => {
    const ix = Math.round(x);
    const iz = Math.round(z);
    const slot = ix - minX + (iz - minZ) * gw;
    const hit = clear[slot];
    if (hit === hit) return hit;
    const c = inBuiltRoom(x, z) ? 1 : outsideGraph(x, z, 0) ? -1000 : ghelsbaClearance(x, z);
    clear[slot] = c;
    return c;
  };
  for (let j = 0; j < vert; j++) {
    const z = z0 + j * step;
    for (let i = 0; i < vert; i++) {
      const x = x0 + i * step;
      const idx = j * vert + i;
      if (inBuiltRoom(x, z) || (!outsideGraph(x, z, 0) && fastOnFloor(x, z))) {
        ys[idx] = -0.06;
        continue;
      }
      const c = clearance(x, z);
      if (c >= 0) {
        ys[idx] = -0.06;
        continue;
      }
      off[idx] = 1;
      const drop = -c;
      let y = 6 * smoothstep(0, 4, drop);
      if (drop > 2) y += (terrainHash(x * 0.37 + 4.1, z * 0.37 - 2.3) * 2 - 1) * 0.5;
      if (!outsideGraph(x, z, 1.01)) {
        const gx = clearance(x + 1, z) - clearance(x - 1, z);
        const gz = clearance(x, z + 1) - clearance(x, z - 1);
        const len = Math.hypot(gx, gz);
        if (len > 1e-4) {
          const lipMix = smoothstep(0.15, 0.6, -(gz / len));
          y = (1 - lipMix) * y + lipMix * Math.min(y, 1);
        }
      }
      ys[idx] = y;
    }
  }
  const blurred = new Float32Array(ys);
  for (let j = 0; j < vert; j++) {
    for (let i = 0; i < vert; i++) {
      const idx = j * vert + i;
      if (!off[idx]) continue;
      let sum = 0;
      let count = 0;
      for (let dj = -1; dj <= 1; dj++) {
        const nj = j + dj;
        if (nj < 0 || nj >= vert) continue;
        for (let di = -1; di <= 1; di++) {
          const ni = i + di;
          if (ni < 0 || ni >= vert) continue;
          sum += ys[nj * vert + ni];
          count++;
        }
      }
      blurred[idx] = sum / count;
    }
  }
  return { x0, z0, step, n, vert, ys: blurred };
}

let terrainGrid: ReturnType<typeof buildTerrainGrid> | null = null;

function bakedHeight(x: number, z: number) {
  const grid = terrainGrid ?? (terrainGrid = buildTerrainGrid());
  const u = (x - grid.x0) / grid.step;
  const v = (z - grid.z0) / grid.step;
  if (u < 0 || v < 0 || u > grid.n || v > grid.n) {
    const c = outsideGraph(x, z, 0) ? -1000 : ghelsbaClearance(x, z);
    if (c >= 0) return -0.06;
    const drop = -c;
    let y = 6 * smoothstep(0, 4, drop);
    if (drop > 2) y += (terrainHash(x * 0.37 + 4.1, z * 0.37 - 2.3) * 2 - 1) * 0.5;
    return y;
  }
  const i = Math.min(grid.n - 1, Math.floor(u));
  const j = Math.min(grid.n - 1, Math.floor(v));
  const tx = u - i;
  const tz = v - j;
  const w = grid.vert;
  const y00 = grid.ys[j * w + i];
  const y10 = grid.ys[j * w + i + 1];
  const y01 = grid.ys[(j + 1) * w + i];
  const y11 = grid.ys[(j + 1) * w + i + 1];
  return y00 + (y10 - y00) * tx + (y01 - y00) * tz + (y00 - y10 - y01 + y11) * tx * tz;
}

/** Low camera-side ledge. The path is north of it, and the shelf never climbs into a cliff. */
function southLip(x: number, z: number, y: number) {
  if (y <= 0.02 || y > 1.25) return false;
  for (let d = 2; d <= 30; d += 2) {
    const h = bakedHeight(x, z - d);
    if (h > 1.55) return false;
    if (h <= 0.05) return true;
  }
  return false;
}

/** Walkable floor stays at -0.06. South of a path the cliff is a lip; other cliffs rise to 6. */
export function ghelsbaTerrainSample(x: number, z: number) {
  const y = inBuiltRoom(x, z) || (!outsideGraph(x, z, 0) && fastOnFloor(x, z)) ? -0.06 : bakedHeight(x, z);
  const color = y <= 0
    ? mixRgb(varyRgb(TERRAIN_GRASS, x, z, 0.05), varyRgb(TERRAIN_DIRT, x, z, 0.05), pathDirt(x, z))
    : southLip(x, z, y)
      ? mixRgb(varyRgb(TERRAIN_ROCK, x, z, 0.08), varyRgb(TERRAIN_MOSS, x, z, 0.08), smoothstep(0.42, 0.58, y))
      : y >= 5
        ? varyRgb(TERRAIN_MOSS, x, z, 0.08)
        : varyRgb(TERRAIN_ROCK, x, z, 0.08);
  return { y, r: color[0], g: color[1], b: color[2] };
}

export function ghelsbaTerrainHeight(x: number, z: number) {
  return ghelsbaTerrainSample(x, z).y;
}

function outpostWalls(add: Add, colliders: Solid[]) {
  const mask = buildGhelsbaMask(16);
  const cell = CELL / mask.res;
  const { n, data } = mask;
  const sx = (i: number) => OUT_X + (i + 0.5) * cell;
  const sz = (j: number) => OUT_Z + (j + 0.5) * cell;
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
      const pair = (a: V2, b: V2) => segs.push([a, b]);
      const centerIn = inGhelsbaGraph((sx(i) + sx(i + 1)) / 2, (sz(j) + sz(j + 1)) / 2);
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
      const hitRow = table[code];
      if (hitRow) pair(hitRow[0], hitRow[1]);
    }
  }
  const gates = ORC_GATES.filter((gate) => inGhelsbaGraph(gate.x, gate.z, 0));
  const maskAt = (x: number, z: number) => {
    const i = Math.floor((x - OUT_X) / cell);
    const j = Math.floor((z - OUT_Z) / cell);
    return i >= 0 && j >= 0 && i < n && j < n && data[j * n + i] === 1;
  };
  const runs: [V2, V2, V2[]][] = [];
  for (const loop of chainContours(segs)) {
    const simple = douglas(loop, 3.1);
    let walked = 9;
    for (let i = 0; i + 1 < simple.length; i++) {
      const a = simple[i];
      const b = simple[i + 1];
      if (Math.hypot(b.x - a.x, b.z - a.z) < 0.35) continue;
      for (const part of cutGateGaps(a, b, gates)) {
        const len = Math.hypot(part[1].x - part[0].x, part[1].z - part[0].z);
        const spots: V2[] = [];
        walked += len;
        while (walked >= 18 && len > 0.4) {
          const back = walked - 18;
          const t = Math.max(0, Math.min(1, (len - back) / len));
          spots.push({ x: part[0].x + (part[1].x - part[0].x) * t, z: part[0].z + (part[1].z - part[0].z) * t });
          walked = back;
        }
        runs.push([part[0], part[1], spots]);
      }
    }
  }
  for (const [a, b, spots] of runs) {
    const dx = b.x - a.x;
    const dz = b.z - a.z;
    const len = Math.hypot(dx, dz);
    if (len < 0.35) continue;
    const mx = (a.x + b.x) / 2;
    const mz = (a.z + b.z) / 2;
    const nx = -dz / len;
    const nz = dx / len;
    const left = maskAt(mx + nx * 2.2, mz + nz * 2.2);
    const right = maskAt(mx - nx * 2.2, mz - nz * 2.2);
    let into = left && !right ? { x: nx, z: nz } : { x: -nx, z: -nz };
    if (left === right) {
      into = ghelsbaClearance(mx + nx * 2, mz + nz * 2) >= ghelsbaClearance(mx - nx * 2, mz - nz * 2) ? { x: nx, z: nz } : { x: -nx, z: -nz };
    }
    const outward = { x: -into.x, z: -into.z };
    for (const spot of spots) {
      const bx = spot.x + outward.x * 0.45;
      const bz = spot.z + outward.z * 0.45;
      if (gates.some((gate) => Math.hypot(gate.x - bx, gate.z - bz) < 4)) continue;
      if (onEdgeCenter(bx, bz, 1.6) || inOutpostWater(bx, bz)) continue;
      const gy = ghelsbaTerrainHeight(bx, bz);
      const pick = Math.abs(Math.sin(bx * 0.17 + bz * 0.13));
      if (pick > 0.5) {
        const h = 0.48 + (Math.abs(Math.round(bx * 2 + bz)) % 3) * 0.16;
        add(0x5c564e, 0.95, h, 0.78, bx, gy + h / 2, bz);
      } else {
        add(0x4a3c2e, 1.05, 0.36, 0.82, bx, gy + 0.16, bz);
        add(0x6a5844, 0.42, 0.48, 0.34, bx + 0.12, gy + 0.46, bz);
      }
    }
  }
  void colliders;
}

function paintStream(add: Add, color: number, moss: number) {
  for (const stream of GHELSBA_GRAPH.streams) {
    for (let i = 0; i + 1 < stream.length; i++) {
      const a = gridToWorld(stream[i][0], stream[i][1]);
      const b = gridToWorld(stream[i + 1][0], stream[i + 1][1]);
      const dx = b.x - a.x;
      const dz = b.z - a.z;
      const len = Math.hypot(dx, dz);
      if (len < 0.4) continue;
      const mx = (a.x + b.x) / 2;
      const mz = (a.z + b.z) / 2;
      add(color, len, 0.05, 3.2, mx, 0.02, mz, -Math.atan2(dz, dx));
      add(moss, len, 0.04, 1.1, mx, 0.03, mz, -Math.atan2(dz, dx));
    }
  }
  for (const id of POND_NODES) {
    const node = graphNode(id);
    const at = gridToWorld(node.gx, node.gy);
    const r = (node.r ?? 0.1) * CELL * 1.6;
    add(color, r, 0.05, r, at.x, 0.02, at.z);
  }
}

function paintBridges(add: Add) {
  const plank = 8020548;
  for (const edge of GHELSBA_GRAPH.edges) {
    if (edge.level !== "bridge") continue;
    for (let i = 0; i + 1 < edge.pts.length; i++) {
      const a = gridToWorld(edge.pts[i][0], edge.pts[i][1]);
      const b = gridToWorld(edge.pts[i + 1][0], edge.pts[i + 1][1]);
      const dx = b.x - a.x;
      const dz = b.z - a.z;
      const len = Math.hypot(dx, dz);
      if (len < 0.4) continue;
      const mx = (a.x + b.x) / 2;
      const mz = (a.z + b.z) / 2;
      const yaw = -Math.atan2(dz, dx);
      add(plank, len, 0.1, 3.4, mx, 0.12, mz, yaw);
      add(ROPE, len, 0.08, 0.1, mx, 1.05, mz, yaw);
      add(6964012, 0.22, 1.2, 0.22, a.x, 0.6, a.z);
      add(6964012, 0.22, 1.2, 0.22, b.x, 0.6, b.z);
    }
  }
}

function cliffRails(add: Add, colliders: Solid[]) {
  for (const line of GHELSBA_GRAPH.cliffs) {
    for (let i = 0; i + 1 < line.length; i++) {
      const a = gridToWorld(line[i][0], line[i][1]);
      const b = gridToWorld(line[i + 1][0], line[i + 1][1]);
      const dx = b.x - a.x;
      const dz = b.z - a.z;
      const len = Math.hypot(dx, dz);
      if (len < 0.8) continue;
      const mx = (a.x + b.x) / 2;
      const mz = (a.z + b.z) / 2;
      if (!inGhelsbaGraph(mx, mz, 0) || onEdgeCenter(mx, mz, 2.6)) continue;
      const yaw = -Math.atan2(dz, dx);
      add(3948594, len, 0.9, 0.35, mx, 0.45, mz, yaw);
    }
  }
}

function drum(add: Add, x: number, z: number) {
  add(6964012, 1.15, 0.62, 1.15, x, 0.31, z);
  add(ORC_RED, 1.28, 0.1, 1.28, x, 0.66, z);
}

function weaponRack(add: Add, x: number, z: number) {
  const wood = 6964012;
  const iron = 7895160;
  add(wood, 0.16, 1.45, 0.16, x - 0.7, 0.72, z);
  add(wood, 0.16, 1.45, 0.16, x + 0.7, 0.72, z);
  add(wood, 1.7, 0.12, 0.12, x, 1.4, z);
  add(iron, 0.1, 0.85, 0.28, x - 0.28, 1.05, z);
  add(iron, 0.1, 0.7, 0.22, x + 0.28, 0.95, z);
}

function skullPole(add: Add, x: number, z: number) {
  add(6964012, 0.14, 2.15, 0.14, x, 1.05, z);
  add(14927226, 0.32, 0.26, 0.28, x, 2.18, z);
  add(3948594, 0.08, 0.18, 0.08, x + 0.1, 2.4, z);
}

function campfire(add: Add, x: number, z: number) {
  add(3948594, 0.34, 0.26, 0.32, x - 0.42, 0.13, z - 0.16);
  add(3948594, 0.3, 0.22, 0.3, x + 0.46, 0.11, z + 0.12);
  add(3948594, 0.26, 0.2, 0.28, x + 0.06, 0.1, z + 0.46);
  add(5257770, 0.7, 0.14, 0.18, x, 0.1, z);
  add(16739994, 0.26, 0.4, 0.26, x, 0.4, z);
  add(16755726, 0.12, 0.2, 0.12, x + 0.06, 0.58, z);
}

function fortArch(add: Add, gate: OrcGate) {
  const timber = 6964012;
  const cap = 3948594;
  const x = gate.x + 1.5;
  for (const sign of [-1, 1] as const) {
    add(timber, 0.62, 5.5, 0.62, x, 2.75, gate.z + sign * 3.55);
    add(cap, 0.8, 0.26, 0.8, x, 5.5, gate.z + sign * 3.55);
  }
  add(timber, 0.48, 0.52, 7.8, x, 5.1, gate.z);
  add(cap, 0.7, 0.2, 8.4, x, 5.45, gate.z);
}

function fungi(add: Add, x: number, z: number) {
  add(3948594, 0.7, 0.1, 0.5, x, 0.06, z);
  add(8257446, 0.4, 0.26, 0.4, x, 0.22, z);
  add(14217156, 0.18, 0.16, 0.18, x + 0.22, 0.16, z + 0.1);
  add(9133055, 0.16, 0.22, 0.16, x - 0.16, 0.18, z - 0.08);
}

function bedroll(add: Add, x: number, z: number) {
  add(6964012, 1.55, 0.1, 0.68, x, 0.07, z);
  add(ORC_RED, 0.34, 0.14, 0.52, x - 0.52, 0.14, z);
}

function crate(add: Add, x: number, z: number) {
  add(8020548, 0.82, 0.66, 0.72, x, 0.33, z);
  add(6964012, 0.86, 0.08, 0.08, x, 0.52, z);
}

function stairMark(add: Add) {
  const span = y2Neck.maxZ - y2Neck.minZ;
  const steps = 5;
  const cx = mid(y2Neck).x;
  const width = Math.min(8.5, (y2Neck.maxX - y2Neck.minX) * 0.7);
  for (let i = 0; i < steps; i++) {
    const z = y2Neck.minZ + ((i + 0.5) / steps) * span;
    add(8020548, width, 0.08, (span / steps) * 0.62, cx, 0.05 + i * 0.035, z);
  }
  add(3948594, 0.22, 0.32, span * 0.82, y2Neck.minX + 0.45, 0.18, mid(y2Neck).z);
  add(3948594, 0.22, 0.32, span * 0.82, y2Neck.maxX - 0.45, 0.18, mid(y2Neck).z);
}

type PropFoot = { id: string; x: number; z: number; r: number };
const ghelsbaProps: PropFoot[] = [];
const occupied: PropFoot[] = [];

function jitter(x: number, z: number) {
  const n = Math.sin(x * 12.9898 + z * 78.233) * 43758.5453;
  return n - Math.floor(n);
}

function spinXZ(x: number, z: number, yaw: number, lx: number, lz: number) {
  const c = Math.cos(yaw);
  const s = Math.sin(yaw);
  return { x: x + lx * c + lz * s, z: z - lx * s + lz * c };
}

function gyAt(x: number, z: number) {
  return Math.max(0, ghelsbaTerrainHeight(x, z));
}

let walkSamples: { x: number; z: number }[] | null = null;
function walkSamplesOf() {
  if (walkSamples) return walkSamples;
  const pts: { x: number; z: number }[] = [];
  const keep = (x: number, z: number) => {
    if (inGhelsbaGraph(x, z, 0)) pts.push({ x, z });
  };
  for (const edge of GHELSBA_GRAPH.edges) {
    for (let i = 0; i + 1 < edge.pts.length; i++) {
      const a = gridToWorld(edge.pts[i][0], edge.pts[i][1]);
      const b = gridToWorld(edge.pts[i + 1][0], edge.pts[i + 1][1]);
      const dx = b.x - a.x;
      const dz = b.z - a.z;
      const len = Math.hypot(dx, dz);
      const steps = Math.max(1, Math.ceil(len / 2));
      const nx = len ? -dz / len : 0;
      const nz = len ? dx / len : 0;
      for (let s = 0; s <= steps; s++) {
        const t = s / steps;
        const px = a.x + dx * t;
        const pz = a.z + dz * t;
        for (const off of [0, 2, -2]) keep(px + nx * off, pz + nz * off);
      }
    }
  }
  for (const gate of ORC_GATES) {
    pts.push({ x: gate.x, z: gate.z });
    if (gate.id !== "ghelsba-ron") pts.push({ x: gate.arrive.x, z: gate.arrive.z });
  }
  pts.push({ x: RON_TO_GHELSBA.x, z: RON_TO_GHELSBA.z });
  for (const id of ["area_plateau", "exit_fort_ghelsba", "fort_arrival_i8", "exit_west_ronfaure", "area_nw_snake", "area_f7_room", "door_hut"] as const) {
    const at = nodeAt(id);
    pts.push(at);
  }
  walkSamples = pts;
  return pts;
}

function boxHitsWalk(b: Solid) {
  for (const p of walkSamplesOf()) {
    if (p.x > b.minX - 0.36 && p.x < b.maxX + 0.36 && p.z > b.minZ - 0.36 && p.z < b.maxZ + 0.36) return true;
  }
  return false;
}

function standNear(x: number, z: number, reach: number) {
  for (const id of ["door_hut", "crystal", "octagon", "area_nw_snake", "area_plateau", "area_trench_h7", "exit_fort_ghelsba", "area_camp_i6", "j_plateau_e"] as const) {
    const at = nodeAt(id);
    if (Math.hypot(at.x - x, at.z - z) < reach) return true;
  }
  const zin = poiAt("zone_in_default");
  return Math.hypot(zin.x - x, zin.z - z) < reach;
}

function crowded(x: number, z: number, r: number) {
  return occupied.some((p) => Math.hypot(p.x - x, p.z - z) < p.r + r - 0.25);
}

function footOk(x: number, z: number, r: number) {
  if (onEdgeCenter(x, z, r)) return false;
  if (standNear(x, z, r + 1.4)) return false;
  if (crowded(x, z, r)) return false;
  if (inOutpostWater(x, z)) return false;
  for (const gate of ORC_GATES) if (Math.hypot(gate.x - x, gate.z - z) < 4) return false;
  if (Math.hypot(RON_TO_GHELSBA.x - x, RON_TO_GHELSBA.z - z) < 4) return false;
  return true;
}

function remember(id: string, x: number, z: number, r: number) {
  ghelsbaProps.push({ id, x, z, r });
  occupied.push({ id, x, z, r });
}

function seat(x: number, z: number, r: number, kind: "floor" | "rim" | "any", minEdge: number) {
  const ok = (px: number, pz: number) => {
    if (!footOk(px, pz, r)) return false;
    if (onEdgeCenter(px, pz, minEdge)) return false;
    const y = ghelsbaTerrainHeight(px, pz);
    const c = ghelsbaClearance(px, pz);
    if (kind === "floor") return y <= 0.05 && c > 0.45;
    if (kind === "rim") return y > 0.45 && y < 5.6 && c < 0.15;
    return c > -12;
  };
  if (ok(x, z)) return { x, z };
  for (let ring = 1.2; ring <= 16; ring += 1.35) {
    const steps = 8 + Math.floor(ring * 1.5);
    for (let k = 0; k < steps; k++) {
      const a = (k / steps) * Math.PI * 2;
      const px = x + Math.cos(a) * ring;
      const pz = z + Math.sin(a) * ring;
      if (ok(px, pz)) return { x: px, z: pz };
    }
  }
  return null;
}

function mustSeat(id: string, x: number, z: number, r: number, kind: "floor" | "rim" | "any", minEdge: number) {
  const spot = seat(x, z, r, kind, minEdge);
  if (!spot) throw new Error(`no seat ${id}`);
  return spot;
}

function solidBox(add: Add, colliders: Solid[], color: number, w: number, h: number, d: number, x: number, y: number, z: number, yaw = 0, pitch = 0) {
  add(color, w, h, d, x, y, z, yaw, pitch);
  const alongX = w >= d;
  const span = alongX ? w : d;
  const thin = Math.min(w, d) / 2;
  const n = Math.max(1, Math.ceil(span / 1.15));
  const boxes: Solid[] = [];
  for (let i = 0; i < n; i++) {
    const t = ((i + 0.5) / n - 0.5) * span;
    const at = spinXZ(x, z, yaw, alongX ? t : 0, alongX ? 0 : t);
    boxes.push({ minX: at.x - thin, maxX: at.x + thin, minZ: at.z - thin, maxZ: at.z + thin });
  }
  if (boxes.some(boxHitsWalk)) return;
  for (const b of boxes) colliders.push(b);
}

function nearestEdgeFrame(x: number, z: number) {
  let best = Infinity;
  let nx = 1;
  let nz = 0;
  let tx = 0;
  let tz = 1;
  for (const edge of GHELSBA_GRAPH.edges) {
    for (let i = 0; i + 1 < edge.pts.length; i++) {
      const a = gridToWorld(edge.pts[i][0], edge.pts[i][1]);
      const b = gridToWorld(edge.pts[i + 1][0], edge.pts[i + 1][1]);
      const dx = b.x - a.x;
      const dz = b.z - a.z;
      const len2 = dx * dx + dz * dz || 1;
      const t = Math.max(0, Math.min(1, ((x - a.x) * dx + (z - a.z) * dz) / len2));
      const px = a.x + dx * t;
      const pz = a.z + dz * t;
      const dist = Math.hypot(x - px, z - pz);
      if (dist < best) {
        best = dist;
        const len = Math.sqrt(len2);
        tx = dx / len;
        tz = dz / len;
        nx = -tz;
        nz = tx;
      }
    }
  }
  return { nx, nz, tx, tz, d: best };
}

function ringEmblem(add: Add, x: number, y: number, z: number, yaw: number, s = 1) {
  add(0xe7e0d2, 0.78 * s, 0.78 * s, 0.06, x, y, z, yaw);
  const c = Math.cos(yaw);
  const sn = Math.sin(yaw);
  const put = (lx: number, ly: number, w: number, h: number) => {
    add(0x2a2420, w, h, 0.08, x + lx * c, y + ly, z - lx * sn, yaw);
  };
  put(0, 0.2 * s, 0.48 * s, 0.07 * s);
  put(0, -0.2 * s, 0.48 * s, 0.07 * s);
  put(0.2 * s, 0, 0.07 * s, 0.42 * s);
  put(-0.2 * s, 0, 0.07 * s, 0.42 * s);
}

function sagRope(add: Add, x0: number, z0: number, x1: number, z1: number, y: number, dip: number) {
  const n = 5;
  const dx = x1 - x0;
  const dz = z1 - z0;
  const yaw = Math.atan2(-dz, dx);
  const span = Math.hypot(dx, dz);
  for (let i = 0; i < n; i++) {
    const t = (i + 0.5) / n;
    const sag = Math.sin(t * Math.PI) * dip;
    add(0xb59a6a, span / n + 0.08, 0.05, 0.05, x0 + dx * t, y - sag, z0 + dz * t, yaw);
  }
}

function skullPost(add: Add, x: number, z: number) {
  if (!footOk(x, z, 0.25)) return;
  add(0x3d342a, 0.12, 0.85, 0.12, x, 0.42, z);
  add(0xf3efe6, 0.22, 0.16, 0.18, x, 0.92, z);
  add(0x2a2420, 0.05, 0.035, 0.04, x - 0.05, 0.96, z + 0.08);
  add(0x2a2420, 0.05, 0.035, 0.04, x + 0.05, 0.96, z + 0.08);
  remember("skull", x, z, 0.25);
}

function hutOuter(scale: number) {
  return 6.75 * 0.82 * scale;
}

function warHut(add: Add, colliders: Solid[], x: number, z: number, scale: number, face: "w" | "s", engineRoof: boolean) {
  const k = 0.82 * scale;
  const hw = 5.6 * k;
  const hd = 4.7 * k;
  const wallH = 2.25 * k;
  const hide = 0x393028;
  const tan = 0x957d5e;
  const post = 0xa8553e;
  const cream = 0xd8ccb0;
  const gold = 0xc9a040;
  const plank = 0x8a6844;
  const t = 0.26 * k;
  const gap = 1.45 * k;
  const side = hd - gap / 2;
  const off = hd / 2 + gap / 4;
  const westDoor = face === "w";
  const southDoor = face === "s";
  if (westDoor) {
    solidBox(add, colliders, tan, t, wallH, side, x - hw, wallH / 2, z - off);
    solidBox(add, colliders, tan, t, wallH, side, x - hw, wallH / 2, z + off);
  } else solidBox(add, colliders, tan, t, wallH, hd * 2, x - hw, wallH / 2, z);
  if (southDoor) {
    solidBox(add, colliders, tan, side, wallH, t, x - off, wallH / 2, z + hd);
    solidBox(add, colliders, tan, side, wallH, t, x + off, wallH / 2, z + hd);
  } else solidBox(add, colliders, tan, hw * 2, wallH, t, x, wallH / 2, z + hd);
  solidBox(add, colliders, tan, t, wallH, hd * 2, x + hw, wallH / 2, z);
  solidBox(add, colliders, tan, hw * 2, wallH, t, x, wallH / 2, z - hd);
  add(0x1a1410, gap * 0.8, wallH * 0.72, 0.12, westDoor ? x - hw : x, wallH * 0.36, southDoor ? z + hd : z);
  const roofW = hw * 2 + 1.05 * k;
  const roofD = hd * 2 + 1.05 * k;
  if (engineRoof) {
    HUT_ROOF.x = x;
    HUT_ROOF.z = z;
    HUT_ROOF.w = roofW;
    HUT_ROOF.d = roofD;
    HUT_ROOF.h = 0.26 * k;
    HUT_ROOF.y = wallH + HUT_ROOF.h / 2;
    HUT_ROOF.color = hide;
  } else add(hide, roofW, 0.26 * k, roofD, x, wallH + 0.13 * k, z);
  add(hide, hw * 1.35, 0.2 * k, hd * 1.2, x, wallH + 0.46 * k, z);
  const fringe = (alongX: boolean, edge: number) => {
    const len = alongX ? roofW : roofD;
    const n = Math.max(5, Math.floor(len / (0.5 * k)));
    for (let i = 0; i < n; i++) {
      const u = ((i + 0.5) / n - 0.5) * len;
      const px = alongX ? x + u : edge;
      const pz = alongX ? edge : z + u;
      add(hide, 0.07 * k, 0.48 * k, 0.1 * k, px, wallH - 0.16 * k, pz);
    }
  };
  fringe(true, z - hd - 0.35 * k);
  fringe(true, z + hd + 0.35 * k);
  fringe(false, x - hw - 0.35 * k);
  fringe(false, x + hw + 0.35 * k);
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * Math.PI * 2;
    const dx = Math.cos(a);
    const dz = Math.sin(a);
    if (westDoor && dx < -0.72) continue;
    if (southDoor && dz > 0.72) continue;
    const px = x + dx * (hw + 0.7 * k);
    const pz = z + dz * (hd + 0.7 * k);
    if (!footOk(px, pz, 0.3)) continue;
    const ph = 3.9 * k;
    solidBox(add, colliders, post, 0.32 * k, ph, 0.32 * k, px, ph / 2, pz);
    add(cream, 0.4 * k, 0.14 * k, 0.4 * k, px, ph - 0.22 * k, pz);
    add(gold, 0.16 * k, 0.26 * k, 0.16 * k, px, ph + 0.04 * k, pz);
  }
  const rampWant = 2.1 * k;
  const mouthX = westDoor ? x - hw : x;
  const mouthZ = southDoor ? z + hd : z;
  const ramp = Math.min(rampWant, Math.max(0.65 * k, nearestEdgeFrame(mouthX, mouthZ).d - 0.9));
  if (westDoor) add(plank, ramp, 0.1, 1.35 * k, x - hw - ramp / 2, 0.1, z);
  else add(plank, 1.35 * k, 0.1, ramp, x, 0.1, z + hd + ramp / 2);
  const sx = westDoor ? x - hw - 0.28 * k : x - 1.05 * k;
  const sz = westDoor ? z - 1.55 * k : z + hd + 0.55 * k;
  skullPost(add, sx, sz);
  skullPost(add, westDoor ? sx : x + 1.05 * k, westDoor ? z + 1.55 * k : sz);
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const dx = Math.cos(a);
    const dz = Math.sin(a);
    if (westDoor && dx < -0.6) continue;
    if (southDoor && dz > 0.6) continue;
    const px = x + dx * (hw + 1.25 * k);
    const pz = z + dz * (hd + 1.25 * k);
    if (!footOk(px, pz, 0.2)) continue;
    solidBox(add, colliders, 0x3d342a, 0.12, 0.85 * k, 0.12, px, 0.42 * k, pz);
  }
  const bx = x;
  const bz = z - hd * 0.15;
  add(post, 0.1, 1.15 * k, 0.1, bx - 0.55 * k, wallH + 0.7 * k, bz);
  add(post, 0.1, 1.15 * k, 0.1, bx + 0.55 * k, wallH + 0.7 * k, bz);
  add(gold, 0.06, 0.2 * k, 0.06, bx - 0.55 * k, wallH + 1.35 * k, bz);
  add(gold, 0.06, 0.2 * k, 0.06, bx + 0.55 * k, wallH + 1.35 * k, bz);
  add(tan, 1.15 * k, 0.85 * k, 0.06, bx, wallH + 0.85 * k, bz + 0.08);
  ringEmblem(add, bx, wallH + 0.85 * k, bz + 0.14, 0, 0.72 * k);
  remember("war-hut", x, z, Math.max(hw, hd) + 0.2);
}

function domeHut(add: Add, colliders: Solid[], x: number, z: number) {
  const R = 2.15;
  const gy = gyAt(x, z);
  add(0x6f6949, R * 2, R * 0.55, R * 1.65, x, gy + R * 0.28, z);
  add(0x6f6949, R * 1.45, R * 0.48, R * 1.2, x, gy + R * 0.72, z);
  add(0x5e6040, R * 0.8, R * 0.32, R * 0.65, x, gy + R * 1.05, z);
  add(0x1a1410, R * 0.55, R * 0.62, 0.16, x, gy + R * 0.34, z + R * 0.78);
  solidBox(add, colliders, 0x6f6949, R * 1.2, R * 0.7, R * 0.9, x, gy + R * 0.35, z - R * 0.15);
  remember("dome", x, z, R);
}

function palisadeRun(add: Add, colliders: Solid[], points: { x: number; z: number }[], height = 3.5) {
  let prev: { x: number; z: number } | null = null;
  let n = 0;
  const h0 = height * 0.82;
  const w = 0.55 * 0.82;
  for (const p of points) {
    if (prev && Math.hypot(p.x - prev.x, p.z - prev.z) < 0.8) continue;
    if (!footOk(p.x, p.z, w * 0.6)) {
      prev = null;
      continue;
    }
    const h = h0 * (0.88 + jitter(p.x, p.z) * 0.24);
    const gy = gyAt(p.x, p.z);
    solidBox(add, colliders, 0x3d342a, w, h, w * 0.9, p.x, gy + h / 2, p.z);
    add(0x3d342a, w * 0.35, 0.28, w * 0.35, p.x, gy + h + 0.08, p.z);
    if (prev) {
      const len = Math.hypot(p.x - prev.x, p.z - prev.z);
      const yaw = Math.atan2(-(p.z - prev.z), p.x - prev.x);
      add(0xb59a6a, len, 0.05, 0.05, (p.x + prev.x) / 2, gy + h * 0.72, (p.z + prev.z) / 2, yaw);
      add(0xb59a6a, len, 0.05, 0.05, (p.x + prev.x) / 2, gy + h * 0.4, (p.z + prev.z) / 2, yaw);
    }
    if (n % 8 === 0) ringEmblem(add, p.x, gy + h * 0.55, p.z + 0.32, 0, 0.5);
    remember("palisade", p.x, p.z, w * 0.6);
    prev = p;
    n += 1;
  }
}

function offsetEdge(edgeId: string, side: number, dist: number) {
  const edge = GHELSBA_GRAPH.edges.find((row) => row.id === edgeId);
  if (!edge) return [];
  const out: { x: number; z: number }[] = [];
  for (let i = 0; i + 1 < edge.pts.length; i++) {
    const a = gridToWorld(edge.pts[i][0], edge.pts[i][1]);
    const b = gridToWorld(edge.pts[i + 1][0], edge.pts[i + 1][1]);
    const dx = b.x - a.x;
    const dz = b.z - a.z;
    const len = Math.hypot(dx, dz) || 1;
    const steps = Math.max(1, Math.round(len / 1.25));
    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      out.push({ x: a.x + dx * t + (-dz / len) * side * dist, z: a.z + dz * t + (dx / len) * side * dist });
    }
  }
  return out;
}

function yardRing(id: string, radius: number) {
  const at = nodeAt(id);
  const open: number[] = [];
  for (const edge of GHELSBA_GRAPH.edges) {
    const ends = [edge.pts[0], edge.pts[edge.pts.length - 1]];
    for (let e = 0; e < ends.length; e++) {
      const [gx, gy] = ends[e];
      const p = gridToWorld(gx, gy);
      if (Math.hypot(p.x - at.x, p.z - at.z) > 8) continue;
      const inward = e === 0 ? edge.pts[1] : edge.pts[edge.pts.length - 2];
      const q = gridToWorld(inward[0], inward[1]);
      open.push(Math.atan2(q.z - p.z, q.x - p.x));
    }
  }
  const pts: { x: number; z: number }[] = [];
  const count = Math.max(12, Math.round((Math.PI * 2 * radius) / 1.25));
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2;
    if (open.some((o) => Math.abs(Math.atan2(Math.sin(a - o), Math.cos(a - o))) < 0.55)) continue;
    pts.push({ x: at.x + Math.cos(a) * radius, z: at.z + Math.sin(a) * radius });
  }
  return pts;
}

function bridgeSpan(add: Add, colliders: Solid[], ax: number, az: number, bx: number, bz: number) {
  const dx = bx - ax;
  const dz = bz - az;
  const len = Math.hypot(dx, dz);
  if (len < 3) return;
  const yaw = Math.atan2(-dz, dx);
  const nx = -dz / len;
  const nz = dx / len;
  const mx = (ax + bx) / 2;
  const mz = (az + bz) / 2;
  add(0x8a6844, len, 0.1, 2.2, mx, 0.1, mz, yaw);
  const boards = Math.max(2, Math.round(len / 1.2));
  for (let i = 0; i < boards; i++) {
    const t = (i + 0.5) / boards;
    add(0x6e5438, 0.22, 0.05, 2.05, ax + dx * t, 0.16, az + dz * t, yaw);
  }
  const posts = Math.max(1, Math.round(len / 6));
  for (const s of [-1, 1] as const) {
    let prev: { x: number; z: number } | null = null;
    for (let i = 0; i <= posts; i++) {
      const t = i / posts;
      const px = ax + dx * t + nx * 1.95 * s;
      const pz = az + dz * t + nz * 1.95 * s;
      if (!footOk(px, pz, 0.24)) {
        prev = null;
        continue;
      }
      solidBox(add, colliders, 0x3d342a, 0.26, 1.25, 0.26, px, 0.62, pz);
      remember("bridge-post", px, pz, 0.24);
      if (prev) {
        sagRope(add, prev.x, prev.z, px, pz, 1.15, 0.6);
        sagRope(add, prev.x, prev.z, px, pz, 0.62, 0.45);
      }
      prev = { x: px, z: pz };
    }
  }
}

function ropeBridges(add: Add, colliders: Solid[]) {
  for (const edge of GHELSBA_GRAPH.edges) {
    if (edge.level !== "bridge") continue;
    for (let i = 0; i + 1 < edge.pts.length; i++) {
      const a = gridToWorld(edge.pts[i][0], edge.pts[i][1]);
      const b = gridToWorld(edge.pts[i + 1][0], edge.pts[i + 1][1]);
      bridgeSpan(add, colliders, a.x, a.z, b.x, b.z);
    }
  }
}

function gateFrame(add: Add, colliders: Solid[], edgeId: string) {
  const edge = GHELSBA_GRAPH.edges.find((row) => row.id === edgeId);
  if (!edge) return;
  for (const end of [0, 1]) {
    const i0 = end === 0 ? 0 : edge.pts.length - 1;
    const i1 = end === 0 ? 1 : edge.pts.length - 2;
    const a = gridToWorld(edge.pts[i0][0], edge.pts[i0][1]);
    const b = gridToWorld(edge.pts[i1][0], edge.pts[i1][1]);
    const dx = b.x - a.x;
    const dz = b.z - a.z;
    const len = Math.hypot(dx, dz) || 1;
    const tx = dx / len;
    const tz = dz / len;
    const nx = -tz;
    const nz = tx;
    const x = a.x + tx * Math.min(4.2, len * 0.35);
    const z = a.z + tz * Math.min(4.2, len * 0.35);
    let marked = false;
    for (const s of [-1, 1] as const) {
      const px = x + nx * 2.2 * s;
      const pz = z + nz * 2.2 * s;
      if (!footOk(px, pz, 0.35)) continue;
      const lean = Math.atan2(-(nz * s), nx * s);
      solidBox(add, colliders, 0x3d342a, 0.46, 3.1, 0.42, px, 1.45, pz, lean, 0.2);
      add(0xb59a6a, 0.52, 0.1, 0.5, px, 2.85, pz);
      if (!marked) {
        remember("gate-frame", px, pz, 0.4);
        marked = true;
      }
    }
    if (!marked) continue;
    const yaw = Math.atan2(-nz, nx);
    add(0x3d342a, 4.7, 0.26, 0.24, x, 3.05, z, yaw);
    add(0xb59a6a, 4.3, 0.07, 0.07, x, 2.82, z, yaw);
  }
}

function standingStone(add: Add, colliders: Solid[], x: number, z: number, fx: number, fz: number) {
  const h = 2.05 + jitter(x, z) * 0.4;
  const gy = gyAt(x, z);
  solidBox(add, colliders, 0x5e554b, 1.05, h * 0.7, 0.82, x, gy + h * 0.35, z);
  add(0x5e554b, 0.7, h * 0.34, 0.58, x, gy + h * 0.78, z);
  const yaw = Math.atan2(fx, fz);
  const face = spinXZ(x, z, yaw, 0, 0.48);
  ringEmblem(add, face.x, gy + h * 0.48, face.z, yaw, 0.62);
  if (Math.abs(fz) < 0.65) ringEmblem(add, x, gy + h * 0.48, z + 0.48, 0, 0.5);
  remember("stone", x, z, 0.6);
  return true;
}

function stonePair(add: Add, colliders: Solid[], x: number, z: number) {
  const frame = nearestEdgeFrame(x, z);
  const spots: { x: number; z: number }[] = [];
  for (const s of [-1, 1] as const) {
    const spot = seat(x + frame.nx * 3.4 * s, z + frame.nz * 3.4 * s, 0.65, "floor", 2.8);
    if (!spot) continue;
    standingStone(add, colliders, spot.x, spot.z, -frame.nx * s, -frame.nz * s);
    spots.push(spot);
  }
  if (spots.length === 2) sagRope(add, spots[0].x, spots[0].z, spots[1].x, spots[1].z, 1.7, 0.55);
}

function caveMouth(add: Add, gx: number, gy: number) {
  const origin = gridToWorld(gx, gy);
  let best: { x: number; z: number; y: number; score: number } | null = null;
  const nearFloor = (x: number, z: number) => {
    for (const [dx, dz] of [[0, 4], [0, 8], [6, 4], [-6, 4], [8, 2], [-8, 2], [10, 0], [-10, 0]] as const) {
      if (inGhelsbaGraph(x + dx, z + dz, 0)) return true;
    }
    return false;
  };
  for (let dz = -28; dz <= 8; dz += 2) {
    for (let dx = -18; dx <= 18; dx += 2) {
      const x = origin.x + dx;
      const z = origin.z + dz;
      const y = ghelsbaTerrainHeight(x, z);
      if (y < 1.05 || y > 4.6) continue;
      if (inGhelsbaGraph(x, z, 0)) continue;
      if (!footOk(x, z, 1.2)) continue;
      if (!nearFloor(x, z)) continue;
      const score = -Math.abs(dx) * 0.08 - Math.abs(dz) * 0.04 - Math.abs(y - 2.1);
      if (!best || score > best.score) best = { x, z, y, score };
    }
  }
  if (!best) return false;
  const base = Math.min(best.y * 0.35, 1.2);
  add(0x1a1410, 2.5, 1.7, 1.15, best.x, base + 0.75, best.z);
  add(0x5e554b, 3.2, 0.42, 1.45, best.x, base + 1.7, best.z);
  add(0x6e5a48, 0.5, 1.45, 0.85, best.x - 1.35, base + 0.7, best.z);
  add(0x6e5a48, 0.5, 1.45, 0.85, best.x + 1.35, base + 0.7, best.z);
  remember("cave", best.x, best.z, 1.2);
  return true;
}

function tripod(add: Add, x: number, z: number) {
  const top = 1.9;
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2;
    const yaw = Math.atan2(-Math.sin(a), Math.cos(a));
    add(0x3d342a, 0.07, top, 0.07, x + Math.cos(a) * 0.28, top * 0.45, z + Math.sin(a) * 0.28, yaw, 0.62);
  }
  add(0xb59a6a, 0.14, 0.08, 0.14, x, top * 0.92, z);
  remember("tripod", x, z, 0.55);
}

function emblemBanner(add: Add, colliders: Solid[], x: number, z: number) {
  const h = 3.5;
  solidBox(add, colliders, 0x3d342a, 0.14, h, 0.14, x, h / 2, z);
  add(0x957d5e, 1.05, 1.05, 0.06, x, h * 0.72, z + 0.06);
  ringEmblem(add, x, h * 0.72, z + 0.12, 0, 0.8);
  remember("banner", x, z, 0.4);
}

function pennantString(add: Add, colliders: Solid[], x: number, z: number) {
  const frame = nearestEdgeFrame(x, z);
  const a = seat(x + frame.nx * 3.3, z + frame.nz * 3.3, 0.3, "floor", 2.8);
  const b = seat(x - frame.nx * 3.3, z - frame.nz * 3.3, 0.3, "floor", 2.8);
  if (!a || !b) return;
  solidBox(add, colliders, 0x3d342a, 0.12, 2.6, 0.12, a.x, 1.3, a.z);
  solidBox(add, colliders, 0x3d342a, 0.12, 2.6, 0.12, b.x, 1.3, b.z);
  sagRope(add, a.x, a.z, b.x, b.z, 2.35, 0.55);
  const dx = b.x - a.x;
  const dz = b.z - a.z;
  for (let i = 1; i <= 3; i++) {
    const t = i / 4;
    add(i % 2 ? 0xd8ccb0 : 0x8d3a32, 0.36, 0.55, 0.05, a.x + dx * t, 2.05 - Math.sin(t * Math.PI) * 0.55, a.z + dz * t);
  }
  remember("pennant", a.x, a.z, 0.3);
  remember("pennant", b.x, b.z, 0.3);
}

function deadTree(add: Add, colliders: Solid[], x: number, z: number) {
  const gy = gyAt(x, z);
  const h = 2.5 + jitter(x, z) * 1.5;
  const wood = 0x4a433c;
  if (gy < 0.2) solidBox(add, colliders, wood, 0.26, h, 0.26, x, gy + h / 2, z);
  else add(wood, 0.26, h, 0.26, x, gy + h / 2, z);
  const branches = 2 + Math.floor(jitter(x + 2, z) * 3);
  for (let i = 0; i < branches; i++) {
    const yaw = jitter(x, z + i * 4) * Math.PI * 2;
    add(wood, 1.15, 0.08, 0.08, x, gy + h * (0.5 + i * 0.12), z, yaw, 0.85);
  }
  remember("dead-tree", x, z, 0.4);
}

function canopyTree(add: Add, colliders: Solid[], x: number, z: number) {
  const gy = gyAt(x, z);
  solidBox(add, colliders, 0x5a4636, 0.36, 2.2, 0.36, x, gy + 1.1, z);
  add(0x3d4a32, 2.3, 1.15, 2.05, x, gy + 2.45, z);
  add(0x4a5a34, 1.45, 0.8, 1.3, x + 0.25, gy + 3.15, z - 0.15);
  remember("canopy", x, z, 1.25);
}

function hugeCrystal(add: Add, x: number, z: number) {
  const hues = [0x7eb6dc, 0xb7d7f2, 0xe9f7ff, 0xb7d7f2, 0x7eb6dc];
  const widths = [0.26, 0.58, 0.92, 0.58, 0.26];
  for (let i = 0; i < hues.length; i++) add(hues[i], widths[i], 0.4, widths[i] * 0.78, x, 1.2 + i * 0.36, z, 0.4 + i * 0.2);
  add(0xd7f4ff, 0.18, 0.18, 0.18, x, 2.15, z);
  remember("crystal", x, z, 0.55);
}

function skyline(add: Add, colliders: Solid[]) {
  const pts: { x: number; z: number }[] = [];
  for (let gy = 6.35; gy <= 8.25; gy += 0.07) {
    for (let gx = 6.05; gx <= 7.65; gx += 0.035) {
      const at = gridToWorld(gx, gy);
      const y = ghelsbaTerrainHeight(at.x, at.z);
      if (y < 0.6 || y > 3.4) continue;
      if (inGhelsbaGraph(at.x, at.z, 0)) continue;
      if (!footOk(at.x, at.z, 0.4)) continue;
      pts.push(at);
      break;
    }
  }
  palisadeRun(add, colliders, pts, 3.2);
}

function dressGhelsba(add: Add, colliders: Solid[]) {
  ghelsbaProps.length = 0;
  occupied.length = 0;
  walkSamples = null;
  const door = { x: HUT_HOME.x + 0.8, z: HUT_HOME.z + 1.2 };
  warHut(add, colliders, door.x, door.z, 1, "w", true);
  const plateau = mustSeat("war-hut", -1007, 624, hutOuter(1.3), "floor", hutOuter(1.3) + 2.55);
  warHut(add, colliders, plateau.x, plateau.z, 1.3, "s", false);
  const walk = 4.2;
  for (let i = 0; i < 4; i++) {
    const z = plateau.z + hutOuter(1.3) * 0.55 + 1.2 + i * 1.5;
    add(0x8a6844, 1.4, 0.08, 0.9, plateau.x, 0.08, z);
    skullPost(add, plateau.x - 0.9, z);
    skullPost(add, plateau.x + 0.9, z);
    if (z > plateau.z + walk) break;
  }
  const domeSeeds = [
    [door.x + 4, door.z - 5],
    [door.x - 2, door.z + 6],
    [plateau.x - 6, plateau.z - 2],
    [plateau.x + 5, plateau.z + 3],
  ];
  for (const [x, z] of domeSeeds) {
    const spot = seat(x, z, 2.15, "floor", 4.4);
    if (spot) domeHut(add, colliders, spot.x, spot.z);
  }
  const snake = nodeAt("area_nw_snake");
  for (let i = 0; i < 8 && ghelsbaProps.filter((p) => p.id === "dome").length < 7; i++) {
    const a = (i / 8) * Math.PI * 2;
    const spot = seat(snake.x + Math.cos(a) * 7, snake.z + Math.sin(a) * 6, 2.15, "floor", 4.4);
    if (spot) domeHut(add, colliders, spot.x, spot.z);
  }
  palisadeRun(add, colliders, [...offsetEdge("e_ramp_r67", 1, 3.25), ...offsetEdge("e_ramp_r67", -1, 3.25)]);
  palisadeRun(add, colliders, [...offsetEdge("e_snake_n98", 1, 3.25), ...offsetEdge("e_snake_n98", -1, 3.25)]);
  palisadeRun(add, colliders, yardRing("area_trench_h7", 8.2));
  palisadeRun(add, colliders, offsetEdge("e_top_down", 1, 3.3).slice(0, 8));
  palisadeRun(add, colliders, offsetEdge("e_diagonal", -1, 3.3).slice(0, 8));
  caveMouth(add, 6.4, 6.72);
  caveMouth(add, 6.35, 8.6);
  caveMouth(add, 6.5, 10.4);
  skyline(add, colliders);
  const logA = poiAt("logging_3");
  const logB = poiAt("logging_1");
  const picket: { x: number; z: number }[] = [];
  for (let i = 0; i <= 7; i++) {
    const t = i / 7;
    const spot = seat(logA.x + (logB.x - logA.x) * t + 5, logA.z + (logB.z - logA.z) * t, 0.3, "floor", 2.7);
    if (spot) picket.push(spot);
  }
  palisadeRun(add, colliders, picket, 1.6);
  ropeBridges(add, colliders);
  gateFrame(add, colliders, "e_top_down");
  gateFrame(add, colliders, "e_diagonal");
  stonePair(add, colliders, nodeAt("j_n98").x, nodeAt("j_n98").z);
  stonePair(add, colliders, nodeAt("j_g7").x, nodeAt("j_g7").z);
  stonePair(add, colliders, nodeAt("area_hut").x, nodeAt("area_hut").z);
  stonePair(add, colliders, nodeAt("area_south_basin").x, nodeAt("area_south_basin").z);
  stonePair(add, colliders, door.x - hutOuter(1) - 1.2, door.z);
  stonePair(add, colliders, plateau.x, plateau.z + hutOuter(1.3) + 1.4);
  for (const [x, z] of [[plateau.x + 8, plateau.z], [nodeAt("area_plateau").x + 7, nodeAt("area_plateau").z - 2], [nodeAt("area_plateau").x - 6, nodeAt("area_plateau").z + 4]] as const) {
    const spot = seat(x, z, 0.55, "floor", 2.6);
    if (spot) tripod(add, spot.x, spot.z);
  }
  const yard = seat(nodeAt("area_trench_h7").x + 6.5, nodeAt("area_trench_h7").z + 3, 1.7, "floor", 4.3);
  if (yard) {
    watchtower(add, colliders, yard.x, yard.z);
    remember("lookout", yard.x, yard.z, 1.7);
  }
  const camp = seat(nodeAt("area_camp_i6").x + 5, nodeAt("area_camp_i6").z - 2, 1.7, "floor", 4.3);
  if (camp) {
    watchtower(add, colliders, camp.x, camp.z);
    remember("lookout", camp.x, camp.z, 1.7);
  }
  for (const [x, z] of [[snake.x + 5, snake.z + 2], [nodeAt("area_plateau").x - 5, nodeAt("area_plateau").z + 3], [nodeAt("j_entry_bend").x - 4, nodeAt("j_entry_bend").z - 3]] as const) {
    const spot = seat(x, z, 0.4, "floor", 2.8);
    if (spot) emblemBanner(add, colliders, spot.x, spot.z);
  }
  pennantString(add, colliders, snake.x, snake.z);
  pennantString(add, colliders, nodeAt("j_n98").x, nodeAt("j_n98").z);
  const treeSeeds = [nodeAt("j_g7"), nodeAt("j_hut_s"), nodeAt("area_hut"), gridToWorld(6.45, 10.4), nodeAt("j_top_w"), nodeAt("j_top_e"), nodeAt("warmachine_i5")];
  let trees = 0;
  for (let pass = 0; pass < 3 && trees < 25; pass++) {
    for (const seed of treeSeeds) {
      for (let k = 0; k < 14 && trees < 25; k++) {
        const ang = (k / 14) * Math.PI * 2 + pass * 0.31;
        const dist = 6 + (k % 5) * 2.6 + pass * 2;
        const x = seed.x + Math.cos(ang) * dist;
        const z = seed.z + Math.sin(ang) * dist;
        const c = ghelsbaClearance(x, z);
        if (c < -12 || c > 3.2) continue;
        const spot = seat(x, z, 0.4, c < 0.1 ? "rim" : "floor", 2.7);
        if (!spot) continue;
        deadTree(add, colliders, spot.x, spot.z);
        trees += 1;
      }
    }
  }
  for (const id of ["logging_1", "logging_2", "logging_3", "logging_4"] as const) {
    const at = poiAt(id);
    const spot = seat(at.x + 3.5, at.z - 2, 1.25, "floor", 3.3);
    if (spot) canopyTree(add, colliders, spot.x, spot.z);
    shrub(add, at.x - 2.5, at.z + 2);
  }
  const g8 = nodeAt("river_west_end");
  const pile = seat(g8.x + 3, g8.z - 5, 1.5, "rim", 1.8) ?? seat(g8.x + 5, g8.z + 2, 1.5, "floor", 3.2);
  if (pile) {
    const yaw = 0.4;
    for (let i = 0; i < 3; i++) add(0x3d342a, 3.1, 0.42, 0.42, pile.x + i * 0.28, gyAt(pile.x, pile.z) + 0.28 + i * 0.16, pile.z, yaw + i * 0.18);
    remember("fallen-log", pile.x, pile.z, 1.5);
  }
  const crystalAt = nodeAt("crystal");
  const frame = nearestEdgeFrame(crystalAt.x, crystalAt.z);
  const crystal = mustSeat("crystal", crystalAt.x + frame.nx * 3.5, crystalAt.z + frame.nz * 3.5, 0.55, "floor", 2.9);
  hugeCrystal(add, crystal.x, crystal.z);
}

export function assertGhelsbaProps(): void {
  const count = (id: string) => ghelsbaProps.filter((p) => p.id === id).length;
  const need: [string, number][] = [
    ["war-hut", 2], ["dome", 7], ["crystal", 1], ["fallen-log", 1], ["cave", 3],
    ["palisade", 24], ["bridge-post", 6], ["gate-frame", 2], ["stone", 8],
    ["tripod", 2], ["lookout", 2], ["banner", 3], ["dead-tree", 20], ["canopy", 4],
  ];
  for (const [id, n] of need) if (count(id) < n) throw new Error(`${id} ${count(id)} < ${n}`);
  for (const prop of ghelsbaProps) {
    if (onEdgeCenter(prop.x, prop.z, prop.r)) throw new Error(`${prop.id} on a centreline`);
    for (const gate of ORC_GATES) {
      if (Math.hypot(gate.x - prop.x, gate.z - prop.z) < 4) throw new Error(`${prop.id} within 4 of ${gate.id}`);
    }
  }
}

export function buildOrcLands(add: Add, colliders: Solid[]) {
  const dirt = 9269316;
  const dirtDark = 7033908;
  const cave = 4073524;
  const rock = 6050130;
  const rockDark = 3948594;
  const timber = 6964012;
  const water = 3108230;
  const springColor = 8304816;
  const plank = 8020548;
  const moss = 4156216;
  for (const rect of FORT_ROOMS) floor(add, rect, dirtDark);
  for (const rect of YUG_ROOMS) floor(add, rect, cave);
  for (const rect of PEAK_ROOMS) floor(add, rect, dirtDark);
  const yard = paths(fE8, fI8, 4.2)[0];
  if (yard) sheet(add, yard, plank, 0.045);
  sheet(add, boxAt(mid(y2J6).x, mid(y2J6).z, 6.5, 6.5), dirtDark, 0.045);
  sheet(add, boxAt(PEAK_X, PEAK_Z, 5.6, 5.6), 3811874, 0.04);
  paintStream(add, water, moss);
  for (const row of ORC_WATER) {
    const color = row.kind === "spring" ? springColor : water;
    sheet(add, row.rect, color, 0.02);
    colliders.push({ minX: row.rect.minX, maxX: row.rect.maxX, minZ: row.rect.minZ, maxZ: row.rect.maxZ });
  }
  const fortGates = ORC_GATES.filter((gate) => hit(FORT_ROOMS, gate.x, gate.z, 0));
  const yugGates = ORC_GATES.filter((gate) => hit(YUG_ROOMS, gate.x, gate.z, 0));
  const peakGates = ORC_GATES.filter((gate) => hit(PEAK_ROOMS, gate.x, gate.z, 0));
  outpostWalls(add, colliders);
  cliffRails(add, colliders);
  cliffWall(add, colliders, FORT_ROOMS, fortGates, "timber");
  cliffWall(add, colliders, YUG_ROOMS, yugGates, "cave");
  cliffWall(add, colliders, PEAK_ROOMS, peakGates, "rock");
  for (const gate of ORC_GATES) if (!inGhelsbaGraph(gate.x, gate.z, 0)) apron(add, gate, cave);
  dressGhelsba(add, colliders);
  const camp = besideFloor("area_plateau", 6);
  const look = nodeAt("area_nw_snake");
  shrub(add, look.x + 4, look.z + 2);
  shrub(add, nodeAt("area_f7_room").x + 3, nodeAt("area_f7_room").z - 2);
  shrub(add, nodeAt("area_hut").x + 4, nodeAt("area_hut").z - 3);
  boulder(add, colliders, nodeAt("area_south_basin").x + 5, nodeAt("area_south_basin").z - 3);
  boulder(add, colliders, nodeAt("area_camp_i6").x - 4, nodeAt("area_camp_i6").z + 3);
  for (const spot of orcTowers()) watchtower(add, colliders, spot.x, spot.z);
  lobeStakes(add, "pond_sw");
  lobeStakes(add, "pond_nw");
  lobeStakes(add, "warmachine_i5");
  if (propClear(camp.x - 2.2, camp.z + 0.4, 3.2) && !onEdgeCenter(camp.x - 2.2, camp.z + 0.4, 2.4)) drum(add, camp.x - 2.2, camp.z + 0.4);
  if (propClear(camp.x + 2.4, camp.z - 0.6, 3.2) && !onEdgeCenter(camp.x + 2.4, camp.z - 0.6, 2.4)) weaponRack(add, camp.x + 2.4, camp.z - 0.6);
  for (const fire of ORC_FIRES) if (fire.zone === "ghelsba") campfire(add, fire.x, fire.z);
  const siege = mid(fI10);
  catapult(add, colliders, siege.x, siege.z - 4);
  ram(add, colliders, mid(fG8).x, mid(fG8).z + 5);
  banner(add, mid(fH8).x, mid(fH8).z - 5);
  banner(add, mid(fE8).x + 6, mid(fE8).z - 4);
  banner(add, mid(fJ8).x - 6, mid(fJ8).z);
  for (const rect of [fF8, fG8, fH8, fI8]) banner(add, mid(rect).x, mid(rect).z + 4.4);
  const fortDoor = ORC_GATES.find((gate) => gate.id === "fort-out");
  if (fortDoor) fortArch(add, fortDoor);
  for (const fire of ORC_FIRES) if (fire.zone === "fort-ghelsba") campfire(add, fire.x, fire.z);
  if (propClear(mid(fG6).x - 3.2, mid(fG6).z - 1.4, 3)) {
    drum(add, mid(fG6).x - 3.2, mid(fG6).z - 1.4);
    weaponRack(add, mid(fG6).x + 2.8, mid(fG6).z - 1.6);
  }
  torch(add, mid(fE8).x + 5, mid(fE8).z + 6);
  box(add, colliders, timber, 2.4, 0.7, 1.1, mid(fG6).x, 0.35, mid(fG6).z);
  lip(add, colliders, pool, "w");
  mountWallTorches(add);
  for (const rect of [yG8, y2J6, yE9, yH7]) cornerRocks(add, colliders, rect);
  for (const rect of [yF7, yH7, yG8, yH8, yE9, y2K5, y2K6, y2J9]) {
    const bx = rect.minX + 2.7;
    const bz = rect.minZ + 2.5;
    if (propClear(bx, bz, 4) && hit([rect], bx, bz, 0.4)) {
      bedroll(add, bx, bz);
      crate(add, bx + 1.25, bz + 0.15);
    }
    const fx = rect.maxX - 2.5;
    const fz = rect.maxZ - 2.4;
    if (propClear(fx, fz, 4) && hit([rect], fx, fz, 0.4)) fungi(add, fx, fz);
  }
  stairMark(add);
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const x = PEAK_X + Math.cos(a) * 8;
    const z = PEAK_Z + Math.sin(a) * 8;
    box(add, colliders, 9673124, 1.35, 1.15, 1.35, x, 0.55, z);
  }
  add(14927226, 1.5, 0.08, 1.5, PEAK_X, 0.07, PEAK_Z);
  lip(add, colliders, spring, "w");
  box(add, colliders, rock, 1.8, 1.3, 1.6, PEAK_X - 16, 0.65, PEAK_Z - 8);
  box(add, colliders, rockDark, 1.5, 1.05, 1.4, PEAK_X + 12, 0.52, PEAK_Z + 6);
}

function component(rects: Rect[]) {
  const seen = new Set<number>();
  const stack = [0];
  seen.add(0);
  const touches = (a: Rect, b: Rect) => a.minX <= b.maxX + 0.2 && a.maxX >= b.minX - 0.2 && a.minZ <= b.maxZ + 0.2 && a.maxZ >= b.minZ - 0.2;
  while (stack.length) {
    const i = stack.pop() as number;
    for (let j = 0; j < rects.length; j++) {
      if (seen.has(j) || !touches(rects[i], rects[j])) continue;
      seen.add(j);
      stack.push(j);
    }
  }
  return seen.size === rects.length;
}

export function assertGhelsba(): void {
  const expectGrid = (zone: string, x0: number, z0: number) => {
    const grid = ZONE_GRIDS.find((g) => g.zone === zone && (g.map ?? 1) === 1);
    if (!grid || grid.x0 !== x0 || grid.z0 !== z0 || grid.cell !== CELL || grid.cols !== 12 || grid.rows !== 12) throw new Error(`${zone} grid`);
  };
  expectGrid("ghelsba", OUT_X, OUT_Z);
  expectGrid("fort-ghelsba", FORT_X, FORT_Z);
  expectGrid("yughott", YUG_X, YUG_Z);
  const yug2 = ZONE_GRIDS.find((g) => g.zone === "yughott" && g.map === 2);
  if (!yug2 || yug2.x0 !== Y2_X || yug2.z0 !== Y2_Z || yug2.cell !== CELL || yug2.cols !== 12 || yug2.rows !== 12) throw new Error("yughott map 2 grid");
  if (ghelsbaSquare(cell(OUT_X, OUT_Z, 8, 7).x, cell(OUT_X, OUT_Z, 8, 7).z) !== "I-8") throw new Error("outpost I-8");
  if (ghelsbaSquare(cell(OUT_X, OUT_Z, 9, 10).x, cell(OUT_X, OUT_Z, 9, 10).z) !== "J-11") throw new Error("outpost J-11");
  if (fortSquare(cell(FORT_X, FORT_Z, 4, 7).x, cell(FORT_X, FORT_Z, 4, 7).z) !== "E-8") throw new Error("fort E-8");
  if (yughottSquare(cell(YUG_X, YUG_Z, 4, 8).x, cell(YUG_X, YUG_Z, 4, 8).z) !== "E-9") throw new Error("yughott E-9");
  if (grottoMap(cell(YUG_X, YUG_Z, 4, 8).x, cell(YUG_X, YUG_Z, 4, 8).z) !== 1) throw new Error("yughott map 1");
  if (gridAt("yughott", cell(YUG_X, YUG_Z, 4, 8).x, cell(YUG_X, YUG_Z, 4, 8).z)?.map !== 1) throw new Error("E-9 map");
  if (grottoMap(mid(y2K5).x, mid(y2K5).z) !== 2 || grottoMap(mid(y2J9).x, mid(y2J9).z) !== 2) throw new Error("yughott map 2");
  if (gridAt("yughott", mid(y2K5).x, mid(y2K5).z)?.map !== 2) throw new Error("K-5 map");
  if (yughottSquare(mid(y2K5).x, mid(y2K5).z) !== "K-5") throw new Error("yughott K-5 square");
  if (yughottSquare(mid(y2K5).x, y2K5.minZ + 0.2) !== "K-5") throw new Error("K-5 lip");
  if (yughottSquare(mid(y2J6).x, mid(y2J6).z) !== "J-6") throw new Error("yughott J-6 square");
  if (yughottSquare(mid(y2K6).x, mid(y2K6).z) !== "K-6") throw new Error("yughott K-6 square");
  if (yughottSquare(mid(y2J9).x, mid(y2J9).z) !== "J-9") throw new Error("yughott J-9 square");
  if (!component(FORT_ROOMS) || !component(YUG_ROOMS) || !component(PEAK_ROOMS)) throw new Error("a ghelsba zone is split");
  const spot = (rects: Rect[], ox: number, oz: number, col: number, row: number, label: string) => {
    const c = cell(ox, oz, col, row);
    if (!hit(rects, c.x, c.z, 0.4)) throw new Error(`${label} is not walkable`);
  };
  for (const node of GHELSBA_GRAPH.nodes) {
    const at = gridToWorld(node.gx, node.gy);
    if (!inGhelsbaGraph(at.x, at.z, 0)) throw new Error(`${node.id} left the floor`);
    if (ghelsbaTerrainHeight(at.x, at.z) > 0) throw new Error(`${node.id} sits on a cliff`);
  }
  const fortSpots: [number, number, string][] = [
    [4, 7, "E-8"], [5, 7, "F-8"], [6, 5, "G-6"], [6, 6, "G-7"], [6, 7, "G-8"], [6, 8, "G-9"],
    [7, 6, "H-7"], [7, 7, "H-8"], [7, 8, "H-9"], [7, 9, "H-10"], [8, 7, "I-8"], [8, 9, "I-10"],
    [9, 5, "J-6"], [9, 6, "J-7"], [9, 7, "J-8"], [9, 8, "J-9"],
  ];
  for (const [col, row, label] of fortSpots) spot(FORT_ROOMS, FORT_X, FORT_Z, col, row, `fort ${label}`);
  spot(YUG_ROOMS, YUG_X, YUG_Z, 4, 8, "yughott E-9");
  spot(YUG_ROOMS, YUG_X, YUG_Z, 5, 6, "yughott F-7");
  spot(YUG_ROOMS, YUG_X, YUG_Z, 7, 6, "yughott H-7");
  spot(YUG_ROOMS, YUG_X, YUG_Z, 7, 7, "yughott H-8");
  if (!hit(YUG_ROOMS, mid(y2K5).x, mid(y2K5).z, 0.4)) throw new Error("yughott K-5");
  if (!hit(YUG_ROOMS, mid(y2J6).x, mid(y2J6).z, 0.4)) throw new Error("yughott J-6");
  if (y2J6.maxX - y2J6.minX < 36) throw new Error("home-point cavern is too narrow");
  if (!hit(YUG_ROOMS, mid(y2J9).x, mid(y2J9).z, 0.4)) throw new Error("yughott J-9");
  if (!hit(YUG_ROOMS, mid(y2K6).x, mid(y2K6).z, 0.4)) throw new Error("yughott K-6");
  if (!hit(PEAK_ROOMS, PEAK_X, PEAK_Z, 0.4)) throw new Error("burning circle");
  if (!hit(PEAK_ROOMS, (spring.minX + spring.maxX) / 2, (spring.minZ + spring.maxZ) / 2, 0.2)) throw new Error("hot spring");
  const overlaps = (a: Rect, b: Rect) => a.minX < b.maxX - 0.5 && a.maxX > b.minX + 0.5 && a.minZ < b.maxZ - 0.5 && a.maxZ > b.minZ + 0.5;
  const groups = [OUT_FLOOR, FORT_ROOMS, YUG_ROOMS, PEAK_ROOMS];
  for (let i = 0; i < groups.length; i++) {
    for (let j = i + 1; j < groups.length; j++) {
      for (const a of groups[i]) for (const b of groups[j]) if (overlaps(a, b)) throw new Error("orc zones overlap");
    }
  }
  for (const zone of ORC_ZONES) {
    for (const rect of zone.rects) {
      if (rect.maxX > -350) throw new Error(`${zone.id} crowds ronfaure`);
      if (rect.minX < -1840 || rect.maxZ > 1680 || rect.minZ < -120) throw new Error(`${zone.id} outside the place box`);
    }
  }
  for (const gate of ORC_GATES) {
    if (!inOrc(gate.x, gate.z, 0.2)) throw new Error(`${gate.id} gate is off the ground`);
    if (gate.id === "ghelsba-ron") continue;
    if (gate.to === "closed") {
      if (!inGhelsbaGraph(gate.arrive.x, gate.arrive.z, 0.2)) throw new Error(`${gate.id} stand left the outpost`);
      if (Math.hypot(gate.x - gate.arrive.x, gate.z - gate.arrive.z) < 8) throw new Error(`${gate.id} stand is on the door`);
      continue;
    }
    const landed = orcZoneAt(gate.arrive.x, gate.arrive.z, 0.36);
    if (!landed || landed.id !== gate.to) throw new Error(`${gate.id} lands in ${landed?.id ?? "nothing"}`);
    if (Math.hypot(gate.x - gate.arrive.x, gate.z - gate.arrive.z) < 8) throw new Error(`${gate.id} arrival stands on the line`);
    for (const other of ORC_GATES) {
      if (Math.abs(gate.arrive.x - other.x) <= other.hx && Math.abs(gate.arrive.z - other.z) <= other.hz) throw new Error(`${gate.id} arrival is inside ${other.id}`);
    }
  }
  if (!inOrc(RON_TO_GHELSBA.x, RON_TO_GHELSBA.z, 0.36)) throw new Error("ronfaure lands off the outpost");
  const back = ORC_GATES.find((gate) => gate.id === "ghelsba-ron");
  if (!back || back.to !== "ronfaure-south" || Math.hypot(back.x - RON_TO_GHELSBA.x, back.z - RON_TO_GHELSBA.z) < 8) throw new Error("outpost return");
  if (ghelsbaSquare(back.x, back.z) !== "J-11" || ghelsbaSquare(RON_TO_GHELSBA.x, RON_TO_GHELSBA.z) !== "J-11") throw new Error("ronfaure mouth left J-11");
  if (Math.hypot(back.arrive.x + 78.24, back.arrive.z - 391.68) > 0.05) throw new Error("ronfaure stand drifted");
  const byId = (id: string) => {
    const gate = ORC_GATES.find((row) => row.id === id);
    if (!gate) throw new Error(id);
    return gate;
  };
  const onSquare = (id: string, square: string, fn: (x: number, z: number) => string) => {
    const gate = byId(id);
    const got = fn(gate.x, gate.z);
    if (got !== square) throw new Error(`${id} is ${got}`);
  };
  if (ORC_GATES.some((gate) => gate.id === "yug-fort-h7")) throw new Error("H-7 fort gate");
  onSquare("ghelsba-yughott", "I-11", ghelsbaSquare);
  onSquare("ghelsba-hut", "F-10", ghelsbaSquare);
  const fortMouthSq = ghelsbaSquare(byId("ghelsba-fort").x, byId("ghelsba-fort").z);
  if (fortMouthSq !== "H-8" && fortMouthSq !== "I-8") throw new Error(`ghelsba-fort is ${fortMouthSq}`);
  if (ghelsbaSquare(byId("fort-out").arrive.x, byId("fort-out").arrive.z) !== "I-8") throw new Error("fort arrival left I-8");
  if (ghelsbaSquare(byId("yug-out").arrive.x, byId("yug-out").arrive.z) !== "I-11") throw new Error("outpost return off I-11");
  onSquare("yug-out", "E-9", yughottSquare);
  onSquare("yug-fort-h8", "H-8", yughottSquare);
  onSquare("yug-fort-f7", "F-7", yughottSquare);
  onSquare("yug-fort-k5", "K-5", yughottSquare);
  onSquare("yug-horlais-k6", "K-6", yughottSquare);
  onSquare("yug-horlais-j9", "J-9", yughottSquare);
  onSquare("fort-yug-g9", "G-9", fortSquare);
  onSquare("fort-yug-j7", "J-7", fortSquare);
  onSquare("fort-yug-j8", "J-8", fortSquare);
  if (yughottSquare(byId("fort-yug-g9").arrive.x, byId("fort-yug-g9").arrive.z) !== "H-8") throw new Error("G-9 lands off H-8");
  if (yughottSquare(byId("fort-yug-j7").arrive.x, byId("fort-yug-j7").arrive.z) !== "K-5") throw new Error("J-7 lands off K-5");
  if (yughottSquare(byId("fort-yug-j8").arrive.x, byId("fort-yug-j8").arrive.z) !== "F-7") throw new Error("J-8 lands off F-7");
  if (fortSquare(byId("yug-fort-h8").arrive.x, byId("yug-fort-h8").arrive.z) !== "G-9") throw new Error("H-8 lands off G-9");
  if (fortSquare(byId("yug-fort-k5").arrive.x, byId("yug-fort-k5").arrive.z) !== "J-7") throw new Error("K-5 lands off J-7");
  if (fortSquare(byId("yug-fort-f7").arrive.x, byId("yug-fort-f7").arrive.z) !== "J-8") throw new Error("F-7 lands off J-8");
  for (const row of ORC_WATER) {
    const cx = (row.rect.minX + row.rect.maxX) / 2;
    const cz = (row.rect.minZ + row.rect.maxZ) / 2;
    if (row.rect.maxX - row.rect.minX < 0.8 || row.rect.maxZ - row.rect.minZ < 0.8) throw new Error("water is flat");
    if (!inOrc(cx, cz, 0.2)) throw new Error(`${row.kind} is off the floor`);
  }
  const fortGate = ORC_GATES.find((gate) => gate.id === "ghelsba-fort");
  if (!fortGate || fortGate.side !== "e") throw new Error("fort mouth should open east");
  if (inOutpostWater(fortGate.x, fortGate.z)) throw new Error("river covers the fort mouth");
  const goals = [
    fortGate,
    ORC_GATES.find((gate) => gate.id === "ghelsba-yughott")!,
    ORC_GATES.find((gate) => gate.id === "ghelsba-hut")!,
    nodeAt("fort_arrival_i8"),
    nodeAt("area_plateau"),
  ];
  const seen = new Set<string>();
  const queue: [number, number][] = [[RON_TO_GHELSBA.x, RON_TO_GHELSBA.z]];
  const key = (x: number, z: number) => `${Math.round(x)}:${Math.round(z)}`;
  seen.add(key(RON_TO_GHELSBA.x, RON_TO_GHELSBA.z));
  const step = 2;
  for (let i = 0; i < queue.length; i++) {
    const [x, z] = queue[i];
    for (const [dx, dz] of [[step, 0], [-step, 0], [0, step], [0, -step], [step, step], [step, -step], [-step, step], [-step, -step]] as const) {
      const nx = x + dx;
      const nz = z + dz;
      const k = key(nx, nz);
      if (seen.has(k) || !inGhelsbaGraph(nx, nz, 0)) continue;
      seen.add(k);
      queue.push([nx, nz]);
    }
  }
  for (const goal of goals) {
    if (!queue.some(([x, z]) => Math.hypot(x - goal.x, z - goal.z) < 4)) throw new Error("outpost floor is split");
  }
  for (let i = 0; i < ORC_GATES.length; i++) {
    for (let j = i + 1; j < ORC_GATES.length; j++) {
      const a = ORC_GATES[i];
      const b = ORC_GATES[j];
      if (Math.abs(a.x - b.x) < a.hx + b.hx && Math.abs(a.z - b.z) < a.hz + b.hz) throw new Error(`${a.id} overlaps ${b.id}`);
    }
  }
  const names = new Set(ORC_ZONES.map((zone) => orcRegion(mid(zone.rects[0]).x, mid(zone.rects[0]).z)));
  if (names.size !== 4) throw new Error("orc region names");
  const solids: Solid[] = [];
  buildOrcLands(() => {}, solids);
  const blocked = (x: number, z: number) => solids.some((box) => x > box.minX - 0.36 && x < box.maxX + 0.36 && z > box.minZ - 0.36 && z < box.maxZ + 0.36);
  for (const gate of ORC_GATES) {
    if (blocked(gate.x, gate.z)) throw new Error(`${gate.id} mouth is inside a prop`);
    if (gate.id !== "ghelsba-ron" && blocked(gate.arrive.x, gate.arrive.z)) throw new Error(`${gate.id} arrival is inside a prop`);
  }
  if (blocked(RON_TO_GHELSBA.x, RON_TO_GHELSBA.z)) throw new Error("outpost landing is inside a prop");
  const towers = orcTowers();
  if (towers.length < 2 || towers.length > 3) throw new Error(`watchtowers ${towers.length}`);
  const post = 1.15;
  for (const spot of towers) {
    if (inGhelsbaGraph(spot.x, spot.z, 0)) throw new Error("watchtower on the floor");
    for (const [dx, dz] of [[-post, -post], [post, -post], [-post, post], [post, post]] as const) {
      if (ghelsbaClearance(spot.x + dx, spot.z + dz) > -0.05) throw new Error("watchtower post on the floor");
    }
  }
  const firesIn = (zone: string) => ORC_FIRES.filter((fire) => fire.zone === zone).length;
  if (firesIn("ghelsba") < 1 || firesIn("fort-ghelsba") < 1) throw new Error("camp fires missing");
  if (firesIn("ghelsba") > 6 || firesIn("fort-ghelsba") > 6 || firesIn("yughott") > 0) throw new Error("camp fire cap");
  for (const edge of GHELSBA_GRAPH.edges) {
    for (let i = 0; i + 1 < edge.pts.length; i++) {
      const a = gridToWorld(edge.pts[i][0], edge.pts[i][1]);
      const b = gridToWorld(edge.pts[i + 1][0], edge.pts[i + 1][1]);
      const len = Math.hypot(b.x - a.x, b.z - a.z);
      const steps = Math.max(1, Math.ceil(len / 2));
      const dx = b.x - a.x;
      const dz = b.z - a.z;
      const nx = len ? -dz / len : 0;
      const nz = len ? dx / len : 0;
      for (let s = 0; s <= steps; s++) {
        const t = s / steps;
        const px = a.x + dx * t;
        const pz = a.z + dz * t;
        for (const off of [0, 2, -2]) {
          const x = px + nx * off;
          const z = pz + nz * off;
          if (!inGhelsbaGraph(x, z, 0)) continue;
          if (blocked(x, z)) throw new Error(`${edge.id} has a collider on the path`);
        }
      }
    }
  }
  const walks = [
    nodeAt("area_plateau"), nodeAt("exit_fort_ghelsba"), nodeAt("fort_arrival_i8"), nodeAt("exit_west_ronfaure"),
    nodeAt("area_nw_snake"), nodeAt("area_f7_room"), nodeAt("door_hut"),
    mid(fE8), mid(fG8), mid(fI8),
    mid(yE9), mid(yF7), mid(yH8), mid(y2J6), mid(y2Neck), mid(y2K5),
  ];
  for (const step of walks) {
    if (blocked(step.x, step.z)) throw new Error("a walk path grew a collider");
  }
  assertGhelsbaProps();
}
