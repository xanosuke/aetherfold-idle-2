/**
 * Ghelsba Outpost and the three zones that open off it.
 * Retail grids: columns A–L are 0–11, rows 1–12 are 0–11, north is -Z.
 * Connections follow the retail maps, not a square dungeon:
 *   Ghelsba Outpost — West Ronfaure J-11, Fort Ghelsba H-8, Yughott Grotto H-11, Hut Door F-10
 *   Fort Ghelsba — Outpost E-8, Yughott G-9 / J-7 / J-8
 *   Yughott Grotto — Outpost E-9, Fort F-7 / H-7 / K-5, Horlais Peak J-9 / K-6
 *   Horlais Peak — the two grotto mouths, the hot spring, and the Burning Circle
 * The three dens are drawn larger than the first pass so a retail camp
 * fits in each lobe without standing on a gate. Horlais Peak is unchanged.
 */

export type Rect = { minX: number; maxX: number; minZ: number; maxZ: number };

export type OrcGate = {
  id: string;
  name: string;
  x: number;
  z: number;
  hx: number;
  hz: number;
  to: string;
  side: "n" | "s" | "e" | "w";
  arrive: { x: number; z: number; yaw: number; log: string };
};

const DEN = 2.05;
const u = (n: number) => n * DEN;
const CELL = u(32);

// Shifted apart so the larger dens do not meet each other or West Ronfaure.
const OUT_X = -1520;
const OUT_Z = 150;
const FORT_X = -1520;
const FORT_Z = 920;
const YUG_X = -1040;
const YUG_Z = 150;
const PEAK_X = -1720;
const PEAK_Z = -40;

function cell(ox: number, oz: number, col: number, row: number) {
  return { x: ox + (col + 0.5) * CELL, z: oz + (row + 0.5) * CELL };
}

function room(ox: number, oz: number, col: number, row: number, w: number, d: number, dx = 0, dz = 0): Rect {
  const c = cell(ox, oz, col, row);
  const W = u(w);
  const D = u(d);
  const DX = u(dx);
  const DZ = u(dz);
  return { minX: c.x + DX - W / 2, maxX: c.x + DX + W / 2, minZ: c.z + DZ - D / 2, maxZ: c.z + DZ + D / 2 };
}

function boxAt(cx: number, cz: number, w: number, d: number): Rect {
  return { minX: cx - w / 2, maxX: cx + w / 2, minZ: cz - d / 2, maxZ: cz + d / 2 };
}

function paths(a: Rect, b: Rect, width: number): Rect[] {
  const ac = mid(a);
  const bc = mid(b);
  const h = width / 2;
  const horiz: Rect = {
    minX: Math.min(ac.x, bc.x) - h,
    maxX: Math.max(ac.x, bc.x) + h,
    minZ: ac.z - h,
    maxZ: ac.z + h,
  };
  const vert: Rect = {
    minX: bc.x - h,
    maxX: bc.x + h,
    minZ: Math.min(ac.z, bc.z) - h,
    maxZ: Math.max(ac.z, bc.z) + h,
  };
  if (Math.abs(ac.z - bc.z) < 1) return [horiz];
  if (Math.abs(ac.x - bc.x) < 1) return [vert];
  return [horiz, vert];
}

function join(rooms: Rect[], links: readonly [Rect, Rect, number][]): Rect[] {
  const out = rooms.slice();
  for (const [a, b, width] of links) out.push(...paths(a, b, u(width)));
  return out;
}

// Close the seam across the whole shared span. A thin center bridge leaves plus-shaped holes.
function weld(rooms: Rect[], links: readonly [Rect, Rect, number][]): Rect[] {
  const out = rooms.slice();
  for (const [a, b, width] of links) {
    const x0 = Math.max(a.minX, b.minX);
    const x1 = Math.min(a.maxX, b.maxX);
    const z0 = Math.max(a.minZ, b.minZ);
    const z1 = Math.min(a.maxZ, b.maxZ);
    if (x1 - x0 > 0 && z1 - z0 > 0) continue;
    if (x1 - x0 >= u(6)) {
      const minZ = Math.min(a.maxZ, b.maxZ);
      const maxZ = Math.max(a.minZ, b.minZ);
      if (maxZ > minZ && maxZ - minZ <= u(28)) out.push({ minX: x0, maxX: x1, minZ, maxZ });
      else out.push(...paths(a, b, u(width)));
      continue;
    }
    if (z1 - z0 >= u(6)) {
      const minX = Math.min(a.maxX, b.maxX);
      const maxX = Math.max(a.minX, b.minX);
      if (maxX > minX && maxX - minX <= u(28)) out.push({ minX, maxX, minZ: z0, maxZ: z1 });
      else out.push(...paths(a, b, u(width)));
      continue;
    }
    out.push(...paths(a, b, u(width)));
  }
  return out;
}

function mid(rect: Rect) {
  return { x: (rect.minX + rect.maxX) / 2, z: (rect.minZ + rect.maxZ) / 2 };
}

function mouth(rect: Rect, side: OrcGate["side"], name: string, id: string, to: string, log: string, stand: { x: number; z: number }): OrcGate {
  const c = mid(rect);
  const at = {
    n: { x: c.x, z: rect.minZ + 2.6 },
    s: { x: c.x, z: rect.maxZ - 2.6 },
    w: { x: rect.minX + 2.6, z: c.z },
    e: { x: rect.maxX - 2.6, z: c.z },
  }[side];
  return {
    id,
    name,
    x: at.x,
    z: at.z,
    hx: side === "e" || side === "w" ? 2.4 : 5.2,
    hz: side === "n" || side === "s" ? 2.4 : 5.2,
    to,
    side,
    arrive: { x: stand.x, z: stand.z, yaw: 0, log },
  };
}

// Traced canyon, not a filled block. Cell centers the F&M sheet leaves white stay cliff.
// Short links only — a full-span weld fills the gaps and turns the lobes back into one mass.
const oF5 = room(OUT_X, OUT_Z, 5, 4, 12, 12, 8, 8);
const oG6 = room(OUT_X, OUT_Z, 6, 5, 26, 22);
const oH6 = room(OUT_X, OUT_Z, 7, 5, 24, 28, -3, -8);
const oI6 = room(OUT_X, OUT_Z, 8, 5, 22, 26, 4, -6);
const oJ6 = room(OUT_X, OUT_Z, 9, 5, 14, 22, -8, -10);
const oF7 = room(OUT_X, OUT_Z, 5, 6, 28, 26, 0, 2);
const oG7 = room(OUT_X, OUT_Z, 6, 6, 10, 10, -11, 11);
const oH7 = room(OUT_X, OUT_Z, 7, 6, 24, 20, 0, 3);
const oI7 = room(OUT_X, OUT_Z, 8, 6, 20, 18, 3, 0);
const oH8 = room(OUT_X, OUT_Z, 7, 7, 24, 20);
const oI8 = room(OUT_X, OUT_Z, 8, 7, 30, 18, 2, -3);
const oJ8 = room(OUT_X, OUT_Z, 9, 7, 12, 14, -10, -2);
const oF9 = room(OUT_X, OUT_Z, 5, 8, 12, 14, 7, -5);
const oG9 = room(OUT_X, OUT_Z, 6, 8, 24, 20, 0, 2);
const oH9 = room(OUT_X, OUT_Z, 7, 8, 12, 16, 8, -6);
const oI9 = room(OUT_X, OUT_Z, 8, 8, 22, 12, 0, -9);
const oJ9 = room(OUT_X, OUT_Z, 9, 8, 12, 12, -8, 7);
const oK9 = room(OUT_X, OUT_Z, 10, 8, 10, 10, -8, 4);
const oF10 = room(OUT_X, OUT_Z, 5, 9, 22, 18, 0, -3);
const oG10 = room(OUT_X, OUT_Z, 6, 9, 22, 20);
const oH10 = room(OUT_X, OUT_Z, 7, 9, 24, 20);
const oI10 = room(OUT_X, OUT_Z, 8, 9, 14, 18, -9, 0);
const oH11 = room(OUT_X, OUT_Z, 7, 10, 26, 14, -2, -9);
const oI11 = room(OUT_X, OUT_Z, 8, 10, 24, 14, 6, -9);
const oJ11 = room(OUT_X, OUT_Z, 9, 10, 16, 30, -6, 6);
// South lip of the pond loop, then a short drop into the north bowl. Not a path through the pool.
const pondWalk: Rect = { minX: oF5.minX + u(0.8), maxX: mid(oG6).x + u(5), minZ: oF5.maxZ - u(3.2), maxZ: oF5.maxZ + u(0.4) };
const pondDrop: Rect = { minX: mid(oG6).x - u(5), maxX: mid(oG6).x + u(5), minZ: oF5.maxZ - u(2.4), maxZ: oG6.minZ + u(3) };

