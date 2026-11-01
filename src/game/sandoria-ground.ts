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
import { SAN_PAINT } from "./sandoria-paint.generated.ts";
import { SAN_CREAM, SAN_PROPS, SAN_RIDGE, SAN_SLATE, sanDraw, sanEave, sanNorthHeight, type SanProp } from "./sandoria-graph";

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
const SLATE = hexRgb(SAN_SLATE);
const RIDGE = hexRgb(SAN_RIDGE);

function pushBit(pos: number[], col: number[], idx: number[], shell: number[], bit: SanProp) {
  const verts = bit.shape === "cyl" ? CYL.verts : BOX;
  const faces = bit.shape === "cyl" ? CYL.faces : BOX_FACES;
  const wall = hexRgb(bit.color);
  const roof = hexRgb(bit.roof ?? bit.color);
  let base = pos.length / 3;
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
      shell.push(x + dx * k, y - 0.04, z + dz * k);
    }
    idx.push(base, base + 2, base + 1);
    base += 3;
  }
}

type XZ = { x: number; z: number };

function signedArea(ring: XZ[]) {
  let area = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    area += ring[j].x * ring[i].z - ring[i].x * ring[j].z;
  }
  return area / 2;
}

function pointInTri(p: XZ, a: XZ, b: XZ, c: XZ) {
  const c1 = (b.x - a.x) * (p.z - a.z) - (b.z - a.z) * (p.x - a.x);
  const c2 = (c.x - b.x) * (p.z - b.z) - (c.z - b.z) * (p.x - b.x);
  const c3 = (a.x - c.x) * (p.z - c.z) - (a.z - c.z) * (p.x - c.x);
  const neg = c1 < 0 || c2 < 0 || c3 < 0;
  const pos = c1 > 0 || c2 > 0 || c3 > 0;
  return !(neg && pos);
}

function triangulate(ring: XZ[]) {
  const idx = ring.map((_, i) => i);
  const tris: number[] = [];
  const ccw = signedArea(ring) >= 0;
  const cross = (i: number, j: number, k: number) => {
    const a = ring[i];
    const b = ring[j];
    const c = ring[k];
    return (b.x - a.x) * (c.z - a.z) - (b.z - a.z) * (c.x - a.x);
  };
  let guard = 0;
  while (idx.length > 3 && guard++ < ring.length * ring.length) {
    let clipped = false;
    for (let i = 0; i < idx.length; i++) {
      const i0 = idx[(i + idx.length - 1) % idx.length];
      const i1 = idx[i];
      const i2 = idx[(i + 1) % idx.length];
      const turn = cross(i0, i1, i2);
      if (ccw ? turn <= 1e-6 : turn >= -1e-6) continue;
      let inside = false;
      for (const p of idx) {
        if (p === i0 || p === i1 || p === i2) continue;
        if (pointInTri(ring[p], ring[i0], ring[i1], ring[i2])) {
          inside = true;
          break;
        }
      }
      if (inside) continue;
      tris.push(i0, i1, i2);
      idx.splice(i, 1);
      clipped = true;
      break;
    }
    if (!clipped) break;
  }
  if (idx.length === 3) tris.push(idx[0], idx[1], idx[2]);
  return tris;
}

