export const PASS_X = 80;
export const PASS_Z = -470;
export const PASS_CELL = 48;
export const PASS_WIDTH = 0.2;
export type PassNodeKind = "exit" | "junction" | "chamber" | "deadend" | "door_oneway";
export type PassNode = { id: string; gx: number; gy: number; grid: string; kind: PassNodeKind; r?: number; to?: string };
export type PassEdge = { id: string; from: string; to: string; width?: number; oneWay?: string; pts: [number, number][] };
export type PassPoi = { id: string; gx: number; gy: number; grid: string; label: string };
export type PassGraph = { nodes: PassNode[]; edges: PassEdge[]; pois: PassPoi[] };
export const PASS_GRAPH: PassGraph = {
  nodes: [
    { id: "exit_east_ronfaure", gx: 6.28, gy: 11.65, grid: "G-12", kind: "exit", to: "east_ronfaure" },
    { id: "j_south", gx: 5.85, gy: 10.35, grid: "F-11", kind: "junction" },
    { id: "door_exit_only", gx: 4.55, gy: 9.22, grid: "E-10", kind: "door_oneway" },
    { id: "room_inner", gx: 5.35, gy: 9.4, grid: "F-10", kind: "chamber", r: 0.2 },
    { id: "door_enter_only", gx: 5.25, gy: 9.02, grid: "F-10", kind: "door_oneway" },
    { id: "west_fork", gx: 4.85, gy: 8.55, grid: "E-9", kind: "junction" },
    { id: "j_trunk_west", gx: 6.78, gy: 7.8, grid: "G-8", kind: "junction" },
    { id: "j_qqq", gx: 8.1, gy: 8.78, grid: "I-9", kind: "junction" },
    { id: "deadend_j8", gx: 9.55, gy: 7.68, grid: "J-8", kind: "deadend", r: 0.18 },
    { id: "chamber_j10", gx: 9.35, gy: 9.45, grid: "J-10", kind: "chamber", r: 0.3 },
    { id: "j_center", gx: 6.25, gy: 6.75, grid: "G-7", kind: "junction" },
    { id: "chamber_mid", gx: 5.02, gy: 5.85, grid: "F-6", kind: "chamber", r: 0.22 },
    { id: "j_nw", gx: 5.05, gy: 5.35, grid: "F-6", kind: "junction" },
    { id: "waters_room", gx: 4.08, gy: 4.4, grid: "E-5", kind: "chamber", r: 0.17 },
    { id: "pool_round", gx: 4.27, gy: 3.35, grid: "E-4", kind: "deadend", r: 0.21 },
    { id: "j_ne", gx: 8.32, gy: 5.75, grid: "I-6", kind: "junction" },
    { id: "exit_beaucedine", gx: 11.55, gy: 3.7, grid: "L-4", kind: "exit", to: "beaucedine_glacier" },
  ],
  edges: [
    { id: "e_exit_s", from: "exit_east_ronfaure", to: "j_south", pts: [[6.28, 11.65], [6.28, 11.52], [6.01, 11.19], [5.8, 10.76], [5.85, 10.35]] },
    { id: "e_out_corridor", from: "door_exit_only", to: "j_south", pts: [[4.55, 9.22], [4.85, 9.45], [4.85, 9.95], [5.15, 10.3], [5.5, 10.42], [5.85, 10.35]] },
    { id: "e_west_loop", from: "west_fork", to: "door_exit_only", oneWay: "west_fork->door_exit_only", pts: [[4.85, 8.55], [4.35, 8.75], [3.85, 8.88], [3.75, 9.15], [4.1, 9.3], [4.55, 9.22]] },
    { id: "e_in_corridor", from: "j_south", to: "room_inner", pts: [[5.85, 10.35], [5.95, 10], [5.7, 9.75], [5.35, 9.4]] },
    { id: "e_in_door", from: "room_inner", to: "west_fork", oneWay: "room_inner->west_fork", pts: [[5.35, 9.4], [5.25, 9.02], [5.05, 8.8], [4.85, 8.55]] },
    { id: "e_west_branch", from: "west_fork", to: "j_trunk_west", pts: [[4.85, 8.55], [4.94, 8.29], [5.31, 7.97], [5.53, 7.8], [6.23, 7.91], [6.78, 7.8]] },
    { id: "e_trunk_mid", from: "j_trunk_west", to: "j_qqq", pts: [[6.78, 7.8], [7.09, 8.34], [7.44, 8.65], [7.81, 8.81], [8.1, 8.78]] },
    { id: "e_spur_j8", from: "j_qqq", to: "deadend_j8", pts: [[8.1, 8.78], [8.29, 8.44], [8.77, 8.01], [8.98, 7.64], [9.46, 7.61], [9.55, 7.68]] },
    { id: "e_spur_j10", from: "j_qqq", to: "chamber_j10", pts: [[8.1, 8.78], [8.34, 9.23], [8.77, 9.45], [9.35, 9.45]] },
    { id: "e_trunk_n", from: "j_center", to: "j_trunk_west", pts: [[6.25, 6.75], [6.28, 7], [6.71, 7.43], [6.78, 7.8]] },
    { id: "e_center_nw", from: "j_center", to: "chamber_mid", pts: [[6.25, 6.75], [6.1, 6.6], [5.8, 6.3], [5.3, 6.1], [5.02, 5.85]] },
    { id: "e_mid_nw", from: "chamber_mid", to: "j_nw", pts: [[5.02, 5.85], [5.05, 5.6], [5.05, 5.35]] },
    { id: "e_nw_waters", from: "j_nw", to: "waters_room", pts: [[5.05, 5.35], [4.5, 5.2], [4.25, 4.75], [4.08, 4.4]] },
    { id: "e_waters_pool", from: "waters_room", to: "pool_round", width: 0.1, pts: [[4.08, 4.4], [4.25, 4.2], [4.27, 3.55], [4.27, 3.35]] },
    { id: "e_loop_upper", from: "j_nw", to: "j_ne", pts: [[5.05, 5.35], [5.6, 5.2], [5.75, 4.8], [5.85, 4.35], [6.2, 4.15], [6.7, 4.25], [6.85, 4.64], [7.5, 4.93], [8.08, 5.34], [8.32, 5.75]] },
    { id: "e_loop_lower", from: "j_center", to: "j_ne", pts: [[6.25, 6.75], [6.6, 6.65], [7.1, 6.6], [7.26, 6.27], [7.44, 5.92], [7.96, 5.9], [8.32, 5.75]] },
    { id: "e_ne_exit", from: "j_ne", to: "exit_beaucedine", pts: [[8.32, 5.75], [8.78, 5.46], [9.07, 5.05], [9.42, 4.7], [10, 4.7], [10.3, 4.46], [10.65, 4.11], [10.94, 3.7], [11.18, 3.64], [11.55, 3.7]] },
  ],
  pois: [
    { id: "waters_of_oblivion", gx: 4.05, gy: 4.35, grid: "E-5", label: "Waters of Oblivion (spawns Tros, quest Painful Memory, Bard AF1)" },
    { id: "qqq_blighted_gloom", gx: 8.1, gy: 8.78, grid: "I-9", label: "??? / Metallic Slime (quest Blighted Gloom)" },
    { id: "door_exit_only", gx: 4.55, gy: 9.22, grid: "E-10", label: "Door (Exit only)" },
    { id: "door_enter_only", gx: 5.25, gy: 9.02, grid: "F-10", label: "Door (Enter only)" },
    { id: "survival_guide", gx: 5.85, gy: 10.6, grid: "F-11", label: "Survival Guide" },
    { id: "nm_mucoid_mass", gx: 9.35, gy: 9.45, grid: "J-10", label: "Mucoid Mass (NM, timed 90-100 min)" },
    { id: "nm_hyakume", gx: 9.4, gy: 7.62, grid: "J-8", label: "Hyakume (NM, lottery on Hecteyes)" },
    { id: "nm_gloom_eye", gx: 5.4, gy: 7.9, grid: "F-8", label: "Gloom Eye (NM, lottery on Seeker Bats)" },
    { id: "nm_taisaijin", gx: 7.3, gy: 8.55, grid: "H-9", label: "Taisaijin (NM, morphs from Taisai)" },
  ],
};
const W = (gx: number, gy: number) => ({ x: PASS_X + gx * PASS_CELL, z: PASS_Z + gy * PASS_CELL });
export const gridToWorld = W;
export const worldToGrid = (x: number, z: number) => ({ gx: (x - PASS_X) / PASS_CELL, gy: (z - PASS_Z) / PASS_CELL });
type Seg = { ax: number; az: number; bx: number; bz: number; half: number; edge: string };
type Disc = { x: number; z: number; r: number; node: string };
export const PASS_SEGS: Seg[] = [];
export const PASS_DISCS: Disc[] = [];
for (const e of PASS_GRAPH.edges) {
  const half = ((e.width ?? PASS_WIDTH) * PASS_CELL) / 2;
  for (let i = 0; i + 1 < e.pts.length; i++) {
    const a = W(e.pts[i][0], e.pts[i][1]);
    const b = W(e.pts[i + 1][0], e.pts[i + 1][1]);
    PASS_SEGS.push({ ax: a.x, az: a.z, bx: b.x, bz: b.z, half, edge: e.id });
  }
}
for (const n of PASS_GRAPH.nodes) {
  if (!n.r) continue;
  const c = W(n.gx, n.gy);
  PASS_DISCS.push({ x: c.x, z: c.z, r: n.r * PASS_CELL, node: n.id });
}
function nearOnSeg(px: number, pz: number, s: Seg): { x: number; z: number } {
  const dx = s.bx - s.ax, dz = s.bz - s.az;
  const len2 = dx * dx + dz * dz;
  const t = len2 ? Math.max(0, Math.min(1, ((px - s.ax) * dx + (pz - s.az) * dz) / len2)) : 0;
  return { x: s.ax + t * dx, z: s.az + t * dz };
}
export function passClearance(x: number, z: number): number {
  let best = -Infinity;
  for (const s of PASS_SEGS) {
    const q = nearOnSeg(x, z, s);
    best = Math.max(best, s.half - Math.hypot(x - q.x, z - q.z));
  }
  for (const d of PASS_DISCS) best = Math.max(best, d.r - Math.hypot(x - d.x, z - d.z));
  return best;
}
export function inPassGraph(x: number, z: number, radius = 0): boolean {
  return passClearance(x, z) >= radius;
}
export function clampPassGraph(x: number, z: number, radius = 0): { x: number; z: number } {
  let best = -Infinity, cx = x, cz = z, room = 0;
  for (const s of PASS_SEGS) {
    const q = nearOnSeg(x, z, s);
    const c = s.half - Math.hypot(x - q.x, z - q.z);
    if (c > best) { best = c; cx = q.x; cz = q.z; room = s.half; }
  }
  for (const d of PASS_DISCS) {
    const c = d.r - Math.hypot(x - d.x, z - d.z);
    if (c > best) { best = c; cx = d.x; cz = d.z; room = d.r; }
  }
  if (best >= radius) return { x, z };
  const dx = x - cx, dz = z - cz, len = Math.hypot(dx, dz) || 1;
  const keep = Math.max(0, room - radius);
  return { x: cx + (dx / len) * keep, z: cz + (dz / len) * keep };
}
export type PassCamp = {
  id: "pass-mouth" | "pass-early" | "pass-mid" | "pass-deep" | "pass-pool" | "pass-glacier";
  node: string;
  /** Kept on the row. A camp is the nearest node along the tunnel, not this radius. */
  radius: number;
  /** Species ids fillPass places in this part of the pass. */
  monsters: readonly string[];
};