const OUT_ROOMS: Rect[] = join(
  [oF5, pondWalk, pondDrop, oG6, oH6, oI6, oJ6, oF7, oG7, oH7, oI7, oH8, oI8, oJ8, oF9, oG9, oH9, oI9, oJ9, oK9, oF10, oG10, oH10, oI10, oH11, oI11, oJ11],
  [
    [oG6, oH6, 12],
    [oH6, oI6, 12],
    [oI6, oJ6, 9],
    [oG6, oG7, 8],
    [oH6, oH7, 12],
    [oI6, oI7, 10],
    [oF7, oG7, 10],
    [oG7, oH7, 9],
    [oH7, oI7, 10],
    [oI7, oI8, 10],
    [oH7, oH8, 12],
    [oH8, oI8, 12],
    [oI8, oJ8, 8],
    [oH8, oH9, 9],
    [oI8, oI9, 10],
    [oH9, oI9, 9],
    [oH10, oH9, 9],
    [oG9, oG10, 11],
    [oF9, oG9, 8],
    [oF10, oF9, 8],
    [oF10, oG10, 10],
    [oG10, oH10, 12],
    [oH10, oI10, 10],
    [oI9, oJ9, 8],
    [oJ9, oK9, 8],
    [oH10, oH11, 9],
    [oI11, oI10, 8],
    [oH11, oI11, 9],
    [oI11, oJ11, 8],
  ],
);

const fE8 = room(FORT_X, FORT_Z, 4, 7, 26, 26);
const fF8 = room(FORT_X, FORT_Z, 5, 7, 16, 16);
const fG8 = room(FORT_X, FORT_Z, 6, 7, 20, 20);
const fH8 = room(FORT_X, FORT_Z, 7, 7, 20, 20);
const fI8 = room(FORT_X, FORT_Z, 8, 7, 18, 18);
const fG6 = room(FORT_X, FORT_Z, 6, 5, 16, 16);
const fG7 = room(FORT_X, FORT_Z, 6, 6, 16, 16);
const fH7 = room(FORT_X, FORT_Z, 7, 6, 18, 18);
const fG9 = room(FORT_X, FORT_Z, 6, 8, 20, 26);
const fH9 = room(FORT_X, FORT_Z, 7, 8, 16, 16);
const fH10 = room(FORT_X, FORT_Z, 7, 9, 16, 16);
const fI10 = room(FORT_X, FORT_Z, 8, 9, 18, 18);
const fJ7 = room(FORT_X, FORT_Z, 9, 6, 26, 22);
const fJ8 = room(FORT_X, FORT_Z, 9, 7, 26, 22);
const fJ6 = room(FORT_X, FORT_Z, 9, 5, 16, 16);
const fJ9 = room(FORT_X, FORT_Z, 9, 8, 16, 16);

const FORT_ROOMS: Rect[] = weld(
  [fE8, fF8, fG8, fH8, fI8, fG6, fG7, fH7, fG9, fH9, fH10, fI10, fJ7, fJ8, fJ6, fJ9],
  [
    [fE8, fF8, 11],
    [fF8, fG8, 12],
    [fG8, fH8, 12],
    [fH8, fI8, 12],
    [fG8, fG7, 11],
    [fG7, fG6, 10],
    [fG8, fG9, 11],
    [fH8, fH7, 11],
    [fH8, fH9, 11],
    [fH9, fH10, 11],
    [fH10, fI10, 11],
    [fH7, fJ7, 11],
    [fI8, fJ8, 11],
    [fJ7, fJ8, 11],
    [fJ7, fJ6, 10],
    [fJ8, fJ9, 10],
  ],
);

const yE9 = room(YUG_X, YUG_Z, 4, 8, 26, 26);
const yF9 = room(YUG_X, YUG_Z, 5, 8, 14, 14);
const yG8 = room(YUG_X, YUG_Z, 6, 7, 22, 20);
const yF7 = room(YUG_X, YUG_Z, 5, 6, 18, 26);
const yH7 = room(YUG_X, YUG_Z, 7, 6, 26, 22);
const yI9 = room(YUG_X, YUG_Z, 8, 9, 28, 22);
const yI6 = room(YUG_X, YUG_Z, 8, 6, 28, 28, 6, 0);
// Map 2 sits south of the pool. Retail K-5 / J-6 / J-9 / K-6, joined by one hall because the engine has no elevation.
const y2Neck: Rect = { minX: mid(yI9).x - u(5), maxX: mid(yI9).x + u(5), minZ: yI9.maxZ - u(6), maxZ: yI9.maxZ + u(34) };
const y2J6: Rect = { minX: mid(y2Neck).x - u(26), maxX: mid(y2Neck).x + u(26), minZ: y2Neck.maxZ - u(8), maxZ: y2Neck.maxZ + u(34) };
const y2K5: Rect = { minX: y2J6.maxX - u(2), maxX: y2J6.maxX + u(26), minZ: y2J6.minZ - u(32), maxZ: y2J6.minZ + u(2) };
const y2K6: Rect = { minX: y2J6.maxX - u(2), maxX: y2J6.maxX + u(30), minZ: y2J6.maxZ - u(22), maxZ: y2J6.maxZ + u(8) };
const y2J9: Rect = { minX: mid(y2J6).x - u(12), maxX: mid(y2J6).x + u(12), minZ: y2J6.maxZ - u(2), maxZ: y2J6.maxZ + u(30) };

const YUG_ROOMS: Rect[] = weld(
  [yE9, yF9, yG8, yF7, yH7, yI9, yI6, y2Neck, y2J6, y2K5, y2K6, y2J9],
  [
    [yE9, yF9, 10],
    [yF9, yG8, 10],
    [yF9, yF7, 9],
    [yG8, yH7, 10],
    [yG8, yI9, 10],
    [yH7, yI6, 9],
    [y2J6, y2K5, 10],
    [y2J6, y2K6, 10],
    [y2J6, y2J9, 10],
  ],
);

const peak: Rect = { minX: PEAK_X - 30, maxX: PEAK_X + 30, minZ: PEAK_Z - 22, maxZ: PEAK_Z + 18 };
const peakPath: Rect = { minX: PEAK_X - 8, maxX: PEAK_X + 8, minZ: PEAK_Z + 12, maxZ: PEAK_Z + 36 };
const mouthL: Rect = { minX: PEAK_X - 24, maxX: PEAK_X - 6, minZ: PEAK_Z + 30, maxZ: PEAK_Z + 60 };
const mouthR: Rect = { minX: PEAK_X + 6, maxX: PEAK_X + 26, minZ: PEAK_Z + 30, maxZ: PEAK_Z + 60 };
const PEAK_ROOMS: Rect[] = weld([peak, peakPath, mouthL, mouthR], [
  [peakPath, mouthL, 10],
  [peakPath, mouthR, 10],
]);

function eastPool(rect: Rect): Rect {
  return { minX: rect.maxX - u(7.2), maxX: rect.maxX - u(1.5), minZ: rect.minZ + u(3.5), maxZ: rect.minZ + u(11.5) };
}

const pool = eastPool(yI9);
const spring: Rect = { minX: PEAK_X + 14, maxX: PEAK_X + 26, minZ: PEAK_Z - 14, maxZ: PEAK_Z - 2 };
// F&M trace: the northwest loop at F-5 is a pond, not just a spur.
const pond: Rect = {
  minX: mid(oF5).x - u(2.6),
  maxX: mid(oF5).x + u(2.2),
  minZ: oF5.minZ + u(0.7),
  maxZ: mid(oF5).z - u(1.2),
};

function standIn(rect: Rect, gateSide: OrcGate["side"]) {
  const c = mid(rect);
  if (gateSide === "s") return { x: c.x, z: rect.maxZ - 14 };
  if (gateSide === "n") return { x: c.x, z: rect.minZ + 14 };
  if (gateSide === "w") return { x: rect.minX + 14, z: c.z };
  return { x: rect.maxX - 14, z: c.z };
}

