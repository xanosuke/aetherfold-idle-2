/**
 * FF12-style gambit boards.
 *
 * A board is ordered. The idle scan walks the top slot down and fires the
 * first one whose target, condition, and action all fit. Hold spends that
 * scan and does nothing else. Engage is the only row that starts
 * auto-attack. A spell, job ability, weapon skill, or ranged attack does
 * not wait for that. If the row already has its target, condition, and
 * action, it fires while the actor is disengaged. Foe: Claimed is the foe
 * with enmity on it. Engage alone does not count. The row acts on the
 * living foe with the most enmity, from you or a trust. An action that
 * cannot land on a foe lands on you instead. A weapon skill still
 * has to be in weapon range. A ranged attack has to be inside 25 yalms.
 * A spell still has to be inside its own range.
 * Once engaged, the Engage row steps aside so the next one can fire,
 * including while you are still closing to melee range.
 *
 * Ally opens Any, the player, and each summoned trust. A named ally is that person.
 * Ally: Buff Missing on a named ally checks that ally, and the action lands on them.
 * Enemy HP under and over a percent are conditions. The percent is the same wheel.
 * Closest is any foe within 10 yalms of the player, nearest first.
 * The percent is a wheel. Ally HP, Ally MP, your own MP, a missing buff on yourself,
 * a missing buff on an ally, and a missing enemy debuff are conditions. Under is strictly below. Over is strictly above.
 * TP over 1000 and TP under 1000 are strict. TP at least 1000 still includes 1000.
 * Ally: TP > 1000 is strict. On an ally it is that ally. On a foe it is any living ally.
 * Skillchain ready is a property still open on that foe. Light and Darkness are not choices.
 * It is true the moment the weapon skill connects, before the 3 second window.
 * The weapon skill on that row is the one that fires. A higher chain does not replace it.
 * Job abilities and weapon skills come from the hotbar catalogs.
 * Foe abilities and party-share abilities are the two maps below.
 */

import { LEVEL, HARE } from "./content";
import { autoAttackRange } from "./distance";
import { subjobLevel } from "./jobs";
import type { JobId } from "./stats";
import { PROVOKE_RANGE, tryAbility, type AbilityContext } from "./abilities";
import { canUse, findAction, hotbarGroups, type HotAction, type RangeBar } from "./hotbar";
import { spellAim, spellByName, spellUnlocked, spellsKnown, type Spell } from "./spells";
import { BLM_ABILITIES } from "./blm";
import { MNK_ABILITIES } from "./mnk";
import { RDM_ABILITIES } from "./rdm";
import { HATE_STEAL_MOB, HATE_STEAL_RANGE, STEAL_RANGE, THF_ABILITIES } from "./thf";
import { KONZEN_RANGE, SAM_ABILITIES } from "./sam";
import { EAGLE_EYE_RANGE, RNG_ABILITIES, SHADOWBIND_RANGE } from "./rng";
import { PLD_ABILITIES, SHIELD_BASH_RANGE } from "./pld";
import { MIJIN_RANGE, NIN_ABILITIES } from "./nin";
import { BRD_ABILITIES } from "./brd";
import { DRK_ABILITIES, WEAPON_BASH_RANGE } from "./drk";
import { DRG_ABILITIES, HIGH_JUMP_RANGE, JUMP_RANGE, SUPER_JUMP_RANGE } from "./drg";
import { SMN_ABILITIES, pactByName, pactMp, PACT_SHOW } from "./smn";
import { BST_ABILITIES, CHARM_RANGE, GAUGE_RANGE, TAME_RANGE } from "./bst";
import { BLU_ABILITIES } from "./blu";
import { DEPLOY_RANGE, PUP_ABILITIES } from "./pup";
import { COR_ABILITIES, QUICK_DRAW_RANGE, QUICK_DRAWS } from "./cor";
import { ANIMATED_RANGE, DNC_ABILITIES, FLOURISH_RANGE, WILD_RANGE, isWaltz, STEP_RANGE, STEP_RANGE_SHORT } from "./dnc";
import { SCH_ABILITIES, scholarCastAdjust } from "./sch";
import { RUN_ABILITIES, SWIPE_RANGE } from "./run";
import { GEO_ABILITIES, geoAllies } from "./geo";
import { WAR_ABILITIES } from "./war";
import { WHM_ABILITIES } from "./whm";
import {
  archeryByName,
  axeByName,
  clubByName,
  daggerByName,
  greatAxeByName,
  greatKatanaByName,
  greatSwordByName,
  handByName,
  katanaByName,
  marksmanshipByName,
  polearmByName,
  scytheByName,
  staffByName,
  swordByName,
} from "./weaponskills";
import { CHAIN_PROPERTIES } from "./skillchain";

export const GAMBIT_MEMBER = "player";
export const GAMBIT_SLOT_COUNT = 8;
export const GAMBIT_KEY = "first-swing-gambits";

export const GAMBIT_TARGETS = [
  { id: "self", label: "Self" },
  { id: "ally-any", label: "Ally: Any" },
  { id: "foe", label: "Foe current target" },
  { id: "foe-claimed", label: "Foe: Claimed" },
  { id: "foe-2", label: "Foe: 2+" },
  { id: "foe-hp", label: "Foe: HP < %" },
  { id: "foe-closest", label: "Foe: Closest" },
] as const;

export const GAMBIT_CONDITIONS = [
  { id: "nothing", label: "Nothing" },
  { id: "self-buff", label: "Self: Buff Missing" },
  { id: "self-mp-under", label: "Self: MP < %" },
  { id: "self-mp-over", label: "Self: MP > %" },
  { id: "ally-hp", label: "Ally: HP < %" },
  { id: "ally-hp-over", label: "Ally: HP > %" },
  { id: "ally-mp-under", label: "Ally: MP < %" },
  { id: "ally-mp-over", label: "Ally: MP > %" },
  { id: "ally-buff", label: "Ally: Buff Missing" },
  { id: "ally-tp-over", label: "Ally: TP > 1000" },
  { id: "foe-debuff", label: "Enemy: Debuff Missing" },
  { id: "foe-hp-under", label: "Enemy: HP < %" },
  { id: "foe-hp-over", label: "Enemy: HP > %" },
  { id: "ko", label: "Status = KO" },
  { id: "tp-1000", label: "TP at least 1000" },
  { id: "tp-over", label: "TP > 1000" },
  { id: "tp-under", label: "TP < 1000" },
  { id: "ready", label: "Ability ready" },
  { id: "sc-light", label: "Skill chain: Light" },
  { id: "sc-ready", label: "Skillchain ready" },
] as const;

/** Skillchains a ready row may name. Light and Darkness are closed chains, not openers. */
export const GAMBIT_READY_CHAINS = CHAIN_PROPERTIES.filter((name) => name !== "Light" && name !== "Darkness");

/** Wheel stops. 50 is the middle. Under is strictly below this percent. Over is strictly above it. */
export const GAMBIT_HP_PCTS = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95] as const;

/** Foe: Closest only sees enemies this many yalms from the player, and picks the nearest. */
export const GAMBIT_CLOSEST_YARDS = 10;

export function clampGambitHp(value: unknown): number {
  const n = typeof value === "number" ? value : typeof value === "string" ? Number(value) : NaN;
  if (!Number.isFinite(n)) return 50;
  const stepped = Math.round(n / 5) * 5;
  return Math.min(95, Math.max(5, stepped));
}

/** Spells a slot may name. Add a name to offer it beside job abilities and weapon skills. */
export const GAMBIT_SPELL_NAMES = ["Cure", "Raise", "Holy"] as const;

export type GambitTargetId = (typeof GAMBIT_TARGETS)[number]["id"];
export type GambitConditionId = (typeof GAMBIT_CONDITIONS)[number]["id"];
/** One ally, by id. "player" is you. A trust id is that trust. */
export type GambitMemberTarget = `ally:${string}`;

export type GambitSlot = {
  target: GambitTargetId | GambitMemberTarget | "";
  condition: GambitConditionId | "";
  action: string;
  /** 5–95. Foe HP, Ally HP, Ally MP, and Self MP all read this. */
  hpPct?: number;
  /** Status name for a missing buff or debuff. Skillchain name for Skillchain ready. */
  buff?: string;
};

export type GambitBoard = {
  on: boolean;
  slots: GambitSlot[];
};

export type GambitBook = Record<string, GambitBoard>;

export type GambitBuff = {
  name: string;
  tier?: number;
  enspell?: { tier: 1 | 2; element: string };
};

export type GambitAlly = {
  id: string;
  hp: number;
  maxHp: number;
  ko: boolean;
  /** The member whose board is scanning. Cure lands on this one. */
  caster: boolean;
  /** Statuses already on this ally. Unset on the caster means the actor's own buffs. */
  buffs?: readonly GambitBuff[];
  /** Yards from the caster. The caster is 0. Unset means the actor's party range. */
  yards?: number;
  /** Unset on the caster falls back to the actor's own pool. */
  mp?: number;
  maxMp?: number;
  /** Unset on the caster falls back to the actor's own TP. */
  tp?: number;
};

export type GambitFoe = {
  present: boolean;
  /** Current HP divided by maximum. A fresh Tropical Rarab is full. */
  hpRatio: number;
  ko: boolean;
  undead: boolean;
  /** Someone in the party has enmity on this foe. A fresh engage does not. */
  claimed?: boolean;
  /** CE + VE from you, trusts, and pets. Foe: Claimed picks the highest. */
  enmity?: number;
  /** Which body this is. The yard uses "hare" or "kin". */
  id?: string;
  /** Yalms from the player. Foe: Closest uses this, not the caster's own distance. */
  playerYards?: number;
  /** Yalms from the actor scanning the board. A trust uses this for the body it picked. */
  yards?: number;
  /** Status names currently on this foe. A missing name is Enemy: Debuff Missing. */
  debuffs?: readonly string[];
  /** Properties a following weapon skill can still close. Empty when the window is shut. */
  resonance?: readonly string[];
};

export type GambitActor = {
  hp: number;
  maxHp: number;
  mp: number;
  /** Unset means an MP percent check on the caster does not match. */
  maxMp?: number;
  tp: number;
  ko: boolean;
  targeted: boolean;
  inRange: boolean;
  distance: number;
  /** Yalms from this caster to the player. Unset means the check is skipped. */
  partyRange?: number;
  manafont: boolean;
  buffs: readonly GambitBuff[];
  recasts: Readonly<Record<string, number>>;
  job: JobId;
  sub: JobId | null;
  skillName: string;
  skill: number;
  weaponName: string;
  delay: number;
  vit: number;
  monkLevel: number;
  monkMain: boolean;
  foe: GambitFoe | null;
  /**
   * Every foe this check can see. When set, Foe: Closest reads this list
   * instead of `foe`. The yard has one enemy, so it leaves this unset.
   */
  foes?: readonly GambitFoe[];
  /** When set, spell and ability checks use these levels instead of the battle cap. */
  levels?: Partial<Record<JobId, number>>;
  /** Cure may land on a living ally who is not the caster. The player's board leaves this off. */
  cureParty?: boolean;
  /** Spells this actor may gambit. Unset keeps the shared Cure and Raise list. */
  knownSpells?: readonly string[];
  /** Already auto-attacking. Only the Engage row reads this. Other rows do not wait for it. */
  engaged?: boolean;
  /** Weapons in hand. When set, a weapon skill matches any of them instead of the one job list. */
  arms?: readonly { skillName: string; skill: number; weaponName: string }[];
  /** Bow in the range slot. Archery weapon skills read this instead of the main hand. */
  range?: RangeBar | null;
  /** Foes this check can see. Omitted means one when a foe is present. Foe: 2+ needs two. */
  foeCount?: number;
  /** Equipped shield size bonus. Null when the off hand is empty. Shield Bash needs it. */
  shield?: number | null;
  mnd?: number;
  pldLevel?: number;
  pldMain?: boolean;
  ninLevel?: number;
  ninMain?: boolean;
  brdMain?: boolean;
  drkLevel?: number;
  drkMain?: boolean;
  bluLevel?: number;
  bluMain?: boolean;
  pupLevel?: number;
  pupMain?: boolean;
  /** Two-handed weapon in hand. Weapon Bash needs it. */
  twoHand?: boolean;
  /** Closed skillchain whose magic-burst window is open. */
  skillchain?: string | null;
  /** Avatar that is out. Null means none. Unset skips the pet check. */
  avatarName?: string | null;
  /** Job fields tryAbility needs. Scholar, geomancer, rune, dancer, corsair, and the pet jobs live here. */
  ability?: Partial<AbilityContext>;
  /** Daze rows on the foe, with stacks. A step reads the one it refreshes. */
  stepRows?: readonly { name: string; power?: number; left?: number }[];
  /** False when this actor cannot call a pet. Those rows are skipped so the rest of the board still runs. */
  petCalls?: boolean;
};

export type GambitHit = { kind: "hold" } | { kind: "act"; actionId: string; aim: "self" | "enemy"; targetId?: string | null; foeId?: string | null };

/** Walk toward this actor until the gambit is in range. "foe" is the enemy. Anything else is an ally id. */
export type GambitApproach = { toward: string; yards: number; foeId?: string | null };

type Subject = { kind: "ally"; ally: GambitAlly } | { kind: "foe"; foe: GambitFoe };

const TARGET_IDS = new Set<string>(GAMBIT_TARGETS.map((row) => row.id));
const CONDITION_IDS = new Set<string>(GAMBIT_CONDITIONS.map((row) => row.id));
const READY_IDS = new Set<string>(GAMBIT_READY_CHAINS);

/** A Skillchain ready row named this weapon skill. That swing is not swapped for a higher chain. */
export function gambitPinsWeaponSkill(board: GambitBoard, actionId: string): boolean {
  if (!actionId.startsWith("ws:")) return false;
  return board.slots.some((slot) => slot.condition === "sc-ready" && slot.action === actionId && !!slot.buff && READY_IDS.has(slot.buff));
}

/**
 * Job abilities that need the current foe. Range null means any distance
 * once the foe is targeted. Add a row when a new ability aims at an enemy.
 */
const FOE_ABILITY_RANGE: Record<string, number | null> = {
  Provoke: PROVOKE_RANGE,
  Steal: STEAL_RANGE,
  Mug: STEAL_RANGE,
  "Chi Blast": null,
  "Konzen-ittai": KONZEN_RANGE,
  Shadowbind: SHADOWBIND_RANGE,
  "Eagle Eye Shot": EAGLE_EYE_RANGE,
  "Shield Bash": SHIELD_BASH_RANGE,
  "Weapon Bash": WEAPON_BASH_RANGE,
  "Mijin Gakure": MIJIN_RANGE,
  Deploy: DEPLOY_RANGE,
  Swipe: SWIPE_RANGE,
  Lunge: SWIPE_RANGE,
  Gambit: SWIPE_RANGE,
  Quickstep: STEP_RANGE_SHORT,
  "Box Step": STEP_RANGE,
  "Stutter Step": STEP_RANGE_SHORT,
  "Animated Flourish": ANIMATED_RANGE,
  "Desperate Flourish": FLOURISH_RANGE,
  "Violent Flourish": FLOURISH_RANGE,
  "Wild Flourish": WILD_RANGE,
  Gauge: GAUGE_RANGE,
  Charm: CHARM_RANGE,
  Tame: TAME_RANGE,
  Jump: JUMP_RANGE,
  "High Jump": HIGH_JUMP_RANGE,
  "Super Jump": SUPER_JUMP_RANGE,
};
for (const shot of QUICK_DRAWS) FOE_ABILITY_RANGE[shot] = QUICK_DRAW_RANGE;

/** A step's daze. The stack is on the foe, not on the dancer. */
const STEP_DAZE: Record<string, string> = {
  Quickstep: "Lethargic Daze",
  "Box Step": "Sluggish Daze",
  "Stutter Step": "Weakened Daze",
};

/** These call a pet. A trust that cannot keep one skips the row. */
const PET_CALLS = new Set(["Call Wyvern", "Call Beast", "Bestial Loyalty", "Activate", "Deus Ex Automata"]);

/** Steals enmity from another party member. Trusts count. The actor must also be near the monster. */
const NEEDS_OTHER_MEMBER = new Set(["Accomplice", "Collaborator"]);

const ABILITY_ROWS: readonly { name: string; duration: number }[] = [
  ...WAR_ABILITIES,
  ...BLM_ABILITIES,
  ...WHM_ABILITIES,
  ...RDM_ABILITIES,
  ...MNK_ABILITIES,
  ...THF_ABILITIES,
  ...SAM_ABILITIES,
  ...RNG_ABILITIES,
  ...PLD_ABILITIES,
  ...NIN_ABILITIES,
  ...BRD_ABILITIES,
  ...DRK_ABILITIES,
  ...RUN_ABILITIES,
  ...DRG_ABILITIES,
  ...SMN_ABILITIES,
  ...BST_ABILITIES,
  ...BLU_ABILITIES,
  ...PUP_ABILITIES,
  ...COR_ABILITIES,
  ...DNC_ABILITIES,
  ...SCH_ABILITIES,
  ...GEO_ABILITIES,
];

let yieldIdle = false;

/** A manual command that actually started. The next idle scan stands down once. */
export function armGambitYield(): void {
  yieldIdle = true;
}

/** True when this idle scan should not fire. Clears the yield. */
export function takeGambitYield(): boolean {
  if (!yieldIdle) return false;
  yieldIdle = false;
  return true;
}

export function blankSlot(): GambitSlot {
  return { target: "", condition: "", action: "" };
}

export function blankBoard(): GambitBoard {
  return { on: false, slots: Array.from({ length: GAMBIT_SLOT_COUNT }, blankSlot) };
}

export function blankBook(): GambitBook {
  return { [GAMBIT_MEMBER]: blankBoard() };
}

function slug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function sanitizeAction(value: unknown): string {
  if (value === "" || value === "hold" || value === "engage" || value === "ranged") return value;
  if (typeof value !== "string") return "";
  return /^(spell|ability|ws):[a-z0-9-]+$/.test(value) ? value : "";
}

