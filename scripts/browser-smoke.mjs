#!/usr/bin/env node
import { mkdirSync, readFileSync, realpathSync, statSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname } from "node:path";
import { inflateSync } from "node:zlib";
import { chromium } from "playwright";
import { checkedOutputPath, checkedUrl } from "./browser-guard.mjs";
import { computeBrandWarnings } from "./brand-check.mjs";
import {
  authInvariantWarnings,
  buildAuthEnabled,
  compareAuthInvariant,
  probeDevAuthEnabled,
} from "./check-auth-invariant.mjs";
import {
  baselineComparison,
  bodyTextPrefix,
  derivedPaths,
  exitCodeFor,
  normalizeBodyText,
  normalizedBodyTextHash,
  parseSmokeArgs,
} from "./browser-smoke-verdict.mjs";

const args = parseSmokeArgs(process.argv.slice(2), process.env);
if (args.error) {
  console.error(JSON.stringify({ ok: false, error: args.error }, null, 2));
  process.exit(1);
}

const url = checkedUrl(args.url);
const outPng = checkedOutputPath(args.outPng, ["/workspace"]);
const derived = derivedPaths(outPng);
const mobilePng = checkedOutputPath(derived.mobilePng, ["/workspace"]);
const outJson = checkedOutputPath(derived.verdictJson, ["/workspace"], "verdict JSON");

const MAX_BASELINE_BYTES = 1024 * 1024;
const baselineRequested = Boolean(args.baseline);
let baselinePath = null;
let baselineResolveError = null;
if (baselineRequested) {
  try {
    baselinePath = checkedOutputPath(realpathSync(args.baseline), ["/workspace"], "baseline");
  } catch (err) {
    baselineResolveError = err?.code ?? "unresolvable path";
  }
  if (baselinePath === outJson) {
    console.error(
      JSON.stringify(
        {
          ok: false,
          error:
            `--baseline ${args.baseline} is this run's own verdict output; ` +
            "pass a distinct output PNG (e.g. app-builder-built.png) so the baseline is not overwritten",
        },
        null,
        2,
      ),
    );
    process.exit(1);
  }
}

const timeoutMs = Number(process.env.BROWSER_SMOKE_TIMEOUT_MS || 45000);

const VIEWPORTS = [
  { name: "desktop", width: 1280, height: 800, screenshot: outPng },
  { name: "mobile", width: 390, height: 844, screenshot: mobilePng },
];

mkdirSync(dirname(outPng), { recursive: true });

function compareAgainstBaseline(verdict) {
  if (!baselinePath) {
    return {
      divergesFromBaseline: true,
      reasons: [`baseline unreadable: ${baselineResolveError ?? "unresolvable path"}`],
    };
  }
  try {
    if (statSync(baselinePath).size > MAX_BASELINE_BYTES) {
      return { divergesFromBaseline: true, reasons: ["baseline unreadable: too large"] };
    }
    return baselineComparison(verdict, readFileSync(baselinePath, "utf8"));
  } catch (err) {
    return {
      divergesFromBaseline: true,
      reasons: [`baseline unreadable: ${err?.code ?? "read error"}`],
    };
  }
}

function decodePng(buf) {
  let o = 8;
  let width = 0;
  let height = 0;
  let colorType = 6;
  const idat = [];
  while (o + 8 <= buf.length) {
    const len = buf.readUInt32BE(o);
    o += 4;
    const type = buf.toString("ascii", o, o + 4);
    o += 4;
    const data = buf.subarray(o, o + len);
    o += len + 4;
    if (type === "IHDR") {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      colorType = data[9];
    } else if (type === "IDAT") idat.push(data);
    else if (type === "IEND") break;
  }
  const bpp = colorType === 6 ? 4 : 3;
  const raw = inflateSync(Buffer.concat(idat));
  const stride = width * bpp;
  const out = Buffer.alloc(width * height * 4);
  let p = 0;
  let prev = Buffer.alloc(stride);
  const paeth = (a, b, c) => {
    const pp = a + b - c;
    const pa = Math.abs(pp - a);
    const pb = Math.abs(pp - b);
    const pc = Math.abs(pp - c);
    if (pa <= pb && pa <= pc) return a;
    return pb <= pc ? b : c;
  };
  for (let y = 0; y < height; y++) {
    const filter = raw[p++];
    const row = Buffer.from(raw.subarray(p, p + stride));
    p += stride;
    for (let i = 0; i < stride; i++) {
      const left = i >= bpp ? row[i - bpp] : 0;
      const up = prev[i];
      const ul = i >= bpp ? prev[i - bpp] : 0;
      let v = row[i];
      if (filter === 1) v += left;
      else if (filter === 2) v += up;
      else if (filter === 3) v += (left + up) >> 1;
      else if (filter === 4) v += paeth(left, up, ul);
      row[i] = v & 255;
    }
    prev = row;
    for (let x = 0; x < width; x++) {
      const s = x * bpp;
      const d = (y * width + x) * 4;
      out[d] = row[s];
      out[d + 1] = row[s + 1];
      out[d + 2] = row[s + 2];
      out[d + 3] = bpp === 4 ? row[s + 3] : 255;
    }
  }
  return { width, height, data: out };
}

