/**
 * Skillchain window shared by the player and trusts.
 * Each enemy keeps its own window. A weapon skill on one body does not
 * close, or wipe, the resonance on another.
 * The first weapon skill opens its properties. The next one, inside the
 * window, closes a chain or replaces the opener. A closed chain is what
 * a spell can magic burst.
 *
 * A weaponskill checks its primary property first, then secondary, then
 * tertiary. Each of those is tried against the properties still open.
 * Once a chain forms, only that result stays on the target.
 *
 * Pairs are opening property, then closing property.
 * The level 1 table is the 19 combinations on BG-Wiki's skillchain chart.
 * Level 2 continues around Fusion, Gravitation, Fragmentation, Distortion.
 * Light and Darkness are level 3. Light into Light is Radiance.
 * Darkness into Darkness is Umbra.
 *
 * The next weapon skill skillchains only from 3 to 10 seconds after the
 * previous one connects. BG-Wiki calls that the 3–10 second window.
 * The weapon-skill lock is 2 seconds, so a follow-up pressed the moment
 * you can act is still early. If that swing would close, it is held and
 * lands when the window opens. It does not chain before 3 seconds, and it
 * does not wipe the resonance. A swing that cannot chain still replaces it.
 * A magic burst is a separate 10 seconds, starting the moment the closing
 * weapon skill's chain connects. Another weapon skill ends that burst early.
 * A skill with no properties, such as Spirits Within, does not.
 */

/** Earliest a following weapon skill can skillchain. Seconds. */
export const CHAIN_MIN = 3;
/** Latest a following weapon skill can skillchain. Seconds. */
export const CHAIN_MAX = 10;
/** Magic burst window after the closing weapon skill connects. Seconds. */
export const BURST_WINDOW = 10;

export const CHAIN_PROPERTIES = [
  "Transfixion",
  "Compression",
  "Liquefaction",
  "Scission",
  "Reverberation",
  "Detonation",
  "Induration",
  "Impaction",
  "Fusion",
  "Fragmentation",
  "Distortion",
  "Gravitation",
  "Light",
  "Darkness",
  "Radiance",
  "Umbra",
] as const;

const PAIRS: Record<string, string> = {
  "Compression|Transfixion": "Transfixion",
  "Impaction|Liquefaction": "Liquefaction",
  "Scission|Liquefaction": "Liquefaction",
  "Reverberation|Impaction": "Impaction",
  "Induration|Impaction": "Impaction",
  "Impaction|Detonation": "Detonation",
  "Compression|Detonation": "Detonation",
  "Scission|Detonation": "Detonation",
  "Transfixion|Compression": "Compression",
  "Induration|Compression": "Compression",
  "Liquefaction|Scission": "Scission",
  "Detonation|Scission": "Scission",
  "Transfixion|Reverberation": "Reverberation",
  "Scission|Reverberation": "Reverberation",
  "Reverberation|Induration": "Induration",
  "Liquefaction|Impaction": "Fusion",
  "Distortion|Fusion": "Fusion",
  "Induration|Reverberation": "Fragmentation",
  "Gravitation|Fragmentation": "Fragmentation",
  "Detonation|Compression": "Gravitation",
  "Fusion|Gravitation": "Gravitation",
  "Transfixion|Scission": "Distortion",
  "Fragmentation|Distortion": "Distortion",
  "Fusion|Fragmentation": "Light",
  "Fragmentation|Fusion": "Light",
  "Gravitation|Distortion": "Darkness",
  "Distortion|Gravitation": "Darkness",
  "Light|Light": "Radiance",
  "Darkness|Darkness": "Umbra",
};

