/**
 * Automaton heads, frames, and attachments through level 75.
 * All six heads and all four frames are already in the bag.
 * Elemental capacity is the head plus the frame. The FFXIclopedia table
 * prints eight numbers as fire, wind, thunder, light, ice, earth, water, dark.
 * A frame holds 12 attachments. The same attachment cannot be slotted twice.
 * Three maneuvers can be up. A fourth replaces the oldest.
 * While the automaton is deployed, each maneuver climbs 3 seconds every
 * 3 seconds, up to 5 minutes. Heeled, the timers tick down.
 * The head picks the spell. The frame picks the weapon.
 * Only a Harlequin or Stormwaker frame can cast. A Valoredge or Sharpshot
 * frame has no MP, even with a casting head.
 * Spells stop at magic skill 276. Addle and Cure VI are past that.
 * Attachment tables are the current 0-to-3 maneuver values.
 * Overdrive doubles maneuver count for those tables, capped at 3,
 * and doubles the raw stat bonus. Burden can Overload.
 */

import { skillCap, type SkillRank } from "./skills";
import { chainRank } from "./skillchain";

export const AUTO_ELEMENTS = ["fire", "ice", "wind", "earth", "thunder", "water", "light", "dark"] as const;
export type AutoElement = (typeof AUTO_ELEMENTS)[number];

/** The attachment menu prints the orbs in this order. */
export const AUTO_ELEMENT_ROWS: readonly (readonly AutoElement[])[] = [
  ["fire", "earth", "light"],
  ["ice", "thunder", "water"],
  ["wind", "dark"],
];

export const AUTO_ELEMENT_LABEL: Record<AutoElement, string> = {
  fire: "Fire",
  ice: "Ice",
  wind: "Wind",
  earth: "Earth",
  thunder: "Thunder",
  water: "Water",
  light: "Light",
  dark: "Dark",
};

export const AUTO_ELEMENT_COLOR: Record<AutoElement, string> = {
  fire: "#e23b2f",
  ice: "#7ec8e3",
  wind: "#3dba6a",
  earth: "#e2c14a",
  thunder: "#b06cff",
  water: "#3a6ea5",
  light: "#f4f0e6",
  dark: "#6b5878",
};

export const AUTO_SLOTS = 12;

export type AutoHeadId = "harlequin" | "valoredge" | "sharpshot" | "stormwaker" | "soulsoother" | "spiritreaver";
export type AutoFrameId = "harlequin" | "valoredge" | "sharpshot" | "stormwaker";

export type AutoHead = {
  id: AutoHeadId;
  name: string;
  blurb: string;
  /** This head's elemental capacity. The frame adds its own. */
  cap: Record<AutoElement, number>;
};

export type AutoFrame = {
  id: AutoFrameId;
  name: string;
  blurb: string;
  /** This frame's elemental capacity. The head adds its own. */
  cap: Record<AutoElement, number>;
  /**
   * Level-75 stand-in. BG-Wiki prints the level-99 row.
   * These attributes are that row times 75/99, rounded.
   * Heads do not change HP, MP, or these attributes.
   */
  hp: number;
  mp: number;
  str: number;
  dex: number;
  vit: number;
  agi: number;
  int: number;
  mnd: number;
  chr: number;
};

export type AutoAttachment = {
  name: string;
  element: AutoElement;
  cost: number;
  effect: string;
};

const cap = (fire: number, ice: number, wind: number, earth: number, thunder: number, water: number, light: number, dark: number): Record<AutoElement, number> => ({
  fire, ice, wind, earth, thunder, water, light, dark,
});

export const AUTO_HEADS: readonly AutoHead[] = [
  { id: "harlequin", name: "Harlequin Head", blurb: "Enfeebles and cures, on a Harlequin or Stormwaker frame. Capacity fire 2, ice 2, wind 2, earth 2, thunder 2, water 2.", cap: cap(2, 2, 2, 2, 2, 2, 0, 0) },
  { id: "valoredge", name: "Valoredge Head", blurb: "Cures you and itself. Melee skill +1. The Valoredge frame Shield Bashes on its own.", cap: cap(3, 0, 2, 3, 2, 0, 2, 0) },
  { id: "sharpshot", name: "Sharpshot Head", blurb: "Enfeebles like the Harlequin head. Ranged skill +1. The Sharpshot frame shoots and has no MP.", cap: cap(3, 0, 3, 0, 2, 2, 2, 0) },
  { id: "stormwaker", name: "Stormwaker Head", blurb: "Nukes, enfeebles, cures, and enhancing magic. Melee skill +1. Magic skill +1.", cap: cap(0, 3, 2, 2, 0, 3, 0, 2) },
  { id: "soulsoother", name: "Soulsoother Head", blurb: "Heals, enfeebles, and enhancing magic for the party. No elemental magic. Magic skill +2. Cure V when the skill allows.", cap: cap(0, 3, 2, 2, 0, 3, 3, 0) },
  { id: "spiritreaver", name: "Spiritreaver Head", blurb: "Nukes, enfeebles, Drain, and Aspir. It does not cure. Magic skill +2.", cap: cap(0, 3, 2, 2, 0, 3, 0, 3) },
];

export const AUTO_FRAMES: readonly AutoFrame[] = [
  {
    id: "harlequin",
    name: "Harlequin Frame",
    blurb: "Purple skirt and a gold belt. Blunt melee, and it can cast. Frame capacity is 3 of every element. HP 1228, MP 261. STR 74, DEX 70, VIT 72, AGI 70, INT 67, MND 70, CHR 73.",
    cap: cap(3, 3, 3, 3, 3, 3, 3, 3),
    hp: 1228,
    mp: 261,
    str: 74,
    dex: 70,
    vit: 72,
    agi: 70,
    int: 67,
    mnd: 70,
    chr: 73,
  },
  {
    id: "valoredge",
    name: "Valoredge Frame",
    blurb: "Red armor and gold pauldrons. A slashing arm and a shield. No MP. HP 1487. STR 77, DEX 70, VIT 77, AGI 65, INT 61, MND 70, CHR 72.",
    cap: cap(4, 2, 3, 4, 3, 3, 3, 2),
    hp: 1487,
    mp: 0,
    str: 77,
    dex: 70,
    vit: 77,
    agi: 65,
    int: 61,
    mnd: 70,
    chr: 72,
  },
  {
    id: "sharpshot",
    name: "Sharpshot Frame",
    blurb: "White tunic and a gun on the right. It shoots. No MP. HP 938. STR 70, DEX 73, VIT 72, AGI 78, INT 68, MND 67, CHR 66.",
    cap: cap(3, 2, 4, 3, 4, 3, 3, 2),
    hp: 938,
    mp: 0,
    str: 70,
    dex: 73,
    vit: 72,
    agi: 78,
    int: 68,
    mnd: 67,
    chr: 66,
  },
  {
    id: "stormwaker",
    name: "Stormwaker Frame",
    blurb: "Teal robe and a tail. A casting body, same weapon skills as Harlequin. Frame capacity fire 2, ice 4, wind 2, earth 3, thunder 3, water 3, light 3, dark 4. HP 788, MP 901. STR 68, DEX 67, VIT 68, AGI 70, INT 71, MND 75, CHR 73.",
    cap: cap(2, 4, 2, 3, 3, 3, 3, 4),
    hp: 788,
    mp: 901,
    str: 68,
    dex: 67,
    vit: 68,
    agi: 70,
    int: 71,
    mnd: 75,
    chr: 73,
  },
];

