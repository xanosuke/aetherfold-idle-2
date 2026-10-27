import { useEffect, useRef, useState } from "react";

declare const __BUILD_SHA__: string;
import { readRadar, type RadarFrame, type RadarKind } from "@/game/radar";
import { orcLayout, type OrcChart } from "@/game/ghelsba";
import { MANUAL_EAST_ROAD_X, MANUAL_EAST_ROAD_Z, MANUAL_EAST_X, MANUAL_EAST_Z, MANUAL_OUTPOST_X, MANUAL_OUTPOST_Z, MANUAL_X, MANUAL_Z } from "@/game/fov";
import {
  BRIDGE_HALF,
  BRIDGE_Z0,
  BRIDGE_Z1,
  CHATEAU_FOOT,
  CHOCO_ROAD,
  EAST_ROAD,
  FISHER,
  JOULET,
  GATE_HALF,
  NORTH_AVENUE,
  NORTH_HARBOR,
  NORTH_HOUSES,
  NORTH_LANE,
  NORTH_LINK,
  NORTH_ROAD,
  NORTH_WATCH,
  NORTH_YARD,
  PEN_EDGE,
  PORT_HOUSES,
  PORT_PIER,
  PORT_QUAY,
  PORT_YARD,
  EXITS,
  RAMPART,
  RON_CELL,
  RON_COAST,
  RON_MARKS,
  RON_SIZE,
  RON_X0,
  RON_Z0,
  SAN_NORTH,
  SAN_SOUTH,
  SOUTH_HOUSES,
  WARD_NORTH,
  WARD_SIDE,
  ZONE_GATES,
  type CityBlock,
  type CityRect,
} from "@/game/world";
import { EAST_CELL, EAST_COAST, EAST_PATHS, EAST_PLACES, EAST_SIZE, EAST_WATER, EAST_X0, EAST_Z0, eastSquare } from "@/game/east-ronfaure";
import { tombChart, tombSquare } from "@/game/tomb";
import { PASS_CELL, passChart, passSquare } from "@/game/pass";
import { glacierChart, glacierSquare } from "@/game/glacier";
import { squareOf, ZONE_GRIDS } from "@/game/zone-grid";
import { ghelsbaGridSquare, worldToGrid as ghelsbaToGrid } from "@/game/ghelsba-graph";
import { fortGridSquare, worldToGrid as fortToGrid } from "@/game/fort-graph";
import { worldToGrid as yughottToGrid, yughottGridSquare, yughottMapAt } from "@/game/yughott-graph";

/** How much ground the circle covers. The ward fits; the south gate scrolls in. */
const VIEW = 24;

const KIND_FILL: Record<RadarKind, string> = {
  foe: "#d24b4b",
  trust: "#f4ecd4",
  pet: "#2f6dff",
  crystal: "#8ec8ef",
};

type Pt = { x: number; y: number };

