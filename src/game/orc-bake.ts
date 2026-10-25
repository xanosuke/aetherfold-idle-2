/**
 * Build-time bake of Fort Ghelsba and Yughott heightfields.
 * Runtime must not import this. scripts/bake-orc-fields.mjs hashes it.
 */
import { FORT_CELL, FORT_GRAPH, fortClearance, fortGridSquare, gridToWorld as fortWorld, inFortGraph, worldToGrid as fortGrid, type FortGraph } from "./fort-graph";
import {
  YUGHOTT_CELL,
  YUGHOTT_GRAPHS,
  gridToWorld as yugWorld,
  inYughottGraph,
  yughottClearance,
  type YughottGraph,
  type YughottMap,
} from "./yughott-graph";

const LEVEL_Y: Record<string, number> = { low: 0, mid: 2, high: 4, top: 6 };

type Span = {
  ax: number;
  az: number;
  bx: number;
  bz: number;
  half: number;
  y0: number;
  y1: number;
  ramp: boolean;
};
type Ring = { x: number; z: number }[];
type Band = { y: number; ring: Ring };

export type BakedArrays = {
  id: "fort" | "yug1" | "yug2";
  map?: YughottMap;
  x0: number;
  z0: number;
  step: number;
  nX: number;
  nZ: number;
  ys: Float32Array;
  floorY: Float32Array;
  draw: Uint8Array;
  floor: Uint8Array;
  rgb: Uint8Array;
};

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function hash(x: number, z: number) {
  const n = Math.sin(x * 12.9898 + z * 78.233) * 43758.5453;
  return n - Math.floor(n);
}

function vary(hex: number, x: number, z: number, amp: number) {
  const k = Math.max(0.72, Math.min(1.2, 1 + (hash(x, z) * 2 - 1) * amp));
  return [((hex >> 16) & 255) / 255 * k, ((hex >> 8) & 255) / 255 * k, (hex & 255) / 255 * k] as const;
}

function mix(a: readonly number[], b: readonly number[], t: number) {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t] as const;
}

function near(px: number, pz: number, ax: number, az: number, bx: number, bz: number) {
  const dx = bx - ax;
  const dz = bz - az;
  const len2 = dx * dx + dz * dz;
  const t = len2 ? Math.max(0, Math.min(1, ((px - ax) * dx + (pz - az) * dz) / len2)) : 0;
  return { x: ax + t * dx, z: az + t * dz, t };
}

function inRing(ring: Ring, x: number, z: number) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const a = ring[i];
    const b = ring[j];
    if (a.z > z !== b.z > z && x < ((b.x - a.x) * (z - a.z)) / (b.z - a.z) + a.x) inside = !inside;
  }
  return inside;
}

function nodeHeights(graph: { nodes: { id: string }[]; edges: { from: string; to: string; level: string }[] }) {
  const bags = new Map<string, number[]>();
  const push = (id: string, y: number) => {
    const bag = bags.get(id);
    if (bag) bag.push(y);
    else bags.set(id, [y]);
  };
  for (const edge of graph.edges) {
    const y = LEVEL_Y[edge.level];
    if (y == null) continue;
    push(edge.from, y);
    push(edge.to, y);
  }
  const h = new Map<string, number>();
  for (const [id, ys] of bags) h.set(id, ys.reduce((a, b) => a + b, 0) / ys.length);
  for (let pass = 0; pass < 6; pass++) {
    for (const edge of graph.edges) {
      if (edge.level !== "ramp" && edge.level !== "lift") continue;
      const a = h.get(edge.from);
      const b = h.get(edge.to);
      if (a == null && b != null) h.set(edge.from, b);
      else if (b == null && a != null) h.set(edge.to, a);
    }
  }
  for (const node of graph.nodes) if (!h.has(node.id)) h.set(node.id, 0);
  return h;
}

