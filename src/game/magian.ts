/**
 * Magian Trials. One piece of gear, other than ammo, can be inscribed.
 * The trial is not a stat until the crystals are turned in. The enchantment
 * then stays on that item. A Removal Stone is the only way to clear it.
 *
 * The piece's level multiplies the base bonus and the crystals:
 * 1–19 ×1, 20–29 ×2, 30–39 ×3, 40–49 ×4, 50–59 ×5, 60–69 ×6, 70–74 ×7, 75 ×8.
 * A two-handed weapon doubles that bonus again. The crystals stay at the level cost.
 */
import type { CrystalId, CrystalWallet } from "./craft";
import { DEFAULT_LOADOUT, ITEMS, derive, fitLoadout, type WornAugment } from "./content";

export const TRIAL_QTY = 10;
export const REMOVAL_STONE_GIL = 1000;

export type TrialId = "str" | "dex" | "vit" | "agi" | "mnd" | "int" | "chr" | "mp";

export type MagianBonus = Required<WornAugment>;

export type MagianTrial = {
  id: TrialId;
  name: string;
  crystal: CrystalId;
  crystalName: string;
  bonus: MagianBonus;
};

export type MagianActive = { itemId: string; trial: TrialId };

export type MagianBook = {
  active: MagianActive | null;
  augments: Record<string, TrialId>;
  stones: number;
};

const ZERO: MagianBonus = {
  str: 0, dex: 0, vit: 0, agi: 0, int: 0, mnd: 0, chr: 0,
  hp: 0, mp: 0, attack: 0, acc: 0, def: 0, eva: 0,
  mab: 0, mdb: 0, macc: 0,
};

function pack(partial: Partial<MagianBonus>): MagianBonus {
  return { ...ZERO, ...partial };
}

export const MAGIAN_TRIALS: readonly MagianTrial[] = [
  { id: "str", name: "Flame", crystal: "fire", crystalName: "Fire", bonus: pack({ str: 1, attack: 2 }) },
  { id: "dex", name: "Spark", crystal: "lightning", crystalName: "Lightning", bonus: pack({ dex: 1, acc: 2 }) },
  { id: "vit", name: "Stone", crystal: "earth", crystalName: "Earth", bonus: pack({ vit: 1, def: 2 }) },
  { id: "agi", name: "Gale", crystal: "wind", crystalName: "Wind", bonus: pack({ agi: 1, eva: 2 }) },
  { id: "mnd", name: "Tide", crystal: "water", crystalName: "Water", bonus: pack({ mnd: 1, mdb: 2 }) },
  { id: "int", name: "Frost", crystal: "ice", crystalName: "Ice", bonus: pack({ int: 1, mab: 2 }) },
  { id: "chr", name: "Dawn", crystal: "light", crystalName: "Light", bonus: pack({ chr: 1, hp: 2 }) },
  { id: "mp", name: "Void", crystal: "dark", crystalName: "Dark", bonus: pack({ mp: 2, macc: 2 }) },
];

const TRIAL_IDS = new Set<string>(MAGIAN_TRIALS.map((trial) => trial.id));

export function emptyMagian(): MagianBook {
  return { active: null, augments: {}, stones: 0 };
}

export function trialById(id: string | null | undefined): MagianTrial | null {
  if (!id) return null;
  return MAGIAN_TRIALS.find((trial) => trial.id === id) ?? null;
}

/** How many times the level-1 trial is repeated. Level 75 is eight. */
export function trialRank(level: number): number {
  const lv = Math.max(0, Math.floor(level));
  if (lv >= 75) return 8;
  if (lv >= 70) return 7;
  if (lv >= 60) return 6;
  if (lv >= 50) return 5;
  if (lv >= 40) return 4;
  if (lv >= 30) return 3;
  if (lv >= 20) return 2;
  return 1;
}

export function trialQty(level: number): number {
  return TRIAL_QTY * trialRank(level);
}

export function scaleBonus(bonus: MagianBonus, rank: number, twoHand: boolean): MagianBonus {
  const mult = Math.max(1, Math.floor(rank)) * (twoHand ? 2 : 1);
  const next = { ...bonus };
  for (const key of Object.keys(next) as (keyof MagianBonus)[]) next[key] *= mult;
  return next;
}

