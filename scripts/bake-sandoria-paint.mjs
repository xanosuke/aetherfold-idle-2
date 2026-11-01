/** Bake San d'Oria painted ground. Smoothed street edges, rounded anti-aliased cobbles. */
import { deflateSync } from "node:zlib";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { inNorthGraph, inPortGraph, inSouthGraph, SAN_PROPS, sanDraw } from "../src/game/sandoria-graph.ts";

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
const RES = 6;

function pixLum(r, g, b) {
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

function smooth(t) {
  const x = t < 0 ? 0 : t > 1 ? 1 : t;
  return x * x * (3 - 2 * x);
}

/** Stones 0.5–0.9 yalm, warm grey-tan, a thin dark joint, anti-aliased over more than a pixel. */
function stoneSample(x, z) {
  const scale = 0.72;
  const gx = Math.floor(x / scale);
  const gz = Math.floor(z / scale);
  let best = 1e9;
  let hx = 0;
  let hz = 0;
  for (let dz = -1; dz <= 1; dz++) {
    for (let dx = -1; dx <= 1; dx++) {
      const ix = gx + dx;
      const iz = gz + dz;
      const jx = (hash2(ix, iz) - 0.5) * 0.55;
      const jz = (hash2(iz + 19, ix + 7) - 0.5) * 0.55;
      const cx = (ix + 0.5 + jx) * scale;
      const cz = (iz + 0.5 + jz) * scale;
      const d = (x - cx) ** 2 + (z - cz) ** 2;
      if (d < best) {
        best = d;
        hx = ix;
        hz = iz;
      }
    }
  }
  const rad = 0.26 + hash2(hx + 5, hz + 2) * 0.18;
  const cover = smooth((rad - Math.sqrt(best)) / 0.5 + 0.5);
  const tone = hash2(hx + 3, hz + 11);
  return { cover, hx, hz, tone };
}

function stoneAt(x, z) {
  const { cover, hx, hz, tone } = stoneSample(x, z);
  const grey = [132, 122, 108];
  const tan = [150, 118, 86];
  const stone = grey.map((c, i) => c + (tan[i] - c) * tone);
  const speck = (hash2(hx + 9, hz + 4) - 0.5) * 10;
  const joint = [72, 58, 44];
  return joint.map((c, i) => c + (stone[i] + speck - c) * cover);
}

function buildingShade(ring, x, z) {
  let best = 1.5;
  let hit = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const ax = ring[j].x;
    const az = ring[j].z;
    const bx = ring[i].x;
    const bz = ring[i].z;
    const dx = bx - ax;
    const dz = bz - az;
    const l2 = dx * dx + dz * dz || 1;
    let t = ((x - ax) * dx + (z - az) * dz) / l2;
    if (t < 0) t = 0;
    else if (t > 1) t = 1;
    const qx = ax + dx * t;
    const qz = az + dz * t;
    if (qx > x + 0.05 || qz > z + 0.05) continue;
    const d = Math.hypot(x - qx, z - qz);
    if (d < best) {
      best = d;
      hit = true;
    }
  }
  if (!hit) return 0;
  const u = 1 - best / 1.5;
  return u > 0 ? u * u * (3 - 2 * u) : 0;
}