const BURST: Record<string, readonly string[]> = {
  Transfixion: ["light"],
  Compression: ["dark"],
  Liquefaction: ["fire"],
  Impaction: ["thunder"],
  Scission: ["earth"],
  Detonation: ["wind"],
  Induration: ["ice"],
  Reverberation: ["water"],
  Fusion: ["fire", "light"],
  Fragmentation: ["thunder", "wind"],
  Distortion: ["ice", "water"],
  Gravitation: ["earth", "dark"],
  Light: ["fire", "wind", "thunder", "light"],
  Darkness: ["earth", "water", "ice", "dark"],
  Radiance: ["fire", "wind", "thunder", "light"],
  Umbra: ["earth", "water", "ice", "dark"],
};

/**
 * Share of the closing weapon skill's damage.
 * Columns are the chain's level. Rows are how many weapon skills are in it,
 * starting at 2. This is the published step table.
 */
const CHAIN_MULT: Record<number, readonly number[]> = {
  1: [0.5, 0.6, 0.7, 0.8, 0.9, 1],
  2: [0.6, 0.75, 1, 1.25, 1.5, 1.75],
  3: [1, 1.5, 1.75, 2, 2.25, 2.5],
  4: [1.5, 1.8, 2.1, 2.4, 2.7, 3],
};

export function chainLevel(name: string): number {
  if (name === "Radiance" || name === "Umbra") return 4;
  if (name === "Light" || name === "Darkness") return 3;
  if (name === "Fusion" || name === "Fragmentation" || name === "Distortion" || name === "Gravitation") return 2;
  return 1;
}

export function chainDamage(name: string, step: number, closing: number): number {
  const row = CHAIN_MULT[chainLevel(name)] ?? CHAIN_MULT[1];
  const index = Math.min(7, Math.max(2, step)) - 2;
  return Math.max(0, Math.floor(closing * row[index]));
}

type OpenChain = {
  props: string[];
  /** Seconds since this property was applied. */
  age: number;
  name: string | null;
  elements: readonly string[];
  step: number;
  /** Magic burst seconds still left. Zero unless this property is a closed chain. */
  burst: number;
  /** Wild Flourish. Level 1 Chainbound, closable immediately, gone after 10 seconds. */
  chainbound?: boolean;
};

type HeldClose = { props: string[]; damage: number; owner: string };

export type ChainBloom = { name: string; damage: number; owner: string; target: string };

/** Held is the chain that will land. Resonating is a fresh opener. */
export type ChainNote = { held: string | null; resonating: readonly string[] | null };

type Book = { open: OpenChain | null; queue: HeldClose[] };

let open: OpenChain | null = null;
let queue: HeldClose[] = [];
let bloom: ChainBloom | null = null;
const bloomQueue: ChainBloom[] = [];
const pendingDamage: ChainBloom[] = [];
let note: ChainNote | null = null;
let currentId = "hare";
const extra = new Map<string, Book>();

/** The window these calls read. A missing id is the training dummy. */
function focus(id = "hare") {
  const nextId = id || "hare";
  if (nextId === currentId) return;
  extra.set(currentId, { open, queue });
  const next = extra.get(nextId) ?? { open: null, queue: [] };
  extra.delete(nextId);
  open = next.open;
  queue = next.queue;
  currentId = nextId;
}

function bookIds(): string[] {
  const ids = new Set<string>([currentId, "hare", ...extra.keys()]);
  return [...ids];
}

export function chainResult(opening: readonly string[], closing: readonly string[]): string | null {
  for (const second of closing) {
    for (const first of opening) {
      const name = PAIRS[`${first}|${second}`];
      if (name) return name;
    }
  }
  return null;
}

export function resetSkillchain(): void {
  open = null;
  queue = [];
  bloom = null;
  bloomQueue.length = 0;
  pendingDamage.length = 0;
  note = null;
  extra.clear();
  currentId = "hare";
}

export type SkillchainSave = {
  props: string[];
  age: number;
  name: string | null;
  elements: string[];
  step: number;
  burst: number;
  chainbound?: boolean;
};