export function twoHandItem(itemId: string | null | undefined): boolean {
  return Boolean(itemId && ITEMS[itemId]?.grip === "two");
}

export function bonusForItem(itemId: string, trialId: TrialId): MagianBonus | null {
  const trial = trialById(trialId);
  const item = ITEMS[itemId];
  if (!trial || !item || item.slot === "ammo") return null;
  return scaleBonus(trial.bonus, trialRank(item.level), item.grip === "two");
}

/** Finished enchantments on the items currently worn. An open trial adds nothing. */
export function bonusesFor(book: MagianBook | null | undefined): Record<string, MagianBonus> {
  const out: Record<string, MagianBonus> = {};
  const augments = book?.augments ?? {};
  for (const [itemId, trialId] of Object.entries(augments)) {
    if (!trialById(trialId)) continue;
    const bonus = bonusForItem(itemId, trialId);
    if (bonus) out[itemId] = bonus;
  }
  return out;
}

const LABELS: { key: keyof MagianBonus; label: string }[] = [
  { key: "str", label: "STR" },
  { key: "dex", label: "DEX" },
  { key: "vit", label: "VIT" },
  { key: "agi", label: "AGI" },
  { key: "int", label: "INT" },
  { key: "mnd", label: "MND" },
  { key: "chr", label: "CHR" },
  { key: "attack", label: "Attack" },
  { key: "acc", label: "Accuracy" },
  { key: "def", label: "Defense" },
  { key: "eva", label: "Evasion" },
  { key: "mab", label: "Magic Attack" },
  { key: "mdb", label: "Magic Defense" },
  { key: "hp", label: "HP" },
  { key: "mp", label: "MP" },
  { key: "macc", label: "Magic Accuracy" },
];

export function bonusText(bonus: MagianBonus): string {
  const parts: string[] = [];
  for (const row of LABELS) {
    const n = bonus[row.key];
    if (!n) continue;
    parts.push(`${row.label} ${n > 0 ? "+" : ""}${n}`);
  }
  return parts.join("  ");
}

/** Lines for an item card. Null when the piece has no trial and no enchantment. */
export function describeMagian(itemId: string, book: MagianBook | null | undefined): string | null {
  const safe = book ?? emptyMagian();
  const done = safe.augments[itemId];
  const trial = trialById(done);
  if (trial) {
    const bonus = bonusForItem(itemId, trial.id);
    return bonus ? `Enchanted: ${bonusText(bonus)}` : null;
  }
  if (safe.active?.itemId === itemId) {
    const open = trialById(safe.active.trial);
    const item = ITEMS[itemId];
    if (!open || !item) return null;
    const qty = trialQty(item.level);
    return `Inscribed: ${open.name}. Turn in ${qty} ${open.crystalName} ${qty === 1 ? "crystal" : "crystals"}.`;
  }
  return null;
}

function copyBook(book: MagianBook): MagianBook {
  return {
    active: book.active ? { ...book.active } : null,
    augments: { ...book.augments },
    stones: book.stones,
  };
}

export function beginTrial(book: MagianBook, itemId: string, trialId: string): { book: MagianBook; error: string | null; log: string | null } {
  const item = ITEMS[itemId];
  const trial = trialById(trialId);
  if (!item || !trial) return { book, error: "That trial cannot be inscribed.", log: null };
  if (item.slot === "ammo") return { book, error: "Ammo cannot undertake a trial.", log: null };
  if (book.augments[itemId]) return { book, error: "That piece already bears an enchantment.", log: null };
  if (book.active && book.active.itemId !== itemId) {
    const other = ITEMS[book.active.itemId]?.name ?? "another piece";
    return { book, error: `A trial is already inscribed on ${other}.`, log: null };
  }
  if (book.active && book.active.itemId === itemId) {
    if (book.active.trial === trial.id) return { book, error: null, log: null };
    return { book, error: "Abandon the current trial before inscribing another.", log: null };
  }
  return {
    book: { ...copyBook(book), active: { itemId, trial: trial.id } },
    error: null,
    log: `${item.name} is inscribed with the ${trial.name} trial.`,
  };
}

