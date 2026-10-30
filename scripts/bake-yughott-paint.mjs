/** Bake Yughott painted-ground tiles. Run with tsx after the heightfield bake. */
import { deflateSync } from "node:zlib";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { YUGHOTT_CELL, YUGHOTT_GEO, YUGHOTT_ORIGINS } from "../src/game/yughott-graph.ts";
import { dressOrcCamps, campProps, yughottPoolSpecs, poolRadiusAt } from "../src/game/orc-dress.ts";
import { seatedFortPois, seatedYughottPois } from "../src/game/orc-height.ts";
import { ORC_GATES } from "../src/game/ghelsba.ts";

const root = resolve(import.meta.dirname, "..");
const pub = resolve(root, "public/yughott");
const outTs = resolve(root, "src/game/yughott-paint.generated.ts");
const RES = 4;
const TILE = 256;
const PAD = 96;
const STEP = 4;
const MAPS = [1, 2];

const POOLS = yughottPoolSpecs();

function rimKind(x, z) {
  for (const pool of POOLS) {
    const edge = poolRadiusAt(pool.x, pool.z, pool.water, x, z);
    const dist = Math.hypot(x - pool.x, z - pool.z);
    const ang = Math.atan2(z - pool.z, x - pool.x);
    const sector = Math.floor(((ang + Math.PI) / (Math.PI * 2)) * 11);
    const width = 0.4 + ((sector * 5) % 4) * 0.1;
    const t = dist - edge;
    if (t >= 0 && t < 0.12) return "lip";
    if (t >= 0.12 && t < width) return "stone";
  }
  return "";
}

function shadowSpots() {
  const avoid = [];
  for (const gate of ORC_GATES) {
    avoid.push({ x: gate.x, z: gate.z, r: 4.2 });
    avoid.push({ x: gate.arrive.x, z: gate.arrive.z, r: 4.2 });
  }
  for (const poi of [...seatedFortPois(), ...seatedYughottPois()]) {
    avoid.push({ x: poi.x, z: poi.z, r: poi.id.startsWith("chest") ? 2.4 : 1.8 });
  }
  const hooks = {
    dome(add, x, z) { add(0x222222, 0.2, 0.2, 0.2, x, 0.1, z); },
    tripod(add, x, z) { add(0x222222, 0.4, 0.2, 0.4, x, 0.1, z); },
    dead(add, x, z) { add(0x222222, 0.2, 0.2, 0.2, x, 0.1, z); },
    emblem() {},
    rope() {},
    crystal(add, x, z) { add(0x88ccff, 0.3, 1.2, 0.3, x, 0.6, z); },
  };
  dressOrcCamps(() => {}, [], hooks, avoid);
  return campProps().filter((p) => p.zone === "yughott" && p.h > 0.35 && !p.id.endsWith("-pool"));
}

const SHADOWS = shadowSpots();

function stampShadows(rgba, pw, ph, tileX, tileZ, map) {
  for (const p of SHADOWS) {
    if (p.map !== map) continue;
    const cx = p.x + 0.6;
    const cz = p.z + 0.45;
    const rx = 1.15 + Math.min(p.h, 3) * 0.2;
    const rz = 0.8 + Math.min(p.h, 3) * 0.14;
    const i0 = Math.floor((cx - rx - tileX) * RES) - 1;
    const i1 = Math.ceil((cx + rx - tileX) * RES) + 1;
    const j0 = Math.floor((cz - rz - tileZ) * RES) - 1;
    const j1 = Math.ceil((cz + rz - tileZ) * RES) + 1;
    for (let row = j0; row <= j1; row++) {
      if (row < 0 || row >= ph) continue;
      for (let col = i0; col <= i1; col++) {
        if (col < 0 || col >= pw) continue;
        const wx = tileX + (col + 0.5) / RES;
        const wz = tileZ + (row + 0.5) / RES;
        const e = ((wx - cx) / rx) ** 2 + ((wz - cz) / rz) ** 2;
        if (e >= 1) continue;
        const a = 0.35 * (1 - e) * (1 - e);
        const px = (row * pw + col) * 4;
        let r = rgba[px] * (1 - a);
        let g = rgba[px + 1] * (1 - a);
        let b = rgba[px + 2] * (1 - a);
        [r, g, b] = avoidClear(clampByte(r), clampByte(g), clampByte(b));
        rgba[px] = r;
        rgba[px + 1] = g;
        rgba[px + 2] = b;
      }
    }
  }
}

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeB = Buffer.from(type);
  const body = Buffer.concat([typeB, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
}

function writePng(path, w, h, rgba) {
  const stride = w * 4;
  const raw = Buffer.alloc((stride + 1) * h);
  for (let y = 0; y < h; y++) {
    const row = y * (stride + 1);
    raw[row] = 0;
    rgba.copy(raw, row + 1, y * stride, y * stride + stride);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  const png = Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    pngChunk("IHDR", ihdr),
    pngChunk("IDAT", deflateSync(raw, { level: 6 })),
    pngChunk("IEND", Buffer.alloc(0)),
  ]);
  writeFileSync(path, png);
}

