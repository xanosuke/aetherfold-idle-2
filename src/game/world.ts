/**
 * San d'Oria and West Ronfaure are separate zones. The south bridge and the
 * north postern are zone lines, not a continuous walk. Screen-down is +Z
 * (south), +X is east, the same axes as retail. West Ronfaure is a 12 by 12
 * grid of 48-yalm cells: 576 yalms on a side, the span of a starter field.
 */

import { assertGhelsba, clampOrc, inOrc, orcArrival, orcRegion, ORC_GATES, ORC_ZONES, type OrcGate } from "./ghelsba";
import { assertEast, clampEast, EAST_MOUTH, EAST_SIZE, EAST_STAND, EAST_X0, EAST_Z0, inEast } from "./east-ronfaure";
import { assertTomb, clampTomb, inTomb, TOMB_FOYER, TOMB_GATES, type TombGate } from "./tomb";
import { assertPass, clampPass, inPass, PASS_ARRIVE, PASS_FROM_GLACIER, PASS_GATES, type PassGate } from "./pass";
import { assertGlacier, clampGlacier, glacierChart, GLACIER_ARRIVE, GLACIER_GATES, inGlacier, type GlacierGate } from "./glacier";
import { assertWorldLinks } from "./world-links";
import { squareCenter, squareOf, ZONE_GRIDS } from "./zone-grid";
import { assertSanGraph, clampNorthGraph, clampPortGraph, clampSouthGraph, inNorthGraph, inPortGraph, inSouthGraph, SAN_SPOT } from "./sandoria-graph";

/** How far the old training fence sat from the yard center. The south gate still uses it. */
export const PEN_EDGE = 8.55;
/** South walk edge of the castle ward, and the old training square. The gate opens here. */
export const PEN_ROOM = 7.95;
/** North walk edge. The bailey is deeper than the old square. */
export const WARD_NORTH = -14.6;
/** East and west walk edges. Wider than the old square. */
export const WARD_SIDE = 15.2;
/** Width of the south gate, post to post. Wide enough for a party. */
export const GATE_HALF = 1.7;
/** Near end of the bridge deck, just inside the gate. */
export const BRIDGE_Z0 = 8.15;
/** Far end of the bridge. Stepping off here zones to West Ronfaure. */
export const BRIDGE_Z1 = 14.6;
export const BRIDGE_HALF = 1.35;

/**
 * Old south-of-the-bridge rectangle. Patrol rabbits still use these numbers.
 * The player cannot walk it. West Ronfaure is its own zone.
 */
export const FOREST_HALF = 36;
export const FOREST_CX = 0;
export const FOREST_CZ = BRIDGE_Z1 + FOREST_HALF;
export const FOREST_NORTH = FOREST_CZ - FOREST_HALF;
export const FOREST_SOUTH = FOREST_CZ + FOREST_HALF;
export const FOREST_WEST = FOREST_CX - FOREST_HALF;
export const FOREST_EAST = FOREST_CX + FOREST_HALF;

/** West Ronfaure. Columns A–L, rows 1–12. Each cell is 48 yalms. */
export const RON_CELL = 48;
export const RON_SIZE = RON_CELL * 12;
export const RON_X0 = -288;
export const RON_Z0 = 220;
export const PLACE_MIN_X = -1860;
export const PLACE_MAX_X = 1200;
export const PLACE_MIN_Z = -1100;
export const PLACE_MAX_Z = 1720;

const PAD = 0.35;
const RON_INSET = 8;

export type ZoneId =
  | "sandoria-south"
  | "sandoria-north"
  | "sandoria-port"
  | "ronfaure-south"
  | "ronfaure-north"
  | "east-ronfaure"
  | "ghelsba"
  | "fort-ghelsba"
  | "yughott"
  | "horlais"
  | "ranperre"
  | "ranguemont"
  | "beaucedine"
  | "closed";

export type ZoneGate = {
  id: string;
  name: string;
  x: number;
  z: number;
  hx: number;
  hz: number;
  to: ZoneId;
  /** Where an open gate puts you. Closed gates ignore this. */
  arrive?: { x: number; z: number; yaw: number; log: string };
  /** Closed gates step back toward this point instead of the field center. */
  retreat?: { x: number; z: number };
};

export type CityRect = { minX: number; maxX: number; minZ: number; maxZ: number };

/**
 * Southern San d'Oria, grown off the old bailey.
 * West Ronfaure stays the south bridge (F-10). East Ronfaure is the east
 * end of that same south side (L-10). The Chocobo Circuit is just south of
 * the square (H-11). Northern San d'Oria is the north street (I-7).
 */
export const EAST_ROAD: CityRect = { minX: 260, maxX: 310, minZ: 30, maxZ: 66 };
export const NORTH_ROAD: CityRect = { minX: 120, maxX: 168, minZ: -120, maxZ: -70 };
export const CHOCO_ROAD: CityRect = { minX: 78, maxX: 114, minZ: 70, maxZ: 112 };

/** Northern San d'Oria. Separate ground, so the two districts only meet at a zone line. */
export const NORTH_YARD: CityRect = { minX: -220, maxX: 400, minZ: -760, maxZ: -320 };
/** Port San d'Oria. The dock and the pier north of the northern district. */
export const PORT_YARD: CityRect = { minX: -90, maxX: 90, minZ: -1040, maxZ: -700 };
export const PORT_PIER: CityRect = { minX: -7, maxX: 7, minZ: -1031.2, maxZ: -990 };
/** Gallijaux, on the east lip of the pier, facing the harbor. Joulet stands on the west lip. */
export const FISHER = { x: SAN_SPOT.fisher.x, z: SAN_SPOT.fisher.z };
export const JOULET = { x: SAN_SPOT.joulet.x, z: SAN_SPOT.joulet.z };

/**
 * A cast off the north lip of the pier. The camera looks north, so the rod
 * points away from you and a left or right pull reads across the screen.
 * Returns null when you are not standing at the water.
 */
export function fishCast(x: number, z: number): { x: number; z: number; yaw: number } | null {
  if (x < PORT_PIER.minX + 0.4 || x > PORT_PIER.maxX - 0.4) return null;
  if (z > PORT_PIER.minZ + 8 || z < PORT_PIER.minZ + 0.35) return null;
  return { x, z: PORT_PIER.minZ - 2.3, yaw: 0 };
}

export type CityBlock = { x: number; z: number; w: number; d: number };

/** Northern streets. Each one runs into a gate. The chateau sits north of them, with the door in front. */
export const NORTH_AVENUE: CityRect = { minX: 128, maxX: 160, minZ: -370, maxZ: -320 };
export const NORTH_WATCH: CityRect = { minX: -170, maxX: -110, minZ: -465, maxZ: -415 };
export const NORTH_POSTERN: CityRect = { minX: -120, maxX: -60, minZ: -510, maxZ: -465 };
export const NORTH_HARBOR: CityRect = { minX: -20, maxX: 20, minZ: -700, maxZ: -650 };
export const NORTH_LINK: CityRect = { minX: -20, maxX: 20, minZ: -610, maxZ: -555 };
export const NORTH_LANE: CityRect = { minX: 120, maxX: 170, minZ: -560, maxZ: -500 };
export const CHATEAU_FOOT: CityRect = { minX: 110, maxX: 180, minZ: -610, maxZ: -550 };
export const NORTH_HOUSES: readonly CityBlock[] = [
  { x: 240, z: -480, w: 10, d: 8 },
  { x: 250, z: -540, w: 8, d: 6 },
  { x: -200, z: -400, w: 8, d: 6 },
];

/** The port quay runs from the northern gate to the pier. */
export const PORT_QUAY: CityRect = { minX: -70, maxX: 30, minZ: -1040, maxZ: -700 };
export const PORT_HOUSES: readonly CityBlock[] = [
  { x: 48, z: -900, w: 8, d: 6 },
  { x: 50, z: -960, w: 7, d: 5 },
];

/** Bailey and street houses. The map uses the same footprints. */
export const SOUTH_HOUSES: readonly CityBlock[] = [
  { x: -28, z: -48, w: 6, d: 4 },
  { x: 28, z: -48, w: 6, d: 4 },
  { x: -20, z: 8, w: 5, d: 4 },
];

