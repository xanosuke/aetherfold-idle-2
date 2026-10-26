/**
 * Fort Ghelsba and Yughott Grotto heightfields.
 * Walkable floor comes from the traced graphs. Levels become terraces
 * (low 0, mid 2, high 4, top 6). The mesh is baked by scripts/bake-orc-fields.mjs.
 * Runtime only bilinear-reads those arrays.
 */
import {
  FORT_CELL,
  FORT_GRAPH,
  clampFortGraph,
  fortClearance,
  gridToWorld as fortWorld,
  inFortGraph,
} from "./fort-graph";
import {
  YUGHOTT_CELL,
  YUGHOTT_GRAPHS,
  clampYughottGraph,
  gridToWorld as yugWorld,
  inYughottGraph,
  yughottClearance,
  type YughottMap,
} from "./yughott-graph";
import { FORT_FIELD, YUG1_FIELD, YUG2_FIELD } from "./orc-fields.generated.ts";
import { claimsDraw, decodeField, fullyDrawn, mixFloorY, readFloorY, sampleTrace, type OrcField, type TraceSample } from "./orc-field-read";

const fortField = decodeField("fort", FORT_FIELD);
const yug1Field = decodeField("yug1", YUG1_FIELD);
const yug2Field = decodeField("yug2", YUG2_FIELD);

export type { TraceSample };

export function fortTerrainSample(x: number, z: number): TraceSample | null {
  return sampleTrace(fortField, x, z);
}

export function yughottFloorQuad(x: number, z: number, map: YughottMap): boolean {
  return fullyDrawn(map === 1 ? yug1Field : yug2Field, x, z);
}

/** Walkable terrace. Null on the rim, where the heightfield rises into a wall. */
export function yughottFloorY(x: number, z: number, map: YughottMap): number | null {
  return readFloorY(map === 1 ? yug1Field : yug2Field, x, z);
}

export function yughottTerrainSample(x: number, z: number, map: YughottMap): TraceSample | null {
  return sampleTrace(map === 1 ? yug1Field : yug2Field, x, z);
}

function drawnFields(x: number, z: number): OrcField[] {
  const hits: OrcField[] = [];
  if (sampleTrace(fortField, x, z)) hits.push(fortField);
  if (sampleTrace(yug1Field, x, z)) hits.push(yug1Field);
  if (sampleTrace(yug2Field, x, z)) hits.push(yug2Field);
  return hits;
}

function pickField(hits: OrcField[], x: number, z: number): OrcField {
  if (hits.length < 2) return hits[0];
  if (hits.includes(fortField) && inFortGraph(x, z, 0)) return fortField;
  if (hits.includes(yug1Field) && inYughottGraph(x, z, 0, 1)) return yug1Field;
  if (hits.includes(yug2Field) && inYughottGraph(x, z, 0, 2)) return yug2Field;
  return hits[0];
}

/** Feet height. Never under the drawn mesh, and never the bare 0 fallback while a field is drawn. */
export function traceFloorY(x: number, z: number): number {
  const hits = drawnFields(x, z);
  if (!hits.length) return 0;
  const field = pickField(hits, x, z);
  const terrace = mixFloorY(field, x, z) ?? 0;
  const mesh = sampleTrace(field, x, z);
  return Math.max(terrace, mesh ? mesh.y : 0);
}

/** Outpost mesh should not pave the grotto. Both cave masks, one lookup each. */
export function yughottClaimsMesh(x: number, z: number): boolean {
  return claimsDraw(yug1Field, x, z) || claimsDraw(yug2Field, x, z);
}