const fortFromOut = standIn(fE8, "w");
const outFromFort = standIn(oI8, "e");
const yugFromOut = standIn(yE9, "w");
const outFromYug = standIn(oH11, "w");
const yugFromFortG9 = standIn(yF7, "n");
const yugFromFortJ7 = standIn(yH7, "e");
const yugFromFortJ8 = standIn(y2K5, "n");
const fortFromYugF7 = standIn(fG9, "s");
const fortFromYugH7 = standIn(fJ7, "e");
const fortFromYugK5 = standIn(fJ8, "e");
const peakFromJ9 = standIn(mouthL, "s");
const peakFromK6 = standIn(mouthR, "s");
const yugFromPeakL = standIn(y2J9, "s");
const yugFromPeakR = standIn(y2K6, "e");

export const RON_TO_GHELSBA = { x: mid(oJ11).x, z: oJ11.maxZ - 14, yaw: 0, log: "Ghelsba Outpost." };
// West Ronfaure E-4. cellX(4.37), cellZ(3.285), then 14 yalms south so the stand is off the mouth.
const RON_FROM_GHELSBA = { x: -78.24, z: 391.68, yaw: 0, log: "West Ronfaure." };

export const ORC_GATES: readonly OrcGate[] = [
  mouth(oJ11, "s", "West Ronfaure", "ghelsba-ron", "ronfaure-south", "West Ronfaure.", RON_FROM_GHELSBA),
  mouth(oI8, "e", "Fort Ghelsba", "ghelsba-fort", "fort-ghelsba", "Fort Ghelsba.", fortFromOut),
  mouth(oH11, "w", "Yughott Grotto", "ghelsba-yughott", "yughott", "Yughott Grotto.", yugFromOut),
  mouth(fE8, "w", "Ghelsba Outpost", "fort-out", "ghelsba", "Ghelsba Outpost.", outFromFort),
  mouth(fG9, "s", "Yughott Grotto", "fort-yug-g9", "yughott", "Yughott Grotto.", yugFromFortG9),
  mouth(fJ7, "e", "Yughott Grotto", "fort-yug-j7", "yughott", "Yughott Grotto.", yugFromFortJ7),
  mouth(fJ8, "e", "Yughott Grotto", "fort-yug-j8", "yughott", "Yughott Grotto.", yugFromFortJ8),
  mouth(yE9, "w", "Ghelsba Outpost", "yug-out", "ghelsba", "Ghelsba Outpost.", outFromYug),
  mouth(yF7, "n", "Fort Ghelsba", "yug-fort-f7", "fort-ghelsba", "Fort Ghelsba.", fortFromYugF7),
  mouth(yH7, "e", "Fort Ghelsba", "yug-fort-h7", "fort-ghelsba", "Fort Ghelsba.", fortFromYugH7),
  mouth(y2K5, "n", "Fort Ghelsba", "yug-fort-k5", "fort-ghelsba", "Fort Ghelsba.", fortFromYugK5),
  mouth(y2J9, "s", "Horlais Peak", "yug-horlais-j9", "horlais", "Horlais Peak.", peakFromJ9),
  mouth(y2K6, "e", "Horlais Peak", "yug-horlais-k6", "horlais", "Horlais Peak.", peakFromK6),
  mouth(mouthL, "s", "Yughott Grotto", "horlais-j9", "yughott", "Yughott Grotto.", yugFromPeakL),
  mouth(mouthR, "s", "Yughott Grotto", "horlais-k6", "yughott", "Yughott Grotto.", yugFromPeakR),
];

const GHELSBA_RETURN = ORC_GATES[0];

function shore(rect: Rect, side: "n" | "s" | "e" | "w", depth: number): Rect {
  const lip = u(0.35);
  const inset = u(1.6);
  if (side === "e") return { minX: rect.maxX - depth, maxX: rect.maxX - lip, minZ: rect.minZ + inset, maxZ: rect.maxZ - inset };
  if (side === "w") return { minX: rect.minX + lip, maxX: rect.minX + depth, minZ: rect.minZ + inset, maxZ: rect.maxZ - inset };
  if (side === "n") return { minX: rect.minX + inset, maxX: rect.maxX - inset, minZ: rect.minZ + lip, maxZ: rect.minZ + depth };
  return { minX: rect.minX + inset, maxX: rect.maxX - inset, minZ: rect.maxZ - depth, maxZ: rect.maxZ - lip };
}

function ford(rect: Rect, z: number, gap: number): Rect[] {
  const low = z - gap / 2;
  const high = z + gap / 2;
  const parts: Rect[] = [];
  if (low - rect.minZ > u(1.2)) parts.push({ ...rect, maxZ: low });
  if (rect.maxZ - high > u(1.2)) parts.push({ ...rect, minZ: high });
  return parts;
}

// East bank of the canyon. Water is the cutoff: it hugs the cliff side and does not cross the fort path.
// J-8 is the channel just east of I-8, so the mouth itself stays dry.
// The I-6 and J-9 paths cross that bank, so each one keeps a dry ford.
const OUT_STREAM: Rect[] = [
  ...ford(shore(oI6, "e", u(3.6)), mid(oI6).z, u(12)),
  shore(oI7, "e", u(3.6)),
  shore(oJ6, "e", u(3.4)),
  shore(oJ8, "e", u(8.4)),
  ...ford(shore(oJ9, "e", u(4.2)), mid(oJ9).z, u(12)),
  shore(oK9, "e", u(3.2)),
];
const j11River = shore(oJ11, "e", u(3.4));
j11River.maxZ = Math.min(j11River.maxZ, oJ11.maxZ - u(22));

export const ORC_WATER: { rect: Rect; kind: "stream" | "pool" | "spring" }[] = [
  ...OUT_STREAM.map((rect) => ({ rect, kind: "stream" as const })),
  { rect: j11River, kind: "stream" },
  { rect: pond, kind: "pool" },
  { rect: pool, kind: "pool" },
  { rect: spring, kind: "spring" },
];

export function ghelsbaReturnStand(): { x: number; z: number } {
  return { x: GHELSBA_RETURN.x, z: GHELSBA_RETURN.z };
}

export const ORC_ZONES: { id: string; name: string; rects: Rect[]; fog: "canyon" | "cave" | "peak" }[] = [
  { id: "ghelsba", name: "Ghelsba Outpost", rects: OUT_ROOMS, fog: "canyon" },
  { id: "fort-ghelsba", name: "Fort Ghelsba", rects: FORT_ROOMS, fog: "canyon" },
  { id: "yughott", name: "Yughott Grotto", rects: YUG_ROOMS, fog: "cave" },
  { id: "horlais", name: "Horlais Peak", rects: PEAK_ROOMS, fog: "peak" },
];

function hit(rects: readonly Rect[], x: number, z: number, r: number) {
  return rects.some((rect) => x >= rect.minX + r && x <= rect.maxX - r && z >= rect.minZ + r && z <= rect.maxZ - r);
}

export function orcZoneAt(x: number, z: number, radius = 0): (typeof ORC_ZONES)[number] | null {
  const r = Math.max(0, radius);
  for (const zone of ORC_ZONES) if (hit(zone.rects, x, z, r)) return zone;
  return null;
}

export function inOrc(x: number, z: number, radius = 0): boolean {
  return orcZoneAt(x, z, radius) != null;
}

export function orcRegion(x: number, z: number): string | null {
  return orcZoneAt(x, z, 0)?.name ?? null;
}

export function orcFog(x: number, z: number): "canyon" | "cave" | "peak" | null {
  return orcZoneAt(x, z, 0)?.fog ?? null;
}

export function ghelsbaCell(col: number, row: number): { x: number; z: number } {
  return cell(OUT_X, OUT_Z, col, row);
}

export function fortCell(col: number, row: number): { x: number; z: number } {
  return cell(FORT_X, FORT_Z, col, row);
}

export function grottoCell(col: number, row: number): { x: number; z: number } {
  return cell(YUG_X, YUG_Z, col, row);
}

/** Map 2 has no grid origin. These are the hall and the three mouths off it. */
export function grottoHall(): { x: number; z: number } {
  return mid(y2J6);
}

export function grottoMouth(which: "k5" | "k6" | "j9"): { x: number; z: number } {
  if (which === "k5") return mid(y2K5);
  if (which === "k6") return mid(y2K6);
  return mid(y2J9);
}

export function inGhelsba(x: number, z: number, radius = 0): boolean {
  return orcZoneAt(x, z, radius)?.id === "ghelsba";
}

export function inFort(x: number, z: number, radius = 0): boolean {
  return orcZoneAt(x, z, radius)?.id === "fort-ghelsba";
}