function traceCoast(ctx: CanvasRenderingContext2D, at: (x: number, z: number) => Pt) {
  ctx.beginPath();
  for (let i = 0; i < RON_COAST.length; i++) {
    const [col, row] = RON_COAST[i];
    const p = at(RON_X0 + col * RON_CELL, RON_Z0 + row * RON_CELL);
    if (i === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  }
  ctx.closePath();
}

function paintRonGround(ctx: CanvasRenderingContext2D, at: (x: number, z: number) => Pt, dpr: number, rim: number) {
  const nw = at(RON_X0, RON_Z0);
  const se = at(RON_X0 + RON_SIZE, RON_Z0 + RON_SIZE);
  ctx.fillStyle = "#4e463c";
  ctx.fillRect(nw.x, nw.y, se.x - nw.x, se.y - nw.y);
  traceCoast(ctx, at);
  ctx.fillStyle = "#2f6a34";
  ctx.fill();
  ctx.lineJoin = "round";
  ctx.lineWidth = rim;
  ctx.strokeStyle = "#d7c7a2";
  ctx.stroke();
  ctx.lineWidth = Math.max(1, rim * 0.35);
  ctx.strokeStyle = "#241c14";
  ctx.stroke();
  const trunk = RON_MARKS.southGate.x - 10;
  ctx.strokeStyle = "#8d7044";
  ctx.lineWidth = Math.max(dpr * 1.6, rim * 0.55);
  ctx.lineCap = "round";
  const stroke = (x1: number, z1: number, x2: number, z2: number) => {
    const a = at(x1, z1);
    const b = at(x2, z2);
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  };
  const side = RAMPART.x - 14;
  stroke(trunk, RAMPART.southZ + 12, trunk, 700);
  stroke(side, 400, side, RAMPART.southZ);
  stroke(side, 392, EXITS.ghelsba.x, EXITS.ghelsba.z + 10);
  stroke(side, SAN_NORTH.z, SAN_NORTH.x, SAN_NORTH.z);
  stroke(trunk, RAMPART.southZ + 12, SAN_SOUTH.x, SAN_SOUTH.z);
  stroke(trunk, EXITS.eastA.z, EXITS.eastA.x - 8, EXITS.eastA.z);
  stroke(trunk, EXITS.eastB.z, EXITS.eastB.x - 8, EXITS.eastB.z);
  stroke(trunk, RON_MARKS.outpost.z, RON_MARKS.outpost.x, RON_MARKS.outpost.z);
  stroke(trunk, 748, EXITS.theine.x, EXITS.theine.z - 8);
  stroke(trunk, RON_MARKS.knightwell.z, RON_MARKS.knightwell.x, RON_MARKS.knightwell.z);
  const pond = at(RON_MARKS.knightwell.x, RON_MARKS.knightwell.z);
  const pondScale = Math.abs(at(RON_MARKS.knightwell.x + 14, RON_MARKS.knightwell.z).x - pond.x);
  ctx.fillStyle = "#2f6d86";
  ctx.beginPath();
  ctx.ellipse(pond.x, pond.y, pondScale, pondScale * 0.7, 0, 0, Math.PI * 2);
  ctx.fill();
}

function traceEast(ctx: CanvasRenderingContext2D, at: (x: number, z: number) => Pt) {
  ctx.beginPath();
  for (let i = 0; i < EAST_COAST.length; i++) {
    const [col, row] = EAST_COAST[i];
    const p = at(EAST_X0 + col * EAST_CELL, EAST_Z0 + row * EAST_CELL);
    if (i === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  }
  ctx.closePath();
}

function paintEastGround(ctx: CanvasRenderingContext2D, at: (x: number, z: number) => Pt, dpr: number, rim: number) {
  const nw = at(EAST_X0, EAST_Z0);
  const se = at(EAST_X0 + EAST_SIZE, EAST_Z0 + EAST_SIZE);
  ctx.fillStyle = "#4e463c";
  ctx.fillRect(nw.x, nw.y, se.x - nw.x, se.y - nw.y);
  traceEast(ctx, at);
  ctx.fillStyle = "#2f6a34";
  ctx.fill();
  ctx.lineJoin = "round";
  ctx.lineWidth = rim;
  ctx.strokeStyle = "#d7c7a2";
  ctx.stroke();
  ctx.lineWidth = Math.max(1, rim * 0.35);
  ctx.strokeStyle = "#241c14";
  ctx.stroke();
  ctx.fillStyle = "#2f6d86";
  for (const span of EAST_WATER) {
    const p = at((span.minX + span.maxX) / 2, (span.minZ + span.maxZ) / 2);
    const w = at(span.maxX, span.minZ).x - at(span.minX, span.minZ).x;
    const h = at(span.minX, span.maxZ).y - at(span.minX, span.minZ).y;
    ctx.fillRect(p.x - w / 2, p.y - h / 2, w, h);
  }
  ctx.strokeStyle = "#8d7044";
  ctx.lineWidth = Math.max(dpr * 1.4, rim * 0.45);
  ctx.lineCap = "butt";
  for (const road of EAST_PATHS) {
    const p = at(road.x, road.z);
    const w = Math.abs(at(road.x + road.w / 2, road.z).x - at(road.x - road.w / 2, road.z).x);
    const h = Math.abs(at(road.x, road.z + road.d / 2).y - at(road.x, road.z - road.d / 2).y);
    ctx.strokeRect(p.x - w / 2, p.y - h / 2, w, h);
  }
  ctx.fillStyle = "#d7c7a2";
  for (const place of EAST_PLACES) {
    const p = at(place.x, place.z);
    const s = Math.max(2, dpr * 1.5);
    ctx.fillRect(p.x - s, p.y - s, s * 2, s * 2);
  }
}

function project(x: number, z: number, c: number, radius: number, ox: number, oz: number, view: number) {
  return {
    x: c + ((x - ox) / view) * radius,
    y: c + ((z - oz) / view) * radius,
  };
}

const YARD = "#ddd0b4";
const STREET = "#c4b496";
const HOUSE = "#2a4e86";
const WATER = "#2f6d86";
const PIER = "#8d6844";
const CHOCO = "#d7c27a";

const SHORT_GATE: Record<string, string> = {
  "West Ronfaure": "W. Ronfaure",
  "East Ronfaure": "E. Ronfaure",
  "Chocobo Circuit": "Chocobos",
  "Northern San d'Oria": "North",
  "Southern San d'Oria": "South",
  "Port San d'Oria": "Port",
  "Chateau d'Oraguille": "Chateau",
  "Carpenters' Landing": "Landing",
  "Ghelsba Outpost": "Outpost",
  "Fort Ghelsba": "Fort",
  "Yughott Grotto": "Yughott",
  "Horlais Peak": "Horlais",
  "Ranguemont Pass": "Ranguemont",
  "King Ranperre's Tomb": "Tomb",
  "Jugner Forest": "Jugner",
  "Lower crypts": "Down",
  "Upper tomb": "Up",
  "Deep crypt": "Deep",
  "Vrtra's Hollow": "Vrtra",
  "Strange Apparatus": "Apparatus",
  "Beaucedine Glacier": "Beaucedine",
  "Batallia Downs": "Batallia",
  "Xarcabard": "Xarcabard",
  "Fei'Yin": "Fei'Yin",
  "Pso'Xja": "Pso'Xja",
  "Dynamis - Beaucedine": "Dynamis",
  "Sea of Shu'Meyo": "Shu'Meyo",
  "Outpost": "Outpost",
  "Goblin Footprint": "Footprint",
  "Waters of Oblivion": "Oblivion",
  "??? / Metallic Slime": "???",
  "Exit only": "Exit",
  "Enter only": "Enter",
  "Survival Guide": "Guide",
  "Mucoid Mass": "Mucoid",
  "Gloom Eye": "Gloom Eye",
  "Cavernous Maw": "Maw",
  "La Theine Plateau": "La Theine",
};

const ZONE_EXIT = new Set([
  "West Ronfaure",
  "East Ronfaure",
  "Northern San d'Oria",
  "Southern San d'Oria",
  "Port San d'Oria",
  "Chateau d'Oraguille",
  "Carpenters' Landing",
  "Chocobo Circuit",
  "Ghelsba Outpost",
  "Fort Ghelsba",
  "Yughott Grotto",
  "Horlais Peak",
  "Ranguemont Pass",
  "King Ranperre's Tomb",
  "Jugner Forest",
  "La Theine Plateau",
  "Beaucedine Glacier",
  "Batallia Downs",
  "Xarcabard",
  "Fei'Yin",
  "Pso'Xja",
  "Dynamis - Beaucedine",
  "Lower crypts",
  "Upper tomb",
  "Deep crypt",
  "Up",
]);

type MarkRole = "nm" | "ph";
type MarkKind = "gate" | "home" | "guide" | "nm" | "fount" | "chest" | "mining" | "foot" | "minor";
type WorldMark = { x: number; z: number; name: string; role?: MarkRole };
type Box = { x: number; y: number; w: number; h: number };
type Frame = { minX: number; minY: number; maxX: number; maxY: number };
type PlacedLabel = { text: string; x: number; y: number; w: number; h: number };
type MapAudit = { labels: PlacedLabel[]; frame: Frame; sheet: string };

const LABEL_FONT = `"Source Sans 3", sans-serif`;

function boxesHit(a: Box, b: Box): boolean {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function boxInside(a: Box, frame: Frame): boolean {
  return a.x >= frame.minX && a.y >= frame.minY && a.x + a.w <= frame.maxX && a.y + a.h <= frame.maxY;
}

/** Square under the player. Null when the zone has no retail grid. */
export function zoneSquare(region: string, x: number, z: number): { square: string; map?: 1 | 2 } | null {
  const known = (square: string, map?: 1 | 2) => (square && square !== "?" ? { square, map } : null);
  if (region === "Ranguemont Pass") return known(passSquare(x, z));
  if (region === "Beaucedine Glacier") return known(glacierSquare(x, z));
  if (region === "King Ranperre's Tomb") return known(tombSquare(x, z));
  if (region === "East Ronfaure") {
    const grid = ZONE_GRIDS.find((g) => g.zone === "east-ronfaure");
    if (!grid) return null;
    const col = (x - grid.x0) / grid.cell;
    const row = (z - grid.z0) / grid.cell;
    if (col < 0 || row < 0 || col >= grid.cols || row >= grid.rows) return null;
    return known(eastSquare(col, row));
  }
  if (region === "West Ronfaure") {
    const grid = ZONE_GRIDS.find((g) => g.zone === "ronfaure-south");
    return grid ? known(squareOf(grid, x, z)) : null;
  }
  if (region === "Ghelsba Outpost") {
    const { gx, gy } = ghelsbaToGrid(x, z);
    return known(ghelsbaGridSquare(gx, gy));
  }
  if (region === "Fort Ghelsba") {
    const { gx, gy } = fortToGrid(x, z);
    return known(fortGridSquare(gx, gy));
  }
  if (region === "Yughott Grotto") {
    const map = yughottMapAt(x, z);
    const { gx, gy } = yughottToGrid(x, z, map);
    return known(yughottGridSquare(gx, gy), map);
  }
  return null;
}

function squareReadout(region: string, x: number, z: number): string {
  const hit = zoneSquare(region, x, z);
  if (!hit) return "";
  return hit.map ? `Map ${hit.map} · ${hit.square}` : hit.square;
}

function markKind(name: string, role?: MarkRole): MarkKind {
  if (role === "nm") return "nm";
  if (role === "ph") return "minor";
  if (/home point/i.test(name)) return "home";
  if (/survival guide/i.test(name)) return "guide";
  if (/geomagnetic fount/i.test(name)) return "fount";
  if (/chest/i.test(name)) return "chest";
  if (/mining point/i.test(name)) return "mining";
  if (/footprint/i.test(name)) return "foot";
  if (name === "Exit only" || name === "Enter only" || name === "Hut Door") return "gate";
  if (ZONE_EXIT.has(name)) return "gate";
  return "minor";
}

function gateText(name: string): string {
  const short = SHORT_GATE[name] ?? name;
  if (name === "Exit only" || name === "Enter only" || name === "Hut Door") return short;
  return `To ${short}`;
}

function drawMarkIcon(ctx: CanvasRenderingContext2D, kind: MarkKind, x: number, y: number, dpr: number) {
  if (kind === "chest") {
    const s = Math.max(2.2, dpr * 1.6);
    ctx.fillStyle = "#e3c57a";
    ctx.fillRect(x - s, y - s, s * 2, s * 2);
    return;
  }
  if (kind === "mining") {
    const s = Math.max(2.2, dpr * 1.7);
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.PI / 4);
    ctx.fillStyle = "#9aa3ad";
    ctx.fillRect(-s, -s, s * 2, s * 2);
    ctx.restore();
    return;
  }
  if (kind === "foot" || kind === "minor") {
    ctx.fillStyle = "#c4b496";
    ctx.beginPath();
    ctx.arc(x, y, Math.max(1.5, dpr * 1.15), 0, Math.PI * 2);
    ctx.fill();
    return;
  }
  const s = Math.max(2.6, dpr * 1.8);
  ctx.fillStyle = "#e3c57a";
  ctx.fillRect(x - s, y - s, s * 2, s * 2);
}

function iconBox(kind: MarkKind, x: number, y: number, dpr: number): Box {
  const s = kind === "foot" || kind === "minor"
    ? Math.max(2.4, dpr * 1.6)
    : kind === "mining"
      ? Math.max(3.4, dpr * 2.5)
      : Math.max(3.6, dpr * 2.3);
  return { x: x - s, y: y - s, w: s * 2, h: s * 2 };
}

function labelMetrics(ctx: CanvasRenderingContext2D, text: string, sub: string | null, dpr: number) {
  const main = Math.max(10, Math.round(11 * dpr));
  const ph = Math.max(8, Math.round(8.5 * dpr));
  ctx.font = `${main}px ${LABEL_FONT}`;
  const mainW = ctx.measureText(text).width;
  let subW = 0;
  if (sub) {
    ctx.font = `${ph}px ${LABEL_FONT}`;
    subW = ctx.measureText(sub).width;
  }
  const gap = sub ? Math.max(1, dpr) : 0;
  return { w: Math.ceil(Math.max(mainW, subW)), h: main + (sub ? ph + gap : 0), main, ph, gap };
}

function paintLabel(ctx: CanvasRenderingContext2D, text: string, sub: string | null, box: Box, dpr: number, size: { main: number; ph: number; gap: number }) {
  ctx.lineWidth = Math.max(2, dpr * 1.5);
  ctx.lineJoin = "round";
  ctx.strokeStyle = "#0c1b38";
  ctx.fillStyle = "#e3c57a";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.font = `${size.main}px ${LABEL_FONT}`;
  ctx.strokeText(text, box.x, box.y);
  ctx.fillText(text, box.x, box.y);
  if (!sub) return;
  ctx.font = `${size.ph}px ${LABEL_FONT}`;
  const y = box.y + size.main + size.gap;
  ctx.strokeText(sub, box.x, y);
  ctx.fillText(sub, box.x, y);
}

type LegendItem = { kind: MarkKind; text: string };

function legendItems(kinds: Set<MarkKind>): LegendItem[] {
  const items: LegendItem[] = [];
  if (kinds.has("chest")) items.push({ kind: "chest", text: "Chest" });
  if (kinds.has("mining")) items.push({ kind: "mining", text: "Mining" });
  if (kinds.has("foot")) items.push({ kind: "foot", text: "Footprint" });
  else if (kinds.has("minor")) items.push({ kind: "minor", text: "Point" });
  return items;
}

function legendRect(ctx: CanvasRenderingContext2D, items: LegendItem[], frame: Frame, dpr: number): Box | null {
  if (!items.length) return null;
  const font = Math.max(8, Math.round(9 * dpr));
  ctx.font = `${font}px ${LABEL_FONT}`;
  let textW = 0;
  for (const item of items) textW = Math.max(textW, ctx.measureText(item.text).width);
  const icon = Math.max(8, 9 * dpr);
  const row = Math.max(11, 12 * dpr);
  const pad = Math.max(3, dpr * 2);
  const box: Box = {
    x: frame.minX + pad,
    y: 0,
    w: Math.ceil(pad * 2 + icon + pad + textW),
    h: Math.ceil(pad * 2 + items.length * row),
  };
  box.y = frame.maxY - box.h - pad;
  if (box.y < frame.minY + pad || box.x + box.w > frame.maxX - pad) return null;
  return box;
}

function paintLegend(ctx: CanvasRenderingContext2D, items: LegendItem[], box: Box, dpr: number) {
  const font = Math.max(8, Math.round(9 * dpr));
  const icon = Math.max(8, 9 * dpr);
  const row = Math.max(11, 12 * dpr);
  const pad = Math.max(3, dpr * 2);
  ctx.fillStyle = "rgba(12, 27, 56, 0.88)";
  ctx.fillRect(box.x, box.y, box.w, box.h);
  ctx.strokeStyle = "rgba(227, 197, 122, 0.45)";
  ctx.lineWidth = Math.max(1, dpr);
  ctx.strokeRect(box.x + 0.5, box.y + 0.5, box.w - 1, box.h - 1);
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.font = `${font}px ${LABEL_FONT}`;
  items.forEach((item, i) => {
    const y = box.y + pad + row * i + row / 2;
    const x = box.x + pad + icon / 2;
    drawMarkIcon(ctx, item.kind, x, y, dpr);
    ctx.fillStyle = "#e3c57a";
    ctx.fillText(item.text, x + icon / 2 + pad * 0.8, y);
  });
}

/**
 * Icons for every mark. Text only for gates, home points, survival guides, founts, and NMs.
 * Same-name gates within two squares share one label. Greedy: above, below, right, left.
 */
function layoutMarks(
  ctx: CanvasRenderingContext2D,
  at: (x: number, z: number) => Pt,
  worldMarks: readonly WorldMark[],
  frame: Frame,
  dpr: number,
  cell: number,
): PlacedLabel[] {
  const drawn = worldMarks.map((mark) => {
    const p = at(mark.x, mark.z);
    return { ...mark, kind: markKind(mark.name, mark.role), px: p.x, py: p.y, sub: null as string | null };
  });
  const hidden = new Set<number>();
  for (let i = 0; i < drawn.length; i++) {
    if (drawn[i].kind !== "nm") continue;
    let best = -1;
    let bestD = Infinity;
    for (let j = 0; j < drawn.length; j++) {
      if (drawn[j].role !== "ph" || hidden.has(j)) continue;
      const d = Math.hypot(drawn[i].x - drawn[j].x, drawn[i].z - drawn[j].z);
      const px = Math.hypot(drawn[i].px - drawn[j].px, drawn[i].py - drawn[j].py);
      if ((d < 18 || px < 42 * dpr) && d < bestD) {
        bestD = d;
        best = j;
      }
    }
    if (best >= 0) {
      hidden.add(best);
      drawn[i].sub = drawn[best].name;
    }
  }
  const icons = drawn.filter((_, index) => !hidden.has(index));
  for (const mark of icons) drawMarkIcon(ctx, mark.kind, mark.px, mark.py, dpr);

  type Anchor = (typeof drawn)[number];
  const labels: Anchor[] = [];
  const gates = icons.filter((mark) => mark.kind === "gate");
  const used = new Set<number>();
  for (let i = 0; i < gates.length; i++) {
    if (used.has(i)) continue;
    const group = [i];
    used.add(i);
    const queue = [i];
    while (queue.length) {
      const cur = queue.pop();
      if (cur == null) break;
      for (let j = 0; j < gates.length; j++) {
        if (used.has(j) || gates[j].name !== gates[cur].name) continue;
        const apart = Math.max(Math.abs(gates[j].x - gates[cur].x), Math.abs(gates[j].z - gates[cur].z));
        if (apart <= cell * 2 + 0.01) {
          used.add(j);
          group.push(j);
          queue.push(j);
        }
      }
    }
    const cx = group.reduce((sum, index) => sum + gates[index].x, 0) / group.length;
    const cz = group.reduce((sum, index) => sum + gates[index].z, 0) / group.length;
    let anchor = gates[group[0]];
    let bestD = Infinity;
    for (const index of group) {
      const d = Math.hypot(gates[index].x - cx, gates[index].z - cz);
      if (d < bestD) {
        bestD = d;
        anchor = gates[index];
      }
    }
    labels.push(anchor);
  }
  for (const mark of icons) {
    if (mark.kind === "home" || mark.kind === "guide" || mark.kind === "nm" || mark.kind === "fount") labels.push(mark);
  }
  const rank: Record<MarkKind, number> = { gate: 0, home: 1, guide: 1, nm: 2, fount: 3, chest: 9, mining: 9, foot: 9, minor: 9 };
  labels.sort((a, b) => rank[a.kind] - rank[b.kind] || a.name.localeCompare(b.name));

  const kinds = new Set(icons.map((mark) => mark.kind));
  const items = legendItems(kinds);
  const legend = legendRect(ctx, items, frame, dpr);
  const obstacles: Box[] = icons.map((mark) => iconBox(mark.kind, mark.px, mark.py, dpr));
  if (legend) obstacles.push(legend);
  const edge = Math.max(1, Math.ceil(dpr));
  const inner: Frame = {
    minX: frame.minX + edge,
    minY: frame.minY + edge,
    maxX: frame.maxX - edge,
    maxY: frame.maxY - edge,
  };
  const placed: PlacedLabel[] = [];
  const gap = Math.max(3, dpr * 2);
  for (const mark of labels) {
    const text = mark.kind === "gate"
      ? gateText(mark.name)
      : mark.kind === "home"
        ? "Home Point"
        : mark.kind === "guide"
          ? "Survival Guide"
          : mark.kind === "fount"
            ? "Geomagnetic Fount"
            : mark.name;
    const sub = mark.kind === "nm" ? mark.sub : null;
    const size = labelMetrics(ctx, text, sub, dpr);
    const own = iconBox(mark.kind, mark.px, mark.py, dpr);
    const spots: Box[] = [
      { x: mark.px - size.w / 2, y: own.y - gap - size.h, w: size.w, h: size.h },
      { x: mark.px - size.w / 2, y: own.y + own.h + gap, w: size.w, h: size.h },
      { x: own.x + own.w + gap, y: mark.py - size.h / 2, w: size.w, h: size.h },
      { x: own.x - gap - size.w, y: mark.py - size.h / 2, w: size.w, h: size.h },
    ];
    let fit: Box | null = null;
    for (const spot of spots) {
      if (!boxInside(spot, inner)) continue;
      if (obstacles.some((ob) => boxesHit(spot, ob))) continue;
      if (placed.some((ob) => boxesHit(spot, ob))) continue;
      fit = spot;
      break;
    }
    if (!fit) continue;
    paintLabel(ctx, text, sub, fit, dpr, size);
    placed.push({ text, x: fit.x, y: fit.y, w: fit.w, h: fit.h });
  }
  if (legend) paintLegend(ctx, items, legend, dpr);
  return placed;
}

function paintGridEdge(
  ctx: CanvasRenderingContext2D,
  at: (x: number, z: number) => Pt,
  grid: { x0: number; z0: number; cell: number; cols: number; rows: number },
  frame: Frame,
  dpr: number,
) {
  ctx.fillStyle = "#e3c57a";
  ctx.font = `${Math.max(9, Math.round(10 * dpr))}px ${LABEL_FONT}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  for (let i = 0; i < grid.cols; i++) {
    const p = at(grid.x0 + (i + 0.5) * grid.cell, grid.z0);
    if (p.x < frame.minX + 4 || p.x > frame.maxX - 4) continue;
    ctx.fillText(String.fromCharCode(65 + i), p.x, frame.minY - Math.max(1, dpr));
  }
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  for (let i = 0; i < grid.rows; i++) {
    const p = at(grid.x0, grid.z0 + (i + 0.5) * grid.cell);
    if (p.y < frame.minY + 4 || p.y > frame.maxY - 4) continue;
    ctx.fillText(String(i + 1), frame.minX - Math.max(2, dpr * 2), p.y);
  }
}

function publishAudit(labels: PlacedLabel[], frame: Frame, sheet: string) {
  (globalThis as unknown as { __mapAudit?: MapAudit }).__mapAudit = { labels, frame, sheet };
}

const WARD: CityRect = { minX: -WARD_SIDE, maxX: WARD_SIDE, minZ: WARD_NORTH, maxZ: PEN_EDGE };
const BRIDGE: CityRect = { minX: -BRIDGE_HALF, maxX: BRIDGE_HALF, minZ: BRIDGE_Z0, maxZ: BRIDGE_Z1 };
const HARBOR: CityRect = { minX: -28, maxX: 26, minZ: -472, maxZ: -444 };

function paintTown(
  ctx: CanvasRenderingContext2D,
  at: (x: number, z: number) => Pt,
  unit: number,
  region: string,
) {
  const fill = (box: CityRect, color: string) => {
    const p = at((box.minX + box.maxX) / 2, (box.minZ + box.maxZ) / 2);
    ctx.fillStyle = color;
    ctx.fillRect(p.x - ((box.maxX - box.minX) / 2) * unit, p.y - ((box.maxZ - box.minZ) / 2) * unit, (box.maxX - box.minX) * unit, (box.maxZ - box.minZ) * unit);
  };
  const stroke = (box: CityRect) => {
    const a = at(box.minX, box.minZ);
    const b = at(box.maxX, box.maxZ);
    ctx.strokeStyle = "#6e5a3e";
    ctx.lineWidth = Math.max(1.4, unit * 0.55);
    ctx.strokeRect(a.x, a.y, b.x - a.x, b.y - a.y);
  };
  const opening = (x: number, z: number, w: number, d: number, color: string) => {
    fill({ minX: x - w / 2, maxX: x + w / 2, minZ: z - d / 2, maxZ: z + d / 2 }, color);
  };
  const blocks = (rows: readonly CityBlock[]) => {
    ctx.fillStyle = HOUSE;
    for (const house of rows) {
      const p = at(house.x, house.z);
      ctx.fillRect(p.x - (house.w / 2) * unit, p.y - (house.d / 2) * unit, house.w * unit, house.d * unit);
    }
  };
  if (region === "Northern San d'Oria") {
    fill(NORTH_YARD, YARD);
    for (const road of [NORTH_AVENUE, NORTH_WATCH, NORTH_HARBOR, NORTH_LINK, NORTH_LANE]) fill(road, STREET);
    fill(CHATEAU_FOOT, "#1e355f");
    fill({ minX: 5.4, maxX: 10.6, minZ: -353.2, maxZ: -344.8 }, "#162848");
    fill({ minX: -0.4, maxX: 4.6, minZ: -342.2, maxZ: -334.4 }, "#243656");
    fill({ minX: 11.4, maxX: 16.4, minZ: -342.2, maxZ: -334.4 }, "#243656");
    fill({ minX: -1.5, maxX: 1.8, minZ: -338.1, maxZ: -334.7 }, "#162848");
    fill({ minX: 14.2, maxX: 17.5, minZ: -338.1, maxZ: -334.7 }, "#162848");
    fill({ minX: 1.3, maxX: 5.6, minZ: -336.7, maxZ: -332.3 }, "#162848");
    fill({ minX: 10.4, maxX: 14.7, minZ: -336.7, maxZ: -332.3 }, "#162848");
    fill({ minX: 6.2, maxX: 9.8, minZ: -333.6, maxZ: -332.4 }, "#8d6844");
    fill({ minX: 4.6, maxX: 11.4, minZ: -332.2, maxZ: -329.8 }, "#e7dcc4");
    blocks(NORTH_HOUSES);
    const basin = at(18, -290);
    ctx.fillStyle = WATER;
    ctx.beginPath();
    ctx.arc(basin.x, basin.y, Math.max(2, 1.1 * unit), 0, Math.PI * 2);
    ctx.fill();
    stroke(NORTH_YARD);
    opening(6, NORTH_YARD.maxZ, 8, 2.2, STREET);
    opening(-39.2, -304, 2.2, 7, STREET);
    opening(-16, NORTH_YARD.minZ, 8, 2.2, STREET);
    opening(-39.4, -328, 2.2, 4, YARD);
  } else if (region === "Port San d'Oria") {
    fill(HARBOR, WATER);
    fill(PORT_YARD, YARD);
    fill(PORT_QUAY, STREET);
    fill(PORT_PIER, PIER);
    const fisher = at(FISHER.x, FISHER.z);
    const joulet = at(JOULET.x, JOULET.z);
    ctx.fillStyle = "#e3c57a";
    ctx.fillRect(fisher.x - Math.max(2, unit * 0.35), fisher.y - Math.max(2, unit * 0.35), Math.max(4, unit * 0.7), Math.max(4, unit * 0.7));
    ctx.fillRect(joulet.x - Math.max(2, unit * 0.35), joulet.y - Math.max(2, unit * 0.35), Math.max(4, unit * 0.7), Math.max(4, unit * 0.7));
    blocks(PORT_HOUSES);
    stroke(PORT_YARD);
    opening(-8, PORT_YARD.maxZ, 8, 2.2, STREET);
    opening(2, PORT_YARD.minZ, 8, 2.2, PIER);
  } else {
    fill(WARD, YARD);
    fill(NORTH_ROAD, STREET);
    fill(EAST_ROAD, STREET);
    fill(CHOCO_ROAD, CHOCO);
    fill(BRIDGE, "#b7a58c");
    const keep = at(0, -12.15);
    ctx.fillStyle = HOUSE;
    ctx.fillRect(keep.x - 5.6 * unit, keep.y - 2.75 * unit, 11.2 * unit, 5.5 * unit);
    blocks(SOUTH_HOUSES);
    const fountain = at(0, -6.3);
    ctx.fillStyle = "#8ec8ef";
    ctx.beginPath();
    ctx.arc(fountain.x, fountain.y, Math.max(2, 1.15 * unit), 0, Math.PI * 2);
    ctx.fill();
    stroke(WARD);
    stroke(NORTH_ROAD);
    stroke(EAST_ROAD);
    stroke(CHOCO_ROAD);
    opening(12, WARD_NORTH, 14, 2.4, STREET);
    opening(WARD_SIDE, 3, 2.4, 11, STREET);
    opening(0, PEN_EDGE, GATE_HALF * 2 + 0.8, 2.2, "#b7a58c");
    opening(20.6, 7.2, 8, 2.4, CHOCO);
    opening(12, NORTH_ROAD.minZ, 8, 2.2, STREET);
    opening(EAST_ROAD.maxX, 2.8, 2.2, 6, STREET);
    opening(20.6, CHOCO_ROAD.maxZ, 6, 2.2, CHOCO);
    ctx.fillStyle = "#1f6a38";
    for (const [x, z] of [[-9, 20], [9, 20], [-16, 25], [15, 25]] as const) {
      const p = at(x, z);
      const s = Math.max(1.5, 1.2 * unit);
      ctx.fillRect(p.x - s, p.y - s, s * 2, s * 2);
    }
  }
}

function fillRect(ctx: CanvasRenderingContext2D, at: (x: number, z: number) => Pt, box: { minX: number; maxX: number; minZ: number; maxZ: number }, color: string) {
  const p = at((box.minX + box.maxX) / 2, (box.minZ + box.maxZ) / 2);
  const unitX = at(box.maxX, box.minZ).x - at(box.minX, box.minZ).x;
  const unitY = at(box.minX, box.maxZ).y - at(box.minX, box.minZ).y;
  ctx.fillStyle = color;
  ctx.fillRect(p.x - unitX / 2, p.y - unitY / 2, unitX, unitY);
}

function paintOrc(ctx: CanvasRenderingContext2D, at: (x: number, z: number) => Pt, chart: OrcChart, region: string, dpr: number) {
  const floor = region === "King Ranperre's Tomb" ? "#5c5348" : region === "Ranguemont Pass" ? "#4d5966" : region === "Beaucedine Glacier" ? "#d5e2ee" : region === "Yughott Grotto" ? "#4a4038" : region === "Horlais Peak" ? "#6d6254" : region === "Fort Ghelsba" ? "#6a5840" : "#6c7346";
  const water = region === "Beaucedine Glacier" ? "#7eb4d4" : region === "Horlais Peak" ? "#6e9a96" : "#245868";
  const unit = Math.hypot(at(1, 0).x - at(0, 0).x, at(1, 0).y - at(0, 0).y);
  if (chart.paths?.length) {
    if (chart.discs) {
      ctx.fillStyle = floor;
      for (const disc of chart.discs) {
        const p = at(disc.x, disc.z);
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(1, disc.r * unit), 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.strokeStyle = floor;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    for (const path of chart.paths) {
      if (path.pts.length < 2) continue;
      ctx.beginPath();
      ctx.lineWidth = Math.max(1, path.width * PASS_CELL * unit);
      const start = at(path.pts[0].x, path.pts[0].z);
      ctx.moveTo(start.x, start.y);
      for (let i = 1; i < path.pts.length; i++) {
        const p = at(path.pts[i].x, path.pts[i].z);
        ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();
    }
  } else {
    for (const rect of chart.rects) fillRect(ctx, at, rect, floor);
  }
  for (const rect of chart.water) fillRect(ctx, at, rect, water);
  if (chart.grid) {
    ctx.strokeStyle = "rgba(227, 197, 122, 0.22)";
    ctx.lineWidth = Math.max(1, dpr);
    ctx.beginPath();
    const gridEnd = region === "Ranguemont Pass" ? 15 : 12;
    for (let i = 0; i <= gridEnd; i++) {
      const x = chart.grid.x0 + i * chart.grid.cell;
      const z = chart.grid.z0 + i * chart.grid.cell;
      if (x >= chart.bounds.minX && x <= chart.bounds.maxX) {
        const top = at(x, chart.bounds.minZ);
        const bot = at(x, chart.bounds.maxZ);
        ctx.moveTo(top.x, top.y);
        ctx.lineTo(bot.x, bot.y);
      }
      if (z >= chart.bounds.minZ && z <= chart.bounds.maxZ) {
        const left = at(chart.bounds.minX, z);
        const right = at(chart.bounds.maxX, z);
        ctx.moveTo(left.x, left.y);
        ctx.lineTo(right.x, right.y);
      }
    }
    ctx.stroke();
  }
}

function paint(canvas: HTMLCanvasElement, snap: RadarFrame) {
  const css = canvas.clientWidth;
  if (css < 8) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const size = Math.max(32, Math.round(css * dpr));
  if (canvas.width !== size) {
    canvas.width = size;
    canvas.height = size;
  }
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const c = size / 2;
  const ring = Math.max(2, dpr * 2.4);
  const radius = c - ring * 0.5;
  ctx.clearRect(0, 0, size, size);
  ctx.save();
  ctx.beginPath();
  ctx.arc(c, c, radius, 0, Math.PI * 2);
  ctx.clip();
  ctx.fillStyle = "#1a5678";
  ctx.fillRect(0, 0, size, size);
  const chart = snap.region === "King Ranperre's Tomb" ? tombChart(snap.x, snap.z) : snap.region === "Ranguemont Pass" ? passChart(snap.x, snap.z) : snap.region === "Beaucedine Glacier" ? glacierChart(snap.x, snap.z) : orcLayout(snap.region, { x: snap.x, z: snap.z });
  const forest = snap.region === "West Ronfaure";
  const east = snap.region === "East Ronfaure";
  const pass = snap.region === "Ranguemont Pass" && chart;
  const span = pass ? Math.max(chart.bounds.maxX - chart.bounds.minX, chart.bounds.maxZ - chart.bounds.minZ) : 0;
  const view = forest || east ? 340 : pass ? span * 0.56 : chart ? 78 : VIEW;
  const ox = forest ? RON_X0 + RON_SIZE / 2 : east ? EAST_X0 + EAST_SIZE / 2 : pass ? (chart.bounds.minX + chart.bounds.maxX) / 2 : snap.x;
  const oz = forest ? RON_Z0 + RON_SIZE / 2 : east ? EAST_Z0 + EAST_SIZE / 2 : pass ? (chart.bounds.minZ + chart.bounds.maxZ) / 2 : snap.z;
  const at = (x: number, z: number) => project(x, z, c, radius, ox, oz, view);
  if (forest) {
    paintRonGround(ctx, at, dpr, Math.max(2.4, (10 / view) * radius));
    ctx.fillStyle = "#e3c57a";
    const exits = [
      { x: SAN_SOUTH.x, z: SAN_SOUTH.z },
      { x: SAN_NORTH.x, z: SAN_NORTH.z },
      EXITS.eastA,
      EXITS.eastB,
      EXITS.ghelsba,
      EXITS.theine,
    ];
    for (const mark of exits) {
      const p = at(mark.x, mark.z);
      const s = Math.max(2.2, dpr * 1.6);
      ctx.fillRect(p.x - s, p.y - s, s * 2, s * 2);
    }
    const book = at(RON_MARKS.southGate.x - 16, RON_MARKS.southGate.z - 8);
    ctx.fillStyle = "#f4ecd4";
    ctx.fillRect(book.x - dpr, book.y - dpr, dpr * 2, dpr * 2);
  } else if (east) {
    paintEastGround(ctx, at, dpr, Math.max(2.4, (10 / view) * radius));
    ctx.fillStyle = "#f4ecd4";
    for (const spot of [
      { x: MANUAL_EAST_X, z: MANUAL_EAST_Z },
      { x: MANUAL_EAST_ROAD_X, z: MANUAL_EAST_ROAD_Z },
    ]) {
      const p = at(spot.x, spot.z);
      ctx.fillRect(p.x - dpr, p.y - dpr, dpr * 2, dpr * 2);
    }
  } else if (chart) {
    ctx.fillStyle = "#241c14";
    ctx.fillRect(0, 0, size, size);
    paintOrc(ctx, at, chart, snap.region, dpr);
  } else {
    paintTown(ctx, at, radius / view, snap.region);
  }
  for (const blip of snap.blips) {
    const p = project(blip.x, blip.z, c, radius, ox, oz, view);
    if (blip.kind === "crystal") {
      const s = dpr * 2.4;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y - s);
      ctx.lineTo(p.x + s * 0.72, p.y);
      ctx.lineTo(p.x, p.y + s);
      ctx.lineTo(p.x - s * 0.72, p.y);
      ctx.closePath();
      ctx.fillStyle = KIND_FILL.crystal;
      ctx.fill();
      continue;
    }
    const dot = blip.kind === "foe" ? dpr * 2.2 : dpr * 1.7;
    ctx.beginPath();
    ctx.arc(p.x, p.y, dot, 0, Math.PI * 2);
    ctx.fillStyle = KIND_FILL[blip.kind];
    ctx.fill();
  }
  const self = project(snap.x, snap.z, c, radius, ox, oz, view);
  ctx.save();
  ctx.translate(self.x, self.y);
  ctx.rotate(Math.atan2(-Math.cos(snap.yaw), -Math.sin(snap.yaw)));
  const tip = dpr * 4.4;
  ctx.beginPath();
  ctx.moveTo(tip, 0);
  ctx.lineTo(-tip * 0.72, tip * 0.58);
  ctx.lineTo(-tip * 0.34, 0);
  ctx.lineTo(-tip * 0.72, -tip * 0.58);
  ctx.closePath();
  ctx.fillStyle = "#e3c57a";
  ctx.fill();
  ctx.lineWidth = Math.max(1, dpr * 0.7);
  ctx.strokeStyle = "#0c1b38";
  ctx.stroke();
  ctx.restore();
  ctx.restore();
  ctx.beginPath();
  ctx.arc(c, c, radius, 0, Math.PI * 2);
  ctx.lineWidth = ring;
  ctx.strokeStyle = "#0c1b38";
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(c, c, radius - ring * 0.55, 0, Math.PI * 2);
  ctx.lineWidth = Math.max(1, dpr * 1.15);
  ctx.strokeStyle = "#e3c57a";
  ctx.stroke();
}

function drawYou(ctx: CanvasRenderingContext2D, self: Pt, yaw: number, dpr: number) {
  ctx.save();
  ctx.translate(self.x, self.y);
  ctx.rotate(Math.atan2(-Math.cos(yaw), -Math.sin(yaw)));
  const tip = Math.max(8, dpr * 7);
  ctx.beginPath();
  ctx.moveTo(tip, 0);
  ctx.lineTo(-tip * 0.72, tip * 0.58);
  ctx.lineTo(-tip * 0.34, 0);
  ctx.lineTo(-tip * 0.72, -tip * 0.58);
  ctx.closePath();
  ctx.fillStyle = "#e3c57a";
  ctx.fill();
  ctx.lineWidth = Math.max(1, dpr);
  ctx.strokeStyle = "#0c1b38";
  ctx.stroke();
  ctx.restore();
}

function gridSheet(region: string, chart: { grid?: { x0: number; z0: number; cell: number } | null } | null) {
  if (region === "West Ronfaure") return { x0: RON_X0, z0: RON_Z0, cell: RON_CELL, cols: 12, rows: 12 };
  if (region === "East Ronfaure") return { x0: EAST_X0, z0: EAST_Z0, cell: EAST_CELL, cols: 12, rows: 12 };
  if (!chart?.grid) return null;
  const cols = region === "Ranguemont Pass" || region === "Beaucedine Glacier" || region === "King Ranperre's Tomb" ? 15 : 12;
  return { x0: chart.grid.x0, z0: chart.grid.z0, cell: chart.grid.cell, cols, rows: cols };
}

function atlasWorldMarks(snap: RadarFrame, chart: { marks?: readonly WorldMark[] } | null): WorldMark[] {
  if (snap.region === "West Ronfaure") {
    return [
      { x: SAN_SOUTH.x, z: SAN_SOUTH.z, name: "Southern San d'Oria" },
      { x: SAN_NORTH.x, z: SAN_NORTH.z, name: "Northern San d'Oria" },
      { x: EXITS.eastA.x, z: EXITS.eastA.z, name: "East Ronfaure" },
      { x: EXITS.eastB.x, z: EXITS.eastB.z, name: "East Ronfaure" },
      { x: EXITS.ghelsba.x, z: EXITS.ghelsba.z, name: "Ghelsba Outpost" },
      { x: EXITS.theine.x, z: EXITS.theine.z, name: "La Theine Plateau" },
      { x: RON_MARKS.knightwell.x, z: RON_MARKS.knightwell.z, name: "Knightwell" },
      { x: RON_MARKS.outpost.x, z: RON_MARKS.outpost.z, name: "Outpost" },
      { x: RON_MARKS.monument.x, z: RON_MARKS.monument.z, name: "Monument" },
      { x: RON_MARKS.oubliette.x, z: RON_MARKS.oubliette.z, name: "Oubliette" },
      { x: MANUAL_X, z: MANUAL_Z, name: "Field Manual" },
      { x: MANUAL_OUTPOST_X, z: MANUAL_OUTPOST_Z, name: "Field Manual" },
    ];
  }
  if (snap.region === "East Ronfaure") {
    return [
      ...ZONE_GATES.filter((gate) => gate.id.startsWith("east-")).map((gate) => ({ x: gate.x, z: gate.z, name: gate.name })),
      ...EAST_PLACES.map((place) => ({ x: place.x, z: place.z, name: place.name })),
      { x: MANUAL_EAST_X, z: MANUAL_EAST_Z, name: "Field Manual" },
      { x: MANUAL_EAST_ROAD_X, z: MANUAL_EAST_ROAD_Z, name: "Field Manual" },
    ];
  }
  if (chart?.marks) return chart.marks.map((mark) => ({ x: mark.x, z: mark.z, name: mark.name, role: mark.role }));
  const ids = snap.region === "Northern San d'Oria"
    ? ["north-to-south", "north-west", "north-port", "north-chateau", "north-landing"]
    : snap.region === "Port San d'Oria"
      ? ["port-to-north"]
      : ["city-south", "city-east", "city-chocobo", "city-to-north"];
  return ZONE_GATES.filter((gate) => ids.includes(gate.id)).map((gate) => ({
    x: gate.id === "north-chateau" ? 9 : gate.x,
    z: gate.id === "north-chateau" ? -349 : gate.z,
    name: gate.name,
  }));
}

function paintAtlas(canvas: HTMLCanvasElement, snap: RadarFrame, yughottMap: 1 | 2 = 1) {
  const cssW = canvas.clientWidth;
  const cssH = canvas.clientHeight;
  if (cssW < 8 || cssH < 8) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = Math.max(32, Math.round(cssW * dpr));
  const h = Math.max(32, Math.round(cssH * dpr));
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w;
    canvas.height = h;
  }
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const forest = snap.region === "West Ronfaure";
  const east = snap.region === "East Ronfaure";
  const chart = snap.region === "King Ranperre's Tomb" ? tombChart(snap.x, snap.z) : snap.region === "Ranguemont Pass" ? passChart(snap.x, snap.z) : snap.region === "Beaucedine Glacier" ? glacierChart(snap.x, snap.z) : orcLayout(snap.region, { x: snap.x, z: snap.z }, snap.region === "Yughott Grotto" ? yughottMap : undefined);
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#0c1b38";
  ctx.fillRect(0, 0, w, h);
  const bounds = forest
    ? { minX: RON_X0, maxX: RON_X0 + RON_SIZE, minZ: RON_Z0, maxZ: RON_Z0 + RON_SIZE }
    : east
      ? { minX: EAST_X0, maxX: EAST_X0 + EAST_SIZE, minZ: EAST_Z0, maxZ: EAST_Z0 + EAST_SIZE }
      : chart
      ? chart.bounds
      : snap.region === "Northern San d'Oria"
        ? { minX: -48, maxX: 40, minZ: -370, maxZ: -240 }
        : snap.region === "Port San d'Oria"
          ? { minX: -30, maxX: 28, minZ: -478, maxZ: -370 }
          : { minX: -22, maxX: 70, minZ: -58, maxZ: 24 };
  const pad = Math.round(28 * dpr);
  const worldW = bounds.maxX - bounds.minX;
  const worldH = bounds.maxZ - bounds.minZ;
  const scale = Math.min((w - pad * 2) / worldW, (h - pad * 2) / worldH);
  const originX = (w - worldW * scale) / 2;
  const originY = (h - worldH * scale) / 2;
  const at = (x: number, z: number): Pt => ({
    x: originX + (x - bounds.minX) * scale,
    y: originY + (z - bounds.minZ) * scale,
  });
  const nw = at(bounds.minX, bounds.minZ);
  const se = at(bounds.maxX, bounds.maxZ);
  ctx.fillStyle = chart ? "#241c14" : forest || east ? "#4e463c" : "#1a5678";
  ctx.fillRect(nw.x, nw.y, se.x - nw.x, se.y - nw.y);

  if (forest) {
    paintRonGround(ctx, at, dpr, Math.max(dpr * 3.5, 8 * scale));
    ctx.strokeStyle = "rgba(227, 197, 122, 0.35)";
    ctx.lineWidth = Math.max(1, dpr);
    ctx.beginPath();
    for (let i = 0; i <= 12; i++) {
      const vx = at(RON_X0 + i * RON_CELL, RON_Z0);
      const vb = at(RON_X0 + i * RON_CELL, RON_Z0 + RON_SIZE);
      ctx.moveTo(vx.x, vx.y);
      ctx.lineTo(vb.x, vb.y);
      const hz0 = at(RON_X0, RON_Z0 + i * RON_CELL);
      const hz1 = at(RON_X0 + RON_SIZE, RON_Z0 + i * RON_CELL);
      ctx.moveTo(hz0.x, hz0.y);
      ctx.lineTo(hz1.x, hz1.y);
    }
    ctx.stroke();
  } else if (east) {
    paintEastGround(ctx, at, dpr, Math.max(dpr * 3.5, 8 * scale));
    ctx.strokeStyle = "rgba(227, 197, 122, 0.35)";
    ctx.lineWidth = Math.max(1, dpr);
    ctx.beginPath();
    for (let i = 0; i <= 12; i++) {
      const vx = at(EAST_X0 + i * EAST_CELL, EAST_Z0);
      const vb = at(EAST_X0 + i * EAST_CELL, EAST_Z0 + EAST_SIZE);
      ctx.moveTo(vx.x, vx.y);
      ctx.lineTo(vb.x, vb.y);
      const hz0 = at(EAST_X0, EAST_Z0 + i * EAST_CELL);
      const hz1 = at(EAST_X0 + EAST_SIZE, EAST_Z0 + i * EAST_CELL);
      ctx.moveTo(hz0.x, hz0.y);
      ctx.lineTo(hz1.x, hz1.y);
    }
    ctx.stroke();
  } else if (chart) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(nw.x, nw.y, se.x - nw.x, se.y - nw.y);
    ctx.clip();
    paintOrc(ctx, at, chart, snap.region, dpr);
    ctx.restore();
  } else {
    ctx.save();
    ctx.beginPath();
    ctx.rect(nw.x, nw.y, se.x - nw.x, se.y - nw.y);
    ctx.clip();
    paintTown(ctx, at, scale, snap.region);
    ctx.restore();
  }

  const frame: Frame = { minX: nw.x, minY: nw.y, maxX: se.x, maxY: se.y };
  const sheet = gridSheet(snap.region, chart);
  if (sheet) paintGridEdge(ctx, at, sheet, frame, dpr);
  const north = at((bounds.minX + bounds.maxX) / 2, bounds.minZ);
  ctx.fillStyle = "#e3c57a";
  ctx.font = `${Math.max(11, Math.round(12 * dpr))}px "Cormorant Garamond", Georgia, serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  ctx.fillText("N", north.x, frame.minY - (sheet ? Math.max(13, 14 * dpr) : dpr * 2));
  const placed = layoutMarks(ctx, at, atlasWorldMarks(snap, chart), frame, dpr, sheet?.cell ?? 48);
  const sheetName = snap.region === "Yughott Grotto" ? `yughott-${yughottMap}` : snap.region;
  publishAudit(placed, frame, sheetName);

  for (const blip of snap.blips) {
    if (blip.x < bounds.minX || blip.x > bounds.maxX || blip.z < bounds.minZ || blip.z > bounds.maxZ) continue;
    const p = at(blip.x, blip.z);
    if (blip.kind === "crystal") {
      const s = Math.max(4, dpr * 3);
      ctx.beginPath();
      ctx.moveTo(p.x, p.y - s);
      ctx.lineTo(p.x + s * 0.72, p.y);
      ctx.lineTo(p.x, p.y + s);
      ctx.lineTo(p.x - s * 0.72, p.y);
      ctx.closePath();
      ctx.fillStyle = KIND_FILL.crystal;
      ctx.fill();
      continue;
    }
    const dot = blip.kind === "foe" ? Math.max(3.5, dpr * 2.4) : Math.max(3, dpr * 2);
    ctx.beginPath();
    ctx.arc(p.x, p.y, dot, 0, Math.PI * 2);
    ctx.fillStyle = KIND_FILL[blip.kind];
    ctx.fill();
  }
  if (snap.x >= bounds.minX && snap.x <= bounds.maxX && snap.z >= bounds.minZ && snap.z <= bounds.maxZ) {
    drawYou(ctx, at(snap.x, snap.z), snap.yaw, dpr);
  }
}

export function YardMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const atlasRef = useRef<HTMLCanvasElement>(null);
  const coordRef = useRef<HTMLParagraphElement>(null);
  const squareRef = useRef<HTMLParagraphElement>(null);
  const nameRef = useRef<HTMLParagraphElement>(null);
  const atlasNameRef = useRef<HTMLParagraphElement>(null);
  const atlasCoordRef = useRef<HTMLParagraphElement>(null);
  const atlasSquareRef = useRef<HTMLParagraphElement>(null);
  const rootRef = useRef<HTMLButtonElement>(null);
  const yugSheetRef = useRef<1 | 2>(1);
  const yugPinned = useRef(false);
  const [open, setOpen] = useState(false);
  const [yugSheet, setYugSheet] = useState<1 | 2>(1);
  const [zone, setZone] = useState("San d'Oria");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let frame = 0;
    let shown = "";
    let region = "";
    const draw = () => {
      frame = window.requestAnimationFrame(draw);
      const snap = readRadar();
      paint(canvas, snap);
      if (atlasRef.current) paintAtlas(atlasRef.current, snap, yugSheetRef.current);
      const label = `(${snap.x.toFixed(1)}, ${snap.z.toFixed(1)})`;
      const nextRegion = snap.region || "San d'Oria";
      const square = squareReadout(nextRegion, snap.x, snap.z);
      const applySquare = (el: HTMLParagraphElement | null) => {
        if (!el) return;
        if (el.textContent !== square) el.textContent = square;
        const hide = square === "";
        if (el.hidden !== hide) el.hidden = hide;
      };
      applySquare(squareRef.current);
      applySquare(atlasSquareRef.current);
      if (nextRegion === "Yughott Grotto" && !yugPinned.current) {
        const map = yughottMapAt(snap.x, snap.z);
        if (yugSheetRef.current !== map) {
          yugSheetRef.current = map;
          setYugSheet(map);
        }
      }
      if (nextRegion !== "Yughott Grotto") yugPinned.current = false;
      if (label !== shown) {
        shown = label;
        if (coordRef.current) coordRef.current.textContent = label;
      }
      if (atlasCoordRef.current && atlasCoordRef.current.textContent !== label) atlasCoordRef.current.textContent = label;
      if (nextRegion !== region) {
        region = nextRegion;
        if (nameRef.current) nameRef.current.textContent = nextRegion;
        if (rootRef.current) rootRef.current.setAttribute("aria-label", `Open the ${nextRegion} map`);
        setZone(nextRegion);
      }
      if (atlasNameRef.current && atlasNameRef.current.textContent !== nextRegion) atlasNameRef.current.textContent = nextRegion;
    };
    frame = window.requestAnimationFrame(draw);
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        ref={rootRef}
        type="button"
        aria-expanded={open}
        aria-label="Open the San d'Oria map"
        onClick={() => {
          const snap = readRadar();
          if (snap.region === "Yughott Grotto") {
            const map = yughottMapAt(snap.x, snap.z);
            yugPinned.current = false;
            yugSheetRef.current = map;
            setYugSheet(map);
            setZone(snap.region);
          }
          setOpen(true);
        }}
        className="pointer-events-auto flex flex-col items-end text-right"
      >
        <canvas ref={canvasRef} aria-hidden className="pointer-events-none size-28 rounded-full sm:size-36" />
        <p ref={coordRef} className="mt-1 bg-navy/80 px-1.5 py-0.5 text-xs tabular-nums leading-none text-ink">
          (0.0, 0.0)
        </p>
        <p ref={squareRef} className="mt-0.5 bg-navy/80 px-1.5 py-0.5 text-xs tabular-nums leading-none text-gold" />
        <p ref={nameRef} className="mt-1 max-w-40 border border-gold bg-panel px-2 py-1 text-right font-display text-sm leading-tight text-gold">
          San d'Oria
        </p>
        <p data-build-sha className="mt-0.5 text-[10px] leading-none text-muted/70">
          {__BUILD_SHA__}
        </p>
      </button>
      {open && (
        <div className="pointer-events-auto fixed inset-0 z-50 flex justify-center bg-navy/80 p-3" role="dialog" aria-modal="true" aria-label="Zone map">
          <div className="ffxi-frame flex h-full w-full max-w-3xl flex-col p-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0" data-map-header>
                <p ref={atlasNameRef} className="font-display text-3xl leading-none text-gold">
                  San d'Oria
                </p>
                <p ref={atlasSquareRef} data-map-square className="mt-1 font-display text-5xl leading-none tabular-nums text-gold" />
                <p ref={atlasCoordRef} data-map-coords className="mt-1 text-xs tabular-nums text-muted">
                  (0.0, 0.0)
                </p>
                {zone === "Yughott Grotto" && (
                  <div className="mt-2 flex gap-1" role="tablist" aria-label="Grotto maps">
                    {([1, 2] as const).map((map) => (
                      <button
                        key={map}
                        type="button"
                        role="tab"
                        aria-selected={yugSheet === map}
                        onClick={() => {
                          yugPinned.current = true;
                          yugSheetRef.current = map;
                          setYugSheet(map);
                        }}
                        className={`h-8 border px-2 text-xs font-semibold ${yugSheet === map ? "border-gold bg-gold text-navy" : "border-gold bg-navy text-gold"}`}
                      >
                        Map {map}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="h-11 shrink-0 border border-gold bg-navy px-4 text-sm font-semibold text-gold"
              >
                Close
              </button>
            </div>
            <canvas ref={atlasRef} className="mt-3 min-h-0 w-full flex-1 border border-gold-dim" />
          </div>
        </div>
      )}
    </>
  );
}
