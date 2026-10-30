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

function floorColor(i, j, distOut) {
  let r = 0x3e;
  let g = 0x39;
  let b = 0x3f;
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
      r = 0x29;
      g = 0x3e;
      b = 0x26;
    } else if (clump < 0.045) {
      r = 0x24;
      g = 0x38;
      b = 0x28;
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
  if (distOut < 3 * RES) {
    const t = 1 - distOut / (3 * RES);
    const dark = t * t * 0.18;
    r *= 1 - dark;
    g *= 1 - dark;
    b *= 1 - dark;
  }
  return avoidClear(r, g, b);
}

function rockColor(distPx, i, j) {
  const yalms = Math.max(0, distPx) / RES;
  const t = Math.max(0, Math.min(1, yalms / 22));
  let r = 0x1c + (0x1a - 0x1c) * t;
  let g = 0x1a + (0x18 - 0x1a) * t;
  let b = 0x22 + (0x20 - 0x22) * t;
  const crackCell = 48 * RES;
  const bx = (i / crackCell) | 0;
  const by = (j / crackCell) | 0;
  const qx = i % crackCell;
  const qy = j % crackCell;
  const shift = (hash2(bx + 2, by) - 0.5) * crackCell * 0.35;
  const diag = Math.abs(qx * 0.55 - qy - shift);
  if (diag < RES * 1.1 && hash2(bx, by + 4) > 0.42 && yalms > 1.2 && yalms < 16) {
    r = 0x14;
    g = 0x12;
    b = 0x18;
  }
  return avoidClear(r, g, b);
}

function mixByte(a, b, t) {
  return clampByte(a + (b - a) * t);
}

const MARCH = {
  1: [3, 0],
  2: [0, 1],
  3: [3, 1],
  4: [1, 2],
  5: [3, 0, 1, 2],
  6: [0, 2],
  7: [3, 2],
  8: [2, 3],
  9: [0, 2],
  10: [0, 1, 2, 3],
  11: [1, 2],
  12: [1, 3],
  13: [0, 1],
  14: [0, 3],
};

function edgePoint(i, j, edge) {
  if (edge === 0) return [i + 0.5, j];
  if (edge === 1) return [i + 1, j + 0.5];
  if (edge === 2) return [i + 0.5, j + 1];
  return [i, j + 0.5];
}

function marchLoops(mask, W, H) {
  const segs = [];
  for (let j = 0; j < H - 1; j++) {
    const row = j * W;
    const next = row + W;
    for (let i = 0; i < W - 1; i++) {
      let code = 0;
      if (mask[row + i]) code |= 1;
      if (mask[row + i + 1]) code |= 2;
      if (mask[next + i + 1]) code |= 4;
      if (mask[next + i]) code |= 8;
      const spec = MARCH[code];
      if (!spec) continue;
      for (let k = 0; k < spec.length; k += 2) {
        segs.push(edgePoint(i, j, spec[k]), edgePoint(i, j, spec[k + 1]));
      }
    }
  }
  const key = (p) => `${Math.round(p[0] * 2)},${Math.round(p[1] * 2)}`;
  const adj = new Map();
  for (let s = 0; s < segs.length; s += 2) {
    const a = key(segs[s]);
    const b = key(segs[s + 1]);
    if (a === b) continue;
    if (!adj.has(a)) adj.set(a, []);
    if (!adj.has(b)) adj.set(b, []);
    adj.get(a).push(s);
    adj.get(b).push(s);
  }
  const used = new Uint8Array(segs.length / 2);
  const loops = [];
  for (let s = 0; s < segs.length; s += 2) {
    const id = s >> 1;
    if (used[id]) continue;
    const loop = [segs[s], segs[s + 1]];
    used[id] = 1;
    let guard = 0;
    while (guard++ < segs.length) {
      const end = loop[loop.length - 1];
      if (key(end) === key(loop[0])) break;
      const list = adj.get(key(end));
      let found = -1;
      if (list) {
        for (let n = 0; n < list.length; n++) {
          const sid = list[n] >> 1;
          if (!used[sid]) {
            found = list[n];
            break;
          }
        }
      }
      if (found < 0) break;
      used[found >> 1] = 1;
      const nxt = key(segs[found]) === key(end) ? segs[found + 1] : segs[found];
      loop.push(nxt);
    }
    if (loop.length > 10 && key(loop[0]) === key(loop[loop.length - 1])) {
      loop.pop();
      loops.push(loop.map((p) => ({ x: p[0], y: p[1] })));
    }
  }
  return loops;
}

