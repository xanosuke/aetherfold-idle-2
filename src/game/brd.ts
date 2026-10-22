/**
 * Retail Bard toolkit through level 75. No merits and no job points.
 *
 * A support job here is level 37. Soul Voice is a one-hour ability and is
 * main only. Pianissimo is level 20, so a subjob has it. Nightingale and
 * Troubadour are group-2 merits. No ranks are unlocked. Tenuto, Marcato,
 * and Clarion Call are past 75.
 *
 * The client spell rows list mp_cost 0. This yard's 2005 grade table gives
 * Bard no MP pool, so a song spends nothing. Cast and recast are the client
 * numbers: most buffs are 8s / 24s, debuffs are 2s / 24s, Mazurka and
 * Hymnus and Virelai are 4s. Chocobo Mazurka and Maiden's Virelai recast
 * at 60s. A song is not stopped by a hit. Moving still breaks the cast.
 *
 * Combined skill is Singing plus the equipped instrument. A harp adds
 * String. A flute adds Wind. No instrument is Singing alone, and only one
 * song can be up. With an instrument, two songs can be up. The same family
 * replaces itself, except two different Marches, which both stay. A third
 * song replaces the oldest. Clarion Call would add a third slot. It is not
 * learned. Adventurer's Dirge and Foe Sirvente are merit songs and are not
 * on the list.
 *
 * Potency is the BG +0 column: no song gear, no merits, no job points.
 * Minuet I–III use the printed skill caps (163, 310, 455). Minuet IV's cap
 * was not on that table. One more step of the same ~145 skill per tier
 * puts it at 527, so a 450-skill bard is short of 112. Every other family
 * treats 450 as the cap that earns the printed +0 number. That is Singing
 * 225 plus the matching instrument 225. Etudes use the printed skill bands
 * instead. The tier-2 line past 445 was cut off, so 450 stays at 13.
 *
 * Soul Voice doubles a buff's effect, or a debuff's effect. Lullaby,
 * Virelai, Mazurka, and Hymnus use duration. Mazurka's speed stays the
 * printed 10% or 20%. Hymnus stays a reraise: 50% experience, like
 * Reraise I, and 50% of the weakened maximum HP, like Reraise III.
 * The job-point cast cut is not applied. Pianissimo limits the next song
 * to one target and, on the ability page, cuts a base cast above 4 seconds
 * down to 4. It is spent when the song completes.
 *
 * The job book reads `songCard`. Party songs are an area of 12' around
 * the bard. Pianissimo makes the next one a single target. Foe Lullaby's
 * client duration cell is 45 seconds. The potency table, and what lands,
 * is 30 seconds at the skill cap. Horde Lullaby's radius follows String
 * skill and stops at 8'. Chocobo Hum and Cactuar Fugue are in the client
 * with `unlearnable` set, so they are not on this list.
 */

import type { JobAccess } from "./blm";
import { skillCap, type SkillRank } from "./skills";
import { characterBase, type JobId } from "./stats";

export const BRD_CAP = 75;

/** Party songs reach this far. The client range cell is 12. */
export const SONG_RADIUS = 12;

export const SOUL_VOICE_SECONDS = 180;
export const SOUL_VOICE_RECAST = 3600;
export const PIANISSIMO_SECONDS = 60;
export const PIANISSIMO_RECAST = 5;

/** Offensive songs claim. The client row does not print enmity, so this is a light enfeeble's 1 / 80. */
export const SONG_CE = 1;
export const SONG_VE = 80;

export type BrdAbility = {
  name: string;
  level: number;
  recast: number;
  duration: number;
  access: JobAccess;
  merit?: boolean;
  effect: string;
  ce: number;
  ve: number;
};

export type BrdTrait = {
  name: string;
  level: number;
  access: JobAccess;
  effect: string;
};

export type BrdSkill = {
  name: string;
  rank: SkillRank;
};

export type SongFamily =
  | "minuet"
  | "minne"
  | "paeon"
  | "madrigal"
  | "march"
  | "ballad"
  | "etude"
  | "carol"
  | "mambo"
  | "prelude"
  | "mazurka"
  | "operetta"
  | "gavotte"
  | "capriccio"
  | "fantasia"
  | "aubade"
  | "pastoral"
  | "round"
  | "hymnus"
  | "virelai"
  | "elegy"
  | "requiem"
  | "lullaby"
  | "threnody"
  | "finale";

export type SongHook =
  | "attack"
  | "defense"
  | "acc"
  | "racc"
  | "eva"
  | "haste"
  | "regen"
  | "refresh"
  | "stat"
  | "slow"
  | "sleep"
  | "dot"
  | "dispel"
  | "maccDown"
  | "charm"
  | "move"
  | "ward"
  | "none";

export type SongElement = "fire" | "ice" | "wind" | "earth" | "thunder" | "water" | "light" | "dark";

export type SongStat = "str" | "dex" | "vit" | "agi" | "int" | "mnd" | "chr";

export type SongDef = {
  name: string;
  level: number;
  element: SongElement;
  cast: number;
  recast: number;
  duration: number;
  range: number;
  hostile: boolean;
  wide: boolean;
  family: SongFamily;
  hook: SongHook;
  potency: number;
  skillCap: number;
  soul: "effect" | "duration";
  etude?: 1 | 2;
  stat?: SongStat;
};

type SongRow = readonly [
  string,
  number,
  SongElement,
  number,
  number,
  number,
  number,
  0 | 1,
  0 | 1,
  SongFamily,
  SongHook,
  number,
  number,
  "effect" | "duration",
  string,
];