function hash2(x, y) {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return n - Math.floor(n);
}

function fillRings(mask, W, rings, ox, oz) {
  const edges = [];
  for (const ring of rings) {
    for (let i = 0; i < ring.length; i++) {
      const a = ring[i];
      const b = ring[(i + 1) % ring.length];
      let ax = (a.x - ox) * RES;
      let az = (a.z - oz) * RES;
      let bx = (b.x - ox) * RES;
      let bz = (b.z - oz) * RES;
      if (az === bz) continue;
      if (az > bz) {
        const tx = ax;
        const tz = az;
        ax = bx;
        az = bz;
        bx = tx;
        bz = tz;
      }
      edges.push({ ax, az, bx, bz });
    }
  }
  for (let y = 0; y < mask.length / W; y++) {
    const ys = y + 0.5;
    const xs = [];
    for (let e = 0; e < edges.length; e++) {
      const edge = edges[e];
      if (ys < edge.az || ys >= edge.bz) continue;
      const t = (ys - edge.az) / (edge.bz - edge.az);
      xs.push(edge.ax + (edge.bx - edge.ax) * t);
    }
    xs.sort((a, b) => a - b);
    for (let k = 0; k + 1 < xs.length; k += 2) {
      let x0 = Math.ceil(xs[k]);
      let x1 = Math.floor(xs[k + 1]);
      if (x0 < 0) x0 = 0;
      if (x1 >= W) x1 = W - 1;
      const row = y * W;
      for (let x = x0; x <= x1; x++) mask[row + x] = 1;
    }
  }
}

function stampDisc(mask, W, H, cx, cz, r, ox, oz) {
  const i0 = Math.max(0, Math.floor((cx - r - ox) * RES));
  const i1 = Math.min(W - 1, Math.ceil((cx + r - ox) * RES));
  const j0 = Math.max(0, Math.floor((cz - r - oz) * RES));
  const j1 = Math.min(H - 1, Math.ceil((cz + r - oz) * RES));
  const r2 = r * r;
  for (let j = j0; j <= j1; j++) {
    const z = oz + (j + 0.5) / RES;
    const dz = z - cz;
    const row = j * W;
    for (let i = i0; i <= i1; i++) {
      const x = ox + (i + 0.5) / RES;
      const dx = x - cx;
      if (dx * dx + dz * dz <= r2) mask[row + i] = 1;
    }
  }
}

function stampSeg(mask, W, H, ax, az, bx, bz, half, ox, oz) {
  const i0 = Math.max(0, Math.floor((Math.min(ax, bx) - half - ox) * RES));
  const i1 = Math.min(W - 1, Math.ceil((Math.max(ax, bx) + half - ox) * RES));
  const j0 = Math.max(0, Math.floor((Math.min(az, bz) - half - oz) * RES));
  const j1 = Math.min(H - 1, Math.ceil((Math.max(az, bz) + half - oz) * RES));
  const dx = bx - ax;
  const dz = bz - az;
  const len2 = dx * dx + dz * dz;
  const half2 = half * half;
  for (let j = j0; j <= j1; j++) {
    const z = oz + (j + 0.5) / RES;
    const row = j * W;
    for (let i = i0; i <= i1; i++) {
      const x = ox + (i + 0.5) / RES;
      const t = len2 ? Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / len2)) : 0;
      const px = x - (ax + t * dx);
      const pz = z - (az + t * dz);
      if (px * px + pz * pz <= half2) mask[row + i] = 1;
    }
  }
}

function chamfer(isZero, W, H) {
  const d = new Float32Array(W * H);
  d.fill(1e6);
  for (let i = 0; i < d.length; i++) if (isZero(i)) d[i] = 0;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = y * W + x;
      let v = d[i];
      if (x > 0) v = Math.min(v, d[i - 1] + 1);
      if (y > 0) v = Math.min(v, d[i - W] + 1);
      if (x > 0 && y > 0) v = Math.min(v, d[i - W - 1] + 1.42);
      if (x + 1 < W && y > 0) v = Math.min(v, d[i - W + 1] + 1.42);
      d[i] = v;
    }
  }
  for (let y = H - 1; y >= 0; y--) {
    for (let x = W - 1; x >= 0; x--) {
      const i = y * W + x;
      let v = d[i];
      if (x + 1 < W) v = Math.min(v, d[i + 1] + 1);
      if (y + 1 < H) v = Math.min(v, d[i + W] + 1);
      if (x + 1 < W && y + 1 < H) v = Math.min(v, d[i + W + 1] + 1.42);
      if (x > 0 && y + 1 < H) v = Math.min(v, d[i + W - 1] + 1.42);
      d[i] = v;
    }
  }
  return d;
}