function spansOf(
  graph: { nodes: { id: string }[]; edges: { from: string; to: string; level: string; width?: number; pts: [number, number][] }[] },
  world: (gx: number, gy: number) => { x: number; z: number },
  cell: number,
  fallbackWidth: number,
): Span[] {
  const h = nodeHeights(graph);
  const out: Span[] = [];
  for (const edge of graph.edges) {
    const ramp = edge.level === "ramp" || edge.level === "lift";
    const flat = LEVEL_Y[edge.level] ?? 0;
    const fromY = h.get(edge.from) ?? flat;
    const toY = h.get(edge.to) ?? flat;
    const pts = edge.pts.map(([gx, gy]) => world(gx, gy));
    let total = 0;
    const lens: number[] = [];
    for (let i = 0; i + 1 < pts.length; i++) {
      const len = Math.hypot(pts[i + 1].x - pts[i].x, pts[i + 1].z - pts[i].z);
      lens.push(len);
      total += len;
    }
    const half = ((edge.width ?? fallbackWidth) * cell) / 2;
    let acc = 0;
    for (let i = 0; i + 1 < pts.length; i++) {
      const y0 = ramp ? fromY + (toY - fromY) * (total ? acc / total : 0) : flat;
      acc += lens[i];
      const y1 = ramp ? fromY + (toY - fromY) * (total ? acc / total : 1) : flat;
      out.push({ ax: pts[i].x, az: pts[i].z, bx: pts[i + 1].x, bz: pts[i + 1].z, half, y0, y1, ramp });
    }
  }
  return out;
}

function bandsOf(
  graph: { bands: { level: string; pts: [number, number][] }[] },
  world: (gx: number, gy: number) => { x: number; z: number },
): Band[] {
  return graph.bands.map((band) => ({
    y: LEVEL_Y[band.level] ?? 0,
    ring: band.pts.map(([gx, gy]) => world(gx, gy)),
  }));
}

function terraceAt(x: number, z: number, spans: Span[], bands: Band[]): number {
  let bestD = Infinity;
  let bestY = 0;
  let bestHalf = 0;
  let bestRamp = false;
  for (const span of spans) {
    const q = near(x, z, span.ax, span.az, span.bx, span.bz);
    const d = Math.hypot(x - q.x, z - q.z);
    if (d > span.half + 1.5 || d >= bestD) continue;
    bestD = d;
    bestHalf = span.half;
    bestRamp = span.ramp;
    bestY = span.y0 + (span.y1 - span.y0) * q.t;
  }
  if (bestRamp && bestD <= bestHalf + 0.4) return bestY;
  for (const band of bands) if (inRing(band.ring, x, z)) return band.y;
  return bestY;
}

function nearestTerrace(x: number, z: number, spans: Span[], bands: Band[]): number {
  let bestD = Infinity;
  let bestY = 0;
  for (const span of spans) {
    const q = near(x, z, span.ax, span.az, span.bx, span.bz);
    const d = Math.hypot(x - q.x, z - q.z);
    if (d >= bestD) continue;
    bestD = d;
    bestY = span.y0 + (span.y1 - span.y0) * q.t;
  }
  for (const band of bands) {
    if (!inRing(band.ring, x, z)) continue;
    return band.y;
  }
  return bestY;
}

const FORT_GRASS = 0x66683f;
const FORT_PATCH = 0x4d4c3a;
const FORT_CANYON = 0x4d4c4a;
const FORT_CLIFF = 0x625e44;
const FORT_TOP = 0x6e7442;
const Y1_FLOOR = 0x3e393f;
const Y1_WALL = 0x332e39;
const Y1_TOP = 0x141418;
const Y2_FLOOR = 0x3d3c33;
const Y2_WALL = 0x282727;
const Y2_TOP = 0x201e1b;

type Bake = {
  spans: Span[];
  bands: Band[];
  clearance: (x: number, z: number) => number;
  onFloor: (x: number, z: number) => boolean;
  cave: boolean;
  paint: (x: number, z: number, y: number, on: boolean) => readonly number[];
};

function boundsOf(worldPts: { x: number; z: number }[]) {
  let minX = Infinity;
  let maxX = -Infinity;
  let minZ = Infinity;
  let maxZ = -Infinity;
  for (const p of worldPts) {
    minX = Math.min(minX, p.x);
    maxX = Math.max(maxX, p.x);
    minZ = Math.min(minZ, p.z);
    maxZ = Math.max(maxZ, p.z);
  }
  return { minX, maxX, minZ, maxZ };
}