/** name, level, element, cast, recast, duration, range, hostile, wide, family, hook, potency, skill cap, soul, extra. */
const ROWS: readonly SongRow[] = [
  ["Knight's Minne", 1, "earth", 8, 24, 120, 12, 0, 0, "minne", "defense", 30, 450, "effect", ""],
  ["Valor Minuet", 3, "fire", 8, 24, 120, 12, 0, 0, "minuet", "attack", 32, 163, "effect", ""],
  ["Army's Paeon", 5, "light", 8, 24, 120, 12, 0, 0, "paeon", "regen", 2, 450, "effect", ""],
  ["Foe Requiem", 7, "light", 2, 24, 60, 11, 1, 1, "requiem", "dot", 2, 450, "effect", ""],
  ["Herb Pastoral", 9, "thunder", 8, 24, 120, 12, 0, 0, "pastoral", "none", 0, 450, "effect", ""],
  ["Light Threnody", 10, "dark", 2, 24, 60, 12, 1, 0, "threnody", "maccDown", 50, 450, "effect", ""],
  ["Sword Madrigal", 11, "thunder", 8, 24, 120, 12, 0, 0, "madrigal", "acc", 45, 450, "effect", ""],
  ["Dark Threnody", 12, "light", 2, 24, 60, 12, 1, 0, "threnody", "maccDown", 50, 450, "effect", ""],
  ["Sheepfoe Mambo", 13, "wind", 8, 24, 120, 12, 0, 0, "mambo", "eva", 48, 450, "effect", ""],
  ["Earth Threnody", 14, "wind", 2, 24, 60, 12, 1, 0, "threnody", "maccDown", 50, 450, "effect", ""],
  ["Army's Paeon II", 15, "light", 8, 24, 120, 12, 0, 0, "paeon", "regen", 3, 450, "effect", ""],
  ["Foe Lullaby", 16, "light", 2, 24, 30, 12, 1, 0, "lullaby", "sleep", 30, 450, "duration", ""],
  ["Water Threnody", 16, "thunder", 2, 24, 60, 12, 1, 0, "threnody", "maccDown", 50, 450, "effect", ""],
  ["Foe Requiem II", 17, "light", 2, 24, 120, 11, 1, 1, "requiem", "dot", 3, 450, "effect", ""],
  ["Wind Threnody", 18, "ice", 2, 24, 60, 12, 1, 0, "threnody", "maccDown", 50, 450, "effect", ""],
  ["Scop's Operetta", 19, "ice", 8, 24, 120, 12, 0, 0, "operetta", "none", 0, 450, "effect", ""],
  ["Fire Threnody", 20, "water", 2, 24, 60, 12, 1, 0, "threnody", "maccDown", 50, 450, "effect", ""],
  ["Knight's Minne II", 21, "earth", 8, 24, 120, 12, 0, 0, "minne", "defense", 69, 450, "effect", ""],
  ["Enchanting Etude", 22, "light", 8, 24, 120, 12, 0, 0, "etude", "stat", 0, 450, "effect", "1:chr"],
  ["Ice Threnody", 22, "fire", 2, 24, 60, 12, 1, 0, "threnody", "maccDown", 50, 450, "effect", ""],
  ["Valor Minuet II", 23, "fire", 8, 24, 120, 12, 0, 0, "minuet", "attack", 64, 310, "effect", ""],
  ["Lightning Threnody", 24, "earth", 2, 24, 60, 12, 1, 0, "threnody", "maccDown", 50, 450, "effect", ""],
  ["Spirited Etude", 24, "water", 8, 24, 120, 12, 0, 0, "etude", "stat", 0, 450, "effect", "1:mnd"],
  ["Mage's Ballad", 25, "light", 8, 24, 120, 12, 0, 0, "ballad", "refresh", 1, 450, "effect", ""],
  ["Learned Etude", 26, "ice", 8, 24, 120, 12, 0, 0, "etude", "stat", 0, 450, "effect", "1:int"],
  ["Horde Lullaby", 27, "light", 2, 24, 30, 11, 1, 1, "lullaby", "sleep", 30, 450, "duration", ""],
  ["Quick Etude", 28, "wind", 8, 24, 120, 12, 0, 0, "etude", "stat", 0, 450, "effect", "1:agi"],
  ["Advancing March", 29, "thunder", 8, 24, 120, 12, 0, 0, "march", "haste", 108, 450, "effect", ""],
  ["Vivacious Etude", 30, "earth", 8, 24, 120, 12, 0, 0, "etude", "stat", 0, 450, "effect", "1:vit"],
  ["Hunter's Prelude", 31, "thunder", 8, 24, 120, 12, 0, 0, "prelude", "racc", 45, 450, "effect", ""],
  ["Dextrous Etude", 32, "thunder", 8, 24, 120, 12, 0, 0, "etude", "stat", 0, 450, "effect", "1:dex"],
  ["Fowl Aubade", 33, "light", 8, 24, 120, 12, 0, 0, "aubade", "none", 0, 450, "effect", ""],
  ["Magic Finale", 33, "light", 2, 24, 0, 12, 1, 0, "finale", "dispel", 0, 450, "effect", ""],
  ["Sinewy Etude", 34, "fire", 8, 24, 120, 12, 0, 0, "etude", "stat", 0, 450, "effect", "1:str"],
  ["Army's Paeon III", 35, "light", 8, 24, 120, 12, 0, 0, "paeon", "regen", 4, 450, "effect", ""],
  ["Light Carol", 36, "dark", 8, 24, 120, 12, 0, 0, "carol", "ward", 0, 450, "effect", ""],
  ["Foe Requiem III", 37, "light", 2, 24, 120, 11, 1, 1, "requiem", "dot", 4, 450, "effect", ""],
  ["Raptor Mazurka", 37, "wind", 4, 24, 120, 12, 0, 0, "mazurka", "move", 10, 450, "duration", ""],
  ["Earth Carol", 38, "wind", 8, 24, 120, 12, 0, 0, "carol", "ward", 0, 450, "effect", ""],
  ["Battlefield Elegy", 39, "earth", 2, 24, 120, 12, 1, 0, "elegy", "slow", 256, 450, "effect", ""],
  ["Water Carol", 40, "thunder", 8, 24, 120, 12, 0, 0, "carol", "ward", 0, 450, "effect", ""],
  ["Knight's Minne III", 41, "earth", 8, 24, 120, 12, 0, 0, "minne", "defense", 108, 450, "effect", ""],
  ["Wind Carol", 42, "ice", 8, 24, 120, 12, 0, 0, "carol", "ward", 0, 450, "effect", ""],
  ["Valor Minuet III", 43, "fire", 8, 24, 120, 12, 0, 0, "minuet", "attack", 96, 455, "effect", ""],
  ["Fire Carol", 44, "water", 8, 24, 120, 12, 0, 0, "carol", "ward", 0, 450, "effect", ""],
  ["Army's Paeon IV", 45, "light", 8, 24, 120, 12, 0, 0, "paeon", "regen", 5, 450, "effect", ""],
  ["Ice Carol", 46, "fire", 8, 24, 120, 12, 0, 0, "carol", "ward", 0, 450, "effect", ""],
  ["Foe Requiem IV", 47, "light", 2, 24, 120, 11, 1, 1, "requiem", "dot", 5, 450, "effect", ""],
  ["Lightning Carol", 48, "earth", 8, 24, 120, 12, 0, 0, "carol", "ward", 0, 450, "effect", ""],
  ["Goblin Gavotte", 49, "fire", 8, 24, 120, 12, 0, 0, "gavotte", "none", 0, 450, "effect", ""],
  ["Dark Carol", 50, "light", 8, 24, 120, 12, 0, 0, "carol", "ward", 0, 450, "effect", ""],
  ["Blade Madrigal", 51, "thunder", 8, 24, 120, 12, 0, 0, "madrigal", "acc", 60, 450, "effect", ""],
  ["Dragonfoe Mambo", 53, "wind", 8, 24, 120, 12, 0, 0, "mambo", "eva", 72, 450, "effect", ""],
  ["Gold Capriccio", 54, "wind", 8, 24, 120, 12, 0, 0, "capriccio", "none", 0, 450, "effect", ""],
  ["Mage's Ballad II", 55, "light", 8, 24, 120, 12, 0, 0, "ballad", "refresh", 2, 450, "effect", ""],
  ["Shining Fantasia", 56, "light", 8, 24, 120, 12, 0, 0, "fantasia", "none", 0, 450, "effect", ""],
  ["Foe Requiem V", 57, "light", 2, 24, 120, 11, 1, 1, "requiem", "dot", 6, 450, "effect", ""],
  ["Carnage Elegy", 59, "earth", 2, 24, 180, 12, 1, 0, "elegy", "slow", 512, 450, "effect", ""],
  ["Victory March", 60, "thunder", 8, 24, 120, 12, 0, 0, "march", "haste", 163, 450, "effect", ""],
  ["Knight's Minne IV", 61, "earth", 8, 24, 120, 12, 0, 0, "minne", "defense", 164, 450, "effect", ""],
  ["Bewitching Etude", 62, "light", 8, 24, 120, 12, 0, 0, "etude", "stat", 0, 450, "effect", "2:chr"],
  ["Valor Minuet IV", 63, "fire", 8, 24, 120, 12, 0, 0, "minuet", "attack", 112, 527, "effect", ""],
  ["Logical Etude", 64, "water", 8, 24, 120, 12, 0, 0, "etude", "stat", 0, 450, "effect", "2:mnd"],
  ["Army's Paeon V", 65, "light", 8, 24, 120, 12, 0, 0, "paeon", "regen", 7, 450, "effect", ""],
  ["Sage Etude", 66, "ice", 8, 24, 120, 12, 0, 0, "etude", "stat", 0, 450, "effect", "2:int"],
  ["Foe Requiem VI", 67, "light", 2, 24, 120, 11, 1, 1, "requiem", "dot", 7, 450, "effect", ""],
  ["Swift Etude", 68, "wind", 8, 24, 120, 12, 0, 0, "etude", "stat", 0, 450, "effect", "2:agi"],
  ["Puppet's Operetta", 69, "ice", 8, 24, 120, 12, 0, 0, "operetta", "none", 0, 450, "effect", ""],
  ["Vital Etude", 70, "earth", 8, 24, 120, 12, 0, 0, "etude", "stat", 0, 450, "effect", "2:vit"],
  ["Archer's Prelude", 71, "thunder", 8, 24, 120, 12, 0, 0, "prelude", "racc", 60, 450, "effect", ""],
  ["Goddess's Hymnus", 71, "light", 4, 24, 120, 12, 0, 0, "hymnus", "none", 0, 450, "duration", ""],
  ["Uncanny Etude", 72, "thunder", 8, 24, 120, 12, 0, 0, "etude", "stat", 0, 450, "effect", "2:dex"],
  ["Chocobo Mazurka", 73, "wind", 4, 60, 120, 12, 0, 0, "mazurka", "move", 20, 450, "duration", ""],
  ["Warding Round", 73, "light", 8, 24, 120, 12, 0, 0, "round", "none", 0, 450, "effect", ""],
  ["Herculean Etude", 74, "fire", 8, 24, 120, 12, 0, 0, "etude", "stat", 0, 450, "effect", "2:str"],
  ["Maiden's Virelai", 75, "light", 4, 60, 30, 11, 1, 0, "virelai", "charm", 30, 450, "duration", ""],
];