/** AFK camps. Monster lists follow fillPass's squares. Distance is along the tunnel, not a radius. */
export const PASS_CAMPS: readonly PassCamp[] = [
  { id: "pass-mouth", node: "j_south", radius: 0.5, monsters: ["pass-wind", "pass-blade"] },
  { id: "pass-early", node: "west_fork", radius: 0.65, monsters: ["pass-thug", "pass-weaver", "pass-oil"] },
  {
    id: "pass-mid",
    node: "j_trunk_west",
    radius: 0.7,
    monsters: ["pass-pathfinder", "pass-bats", "pass-mugger", "pass-gambler", "pass-leecher", "pass-ooze", "pass-seeker", "pass-stirge"],
  },
  {
    id: "pass-deep",
    node: "chamber_mid",
    radius: 0.6,
    monsters: [
      "pass-giant-scorpion", "pass-floating-eye", "pass-hecteyes", "pass-cave-scorpion",
      "pass-pathfinder", "pass-bats", "pass-shaman", "pass-smithy", "pass-furrier",
      "pass-mugger", "pass-gambler", "pass-leecher", "pass-seeker", "pass-stirge",
    ],
  },
  { id: "pass-pool", node: "waters_room", radius: 0.45, monsters: ["pass-evil-weapon", "pass-ooze"] },
  {
    id: "pass-glacier",
    node: "exit_beaucedine",
    radius: 0.75,
    monsters: ["pass-bat-eye", "pass-mucoid", "pass-taisai", "pass-floating-eye", "pass-seeker", "pass-stirge"],
  },
];

