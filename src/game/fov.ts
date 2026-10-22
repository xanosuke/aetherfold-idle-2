/**
 * Fields of Valor. West Ronfaure (I-6 and G-9) and East Ronfaure (G-6 and
 * H-9) each offer five individual pages for mobs that stand in that zone.
 * A page from one book does not count kills from the other. Weapons, armor,
 * and items are not stocked.
 *
 * Tabs and gil pay once per Vana'diel day, per page, and the two zones
 * keep separate days. Experience pays every time the page is cleared.
 * A repeating regime turns itself over. A Tropical Rarab, a camp, and
 * anything outside the page do not count.
 *
 * Protect and Shell use the highest single-target tier a White Mage of
 * this level can cast, and they stop at IV. Protect V and Shell V are
 * not offered. Food overwrites food. A stronger Regen or Refresh is
 * left alone. Sublimation still removes Refresh, the same as a spell.
 */
import { EAST_CELL, EAST_MANUAL_GATE, EAST_MANUAL_ROAD, EAST_X0, EAST_Z0, eastDry, eastSquare, inEast } from "./east-ronfaure";
import { scale256 } from "./war";
import { ronCell } from "./world";

const SOUTH_BOOK = ronCell(8, 5);
const OUTPOST_BOOK = ronCell(6, 8);
/** Field manual outside the Southern San d'Oria gate, West Ronfaure (I-6). */
export const MANUAL_X = SOUTH_BOOK.x - 16;
export const MANUAL_Z = SOUTH_BOOK.z - 8;
/** Second book at the outpost (G-9). */
export const MANUAL_OUTPOST_X = OUTPOST_BOOK.x + 3;
export const MANUAL_OUTPOST_Z = OUTPOST_BOOK.z + 2;
/** East Ronfaure book by the San d'Oria gate (G-6). */
export const MANUAL_EAST_X = EAST_MANUAL_GATE.x;
export const MANUAL_EAST_Z = EAST_MANUAL_GATE.z;
/** East Ronfaure book beside the H-9 road, west of the Cheval. */
export const MANUAL_EAST_ROAD_X = EAST_MANUAL_ROAD.x;
export const MANUAL_EAST_ROAD_Z = EAST_MANUAL_ROAD.z;
/** San d'Orian guard inside the south gate, east of the bridge. */
export const GUARD_X = 4.2;
export const GUARD_Z = 5.6;
/** West Ronfaure guard across the I-6 path from the field manual. */
export const FOREST_GUARD_X = MANUAL_X + 12;
export const FOREST_GUARD_Z = MANUAL_Z;
export const MANUAL_TALK = 6;

/** One slot on a West Ronfaure page. Species is an exact list. Family is every member of that family standing in West Ronfaure. */
export type RegimeGoal = {
  label: string;
  need: number;
  species?: readonly string[];
  family?: string;
};

export type RegimePage = {
  page: number;
  level: string;
  exp: number;
  gil: number;
  tabs: number;
  title: string;
  goals: readonly RegimeGoal[];
};

/**
 * Retail West Ronfaure. Page 5 is sheep and a goblin.
 * Saplings and wasps do not live in this zone, so they are not offered.
 */
export const WEST_REGIMES: readonly RegimePage[] = [
  {
    page: 1,
    level: "1–6",
    exp: 270,
    gil: 270,
    tabs: 27,
    title: "Defeat 6 members of the Worm family",
    goals: [{ label: "Worm", need: 6, species: ["carrion-worm", "tunnel-worm"] }],
  },
  {
    page: 2,
    level: "2–6",
    exp: 285,
    gil: 285,
    tabs: 28,
    title: "Defeat 6 Forest Hares",
    goals: [{ label: "Forest Hare", need: 6, species: ["forest-hare"] }],
  },
  {
    page: 3,
    level: "4–7",
    exp: 300,
    gil: 300,
    tabs: 30,
    title: "Defeat 5 Scarab Beetles and 1 Forest Funguar",
    goals: [
      { label: "Scarab Beetle", need: 5, species: ["scarab-beetle"] },
      { label: "Forest Funguar", need: 1, species: ["forest-funguar"] },
    ],
  },
  {
    page: 4,
    level: "4–8",
    exp: 315,
    gil: 315,
    tabs: 31,
    title: "Defeat 4 members of the Orc family and 2 Scarab Beetles",
    goals: [
      { label: "Orc", need: 4, family: "Orc" },
      { label: "Scarab Beetle", need: 2, species: ["scarab-beetle"] },
    ],
  },
  {
    page: 5,
    level: "4–8",
    exp: 330,
    gil: 330,
    tabs: 33,
    title: "Defeat 6 Wild Sheep and 1 member of the Goblin family",
    goals: [
      { label: "Wild Sheep", need: 6, species: ["wild-sheep"] },
      { label: "Goblin", need: 1, family: "Goblin" },
    ],
  },
];

