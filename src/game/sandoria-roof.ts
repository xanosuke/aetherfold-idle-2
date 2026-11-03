/**
 * Flat vector roofs for San d'Oria. Each district is one mesh.
 * Street edges are the curb outlines, so the slate sits flush on the wall.
 */
import {
  BufferGeometry,
  CanvasTexture,
  DoubleSide,
  Float32BufferAttribute,
  LinearFilter,
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
import { inNorthGraph, inPortGraph, inSouthGraph, sanDraw, sanLot } from "./sandoria-graph";

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

type Building = {
  ring: { x: number; z: number }[];
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  cx: number;
  cz: number;
  longX: boolean;
  tone: number;
};

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
    const tone = 0.86 + (n - Math.floor(n)) * 0.28;
    const index = buildings.length;
    buildings.push({
      ring,
      minX,
      maxX,
      minZ,
      maxZ,
      cx: (minX + maxX) / 2,
      cz: (minZ + maxZ) / 2,
      longX: maxX - minX >= maxZ - minZ,
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
  const { buildings, at } = buildBuildings(id);
  const pos: number[] = [];
  const col: number[] = [];
  const uv: number[] = [];
  for (const tri of kept) {
    const cx = (tri[0][0] + tri[1][0] + tri[2][0]) / 3;
    const cz = (tri[0][1] + tri[1][1] + tri[2][1]) / 3;
    const home = at(cx, cz);
    let longX = home ? home.longX : false;
    if (!home) {
      let minX = Infinity;
      let maxX = -Infinity;
      let minZ = Infinity;
      let maxZ = -Infinity;
      for (const p of tri) {
        if (p[0] < minX) minX = p[0];
        if (p[0] > maxX) maxX = p[0];
        if (p[1] < minZ) minZ = p[1];
        if (p[1] > maxZ) maxZ = p[1];
      }
      longX = maxX - minX >= maxZ - minZ;
    }
    const tone = home ? home.tone : 0.96;
    for (const p of tri) {
      const along = longX ? p[0] : p[1];
      const across = longX ? p[1] : p[0];
      pos.push(p[0], ROOF_Y, p[1]);
      col.push(tone, tone * 0.98, tone * 0.96);
      uv.push(along / 3.84, across / 1.64);
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
  const ink = [0x2a / 255, 0x2f / 255, 0x38 / 255];
  const ridge = [0x3a / 255, 0x42 / 255, 0x4c / 255];
  const pushLine = (verts: number[][], rgb: number[]) => {
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
  for (const b of buildings) {
    if (!pointInRing(b.ring, b.cx, b.cz)) continue;
    const span = b.longX ? b.maxX - b.minX : b.maxZ - b.minZ;
    if (span < 1.4) continue;
    let reach = span * 0.42;
    for (let attempt = 0; attempt < 3 && reach > 0.6; attempt++, reach *= 0.72) {
      const ax = b.cx + (b.longX ? -reach : 0);
      const az = b.cz + (b.longX ? 0 : -reach);
      const bx = b.cx + (b.longX ? reach : 0);
      const bz = b.cz + (b.longX ? 0 : reach);
      if (walk(b.cx, b.cz) || walk(ax, az) || walk(bx, bz)) continue;
      if (!sanLot(id, b.cx, b.cz) || !sanLot(id, ax, az) || !sanLot(id, bx, bz)) continue;
      const px = b.longX ? 0 : 0.11;
      const pz = b.longX ? 0.11 : 0;
      pushLine(
        [
          [ax - px, RIDGE_Y, az - pz],
          [bx - px, RIDGE_Y, bz - pz],
          [bx + px, RIDGE_Y, bz + pz],
          [ax + px, RIDGE_Y, az + pz],
        ],
        ridge,
      );
      break;
    }
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
  canvas.width = 64;
  canvas.height = 32;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("roof tiles");
  const img = ctx.createImageData(64, 32);
  for (let y = 0; y < 32; y++) {
    const course = y >> 4;
    const row = y & 15;
    const stagger = course ? 8 : 0;
    for (let x = 0; x < 64; x++) {
      const sx = (x + stagger) & 63;
      const tile = (sx >> 4) + course * 7;
      const n = Math.sin(tile * 12.9898 + 4.2) * 43758.5453;
      const f = n - Math.floor(n);
      let r = 108 + f * 18;
      let g = 114 + f * 10;
      let b = 126 + f * 8;
      if (row < 1 || (sx & 15) === 0) {
        r = 48;
        g = 54;
        b = 64;
      }
      const i = (y * 64 + x) * 4;
      img.data[i] = r;
      img.data[i + 1] = g;
      img.data[i + 2] = b;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  const tex = new CanvasTexture(canvas);
  tex.colorSpace = SRGBColorSpace;
  tex.wrapS = RepeatWrapping;
  tex.wrapT = RepeatWrapping;
  tex.magFilter = LinearFilter;
  tex.minFilter = LinearFilter;
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