/** The training dummy's resonance, if any. Held closers are not part of the save. */
export function skillchainSnapshot(): SkillchainSave | null {
  focus("hare");
  if (!open) return null;
  const props = open.props.filter((name) => (CHAIN_PROPERTIES as readonly string[]).includes(name));
  if (!props.length) return null;
  const name = open.name && (CHAIN_PROPERTIES as readonly string[]).includes(open.name) ? open.name : null;
  return {
    props: [...props],
    age: open.age,
    name,
    elements: [...open.elements],
    step: open.step,
    burst: open.burst,
    chainbound: open.chainbound === true,
  };
}

/** Replace the training dummy's chain. A bad snapshot clears it instead of throwing. */
export function restoreSkillchain(raw: SkillchainSave | null): void {
  resetSkillchain();
  if (!raw || !raw.props.length) return;
  const props = raw.props.filter((name) => (CHAIN_PROPERTIES as readonly string[]).includes(name));
  if (!props.length) return;
  const name = raw.name && (CHAIN_PROPERTIES as readonly string[]).includes(raw.name) ? raw.name : null;
  open = {
    props,
    age: raw.age,
    name,
    elements: raw.elements.filter((name) => typeof name === "string"),
    step: raw.step,
    burst: raw.burst,
    chainbound: raw.chainbound === true,
  };
}

function closeNow(name: string, step: number, closingDamage: number, owner: string): ChainBloom {
  const hit = { name, damage: chainDamage(name, step, closingDamage), owner, target: currentId };
  if (bloom) bloomQueue.push(hit);
  else bloom = hit;
  open = { props: [name], age: 0, name, elements: BURST[name] ?? [], step, burst: BURST_WINDOW };
  return hit;
}

function resonanceNow(): readonly string[] | null {
  if (!open) return null;
  if (open.age > CHAIN_MAX && queue.length === 0) return null;
  let props = open.props;
  for (const row of queue) {
    const name = chainResult(props, row.props);
    if (!name) break;
    props = [name];
  }
  return props;
}

/** What the next weapon skill is matched against, after closers already waiting. */
export function resonanceProps(target = "hare"): readonly string[] | null {
  focus(target);
  return resonanceNow();
}

/** 0 when these properties do not chain. Otherwise the level of the result. */
export function chainRank(opening: readonly string[], closing: readonly string[]): number {
  const name = chainResult(opening, closing);
  return name ? chainLevel(name) : 0;
}

function ageBook(step: number): ChainBloom | null {
  if (!open) {
    queue = [];
    return null;
  }
  open.age += step;
  if (open.burst > 0) open.burst = Math.max(0, open.burst - step);
  if (queue.length > 0 && open.age >= CHAIN_MIN && open.age <= CHAIN_MAX) {
    const next = queue.shift()!;
    const closed = chainResult(open.props, next.props);
    if (closed) return closeNow(closed, open.step + 1, next.damage, next.owner);
    queue = [];
  }
  if (open.age > CHAIN_MAX && open.burst <= 0) {
    open = null;
    queue = [];
  }
  return null;
}

/** Drop one enemy's window. The training pair is left alone. */
export function clearChain(id: string): void {
  if (!id || id === "hare" || id === "kin") return;
  focus(id);
  open = null;
  queue = [];
  focus("hare");
  extra.delete(id);
  for (let i = pendingDamage.length - 1; i >= 0; i--) {
    if (pendingDamage[i]?.target === id) pendingDamage.splice(i, 1);
  }
}

/** Age every enemy's window. One close is returned. Another waits for the next call. */
export function tickSkillchain(dt: number): ChainBloom | null {
  const step = Math.max(0, dt);
  const hits: ChainBloom[] = [];
  for (const id of bookIds()) {
    focus(id);
    const hit = ageBook(step);
    if (hit) hits.push(hit);
  }
  focus("hare");
  pendingDamage.push(...hits);
  return pendingDamage.shift() ?? null;
}

