#!/usr/bin/env node
/** Ranguemont checks. Fails if the graph, the minimap, or the two sealed doors drift. */
import { spawnSync } from "node:child_process";
import { mkdirSync, readFileSync } from "node:fs";
import { chromium } from "playwright";
import { assertOrcFieldsFresh } from "./orc-fields-fresh.mjs";

assertOrcFieldsFresh();

function checkMapLabels(audit, name) {
  if (!audit || !audit.frame || !Array.isArray(audit.labels)) return `${name} map audit missing`;
  const frame = audit.frame;
  if (!(frame.maxX > frame.minX && frame.maxY > frame.minY)) return `${name} frame empty`;
  for (let i = 0; i < audit.labels.length; i++) {
    const a = audit.labels[i];
    if (a.x < frame.minX - 0.5 || a.y < frame.minY - 0.5 || a.x + a.w > frame.maxX + 0.5 || a.y + a.h > frame.maxY + 0.5) {
      return `${name} label "${a.text}" outside the frame`;
    }
    if (/chest|mining point|footprint/i.test(a.text)) return `${name} labeled a minor point "${a.text}"`;
    for (let j = i + 1; j < audit.labels.length; j++) {
      const b = audit.labels[j];
      const overlapX = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
      const overlapY = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
      if (overlapX > 0.5 && overlapY > 0.5) return `${name} labels overlap "${a.text}" and "${b.text}"`;
    }
  }
  return "";
}

const root = "/workspace";
const shots = `${root}/screenshots`;
mkdirSync(shots, { recursive: true });

const probe = spawnSync(
  process.execPath,
  [
    "--experimental-strip-types",
    "--experimental-loader",
    "/tmp/ts-ext.mjs",
    "--input-type=module",
    "-e",
    `
      import { assertPass, sealedGateSpots, passSquare, inPass } from "./src/game/pass.ts";
      import { PASS_GRAPH, gridToWorld, PASS_CELL } from "./src/game/pass-graph.ts";
      import { assertWestGrid } from "./src/game/world.ts";
      import { campHere, campRefusal } from "./src/game/afk.ts";
      import { assertEast } from "./src/game/east-ronfaure.ts";
      import { assertGhelsba } from "./src/game/ghelsba.ts";
      import { assertFort, assertYughott } from "./src/game/orc-height.ts";
      import { assertWorldLinks } from "./src/game/world-links.ts";
      assertWestGrid();
      assertPass();
      assertEast();
      assertGhelsba();
      assertFort();
      assertYughott();
      assertWorldLinks(false);
      for (const [x, z] of [[0, 0], [-10, -300], [0, -420]]) {
        if (campHere("battle", x, z)) throw new Error("town camp " + x + "," + z);
        if (campRefusal("battle", x, z) !== "Towns and instances can't hold a camp.") throw new Error("town refusal");
      }
      const poi = PASS_GRAPH.pois.find((item) => item.id === "nm_taisaijin");
      const h9 = gridToWorld(poi.gx, poi.gy);
      const gates = sealedGateSpots();
      const enter = gates.find((gate) => gate.id === "enter");
      const fx = Math.sin(enter.yaw);
      const fz = Math.cos(enter.yaw);
      let stand = null;
      for (const dist of [5, 6, 4.2, 7]) {
        const spot = { x: enter.x + fx * dist, z: enter.z + fz * dist };
        if (inPass(spot.x, spot.z, 0.3) && passSquare(spot.x, spot.z) === "F-10") {
          stand = spot;
          break;
        }
      }
      if (!stand) throw new Error("no F-10 stand in front of the enter door");
      if (passSquare(h9.x, h9.z) !== "H-9" || !inPass(h9.x, h9.z)) throw new Error("H-9 poi left the pass");
      for (const gate of gates) {
        const centre = gate.axis === "z" ? gate.z : gate.x;
        if (Math.abs(centre - gate.at) > PASS_CELL * 0.1) throw new Error(gate.id + " panel left the door line");
        if (!(gate.wallW >= gate.span * 0.95)) throw new Error(gate.id + " wall is short");
        if (!(Math.abs(gate.tilt) <= 10 * Math.PI / 180 + 1e-9)) throw new Error(gate.id + " tilt");
      }
      console.log("PASSJSON " + JSON.stringify({ h9, stand, gates }));
    `,
  ],
  { cwd: root, encoding: "utf8" },
);

