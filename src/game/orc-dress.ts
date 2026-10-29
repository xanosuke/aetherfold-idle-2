/**
 * Fort Ghelsba war camp and Yughott grotto dressing.
 * Props sit on traceFloorY (the caller lifts by the piece position) and stay
 * off path centrelines. Graph files are not edited.
 */
import {
  FORT_CELL,
  FORT_GRAPH,
  FORT_X,
  FORT_Z,
  buildFortMask,
  fortGridSquare,
  gridToWorld as fortWorld,
  inFortGraph,
  worldToGrid,
} from "./fort-graph";
import {
  YUGHOTT_CELL,
  YUGHOTT_GRAPHS,
  YUGHOTT_ORIGINS,
  buildYughottMask,
  clampYughottGraph,
  gridToWorld as yugWorld,
  inYughottGraph,
  yughottMapAt,
  type YughottMap,
} from "./yughott-graph";
import { retreatYughott, seatedFortPois, seatedYughottPois, traceFloorY, fortNode } from "./orc-height";

type Add = (color: number, w: number, h: number, d: number, x: number, y: number, z: number, yaw?: number, pitch?: number) => void;
type Solid = { minX: number; maxX: number; minZ: number; maxZ: number };
type V2 = { x: number; z: number };
type Seg = { ax: number; az: number; bx: number; bz: number };

export type CampProp = {
  id: string;
  square: string;
  zone: "fort" | "yughott";
  map?: YughottMap;
  x: number;
  z: number;
  h: number;
  localBase: number;
};

export type OrcMark = { kind: "pool" | "shaft" | "fall"; x: number; z: number; y: number; r?: number; yaw?: number };

const WOOD = 0x463e37;
const RED = 0x8a2a20;
const HIDE = 0x5a4a3a;
const BANNER = 0x8a7a5e;
const BLACK = 0x32312b;
const MEAT = 0xa8502a;
const BASKET = 0xa08050;
const SKULL = 0xd8d0c0;
const ROCK = 0x413933;
const CLAY = 0x8a6244;
const PLANKS = 0x5c4634;

export const ORC_LIGHT_BUDGET = 8;

let props: CampProp[] = [];
let marks: OrcMark[] = [];
let flames: V2[] = [];
let drums: V2[] = [];
let current: CampProp | null = null;

export function campProps(): readonly CampProp[] {
  return props;
}
export function orcDressMarks(): readonly OrcMark[] {
  return marks;
}
export function fortFlames(): readonly V2[] {
  return flames;
}
export function yughottDrums(): readonly V2[] {
  return drums;
}

type Hooks = {
  dome: (add: Add, x: number, z: number, lift: number, hide: number) => void;
  tripod: (add: Add, x: number, z: number) => void;
  dead: (add: Add, x: number, z: number) => void;
  emblem: (add: Add, x: number, y: number, z: number, s: number) => void;
  rope: (add: Add, x0: number, z0: number, x1: number, z1: number, y: number, dip: number) => void;
  crystal: (add: Add, x: number, z: number) => void;
};

type Zone = {
  name: "fort" | "yughott";
  map?: YughottMap;
  originX: number;
  originZ: number;
  cell: number;
  segs: Seg[];
  samples: V2[];
  blocked: (x: number, z: number, hx: number, hz: number) => boolean;
  inside: (x: number, z: number) => boolean;
  real: (x: number, z: number) => boolean;
  square: (x: number, z: number) => string;
  nodes: { grid: string; x: number; z: number }[];
};

function hash(x: number, z: number) {
  const n = Math.sin(x * 12.9898 + z * 78.233) * 43758.5453;
  return n - Math.floor(n);
}

function segsOf(edges: { pts: [number, number][] }[], world: (gx: number, gy: number) => V2): Seg[] {
  const out: Seg[] = [];
  for (const edge of edges) {
    for (let i = 0; i + 1 < edge.pts.length; i++) {
      const a = world(edge.pts[i][0], edge.pts[i][1]);
      const b = world(edge.pts[i + 1][0], edge.pts[i + 1][1]);
      out.push({ ax: a.x, az: a.z, bx: b.x, bz: b.z });
    }
  }
  return out;
}

function samplesOf(edges: { id: string; pts: [number, number][] }[], world: (gx: number, gy: number) => V2, inside: (x: number, z: number) => boolean) {
  const pts: V2[] = [];
  for (const edge of edges) {
    for (let i = 0; i + 1 < edge.pts.length; i++) {
      const a = world(edge.pts[i][0], edge.pts[i][1]);
      const b = world(edge.pts[i + 1][0], edge.pts[i + 1][1]);
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
        for (const off of [0, 2, -2]) {
          const x = px + nx * off;
          const z = pz + nz * off;
          if (inside(x, z)) pts.push({ x, z });
        }
      }
    }
  }
  return pts;
}

function indexSamples(samples: V2[]) {
  const buckets = new Map<string, V2[]>();
  const key = (x: number, z: number) => `${Math.floor(x / 4)}:${Math.floor(z / 4)}`;
  for (const p of samples) {
    const k = key(p.x, p.z);
    const list = buckets.get(k);
    if (list) list.push(p);
    else buckets.set(k, [p]);
  }
  return (x: number, z: number, hx: number, hz: number) => {
    const pad = 0.36;
    const i0 = Math.floor((x - hx - pad) / 4);
    const i1 = Math.floor((x + hx + pad) / 4);
    const j0 = Math.floor((z - hz - pad) / 4);
    const j1 = Math.floor((z + hz + pad) / 4);
    for (let i = i0; i <= i1; i++) {
      for (let j = j0; j <= j1; j++) {
        const list = buckets.get(`${i}:${j}`);
        if (!list) continue;
        for (const p of list) {
          if (Math.abs(p.x - x) < hx + pad && Math.abs(p.z - z) < hz + pad) return true;
        }
      }
    }
    return false;
  };
}

function nearest(segs: Seg[], x: number, z: number) {
  let best = Infinity;
  let qx = x;
  let qz = z;
  let tx = 1;
  let tz = 0;
  for (const s of segs) {
    const dx = s.bx - s.ax;
    const dz = s.bz - s.az;
    const len2 = dx * dx + dz * dz || 1;
    const t = Math.max(0, Math.min(1, ((x - s.ax) * dx + (z - s.az) * dz) / len2));
    const px = s.ax + dx * t;
    const pz = s.az + dz * t;
    const d = Math.hypot(x - px, z - pz);
    if (d < best) {
      best = d;
      qx = px;
      qz = pz;
      const len = Math.sqrt(len2);
      tx = dx / len;
      tz = dz / len;
    }
  }
  return { d: best, x: qx, z: qz, tx, tz };
}

function isSouth(segs: Seg[], x: number, z: number) {
  const q = nearest(segs, x, z);
  const dx = x - q.x;
  const dz = z - q.z;
  return dz > 0.75 && dz > Math.abs(dx) * 0.4;
}

function cameraBand(map: YughottMap, x: number, z: number) {
  for (let d = 2; d <= 10; d += 2) {
    if (inYughottGraph(x, z - d, 0, map)) return true;
    if (inYughottGraph(x - d * 0.5, z - d, 0, map)) return true;
    if (inYughottGraph(x + d * 0.5, z - d, 0, map)) return true;
  }
  return false;
}

export type CaveBit = {
  kind: string;
  shape: "box" | "cone";
  color: number;
  sx: number;
  sy: number;
  sz: number;
  x: number;
  y: number;
  z: number;
  yaw: number;
};

const caveBits: CaveBit[] = [];
let cavePaint = "rubble";

function caveBox(color: number, w: number, h: number, d: number, x: number, y: number, z: number, yaw = 0) {
  caveBits.push({ kind: cavePaint, shape: "box", color, sx: w, sy: h, sz: d, x, y, z, yaw });
}

export function takeCaveBits(): CaveBit[] {
  const out = caveBits.slice();
  caveBits.length = 0;
  return out;
}

function crossSide(segs: Seg[], x: number, z: number) {
  const q = nearest(segs, x, z);
  return (x - q.x) * q.tz - (z - q.z) * q.tx;
}

type Seek = {
  id: string;
  square: string;
  hx: number;
  hz: number;
  h: number;
  side?: 1 | -1;
  away?: V2;
  awayD?: number;
  near?: V2;
  nearMin?: number;
  nearMax?: number;
  minY?: number;
};

function cellSeeds(zone: Zone, square: string): V2[] {
  const col = square.charCodeAt(0) - 65;
  const row = Number(square.slice(2)) - 1;
  const out: V2[] = [];
  for (const node of zone.nodes) if (node.grid === square) out.push(node);
  out.push({ x: zone.originX + (col + 0.5) * zone.cell, z: zone.originZ + (row + 0.5) * zone.cell });
  for (const [a, b] of [[0.32, 0.32], [0.7, 0.3], [0.3, 0.7], [0.68, 0.68]] as const) {
    out.push({ x: zone.originX + (col + a) * zone.cell, z: zone.originZ + (row + b) * zone.cell });
  }
  return out;
}

const occupied: { x: number; z: number; r: number }[] = [];

function fits(zone: Zone, spec: Seek, avoid: { x: number; z: number; r: number }[], x: number, z: number) {
  if (!zone.inside(x, z)) return false;
  if (zone.square(x, z) !== spec.square) return false;
  const path = nearest(zone.segs, x, z);
  if (path.d < 1.5) return false;
  if (spec.h > 3 && isSouth(zone.segs, x, z)) return false;
  if (spec.side && spec.side * crossSide(zone.segs, x, z) < 0.9) return false;
  if (spec.away && Math.hypot(x - spec.away.x, z - spec.away.z) < (spec.awayD ?? 6)) return false;
  if (spec.near) {
    const d = Math.hypot(x - spec.near.x, z - spec.near.z);
    if (d < (spec.nearMin ?? 0) || d > (spec.nearMax ?? 99)) return false;
  }
  if (spec.minY != null && traceFloorY(x, z) < spec.minY) return false;
  if (zone.blocked(x, z, spec.hx, spec.hz)) return false;
  if (avoid.some((p) => Math.hypot(p.x - x, p.z - z) < p.r + Math.max(spec.hx, spec.hz) * 0.35)) return false;
  if (occupied.some((p) => Math.hypot(p.x - x, p.z - z) < p.r + Math.max(spec.hx, spec.hz) + 0.25)) return false;
  return zone.real(x, z);
}