function graphPoints(graph: FortGraph | YughottGraph, world: (gx: number, gy: number) => { x: number; z: number }) {
  const pts: { x: number; z: number }[] = [];
  for (const node of graph.nodes) pts.push(world(node.gx, node.gy));
  for (const edge of graph.edges) for (const [gx, gy] of edge.pts) pts.push(world(gx, gy));
  for (const area of graph.areas) for (const [gx, gy] of area.pts) pts.push(world(gx, gy));
  return pts;
}

function bakeField(minX: number, minZ: number, maxX: number, maxZ: number, bake: Bake, id: BakedArrays["id"], map?: YughottMap): BakedArrays {
  const step = 2;
  const x0 = minX - 8;
  const z0 = minZ - 8;
  const nX = Math.ceil((maxX - minX + 16) / step);
  const nZ = Math.ceil((maxZ - minZ + 16) / step);
  const w = nX + 1;
  const h = nZ + 1;
  const ys = new Float32Array(w * h);
  const floorY = new Float32Array(w * h);
  const draw = new Uint8Array(w * h);
  const floor = new Uint8Array(w * h);
  const rgb = new Uint8Array(w * h * 3);
  const spanX = x0 + nX * step;
  const spanZ = z0 + nZ * step;
  const clearance = (x: number, z: number) => {
    if (x < x0 - 2 || z < z0 - 2 || x > spanX + 2 || z > spanZ + 2) return -1000;
    return bake.clearance(x, z);
  };
  for (let j = 0; j < h; j++) {
    const z = z0 + j * step;
    for (let i = 0; i < w; i++) {
      const x = x0 + i * step;
      const idx = j * w + i;
      const terraceN = nearestTerrace(x, z, bake.spans, bake.bands);
      floorY[idx] = terraceN;
      const c = clearance(x, z);
      if (c < -6) continue;
      draw[idx] = 1;
      if (c >= -0.05 && bake.onFloor(x, z)) {
        floor[idx] = 1;
        ys[idx] = terraceAt(x, z, bake.spans, bake.bands);
        continue;
      }
      const drop = Math.max(0, -c);
      let rise = (bake.cave ? 7.5 : 6) * smoothstep(0, 4, drop);
      if (drop > 2) rise += (hash(x * 0.37 + 3, z * 0.37 - 1) * 2 - 1) * 0.35;
      const gx = clearance(x + 1, z) - clearance(x - 1, z);
      const gz = clearance(x, z + 1) - clearance(x, z - 1);
      const len = Math.hypot(gx, gz);
      if (len > 1e-4) {
        const lip = smoothstep(0.15, 0.6, -(gz / len));
        rise = (1 - lip) * rise + lip * Math.min(rise, 1);
      }
      ys[idx] = nearestTerrace(x, z, bake.spans, bake.bands) + rise;
    }
  }
  const blurred = new Float32Array(ys);
  for (let j = 0; j < h; j++) {
    for (let i = 0; i < w; i++) {
      const idx = j * w + i;
      if (!draw[idx] || floor[idx]) continue;
      let sum = 0;
      let count = 0;
      for (let dj = -1; dj <= 1; dj++) {
        const nj = j + dj;
        if (nj < 0 || nj >= h) continue;
        for (let di = -1; di <= 1; di++) {
          const ni = i + di;
          if (ni < 0 || ni >= w) continue;
          const nidx = nj * w + ni;
          if (!draw[nidx]) continue;
          sum += ys[nidx];
          count++;
        }
      }
      if (count) blurred[idx] = sum / count;
    }
  }
  ys.set(blurred);
  const drawnCell = (i: number, j: number) => {
    if (i < 0 || j < 0 || i >= nX || j >= nZ) return false;
    const a = j * w + i;
    return draw[a] === 1 || draw[a + 1] === 1 || draw[a + w] === 1 || draw[a + w + 1] === 1;
  };
  const wallY = (x: number, z: number) => {
    const drop = Math.max(4, -clearance(x, z));
    let rise = (bake.cave ? 7.5 : 6) * smoothstep(0, 4, drop);
    rise += (hash(x * 0.37 + 3, z * 0.37 - 1) * 2 - 1) * 0.35;
    return nearestTerrace(x, z, bake.spans, bake.bands) + rise;
  };
  for (let pass = 0; pass < 8; pass++) {
    let grew = false;
    for (let j = 0; j < nZ; j++) {
      for (let i = 0; i < nX; i++) {
        const a = j * w + i;
        if (draw[a] || draw[a + 1] || draw[a + w] || draw[a + w + 1]) continue;
        let sides = 0;
        if (drawnCell(i - 1, j)) sides++;
        if (drawnCell(i + 1, j)) sides++;
        if (drawnCell(i, j - 1)) sides++;
        if (drawnCell(i, j + 1)) sides++;
        if (sides < 3) continue;
        const corners = [a, a + 1, a + w, a + w + 1];
        for (const idx of corners) {
          if (draw[idx]) continue;
          const cx = x0 + (idx % w) * step;
          const cz = z0 + ((idx / w) | 0) * step;
          draw[idx] = 1;
          ys[idx] = wallY(cx, cz);
          grew = true;
        }
      }
    }
    if (!grew) break;
  }
  for (let j = 0; j < h; j++) {
    const z = z0 + j * step;
    for (let i = 0; i < w; i++) {
      const idx = j * w + i;
      if (!draw[idx]) continue;
      const x = x0 + i * step;
      const on = floor[idx] === 1;
      const color = bake.paint(x, z, ys[idx], on);
      rgb[idx * 3] = Math.max(0, Math.min(255, Math.round(color[0] * 255)));
      rgb[idx * 3 + 1] = Math.max(0, Math.min(255, Math.round(color[1] * 255)));
      rgb[idx * 3 + 2] = Math.max(0, Math.min(255, Math.round(color[2] * 255)));
    }
  }
  return { id, map, x0, z0, step, nX, nZ, ys, floorY, draw, floor, rgb };
}