const probeText = `${probe.stdout || ""}\n${probe.stderr || ""}`;
if (probe.status !== 0) {
  console.error(probeText);
  process.exit(1);
}
const marked = probe.stdout.split("\n").find((line) => line.startsWith("PASSJSON "));
if (!marked) {
  console.error(probeText);
  process.exit(1);
}
const places = JSON.parse(marked.slice("PASSJSON ".length));
console.log("assertPass ok", JSON.stringify(places));

const live = JSON.parse(readFileSync(`${root}/data/yard-save.json`, "utf8"));

function seated(position) {
  const save = structuredClone(live);
  save.position = position;
  save.engaged = false;
  save.ko = false;
  if (save.gambits?.player) save.gambits.player.on = false;
  return JSON.stringify(save);
}

async function openPass(page, position) {
  await page.route("**/*", (route) => {
    if (route.request().url().includes("/_serverFn/")) return route.abort();
    return route.continue();
  });
  await page.addInitScript((blob) => {
    localStorage.setItem("aetherfold-idle-save", blob);
  }, seated(position));
  const errors = [];
  page.on("pageerror", (err) => errors.push(String(err?.message || err)));
  await page.goto("http://127.0.0.1:8080/", { waitUntil: "domcontentloaded", timeout: 30000 });
  return errors;
}

const browser = await chromium.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