/** Which book's page is active. A missing save is West, so the old rarab page still drops cleanly. */
export type FovBook = "west" | "east";

/**
 * Retail East Ronfaure. Carrion Worms are that species only, not the worm
 * family. Forest Hares are seven, not the wild rabbits. Rambukk is a ram.
 */
export const EAST_REGIMES: readonly RegimePage[] = [
  {
    page: 1,
    level: "1–5",
    exp: 270,
    gil: 270,
    tabs: 27,
    title: "Defeat 6 members of the Pugil family",
    goals: [{ label: "Pugil", need: 6, family: "Pugil" }],
  },
  {
    page: 2,
    level: "2–5",
    exp: 285,
    gil: 285,
    tabs: 28,
    title: "Defeat 6 Carrion Worms",
    goals: [{ label: "Carrion Worm", need: 6, species: ["east-carrion"] }],
  },
  {
    page: 3,
    level: "2–6",
    exp: 300,
    gil: 300,
    tabs: 30,
    title: "Defeat 7 Forest Hares",
    goals: [{ label: "Forest Hare", need: 7, species: ["east-hare"] }],
  },
  {
    page: 4,
    level: "3–6",
    exp: 315,
    gil: 315,
    tabs: 31,
    title: "Defeat 4 members of the Orc family and 2 Forest Funguars",
    goals: [
      { label: "Orc", need: 4, family: "Orc" },
      { label: "Forest Funguar", need: 2, species: ["east-funguar"] },
    ],
  },
  {
    page: 5,
    level: "4–8",
    exp: 330,
    gil: 330,
    tabs: 33,
    title: "Defeat 4 Wild Sheep and 2 Scarab Beetles",
    goals: [
      { label: "Wild Sheep", need: 4, species: ["east-sheep"] },
      { label: "Scarab Beetle", need: 2, species: ["east-scarab"] },
    ],
  },
];

export function regimeByPage(page: number, book: FovBook = "west"): RegimePage | null {
  const list = book === "east" ? EAST_REGIMES : WEST_REGIMES;
  return list.find((row) => row.page === page) ?? null;
}

export function regimesFor(book: FovBook): readonly RegimePage[] {
  return book === "east" ? EAST_REGIMES : WEST_REGIMES;
}

export type RegimeCredit = { species: string; family: string; west: boolean; east?: boolean };

export const TAB_CAP = 50_000;
export const FOV_MINUTES = 30;

/** White Mage levels for Protect I–IV. V is intentionally absent. */
const PROTECT_LEVEL = [7, 27, 47, 63] as const;
const SHELL_LEVEL = [17, 37, 57, 68] as const;
const PROTECT_POWER = [20, 50, 90, 140] as const;
const SHELL_POWER = [27, 42, 56, 67] as const;

export type FovState = {
  active: boolean;
  page: number;
  /** West when the save never named a book. */
  book: FovBook;
  counts: number[];
  repeat: boolean;
  tabs: number;
  /** Vana'diel day each page last paid gil and tabs. East pages use 11–15. */
  paidDays: Partial<Record<number, string>>;
};

export type FoodSheet = {
  hp: number;
  mp: number;
  str: number;
  vit: number;
  int: number;
  mnd: number;
  chr: number;
  attackFlat: number;
  smite: number;
  attack: number;
  defenseFlat: number;
  defense: number;
  fstr: number;
  offhand: null | { attackFlat: number; fstr: number };
};

type FoodDef = {
  id: string;
  name: string;
  tabs: number;
  str?: number;
  vit?: number;
  int?: number;
  mnd?: number;
  chr?: number;
  attackPct?: number;
  attackCap?: number;
  defensePct?: number;
  defenseCap?: number;
  storeTp?: number;
  /** Instant Noodles is 27.27%, stored as thousandths of a percent. */
  hpThousandths?: number;
  hpCap?: number;
  mpFlat?: number;
  mpPerLevel?: number;
  mpCap?: number;
  effect: string;
  chip: string;
};