function sampleGrid(field: BakedArrays, x: number, z: number) {
  const u = (x - field.x0) / field.step;
  const v = (z - field.z0) / field.step;
  if (u < 0 || v < 0 || u > field.nX || v > field.nZ) return null;
  const i = Math.min(field.nX - 1, Math.floor(u));
  const j = Math.min(field.nZ - 1, Math.floor(v));
  const tx = u - i;
  const tz = v - j;
  const w = field.nX + 1;
  const at = (ii: number, jj: number) => {
    const idx = jj * w + ii;
    return { y: field.ys[idx], draw: field.draw[idx] === 1 };
  };
  const y00 = at(i, j);
  const y10 = at(i + 1, j);
  const y01 = at(i, j + 1);
  const y11 = at(i + 1, j + 1);
  if (!y00.draw && !y10.draw && !y01.draw && !y11.draw) return null;
  const y = y00.y + (y10.y - y00.y) * tx + (y01.y - y00.y) * tz + (y00.y - y10.y - y01.y + y11.y) * tx * tz;
  return { y };
}

const fortSpans = spansOf(FORT_GRAPH, fortWorld, FORT_CELL, 0.12);
const fortBands = bandsOf(FORT_GRAPH, fortWorld);
const fortBox = boundsOf(graphPoints(FORT_GRAPH, fortWorld));

function yugPack(map: YughottMap) {
  const graph = YUGHOTT_GRAPHS[map];
  const world = (gx: number, gy: number) => yugWorld(gx, gy, map);
  return {
    map,
    spans: spansOf(graph, world, YUGHOTT_CELL, 0.12),
    bands: bandsOf(graph, world),
    box: boundsOf(graphPoints(graph, world)),
  };
}

const yug1 = yugPack(1);
const yug2 = yugPack(2);

