import {
  accuracyFrom,
  baseDefense,
  critRate,
  evasionFrom,
  fStr,
  hitRate,
  mainHandAttack,
  mobDefense,
  NO_HASTE,
  swingTiming,
  tpPerHit,
  weaponDps,
  type SwingTiming,
} from "./formulas";
import { characterBase, type BaseStats, type JobId, type RaceId } from "./stats";
import { autoAttackRange } from "./distance";
import { attackBonus, defenseBonus, doubleAttackRate, maxHpBoost, smiteNumer, smiteApplies, fencerApplies, fencerBonus, damageLimitBonus, scale256 } from "./war";
import { celerity, clearMind, conserveMp, magicAttackBonus, magicBurstBonus } from "./blm";
import { autoRegen, whmClearMind } from "./whm";
import { fastCast, rdmClearMind, rdmDamageLimit, rdmMagicAttackBonus } from "./rdm";
import { kickRate as mnkKickRate, mnkDamageLimit, mnkMaxHp, mnkSmiteNumer } from "./mnk";
import { assassin, gilfinder, gravityResist, thfDamageLimit, thfEvasionBonus, treasureHunter, tripleAttackRate } from "./thf";
import { blindResist, demonKiller, samDamageLimit, storeTpMultiplier, zanshinRate } from "./sam";
import { accuracyBonus as rngAccuracy, deadAim as rngDeadAim, rapidShotRate, recycleRate, rngDamageLimit, snapshotRate } from "./rng";
import { pldDefenseBonus, pldMaxHp, pldRefresh, resistSleep, shieldBarrierDef, shieldMasteryTp, undeadKiller } from "./pld";
import { arcanaKiller, desperateBlowsHaste, drkAttackBonus, drkDamageLimit, drkJobLevel, drkSmiteNumer, occultAcumen, resistParalyze, stalwartConsume } from "./drk";
import { drgAccuracyBonus, drgAttackBonus, drgDamageLimit, drgJobLevel, drgSmiteNumer, dragonKiller, empathy, strafe } from "./drg";
import { bloodBoon, resistSlow, smnJobLevel, smnRefresh } from "./smn";
import { beastIntimidate, beastKiller, beastSpecialCut, bstDamageLimit, bstJobLevel, bstResistSlow, tandemBlow, tandemStrike } from "./bst";
import { handsDualWield, ninDamageLimit, ninDualWield, ninJobLevel, ninMaxHp, ninSubtleBlow, stealthMove } from "./nin";
import { combinedSkill, subjobLevel } from "./jobs";
import { applyMab, dStatMagicAccuracy, elementalD } from "./magic";
import { TROPICAL_RARAB } from "./rarab";
import { blueAccuracyBonus, blueAttackBonus, blueAutoRefresh, blueAutoRegen, blueBeastKiller, blueClearMind, blueConserveMp, blueDefenseBonus, blueEvasionBonus, blueFastCast, blueMagicAttackBonus, blueMaxHpBoost, blueMaxMpBoost, blueRapidShot, blueResistGravity, blueResistSleep, blueSetAgi, blueSetChr, blueSetDex, blueSetHp, blueSetInt, blueSetMnd, blueSetMp, blueSetStr, blueSetVit, blueStoreTp, blueUndeadKiller } from "./blu";
import { bestHandDelay, pupDamageLimit, pupEvasionBonus, pupResistSlow, pupSmiteNumer, puppetmasterJobLevel } from "./pup";
import { corRapidShot, corRecycle } from "./cor";
import { dancerJobLevel, dncAccuracyBonus, dncDamageLimit, dncDualWield, dncEvasionBonus, dncResistSlow, dncSubtleBlow } from "./dnc";
import { schClearMind, schConserveMp, schMaxMp } from "./sch";
import { runAccuracy, runAutoRegen, runMaxHp } from "./run";
import { geoCelerity, geoClearMind, geoConserveMp, geoMaxMp } from "./geo";

export const LEVEL = 75;

/** Naked Hume Warrior at the yard level. Same numbers the race/job grades produce. */
export const BASE: BaseStats = characterBase("hume", "WAR", LEVEL);

/**
 * Tropical Rarab in the yard. Level 75, inside the Bibiki Bay 73–76 range.
 * `hpNatural` is the retail maximum. The fight spends it.
 */
export const HARE = TROPICAL_RARAB;

export const HARE_DEF = mobDefense(HARE.defRankBase, HARE.vit);

/** While a field mob is being struck, formulas use that mob's defense instead of the pen. */
let hareDefenseOverride: number | null = null;

export function setHareDefenseOverride(value: number | null): void {
  hareDefenseOverride = value == null || !Number.isFinite(value) ? null : Math.max(0, value);
}

/** Wild Oats lowers VIT. Zero down keeps the baked defense, so an empty status does not move the number. */
export function hareLiveDefense(vitDown: number): number {
  if (vitDown <= 0) return hareDefenseOverride ?? HARE_DEF;
  if (hareDefenseOverride != null) return Math.max(1, hareDefenseOverride - Math.floor(vitDown / 2));
  return mobDefense(HARE.defRankBase, Math.max(0, HARE.vit - Math.floor(vitDown)));
}

export type Slot =
  | "main"
  | "sub"
  | "range"
  | "ammo"
  | "head"
  | "neck"
  | "ear1"
  | "ear2"
  | "body"
  | "hands"
  | "ring1"
  | "ring2"
  | "back"
  | "waist"
  | "legs"
  | "feet";

export const SLOT_LABEL: Record<Slot, string> = {
  main: "Main",
  sub: "Sub",
  range: "Range",
  ammo: "Ammo",
  head: "Head",
  neck: "Neck",
  ear1: "L.Ear",
  ear2: "R.Ear",
  body: "Body",
  hands: "Hands",
  ring1: "L.Ring",
  ring2: "R.Ring",
  back: "Back",
  waist: "Waist",
  legs: "Legs",
  feet: "Feet",
};

/** Retail equipment window: four columns, no empty silhouette gaps. */
export const PAPER_DOLL: Slot[] = [
  "main", "sub", "range", "ammo",
  "head", "neck", "ear1", "ear2",
  "body", "hands", "ring1", "ring2",
  "back", "waist", "legs", "feet",
];

export type Item = {
  id: string;
  name: string;
  slot: Slot;
  level: number;
  kind: string;
  jobs: string;
  /** In-game description line, e.g. "DMG:6 Delay:231". */
  line: string;
  dmg?: number;
  delay?: number;
  /** Weapon rank for the fSTR cap. Bronze and Onion swords are rank 0. */
  rank?: number;
  /** Accuracy from the item, such as Cesti's Accuracy+3. */
  acc?: number;
  hp?: number;
  mp?: number;
  /** Two-handed and hand-to-hand weapons leave no room for a shield. */
  grip?: "two";
  def?: number;
  str?: number;
  dex?: number;
  vit?: number;
  agi?: number;
  int?: number;
  mnd?: number;
  chr?: number;
  swatch: "bronze" | "wood" | "sea" | "cloth" | "oil";
};