/** Column 0 is A, row 0 is 1. Center of that map cell. */
export function ronCell(col: number, row: number): { x: number; z: number } {
  return {
    x: RON_X0 + (col + 0.5) * RON_CELL,
    z: RON_Z0 + (row + 0.5) * RON_CELL,
  };
}

const SOUTH_GATE = ronCell(8, 5);
const NORTH_GATE = ronCell(8, 4);
const EAST_A = ronCell(9, 6);
const EAST_B = ronCell(9, 8);
const GHELSBA = ronCell(4, 3);
const THEINE = ronCell(5, 11);
const OUBLIETTE = ronCell(4, 6);
const OUTPOST = ronCell(6, 8);
const KNIGHTWELL = ronCell(7, 10);
const MONUMENT = ronCell(8, 9);

/** San d'Oria's rampart. Forest is west and south of it. The city side is cliff. */
const RAMPART_COL = 7.85;
const SOUTH_FACE = 5.15;
const NORTH_CAP = 3.42;
const NORTH_MOUTH_0 = 4.22;
const NORTH_MOUTH_1 = 4.48;
const NORTH_DEEP = 8.45;
const SOUTH_MOUTH_0 = 8.15;
const SOUTH_MOUTH_1 = 8.45;
const SOUTH_DEEP = 4.92;
const CITY_EAST = 9.15;

export const RAMPART = {
  x: RON_X0 + RAMPART_COL * RON_CELL,
  northZ: RON_Z0 + NORTH_CAP * RON_CELL,
  southZ: RON_Z0 + SOUTH_FACE * RON_CELL,
  eastX: RON_X0 + CITY_EAST * RON_CELL,
  northGap0: RON_Z0 + NORTH_MOUTH_0 * RON_CELL,
  northGap1: RON_Z0 + NORTH_MOUTH_1 * RON_CELL,
  northDeep: RON_X0 + NORTH_DEEP * RON_CELL,
  southGap0: RON_X0 + SOUTH_MOUTH_0 * RON_CELL,
  southGap1: RON_X0 + SOUTH_MOUTH_1 * RON_CELL,
  southDeep: RON_Z0 + SOUTH_DEEP * RON_CELL,
};

/** Zone lines in the gate mouths. I-5 faces west, I-6 faces south. */
export const SAN_NORTH = {
  x: RON_X0 + ((RAMPART_COL + NORTH_DEEP) / 2) * RON_CELL,
  z: RON_Z0 + ((NORTH_MOUTH_0 + NORTH_MOUTH_1) / 2) * RON_CELL,
};
export const SAN_SOUTH = {
  x: RON_X0 + ((SOUTH_MOUTH_0 + SOUTH_MOUTH_1) / 2) * RON_CELL,
  z: RON_Z0 + ((SOUTH_FACE + SOUTH_DEEP) / 2) * RON_CELL,
};

const cellX = (col: number) => RON_X0 + col * RON_CELL;
const cellZ = (row: number) => RON_Z0 + row * RON_CELL;

/** Dead-end mouths. Beyond each arch is cliff, so the exit cannot be walked around. */
export const EXITS = {
  ghelsba: { x: cellX(4.37), z: cellZ(3.285) },
  eastA: { x: cellX(9.785), z: cellZ(6.53) },
  eastB: { x: cellX(9.785), z: cellZ(8.53) },
  theine: { x: cellX(5.5), z: cellZ(11.7) },
};

/**
 * Walkable coast of West Ronfaure, in map cells. Column 0 is A, row 0 is 1.
 * Outside this polygon is cliff. Gate mouths are dead ends.
 */
export const RON_COAST: readonly [number, number][] = [
  [4.02, 3.42],
  [4.22, 3.42],
  [4.22, 3.15],
  [4.52, 3.15],
  [4.52, 3.42],
  [RAMPART_COL, NORTH_CAP],
  [RAMPART_COL, NORTH_MOUTH_0],
  [NORTH_DEEP, NORTH_MOUTH_0],
  [NORTH_DEEP, NORTH_MOUTH_1],
  [RAMPART_COL, NORTH_MOUTH_1],
  [RAMPART_COL, SOUTH_FACE],
  [SOUTH_MOUTH_0, SOUTH_FACE],
  [SOUTH_MOUTH_0, SOUTH_DEEP],
  [SOUTH_MOUTH_1, SOUTH_DEEP],
  [SOUTH_MOUTH_1, SOUTH_FACE],
  [CITY_EAST, SOUTH_FACE],
  [9.55, 5.55],
  [9.7, 5.72],
  [9.62, 6.15],
  [9.62, 6.38],
  [9.95, 6.38],
  [9.95, 6.68],
  [9.62, 6.68],
  [9.62, 8.38],
  [9.95, 8.38],
  [9.95, 8.68],
  [9.62, 8.68],
  [9.62, 8.95],
  [9.05, 9.28],
  [8.45, 9.9],
  [7.95, 10.55],
  [7.25, 11.28],
  [6.15, 11.55],
  [5.72, 11.55],
  [5.72, 11.85],
  [5.28, 11.85],
  [5.28, 11.55],
  [4.85, 11.55],
  [4.42, 11.28],
  [4.12, 10.25],
  [4.02, 9.15],
  [3.72, 8.05],
  [3.78, 7.05],
  [3.95, 6.05],
  [3.82, 5.05],
  [4.02, 4.05],
];

const COAST_PTS = RON_COAST.map(([col, row]) => ({
  x: RON_X0 + col * RON_CELL,
  z: RON_Z0 + row * RON_CELL,
}));

function pointOnCoast(x: number, z: number): boolean {
  let hit = false;
  for (let i = 0, j = COAST_PTS.length - 1; i < COAST_PTS.length; j = i++) {
    const a = COAST_PTS[i];
    const b = COAST_PTS[j];
    if ((a.z > z) !== (b.z > z) && x < ((b.x - a.x) * (z - a.z)) / (b.z - a.z) + a.x) hit = !hit;
  }
  return hit;
}

function nearestCoast(x: number, z: number): { x: number; z: number; nx: number; nz: number; dist: number } {
  let best = Infinity;
  let hx = x;
  let hz = z;
  let nx = 0;
  let nz = 1;
  for (let i = 0; i < COAST_PTS.length; i++) {
    const a = COAST_PTS[i];
    const b = COAST_PTS[(i + 1) % COAST_PTS.length];
    const dx = b.x - a.x;
    const dz = b.z - a.z;
    const len2 = dx * dx + dz * dz;
    if (len2 < 1e-6) continue;
    const t = Math.max(0, Math.min(1, ((x - a.x) * dx + (z - a.z) * dz) / len2));
    const px = a.x + dx * t;
    const pz = a.z + dz * t;
    const dist = Math.hypot(x - px, z - pz);
    if (dist < best) {
      best = dist;
      hx = px;
      hz = pz;
      const len = Math.sqrt(len2);
      nx = -dz / len;
      nz = dx / len;
    }
  }
  return { x: hx, z: hz, nx, nz, dist: best };
}

/** True when this point is on the field, not the cliff. */
export function onCoast(x: number, z: number, radius = 0): boolean {
  if (!pointOnCoast(x, z)) return false;
  if (radius <= 0) return true;
  return nearestCoast(x, z).dist + 0.02 >= radius;
}

function pushCoast(x: number, z: number, radius: number): { x: number; z: number } {
  const gap = Math.max(radius, 0) + 0.35;
  const safe = { x: SAN_SOUTH.x, z: SAN_SOUTH.z + 18 };
  const hit = nearestCoast(x, z);
  const stepped = { x: hit.x + hit.nx * gap, z: hit.z + hit.nz * gap };
  if (pointOnCoast(stepped.x, stepped.z) && nearestCoast(stepped.x, stepped.z).dist + 0.05 >= gap) return stepped;
  for (let i = 1; i <= 32; i++) {
    const t = i / 32;
    const qx = x + (safe.x - x) * t;
    const qz = z + (safe.z - z) * t;
    if (!pointOnCoast(qx, qz) || nearestCoast(qx, qz).dist + 0.05 < gap) continue;
    return { x: qx, z: qz };
  }
  return safe;
}