export const AUTO_ATTACHMENTS: readonly AutoAttachment[] = [
  { name: "Tension Spring", element: "fire", cost: 1, effect: "Attack +3% / +6% / +9% / +12% as Fire Maneuvers go from 0 to 3. Stacks with Tension Spring II." },
  { name: "Tension Spring II", element: "fire", cost: 2, effect: "Attack +6% / +9% / +12% / +15%. Stacks with Tension Spring." },
  { name: "Strobe", element: "fire", cost: 1, effect: "Enmity +10 / +25 / +40 / +60. With a Fire Maneuver up, it uses Provoke about every 20 seconds." },
  { name: "Inhibitor", element: "fire", cost: 1, effect: "Store TP +5 / +15 / +25 / +40. At 900 TP or more it saves its bar to close your weapon skill. An open chain is closed even then. Below 900 it opens the chain your weapon skills can close, and ignores maneuvers." },
  { name: "Attuner", element: "fire", cost: 2, effect: "Ignores 5% / 15% / 30% / 45% of a higher-level foe's defense. No effect on an even or weaker foe." },
  { name: "Reactive Shield", element: "fire", cost: 1, effect: "With a Fire Maneuver up, Blaze Spikes. A physical hit splashes 8 / 12 / 18 fire damage back." },
  { name: "Flame Holder", element: "fire", cost: 2, effect: "Weapon skills gain +25% / +100% / +175% / +250% damage. Each Fire Maneuver also adds 10 burden." },
  { name: "Heat Capacitor", element: "fire", cost: 2, effect: "With a Fire Maneuver, Meditate restores 20% / 50% / 80% of the TP bar instantly. Recast 90 seconds. Unlike a Samurai, the TP is not gained over time." },
  { name: "Loudspeaker", element: "ice", cost: 1, effect: "Magic attack bonus +5 / +10 / +15 / +20 on spells." },
  { name: "Loudspeaker II", element: "ice", cost: 2, effect: "Magic attack bonus +10 / +15 / +20 / +25. Stacks with Loudspeaker." },
  { name: "Mana Booster", element: "ice", cost: 2, effect: "Casting delay −20% / −30% / −45% / −60%." },
  { name: "Scanner", element: "ice", cost: 1, effect: "With an Ice Maneuver up, it occasionally scans the foe." },
  { name: "Tranquilizer", element: "ice", cost: 1, effect: "Magic accuracy +10 / +30 / +40 / +50. Enfeebles resist less often." },
  { name: "Ice Maker", element: "ice", cost: 2, effect: "Does nothing with no Ice Maneuver. Elemental magic is then ×1.50 / ×1.75 / ×2.00." },
  { name: "Power Cooler", element: "ice", cost: 2, effect: "Spell MP cost −10% / −20% / −35% / −50% from 0 to 3 Ice Maneuvers. A straight cut, not the Conserve MP trait." },
  { name: "Accelerator", element: "wind", cost: 1, effect: "Evasion +5 / +10 / +15 / +20." },
  { name: "Accelerator II", element: "wind", cost: 2, effect: "Evasion +10 / +15 / +20 / +25. Stacks with Accelerator." },
  { name: "Scope", element: "wind", cost: 1, effect: "Ranged accuracy +10 / +20 / +30 / +40 on the Sharpshot Frame." },
  { name: "Turbo Charger", element: "wind", cost: 2, effect: "Haste +5% / +15% / +20% / +25%. Haste from attachments caps at 43.75%." },
  { name: "Drum Magazine", element: "wind", cost: 1, effect: "Sharpshot delay −3% / −6% / −9% / −15%, and ranged accuracy −5 / −10 / −15 / −20." },
  { name: "Pattern Reader", element: "wind", cost: 2, effect: "Evasion rises while it fights the same foe. Wind Maneuvers raise how fast it climbs." },
  { name: "Barrage Turbine", element: "wind", cost: 2, effect: "Sometimes a Sharpshot shot fires +2 / +3 / +4 extra hits once a Wind Maneuver is up, and Wind burden rises." },
  { name: "Replicator", element: "wind", cost: 2, effect: "At 50% HP or less, Wind Maneuvers become 3 / 7 / 10 shadows and are spent." },
  { name: "Armor Plate", element: "earth", cost: 1, effect: "Physical damage taken −5% / −7% / −10% / −15%." },
  { name: "Armor Plate II", element: "earth", cost: 2, effect: "Physical damage taken −10% / −15% / −20% / −25%. Stacks with Armor Plate." },
  { name: "Shock Absorber", element: "earth", cost: 2, effect: "With an Earth Maneuver up, Stoneskin of about 240 / 280 / 350 HP." },
  { name: "Analyzer", element: "earth", cost: 1, effect: "Once it has seen a special attack, that same move hits for 25% less." },
  { name: "Equalizer", element: "earth", cost: 2, effect: "After a hit over 15% of its HP, damage taken is cut 20% for 8 seconds." },
  { name: "Schurzen", element: "earth", cost: 2, effect: "A killing physical blow spends one Earth Maneuver and leaves 1 HP." },
  { name: "Hammermill", element: "earth", cost: 1, effect: "Enhances the Valoredge frame's Shield Bash. Earth Maneuvers add damage and can Slow. The frame still Bashes on its own." },
  { name: "Stabilizer", element: "thunder", cost: 1, effect: "Accuracy +5 / +10 / +15 / +20." },
  { name: "Stabilizer II", element: "thunder", cost: 2, effect: "Accuracy +10 / +15 / +20 / +25. Stacks with Stabilizer." },
  { name: "Coiler", element: "thunder", cost: 2, effect: "Double Attack +3% / +10% / +20% / +30%." },
  { name: "Galvanizer", element: "thunder", cost: 2, effect: "Counter +10% / +20% / +35% / +50%. A counter makes that physical hit miss, then the automaton strikes back." },
  { name: "Dynamo", element: "thunder", cost: 1, effect: "Critical hit rate +3% / +5% / +7% / +9%." },
  { name: "Volt Gun", element: "thunder", cost: 2, effect: "No lightning without a Thunder Maneuver. Then +8 / +14 / +22 lightning on a hit." },
  { name: "Target Marker", element: "thunder", cost: 2, effect: "Accuracy +10 / +20 / +30 / +40 against a higher-level foe. No effect on an even foe." },
  { name: "Heat Seeker", element: "thunder", cost: 1, effect: "Accuracy rises while it fights. Thunder Maneuvers raise how fast it climbs." },
  { name: "Mana Jammer", element: "water", cost: 1, effect: "Magic defense bonus +10 / +20 / +30 / +40. Magic damage taken falls a little for each 10." },
  { name: "Mana Jammer II", element: "water", cost: 2, effect: "Magic defense bonus +20 / +30 / +40 / +50. Stacks with Mana Jammer." },
  { name: "Condenser", element: "water", cost: 2, effect: "If the next maneuver would Overload, one Water Maneuver is spent and the Overload does not happen." },
  { name: "Heatsink", element: "water", cost: 1, effect: "Burden falls 2 degrees a tick, plus 1 for each Water Maneuver. The bare rate is 1 degree a tick." },
  { name: "Steam Jacket", element: "water", cost: 2, effect: "A second hit of the same kind, physical or magical, within 10 seconds is cut by 15%." },
  { name: "Stealth Screen", element: "water", cost: 1, effect: "Enmity −10 / −20 / −30 / −40." },
  { name: "Auto-Repair Kit", element: "light", cost: 1, effect: "No regen without a Light Maneuver. Then 1 + 0.125% HP, 2 + 0.225% HP, 3 + 0.375% HP every 3 seconds." },
  { name: "Auto-Repair Kit II", element: "light", cost: 2, effect: "Maximum HP +10%. Regen 3 + 0.6% HP, 6 + 1.2% HP, 9 + 1.8% HP while Light Maneuvers are up. Stacks with Auto-Repair Kit." },
  { name: "Optic Fiber", element: "light", cost: 1, effect: "Other attachments +10%. Light Maneuvers, or maneuvers of that attachment's element, raise the bonus to +20% / +25% / +30%." },
  { name: "Flashbulb", element: "light", cost: 2, effect: "With a Light Maneuver up, Flash every 45 seconds." },
  { name: "Damage Gauge", element: "light", cost: 1, effect: "Cures sooner. Soulsoother starts at 98% of your HP instead of 92%." },
  { name: "Eraser", element: "light", cost: 1, effect: "With a Light Maneuver up, erases one status from you." },
  { name: "Mana Tank", element: "dark", cost: 1, effect: "Maximum MP +20%. Dark Maneuvers add Refresh: 1 + 0.2% MP, then 2 + 0.4%, then 3 + 0.6%, every 3 seconds." },
  { name: "Mana Tank II", element: "dark", cost: 2, effect: "Maximum MP +35%. Dark Maneuvers add that same Refresh again. Stacks with Mana Tank." },
  { name: "Economizer", element: "dark", cost: 2, effect: "Below 25% MP, spends one Dark Maneuver and restores 30% MP." },
  { name: "Mana Converter", element: "dark", cost: 2, effect: "Needs a Dark Maneuver. Below 40% / 60% / 65% MP it spends half its current HP and returns that much MP over ten ticks. It does not fire if half its HP is more than its maximum MP. Recast 3 minutes. One way: it cannot turn MP into HP." },
  { name: "Disruptor", element: "dark", cost: 1, effect: "With a Dark Maneuver up, it tries Dispel. This hare has nothing to dispel." },
  { name: "Mana Conserver", element: "dark", cost: 1, effect: "A spell costs no MP 15% / 25% / 35% / 50% of the time." },
];

const HEAD_BY_ID = new Map(AUTO_HEADS.map((row) => [row.id, row]));
const FRAME_BY_ID = new Map(AUTO_FRAMES.map((row) => [row.id, row]));
const ATTACH_BY_NAME = new Map(AUTO_ATTACHMENTS.map((row) => [row.name, row]));

export function autoHead(id: string): AutoHead | null {
  return HEAD_BY_ID.get(id as AutoHeadId) ?? null;
}

export function autoFrame(id: string): AutoFrame | null {
  return FRAME_BY_ID.get(id as AutoFrameId) ?? null;
}

export function autoAttachment(name: string): AutoAttachment | null {
  return ATTACH_BY_NAME.get(name) ?? null;
}

export function emptyCapacity(): Record<AutoElement, number> {
  return { fire: 0, ice: 0, wind: 0, earth: 0, thunder: 0, water: 0, light: 0, dark: 0 };
}

/** Head plus frame. A missing piece contributes nothing. */
export function elementalCapacity(headId: string, frameId: string): Record<AutoElement, number> {
  const head = autoHead(headId);
  const frame = autoFrame(frameId);
  const out = emptyCapacity();
  for (const element of AUTO_ELEMENTS) out[element] = (head?.cap[element] ?? 0) + (frame?.cap[element] ?? 0);
  return out;
}

export function usedCapacity(names: readonly string[]): Record<AutoElement, number> {
  const used = emptyCapacity();
  for (const name of names) {
    const row = ATTACH_BY_NAME.get(name);
    if (row) used[row.element] += row.cost;
  }
  return used;
}

export function canAddAttachment(frameId: string, headId: string, names: readonly string[], name: string): { ok: true } | { ok: false; reason: string } {
  const frame = autoFrame(frameId);
  const row = ATTACH_BY_NAME.get(name);
  if (!frame || !row) return { ok: false, reason: "That attachment is not in the bag." };
  if (names.includes(name)) return { ok: false, reason: `${name} is already attached.` };
  if (names.length >= AUTO_SLOTS) return { ok: false, reason: `The frame has ${AUTO_SLOTS} attachment slots.` };
  const room = elementalCapacity(headId, frameId)[row.element];
  const used = usedCapacity(names)[row.element];
  if (used + row.cost > room) {
    return { ok: false, reason: `${AUTO_ELEMENT_LABEL[row.element]} is ${used}/${room}. ${name} costs ${row.cost}.` };
  }
  return { ok: true };
}

/** Keep earlier attachments when a new head or frame is smaller. */
export function attachmentsThatFit(frameId: string, headId: string, names: readonly string[]): string[] {
  const frame = autoFrame(frameId);
  if (!frame) return [];
  const kept: string[] = [];
  for (const name of names) {
    if (canAddAttachment(frame.id, headId, kept, name).ok) kept.push(name);
  }
  return kept;
}

export type AutoManeuvers = Record<AutoElement, number>;

/** A weapon skill spends the whole bar once it reaches this. Retail is 1000. */
export const AUTO_WS_TP = 1000;
/** Inhibitor holds the weapon skill while the master is at or above this and nothing is open. */
export const INHIBITOR_HOLD_TP = 900;

/**
 * Retail automaton weapon skills.
 * Properties are primary, then secondary. The closer tries them in that order.
 * Priority is the tie break when two elements have the same number of maneuvers,
 * and when Inhibitor can make more than one chain of the same level.
 * String Shredder and Armor Shatterer need 324 skill. Level 75 never reaches it.
 */
export type AutoWeaponSkill = {
  name: string;
  frames: readonly AutoFrameId[];
  element: AutoElement;
  priority: number;
  skill: number;
  props: readonly string[];
  /** Used when no maneuver is asking for something else. */
  base: boolean;
  /** Cannibal Blade cannot miss. */
  sure?: boolean;
};

const MELEE_FRAMES: readonly AutoFrameId[] = ["harlequin", "stormwaker"];