function parseExtra(extra: string): { etude?: 1 | 2; stat?: SongStat } {
  if (!extra) return {};
  const [line, stat] = extra.split(":");
  return { etude: line === "2" ? 2 : 1, stat: stat as SongStat };
}

export const SONGS: readonly SongDef[] = ROWS.map((row) => {
  const extra = parseExtra(row[14]);
  return {
    name: row[0],
    level: row[1],
    element: row[2],
    cast: row[3],
    recast: row[4],
    duration: row[5],
    range: row[6],
    hostile: row[7] === 1,
    wide: row[8] === 1,
    family: row[9],
    hook: row[10],
    potency: row[11],
    skillCap: row[12],
    soul: row[13],
    ...extra,
  };
});

export type SongBuffName = (typeof ROWS)[number][0];

const BY_SONG = new Map(SONGS.map((song) => [song.name, song]));

export function songByName(name: string): SongDef | undefined {
  return BY_SONG.get(name);
}

export function brdJobLevel(job: JobId, sub: JobId | null, subLevel: number, mainLevel: number): number {
  if (job === "BRD") return mainLevel;
  if (sub === "BRD") return subLevel;
  return 0;
}

/** Harp is string. Flute, piccolo, and cornette are wind. Anything else is voice only. */
export function instrumentKind(kind: string | undefined): "string" | "wind" | null {
  if (kind === "String") return "string";
  if (kind === "Wind") return "wind";
  return null;
}

