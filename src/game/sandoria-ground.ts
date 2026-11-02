/**
 * Painted San d'Oria ground and a few outlined landmarks.
 * South faces stay low. No point lights, no cast shadows.
 */
import {
  BufferGeometry,
  CanvasTexture,
  Float32BufferAttribute,
  LinearFilter,
  Mesh,
  MeshBasicMaterial,
  NearestFilter,
  PlaneGeometry,
  RepeatWrapping,
  SRGBColorSpace,
  TextureLoader,
  type Object3D,
} from "three";
import { SAN_CURB, SAN_PAINT } from "./sandoria-paint.generated.ts";
import { SAN_CREAM, SAN_PROPS, sanCurbHeight, sanLot, type SanProp } from "./sandoria-graph";

type Tag = (mesh: Object3D, minX: number, maxX: number, minZ: number, maxZ: number) => void;
type Box = { minX: number; maxX: number; minZ: number; maxZ: number };

const loader = new TextureLoader();

function floorMesh(id: "south" | "north" | "port") {
  const tile = SAN_PAINT[id];
  const y = 0.055;
  const geo = new BufferGeometry();
  geo.setAttribute(
    "position",
    new Float32BufferAttribute([tile.minX, y, tile.minZ, tile.maxX, y, tile.minZ, tile.maxX, y, tile.maxZ, tile.minX, y, tile.maxZ], 3),
  );
  geo.setAttribute("uv", new Float32BufferAttribute([0, 1, 1, 1, 1, 0, 0, 0], 2));
  geo.setIndex([0, 2, 1, 0, 3, 2]);
  geo.computeVertexNormals();
  const tex = loader.load(tile.url);
  tex.colorSpace = SRGBColorSpace;
  tex.magFilter = LinearFilter;
  tex.minFilter = LinearFilter;
  const mat = new MeshBasicMaterial({ map: tex, fog: false });
  const mesh = new Mesh(geo, mat);
  mesh.name = "sandoria-floor";
  mesh.castShadow = false;
  mesh.receiveShadow = false;
  return mesh;
}

const BOX = [
  [-0.5, -0.5, -0.5],
  [0.5, -0.5, -0.5],
  [0.5, 0.5, -0.5],
  [-0.5, 0.5, -0.5],
  [-0.5, -0.5, 0.5],
  [0.5, -0.5, 0.5],
  [0.5, 0.5, 0.5],
  [-0.5, 0.5, 0.5],
];
const BOX_FACES = [
  [0, 1, 2],
  [0, 2, 3],
  [4, 6, 5],
  [4, 7, 6],
  [0, 4, 5],
  [0, 5, 1],
  [1, 5, 6],
  [1, 6, 2],
  [3, 2, 6],
  [3, 6, 7],
  [0, 3, 7],
  [0, 7, 4],
];

function cylParts(segs: number) {
  const verts: number[][] = [[0, 0.5, 0], [0, -0.5, 0]];
  const faces: number[][] = [];
  for (let i = 0; i < segs; i++) {
    const a = (i / segs) * Math.PI * 2;
    verts.push([Math.cos(a) * 0.5, 0.5, Math.sin(a) * 0.5]);
    verts.push([Math.cos(a) * 0.5, -0.5, Math.sin(a) * 0.5]);
  }
  for (let i = 0; i < segs; i++) {
    const t0 = 2 + i * 2;
    const b0 = t0 + 1;
    const t1 = 2 + ((i + 1) % segs) * 2;
    const b1 = t1 + 1;
    faces.push([0, t0, t1], [1, b0, b1], [t0, t1, b1], [t0, b1, b0]);
  }
  return { verts, faces };
}
const CYL = cylParts(8);

function hexRgb(hex: number): [number, number, number] {
  return [((hex >> 16) & 255) / 255, ((hex >> 8) & 255) / 255, (hex & 255) / 255];
}

const CREAM = hexRgb(SAN_CREAM);

const INK: [number, number, number] = [0x11 / 255, 0x10 / 255, 0x14 / 255];
const CHUNK = 120;

function pushQuad(pos: number[], col: number[], idx: number[], verts: number[][], rgb: [number, number, number], wind: number[]) {
  const start = pos.length / 3;
  for (const v of verts) {
    pos.push(v[0], v[1], v[2]);
    col.push(rgb[0], rgb[1], rgb[2]);
  }
  idx.push(start + wind[0], start + wind[1], start + wind[2], start + wind[3], start + wind[4], start + wind[5]);
}

