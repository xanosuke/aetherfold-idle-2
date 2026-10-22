/**
 * Forest Tropical Rarab. Passive, the same as the training pair.
 * Walking past them does not open a fight. Engage only chooses one,
 * and that rabbit waits where it stands. The first swing, spell, or
 * ability claims it, and then it chases whoever holds that hate, the same
 * way a training rabbit does. Scent and the leash still watch you.
 * A sibling keeps patrolling. Claiming one
 * does not pull the others, even when they can see the fight.
 * Sleep is not on these bodies. Too-weak never claims.
 * The two training rabbits are a different pool. They stay passive and
 * they do not link to this pack, or to each other.
 *
 * Scent keeps a fight that already started, from any range, until Deodorize
 * (sight can still hold them if they are looking at you). A body more than
 * 50 yalms from its spawn, or a player who has left the forest, is leashed:
 * it drops the fight, walks home, and will not link again until it is home.
 * Patrol is a waypoint loop at walk speed. Chase uses the same run the
 * training rabbit uses, which is faster than the walk.
 * Respawn is 5 minutes, at the spawn point. Nothing here grants experience.
 */
import { aggros, angleFromForward, FOREST_HARE_DETECT, SIGHT_RANGE } from "./aggro";
import { checkCon } from "./commands";
import { HARE } from "./content";
import { hareMeleeRange } from "./distance";
import { HARE_CHASE_DELAY, HARE_CHASE_GAP, HARE_MELEE_INSET, HARE_RUN, HARE_WALK, harePace } from "./enmity";
import { BRIDGE_Z1, FOREST_EAST, FOREST_SOUTH, FOREST_WEST } from "./world";

/** Retail respawn on the Bibiki Bay listing. */
export const PACK_RESPAWN = 300;
/** Yalms from the spawn point. Past this, scent gives up and they walk home. */
export const PACK_LEASH = 50;
/** Seconds standing on a waypoint before the next leg. */
export const PACK_PAUSE = 4;

export type PackMode = "roam" | "chase" | "leash" | "dead";

export type PackPoint = { x: number; z: number };

export type PackBody = {
  id: string;
  /** Spawn is the first point. They pop here, and leash back to it. */
  points: readonly PackPoint[];
  spawnX: number;
  spawnZ: number;
  index: number;
  pause: number;
  x: number;
  z: number;
  yaw: number;
  hp: number;
  maxHp: number;
  mode: PackMode;
  scent: boolean;
  /** Seconds before the first step of a new chase. */
  lag: number;
  /** Seconds until the next swing. Counts only while chasing. */
  swing: number;
  respawn: number;
  /** Distance moved this tick. The engine plays the walk cycle from it. */
  moved: number;
};

export type PackEvent = { type: "bite" | "link" | "leash" | "pop" | "para"; id: string; target?: string };

export type PackWorld = {
  playerX: number;
  playerZ: number;
  playerLevel: number;
  playerKo: boolean;
  invisible: boolean;
  sneak: boolean;
  deodorize: boolean;
  playerInForest: boolean;
  /** Engaged, not yet claimed. That body waits. The player walks to it. */
  holdId?: string | null;
  /** Who a chase steps toward. Defaults to the player. A per-body answer wins. */
  focusX?: number;
  focusZ?: number;
  focusId?: string | null;
  /** This body's own hate holder. Null means the shared focus, then the player. */
  focusOf?: (id: string) => { x?: number | null; z?: number | null; id: string } | null;
  /** Sleep, bind, gravity, slow, and paralyze on this body. */
  modOf?: (id: string) => { halt?: boolean; pace?: number; delay?: number; para?: number } | null;
  /** A charmed body. It heels or stays, and it does not bite. */
  charmId?: string | null;
  charmX?: number;
  charmZ?: number;
  charmStance?: "heel" | "stay" | "fight" | null;
};

type PlateStatus = "patrol" | "chase" | "return" | "defeated" | "";

export type PackPlate = {
  id: string | null;
  hp: number;
  max: number;
  respawn: number;
  status: PlateStatus;
  swinging: boolean;
};

/**
 * Loops in the forest, south of the bridge. The first point is the spawn.
 * Kept off the bridge mouth so a patrol never walks into the training pen.
 */