/** A connecting weapon skill. A close returns the chain. A miss is not offered. */
export function offerWeaponSkill(props: readonly string[], closingDamage = 0, owner = "player", target = "hare"): ChainBloom | null {
  focus(target);
  const next = props.filter((name) => name.length > 0);
  if (!next.length) return null;
  if (open?.chainbound && open.age <= CHAIN_MAX) {
    const levelOne = next.find((name) => chainLevel(name) === 1);
    queue = [];
    note = null;
    if (levelOne) return closeNow(levelOne, 2, closingDamage, owner);
    open = null;
  }
  note = null;
  const current = open;
  if (current && current.age <= CHAIN_MAX) {
    const opening = resonanceNow() ?? current.props;
    const predicted = chainResult(opening, next);
    if (predicted && (current.age < CHAIN_MIN || queue.length > 0)) {
      queue.push({ props: [...next], damage: closingDamage, owner });
      note = { held: predicted, resonating: null };
      return null;
    }
    if (predicted && current.age >= CHAIN_MIN && queue.length === 0) {
      return closeNow(predicted, current.step + 1, closingDamage, owner);
    }
  }
  queue = [];
  open = { props: [...next], age: 0, name: null, elements: [], step: 1, burst: 0 };
  note = { held: null, resonating: [...next] };
  return null;
}

function windowOpenNow(): boolean {
  if (!open || queue.length > 0) return false;
  if (open.chainbound) return open.age <= CHAIN_MAX;
  return open.age >= CHAIN_MIN && open.age <= CHAIN_MAX;
}

/** True when a following weapon skill is inside the 3–10 second window. */
export function chainWindowOpen(target = "hare"): boolean {
  focus(target);
  return windowOpenNow();
}

/** The chain a closer would make right now. Null when the window is shut or the properties miss. */
export function peekChain(props: readonly string[], target = "hare"): string | null {
  focus(target);
  if (!windowOpenNow() || !open) return null;
  if (open.chainbound) return props.find((name) => chainLevel(name) === 1) ?? null;
  return chainResult(open.props, props);
}

/** A skillchain or a magic-burst window is already on this foe. Wild Flourish then does nothing. */
export function chainIsOpen(target = "hare"): boolean {
  focus(target);
  if (!open) return false;
  return open.burst > 0 || open.age <= CHAIN_MAX;
}

/** Wild Flourish's Chainbound is still on this foe. It ends at 10 seconds, or when a weapon skill spends it. */
export function chainboundActive(target = "hare"): boolean {
  focus(target);
  return open?.chainbound === true && open.age <= CHAIN_MAX;
}

/**
 * Wild Flourish. Level 1 Chainbound.
 * The closing weapon skill uses only its first level 1 property, and the
 * chain is named that property. Level 2 and 3 properties do not chain.
 * A weapon skill with no properties leaves the effect up.
 * No effect when a weapon skill already left a chain here.
 */
export function openChainbound(target = "hare"): boolean {
  focus(target);
  if (open && (open.burst > 0 || open.age <= CHAIN_MAX)) return false;
  queue = [];
  note = { held: null, resonating: ["Chainbound"] };
  open = {
    props: ["Liquefaction", "Induration", "Reverberation", "Impaction", "Compression"],
    age: 0,
    name: null,
    elements: [],
    step: 1,
    burst: 0,
    chainbound: true,
  };
  return true;
}

/**
 * Konzen-ittai. The target is already readied, so the weapon skill's
 * primary property closes a two-step chain of that same property.
 */
export function offerKonzen(primary: string, closingDamage = 0, owner = "player", target = "hare"): ChainBloom | null {
  if (!primary) return null;
  focus(target);
  queue = [];
  note = null;
  const damage = chainDamage(primary, 2, closingDamage);
  const hit = { name: primary, damage, owner, target: currentId };
  if (bloom) bloomQueue.push(hit);
  else bloom = hit;
  open = { props: [primary], age: 0, name: primary, elements: BURST[primary] ?? [], step: 2, burst: BURST_WINDOW };
  return hit;
}

export function takeChainBloom(): ChainBloom | null {
  const row = bloom;
  bloom = bloomQueue.shift() ?? null;
  return row;
}

export function takeChainNote(): ChainNote | null {
  const row = note;
  note = null;
  return row;
}