const FOOD: readonly FoodDef[] = [
  {
    id: "dried-meat",
    name: "Dried Meat",
    tabs: 50,
    str: 4,
    attackPct: 0.22,
    attackCap: 63,
    effect: "STR +4, Attack +22% (cap 63). 30 minutes.",
    chip: "STR+4 · ATK+22%",
  },
  {
    id: "salted-fish",
    name: "Salted Fish",
    tabs: 50,
    vit: 2,
    defensePct: 0.3,
    defenseCap: 86,
    effect: "VIT +2, Defense +30% (cap 86). 30 minutes.",
    chip: "VIT+2 · DEF+30%",
  },
  {
    id: "hard-cookie",
    name: "Hard Cookie",
    tabs: 50,
    int: 4,
    mpFlat: 30,
    effect: "INT +4, MP +30. 30 minutes.",
    chip: "INT+4 · MP+30",
  },
  {
    id: "instant-noodles",
    name: "Instant Noodles",
    tabs: 50,
    vit: 1,
    storeTp: 5,
    hpThousandths: 2727,
    hpCap: 75,
    effect: "VIT +1, Store TP +5, HP +27.27% (cap 75). 30 minutes.",
    chip: "Store TP+5",
  },
  {
    id: "dried-agaricus",
    name: "Dried Agaricus",
    tabs: 50,
    mnd: 4,
    mpPerLevel: 1,
    mpCap: 100,
    effect: "MND +4, MP +1 per level (cap 100). 30 minutes.",
    chip: "MND+4",
  },
  {
    id: "instant-rice",
    name: "Instant Rice",
    tabs: 50,
    chr: 6,
    effect: "CHR +6. 30 minutes.",
    chip: "CHR+6",
  },
];

const FOOD_BY_NAME = new Map(FOOD.map((row) => [row.name, row]));

export const FIELD_FOOD_NAMES: readonly string[] = FOOD.map((row) => row.name);

export type SupportRow = {
  id: string;
  name: string;
  tabs: number;
  effect: string;
  kind: "warp" | "reraise" | "regen" | "refresh" | "protect" | "shell" | "food";
};

export function emptyFov(): FovState {
  return { active: false, page: 0, book: "west", counts: [], repeat: false, tabs: 0, paidDays: {} };
}

function clampCounts(page: RegimePage | null, raw: unknown): number[] {
  if (!page) return [];
  const list = Array.isArray(raw) ? raw : [];
  return page.goals.map((goal, index) => {
    const value = list[index];
    const n = typeof value === "number" && Number.isFinite(value) ? Math.floor(value) : 0;
    return Math.max(0, Math.min(goal.need, n));
  });
}

function payKey(book: FovBook, page: number): number {
  return book === "east" ? page + 10 : page;
}

const PAID_PAGES = [1, 2, 3, 4, 5, 11, 12, 13, 14, 15] as const;

function readPaidDays(raw: unknown): Partial<Record<number, string>> {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const out: Partial<Record<number, string>> = {};
  for (const key of PAID_PAGES) {
    const value = (raw as Record<string, unknown>)[String(key)];
    if (typeof value === "string" && value.length > 0) out[key] = value.slice(0, 24);
  }
  return out;
}

/** Old saves stored one Tropical Rarab counter. That page is not a regime, so the kills are dropped and the tabs stay. A save with no book is West. */
export function readFov(raw: unknown): FovState {
  const blank = emptyFov();
  if (!raw || typeof raw !== "object") return blank;
  const row = raw as Record<string, unknown>;
  const tabs = typeof row.tabs === "number" && Number.isFinite(row.tabs) ? Math.floor(row.tabs) : 0;
  const book: FovBook = row.book === "east" ? "east" : "west";
  const page = regimeByPage(typeof row.page === "number" ? row.page : 0, book);
  return {
    active: page != null && row.active === true,
    page: page?.page ?? 0,
    book: page ? book : "west",
    counts: clampCounts(page, row.counts),
    repeat: row.repeat === true,
    tabs: Math.max(0, Math.min(TAB_CAP, tabs)),
    paidDays: readPaidDays(row.paidDays),
  };
}

export function vanaDayKey(clock: { year: number; month: number; day: number }): string {
  return `${clock.year}-${clock.month}-${clock.day}`;
}

const MANUALS: readonly { book: FovBook; x: number; z: number }[] = [
  { book: "west", x: MANUAL_X, z: MANUAL_Z },
  { book: "west", x: MANUAL_OUTPOST_X, z: MANUAL_OUTPOST_Z },
  { book: "east", x: MANUAL_EAST_X, z: MANUAL_EAST_Z },
  { book: "east", x: MANUAL_EAST_ROAD_X, z: MANUAL_EAST_ROAD_Z },
];

/** The book the player is close enough to read, or null. */
export function manualBookAt(x: number, z: number): FovBook | null {
  let best: { book: FovBook; d: number } | null = null;
  for (const spot of MANUALS) {
    const d = Math.hypot(x - spot.x, z - spot.z);
    if (d > MANUAL_TALK) continue;
    if (!best || d < best.d) best = { book: spot.book, d };
  }
  return best?.book ?? null;
}

export function nearFieldManual(x: number, z: number): boolean {
  return manualBookAt(x, z) != null;
}

