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

function canvasStats(png) {
  const { width, height, data } = decodePng(png);
  let black = 0;
  let player = 0;
  const x0 = Math.floor(width * 0.2);
  const x1 = Math.floor(width * 0.8);
  const y0 = Math.floor(height * 0.2);
  const y1 = Math.floor(height * 0.8);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      if (r < 12 && g < 12 && b < 12) black++;
      if (x < x0 || x >= x1 || y < y0 || y >= y1) continue;
      const lit = r > 175 && g > 155 && b > 130;
      const skin = r > 130 && g > 80 && b > 55 && r > g + 18 && r > b + 35;
      if (lit || skin) player++;
    }
  }
  return { width, height, black, player, blackPct: black / (width * height) };
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
        import { ghelsbaTerrainHeight, ghelsbaSquare } from "./src/game/ghelsba.ts";
        const bad = [];
        for (const node of GHELSBA_GRAPH.nodes) {
          const at = gridToWorld(node.gx, node.gy);
          const y = ghelsbaTerrainHeight(at.x, at.z);
          if (y > 0) bad.push(node.id + " " + y.toFixed(3));
        }
        if (bad.length) throw new Error("cliff on path: " + bad.slice(0, 6).join(", "));
        const spot = (id) => {
          const node = GHELSBA_GRAPH.nodes.find((row) => row.id === id) || GHELSBA_GRAPH.pois.find((row) => row.id === id);
          const at = gridToWorld(node.gx, node.gy);
          return { name: id, x: at.x, z: at.z, square: ghelsbaSquare(at.x, at.z), y: ghelsbaTerrainHeight(at.x, at.z) };
        };
        const stands = [spot("area_plateau"), spot("zone_in_default"), { name: "i10", x: -948, z: 770, square: ghelsbaSquare(-948, 770), y: ghelsbaTerrainHeight(-948, 770) }];
        console.log("GHELSBAJSON " + JSON.stringify({ nodes: GHELSBA_GRAPH.nodes.length, stands }));
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
        ([x, z]) => {
          const text = document.body?.innerText || "";
          return text.includes("Ghelsba") && text.includes(x) && text.includes(z);
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
    shots.push({ name: stand.name, square: stand.square, ...stats, path, errors });
    await page.close();
    if (stats.blackPct >= 0.01 || stats.player < 40) {
      return { ok: false, error: `${stand.name} black ${(stats.blackPct * 100).toFixed(2)}% player ${stats.player}`, nodes: places.nodes, shots };
    }
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