function claim(spec: Seek, x: number, z: number) {
  occupied.push({ x, z, r: Math.max(spec.hx, spec.hz, 0.55) });
  return { x, z };
}

function seek(zone: Zone, spec: Seek, avoid: { x: number; z: number; r: number }[]): V2 | null {
  const seeds = spec.near ? [spec.near, ...cellSeeds(zone, spec.square).slice(0, 3)] : cellSeeds(zone, spec.square);
  for (const seed of seeds) {
    for (let ring = 0; ring <= 36; ring += 1.15) {
      const steps = ring < 0.2 ? 1 : Math.ceil(ring * 2);
      for (let k = 0; k < steps; k++) {
        const ang = -Math.PI / 2 + (k / steps) * Math.PI * 2;
        let x = seed.x + Math.cos(ang) * ring;
        let z = seed.z + Math.sin(ang) * ring;
        if (!zone.inside(x, z)) {
          const bx = x - Math.cos(ang) * 0.85;
          const bz = z - Math.sin(ang) * 0.85;
          if (!zone.inside(bx, bz)) continue;
          x = bx;
          z = bz;
        }
        if (fits(zone, spec, avoid, x, z)) return claim(spec, x, z);
      }
    }
  }
  return null;
}

function must(zone: Zone, spec: Seek, avoid: { x: number; z: number; r: number }[]) {
  const relaxed = seek(zone, spec, avoid) ?? seek(zone, { ...spec, side: undefined }, avoid);
  if (!relaxed) throw new Error(`no seat ${spec.id} ${spec.square}`);
  return relaxed;
}

function begin(zone: Zone, id: string, square: string, at: V2, h: number, draw: Add, fn: (add: Add) => void) {
  const prop: CampProp = { id, square, zone: zone.name, map: zone.map, x: at.x, z: at.z, h, localBase: Infinity };
  props.push(prop);
  current = prop;
  fn(draw);
  current = null;
  if (!Number.isFinite(prop.localBase)) prop.localBase = 0;
}

function footBox(add: Add, color: number, w: number, h: number, d: number, x: number, z: number, yaw = 0) {
  add(color, w, h, d, x, h / 2, z, yaw);
}

function collide(colliders: Solid[], x: number, z: number, hx: number, hz: number) {
  colliders.push({ minX: x - hx, maxX: x + hx, minZ: z - hz, maxZ: z + hz });
}

function onSpot(zone: Zone, anchor: V2, x: number, z: number) {
  if (Math.hypot(x - anchor.x, z - anchor.z) < 0.35) return true;
  return zone.inside(x, z);
}

function makeZone(
  name: "fort" | "yughott",
  map: YughottMap | undefined,
  originX: number,
  originZ: number,
  cell: number,
  edges: { id: string; pts: [number, number][] }[],
  world: (gx: number, gy: number) => V2,
  inside: (x: number, z: number) => boolean,
  real: (x: number, z: number) => boolean,
  square: (x: number, z: number) => string,
  nodes: { grid: string; gx: number; gy: number }[],
): Zone {
  const samples = samplesOf(edges, world, real);
  return {
    name,
    map,
    originX,
    originZ,
    cell,
    segs: segsOf(edges, world),
    samples,
    blocked: indexSamples(samples),
    inside,
    real,
    square,
    nodes: nodes.map((n) => ({ grid: n.grid, ...world(n.gx, n.gy) })),
  };
}

function maskTest(originX: number, originZ: number, cell: number, mask: { n: number; data: Uint8Array }) {
  const res = mask.n / 12;
  const n = mask.n;
  const data = mask.data;
  return (x: number, z: number) => {
    const i = Math.floor(((x - originX) / cell) * res);
    const j = Math.floor(((z - originZ) / cell) * res);
    if (i < 0 || j < 0 || i >= n || j >= n) return false;
    return data[j * n + i] === 1;
  };
}

let fortFast: ((x: number, z: number) => boolean) | null = null;
const yugFast: Partial<Record<YughottMap, (x: number, z: number) => boolean>> = {};
function fortMaskAt(x: number, z: number) {
  if (!fortFast) fortFast = maskTest(FORT_X, FORT_Z, FORT_CELL, buildFortMask(16));
  return fortFast(x, z);
}
function yugMaskAt(map: YughottMap, x: number, z: number) {
  let fn = yugFast[map];
  if (!fn) {
    const origin = YUGHOTT_ORIGINS[map];
    fn = maskTest(origin.x, origin.z, YUGHOTT_CELL, buildYughottMask(map, 16));
    yugFast[map] = fn;
  }
  return fn(x, z);
}

const fortZone = makeZone(
  "fort",
  undefined,
  FORT_X,
  FORT_Z,
  FORT_CELL,
  FORT_GRAPH.edges,
  fortWorld,
  fortMaskAt,
  (x, z) => inFortGraph(x, z, 0),
  (x, z) => {
    const g = worldToGrid(x, z);
    return fortGridSquare(g.gx, g.gy);
  },
  FORT_GRAPH.nodes,
);

function yugZone(map: YughottMap): Zone {
  const graph = YUGHOTT_GRAPHS[map];
  const origin = YUGHOTT_ORIGINS[map];
  return makeZone(
    "yughott",
    map,
    origin.x,
    origin.z,
    YUGHOTT_CELL,
    graph.edges,
    (gx, gy) => yugWorld(gx, gy, map),
    (x, z) => yugMaskAt(map, x, z),
    (x, z) => inYughottGraph(x, z, 0, map),
    (x, z) => {
      const gx = (x - origin.x) / YUGHOTT_CELL;
      const gy = (z - origin.z) / YUGHOTT_CELL;
      const col = Math.floor(gx);
      const row = Math.floor(gy);
      if (col < 0 || row < 0 || col > 14 || row > 14) return "?";
      return `${"ABCDEFGHIJKLMNO"[col]}-${row + 1}`;
    },
    graph.nodes,
  );
}

function spike(add: Add, x: number, z: number, h: number, w = 0.42) {
  footBox(add, WOOD, w, h, w * 0.9, x, z);
  add(WOOD, w * 0.32, 0.28, w * 0.32, x, h + 0.08, z);
}

function warTower(add: Add, zone: Zone, colliders: Solid[], x: number, z: number, h: number, pagoda: boolean) {
  const base = 6;
  const top = 4.5;
  collide(colliders, x, z, base / 2, base / 2);
  footBox(add, WOOD, base, h * 0.42, base, x, z);
  add(WOOD, (base + top) / 2, h * 0.38, (base + top) / 2, x, h * 0.58, z);
  add(WOOD, top, h * 0.28, top, x, h * 0.84, z);
  const flare = top + 2.4;
  add(0x3e3632, flare, 0.26, flare, x, h + 0.12, z);
  const half = flare / 2;
  for (let i = 0; i < 20; i++) {
    const a = (i / 20) * Math.PI * 2 + hash(x + i, z) * 0.2;
    const jag = 0.12 + hash(z + i * 1.7, x) * 0.55;
    const len = 0.4 + hash(x * 0.3 + i, z) * 0.95;
    const px = x + Math.cos(a) * (half + jag * 0.45);
    const pz = z + Math.sin(a) * (half + jag * 0.45);
    add(i % 3 === 0 ? 0x4a3c32 : HIDE, 0.16 + (i % 2) * 0.08, len, 0.05, px, h - len * 0.28, pz, a);
  }
  if (pagoda) {
    add(WOOD, top + 0.4, 0.7, top + 0.4, x, h + 0.45, z);
    add(WOOD, 2.2, 0.45, 2.2, x, h + 0.95, z);
  }
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const px = x + Math.cos(a) * (top * 0.42);
    const pz = z + Math.sin(a) * (top * 0.42);
    if (!onSpot(zone, { x, z }, px, pz)) continue;
    add(HIDE, 0.16, 1.15, 0.05, px, h * 0.72, pz, a);
  }
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + 0.4;
    add(WOOD, 1.4, 0.1, 0.1, x, h * 0.9, z, a, 1.15);
  }
  for (let i = 0; i < 5; i++) add(WOOD, 0.08, 0.55, 0.08, x - 0.8 + i * 0.4, h + 0.4, z);
  add(BANNER, 0.9, 1.15, 0.06, x, h * 0.62, z + 0.4);
  add(0x2a2420, 0.55, 0.55, 0.08, x, h * 0.62, z + 0.48);
  add(BANNER, 0.7, 0.16, 0.06, x, h * 0.62, z + 0.52);
}

function hideDome(hooks: Hooks, add: Add, x: number, z: number, lift: number) {
  hooks.dome(add, x, z, lift, 0x655447);
}

function stiltHut(hooks: Hooks, add: Add, colliders: Solid[], x: number, z: number) {
  const deck = 4.5;
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * Math.PI * 2;
    const px = x + Math.cos(a) * 1.7;
    const pz = z + Math.sin(a) * 1.7;
    footBox(add, BLACK, 0.18, 3, 0.18, px, pz);
  }
  add(PLANKS, deck, 0.16, deck * 0.86, x, 3.08, z);
  collide(colliders, x, z, 1.9, 1.7);
  hideDome(hooks, add, x, z, 3.16);
}