function lumOf(r, g, b) {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

function median(values) {
  return percentile(values, 0.5);
}

function percentile(values, q) {
  if (!values.length) return 0;
  values.sort((a, b) => a - b);
  return values[Math.min(values.length - 1, Math.floor(values.length * q))];
}

function canvasStats(png) {
  const { width, height, data } = decodePng(png);
  let black = 0;
  for (let i = 0; i < width * height; i++) {
    const r = data[i * 4];
    const g = data[i * 4 + 1];
    const b = data[i * 4 + 2];
    // The log panel is HTML painted over the canvas. Its ink is not terrain.
    if (r === 10 && g === 12 && b === 16) continue;
    if (r < 20 && g < 20 && b < 20) black++;
  }
  const at = (x, y) => {
    const i = (y * width + x) * 4;
    return [data[i], data[i + 1], data[i + 2]];
  };
  let sceneBottom = Math.floor(height * 0.45);
  for (let y = Math.floor(height * 0.2); y < height; y += 4) {
    let sum = 0;
    let n = 0;
    for (let x = 0; x < width; x += 8) {
      const [r, g, b] = at(x, y);
      sum += lumOf(r, g, b);
      n++;
    }
    if (sum / n < 55) {
      sceneBottom = y;
      break;
    }
  }
  // Shirt highlights are the only near-white pixels on the hero. Dirt is darker and warmer.
  const cell = 32;
  const bins = new Map();
  const xLo = Math.floor(width * 0.3);
  const xHi = Math.floor(width * 0.7);
  for (let y = 0; y < sceneBottom; y++) {
    for (let x = xLo; x < xHi; x++) {
      const [r, g, b] = at(x, y);
      if (r <= 230 || g <= 210 || b <= 190) continue;
      const key = `${(x / cell) | 0},${(y / cell) | 0}`;
      bins.set(key, (bins.get(key) || 0) + 1);
    }
  }
  let seed = null;
  for (const [key, n] of bins) if (!seed || n > seed.n) seed = { key, n };
  let minX = width;
  let maxX = 0;
  let minY = sceneBottom;
  let maxY = 0;
  let hits = 0;
  if (seed) {
    const [sx, sy] = seed.key.split(",").map(Number);
    for (const [key, n] of bins) {
      if (n < 8) continue;
      const [ix, iy] = key.split(",").map(Number);
      if (Math.abs(ix - sx) > 3 || Math.abs(iy - sy) > 4) continue;
      hits += n;
      minX = Math.min(minX, ix * cell);
      maxX = Math.max(maxX, (ix + 1) * cell);
      minY = Math.min(minY, iy * cell);
      maxY = Math.max(maxY, (iy + 1) * cell);
    }
  }
  const collect = (xa, xb, ya, yb) => {
    const vals = [];
    const yStart = Math.max(0, ya);
    const yEnd = Math.min(sceneBottom, yb);
    const xStart = Math.max(0, xa);
    const xEnd = Math.min(width, xb);
    for (let y = yStart; y < yEnd; y += 2) {
      for (let x = xStart; x < xEnd; x += 2) {
        const [r, g, b] = at(x, y);
        vals.push(lumOf(r, g, b));
      }
    }
    return vals;
  };
  // Ground just east of the hero, below the shirt, is the path under their feet.
  // If that box falls into the dark HUD band, slide it up onto the floor.
  let pathX0 = hits > 40 ? maxX + 70 : Math.floor(width * 0.55);
  let pathX1 = hits > 40 ? maxX + 180 : Math.floor(width * 0.68);
  let pathY0 = hits > 40 ? maxY + 36 : Math.floor(sceneBottom * 0.78);
  let pathY1 = hits > 40 ? maxY + 84 : sceneBottom - 4;
  if (pathY0 > sceneBottom - 12) {
    const shift = pathY0 - (sceneBottom - 52);
    pathY0 -= shift;
    pathY1 -= shift;
  }
  const pathVals = collect(pathX0, pathX1, pathY0, pathY1);
  const top = Math.max(12, Math.floor(sceneBottom * 0.22));
  const side = Math.floor(width * 0.22);
  const plateauVals = [...collect(8, side, 6, top), ...collect(width - side, width - 8, 6, top)];
  const pathLum = median(pathVals);
  // Upper corners mix the dark plateau with a lighter shoulder. The plateau
  // pixel is the darker part of that sample, not the bright shoulder.
  const plateauLum = percentile(plateauVals, 0.45);
  const cliffVals = [];
  const cliffY0 = Math.floor(sceneBottom * 0.2);
  const cliffY1 = Math.floor(sceneBottom * 0.68);
  const playerX0 = hits > 40 ? minX - 20 : -1;
  const playerX1 = hits > 40 ? maxX + 20 : -1;
  const playerY0 = hits > 40 ? minY - 12 : -1;
  const playerY1 = hits > 40 ? Math.min(maxY + 8, sceneBottom) : -1;
  for (let y = cliffY0; y < cliffY1; y += 2) {
    for (let x = Math.floor(width * 0.06); x < width - Math.floor(width * 0.06); x += 2) {
      if (x > playerX0 && x < playerX1 && y > playerY0 && y < playerY1) continue;
      const [r, g, b] = at(x, y);
      if (r === 10 && g === 12 && b === 16) continue;
      if (b > r + 16 && b > g + 6 && b < 130) continue;
      if (r > 200 && g > 165 && b < 190) continue;
      if (r > 225 && g > 205 && b > 185) continue;
      const L = lumOf(r, g, b);
      if (L < 35 || L > 185) continue;
      cliffVals.push(L);
    }
  }
  cliffVals.sort((a, b) => a - b);
  const cliffLum = cliffVals.length ? cliffVals[Math.floor(cliffVals.length * 0.08)] : 0;
  return {
    width,
    height,
    black,
    blackPct: black / (width * height),
    pathLum: Math.round(pathLum * 10) / 10,
    plateauLum: Math.round(plateauLum * 10) / 10,
    lumDelta: Math.round(Math.abs(pathLum - plateauLum) * 10) / 10,
    cliffLum: Math.round(cliffLum * 10) / 10,
    cliffDelta: Math.round(Math.abs(pathLum - cliffLum) * 10) / 10,
    sceneBottom,
    playerHits: hits,
  };
}

function ghelsbaPlaces() {
  const probe = spawnSync(
    process.execPath,
    [
      "--experimental-strip-types",
      "--experimental-loader",
      "/tmp/ts-ext.mjs",
      "--input-type=module",
      "-e",
      `
        import { GHELSBA_GRAPH, gridToWorld } from "./src/game/ghelsba-graph.ts";
        import { assertGhelsba, ghelsbaTerrainHeight, ghelsbaSquare } from "./src/game/ghelsba.ts";
        assertGhelsba();
        const bad = [];
        for (const node of GHELSBA_GRAPH.nodes) {
          const at = gridToWorld(node.gx, node.gy);
          const y = ghelsbaTerrainHeight(at.x, at.z);
          if (y > 0) bad.push(node.id + " " + y.toFixed(3));
        }
        if (bad.length) throw new Error("cliff on path: " + bad.slice(0, 6).join(", "));
        const spot = (id, x, z) => {
          const node = id ? (GHELSBA_GRAPH.nodes.find((row) => row.id === id) || GHELSBA_GRAPH.pois.find((row) => row.id === id)) : null;
          const at = node ? gridToWorld(node.gx, node.gy) : { x, z };
          const south = () => ghelsbaTerrainHeight(at.x, at.z + 10);
          const southY = south();
          if (south() !== southY) throw new Error("south height moved " + (id || "i10"));
          return { name: id || "i10", x: at.x, z: at.z, square: ghelsbaSquare(at.x, at.z), y: ghelsbaTerrainHeight(at.x, at.z), southY };
        };
        const stands = [spot("area_plateau"), spot("zone_in_default"), spot(null, -948, 770)];
        const door = spot("door_hut");
        const f10 = { ...door, x: door.x - 3.4 };
        if (ghelsbaSquare(f10.x, f10.z) !== "F-10") throw new Error("F-10 stand left the square");
        if (ghelsbaTerrainHeight(f10.x, f10.z) > 0) throw new Error("F-10 stand left the floor");
        const dress = [f10, spot("crystal"), spot("octagon"), spot("area_nw_snake"), spot("j_g7")];
        console.log("GHELSBAJSON " + JSON.stringify({ nodes: GHELSBA_GRAPH.nodes.length, stands, dress }));
      `,
    ],
    { cwd: "/workspace", encoding: "utf8" },
  );
  const text = `${probe.stdout || ""}\n${probe.stderr || ""}`;
  if (probe.status !== 0) return { ok: false, error: text.slice(-800) };
  const line = (probe.stdout || "").split("\n").find((row) => row.startsWith("GHELSBAJSON "));
  if (!line) return { ok: false, error: text.slice(-800) };
  return { ok: true, ...JSON.parse(line.slice("GHELSBAJSON ".length)) };
}

async function checkGhelsba(browser, url) {
  const places = ghelsbaPlaces();
  if (!places.ok) return places;
  const live = JSON.parse(readFileSync("/workspace/data/yard-save.json", "utf8"));
  const seated = (position) => {
    const save = structuredClone(live);
    save.position = position;
    save.engaged = false;
    save.ko = false;
    if (save.gambits?.player) save.gambits.player.on = false;
    return JSON.stringify(save);
  };
  const shots = [];
  for (const stand of places.stands) {
    const pair = [];
    for (const step of [0, 3]) {
      const x = stand.x + step;
      const z = stand.z;
      const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
      const errors = [];
      page.on("console", (msg) => {
        if (msg.type() === "error" && !msg.text().includes("ERR_FAILED")) errors.push(msg.text());
      });
      page.on("pageerror", (err) => errors.push(String(err?.message || err)));
      await page.route("**/*", (route) => {
        if (route.request().url().includes("/_serverFn/")) return route.abort();
        return route.continue();
      });
      await page.addInitScript((blob) => localStorage.setItem("aetherfold-idle-save", blob), seated({ x, z, yaw: 0 }));
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
      const needleX = x.toFixed(1);
      const needleZ = z.toFixed(1);
      try {
        await page.waitForFunction(
          ([px, pz]) => {
            const text = document.body?.innerText || "";
            return text.includes("Ghelsba") && text.includes(px) && text.includes(pz);
          },
          [needleX, needleZ],
          { timeout: 40000 },
        );
      } catch (err) {
        const text = await page.locator("body").innerText().catch(() => "");
        await page.close();
        return { ok: false, error: `${stand.name} +${step} never seated (${err.message})`, text: text.slice(0, 240), errors, shots };
      }
      await page.waitForTimeout(900);
      const path = `/workspace/screenshots/ghelsba-${stand.name}${step ? "-east" : ""}.png`;
      const png = await page.locator("canvas").first().screenshot({ path });
      const stats = canvasStats(png);
      pair.push({ name: stand.name, step, square: stand.square, ...stats, southY: stand.southY, path, errors });
      await page.close();
      if (errors.length) {
        return { ok: false, error: `${stand.name} +${step} ${errors[0]}`, nodes: places.nodes, shots: [...shots, ...pair] };
      }
      if (stats.playerHits < 40) {
        return { ok: false, error: `${stand.name} +${step} player occluded (${stats.playerHits})`, nodes: places.nodes, shots: [...shots, ...pair] };
      }
      if (!(stats.lumDelta >= 35)) {
        return { ok: false, error: `${stand.name} +${step} path/plateau lum ${stats.lumDelta} (path ${stats.pathLum} plateau ${stats.plateauLum})`, nodes: places.nodes, shots: [...shots, ...pair] };
      }
      if (!(stats.cliffDelta >= 20)) {
        return { ok: false, error: `${stand.name} +${step} cliff/floor lum ${stats.cliffDelta} (cliff ${stats.cliffLum} floor ${stats.pathLum})`, nodes: places.nodes, shots: [...shots, ...pair] };
      }
    }
    if (pair[0].southY !== pair[1].southY) {
      return { ok: false, error: `${stand.name} south lip moved ${pair[0].southY} -> ${pair[1].southY}`, nodes: places.nodes, shots: [...shots, ...pair] };
    }
    shots.push(...pair);
  }
  for (const stand of places.dress) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    const errors = [];
    page.on("console", (msg) => {
      if (msg.type() === "error" && !msg.text().includes("ERR_FAILED")) errors.push(msg.text());
    });
    page.on("pageerror", (err) => errors.push(String(err?.message || err)));
    await page.route("**/*", (route) => {
      if (route.request().url().includes("/_serverFn/")) return route.abort();
      return route.continue();
    });
    await page.addInitScript((blob) => localStorage.setItem("aetherfold-idle-save", blob), seated({ x: stand.x, z: stand.z, yaw: 0 }));
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
    const needleX = stand.x.toFixed(1);
    const needleZ = stand.z.toFixed(1);
    try {
      await page.waitForFunction(
        ([px, pz]) => {
          const text = document.body?.innerText || "";
          return text.includes("Ghelsba") && text.includes(px) && text.includes(pz);
        },
        [needleX, needleZ],
        { timeout: 40000 },
      );
    } catch (err) {
      const text = await page.locator("body").innerText().catch(() => "");
      await page.close();
      return { ok: false, error: `${stand.name} never seated (${err.message})`, text: text.slice(0, 240), errors, shots };
    }
    await page.waitForTimeout(900);
    const path = `/workspace/screenshots/ghelsba-${stand.name}.png`;
    const png = await page.locator("canvas").first().screenshot({ path });
    const stats = canvasStats(png);
    const shot = { name: stand.name, step: 0, square: stand.square, ...stats, path, errors };
    shots.push(shot);
    await page.close();
    if (errors.length) return { ok: false, error: `${stand.name} ${errors[0]}`, nodes: places.nodes, shots };
    if (stats.playerHits < 40) return { ok: false, error: `${stand.name} player occluded (${stats.playerHits})`, nodes: places.nodes, shots };
  }
  return { ok: true, nodes: places.nodes, shots };
}

