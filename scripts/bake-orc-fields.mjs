/** Bake Fort / Yughott heightfields. Run with tsx. */
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { bakeAllFields, slowFloorY, slowFortSample, slowYugSample } from "../src/game/orc-bake.ts";
import { FORT_GRAPH, gridToWorld as fortWorld } from "../src/game/fort-graph.ts";
import { YUGHOTT_GRAPHS, gridToWorld as yugWorld } from "../src/game/yughott-graph.ts";
import { readFloorY, sampleTrace } from "../src/game/orc-field-read.ts";
import { assertOrcFieldsFresh, bakeInputsHash } from "./orc-fields-fresh.mjs";

const root = resolve(import.meta.dirname, "..");
const outPath = resolve(root, "src/game/orc-fields.generated.ts");

if (process.argv.includes("--check")) {
  assertOrcFieldsFresh();
  console.log("orc fields fresh");
  process.exit(0);
}

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function b64(bytes) {
  return Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength).toString("base64");
}

function quant(n) {
  return Math.max(0, Math.min(255, Math.round(n * 255))) / 255;
}

const t0 = performance.now();
const fields = bakeAllFields();
console.log(`bake ${Math.round(performance.now() - t0)}ms`);

function checkVertices(field, slowAt) {
  const rnd = mulberry32(field.id === "fort" ? 11 : field.id === "yug1" ? 22 : 33);
  const w = field.nX + 1;
  const h = field.nZ + 1;
  const drawn = [];
  for (let j = 0; j < h; j++) {
    for (let i = 0; i < w; i++) if (field.draw[j * w + i]) drawn.push(j * w + i);
  }
  if (drawn.length < 500) throw new Error(`${field.id} has ${drawn.length} drawn vertices`);
  let worstY = 0;
  let worstC = 0;
  for (let n = 0; n < 500; n++) {
    const idx = drawn[Math.floor(rnd() * drawn.length)];
    const i = idx % w;
    const j = (idx / w) | 0;
    const x = field.x0 + i * field.step;
    const z = field.z0 + j * field.step;
    const old = slowAt(x, z);
    const neu = sampleTrace(field, x, z);
    if (!old || !neu) throw new Error(`${field.id} sample missing at ${x},${z}`);
    const dy = Math.abs(old.y - neu.y);
    const dr = Math.abs(quant(old.r) - neu.r);
    const dg = Math.abs(quant(old.g) - neu.g);
    const db = Math.abs(quant(old.b) - neu.b);
    worstY = Math.max(worstY, dy);
    worstC = Math.max(worstC, dr, dg, db);
    if (dy > 0.02 || dr > 0.02 || dg > 0.02 || db > 0.02) {
      throw new Error(`${field.id} vertex ${i},${j} dy ${dy} dc ${Math.max(dr, dg, db)}`);
    }
    const oldFloor = slowFloorY(x, z);
    const neuFloor = readFloorY(field, x, z);
    const fy = Math.abs(oldFloor - (neuFloor ?? 0));
    if (field.floor[idx] && fy > 0.02) throw new Error(`${field.id} floorY ${oldFloor} vs ${neuFloor}`);
    if (!field.floor[idx] && neuFloor != null) throw new Error(`${field.id} floor leaked`);
  }
  console.log(`${field.id} 500 samples worstY ${worstY.toFixed(4)} worstC ${worstC.toFixed(4)}`);
}

for (const field of fields) {
  const slowAt = field.id === "fort"
    ? (x, z) => slowFortSample(field, x, z)
    : (x, z) => slowYugSample(field, x, z, field.map);
  checkVertices(field, slowAt);
}

let worstNode = 0;
let worstNodeName = "";
for (const node of FORT_GRAPH.nodes) {
  const at = fortWorld(node.gx, node.gy);
  const old = slowFloorY(at.x, at.z);
  const neu = readFloorY(fields[0], at.x, at.z) ?? 0;
  const dy = Math.abs(old - neu);
  if (dy > worstNode) {
    worstNode = dy;
    worstNodeName = node.id;
  }
}
for (const map of [1, 2]) {
  const field = fields[map];
  for (const node of YUGHOTT_GRAPHS[map].nodes) {
    const at = yugWorld(node.gx, node.gy, map);
    const old = slowFloorY(at.x, at.z);
    const neu = readFloorY(field, at.x, at.z) ?? 0;
    const dy = Math.abs(old - neu);
    if (dy > worstNode) {
      worstNode = dy;
      worstNodeName = `yug${map}:${node.id}`;
    }
  }
}
console.log(`node floor worst ${worstNode.toFixed(3)} ${worstNodeName}`);

const rnd = mulberry32(404);
let interior = 0;
let worstFlat = 0;
for (const field of fields) {
  const slowAt = field.id === "fort"
    ? (x, z) => slowFortSample(field, x, z)
    : (x, z) => slowYugSample(field, x, z, field.map);
  let n = 0;
  let tries = 0;
  const w = field.nX + 1;
  while (n < 500 && tries < 40000) {
    tries++;
    const x = field.x0 + rnd() * field.nX * field.step;
    const z = field.z0 + rnd() * field.nZ * field.step;
    const u = (x - field.x0) / field.step;
    const v = (z - field.z0) / field.step;
    const i = Math.min(field.nX - 1, Math.floor(u));
    const j = Math.min(field.nZ - 1, Math.floor(v));
    const tx = u - i;
    const tz = v - j;
    const corners = [j * w + i, j * w + i + 1, (j + 1) * w + i, (j + 1) * w + i + 1];
    if (corners.some((idx) => !field.draw[idx])) continue;
    const ys = corners.map((idx) => field.ys[idx]);
    const mix = ys[0] + (ys[1] - ys[0]) * tx + (ys[2] - ys[0]) * tz + (ys[0] - ys[1] - ys[2] + ys[3]) * tx * tz;
    const neu = sampleTrace(field, x, z);
    if (!neu || Math.abs(neu.y - mix) > 1e-4) throw new Error(`${field.id} bilinear drift`);
    const flat = Math.max(...ys) - Math.min(...ys) < 1e-4;
    if (flat) {
      const old = slowAt(x, z);
      if (!old) throw new Error(`${field.id} flat hole`);
      const dy = Math.abs(old.y - neu.y);
      worstFlat = Math.max(worstFlat, dy);
      if (dy > 0.02) throw new Error(`${field.id} flat height ${dy.toFixed(3)} at ${x.toFixed(1)},${z.toFixed(1)}`);
    }
    n++;
    interior++;
  }
  if (n < 500) throw new Error(`${field.id} only ${n} interior samples`);
}
console.log(`interior samples ${interior} flat worst ${worstFlat.toFixed(4)}`);

const hash = bakeInputsHash();
const chunk = (field) => `  x0: ${field.x0},
  z0: ${field.z0},
  step: ${field.step},
  nX: ${field.nX},
  nZ: ${field.nZ},
  ys: "${b64(field.ys)}",
  floorY: "${b64(field.floorY)}",
  draw: "${b64(field.draw)}",
  floor: "${b64(field.floor)}",
  rgb: "${b64(field.rgb)}",`;

const [fort, yug1, yug2] = fields;
const text = `/* Generated by scripts/bake-orc-fields.mjs. Do not edit. */
export const ORC_FIELDS_HASH = "${hash}";

export const FORT_FIELD = {
${chunk(fort)}
};

export const YUG1_FIELD = {
${chunk(yug1)}
};

export const YUG2_FIELD = {
${chunk(yug2)}
};
`;
writeFileSync(outPath, text);
assertOrcFieldsFresh();
console.log(`wrote ${outPath} hash ${hash.slice(0, 12)}`);