function lowHut(hooks: Hooks, add: Add, colliders: Solid[], x: number, z: number) {
  for (const [dx, dz] of [[-1.55, -1.25], [1.55, -1.25], [-1.55, 1.25], [1.55, 1.25]] as const) {
    footBox(add, BLACK, 0.14, 0.3, 0.14, x + dx, z + dz);
  }
  add(PLANKS, 4.6, 0.12, 4.1, x, 0.36, z);
  add(PLANKS, 1.35, 0.08, 2.1, x, 0.18, z + 2.35);
  collide(colliders, x, z, 1.7, 1.5);
  hideDome(hooks, add, x, z, 0.42);
  add(BASKET, 0.55, 0.42, 0.48, x - 1.3, 0.78, z - 1.1);
  add(BASKET, 0.48, 0.36, 0.42, x - 0.7, 0.74, z - 1.35);
}

function warCatapult(add: Add, colliders: Solid[], x: number, z: number, big: boolean, south: boolean, keel = false) {
  const s = big ? 1.32 : 1;
  const yaw = south ? 0 : Math.PI;
  // The I-10 lip and the J-9 heights are only a few yalms north of the path, so the
  // throwing arm stays visual and the collider is a keel that clears the ±2 walk samples.
  if (keel) collide(colliders, x, z, big ? 1.15 : 1.5, big ? 0.46 : 0.36);
  else collide(colliders, x, z, 1.7 * s, 1.15 * s);
  footBox(add, PLANKS, 3.2 * s, 0.7, 2.1 * s, x, z);
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) add(PLANKS, 0.72 * s, 0.72 * s, 0.22, x + sx * 1.35 * s, 0.45, z + sz * 0.85 * s, yaw);
  }
  add(RED, 0.28 * s, 3.5 * s, 0.28 * s, x - 0.7 * s, 1.9 * s, z - 0.15 * s);
  add(RED, 0.28 * s, 3.5 * s, 0.28 * s, x + 0.7 * s, 1.9 * s, z - 0.15 * s);
  add(RED, 1.7 * s, 0.22 * s, 0.22 * s, x, 3.4 * s, z - 0.15 * s);
  add(0x1c1916, 0.45 * s, 0.45 * s, 0.08, x, 2.4 * s, z + 0.05);
  add(RED, 0.28 * s, 0.28 * s, 0.08, x, 2.4 * s, z + 0.1);
  add(WOOD, 0.22 * s, 0.22 * s, 5 * s, x, 2.6 * s, z + (south ? 1.1 : -1.1) * s, yaw, south ? -0.7 : 0.7);
  add(ROCK, 0.85 * s, 0.7 * s, 0.85 * s, x, 1.55 * s, z + (south ? 2.3 : -2.3) * s);
  add(CLAY, 0.38, 0.48, 0.38, x - 1.35 * s, 0.85, z + 0.4);
  add(CLAY, 0.34, 0.42, 0.34, x + 1.4 * s, 0.8, z - 0.2);
}

function bannerGallows(add: Add, hooks: Hooks, colliders: Solid[], x: number, z: number) {
  collide(colliders, x, z, 0.35, 1.3);
  footBox(add, BLACK, 0.2, 4, 0.2, x, z - 1.1);
  footBox(add, BLACK, 0.2, 4, 0.2, x, z + 1.1);
  add(WOOD, 0.16, 0.16, 2.5, x, 3.9, z);
  add(BANNER, 0.08, 1.3, 0.85, x, 3.1, z);
  hooks.emblem(add, x + 0.1, 3.1, z, 0.45);
}

function campPosts(add: Add, hooks: Hooks, zone: Zone, colliders: Solid[], square: string, avoid: { x: number; z: number; r: number }[]) {
  const spots: V2[] = [];
  const seeds = cellSeeds(zone, square).slice(0, 4);
  for (const seed of seeds) {
    for (let i = 0; i < 10; i++) {
      const dist = 6.5 + (i % 3) * 1.4;
      const hit = seek(zone, { id: `post-${square}-${i}`, square, hx: 0.28, hz: 0.28, h: 3.5, near: seed, nearMin: dist - 1.2, nearMax: dist + 1.2 }, avoid);
      if (!hit) continue;
      if (spots.some((p) => Math.hypot(p.x - hit.x, p.z - hit.z) < 3.2)) {
        occupied.pop();
        continue;
      }
      spots.push(hit);
      if (spots.length >= 7) break;
    }
    if (spots.length >= 5) break;
  }
  spots.sort((a, b) => Math.atan2(a.z - spots[0].z, a.x - spots[0].x) - Math.atan2(b.z - spots[0].z, b.x - spots[0].x));
  for (const p of spots) {
    begin(zone, `post-${square}`, square, p, 3.5, add, (draw) => {
      footBox(draw, BLACK, 0.16, 3.5, 0.16, p.x, p.z);
      add(BLACK, 0.08, 0.28, 0.08, p.x, 3.6, p.z);
      collide(colliders, p.x, p.z, 0.2, 0.2);
    });
  }
  for (let i = 0; i + 1 < spots.length; i++) {
    const a = spots[i];
    const b = spots[i + 1];
    if (Math.hypot(a.x - b.x, a.z - b.z) > 8) continue;
    hooks.rope(add, a.x, a.z, b.x, b.z, 2.6, 0.55);
    const mx = (a.x + b.x) / 2;
    const mz = (a.z + b.z) / 2;
    if (zone.inside(mx, mz)) add(MEAT, 0.28, 0.8, 0.22, mx, 1.7, mz);
  }
  return spots.length;
}

function rimLogs(add: Add, zone: Zone, colliders: Solid[], square: string) {
  let n = 0;
  const seeds = cellSeeds(zone, square).filter((_, i) => i < 6);
  for (const seed of seeds) {
    for (let k = 0; k < 18; k++) {
      const ang = (k / 18) * Math.PI * 2;
      let prev = zone.inside(seed.x, seed.z);
      for (let d = 0.8; d <= 40; d += 0.8) {
        const x = seed.x + Math.cos(ang) * d;
        const z = seed.z + Math.sin(ang) * d;
        const inn = zone.inside(x, z);
        if (prev && !inn) {
          const px = x - Math.cos(ang) * 0.8;
          const pz = z - Math.sin(ang) * 0.8;
          if (zone.square(px, pz) !== square || !zone.inside(px, pz) || !zone.real(px, pz)) break;
          const south = isSouth(zone.segs, px, pz);
          const h = south ? 1.15 : 2.2;
          const path = nearest(zone.segs, px, pz);
          if (path.d < 1.55) break;
          if (zone.blocked(px, pz, 0.3, 0.3)) break;
          if (occupied.some((p) => Math.hypot(p.x - px, p.z - pz) < p.r + 0.5)) break;
          occupied.push({ x: px, z: pz, r: 0.4 });
          begin(zone, `palisade-${square}`, square, { x: px, z: pz }, h, add, (draw) => {
            spike(draw, px, pz, h, 0.4);
            collide(colliders, px, pz, 0.22, 0.22);
          });
          n += 1;
          break;
        }
        prev = inn;
      }
      if (n >= 22) return n;
    }
  }
  return n;
}

function plankRun(add: Add, hooks: Hooks, ax: number, az: number, bx: number, bz: number, y: number) {
  const dx = bx - ax;
  const dz = bz - az;
  const len = Math.hypot(dx, dz);
  if (len < 2.5 || len > 18) return false;
  const yaw = Math.atan2(-dz, dx);
  const n = Math.max(2, Math.round(len / 0.85));
  for (let i = 0; i < n; i++) {
    const t = (i + 0.5) / n;
    add(PLANKS, len / n + 0.05, 0.08, 1.15, ax + dx * t, y, az + dz * t, yaw);
  }
  hooks.rope(add, ax, az, bx, bz, y + 0.85, 0.35);
  return true;
}

function keep(add: Add, hooks: Hooks, zone: Zone, colliders: Solid[], x: number, z: number) {
  collide(colliders, x, z, 6, 4);
  footBox(add, 0x2c2824, 12, 8, 8, x, z);
  add(RED, 12.4, 0.28, 0.35, x, 7.7, z - 4);
  add(RED, 12.4, 0.28, 0.35, x, 7.7, z + 4);
  const door = -1;
  add(0x14110e, 2.2, 3.4, 0.4, x + door * 5.7, 1.8, z);
  for (const sz of [-1.6, 1.6]) {
    const px = x + door * 6.3;
    const pz = z + sz;
    if (!onSpot(zone, { x, z }, px, pz)) continue;
    footBox(add, 0x7a7a74, 0.45, 3.2, 1.3, px, pz);
    hooks.emblem(add, px + door * -0.3, 1.8, pz, 0.4);
  }
  for (const [sx, sz] of [[-3.2, -2.2], [3.2, -2.2], [0, 2.4]] as const) {
    const px = x + sx;
    const pz = z + sz;
    if (!onSpot(zone, { x, z }, px, pz)) continue;
    add(0x241e1c, 0.7, 3.2, 0.7, px, 9.4, pz);
    add(RED, 1.15, 0.18, 1.15, px, 11.05, pz);
    add(RED, 0.45, 0.7, 0.45, px, 11.4, pz);
  }
}

function liftFrame(add: Add, hooks: Hooks, x: number, z: number) {
  const hx = 2.15;
  const hz = 1.65;
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) footBox(add, WOOD, 0.28, 6.2, 0.28, x + sx * hx, z + sz * hz);
  }
  add(PLANKS, 4, 0.16, 3, x, 0.28, z);
  add(WOOD, hx * 2 + 0.5, 0.22, 0.22, x, 6.15, z - hz);
  add(WOOD, hx * 2 + 0.5, 0.22, 0.22, x, 6.15, z + hz);
  add(WOOD, 0.22, 0.22, hz * 2 + 0.5, x - hx, 6.15, z);
  add(WOOD, 0.22, 0.22, hz * 2 + 0.5, x + hx, 6.15, z);
  add(WOOD, 0.18, 0.18, 1.5, x, 6.4, z);
  hooks.rope(add, x - hx, z - hz, x + hx, z + hz, 6.05, 0.55);
}