function clampByte(n) {
  return n < 0 ? 0 : n > 255 ? 255 : n | 0;
}

function avoidClear(r, g, b) {
  r = clampByte(r);
  g = clampByte(g);
  b = clampByte(b);
  if (Math.abs(r - 21) <= 2 && Math.abs(g - 20) <= 2 && Math.abs(b - 28) <= 2) return [26, 24, 32];
  return [r, g, b];
}

function paintPixel(inside, distIn, distOut, i, j) {
  if (!inside) {
    const yalms = distIn / RES;
    const jag = (hash2((i / (RES * 3)) | 0, (j / (RES * 4)) | 0) - 0.5) * 6;
    const t = Math.max(0, Math.min(1, (yalms + jag - 1.5) / 22));
    let r = 0x1c + (0x1a - 0x1c) * t;
    let g = 0x1a + (0x18 - 0x1a) * t;
    let b = 0x22 + (0x20 - 0x22) * t;
    const crackCell = 40 * RES;
    const bx = (i / crackCell) | 0;
    const by = (j / crackCell) | 0;
    const qx = i % crackCell;
    const qy = j % crackCell;
    const shift = (hash2(bx + 2, by) - 0.5) * crackCell * 0.4;
    const diag = Math.abs(qx * 0.6 - qy - shift);
    if (diag < RES * 1.3 && hash2(bx, by + 4) > 0.35) {
      r = 0x14;
      g = 0x12;
      b = 0x18;
    }
    return avoidClear(r, g, b);
  }
  let r = 0x46;
  let g = 0x40;
  let b = 0x4a;
  const damp = 26 * RES;
  const dx = (i / damp) | 0;
  const dy = (j / damp) | 0;
  if (hash2(dx * 2.2 + 1, dy * 1.7) > 0.55) {
    const lx = ((i % damp) / damp) - 0.5;
    const ly = ((j % damp) / damp) - 0.48;
    const edge = 0.28 + hash2(dx + 3, dy) * 0.16;
    if (lx * lx * 1.2 + ly * ly < edge * edge) {
      r = 0x2c;
      g = 0x28;
      b = 0x32;
    }
  }
  const moss = 34 * RES;
  const mx = (i / moss) | 0;
  const my = (j / moss) | 0;
  if (hash2(mx * 4.1 + 8, my * 2.4) > 0.72) {
    const lx = ((i % moss) / moss) - 0.38;
    const ly = ((j % moss) / moss) - 0.62;
    const clump = lx * lx * 1.4 + ly * ly;
    if (clump < 0.02) {
      r = 0x3d;
      g = 0x5c;
      b = 0x38;
    } else if (clump < 0.045) {
      r = 0x2e;
      g = 0x48;
      b = 0x30;
    }
  }
  const crackCell = 36 * RES;
  const bx = (i / crackCell) | 0;
  const by = (j / crackCell) | 0;
  const qx = i % crackCell;
  const qy = j % crackCell;
  const tilt = hash2(bx + 1, by) > 0.5 ? 0.35 : 1.15;
  const shift = (hash2(bx, by + 3) - 0.5) * crackCell * 0.55;
  const diag = Math.abs(qx - qy * tilt - crackCell * 0.12 - shift);
  const branchAt = (0.3 + hash2(bx + 5, by) * 0.45) * crackCell;
  const branch = Math.abs(qy - branchAt);
  const crackOn = (diag < RES * 1.5 && qx > RES * 3 && qx < crackCell - RES * 3)
    || (branch < RES * 1.15 && qx > crackCell * 0.18 && qx < crackCell * 0.78);
  if (crackOn) {
    r = 0x22;
    g = 0x1e;
    b = 0x26;
  }
  if (distOut < 2.4 * RES) {
    const tooth = hash2((i / (RES * 2)) | 0, (j / (RES * 3)) | 0) > 0.45;
    if (distOut < RES * 1.1 || tooth) {
      r = Math.min(r, 0x2a);
      g = Math.min(g, 0x26);
      b = Math.min(b, 0x30);
    }
  }
  return avoidClear(r, g, b);
}

