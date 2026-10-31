/**
 * Painted San d'Oria ground and a few outlined landmarks.
 * South faces stay low. No point lights, no cast shadows.
 */
import {
  BufferGeometry,
  CanvasTexture,
  Float32BufferAttribute,
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
  tex.magFilter = NearestFilter;
  tex.minFilter = NearestFilter;
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
  addFountain(scene, tag);
  return floors;
}
