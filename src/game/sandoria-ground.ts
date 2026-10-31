/**
 * Painted San d'Oria ground and a few outlined landmarks.
 * South faces stay low. No point lights, no cast shadows.
 */
import {
  BufferGeometry,
  Float32BufferAttribute,
  LinearFilter,
  Mesh,
  MeshBasicMaterial,
  SRGBColorSpace,
  TextureLoader,
  type Object3D,
} from "three";
import { SAN_PAINT } from "./sandoria-paint.generated";
import { SAN_PROPS, type SanProp } from "./sandoria-graph";

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

function pushBit(pos: number[], col: number[], idx: number[], shell: number[], bit: SanProp) {
  const verts = bit.shape === "cyl" ? CYL.verts : BOX;
  const faces = bit.shape === "cyl" ? CYL.faces : BOX_FACES;
  const r = ((bit.color >> 16) & 255) / 255;
  const g = ((bit.color >> 8) & 255) / 255;
  const b = (bit.color & 255) / 255;
  const base = pos.length / 3;
  for (const v of verts) {
    const x = bit.x + v[0] * bit.sx;
    const y = bit.y + v[1] * bit.sy;
    const z = bit.z + v[2] * bit.sz;
    pos.push(x, y, z);
    col.push(r, g, b);
    const dx = x - bit.x;
    const dz = z - bit.z;
    const horiz = Math.hypot(dx, dz);
    const k = horiz > 1e-4 ? 0.07 / horiz : 0;
    shell.push(x + dx * k, y - 0.04, z + dz * k);
  }
  for (const f of faces) idx.push(base + f[0], base + f[2], base + f[1]);
}

export function mountSanDoria(scene: { add: (obj: Object3D) => void }, tag: Tag, colliders: Box[]) {
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
    for (const bit of SAN_PROPS[id]) {
      pushBit(pos, col, idx, shell, bit);
      minX = Math.min(minX, bit.x - bit.sx);
      maxX = Math.max(maxX, bit.x + bit.sx);
      minZ = Math.min(minZ, bit.z - bit.sz);
      maxZ = Math.max(maxZ, bit.z + bit.sz);
      if (bit.sy > 0.9) {
        colliders.push({
          minX: bit.x - bit.sx * 0.5,
          maxX: bit.x + bit.sx * 0.5,
          minZ: bit.z - bit.sz * 0.5,
          maxZ: bit.z + bit.sz * 0.5,
        });
      }
    }
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
  return floors;
}