let failed = "";
try {
  const mapPage = await browser.newPage({ viewport: { width: 440, height: 956 } });
  const mapErrors = await openPass(mapPage, places.h9);
  await mapPage.waitForFunction(() => {
    const text = document.body?.innerText || "";
    return text.includes("H-9") && text.includes("Ranguemont");
  }, null, { timeout: 25000 });
  await mapPage.getByRole("button", { name: /Open the .* map/ }).click();
  await mapPage.getByRole("dialog", { name: "Zone map" }).waitFor({ timeout: 8000 });
  await mapPage.waitForTimeout(400);
  const mapShot = `${shots}/pass-minimap-h9.png`;
  await mapPage.screenshot({ path: mapShot });
  const mapText = await mapPage.locator("body").innerText();
  if (!mapText.includes("H-9") || !mapText.includes("Ranguemont")) failed = "minimap was not H-9 in the pass";
  console.log("minimap", mapShot, mapErrors.filter((err) => !err.includes("chartStrips")));
  await mapPage.close();

  const viewPage = await browser.newPage({ viewport: { width: 440, height: 956 } });
  const viewErrors = await openPass(viewPage, places.stand);
  await viewPage.waitForFunction(() => {
    const text = document.body?.innerText || "";
    return text.includes("F-10") && text.includes("Ranguemont");
  }, null, { timeout: 25000 });
  await viewPage.waitForTimeout(800);
  const viewShot = `${shots}/pass-view-f10.png`;
  await viewPage.screenshot({ path: viewShot });
  const audit = await viewPage.evaluate(() => (window.__passAudit ? window.__passAudit() : null));
  const panels = (audit || []).filter((row) => row.part === "panel" || row.name === "sealed-gate-panel");
  const walls = (audit || []).filter((row) => row.part === "wall" || row.name === "sealed-gate-wall");
  const steps = (audit || []).filter((row) => row.part === "step");
  const allowed = new Set(["panel", "wall", "step", "sconce", "cap", "glow"]);
  const stray = (audit || []).filter((row) => !allowed.has(row.part));
  console.log("view", viewShot);
  console.log("doors", JSON.stringify(audit, null, 2));
  if (!audit) failed = failed || "pass audit missing";
  if (panels.length !== 2) failed = failed || `sealed panels ${panels.length}`;
  if (steps.length !== 6) failed = failed || `sealed steps ${steps.length}`;
  if (stray.length) failed = failed || `stray door mesh ${stray.map((row) => row.name || row.type).join(",")}`;
  const sealed = (audit || []).filter((row) => allowed.has(row.part));
  if (sealed.some((row) => !row.fade)) failed = failed || "sealed gate mesh missing from the fade";
  const caps = (audit || []).filter((row) => row.part === "cap");
  const glows = (audit || []).filter((row) => row.part === "glow");
  const sconces = (audit || []).filter((row) => row.part === "sconce");
  if (sconces.length !== 4) failed = failed || `sconces ${sconces.length}`;
  if (caps.length !== 1 || glows.length !== 1) failed = failed || `cues cap ${caps.length} glow ${glows.length}`;
  const exitGate = places.gates.find((gate) => gate.id === "exit");
  const enterGate = places.gates.find((gate) => gate.id === "enter");
  const nearGate = (row, gate) => Math.hypot((row.minX + row.maxX) / 2 - gate.x, (row.minZ + row.maxZ) / 2 - gate.z) < 10;
  if (!caps.length || !nearGate(caps[0], exitGate) || nearGate(caps[0], enterGate)) failed = failed || "cap is not only on the edge-on door";
  if (!glows.length || !nearGate(glows[0], exitGate) || nearGate(glows[0], enterGate)) failed = failed || "glow is not only on the edge-on door";
  if ([...caps, ...glows].some((row) => !(row.height <= 0.3))) failed = failed || "gate cue taller than 0.3";
  if (!glows.length || glows[0].type !== "PlaneGeometry" || !(glows[0].ny >= 0.9)) {
    failed = failed || `floor strip normal ${glows[0] ? glows[0].ny : "missing"}`;
  }
  if (walls.filter((row) => nearGate(row, enterGate)).some((row) => row.opacity < 0.85)) failed = failed || "F-10 door faded from the lane";
  const tenth = 48 * 0.1;
  const tiltMax = (10 * Math.PI) / 180 + 1e-6;
  for (const gate of places.gates) {
    const nearWalls = walls.filter((row) => {
      const cx = (row.minX + row.maxX) / 2;
      const cz = (row.minZ + row.maxZ) / 2;
      return Math.hypot(cx - gate.x, cz - gate.z) < 18;
    });
    if (!nearWalls.length) {
      failed = failed || `${gate.id} cross wall missing`;
      continue;
    }
    let minX = Infinity;
    let maxX = -Infinity;
    let minZ = Infinity;
    let maxZ = -Infinity;
    for (const row of nearWalls) {
      minX = Math.min(minX, row.minX);
      maxX = Math.max(maxX, row.maxX);
      minZ = Math.min(minZ, row.minZ);
      maxZ = Math.max(maxZ, row.maxZ);
    }
    const span = gate.axis === "z" ? maxX - minX : maxZ - minZ;
    if (span < gate.span * 0.95 - 0.05) failed = failed || `${gate.id} spans ${span.toFixed(2)} of ${gate.span.toFixed(2)}`;
    const panel = panels.find((row) => Math.hypot((row.minX + row.maxX) / 2 - gate.x, (row.minZ + row.maxZ) / 2 - gate.z) < 8);
    if (!panel) {
      failed = failed || `${gate.id} panel missing from the shot`;
      continue;
    }
    const centre = gate.axis === "z" ? (panel.minZ + panel.maxZ) / 2 : (panel.minX + panel.maxX) / 2;
    if (Math.abs(centre - gate.at) > tenth) failed = failed || `${gate.id} centre ${centre.toFixed(2)} off ${gate.at}`;
    if (!(Math.abs(panel.tilt) <= tiltMax)) failed = failed || `${gate.id} tilt ${panel.tilt}`;
  }
  await viewPage.close();
  const fadePage = await browser.newPage({ viewport: { width: 440, height: 956 } });
  const fadeErrors = await openPass(fadePage, { x: 301.4, z: -24.3 });
  await fadePage.waitForFunction(() => {
    const text = document.body?.innerText || "";
    return text.includes("E-10") && text.includes("Ranguemont");
  }, null, { timeout: 45000 });
  await fadePage.waitForTimeout(700);
  const fadeAudit = await fadePage.evaluate(() => (window.__passAudit ? window.__passAudit() : null));
  const front = (fadeAudit || []).filter((row) => {
    if (row.part !== "wall") return false;
    const cz = (row.minZ + row.maxZ) / 2;
    const cx = (row.minX + row.maxX) / 2;
    return Math.hypot(cx - exitGate.x, cz - exitGate.z) < 12 && cz > exitGate.z + 2;
  });
  console.log("fade", JSON.stringify(front));
  if (!front.length || front.some((row) => !(row.fade && row.opacity <= 0.55))) {
    failed = failed || `E-10 jamb did not fade ${JSON.stringify(front)}`;
  }
  await fadePage.close();
  const realErrors = [...mapErrors, ...viewErrors, ...fadeErrors].filter((err) => !err.includes("chartStrips"));
  if (realErrors.length) failed = failed || realErrors[0];

  const standsProbe = spawnSync(
    process.execPath,
    [
      "--experimental-strip-types",
      "--experimental-loader",
      "/tmp/ts-ext.mjs",
      "--input-type=module",
      "-e",
      `
        import { regionName, zoneArrival } from "./src/game/world.ts";
        import { gridToWorld as ghelsbaWorld } from "./src/game/ghelsba-graph.ts";
        import { gridToWorld as fortWorld } from "./src/game/fort-graph.ts";
        import { gridToWorld as yughottWorld } from "./src/game/yughott-graph.ts";
        import { PASS_GRAPH, gridToWorld as passWorld } from "./src/game/pass-graph.ts";
        import { GLACIER_ARRIVE } from "./src/game/glacier.ts";
        import { orcArrival } from "./src/game/ghelsba.ts";
        const taisai = PASS_GRAPH.pois.find((poi) => poi.id === "nm_taisaijin");
        const pass = passWorld(taisai.gx, taisai.gy);
        const yug = yughottWorld(5.45, 8.5, 1);
        const yug2 = yughottWorld(9.556, 5.667, 2);
        const fort = fortWorld(6.854, 8.197);
        const outpost = ghelsbaWorld(9.238, 10.425);
        const horlais = orcArrival("horlais");
        const east = zoneArrival("east-ronfaure");
        const west = zoneArrival("ronfaure-south");
        const tomb = zoneArrival("ranperre");
        const rows = [
          { id: "south-city", x: 0, z: 0, square: "F-9" },
          { id: "north-city", x: 0, z: -300, square: "F-7" },
          { id: "port", x: 0, z: -420, square: "G-7" },
          { id: "west", x: west.x, z: west.z, square: "GRID" },
          { id: "east", x: east.x, z: east.z, square: "GRID" },
          { id: "tomb", x: tomb.x, z: tomb.z, square: "GRID" },
          { id: "pass", x: pass.x, z: pass.z, square: "H-9" },
          { id: "glacier", x: GLACIER_ARRIVE.x, z: GLACIER_ARRIVE.z, square: "GRID" },
          { id: "outpost", x: outpost.x, z: outpost.z, square: "J-11" },
          { id: "fort", x: fort.x, z: fort.z, square: "G-9" },
          { id: "yughott-1", x: yug.x, z: yug.z, square: "Map 1 · F-9" },
          { id: "yughott-2", x: yug2.x, z: yug2.z, square: "Map 2 · J-6" },
          { id: "horlais", x: horlais.x, z: horlais.z, square: "" },
        ];
        for (const row of rows) {
          row.region = regionName(row.x, row.z);
          if (!row.region) throw new Error(row.id + " has no region");
        }
        if (regionName(yug.x, yug.z) !== "Yughott Grotto") throw new Error("F-9 pool left Yughott");
        if (regionName(fort.x, fort.z) !== "Fort Ghelsba") throw new Error("Hajwaj left the fort");
        if (regionName(outpost.x, outpost.z) !== "Ghelsba Outpost") throw new Error("entrance left the outpost");
        console.log("MAPJSON " + JSON.stringify(rows));
      `,
    ],
    { cwd: root, encoding: "utf8" },
  );
  if (standsProbe.status !== 0) {
    failed = failed || `map stands\n${standsProbe.stdout || ""}\n${standsProbe.stderr || ""}`.slice(-500);
  } else if (!failed) {
    const mapLine = (standsProbe.stdout || "").split("\n").find((line) => line.startsWith("MAPJSON "));
    const stands = JSON.parse(mapLine.slice("MAPJSON ".length));
    const squarePattern = /^(?:Map [12] · )?[A-P]-\d+$/;
    for (const stand of stands) {
      const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
      const errors = await openPass(page, { x: stand.x, z: stand.z, yaw: 0 });
      try {
        await page.waitForFunction((region) => (document.body?.innerText || "").includes(region), stand.region, { timeout: 25000 });
        if (stand.square && stand.square !== "GRID") {
          await page.waitForFunction((sq) => (document.body?.innerText || "").includes(sq), stand.square, { timeout: 20000 });
        }
        await page.getByRole("button", { name: /Open the .* map/ }).click();
        await page.getByRole("dialog", { name: "Zone map" }).waitFor({ timeout: 8000 });
        await page.waitForFunction(() => window.__mapAudit && window.__mapAudit.frame && window.__mapAudit.frame.maxX > window.__mapAudit.frame.minX, null, { timeout: 8000 });
        if (stand.square && stand.square !== "GRID") {
          await page.waitForFunction((sq) => {
            const el = document.querySelector("[data-map-square]");
            return !!el && !el.hidden && (el.textContent || "").trim() === sq;
          }, stand.square, { timeout: 8000 });
        } else if (stand.square === "GRID") {
          await page.waitForFunction(() => {
            const el = document.querySelector("[data-map-square]");
            return !!el && !el.hidden && /^(?:Map [12] · )?[A-P]-\d+$/.test((el.textContent || "").trim());
          }, null, { timeout: 8000 });
        }
        const squareEl = page.locator("[data-map-square]");
        const coordEl = page.locator("[data-map-coords]");
        const squareText = ((await squareEl.textContent()) || "").trim();
        const coordText = ((await coordEl.innerText()) || "").trim();
        const squareHidden = await squareEl.isHidden();
        if (stand.square === "") {
          if (!squareHidden) failed = failed || `${stand.id} header showed a square in a zone with no grid`;
        } else if (stand.square === "GRID") {
          if (squareHidden || !squarePattern.test(squareText)) failed = failed || `${stand.id} header square "${squareText}"`;
          if (squareText === coordText || /^\(.*\)$/.test(squareText)) failed = failed || `${stand.id} header is only coordinates`;
        } else {
          if (squareHidden || squareText !== stand.square) failed = failed || `${stand.id} header "${squareText}" wanted ${stand.square}`;
          if (squareText === coordText || /^\(.*\)$/.test(squareText)) failed = failed || `${stand.id} header is only coordinates`;
        }
        if (!/^\(.*\)$/.test(coordText)) failed = failed || `${stand.id} coordinates missing`;
        const readLabels = async () => page.evaluate(() => window.__mapAudit);
        let audit = await readLabels();
        const bad = checkMapLabels(audit, stand.id);
        if (bad) failed = failed || bad;
        if (stand.id === "yughott-1") {
          const tabs = page.getByRole("tab", { name: /^Map [12]$/ });
          if ((await tabs.count()) !== 2) failed = failed || "Yughott map tabs missing";
          await page.getByRole("tab", { name: "Map 2" }).click();
          await page.waitForFunction(() => window.__mapAudit && window.__mapAudit.sheet === "yughott-2", null, { timeout: 4000 });
          audit = await readLabels();
          const switched = checkMapLabels(audit, "yughott-map-2");
          if (switched) failed = failed || switched;
          const texts = (audit?.labels || []).map((label) => label.text);
          if (!texts.some((text) => text.includes("Horlais") || text === "Home Point")) {
            failed = failed || `yughott map 2 labels ${texts.join(" | ") || "(none)"}`;
          }
        } else if (stand.id === "yughott-2") {
          const tabs = page.getByRole("tab", { name: /^Map [12]$/ });
          if ((await tabs.count()) !== 2) failed = failed || "Yughott map 2 tabs missing";
          if (audit?.sheet !== "yughott-2") failed = failed || `yughott-2 opened ${audit?.sheet || "no sheet"}`;
        } else {
          const tabs = await page.getByRole("tab").count();
          if (tabs) failed = failed || `${stand.id} showed grotto tabs`;
        }
        if (errors.length) failed = failed || errors.filter((err) => !err.includes("chartStrips"))[0] || failed;
        console.log("map", stand.id, squareHidden ? "(coords)" : squareText, (audit?.labels || []).map((label) => label.text).join(", "));
      } catch (err) {
        failed = failed || `${stand.id} ${err?.message || err}`;
      } finally {
        await page.close();
      }
      if (failed) break;
    }
  }
} catch (err) {
  failed = String(err?.message || err);
} finally {
  await browser.close();
}

if (failed) {
  console.error(JSON.stringify({ ok: false, error: failed }));
  process.exit(1);
}
console.log(JSON.stringify({ ok: true, shots: ["pass-minimap-h9.png", "pass-view-f10.png"] }));