/** Highest Protect or Shell a White Mage of this level can cast, never V. */
export function fovBarrierTier(kind: "protect" | "shell", level: number): 0 | 1 | 2 | 3 | 4 {
  const gates = kind === "protect" ? PROTECT_LEVEL : SHELL_LEVEL;
  let tier: 0 | 1 | 2 | 3 | 4 = 0;
  const lv = Math.floor(level);
  for (let i = 0; i < gates.length; i++) {
    if (lv >= gates[i]) tier = (i + 1) as 1 | 2 | 3 | 4;
  }
  return tier;
}

export function fovBarrierPower(kind: "protect" | "shell", tier: number): number {
  if (tier < 1 || tier > 4) return 0;
  return kind === "protect" ? PROTECT_POWER[tier - 1] : SHELL_POWER[tier - 1];
}

export function isFieldFood(name: string): boolean {
  return FOOD_BY_NAME.has(name);
}

export function fieldFoodChip(name: string): string | null {
  const food = FOOD_BY_NAME.get(name);
  return food ? `${food.name} ${food.chip}` : null;
}

function foodOf(buffs: readonly { name: string }[]): FoodDef | null {
  for (const buff of buffs) {
    const food = FOOD_BY_NAME.get(buff.name);
    if (food) return food;
  }
  return null;
}

export function fieldStoreTp(buffs: readonly { name: string }[]): number {
  return foodOf(buffs)?.storeTp ?? 0;
}

export function fieldFoodAttackBonus(buffs: readonly { name: string }[], attack: number): number {
  const food = foodOf(buffs);
  if (!food?.attackPct || food.attackCap == null) return 0;
  return Math.min(food.attackCap, Math.floor(Math.max(0, attack) * food.attackPct));
}

export function fieldFoodDefenseBonus(buffs: readonly { name: string }[], defense: number): number {
  const food = foodOf(buffs);
  if (!food?.defensePct || food.defenseCap == null) return 0;
  return Math.min(food.defenseCap, Math.floor(Math.max(0, defense) * food.defensePct));
}

function vitDefense(vit: number, added: number): number {
  if (added === 0) return 0;
  return Math.floor((vit + added) * 1.5) - Math.floor(vit * 1.5);
}

/** Paint one field recipe onto a raw sheet. A second call would stack, so pass the gear sheet. */
export function applyFieldFood<T extends FoodSheet>(sheet: T, buffs: readonly { name: string }[], level: number): T {
  const food = foodOf(buffs);
  if (!food) return sheet;
  const str = food.str ?? 0;
  const vit = food.vit ?? 0;
  const attackFlat = sheet.attackFlat + str;
  const defenseFlat = sheet.defenseFlat + vitDefense(sheet.vit, vit);
  const baseAttack = scale256(attackFlat, sheet.smite);
  const attack = baseAttack + (food.attackPct != null && food.attackCap != null ? Math.min(food.attackCap, Math.floor(baseAttack * food.attackPct)) : 0);
  const defense = defenseFlat + (food.defensePct != null && food.defenseCap != null ? Math.min(food.defenseCap, Math.floor(defenseFlat * food.defensePct)) : 0);
  let hp = sheet.hp;
  if (food.hpThousandths != null && food.hpCap != null) {
    hp += Math.min(food.hpCap, Math.floor((sheet.hp * food.hpThousandths) / 10000));
  }
  let mp = sheet.mp + (food.mpFlat ?? 0);
  if (food.mpPerLevel != null && food.mpCap != null) {
    mp += Math.min(food.mpCap, Math.max(0, Math.floor(level)) * food.mpPerLevel);
  }
  return {
    ...sheet,
    str: sheet.str + str,
    vit: sheet.vit + vit,
    int: sheet.int + (food.int ?? 0),
    mnd: sheet.mnd + (food.mnd ?? 0),
    chr: sheet.chr + (food.chr ?? 0),
    attackFlat,
    attack,
    defenseFlat,
    defense,
    fstr: sheet.fstr + Math.floor(str / 4),
    hp,
    mp,
    offhand: sheet.offhand
      ? { ...sheet.offhand, attackFlat: sheet.offhand.attackFlat + str, fstr: sheet.offhand.fstr + Math.floor(str / 4) }
      : sheet.offhand,
  };
}

