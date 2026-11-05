/**
 * Flat vector roofs for San d'Oria. Each district is one mesh.
 * Street edges are the curb outlines, so the slate sits flush on the wall.
 */
import {
  BufferGeometry,
  CanvasTexture,
  Color,
  DoubleSide,
  Float32BufferAttribute,
  LinearFilter,
  LinearMipmapLinearFilter,
  Mesh,
  MeshBasicMaterial,
  Path,
  RepeatWrapping,
  Shape,
  ShapeGeometry,
  SRGBColorSpace,
  type Object3D,
} from "three";
import { SAN_CURB, SAN_PAINT } from "./sandoria-paint.generated.ts";
import { inNorthGraph, inPortGraph, inSouthGraph, sanDraw, sanLot, SAN_ROOF, SAN_ROOF_HI, SAN_ROOF_SHADE } from "./sandoria-graph";

type District = "south" | "north" | "port";
type Tag = (mesh: Object3D, minX: number, maxX: number, minZ: number, maxZ: number) => void;
type SceneLike = { add: (obj: Object3D) => void };
type P = [number, number];
type Tri = [P, P, P];
type Loop = readonly (readonly number[])[];

const ROOF_Y = 0.07;
const RIDGE_Y = 0.086;
const LINE_Y = 0.098;
const CELL = 6;
const EDGE = 16;
const CURB_EDGE = 4;

const WALK: Record<District, (x: number, z: number) => boolean> = {
  south: (x, z) => inSouthGraph(x, z, 0),
  north: (x, z) => inNorthGraph(x, z, 0),
  port: (x, z) => inPortGraph(x, z, 0),
};

type Seg = { ax: number; az: number; bx: number; bz: number };

function pointIn(loop: Loop, x: number, z: number) {
  let hit = false;
  for (let i = 0, j = loop.length - 1; i < loop.length; j = i++) {
    const yi = loop[i][1];
    const yj = loop[j][1];
    if ((yi > z) !== (yj > z) && x < ((loop[j][0] - loop[i][0]) * (z - yi)) / (yj - yi) + loop[i][0]) hit = !hit;
  }
  return hit;
}

function pointInRing(ring: { x: number; z: number }[], x: number, z: number) {
  let hit = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const a = ring[i];
    const b = ring[j];
    if ((a.z > z) !== (b.z > z) && x < ((b.x - a.x) * (z - a.z)) / (b.z - a.z) + a.x) hit = !hit;
  }
  return hit;
}

class SegGrid {
  bins = new Map<number, Seg[]>();
  add(seg: Seg) {
    const dx = seg.bx - seg.ax;
    const dz = seg.bz - seg.az;
    const steps = Math.max(1, Math.ceil(Math.hypot(dx, dz) / CELL));
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const key = this.key(seg.ax + dx * t, seg.az + dz * t);
      let bin = this.bins.get(key);
      if (!bin) {
        bin = [];
        this.bins.set(key, bin);
      }
      if (bin[bin.length - 1] !== seg) bin.push(seg);
    }
  }
  key(x: number, z: number) {
    return Math.floor(x / CELL) + Math.floor(z / CELL) * 100003;
  }
  near(x: number, z: number) {
    const ix = Math.floor(x / CELL);
    const iz = Math.floor(z / CELL);
    const out: Seg[] = [];
    for (let dz = -1; dz <= 1; dz++) {
      for (let dx = -1; dx <= 1; dx++) {
        const bin = this.bins.get(ix + dx + (iz + dz) * 100003);
        if (!bin) continue;
        for (const seg of bin) out.push(seg);
      }
    }
    return out;
  }
}

function distSeg(x: number, z: number, seg: Seg) {
  const dx = seg.bx - seg.ax;
  const dz = seg.bz - seg.az;
  const l2 = dx * dx + dz * dz || 1;
  let t = ((x - seg.ax) * dx + (z - seg.az) * dz) / l2;
  if (t < 0) t = 0;
  else if (t > 1) t = 1;
  return Math.hypot(x - (seg.ax + dx * t), z - (seg.az + dz * t));
}

function edgeOnCurb(a: P, b: P, grid: SegGrid) {
  const mx = (a[0] + b[0]) * 0.5;
  const mz = (a[1] + b[1]) * 0.5;
  const segs = grid.near(mx, mz);
  for (let i = 0; i < segs.length; i++) {
    const seg = segs[i];
    if (distSeg(a[0], a[1], seg) <= 0.06 && distSeg(b[0], b[1], seg) <= 0.06) return true;
  }
  return false;
}

