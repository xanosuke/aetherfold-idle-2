import { useEffect, useRef, useState } from "react";
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
import { EAST_CELL, EAST_COAST, EAST_PATHS, EAST_PLACES, EAST_SIZE, EAST_WATER, EAST_X0, EAST_Z0 } from "@/game/east-ronfaure";
import { tombChart } from "@/game/tomb";
import { passChart } from "@/game/pass";
import { glacierChart } from "@/game/glacier";

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
  "Cavernous Maw": "Maw",
};

const WARD: CityRect = { minX: -WARD_SIDE, maxX: WARD_SIDE, minZ: WARD_NORTH, maxZ: PEN_EDGE };
const BRIDGE: CityRect = { minX: -BRIDGE_HALF, maxX: BRIDGE_HALF, minZ: BRIDGE_Z0, maxZ: BRIDGE_Z1 };
const HARBOR: CityRect = { minX: -28, maxX: 26, minZ: -472, maxZ: -444 };

function paintTown(
  ctx: CanvasRenderingContext2D,
  at: (x: number, z: number) => Pt,
  unit: number,
  dpr: number,
  region: string,
  label: boolean,
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
  if (!label) return;
  const ids = region === "Northern San d'Oria"
    ? ["north-to-south", "north-west", "north-port", "north-chateau", "north-landing"]
    : region === "Port San d'Oria"
      ? ["port-to-north"]
      : ["city-south", "city-east", "city-chocobo", "city-to-north"];
  ctx.font = `${Math.max(10, Math.round(11 * dpr))}px "Source Sans 3", sans-serif`;
  ctx.lineWidth = Math.max(2, dpr * 1.6);
  ctx.strokeStyle = "#0c1b38";
  for (const gate of ZONE_GATES) {
    if (!ids.includes(gate.id)) continue;
    const name = SHORT_GATE[gate.name] ?? gate.name;
    const p = at(gate.id === "north-chateau" ? 9 : gate.x, gate.id === "north-chateau" ? -349 : gate.z);
    ctx.fillStyle = gate.to === "closed" ? "#d5deea" : "#e3c57a";
    if (gate.id === "north-chateau") {
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.strokeText(name, p.x, p.y);
      ctx.fillText(name, p.x, p.y);
      continue;
    }
    const box = gate.id.startsWith("north") ? NORTH_YARD : gate.id.startsWith("port") ? PORT_YARD : gate.id === "city-east" ? EAST_ROAD : gate.id === "city-chocobo" ? CHOCO_ROAD : gate.id === "city-to-north" ? NORTH_ROAD : BRIDGE;
    const west = gate.x - box.minX;
    const east = box.maxX - gate.x;
    const north = gate.z - box.minZ;
    const south = box.maxZ - gate.z;
    const edge = Math.min(west, east, north, south);
    const inset = Math.max(8, unit * 1.6);
    let x = p.x;
    let y = p.y;
    if (edge === west) {
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      x += inset;
    } else if (edge === east) {
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      x -= inset;
    } else if (edge === north) {
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      y += inset;
    } else {
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      y -= inset;
    }
    ctx.strokeText(name, x, y);
    ctx.fillText(name, x, y);
    ctx.fillStyle = gate.to === "closed" ? "#9aa7b8" : "#e3c57a";
    const s = Math.max(2.5, unit * 0.45);
    ctx.fillRect(p.x - s, p.y - s, s * 2, s * 2);
  }
}

function fillRect(ctx: CanvasRenderingContext2D, at: (x: number, z: number) => Pt, box: { minX: number; maxX: number; minZ: number; maxZ: number }, color: string) {
  const p = at((box.minX + box.maxX) / 2, (box.minZ + box.maxZ) / 2);
  const unitX = at(box.maxX, box.minZ).x - at(box.minX, box.minZ).x;
  const unitY = at(box.minX, box.maxZ).y - at(box.minX, box.minZ).y;
  ctx.fillStyle = color;
  ctx.fillRect(p.x - unitX / 2, p.y - unitY / 2, unitX, unitY);
}