export function inYughott(x: number, z: number, radius = 0): boolean {
  return orcZoneAt(x, z, radius)?.id === "yughott";
}

function inOrcWater(x: number, z: number): boolean {
  return ORC_WATER.some((row) => x > row.rect.minX + 0.4 && x < row.rect.maxX - 0.4 && z > row.rect.minZ + 0.4 && z < row.rect.maxZ - 0.4);
}

export function ghelsbaDry(x: number, z: number): boolean {
  if (!inGhelsba(x, z, 0.35)) return false;
  return !inOrcWater(x, z);
}

/** Any orc zone, off the water. The grotto pool and the outpost streams stay empty. */
export function orcDry(x: number, z: number, radius = 0): boolean {
  if (!inOrc(x, z, radius)) return false;
  return !inOrcWater(x, z);
}

function rectDist(x: number, z: number, rect: Rect) {
  const cx = Math.max(rect.minX, Math.min(rect.maxX, x));
  const cz = Math.max(rect.minZ, Math.min(rect.maxZ, z));
  return Math.hypot(x - cx, z - cz);
}

export function clampOrc(x: number, z: number, radius = 0): { x: number; z: number } | null {
  const r = Math.max(0, radius);
  let best: Rect | null = null;
  let bestD = Infinity;
  for (const zone of ORC_ZONES) {
    for (const rect of zone.rects) {
      const dist = rectDist(x, z, rect);
      if (dist < bestD) {
        bestD = dist;
        best = rect;
      }
    }
  }
  if (!best || bestD > 70) return null;
  const spanX = best.maxX - best.minX;
  const spanZ = best.maxZ - best.minZ;
  const insetX = Math.min(r, Math.max(0, spanX / 2 - 0.05));
  const insetZ = Math.min(r, Math.max(0, spanZ / 2 - 0.05));
  return {
    x: Math.max(best.minX + insetX, Math.min(best.maxX - insetX, x)),
    z: Math.max(best.minZ + insetZ, Math.min(best.maxZ - insetZ, z)),
  };
}

export function orcArrival(to: string): { x: number; z: number; yaw: number; log: string } | null {
  if (to === "ghelsba") return RON_TO_GHELSBA;
  if (to === "fort-ghelsba") return { x: fortFromOut.x, z: fortFromOut.z, yaw: 0, log: "Fort Ghelsba." };
  if (to === "yughott") return { x: yugFromOut.x, z: yugFromOut.z, yaw: 0, log: "Yughott Grotto." };
  if (to === "horlais") return { x: peakFromJ9.x, z: peakFromJ9.z, yaw: 0, log: "Horlais Peak." };
  return null;
}

export type OrcChart = {
  rects: Rect[];
  water: Rect[];
  bounds: Rect;
  marks: { x: number; z: number; name: string }[];
  grid: { x0: number; z0: number; cell: number } | null;
  /** Traced tunnel centerlines, in yalms. The map strokes these instead of filling rects. */
  paths?: { pts: { x: number; z: number }[]; width: number }[];
  discs?: { x: number; z: number; r: number }[];
};

export function orcLayout(region: string): OrcChart | null {
  const zone = ORC_ZONES.find((row) => row.name === region);
  if (!zone) return null;
  let minX = Infinity;
  let maxX = -Infinity;
  let minZ = Infinity;
  let maxZ = -Infinity;
  for (const rect of zone.rects) {
    minX = Math.min(minX, rect.minX);
    maxX = Math.max(maxX, rect.maxX);
    minZ = Math.min(minZ, rect.minZ);
    maxZ = Math.max(maxZ, rect.maxZ);
  }
  const pad = 18;
  const marks = ORC_GATES.filter((gate) => hit(zone.rects, gate.x, gate.z, 0)).map((gate) => ({ x: gate.x, z: gate.z, name: gate.name }));
  if (region === "Ghelsba Outpost") {
    marks.push({ x: mid(oF10).x, z: mid(oF10).z, name: "Hut Door" });
    marks.push({ x: (pond.minX + pond.maxX) / 2, z: (pond.minZ + pond.maxZ) / 2, name: "Pond" });
  }
  if (region === "Horlais Peak") marks.push({ x: PEAK_X, z: PEAK_Z, name: "Burning Circle" });
  const grid = region === "Ghelsba Outpost" ? { x0: OUT_X, z0: OUT_Z, cell: CELL } : region === "Fort Ghelsba" ? { x0: FORT_X, z0: FORT_Z, cell: CELL } : null;
  return {
    rects: zone.rects,
    water: ORC_WATER.filter((row) => hit(zone.rects, (row.rect.minX + row.rect.maxX) / 2, (row.rect.minZ + row.rect.maxZ) / 2, 0)).map((row) => row.rect),
    bounds: { minX: minX - pad, maxX: maxX + pad, minZ: minZ - pad, maxZ: maxZ + pad },
    marks,
    grid,
  };
}

type Add = (color: number, w: number, h: number, d: number, x: number, y: number, z: number) => void;
type Solid = { minX: number; maxX: number; minZ: number; maxZ: number };

function box(add: Add, colliders: Solid[] | null, color: number, w: number, h: number, d: number, x: number, y: number, z: number) {
  add(color, w, h, d, x, y, z);
  if (colliders) {
    colliders.push({ minX: x - w / 2, maxX: x + w / 2, minZ: z - d / 2, maxZ: z + d / 2 });
  }
}

function floor(add: Add, rect: Rect, color: number, y = -0.06) {
  add(color, rect.maxX - rect.minX, 0.18, rect.maxZ - rect.minZ, (rect.minX + rect.maxX) / 2, y, (rect.minZ + rect.maxZ) / 2);
}