export const RON_MARKS = {
  southGate: SOUTH_GATE,
  northGate: NORTH_GATE,
  eastRonfaureA: EAST_A,
  eastRonfaureB: EAST_B,
  ghelsba: GHELSBA,
  laTheine: THEINE,
  oubliette: OUBLIETTE,
  outpost: OUTPOST,
  knightwell: KNIGHTWELL,
  monument: MONUMENT,
};

function orcZoneGate(gate: OrcGate): ZoneGate {
  if (gate.to === "closed") {
    return {
      id: gate.id,
      name: gate.name,
      x: gate.x,
      z: gate.z,
      hx: gate.hx,
      hz: gate.hz,
      to: "closed",
      retreat: { x: gate.arrive.x, z: gate.arrive.z },
    };
  }
  if (gate.id === "ghelsba-ron") {
    return {
      id: gate.id,
      name: gate.name,
      x: gate.x,
      z: gate.z,
      hx: gate.hx,
      hz: gate.hz,
      to: "ronfaure-south",
      arrive: { x: EXITS.ghelsba.x, z: EXITS.ghelsba.z + 14, yaw: 0, log: "West Ronfaure." },
    };
  }
  return {
    id: gate.id,
    name: gate.name,
    x: gate.x,
    z: gate.z,
    hx: gate.hx,
    hz: gate.hz,
    to: gate.to as ZoneId,
    arrive: gate.arrive,
  };
}

export const ZONE_GATES: readonly ZoneGate[] = [
  { id: "city-south", name: "West Ronfaure", x: SAN_SPOT.southRon.x, z: SAN_SPOT.southRon.z, hx: 5, hz: 5, to: "ronfaure-south" },
  { id: "city-east", name: "East Ronfaure", x: SAN_SPOT.southEast.x, z: SAN_SPOT.southEast.z, hx: 5, hz: 5, to: "east-ronfaure", arrive: EAST_STAND.sandoria },
  {
    id: "city-chocobo",
    name: "Chocobo Circuit",
    x: SAN_SPOT.southChoco.x,
    z: SAN_SPOT.southChoco.z,
    hx: 5,
    hz: 5,
    to: "closed",
    retreat: { x: SAN_SPOT.southChoco.x, z: SAN_SPOT.southChoco.z - 10 },
  },
  {
    id: "city-to-north",
    name: "Northern San d'Oria",
    x: SAN_SPOT.southNorth.x,
    z: SAN_SPOT.southNorth.z,
    hx: 5,
    hz: 5,
    to: "sandoria-north",
    arrive: { x: SAN_SPOT.northSouth.x, z: SAN_SPOT.northSouth.z - 10, yaw: 0, log: "Northern San d'Oria." },
  },
  {
    id: "north-to-south",
    name: "Southern San d'Oria",
    x: SAN_SPOT.northSouth.x,
    z: SAN_SPOT.northSouth.z,
    hx: 5,
    hz: 5,
    to: "sandoria-south",
    arrive: { x: SAN_SPOT.southNorth.x, z: SAN_SPOT.southNorth.z + 10, yaw: 0, log: "Southern San d'Oria." },
  },
  { id: "north-west", name: "West Ronfaure", x: SAN_SPOT.northWest.x, z: SAN_SPOT.northWest.z, hx: 5, hz: 5, to: "ronfaure-north" },
  {
    id: "north-west-d7",
    name: "West Ronfaure",
    x: SAN_SPOT.northD7.x,
    z: SAN_SPOT.northD7.z,
    hx: 5,
    hz: 5,
    to: "ronfaure-north",
    arrive: { x: SAN_NORTH.x + 4.6, z: SAN_NORTH.z, yaw: 0, log: "West Ronfaure." },
  },
  {
    id: "north-port",
    name: "Port San d'Oria",
    x: SAN_SPOT.northPort.x,
    z: SAN_SPOT.northPort.z,
    hx: 5,
    hz: 5,
    to: "sandoria-port",
    arrive: { x: SAN_SPOT.portNorth.x, z: SAN_SPOT.portNorth.z - 10, yaw: 0, log: "Port San d'Oria." },
  },
  {
    id: "north-chateau",
    name: "Chateau d'Oraguille",
    x: SAN_SPOT.northChateau.x,
    z: SAN_SPOT.northChateau.z,
    hx: 5,
    hz: 5,
    to: "closed",
    retreat: { x: SAN_SPOT.northChateau.x, z: SAN_SPOT.northChateau.z + 10 },
  },
  {
    id: "north-landing",
    name: "Carpenters' Landing",
    x: SAN_SPOT.northLanding.x,
    z: SAN_SPOT.northLanding.z,
    hx: 5,
    hz: 5,
    to: "closed",
    retreat: { x: SAN_SPOT.northLanding.x, z: SAN_SPOT.northLanding.z + 10 },
  },
  {
    id: "port-to-north",
    name: "Northern San d'Oria",
    x: SAN_SPOT.portNorth.x,
    z: SAN_SPOT.portNorth.z,
    hx: 5,
    hz: 5,
    to: "sandoria-north",
    arrive: { x: SAN_SPOT.northPort.x, z: SAN_SPOT.northPort.z + 10, yaw: 0, log: "Northern San d'Oria." },
  },
  // Gates sit just inside the mouths. The camera looks north, so an arch to the north is in front of the player.
  { id: "ron-south", name: "Southern San d'Oria", x: SAN_SOUTH.x, z: SAN_SOUTH.z, hx: 3.4, hz: 3.2, to: "sandoria-south" },
  { id: "ron-north", name: "Northern San d'Oria", x: SAN_NORTH.x, z: SAN_NORTH.z, hx: 3.6, hz: 3.4, to: "sandoria-north" },
  {
    id: "ron-north-d7",
    name: "Northern San d'Oria",
    x: SAN_NORTH.x + 9,
    z: SAN_NORTH.z,
    hx: 2.2,
    hz: 2.6,
    to: "sandoria-north",
    arrive: { x: SAN_SPOT.northD7.x + 10, z: SAN_SPOT.northD7.z, yaw: 0, log: "Northern San d'Oria." },
  },
  { id: "ron-east-a", name: "East Ronfaure", x: EXITS.eastA.x, z: EXITS.eastA.z, hx: 3.2, hz: 3.2, to: "east-ronfaure", arrive: EAST_STAND.westA },
  { id: "ron-east-b", name: "East Ronfaure", x: EXITS.eastB.x, z: EXITS.eastB.z, hx: 3.2, hz: 3.2, to: "east-ronfaure", arrive: EAST_STAND.westB },
  { id: "ron-ghelsba", name: "Ghelsba Outpost", x: EXITS.ghelsba.x, z: EXITS.ghelsba.z, hx: 3.2, hz: 3.2, to: "ghelsba", arrive: orcArrival("ghelsba") ?? undefined },
  { id: "ron-theine", name: "La Theine Plateau", x: EXITS.theine.x, z: EXITS.theine.z, hx: 3.4, hz: 3.2, to: "closed" },
  {
    id: "east-sandoria",
    name: "Southern San d'Oria",
    x: EAST_MOUTH.sandoria.x,
    z: EAST_MOUTH.sandoria.z,
    hx: EAST_MOUTH.sandoria.hx,
    hz: EAST_MOUTH.sandoria.hz,
    to: "sandoria-south",
    arrive: { x: SAN_SPOT.southEast.x - 10, z: SAN_SPOT.southEast.z, yaw: 0, log: "Southern San d'Oria." },
  },
  {
    id: "east-west-a",
    name: "West Ronfaure",
    x: EAST_MOUTH.westA.x,
    z: EAST_MOUTH.westA.z,
    hx: EAST_MOUTH.westA.hx,
    hz: EAST_MOUTH.westA.hz,
    to: "ronfaure-south",
    arrive: { x: EXITS.eastA.x - 14, z: EXITS.eastA.z, yaw: 0, log: "West Ronfaure." },
  },
  {
    id: "east-west-b",
    name: "West Ronfaure",
    x: EAST_MOUTH.westB.x,
    z: EAST_MOUTH.westB.z,
    hx: EAST_MOUTH.westB.hx,
    hz: EAST_MOUTH.westB.hz,
    to: "ronfaure-south",
    arrive: { x: EXITS.eastB.x - 14, z: EXITS.eastB.z, yaw: 0, log: "West Ronfaure." },
  },
  {
    id: "east-ranguemont",
    name: "Ranguemont Pass",
    x: EAST_MOUTH.ranguemont.x,
    z: EAST_MOUTH.ranguemont.z,
    hx: EAST_MOUTH.ranguemont.hx,
    hz: EAST_MOUTH.ranguemont.hz,
    to: "ranguemont",
    arrive: PASS_ARRIVE,
  },
  {
    id: "east-tomb-h",
    name: "King Ranperre's Tomb",
    x: EAST_MOUTH.tombH.x,
    z: EAST_MOUTH.tombH.z,
    hx: EAST_MOUTH.tombH.hx,
    hz: EAST_MOUTH.tombH.hz,
    to: "ranperre",
    arrive: TOMB_FOYER,
  },
  {
    id: "east-tomb-j",
    name: "King Ranperre's Tomb",
    x: EAST_MOUTH.tombJ.x,
    z: EAST_MOUTH.tombJ.z,
    hx: EAST_MOUTH.tombJ.hx,
    hz: EAST_MOUTH.tombJ.hz,
    to: "closed",
    retreat: EAST_MOUTH.tombJ.retreat,
  },
  {
    id: "east-maw",
    name: "Cavernous Maw",
    x: EAST_MOUTH.maw.x,
    z: EAST_MOUTH.maw.z,
    hx: EAST_MOUTH.maw.hx,
    hz: EAST_MOUTH.maw.hz,
    to: "closed",
    retreat: EAST_MOUTH.maw.retreat,
  },
  ...ORC_GATES.map(orcZoneGate),
  ...TOMB_GATES.map(tombZoneGate),
  ...PASS_GATES.map(passZoneGate),
  ...GLACIER_GATES.map(glacierZoneGate),
];