const CAMP_LINKS = new Map<string, { to: string; len: number }[]>();
function campTouch(id: string): { to: string; len: number }[] {
  const row = CAMP_LINKS.get(id);
  if (row) return row;
  const next: { to: string; len: number }[] = [];
  CAMP_LINKS.set(id, next);
  return next;
}
for (const edge of PASS_GRAPH.edges) {
  let len = 0;
  for (let i = 0; i + 1 < edge.pts.length; i++) {
    const a = W(edge.pts[i][0], edge.pts[i][1]);
    const b = W(edge.pts[i + 1][0], edge.pts[i + 1][1]);
    len += Math.hypot(a.x - b.x, a.z - b.z);
  }
  campTouch(edge.from).push({ to: edge.to, len });
  campTouch(edge.to).push({ to: edge.from, len });
}
const CAMP_DIST = new Map<string, Map<string, number>>();
for (const start of CAMP_LINKS.keys()) {
  const dist = new Map<string, number>([[start, 0]]);
  const used = new Set<string>();
  for (;;) {
    let best: string | null = null;
    let bestD = Infinity;
    for (const [id, d] of dist) {
      if (used.has(id) || d >= bestD) continue;
      best = id;
      bestD = d;
    }
    if (!best) break;
    used.add(best);
    for (const link of CAMP_LINKS.get(best) ?? []) {
      const next = bestD + link.len;
      if (next < (dist.get(link.to) ?? Infinity)) dist.set(link.to, next);
    }
  }
  CAMP_DIST.set(start, dist);
}

