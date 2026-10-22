/**
 * Beaucedine Glacier. Outdoor snow on the far side of Ranguemont Pass.
 * Column 0 is A, row 0 is 1, each cell 48 yalms, north is -Z.
 * The atlas, not a second enemy list:
 *   Ranguemont Pass comes in at E-11 and leaves the same way.
 *   Batallia Downs is the cut-off pocket at H-11. No path reaches it.
 *   Xarcabard is the north lip at F-6. Fei'Yin is the cave at J-4.
 *   Six Pso'Xja towers stand at F-7, G-9, H-8, H-10, I-7, and J-8.
 *   Trail markings for Dynamis sit at F-11. The outpost flag is H-9.
 *   Sea of Shu'Meyo is the water under the east cliff at K-8.
 * Nothing here hunts. The other zone lines stay shut.
 */

export const GLACIER_CELL = 48;
/** West edge of column A. E-11 starts just east of the pass mouth. */
export const GLACIER_X = 400;
export const GLACIER_Z = -854;

export type GlacierRect = { minX: number; maxX: number; minZ: number; maxZ: number };

export type GlacierGate = {
  id: string;
  name: string;
  x: number;
  z: number;
  hx: number;
  hz: number;
  to: "ranguemont" | "closed";
  side: "n" | "s" | "e" | "w";
  arrive?: { x: number; z: number; yaw: number; log: string };
  retreat?: { x: number; z: number };
};

type Add = (color: number, w: number, h: number, d: number, x: number, y: number, z: number) => void;
type Solid = { minX: number; maxX: number; minZ: number; maxZ: number };

function span(c0: number, r0: number, c1: number, r1: number): GlacierRect {
  return {
    minX: GLACIER_X + Math.min(c0, c1) * GLACIER_CELL,
    maxX: GLACIER_X + Math.max(c0, c1) * GLACIER_CELL,
    minZ: GLACIER_Z + Math.min(r0, r1) * GLACIER_CELL,
    maxZ: GLACIER_Z + Math.max(r0, r1) * GLACIER_CELL,
  };
}

function mid(rect: GlacierRect) {
  return { x: (rect.minX + rect.maxX) / 2, z: (rect.minZ + rect.maxZ) / 2 };
}

function at(c: number, r: number) {
  return { x: GLACIER_X + c * GLACIER_CELL, z: GLACIER_Z + r * GLACIER_CELL };
}

const e11 = span(4.08, 10.12, 5.22, 10.88);
const f11 = span(4.95, 10.15, 5.92, 10.88);
const e10 = span(4.15, 9.22, 4.88, 10.42);
const f10 = span(4.55, 9.12, 5.85, 10.45);
const g10 = span(5.55, 9.08, 6.85, 10.05);
const g9 = span(5.55, 8.08, 6.92, 9.48);
const h9 = span(6.55, 8.08, 7.92, 9.55);
const h10 = span(6.72, 9.22, 7.78, 10.12);
const h11 = span(6.85, 10.35, 7.65, 10.92);
const f9 = span(4.55, 8.08, 5.72, 9.42);
const f8 = span(4.48, 7.08, 5.62, 8.42);
const f7 = span(4.42, 6.08, 5.78, 7.42);
const f6 = span(4.38, 5.02, 5.85, 6.42);
const g7 = span(5.42, 6.22, 6.55, 7.38);
const g6 = span(5.55, 5.08, 6.78, 6.55);
const g8 = span(5.35, 7.05, 6.88, 8.42);
const h8 = span(6.52, 7.08, 7.88, 8.42);
const i8 = span(7.55, 7.15, 8.62, 8.28);
const i7 = span(7.52, 6.08, 8.92, 7.48);
const j7 = span(8.58, 6.08, 9.78, 7.42);
const j8 = span(8.58, 6.92, 10.12, 8.22);
const k8 = span(9.78, 7.12, 10.72, 8.22);
const i6 = span(7.55, 5.08, 8.58, 6.42);
const i5 = span(7.55, 4.08, 8.78, 5.42);
const j5 = span(8.42, 3.78, 9.62, 5.22);
const j4 = span(8.62, 3.02, 9.78, 4.22);