export const AUTO_WEAPON_SKILLS: readonly AutoWeaponSkill[] = [
  { name: "Chimera Ripper", frames: ["valoredge"], element: "fire", priority: 1, skill: 0, props: ["Detonation", "Induration"], base: true },
  { name: "String Clipper", frames: ["valoredge"], element: "thunder", priority: 2, skill: 0, props: ["Scission"], base: false },
  { name: "Cannibal Blade", frames: ["valoredge"], element: "dark", priority: 3, skill: 145, props: ["Compression", "Reverberation"], base: false, sure: true },
  { name: "Bone Crusher", frames: ["valoredge"], element: "light", priority: 4, skill: 245, props: ["Fragmentation"], base: false },
  { name: "String Shredder", frames: ["valoredge"], element: "thunder", priority: 5, skill: 324, props: ["Distortion", "Scission"], base: false },
  { name: "Arcuballista", frames: ["sharpshot"], element: "fire", priority: 1, skill: 0, props: ["Liquefaction", "Transfixion"], base: true },
  { name: "Daze", frames: ["sharpshot"], element: "thunder", priority: 2, skill: 150, props: ["Impaction", "Transfixion"], base: false },
  { name: "Armor Piercer", frames: ["sharpshot"], element: "dark", priority: 3, skill: 245, props: ["Gravitation"], base: false },
  { name: "Armor Shatterer", frames: ["sharpshot"], element: "wind", priority: 4, skill: 324, props: ["Fusion", "Impaction"], base: false },
  { name: "Slapstick", frames: MELEE_FRAMES, element: "thunder", priority: 1, skill: 0, props: ["Reverberation", "Impaction"], base: true },
  { name: "Knockout", frames: MELEE_FRAMES, element: "wind", priority: 2, skill: 145, props: ["Scission", "Detonation"], base: false },
  { name: "Magic Mortar", frames: MELEE_FRAMES, element: "light", priority: 3, skill: 225, props: ["Liquefaction", "Fusion"], base: false },
];

/**
 * FFXIclopedia head modifiers. One step is the next rank bracket.
 * This kit's A is the old A− (269 at 75). A+ is 276.
 * Stormwaker's printed magic modifier is +1, so the matched frame is A−.
 * Soulsoother and Spiritreaver are +2 magic, A+ on a Stormwaker frame.
 */
const RANK_LADDER: readonly SkillRank[] = ["F", "E", "D", "C-", "C", "C+", "B-", "B", "B+", "A", "A+"];
const FRAME_MELEE: Record<AutoFrameId, SkillRank> = { harlequin: "B-", valoredge: "B+", sharpshot: "C+", stormwaker: "C" };
const FRAME_RANGED: Partial<Record<AutoFrameId, SkillRank>> = { harlequin: "B-", sharpshot: "B+" };
const FRAME_MAGIC: Partial<Record<AutoFrameId, SkillRank>> = { harlequin: "B-", stormwaker: "B+" };
const HEAD_MOD: Record<AutoHeadId, { melee: number; ranged: number; magic: number }> = {
  harlequin: { melee: 0, ranged: 0, magic: 0 },
  valoredge: { melee: 1, ranged: 0, magic: 0 },
  sharpshot: { melee: 0, ranged: 1, magic: 0 },
  stormwaker: { melee: 1, ranged: 0, magic: 1 },
  soulsoother: { melee: 0, ranged: 0, magic: 2 },
  spiritreaver: { melee: 0, ranged: 0, magic: 2 },
};

function raiseRank(rank: SkillRank, steps: number): SkillRank {
  const at = RANK_LADDER.indexOf(rank);
  return RANK_LADDER[Math.max(0, Math.min(RANK_LADDER.length - 1, at + steps))];
}

/** Melee, ranged, or magic skill at level 75. A frame with no rank in that skill is 0. */
export function automatonSkill(frame: AutoFrameId, head: AutoHeadId, kind: "melee" | "ranged" | "magic"): number {
  const base = kind === "melee" ? FRAME_MELEE[frame] : kind === "ranged" ? FRAME_RANGED[frame] : FRAME_MAGIC[frame];
  if (!base) return 0;
  return skillCap(raiseRank(base, HEAD_MOD[head][kind]), 75);
}

/**
 * The skill the weapon skill checks. Sharpshot reads ranged skill.
 * The others read melee. Level 75 caps at 276, so 324 stays locked.
 */
export function automatonCombatSkill(frame: AutoFrameId, head: AutoHeadId): number {
  return automatonSkill(frame, head, frame === "sharpshot" ? "ranged" : "melee");
}

export function knownAutomatonWs(frame: AutoFrameId, skill: number): AutoWeaponSkill[] {
  return AUTO_WEAPON_SKILLS.filter((ws) => ws.frames.includes(frame) && skill >= ws.skill);
}

/**
 * The element with the most maneuvers wins. A tie goes to the higher priority.
 * No maneuver uses the frame's base weapon skill.
 * Inhibitor closes an open chain even when you still have 900 TP or more,
 * because a weapon skill from 2000 leaves you over 900.
 * With nothing open and 900 or more, it waits.
 * Below 900 it ignores maneuvers and opens the chain your weapon skills can close.
 */
export function chooseAutomatonWs(args: {
  frame: AutoFrameId;
  head: AutoHeadId;
  maneuvers: AutoManeuvers;
  opening?: readonly string[];
  inhibitor?: boolean;
  masterTp?: number;
  skill?: number;
  /** Properties of weapon skills the master can use right now. Primary first. */
  masterClosers?: readonly (readonly string[])[];
}): { ws: AutoWeaponSkill; hold: boolean } {
  const skill = args.skill ?? automatonCombatSkill(args.frame, args.head);
  const known = knownAutomatonWs(args.frame, skill);
  const base = known.find((ws) => ws.base) ?? known[0];
  if (!base) throw new Error(`no automaton weapon skill for ${args.frame}`);
  const opening = args.opening ?? [];
  if (args.inhibitor && opening.length) {
    let best: AutoWeaponSkill | null = null;
    let bestLevel = 0;
    for (const ws of known) {
      const level = chainRank(opening, ws.props);
      if (level > bestLevel || (level > 0 && level === bestLevel && best != null && ws.priority > best.priority)) {
        best = ws;
        bestLevel = level;
      }
    }
    if (best && bestLevel > 0) return { ws: best, hold: false };
  }
  if (args.inhibitor && (args.masterTp ?? 0) >= INHIBITOR_HOLD_TP) return { ws: base, hold: true };
  const closers = args.masterClosers ?? [];
  if (args.inhibitor && closers.length) {
    let best: AutoWeaponSkill | null = null;
    let bestLevel = 0;
    for (const ws of known) {
      let level = 0;
      for (const closer of closers) level = Math.max(level, chainRank(ws.props, closer));
      if (level > bestLevel || (level > 0 && level === bestLevel && best != null && ws.priority > best.priority)) {
        best = ws;
        bestLevel = level;
      }
    }
    if (best && bestLevel > 0) return { ws: best, hold: false };
  }
  const asked = known.filter((ws) => (args.maneuvers[ws.element] ?? 0) > 0);
  if (!asked.length) return { ws: base, hold: false };
  const max = Math.max(...asked.map((ws) => args.maneuvers[ws.element]));
  const pool = asked.filter((ws) => args.maneuvers[ws.element] === max);
  pool.sort((a, b) => b.priority - a.priority);
  return { ws: pool[0], hold: false };
}

/** Level 75 is +6. floor(level / 15) + 1. Dark has no attribute. */
export function maneuverStatBonus(level = 75): number {
  return Math.floor(level / 15) + 1;
}

export const MANEUVER_STAT: Record<AutoElement, string> = {
  fire: "Strength",
  ice: "Intelligence",
  wind: "Agility",
  earth: "Vitality",
  thunder: "Dexterity",
  water: "Mind",
  light: "Charisma",
  dark: "",
};

/** The attribute a maneuver compares when it adds burden. Dark has none. */
export function frameAttr(frame: AutoFrame, element: AutoElement): number | null {
  if (element === "fire") return frame.str;
  if (element === "ice") return frame.int;
  if (element === "wind") return frame.agi;
  if (element === "earth") return frame.vit;
  if (element === "thunder") return frame.dex;
  if (element === "water") return frame.mnd;
  if (element === "light") return frame.chr;
  return null;
}

/** 15 if the master matches or beats the automaton. 20 if the master is behind. Dark is always 15. Flame Holder adds 10. */
export function maneuverBurden(master: number, pet: number | null, flameHolder: boolean): number {
  const base = pet == null || master >= pet ? 15 : 20;
  return base + (flameHolder ? 10 : 0);
}

/** Overload starts above 30 degrees. 76 burden is the wiki's 51% example. */
export const OVERLOAD_AT = 30;

export function overloadChance(burden: number): number {
  if (burden <= OVERLOAD_AT) return 0;
  return Math.min(0.95, (burden - OVERLOAD_AT + 5) / 100);
}

/** Degrees of burden removed every 3 seconds. */
export function burdenDecay(heatsink: boolean, water: number): number {
  if (!heatsink) return 1;
  return 2 + Math.max(0, water);
}

export function replicatorShadows(wind: number): number {
  if (wind <= 0) return 0;
  return wind >= 3 ? 10 : wind === 2 ? 7 : 3;
}

export type AutoPlan =
  | { kind: "melee" }
  | { kind: "nuke"; element: AutoElement; spell: string; tier: number }
  | { kind: "cure"; element: "light"; spell: string; tier: number }
  | { kind: "drain"; element: "dark"; spell: string; tier: number }
  | { kind: "enfeeble"; element: AutoElement; spell: string; tier: number };

function maneuverTier(count: number): number {
  return count >= 3 ? 3 : count === 2 ? 2 : 1;
}

/** Overdrive doubles the count used for an attachment table, and the table stops at 3. */
export function maneuverRank(count: number, overdrive: boolean): number {
  const n = overdrive ? count * 2 : count;
  if (n >= 3) return 3;
  if (n <= 0) return 0;
  return n;
}

function step4(table: readonly [number, number, number, number], rank: number): number {
  return table[rank <= 0 ? 0 : rank >= 3 ? 3 : rank];
}

/** Optic Fiber. 10% always. The higher of Light and this element raises it. */
function opticOf(names: readonly string[], maneuvers: AutoManeuvers, element: AutoElement, overdrive: boolean): number {
  if (!names.includes("Optic Fiber")) return 1;
  const tier = Math.max(maneuverRank(maneuvers.light, overdrive), maneuverRank(maneuvers[element], overdrive));
  return 1 + (tier <= 0 ? 0.1 : tier === 1 ? 0.2 : tier === 2 ? 0.25 : 0.3);
}