function rubble(add: Add, x: number, z: number, s: number) {
  footBox(add, 0x4a4650, s, 0.55, s * 0.8, x, z);
  add(0x4a4650, s * 0.62, 0.7, s * 0.5, x + 0.2, 0.7, z - 0.15);
  add(0x3e3a44, s * 0.35, 0.4, s * 0.3, x - s * 0.2, 0.35, z + 0.2);
}

function totem(add: Add, colliders: Solid[], x: number, z: number, h: number, rust: boolean) {
  const parts = 3 + (hash(x, z) > 0.55 ? 1 : 0);
  collide(colliders, x, z, 0.55, 0.55);
  let y = 0;
  for (let i = 0; i < parts; i++) {
    const w = 1.2 - i * 0.22;
    const hh = h / parts;
    const color = rust && i === parts - 1 ? 0x6a3a22 : i % 2 ? 0x3a3530 : 0x2a2730;
    add(color, w, hh, w * 0.9, x, y + hh / 2, z, hash(x + i, z) * 0.4);
    y += hh * 0.92;
  }
  add(rust ? 0x6a3a22 : 0x3a3530, 0.7, 0.55, 0.62, x, y + 0.2, z);
}

function fireDrum(add: Add, colliders: Solid[], x: number, z: number) {
  collide(colliders, x, z, 0.55, 0.55);
  footBox(add, 0x3a3538, 1, 0.6, 1, x, z);
  add(0x2a241c, 0.7, 0.16, 0.22, x, 0.7, z, 0.4);
  add(0x2a241c, 0.55, 0.14, 0.18, x, 0.78, z, -0.6);
  add(0xffa050, 0.28, 0.8, 0.28, x, 1.15, z);
  add(0xffd0a0, 0.14, 0.45, 0.14, x + 0.08, 1.45, z);
  drums.push({ x, z });
}

function poolDiscs(x: number, z: number, r: number) {
  const y = traceFloorY(x, z);
  marks.push({ kind: "pool", x, z, y, r });
  marks.push({ kind: "pool", x: x + r * 0.35, z: z - r * 0.2, y, r: r * 0.72 });
  marks.push({ kind: "pool", x: x - r * 0.28, z: z + r * 0.32, y, r: r * 0.64 });
}

const SCATTER = ["crate", "barrel", "basket", "stakes", "rack", "bone", "hide", "boulder"] as const;
type ScatterKind = (typeof SCATTER)[number];

function paintScatter(add: Add, colliders: Solid[], x: number, z: number, kind: ScatterKind) {
  const yaw = hash(x, z) * Math.PI;
  if (kind === "crate") {
    footBox(add, 0x6b4e32, 0.85, 0.62, 0.7, x, z, yaw);
    add(0x6b4e32, 0.62, 0.48, 0.55, x + 0.12, 0.82, z - 0.08, yaw + 0.2);
  } else if (kind === "barrel") {
    footBox(add, 0x5a4030, 0.52, 0.68, 0.52, x, z);
    add(0x3e3632, 0.58, 0.08, 0.58, x, 0.7, z);
  } else if (kind === "basket") {
    footBox(add, 0xa08050, 0.5, 0.36, 0.44, x, z, yaw);
  } else if (kind === "stakes") {
    const n = 3 + Math.floor(hash(x + 2, z) * 3);
    for (let i = 0; i < n; i++) {
      const a = yaw + (i / n) * Math.PI * 2;
      add(0x241f1b, 0.07, 1.05, 0.07, x + Math.cos(a) * 0.22, 0.5, z + Math.sin(a) * 0.22, a, 0.55);
    }
  } else if (kind === "rack") {
    footBox(add, WOOD, 0.12, 1.55, 0.12, x - 0.55, z);
    footBox(add, WOOD, 0.12, 1.55, 0.12, x + 0.55, z);
    add(WOOD, 1.25, 0.1, 0.1, x, 1.45, z, yaw);
    for (const sx of [-0.32, 0, 0.32]) add(0x8a8680, 0.08, 0.42, 0.18, x + sx, 1.12, z, yaw);
  } else if (kind === "bone") {
    add(0xe4d4c0, 0.68, 0.14, 0.24, x, 0.1, z, yaw);
    add(0xd2c2ae, 0.42, 0.12, 0.18, x + 0.18, 0.12, z + 0.1, yaw - 0.6);
  } else if (kind === "hide") {
    footBox(add, WOOD, 0.1, 1.55, 0.1, x - 0.48, z);
    footBox(add, WOOD, 0.1, 1.55, 0.1, x + 0.48, z);
    add(0x8a6a4a, 0.86, 1.05, 0.05, x, 0.95, z, yaw);
  } else {
    footBox(add, 0x6a665a, 0.85, 0.48, 0.7, x, z, yaw);
    add(0x6a665a, 0.5, 0.32, 0.42, x + 0.16, 0.48, z - 0.08, yaw);
  }
  collide(colliders, x, z, 0.28, 0.28);
}

function distPointSeg(px: number, pz: number, ax: number, az: number, bx: number, bz: number) {
  const dx = bx - ax;
  const dz = bz - az;
  const len2 = dx * dx + dz * dz || 1;
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (pz - az) * dz) / len2));
  return Math.hypot(px - (ax + dx * t), pz - (az + dz * t));
}

function edgeWalk(edge: { pts: [number, number][] }, world: (gx: number, gy: number) => V2 = fortWorld) {
  const pts = edge.pts.map(([gx, gy]) => world(gx, gy));
  const samples: V2[] = [pts[0]];
  const arc = [0];
  let walked = 0;
  for (let i = 0; i + 1 < pts.length; i++) {
    const a = pts[i];
    const b = pts[i + 1];
    const len = Math.hypot(b.x - a.x, b.z - a.z);
    const steps = Math.max(1, Math.ceil(len / 4));
    for (let s = 1; s <= steps; s++) {
      const t = s / steps;
      samples.push({ x: a.x + (b.x - a.x) * t, z: a.z + (b.z - a.z) * t });
      arc.push(walked + len * t);
    }
    walked += len;
  }
  return { samples, arc, walked };
}

function nearStretch(samples: V2[], i0: number, i1: number, list: readonly V2[]) {
  let n = 0;
  for (const p of list) {
    let best = Infinity;
    for (let k = i0; k < i1; k++) {
      const d = distPointSeg(p.x, p.z, samples[k].x, samples[k].z, samples[k + 1].x, samples[k + 1].z);
      if (d < best) best = d;
      if (best <= 12) break;
    }
    if (best <= 12) n += 1;
  }
  return n;
}

function fillFortDensity(draw: Add, colliders: Solid[], avoid: { x: number; z: number; r: number }[]) {
  const list: V2[] = props.filter((p) => p.zone === "fort").map((p) => ({ x: p.x, z: p.z }));
  let seq = 0;
  const seat = (x: number, z: number, kind: ScatterKind) => {
    const square = fortZone.square(x, z);
    if (!square || square === "?" || square.length < 3) return false;
    const spec: Seek = { id: `scatter-${seq}`, square, hx: 0.32, hz: 0.32, h: 1.7 };
    if (!fits(fortZone, spec, avoid, x, z)) return false;
    const at = claim(spec, x, z);
    seq += 1;
    begin(fortZone, spec.id, square, at, 1.7, draw, (add) => paintScatter(add, colliders, at.x, at.z, kind));
    list.push(at);
    return true;
  };
  for (const edge of FORT_GRAPH.edges) {
    const walked = edgeWalk(edge);
    if (walked.walked <= 22) continue;
    for (let start = 0; start <= walked.walked - 22 + 0.05; start += 4) {
      let i0 = 0;
      while (i0 < walked.arc.length && walked.arc[i0] < start - 0.05) i0 += 1;
      let i1 = i0;
      while (i1 < walked.arc.length && walked.arc[i1] <= start + 22) i1 += 1;
      if (i1 <= i0 + 1) continue;
      let have = nearStretch(walked.samples, i0, i1 - 1, list);
      if (have >= 2) continue;
      const mid = walked.samples[Math.min(walked.samples.length - 1, i0 + Math.floor((i1 - i0) / 2))];
      const path = nearest(fortZone.segs, mid.x, mid.z);
      const nx = -path.tz;
      const nz = path.tx;
      const kind0 = Math.floor(hash(mid.x, mid.z) * SCATTER.length);
      for (const off of [2.95, -2.95, 3.7, -3.7, 5.2, -5.2, 7.4, -7.4]) {
        if (have >= 2) break;
        const kind = SCATTER[(kind0 + have) % SCATTER.length];
        if (seat(mid.x + nx * off, mid.z + nz * off, kind)) have += 1;
      }
      for (let ring = 3.2; ring <= 10 && have < 2; ring += 1.5) {
        const steps = Math.max(8, Math.ceil(ring));
        for (let k = 0; k < steps && have < 2; k++) {
          const ang = hash(mid.z, ring) + (k / steps) * Math.PI * 2;
          const kind = SCATTER[(kind0 + k + have) % SCATTER.length];
          if (seat(mid.x + Math.cos(ang) * ring, mid.z + Math.sin(ang) * ring, kind)) have += 1;
        }
      }
      for (let dx = -12; dx <= 12 && have < 2; dx += 1.15) {
        for (let dz = -12; dz <= 12 && have < 2; dz += 1.15) {
          if (dx * dx + dz * dz > 144) continue;
          const x = mid.x + dx;
          const z = mid.z + dz;
          const kind = SCATTER[Math.floor(hash(x, z) * SCATTER.length)];
          if (seat(x, z, kind)) have += 1;
        }
      }
      if (have < 2) throw new Error(`${edge.id} density ${have} at ${start.toFixed(0)}`);
    }
  }
}