export function abandonTrial(book: MagianBook, itemId: string): { book: MagianBook; error: string | null; log: string | null } {
  if (!book.active || book.active.itemId !== itemId) return { book, error: "No trial is inscribed on that piece.", log: null };
  const next = copyBook(book);
  next.active = null;
  return { book: next, error: null, log: "You abandon the trial. The inscription fades." };
}

export function completeTrial(
  book: MagianBook,
  itemId: string,
  crystals: CrystalWallet,
): { book: MagianBook; crystals: CrystalWallet; error: string | null; log: string | null } {
  if (!book.active || book.active.itemId !== itemId) {
    return { book, crystals, error: "No trial is inscribed on that piece.", log: null };
  }
  const trial = trialById(book.active.trial);
  const item = ITEMS[itemId];
  if (!trial || !item || item.slot === "ammo") {
    return { book, crystals, error: "That trial cannot be finished.", log: null };
  }
  if (book.augments[itemId]) {
    return { book, crystals, error: "That piece already bears an enchantment.", log: null };
  }
  const qty = trialQty(item.level);
  const have = crystals[trial.crystal] ?? 0;
  if (have < qty) {
    return { book, crystals, error: `You need ${qty} ${trial.crystalName} crystals.`, log: null };
  }
  const bonus = bonusForItem(itemId, trial.id);
  const nextCrystals = { ...crystals, [trial.crystal]: have - qty };
  const next = copyBook(book);
  next.active = null;
  next.augments[itemId] = trial.id;
  return {
    book: next,
    crystals: nextCrystals,
    error: null,
    log: `${item.name} keeps ${bonus ? bonusText(bonus) : trial.name}.`,
  };
}

export function clearEnchant(book: MagianBook, itemId: string): { book: MagianBook; error: string | null; log: string | null } {
  if (!book.augments[itemId]) return { book, error: "That piece has no enchantment.", log: null };
  if (book.stones < 1) return { book, error: "You need a Removal Stone.", log: null };
  const item = ITEMS[itemId];
  const next = copyBook(book);
  delete next.augments[itemId];
  next.stones -= 1;
  return {
    book: next,
    error: null,
    log: `A Removal Stone lifts the enchantment from ${item?.name ?? "the piece"}.`,
  };
}

export function sanitizeMagian(raw: unknown): MagianBook {
  const out = emptyMagian();
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return out;
  const row = raw as Record<string, unknown>;
  const stones = row.stones;
  if (typeof stones === "number" && Number.isFinite(stones)) out.stones = Math.max(0, Math.min(99, Math.floor(stones)));
  const augments = row.augments;
  if (augments && typeof augments === "object" && !Array.isArray(augments)) {
    for (const [itemId, trialId] of Object.entries(augments as Record<string, unknown>)) {
      if (typeof trialId !== "string" || !TRIAL_IDS.has(trialId)) continue;
      const item = ITEMS[itemId];
      if (!item || item.slot === "ammo") continue;
      out.augments[itemId] = trialId as TrialId;
    }
  }
  const active = row.active;
  if (active && typeof active === "object" && !Array.isArray(active)) {
    const rec = active as Record<string, unknown>;
    const itemId = rec.itemId;
    const trial = rec.trial;
    if (typeof itemId === "string" && typeof trial === "string" && TRIAL_IDS.has(trial)) {
      const item = ITEMS[itemId];
      if (item && item.slot !== "ammo" && !out.augments[itemId]) out.active = { itemId, trial: trial as TrialId };
    }
  }
  return out;
}