function tombZoneGate(gate: TombGate): ZoneGate {
  return {
    id: gate.id,
    name: gate.name,
    x: gate.x,
    z: gate.z,
    hx: gate.hx,
    hz: gate.hz,
    to: gate.to,
    arrive: gate.arrive,
    retreat: gate.retreat,
  };
}

function passZoneGate(gate: PassGate): ZoneGate {
  return {
    id: gate.id,
    name: gate.name,
    x: gate.x,
    z: gate.z,
    hx: gate.hx,
    hz: gate.hz,
    to: gate.to,
    arrive: gate.arrive,
    retreat: gate.retreat,
  };
}

function glacierZoneGate(gate: GlacierGate): ZoneGate {
  return {
    id: gate.id,
    name: gate.name,
    x: gate.x,
    z: gate.z,
    hx: gate.hx,
    hz: gate.hz,
    to: gate.to,
    arrive: gate.id === "glacier-pass" ? PASS_FROM_GLACIER : gate.arrive,
    retreat: gate.retreat,
  };
}

export function zoneTouch(x: number, z: number): ZoneGate | null {
  for (const gate of ZONE_GATES) {
    if (Math.abs(x - gate.x) <= gate.hx && Math.abs(z - gate.z) <= gate.hz) return gate;
  }
  return null;
}

export function zoneArrival(to: ZoneId): { x: number; z: number; yaw: number; log: string } {
  const orc = orcArrival(to);
  if (orc) return orc;
  if (to === "ronfaure-south") {
    return { x: SAN_SOUTH.x, z: SAN_SOUTH.z + 18, yaw: 0, log: "West Ronfaure." };
  }
  if (to === "ronfaure-north") {
    return { x: SAN_NORTH.x - 22, z: SAN_NORTH.z, yaw: 0, log: "West Ronfaure." };
  }
  if (to === "east-ronfaure") return EAST_STAND.sandoria;
  if (to === "ranperre") return TOMB_FOYER;
  if (to === "ranguemont") return PASS_ARRIVE;
  if (to === "beaucedine") return GLACIER_ARRIVE;
  if (to === "sandoria-south") {
    return { x: SAN_SPOT.southRon.x, z: SAN_SPOT.southRon.z - 10, yaw: 0, log: "Southern San d'Oria." };
  }
  if (to === "sandoria-north") {
    return { x: SAN_SPOT.northWest.x + 10, z: SAN_SPOT.northWest.z, yaw: 0, log: "Northern San d'Oria." };
  }
  if (to === "sandoria-port") {
    return { x: SAN_SPOT.portNorth.x, z: SAN_SPOT.portNorth.z - 10, yaw: 0, log: "Port San d'Oria." };
  }
  if (to === "closed") {
    return { x: 0, z: 11.2, yaw: 0, log: "Southern San d'Oria." };
  }
  return { x: 0, z: 11.2, yaw: 0, log: "Southern San d'Oria." };
}

function inWard(x: number, z: number, r: number): boolean {
  return x >= -WARD_SIDE + r && x <= WARD_SIDE - r && z >= WARD_NORTH + r && z <= PEN_ROOM - r;
}

function onBridge(x: number, z: number, r: number): boolean {
  return Math.abs(x) <= BRIDGE_HALF - r && z >= PEN_ROOM - r - 0.05 && z <= BRIDGE_Z1 + 0.15;
}

function inside(x: number, z: number, r: number, box: CityRect): boolean {
  return x >= box.minX + r && x <= box.maxX - r && z >= box.minZ + r && z <= box.maxZ - r;
}

export function inSouthCity(x: number, z: number, radius = 0): boolean {
  return inSouthGraph(x, z, Math.max(0, radius));
}

export function inNorthCity(x: number, z: number, radius = 0): boolean {
  return inNorthGraph(x, z, Math.max(0, radius));
}

export function inPort(x: number, z: number, radius = 0): boolean {
  return inPortGraph(x, z, Math.max(0, radius));
}

export function inRonfaure(x: number, z: number, radius = 0): boolean {
  const r = Math.max(0, radius);
  if (
    x < RON_X0 + RON_INSET + r ||
    x > RON_X0 + RON_SIZE - RON_INSET - r ||
    z < RON_Z0 + RON_INSET + r ||
    z > RON_Z0 + RON_SIZE - RON_INSET - r
  ) {
    return false;
  }
  return onCoast(x, z, r);
}

/** True when a body of this radius can stand here: a San d'Oria district, its bridge, or West Ronfaure. */
export function inWorld(x: number, z: number, radius = 0): boolean {
  const r = Math.max(0, radius);
  return inSouthCity(x, z, r) || inNorthCity(x, z, r) || inPort(x, z, r) || inRonfaure(x, z, r) || inEast(x, z, r) || inOrc(x, z, r) || inTomb(x, z, r) || inPass(x, z, r) || inGlacier(x, z, r);
}

function clampWard(x: number, z: number, r: number): { x: number; z: number } {
  return {
    x: Math.max(-WARD_SIDE + r, Math.min(WARD_SIDE - r, x)),
    z: Math.max(WARD_NORTH + r, Math.min(PEN_ROOM - r, z)),
  };
}

function clampRon(x: number, z: number, r: number): { x: number; z: number } {
  const box = {
    x: Math.max(RON_X0 + RON_INSET + r, Math.min(RON_X0 + RON_SIZE - RON_INSET - r, x)),
    z: Math.max(RON_Z0 + RON_INSET + r, Math.min(RON_Z0 + RON_SIZE - RON_INSET - r, z)),
  };
  if (onCoast(box.x, box.z, r)) return box;
  return pushCoast(box.x, box.z, r);
}

function nearerRon(x: number, z: number): boolean {
  const city = Math.hypot(x, z);
  const rx = RON_X0 + RON_SIZE / 2;
  const rz = RON_Z0 + RON_SIZE / 2;
  return Math.hypot(x - rx, z - rz) < city;
}