function fortDress(raw: Add, colliders: Solid[], hooks: Hooks, avoid: { x: number; z: number; r: number }[]) {
  const draw: Add = (color, w, h, d, x, y, z, yaw, pitch) => {
    if (current) {
      const bottom = y - h / 2;
      if (bottom < current.localBase) current.localBase = bottom;
    }
    raw(color, w, h, d, x, y, z, yaw, pitch);
  };
  const place = (spec: Seek) => must(fortZone, spec, avoid);
  const towers: { square: string; h: number; id: string; side?: 1 | -1; pagoda?: boolean }[] = [
    { square: "G-6", h: 11, id: "tower-g6" },
    { square: "I-8", h: 12, id: "tower-i8a", side: 1 },
    { square: "I-8", h: 12, id: "tower-i8b", side: -1 },
    { square: "G-9", h: 12, id: "tower-g9" },
    { square: "H-8", h: 11, id: "tower-h8" },
    { square: "J-6", h: 14, id: "tower-j6", pagoda: true },
  ];
  const at: Record<string, V2> = {};
  for (const tower of towers) {
    const spot = place({ id: tower.id, square: tower.square, hx: 3.05, hz: 3.05, h: tower.h, side: tower.side, away: tower.side ? at["tower-i8a"] : undefined, awayD: 8 });
    at[tower.id] = spot;
    begin(fortZone, tower.id, tower.square, spot, tower.h, draw, (add) => warTower(add, fortZone, colliders, spot.x, spot.z, tower.h, !!tower.pagoda));
  }
  const stilts = place({ id: "stilt-g9", square: "G-9", hx: 2.1, hz: 1.9, h: 6.2, near: at["tower-g9"], nearMin: 5.5, nearMax: 18 });
  begin(fortZone, "stilt-g9", "G-9", stilts, 6.2, draw, (add) => {
    stiltHut(hooks, add, colliders, stilts.x, stilts.z);
    plankRun(add, hooks, at["tower-g9"].x, at["tower-g9"].z, stilts.x, stilts.z, 3.15);
  });
  const lows = [
    { id: "low-g9a", square: "G-9" },
    { id: "low-g9b", square: "G-9" },
    { id: "low-h8a", square: "H-8" },
    { id: "low-h8b", square: "H-8" },
    { id: "low-h8c", square: "H-8" },
  ];
  for (const hut of lows) {
    const spot = place({ id: hut.id, square: hut.square, hx: 1.9, hz: 1.7, h: 2.8 });
    begin(fortZone, hut.id, hut.square, spot, 2.8, draw, (add) => lowHut(hooks, add, colliders, spot.x, spot.z));
  }
  const catAvoid = avoid.slice();
  let h10 = 0;
  for (let i = 0; i < 4; i++) {
    const id = `cat-h10-${i}`;
    const spot = seek(fortZone, { id, square: "H-10", hx: 1.85, hz: 1.3, h: 3.6 }, catAvoid);
    if (!spot) break;
    catAvoid.push({ x: spot.x, z: spot.z, r: 6.4 });
    at[id] = spot;
    begin(fortZone, id, "H-10", spot, 3.6, draw, (add) => warCatapult(add, colliders, spot.x, spot.z, false, true));
    h10 += 1;
  }
  if (h10 < 3) throw new Error(`H-10 catapults ${h10}`);
  const big = place({ id: "cat-i10", square: "I-10", hx: 1.2, hz: 0.48, h: 4.7, near: fortWorld(8.44, 9), nearMax: 3 });
  catAvoid.push({ x: big.x, z: big.z, r: 6.4 });
  begin(fortZone, "cat-i10", "I-10", big, 4.7, draw, (add) => warCatapult(add, colliders, big.x, big.z, true, true, true));
  let j9 = 0;
  const j9Spec: Seek = { id: "cat-j9", square: "J-9", hx: 1.55, hz: 0.38, h: 3.6, minY: 3.2 };
  const j9Cands: V2[] = [];
  for (let gx = 9; gx <= 9.42; gx += 0.012) {
    for (let gy = 8; gy <= 8.28; gy += 0.01) {
      const p = fortWorld(gx, gy);
      if (catAvoid.some((c) => c.r >= 6 && Math.hypot(c.x - p.x, c.z - p.z) < 7.02)) continue;
      if (!fits(fortZone, j9Spec, avoid, p.x, p.z)) continue;
      j9Cands.push(p);
    }
  }
  const j9Pick: V2[] = [];
  if (j9Cands.length) {
    j9Pick.push(j9Cands.reduce((a, b) => (a.x <= b.x ? a : b)));
    while (j9Pick.length < 5) {
      let best: V2 | null = null;
      let bestMin = -1;
      for (const p of j9Cands) {
        let md = Infinity;
        for (const u of j9Pick) md = Math.min(md, Math.hypot(u.x - p.x, u.z - p.z));
        if (md > bestMin) {
          bestMin = md;
          best = p;
        }
      }
      if (!best || bestMin < 7.02) break;
      j9Pick.push(best);
    }
  }
  for (const spot of j9Pick) {
    const id = `cat-j9-${j9}`;
    claim({ ...j9Spec, id }, spot.x, spot.z);
    catAvoid.push({ x: spot.x, z: spot.z, r: 6.5 });
    at[id] = spot;
    begin(fortZone, id, "J-9", spot, 3.6, draw, (add) => warCatapult(add, colliders, spot.x, spot.z, false, true, true));
    j9 += 1;
  }
  if (j9 < 3) throw new Error(`J-9 catapults ${j9}`);
  for (const hut of [
    { id: "low-g7a", square: "G-7" },
    { id: "low-g7b", square: "G-7" },
    { id: "low-h7a", square: "H-7" },
    { id: "low-h7b", square: "H-7" },
    { id: "low-g9c", square: "G-9" },
    { id: "low-g9d", square: "G-9" },
    { id: "low-h8d", square: "H-8" },
    { id: "low-h8e", square: "H-8" },
    { id: "low-h10a", square: "H-10" },
    { id: "low-h10b", square: "H-10" },
  ]) {
    const spot = seek(fortZone, { id: hut.id, square: hut.square, hx: 1.9, hz: 1.7, h: 2.8 }, avoid);
    if (!spot) continue;
    begin(fortZone, hut.id, hut.square, spot, 2.8, draw, (add) => lowHut(hooks, add, colliders, spot.x, spot.z));
  }
  const liftC = fortNode("lift_h7");
  const lift = place({
    id: "lift-h7",
    square: "H-7",
    hx: 0.45,
    hz: 0.45,
    h: 6.4,
    near: fortWorld(7.1, 6.26),
    nearMax: 1.6,
    away: liftC,
    awayD: 3.2,
  });
  begin(fortZone, "lift-h7", "H-7", lift, 6.4, draw, (add) => liftFrame(add, hooks, lift.x, lift.z));
  for (const square of ["G-8", "H-6", "H-7", "J-6", "J-7", "J-8"]) rimLogs(draw, fortZone, colliders, square);
  for (const square of ["H-7", "H-8", "G-7", "G-9", "H-10"]) campPosts(draw, hooks, fortZone, colliders, square, avoid);
  for (const gallows of [
    { id: "gallows-h8", square: "H-8" },
    { id: "gallows-g9", square: "G-9" },
  ]) {
    const spot = place({ id: gallows.id, square: gallows.square, hx: 0.5, hz: 1.4, h: 4 });
    begin(fortZone, gallows.id, gallows.square, spot, 4, draw, (add) => bannerGallows(add, hooks, colliders, spot.x, spot.z));
  }
  for (const fire of [
    { id: "tripod-g7", square: "G-7" },
    { id: "tripod-g9", square: "G-9" },
  ]) {
    const spot = place({ id: fire.id, square: fire.square, hx: 0.7, hz: 0.7, h: 1.9 });
    begin(fortZone, fire.id, fire.square, spot, 1.9, draw, (add) => {
      hooks.tripod(add, spot.x, spot.z);
      add(0xff6a2a, 0.22, 0.35, 0.22, spot.x, 0.55, spot.z);
    });
    flames.push(spot);
  }
  const deck = place({ id: "brazier-deck", square: "G-7", hx: 1.4, hz: 1.1, h: 0.6 });
  begin(fortZone, "brazier-deck", "G-7", deck, 0.8, draw, (add) => {
    add(PLANKS, 2.6, 0.12, 2, deck.x, 0.06, deck.z);
    add(BASKET, 0.5, 0.4, 0.46, deck.x - 0.6, 0.46, deck.z);
    add(BASKET, 0.46, 0.36, 0.42, deck.x + 0.65, 0.42, deck.z + 0.2);
    add(0xff6a2a, 0.16, 0.28, 0.16, deck.x - 0.6, 0.78, deck.z);
    add(0xff6a2a, 0.14, 0.24, 0.14, deck.x + 0.65, 0.7, deck.z + 0.2);
  });
  const bridgeA = place({ id: "bridge-j7a", square: "J-7", hx: 0.4, hz: 0.4, h: 2.4 });
  const bridgeB = place({ id: "bridge-j7b", square: "J-7", hx: 0.4, hz: 0.4, h: 2.4, near: bridgeA, nearMin: 5, nearMax: 14 });
  begin(fortZone, "bridge-j7", "J-7", bridgeA, 2.4, draw, (add) => {
    plankRun(add, hooks, bridgeA.x, bridgeA.z, bridgeB.x, bridgeB.z, 0.35);
    for (const p of [bridgeA, bridgeB]) {
      footBox(add, WOOD, 0.22, 2.3, 0.22, p.x, p.z);
      add(SKULL, 0.32, 0.28, 0.3, p.x, 2.45, p.z);
      collide(colliders, p.x, p.z, 0.18, 0.18);
    }
  });
  const gantry = place({ id: "gantry-j6", square: "J-6", hx: 1.1, hz: 0.8, h: 3 });
  begin(fortZone, "gantry-j6", "J-6", gantry, 3, draw, (add) => {
    footBox(add, WOOD, 0.28, 3, 0.28, gantry.x - 0.8, gantry.z);
    footBox(add, WOOD, 0.28, 3, 0.28, gantry.x + 0.8, gantry.z);
    add(WOOD, 2.1, 0.24, 0.24, gantry.x, 2.9, gantry.z);
    collide(colliders, gantry.x, gantry.z, 1.05, 0.3);
    const q = nearest(fortZone.segs, gantry.x, gantry.z);
    const nx = gantry.x - q.x;
    const nz = gantry.z - q.z;
    const len = Math.hypot(nx, nz) || 1;
    const end = { x: gantry.x + (nx / len) * 3.2, z: gantry.z + (nz / len) * 3.2 };
    if (fortZone.inside(end.x, end.z)) plankRun(add, hooks, gantry.x, gantry.z, end.x, end.z, 0.4);
    const ox = gantry.x + (nx / len) * 1.6;
    const oz = gantry.z + (nz / len) * 1.6;
    marks.push({ kind: "fall", x: ox, z: oz, y: traceFloorY(gantry.x, gantry.z), yaw: Math.atan2(nx, nz) });
  });
  const temple = place({ id: "keep", square: "J-8", hx: 6.1, hz: 4.1, h: 8, minY: 5.2, near: fortWorld(9.02, 7.04), nearMax: 6 });
  begin(fortZone, "keep", "J-8", temple, 8, draw, (add) => keep(add, hooks, fortZone, colliders, temple.x, temple.z));
  const lever = place({ id: "lever-g7", square: "G-7", hx: 0.45, hz: 0.45, h: 1.2 });
  begin(fortZone, "lever-g7", "G-7", lever, 1.2, draw, (add) => {
    footBox(add, 0x6e675e, 0.7, 0.45, 0.55, lever.x, lever.z);
    add(WOOD, 0.1, 1.2, 0.1, lever.x, 0.85, lever.z, 0.4);
    collide(colliders, lever.x, lever.z, 0.4, 0.35);
  });
  let trees = 0;
  for (const square of ["G-6", "H-6", "J-6", "I-10", "H-10", "G-8"]) {
    for (let i = 0; i < 3 && trees < 8; i++) {
      const spot = seek(fortZone, { id: `tree-${square}-${i}`, square, hx: 0.45, hz: 0.45, h: 3.6 }, avoid);
      if (!spot) continue;
      begin(fortZone, `tree-${square}`, square, spot, 3.6, draw, (add) => hooks.dead(add, spot.x, spot.z));
      trees += 1;
    }
  }
  if (trees < 6) throw new Error(`fort trees ${trees}`);
  fillFortDensity(draw, colliders, avoid);
}

