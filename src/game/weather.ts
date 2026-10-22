/**
 * Tier-1 storms and Klimaform. Scholar only. Storm II is a level-99 job-point spell and is not here.
 * This file does not import the spell catalog. The catalog imports these rows.
 *
 * The client row for a storm is 30 MP, a 2 second cast, an 18 second recast, and 180 seconds.
 * BG still prints a 7 second cast. That card is stale, the same way Haste's 6 second card is.
 * The card prints 20'. Windower's range field is 12, the same field Stone uses, and this yard does not read that field as yalms.
 * Each one overwrites every other storm. There is no second weather. It is single weather, not double, and it replaces zone weather.
 * This yard has no zone weather, so the storm is the only weather.
 * Matching elemental damage is 10% higher. The opposed element is 10% lower. A neutral element is unchanged.
 * The magic-accuracy bonus from weather is not printed as a number, so it is not added. Klimaform's +15 is a different term.
 * Stormsurge is not unlocked, so the attribute bonus is 0.
 * Cumulative enmity 1, volatile enmity 300. The cast credits it only when you are already on the hate list.
 */
export type StormElement = "fire" | "ice" | "wind" | "earth" | "thunder" | "water" | "light" | "dark";

export type StormRow = {
  name: string;
  level: number;
  element: StormElement;
  /** The word the description puts in quotes. Thunderstorm's word is thundery. */
  sky: string;
  /** Stormsurge attribute. "all" is Voidstorm: half of the rank, floored. Zero ranks add nothing. */
  stat: "VIT" | "MND" | "AGI" | "STR" | "INT" | "DEX" | "CHR" | "all";
};

export const STORM_SECONDS = 180;
export const STORM_MP = 30;
export const STORM_CAST = 2;
export const STORM_RECAST = 18;
export const STORM_RANGE = 20;
export const STORM_CE = 1;
export const STORM_VE = 300;
/** Single weather. Double weather would be 25% and is not what a storm spell is. */
export const STORM_BONUS = 0.1;

export const STORMS: readonly StormRow[] = [
  { name: "Sandstorm", level: 41, element: "earth", sky: "dusty", stat: "VIT" },
  { name: "Rainstorm", level: 42, element: "water", sky: "rainy", stat: "MND" },
  { name: "Windstorm", level: 43, element: "wind", sky: "windy", stat: "AGI" },
  { name: "Firestorm", level: 44, element: "fire", sky: "hot", stat: "STR" },
  { name: "Hailstorm", level: 45, element: "ice", sky: "snowy", stat: "INT" },
  { name: "Thunderstorm", level: 46, element: "thunder", sky: "thundery", stat: "DEX" },
  { name: "Voidstorm", level: 47, element: "dark", sky: "gloomy", stat: "all" },
  { name: "Aurorastorm", level: 48, element: "light", sky: "auroras", stat: "CHR" },
];

export const STORM_OPPOSE: Record<StormElement, StormElement> = {
  fire: "ice",
  ice: "fire",
  wind: "earth",
  earth: "wind",
  thunder: "water",
  water: "thunder",
  light: "dark",
  dark: "light",
};

export function stormByName(name: string): StormRow | null {
  return STORMS.find((row) => row.name === name) ?? null;
}

/** The one storm on the player. A later storm has already replaced the earlier one. */
export function activeStorm(buffs: readonly { name: string }[]): StormRow | null {
  for (const buff of buffs) {
    const row = stormByName(buff.name);
    if (row) return row;
  }
  return null;
}

/**
 * Single-weather damage. Neutral weather returns the same integer and an empty note.
 * Floor after the 10%. No day term. No double-weather 25%.
 * Helix always takes this. A nuke's chance is about a third without an obi.
 * That rate is not printed, so the 10% is applied.
 */
export function weatherAdjusted(amount: number, element: StormElement | null, buffs: readonly { name: string }[]): { value: number; note: string } {
  const storm = activeStorm(buffs);
  if (!storm || element == null || amount <= 0) return { value: amount, note: "" };
  const match = storm.element === element;
  const oppose = STORM_OPPOSE[storm.element] === element;
  if (!match && !oppose) return { value: amount, note: "" };
  const signed = match ? 1 : -1;
  const value = Math.floor(amount * (1 + signed * STORM_BONUS));
  const note = match
    ? ` ${storm.name} is single ${storm.sky} weather, so the hit is 10% higher.`
    : ` ${storm.name} opposes this element, so the hit is 10% lower.`;
  return { value, note };
}

/**
 * Klimaform. Black magic, Dark Magic skill, Scholar 46, self.
 * The client row is 30 MP, a 3 second cast, a 180 second recast, and 300 seconds.
 * BG still prints a 7 second cast. Gamer Escape still prints 5 seconds and 3 minutes. Those are stale.
 * The card's range is 20' and the target is yourself, so the range is not checked.
 * Element dark. +15 magic accuracy for a spell of the same element as the weather, and Dark Magic skill does not change that 15.
 * No weather means no bonus. Savant's Loafers and Arbatel Loafers are not equipped, so there is no damage term.
 * Enhancing duration gear does not lengthen it. Perpetuance is not in this kit. Composure does triple it, and stops at 30:00.
 * It does not stack with Intension. Intension is not in this yard.
 * Cumulative enmity 300, volatile enmity 1.
 */
export const KLIMAFORM_MP = 30;
export const KLIMAFORM_CAST = 3;
export const KLIMAFORM_RECAST = 180;
export const KLIMAFORM_SECONDS = 300;
export const KLIMAFORM_MACC = 15;
export const KLIMAFORM_CE = 300;
export const KLIMAFORM_VE = 1;

export function klimaformMacc(element: StormElement | null, buffs: readonly { name: string }[]): number {
  if (element == null || !buffs.some((buff) => buff.name === "Klimaform")) return 0;
  const storm = activeStorm(buffs);
  if (!storm || storm.element !== element) return 0;
  return KLIMAFORM_MACC;
}