/** Two songs with an instrument. One without. Clarion Call is not learned. */
export function songSlots(hasInstrument: boolean): number {
  return hasInstrument ? 2 : 1;
}

export function songSkill(singing: number, instrument: number): number {
  return Math.max(0, Math.floor(singing)) + Math.max(0, Math.floor(instrument));
}

/** Pianissimo's note: a base song cast above 4 seconds becomes 4. Job points are not applied. */
export function pianissimoCast(base: number, up: boolean): number {
  if (!up || base <= 4) return base;
  return 4;
}

function scaled(skill: number, cap: number, full: number): number {
  if (skill <= 0 || cap <= 0 || full <= 0) return 0;
  if (skill >= cap) return full;
  return Math.floor((full * skill) / cap);
}

/** Tier 1 is the printed Etude band. Tier 2 stops at the printed 417–445 value. */
export function etudePower(skill: number, line: 1 | 2): number {
  if (skill <= 0) return 0;
  if (line === 1) {
    if (skill >= 450) return 9;
    if (skill >= 397) return 8;
    if (skill >= 343) return 7;
    if (skill >= 289) return 6;
    if (skill >= 236) return 5;
    if (skill >= 182) return 4;
    return 3;
  }
  if (skill >= 417) return 13;
  return 12;
}

export type SongLand = {
  spell: string;
  family: SongFamily;
  element: SongElement;
  hook: SongHook;
  hostile: boolean;
  wide: boolean;
  left: number;
  power: number;
  dot?: number;
  stat?: SongStat;
  text: string;
  claims: boolean;
  ce: number;
  ve: number;
};

const STAT_LABEL: Record<SongStat, string> = {
  str: "STR",
  dex: "DEX",
  vit: "VIT",
  agi: "AGI",
  int: "INT",
  mnd: "MND",
  chr: "CHR",
};