const ROOMS: GlacierRect[] = [
  e11, f11, e10, f10, g10, g9, h9, h10, h11, f9, f8, f7, f6, g7, g6, g8, h8, i8, i7, j7, j8, k8, i6, i5, j5, j4,
];

function col(c: number) {
  return GLACIER_X + c * GLACIER_CELL;
}
function row(r: number) {
  return GLACIER_Z + r * GLACIER_CELL;
}

const pondG10: GlacierRect = { minX: col(6.05), maxX: col(6.48), minZ: row(9.32), maxZ: row(9.72) };
const pondH9: GlacierRect = { minX: col(7.28), maxX: col(7.68), minZ: row(8.55), maxZ: row(8.92) };
const pondJ7: GlacierRect = { minX: col(9.08), maxX: col(9.5), minZ: row(6.38), maxZ: row(6.82) };
const sea: GlacierRect = { minX: k8.maxX + 1.2, maxX: k8.maxX + 22, minZ: k8.minZ - 6, maxZ: k8.maxZ + 10 };
const WATERS: GlacierRect[] = [pondG10, pondH9, pondJ7, sea];

const entrance = at(4.55, 10.5);
export const GLACIER_ARRIVE = { ...entrance, yaw: -Math.PI / 2, log: "Beaucedine Glacier." };

const passGate = { x: e11.minX + 2.4, z: entrance.z };

export const GLACIER_NPCS = [
  { id: "gueriette", name: "Gueriette", ...at(7.15, 8.35), line: "Gueriette: Outpost vendor. Xarcabard is north. Fei'Yin is the northeast cave. Both are shut." },
  { id: "parledaire", name: "Parledaire", ...at(7.15, 8.68), line: "Parledaire: San d'Oria keeps this flag. The crevasses are not a road." },
  { id: "akane", name: "Akane", ...at(7.48, 8.35), line: "Akane: Bastok's guard. The snow does not cancel the watch." },
  { id: "ryunchi", name: "Ryunchi-Pauchi", ...at(7.55, 8.22), line: "Ryunchi-Pauchi: Windurst stands by the flag. Falling in a crevasse is the end of the trip." },
  { id: "leaufetie", name: "Leaufetie", ...at(6.15, 5.42), line: "Leaufetie: Outland guard. The north gate is Xarcabard, and it is shut." },
  { id: "rattling", name: "Rattling Rain", ...at(6.4, 5.78), line: "Rattling Rain: Bastok watches the road to Valdeaunia." },
  { id: "chopapa", name: "Chopapa", ...at(6.48, 5.38), line: "Chopapa: The wind off the north cliff cuts. Stay on the ice." },
  { id: "torino", name: "Torino-Samarino", ...at(8.12, 6.58), line: "Torino-Samarino: These towers are older than the outpost. Every door is Pso'Xja, and every door is shut." },
  { id: "leigon", name: "Leigon-Moigon", ...at(8.4, 6.92), line: "Leigon-Moigon: If the snow turns you around, the outpost flag is south." },
  { id: "grenadier", name: "Goblin Grenadier", kind: "goblin" as const, ...at(7.18, 7.58), line: "Goblin Grenadier: No boom today. The mission powder stays in the pack." },
];

const TOWERS = [
  { name: "F-7", ...at(5.15, 6.42) },
  { name: "G-9", ...at(6.15, 8.55) },
  { name: "H-8", ...at(7.48, 7.48) },
  { name: "H-10", ...at(7.28, 9.7) },
  { name: "I-7", ...at(8.58, 6.4) },
  { name: "J-8", ...at(9.45, 7.48) },
];

const BOOKS = [at(5.35, 6.72), at(7.05, 8.88), at(8.08, 6.72), at(9.12, 7.42)];

function edgeGate(room: GlacierRect, side: "n" | "s" | "e" | "w", name: string, id: string): GlacierGate {
  const along = side === "n" || side === "s" ? (room.minX + room.maxX) / 2 : (room.minZ + room.maxZ) / 2;
  const edge = side === "n" ? room.minZ : side === "s" ? room.maxZ : side === "w" ? room.minX : room.maxX;
  const inward = side === "n" ? 1 : side === "s" ? -1 : side === "w" ? 1 : -1;
  const x = side === "n" || side === "s" ? along : edge + inward * 2.3;
  const z = side === "e" || side === "w" ? along : edge + inward * 2.3;
  const retreat = {
    x: side === "e" || side === "w" ? x + inward * 6 : x,
    z: side === "n" || side === "s" ? z + inward * 6 : z,
  };
  return {
    id,
    name,
    x,
    z,
    hx: side === "n" || side === "s" ? 5.2 : 2.6,
    hz: side === "n" || side === "s" ? 2.6 : 5.2,
    to: "closed",
    side,
    retreat,
  };
}