function triOnCurb(t: Tri, grid: SegGrid) {
  return edgeOnCurb(t[0], t[1], grid) || edgeOnCurb(t[1], t[2], grid) || edgeOnCurb(t[2], t[0], grid);
}

function longest(t: Tri) {
  const d01 = (t[1][0] - t[0][0]) ** 2 + (t[1][1] - t[0][1]) ** 2;
  const d12 = (t[2][0] - t[1][0]) ** 2 + (t[2][1] - t[1][1]) ** 2;
  const d20 = (t[0][0] - t[2][0]) ** 2 + (t[0][1] - t[2][1]) ** 2;
  if (d01 >= d12 && d01 >= d20) return { edge: 0, len2: d01 };
  if (d12 >= d20) return { edge: 1, len2: d12 };
  return { edge: 2, len2: d20 };
}

function split(t: Tri, edge: number): [Tri, Tri] {
  const i = edge;
  const j = (edge + 1) % 3;
  const k = (edge + 2) % 3;
  const m: P = [(t[i][0] + t[j][0]) * 0.5, (t[i][1] + t[j][1]) * 0.5];
  return [
    [t[i], m, t[k]],
    [m, t[j], t[k]],
  ];
}

type Dir = { x: number; z: number };

type Building = {
  index: number;
  ring: { x: number; z: number }[];
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  cx: number;
  cz: number;
  dir: Dir;
  span: number;
  tone: number;
};

function principal(pts: { x: number; z: number }[]): { dir: Dir; span: number } {
  let mx = 0;
  let mz = 0;
  const n = pts.length || 1;
  for (const p of pts) {
    mx += p.x;
    mz += p.z;
  }
  mx /= n;
  mz /= n;
  let xx = 0;
  let xz = 0;
  let zz = 0;
  for (const p of pts) {
    const dx = p.x - mx;
    const dz = p.z - mz;
    xx += dx * dx;
    xz += dx * dz;
    zz += dz * dz;
  }
  const disc = Math.sqrt(Math.max(0, (xx - zz) * (xx - zz) + 4 * xz * xz));
  const l1 = (xx + zz + disc) * 0.5;
  const l2 = (xx + zz - disc) * 0.5;
  let vx = 1;
  let vz = 0;
  if (l1 > l2 * 1.08 + 1e-4) {
    if (Math.abs(xz) > 1e-4) {
      vx = xz;
      vz = l1 - xx;
    } else if (zz > xx) {
      vx = 0;
      vz = 1;
    }
  }
  const len = Math.hypot(vx, vz) || 1;
  vx /= len;
  vz /= len;
  if (vx < -1e-8 || (Math.abs(vx) <= 1e-8 && vz < 0)) {
    vx = -vx;
    vz = -vz;
  }
  const px = -vz;
  const pz = vx;
  let lo = Infinity;
  let hi = -Infinity;
  for (const p of pts) {
    const t = p.x * px + p.z * pz;
    if (t < lo) lo = t;
    if (t > hi) hi = t;
  }
  return { dir: { x: vx, z: vz }, span: hi - lo };
}

function buildBuildings(id: District) {
  const bins = new Map<number, number[]>();
  const buildings: Building[] = [];
  const bucket = 24;
  const rings = sanDraw(id).buildings;
  for (const ring of rings) {
    if (ring.length < 3) continue;
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
    const n = Math.sin((minX + maxX) * 12.9898 + (minZ + maxZ) * 78.233) * 43758.5453;
    const tone = 0.92 + (n - Math.floor(n)) * 0.16;
    if (tone < 0.92 - 1e-6 || tone > 1.08 + 1e-6) throw new Error("roof tone");
    const axis = principal(ring);
    const index = buildings.length;
    buildings.push({
      index,
      ring,
      minX,
      maxX,
      minZ,
      maxZ,
      cx: (minX + maxX) / 2,
      cz: (minZ + maxZ) / 2,
      dir: axis.dir,
      span: axis.span,
      tone,
    });
    const c0 = Math.floor(minX / bucket);
    const c1 = Math.floor(maxX / bucket);
    const r0 = Math.floor(minZ / bucket);
    const r1 = Math.floor(maxZ / bucket);
    for (let r = r0; r <= r1; r++) {
      for (let c = c0; c <= c1; c++) {
        const key = c + r * 100003;
        let bin = bins.get(key);
        if (!bin) {
          bin = [];
          bins.set(key, bin);
        }
        bin.push(index);
      }
    }
  }
  const at = (x: number, z: number): Building | null => {
    const bin = bins.get(Math.floor(x / bucket) + Math.floor(z / bucket) * 100003);
    if (!bin) return null;
    let best: Building | null = null;
    let bestD = 64;
    for (const index of bin) {
      const b = buildings[index];
      if (x < b.minX || x > b.maxX || z < b.minZ || z > b.maxZ) continue;
      if (!pointInRing(b.ring, x, z)) {
        const d = (x - b.cx) ** 2 + (z - b.cz) ** 2;
        if (d < bestD) {
          bestD = d;
          best = b;
        }
        continue;
      }
      return b;
    }
    return bestD <= 36 ? best : null;
  };
  return { buildings, at };
}

