/** Bilinear reads of a baked Fort / Yughott heightfield. No graphs. */

export type OrcFieldData = {
  x0: number;
  z0: number;
  step: number;
  nX: number;
  nZ: number;
  ys: string;
  floorY: string;
  draw: string;
  floor: string;
  rgb: string;
};

export type OrcField = {
  id: string;
  x0: number;
  z0: number;
  step: number;
  nX: number;
  nZ: number;
  ys: Float32Array;
  floorY: Float32Array;
  draw: Uint8Array;
  floor: Uint8Array;
  rgb: Uint8Array;
};

export type TraceSample = { y: number; r: number; g: number; b: number; draw: boolean };

function bytesOf(b64: string): Uint8Array {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function floatsOf(b64: string, count: number): Float32Array {
  const bytes = bytesOf(b64);
  if (bytes.byteLength !== count * 4) throw new Error(`float field ${bytes.byteLength} != ${count * 4}`);
  return new Float32Array(bytes.buffer, bytes.byteOffset, count);
}

export function decodeField(id: string, data: OrcFieldData): OrcField {
  const verts = (data.nX + 1) * (data.nZ + 1);
  const draw = bytesOf(data.draw);
  const floor = bytesOf(data.floor);
  const rgb = bytesOf(data.rgb);
  if (draw.length !== verts || floor.length !== verts || rgb.length !== verts * 3) throw new Error(`${id} field size`);
  return {
    id,
    x0: data.x0,
    z0: data.z0,
    step: data.step,
    nX: data.nX,
    nZ: data.nZ,
    ys: floatsOf(data.ys, verts),
    floorY: floatsOf(data.floorY, verts),
    draw,
    floor,
    rgb,
  };
}

type Cell = {
  i: number;
  j: number;
  tx: number;
  tz: number;
  i00: number;
  i10: number;
  i01: number;
  i11: number;
};

function locate(field: OrcField, x: number, z: number): Cell | null {
  const u = (x - field.x0) / field.step;
  const v = (z - field.z0) / field.step;
  if (u < 0 || v < 0 || u > field.nX || v > field.nZ) return null;
  const i = Math.min(field.nX - 1, Math.floor(u));
  const j = Math.min(field.nZ - 1, Math.floor(v));
  const w = field.nX + 1;
  return {
    i,
    j,
    tx: u - i,
    tz: v - j,
    i00: j * w + i,
    i10: j * w + i + 1,
    i01: (j + 1) * w + i,
    i11: (j + 1) * w + i + 1,
  };
}

function mix4(a: number, b: number, c: number, d: number, tx: number, tz: number) {
  return a + (b - a) * tx + (c - a) * tz + (a - b - c + d) * tx * tz;
}

export function fullyDrawn(field: OrcField, x: number, z: number): boolean {
  const cell = locate(field, x, z);
  if (!cell) return false;
  return field.draw[cell.i00] === 1 && field.draw[cell.i10] === 1 && field.draw[cell.i01] === 1 && field.draw[cell.i11] === 1;
}

export function sampleTrace(field: OrcField, x: number, z: number): TraceSample | null {
  const cell = locate(field, x, z);
  if (!cell) return null;
  const { i00, i10, i01, i11, tx, tz } = cell;
  if (!field.draw[i00] && !field.draw[i10] && !field.draw[i01] && !field.draw[i11]) return null;
  const y = mix4(field.ys[i00], field.ys[i10], field.ys[i01], field.ys[i11], tx, tz);
  const ch = (shift: number) => mix4(field.rgb[i00 * 3 + shift], field.rgb[i10 * 3 + shift], field.rgb[i01 * 3 + shift], field.rgb[i11 * 3 + shift], tx, tz) / 255;
  return { y, r: ch(0), g: ch(1), b: ch(2), draw: true };
}

/** Terrace height where the floor mask covers the cell. Null off that mask. */
export function readFloorY(field: OrcField, x: number, z: number): number | null {
  const cell = locate(field, x, z);
  if (!cell) return null;
  const { i00, i10, i01, i11, tx, tz } = cell;
  const w = mix4(field.floor[i00], field.floor[i10], field.floor[i01], field.floor[i11], tx, tz);
  if (w < 0.5) return null;
  return mix4(field.floorY[i00], field.floorY[i10], field.floorY[i01], field.floorY[i11], tx, tz);
}

/** Bilinear terrace, including off-floor vertices. Null outside the grid. */
export function mixFloorY(field: OrcField, x: number, z: number): number | null {
  const cell = locate(field, x, z);
  if (!cell) return null;
  const { i00, i10, i01, i11, tx, tz } = cell;
  return mix4(field.floorY[i00], field.floorY[i10], field.floorY[i01], field.floorY[i11], tx, tz);
}

/** Nearest baked draw flag. O(1). */
export function claimsDraw(field: OrcField, x: number, z: number): boolean {
  const u = (x - field.x0) / field.step;
  const v = (z - field.z0) / field.step;
  if (u < -0.5 || v < -0.5 || u > field.nX + 0.5 || v > field.nZ + 0.5) return false;
  const i = Math.max(0, Math.min(field.nX, Math.round(u)));
  const j = Math.max(0, Math.min(field.nZ, Math.round(v)));
  return field.draw[j * (field.nX + 1) + i] !== 0;
}