function paintOrc(ctx: CanvasRenderingContext2D, at: (x: number, z: number) => Pt, chart: OrcChart, region: string, dpr: number, label: boolean) {
  const floor = region === "King Ranperre's Tomb" ? "#5c5348" : region === "Ranguemont Pass" ? "#4d5966" : region === "Beaucedine Glacier" ? "#d5e2ee" : region === "Yughott Grotto" ? "#4a4038" : region === "Horlais Peak" ? "#6d6254" : region === "Fort Ghelsba" ? "#6a5840" : "#6c7346";
  const water = region === "Beaucedine Glacier" ? "#7eb4d4" : region === "Horlais Peak" ? "#6e9a96" : "#245868";
  for (const rect of chart.rects) fillRect(ctx, at, rect, floor);
  for (const rect of chart.water) fillRect(ctx, at, rect, water);
  if (chart.grid) {
    ctx.strokeStyle = "rgba(227, 197, 122, 0.22)";
    ctx.lineWidth = Math.max(1, dpr);
    ctx.beginPath();
    for (let i = 0; i <= 12; i++) {
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
  if (!label) return;
  ctx.font = `${Math.max(10, Math.round(11 * dpr))}px "Source Sans 3", sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  ctx.lineWidth = Math.max(2, dpr * 1.5);
  ctx.strokeStyle = "#0c1b38";
  for (const mark of chart.marks) {
    const p = at(mark.x, mark.z);
    const s = Math.max(3, dpr * 2.2);
    ctx.fillStyle = "#e3c57a";
    ctx.fillRect(p.x - s, p.y - s, s * 2, s * 2);
    const name = SHORT_GATE[mark.name] ?? mark.name;
    ctx.strokeText(name, p.x, p.y - s - dpr * 2);
    ctx.fillText(name, p.x, p.y - s - dpr * 2);
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
  const chart = snap.region === "King Ranperre's Tomb" ? tombChart(snap.x, snap.z) : snap.region === "Ranguemont Pass" ? passChart(snap.x, snap.z) : snap.region === "Beaucedine Glacier" ? glacierChart(snap.x, snap.z) : orcLayout(snap.region);
  const forest = snap.region === "West Ronfaure";
  const east = snap.region === "East Ronfaure";
  const view = forest || east ? 340 : chart ? 78 : VIEW;
  const ox = forest ? RON_X0 + RON_SIZE / 2 : east ? EAST_X0 + EAST_SIZE / 2 : snap.x;
  const oz = forest ? RON_Z0 + RON_SIZE / 2 : east ? EAST_Z0 + EAST_SIZE / 2 : snap.z;
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
    paintOrc(ctx, at, chart, snap.region, dpr, false);
  } else {
    paintTown(ctx, at, radius / view, dpr, snap.region, false);
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

function paintAtlas(canvas: HTMLCanvasElement, snap: RadarFrame) {
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
  const chart = snap.region === "King Ranperre's Tomb" ? tombChart(snap.x, snap.z) : snap.region === "Ranguemont Pass" ? passChart(snap.x, snap.z) : snap.region === "Beaucedine Glacier" ? glacierChart(snap.x, snap.z) : orcLayout(snap.region);
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
  const pad = Math.round(22 * dpr);
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
    ctx.fillStyle = "#e3c57a";
    ctx.font = `${Math.max(10, Math.round(11 * dpr))}px "Source Sans 3", sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    for (let i = 0; i < 12; i++) {
      const p = at(RON_X0 + (i + 0.5) * RON_CELL, RON_Z0);
      ctx.fillText(String.fromCharCode(65 + i), p.x, p.y - dpr * 2);
    }
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    for (let i = 0; i < 12; i++) {
      const p = at(RON_X0, RON_Z0 + (i + 0.5) * RON_CELL);
      ctx.fillText(String(i + 1), p.x - dpr * 3, p.y);
    }
    const marks: { x: number; z: number; name: string; kind: "open" | "shut" | "place" }[] = [
      { x: SAN_SOUTH.x, z: SAN_SOUTH.z, name: "S. San d'Oria", kind: "open" },
      { x: SAN_NORTH.x, z: SAN_NORTH.z, name: "N. San d'Oria", kind: "open" },
      { x: EXITS.eastA.x, z: EXITS.eastA.z, name: "E. Ronfaure", kind: "open" },
      { x: EXITS.eastB.x, z: EXITS.eastB.z, name: "E. Ronfaure", kind: "open" },
      { x: EXITS.ghelsba.x, z: EXITS.ghelsba.z, name: "Ghelsba", kind: "open" },
      { x: EXITS.theine.x, z: EXITS.theine.z, name: "La Theine", kind: "shut" },
      { x: RON_MARKS.knightwell.x, z: RON_MARKS.knightwell.z, name: "Knightwell", kind: "place" },
      { x: RON_MARKS.outpost.x, z: RON_MARKS.outpost.z, name: "Outpost", kind: "place" },
      { x: RON_MARKS.monument.x, z: RON_MARKS.monument.z, name: "Monument", kind: "place" },
      { x: RON_MARKS.oubliette.x, z: RON_MARKS.oubliette.z, name: "Oubliette", kind: "place" },
    ];
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.font = `${Math.max(10, Math.round(11 * dpr))}px "Source Sans 3", sans-serif`;
    ctx.lineWidth = Math.max(2, dpr * 2);
    for (const mark of marks) {
      const p = at(mark.x, mark.z);
      const s = Math.max(3, dpr * 2.4);
      ctx.fillStyle = mark.kind === "open" ? "#e3c57a" : mark.kind === "shut" ? "#b7c4d6" : "#f4ecd4";
      if (mark.kind === "place") {
        ctx.beginPath();
        ctx.arc(p.x, p.y, s * 0.7, 0, Math.PI * 2);
        ctx.fill();
      } else ctx.fillRect(p.x - s, p.y - s, s * 2, s * 2);
      ctx.strokeStyle = "#0c1b38";
      ctx.fillStyle = mark.kind === "shut" ? "#b7c4d6" : "#e3c57a";
      ctx.strokeText(mark.name, p.x, p.y - s - dpr * 2);
      ctx.fillText(mark.name, p.x, p.y - s - dpr * 2);
    }
    ctx.fillStyle = "#f4ecd4";
    for (const book of [
      { x: MANUAL_X, z: MANUAL_Z },
      { x: MANUAL_OUTPOST_X, z: MANUAL_OUTPOST_Z },
    ]) {
      const p = at(book.x, book.z);
      const s = Math.max(2.5, dpr * 1.8);
      ctx.fillRect(p.x - s, p.y - s, s * 2, s * 2);
    }
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
    ctx.fillStyle = "#e3c57a";
    ctx.font = `${Math.max(10, Math.round(11 * dpr))}px "Source Sans 3", sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    for (let i = 0; i < 12; i++) {
      const p = at(EAST_X0 + (i + 0.5) * EAST_CELL, EAST_Z0);
      ctx.fillText(String.fromCharCode(65 + i), p.x, p.y - dpr * 2);
    }
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    for (let i = 0; i < 12; i++) {
      const p = at(EAST_X0, EAST_Z0 + (i + 0.5) * EAST_CELL);
      ctx.fillText(String(i + 1), p.x - dpr * 3, p.y);
    }
    const marks: { x: number; z: number; name: string; kind: "open" | "shut" | "place" }[] = [
      ...ZONE_GATES.filter((gate) => gate.id.startsWith("east-")).map((gate) => ({
        x: gate.x,
        z: gate.z,
        name: SHORT_GATE[gate.name] ?? gate.name,
        kind: (gate.to === "closed" ? "shut" : "open") as "open" | "shut",
      })),
      ...EAST_PLACES.map((place) => ({ x: place.x, z: place.z, name: place.name, kind: "place" as const })),
    ];
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.font = `${Math.max(10, Math.round(11 * dpr))}px "Source Sans 3", sans-serif`;
    ctx.lineWidth = Math.max(2, dpr * 2);
    for (const mark of marks) {
      const p = at(mark.x, mark.z);
      const s = Math.max(3, dpr * 2.4);
      ctx.fillStyle = mark.kind === "open" ? "#e3c57a" : mark.kind === "shut" ? "#b7c4d6" : "#f4ecd4";
      if (mark.kind === "place") {
        ctx.beginPath();
        ctx.arc(p.x, p.y, s * 0.7, 0, Math.PI * 2);
        ctx.fill();
      } else ctx.fillRect(p.x - s, p.y - s, s * 2, s * 2);
      ctx.strokeStyle = "#0c1b38";
      ctx.fillStyle = mark.kind === "shut" ? "#b7c4d6" : "#e3c57a";
      ctx.strokeText(mark.name, p.x, p.y - s - dpr * 2);
      ctx.fillText(mark.name, p.x, p.y - s - dpr * 2);
    }
    ctx.fillStyle = "#f4ecd4";
    for (const book of [
      { x: MANUAL_EAST_X, z: MANUAL_EAST_Z },
      { x: MANUAL_EAST_ROAD_X, z: MANUAL_EAST_ROAD_Z },
    ]) {
      const p = at(book.x, book.z);
      const s = Math.max(2.5, dpr * 1.8);
      ctx.fillRect(p.x - s, p.y - s, s * 2, s * 2);
    }
  } else if (chart) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(nw.x, nw.y, se.x - nw.x, se.y - nw.y);
    ctx.clip();
    paintOrc(ctx, at, chart, snap.region, dpr, true);
    ctx.restore();
  } else {
    ctx.save();
    ctx.beginPath();
    ctx.rect(nw.x, nw.y, se.x - nw.x, se.y - nw.y);
    ctx.clip();
    paintTown(ctx, at, scale, dpr, snap.region, true);
    ctx.restore();
  }

  const north = at((bounds.minX + bounds.maxX) / 2, bounds.minZ);
  ctx.fillStyle = "#e3c57a";
  ctx.font = `${Math.max(12, Math.round(14 * dpr))}px "Cormorant Garamond", Georgia, serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  ctx.fillText("N", north.x, north.y - dpr * 2);

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
  const nameRef = useRef<HTMLParagraphElement>(null);
  const atlasNameRef = useRef<HTMLParagraphElement>(null);
  const atlasCoordRef = useRef<HTMLParagraphElement>(null);
  const rootRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

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
      if (atlasRef.current) paintAtlas(atlasRef.current, snap);
      const label = `(${snap.x.toFixed(1)}, ${snap.z.toFixed(1)})`;
      const nextRegion = snap.region || "San d'Oria";
      if (label !== shown) {
        shown = label;
        if (coordRef.current) coordRef.current.textContent = label;
      }
      if (atlasCoordRef.current && atlasCoordRef.current.textContent !== label) atlasCoordRef.current.textContent = label;
      if (nextRegion !== region) {
        region = nextRegion;
        if (nameRef.current) nameRef.current.textContent = nextRegion;
        if (rootRef.current) rootRef.current.setAttribute("aria-label", `Open the ${nextRegion} map`);
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
        onClick={() => setOpen(true)}
        className="pointer-events-auto flex flex-col items-end text-right"
      >
        <canvas ref={canvasRef} aria-hidden className="pointer-events-none size-28 rounded-full sm:size-36" />
        <p ref={coordRef} className="mt-1 bg-navy/80 px-1.5 py-0.5 text-xs tabular-nums leading-none text-ink">
          (0.0, 0.0)
        </p>
        <p ref={nameRef} className="mt-1 max-w-40 border border-gold bg-panel px-2 py-1 text-right font-display text-sm leading-tight text-gold">
          San d'Oria
        </p>
      </button>
      {open && (
        <div className="pointer-events-auto fixed inset-0 z-50 flex justify-center bg-navy/80 p-3" role="dialog" aria-modal="true" aria-label="Zone map">
          <div className="ffxi-frame flex h-full w-full max-w-3xl flex-col p-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p ref={atlasNameRef} className="font-display text-3xl leading-none text-gold">
                  San d'Oria
                </p>
                <p ref={atlasCoordRef} className="mt-1 text-sm tabular-nums text-muted">
                  (0.0, 0.0)
                </p>
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