/** Ice wins a tie. Stormwaker treats that as “cast the nuke.” */
function bestManeuver(counts: AutoManeuvers, elements: readonly AutoElement[], iceBias: boolean): { element: AutoElement; count: number } | null {
  let best: AutoElement | null = null;
  let score = 0;
  for (const element of elements) {
    const count = counts[element];
    if (count <= 0) continue;
    const next = count + (iceBias && element === "ice" ? 0.25 : 0);
    if (next > score) {
      score = next;
      best = element;
    }
  }
  return best ? { element: best, count: counts[best] } : null;
}

type SpellRow = { name: string; skill: number; tier: number; element: AutoElement };

const NUKE_ROWS: Record<string, readonly SpellRow[]> = {
  fire: [
    { name: "Fire", skill: 60, tier: 1, element: "fire" },
    { name: "Fire II", skill: 153, tier: 2, element: "fire" },
    { name: "Fire III", skill: 251, tier: 3, element: "fire" },
  ],
  ice: [
    { name: "Blizzard", skill: 75, tier: 1, element: "ice" },
    { name: "Blizzard II", skill: 178, tier: 2, element: "ice" },
    { name: "Blizzard III", skill: 256, tier: 3, element: "ice" },
  ],
  wind: [
    { name: "Aero", skill: 45, tier: 1, element: "wind" },
    { name: "Aero II", skill: 138, tier: 2, element: "wind" },
    { name: "Aero III", skill: 246, tier: 3, element: "wind" },
  ],
  earth: [
    { name: "Stone", skill: 15, tier: 1, element: "earth" },
    { name: "Stone II", skill: 108, tier: 2, element: "earth" },
    { name: "Stone III", skill: 227, tier: 3, element: "earth" },
  ],
  thunder: [
    { name: "Thunder", skill: 90, tier: 1, element: "thunder" },
    { name: "Thunder II", skill: 203, tier: 2, element: "thunder" },
    { name: "Thunder III", skill: 261, tier: 3, element: "thunder" },
  ],
  water: [
    { name: "Water", skill: 30, tier: 1, element: "water" },
    { name: "Water II", skill: 123, tier: 2, element: "water" },
    { name: "Water III", skill: 236, tier: 3, element: "water" },
    { name: "Water IV", skill: 271, tier: 4, element: "water" },
  ],
};

const CURE_ROWS: readonly (SpellRow & { heads: readonly AutoHeadId[] })[] = [
  { name: "Cure", skill: 12, tier: 1, element: "light", heads: ["harlequin", "sharpshot", "valoredge", "stormwaker", "soulsoother"] },
  { name: "Cure II", skill: 45, tier: 2, element: "light", heads: ["harlequin", "sharpshot", "valoredge", "stormwaker", "soulsoother"] },
  { name: "Cure III", skill: 81, tier: 3, element: "light", heads: ["harlequin", "sharpshot", "valoredge", "stormwaker", "soulsoother"] },
  { name: "Cure IV", skill: 147, tier: 4, element: "light", heads: ["harlequin", "sharpshot", "valoredge", "stormwaker", "soulsoother"] },
  { name: "Cure V", skill: 207, tier: 5, element: "light", heads: ["soulsoother"] },
];

const ENFEEBLE_ROWS: Partial<Record<AutoElement, readonly SpellRow[]>> = {
  earth: [{ name: "Slow", skill: 42, tier: 1, element: "earth" }],
  water: [
    { name: "Poison", skill: 18, tier: 1, element: "water" },
    { name: "Poison II", skill: 141, tier: 2, element: "water" },
  ],
  wind: [{ name: "Silence", skill: 57, tier: 1, element: "wind" }],
  ice: [{ name: "Paralyze", skill: 21, tier: 1, element: "ice" }],
  light: [
    { name: "Dia", skill: 1, tier: 1, element: "light" },
    { name: "Dia II", skill: 96, tier: 2, element: "light" },
  ],
  dark: [
    { name: "Blind", skill: 27, tier: 1, element: "dark" },
    { name: "Bio", skill: 33, tier: 1, element: "dark" },
    { name: "Bio II", skill: 107, tier: 2, element: "dark" },
  ],
};

const NUKE_HEADS: readonly AutoHeadId[] = ["stormwaker", "spiritreaver"];
const ENFEEBLE_HEADS: readonly AutoHeadId[] = ["harlequin", "sharpshot", "stormwaker", "soulsoother", "spiritreaver"];

function knownRow<T extends { skill: number; tier: number }>(rows: readonly T[], skill: number, tierCap: number): T | null {
  let best: T | null = null;
  for (const row of rows) {
    if (row.skill > skill || row.tier > tierCap) continue;
    if (!best || row.tier > best.tier || (row.tier === best.tier && row.skill > best.skill)) best = row;
  }
  return best;
}

function nukePlan(element: AutoElement, count: number, skill: number): AutoPlan | null {
  const rows = NUKE_ROWS[element];
  if (!rows) return null;
  const row = knownRow(rows, skill, count >= 3 ? 4 : maneuverTier(count));
  if (!row) return null;
  return { kind: "nuke", element: row.element, spell: row.name, tier: row.tier };
}

/** One Light Maneuver stays at Cure II. Three uses the strongest cure that head knows. */
function cureTierCap(light: number): number {
  if (light >= 3) return 5;
  if (light === 2) return 2;
  return 1;
}

function curePlan(head: AutoHeadId, skill: number, light: number): AutoPlan | null {
  const row = knownRow(CURE_ROWS.filter((spell) => spell.heads.includes(head)), skill, cureTierCap(Math.max(0, light)));
  if (!row) return null;
  return { kind: "cure", element: "light", spell: row.name, tier: row.tier };
}

function enfeeblePlan(element: AutoElement, count: number, head: AutoHeadId, skill: number): AutoPlan | null {
  if (!ENFEEBLE_HEADS.includes(head)) return null;
  const rows = ENFEEBLE_ROWS[element];
  if (!rows) return null;
  let pool = rows;
  if (element === "dark" && head === "sharpshot" && count < 2) pool = rows.filter((row) => row.name === "Blind");
  else if (element === "dark") pool = rows.filter((row) => row.name !== "Blind");
  const row = knownRow(pool, skill, maneuverTier(count));
  if (!row) return null;
  return { kind: "enfeeble", element: row.element, spell: row.name, tier: row.tier };
}

/** The cure the head can cast at this many Light Maneuvers. Null when the frame cannot cast. */
export function automatonCureSpell(frame: AutoFrameId, head: AutoHeadId, light: number): { spell: string; tier: number } | null {
  if (!headCastsOn(frame, head)) return null;
  const plan = curePlan(head, automatonSkill(frame, head, "magic"), light);
  if (!plan || plan.kind !== "cure") return null;
  return { spell: plan.spell, tier: plan.tier };
}

/**
 * Valoredge and Sharpshot frames never cast.
 * The head still matters for which spells a magic frame knows.
 */
export function headCastsOn(frame: AutoFrameId, _head: AutoHeadId): boolean {
  return frame === "stormwaker" || frame === "harlequin";
}

/**
 * What the automaton does with the maneuvers that are up.
 * Soulsoother healing while someone is hurt is the cure timer, so this returns melee then.
 */
export function automatonPlan(args: {
  frame: AutoFrameId;
  head: AutoHeadId;
  maneuvers: AutoManeuvers;
  masterRatio: number;
  selfRatio: number;
  attachments?: readonly string[];
}): AutoPlan {
  const frame = args.frame;
  const head = args.head;
  const m = args.maneuvers;
  if (!headCastsOn(frame, head)) return { kind: "melee" };
  const skill = automatonSkill(frame, head, "magic");
  const gauge = (args.attachments ?? []).includes("Damage Gauge");
  const hurtMaster = args.masterRatio < (gauge ? 0.85 : 0.7);
  const hurtSelf = args.selfRatio < (gauge ? 0.75 : 0.6);

  if (head === "valoredge") {
    if (m.light > 0 && (hurtMaster || hurtSelf)) return curePlan(head, skill, m.light) ?? { kind: "melee" };
    return { kind: "melee" };
  }
  if (head === "sharpshot") {
    if (m.light > 0 && (hurtMaster || args.masterRatio < (gauge ? 0.95 : 0.85))) return curePlan(head, skill, m.light) ?? { kind: "melee" };
    const enf = bestManeuver(m, ["fire", "earth", "water", "wind", "ice", "dark"], false);
    if (enf) return enfeeblePlan(enf.element, enf.count, head, skill) ?? { kind: "melee" };
    if (m.light > 0) return enfeeblePlan("light", m.light, head, skill) ?? { kind: "melee" };
    return { kind: "melee" };
  }
  if (head === "soulsoother") {
    if (args.masterRatio < 0.9 || args.selfRatio < 0.55) return { kind: "melee" };
    const enf = bestManeuver(m, ["fire", "earth", "water", "wind", "ice", "dark"], false);
    if (enf) return enfeeblePlan(enf.element, enf.count, head, skill) ?? { kind: "melee" };
    return { kind: "melee" };
  }
  if (head === "spiritreaver") {
    const nuke = bestManeuver(m, ["fire", "ice", "wind", "earth", "thunder", "water"], true);
    if (m.dark > 0 && m.ice === 0 && args.selfRatio < 0.75 && skill >= 45) return { kind: "drain", element: "dark", spell: "Drain", tier: maneuverTier(m.dark) };
    if (nuke) return nukePlan(nuke.element, nuke.count, skill) ?? { kind: "melee" };
    if (m.dark > 0) return enfeeblePlan("dark", m.dark, head, skill) ?? { kind: "melee" };
    if (m.light > 0) return enfeeblePlan("light", m.light, head, skill) ?? { kind: "melee" };
    return { kind: "melee" };
  }
  if (head === "stormwaker") {
    const nuke = bestManeuver(m, ["fire", "ice", "wind", "earth", "thunder", "water"], true);
    const nuked = nuke ? nukePlan(nuke.element, nuke.count, skill) : null;
    if (m.light > 0 && (hurtMaster || hurtSelf) && (!nuke || m.light >= nuke.count)) return curePlan(head, skill, m.light) ?? nuked ?? { kind: "melee" };
    if (nuked) return nuked;
    if (m.dark > 0) return enfeeblePlan("dark", m.dark, head, skill) ?? { kind: "melee" };
    if (m.light > 0) return enfeeblePlan("light", m.light, head, skill) ?? { kind: "melee" };
    return { kind: "melee" };
  }
  if (m.light > 0 && (hurtMaster || hurtSelf)) return curePlan(head, skill, m.light) ?? { kind: "melee" };
  const enf = bestManeuver(m, ["fire", "earth", "water", "wind", "ice", "dark", "light"], false);
  if (enf) return enfeeblePlan(enf.element, enf.count, head, skill) ?? { kind: "melee" };
  return { kind: "melee" };
}