/** Soft darkening on cobbles only, at most 1.5 yalms to the lower right of a real roof. */
function castBuildingShade(id, minX, minZ, w, h, walk, rgba) {
  const shade = new Float32Array(w * h);
  for (const ring of sanDraw(id).buildings) {
    let minRX = Infinity;
    let maxRX = -Infinity;
    let minRZ = Infinity;
    let maxRZ = -Infinity;
    for (const p of ring) {
      if (p.x < minRX) minRX = p.x;
      if (p.x > maxRX) maxRX = p.x;
      if (p.z < minRZ) minRZ = p.z;
      if (p.z > maxRZ) maxRZ = p.z;
    }
    const i0 = Math.max(0, Math.floor((Math.max(minRX, minX) - minX) * RES));
    const i1 = Math.min(w - 1, Math.ceil((maxRX + 1.5 - minX) * RES));
    const j0 = Math.max(0, Math.floor((Math.max(minRZ, minZ) - minZ) * RES));
    const j1 = Math.min(h - 1, Math.ceil((maxRZ + 1.5 - minZ) * RES));
    for (let j = j0; j <= j1; j++) {
      const z = minZ + (j + 0.5) / RES;
      if (z < minRZ - 0.05) continue;
      for (let i = i0; i <= i1; i++) {
        if (!walk[j * w + i]) continue;
        const x = minX + (i + 0.5) / RES;
        if (x < minRX - 0.05) continue;
        const s = buildingShade(ring, x, z);
        const p = j * w + i;
        if (s > shade[p]) shade[p] = s;
      }
    }
  }
  for (let p = 0; p < shade.length; p++) {
    const s = shade[p];
    if (s <= 0) continue;
    const a = s * 0.14;
    const o = p * 4;
    rgba[o] = mix(rgba[o], 52, a);
    rgba[o + 1] = mix(rgba[o + 1], 40, a);
    rgba[o + 2] = mix(rgba[o + 2], 30, a);
  }
}