function chaikin(loop) {
  const n = loop.length;
  const out = new Array(n * 2);
  for (let i = 0; i < n; i++) {
    const a = loop[i];
    const b = loop[(i + 1) % n];
    out[i * 2] = { x: a.x * 0.75 + b.x * 0.25, y: a.y * 0.75 + b.y * 0.25 };
    out[i * 2 + 1] = { x: a.x * 0.25 + b.x * 0.75, y: a.y * 0.25 + b.y * 0.75 };
  }
  return out;
}

function loopLength(loop) {
  let total = 0;
  for (let i = 0; i < loop.length; i++) {
    const a = loop[i];
    const b = loop[(i + 1) % loop.length];
    total += Math.hypot(b.x - a.x, b.y - a.y);
  }
  return total;
}

function resample(loop, step) {
  const n = loop.length;
  const acc = new Float64Array(n + 1);
  for (let i = 0; i < n; i++) {
    const a = loop[i];
    const b = loop[(i + 1) % n];
    acc[i + 1] = acc[i] + Math.hypot(b.x - a.x, b.y - a.y);
  }
  const total = acc[n];
  if (!(total > step * 4)) return loop;
  const count = Math.max(8, Math.round(total / step));
  const out = new Array(count);
  let seg = 0;
  for (let k = 0; k < count; k++) {
    const d = (k / count) * total;
    while (seg < n - 1 && acc[seg + 1] < d) seg++;
    const span = acc[seg + 1] - acc[seg] || 1;
    const t = (d - acc[seg]) / span;
    const a = loop[seg];
    const b = loop[(seg + 1) % n];
    out[k] = { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
  }
  return out;
}

function outsideScore(mask, W, H, x, y, nx, ny) {
  let score = 0;
  for (let k = 1; k <= 3; k++) {
    const ix = Math.round(x + nx * k * 3);
    const iy = Math.round(y + ny * k * 3);
    if (ix < 0 || iy < 0 || ix >= W || iy >= H || !mask[iy * W + ix]) score++;
  }
  return score;
}

function displaceEdge(loop, mask, W, H) {
  const n = loop.length;
  const out = new Array(n);
  let arc = 0;
  for (let i = 0; i < n; i++) {
    const prev = loop[(i - 1 + n) % n];
    const p = loop[i];
    const next = loop[(i + 1) % n];
    arc += Math.hypot(p.x - prev.x, p.y - prev.y) / RES;
    let tx = next.x - prev.x;
    let ty = next.y - prev.y;
    const len = Math.hypot(tx, ty) || 1;
    tx /= len;
    ty /= len;
    const left = { x: -ty, y: tx };
    const right = { x: ty, y: -tx };
    const pick = outsideScore(mask, W, H, p.x, p.y, left.x, left.y) >= outsideScore(mask, W, H, p.x, p.y, right.x, right.y) ? left : right;
    const wave = 1.7 + 1.1 * (0.5 + 0.5 * Math.sin(arc * 0.23));
    const amp = 0.32 + 0.24 * (0.5 + 0.5 * Math.sin(arc * 0.41 + 1.3));
    const jag = Math.sin((arc / wave) * Math.PI * 2) * 0.72 + Math.sin((arc / (wave * 1.37 + 0.4)) * Math.PI * 2 + 0.6) * 0.28;
    const push = jag * amp * RES;
    out[i] = { x: p.x + pick.x * push, y: p.y + pick.y * push, nx: pick.x, ny: pick.y };
  }
  return out;
}

function axisFlags(loop, slack) {
  const n = loop.length;
  const axis = new Uint8Array(n);
  const lens = new Float64Array(n);
  const tol = slack == null ? 0.18 : slack;
  for (let i = 0; i < n; i++) {
    const a = loop[i];
    const b = loop[(i + 1) % n];
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.hypot(dx, dy);
    lens[i] = len;
    axis[i] = len > 0.04 * RES && (Math.abs(dx) <= tol * len || Math.abs(dy) <= tol * len) ? 1 : 0;
  }
  return { axis, lens };
}

function worstAxis(loop, slack) {
  const { axis, lens } = axisFlags(loop, slack);
  const n = loop.length;
  if (!n) return 0;
  let all = true;
  for (let i = 0; i < n; i++) if (!axis[i]) all = false;
  if (all) {
    let sum = 0;
    for (let i = 0; i < n; i++) sum += lens[i];
    return sum;
  }
  let worst = 0;
  let i = 0;
  while (i < n) {
    if (!axis[i]) {
      i++;
      continue;
    }
    let sum = 0;
    let k = i;
    while (k < n && axis[k]) {
      sum += lens[k];
      k++;
    }
    if (sum > worst) worst = sum;
    i = k;
  }
  if (axis[0] && axis[n - 1]) {
    let sum = 0;
    let k = 0;
    while (k < n && axis[k]) {
      sum += lens[k];
      k++;
    }
    let j = n - 1;
    while (j >= k && axis[j]) {
      sum += lens[j];
      j--;
    }
    if (sum > worst) worst = sum;
  }
  return worst;
}

function sealAxisRuns(loop, mask, W, H) {
  let pts = loop;
  const limit = 1.45 * RES;
  for (let pass = 0; pass < 8; pass++) {
    if (worstAxis(pts, 0.18) <= limit) break;
    const n = pts.length;
    const { axis, lens } = axisFlags(pts, 0.18);
    let start = 0;
    for (let i = 0; i < n; i++) {
      if (!axis[i]) {
        start = (i + 1) % n;
        break;
      }
    }
    const out = [];
    let run = 0;
    for (let k = 0; k < n; k++) {
      const i = (start + k) % n;
      const a = pts[i];
      const b = pts[(i + 1) % n];
      out.push(a);
      const len = lens[i] || 1;
      if (!axis[i]) {
        run = 0;
        continue;
      }
      run += len;
      if (run > limit || len > limit) {
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const midX = a.x * 0.42 + b.x * 0.58;
        const midY = a.y * 0.42 + b.y * 0.58;
        let nx = -dy / len;
        let ny = dx / len;
        if (outsideScore(mask, W, H, midX, midY, nx, ny) < outsideScore(mask, W, H, midX, midY, -nx, -ny)) {
          nx = -nx;
          ny = -ny;
        }
        out.push({ x: midX + nx * 0.55 * RES, y: midY + ny * 0.55 * RES, nx, ny });
        run = 0;
      }
    }
    pts = out;
  }
  return pts;
}

function fillLoops(loops, W, H) {
  const buckets = Array.from({ length: H }, () => []);
  for (const loop of loops) {
    const n = loop.length;
    for (let i = 0; i < n; i++) {
      let x0 = loop[i].x;
      let y0 = loop[i].y;
      let x1 = loop[(i + 1) % n].x;
      let y1 = loop[(i + 1) % n].y;
      if (y0 === y1) continue;
      if (y0 > y1) {
        const tx = x0;
        const ty = y0;
        x0 = x1;
        y0 = y1;
        x1 = tx;
        y1 = ty;
      }
      const j0 = Math.max(0, Math.floor(y0));
      const j1 = Math.min(H - 1, Math.ceil(y1) - 1);
      for (let j = j0; j <= j1; j++) {
        const ys = j + 0.5;
        if (ys < y0 || ys >= y1) continue;
        const t = (ys - y0) / (y1 - y0);
        buckets[j].push(x0 + (x1 - x0) * t);
      }
    }
  }
  const mask = new Uint8Array(W * H);
  for (let j = 0; j < H; j++) {
    const xs = buckets[j];
    if (xs.length < 2) continue;
    xs.sort((a, b) => a - b);
    const row = j * W;
    for (let k = 0; k + 1 < xs.length; k += 2) {
      let x0 = Math.ceil(xs[k]);
      let x1 = Math.floor(xs[k + 1]);
      if (x0 < 0) x0 = 0;
      if (x1 >= W) x1 = W - 1;
      for (let x = x0; x <= x1; x++) mask[row + x] = 1;
    }
  }
  return mask;
}

function edgeHash(loops, W, H) {
  const cell = 8;
  const cols = Math.ceil(W / cell);
  const rows = Math.ceil(H / cell);
  const buckets = new Map();
  const add = (seg) => {
    const minx = Math.min(seg.ax, seg.bx);
    const maxx = Math.max(seg.ax, seg.bx);
    const miny = Math.min(seg.ay, seg.by);
    const maxy = Math.max(seg.ay, seg.by);
    const i0 = Math.max(0, Math.floor(minx / cell));
    const i1 = Math.min(cols - 1, Math.floor(maxx / cell));
    const j0 = Math.max(0, Math.floor(miny / cell));
    const j1 = Math.min(rows - 1, Math.floor(maxy / cell));
    for (let j = j0; j <= j1; j++) {
      for (let i = i0; i <= i1; i++) {
        const k = j * cols + i;
        let list = buckets.get(k);
        if (!list) buckets.set(k, list = []);
        list.push(seg);
      }
    }
  };
  for (const loop of loops) {
    const n = loop.length;
    for (let i = 0; i < n; i++) {
      const a = loop[i];
      const b = loop[(i + 1) % n];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const len = Math.hypot(dx, dy) || 1;
      add({
        ax: a.x,
        ay: a.y,
        bx: b.x,
        by: b.y,
        nx: a.nx || -dy / len,
        ny: a.ny || dx / len,
      });
    }
  }
  return { buckets, cell, cols, rows };
}

function edgeSigned(hash, x, y) {
  const { buckets, cell, cols, rows } = hash;
  const cx = Math.floor(x / cell);
  const cy = Math.floor(y / cell);
  let best = 1e9;
  let signed = 0;
  let hit = false;
  for (let j = cy - 1; j <= cy + 1; j++) {
    if (j < 0 || j >= rows) continue;
    for (let i = cx - 1; i <= cx + 1; i++) {
      if (i < 0 || i >= cols) continue;
      const list = buckets.get(j * cols + i);
      if (!list) continue;
      for (let n = 0; n < list.length; n++) {
        const s = list[n];
        const dx = s.bx - s.ax;
        const dy = s.by - s.ay;
        const len2 = dx * dx + dy * dy || 1;
        let t = ((x - s.ax) * dx + (y - s.ay) * dy) / len2;
        if (t < 0) t = 0;
        else if (t > 1) t = 1;
        const px = s.ax + dx * t;
        const py = s.ay + dy * t;
        const ox = x - px;
        const oy = y - py;
        const d2 = ox * ox + oy * oy;
        if (d2 < best) {
          best = d2;
          signed = -(ox * s.nx + oy * s.ny);
          hit = true;
        }
      }
    }
  }
  if (!hit || best > 16) return null;
  const mag = Math.sqrt(best);
  return signed < 0 ? -mag : mag;
}

function smoothWalk(mask, W, H) {
  const raw = marchLoops(mask, W, H);
  const loops = [];
  let perimeter = 0;
  for (const loop of raw) {
    if (loopLength(loop) < 8 * RES) continue;
    let pts = loop;
    for (let pass = 0; pass < 3; pass++) pts = chaikin(pts);
    pts = resample(pts, 0.5 * RES);
    pts = displaceEdge(pts, mask, W, H);
    pts = resample(pts, 1.05 * RES);
    pts = sealAxisRuns(pts, mask, W, H);
    if (pts.length < 6) continue;
    perimeter += loopLength(pts) / RES;
    loops.push(pts);
  }
  const next = fillLoops(loops, W, H);
  return { loops, mask: next, perimeter };
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
  const walked = smoothWalk(mask, W, H);
  let floor2 = 0;
  for (let i = 0; i < walked.mask.length; i++) if (walked.mask[i]) floor2++;
  console.log(`map ${map} contour loops ${walked.loops.length} perimeter ${walked.perimeter.toFixed(0)} floor ${floorPx} -> ${floor2}`);
  if (floor2 < floorPx * 0.55) throw new Error(`map ${map} contour fill collapsed ${floor2}/${floorPx}`);
  mask.set(walked.mask);
  const hash = edgeHash(walked.loops, W, H);
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
          let signed = inside ? distOut[src] : -distIn[src];
          if (Math.abs(signed) < 3.4) {
            const fine = edgeSigned(hash, srcI + 0.5, srcJ + 0.5);
            if (fine != null) signed = fine;
          }
          const cover = signed <= -1.15 ? 0 : signed >= 1.15 ? 1 : (signed + 1.15) / 2.3;
          const floor = floorColor(srcI, srcJ, Math.max(0, signed));
          const rock = rockColor(Math.max(0, -signed), srcI, srcJ);
          let r = mixByte(rock[0], floor[0], cover);
          let g = mixByte(rock[1], floor[1], cover);
          let b = mixByte(rock[2], floor[2], cover);
          if (cover > 0.65 && map === 1) {
            const wx = ox + (srcI + 0.5) / RES;
            const wz = oz + (srcJ + 0.5) / RES;
            const kind = rimKind(wx, wz);
            if (kind === "stone") {
              r = 0x24;
              g = 0x22;
              b = 0x2a;
            } else if (kind === "lip") {
              r = 0x3c;
              g = 0x38;
              b = 0x42;
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
  const loops = walked.loops.map((loop) => {
    const flat = [];
    for (let i = 0; i < loop.length; i++) {
      flat.push(Math.round((ox + loop[i].x / RES) * 100) / 100);
      flat.push(Math.round((oz + loop[i].y / RES) * 100) / 100);
    }
    return flat;
  });
  return { ox, oz, span, gw, gh, cells: bits.toString("base64"), tiles, loops };
}

mkdirSync(pub, { recursive: true });
const t0 = performance.now();
const maps = {};
for (const map of MAPS) maps[map] = bakeMap(map);

function worldAxisRun(flat, slack) {
  const n = flat.length / 2;
  const tol = slack == null ? 0.12 : slack;
  let worst = 0;
  let run = 0;
  const lens = [];
  const axis = [];
  for (let i = 0; i < n; i++) {
    const dx = flat[((i + 1) % n) * 2] - flat[i * 2];
    const dz = flat[((i + 1) % n) * 2 + 1] - flat[i * 2 + 1];
    const len = Math.hypot(dx, dz);
    lens.push(len);
    const on = len > 0.04 && (Math.abs(dx) <= tol * len || Math.abs(dz) <= tol * len);
    axis.push(on);
    if (on) {
      run += len;
      if (run > worst) worst = run;
    } else run = 0;
  }
  if (n > 1 && axis[0] && axis[n - 1]) {
    let sum = 0;
    let k = 0;
    while (k < n && axis[k]) {
      sum += lens[k];
      k++;
    }
    let j = n - 1;
    while (j >= k && axis[j]) {
      sum += lens[j];
      j--;
    }
    if (sum > worst) worst = sum;
  }
  return worst;
}

function worldEdgeNear(x, z, radius) {
  const r2 = radius * radius;
  let worst = 0;
  for (const map of MAPS) {
    for (const flat of maps[map].loops) {
      const n = flat.length / 2;
      let run = 0;
      for (let i = 0; i < n; i++) {
        const ax = flat[i * 2];
        const az = flat[i * 2 + 1];
        const bx = flat[((i + 1) % n) * 2];
        const bz = flat[((i + 1) % n) * 2 + 1];
        const dx = bx - ax;
        const dz = bz - az;
        const len = Math.hypot(dx, dz);
        const mx = (ax + bx) * 0.5;
        const mz = (az + bz) * 0.5;
        const near = (mx - x) * (mx - x) + (mz - z) * (mz - z) <= r2;
        const on = len > 0.04 && (Math.abs(dx) <= 0.12 * len || Math.abs(dz) <= 0.12 * len);
        if (near && on) {
          run += len;
          if (run > worst) worst = run;
        } else run = 0;
      }
    }
  }
  return worst;
}

let edgeBad = false;
for (const map of MAPS) {
  let pts = 0;
  let worst = 0;
  for (const flat of maps[map].loops) {
    pts += flat.length / 2;
    const run = worldAxisRun(flat, 0.12);
    if (run > worst) worst = run;
  }
  console.log(`map ${map} contour pts ${pts} wall tris ${pts * 4} global axis ${worst.toFixed(2)}`);
  if (worst > 2) edgeBad = true;
}
const stands = [
  ["h8", -561.1, 659.6],
  ["g8", -590.64, 658.4],
  ["f9", -682.48, 707.6],
  ["pale", -567.8, 664.0],
];
for (const [name, x, z] of stands) {
  const run = worldEdgeNear(x, z, 30);
  console.log(`${name} edge ${run.toFixed(2)}`);
  if (run > 2) edgeBad = true;
}
if (edgeBad) {
  console.error("axis runs still over 2 yalms");
  process.exit(1);
}

const body = `/** Generated by scripts/bake-yughott-paint.mjs. Do not edit. */
export const YUGHOTT_PAINT = ${JSON.stringify({ res: RES, tile: TILE, pad: PAD, step: STEP, maps })} as const;
`;
writeFileSync(outTs, body);
console.log(`yughott paint ${Math.round(performance.now() - t0)}ms`);