function sanitizeBuff(value: unknown): string {
  if (typeof value !== "string") return "";
  const name = value.trim();
  if (name.length < 1 || name.length > 40) return "";
  return /^[A-Za-z][A-Za-z0-9 :'+.-]*$/.test(name) ? name : "";
}

function usesPercent(condition: GambitConditionId | ""): boolean {
  return condition === "ally-hp" || condition === "ally-hp-over" || condition === "ally-mp-under" || condition === "ally-mp-over" || condition === "self-mp-under" || condition === "self-mp-over" || condition === "foe-hp-under" || condition === "foe-hp-over";
}

function memberOf(target: string): string | null {
  if (!target.startsWith("ally:")) return null;
  const id = target.slice(5);
  return /^[a-z0-9-]+$/.test(id) ? id : null;
}

function sanitizeBoard(value: unknown): GambitBoard {
  const board = blankBoard();
  if (!value || typeof value !== "object") return board;
  const raw = value as { on?: unknown; slots?: unknown };
  board.on = raw.on === true;
  if (!Array.isArray(raw.slots)) return board;
  for (let i = 0; i < GAMBIT_SLOT_COUNT; i++) {
    const slot = raw.slots[i];
    if (!slot || typeof slot !== "object") continue;
    const row = slot as { target?: unknown; condition?: unknown; action?: unknown; hpPct?: unknown; buff?: unknown };
    let target: GambitSlot["target"] = "";
    let condition: GambitConditionId | "" = "";
    let hpPct: number | undefined;
    const rawTarget = row.target;
    const rawCondition = row.condition;
    if (rawTarget === "ally-low") target = "ally-any";
    else if (typeof rawTarget === "string" && TARGET_IDS.has(rawTarget)) target = rawTarget as GambitTargetId;
    else if (typeof rawTarget === "string" && memberOf(rawTarget)) target = rawTarget as GambitMemberTarget;
    if (rawCondition === "hp-50" || rawCondition === "hp-30") {
      const pct = rawCondition === "hp-30" ? 30 : 50;
      if (target === "foe" || target === "foe-claimed" || target === "foe-2" || target === "foe-hp" || target === "foe-closest") {
        target = "foe-hp";
        condition = "nothing";
        hpPct = pct;
      } else {
        condition = "ally-hp";
        hpPct = pct;
      }
    } else if (typeof rawCondition === "string" && CONDITION_IDS.has(rawCondition)) {
      condition = rawCondition as GambitConditionId;
    }
    if (target === "foe-hp" || usesPercent(condition)) hpPct = clampGambitHp(row.hpPct ?? hpPct ?? 50);
    const named = sanitizeBuff(row.buff);
    const buff = condition === "self-buff" || condition === "ally-buff" || condition === "foe-debuff"
      ? named
      : condition === "sc-ready" && READY_IDS.has(named)
        ? named
        : "";
    board.slots[i] = {
      target,
      condition,
      action: sanitizeAction(row.action),
      ...(hpPct != null ? { hpPct } : {}),
      ...(buff ? { buff } : {}),
    };
  }
  return board;
}

export function gambitBookFrom(raw: unknown): GambitBook {
  const book = blankBook();
  if (!raw || typeof raw !== "object") return book;
  for (const [id, value] of Object.entries(raw as Record<string, unknown>)) {
    if (!/^[a-z0-9-]+$/.test(id)) continue;
    book[id] = sanitizeBoard(value);
  }
  if (!book[GAMBIT_MEMBER]) book[GAMBIT_MEMBER] = blankBoard();
  return book;
}

export function loadGambitBook(): GambitBook {
  try {
    if (typeof localStorage === "undefined") return blankBook();
    const raw = localStorage.getItem(GAMBIT_KEY);
    if (!raw) return blankBook();
    return gambitBookFrom(JSON.parse(raw) as unknown);
  } catch {
    return blankBook();
  }
}

export function saveGambitBook(book: GambitBook): void {
  try {
    localStorage.setItem(GAMBIT_KEY, JSON.stringify(book));
  } catch {
    /* private mode */
  }
}

export type GambitLoadout = {
  job: JobId;
  sub: JobId | null;
  skillName: string;
  skill: number;
  weaponName: string;
  /** Overrides the battle-cap levels when a trust is limited to the player's job. */
  levels?: Partial<Record<JobId, number>>;
  /** Replaces the shared Cure and Raise menu. */
  spellNames?: readonly string[];
  /** Bow in the range slot. Its weapon skills join the main-hand list. */
  range?: RangeBar | null;
};

export type GambitChoice = { id: string; label: string };

export function gambitActionGroups(loadout: GambitLoadout): { title: string; actions: GambitChoice[] }[] {
  const groups = hotbarGroups(loadout.skillName, loadout.skill, loadout.weaponName, loadout.job, loadout.sub, loadout.range ?? null);
  const levels: Partial<Record<JobId, number>> = loadout.levels ?? { [loadout.job]: LEVEL };
  if (!loadout.levels && loadout.sub && loadout.sub !== loadout.job) levels[loadout.sub] = subjobLevel(LEVEL);
  const names = loadout.spellNames ?? GAMBIT_SPELL_NAMES;
  const spells = names.map((name) => {
    const spell = spellByName(name);
    const known = spell ? spellUnlocked(spell, levels) : false;
    return { id: `spell:${slug(name)}`, label: known ? name : `${name} (not learned)` };
  });
  const abilities = [
    ...(groups.find((group) => group.title === "Abilities")?.actions ?? []),
    ...(groups.find((group) => group.title === "Blood Pacts")?.actions ?? []),
  ].map((action) => ({
    id: action.id,
    label: action.name,
  }));
  const weapons = (groups.find((group) => group.title === "Weapon skills")?.actions ?? []).map((action) => ({
    id: action.id,
    label: action.name,
  }));
  return [
    { title: "Board", actions: [{ id: "hold", label: "Hold" }, { id: "engage", label: "Engage" }, { id: "ranged", label: "Ranged Attack" }] },
    { title: "Spells", actions: spells },
    { title: "Job abilities", actions: abilities },
    { title: "Weapon skills", actions: weapons },
  ];
}

function jobLevels(actor: GambitActor): Partial<Record<JobId, number>> {
  if (actor.levels) return actor.levels;
  const levels: Partial<Record<JobId, number>> = { [actor.job]: LEVEL };
  if (actor.sub && actor.sub !== actor.job) levels[actor.sub] = subjobLevel(LEVEL);
  return levels;
}

function abilityBook(job: JobId): readonly { name: string; level: number; access: string; merit?: boolean }[] {
  if (job === "WAR") return WAR_ABILITIES;
  if (job === "BLM") return BLM_ABILITIES;
  if (job === "WHM") return WHM_ABILITIES;
  if (job === "RDM") return RDM_ABILITIES;
  if (job === "MNK") return MNK_ABILITIES;
  if (job === "THF") return THF_ABILITIES;
  if (job === "SAM") return SAM_ABILITIES;
  if (job === "RNG") return RNG_ABILITIES;
  if (job === "PLD") return PLD_ABILITIES;
  if (job === "NIN") return NIN_ABILITIES;
  if (job === "BRD") return BRD_ABILITIES;
  if (job === "DRK") return DRK_ABILITIES;
  if (job === "DRG") return DRG_ABILITIES;
  if (job === "SMN") return SMN_ABILITIES;
  if (job === "BST") return BST_ABILITIES;
  if (job === "BLU") return BLU_ABILITIES;
  if (job === "PUP") return PUP_ABILITIES;
  if (job === "COR") return COR_ABILITIES;
  if (job === "DNC") return DNC_ABILITIES;
  if (job === "SCH") return SCH_ABILITIES;
  if (job === "RUN") return RUN_ABILITIES;
  if (job === "GEO") return GEO_ABILITIES;
  return [];
}

/** A trust with explicit levels only knows abilities inside those levels. The player does not pass levels. */
function abilityKnown(actor: GambitActor, name: string): boolean {
  if (!actor.levels) return true;
  const main = abilityBook(actor.job).find((row) => row.name === name);
  if (main && !main.merit && main.level <= (actor.levels[actor.job] ?? 0)) return true;
  if (!actor.sub || actor.sub === actor.job) return false;
  const sub = abilityBook(actor.sub).find((row) => row.name === name);
  return !!sub && !sub.merit && sub.access === "sub" && sub.level <= (actor.levels[actor.sub] ?? 0);
}

function spellGrantsBuff(spell: Spell): boolean {
  if (spell.song && !spell.song.hostile) return true;
  if (spell.colure?.side === "indi") return true;
  if (spell.colure && geoAllies(spell.colure.effect)) return true;
  if (spell.nin && (spell.nin.kind === "shadow" || spell.nin.kind === "invisible" || spell.nin.kind === "sneak")) return true;
  return !!(spell.barrier || spell.regen || spell.haste || spell.refresh || spell.auspice || spell.aquaveil || spell.blink || spell.phalanx || spell.reprisal || spell.stoneskin || spell.spike || spell.reraise || spell.bar || spell.enspell);
}

/**
 * Statuses this job can put on an ally, main then sub.
 * A collapsed Protect, Shell, Regen, or Reraise is one status.
 * The rest keep the spell or ability name.
 */
export function gambitBuffChoices(job: JobId, sub: JobId | null, levels?: Partial<Record<JobId, number>>): { id: string; label: string }[] {
  const lv: Partial<Record<JobId, number>> = levels ? { ...levels } : { [job]: LEVEL };
  if (!levels && sub && sub !== job) lv[sub] = subjobLevel(LEVEL);
  const seen = new Set<string>();
  const out: { id: string; label: string }[] = [];
  const push = (id: string) => {
    if (!id || seen.has(id)) return;
    seen.add(id);
    out.push({ id, label: id });
  };
  const takeAbility = (row: { name: string; level: number; access: string; merit?: boolean }, asSub: boolean) => {
    if (row.merit) return;
    const lasting = (ABILITY_ROWS.find((ability) => ability.name === row.name)?.duration ?? 0) > 0 || row.name === "Hide";
    if (!lasting) return;
    const level = lv[asSub ? (sub as JobId) : job] ?? 0;
    if (row.level > level) return;
    if (asSub && row.access !== "sub") return;
    push(row.name);
  };
  for (const row of abilityBook(job)) takeAbility(row, false);
  if (sub && sub !== job) for (const row of abilityBook(sub)) takeAbility(row, true);
  for (const spell of spellsKnown(lv)) {
    if (!spellGrantsBuff(spell)) continue;
    if (spell.barrier) push(spell.barrier.kind === "protect" ? "Protect" : "Shell");
    else if (spell.regen) push("Regen");
    else if (spell.reraise) push("Reraise");
    else if (spell.nin?.kind === "shadow") push("Copy Image");
    else if (spell.nin?.kind === "invisible") push("Invisible");
    else if (spell.nin?.kind === "sneak") push("Sneak");
    else push(spell.name);
  }
  return out;
}

/** One status covers every tier that lands as that family. Dia does not cover Bio. */
const DEBUFF_ALIASES: Record<string, readonly string[]> = {
  Blind: ["Blind", "Blind II"],
  Sleep: ["Sleep", "Sleep II", "Sleepga", "Sleepga II", "Repose"],
  Poison: ["Poison", "Poison II", "Poisonga"],
  Dia: ["Dia", "Dia II", "Dia III", "Diaga"],
  Bio: ["Bio", "Bio II", "Bio III"],
  Slow: ["Slow", "Slow II"],
  Paralyze: ["Paralyze", "Paralyze II"],
};

const SPELL_DEBUFF: Record<string, string> = {};
for (const [id, names] of Object.entries(DEBUFF_ALIASES)) {
  for (const name of names) SPELL_DEBUFF[name] = id;
}

/** Job abilities that leave a status the yard actually stores. */
const ABILITY_DEBUFF: Record<string, string> = {
  "Shield Bash": "Stun",
  Shadowbind: "Bind",
  Quickstep: "Lethargic Daze",
  "Box Step": "Sluggish Daze",
  "Stutter Step": "Weakened Daze",
  "Violent Flourish": "Stun",
  "Desperate Flourish": "Gravity",
};

/**
 * Weapon skills whose additional effect is stored on the hare.
 * Dagger jobs share Wasp Sting and Shadowstitch. The great katana line
 * is Samurai. Gekko's catalog row has no level; retail is 65.
 * Ageha is 80, past this kit's cap, so a level-75 Samurai does not list it.
 */
const WS_DEBUFFS: readonly { status: string; level: number; jobs: readonly JobId[]; mainOnly?: boolean }[] = [
  { status: "Poison", level: 3, jobs: ["WAR", "RDM", "THF", "PLD", "DRK", "BST", "BRD", "RNG", "NIN", "BLM", "SAM", "DRG", "SMN", "DNC"] },
  { status: "Bind", level: 24, jobs: ["WAR", "RDM", "THF", "PLD", "DRK", "BST", "BRD", "RNG", "NIN", "BLM", "SAM", "DRG", "SMN", "DNC"] },
  { status: "Stun", level: 9, jobs: ["SAM", "NIN"] },
  { status: "Blind", level: 60, jobs: ["SAM"], mainOnly: true },
  { status: "Silence", level: 65, jobs: ["SAM"], mainOnly: true },
  { status: "Paralyze", level: 71, jobs: ["SAM"], mainOnly: true },
  { status: "Defense Down", level: 80, jobs: ["SAM", "NIN"] },
];

function debuffIdOfSpell(spell: Spell): string | null {
  if (spell.colure?.side === "geo" && !geoAllies(spell.colure.effect)) return spell.name;
  if (spell.song?.hostile) {
    if (spell.song.family === "finale") return null;
    if (spell.song.family === "lullaby") return "Lullaby";
    if (spell.song.family === "elegy") return "Elegy";
    if (spell.song.family === "requiem") return "Requiem";
    if (spell.song.family === "threnody") return "Threnody";
    if (spell.song.family === "virelai") return "Charmed";
    return spell.name;
  }
  if (spell.nin?.kind === "blind") return "Blind";
  if (spell.nin?.kind === "slow") return "Slow";
  if (spell.nin?.kind === "poison") return "Poison";
  if (spell.nin?.kind === "paralyze") return "Paralyze";
  if (spell.enfeeble && spell.enfeeble !== "Dispel") return SPELL_DEBUFF[spell.enfeeble] ?? spell.enfeeble;
  if (spell.debuff) return spell.debuff;
  if (spell.helix) return "Helix";
  if (spell.flash) return "Flash";
  if (spell.repose) return "Sleep";
  return null;
}

function foeHasDebuff(names: readonly string[] | undefined, id: string): boolean {
  if (!id || !names?.length) return false;
  const aliases = DEBUFF_ALIASES[id] ?? [id];
  return names.some((name) => aliases.includes(name));
}

/**
 * Statuses this job can put on an enemy, main then sub.
 * A collapsed Blind, Sleep, Poison, Dia, Bio, Slow, or Paralyze is one status.
 * Dispel removes a buff and is not listed. Weapon skills are included only
 * when that job can use them at its level and the yard stores the status.
 */
export function gambitDebuffChoices(job: JobId, sub: JobId | null, levels?: Partial<Record<JobId, number>>): { id: string; label: string }[] {
  const lv: Partial<Record<JobId, number>> = levels ? { ...levels } : { [job]: LEVEL };
  if (!levels && sub && sub !== job) lv[sub] = subjobLevel(LEVEL);
  const seen = new Set<string>();
  const out: { id: string; label: string }[] = [];
  const push = (id: string) => {
    if (!id || seen.has(id)) return;
    seen.add(id);
    out.push({ id, label: id });
  };
  for (const spell of spellsKnown(lv)) {
    const id = debuffIdOfSpell(spell);
    if (id) push(id);
  }
  const takeAbility = (row: { name: string; level: number; access: string; merit?: boolean }, asSub: boolean) => {
    const status = ABILITY_DEBUFF[row.name];
    if (!status || row.merit) return;
    const level = lv[asSub ? (sub as JobId) : job] ?? 0;
    if (row.level > level) return;
    if (asSub && row.access !== "sub") return;
    push(status);
  };
  for (const row of abilityBook(job)) takeAbility(row, false);
  if (sub && sub !== job) for (const row of abilityBook(sub)) takeAbility(row, true);
  for (const row of WS_DEBUFFS) {
    const main = lv[job] ?? 0;
    if (row.jobs.includes(job) && main >= row.level) {
      push(row.status);
      continue;
    }
    if (row.mainOnly || !sub || sub === job) continue;
    if (row.jobs.includes(sub) && (lv[sub] ?? 0) >= row.level) push(row.status);
  }
  return out;
}

function listedAbility(actor: GambitActor, id: string): HotAction | null {
  const groups = hotbarGroups(actor.skillName, actor.skill, actor.weaponName, actor.job, actor.sub);
  for (const title of ["Abilities", "Blood Pacts"]) {
    const hit = groups.find((group) => group.title === title)?.actions.find((action) => action.id === id);
    if (hit) return hit;
  }
  return null;
}

function allyRatio(ally: GambitAlly): number {
  if (ally.ko) return 0;
  if (ally.maxHp <= 0) return 1;
  return ally.hp / ally.maxHp;
}

function subjectRatio(subject: Subject): number {
  if (subject.kind === "foe") return subject.foe.ko ? 0 : subject.foe.hpRatio;
  return allyRatio(subject.ally);
}

function subjectKo(subject: Subject): boolean {
  return subject.kind === "foe" ? subject.foe.ko : subject.ally.ko;
}

function foeCountOf(actor: GambitActor): number {
  if (actor.foeCount != null) return actor.foeCount;
  return actor.foe?.present ? 1 : 0;
}

function allyBuffs(ally: GambitAlly, actor: GambitActor): readonly GambitBuff[] {
  if (ally.buffs) return ally.buffs;
  if (ally.caster) return actor.buffs;
  return [];
}

function allyMissingBuff(buffs: readonly GambitBuff[], id: string): boolean {
  if (!id) return false;
  if (id.startsWith("Indi-") || id.startsWith("Geo-")) return !buffs.some((buff) => buff.name === id);
  if (id === "Protect" || id === "Shell" || id === "Regen") return !buffs.some((buff) => buff.name === id);
  if (id === "Reraise") return !buffs.some((buff) => buff.name === "Reraise" || buff.name.startsWith("Reraise "));
  if (id === "Copy Image" || id === "Invisible" || id === "Sneak") return !buffs.some((buff) => buff.name === id);
  const spell = spellByName(id);
  if (spell && spellGrantsBuff(spell)) return !buffBlocksSpell(spell, buffs);
  return !buffBlocksAbility(id, buffs);
}

function allyMpRatio(ally: GambitAlly, actor: GambitActor): number | null {
  const maxMp = ally.maxMp ?? (ally.caster ? actor.maxMp : undefined);
  const mp = ally.mp ?? (ally.caster ? actor.mp : undefined);
  if (maxMp == null || mp == null) return null;
  if (maxMp <= 0) return 1;
  return mp / maxMp;
}

function allyTp(ally: GambitAlly, actor: GambitActor): number | null {
  if (ally.tp != null) return ally.tp;
  if (ally.caster) return actor.tp;
  return null;
}

/** Nearest living foe within 10 yalms of the player. A tie keeps the earlier row. */
function closestFoe(actor: GambitActor): GambitFoe | null {
  const rows = actor.foes?.length ? actor.foes : actor.foe ? [actor.foe] : [];
  let best: GambitFoe | null = null;
  let bestYards = Infinity;
  for (const foe of rows) {
    if (!foe.present || foe.ko) continue;
    const yards = foe.playerYards;
    if (yards == null || !Number.isFinite(yards) || yards > GAMBIT_CLOSEST_YARDS) continue;
    if (yards < bestYards) {
      best = foe;
      bestYards = yards;
    }
  }
  return best;
}

function claimedFoe(actor: GambitActor): GambitFoe | null {
  const rows = actor.foes ?? (actor.foe ? [actor.foe] : []);
  let best: GambitFoe | null = null;
  let bestHate = 0;
  for (const foe of rows) {
    if (!foe.present || foe.ko) continue;
    const hate = foe.enmity ?? (foe.claimed === true ? 1 : 0);
    if (hate <= 0) continue;
    if (!best || hate > bestHate) {
      best = foe;
      bestHate = hate;
    }
  }
  return best;
}

function resolveOne(target: GambitSlot["target"], actor: GambitActor, allies: readonly GambitAlly[], hpPct = 50): Subject | null {
  const member = memberOf(target);
  if (member) {
    const ally = allies.find((row) => row.id === member);
    return ally ? { kind: "ally", ally } : null;
  }
  if (target === "foe") {
    if (!actor.targeted || !actor.foe?.present) return null;
    return { kind: "foe", foe: actor.foe };
  }
  if (target === "foe-claimed") {
    const foe = claimedFoe(actor);
    if (!foe) return null;
    return { kind: "foe", foe };
  }
  if (target === "foe-2") {
    if (!actor.foe?.present || actor.foe.ko || foeCountOf(actor) < 2) return null;
    return { kind: "foe", foe: actor.foe };
  }
  if (target === "foe-hp") {
    if (!actor.foe?.present || actor.foe.ko) return null;
    if (actor.foe.hpRatio >= hpPct / 100) return null;
    return { kind: "foe", foe: actor.foe };
  }
  if (target === "foe-closest") {
    const foe = closestFoe(actor);
    if (!foe) return null;
    return { kind: "foe", foe };
  }
  const caster = allies.find((ally) => ally.caster);
  if (!caster) return null;
  return { kind: "ally", ally: caster };
}

function actionReady(actionId: string, actor: GambitActor): boolean {
  if (actionId === "hold" || actionId === "engage" || actionId === "ranged") return true;
  const action = findAction(actionId);
  if (!action) return false;
  if (action.kind === "weaponskill") return true;
  return (actor.recasts[action.name] ?? 0) <= 0;
}

function conditionHolds(slot: GambitSlot, actor: GambitActor, subject: Subject, actionId: string, allies: readonly GambitAlly[] = []): boolean {
  const id = slot.condition;
  if (id === "nothing") return true;
  if (id === "tp-1000") return actor.tp >= 1000;
  if (id === "tp-over") return actor.tp > 1000;
  if (id === "tp-under") return actor.tp < 1000;
  if (id === "ready") return actionReady(actionId, actor);
  if (id === "ko") return subjectKo(subject);
  if (id === "ally-hp") {
    if (subject.kind !== "ally") return false;
    return subjectRatio(subject) < clampGambitHp(slot.hpPct) / 100;
  }
  if (id === "ally-hp-over") {
    if (subject.kind !== "ally") return false;
    return subjectRatio(subject) > clampGambitHp(slot.hpPct) / 100;
  }
  if (id === "ally-mp-under" || id === "ally-mp-over") {
    if (subject.kind !== "ally") return false;
    const ratio = allyMpRatio(subject.ally, actor);
    if (ratio == null) return false;
    const line = clampGambitHp(slot.hpPct) / 100;
    return id === "ally-mp-under" ? ratio < line : ratio > line;
  }
  if (id === "self-mp-under" || id === "self-mp-over") {
    if (actor.maxMp == null) return false;
    const ratio = actor.maxMp <= 0 ? 1 : actor.mp / actor.maxMp;
    const line = clampGambitHp(slot.hpPct) / 100;
    return id === "self-mp-under" ? ratio < line : ratio > line;
  }
  if (id === "self-buff") {
    if (actor.ko || !slot.buff) return false;
    return allyMissingBuff(actor.buffs, slot.buff);
  }
  if (id === "ally-buff") {
    const buff = slot.buff;
    if (!buff) return false;
    if (subject.kind === "ally") {
      if (subject.ally.ko) return false;
      return allyMissingBuff(allyBuffs(subject.ally, actor), buff);
    }
    // Foe: Claimed still means "someone in the party is missing it."
    return allies.some((ally) => !ally.ko && allyMissingBuff(allyBuffs(ally, actor), buff));
  }
  if (id === "foe-debuff") {
    if (subject.kind !== "foe" || subject.foe.ko || !slot.buff) return false;
    return !foeHasDebuff(subject.foe.debuffs, slot.buff);
  }
  if (id === "foe-hp-under" || id === "foe-hp-over") {
    if (subject.kind !== "foe" || subject.foe.ko || !subject.foe.present) return false;
    const line = clampGambitHp(slot.hpPct) / 100;
    return id === "foe-hp-under" ? subject.foe.hpRatio < line : subject.foe.hpRatio > line;
  }
  if (id === "ally-tp-over") {
    if (subject.kind === "ally") {
      if (subject.ally.ko) return false;
      const tp = allyTp(subject.ally, actor);
      return tp != null && tp > 1000;
    }
    return allies.some((ally) => !ally.ko && (allyTp(ally, actor) ?? 0) > 1000);
  }
  if (id === "sc-light") return actor.skillchain === "Light";
  if (id === "sc-ready") {
    if (subject.kind !== "foe" || subject.foe.ko || !slot.buff || !READY_IDS.has(slot.buff)) return false;
    return subject.foe.resonance?.includes(slot.buff) === true;
  }
  return false;
}

/** Same status, or the same family at an equal or higher tier, is already up. */
export function buffBlocksSpell(spell: Spell, buffs: readonly GambitBuff[]): boolean {
  const named = (name: string) => buffs.some((buff) => buff.name === name);
  if (spell.colure) return named(spell.name);
  if (spell.stoneskin) return named("Stoneskin");
  if (spell.blink) return named("Blink");
  if (spell.phalanx) return named("Phalanx");
  if (spell.reprisal) return named("Reprisal") || buffs.some((buff) => buff.name === "Blaze Spikes" || buff.name === "Ice Spikes" || buff.name === "Shock Spikes");
  if (spell.aquaveil) return named("Aquaveil");
  if (spell.haste) return named("Haste");
  if (spell.refresh) return named("Refresh");
  if (spell.auspice) return named("Auspice");
  if (spell.spike) return named(spell.spike);
  if (spell.reraise) return named(spell.reraise);
  if (spell.bar) return named(spell.name);
  if (spell.barrier) {
    const status = spell.barrier.kind === "protect" ? "Protect" : "Shell";
    const current = buffs.find((buff) => buff.name === status);
    return current != null && spell.barrier.tier <= (current.tier ?? 1);
  }
  if (spell.regen) {
    const current = buffs.find((buff) => buff.name === "Regen");
    return current != null && spell.regen.tier <= (current.tier ?? 1);
  }
  if (spell.enspell) {
    if (named(spell.name)) return true;
    return buffs.some((buff) => buff.enspell != null && buff.enspell.element === spell.enspell!.element && buff.enspell.tier >= spell.enspell!.tier);
  }
  return false;
}

function buffBlocksAbility(name: string, buffs: readonly GambitBuff[]): boolean {
  if (name === "Hide") return buffs.some((buff) => buff.name === "Hide");
  const row = ABILITY_ROWS.find((ability) => ability.name === name);
  if (!row || row.duration <= 0) return false;
  return buffs.some((buff) => buff.name === name);
}

function weaponSkillOf(action: HotAction) {
  const name = action.name;
  if (action.weapon === "Great Axe") return greatAxeByName(name);
  if (action.weapon === "Great Sword") return greatSwordByName(name);
  if (action.weapon === "Hand-to-Hand") return handByName(name);
  if (action.weapon === "Dagger") return daggerByName(name);
  if (action.weapon === "Axe") return axeByName(name);
  if (action.weapon === "Staff") return staffByName(name);
  if (action.weapon === "Club") return clubByName(name);
  if (action.weapon === "Scythe") return scytheByName(name);
  if (action.weapon === "Polearm") return polearmByName(name);
  if (action.weapon === "Katana") return katanaByName(name);
  if (action.weapon === "Great Katana") return greatKatanaByName(name);
  if (action.weapon === "Archery") return archeryByName(name);
  if (action.weapon === "Marksmanship") return marksmanshipByName(name);
  return swordByName(name);
}

function wsIsSelf(action: HotAction): boolean {
  return weaponSkillOf(action)?.self === true;
}

/** A trust passes job levels. A weapon skill above that job level does not fire. The player does not pass levels. */
function wsLevelOk(action: HotAction, actor: GambitActor): boolean {
  if (!actor.levels) return true;
  const found = weaponSkillOf(action);
  const cap = actor.levels[actor.job] ?? 0;
  return found == null || found.level == null || found.level <= cap;
}

function spellAimFor(spell: Spell, actor: GambitActor, subject: Subject): "self" | "enemy" | null {
  if (spell.colure?.side === "geo" && geoAllies(spell.colure.effect) && subject.kind === "ally") {
    if (subject.ally.ko) return null;
    return "self";
  }
  const focus = subject.kind === "foe" ? "enemy" : "self";
  const undead = subject.kind === "foe" && subject.foe.undead === true;
  const dead = subject.kind === "ally" && subject.ally.ko;
  const aim = spellAim(spell, focus, undead, dead);
  if (!aim) return null;
  if (aim === "enemy") {
    if (subject.kind !== "foe" || subject.foe.ko) return null;
    return "enemy";
  }
  if (subject.kind !== "ally") {
    // A self spell still lands on the caster when the row named a foe. Cure does not.
    if (subject.kind === "foe" && spell.self === true) return "self";
    return null;
  }
  if (spell.raise) return subject.ally.ko ? "self" : null;
  if (subject.ally.ko) return null;
  if (spell.cure && !subject.ally.caster && !actor.cureParty) return null;
  return "self";
}

function foeAbilityDistance(name: string, actor: GambitActor, subject: Subject): number {
  if ((name === "Charm" || name === "Tame" || name === "Gauge") && subject.kind === "foe") {
    const yards = subject.foe.yards;
    if (yards != null && Number.isFinite(yards)) return yards;
  }
  return actor.distance;
}

function foeMark(subject: Subject): string | null {
  return subject.kind === "foe" ? subject.foe.id ?? null : null;
}

function act(actionId: string, aim: "self" | "enemy", subject: Subject): GambitHit {
  return { kind: "act", actionId, aim, targetId: subject.kind === "ally" ? subject.ally.id : null, foeId: foeMark(subject) };
}

/** True when this action can land on a foe. A self spell or job ability cannot. */
function canAimFoe(actionId: string, foe: GambitFoe): boolean {
  if (actionId === "engage" || actionId === "ranged") return true;
  if (actionId === "hold") return true;
  const action = findAction(actionId);
  if (!action) return false;
  if (action.kind === "spell") {
    const spell = spellByName(action.name);
    return spell != null && spellAim(spell, "enemy", foe.undead === true, false) === "enemy";
  }
  if (action.kind === "weaponskill") return !wsIsSelf(action);
  if (action.id.startsWith("pact:")) {
    const shown = PACT_SHOW[action.name];
    return shown?.at !== "player";
  }
  return Object.prototype.hasOwnProperty.call(FOE_ABILITY_RANGE, action.name);
}

/** A foe-claimed row that cannot hit the foe lands on the caster. The player's distance follows that foe. */
function prepareClaim(slot: GambitSlot, actor: GambitActor, allies: readonly GambitAlly[], subject: Subject): { actor: GambitActor; subject: Subject } {
  if (slot.target !== "foe-claimed" || subject.kind !== "foe") return { actor, subject };
  if (!canAimFoe(slot.action, subject.foe)) {
    const caster = allies.find((ally) => ally.caster && !ally.ko);
    if (caster) return { actor, subject: { kind: "ally", ally: caster } };
  }
  const yards = subject.foe.yards;
  if (yards != null && Number.isFinite(yards)) {
    return { actor: { ...actor, distance: yards, inRange: yards <= autoAttackRange(actor.skillName) }, subject };
  }
  if (actor.partyRange != null) return { actor, subject };
  const fromPlayer = subject.foe.playerYards;
  if (fromPlayer == null || !Number.isFinite(fromPlayer)) return { actor, subject };
  return { actor: { ...actor, distance: fromPlayer, inRange: fromPlayer <= autoAttackRange(actor.skillName) }, subject };
}

function usable(actionId: string, actor: GambitActor, subject: Subject, allies: readonly GambitAlly[]): GambitHit | null {
  if (actionId === "hold") return { kind: "hold" };
  if (actionId === "engage") {
    if (actor.ko || actor.engaged) return null;
    if (subject.kind === "foe" && (subject.foe.ko || !subject.foe.present)) return null;
    return { kind: "act", actionId: "engage", aim: "enemy", targetId: null, foeId: foeMark(subject) };
  }
  if (actionId === "ranged") {
    // Trusts pass a weapon list. They do not loose a shot.
    if (actor.ko || actor.arms) return null;
    if (subject.kind !== "foe" || subject.foe.ko) return null;
    if (actor.distance > 25) return null;
    return { kind: "act", actionId: "ranged", aim: "enemy", targetId: null, foeId: foeMark(subject) };
  }
  const action = findAction(actionId);
  if (!action) return null;
  if (action.kind === "spell") {
    const allowed = actor.knownSpells ? actor.knownSpells.includes(action.name) : (GAMBIT_SPELL_NAMES as readonly string[]).includes(action.name);
    if (!allowed) return null;
    const spell = spellByName(action.name);
    if (!spell || spell.recast == null || spell.recast <= 0) return null;
    if (!spellUnlocked(spell, jobLevels(actor))) return null;
    if ((actor.recasts[spell.name] ?? 0) > 0) return null;
    const aim = spellAimFor(spell, actor, subject);
    if (!aim) return null;
    const wards = subject.kind === "ally" ? (subject.ally.buffs ?? actor.buffs) : actor.buffs;
    if (buffBlocksSpell(spell, wards)) return null;
    if (subject.kind === "ally" && !subject.ally.caster) {
      const yards = subject.ally.yards ?? actor.partyRange;
      const limit = spell.radius ?? spell.range;
      if (yards != null && limit != null && yards > limit) return null;
    }
    if (aim === "enemy" && spell.range != null && actor.distance > spell.range) return null;
    const mainLevel = actor.levels?.[actor.job] ?? LEVEL;
    const subLevel = actor.sub ? actor.levels?.[actor.sub] ?? subjobLevel(LEVEL) : 0;
    const scholar = scholarCastAdjust(
      spell,
      actor.buffs,
      actor.manafont ? 0 : (spell.mp ?? 0),
      spell.cast ?? 0,
      spell.recast,
      actor.job,
      actor.sub,
      mainLevel,
      subLevel,
    );
    if (scholar.block) return null;
    if (actor.mp < scholar.cost) return null;
    return act(action.id, aim, subject);
  }
  if (action.kind === "weaponskill" && (action.weapon === "Archery" || action.weapon === "Marksmanship")) {
    if (actor.ko) return null;
    const held = actor.arms?.some((arm) => arm.skillName === action.weapon) === true;
    if (!held && canUse(action, actor.skillName, actor.skill, actor.weaponName, actor.job, actor.range ?? null, actor.sub)) return null;
    if (actor.arms && !held) return null;
    if (!wsLevelOk(action, actor)) return null;
    if (actor.tp < 1000) return null;
    if (subject.kind !== "foe" || subject.foe.ko) return null;
    if (actor.distance > 25) return null;
    return act(action.id, "enemy", subject);
  }
  if (action.kind === "weaponskill") {
    if (actor.arms) {
      if (!actor.arms.some((arm) => arm.skillName === action.weapon)) return null;
    } else if (canUse(action, actor.skillName, actor.skill, actor.weaponName, actor.job, null, actor.sub)) return null;
    if (!wsLevelOk(action, actor)) return null;
    if (actor.tp < 1000) return null;
    if (wsIsSelf(action)) {
      if (subject.kind !== "ally" || !subject.ally.caster) return null;
      return act(action.id, "self", subject);
    }
    if (subject.kind !== "foe" || !actor.inRange) return null;
    return act(action.id, "enemy", subject);
  }
  if (action.kind !== "ability") return null;
  if (action.id.startsWith("pact:")) {
    const pact = pactByName(action.name);
    if (!pact || pact.merit || !listedAbility(actor, action.id)) return null;
    if (actor.avatarName !== undefined && actor.avatarName !== pact.avatar) return null;
    if ((actor.recasts[action.id] ?? 0) > 0) return null;
    if (actor.mp < pactMp(pact, LEVEL)) return null;
    const onYou = PACT_SHOW[pact.name]?.at === "player";
    if (onYou) {
      if (subject.kind === "foe") return null;
      return act(action.id, "self", subject);
    }
    if (subject.kind !== "foe" || subject.foe.ko) return null;
    return act(action.id, "enemy", subject);
  }
  if (!abilityKnown(actor, action.name)) return null;
  if (!listedAbility(actor, action.id)) return null;
  if ((actor.recasts[action.name] ?? 0) > 0) return null;
  if (buffBlocksAbility(action.name, actor.buffs)) return null;
  if (actor.petCalls === false && PET_CALLS.has(action.name)) return null;
  if (actor.ability?.charmBlocked && (action.name === "Charm" || action.name === "Tame")) return null;
  if (NEEDS_OTHER_MEMBER.has(action.name)) {
    const chosen = subject.kind === "ally" && !subject.ally.caster && !subject.ally.ko
      ? subject.ally
      : allies.find((ally) => !ally.caster && !ally.ko);
    if (!chosen) return null;
    const yards = chosen.yards ?? actor.partyRange ?? 99;
    if (yards > HATE_STEAL_RANGE) return null;
    if (actor.distance > HATE_STEAL_MOB) return null;
    return { kind: "act", actionId: action.id, aim: "self", targetId: chosen.id };
  }
  const waltz = isWaltz(action.name);
  const foeDist = foeAbilityDistance(action.name, actor, subject);
  if (Object.prototype.hasOwnProperty.call(FOE_ABILITY_RANGE, action.name)) {
    if (subject.kind !== "foe") return null;
    const range = FOE_ABILITY_RANGE[action.name];
    if (range != null && foeDist > range) return null;
  } else if (waltz) {
    if (subject.kind !== "ally" || subject.ally.ko) return null;
  } else if (subject.kind !== "ally" || !subject.ally.caster) {
    return null;
  }
  const dazeName = STEP_DAZE[action.name];
  const daze = dazeName ? actor.stepRows?.find((row) => row.name === dazeName) : undefined;
  const waltzAlly = waltz && subject.kind === "ally" && !subject.ally.caster;
  const result = tryAbility(action.name, {
    ...actor.ability,
    recastLeft: actor.recasts[action.name] ?? 0,
    targeted: subject.kind === "foe",
    distance: waltz && subject.kind === "ally" ? (subject.ally.caster ? 0 : subject.ally.yards ?? actor.partyRange ?? 99) : foeDist,
    mp: actor.mp,
    delay: actor.delay,
    vit: actor.vit,
    mnd: actor.mnd,
    maxHp: actor.maxHp,
    monkLevel: actor.monkLevel,
    monkMain: actor.monkMain,
    shield: actor.shield,
    pldLevel: actor.pldLevel,
    pldMain: actor.pldMain,
    hp: actor.hp,
    ninLevel: actor.ninLevel,
    ninMain: actor.ninMain,
    brdMain: actor.brdMain,
    drkLevel: actor.drkLevel,
    drkMain: actor.drkMain,
    bluLevel: actor.bluLevel,
    bluMain: actor.bluMain,
    pupLevel: actor.pupLevel,
    pupMain: actor.pupMain,
    twoHand: actor.twoHand,
    tp: actor.tp,
    ...(daze ? { dazeLevel: daze.power ?? 0, dazeLeft: daze.left ?? 0 } : {}),
    ...(waltz ? { waltzAlly, waltzCenter: subject.kind === "ally" ? subject.ally.id : "self" } : {}),
  });
  if (!result.ok) return null;
  return { kind: "act", actionId: action.id, aim: subject.kind === "foe" ? "enemy" : "self", targetId: subject.kind === "ally" ? subject.ally.id : null, foeId: foeMark(subject) };
}

/** The yard's one foe, when it is up. A downed foe is not invented back to life. No foe at all still counts as the training target. */
function livingYardFoe(actor: GambitActor): GambitFoe | null {
  if (actor.foe && (!actor.foe.present || actor.foe.ko)) return null;
  if (actor.foe?.present) return actor.foe;
  return { present: true, hpRatio: 1, ko: false, undead: false };
}

function matchSlot(slot: GambitSlot, actor: GambitActor, allies: readonly GambitAlly[]): GambitHit | null {
  if (!slot.target || !slot.condition || !slot.action) return null;
  const hpPct = clampGambitHp(slot.hpPct);
  if (slot.target === "ally-any") {
    for (const ally of allies) {
      const subject: Subject = { kind: "ally", ally };
      if (!conditionHolds(slot, actor, subject, slot.action, allies)) continue;
      const hit = usable(slot.action, actor, subject, allies);
      if (hit) return hit;
    }
    return null;
  }
  if (slot.action === "engage") {
    const foe = livingYardFoe(actor);
    if (slot.target === "foe" && !foe) return null;
    const subject = slot.target === "foe" && foe ? ({ kind: "foe", foe } as const) : resolveOne(slot.target, actor, allies, hpPct);
    if (!subject) return null;
    if (!conditionHolds(slot, actor, subject, slot.action, allies)) return null;
    const placed = prepareClaim(slot, actor, allies, subject);
    return usable(slot.action, placed.actor, placed.subject, allies);
  }
  const subject = resolveOne(slot.target, actor, allies, hpPct);
  if (!subject) return null;
  if (!conditionHolds(slot, actor, subject, slot.action, allies)) return null;
  const placed = prepareClaim(slot, actor, allies, subject);
  return usable(slot.action, placed.actor, placed.subject, allies);
}

/**
 * First slot that matches and can be used.
 * A board that is off never matches, so combat stays as it is.
 */
export function scanGambit(board: GambitBoard, actor: GambitActor, allies: readonly GambitAlly[]): GambitHit | null {
  if (!board.on) return null;
  for (const slot of board.slots) {
    const hit = matchSlot(slot, actor, allies);
    if (hit) return hit;
  }
  return null;
}

function nearEnough(actor: GambitActor, subject: Subject, allies: readonly GambitAlly[]): { actor: GambitActor; subject: Subject; allies: GambitAlly[] } {
  return {
    actor: { ...actor, distance: 0, inRange: true, partyRange: 0 },
    subject: subject.kind === "ally" ? { kind: "ally", ally: { ...subject.ally, yards: 0 } } : subject,
    allies: allies.map((ally) => ({ ...ally, yards: 0 })),
  };
}

/** How close this action has to be, when distance is the only thing stopping it. */
function approachReach(actionId: string, actor: GambitActor, subject: Subject): GambitApproach | null {
  const foeId = subject.kind === "foe" ? subject.foe.id ?? null : null;
  if (actionId === "ranged") return { toward: "foe", yards: 25, foeId };
  const action = findAction(actionId);
  if (!action) return null;
  if (action.kind === "spell") {
    const spell = spellByName(action.name);
    const limit = spell ? spell.radius ?? spell.range : null;
    if (limit == null) return null;
    if (subject.kind === "foe") return { toward: "foe", yards: limit, foeId };
    if (!subject.ally.caster) return { toward: subject.ally.id, yards: limit };
    return null;
  }
  if (action.kind === "weaponskill") {
    if (wsIsSelf(action)) return null;
    if (action.weapon === "Archery" || action.weapon === "Marksmanship") return { toward: "foe", yards: 25, foeId };
    return { toward: "foe", yards: autoAttackRange(actor.skillName), foeId };
  }
  if (action.kind === "ability" && Object.prototype.hasOwnProperty.call(FOE_ABILITY_RANGE, action.name)) {
    const range = FOE_ABILITY_RANGE[action.name];
    if (range == null) return null;
    return { toward: "foe", yards: range, foeId };
  }
  return null;
}

function yardsApart(actor: GambitActor, subject: Subject, toward: string, actionId: string): number {
  if (toward === "foe") {
    const action = findAction(actionId);
    if (action) return foeAbilityDistance(action.name, actor, subject);
    return actor.distance;
  }
  if (subject.kind === "ally") return subject.ally.yards ?? actor.partyRange ?? 99;
  return actor.distance;
}

/** Ready except for range. Null when it can already be used, or it cannot be used up close either. */
function approachFor(actionId: string, actor: GambitActor, subject: Subject, allies: readonly GambitAlly[]): GambitApproach | null {
  if (actionId === "hold" || actionId === "engage") return null;
  if (usable(actionId, actor, subject, allies)) return null;
  const reach = approachReach(actionId, actor, subject);
  if (!reach) return null;
  if (yardsApart(actor, subject, reach.toward, actionId) <= reach.yards) return null;
  const near = nearEnough(actor, subject, allies);
  const hit = usable(actionId, near.actor, near.subject, near.allies);
  if (!hit || hit.kind !== "act") return null;
  return reach;
}

function approachSlot(slot: GambitSlot, actor: GambitActor, allies: readonly GambitAlly[]): GambitApproach | "act" | null {
  if (!slot.target || !slot.condition || !slot.action) return null;
  const hpPct = clampGambitHp(slot.hpPct);
  if (slot.target === "ally-any") {
    let gap: GambitApproach | null = null;
    for (const ally of allies) {
      const subject: Subject = { kind: "ally", ally };
      if (!conditionHolds(slot, actor, subject, slot.action, allies)) continue;
      if (usable(slot.action, actor, subject, allies)) return "act";
      if (!gap) gap = approachFor(slot.action, actor, subject, allies);
    }
    return gap;
  }
  const foe = livingYardFoe(actor);
  const subject = slot.action === "engage" && slot.target === "foe"
    ? foe ? ({ kind: "foe", foe } as const) : null
    : resolveOne(slot.target, actor, allies, hpPct);
  if (!subject) return null;
  if (!conditionHolds(slot, actor, subject, slot.action, allies)) return null;
  const placed = prepareClaim(slot, actor, allies, subject);
  if (usable(slot.action, placed.actor, placed.subject, allies)) return "act";
  if (placed.subject.kind === "ally" && !placed.subject.ally.caster) return approachFor(slot.action, placed.actor, placed.subject, allies);
  if (placed.subject.kind !== "foe") return null;
  return approachFor(slot.action, placed.actor, placed.subject, allies);
}

/**
 * The first gambit that matches and is ready, except it is out of range.
 * Null when an earlier row can already be used, so that row fires instead.
 * The trust walks to `yards` of `toward` and then the row can fire.
 */
export function gambitApproach(board: GambitBoard, actor: GambitActor, allies: readonly GambitAlly[]): GambitApproach | null {
  if (!board.on) return null;
  for (const slot of board.slots) {
    const found = approachSlot(slot, actor, allies);
    if (found === "act") return null;
    if (found) return found;
  }
  return null;
}

/**
 * Yalms to the foe. 99 means the yard has not placed the trust yet, so she
 * is still standing with the player and uses that distance instead.
 */
export function gambitDistance(reported: number, alongside: number): number {
  if (Number.isFinite(reported) && reported < 90) return reported;
  return alongside;
}

function actorOf(patch: Partial<GambitActor>): GambitActor {
  return {
    hp: 1000,
    maxHp: 1000,
    mp: 400,
    tp: 0,
    ko: false,
    targeted: false,
    inRange: false,
    distance: 2,
    manafont: false,
    buffs: [],
    recasts: {},
    job: "WHM",
    sub: null,
    skillName: "Club",
    skill: 200,
    weaponName: "",
    delay: 240,
    vit: 50,
    monkLevel: 0,
    monkMain: false,
    foe: null,
    ...patch,
  };
}

function selfAlly(actor: GambitActor, patch: Partial<GambitAlly> = {}): GambitAlly {
  return { id: GAMBIT_MEMBER, hp: actor.hp, maxHp: actor.maxHp, ko: actor.ko, caster: true, ...patch };
}

function withSlot(slot: GambitSlot, on = true): GambitBoard {
  const board = blankBoard();
  board.on = on;
  board.slots[0] = slot;
  return board;
}

export function assertGambits(): void {
  const empty = blankBoard();
  if (empty.on || empty.slots.length !== GAMBIT_SLOT_COUNT) throw new Error("board starts off with 8 slots");
  if (GAMBIT_TARGETS.map((row) => row.id).join() !== "self,ally-any,foe,foe-claimed,foe-2,foe-hp,foe-closest") throw new Error("gambit targets");
  if (GAMBIT_CONDITIONS.map((row) => row.id).join() !== "nothing,self-buff,self-mp-under,self-mp-over,ally-hp,ally-hp-over,ally-mp-under,ally-mp-over,ally-buff,ally-tp-over,foe-debuff,foe-hp-under,foe-hp-over,ko,tp-1000,tp-over,tp-under,ready,sc-light,sc-ready") throw new Error("gambit conditions");
  if (GAMBIT_READY_CHAINS.join() !== "Transfixion,Compression,Liquefaction,Scission,Reverberation,Detonation,Induration,Impaction,Fusion,Fragmentation,Distortion,Gravitation,Radiance,Umbra") {
    throw new Error("skillchain ready omits light and darkness");
  }
  if (GAMBIT_CLOSEST_YARDS !== 10) throw new Error("closest is 10 yalms");
  if (GAMBIT_SPELL_NAMES.join() !== "Cure,Raise,Holy") throw new Error("gambit spells");
  const book = blankBook();
  if (book[GAMBIT_MEMBER]?.on !== false) throw new Error("the player board starts off");

  const whm = actorOf({ hp: 400, maxHp: 1000, job: "WHM" });
  const cure = scanGambit(withSlot({ target: "self", condition: "ally-hp", hpPct: 50, action: "spell:cure" }), whm, [selfAlly(whm)]);
  if (!cure || cure.kind !== "act" || cure.actionId !== "spell:cure" || cure.aim !== "self") throw new Error("cure under half");
  const healthy = actorOf({ hp: 600, maxHp: 1000, job: "WHM" });
  if (scanGambit(withSlot({ target: "self", condition: "ally-hp", hpPct: 50, action: "spell:cure" }), healthy, [selfAlly(healthy)])) {
    throw new Error("half full does not cure");
  }
  const exact = actorOf({ hp: 500, maxHp: 1000, job: "WHM" });
  if (scanGambit(withSlot({ target: "self", condition: "ally-hp", hpPct: 50, action: "spell:cure" }), exact, [selfAlly(exact)])) {
    throw new Error("half exactly is not under");
  }
  const underHalf = actorOf({ hp: 400, maxHp: 1000, job: "WHM" });
  if (scanGambit(withSlot({ target: "self", condition: "ally-hp", hpPct: 30, action: "spell:cure" }), underHalf, [selfAlly(underHalf)])) {
    throw new Error("30 percent is stricter");
  }
  const broke = actorOf({ hp: 100, maxHp: 1000, mp: 7, job: "WHM" });
  const fell = blankBoard();
  fell.on = true;
  fell.slots[0] = { target: "self", condition: "ally-hp", hpPct: 50, action: "spell:cure" };
  fell.slots[1] = { target: "self", condition: "ally-hp", hpPct: 50, action: "hold" };
  const held = scanGambit(fell, broke, [selfAlly(broke)]);
  if (!held || held.kind !== "hold") throw new Error("short MP falls through to Hold");
  const off = scanGambit({ ...fell, on: false }, broke, [selfAlly(broke)]);
  if (off) throw new Error("board off does not scan");

  const war = actorOf({
    job: "WAR",
    skillName: "Sword",
    skill: 200,
    tp: 1000,
    targeted: true,
    inRange: true,
    foe: { present: true, hpRatio: 1, ko: false, undead: HARE.undead },
  });
  const blade = scanGambit(withSlot({ target: "foe", condition: "tp-1000", action: "ws:fast-blade" }), war, [selfAlly(war)]);
  if (!blade || blade.kind !== "act" || blade.actionId !== "ws:fast-blade" || blade.aim !== "enemy") throw new Error("weapon skill at 1000");
  const shortTp = actorOf({ ...war, tp: 999 });
  if (scanGambit(withSlot({ target: "foe", condition: "tp-1000", action: "ws:fast-blade" }), shortTp, [selfAlly(shortTp)])) {
    throw new Error("999 TP does not fire");
  }
  const overTp = actorOf({ ...war, tp: 1001 });
  if (!scanGambit(withSlot({ target: "self", condition: "tp-over", action: "hold" }), overTp, [selfAlly(overTp)])) {
    throw new Error("1001 TP is over");
  }
  if (scanGambit(withSlot({ target: "self", condition: "tp-over", action: "hold" }), war, [selfAlly(war)])) {
    throw new Error("1000 TP is not over");
  }
  if (scanGambit(withSlot({ target: "self", condition: "tp-under", action: "hold" }), shortTp, [selfAlly(shortTp)])?.kind !== "hold") {
    throw new Error("999 TP is under");
  }
  if (scanGambit(withSlot({ target: "self", condition: "tp-under", action: "hold" }), war, [selfAlly(war)])) {
    throw new Error("1000 TP is not under");
  }
  if (scanGambit(withSlot({ target: "self", condition: "tp-under", action: "hold" }), overTp, [selfAlly(overTp)])) {
    throw new Error("1001 TP is not under");
  }
  const far = actorOf({ ...war, inRange: false });
  if (scanGambit(withSlot({ target: "foe", condition: "ready", action: "ws:fast-blade" }), far, [selfAlly(far)])) {
    throw new Error("weapon skill out of range");
  }
  const untargeted = actorOf({ ...war, targeted: false, foe: null });
  if (scanGambit(withSlot({ target: "foe", condition: "tp-1000", action: "ws:fast-blade" }), untargeted, [selfAlly(untargeted)])) {
    throw new Error("no current foe");
  }
  const hareHp = actorOf({ ...war, foe: { present: true, hpRatio: 0.4, ko: false, undead: false }, tp: 0 });
  if (scanGambit(withSlot({ target: "foe-hp", hpPct: 50, condition: "nothing", action: "ws:fast-blade" }), hareHp, [selfAlly(hareHp)])) {
    throw new Error("short TP skips a hurt foe");
  }
  const fullHare = actorOf({ ...war, foe: { present: true, hpRatio: 1, ko: false, undead: false } });
  if (scanGambit(withSlot({ target: "foe-hp", hpPct: 50, condition: "nothing", action: "hold" }), fullHare, [selfAlly(fullHare)])) {
    throw new Error("the hare is not under half");
  }
  const hurtFoe = actorOf({ ...war, tp: 0, foe: { present: true, hpRatio: 0.4, ko: false, undead: false } });
  const closingHurt = scanGambit(withSlot({ target: "foe-hp", hpPct: 50, condition: "nothing", action: "engage" }), hurtFoe, [selfAlly(hurtFoe)]);
  if (!closingHurt || closingHurt.kind !== "act" || closingHurt.actionId !== "engage") throw new Error("a foe under the wheel is engaged");
  const pair = actorOf({ ...war, foeCount: 2, foe: { present: true, hpRatio: 1, ko: false, undead: false } });
  const two = scanGambit(withSlot({ target: "foe-2", condition: "nothing", action: "engage" }), pair, [selfAlly(pair)]);
  if (!two || two.kind !== "act" || two.actionId !== "engage") throw new Error("two foes open the 2+ row");
  if (scanGambit(withSlot({ target: "foe-2", condition: "nothing", action: "engage" }), war, [selfAlly(war)])) {
    throw new Error("one foe is not 2+");
  }

  const berserk = scanGambit(withSlot({ target: "self", condition: "ready", action: "ability:berserk" }), war, [selfAlly(war)]);
  if (!berserk || berserk.kind !== "act" || berserk.actionId !== "ability:berserk") throw new Error("berserk ready");
  const up = actorOf({ ...war, buffs: [{ name: "Berserk" }] });
  const next = blankBoard();
  next.on = true;
  next.slots[0] = { target: "self", condition: "ready", action: "ability:berserk" };
  next.slots[1] = { target: "foe", condition: "tp-1000", action: "ws:fast-blade" };
  const skipped = scanGambit(next, up, [selfAlly(up)]);
  if (!skipped || skipped.kind !== "act" || skipped.actionId !== "ws:fast-blade") throw new Error("buff already up skips");
  const cooling = actorOf({ ...war, recasts: { Berserk: 4 } });
  if (scanGambit(withSlot({ target: "self", condition: "ready", action: "ability:berserk" }), cooling, [selfAlly(cooling)])) {
    throw new Error("recast is not ready");
  }
  const cureFoe = actorOf({ ...whm, targeted: true, foe: { present: true, hpRatio: 0.2, ko: false, undead: false } });
  if (scanGambit(withSlot({ target: "foe", condition: "ally-hp", hpPct: 50, action: "spell:cure" }), cureFoe, [selfAlly(cureFoe)])) {
    throw new Error("cure does not hit a living foe");
  }

  const caster = selfAlly(actorOf({ hp: 900, maxHp: 1000, job: "WHM" }));
  const hurt = { id: "ally", hp: 100, maxHp: 1000, ko: false, caster: false };
  const low = scanGambit(withSlot({ target: "ally-any", condition: "ally-hp", hpPct: 50, action: "spell:cure" }), actorOf({ hp: 900, maxHp: 1000, job: "WHM" }), [caster, hurt]);
  if (low) throw new Error("cure does not land on another ally");
  const anyCaster = actorOf({ hp: 200, maxHp: 1000, job: "WHM" });
  const any = scanGambit(withSlot({ target: "ally-any", condition: "ally-hp", hpPct: 50, action: "spell:cure" }), anyCaster, [hurt, selfAlly(anyCaster)]);
  if (!any || any.kind !== "act" || any.aim !== "self") throw new Error("ally any reaches the caster");

  const dead = { id: "fallen", hp: 0, maxHp: 1000, ko: true, caster: false };
  const raised = scanGambit(withSlot({ target: "ally-any", condition: "ko", action: "spell:raise" }), actorOf({ job: "WHM", mp: 200 }), [selfAlly(actorOf({ job: "WHM" })), dead]);
  if (!raised || raised.kind !== "act" || raised.actionId !== "spell:raise" || raised.aim !== "self") throw new Error("raise on a KO ally");
  const living = scanGambit(withSlot({ target: "self", condition: "ko", action: "spell:raise" }), whm, [selfAlly(whm)]);
  if (living) throw new Error("raise skips the living");
  const blm = actorOf({ job: "BLM", hp: 100, maxHp: 1000, mp: 400, skillName: "Staff" });
  if (scanGambit(withSlot({ target: "self", condition: "ally-hp", hpPct: 50, action: "spell:cure" }), blm, [selfAlly(blm)])) {
    throw new Error("Black Mage has not learned Cure");
  }

  const protect = spellByName("Protect");
  const protectTwo = spellByName("Protect II");
  if (!protect || !protectTwo) throw new Error("protect spells");
  if (!buffBlocksSpell(protect, [{ name: "Protect", tier: 1 }])) throw new Error("same Protect is up");
  if (buffBlocksSpell(protectTwo, [{ name: "Protect", tier: 1 }])) throw new Error("Protect II may replace Protect");
  if (!buffBlocksSpell(protect, [{ name: "Protect", tier: 2 }])) throw new Error("weaker Protect waits");

  const choices = gambitActionGroups({ job: "WHM", sub: null, skillName: "Club", skill: 200, weaponName: "" });
  const labels = choices.flatMap((group) => group.actions.map((action) => action.label));
  if (!labels.includes("Hold") || !labels.includes("Engage") || !labels.includes("Ranged Attack") || !labels.includes("Cure") || !labels.includes("Raise") || !labels.includes("Holy")) throw new Error("starter actions");
  if (labels.some((label) => label === "Attack" || label === "Stone" || label === "Fire")) throw new Error("attack is not a gambit");
  const closing = scanGambit(withSlot({ target: "foe", condition: "ready", action: "engage" }), actorOf({ targeted: false, foe: null, engaged: false, inRange: false }), [selfAlly(actorOf({}))]);
  if (!closing || closing.kind !== "act" || closing.actionId !== "engage") throw new Error("engage closes without a prior target");
  const claimed = actorOf({
    targeted: false,
    engaged: false,
    inRange: false,
    foe: { present: true, hpRatio: 1, ko: false, undead: false, claimed: true },
  });
  const claimLine = scanGambit(withSlot({ target: "foe-claimed", condition: "nothing", action: "engage" }), claimed, [selfAlly(claimed)]);
  if (!claimLine || claimLine.kind !== "act" || claimLine.actionId !== "engage") throw new Error("a claimed foe is engaged");
  const unclaimed = actorOf({
    foe: { present: true, hpRatio: 1, ko: false, undead: false, claimed: false },
  });
  if (scanGambit(withSlot({ target: "foe-claimed", condition: "nothing", action: "engage" }), unclaimed, [selfAlly(unclaimed)])) {
    throw new Error("an unclaimed foe is not engaged");
  }
  const swinging = actorOf({ engaged: true, inRange: true, targeted: true, foe: { present: true, hpRatio: 1, ko: false, undead: false } });
  if (scanGambit(withSlot({ target: "foe", condition: "ready", action: "engage" }), swinging, [selfAlly(swinging)])) {
    throw new Error("engage steps aside once the swing has started");
  }
  const shot = scanGambit(withSlot({ target: "foe-claimed", condition: "nothing", action: "ranged" }), claimed, [selfAlly(claimed)]);
  if (!shot || shot.kind !== "act" || shot.actionId !== "ranged" || shot.aim !== "enemy") throw new Error("ranged attack fires on a claimed foe");
  const shotFar = actorOf({ ...claimed, distance: 26 });
  if (scanGambit(withSlot({ target: "foe-claimed", condition: "nothing", action: "ranged" }), shotFar, [selfAlly(shotFar)])) {
    throw new Error("ranged attack stays inside 25 yalms");
  }
  const shotTrust = actorOf({ ...claimed, arms: [{ skillName: "Club", skill: 10, weaponName: "Club" }] });
  if (scanGambit(withSlot({ target: "foe-claimed", condition: "nothing", action: "ranged" }), shotTrust, [selfAlly(shotTrust)])) {
    throw new Error("a trust does not take the ranged row");
  }
  const shotSelf = scanGambit(withSlot({ target: "self", condition: "nothing", action: "ranged" }), claimed, [selfAlly(claimed)]);
  if (shotSelf) throw new Error("ranged attack needs a foe");
  const resting = actorOf({
    job: "WAR",
    skillName: "Sword",
    skill: 200,
    tp: 1000,
    engaged: false,
    targeted: false,
    inRange: true,
    distance: 2,
    foe: { present: true, hpRatio: 1, ko: false, undead: false, claimed: true },
  });
  const restingWs = scanGambit(withSlot({ target: "foe-claimed", condition: "tp-1000", action: "ws:fast-blade" }), resting, [selfAlly(resting)]);
  if (!restingWs || restingWs.kind !== "act" || restingWs.actionId !== "ws:fast-blade") {
    throw new Error("a weapon skill does not wait to be engaged");
  }
  const restingFar = actorOf({ ...resting, inRange: false });
  if (scanGambit(withSlot({ target: "foe-claimed", condition: "tp-1000", action: "ws:fast-blade" }), restingFar, [selfAlly(restingFar)])) {
    throw new Error("a weapon skill still needs melee range");
  }
  const provoke = scanGambit(withSlot({ target: "foe-claimed", condition: "ready", action: "ability:provoke" }), resting, [selfAlly(resting)]);
  if (!provoke || provoke.kind !== "act" || provoke.actionId !== "ability:provoke") {
    throw new Error("provoke does not wait to be engaged");
  }
  const blmChoices = gambitActionGroups({ job: "BLM", sub: null, skillName: "Staff", skill: 200, weaponName: "" });
  const blmSpells = blmChoices.find((group) => group.title === "Spells")?.actions.map((action) => action.label) ?? [];
  if (!blmSpells.includes("Cure (not learned)") || !blmSpells.includes("Holy (not learned)") || blmSpells.includes("Fire") || blmSpells.includes("Holy")) throw new Error("spell list stays Cure, Raise, and Holy");

  armGambitYield();
  if (!takeGambitYield()) throw new Error("manual command yields one idle scan");
  if (takeGambitYield()) throw new Error("the next idle scan is free");

  const healer = actorOf({ hp: 900, maxHp: 1000, job: "WHM", cureParty: true, levels: { WHM: 75 } });
  const patient = { id: "player", hp: 100, maxHp: 1000, ko: false, caster: false };
  const self = { id: "kupipi", hp: 900, maxHp: 1000, ko: false, caster: true };
  const help = scanGambit(withSlot({ target: "ally-any", condition: "ally-hp", hpPct: 50, action: "spell:cure" }), healer, [self, patient]);
  if (!help || help.kind !== "act" || help.targetId !== "player") throw new Error("trust cure finds the hurt ally");
  const cureFour = actorOf({
    hp: 900,
    maxHp: 1000,
    job: "WHM",
    mp: 400,
    cureParty: true,
    levels: { WHM: 75 },
    knownSpells: ["Cure IV", "Protectra V"],
    partyRange: 2,
    buffs: [{ name: "Protect", tier: 5 }],
  });
  const coveredBoard = withSlot({ target: "ally-any", condition: "nothing", action: "spell:protectra-v" });
  coveredBoard.slots[1] = { target: "ally-any", condition: "ally-hp", hpPct: 80, action: "spell:cure-iv" };
  const healed = scanGambit(coveredBoard, cureFour, [
    { id: "player", hp: 700, maxHp: 1000, ko: false, caster: false, buffs: [{ name: "Protect", tier: 5 }] },
    { id: "kupipi", hp: 900, maxHp: 1000, ko: false, caster: true, buffs: [{ name: "Protect", tier: 5 }] },
  ]);
  if (!healed || healed.kind !== "act" || healed.actionId !== "spell:cure-iv" || healed.targetId !== "player") {
    throw new Error("Cure IV reaches the hurt player once Protect is up");
  }
  const tooFar = scanGambit(withSlot({ target: "ally-any", condition: "ally-hp", hpPct: 80, action: "spell:cure-iv" }), { ...cureFour, partyRange: 25 }, [
    { id: "player", hp: 700, maxHp: 1000, ko: false, caster: false },
    self,
  ]);
  if (tooFar) throw new Error("Cure IV stays in its 20' range");
  const shining = actorOf({
    job: "WHM",
    skillName: "Club",
    skill: 256,
    weaponName: "Ash Club",
    tp: 1000,
    targeted: true,
    inRange: true,
    engaged: true,
    levels: { WHM: 75 },
    arms: [{ skillName: "Club", skill: 300, weaponName: "Ash Club" }],
    foe: { present: true, hpRatio: 1, ko: false, undead: false },
  });
  const strike = scanGambit(withSlot({ target: "foe", condition: "tp-1000", action: "ws:shining-strike" }), shining, [selfAlly(shining)]);
  if (!strike || strike.kind !== "act" || strike.actionId !== "ws:shining-strike") throw new Error("Kupipi shining strike");
  const unlearned = actorOf({ hp: 100, maxHp: 1000, job: "WHM", levels: { WHM: 0 } });
  if (scanGambit(withSlot({ target: "self", condition: "ally-hp", hpPct: 50, action: "spell:cure" }), unlearned, [selfAlly(unlearned)])) {
    throw new Error("a job level of 0 has not learned Cure");
  }

  const lightLine = { target: "foe-claimed" as const, condition: "sc-light" as const, action: "spell:holy" };
  const claimedLight = actorOf({
    job: "WHM",
    mp: 200,
    distance: 12,
    skillchain: "Light",
    engaged: false,
    targeted: false,
    inRange: false,
    foe: { present: true, hpRatio: 1, ko: false, undead: false, claimed: true },
  });
  const holy = scanGambit(withSlot(lightLine), claimedLight, [selfAlly(claimedLight)]);
  if (!holy || holy.kind !== "act" || holy.actionId !== "spell:holy" || holy.aim !== "enemy") {
    throw new Error("holy fires on a claimed foe during light without engaging");
  }
  const unclaimedLight = actorOf({
    ...claimedLight,
    foe: { present: true, hpRatio: 1, ko: false, undead: false, claimed: false },
  });
  if (scanGambit(withSlot(lightLine), unclaimedLight, [selfAlly(unclaimedLight)])) {
    throw new Error("an unclaimed foe does not take holy");
  }
  for (const name of ["Darkness", "Radiance", "Fusion", "Fragmentation"] as const) {
    const other = actorOf({ ...claimedLight, skillchain: name });
    if (scanGambit(withSlot(lightLine), other, [selfAlly(other)])) throw new Error(`${name} is not light`);
  }
  const waiting = actorOf({ ...claimedLight, skillchain: null });
  if (scanGambit(withSlot(lightLine), waiting, [selfAlly(waiting)])) throw new Error("a chain that has not closed does not cast holy");
  const poor = actorOf({ ...claimedLight, mp: 99 });
  if (scanGambit(withSlot(lightLine), poor, [selfAlly(poor)])) throw new Error("holy needs 100 mp");
  const distant = actorOf({ ...claimedLight, distance: 21 });
  if (scanGambit(withSlot(lightLine), distant, [selfAlly(distant)])) throw new Error("holy is out of range");
  const holyRange = spellByName("Holy")?.range;
  const holyStep = gambitApproach(withSlot(lightLine), distant, [selfAlly(distant)]);
  if (!holyStep || holyStep.toward !== "foe" || holyStep.yards !== holyRange) throw new Error("holy steps into spell range");
  if (gambitApproach(withSlot(lightLine), claimedLight, [selfAlly(claimedLight)])) throw new Error("holy in range does not step");
  const cureFirst = blankBoard();
  cureFirst.on = true;
  cureFirst.slots[0] = { target: "self", condition: "ally-hp", hpPct: 50, action: "spell:cure" };
  cureFirst.slots[1] = lightLine;
  const hurtMage = actorOf({ ...distant, hp: 100, maxHp: 1000, knownSpells: ["Cure", "Holy"], levels: { WHM: 75 } });
  if (gambitApproach(cureFirst, hurtMage, [selfAlly(hurtMage)])) throw new Error("an in-range action comes before closing");
  const nukeFirst = blankBoard();
  nukeFirst.on = true;
  nukeFirst.slots[0] = lightLine;
  nukeFirst.slots[1] = { target: "self", condition: "ally-hp", hpPct: 50, action: "spell:cure" };
  const nukeStep = gambitApproach(nukeFirst, hurtMage, [selfAlly(hurtMage)]);
  if (!nukeStep || nukeStep.toward !== "foe") throw new Error("an out-of-range gambit closes before a later row");
  const farBlade = actorOf({ ...war, inRange: false, distance: 12 });
  const bladeStep = gambitApproach(withSlot({ target: "foe", condition: "ready", action: "ws:fast-blade" }), farBlade, [selfAlly(farBlade)]);
  if (!bladeStep || bladeStep.toward !== "foe" || bladeStep.yards !== autoAttackRange("Sword")) throw new Error("a far weapon skill steps into melee");
  if (gambitApproach(withSlot({ target: "foe", condition: "ready", action: "ws:fast-blade" }), war, [selfAlly(war)])) {
    throw new Error("a weapon skill in range does not step");
  }
  const provokeFar = actorOf({ ...resting, distance: PROVOKE_RANGE + 1, inRange: false });
  const provokeStep = gambitApproach(withSlot({ target: "foe-claimed", condition: "ready", action: "ability:provoke" }), provokeFar, [selfAlly(provokeFar)]);
  if (!provokeStep || provokeStep.toward !== "foe" || provokeStep.yards !== PROVOKE_RANGE) throw new Error("provoke steps into range");
  const cureStep = gambitApproach(withSlot({ target: "ally-any", condition: "ally-hp", hpPct: 80, action: "spell:cure-iv" }), { ...cureFour, partyRange: 25 }, [
    { id: "player", hp: 700, maxHp: 1000, ko: false, caster: false, yards: 25 },
    { id: "kupipi", hp: 900, maxHp: 1000, ko: false, caster: true, yards: 0 },
  ]);
  if (!cureStep || cureStep.toward !== "player" || cureStep.yards !== 20) throw new Error("cure steps to the ally");
  if (gambitApproach(withSlot({ target: "self", condition: "ready", action: "ability:berserk" }), actorOf({ ...war, distance: 30, inRange: false }), [selfAlly(war)])) {
    throw new Error("a self ability does not step");
  }
  const bow = actorOf({
    job: "RNG",
    skillName: "Sword",
    skill: 225,
    weaponName: "Bronze Sword",
    tp: 1000,
    targeted: true,
    inRange: false,
    distance: 12,
    levels: { RNG: 75 },
    arms: [
      { skillName: "Sword", skill: 225, weaponName: "Bronze Sword" },
      { skillName: "Archery", skill: 276, weaponName: "Shortbow" },
    ],
    foe: { present: true, hpRatio: 1, ko: false, undead: false },
  });
  const sidewinder = scanGambit(withSlot({ target: "foe", condition: "tp-1000", action: "ws:sidewinder" }), bow, [selfAlly(bow)]);
  if (!sidewinder || sidewinder.kind !== "act" || sidewinder.actionId !== "ws:sidewinder") throw new Error("a bow trust can fire sidewinder");
  const noBow = actorOf({ ...bow, arms: [{ skillName: "Sword", skill: 225, weaponName: "Bronze Sword" }] });
  if (scanGambit(withSlot({ target: "foe", condition: "tp-1000", action: "ws:sidewinder" }), noBow, [selfAlly(noBow)])) {
    throw new Error("sidewinder needs the bow");
  }
  const sam = actorOf({ ...claimedLight, job: "SAM", skillName: "Great Katana" });
  if (scanGambit(withSlot(lightLine), sam, [selfAlly(sam)])) throw new Error("sam has not learned holy");
  const kupipi = actorOf({
    ...claimedLight,
    levels: { WHM: 75 },
    knownSpells: ["Cure", "Holy"],
  });
  const trustHoly = scanGambit(withSlot(lightLine), kupipi, [selfAlly(kupipi)]);
  if (!trustHoly || trustHoly.kind !== "act" || trustHoly.actionId !== "spell:holy") throw new Error("kupipi casts holy on light");
  const novice = actorOf({ ...claimedLight, levels: { WHM: 10 }, knownSpells: ["Cure"] });
  if (scanGambit(withSlot(lightLine), novice, [selfAlly(novice)])) throw new Error("a low white mage has not learned holy");
  if (gambitDistance(99, 4) !== 4 || gambitDistance(12, 4) !== 12 || gambitDistance(21, 3) !== 21) {
    throw new Error("an unplaced trust uses the player's distance");
  }

  const oldAlly = sanitizeBoard({ on: true, slots: [{ target: "ally-low", condition: "hp-50", action: "spell:cure" }] });
  if (oldAlly.slots[0]?.target !== "ally-any" || oldAlly.slots[0]?.condition !== "ally-hp" || oldAlly.slots[0]?.hpPct !== 50) {
    throw new Error("old ally hp row migrates");
  }
  const oldFoe = sanitizeBoard({ on: true, slots: [{ target: "foe", condition: "hp-30", action: "ws:fast-blade" }] });
  if (oldFoe.slots[0]?.target !== "foe-hp" || oldFoe.slots[0]?.condition !== "nothing" || oldFoe.slots[0]?.hpPct !== 30) {
    throw new Error("old foe hp row migrates");
  }

  const whmBuffs = gambitBuffChoices("WHM", null).map((row) => row.id);
  if (!whmBuffs.includes("Protect") || !whmBuffs.includes("Divine Seal") || !whmBuffs.includes("Regen") || whmBuffs.includes("Refresh") || whmBuffs.includes("Berserk") || whmBuffs.includes("Martyr")) {
    throw new Error("white mage buffs");
  }
  const warSub = gambitBuffChoices("WAR", "WHM").map((row) => row.id);
  if (!warSub.includes("Berserk") || !warSub.includes("Protect") || !warSub.includes("Divine Seal") || warSub.includes("Afflatus Solace") || warSub.includes("Haste")) {
    throw new Error("warrior sub white mage buffs");
  }
  const ranger = actorOf({ job: "RNG", skillName: "Archery", skill: 276, weaponName: "Shortbow", buffs: [] });
  const sharp = scanGambit(withSlot({ target: "self", condition: "ally-buff", buff: "Sharpshot", action: "ability:sharpshot" }), ranger, [selfAlly(ranger)]);
  if (!sharp || sharp.kind !== "act" || sharp.actionId !== "ability:sharpshot") throw new Error("missing sharpshot fires");
  const covered = actorOf({ ...ranger, buffs: [{ name: "Sharpshot" }] });
  if (scanGambit(withSlot({ target: "self", condition: "ally-buff", buff: "Sharpshot", action: "ability:sharpshot" }), covered, [selfAlly(covered)])) {
    throw new Error("sharpshot already up");
  }
  const bare = { id: "kupipi", hp: 900, maxHp: 1000, ko: false, caster: true, buffs: [{ name: "Protect", tier: 1 }] };
  const open = { id: "player", hp: 900, maxHp: 1000, ko: false, caster: false, buffs: [] as GambitBuff[] };
  const missing = scanGambit(
    withSlot({ target: "ally-any", condition: "ally-buff", buff: "Protect", action: "hold" }),
    actorOf({ job: "WHM", cureParty: true }),
    [bare, open],
  );
  if (!missing || missing.kind !== "hold") throw new Error("an ally missing protect matches");
  const warded = scanGambit(
    withSlot({ target: "ally-any", condition: "ally-buff", buff: "Protect", action: "hold" }),
    actorOf({ job: "WHM" }),
    [bare, { ...open, buffs: [{ name: "Protect", tier: 2 }] }],
  );
  if (warded) throw new Error("protect of any tier is not missing");

  const berserkSelf = scanGambit(withSlot({ target: "self", condition: "self-buff", buff: "Berserk", action: "ability:berserk" }), war, [selfAlly(war)]);
  if (!berserkSelf || berserkSelf.kind !== "act" || berserkSelf.actionId !== "ability:berserk" || berserkSelf.aim !== "self") {
    throw new Error("self missing berserk fires on the fighter");
  }
  const berserkUp = actorOf({ ...war, buffs: [{ name: "Berserk" }] });
  if (scanGambit(withSlot({ target: "self", condition: "self-buff", buff: "Berserk", action: "ability:berserk" }), berserkUp, [selfAlly(berserkUp)])) {
    throw new Error("berserk already on the fighter");
  }
  const foeBare = scanGambit(withSlot({ target: "foe", condition: "self-buff", buff: "Berserk", action: "hold" }), war, [selfAlly(war)]);
  if (!foeBare || foeBare.kind !== "hold") throw new Error("self buff missing ignores the foe");
  if (scanGambit(withSlot({ target: "foe", condition: "self-buff", buff: "Berserk", action: "hold" }), berserkUp, [selfAlly(berserkUp)])) {
    throw new Error("a foe row does not hold once berserk is up");
  }
  const keptSelf = sanitizeBoard({ on: true, slots: [{ target: "self", condition: "self-buff", action: "ability:berserk", buff: "Berserk" }] });
  if (keptSelf.slots[0]?.condition !== "self-buff" || keptSelf.slots[0]?.buff !== "Berserk") throw new Error("a missing self buff is saved");

  const reprisalLine = { target: "foe-claimed" as const, condition: "self-buff" as const, buff: "Reprisal", action: "spell:reprisal" };
  const pld = actorOf({
    job: "PLD",
    mp: 100,
    skillName: "Sword",
    skill: 225,
    weaponName: "Bronze Sword",
    levels: { PLD: 75 },
    knownSpells: ["Reprisal"],
    shield: 0,
    engaged: false,
    foe: { present: true, hpRatio: 1, ko: false, undead: false, claimed: true },
  });
  const cover = scanGambit(withSlot(reprisalLine), pld, [selfAlly(pld)]);
  if (!cover || cover.kind !== "act" || cover.actionId !== "spell:reprisal" || cover.aim !== "self") {
    throw new Error("reprisal fires on you once a foe has enmity");
  }
  const swingingPld = actorOf({
    ...pld,
    engaged: true,
    foe: { present: true, hpRatio: 1, ko: false, undead: false, claimed: false, enmity: 0 },
  });
  if (scanGambit(withSlot(reprisalLine), swingingPld, [selfAlly(swingingPld)])) {
    throw new Error("reprisal waits for enmity, not engage");
  }
  const idlePld = actorOf({
    ...pld,
    engaged: false,
    foe: { present: true, hpRatio: 1, ko: false, undead: false, claimed: false },
  });
  if (scanGambit(withSlot(reprisalLine), idlePld, [selfAlly(idlePld)])) {
    throw new Error("reprisal waits until a foe has enmity");
  }
  const hated = actorOf({
    job: "WHM",
    mp: 200,
    distance: 12,
    skillchain: "Light",
    knownSpells: ["Holy"],
    foe: { id: "hare", present: true, hpRatio: 1, ko: false, undead: false, claimed: true, enmity: 40 },
    foes: [
      { id: "hare", present: true, hpRatio: 1, ko: false, undead: false, claimed: true, enmity: 40 },
      { id: "kin", present: true, hpRatio: 1, ko: false, undead: false, claimed: true, enmity: 900 },
    ],
  });
  const onKin = scanGambit(withSlot({ target: "foe-claimed", condition: "sc-light", action: "spell:holy" }), hated, [selfAlly(hated)]);
  if (!onKin || onKin.kind !== "act" || onKin.actionId !== "spell:holy" || onKin.foeId !== "kin") {
    throw new Error("a claimed row hits the foe with the most enmity");
  }
  const coverSelf = scanGambit(
    withSlot({ target: "foe-claimed", condition: "self-buff", buff: "Berserk", action: "ability:berserk" }),
    actorOf({ job: "WAR", skillName: "Sword", skill: 225, weaponName: "Bronze Sword", foe: { present: true, hpRatio: 1, ko: false, undead: false, claimed: true, enmity: 10 } }),
    [selfAlly(actorOf({ job: "WAR", skillName: "Sword" }))],
  );
  if (!coverSelf || coverSelf.kind !== "act" || coverSelf.actionId !== "ability:berserk" || coverSelf.aim !== "self") {
    throw new Error("a self ability on a claimed foe lands on you");
  }
  const wardedPld = actorOf({ ...pld, buffs: [{ name: "Reprisal" }] });
  if (scanGambit(withSlot(reprisalLine), wardedPld, [selfAlly(wardedPld)])) {
    throw new Error("reprisal already up");
  }

  const full = actorOf({ hp: 600, maxHp: 1000, mp: 300, maxMp: 400, job: "WHM" });
  const over = scanGambit(withSlot({ target: "self", condition: "ally-hp-over", hpPct: 50, action: "hold" }), full, [selfAlly(full)]);
  if (!over || over.kind !== "hold") throw new Error("hp over half holds");
  const exactHp = actorOf({ hp: 500, maxHp: 1000, job: "WHM" });
  if (scanGambit(withSlot({ target: "self", condition: "ally-hp-over", hpPct: 50, action: "hold" }), exactHp, [selfAlly(exactHp)])) {
    throw new Error("half exactly is not over");
  }
  if (scanGambit(withSlot({ target: "self", condition: "ally-hp-over", hpPct: 50, action: "hold" }), underHalf, [selfAlly(underHalf)])) {
    throw new Error("under half is not over");
  }
  const dry = actorOf({ hp: 1000, maxHp: 1000, mp: 100, maxMp: 400, job: "WHM" });
  if (!scanGambit(withSlot({ target: "self", condition: "ally-mp-under", hpPct: 50, action: "hold" }), dry, [selfAlly(dry)])) {
    throw new Error("mp under half holds");
  }
  if (scanGambit(withSlot({ target: "self", condition: "ally-mp-over", hpPct: 50, action: "hold" }), dry, [selfAlly(dry)])) {
    throw new Error("a quarter pool is not over half");
  }
  const halfMp = actorOf({ hp: 1000, maxHp: 1000, mp: 200, maxMp: 400, job: "WHM" });
  if (scanGambit(withSlot({ target: "self", condition: "ally-mp-under", hpPct: 50, action: "hold" }), halfMp, [selfAlly(halfMp)])) {
    throw new Error("half mp exactly is not under");
  }
  if (scanGambit(withSlot({ target: "self", condition: "ally-mp-over", hpPct: 50, action: "hold" }), halfMp, [selfAlly(halfMp)])) {
    throw new Error("half mp exactly is not over");
  }
  const plump = actorOf({ hp: 1000, maxHp: 1000, mp: 300, maxMp: 400, job: "WHM" });
  if (!scanGambit(withSlot({ target: "self", condition: "ally-mp-over", hpPct: 50, action: "hold" }), plump, [selfAlly(plump)])) {
    throw new Error("mp over half holds");
  }
  if (scanGambit(withSlot({ target: "self", condition: "ally-mp-under", hpPct: 20, action: "hold" }), dry, [selfAlly(dry)])) {
    throw new Error("25 percent is not under 20");
  }
  const dryFoe = actorOf({ ...dry, targeted: true, foe: { present: true, hpRatio: 1, ko: false, undead: false } });
  const selfLow = scanGambit(withSlot({ target: "foe", condition: "self-mp-under", hpPct: 50, action: "hold" }), dryFoe, [selfAlly(dryFoe)]);
  if (!selfLow || selfLow.kind !== "hold") throw new Error("self mp under half holds on a foe");
  if (scanGambit(withSlot({ target: "foe", condition: "self-mp-over", hpPct: 50, action: "hold" }), dryFoe, [selfAlly(dryFoe)])) {
    throw new Error("a quarter of your own mp is not over half");
  }
  if (scanGambit(withSlot({ target: "self", condition: "self-mp-under", hpPct: 50, action: "hold" }), halfMp, [selfAlly(halfMp)])) {
    throw new Error("half of your own mp exactly is not under");
  }
  if (scanGambit(withSlot({ target: "self", condition: "self-mp-over", hpPct: 50, action: "hold" }), halfMp, [selfAlly(halfMp)])) {
    throw new Error("half of your own mp exactly is not over");
  }
  if (!scanGambit(withSlot({ target: "self", condition: "self-mp-over", hpPct: 50, action: "hold" }), plump, [selfAlly(plump)])) {
    throw new Error("self mp over half holds");
  }
  const noPool = actorOf({ hp: 1000, maxHp: 1000, mp: 0, job: "WAR" });
  if (scanGambit(withSlot({ target: "self", condition: "self-mp-under", hpPct: 50, action: "hold" }), noPool, [selfAlly(noPool)])) {
    throw new Error("self mp needs a pool");
  }
  const mage = actorOf({ job: "WHM", hp: 1000, maxHp: 1000, mp: 400, maxMp: 400, cureParty: true, levels: { WHM: 75 }, knownSpells: ["Cure"] });
  const thirsty = scanGambit(withSlot({ target: "ally-any", condition: "ally-mp-under", hpPct: 50, action: "spell:cure" }), mage, [
    { id: "kupipi", hp: 1000, maxHp: 1000, mp: 400, maxMp: 400, ko: false, caster: true, yards: 0 },
    { id: "player", hp: 1000, maxHp: 1000, mp: 10, maxMp: 100, ko: false, caster: false, yards: 2 },
  ]);
  if (!thirsty || thirsty.kind !== "act" || thirsty.targetId !== "player") throw new Error("mp under finds the dry ally");
  const foeActor = actorOf({ targeted: true, foe: { present: true, hpRatio: 0.2, ko: false, undead: false, playerYards: 4 } });
  if (scanGambit(withSlot({ target: "foe", condition: "ally-mp-under", hpPct: 50, action: "hold" }), foeActor, [selfAlly(foeActor)])) {
    throw new Error("an mp check does not read a foe");
  }

  const whmDebuffs = gambitDebuffChoices("WHM", null).map((row) => row.id);
  if (whmDebuffs.join() !== "Flash,Sleep,Dia,Paralyze,Slow,Silence") throw new Error(`white mage debuffs ${whmDebuffs.join()}`);
  const blmDebuffs = gambitDebuffChoices("BLM", null).map((row) => row.id);
  if (blmDebuffs.join() !== "Poison,Blind,Bind,Bio,Shock,Rasp,Choke,Sleep,Frost,Burn,Drown,Stun") throw new Error(`black mage debuffs ${blmDebuffs.join()}`);
  const lowBlm = gambitDebuffChoices("BLM", null, { BLM: 5 }).map((row) => row.id);
  if (lowBlm.join() !== "Poison,Blind") throw new Error(`a level 5 black mage debuffs ${lowBlm.join()}`);
  const pldDebuffs = gambitDebuffChoices("PLD", null).map((row) => row.id);
  if (pldDebuffs.join() !== "Flash,Stun,Poison,Bind") throw new Error(`paladin debuffs ${pldDebuffs.join()}`);
  const samDebuffs = gambitDebuffChoices("SAM", null).map((row) => row.id);
  if (samDebuffs.join() !== "Poison,Bind,Stun,Blind,Silence,Paralyze") throw new Error(`samurai debuffs ${samDebuffs.join()}`);
  if (gambitDebuffChoices("SAM", null, { SAM: 80 }).map((row) => row.id).includes("Defense Down") !== true) throw new Error("ageha is a level 80 defense down");
  const warWhm = gambitDebuffChoices("WAR", "WHM").map((row) => row.id);
  if (warWhm.join() !== "Dia,Paralyze,Slow,Silence,Poison,Bind") throw new Error(`warrior sub white mage debuffs ${warWhm.join()}`);
  if (gambitDebuffChoices("MNK", null).length !== 0) throw new Error("monk has no stored debuff");
  if (gambitDebuffChoices("RNG", null).map((row) => row.id).join() !== "Bind,Poison") throw new Error("ranger bind and poison");
  if (gambitDebuffChoices("THF", null).map((row) => row.id).join() !== "Poison,Bind") throw new Error("thief poison and bind");
  const geoBuffs = gambitBuffChoices("GEO", null).map((row) => row.id);
  if (!geoBuffs.includes("Indi-Regen") || !geoBuffs.includes("Indi-Poison") || !geoBuffs.includes("Indi-Vex") || !geoBuffs.includes("Geo-Precision") || !geoBuffs.includes("Geo-Regen") || !geoBuffs.includes("Geo-Voidance") || geoBuffs.includes("Geo-Poison") || geoBuffs.includes("Geo-Slip") || geoBuffs.includes("Geo-Vex")) {
    throw new Error(`geomancer buffs ${geoBuffs.filter((id) => id.startsWith("Geo-") || id.startsWith("Indi-")).join()}`);
  }
  const geoDebuffs = gambitDebuffChoices("GEO", null).map((row) => row.id);
  if (geoDebuffs.join() !== "Sleep,Geo-Poison,Geo-Slow,Geo-Torpor,Geo-Slip,Geo-Languor,Geo-Paralysis,Geo-Vex") {
    throw new Error(`geomancer geo debuffs ${geoDebuffs.join()}`);
  }
  const geo = actorOf({ job: "GEO", buffs: [], mp: 500, maxMp: 500 });
  const indiDown = scanGambit(withSlot({ target: "self", condition: "self-buff", buff: "Indi-Regen", action: "hold" }), geo, [selfAlly(geo)]);
  if (!indiDown || indiDown.kind !== "hold") throw new Error("missing indi fires");
  const indiUp = actorOf({ job: "GEO", buffs: [{ name: "Indi-Regen" }] });
  if (scanGambit(withSlot({ target: "self", condition: "self-buff", buff: "Indi-Regen", action: "hold" }), indiUp, [selfAlly(indiUp)])) {
    throw new Error("indi already up");
  }
  const bareGeo = { present: true, hpRatio: 1, ko: false, undead: false, playerYards: 4, debuffs: [] as string[] };
  const geoFoe = actorOf({ job: "GEO", targeted: true, foe: bareGeo, distance: 4 });
  const geoDown = scanGambit(withSlot({ target: "foe", condition: "foe-debuff", buff: "Geo-Poison", action: "hold" }), geoFoe, [selfAlly(geoFoe)]);
  if (!geoDown || geoDown.kind !== "hold") throw new Error("missing geo fires");
  const geoUp = actorOf({ job: "GEO", targeted: true, foe: { ...bareGeo, debuffs: ["Geo-Poison"] }, distance: 4 });
  if (scanGambit(withSlot({ target: "foe", condition: "foe-debuff", buff: "Geo-Poison", action: "hold" }), geoUp, [selfAlly(geoUp)])) {
    throw new Error("geo already on the enemy");
  }
  const precisionDown = scanGambit(withSlot({ target: "self", condition: "self-buff", buff: "Geo-Precision", action: "hold" }), geo, [selfAlly(geo)]);
  if (!precisionDown || precisionDown.kind !== "hold") throw new Error("missing geo precision fires");
  const precisionUp = actorOf({ job: "GEO", buffs: [{ name: "Geo-Precision" }] });
  if (scanGambit(withSlot({ target: "self", condition: "self-buff", buff: "Geo-Precision", action: "hold" }), precisionUp, [selfAlly(precisionUp)])) {
    throw new Error("geo precision already up");
  }
  const slipDown = scanGambit(withSlot({ target: "foe", condition: "foe-debuff", buff: "Geo-Slip", action: "hold" }), geoFoe, [selfAlly(geoFoe)]);
  if (!slipDown || slipDown.kind !== "hold") throw new Error("missing geo slip fires");
  const geoClaim = actorOf({
    job: "GEO",
    mp: 400,
    maxMp: 400,
    distance: 4,
    inRange: true,
    levels: { GEO: 75 },
    knownSpells: ["Geo-Precision"],
    foe: { present: true, hpRatio: 1, ko: false, undead: false, claimed: true, enmity: 20 },
  });
  const bareAlly = { id: "player", hp: 1000, maxHp: 1000, ko: false, caster: false, buffs: [] as { name: string }[] };
  const precisionRow = { target: "foe-claimed" as const, condition: "ally-buff" as const, buff: "Geo-Precision", action: "spell:geo-precision" };
  const precisionCast = scanGambit(withSlot(precisionRow), geoClaim, [selfAlly(geoClaim), bareAlly]);
  if (!precisionCast || precisionCast.kind !== "act" || precisionCast.actionId !== "spell:geo-precision" || precisionCast.aim !== "enemy") {
    throw new Error("geo precision fires on a claimed foe when an ally is missing it");
  }
  const coveredGeo = actorOf({ ...geoClaim, buffs: [{ name: "Geo-Precision" }] });
  if (scanGambit(withSlot(precisionRow), coveredGeo, [selfAlly(coveredGeo), { ...bareAlly, buffs: [{ name: "Geo-Precision" }] }])) {
    throw new Error("geo precision holds when every ally already has it");
  }
  const shantotto = { id: "shantotto", hp: 800, maxHp: 800, ko: false, caster: false, buffs: [] as { name: string }[], yards: 4 };
  const namedGeo = { target: "ally:shantotto" as const, condition: "ally-buff" as const, buff: "Geo-Precision", action: "spell:geo-precision" };
  const namedCast = scanGambit(withSlot(namedGeo), geoClaim, [selfAlly(geoClaim), { ...bareAlly, buffs: [{ name: "Geo-Precision" }] }, shantotto]);
  if (!namedCast || namedCast.kind !== "act" || namedCast.actionId !== "spell:geo-precision" || namedCast.aim !== "self" || namedCast.targetId !== "shantotto") {
    throw new Error("geo precision fires on the named ally who is missing it");
  }
  const namedUp = scanGambit(withSlot(namedGeo), geoClaim, [selfAlly(geoClaim), bareAlly, { ...shantotto, buffs: [{ name: "Geo-Precision" }] }]);
  if (namedUp) throw new Error("a named ally who already has the buff does not get another");
  const hasteOnYou = scanGambit(
    withSlot({ target: "ally:player", condition: "ally-buff", buff: "Haste", action: "spell:haste" }),
    actorOf({ job: "WHM", mp: 200, levels: { WHM: 75 }, knownSpells: ["Haste"], foe: { present: true, hpRatio: 1, ko: false, undead: false } }),
    [{ id: "player", hp: 1000, maxHp: 1000, ko: false, caster: true, buffs: [] }, { id: "kupipi", hp: 1000, maxHp: 1000, ko: false, caster: false, buffs: [] }],
  );
  if (!hasteOnYou || hasteOnYou.kind !== "act" || hasteOnYou.aim !== "self" || hasteOnYou.targetId !== "player") {
    throw new Error("a named player is the one checked for the missing buff");
  }
  const hurtFoeHp = actorOf({ job: "BLM", targeted: true, foe: { present: true, hpRatio: 0.4, ko: false, undead: false, claimed: true } });
  const underHp = scanGambit(withSlot({ target: "foe-claimed", condition: "foe-hp-under", hpPct: 50, action: "hold" }), hurtFoeHp, [selfAlly(hurtFoeHp)]);
  if (!underHp || underHp.kind !== "hold") throw new Error("enemy hp under 50 fires at 40");
  const evenHp = actorOf({ ...hurtFoeHp, foe: { present: true, hpRatio: 0.5, ko: false, undead: false, claimed: true } });
  if (scanGambit(withSlot({ target: "foe-claimed", condition: "foe-hp-under", hpPct: 50, action: "hold" }), evenHp, [selfAlly(evenHp)])) {
    throw new Error("enemy hp under is strict");
  }
  const overHp = scanGambit(withSlot({ target: "foe-claimed", condition: "foe-hp-over", hpPct: 50, action: "hold" }), actorOf({ ...hurtFoeHp, foe: { present: true, hpRatio: 0.6, ko: false, undead: false, claimed: true } }), [selfAlly(hurtFoeHp)]);
  if (!overHp || overHp.kind !== "hold") throw new Error("enemy hp over 50 fires at 60");
  if (scanGambit(withSlot({ target: "foe-claimed", condition: "foe-hp-over", hpPct: 50, action: "hold" }), evenHp, [selfAlly(evenHp)])) {
    throw new Error("enemy hp over is strict");
  }
  const keptNamed = sanitizeBoard({ on: true, slots: [{ target: "ally:shantotto", condition: "ally-buff", action: "spell:geo-precision", buff: "Geo-Precision" }] });
  if (keptNamed.slots[0]?.target !== "ally:shantotto" || keptNamed.slots[0]?.buff !== "Geo-Precision") throw new Error("a named ally is saved");
  const keptFoeHp = sanitizeBoard({ on: true, slots: [{ target: "foe-claimed", condition: "foe-hp-under", action: "hold", hpPct: 25 }] });
  if (keptFoeHp.slots[0]?.condition !== "foe-hp-under" || keptFoeHp.slots[0]?.hpPct !== 25) throw new Error("enemy hp percent is saved");

  const openHare = { present: true, hpRatio: 1, ko: false, undead: false, playerYards: 6, debuffs: [] as string[] };
  const poisonMage = actorOf({
    job: "BLM",
    mp: 400,
    maxMp: 400,
    distance: 5,
    inRange: true,
    targeted: true,
    levels: { BLM: 75 },
    knownSpells: ["Poison"],
    foe: openHare,
  });
  const poison = scanGambit(withSlot({ target: "foe-closest", condition: "foe-debuff", buff: "Poison", action: "spell:poison" }), poisonMage, [selfAlly(poisonMage)]);
  if (!poison || poison.kind !== "act" || poison.actionId !== "spell:poison" || poison.aim !== "enemy") throw new Error("missing poison fires");
  const poisoned = actorOf({ ...poisonMage, foe: { ...openHare, debuffs: ["Poison II"] } });
  if (scanGambit(withSlot({ target: "foe-closest", condition: "foe-debuff", buff: "Poison", action: "spell:poison" }), poisoned, [selfAlly(poisoned)])) {
    throw new Error("poison ii is not missing");
  }
  const blinded = actorOf({ ...poisonMage, foe: { ...openHare, debuffs: ["Blind"] } });
  const still = scanGambit(withSlot({ target: "foe-closest", condition: "foe-debuff", buff: "Poison", action: "spell:poison" }), blinded, [selfAlly(blinded)]);
  if (!still || still.kind !== "act") throw new Error("blind does not cover poison");
  if (scanGambit(withSlot({ target: "self", condition: "foe-debuff", buff: "Poison", action: "hold" }), poisonMage, [selfAlly(poisonMage)])) {
    throw new Error("a debuff check needs a foe");
  }
  if (scanGambit(withSlot({ target: "foe-closest", condition: "foe-debuff", action: "hold" }), poisonMage, [selfAlly(poisonMage)])) {
    throw new Error("a debuff check needs a name");
  }
  const atTen = actorOf({ ...poisonMage, foe: { ...openHare, playerYards: 10 } });
  if (!scanGambit(withSlot({ target: "foe-closest", condition: "nothing", action: "hold" }), atTen, [selfAlly(atTen)])) {
    throw new Error("10 yalms is still closest");
  }
  const pastTen = actorOf({ ...poisonMage, foe: { ...openHare, playerYards: 11 } });
  if (scanGambit(withSlot({ target: "foe-closest", condition: "nothing", action: "hold" }), pastTen, [selfAlly(pastTen)])) {
    throw new Error("11 yalms is not closest");
  }
  const unmeasured = actorOf({ ...poisonMage, foe: { present: true, hpRatio: 1, ko: false, undead: false } });
  if (scanGambit(withSlot({ target: "foe-closest", condition: "nothing", action: "hold" }), unmeasured, [selfAlly(unmeasured)])) {
    throw new Error("closest needs the player's distance");
  }
  const nearer = actorOf({
    ...poisonMage,
    foe: null,
    foes: [
      { present: true, hpRatio: 1, ko: false, undead: false, playerYards: 9, debuffs: [] },
      { present: true, hpRatio: 1, ko: false, undead: false, playerYards: 4, debuffs: ["Poison"] },
    ],
  });
  if (scanGambit(withSlot({ target: "foe-closest", condition: "foe-debuff", buff: "Poison", action: "hold" }), nearer, [selfAlly(nearer)])) {
    throw new Error("the closer poisoned foe wins");
  }
  const fartherClean = actorOf({
    ...poisonMage,
    foe: null,
    foes: [
      { present: true, hpRatio: 1, ko: false, undead: false, playerYards: 9, debuffs: ["Poison"] },
      { present: true, hpRatio: 1, ko: false, undead: false, playerYards: 4, debuffs: [] },
    ],
  });
  if (!scanGambit(withSlot({ target: "foe-closest", condition: "foe-debuff", buff: "Poison", action: "hold" }), fartherClean, [selfAlly(fartherClean)])) {
    throw new Error("the closer clean foe is the one that is missing poison");
  }
  const tied = actorOf({
    ...poisonMage,
    foe: null,
    foes: [
      { present: true, hpRatio: 1, ko: false, undead: false, playerYards: 5, debuffs: ["Poison"] },
      { present: true, hpRatio: 1, ko: false, undead: false, playerYards: 5, debuffs: [] },
    ],
  });
  if (scanGambit(withSlot({ target: "foe-closest", condition: "foe-debuff", buff: "Poison", action: "hold" }), tied, [selfAlly(tied)])) {
    throw new Error("a tie keeps the earlier foe");
  }
  const outside = actorOf({
    ...poisonMage,
    foe: null,
    foes: [
      { present: true, hpRatio: 1, ko: false, undead: false, playerYards: 12, debuffs: [] },
      { present: true, hpRatio: 1, ko: false, undead: false, playerYards: 4, debuffs: [] },
    ],
  });
  if (!scanGambit(withSlot({ target: "foe-closest", condition: "nothing", action: "hold" }), outside, [selfAlly(outside)])) {
    throw new Error("a foe past 10 does not hide the nearer one");
  }
  const onlyFar = actorOf({
    ...poisonMage,
    foe: null,
    foes: [{ present: true, hpRatio: 1, ko: false, undead: false, playerYards: 12, debuffs: [] }],
  });
  if (scanGambit(withSlot({ target: "foe-closest", condition: "nothing", action: "hold" }), onlyFar, [selfAlly(onlyFar)])) {
    throw new Error("every foe past 10 is ignored");
  }
  const farCast = actorOf({ ...poisonMage, distance: 30, foe: { ...openHare, playerYards: 6 } });
  const poisonStep = gambitApproach(withSlot({ target: "foe-closest", condition: "foe-debuff", buff: "Poison", action: "spell:poison" }), farCast, [selfAlly(farCast)]);
  if (!poisonStep || poisonStep.toward !== "foe" || poisonStep.yards !== spellByName("Poison")?.range) throw new Error("closest still steps into spell range");
  if (gambitApproach(withSlot({ target: "foe-closest", condition: "foe-debuff", buff: "Poison", action: "spell:poison" }), pastTen, [selfAlly(pastTen)])) {
    throw new Error("a foe past 10 is not approached");
  }

  const keptClosest = sanitizeBoard({ on: true, slots: [{ target: "foe-closest", condition: "foe-debuff", action: "spell:poison", buff: "Poison" }] });
  if (keptClosest.slots[0]?.target !== "foe-closest" || keptClosest.slots[0]?.condition !== "foe-debuff" || keptClosest.slots[0]?.buff !== "Poison") {
    throw new Error("closest and a missing debuff are saved");
  }
  const keptMp = sanitizeBoard({ on: true, slots: [{ target: "self", condition: "ally-mp-over", action: "hold", hpPct: 25 }] });
  if (keptMp.slots[0]?.condition !== "ally-mp-over" || keptMp.slots[0]?.hpPct !== 25) throw new Error("an mp percent is saved");
  const keptSelfMp = sanitizeBoard({ on: true, slots: [{ target: "foe-claimed", condition: "self-mp-under", action: "hold", hpPct: 30 }] });
  if (keptSelfMp.slots[0]?.condition !== "self-mp-under" || keptSelfMp.slots[0]?.hpPct !== 30) throw new Error("a self mp percent is saved");

  const whmHeal = actorOf({
    job: "WHM",
    mp: 400,
    maxMp: 400,
    distance: 5,
    cureParty: true,
    levels: { WHM: 75 },
    knownSpells: ["Curaga", "Poisona", "Sacrifice", "Reraise"],
    foe: { present: true, hpRatio: 1, ko: false, undead: false, claimed: true },
  });
  const wounded = { id: "player", hp: 200, maxHp: 1000, ko: false, caster: false, yards: 5 };
  const curagaHit = scanGambit(withSlot({ target: "ally-any", condition: "ally-hp", hpPct: 50, action: "spell:curaga" }), whmHeal, [
    { id: "kupipi", hp: 1000, maxHp: 1000, mp: 400, maxMp: 400, ko: false, caster: true, yards: 0 },
    wounded,
  ]);
  if (!curagaHit || curagaHit.kind !== "act" || curagaHit.actionId !== "spell:curaga" || curagaHit.targetId !== "player") {
    throw new Error("curaga finds the hurt ally");
  }
  const poisonaHit = scanGambit(withSlot({ target: "ally-any", condition: "nothing", action: "spell:poisona" }), whmHeal, [
    wounded,
    { id: "kupipi", hp: 1000, maxHp: 1000, ko: false, caster: true, yards: 0 },
  ]);
  if (!poisonaHit || poisonaHit.kind !== "act" || poisonaHit.actionId !== "spell:poisona" || poisonaHit.aim !== "self") {
    throw new Error("poisona scans");
  }
  const sacrificeHit = scanGambit(withSlot({ target: "ally-any", condition: "nothing", action: "spell:sacrifice" }), whmHeal, [
    wounded,
    { id: "kupipi", hp: 1000, maxHp: 1000, ko: false, caster: true, yards: 0 },
  ]);
  if (!sacrificeHit || sacrificeHit.kind !== "act" || sacrificeHit.actionId !== "spell:sacrifice") throw new Error("sacrifice scans");

  const nin = actorOf({
    job: "NIN",
    mp: 0,
    maxMp: 0,
    distance: 5,
    targeted: true,
    levels: { NIN: 75 },
    knownSpells: ["Katon: Ichi", "Utsusemi: Ni", "Tonko: Ichi", "Monomi: Ichi"],
    skillName: "Katana",
    weaponName: "Kunai",
    foe: { present: true, hpRatio: 1, ko: false, undead: false, claimed: true },
  });
  const katonHit = scanGambit(withSlot({ target: "foe-claimed", condition: "nothing", action: "spell:katon-ichi" }), nin, [selfAlly(nin)]);
  if (!katonHit || katonHit.kind !== "act" || katonHit.actionId !== "spell:katon-ichi" || katonHit.aim !== "enemy") {
    throw new Error("katon scans on a claimed foe");
  }
  const shadows = scanGambit(withSlot({ target: "self", condition: "self-buff", buff: "Copy Image", action: "spell:utsusemi-ni" }), nin, [selfAlly(nin)]);
  if (!shadows || shadows.kind !== "act" || shadows.actionId !== "spell:utsusemi-ni") throw new Error("utsusemi fires when copy image is missing");
  const shadowed = actorOf({ ...nin, buffs: [{ name: "Copy Image" }] });
  if (scanGambit(withSlot({ target: "self", condition: "self-buff", buff: "Copy Image", action: "spell:utsusemi-ni" }), shadowed, [selfAlly(shadowed)])) {
    throw new Error("copy image is not missing");
  }
  const hidden = scanGambit(withSlot({ target: "self", condition: "self-buff", buff: "Invisible", action: "spell:tonko-ichi" }), nin, [selfAlly(nin)]);
  if (!hidden || hidden.kind !== "act") throw new Error("tonko fires when invisible is missing");
  const unseen = actorOf({ ...nin, buffs: [{ name: "Invisible" }] });
  if (scanGambit(withSlot({ target: "self", condition: "self-buff", buff: "Invisible", action: "spell:tonko-ichi" }), unseen, [selfAlly(unseen)])) {
    throw new Error("invisible is not missing");
  }

  const club = actorOf({
    job: "WHM",
    skillName: "Club",
    skill: 225,
    weaponName: "Bronze Hammer",
    tp: 1000,
    targeted: true,
    inRange: true,
    levels: { WHM: 75 },
    arms: [{ skillName: "Club", skill: 225, weaponName: "Bronze Hammer" }],
    foe: { present: true, hpRatio: 1, ko: false, undead: false, claimed: true },
  });
  const star = scanGambit(withSlot({ target: "self", condition: "tp-1000", action: "ws:starlight" }), club, [selfAlly(club)]);
  if (!star || star.kind !== "act" || star.actionId !== "ws:starlight" || star.aim !== "self") throw new Error("starlight fires on self");
  const starFoe = scanGambit(withSlot({ target: "foe-claimed", condition: "tp-1000", action: "ws:starlight" }), club, [selfAlly(club)]);
  if (!starFoe || starFoe.kind !== "act" || starFoe.actionId !== "ws:starlight" || starFoe.aim !== "self") {
    throw new Error("starlight cannot hit a foe, so it lands on you");
  }
  const moon = scanGambit(withSlot({ target: "self", condition: "tp-1000", action: "ws:moonlight" }), club, [selfAlly(club)]);
  if (!moon || moon.kind !== "act" || moon.actionId !== "ws:moonlight" || moon.aim !== "self") throw new Error("moonlight fires on self");

  const rich = { id: "ayame", hp: 1000, maxHp: 1000, ko: false, caster: false, tp: 1001 };
  const quiet = actorOf({ job: "WHM", mp: 200, tp: 0, cureParty: true, levels: { WHM: 75 }, knownSpells: ["Cure"], foe: { present: true, hpRatio: 1, ko: false, undead: false, claimed: true, enmity: 10 } });
  const partnerReady = scanGambit(withSlot({ target: "ally-any", condition: "ally-tp-over", action: "spell:cure" }), quiet, [selfAlly(quiet), rich]);
  if (!partnerReady || partnerReady.kind !== "act" || partnerReady.targetId !== "ayame") throw new Error("an ally over 1000 TP matches");
  if (scanGambit(withSlot({ target: "ally-any", condition: "ally-tp-over", action: "hold" }), quiet, [selfAlly(quiet), { ...rich, tp: 1000 }])) {
    throw new Error("an ally at 1000 TP is not over");
  }
  if (scanGambit(withSlot({ target: "ally-any", condition: "ally-tp-over", action: "hold" }), quiet, [selfAlly(quiet), { ...rich, tp: 999 }])) {
    throw new Error("an ally under 1000 TP does not match");
  }
  if (scanGambit(withSlot({ target: "ally-any", condition: "ally-tp-over", action: "hold" }), quiet, [selfAlly(quiet), { ...rich, ko: true, tp: 3000 }])) {
    throw new Error("a knocked out ally does not match");
  }
  const openedFoe = scanGambit(withSlot({ target: "foe-claimed", condition: "ally-tp-over", action: "hold" }), quiet, [selfAlly(quiet), rich]);
  if (!openedFoe || openedFoe.kind !== "hold") throw new Error("a foe row fires when an ally is over 1000 TP");
  if (scanGambit(withSlot({ target: "foe-claimed", condition: "ally-tp-over", action: "hold" }), quiet, [selfAlly(quiet), { ...rich, tp: 1000 }])) {
    throw new Error("a foe row waits until an ally is over 1000 TP");
  }
  const selfReady = actorOf({ ...quiet, tp: 1001 });
  if (!scanGambit(withSlot({ target: "self", condition: "ally-tp-over", action: "hold" }), selfReady, [selfAlly(selfReady)])) {
    throw new Error("your own TP over 1000 matches on self");
  }
  if (scanGambit(withSlot({ target: "self", condition: "ally-tp-over", action: "hold" }), actorOf({ ...quiet, tp: 1000 }), [selfAlly(actorOf({ tp: 1000 }))])) {
    throw new Error("your own 1000 TP is not over");
  }

  const readied = {
    id: "hare",
    present: true,
    hpRatio: 1,
    ko: false,
    undead: false,
    claimed: true,
    enmity: 40,
    resonance: ["Fragmentation", "Scission"],
  };
  const closer = actorOf({
    job: "SAM",
    skillName: "Great Katana",
    skill: 276,
    weaponName: "Zanbato",
    tp: 1000,
    targeted: true,
    inRange: true,
    distance: 2,
    levels: { SAM: 75 },
    arms: [{ skillName: "Great Katana", skill: 276, weaponName: "Zanbato" }],
    foe: readied,
    foes: [readied],
  });
  const kasha = scanGambit(withSlot({ target: "foe-claimed", condition: "sc-ready", buff: "Fragmentation", action: "ws:tachi-kasha" }), closer, [selfAlly(closer)]);
  if (!kasha || kasha.kind !== "act" || kasha.actionId !== "ws:tachi-kasha" || kasha.foeId !== "hare") {
    throw new Error("tachi kasha fires when fragmentation is ready");
  }
  const scissionOnly = actorOf({ ...closer, foe: { ...readied, resonance: ["Scission"] }, foes: [{ ...readied, resonance: ["Scission"] }] });
  if (scanGambit(withSlot({ target: "foe-claimed", condition: "sc-ready", buff: "Fragmentation", action: "ws:tachi-kasha" }), scissionOnly, [selfAlly(scissionOnly)])) {
    throw new Error("scission does not ready fragmentation");
  }
  const bareChain = actorOf({ ...closer, foe: { ...readied, resonance: [] }, foes: [{ ...readied, resonance: [] }] });
  if (scanGambit(withSlot({ target: "foe-claimed", condition: "sc-ready", buff: "Fragmentation", action: "ws:tachi-kasha" }), bareChain, [selfAlly(bareChain)])) {
    throw new Error("a shut window is not ready");
  }
  const shortSam = actorOf({ ...closer, tp: 999 });
  if (scanGambit(withSlot({ target: "foe-claimed", condition: "sc-ready", buff: "Fragmentation", action: "ws:tachi-kasha" }), shortSam, [selfAlly(shortSam)])) {
    throw new Error("a ready chain still needs 1000 TP");
  }
  const otherBody = actorOf({
    ...closer,
    foes: [
      { ...readied, enmity: 5 },
      { id: "kin", present: true, hpRatio: 1, ko: false, undead: false, claimed: true, enmity: 90, resonance: [] as string[] },
    ],
  });
  if (scanGambit(withSlot({ target: "foe-claimed", condition: "sc-ready", buff: "Fragmentation", action: "ws:tachi-kasha" }), otherBody, [selfAlly(otherBody)])) {
    throw new Error("the claimed foe is the one that must be readied");
  }
  if (scanGambit(withSlot({ target: "foe-claimed", condition: "sc-ready", buff: "Light", action: "hold" }), closer, [selfAlly(closer)])) {
    throw new Error("light is not a skillchain ready choice");
  }
  const keptChain = sanitizeBoard({ on: true, slots: [{ target: "foe-claimed", condition: "sc-ready", action: "ws:tachi-kasha", buff: "Fragmentation" }] });
  if (keptChain.slots[0]?.condition !== "sc-ready" || keptChain.slots[0]?.buff !== "Fragmentation") throw new Error("a ready chain is saved");
  const droppedLight = sanitizeBoard({ on: true, slots: [{ target: "foe-claimed", condition: "sc-ready", action: "hold", buff: "Light" }] });
  if (droppedLight.slots[0]?.condition !== "sc-ready" || droppedLight.slots[0]?.buff) throw new Error("light is not saved as skillchain ready");
  const droppedDark = sanitizeBoard({ on: true, slots: [{ target: "foe-claimed", condition: "sc-ready", action: "hold", buff: "Darkness" }] });
  if (droppedDark.slots[0]?.buff) throw new Error("darkness is not saved as skillchain ready");
  const readyChains: readonly string[] = GAMBIT_READY_CHAINS;
  if (readyChains.includes("Light") || readyChains.includes("Darkness") || !readyChains.includes("Fragmentation") || !readyChains.includes("Scission")) {
    throw new Error("skillchain ready lists every chain except light and darkness");
  }
  const pinned = withSlot({ target: "foe-claimed", condition: "sc-ready", buff: "Fragmentation", action: "ws:tachi-kasha" });
  if (!gambitPinsWeaponSkill(pinned, "ws:tachi-kasha")) throw new Error("fragmentation keeps tachi kasha");
  if (gambitPinsWeaponSkill(withSlot({ target: "foe-claimed", condition: "tp-over", action: "ws:tachi-kasha" }), "ws:tachi-kasha")) {
    throw new Error("another row may still pick a higher chain");
  }
  const hare = { present: true, hpRatio: 1, ko: false, undead: false };
  const sch = actorOf({
    job: "SCH",
    sub: "RDM",
    skillName: "Staff",
    skill: 225,
    levels: { SCH: 75, RDM: 37 },
    mp: 400,
    distance: 2,
    ability: { schLevel: 75, schMain: true, charges: 0 },
  });
  const dark = scanGambit(withSlot({ target: "self", condition: "self-buff", buff: "Dark Arts", action: "ability:dark-arts" }), sch, [selfAlly(sch)]);
  if (dark?.kind !== "act" || dark.actionId !== "ability:dark-arts") throw new Error("scholar dark arts");
  const asleep = actorOf({ ...sch, buffs: [{ name: "Dark Arts" }] });
  if (scanGambit(withSlot({ target: "self", condition: "self-buff", buff: "Dark Arts", action: "ability:dark-arts" }), asleep, [selfAlly(asleep)])) {
    throw new Error("dark arts stays up");
  }
  const unskilled = actorOf({ ...sch, ability: undefined });
  if (scanGambit(withSlot({ target: "self", condition: "self-buff", buff: "Dark Arts", action: "ability:dark-arts" }), unskilled, [selfAlly(unskilled)])) {
    throw new Error("dark arts needs scholar level");
  }
  const pars = actorOf({
    ...sch,
    buffs: [{ name: "Dark Arts" }],
    ability: { schLevel: 75, schMain: true, darkArts: true, charges: 0 },
  });
  if (scanGambit(withSlot({ target: "self", condition: "self-buff", buff: "Parsimony", action: "ability:parsimony" }), pars, [selfAlly(pars)])) {
    throw new Error("parsimony needs a charge");
  }
  const charged = actorOf({ ...pars, ability: { schLevel: 75, schMain: true, darkArts: true, charges: 4 } });
  if (scanGambit(withSlot({ target: "self", condition: "self-buff", buff: "Parsimony", action: "ability:parsimony" }), charged, [selfAlly(charged)])?.kind !== "act") {
    throw new Error("parsimony fires");
  }
  const geoBolster = actorOf({ job: "GEO", skillName: "Club", levels: { GEO: 75 }, ability: { geoLevel: 75, geoMain: true } });
  if (scanGambit(withSlot({ target: "self", condition: "self-buff", buff: "Bolster", action: "ability:bolster" }), geoBolster, [selfAlly(geoBolster)])?.kind !== "act") {
    throw new Error("bolster");
  }
  const run = actorOf({ job: "RUN", skillName: "Sword", levels: { RUN: 75 }, shield: 0, ability: { runLevel: 75, runMain: true, runes: [] } });
  if (scanGambit(withSlot({ target: "self", condition: "ready", action: "ability:ignis" }), run, [selfAlly(run)])?.kind !== "act") throw new Error("ignis");
  const dnc = actorOf({
    job: "DNC",
    skillName: "Dagger",
    levels: { DNC: 75 },
    tp: 1000,
    targeted: true,
    distance: 2,
    foe: hare,
    ability: { dncLevel: 75, dncMain: true, tp: 1000, finishing: 0, chr: 60, hitChance: 95, hitRoll: 0 },
  });
  if (scanGambit(withSlot({ target: "foe", condition: "ready", action: "ability:quickstep" }), dnc, [selfAlly(dnc)])?.kind !== "act") throw new Error("quickstep");
  const cor = actorOf({
    job: "COR",
    skillName: "Sword",
    levels: { COR: 75 },
    ability: { corLevel: 75, corMain: true, die: 1, partyJobs: ["COR"], rolls: [] },
  });
  if (scanGambit(withSlot({ target: "self", condition: "self-buff", buff: "Corsair's Roll", action: "ability:corsair-s-roll" }), cor, [selfAlly(cor)])?.kind !== "act") {
    throw new Error("corsair roll");
  }
  const drg = actorOf({
    job: "DRG",
    skillName: "Polearm",
    levels: { DRG: 75 },
    targeted: true,
    distance: 2,
    foe: hare,
    ability: { drgLevel: 75, drgMain: true, dmg: 40, fstr: 8, hitChance: 95, hitRoll: 0 },
  });
  if (scanGambit(withSlot({ target: "foe", condition: "ready", action: "ability:jump" }), drg, [selfAlly(drg)])?.kind !== "act") throw new Error("jump");
  const smn = actorOf({ job: "SMN", skillName: "Staff", levels: { SMN: 75 }, ability: { smnLevel: 75, smnMain: true } });
  if (scanGambit(withSlot({ target: "self", condition: "self-buff", buff: "Astral Flow", action: "ability:astral-flow" }), smn, [selfAlly(smn)])?.kind !== "act") {
    throw new Error("astral flow");
  }
  const sleepSch = actorOf({
    job: "SCH",
    sub: null,
    skillName: "Staff",
    levels: { SCH: 75 },
    mp: 400,
    distance: 8,
    targeted: true,
    knownSpells: ["Sleep II"],
    foe: hare,
  });
  if (scanGambit(withSlot({ target: "foe", condition: "foe-debuff", buff: "Sleep", action: "spell:sleep-ii" }), sleepSch, [selfAlly(sleepSch)])) {
    throw new Error("sleep ii needs dark arts");
  }
  const arts = actorOf({ ...sleepSch, buffs: [{ name: "Dark Arts" }, { name: "Addendum: Black" }] });
  if (scanGambit(withSlot({ target: "foe", condition: "foe-debuff", buff: "Sleep", action: "spell:sleep-ii" }), arts, [selfAlly(arts)])?.kind !== "act") {
    throw new Error("sleep ii under addendum black");
  }
  const fireShot = actorOf({
    job: "COR",
    skillName: "Sword",
    levels: { COR: 75 },
    targeted: true,
    distance: 10,
    foe: hare,
    ability: { corLevel: 75, corMain: true, gun: true, bullet: true, gunDmg: 20, bulletDmg: 10, agi: 70, targetAgi: 40, die: 1, partyJobs: ["COR"], rolls: [] },
  });
  if (scanGambit(withSlot({ target: "foe", condition: "ready", action: "ability:fire-shot" }), fireShot, [selfAlly(fireShot)])?.kind !== "act") {
    throw new Error("fire shot");
  }
  const flourish = actorOf({
    job: "DNC",
    skillName: "Dagger",
    levels: { DNC: 75 },
    tp: 0,
    targeted: true,
    distance: 4,
    foe: hare,
    ability: { dncLevel: 75, dncMain: true, tp: 0, finishing: 2, chr: 60, hitChance: 95, hitRoll: 0 },
  });
  if (scanGambit(withSlot({ target: "foe", condition: "ready", action: "ability:animated-flourish" }), flourish, [selfAlly(flourish)])?.kind !== "act") {
    throw new Error("animated flourish");
  }
  const gauge = actorOf({
    job: "BST",
    skillName: "Axe",
    levels: { BST: 75 },
    targeted: true,
    distance: 8,
    foe: hare,
    ability: { bstLevel: 75, bstMain: true },
  });
  if (scanGambit(withSlot({ target: "foe", condition: "ready", action: "ability:gauge" }), gauge, [selfAlly(gauge)])?.kind !== "act") {
    throw new Error("gauge");
  }
  const called = actorOf({
    job: "DRG",
    skillName: "Polearm",
    levels: { DRG: 75 },
    petCalls: true,
    ability: { drgLevel: 75, drgMain: true, wyvernOut: false },
  });
  if (scanGambit(withSlot({ target: "self", condition: "ready", action: "ability:call-wyvern" }), called, [selfAlly(called)])?.kind !== "act") {
    throw new Error("call wyvern");
  }
  const quietPet = actorOf({ ...called, petCalls: false });
  if (scanGambit(withSlot({ target: "self", condition: "ready", action: "ability:call-wyvern" }), quietPet, [selfAlly(quietPet)])) {
    throw new Error("call wyvern is not this trust's pet");
  }
  const wyvernBusy = actorOf({ ...called, ability: { drgLevel: 75, drgMain: true, wyvernOut: true } });
  if (scanGambit(withSlot({ target: "self", condition: "ready", action: "ability:call-wyvern" }), wyvernBusy, [selfAlly(wyvernBusy)])) {
    throw new Error("call wyvern while one is out");
  }
  const beast = actorOf({
    job: "BST",
    skillName: "Axe",
    levels: { BST: 75 },
    petCalls: true,
    ability: { bstLevel: 75, bstMain: true, jugItem: "fish-oil-broth", jugLeft: 12, jugOut: false },
  });
  if (scanGambit(withSlot({ target: "self", condition: "ready", action: "ability:call-beast" }), beast, [selfAlly(beast)])?.kind !== "act") {
    throw new Error("call beast");
  }
  const quietBeast = actorOf({ ...beast, petCalls: false });
  if (scanGambit(withSlot({ target: "self", condition: "ready", action: "ability:call-beast" }), quietBeast, [selfAlly(quietBeast)])) {
    throw new Error("call beast is not this trust's pet");
  }
  const puppet = actorOf({
    job: "PUP",
    skillName: "Hand-to-Hand",
    levels: { PUP: 75 },
    petCalls: true,
    pupLevel: 75,
    pupMain: true,
    ability: { animator: true, automatonOut: false, otherPet: false },
  });
  if (scanGambit(withSlot({ target: "self", condition: "ready", action: "ability:activate" }), puppet, [selfAlly(puppet)])?.kind !== "act") {
    throw new Error("activate");
  }
  const quietPuppet = actorOf({ ...puppet, petCalls: false });
  if (scanGambit(withSlot({ target: "self", condition: "ready", action: "ability:activate" }), quietPuppet, [selfAlly(quietPuppet)])) {
    throw new Error("activate is not this trust's pet");
  }
  const charmer = actorOf({
    ...beast,
    arms: [{ skillName: "Axe", skill: 225, weaponName: "Axe" }],
    targeted: true,
    distance: 4,
    foe: hare,
    ability: { bstLevel: 75, bstMain: true, playerLevel: 75, playerChr: 70, playerInt: 53, targetLevel: 75, targetChr: 40, targetInt: 40, charmRoll: 1, foeAlive: true },
  });
  if (scanGambit(withSlot({ target: "foe", condition: "ready", action: "ability:charm" }), charmer, [selfAlly(charmer)])?.kind !== "act") {
    throw new Error("trust charm");
  }
  if (scanGambit(withSlot({ target: "foe", condition: "ready", action: "ability:tame" }), charmer, [selfAlly(charmer)])?.kind !== "act") {
    throw new Error("trust tame");
  }
  const charmingFar = actorOf({ ...charmer, distance: CHARM_RANGE + 0.5 });
  if (scanGambit(withSlot({ target: "foe", condition: "ready", action: "ability:charm" }), charmingFar, [selfAlly(charmingFar)])) {
    throw new Error("trust charm range");
  }
  const jugBusy = actorOf({ ...charmer, ability: { ...charmer.ability, jugOut: true } });
  if (scanGambit(withSlot({ target: "foe", condition: "ready", action: "ability:charm" }), jugBusy, [selfAlly(jugBusy)])) {
    throw new Error("trust charm while a jug is out");
  }
  if (scanGambit(withSlot({ target: "foe", condition: "ready", action: "ability:tame" }), jugBusy, [selfAlly(jugBusy)])) {
    throw new Error("trust tame while a jug is out");
  }
  const alreadyCharmed = actorOf({ ...charmer, ability: { ...charmer.ability, charmOut: true } });
  if (scanGambit(withSlot({ target: "foe", condition: "ready", action: "ability:charm" }), alreadyCharmed, [selfAlly(alreadyCharmed)])) {
    throw new Error("trust charm while charmed");
  }
  if (scanGambit(withSlot({ target: "foe", condition: "ready", action: "ability:tame" }), alreadyCharmed, [selfAlly(alreadyCharmed)])) {
    throw new Error("trust tame while charmed");
  }
  const charmedBeast = actorOf({ ...beast, ability: { bstLevel: 75, bstMain: true, jugItem: "fish-oil-broth", jugLeft: 12, jugOut: false, charmOut: true } });
  if (scanGambit(withSlot({ target: "self", condition: "ready", action: "ability:call-beast" }), charmedBeast, [selfAlly(charmedBeast)])) {
    throw new Error("call beast while charmed");
  }
  const charmingBusy = actorOf({ ...charmer, ability: { ...charmer.ability, jugOut: true, charmBlocked: true } });
  if (scanGambit(withSlot({ target: "foe", condition: "ready", action: "ability:charm" }), charmingBusy, [selfAlly(charmingBusy)])) {
    throw new Error("trust charm while a pet is out");
  }
  if (scanGambit(withSlot({ target: "foe", condition: "ready", action: "ability:tame" }), charmingBusy, [selfAlly(charmingBusy)])) {
    throw new Error("trust tame while a pet is out");
  }
  const namedFar = actorOf({ ...charmer, distance: 2, foe: { ...hare, id: "hare", yards: CHARM_RANGE + 1 } });
  if (scanGambit(withSlot({ target: "foe", condition: "ready", action: "ability:charm" }), namedFar, [selfAlly(namedFar)])) {
    throw new Error("trust charm uses the foe's yards");
  }
}