function pushBuildings(pos: number[], col: number[], idx: number[], shell: number[], id: "south" | "north" | "port") {
  const buildings = sanDraw(id).buildings;
  buildings.forEach((ring, n) => {
    if (ring.length < 3) return;
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
    const wobble = ((n * 17) % 5) - 2;
    const wall: [number, number, number] = [
      Math.min(0.78, Math.max(0.55, CREAM[0] + wobble / 255)),
      Math.min(0.62, Math.max(0.42, CREAM[1] + (wobble * 0.6) / 255)),
      Math.min(0.48, Math.max(0.28, CREAM[2] + (wobble * 0.4) / 255)),
    ];
    const area = signedArea(ring);
    const sign = area >= 0 ? 1 : -1;
    const heights = ring.map((p) => sanEave(p.z, zMin, zMax, north));
    const outward = ring.map((p, i) => {
      const a = ring[(i + ring.length - 1) % ring.length];
      const b = ring[(i + 1) % ring.length];
      const e1x = p.x - a.x;
      const e1z = p.z - a.z;
      const e2x = b.x - p.x;
      const e2z = b.z - p.z;
      const l1 = Math.hypot(e1x, e1z) || 1;
      const l2 = Math.hypot(e2x, e2z) || 1;
      const ox = (e1z / l1 + e2z / l2) * sign;
      const oz = (-e1x / l1 + -e2x / l2) * sign;
      const len = Math.hypot(ox, oz) || 1;
      return { x: (ox / len) * 0.07, z: (oz / len) * 0.07 };
    });
    const base = pos.length / 3;
    for (let i = 0; i < ring.length; i++) {
      const j = (i + 1) % ring.length;
      const a = ring[i];
      const b = ring[j];
      const ha = heights[i];
      const hb = heights[j];
      const verts = [
        [a.x, 0.08, a.z],
        [b.x, 0.08, b.z],
        [b.x, hb, b.z],
        [a.x, ha, a.z],
      ];
      const start = pos.length / 3;
      for (const v of verts) {
        pos.push(v[0], v[1], v[2]);
        col.push(wall[0], wall[1], wall[2]);
        shell.push(v[0] + outward[i].x, v[1] - 0.04, v[2] + outward[i].z);
      }
      idx.push(start, start + 1, start + 2, start, start + 2, start + 3);
    }
    const roof = triangulate(ring);
    const spanX = Math.max(0.001, ...ring.map((p) => p.x)) - Math.min(...ring.map((p) => p.x));
    const spanZ = zMax - zMin || 0.001;
    const alongX = spanX >= spanZ;
    for (let t = 0; t < roof.length; t += 3) {
      const start = pos.length / 3;
      for (const vi of [roof[t], roof[t + 1], roof[t + 2]]) {
        const p = ring[vi];
        const u = alongX ? Math.min(1, (Math.abs(p.z - cz) / (spanZ * 0.5)) * 1.15) : Math.min(1, (Math.abs(p.x - cx) / (spanX * 0.5)) * 1.15);
        pos.push(p.x, heights[vi], p.z);
        col.push(RIDGE[0] + (SLATE[0] - RIDGE[0]) * u, RIDGE[1] + (SLATE[1] - RIDGE[1]) * u, RIDGE[2] + (SLATE[2] - RIDGE[2]) * u);
        const o = outward[vi];
        shell.push(p.x + o.x, heights[vi] - 0.04, p.z + o.z);
      }
      idx.push(start, start + 2, start + 1);
    }
    void base;
  });
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

export function mountSanDoria(scene: SceneLike, tag: Tag, colliders: Box[]) {
  const floors: Mesh[] = [];
  const ink = new MeshBasicMaterial({ color: 0x111014, side: 1, fog: false });
  const paint = new MeshBasicMaterial({ color: 0xffffff, vertexColors: true, fog: false });
  for (const id of ["south", "north", "port"] as const) {
    const floor = floorMesh(id);
    const tile = SAN_PAINT[id];
    scene.add(floor);
    tag(floor, tile.minX, tile.maxX, tile.minZ, tile.maxZ);
    floors.push(floor);
    const pos: number[] = [];
    const col: number[] = [];
    const idx: number[] = [];
    const shell: number[] = [];
    let minX = Infinity;
    let maxX = -Infinity;
    let minZ = Infinity;
    let maxZ = -Infinity;
    pushBuildings(pos, col, idx, shell, id);
    for (const bit of SAN_PROPS[id]) {
      pushBit(pos, col, idx, shell, bit);
      minX = Math.min(minX, bit.x - bit.sx);
      maxX = Math.max(maxX, bit.x + bit.sx);
      minZ = Math.min(minZ, bit.z - bit.sz);
      maxZ = Math.max(maxZ, bit.z + bit.sz);
    }
    for (const ring of sanDraw(id).buildings) {
      for (const p of ring) {
        minX = Math.min(minX, p.x);
        maxX = Math.max(maxX, p.x);
        minZ = Math.min(minZ, p.z);
        maxZ = Math.max(maxZ, p.z);
      }
    }
    if (!pos.length) continue;
    const geo = new BufferGeometry();
    geo.setAttribute("position", new Float32BufferAttribute(pos, 3));
    geo.setAttribute("color", new Float32BufferAttribute(col, 3));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    const mesh = new Mesh(geo, paint);
    mesh.name = "sandoria-prop";
    mesh.castShadow = false;
    mesh.receiveShadow = false;
    const hullGeo = new BufferGeometry();
    hullGeo.setAttribute("position", new Float32BufferAttribute(shell, 3));
    hullGeo.setIndex(idx.slice());
    const hull = new Mesh(hullGeo, ink);
    hull.name = "sandoria-outline";
    hull.castShadow = false;
    hull.receiveShadow = false;
    hull.raycast = () => {};
    scene.add(hull);
    scene.add(mesh);
    tag(mesh, minX - 1, maxX + 1, minZ - 1, maxZ + 1);
    tag(hull, minX - 1, maxX + 1, minZ - 1, maxZ + 1);
  }
  addFountain(scene, tag);
  return floors;
}