function pushCurb(pos: number[], col: number[], idx: number[], id: "south" | "north" | "port", a: readonly [number, number], b: readonly [number, number]) {
  const dx = b[0] - a[0];
  const dz = b[1] - a[1];
  const len = Math.hypot(dx, dz);
  if (len < 0.15) return;
  if (len > 6) {
    const mid: readonly [number, number] = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    pushCurb(pos, col, idx, id, a, mid);
    pushCurb(pos, col, idx, id, mid, b);
    return;
  }
  let nx = -dz / len;
  let nz = dx / len;
  const mx = (a[0] + b[0]) / 2;
  const mz = (a[1] + b[1]) / 2;
  const facePointsAtLot = sanLot(id, mx + nx * 0.9, mz + nz * 0.9);
  if (!facePointsAtLot && !sanLot(id, mx - nx * 0.9, mz - nz * 0.9)) return;
  if (!facePointsAtLot) {
    nx = -nx;
    nz = -nz;
  }
  const h = sanCurbHeight(nz);
  if (h > 1.5) throw new Error("street wall is too tall");
  const wind = facePointsAtLot ? [0, 2, 1, 0, 3, 2] : [0, 1, 2, 0, 2, 3];
  pushQuad(
    pos,
    col,
    idx,
    [
      [a[0], 0.08, a[1]],
      [b[0], 0.08, b[1]],
      [b[0], h, b[1]],
      [a[0], h, a[1]],
    ],
    CREAM,
    wind,
  );
  const cap = 0.18;
  const sx = -nx * cap;
  const sz = -nz * cap;
  const ny = dx * nz - dz * nx;
  const capWind = ny >= 0 ? [0, 1, 2, 0, 2, 3] : [0, 2, 1, 0, 3, 2];
  const ux = (dx / len) * 0.06;
  const uz = (dz / len) * 0.06;
  pushQuad(
    pos,
    col,
    idx,
    [
      [a[0] - ux + nx * 0.04, h - 0.02, a[1] - uz + nz * 0.04],
      [b[0] + ux + nx * 0.04, h - 0.02, b[1] + uz + nz * 0.04],
      [b[0] + ux + sx - nx * 0.02, h - 0.02, b[1] + uz + sz - nz * 0.02],
      [a[0] - ux + sx - nx * 0.02, h - 0.02, a[1] - uz + sz - nz * 0.02],
    ],
    INK,
    capWind,
  );
  pushQuad(
    pos,
    col,
    idx,
    [
      [a[0], h, a[1]],
      [b[0], h, b[1]],
      [b[0] + sx, h, b[1] + sz],
      [a[0] + sx, h, a[1] + sz],
    ],
    CREAM,
    capWind,
  );
}

function decimateLoop(loop: readonly (readonly [number, number])[], step: number) {
  const out: (readonly [number, number])[] = [];
  let last: readonly [number, number] | null = null;
  for (const p of loop) {
    if (last && Math.hypot(p[0] - last[0], p[1] - last[1]) < step) continue;
    out.push(p);
    last = p;
  }
  return out.length >= 4 ? out : loop;
}

function pushBit(pos: number[], col: number[], idx: number[], shell: number[], shellIdx: number[], bit: SanProp) {
  const verts = bit.shape === "cyl" ? CYL.verts : BOX;
  const faces = bit.shape === "cyl" ? CYL.faces : BOX_FACES;
  const wall = hexRgb(bit.color);
  const roof = hexRgb(bit.roof ?? bit.color);
  let base = pos.length / 3;
  let sb = shell.length / 3;
  for (let fi = 0; fi < faces.length; fi++) {
    const face = faces[fi];
    const rgb = bit.shape === "box" && (fi === 8 || fi === 9) ? roof : wall;
    for (const vi of face) {
      const v = verts[vi];
      const x = bit.x + v[0] * bit.sx;
      const y = bit.y + v[1] * bit.sy;
      const z = bit.z + v[2] * bit.sz;
      pos.push(x, y, z);
      col.push(rgb[0], rgb[1], rgb[2]);
      const dx = x - bit.x;
      const dz = z - bit.z;
      const horiz = Math.hypot(dx, dz);
      const k = horiz > 1e-4 ? 0.07 / horiz : 0;
      shell.push(x + dx * k, Math.min(1.49, y - 0.04), z + dz * k);
    }
    idx.push(base, base + 2, base + 1);
    shellIdx.push(sb, sb + 2, sb + 1);
    base += 3;
    sb += 3;
  }
}

type SceneLike = { add: (obj: Object3D) => void; userData: Record<string, unknown> };

function addFountain(scene: SceneLike, tag: Tag) {
  const fountain = SAN_PROPS.south.find((bit) => bit.id === "fountain");
  if (!fountain) return;
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.fillStyle = "#1a4d62";
  ctx.fillRect(0, 0, 64, 64);
  ctx.fillStyle = "rgba(186, 224, 232, 0.7)";
  ctx.fillRect(0, 6, 64, 5);
  ctx.fillRect(0, 24, 64, 3);
  ctx.fillRect(0, 40, 64, 6);
  ctx.fillRect(0, 54, 64, 3);
  const tex = new CanvasTexture(canvas);
  tex.colorSpace = SRGBColorSpace;
  tex.wrapS = RepeatWrapping;
  tex.wrapT = RepeatWrapping;
  tex.repeat.set(2, 2);
  tex.magFilter = NearestFilter;
  tex.minFilter = NearestFilter;
  const mat = new MeshBasicMaterial({ map: tex, color: 0x2f7f96, fog: false });
  const geo = new PlaneGeometry(fountain.sx * 0.72, fountain.sz * 0.72);
  geo.rotateX(-Math.PI / 2);
  const mesh = new Mesh(geo, mat);
  mesh.position.set(fountain.x, fountain.y + fountain.sy * 0.5 + 0.04, fountain.z);
  mesh.name = "sandoria-water";
  mesh.castShadow = false;
  mesh.receiveShadow = false;
  scene.add(mesh);
  scene.userData.sanWater = mat;
  const pad = fountain.sx;
  tag(mesh, fountain.x - pad, fountain.x + pad, fountain.z - pad, fountain.z + pad);
}

