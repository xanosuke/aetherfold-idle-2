/**
 * Fort Ghelsba and Yughott Grotto heightfields.
 * Walkable floor comes from the traced graphs. Levels become terraces
 * (low 0, mid 2, high 4, top 6). Ramps and the H-7 lift slope between
 * the nodes they join. Off the floor the ground rises into a cliff, and
 * the camera-facing south side stays a low lip. The mesh is baked once.
 */
import {
  FORT_CELL,
  FORT_GRAPH,
  clampFortGraph,
  fortClearance,
  gridToWorld as fortWorld,
  inFortGraph,
  type FortGraph,
} from "./fort-graph";
import {
  YUGHOTT_CELL,
  YUGHOTT_GRAPHS,
  clampYughottGraph,
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
type Field = {
  x0: number;
  z0: number;
  step: number;
  n: number;
  vert: number;
  ys: Float32Array;
  draw: Uint8Array;
  floor: Uint8Array;
  map?: YughottMap;
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

type Bake = {
  spans: Span[];
  bands: Band[];
  clearance: (x: number, z: number) => number;
  onFloor: (x: number, z: number) => boolean;
  cave: boolean;
};

function bakeField(minX: number, minZ: number, maxX: number, maxZ: number, bake: Bake, map?: YughottMap): Field {
  const step = 2;
  const x0 = minX - 8;
  const z0 = minZ - 8;
  const nX = Math.ceil((maxX - minX + 16) / step);
  const nZ = Math.ceil((maxZ - minZ + 16) / step);
  const n = Math.max(nX, nZ);
  const vert = n + 1;
  const ys = new Float32Array(vert * vert);
  const draw = new Uint8Array(vert * vert);
  const floor = new Uint8Array(vert * vert);
  const spanX = x0 + n * step;
  const spanZ = z0 + n * step;
  const clearance = (x: number, z: number) => {
    if (x < x0 - 2 || z < z0 - 2 || x > spanX + 2 || z > spanZ + 2) return -1000;
    return bake.clearance(x, z);
  };
  for (let j = 0; j < vert; j++) {
    const z = z0 + j * step;
    for (let i = 0; i < vert; i++) {
      const x = x0 + i * step;
      const idx = j * vert + i;
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
      const base = nearestTerrace(x, z, bake.spans, bake.bands);
      ys[idx] = base + rise;
    }
  }
  const blurred = new Float32Array(ys);
  for (let j = 0; j < vert; j++) {
    for (let i = 0; i < vert; i++) {
      const idx = j * vert + i;
      if (!draw[idx] || floor[idx]) continue;
      let sum = 0;
      let count = 0;
      for (let dj = -1; dj <= 1; dj++) {
        const nj = j + dj;
        if (nj < 0 || nj >= vert) continue;
        for (let di = -1; di <= 1; di++) {
          const ni = i + di;
          if (ni < 0 || ni >= vert) continue;
          const nidx = nj * vert + ni;
          if (!draw[nidx]) continue;
          sum += ys[nidx];
          count++;
        }
      }
      if (count) blurred[idx] = sum / count;
    }
  }
  return { x0, z0, step, n, vert, ys: blurred, draw, floor, map };
}

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

const fortSpans = spansOf(FORT_GRAPH, fortWorld, FORT_CELL, 0.12);
const fortBands = bandsOf(FORT_GRAPH, fortWorld);
const fortBox = boundsOf(graphPoints(FORT_GRAPH, fortWorld));

function yugBake(map: YughottMap) {
  const graph = YUGHOTT_GRAPHS[map];
  const world = (gx: number, gy: number) => yugWorld(gx, gy, map);
  return {
    map,
    spans: spansOf(graph, world, YUGHOTT_CELL, 0.12),
    bands: bandsOf(graph, world),
    box: boundsOf(graphPoints(graph, world)),
    world,
  };
}

const yug1 = yugBake(1);
const yug2 = yugBake(2);

let fortField: Field | null = null;
let yugFields: [Field, Field] | null = null;

function fortGrid(): Field {
  if (fortField) return fortField;
  fortField = bakeField(fortBox.minX, fortBox.minZ, fortBox.maxX, fortBox.maxZ, {
    spans: fortSpans,
    bands: fortBands,
    clearance: fortClearance,
    onFloor: (x, z) => inFortGraph(x, z, 0),
    cave: false,
  });
  return fortField;
}

function yugGrids(): [Field, Field] {
  if (yugFields) return yugFields;
  const bake = (pack: ReturnType<typeof yugBake>): Field => bakeField(pack.box.minX, pack.box.minZ, pack.box.maxX, pack.box.maxZ, {
    spans: pack.spans,
    bands: pack.bands,
    clearance: (x, z) => yughottClearance(x, z, pack.map),
    onFloor: (x, z) => inYughottGraph(x, z, 0, pack.map),
    cave: true,
  }, pack.map);
  yugFields = [bake(yug1), bake(yug2)];
  return yugFields;
}

function sampleField(field: Field, x: number, z: number): { y: number; draw: boolean; floor: boolean } | null {
  const u = (x - field.x0) / field.step;
  const v = (z - field.z0) / field.step;
  if (u < 0 || v < 0 || u > field.n || v > field.n) return null;
  const i = Math.min(field.n - 1, Math.floor(u));
  const j = Math.min(field.n - 1, Math.floor(v));
  const tx = u - i;
  const tz = v - j;
  const w = field.vert;
  const at = (ii: number, jj: number) => {
    const idx = jj * w + ii;
    return { y: field.ys[idx], draw: field.draw[idx] === 1, floor: field.floor[idx] === 1 };
  };
  const y00 = at(i, j);
  const y10 = at(i + 1, j);
  const y01 = at(i, j + 1);
  const y11 = at(i + 1, j + 1);
  if (!y00.draw && !y10.draw && !y01.draw && !y11.draw) return null;
  const y = y00.y + (y10.y - y00.y) * tx + (y01.y - y00.y) * tz + (y00.y - y10.y - y01.y + y11.y) * tx * tz;
  const draw = y00.draw || y10.draw || y01.draw || y11.draw;
  const floor = y00.floor && y10.floor && y01.floor && y11.floor;
  return { y, draw, floor };
}

export type TraceSample = { y: number; r: number; g: number; b: number; draw: boolean };

const DIRT = 0x7a5a38;
const GRASS = 0x5f6a34;
const ROCK = 0x6e5a48;
const MOSS = 0x46583a;
const CAVE_FLOOR = 0x3a342e;
const CAVE_WALL = 0x2a2622;

function pathAmount(x: number, z: number, spans: Span[]) {
  let best = 0;
  for (const span of spans) {
    const q = near(x, z, span.ax, span.az, span.bx, span.bz);
    const d = Math.hypot(x - q.x, z - q.z);
    if (d >= span.half) continue;
    const t = 1 - smoothstep(span.half * 0.55, span.half, d);
    if (t > best) best = t;
  }
  return best;
}

export function fortTerrainSample(x: number, z: number): TraceSample | null {
  const hit = sampleField(fortGrid(), x, z);
  if (!hit || !hit.draw) return null;
  const on = inFortGraph(x, z, 0);
  const y = on ? terraceAt(x, z, fortSpans, fortBands) : hit.y;
  const color = on
    ? mix(vary(GRASS, x, z, 0.05), vary(DIRT, x, z, 0.05), pathAmount(x, z, fortSpans))
    : (() => {
      const base = nearestTerrace(x, z, fortSpans, fortBands);
      const rise = y - base;
      const gz = fortClearance(x, z + 1) - fortClearance(x, z - 1);
      const gx = fortClearance(x + 1, z) - fortClearance(x - 1, z);
      const south = -(gz / (Math.hypot(gx, gz) || 1)) > 0.35 && rise < 1.3;
      if (south) return mix(vary(ROCK, x, z, 0.06), vary(MOSS, x, z, 0.06), smoothstep(0.3, 0.9, rise));
      if (rise > 4.2) return vary(MOSS, x, z, 0.06);
      return vary(ROCK, x, z, 0.06);
    })();
  return { y, r: color[0], g: color[1], b: color[2], draw: true };
}

export function yughottTerrainSample(x: number, z: number, map: YughottMap): TraceSample | null {
  const pack = map === 1 ? yug1 : yug2;
  const field = yugGrids()[map - 1];
  const hit = sampleField(field, x, z);
  if (!hit || !hit.draw) return null;
  const on = inYughottGraph(x, z, 0, map);
  const y = on ? terraceAt(x, z, pack.spans, pack.bands) : hit.y;
  const color = on
    ? vary(CAVE_FLOOR, x, z, 0.04)
    : mix(vary(CAVE_FLOOR, x, z, 0.04), vary(CAVE_WALL, x, z, 0.03), smoothstep(0.4, 3.2, y - nearestTerrace(x, z, pack.spans, pack.bands)));
  return { y, r: color[0], g: color[1], b: color[2], draw: true };
}

export const FORT_FIELD_STEP = 2;
export function fortFieldBox() {
  const field = fortGrid();
  return { x0: field.x0, z0: field.z0, span: field.n * field.step, step: field.step };
}

export function yughottFieldBox(map: YughottMap) {
  const field = yugGrids()[map - 1];
  return { x0: field.x0, z0: field.z0, span: field.n * field.step, step: field.step, map };
}

/** Floor height under a walker. Off the traced floor this is 0, matching every other zone. */
export function traceFloorY(x: number, z: number): number {
  if (inFortGraph(x, z, 0)) return terraceAt(x, z, fortSpans, fortBands);
  if (inYughottGraph(x, z, 0, 1)) return terraceAt(x, z, yug1.spans, yug1.bands);
  if (inYughottGraph(x, z, 0, 2)) return terraceAt(x, z, yug2.spans, yug2.bands);
  return 0;
}

/** Outpost mesh should not pave the grotto. The floors do not meet; this is the margin. */
export function yughottClaimsMesh(x: number, z: number): boolean {
  const box = yug1.box;
  if (x < box.minX - 6 || x > box.maxX + 6 || z < box.minZ - 6 || z > box.maxZ + 6) {
    const b2 = yug2.box;
    if (x < b2.minX - 6 || x > b2.maxX + 6 || z < b2.minZ - 6 || z > b2.maxZ + 6) return false;
    return yughottClearance(x, z, 2) > -4;
  }
  if (yughottClearance(x, z, 1) > -4) return true;
  const b2 = yug2.box;
  if (x < b2.minX - 6 || x > b2.maxX + 6 || z < b2.minZ - 6 || z > b2.maxZ + 6) return false;
  return yughottClearance(x, z, 2) > -4;
}

const SEAT_REACH = 9.25;

function seatOn(
  x: number,
  z: number,
  on: (x: number, z: number) => boolean,
  clamp: (x: number, z: number) => { x: number; z: number },
  clearance: (x: number, z: number) => number,
  wall: boolean,
) {
  let px = x;
  let pz = z;
  if (!on(px, pz)) {
    const next = clamp(px, pz);
    if (Math.hypot(next.x - px, next.z - pz) <= SEAT_REACH && on(next.x, next.z)) {
      px = next.x;
      pz = next.z;
    }
  }
  if (!wall || !on(px, pz)) return { x: px, z: pz };
  for (let i = 0; i < 14; i++) {
    const c = clearance(px, pz);
    if (c < 0.55 && c > 0.08) break;
    const h = 0.55;
    const gx = clearance(px + h, pz) - clearance(px - h, pz);
    const gz = clearance(px, pz + h) - clearance(px, pz - h);
    const g = Math.hypot(gx, gz) || 1;
    const dir = c > 0.55 ? -1 : 1;
    const nx = px + dir * (gx / g) * 0.4;
    const nz = pz + dir * (gz / g) * 0.4;
    if (!on(nx, nz)) break;
    px = nx;
    pz = nz;
  }
  return { x: px, z: pz };
}

export type SeatedPoi = { id: string; gx: number; gy: number; grid: string; label: string; x: number; z: number; map?: YughottMap };

export function seatedFortPois(): SeatedPoi[] {
  return FORT_GRAPH.pois.map((poi) => {
    const at = fortWorld(poi.gx, poi.gy);
    const wall = poi.id.startsWith("lever");
    const seat = seatOn(at.x, at.z, (x, z) => inFortGraph(x, z, 0), (x, z) => clampFortGraph(x, z, 0), fortClearance, wall);
    return { ...poi, ...seat };
  });
}

export function seatedYughottPois(): SeatedPoi[] {
  const out: SeatedPoi[] = [];
  for (const map of [1, 2] as const) {
    for (const poi of YUGHOTT_GRAPHS[map].pois) {
      const at = yugWorld(poi.gx, poi.gy, map);
      const seat = seatOn(
        at.x,
        at.z,
        (x, z) => inYughottGraph(x, z, 0, map),
        (x, z) => clampYughottGraph(x, z, 0, map),
        (x, z) => yughottClearance(x, z, map),
        poi.id.startsWith("mining_"),
      );
      out.push({ ...poi, ...seat, map });
    }
  }
  return out;
}

export function fortPoi(id: string): SeatedPoi {
  const poi = seatedFortPois().find((row) => row.id === id);
  if (!poi) throw new Error(id);
  return poi;
}

export function yughottPoi(id: string, map?: YughottMap): SeatedPoi {
  const poi = seatedYughottPois().find((row) => row.id === id && (map == null || row.map === map));
  if (!poi) throw new Error(id);
  return poi;
}

function retreat(
  graph: { nodes: { id: string; gx: number; gy: number; kind: string }[]; edges: { from: string; to: string; pts: [number, number][] }[] },
  world: (gx: number, gy: number) => { x: number; z: number },
  nodeId: string,
  yards: number,
) {
  const node = graph.nodes.find((row) => row.id === nodeId);
  if (!node) throw new Error(nodeId);
  const edges = graph.edges.filter((edge) => edge.from === nodeId || edge.to === nodeId);
  const edge = edges.find((row) => {
    const otherId = row.from === nodeId ? row.to : row.from;
    const other = graph.nodes.find((n) => n.id === otherId);
    return other && other.kind !== "exit";
  }) ?? edges[0];
  if (!edge) return world(node.gx, node.gy);
  let pts = edge.pts.map(([gx, gy]) => ({ gx, gy }));
  const start = pts[0];
  const end = pts[pts.length - 1];
  const atEnd = Math.hypot(end.gx - node.gx, end.gy - node.gy) <= Math.hypot(start.gx - node.gx, start.gy - node.gy);
  if (!atEnd) pts = pts.slice().reverse();
  let left = yards;
  for (let i = pts.length - 1; i > 0; i--) {
    const a = world(pts[i].gx, pts[i].gy);
    const b = world(pts[i - 1].gx, pts[i - 1].gy);
    const len = Math.hypot(b.x - a.x, b.z - a.z);
    if (len >= left) {
      const t = len ? left / len : 0;
      return { x: a.x + (b.x - a.x) * t, z: a.z + (b.z - a.z) * t };
    }
    left -= len;
  }
  return world(pts[0].gx, pts[0].gy);
}

export function retreatFort(nodeId: string, yards = 10) {
  return retreat(FORT_GRAPH, fortWorld, nodeId, yards);
}

export function retreatYughott(map: YughottMap, nodeId: string, yards = 10) {
  return retreat(YUGHOTT_GRAPHS[map], (gx, gy) => yugWorld(gx, gy, map), nodeId, yards);
}

export function fortNode(id: string) {
  const node = FORT_GRAPH.nodes.find((row) => row.id === id);
  if (!node) throw new Error(id);
  return fortWorld(node.gx, node.gy);
}

/** Wooden lift between the lower stop and the upper stop. The deck y is animated in the yard. */
export function fortLift() {
  const at = fortNode("lift_h7");
  const low = fortNode("room_28w");
  const high = fortNode("area_52n");
  return {
    x: at.x,
    z: at.z,
    y0: terraceAt(low.x, low.z, fortSpans, fortBands),
    y1: terraceAt(high.x, high.z, fortSpans, fortBands),
  };
}

export function yughottNode(map: YughottMap, id: string) {
  const node = YUGHOTT_GRAPHS[map].nodes.find((row) => row.id === id);
  if (!node) throw new Error(id);
  return yugWorld(node.gx, node.gy, map);
}

/** Torch seats pressed against the cave wall, shared by the props and the warm lights. */
export function yughottTorches(): { x: number; z: number; map: YughottMap }[] {
  const out: { x: number; z: number; map: YughottMap }[] = [];
  for (const map of [1, 2] as const) {
    const graph = YUGHOTT_GRAPHS[map];
    for (const edge of graph.edges) {
      const pts = edge.pts.map(([gx, gy]) => yugWorld(gx, gy, map));
      let walked = 0;
      let next = 8;
      for (let i = 0; i + 1 < pts.length; i++) {
        const a = pts[i];
        const b = pts[i + 1];
        const len = Math.hypot(b.x - a.x, b.z - a.z);
        const steps = Math.max(1, Math.ceil(len / 4));
        for (let s = 0; s <= steps; s++) {
          const t = s / steps;
          const x = a.x + (b.x - a.x) * t;
          const z = a.z + (b.z - a.z) * t;
          const along = walked + len * t;
          if (along < next) continue;
          next = along + 16;
          const gx = yughottClearance(x + 0.8, z, map) - yughottClearance(x - 0.8, z, map);
          const gz = yughottClearance(x, z + 0.8, map) - yughottClearance(x, z - 0.8, map);
          const g = Math.hypot(gx, gz) || 1;
          const spot = { x: x - (gx / g) * 2.4, z: z - (gz / g) * 2.4 };
          if (yughottClearance(spot.x, spot.z, map) < -0.15 || yughottClearance(spot.x, spot.z, map) > 1.1) continue;
          if (!inYughottGraph(spot.x, spot.z, 0, map)) continue;
          out.push({ ...spot, map });
        }
        walked += len;
      }
    }
  }
  return out.slice(0, 18);
}

function reachable(graph: { nodes: { id: string; kind: string }[]; edges: { from: string; to: string }[] }) {
  const exits = graph.nodes.filter((node) => node.kind === "exit");
  if (!exits.length) throw new Error("no exit");
  const adj = new Map<string, string[]>();
  for (const edge of graph.edges) {
    if (!adj.has(edge.from)) adj.set(edge.from, []);
    if (!adj.has(edge.to)) adj.set(edge.to, []);
    adj.get(edge.from)!.push(edge.to);
    adj.get(edge.to)!.push(edge.from);
  }
  const seen = new Set<string>();
  const queue = exits.map((exit) => exit.id);
  for (const id of queue) seen.add(id);
  for (let i = 0; i < queue.length; i++) {
    for (const next of adj.get(queue[i]) ?? []) {
      if (seen.has(next)) continue;
      seen.add(next);
      queue.push(next);
    }
  }
  const missing = graph.nodes.filter((node) => !seen.has(node.id));
  if (missing.length) throw new Error(`unreachable ${missing.map((node) => node.id).join(" ")}`);
}

export function assertFort(): void {
  reachable(FORT_GRAPH);
  for (const node of FORT_GRAPH.nodes) {
    const at = fortWorld(node.gx, node.gy);
    if (node.kind === "exit" && !inFortGraph(at.x, at.z, 0)) throw new Error(`${node.id} left the fort floor`);
  }
  for (const poi of seatedFortPois()) {
    if (!inFortGraph(poi.x, poi.z, 0)) throw new Error(`${poi.id} left the fort floor`);
    const raw = fortWorld(poi.gx, poi.gy);
    if (Math.hypot(poi.x - raw.x, poi.z - raw.z) > SEAT_REACH) throw new Error(`${poi.id} clamped too far`);
  }
  const exits = FORT_GRAPH.nodes.filter((node) => node.kind === "exit");
  const seen = new Set<string>();
  const queue: { x: number; z: number }[] = [];
  const zin = seatedFortPois().find((poi) => poi.id === "zone_in_default");
  if (!zin) throw new Error("fort zone-in");
  const start = { x: zin.x, z: zin.z };
  queue.push(start);
  seen.add(`${Math.round(start.x / 3)}:${Math.round(start.z / 3)}`);
  for (let i = 0; i < queue.length; i++) {
    const { x, z } = queue[i];
    for (const [dx, dz] of [[3, 0], [-3, 0], [0, 3], [0, -3], [3, 3], [3, -3], [-3, 3], [-3, -3]] as const) {
      const nx = x + dx;
      const nz = z + dz;
      const key = `${Math.round(nx / 3)}:${Math.round(nz / 3)}`;
      if (seen.has(key) || !inFortGraph(nx, nz, 0)) continue;
      seen.add(key);
      queue.push({ x: nx, z: nz });
    }
  }
  for (const exit of exits) {
    const at = fortWorld(exit.gx, exit.gy);
    if (!queue.some((p) => Math.hypot(p.x - at.x, p.z - at.z) < 5)) throw new Error(`${exit.id} is cut off`);
  }
}

export function assertYughott(): void {
  for (const map of [1, 2] as const) {
    const graph = YUGHOTT_GRAPHS[map];
    reachable(graph);
    for (const node of graph.nodes) {
      if (node.kind !== "exit") continue;
      const at = yugWorld(node.gx, node.gy, map);
      if (!inYughottGraph(at.x, at.z, 0, map)) throw new Error(`${node.id} left yughott ${map}`);
    }
    const exits = graph.nodes.filter((node) => node.kind === "exit");
    const seen = new Set<string>();
    const queue: { x: number; z: number }[] = [];
    const zin = graph.pois.find((poi) => poi.id === "zone_in_default");
    const start = zin ? yugWorld(zin.gx, zin.gy, map) : yugWorld(exits[0].gx, exits[0].gy, map);
    queue.push(start);
    seen.add(`${Math.round(start.x / 3)}:${Math.round(start.z / 3)}`);
    for (let i = 0; i < queue.length; i++) {
      const { x, z } = queue[i];
      for (const [dx, dz] of [[3, 0], [-3, 0], [0, 3], [0, -3], [3, 3], [3, -3], [-3, 3], [-3, -3]] as const) {
        const nx = x + dx;
        const nz = z + dz;
        const key = `${Math.round(nx / 3)}:${Math.round(nz / 3)}`;
        if (seen.has(key) || !inYughottGraph(nx, nz, 0, map)) continue;
        seen.add(key);
        queue.push({ x: nx, z: nz });
      }
    }
    for (const exit of exits) {
      const at = yugWorld(exit.gx, exit.gy, map);
      if (!queue.some((p) => Math.hypot(p.x - at.x, p.z - at.z) < 5)) throw new Error(`${exit.id} is cut off`);
    }
  }
  for (const poi of seatedYughottPois()) {
    if (!inYughottGraph(poi.x, poi.z, 0, poi.map)) throw new Error(`${poi.id} left the grotto floor`);
    const raw = yugWorld(poi.gx, poi.gy, poi.map ?? 1);
    if (Math.hypot(poi.x - raw.x, poi.z - raw.z) > SEAT_REACH) throw new Error(`${poi.id} clamped too far`);
  }
}