function inPool(x: number, z: number, cx: number, cz: number, r: number) {
  return Math.hypot(x - cx, z - cz) < r - 0.7;
}

const CAVE_POOLS = [
  { ...yugWorld(5.45, 8.5, 1), r: 8.5 },
  { ...yugWorld(9.55, 6.62, 1), r: 8.2 },
];

function inCavePool(x: number, z: number) {
  return CAVE_POOLS.some((pool) => Math.hypot(x - pool.x, z - pool.z) < pool.r - 0.5);
}

const CAVE_SCATTER = ["rubble", "stal", "slab", "cairn", "bone", "moss"] as const;
type CaveKind = (typeof CAVE_SCATTER)[number] | "crate";

function paintCave(colliders: Solid[], x: number, z: number, kind: CaveKind) {
  cavePaint = kind;
  const yaw = hash(x, z) * Math.PI;
  if (kind === "rubble") {
    const s = 0.85 + hash(x, z + 1) * 0.55;
    footBox(caveBox, 0x6d675c, s, 0.28, s * 0.72, x, z, yaw);
    caveBox(0x5a534c, s * 0.5, 0.22, s * 0.4, x + 0.12, 0.36, z - 0.08, yaw + 0.35);
    caveBox(0x7a7264, s * 0.28, 0.16, s * 0.22, x - 0.16, 0.2, z + 0.1);
    collide(colliders, x, z, 0.32, 0.26);
  } else if (kind === "stal") {
    const map = yughottMapAt(x, z);
    const cap = cameraBand(map, x, z) ? 1.5 : 3;
    const n = 2 + Math.floor(hash(x + 1, z) * 3);
    let top = 0;
    for (let i = 0; i < n; i++) {
      const a = hash(x, z + i) * Math.PI * 2;
      const rad = 0.12 + hash(z, i + 2) * 0.28;
      let h = 1 + hash(x + i, z + 3) * 2;
      if (h > cap) h = cap;
      const px = x + Math.cos(a) * rad;
      const pz = z + Math.sin(a) * rad;
      const radius = 0.16 + hash(px, pz) * 0.1;
      caveBits.push({ kind: "stal", shape: "cone", color: 0x4a4450, sx: radius, sy: h, sz: radius, x: px, y: h / 2, z: pz, yaw: 0 });
      const baseH = Math.min(h * 0.38, 0.55);
      caveBits.push({ kind: "stal-base", shape: "cone", color: 0x3b3640, sx: radius * 1.35, sy: baseH, sz: radius * 1.35, x: px, y: baseH / 2, z: pz, yaw: 0 });
      if (h > top) top = h;
    }
    collide(colliders, x, z, 0.36, 0.36);
    if (top > 3) throw new Error("stalagmite over 3");
    if (top > cap) throw new Error("stalagmite camera side");
  } else if (kind === "slab") {
    footBox(caveBox, 0x3a3640, 1.25, 0.18, 0.62, x, z, yaw);
    caveBox(0x322e38, 0.82, 0.14, 0.4, x + 0.16, 0.24, z - 0.06, yaw + 0.5);
    collide(colliders, x, z, 0.42, 0.28);
  } else if (kind === "cairn") {
    footBox(caveBox, 0x4a4450, 0.52, 0.26, 0.44, x, z, yaw);
    caveBox(0x3e3844, 0.34, 0.22, 0.3, x + 0.04, 0.36, z, yaw + 0.4);
    caveBox(0x514a58, 0.2, 0.18, 0.18, x, 0.54, z - 0.02);
    collide(colliders, x, z, 0.28, 0.24);
  } else if (kind === "bone") {
    caveBox(0xe4d4c0, 0.68, 0.14, 0.24, x, 0.1, z, yaw);
    caveBox(0xd2c2ae, 0.42, 0.12, 0.18, x + 0.16, 0.12, z + 0.08, yaw - 0.6);
    caveBox(0xcbb8a4, 0.2, 0.16, 0.18, x - 0.14, 0.14, z + 0.02);
    collide(colliders, x, z, 0.28, 0.2);
  } else if (kind === "moss") {
    caveBox(0x3d4a3a, 1.15, 0.04, 0.82, x, 0.025, z, yaw);
    caveBox(0x44543f, 0.55, 0.035, 0.4, x + 0.28, 0.03, z + 0.18, yaw + 0.6);
  } else {
    footBox(caveBox, 0x6b4e32, 0.82, 0.36, 0.66, x, z, yaw);
    caveBox(0x5a422c, 0.7, 0.12, 0.16, x + 0.18, 0.42, z + 0.08, yaw + 0.7);
    caveBox(0x4a3824, 0.34, 0.1, 0.48, x - 0.12, 0.28, z - 0.1, yaw - 0.4);
    collide(colliders, x, z, 0.36, 0.3);
  }
}

function fillYughottDensity(draw: Add, colliders: Solid[], avoid: { x: number; z: number; r: number }[]) {
  for (const map of [1, 2] as const) {
    const zone = yugZone(map);
    const world = (gx: number, gy: number) => yugWorld(gx, gy, map);
    const list: V2[] = props.filter((p) => p.zone === "yughott" && p.map === map).map((p) => ({ x: p.x, z: p.z }));
    let seq = 0;
    const seat = (x: number, z: number, kind: CaveKind, h: number) => {
      if (inCavePool(x, z)) return false;
      const square = zone.square(x, z);
      if (!square || square === "?" || square.length < 3) return false;
      const spec: Seek = { id: `cave-${map}-${seq}`, square, hx: 0.44, hz: 0.4, h };
      if (!fits(zone, spec, avoid, x, z)) return false;
      const at = claim(spec, x, z);
      seq += 1;
      begin(zone, spec.id, square, at, h, draw, () => paintCave(colliders, at.x, at.z, kind));
      list.push(at);
      return true;
    };
    for (const edge of YUGHOTT_GRAPHS[map].edges) {
      const walked = edgeWalk(edge, world);
      if (walked.walked <= 22) continue;
      for (let start = 0; start <= walked.walked - 22 + 0.05; start += 4) {
        let i0 = 0;
        while (i0 < walked.arc.length && walked.arc[i0] < start - 0.05) i0 += 1;
        let i1 = i0;
        while (i1 < walked.arc.length && walked.arc[i1] <= start + 22) i1 += 1;
        if (i1 <= i0 + 1) continue;
        let have = nearStretch(walked.samples, i0, i1 - 1, list);
        if (have >= 2) continue;
        const mid = walked.samples[Math.min(walked.samples.length - 1, i0 + Math.floor((i1 - i0) / 2))];
        const path = nearest(zone.segs, mid.x, mid.z);
        const nx = -path.tz;
        const nz = path.tx;
        const kind0 = Math.floor(hash(mid.x, mid.z) * CAVE_SCATTER.length);
        const place = (x: number, z: number, n: number) => {
          const kind = CAVE_SCATTER[(kind0 + n) % CAVE_SCATTER.length];
          const openH = kind === "stal" ? 1 + hash(x, z) * 2 : kind === "moss" ? 0.08 : 0.7;
          const h = kind === "stal" && cameraBand(map, x, z) ? Math.min(openH, 1.5) : openH;
          return seat(x, z, kind, h);
        };
        for (const off of [2.95, -2.95, 3.7, -3.7, 5.2, -5.2, 7.4, -7.4]) {
          if (have >= 2) break;
          if (place(mid.x + nx * off, mid.z + nz * off, have)) have += 1;
        }
        for (let ring = 3.2; ring <= 10 && have < 2; ring += 1.5) {
          const steps = Math.max(8, Math.ceil(ring));
          for (let k = 0; k < steps && have < 2; k++) {
            const ang = hash(mid.z, ring) + (k / steps) * Math.PI * 2;
            if (place(mid.x + Math.cos(ang) * ring, mid.z + Math.sin(ang) * ring, k + have)) have += 1;
          }
        }
        for (let dx = -12; dx <= 12 && have < 2; dx += 1.15) {
          for (let dz = -12; dz <= 12 && have < 2; dz += 1.15) {
            if (dx * dx + dz * dz > 144) continue;
            const x = mid.x + dx;
            const z = mid.z + dz;
            if (place(x, z, Math.floor(hash(x, z) * 5))) have += 1;
          }
        }
        if (have < 2) throw new Error(`${edge.id} density ${have} at ${start.toFixed(0)}`);
      }
    }
  }
}

