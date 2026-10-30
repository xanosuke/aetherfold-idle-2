/**
 * Painted Yughott floor: baked tiles, flat pads at traceFloorY, short south walls.
 * The heightfield still answers groundY. This file only builds the meshes.
 */
import {
  BufferGeometry,
  CanvasTexture,
  Color,
  DoubleSide,
  Float32BufferAttribute,
  FrontSide,
  Group,
  LinearFilter,
  Mesh,
  MeshBasicMaterial,
  MeshToonMaterial,
  NearestFilter,
  SRGBColorSpace,
  TextureLoader,
  type Object3D,
} from "three";
import { traceFloorY } from "./orc-height";
import { inYughottGraph, type YughottMap } from "./yughott-graph";
import { YUGHOTT_PAINT } from "./yughott-paint.generated";

type Bit = {
  kind: string;
  shape: "box" | "cone" | "cyl";
  color: number;
  sx: number;
  sy: number;
  sz: number;
  x: number;
  y: number;
  z: number;
  yaw: number;
};

type Tag = (mesh: Object3D, minX: number, maxX: number, minZ: number, maxZ: number) => void;

const loader = new TextureLoader();

function bytesOf(b64: string) {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function cellOn(bits: Uint8Array, gw: number, gh: number, i: number, j: number) {
  if (i < 0 || j < 0 || i >= gw || j >= gh) return false;
  const n = j * gw + i;
  return ((bits[n >> 3] >> (n & 7)) & 1) === 1;
}

function pushQuad(
  pos: number[],
  uv: number[],
  idx: number[],
  ax: number, az: number, bx: number, bz: number,
  y: number,
  u0: number, v0: number, u1: number, v1: number,
) {
  const base = pos.length / 3;
  pos.push(ax, y, az, bx, y, az, bx, y, bz, ax, y, bz);
  uv.push(u0, v0, u1, v0, u1, v1, u0, v1);
  idx.push(base, base + 2, base + 1, base, base + 3, base + 2);
}

function wallColor(top: boolean) {
  return top ? [0x4a / 255, 0x44 / 255, 0x54 / 255] : [0x33 / 255, 0x2e / 255, 0x39 / 255];
}

export function buildYughottPaint(tag: Tag) {
  const groups: Record<1 | 2, Group> = { 1: new Group(), 2: new Group() };
  groups[1].name = "yug-map-1";
  groups[2].name = "yug-map-2";
  const paint = YUGHOTT_PAINT;
  for (const map of [1, 2] as const) {
    const pack = map === 1 ? paint.maps["1"] : paint.maps["2"];
    const bits = bytesOf(pack.cells);
    const group = groups[map];
    let firstTile = true;
    for (const tile of pack.tiles) {
      const tileT = firstTile ? performance.now() : 0;
      const pos: number[] = [];
      const uv: number[] = [];
      const idx: number[] = [];
      pushQuad(pos, uv, idx, tile.x, tile.z, tile.x + tile.w, tile.z + tile.d, -0.04, 0, 0, 1, 1);
      const i0 = Math.max(0, Math.floor((tile.x - pack.ox) / paint.step) - 1);
      const i1 = Math.min(pack.gw, Math.ceil((tile.x + tile.w - pack.ox) / paint.step) + 1);
      const j0 = Math.max(0, Math.floor((tile.z - pack.oz) / paint.step) - 1);
      const j1 = Math.min(pack.gh, Math.ceil((tile.z + tile.d - pack.oz) / paint.step) + 1);
      for (let j = j0; j < j1; j++) {
        for (let i = i0; i < i1; i++) {
          if (!cellOn(bits, pack.gw, pack.gh, i, j)) continue;
          const x0 = pack.ox + i * paint.step;
          const z0 = pack.oz + j * paint.step;
          const x1 = x0 + paint.step;
          const z1 = z0 + paint.step;
          const cx = (x0 + x1) * 0.5;
          const cz = (z0 + z1) * 0.5;
          if (cx < tile.x || cx >= tile.x + tile.w || cz < tile.z || cz >= tile.z + tile.d) continue;
          const y = Math.max(0.03, traceFloorY(cx, cz));
          const u0 = (x0 - tile.x) / tile.w;
          const u1 = (x1 - tile.x) / tile.w;
          const v0 = (z0 - tile.z) / tile.d;
          const v1 = (z1 - tile.z) / tile.d;
          pushQuad(pos, uv, idx, x0, z0, x1, z1, y, u0, v0, u1, v1);
        }
      }
      const geo = new BufferGeometry();
      geo.setAttribute("position", new Float32BufferAttribute(pos, 3));
      geo.setAttribute("uv", new Float32BufferAttribute(uv, 2));
      geo.setIndex(idx);
      if (firstTile) {
        group.userData.paintMs = performance.now() - tileT;
        firstTile = false;
      }
      const tex = loader.load(tile.src);
      tex.colorSpace = SRGBColorSpace;
      tex.flipY = false;
      tex.magFilter = LinearFilter;
      tex.minFilter = LinearFilter;
      tex.generateMipmaps = false;
      const mat = new MeshBasicMaterial({ color: 0xffffff, map: tex, fog: false });
      const mesh = new Mesh(geo, mat);
      mesh.name = "yug-trace";
      mesh.castShadow = false;
      mesh.receiveShadow = false;
      group.add(mesh);
      tag(mesh, tile.x, tile.x + tile.w, tile.z, tile.z + tile.d);
    }
    const wpos: number[] = [];
    const wcol: number[] = [];
    const widx: number[] = [];
    const pushWall = (ax: number, az: number, bx: number, bz: number, inwardX: number, inwardZ: number, south: boolean) => {
      const mx = (ax + bx) * 0.5 + inwardX * 0.4;
      const mz = (az + bz) * 0.5 + inwardZ * 0.4;
      const y0 = Math.max(0, traceFloorY(mx, mz));
      const h = south ? 1 : 2.5;
      const y1 = y0 + h;
      const side = wallColor(false);
      const top = wallColor(true);
      const base = wpos.length / 3;
      wpos.push(ax, y0, az, bx, y0, bz, bx, y1, bz, ax, y1, az);
      wcol.push(...side, ...side, ...top, ...top);
      widx.push(base, base + 1, base + 2, base, base + 2, base + 3);
    };
    for (let j = 0; j < pack.gh; j++) {
      for (let i = 0; i < pack.gw; i++) {
        if (!cellOn(bits, pack.gw, pack.gh, i, j)) continue;
        const x0 = pack.ox + i * paint.step;
        const z0 = pack.oz + j * paint.step;
        const x1 = x0 + paint.step;
        const z1 = z0 + paint.step;
        if (!cellOn(bits, pack.gw, pack.gh, i, j + 1)) pushWall(x0, z1, x1, z1, 0, -1, true);
        if (!cellOn(bits, pack.gw, pack.gh, i, j - 1)) pushWall(x1, z0, x0, z0, 0, 1, false);
        if (!cellOn(bits, pack.gw, pack.gh, i + 1, j)) pushWall(x1, z1, x1, z0, -1, 0, false);
        if (!cellOn(bits, pack.gw, pack.gh, i - 1, j)) pushWall(x0, z0, x0, z1, 1, 0, false);
      }
    }
    if (wpos.length) {
      const geo = new BufferGeometry();
      geo.setAttribute("position", new Float32BufferAttribute(wpos, 3));
      geo.setAttribute("color", new Float32BufferAttribute(wcol, 3));
      geo.setIndex(widx);
      const mat = new MeshBasicMaterial({ vertexColors: true, side: DoubleSide });
      const mesh = new Mesh(geo, mat);
      mesh.name = "yug-wall";
      mesh.castShadow = false;
      mesh.receiveShadow = false;
      group.add(mesh);
      tag(mesh, pack.ox, pack.ox + pack.span, pack.oz, pack.oz + pack.span);
    }
  }
  return groups;
}

const boxCorners = [
  [-0.5, -0.5, -0.5], [0.5, -0.5, -0.5], [0.5, 0.5, -0.5], [-0.5, 0.5, -0.5],
  [-0.5, -0.5, 0.5], [0.5, -0.5, 0.5], [0.5, 0.5, 0.5], [-0.5, 0.5, 0.5],
];
const boxFaces = [
  [0, 1, 2, 3], [5, 4, 7, 6], [4, 0, 3, 7], [1, 5, 6, 2], [3, 2, 6, 7], [4, 5, 1, 0],
];

function coneRing(segs: number, y: number, r: number) {
  const out: number[][] = [];
  for (let i = 0; i < segs; i++) {
    const a = (i / segs) * Math.PI * 2;
    out.push([Math.cos(a) * r, y, Math.sin(a) * r]);
  }
  return out;
}

function cylinderParts(segs: number) {
  const verts: number[][] = [];
  const rows: number[][] = [];
  for (let y = 0; y <= 1; y++) {
    const row: number[] = [];
    const py = 0.5 - y;
    for (let x = 0; x <= segs; x++) {
      const theta = (x / segs) * Math.PI * 2;
      row.push(verts.length);
      verts.push([Math.sin(theta) * 0.5, py, Math.cos(theta) * 0.5]);
    }
    rows.push(row);
  }
  const faces: number[][] = [];
  for (let x = 0; x < segs; x++) {
    const a = rows[0][x];
    const b = rows[1][x];
    const c = rows[1][x + 1];
    const d = rows[0][x + 1];
    faces.push([a, b, d]);
    faces.push([b, c, d]);
  }
  const top = verts.length;
  verts.push([0, 0.5, 0]);
  const bot = verts.length;
  verts.push([0, -0.5, 0]);
  for (let x = 0; x < segs; x++) {
    faces.push([top, rows[0][x + 1], rows[0][x]]);
    faces.push([bot, rows[1][x], rows[1][x + 1]]);
  }
  return { verts, faces };
}

const CYL_SEGS = 10;
const CYL = cylinderParts(CYL_SEGS);

function appendTransformed(
  pos: number[],
  col: number[],
  idx: number[],
  outline: number[],
  verts: number[][],
  faces: number[][],
  bit: Bit,
  color: Color,
) {
  const c = Math.cos(bit.yaw || 0);
  const s = Math.sin(bit.yaw || 0);
  const base = pos.length / 3;
  for (const v of verts) {
    const x = v[0] * bit.sx;
    const y = v[1] * bit.sy;
    const z = v[2] * bit.sz;
    const wx = bit.x + x * c + z * s;
    const wy = bit.y + y;
    const wz = bit.z - x * s + z * c;
    pos.push(wx, wy, wz);
    col.push(color.r, color.g, color.b);
    const dx = wx - bit.x;
    const dy = wy - bit.y;
    const dz = wz - bit.z;
    const len = Math.hypot(dx, dy, dz) || 1;
    const k = 0.04 / len;
    outline.push(wx + dx * k, wy + dy * k, wz + dz * k);
  }
  for (const f of faces) {
    idx.push(base + f[0], base + f[1], base + f[2]);
    if (f.length === 4) idx.push(base + f[0], base + f[2], base + f[3]);
  }
}

let yugGradient: CanvasTexture | null = null;
function yughottGradient() {
  if (yugGradient) return yugGradient;
  const canvas = document.createElement("canvas");
  canvas.width = 4;
  canvas.height = 1;
  const g = canvas.getContext("2d");
  if (!g) throw new Error("gradient");
  ["#3a342c", "#8d8478", "#e4d8c8", "#fffaf3"].forEach((col, i) => {
    g.fillStyle = col;
    g.fillRect(i, 0, 1, 1);
  });
  const tex = new CanvasTexture(canvas);
  tex.magFilter = NearestFilter;
  tex.minFilter = NearestFilter;
  tex.colorSpace = SRGBColorSpace;
  yugGradient = tex;
  return tex;
}

export function buildYughottProps(groups: Record<1 | 2, Group>, bits: Bit[], tag: Tag) {
  const packs: Record<1 | 2, Bit[]> = { 1: [], 2: [] };
  for (const bit of bits) {
    const map: YughottMap = inYughottGraph(bit.x, bit.z, 0, 1) ? 1 : 2;
    packs[map].push(bit);
  }
  const tint = new Color();
  const coneSegs = 5;
  const coneVerts = [[0, 0.5, 0], ...coneRing(coneSegs, -0.5, 1)];
  const coneFaces: number[][] = [];
  for (let i = 0; i < coneSegs; i++) {
    const a = 1 + i;
    const b = 1 + ((i + 1) % coneSegs);
    coneFaces.push([0, b, a]);
    coneFaces.push([a, b, 1 + coneSegs]);
  }
  coneVerts.push([0, -0.5, 0]);
  const toon = new MeshToonMaterial({
    color: 0xffffff,
    vertexColors: true,
    gradientMap: yughottGradient(),
    fog: false,
    side: FrontSide,
  });
  const ink = new MeshBasicMaterial({ color: 0x111014, side: 1, fog: false });
  for (const map of [1, 2] as const) {
    const list = packs[map];
    if (!list.length) continue;
    const pos: number[] = [];
    const col: number[] = [];
    const idx: number[] = [];
    const shell: number[] = [];
    let minX = Infinity;
    let maxX = -Infinity;
    let minZ = Infinity;
    let maxZ = -Infinity;
    for (const bit of list) {
      tint.setHex(bit.color);
      if (bit.shape === "cone") appendTransformed(pos, col, idx, shell, coneVerts, coneFaces, bit, tint);
      else if (bit.shape === "cyl") appendTransformed(pos, col, idx, shell, CYL.verts, CYL.faces, bit, tint);
      else appendTransformed(pos, col, idx, shell, boxCorners, boxFaces, bit, tint);
      minX = Math.min(minX, bit.x);
      maxX = Math.max(maxX, bit.x);
      minZ = Math.min(minZ, bit.z);
      maxZ = Math.max(maxZ, bit.z);
    }
    const geo = new BufferGeometry();
    geo.setAttribute("position", new Float32BufferAttribute(pos, 3));
    geo.setAttribute("color", new Float32BufferAttribute(col, 3));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    const mesh = new Mesh(geo, toon);
    mesh.name = "yug-prop";
    mesh.castShadow = false;
    mesh.receiveShadow = false;
    const hullGeo = new BufferGeometry();
    hullGeo.setAttribute("position", new Float32BufferAttribute(shell, 3));
    hullGeo.setIndex(idx.slice());
    const hull = new Mesh(hullGeo, ink);
    hull.name = "yug-outline";
    hull.castShadow = false;
    hull.receiveShadow = false;
    hull.raycast = () => {};
    groups[map].add(hull, mesh);
    tag(hull, minX - 2, maxX + 2, minZ - 2, maxZ + 2);
    tag(mesh, minX - 2, maxX + 2, minZ - 2, maxZ + 2);
  }
}
