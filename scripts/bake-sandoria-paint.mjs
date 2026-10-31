/** Bake San d'Oria painted ground. Flagstone, plaza tiles, soft grass edges. */
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
  { id: "south", minX: -24, maxX: 86, minZ: -48, maxZ: 22, inside: inSouthGraph },
  { id: "north", minX: -50, maxX: 42, minZ: -366, maxZ: -244, inside: inNorthGraph },
  { id: "port", minX: -30, maxX: 26, minZ: -462, maxZ: -374, inside: inPortGraph },
];
const RES = 2;
const RING = [
  [0, 0],
  [1.5, 0],
  [-1.5, 0],
  [0, 1.5],
  [0, -1.5],
];

const tiles = {};
for (const sheet of SHEETS) {
  const w = Math.ceil((sheet.maxX - sheet.minX) * RES);
  const h = Math.ceil((sheet.maxZ - sheet.minZ) * RES);
  const rgba = Buffer.alloc(w * h * 4);
  for (let j = 0; j < h; j++) {
    for (let i = 0; i < w; i++) {
      const x = sheet.minX + (i + 0.5) / RES;
      const z = sheet.minZ + (j + 0.5) / RES;
      let hit = 0;
      let deep = 0;
      for (const [dx, dz] of RING) if (sheet.inside(x + dx, z + dz, 0)) hit++;
      if (sheet.inside(x, z, 0)) {
        deep = 1;
        for (const [dx, dz] of [[2.4, 0], [-2.4, 0], [0, 2.4], [0, -2.4]]) {
          if (!sheet.inside(x + dx, z + dz, 0)) deep = 0;
        }
      }
      const t = hit / RING.length;
      const n = hash2(Math.floor(x * 3.1), Math.floor(z * 3.1));
      const tuft = hash2(x * 2.2 + 4, z * 1.7);
      let r = 58 + n * 18;
      let g = 92 + n * 22;
      let b = 48 + n * 10;
      if (tuft > 0.82) {
        r -= 8;
        g += 10;
      }
      if (sheet.id === "port" && z < -456.2 && t < 0.35) {
        r = 22;
        g = 64 + n * 10;
        b = 86;
      }
      if (t > 0.08) {
        const wave = Math.sin(x * 0.85 + Math.sin(z * 0.37) * 1.4) * 0.35;
        const cell = deep ? 3.4 : 1.65;
        const fx = (x + wave) / cell;
        const fz = (z - wave * 0.6) / cell;
        const mortar = Math.abs(fx - Math.round(fx)) < 0.06 || Math.abs(fz - Math.round(fz)) < 0.06;
        const grain = hash2(Math.floor(fx), Math.floor(fz));
        let sr = deep ? 214 : 188;
        let sg = deep ? 202 : 174;
        let sb = deep ? 176 : 142;
        sr += (grain - 0.5) * 16;
        sg += (grain - 0.5) * 14;
        sb += (grain - 0.5) * 10;
        if (mortar) {
          sr *= 0.72;
          sg *= 0.72;
          sb *= 0.7;
        }
        const edge = t * t * (3 - 2 * t);
        r = mix(r, sr, edge);
        g = mix(g, sg, edge);
        b = mix(b, sb, edge);
      }
      rgba[(j * w + i) * 4] = r;
      rgba[(j * w + i) * 4 + 1] = g;
      rgba[(j * w + i) * 4 + 2] = b;
      rgba[(j * w + i) * 4 + 3] = 255;
    }
  }
  for (const prop of SAN_PROPS[sheet.id]) {
    const cx = prop.x + 0.55;
    const cz = prop.z + 0.4;
    const rx = Math.max(0.7, prop.sx * 0.7);
    const rz = Math.max(0.45, prop.sz * 0.55);
    const i0 = Math.max(0, Math.floor((cx - rx - sheet.minX) * RES));
    const i1 = Math.min(w - 1, Math.ceil((cx + rx - sheet.minX) * RES));
    const j0 = Math.max(0, Math.floor((cz - rz - sheet.minZ) * RES));
    const j1 = Math.min(h - 1, Math.ceil((cz + rz - sheet.minZ) * RES));
    for (let j = j0; j <= j1; j++) {
      for (let i = i0; i <= i1; i++) {
        const x = sheet.minX + (i + 0.5) / RES;
        const z = sheet.minZ + (j + 0.5) / RES;
        const e = ((x - cx) / rx) ** 2 + ((z - cz) / rz) ** 2;
        if (e > 1) continue;
        const a = (1 - e) * 0.35;
        const p = (j * w + i) * 4;
        rgba[p] = mix(rgba[p], 28, a);
        rgba[p + 1] = mix(rgba[p + 1], 26, a);
        rgba[p + 2] = mix(rgba[p + 2], 22, a);
      }
    }
  }
  writePng(resolve(pub, `${sheet.id}.png`), w, h, rgba);
  tiles[sheet.id] = { url: `/sandoria/${sheet.id}.png`, minX: sheet.minX, maxX: sheet.maxX, minZ: sheet.minZ, maxZ: sheet.maxZ, w, h };
  console.log(`sandoria ${sheet.id} ${w}x${h}`);
}

writeFileSync(
  outTs,
  `/** Generated by scripts/bake-sandoria-paint.mjs. Do not edit. */\nexport const SAN_PAINT = ${JSON.stringify(tiles, null, 2)} as const;\n`,
);