export function traceMeshFields(): OrcField[] {
  return [fortField, yug1Field, yug2Field];
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
let liftCache: { x: number; z: number; y0: number; y1: number } | null = null;
export function fortLift() {
  if (liftCache) return liftCache;
  const at = fortNode("lift_h7");
  const low = fortNode("room_28w");
  const high = fortNode("area_52n");
  liftCache = {
    x: at.x,
    z: at.z,
    y0: traceFloorY(low.x, low.z),
    y1: traceFloorY(high.x, high.z),
  };
  return liftCache;
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
  assertFortContrast();
}

/** Mean floor luminance minus mean cliff-face luminance. Tops are not faces. */
export function assertFortContrast(): void {
  const w = fortField.nX + 1;
  const h = fortField.nZ + 1;
  let floorN = 0;
  let floorL = 0;
  let wallN = 0;
  let wallL = 0;
  for (let j = 0; j < h; j++) {
    for (let i = 0; i < w; i++) {
      const idx = j * w + i;
      if (!fortField.draw[idx]) continue;
      const r = fortField.rgb[idx * 3];
      const g = fortField.rgb[idx * 3 + 1];
      const b = fortField.rgb[idx * 3 + 2];
      const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
      if (fortField.floor[idx]) {
        floorN += 1;
        floorL += lum;
      } else if (fortField.ys[idx] - fortField.floorY[idx] <= 4.5) {
        wallN += 1;
        wallL += lum;
      }
    }
  }
  if (floorN < 50 || wallN < 50) throw new Error(`fort contrast samples floor ${floorN} wall ${wallN}`);
  const delta = floorL / floorN - wallL / wallN;
  if (delta < 0.12) throw new Error(`fort contrast ${delta.toFixed(3)} floor ${(floorL / floorN).toFixed(3)} wall ${(wallL / wallN).toFixed(3)}`);
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

function mulberry(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function assertFoot(name: string, x: number, z: number, mesh: TraceSample | null) {
  const foot = traceFloorY(x, z);
  if (!mesh) throw new Error(`${name} off mesh ${x.toFixed(1)},${z.toFixed(1)}`);
  if (mesh.y - foot > 0.05) throw new Error(`${name} sink mesh ${mesh.y.toFixed(2)} foot ${foot.toFixed(2)} at ${x.toFixed(1)},${z.toFixed(1)}`);
  if (foot === 0 && mesh.y > 0.5) throw new Error(`${name} zero foot under ${mesh.y.toFixed(2)} at ${x.toFixed(1)},${z.toFixed(1)}`);
}

function walkGraph(
  name: string,
  graph: { edges: { id: string; width?: number; pts: [number, number][] }[] },
  world: (gx: number, gy: number) => { x: number; z: number },
  inside: (x: number, z: number) => boolean,
  meshAt: (x: number, z: number) => TraceSample | null,
  cell: number,
  seed: number,
) {
  for (const edge of graph.edges) {
    const pts = edge.pts.map(([gx, gy]) => world(gx, gy));
    for (let i = 0; i + 1 < pts.length; i++) {
      const a = pts[i];
      const b = pts[i + 1];
      const len = Math.hypot(b.x - a.x, b.z - a.z);
      const steps = Math.max(1, Math.ceil(len / 2));
      for (let s = 0; s <= steps; s++) {
        const t = s / steps;
        const x = a.x + (b.x - a.x) * t;
        const z = a.z + (b.z - a.z) * t;
        assertFoot(`${name} ${edge.id}`, x, z, meshAt(x, z));
      }
    }
  }
  const rnd = mulberry(seed);
  let got = 0;
  let tries = 0;
  const edges = graph.edges;
  while (got < 20000 && tries < 500000) {
    tries++;
    const edge = edges[(rnd() * edges.length) | 0];
    if (edge.pts.length < 2) continue;
    const seg = (rnd() * (edge.pts.length - 1)) | 0;
    const a = world(edge.pts[seg][0], edge.pts[seg][1]);
    const b = world(edge.pts[seg + 1][0], edge.pts[seg + 1][1]);
    const t = rnd();
    const x = a.x + (b.x - a.x) * t;
    const z = a.z + (b.z - a.z) * t;
    const dx = b.x - a.x;
    const dz = b.z - a.z;
    const len = Math.hypot(dx, dz) || 1;
    const half = ((edge.width ?? 0.12) * cell) / 2;
    const off = (rnd() * 2 - 1) * half * 0.92;
    const px = x + (-dz / len) * off;
    const pz = z + (dx / len) * off;
    if (!inside(px, pz)) continue;
    assertFoot(`${name} sample`, px, pz, meshAt(px, pz));
    got++;
  }
  if (got < 20000) throw new Error(`${name} feet samples ${got}`);
}

/** 20k floor points per graph, plus every edge. Feet stay on the mesh. */
export function assertTraceFeet(): void {
  const sink = { x: -515.9, z: 612.3 };
  assertFoot("kupipi", sink.x, sink.z, yughottTerrainSample(sink.x, sink.z, 1));
  walkGraph("fort", FORT_GRAPH, fortWorld, (x, z) => inFortGraph(x, z, 0), (x, z) => fortTerrainSample(x, z), FORT_CELL, 5);
  walkGraph("yug1", YUGHOTT_GRAPHS[1], (gx, gy) => yugWorld(gx, gy, 1), (x, z) => inYughottGraph(x, z, 0, 1), (x, z) => yughottTerrainSample(x, z, 1), YUGHOTT_CELL, 6);
  walkGraph("yug2", YUGHOTT_GRAPHS[2], (gx, gy) => yugWorld(gx, gy, 2), (x, z) => inYughottGraph(x, z, 0, 2), (x, z) => yughottTerrainSample(x, z, 2), YUGHOTT_CELL, 7);
}