function classify(id: District, loop: Loop): "hole" | "island" | "skip" {
  const walk = WALK[id];
  let streets = 0;
  let lots = 0;
  const n = loop.length;
  const step = Math.max(1, Math.floor(n / 28));
  for (const inset of [0.75, 0.25]) {
    for (let i = 0; i < n; i += step) {
      const a = loop[i];
      const b = loop[(i + 1) % n];
      const dx = b[0] - a[0];
      const dz = b[1] - a[1];
      const len = Math.hypot(dx, dz) || 1;
      const nx = -dz / len;
      const nz = dx / len;
      const mx = (a[0] + b[0]) * 0.5;
      const mz = (a[1] + b[1]) * 0.5;
      let x = mx + nx * inset;
      let z = mz + nz * inset;
      if (!pointIn(loop, x, z)) {
        x = mx - nx * inset;
        z = mz - nz * inset;
      }
      if (!pointIn(loop, x, z)) continue;
      if (walk(x, z)) streets++;
      else if (sanLot(id, x, z)) lots++;
    }
    if (streets + lots > 0) break;
  }
  if (streets > 0 && streets >= lots) return "hole";
  if (lots > 0) return "island";
  return "skip";
}

function interior(loop: Loop): P {
  let twice = 0;
  let cx = 0;
  let cz = 0;
  for (let i = 0; i < loop.length; i++) {
    const a = loop[i];
    const b = loop[(i + 1) % loop.length];
    const cross = a[0] * b[1] - b[0] * a[1];
    twice += cross;
    cx += (a[0] + b[0]) * cross;
    cz += (a[1] + b[1]) * cross;
  }
  if (Math.abs(twice) > 1e-4) {
    const x = cx / (3 * twice);
    const z = cz / (3 * twice);
    if (pointIn(loop, x, z)) return [x, z];
  }
  const a = loop[0];
  const b = loop[1];
  const dx = b[0] - a[0];
  const dz = b[1] - a[1];
  const len = Math.hypot(dx, dz) || 1;
  const mx = (a[0] + b[0]) * 0.5 + (-dz / len) * 0.4;
  const mz = (a[1] + b[1]) * 0.5 + (dx / len) * 0.4;
  return [mx, mz];
}

function addLoop(path: Path, loop: Loop) {
  path.moveTo(loop[0][0], loop[0][1]);
  for (let i = 1; i < loop.length; i++) path.lineTo(loop[i][0], loop[i][1]);
  path.closePath();
}

function shapeOf(outer: Loop, holes: Loop[]) {
  const shape = new Shape();
  addLoop(shape, outer);
  for (const hole of holes) {
    const path = new Path();
    addLoop(path, hole);
    shape.holes.push(path);
  }
  return shape;
}

export type RoofMeshData = {
  pos: Float32Array;
  col: Float32Array;
  uv: Float32Array;
  linePos: Float32Array;
  lineCol: Float32Array;
  tris: number;
  lineTris: number;
};