const PATHS: readonly { id: string; points: readonly PackPoint[] }[] = [
  { id: "glen", points: [{ x: -18, z: 40 }, { x: -22, z: 48 }, { x: -14, z: 54 }, { x: -8, z: 46 }] },
  { id: "mouth", points: [{ x: -6, z: 24 }, { x: 4, z: 22 }, { x: 8, z: 30 }, { x: -2, z: 32 }] },
  { id: "east", points: [{ x: 14, z: 34 }, { x: 22, z: 40 }, { x: 16, z: 50 }, { x: 8, z: 42 }] },
  { id: "heart", points: [{ x: -4, z: 56 }, { x: 6, z: 52 }, { x: 8, z: 62 }, { x: -2, z: 64 }] },
  { id: "west-deep", points: [{ x: -22, z: 60 }, { x: -24, z: 68 }, { x: -14, z: 70 }, { x: -16, z: 60 }] },
  { id: "east-deep", points: [{ x: 12, z: 58 }, { x: 22, z: 64 }, { x: 18, z: 70 }, { x: 10, z: 64 }] },
  { id: "south", points: [{ x: -6, z: 68 }, { x: 4, z: 70 }, { x: 2, z: 62 }, { x: -8, z: 64 }] },
];

/** Forest rabbits stop at the tree line. They do not take the bridge. */
export function packClamp(x: number, z: number): PackPoint {
  return {
    x: Math.max(FOREST_WEST + 1.1, Math.min(FOREST_EAST - 1.1, x)),
    z: Math.max(BRIDGE_Z1 + 1.5, Math.min(FOREST_SOUTH - 1.1, z)),
  };
}

export function playerInForest(x: number, z: number): boolean {
  return x >= FOREST_WEST + 0.5 && x <= FOREST_EAST - 0.5 && z >= BRIDGE_Z1 + 0.4 && z <= FOREST_SOUTH - 0.4;
}

/** Yaw that looks from `from` toward `to`. Matches the training rabbit. */
export function faceYaw(fromX: number, fromZ: number, toX: number, toZ: number): number {
  return Math.atan2(fromX - toX, fromZ - toZ);
}

function forward(yaw: number): PackPoint {
  return { x: -Math.sin(yaw), z: -Math.cos(yaw) };
}

function turnTo(yaw: number, target: number, max: number): number {
  const d = Math.atan2(Math.sin(target - yaw), Math.cos(target - yaw));
  if (Math.abs(d) <= max) return target;
  return yaw + Math.sign(d) * max;
}

function moveToward(body: PackBody, tx: number, tz: number, pace: number, dt: number, stop: number): number {
  const dx = tx - body.x;
  const dz = tz - body.z;
  const dist = Math.hypot(dx, dz);
  if (dist <= stop + 1e-6) return 0;
  const step = Math.min(pace * dt, dist - stop);
  const nx = body.x + (dx / dist) * step;
  const nz = body.z + (dz / dist) * step;
  const held = packClamp(nx, nz);
  const moved = Math.hypot(held.x - body.x, held.z - body.z);
  body.x = held.x;
  body.z = held.z;
  return moved;
}

function makeBody(id: string, points: readonly PackPoint[], pause: number): PackBody {
  const spawn = points[0];
  const next = points[1] ?? spawn;
  return {
    id,
    points,
    spawnX: spawn.x,
    spawnZ: spawn.z,
    index: 1 % points.length,
    pause,
    x: spawn.x,
    z: spawn.z,
    yaw: faceYaw(spawn.x, spawn.z, next.x, next.z),
    hp: HARE.hpNatural,
    maxHp: HARE.hpNatural,
    mode: "roam",
    scent: false,
    lag: 0,
    swing: HARE.delay / 60,
    respawn: 0,
    moved: 0,
  };
}

export function createPack(): PackBody[] {
  return PATHS.map((path, i) => makeBody(path.id, path.points, (i % 4) * 1.1));
}

const live = createPack();

export function livePack(): PackBody[] {
  return live;
}

let selectedId: string | null = null;
let swingId: string | null = null;
/** Set once the player actually strikes this claim. Engage alone does not count. */
let actedId: string | null = null;

