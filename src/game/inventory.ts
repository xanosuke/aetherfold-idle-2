/** The bag is 200 slots. A stack shares one slot up to 99, then the rest takes another. */
import { ALL_ITEM_IDS, ITEMS } from "./content";

export const BAG_SLOTS = 200;
export const STACK_MAX = 99;

const STACKABLE = new Set(["Arrow", "Bolt", "Bullet", "Jug", "Oil", "Pet Food", "Throwing", "Material", "Bait"]);

export function itemStacks(kind: string | undefined): boolean {
  return kind != null && STACKABLE.has(kind);
}

export type BagCell = { id: string; qty: number };

/** One cell per slot the count occupies. Gear never shares a slot. */
export function bagCells(inventory: Record<string, number> | undefined): BagCell[] {
  const cells: BagCell[] = [];
  if (!inventory) return cells;
  for (const id of ALL_ITEM_IDS) {
    const item = ITEMS[id];
    let left = inventory[id];
    if (!item || typeof left !== "number" || !Number.isFinite(left) || left <= 0) continue;
    left = Math.floor(left);
    const cap = itemStacks(item.kind) ? STACK_MAX : 1;
    while (left > 0) {
      const qty = Math.min(cap, left);
      cells.push({ id, qty });
      left -= qty;
    }
  }
  return cells;
}

export function bagUsed(inventory: Record<string, number> | undefined): number {
  return bagCells(inventory).length;
}

export function assertInventory(): void {
  const cells = bagCells({ "wooden-arrow": 100, "bronze-sword": 2 });
  const arrows = cells.filter((cell) => cell.id === "wooden-arrow");
  const swords = cells.filter((cell) => cell.id === "bronze-sword");
  if (cells.length !== 4 || arrows.length !== 2 || swords.length !== 2) throw new Error("bag slots");
  if (arrows[0]?.qty !== 99 || arrows[1]?.qty !== 1) throw new Error("overflow stack");
  if (STACK_MAX !== 99 || BAG_SLOTS !== 200) throw new Error("bag size");
}
