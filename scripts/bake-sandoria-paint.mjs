/** Bake San d'Oria painted ground. Warm flagstone, hard joints, no blur. */
import { deflateSync } from "node:zlib";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { inNorthGraph, inPortGraph, inSouthGraph, SAN_PROPS } from "../src/game/sandoria-graph.ts";

const root = resolve(import.meta.dirname, "..");
const pub = resolve(root, "public/sandoria");
const outTs = resolve(root, "src/game/sandoria-paint.generated.ts");
mkdirSync(pub, { recursive: true });

const CRC_TABLE = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  CRC_TABLE[n] = c;
}
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function pngChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const body = Buffer.concat([Buffer.from(type), data]);
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
function mix(a, b, t) {
  return a + (b - a) * t;
}

const SHEETS = [
  { id: "south", minX: -250, maxX: 420, minZ: -340, maxZ: 210, inside: inSouthGraph },
  { id: "north", minX: -220, maxX: 400, minZ: -760, maxZ: -300, inside: inNorthGraph },
  { id: "port", minX: -90, maxX: 90, minZ: -1060, maxZ: -680, inside: inPortGraph },
];
const RES = 4;

function pixLum(r, g, b) {
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

function stoneAt(x, z) {
  const cell = 2;
  const fx = x / cell;
  const fz = z / cell;
  const mortar = Math.abs(fx - Math.round(fx)) < 0.12 || Math.abs(fz - Math.round(fz)) < 0.12;
  if (mortar) return [100, 82, 62];
  const grain = hash2(Math.floor(fx), Math.floor(fz));
  return [118 + (grain - 0.5) * 10, 96 + (grain - 0.5) * 8, 72 + (grain - 0.5) * 6];
}

const tiles = {};
for (const sheet of SHEETS) {
  const w = Math.ceil((sheet.maxX - sheet.minX) * RES);
  const h = Math.ceil((sheet.maxZ - sheet.minZ) * RES);
  const rgba = Buffer.alloc(w * h * 4);
  const walk = new Uint8Array(w * h);
  let lumSum = 0;
  let lumN = 0;
  for (let j = 0; j < h; j++) {
    for (let i = 0; i < w; i++) {
      const x = sheet.minX + (i + 0.5) / RES;
      const z = sheet.minZ + (j + 0.5) / RES;
      const on = sheet.inside(x, z, 0);
      const n = hash2(Math.floor(x * 0.7), Math.floor(z * 0.7));
      let r;
      let g;
      let b;
      if (on) {
        walk[j * w + i] = 1;
        [r, g, b] = stoneAt(x, z);
      } else if (sheet.id === "port" && z < -1028 && Math.abs(x) < 40) {
        r = 16 + n * 6;
        g = 36 + n * 8;
        b = 52 + n * 6;
      } else {
        r = 46 + n * 8;
        g = 34 + n * 6;
        b = 26 + n * 4;
      }
      const p = (j * w + i) * 4;
      rgba[p] = r;
      rgba[p + 1] = g;
      rgba[p + 2] = b;
      rgba[p + 3] = 255;
    }
  }
  for (const prop of SAN_PROPS[sheet.id]) {
    const cx = prop.x + 1.1;
    const cz = prop.z + 0.8;
    const rx = Math.max(0.8, prop.sx * 0.55);
    const rz = Math.max(0.55, prop.sz * 0.42);
    const i0 = Math.max(0, Math.floor((cx - rx - sheet.minX) * RES));
    const i1 = Math.min(w - 1, Math.ceil((cx + rx - sheet.minX) * RES));
    const j0 = Math.max(0, Math.floor((cz - rz - sheet.minZ) * RES));
    const j1 = Math.min(h - 1, Math.ceil((cz + rz - sheet.minZ) * RES));
    for (let j = j0; j <= j1; j++) {
      for (let i = i0; i <= i1; i++) {
        if (!walk[j * w + i]) continue;
        const x = sheet.minX + (i + 0.5) / RES;
        const z = sheet.minZ + (j + 0.5) / RES;
        const e = ((x - cx) / rx) ** 2 + ((z - cz) / rz) ** 2;
        if (e > 1) continue;
        const a = (1 - e) * 0.22;
        const p = (j * w + i) * 4;
        rgba[p] = mix(rgba[p], 36, a);
        rgba[p + 1] = mix(rgba[p + 1], 28, a);
        rgba[p + 2] = mix(rgba[p + 2], 22, a);
      }
    }
  }
  for (let j = 0; j < h; j++) {
    for (let i = 0; i < w; i++) {
      if (!walk[j * w + i]) continue;
      const p = (j * w + i) * 4;
      let r = rgba[p];
      let g = rgba[p + 1];
      let b = rgba[p + 2];
      let L = pixLum(r, g, b);
      if (L < 0.3) {
        const k = 0.3 / L;
        r = Math.min(255, r * k);
        g = Math.min(255, g * k);
        b = Math.min(255, b * k);
      } else if (L > 0.45) {
        const k = 0.45 / L;
        r *= k;
        g *= k;
        b *= k;
      }
      rgba[p] = r;
      rgba[p + 1] = g;
      rgba[p + 2] = b;
      lumSum += pixLum(r, g, b);
      lumN++;
    }
  }
  const lum = lumN ? Math.round((lumSum / lumN) * 1000) / 1000 : 0;
  writePng(resolve(pub, `${sheet.id}.png`), w, h, rgba);
  tiles[sheet.id] = {
    url: `/sandoria/${sheet.id}.png`,
    minX: sheet.minX,
    maxX: sheet.maxX,
    minZ: sheet.minZ,
    maxZ: sheet.maxZ,
    w,
    h,
    lum,
  };
  console.log(`sandoria ${sheet.id} ${w}x${h} lum ${lum}`);
}

writeFileSync(
  outTs,
  `/** Generated by scripts/bake-sandoria-paint.mjs. Do not edit. */\nexport const SAN_PAINT = ${JSON.stringify(tiles, null, 2)} as const;\n`,
);