const SOUTH_PARTS: readonly CityRect[] = [
  { minX: -WARD_SIDE, maxX: WARD_SIDE, minZ: WARD_NORTH, maxZ: PEN_ROOM },
  { minX: -BRIDGE_HALF, maxX: BRIDGE_HALF, minZ: PEN_ROOM - 0.2, maxZ: BRIDGE_Z1 },
  EAST_ROAD,
  NORTH_ROAD,
  CHOCO_ROAD,
];
const NORTH_PARTS: readonly CityRect[] = [NORTH_YARD];
const PORT_PARTS: readonly CityRect[] = [PORT_YARD, PORT_PIER];

function rectDist(x: number, z: number, box: CityRect): number {
  const cx = Math.max(box.minX, Math.min(box.maxX, x));
  const cz = Math.max(box.minZ, Math.min(box.maxZ, z));
  return Math.hypot(x - cx, z - cz);
}

function clampInto(x: number, z: number, r: number, parts: readonly CityRect[]): { x: number; z: number } {
  let best = parts[0];
  let bestD = Infinity;
  for (const box of parts) {
    const dist = rectDist(x, z, box);
    if (dist < bestD) {
      bestD = dist;
      best = box;
    }
  }
  return {
    x: Math.max(best.minX + r, Math.min(best.maxX - r, x)),
    z: Math.max(best.minZ + r, Math.min(best.maxZ - r, z)),
  };
}

/** Pull a point back onto walkable ground. The districts do not connect on foot. */
export function clampWorld(x: number, z: number, radius = 0): { x: number; z: number } {
  if (inWorld(x, z, radius)) return { x, z };
  const r = Math.max(0, radius);
  if (z > PEN_ROOM - 1 && z < BRIDGE_Z1 + 2 && Math.abs(x) < WARD_SIDE && !nearerRon(x, z)) {
    if (Math.abs(x) <= BRIDGE_HALF + 0.2) {
      return {
        x: Math.max(-BRIDGE_HALF + r, Math.min(BRIDGE_HALF - r, x)),
        z: Math.max(PEN_ROOM - r, Math.min(BRIDGE_Z1 - 0.05, z)),
      };
    }
    return clampWard(x, PEN_ROOM - r, r);
  }
  if (z >= RON_Z0 - 40 && z <= RON_Z0 + RON_SIZE + 40 && x >= RON_X0 - 40 && x <= RON_X0 + RON_SIZE + 40) return clampRon(x, z, r);
  if (z >= EAST_Z0 - 30 && z <= EAST_Z0 + EAST_SIZE + 30 && x >= EAST_X0 - 30 && x <= EAST_X0 + EAST_SIZE + 30) return clampEast(x, z, r);
  const tomb = clampTomb(x, z, r);
  if (tomb) return tomb;
  const pass = clampPass(x, z, r);
  const glacier = clampGlacier(x, z, r);
  if (pass && glacier) {
    const passD = Math.hypot(pass.x - x, pass.z - z);
    const glacierD = Math.hypot(glacier.x - x, glacier.z - z);
    return passD <= glacierD ? pass : glacier;
  }
  if (pass) return pass;
  if (glacier) return glacier;
  const orc = clampOrc(x, z, r);
  if (orc) return orc;
  const south = Math.hypot(x - 12, z);
  const north = Math.hypot(x, z + 488);
  const port = Math.hypot(x, z + 874);
  if (port < south && port < north) return clampPortGraph(x, z, r);
  if (north < south) return clampNorthGraph(x, z, r);
  return clampSouthGraph(x, z, r);
}

export function regionName(x: number, z: number): string {
  if (inRonfaure(x, z, 0)) return "West Ronfaure";
  if (inEast(x, z, 0)) return "East Ronfaure";
  if (inTomb(x, z, 0)) return "King Ranperre's Tomb";
  if (inPass(x, z, 0)) return "Ranguemont Pass";
  if (inGlacier(x, z, 0)) return "Beaucedine Glacier";
  const orc = orcRegion(x, z);
  if (orc) return orc;
  if (inPort(x, z, 0)) return "Port San d'Oria";
  if (inNorthCity(x, z, 0)) return "Northern San d'Oria";
  if (inSouthCity(x, z, 0)) return "Southern San d'Oria";
  return "San d'Oria";
}