let browser = null;
try {
  browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });

  const viewports = {};
  for (const vp of VIEWPORTS) {
    const errors = { consoleErrors: [], pageErrors: [] };
    const page = await browser.newPage({
      viewport: { width: vp.width, height: vp.height },
    });
    await page.addInitScript(() => {
      const stop = (event) => event.stopImmediatePropagation();
      window.addEventListener("pagehide", stop, true);
      window.addEventListener("beforeunload", stop, true);
      document.addEventListener("visibilitychange", stop, true);
    });
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.consoleErrors.push(msg.text());
    });
    page.on("pageerror", (err) => errors.pageErrors.push(String(err?.message || err)));
    // `domcontentloaded`, not `networkidle`: Vite keeps an HMR websocket open, so
    // networkidle never settles and would burn the whole timeout.
    const resp = await page.goto(url, { waitUntil: "domcontentloaded", timeout: timeoutMs });
    const status = resp?.status() ?? 0;
    await page.waitForTimeout(1000);

    const title = await page.title();
    const hasCanvas = (await page.locator("canvas").count()) > 0;
    const bodyText = await page
      .locator("body")
      .innerText()
      .catch(() => "");
    const horizontalOverflow = await page.evaluate(() => {
      const el = document.documentElement;
      return el.scrollWidth > el.clientWidth + 1;
    });
    await page.screenshot({ path: vp.screenshot, fullPage: false });
    await page.close();

    viewports[vp.name] = {
      width: vp.width,
      height: vp.height,
      status,
      title,
      hasCanvas,
      bodyTextLen: normalizeBodyText(bodyText).length,
      bodyTextHash: normalizedBodyTextHash(bodyText),
      bodyTextPrefix: bodyTextPrefix(bodyText),
      horizontalOverflow,
      consoleErrors: errors.consoleErrors,
      pageErrors: errors.pageErrors,
      screenshot: vp.screenshot,
    };
  }

  const brandWarnings = computeBrandWarnings({ hasCanvas: viewports.desktop.hasCanvas });
  const ghelsba = await checkGhelsba(browser, url);
  // Only a dev server answers /__app-env, so smoking the built output reads as
  // indeterminate — report a divergence, never the absence of an observation.
  const authWarnings = authInvariantWarnings(
    compareAuthInvariant({
      devAuthEnabled: await probeDevAuthEnabled(url),
      buildAuthEnabled: buildAuthEnabled(),
    }),
  );
  const verdict = { url, viewports, brandWarnings, authWarnings, ghelsba, verdictFile: outJson };
  if (baselineRequested) {
    const { divergesFromBaseline, reasons } = compareAgainstBaseline(verdict);
    verdict.divergesFromBaseline = divergesFromBaseline;
    verdict.baselineReasons = reasons;
  }

  writeFileSync(outJson, JSON.stringify(verdict, null, 2));
  console.log(JSON.stringify(verdict, null, 2));
  for (const w of [...brandWarnings, ...authWarnings]) console.error(w);
  // Set the code rather than aborting the process so the `finally` browser
  // teardown always runs (agents typically smoke twice per turn; leaking
  // Chromium accumulates across retries).
  process.exitCode = exitCodeFor(viewports);
  if (!ghelsba?.ok) process.exitCode = 1;
} catch (err) {
  const failure = { ok: false, url, error: String(err?.message || err) };
  try {
    writeFileSync(outJson, JSON.stringify(failure, null, 2));
  } catch (writeErr) {
    failure.verdictWriteError = String(writeErr?.message || writeErr);
  }
  console.error(JSON.stringify(failure, null, 2));
  process.exitCode = 1;
} finally {
  await browser?.close();
}