export function buildSanRoof(id: District): RoofMeshData {
  const loops = SAN_CURB[id] as readonly Loop[];
  const holes: Loop[] = [];
  const islands: Loop[] = [];
  for (const loop of loops) {
    const kind = classify(id, loop);
    if (kind === "hole") holes.push(loop);
    else if (kind === "island") islands.push(loop);
    else throw new Error(`${id} curb loop is neither street nor lot`);
  }
  if (!holes.length) throw new Error(`${id} roof has no street edge`);
  const tile = SAN_PAINT[id];
  const pad = 4;
  const outer: Loop = [
    [tile.minX - pad, tile.minZ - pad],
    [tile.maxX + pad, tile.minZ - pad],
    [tile.maxX + pad, tile.maxZ + pad],
    [tile.minX - pad, tile.maxZ + pad],
  ];
  const shapes: Shape[] = [shapeOf(outer, holes)];
  for (const loop of islands) {
    const spot = interior(loop);
    let enclosed = false;
    for (const hole of holes) {
      if (pointIn(hole, spot[0], spot[1])) {
        enclosed = true;
        break;
      }
    }
    if (!enclosed) {
      const path = new Path();
      addLoop(path, loop);
      shapes[0].holes.push(path);
    }
    shapes.push(shapeOf(loop, []));
  }
  const seeded = new ShapeGeometry(shapes, 1);
  const src = seeded.getAttribute("position");
  const index = seeded.getIndex();
  if (!index) throw new Error(`${id} roof did not triangulate`);
  const grid = new SegGrid();
  for (const loop of loops) {
    for (let i = 0; i < loop.length; i++) {
      const a = loop[i];
      const b = loop[(i + 1) % loop.length];
      grid.add({ ax: a[0], az: a[1], bx: b[0], bz: b[1] });
    }
  }
  const stack: Tri[] = [];
  for (let i = 0; i < index.count; i += 3) {
    const tri = [0, 1, 2].map((k) => {
      const v = index.getX(i + k);
      return [src.getX(v), src.getY(v)] as P;
    }) as Tri;
    stack.push(tri);
  }
  seeded.dispose();
  const walk = WALK[id];
  const kept: Tri[] = [];
  let guard = 0;
  while (stack.length) {
    if (++guard > 120000) throw new Error(`${id} roof split runaway`);
    const tri = stack.pop() as Tri;
    const span = longest(tri);
    const onCurb = triOnCurb(tri, grid);
    const limit = onCurb ? CURB_EDGE : EDGE;
    if (span.len2 > limit * limit) {
      const [a, b] = split(tri, span.edge);
      stack.push(a, b);
      continue;
    }
    const cx = (tri[0][0] + tri[1][0] + tri[2][0]) / 3;
    const cz = (tri[0][1] + tri[1][1] + tri[2][1]) / 3;
    const area = Math.abs((tri[1][0] - tri[0][0]) * (tri[2][1] - tri[0][1]) - (tri[2][0] - tri[0][0]) * (tri[1][1] - tri[0][1]));
    if (area < 0.04) continue;
    if (id === "port" && cz < -1028 && Math.abs(cx) < 42) continue;
    if (walk(cx, cz)) continue;
    let touch = onCurb || sanLot(id, cx, cz);
    if (!touch) {
      for (let i = 0; i < 3; i++) {
        const a = tri[i];
        const b = tri[(i + 1) % 3];
        if (sanLot(id, a[0], a[1]) || sanLot(id, (a[0] + b[0]) * 0.5, (a[1] + b[1]) * 0.5)) {
          touch = true;
          break;
        }
      }
    }
    if (touch) kept.push(tri);
  }
  if (kept.length < 8) throw new Error(`${id} roof is empty`);
  const held = new Set<number>();
  const hold = (x: number, z: number) => held.add(Math.round(x * 50) + Math.round(z * 50) * 100003);
  const holds = (x: number, z: number) => {
    const ix = Math.round(x * 50);
    const iz = Math.round(z * 50);
    for (let dz = -2; dz <= 2; dz++) {
      for (let dx = -2; dx <= 2; dx++) {
        if (held.has(ix + dx + (iz + dz) * 100003)) return true;
      }
    }
    return false;
  };
  for (const tri of kept) {
    hold(tri[0][0], tri[0][1]);
    hold(tri[1][0], tri[1][1]);
    hold(tri[2][0], tri[2][1]);
  }
  for (const loop of loops) {
    for (let i = 0; i < loop.length; i++) {
      const a = loop[i];
      const b = loop[(i + 1) % loop.length];
      if (holds(a[0], a[1]) && holds(b[0], b[1])) continue;
      const dx = b[0] - a[0];
      const dz = b[1] - a[1];
      const len = Math.hypot(dx, dz) || 1;
      let nx = -dz / len;
      let nz = dx / len;
      const mx = (a[0] + b[0]) * 0.5;
      const mz = (a[1] + b[1]) * 0.5;
      const lot = (sx: number, sz: number) => sanLot(id, mx + sx, mz + sz) || !walk(mx + sx, mz + sz);
      if (!lot(nx * 0.8, nz * 0.8) && lot(-nx * 0.8, -nz * 0.8)) {
        nx = -nx;
        nz = -nz;
      }
      const tip: P = [mx + nx * 0.42, mz + nz * 0.42];
      kept.push([
        [a[0], a[1]],
        [b[0], b[1]],
        tip,
      ]);
      hold(a[0], a[1]);
      hold(b[0], b[1]);
    }
  }
  const found = new Set<number>();
  const mark = (x: number, z: number) => found.add(Math.round(x * 50) + Math.round(z * 50) * 100003);
  const seen = (x: number, z: number) => {
    const ix = Math.round(x * 50);
    const iz = Math.round(z * 50);
    for (let dz = -2; dz <= 2; dz++) {
      for (let dx = -2; dx <= 2; dx++) {
        if (found.has(ix + dx + (iz + dz) * 100003)) return true;
      }
    }
    return false;
  };
  const { at } = buildBuildings(id);
  const tones: number[] = new Array(kept.length);
  for (let i = 0; i < kept.length; i++) {
    const tri = kept[i];
    const cx = (tri[0][0] + tri[1][0] + tri[2][0]) / 3;
    const cz = (tri[0][1] + tri[1][1] + tri[2][1]) / 3;
    const home = at(cx, cz);
    tones[i] = home ? home.tone : 0.96;
  }
  const edgeKey = (a: P, b: P) => {
    let ax = Math.round(a[0] * 500);
    let az = Math.round(a[1] * 500);
    let bx = Math.round(b[0] * 500);
    let bz = Math.round(b[1] * 500);
    if (ax > bx || (ax === bx && az > bz)) {
      const tx = ax;
      ax = bx;
      bx = tx;
      const tz = az;
      az = bz;
      bz = tz;
    }
    return `${ax},${az}|${bx},${bz}`;
  };
  const edges = new Map<string, number[]>();
  for (let i = 0; i < kept.length; i++) {
    const tri = kept[i];
    for (let k = 0; k < 3; k++) {
      const key = edgeKey(tri[k], tri[(k + 1) % 3]);
      let bin = edges.get(key);
      if (!bin) {
        bin = [];
        edges.set(key, bin);
      }
      bin.push(i);
    }
  }
  const neigh: number[][] = Array.from({ length: kept.length }, () => []);
  for (const bin of edges.values()) {
    for (let a = 0; a < bin.length; a++) {
      for (let b = a + 1; b < bin.length; b++) {
        neigh[bin[a]].push(bin[b]);
        neigh[bin[b]].push(bin[a]);
      }
    }
  }
  type Sheet = { tris: number[]; dir: Dir; span: number; cx: number; cz: number };
  const sheets: Sheet[] = [];
  const dirs: Dir[] = new Array(kept.length);
  const seenTri = new Set<number>();
  for (let s = 0; s < kept.length; s++) {
    if (seenTri.has(s)) continue;
    const tris: number[] = [];
    const q = [s];
    seenTri.add(s);
    for (let i = 0; i < q.length; i++) {
      tris.push(q[i]);
      for (const j of neigh[q[i]]) {
        if (seenTri.has(j)) continue;
        seenTri.add(j);
        q.push(j);
      }
    }
    const pts: { x: number; z: number }[] = [];
    let areaSum = 0;
    let cx = 0;
    let cz = 0;
    for (const i of tris) {
      const t = kept[i];
      for (const p of t) pts.push({ x: p[0], z: p[1] });
      const area = Math.abs((t[1][0] - t[0][0]) * (t[2][1] - t[0][1]) - (t[2][0] - t[0][0]) * (t[1][1] - t[0][1]));
      areaSum += area;
      cx += ((t[0][0] + t[1][0] + t[2][0]) / 3) * area;
      cz += ((t[0][1] + t[1][1] + t[2][1]) / 3) * area;
    }
    const axis = principal(pts);
    if (areaSum > 0) {
      cx /= areaSum;
      cz /= areaSum;
    }
    sheets.push({ tris, dir: axis.dir, span: axis.span, cx, cz });
    for (const i of tris) dirs[i] = axis.dir;
  }
  const pos: number[] = [];
  const col: number[] = [];
  const uv: number[] = [];
  for (let i = 0; i < kept.length; i++) {
    const tri = kept[i];
    const dir = dirs[i];
    if (!dir) throw new Error(`${id} roof tile has no direction`);
    const tone = tones[i];
    const acrossX = -dir.z;
    const acrossZ = dir.x;
    for (const p of tri) {
      pos.push(p[0], ROOF_Y, p[1]);
      col.push(tone, tone, tone);
      uv.push((p[0] * dir.x + p[1] * dir.z) / 4, (p[0] * acrossX + p[1] * acrossZ) / 0.5);
      mark(p[0], p[1]);
    }
  }
  let missing = 0;
  for (const loop of loops) {
    for (const p of loop) {
      if (!seen(p[0], p[1])) missing++;
    }
  }
  if (missing) throw new Error(`${id} roof misses ${missing} curb vertices`);
  const linePos: number[] = [];
  const lineCol: number[] = [];
  const working = (hex: number) => {
    const c = new Color(hex);
    return [c.r, c.g, c.b];
  };
  const lumOf = (rgb: number[]) => 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
  const roofLin = working(SAN_ROOF);
  const hiLin = working(SAN_ROOF_HI);
  const shadeLin = working(SAN_ROOF_SHADE);
  const ink = working(0x2a2f38);
  const rawHi = ((SAN_ROOF_HI >> 16) & 255) / 255;
  if (!(roofLin[0] < rawHi && hiLin[0] < rawHi * 0.85)) throw new Error("roof overlay");
  if (!(lumOf(shadeLin) < lumOf(roofLin) && lumOf(ink) < lumOf(roofLin) * 0.5 && lumOf(hiLin) > lumOf(roofLin))) {
    throw new Error("roof overlay");
  }
  const hiCap = lumOf(hiLin) * 1.08 + 1e-4;
  const pushLine = (verts: number[][], rgb: number[]) => {
    if (lumOf(rgb) > hiCap) throw new Error("roof overlay");
    const order = [0, 2, 1, 0, 3, 2];
    for (const i of order) {
      const v = verts[i];
      linePos.push(v[0], v[1], v[2]);
      lineCol.push(rgb[0], rgb[1], rgb[2]);
    }
  };
  for (const loop of loops) {
    for (let i = 0; i < loop.length; i++) {
      const a = loop[i];
      const b = loop[(i + 1) % loop.length];
      const dx = b[0] - a[0];
      const dz = b[1] - a[1];
      const len = Math.hypot(dx, dz);
      if (len < 0.15) continue;
      let nx = -dz / len;
      let nz = dx / len;
      const mx = (a[0] + b[0]) * 0.5;
      const mz = (a[1] + b[1]) * 0.5;
      if (!sanLot(id, mx + nx * 0.9, mz + nz * 0.9)) {
        if (!sanLot(id, mx - nx * 0.9, mz - nz * 0.9)) continue;
        nx = -nx;
        nz = -nz;
      }
      const ox = nx * 0.3;
      const oz = nz * 0.3;
      pushLine(
        [
          [a[0], LINE_Y, a[1]],
          [b[0], LINE_Y, b[1]],
          [b[0] + ox, LINE_Y, b[1] + oz],
          [a[0] + ox, LINE_Y, a[1] + oz],
        ],
        ink,
      );
    }
  }
  type Ridge = { ax: number; az: number; bx: number; bz: number; dir: Dir; tone: number; block: number };
  const inTri = (t: Tri, x: number, z: number) => {
    const cross = (ax: number, az: number, bx: number, bz: number) => (bx - ax) * (z - az) - (bz - az) * (x - ax);
    const s0 = cross(t[0][0], t[0][1], t[1][0], t[1][1]);
    const s1 = cross(t[1][0], t[1][1], t[2][0], t[2][1]);
    const s2 = cross(t[2][0], t[2][1], t[0][0], t[0][1]);
    const neg = s0 < -1e-4 || s1 < -1e-4 || s2 < -1e-4;
    const pos = s0 > 1e-4 || s1 > 1e-4 || s2 > 1e-4;
    return !(neg && pos);
  };
  const ridges: Ridge[] = [];
  for (let block = 0; block < sheets.length; block++) {
    const sheet = sheets[block];
    if (sheet.span < 4) continue;
    const bounds: { a: P; b: P }[] = [];
    const count = new Map<string, { a: P; b: P; n: number }>();
    for (const ti of sheet.tris) {
      const tri = kept[ti];
      for (let k = 0; k < 3; k++) {
        const a = tri[k];
        const b = tri[(k + 1) % 3];
        const key = edgeKey(a, b);
        const rec = count.get(key);
        if (rec) rec.n++;
        else count.set(key, { a, b, n: 1 });
      }
    }
    for (const rec of count.values()) if (rec.n === 1) bounds.push(rec);
    if (!sheet.tris.some((ti) => inTri(kept[ti], sheet.cx, sheet.cz))) continue;
    const dx = sheet.dir.x;
    const dz = sheet.dir.z;
    const hits: number[] = [];
    for (const e of bounds) {
      const ex = e.b[0] - e.a[0];
      const ez = e.b[1] - e.a[1];
      const den = dx * ez - dz * ex;
      if (Math.abs(den) < 1e-8) continue;
      const t = ((e.a[0] - sheet.cx) * ez - (e.a[1] - sheet.cz) * ex) / den;
      const u = ((e.a[0] - sheet.cx) * dz - (e.a[1] - sheet.cz) * dx) / den;
      if (u < -1e-3 || u > 1 + 1e-3) continue;
      hits.push(t);
    }
    hits.sort((p, q) => p - q);
    const uniq: number[] = [];
    for (const h of hits) if (!uniq.length || Math.abs(h - uniq[uniq.length - 1]) > 0.05) uniq.push(h);
    let chord: { ax: number; az: number; bx: number; bz: number } | null = null;
    for (let i = 0; i + 1 < uniq.length; i++) {
      if (uniq[i] > 0.05 || uniq[i + 1] < -0.05) continue;
      if (uniq[i + 1] - uniq[i] < 4) break;
      chord = {
        ax: sheet.cx + dx * uniq[i],
        az: sheet.cz + dz * uniq[i],
        bx: sheet.cx + dx * uniq[i + 1],
        bz: sheet.cz + dz * uniq[i + 1],
      };
      break;
    }
    if (!chord) continue;
    let inside = true;
    for (const t of [0.2, 0.4, 0.6, 0.8]) {
      const x = chord.ax + (chord.bx - chord.ax) * t;
      const z = chord.az + (chord.bz - chord.az) * t;
      if (!sheet.tris.some((ti) => inTri(kept[ti], x, z))) {
        inside = false;
        break;
      }
    }
    if (!inside) continue;
    const home = at(sheet.cx, sheet.cz);
    ridges.push({ ...chord, dir: sheet.dir, tone: home ? home.tone : 0.96, block });
  }
  const crosses = (a: Ridge, b: Ridge) => {
    const o = (ax: number, az: number, bx: number, bz: number, cx: number, cz: number) => (bx - ax) * (cz - az) - (bz - az) * (cx - ax);
    const o1 = o(a.ax, a.az, a.bx, a.bz, b.ax, b.az);
    const o2 = o(a.ax, a.az, a.bx, a.bz, b.bx, b.bz);
    const o3 = o(b.ax, b.az, b.bx, b.bz, a.ax, a.az);
    const o4 = o(b.ax, b.az, b.bx, b.bz, a.bx, a.bz);
    return o1 * o2 < 0 && o3 * o4 < 0;
  };
  const endsInside = (a: Ridge, b: Ridge) => {
    const dx = b.bx - b.ax;
    const dz = b.bz - b.az;
    const l2 = dx * dx + dz * dz || 1;
    const hit = (px: number, pz: number) => {
      const t = ((px - b.ax) * dx + (pz - b.az) * dz) / l2;
      if (t <= 0.03 || t >= 0.97) return false;
      return Math.hypot(px - (b.ax + dx * t), pz - (b.az + dz * t)) < 0.08;
    };
    return hit(a.ax, a.az) || hit(a.bx, a.bz);
  };
  let sweep = 0;
  while (sweep++ < ridges.length + 2) {
    let drop = -1;
    for (let i = 0; i < ridges.length && drop < 0; i++) {
      for (let j = i + 1; j < ridges.length; j++) {
        if (!crosses(ridges[i], ridges[j]) && !endsInside(ridges[i], ridges[j]) && !endsInside(ridges[j], ridges[i])) continue;
        const li = Math.hypot(ridges[i].bx - ridges[i].ax, ridges[i].bz - ridges[i].az);
        const lj = Math.hypot(ridges[j].bx - ridges[j].ax, ridges[j].bz - ridges[j].az);
        drop = li <= lj ? i : j;
        break;
      }
    }
    if (drop < 0) break;
    ridges.splice(drop, 1);
  }
  const perBlock = new Map<number, number>();
  for (let i = 0; i < ridges.length; i++) {
    const n = (perBlock.get(ridges[i].block) ?? 0) + 1;
    if (n > 1) throw new Error(`${id} ridge count`);
    perBlock.set(ridges[i].block, n);
    for (let j = i + 1; j < ridges.length; j++) {
      if (crosses(ridges[i], ridges[j]) || endsInside(ridges[i], ridges[j]) || endsInside(ridges[j], ridges[i])) {
        throw new Error(`${id} ridge cross`);
      }
    }
  }
  for (const ridge of ridges) {
    const nx = -ridge.dir.z;
    const nz = ridge.dir.x;
    const local = roofLin.map((c) => c * ridge.tone);
    const hi = hiLin.map((c) => c * ridge.tone);
    const shade = shadeLin.map((c) => c * ridge.tone);
    if (lumOf(shade) >= lumOf(local) || lumOf(hi) <= lumOf(local) || lumOf(hi) > hiCap) throw new Error("roof overlay");
    const band = 0.055;
    const s0 = 0.04;
    const s1 = 0.095;
    pushLine(
      [
        [ridge.ax - nx * band, RIDGE_Y, ridge.az - nz * band],
        [ridge.bx - nx * band, RIDGE_Y, ridge.bz - nz * band],
        [ridge.bx + nx * band, RIDGE_Y, ridge.bz + nz * band],
        [ridge.ax + nx * band, RIDGE_Y, ridge.az + nz * band],
      ],
      hi,
    );
    pushLine(
      [
        [ridge.ax + nx * s0, RIDGE_Y + 0.008, ridge.az + nz * s0],
        [ridge.bx + nx * s0, RIDGE_Y + 0.008, ridge.bz + nz * s0],
        [ridge.bx + nx * s1, RIDGE_Y + 0.008, ridge.bz + nz * s1],
        [ridge.ax + nx * s1, RIDGE_Y + 0.008, ridge.az + nz * s1],
      ],
      shade,
    );
  }
  return {
    pos: Float32Array.from(pos),
    col: Float32Array.from(col),
    uv: Float32Array.from(uv),
    linePos: Float32Array.from(linePos),
    lineCol: Float32Array.from(lineCol),
    tris: pos.length / 9,
    lineTris: linePos.length / 9,
  };
}