function cobbleIsSoft() {
  let hard = 0;
  let crossed = 0;
  for (let n = 0; n < 48; n++) {
    const x = n * 1.37;
    const z = n * 0.83;
    for (let s = 0; s < 28; s++) {
      const a = stoneSample(x + s / RES, z).cover;
      const b = stoneSample(x + (s + 1) / RES, z).cover;
      const d = Math.abs(a - b);
      if (d > 0.05) crossed++;
      if (d > 0.82) hard++;
    }
  }
  return hard === 0 && crossed > 8;
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
      for (let k = 0; k < spec.length; k += 2) segs.push(edgePoint(i, j, spec[k]), edgePoint(i, j, spec[k + 1]));
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
          if (!used[list[n] >> 1]) {
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
    if (loop.length > 8 && key(loop[0]) === key(loop[loop.length - 1])) {
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
    const amp = 0.28 + 0.18 * (0.5 + 0.5 * Math.sin(arc * 0.41 + 1.3));
    const jag = Math.sin((arc / wave) * Math.PI * 2) * 0.72 + Math.sin((arc / (wave * 1.37 + 0.4)) * Math.PI * 2 + 0.6) * 0.28;
    const push = jag * amp * RES;
    out[i] = { x: p.x + pick.x * push, y: p.y + pick.y * push };
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
  const limit = 1.85 * RES;
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
        out.push({ x: midX + nx * 0.55 * RES, y: midY + ny * 0.55 * RES });
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

function smoothWalk(mask, W, H) {
  const pW = W + 2;
  const pH = H + 2;
  const padded = new Uint8Array(pW * pH);
  for (let j = 0; j < H; j++) padded.set(mask.subarray(j * W, (j + 1) * W), (j + 1) * pW + 1);
  const raw = marchLoops(padded, pW, pH);
  const loops = [];
  let axis = 0;
  for (const loop of raw) {
    if (loopLength(loop) < 6 * RES) continue;
    let pts = loop;
    for (let pass = 0; pass < 3; pass++) pts = chaikin(pts);
    pts = resample(pts, 0.55 * RES);
    pts = displaceEdge(pts, padded, pW, pH);
    pts = resample(pts, 1.05 * RES);
    pts = sealAxisRuns(pts, padded, pW, pH);
    if (pts.length < 6) continue;
    const run = worstAxis(pts, 0.18) / RES;
    if (run > axis) axis = run;
    loops.push(pts.map((p) => ({ x: p.x - 1, y: p.y - 1 })));
  }
  const next = fillLoops(loops, W, H);
  let kept = 0;
  for (let i = 0; i < next.length; i++) if (next[i]) kept++;
  return { mask: next, kept, axis };
}

function boxCover(mask, W, H) {
  const cov = new Float32Array(W * H);
  for (let j = 0; j < H; j++) {
    for (let i = 0; i < W; i++) {
      let s = 0;
      let n = 0;
      for (let dj = -1; dj <= 1; dj++) {
        const y = j + dj;
        if (y < 0 || y >= H) continue;
        for (let di = -1; di <= 1; di++) {
          const x = i + di;
          if (x < 0 || x >= W) continue;
          s += mask[y * W + x];
          n++;
        }
      }
      cov[j * W + i] = n ? s / n : 0;
    }
  }
  return cov;
}

const tiles = {};
for (const sheet of SHEETS) {
  const w = Math.ceil((sheet.maxX - sheet.minX) * RES);
  const h = Math.ceil((sheet.maxZ - sheet.minZ) * RES);
  const rgba = Buffer.alloc(w * h * 4);
  const walk = new Uint8Array(w * h);
  let lumSum = 0;
  let lumN = 0;
  let rawN = 0;
  for (let j = 0; j < h; j++) {
    for (let i = 0; i < w; i++) {
      const x = sheet.minX + (i + 0.5) / RES;
      const z = sheet.minZ + (j + 0.5) / RES;
      if (sheet.inside(x, z, 0)) {
        walk[j * w + i] = 1;
        rawN++;
      }
    }
  }
  const smoothed = smoothWalk(walk, w, h);
  console.log(`sandoria ${sheet.id} contour axis ${smoothed.axis.toFixed(2)} floor ${rawN} -> ${smoothed.kept}`);
  if (smoothed.axis > 2) throw new Error(`${sheet.id} bake edge ${smoothed.axis.toFixed(2)}`);
  if (smoothed.kept < rawN * 0.72 || smoothed.kept > rawN * 1.28) {
    throw new Error(`${sheet.id} contour fill ${smoothed.kept}/${rawN}`);
  }
  walk.set(smoothed.mask);
  const cover = boxCover(walk, w, h);
  for (let j = 0; j < h; j++) {
    for (let i = 0; i < w; i++) {
      const x = sheet.minX + (i + 0.5) / RES;
      const z = sheet.minZ + (j + 0.5) / RES;
      const n = hash2(Math.floor(x * 0.7), Math.floor(z * 0.7));
      const c = cover[j * w + i];
      let r;
      let g;
      let b;
      if (sheet.id === "port" && z < -1028 && Math.abs(x) < 40) {
        r = 16 + n * 6;
        g = 36 + n * 8;
        b = 52 + n * 6;
      } else {
        r = 46 + n * 8;
        g = 34 + n * 6;
        b = 26 + n * 4;
      }
      if (c > 0) {
        const stone = stoneAt(x, z);
        r = r + (stone[0] - r) * c;
        g = g + (stone[1] - g) * c;
        b = b + (stone[2] - b) * c;
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
        const band = 1.6 / RES / Math.min(rx, rz);
        const shade = smooth((1 + band - Math.sqrt(e)) / (2 * band));
        if (shade <= 0) continue;
        const a = shade * 0.2;
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
    }
  }
  castBuildingShade(sheet.id, sheet.minX, sheet.minZ, w, h, walk, rgba);
  for (let j = 0; j < h; j++) {
    for (let i = 0; i < w; i++) {
      if (!walk[j * w + i]) continue;
      const p = (j * w + i) * 4;
      let r = rgba[p];
      let g = rgba[p + 1];
      let b = rgba[p + 2];
      const L = pixLum(r, g, b);
      if (L < 0.3 && L > 0) {
        const k = 0.3 / L;
        r = Math.min(255, r * k);
        g = Math.min(255, g * k);
        b = Math.min(255, b * k);
        rgba[p] = r;
        rgba[p + 1] = g;
        rgba[p + 2] = b;
      }
      lumSum += pixLum(rgba[p], rgba[p + 1], rgba[p + 2]);
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
    axis: Math.round(smoothed.axis * 1000) / 1000,
    cobble: cobbleIsSoft() ? 1 : 0,
  };
  console.log(`sandoria ${sheet.id} ${w}x${h} lum ${lum}`);
}

writeFileSync(
  outTs,
  `/** Generated by scripts/bake-sandoria-paint.mjs. Do not edit. */\nexport const SAN_PAINT = ${JSON.stringify(tiles, null, 2)} as const;\n`,
);