export function automatonHpMax(frame: AutoFrame, attachments: readonly string[]): number {
  return Math.floor(frame.hp * (attachments.includes("Auto-Repair Kit II") ? 1.1 : 1));
}

export function automatonMpMax(frame: AutoFrame, attachments: readonly string[]): number {
  if (frame.mp <= 0) return 0;
  let mod = 1;
  if (attachments.includes("Mana Tank")) mod += 0.2;
  if (attachments.includes("Mana Tank II")) mod += 0.35;
  return Math.floor(frame.mp * mod);
}

/** MP the spell spends before Power Cooler. A frame with no MP cannot cast it. */
export function automatonSpellMp(kind: AutoPlan["kind"], tier: number): number {
  const nuke = [16, 40, 79, 135];
  const cure = [8, 24, 46, 88, 135];
  const step = Math.max(1, tier);
  if (kind === "nuke") return nuke[Math.min(nuke.length, step) - 1];
  if (kind === "cure") return cure[Math.min(cure.length, step) - 1];
  if (kind === "drain") return 21;
  if (kind === "enfeeble") return 12 + 6 * Math.min(3, step);
  return 0;
}

/** Power Cooler is a straight cut. 0 leaves the cost alone. */
export function automatonPayMp(cost: number, cooler: number): number {
  if (cost <= 0 || cooler <= 0) return Math.max(0, cost);
  return Math.max(0, Math.floor(cost * (1 - Math.min(0.8, cooler))));
}

/** Stormwaker casts hardest. A Valoredge or Sharpshot frame can still cast, but the magic skill is poor. */
export function automatonSpellPower(args: {
  frame: AutoFrameId;
  head: AutoHeadId;
  attachments: readonly string[];
  maneuvers: AutoManeuvers;
  overdrive: boolean;
  tier: number;
  /** Ice Maker multiplies elemental magic only. */
  nuke?: boolean;
}): number {
  const over = args.overdrive ? 2 : 1;
  const frameBase = args.frame === "stormwaker" ? 36 : args.frame === "harlequin" ? 22 : 12;
  const headMod = args.head === "spiritreaver" ? 1.28 : args.head === "stormwaker" ? 1.12 : args.head === "soulsoother" ? 0.72 : args.head === "harlequin" ? 0.88 : 0.62;
  const tierMod = args.tier >= 4 ? 2.4 : args.tier >= 3 ? 1.95 : args.tier === 2 ? 1.45 : 1;
  let damage = frameBase * headMod * tierMod * (1 + 0.08 * args.maneuvers.ice * over);
  const iceRank = maneuverRank(args.maneuvers.ice, args.overdrive);
  const optic = opticOf(args.attachments, args.maneuvers, "ice", args.overdrive);
  let mab = 0;
  if (args.attachments.includes("Loudspeaker")) mab += step4([5, 10, 15, 20], iceRank);
  if (args.attachments.includes("Loudspeaker II")) mab += step4([10, 15, 20, 25], iceRank);
  mab *= optic;
  damage *= (100 + mab) / 100;
  if (args.nuke && args.attachments.includes("Ice Maker") && iceRank > 0) {
    damage *= step4([0, 1.5, 1.75, 2], iceRank);
  }
  return Math.max(1, Math.round(damage));
}

export function automatonCureAmount(args: { frame: AutoFrameId; head: AutoHeadId; tier: number; overdrive: boolean; water?: number }): number {
  const frameMod = args.frame === "stormwaker" ? 1 : args.frame === "harlequin" ? 0.8 : 0.55;
  const headMod = args.head === "soulsoother" ? 1.15 : args.head === "stormwaker" ? 1 : args.head === "harlequin" ? 0.85 : 0.7;
  const base = 22 + 16 * Math.max(1, Math.min(5, args.tier));
  const over = args.overdrive ? 2 : 1;
  const mind = 1 + 0.04 * (args.water ?? 0) * over;
  return Math.max(1, Math.round(base * frameMod * headMod * (args.overdrive ? 1.5 : 1) * mind));
}

/**
 * Dark is MP recovery, so the next cast comes sooner.
 * The second argument may be the dark count, as the older calls passed it.
 */
export function automatonCastDelay(head: AutoHeadId, darkOrManeuvers: number | AutoManeuvers, overdrive: boolean, attachments: readonly string[] = []): number {
  const maneuvers = typeof darkOrManeuvers === "number" ? { ...emptyCapacity(), dark: darkOrManeuvers } : darkOrManeuvers;
  const over = overdrive ? 2 : 1;
  const base = head === "spiritreaver" ? 7 : head === "stormwaker" ? 8.5 : head === "soulsoother" ? 12 : head === "harlequin" ? 10 : 14;
  let delay = Math.max(5, Math.round((base - 0.6 * maneuvers.dark * over) * 10) / 10);
  if (attachments.includes("Mana Booster")) {
    const cut = step4([0.2, 0.3, 0.45, 0.6], maneuverRank(maneuvers.ice, overdrive)) * opticOf(attachments, maneuvers, "ice", overdrive);
    delay = Math.max(3, Math.round(delay * (1 - Math.min(0.75, cut)) * 10) / 10);
  }
  return delay;
}