function towerDoor(id: string, x: number, z: number, retreat: { x: number; z: number }): GlacierGate {
  return {
    id,
    name: "Pso'Xja",
    x,
    z,
    hx: 1.7,
    hz: 1.7,
    to: "closed",
    side: "n",
    retreat,
  };
}

export const GLACIER_GATES: readonly GlacierGate[] = [
  {
    id: "glacier-pass",
    name: "Ranguemont Pass",
    x: passGate.x,
    z: passGate.z,
    hx: 2.5,
    hz: 5.4,
    to: "ranguemont",
    side: "w",
  },
  edgeGate(f6, "n", "Xarcabard", "glacier-xarcabard"),
  edgeGate(j4, "n", "Fei'Yin", "glacier-feiyin"),
  edgeGate(h11, "s", "Batallia Downs", "glacier-batallia"),
  edgeGate(f11, "s", "Dynamis - Beaucedine", "glacier-dynamis"),
  towerDoor("glacier-pso-f7", at(5.15, 6.72).x, at(5.15, 6.72).z, at(5.35, 6.95)),
  towerDoor("glacier-pso-g9", at(6.15, 8.82).x, at(6.15, 8.82).z, at(6.4, 8.95)),
  towerDoor("glacier-pso-h8", at(7.48, 7.78).x, at(7.48, 7.78).z, at(7.15, 7.85)),
  towerDoor("glacier-pso-h10", at(7.28, 9.95).x, at(7.28, 9.95).z, at(7.05, 9.7)),
  towerDoor("glacier-pso-i7", at(8.58, 6.72).x, at(8.58, 6.72).z, at(8.25, 6.85)),
  towerDoor("glacier-pso-j8", at(9.45, 7.78).x, at(9.45, 7.78).z, at(9.15, 7.85)),
];

export const GLACIER_PLACES = [
  { name: "Outpost", ...at(7.32, 8.42) },
  { name: "Goblin Footprint", ...at(4.32, 10.42) },
  { name: "Sea of Shu'Meyo", x: (sea.minX + sea.maxX) / 2, z: (sea.minZ + sea.maxZ) / 2 },
];

function hit(x: number, z: number, radius: number): boolean {
  return ROOMS.some((rect) => x >= rect.minX + radius && x <= rect.maxX - radius && z >= rect.minZ + radius && z <= rect.maxZ - radius);
}

export function glacierWet(x: number, z: number): boolean {
  return WATERS.some((rect) => x >= rect.minX && x <= rect.maxX && z >= rect.minZ && z <= rect.maxZ);
}

export function inGlacier(x: number, z: number, radius = 0): boolean {
  return hit(x, z, Math.max(0, radius));
}

function rectDist(x: number, z: number, rect: GlacierRect): number {
  const cx = Math.max(rect.minX, Math.min(rect.maxX, x));
  const cz = Math.max(rect.minZ, Math.min(rect.maxZ, z));
  return Math.hypot(x - cx, z - cz);
}

export function clampGlacier(x: number, z: number, radius = 0): { x: number; z: number } | null {
  const r = Math.max(0, radius);
  let best: GlacierRect | null = null;
  let bestD = Infinity;
  for (const rect of ROOMS) {
    const dist = rectDist(x, z, rect);
    if (dist < bestD) {
      bestD = dist;
      best = rect;
    }
  }
  if (!best || bestD > 36) return null;
  const insetX = Math.min(r, Math.max(0, (best.maxX - best.minX) / 2 - 0.05));
  const insetZ = Math.min(r, Math.max(0, (best.maxZ - best.minZ) / 2 - 0.05));
  return {
    x: Math.max(best.minX + insetX, Math.min(best.maxX - insetX, x)),
    z: Math.max(best.minZ + insetZ, Math.min(best.maxZ - insetZ, z)),
  };
}