function mergeSpans(spans: [number, number][]): [number, number][] {
  if (!spans.length) return [];
  const sorted = spans.slice().sort((a, b) => a[0] - b[0]);
  const out: [number, number][] = [[sorted[0][0], sorted[0][1]]];
  for (let i = 1; i < sorted.length; i++) {
    const last = out[out.length - 1];
    if (sorted[i][0] <= last[1] + 0.45) last[1] = Math.max(last[1], sorted[i][1]);
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

// One solid face along every exposed edge. Posts with gaps read as sky, not a wall.
function cliffWall(add: Add, colliders: Solid[], rects: Rect[], gates: readonly OrcGate[], style: "rock" | "timber" | "cave") {
  const rock = 6050130;
  const rockDark = 3948594;
  const timber = 6964012;
  const face = style === "timber" ? timber : style === "cave" ? rockDark : rock;
  const tall = style === "timber" ? 7.8 : style === "cave" ? 6.6 : 8.4;
  const thick = 2.6;
  const sides: Array<"n" | "s" | "e" | "w"> = ["n", "e", "w"];
  for (const rect of rects) {
    for (const side of sides) {
      const horizontal = side === "n" || side === "s";
      const edge = side === "n" ? rect.minZ : side === "s" ? rect.maxZ : side === "w" ? rect.minX : rect.maxX;
      const full: [number, number] = horizontal ? [rect.minX, rect.maxX] : [rect.minZ, rect.maxZ];
      const covered: [number, number][] = [];
      for (const other of rects) {
        if (other === rect) continue;
        let near = false;
        // A door is a neighbor whose floor continues past this edge. Two rects that only
        // end on the same line are a corner, and each one used to delete the other's wall.
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
        if (across > 4.4 || along < full[0] - 3 || along > full[1] + 3) continue;
        cuts.push([along - 6.6, along + 6.6]);
      }
      const outward = side === "n" || side === "w" ? -1 : 1;
      for (const span of cutSpans(full, cuts)) {
        let a = span[0];
        let b = span[1];
        if (b - a < 1) continue;
        if (Math.abs(a - full[0]) < 0.35) a -= thick * 0.9;
        if (Math.abs(b - full[1]) < 0.35) b += thick * 0.9;
        const len = b - a;
        const midA = (a + b) / 2;
        const acrossC = edge + outward * (thick / 2);
        const cx = horizontal ? midA : acrossC;
        const cz = horizontal ? acrossC : midA;
        const w = horizontal ? len : thick;
        const d = horizontal ? thick : len;
        if (style === "timber") {
          box(add, colliders, rockDark, w, 2.4, d, cx, 1.1, cz);
          add(timber, w, 5.6, d, cx, 5.15, cz);
          for (let t = a + 0.7; t < b - 0.35; t += 1.35) {
            const n = Math.abs(Math.sin(t * 0.37));
            const h = 6.6 + n * 1.5;
            const ox = horizontal ? t : edge + outward * (thick / 2 + 0.38);
            const oz = horizontal ? edge + outward * (thick / 2 + 0.38) : t;
            add(timber, horizontal ? 0.46 : 0.62, h, horizontal ? 0.62 : 0.46, ox, h / 2, oz);
          }
        } else {
          box(add, colliders, face, w, tall, d, cx, tall / 2 - 0.12, cz);
          const baseT = thick + 0.7;
          const baseC = edge + outward * (baseT / 2);
          add(rockDark, horizontal ? len : baseT, 1.8, horizontal ? baseT : len, horizontal ? cx : baseC, 0.8, horizontal ? baseC : cz);
          for (let t = a + 1.4; t < b - 0.6; t += 4.6) {
            const n = Math.abs(Math.sin(t * 0.21 + edge * 0.05));
            const h = tall * (0.78 + n * 0.32);
            const ox = horizontal ? t : edge + outward * (thick / 2 + 0.2);
            const oz = horizontal ? edge + outward * (thick / 2 + 0.2) : t;
            add(rockDark, 1.45, h, 1.45, ox, h / 2 - 0.1, oz);
          }
        }
      }
    }
  }
  for (const gate of gates) {
    if (gate.side === "s") continue;
    const across = gate.side === "n";
    const lift = tall * 0.7;
    for (const sign of [-1, 1]) {
      const x = gate.x + (across ? sign * 5.6 : 0);
      const z = gate.z + (across ? 0 : sign * 5.6);
      box(add, colliders, face, across ? 1.5 : 2.2, lift, across ? 2.2 : 1.5, x, lift / 2, z);
    }
    add(face, across ? 10.8 : 1.25, 1.2, across ? 1.25 : 10.8, gate.x, lift * 0.94, gate.z);
  }
}

function sheet(add: Add, rect: Rect, color: number, y = 0.05) {
  const w = rect.maxX - rect.minX;
  const d = rect.maxZ - rect.minZ;
  if (w < 0.4 || d < 0.4) return;
  add(color, w, 0.05, d, (rect.minX + rect.maxX) / 2, y, (rect.minZ + rect.maxZ) / 2);
}

function hut(add: Add, colliders: Solid[], x: number, z: number) {
  const wood = 6964012;
  box(add, colliders, wood, 9.2, 2.3, 0.45, x, 1.15, z - 4.2);
  box(add, colliders, wood, 9.2, 2.3, 0.45, x, 1.15, z + 4.2);
  box(add, colliders, wood, 0.45, 2.3, 8.4, x - 4.4, 1.15, z);
  add(9127187, 1.4, 0.7, 1.4, x + 1.4, 0.15, z);
  add(14927226, 0.7, 0.35, 0.7, x + 1.4, 0.55, z);
}

const hutSpot = mid(oF10);
export const HUT_ROOF = { x: hutSpot.x, z: hutSpot.z, w: 10, d: 9.2, y: 2.45, h: 0.35, color: 5257770 };

export function underHutRoof(x: number, z: number): boolean {
  return Math.abs(x - HUT_ROOF.x) <= HUT_ROOF.w / 2 && Math.abs(z - HUT_ROOF.z) <= HUT_ROOF.d / 2;
}

function tent(add: Add, colliders: Solid[], x: number, z: number) {
  box(add, colliders, 9072712, 3.6, 1.45, 2.8, x, 0.72, z);
  add(9251362, 0.16, 1.9, 0.16, x, 0.95, z);
}

function catapult(add: Add, colliders: Solid[], x: number, z: number) {
  const wood = 6964012;
  box(add, colliders, wood, 4.2, 0.5, 2.4, x, 0.4, z);
  box(add, colliders, wood, 0.4, 1.6, 0.4, x - 1.5, 1.1, z - 0.7);
  box(add, colliders, wood, 0.4, 1.6, 0.4, x + 1.5, 1.1, z - 0.7);
  add(wood, 3.6, 0.35, 0.45, x, 1.7, z + 0.4);
  add(6050130, 1.1, 1.1, 1.1, x, 1.15, z + 1.3);
}

function ram(add: Add, colliders: Solid[], x: number, z: number) {
  const wood = 6964012;
  box(add, colliders, wood, 7.2, 0.7, 0.7, x, 0.7, z);
  box(add, colliders, 3948594, 1.1, 1.1, 1.1, x + 3.4, 0.7, z);
}

function banner(add: Add, x: number, z: number) {
  add(6964012, 0.18, 2.4, 0.18, x, 1.2, z);
  add(9251362, 0.15, 0.9, 1.3, x, 1.9, z + 0.5);
}

function torch(add: Add, x: number, z: number, side?: "n" | "e" | "w") {
  const wood = 6964012;
  const iron = 3948594;
  const flame = 16739994;
  const pegW = side === "n" ? 0.1 : 0.46;
  const pegD = side === "n" ? 0.46 : 0.1;
  add(wood, pegW, 0.08, pegD, x, 1.42, z);
  const tipX = side === "w" ? x + 0.2 : side === "e" ? x - 0.2 : x;
  const tipZ = side === "n" ? z + 0.2 : z;
  add(iron, 0.14, 0.08, 0.14, tipX, 1.48, tipZ);
  add(flame, 0.1, 0.16, 0.1, tipX, 1.6, tipZ);
}

function pine(add: Add, colliders: Solid[], x: number, z: number) {
  box(add, colliders, 5913124, 0.42, 1.35, 0.42, x, 0.67, z);
  add(2058808, 2.05, 1.35, 2.05, x, 1.7, z);
  add(3111488, 1.25, 1.05, 1.25, x, 2.55, z);
}

const ROPE = 12891508;
const ORC_RED = 9056304;

function ropeBridge(add: Add, colliders: Solid[], x: number, z0: number, z1: number) {
  const wood = 6964012;
  const plank = 8020548;
  const zSouth = Math.min(z0, z1);
  const zNorth = Math.max(z0, z1);
  const len = zNorth - zSouth;
  const cz = (zSouth + zNorth) / 2;
  add(plank, 4.4, 0.1, len, x, 0.08, cz);
  const posts = Math.max(3, Math.round(len / 3.4));
  for (let i = 0; i <= posts; i++) {
    const z = zSouth + (len * i) / posts;
    box(add, colliders, wood, 0.26, 1.45, 0.26, x - 2.45, 0.72, z);
    box(add, colliders, wood, 0.26, 1.45, 0.26, x + 2.45, 0.72, z);
  }
  add(ROPE, 0.1, 0.08, len, x - 2.45, 1.2, cz);
  add(ROPE, 0.1, 0.08, len, x + 2.45, 1.2, cz);
  add(ROPE, 0.08, 0.06, len, x - 2.45, 0.55, cz);
  add(ROPE, 0.08, 0.06, len, x + 2.45, 0.55, cz);
}

function palisadeMouth(add: Add, colliders: Solid[], x: number, z: number) {
  const wood = 6964012;
  for (const side of [-1, 1]) {
    for (let i = 0; i < 3; i++) {
      const px = x + side * (2.6 + i * 1.15);
      box(add, colliders, wood, 0.32, 2.5, 0.32, px, 1.25, z);
      add(ORC_RED, 0.38, 0.28, 0.38, px, 2.15, z);
    }
  }
  add(wood, 4.2, 0.28, 0.28, x, 2.35, z);
}

function watchstand(add: Add, colliders: Solid[], x: number, z: number) {
  const wood = 6964012;
  const deck = 8020548;
  for (const [dx, dz] of [[-2.1, -1.5], [2.1, -1.5], [-2.1, 1.5], [2.1, 1.5]] as const) {
    box(add, colliders, wood, 0.32, 2.35, 0.32, x + dx, 1.15, z + dz);
    add(ORC_RED, 0.4, 0.28, 0.4, x + dx, 2.05, z + dz);
  }
  add(deck, 5.0, 0.16, 3.8, x, 2.4, z);
  add(wood, 0.1, 2.15, 0.1, x - 0.32, 1.05, z + 2.05);
  add(wood, 0.1, 2.15, 0.1, x + 0.32, 1.05, z + 2.05);
  for (let i = 0; i < 5; i++) add(wood, 0.62, 0.07, 0.1, x, 0.35 + i * 0.38, z + 2.05);
  banner(add, x + 1.4, z - 0.4);
}

function shrub(add: Add, x: number, z: number) {
  if (!hit(OUT_ROOMS, x, z, 1.4)) return;
  if (ORC_GATES.some((gate) => Math.hypot(gate.x - x, gate.z - z) < 7 || Math.hypot(gate.arrive.x - x, gate.arrive.z - z) < 5)) return;
  if (Math.hypot(x - RON_TO_GHELSBA.x, z - RON_TO_GHELSBA.z) < 6) return;
  if (ORC_WATER.some((row) => x > row.rect.minX - 1 && x < row.rect.maxX + 1 && z > row.rect.minZ - 1 && z < row.rect.maxZ + 1)) return;
  add(2058808, 1.35, 0.65, 1.15, x, 0.32, z);
  add(3111488, 0.75, 0.4, 0.65, x + 0.2, 0.7, z);
}

function boulder(add: Add, colliders: Solid[], x: number, z: number) {
  if (!hit(OUT_ROOMS, x, z, 1.2)) return;
  if (ORC_GATES.some((gate) => Math.hypot(gate.x - x, gate.z - z) < 8 || Math.hypot(gate.arrive.x - x, gate.arrive.z - z) < 5)) return;
  if (Math.hypot(x - RON_TO_GHELSBA.x, z - RON_TO_GHELSBA.z) < 6) return;
  const h = 0.85 + (Math.abs(Math.round(x + z)) % 3) * 0.28;
  box(add, colliders, 6050130, 1.15, h, 0.95, x, h / 2, z);
}

function lip(add: Add, colliders: Solid[], rect: Rect, open: OrcGate["side"]) {
  const t = 0.65;
  const h = 0.7;
  const cx = (rect.minX + rect.maxX) / 2;
  const cz = (rect.minZ + rect.maxZ) / 2;
  const w = rect.maxX - rect.minX + t;
  const d = rect.maxZ - rect.minZ + t;
  if (open !== "n") box(add, colliders, 3948594, w, h, t, cx, h / 2, rect.minZ);
  if (open !== "s") box(add, colliders, 3948594, w, h, t, cx, h / 2, rect.maxZ);
  if (open !== "w") box(add, colliders, 3948594, t, h, d, rect.minX, h / 2, cz);
  if (open !== "e") box(add, colliders, 3948594, t, h, d, rect.maxX, h / 2, cz);
}

function apron(add: Add, gate: OrcGate, color: number) {
  const x = gate.x + (gate.side === "w" ? 3.6 : gate.side === "e" ? -3.6 : 0);
  const z = gate.z + (gate.side === "n" ? 3.6 : gate.side === "s" ? -3.6 : 0);
  const across = gate.side === "n" || gate.side === "s";
  add(color, across ? 7.4 : 5.4, 0.05, across ? 5.4 : 7.4, x, 0.05, z);
}

function cornerRocks(add: Add, colliders: Solid[], rect: Rect) {
  if (rect.maxX - rect.minX < 16 || rect.maxZ - rect.minZ < 16) return;
  const spots: [number, number][] = [
    [rect.minX + 2.6, rect.minZ + 2.6],
    [rect.maxX - 2.6, rect.minZ + 2.6],
    [rect.minX + 2.6, rect.maxZ - 2.6],
    [rect.maxX - 2.6, rect.maxZ - 2.6],
  ];
  let n = 0;
  for (const [x, z] of spots) {
    if (ORC_GATES.some((gate) => Math.hypot(gate.x - x, gate.z - z) < 8 || Math.hypot(gate.arrive.x - x, gate.arrive.z - z) < 5)) continue;
    if (Math.hypot(x - RON_TO_GHELSBA.x, z - RON_TO_GHELSBA.z) < 5) continue;
    if (n >= 2) break;
    const h = 0.95 + (Math.abs(Math.round(x + z)) % 3) * 0.28;
    box(add, colliders, 3948594, 0.85, h, 0.85, x, h / 2, z);
    n += 1;
  }
}

function mountWallTorches(add: Add) {
  const inset = 0.28;
  const step = 18;
  const placed: { x: number; z: number }[] = [];
  const clear = (x: number, z: number) => {
    if (!hit(YUG_ROOMS, x, z, 0.2)) return false;
    if (ORC_GATES.some((gate) => Math.hypot(gate.x - x, gate.z - z) < 6.5 || Math.hypot(gate.arrive.x - x, gate.arrive.z - z) < 4)) return false;
    if (ORC_WATER.some((row) => x > row.rect.minX - 0.3 && x < row.rect.maxX + 0.3 && z > row.rect.minZ - 0.3 && z < row.rect.maxZ + 0.3)) return false;
    if (placed.some((spot) => Math.hypot(spot.x - x, spot.z - z) < 9)) return false;
    return true;
  };
  for (const rect of YUG_ROOMS) {
    for (const side of ["n", "e", "w"] as const) {
      const horizontal = side === "n";
      const edge = side === "n" ? rect.minZ : side === "w" ? rect.minX : rect.maxX;
      const full: [number, number] = horizontal ? [rect.minX, rect.maxX] : [rect.minZ, rect.maxZ];
      const covered: [number, number][] = [];
      for (const other of YUG_ROOMS) {
        if (other === rect) continue;
        let near = false;
        if (side === "n") near = other.minZ < edge - 0.15 && other.maxZ > edge - 0.25;
        else if (side === "w") near = other.minX < edge - 0.15 && other.maxX > edge - 0.25;
        else near = other.minX < edge + 0.25 && other.maxX > edge + 0.15;
        if (!near) continue;
        const a0 = Math.max(full[0], horizontal ? other.minX : other.minZ);
        const b0 = Math.min(full[1], horizontal ? other.maxX : other.maxZ);
        if (b0 - a0 > 0.25) covered.push([a0, b0]);
      }
      const cuts = mergeSpans(covered);
      for (const gate of ORC_GATES) {
        if (!hit(YUG_ROOMS, gate.x, gate.z, 0) || gate.side !== side) continue;
        const along = horizontal ? gate.x : gate.z;
        const across = horizontal ? Math.abs(gate.z - edge) : Math.abs(gate.x - edge);
        if (across > 4.4 || along < full[0] - 3 || along > full[1] + 3) continue;
        cuts.push([along - 6.6, along + 6.6]);
      }
      for (const span of cutSpans(full, cuts)) {
        const a = span[0] + 3;
        const b = span[1] - 3;
        if (b - a < 2) continue;
        const count = Math.max(1, Math.floor((b - a) / step));
        for (let i = 0; i < count; i++) {
          const t = a + step * 0.5 + i * step;
          if (t > b) continue;
          const x = horizontal ? t : side === "w" ? edge + inset : edge - inset;
          const z = horizontal ? edge + inset : t;
          const tipX = side === "w" ? x + 0.2 : side === "e" ? x - 0.2 : x;
          const tipZ = side === "n" ? z + 0.2 : z;
          if (!clear(tipX, tipZ)) continue;
          placed.push({ x: tipX, z: tipZ });
          torch(add, x, z, side);
        }
      }
    }
  }
}

export function buildOrcLands(add: Add, colliders: Solid[]) {
  const dirt = 9269316;
  const dirtDark = 7033908;
  const cave = 5918792;
  const rock = 6050130;
  const rockDark = 3948594;
  const timber = 6964012;
  const water = 3108230;
  const springColor = 8304816;
  const plank = 8020548;
  const moss = 4156216;
  const grass = 6974788;
  for (const rect of OUT_ROOMS) floor(add, rect, grass);
  for (const rect of FORT_ROOMS) floor(add, rect, dirtDark);
  for (const rect of YUG_ROOMS) floor(add, rect, cave);
  for (const rect of PEAK_ROOMS) floor(add, rect, dirtDark);
  const yard = paths(fE8, fI8, 4.2)[0];
  if (yard) sheet(add, yard, plank, 0.045);
  sheet(add, boxAt(mid(y2J6).x, mid(y2J6).z, 6.5, 6.5), dirtDark, 0.045);
  sheet(add, boxAt(PEAK_X, PEAK_Z, 5.6, 5.6), 3811874, 0.04);
  for (const row of ORC_WATER) {
    const color = row.kind === "spring" ? springColor : water;
    sheet(add, row.rect, color, 0.02);
    colliders.push({ minX: row.rect.minX, maxX: row.rect.maxX, minZ: row.rect.minZ, maxZ: row.rect.maxZ });
    if (row.kind === "stream") sheet(add, { minX: row.rect.minX - 1.5, maxX: row.rect.minX, minZ: row.rect.minZ, maxZ: row.rect.maxZ }, moss, 0.04);
  }
  const outGates = ORC_GATES.filter((gate) => hit(OUT_ROOMS, gate.x, gate.z, 0));
  const fortGates = ORC_GATES.filter((gate) => hit(FORT_ROOMS, gate.x, gate.z, 0));
  const yugGates = ORC_GATES.filter((gate) => hit(YUG_ROOMS, gate.x, gate.z, 0));
  const peakGates = ORC_GATES.filter((gate) => hit(PEAK_ROOMS, gate.x, gate.z, 0));
  cliffWall(add, colliders, OUT_ROOMS, outGates, "rock");
  cliffWall(add, colliders, FORT_ROOMS, fortGates, "timber");
  cliffWall(add, colliders, YUG_ROOMS, yugGates, "cave");
  cliffWall(add, colliders, PEAK_ROOMS, peakGates, "rock");
  for (const gate of ORC_GATES) apron(add, gate, cave);
  const door = mid(oF10);
  hut(add, colliders, door.x, door.z);
  const camp = mid(oH7);
  tent(add, colliders, camp.x - 7.2, camp.z + 4.2);
  tent(add, colliders, camp.x + 7.4, camp.z - 4.6);
  banner(add, camp.x - 7.2, camp.z - 5.2);
  banner(add, camp.x + 5.2, camp.z + 5.4);
  watchstand(add, colliders, camp.x + 8.2, camp.z + 1.4);
  for (const dz of [-6.5, -3.4, 3.6, 6.4]) {
    const px = camp.x - 11.2;
    box(add, colliders, timber, 0.34, 2.3, 0.34, px, 1.15, camp.z + dz);
    add(ORC_RED, 0.4, 0.26, 0.4, px, 2.05, camp.z + dz);
  }
  add(9127187, 1.5, 0.35, 1.5, camp.x - 2.4, 0.18, camp.z + 1.6);
  add(14927226, 0.55, 0.4, 0.55, camp.x - 2.4, 0.5, camp.z + 1.6);
  const fortMouth = ORC_GATES.find((gate) => gate.id === "ghelsba-fort");
  if (fortMouth) {
    for (const side of [-1, 1]) {
      const z = fortMouth.z + side * 6.6;
      box(add, colliders, timber, 0.4, 2.8, 0.4, fortMouth.x - 1.5, 1.4, z);
      add(ORC_RED, 0.48, 0.3, 0.48, fortMouth.x - 1.5, 2.35, z);
    }
    add(timber, 0.28, 0.28, 10.4, fortMouth.x - 1.5, 2.7, fortMouth.z);
  }
  const ronMouth = ORC_GATES.find((gate) => gate.id === "ghelsba-ron");
  if (ronMouth) {
    ropeBridge(add, colliders, ronMouth.x, ronMouth.z - 3.8, ronMouth.z - 16.8);
    palisadeMouth(add, colliders, ronMouth.x, ronMouth.z - 17.6);
  }
  torch(add, mid(oH8).x - 6.5, mid(oH8).z - 6);
  torch(add, mid(oJ11).x - 3.2, mid(oJ11).z - 6);
  const lookout = mid(oH6);
  pine(add, colliders, lookout.x - 6, lookout.z + 2);
  pine(add, colliders, lookout.x + 5, lookout.z - 4);
  pine(add, colliders, mid(oF7).x - 8, mid(oF7).z + 4);
  lip(add, colliders, pond, "s");
  const dress: [number, number][] = [
    [mid(oG6).x - 7, mid(oG6).z + 4],
    [mid(oI6).x + 3, mid(oI6).z - 5],
    [mid(oF7).x + 7, mid(oF7).z - 6],
    [mid(oH8).x - 6, mid(oH8).z + 4],
    [mid(oI8).x - 8, mid(oI8).z + 2],
    [mid(oG9).x + 6, mid(oG9).z - 4],
    [mid(oH10).x - 6, mid(oH10).z + 5],
    [mid(oG10).x + 5, mid(oG10).z - 5],
    [mid(oJ9).x - 2, mid(oJ9).z + 2],
  ];
  for (const [x, z] of dress) shrub(add, x, z);
  boulder(add, colliders, mid(oG6).x + 7, mid(oG6).z - 5);
  boulder(add, colliders, mid(oF7).x - 8, mid(oF7).z - 5);
  boulder(add, colliders, mid(oH10).x + 6, mid(oH10).z - 4);
  boulder(add, colliders, mid(oG9).x - 6, mid(oG9).z + 4);
  const siege = mid(fI10);
  catapult(add, colliders, siege.x, siege.z - 4);
  ram(add, colliders, mid(fG8).x, mid(fG8).z + 5);
  banner(add, mid(fH8).x, mid(fH8).z - 5);
  banner(add, mid(fE8).x + 6, mid(fE8).z - 4);
  banner(add, mid(fJ8).x - 6, mid(fJ8).z);
  torch(add, mid(fE8).x + 5, mid(fE8).z + 6);
  box(add, colliders, timber, 2.4, 0.7, 1.1, mid(fG6).x, 0.35, mid(fG6).z);
  lip(add, colliders, pool, "w");
  mountWallTorches(add);
  for (const rect of [yG8, y2J6, yE9, yH7]) cornerRocks(add, colliders, rect);
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const x = PEAK_X + Math.cos(a) * 8;
    const z = PEAK_Z + Math.sin(a) * 8;
    box(add, colliders, 9673124, 1.35, 1.15, 1.35, x, 0.55, z);
  }
  add(14927226, 1.5, 0.08, 1.5, PEAK_X, 0.07, PEAK_Z);
  lip(add, colliders, spring, "w");
  box(add, colliders, rock, 1.8, 1.3, 1.6, PEAK_X - 16, 0.65, PEAK_Z - 8);
  box(add, colliders, rockDark, 1.5, 1.05, 1.4, PEAK_X + 12, 0.52, PEAK_Z + 6);
}

function component(rects: Rect[]) {
  const seen = new Set<number>();
  const stack = [0];
  seen.add(0);
  const touches = (a: Rect, b: Rect) => a.minX <= b.maxX + 0.2 && a.maxX >= b.minX - 0.2 && a.minZ <= b.maxZ + 0.2 && a.maxZ >= b.minZ - 0.2;
  while (stack.length) {
    const i = stack.pop() as number;
    for (let j = 0; j < rects.length; j++) {
      if (seen.has(j) || !touches(rects[i], rects[j])) continue;
      seen.add(j);
      stack.push(j);
    }
  }
  return seen.size === rects.length;
}

export function assertGhelsba(): void {
  if (!component(OUT_ROOMS) || !component(FORT_ROOMS) || !component(YUG_ROOMS) || !component(PEAK_ROOMS)) throw new Error("a ghelsba zone is split");
  const spot = (rects: Rect[], ox: number, oz: number, col: number, row: number, label: string) => {
    const c = cell(ox, oz, col, row);
    if (!hit(rects, c.x, c.z, 0.4)) throw new Error(`${label} is not walkable`);
  };
  const outSpots: [number, number, string][] = [
    [5, 6, "F-7"], [5, 9, "F-10"],
    [6, 5, "G-6"], [6, 8, "G-9"], [6, 9, "G-10"],
    [7, 5, "H-6"], [7, 6, "H-7"], [7, 7, "H-8"], [7, 9, "H-10"],
    [8, 5, "I-6"], [8, 6, "I-7"], [8, 7, "I-8"],
  ];
  for (const [col, row, label] of outSpots) spot(OUT_ROOMS, OUT_X, OUT_Z, col, row, label);
  const cliff = (col: number, row: number, label: string) => {
    const c = cell(OUT_X, OUT_Z, col, row);
    if (hit(OUT_ROOMS, c.x, c.z, 0)) throw new Error(`${label} should stay cliff`);
  };
  cliff(5, 4, "F-5");
  cliff(5, 5, "F-6");
  cliff(5, 7, "F-8");
  cliff(5, 8, "F-9");
  cliff(6, 4, "G-5");
  cliff(6, 6, "G-7");
  cliff(6, 7, "G-8");
  cliff(7, 4, "H-5");
  cliff(7, 8, "H-9");
  cliff(7, 10, "H-11");
  cliff(8, 4, "I-5");
  cliff(8, 8, "I-9");
  cliff(8, 9, "I-10");
  cliff(8, 10, "I-11");
  cliff(9, 5, "J-6");
  cliff(9, 6, "J-7");
  cliff(9, 7, "J-8");
  cliff(4, 7, "E-8");
  const fortSpots: [number, number, string][] = [
    [4, 7, "E-8"], [5, 7, "F-8"], [6, 5, "G-6"], [6, 6, "G-7"], [6, 7, "G-8"], [6, 8, "G-9"],
    [7, 6, "H-7"], [7, 7, "H-8"], [7, 8, "H-9"], [7, 9, "H-10"], [8, 7, "I-8"], [8, 9, "I-10"],
    [9, 5, "J-6"], [9, 6, "J-7"], [9, 7, "J-8"], [9, 8, "J-9"],
  ];
  for (const [col, row, label] of fortSpots) spot(FORT_ROOMS, FORT_X, FORT_Z, col, row, `fort ${label}`);
  spot(YUG_ROOMS, YUG_X, YUG_Z, 4, 8, "yughott E-9");
  spot(YUG_ROOMS, YUG_X, YUG_Z, 5, 6, "yughott F-7");
  spot(YUG_ROOMS, YUG_X, YUG_Z, 7, 6, "yughott H-7");
  if (!hit(YUG_ROOMS, mid(y2K5).x, mid(y2K5).z, 0.4)) throw new Error("yughott K-5");
  if (!hit(YUG_ROOMS, mid(y2J6).x, mid(y2J6).z, 0.4)) throw new Error("yughott J-6");
  if (y2J6.maxX - y2J6.minX < 36) throw new Error("home-point cavern is too narrow");
  if (!hit(YUG_ROOMS, mid(y2J9).x, mid(y2J9).z, 0.4)) throw new Error("yughott J-9");
  if (!hit(YUG_ROOMS, mid(y2K6).x, mid(y2K6).z, 0.4)) throw new Error("yughott K-6");
  if (!hit(PEAK_ROOMS, PEAK_X, PEAK_Z, 0.4)) throw new Error("burning circle");
  if (!hit(PEAK_ROOMS, (spring.minX + spring.maxX) / 2, (spring.minZ + spring.maxZ) / 2, 0.2)) throw new Error("hot spring");
  const overlaps = (a: Rect, b: Rect) => a.minX < b.maxX - 0.5 && a.maxX > b.minX + 0.5 && a.minZ < b.maxZ - 0.5 && a.maxZ > b.minZ + 0.5;
  const groups = [OUT_ROOMS, FORT_ROOMS, YUG_ROOMS, PEAK_ROOMS];
  for (let i = 0; i < groups.length; i++) {
    for (let j = i + 1; j < groups.length; j++) {
      for (const a of groups[i]) for (const b of groups[j]) if (overlaps(a, b)) throw new Error("orc zones overlap");
    }
  }
  for (const zone of ORC_ZONES) {
    for (const rect of zone.rects) {
      if (rect.maxX > -350) throw new Error(`${zone.id} crowds ronfaure`);
      if (rect.minX < -1840 || rect.maxZ > 1680 || rect.minZ < -120) throw new Error(`${zone.id} outside the place box`);
    }
  }
  for (const gate of ORC_GATES) {
    if (!inOrc(gate.x, gate.z, 0.2)) throw new Error(`${gate.id} gate is off the ground`);
    if (gate.id === "ghelsba-ron") continue;
    const landed = orcZoneAt(gate.arrive.x, gate.arrive.z, 0.36);
    if (!landed || landed.id !== gate.to) throw new Error(`${gate.id} lands in ${landed?.id ?? "nothing"}`);
    if (Math.hypot(gate.x - gate.arrive.x, gate.z - gate.arrive.z) < 8) throw new Error(`${gate.id} arrival stands on the line`);
    for (const other of ORC_GATES) {
      if (Math.abs(gate.arrive.x - other.x) <= other.hx && Math.abs(gate.arrive.z - other.z) <= other.hz) throw new Error(`${gate.id} arrival is inside ${other.id}`);
    }
  }
  if (!inOrc(RON_TO_GHELSBA.x, RON_TO_GHELSBA.z, 0.36)) throw new Error("ronfaure lands off the outpost");
  const back = ORC_GATES.find((gate) => gate.id === "ghelsba-ron");
  if (!back || back.to !== "ronfaure-south" || Math.hypot(back.x - RON_TO_GHELSBA.x, back.z - RON_TO_GHELSBA.z) < 8) throw new Error("outpost return");
  if (Math.hypot(back.arrive.x + 78.24, back.arrive.z - 391.68) > 0.05) throw new Error("ronfaure stand drifted");
  for (const row of ORC_WATER) {
    const cx = (row.rect.minX + row.rect.maxX) / 2;
    const cz = (row.rect.minZ + row.rect.maxZ) / 2;
    if (row.rect.maxX - row.rect.minX < 0.8 || row.rect.maxZ - row.rect.minZ < 0.8) throw new Error("water is flat");
    if (!inOrc(cx, cz, 0.2)) throw new Error(`${row.kind} is off the floor`);
  }
  const fortGate = ORC_GATES.find((gate) => gate.id === "ghelsba-fort");
  if (!fortGate || fortGate.side !== "e") throw new Error("fort mouth should open east of I-8");
  if (ORC_WATER.some((row) => fortGate.x > row.rect.minX - 1 && fortGate.x < row.rect.maxX + 1 && fortGate.z > row.rect.minZ - 1 && fortGate.z < row.rect.maxZ + 1)) {
    throw new Error("river covers the fort mouth");
  }
  const wet = (x: number, z: number) => ORC_WATER.some((row) => x > row.rect.minX && x < row.rect.maxX && z > row.rect.minZ && z < row.rect.maxZ);
  const i8 = cell(OUT_X, OUT_Z, 8, 7);
  if (wet(i8.x, i8.z)) throw new Error("river crosses the fort approach");
  const dry = (x: number, z: number) => hit(OUT_ROOMS, x, z, 0.45) && !wet(x, z);
  const goals = [
    fortGate,
    ORC_GATES.find((gate) => gate.id === "ghelsba-yughott")!,
    { x: mid(oH8).x, z: mid(oH8).z },
    { x: mid(oF7).x, z: mid(oF7).z },
    { x: mid(oF10).x, z: mid(oF10).z + 6.5 },
  ];
  const seen = new Set<string>();
  const queue: [number, number][] = [[RON_TO_GHELSBA.x, RON_TO_GHELSBA.z]];
  const key = (x: number, z: number) => `${Math.round(x * 2)}:${Math.round(z * 2)}`;
  seen.add(key(RON_TO_GHELSBA.x, RON_TO_GHELSBA.z));
  const step = 1.8;
  for (let i = 0; i < queue.length; i++) {
    const [x, z] = queue[i];
    for (const [dx, dz] of [[step, 0], [-step, 0], [0, step], [0, -step]] as const) {
      const nx = x + dx;
      const nz = z + dz;
      const k = key(nx, nz);
      if (seen.has(k) || !dry(nx, nz)) continue;
      seen.add(k);
      queue.push([nx, nz]);
    }
  }
  for (const goal of goals) {
    if (!queue.some(([x, z]) => Math.hypot(x - goal.x, z - goal.z) < 3.4)) throw new Error("water cuts off the outpost");
  }
  for (let i = 0; i < ORC_GATES.length; i++) {
    for (let j = i + 1; j < ORC_GATES.length; j++) {
      const a = ORC_GATES[i];
      const b = ORC_GATES[j];
      if (Math.abs(a.x - b.x) < a.hx + b.hx && Math.abs(a.z - b.z) < a.hz + b.hz) throw new Error(`${a.id} overlaps ${b.id}`);
    }
  }
  const names = new Set(ORC_ZONES.map((zone) => orcRegion(mid(zone.rects[0]).x, mid(zone.rects[0]).z)));
  if (names.size !== 4) throw new Error("orc region names");
  const solids: Solid[] = [];
  buildOrcLands(() => {}, solids);
  const blocked = (x: number, z: number) => solids.some((box) => x > box.minX - 0.36 && x < box.maxX + 0.36 && z > box.minZ - 0.36 && z < box.maxZ + 0.36);
  for (const gate of ORC_GATES) {
    if (blocked(gate.x, gate.z)) throw new Error(`${gate.id} mouth is inside a prop`);
    if (gate.id !== "ghelsba-ron" && blocked(gate.arrive.x, gate.arrive.z)) throw new Error(`${gate.id} arrival is inside a prop`);
  }
  if (blocked(RON_TO_GHELSBA.x, RON_TO_GHELSBA.z)) throw new Error("outpost landing is inside a prop");
}