export const ITEMS: Record<string, Item> = {
  "bronze-sword": {
    id: "bronze-sword",
    name: "Bronze Sword",
    slot: "main",
    level: 1,
    kind: "Sword",
    jobs: "WAR RDM THF PLD DRK BRD RNG NIN DRG BLU COR DNC RUN",
    line: "DMG:6 Delay:231",
    dmg: 6,
    delay: 231,
    rank: 0,
    swatch: "bronze",
  },
  "onion-sword": {
    id: "onion-sword",
    name: "Onion Sword",
    slot: "main",
    level: 1,
    kind: "Sword",
    jobs: "WAR RDM THF PLD DRK BST BRD RNG NIN DRG BLU COR DNC RUN",
    line: "DMG:5 Delay:228",
    dmg: 5,
    delay: 228,
    rank: 0,
    swatch: "wood",
  },
  // Level-1 weapon of each other combat skill. Numbers are the retail item lines
  // (BG-Wiki). Hand-to-hand delay is added to the 480 base, and its damage is
  // added to the base 3, so Cesti swings at 4 damage / 528 delay.
  cesti: {
    id: "cesti",
    name: "Cesti",
    slot: "main",
    level: 1,
    kind: "Hand-to-Hand",
    jobs: "WAR MNK RDM THF PLD DRK BST RNG DNC",
    line: "DMG:+1 Delay:+48 Accuracy+3",
    dmg: 4,
    delay: 528,
    acc: 3,
    rank: 0,
    grip: "two",
    swatch: "bronze",
  },
  // Cat Baghnakhs. DMG:+2 Delay:+60 on the 3 / 480 hand-to-hand base.
  // Cesti's job line does not include Puppetmaster.
  "cat-baghnakhs": {
    id: "cat-baghnakhs",
    name: "Cat Baghnakhs",
    slot: "main",
    level: 1,
    kind: "Hand-to-Hand",
    jobs: "WAR MNK RDM THF DRK BST NIN PUP DNC",
    line: "DMG:+2 Delay:+60",
    dmg: 5,
    delay: 540,
    rank: 0,
    grip: "two",
    swatch: "bronze",
  },
  "bronze-dagger": {
    id: "bronze-dagger",
    name: "Bronze Dagger",
    slot: "main",
    level: 1,
    kind: "Dagger",
    jobs: "WAR BLM RDM THF PLD DRK BST BRD RNG SAM NIN DRG SMN SCH GEO PUP COR DNC",
    line: "DMG:3 Delay:183",
    dmg: 3,
    delay: 183,
    rank: 0,
    swatch: "bronze",
  },
  "rusty-greatsword": {
    id: "rusty-greatsword",
    name: "Rusty Greatsword",
    slot: "main",
    level: 1,
    kind: "Great Sword",
    jobs: "WAR PLD DRK RUN",
    line: "DMG:14 Delay:456",
    dmg: 14,
    delay: 456,
    rank: 0,
    grip: "two",
    swatch: "bronze",
  },
  "bronze-axe": {
    id: "bronze-axe",
    name: "Bronze Axe",
    slot: "main",
    level: 1,
    kind: "Axe",
    jobs: "WAR DRK BST RNG RUN",
    line: "DMG:8 Delay:276",
    dmg: 8,
    delay: 276,
    rank: 0,
    swatch: "bronze",
  },
  // No combat great axe is level 1. Butterfly Axe is the first real one.
  "butterfly-axe": {
    id: "butterfly-axe",
    name: "Butterfly Axe",
    slot: "main",
    level: 5,
    kind: "Great Axe",
    jobs: "WAR DRK RUN",
    line: "DMG:19 Delay:504",
    dmg: 19,
    delay: 504,
    rank: 0,
    grip: "two",
    swatch: "bronze",
  },
  "bronze-zaghnal": {
    id: "bronze-zaghnal",
    name: "Bronze Zaghnal",
    slot: "main",
    level: 1,
    kind: "Scythe",
    jobs: "WAR DRK BST",
    line: "DMG:14 Delay:480",
    dmg: 14,
    delay: 480,
    rank: 0,
    grip: "two",
    swatch: "bronze",
  },
  harpoon: {
    id: "harpoon",
    name: "Harpoon",
    slot: "main",
    level: 1,
    kind: "Polearm",
    jobs: "WAR PLD SAM DRG",
    line: "DMG:8 Delay:396",
    dmg: 8,
    delay: 396,
    rank: 0,
    grip: "two",
    swatch: "bronze",
  },
  kunai: {
    id: "kunai",
    name: "Kunai",
    slot: "main",
    level: 1,
    kind: "Katana",
    jobs: "NIN",
    line: "DMG:4 Delay:190",
    dmg: 4,
    delay: 190,
    rank: 0,
    swatch: "bronze",
  },
  "kunai-off": {
    id: "kunai-off",
    name: "Kunai",
    slot: "sub",
    level: 1,
    kind: "Katana",
    jobs: "NIN",
    line: "DMG:4 Delay:190",
    dmg: 4,
    delay: 190,
    rank: 0,
    swatch: "bronze",
  },
  "bronze-dagger-off": {
    id: "bronze-dagger-off",
    name: "Bronze Dagger",
    slot: "sub",
    level: 1,
    kind: "Dagger",
    jobs: "WAR BLM RDM THF PLD DRK BST BRD RNG SAM NIN DRG SMN SCH GEO PUP COR DNC",
    line: "DMG:3 Delay:183",
    dmg: 3,
    delay: 183,
    rank: 0,
    swatch: "bronze",
  },
  "trainee-burin": {
    id: "trainee-burin",
    name: "Trainee Burin",
    slot: "main",
    level: 1,
    kind: "Katana",
    jobs: "All Jobs",
    line: "DMG:1 Delay:190",
    dmg: 1,
    delay: 190,
    rank: 0,
    swatch: "bronze",
  },
  mumeito: {
    id: "mumeito",
    name: "Mumeito",
    slot: "main",
    level: 1,
    kind: "Great Katana",
    jobs: "SAM",
    line: "DMG:12 Delay:420",
    dmg: 12,
    delay: 420,
    rank: 0,
    grip: "two",
    swatch: "bronze",
  },
  "hardwood-katana": {
    id: "hardwood-katana",
    name: "Hardwood Katana",
    slot: "main",
    level: 1,
    kind: "Great Katana",
    jobs: "All Jobs",
    line: "DMG:5 Delay:450",
    dmg: 5,
    delay: 450,
    rank: 0,
    grip: "two",
    swatch: "wood",
  },
  "ash-club": {
    id: "ash-club",
    name: "Ash Club",
    slot: "main",
    level: 1,
    kind: "Club",
    jobs: "All Jobs",
    line: "DMG:4 Delay:264",
    dmg: 4,
    delay: 264,
    rank: 0,
    swatch: "wood",
  },
  "ash-staff": {
    id: "ash-staff",
    name: "Ash Staff",
    slot: "main",
    level: 1,
    kind: "Staff",
    jobs: "WAR MNK WHM BLM RDM BST BRD SMN SCH GEO",
    line: "DMG:5 Delay:366 HP+2 MP+2",
    dmg: 5,
    delay: 366,
    hp: 2,
    mp: 2,
    rank: 0,
    grip: "two",
    swatch: "wood",
  },
  shortbow: {
    id: "shortbow",
    name: "Shortbow",
    slot: "range",
    level: 1,
    kind: "Archery",
    jobs: "WAR RDM THF PLD DRK BST RNG SAM NIN",
    line: "DMG:5 Delay:360",
    dmg: 5,
    delay: 360,
    rank: 0,
    swatch: "wood",
  },
  "maple-harp": {
    id: "maple-harp",
    name: "Maple Harp",
    slot: "range",
    level: 1,
    kind: "String",
    jobs: "BRD",
    line: "A string instrument. Singing plus String Instrument.",
    rank: 0,
    swatch: "wood",
  },
  handbell: {
    id: "handbell",
    name: "Handbell",
    slot: "range",
    level: 1,
    kind: "Handbell",
    jobs: "GEO",
    line: "A handbell. Geomancy plus Handbell. No stats.",
    rank: 0,
    swatch: "bronze",
  },
  piccolo: {
    id: "piccolo",
    name: "Piccolo",
    slot: "range",
    level: 1,
    kind: "Wind",
    jobs: "BRD",
    line: "A wind instrument. Singing plus Wind Instrument.",
    rank: 0,
    swatch: "wood",
  },
  "light-crossbow": {
    id: "light-crossbow",
    name: "Light Crossbow",
    slot: "range",
    level: 1,
    kind: "Marksmanship",
    jobs: "WAR DRK RNG",
    line: "DMG:6 Delay:288",
    dmg: 6,
    delay: 288,
    rank: 0,
    swatch: "wood",
  },
  musketoon: {
    id: "musketoon",
    name: "Musketoon",
    slot: "range",
    level: 1,
    kind: "Marksmanship",
    jobs: "COR",
    line: "DMG:8 Delay:360",
    dmg: 8,
    delay: 360,
    rank: 0,
    swatch: "bronze",
  },
  animator: {
    id: "animator",
    name: "Animator",
    slot: "range",
    level: 1,
    kind: "Animator",
    jobs: "PUP",
    line: "This device transmits commands to an automaton. It has no damage and no delay. Activate and maneuvers need it equipped.",
    rank: 0,
    swatch: "bronze",
  },
  pebble: {
    id: "pebble",
    name: "Pebble",
    slot: "ammo",
    level: 1,
    kind: "Throwing",
    jobs: "WAR MNK WHM BLM THF DRK BST BRD RNG NIN DRG SMN",
    line: "DMG:5 Delay:276",
    dmg: 5,
    delay: 276,
    rank: 0,
    swatch: "wood",
  },
  "wooden-arrow": {
    id: "wooden-arrow",
    name: "Wooden Arrow",
    slot: "ammo",
    level: 1,
    kind: "Arrow",
    jobs: "All Jobs",
    line: "DMG:5 Delay:120",
    dmg: 5,
    delay: 120,
    rank: 0,
    swatch: "wood",
  },
  "bronze-bolt": {
    id: "bronze-bolt",
    name: "Bronze Bolt",
    slot: "ammo",
    level: 1,
    kind: "Bolt",
    jobs: "WAR DRK RNG",
    line: "DMG:10 Delay:192",
    dmg: 10,
    delay: 192,
    rank: 0,
    swatch: "bronze",
  },
  "bronze-bullet": {
    id: "bronze-bullet",
    name: "Bronze Bullet",
    slot: "ammo",
    level: 1,
    kind: "Bullet",
    jobs: "COR",
    line: "DMG:10 Delay:192",
    dmg: 10,
    delay: 192,
    rank: 0,
    swatch: "bronze",
  },
  "fish-oil-broth": {
    id: "fish-oil-broth",
    name: "Fish Oil Broth",
    slot: "ammo",
    level: 23,
    kind: "Jug",
    jobs: "BST",
    line: "Calls Courier Carrie.",
    swatch: "oil",
  },
  "automaton-oil": {
    id: "automaton-oil",
    name: "Automaton Oil",
    slot: "ammo",
    level: 15,
    kind: "Oil",
    jobs: "PUP",
    line: "This oil gradually restores a few of your automaton's HP. Repair spends one.",
    swatch: "oil",
  },
  "pet-food-alpha": {
    id: "pet-food-alpha",
    name: "Pet Food Alpha",
    slot: "ammo",
    level: 12,
    kind: "Pet Food",
    jobs: "A biscuit created by the legendary beastmaster Moui. It contains all the nutrients a beast needs for a healthy diet.",
    line: "Reward uses one from the bag. It is not equipped.",
    swatch: "wood",
  },
  "pet-food-beta": {
    id: "pet-food-beta",
    name: "Pet Food Beta",
    slot: "ammo",
    level: 24,
    kind: "Pet Food",
    jobs: "A biscuit created by the legendary beastmaster Moui. It contains all the nutrients a beast needs for a healthy diet.",
    line: "Reward uses one from the bag. It is not equipped.",
    swatch: "wood",
  },
  "pet-food-gamma": {
    id: "pet-food-gamma",
    name: "Pet Food Gamma",
    slot: "ammo",
    level: 36,
    kind: "Pet Food",
    jobs: "A biscuit created by the legendary beastmaster Moui. It contains all the nutrients a beast needs for a healthy diet.",
    line: "Reward uses one from the bag. It is not equipped.",
    swatch: "wood",
  },
  "pet-food-delta": {
    id: "pet-food-delta",
    name: "Pet Food Delta",
    slot: "ammo",
    level: 48,
    kind: "Pet Food",
    jobs: "A biscuit created by the legendary beastmaster Moui. It contains all the nutrients a beast needs for a healthy diet.",
    line: "Reward uses one from the bag. It is not equipped.",
    swatch: "wood",
  },
  "pet-food-epsilon": {
    id: "pet-food-epsilon",
    name: "Pet Food Epsilon",
    slot: "ammo",
    level: 60,
    kind: "Pet Food",
    jobs: "A biscuit created by the legendary beastmaster Moui. It contains all the nutrients a beast needs for a healthy diet.",
    line: "Reward uses one from the bag. It is not equipped.",
    swatch: "wood",
  },
  "pet-food-zeta": {
    id: "pet-food-zeta",
    name: "Pet Food Zeta",
    slot: "ammo",
    level: 72,
    kind: "Pet Food",
    jobs: "A biscuit created by the legendary beastmaster Moui. It contains all the nutrients a beast needs for a healthy diet.",
    line: "Reward uses one from the bag. It is not equipped.",
    swatch: "wood",
  },
  "lauan-shield": {
    id: "lauan-shield",
    name: "Lauan Shield",
    slot: "sub",
    level: 1,
    kind: "Shield",
    jobs: "WAR WHM RDM THF PLD BST SAM",
    line: "DEF:1",
    def: 1,
    swatch: "wood",
  },
  "marine-shield": {
    id: "marine-shield",
    name: "Marine Shield",
    slot: "sub",
    level: 1,
    kind: "Shield",
    jobs: "WAR RDM PLD BST SAM",
    line: "DEF:1 VIT+1 AGI+1",
    def: 1,
    vit: 1,
    agi: 1,
    swatch: "sea",
  },
  "bronze-harness": {
    id: "bronze-harness",
    name: "Bronze Harness",
    slot: "body",
    level: 1,
    kind: "Armor",
    jobs: "WAR MNK PUP RDM THF PLD DRK BST BRD SAM NIN DRG BLU COR DNC RUN",
    line: "DEF:4",
    def: 4,
    swatch: "bronze",
  },
  "bronze-mittens": {
    id: "bronze-mittens",
    name: "Bronze Mittens",
    slot: "hands",
    level: 1,
    kind: "Armor",
    jobs: "WAR MNK PUP RDM THF PLD DRK BST BRD SAM NIN DRG BLU COR DNC RUN",
    line: "DEF:1",
    def: 1,
    swatch: "bronze",
  },
  "bronze-subligar": {
    id: "bronze-subligar",
    name: "Bronze Subligar",
    slot: "legs",
    level: 1,
    kind: "Armor",
    jobs: "WAR MNK PUP RDM THF PLD DRK BST BRD SAM NIN DRG BLU COR DNC RUN",
    line: "DEF:3",
    def: 3,
    swatch: "bronze",
  },
  "bronze-leggings": {
    id: "bronze-leggings",
    name: "Bronze Leggings",
    slot: "feet",
    level: 1,
    kind: "Armor",
    jobs: "WAR MNK PUP RDM THF PLD DRK BST BRD SAM NIN DRG BLU COR DNC RUN",
    line: "DEF:1",
    def: 1,
    swatch: "bronze",
  },
  "kingdom-aketon": {
    id: "kingdom-aketon",
    name: "Kingdom Aketon",
    slot: "body",
    level: 1,
    kind: "Armor",
    jobs: "All Jobs",
    line: "DEF:1 Increases chances of obtaining crystals. In San d'Oria lands: Movement speed +12%",
    def: 1,
    swatch: "cloth",
  },
  "rabbit-hide": {
    id: "rabbit-hide",
    name: "Rabbit Hide",
    slot: "ammo",
    level: 1,
    kind: "Material",
    jobs: "None",
    line: "The small hide of a wild rabbit.",
    swatch: "cloth",
  },
  "hare-meat": {
    id: "hare-meat",
    name: "Hare Meat",
    slot: "ammo",
    level: 1,
    kind: "Material",
    jobs: "None",
    line: "A tasty piece of hare meat.",
    swatch: "wood",
  },
  "copper-ore": { id: "copper-ore", name: "Copper Ore", slot: "ammo", level: 1, kind: "Material", jobs: "None", line: "A chunk of copper ore.", swatch: "bronze" },
  "flint-stone": { id: "flint-stone", name: "Flint Stone", slot: "ammo", level: 1, kind: "Material", jobs: "None", line: "A small flint stone.", swatch: "oil" },
  "zinc-ore": { id: "zinc-ore", name: "Zinc Ore", slot: "ammo", level: 1, kind: "Material", jobs: "None", line: "A chunk of zinc ore.", swatch: "sea" },
  "silver-ore": { id: "silver-ore", name: "Silver Ore", slot: "ammo", level: 1, kind: "Material", jobs: "None", line: "A chunk of silver ore.", swatch: "sea" },
  "bat-wing": { id: "bat-wing", name: "Bat Wing", slot: "ammo", level: 1, kind: "Material", jobs: "None", line: "The wing of a bat.", swatch: "oil" },
  "fiend-blood": { id: "fiend-blood", name: "Fiend Blood", slot: "ammo", level: 1, kind: "Material", jobs: "None", line: "A vial of fiend blood.", swatch: "oil" },
  "sleepshroom": { id: "sleepshroom", name: "Sleepshroom", slot: "ammo", level: 1, kind: "Material", jobs: "None", line: "A drowzy mushroom.", swatch: "wood" },
  "woozyshroom": { id: "woozyshroom", name: "Woozyshroom", slot: "ammo", level: 1, kind: "Material", jobs: "None", line: "A mushroom that makes the head swim.", swatch: "wood" },
  "lufet-salt": { id: "lufet-salt", name: "Lufet Salt", slot: "ammo", level: 1, kind: "Material", jobs: "None", line: "A pinch of lufet salt.", swatch: "sea" },
  "rock-salt": { id: "rock-salt", name: "Rock Salt", slot: "ammo", level: 1, kind: "Material", jobs: "None", line: "A cluster of rock salt.", swatch: "sea" },
  "beetle-jaw": { id: "beetle-jaw", name: "Beetle Jaw", slot: "ammo", level: 1, kind: "Material", jobs: "None", line: "The mandible of a beetle.", swatch: "oil" },
  "insect-wing": { id: "insect-wing", name: "Insect Wing", slot: "ammo", level: 1, kind: "Material", jobs: "None", line: "A thin insect wing.", swatch: "sea" },
  "orcish-axe": { id: "orcish-axe", name: "Orcish Axe", slot: "ammo", level: 1, kind: "Material", jobs: "None", line: "A crude orcish axe.", swatch: "bronze" },
  "beastcoin": { id: "beastcoin", name: "Beastcoin", slot: "ammo", level: 1, kind: "Material", jobs: "None", line: "A coin minted by beastmen.", swatch: "bronze" },
  "wild-onion": { id: "wild-onion", name: "Wild Onion", slot: "ammo", level: 1, kind: "Material", jobs: "None", line: "A pungent wild onion.", swatch: "wood" },
  "goblin-armor": { id: "goblin-armor", name: "Goblin Armor", slot: "ammo", level: 1, kind: "Material", jobs: "None", line: "A suit of goblin armor.", swatch: "bronze" },
  "goblin-mask": { id: "goblin-mask", name: "Goblin Mask", slot: "ammo", level: 1, kind: "Material", jobs: "None", line: "A leering goblin mask.", swatch: "wood" },
  "goblin-mail": { id: "goblin-mail", name: "Goblin Mail", slot: "ammo", level: 1, kind: "Material", jobs: "None", line: "A shirt of goblin mail.", swatch: "bronze" },
  "goblin-helm": { id: "goblin-helm", name: "Goblin Helm", slot: "ammo", level: 1, kind: "Material", jobs: "None", line: "A dented goblin helm.", swatch: "bronze" },
  "cotton-thread": { id: "cotton-thread", name: "Cotton Thread", slot: "ammo", level: 1, kind: "Material", jobs: "None", line: "A spool of cotton thread.", swatch: "cloth" },
  "cotton-cloth": { id: "cotton-cloth", name: "Cotton Cloth", slot: "ammo", level: 1, kind: "Material", jobs: "None", line: "A bolt of cotton cloth.", swatch: "cloth" },
  "grass-thread": { id: "grass-thread", name: "Grass Thread", slot: "ammo", level: 1, kind: "Material", jobs: "None", line: "Thread spun from grass.", swatch: "wood" },
  "grass-cloth": { id: "grass-cloth", name: "Grass Cloth", slot: "ammo", level: 1, kind: "Material", jobs: "None", line: "Cloth woven from grass.", swatch: "wood" },
  "bone-chip": { id: "bone-chip", name: "Bone Chip", slot: "ammo", level: 1, kind: "Material", jobs: "None", line: "A chip of bone.", swatch: "cloth" },
  "revival-tree-root": { id: "revival-tree-root", name: "Revival Tree Root", slot: "ammo", level: 1, kind: "Material", jobs: "None", line: "A root from a revival tree.", swatch: "wood" },
  "wolf-hide": { id: "wolf-hide", name: "Wolf Hide", slot: "ammo", level: 1, kind: "Material", jobs: "None", line: "The hide of a hound.", swatch: "oil" },
  "giant-sheep-meat": { id: "giant-sheep-meat", name: "Giant Sheep Meat", slot: "ammo", level: 1, kind: "Material", jobs: "None", line: "A cut of giant sheep meat.", swatch: "wood" },
  "sheep-tooth": { id: "sheep-tooth", name: "Sheep Tooth", slot: "ammo", level: 1, kind: "Material", jobs: "None", line: "A thick sheep tooth.", swatch: "cloth" },
  "sheepskin": { id: "sheepskin", name: "Sheepskin", slot: "ammo", level: 1, kind: "Material", jobs: "None", line: "A woolly sheepskin.", swatch: "cloth" },
  "sheep-wool": { id: "sheep-wool", name: "Sheep Wool", slot: "ammo", level: 1, kind: "Material", jobs: "None", line: "A tuft of sheep wool.", swatch: "cloth" },
  "bomb-arm": { id: "bomb-arm", name: "Bomb Arm", slot: "ammo", level: 1, kind: "Material", jobs: "None", line: "The arm of a bomb.", swatch: "bronze" },
  "bomb-ash": { id: "bomb-ash", name: "Bomb Ash", slot: "ammo", level: 1, kind: "Material", jobs: "None", line: "Ash left by a bomb.", swatch: "oil" },
  "tenax-strap": { id: "tenax-strap", name: "Tenax Strap", slot: "ammo", level: 1, kind: "Material", jobs: "None", line: "A strap of tenax leather.", swatch: "oil" },
  "clipeus": { id: "clipeus", name: "Clipeus", slot: "ammo", level: 1, kind: "Material", jobs: "None", line: "The shell-shield of the Fungus Beetle.", swatch: "bronze" },
  "rabbit-charm": { id: "rabbit-charm", name: "Rabbit Charm", slot: "ammo", level: 1, kind: "Material", jobs: "None", line: "A charm dropped by Jaggedy-Eared Jack.", swatch: "wood" },
  "scroll-of-bind": { id: "scroll-of-bind", name: "Scroll of Bind", slot: "ammo", level: 1, kind: "Material", jobs: "None", line: "A scroll inscribed with Bind.", swatch: "cloth" },
  "scroll-of-blind": { id: "scroll-of-blind", name: "Scroll of Blind", slot: "ammo", level: 1, kind: "Material", jobs: "None", line: "A scroll inscribed with Blind.", swatch: "cloth" },
  "ash-clogs": { id: "ash-clogs", name: "Ash Clogs", slot: "ammo", level: 1, kind: "Material", jobs: "None", line: "A pair of ash clogs.", swatch: "wood" },
  "circlet": { id: "circlet", name: "Circlet", slot: "ammo", level: 1, kind: "Material", jobs: "None", line: "A simple circlet.", swatch: "bronze" },
  "bronze-cap": { id: "bronze-cap", name: "Bronze Cap", slot: "ammo", level: 1, kind: "Material", jobs: "None", line: "A bronze cap.", swatch: "bronze" },
  "san-dorian-carrot": { id: "san-dorian-carrot", name: "San d'Orian Carrot", slot: "ammo", level: 1, kind: "Material", jobs: "None", line: "A carrot from the San d'Orian meadows.", swatch: "wood" },
  "clothespole": { id: "clothespole", name: "Clothespole", slot: "ammo", level: 1, kind: "Material", jobs: "None", line: "A fishing pole of clothespole wood.", swatch: "wood" },
  "yew-fishing-rod": { id: "yew-fishing-rod", name: "Yew Fishing Rod", slot: "ammo", level: 1, kind: "Material", jobs: "None", line: "A yew fishing rod.", swatch: "wood" },
  "fastwater-fishing-rod": { id: "fastwater-fishing-rod", name: "Fastwater Fishing Rod", slot: "ammo", level: 1, kind: "Material", jobs: "None", line: "A rod for fast water.", swatch: "wood" },
  "moat-carp": { id: "moat-carp", name: "Moat Carp", slot: "ammo", level: 1, kind: "Material", jobs: "None", line: "A freshwater fish from lakes and marshes. Skill 11.", swatch: "sea" },
  "bamboo-fishing-rod": { id: "bamboo-fishing-rod", name: "Bamboo Fishing Rod", slot: "range", level: 1, kind: "Fishing Rod", jobs: "All Jobs", line: "A level 1 rod. Equip it in the ranged slot.", swatch: "wood" },
  "little-worm": { id: "little-worm", name: "Little Worm", slot: "ammo", level: 1, kind: "Bait", jobs: "All Jobs", line: "A common dirt worm. Equip it in the ammo slot. Bait for moat carp.", swatch: "wood" },
  "iron-ore": { id: "iron-ore", name: "Iron Ore", slot: "ammo", level: 1, kind: "Material", jobs: "None", line: "A chunk of iron ore.", swatch: "bronze" },
  "mythril-ore": { id: "mythril-ore", name: "Mythril Ore", slot: "ammo", level: 1, kind: "Material", jobs: "None", line: "A chunk of mythril ore.", swatch: "sea" },
  "gold-ore": { id: "gold-ore", name: "Gold Ore", slot: "ammo", level: 1, kind: "Material", jobs: "None", line: "A chunk of gold ore.", swatch: "bronze" },
  "translucent-rock": { id: "translucent-rock", name: "Translucent Rock", slot: "ammo", level: 1, kind: "Material", jobs: "None", line: "A pale colored rock.", swatch: "cloth" },
  "white-rock": { id: "white-rock", name: "White Rock", slot: "ammo", level: 1, kind: "Material", jobs: "None", line: "A white colored rock.", swatch: "cloth" },
  "black-rock": { id: "black-rock", name: "Black Rock", slot: "ammo", level: 1, kind: "Material", jobs: "None", line: "A black colored rock.", swatch: "oil" },
  "pugil-scales": { id: "pugil-scales", name: "Pugil Scales", slot: "ammo", level: 1, kind: "Material", jobs: "None", line: "Scales from a pugil.", swatch: "sea" },
  "shall-shell": { id: "shall-shell", name: "Shall Shell", slot: "ammo", level: 1, kind: "Material", jobs: "None", line: "The shell of a shall pugil.", swatch: "sea" },
  "gelong-staff": { id: "gelong-staff", name: "Gelong Staff", slot: "ammo", level: 1, kind: "Material", jobs: "None", line: "The staff of Swamfisk.", swatch: "wood" },
  "bukktooth": { id: "bukktooth", name: "Bukktooth", slot: "ammo", level: 1, kind: "Material", jobs: "None", line: "A tooth from the ram Rambukk.", swatch: "cloth" },
  "bat-fang": { id: "bat-fang", name: "Bat Fang", slot: "ammo", level: 1, kind: "Material", jobs: "None", line: "A fang from a giant bat.", swatch: "cloth" },
  "ranperre-chest-key": { id: "ranperre-chest-key", name: "Ranperre Chest Key", slot: "ammo", level: 1, kind: "Material", jobs: "None", line: "A key to a chest in King Ranperre's Tomb.", swatch: "bronze" },
  "animal-glue": { id: "animal-glue", name: "Animal Glue", slot: "ammo", level: 1, kind: "Material", jobs: "None", line: "A pot of animal glue.", swatch: "wood" },
  "beetle-shell": { id: "beetle-shell", name: "Beetle Shell", slot: "ammo", level: 1, kind: "Material", jobs: "None", line: "A plate of beetle shell.", swatch: "bronze" },
  "scorpion-claw": { id: "scorpion-claw", name: "Scorpion Claw", slot: "ammo", level: 1, kind: "Material", jobs: "None", line: "The pincer of a scorpion.", swatch: "oil" },
  "scorpion-shell": { id: "scorpion-shell", name: "Scorpion Shell", slot: "ammo", level: 1, kind: "Material", jobs: "None", line: "A plate of scorpion shell.", swatch: "oil" },
  "hecteyes-eye": { id: "hecteyes-eye", name: "Hecteyes Eye", slot: "ammo", level: 1, kind: "Material", jobs: "None", line: "One eye from a hecteyes.", swatch: "sea" },
  "fruit-seeds": { id: "fruit-seeds", name: "Fruit Seeds", slot: "ammo", level: 1, kind: "Material", jobs: "None", line: "Seeds shaken from a sapling.", swatch: "wood" },
  "treant-bulb": { id: "treant-bulb", name: "Treant Bulb", slot: "ammo", level: 1, kind: "Material", jobs: "None", line: "A bulb cut from a treant.", swatch: "wood" },
  "poison-flour": { id: "poison-flour", name: "Poison Flour", slot: "ammo", level: 1, kind: "Material", jobs: "None", line: "A sack of poisoned flour.", swatch: "cloth" },
  "slime-oil": { id: "slime-oil", name: "Slime Oil", slot: "ammo", level: 1, kind: "Material", jobs: "None", line: "Oil skimmed off a slime.", swatch: "sea" },
  "divine-log": { id: "divine-log", name: "Divine Log", slot: "ammo", level: 1, kind: "Material", jobs: "None", line: "A log from the Cemetery Cherry.", swatch: "wood" },
  "petrified-log": { id: "petrified-log", name: "Petrified Log", slot: "ammo", level: 1, kind: "Material", jobs: "None", line: "A log turned to stone.", swatch: "bronze" },
};

export const ALL_ITEM_IDS = Object.keys(ITEMS);

/** Fish Oil Broth. Stack 12. Call Beast spends one. Bestial Loyalty does not. */
export const FISH_OIL_BROTH = "fish-oil-broth";
export const JUG_STACK = 12;

/** Automaton Oil. Stack 12. Equipped in the ammo slot. Repair spends one. */
export const AUTOMATON_OIL = "automaton-oil";
export const OIL_STACK = 12;

/** Pet Food Zeta. Stack 12. Reward spends one from the bag. It is not equipped. */
export const PET_FOOD_ZETA = "pet-food-zeta";
export const ZETA_STACK = 12;

/** Jugs in the bag. A save from before the broth existed still has the full stack. */
export function jugCount(inventory: Record<string, number> | undefined, id: string): number {
  if (id !== FISH_OIL_BROTH) return 0;
  if (!inventory || !(id in inventory)) return JUG_STACK;
  const n = inventory[id];
  return typeof n === "number" && Number.isFinite(n) ? Math.max(0, Math.min(JUG_STACK, Math.floor(n))) : 0;
}

/** Automaton Oil in the bag. A save from before the can existed still has the full stack. */
export function oilCount(inventory: Record<string, number> | undefined): number {
  if (!inventory || !(AUTOMATON_OIL in inventory)) return OIL_STACK;
  const n = inventory[AUTOMATON_OIL];
  return typeof n === "number" && Number.isFinite(n) ? Math.max(0, Math.min(OIL_STACK, Math.floor(n))) : 0;
}

/** Pet Food Zeta in the bag. A save from before the biscuit existed still has the full stack. */
export function zetaCount(inventory: Record<string, number> | undefined): number {
  return petFoodCount(inventory, PET_FOOD_ZETA);
}

/** One pet-food stack. A save from before that biscuit existed still has the full stack. */
export function petFoodCount(inventory: Record<string, number> | undefined, id: string): number {
  if (ITEMS[id]?.kind !== "Pet Food") return 0;
  if (!inventory || !(id in inventory)) return ZETA_STACK;
  const n = inventory[id];
  return typeof n === "number" && Number.isFinite(n) ? Math.max(0, Math.min(ZETA_STACK, Math.floor(n))) : 0;
}

/** Every pet food stack currently defined. Missing keys are a full stack. */
export function petFoodCounts(inventory: Record<string, number> | undefined): Record<string, number> {
  const out: Record<string, number> = {};
  for (const id of ALL_ITEM_IDS) {
    if (ITEMS[id]?.kind === "Pet Food") out[id] = petFoodCount(inventory, id);
  }
  return out;
}

export type Loadout = Record<Slot, string | null>;

export const DEFAULT_LOADOUT: Loadout = {
  main: "bronze-sword",
  sub: null,
  range: null,
  ammo: null,
  head: null,
  neck: null,
  ear1: null,
  ear2: null,
  body: "bronze-harness",
  hands: "bronze-mittens",
  ring1: null,
  ring2: null,
  back: null,
  waist: null,
  legs: "bronze-subligar",
  feet: "bronze-leggings",
};