export function glacierSquare(x: number, z: number): string {
  const col = Math.floor((x - GLACIER_X) / GLACIER_CELL);
  const row = Math.floor((z - GLACIER_Z) / GLACIER_CELL);
  const letter = "ABCDEFGHIJKLMNO"[col] ?? "?";
  return `${letter}-${row + 1}`;
}

export function glacierChart(_x: number, _z: number) {
  let minX = Infinity;
  let maxX = -Infinity;
  let minZ = Infinity;
  let maxZ = -Infinity;
  for (const rect of ROOMS) {
    minX = Math.min(minX, rect.minX);
    maxX = Math.max(maxX, rect.maxX);
    minZ = Math.min(minZ, rect.minZ);
    maxZ = Math.max(maxZ, rect.maxZ);
  }
  const pad = 28;
  const marks = [
    ...GLACIER_GATES.map((gate) => ({ x: gate.x, z: gate.z, name: gate.name })),
    ...GLACIER_PLACES,
  ];
  return {
    rects: ROOMS,
    water: WATERS,
    bounds: { minX: minX - pad, maxX: Math.max(maxX, sea.maxX) + pad, minZ: minZ - pad, maxZ: maxZ + pad },
    marks,
    grid: { x0: GLACIER_X, z0: GLACIER_Z, cell: GLACIER_CELL },
  };
}

function opening(a: GlacierRect, b: GlacierRect): number {
  const w = Math.min(a.maxX, b.maxX) - Math.max(a.minX, b.minX);
  const d = Math.min(a.maxZ, b.maxZ) - Math.max(a.minZ, b.minZ);
  if (w < 7 || d < 7) return 0;
  return Math.min(w, d);
}

function floodFrom(start: GlacierRect): Set<GlacierRect> {
  const seen = new Set<GlacierRect>([start]);
  const queue = [start];
  while (queue.length) {
    const cur = queue.pop();
    if (!cur) break;
    for (const next of ROOMS) {
      if (seen.has(next) || opening(cur, next) < 7) continue;
      seen.add(next);
      queue.push(next);
    }
  }
  return seen;
}

function overlaps(a: GlacierRect, b: GlacierRect): boolean {
  return a.minX < b.maxX - 0.15 && a.maxX > b.minX + 0.15 && a.minZ < b.maxZ - 0.15 && a.maxZ > b.minZ + 0.15;
}

function onGate(gate: GlacierGate, x: number, z: number): boolean {
  return Math.abs(x - gate.x) <= gate.hx && Math.abs(z - gate.z) <= gate.hz;
}