function setSwing(id: string | null): void {
  if (id !== swingId) actedId = null;
  swingId = id;
}

/** A melee swing, weapon skill, or spell on the rabbit you are fighting. That is the claim. Engage alone does not pull it. */
export function notePackAct(id: string): void {
  if (!id) return;
  const body = live.find((row) => row.id === id);
  if (!body || body.hp <= 0 || body.mode === "dead" || body.mode === "leash") return;
  if (swingId !== id) setSwing(id);
  actedId = id;
  selectedId = id;
  if (body.mode !== "chase") {
    const before = new Set(live.filter((row) => row.mode === "chase").map((row) => row.id));
    pullPack(live, id, 75);
    noteLinks(before, id);
  }
  refreshPlate();
}

export function readActedBody(): PackBody | null {
  const body = readSwingBody();
  if (!body || actedId !== body.id) return null;
  return body;
}

const EMPTY_PLATE: PackPlate = { id: null, hp: 0, max: 0, respawn: 0, status: "", swinging: false };
let plate: PackPlate = EMPTY_PLATE;
let plateKey = "0";
const listeners = new Set<() => void>();

function statusOf(body: PackBody | undefined): PlateStatus {
  if (!body) return "";
  if (body.hp <= 0 || body.mode === "dead") return "defeated";
  if (body.mode === "chase") return "chase";
  if (body.mode === "leash") return "return";
  return "patrol";
}

function refreshPlate() {
  const body = selectedId ? live.find((row) => row.id === selectedId) : undefined;
  const swinging = !!swingId && live.some((row) => row.id === swingId && row.hp > 0 && row.mode !== "dead" && row.mode !== "leash");
  const status = statusOf(body);
  const key = `${body?.id ?? ""}|${body?.hp ?? 0}|${Math.ceil(body?.respawn ?? 0)}|${status}|${swinging ? 1 : 0}`;
  if (key === plateKey) return;
  plateKey = key;
  plate = body
    ? { id: body.id, hp: body.hp, max: body.maxHp, respawn: body.respawn, status, swinging }
    : { ...EMPTY_PLATE, swinging };
  for (const fn of listeners) fn();
}