export type Sheet = {
  hp: number;
  mp: number;
  str: number;
  dex: number;
  vit: number;
  agi: number;
  int: number;
  mnd: number;
  chr: number;
  /** Race + job, before equipment. The white numbers on the status panel. */
  naked: BaseStats;
  /** Attack before Berserk, Defender, Warcry, and Smite. Flats only. */
  attackFlat: number;
  /** Smite's /256 term. 0 unless the weapon is hand-to-hand or two-handed. */
  smite: number;
  attack: number;
  defenseFlat: number;
  defense: number;
  accuracy: number;
  evasion: number;
  /** Fencer TP bonus. Weapon skills are not calculated yet; the number is ready. */
  fencerTp: number;
  /** Physical pDIF cap after Damage Limit+. */
  pdifCap: number;
  delay: number;
  swing: SwingTiming;
  tpHit: number;
  dps: number;
  dmg: number;
  fstr: number;
  hit: number;
  crit: number;
  weaponName: string;
  /** Auto-attack reach, center to center, in yalms. */
  reach: number;
  /** Combat skill in the main hand, always the job's cap at this level. */
  skillName: string;
  skill: number;
  /**
   * Swings inside one attack round before Double Attack. Hand-to-hand is
   * 2 when the job's Hand-to-Hand skill is above 0, and 1 when it is not.
   * Other weapons are always 1. Double Attack is rolled once per fist
   * and cannot proc off its own extra hit. The rate is 0 until level 25.
   */
  hands: number;
  /** Proc chance from the Double Attack trait at the current level. */
  doubleAttack: number;
  /** Proc chance from Triple Attack. Checked before Double Attack. 0 unless Thief has the trait. */
  tripleAttack: number;
  /** Evasion Bonus already included in evasion. 0 unless Thief has the trait. */
  evasionBonus: number;
  /** Treasure Hunter tier from the Thief trait. Gear that adds more is not worn yet. */
  treasureHunter: number;
  /** Gilfinder is learned. The hare has no gil, so it is not rolled. */
  gilfinder: boolean;
  /** Resist Gravity chance. Nothing here puts Gravity on you, so it is not rolled. */
  gravityResist: number;
  /** Assassin. Main Thief 60+. A Trick Attack lined up behind a party member also critical hits. The AGI is Trick Attack, not this trait. Hide does not replace the party member. */
  assassin: boolean;
  /** Store TP multiplier. 1 when Samurai has not learned it. */
  storeTp: number;
  /** Zanshin proc chance after a miss. 0 when Samurai has not learned it. */
  zanshin: number;
  /** Resist Blind chance. Dust Cloud rolls this Resist! check. */
  blindResist: number;
  /** Demon Killer is learned. The hare is not a demon, so it is not rolled. */
  demonKiller: boolean;
  /** Kick Attacks proc while this sheet is hand-to-hand. 0 otherwise. Footwork adds 20% at swing time. */
  kickRate: number;
  /** Accuracy Bonus from Ranger. Melee and ranged. 0 when Ranger is not equipped. */
  accuracyBonus: number;
  /** Rapid Shot proc chance. 0 when Ranger has not learned it. */
  rapidShot: number;
  /** Snapshot merit. Aiming delay removed, 0 to 0.70. 0 when Ranger main is under 75. */
  snapshot: number;
  /** Dead Aim ranged critical-damage bonus. 0 when Ranger main has not learned it. */
  deadAim: number;
  /** Recycle chance. Ammunition is not spent, so this is not rolled. */
  recycle: number;
  /** Dual Wield fraction while both hands hold a one-handed weapon. 0 otherwise. */
  dualWield: number;
  /** Stealth movement bonus, applied only while Invisible is up. */
  stealth: number;
  /** Ninja Subtle Blow. Auspice is added again when that buff is up. */
  subtleBlow: number;
  job: JobId;
  sub: JobId | null;
  subLevel: number;
  /** Warrior level actually granting Warrior traits. 0 when Warrior is not equipped. */
  warLevel: number;
  /** Magic Attack Bonus from traits plus Magian gear. Tiers replace each other; gear is added. */
  mab: number;
  /** Magic Accuracy from Magian gear. Added on top of skill and dSTAT. */
  gearMacc: number;
  /** Magic Defense from Magian gear. Buffs are added when the hit lands. */
  mdb: number;
  /** Clear Mind bonus added to the 12 MP resting base. Not the whole tick. */
  clearMind: number;
  /** Conserve MP proc chance. */
  conserveMp: number;
  /** Elemental Celerity, as a fraction of casting time removed. */
  celerity: number;
  /** Fast Cast, as a fraction of casting time removed. 0 when Red Mage has not learned it. */
  fastCast: number;
  /** Auto Regen, HP every 3 seconds. 0 when White Mage has not learned it. */
  autoRegen: number;
  /** Auto Refresh, MP every 3 seconds. 0 when Paladin has not learned it. */
  autoRefresh: number;
  /** Shield Mastery TP on a connecting block. 0 when the trait is missing. */
  shieldMastery: number;
  /** Resist Sleep chance. Nothing here sleeps you, so it is not rolled. */
  resistSleep: number;
  /** Undead Killer, as a fraction. The hare is not undead, so it is not rolled. */
  undeadKiller: number;
  /** Shield DEF added to Protect by Shield Barrier. 0 when the trait or the shield is missing. */
  shieldBarrier: number;
  /** Desperate Blows, in /1024. Applied only while Last Resort is up on a two-handed weapon. */
  desperateBlows: number;
  /** Arcana Killer, as a fraction. The hare is not arcana, so it is not rolled. */
  arcanaKiller: number;
  /** Resist Paralyze chance. Nothing here paralyzes you, so it is not rolled. */
  resistParalyze: number;
  /** Occult Acumen stat. 0 when Dark Knight has not learned it. */
  occultAcumen: number;
  /** Souleater's HP price, as a fraction of current HP. 0.1 before Stalwart Soul. */
  stalwart: number;
  /** Dragon Killer, as a fraction. The hare is not a dragon, so it is not rolled. */
  dragonKiller: number;
  /** Strafe. Wyvern breath accuracy. 0 when Dragoon has not learned it. */
  strafe: number;
  /** Empathy. Main Dragoon 75. Spirit Link copies one beneficial effect. */
  empathy: boolean;
  /** Resist Slow chance. Nothing here inflicts Slow, so it is not rolled. */
  resistSlow: number;
  /** Beast Killer damage dealt to beasts. 0.05 at 70, main only. The hare is a beast. */
  beastKiller: number;
  /** Beast Killer intimidation. Physical swings at the player. 0.08 at tier I. */
  beastIntimidate: number;
  /** Beast Killer special damage taken from beasts. 0.05 at tier I. */
  beastSpecialCut: number;
  /** Tandem Strike accuracy while the jug is fighting the same foe. */
  tandemAcc: number;
  /** Tandem Blow subtle blow while the jug is fighting the same foe. */
  tandemBlow: number;
  /** Blood Boon proc chance on a blood pact. 0 when the trait is missing. */
  bloodBoon: number;
  /** Summoning Magic. Elemental Siphon reads this. */
  summoning: number;
  /** Off-hand swing while Dual Wield is live. Null with a shield, an empty sub, or no trait. */
  offhand: {
    dmg: number;
    fstr: number;
    skill: number;
    skillName: string;
    accuracy: number;
    attackFlat: number;
  } | null;
  darkMagic: number;
  /** Enhancing Magic. Auspice's Enspell II damage reads this. */
  enhancing: number;
  /** Magic Burst Bonus trait, as a fraction. */
  magicBurstBonus: number;
  /**
   * Black magic against the Tropical Rarab, and the rarab's black magic
   * against this character. stone is null when dINT is negative.
   */
  magic: {
    dInt: number;
    macc: number;
    stoneD: number | null;
    stone: number | null;
    takenDint: number;
    takenMacc: number;
  };
};

const STAT_KEYS = ["str", "dex", "vit", "agi", "int", "mnd", "chr"] as const;

export function itemIn(loadout: Loadout, slot: Slot): Item | null {
  const id = loadout[slot];
  return id ? ITEMS[id] ?? null : null;
}

export function canWear(item: Item, job: JobId, sub: JobId | null = null): boolean {
  // A jug is Beastmaster ammo. A support job is on the ability list and still cannot equip one.
  if (item.kind === "Jug") return job === "BST";
  // Pet food stays in the bag. Reward does not read the ammo slot in this yard.
  if (item.kind === "Pet Food" || item.kind === "Material") return false;
  if (item.jobs === "All Jobs") return true;
  const jobs = item.jobs.split(/\s+/);
  if (jobs.includes(job)) return true;
  // Retail: a listed support job can equip the piece too.
  return sub != null && sub !== job && jobs.includes(sub);
}

/** One-handed melee weapons. Shields, grips, and two-handed weapons are not. */
const OFFHAND_KIND = new Set(["Sword", "Dagger", "Axe", "Club", "Katana"]);

export function isOffhandWeapon(item: Item | null | undefined): boolean {
  if (!item || item.grip === "two") return false;
  return OFFHAND_KIND.has(item.kind);
}

/** Ninja or Dancer Dual Wield is up. A level-37 subjob has the first Dancer tier, or Ninja's second. */
export function dualWieldUnlocked(job: JobId, sub: JobId | null): boolean {
  const subUsed = sub && sub !== job ? sub : null;
  const subLv = subUsed ? subjobLevel(LEVEL) : 0;
  const ninLevel = ninJobLevel(job, subUsed, subLv, LEVEL);
  const dncLevel = dancerJobLevel(job, subUsed, subLv, LEVEL);
  const nin = ninLevel > 0 ? ninDualWield(ninLevel, job === "NIN" ? "main" : "sub") : 0;
  const dnc = dncLevel > 0 ? dncDualWield(dncLevel, job === "DNC" ? "main" : "sub") : 0;
  return Math.max(nin, dnc) > 0;
}

/**
 * Sub slot. A shield if the job can wear one. A second one-handed weapon
 * only while Dual Wield is up and the main hand is one-handed.
 */
export function canEquipInSub(item: Item, job: JobId, sub: JobId | null, main: Item | null): boolean {
  if (!canWear(item, job, sub) || item.level > LEVEL) return false;
  if (!main || main.grip === "two" || main.kind === "Hand-to-Hand") return false;
  if (item.kind === "Shield") return true;
  if (!dualWieldUnlocked(job, sub)) return false;
  return isOffhandWeapon(item);
}

/** Drop pieces this job pair cannot wear. An illegal weapon becomes the Ash Staff when that job can hold it. */
export function fitLoadout(loadout: Loadout, job: JobId, sub: JobId | null = null): Loadout {
  const next: Loadout = { ...loadout };
  for (const slot of Object.keys(SLOT_LABEL) as Slot[]) {
    const item = itemIn(next, slot);
    if (item && !canWear(item, job, sub)) next[slot] = null;
  }
  const main = next.main ? ITEMS[next.main] : null;
  if (!main || !canWear(main, job)) {
    next.main = job === "WHM" || job === "SCH" || job === "GEO" ? "ash-club" : job === "MNK" ? "cesti" : job === "THF" ? "bronze-dagger" : job === "SAM" ? "mumeito" : job === "NIN" ? "kunai" : job === "BRD" ? "bronze-dagger" : canWear(ITEMS["ash-staff"], job) ? "ash-staff" : "bronze-sword";
  }
  if (next.main && ITEMS[next.main]?.grip === "two") next.sub = null;
  if (job === "RNG") {
    const range = next.range ? ITEMS[next.range] : null;
    if (!range || !canWear(range, job)) next.range = "shortbow";
    const worn = next.range ? ITEMS[next.range] : null;
    if (worn?.kind === "Archery" && next.ammo !== "wooden-arrow") next.ammo = "wooden-arrow";
    if (worn?.kind === "Marksmanship" && next.ammo !== "bronze-bolt") next.ammo = "bronze-bolt";
  }
  if (job === "PLD") {
    const held = next.main ? ITEMS[next.main] : null;
    if (held && held.grip !== "two" && !next.sub) next.sub = "lauan-shield";
  }
  if (job === "NIN") {
    if (!next.main || next.main === "bronze-sword") next.main = "kunai";
    const held = next.main ? ITEMS[next.main] : null;
    if (held && held.grip !== "two" && held.kind !== "Hand-to-Hand") {
      const off = next.sub ? ITEMS[next.sub] : null;
      if (!off || off.kind === "Shield") next.sub = "kunai-off";
    }
  }
  if (job === "BRD") {
    if (!next.main || next.main === "bronze-sword") next.main = "bronze-dagger";
    const range = next.range ? ITEMS[next.range] : null;
    if (!range || !canWear(range, job) || (range.kind !== "String" && range.kind !== "Wind")) next.range = "maple-harp";
  }
  if (job === "GEO") {
    const range = next.range ? ITEMS[next.range] : null;
    if (!range || range.kind !== "Handbell") next.range = "handbell";
  }
  if (job === "DRK") {
    if (!next.main || next.main === "bronze-sword") next.main = "bronze-zaghnal";
  }
  if (job === "DRG") {
    if (!next.main || next.main === "bronze-sword") next.main = "harpoon";
  }
  if (job === "SMN") {
    if (!next.main || next.main === "bronze-sword") next.main = "ash-staff";
  }
  if (job === "BST") {
    if (!next.main || next.main === "bronze-sword" || next.main === "ash-staff") next.main = "bronze-axe";
  }
  if (job === "PUP") {
    if (!next.main || next.main === "bronze-sword" || next.main === "ash-staff") next.main = "cat-baghnakhs";
    const range = next.range ? ITEMS[next.range] : null;
    if (!range || !canWear(range, job, sub)) next.range = "animator";
    if (!next.ammo) next.ammo = AUTOMATON_OIL;
  }
  if (job === "COR") {
    const range = next.range ? ITEMS[next.range] : null;
    if (!range || !canWear(range, job, sub)) {
      next.range = "musketoon";
      next.ammo = "bronze-bullet";
    } else if (range.id === "musketoon" && next.ammo !== "bronze-bullet") next.ammo = "bronze-bullet";
  }
  if (job === "DNC") {
    if (!next.main || next.main === "bronze-sword" || next.main === "ash-staff") next.main = "bronze-dagger";
    const heldDnc = next.main ? ITEMS[next.main] : null;
    if (heldDnc && heldDnc.grip !== "two" && heldDnc.kind !== "Hand-to-Hand") {
      const offDnc = next.sub ? ITEMS[next.sub] : null;
      if (!offDnc || offDnc.kind === "Shield") next.sub = "bronze-dagger-off";
    }
  }
  const held = next.main ? ITEMS[next.main] : null;
  const off = next.sub ? ITEMS[next.sub] : null;
  if (off && !canEquipInSub(off, job, sub, held)) next.sub = null;
  if (next.sub && next.sub === next.main) next.sub = null;
  if (job === "NIN" && !next.sub) {
    const heldNow = next.main ? ITEMS[next.main] : null;
    if (heldNow && heldNow.grip !== "two" && heldNow.kind !== "Hand-to-Hand") next.sub = "kunai-off";
  }
  if (job === "DNC" && !next.sub) {
    const heldNow = next.main ? ITEMS[next.main] : null;
    if (heldNow && heldNow.grip !== "two" && heldNow.kind !== "Hand-to-Hand") next.sub = "bronze-dagger-off";
  }
  if (job === "RUN") {
    if (!next.main || next.main === "bronze-sword" || next.main === "ash-staff") {
      next.main = "rusty-greatsword";
      next.sub = null;
    }
  }
  return next;
}

/**
 * BG-Wiki Tactical Points. TP is lost when something is equipped in the
 * main, sub, or ranged slot, and when main or sub is emptied.
 * Taking the ranged weapon off does not. Ammo and armor do not.
 */
export function tpLostOnWeaponChange(before: Loadout, after: Loadout): boolean {
  if (before.main !== after.main || before.sub !== after.sub) return true;
  return after.range != null && after.range !== before.range;
}

export type WornAugment = {
  str?: number;
  dex?: number;
  vit?: number;
  agi?: number;
  int?: number;
  mnd?: number;
  chr?: number;
  hp?: number;
  mp?: number;
  attack?: number;
  acc?: number;
  def?: number;
  eva?: number;
  mab?: number;
  mdb?: number;
  macc?: number;
};