function fortPaint(x: number, z: number, y: number, on: boolean) {
  if (on) {
    const g = fortGrid(x, z);
    if (fortGridSquare(g.gx, g.gy) === "G-9") return vary(FORT_CANYON, x, z, 0.04);
    const patch = hash(x * 0.17, z * 0.13) > 0.7 ? 1 : 0;
    return mix(vary(FORT_GRASS, x, z, 0.045), vary(FORT_PATCH, x, z, 0.04), patch);
  }
  const rise = y - nearestTerrace(x, z, fortSpans, fortBands);
  if (rise > 3.4) return vary(FORT_TOP, x, z, 0.05);
  return vary(FORT_CLIFF, x, z, 0.05);
}

function yugPaint(pack: ReturnType<typeof yugPack>, x: number, z: number, y: number, on: boolean) {
  const floor = pack.map === 2 ? Y2_FLOOR : Y1_FLOOR;
  const wall = pack.map === 2 ? Y2_WALL : Y1_WALL;
  const top = pack.map === 2 ? Y2_TOP : Y1_TOP;
  if (on) return vary(floor, x, z, 0.04);
  const rise = y - nearestTerrace(x, z, pack.spans, pack.bands);
  return mix(vary(wall, x, z, 0.03), vary(top, x, z, 0.03), smoothstep(0, 7.5, rise));
}

export function bakeAllFields(): BakedArrays[] {
  const fort = bakeField(fortBox.minX, fortBox.minZ, fortBox.maxX, fortBox.maxZ, {
    spans: fortSpans,
    bands: fortBands,
    clearance: fortClearance,
    onFloor: (x, z) => inFortGraph(x, z, 0),
    cave: false,
    paint: fortPaint,
  }, "fort");
  const bakeYug = (pack: ReturnType<typeof yugPack>, id: BakedArrays["id"]) => bakeField(pack.box.minX, pack.box.minZ, pack.box.maxX, pack.box.maxZ, {
    spans: pack.spans,
    bands: pack.bands,
    clearance: (x, z) => yughottClearance(x, z, pack.map),
    onFloor: (x, z) => inYughottGraph(x, z, 0, pack.map),
    cave: true,
    paint: (x, z, y, on) => yugPaint(pack, x, z, y, on),
  }, id, pack.map);
  return [fort, bakeYug(yug1, "yug1"), bakeYug(yug2, "yug2")];
}

export type SlowSample = { y: number; r: number; g: number; b: number; draw: boolean };

export function slowFortSample(field: BakedArrays, x: number, z: number): SlowSample | null {
  const hit = sampleGrid(field, x, z);
  if (!hit) return null;
  const on = inFortGraph(x, z, 0);
  const y = on ? terraceAt(x, z, fortSpans, fortBands) : hit.y;
  const color = fortPaint(x, z, y, on);
  return { y, r: color[0], g: color[1], b: color[2], draw: true };
}

export function slowYugSample(field: BakedArrays, x: number, z: number, map: YughottMap): SlowSample | null {
  const pack = map === 1 ? yug1 : yug2;
  const hit = sampleGrid(field, x, z);
  if (!hit) return null;
  const on = inYughottGraph(x, z, 0, map);
  const y = on ? terraceAt(x, z, pack.spans, pack.bands) : hit.y;
  const color = yugPaint(pack, x, z, y, on);
  return { y, r: color[0], g: color[1], b: color[2], draw: true };
}

export function referenceTerrace(id: BakedArrays["id"], x: number, z: number): number {
  if (id === "fort") return nearestTerrace(x, z, fortSpans, fortBands);
  if (id === "yug1") return nearestTerrace(x, z, yug1.spans, yug1.bands);
  return nearestTerrace(x, z, yug2.spans, yug2.bands);
}

export function slowFloorY(x: number, z: number): number {
  if (inFortGraph(x, z, 0)) return terraceAt(x, z, fortSpans, fortBands);
  if (inYughottGraph(x, z, 0, 1)) return terraceAt(x, z, yug1.spans, yug1.bands);
  if (inYughottGraph(x, z, 0, 2)) return terraceAt(x, z, yug2.spans, yug2.bands);
  return 0;
}