/** Chain name when this element magic bursts the open chain. Null otherwise. */
export function magicBurstOf(element: string | null | undefined, target = "hare"): string | null {
  focus(target);
  if (!element || !open || open.burst <= 0 || !open.name) return null;
  return open.elements.includes(element) ? open.name : null;
}

/**
 * Elements of the closed chain. Empty during a bare resonance.
 * A wyvern breath reads this when it chooses an element.
 */
export function burstElements(target = "hare"): readonly string[] {
  focus(target);
  if (!open || open.burst <= 0 || !open.name) return [];
  return open.elements;
}

/** Weapon skills in the closed chain. 0 when nothing is bursting. */
export function burstSteps(target = "hare"): number {
  focus(target);
  if (!open || open.burst <= 0 || !open.name) return 0;
  return open.step;
}

/**
 * BG-Wiki Magic Burst, the current page.
 * Two weapon skills are +35%. Each further weapon skill is +10%.
 * Three stages are 1.45. Four are 1.55.
 * Written as (135 + 10 × extra steps) / 100 so 1.45 stays exact.
 * The older 1.30, then +0.05 a stage, is not this page.
 * A wyvern breath is the exception: that page raises its magic accuracy, not its damage.
 */
export function magicBurstRate(steps: number): number {
  if (steps < 2) return 1;
  return (135 + 10 * (steps - 2)) / 100;
}

/**
 * Floor the skillchain bonus, then floor Magic Burst Bonus.
 * The bonus argument is the Black Mage trait as a fraction. 0.09 is +9%.
 * Gear, Atma, and Ancient Magic II merits cap at +40% before that trait.
 * None of those are equipped, so there is no gear term to cap.
 * The trait is outside that cap. Day, weather, staff, and affinity are not in this step.
 * The resistance-rank table is additive on current retail and is not this yard's resist.
 */
export function applyMagicBurst(damage: number, steps: number, bonus = 0): number {
  if (steps < 2 || damage <= 0) return damage;
  const burst = Math.floor(damage * magicBurstRate(steps));
  return Math.floor(burst * (1 + Math.max(0, bonus)));
}

/** Name of the chain whose magic-burst window is open.
 * A bare resonance and a closer still waiting for the 3 second window are null.
 * Radiance and Darkness are their own names. They are not Light.
 */
export function burstChainName(target = "hare"): string | null {
  focus(target);
  if (!open || open.burst <= 0 || !open.name) return null;
  return open.name;
}

/**
 * Properties a following weapon skill can still close on this foe.
 * Empty once the 10 second window is gone. A magic burst that outlives
 * the window is not ready. The book is put back on the foe it was reading.
 */
export function readyChains(target = "hare"): readonly string[] {
  const back = currentId;
  focus(target);
  const props = resonanceNow();
  if (currentId !== back) focus(back);
  return props ? [...props] : [];
}

