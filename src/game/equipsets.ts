/**
 * Four equipment sets over one inventory. A slot left empty keeps the
 * piece already worn by the set underneath. The same item may be named
 * on more than one set. Clearing a slot does not create another copy.
 */
import { ITEMS, PAPER_DOLL, canEquipInSub, canWear, type Loadout, type Slot } from "./content";
import type { JobId } from "./stats";

export const EQUIP_MODES = ["tp", "ws", "magic", "idle"] as const;
export type EquipMode = (typeof EQUIP_MODES)[number];
export type EquipSets = Record<EquipMode, Loadout>;

export function emptyLoadout(): Loadout {
  return {
    main: null,
    sub: null,
    range: null,
    ammo: null,
    head: null,
    neck: null,
    ear1: null,
    ear2: null,
    body: null,
    hands: null,
    ring1: null,
    ring2: null,
    back: null,
    waist: null,
    legs: null,
    feet: null,
  };
}

export function emptyEquipSets(): EquipSets {
  return {
    tp: emptyLoadout(),
    ws: emptyLoadout(),
    magic: emptyLoadout(),
    idle: emptyLoadout(),
  };
}

function readPiece(raw: unknown, slot: Slot): string | null {
  if (typeof raw !== "string") return null;
  const item = ITEMS[raw];
  if (!item) return null;
  if (slot === "sub") return item.slot === "sub" || item.slot === "main" ? raw : null;
  return item.slot === slot ? raw : null;
}

export function sanitizeEquipSets(raw: unknown): EquipSets {
  const next = emptyEquipSets();
  if (!raw || typeof raw !== "object") return next;
  const rec = raw as Record<string, unknown>;
  for (const mode of EQUIP_MODES) {
    const row = rec[mode];
    if (!row || typeof row !== "object") continue;
    const slots = row as Record<string, unknown>;
    for (const slot of PAPER_DOLL) next[mode][slot] = readPiece(slots[slot], slot);
  }
  return next;
}

/** Drop pieces this job cannot wear. Empty slots stay empty. */
export function legalizeSet(set: Loadout, job: JobId, sub: JobId | null): Loadout {
  const next = emptyLoadout();
  for (const slot of PAPER_DOLL) {
    const id = set[slot];
    if (!id) continue;
    const item = ITEMS[id];
    if (!item || !canWear(item, job, sub)) continue;
    if (slot !== "sub" && item.slot !== slot) continue;
    next[slot] = id;
  }
  const main = next.main ? ITEMS[next.main] : null;
  if (main?.grip === "two") next.sub = null;
  else if (next.sub && main) {
    const off = ITEMS[next.sub];
    if (!off || !canEquipInSub(off, job, sub, main)) next.sub = null;
  }
  const seen = new Set<string>();
  for (const slot of PAPER_DOLL) {
    const id = next[slot];
    if (!id) continue;
    if (seen.has(id)) next[slot] = null;
    else seen.add(id);
  }
  return next;
}

export function legalizeEquipSets(sets: EquipSets, job: JobId, sub: JobId | null): EquipSets {
  return {
    tp: legalizeSet(sets.tp, job, sub),
    ws: legalizeSet(sets.ws, job, sub),
    magic: legalizeSet(sets.magic, job, sub),
    idle: legalizeSet(sets.idle, job, sub),
  };
}

/** Copy filled slots from `over` onto `base`. An empty slot keeps `base`. */
export function overlayGear(base: Loadout, over: Loadout, job: JobId, sub: JobId | null): Loadout {
  const next: Loadout = { ...base };
  for (const slot of PAPER_DOLL) {
    const id = over[slot];
    if (!id) continue;
    const item = ITEMS[id];
    if (!item || !canWear(item, job, sub)) continue;
    if (slot === "sub") {
      const mainItem = next.main ? ITEMS[next.main] : null;
      if (!canEquipInSub(item, job, sub, mainItem)) continue;
    } else if (item.slot !== slot) continue;
    for (const other of PAPER_DOLL) {
      if (next[other] === id) next[other] = null;
    }
    next[slot] = id;
  }
  const main = next.main ? ITEMS[next.main] : null;
  if (main?.grip === "two") next.sub = null;
  if (!next.main) next.main = base.main;
  if (next.sub && next.sub === next.main) next.sub = null;
  return next;
}

/** Gear worn underneath this set. Idle is the main set. TP, WS, and Magic fall back to it. */
export function underGear(mode: EquipMode, base: Loadout, sets: EquipSets, job: JobId, sub: JobId | null, _engaged?: boolean): Loadout {
  const idle = overlayGear(base, sets.idle, job, sub);
  if (mode === "idle") return base;
  return idle;
}

export function resolveGear(mode: EquipMode, base: Loadout, sets: EquipSets, job: JobId, sub: JobId | null, engaged: boolean): Loadout {
  return overlayGear(underGear(mode, base, sets, job, sub, engaged), sets[mode], job, sub);
}

export function assertEquipSets(): void {
  const base = emptyLoadout();
  base.main = "bronze-sword";
  base.body = "bronze-harness";
  const sets = emptyEquipSets();
  sets.tp = { ...emptyLoadout(), hands: "bronze-mittens" };
  sets.idle = { ...emptyLoadout(), feet: "bronze-leggings" };
  sets.ws = { ...emptyLoadout(), hands: "bronze-mittens" };
  const idle = resolveGear("idle", base, sets, "WAR", null, false);
  if (idle.main !== "bronze-sword" || idle.feet !== "bronze-leggings" || idle.hands !== null) throw new Error("idle empty keeps base");
  const tp = resolveGear("tp", base, sets, "WAR", null, true);
  if (tp.feet !== "bronze-leggings" || tp.hands !== "bronze-mittens" || tp.main !== "bronze-sword") throw new Error("tp keeps idle");
  const ws = resolveGear("ws", base, sets, "WAR", null, true);
  if (ws.hands !== "bronze-mittens" || ws.feet !== "bronze-leggings" || ws.body !== "bronze-harness") throw new Error("ws empty keeps idle");
  sets.ws.hands = null;
  const wsOpen = resolveGear("ws", base, sets, "WAR", null, true);
  if (wsOpen.hands !== null) throw new Error("ws does not take the tp piece");
  sets.tp.hands = null;
  const cleared = resolveGear("tp", base, sets, "WAR", null, true);
  if (cleared.hands !== null) throw new Error("clearing a set slot added a copy");
  const same = resolveGear("magic", base, { ...sets, magic: { ...emptyLoadout(), hands: "bronze-mittens" } }, "WAR", null, true);
  if (same.hands !== "bronze-mittens") throw new Error("one item on two sets");
  const old = sanitizeEquipSets(null);
  if (old.tp.main !== null || old.idle.body !== null) throw new Error("missing sets");
}