export function supportCatalog(level: number): SupportRow[] {
  const protectTier = fovBarrierTier("protect", level);
  const shellTier = fovBarrierTier("shell", level);
  const protect = protectTier === 0
    ? "A White Mage of your level cannot cast Protect."
    : `Protect ${roman(protectTier)}, Defense +${fovBarrierPower("protect", protectTier)}. 30 minutes. A stronger ward stays.`;
  const shell = shellTier === 0
    ? "A White Mage of your level cannot cast Shell."
    : `Shell ${roman(shellTier)}, magic cut ${fovBarrierPower("shell", shellTier)}/256. 30 minutes. A stronger ward stays.`;
  const mpNote = Math.min(100, Math.max(0, Math.floor(level)));
  return [
    { id: "repatriation", name: "Repatriation", tabs: 50, kind: "warp", effect: "Warp to the Home Point crystal." },
    { id: "reraise", name: "Reraise", tabs: 10, kind: "reraise", effect: "Reraise for 2 hours. Reraise II and III stay." },
    { id: "regen", name: "Regen", tabs: 20, kind: "regen", effect: "1 HP every 3 seconds for 60 minutes. A stronger Regen stays." },
    { id: "refresh", name: "Refresh", tabs: 20, kind: "refresh", effect: "1 MP every 3 seconds for 60 minutes. Sublimation overwrites it." },
    { id: "protect", name: "Protect", tabs: 15, kind: "protect", effect: protect },
    { id: "shell", name: "Shell", tabs: 15, kind: "shell", effect: shell },
    ...FOOD.map((food) => ({
      id: food.id,
      name: food.name,
      tabs: food.tabs,
      kind: "food" as const,
      effect: food.id === "dried-agaricus" ? `MND +4, MP +${mpNote}. 30 minutes. Replaces other food.` : `${food.effect} Replaces other food.`,
    })),
  ];
}

function roman(tier: number): string {
  return (["", "I", "II", "III", "IV"] as const)[tier] ?? String(tier);
}

function creditBook(credit: RegimeCredit): FovBook | null {
  if (credit.west) return "west";
  if (credit.east) return "east";
  return null;
}

function matchesGoal(goal: RegimeGoal, credit: RegimeCredit, book: FovBook): boolean {
  if (creditBook(credit) !== book) return false;
  if (goal.species) return goal.species.includes(credit.species);
  return goal.family != null && goal.family === credit.family;
}

export function regimeProgress(fov: FovState): string {
  const page = regimeByPage(fov.page, fov.book === "east" ? "east" : "west");
  if (!page) return "";
  return page.goals.map((goal, index) => `${goal.label} ${Math.min(goal.need, fov.counts[index] ?? 0)}/${goal.need}`).join(" · ");
}

export function advanceRegime(
  fov: FovState,
  dayKey: string,
  credit: RegimeCredit,
): { fov: FovState; changed: boolean; exp: number; gil: number; logs: string[] } {
  const idle = { fov, changed: false, exp: 0, gil: 0, logs: [] as string[] };
  if (!fov.active) return idle;
  const book: FovBook = fov.book === "east" ? "east" : "west";
  const page = regimeByPage(fov.page, book);
  if (!page) return idle;
  const slot = page.goals.findIndex((goal, index) => (fov.counts[index] ?? 0) < goal.need && matchesGoal(goal, credit, book));
  if (slot < 0) return idle;
  const counts = page.goals.map((goal, index) => Math.min(goal.need, fov.counts[index] ?? 0));
  counts[slot] += 1;
  const cleared = page.goals.every((goal, index) => counts[index] >= goal.need);
  if (!cleared) {
    return {
      fov: { ...fov, book, counts },
      changed: true,
      exp: 0,
      gil: 0,
      logs: [`Training: ${page.goals.map((goal, index) => `${goal.label} ${counts[index]}/${goal.need}`).join(". ")}.`],
    };
  }
  const key = payKey(book, page.page);
  const pay = fov.paidDays[key] !== dayKey;
  const next: FovState = {
    ...fov,
    book,
    counts: page.goals.map(() => 0),
    active: fov.repeat,
    repeat: fov.repeat,
    tabs: Math.min(TAB_CAP, fov.tabs + (pay ? page.tabs : 0)),
    paidDays: pay ? { ...fov.paidDays, [key]: dayKey } : fov.paidDays,
  };
  const logs = [`You receive ${page.exp} experience points.`];
  if (pay) {
    logs.push(`You receive ${page.gil} gil.`);
    logs.push(`You receive ${page.tabs} tabs.`);
  } else {
    logs.push("You have already received tabs and gil for this regime today.");
  }
  logs.push(fov.repeat ? `The page turns. ${page.title}.` : "Regime complete.");
  return { fov: next, changed: true, exp: page.exp, gil: pay ? page.gil : 0, logs };
}