export function assertGlacier(): void {
  if (GLACIER_CELL !== 48) throw new Error("glacier cell");
  const squareOf = (rect: GlacierRect) => glacierSquare(mid(rect).x, mid(rect).z);
  const expect: [GlacierRect, string][] = [
    [e11, "E-11"],
    [f11, "F-11"],
    [f10, "F-10"],
    [g10, "G-10"],
    [g9, "G-9"],
    [h9, "H-9"],
    [h10, "H-10"],
    [h11, "H-11"],
    [f9, "F-9"],
    [f8, "F-8"],
    [f7, "F-7"],
    [f6, "F-6"],
    [g6, "G-6"],
    [h8, "H-8"],
    [i8, "I-8"],
    [i7, "I-7"],
    [j7, "J-7"],
    [j8, "J-8"],
    [k8, "K-8"],
    [i6, "I-6"],
    [i5, "I-5"],
    [j5, "J-5"],
    [j4, "J-4"],
  ];
  for (const [rect, name] of expect) {
    const got = squareOf(rect);
    if (got !== name) throw new Error(`${name} is ${got}`);
  }
  if (glacierSquare(GLACIER_ARRIVE.x, GLACIER_ARRIVE.z) !== "E-11") throw new Error("arrival square");
  if (!inGlacier(GLACIER_ARRIVE.x, GLACIER_ARRIVE.z, 0.36)) throw new Error("arrival stand");
  if (glacierWet(GLACIER_ARRIVE.x, GLACIER_ARRIVE.z)) throw new Error("arrival is water");
  const main = floodFrom(e11);
  if (!main.has(j4) || !main.has(f6) || !main.has(k8) || !main.has(h10)) throw new Error("glacier road is split");
  if (main.has(h11)) throw new Error("batallia pocket joins the glacier");
  const pocket = floodFrom(h11);
  if (pocket.size !== 1) throw new Error("batallia pocket is not alone");
  for (const rect of ROOMS) {
    if (rect.maxX - rect.minX < 8 || rect.maxZ - rect.minZ < 8) throw new Error("glacier neck is too tight");
  }
  for (const water of WATERS) {
    if (water === sea) {
      if (ROOMS.some((rect) => overlaps(rect, sea))) throw new Error("the sea floods a path");
      continue;
    }
    if (!ROOMS.some((rect) => overlaps(rect, water))) throw new Error("a pond left its plaza");
  }
  if (glacierSquare(pondG10.minX + 1, pondG10.minZ + 1) !== "G-10") throw new Error("g-10 pond");
  if (glacierSquare((pondH9.minX + pondH9.maxX) / 2, (pondH9.minZ + pondH9.maxZ) / 2) !== "H-9") throw new Error("outpost pond");
  if (glacierSquare((pondJ7.minX + pondJ7.maxX) / 2, (pondJ7.minZ + pondJ7.maxZ) / 2) !== "J-7") throw new Error("j-7 pond");
  const pass = GLACIER_GATES[0];
  if (pass.to !== "ranguemont" || !inGlacier(pass.x, pass.z, 0)) throw new Error("pass mouth");
  if (onGate(pass, GLACIER_ARRIVE.x, GLACIER_ARRIVE.z)) throw new Error("arrival stands on the pass gate");
  const open = ["Xarcabard", "Fei'Yin", "Batallia Downs", "Dynamis - Beaucedine"];
  for (const name of open) {
    const gates = GLACIER_GATES.filter((gate) => gate.name === name);
    if (gates.length !== 1 || gates[0].to !== "closed" || !gates[0].retreat) throw new Error(`${name} gate`);
  }
  const towers = GLACIER_GATES.filter((gate) => gate.name === "Pso'Xja");
  if (towers.length !== 6) throw new Error("pso'xja doors");
  for (const gate of GLACIER_GATES) {
    if (!inGlacier(gate.x, gate.z, 0)) throw new Error(`${gate.id} left the ice`);
    if (gate.retreat) {
      if (!inGlacier(gate.retreat.x, gate.retreat.z, 0.36)) throw new Error(`${gate.id} retreat`);
      if (onGate(gate, gate.retreat.x, gate.retreat.z)) throw new Error(`${gate.id} retreat stands on the gate`);
      if (glacierWet(gate.retreat.x, gate.retreat.z)) throw new Error(`${gate.id} retreat is water`);
    }
  }
  for (const npc of GLACIER_NPCS) {
    if (!inGlacier(npc.x, npc.z, 0.4) || glacierWet(npc.x, npc.z)) throw new Error(`${npc.id} has no footing`);
    if (GLACIER_GATES.some((gate) => onGate(gate, npc.x, npc.z))) throw new Error(`${npc.id} stands on a gate`);
  }
  if (glacierSquare(GLACIER_NPCS[0].x, GLACIER_NPCS[0].z) !== "H-9") throw new Error("gueriette square");
  if (glacierSquare(GLACIER_NPCS[4].x, GLACIER_NPCS[4].z) !== "G-6") throw new Error("leaufetie square");
  if (glacierSquare(GLACIER_NPCS[7].x, GLACIER_NPCS[7].z) !== "I-7") throw new Error("torino square");
  if (glacierSquare(GLACIER_NPCS[9].x, GLACIER_NPCS[9].z) !== "H-8") throw new Error("grenadier square");
  if (glacierSquare(GLACIER_PLACES[0].x, GLACIER_PLACES[0].z) !== "H-9") throw new Error("outpost square");
  if (glacierSquare(GLACIER_PLACES[1].x, GLACIER_PLACES[1].z) !== "E-11") throw new Error("footprint square");
  for (const book of BOOKS) {
    if (!inGlacier(book.x, book.z, 0.3) || glacierWet(book.x, book.z)) throw new Error("field manual slipped");
  }
  const bookSquares = BOOKS.map((book) => glacierSquare(book.x, book.z));
  for (const square of ["F-7", "H-9", "I-7", "J-8"]) {
    if (!bookSquares.includes(square)) throw new Error(`manual missing ${square}`);
  }
  for (const tower of TOWERS) {
    if (glacierSquare(tower.x, tower.z) !== tower.name) throw new Error(`tower ${tower.name} is ${glacierSquare(tower.x, tower.z)}`);
  }
}