export function derive(
  loadout: Loadout,
  race: RaceId = "hume",
  job: JobId = "WAR",
  sub: JobId | null = null,
  blueSet: readonly string[] = [],
  augments: Readonly<Record<string, WornAugment>> = {},
): Sheet {
  const subUsed = sub && sub !== job ? sub : null;
  const subLv = subUsed ? subjobLevel(LEVEL) : 0;
  const naked = characterBase(race, job, LEVEL, subUsed, subLv);
  const warLv = job === "WAR" ? LEVEL : subUsed === "WAR" ? subLv : 0;
  const blmLv = job === "BLM" ? LEVEL : subUsed === "BLM" ? subLv : 0;
  const blmAccess = job === "BLM" ? "main" : "sub";
  const whmLv = job === "WHM" ? LEVEL : subUsed === "WHM" ? subLv : 0;
  const whmAccess = job === "WHM" ? "main" : "sub";
  const rdmLv = job === "RDM" ? LEVEL : subUsed === "RDM" ? subLv : 0;
  const rdmAccess = job === "RDM" ? "main" : "sub";
  const mnkLv = job === "MNK" ? LEVEL : subUsed === "MNK" ? subLv : 0;
  const mnkAccess = job === "MNK" ? "main" : "sub";
  const thfLv = job === "THF" ? LEVEL : subUsed === "THF" ? subLv : 0;
  const thfAccess = job === "THF" ? "main" : "sub";
  const samLv = job === "SAM" ? LEVEL : subUsed === "SAM" ? subLv : 0;
  const samAccess = job === "SAM" ? "main" : "sub";
  const rngLv = job === "RNG" ? LEVEL : subUsed === "RNG" ? subLv : 0;
  const rngAccess = job === "RNG" ? "main" : "sub";
  const pldLv = job === "PLD" ? LEVEL : subUsed === "PLD" ? subLv : 0;
  const pldAccess = job === "PLD" ? "main" : "sub";
  const ninLv = ninJobLevel(job, subUsed, subLv, LEVEL);
  const ninAccess = job === "NIN" ? "main" : "sub";
  const drkLv = drkJobLevel(job, subUsed, subLv, LEVEL);
  const drkAccess = job === "DRK" ? "main" : "sub";
  const drgLv = drgJobLevel(job, subUsed, subLv, LEVEL);
  const drgAccess = job === "DRG" ? "main" : "sub";
  const smnLv = smnJobLevel(job, subUsed, subLv, LEVEL);
  const smnAccess = job === "SMN" ? "main" : "sub";
  const bstLv = bstJobLevel(job, subUsed, subLv, LEVEL);
  const bstAccess = job === "BST" ? "main" : "sub";
  const pupLv = puppetmasterJobLevel(job, subUsed, subLv, LEVEL);
  const pupAccess = job === "PUP" ? "main" : "sub";
  const corLv = job === "COR" ? LEVEL : subUsed === "COR" ? subLv : 0;
  const corAccess = job === "COR" ? "main" : "sub";
  const dncLv = dancerJobLevel(job, subUsed, subLv, LEVEL);
  const dncAccess = job === "DNC" ? "main" : "sub";
  const schLv = job === "SCH" ? LEVEL : subUsed === "SCH" ? subLv : 0;
  const schAccess = job === "SCH" ? "main" : "sub";
  const runLv = job === "RUN" ? LEVEL : subUsed === "RUN" ? subLv : 0;
  const runAccess = job === "RUN" ? "main" : "sub";
  const geoLv = job === "GEO" ? LEVEL : subUsed === "GEO" ? subLv : 0;
  const geoAccess = job === "GEO" ? "main" : "sub";
  let str = naked.str;
  let dex = naked.dex;
  let vit = naked.vit;
  let agi = naked.agi;
  let int = naked.int;
  let mnd = naked.mnd;
  let chr = naked.chr;
  let armor = 0;
  let bonusHp = 0;
  let bonusMp = 0;
  let bonusAcc = 0;
  let bonusAttack = 0;
  let bonusEva = 0;
  let bonusMab = 0;
  let bonusMdb = 0;
  let bonusMacc = 0;
  for (const slot of Object.keys(loadout) as Slot[]) {
    const item = itemIn(loadout, slot);
    if (!item) continue;
    const extra = augments[item.id];
    str += (item.str ?? 0) + (extra?.str ?? 0);
    dex += (item.dex ?? 0) + (extra?.dex ?? 0);
    vit += (item.vit ?? 0) + (extra?.vit ?? 0);
    agi += (item.agi ?? 0) + (extra?.agi ?? 0);
    int += (item.int ?? 0) + (extra?.int ?? 0);
    mnd += (item.mnd ?? 0) + (extra?.mnd ?? 0);
    chr += (item.chr ?? 0) + (extra?.chr ?? 0);
    armor += (item.def ?? 0) + (extra?.def ?? 0);
    bonusHp += (item.hp ?? 0) + (extra?.hp ?? 0);
    bonusMp += (item.mp ?? 0) + (extra?.mp ?? 0);
    bonusAcc += (item.acc ?? 0) + (extra?.acc ?? 0);
    bonusAttack += extra?.attack ?? 0;
    bonusEva += extra?.eva ?? 0;
    bonusMab += extra?.mab ?? 0;
    bonusMdb += extra?.mdb ?? 0;
    bonusMacc += extra?.macc ?? 0;
  }
  if (job === "BLU") {
    agi += blueSetAgi(blueSet);
    str += blueSetStr(blueSet);
    dex += blueSetDex(blueSet);
    chr += blueSetChr(blueSet);
    int += blueSetInt(blueSet);
    mnd += blueSetMnd(blueSet);
    vit += blueSetVit(blueSet);
  }
  const blueHp = job === "BLU" ? blueSetHp(blueSet) : 0;
  const blueMp = job === "BLU" ? blueSetMp(blueSet) : 0;
  const weapon = itemIn(loadout, "main");
  const dmg = weapon?.dmg ?? 0;
  const rank = weapon?.rank ?? 0;
  // Equipped weapon's skill, or Hand-to-Hand when bare. Always the cap.
  // A skill Warrior does not have (Katana, Great Katana) is 0.
  const skillName = weapon?.kind ?? "Hand-to-Hand";
  const skill = combinedSkill(skillName, job, LEVEL, subUsed, subLv);
  const fstr = fStr(str - HARE.vit, rank);
  const hand = skillName === "Hand-to-Hand";
  // Base hand-to-hand delay is 480. Cesti stores 528 (480 + 48). Cat Baghnakhs stores 540.
  // Monk and Puppetmaster Martial Arts each replace that base. The shorter one wins.
  const delay = hand ? bestHandDelay(weapon?.delay ?? 480, mnkLv, pupLv, pupAccess) : (weapon?.delay ?? 480);
  const subItem = itemIn(loadout, "sub");
  const dwNin = ninLv > 0 ? ninDualWield(ninLv, ninAccess) : 0;
  const dwDnc = dncLv > 0 ? dncDualWield(dncLv, dncAccess) : 0;
  const dualWield = handsDualWield(weapon, subItem) ? Math.max(dwNin, dwDnc) : 0;
  // BG-Wiki: (Delay 1 + Delay 2) × (1 − Dual Wield) ÷ 2. Both hands share that delay.
  const handDelay = dualWield > 0 ? (delay + (subItem?.delay ?? delay)) / 2 : delay;
  const swing = swingTiming(handDelay, { ...NO_HASTE, dualWield });
  const bluAcc = job === "BLU" ? blueAccuracyBonus(blueSet) : 0;
  const accuracyBonus = Math.max(rngLv > 0 ? rngAccuracy(rngLv, rngAccess) : 0, bluAcc, dncLv > 0 ? dncAccuracyBonus(dncLv, dncAccess) : 0, runLv > 0 ? runAccuracy(runLv, runAccess) : 0);
  const drgAcc = drgLv > 0 ? drgAccuracyBonus(drgLv, drgAccess) : 0;
  const attackTrait = Math.max(attackBonus(warLv), drkLv > 0 ? drkAttackBonus(drkLv, drkAccess) : 0, drgLv > 0 ? drgAttackBonus(drgLv) : 0, job === "BLU" ? blueAttackBonus(blueSet) : 0);
  const accuracy = accuracyFrom(dex, skill) + bonusAcc + accuracyBonus + drgAcc;
  let offhand: Sheet["offhand"] = null;
  if (dualWield > 0 && subItem && isOffhandWeapon(subItem)) {
    const offSkill = combinedSkill(subItem.kind, job, LEVEL, subUsed, subLv);
    offhand = {
      dmg: subItem.dmg ?? 0,
      fstr: fStr(str - HARE.vit, subItem.rank ?? 0),
      skill: offSkill,
      skillName: subItem.kind,
      accuracy: accuracyFrom(dex, offSkill) + bonusAcc + accuracyBonus + drgAcc,
      attackFlat: mainHandAttack(str, offSkill) + attackTrait + bonusAttack,
    };
  }
  // Both fists land when the job has the skill.
  const hands = skillName === "Hand-to-Hand" && skill > 0 ? 2 : 1;
  const attackFlat = mainHandAttack(str, skill) + attackTrait + bonusAttack;
  const smite = smiteApplies(skillName, weapon?.grip) ? Math.max(smiteNumer(warLv), mnkSmiteNumer(mnkLv), drkLv > 0 ? drkSmiteNumer(drkLv, drkAccess) : 0, drgLv > 0 ? drgSmiteNumer(drgLv) : 0, pupLv > 0 ? pupSmiteNumer(pupLv, pupAccess) : 0) : 0;
  const defenseFlat = baseDefense(vit, LEVEL) + armor + Math.max(defenseBonus(warLv), pldLv > 0 ? pldDefenseBonus(pldLv, pldAccess) : 0, job === "BLU" ? blueDefenseBonus(blueSet) : 0);
  const fencer = fencerApplies(weapon, subItem) ? fencerBonus(warLv) : { tp: 0, crit: 0 };
  const mab = Math.max(blmLv > 0 ? magicAttackBonus(blmLv, blmAccess) : 0, rdmLv > 0 ? rdmMagicAttackBonus(rdmLv) : 0, job === "BLU" ? blueMagicAttackBonus(blueSet) : 0) + bonusMab;
  const dInt = int - HARE.int;
  const stoneD = elementalD("Stone", dInt, 0);
  const takenDint = HARE.int - int;
  const evasionBonus = Math.max(thfLv > 0 ? thfEvasionBonus(thfLv, thfAccess) : 0, job === "BLU" ? blueEvasionBonus(blueSet) : 0, pupLv > 0 ? pupEvasionBonus(pupLv, pupAccess) : 0, dncLv > 0 ? dncEvasionBonus(dncLv, dncAccess) : 0);
  return {
    hp: naked.hp + bonusHp + blueHp + Math.max(maxHpBoost(warLv), mnkMaxHp(mnkLv), pldLv > 0 ? pldMaxHp(pldLv, pldAccess) : 0, ninLv > 0 ? ninMaxHp(ninLv, ninAccess) : 0, job === "BLU" ? blueMaxHpBoost(blueSet, LEVEL) : 0, runLv > 0 ? runMaxHp(runLv, runAccess) : 0),
    mp: naked.mp + bonusMp + blueMp + (job === "BLU" ? blueMaxMpBoost(blueSet, LEVEL) : 0) + (schLv > 0 ? schMaxMp(schLv) : 0) + (geoLv > 0 ? geoMaxMp(geoLv, geoAccess) : 0),
    str,
    dex,
    vit,
    agi,
    int,
    mnd,
    chr,
    naked,
    attackFlat,
    smite,
    attack: scale256(attackFlat, smite),
    defenseFlat,
    defense: defenseFlat,
    accuracy,
    evasion: evasionFrom(agi, combinedSkill("Evasion", job, LEVEL, subUsed, subLv)) + evasionBonus + bonusEva,
    delay,
    swing,
    tpHit: tpPerHit(swing.modifiedDelay),
    dps: dmg > 0 ? weaponDps(dmg, delay) : 0,
    dmg,
    fstr,
    hit: hitRate(accuracy, HARE.evasion, HARE.level - LEVEL),
    crit: Math.min(100, critRate(dex, HARE.agi) + fencer.crit),
    fencerTp: fencer.tp,
    pdifCap: 3.25 + Math.max(damageLimitBonus(warLv), rdmDamageLimit(rdmLv, rdmAccess), mnkDamageLimit(mnkLv, mnkAccess), thfLv > 0 ? thfDamageLimit(thfLv, thfAccess) : 0, samLv > 0 ? samDamageLimit(samLv) : 0, rngLv > 0 ? rngDamageLimit(rngLv, rngAccess) : 0, ninLv > 0 ? ninDamageLimit(ninLv, ninAccess) : 0, drkLv > 0 ? drkDamageLimit(drkLv, drkAccess) : 0, drgLv > 0 ? drgDamageLimit(drgLv, drgAccess) : 0, bstDamageLimit(bstLv), pupDamageLimit(pupLv), dncLv > 0 ? dncDamageLimit(dncLv, dncAccess) : 0),
    weaponName: weapon?.name ?? "Unarmed",
    reach: autoAttackRange(weapon?.kind ?? "Hand-to-Hand"),
    skillName,
    skill,
    hands,
    doubleAttack: doubleAttackRate(warLv),
    tripleAttack: thfLv > 0 ? tripleAttackRate(thfLv, thfAccess) : 0,
    evasionBonus,
    treasureHunter: thfLv > 0 ? treasureHunter(thfLv) : 0,
    gilfinder: thfLv > 0 && gilfinder(thfLv),
    gravityResist: Math.max(thfLv > 0 ? gravityResist(thfLv, thfAccess) : 0, job === "BLU" ? blueResistGravity(blueSet, LEVEL) : 0),
    assassin: thfLv > 0 && assassin(thfLv, thfAccess),
    storeTp: Math.max(samLv > 0 ? storeTpMultiplier(samLv, samAccess) : 1, job === "BLU" && blueStoreTp(blueSet, LEVEL) > 0 ? 1 + blueStoreTp(blueSet, LEVEL) / 100 : 1),
    zanshin: samLv > 0 ? zanshinRate(samLv, samAccess) : 0,
    blindResist: samLv > 0 ? blindResist(samLv, samAccess) : 0,
    demonKiller: samLv > 0 && demonKiller(samLv),
    kickRate: hand ? mnkKickRate(mnkLv, mnkAccess) : 0,
    accuracyBonus,
    rapidShot: Math.max(rngLv > 0 ? rapidShotRate(rngLv, rngAccess) : 0, corLv > 0 ? corRapidShot(corLv) : 0, job === "BLU" ? blueRapidShot(blueSet, LEVEL) : 0),
    snapshot: rngLv > 0 ? snapshotRate(rngLv, rngAccess) : 0,
    deadAim: rngLv > 0 ? rngDeadAim(rngLv, rngAccess) : 0,
    recycle: Math.max(rngLv > 0 ? recycleRate(rngLv, rngAccess) : 0, corLv > 0 ? corRecycle(corLv, corAccess) : 0),
    dualWield,
    offhand,
    stealth: ninLv > 0 ? stealthMove(ninLv) : 0,
    subtleBlow: Math.max(ninLv > 0 ? ninSubtleBlow(ninLv, ninAccess) : 0, dncLv > 0 ? dncSubtleBlow(dncLv, dncAccess) : 0),
    job,
    sub: subUsed,
    subLevel: subLv,
    warLevel: warLv,
    mab,
    gearMacc: bonusMacc,
    mdb: bonusMdb,
    clearMind: Math.max(
      blmLv > 0 ? clearMind(blmLv, blmAccess) : 0,
      whmLv > 0 ? whmClearMind(whmLv, whmAccess) : 0,
      rdmLv > 0 ? rdmClearMind(rdmLv, rdmAccess) : 0,
      smnLv > 0 ? clearMind(smnLv, smnAccess) : 0,
      job === "BLU" ? blueClearMind(blueSet) : 0,
      schLv > 0 ? schClearMind(schLv, schAccess) : 0,
      geoLv > 0 ? geoClearMind(geoLv, geoAccess) : 0,
    ),
    conserveMp: Math.max(blmLv > 0 ? conserveMp(blmLv) : 0, job === "BLU" ? blueConserveMp(blueSet) : 0, schLv > 0 ? schConserveMp(schLv) : 0, geoLv > 0 ? geoConserveMp(geoLv, geoAccess) : 0),
    celerity: Math.max(blmLv > 0 ? celerity(blmLv, blmAccess) : 0, geoLv > 0 ? geoCelerity(geoLv, geoAccess) : 0),
    fastCast: Math.max(rdmLv > 0 ? fastCast(rdmLv, rdmAccess) : 0, job === "BLU" ? blueFastCast(blueSet, LEVEL) : 0),
    autoRegen: Math.max(whmLv > 0 ? autoRegen(whmLv) : 0, job === "BLU" ? blueAutoRegen(blueSet) : 0, runLv > 0 ? runAutoRegen(runLv, runAccess) : 0),
    autoRefresh: Math.max(pldLv > 0 ? pldRefresh(pldLv) : 0, smnLv > 0 ? smnRefresh(smnLv) : 0, job === "BLU" ? blueAutoRefresh(blueSet) : 0),
    shieldMastery: pldLv > 0 ? shieldMasteryTp(pldLv, pldAccess) : 0,
    resistSleep: Math.max(pldLv > 0 ? resistSleep(pldLv, pldAccess) : 0, job === "BLU" ? blueResistSleep(blueSet) : 0),
    undeadKiller: Math.max(pldLv > 0 ? undeadKiller(pldLv) : 0, job === "BLU" ? blueUndeadKiller(blueSet) : 0),
    shieldBarrier: pldLv > 0 ? shieldBarrierDef(pldLv, pldAccess, subItem?.kind === "Shield" ? (subItem.def ?? 0) : 0) : 0,
    desperateBlows: drkLv > 0 ? desperateBlowsHaste(drkLv) : 0,
    arcanaKiller: drkLv > 0 ? arcanaKiller(drkLv) : 0,
    resistParalyze: drkLv > 0 ? resistParalyze(drkLv, drkAccess) : 0,
    occultAcumen: drkLv > 0 ? occultAcumen(drkLv, drkAccess) : 0,
    stalwart: drkLv > 0 ? stalwartConsume(drkLv, drkAccess) : 0.1,
    dragonKiller: drgLv > 0 ? dragonKiller(drgLv) : 0,
    strafe: drgLv > 0 ? strafe(drgLv, drgAccess) : 0,
    empathy: drgLv > 0 && empathy(drgLv, drgAccess),
    resistSlow: Math.max(smnLv > 0 ? resistSlow(smnLv, smnAccess) : 0, bstLv > 0 ? bstResistSlow(bstLv, bstAccess) : 0, pupLv > 0 ? pupResistSlow(pupLv, pupAccess) : 0, dncLv > 0 ? dncResistSlow(dncLv, dncAccess) : 0),
    beastKiller: Math.max(bstLv > 0 ? beastKiller(bstLv, bstAccess) : 0, job === "BLU" ? blueBeastKiller(blueSet) : 0),
    beastIntimidate: bstLv > 0 ? beastIntimidate(bstLv, bstAccess) : 0,
    beastSpecialCut: bstLv > 0 ? beastSpecialCut(bstLv, bstAccess) : 0,
    tandemAcc: bstLv > 0 ? tandemStrike(bstLv, bstAccess) : 0,
    tandemBlow: bstLv > 0 ? tandemBlow(bstLv, bstAccess) : 0,
    bloodBoon: bloodBoon(smnLv, smnAccess),
    summoning: combinedSkill("Summoning Magic", job, LEVEL, subUsed, subLv),
    darkMagic: combinedSkill("Dark Magic", job, LEVEL, subUsed, subLv),
    enhancing: combinedSkill("Enhancing Magic", job, LEVEL, subUsed, subLv),
    magicBurstBonus: blmLv > 0 ? magicBurstBonus(blmLv, blmAccess) : 0,
    magic: {
      dInt,
      macc: dStatMagicAccuracy(dInt),
      stoneD,
      stone: stoneD == null ? null : applyMab(stoneD, mab, 0),
      takenDint,
      takenMacc: dStatMagicAccuracy(takenDint),
    },
  };
}

export function withPreview(loadout: Loadout, selectedId: string | null, slot?: Slot | null): Loadout {
  if (!selectedId) return loadout;
  const item = ITEMS[selectedId];
  if (!item) return loadout;
  const into = slot === "sub" && (item.slot === "sub" || isOffhandWeapon(item)) ? "sub" : item.slot;
  if (loadout[into] === selectedId) return loadout;
  const next = { ...loadout, [into]: selectedId };
  if (into === "main" && item.grip === "two") next.sub = null;
  return next;
}

export function bagIds(loadout: Loadout): string[] {
  const worn = new Set(Object.values(loadout));
  return ALL_ITEM_IDS.filter((id) => !worn.has(id));
}

export function sanitizeLoadout(raw: unknown): Loadout {
  const next: Loadout = { ...DEFAULT_LOADOUT, main: DEFAULT_LOADOUT.main };
  for (const slot of Object.keys(next) as Slot[]) next[slot] = null;
  next.main = DEFAULT_LOADOUT.main;
  if (!raw || typeof raw !== "object") return { ...DEFAULT_LOADOUT };
  const rec = raw as Record<string, unknown>;
  for (const slot of Object.keys(SLOT_LABEL) as Slot[]) {
    const id = rec[slot];
    if (typeof id !== "string") continue;
    const item = ITEMS[id];
    // A one-handed weapon may sit in the sub slot. Its item slot is still main.
    if (!item || (item.slot !== slot && !(slot === "sub" && isOffhandWeapon(item)))) continue;
    next[slot] = id;
  }
  if (!next.main || !ITEMS[next.main] || ITEMS[next.main].slot !== "main") {
    next.main = "bronze-sword";
  }
  if (next.main && ITEMS[next.main]?.grip === "two") next.sub = null;
  return next;
}

export const STAT_ROWS = STAT_KEYS;

