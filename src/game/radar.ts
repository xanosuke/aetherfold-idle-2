/** Live yard positions for the corner map. The engine writes; the map reads. Not saved. */

export type RadarKind = "foe" | "trust" | "pet" | "crystal";

export type RadarBlip = {
  x: number;
  z: number;
  kind: RadarKind;
};

export type RadarFrame = {
  x: number;
  z: number;
  yaw: number;
  region: string;
  blips: readonly RadarBlip[];
};

const blips: RadarBlip[] = [];
const frame: RadarFrame = { x: 0, z: 0, yaw: 0, region: "San d'Oria", blips };

export function publishRadar(x: number, z: number, yaw: number, next: readonly RadarBlip[], region = "San d'Oria"): void {
  frame.x = x;
  frame.z = z;
  frame.yaw = yaw;
  frame.region = region;
  blips.length = 0;
  for (let i = 0; i < next.length; i++) blips.push(next[i]);
}

export function readRadar(): RadarFrame {
  return frame;
}