function floorSlab(add: Add, rect: GlacierRect, color: number, y = -0.08) {
  add(color, rect.maxX - rect.minX, 0.18, rect.maxZ - rect.minZ, (rect.minX + rect.maxX) / 2, y, (rect.minZ + rect.maxZ) / 2);
}

function mergeSpans(spans: [number, number][]): [number, number][] {
  if (!spans.length) return [];
  const sorted = spans.slice().sort((a, b) => a[0] - b[0]);
  const out: [number, number][] = [[sorted[0][0], sorted[0][1]]];
  for (let i = 1; i < sorted.length; i++) {
    const last = out[out.length - 1];
    if (sorted[i][0] <= last[1] + 0.4) last[1] = Math.max(last[1], sorted[i][1]);
    else out.push([sorted[i][0], sorted[i][1]]);
  }
  return out;
}

function cutSpans(full: [number, number], cuts: [number, number][]): [number, number][] {
  let open: [number, number][] = [full];
  for (const [c0, c1] of cuts) {
    const next: [number, number][] = [];
    for (const [a, b] of open) {
      if (c1 <= a + 0.05 || c0 >= b - 0.05) {
        next.push([a, b]);
        continue;
      }
      if (c0 > a + 0.7) next.push([a, c0]);
      if (c1 < b - 0.7) next.push([c1, b]);
    }
    open = next;
  }
  return open;
}

function iceWalls(add: Add, colliders: Solid[], rects: GlacierRect[], gates: readonly GlacierGate[]) {
  const ice = 0xb7c9d6;
  const shade = 0x7f97ab;
  const tall = 7.6;
  const thick = 2.4;
  const sides = ["n", "s", "e", "w"] as const;
  for (const rect of rects) {
    for (const side of sides) {
      const horizontal = side === "n" || side === "s";
      const edge = side === "n" ? rect.minZ : side === "s" ? rect.maxZ : side === "w" ? rect.minX : rect.maxX;
      const full: [number, number] = horizontal ? [rect.minX, rect.maxX] : [rect.minZ, rect.maxZ];
      const covered: [number, number][] = [];
      for (const other of rects) {
        if (other === rect) continue;
        let near = false;
        if (side === "n") near = other.minZ < edge - 0.15 && other.maxZ > edge - 0.25;
        else if (side === "s") near = other.maxZ > edge + 0.15 && other.minZ < edge + 0.25;
        else if (side === "w") near = other.minX < edge - 0.15 && other.maxX > edge - 0.25;
        else near = other.minX < edge + 0.25 && other.maxX > edge + 0.15;
        if (!near) continue;
        const a = Math.max(full[0], horizontal ? other.minX : other.minZ);
        const b = Math.min(full[1], horizontal ? other.maxX : other.maxZ);
        if (b - a > 0.25) covered.push([a, b]);
      }
      const cuts = mergeSpans(covered);
      for (const gate of gates) {
        if (gate.side !== side) continue;
        const along = horizontal ? gate.x : gate.z;
        const across = horizontal ? Math.abs(gate.z - edge) : Math.abs(gate.x - edge);
        if (across > 4.6 || along < full[0] - 2 || along > full[1] + 2) continue;
        cuts.push([along - 4.4, along + 4.4]);
      }
      const outward = side === "n" || side === "w" ? -1 : 1;
      for (const piece of cutSpans(full, cuts)) {
        let a = piece[0];
        let b = piece[1];
        if (b - a < 1) continue;
        if (Math.abs(a - full[0]) < 0.35) a -= thick * 0.85;
        if (Math.abs(b - full[1]) < 0.35) b += thick * 0.85;
        const len = b - a;
        const midA = (a + b) / 2;
        const acrossC = edge + outward * (thick / 2);
        const cx = horizontal ? midA : acrossC;
        const cz = horizontal ? acrossC : midA;
        const w = horizontal ? len : thick;
        const d = horizontal ? thick : len;
        add(ice, w, tall, d, cx, tall / 2 - 0.2, cz);
        add(shade, horizontal ? len : thick + 0.3, 1.4, horizontal ? thick + 0.3 : len, cx, 0.5, cz);
        colliders.push({ minX: cx - w / 2, maxX: cx + w / 2, minZ: cz - d / 2, maxZ: cz + d / 2 });
      }
    }
  }
}