function bakeMap(map) {
  const origin = YUGHOTT_ORIGINS[map];
  const span = 15 * YUGHOTT_CELL + PAD * 2;
  const ox = origin.x - PAD;
  const oz = origin.z - PAD;
  const W = Math.ceil(span * RES);
  const H = Math.ceil(span * RES);
  const mask = new Uint8Array(W * H);
  const geo = YUGHOTT_GEO[map];
  for (const area of geo.rings) fillRings(mask, W, area.rings, ox, oz);
  for (const seg of geo.segs) stampSeg(mask, W, H, seg.ax, seg.az, seg.bx, seg.bz, seg.half, ox, oz);
  for (const disc of geo.discs) stampDisc(mask, W, H, disc.x, disc.z, disc.r, ox, oz);
  let floorPx = 0;
  for (let i = 0; i < mask.length; i++) if (mask[i]) floorPx++;
  const distOut = chamfer((i) => {
    if (!mask[i]) return false;
    const x = i % W;
    const y = (i / W) | 0;
    if (x === 0 || y === 0 || x === W - 1 || y === H - 1) return true;
    return !mask[i - 1] || !mask[i + 1] || !mask[i - W] || !mask[i + W];
  }, W, H);
  const distIn = chamfer((i) => mask[i] === 1, W, H);
  const gw = Math.ceil(span / STEP);
  const gh = Math.ceil(span / STEP);
  const bits = Buffer.alloc(Math.ceil((gw * gh) / 8));
  let cells = 0;
  for (let j = 0; j < gh; j++) {
    const z = oz + (j + 0.5) * STEP;
    const pj = Math.max(0, Math.min(H - 1, Math.floor((z - oz) * RES)));
    for (let i = 0; i < gw; i++) {
      const x = ox + (i + 0.5) * STEP;
      const pi = Math.max(0, Math.min(W - 1, Math.floor((x - ox) * RES)));
      let on = mask[pj * W + pi] === 1;
      if (!on) {
        const reach = Math.ceil((STEP * 0.45) * RES);
        for (let dz = -reach; dz <= reach && !on; dz += reach || 1) {
          for (let dx = -reach; dx <= reach; dx += reach || 1) {
            const sx = Math.max(0, Math.min(W - 1, pi + dx));
            const sy = Math.max(0, Math.min(H - 1, pj + dz));
            if (mask[sy * W + sx]) {
              on = true;
              break;
            }
          }
        }
      }
      if (!on) continue;
      const n = j * gw + i;
      bits[n >> 3] |= 1 << (n & 7);
      cells++;
    }
  }
  const tilesX = Math.ceil(span / TILE);
  const tiles = [];
  for (let iz = 0; iz < tilesX; iz++) {
    for (let ix = 0; ix < tilesX; ix++) {
      const x = ox + ix * TILE;
      const z = oz + iz * TILE;
      const wY = Math.min(TILE, ox + span - x);
      const dY = Math.min(TILE, oz + span - z);
      const pw = Math.max(1, Math.round(wY * RES));
      const ph = Math.max(1, Math.round(dY * RES));
      const rgba = Buffer.alloc(pw * ph * 4);
      const i0 = Math.round((x - ox) * RES);
      const j0 = Math.round((z - oz) * RES);
      for (let row = 0; row < ph; row++) {
        const srcJ = Math.max(0, Math.min(H - 1, j0 + row));
        for (let col = 0; col < pw; col++) {
          const srcI = Math.max(0, Math.min(W - 1, i0 + col));
          const src = srcJ * W + srcI;
          const inside = mask[src] === 1;
          let [r, g, b] = paintPixel(inside, distIn[src], inside ? distOut[src] : 0, srcI, srcJ);
          if (inside && map === 1) {
            const wx = ox + (srcI + 0.5) / RES;
            const wz = oz + (srcJ + 0.5) / RES;
            const kind = rimKind(wx, wz);
            if (kind === "stone") {
              r = 0x24;
              g = 0x22;
              b = 0x2a;
            } else if (kind === "lip") {
              r = 0x4a;
              g = 0x44;
              b = 0x50;
            }
          }
          const p = (row * pw + col) * 4;
          rgba[p] = r;
          rgba[p + 1] = g;
          rgba[p + 2] = b;
          rgba[p + 3] = 255;
        }
      }
      stampShadows(rgba, pw, ph, x, z, map);
      const file = `m${map}-${ix}-${iz}.png`;
      writePng(resolve(pub, file), pw, ph, rgba);
      tiles.push({ ix, iz, x, z, w: wY, d: dY, src: `/yughott/${file}` });
    }
  }
  console.log(`map ${map} floorPx ${floorPx} cells ${cells} tiles ${tiles.length} ${W}x${H}`);
  return { ox, oz, span, gw, gh, cells: bits.toString("base64"), tiles };
}

mkdirSync(pub, { recursive: true });
const t0 = performance.now();
const maps = {};
for (const map of MAPS) maps[map] = bakeMap(map);
const body = `/** Generated by scripts/bake-yughott-paint.mjs. Do not edit. */
export const YUGHOTT_PAINT = ${JSON.stringify({ res: RES, tile: TILE, pad: PAD, step: STEP, maps })} as const;
`;
writeFileSync(outTs, body);
console.log(`yughott paint ${Math.round(performance.now() - t0)}ms`);
