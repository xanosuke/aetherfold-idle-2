/** Bake Yughott painted-ground tiles. Run with tsx after the heightfield bake. */
import { deflateSync } from "node:zlib";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { YUGHOTT_CELL, YUGHOTT_GEO, YUGHOTT_ORIGINS } from "../src/game/yughott-graph.ts";

const root = resolve(import.meta.dirname, "..");
const pub = resolve(root, "public/yughott");
const outTs = resolve(root, "src/game/yughott-paint.generated.ts");
const RES = 2;
const TILE = 256;
const PAD = 96;
const STEP = 4;
const MAPS = [1, 2];

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
  r = r < 44 ? 44 : r;
  g = g < 42 ? 42 : g;
  b = b < 50 ? 50 : b;
  if (r === 21 && g === 20 && b === 28) return [22, 21, 30];
  return [r, g, b];
}

function paintPixel(inside, distIn, distOut, i, j) {
  if (inside) {
    const n = hash2(i * 0.17, j * 0.17);
    const broad = hash2(i * 0.04 + 3, j * 0.04 - 1);
    let r = 62 + (n - 0.5) * 14;
    let g = 57 + (hash2(j, i) - 0.5) * 12;
    let b = 63 + (hash2(i + 9, j - 4) - 0.5) * 12;
    if (broad < 0.16) {
      r -= 10;
      g -= 4;
      b += 2;
    }
    if (broad > 0.9) {
      r -= 14;
      g += 16;
      b -= 12;
    }
    const crack = hash2(i * 0.85, j * 0.08);
    if (crack > 0.92) {
      r -= 18;
      g -= 16;
      b -= 14;
    }
    const vig = distOut < 4 ? (4 - distOut) / 4 : 0;
    const shade = 1 - vig * 0.28;
    r *= shade;
    g *= shade;
    b *= shade;
    return avoidClear(clampByte(r), clampByte(g), clampByte(b));
  }
  const fade = Math.max(0, Math.min(1, distIn / (18 * RES)));
  const rockR = 46;
  const rockG = 42;
  const rockB = 52;
  const fogR = 40;
  const fogG = 36;
  const fogB = 46;
  return avoidClear(
    clampByte(rockR + (fogR - rockR) * fade),
    clampByte(rockG + (fogG - rockG) * fade),
    clampByte(rockB + (fogB - rockB) * fade),
  );
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
          const [r, g, b] = paintPixel(inside, distIn[src], inside ? distOut[src] : 0, srcI, srcJ);
          const p = (row * pw + col) * 4;
          rgba[p] = r;
          rgba[p + 1] = g;
          rgba[p + 2] = b;
          rgba[p + 3] = 255;
        }
      }
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
