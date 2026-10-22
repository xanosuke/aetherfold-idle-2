/** FFXI synthesis. Crystals live here, not in the bag. Skills start at 0.0. */
import { ALL_ITEM_IDS, ITEMS } from "./content";

export type CrystalId = "fire" | "ice" | "wind" | "earth" | "lightning" | "water" | "light" | "dark";

export const CRYSTALS: { id: CrystalId; name: string; color: string }[] = [
  { id: "fire", name: "Fire", color: "#e24a3b" },
  { id: "ice", name: "Ice", color: "#8ec8ef" },
  { id: "wind", name: "Wind", color: "#7dcea0" },
  { id: "earth", name: "Earth", color: "#c4a574" },
  { id: "lightning", name: "Ltng", color: "#d4c15a" },
  { id: "water", name: "Water", color: "#5b8def" },
  { id: "light", name: "Light", color: "#f4ecd4" },
  { id: "dark", name: "Dark", color: "#6b5b8a" },
];

export type CraftId = "wood" | "smith" | "gold" | "cloth" | "leather" | "bone" | "alchemy" | "cook";

export const CRAFTS: { id: CraftId; name: string; short: string }[] = [
  { id: "wood", name: "Woodworking", short: "Wood" },
  { id: "smith", name: "Smithing", short: "Smith" },
  { id: "gold", name: "Goldsmithing", short: "Gold" },
  { id: "cloth", name: "Clothcraft", short: "Cloth" },
  { id: "leather", name: "Leathercraft", short: "Leather" },
  { id: "bone", name: "Bonecraft", short: "Bone" },
  { id: "alchemy", name: "Alchemy", short: "Alchemy" },
  { id: "cook", name: "Cooking", short: "Cook" },
];

export type Ingredient = { name: string; qty: number };

export type Recipe = {
  id: string;
  craft: CraftId;
  level: number;
  result: string;
  qty: number;
  crystal: CrystalId;
  materials: Ingredient[];
};