export function subscribePack(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function readPackPlate(): PackPlate {
  return plate;
}

export function selectPack(id: string | null): void {
  selectedId = id;
  refreshPlate();
}

export function clearPackSelection(): void {
  if (selectedId == null) return;
  selectedId = null;
  refreshPlate();
}

let queued: PackEvent[] = [];

function noteLinks(before: ReadonlySet<string>, claimed: string) {
  for (const body of live) {
    if (body.mode === "chase" && body.id !== claimed && !before.has(body.id)) queued.push({ type: "link", id: body.id });
  }
}

/** Line up a forest rabbit the way Engage lines up a training rabbit. It keeps walking until you actually hit it. */
export function engagePack(id: string, playerLevel: number): boolean {
  const body = live.find((row) => row.id === id);
  if (!body || body.hp <= 0 || body.mode === "dead" || body.mode === "leash") return false;
  if (tooWeak(playerLevel)) return false;
  setSwing(id);
  selectedId = id;
  refreshPlate();
  return true;
}

/** Claim the rabbit the player is swinging at, and remember who linked. */
export function claimLive(id: string, playerLevel: number): boolean {
  const before = new Set(live.filter((row) => row.mode === "chase").map((row) => row.id));
  if (!pullPack(live, id, playerLevel)) return false;
  noteLinks(before, id);
  if (swingId !== id) setSwing(id);
  actedId = id;
  selectedId = id;
  refreshPlate();
  return true;
}

export function readSwingBody(): PackBody | null {
  if (!swingId) return null;
  const body = live.find((row) => row.id === swingId);
  if (!body || body.hp <= 0 || body.mode === "dead" || body.mode === "leash") return null;
  return body;
}

/** The forest rabbit a weapon skill can strike. The one you are fighting, or the one on the target plate. */
export function readWsBody(): PackBody | null {
  const swinging = readSwingBody();
  if (swinging) return swinging;
  if (!selectedId) return null;
  const body = live.find((row) => row.id === selectedId);
  if (!body || body.hp <= 0 || body.mode === "dead" || body.mode === "leash") return null;
  return body;
}

function tooWeak(playerLevel: number): boolean {
  return checkCon(playerLevel, HARE.level) === "too-weak";
}

/** Claim one body. The others stay on patrol. */
export function pullPack(bodies: PackBody[], id: string, playerLevel: number): boolean {
  const body = bodies.find((row) => row.id === id);
  if (!body || body.hp <= 0 || body.mode === "dead" || body.mode === "leash") return false;
  if (tooWeak(playerLevel)) return false;
  if (body.mode !== "chase") {
    body.mode = "chase";
    body.lag = HARE_CHASE_DELAY;
    body.swing = HARE.delay / 60;
  }
  body.scent = true;
  return true;
}

function stillOn(body: PackBody, world: PackWorld): boolean {
  if (world.playerKo || !world.playerInForest) return false;
  if (Math.hypot(body.x - body.spawnX, body.z - body.spawnZ) > PACK_LEASH) return false;
  const dx = world.playerX - body.x;
  const dz = world.playerZ - body.z;
  const face = forward(body.yaw);
  const verdict = aggros({
    detect: FOREST_HARE_DETECT,
    playerLevel: world.playerLevel,
    mobLevel: HARE.level,
    distance: Math.hypot(dx, dz),
    sightAngle: angleFromForward(face.x, face.z, dx, dz),
    hpRatio: 1,
    invisible: world.invisible,
    sneak: world.sneak,
    deodorize: world.deodorize,
    castingMagic: false,
    indoors: false,
    hadAggro: true,
  });
  return verdict.aggro;
}

function beginLeash(body: PackBody) {
  body.mode = "leash";
  body.scent = false;
  body.lag = 0;
}

export function simulatePack(bodies: PackBody[], world: PackWorld, dt: number): PackEvent[] {
  const events: PackEvent[] = [];
  const melee = hareMeleeRange();
  const close = Math.max(HARE_CHASE_GAP, melee - HARE_MELEE_INSET);
  for (const body of bodies) {
    body.moved = 0;
    if (body.hp <= 0 || body.mode === "dead") {
      body.mode = "dead";
      body.hp = 0;
      body.respawn = Math.max(0, body.respawn - dt);
      if (body.respawn <= 0) {
        body.hp = body.maxHp;
        body.respawn = 0;
        body.x = body.spawnX;
        body.z = body.spawnZ;
        body.mode = "roam";
        body.scent = false;
        body.pause = PACK_PAUSE;
        body.index = 1 % body.points.length;
        body.yaw = faceYaw(body.x, body.z, body.points[body.index].x, body.points[body.index].z);
        body.swing = HARE.delay / 60;
        events.push({ type: "pop", id: body.id });
      }
      continue;
    }
    if (world.charmId && body.id === world.charmId) {
      if (world.charmStance === "stay" || world.charmX == null || world.charmZ == null) continue;
      let aimX = world.charmX;
      let aimZ = world.charmZ;
      let stop = 1.6;
      let pace: number = HARE_RUN;
      if (world.charmStance === "fight") {
        let foe: PackBody | null = null;
        let best = Infinity;
        for (const other of bodies) {
          if (other.id === body.id || other.hp <= 0 || other.mode === "dead") continue;
          const dist = Math.hypot(other.x - body.x, other.z - body.z);
          if (dist < best) {
            best = dist;
            foe = other;
          }
        }
        if (foe) {
          aimX = foe.x;
          aimZ = foe.z;
          stop = 2.2;
          pace = harePace(best, melee, 1);
        }
      }
      body.yaw = turnTo(body.yaw, faceYaw(body.x, body.z, aimX, aimZ), 12 * dt);
      body.moved = moveToward(body, aimX, aimZ, pace, dt, stop);
      continue;
    }
    if (body.mode === "chase") {
      if (!stillOn(body, world)) {
        beginLeash(body);
        events.push({ type: "leash", id: body.id });
      } else {
        const aimed = world.focusOf?.(body.id) ?? null;
        const aimX = aimed && aimed.x != null ? aimed.x : (world.focusX ?? world.playerX);
        const aimZ = aimed && aimed.z != null ? aimed.z : (world.focusZ ?? world.playerZ);
        const aimId = aimed?.id || world.focusId || "player";
        const mod = world.modOf?.(body.id) ?? null;
        const want = faceYaw(body.x, body.z, aimX, aimZ);
        body.yaw = turnTo(body.yaw, want, 12 * dt);
        if (mod?.halt) {
          body.moved = 0;
          continue;
        }
        if (body.lag > 0) {
          body.lag = Math.max(0, body.lag - dt);
        } else {
          const delay = Math.max(1, mod?.delay ?? 1);
          const paceMul = mod?.pace ?? 1;
          const dist = Math.hypot(aimX - body.x, aimZ - body.z);
          const pace = harePace(dist, melee, 1) * paceMul;
          body.moved = moveToward(body, aimX, aimZ, pace, dt, close);
          body.swing -= dt / delay;
          const now = Math.hypot(aimX - body.x, aimZ - body.z);
          if (body.swing <= 0 && now <= melee) {
            body.swing = (HARE.delay / 60) * delay;
            if ((mod?.para ?? 0) > 0 && Math.random() * 100 < (mod?.para ?? 0)) {
              events.push({ type: "para", id: body.id });
            } else events.push({ type: "bite", id: body.id, target: aimId });
          } else if (body.swing < 0) body.swing = 0;
        }
        continue;
      }
    }
    if (body.mode === "leash") {
      const home = Math.hypot(body.spawnX - body.x, body.spawnZ - body.z);
      if (home <= 0.35) {
        body.x = body.spawnX;
        body.z = body.spawnZ;
        body.mode = "roam";
        body.pause = PACK_PAUSE;
        body.moved = 0;
      } else {
        body.yaw = turnTo(body.yaw, faceYaw(body.x, body.z, body.spawnX, body.spawnZ), 3.2 * dt);
        body.moved = moveToward(body, body.spawnX, body.spawnZ, HARE_WALK, dt, 0);
        if (Math.hypot(body.spawnX - body.x, body.spawnZ - body.z) <= 0.35) {
          body.x = body.spawnX;
          body.z = body.spawnZ;
          body.mode = "roam";
          body.pause = PACK_PAUSE;
        }
      }
      continue;
    }
    if (world.holdId && body.id === world.holdId) continue;
    const next = body.points[body.index];
    if (body.pause > 0) {
      body.pause = Math.max(0, body.pause - dt);
      continue;
    }
    const remain = Math.hypot(next.x - body.x, next.z - body.z);
    if (remain <= 0.4) {
      body.pause = PACK_PAUSE;
      body.index = (body.index + 1) % body.points.length;
      continue;
    }
    body.yaw = turnTo(body.yaw, faceYaw(body.x, body.z, next.x, next.z), 3.2 * dt);
    body.moved = moveToward(body, next.x, next.z, HARE_WALK, dt, 0);
  }
  return events;
}

export function tickLive(world: PackWorld, dt: number): PackEvent[] {
  const holdId = swingId && actedId !== swingId ? swingId : null;
  const events = queued.splice(0, queued.length).concat(simulatePack(live, { ...world, holdId }, dt));
  if (swingId) {
    const body = live.find((row) => row.id === swingId);
    if (!body || body.hp <= 0 || body.mode === "dead" || body.mode === "leash") setSwing(null);
  }
  refreshPlate();
  return events;
}

/** Engage key while a forest rabbit is the target. Null lets the training fight handle it. */
export function togglePackEngage(playerLevel: number, ko: boolean): "claim" | "drop" | "keep" | null {
  if (ko) return null;
  const selected = selectedId ? live.find((row) => row.id === selectedId) : undefined;
  if (selectedId) {
    if (selected && selected.hp > 0 && selected.mode !== "leash" && selected.mode !== "dead") {
      if (swingId === selected.id) {
        setSwing(null);
        refreshPlate();
        return "drop";
      }
      if (!tooWeak(playerLevel)) {
        engagePack(selected.id, playerLevel);
        return "claim";
      }
      refreshPlate();
      return "keep";
    }
    if (swingId) setSwing(null);
    refreshPlate();
    return "keep";
  }
  if (swingId) {
    setSwing(null);
    refreshPlate();
    return "drop";
  }
  return null;
}

export function hurtPack(id: string, dmg: number): boolean {
  const body = live.find((row) => row.id === id);
  if (!body || body.hp <= 0) return false;
  const n = Math.floor(dmg);
  if (n <= 0) return false;
  if (body.hp > n) {
    body.hp -= n;
    refreshPlate();
    return false;
  }
  body.hp = 0;
  body.mode = "dead";
  body.scent = false;
  body.respawn = PACK_RESPAWN;
  body.moved = 0;
  if (swingId === id) setSwing(null);
  refreshPlate();
  return true;
}

export function assertPack(): void {
  if (FOREST_HARE_DETECT.aggressive || !FOREST_HARE_DETECT.sight || !FOREST_HARE_DETECT.scent) {
    throw new Error("pack detect");
  }
  if (PATHS.length < 5) throw new Error("pack count");
  const seen = new Set<string>();
  for (const path of PATHS) {
    if (seen.has(path.id) || path.points.length < 3) throw new Error("pack path");
    seen.add(path.id);
    for (let i = 0; i < path.points.length; i++) {
      const point = path.points[i];
      const held = packClamp(point.x, point.z);
      if (held.x !== point.x || held.z !== point.z) throw new Error("pack outside");
      const next = path.points[(i + 1) % path.points.length];
      const leg = Math.hypot(next.x - point.x, next.z - point.z);
      if (leg < 4 || leg > 18) throw new Error("pack leg");
    }
  }
  const quiet = (over: Partial<PackWorld> = {}): PackWorld => ({
    playerX: 0,
    playerZ: 80,
    playerLevel: 75,
    playerKo: false,
    invisible: false,
    sneak: false,
    deodorize: false,
    playerInForest: false,
    ...over,
  });

  const roam = createPack().slice(0, 1);
  const walker = roam[0];
  walker.pause = 0;
  const fromX = walker.x;
  const fromZ = walker.z;
  simulatePack(roam, quiet({ playerInForest: true, playerX: walker.x, playerZ: walker.z + 2 }), 1);
  const walked = Math.hypot(walker.x - fromX, walker.z - fromZ);
  if (Math.abs(walked - HARE_WALK) > 0.05) throw new Error("patrol walk");
  if (walker.mode !== "roam") throw new Error("sight does not pull");

  const chase = createPack().slice(0, 1);
  const runner = chase[0];
  runner.x = runner.spawnX;
  runner.z = runner.spawnZ;
  if (!pullPack(chase, runner.id, 75)) throw new Error("claim");
  runner.lag = 0;
  const rx = runner.x;
  const rz = runner.z;
  const playerX = runner.x;
  const playerZ = runner.z - 20;
  simulatePack(chase, quiet({ playerX, playerZ, playerInForest: true }), 1);
  const ran = Math.hypot(runner.x - rx, runner.z - rz);
  const expected = harePace(20, hareMeleeRange(), 1);
  if (expected !== 10) throw new Error("chase is the run");
  if (Math.abs(ran - expected) > 0.05) throw new Error("chase speed");
  if (ran <= walked) throw new Error("walk is slower than chase");

  const aimed = createPack().slice(0, 1);
  const biter = aimed[0];
  pullPack(aimed, biter.id, 75);
  biter.lag = 0;
  biter.swing = 99;
  const sx = biter.x;
  const sz = biter.z;
  simulatePack(aimed, quiet({
    playerX: sx,
    playerZ: sz - 20,
    playerInForest: true,
    focusX: sx + 12,
    focusZ: sz,
    focusId: "curilla",
  }), 1);
  if (biter.x - sx < 8) throw new Error("chase follows hate");
  if (Math.abs(biter.z - sz) > 1) throw new Error("chase ignores the player");
  biter.x = sx + 11;
  biter.z = sz;
  biter.swing = 0;
  const bites = simulatePack(aimed, quiet({
    playerX: sx,
    playerZ: sz - 20,
    playerInForest: true,
    focusX: sx + 12,
    focusZ: sz,
    focusId: "curilla",
  }), 0.05);
  const bite = bites.find((row) => row.type === "bite");
  if (!bite || bite.target !== "curilla") throw new Error("bite faces hate");

  const pack = createPack();
  const lead = pack[0];
  const mate = pack[1];
  lead.x = -10;
  lead.z = 40;
  lead.pause = 30;
  mate.x = -10;
  mate.z = 48;
  mate.pause = 30;
  mate.yaw = faceYaw(mate.x, mate.z, mate.x, mate.z + 5);
  pullPack(pack, lead.id, 75);
  if ((mate.mode as string) === "chase") throw new Error("back does not link");
  mate.yaw = faceYaw(mate.x, mate.z, lead.x, lead.z);
  simulatePack(pack, quiet({ playerX: lead.x, playerZ: lead.z - 3, playerInForest: true }), 0.02);
  if ((mate.mode as string) === "chase") throw new Error("a sibling does not link");
  const away = createPack();
  const a = away[0];
  const b = away[1];
  a.x = -10;
  a.z = 40;
  a.pause = 30;
  b.x = -10;
  b.z = 48;
  b.pause = 30;
  b.yaw = faceYaw(b.x, b.z, b.x, b.z + 5);
  pullPack(away, a.id, 75);
  simulatePack(away, quiet({ playerX: a.x, playerZ: a.z - 3, playerInForest: true }), 0.02);
  if (b.mode === "chase") throw new Error("stays blind");
  const far = createPack();
  far[0].x = -10;
  far[0].z = 40;
  far[0].pause = 30;
  far[1].x = -10;
  far[1].z = 40 + SIGHT_RANGE + 1;
  far[1].pause = 30;
  far[1].yaw = faceYaw(far[1].x, far[1].z, far[0].x, far[0].z);
  pullPack(far, far[0].id, 75);
  simulatePack(far, quiet({ playerX: far[0].x, playerZ: far[0].z - 3, playerInForest: true }), 0.02);
  if (far[1].mode === "chase") throw new Error("past sight link");

  const weak = createPack().slice(0, 2);
  weak[0].pause = 30;
  weak[1].x = weak[0].x;
  weak[1].z = weak[0].z + 6;
  weak[1].pause = 30;
  weak[1].yaw = faceYaw(weak[1].x, weak[1].z, weak[0].x, weak[0].z);
  if (pullPack(weak, weak[0].id, 99)) throw new Error("too weak claim");
  simulatePack(weak, quiet({ playerLevel: 99, playerX: weak[0].x, playerZ: weak[0].z - 2, playerInForest: true }), 0.05);
  if (weak[1].mode === "chase") throw new Error("too weak link");

  const nose = createPack().slice(0, 1);
  const kept = nose[0];
  kept.x = kept.spawnX;
  kept.z = kept.spawnZ;
  pullPack(nose, kept.id, 75);
  kept.lag = 0;
  const behind = kept.spawnZ + 30;
  simulatePack(nose, quiet({ playerX: kept.spawnX, playerZ: behind, playerInForest: true }), 0.05);
  if ((kept.mode as string) !== "chase") throw new Error("scent keeps");
  kept.x = kept.spawnX + PACK_LEASH + 1;
  simulatePack(nose, quiet({ playerX: kept.x, playerZ: kept.z, playerInForest: true }), 0.05);
  if ((kept.mode as string) !== "leash") throw new Error("leash at 50");
  const gate = createPack().slice(0, 1);
  const edge = gate[0];
  pullPack(gate, edge.id, 75);
  edge.x = edge.spawnX + 3;
  simulatePack(gate, quiet({ playerX: edge.x, playerZ: edge.z, playerInForest: false }), 0.05);
  if (edge.mode !== "leash") throw new Error("bridge leash");
  const home = createPack().slice(0, 1)[0];
  const going = [home];
  home.mode = "leash";
  home.x = home.spawnX;
  home.z = home.spawnZ + 2;
  simulatePack(going, quiet(), 1);
  if ((home.mode as string) !== "roam" || Math.hypot(home.x - home.spawnX, home.z - home.spawnZ) > 0.36) throw new Error("walks home");

  const cold = createPack().slice(0, 1);
  const lost = cold[0];
  lost.x = lost.spawnX;
  lost.z = lost.spawnZ;
  pullPack(cold, lost.id, 75);
  lost.x = lost.spawnX + 3;
  lost.yaw = faceYaw(lost.x, lost.z, lost.x, lost.z + 5);
  simulatePack(cold, quiet({
    playerX: lost.x,
    playerZ: lost.z - 8,
    playerInForest: true,
    deodorize: true,
    invisible: true,
  }), 0.05);
  if (lost.mode !== "leash") throw new Error("deodorize drops scent");

  const returning = createPack().slice(0, 2);
  returning[0].mode = "chase";
  returning[0].scent = true;
  returning[0].x = -10;
  returning[0].z = 40;
  returning[1].mode = "leash";
  returning[1].x = -10;
  returning[1].z = 46;
  returning[1].yaw = faceYaw(returning[1].x, returning[1].z, returning[0].x, returning[0].z);
  returning[1].spawnX = -10;
  returning[1].spawnZ = 70;
  simulatePack(returning, quiet({ playerX: -10, playerZ: 36, playerInForest: true }), 0.02);
  if (returning[1].mode !== "leash") throw new Error("no link on the way home");

  const dead = createPack().slice(0, 1);
  dead[0].hp = 0;
  dead[0].mode = "dead";
  dead[0].respawn = PACK_RESPAWN;
  simulatePack(dead, quiet(), 1);
  if (dead[0].hp !== 0 || Math.abs(dead[0].respawn - (PACK_RESPAWN - 1)) > 1e-6) throw new Error("respawn waits");
  dead[0].respawn = 0.5;
  simulatePack(dead, quiet(), 0.5);
  if (dead[0].hp !== dead[0].maxHp || (dead[0].mode as string) !== "roam") throw new Error("respawn at spawn");
  if (dead[0].x !== dead[0].spawnX || dead[0].z !== dead[0].spawnZ) throw new Error("pop at spawn");

  if (live.some((row) => row.mode !== "roam" || row.hp !== row.maxHp)) throw new Error("live pack untouched");
  const snap = live.map((row) => ({ ...row }));
  const held = live[0];
  if (!engagePack(held.id, 75)) throw new Error("engage");
  if (held.mode !== "roam" || readActedBody()) throw new Error("engage pulled");
  if (readSwingBody()?.id !== held.id) throw new Error("engage target");
  const hx = held.x;
  const hz = held.z;
  tickLive(quiet({ playerInForest: true, playerX: hx + 8, playerZ: hz, playerLevel: 75 }), 1);
  if (held.mode !== "roam" || held.x !== hx || held.z !== hz) throw new Error("engage chased");
  notePackAct(held.id);
  if ((held.mode as string) !== "chase" || !readActedBody()) throw new Error("action did not claim");
  for (const row of snap) {
    const body = live.find((liveRow) => liveRow.id === row.id);
    if (body) Object.assign(body, row);
  }
  setSwing(null);
  selectedId = null;
  refreshPlate();
  if (live.some((row) => row.mode !== "roam" || row.hp !== row.maxHp)) throw new Error("engage test left the pack");
  if (PACK_RESPAWN !== 300 || PACK_LEASH !== 50 || HARE_WALK !== 4) throw new Error("pack constants");

  const charmed = createPack().slice(0, 1);
  const pet = charmed[0];
  pet.pause = 0;
  const cx = pet.x;
  const cz = pet.z;
  const heldCharm = simulatePack(charmed, quiet({
    playerInForest: true,
    playerX: cx,
    playerZ: cz,
    charmId: pet.id,
    charmX: cx + 10,
    charmZ: cz,
    charmStance: "heel",
  }), 1);
  if (heldCharm.some((row) => row.type === "bite")) throw new Error("charm does not bite");
  if (pet.mode !== "roam") throw new Error("charm is not a chase");
  if (Math.hypot(pet.x - cx, pet.z - cz) < 1) throw new Error("charm heels");
  const stayed = createPack().slice(0, 1);
  const still = stayed[0];
  still.pause = 0;
  const stayX = still.x;
  const stayZ = still.z;
  simulatePack(stayed, quiet({
    playerInForest: true,
    charmId: still.id,
    charmX: stayX + 8,
    charmZ: stayZ,
    charmStance: "stay",
  }), 1);
  if (still.x !== stayX || still.z !== stayZ) throw new Error("charm stay");
}