function slateTiles() {
  const canvas = document.createElement("canvas");
  const size = 32;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("roof tiles");
  const img = ctx.createImageData(size, size);
  const base = [(SAN_ROOF >> 16) & 255, (SAN_ROOF >> 8) & 255, SAN_ROOF & 255];
  const line = base.map((c) => Math.round(c * 0.9));
  const lumByte = (rgb: number[]) => {
    const ch = (u: number) => {
      const c = u / 255;
      return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * ch(rgb[0]) + 0.7152 * ch(rgb[1]) + 0.0722 * ch(rgb[2]);
  };
  if (!(lumByte(line) < lumByte(base))) throw new Error("roof tile brighter than base");
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const src = y < 4 ? line : base;
      for (let k = 0; k < 3; k++) {
        if (src[k] > base[k]) throw new Error("roof tile brighter than base");
      }
      const i = (y * size + x) * 4;
      img.data[i] = src[0];
      img.data[i + 1] = src[1];
      img.data[i + 2] = src[2];
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  const tex = new CanvasTexture(canvas);
  tex.colorSpace = SRGBColorSpace;
  tex.wrapS = RepeatWrapping;
  tex.wrapT = RepeatWrapping;
  tex.magFilter = LinearFilter;
  tex.minFilter = LinearMipmapLinearFilter;
  tex.generateMipmaps = true;
  tex.anisotropy = 8;
  return tex;
}

let tiles: CanvasTexture | null = null;
let roofMat: MeshBasicMaterial | null = null;
let lineMat: MeshBasicMaterial | null = null;

export function mountSanRoofs(scene: SceneLike, tag: Tag) {
  if (!tiles) tiles = slateTiles();
  if (!roofMat) roofMat = new MeshBasicMaterial({ map: tiles, color: 0xffffff, vertexColors: true, fog: false, side: DoubleSide });
  if (!lineMat) lineMat = new MeshBasicMaterial({ color: 0xffffff, vertexColors: true, fog: false, side: DoubleSide });
  for (const id of ["south", "north", "port"] as const) {
    const data = buildSanRoof(id);
    const geo = new BufferGeometry();
    geo.setAttribute("position", new Float32BufferAttribute(data.pos, 3));
    geo.setAttribute("color", new Float32BufferAttribute(data.col, 3));
    geo.setAttribute("uv", new Float32BufferAttribute(data.uv, 2));
    const mesh = new Mesh(geo, roofMat);
    mesh.name = "sandoria-roof";
    mesh.castShadow = false;
    mesh.receiveShadow = false;
    scene.add(mesh);
    geo.computeBoundingBox();
    const box = geo.boundingBox;
    if (!box) throw new Error(`${id} roof bounds`);
    tag(mesh, box.min.x, box.max.x, box.min.z, box.max.z);
    const lineGeo = new BufferGeometry();
    lineGeo.setAttribute("position", new Float32BufferAttribute(data.linePos, 3));
    lineGeo.setAttribute("color", new Float32BufferAttribute(data.lineCol, 3));
    const line = new Mesh(lineGeo, lineMat);
    line.name = "sandoria-roof-line";
    line.castShadow = false;
    line.receiveShadow = false;
    scene.add(line);
    lineGeo.computeBoundingBox();
    const lineBox = lineGeo.boundingBox;
    if (!lineBox) continue;
    tag(line, lineBox.min.x, lineBox.max.x, lineBox.min.z, lineBox.max.z);
  }
}