function alongEdge(x: number, z: number, pts: [number, number][]): { off: number; from: number; to: number } {
  let walked = 0;
  let bestOff = Infinity;
  let bestAt = 0;
  let total = 0;
  for (let i = 0; i + 1 < pts.length; i++) {
    const a = W(pts[i][0], pts[i][1]);
    const b = W(pts[i + 1][0], pts[i + 1][1]);
    const dx = b.x - a.x;
    const dz = b.z - a.z;
    const len2 = dx * dx + dz * dz;
    const len = Math.sqrt(len2);
    const t = len2 ? Math.max(0, Math.min(1, ((x - a.x) * dx + (z - a.z) * dz) / len2)) : 0;
    const qx = a.x + dx * t;
    const qz = a.z + dz * t;
    const off = Math.hypot(x - qx, z - qz);
    if (off < bestOff) {
      bestOff = off;
      bestAt = total + t * len;
    }
    total += len;
  }
  return { off: bestOff, from: bestAt, to: total - bestAt };
}

/** Camp whose node is closest along the tunnels. No radius. */
export function nearestPassCamp(x: number, z: number): (typeof PASS_CAMPS)[number]["id"] {
  let edge = PASS_GRAPH.edges[0];
  let hit = alongEdge(x, z, edge.pts);
  for (const next of PASS_GRAPH.edges) {
    const along = alongEdge(x, z, next.pts);
    if (along.off < hit.off) {
      edge = next;
      hit = along;
    }
  }
  const fromNode = CAMP_DIST.get(edge.from);
  const toNode = CAMP_DIST.get(edge.to);
  let best = PASS_CAMPS[0].id;
  let bestD = Infinity;
  for (const camp of PASS_CAMPS) {
    const viaFrom = hit.from + (fromNode?.get(camp.node) ?? Infinity);
    const viaTo = hit.to + (toNode?.get(camp.node) ?? Infinity);
    const dist = Math.min(viaFrom, viaTo);
    if (dist < bestD) {
      bestD = dist;
      best = camp.id;
    }
  }
  return best;
}

export function buildPassMask(res = 8): { res: number; n: number; data: Uint8Array } {
  const n = 15 * res;
  const data = new Uint8Array(n * n);
  for (let j = 0; j < n; j++)
    for (let i = 0; i < n; i++) {
      const p = W((i + 0.5) / res, (j + 0.5) / res);
      if (passClearance(p.x, p.z) >= 0) data[j * n + i] = 1;
    }
  return { res, n, data };
}
type Rect = { minX: number; maxX: number; minZ: number; maxZ: number };
export function passMaskRects(res = 16): Rect[] {
  const m = buildPassMask(res);
  const cell = PASS_CELL / res;
  const out: Rect[] = [];
  for (let j = 0; j < m.n; j++) {
    let i = 0;
    while (i < m.n) {
      if (!m.data[j * m.n + i]) { i++; continue; }
      const s = i;
      while (i < m.n && m.data[j * m.n + i]) i++;
      out.push({ minX: PASS_X + s * cell, maxX: PASS_X + i * cell, minZ: PASS_Z + j * cell, maxZ: PASS_Z + (j + 1) * cell });
    }
  }
  return out;
}

const m = buildPassMask(8); let c=0; for (const v of m.data) c+=v; console.log('cells',c,'strips',passMaskRects(16).length, inPassGraph(381.4,89.2), inPassGraph(491.6,-348.7), clampPassGraph(491.6,-348.7,2));