function clock(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

const ELEMENT_NAME: Record<SongElement, string> = {
  fire: "Fire",
  ice: "Ice",
  wind: "Wind",
  earth: "Earth",
  thunder: "Lightning",
  water: "Water",
  light: "Light",
  dark: "Dark",
};

const FAMILY_NAME: Record<SongFamily, string> = {
  minuet: "Minuet",
  minne: "Minne",
  paeon: "Paeon",
  madrigal: "Madrigal",
  march: "March",
  ballad: "Ballad",
  etude: "Etude",
  carol: "Carol",
  mambo: "Mambo",
  prelude: "Prelude",
  mazurka: "Mazurka",
  operetta: "Operetta",
  gavotte: "Gavotte",
  capriccio: "Capriccio",
  fantasia: "Fantasia",
  aubade: "Aubade",
  pastoral: "Pastoral",
  round: "Round",
  hymnus: "Hymnus",
  virelai: "Virelai",
  elegy: "Elegy",
  requiem: "Requiem",
  lullaby: "Lullaby",
  threnody: "Threnody",
  finale: "Finale",
};

/** Status the song names. The percent was never printed, so it is not rolled. */
const RESIST: Record<string, string> = {
  "Herb Pastoral": "poison",
  "Scop's Operetta": "silence",
  "Puppet's Operetta": "silence",
  "Fowl Aubade": "sleep",
  "Goblin Gavotte": "bind",
  "Gold Capriccio": "petrification",
  "Shining Fantasia": "blindness",
  "Warding Round": "curse",
};

function namedElement(name: string): string | null {
  const word = name.split(" ")[0] ?? "";
  if (word === "Lightning") return "lightning";
  if (word === "Light" || word === "Dark" || word === "Earth" || word === "Water" || word === "Wind" || word === "Fire" || word === "Ice") {
    return word.toLowerCase();
  }
  return null;
}

/**
 * Horde Lullaby's area. String skill sets it. Wind skill and Singing do not.
 * 0–96 is 4'. 97 is 5'. 116 is 6'. 135 is 7'. 154 and above is 8'.
 */
export function hordeRadius(stringSkill: number): number {
  if (stringSkill >= 154) return 8;
  if (stringSkill >= 135) return 7;
  if (stringSkill >= 116) return 6;
  if (stringSkill >= 97) return 5;
  return 4;
}

export type SongCard = {
  effect: string;
  element: string;
  duration: string;
  range: string;
  radius: string;
};

/**
 * Job-book rows for one song at this combined skill.
 * `instrument` is String or Wind skill, or 0 with no instrument.
 * `stringSkill` is String skill only, and only while a string instrument is held.
 * Horde Lullaby's radius reads that. A flute leaves it at 4'.
 */
export function songCard(name: string, singing: number, instrument: number, stringSkill: number): SongCard | null {
  const song = BY_SONG.get(name);
  const landed = landSong(name, songSkill(singing, instrument), false);
  if (!song || !landed) return null;
  const skill = songSkill(singing, instrument);
  const power = landed.power;
  const instrumentName = stringSkill > 0 ? "String" : instrument > 0 ? "Wind" : null;
  const skillLine = instrumentName
    ? `Combined skill is Singing ${singing} plus ${instrumentName} ${instrument}, so ${skill}.`
    : `No instrument is equipped, so combined skill is Singing ${singing}.`;
  const capLine = song.etude
    ? song.etude === 2
      ? "A tier-2 Etude is +12 through combined skill 416, and +13 from 417. The band past 445 was not printed, so 450 stays at 13."
      : "A tier-1 Etude is +3 through 181, then +4, +5, +6, +7, +8, and +9 at 450."
    : song.potency > 0 && song.hook !== "sleep" && song.hook !== "charm" && song.hook !== "move" && song.hook !== "ward"
      ? skill >= song.skillCap
        ? `The full +${song.potency} needs combined skill ${song.skillCap}. This skill meets it.`
        : `The full +${song.potency} needs combined skill ${song.skillCap}. This skill is short, so the bonus is floor(${song.potency} × ${skill} / ${song.skillCap}).`
      : "";
  const voice = song.soul === "duration"
    ? "Soul Voice doubles the duration."
    : song.hook === "dispel"
      ? "Soul Voice doubles magic accuracy. The resist is not rolled."
      : song.hook === "none" || song.hook === "move" || song.hook === "ward"
        ? "Soul Voice does not change this one."
        : "Soul Voice doubles the effect.";
  const slots = instrument > 0 ? "An instrument allows two songs." : "With no instrument only one song stays up.";
  const family = song.family === "march"
    ? `${slots} A different March stays up beside this one. A song past the slot count replaces the oldest.`
    : `${slots} Another ${FAMILY_NAME[song.family]} replaces this. A song past the slot count replaces the oldest. Two different Marches are the exception, and both stay.`;
  const gear = "Song+ gear, merits, and job points are not applied. A hit does not stop the cast. Moving does.";
  const where = song.hostile
    ? `The page prints 20'. The client range is ${song.range}', and that is the check. Cumulative enmity ${SONG_CE}, volatile enmity ${SONG_VE}. The cast adds that enmity and claims.`
    : `It is centered on you. Party members within ${SONG_RADIUS}' receive it. Pianissimo makes the next song one target and wears off. A base cast above 4 seconds becomes 4. It adds no enmity.`;
  const resisted = RESIST[song.name];
  const elementWord = namedElement(song.name);
  let body = song.name;
  if (song.hook === "attack") {
    body = `Attack +${power}. The description also grants that much ranged attack. A ranged shot does not read it.`;
  } else if (song.hook === "defense") {
    body = `Defense +${power}.`;
  } else if (song.hook === "acc") {
    body = `Accuracy +${power}.`;
  } else if (song.hook === "racc") {
    body = `Ranged accuracy +${power}. A ranged shot does not read it yet.`;
  } else if (song.hook === "eva") {
    body = `Evasion +${power}.`;
  } else if (song.hook === "haste") {
    body = `Magic haste ${power}/1024. It is added to Haste, then the total stops at 448/1024. Two different Marches both add.`;
  } else if (song.hook === "regen") {
    body = `${power} HP every 3 seconds. It is added to Regen.`;
  } else if (song.hook === "refresh") {
    body = `${power} MP every 3 seconds. It is added to Refresh.`;
  } else if (song.hook === "stat" && song.stat) {
    body = `${STAT_LABEL[song.stat]} +${power}. The swing still uses the sheet.`;
  } else if (song.hook === "slow") {
    body = `Attack speed -${power}/1024. The Tropical Rarab's delay uses that ratio, the same way Slow does.`;
  } else if (song.hook === "sleep") {
    const area = song.wide
      ? `The area is ${hordeRadius(stringSkill)}' at String skill ${stringSkill}. It is 4' through 96, then 5' at 97, 6' at 116, 7' at 135, and 8' at 154. Wind skill does not change it. This yard has one enemy, so it lands on the Tropical Rarab.`
      : "One enemy.";
    body = `Sleep for ${landed.left} seconds. A direct hit wakes the target. A damage tick does not. The potency table is ${song.duration} seconds at combined skill ${song.skillCap}. The client duration cell is 45. ${area}`;
  } else if (song.hook === "dot") {
    const first = song.duration === 60 ? " The client duration is 60 seconds. Gamer Escape's 63 is stale." : "";
    body = `${power} damage every 3 seconds. Enemies around the target. The page does not print the radius. This yard has one enemy, so it lands on the Tropical Rarab.${first}`;
  } else if (song.hook === "dispel") {
    body = "Removes one of the enemy's effects. The Tropical Rarab has none, so the log is no effect. It does not remove your own enfeebles.";
  } else if (song.hook === "maccDown") {
    body = `Magic evasion -${power} against ${elementWord ?? "that element"}. A later spell of that element subtracts it. This song is resisted first, then the down is stored.`;
  } else if (song.hook === "charm") {
    body = `Charm for ${landed.left} seconds. The Tropical Rarab does not swing while charmed. The potency table is ${song.duration} seconds at combined skill ${song.skillCap}.`;
  } else if (song.hook === "move") {
    const older = song.potency === 20
      ? " The type page's 25% was this same bonus when a run was 4 yalms. A run here is 5 yalms, so it is 20%."
      : " The type page's 12% was this same bonus when a run was 4 yalms. A run here is 5 yalms, so it is 10%.";
    body = `Movement speed +${song.potency}%. Skill does not change it. Mazurka + gear does not either.${older} It wears off if you attack, or if an attack targets you, even when that attack misses. A heal does not remove it. The other Mazurka replaces this. It does not add to Flee. Flee is already +60%, and movement stops at +60%.`;
  } else if (song.hook === "ward") {
    body = `Magic evasion +40 against ${elementWord ?? "that element"}. That is the tier I cap with no song gear. The curve under the cap was not printed, so a lower skill is not given a partial number. The buff stores 40. Dust Cloud adds it. It is not the equipment-screen resistance, so it does not open the 1/8 resist by itself.`;
  } else if (song.name === "Goddess's Hymnus") {
    body = "Grants Reraise. Lost experience would return at 50%, the same as Reraise I. You stand at 50% of your weakened maximum HP, the same HP as Reraise III. This yard does not spend experience. Skill does not change it. A Reraise spell already on you is used instead, and this song stays up. The encyclopedia infobox still says an 8 second cast. The client cast is 4.";
  } else if (resisted) {
    body = `Raises resistance to ${resisted}. The page says no comprehensive testing for the base potency exists, so the chance does not change.`;
  }
  if (song.hostile && (song.hook === "sleep" || song.hook === "charm" || song.hook === "slow" || song.hook === "dot" || song.hook === "maccDown")) {
    body = `${body} A fixed duration uses two resist states. One miss halves it. A second miss is a full resist. Magic accuracy is combined skill plus dCHR. The Tropical Rarab's magic evasion is 225 before Frazzle or a matching resist down.`;
  }
  const duration = song.duration <= 0 ? "Instant" : song.hook === "sleep" || song.hook === "charm" ? clock(landed.left) : clock(song.duration);
  const radius = !song.hostile
    ? `${SONG_RADIUS}'`
    : song.family === "lullaby" && song.wide
      ? `${hordeRadius(stringSkill)}'`
      : song.wide
        ? "Area"
        : "Single target";
  return {
    effect: [body, capLine, skillLine, voice, gear, family, where].filter(Boolean).join(" "),
    element: ELEMENT_NAME[song.element],
    duration,
    range: song.hostile ? `${song.range}'` : "Self",
    radius,
  };
}

export function landSong(name: string, skill: number, soulVoice: boolean): SongLand | null {
  const song = BY_SONG.get(name);
  if (!song) return null;
  let power = song.etude ? etudePower(skill, song.etude) : scaled(skill, song.skillCap, song.potency);
  let duration = song.duration;
  if (song.hook === "sleep" || song.hook === "charm") {
    duration = scaled(skill, song.skillCap, song.duration);
    power = duration;
  }
  if (soulVoice && song.soul === "duration") duration *= 2;
  else if (soulVoice && song.soul === "effect" && song.hook !== "dispel" && song.hook !== "none" && song.hook !== "move" && song.hook !== "ward") power *= 2;
  if (song.hook === "sleep" || song.hook === "charm") power = duration;
  if (song.hook === "move") power = song.potency;
  if (song.hook === "ward") power = 40;
  const voice = soulVoice ? (song.soul === "duration" ? " Soul Voice doubles the duration." : " Soul Voice doubles it.") : "";
  let text = song.name;
  if (song.hook === "attack") text = `${song.name}. Attack +${power}. ${clock(duration)}.${voice}`;
  else if (song.hook === "defense") text = `${song.name}. Defense +${power}. ${clock(duration)}.${voice}`;
  else if (song.hook === "acc") text = `${song.name}. Accuracy +${power}. ${clock(duration)}.${voice}`;
  else if (song.hook === "racc") text = `${song.name}. Ranged accuracy +${power}. ${clock(duration)}. The ranged shot does not read it yet.${voice}`;
  else if (song.hook === "eva") text = `${song.name}. Evasion +${power}. ${clock(duration)}.${voice}`;
  else if (song.hook === "haste") text = `${song.name}. Magic haste ${power}/1024. ${clock(duration)}.${voice}`;
  else if (song.hook === "regen") text = `${song.name}. ${power} HP every 3 seconds. ${clock(duration)}.${voice}`;
  else if (song.hook === "refresh") text = `${song.name}. ${power} MP every 3 seconds. ${clock(duration)}.${voice}`;
  else if (song.hook === "stat" && song.stat) text = `${song.name}. ${STAT_LABEL[song.stat]} +${power}. ${clock(duration)}. The swing still uses the sheet.${voice}`;
  else if (song.hook === "slow") text = `${song.name}. Attack speed −${power}/1024. ${clock(duration)}.${voice}`;
  else if (song.hook === "sleep") text = `${song.name}. Sleep for ${duration} seconds.${voice}`;
  else if (song.hook === "dot") text = `${song.name}. ${power} damage every 3 seconds. ${clock(duration)}.${voice}`;
  else if (song.hook === "dispel") text = `${song.name}. Removes one of the enemy's effects.${voice ? " Soul Voice doubles magic accuracy. The resist is not rolled." : " The resist is not rolled."}`;
  else if (song.hook === "maccDown") text = `${song.name}. Magic evasion −${power}. ${clock(duration)}. A later spell of that element subtracts it.${voice}`;
  else if (song.hook === "charm") text = `${song.name}. Charm for ${duration} seconds.${voice}`;
  else if (song.hook === "move") text = `${song.name}. Movement speed +${power}%. ${clock(duration)}.${voice}`;
  else if (song.hook === "ward") text = `${song.name}. Magic evasion +40 against that element. Dust Cloud reads it. ${clock(duration)}.`;
  else if (song.name === "Goddess's Hymnus") text = `${song.name}. Reraise. 50% of your weakened maximum HP. ${clock(duration)}.${voice}`;
  else text = `${song.name}. ${clock(duration)}.${voice}`;
  return {
    spell: song.name,
    family: song.family,
    element: song.element,
    hook: song.hook,
    hostile: song.hostile,
    wide: song.wide,
    left: duration,
    power,
    ...(song.hook === "dot" ? { dot: power } : {}),
    ...(song.stat ? { stat: song.stat } : {}),
    text,
    claims: song.hostile,
    ce: song.hostile ? SONG_CE : 0,
    ve: song.hostile ? SONG_VE : 0,
  };
}

export type SongStatus = {
  name: string;
  left: number;
  power?: number;
  song?: { family: string; spell: string; order: number };
};

/**
 * Two song slots, or one with no instrument.
 * Marches of different names both stay. Every other family replaces itself.
 * A song past the slot count replaces the oldest.
 */
export function placeSong<T extends SongStatus>(buffs: readonly T[], next: T, slots: number): T[] {
  const song = next.song;
  if (!song) return [...buffs, next];
  let kept = buffs.filter((buff) => {
    if (!buff.song) return true;
    if (song.family === "march") return buff.name !== next.name;
    return buff.song.family !== song.family;
  });
  const songs = () => kept.filter((buff) => buff.song);
  while (songs().length >= Math.max(1, slots)) {
    const rows = songs();
    let oldest = rows[0];
    for (const row of rows) if ((row.song?.order ?? 0) < (oldest?.song?.order ?? 0)) oldest = row;
    kept = kept.filter((buff) => buff !== oldest);
  }
  return [...kept, next];
}

export const BRD_ABILITIES: BrdAbility[] = [
  {
    name: "Soul Voice",
    level: 1,
    recast: SOUL_VOICE_RECAST,
    duration: SOUL_VOICE_SECONDS,
    access: "main",
    effect: "Doubles the effect of the next songs, or the duration of Lullaby and Virelai. Does not stack with Marcato. The job-point cast cut is not applied. Duration 0:03:00. Recast 1:00:00. Cumulative enmity 0, volatile enmity 80. Main job only. The motion opens both arms and a ring of notes.",
    ce: 0,
    ve: 80,
  },
  {
    name: "Pianissimo",
    level: 20,
    recast: PIANISSIMO_RECAST,
    duration: PIANISSIMO_SECONDS,
    access: "sub",
    effect: "The next song hits one target, then this wears off. A base cast above 4 seconds becomes 4. The job-point cast cut is not applied. Duration 0:01:00 or the next song. Recast 0:00:05. Cumulative enmity 0, volatile enmity 80. A level-37 subjob has it. The motion is one hand in, close to the chest.",
    ce: 0,
    ve: 80,
  },
  {
    name: "Nightingale",
    level: 75,
    recast: 600,
    duration: 60,
    access: "main",
    merit: true,
    effect: "Halves song cast and recast for 0:01:00. Recast 0:10:00. Further merit ranks add a fast-cast chance. No ranks are unlocked.",
    ce: 0,
    ve: 320,
  },
  {
    name: "Troubadour",
    level: 75,
    recast: 600,
    duration: 60,
    access: "main",
    merit: true,
    effect: "Song cast ×1.5 and effect duration ×2 for 0:01:00. Recast 0:10:00. Further merit ranks add accuracy. No ranks are unlocked.",
    ce: 0,
    ve: 320,
  },
];

export const BRD_TRAITS: BrdTrait[] = [
  { name: "Resist Silence", level: 5, access: "sub", effect: "A chance to resist Silence. The page does not print the percent, so it is not rolled." },
  { name: "Resist Silence II", level: 25, access: "sub", effect: "The higher tier replaces the lower. The percent is not printed." },
  { name: "Resist Silence III", level: 45, access: "sub", effect: "A level-37 subjob has not learned it." },
  { name: "Resist Silence IV", level: 65, access: "main", effect: "Main job only. The percent is not printed." },
  { name: "Con Anima", level: 75, access: "main", effect: "Physical damage taken is lower while a beneficial song is up. The printed 1% is a job-point rank. No ranks are unlocked, so damage taken does not change." },
  { name: "Con Brio", level: 75, access: "main", effect: "Magic damage taken is lower while a beneficial song is up. The printed 1% is a job-point rank. No ranks are unlocked, so damage taken does not change." },
  { name: "Critical Defense Bonus", level: 80, access: "main", effect: "Past 75. Not applied." },
  { name: "Resist Silence V", level: 81, access: "main", effect: "Past 75. Not applied." },
  { name: "Fencer", level: 85, access: "main", effect: "Past 75. Not applied." },
];

export const BRD_SKILLS: BrdSkill[] = [
  { name: "Dagger", rank: "B-" },
  { name: "Staff", rank: "C+" },
  { name: "Sword", rank: "C-" },
  { name: "Club", rank: "D" },
  { name: "Throwing", rank: "E" },
  { name: "Evasion", rank: "D" },
  { name: "Parrying", rank: "E" },
  { name: "Singing", rank: "C" },
  { name: "String Instrument", rank: "C" },
  { name: "Wind Instrument", rank: "C" },
];

export function assertBrd(): void {
  const naked = characterBase("hume", "BRD", 75);
  if (naked.hp !== 1046 || naked.mp !== 0 || naked.str !== 56 || naked.dex !== 56 || naked.vit !== 56 || naked.agi !== 48 || naked.int !== 56 || naked.mnd !== 56 || naked.chr !== 65) {
    throw new Error(`Hume BRD 75 ${naked.hp} ${naked.mp} ${naked.str} ${naked.dex} ${naked.vit} ${naked.agi} ${naked.int} ${naked.mnd} ${naked.chr}`);
  }
  if (skillCap("B-", 75) !== 240 || skillCap("C+", 75) !== 230 || skillCap("C-", 75) !== 220 || skillCap("D", 75) !== 210 || skillCap("E", 75) !== 200) {
    throw new Error("BRD weapon caps");
  }
  if (skillCap("C", 75) !== 225 || skillCap("C", 37) !== 105) throw new Error("BRD singing cap");
  if (songSlots(true) !== 2 || songSlots(false) !== 1) throw new Error("song slots");
  if (songSkill(225, 225) !== 450 || songSkill(225, 0) !== 225) throw new Error("combined skill");
  if (pianissimoCast(8, true) !== 4 || pianissimoCast(2, true) !== 2 || pianissimoCast(8, false) !== 8) throw new Error("Pianissimo cast");
  const minuet = landSong("Valor Minuet", 450, false);
  const minuetVoice = landSong("Valor Minuet", 450, true);
  const minuetIv = landSong("Valor Minuet IV", 450, false);
  const etude = landSong("Sinewy Etude", 450, false);
  const etudeBare = landSong("Sinewy Etude", 225, false);
  const herc = landSong("Herculean Etude", 450, false);
  const march = landSong("Advancing March", 450, false);
  const lullaby = landSong("Foe Lullaby", 450, true);
  const elegy = landSong("Battlefield Elegy", 450, false);
  if (!minuet || minuet.power !== 32 || minuet.left !== 120 || minuet.claims) throw new Error("Valor Minuet");
  if (!minuetVoice || minuetVoice.power !== 64) throw new Error("Soul Voice minuet");
  if (!minuetIv || minuetIv.power !== Math.floor((112 * 450) / 527)) throw new Error("Valor Minuet IV");
  if (!etude || etude.power !== 9 || etude.stat !== "str") throw new Error("Sinewy Etude");
  if (!etudeBare || etudeBare.power !== 4) throw new Error("etude without an instrument");
  if (!herc || herc.power !== 13) throw new Error("Herculean Etude");
  if (!march || march.power !== 108 || march.hook !== "haste") throw new Error("Advancing March");
  if (!lullaby || lullaby.left !== 60 || lullaby.hook !== "sleep" || !lullaby.claims) throw new Error("Soul Voice lullaby");
  if (!elegy || elegy.power !== 256) throw new Error("Elegy");
  if (BRD_ABILITIES.filter((ability) => ability.level <= 75 && !ability.merit).map((ability) => ability.name).join() !== "Soul Voice,Pianissimo") {
    throw new Error("BRD abilities");
  }
  if (SONGS.length !== 76) throw new Error(`song count ${SONGS.length}`);
  if (SONGS.some((song) => song.name === "Adventurer's Dirge" || song.name === "Foe Sirvente")) throw new Error("merit songs");
  const harp: SongStatus[] = [];
  const first: SongStatus = { name: "Valor Minuet", left: 120, power: 32, song: { family: "minuet", spell: "Valor Minuet", order: 1 } };
  const second: SongStatus = { name: "Advancing March", left: 120, power: 108, song: { family: "march", spell: "Advancing March", order: 2 } };
  const third: SongStatus = { name: "Victory March", left: 120, power: 163, song: { family: "march", spell: "Victory March", order: 3 } };
  const fourth: SongStatus = { name: "Sword Madrigal", left: 120, power: 45, song: { family: "madrigal", spell: "Sword Madrigal", order: 4 } };
  const two = placeSong(placeSong(harp, first, 2), second, 2);
  if (two.map((row) => row.name).join() !== "Valor Minuet,Advancing March") throw new Error("two songs");
  const marches = placeSong(two, third, 2);
  if (marches.map((row) => row.name).join() !== "Advancing March,Victory March") throw new Error("marches replace the oldest");
  const replaced = placeSong([first], { ...first, power: 64, song: { family: "minuet", spell: "Valor Minuet", order: 5 } }, 2);
  if (replaced.length !== 1 || replaced[0]?.power !== 64) throw new Error("same song refreshes");
  const capped = placeSong(marches, fourth, 1);
  if (capped.length !== 1 || capped[0]?.name !== "Sword Madrigal") throw new Error("no instrument is one song");
  const minne = songCard("Knight's Minne", 225, 225, 225);
  const bare = songCard("Knight's Minne", 105, 0, 0);
  const lull = songCard("Foe Lullaby", 225, 225, 225);
  const horde = songCard("Horde Lullaby", 225, 225, 225);
  const flute = songCard("Horde Lullaby", 225, 225, 0);
  const minuetIvCard = songCard("Valor Minuet IV", 225, 225, 225);
  const finale = songCard("Magic Finale", 225, 0, 0);
  const hymnus = songCard("Goddess's Hymnus", 225, 225, 225);
  if (!minne || minne.element !== "Earth" || minne.duration !== "2:00" || minne.range !== "Self" || minne.radius !== "12'" || !minne.effect.includes("Defense +30")) {
    throw new Error("Knight's Minne card");
  }
  if (!bare || !bare.effect.includes("Defense +7")) throw new Error("Minne under the cap");
  if (!lull || lull.element !== "Light" || lull.duration !== "0:30" || lull.range !== "12'" || lull.radius !== "Single target" || !lull.effect.includes("client duration cell is 45")) {
    throw new Error("Foe Lullaby card");
  }
  if (!horde || horde.radius !== "8'" || horde.range !== "11'") throw new Error("Horde Lullaby radius");
  if (!flute || flute.radius !== "4'") throw new Error("Horde Lullaby on a flute");
  if (!minuetIvCard || !minuetIvCard.effect.includes("Attack +95") || minuetIvCard.element !== "Fire") throw new Error("Valor Minuet IV card");
  if (!finale || finale.duration !== "Instant" || finale.radius !== "Single target") throw new Error("Magic Finale card");
  if (!hymnus || !hymnus.effect.includes("Reraise") || hymnus.effect.includes("does not offer") || !hymnus.effect.includes("50% of your weakened") || hymnus.duration !== "2:00") {
    throw new Error("Hymnus card");
  }
  const raptor = landSong("Raptor Mazurka", 450, false);
  const raptorVoice = landSong("Raptor Mazurka", 0, true);
  const chocobo = landSong("Chocobo Mazurka", 105, false);
  const chocoboVoice = landSong("Chocobo Mazurka", 450, true);
  const raptorCard = songCard("Raptor Mazurka", 225, 225, 0);
  const chocoboCard = songCard("Chocobo Mazurka", 225, 225, 225);
  if (!raptor || raptor.power !== 10 || raptor.left !== 120) throw new Error("Raptor Mazurka");
  if (!raptorVoice || raptorVoice.power !== 10 || raptorVoice.left !== 240) throw new Error("Soul Voice Raptor Mazurka");
  if (!chocobo || chocobo.power !== 20 || chocobo.left !== 120) throw new Error("Chocobo Mazurka");
  if (!chocoboVoice || chocoboVoice.power !== 20 || chocoboVoice.left !== 240) throw new Error("Soul Voice Chocobo Mazurka");
  if (!raptorCard || !raptorCard.effect.includes("10%") || raptorCard.effect.includes("unchanged")) throw new Error("Raptor Mazurka card");
  if (!chocoboCard || !chocoboCard.effect.includes("20%") || chocoboCard.effect.includes("unchanged")) throw new Error("Chocobo Mazurka card");
  const carol = landSong("Fire Carol", 450, true);
  const carolCard = songCard("Fire Carol", 225, 225, 0);
  const thren = songCard("Light Threnody", 225, 225, 225);
  if (!carol || carol.power !== 40 || carol.left !== 120) throw new Error("Carol power");
  if (!carolCard || !carolCard.effect.includes("Magic evasion +40") || carolCard.effect.includes("not rolled")) throw new Error("Carol card");
  if (!thren || thren.effect.includes("does not read it yet") || !thren.effect.includes("subtracts")) throw new Error("Threnody card");
  if (hordeRadius(96) !== 4 || hordeRadius(97) !== 5 || hordeRadius(154) !== 8) throw new Error("Horde radius bands");
  for (const song of SONGS) {
    const row = songCard(song.name, 225, 225, 225);
    if (!row) throw new Error(`card ${song.name}`);
    for (const value of [row.effect, row.element, row.duration, row.range, row.radius]) {
      if (!value || value === "—" || value.includes("—")) throw new Error(`blank ${song.name}`);
    }
  }
}