export function assertJobSheet(): void {
  const war = derive(DEFAULT_LOADOUT, "hume");
  if (war.job !== "WAR" || war.sub !== null || war.skillName !== "Sword" || war.skill !== 250 || war.doubleAttack !== 0.14 || war.mab !== 0 || war.darkMagic !== 0) {
    throw new Error("default sheet stays Warrior");
  }
  const blm = derive(fitLoadout(DEFAULT_LOADOUT, "BLM"), "hume", "BLM");
  if (blm.weaponName !== "Ash Staff" || blm.skillName !== "Staff" || blm.skill !== 240) throw new Error("BLM staff");
  if (blm.hp !== 897 || blm.mp !== 618 || blm.int !== 70 || blm.mab !== 32 || blm.clearMind !== 15 || blm.celerity !== 0.2 || blm.darkMagic !== 269) {
    throw new Error("equipped Hume BLM");
  }
  if (blm.magic.dInt !== 12 || blm.magic.macc !== 11 || blm.magic.stoneD !== 34 || blm.magic.stone !== 44) {
    throw new Error("Stone versus the hare");
  }
  if (blm.magic.takenDint !== -12 || blm.magic.takenMacc !== -11) throw new Error("magic damage taken");
  if (blm.doubleAttack !== 0 || blm.warLevel !== 0 || blm.pdifCap !== 3.25) throw new Error("BLM has no Warrior traits");
  const supported = derive(fitLoadout(DEFAULT_LOADOUT, "BLM"), "hume", "BLM", "WAR");
  if (supported.subLevel !== 37 || supported.int !== 75 || supported.hp !== 1093 || supported.doubleAttack !== 0.1 || supported.mab !== 32) {
    throw new Error("BLM/WAR fight sheet");
  }
  if (supported.skill !== 240 || supported.darkMagic !== 269) throw new Error("subjob staff does not replace the main cap");
  const warSub = derive(DEFAULT_LOADOUT, "hume", "WAR", "BLM");
  if (warSub.mab !== 24 || warSub.mp !== 156 || warSub.clearMind !== 6 || warSub.doubleAttack !== 0.14 || warSub.skill !== 250 || warSub.darkMagic !== 114) {
    throw new Error("WAR/BLM fight sheet");
  }
  const same = derive(DEFAULT_LOADOUT, "hume", "WAR", "WAR");
  if (same.sub !== null || same.hp !== war.hp || same.str !== war.str) throw new Error("same job cannot be the subjob");
  const whm = derive(fitLoadout(DEFAULT_LOADOUT, "WHM"), "hume", "WHM");
  if (whm.weaponName !== "Ash Club" || whm.skillName !== "Club" || whm.skill !== 256 || whm.hp !== 971 || whm.mp !== 540 || whm.mnd !== 70) {
    throw new Error("equipped Hume WHM");
  }
  if (whm.autoRegen !== 1 || whm.clearMind !== 12 || whm.mab !== 0 || whm.doubleAttack !== 0) throw new Error("WHM traits");
  if (whm.enhancing !== 230) throw new Error("WHM enhancing");
  const whmBlm = derive(fitLoadout(DEFAULT_LOADOUT, "WHM"), "hume", "WHM", "BLM");
  if (whmBlm.clearMind !== 12 || whmBlm.mab !== 24 || whmBlm.autoRegen !== 1 || whmBlm.skill !== 256) throw new Error("WHM/BLM sheet");
  const rdm = derive(fitLoadout(DEFAULT_LOADOUT, "RDM"), "hume", "RDM");
  if (rdm.weaponName !== "Bronze Sword" || rdm.skillName !== "Sword" || rdm.skill !== 250) throw new Error("RDM sword");
  if (rdm.hp !== 1046 || rdm.mp !== 464 || rdm.int !== 61 || rdm.mnd !== 61 || rdm.chr !== 56) throw new Error("equipped Hume RDM");
  if (rdm.mab !== 24 || rdm.clearMind !== 9 || rdm.fastCast !== 0.2 || rdm.enhancing !== 256 || rdm.pdifCap !== 3.25 + 26 / 256) {
    throw new Error("RDM traits");
  }
  const rdmBlm = derive(fitLoadout(DEFAULT_LOADOUT, "RDM"), "hume", "RDM", "BLM");
  if (rdmBlm.mab !== 24 || rdmBlm.clearMind !== 9 || rdmBlm.fastCast !== 0.2 || rdmBlm.celerity !== 0) throw new Error("RDM/BLM sheet");
  const blmRdm = derive(fitLoadout(DEFAULT_LOADOUT, "BLM"), "hume", "BLM", "RDM");
  if (blmRdm.mab !== 32 || blmRdm.clearMind !== 15 || blmRdm.fastCast !== 0.15 || blmRdm.celerity !== 0.2) throw new Error("BLM/RDM sheet");
  const mnk = derive(fitLoadout(DEFAULT_LOADOUT, "MNK"), "hume", "MNK");
  if (mnk.weaponName !== "Cesti" || mnk.skillName !== "Hand-to-Hand" || mnk.skill !== 276 || mnk.hands !== 2) throw new Error("MNK cesti");
  if (mnk.hp !== 1748 || mnk.mp !== 0 || mnk.str !== 61 || mnk.dex !== 65 || mnk.vit !== 70 || mnk.agi !== 48 || mnk.int !== 44 || mnk.mnd !== 56 || mnk.chr !== 53) {
    throw new Error(`equipped Hume MNK ${mnk.hp}/${mnk.str}/${mnk.dex}/${mnk.vit}`);
  }
  if (mnk.delay !== 348 || mnk.smite !== 25 || mnk.pdifCap !== 3.25 + 51 / 256 || mnk.doubleAttack !== 0 || mnk.kickRate !== 0.12) throw new Error("MNK traits");
  const mnkWar = derive(fitLoadout(DEFAULT_LOADOUT, "MNK"), "hume", "MNK", "WAR");
  if (mnkWar.hp !== 1914 || mnkWar.doubleAttack !== 0.1 || mnkWar.skill !== 276 || mnkWar.smite !== 25) throw new Error("MNK/WAR sheet");
  const warMnk = derive(DEFAULT_LOADOUT, "hume", "WAR", "MNK");
  // Subjob Monk adds half of A-rank HP at 37 (185). Both Max HP Boosts are +120, so they do not stack.
  if (warMnk.hp !== war.hp + 185 || warMnk.skill !== 250 || warMnk.delay !== war.delay || warMnk.smite !== 0 || warMnk.kickRate !== 0) throw new Error("WAR/MNK sheet");
  const thf = derive(fitLoadout(DEFAULT_LOADOUT, "THF"), "hume", "THF");
  if (thf.weaponName !== "Bronze Sword" || thf.skillName !== "Sword" || thf.skill !== 210) throw new Error("THF keeps a sword it can wear");
  if (thf.hp !== 1046 || thf.mp !== 0 || thf.str !== 56 || thf.dex !== 70 || thf.vit !== 56 || thf.agi !== 65 || thf.int !== 61 || thf.mnd !== 44 || thf.chr !== 44) {
    throw new Error(`equipped Hume THF ${thf.hp}/${thf.str}/${thf.dex}/${thf.agi}`);
  }
  if (thf.tripleAttack !== 0.05 || thf.doubleAttack !== 0 || thf.evasionBonus !== 48 || thf.evasion !== 348 || !thf.assassin) throw new Error("THF traits");
  if (thf.pdifCap !== 3.25 + 26 / 256 || thf.treasureHunter !== 2 || !thf.gilfinder || thf.gravityResist !== 0.25 || thf.kickRate !== 0) throw new Error("THF caps");
  const knife = derive(fitLoadout({ ...DEFAULT_LOADOUT, main: "ash-staff" }, "THF"), "hume", "THF");
  if (knife.weaponName !== "Bronze Dagger" || knife.skillName !== "Dagger" || knife.skill !== 276 || knife.delay !== 183) throw new Error("THF dagger fallback");
  const warThf = derive(DEFAULT_LOADOUT, "hume", "WAR", "THF");
  if (warThf.tripleAttack !== 0 || warThf.evasionBonus !== 22 || warThf.assassin || warThf.treasureHunter !== 1 || !warThf.gilfinder || warThf.gravityResist !== 0.1 || warThf.skill !== 250) {
    throw new Error("WAR/THF sheet");
  }
  const sam = derive(fitLoadout(DEFAULT_LOADOUT, "SAM"), "hume", "SAM");
  if (sam.weaponName !== "Mumeito" || sam.skillName !== "Great Katana" || sam.skill !== 276 || sam.delay !== 420) throw new Error("SAM mumeito");
  if (sam.hp !== 1242 || sam.mp !== 0 || sam.str !== 61 || sam.dex !== 61 || sam.vit !== 61 || sam.agi !== 56 || sam.int !== 53 || sam.mnd !== 53 || sam.chr !== 56) {
    throw new Error(`equipped Hume SAM ${sam.hp}/${sam.str}/${sam.dex}/${sam.vit}`);
  }
  if (sam.storeTp !== 1.25 || sam.zanshin !== 0.45 || sam.blindResist !== 0.25 || !sam.demonKiller || sam.pdifCap !== 3.25 + 26 / 256) {
    throw new Error("SAM traits");
  }
  const warSam = derive(DEFAULT_LOADOUT, "hume", "WAR", "SAM");
  if (warSam.storeTp !== 1.15 || warSam.zanshin !== 0.25 || warSam.blindResist !== 0.15 || warSam.demonKiller || warSam.skill !== 250) {
    throw new Error("WAR/SAM sheet");
  }
  const rng = derive(fitLoadout(DEFAULT_LOADOUT, "RNG"), "hume", "RNG");
  if (rng.weaponName !== "Bronze Sword" || rng.skillName !== "Sword" || rng.skill !== 210) throw new Error("RNG keeps a sword it can wear");
  if (rng.hp !== 971 || rng.mp !== 0 || rng.agi !== 70) throw new Error(`equipped Hume RNG ${rng.hp}/${rng.mp}/${rng.agi}`);
  if (rng.accuracyBonus !== 48 || rng.rapidShot !== 0.3 || rng.snapshot !== 0.1 || rng.deadAim !== 0.3 || rng.recycle !== 0.3) throw new Error("RNG traits");
  if (rng.pdifCap !== 3.25 + 51 / 256) throw new Error("RNG damage limit");
  const rngGear = fitLoadout(DEFAULT_LOADOUT, "RNG");
  if (rngGear.range !== "shortbow" || rngGear.ammo !== "wooden-arrow" || rngGear.body !== null) throw new Error("RNG hunter kit");
  const warRng = derive(DEFAULT_LOADOUT, "hume", "WAR", "RNG");
  if (warRng.accuracyBonus !== 22 || warRng.rapidShot !== 0.25 || warRng.snapshot !== 0 || warRng.deadAim !== 0 || warRng.pdifCap !== 3.25 + 26 / 256) {
    throw new Error("WAR/RNG sheet");
  }
  const pld = derive(fitLoadout(DEFAULT_LOADOUT, "PLD"), "hume", "PLD");
  if (pld.weaponName !== "Bronze Sword" || pld.skillName !== "Sword" || pld.skill !== 276) throw new Error("PLD sword");
  if (pld.hp !== 1197 || pld.mp !== 312 || pld.str !== 65 || pld.vit !== 70 || pld.mnd !== 61) {
    throw new Error(`equipped Hume PLD ${pld.hp}/${pld.mp}/${pld.str}/${pld.vit}`);
  }
  if (pld.autoRefresh !== 1 || pld.shieldMastery !== 30 || pld.resistSleep !== 0.25 || pld.undeadKiller !== 0.08 || pld.shieldBarrier !== 1) {
    throw new Error("PLD traits");
  }
  if (fitLoadout(DEFAULT_LOADOUT, "PLD").sub !== "lauan-shield") throw new Error("PLD shield");
  const warPld = derive(DEFAULT_LOADOUT, "hume", "WAR", "PLD");
  if (warPld.skill !== 250 || warPld.autoRefresh !== 1 || warPld.shieldMastery !== 10 || warPld.shieldBarrier !== 0 || warPld.undeadKiller !== 0.08) {
    throw new Error("WAR/PLD sheet");
  }
  if (warPld.hp <= war.hp) throw new Error("PLD subjob HP");
  const drk = derive(fitLoadout(DEFAULT_LOADOUT, "DRK"), "hume", "DRK");
  if (drk.weaponName !== "Bronze Zaghnal" || drk.skillName !== "Scythe" || drk.skill !== 276 || drk.delay !== 480) throw new Error("DRK scythe");
  if (drk.hp !== 1167 || drk.mp !== 312 || drk.str !== 70 || drk.dex !== 61 || drk.vit !== 61 || drk.int !== 61 || drk.mnd !== 44) {
    throw new Error(`equipped Hume DRK ${drk.hp}/${drk.mp}/${drk.str}/${drk.dex}/${drk.vit}`);
  }
  if (drk.attackFlat !== 402 || drk.smite !== 64 || drk.attack !== 502 || drk.pdifCap !== 3.25 + 102 / 256) throw new Error(`DRK attack ${drk.attackFlat}/${drk.smite}/${drk.attack}`);
  if (drk.desperateBlows !== 153 || drk.arcanaKiller !== 0.08 || drk.resistParalyze !== 0.25 || drk.occultAcumen !== 75 || drk.stalwart !== 0.06) {
    throw new Error("DRK traits");
  }
  if (fitLoadout(DEFAULT_LOADOUT, "DRK").sub !== null) throw new Error("DRK scythe clears the off hand");
  const warDrk = derive(DEFAULT_LOADOUT, "hume", "WAR", "DRK");
  if (warDrk.skill !== 250 || warDrk.desperateBlows !== 102 || warDrk.arcanaKiller !== 0.08 || warDrk.stalwart !== 0.1 || warDrk.occultAcumen !== 0 || warDrk.resistParalyze !== 0.1) {
    throw new Error("WAR/DRK sheet");
  }
  const drg = derive(fitLoadout(DEFAULT_LOADOUT, "DRG"), "hume", "DRG");
  if (drg.weaponName !== "Harpoon" || drg.skillName !== "Polearm" || drg.skill !== 276 || drg.delay !== 396) throw new Error("DRG harpoon");
  if (drg.hp !== 1167 || drg.mp !== 0 || drg.str !== 61 || drg.dex !== 53 || drg.vit !== 61 || drg.agi !== 53 || drg.int !== 48 || drg.mnd !== 53 || drg.chr !== 61) {
    throw new Error(`equipped Hume DRG ${drg.hp}/${drg.mp}/${drg.str}/${drg.dex}/${drg.vit}/${drg.agi}/${drg.int}/${drg.mnd}/${drg.chr}`);
  }
  if (drg.attackFlat !== 355 || drg.smite !== 25 || drg.attack !== 389 || drg.accuracy !== 329 || drg.pdifCap !== 3.25 + 51 / 256) {
    throw new Error(`DRG attack ${drg.attackFlat}/${drg.smite}/${drg.attack}/${drg.accuracy}/${drg.pdifCap}`);
  }
  if (drg.dragonKiller !== 0.08 || drg.strafe !== 30 || !drg.empathy) throw new Error("DRG traits");
  if (fitLoadout(DEFAULT_LOADOUT, "DRG").sub !== null || fitLoadout(DEFAULT_LOADOUT, "DRG").main !== "harpoon") throw new Error("DRG harpoon clears the off hand");
  const warDrg = derive(DEFAULT_LOADOUT, "hume", "WAR", "DRG");
  if (warDrg.dragonKiller !== 0.08 || warDrg.strafe !== 10 || warDrg.empathy || warDrg.smite !== 0) throw new Error("WAR/DRG sheet");
  const smn = derive(fitLoadout(DEFAULT_LOADOUT, "SMN"), "hume", "SMN");
  if (smn.weaponName !== "Ash Staff" || smn.skillName !== "Staff" || smn.skill !== 250 || smn.delay !== 366) throw new Error("SMN staff");
  if (smn.hp !== 822 || smn.mp !== 754 || smn.str !== 44 || smn.dex !== 56 || smn.vit !== 44 || smn.agi !== 56 || smn.int !== 65 || smn.mnd !== 61 || smn.chr !== 61) {
    throw new Error(`equipped Hume SMN ${smn.hp}/${smn.mp}/${smn.str}/${smn.dex}/${smn.vit}/${smn.agi}/${smn.int}/${smn.mnd}/${smn.chr}`);
  }
  if (smn.clearMind !== 15 || smn.autoRefresh !== 1 || smn.resistSlow !== 0.2 || smn.bloodBoon !== 0.23 || smn.summoning !== 269) throw new Error("SMN traits");
  if (fitLoadout(DEFAULT_LOADOUT, "SMN").sub !== null || fitLoadout(DEFAULT_LOADOUT, "SMN").main !== "ash-staff") throw new Error("SMN staff clears the off hand");
  const warSmn = derive(DEFAULT_LOADOUT, "hume", "WAR", "SMN");
  if (warSmn.mp !== 195 || warSmn.clearMind !== 6 || warSmn.autoRefresh !== 1 || warSmn.resistSlow !== 0.1 || warSmn.bloodBoon !== 0 || warSmn.summoning !== 114) {
    throw new Error(`WAR/SMN sheet ${warSmn.mp}/${warSmn.clearMind}/${warSmn.autoRefresh}/${warSmn.resistSlow}`);
  }
  const bst = derive(fitLoadout(DEFAULT_LOADOUT, "BST"), "hume", "BST");
  if (bst.weaponName !== "Bronze Axe" || bst.skillName !== "Axe" || bst.skill !== 276 || bst.delay !== 276) throw new Error("BST axe");
  if (bst.hp !== 1167 || bst.mp !== 0 || bst.str !== 56 || bst.dex !== 61 || bst.vit !== 56 || bst.agi !== 48 || bst.int !== 53 || bst.mnd !== 53 || bst.chr !== 70) {
    throw new Error(`equipped Hume BST ${bst.hp}/${bst.mp}/${bst.str}/${bst.dex}/${bst.vit}/${bst.agi}/${bst.int}/${bst.mnd}/${bst.chr}`);
  }
  if (bst.beastKiller !== 0.05 || bst.beastIntimidate !== 0.08 || bst.beastSpecialCut !== 0.05 || bst.tandemAcc !== 40 || bst.tandemBlow !== 10) {
    throw new Error("BST traits");
  }
  if (bst.resistSlow !== 0.25 || bst.pdifCap !== 3.25 + 26 / 256) throw new Error("BST resist and damage limit");
  if (fitLoadout(DEFAULT_LOADOUT, "BST").main !== "bronze-axe") throw new Error("BST bronze axe");
  if (fitLoadout({ ...DEFAULT_LOADOUT, main: "bronze-zaghnal" }, "BST").main !== "bronze-zaghnal") throw new Error("BST keeps a scythe");
  const warBst = derive(fitLoadout({ ...DEFAULT_LOADOUT, main: "bronze-axe" }, "WAR", "BST"), "hume", "WAR", "BST");
  if (warBst.skillName !== "Axe" || warBst.skill !== 269 || warBst.beastKiller !== 0 || warBst.tandemAcc !== 10 || warBst.tandemBlow !== 0 || warBst.resistSlow !== 0.15) {
    throw new Error(`WAR/BST sheet ${warBst.skill}/${warBst.beastKiller}/${warBst.tandemAcc}/${warBst.tandemBlow}/${warBst.resistSlow}`);
  }
  const pupGear = fitLoadout(DEFAULT_LOADOUT, "PUP");
  if (pupGear.main !== "cat-baghnakhs" || pupGear.sub !== null || pupGear.range !== "animator" || pupGear.ammo !== "automaton-oil") throw new Error("PUP cat baghnakhs clear the off hand");
  if (fitLoadout({ ...DEFAULT_LOADOUT, ammo: "wooden-arrow" }, "PUP").ammo !== "wooden-arrow") throw new Error("PUP keeps arrows");
  if (!canWear(ITEMS["automaton-oil"], "PUP") || canWear(ITEMS["automaton-oil"], "WAR") || !canWear(ITEMS["automaton-oil"], "WAR", "PUP")) throw new Error("Automaton Oil jobs");
  if (!canWear(ITEMS["bamboo-fishing-rod"], "SAM") || ITEMS["bamboo-fishing-rod"].slot !== "range") throw new Error("rod is ranged");
  if (!canWear(ITEMS["little-worm"], "SAM") || ITEMS["little-worm"].slot !== "ammo") throw new Error("bait is ammo");
  const pup = derive(pupGear, "hume", "PUP");
  if (pup.weaponName !== "Cat Baghnakhs" || pup.skillName !== "Hand-to-Hand" || pup.skill !== 276 || pup.hands !== 2 || pup.delay !== 420) {
    throw new Error(`PUP hands ${pup.weaponName}/${pup.skill}/${pup.hands}/${pup.delay}`);
  }
  if (pup.hp !== 1046 || pup.mp !== 0 || pup.str !== 53 || pup.dex !== 65 || pup.vit !== 56 || pup.agi !== 61 || pup.int !== 53 || pup.mnd !== 48 || pup.chr !== 61) {
    throw new Error(`equipped Hume PUP ${pup.hp}/${pup.mp}/${pup.str}/${pup.dex}/${pup.vit}/${pup.agi}/${pup.int}/${pup.mnd}/${pup.chr}`);
  }
  if (pup.evasionBonus !== 35 || pup.resistSlow !== 0.2 || pup.smite !== 25 || pup.pdifCap !== 3.25 + 26 / 256) {
    throw new Error(`PUP traits ${pup.evasionBonus}/${pup.resistSlow}/${pup.smite}/${pup.pdifCap}`);
  }
  if (fitLoadout({ ...DEFAULT_LOADOUT, main: "bronze-dagger" }, "PUP").main !== "bronze-dagger") throw new Error("PUP keeps a dagger");
  if (fitLoadout({ ...DEFAULT_LOADOUT, main: "ash-club" }, "PUP").main !== "ash-club") throw new Error("PUP keeps a club");
  const warPup = derive(DEFAULT_LOADOUT, "hume", "WAR", "PUP");
  if (warPup.skillName !== "Sword" || warPup.evasionBonus !== 10 || warPup.resistSlow !== 0.1 || warPup.smite !== 0 || warPup.pdifCap !== 3.25 + 26 / 256) {
    throw new Error(`WAR/PUP sheet ${warPup.skillName}/${warPup.evasionBonus}/${warPup.resistSlow}/${warPup.smite}/${warPup.pdifCap}`);
  }
  const corGear = fitLoadout(DEFAULT_LOADOUT, "COR");
  if (corGear.main !== "bronze-sword" || corGear.range !== "musketoon" || corGear.ammo !== "bronze-bullet") throw new Error("COR sword and musketoon");
  if (fitLoadout({ ...DEFAULT_LOADOUT, main: "bronze-dagger" }, "COR").main !== "bronze-dagger") throw new Error("COR keeps a dagger");
  if (fitLoadout({ ...DEFAULT_LOADOUT, main: "onion-sword" }, "COR").main !== "onion-sword") throw new Error("COR keeps an onion sword");
  if (fitLoadout(DEFAULT_LOADOUT, "WAR", "COR").range !== null) throw new Error("sub COR does not equip the gun");
  const cor = derive(corGear, "hume", "COR");
  if (cor.hp !== 1046 || cor.mp !== 0 || cor.str !== 53 || cor.dex !== 61 || cor.vit !== 53 || cor.agi !== 61 || cor.int !== 61 || cor.mnd !== 53 || cor.chr !== 53) {
    throw new Error(`equipped Hume COR ${cor.hp}/${cor.mp}/${cor.str}/${cor.dex}/${cor.vit}/${cor.agi}/${cor.int}/${cor.mnd}/${cor.chr}`);
  }
  if (cor.skillName !== "Sword" || cor.skill !== 240 || cor.rapidShot !== 0.25 || cor.recycle !== 0.2) throw new Error(`COR sheet ${cor.skill}/${cor.rapidShot}/${cor.recycle}`);
  const warCor = derive(DEFAULT_LOADOUT, "hume", "WAR", "COR");
  if (warCor.rapidShot !== 0.25 || warCor.recycle !== 0.1 || warCor.skill !== 250) throw new Error(`WAR/COR traits ${warCor.rapidShot}/${warCor.recycle}/${warCor.skill}`);
  const dncGear = fitLoadout(DEFAULT_LOADOUT, "DNC");
  if (dncGear.main !== "bronze-dagger" || dncGear.sub !== "bronze-dagger-off") throw new Error("DNC daggers");
  if (fitLoadout({ ...DEFAULT_LOADOUT, main: "onion-sword" }, "DNC").main !== "onion-sword") throw new Error("DNC keeps an onion sword");
  if (fitLoadout({ ...DEFAULT_LOADOUT, main: "cesti" }, "DNC").sub !== null) throw new Error("DNC fists clear the off hand");
  if (fitLoadout(DEFAULT_LOADOUT, "WAR", "DNC").sub !== null) throw new Error("sub DNC does not force an off hand");
  const dnc = derive(dncGear, "hume", "DNC");
  if (dnc.hp !== 1046 || dnc.mp !== 0 || dnc.str !== 56 || dnc.dex !== 61 || dnc.vit !== 53 || dnc.agi !== 65 || dnc.int !== 48 || dnc.mnd !== 48 || dnc.chr !== 65) {
    throw new Error(`equipped Hume DNC ${dnc.hp}/${dnc.mp}/${dnc.str}/${dnc.dex}/${dnc.vit}/${dnc.agi}/${dnc.int}/${dnc.mnd}/${dnc.chr}`);
  }
  if (dnc.skillName !== "Dagger" || dnc.skill !== 276 || dnc.dualWield !== 0.25 || dnc.swing.baseDelay !== 183 || dnc.swing.modifiedDelay !== 137) {
    throw new Error(`DNC dagger ${dnc.skillName}/${dnc.skill}/${dnc.dualWield}/${dnc.swing.baseDelay}/${dnc.swing.modifiedDelay}`);
  }
  if (dnc.accuracyBonus !== 22 || dnc.evasionBonus !== 35 || dnc.subtleBlow !== 15 || dnc.resistSlow !== 0.15 || dnc.pdifCap !== 3.25 + 26 / 256) {
    throw new Error(`DNC traits ${dnc.accuracyBonus}/${dnc.evasionBonus}/${dnc.subtleBlow}/${dnc.resistSlow}/${dnc.pdifCap}`);
  }
  const warDnc = derive(DEFAULT_LOADOUT, "hume", "WAR", "DNC");
  if (warDnc.dualWield !== 0 || warDnc.accuracyBonus !== 10 || warDnc.evasionBonus !== 10 || warDnc.subtleBlow !== 5 || warDnc.resistSlow !== 0.1) {
    throw new Error(`WAR/DNC traits ${warDnc.dualWield}/${warDnc.accuracyBonus}/${warDnc.evasionBonus}/${warDnc.subtleBlow}/${warDnc.resistSlow}`);
  }
  const schGear = fitLoadout(DEFAULT_LOADOUT, "SCH");
  if (schGear.main !== "ash-club") throw new Error("SCH ash club");
  if (fitLoadout({ ...DEFAULT_LOADOUT, main: "bronze-dagger" }, "SCH").main !== "bronze-dagger") throw new Error("SCH keeps a dagger");
  if (fitLoadout({ ...DEFAULT_LOADOUT, main: "ash-staff" }, "SCH").main !== "ash-staff") throw new Error("SCH keeps a staff");
  const sch = derive(schGear, "hume", "SCH");
  if (sch.hp !== 971 || sch.mp !== 474 || sch.int !== 61 || sch.clearMind !== 12 || sch.conserveMp !== 0.25 || sch.skillName !== "Club" || sch.skill !== 230) {
    throw new Error(`equipped Hume SCH ${sch.hp}/${sch.mp}/${sch.int}/${sch.clearMind}/${sch.conserveMp}/${sch.skillName}/${sch.skill}`);
  }
  const warSch = derive(DEFAULT_LOADOUT, "hume", "WAR", "SCH");
  const warSchBase = characterBase("hume", "WAR", 75, "SCH", 37);
  if (warSch.clearMind !== 6 || warSch.conserveMp !== 0.25 || warSch.mp !== warSchBase.mp + 10) {
    throw new Error(`WAR/SCH traits ${warSch.clearMind}/${warSch.conserveMp}/${warSch.mp}/${warSchBase.mp}`);
  }
  const runGear = fitLoadout(DEFAULT_LOADOUT, "RUN");
  if (runGear.main !== "rusty-greatsword" || runGear.sub !== null) throw new Error("RUN rusty greatsword");
  if (fitLoadout({ ...DEFAULT_LOADOUT, main: "bronze-sword" }, "RUN").main !== "rusty-greatsword") throw new Error("RUN sword falls back to the greatsword");
  if (fitLoadout({ ...DEFAULT_LOADOUT, main: "onion-sword" }, "RUN").main !== "onion-sword") throw new Error("RUN keeps an onion sword");
  const run = derive(runGear, "hume", "RUN");
  if (run.weaponName !== "Rusty Greatsword" || run.skillName !== "Great Sword" || run.skill !== 276 || run.hp !== 1287 || run.mp !== 312 || run.accuracyBonus !== 22 || run.autoRegen !== 2) {
    throw new Error(`equipped Hume RUN ${run.weaponName}/${run.skillName}/${run.skill}/${run.hp}/${run.mp}/${run.accuracyBonus}/${run.autoRegen}`);
  }
  const warRun = derive(DEFAULT_LOADOUT, "hume", "WAR", "RUN");
  const warOnly = derive(DEFAULT_LOADOUT, "hume", "WAR");
  const warNaked = characterBase("hume", "WAR", 75);
  const warRunNaked = characterBase("hume", "WAR", 75, "RUN", 37);
  if (warRun.autoRegen !== 1 || warRun.hp - warRunNaked.hp !== warOnly.hp - warNaked.hp) {
    throw new Error(`WAR/RUN sheet ${warRun.autoRegen}/${warRun.hp}/${warOnly.hp}`);
  }
  const geoGear = fitLoadout(DEFAULT_LOADOUT, "GEO");
  if (geoGear.main !== "ash-club" || geoGear.range !== "handbell") throw new Error("GEO ash club and handbell");
  if (fitLoadout({ ...DEFAULT_LOADOUT, main: "ash-staff" }, "GEO").main !== "ash-staff") throw new Error("GEO keeps a staff");
  if (fitLoadout({ ...DEFAULT_LOADOUT, main: "bronze-dagger" }, "GEO").main !== "bronze-dagger") throw new Error("GEO keeps a dagger");
  const geo = derive(geoGear, "hume", "GEO");
  if (geo.hp !== 1167 || geo.mp !== 636 || geo.int !== 61 || geo.clearMind !== 9 || geo.conserveMp !== 0.37 || geo.celerity !== 0.1 || geo.skillName !== "Club" || geo.skill !== 256) {
    throw new Error(`equipped Hume GEO ${geo.hp}/${geo.mp}/${geo.int}/${geo.clearMind}/${geo.conserveMp}/${geo.celerity}/${geo.skillName}/${geo.skill}`);
  }
  const warGeo = derive(DEFAULT_LOADOUT, "hume", "WAR", "GEO");
  const warGeoBase = characterBase("hume", "WAR", 75, "GEO", 37);
  if (warGeo.clearMind !== 3 || warGeo.conserveMp !== 0.28 || warGeo.mp !== warGeoBase.mp + 10 || warGeo.celerity !== 0) {
    throw new Error(`WAR/GEO traits ${warGeo.clearMind}/${warGeo.conserveMp}/${warGeo.mp}/${warGeoBase.mp}/${warGeo.celerity}`);
  }
  const bluGear = fitLoadout(DEFAULT_LOADOUT, "BLU");
  if (bluGear.main !== "bronze-sword") throw new Error("BLU bronze sword");
  if (fitLoadout({ ...DEFAULT_LOADOUT, main: "onion-sword" }, "BLU").main !== "onion-sword") throw new Error("BLU keeps an onion sword");
  if (fitLoadout({ ...DEFAULT_LOADOUT, main: "bronze-axe" }, "BLU").main !== "bronze-sword") throw new Error("BLU axe falls back to a sword");
  if (fitLoadout({ ...DEFAULT_LOADOUT, main: "bronze-zaghnal" }, "BLU").main !== "bronze-sword") throw new Error("BLU scythe falls back to a sword");
  if (fitLoadout({ ...DEFAULT_LOADOUT, main: "ash-staff" }, "BLU").main !== "bronze-sword") throw new Error("BLU staff falls back to a sword");
  const blu = derive(bluGear, "hume", "BLU");
  if (blu.weaponName !== "Bronze Sword" || blu.skillName !== "Sword" || blu.skill !== 276 || blu.delay !== 231) throw new Error("BLU sword");
  if (blu.hp !== 1046 || blu.mp !== 464 || blu.str !== 53 || blu.dex !== 53 || blu.vit !== 53 || blu.agi !== 53 || blu.int !== 53 || blu.mnd !== 53 || blu.chr !== 53) {
    throw new Error(`equipped Hume BLU ${blu.hp}/${blu.mp}/${blu.str}/${blu.dex}/${blu.vit}/${blu.agi}/${blu.int}/${blu.mnd}/${blu.chr}`);
  }
  const warBlu = derive(DEFAULT_LOADOUT, "hume", "WAR", "BLU");
  if (warBlu.skillName !== "Sword" || warBlu.skill !== 250 || warBlu.mp !== 118) throw new Error(`WAR/BLU sheet ${warBlu.skill}/${warBlu.mp}`);
  const kicking = derive(bluGear, "hume", "BLU", null, ["Foot Kick"]);
  if (kicking.agi !== 54 || kicking.str !== 53 || kicking.hp !== 1046 || kicking.dex !== 53) throw new Error(`set Foot Kick ${kicking.agi}`);
  const carrot = derive(bluGear, "hume", "BLU", null, ["Wild Carrot"]);
  if (carrot.hp !== 1051 || carrot.agi !== 53 || carrot.mnd !== 53 || carrot.vit !== 53) throw new Error(`set Wild Carrot ${carrot.hp}/${carrot.agi}`);
  const bothBlue = derive(bluGear, "hume", "BLU", null, ["Foot Kick", "Wild Carrot"]);
  if (bothBlue.agi !== 54 || bothBlue.hp !== 1051) throw new Error(`set both blue ${bothBlue.agi}/${bothBlue.hp}`);
  if (derive(DEFAULT_LOADOUT, "hume", "WAR", "BLU", ["Foot Kick"]).agi !== warBlu.agi) throw new Error("subjob set bonus");
  if (derive(DEFAULT_LOADOUT, "hume", "WAR", "BLU", ["Wild Carrot"]).hp !== warBlu.hp || derive(DEFAULT_LOADOUT, "hume", "WAR", "BLU", ["Wild Carrot"]).agi !== warBlu.agi) {
    throw new Error("subjob Wild Carrot");
  }
  const actinic = derive(bluGear, "hume", "BLU", null, ["Actinic Burst"]);
  if (actinic.hp !== 1066 || actinic.chr !== 55 || actinic.str !== 53 || actinic.dex !== 53 || actinic.autoRefresh !== 0) {
    throw new Error(`set Actinic Burst ${actinic.hp}/${actinic.chr}/${actinic.autoRefresh}`);
  }
  const plasma = derive(bluGear, "hume", "BLU", null, ["Plasma Charge"]);
  if (plasma.str !== 56 || plasma.dex !== 56 || plasma.hp !== 1046 || plasma.chr !== 53 || plasma.autoRefresh !== 0) {
    throw new Error(`set Plasma Charge ${plasma.str}/${plasma.dex}/${plasma.autoRefresh}`);
  }
  const luminion = derive(bluGear, "hume", "BLU", null, ["Actinic Burst", "Plasma Charge"]);
  if (luminion.hp !== 1066 || luminion.str !== 56 || luminion.dex !== 56 || luminion.chr !== 55 || luminion.autoRefresh !== 1) {
    throw new Error(`set both luminion spells ${luminion.hp}/${luminion.str}/${luminion.dex}/${luminion.chr}/${luminion.autoRefresh}`);
  }
  if (derive(DEFAULT_LOADOUT, "hume", "WAR", "BLU", ["Actinic Burst", "Plasma Charge"]).chr !== warBlu.chr || derive(DEFAULT_LOADOUT, "hume", "WAR", "BLU", ["Actinic Burst", "Plasma Charge"]).autoRefresh !== 0) {
    throw new Error("subjob luminion set");
  }
  const chaotic = derive(bluGear, "hume", "BLU", null, ["Chaotic Eye"]);
  if (chaotic.agi !== 54 || chaotic.hp !== 1046 || chaotic.conserveMp !== 0) throw new Error(`set Chaotic Eye ${chaotic.agi}/${chaotic.conserveMp}`);
  const zephyr = derive(bluGear, "hume", "BLU", null, ["Zephyr Mantle"]);
  if (zephyr.agi !== 55 || zephyr.conserveMp !== 0 || zephyr.str !== 53) throw new Error(`set Zephyr Mantle ${zephyr.agi}/${zephyr.conserveMp}`);
  const conserve = derive(bluGear, "hume", "BLU", null, ["Chaotic Eye", "Zephyr Mantle"]);
  if (conserve.agi !== 56 || conserve.conserveMp !== 0.25 || conserve.autoRefresh !== 0) {
    throw new Error(`set Conserve MP ${conserve.agi}/${conserve.conserveMp}/${conserve.autoRefresh}`);
  }
  if (derive(DEFAULT_LOADOUT, "hume", "WAR", "BLU", ["Chaotic Eye", "Zephyr Mantle"]).agi !== warBlu.agi || derive(DEFAULT_LOADOUT, "hume", "WAR", "BLU", ["Chaotic Eye", "Zephyr Mantle"]).conserveMp !== 0) {
    throw new Error("subjob Conserve MP");
  }
  const breeze = derive(bluGear, "hume", "BLU", null, ["Healing Breeze"]);
  if (breeze.hp !== 1056 || breeze.chr !== 55 || breeze.autoRegen !== 0 || breeze.mnd !== 53) throw new Error(`set Healing Breeze ${breeze.hp}/${breeze.chr}/${breeze.autoRegen}`);
  const sheep = derive(bluGear, "hume", "BLU", null, ["Sheep Song"]);
  if (sheep.hp !== 1051 || sheep.chr !== 54 || sheep.autoRegen !== 0) throw new Error(`set Sheep Song ${sheep.hp}/${sheep.chr}/${sheep.autoRegen}`);
  const regen = derive(bluGear, "hume", "BLU", null, ["Healing Breeze", "Sheep Song"]);
  if (regen.hp !== 1061 || regen.chr !== 56 || regen.autoRegen !== 1 || regen.autoRefresh !== 0) {
    throw new Error(`set Auto Regen ${regen.hp}/${regen.chr}/${regen.autoRegen}`);
  }
  if (derive(DEFAULT_LOADOUT, "hume", "WAR", "BLU", ["Healing Breeze", "Sheep Song"]).hp !== warBlu.hp || derive(DEFAULT_LOADOUT, "hume", "WAR", "BLU", ["Healing Breeze", "Sheep Song"]).chr !== warBlu.chr || derive(DEFAULT_LOADOUT, "hume", "WAR", "BLU", ["Healing Breeze", "Sheep Song"]).autoRegen !== 0) {
    throw new Error("subjob Auto Regen");
  }
  const dance = derive(bluGear, "hume", "BLU", null, ["Battle Dance"]);
  if (dance.dex !== 55 || dance.str !== 53 || dance.hp !== 1046 || dance.attackFlat !== blu.attackFlat) {
    throw new Error(`set Battle Dance ${dance.dex}/${dance.str}/${dance.attackFlat}`);
  }
  const upper = derive(bluGear, "hume", "BLU", null, ["Uppercut"]);
  if (upper.str !== 55 || upper.dex !== 54 || upper.attackFlat !== blu.attackFlat + 2) {
    throw new Error(`set Uppercut ${upper.str}/${upper.dex}/${upper.attackFlat}`);
  }
  const brawlers = derive(bluGear, "hume", "BLU", null, ["Battle Dance", "Uppercut"]);
  if (brawlers.str !== 55 || brawlers.dex !== 56 || brawlers.smite !== 0 || brawlers.attackFlat !== upper.attackFlat + 10 || brawlers.attack !== brawlers.attackFlat) {
    throw new Error(`set Attack Bonus ${brawlers.str}/${brawlers.dex}/${brawlers.attackFlat}/${brawlers.attack}`);
  }
  const warBrawl = derive(DEFAULT_LOADOUT, "hume", "WAR", "BLU", ["Battle Dance", "Uppercut"]);
  if (warBrawl.str !== warBlu.str || warBrawl.dex !== warBlu.dex || warBrawl.attackFlat !== warBlu.attackFlat) {
    throw new Error("subjob Attack Bonus");
  }
  const rip = derive(bluGear, "hume", "BLU", null, ["Frenetic Rip"]);
  if (rip.int !== 54 || rip.mnd !== 53 || rip.accuracyBonus !== 0 || rip.accuracy !== blu.accuracy) {
    throw new Error(`set Frenetic Rip ${rip.int}/${rip.mnd}/${rip.accuracyBonus}/${rip.accuracy}`);
  }
  const severed = derive(bluGear, "hume", "BLU", null, ["Disseverment"]);
  if (severed.int !== 54 || severed.mnd !== 52 || severed.accuracyBonus !== 0 || severed.str !== 53) {
    throw new Error(`set Disseverment ${severed.int}/${severed.mnd}/${severed.accuracyBonus}`);
  }
  const accurate = derive(bluGear, "hume", "BLU", null, ["Frenetic Rip", "Disseverment"]);
  if (accurate.int !== 55 || accurate.mnd !== 52 || accurate.accuracyBonus !== 10 || accurate.accuracy !== blu.accuracy + 10) {
    throw new Error(`set Accuracy Bonus ${accurate.int}/${accurate.mnd}/${accurate.accuracyBonus}/${accurate.accuracy}`);
  }
  const warAccurate = derive(DEFAULT_LOADOUT, "hume", "WAR", "BLU", ["Frenetic Rip", "Disseverment"]);
  if (warAccurate.int !== warBlu.int || warAccurate.mnd !== warBlu.mnd || warAccurate.accuracyBonus !== warBlu.accuracyBonus || warAccurate.accuracy !== warBlu.accuracy) {
    throw new Error("subjob Accuracy Bonus");
  }
  const cocoon = derive(bluGear, "hume", "BLU", null, ["Cocoon"]);
  if (cocoon.vit !== 56 || cocoon.defenseFlat !== blu.defenseFlat + 5 || cocoon.agi !== 53 || cocoon.str !== 53) {
    throw new Error(`set Cocoon ${cocoon.vit}/${cocoon.defenseFlat}`);
  }
  const fueled = derive(bluGear, "hume", "BLU", null, ["Refueling"]);
  if (fueled.agi !== 55 || fueled.vit !== 53 || fueled.defenseFlat !== blu.defenseFlat) {
    throw new Error(`set Refueling ${fueled.agi}/${fueled.vit}`);
  }
  const warSilk = derive(DEFAULT_LOADOUT, "hume", "WAR", "BLU", ["Cocoon", "Refueling"]);
  if (warSilk.vit !== warBlu.vit || warSilk.agi !== warBlu.agi || warSilk.defenseFlat !== warBlu.defenseFlat) {
    throw new Error("subjob Cocoon and Refueling");
  }
  const fruit = derive(bluGear, "hume", "BLU", null, ["Magic Fruit"]);
  if (fruit.chr !== 54 || fruit.hp !== 1051 || fruit.str !== 53 || fruit.resistSleep !== 0) {
    throw new Error(`set Magic Fruit ${fruit.chr}/${fruit.hp}/${fruit.resistSleep}`);
  }
  const ballSet = derive(bluGear, "hume", "BLU", null, ["Cannonball"]);
  if (ballSet.str !== 54 || ballSet.dex !== 54 || ballSet.hp !== 1046 || ballSet.chr !== 53 || ballSet.resistSleep !== 0) {
    throw new Error(`set Cannonball ${ballSet.str}/${ballSet.dex}/${ballSet.hp}`);
  }
  const sleepers = derive(bluGear, "hume", "BLU", null, ["Wild Carrot", "Magic Fruit"]);
  if (sleepers.hp !== 1056 || sleepers.chr !== 54 || sleepers.resistSleep !== 0.1) {
    throw new Error(`set Resist Sleep ${sleepers.hp}/${sleepers.chr}/${sleepers.resistSleep}`);
  }
  const warOrchard = derive(DEFAULT_LOADOUT, "hume", "WAR", "BLU", ["Wild Carrot", "Magic Fruit", "Cannonball"]);
  if (warOrchard.hp !== warBlu.hp || warOrchard.chr !== warBlu.chr || warOrchard.str !== warBlu.str || warOrchard.dex !== warBlu.dex || warOrchard.resistSleep !== 0) {
    throw new Error("subjob Magic Fruit and Cannonball");
  }
  const memento = derive(bluGear, "hume", "BLU", null, ["Memento Mori"]);
  if (memento.int !== 54 || memento.mp !== 464 || memento.mab !== 0 || memento.mnd !== 53) {
    throw new Error(`set Memento Mori ${memento.int}/${memento.mp}/${memento.mab}`);
  }
  const mindSet = derive(bluGear, "hume", "BLU", null, ["Mind Blast"]);
  if (mindSet.mp !== 469 || mindSet.mnd !== 54 || mindSet.clearMind !== 0 || mindSet.mab !== 0 || mindSet.int !== 53) {
    throw new Error(`set Mind Blast ${mindSet.mp}/${mindSet.mnd}/${mindSet.clearMind}/${mindSet.mab}`);
  }
  const warMind = derive(DEFAULT_LOADOUT, "hume", "WAR", "BLU", ["Memento Mori", "Mind Blast"]);
  if (warMind.int !== warBlu.int || warMind.mnd !== warBlu.mnd || warMind.mp !== warBlu.mp || warMind.mab !== warBlu.mab || warMind.clearMind !== warBlu.clearMind) {
    throw new Error("subjob Memento Mori and Mind Blast");
  }
  const sandSet = derive(bluGear, "hume", "BLU", null, ["Sandspin"]);
  if (sandSet.vit !== 54 || sandSet.hp !== 1046 || sandSet.int !== 53) throw new Error(`set Sandspin ${sandSet.vit}/${sandSet.hp}`);
  const pollenSet = derive(bluGear, "hume", "BLU", null, ["Pollen"]);
  if (pollenSet.hp !== 1051 || pollenSet.chr !== 54 || pollenSet.resistSleep !== 0 || pollenSet.mnd !== 53) {
    throw new Error(`set Pollen ${pollenSet.hp}/${pollenSet.chr}/${pollenSet.resistSleep}`);
  }
  const pollenSleep = derive(bluGear, "hume", "BLU", null, ["Pollen", "Wild Carrot"]);
  if (pollenSleep.hp !== 1056 || pollenSleep.chr !== 54 || pollenSleep.resistSleep !== 0.1) {
    throw new Error(`set Pollen Resist Sleep ${pollenSleep.hp}/${pollenSleep.chr}/${pollenSleep.resistSleep}`);
  }
  const powerSet = derive(bluGear, "hume", "BLU", null, ["Power Attack"]);
  if (powerSet.mnd !== 54 || powerSet.str !== 53 || powerSet.beastKiller !== 0) throw new Error(`set Power Attack ${powerSet.mnd}/${powerSet.beastKiller}`);
  const sproutSet = derive(bluGear, "hume", "BLU", null, ["Sprout Smack"]);
  if (sproutSet.mnd !== 54 || sproutSet.beastKiller !== 0 || sproutSet.hp !== 1046) throw new Error(`set Sprout Smack ${sproutSet.mnd}/${sproutSet.beastKiller}`);
  const oatsSet = derive(bluGear, "hume", "BLU", null, ["Wild Oats"]);
  if (oatsSet.hp !== 1056 || oatsSet.chr !== 54 || oatsSet.beastKiller !== 0 || oatsSet.mnd !== 53) {
    throw new Error(`set Wild Oats ${oatsSet.hp}/${oatsSet.chr}/${oatsSet.beastKiller}`);
  }
  const beasts = derive(bluGear, "hume", "BLU", null, ["Sprout Smack", "Wild Oats"]);
  if (beasts.beastKiller !== 0.08 || beasts.hp !== 1056 || beasts.chr !== 54 || beasts.mnd !== 54) {
    throw new Error(`set Beast Killer ${beasts.beastKiller}/${beasts.hp}/${beasts.chr}/${beasts.mnd}`);
  }
  const warBeasts = derive(DEFAULT_LOADOUT, "hume", "WAR", "BLU", ["Sprout Smack", "Wild Oats", "Pollen", "Sandspin"]);
  if (warBeasts.beastKiller !== 0 || warBeasts.hp !== warBlu.hp || warBeasts.chr !== warBlu.chr || warBeasts.vit !== warBlu.vit || warBeasts.mnd !== warBlu.mnd) {
    throw new Error("subjob starter blue set");
  }
  const metalSet = derive(bluGear, "hume", "BLU", null, ["Metallic Body"]);
  if (metalSet.hp !== 1046 || metalSet.mp !== 464 || metalSet.str !== 53 || metalSet.rapidShot !== 0) throw new Error(`set Metallic Body ${metalSet.hp}/${metalSet.mp}`);
  const queasySet = derive(bluGear, "hume", "BLU", null, ["Queasyshroom"]);
  if (queasySet.hp !== 1041 || queasySet.mp !== 469 || queasySet.int !== 53) throw new Error(`set Queasyshroom ${queasySet.hp}/${queasySet.mp}`);
  const headSet = derive(bluGear, "hume", "BLU", null, ["Head Butt"]);
  if (headSet.dex !== 55 || headSet.hp !== 1046 || headSet.str !== 53) throw new Error(`set Head Butt ${headSet.dex}`);
  const featherSet = derive(bluGear, "hume", "BLU", null, ["Feather Storm"]);
  if (featherSet.hp !== 1051 || featherSet.chr !== 55 || featherSet.rapidShot !== 0 || featherSet.agi !== 53) throw new Error(`set Feather Storm ${featherSet.hp}/${featherSet.chr}/${featherSet.rapidShot}`);
  const diveSet = derive(bluGear, "hume", "BLU", null, ["Helldive"]);
  if (diveSet.hp !== 1051 || diveSet.chr !== 54 || diveSet.agi !== 53) throw new Error(`set Helldive ${diveSet.hp}/${diveSet.chr}`);
  const bludgeonSet = derive(bluGear, "hume", "BLU", null, ["Bludgeon"]);
  if (bludgeonSet.str !== 54 || bludgeonSet.undeadKiller !== 0) throw new Error(`set Bludgeon ${bludgeonSet.str}/${bludgeonSet.undeadKiller}`);
  const sphereSet = derive(bluGear, "hume", "BLU", null, ["Cursed Sphere"]);
  if (sphereSet.mnd !== 54 || sphereSet.mab !== 0) throw new Error(`set Cursed Sphere ${sphereSet.mnd}/${sphereSet.mab}`);
  const sphereMori = derive(bluGear, "hume", "BLU", null, ["Cursed Sphere", "Memento Mori"]);
  if (sphereMori.mab !== 20 || sphereMori.mnd !== 54 || sphereMori.int !== 54) throw new Error(`set Cursed Sphere Magic Attack Bonus ${sphereMori.mab}/${sphereMori.mnd}/${sphereMori.int}`);
  const breathSet = derive(bluGear, "hume", "BLU", null, ["Poison Breath"]);
  if (breathSet.mnd !== 54 || breathSet.clearMind !== 0) throw new Error(`set Poison Breath ${breathSet.mnd}/${breathSet.clearMind}`);
  const breathMind = derive(bluGear, "hume", "BLU", null, ["Poison Breath", "Mind Blast"]);
  if (breathMind.clearMind !== 3 || breathMind.mnd !== 55 || breathMind.mp !== 469) throw new Error(`set Poison Breath Clear Mind ${breathMind.clearMind}/${breathMind.mnd}/${breathMind.mp}`);
  const clawSet = derive(bluGear, "hume", "BLU", null, ["Claw Cyclone"]);
  if (clawSet.vit !== 54) throw new Error(`set Claw Cyclone ${clawSet.vit}`);
  const bombSet = derive(bluGear, "hume", "BLU", null, ["Blastbomb"]);
  if (bombSet.str !== 54) throw new Error(`set Blastbomb ${bombSet.str}`);
  const soporificSet = derive(bluGear, "hume", "BLU", null, ["Soporific"]);
  if (soporificSet.hp !== 1041 || soporificSet.mp !== 469 || soporificSet.clearMind !== 0) throw new Error(`set Soporific ${soporificSet.hp}/${soporificSet.mp}/${soporificSet.clearMind}`);
  const soporificBreath = derive(bluGear, "hume", "BLU", null, ["Soporific", "Poison Breath"]);
  if (soporificBreath.clearMind !== 3 || soporificBreath.hp !== 1041 || soporificBreath.mp !== 469 || soporificBreath.mnd !== 54) {
    throw new Error(`set Soporific Clear Mind ${soporificBreath.clearMind}/${soporificBreath.hp}/${soporificBreath.mnd}`);
  }
  const driverSet = derive(bluGear, "hume", "BLU", null, ["Screwdriver"]);
  if (driverSet.hp !== 1056 || driverSet.vit !== 54 || driverSet.chr !== 54 || driverSet.evasionBonus !== 0) throw new Error(`set Screwdriver ${driverSet.hp}/${driverSet.vit}/${driverSet.chr}/${driverSet.evasionBonus}`);
  const tossSet = derive(bluGear, "hume", "BLU", null, ["Bomb Toss"]);
  if (tossSet.str !== 55) throw new Error(`set Bomb Toss ${tossSet.str}`);
  const bareBlu = derive(bluGear, "hume", "BLU", null, []);
  const slamSet = derive(bluGear, "hume", "BLU", null, ["Grand Slam"]);
  if (slamSet.int !== 54 || slamSet.defense !== bareBlu.defense) throw new Error(`set Grand Slam ${slamSet.int}/${slamSet.defense}/${bareBlu.defense}`);
  const soundSet = derive(bluGear, "hume", "BLU", null, ["Sound Blast"]);
  if (soundSet.mab !== 0 || soundSet.int !== 53 || soundSet.hp !== 1046) throw new Error(`set Sound Blast ${soundSet.mab}/${soundSet.hp}`);
  const soundSphere = derive(bluGear, "hume", "BLU", null, ["Sound Blast", "Cursed Sphere"]);
  if (soundSphere.mab !== 20 || soundSphere.mnd !== 54) throw new Error(`set Sound Blast Magic Attack Bonus ${soundSphere.mab}/${soundSphere.mnd}`);
  const soundMori = derive(bluGear, "hume", "BLU", null, ["Sound Blast", "Memento Mori"]);
  if (soundMori.mab !== 20 || soundMori.int !== 54) throw new Error(`set Sound Blast Memento Mori ${soundMori.mab}/${soundMori.int}`);
  const raySet = derive(bluGear, "hume", "BLU", null, ["Death Ray"]);
  if (raySet.hp !== 1041 || raySet.mp !== 469) throw new Error(`set Death Ray ${raySet.hp}/${raySet.mp}`);
  const smiteSet = derive(bluGear, "hume", "BLU", null, ["Smite of Rage"]);
  if (smiteSet.agi !== 56 || smiteSet.undeadKiller !== 0) throw new Error(`set Smite of Rage ${smiteSet.agi}/${smiteSet.undeadKiller}`);
  const smiteClub = derive(bluGear, "hume", "BLU", null, ["Smite of Rage", "Bludgeon"]);
  if (smiteClub.undeadKiller !== 0.08 || smiteClub.str !== 54 || smiteClub.agi !== 56) throw new Error(`set Undead Killer ${smiteClub.undeadKiller}/${smiteClub.str}/${smiteClub.agi}`);
  const digestSet = derive(bluGear, "hume", "BLU", null, ["Digest"]);
  if (digestSet.hp !== 1041 || digestSet.mp !== 469) throw new Error(`set Digest ${digestSet.hp}/${digestSet.mp}`);
  const pineSet = derive(bluGear, "hume", "BLU", null, ["Pinecone Bomb"]);
  if (pineSet.str !== 54) throw new Error(`set Pinecone Bomb ${pineSet.str}`);
  const kissSet = derive(bluGear, "hume", "BLU", null, ["MP Drainkiss"]);
  if (kissSet.mp !== 469 || kissSet.hp !== 1046) throw new Error(`set MP Drainkiss ${kissSet.mp}/${kissSet.hp}`);
  const boltSet = derive(bluGear, "hume", "BLU", null, ["Blitzstrahl"]);
  if (boltSet.dex !== 56 || boltSet.mp !== 464) throw new Error(`set Blitzstrahl ${boltSet.dex}/${boltSet.mp}`);
  const gasSet = derive(bluGear, "hume", "BLU", null, ["Stinking Gas"]);
  if (gasSet.agi !== 54 || gasSet.autoRefresh !== 0) throw new Error(`set Stinking Gas ${gasSet.agi}/${gasSet.autoRefresh}`);
  const gasActinic = derive(bluGear, "hume", "BLU", null, ["Stinking Gas", "Actinic Burst"]);
  if (gasActinic.autoRefresh !== 0 || gasActinic.agi !== 54 || gasActinic.chr !== 55) throw new Error(`set Stinking Gas Actinic ${gasActinic.autoRefresh}`);
  const biteSet = derive(bluGear, "hume", "BLU", null, ["Mandibular Bite"]);
  if (biteSet.int !== 54) throw new Error(`set Mandibular Bite ${biteSet.int}`);
  const cloudSet = derive(bluGear, "hume", "BLU", null, ["Magnetite Cloud"]);
  if (cloudSet.vit !== 55 || cloudSet.hp !== 1046) throw new Error(`set Magnetite Cloud ${cloudSet.vit}/${cloudSet.hp}`);
  const blankSet = derive(bluGear, "hume", "BLU", null, ["Blank Gaze"]);
  if (blankSet.hp !== bareBlu.hp || blankSet.mp !== bareBlu.mp || blankSet.agi !== bareBlu.agi) throw new Error(`set Blank Gaze ${blankSet.hp}/${blankSet.mp}`);
  const jetSet = derive(bluGear, "hume", "BLU", null, ["Jet Stream"]);
  if (jetSet.dex !== 55 || jetSet.rapidShot !== 0) throw new Error(`set Jet Stream ${jetSet.dex}/${jetSet.rapidShot}`);
  const jetFeather = derive(bluGear, "hume", "BLU", null, ["Jet Stream", "Feather Storm"]);
  if (jetFeather.rapidShot !== 0.25 || jetFeather.hp !== 1051 || jetFeather.chr !== 55 || jetFeather.dex !== 55) {
    throw new Error(`set Rapid Shot ${jetFeather.rapidShot}/${jetFeather.hp}/${jetFeather.chr}/${jetFeather.dex}`);
  }
  const lightSet = derive(bluGear, "hume", "BLU", null, ["Mysterious Light"]);
  if (lightSet.agi !== 56 || lightSet.mp !== 464 || lightSet.str !== 53) throw new Error(`set Mysterious Light ${lightSet.agi}/${lightSet.mp}`);
  const lightMetal = derive(bluGear, "hume", "BLU", null, ["Mysterious Light", "Metallic Body"]);
  if (lightMetal.mp !== 474 || lightMetal.agi !== 56) throw new Error(`set Max MP Boost ${lightMetal.mp}/${lightMetal.agi}`);
  const terrorSet = derive(bluGear, "hume", "BLU", null, ["Terror Touch"]);
  if (terrorSet.hp !== 1041 || terrorSet.mp !== 474 || terrorSet.defense !== bareBlu.defense) {
    throw new Error(`set Terror Touch ${terrorSet.hp}/${terrorSet.mp}/${terrorSet.defense}/${bareBlu.defense}`);
  }
  const terrorSlam = derive(bluGear, "hume", "BLU", null, ["Terror Touch", "Grand Slam"]);
  if (terrorSlam.defense !== bareBlu.defense + 10 || terrorSlam.int !== 54 || terrorSlam.hp !== 1041 || terrorSlam.mp !== 474) {
    throw new Error(`set Defense Bonus ${terrorSlam.defense}/${bareBlu.defense}/${terrorSlam.int}`);
  }
  const venomSet = derive(bluGear, "hume", "BLU", null, ["Venom Shell"]);
  if (venomSet.mnd !== 55 || venomSet.clearMind !== 0) throw new Error(`set Venom Shell ${venomSet.mnd}/${venomSet.clearMind}`);
  const venomMind = derive(bluGear, "hume", "BLU", null, ["Venom Shell", "Mind Blast"]);
  if (venomMind.clearMind !== 3 || venomMind.mnd !== 56 || venomMind.mp !== 469) {
    throw new Error(`set Venom Shell Clear Mind ${venomMind.clearMind}/${venomMind.mnd}/${venomMind.mp}`);
  }
  const venomBreath = derive(bluGear, "hume", "BLU", null, ["Venom Shell", "Poison Breath"]);
  if (venomBreath.clearMind !== 3 || venomBreath.mnd !== 56 || venomBreath.mp !== 464) {
    throw new Error(`set Venom Shell Poison Breath ${venomBreath.clearMind}/${venomBreath.mnd}/${venomBreath.mp}`);
  }
  const geistSet = derive(bluGear, "hume", "BLU", null, ["Geist Wall"]);
  if (geistSet.hp !== 1041 || geistSet.mp !== 474) throw new Error(`set Geist Wall ${geistSet.hp}/${geistSet.mp}`);
  const awfulSet = derive(bluGear, "hume", "BLU", null, ["Awful Eye"]);
  if (awfulSet.mnd !== 54 || awfulSet.clearMind !== 0) throw new Error(`set Awful Eye ${awfulSet.mnd}/${awfulSet.clearMind}`);
  const awfulBreath = derive(bluGear, "hume", "BLU", null, ["Awful Eye", "Poison Breath"]);
  if (awfulBreath.clearMind !== 3 || awfulBreath.mnd !== 55) throw new Error(`set Awful Eye Clear Mind ${awfulBreath.clearMind}/${awfulBreath.mnd}`);
  const saberSet = derive(bluGear, "hume", "BLU", null, ["Blood Saber"]);
  if (saberSet.hp !== 1041 || saberSet.mp !== 469) throw new Error(`set Blood Saber ${saberSet.hp}/${saberSet.mp}`);
  const jettaSet = derive(bluGear, "hume", "BLU", null, ["Jettatura"]);
  if (jettaSet.mp !== 479 || jettaSet.hp !== 1046) throw new Error(`set Jettatura ${jettaSet.mp}/${jettaSet.hp}`);
  const iceSet = derive(bluGear, "hume", "BLU", null, ["Ice Break"]);
  if (iceSet.int !== 54 || iceSet.hp !== 1046) throw new Error(`set Ice Break ${iceSet.int}/${iceSet.hp}`);
  const radiantSet = derive(bluGear, "hume", "BLU", null, ["Radiant Breath"]);
  if (radiantSet.chr !== bareBlu.chr + 1 || radiantSet.hp !== bareBlu.hp + 5) throw new Error(`set Radiant Breath ${radiantSet.chr}/${radiantSet.hp}`);
  const barrierSet = derive(bluGear, "hume", "BLU", null, ["Feather Barrier"]);
  if (barrierSet.hp !== bareBlu.hp || barrierSet.chr !== bareBlu.chr || barrierSet.agi !== bareBlu.agi || barrierSet.evasion !== bareBlu.evasion) {
    throw new Error(`set Feather Barrier ${barrierSet.hp}/${barrierSet.evasion}`);
  }
  const hipSet = derive(bluGear, "hume", "BLU", null, ["Flying Hip Press"]);
  if (hipSet.agi !== bareBlu.agi + 1 || hipSet.hp !== bareBlu.hp) throw new Error(`set Flying Hip Press ${hipSet.agi}/${hipSet.hp}`);
  const penanceSet = derive(bluGear, "hume", "BLU", null, ["Light of Penance"]);
  if (penanceSet.chr !== bareBlu.chr + 1 || penanceSet.hp !== bareBlu.hp + 15 || penanceSet.autoRefresh !== 0) {
    throw new Error(`set Light of Penance ${penanceSet.chr}/${penanceSet.hp}/${penanceSet.autoRefresh}`);
  }
  const scissorsSet = derive(bluGear, "hume", "BLU", null, ["Death Scissors"]);
  if (scissorsSet.mnd !== bareBlu.mnd + 2 || scissorsSet.chr !== bareBlu.chr + 2 || scissorsSet.hp !== bareBlu.hp + 5 || scissorsSet.attack !== bareBlu.attack) {
    throw new Error(`set Death Scissors ${scissorsSet.mnd}/${scissorsSet.chr}/${scissorsSet.hp}/${scissorsSet.attack}`);
  }
  const upperOnly = derive(bluGear, "hume", "BLU", null, ["Uppercut"]);
  const upperScissors = derive(bluGear, "hume", "BLU", null, ["Uppercut", "Death Scissors"]);
  if (upperScissors.attack !== upperOnly.attack + 10 || upperScissors.str !== upperOnly.str) {
    throw new Error(`set Death Scissors Attack Bonus ${upperScissors.attack}/${upperOnly.attack}`);
  }
  const dimensionSet = derive(bluGear, "hume", "BLU", null, ["Dimensional Death"]);
  if (dimensionSet.dex !== bareBlu.dex + 1 || dimensionSet.chr !== bareBlu.chr + 1 || dimensionSet.hp !== bareBlu.hp + 5 || dimensionSet.accuracyBonus !== 0) {
    throw new Error(`set Dimensional Death ${dimensionSet.dex}/${dimensionSet.chr}/${dimensionSet.hp}/${dimensionSet.accuracyBonus}`);
  }
  const ripDimension = derive(bluGear, "hume", "BLU", null, ["Frenetic Rip", "Dimensional Death"]);
  if (ripDimension.accuracyBonus !== 10 || ripDimension.dex !== dimensionSet.dex || ripDimension.accuracy !== dimensionSet.accuracy + 10) {
    throw new Error(`set Dimensional Death Accuracy Bonus ${ripDimension.accuracyBonus}/${ripDimension.dex}/${ripDimension.accuracy}`);
  }
  const spiralSet = derive(bluGear, "hume", "BLU", null, ["Spiral Spin"]);
  if (spiralSet.str !== bareBlu.str + 1 || spiralSet.hp !== bareBlu.hp + 5) {
    throw new Error(`set Spiral Spin ${spiralSet.str}/${spiralSet.hp}`);
  }
  const maelSet = derive(bluGear, "hume", "BLU", null, ["Maelstrom"]);
  if (maelSet.mnd !== bareBlu.mnd + 2 || maelSet.clearMind !== 0) throw new Error(`set Maelstrom ${maelSet.mnd}/${maelSet.clearMind}`);
  const maelBreath = derive(bluGear, "hume", "BLU", null, ["Poison Breath", "Maelstrom"]);
  if (maelBreath.clearMind !== 3 || maelBreath.mnd !== bareBlu.mnd + 3) throw new Error(`set Maelstrom Clear Mind ${maelBreath.clearMind}/${maelBreath.mnd}`);
  const eyesSet = derive(bluGear, "hume", "BLU", null, ["Eyes On Me"]);
  if (eyesSet.hp !== bareBlu.hp - 5 || eyesSet.mp !== bareBlu.mp + 15 || eyesSet.mab !== 0) {
    throw new Error(`set Eyes On Me ${eyesSet.hp}/${eyesSet.mp}/${eyesSet.mab}`);
  }
  const eyesMori = derive(bluGear, "hume", "BLU", null, ["Memento Mori", "Eyes On Me"]);
  if (eyesMori.mab !== 20 || eyesMori.hp !== bareBlu.hp - 5 || eyesMori.mp !== bareBlu.mp + 15) {
    throw new Error(`set Eyes On Me Magic Attack Bonus ${eyesMori.mab}/${eyesMori.hp}/${eyesMori.mp}`);
  }
  const seedSet = derive(bluGear, "hume", "BLU", null, ["Seedspray"]);
  if (seedSet.vit !== bareBlu.vit + 1 || seedSet.beastKiller !== 0) throw new Error(`set Seedspray ${seedSet.vit}/${seedSet.beastKiller}`);
  const seedOats = derive(bluGear, "hume", "BLU", null, ["Wild Oats", "Seedspray"]);
  if (seedOats.beastKiller !== 0.08 || seedOats.vit !== bareBlu.vit + 1) {
    throw new Error(`set Seedspray Beast Killer ${seedOats.beastKiller}/${seedOats.vit}`);
  }
  const badSet = derive(bluGear, "hume", "BLU", null, ["Bad Breath"]);
  if (badSet.int !== bareBlu.int + 2 || badSet.mnd !== bareBlu.mnd + 2 || badSet.fastCast !== bareBlu.fastCast) {
    throw new Error(`set Bad Breath ${badSet.int}/${badSet.mnd}/${badSet.fastCast}`);
  }
  const bodySlamSet = derive(bluGear, "hume", "BLU", null, ["Body Slam"]);
  if (bodySlamSet.vit !== bareBlu.vit + 1 || bodySlamSet.mp !== bareBlu.mp + 5 || bodySlamSet.hp !== bareBlu.hp) {
    throw new Error(`set Body Slam ${bodySlamSet.vit}/${bodySlamSet.mp}/${bodySlamSet.hp}`);
  }
  const hipSlam = derive(bluGear, "hume", "BLU", null, ["Flying Hip Press", "Body Slam"]);
  if (hipSlam.hp !== bodySlamSet.hp + 30 || hipSlam.vit !== bodySlamSet.vit || hipSlam.agi !== bareBlu.agi + 1) {
    throw new Error(`set Body Slam Max HP Boost ${hipSlam.hp}/${bodySlamSet.hp}/${hipSlam.agi}`);
  }
  const needlesSet = derive(bluGear, "hume", "BLU", null, ["1000 Needles"]);
  if (needlesSet.vit !== bareBlu.vit + 3 || needlesSet.agi !== bareBlu.agi + 3 || needlesSet.beastKiller !== 0) {
    throw new Error(`set 1000 Needles ${needlesSet.vit}/${needlesSet.agi}/${needlesSet.beastKiller}`);
  }
  const needlesSeed = derive(bluGear, "hume", "BLU", null, ["1000 Needles", "Seedspray"]);
  if (needlesSeed.beastKiller !== 0.08 || needlesSeed.vit !== bareBlu.vit + 4) {
    throw new Error(`set 1000 Needles Beast Killer ${needlesSeed.beastKiller}/${needlesSeed.vit}`);
  }
  const spinalSet = derive(bluGear, "hume", "BLU", null, ["Spinal Cleave"]);
  if (spinalSet.vit !== bareBlu.vit + 2 || spinalSet.int !== bareBlu.int + 1 || spinalSet.mnd !== bareBlu.mnd + 1 || spinalSet.attack !== bareBlu.attack) {
    throw new Error(`set Spinal Cleave ${spinalSet.vit}/${spinalSet.int}/${spinalSet.attack}`);
  }
  const spinalCut = derive(bluGear, "hume", "BLU", null, ["Spinal Cleave", "Death Scissors"]);
  if (spinalCut.attack !== bareBlu.attack + 10 || spinalCut.mnd !== bareBlu.mnd + 3) {
    throw new Error(`set Spinal Cleave Attack Bonus ${spinalCut.attack}/${spinalCut.mnd}`);
  }
  const frySet = derive(bluGear, "hume", "BLU", null, ["Frypan"]);
  if (frySet.dex !== bareBlu.dex + 2 || frySet.hp !== bareBlu.hp) {
    throw new Error(`set Frypan ${frySet.dex}/${frySet.hp}`);
  }
  const warMorbol = derive(DEFAULT_LOADOUT, "hume", "WAR", "BLU", ["Bad Breath", "Body Slam", "1000 Needles", "Spinal Cleave", "Frypan"]);
  if (warMorbol.hp !== warBlu.hp || warMorbol.mp !== warBlu.mp || warMorbol.int !== warBlu.int || warMorbol.vit !== warBlu.vit || warMorbol.agi !== warBlu.agi || warMorbol.dex !== warBlu.dex || warMorbol.fastCast !== warBlu.fastCast || warMorbol.beastKiller !== warBlu.beastKiller || warMorbol.attack !== warBlu.attack) {
    throw new Error("subjob morbol blue set");
  }
  const hydroSet = derive(bluGear, "hume", "BLU", null, ["Hydro Shot"]);
  if (hydroSet.mnd !== bareBlu.mnd + 2 || hydroSet.rapidShot !== 0) throw new Error(`set Hydro Shot ${hydroSet.mnd}/${hydroSet.rapidShot}`);
  const hydroFeather = derive(bluGear, "hume", "BLU", null, ["Feather Storm", "Hydro Shot"]);
  if (hydroFeather.rapidShot !== 0.25 || hydroFeather.mnd !== bareBlu.mnd + 2) throw new Error(`set Hydro Shot Rapid Shot ${hydroFeather.rapidShot}/${hydroFeather.mnd}`);
  const tickleSet = derive(bluGear, "hume", "BLU", null, ["Feather Tickle"]);
  if (tickleSet.agi !== bareBlu.agi + 1 || tickleSet.clearMind !== 0) throw new Error(`set Feather Tickle ${tickleSet.agi}/${tickleSet.clearMind}`);
  const tickleBreath = derive(bluGear, "hume", "BLU", null, ["Poison Breath", "Feather Tickle"]);
  if (tickleBreath.clearMind !== 3 || tickleBreath.agi !== bareBlu.agi + 1) throw new Error(`set Feather Tickle Clear Mind ${tickleBreath.clearMind}/${tickleBreath.agi}`);
  const yawnSet = derive(bluGear, "hume", "BLU", null, ["Yawn"]);
  if (yawnSet.chr !== bareBlu.chr + 1 || yawnSet.hp !== bareBlu.hp + 5 || yawnSet.resistSleep !== 0) throw new Error(`set Yawn ${yawnSet.chr}/${yawnSet.hp}/${yawnSet.resistSleep}`);
  const yawnPollen = derive(bluGear, "hume", "BLU", null, ["Pollen", "Yawn"]);
  if (yawnPollen.resistSleep !== 0.1 || yawnPollen.hp !== bareBlu.hp + 10) throw new Error(`set Yawn Resist Sleep ${yawnPollen.resistSleep}/${yawnPollen.hp}`);
  const trunkSet = derive(bluGear, "hume", "BLU", null, ["Voracious Trunk"]);
  if (trunkSet.agi !== bareBlu.agi + 2 || trunkSet.autoRefresh !== 0) throw new Error(`set Voracious Trunk ${trunkSet.agi}/${trunkSet.autoRefresh}`);
  const trunkTrio = derive(bluGear, "hume", "BLU", null, ["Actinic Burst", "Voracious Trunk", "Stinking Gas"]);
  if (trunkTrio.autoRefresh !== 1 || trunkTrio.agi !== bareBlu.agi + 3) throw new Error(`set Voracious Trunk Auto Refresh ${trunkTrio.autoRefresh}/${trunkTrio.agi}`);
  const infraSet = derive(bluGear, "hume", "BLU", null, ["Infrasonics"]);
  if (infraSet.int !== bareBlu.int + 1) throw new Error(`set Infrasonics ${infraSet.int}`);
  const frostSet = derive(bluGear, "hume", "BLU", null, ["Frost Breath"]);
  if (frostSet.int !== bareBlu.int - 2 || frostSet.conserveMp !== 0) throw new Error(`set Frost Breath ${frostSet.int}/${frostSet.conserveMp}`);
  const frostEye = derive(bluGear, "hume", "BLU", null, ["Frost Breath", "Chaotic Eye"]);
  if (frostEye.conserveMp !== 0.25 || frostEye.int !== bareBlu.int - 2) throw new Error(`set Frost Breath Conserve MP ${frostEye.conserveMp}`);
  const spraySet = derive(bluGear, "hume", "BLU", null, ["Sandspray"]);
  if (spraySet.vit !== bareBlu.vit + 1 || spraySet.clearMind !== 0) throw new Error(`set Sandspray ${spraySet.vit}/${spraySet.clearMind}`);
  const sprayBreath = derive(bluGear, "hume", "BLU", null, ["Poison Breath", "Sandspray"]);
  if (sprayBreath.clearMind !== 3) throw new Error(`set Sandspray Clear Mind ${sprayBreath.clearMind}`);
  const oozeSet = derive(bluGear, "hume", "BLU", null, ["Corrosive Ooze"]);
  if (oozeSet.hp !== bareBlu.hp - 10 || oozeSet.mp !== bareBlu.mp + 10 || oozeSet.clearMind !== 0) throw new Error(`set Corrosive Ooze ${oozeSet.hp}/${oozeSet.mp}`);
  const oozeBreath = derive(bluGear, "hume", "BLU", null, ["Poison Breath", "Corrosive Ooze"]);
  if (oozeBreath.clearMind !== 3) throw new Error(`set Corrosive Ooze Clear Mind ${oozeBreath.clearMind}`);
  const oozeSpray = derive(bluGear, "hume", "BLU", null, ["Sandspray", "Corrosive Ooze"]);
  if (oozeSpray.clearMind !== 3) throw new Error(`set Sandspray Ooze Clear Mind ${oozeSpray.clearMind}`);
  const hideSet = derive(bluGear, "hume", "BLU", null, ["Diamondhide"]);
  if (hideSet.vit !== bareBlu.vit + 1) throw new Error(`set Diamondhide ${hideSet.vit}`);
  const enervSet = derive(bluGear, "hume", "BLU", null, ["Enervation"]);
  if (enervSet.hp !== bareBlu.hp - 5 || enervSet.mp !== bareBlu.mp + 5) throw new Error(`set Enervation ${enervSet.hp}/${enervSet.mp}`);
  const warRaptor = derive(DEFAULT_LOADOUT, "hume", "WAR", "BLU", ["Frost Breath", "Sandspray", "Corrosive Ooze", "Diamondhide", "Enervation"]);
  if (warRaptor.int !== warBlu.int || warRaptor.vit !== warBlu.vit || warRaptor.hp !== warBlu.hp || warRaptor.mp !== warBlu.mp || warRaptor.conserveMp !== warBlu.conserveMp || warRaptor.clearMind !== warBlu.clearMind) {
    throw new Error("subjob raptor blue set");
  }
  const warSahagin = derive(DEFAULT_LOADOUT, "hume", "WAR", "BLU", ["Hydro Shot", "Feather Tickle", "Yawn", "Voracious Trunk", "Infrasonics"]);
  if (warSahagin.mnd !== warBlu.mnd || warSahagin.agi !== warBlu.agi || warSahagin.chr !== warBlu.chr || warSahagin.hp !== warBlu.hp || warSahagin.int !== warBlu.int || warSahagin.rapidShot !== warBlu.rapidShot || warSahagin.clearMind !== warBlu.clearMind || warSahagin.resistSleep !== warBlu.resistSleep || warSahagin.autoRefresh !== warBlu.autoRefresh) {
    throw new Error("subjob sahagin blue set");
  }
  const warShadow = derive(DEFAULT_LOADOUT, "hume", "WAR", "BLU", ["Dimensional Death", "Spiral Spin", "Maelstrom", "Eyes On Me", "Seedspray"]);
  if (warShadow.hp !== warBlu.hp || warShadow.mp !== warBlu.mp || warShadow.dex !== warBlu.dex || warShadow.str !== warBlu.str || warShadow.mnd !== warBlu.mnd || warShadow.vit !== warBlu.vit || warShadow.chr !== warBlu.chr || warShadow.accuracyBonus !== warBlu.accuracyBonus || warShadow.mab !== warBlu.mab || warShadow.clearMind !== warBlu.clearMind || warShadow.beastKiller !== warBlu.beastKiller) {
    throw new Error("subjob shadow blue set");
  }
  const penanceRefresh = derive(bluGear, "hume", "BLU", null, ["Actinic Burst", "Self-Destruct", "Light of Penance"]);
  if (penanceRefresh.autoRefresh !== 1) throw new Error(`set Light of Penance Auto Refresh ${penanceRefresh.autoRefresh}`);
  const warWyvern = derive(DEFAULT_LOADOUT, "hume", "WAR", "BLU", ["Radiant Breath", "Feather Barrier", "Flying Hip Press", "Light of Penance", "Death Scissors"]);
  if (warWyvern.hp !== warBlu.hp || warWyvern.chr !== warBlu.chr || warWyvern.agi !== warBlu.agi || warWyvern.mnd !== warBlu.mnd || warWyvern.attack !== warBlu.attack) {
    throw new Error("subjob wyvern blue set");
  }
  const warLizard = derive(DEFAULT_LOADOUT, "hume", "WAR", "BLU", ["Geist Wall", "Awful Eye", "Blood Saber", "Jettatura", "Ice Break", "Magnetite Cloud"]);
  if (warLizard.hp !== warBlu.hp || warLizard.mp !== warBlu.mp || warLizard.mnd !== warBlu.mnd || warLizard.int !== warBlu.int) {
    throw new Error("subjob lizard blue set");
  }
  const warGaze = derive(DEFAULT_LOADOUT, "hume", "WAR", "BLU", ["Blank Gaze", "Jet Stream", "Mysterious Light", "Terror Touch", "Venom Shell", "Feather Storm", "Metallic Body", "Grand Slam", "Mind Blast"]);
  if (warGaze.dex !== warBlu.dex || warGaze.agi !== warBlu.agi || warGaze.mp !== warBlu.mp || warGaze.hp !== warBlu.hp || warGaze.defense !== warBlu.defense || warGaze.rapidShot !== 0 || warGaze.clearMind !== warBlu.clearMind || warGaze.mnd !== warBlu.mnd) {
    throw new Error("subjob gaze blue set");
  }
  const warShell = derive(DEFAULT_LOADOUT, "hume", "WAR", "BLU", ["Metallic Body", "Queasyshroom", "Head Butt", "Feather Storm", "Helldive"]);
  if (warShell.hp !== warBlu.hp || warShell.mp !== warBlu.mp || warShell.dex !== warBlu.dex || warShell.chr !== warBlu.chr || warShell.rapidShot !== warBlu.rapidShot) {
    throw new Error("subjob shell blue set");
  }
  const nin = derive(fitLoadout(DEFAULT_LOADOUT, "NIN"), "hume", "NIN");
  if (nin.weaponName !== "Kunai" || nin.skillName !== "Katana" || nin.skill !== 276) throw new Error("NIN kunai");
  if (nin.hp !== 1166 || nin.mp !== 0 || nin.str !== 61 || nin.dex !== 65 || nin.agi !== 65 || nin.int !== 56) {
    throw new Error(`equipped Hume NIN ${nin.hp}/${nin.mp}/${nin.str}/${nin.dex}/${nin.agi}`);
  }
  if (nin.dualWield !== 0.3 || nin.swing.baseDelay !== 190 || nin.swing.modifiedDelay !== 133 || nin.subtleBlow !== 25 || nin.stealth !== 0.12) {
    throw new Error(`NIN traits ${nin.dualWield}/${nin.swing.baseDelay}/${nin.swing.modifiedDelay}/${nin.subtleBlow}`);
  }
  if (nin.pdifCap !== 3.25 + 26 / 256) throw new Error("NIN damage limit");
  const ninGear = fitLoadout(DEFAULT_LOADOUT, "NIN");
  if (ninGear.main !== "kunai" || ninGear.sub !== "kunai-off") throw new Error("NIN dual kunai");
  const kept = fitLoadout({ ...DEFAULT_LOADOUT, main: "onion-sword" }, "NIN");
  if (kept.main !== "onion-sword" || kept.sub !== "kunai-off") throw new Error("NIN keeps another one-handed weapon");
  const swordNin = derive(kept, "hume", "NIN");
  if (swordNin.delay !== 228 || swordNin.dualWield !== 0.3 || swordNin.swing.baseDelay !== 209 || swordNin.swing.modifiedDelay !== 146) {
    throw new Error(`NIN sword dual delay ${swordNin.delay}/${swordNin.swing.baseDelay}/${swordNin.swing.modifiedDelay}`);
  }
  const warNin = derive(DEFAULT_LOADOUT, "hume", "WAR", "NIN");
  const warNinNaked = characterBase("hume", "WAR", LEVEL, "NIN", subjobLevel(LEVEL));
  const warBoost = maxHpBoost(LEVEL);
  const ninBoost = ninMaxHp(subjobLevel(LEVEL), "sub");
  if (warNin.hp !== warNinNaked.hp + Math.max(warBoost, ninBoost) || warNin.hp === warNinNaked.hp + warBoost + ninBoost) {
    throw new Error("WAR/NIN HP boosts stack");
  }
  if (warNin.dualWield !== 0 || warNin.subtleBlow !== 10 || warNin.stealth !== 0.12 || warNin.skill !== 250) {
    throw new Error("WAR/NIN sheet");
  }
  const brdGear = fitLoadout(DEFAULT_LOADOUT, "BRD");
  if (brdGear.main !== "bronze-dagger" || brdGear.range !== "maple-harp") throw new Error("BRD dagger and harp");
  const brdStaff = fitLoadout({ ...DEFAULT_LOADOUT, main: "ash-staff" }, "BRD");
  if (brdStaff.main !== "ash-staff" || brdStaff.sub !== null || brdStaff.range !== "maple-harp") throw new Error("BRD can keep a staff");
  const brdFlute = fitLoadout({ ...DEFAULT_LOADOUT, main: "bronze-dagger", range: "piccolo" }, "BRD");
  if (brdFlute.range !== "piccolo" || brdFlute.main !== "bronze-dagger") throw new Error("BRD flute");
  const onion = ITEMS["onion-sword"];
  const dagger = ITEMS["bronze-dagger"];
  const staff = ITEMS["ash-staff"];
  if (!canEquipInSub(dagger, "BRD", "NIN", onion) || !canEquipInSub(ITEMS["ash-club"], "BRD", "NIN", onion)) throw new Error("BRD/NIN offhand weapons");
  if (!canEquipInSub(ITEMS["kunai"], "BRD", "NIN", onion) || !canEquipInSub(ITEMS["kunai-off"], "BRD", "NIN", onion)) throw new Error("BRD/NIN katana from the subjob");
  if (canEquipInSub(dagger, "BRD", null, onion) || canEquipInSub(dagger, "BRD", "WHM", onion)) throw new Error("no Dual Wield without Ninja");
  if (canEquipInSub(staff, "BRD", "NIN", onion) || canEquipInSub(ITEMS["lauan-shield"], "BRD", "NIN", onion)) throw new Error("Bard sub is not a staff or a shield");
  if (canEquipInSub(dagger, "BRD", "NIN", staff)) throw new Error("two-handed main blocks Dual Wield");
  if (!canEquipInSub(ITEMS["lauan-shield"], "WAR", "NIN", ITEMS["bronze-sword"])) throw new Error("WAR/NIN shield");
  if (!canEquipInSub(ITEMS["bronze-axe"], "WAR", "NIN", ITEMS["bronze-sword"])) throw new Error("WAR/NIN axe offhand");
  const keptOff = fitLoadout({ ...DEFAULT_LOADOUT, main: "onion-sword", sub: "bronze-dagger", range: "maple-harp" }, "BRD", "NIN");
  if (keptOff.main !== "onion-sword" || keptOff.sub !== "bronze-dagger" || keptOff.range !== "maple-harp") throw new Error("BRD/NIN keeps the offhand");
  const dropped = fitLoadout(keptOff, "BRD", null);
  if (dropped.sub !== null || dropped.main !== "onion-sword") throw new Error("losing Ninja drops the offhand");
  const dw = derive(keptOff, "hume", "BRD", "NIN");
  if (dw.dualWield !== 0.15 || dw.delay !== 228 || dw.swing.baseDelay !== 205.5 || dw.swing.modifiedDelay !== 174) {
    throw new Error(`BRD/NIN dual delay ${dw.dualWield}/${dw.delay}/${dw.swing.baseDelay}/${dw.swing.modifiedDelay}`);
  }
  if (!dw.offhand || dw.offhand.dmg !== 3 || dw.offhand.skillName !== "Dagger" || dw.offhand.skill !== 240 || dw.offhand.fstr !== dw.fstr) {
    throw new Error("BRD/NIN offhand dagger");
  }
  if (dw.offhand.attackFlat !== dw.attackFlat + 20 || dw.offhand.accuracy !== dw.accuracy + 18) {
    throw new Error(`BRD/NIN offhand skill ${dw.offhand.attackFlat}/${dw.attackFlat}/${dw.offhand.accuracy}/${dw.accuracy}`);
  }
  const bare = derive({ ...keptOff, sub: null }, "hume", "BRD", "NIN");
  if (bare.dualWield !== 0 || bare.offhand) throw new Error("empty sub is not dual wield");
  if (sanitizeLoadout({ main: "onion-sword", sub: "bronze-dagger", range: "maple-harp" }).sub !== "bronze-dagger") throw new Error("save keeps an offhand weapon");
  if (!nin.offhand || nin.offhand.skillName !== "Katana" || nin.offhand.skill !== 276 || nin.offhand.dmg !== 4) throw new Error("NIN offhand kunai");
  const sword = DEFAULT_LOADOUT;
  const axe = { ...sword, main: "bronze-axe" };
  const shield = { ...sword, sub: "lauan-shield" };
  const bareSub = { ...shield, sub: null };
  const bow = { ...sword, range: "shortbow" };
  const gun = { ...bow, range: "light-crossbow" };
  const noBow = { ...bow, range: null };
  const arrow = { ...bow, ammo: "wooden-arrow" };
  const bolt = { ...bow, ammo: "bronze-bolt" };
  const body = { ...sword, body: null };
  if (!tpLostOnWeaponChange(sword, axe) || !tpLostOnWeaponChange(sword, shield) || !tpLostOnWeaponChange(shield, bareSub)) throw new Error("main and sub wipe TP");
  if (!tpLostOnWeaponChange(sword, bow) || !tpLostOnWeaponChange(bow, gun)) throw new Error("equipping ranged wipes TP");
  if (tpLostOnWeaponChange(bow, noBow) || tpLostOnWeaponChange(bow, arrow) || tpLostOnWeaponChange(arrow, bolt) || tpLostOnWeaponChange(sword, body) || tpLostOnWeaponChange(sword, sword)) {
    throw new Error("ammo, armor, and removing the ranged weapon keep TP");
  }
}