export function assertWorld(): void {
  assertWestGrid();
  if (FOREST_HALF * 2 < 18.6 * Math.sqrt(10) - 0.05) throw new Error("forest is not 10x the pen");
  if (RON_SIZE !== 576) throw new Error("west ronfaure is 576 yalms");
  if (!inWorld(0, 0)) throw new Error("pen center");
  if (!inWorld(0, 10)) throw new Error("bridge");
  if (!inWorld(12, -12)) throw new Error("bailey");
  if (!inRonfaure(SOUTH_GATE.x, SOUTH_GATE.z)) throw new Error("south gate");
  if (!inWorld(RON_X0 + RON_SIZE / 2, RON_Z0 + RON_SIZE / 2)) throw new Error("ronfaure heart");
  if (inWorld(30, 48)) throw new Error("gap beside the south gate");
  if (inWorld(40, 20)) throw new Error("west of the forest is closed");
  if (inWorld(-80, 0)) throw new Error("west of the avenue is closed");
  const pulled = clampWorld(30, 48, 0.36);
  if (!inWorld(pulled.x, pulled.z, 0.2)) throw new Error("clamp left the gap");
  const heart = clampWorld(RON_X0 - 10, RON_Z0 + 40, 0.3);
  if (!inRonfaure(heart.x, heart.z, 0.1)) throw new Error("clamp left ronfaure");
  if (regionName(0, 0) !== "Southern San d'Oria") throw new Error("pen name");
  if (regionName(SOUTH_GATE.x, SOUTH_GATE.z) !== "West Ronfaure") throw new Error("forest name");
  const into = zoneTouch(SAN_SPOT.southRon.x, SAN_SPOT.southRon.z);
  if (!into || into.to !== "ronfaure-south") throw new Error("south bridge zones");
  const back = zoneArrival("sandoria-south");
  if (!inWorld(back.x, back.z, 0)) throw new Error("return stands in the city");
  if (zoneTouch(back.x, back.z)) throw new Error("return stands on a zone line");
  const landed = zoneArrival("ronfaure-south");
  if (!inRonfaure(landed.x, landed.z) || zoneTouch(landed.x, landed.z)) throw new Error("forest arrival");
  if (Math.abs(RON_MARKS.laTheine.z - (RON_Z0 + 11.5 * RON_CELL)) > 0.01) throw new Error("F-12");
  if (inRonfaure(111, 320)) throw new Error("I-3 is cliff");
  if (inRonfaure(120, 440)) throw new Error("behind the san d'oria wall");
  if (!inRonfaure(62.9, 469.9, 0.36)) throw new Error("west of the rampart");
  const southIn = zoneArrival("ronfaure-south");
  const northIn = zoneArrival("ronfaure-north");
  if (!inRonfaure(southIn.x, southIn.z, 0.36) || zoneTouch(southIn.x, southIn.z)) throw new Error("south arrival");
  if (!inRonfaure(northIn.x, northIn.z, 0.36) || zoneTouch(northIn.x, northIn.z)) throw new Error("north arrival");
  if (!zoneTouch(SAN_SOUTH.x, SAN_SOUTH.z) || zoneTouch(SAN_SOUTH.x, SAN_SOUTH.z)?.to !== "sandoria-south") throw new Error("south mouth");
  if (!zoneTouch(SAN_NORTH.x, SAN_NORTH.z) || zoneTouch(SAN_NORTH.x, SAN_NORTH.z)?.to !== "sandoria-north") throw new Error("north mouth");
  if (inRonfaure(-66, 360)) throw new Error("past ghelsba");
  if (inRonfaure(190, 532)) throw new Error("past east ronfaure");
  if (inRonfaure(-24, 800)) throw new Error("past la theine");
  if (!inRonfaure(EXITS.ghelsba.x, EXITS.ghelsba.z, 0.3) || zoneTouch(EXITS.ghelsba.x, EXITS.ghelsba.z)?.id !== "ron-ghelsba") throw new Error("ghelsba mouth");
  if (!inRonfaure(EXITS.eastA.x, EXITS.eastA.z, 0.3) || zoneTouch(EXITS.eastA.x, EXITS.eastA.z)?.id !== "ron-east-a") throw new Error("east a mouth");
  if (!inRonfaure(EXITS.eastB.x, EXITS.eastB.z, 0.3) || zoneTouch(EXITS.eastB.x, EXITS.eastB.z)?.id !== "ron-east-b") throw new Error("east b mouth");
  if (!inRonfaure(EXITS.theine.x, EXITS.theine.z, 0.3) || zoneTouch(EXITS.theine.x, EXITS.theine.z)?.id !== "ron-theine") throw new Error("theine mouth");
  if (zoneTouch(-66.7, 396.6)) throw new Error("ghelsba clearing is not the zone line");
  const cliffed = clampWorld(111, 320, 0.36);
  if (!inRonfaure(cliffed.x, cliffed.z, 0.2)) throw new Error("cliff clamp");
  if (inRonfaure(-146, 330)) throw new Error("west stream is cliff");
  const cityEast = zoneTouch(SAN_SPOT.southEast.x, SAN_SPOT.southEast.z);
  if (!cityEast || cityEast.id !== "city-east" || cityEast.to !== "east-ronfaure" || !cityEast.arrive) throw new Error("east ronfaure gate");
  if (!inEast(cityEast.arrive.x, cityEast.arrive.z, 0.36) || zoneTouch(cityEast.arrive.x, cityEast.arrive.z)) throw new Error("east arrival from the city");
  if (regionName(cityEast.arrive.x, cityEast.arrive.z) !== "East Ronfaure") throw new Error("east name");
  const backCity = ZONE_GATES.find((gate) => gate.id === "east-sandoria");
  if (!backCity?.arrive || backCity.to !== "sandoria-south") throw new Error("east return to the city");
  if (!inSouthCity(backCity.arrive.x, backCity.arrive.z, 0.3) || zoneTouch(backCity.arrive.x, backCity.arrive.z)) throw new Error("city return stand");
  if (backCity.arrive.x < EAST_ROAD.minX || backCity.arrive.x > EAST_ROAD.maxX || backCity.arrive.z < EAST_ROAD.minZ || backCity.arrive.z > EAST_ROAD.maxZ) {
    throw new Error("city return left the east road");
  }
  const westA = zoneTouch(EXITS.eastA.x, EXITS.eastA.z);
  if (!westA || westA.id !== "ron-east-a" || westA.to !== "east-ronfaure" || !westA.arrive) throw new Error("F-7 gate");
  if (!inEast(westA.arrive.x, westA.arrive.z, 0.36) || zoneTouch(westA.arrive.x, westA.arrive.z)) throw new Error("F-7 arrival");
  const backA = ZONE_GATES.find((gate) => gate.id === "east-west-a");
  if (!backA?.arrive || backA.to !== "ronfaure-south") throw new Error("F-7 return");
  if (!inRonfaure(backA.arrive.x, backA.arrive.z, 0.36) || zoneTouch(backA.arrive.x, backA.arrive.z)) throw new Error("F-7 return stand");
  const westB = zoneTouch(EXITS.eastB.x, EXITS.eastB.z);
  if (!westB || westB.id !== "ron-east-b" || westB.to !== "east-ronfaure" || !westB.arrive) throw new Error("F-9 gate");
  if (!inEast(westB.arrive.x, westB.arrive.z, 0.36) || zoneTouch(westB.arrive.x, westB.arrive.z)) throw new Error("F-9 arrival");
  const backB = ZONE_GATES.find((gate) => gate.id === "east-west-b");
  if (!backB?.arrive || backB.to !== "ronfaure-south") throw new Error("F-9 return");
  if (!inRonfaure(backB.arrive.x, backB.arrive.z, 0.36) || zoneTouch(backB.arrive.x, backB.arrive.z)) throw new Error("F-9 return stand");
  for (const id of ["east-tomb-j", "east-maw"]) {
    const gate = ZONE_GATES.find((row) => row.id === id);
    if (!gate || gate.to !== "closed" || !gate.retreat) throw new Error(`${id} should stay closed`);
    if (!inEast(gate.x, gate.z, 0.2) || !inEast(gate.retreat.x, gate.retreat.z, 0.36)) throw new Error(`${id} retreat left the wood`);
    if (zoneTouch(gate.retreat.x, gate.retreat.z)) throw new Error(`${id} retreat stands on a zone line`);
  }
  if (inRonfaure(EAST_STAND.sandoria.x, EAST_STAND.sandoria.z) || inSouthCity(EAST_STAND.sandoria.x, EAST_STAND.sandoria.z) || inOrc(EAST_STAND.sandoria.x, EAST_STAND.sandoria.z)) {
    throw new Error("east ronfaure overlaps another zone");
  }
  if (EAST_X0 + EAST_SIZE > PLACE_MAX_X || EAST_Z0 + EAST_SIZE > PLACE_MAX_Z || EAST_X0 < PLACE_MIN_X) throw new Error("east ronfaure leaves the place box");
  if (EAST_X0 < RON_X0 + RON_SIZE + 40) throw new Error("east ronfaure overlaps the west clamp");
  assertEast();
  assertTomb();
  const intoTomb = zoneTouch(EAST_MOUTH.tombH.x, EAST_MOUTH.tombH.z);
  if (!intoTomb || intoTomb.id !== "east-tomb-h" || intoTomb.to !== "ranperre" || !intoTomb.arrive) throw new Error("H-11 tomb is shut");
  if (!inTomb(intoTomb.arrive.x, intoTomb.arrive.z, 0.36) || zoneTouch(intoTomb.arrive.x, intoTomb.arrive.z)) throw new Error("tomb arrival");
  if (regionName(intoTomb.arrive.x, intoTomb.arrive.z) !== "King Ranperre's Tomb") throw new Error("tomb name");
  const backWood = ZONE_GATES.find((gate) => gate.id === "tomb-east-in");
  if (!backWood?.arrive || backWood.to !== "east-ronfaure") throw new Error("tomb return gate");
  if (!inEast(backWood.arrive.x, backWood.arrive.z, 0.36) || zoneTouch(backWood.arrive.x, backWood.arrive.z)) throw new Error("tomb return stand");
  assertPass();
  const intoPass = zoneTouch(EAST_MOUTH.ranguemont.x, EAST_MOUTH.ranguemont.z);
  if (!intoPass || intoPass.id !== "east-ranguemont" || intoPass.to !== "ranguemont" || !intoPass.arrive) throw new Error("K-4 pass is shut");
  if (!inPass(intoPass.arrive.x, intoPass.arrive.z, 0.36) || zoneTouch(intoPass.arrive.x, intoPass.arrive.z)) throw new Error("pass arrival");
  if (regionName(intoPass.arrive.x, intoPass.arrive.z) !== "Ranguemont Pass") throw new Error("pass name");
  const backPass = ZONE_GATES.find((gate) => gate.id === "pass-east");
  if (!backPass?.arrive || backPass.to !== "east-ronfaure") throw new Error("pass return gate");
  if (!inEast(backPass.arrive.x, backPass.arrive.z, 0.36) || zoneTouch(backPass.arrive.x, backPass.arrive.z)) throw new Error("pass return stand");
  const glacier = ZONE_GATES.find((gate) => gate.id === "pass-beaucedine");
  if (!glacier || glacier.to !== "beaucedine" || !glacier.arrive) throw new Error("beaucedine door");
  if (!inGlacier(glacier.arrive.x, glacier.arrive.z, 0.36) || zoneTouch(glacier.arrive.x, glacier.arrive.z)) throw new Error("beaucedine arrival");
  if (regionName(glacier.arrive.x, glacier.arrive.z) !== "Beaucedine Glacier") throw new Error("beaucedine name");
  const backIce = ZONE_GATES.find((gate) => gate.id === "glacier-pass");
  if (!backIce?.arrive || backIce.to !== "ranguemont") throw new Error("glacier return gate");
  if (!inPass(backIce.arrive.x, backIce.arrive.z, 0.36) || zoneTouch(backIce.arrive.x, backIce.arrive.z)) throw new Error("glacier return stand");
  if (Math.hypot(backIce.arrive.x - PASS_FROM_GLACIER.x, backIce.arrive.z - PASS_FROM_GLACIER.z) > 0.05) throw new Error("glacier return left K-3");
  if (inGlacier(backIce.arrive.x, backIce.arrive.z) || inPass(glacier.arrive.x, glacier.arrive.z)) throw new Error("pass overlaps the glacier");
  for (const gate of PASS_GATES) if (inGlacier(gate.x, gate.z)) throw new Error(`${gate.id} sits on the ice`);
  for (const gate of GLACIER_GATES) if (inPass(gate.x, gate.z)) throw new Error(`${gate.id} sits in the pass`);
  assertGlacier();
  const iceChart = glacierChart(0, 0);
  if (iceChart.bounds.minX < PLACE_MIN_X || iceChart.bounds.maxX > PLACE_MAX_X || iceChart.bounds.minZ < PLACE_MIN_Z || iceChart.bounds.maxZ > PLACE_MAX_Z) {
    throw new Error("beaucedine leaves the place box");
  }
  if (inPass(EAST_MOUTH.ranguemont.x, EAST_MOUTH.ranguemont.z) || inEast(PASS_ARRIVE.x, PASS_ARRIVE.z)) throw new Error("pass overlaps east ronfaure");
  const dropped = ZONE_GATES.find((gate) => gate.id === "tomb-east-out");
  if (!dropped?.arrive || !inEast(dropped.arrive.x, dropped.arrive.z, 0.36) || zoneTouch(dropped.arrive.x, dropped.arrive.z)) {
    throw new Error("one-way drop");
  }
  if (inTomb(EAST_MOUTH.tombJ.x, EAST_MOUTH.tombJ.z)) throw new Error("J-11 opens into the tomb");
  const chocobo = zoneTouch(SAN_SPOT.southChoco.x, SAN_SPOT.southChoco.z);
  if (!chocobo || chocobo.to !== "closed" || chocobo.name !== "Chocobo Circuit") throw new Error("chocobo gate");
  const toNorth = zoneTouch(SAN_SPOT.southNorth.x, SAN_SPOT.southNorth.z);
  if (!toNorth || toNorth.to !== "sandoria-north" || !toNorth.arrive) throw new Error("south to north");
  if (!inNorthCity(toNorth.arrive.x, toNorth.arrive.z, 0.3) || zoneTouch(toNorth.arrive.x, toNorth.arrive.z)) throw new Error("north arrival from south");
  const toSouth = zoneTouch(SAN_SPOT.northSouth.x, SAN_SPOT.northSouth.z);
  if (!toSouth || toSouth.to !== "sandoria-south" || !toSouth.arrive) throw new Error("north to south");
  if (!inSouthCity(toSouth.arrive.x, toSouth.arrive.z, 0.3) || zoneTouch(toSouth.arrive.x, toSouth.arrive.z)) throw new Error("south arrival from north");
  const west = zoneTouch(SAN_SPOT.northWest.x, SAN_SPOT.northWest.z);
  if (!west || west.id !== "north-west" || west.to !== "ronfaure-north") throw new Error("northern west gate");
  const fromWest = zoneArrival("sandoria-north");
  if (!inNorthCity(fromWest.x, fromWest.z, 0.3) || zoneTouch(fromWest.x, fromWest.z)) throw new Error("west gate arrival");
  const northGrid = ZONE_GRIDS.find((g) => g.zone === "sandoria-north");
  const ronGrid = ZONE_GRIDS.find((g) => g.zone === "ronfaure-south");
  if (!northGrid || !ronGrid) throw new Error("city grids");
  const d7 = ZONE_GATES.find((gate) => gate.id === "north-west-d7");
  if (!d7?.arrive || d7.to !== "ronfaure-north") throw new Error("D-7 gate");
  if (squareOf(northGrid, d7.x, d7.z) !== "D-7") throw new Error("D-7 square");
  if (!inRonfaure(d7.arrive.x, d7.arrive.z, 0.3) || zoneTouch(d7.arrive.x, d7.arrive.z)) throw new Error("D-7 forest stand");
  if (squareOf(ronGrid, d7.arrive.x, d7.arrive.z) !== "I-5") throw new Error("D-7 arrives outside I-5");
  const d7forest = ZONE_GATES.find((gate) => gate.id === "ron-north-d7");
  if (!d7forest?.arrive || d7forest.to !== "sandoria-north") throw new Error("second I-5 gate");
  if (squareOf(ronGrid, d7forest.x, d7forest.z) !== "I-5") throw new Error("second forest mouth");
  if (zoneTouch(SAN_NORTH.x, SAN_NORTH.z)?.id !== "ron-north") throw new Error("C-8 still owns the north mouth");
  if (!inNorthCity(d7forest.arrive.x, d7forest.arrive.z, 0.3) || zoneTouch(d7forest.arrive.x, d7forest.arrive.z)) throw new Error("D-7 city stand");
  if (squareOf(northGrid, d7forest.arrive.x, d7forest.arrive.z) !== "D-7") throw new Error("D-7 city square");
  const toPort = zoneTouch(SAN_SPOT.northPort.x, SAN_SPOT.northPort.z);
  if (!toPort || toPort.to !== "sandoria-port" || !toPort.arrive) throw new Error("port gate");
  if (!inPort(toPort.arrive.x, toPort.arrive.z, 0.3) || zoneTouch(toPort.arrive.x, toPort.arrive.z)) throw new Error("port arrival");
  const fromPort = zoneTouch(SAN_SPOT.portNorth.x, SAN_SPOT.portNorth.z);
  if (!fromPort || fromPort.to !== "sandoria-north" || !fromPort.arrive) throw new Error("port return");
  if (!inNorthCity(fromPort.arrive.x, fromPort.arrive.z, 0.3) || zoneTouch(fromPort.arrive.x, fromPort.arrive.z)) throw new Error("return from the port");
  if (zoneTouch(SAN_SPOT.northChateau.x, SAN_SPOT.northChateau.z)?.name !== "Chateau d'Oraguille") throw new Error("chateau");
  if (zoneTouch(SAN_SPOT.northLanding.x, SAN_SPOT.northLanding.z)?.name !== "Carpenters' Landing") throw new Error("landing");
  if (!inPort(FISHER.x, FISHER.z, 0.2)) throw new Error("fisher");
  if (!inPort(JOULET.x, JOULET.z, 0.2)) throw new Error("joulet");
  const cast = fishCast(FISHER.x, FISHER.z);
  if (!cast || cast.yaw !== 0 || cast.z >= PORT_PIER.minZ) throw new Error("pier cast");
  if (fishCast(FISHER.x, (PORT_PIER.minZ + PORT_PIER.maxZ) / 2) || fishCast(FISHER.x + 20, FISHER.z)) throw new Error("not at the water");
  if (inWorld(SAN_SPOT.portPier.x + 24, SAN_SPOT.portPier.z - 20)) throw new Error("harbor water");
  if (!inPort(FISHER.x, FISHER.z, 0.2)) throw new Error("pier");
  if (inPort(SAN_SPOT.portPier.x, SAN_SPOT.portPier.z - 28, 0.2)) throw new Error("past the pier");
  if (inWorld(12, -80)) throw new Error("the districts do not touch");
  if (regionName(0, -48) !== "Southern San d'Oria") throw new Error("south street name");
  if (regionName(0, -488) !== "Northern San d'Oria") throw new Error("north name");
  if (regionName(FISHER.x, FISHER.z) !== "Port San d'Oria") throw new Error("port name");
  if (FISHER.z < PLACE_MIN_Z || PORT_PIER.minZ < PLACE_MIN_Z) throw new Error("place box misses the port");
  assertGhelsba();
  const intoGhelsba = zoneTouch(EXITS.ghelsba.x, EXITS.ghelsba.z);
  if (!intoGhelsba || intoGhelsba.id !== "ron-ghelsba" || intoGhelsba.to !== "ghelsba" || !intoGhelsba.arrive) throw new Error("ghelsba gate is shut");
  if (!inOrc(intoGhelsba.arrive.x, intoGhelsba.arrive.z, 0.36) || zoneTouch(intoGhelsba.arrive.x, intoGhelsba.arrive.z)) throw new Error("ghelsba arrival");
  if (regionName(intoGhelsba.arrive.x, intoGhelsba.arrive.z) !== "Ghelsba Outpost") throw new Error("ghelsba name");
  const backToRon = ZONE_GATES.find((gate) => gate.id === "ghelsba-ron");
  if (!backToRon?.arrive || backToRon.to !== "ronfaure-south") throw new Error("ghelsba return gate");
  if (!inRonfaure(backToRon.arrive.x, backToRon.arrive.z, 0.36) || zoneTouch(backToRon.arrive.x, backToRon.arrive.z)) throw new Error("ghelsba return stand");
  if (Math.hypot(backToRon.arrive.x - EXITS.ghelsba.x, backToRon.arrive.z - (EXITS.ghelsba.z + 14)) > 0.05) throw new Error("ghelsba return is not south of the mouth");
  const citySide = zoneArrival("ronfaure-south");
  if (Math.hypot(backToRon.arrive.x - citySide.x, backToRon.arrive.z - citySide.z) < 40) throw new Error("ghelsba return used the city bridge");
  for (const zone of ORC_ZONES) {
    for (const rect of zone.rects) {
      if (rect.minX < PLACE_MIN_X || rect.maxX > PLACE_MAX_X || rect.minZ < PLACE_MIN_Z || rect.maxZ > PLACE_MAX_Z) throw new Error(`${zone.id} leaves the place box`);
      const cx = (rect.minX + rect.maxX) / 2;
      const cz = (rect.minZ + rect.maxZ) / 2;
      if (inRonfaure(cx, cz) || inSouthCity(cx, cz) || inNorthCity(cx, cz) || inPort(cx, cz) || inEast(cx, cz)) throw new Error(`${zone.id} overlaps a town`);
    }
  }
  if (inOrc(EXITS.ghelsba.x, EXITS.ghelsba.z) || inOrc(EXITS.theine.x, EXITS.theine.z)) throw new Error("a ronfaure mouth sits in an orc zone");
  const zoneHeart = (id: string) => {
    const zone = ORC_ZONES.find((row) => row.id === id);
    const rect = zone?.rects[0];
    if (!rect) throw new Error(id);
    return { x: (rect.minX + rect.maxX) / 2, z: (rect.minZ + rect.maxZ) / 2 };
  };
  const fortHeart = zoneHeart("fort-ghelsba");
  const grottoHeart = zoneHeart("yughott");
  const peakHeart = zoneHeart("horlais");
  if (regionName(fortHeart.x, fortHeart.z) !== "Fort Ghelsba") throw new Error("fort name");
  if (regionName(grottoHeart.x, grottoHeart.z) !== "Yughott Grotto") throw new Error("grotto name");
  if (regionName(peakHeart.x, peakHeart.z) !== "Horlais Peak") throw new Error("peak name");
  const blocksStreet = (house: CityBlock, streets: readonly CityRect[]) => {
    const box = { minX: house.x - house.w / 2, maxX: house.x + house.w / 2, minZ: house.z - house.d / 2, maxZ: house.z + house.d / 2 };
    return streets.some((street) => box.minX < street.maxX - 0.5 && box.maxX > street.minX + 0.5 && box.minZ < street.maxZ - 0.5 && box.maxZ > street.minZ + 0.5);
  };
  const northStreets = [NORTH_AVENUE, NORTH_WATCH, NORTH_POSTERN, NORTH_HARBOR, NORTH_LINK, NORTH_LANE];
  for (const house of NORTH_HOUSES) {
    if (blocksStreet(house, northStreets)) throw new Error(`north house ${house.x},${house.z} blocks a street`);
    if (house.x + house.w / 2 > CHATEAU_FOOT.minX && house.x - house.w / 2 < CHATEAU_FOOT.maxX && house.z + house.d / 2 > CHATEAU_FOOT.minZ && house.z - house.d / 2 < CHATEAU_FOOT.maxZ) {
      throw new Error("north house covers the chateau");
    }
  }
  for (const house of PORT_HOUSES) if (blocksStreet(house, [PORT_QUAY, PORT_PIER])) throw new Error(`port house ${house.x},${house.z} blocks the quay`);
  const on = (box: CityRect, x: number, z: number) => x >= box.minX && x <= box.maxX && z >= box.minZ && z <= box.maxZ;
  if (!on(NORTH_AVENUE, SAN_SPOT.northSouth.x, SAN_SPOT.northSouth.z) || !on(NORTH_AVENUE, SAN_SPOT.northSouth.x, SAN_SPOT.northSouth.z - 10)) {
    throw new Error("avenue misses the south gate");
  }
  if (!on(NORTH_WATCH, SAN_SPOT.northWest.x, SAN_SPOT.northWest.z) || !on(NORTH_WATCH, SAN_SPOT.northWest.x + 10, SAN_SPOT.northWest.z)) {
    throw new Error("watch road misses the west gate");
  }
  if (!on(NORTH_POSTERN, SAN_SPOT.northD7.x, SAN_SPOT.northD7.z) || !on(NORTH_POSTERN, SAN_SPOT.northD7.x + 10, SAN_SPOT.northD7.z)) {
    throw new Error("postern misses the D-7 gate");
  }
  if (!on(NORTH_HARBOR, SAN_SPOT.northPort.x, SAN_SPOT.northPort.z) || !on(NORTH_HARBOR, SAN_SPOT.northPort.x, SAN_SPOT.northPort.z + 10)) {
    throw new Error("harbor road misses the port gate");
  }
  if (!on(NORTH_LINK, SAN_SPOT.northLanding.x, SAN_SPOT.northLanding.z) || !on(NORTH_LINK, SAN_SPOT.northLanding.x, SAN_SPOT.northLanding.z + 10)) {
    throw new Error("link misses the landing");
  }
  if (!on(NORTH_LANE, SAN_SPOT.northChateau.x, SAN_SPOT.northChateau.z)) throw new Error("lane misses the chateau door");
  if (!on(PORT_QUAY, SAN_SPOT.portNorth.x, SAN_SPOT.portNorth.z) || !on(PORT_QUAY, FISHER.x, FISHER.z)) throw new Error("quay misses the dock");
  if (on(CHATEAU_FOOT, SAN_SPOT.northChateau.x, SAN_SPOT.northChateau.z)) throw new Error("chateau covers its own door");
  assertSanGraph();
  assertWorldLinks();
  assertWorldLinks(false);
}