function tower(add: Add, colliders: Solid[], x: number, z: number) {
  const stone = 0xc8c2b4;
  add(stone, 4.2, 6.4, 4.2, x, 3.1, z);
  add(0x8a8478, 4.6, 0.35, 4.6, x, 6.4, z);
  add(0x7ec8ef, 1.1, 2.2, 1.1, x, 7.6, z);
  add(0xd7eaff, 0.45, 0.8, 0.45, x, 9.0, z);
  colliders.push({ minX: x - 2.3, maxX: x + 2.3, minZ: z - 2.3, maxZ: z + 2.3 });
}

function book(add: Add, x: number, z: number) {
  add(0xf3e6d0, 0.7, 0.16, 0.9, x, 0.22, z);
  add(0x3d4a32, 0.16, 0.22, 0.7, x, 0.3, z);
}

function flag(add: Add, colliders: Solid[], x: number, z: number) {
  add(0x6a5830, 0.28, 3.4, 0.28, x, 1.7, z);
  add(0x2f6dff, 1.5, 0.85, 0.12, x + 0.75, 2.85, z);
  add(0xe3c57a, 0.35, 0.22, 0.35, x, 3.45, z);
  colliders.push({ minX: x - 0.35, maxX: x + 0.35, minZ: z - 0.35, maxZ: z + 0.35 });
}

export function buildGlacier(add: Add, colliders: Solid[]): void {
  const chart = glacierChart(0, 0);
  add(0x16344c, chart.bounds.maxX - chart.bounds.minX, 0.4, chart.bounds.maxZ - chart.bounds.minZ, (chart.bounds.minX + chart.bounds.maxX) / 2, -2.3, (chart.bounds.minZ + chart.bounds.maxZ) / 2);
  const snow = 0xe4eef6;
  const drift = 0xd5e2ee;
  ROOMS.forEach((rect, i) => floorSlab(add, rect, i % 2 === 0 ? snow : drift));
  for (const water of WATERS) floorSlab(add, water, water === sea ? 0x2c6f9c : 0x7eb6d8, water === sea ? -0.85 : -0.02);
  for (const water of WATERS) {
    if (water === sea) continue;
    colliders.push({ minX: water.minX, maxX: water.maxX, minZ: water.minZ, maxZ: water.maxZ });
  }
  iceWalls(add, colliders, ROOMS, GLACIER_GATES);
  for (const spot of TOWERS) tower(add, colliders, spot.x, spot.z);
  for (const spot of BOOKS) book(add, spot.x, spot.z);
  flag(add, colliders, GLACIER_PLACES[0].x, GLACIER_PLACES[0].z);
  const print = GLACIER_PLACES[1];
  add(0x3d4a3a, 1.1, 0.06, 1.6, print.x, 0.04, print.z);
  add(0x2a3328, 0.7, 0.05, 0.9, print.x + 0.15, 0.08, print.z + 0.1);
  const bergs = [
    { x: sea.minX + 6, z: (sea.minZ + sea.maxZ) / 2 - 4 },
    { x: sea.minX + 12, z: (sea.minZ + sea.maxZ) / 2 + 3 },
    { x: sea.minX + 16, z: (sea.minZ + sea.maxZ) / 2 - 1 },
  ];
  for (const berg of bergs) add(0xd5e6f2, 2.4, 0.7, 1.6, berg.x, -0.35, berg.z);
  for (const [c, r] of [[4.7, 9.55], [5.35, 8.55], [6.35, 7.55], [8.15, 5.45], [9.05, 4.35]] as const) {
    const spike = at(c, r);
    if (!inGlacier(spike.x, spike.z, 0.2) || glacierWet(spike.x, spike.z)) continue;
    add(0xd7e4ef, 0.7, 2.8, 0.7, spike.x, 1.3, spike.z);
    colliders.push({ minX: spike.x - 0.45, maxX: spike.x + 0.45, minZ: spike.z - 0.45, maxZ: spike.z + 0.45 });
  }
}