function approachTrace(map: YughottMap, start: V2, gate: V2): V2[] {
  const dx0 = gate.x - start.x;
  const dz0 = gate.z - start.z;
  let ix = 0;
  let iy = 0;
  if (dx0 > 0.45) ix = 1;
  if (dx0 < -0.45) ix = -1;
  if (dz0 < -0.45) iy = 1;
  if (dz0 > 0.45) iy = -1;
  if (ix === 0 && iy === 0) {
    if (Math.abs(dx0) > Math.abs(dz0)) ix = dx0 > 0 ? 1 : -1;
    else iy = dz0 > 0 ? -1 : 1;
  }
  const km = Math.hypot(ix, iy) || 1;
  ix /= km;
  iy /= km;
  const out: V2[] = [];
  let x = start.x;
  let z = start.z;
  let speed = 0;
  const dt = 1 / 30;
  for (let frame = 0; frame < 12 * 30; frame++) {
    speed += (5 - speed) * Math.min(1, 28 * dt);
    const held = clampYughottGraph(x + ix * speed * dt, z + (-iy) * speed * dt, 0.36, map);
    x = held.x;
    z = held.z;
    if ((frame & 1) === 0) out.push({ x, z });
    if (Math.abs(x - gate.x) <= 2.4 && Math.abs(z - gate.z) <= 5.2) break;
  }
  return out;
}

function fortExitCrates(draw: Add, colliders: Solid[], avoid: { x: number; z: number; r: number }[]) {
  let n = 0;
  for (const map of [1, 2] as const) {
    const zone = yugZone(map);
    for (const node of YUGHOTT_GRAPHS[map].nodes) {
      if (!node.id.startsWith("exit_fort")) continue;
      const gate = yugWorld(node.gx, node.gy, map);
      const samples: V2[] = [];
      for (const yards of [8, 10, 12]) samples.push(...approachTrace(map, retreatYughott(map, node.id, yards), gate));
      const back = retreatYughott(map, node.id, 7);
      let tx = gate.x - back.x;
      let tz = gate.z - back.z;
      const tlen = Math.hypot(tx, tz) || 1;
      tx /= tlen;
      tz /= tlen;
      const lx = -tz;
      const lz = tx;
      const spots: V2[] = [];
      for (const along of [6.4, 8.6, 5.5, 7.6]) {
        const base = retreatYughott(map, node.id, along);
        for (const sign of [1, -1]) {
          for (const off of [2.95, 3.15]) spots.push({ x: base.x + lx * sign * off, z: base.z + lz * sign * off });
        }
      }
      const gap = (spot: V2) => {
        let best = Infinity;
        for (const p of samples) {
          const d = Math.hypot(p.x - spot.x, p.z - spot.z);
          if (d < best) best = d;
        }
        return best;
      };
      spots.sort((a, b) => gap(b) - gap(a));
      let placed = 0;
      for (const spot of spots) {
        if (placed >= 2) break;
        if (gap(spot) < 1.2) continue;
        if (inCavePool(spot.x, spot.z)) continue;
        const square = zone.square(spot.x, spot.z);
        if (!square || square === "?" || square.length < 3) continue;
        const spec: Seek = { id: `crate-${node.id}-${placed}`, square, hx: 0.42, hz: 0.36, h: 0.6 };
        if (!fits(zone, spec, avoid, spot.x, spot.z)) continue;
        const at = claim(spec, spot.x, spot.z);
        begin(zone, spec.id, square, at, 0.6, draw, () => paintCave(colliders, at.x, at.z, "crate"));
        placed += 1;
        n += 1;
      }
    }
  }
  if (n < 2) throw new Error(`fort-exit crates ${n}`);
}

function caveDress(raw: Add, colliders: Solid[], hooks: Hooks, avoid: { x: number; z: number; r: number }[]) {
  const draw: Add = (color, w, h, d, x, y, z, yaw, pitch) => {
    if (current) {
      const bottom = y - h / 2;
      if (bottom < current.localBase) current.localBase = bottom;
    }
    raw(color, w, h, d, x, y, z, yaw, pitch);
  };
  const upper = yugZone(1);
  const lower = yugZone(2);
  const fillRoom = (zone: Zone, square: string, totemsN: number, drumN: number, poolR: number, id: string, anchor: V2) => {
    const center = must(zone, { id: `${id}-pool`, square, hx: 0.7, hz: 0.7, h: 0.2, near: anchor, nearMin: 1.7, nearMax: Math.min(5.5, poolR * 0.65) }, avoid);
    begin(zone, `${id}-pool`, square, center, 0.2, draw, () => {
      /* water is a separate plane, just above this floor point */
    });
    const last = props[props.length - 1];
    last.localBase = 0.06;
    poolDiscs(anchor.x, anchor.z, poolR);
    const seats: { x: number; z: number; south: boolean }[] = [];
    for (let x = anchor.x - poolR; x <= anchor.x + poolR; x += 0.9) {
      for (let z = anchor.z - poolR; z <= anchor.z + poolR; z += 0.9) {
        if (Math.hypot(x - anchor.x, z - anchor.z) < 2.2 || !inPool(x, z, anchor.x, anchor.z, poolR)) continue;
        const open: Seek = { id: `${id}-seat`, square, hx: 0.58, hz: 0.58, h: 1 };
        if (!fits(zone, open, avoid, x, z)) continue;
        seats.push({ x, z, south: isSouth(zone.segs, x, z) });
      }
    }
    const take = (tall: boolean) => {
      for (const seat of seats) {
        if (tall && seat.south) continue;
        const spec: Seek = { id: `${id}-pick`, square, hx: 0.58, hz: 0.58, h: tall ? 4 : 1.2 };
        if (!fits(zone, spec, avoid, seat.x, seat.z)) continue;
        return claim(spec, seat.x, seat.z);
      }
      return null;
    };
    let totems = 0;
    let gotDrums = 0;
    for (let i = 0; i < seats.length * 2 && (totems < totemsN || gotDrums < drumN); i++) {
      const wantDrum = gotDrums < drumN && (totems >= totemsN || i % 4 === 0);
      let h = wantDrum ? 1.5 : 3 + (totems % 5) * 0.45;
      let spot = take(!wantDrum && h > 3);
      if (!spot && !wantDrum && h > 3) {
        h = 3;
        spot = take(false);
      }
      if (!spot) continue;
      if (wantDrum) {
        begin(zone, `${id}-drum`, square, spot, 1.5, draw, (add) => fireDrum(add, colliders, spot.x, spot.z));
        gotDrums += 1;
      } else {
        begin(zone, `${id}-totem`, square, spot, h, draw, (add) => totem(add, colliders, spot.x, spot.z, h, hash(spot.z, spot.x) > 0.62));
        totems += 1;
      }
    }
    if (totems < totemsN) throw new Error(`${id} totems ${totems}`);
    if (gotDrums < drumN) throw new Error(`${id} drums ${gotDrums}`);
    return anchor;
  };
  const f9 = fillRoom(upper, "F-9", 15, 7, 8.5, "f9", yugWorld(5.45, 8.5, 1));
  const j7 = fillRoom(upper, "J-7", 8, 3, 8.2, "j7", yugWorld(9.55, 6.62, 1));
  for (const room of [
    { at: f9, n: 3 },
    { at: j7, n: 2 },
  ]) {
    for (let i = 0; i < room.n; i++) {
      const a = (i / room.n) * Math.PI * 2 + 0.4;
      const x = room.at.x + Math.cos(a) * 2.4;
      const z = room.at.z + Math.sin(a) * 2.4;
      marks.push({ kind: "shaft", x, z, y: traceFloorY(x, z) });
    }
  }
  for (const square of ["G-9", "I-7", "L-6"]) {
    const spot = must(upper, { id: `rubble-${square}`, square, hx: 1.6, hz: 1.3, h: 1.2 }, avoid);
    const s = 3 + hash(spot.x, spot.z) * 2;
    begin(upper, `rubble-${square}`, square, spot, 1.3, draw, (add) => {
      rubble(add, spot.x, spot.z, s);
      collide(colliders, spot.x, spot.z, Math.min(1.2, s * 0.28), Math.min(1.05, s * 0.22));
    });
  }
  for (const square of ["G-9", "L-6"]) {
    const one = must(upper, { id: `totem-${square}`, square, hx: 0.62, hz: 0.62, h: 4 }, avoid);
    begin(upper, `totem-${square}`, square, one, 4, draw, (add) => totem(add, colliders, one.x, one.z, 3.6, true));
    const pairA = must(upper, { id: `pair-${square}a`, square, hx: 0.62, hz: 0.62, h: 4.2 }, avoid);
    const pairB = must(upper, { id: `pair-${square}b`, square, hx: 0.62, hz: 0.62, h: 3.4, near: pairA, nearMin: 1.6, nearMax: 3.4 }, avoid);
    begin(upper, `pair-${square}`, square, pairA, 4.2, draw, (add) => {
      totem(add, colliders, pairA.x, pairA.z, 4.2, false);
      totem(add, colliders, pairB.x, pairB.z, 3.3, hash(pairB.x, pairB.z) > 0.5);
    });
  }
  const home = seatedYughottPois().find((p) => p.id === "home_point_1" && p.map === 2);
  if (!home) throw new Error("home point");
  const crystal = seek(lower, { id: "crystal", square: "J-6", hx: 0.6, hz: 0.6, h: 2.4, near: home, nearMin: 1.6, nearMax: 4.5 }, avoid)
    ?? must(lower, { id: "crystal", square: "J-6", hx: 0.6, hz: 0.6, h: 2.4 }, avoid);
  begin(lower, "crystal", "J-6", crystal, 2.6, draw, (add) => {
    footBox(add, 0x3a3538, 0.9, 0.22, 0.7, crystal.x, crystal.z);
    hooks.crystal(add, crystal.x, crystal.z);
  });
  const west = upper.nodes.find((n) => n.grid === "F-9");
  const south = lower.nodes.find((n) => n.grid === "H-8");
  if (west) {
    const spot = seek(upper, { id: "bone-f9", square: "F-9", hx: 0.5, hz: 0.4, h: 0.4, near: west, nearMin: 1.2, nearMax: 4 }, avoid);
    if (spot) begin(upper, "bone-f9", "F-9", spot, 0.4, draw, (add) => {
      add(0xe4d4c0, 0.72, 0.16, 0.26, spot.x, 0.1, spot.z, 0.4);
      add(0xd2c2ae, 0.48, 0.14, 0.2, spot.x + 0.28, 0.12, spot.z + 0.16, -0.7);
    });
  }
  if (south) {
    const spot = seek(lower, { id: "bone-h8", square: "H-8", hx: 0.5, hz: 0.4, h: 0.4, near: south, nearMin: 1.2, nearMax: 4 }, avoid);
    if (spot) begin(lower, "bone-h8", "H-8", spot, 0.4, draw, (add) => {
      add(0xe4d4c0, 0.72, 0.16, 0.26, spot.x, 0.1, spot.z, 0.4);
      add(0xcbb8a4, 0.22, 0.2, 0.22, spot.x - 0.18, 0.16, spot.z + 0.04);
    });
  }
  fortExitCrates(draw, colliders, avoid);
  fillYughottDensity(draw, colliders, avoid);
}