export function assertSkillchain(): void {
  resetSkillchain();
  if (chainResult(["Compression"], ["Transfixion"]) !== "Transfixion") throw new Error("compression into transfixion");
  if (chainResult(["Transfixion"], ["Compression"]) !== "Compression") throw new Error("transfixion opens compression");
  if (chainResult(["Transfixion"], ["Reverberation"]) !== "Reverberation") throw new Error("transfixion opens reverberation");
  if (chainResult(["Transfixion"], ["Scission"]) !== "Distortion") throw new Error("transfixion into scission is distortion");
  if (chainResult(["Scission"], ["Transfixion"]) !== null || chainResult(["Fusion"], ["Transfixion"]) !== null) throw new Error("transfixion does not close those");
  if (chainResult(["Liquefaction"], ["Impaction"]) !== "Fusion") throw new Error("liquefaction into impaction is fusion");
  if (chainResult(["Impaction"], ["Impaction"]) !== null) throw new Error("impaction does not close itself");
  if (chainResult(["Fusion"], ["Fragmentation"]) !== "Light") throw new Error("fusion into fragmentation is light");
  if (chainResult(["Light"], ["Light"]) !== "Radiance") throw new Error("light into light is radiance");
  if (chainResult(["Darkness"], ["Darkness"]) !== "Umbra") throw new Error("darkness into darkness is umbra");
  if (offerWeaponSkill(["Liquefaction"]) !== null) throw new Error("the opener does not chain alone");
  if (magicBurstOf("light") !== null || burstChainName() !== null) throw new Error("an opener is not a magic burst");
  tickSkillchain(CHAIN_MIN - 0.1);
  if (offerWeaponSkill(["Impaction"], 100) !== null) throw new Error("a weapon skill before 3 seconds does not chain yet");
  if (takeChainNote()?.held !== "Fusion") throw new Error("the early closer is held");
  if (burstChainName() !== null) throw new Error("a held closer is not a burst yet");
  const held = tickSkillchain(0.1);
  if (held?.name !== "Fusion" || held.damage !== 60) throw new Error("the held closer lands at 3 seconds");
  resetSkillchain();
  offerWeaponSkill(["Liquefaction"]);
  tickSkillchain(CHAIN_MIN);
  const fusion = offerWeaponSkill(["Impaction"], 100);
  if (fusion?.name !== "Fusion" || fusion.damage !== 60) throw new Error("shining strike closes fusion");
  if (burstChainName() !== "Fusion") throw new Error("the open burst is fusion, not light");
  if (magicBurstOf("light") !== "Fusion" || magicBurstOf("fire") !== "Fusion") throw new Error("fusion bursts light and fire");
  if (burstSteps() !== 2 || burstElements().join(",") !== "fire,light") throw new Error("fusion breath elements");
  if (magicBurstOf("thunder") !== null) throw new Error("fusion does not burst thunder");
  tickSkillchain(BURST_WINDOW - 0.1);
  if (magicBurstOf("light") !== "Fusion") throw new Error("the burst is still open inside 10 seconds");
  tickSkillchain(0.1);
  if (magicBurstOf("light") !== null) throw new Error("the burst closes at 10 seconds");
  offerWeaponSkill(["Liquefaction"]);
  tickSkillchain(CHAIN_MIN);
  offerWeaponSkill(["Impaction"]);
  tickSkillchain(1);
  offerWeaponSkill(["Scission"]);
  if (magicBurstOf("light") !== null) throw new Error("another weapon skill ends the burst");
  resetSkillchain();
  offerWeaponSkill(["Liquefaction"]);
  tickSkillchain(CHAIN_MIN);
  offerWeaponSkill(["Impaction"]);
  if (offerWeaponSkill([]) !== null || magicBurstOf("light") !== "Fusion") throw new Error("a skill with no properties leaves the burst");
  resetSkillchain();
  offerWeaponSkill(["Impaction"]);
  tickSkillchain(CHAIN_MIN);
  const detonation = offerWeaponSkill(["Detonation"], 80);
  if (detonation?.name !== "Detonation" || detonation.damage !== 40) throw new Error("level 1 chain is half the closing hit");
  tickSkillchain(CHAIN_MIN);
  const scission = offerWeaponSkill(["Scission"], 80);
  if (scission?.name !== "Scission" || scission.damage !== 48) throw new Error("a third weapon skill raises the level 1 share");
  resetSkillchain();
  offerWeaponSkill(["Liquefaction"]);
  tickSkillchain(CHAIN_MAX);
  if (offerWeaponSkill(["Impaction"], 100)?.name !== "Fusion") throw new Error("the window is still open at 10 seconds");
  resetSkillchain();
  offerWeaponSkill(["Liquefaction"]);
  tickSkillchain(CHAIN_MAX + 0.01);
  if (offerWeaponSkill(["Impaction"]) !== null) throw new Error("the window is closed after 10 seconds");
  resetSkillchain();
  offerWeaponSkill(["Fusion"]);
  tickSkillchain(CHAIN_MIN);
  if (offerWeaponSkill(["Fragmentation"], 100)?.name !== "Light") throw new Error("light");
  tickSkillchain(CHAIN_MIN);
  const radiance = offerWeaponSkill(["Light"], 100);
  if (radiance?.name !== "Radiance" || radiance.damage !== 180) throw new Error("radiance");
  if (magicBurstOf("light") !== "Radiance" || burstChainName() !== "Radiance") throw new Error("radiance still bursts");
  resetSkillchain();
  const konzen = offerKonzen("Transfixion", 100);
  if (konzen?.name !== "Transfixion" || konzen.damage !== 50) throw new Error("konzen opens the primary property");
  if (magicBurstOf("light") !== "Transfixion") throw new Error("konzen burst");
  tickSkillchain(CHAIN_MIN);
  if (peekChain(["Scission"]) !== "Distortion") throw new Error("konzen leaves a real window");
  resetSkillchain();
  offerWeaponSkill(["Liquefaction"]);
  if (offerWeaponSkill(["Transfixion"], 40) !== null) throw new Error("transfixion does not close liquefaction");
  if (takeChainNote()?.resonating?.join() !== "Transfixion") throw new Error("a swing that cannot chain replaces the resonance");
  if (resonanceProps()?.join() !== "Transfixion") throw new Error("the resonance was replaced");
  tickSkillchain(CHAIN_MIN);
  if (offerWeaponSkill(["Impaction"], 100) !== null) throw new Error("the replaced resonance is not liquefaction");
  resetSkillchain();
  offerWeaponSkill(["Induration"]);
  if (offerWeaponSkill(["Reverberation", "Impaction"], 100) !== null) throw new Error("koki waits");
  if (offerWeaponSkill(["Fusion", "Compression"], 200) !== null) throw new Error("kasha waits behind fragmentation");
  if (burstChainName() !== null) throw new Error("a queued light is not open yet");
  const frag = tickSkillchain(CHAIN_MIN);
  if (frag?.name !== "Fragmentation" || frag.damage !== 60) throw new Error(`three-part fragmentation ${frag?.name} ${frag?.damage}`);
  const light = tickSkillchain(CHAIN_MIN);
  if (light?.name !== "Light" || light.damage !== 300) throw new Error(`three-part light ${light?.name} ${light?.damage}`);
  if (burstChainName() !== "Light") throw new Error("the burst window is named light");
  if (magicBurstOf("fire") !== "Light" || magicBurstOf("wind") !== "Light" || magicBurstOf("thunder") !== "Light" || magicBurstOf("light") !== "Light") {
    throw new Error("light burst");
  }
  if (magicBurstOf("earth") !== null) throw new Error("light does not burst earth");
  resetSkillchain();
  offerWeaponSkill(["Scission", "Detonation"]);
  offerWeaponSkill(["Fusion", "Compression"], 80);
  offerWeaponSkill(["Distortion", "Reverberation"], 100);
  const grav = tickSkillchain(CHAIN_MIN);
  if (grav?.name !== "Gravitation" || grav.damage !== 48) throw new Error(`three-part gravitation ${grav?.name} ${grav?.damage}`);
  const dark = tickSkillchain(CHAIN_MIN);
  if (dark?.name !== "Darkness" || dark.damage !== 150) throw new Error(`three-part darkness ${dark?.name} ${dark?.damage}`);
  if (burstChainName() !== "Darkness") throw new Error("darkness is not named light");
  if (magicBurstOf("earth") !== "Darkness" || magicBurstOf("water") !== "Darkness" || magicBurstOf("ice") !== "Darkness" || magicBurstOf("dark") !== "Darkness") {
    throw new Error("darkness burst");
  }
  if (magicBurstOf("fire") !== null) throw new Error("darkness does not burst fire");
  resetSkillchain();
  offerWeaponSkill(["Liquefaction"], 0, "player", "hare");
  offerWeaponSkill(["Liquefaction"], 0, "player", "kin");
  tickSkillchain(CHAIN_MIN);
  const otherFusion = offerWeaponSkill(["Impaction"], 100, "player", "kin");
  if (otherFusion?.name !== "Fusion" || otherFusion.target !== "kin" || otherFusion.damage !== 60) throw new Error("another enemy closes its own chain");
  if (resonanceProps("hare")?.join() !== "Liquefaction") throw new Error("the training dummy keeps its own resonance");
  if (magicBurstOf("light") !== null) throw new Error("the training dummy is not bursting");
  if (magicBurstOf("light", "kin") !== "Fusion") throw new Error("the other enemy can be magic burst");
  if (magicBurstRate(0) !== 1 || magicBurstRate(1) !== 1 || magicBurstRate(2) !== 1.35 || magicBurstRate(3) !== 1.45 || magicBurstRate(4) !== 1.55) {
    throw new Error("magic burst rate");
  }
  if (applyMagicBurst(192, 2, 0) !== 259 || applyMagicBurst(192, 3, 0) !== 278 || applyMagicBurst(192, 2, 0.09) !== 282 || applyMagicBurst(165, 1, 0.09) !== 165) {
    throw new Error("magic burst damage");
  }
  resetSkillchain();
  if (!openChainbound("hare")) throw new Error("chainbound opens");
  if (peekChain(["Fusion", "Scission"]) !== "Scission") throw new Error("chainbound peeks the first level 1 property");
  const bound = offerWeaponSkill(["Fusion", "Scission"], 100);
  if (bound?.name !== "Scission" || bound.damage !== 50) throw new Error("chainbound closes the first level 1 property");
  resetSkillchain();
  openChainbound();
  if (offerWeaponSkill(["Fragmentation"], 100) !== null) throw new Error("fragmentation does not close chainbound");
  if (resonanceProps()?.join() !== "Fragmentation") throw new Error("a level 2 weapon skill opens on its own");
  resetSkillchain();
  openChainbound();
  if (offerWeaponSkill([]) !== null || resonanceProps()?.[0] !== "Liquefaction") throw new Error("no properties leaves chainbound");
  resetSkillchain();
  offerWeaponSkill(["Liquefaction"]);
  if (openChainbound()) throw new Error("chainbound does not overwrite a weapon skill");
  resetSkillchain();
  openChainbound();
  if (!chainboundActive()) throw new Error("chainbound stays up");
  tickSkillchain(CHAIN_MAX + 0.01);
  if (chainboundActive()) throw new Error("chainbound ends at ten seconds");
  resetSkillchain();
  offerWeaponSkill(["Liquefaction"], 0, "player", "hare");
  tickSkillchain(CHAIN_MIN);
  offerWeaponSkill(["Impaction"], 100, "player", "hare");
  offerWeaponSkill(["Liquefaction"], 0, "player", "mouth");
  tickSkillchain(CHAIN_MIN);
  const forestClose = offerWeaponSkill(["Impaction"], 40, "player", "mouth");
  if (forestClose?.name !== "Fusion" || forestClose.target !== "mouth") throw new Error("a forest rabbit closes on itself");
  if (burstChainName("hare") !== "Fusion") throw new Error("the pen keeps its own chain");
  clearChain("mouth");
  if (burstChainName("mouth") !== null) throw new Error("a defeated forest rabbit drops its chain");
  if (burstChainName("hare") !== "Fusion" || burstChainName() !== "Fusion") throw new Error("the pen chain stays after the forest rabbit falls");
  resetSkillchain();
  offerWeaponSkill(["Fragmentation", "Scission"], 0, "player", "hare");
  const opened = readyChains("hare");
  if (!opened.includes("Fragmentation") || !opened.includes("Scission")) throw new Error("savage blade readies fragmentation and scission");
  if (readyChains("kin").length !== 0) throw new Error("another body is not readied");
  tickSkillchain(CHAIN_MAX + 0.01);
  if (readyChains("hare").length !== 0) throw new Error("a window older than 10 seconds is not ready");
  resetSkillchain();
}