export function assertWestGrid(): void {
  const south = ZONE_GRIDS.find((g) => g.zone === "ronfaure-south");
  const north = ZONE_GRIDS.find((g) => g.zone === "ronfaure-north");
  if (!south || !north) throw new Error("west grid");
  if (south.x0 !== RON_X0 || south.z0 !== RON_Z0 || south.cell !== RON_CELL || south.cols !== 12 || south.rows !== 12) throw new Error("west grid");
  if (north.x0 !== south.x0 || north.z0 !== south.z0 || north.cell !== south.cell || north.cols !== south.cols || north.rows !== south.rows) {
    throw new Error("north grid");
  }
  if (squareOf(south, RON_MARKS.southGate.x, RON_MARKS.southGate.z) !== "I-6") throw new Error("I-6");
  if (squareOf(south, RON_MARKS.northGate.x, RON_MARKS.northGate.z) !== "I-5") throw new Error("I-5");
  const c7 = squareCenter(south, "C-7");
  if (!c7 || squareOf(south, c7.x, c7.z) !== "C-7") throw new Error("C-7");
  const back = squareCenter(south, "I-6");
  if (!back || Math.abs(back.x - RON_MARKS.southGate.x) > 0.01 || Math.abs(back.z - RON_MARKS.southGate.z) > 0.01) throw new Error("I-6 center");
}