export function mountSanDoria(scene: SceneLike, tag: Tag, _colliders: Box[]) {
  const floors: Mesh[] = [];
  for (const id of ["south", "north", "port"] as const) {
    const floor = floorMesh(id);
    const tile = SAN_PAINT[id];
    scene.add(floor);
    tag(floor, tile.minX, tile.maxX, tile.minZ, tile.maxZ);
    floors.push(floor);
    type Chunk = {
      segs: [readonly [number, number], readonly [number, number]][];
      props: SanProp[];
      minX: number;
      maxX: number;
      minZ: number;
      maxZ: number;
    };
    const groups = new Map<string, Chunk>();
    const take = (x: number, z: number) => {
      const key = `${Math.floor(x / CHUNK)}:${Math.floor(z / CHUNK)}`;
      let group = groups.get(key);
      if (!group) {
        group = { segs: [], props: [], minX: x, maxX: x, minZ: z, maxZ: z };
        groups.set(key, group);
      }
      if (x < group.minX) group.minX = x;
      if (x > group.maxX) group.maxX = x;
      if (z < group.minZ) group.minZ = z;
      if (z > group.maxZ) group.maxZ = z;
      return group;
    };
    for (const loop of SAN_CURB[id]) {
      const ring = decimateLoop(loop, 0.92);
      for (let i = 0; i < ring.length; i++) {
        const a = ring[i];
        const b = ring[(i + 1) % ring.length];
        const group = take((a[0] + b[0]) / 2, (a[1] + b[1]) / 2);
        group.segs.push([a, b]);
        if (a[0] < group.minX) group.minX = a[0];
        if (b[0] < group.minX) group.minX = b[0];
        if (a[0] > group.maxX) group.maxX = a[0];
        if (b[0] > group.maxX) group.maxX = b[0];
        if (a[1] < group.minZ) group.minZ = a[1];
        if (b[1] < group.minZ) group.minZ = b[1];
        if (a[1] > group.maxZ) group.maxZ = a[1];
        if (b[1] > group.maxZ) group.maxZ = b[1];
      }
    }
    for (const bit of SAN_PROPS[id]) {
      const group = take(bit.x, bit.z);
      group.props.push(bit);
      group.minX = Math.min(group.minX, bit.x - bit.sx);
      group.maxX = Math.max(group.maxX, bit.x + bit.sx);
      group.minZ = Math.min(group.minZ, bit.z - bit.sz);
      group.maxZ = Math.max(group.maxZ, bit.z + bit.sz);
    }
    for (const group of groups.values()) {
      const pos: number[] = [];
      const col: number[] = [];
      const idx: number[] = [];
      const shell: number[] = [];
      const shellIdx: number[] = [];
      for (const [a, b] of group.segs) pushCurb(pos, col, idx, id, a, b);
      for (const bit of group.props) pushBit(pos, col, idx, shell, shellIdx, bit);
      if (!pos.length) continue;
      const geo = new BufferGeometry();
      geo.setAttribute("position", new Float32BufferAttribute(pos, 3));
      geo.setAttribute("color", new Float32BufferAttribute(col, 3));
      geo.setIndex(idx);
      const paint = new MeshBasicMaterial({ color: 0xffffff, vertexColors: true, fog: false, side: 2 });
      const mesh = new Mesh(geo, paint);
      mesh.name = "sandoria-prop";
      mesh.castShadow = false;
      mesh.receiveShadow = false;
      scene.add(mesh);
      tag(mesh, group.minX - 1, group.maxX + 1, group.minZ - 1, group.maxZ + 1);
      if (!shellIdx.length) continue;
      const hullGeo = new BufferGeometry();
      hullGeo.setAttribute("position", new Float32BufferAttribute(shell, 3));
      hullGeo.setIndex(shellIdx);
      const ink = new MeshBasicMaterial({ color: 0x111014, side: 1, fog: false });
      const hull = new Mesh(hullGeo, ink);
      hull.name = "sandoria-outline";
      hull.castShadow = false;
      hull.receiveShadow = false;
      scene.add(hull);
      tag(hull, group.minX - 1, group.maxX + 1, group.minZ - 1, group.maxZ + 1);
    }
  }
  addFountain(scene, tag);
  return floors;
}