export function cureFrameMod(frame: AutoFrameId): number {
  return frame === "stormwaker" ? 1 : frame === "harlequin" ? 0.85 : 0.65;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function autoAttackProfile(args: {
  frame: AutoFrameId;
  head: AutoHeadId;
  attachments: readonly string[];
  maneuvers: AutoManeuvers;
  overdrive: boolean;
  /** Seconds spent on this foe. Pattern Reader and Heat Seeker climb with it. */
  fightSec?: number;
  /** True only when the foe is a higher level than the master. */
  stronger?: boolean;
}): {
  damage: number;
  accuracy: number;
  delay: number;
  reach: number;
  regen: number;
  cure: number;
  cureAt: number;
  taken: number;
  magicTaken: number;
  hate: number;
  evasion: number;
  block: number;
  wsChance: number;
  wsName: string;
  wsMult: number;
  crit: number;
  da: number;
  volt: number;
  stp: number;
  spikes: number;
  barrage: number;
  refresh: number;
  macc: number;
  conserve: number;
  skinHp: number;
  counter: number;
  cooler: number;
  heatTp: number;
} {
  const over = args.overdrive ? 2 : 1;
  const names = args.attachments;
  const has = (name: string) => names.includes(name);
  const m = args.maneuvers;
  const fire = m.fire;
  const ice = m.ice;
  const wind = m.wind;
  const earth = m.earth;
  const thunder = m.thunder;
  const water = m.water;
  const light = m.light;
  const dark = m.dark;
  const fireRank = maneuverRank(fire, args.overdrive);
  const iceRank = maneuverRank(ice, args.overdrive);
  const windRank = maneuverRank(wind, args.overdrive);
  const earthRank = maneuverRank(earth, args.overdrive);
  const thunderRank = maneuverRank(thunder, args.overdrive);
  const waterRank = maneuverRank(water, args.overdrive);
  const lightRank = maneuverRank(light, args.overdrive);
  const darkRank = maneuverRank(dark, args.overdrive);
  const opticFire = opticOf(names, m, "fire", args.overdrive);
  const opticIce = opticOf(names, m, "ice", args.overdrive);
  const opticWind = opticOf(names, m, "wind", args.overdrive);
  const opticEarth = opticOf(names, m, "earth", args.overdrive);
  const opticThunder = opticOf(names, m, "thunder", args.overdrive);
  const opticWater = opticOf(names, m, "water", args.overdrive);
  const opticLight = opticOf(names, m, "light", args.overdrive);
  const opticDark = opticOf(names, m, "dark", args.overdrive);
  const frameRow = autoFrame(args.frame);
  const maxHp = frameRow ? automatonHpMax(frameRow, names) : 788;
  const maxMp = frameRow ? automatonMpMax(frameRow, names) : 0;
  const base = args.frame === "valoredge" ? 34 : args.frame === "sharpshot" ? 26 : args.frame === "harlequin" ? 22 : 18;
  const accuracy0 = args.frame === "sharpshot" ? 72 : args.frame === "valoredge" ? 70 : args.frame === "harlequin" ? 65 : 55;
  const delay0 = args.frame === "stormwaker" ? 4.4 : args.frame === "sharpshot" ? 3.3 : args.frame === "harlequin" ? 3.5 : 3.8;
  const reach = args.frame === "sharpshot" ? 6.2 : args.frame === "stormwaker" ? 4.2 : 1.75;
  let atkPct = 0;
  if (has("Tension Spring")) atkPct += step4([0.03, 0.06, 0.09, 0.12], fireRank);
  if (has("Tension Spring II")) atkPct += step4([0.06, 0.09, 0.12, 0.15], fireRank);
  atkPct *= opticFire;
  let damage = base * (1 + 0.02 * fire * over) * (1 + atkPct);
  if (args.stronger && has("Attuner")) damage *= 1 / (1 - Math.min(0.45, step4([0.05, 0.15, 0.3, 0.45], fireRank) * opticFire));
  const volt = has("Volt Gun") && thunderRank > 0 ? step4([0, 8, 14, 22], thunderRank) : 0;
  damage += volt;
  let accuracy = accuracy0 + 10 * thunder * over;
  if (has("Stabilizer")) accuracy += step4([5, 10, 15, 20], thunderRank) * opticThunder;
  if (has("Stabilizer II")) accuracy += step4([10, 15, 20, 25], thunderRank) * opticThunder;
  if (args.frame === "sharpshot" && has("Scope")) accuracy += step4([10, 20, 30, 40], windRank) * opticWind;
  if (args.frame === "sharpshot" && has("Drum Magazine")) accuracy -= step4([5, 10, 15, 20], windRank);
  if (args.stronger && has("Target Marker")) accuracy += step4([10, 20, 30, 40], thunderRank) * opticThunder;
  const fight = Math.max(0, args.fightSec ?? 0);
  if (has("Heat Seeker")) accuracy += Math.min(20, fight * (0.2 + 0.06 * thunderRank));
  let haste = 0;
  if (has("Turbo Charger")) haste += step4([0.05, 0.15, 0.2, 0.25], windRank) * opticWind;
  if (args.frame === "sharpshot" && has("Drum Magazine")) haste += step4([0.03, 0.06, 0.09, 0.15], windRank) * opticWind;
  haste = Math.min(0.4375, haste);
  const delay = round2(delay0 * (1 - haste));
  let evasion = 8 * wind * over;
  if (has("Accelerator")) evasion += step4([5, 10, 15, 20], windRank) * opticWind;
  if (has("Accelerator II")) evasion += step4([10, 15, 20, 25], windRank) * opticWind;
  if (has("Pattern Reader")) evasion += Math.min(24, fight * (0.25 + 0.08 * windRank));
  let pdt = 0;
  if (has("Armor Plate")) pdt += step4([0.05, 0.07, 0.1, 0.15], earthRank) * opticEarth;
  if (has("Armor Plate II")) pdt += step4([0.1, 0.15, 0.2, 0.25], earthRank) * opticEarth;
  pdt = Math.min(0.5, pdt);
  const vit = 1 - Math.min(0.24, 0.05 * earth * over);
  const taken = round2(vit * (1 - pdt));
  let mdb = 0;
  if (has("Mana Jammer")) mdb += step4([10, 20, 30, 40], waterRank) * opticWater;
  if (has("Mana Jammer II")) mdb += step4([20, 30, 40, 50], waterRank) * opticWater;
  const magicTaken = round2((1 - Math.min(0.3, 0.06 * water * over)) * (1 - Math.min(0.25, mdb / 400)));
  let hate = 20;
  if (has("Strobe")) hate += step4([10, 25, 40, 60], fireRank) * opticFire;
  if (has("Stealth Screen")) hate -= step4([10, 20, 30, 40], waterRank) * opticWater;
  hate = Math.max(0, Math.round(hate));
  const regen = lightRank <= 0 ? 0 : Math.round((
    (has("Auto-Repair Kit") ? step4([0, 1, 2, 3], lightRank) + step4([0, 0.00125, 0.00225, 0.00375], lightRank) * maxHp : 0) +
    (has("Auto-Repair Kit II") ? step4([0, 3, 6, 9], lightRank) + step4([0, 0.006, 0.012, 0.018], lightRank) * maxHp : 0)
  ) * opticLight);
  let refresh = 0;
  if (maxMp > 0 && darkRank > 0 && (has("Mana Tank") || has("Mana Tank II"))) {
    const per = step4([0, 1, 2, 3], darkRank) + step4([0, 0.002, 0.004, 0.006], darkRank) * maxMp;
    const stacks = (has("Mana Tank") ? 1 : 0) + (has("Mana Tank II") ? 1 : 0);
    refresh = Math.max(0, Math.round(per * stacks * opticDark));
  }
  const cure = args.head === "soulsoother" ? 40 + 20 * light * over : 0;
  const cureAt = args.head === "soulsoother" ? (has("Damage Gauge") ? 0.98 : 0.92) : 0.7;
  const wsChance = args.frame === "valoredge" || args.frame === "sharpshot" ? Math.min(0.85, 0.18 * fire * over) : 0;
  let wsMult = args.frame === "sharpshot" ? 1.55 : 1.65;
  if (has("Flame Holder")) wsMult *= 1 + step4([0.25, 1, 1.75, 2.5], fireRank);
  const stp = has("Inhibitor") ? step4([5, 15, 25, 40], fireRank) * opticFire : 0;
  const crit = Math.min(0.5, has("Dynamo") ? step4([0.03, 0.05, 0.07, 0.09], thunderRank) * opticThunder : 0);
  const da = Math.min(0.5, has("Coiler") ? step4([0.03, 0.1, 0.2, 0.3], thunderRank) * opticThunder : 0);
  const spikes = has("Reactive Shield") && fireRank > 0 ? step4([0, 8, 12, 18], fireRank) : 0;
  const barrage = args.frame === "sharpshot" && has("Barrage Turbine") && windRank > 0 ? step4([0, 2, 3, 4], windRank) : 0;
  const macc = has("Tranquilizer") ? step4([10, 30, 40, 50], iceRank) * opticIce : 0;
  const conserve = has("Mana Conserver") ? Math.min(0.8, step4([0.15, 0.25, 0.35, 0.5], darkRank) * opticDark) : 0;
  const skinHp = has("Shock Absorber") && earthRank > 0 ? step4([0, 240, 280, 350], earthRank) : 0;
  const counter = has("Galvanizer") ? Math.min(0.95, step4([0.1, 0.2, 0.35, 0.5], thunderRank) * opticThunder) : 0;
  const cooler = has("Power Cooler") ? Math.min(0.8, step4([0.1, 0.2, 0.35, 0.5], iceRank) * opticIce) : 0;
  const heatTp = has("Heat Capacitor") && fireRank > 0 ? Math.min(3000, Math.round(3000 * step4([0, 0.2, 0.5, 0.8], fireRank) * opticFire)) : 0;
  return {
    damage: Math.max(1, Math.round(damage)),
    accuracy: Math.round(accuracy),
    delay,
    reach,
    regen,
    cure,
    cureAt,
    taken,
    magicTaken,
    hate,
    evasion: Math.round(evasion),
    block: args.frame === "valoredge" ? Math.min(60, 32 + 8 * earth) : 0,
    wsChance: Math.round(wsChance * 100) / 100,
    wsName: chooseAutomatonWs({ frame: args.frame, head: args.head, maneuvers: m }).ws.name,
    wsMult: round2(wsMult),
    crit: round2(crit),
    da: round2(da),
    volt,
    stp: Math.round(stp),
    spikes,
    barrage,
    refresh,
    macc: Math.round(macc),
    conserve: round2(conserve),
    skinHp,
    counter: round2(counter),
    cooler: round2(cooler),
    heatTp,
  };
}

/** One line for the maneuver log, naming the attachments of that element that are on. */
export function attachmentNote(element: AutoElement, count: number, names: readonly string[], overdrive: boolean): string {
  const rank = maneuverRank(count, overdrive);
  const has = (name: string) => names.includes(name);
  const bits: string[] = [];
  if (element === "fire") {
    if (has("Tension Spring")) bits.push(`Tension Spring +${step4([3, 6, 9, 12], rank)}% attack`);
    if (has("Tension Spring II")) bits.push(`Tension Spring II +${step4([6, 9, 12, 15], rank)}% attack`);
    if (has("Strobe")) bits.push(`Strobe enmity +${step4([10, 25, 40, 60], rank)}`);
    if (has("Inhibitor")) bits.push(`Store TP +${step4([5, 15, 25, 40], rank)}`);
    if (has("Flame Holder")) bits.push(`weapon skills +${step4([25, 100, 175, 250], rank)}%`);
    if (has("Heat Capacitor") && rank > 0) bits.push(`Meditate ${step4([0, 20, 50, 80], rank)}% TP`);
    if (has("Reactive Shield") && rank > 0) bits.push("Blaze Spikes");
  } else if (element === "ice") {
    if (has("Loudspeaker")) bits.push(`magic attack +${step4([5, 10, 15, 20], rank)}`);
    if (has("Loudspeaker II")) bits.push(`magic attack +${step4([10, 15, 20, 25], rank)}`);
    if (has("Mana Booster")) bits.push(`casting −${step4([20, 30, 45, 60], rank)}%`);
    if (has("Tranquilizer")) bits.push(`magic accuracy +${step4([10, 30, 40, 50], rank)}`);
    if (has("Ice Maker")) bits.push(rank > 0 ? `elemental magic ×${step4([0, 1.5, 1.75, 2], rank)}` : "Ice Maker is idle");
    if (has("Power Cooler")) bits.push(`spell MP −${step4([10, 20, 35, 50], rank)}%`);
  } else if (element === "wind") {
    if (has("Accelerator")) bits.push(`evasion +${step4([5, 10, 15, 20], rank)}`);
    if (has("Accelerator II")) bits.push(`evasion +${step4([10, 15, 20, 25], rank)}`);
    if (has("Scope")) bits.push(`ranged accuracy +${step4([10, 20, 30, 40], rank)}`);
    if (has("Turbo Charger")) bits.push(`haste +${step4([5, 15, 20, 25], rank)}%`);
    if (has("Barrage Turbine") && rank > 0) bits.push(`Barrage +${step4([0, 2, 3, 4], rank)}`);
    if (has("Replicator") && rank > 0) bits.push(`${replicatorShadows(rank)} shadows at half HP`);
  } else if (element === "earth") {
    if (has("Armor Plate")) bits.push(`physical damage −${step4([5, 7, 10, 15], rank)}%`);
    if (has("Armor Plate II")) bits.push(`physical damage −${step4([10, 15, 20, 25], rank)}%`);
    if (has("Shock Absorber") && rank > 0) bits.push("Stoneskin");
    if (has("Schurzen") && rank > 0) bits.push("Schurzen can spend this maneuver");
    if (has("Hammermill")) bits.push("Shield Bash hits harder");
  } else if (element === "thunder") {
    if (has("Stabilizer")) bits.push(`accuracy +${step4([5, 10, 15, 20], rank)}`);
    if (has("Stabilizer II")) bits.push(`accuracy +${step4([10, 15, 20, 25], rank)}`);
    if (has("Coiler")) bits.push(`Double Attack ${step4([3, 10, 20, 30], rank)}%`);
    if (has("Galvanizer")) bits.push(`Counter ${step4([10, 20, 35, 50], rank)}%`);
    if (has("Dynamo")) bits.push(`critical +${step4([3, 5, 7, 9], rank)}%`);
    if (has("Volt Gun") && rank > 0) bits.push(`lightning +${step4([0, 8, 14, 22], rank)}`);
  } else if (element === "water") {
    if (has("Mana Jammer")) bits.push(`magic defense +${step4([10, 20, 30, 40], rank)}`);
    if (has("Mana Jammer II")) bits.push(`magic defense +${step4([20, 30, 40, 50], rank)}`);
    if (has("Stealth Screen")) bits.push(`enmity −${step4([10, 20, 30, 40], rank)}`);
    if (has("Condenser")) bits.push("Condenser can spend this maneuver to stop an Overload");
    if (has("Heatsink")) bits.push("burden falls faster");
  } else if (element === "light") {
    if (has("Auto-Repair Kit") || has("Auto-Repair Kit II")) bits.push(rank > 0 ? "Regen" : "Regen is waiting on a Light Maneuver");
    if (has("Flashbulb") && rank > 0) bits.push("Flash");
    if (has("Optic Fiber")) bits.push(`attachments +${step4([10, 20, 25, 30], rank)}%`);
    if (has("Damage Gauge")) bits.push("cures sooner");
  } else if (element === "dark") {
    if (has("Mana Tank") || has("Mana Tank II")) bits.push(rank > 0 ? "Refresh" : "Refresh is waiting on a Dark Maneuver");
    if (has("Mana Conserver")) bits.push(`Conserve MP ${step4([15, 25, 35, 50], rank)}%`);
    if (has("Economizer")) bits.push("Economizer can spend this maneuver for MP");
    if (has("Mana Converter")) bits.push(rank > 0 ? "Mana Converter can spend HP for MP" : "Mana Converter is waiting on a Dark Maneuver");
  }
  return bits.join(". ");
}

export function assertAutomaton(): void {
  const storm = autoFrame("stormwaker");
  const matched = elementalCapacity("stormwaker", "stormwaker");
  if (!storm || matched.fire !== 2 || matched.ice !== 7 || matched.wind !== 4 || matched.earth !== 5 || matched.thunder !== 3 || matched.water !== 6 || matched.light !== 3 || matched.dark !== 6) {
    throw new Error("Stormwaker capacity");
  }
  const plain = elementalCapacity("harlequin", "harlequin");
  if (plain.fire !== 5 || plain.wind !== 5 || plain.thunder !== 5 || plain.light !== 3 || plain.ice !== 5 || plain.earth !== 5 || plain.water !== 5 || plain.dark !== 3) {
    throw new Error("Harlequin capacity");
  }
  const edgeCap = elementalCapacity("valoredge", "valoredge");
  if (edgeCap.fire !== 7 || edgeCap.earth !== 7 || edgeCap.ice !== 2 || edgeCap.dark !== 2) throw new Error("Valoredge capacity");
  const reaver = elementalCapacity("spiritreaver", "stormwaker");
  if (reaver.dark !== 7 || reaver.ice !== 7 || reaver.light !== 3) throw new Error("Spiritreaver capacity");
  if (storm.hp !== 788 || storm.mp !== 901 || storm.str !== 68 || storm.int !== 71) throw new Error("stormwaker sheet");
  const edgeFrame = autoFrame("valoredge");
  const shot = autoFrame("sharpshot");
  const harle = autoFrame("harlequin");
  if (!edgeFrame || edgeFrame.hp !== 1487 || edgeFrame.mp !== 0 || edgeFrame.str !== 77) throw new Error("valoredge sheet");
  if (!shot || shot.hp !== 938 || shot.mp !== 0 || shot.agi !== 78) throw new Error("sharpshot sheet");
  if (!harle || harle.hp !== 1228 || harle.mp !== 261) throw new Error("harlequin sheet");
  if (AUTO_HEADS.length !== 6 || AUTO_FRAMES.length !== 4) throw new Error("head and frame count");
  if (autoFrame("soulsoother") || autoFrame("spiritreaver") || !autoHead("soulsoother") || !autoHead("spiritreaver")) throw new Error("heads are not frames");
  const fireSet = ["Strobe", "Tension Spring", "Inhibitor", "Tension Spring II", "Attuner", "Reactive Shield", "Flame Holder"];
  if (usedCapacity(fireSet).fire !== 10) throw new Error("fire set is not 10");
  if (canAddAttachment("stormwaker", "stormwaker", fireSet.slice(0, 2), "Flame Holder").ok) throw new Error("Flame Holder does not fit Stormwaker fire");
  const dozen = ["Tension Spring", "Strobe", "Loudspeaker", "Scanner", "Tranquilizer", "Accelerator", "Scope", "Armor Plate", "Analyzer", "Stabilizer", "Dynamo", "Heatsink"];
  if (attachmentsThatFit("stormwaker", "stormwaker", dozen).length !== 12) throw new Error("twelve attachments");
  if (canAddAttachment("stormwaker", "stormwaker", dozen, "Stealth Screen").ok) throw new Error("slot cap");
  const windNames = AUTO_ATTACHMENTS.filter((row) => row.element === "wind").map((row) => row.name);
  const windKept = attachmentsThatFit("stormwaker", "stormwaker", windNames);
  const windLeft = windNames.find((name) => !windKept.includes(name)) ?? "";
  if (usedCapacity(windKept).wind > 4 || canAddAttachment("stormwaker", "stormwaker", windKept, windLeft).ok) throw new Error("wind cap");
  const bare = autoAttackProfile({
    frame: "stormwaker",
    head: "stormwaker",
    attachments: [],
    maneuvers: emptyCapacity(),
    overdrive: false,
  });
  if (bare.damage !== 18 || bare.delay !== 4.4 || bare.reach !== 4.2 || bare.cure !== 0) throw new Error("bare stormwaker");
  const sprung = autoAttackProfile({
    frame: "stormwaker",
    head: "stormwaker",
    attachments: ["Tension Spring"],
    maneuvers: { ...emptyCapacity(), fire: 1 },
    overdrive: false,
  });
  if (sprung.damage !== 19) throw new Error(`tension spring ${sprung.damage}`);
  const both = autoAttackProfile({
    frame: "stormwaker",
    head: "stormwaker",
    attachments: ["Tension Spring", "Tension Spring II"],
    maneuvers: emptyCapacity(),
    overdrive: false,
  });
  if (both.damage !== 20) throw new Error(`both springs ${both.damage}`);
  const haste = autoAttackProfile({
    frame: "stormwaker",
    head: "stormwaker",
    attachments: ["Turbo Charger"],
    maneuvers: { ...emptyCapacity(), wind: 3 },
    overdrive: false,
  });
  if (haste.delay !== 3.3) throw new Error(`turbo ${haste.delay}`);
  const idleHaste = autoAttackProfile({
    frame: "stormwaker",
    head: "stormwaker",
    attachments: ["Turbo Charger"],
    maneuvers: emptyCapacity(),
    overdrive: false,
  });
  if (idleHaste.delay !== 4.18) throw new Error(`turbo idle ${idleHaste.delay}`);
  const nurse = autoAttackProfile({
    frame: "stormwaker",
    head: "soulsoother",
    attachments: ["Auto-Repair Kit"],
    maneuvers: { ...emptyCapacity(), light: 1 },
    overdrive: false,
  });
  if (nurse.cure !== 60 || nurse.regen !== 2 || nurse.cureAt !== 0.92) throw new Error(`soulsoother kit ${nurse.cure}/${nurse.regen}`);
  const darkKit = autoAttackProfile({
    frame: "stormwaker",
    head: "soulsoother",
    attachments: ["Auto-Repair Kit"],
    maneuvers: emptyCapacity(),
    overdrive: false,
  });
  if (darkKit.regen !== 0) throw new Error("regen needs a light maneuver");
  const plated = autoAttackProfile({
    frame: "stormwaker",
    head: "stormwaker",
    attachments: ["Armor Plate"],
    maneuvers: emptyCapacity(),
    overdrive: false,
  });
  if (plated.taken !== 0.95) throw new Error(`armor plate ${plated.taken}`);
  const none = emptyCapacity();
  const iceNuke = automatonPlan({ frame: "stormwaker", head: "stormwaker", maneuvers: { ...none, ice: 2 }, masterRatio: 1, selfRatio: 1 });
  if (iceNuke.kind !== "nuke" || iceNuke.spell !== "Blizzard II") throw new Error("stormwaker ice nuke");
  const weakBody = automatonPlan({ frame: "valoredge", head: "stormwaker", maneuvers: { ...none, ice: 3 }, masterRatio: 1, selfRatio: 1 });
  if (weakBody.kind !== "melee") throw new Error("a melee frame does not cast");
  const sword = automatonPlan({ frame: "valoredge", head: "valoredge", maneuvers: { ...none, ice: 3 }, masterRatio: 1, selfRatio: 1 });
  if (sword.kind !== "melee") throw new Error("valoredge head does not cast on a valoredge frame");
  const patch = automatonPlan({ frame: "stormwaker", head: "valoredge", maneuvers: { ...none, light: 2 }, masterRatio: 0.4, selfRatio: 1 });
  if (patch.kind !== "cure" || patch.spell !== "Cure II") throw new Error("valoredge head cures on a magic frame");
  const bigCure = automatonCureSpell("stormwaker", "soulsoother", 3);
  if (!bigCure || bigCure.spell !== "Cure V" || bigCure.tier !== 5) throw new Error("soulsoother cure v");
  const drain = automatonPlan({ frame: "stormwaker", head: "spiritreaver", maneuvers: { ...none, dark: 2 }, masterRatio: 1, selfRatio: 0.4 });
  if (drain.kind !== "drain" || drain.spell !== "Drain") throw new Error("spiritreaver drain");
  const iceOverDark = automatonPlan({ frame: "stormwaker", head: "spiritreaver", maneuvers: { ...none, dark: 2, ice: 2 }, masterRatio: 1, selfRatio: 0.4 });
  if (iceOverDark.kind !== "nuke" || iceOverDark.spell !== "Blizzard II") throw new Error("ice puts nukes ahead of drain");
  const slow = automatonPlan({ frame: "harlequin", head: "harlequin", maneuvers: { ...none, earth: 1 }, masterRatio: 1, selfRatio: 1 });
  if (slow.kind !== "enfeeble" || slow.spell !== "Slow") throw new Error("harlequin earth is slow");
  const noAddle = automatonPlan({ frame: "harlequin", head: "harlequin", maneuvers: { ...none, fire: 3 }, masterRatio: 1, selfRatio: 1 });
  if (noAddle.kind !== "melee") throw new Error("addle is past level 75");
  const para = automatonPlan({ frame: "stormwaker", head: "soulsoother", maneuvers: { ...none, ice: 2 }, masterRatio: 1, selfRatio: 1 });
  if (para.kind !== "enfeeble" || para.spell !== "Paralyze") throw new Error("soulsoother does not nuke");
  const gun = automatonPlan({ frame: "sharpshot", head: "sharpshot", maneuvers: { ...none, earth: 3 }, masterRatio: 1, selfRatio: 1 });
  if (gun.kind !== "melee") throw new Error("sharpshot head does not cast on a sharpshot frame");
  const thunderOnly = automatonPlan({ frame: "stormwaker", head: "stormwaker", maneuvers: { ...none, thunder: 3 }, masterRatio: 1, selfRatio: 1 });
  if (thunderOnly.kind !== "nuke" || thunderOnly.spell !== "Thunder III") throw new Error("stormwaker thunder");
  const edge = autoAttackProfile({ frame: "valoredge", head: "valoredge", attachments: [], maneuvers: { ...none, fire: 3, earth: 2 }, overdrive: false });
  if (edge.wsChance !== 0.54 || edge.wsName !== "Chimera Ripper" || edge.block !== 48 || edge.taken !== 0.9) throw new Error(`valoredge maneuvers ${edge.wsChance}/${edge.block}/${edge.taken}`);
  const held = autoAttackProfile({ frame: "valoredge", head: "valoredge", attachments: ["Flame Holder"], maneuvers: { ...none, fire: 3 }, overdrive: false });
  if (held.wsMult !== 5.78) throw new Error(`flame holder ${held.wsMult}`);
  const tide = autoAttackProfile({ frame: "stormwaker", head: "stormwaker", attachments: [], maneuvers: { ...none, water: 2, wind: 2 }, overdrive: false });
  if (tide.magicTaken !== 0.88 || tide.evasion !== 16) throw new Error("water and wind maneuvers");
  const bolt = automatonSpellPower({ frame: "stormwaker", head: "stormwaker", attachments: [], maneuvers: none, overdrive: false, tier: 2 });
  const boltIce = automatonSpellPower({ frame: "stormwaker", head: "stormwaker", attachments: [], maneuvers: { ...none, ice: 2 }, overdrive: false, tier: 2 });
  const spoken = automatonSpellPower({ frame: "stormwaker", head: "stormwaker", attachments: ["Loudspeaker"], maneuvers: none, overdrive: false, tier: 2 });
  const made = automatonSpellPower({ frame: "stormwaker", head: "stormwaker", attachments: ["Ice Maker"], maneuvers: { ...none, ice: 2 }, overdrive: false, tier: 2, nuke: true });
  if (bolt !== 58 || boltIce !== 68 || spoken !== 61 || made !== 119) throw new Error(`spell power ${bolt}/${boltIce}/${spoken}/${made}`);
  if (automatonCastDelay("stormwaker", 0, false) !== 8.5 || automatonCastDelay("stormwaker", 3, false) !== 6.7) throw new Error("dark cast delay");
  const boosted = automatonCastDelay("stormwaker", none, false, ["Mana Booster"]);
  if (boosted !== 6.8) throw new Error(`mana booster ${boosted}`);
  if (maneuverBurden(53, 68, false) !== 20 || maneuverBurden(53, 68, true) !== 30 || maneuverBurden(80, 68, false) !== 15 || maneuverBurden(53, null, false) !== 15) {
    throw new Error("burden");
  }
  if (Math.round(overloadChance(76) * 100) !== 51 || overloadChance(30) !== 0) throw new Error("overload chance");
  if (burdenDecay(false, 3) !== 1 || burdenDecay(true, 2) !== 4) throw new Error("heatsink");
  if (replicatorShadows(0) !== 0 || replicatorShadows(1) !== 3 || replicatorShadows(2) !== 7 || replicatorShadows(3) !== 10) throw new Error("replicator");
  if (automatonHpMax(storm, ["Auto-Repair Kit II"]) !== 866 || automatonMpMax(storm, []) !== 901 || automatonMpMax(storm, ["Mana Tank"]) !== 1081) {
    throw new Error("hp mp max");
  }
  if (automatonSpellMp("nuke", 3) !== 79 || automatonSpellMp("cure", 1) !== 8) throw new Error("spell mp");
  if (automatonPayMp(100, 0.1) !== 90) throw new Error("power cooler");
  const note = attachmentNote("fire", 1, ["Tension Spring"], false);
  if (!note.includes("Tension Spring +6% attack")) throw new Error(note);
  if (automatonCombatSkill("valoredge", "valoredge") !== 269 || automatonCombatSkill("sharpshot", "sharpshot") !== 269) throw new Error("matching skill");
  if (automatonCombatSkill("harlequin", "harlequin") !== 240 || automatonCombatSkill("stormwaker", "stormwaker") !== 230) throw new Error("melee skill");
  if (automatonCombatSkill("valoredge", "harlequin") !== 256 || automatonCombatSkill("stormwaker", "soulsoother") !== 225) throw new Error("unmatched skill");
  if (automatonSkill("stormwaker", "stormwaker", "magic") !== 269 || automatonSkill("stormwaker", "soulsoother", "magic") !== 276) throw new Error("magic skill");
  if (automatonSkill("valoredge", "stormwaker", "magic") !== 0) throw new Error("melee frame magic");
  const bareEdge = chooseAutomatonWs({ frame: "valoredge", head: "valoredge", maneuvers: none });
  if (bareEdge.ws.name !== "Chimera Ripper" || bareEdge.ws.props.join("/") !== "Detonation/Induration" || bareEdge.hold) throw new Error("valoredge base");
  const clip = chooseAutomatonWs({ frame: "valoredge", head: "valoredge", maneuvers: { ...none, thunder: 1 } });
  if (clip.ws.name !== "String Clipper" || clip.ws.props.join("/") !== "Scission") throw new Error("string clipper");
  const tie = chooseAutomatonWs({ frame: "valoredge", head: "valoredge", maneuvers: { ...none, fire: 1, thunder: 1 } });
  if (tie.ws.name !== "String Clipper") throw new Error("thunder ties fire and wins on priority");
  const moreFire = chooseAutomatonWs({ frame: "valoredge", head: "valoredge", maneuvers: { ...none, fire: 2, thunder: 1 } });
  if (moreFire.ws.name !== "Chimera Ripper") throw new Error("more fire maneuvers");
  const bone = chooseAutomatonWs({ frame: "valoredge", head: "valoredge", maneuvers: { ...none, light: 3 } });
  if (bone.ws.name !== "Bone Crusher" || bone.ws.props.join("/") !== "Fragmentation") throw new Error("bone crusher");
  const dark = chooseAutomatonWs({ frame: "valoredge", head: "valoredge", maneuvers: { ...none, dark: 1 } });
  if (dark.ws.name !== "Cannibal Blade" || !dark.ws.sure || dark.ws.props.join("/") !== "Compression/Reverberation") throw new Error("cannibal blade");
  const shred = chooseAutomatonWs({ frame: "valoredge", head: "valoredge", maneuvers: { ...none, thunder: 3 }, skill: 324 });
  if (shred.ws.name !== "String Shredder" || shred.ws.props.join("/") !== "Distortion/Scission") throw new Error("string shredder");
  const noShred = chooseAutomatonWs({ frame: "valoredge", head: "valoredge", maneuvers: { ...none, thunder: 3 }, skill: 269 });
  if (noShred.ws.name !== "String Clipper") throw new Error("324 is past the level 75 cap");
  const bow = chooseAutomatonWs({ frame: "sharpshot", head: "sharpshot", maneuvers: none });
  if (bow.ws.name !== "Arcuballista" || bow.ws.props.join("/") !== "Liquefaction/Transfixion") throw new Error("arcuballista");
  const daze = chooseAutomatonWs({ frame: "sharpshot", head: "sharpshot", maneuvers: { ...none, thunder: 2 } });
  if (daze.ws.name !== "Daze" || daze.ws.props.join("/") !== "Impaction/Transfixion") throw new Error("daze");
  const pierce = chooseAutomatonWs({ frame: "sharpshot", head: "sharpshot", maneuvers: { ...none, dark: 1 } });
  if (pierce.ws.name !== "Armor Piercer" || pierce.ws.props.join("/") !== "Gravitation") throw new Error("armor piercer");
  const shatter = chooseAutomatonWs({ frame: "sharpshot", head: "sharpshot", maneuvers: { ...none, wind: 3 }, skill: 324 });
  if (shatter.ws.name !== "Armor Shatterer" || shatter.ws.props.join("/") !== "Fusion/Impaction") throw new Error("armor shatterer");
  const noShatter = chooseAutomatonWs({ frame: "sharpshot", head: "sharpshot", maneuvers: { ...none, wind: 3 } });
  if (noShatter.ws.name !== "Arcuballista") throw new Error("armor shatterer is not at 75");
  const slap = chooseAutomatonWs({ frame: "stormwaker", head: "stormwaker", maneuvers: none });
  if (slap.ws.name !== "Slapstick" || slap.ws.props.join("/") !== "Reverberation/Impaction") throw new Error("slapstick");
  const knock = chooseAutomatonWs({ frame: "harlequin", head: "harlequin", maneuvers: { ...none, wind: 1 } });
  if (knock.ws.name !== "Knockout" || knock.ws.props.join("/") !== "Scission/Detonation") throw new Error("knockout");
  const mortar = chooseAutomatonWs({ frame: "harlequin", head: "harlequin", maneuvers: { ...none, light: 1 } });
  if (mortar.ws.name !== "Magic Mortar" || mortar.ws.props.join("/") !== "Liquefaction/Fusion") throw new Error("magic mortar");
  const heldWs = chooseAutomatonWs({
    frame: "sharpshot",
    head: "sharpshot",
    maneuvers: { ...none, thunder: 3 },
    inhibitor: true,
    masterTp: 900,
    opening: [],
  });
  if (!heldWs.hold) throw new Error("inhibitor waits at 900 TP");
  const stillOpen = chooseAutomatonWs({
    frame: "sharpshot",
    head: "sharpshot",
    maneuvers: none,
    inhibitor: true,
    masterTp: 1500,
    opening: ["Liquefaction"],
  });
  if (stillOpen.hold || stillOpen.ws.name !== "Daze") throw new Error("inhibitor closes even above 900");
  const closer = chooseAutomatonWs({
    frame: "sharpshot",
    head: "sharpshot",
    maneuvers: none,
    inhibitor: true,
    masterTp: 0,
    opening: ["Liquefaction"],
  });
  if (closer.hold || closer.ws.name !== "Daze") throw new Error("inhibitor closes liquefaction with daze");
  const opener = chooseAutomatonWs({
    frame: "sharpshot",
    head: "sharpshot",
    maneuvers: { ...none, thunder: 3 },
    inhibitor: true,
    masterTp: 0,
    opening: [],
    masterClosers: [["Transfixion", "Impaction"], ["Fragmentation"]],
  });
  if (opener.hold || opener.ws.name !== "Armor Piercer") throw new Error("inhibitor opens for the master");
}