export function dressOrcCamps(add: Add, colliders: Solid[], hooks: Hooks, avoid: { x: number; z: number; r: number }[]) {
  props = [];
  marks = [];
  flames = [];
  drums = [];
  caveBits.length = 0;
  occupied.length = 0;
  fortDress(add, colliders, hooks, avoid);
  caveDress(add, colliders, hooks, avoid);
}

function assertFortDensity() {
  const list = props.filter((p) => p.zone === "fort");
  for (const edge of FORT_GRAPH.edges) {
    const walked = edgeWalk(edge);
    if (walked.walked <= 22) continue;
    for (let start = 0; start <= walked.walked - 22 + 0.05; start += 4) {
      let i0 = 0;
      while (i0 < walked.arc.length && walked.arc[i0] < start - 0.05) i0 += 1;
      let i1 = i0;
      while (i1 < walked.arc.length && walked.arc[i1] <= start + 22) i1 += 1;
      if (i1 <= i0 + 1) continue;
      const have = nearStretch(walked.samples, i0, i1 - 1, list);
      if (have < 2) throw new Error(`${edge.id} density ${have} at ${start.toFixed(0)}`);
    }
  }
}

function assertYughottDensity() {
  for (const map of [1, 2] as const) {
    const world = (gx: number, gy: number) => yugWorld(gx, gy, map);
    const list = props.filter((p) => p.zone === "yughott" && p.map === map);
    for (const edge of YUGHOTT_GRAPHS[map].edges) {
      const walked = edgeWalk(edge, world);
      if (walked.walked <= 22) continue;
      for (let start = 0; start <= walked.walked - 22 + 0.05; start += 4) {
        let i0 = 0;
        while (i0 < walked.arc.length && walked.arc[i0] < start - 0.05) i0 += 1;
        let i1 = i0;
        while (i1 < walked.arc.length && walked.arc[i1] <= start + 22) i1 += 1;
        if (i1 <= i0 + 1) continue;
        const have = nearStretch(walked.samples, i0, i1 - 1, list);
        if (have < 2) throw new Error(`yug${map} ${edge.id} density ${have} at ${start.toFixed(0)}`);
      }
    }
  }
}

export function assertCampDress(solids: Solid[], squareOf: (prop: CampProp) => string) {
  if (ORC_LIGHT_BUDGET > 8) throw new Error("orc light budget");
  const count = (pred: (p: CampProp) => boolean) => props.filter(pred).length;
  if (count((p) => p.id.startsWith("tower-")) < 6) throw new Error("towers");
  if (count((p) => p.id === "stilt-g9") < 1) throw new Error("stilt hut");
  if (count((p) => p.id.startsWith("low-")) < 5) throw new Error("low huts");
  const cats = props.filter((p) => p.zone === "fort" && p.id.startsWith("cat-"));
  if (cats.filter((p) => p.square === "H-10").length < 3) throw new Error("H-10 catapults");
  if (cats.filter((p) => p.square === "J-9").length < 3) throw new Error("J-9 catapults");
  if (!cats.some((p) => p.id === "cat-i10")) throw new Error("I-10 catapult");
  for (let i = 0; i < cats.length; i++) {
    for (let j = i + 1; j < cats.length; j++) {
      if (Math.hypot(cats[i].x - cats[j].x, cats[i].z - cats[j].z) < 7) throw new Error(`${cats[i].id} near ${cats[j].id}`);
    }
  }
  if (count((p) => p.id.startsWith("gallows")) < 2) throw new Error("gallows");
  if (count((p) => p.id.startsWith("tripod")) < 2) throw new Error("tripods");
  if (flames.length < 2) throw new Error("fort flames");
  if (count((p) => p.id === "keep") < 1) throw new Error("keep");
  if (count((p) => p.id === "lift-h7") < 1) throw new Error("lift");
  if (count((p) => p.id === "lever-g7") < 1) throw new Error("lever");
  if (count((p) => p.id.startsWith("tree-")) < 6) throw new Error("trees");
  if (count((p) => p.id.startsWith("palisade-")) < 12) throw new Error("palisades");
  if (count((p) => p.id.startsWith("f9-totem")) < 15) throw new Error("f9 totems");
  if (count((p) => p.id.startsWith("j7-totem")) < 8) throw new Error("j7 totems");
  if (drums.length < 10) throw new Error(`drums ${drums.length}`);
  if (marks.filter((m) => m.kind === "shaft").length < 4 || marks.filter((m) => m.kind === "shaft").length > 6) throw new Error("shafts");
  if (marks.filter((m) => m.kind === "pool").length < 2) throw new Error("pools");
  if (marks.filter((m) => m.kind === "fall").length < 1) throw new Error("waterfall");
  if (count((p) => p.id === "crystal") < 1) throw new Error("crystal");
  for (const prop of props) {
    if (Math.abs(prop.localBase) > 0.1) throw new Error(`${prop.id} base ${prop.localBase.toFixed(2)}`);
    if (prop.zone === "fort" && !inFortGraph(prop.x, prop.z, 0)) throw new Error(`${prop.id} off the fort floor`);
    if (prop.zone === "yughott" && prop.map && !inYughottGraph(prop.x, prop.z, 0, prop.map)) throw new Error(`${prop.id} off the grotto floor`);
    const sq = squareOf(prop);
    if (sq !== prop.square) throw new Error(`${prop.id} ${sq} != ${prop.square}`);
    const segs = prop.zone === "fort" ? fortZone.segs : yugZone(prop.map ?? 1).segs;
    const path = nearest(segs, prop.x, prop.z);
    if (path.d < 1.5) throw new Error(`${prop.id} centreline ${path.d.toFixed(2)}`);
    if (prop.h > 3 && isSouth(segs, prop.x, prop.z)) throw new Error(`${prop.id} tall on the south`);
    if (prop.zone === "yughott" && prop.map && (prop.id.startsWith("cave-") || prop.id.startsWith("crate-")) && prop.h > 1.5 && cameraBand(prop.map, prop.x, prop.z)) {
      throw new Error(`${prop.id} camera-side ${prop.h.toFixed(2)}`);
    }
  }
  const blocked = (x: number, z: number) => solids.some((box) => x > box.minX - 0.36 && x < box.maxX + 0.36 && z > box.minZ - 0.36 && z < box.maxZ + 0.36);
  const walk = (label: string, edges: { id: string; pts: [number, number][] }[], world: (gx: number, gy: number) => V2, inside: (x: number, z: number) => boolean) => {
    for (const edge of edges) {
      for (let i = 0; i + 1 < edge.pts.length; i++) {
        const a = world(edge.pts[i][0], edge.pts[i][1]);
        const b = world(edge.pts[i + 1][0], edge.pts[i + 1][1]);
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
          for (const off of [0, 2, -2]) {
            const x = px + nx * off;
            const z = pz + nz * off;
            if (!inside(x, z)) continue;
            if (blocked(x, z)) throw new Error(`${label} ${edge.id} collider`);
          }
        }
      }
    }
  };
  walk("fort", FORT_GRAPH.edges, fortWorld, (x, z) => inFortGraph(x, z, 0));
  walk("yug1", YUGHOTT_GRAPHS[1].edges, (gx, gy) => yugWorld(gx, gy, 1), (x, z) => inYughottGraph(x, z, 0, 1));
  walk("yug2", YUGHOTT_GRAPHS[2].edges, (gx, gy) => yugWorld(gx, gy, 2), (x, z) => inYughottGraph(x, z, 0, 2));
  assertFortDensity();
  assertYughottDensity();
  for (const poi of [...seatedFortPois(), ...seatedYughottPois()]) {
    if (blocked(poi.x, poi.z)) throw new Error(`${poi.id} blocked`);
  }
}