export function assertMagian(): void {
  const empty = sanitizeMagian(null);
  if (empty.active || empty.stones !== 0 || Object.keys(empty.augments).length !== 0) throw new Error("empty magian");
  const junk = sanitizeMagian({
    active: { itemId: "wooden-arrow", trial: "str" },
    augments: { "bronze-sword": "str", "wooden-arrow": "dex", missing: "vit", "bronze-harness": "nope" },
    stones: 3.9,
  });
  if (junk.active) throw new Error("ammo kept a trial");
  if (junk.augments["bronze-sword"] !== "str" || junk.augments["wooden-arrow"] || junk.augments["bronze-harness"]) {
    throw new Error("magian augments were not cleaned");
  }
  if (junk.stones !== 3) throw new Error("magian stones");
  const ranks = [1, 19, 20, 29, 30, 39, 40, 49, 50, 59, 60, 69, 70, 74, 75, 99];
  const expect = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8];
  for (let i = 0; i < ranks.length; i += 1) {
    if (trialRank(ranks[i]) !== expect[i] || trialQty(ranks[i]) !== 10 * expect[i]) throw new Error("trial rank");
  }
  const flame = trialById("str");
  const frost = trialById("int");
  if (!flame || !frost) throw new Error("trial catalog");
  if (scaleBonus(flame.bonus, 1, false).str !== 1 || scaleBonus(flame.bonus, 1, false).attack !== 2) throw new Error("one-hand flame");
  if (scaleBonus(flame.bonus, 1, true).str !== 2 || scaleBonus(flame.bonus, 1, true).attack !== 4) throw new Error("two-hand flame");
  if (scaleBonus(flame.bonus, 3, false).str !== 3 || scaleBonus(flame.bonus, 3, false).attack !== 6) throw new Error("level 30 flame");
  if (scaleBonus(flame.bonus, 8, true).str !== 16 || scaleBonus(flame.bonus, 8, true).attack !== 32) throw new Error("level 75 two-hand flame");
  const sword = derive(DEFAULT_LOADOUT, "hume");
  const inscribed = derive(DEFAULT_LOADOUT, "hume", "WAR", null, [], bonusesFor({
    active: null,
    stones: 0,
    augments: { "bronze-sword": "str" },
  }));
  if (inscribed.str !== sword.str + 1 || inscribed.attackFlat < sword.attackFlat + 2) throw new Error("sword augment missed the sheet");
  const staffGear = fitLoadout({ ...DEFAULT_LOADOUT, main: "ash-staff" }, "BLM");
  const bare = derive(staffGear, "hume", "BLM");
  const frosted = derive(staffGear, "hume", "BLM", null, [], bonusesFor({
    active: null,
    stones: 0,
    augments: { "ash-staff": "int" },
  }));
  if (frosted.int !== bare.int + 2 || frosted.mab !== bare.mab + 4 || frosted.gearMacc !== 0) throw new Error("staff trial did not double");
  const open = beginTrial(emptyMagian(), "bronze-sword", "dex");
  if (open.error || open.book.active?.trial !== "dex") throw new Error("inscribe");
  const blocked = beginTrial(open.book, "bronze-harness", "vit");
  if (!blocked.error || blocked.book.active?.itemId !== "bronze-sword") throw new Error("second trial");
  const ammo = beginTrial(emptyMagian(), "wooden-arrow", "str");
  if (!ammo.error) throw new Error("ammo trial");
  const wallet = { fire: 0, ice: 0, wind: 0, earth: 0, lightning: 9, water: 0, light: 0, dark: 10 };
  const short = completeTrial(open.book, "bronze-sword", wallet);
  if (!short.error || short.crystals.lightning !== 9) throw new Error("short crystals");
  const paid = completeTrial(open.book, "bronze-sword", { ...wallet, lightning: 10 });
  if (paid.error || paid.book.active || paid.book.augments["bronze-sword"] !== "dex" || paid.crystals.lightning !== 0) {
    throw new Error("turn-in");
  }
  const again = beginTrial(paid.book, "bronze-sword", "str");
  if (!again.error) throw new Error("second enchantment");
  const noStone = clearEnchant(paid.book, "bronze-sword");
  if (!noStone.error) throw new Error("free removal");
  const lifted = clearEnchant({ ...paid.book, stones: 1 }, "bronze-sword");
  if (lifted.error || lifted.book.augments["bronze-sword"] || lifted.book.stones !== 0) throw new Error("removal stone");
  const dropped = abandonTrial(open.book, "bronze-sword");
  if (dropped.error || dropped.book.active) throw new Error("abandon");
}