const R = (
  craft: CraftId,
  level: number,
  result: string,
  qty: number,
  crystal: CrystalId,
  materials: Ingredient[],
): Recipe => ({
  id: `${craft}-${level}-${result.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
  craft,
  level,
  result,
  qty,
  crystal,
  materials,
});

/** Amateur recipes, skill 1–10. One craft each. Counts and crystals follow the retail log. */
export const RECIPES: Recipe[] = [
  R("wood", 3, "Lauan Lumber", 1, "wind", [{ name: "Lauan Log", qty: 1 }]),
  R("wood", 4, "Wooden Arrow", 33, "wind", [{ name: "Arrowwood Lumber", qty: 1 }, { name: "Chocobo Feather", qty: 2 }, { name: "Flint Stone", qty: 1 }]),
  R("wood", 5, "Maple Lumber", 1, "wind", [{ name: "Maple Log", qty: 1 }]),
  R("wood", 6, "Maple Wand", 1, "wind", [{ name: "Maple Lumber", qty: 1 }, { name: "Chocobo Feather", qty: 1 }]),
  R("wood", 8, "Ash Lumber", 1, "wind", [{ name: "Ash Log", qty: 1 }]),
  R("wood", 9, "Ash Club", 1, "wind", [{ name: "Ash Lumber", qty: 1 }]),
  R("wood", 10, "Ash Staff", 1, "wind", [{ name: "Ash Lumber", qty: 1 }, { name: "Bat Fang", qty: 1 }]),
  R("smith", 2, "Bronze Ingot", 1, "fire", [{ name: "Copper Ore", qty: 3 }, { name: "Tin Ore", qty: 1 }]),
  R("smith", 3, "Bronze Dagger", 1, "fire", [{ name: "Bronze Ingot", qty: 1 }, { name: "Copper Ingot", qty: 1 }]),
  R("smith", 4, "Bronze Sheet", 1, "fire", [{ name: "Bronze Ingot", qty: 1 }]),
  R("smith", 5, "Bronze Knife", 1, "fire", [{ name: "Ash Lumber", qty: 1 }, { name: "Bronze Ingot", qty: 1 }]),
  R("smith", 6, "Bronze Sword", 1, "fire", [{ name: "Bronze Ingot", qty: 2 }, { name: "Sheep Leather", qty: 1 }]),
  R("smith", 10, "Bronze Mace", 1, "fire", [{ name: "Bronze Ingot", qty: 3 }]),
  R("gold", 1, "Zinc Oxide", 1, "fire", [{ name: "Zinc Ore", qty: 3 }]),
  R("gold", 2, "Stone Arrowheads", 6, "wind", [{ name: "Flint Stone", qty: 2 }]),
  R("gold", 3, "Copper Ingot", 1, "fire", [{ name: "Copper Ore", qty: 4 }]),
  R("gold", 5, "Copper Ring", 1, "fire", [{ name: "Copper Ingot", qty: 2 }]),
  R("gold", 7, "Copper Hairpin", 1, "wind", [{ name: "Copper Ingot", qty: 1 }]),
  R("gold", 9, "Brass Ingot", 1, "fire", [{ name: "Copper Ore", qty: 3 }, { name: "Zinc Ore", qty: 1 }]),
  R("cloth", 1, "Grass Thread", 3, "wind", [{ name: "Yagudo Necklace", qty: 1 }]),
  R("cloth", 4, "Grass Cloth", 1, "earth", [{ name: "Grass Thread", qty: 3 }]),
  R("cloth", 5, "Headgear", 1, "wind", [{ name: "Grass Cloth", qty: 2 }, { name: "Grass Thread", qty: 1 }]),
  R("cloth", 6, "Gloves", 1, "earth", [{ name: "Grass Cloth", qty: 2 }, { name: "Grass Thread", qty: 1 }, { name: "Saruta Cotton", qty: 2 }]),
  R("cloth", 8, "Cape", 1, "earth", [{ name: "Grass Cloth", qty: 2 }, { name: "Grass Thread", qty: 1 }]),
  R("cloth", 10, "Doublet", 1, "earth", [{ name: "Grass Cloth", qty: 4 }, { name: "Grass Thread", qty: 1 }, { name: "Saruta Cotton", qty: 3 }]),
  R("leather", 2, "Sheep Leather", 1, "dark", [{ name: "Distilled Water", qty: 1 }, { name: "Sheepskin", qty: 1 }, { name: "Willow Log", qty: 1 }]),
  R("leather", 4, "Sheep Wool", 1, "wind", [{ name: "Sheepskin", qty: 2 }]),
  R("leather", 5, "Leather Bandana", 1, "wind", [{ name: "Sheep Leather", qty: 1 }]),
  R("leather", 8, "Leather Gloves", 1, "earth", [{ name: "Grass Cloth", qty: 1 }, { name: "Sheep Leather", qty: 2 }]),
  R("leather", 10, "Leather Vest", 1, "earth", [{ name: "Lizard Skin", qty: 1 }, { name: "Sheep Leather", qty: 3 }]),
  R("bone", 1, "Shell Powder", 1, "wind", [{ name: "Seashell", qty: 3 }]),
  R("bone", 3, "Shell Earring", 1, "wind", [{ name: "Seashell", qty: 2 }]),
  R("bone", 6, "Fish Scales", 12, "lightning", [{ name: "Gavial Fish", qty: 1 }]),
  R("bone", 7, "Shell Ring", 1, "wind", [{ name: "Fish Scales", qty: 1 }, { name: "Seashell", qty: 1 }]),
  R("bone", 9, "Bone Arrowheads", 6, "wind", [{ name: "Bone Chip", qty: 2 }]),
  R("alchemy", 2, "Distilled Water", 3, "lightning", [{ name: "Tahrongi Cactus", qty: 1 }]),
  R("alchemy", 3, "Antidote", 1, "water", [{ name: "Distilled Water", qty: 1 }, { name: "San d'Orian Grape", qty: 1 }, { name: "Wijnruit", qty: 1 }]),
  R("alchemy", 5, "Beeswax", 1, "fire", [{ name: "Beehive Chip", qty: 3 }, { name: "Distilled Water", qty: 1 }]),
  R("alchemy", 6, "Tsurara", 10, "ice", [{ name: "Distilled Water", qty: 2 }, { name: "Rock Salt", qty: 1 }]),
  R("alchemy", 7, "Animal Glue", 1, "fire", [{ name: "Bone Chip", qty: 2 }, { name: "Distilled Water", qty: 1 }, { name: "Rabbit Hide", qty: 1 }]),
  R("alchemy", 9, "Poison Dust", 1, "lightning", [{ name: "Deathball", qty: 2 }]),
  R("cook", 2, "Roasted Corn", 1, "fire", [{ name: "Millioncorn", qty: 1 }]),
  R("cook", 3, "Carrot Broth", 4, "water", [{ name: "San d'Orian Carrot", qty: 4 }]),
  R("cook", 4, "Hard-Boiled Egg", 1, "fire", [{ name: "Distilled Water", qty: 1 }, { name: "Lizard Egg", qty: 1 }]),
  R("cook", 5, "Pebble Soup", 1, "fire", [{ name: "Distilled Water", qty: 1 }, { name: "Flint Stone", qty: 3 }]),
  R("cook", 6, "Grilled Hare", 1, "fire", [{ name: "Dried Marjoram", qty: 1 }, { name: "Hare Meat", qty: 1 }]),
  R("cook", 7, "Herbal Broth", 4, "water", [{ name: "Beaugreens", qty: 2 }, { name: "Frost Turnip", qty: 2 }]),
];

const BY_NAME: Record<string, string> = {};
for (const id of ALL_ITEM_IDS) BY_NAME[ITEMS[id].name] = id;

export function gearIdForResult(name: string): string | null {
  return BY_NAME[name] ?? null;
}

/** A named ingredient in the bag, plus any leftover in the craft pile. */
export function materialOnHand(
  name: string,
  inventory: Record<string, number> | undefined,
  stock: Record<string, number> | undefined,
): number {
  const id = gearIdForResult(name);
  const bag = id ? Math.max(0, Math.floor(inventory?.[id] ?? 0)) : 0;
  const pile = Math.max(0, Math.floor(stock?.[name] ?? 0));
  return bag + pile;
}

export function recipeById(id: string): Recipe | null {
  return RECIPES.find((row) => row.id === id) ?? null;
}

export function recipesFor(craft: CraftId): Recipe[] {
  return RECIPES.filter((row) => row.craft === craft).sort((a, b) => a.level - b.level || a.result.localeCompare(b.result));
}

export type CrystalWallet = Record<CrystalId, number>;
export type CraftSkills = Record<CraftId, number>;

export function emptyCrystals(): CrystalWallet {
  return { fire: 0, ice: 0, wind: 0, earth: 0, lightning: 0, water: 0, light: 0, dark: 0 };
}

export function emptyCraftSkill(): CraftSkills {
  return { wood: 0, smith: 0, gold: 0, cloth: 0, leather: 0, bone: 0, alchemy: 0, cook: 0 };
}

export function sanitizeCrystals(raw: unknown): CrystalWallet {
  const out = emptyCrystals();
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return out;
  const row = raw as Record<string, unknown>;
  for (const crystal of CRYSTALS) {
    const n = row[crystal.id];
    if (typeof n === "number" && Number.isFinite(n)) out[crystal.id] = Math.max(0, Math.min(9999, Math.floor(n)));
  }
  return out;
}

export function sanitizeCraftSkill(raw: unknown): CraftSkills {
  const out = emptyCraftSkill();
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return out;
  const row = raw as Record<string, unknown>;
  for (const craft of CRAFTS) {
    const n = row[craft.id];
    if (typeof n === "number" && Number.isFinite(n)) out[craft.id] = Math.max(0, Math.min(1100, Math.floor(n)));
  }
  return out;
}

export function sanitizeCraftStock(raw: unknown): Record<string, number> {
  const out: Record<string, number> = {};
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return out;
  for (const [name, count] of Object.entries(raw as Record<string, unknown>)) {
    if (!/^[A-Za-z0-9][A-Za-z0-9 '+.-]{0,40}$/.test(name)) continue;
    if (typeof count !== "number" || !Number.isFinite(count)) continue;
    const qty = Math.max(0, Math.min(9999, Math.floor(count)));
    if (qty > 0) out[name] = qty;
  }
  return out;
}

/** Tenths. 0 is 0.0. A skill of 0 can attempt recipes through level 5. */
export function attemptLimit(tenths: number): number {
  return Math.floor(Math.max(0, tenths) / 10) + 5;
}

export function skillText(tenths: number): string {
  const n = Math.max(0, Math.floor(tenths));
  return `${Math.floor(n / 10)}.${n % 10}`;
}

export function skillAfterSuccess(tenths: number, level: number): number {
  const skill = tenths / 10;
  if (level + 2 < skill) return tenths;
  const gain = level >= skill ? 3 : 1;
  return Math.min(1100, tenths + gain);
}

/** Same line as a fishing skill-up. Rise is tenths, so 3 prints 0.3. */
export function craftSkillLine(name: string, riseTenths: number): string {
  const n = Math.max(0, Math.floor(riseTenths));
  return `${name} skill up ${(n / 10).toFixed(1)}`;
}

export function levelBands(craft: CraftId): { start: number; end: number }[] {
  const levels = recipesFor(craft).map((row) => row.level);
  if (levels.length === 0) return [{ start: 1, end: 5 }];
  const top = Math.max(5, ...levels);
  const bands: { start: number; end: number }[] = [];
  for (let start = 1; start <= top; start += 5) bands.push({ start, end: start + 4 });
  return bands;
}

export function assertCraft(): void {
  if (CRYSTALS.length !== 8 || CRAFTS.length !== 8) throw new Error("eight crafts and crystals");
  if (sanitizeCrystals(null).fire !== 0 || sanitizeCraftSkill(undefined).wood !== 0) throw new Error("crafts start at zero");
  if (attemptLimit(0) !== 5) throw new Error("skill 0 attempts 1-5");
  if (skillAfterSuccess(0, 1) !== 3) throw new Error("first synth skills up");
  if (skillAfterSuccess(0, 4) !== 3) throw new Error("every craft skills on a first synth");
  if (skillAfterSuccess(31, 1) !== 31) throw new Error("a recipe too far under the skill does not rise");
  if (craftSkillLine("Smithing", 1) !== "Smithing skill up 0.1") throw new Error("smith skill line");
  if (craftSkillLine("Cooking", 3) !== "Cooking skill up 0.3") throw new Error("cook skill line");
  if (craftSkillLine("Alchemy", 1) !== "Alchemy skill up 0.1") throw new Error("alchemy skill line");
  for (const craft of CRAFTS) {
    const rows = recipesFor(craft.id);
    if (!rows.some((row) => row.level <= 5)) throw new Error(`${craft.id} has no amateur recipe`);
  }
  if (gearIdForResult("Bronze Sword") !== "bronze-sword") throw new Error("crafted sword is gear");
  if (materialOnHand("Hare Meat", { "hare-meat": 4 }, { "Hare Meat": 1 }) !== 5) throw new Error("bag meat counts");
  if (materialOnHand("Dried Marjoram", {}, { "Dried Marjoram": 2 }) !== 2) throw new Error("pile still counts");
}