export function assertFov(): void {
  if (nearFieldManual(MANUAL_X, MANUAL_Z) !== true || nearFieldManual(MANUAL_X + 6.01, MANUAL_Z)) throw new Error("manual range");
  if (fovBarrierTier("protect", 75) !== 4 || fovBarrierPower("protect", 4) !== 140) throw new Error("protect IV");
  if (fovBarrierTier("protect", 62) !== 3 || fovBarrierTier("protect", 6) !== 0) throw new Error("protect gate");
  if (fovBarrierTier("shell", 75) !== 4 || fovBarrierPower("shell", 4) !== 67) throw new Error("shell IV");
  if (fovBarrierTier("shell", 16) !== 0 || fovBarrierTier("shell", 68) !== 4) throw new Error("shell gate");
  const day = "1514-7-14";
  const worm = { species: "carrion-worm", family: "Worm", west: true };
  const tunnel = { species: "tunnel-worm", family: "Worm", west: true };
  const hare = { species: "forest-hare", family: "Rabbit", west: true };
  const eastHare = { species: "east-hare", family: "Rabbit", west: false };
  const armed = { ...emptyFov(), active: true, page: 1, counts: [0], repeat: true };
  const fifth = advanceRegime({ ...armed, counts: [4] }, day, worm);
  if (fifth.fov.counts[0] !== 5 || fifth.exp !== 0 || fifth.gil !== 0) throw new Error("fifth worm");
  if (advanceRegime(fifth.fov, day, hare).changed) throw new Error("a hare is not a worm");
  if (advanceRegime(fifth.fov, day, eastHare).changed) throw new Error("east does not count");
  const done = advanceRegime(fifth.fov, day, tunnel);
  if (!done.fov.active || done.fov.counts[0] !== 0 || done.fov.tabs !== 27 || done.gil !== 270 || done.exp !== 270 || done.fov.paidDays[1] !== day) {
    throw new Error("repeat pay");
  }
  const again = advanceRegime({ ...done.fov, counts: [5] }, day, worm);
  if (again.gil !== 0 || again.fov.tabs !== 27 || !again.logs.some((line) => line.includes("already received"))) throw new Error("same day");
  const other = advanceRegime({ ...emptyFov(), active: true, page: 2, counts: [5], repeat: true, tabs: again.fov.tabs, paidDays: again.fov.paidDays }, day, hare);
  if (other.gil !== 285 || other.fov.tabs !== 55 || other.exp !== 285) throw new Error("other page still pays");
  const nextDay = advanceRegime({ ...again.fov, counts: [5] }, "1514-7-15", worm);
  if (nextDay.gil !== 270 || nextDay.fov.tabs !== 27 + 27) throw new Error("next day");
  const once = advanceRegime({ ...emptyFov(), active: true, page: 1, repeat: false, counts: [5] }, day, worm);
  if (once.fov.active || once.fov.tabs !== 27) throw new Error("one shot");
  const capped = advanceRegime({ ...emptyFov(), active: true, page: 1, counts: [5], tabs: TAB_CAP - 10, paidDays: {} }, day, worm);
  if (capped.fov.tabs !== TAB_CAP) throw new Error("tab cap");
  const mixed = { ...emptyFov(), active: true, page: 3, counts: [4, 0], repeat: false };
  const beetle = advanceRegime(mixed, day, { species: "scarab-beetle", family: "Beetle", west: true });
  if (beetle.exp !== 0 || beetle.fov.counts[0] !== 5 || beetle.fov.counts[1] !== 0) throw new Error("beetle slot");
  const funguar = advanceRegime(beetle.fov, day, { species: "forest-funguar", family: "Funguar", west: true });
  if (funguar.exp !== 300 || funguar.fov.tabs !== 30 || funguar.fov.active) throw new Error("page three");
  if (advanceRegime({ ...emptyFov(), active: true, page: 3, counts: [0, 0], repeat: false }, day, { species: "fungus-beetle", family: "Beetle", west: true }).changed) {
    throw new Error("fungus beetle is not a scarab");
  }
  const orc = advanceRegime({ ...emptyFov(), active: true, page: 4, counts: [3, 2], repeat: false }, day, { species: "orcish-fodder", family: "Orc", west: true });
  if (orc.exp !== 315 || orc.gil !== 315) throw new Error("orc page");
  if (advanceRegime({ ...emptyFov(), active: true, page: 4, counts: [0, 0], repeat: true }, day, { species: "east-fodder", family: "Orc", west: false }).changed) {
    throw new Error("east orc");
  }
  if (fieldFoodAttackBonus([{ name: "Dried Meat" }], 400) !== 63) throw new Error("meat cap");
  if (fieldFoodAttackBonus([{ name: "Dried Meat" }], 200) !== 44) throw new Error("meat 22%");
  if (fieldFoodDefenseBonus([{ name: "Salted Fish" }], 400) !== 86) throw new Error("fish cap");
  if (fieldStoreTp([{ name: "Instant Noodles" }]) !== 5 || fieldStoreTp([]) !== 0) throw new Error("store tp food");
  const raw = {
    hp: 1000,
    mp: 200,
    str: 50,
    vit: 40,
    int: 30,
    mnd: 20,
    chr: 10,
    attackFlat: 300,
    smite: 0,
    attack: 300,
    defenseFlat: 200,
    defense: 200,
    fstr: 8,
    offhand: { attackFlat: 280, fstr: 7 },
  };
  const painted = applyFieldFood(raw, [{ name: "Instant Noodles" }], 75);
  if (painted.hp !== 1075 || painted.vit !== 41 || painted.mp !== 200) throw new Error("noodles");
  const meat = applyFieldFood(raw, [{ name: "Dried Meat" }], 75);
  if (meat.str !== 54 || meat.attack !== 367 || meat.hp !== 1000 || meat.offhand?.attackFlat !== 284) throw new Error(`meat sheet ${meat.attack}`);
  const agar = applyFieldFood(raw, [{ name: "Dried Agaricus" }], 75);
  if (agar.mp !== 275 || agar.mnd !== 24) throw new Error("agaricus");
  const rice = applyFieldFood(raw, [{ name: "Instant Rice" }], 75);
  if (rice.chr !== 16 || rice.mp !== 200) throw new Error("rice");
  if (fieldFoodChip("Hard Cookie") !== "Hard Cookie INT+4 · MP+30") throw new Error("chip");
  if (supportCatalog(75).length !== 12 || supportCatalog(75)[4]?.effect.includes("140") !== true) throw new Error("catalog");
  const kept = readFov({ tabs: 56, active: true, kills: 1, repeat: true, paidDay: day });
  if (kept.tabs !== 56 || kept.active || kept.page !== 0) throw new Error("old rarab page is dropped");
  const round = readFov({ tabs: 99, active: true, page: 2, counts: [3], repeat: true, paidDays: { 2: day } });
  if (round.tabs !== 99 || round.page !== 2 || round.counts[0] !== 3 || round.paidDays[2] !== day) throw new Error("read");
  if (vanaDayKey({ year: 1514, month: 7, day: 14 }) !== day) throw new Error("day key");
  if (WEST_REGIMES.length !== 5 || regimeProgress({ ...emptyFov(), active: true, page: 5, counts: [2, 0] }) !== "Wild Sheep 2/6 · Goblin 0/1") {
    throw new Error("progress line");
  }
  if (!nearFieldManual(MANUAL_EAST_X, MANUAL_EAST_Z) || !nearFieldManual(MANUAL_EAST_ROAD_X, MANUAL_EAST_ROAD_Z)) throw new Error("east manuals");
  if (!inEast(MANUAL_EAST_X, MANUAL_EAST_Z) || !eastDry(MANUAL_EAST_X, MANUAL_EAST_Z, 0.4)) throw new Error("gate book ground");
  if (!inEast(MANUAL_EAST_ROAD_X, MANUAL_EAST_ROAD_Z) || !eastDry(MANUAL_EAST_ROAD_X, MANUAL_EAST_ROAD_Z, 0.4)) throw new Error("road book ground");
  const gateCol = (MANUAL_EAST_X - EAST_X0) / EAST_CELL;
  const gateRow = (MANUAL_EAST_Z - EAST_Z0) / EAST_CELL;
  const roadCol = (MANUAL_EAST_ROAD_X - EAST_X0) / EAST_CELL;
  const roadRow = (MANUAL_EAST_ROAD_Z - EAST_Z0) / EAST_CELL;
  if (eastSquare(gateCol, gateRow) !== "G-6" || eastSquare(roadCol, roadRow) !== "H-9") throw new Error("east squares");
  if (manualBookAt(MANUAL_X, MANUAL_Z) !== "west" || manualBookAt(MANUAL_EAST_X, MANUAL_EAST_Z) !== "east" || manualBookAt(MANUAL_EAST_ROAD_X, MANUAL_EAST_ROAD_Z) !== "east") {
    throw new Error("which book");
  }
  const eastPugil = { species: "east-pugil", family: "Pugil", west: false, east: true };
  const pugil = advanceRegime({ ...emptyFov(), active: true, book: "east", page: 1, counts: [5], repeat: true }, day, eastPugil);
  if (pugil.exp !== 270 || pugil.gil !== 270 || pugil.fov.tabs !== 27 || pugil.fov.paidDays[11] !== day || pugil.fov.paidDays[1] != null || !pugil.fov.active) {
    throw new Error("east pugil");
  }
  if (advanceRegime({ ...emptyFov(), active: true, book: "east", page: 1, counts: [0], repeat: true }, day, { species: "ghelsba-pugil", family: "Pugil", west: false }).changed) {
    throw new Error("ghelsba pugil");
  }
  const beside = advanceRegime({ ...emptyFov(), active: true, book: "east", page: 1, counts: [5], repeat: false, tabs: 27, paidDays: { 1: day } }, day, { species: "swamfisk", family: "Pugil", west: false, east: true });
  if (beside.gil !== 270 || beside.fov.tabs !== 54 || beside.fov.paidDays[1] !== day || beside.fov.paidDays[11] !== day) throw new Error("east pays beside west");
  const eastRegime = (page: number, counts: number[], repeat: boolean, extra: Partial<FovState> = {}): FovState => ({
    ...emptyFov(),
    ...extra,
    active: true,
    book: "east",
    page,
    counts,
    repeat,
  });
  const carrion = eastRegime(2, [0], false);
  if (advanceRegime(carrion, day, { species: "east-tunnel", family: "Worm", west: false, east: true }).changed) throw new Error("tunnel is not a carrion");
  if (advanceRegime(carrion, day, { species: "bigmouth-billy", family: "Worm", west: false, east: true }).changed) throw new Error("billy is not a carrion");
  if (advanceRegime(carrion, day, { species: "carrion-worm", family: "Worm", west: true }).changed) throw new Error("west worm is not east carrion");
  const carrionDone = advanceRegime(eastRegime(2, [5], false), day, { species: "east-carrion", family: "Worm", west: false, east: true });
  if (carrionDone.exp !== 285 || carrionDone.fov.tabs !== 28 || carrionDone.fov.paidDays[12] !== day) throw new Error("east carrion");
  const hares = eastRegime(3, [0], true);
  if (advanceRegime(hares, day, { species: "east-rabbit", family: "Rabbit", west: false, east: true }).changed) throw new Error("wild rabbit");
  if (advanceRegime(eastRegime(3, [6], true), day, { species: "east-hare", family: "Rabbit", west: false }).changed) throw new Error("hare needs the east flag");
  const hareDone = advanceRegime(eastRegime(3, [6], true), day, { species: "east-hare", family: "Rabbit", west: false, east: true });
  if (hareDone.exp !== 300 || hareDone.fov.tabs !== 30 || hareDone.fov.counts[0] !== 0) throw new Error("seven hares");
  const orcEast = advanceRegime({ ...emptyFov(), active: true, book: "east", page: 4, counts: [3, 1], repeat: false }, day, { species: "east-grappler", family: "Orc", west: false, east: true });
  if (orcEast.exp !== 0 || orcEast.fov.counts[0] !== 4 || orcEast.fov.counts[1] !== 1) throw new Error("east orc slot");
  const fung = advanceRegime(orcEast.fov, day, { species: "east-funguar", family: "Funguar", west: false, east: true });
  if (fung.exp !== 315 || fung.fov.tabs !== 31 || fung.fov.paidDays[14] !== day) throw new Error("east funguar page");
  if (advanceRegime({ ...emptyFov(), active: true, book: "east", page: 4, counts: [0, 0], repeat: true }, day, { species: "orcish-fodder", family: "Orc", west: true }).changed) {
    throw new Error("west orc on east page");
  }
  if (advanceRegime({ ...emptyFov(), active: true, book: "east", page: 4, counts: [0, 0], repeat: true }, day, { species: "ghelsba-fodder", family: "Orc", west: false }).changed) {
    throw new Error("ghelsba orc");
  }
  const sheepPage = eastRegime(5, [0, 0], true);
  if (advanceRegime(sheepPage, day, { species: "rambukk", family: "Ram", west: false, east: true }).changed) throw new Error("rambukk");
  const sheep = advanceRegime(eastRegime(5, [3, 1], false), day, { species: "east-sheep", family: "Sheep", west: false, east: true });
  if (sheep.exp !== 0 || sheep.fov.counts[0] !== 4) throw new Error("east sheep");
  const scarab = advanceRegime(sheep.fov, day, { species: "east-scarab", family: "Beetle", west: false, east: true });
  if (scarab.exp !== 330 || scarab.gil !== 330 || scarab.fov.tabs !== 33 || scarab.fov.paidDays[15] !== day) throw new Error("east scarab page");
  if (advanceRegime({ ...emptyFov(), active: true, page: 2, counts: [0], repeat: true }, day, { species: "east-hare", family: "Rabbit", west: false, east: true }).changed) {
    throw new Error("east hare on west page");
  }
  const legacy = readFov({ tabs: 56, active: true, page: 1, counts: [2], repeat: true, paidDays: { 1: day } });
  if (legacy.book !== "west" || legacy.page !== 1 || legacy.counts[0] !== 2 || legacy.paidDays[1] !== day || legacy.tabs !== 56) throw new Error("missing book is west");
  const eastRead = readFov({ tabs: 56, active: true, book: "east", page: 3, counts: [7], repeat: false, paidDays: { 11: day, 1: day } });
  if (eastRead.book !== "east" || eastRead.page !== 3 || eastRead.counts[0] !== 7 || eastRead.paidDays[11] !== day || eastRead.paidDays[1] !== day) throw new Error("east read");
  if (regimeProgress({ ...emptyFov(), active: true, book: "east", page: 3, counts: [2] }) !== "Forest Hare 2/7") throw new Error("east progress");
  if (EAST_REGIMES.length !== 5) throw new Error("east pages");
}
