/**
 * Retail West Ronfaure, 75-era roster.
 * Levels, detection, and drops follow the FFXIclopedia / BG field list:
 * rabbits and worms by the gates, funguars and beetles in the central wood,
 * orcs toward Ghelsba, goblins along the paths, crabs on the creek banks,
 * sheep in the southern meadows. Bats and undead keep their night windows.
 * Bombs only stand while the zone is fogged. Lottery Notorious Monsters
 * replace a placeholder. Timed ones return on their own clock. Fished crabs
 * and the mission orc are not standing spawns.
 *
 * Stats use the same rank, HP, and melee formulas as the training rabbit,
 * at the mob's own level. A mob the /check calls too weak does not aggro
 * or link. Engage, out to the 30 yalm auto-attack cap, draws your weapon
 * and starts the swing timer. It does not walk you in, and it does not
 * call the monster. A swing lands only inside the weapon. A weapon skill
 * reaches one yalm farther and misses past that. Farther than 30 yalms,
 * engage ends and the weapon is put away. A hit still turns a monster.
 * Once the fight is real it keeps chasing after you back up. Disengage
 * only stops your swings.
 * A patrol is a short leg, then a long stand: the retail roam rest
 * for that family, not a hop to the next point. A claim, or a real aggro,
 * makes them run.
 * Camps are a pair or a small herd on their own ground, not a stack on one tile.
 * West Ronfaure keeps the FFXIclopedia standing counts: hares, rabbits, and
 * worms spread in short herds, linking families in their own parties. A party
 * stands close enough to notice its own fight, and far enough from the next
 * party that the whole zone does not chain. Night camps share a clearing with
 * the day herd, not the same footprint.
 * Parties that link stand close. Sight linkers have to see the fight, sound
 * linkers have to hear it, and a wall blocks both. They notice a few seconds
 * in, so a pull dragged out of range comes alone.
 * Aggressive loops stay outside sight and sound of every zone landing.
 */
import { accuracyFrom, autoAttackDamage, critRate, evasionFrom, fStr, hitRate, mainHandAttack, mobDefense, monsterTpGain, rollSwordPdif, tpPerHit } from "./formulas";
import { dStatMagicAccuracy } from "./magic";
import { rankAt, mainJobHp, subjobHp } from "./rarab";
import { skillCap, type SkillRank } from "./skills";
import { aggros, angleFromForward, SIGHT_ANGLE, SIGHT_RANGE, SOUND_RANGE, TRUE_SOUND_RANGE, type Detect } from "./aggro";
import { isBehind, thiefStrike } from "./enmity";
import { checkCon, checkLine } from "./commands";
import { dropRate, type DropTier } from "./drops";
import { clampWorld, EXITS, inRonfaure, ronCell, zoneArrival, zoneTouch } from "./world";
import { EAST_CELL, EAST_MANUAL_GATE, EAST_MANUAL_ROAD, EAST_MOUTH, EAST_SIZE, EAST_STAND, EAST_X0, EAST_Z0, clampEast, eastAt, eastBank, eastDry, eastPath, inEast } from "./east-ronfaure";
import { fortCell, ghelsbaCell, ghelsbaDry, grottoCell, grottoHall, grottoMouth, inFort, inGhelsba, inOrc, inYughott, HUT_ROOF, orcDry, ORC_GATES, RON_TO_GHELSBA } from "./ghelsba";
import { fortPoi, yughottNode, yughottPoi } from "./orc-height";
import { TOMB_FOYER, TOMB_GATES, TOMB_HOLLOW, clampTomb, inTomb, tombSquare, tombStory } from "./tomb";
import { clampPass, inPass, oneWayBlocks, PASS_ARRIVE, PASS_GATES, PASS_NPCS, passSquare, passWet } from "./pass";
import type { FieldLook } from "./field-mesh";

const WALK = 2.4;
const RUN = 4.4;
const RESPAWN = 300;
/** Notorious Monster window. A flat half hour, then a placeholder may become the NM. */
const NM_MIN = 30 * 60;
const NM_MAX = 30 * 60;
/** Once that window is open, a placeholder respawn rolls this chance to be the NM. */
const LOTTERY_CHANCE = 0.25;
const LEASH = 28;
/** How long a fight goes unnoticed. Long enough to drag a pull out of camp. */
const LINK_DELAY = 2.6;
/** Floor used when the weapon reach has not been built yet. */
const MELEE = 1.35;
/** Horizon Distance. Auto-attack stays up out to 30 yalms, then engage ends. */
const AUTO_ATTACK = 30;
/** Separate camps. Far enough that two parties do not share a tile. */
const CAMP_GAP = 11;
/** One linking party. Close enough to see or hear a fight that stays in camp. */
const PACK_GAP = 6.5;
/** A party mills in place. A long orbit would walk them out of their own camp. */
const PACK_ROAM = 1.35;
/** Day and night may share a clearing, but not the same footprint. */
const SHIFT_GAP = 8;
/** West Ronfaure only. Night and day never draw together, so the shift can be short. */
const WEST_SHIFT = 4.2;
/** Non-linking West beasts. Close enough to read as a herd, not a pile. */
const HERD_GAP = 5.5;
/** A herd mills inside its own patch instead of walking the camp apart. */
const HERD_ROAM = 2.4;
/** Same-family sight parties. Outside a 15-yalm cone, so camps do not chain. */
const SIGHT_CAMP = 16.2;
const ROAM_FIELD = 6.5;
const ROAM_OUT = 3.2;
/** Yalms past the sense, so a patrol step still cannot see the landing. */
const LAND_PAD = 8;

/**
 * Seconds a mob stands after each short roam leg.
 * LandSandBoat RoamCool / RoamRate (data/ecosystems.yaml), which rest
 * uniformly on [cool − min(floor(cool * 10 / rate), cool), cool].
 * An unlisted family uses the engine default (cool 20, rate 15 → 7–20s).
 * Worms use this only while surfaced. The burrow itself is a separate clock.
 */
const ROAM_REST: Record<string, { cool: number; rate: number }> = {
  Rabbit: { cool: 35, rate: 35 },
  Sheep: { cool: 60, rate: 40 },
  Ram: { cool: 60, rate: 40 },
  Goblin: { cool: 45, rate: 15 },
  Orc: { cool: 45, rate: 15 },
  Warmachine: { cool: 45, rate: 15 },
  Bat: { cool: 35, rate: 35 },
  Lizard: { cool: 60, rate: 40 },
  Funguar: { cool: 60, rate: 40 },
  Hound: { cool: 60, rate: 40 },
  Skeleton: { cool: 60, rate: 40 },
  Beetle: { cool: 60, rate: 40 },
  Crab: { cool: 15, rate: 15 },
  Pugil: { cool: 15, rate: 15 },
  Bomb: { cool: 45, rate: 15 },
  Worm: { cool: 122, rate: 20 },
  Ghost: { cool: 45, rate: 20 },
  Slime: { cool: 30, rate: 20 },
  Sapling: { cool: 60, rate: 30 },
  Treant: { cool: 60, rate: 25 },
  Scorpion: { cool: 45, rate: 20 },
  Hecteyes: { cool: 40, rate: 20 },
  Ahriman: { cool: 40, rate: 20 },
  "Evil Weapon": { cool: 45, rate: 20 },
};

function standSpan(family: string): { lo: number; hi: number } {
  const row = ROAM_REST[family] ?? { cool: 20, rate: 15 };
  const hi = row.cool;
  const span = row.rate > 0 ? Math.min(Math.floor((hi * 10) / row.rate), hi) : 0;
  return { lo: hi - span, hi };
}

function standFor(family: string): number {
  const { lo, hi } = standSpan(family);
  return lo + Math.floor(Math.random() * (hi - lo + 1));
}

type Job = "WAR" | "MNK" | "WHM" | "BLM" | "RDM" | "THF" | "DRK" | "DRG" | "RNG" | "PLD" | "BST";
type Window = "day" | "night-18" | "night-20" | "fog" | "always";
type MoveKind = "physical" | "magical" | "heal" | "buff" | "status" | "drain" | "destruct";

type Move = {
  name: string;
  kind: MoveKind;
  anim: "attack" | "skill" | "cast" | "boom";
  ftp?: number;
  pot?: number;
  status?: "blind" | "poison" | "silence" | "sleep";
  buff?: "attack" | "defense";
};

type Drop = { id: string; found: string; tier?: DropTier; always?: boolean; slot?: string; weight?: number };

type Species = {
  id: string;
  name: string;
  look: FieldLook;
  variant: string;
  family: string;
  job: Job;
  levelMin: number;
  levelMax: number;
  window: Window;
  detect: Detect;
  links: boolean;
  crystal: string;
  hpMod: number;
  delay: number;
  ranks: { str: number; dex: number; vit: number; agi: number; int: number; mnd: number; chr: number; def: SkillRank; eva: SkillRank };
  moves: readonly Move[];
  spells: readonly Move[];
  drops: readonly Drop[];
  nm?: boolean;
  respawn?: number;
};

const PASSIVE_SIGHT: Detect = { aggressive: false, sight: true, sound: false, scent: true, lowHp: false, magic: false, trueSight: false, trueSound: false };
const SOUND: Detect = { aggressive: true, sight: false, sound: true, scent: false, lowHp: false, magic: false, trueSight: false, trueSound: false };
const SOUND_LINK: Detect = { ...SOUND, scent: false };
const SIGHT: Detect = { aggressive: true, sight: true, sound: false, scent: false, lowHp: false, magic: false, trueSight: false, trueSound: false };
const SIGHT_SCENT: Detect = { ...SIGHT, scent: true };
const PASSIVE_SOUND: Detect = { aggressive: false, sight: false, sound: true, scent: false, lowHp: false, magic: false, trueSight: false, trueSound: false };
const UNDEAD: Detect = { aggressive: true, sight: false, sound: true, scent: false, lowHp: true, magic: false, trueSight: false, trueSound: false };
const BOMB: Detect = { aggressive: true, sight: true, sound: false, scent: false, lowHp: false, magic: true, trueSight: false, trueSound: false };
const SOUND_SCENT: Detect = { aggressive: true, sight: false, sound: true, scent: true, lowHp: false, magic: false, trueSight: false, trueSound: false };
const SIGHT_SOUND: Detect = { aggressive: true, sight: true, sound: true, scent: false, lowHp: false, magic: false, trueSight: false, trueSound: false };
const SOUND_MAGIC: Detect = { aggressive: true, sight: false, sound: true, scent: false, lowHp: false, magic: true, trueSight: false, trueSound: false };

const RABBIT = { str: 4, dex: 3, vit: 4, agi: 4, int: 4, mnd: 4, chr: 4, def: "C" as SkillRank, eva: "C" as SkillRank };
const WORM = { str: 4, dex: 5, vit: 3, agi: 6, int: 5, mnd: 4, chr: 6, def: "D" as SkillRank, eva: "E" as SkillRank };
const BAT = { str: 4, dex: 3, vit: 5, agi: 2, int: 4, mnd: 4, chr: 4, def: "E" as SkillRank, eva: "A" as SkillRank };
const FUNG = { str: 4, dex: 4, vit: 3, agi: 6, int: 3, mnd: 3, chr: 4, def: "D" as SkillRank, eva: "E" as SkillRank };
const CRAB = { str: 3, dex: 4, vit: 2, agi: 6, int: 4, mnd: 4, chr: 5, def: "B" as SkillRank, eva: "E" as SkillRank };
const BEETLE = { str: 3, dex: 4, vit: 3, agi: 4, int: 4, mnd: 4, chr: 4, def: "C" as SkillRank, eva: "D" as SkillRank };
const ORC = { str: 3, dex: 4, vit: 3, agi: 4, int: 4, mnd: 4, chr: 5, def: "C" as SkillRank, eva: "D" as SkillRank };
const GOB = { str: 4, dex: 3, vit: 4, agi: 3, int: 4, mnd: 4, chr: 4, def: "D" as SkillRank, eva: "C" as SkillRank };
const BONE = { str: 3, dex: 4, vit: 4, agi: 4, int: 3, mnd: 4, chr: 5, def: "D" as SkillRank, eva: "D" as SkillRank };
const HOUND = { str: 3, dex: 3, vit: 4, agi: 3, int: 4, mnd: 4, chr: 4, def: "C" as SkillRank, eva: "B" as SkillRank };
const SHEEP = { str: 3, dex: 5, vit: 3, agi: 6, int: 6, mnd: 4, chr: 4, def: "C" as SkillRank, eva: "E" as SkillRank };
const GHOST = { str: 4, dex: 4, vit: 5, agi: 3, int: 2, mnd: 3, chr: 4, def: "D" as SkillRank, eva: "B" as SkillRank };
const SLIME = { str: 4, dex: 5, vit: 2, agi: 6, int: 3, mnd: 4, chr: 6, def: "B" as SkillRank, eva: "E" as SkillRank };
const TREE = { str: 3, dex: 5, vit: 2, agi: 6, int: 4, mnd: 3, chr: 5, def: "A" as SkillRank, eva: "E" as SkillRank };
const SCORP = { str: 3, dex: 3, vit: 3, agi: 4, int: 4, mnd: 4, chr: 4, def: "C" as SkillRank, eva: "C" as SkillRank };
const EYES = { str: 4, dex: 4, vit: 3, agi: 4, int: 2, mnd: 3, chr: 5, def: "D" as SkillRank, eva: "C" as SkillRank };

const JOB_HP: Record<Job, [number, number, number]> = {
  WAR: [33, 8, 1], MNK: [36, 9, 1], WHM: [25, 5, 0], BLM: [24, 4, 0], RDM: [27, 6, 0], THF: [28, 6, 0], DRK: [33, 8, 1],
  DRG: [32, 8, 1], RNG: [28, 6, 0], PLD: [34, 8, 1], BST: [30, 7, 0],
};
const JOB_RANK: Record<Job, number> = { WAR: 1, MNK: 1, WHM: 5, BLM: 6, RDM: 4, THF: 3, DRK: 2, DRG: 2, RNG: 3, PLD: 2, BST: 3 };

const foot: Move = { name: "Foot Kick", kind: "physical", anim: "skill", ftp: 1.2 };
const whistle: Move = { name: "Whistle", kind: "buff", anim: "skill", buff: "attack" };
const dust: Move = { name: "Dust Cloud", kind: "status", anim: "skill", status: "blind" };
const carrot: Move = { name: "Wild Carrot", kind: "heal", anim: "skill" };
const fluid: Move = { name: "Fluid Toss", kind: "physical", anim: "skill", ftp: 1.4 };
const wing: Move = { name: "Wing Cutter", kind: "physical", anim: "skill", ftp: 1.3 };
const drain: Move = { name: "Blood Drain", kind: "drain", anim: "skill", ftp: 1.1 };
const suction: Move = { name: "Suction", kind: "drain", anim: "skill", ftp: 0.9 };
const stink: Move = { name: "Stinking Gas", kind: "status", anim: "skill", status: "poison" };
const frog: Move = { name: "Frogkick", kind: "physical", anim: "skill", ftp: 1.4 };
const silence: Move = { name: "Silence Gas", kind: "status", anim: "skill", status: "silence" };
const spore: Move = { name: "Dark Spore", kind: "magical", anim: "cast", pot: 18 };
const scissors: Move = { name: "Big Scissors", kind: "physical", anim: "skill", ftp: 1.6 };
const shower: Move = { name: "Bubble Shower", kind: "magical", anim: "cast", pot: 14 };
const rhino: Move = { name: "Rhino Attack", kind: "physical", anim: "skill", ftp: 1.5 };
const spoil: Move = { name: "Spoil", kind: "status", anim: "skill", status: "poison" };
const guard: Move = { name: "Rhino Guard", kind: "buff", anim: "skill", buff: "defense" };
const tackle: Move = { name: "Shoulder Tackle", kind: "physical", anim: "skill", ftp: 1.4 };
const backhand: Move = { name: "Backhand Blow", kind: "physical", anim: "skill", ftp: 1.3 };
const spin: Move = { name: "Spinning Attack", kind: "physical", anim: "skill", ftp: 1.2 };
const stone: Move = { name: "Stone", kind: "magical", anim: "cast", pot: 16 };
const poison: Move = { name: "Poison", kind: "status", anim: "cast", status: "poison" };
const blind: Move = { name: "Blind", kind: "status", anim: "cast", status: "blind" };
const dia: Move = { name: "Dia", kind: "magical", anim: "cast", pot: 8 };
const bombToss: Move = { name: "Bomb Toss", kind: "physical", anim: "skill", ftp: 1.5 };
const rush: Move = { name: "Goblin Rush", kind: "physical", anim: "skill", ftp: 1.3 };
const cloud: Move = { name: "Black Cloud", kind: "status", anim: "skill", status: "blind" };
const saber: Move = { name: "Blood Saber", kind: "drain", anim: "skill", ftp: 1.2 };
const drainSpell: Move = { name: "Drain", kind: "drain", anim: "cast", ftp: 1 };
const howl: Move = { name: "Howl", kind: "buff", anim: "skill", buff: "attack" };
const claw: Move = { name: "Claw Cyclone", kind: "physical", anim: "skill", ftp: 1.5 };
const dirty: Move = { name: "Dirty Claw", kind: "physical", anim: "skill", status: "poison", ftp: 1.1 };
const charge: Move = { name: "Sheep Charge", kind: "physical", anim: "skill", ftp: 1.6 };
const rage: Move = { name: "Rage", kind: "buff", anim: "skill", buff: "attack" };
const song: Move = { name: "Sheep Song", kind: "status", anim: "skill", status: "sleep" };
const heat: Move = { name: "Heat Wave", kind: "magical", anim: "cast", pot: 28 };
const boom: Move = { name: "Self-Destruct", kind: "destruct", anim: "boom", pot: 1 };
const tailBlow: Move = { name: "Tail Blow", kind: "physical", anim: "skill", ftp: 1.5 };
const fireball: Move = { name: "Fireball", kind: "magical", anim: "cast", pot: 22 };
const blockhead: Move = { name: "Blockhead", kind: "physical", anim: "skill", ftp: 1.3 };
const screw: Move = { name: "Screwdriver", kind: "physical", anim: "skill", ftp: 1.6 };
const aqua: Move = { name: "Aqua Ball", kind: "magical", anim: "cast", pot: 16 };
const waterWall: Move = { name: "Water Wall", kind: "buff", anim: "skill", buff: "defense" };
const sandspin: Move = { name: "Sandspin", kind: "physical", anim: "skill", ftp: 1.35 };
const ramCharge: Move = { name: "Ram Charge", kind: "physical", anim: "skill", ftp: 1.8 };
const slam: Move = { name: "Slam Dunk", kind: "physical", anim: "skill", ftp: 1.7 };
const shot: Move = { name: "Sharp Shot", kind: "physical", anim: "skill", ftp: 1.4 };
const cannon: Move = { name: "Arm Cannon", kind: "magical", anim: "cast", pot: 32 };
const armature: Move = { name: "Heavy Armature", kind: "buff", anim: "skill", buff: "defense" };
const stoneThrow: Move = { name: "Stone Throw", kind: "physical", anim: "skill", ftp: 1.5 };
const shieldBash: Move = { name: "Shield Bash", kind: "physical", anim: "skill", ftp: 1.2 };
const flameArmor: Move = { name: "Flame Armor", kind: "buff", anim: "skill", buff: "defense" };
const ooze: Move = { name: "Ooze", kind: "drain", anim: "skill", ftp: 1.1 };
const terror: Move = { name: "Terror Touch", kind: "physical", anim: "skill", ftp: 1.3 };
const nightmare: Move = { name: "Nightmare", kind: "status", anim: "skill", status: "sleep" };
const cure: Move = { name: "Cure", kind: "heal", anim: "cast" };
const blizzard: Move = { name: "Blizzard", kind: "magical", anim: "cast", pot: 36 };
const blizzard3: Move = { name: "Blizzard III", kind: "magical", anim: "cast", pot: 62 };
const pincer: Move = { name: "Pincer", kind: "physical", anim: "skill", ftp: 1.4 };
const venom: Move = { name: "Venom Sting", kind: "status", anim: "skill", status: "poison" };
const hexEye: Move = { name: "Hex Eye", kind: "status", anim: "skill", status: "blind" };
const cataract: Move = { name: "Cataract", kind: "magical", anim: "cast", pot: 34 };
const branch: Move = { name: "Branch Swipe", kind: "physical", anim: "skill", ftp: 1.35 };
const photo: Move = { name: "Photosynthesis", kind: "heal", anim: "cast" };
const leafstorm: Move = { name: "Leafstorm", kind: "magical", anim: "cast", pot: 48 };
const sleepSpell: Move = { name: "Sleep", kind: "status", anim: "cast", status: "sleep" };
const swoop: Move = { name: "Swooping Frenzy", kind: "physical", anim: "skill", ftp: 1.5 };
const sonic: Move = { name: "Sonic Wave", kind: "status", anim: "skill", status: "silence" };
const jet: Move = { name: "Jet Stream", kind: "magical", anim: "cast", pot: 24 };
const deathScissors: Move = { name: "Death Scissors", kind: "physical", anim: "skill", ftp: 2 };
const deathRay: Move = { name: "Death Ray", kind: "magical", anim: "cast", pot: 40 };
const eyesOnMe: Move = { name: "Eyes On Me", kind: "magical", anim: "cast", pot: 55 };
const blindEye: Move = { name: "Blind Eye", kind: "status", anim: "skill", status: "blind" };
const water: Move = { name: "Water", kind: "magical", anim: "cast", pot: 16 };
const aero: Move = { name: "Aero", kind: "magical", anim: "cast", pot: 16 };
const fire: Move = { name: "Fire", kind: "magical", anim: "cast", pot: 16 };
const thunder: Move = { name: "Thunder", kind: "magical", anim: "cast", pot: 20 };
const bio: Move = { name: "Bio", kind: "status", anim: "cast", status: "poison" };
const banish: Move = { name: "Banish", kind: "magical", anim: "cast", pot: 14 };
const protect: Move = { name: "Protect", kind: "buff", anim: "cast", buff: "defense" };
const cure2: Move = { name: "Cure II", kind: "heal", anim: "cast" };
const stone2: Move = { name: "Stone II", kind: "magical", anim: "cast", pot: 40 };
const water2: Move = { name: "Water II", kind: "magical", anim: "cast", pot: 46 };
const hypo: Move = { name: "Hypnosis", kind: "status", anim: "skill", status: "sleep" };
const mindBreak: Move = { name: "Mind Break", kind: "magical", anim: "cast", pot: 28 };
const binding: Move = { name: "Binding Wave", kind: "magical", anim: "skill", pot: 18 };
const arcane: Move = { name: "Arcane Stomp", kind: "magical", anim: "skill", pot: 32 };
const oblivion: Move = { name: "Winds of Oblivion", kind: "magical", anim: "cast", pot: 36 };
const shieldStrike: Move = { name: "Shield Strike", kind: "physical", anim: "skill", ftp: 1.3 };

const hide = { id: "rabbit-hide", found: "rabbit hide", tier: "common" as const };
const meat = { id: "hare-meat", found: "hare meat", tier: "common" as const };
const coin = { id: "beastcoin", found: "beastcoin", tier: "uncommon" as const };
const silver = { id: "silver-beastcoin", found: "silver beastcoin", tier: "uncommon" as const };

export const SPECIES: Record<string, Species> = {
  "tunnel-worm": { id: "tunnel-worm", name: "Tunnel Worm", look: "worm", variant: "", family: "Worm", job: "WAR", levelMin: 1, levelMax: 2, window: "day", detect: SOUND, links: false, crystal: "earth", hpMod: 0.5, delay: 280, ranks: WORM, moves: [fluid], spells: [], drops: [
    { id: "copper-ore", found: "copper ore", tier: "common" }, { id: "flint-stone", found: "flint stone", tier: "common" }, { id: "zinc-ore", found: "zinc ore", tier: "uncommon" },
  ] },
  "wild-rabbit": { id: "wild-rabbit", name: "Wild Rabbit", look: "rabbit", variant: "", family: "Rabbit", job: "WAR", levelMin: 1, levelMax: 2, window: "day", detect: PASSIVE_SIGHT, links: false, crystal: "earth", hpMod: 0.7, delay: 240, ranks: RABBIT, moves: [foot, whistle], spells: [], drops: [meat, hide, { id: "san-dorian-carrot", found: "san d'orian carrot", tier: "rare" }] },
  "carrion-worm": { id: "carrion-worm", name: "Carrion Worm", look: "worm", variant: "", family: "Worm", job: "WAR", levelMin: 1, levelMax: 5, window: "day", detect: SOUND, links: false, crystal: "earth", hpMod: 0.6, delay: 280, ranks: WORM, moves: [fluid], spells: [], drops: [
    { id: "copper-ore", found: "copper ore", tier: "common" }, { id: "flint-stone", found: "flint stone", tier: "common" }, { id: "silver-ore", found: "silver ore", tier: "uncommon" }, { id: "zinc-ore", found: "zinc ore", tier: "uncommon" },
  ] },
  "ding-bats": { id: "ding-bats", name: "Ding Bats", look: "bats", variant: "", family: "Bat", job: "WAR", levelMin: 1, levelMax: 5, window: "night-18", detect: SOUND, links: false, crystal: "wind", hpMod: 0.65, delay: 220, ranks: BAT, moves: [wing], spells: [], drops: [{ id: "bat-wing", found: "bat wing", tier: "common" }] },
  "forest-hare": { id: "forest-hare", name: "Forest Hare", look: "rabbit", variant: "", family: "Rabbit", job: "WAR", levelMin: 1, levelMax: 5, window: "day", detect: PASSIVE_SIGHT, links: false, crystal: "earth", hpMod: 0.75, delay: 240, ranks: RABBIT, moves: [foot, whistle, dust], spells: [], drops: [
    { id: "hare-meat", found: "hare meat", tier: "rare" }, { id: "rabbit-hide", found: "rabbit hide", tier: "very-common" },
  ] },
  "forest-funguar": { id: "forest-funguar", name: "Forest Funguar", look: "funguar", variant: "", family: "Funguar", job: "WAR", levelMin: 3, levelMax: 6, window: "day", detect: SOUND_LINK, links: true, crystal: "dark", hpMod: 0.85, delay: 240, ranks: FUNG, moves: [frog, silence, spore], spells: [], drops: [
    { id: "sleepshroom", found: "sleepshroom", tier: "common" }, { id: "woozyshroom", found: "woozyshroom", tier: "very-rare" },
  ] },
  "mouse-bat": { id: "mouse-bat", name: "Mouse Bat", look: "bat", variant: "", family: "Bat", job: "WAR", levelMin: 3, levelMax: 6, window: "night-18", detect: SOUND_LINK, links: true, crystal: "wind", hpMod: 0.75, delay: 210, ranks: BAT, moves: [drain, suction, stink], spells: [], drops: [
    { id: "bat-wing", found: "bat wing", tier: "common" }, { id: "fiend-blood", found: "fiend blood", tier: "uncommon" },
  ] },
  "river-crab": { id: "river-crab", name: "River Crab", look: "crab", variant: "", family: "Crab", job: "WAR", levelMin: 3, levelMax: 6, window: "day", detect: SOUND, links: false, crystal: "water", hpMod: 1.15, delay: 290, ranks: CRAB, moves: [scissors, shower], spells: [], drops: [
    { id: "lufet-salt", found: "lufet salt", tier: "uncommon" }, { id: "rock-salt", found: "rock salt", tier: "common" },
  ] },
  "scarab-beetle": { id: "scarab-beetle", name: "Scarab Beetle", look: "beetle", variant: "", family: "Beetle", job: "WAR", levelMin: 3, levelMax: 6, window: "day", detect: SIGHT_SCENT, links: true, crystal: "earth", hpMod: 0.95, delay: 260, ranks: BEETLE, moves: [rhino, spoil], spells: [], drops: [
    { id: "beetle-jaw", found: "beetle jaw", tier: "common" }, { id: "insect-wing", found: "insect wing", tier: "uncommon" },
  ] },
  "orcish-fodder": { id: "orcish-fodder", name: "Orcish Fodder", look: "orc", variant: "axe", family: "Orc", job: "WAR", levelMin: 3, levelMax: 8, window: "day", detect: SIGHT_SCENT, links: true, crystal: "fire", hpMod: 1.05, delay: 240, ranks: ORC, moves: [tackle], spells: [], drops: [{ id: "orcish-axe", found: "orcish axe", tier: "uncommon" }, coin] },
  "orcish-grappler": { id: "orcish-grappler", name: "Orcish Grappler", look: "orc", variant: "fist", family: "Orc", job: "MNK", levelMin: 3, levelMax: 8, window: "day", detect: SIGHT_SCENT, links: true, crystal: "fire", hpMod: 1.1, delay: 280, ranks: ORC, moves: [backhand, spin], spells: [], drops: [
    { id: "bronze-cap", found: "bronze cap", tier: "uncommon" }, { id: "bronze-leggings", found: "bronze leggings", tier: "uncommon" }, { id: "bronze-mittens", found: "bronze mittens", tier: "uncommon" }, { id: "bronze-subligar", found: "bronze subligar", tier: "uncommon" }, coin,
  ] },
  "orcish-mesmerizer": { id: "orcish-mesmerizer", name: "Orcish Mesmerizer", look: "orc", variant: "staff", family: "Orc", job: "BLM", levelMin: 4, levelMax: 8, window: "day", detect: SIGHT_SCENT, links: true, crystal: "fire", hpMod: 0.9, delay: 260, ranks: ORC, moves: [], spells: [stone, poison, blind], drops: [
    { id: "ash-clogs", found: "ash clogs", tier: "rare" }, { id: "circlet", found: "circlet", tier: "rare" }, { id: "scroll-of-bind", found: "scroll of bind", tier: "rare" }, { id: "scroll-of-blind", found: "scroll of blind", tier: "rare" }, coin,
  ] },
  "goblin-thug": { id: "goblin-thug", name: "Goblin Thug", look: "goblin", variant: "dagger", family: "Goblin", job: "THF", levelMin: 4, levelMax: 8, window: "day", detect: SIGHT, links: true, crystal: "fire", hpMod: 0.9, delay: 230, ranks: GOB, moves: [bombToss, rush], spells: [], drops: [
    coin, { id: "wild-onion", found: "wild onion", tier: "uncommon" }, { id: "goblin-armor", found: "goblin armor", tier: "rare" }, { id: "goblin-mask", found: "goblin mask", tier: "rare" },
  ] },
  "goblin-weaver": { id: "goblin-weaver", name: "Goblin Weaver", look: "goblin", variant: "needle", family: "Goblin", job: "RDM", levelMin: 4, levelMax: 8, window: "day", detect: SIGHT, links: true, crystal: "wind", hpMod: 0.85, delay: 250, ranks: GOB, moves: [], spells: [stone, dia, poison], drops: [
    { id: "cotton-thread", found: "cotton thread", tier: "uncommon" }, { id: "grass-thread", found: "grass thread", tier: "uncommon" }, { id: "cotton-cloth", found: "cotton cloth", tier: "rare" }, { id: "grass-cloth", found: "grass cloth", tier: "rare" }, { id: "goblin-mask", found: "goblin mask", tier: "rare" },
  ] },
  "goblin-digger": { id: "goblin-digger", name: "Goblin Digger", look: "goblin", variant: "pick", family: "Goblin", job: "THF", levelMin: 5, levelMax: 8, window: "day", detect: SIGHT, links: true, crystal: "fire", hpMod: 0.95, delay: 240, ranks: GOB, moves: [bombToss, rush], spells: [], drops: [
    { id: "goblin-armor", found: "goblin armor", tier: "uncommon" }, { id: "goblin-mask", found: "goblin mask", tier: "uncommon" }, coin,
  ] },
  "goblin-fisher": { id: "goblin-fisher", name: "Goblin Fisher", look: "goblin", variant: "rod", family: "Goblin", job: "WAR", levelMin: 5, levelMax: 8, window: "day", detect: SIGHT, links: true, crystal: "water", hpMod: 0.95, delay: 250, ranks: GOB, moves: [rush, bombToss], spells: [], drops: [
    coin, { id: "clothespole", found: "clothespole", tier: "rare" }, { id: "yew-fishing-rod", found: "yew fishing rod", tier: "rare" }, { id: "fastwater-fishing-rod", found: "fastwater fishing rod", tier: "very-rare" },
  ] },
  "enchanted-bones": { id: "enchanted-bones", name: "Enchanted Bones", look: "skeleton", variant: "sword", family: "Skeleton", job: "WAR", levelMin: 4, levelMax: 8, window: "night-20", detect: UNDEAD, links: false, crystal: "dark", hpMod: 0.85, delay: 260, ranks: BONE, moves: [cloud, saber], spells: [], drops: [{ id: "bone-chip", found: "bone chip", tier: "very-common" }] },
  "enchanted-bones-drk": { id: "enchanted-bones-drk", name: "Enchanted Bones", look: "skeleton", variant: "scythe", family: "Skeleton", job: "DRK", levelMin: 5, levelMax: 8, window: "night-20", detect: UNDEAD, links: false, crystal: "dark", hpMod: 0.8, delay: 270, ranks: BONE, moves: [cloud, saber], spells: [drainSpell], drops: [{ id: "bone-chip", found: "bone chip", tier: "very-common" }] },
  "tainted-hound": { id: "tainted-hound", name: "Tainted Hound", look: "hound", variant: "", family: "Hound", job: "WAR", levelMin: 5, levelMax: 8, window: "night-20", detect: UNDEAD, links: false, crystal: "dark", hpMod: 0.95, delay: 230, ranks: HOUND, moves: [howl, claw, dirty], spells: [], drops: [
    { id: "revival-tree-root", found: "revival tree root", tier: "uncommon" }, { id: "wolf-hide", found: "wolf hide", tier: "common" },
  ] },
  "wild-sheep": { id: "wild-sheep", name: "Wild Sheep", look: "sheep", variant: "", family: "Sheep", job: "WAR", levelMin: 5, levelMax: 8, window: "day", detect: SIGHT, links: true, crystal: "earth", hpMod: 1.2, delay: 270, ranks: SHEEP, moves: [charge, rage, song], spells: [], drops: [
    { id: "giant-sheep-meat", found: "giant sheep meat", tier: "common" }, { id: "sheep-tooth", found: "sheep tooth", tier: "uncommon" }, { id: "sheepskin", found: "sheepskin", tier: "common" }, { id: "sheep-wool", found: "sheep wool", tier: "uncommon" },
  ] },
  bomb: { id: "bomb", name: "Bomb", look: "bomb", variant: "", family: "Bomb", job: "WAR", levelMin: 8, levelMax: 10, window: "fog", detect: BOMB, links: false, crystal: "fire", hpMod: 0.8, delay: 240, ranks: { ...RABBIT, int: 3 }, moves: [heat, boom], spells: [], drops: [
    { id: "bomb-ash", found: "bomb ash", tier: "common" }, { id: "bomb-arm", found: "bomb arm", tier: "uncommon" },
  ] },
  amanita: { id: "amanita", name: "Amanita", look: "amanita", variant: "", family: "Funguar", job: "WAR", levelMin: 9, levelMax: 10, window: "day", detect: SOUND_LINK, links: true, crystal: "dark", hpMod: 1.35, delay: 240, ranks: FUNG, moves: [frog, silence, spore], spells: [], drops: [
    { id: "tenax-strap", found: "tenax strap", tier: "rare" }, { id: "sleepshroom", found: "sleepshroom", tier: "common" },
  ], nm: true, respawn: 3900 },
  "jaggedy-eared-jack": { id: "jaggedy-eared-jack", name: "Jaggedy-Eared Jack", look: "jack", variant: "", family: "Rabbit", job: "WAR", levelMin: 10, levelMax: 10, window: "day", detect: SIGHT_SCENT, links: true, crystal: "earth", hpMod: 1.45, delay: 230, ranks: RABBIT, moves: [foot, whistle, dust, carrot], spells: [], drops: [
    meat, { id: "rabbit-hide", found: "rabbit hide", tier: "common" }, { id: "rabbit-charm", found: "rabbit charm", tier: "uncommon" },
  ], nm: true },
  "fungus-beetle": { id: "fungus-beetle", name: "Fungus Beetle", look: "fungus-beetle", variant: "", family: "Beetle", job: "DRK", levelMin: 12, levelMax: 12, window: "day", detect: SIGHT, links: true, crystal: "earth", hpMod: 1.6, delay: 250, ranks: BEETLE, moves: [rhino, spoil, guard], spells: [], drops: [
    { id: "clipeus", found: "clipeus", always: true }, { id: "insect-wing", found: "insect wing", tier: "common" }, { id: "beetle-jaw", found: "beetle jaw", tier: "common" },
  ], nm: true },
  "spectacled-bats": { id: "spectacled-bats", name: "Spectacled Bats", look: "bats", variant: "", family: "Bat", job: "WAR", levelMin: 1, levelMax: 5, window: "night-18", detect: PASSIVE_SOUND, links: false, crystal: "wind", hpMod: 0.6, delay: 220, ranks: BAT, moves: [wing], spells: [], drops: [{ id: "bat-wing", found: "bat wing", tier: "common" }], respawn: 480 },
  "watch-lizard": { id: "watch-lizard", name: "Watch Lizard", look: "lizard", variant: "", family: "Lizard", job: "WAR", levelMin: 3, levelMax: 5, window: "always", detect: PASSIVE_SOUND, links: true, crystal: "fire", hpMod: 1, delay: 250, ranks: { str: 3, dex: 4, vit: 3, agi: 4, int: 4, mnd: 4, chr: 5, def: "C", eva: "D" }, moves: [tailBlow, blockhead, fireball], spells: [], drops: [
    { id: "lizard-tail", found: "lizard tail", tier: "common" }, { id: "lizard-skin", found: "lizard skin", tier: "uncommon" },
  ], respawn: 480 },
  cheiroptera: { id: "cheiroptera", name: "Cheiroptera", look: "bat", variant: "", family: "Bat", job: "WAR", levelMin: 3, levelMax: 6, window: "always", detect: SOUND, links: false, crystal: "wind", hpMod: 0.75, delay: 210, ranks: BAT, moves: [wing, drain, suction], spells: [], drops: [
    { id: "bat-wing", found: "bat wing", tier: "common" }, { id: "fiend-blood", found: "fiend blood", tier: "uncommon" },
  ], respawn: 480 },
  "ghelsba-pugil": { id: "ghelsba-pugil", name: "Ghelsba Pugil", look: "pugil", variant: "", family: "Pugil", job: "WAR", levelMin: 3, levelMax: 6, window: "always", detect: SOUND, links: false, crystal: "water", hpMod: 1.1, delay: 240, ranks: CRAB, moves: [screw, aqua], spells: [], drops: [
    { id: "pugil-scales", found: "pugil scales", tier: "common" }, { id: "shall-shell", found: "shall shell", tier: "uncommon" },
  ], respawn: 480 },
  toadstool: { id: "toadstool", name: "Toadstool", look: "funguar", variant: "", family: "Funguar", job: "WAR", levelMin: 4, levelMax: 6, window: "always", detect: PASSIVE_SOUND, links: true, crystal: "dark", hpMod: 0.9, delay: 240, ranks: FUNG, moves: [frog, silence, spore], spells: [], drops: [
    { id: "sleepshroom", found: "sleepshroom", tier: "common" },
  ], respawn: 480 },
  "ghelsba-fodder": { id: "ghelsba-fodder", name: "Orcish Fodder", look: "orc", variant: "axe", family: "Orc", job: "WAR", levelMin: 3, levelMax: 9, window: "always", detect: SIGHT_SCENT, links: true, crystal: "fire", hpMod: 1.05, delay: 240, ranks: ORC, moves: [tackle], spells: [], drops: [
    { id: "orcish-axe", found: "orcish axe", tier: "uncommon" }, { id: "bronze-cap", found: "bronze cap", tier: "uncommon" }, { id: "bronze-leggings", found: "bronze leggings", tier: "uncommon" }, { id: "bronze-mittens", found: "bronze mittens", tier: "uncommon" }, { id: "bronze-subligar", found: "bronze subligar", tier: "uncommon" }, coin,
  ], respawn: 480 },
  "ghelsba-grappler": { id: "ghelsba-grappler", name: "Orcish Grappler", look: "orc", variant: "fist", family: "Orc", job: "MNK", levelMin: 3, levelMax: 9, window: "always", detect: SIGHT_SCENT, links: true, crystal: "fire", hpMod: 1.1, delay: 280, ranks: ORC, moves: [backhand, spin], spells: [], drops: [
    { id: "bronze-cap", found: "bronze cap", tier: "uncommon" }, { id: "bronze-leggings", found: "bronze leggings", tier: "uncommon" }, { id: "bronze-mittens", found: "bronze mittens", tier: "uncommon" }, { id: "bronze-subligar", found: "bronze subligar", tier: "uncommon" }, coin,
  ], respawn: 480 },
  "ghelsba-mesmerizer": { id: "ghelsba-mesmerizer", name: "Orcish Mesmerizer", look: "orc", variant: "staff", family: "Orc", job: "BLM", levelMin: 3, levelMax: 9, window: "always", detect: SIGHT_SCENT, links: true, crystal: "fire", hpMod: 0.9, delay: 260, ranks: ORC, moves: [], spells: [stone, poison, blind], drops: [
    { id: "circlet", found: "circlet", tier: "rare" }, { id: "slops", found: "slops", tier: "rare" }, { id: "scroll-of-bind", found: "scroll of bind", tier: "rare" }, { id: "scroll-of-blind", found: "scroll of blind", tier: "rare" }, coin,
  ], respawn: 480 },
  "orcish-stonelauncher": { id: "orcish-stonelauncher", name: "Orcish Stonelauncher", look: "warmachine", variant: "", family: "Warmachine", job: "WAR", levelMin: 8, levelMax: 10, window: "always", detect: SIGHT_SCENT, links: true, crystal: "fire", hpMod: 1.7, delay: 320, ranks: { str: 3, dex: 5, vit: 2, agi: 6, int: 4, mnd: 4, chr: 5, def: "B", eva: "E" }, moves: [stoneThrow, cannon], spells: [], drops: [
    { id: "hakenbuechse", found: "hakenbuechse", tier: "rare" },
  ], respawn: 480 },
  "ghelsba-grunt": { id: "ghelsba-grunt", name: "Orcish Grunt", look: "orc", variant: "polearm", family: "Orc", job: "DRG", levelMin: 11, levelMax: 15, window: "always", detect: SIGHT_SCENT, links: true, crystal: "fire", hpMod: 1.15, delay: 250, ranks: ORC, moves: [tackle, slam], spells: [], drops: [
    { id: "faceguard", found: "faceguard", tier: "uncommon" }, { id: "scale-cuisses", found: "scale cuisses", tier: "uncommon" }, { id: "scale-finger-gauntlets", found: "scale finger gauntlets", tier: "uncommon" }, { id: "scale-greaves", found: "scale greaves", tier: "uncommon" }, coin,
  ], respawn: 480 },
  "ghelsba-neck": { id: "ghelsba-neck", name: "Orcish Neckchopper", look: "orc", variant: "scythe", family: "Orc", job: "DRK", levelMin: 11, levelMax: 15, window: "always", detect: SIGHT_SCENT, links: true, crystal: "fire", hpMod: 1.05, delay: 270, ranks: ORC, moves: [tackle, slam], spells: [drainSpell, poison], drops: [
    { id: "faceguard", found: "faceguard", tier: "uncommon" }, { id: "scale-cuisses", found: "scale cuisses", tier: "uncommon" }, { id: "scale-finger-gauntlets", found: "scale finger gauntlets", tier: "uncommon" }, { id: "scale-greaves", found: "scale greaves", tier: "uncommon" }, coin,
  ], respawn: 480 },
  "ghelsba-chuck": { id: "ghelsba-chuck", name: "Orcish Stonechucker", look: "orc", variant: "bow", family: "Orc", job: "RNG", levelMin: 11, levelMax: 15, window: "always", detect: SIGHT_SCENT, links: true, crystal: "fire", hpMod: 1, delay: 280, ranks: ORC, moves: [shot, tackle], spells: [], drops: [
    { id: "leather-bandana", found: "leather bandana", tier: "uncommon" }, { id: "leather-gloves", found: "leather gloves", tier: "uncommon" }, { id: "leather-trousers", found: "leather trousers", tier: "uncommon" }, { id: "leather-highboots", found: "leather highboots", tier: "uncommon" }, coin,
  ], respawn: 480 },
  "thousandarm-deshglesh": { id: "thousandarm-deshglesh", name: "Thousandarm Deshglesh", look: "orc", variant: "sword", family: "Orc", job: "PLD", levelMin: 11, levelMax: 13, window: "always", detect: SIGHT_SCENT, links: true, crystal: "fire", hpMod: 1.8, delay: 250, ranks: ORC, moves: [tackle, shieldBash], spells: [], drops: [
    { id: "obelisk", found: "obelisk", tier: "rare" }, { id: "plate-belt", found: "plate belt", tier: "rare" }, coin,
  ], nm: true, respawn: 0 },
  "bloody-vrukwuk": { id: "bloody-vrukwuk", name: "Bloody Vrukwuk", look: "orc", variant: "sword", family: "Orc", job: "PLD", levelMin: 14, levelMax: 14, window: "always", detect: SIGHT_SCENT, links: true, crystal: "fire", hpMod: 1.55, delay: 250, ranks: ORC, moves: [tackle, shieldBash], spells: [], drops: [coin], nm: true, respawn: 960 },
  "fogweaver-mozzfuzz": { id: "fogweaver-mozzfuzz", name: "Fogweaver Mozzfuzz", look: "orc", variant: "staff", family: "Orc", job: "BLM", levelMin: 14, levelMax: 14, window: "always", detect: SIGHT_SCENT, links: true, crystal: "fire", hpMod: 1.35, delay: 260, ranks: ORC, moves: [], spells: [stone, poison, blind], drops: [coin], nm: true, respawn: 0 },
  "warchief-vatgit": { id: "warchief-vatgit", name: "Warchief Vatgit", look: "orc", variant: "axe", family: "Orc", job: "WAR", levelMin: 16, levelMax: 16, window: "always", detect: SIGHT_SCENT, links: true, crystal: "fire", hpMod: 1.9, delay: 240, ranks: ORC, moves: [tackle, slam, howl], spells: [], drops: [coin, { id: "orcish-axe", found: "orcish axe", tier: "uncommon" }], nm: true, respawn: 960 },
  "orcish-wallbreacher": { id: "orcish-wallbreacher", name: "Orcish Wallbreacher", look: "warmachine", variant: "", family: "Warmachine", job: "WAR", levelMin: 15, levelMax: 16, window: "always", detect: SIGHT_SCENT, links: true, crystal: "fire", hpMod: 2.1, delay: 330, ranks: { str: 3, dex: 5, vit: 2, agi: 6, int: 4, mnd: 4, chr: 5, def: "B", eva: "E" }, moves: [cannon, armature], spells: [], drops: [
    { id: "strike-baghnakhs", found: "strike baghnakhs", tier: "rare" },
  ], nm: true, respawn: 4500 },
  "orcish-barricader": { id: "orcish-barricader", name: "Orcish Barricader", look: "warmachine", variant: "", family: "Warmachine", job: "WAR", levelMin: 17, levelMax: 18, window: "always", detect: SIGHT_SCENT, links: true, crystal: "fire", hpMod: 2.3, delay: 340, ranks: { str: 3, dex: 5, vit: 2, agi: 6, int: 4, mnd: 4, chr: 5, def: "B", eva: "E" }, moves: [cannon, armature, stoneThrow], spells: [], drops: [
    { id: "lantern-shield", found: "lantern shield", tier: "rare" },
  ], nm: true, respawn: 4500 },
  // Fort Ghelsba. Same names as the outpost, higher bands, their own kits.
  "fort-spectacled": { id: "fort-spectacled", name: "Spectacled Bats", look: "bats", variant: "", family: "Bat", job: "WAR", levelMin: 6, levelMax: 8, window: "night-18", detect: PASSIVE_SOUND, links: true, crystal: "wind", hpMod: 0.7, delay: 220, ranks: BAT, moves: [wing], spells: [], drops: [{ id: "bat-wing", found: "bat wing", tier: "common" }], respawn: 480 },
  "fort-cheiroptera": { id: "fort-cheiroptera", name: "Cheiroptera", look: "bat", variant: "", family: "Bat", job: "WAR", levelMin: 8, levelMax: 10, window: "night-18", detect: SOUND, links: false, crystal: "wind", hpMod: 0.85, delay: 210, ranks: BAT, moves: [wing, drain, suction], spells: [], drops: [{ id: "bat-wing", found: "bat wing", tier: "common" }], respawn: 480 },
  "sentry-lizard": { id: "sentry-lizard", name: "Sentry Lizard", look: "lizard", variant: "", family: "Lizard", job: "WAR", levelMin: 11, levelMax: 14, window: "always", detect: PASSIVE_SOUND, links: true, crystal: "fire", hpMod: 1.15, delay: 250, ranks: { str: 3, dex: 4, vit: 3, agi: 4, int: 4, mnd: 4, chr: 5, def: "C", eva: "D" }, moves: [tailBlow, blockhead, fireball], spells: [], drops: [
    { id: "lizard-tail", found: "lizard tail", tier: "common" }, { id: "lizard-skin", found: "lizard skin", tier: "uncommon" },
  ], respawn: 480 },
  "fort-fodder": { id: "fort-fodder", name: "Orcish Fodder", look: "orc", variant: "axe", family: "Orc", job: "WAR", levelMin: 8, levelMax: 10, window: "always", detect: SIGHT_SCENT, links: true, crystal: "fire", hpMod: 1.1, delay: 240, ranks: ORC, moves: [tackle], spells: [], drops: [
    { id: "orcish-axe", found: "orcish axe", tier: "uncommon" }, { id: "bronze-cap", found: "bronze cap", tier: "uncommon" }, { id: "bronze-leggings", found: "bronze leggings", tier: "uncommon" }, { id: "bronze-mittens", found: "bronze mittens", tier: "uncommon" }, { id: "bronze-subligar", found: "bronze subligar", tier: "uncommon" }, coin,
  ], respawn: 480 },
  "fort-grappler": { id: "fort-grappler", name: "Orcish Grappler", look: "orc", variant: "fist", family: "Orc", job: "MNK", levelMin: 8, levelMax: 10, window: "always", detect: SIGHT_SCENT, links: true, crystal: "fire", hpMod: 1.15, delay: 280, ranks: ORC, moves: [backhand, spin], spells: [], drops: [
    { id: "bronze-cap", found: "bronze cap", tier: "uncommon" }, { id: "bronze-leggings", found: "bronze leggings", tier: "uncommon" }, { id: "bronze-mittens", found: "bronze mittens", tier: "uncommon" }, { id: "bronze-subligar", found: "bronze subligar", tier: "uncommon" }, coin,
  ], respawn: 480 },
  "fort-mesmerizer": { id: "fort-mesmerizer", name: "Orcish Mesmerizer", look: "orc", variant: "staff", family: "Orc", job: "BLM", levelMin: 8, levelMax: 10, window: "always", detect: SIGHT_SCENT, links: true, crystal: "fire", hpMod: 0.95, delay: 260, ranks: ORC, moves: [], spells: [stone, poison, blind], drops: [
    { id: "slops", found: "slops", tier: "rare" }, { id: "circlet", found: "circlet", tier: "rare" }, { id: "scroll-of-bind", found: "scroll of bind", tier: "rare" }, { id: "scroll-of-blind", found: "scroll of blind", tier: "rare" }, coin,
  ], respawn: 480 },
  "fort-grunt": { id: "fort-grunt", name: "Orcish Grunt", look: "orc", variant: "polearm", family: "Orc", job: "DRG", levelMin: 11, levelMax: 17, window: "always", detect: SIGHT_SCENT, links: true, crystal: "fire", hpMod: 1.2, delay: 250, ranks: ORC, moves: [tackle, slam], spells: [], drops: [
    { id: "faceguard", found: "faceguard", tier: "uncommon" }, { id: "scale-cuisses", found: "scale cuisses", tier: "uncommon" }, { id: "scale-finger-gauntlets", found: "scale finger gauntlets", tier: "uncommon" }, { id: "scale-greaves", found: "scale greaves", tier: "uncommon" }, coin,
  ], respawn: 480 },
  "fort-neck": { id: "fort-neck", name: "Orcish Neckchopper", look: "orc", variant: "scythe", family: "Orc", job: "DRK", levelMin: 11, levelMax: 17, window: "always", detect: SIGHT_SCENT, links: true, crystal: "fire", hpMod: 1.1, delay: 270, ranks: ORC, moves: [tackle, slam], spells: [drainSpell, poison], drops: [
    { id: "faceguard", found: "faceguard", tier: "uncommon" }, { id: "scale-cuisses", found: "scale cuisses", tier: "uncommon" }, { id: "scale-finger-gauntlets", found: "scale finger gauntlets", tier: "uncommon" }, { id: "scale-greaves", found: "scale greaves", tier: "uncommon" }, coin,
  ], respawn: 480 },
  "fort-chuck": { id: "fort-chuck", name: "Orcish Stonechucker", look: "orc", variant: "bow", family: "Orc", job: "RNG", levelMin: 11, levelMax: 17, window: "always", detect: SIGHT_SCENT, links: true, crystal: "fire", hpMod: 1.05, delay: 280, ranks: ORC, moves: [shot, tackle], spells: [], drops: [
    { id: "leather-bandana", found: "leather bandana", tier: "uncommon" }, { id: "leather-gloves", found: "leather gloves", tier: "uncommon" }, { id: "leather-trousers", found: "leather trousers", tier: "uncommon" }, { id: "leather-highboots", found: "leather highboots", tier: "uncommon" }, coin,
  ], respawn: 480 },
  "orcish-flamethrower": { id: "orcish-flamethrower", name: "Orcish Flamethrower", look: "warmachine", variant: "flame", family: "Warmachine", job: "WAR", levelMin: 16, levelMax: 18, window: "always", detect: SIGHT_SCENT, links: true, crystal: "fire", hpMod: 1.85, delay: 320, ranks: { str: 3, dex: 5, vit: 2, agi: 6, int: 4, mnd: 4, chr: 5, def: "B", eva: "E" }, moves: [cannon, flameArmor], spells: [], drops: [
    { id: "fire-arrow", found: "fire arrow", tier: "uncommon" },
  ], respawn: 480 },
  "fort-cursemaker": { id: "fort-cursemaker", name: "Orcish Cursemaker", look: "orc", variant: "staff", family: "Orc", job: "BLM", levelMin: 21, levelMax: 21, window: "always", detect: SIGHT_SCENT, links: true, crystal: "fire", hpMod: 1.05, delay: 260, ranks: ORC, moves: [], spells: [stone, poison, blind, drainSpell], drops: [
    { id: "ghelsba-chest-key", found: "ghelsba chest key", tier: "rare" }, { id: "black-slacks", found: "black slacks", tier: "uncommon" }, { id: "sandals", found: "sandals", tier: "uncommon" }, { id: "shaman-garlic", found: "shaman garlic", tier: "uncommon" }, { id: "white-mitts", found: "white mitts", tier: "uncommon" }, silver,
  ], respawn: 480 },
  "fort-fighter": { id: "fort-fighter", name: "Orcish Fighter", look: "orc", variant: "sword", family: "Orc", job: "WAR", levelMin: 21, levelMax: 21, window: "always", detect: SIGHT_SCENT, links: true, crystal: "fire", hpMod: 1.25, delay: 240, ranks: ORC, moves: [tackle, slam], spells: [], drops: [
    { id: "ghelsba-chest-key", found: "ghelsba chest key", tier: "rare" }, { id: "cathedral-tapestry", found: "cathedral tapestry", tier: "rare" }, { id: "lizard-helm", found: "lizard helm", tier: "uncommon" }, { id: "lizard-gloves", found: "lizard gloves", tier: "uncommon" }, { id: "lizard-trousers", found: "lizard trousers", tier: "uncommon" }, { id: "lizard-ledelsens", found: "lizard ledelsens", tier: "uncommon" }, silver,
  ], respawn: 480 },
  "fort-serjeant": { id: "fort-serjeant", name: "Orcish Serjeant", look: "orc", variant: "sword", family: "Orc", job: "PLD", levelMin: 21, levelMax: 23, window: "always", detect: SIGHT_SCENT, links: true, crystal: "fire", hpMod: 1.4, delay: 250, ranks: ORC, moves: [tackle, shieldBash], spells: [], drops: [
    { id: "ghelsba-chest-key", found: "ghelsba chest key", tier: "rare" }, { id: "castle-floor-plans", found: "castle floor plans", tier: "rare" }, { id: "lizard-jerkin", found: "lizard jerkin", tier: "uncommon" }, { id: "lizard-helm", found: "lizard helm", tier: "uncommon" }, silver,
  ], respawn: 480 },
  "hundredscar-hajwaj": { id: "hundredscar-hajwaj", name: "Hundredscar Hajwaj", look: "orc", variant: "club", family: "Orc", job: "WAR", levelMin: 11, levelMax: 13, window: "always", detect: SIGHT_SCENT, links: true, crystal: "fire", hpMod: 1.7, delay: 240, ranks: ORC, moves: [tackle, slam], spells: [], drops: [
    { id: "wild-cudgel", found: "wild cudgel", tier: "rare" }, { id: "coarse-leggings", found: "coarse leggings", tier: "uncommon" }, coin,
  ], nm: true, respawn: 0 },
  "orcish-panzer": { id: "orcish-panzer", name: "Orcish Panzer", look: "warmachine", variant: "", family: "Warmachine", job: "WAR", levelMin: 20, levelMax: 21, window: "always", detect: SIGHT_SCENT, links: true, crystal: "fire", hpMod: 2.2, delay: 340, ranks: { str: 3, dex: 5, vit: 2, agi: 6, int: 4, mnd: 4, chr: 5, def: "B", eva: "E" }, moves: [cannon, armature], spells: [], drops: [
    { id: "ghelsba-chest-key", found: "ghelsba chest key", tier: "rare" },
  ], nm: true, respawn: 960 },
  "chariotbuster-byakzak": { id: "chariotbuster-byakzak", name: "Chariotbuster Byakzak", look: "orc", variant: "sword", family: "Orc", job: "WAR", levelMin: 21, levelMax: 21, window: "always", detect: SIGHT_SCENT, links: true, crystal: "fire", hpMod: 1.85, delay: 240, ranks: ORC, moves: [tackle, slam], spells: [], drops: [
    { id: "auriga-xiphos", found: "auriga xiphos", always: true }, silver,
  ], nm: true, respawn: 0 },
  "kegpaunch-doshgnosh": { id: "kegpaunch-doshgnosh", name: "Kegpaunch Doshgnosh", look: "warmachine", variant: "flame", family: "Warmachine", job: "WAR", levelMin: 25, levelMax: 25, window: "always", detect: SIGHT_SCENT, links: true, crystal: "fire", hpMod: 2.5, delay: 340, ranks: { str: 3, dex: 5, vit: 2, agi: 6, int: 4, mnd: 4, chr: 5, def: "B", eva: "E" }, moves: [cannon, armature, flameArmor], spells: [], drops: [
    { id: "frugal-cape", found: "frugal cape", tier: "rare" },
  ], nm: true, respawn: 4500 },
  // Yughott Grotto. Deeper orcs, riding lizards, and the night stealth bat.
  "grotto-bats": { id: "grotto-bats", name: "Grotto Bats", look: "bats", variant: "", family: "Bat", job: "WAR", levelMin: 8, levelMax: 11, window: "always", detect: SOUND, links: true, crystal: "wind", hpMod: 0.8, delay: 220, ranks: BAT, moves: [wing], spells: [], drops: [{ id: "bat-wing", found: "bat wing", tier: "common" }], respawn: 480 },
  "stealth-bat": { id: "stealth-bat", name: "Stealth Bat", look: "bat", variant: "", family: "Bat", job: "WAR", levelMin: 15, levelMax: 18, window: "night-18", detect: SOUND, links: true, crystal: "wind", hpMod: 0.95, delay: 210, ranks: BAT, moves: [wing, drain, suction, stink], spells: [], drops: [
    { id: "bat-wing", found: "bat wing", tier: "common" }, { id: "fiend-blood", found: "fiend blood", tier: "uncommon" },
  ], respawn: 480 },
  "riding-lizard": { id: "riding-lizard", name: "Riding Lizard", look: "lizard", variant: "", family: "Lizard", job: "WAR", levelMin: 12, levelMax: 15, window: "always", detect: PASSIVE_SOUND, links: true, crystal: "fire", hpMod: 1.25, delay: 250, ranks: { str: 3, dex: 4, vit: 3, agi: 4, int: 4, mnd: 4, chr: 5, def: "C", eva: "D" }, moves: [tailBlow, blockhead, fireball], spells: [], drops: [
    { id: "lizard-skin", found: "lizard skin", tier: "common" }, { id: "lizard-tail", found: "lizard tail", tier: "uncommon" },
  ], respawn: 480 },
  "yug-grunt": { id: "yug-grunt", name: "Orcish Grunt", look: "orc", variant: "polearm", family: "Orc", job: "DRG", levelMin: 14, levelMax: 18, window: "always", detect: SIGHT_SCENT, links: true, crystal: "fire", hpMod: 1.25, delay: 250, ranks: ORC, moves: [tackle, slam], spells: [], drops: [
    { id: "faceguard", found: "faceguard", tier: "uncommon" }, { id: "scale-cuisses", found: "scale cuisses", tier: "uncommon" }, { id: "scale-finger-gauntlets", found: "scale finger gauntlets", tier: "uncommon" }, { id: "scale-greaves", found: "scale greaves", tier: "uncommon" }, coin,
  ], respawn: 480 },
  "yug-neck": { id: "yug-neck", name: "Orcish Neckchopper", look: "orc", variant: "scythe", family: "Orc", job: "DRK", levelMin: 14, levelMax: 18, window: "always", detect: SIGHT_SCENT, links: true, crystal: "fire", hpMod: 1.15, delay: 270, ranks: ORC, moves: [tackle, slam], spells: [drainSpell, poison], drops: [
    { id: "faceguard", found: "faceguard", tier: "uncommon" }, { id: "scale-cuisses", found: "scale cuisses", tier: "uncommon" }, { id: "scale-finger-gauntlets", found: "scale finger gauntlets", tier: "uncommon" }, { id: "scale-greaves", found: "scale greaves", tier: "uncommon" }, coin,
  ], respawn: 480 },
  "yug-chuck": { id: "yug-chuck", name: "Orcish Stonechucker", look: "orc", variant: "bow", family: "Orc", job: "RNG", levelMin: 14, levelMax: 18, window: "always", detect: SIGHT_SCENT, links: true, crystal: "fire", hpMod: 1.1, delay: 280, ranks: ORC, moves: [shot, tackle], spells: [], drops: [
    { id: "leather-bandana", found: "leather bandana", tier: "uncommon" }, { id: "leather-gloves", found: "leather gloves", tier: "uncommon" }, { id: "leather-trousers", found: "leather trousers", tier: "uncommon" }, { id: "leather-highboots", found: "leather highboots", tier: "uncommon" }, coin,
  ], respawn: 480 },
  "yug-cursemaker": { id: "yug-cursemaker", name: "Orcish Cursemaker", look: "orc", variant: "staff", family: "Orc", job: "BLM", levelMin: 21, levelMax: 23, window: "always", detect: SIGHT_SCENT, links: true, crystal: "fire", hpMod: 1.1, delay: 260, ranks: ORC, moves: [], spells: [stone, poison, blind, drainSpell], drops: [
    { id: "ghelsba-chest-key", found: "ghelsba chest key", tier: "rare" }, { id: "black-slacks", found: "black slacks", tier: "uncommon" }, { id: "sandals", found: "sandals", tier: "uncommon" }, { id: "shaman-garlic", found: "shaman garlic", tier: "uncommon" }, { id: "white-mitts", found: "white mitts", tier: "uncommon" }, silver,
  ], respawn: 480 },
  "yug-fighter": { id: "yug-fighter", name: "Orcish Fighter", look: "orc", variant: "sword", family: "Orc", job: "WAR", levelMin: 21, levelMax: 23, window: "always", detect: SIGHT_SCENT, links: true, crystal: "fire", hpMod: 1.3, delay: 240, ranks: ORC, moves: [tackle, slam], spells: [], drops: [
    { id: "ghelsba-chest-key", found: "ghelsba chest key", tier: "rare" }, { id: "red-cryptex", found: "red cryptex", tier: "rare" }, { id: "cathedral-tapestry", found: "cathedral tapestry", tier: "rare" }, { id: "lizard-helm", found: "lizard helm", tier: "uncommon" }, { id: "lizard-gloves", found: "lizard gloves", tier: "uncommon" }, { id: "lizard-trousers", found: "lizard trousers", tier: "uncommon" }, { id: "lizard-ledelsens", found: "lizard ledelsens", tier: "uncommon" }, silver,
  ], respawn: 480 },
  "yug-serjeant": { id: "yug-serjeant", name: "Orcish Serjeant", look: "orc", variant: "sword", family: "Orc", job: "PLD", levelMin: 21, levelMax: 23, window: "always", detect: SIGHT_SCENT, links: true, crystal: "fire", hpMod: 1.45, delay: 250, ranks: ORC, moves: [tackle, shieldBash], spells: [], drops: [
    { id: "ghelsba-chest-key", found: "ghelsba chest key", tier: "rare" }, { id: "castle-floor-plans", found: "castle floor plans", tier: "rare" }, { id: "lizard-jerkin", found: "lizard jerkin", tier: "uncommon" }, { id: "lizard-helm", found: "lizard helm", tier: "uncommon" }, silver,
  ], respawn: 480 },
  "ashmaker-gotblut": { id: "ashmaker-gotblut", name: "Ashmaker Gotblut", look: "orc", variant: "staff", family: "Orc", job: "BLM", levelMin: 17, levelMax: 18, window: "always", detect: SIGHT_SCENT, links: true, crystal: "fire", hpMod: 1.55, delay: 260, ranks: ORC, moves: [], spells: [stone, poison, blind, drainSpell], drops: [
    { id: "hermits-wand", found: "hermit's wand", tier: "rare" }, { id: "priests-robe", found: "priest's robe", tier: "rare" }, coin,
  ], nm: true, respawn: 0 },
  "morgawr": { id: "morgawr", name: "Morgawr", look: "pugil", variant: "", family: "Pugil", job: "WAR", levelMin: 23, levelMax: 25, window: "always", detect: PASSIVE_SOUND, links: false, crystal: "water", hpMod: 1.8, delay: 280, ranks: CRAB, moves: [screw, aqua], spells: [], drops: [
    { id: "ghelsba-chest-key", found: "ghelsba chest key", tier: "rare" },
  ], nm: true, respawn: 960 },
};

function twin(id: string, from: string, patch: Partial<Species>): void {
  const base = SPECIES[from];
  SPECIES[id] = {
    ...base,
    ...patch,
    id,
    moves: patch.moves ?? base.moves,
    spells: patch.spells ?? base.spells,
    drops: patch.drops ?? base.drops,
  };
}

// East Ronfaure. Same families as the west wood, with this shore's levels and detection.
twin("east-tunnel", "tunnel-worm", { levelMin: 1, levelMax: 1, detect: PASSIVE_SOUND, links: false, window: "day" });
twin("east-rabbit", "wild-rabbit", { levelMin: 1, levelMax: 1, window: "day" });
twin("east-carrion", "carrion-worm", { levelMin: 1, levelMax: 5, detect: PASSIVE_SOUND, links: false, window: "day" });
twin("east-ding", "ding-bats", { detect: PASSIVE_SOUND, links: false });
twin("east-hare", "forest-hare", { levelMin: 1, levelMax: 5 });
twin("east-funguar", "forest-funguar", { levelMin: 3, levelMax: 6, detect: PASSIVE_SOUND, links: true });
twin("east-mouse", "mouse-bat", { levelMin: 3, levelMax: 6, detect: PASSIVE_SOUND, links: true });
twin("east-scarab", "scarab-beetle", { levelMin: 3, levelMax: 6, detect: PASSIVE_SIGHT, links: true });
twin("east-fisher", "goblin-fisher", { levelMin: 3, levelMax: 8 });
twin("east-thug", "goblin-thug", { levelMin: 3, levelMax: 8 });
twin("east-weaver", "goblin-weaver", { levelMin: 4, levelMax: 8 });
twin("east-digger", "goblin-digger", { levelMin: 5, levelMax: 8 });
twin("east-fodder", "orcish-fodder", { levelMin: 3, levelMax: 8 });
twin("east-grappler", "orcish-grappler", { levelMin: 3, levelMax: 8 });
twin("east-mesmerizer", "orcish-mesmerizer", { levelMin: 3, levelMax: 8 });
twin("east-bones", "enchanted-bones", { levelMin: 4, levelMax: 8 });
twin("east-bones-drk", "enchanted-bones-drk", { levelMin: 5, levelMax: 8 });
twin("east-hound", "tainted-hound", { levelMin: 5, levelMax: 8 });
twin("east-sheep", "wild-sheep", { levelMin: 5, levelMax: 8, detect: PASSIVE_SIGHT, links: true });
twin("east-bomb", "bomb", { levelMin: 8, levelMax: 10 });
twin("east-pugil", "ghelsba-pugil", { name: "Pugil", levelMin: 1, levelMax: 5, window: "always", detect: SOUND, links: false, hpMod: 1, respawn: 300 });
twin("bigmouth-billy", "east-carrion", {
  name: "Bigmouth Billy",
  levelMin: 9,
  levelMax: 10,
  detect: PASSIVE_SOUND,
  links: true,
  hpMod: 2.15,
  nm: true,
  moves: [fluid, sandspin],
  drops: [
    { id: "copper-ore", found: "copper ore", tier: "common" },
    { id: "flint-stone", found: "flint stone", tier: "common" },
    { id: "zinc-ore", found: "zinc ore", tier: "uncommon" },
    { id: "iron-ore", found: "iron ore", tier: "uncommon" },
    { id: "mythril-ore", found: "mythril ore", tier: "rare" },
    { id: "translucent-rock", found: "translucent rock", tier: "uncommon" },
    { id: "white-rock", found: "white rock", tier: "uncommon" },
    { id: "black-rock", found: "black rock", tier: "uncommon" },
    { id: "gold-ore", found: "gold ore", tier: "rare" },
  ],
});
twin("swamfisk", "east-pugil", {
  name: "Swamfisk",
  levelMin: 12,
  levelMax: 15,
  detect: SOUND,
  links: true,
  hpMod: 2.4,
  nm: true,
  moves: [screw, waterWall],
  drops: [
    { id: "gelong-staff", found: "gelong staff", always: true },
    { id: "shall-shell", found: "shall shell", tier: "uncommon" },
    { id: "pugil-scales", found: "pugil scales", tier: "common" },
  ],
});
twin("rambukk", "east-sheep", {
  name: "Rambukk",
  look: "sheep",
  variant: "ram",
  family: "Ram",
  levelMin: 12,
  levelMax: 15,
  detect: SIGHT,
  links: true,
  hpMod: 1.64,
  nm: true,
  window: "day",
  moves: [ramCharge, rage, song],
  drops: [
    { id: "bukktooth", found: "bukktooth", tier: "uncommon" },
    { id: "giant-sheep-meat", found: "giant sheep meat", tier: "common" },
    { id: "sheepskin", found: "sheepskin", tier: "common" },
  ],
});

const tombKey = { id: "ranperre-chest-key", found: "ranperre chest key", tier: "rare" as const };
const tombFang = { id: "bat-fang", found: "bat fang", tier: "common" as const };
const tombWing = { id: "bat-wing", found: "bat wing", tier: "common" as const };
const tombChip = { id: "bone-chip", found: "bone chip", tier: "very-common" as const };
const tombBlood = { id: "fiend-blood", found: "fiend blood", tier: "uncommon" as const };
const tombOre = [
  { id: "copper-ore", found: "copper ore", tier: "common" as const },
  { id: "flint-stone", found: "flint stone", tier: "common" as const },
  { id: "zinc-ore", found: "zinc ore", tier: "uncommon" as const },
  { id: "silver-ore", found: "silver ore", tier: "uncommon" as const },
];

// King Ranperre's Tomb, 75-era. Horizon standing counts, fitted to these halls.
// Night windows stay night. The hollow at K-9 stays empty.
twin("tomb-carrion", "carrion-worm", { levelMin: 2, levelMax: 5, window: "always", detect: SOUND, links: false, hpMod: 0.6 });
twin("tomb-ding", "ding-bats", { levelMin: 2, levelMax: 5, window: "night-20", detect: SOUND, links: false, drops: [tombWing] });
twin("tomb-mouse", "mouse-bat", { levelMin: 3, levelMax: 6, window: "always", detect: SOUND_LINK, links: true, drops: [tombWing, tombFang, tombBlood] });
twin("tomb-wind", "ding-bats", { name: "Wind Bats", levelMin: 9, levelMax: 11, window: "always", detect: SOUND_LINK, links: true, hpMod: 0.8, drops: [tombWing] });
twin("tomb-grave", "mouse-bat", { name: "Grave Bat", levelMin: 11, levelMax: 13, window: "always", detect: SOUND_LINK, links: true, hpMod: 0.95, drops: [tombFang, tombWing] });
twin("tomb-plague", "ding-bats", { name: "Plague Bats", levelMin: 15, levelMax: 17, window: "night-20", detect: SOUND_LINK, links: true, hpMod: 0.9, moves: [wing, stink], drops: [tombFang, tombWing, tombKey] });
twin("tomb-bat", "mouse-bat", { name: "Tomb Bat", levelMin: 17, levelMax: 19, window: "always", detect: SOUND_LINK, links: true, hpMod: 1.05, drops: [tombFang, tombWing, tombBlood, tombKey] });
twin("tomb-dire", "mouse-bat", { name: "Dire Bat", levelMin: 62, levelMax: 64, window: "always", detect: SOUND, links: false, hpMod: 1.2, drops: [tombWing, tombFang, tombBlood] });
twin("tomb-barbastelle", "mouse-bat", { name: "Barbastelle", levelMin: 16, levelMax: 19, window: "always", detect: SOUND, links: false, hpMod: 1.65, nm: true, drops: [tombFang, tombWing, tombBlood], respawn: 0 });
twin("tomb-bones", "enchanted-bones", { levelMin: 4, levelMax: 8, window: "night-20" });
twin("tomb-bones-drk", "enchanted-bones-drk", { levelMin: 5, levelMax: 8, window: "night-20" });
twin("tomb-nach", "enchanted-bones", { name: "Nachzehrer", levelMin: 15, levelMax: 18, window: "always", hpMod: 1.05, drops: [tombChip, tombKey] });
twin("tomb-nach-drk", "enchanted-bones-drk", { name: "Nachzehrer", levelMin: 15, levelMax: 18, window: "always", hpMod: 1, drops: [tombChip, tombKey] });
twin("tomb-spartoi", "enchanted-bones", { name: "Spartoi Warrior", levelMin: 78, levelMax: 80, window: "always", hpMod: 1.3, drops: [tombChip, { id: "revival-tree-root", found: "revival tree root", tier: "uncommon" }] });
twin("tomb-spartoi-sorc", "enchanted-bones-drk", { name: "Spartoi Sorcerer", variant: "staff", levelMin: 80, levelMax: 82, window: "always", hpMod: 1.15, moves: [cloud], spells: [blizzard, blizzard3, drainSpell], drops: [tombChip, { id: "revival-tree-root", found: "revival tree root", tier: "rare" }] });
twin("tomb-thug", "goblin-thug", { levelMin: 4, levelMax: 8, window: "always" });
twin("tomb-weaver", "goblin-weaver", { levelMin: 4, levelMax: 8, window: "always" });
twin("tomb-ambusher", "goblin-thug", { name: "Goblin Ambusher", variant: "bow", job: "RNG", levelMin: 12, levelMax: 16, window: "always", moves: [shot, bombToss], drops: [{ id: "animal-glue", found: "animal glue", tier: "uncommon" }, coin, tombKey] });
twin("tomb-butcher", "goblin-thug", { name: "Goblin Butcher", variant: "axe", job: "WAR", levelMin: 12, levelMax: 16, window: "always", hpMod: 1.05, moves: [bombToss, rush, slam], drops: [coin, { id: "goblin-armor", found: "goblin armor", tier: "uncommon" }, tombKey] });
twin("tomb-tinkerer", "goblin-thug", { name: "Goblin Tinkerer", variant: "club", job: "DRK", levelMin: 12, levelMax: 16, window: "always", moves: [bombToss, rush], spells: [drainSpell], drops: [coin, tombKey] });
twin("tomb-gambler", "goblin-weaver", { name: "Goblin Gambler", variant: "staff", job: "BLM", levelMin: 21, levelMax: 23, window: "always", hpMod: 0.9, moves: [], spells: [stone, poison, blind], drops: [{ id: "poison-flour", found: "poison flour", tier: "uncommon" }, silver] });
twin("tomb-leecher", "goblin-weaver", { name: "Goblin Leecher", variant: "staff", job: "WHM", levelMin: 21, levelMax: 23, window: "always", hpMod: 0.85, moves: [], spells: [cure, dia, poison], drops: [{ id: "cotton-cloth", found: "cotton cloth", tier: "uncommon" }, silver] });
twin("tomb-mugger", "goblin-thug", { name: "Goblin Mugger", variant: "dagger", job: "THF", levelMin: 21, levelMax: 23, window: "always", drops: [silver, { id: "goblin-helm", found: "goblin helm", tier: "uncommon" }, { id: "goblin-armor", found: "goblin armor", tier: "uncommon" }] });
twin("tomb-stone", "carrion-worm", { name: "Stone Eater", job: "BLM", levelMin: 5, levelMax: 7, window: "always", detect: SOUND, links: false, hpMod: 0.75, moves: [fluid, stone], spells: [] });
twin("tomb-rock", "carrion-worm", { name: "Rock Eater", job: "BLM", levelMin: 14, levelMax: 16, window: "always", detect: SOUND, links: false, hpMod: 0.95, moves: [fluid, stone], spells: [], drops: [...tombOre, tombKey] });
twin("tomb-worm", "carrion-worm", { name: "Tomb Worm", levelMin: 58, levelMax: 61, window: "always", detect: SOUND, links: false, hpMod: 1.25, moves: [fluid] });
twin("tomb-ankou", "enchanted-bones-drk", { name: "Ankou", variant: "staff", job: "BLM", levelMin: 21, levelMax: 21, window: "night-20", hpMod: 1.7, nm: true, moves: [cloud, saber], spells: [drainSpell, stone, sleepSpell], drops: [tombChip, { id: "revival-tree-root", found: "revival tree root", tier: "rare" }], respawn: 0 });
twin("tomb-hati", "tainted-hound", { name: "Hati", variant: "hati", levelMin: 77, levelMax: 79, window: "always", detect: UNDEAD, links: false, hpMod: 1.35, drops: [{ id: "wolf-hide", found: "wolf hide", tier: "common" }, { id: "revival-tree-root", found: "revival tree root", tier: "uncommon" }] });

SPECIES["tomb-spook"] = { id: "tomb-spook", name: "Spook", look: "ghost", variant: "", family: "Ghost", job: "BLM", levelMin: 11, levelMax: 13, window: "night-20", detect: UNDEAD, links: false, crystal: "dark", hpMod: 0.9, delay: 240, ranks: GHOST, moves: [terror, nightmare], spells: [drainSpell, blind, sleepSpell], drops: [{ id: "cotton-cloth", found: "cotton cloth", tier: "common" }, { id: "revival-tree-root", found: "revival tree root", tier: "rare" }], nm: true, respawn: 0 };
SPECIES["tomb-crypt-ghost"] = { id: "tomb-crypt-ghost", name: "Crypt Ghost", look: "ghost", variant: "", family: "Ghost", job: "WAR", levelMin: 20, levelMax: 21, window: "always", detect: UNDEAD, links: false, crystal: "dark", hpMod: 1.4, delay: 250, ranks: GHOST, moves: [terror, cloud], spells: [drainSpell], drops: [{ id: "cotton-cloth", found: "cotton cloth", tier: "common" }, tombKey, { id: "revival-tree-root", found: "revival tree root", tier: "uncommon" }], nm: true, respawn: 0 };
SPECIES["tomb-gwyllgi"] = { id: "tomb-gwyllgi", name: "Gwyllgi", look: "hound", variant: "hati", family: "Hound", job: "WAR", levelMin: 20, levelMax: 22, window: "always", detect: UNDEAD, links: true, crystal: "dark", hpMod: 1.6, delay: 230, ranks: HOUND, moves: [howl, claw, dirty], spells: [], drops: [{ id: "wolf-hide", found: "wolf hide", tier: "common" }, { id: "revival-tree-root", found: "revival tree root", tier: "rare" }], nm: true, respawn: 0 };
SPECIES["tomb-gruel"] = { id: "tomb-gruel", name: "Goblin Gruel", look: "slime", variant: "", family: "Slime", job: "WAR", levelMin: 18, levelMax: 20, window: "always", detect: SOUND_SCENT, links: false, crystal: "water", hpMod: 1.35, delay: 270, ranks: SLIME, moves: [fluid, ooze], spells: [], drops: [{ id: "slime-oil", found: "slime oil", tier: "common" }, tombKey], respawn: 300 };
SPECIES["tomb-sapling"] = { id: "tomb-sapling", name: "Cherry Sapling", look: "sapling", variant: "", family: "Sapling", job: "WAR", levelMin: 62, levelMax: 64, window: "always", detect: SOUND_LINK, links: true, crystal: "earth", hpMod: 1.15, delay: 280, ranks: TREE, moves: [branch, photo], spells: [], drops: [{ id: "fruit-seeds", found: "fruit seeds", tier: "common" }, { id: "treant-bulb", found: "treant bulb", tier: "uncommon" }] };
SPECIES["tomb-cherry"] = { id: "tomb-cherry", name: "Cemetery Cherry", look: "sapling", variant: "ancient", family: "Treant", job: "WAR", levelMin: 72, levelMax: 73, window: "always", detect: SOUND, links: true, crystal: "earth", hpMod: 2.4, delay: 290, ranks: TREE, moves: [branch, photo, leafstorm], spells: [], drops: [{ id: "divine-log", found: "divine log", tier: "rare" }, { id: "petrified-log", found: "petrified log", tier: "rare" }, { id: "treant-bulb", found: "treant bulb", tier: "common" }], nm: true, respawn: 0 };
SPECIES["tomb-armet"] = { id: "tomb-armet", name: "Armet Beetle", look: "beetle", variant: "armet", family: "Beetle", job: "WAR", levelMin: 64, levelMax: 66, window: "always", detect: SIGHT, links: false, crystal: "earth", hpMod: 1.25, delay: 260, ranks: BEETLE, moves: [rhino, spoil], spells: [], drops: [{ id: "beetle-jaw", found: "beetle jaw", tier: "common" }, { id: "beetle-shell", found: "beetle shell", tier: "common" }, { id: "insect-wing", found: "insect wing", tier: "uncommon" }] };
SPECIES["tomb-scorpion"] = { id: "tomb-scorpion", name: "Cutlass Scorpion", look: "scorpion", variant: "", family: "Scorpion", job: "WAR", levelMin: 63, levelMax: 65, window: "always", detect: SOUND, links: false, crystal: "earth", hpMod: 1.15, delay: 250, ranks: SCORP, moves: [pincer, venom], spells: [], drops: [{ id: "scorpion-claw", found: "scorpion claw", tier: "common" }, { id: "scorpion-shell", found: "scorpion shell", tier: "uncommon" }] };
SPECIES["tomb-eyes"] = { id: "tomb-eyes", name: "Thousand Eyes", look: "hecteyes", variant: "", family: "Hecteyes", job: "BLM", levelMin: 60, levelMax: 62, window: "always", detect: SOUND, links: false, crystal: "dark", hpMod: 1.05, delay: 240, ranks: EYES, moves: [hexEye, cataract], spells: [], drops: [{ id: "hecteyes-eye", found: "hecteyes eye", tier: "common" }] };

const AHRIMAN = { str: 5, dex: 4, vit: 4, agi: 3, int: 2, mnd: 3, chr: 4, def: "D" as SkillRank, eva: "C" as SkillRank };
const WEAPON_RANKS = { str: 3, dex: 4, vit: 2, agi: 5, int: 4, mnd: 4, chr: 5, def: "B" as SkillRank, eva: "D" as SkillRank };
const wingOnly = [wing];
const batDrain = [wing, suction, drain];
const ahrimanKit = [hypo, mindBreak, binding];
const eyeDrops = [{ id: "ahriman-lens", found: "ahriman lens", tier: "common" as const }, { id: "ahriman-tears", found: "ahriman tears", tier: "uncommon" as const }];
const hectDrops = [{ id: "hecteyes-eye", found: "hecteyes eye", tier: "common" as const }, { id: "mercury", found: "mercury", tier: "uncommon" as const }];
const scorDrops = [{ id: "scorpion-claw", found: "scorpion claw", tier: "common" as const }, { id: "scorpion-shell", found: "scorpion shell", tier: "uncommon" as const }];

twin("pass-wind", "ding-bats", {
  name: "Wind Bats", look: "bats", variant: "wind", levelMin: 3, levelMax: 5, window: "always", detect: PASSIVE_SOUND, links: false,
  hpMod: 0.6, moves: wingOnly, drops: [{ id: "bat-wing", found: "bat wing", tier: "common" }], respawn: 300,
});
twin("pass-blade", "mouse-bat", {
  name: "Blade Bat", look: "bat", variant: "", levelMin: 4, levelMax: 7, window: "always", detect: SOUND, links: false,
  hpMod: 0.8, moves: batDrain, drops: [{ id: "bat-wing", found: "bat wing", tier: "common" }], respawn: 300,
});
twin("pass-thug", "goblin-thug", {
  levelMin: 4, levelMax: 8, window: "always", respawn: 300,
  drops: [coin, { id: "wild-onion", found: "wild onion", tier: "uncommon" }, { id: "bronze-cap", found: "bronze cap", tier: "uncommon" }, { id: "bronze-leggings", found: "bronze leggings", tier: "uncommon" }, { id: "bronze-mittens", found: "bronze mittens", tier: "uncommon" }, { id: "bronze-subligar", found: "bronze subligar", tier: "uncommon" }, { id: "goblin-armor", found: "goblin armor", tier: "rare" }, { id: "goblin-mask", found: "goblin mask", tier: "rare" }],
});
twin("pass-weaver", "goblin-weaver", {
  levelMin: 4, levelMax: 8, window: "always", respawn: 300,
  drops: [{ id: "grass-thread", found: "grass thread", tier: "common" }, { id: "cotton-thread", found: "cotton thread", tier: "uncommon" }, { id: "grass-cloth", found: "grass cloth", tier: "uncommon" }, { id: "cotton-cloth", found: "cotton cloth", tier: "uncommon" }, { id: "circlet", found: "circlet", tier: "rare" }, { id: "ash-clogs", found: "ash clogs", tier: "rare" }, { id: "cuffs", found: "cuffs", tier: "rare" }, { id: "slops", found: "slops", tier: "rare" }, { id: "goblin-armor", found: "goblin armor", tier: "rare" }, { id: "goblin-mask", found: "goblin mask", tier: "rare" }],
});
twin("pass-oil", "tomb-gruel", {
  name: "Oil Slick", look: "slime", variant: "oil", levelMin: 7, levelMax: 9, window: "always", detect: SOUND_SCENT, links: false,
  hpMod: 0.9, moves: [fluid], drops: [{ id: "slime-oil", found: "slime oil", tier: "common" }], respawn: 300,
});
twin("pass-seeker", "ding-bats", {
  name: "Seeker Bats", look: "bats", variant: "", levelMin: 25, levelMax: 28, window: "always", detect: PASSIVE_SOUND, links: true,
  hpMod: 0.95, moves: [wing, swoop], drops: [{ id: "bat-wing", found: "bat wing", tier: "very-common" }], respawn: 300,
});
twin("pass-gambler", "goblin-weaver", {
  name: "Goblin Gambler", variant: "staff", job: "BLM", levelMin: 26, levelMax: 30, window: "always", crystal: "dark", hpMod: 0.9,
  moves: [], spells: [stone, stone2, water, aero, fire, blizzard, thunder, poison, blind, bio, sleepSpell],
  drops: [silver, { id: "poison-flour", found: "poison flour", tier: "uncommon" }, { id: "linen-slops", found: "linen slops", tier: "rare" }], respawn: 300,
});
twin("pass-leecher", "goblin-weaver", {
  name: "Goblin Leecher", variant: "staff", job: "WHM", levelMin: 26, levelMax: 30, window: "always", crystal: "light", hpMod: 0.85,
  moves: [], spells: [cure, cure2, dia, banish, protect],
  drops: [silver, { id: "linen-cuffs", found: "linen cuffs", tier: "uncommon" }, { id: "linen-slops", found: "linen slops", tier: "uncommon" }, { id: "scroll-of-barblind", found: "scroll of barblind", tier: "rare" }, { id: "scroll-of-barpoison", found: "scroll of barpoison", tier: "rare" }, { id: "scroll-of-barsleep", found: "scroll of barsleep", tier: "rare" }, { id: "scroll-of-deodorize", found: "scroll of deodorize", tier: "rare" }, { id: "scroll-of-invisible", found: "scroll of invisible", tier: "rare" }, { id: "scroll-of-protectra", found: "scroll of protectra", tier: "rare" }, { id: "scroll-of-silence", found: "scroll of silence", tier: "rare" }, { id: "scroll-of-paralyze", found: "scroll of paralyze", tier: "rare" }, { id: "scroll-of-sneak", found: "scroll of sneak", tier: "rare" }],
  respawn: 300,
});
twin("pass-mugger", "goblin-thug", {
  name: "Goblin Mugger", levelMin: 26, levelMax: 30, window: "always",
  drops: [silver, { id: "brass-cap", found: "brass cap", tier: "uncommon" }, { id: "brass-leggings", found: "brass leggings", tier: "uncommon" }, { id: "brass-mittens", found: "brass mittens", tier: "uncommon" }, { id: "brass-subligar", found: "brass subligar", tier: "uncommon" }],
  respawn: 300,
});
twin("pass-ooze", "tomb-gruel", {
  name: "Ooze", levelMin: 28, levelMax: 30, window: "always", detect: SOUND_SCENT, links: false, hpMod: 1.15,
  moves: [fluid, ooze], drops: [{ id: "slime-oil", found: "slime oil", tier: "common" }], respawn: 300,
});
twin("pass-cave-scorpion", "tomb-scorpion", {
  name: "Cave Scorpion", levelMin: 30, levelMax: 33, window: "always", detect: SOUND_SCENT, links: false, hpMod: 1.05,
  moves: [pincer, venom], drops: [{ id: "frostreaper", found: "frostreaper", tier: "rare" }, ...scorDrops], respawn: 720,
});
twin("pass-stirge", "mouse-bat", {
  name: "Stirge", look: "bat", variant: "stirge", levelMin: 30, levelMax: 33, window: "always", detect: SOUND, links: true, hpMod: 1.05,
  moves: [wing, suction, drain, sonic, jet],
  drops: [{ id: "bat-wing", found: "bat wing", tier: "common" }, { id: "bat-fang", found: "bat fang", tier: "uncommon" }, { id: "fiend-blood", found: "fiend blood", tier: "uncommon" }],
  respawn: 300,
});
twin("pass-hecteyes", "tomb-eyes", {
  name: "Hecteyes", levelMin: 31, levelMax: 34, window: "always", detect: SOUND, links: false, hpMod: 1,
  moves: [hexEye, cataract], drops: hectDrops, respawn: 300,
});
twin("pass-pathfinder", "goblin-thug", {
  name: "Goblin Pathfinder", variant: "axe", job: "BST", levelMin: 32, levelMax: 36, window: "always", hpMod: 1.05,
  moves: [bombToss, rush],
  drops: [silver, { id: "brass-finger-gauntlets", found: "brass finger gauntlets", tier: "uncommon" }, { id: "brass-greaves", found: "brass greaves", tier: "uncommon" }, { id: "brass-mask", found: "brass mask", tier: "uncommon" }],
  respawn: 300,
});
twin("pass-bats", "ding-bats", {
  name: "Goblin's Bats", look: "bats", variant: "", levelMin: 25, levelMax: 27, window: "always", detect: PASSIVE_SOUND, links: false,
  hpMod: 0.85, moves: [wing, swoop], drops: [{ id: "bat-wing", found: "bat wing", tier: "rare" }], respawn: 300,
});
twin("pass-shaman", "goblin-weaver", {
  name: "Goblin Shaman", variant: "staff", job: "WHM", levelMin: 32, levelMax: 34, window: "always", crystal: "light", hpMod: 0.9,
  moves: [], spells: [cure, cure2, dia, banish, protect],
  drops: [silver, { id: "wool-hat", found: "wool hat", tier: "uncommon" }, { id: "wool-slops", found: "wool slops", tier: "uncommon" }],
  respawn: 300,
});
twin("pass-smithy", "goblin-thug", {
  name: "Goblin Smithy", variant: "club", job: "WAR", levelMin: 32, levelMax: 36, window: "always", hpMod: 1.15,
  moves: [bombToss, rush],
  drops: [silver, { id: "chain-hose", found: "chain hose", tier: "uncommon" }, { id: "chain-mittens", found: "chain mittens", tier: "uncommon" }, { id: "iron-mask", found: "iron mask", tier: "rare" }],
  respawn: 300,
});
twin("pass-furrier", "goblin-thug", {
  name: "Goblin Furrier", variant: "bow", job: "RNG", levelMin: 32, levelMax: 34, window: "always", crystal: "wind", hpMod: 1,
  moves: [shot, bombToss],
  drops: [silver, { id: "goblin-mask", found: "goblin mask", tier: "uncommon" }, { id: "goblin-armor", found: "goblin armor", tier: "uncommon" }, { id: "dhalmel-leather", found: "dhalmel leather", tier: "uncommon" }, { id: "studded-bandana", found: "studded bandana", tier: "rare" }, { id: "tiger-leather", found: "tiger leather", tier: "rare" }, { id: "sheep-leather", found: "sheep leather", tier: "uncommon" }],
  respawn: 300,
});
SPECIES["pass-floating-eye"] = { id: "pass-floating-eye", name: "Floating Eye", look: "ahriman", variant: "", family: "Ahriman", job: "BLM", levelMin: 34, levelMax: 36, window: "always", detect: SIGHT_SOUND, links: false, crystal: "dark", hpMod: 1, delay: 240, ranks: AHRIMAN, moves: ahrimanKit, spells: [], drops: eyeDrops, respawn: 300 };
SPECIES["pass-evil-weapon"] = { id: "pass-evil-weapon", name: "Evil Weapon", look: "weapon", variant: "", family: "Evil Weapon", job: "WAR", levelMin: 35, levelMax: 37, window: "always", detect: SOUND_MAGIC, links: false, crystal: "dark", hpMod: 1.15, delay: 260, ranks: WEAPON_RANKS, moves: [shieldStrike, arcane, oblivion], spells: [], drops: [{ id: "glittersand", found: "glittersand", tier: "uncommon" }], respawn: 720 };
twin("pass-taisai", "tomb-eyes", {
  name: "Taisai", variant: "taisai", levelMin: 35, levelMax: 38, window: "always", detect: SOUND, links: false, hpMod: 1.25,
  moves: [hexEye, cataract, deathRay], drops: hectDrops, respawn: 300,
});
twin("pass-giant-scorpion", "tomb-scorpion", {
  name: "Giant Scorpion", variant: "giant", levelMin: 38, levelMax: 40, window: "always", detect: SOUND_SCENT, links: false, hpMod: 1.45,
  moves: [pincer, venom, deathScissors], drops: [{ id: "harvester", found: "harvester", tier: "rare" }, ...scorDrops], respawn: 720,
});
SPECIES["pass-bat-eye"] = { id: "pass-bat-eye", name: "Bat Eye", look: "ahriman", variant: "bat", family: "Ahriman", job: "WAR", levelMin: 42, levelMax: 44, window: "always", detect: SIGHT_SOUND, links: false, crystal: "dark", hpMod: 1.7, delay: 240, ranks: AHRIMAN, moves: [hypo, mindBreak, binding, deathRay], spells: [], drops: [...eyeDrops, { id: "storm-axe", found: "storm axe", tier: "rare" }], nm: false, respawn: 300 };
SPECIES["pass-mucoid"] = { id: "pass-mucoid", name: "Mucoid Mass", look: "slime", variant: "mass", family: "Slime", job: "DRK", levelMin: 45, levelMax: 48, window: "always", detect: SOUND_SCENT, links: false, crystal: "water", hpMod: 2.1, delay: 270, ranks: SLIME, moves: [fluid, ooze], spells: [drainSpell], drops: [{ id: "slime-oil", found: "slime oil", tier: "common" }, { id: "spellcasters-ecu", found: "spellcaster's ecu", tier: "common" }], nm: true, respawn: 0 };
SPECIES["pass-taisaijin"] = { id: "pass-taisaijin", name: "Taisaijin", look: "hecteyes", variant: "jin", family: "Hecteyes", job: "BLM", levelMin: 60, levelMax: 63, window: "always", detect: SOUND, links: true, crystal: "dark", hpMod: 2.6, delay: 250, ranks: EYES, moves: [hexEye, cataract, deathRay, eyesOnMe], spells: [stone2, water2, aero, sleepSpell], drops: [...hectDrops, { id: "spelunkers-hat", found: "spelunker's hat", tier: "very-rare" }, { id: "scroll-of-refresh", found: "scroll of refresh", slot: "refresh", weight: 4 }, { id: "scroll-of-refresh-ii", found: "scroll of refresh ii", slot: "refresh", weight: 1 }], nm: true, respawn: 0 };
SPECIES["pass-gloom"] = { id: "pass-gloom", name: "Gloom Eye", look: "ahriman", variant: "gloom", family: "Ahriman", job: "WAR", levelMin: 73, levelMax: 74, window: "always", detect: SIGHT_SOUND, links: false, crystal: "dark", hpMod: 2.2, delay: 240, ranks: AHRIMAN, moves: [blindEye, eyesOnMe], spells: [], drops: [...eyeDrops, { id: "wit-pendant", found: "wit pendant", tier: "very-rare" }], nm: true, respawn: 0 };
SPECIES["pass-hyakume"] = { id: "pass-hyakume", name: "Hyakume", look: "hecteyes", variant: "hyaku", family: "Hecteyes", job: "BLM", levelMin: 43, levelMax: 45, window: "always", detect: SOUND, links: false, crystal: "dark", hpMod: 2, delay: 250, ranks: EYES, moves: [hexEye, cataract, deathRay, eyesOnMe], spells: [stone2, water2], drops: [...hectDrops, { id: "booster-earring", found: "booster earring", tier: "common" }], nm: true, respawn: 0 };

export type FieldBody = {
  id: string;
  species: string;
  name: string;
  look: FieldLook;
  variant: string;
  family: string;
  level: number;
  nm: boolean;
  x: number;
  z: number;
  yaw: number;
  spawnX: number;
  spawnZ: number;
  points: { x: number; z: number }[];
  index: number;
  pause: number;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  tp: number;
  attack: number;
  accuracy: number;
  defense: number;
  evasion: number;
  str: number;
  dex: number;
  vit: number;
  agi: number;
  int: number;
  mnd: number;
  weapon: number;
  delay: number;
  mode: "roam" | "chase" | "leash" | "dead";
  away: boolean;
  claimed: boolean;
  hadAggro: boolean;
  link: string;
  ph: "" | "jack" | "beetle" | "desh" | "haj" | "ash" | "billy" | "swam" | "crypt" | "gwyll" | "taisai" | "gloom" | "hyaku";
  /** Species that takes this corpse's place when its respawn finishes. */
  nextSpawn: string;
  /** Set while a timed NM is standing in as something else. Death returns to this species. */
  shell: string;
  shellLevel: number;
  held: boolean;
  swing: number;
  castIn: number;
  respawn: number;
  respawnMax: number;
  moved: number;
  anim: string;
  animLeft: number;
  /** Spell being read. Empty when the mouth is shut. */
  castName: string;
  castTotal: number;
  castElapsed: number;
  castMove: Move | null;
  /** An auto or weaponskill that has not connected yet. */
  swinging: boolean;
  swingMove: Move | null;
  /** Ability pose name. Stays up after the hit so the follow-through is not a plain swing. */
  gesture: string;
  hitIn: number;
  buffAtk: number;
  buffDef: number;
  buffLeft: number;
  spoiled: boolean;
  retired: boolean;
  /** 0 is fully out of the hole. 1 is underground. Worms only. */
  sink: number;
  burrow: "up" | "down" | "under" | "rise";
  stuck: number;
};

export type FieldLoot = { id: string; found: string };

export type FieldEvent =
  | { type: "log"; text: string; tone: "info" | "hit" }
  | { type: "float"; text: string; crit: boolean; x: number; z: number; color: string }
  | { type: "hurt"; amount: number }
  | { type: "swing" }
  | { type: "thief"; line: ReturnType<typeof thiefStrike> }
  | { type: "tp"; amount: number }
  | { type: "burst"; x: number; z: number; color: number; scale: number }
  | { type: "defeat"; id: string; name: string; level: number; x: number; z: number; gil: number; crystal: string | null; items: FieldLoot[]; species: string; family: string; west: boolean; east: boolean };

export type FieldSheet = {
  attack: number;
  accuracy: number;
  defense: number;
  evasion: number;
  str: number;
  dex: number;
  vit: number;
  agi: number;
  int: number;
  mnd: number;
  dmg: number;
  delay: number;
  seconds: number;
  doubleAttack: number;
  pdifCap: number;
  reach: number;
  /** TP this weapon returns on a connecting hit, before Store TP. */
  tpHit: number;
};

export type FieldThief = {
  hidden: boolean;
  sneak: boolean;
  trick: boolean;
  partner: boolean;
  dex: number;
  agi: number;
  mainThief: boolean;
  assassin: boolean;
};

export type FieldInput = {
  playerX: number;
  playerZ: number;
  playerLevel: number;
  playerKo: boolean;
  hpRatio: number;
  invisible: boolean;
  sneak: boolean;
  deodorize: boolean;
  castingMagic: boolean;
  inZone: boolean;
  hour: number;
  fog: boolean;
  sheet: FieldSheet | null;
  treasureHunter: number;
  gilfinder: boolean;
  /** Sneak Attack, Trick Attack, and Hide. Behind is read from this mob, not the training hare. */
  thief?: FieldThief | null;
};

const WATERS = [
  { x: 72, z: 724, w: 22, d: 15 },
  { x: -150, z: 360, w: 7, d: 70 },
  { x: -80, z: 430, w: 120, d: 6 },
  { x: 30, z: 530, w: 6, d: 150 },
  { x: 69.8, z: 600, w: 73.6, d: 6 },
  { x: 118.2, z: 600, w: 9.6, d: 6 },
];

export function ronfaureWet(x: number, z: number): boolean {
  for (const b of WATERS) {
    if (Math.abs(x - b.x) <= b.w / 2 + 0.9 && Math.abs(z - b.z) <= b.d / 2 + 0.9) return true;
  }
  return false;
}

export function ronfaureWindow(when: Window, hour: number, fog: boolean): boolean {
  if (when === "always") return true;
  if (when === "day") return hour >= 6 && hour < 18;
  if (when === "fog") return fog;
  if (when === "night-18") return hour >= 18 || hour < 6;
  return hour >= 20 || hour < 4;
}

/** Two Vana'diel hours of fog in every twelve. Bombs use this, not a storm spell. */
export function ronfaureFog(hour: number): boolean {
  return hour % 12 < 2;
}

function ashore(x: number, z: number): { x: number; z: number } {
  if (inPass(x, z, 0)) {
    const held = clampPass(x, z, 0.4);
    if (held && inPass(held.x, held.z, 0.15) && !passWet(held.x, held.z)) return held;
    return { x, z };
  }
  if (inTomb(x, z, 0)) {
    if (inTomb(x, z, 0.35)) return { x, z };
    const held = clampTomb(x, z, 0.45);
    if (held && inTomb(held.x, held.z, 0.15)) return held;
    return { x, z };
  }
  const eastBox = x >= EAST_X0 - 8 && z >= EAST_Z0 - 8 && x <= EAST_X0 + EAST_SIZE + 8 && z <= EAST_Z0 + EAST_SIZE + 8;
  if (eastBox && !inRonfaure(x, z, 0) && !inOrc(x, z, 0)) {
    const held = clampEast(x, z, 0.45);
    if (eastDry(held.x, held.z, 0.2)) return held;
    for (let rad = 2; rad <= 18; rad += 2) {
      for (let i = 0; i < 8; i++) {
        const ang = (i / 8) * Math.PI * 2;
        const px = held.x + Math.cos(ang) * rad;
        const pz = held.z + Math.sin(ang) * rad;
        if (eastDry(px, pz, 0.25)) return { x: px, z: pz };
      }
    }
    return held;
  }
  const held = clampWorld(x, z, 1.1);
  const spot = dry(held.x, held.z);
  if (inRonfaure(spot.x, spot.z, 0.8)) return spot;
  return clampWorld(spot.x, spot.z, 0.8);
}

let solidAt: (x: number, z: number) => boolean = () => false;

/** Walls and rocks from the yard. Same boxes the player cannot cross. */
export function bindFieldSolids(test: (x: number, z: number) => boolean): void {
  solidAt = test;
}

function footBlocked(x: number, z: number): boolean {
  return !(inRonfaure(x, z, 0.45) || inOrc(x, z, 0.45) || inEast(x, z, 0.45) || inTomb(x, z, 0.4) || inPass(x, z, 0.4)) || solidAt(x, z);
}

/** Pull every camp and its loop off a wall. Called once the yard colliders exist. */
export function seatField(place: (x: number, z: number) => { x: number; z: number }): void {
  for (const body of live) {
    const home = place(body.spawnX, body.spawnZ);
    if (sameGround(body, home)) {
      body.spawnX = home.x;
      body.spawnZ = home.z;
      body.x = home.x;
      body.z = home.z;
    }
  }
  for (const body of live) shoveOffLanding(body, place);
  loosenCamps(place);
  for (const body of live) {
    body.points = orbit(body.spawnX, body.spawnZ, roamOf(body), inOrc(body.spawnX, body.spawnZ, 0), specOf(body.species).detect.aggressive);
    body.x = body.spawnX;
    body.z = body.spawnZ;
    body.index = 0;
    body.yaw = yawAway(body.spawnX, body.spawnZ);
  }
  facePacks();
}

function facePacks(): void {
  const groups = new Map<string, FieldBody[]>();
  for (const body of live) {
    if (!body.link || !specOf(body.species).links) continue;
    const list = groups.get(body.link) ?? [];
    list.push(body);
    groups.set(body.link, list);
  }
  for (const pack of groups.values()) {
    if (pack.length < 2) continue;
    let cx = 0;
    let cz = 0;
    for (const body of pack) {
      cx += body.spawnX;
      cz += body.spawnZ;
    }
    cx /= pack.length;
    cz /= pack.length;
    for (const body of pack) {
      const mate = pack.find((other) => other !== body) ?? body;
      const inward = Math.hypot(body.spawnX - cx, body.spawnZ - cz) >= 0.8;
      body.yaw = inward ? faceYaw(body.spawnX, body.spawnZ, cx, cz) : faceYaw(body.spawnX, body.spawnZ, mate.spawnX, mate.spawnZ);
    }
  }
}

function dry(x: number, z: number): { x: number; z: number } {
  let px = x;
  let pz = z;
  for (let pass = 0; pass < 3; pass++) {
    let moved = false;
    for (const b of WATERS) {
      const minX = b.x - b.w / 2 - 1;
      const maxX = b.x + b.w / 2 + 1;
      const minZ = b.z - b.d / 2 - 1;
      const maxZ = b.z + b.d / 2 + 1;
      if (px < minX || px > maxX || pz < minZ || pz > maxZ) continue;
      const left = px - minX;
      const right = maxX - px;
      const down = pz - minZ;
      const up = maxZ - pz;
      const m = Math.min(left, right, down, up);
      if (m === left) px = minX;
      else if (m === right) px = maxX;
      else if (m === down) pz = minZ;
      else pz = maxZ;
      moved = true;
    }
    if (!moved) break;
  }
  return { x: px, z: pz };
}

function faceYaw(fromX: number, fromZ: number, toX: number, toZ: number): number {
  return Math.atan2(fromX - toX, fromZ - toZ);
}

/** Radians per second a body may turn. A half-turn takes about half a second. */
const FACE_TURN = 8;

function turnTo(yaw: number, target: number, max: number): number {
  const d = Math.atan2(Math.sin(target - yaw), Math.cos(target - yaw));
  if (Math.abs(d) <= max) return target;
  return yaw + Math.sign(d) * max;
}

function bake(spec: Species, level: number) {
  const jobRank = JOB_RANK[spec.job];
  const stat = (fam: number) => rankAt(fam, level) + rankAt(jobRank, level) + Math.floor(rankAt(jobRank, level) / 2);
  const [base, scale, scaleX] = JOB_HP[spec.job];
  const hp = Math.max(8, Math.floor((mainJobHp(level, base, scale, scaleX) + subjobHp(level, scale, scaleX)) * spec.hpMod));
  const str = stat(spec.ranks.str);
  const dex = stat(spec.ranks.dex);
  const vit = stat(spec.ranks.vit);
  const agi = stat(spec.ranks.agi);
  const int = stat(spec.ranks.int);
  const mnd = stat(spec.ranks.mnd);
  const skill = skillCap("C", level);
  const mp = spec.job === "BLM" ? 12 + level * 6 : spec.job === "WHM" ? 10 + level * 5 : spec.job === "RDM" ? 8 + level * 4 : spec.job === "DRK" ? 6 + level * 3 : spec.job === "PLD" ? 6 + level * 2 : 0;
  return {
    hp,
    mp,
    str, dex, vit, agi, int, mnd,
    attack: mainHandAttack(str, skill),
    accuracy: accuracyFrom(dex, skill),
    defense: mobDefense(skillCap(spec.ranks.def, level), vit),
    evasion: evasionFrom(agi, skillCap(spec.ranks.eva, level)),
    weapon: Math.max(1, Math.floor(level * 0.65 + 1)),
  };
}

const live: FieldBody[] = [];
const seats: { x: number; z: number; window: Window; link: string; links: boolean }[] = [];
/** 12 yalms. The widest camp gap is 11, so a one-cell ring covers a stack check. */
const GRID = 12;
const born = new Map<string, number>();
const seatBuckets = new Map<number, number[]>();
const campBuckets = new Map<number, number[]>();

function gridKey(x: number, z: number): number {
  return (Math.floor(x / GRID) + 4096) * 8192 + (Math.floor(z / GRID) + 4096);
}

function pushGrid(grid: Map<number, number[]>, x: number, z: number, index: number): void {
  const key = gridKey(x, z);
  const bucket = grid.get(key);
  if (bucket) bucket.push(index);
  else grid.set(key, [index]);
}

function visitGrid(grid: Map<number, number[]>, x: number, z: number, reach: number, visit: (index: number) => boolean): boolean {
  const cx = Math.floor(x / GRID);
  const cz = Math.floor(z / GRID);
  for (let dz = -reach; dz <= reach; dz++) {
    const row = cz + dz + 4096;
    for (let dx = -reach; dx <= reach; dx++) {
      const bucket = grid.get((cx + dx + 4096) * 8192 + row);
      if (!bucket) continue;
      for (let k = 0; k < bucket.length; k++) if (visit(bucket[k])) return true;
    }
  }
  return false;
}
let bodySerial = 0;
let selectedId: string | null = null;
let claimedId: string | null = null;
/** Seconds this body has been in a fight. A link waits until LINK_DELAY. */
const fightAge = new Map<string, number>();
let playerClock = 0;
let seenLevel = 75;
let fieldNow = 0;
/** When a lottery NM may be rolled again. Missing means the window is already open. */
const windowAt = new Map<string, number>();
let lastInput: FieldInput | null = null;
const pendingField: FieldEvent[] = [];
type FieldStatusHold = { enfeebles: Record<string, unknown>[]; debuffs: Record<string, unknown>[] };
const fieldStatuses = new Map<string, FieldStatusHold>();
const liftedItems = new Map<string, Set<string>>();
const liftedGil = new Set<string>();
const ailment = { blind: 0, poison: 0, silence: 0, sleep: 0, poisonTick: 0, poisonDmg: 2, dia: 0, diaTick: 0, diaDmg: 1 };

function specOf(id: string): Species {
  const spec = SPECIES[id];
  if (!spec) throw new Error(`unknown ronfaure species ${id}`);
  return spec;
}

/** Standing monsters, after the zone fills. Camps read this instead of inventing a roster. */
export function placedBodies(): { species: string; x: number; z: number }[] {
  return live.map((body) => ({ species: body.species, x: body.spawnX, z: body.spawnZ }));
}

/** Level, HP, weapon, delay, and drops for one species. Level is the species minimum. */
export function speciesFarm(id: string): {
  name: string;
  family: string;
  level: number;
  levelMin: number;
  levelMax: number;
  hpNatural: number;
  weaponDamage: number;
  delay: number;
  drops: { id: string; found: string; tier: DropTier }[];
} {
  const spec = specOf(id);
  const stats = bake(spec, spec.levelMin);
  return {
    name: spec.name,
    family: spec.family,
    level: spec.levelMin,
    levelMin: spec.levelMin,
    levelMax: spec.levelMax,
    hpNatural: stats.hp,
    weaponDamage: stats.weapon,
    delay: spec.delay,
    drops: spec.drops.flatMap((drop) => (drop.tier ? [{ id: drop.id, found: drop.found, tier: drop.tier }] : [])),
  };
}

function addBody(speciesId: string, x: number, z: number, link: string, ph: FieldBody["ph"], levelOverride?: number): FieldBody {
  const spec = specOf(speciesId);
  const span = spec.levelMax - spec.levelMin;
  const level = levelOverride ?? spec.levelMin + (live.length % (span + 1));
  const stats = bake(spec, level);
  const spot = ashore(x, z);
  const inDen = inOrc(spot.x, spot.z, 0);
  const roam = spawnRoam(spec, spot.x, spot.z);
  const points = orbit(spot.x, spot.z, roam, inDen, spec.detect.aggressive);
  const body: FieldBody = {
    id: `${speciesId}-${bodySerial++}`,
    species: speciesId,
    name: spec.name,
    look: spec.look,
    variant: spec.variant,
    family: spec.family,
    level,
    nm: spec.nm === true,
    x: spot.x,
    z: spot.z,
    yaw: yawAway(spot.x, spot.z),
    spawnX: spot.x,
    spawnZ: spot.z,
    points,
    index: 0,
    pause: standFor(spec.family),
    hp: stats.hp,
    maxHp: stats.hp,
    mp: stats.mp,
    maxMp: stats.mp,
    tp: 0,
    attack: stats.attack,
    accuracy: stats.accuracy,
    defense: stats.defense,
    evasion: stats.evasion,
    str: stats.str,
    dex: stats.dex,
    vit: stats.vit,
    agi: stats.agi,
    int: stats.int,
    mnd: stats.mnd,
    weapon: stats.weapon,
    delay: spec.delay,
    mode: "roam",
    away: false,
    claimed: false,
    hadAggro: false,
    link,
    ph,
    nextSpawn: "",
    shell: "",
    shellLevel: 0,
    held: false,
    swing: spec.delay / 60,
    castIn: 4 + (live.length % 4),
    respawn: 0,
    respawnMax: spec.respawn ?? RESPAWN,
    moved: 0,
    anim: "idle",
    animLeft: 0,
    castName: "",
    castTotal: 0,
    castElapsed: 0,
    castMove: null,
    swinging: false,
    swingMove: null,
    gesture: "",
    hitIn: 0,
    buffAtk: 1,
    buffDef: 1,
    buffLeft: 0,
    spoiled: false,
    retired: false,
    sink: 0,
    burrow: "up",
    stuck: 0,
  };
  if (spec.look === "worm") {
    if (live.length % 2 === 0) {
      body.burrow = "under";
      body.sink = 1;
      body.pause = -0.6 - (live.length % 4) * 0.35;
    } else {
      body.burrow = "up";
      body.sink = 0;
    }
  }
  live.push(body);
  seats.push({ x: body.spawnX, z: body.spawnZ, window: spec.window, link, links: spec.links });
  born.set(speciesId, (born.get(speciesId) ?? 0) + 1);
  pushGrid(seatBuckets, body.spawnX, body.spawnZ, seats.length - 1);
  pushGrid(campBuckets, body.spawnX, body.spawnZ, live.length - 1);
  return body;
}

function placeMate(speciesId: string, seed: { x: number; z: number }, link: string, turn0: number): boolean {
  const spec = specOf(speciesId);
  const roam = inOrc(seed.x, seed.z, 0) ? ROAM_OUT : ROAM_FIELD;
  for (const rad of [PACK_GAP + 0.25, PACK_GAP + 1.8, PACK_GAP + 3.2]) {
    for (let turn = 0; turn < 8; turn++) {
      const ang = turn0 + turn * 0.72;
      const x = seed.x + Math.cos(ang) * rad;
      const z = seed.z + Math.sin(ang) * rad;
      if (!canStand(x, z, spec, roam, link)) continue;
      addBody(speciesId, x, z, link, "");
      return true;
    }
  }
  return false;
}

function camp(speciesId: string, col: number, row: number, n: number, link: string, ph: FieldBody["ph"] = ""): void {
  const spec = specOf(speciesId);
  const spot = ronCell(col, row);
  let cursor = spot;
  let anchor: { x: number; z: number } | null = null;
  let placed = 0;
  for (let i = 0; i < n; i++) {
    if (i > 0 && spec.links && anchor && placeMate(speciesId, anchor, link, 0.6 + i * 2.15)) {
      placed += 1;
      continue;
    }
    const found = hunt(cursor.x, cursor.z, spec, ROAM_FIELD, i === 0 ? 42 : 20, link);
    if (!found) break;
    addBody(speciesId, found.x, found.z, link, placed === 0 ? ph : "");
    if (!anchor) anchor = found;
    placed += 1;
    cursor = found;
  }
}

function party(members: { id: string; ph?: FieldBody["ph"] }[], col: number, row: number, link: string): void {
  const spot = ronCell(col, row);
  const seed = hunt(spot.x, spot.z, specOf(members[0].id), ROAM_FIELD, 42);
  if (!seed) return;
  addBody(members[0].id, seed.x, seed.z, link, members[0].ph ?? "");
  members.slice(1).forEach((member, index) => {
    const spec = specOf(member.id);
    if (spec.links && placeMate(member.id, seed, link, 0.8 + index * 2.15)) return;
    for (const rad of [CAMP_GAP, CAMP_GAP + 2, CAMP_GAP + 4]) {
      for (let turn = 0; turn < 8; turn++) {
        const ang = 0.8 + index * 2.15 + turn * 0.75;
        const x = seed.x + Math.cos(ang) * rad;
        const z = seed.z + Math.sin(ang) * rad;
        if (!canStand(x, z, spec, ROAM_FIELD, link)) continue;
        addBody(member.id, x, z, link, member.ph ?? "");
        return;
      }
    }
  });
}

function pin(speciesId: string, x: number, z: number, link: string, maxR = 28, ph: FieldBody["ph"] = ""): void {
  const spec = specOf(speciesId);
  const roam = inOrc(x, z, 0) ? ROAM_OUT : ROAM_FIELD;
  const found = hunt(x, z, spec, roam, maxR, link);
  if (!found) return;
  addBody(speciesId, found.x, found.z, link, ph);
}

/** Stand just off a traced node, inside 2 yalms and off the centreline. */
function pinOff(speciesId: string, at: { x: number; z: number }, link: string, ph: FieldBody["ph"] = ""): void {
  const spec = specOf(speciesId);
  const roam = ROAM_OUT;
  for (let ring = 2; ring <= 4; ring++) {
    const rad = ring * 0.45;
    for (let i = 0; i < 12; i++) {
      const ang = (i / 12) * Math.PI * 2 + speciesId.length * 0.2;
      const x = at.x + Math.cos(ang) * rad;
      const z = at.z + Math.sin(ang) * rad;
      if (!canStand(x, z, spec, roam, link)) continue;
      addBody(speciesId, x, z, link, ph);
      return;
    }
  }
}

const LANDINGS: { x: number; z: number }[] = (() => {
  const south = zoneArrival("ronfaure-south");
  const north = zoneArrival("ronfaure-north");
  const list = [
    { x: south.x, z: south.z },
    { x: north.x, z: north.z },
    { x: south.x, z: south.z - 18 },
    { x: north.x + 22, z: north.z },
    { x: EXITS.ghelsba.x, z: EXITS.ghelsba.z },
    { x: EXITS.ghelsba.x, z: EXITS.ghelsba.z + 14 },
    { x: RON_TO_GHELSBA.x, z: RON_TO_GHELSBA.z },
  ];
  for (const gate of ORC_GATES) {
    list.push({ x: gate.x, z: gate.z });
    list.push({ x: gate.arrive.x, z: gate.arrive.z });
  }
  for (const spot of [
    EAST_STAND.sandoria,
    EAST_STAND.westA,
    EAST_STAND.westB,
    EAST_MOUTH.sandoria,
    EAST_MOUTH.westA,
    EAST_MOUTH.westB,
    EAST_MOUTH.ranguemont,
    EAST_MOUTH.tombH,
    EAST_MOUTH.tombJ,
    EAST_MOUTH.maw,
  ]) {
    list.push({ x: spot.x, z: spot.z });
  }
  for (const gate of TOMB_GATES) {
    list.push({ x: gate.x, z: gate.z });
    const stand = gate.arrive ?? gate.retreat;
    if (stand) list.push({ x: stand.x, z: stand.z });
  }
  list.push({ x: TOMB_FOYER.x, z: TOMB_FOYER.z });
  list.push({ x: PASS_ARRIVE.x, z: PASS_ARRIVE.z });
  list.push({ x: PASS_NPCS.perchond.x, z: PASS_NPCS.perchond.z });
  list.push({ x: PASS_NPCS.myffore.x, z: PASS_NPCS.myffore.z });
  for (const gate of PASS_GATES) {
    list.push({ x: gate.x, z: gate.z });
    const stand = gate.arrive ?? gate.retreat;
    if (stand) list.push({ x: stand.x, z: stand.z });
  }
  return list;
})();

function windowsShare(a: Window, b: Window): boolean {
  if (a === "always" || b === "always" || a === "fog" || b === "fog") return true;
  if (a === b) return true;
  const night = (when: Window) => when === "night-18" || when === "night-20";
  return night(a) && night(b);
}

function westPair(ax: number, az: number, bx: number, bz: number): boolean {
  return !inOrc(ax, az, 0) && !inOrc(bx, bz, 0);
}

/** Packs stay tight. West herds can. Den camps keep the wider gap. Tomb halls are narrower than a meadow. */
function seatGap(
  a: { x: number; z: number; link: string; links: boolean; window: Window },
  b: { x: number; z: number; link: string; links: boolean; window: Window },
): number {
  const tomb = inTomb(a.x, a.z, 0) && inTomb(b.x, b.z, 0);
  const tunnel = inPass(a.x, a.z, 0) && inPass(b.x, b.z, 0);
  const den = (inFort(a.x, a.z, 0) && inFort(b.x, b.z, 0)) || (inYughott(a.x, a.z, 0) && inYughott(b.x, b.z, 0));
  if (tunnel && a.link !== "" && a.link === b.link) return 4.4;
  if (den && a.link !== "" && a.link === b.link && a.links && b.links) return 5.2;
  if (a.link !== "" && a.link === b.link && a.links && b.links) return tomb ? 5.1 : PACK_GAP;
  const west = westPair(a.x, a.z, b.x, b.z);
  if (!windowsShare(a.window, b.window)) return tunnel ? 3.6 : tomb ? 4.2 : west ? WEST_SHIFT : SHIFT_GAP;
  // Always-up camps and night dens share a footprint. The night shift is the pull, not a second camp.
  if ((a.window === "always") !== (b.window === "always")) return tunnel ? 3.6 : tomb ? 4.2 : west ? WEST_SHIFT : SHIFT_GAP;
  if (tunnel && !a.links && !b.links) return 3.6;
  if (tunnel) return 5.8;
  if (tomb && !a.links && !b.links) return 4.4;
  if (tomb) return 7.1;
  if (west && !a.links && !b.links) return HERD_GAP;
  if (den) return 8;
  return CAMP_GAP;
}

function landingNeed(aggressive: boolean, roam: number, x = 0, z = 0): number {
  if (!aggressive) return inPass(x, z, 0) ? 6 : 8;
  if (inPass(x, z, 0)) return 12;
  if (inTomb(x, z, 0)) return 11;
  return Math.max(SIGHT_RANGE, SOUND_RANGE) + roam + LAND_PAD;
}

function blocksLanding(x: number, z: number, aggressive: boolean, roam: number): boolean {
  const tomb = inTomb(x, z, 0);
  const tunnel = inPass(x, z, 0);
  const need = landingNeed(aggressive, roam, x, z);
  for (const spot of LANDINGS) {
    if (tomb && !inTomb(spot.x, spot.z, 0)) continue;
    if (tunnel && !inPass(spot.x, spot.z, 0)) continue;
    if (!tunnel && !tomb && inPass(spot.x, spot.z, 0)) continue;
    if (Math.hypot(spot.x - x, spot.z - z) < need) return true;
  }
  return false;
}

function clearOf(x: number, z: number, when: Window, link = "", links = false): boolean {
  const here = { x, z, link, links, window: when };
  const blocked = visitGrid(seatBuckets, x, z, 1, (index) => {
    const seat = seats[index];
    return Math.hypot(seat.x - x, seat.z - z) < seatGap(here, seat);
  });
  return !blocked;
}

function underHut(x: number, z: number): boolean {
  return Math.abs(x - HUT_ROOF.x) <= HUT_ROOF.w / 2 + 1.2 && Math.abs(z - HUT_ROOF.z) <= HUT_ROOF.d / 2 + 1.2;
}

function denLandingRoom(x: number, z: number): boolean {
  const near = (spot: { x: number; z: number }, reach: number) => Math.hypot(spot.x - x, spot.z - z) < reach;
  if (inGhelsba(x, z, 0)) {
    if (near(ghelsbaCell(9, 10), 16)) return true;
    if (near(ghelsbaCell(8, 10), 13)) return true;
    if (near(ghelsbaCell(7, 10), 13)) return true;
    if (near(ghelsbaCell(7, 9), 12)) return true;
  }
  if (inFort(x, z, 0)) {
    if (near(fortCell(4, 7), 14)) return true;
    if (near(fortCell(6, 8), 14)) return true;
    if (near(fortCell(9, 6), 14)) return true;
    if (near(fortCell(9, 7), 14)) return true;
  }
  if (inYughott(x, z, 0)) {
    if (near(grottoCell(4, 8), 14)) return true;
    if (near(grottoCell(5, 6), 13)) return true;
    if (near(grottoCell(7, 6), 14)) return true;
    if (near(grottoMouth("k5"), 14)) return true;
    if (near(grottoMouth("k6"), 14)) return true;
    if (near(grottoMouth("j9"), 14)) return true;
  }
  return false;
}

function canStand(x: number, z: number, spec: Species, roam: number, link = ""): boolean {
  if (zoneTouch(x, z)) return false;
  if (inTomb(x, z, 0)) {
    if (!inTomb(x, z, 1.15)) return false;
    if (Math.hypot(x - TOMB_HOLLOW.x, z - TOMB_HOLLOW.z) < 14) return false;
  } else if (inOrc(x, z, 0.45)) {
    if (!orcDry(x, z, 0.35) || (inGhelsba(x, z, 0) && underHut(x, z))) return false;
    if (spec.detect.aggressive && denLandingRoom(x, z)) return false;
  } else if (inEast(x, z, 0)) {
    if (!eastDry(x, z, 0.7)) return false;
    if (Math.hypot(x - EAST_MANUAL_GATE.x, z - EAST_MANUAL_GATE.z) < 2.4) return false;
    if (Math.hypot(x - EAST_MANUAL_ROAD.x, z - EAST_MANUAL_ROAD.z) < 2.4) return false;
  } else if (inPass(x, z, 0)) {
    if (!inPass(x, z, 0.8) || passWet(x, z)) return false;
    if (Math.hypot(x - PASS_NPCS.perchond.x, z - PASS_NPCS.perchond.z) < 2.6) return false;
    if (Math.hypot(x - PASS_NPCS.myffore.x, z - PASS_NPCS.myffore.z) < 2.6) return false;
  } else if (ronfaureWet(x, z) || !inRonfaure(x, z, 1.3)) return false;
  if (blocksLanding(x, z, spec.detect.aggressive, roam)) return false;
  if (!clearOf(x, z, spec.window, link, spec.links)) return false;
  if (!spec.detect.aggressive) return true;
  for (let k = 1; k <= 3; k++) {
    const a = k * 2.2 + x * 0.01;
    if (blocksLanding(x + Math.cos(a) * roam, z + Math.sin(a) * roam, true, 0)) return false;
  }
  return true;
}

function hunt(x0: number, z0: number, spec: Species, roam: number, maxR: number, link = ""): { x: number; z: number } | null {
  let salt = 0;
  for (let i = 0; i < spec.id.length; i++) salt = (salt * 33 + spec.id.charCodeAt(i)) >>> 0;
  const turn = ((salt % 100) / 100) * Math.PI * 2;
  for (let ring = 0; ring <= 8; ring++) {
    const rad = ring === 0 ? 0 : 6 + (ring - 1) * 5;
    if (rad > maxR) break;
    const steps = ring === 0 ? 1 : 12;
    for (let i = 0; i < steps; i++) {
      const ang = turn + (i / steps) * Math.PI * 2 + ring * 0.4;
      const x = x0 + Math.cos(ang) * rad;
      const z = z0 + Math.sin(ang) * rad;
      if (canStand(x, z, spec, roam, link)) return { x, z };
    }
  }
  return null;
}

function spawnRoam(spec: Species, x: number, z: number): number {
  if (inPass(x, z, 0)) return spec.links ? 1.15 : 1.4;
  if (inTomb(x, z, 0)) return spec.links ? 1.7 : 2.05;
  if (inOrc(x, z, 0)) return ROAM_OUT;
  if (!spec.links) return HERD_ROAM;
  return ROAM_FIELD;
}

function roamOf(body: FieldBody): number {
  const spec = specOf(body.species);
  if (inPass(body.spawnX, body.spawnZ, 0)) {
    const base = spec.links ? 1.15 : 1.4;
    if (!body.link) return base;
    return Math.min(base, 1.05);
  }
  if (inTomb(body.spawnX, body.spawnZ, 0)) {
    const base = spec.links ? 1.7 : 2.05;
    if (!body.link || !spec.links) return base;
    const mate = live.some((other) => other !== body && other.link === body.link && specOf(other.species).links);
    return mate ? Math.min(base, 1.45) : base;
  }
  const base = inOrc(body.spawnX, body.spawnZ, 0) ? ROAM_OUT : spec.links ? ROAM_FIELD : HERD_ROAM;
  if (!body.link || !spec.links) return base;
  const mate = live.some((other) => other !== body && other.link === body.link && specOf(other.species).links);
  return mate ? Math.min(base, PACK_ROAM) : base;
}

function orbit(x: number, z: number, roam: number, inOut: boolean, aggressive: boolean): { x: number; z: number }[] {
  const points = [{ x, z }];
  for (let k = 1; k <= 3; k++) {
    const a = k * 2.2 + x * 0.01;
    const px = x + Math.cos(a) * roam;
    const pz = z + Math.sin(a) * roam;
    if (inOut) {
      if (!orcDry(px, pz, 0.35)) continue;
    } else if (inTomb(x, z, 0)) {
      if (!inTomb(px, pz, 0.7) || tombStory(px, pz) !== tombStory(x, z)) continue;
      if (Math.hypot(px - TOMB_HOLLOW.x, pz - TOMB_HOLLOW.z) < 14) continue;
    } else if (inEast(px, pz, 0)) {
      if (!eastDry(px, pz, 0.35)) continue;
    } else if (inPass(x, z, 0)) {
      if (!inPass(px, pz, 0.55) || passWet(px, pz) || oneWayBlocks(x, z, px, pz)) continue;
    } else if (!inRonfaure(px, pz, 0.8) || ronfaureWet(px, pz)) continue;
    if (zoneTouch(px, pz)) continue;
    if (aggressive && blocksLanding(px, pz, true, 0)) continue;
    points.push({ x: px, z: pz });
  }
  return points;
}

function nearestLanding(x: number, z: number): { x: number; z: number; d: number } {
  let best = LANDINGS[0];
  let d = Infinity;
  for (const spot of LANDINGS) {
    const h = Math.hypot(spot.x - x, spot.z - z);
    if (h < d) {
      d = h;
      best = spot;
    }
  }
  return { x: best.x, z: best.z, d };
}

function yawAway(x: number, z: number): number {
  const near = nearestLanding(x, z);
  if (near.d > 90) return 0;
  return faceYaw(x, z, near.x, near.z) + Math.PI;
}

function sameGround(body: FieldBody, home: { x: number; z: number }): boolean {
  const story = tombStory(body.spawnX, body.spawnZ);
  if (story) return tombStory(home.x, home.z) === story;
  if (inFort(body.spawnX, body.spawnZ, 0)) return inFort(home.x, home.z, 0) && orcDry(home.x, home.z, 0.2);
  if (inYughott(body.spawnX, body.spawnZ, 0)) return inYughott(home.x, home.z, 0) && orcDry(home.x, home.z, 0.2);
  if (inGhelsba(body.spawnX, body.spawnZ, 0)) return inGhelsba(home.x, home.z, 0) && ghelsbaDry(home.x, home.z);
  if (inEast(body.spawnX, body.spawnZ, 0)) return eastDry(home.x, home.z, 0.15);
  if (inPass(body.spawnX, body.spawnZ, 0)) return inPass(home.x, home.z, 0.15) && !passWet(home.x, home.z);
  return inRonfaure(home.x, home.z, 0.4) && !ronfaureWet(home.x, home.z);
}

function shoveOffLanding(body: FieldBody, place: (x: number, z: number) => { x: number; z: number }): void {
  const spec = specOf(body.species);
  const need = landingNeed(spec.detect.aggressive, roamOf(body), body.spawnX, body.spawnZ);
  for (let step = 0; step < 16; step++) {
    const near = nearestLanding(body.spawnX, body.spawnZ);
    if (near.d >= need) return;
    const len = Math.max(0.001, near.d);
    const home = place(body.spawnX + ((body.spawnX - near.x) / len) * 3, body.spawnZ + ((body.spawnZ - near.z) / len) * 3);
    if (!sameGround(body, home)) return;
    if (Math.hypot(home.x - body.spawnX, home.z - body.spawnZ) < 0.35) return;
    body.spawnX = home.x;
    body.spawnZ = home.z;
    body.x = home.x;
    body.z = home.z;
  }
}

function loosenCamps(place: (x: number, z: number) => { x: number; z: number }): void {
  for (let pass = 0; pass < 5; pass++) {
    const grid = new Map<number, number[]>();
    for (let i = 0; i < live.length; i++) pushGrid(grid, live[i].spawnX, live[i].spawnZ, i);
    for (let i = 0; i < live.length; i++) {
      const a = live[i];
      const specA = specOf(a.species);
      visitGrid(grid, a.spawnX, a.spawnZ, 1, (j) => {
        if (j <= i) return false;
        const b = live[j];
        const specB = specOf(b.species);
        const gap = seatGap(
          { x: a.spawnX, z: a.spawnZ, link: a.link, links: specA.links, window: specA.window },
          { x: b.spawnX, z: b.spawnZ, link: b.link, links: specB.links, window: specB.window },
        );
        const dx = b.spawnX - a.spawnX;
        const dz = b.spawnZ - a.spawnZ;
        const d = Math.hypot(dx, dz);
        if (d >= gap) return false;
        const push = d < 0.05 ? gap : gap - d + 0.35;
        const ux = d < 0.05 ? 1 : dx / d;
        const uz = d < 0.05 ? 0 : dz / d;
        const home = place(b.spawnX + ux * push, b.spawnZ + uz * push);
        if (!sameGround(b, home)) return false;
        if (blocksLanding(home.x, home.z, specB.detect.aggressive, roamOf(b))) return false;
        b.spawnX = home.x;
        b.spawnZ = home.z;
        b.x = home.x;
        b.z = home.z;
        return false;
      });
    }
  }
}

const outSpots: { x: number; z: number }[] = [];
for (let x = -1800; x <= -700; x += 4) {
  for (let z = 80; z <= 1100; z += 4) {
    if (!ghelsbaDry(x, z) || underHut(x, z) || zoneTouch(x, z)) continue;
    outSpots.push({ x, z });
  }
}

function claimOut(anchor: { x: number; z: number }, radius: number, speciesId: string, n: number, link: string, ph: FieldBody["ph"] = ""): number {
  const spec = specOf(speciesId);
  const friends = spec.links ? seats.filter((seat) => seat.link === link && seat.links) : [];
  const pool = outSpots
    .filter((p) => Math.hypot(p.x - anchor.x, p.z - anchor.z) <= radius * 2.3)
    .sort((a, b) => {
      const near = (p: { x: number; z: number }) => (friends.length ? Math.min(...friends.map((seat) => Math.hypot(p.x - seat.x, p.z - seat.z))) : Math.hypot(p.x - anchor.x, p.z - anchor.z));
      return near(a) - near(b);
    });
  let placed = 0;
  for (const p of pool) {
    if (placed >= n) break;
    if (!canStand(p.x, p.z, spec, ROAM_OUT, link)) continue;
    addBody(speciesId, p.x, p.z, link, placed === 0 ? ph : "");
    if (spec.links) friends.push({ x: p.x, z: p.z, window: spec.window, link, links: true });
    placed += 1;
  }
  return placed;
}

function denPack(ids: string[], anchor: { x: number; z: number }, link: string, ph: FieldBody["ph"] = ""): void {
  if (!ids.length) return;
  const first = specOf(ids[0]);
  const seed = hunt(anchor.x, anchor.z, first, ROAM_OUT, 22, link);
  if (!seed) return;
  addBody(ids[0], seed.x, seed.z, link, ph);
  const step = (Math.PI * 2) / Math.max(3, ids.length);
  ids.slice(1).forEach((id, index) => placeMate(id, seed, link, 0.5 + index * step));
}

function denPair(a: string, b: string, anchor: { x: number; z: number }, link: string, ph: FieldBody["ph"] = "", third = ""): void {
  denPack([a, b, third].filter((id) => id !== ""), anchor, link, ph);
}

// One pair to a room. Landing rooms stay empty: fort E-8, G-9, J-7, J-8 and grotto E-9, F-7, H-7, K-5, K-6, J-9.
// Hundredscar Hajwaj lotteries off the three orcs around G-9. That room is a landing, so the camps beside it hold the placeholders.
denPair("fort-fodder", "fort-grappler", fortCell(5, 7), "fort-f8", "haj");
denPair("fort-fodder", "fort-mesmerizer", fortCell(6, 7), "fort-g8", "haj");
pinOff("fort-grappler", fortPoi("nm_hundredscar_hajwaj"), "haj-node", "haj");
denPair("fort-grunt", "fort-neck", fortCell(7, 7), "fort-h8");
denPair("fort-grunt", "fort-chuck", fortCell(7, 6), "fort-h7");
denPair("fort-neck", "fort-chuck", fortCell(8, 7), "fort-i8", "", "fort-grunt");
denPair("orcish-flamethrower", "", fortCell(6, 5), "fort-g6");
denPair("sentry-lizard", "sentry-lizard", fortCell(7, 8), "fort-h9");
denPair("orcish-flamethrower", "sentry-lizard", fortCell(7, 9), "fort-h10");
denPair("fort-cursemaker", "fort-fighter", fortCell(8, 9), "fort-i10");
denPair("orcish-flamethrower", "", fortCell(9, 5), "fort-j6");
denPair("fort-serjeant", "fort-cursemaker", fortCell(9, 8), "fort-j9");
denPair("kegpaunch-doshgnosh", "", fortPoi("nm_kegpaunch_doshgnosh"), "fort-keg");
denPair("fort-spectacled", "", fortCell(6, 7), "fort-night-g8");
denPair("fort-cheiroptera", "", fortCell(7, 6), "fort-night-h7");
denPair("grotto-bats", "grotto-bats", grottoCell(5, 8), "yug-f9");
// Ashmaker Gotblut lotteries off an Orcish Grunt or an Orcish Stonechucker at H-9.
const ashAt = yughottPoi("nm_ashmaker_gotblut", 1);
pin("yug-grunt", ashAt.x + 1.2, ashAt.z + 0.45, "yug-ash", 1.6, "ash");
pin("yug-chuck", ashAt.x + 4, ashAt.z - 1.5, "yug-ash", 8, "ash");
const morgAt = yughottNode(2, "area_se");
pinOff("morgawr", morgAt, "yug-morgawr");
const panzerAt = fortPoi("nm_orcish_panzer");
pinOff("orcish-panzer", panzerAt, "fort-panzer");
const yugI6 = grottoCell(8, 6);
pin("riding-lizard", yugI6.x + 12, yugI6.z - 6, "yug-i6", 8);
denPair("yug-cursemaker", "yug-fighter", grottoCell(8, 9), "yug-i9");
// One orc party in the map-2 hall. They face inward, so a fight in the middle links and a pull out of sight does not.
denPack(["yug-serjeant", "yug-grunt", "yug-neck", "yug-chuck"], grottoHall(), "yug-hall");
denPair("stealth-bat", "", grottoHall(), "yug-night");

const westOrigin = ronCell(0, 0);

function westColRow(x: number, z: number): { col: number; row: number } {
  return { col: (x - westOrigin.x) / 48 + 0.5, row: (z - westOrigin.z) / 48 + 0.5 };
}

function westCount(id: string): number {
  return born.get(id) ?? 0;
}

function coastSpots(step: number, ox: number, oz: number): { x: number; z: number }[] {
  const out: { x: number; z: number }[] = [];
  for (let x = -140 + ox; x <= 220; x += step) {
    for (let z = 330 + oz; z <= 830; z += step) {
      if (zoneTouch(x, z) || ronfaureWet(x, z) || !inRonfaure(x, z, 1.5)) continue;
      out.push({ x, z });
    }
  }
  return out;
}

function onBank(x: number, z: number): boolean {
  if (ronfaureWet(x, z) || !inRonfaure(x, z, 1.4)) return false;
  for (let i = 0; i < 8; i++) {
    const ang = (i / 8) * Math.PI * 2;
    if (ronfaureWet(x + Math.cos(ang) * 5.5, z + Math.sin(ang) * 5.5)) return true;
  }
  return false;
}

function millPoints(body: FieldBody, roam: number): void {
  const out = inOrc(body.spawnX, body.spawnZ, 0);
  body.points = orbit(body.spawnX, body.spawnZ, roam, out, specOf(body.species).detect.aggressive);
}

/** Another same-family sight camp must sit outside the cone, or the pull chains. */
function sightCampClear(x: number, z: number, spec: Species, link: string): boolean {
  if (!spec.links || !spec.detect.sight) return true;
  const blocked = visitGrid(campBuckets, x, z, 2, (index) => {
    const other = live[index];
    if (!other || other.link === link) return false;
    const mate = specOf(other.species);
    if (!mate.links || !mate.detect.sight || mate.family !== spec.family) return false;
    if (!windowsShare(spec.window, mate.window)) return false;
    return Math.hypot(other.spawnX - x, other.spawnZ - z) < SIGHT_CAMP;
  });
  return !blocked;
}

let fillSerial = 0;

function tryParty(ids: string[], x: number, z: number): boolean {
  if (!ids.length) return false;
  const link = `fill-${fillSerial + 1}`;
  const roam = ids.length > 1 ? PACK_ROAM : inOrc(x, z, 0) ? ROAM_OUT : ROAM_FIELD;
  const spots: { id: string; x: number; z: number }[] = [{ id: ids[0], x, z }];
  const seed = specOf(ids[0]);
  if (!canStand(x, z, seed, roam, link) || !sightCampClear(x, z, seed, link)) return false;
  for (let i = 1; i < ids.length; i++) {
    const spec = specOf(ids[i]);
    let found = false;
    const rads = [PACK_GAP + 0.45, PACK_GAP + 1.7];
    for (const rad of rads) {
      const turns = Math.max(6, ids.length);
      for (let turn = 0; turn < 8; turn++) {
        const ang = (i / turns) * Math.PI * 2 + turn * 0.55;
        const mx = x + Math.cos(ang) * rad;
        const mz = z + Math.sin(ang) * rad;
        if (!canStand(mx, mz, spec, roam, link) || !sightCampClear(mx, mz, spec, link)) continue;
        let crowded = false;
        for (const spot of spots) {
          if (Math.hypot(spot.x - mx, spot.z - mz) < PACK_GAP) crowded = true;
        }
        if (crowded) continue;
        spots.push({ id: ids[i], x: mx, z: mz });
        found = true;
        break;
      }
      if (found) break;
    }
    if (!found) return false;
  }
  fillSerial += 1;
  const before = live.length;
  for (const spot of spots) addBody(spot.id, spot.x, spot.z, link, "");
  if (ids.length > 1) {
    for (let i = before; i < live.length; i++) millPoints(live[i], PACK_ROAM);
  }
  return true;
}

function placeHerd(id: string, x: number, z: number, cluster: number): number {
  const spec = specOf(id);
  const want = cluster;
  const offsets = [
    { x: 0, z: 0 },
    { x: 6.1, z: 0.4 },
    { x: -2.6, z: 5.6 },
    { x: 3.2, z: -5.4 },
  ];
  let placed = 0;
  for (const off of offsets) {
    if (placed >= want) break;
    const px = x + off.x;
    const pz = z + off.z;
    if (!canStand(px, pz, spec, HERD_ROAM, "")) continue;
    addBody(id, px, pz, "", "");
    placed += 1;
  }
  return placed;
}

function visitOrder(n: number, salt: number): number[] {
  const order: number[] = [];
  for (let i = 0; i < n; i++) order.push(i);
  let s = salt >>> 0;
  for (let i = n - 1; i > 0; i--) {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    const j = s % (i + 1);
    const swap = order[i];
    order[i] = order[j];
    order[j] = swap;
  }
  return order;
}

function spreadParties(
  recipes: { ids: string[]; region?: (x: number, z: number) => boolean }[],
  fits: (ids: string[]) => boolean,
  pending: () => boolean,
): void {
  const grid = coastSpots(8, 1, 2);
  if (!grid.length || !pending()) return;
  for (const index of visitOrder(grid.length, 0x5a17 + fillSerial)) {
    if (!pending()) return;
    const spot = grid[index];
    for (const recipe of recipes) {
      if (!fits(recipe.ids)) continue;
      if (recipe.region && !recipe.region(spot.x, spot.z)) continue;
      if (tryParty(recipe.ids, spot.x, spot.z)) break;
    }
  }
}

function spreadHerds(
  jobs: { id: string; want: number; cluster: number; region?: (x: number, z: number) => boolean }[],
  step: number,
): void {
  const grid = coastSpots(step, 0, 0);
  if (!grid.length) return;
  const pending = () => jobs.some((job) => westCount(job.id) < job.want);
  for (const index of visitOrder(grid.length, 0x91c3 + step)) {
    if (!pending()) return;
    const spot = grid[index];
    let best: (typeof jobs)[number] | null = null;
    let score = -1;
    for (const job of jobs) {
      const have = westCount(job.id);
      if (have >= job.want) continue;
      if (job.region && !job.region(spot.x, spot.z)) continue;
      const deficit = (job.want - have) / job.want;
      if (deficit > score) {
        score = deficit;
        best = job;
      }
    }
    if (!best) continue;
    const room = best.want - westCount(best.id);
    placeHerd(best.id, spot.x, spot.z, Math.min(best.cluster, room));
  }
}

/** Top the coast up to the FFXIclopedia standing list. Placeholders stay where they were camped. */
function fillWest(): void {
  const cell = (x: number, z: number) => westColRow(x, z);
  const orcSide = (x: number, z: number) => {
    const at = cell(x, z);
    return at.col >= 3.7 && at.col <= 6.9 && at.row >= 3.4 && at.row <= 9.4;
  };
  const orcWider = (x: number, z: number) => {
    const at = cell(x, z);
    return at.col >= 3.7 && at.col <= 7.6 && at.row >= 3.4 && at.row <= 10.2;
  };
  const southMeadow = (x: number, z: number) => {
    const at = cell(x, z);
    return at.row >= 8.7 && at.col >= 4.1 && at.col <= 8.6;
  };
  const southWider = (x: number, z: number) => cell(x, z).row >= 7.6;
  const central = (x: number, z: number) => {
    const at = cell(x, z);
    return at.col >= 4.1 && at.col <= 9.1 && at.row >= 4.4 && at.row <= 10.2;
  };
  const gates = (x: number, z: number) => {
    const row = cell(x, z).row;
    return row <= 6.2 || row >= 9.3;
  };
  const orcNeed = () =>
    westCount("orcish-fodder") < 12 || westCount("orcish-grappler") < 9 || westCount("orcish-mesmerizer") < 9;
  const orcRecipe = (ids: string[]) => ids.every((id) => westCount(id) < (id === "orcish-fodder" ? 12 : 9));
  const orcPatterns = [
    ["orcish-fodder", "orcish-grappler", "orcish-mesmerizer"],
    ["orcish-fodder", "orcish-grappler"],
    ["orcish-fodder", "orcish-mesmerizer"],
    ["orcish-grappler", "orcish-mesmerizer"],
    ["orcish-fodder"],
    ["orcish-grappler"],
    ["orcish-mesmerizer"],
  ];
  spreadParties(
    orcPatterns.map((ids) => ({ ids, region: orcSide })),
    orcRecipe,
    orcNeed,
  );
  if (orcNeed()) {
    spreadParties(
      orcPatterns.map((ids) => ({ ids, region: orcWider })),
      orcRecipe,
      orcNeed,
    );
  }
  const sheepNeed = () => westCount("wild-sheep") < 32;
  const sheepRecipe = (ids: string[]) => westCount("wild-sheep") + ids.length <= 32;
  spreadParties(
    [
      { ids: ["wild-sheep", "wild-sheep", "wild-sheep", "wild-sheep"], region: southMeadow },
      { ids: ["wild-sheep", "wild-sheep", "wild-sheep"], region: southMeadow },
      { ids: ["wild-sheep", "wild-sheep"], region: southMeadow },
    ],
    sheepRecipe,
    sheepNeed,
  );
  if (sheepNeed()) {
    spreadParties(
      [
        { ids: ["wild-sheep", "wild-sheep", "wild-sheep"], region: southWider },
        { ids: ["wild-sheep", "wild-sheep"], region: southWider },
        { ids: ["wild-sheep"], region: southWider },
      ],
      sheepRecipe,
      sheepNeed,
    );
  }
  const gobNeed = () => westCount("goblin-thug") < 18 || westCount("goblin-weaver") < 15;
  const gobRecipe = (ids: string[]) => {
    const thug = ids.filter((id) => id === "goblin-thug").length;
    const weaver = ids.filter((id) => id === "goblin-weaver").length;
    return westCount("goblin-thug") + thug <= 18 && westCount("goblin-weaver") + weaver <= 15;
  };
  spreadParties(
    [
      { ids: ["goblin-thug", "goblin-weaver"] },
      { ids: ["goblin-thug", "goblin-thug"] },
      { ids: ["goblin-weaver"] },
      { ids: ["goblin-thug"] },
    ],
    gobRecipe,
    gobNeed,
  );
  const beetleNeed = () => westCount("scarab-beetle") < 22;
  spreadParties(
    [
      { ids: ["scarab-beetle", "scarab-beetle"], region: central },
      { ids: ["scarab-beetle"], region: central },
    ],
    (ids) => westCount("scarab-beetle") + ids.length <= 22,
    beetleNeed,
  );
  if (beetleNeed()) {
    spreadParties(
      [
        { ids: ["scarab-beetle", "scarab-beetle"] },
        { ids: ["scarab-beetle"] },
      ],
      (ids) => westCount("scarab-beetle") + ids.length <= 22,
      beetleNeed,
    );
  }
  const fungNeed = () => westCount("forest-funguar") < 15;
  spreadParties(
    [
      { ids: ["forest-funguar", "forest-funguar"], region: central },
      { ids: ["forest-funguar"], region: central },
    ],
    (ids) => westCount("forest-funguar") + ids.length <= 15,
    fungNeed,
  );
  if (fungNeed()) {
    spreadParties(
      [{ ids: ["forest-funguar", "forest-funguar"] }, { ids: ["forest-funguar"] }],
      (ids) => westCount("forest-funguar") + ids.length <= 15,
      fungNeed,
    );
  }
  const fisherNeed = () => westCount("goblin-fisher") < 4;
  spreadParties(
    [{ ids: ["goblin-fisher"], region: onBank }],
    () => westCount("goblin-fisher") < 4,
    fisherNeed,
  );
  spreadHerds(
    [
      { id: "forest-hare", want: 75, cluster: 3 },
      { id: "wild-rabbit", want: 27, cluster: 3, region: gates },
      { id: "carrion-worm", want: 36, cluster: 3 },
      { id: "tunnel-worm", want: 13, cluster: 2, region: gates },
    ],
    12,
  );
  spreadHerds(
    [
      { id: "forest-hare", want: 75, cluster: 2 },
      { id: "wild-rabbit", want: 27, cluster: 2 },
      { id: "carrion-worm", want: 36, cluster: 2 },
      { id: "tunnel-worm", want: 13, cluster: 1 },
    ],
    8,
  );
  const crabSpots = coastSpots(4, 0.5, 0.5).filter((spot) => onBank(spot.x, spot.z));
  for (const spot of crabSpots) {
    if (westCount("river-crab") >= 8) break;
    if (!canStand(spot.x, spot.z, specOf("river-crab"), HERD_ROAM, "")) continue;
    addBody("river-crab", spot.x, spot.z, "", "");
  }
  const mouseNeed = () => westCount("mouse-bat") < 26;
  spreadParties(
    [
      { ids: ["mouse-bat", "mouse-bat"] },
      { ids: ["mouse-bat"] },
    ],
    (ids) => westCount("mouse-bat") + ids.length <= 26,
    mouseNeed,
  );
  spreadHerds(
    [
      { id: "ding-bats", want: 42, cluster: 3 },
      { id: "enchanted-bones", want: 8, cluster: 2 },
      { id: "enchanted-bones-drk", want: 7, cluster: 2 },
      { id: "tainted-hound", want: 7, cluster: 1 },
    ],
    14,
  );
  spreadHerds(
    [
      { id: "ding-bats", want: 42, cluster: 2 },
      { id: "enchanted-bones", want: 8, cluster: 1 },
      { id: "enchanted-bones-drk", want: 7, cluster: 1 },
      { id: "tainted-hound", want: 7, cluster: 1 },
    ],
    8,
  );
}

// West Ronfaure. Retail standing counts, in herds and parties rather than one body to a field.
camp("wild-rabbit", 6, 4, 3, "rabbit");
camp("wild-rabbit", 7, 4, 3, "rabbit");
camp("wild-rabbit", 7, 5, 3, "rabbit");
camp("wild-rabbit", 6, 3, 2, "rabbit");
camp("tunnel-worm", 5, 4, 2, "worm");
camp("tunnel-worm", 6, 5, 2, "worm");
camp("tunnel-worm", 4, 6, 2, "worm");
camp("forest-hare", 5, 5, 3, "hare");
camp("forest-hare", 5, 6, 3, "hare");
camp("forest-hare", 4, 7, 2, "hare");
camp("forest-hare", 6, 7, 3, "hare");
camp("forest-hare", 5, 8, 2, "hare");
camp("forest-hare", 6, 8, 2, "hare", "jack");
camp("forest-hare", 7, 8, 2, "hare", "jack");
camp("forest-hare", 7, 9, 2, "hare", "jack");
camp("carrion-worm", 5, 9, 2, "carrion");
camp("carrion-worm", 6, 6, 2, "carrion");
camp("carrion-worm", 7, 3, 2, "carrion");
camp("forest-funguar", 5, 7, 2, "funguar-f8");
camp("forest-funguar", 6, 9, 2, "funguar-g10");
camp("forest-funguar", 8, 6, 2, "funguar-i7");
// Fungus Beetle's placeholder is the Scarab Beetle in H-8. The NM pops toward I-8.
camp("scarab-beetle", 7, 7, 2, "beetle-h8", "beetle");
camp("scarab-beetle", 4, 9, 2, "beetle-e10");
camp("scarab-beetle", 8, 8, 2, "beetle-i9");
party([{ id: "orcish-fodder" }, { id: "orcish-grappler" }, { id: "orcish-mesmerizer" }], 4, 4, "orc-e5");
party([{ id: "orcish-fodder" }, { id: "orcish-mesmerizer" }], 5, 3, "orc-f4");
party([{ id: "orcish-grappler" }, { id: "orcish-mesmerizer" }], 4, 8, "orc-e9");
party([{ id: "goblin-thug" }, { id: "goblin-weaver" }], 4, 10, "gob-e11");
party([{ id: "goblin-thug" }, { id: "goblin-weaver" }], 7, 10, "gob-h11");
party([{ id: "goblin-thug" }, { id: "goblin-weaver" }], 8, 9, "gob-i10");
camp("goblin-digger", 8, 7, 1, "gob-digger");
pin("goblin-fisher", 102, 594, "fisher");
pin("goblin-fisher", 118, 606, "fisher");
pin("goblin-fisher", 86, 712, "fisher");
pin("river-crab", 58, 724, "crab");
pin("river-crab", 88, 730, "crab");
pin("river-crab", 72, 738, "crab");
pin("river-crab", 96, 594, "crab");
pin("river-crab", 124, 606, "crab");
pin("river-crab", 48, 548, "crab");
camp("wild-sheep", 5, 10, 3, "sheep-f11");
camp("wild-sheep", 6, 10, 3, "sheep-g11");
camp("wild-sheep", 6, 11, 2, "sheep-g12");
camp("ding-bats", 5, 6, 2, "ding");
camp("ding-bats", 6, 7, 2, "ding");
camp("ding-bats", 4, 7, 2, "ding");
camp("ding-bats", 5, 8, 2, "ding");
camp("ding-bats", 7, 8, 2, "ding");
camp("mouse-bat", 5, 7, 2, "mouse-f8");
camp("mouse-bat", 6, 8, 2, "mouse-g9");
camp("mouse-bat", 5, 5, 2, "mouse-f6");
camp("mouse-bat", 6, 9, 2, "mouse-g10");
camp("enchanted-bones", 4, 7, 2, "bones");
camp("enchanted-bones", 6, 6, 2, "bones");
camp("enchanted-bones-drk", 5, 9, 2, "bones");
camp("enchanted-bones", 4, 9, 1, "bones-mon");
camp("tainted-hound", 6, 9, 1, "hound");
camp("tainted-hound", 5, 8, 1, "hound");
camp("tainted-hound", 7, 7, 1, "hound");
camp("tainted-hound", 5, 10, 1, "hound");
let bombs = 0;
for (const [x, z] of [
  [20, 560],
  [-40, 640],
  [150, 700],
  [80, 660],
  [0, 520],
] as const) {
  if (bombs >= 3) break;
  const before = live.length;
  pin("bomb", x, z, "bomb");
  if (live.length > before) bombs += 1;
}
const amanitaSpot = ronCell(7, 6);
pin("amanita", amanitaSpot.x + 8, amanitaSpot.z - 6, "amanita", 12);
fillWest();

const g7 = ghelsbaCell(6, 6);
const g6 = ghelsbaCell(6, 5);
const f7 = ghelsbaCell(5, 6);
const f9 = ghelsbaCell(5, 8);
const g9 = ghelsbaCell(6, 8);
const f10 = ghelsbaCell(5, 9);
const g10 = ghelsbaCell(6, 9);
const h6 = ghelsbaCell(7, 5);
const h7 = ghelsbaCell(7, 6);
const h8 = ghelsbaCell(7, 7);
const i6 = ghelsbaCell(8, 5);
const i7 = ghelsbaCell(8, 6);
const i9 = ghelsbaCell(8, 8);
const j6 = ghelsbaCell(9, 5);
const j9 = ghelsbaCell(9, 8);
// West beasts, then one orc pair to a room. The J-11 / H-11 walk in from Ronfaure stays empty.
claimOut(g6, 16, "watch-lizard", 2, "liz-g6");
claimOut(f7, 14, "watch-lizard", 2, "liz-f7");
claimOut(f10, 12, "watch-lizard", 1, "liz-f10");
claimOut(g9, 14, "toadstool", 2, "toad-g9");
claimOut(f9, 14, "spectacled-bats", 2, "spec-f9");
claimOut(g10, 14, "cheiroptera", 2, "bat-g10");
claimOut({ x: i6.x + 4, z: i6.z + 2 }, 14, "ghelsba-pugil", 1, "pug-i6");
claimOut({ x: i7.x + 4, z: i7.z }, 14, "ghelsba-pugil", 1, "pug-i7");
// Thousandarm Deshglesh lotteries off the orcs toward J-6 / J-7.
claimOut(h8, 14, "ghelsba-fodder", 1, "orc-h8", "desh");
claimOut(h8, 14, "ghelsba-grappler", 1, "orc-h8");
claimOut(h8, 14, "ghelsba-mesmerizer", 1, "orc-h8");
claimOut(h7, 14, "ghelsba-mesmerizer", 1, "orc-h7");
claimOut(h7, 14, "ghelsba-grappler", 1, "orc-h7");
claimOut(g7, 14, "ghelsba-fodder", 1, "orc-g7");
claimOut(g7, 14, "ghelsba-mesmerizer", 1, "orc-g7");
claimOut(h6, 14, "ghelsba-grunt", 1, "orc-h6", "desh");
claimOut(h6, 14, "ghelsba-neck", 1, "orc-h6");
claimOut(i7, 14, "ghelsba-chuck", 1, "orc-i7", "desh");
claimOut(i7, 14, "ghelsba-neck", 1, "orc-i7");
claimOut(i6, 16, "orcish-stonelauncher", 1, "stone");
claimOut(j6, 14, "orcish-wallbreacher", 1, "breach");
claimOut(i9, 14, "orcish-barricader", 1, "barricade");
claimOut(j9, 14, "warchief-vatgit", 1, "vatgit");
if (claimOut(ghelsbaCell(8, 9), 16, "bloody-vrukwuk", 1, "camp-nm") < 1) {
  claimOut(f7, 20, "bloody-vrukwuk", 1, "camp-nm");
}

function denSpots(step: number, ok: (x: number, z: number) => boolean, x0: number, x1: number, z0: number, z1: number): { x: number; z: number }[] {
  const out: { x: number; z: number }[] = [];
  for (let x = x0; x <= x1; x += step) {
    for (let z = z0; z <= z1; z += step) if (ok(x, z)) out.push({ x, z });
  }
  return out;
}

type DenRecipe = { ids: string[]; region?: (x: number, z: number) => boolean };

function groupDeficit(caps: Record<string, number>): number {
  let worst = 0;
  for (const id of Object.keys(caps)) {
    const want = caps[id] ?? 0;
    if (want <= 0) continue;
    const gap = (want - westCount(id)) / want;
    if (gap > worst) worst = gap;
  }
  return worst;
}

/** Each pass seats the family furthest under its FFXIclopedia count, so low orcs cannot eat the den. */
function spreadMix(
  grid: { x: number; z: number }[],
  groups: { recipes: DenRecipe[]; caps: Record<string, number> }[],
): void {
  if (!grid.length) return;
  for (const index of visitOrder(grid.length, 0x2c91 + grid.length + fillSerial)) {
    const open = groups.filter((group) => capPending(group.caps)());
    if (!open.length) return;
    open.sort((a, b) => groupDeficit(b.caps) - groupDeficit(a.caps));
    const spot = grid[index];
    for (const group of open) {
      let seated = false;
      for (const recipe of group.recipes) {
        if (!capFits(group.caps)(recipe.ids)) continue;
        if (recipe.region && !recipe.region(spot.x, spot.z)) continue;
        if (tryParty(recipe.ids, spot.x, spot.z)) {
          seated = true;
          break;
        }
      }
      if (seated) break;
    }
  }
}

function capFits(caps: Record<string, number>): (ids: string[]) => boolean {
  return (ids) => {
    const need: Record<string, number> = {};
    for (const id of ids) need[id] = (need[id] ?? 0) + 1;
    for (const id of Object.keys(need)) if (westCount(id) + (need[id] ?? 0) > (caps[id] ?? 0)) return false;
    return true;
  };
}

function capPending(caps: Record<string, number>): () => boolean {
  return () => {
    for (const id of Object.keys(caps)) if (westCount(id) < (caps[id] ?? 0)) return true;
    return false;
  };
}

function trios(ids: [string, string, string]): { ids: string[] }[] {
  const [a, b, c] = ids;
  return [
    { ids: [a, b, c] },
    { ids: [a, b] },
    { ids: [a, c] },
    { ids: [b, c] },
    { ids: [a, a] },
    { ids: [b, b] },
    { ids: [c, c] },
    { ids: [a] },
    { ids: [b] },
    { ids: [c] },
  ];
}

/** FFXIclopedia standing lists for the three Ghelsba dens. The scaled rooms stop at the gates. */
function fillDens(): void {
  const dryOut = (x: number, z: number) => inGhelsba(x, z, 0.8) && orcDry(x, z, 0.45) && !underHut(x, z);
  const dryFort = (x: number, z: number) => inFort(x, z, 0.8) && orcDry(x, z, 0.45);
  const dryYug = (x: number, z: number) => inYughott(x, z, 0.8) && orcDry(x, z, 0.45);
  const outGrid = denSpots(6, dryOut, -1800, -700, 80, 1100);
  const fortGrid = denSpots(6, dryFort, -1800, -700, 900, 1680);
  const yugGrid = denSpots(6, dryYug, -1500, -360, 40, 1200);
  const bank = (x: number, z: number) => {
    if (!dryOut(x, z)) return false;
    for (let i = 0; i < 8; i++) {
      const ang = (i / 8) * Math.PI * 2;
      if (inGhelsba(x + Math.cos(ang) * 8, z + Math.sin(ang) * 8, 0) && !orcDry(x + Math.cos(ang) * 8, z + Math.sin(ang) * 8, 0)) return true;
    }
    return false;
  };
  const east = (x: number, z: number) => x >= ghelsbaCell(7.5, 6).x;
  const lowTrio = trios(["ghelsba-fodder", "ghelsba-grappler", "ghelsba-mesmerizer"]);
  const highTrio = trios(["ghelsba-grunt", "ghelsba-neck", "ghelsba-chuck"]);
  spreadMix(outGrid, [
    { recipes: lowTrio, caps: { "ghelsba-fodder": 37, "ghelsba-grappler": 38, "ghelsba-mesmerizer": 34 } },
    { recipes: highTrio, caps: { "ghelsba-grunt": 22, "ghelsba-neck": 33, "ghelsba-chuck": 19 } },
    { recipes: [{ ids: ["orcish-stonelauncher"], region: east }], caps: { "orcish-stonelauncher": 10 } },
    { recipes: [{ ids: ["watch-lizard", "watch-lizard"] }, { ids: ["watch-lizard"] }], caps: { "watch-lizard": 18 } },
    { recipes: [{ ids: ["toadstool", "toadstool"] }, { ids: ["toadstool"] }], caps: { toadstool: 13 } },
    { recipes: [{ ids: ["spectacled-bats"] }], caps: { "spectacled-bats": 11 } },
    { recipes: [{ ids: ["cheiroptera"] }], caps: { cheiroptera: 21 } },
    { recipes: [{ ids: ["ghelsba-pugil"], region: bank }], caps: { "ghelsba-pugil": 15 } },
  ]);

  const fortLow = trios(["fort-fodder", "fort-grappler", "fort-mesmerizer"]);
  const fortHigh = trios(["fort-grunt", "fort-neck", "fort-chuck"]);
  spreadMix(fortGrid, [
    { recipes: fortLow, caps: { "fort-fodder": 19, "fort-grappler": 20, "fort-mesmerizer": 16 } },
    { recipes: fortHigh, caps: { "fort-grunt": 32, "fort-neck": 33, "fort-chuck": 29 } },
    {
      recipes: [
        { ids: ["fort-cursemaker", "fort-fighter"] },
        { ids: ["fort-cursemaker", "fort-serjeant"] },
        { ids: ["fort-cursemaker"] },
        { ids: ["fort-fighter"] },
        { ids: ["fort-serjeant"] },
      ],
      caps: { "fort-cursemaker": 3, "fort-fighter": 2, "fort-serjeant": 1 },
    },
    { recipes: [{ ids: ["orcish-flamethrower"] }], caps: { "orcish-flamethrower": 8 } },
    { recipes: [{ ids: ["sentry-lizard", "sentry-lizard"] }, { ids: ["sentry-lizard"] }], caps: { "sentry-lizard": 8 } },
    { recipes: [{ ids: ["fort-spectacled", "fort-spectacled"] }, { ids: ["fort-spectacled"] }], caps: { "fort-spectacled": 15 } },
    { recipes: [{ ids: ["fort-cheiroptera"] }], caps: { "fort-cheiroptera": 20 } },
  ]);

  const yugMid = trios(["yug-grunt", "yug-neck", "yug-chuck"]);
  const yugTop = trios(["yug-cursemaker", "yug-fighter", "yug-serjeant"]);
  spreadMix(yugGrid, [
    { recipes: yugMid, caps: { "yug-grunt": 32, "yug-neck": 29, "yug-chuck": 30 } },
    { recipes: yugTop, caps: { "yug-cursemaker": 18, "yug-fighter": 7, "yug-serjeant": 2 } },
    { recipes: [{ ids: ["grotto-bats", "grotto-bats"] }, { ids: ["grotto-bats"] }], caps: { "grotto-bats": 27 } },
    { recipes: [{ ids: ["stealth-bat", "stealth-bat"] }, { ids: ["stealth-bat"] }], caps: { "stealth-bat": 19 } },
    { recipes: [{ ids: ["riding-lizard", "riding-lizard"] }, { ids: ["riding-lizard"] }], caps: { "riding-lizard": 9 } },
  ]);
}

function find(id: string | null): FieldBody | null {
  if (!id) return null;
  return live.find((body) => body.id === id) ?? null;
}

function up(spec: Species, hour: number, fog: boolean): boolean {
  return ronfaureWindow(spec.window, hour, fog);
}

export function liveField(): readonly FieldBody[] {
  return live;
}

export function readField(): { id: string; name: string; hp: number; max: number; level: number; claimed: boolean; x: number; z: number; yaw: number; look: string; nm: boolean } | null {
  const body = find(selectedId);
  if (!body || body.hp <= 0 || body.away || buried(body)) return null;
  return { id: body.id, name: body.name, hp: body.hp, max: body.maxHp, level: body.level, claimed: claimedId === body.id, x: body.x, z: body.z, yaw: body.yaw, look: body.look, nm: body.nm };
}

export function fieldPlateY(look: string): number {
  if (look === "jack") return 3.05;
  if (look === "bat") return 3.2;
  if (look === "orc") return 3.15;
  if (look === "amanita") return 2.75;
  if (look === "skeleton" || look === "bomb") return 2.6;
  if (look === "sheep") return 2.45;
  if (look === "bats") return 2.55;
  if (look === "goblin") return 2.25;
  if (look === "hound" || look === "fungus-beetle" || look === "funguar") return 1.8;
  if (look === "worm") return 1.85;
  if (look === "rabbit") return 2.45;
  if (look === "crab" || look === "pugil") return 1.6;
  if (look === "lizard") return 1.7;
  if (look === "warmachine") return 2.5;
  if (look === "ghost" || look === "hecteyes" || look === "ahriman") return 2.7;
  if (look === "weapon") return 2.9;
  if (look === "sapling") return 2.85;
  if (look === "scorpion") return 1.7;
  if (look === "slime") return 1.85;
  return 1.45;
}

export function nearestField(x: number, z: number, limit: number, maxDist: number, corpses = false): FieldBody[] {
  if (maxDist <= 0) return [];
  const rows: { body: FieldBody; d: number }[] = [];
  for (const body of live) {
    const dying = corpses && body.hp <= 0 && body.mode === "dead" && body.animLeft > 0;
    if (!dying && (body.hp <= 0 || body.away || body.retired || buried(body))) continue;
    const d = Math.hypot(body.x - x, body.z - z);
    if (d <= maxDist) rows.push({ body, d });
  }
  rows.sort((a, b) => a.d - b.d);
  return rows.slice(0, limit).map((row) => row.body);
}

export function selectField(id: string | null): "cleared" | "selected" | "claimed" | "far" {
  let result: "cleared" | "selected" | "claimed" | "far";
  if (!id) {
    release();
    selectedId = null;
    result = "cleared";
  } else {
    const body = find(id);
    if (!body || body.hp <= 0 || body.away || buried(body)) result = selectedId ? "selected" : "cleared";
    else if (selectedId === id && claimedId !== id) {
      result = beginMelee(body) === "claim" ? "claimed" : "far";
    } else {
      if (claimedId && claimedId !== id) release();
      selectedId = id;
      result = claimedId === id ? "claimed" : "selected";
    }
  }
  refreshFieldPlate();
  return result;
}

export function clearField(): void {
  release();
  selectedId = null;
  refreshFieldPlate();
}

/** Stop your auto-attack. The monster does not drop hate and does not walk home. */
function release(): void {
  claimedId = null;
  playerClock = 0;
  refreshFieldPlate();
}

function fieldGap(body: FieldBody): number {
  const input = lastInput;
  return Math.hypot((input?.playerX ?? 0) - body.x, (input?.playerZ ?? 0) - body.z);
}

/** Where a melee swing still connects. A weapon skill is one yalm farther. */
export function fieldMeleeReach(weaponReach: number | null | undefined): number {
  return Math.max(MELEE, (weaponReach ?? 2) - 0.15) + 0.35;
}

function hitReach(input: FieldInput | null): number {
  return fieldMeleeReach(input?.sheet?.reach);
}

function swingDelay(input: FieldInput | null): number {
  const seconds = input?.sheet?.seconds || (input?.sheet?.delay ? input.sheet.delay / 60 : 3);
  return Math.max(0.4, seconds);
}

/** Weapon auto-attack range. A hit connects only inside this. */
function meleeOf(body: FieldBody): boolean {
  return fieldGap(body) <= hitReach(lastInput);
}

function arm(body: FieldBody): void {
  claimedId = body.id;
  selectedId = body.id;
  playerClock = swingDelay(lastInput);
  refreshFieldPlate();
}

/** Auto-attack countdown while a field target is engaged. Null when the weapon is away. */
export function fieldSwingClock(): { left: number; delay: number } | null {
  if (!claimedId) return null;
  const delay = swingDelay(lastInput);
  return { left: Math.max(0, playerClock), delay };
}

/** A claim. Too weak still turns and fights. It only refuses to aggro or link on its own. */
function provoke(body: FieldBody): void {
  if (body.mode === "dead" || body.hp <= 0) return;
  body.claimed = true;
  body.hadAggro = true;
  body.mode = "chase";
}

/**
 * Engage draws the weapon out to 30 yalms and starts the timer.
 * It does not pull, and it does not move you. The monster turns only in melee.
 */
function beginMelee(body: FieldBody): "claim" | "far" {
  if (fieldGap(body) > AUTO_ATTACK) return "far";
  arm(body);
  if (meleeOf(body)) provoke(body);
  return "claim";
}

function wallBetween(ax: number, az: number, bx: number, bz: number): boolean {
  const dist = Math.hypot(bx - ax, bz - az);
  const steps = Math.max(1, Math.ceil(dist / 1.1));
  for (let i = 1; i < steps; i++) {
    const t = i / steps;
    if (solidAt(ax + (bx - ax) * t, az + (bz - az) * t)) return true;
  }
  return false;
}

/** Same family, and this mob can see or hear that fight the way it would aggro. */
function noticesFight(idle: FieldBody, foe: FieldBody): boolean {
  const spec = specOf(idle.species);
  const other = specOf(foe.species);
  const pet = idle.link !== "" && idle.link === foe.link && spec.id === "pass-bats" && other.id === "pass-pathfinder";
  if (!pet && (!spec.links || !other.links || spec.family !== other.family)) return false;
  const dx = foe.x - idle.x;
  const dz = foe.z - idle.z;
  const dist = Math.hypot(dx, dz);
  if (dist <= 0.4) return true;
  if (wallBetween(idle.x, idle.z, foe.x, foe.z)) return false;
  if (spec.detect.sound || spec.detect.trueSound) {
    const range = spec.detect.trueSound ? TRUE_SOUND_RANGE : SOUND_RANGE;
    if (dist <= range) return true;
  }
  if (spec.detect.sight) {
    const nose = forward(idle.yaw);
    const ang = angleFromForward(nose.x, nose.z, dx, dz);
    if (dist <= SIGHT_RANGE && (spec.detect.trueSight || ang <= SIGHT_ANGLE)) return true;
  }
  return false;
}

function tickLinks(playerLevel: number, events: FieldEvent[]): void {
  const fighting = live.filter((body) => body.mode === "chase" && body.hp > 0 && !body.away && !body.retired && (fightAge.get(body.id) ?? 0) >= LINK_DELAY);
  if (!fighting.length) return;
  for (const idle of live) {
    if (idle.mode !== "roam" || idle.hp <= 0 || idle.away || idle.retired) continue;
    if (!specOf(idle.species).links && specOf(idle.species).id !== "pass-bats") continue;
    if (checkCon(playerLevel, idle.level) === "too-weak") continue;
    for (const foe of fighting) {
      if (foe.id === idle.id) continue;
      if (checkCon(playerLevel, foe.level) === "too-weak") continue;
      if (!noticesFight(idle, foe)) continue;
      idle.mode = "chase";
      idle.claimed = true;
      idle.hadAggro = true;
      events.push({ type: "log", text: `The ${idle.name} links!`, tone: "info" });
      break;
    }
  }
}

function forward(yaw: number): { x: number; z: number } {
  return { x: -Math.sin(yaw), z: -Math.cos(yaw) };
}

function moveToward(body: FieldBody, tx: number, tz: number, pace: number, dt: number, stop: number): void {
  const dx = tx - body.x;
  const dz = tz - body.z;
  const dist = Math.hypot(dx, dz);
  if (dist > 0.08) body.yaw = turnTo(body.yaw, faceYaw(body.x, body.z, tx, tz), FACE_TURN * dt);
  if (dist <= stop) return;
  const step = Math.min(pace * dt, dist - stop);
  const nx = body.x + (dx / dist) * step;
  const nz = body.z + (dz / dist) * step;
  const tries = [dry(nx, nz), dry(nx, body.z), dry(body.x, nz)];
  let next: { x: number; z: number } | null = null;
  for (const tryAt of tries) {
    if (footBlocked(tryAt.x, tryAt.z)) continue;
    next = tryAt;
    break;
  }
  if (!next) return;
  body.moved += Math.hypot(next.x - body.x, next.z - body.z);
  body.x = next.x;
  body.z = next.z;
}

function rollLoot(spec: Species, th: number, gilfinder: boolean, level: number, rng: () => number, held?: { items?: ReadonlySet<string>; gil?: boolean }): { gil: number; crystal: string | null; items: FieldLoot[] } {
  const items: FieldLoot[] = [];
  const slots = new Map<string, Drop[]>();
  for (const drop of spec.drops) {
    if (held?.items?.has(drop.id)) continue;
    if (drop.slot) {
      const pile = slots.get(drop.slot) ?? [];
      pile.push(drop);
      slots.set(drop.slot, pile);
      continue;
    }
    if (drop.always || (drop.tier && rng() < dropRate(drop.tier, th))) items.push({ id: drop.id, found: drop.found });
  }
  for (const pile of slots.values()) {
    const total = pile.reduce((sum, drop) => sum + Math.max(0, drop.weight ?? 1), 0);
    if (total <= 0) continue;
    let roll = rng() * total;
    let picked = pile[pile.length - 1];
    for (const drop of pile) {
      roll -= Math.max(0, drop.weight ?? 1);
      if (roll < 0) {
        picked = drop;
        break;
      }
    }
    if (picked) items.push({ id: picked.id, found: picked.found });
  }
  const gil = held?.gil ? 0 : Math.floor((level * 4 + rng() * (level * 2 + 1)) * (gilfinder ? 1.5 : 1));
  const crystal = rng() < 0.1 ? spec.crystal : null;
  return { gil, crystal, items };
}

function clampN(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

function magicSkill(job: Job, level: number): number {
  return level * (job === "BLM" ? 3 : job === "RDM" || job === "DRK" ? 2 : 1);
}

/** 20 / 35 / 50 levels above the caster resist to one half, one quarter, one eighth. */
function magicGap(casterLevel: number, targetLevel: number): number {
  const gap = targetLevel - casterLevel;
  if (gap >= 50) return 0.125;
  if (gap >= 35) return 0.25;
  if (gap >= 20) return 0.5;
  return 1;
}

/**
 * Monster nuke or enfeeble potency.
 * floor(dSTAT / 2) is added to the spell's base and cannot swing it by more
 * than half the base. Black Mage skill counts three times the level, Red
 * Mage and Dark Knight twice, everyone else once. That skill also feeds
 * magic accuracy. A wide level gap resists after the stat term.
 */
export function fieldMagicDamage(pot: number, casterStat: number, casterLevel: number, targetStat: number, targetLevel: number, job: Job): number {
  const skill = magicSkill(job, casterLevel);
  const dStat = casterStat - targetStat;
  const fromStat = clampN(Math.floor(dStat / 2), -Math.floor(pot * 0.5), Math.floor(pot * 1.25));
  let mult = magicGap(casterLevel, targetLevel);
  if (skill + dStatMagicAccuracy(dStat) + 10 < targetLevel * 3) mult *= 0.5;
  return Math.max(0, Math.floor((pot + fromStat + Math.floor(skill / 8)) * mult));
}

function magicConnects(body: FieldBody, casterStat: number, targetStat: number, targetLevel: number): boolean {
  if (magicGap(body.level, targetLevel) <= 0.125) return false;
  const skill = magicSkill(specOf(body.species).job, body.level);
  const acc = skill + dStatMagicAccuracy(casterStat - targetStat);
  const rate = clampN(50 + Math.floor((acc - targetLevel * 2) / 2), 8, 95);
  const cut = magicGap(body.level, targetLevel) < 1 ? 0.65 : 1;
  return Math.random() * 100 < rate * cut;
}

const BURST_COLOR: Record<string, number> = {
  Stone: 0xc4a05a,
  Poison: 0x6fbf63,
  Blind: 0x6d5c97,
  Dia: 0xf4e27a,
  "Dark Spore": 0x9a4ad0,
  "Bubble Shower": 0x6ec8ef,
  "Heat Wave": 0xe07a32,
  Drain: 0x8d3a5a,
  "Wild Carrot": 0x9adf78,
  "Dust Cloud": 0xcbb98a,
  "Stinking Gas": 0x8fbf6a,
  "Silence Gas": 0xc7d0bf,
  Spoil: 0x7dae62,
  "Black Cloud": 0x5c5670,
  "Sheep Song": 0xe6d2ff,
  "Self-Destruct": 0xff6a2a,
  "Fluid Toss": 0x8ec8ef,
  "Blood Drain": 0x8d3a5a,
  Suction: 0x8d3a5a,
  "Blood Saber": 0x8d3a5a,
  Fireball: 0xe07a32,
  "Aqua Ball": 0x6ec8ef,
  "Arm Cannon": 0xff6a2a,
  "Flame Armor": 0xff6a2a,
  "Stone Throw": 0xc4a05a,
  "Tail Blow": 0x8a9a62,
};

function landColor(move: Move | null): number {
  if (move && BURST_COLOR[move.name] != null) return BURST_COLOR[move.name] as number;
  if (!move) return 0xff4d57;
  if (move.kind === "heal") return 0x9adf78;
  if (move.kind === "magical" || move.anim === "cast") return 0xd7b4ff;
  if (move.kind === "status") return 0xffe38a;
  if (move.anim === "skill") return 0xe3c57a;
  return 0xff4d57;
}

function puff(events: FieldEvent[], x: number, z: number, color: number, scale: number): void {
  events.push({ type: "burst", x, z, color, scale });
}

function markPoison(body: FieldBody, targetInt: number, seconds: number): void {
  ailment.poison = seconds;
  ailment.poisonTick = 3;
  ailment.poisonDmg = Math.max(1, Math.floor(body.level / 3 + Math.max(0, body.int - targetInt) / 8));
}

function clearCast(body: FieldBody): void {
  body.castName = "";
  body.castTotal = 0;
  body.castElapsed = 0;
  body.castMove = null;
}

function dropSwing(body: FieldBody): void {
  body.swinging = false;
  body.swingMove = null;
  body.hitIn = 0;
}

function dropCast(body: FieldBody, events: FieldEvent[]): void {
  if (body.castTotal <= 0) return;
  events.push({ type: "log", text: `The ${body.name}'s spell is interrupted.`, tone: "info" });
  clearCast(body);
  if (body.anim === "cast") {
    body.anim = "idle";
    body.animLeft = 0;
    body.gesture = "";
  }
}

function castSeconds(move: Move): number {
  if (move.kind === "drain") return 2;
  if (move.kind === "magical") return (move.pot ?? 0) >= 24 ? 2.8 : 2.3;
  return 1.8;
}

function beginCast(body: FieldBody, move: Move, events: FieldEvent[]): void {
  dropSwing(body);
  body.castName = move.name;
  body.gesture = move.name;
  body.castTotal = castSeconds(move);
  body.castElapsed = 0;
  body.castMove = move;
  body.anim = "cast";
  body.animLeft = body.castTotal;
  events.push({ type: "log", text: `The ${body.name} starts casting ${move.name}.`, tone: "info" });
}

function beginSwing(body: FieldBody, move: Move | null): void {
  clearCast(body);
  const anim = move?.anim === "boom" ? "boom" : move?.anim === "skill" ? "skill" : "attack";
  const dur = anim === "boom" ? 0.9 : anim === "skill" ? 0.85 : 0.7;
  body.swinging = true;
  body.swingMove = move;
  body.gesture = move?.name ?? "";
  body.anim = anim;
  body.animLeft = dur;
  body.hitIn = anim === "boom" ? 0.72 : dur * 0.42;
}

function tickMobCast(body: FieldBody, input: FieldInput, dt: number, dist: number, events: FieldEvent[]): void {
  if (body.hp <= 0 || input.playerKo || !input.inZone || dist > 22) {
    dropCast(body, events);
    return;
  }
  body.castElapsed += dt;
  if (body.castElapsed < body.castTotal) return;
  const move = body.castMove;
  clearCast(body);
  landOnPlayer(body, move, input, events);
}

function tickMobSwing(body: FieldBody, input: FieldInput, dt: number, dist: number, reach: number, events: FieldEvent[]): void {
  body.hitIn -= dt;
  if (body.hitIn > 0) return;
  const move = body.swingMove;
  dropSwing(body);
  if (body.hp <= 0 || input.playerKo) return;
  if (dist <= reach + 1.6) landOnPlayer(body, move, input, events);
}

function readySpell(body: FieldBody, spec: Species, dist: number, dt: number, events: FieldEvent[]): void {
  if (body.swinging || body.castTotal > 0 || !spec.spells.length || body.mp < 6 || dist > 16 || body.animLeft > 0) return;
  body.castIn -= dt;
  if (body.castIn > 0) return;
  body.castIn = 8 + Math.random() * 4;
  body.mp = Math.max(0, body.mp - 6);
  const spell = spec.spells[Math.floor(Math.random() * spec.spells.length)] ?? spec.spells[0];
  if (spell) beginCast(body, spell, events);
}

function pickMove(body: FieldBody, spec: Species): Move | null {
  if (body.tp < 1000) return null;
  const pool = spec.moves;
  if (!pool.length) return null;
  body.tp = 0;
  return pool[Math.floor(Math.random() * pool.length)] ?? null;
}

function landOnPlayer(body: FieldBody, move: Move | null, input: FieldInput, events: FieldEvent[]): void {
  const sheet = input.sheet;
  if (!sheet || input.playerKo) return;
  const spec = specOf(body.species);
  const name = move?.name ?? "";
  const kind = move?.kind ?? "physical";
  if (name && move?.anim !== "cast") events.push({ type: "log", text: `The ${body.name} uses ${name}.`, tone: "info" });
  if (kind === "heal") {
    const gain = Math.max(1, Math.floor(body.maxHp * 0.15 + body.mnd));
    body.hp = Math.min(body.maxHp, body.hp + gain);
    events.push({ type: "float", text: `+${gain}`, crit: false, x: body.x, z: body.z, color: "#9adf78" });
    puff(events, body.x, body.z, landColor(move), 1.15);
    return;
  }
  if (kind === "buff") {
    if (move?.buff === "defense") body.buffDef = 1.25;
    else body.buffAtk = 1.25;
    body.buffLeft = 30;
    puff(events, body.x, body.z, 0xe3c57a, 1.1);
    return;
  }
  if (kind === "status") {
    const sleep = move?.status === "sleep";
    const casterStat = sleep ? body.mnd : body.int;
    const targetStat = sleep ? sheet.mnd : sheet.int;
    if (!magicConnects(body, casterStat, targetStat, input.playerLevel)) {
      events.push({ type: "log", text: "Resist!", tone: "info" });
      events.push({ type: "float", text: "Resist", crit: false, x: input.playerX, z: input.playerZ, color: "#d7e7f7" });
      return;
    }
    const span = magicGap(body.level, input.playerLevel);
    const status = move?.status;
    if (status === "blind") ailment.blind = Math.max(4, Math.floor(20 * span));
    else if (status === "poison") markPoison(body, sheet.int, Math.max(6, Math.floor(24 * span)));
    else if (status === "silence") ailment.silence = Math.max(4, Math.floor(18 * span));
    else if (status === "sleep") ailment.sleep = Math.max(3, Math.floor(12 * span));
    events.push({ type: "float", text: status === "blind" ? "Blind" : status === "poison" ? "Poison" : status === "silence" ? "Silence" : "Sleep", crit: false, x: input.playerX, z: input.playerZ, color: "#ffe38a" });
    puff(events, input.playerX, input.playerZ, landColor(move), 1.35);
    return;
  }
  if (kind === "destruct") {
    const damage = Math.max(1, Math.floor(body.hp * 0.85));
    events.push({ type: "float", text: String(damage), crit: true, x: input.playerX, z: input.playerZ, color: "#e3c57a" });
    events.push({ type: "hurt", amount: damage });
    puff(events, input.playerX, input.playerZ, 0xff6a2a, 2.2);
    body.hp = 0;
    defeat(body, input, events);
    body.anim = "boom";
    body.animLeft = 0.85;
    return;
  }
  if (kind === "drain" && move?.anim === "cast") {
    const pot = Math.max(8, Math.floor(body.level * 2 + 6));
    const damage = fieldMagicDamage(pot, body.int, body.level, sheet.int, input.playerLevel, spec.job);
    if (damage <= 0) {
      events.push({ type: "float", text: "Resist", crit: false, x: input.playerX, z: input.playerZ, color: "#d7e7f7" });
      return;
    }
    events.push({ type: "float", text: String(damage), crit: false, x: input.playerX, z: input.playerZ, color: "#d7b4ff" });
    events.push({ type: "hurt", amount: damage });
    body.hp = Math.min(body.maxHp, body.hp + damage);
    puff(events, input.playerX, input.playerZ, landColor(move), 1.5);
    return;
  }
  const ftp = move?.ftp ?? 1;
  if (kind === "magical") {
    const light = move?.name === "Dia";
    const damage = fieldMagicDamage(move?.pot ?? 10, light ? body.mnd : body.int, body.level, light ? sheet.mnd : sheet.int, input.playerLevel, spec.job);
    const open = magicGap(body.level, input.playerLevel) > 0.125;
    let landed = false;
    if (light && open) {
      ailment.dia = 30;
      ailment.diaDmg = Math.max(1, Math.floor((move?.pot ?? 8) / 4 + Math.max(0, body.mnd - sheet.mnd) / 10));
      ailment.diaTick = 3;
      events.push({ type: "float", text: "Defense down", crit: false, x: input.playerX, z: input.playerZ, color: "#f4e27a" });
      landed = true;
    }
    if (damage > 0) {
      events.push({ type: "float", text: String(damage), crit: false, x: input.playerX, z: input.playerZ, color: "#d7b4ff" });
      events.push({ type: "hurt", amount: damage });
      landed = true;
    }
    if (landed) puff(events, input.playerX, input.playerZ, landColor(move), 1.55);
    else events.push({ type: "float", text: "Resist", crit: false, x: input.playerX, z: input.playerZ, color: "#d7e7f7" });
    return;
  }
  const guard = sheet.defense * (ailment.dia > 0 ? 0.9 : 1);
  const ratio = (body.attack * body.buffAtk) / Math.max(1, guard);
  const crit = Math.random() * 100 < critRate(body.dex, sheet.agi);
  const pdif = rollSwordPdif(ratio, crit, Math.random);
  const damage = autoAttackDamage(Math.max(1, Math.floor(body.weapon * ftp)), fStr(body.str - sheet.vit, 0), pdif);
  const chance = hitRate(body.accuracy, sheet.evasion, input.playerLevel - body.level);
  if (Math.random() * 100 >= chance) {
    events.push({ type: "float", text: "Evade", crit: false, x: input.playerX, z: input.playerZ, color: "#d7e7f7" });
    return;
  }
  body.tp = Math.min(3000, body.tp + tpPerHit(body.delay));
  if (damage > 0) {
    events.push({ type: "float", text: crit ? `${damage}!` : String(damage), crit, x: input.playerX, z: input.playerZ, color: crit ? "#e3c57a" : "#ff4d57" });
    events.push({ type: "hurt", amount: damage });
    puff(events, input.playerX, input.playerZ, landColor(move), move ? 1.25 : 0.85);
    if (kind === "drain") body.hp = Math.min(body.maxHp, body.hp + damage);
  } else events.push({ type: "float", text: "0", crit: false, x: input.playerX, z: input.playerZ, color: "#f4ecd4" });
  if (move?.status === "poison") markPoison(body, sheet.int, 16);
}

function nmWait(rng: () => number = Math.random): number {
  return NM_MIN + rng() * (NM_MAX - NM_MIN);
}

/**
 * How a Notorious Monster comes back. Add a row for the next zone.
 * Lottery waits out the window, then a placeholder's own respawn rolls LOTTERY_CHANCE
 * to be the NM instead. The placeholder stays down until the NM dies.
 * Timed NMs have no placeholder. They return on the same 30 minute window.
 * Vrukwuk and Fogweaver share one point and trade places on that window.
 * Panzer is timed. Its death rolls Byakzak at the same chance, or an Orcish Fighter if the roll misses.
 */
type LotteryRow = {
  nm: string;
  ph: FieldBody["ph"];
  /** Species the placeholder is. The camp and the field use this same row. */
  species: string;
  at?: (ph: FieldBody) => { x: number; z: number };
};

const LOTTERY: readonly LotteryRow[] = [
  // Forest Hare at G-9, H-9, and H-10. Retail keeps one hare in that pocket as the placeholder.
  { nm: "jaggedy-eared-jack", ph: "jack", species: "forest-hare" },
  // Scarab Beetle in H-8. The beetle pops a square east, toward I-8.
  { nm: "fungus-beetle", ph: "beetle", species: "scarab-beetle", at: () => {
    const spot = ronCell(8, 7);
    return { x: spot.x + 8, z: spot.z + 4 };
  } },
  // Various orcs toward J-6 / J-7.
  { nm: "thousandarm-deshglesh", ph: "desh", species: "ghelsba-fodder" },
  // Orcs beside Fort G-9.
  { nm: "hundredscar-hajwaj", ph: "haj", species: "fort-grappler" },
  // Orcish Grunt or Orcish Stonechucker, both marked ash, at H-9.
  { nm: "ashmaker-gotblut", ph: "ash", species: "yug-grunt" },
  // Carrion Worms at I-7 and I-9.
  { nm: "bigmouth-billy", ph: "billy", species: "east-carrion" },
  // Pugils along the Cheval at I-8 and I-10.
  { nm: "swamfisk", ph: "swam", species: "east-pugil" },
  // Tomb Bat in the upper crypt. The ghost takes that bat's stone.
  { nm: "tomb-crypt-ghost", ph: "crypt", species: "tomb-bat" },
  // Nachzehrer in the hall. Gwyllgi lotteries off one of them.
  { nm: "tomb-gwyllgi", ph: "gwyll", species: "tomb-nach" },
  // Taisai in the glacier neck. Taisaijin takes one if the window is open.
  { nm: "pass-taisaijin", ph: "taisai", species: "pass-taisai" },
  // Seeker Bats. Gloom Eye lotteries off a marked flock.
  { nm: "pass-gloom", ph: "gloom", species: "pass-seeker" },
  // Hecteyes. Hyakume lotteries off a marked eye.
  { nm: "pass-hyakume", ph: "hyaku", species: "pass-hecteyes" },
];

/** Placeholder species, cooldown, and pop chance for one Notorious Monster. Null when the id is not an NM. */
export type NmCampModel = {
  nm: string;
  /** Placeholder species. Null means the NM is timed and has no placeholder. */
  ph: string | null;
  /** Seconds until the window opens again. The same value nmWait returns. */
  cooldown: number;
  /** Chance a placeholder respawn becomes the NM once the window is open. Timed NMs pop on the window. */
  popChance: number;
};

/** Live lottery and the camp read this. A missing or non-NM id returns null. */
export function nmCampModel(nmId: string): NmCampModel | null {
  const spec = SPECIES[nmId];
  if (!spec?.nm) return null;
  const row = LOTTERY.find((entry) => entry.nm === nmId);
  return {
    nm: nmId,
    ph: row ? row.species : null,
    cooldown: nmWait(() => 0),
    popChance: row ? LOTTERY_CHANCE : 1,
  };
}

/** Lottery rows the camp uses to list an NM that is not standing until it pops. */
export function lotteryCamps(): { nm: string; ph: string }[] {
  return LOTTERY.map((row) => ({ nm: row.nm, ph: row.species }));
}

/** Item drops only. Gil and crystals stay with the live defeat. A slot still yields exactly one item. */
export function rollSpeciesItems(id: string, th: number, rng: () => number): { id: string; found: string }[] {
  return rollLoot(specOf(id), th, false, specOf(id).levelMin, rng).items;
}

const ALTERNATE: Record<string, string> = {
  "bloody-vrukwuk": "fogweaver-mozzfuzz",
  "fogweaver-mozzfuzz": "bloody-vrukwuk",
};

function lotteryOf(ph: FieldBody["ph"]): LotteryRow | null {
  if (!ph) return null;
  return LOTTERY.find((row) => row.ph === ph) ?? null;
}

function nmUp(speciesId: string): boolean {
  return live.some((body) => body.species === speciesId && body.hp > 0 && !body.retired && !body.away);
}

function hearsPop(x: number, z: number): boolean {
  if (!lastInput) return true;
  if (!lastInput.inZone) return false;
  return Math.hypot(x - lastInput.playerX, z - lastInput.playerZ) < 120;
}

function windowOpen(speciesId: string): boolean {
  return fieldNow >= (windowAt.get(speciesId) ?? 0);
}

function sealLottery(nm: string, ph: FieldBody["ph"]): void {
  windowAt.set(nm, fieldNow + nmWait());
  for (const other of live) {
    if (other.ph !== ph || !other.held) continue;
    other.held = false;
    other.respawn = other.respawnMax > 0 ? other.respawnMax : RESPAWN;
  }
}

function restyle(body: FieldBody, speciesId: string, level?: number): void {
  const spec = specOf(speciesId);
  const lv = level ?? spec.levelMin;
  const stats = bake(spec, lv);
  body.species = spec.id;
  body.name = spec.name;
  body.look = spec.look;
  body.variant = spec.variant;
  body.family = spec.family;
  body.level = lv;
  body.nm = spec.nm === true;
  body.maxHp = stats.hp;
  body.hp = stats.hp;
  body.maxMp = stats.mp;
  body.mp = stats.mp;
  body.tp = 0;
  body.attack = stats.attack;
  body.accuracy = stats.accuracy;
  body.defense = stats.defense;
  body.evasion = stats.evasion;
  body.str = stats.str;
  body.dex = stats.dex;
  body.vit = stats.vit;
  body.agi = stats.agi;
  body.int = stats.int;
  body.mnd = stats.mnd;
  body.weapon = stats.weapon;
  body.delay = spec.delay;
  body.respawnMax = spec.respawn ?? RESPAWN;
  body.swing = spec.delay / 60;
  clearCast(body);
  body.swinging = false;
  body.swingMove = null;
  body.gesture = "";
  body.hitIn = 0;
}

function claimPop(body: FieldBody): void {
  body.claimed = true;
  body.hadAggro = true;
  body.mode = "chase";
  claimedId = body.id;
  selectedId = body.id;
}

/** Placeholder respawn. True means the NM took the spot and the placeholder stays down. */
function tryLottery(ph: FieldBody, events: FieldEvent[], rng: () => number = Math.random): boolean {
  const rule = lotteryOf(ph.ph);
  if (!rule || nmUp(rule.nm) || !windowOpen(rule.nm)) return false;
  if (rng() >= LOTTERY_CHANCE) return false;
  const spec = specOf(rule.nm);
  const at = rule.at ? rule.at(ph) : { x: ph.x, z: ph.z };
  const born = addBody(rule.nm, at.x, at.z, rule.nm, "", spec.levelMin);
  born.away = false;
  ph.held = true;
  ph.respawn = 0;
  if (hearsPop(born.x, born.z)) events.push({ type: "log", text: `The ${born.name} appears!`, tone: "info" });
  return true;
}

function rollByakzak(body: FieldBody, events: FieldEvent[]): void {
  const open = windowOpen("chariotbuster-byakzak");
  if (open && Math.random() < LOTTERY_CHANCE) {
    const spec = specOf("chariotbuster-byakzak");
    const born = addBody("chariotbuster-byakzak", body.x, body.z, "fort-panzer", "", spec.levelMin);
    born.away = false;
    claimPop(born);
    body.held = true;
    body.respawn = 0;
    events.push({ type: "log", text: `The ${born.name} appears!`, tone: "info" });
    return;
  }
  const level = body.level;
  body.shell = "orcish-panzer";
  body.shellLevel = level;
  restyle(body, "fort-fighter", 21);
  body.mode = "roam";
  body.spoiled = false;
  body.anim = "idle";
  body.gesture = "";
  body.respawn = 0;
  claimPop(body);
  events.push({ type: "log", text: "An Orcish Fighter takes the Orcish Panzer's place.", tone: "info" });
}

function saplingsDown(): boolean {
  const rows = live.filter((body) => body.species === "tomb-sapling");
  return rows.length > 0 && rows.every((body) => body.hp <= 0);
}

/** Cemetery Cherry stands only after every Cherry Sapling is down. */
function noteCherry(events: FieldEvent[]): void {
  if (!saplingsDown()) return;
  const cherry = live.find((body) => body.species === "tomb-cherry");
  if (!cherry || cherry.hp > 0 || cherry.respawn <= 30) return;
  cherry.mode = "dead";
  cherry.respawn = 8;
  cherry.away = false;
  cherry.retired = false;
  if (hearsPop(cherry.x, cherry.z)) events.push({ type: "log", text: "The crypt goes quiet.", tone: "info" });
}

function defeat(body: FieldBody, input: FieldInput, events: FieldEvent[]): void {
  if (body.spoiled) return;
  body.spoiled = true;
  body.mode = "dead";
  body.hp = 0;
  body.claimed = false;
  body.anim = "dead";
  body.animLeft = 2.7;
  clearCast(body);
  body.swinging = false;
  body.swingMove = null;
  body.gesture = "";
  body.hitIn = 0;
  body.respawn = body.respawnMax;
  if (claimedId === body.id) claimedId = null;
  if (selectedId === body.id) selectedId = null;
  fieldStatuses.delete(body.id);
  refreshFieldPlate();
  const spec = specOf(body.species);
  const loot = rollLoot(spec, input.treasureHunter, input.gilfinder, body.level, Math.random, heldOf(body.id));
  forgetFieldSteal(body.id);
  events.push({ type: "log", text: `The ${body.name} is defeated.`, tone: "hit" });
  events.push({ type: "defeat", id: body.id, name: body.name, level: body.level, x: body.x, z: body.z, gil: loot.gil, crystal: loot.crystal, items: loot.items, species: body.species, family: body.family, west: inRonfaure(body.spawnX, body.spawnZ), east: inEast(body.spawnX, body.spawnZ, 0) });
  if (body.species === "tomb-sapling") noteCherry(events);
  if (body.species === "tomb-cherry") {
    body.respawn = 1e9;
    body.away = false;
    body.retired = false;
    return;
  }
  const lottery = LOTTERY.find((row) => row.nm === body.species);
  if (lottery) {
    body.retired = true;
    body.away = true;
    sealLottery(lottery.nm, lottery.ph);
    return;
  }
  const alt = ALTERNATE[body.species];
  if (alt) {
    body.spawnX = body.x;
    body.spawnZ = body.z;
    body.nextSpawn = alt;
    body.respawn = nmWait();
    return;
  }
  if (body.shell) {
    const back = body.shell;
    const level = body.shellLevel || specOf(back).levelMin;
    body.shell = "";
    body.shellLevel = 0;
    restyle(body, back, level);
    body.hp = 0;
    body.mode = "dead";
    body.spoiled = true;
    body.anim = "dead";
    body.respawn = nmWait();
    return;
  }
  if (body.species === "orcish-panzer") {
    rollByakzak(body, events);
    return;
  }
  if (body.species === "chariotbuster-byakzak") {
    body.retired = true;
    body.away = true;
    windowAt.set("chariotbuster-byakzak", fieldNow + nmWait());
    for (const other of live) {
      if (other.species !== "orcish-panzer" || !other.held) continue;
      other.held = false;
      other.respawn = nmWait();
    }
    return;
  }
  if (spec.nm) body.respawn = nmWait();
  armShare(body);
}

function playerHits(body: FieldBody, input: FieldInput, events: FieldEvent[]): void {
  const sheet = input.sheet;
  if (!sheet || input.playerKo || ailment.sleep > 0 || body.hp <= 0) return;
  events.push({ type: "swing" });
  const nose = forward(body.yaw);
  const behind = isBehind(angleFromForward(nose.x, nose.z, input.playerX - body.x, input.playerZ - body.z));
  const thief = input.thief;
  const lined = thief && (thief.sneak || thief.trick || thief.hidden) ? thiefStrike({
    kind: "melee",
    behind,
    hidden: thief.hidden,
    sneak: thief.sneak,
    trick: thief.trick,
    partner: thief.partner,
    dex: thief.dex,
    agi: thief.agi,
    mainThief: thief.mainThief,
    assassin: thief.assassin,
  }) : null;
  if (lined && (lined.tell || lined.spendSa || lined.spendTa || lined.dropHide)) events.push({ type: "thief", line: lined });
  const blows = 1 + (Math.random() < sheet.doubleAttack ? 1 : 0);
  for (let i = 0; i < blows; i++) {
    if (body.hp <= 0) return;
    const opening = i === 0 ? lined : null;
    const cannotMiss = !!(opening && opening.hit);
    const bonus = opening ? opening.dex + opening.agi : 0;
    if (ailment.blind > 0 && !cannotMiss && Math.random() < 0.3) {
      events.push({ type: "float", text: "Miss", crit: false, x: body.x, z: body.z, color: "#d7e7f7" });
      continue;
    }
    const ratio = sheet.attack / Math.max(1, body.defense * body.buffDef);
    const crit = !!(opening && opening.sure) || Math.random() * 100 < critRate(sheet.dex, body.agi);
    const chance = hitRate(sheet.accuracy, body.evasion, body.level - input.playerLevel);
    if (!cannotMiss && Math.random() * 100 >= chance) {
      events.push({ type: "float", text: "Miss", crit: false, x: body.x, z: body.z, color: "#d7e7f7" });
      continue;
    }
    const pdif = rollSwordPdif(ratio, crit, Math.random, sheet.pdifCap || 3.25);
    const damage = autoAttackDamage(Math.max(1, sheet.dmg + bonus), fStr(sheet.str - body.vit, 0), pdif);
    body.hp -= damage;
    body.tp = Math.min(3000, body.tp + monsterTpGain(tpPerHit(Math.max(180, sheet.delay))));
    if (sheet.tpHit > 0) events.push({ type: "tp", amount: sheet.tpHit });
    events.push({ type: "float", text: crit ? `${damage}!` : String(damage), crit, x: body.x, z: body.z, color: crit ? "#e3c57a" : "#ff4d57" });
    if (opening?.via) {
      const extra = `${opening.dex > 0 ? ` +${opening.dex} DEX` : ""}${opening.agi > 0 ? ` +${opening.agi} AGI` : ""}`;
      events.push({ type: "log", text: `${opening.via}${extra}.`, tone: "hit" });
    }
    provoke(body);
    if (body.hp <= 0) defeat(body, input, events);
  }
}

function buried(body: FieldBody): boolean {
  return body.look === "worm" && body.mode !== "chase" && body.sink > 0.82;
}

/** Worms never walk. They wiggle in a hole, sink, and come up at the next point. Aggro pins them in that hole. */
function tickWorm(body: FieldBody, input: FieldInput, dt: number, dist: number, reach: number, events: FieldEvent[]): void {
  body.moved = 0;
  if (body.mode === "chase") {
    body.yaw = turnTo(body.yaw, faceYaw(body.x, body.z, input.playerX, input.playerZ), FACE_TURN * dt);
    body.sink = Math.max(0, body.sink - dt * 1.7);
    if (body.sink > 0.35) return;
    if (dist > 24 || !input.inZone || input.playerKo) {
      dropCast(body, events);
      dropSwing(body);
      body.mode = "roam";
      body.claimed = false;
      body.hadAggro = false;
      body.burrow = "up";
      body.pause = standFor(body.family);
      if (claimedId === body.id) claimedId = null;
      return;
    }
    if (body.castTotal > 0) {
      tickMobCast(body, input, dt, dist, events);
      return;
    }
    if (body.swinging) {
      tickMobSwing(body, input, dt, dist, reach, events);
      return;
    }
    const wormSpec = specOf(body.species);
    if (dist <= reach + 0.25 && body.animLeft <= 0) {
      body.swing -= dt;
      if (body.swing <= 0) {
        body.swing = body.delay / 60;
        const move = pickMove(body, wormSpec);
        if (move?.anim === "cast") beginCast(body, move, events);
        else beginSwing(body, move);
      }
    }
    readySpell(body, wormSpec, dist, dt, events);
    return;
  }
  if (body.mode === "leash") {
    body.mode = "roam";
    body.burrow = "up";
    body.pause = standFor(body.family);
    body.sink = 0;
    return;
  }
  if (body.burrow === "up") {
    body.sink = 0;
    body.pause -= dt;
    if (body.pause <= 0) body.burrow = "down";
    return;
  }
  if (body.burrow === "down") {
    body.sink = Math.min(1, body.sink + dt * 1.45);
    if (body.sink >= 1) {
      body.index = (body.index + 1) % Math.max(1, body.points.length);
      const point = body.points[body.index] ?? body.points[0];
      if (point && !footBlocked(point.x, point.z)) {
        body.x = point.x;
        body.z = point.z;
      }
      body.burrow = "under";
      body.pause = -1.2;
    }
    return;
  }
  if (body.burrow === "under") {
    body.sink = 1;
    body.pause += dt;
    if (body.pause >= 0) body.burrow = "rise";
    return;
  }
  body.sink = Math.max(0, body.sink - dt * 1.55);
  if (body.sink <= 0) {
    body.burrow = "up";
    body.pause = standFor(body.family);
  }
}

function tickOne(body: FieldBody, input: FieldInput, dt: number, events: FieldEvent[]): void {
  if (body.retired) {
    if (body.animLeft > 0) body.animLeft = Math.max(0, body.animLeft - dt);
    return;
  }
  body.moved = 0;
  const spec = specOf(body.species);
  const open = up(spec, input.hour, input.fog);
  if (!open) {
    if (!body.away && body.mode !== "dead") {
      body.away = true;
      body.mode = "roam";
      body.hp = body.maxHp;
      body.claimed = false;
      if (claimedId === body.id) claimedId = null;
      if (selectedId === body.id) selectedId = null;
    }
    return;
  }
  if (body.away && body.mode !== "dead") {
    body.away = false;
    forgetFieldSteal(body.id);
    body.x = body.spawnX;
    body.z = body.spawnZ;
    body.hp = body.maxHp;
    body.anim = "idle";
    body.gesture = "";
    body.sink = 0;
    body.burrow = "up";
    body.index = 0;
    body.pause = standFor(body.family);
    if (input.inZone && Math.hypot(body.spawnX - input.playerX, body.spawnZ - input.playerZ) < 48) {
      events.push({ type: "log", text: `The ${body.name} appears.`, tone: "info" });
    }
  }
  if (body.castTotal > 0) {
    body.anim = "cast";
    body.animLeft = Math.max(0.08, body.castTotal - body.castElapsed);
  } else if (body.animLeft > 0) body.animLeft = Math.max(0, body.animLeft - dt);
  else if (body.anim !== "dead") {
    body.anim = "idle";
    body.gesture = "";
  }
  if (body.buffLeft > 0) {
    body.buffLeft = Math.max(0, body.buffLeft - dt);
    if (body.buffLeft === 0) {
      body.buffAtk = 1;
      body.buffDef = 1;
    }
  }
  if (body.mode === "dead" || body.hp <= 0) {
    if (body.held) return;
    body.respawn -= dt;
    if (body.respawn <= 0 && open) {
      if (body.nextSpawn) {
        restyle(body, body.nextSpawn);
        body.nextSpawn = "";
      } else if (tryLottery(body, events)) return;
      const risen = specOf(body.species);
      const stats = bake(risen, body.level);
      body.hp = stats.hp;
      body.maxHp = stats.hp;
      body.mp = stats.mp;
      body.maxMp = stats.mp;
      body.tp = 0;
      body.mode = "roam";
      body.x = body.spawnX;
      body.z = body.spawnZ;
      body.spoiled = false;
      body.claimed = false;
      body.hadAggro = false;
      forgetFieldSteal(body.id);
      body.anim = "idle";
      body.gesture = "";
      body.respawn = 0;
      body.sink = 0;
      body.burrow = "up";
      body.index = 0;
      body.pause = standFor(body.family);
      if (risen.nm && hearsPop(body.x, body.z)) events.push({ type: "log", text: `The ${body.name} appears.`, tone: "info" });
    }
    return;
  }
  const dx = input.playerX - body.x;
  const dz = input.playerZ - body.z;
  const dist = Math.hypot(dx, dz);
  if (body.mode === "roam" && dist > 72 && claimedId !== body.id) return;
  const nose = forward(body.yaw);
  const sightAngle = angleFromForward(nose.x, nose.z, dx, dz);
  const weak = checkCon(input.playerLevel, body.level) === "too-weak";
  if (input.inZone && !input.playerKo && !weak && body.mode !== "leash") {
    const verdict = aggros({
      detect: spec.detect,
      playerLevel: input.playerLevel,
      mobLevel: body.level,
      distance: dist,
      sightAngle,
      hpRatio: input.hpRatio,
      invisible: input.invisible,
      sneak: input.sneak,
      deodorize: input.deodorize,
      castingMagic: input.castingMagic,
      indoors: false,
      hadAggro: body.hadAggro,
    });
    if (verdict.aggro && body.mode === "roam") {
      body.mode = "chase";
      body.hadAggro = true;
      body.claimed = true;
      if (!claimedId) claimedId = body.id;
      selectedId = selectedId ?? body.id;
      events.push({ type: "log", text: `The ${body.name} attacks!`, tone: "info" });
    } else if (!verdict.aggro && body.hadAggro && body.mode === "chase" && !body.claimed) body.mode = "leash";
  }
  const home = Math.hypot(body.x - body.spawnX, body.z - body.spawnZ);
  const reach = hitReach(input) - 0.35;
  if (body.look === "worm") {
    if (body.mode === "chase" && home > LEASH) {
      dropCast(body, events);
      dropSwing(body);
      body.mode = "roam";
      body.claimed = false;
      body.hadAggro = false;
      body.burrow = "up";
      body.pause = standFor(body.family);
      body.sink = 0;
      if (claimedId === body.id) claimedId = null;
    }
    tickWorm(body, input, dt, dist, reach, events);
  } else if (body.mode === "chase" && (home > LEASH || !input.inZone || input.playerKo)) {
    dropCast(body, events);
    dropSwing(body);
    body.mode = "leash";
    body.claimed = false;
    body.hadAggro = false;
    if (claimedId === body.id) claimedId = null;
  } else if (body.mode === "chase") {
    const stand = spec.spells.length > 0 && spec.moves.length === 0 ? 8 : reach;
    if (body.castTotal > 0) {
      body.yaw = turnTo(body.yaw, faceYaw(body.x, body.z, input.playerX, input.playerZ), FACE_TURN * dt);
      tickMobCast(body, input, dt, dist, events);
    } else {
      const wasSwinging = body.swinging;
      moveToward(body, input.playerX, input.playerZ, RUN, dt, stand);
      if (wasSwinging) tickMobSwing(body, input, dt, dist, reach, events);
      else if (dist <= reach + 0.2 && body.animLeft <= 0) {
        body.swing -= dt;
        if (body.swing <= 0) {
          body.swing = body.delay / 60;
          const move = pickMove(body, spec);
          if (move?.anim === "cast") beginCast(body, move, events);
          else beginSwing(body, move);
          if (body.hp <= 0) return;
        }
      }
      readySpell(body, spec, dist, dt, events);
    }
  } else if (body.mode === "leash") {
    moveToward(body, body.spawnX, body.spawnZ, WALK, dt, 0.3);
    if (home < 0.6) {
      body.mode = "roam";
      body.hp = body.maxHp;
      body.tp = 0;
      body.index = 0;
      body.pause = standFor(body.family);
    }
  } else {
    const point = body.points[body.index] ?? body.points[0];
    if (!point) return;
    const gap = Math.hypot(point.x - body.x, point.z - body.z);
    if (gap < 0.4) {
      body.stuck = 0;
      body.pause -= dt;
      if (body.pause <= 0) {
        body.index = (body.index + 1) % body.points.length;
        body.pause = standFor(body.family);
      }
    } else {
      const x0 = body.x;
      const z0 = body.z;
      moveToward(body, point.x, point.z, WALK, dt, 0.2);
      if (Math.hypot(body.x - x0, body.z - z0) < 0.02) {
        body.stuck += dt;
        if (body.stuck > 0.7) {
          body.index = (body.index + 1) % body.points.length;
          body.stuck = 0;
        }
      } else body.stuck = 0;
    }
  }
  if (claimedId === body.id && body.hp > 0 && input.sheet && (body.mode === "chase" || body.mode === "roam")) {
    if (dist > AUTO_ATTACK) {
      release();
      events.push({ type: "log", text: `You lose sight of the ${body.name}.`, tone: "info" });
    } else {
      playerClock -= dt;
      if (playerClock <= 0) {
        if (dist <= reach + 0.35) {
          playerClock = swingDelay(input);
          playerHits(body, input, events);
        } else playerClock = 0;
      }
    }
  }
}

export function tickField(input: FieldInput, dt: number): FieldEvent[] {
  const events: FieldEvent[] = [];
  fieldNow += Math.max(0, dt);
  seenLevel = input.playerLevel;
  lastInput = input;
  events.push(...drainFieldEvents());
  tickFieldStatuses(dt, events);
  if (!input.inZone && claimedId) release();
  if (ailment.blind > 0) ailment.blind = Math.max(0, ailment.blind - dt);
  if (ailment.silence > 0) ailment.silence = Math.max(0, ailment.silence - dt);
  if (ailment.sleep > 0) ailment.sleep = Math.max(0, ailment.sleep - dt);
  if (ailment.poison > 0) {
    ailment.poison = Math.max(0, ailment.poison - dt);
    ailment.poisonTick -= dt;
    if (ailment.poisonTick <= 0 && ailment.poison > 0) {
      ailment.poisonTick = 3;
      const nip = ailment.poisonDmg;
      events.push({ type: "hurt", amount: nip });
      events.push({ type: "float", text: String(nip), crit: false, x: input.playerX, z: input.playerZ, color: "#9adf78" });
      events.push({ type: "burst", x: input.playerX, z: input.playerZ, color: 0x6fbf63, scale: 0.7 });
    }
  }
  if (ailment.dia > 0) {
    ailment.dia = Math.max(0, ailment.dia - dt);
    ailment.diaTick -= dt;
    if (ailment.dia > 0 && ailment.diaTick <= 0) {
      ailment.diaTick = 3;
      const nip = ailment.diaDmg;
      events.push({ type: "hurt", amount: nip });
      events.push({ type: "float", text: String(nip), crit: false, x: input.playerX, z: input.playerZ, color: "#f4e27a" });
      events.push({ type: "burst", x: input.playerX, z: input.playerZ, color: 0xf4e27a, scale: 0.65 });
    }
  }
  for (const body of live) tickOne(body, input, dt, events);
  for (const body of live) {
    if (body.mode === "chase" && body.hp > 0 && !body.away) fightAge.set(body.id, (fightAge.get(body.id) ?? 0) + Math.max(0, dt));
    else fightAge.delete(body.id);
  }
  tickLinks(input.playerLevel, events);
  events.push(...drainFieldEvents());
  refreshFieldPlate();
  return events;
}

function blankInput(): FieldInput {
  return {
    playerX: 0,
    playerZ: 0,
    playerLevel: seenLevel,
    playerKo: false,
    hpRatio: 1,
    invisible: false,
    sneak: false,
    deodorize: false,
    castingMagic: false,
    inZone: true,
    hour: 12,
    fog: false,
    sheet: null,
    treasureHunter: 0,
    gilfinder: false,
  };
}

export type FieldPlate = {
  id: string | null;
  name: string;
  family: string;
  level: number;
  hp: number;
  max: number;
  claimed: boolean;
  x: number;
  z: number;
  look: string;
  nm: boolean;
};

const EMPTY_FIELD: FieldPlate = {
  id: null, name: "", family: "", level: 0, hp: 0, max: 0, claimed: false, x: 0, z: 0, look: "", nm: false,
};
let fieldPlate: FieldPlate = EMPTY_FIELD;
let fieldKey = "";
const fieldListeners = new Set<() => void>();

function livingField(body: FieldBody | null): body is FieldBody {
  return !!body && body.hp > 0 && !body.away && body.mode !== "dead" && !buried(body);
}

function plateFrom(body: FieldBody | null): FieldPlate {
  if (!livingField(body)) return EMPTY_FIELD;
  return {
    id: body.id,
    name: body.name,
    family: body.family,
    level: body.level,
    hp: body.hp,
    max: body.maxHp,
    claimed: claimedId === body.id,
    x: body.x,
    z: body.z,
    look: body.look,
    nm: body.nm,
  };
}

function refreshFieldPlate(): void {
  const next = plateFrom(find(selectedId));
  const key = `${next.id ?? ""}|${next.hp}|${next.max}|${next.claimed ? 1 : 0}`;
  if (key === fieldKey) return;
  fieldKey = key;
  fieldPlate = next;
  for (const fn of fieldListeners) fn();
}

export function subscribeField(fn: () => void): () => void {
  fieldListeners.add(fn);
  return () => fieldListeners.delete(fn);
}

export function readFieldPlate(): FieldPlate {
  return fieldPlate;
}

export function fieldById(id: string | null): FieldBody | null {
  return find(id);
}

/** The mob on the target plate. Spells and weapon skills strike this body, engaged or not. */
export function fieldTarget(): FieldBody | null {
  const body = find(selectedId);
  return livingField(body) ? body : null;
}

export function fieldCard(body: FieldBody) {
  const spec = specOf(body.species);
  const jobRank = JOB_RANK[spec.job];
  const chr = rankAt(spec.ranks.chr, body.level) + rankAt(jobRank, body.level) + Math.floor(rankAt(jobRank, body.level) / 2);
  return {
    name: body.name,
    family: body.family,
    job: spec.job,
    level: body.level,
    levelMin: spec.levelMin,
    levelMax: spec.levelMax,
    hpNatural: body.maxHp,
    mp: body.maxMp,
    str: body.str,
    dex: body.dex,
    vit: body.vit,
    agi: body.agi,
    int: body.int,
    mnd: body.mnd,
    chr,
    evasion: body.evasion,
    defRankBase: skillCap(spec.ranks.def, body.level),
    accuracy: body.accuracy,
    attack: body.attack,
    combatSkill: skillCap("C", body.level),
    weaponDamage: body.weapon,
    delay: body.delay,
    weaponRank: Math.max(1, Math.floor(body.weapon / 9)),
    undead: body.look === "skeleton" || spec.family === "Skeleton",
    aggressive: spec.detect.aggressive,
    defense: Math.max(1, Math.floor(body.defense * (body.buffDef || 1))),
  };
}

/** Claim a field mob the way an offensive action does. A hit calls them in, even when /check says too weak. */
export function engageField(id: string): boolean {
  const body = find(id);
  if (!livingField(body)) return false;
  arm(body);
  provoke(body);
  return true;
}

export function toggleFieldEngage(): "claim" | "release" | "far" | null {
  const body = find(selectedId);
  if (!livingField(body)) return null;
  if (claimedId === body.id) {
    release();
    return "release";
  }
  return beginMelee(body);
}

export function fieldStatusPark(id: string): FieldStatusHold {
  const held = fieldStatuses.get(id);
  return {
    enfeebles: held ? held.enfeebles.map((row) => ({ ...row })) : [],
    debuffs: held ? held.debuffs.map((row) => ({ ...row })) : [],
  };
}

export function fieldStatusSave(id: string, enfeebles: Record<string, unknown>[], debuffs: Record<string, unknown>[]): void {
  if (enfeebles.length === 0 && debuffs.length === 0) fieldStatuses.delete(id);
  else fieldStatuses.set(id, {
    enfeebles: enfeebles.map((row) => ({ ...row })),
    debuffs: debuffs.map((row) => ({ ...row })),
  });
}

function drainFieldEvents(): FieldEvent[] {
  if (pendingField.length === 0) return [];
  const rows = pendingField.slice();
  pendingField.length = 0;
  return rows;
}

/** Spell, weapon skill, and ability damage. A killing blow uses the same loot path as a melee swing. */
export function hurtField(id: string, dmg: number): boolean {
  const body = find(id);
  const n = Math.floor(dmg);
  if (!body || body.hp <= 0 || body.away || body.mode === "dead") return true;
  if (n <= 0) return false;
  body.hp -= n;
  provoke(body);
  claimedId = body.id;
  selectedId = body.id;
  const events: FieldEvent[] = [{ type: "float", text: String(n), crit: false, x: body.x, z: body.z, color: "#ff4d57" }];
  if (body.hp <= 0) defeat(body, lastInput ?? blankInput(), events);
  else refreshFieldPlate();
  pendingField.push(...events);
  return body.hp <= 0;
}

function rowLeft(row: Record<string, unknown>, dt: number): Record<string, unknown> | null {
  if (typeof row.left !== "number") return row;
  const left = row.left - dt;
  return left > 0 ? { ...row, left } : null;
}

function tickFieldStatuses(dt: number, events: FieldEvent[]): void {
  if (dt <= 0 || fieldStatuses.size === 0) return;
  for (const [id, held] of fieldStatuses) {
    const body = find(id);
    if (!body || body.hp <= 0 || body.mode === "dead") {
      fieldStatuses.delete(id);
      continue;
    }
    for (const row of held.enfeebles) {
      const dot = typeof row.dot === "number" ? Math.floor(row.dot) : 0;
      if (dot <= 0 || body.hp <= 0) continue;
      const tick = (typeof row.tick === "number" ? row.tick : 3) - dt;
      if (tick > 0) {
        row.tick = tick;
        continue;
      }
      row.tick = 3;
      body.hp -= dot;
      events.push({ type: "float", text: String(dot), crit: false, x: body.x, z: body.z, color: "#9adf78" });
      if (body.hp <= 0) {
        defeat(body, lastInput ?? blankInput(), events);
        break;
      }
    }
    if (body.hp <= 0) continue;
    const enfeebles = held.enfeebles.map((row) => rowLeft(row, dt)).filter((row): row is Record<string, unknown> => row != null);
    const debuffs = held.debuffs.map((row) => rowLeft(row, dt)).filter((row): row is Record<string, unknown> => row != null);
    if (enfeebles.length === 0 && debuffs.length === 0) fieldStatuses.delete(id);
    else fieldStatuses.set(id, { enfeebles, debuffs });
  }
}

function heldOf(id: string): { items?: ReadonlySet<string>; gil?: boolean } {
  const items = liftedItems.get(id);
  const gil = liftedGil.has(id);
  if (!items && !gil) return {};
  return { items, gil };
}

function forgetFieldSteal(id: string): void {
  liftedItems.delete(id);
  liftedGil.delete(id);
}

/** One attempt on this mob's own pockets. Nothing is removed until keepFieldSteal. */
export function peekFieldSteal(id: string, kind: "item" | "gil", playerLevel: number, th: number, rng: () => number = Math.random): { name: string; item: { id: string; found: string } | null; gil: number } | null {
  const body = find(id);
  if (!body || body.hp <= 0 || body.away || body.mode === "dead") return null;
  const spec = specOf(body.species);
  if (kind === "gil") {
    if (liftedGil.has(body.id)) return { name: body.name, item: null, gil: 0 };
    const gil = Math.max(1, Math.floor(body.level * (3 + rng() * 5)));
    return { name: body.name, item: null, gil };
  }
  const taken = liftedItems.get(body.id);
  const pool = spec.drops.filter((drop) => drop.tier && !drop.always && !taken?.has(drop.id));
  pool.sort((a, b) => dropRate(b.tier ?? "common", th) - dropRate(a.tier ?? "common", th));
  const gap = Math.max(0, playerLevel - body.level);
  for (const drop of pool) {
    const chance = Math.min(0.95, dropRate(drop.tier ?? "common", th) * (1 + gap / 10));
    if (rng() < chance) return { name: body.name, item: { id: drop.id, found: drop.found }, gil: 0 };
  }
  return { name: body.name, item: null, gil: 0 };
}

export function keepFieldSteal(id: string, itemId: string | null, gil: boolean): void {
  if (itemId) {
    const set = liftedItems.get(id) ?? new Set<string>();
    set.add(itemId);
    liftedItems.set(id, set);
  }
  if (gil) liftedGil.add(id);
}

/** A connecting field swing returns weapon TP. A miss returns none. Store TP is applied later. */
function assertFieldFacing(): void {
  const body = live.find((row) => row.species === "orcish-barricader" && row.hp > 0);
  if (!body) throw new Error("barricader face");
  const snap = {
    x: body.x, z: body.z, yaw: body.yaw, mode: body.mode, claimed: body.claimed,
    hp: body.hp, max: body.maxHp, anim: body.anim, animLeft: body.animLeft,
  };
  const claimed = claimedId;
  const selected = selectedId;
  try {
    body.x = 40000;
    body.z = 40000;
    body.yaw = 0;
    body.mode = "chase";
    body.claimed = true;
    moveToward(body, body.x + 1.5, body.z, 4, 0.3, 2);
    const want = faceYaw(body.x, body.z, body.x + 1.5, body.z);
    const left = Math.abs(Math.atan2(Math.sin(body.yaw - want), Math.cos(body.yaw - want)));
    if (left > 0.05) throw new Error("engaged mob did not face the player");
    if (Math.hypot(body.x - 40000, body.z - 40000) > 0.02) throw new Error("in-range face walked");
    body.hp = 0;
    body.mode = "dead";
    body.anim = "dead";
    body.animLeft = 2.7;
    if (nearestField(40000, 40000, 4, 8).some((row) => row.id === body.id)) throw new Error("corpse on the live list");
    if (!nearestField(40000, 40000, 4, 8, true).some((row) => row.id === body.id)) throw new Error("corpse was not drawn");
    body.animLeft = 0;
    if (nearestField(40000, 40000, 4, 8, true).some((row) => row.id === body.id)) throw new Error("finished corpse stayed");
  } finally {
    body.x = snap.x;
    body.z = snap.z;
    body.yaw = snap.yaw;
    body.mode = snap.mode;
    body.claimed = snap.claimed;
    body.hp = snap.hp;
    body.maxHp = snap.max;
    body.anim = snap.anim;
    body.animLeft = snap.animLeft;
    claimedId = claimed;
    selectedId = selected;
    fightAge.delete(body.id);
  }
}

function assertFieldPlayerTp(): void {
  const body = live.find((row) => row.species === "orcish-barricader" && row.hp > 0);
  if (!body || !body.nm) throw new Error("barricader tp");
  const fodder = live.find((row) => row.species === "ghelsba-fodder" && row.hp > 0);
  if (!fodder || fodder.nm) throw new Error("fodder nm flag");
  if (checkLine(body.name, 75, body.level, body.nm) !== `The ${body.name}'s strength is impossible to gauge.`) {
    throw new Error("barricader check");
  }
  if (checkLine(fodder.name, 75, fodder.level, fodder.nm) !== `The ${fodder.name} seems too weak to be worthwhile.`) {
    throw new Error("fodder check");
  }
  const snap = { hp: body.hp, max: body.maxHp, tp: body.tp, claimed: body.claimed, mode: body.mode };
  const claimed = claimedId;
  const selected = selectedId;
  body.hp = 500000;
  body.maxHp = 500000;
  body.claimed = true;
  const base: FieldSheet = {
    attack: 80, accuracy: 0, defense: 200, evasion: 250,
    str: 20, dex: 20, vit: 20, agi: 20, int: 20, mnd: 20,
    dmg: 1, delay: 183, seconds: 3.05, doubleAttack: 0, pdifCap: 3.25, reach: 3.9, tpHit: 61,
  };
  const swing = (accuracy: number, doubleAttack: number, tpHit: number, playerLevel: number): FieldInput => ({
    playerX: body.x, playerZ: body.z, playerLevel, playerKo: false, hpRatio: 1,
    invisible: false, sneak: false, deodorize: false, castingMagic: false,
    inZone: true, hour: 12, fog: false, treasureHunter: 0, gilfinder: false,
    sheet: { ...base, accuracy, doubleAttack, tpHit },
  });
  const rewind = () => {
    body.hp = 500000;
    body.tp = snap.tp;
    body.claimed = true;
    body.mode = snap.mode;
    claimedId = claimed;
    selectedId = selected;
  };
  try {
    let missed = false;
    for (let i = 0; i < 50 && !missed; i++) {
      const events: FieldEvent[] = [];
      const hp = body.hp;
      playerHits(body, swing(0, 0, 61, 1), events);
      const gained = events.some((ev) => ev.type === "tp");
      const miss = events.some((ev) => ev.type === "float" && ev.text === "Miss");
      if (gained && miss) throw new Error("a miss granted tp");
      if (miss && !gained && body.hp === hp) missed = true;
      rewind();
    }
    if (!missed) throw new Error("field miss granted tp");
    let hit = false;
    for (let i = 0; i < 30 && !hit; i++) {
      const events: FieldEvent[] = [];
      playerHits(body, swing(5000, 0, 61, 75), events);
      const gained = events.filter((ev) => ev.type === "tp");
      if (gained.length === 1 && gained[0].type === "tp" && gained[0].amount === 61) hit = true;
      else if (gained.length > 0) throw new Error("field tp amount");
      rewind();
    }
    if (!hit) throw new Error("field hit granted no tp");
    let doubled = false;
    for (let i = 0; i < 30 && !doubled; i++) {
      const events: FieldEvent[] = [];
      playerHits(body, swing(5000, 1, 61, 75), events);
      const gained = events.filter((ev) => ev.type === "tp");
      if (gained.length === 2 && gained.every((ev) => ev.type === "tp" && ev.amount === 61)) doubled = true;
      rewind();
    }
    if (!doubled) throw new Error("double attack tp");
    let bare = false;
    for (let i = 0; i < 30 && !bare; i++) {
      const events: FieldEvent[] = [];
      playerHits(body, swing(5000, 0, 0, 75), events);
      const connected = events.some((ev) => ev.type === "float" && ev.text !== "Miss");
      if (connected && events.some((ev) => ev.type === "tp")) throw new Error("zero tp weapon granted tp");
      if (connected) bare = true;
      rewind();
    }
    if (!bare) throw new Error("zero tp hit never connected");
  } finally {
    body.hp = snap.hp;
    body.maxHp = snap.max;
    body.tp = snap.tp;
    body.claimed = snap.claimed;
    body.mode = snap.mode;
    claimedId = claimed;
    selectedId = selected;
    fightAge.delete(body.id);
  }
}

/** Sneak Attack on a field mob uses that mob's nose, not the training hare. */
function assertFieldSneak(): void {
  const body = live.find((row) => row.hp > 0);
  if (!body) throw new Error("sneak body");
  const snap = { x: body.x, z: body.z, yaw: body.yaw, hp: body.hp, max: body.maxHp, tp: body.tp, claimed: body.claimed, mode: body.mode };
  const claimed = claimedId;
  const selected = selectedId;
  const sheet: FieldSheet = {
    attack: 80, accuracy: 0, defense: 200, evasion: 250,
    str: 20, dex: 20, vit: 20, agi: 20, int: 20, mnd: 20,
    dmg: 10, delay: 183, seconds: 3.05, doubleAttack: 0, pdifCap: 3.25, reach: 3.9, tpHit: 0,
  };
  const thief: FieldThief = { hidden: false, sneak: true, trick: false, partner: false, dex: 40, agi: 0, mainThief: true, assassin: false };
  const swing = (z: number): FieldInput => ({
    playerX: 40000, playerZ: z, playerLevel: 75, playerKo: false, hpRatio: 1,
    invisible: false, sneak: false, deodorize: false, castingMagic: false,
    inZone: true, hour: 12, fog: false, treasureHunter: 0, gilfinder: false,
    sheet, thief,
  });
  try {
    body.x = 40000;
    body.z = 40000;
    body.yaw = 0;
    body.hp = 500000;
    body.maxHp = 500000;
    const behind: FieldEvent[] = [];
    playerHits(body, swing(40002), behind);
    const lined = behind.find((ev) => ev.type === "thief");
    const blow = behind.find((ev) => ev.type === "float");
    if (!lined || lined.type !== "thief" || !lined.line.spendSa || !lined.line.sure || lined.line.dex !== 40 || lined.line.tell) {
      throw new Error("sneak from behind a field mob");
    }
    if (!blow || blow.type !== "float" || !blow.crit || blow.text === "Miss") throw new Error("sneak behind missed");
    body.hp = 500000;
    const front: FieldEvent[] = [];
    playerHits(body, swing(39998), front);
    const kept = front.find((ev) => ev.type === "thief");
    if (!kept || kept.type !== "thief" || kept.line.spendSa || kept.line.sure || kept.line.tell !== "sa") throw new Error("frontal sneak was spent");
    body.hp = 500000;
    const trick: FieldEvent[] = [];
    playerHits(body, {
      ...swing(40002),
      thief: { hidden: false, sneak: false, trick: true, partner: true, dex: 40, agi: 55, mainThief: true, assassin: false },
    }, trick);
    const handed = trick.find((ev) => ev.type === "thief");
    const trickBlow = trick.find((ev) => ev.type === "float");
    if (!handed || handed.type !== "thief" || !handed.line.spendTa || !handed.line.hit || handed.line.agi !== 55 || handed.line.tell) {
      throw new Error("trick in front of a field mob");
    }
    if (!trickBlow || trickBlow.type !== "float" || trickBlow.text === "Miss") throw new Error("trick attack missed");
  } finally {
    body.x = snap.x;
    body.z = snap.z;
    body.yaw = snap.yaw;
    body.hp = snap.hp;
    body.maxHp = snap.max;
    body.tp = snap.tp;
    body.claimed = snap.claimed;
    body.mode = snap.mode;
    claimedId = claimed;
    selectedId = selected;
    fightAge.delete(body.id);
  }
}

/** FFXIclopedia standing list for East Ronfaure. Fished pugils are not camps. */
function fillEast(): void {
  const here = (id: string) => westCount(id);
  const colRow = (x: number, z: number) => ({ col: (x - EAST_X0) / EAST_CELL, row: (z - EAST_Z0) / EAST_CELL });
  const spots = (step: number, ok: (x: number, z: number) => boolean = () => true) => {
    const out: { x: number; z: number }[] = [];
    for (let x = EAST_X0 + 8; x <= EAST_X0 + EAST_SIZE - 8; x += step) {
      for (let z = EAST_Z0 + 8; z <= EAST_Z0 + EAST_SIZE - 8; z += step) {
        if (!eastDry(x, z, 0.9) || zoneTouch(x, z) || !ok(x, z)) continue;
        out.push({ x, z });
      }
    }
    return out;
  };
  const spread = (
    grid: { x: number; z: number }[],
    recipes: { ids: string[]; region?: (x: number, z: number) => boolean }[],
    fits: (ids: string[]) => boolean,
    pending: () => boolean,
    salt: number,
  ) => {
    if (!grid.length || !pending()) return;
    for (const index of visitOrder(grid.length, salt)) {
      if (!pending()) return;
      const spot = grid[index];
      for (const recipe of recipes) {
        if (!fits(recipe.ids)) continue;
        if (recipe.region && !recipe.region(spot.x, spot.z)) continue;
        if (tryParty(recipe.ids, spot.x, spot.z)) break;
      }
    }
  };
  const herds = (
    grid: { x: number; z: number }[],
    jobs: { id: string; want: number; cluster: number; region?: (x: number, z: number) => boolean }[],
    salt: number,
  ) => {
    if (!grid.length) return;
    const pending = () => jobs.some((job) => here(job.id) < job.want);
    for (const index of visitOrder(grid.length, salt)) {
      if (!pending()) return;
      const spot = grid[index];
      let best: (typeof jobs)[number] | null = null;
      let score = -1;
      for (const job of jobs) {
        const have = here(job.id);
        if (have >= job.want) continue;
        if (job.region && !job.region(spot.x, spot.z)) continue;
        const deficit = (job.want - have) / job.want;
        if (deficit > score) {
          score = deficit;
          best = job;
        }
      }
      if (!best) continue;
      placeHerd(best.id, spot.x, spot.z, Math.min(best.cluster, best.want - here(best.id)));
    }
  };
  const pinEast = (id: string, col: number, row: number, link: string, ph: FieldBody["ph"] = "", maxR = 18) => {
    const spot = eastAt(col, row);
    pin(id, spot.x, spot.z, link, maxR, ph);
  };
  const tallyOk = (ids: string[], caps: Record<string, number>) => {
    const tally: Record<string, number> = {};
    for (const id of ids) tally[id] = (tally[id] ?? 0) + 1;
    return Object.keys(tally).every((id) => here(id) + (tally[id] ?? 0) <= (caps[id] ?? 0));
  };

  // Bigmouth Billy lotteries off Carrion Worms at I-7 and I-9.
  pinEast("east-carrion", 8.2, 6.2, "billy-a", "billy");
  pinEast("east-carrion", 8.45, 6.7, "billy-b", "billy");
  pinEast("east-carrion", 8.25, 8.15, "billy-c", "billy");
  pinEast("east-carrion", 8.5, 8.6, "billy-d", "billy");

  const banks = spots(4, eastBank);
  let swam = 0;
  const swamNear = (col: number, row: number) => {
    const spot = eastAt(col, row);
    return banks
      .filter((p) => Math.hypot(p.x - spot.x, p.z - spot.z) < 46)
      .sort((a, b) => Math.hypot(a.x - spot.x, a.z - spot.z) - Math.hypot(b.x - spot.x, b.z - spot.z));
  };
  for (const spot of [...swamNear(8.05, 7.15), ...swamNear(8.05, 9.15)]) {
    if (swam >= 4) break;
    if (!canStand(spot.x, spot.z, specOf("east-pugil"), HERD_ROAM, "swam-ph")) continue;
    addBody("east-pugil", spot.x, spot.z, "swam-ph", "swam");
    swam += 1;
  }

  // Timed. Stands at H-8, then the same 30 to 60 minute window as the other timed NMs.
  pinEast("rambukk", 7.25, 7.55, "rambukk", "", 24);

  let bombs = 0;
  for (const [col, row] of [[6.4, 4.7], [9.4, 6.2], [6.8, 9.4]] as const) {
    if (bombs >= 3) break;
    const before = live.length;
    pinEast("east-bomb", col, row, "east-bomb", "", 16);
    if (live.length > before) bombs += 1;
  }

  const loose = spots(9);
  const orcSide = (x: number, z: number) => {
    const at = colRow(x, z);
    return at.col >= 8.15 && at.col <= 10.35 && at.row >= 4.7 && at.row <= 10.2;
  };
  const orcWider = (x: number, z: number) => {
    const at = colRow(x, z);
    if (at.col < 6.4 || at.col > 10.4 || at.row < 4.55 || at.row > 10.35) return false;
    if (at.col < 7.5 && at.row > 5.15 && at.row < 9.15) return false;
    return true;
  };
  const orcCap: Record<string, number> = { "east-fodder": 21, "east-grappler": 18, "east-mesmerizer": 16 };
  const orcNeed = () => here("east-fodder") < 21 || here("east-grappler") < 18 || here("east-mesmerizer") < 16;
  const orcRecipes = [
    ["east-fodder", "east-grappler", "east-mesmerizer"],
    ["east-fodder", "east-grappler"],
    ["east-fodder", "east-mesmerizer"],
    ["east-grappler", "east-mesmerizer"],
    ["east-fodder"],
    ["east-grappler"],
    ["east-mesmerizer"],
  ].map((ids) => ({ ids }));
  spread(loose, orcRecipes.map((recipe) => ({ ...recipe, region: orcSide })), (ids) => tallyOk(ids, orcCap), orcNeed, 0x31e1);
  if (orcNeed()) spread(loose, orcRecipes.map((recipe) => ({ ...recipe, region: orcWider })), (ids) => tallyOk(ids, orcCap), orcNeed, 0x31e2);

  const south = (x: number, z: number) => {
    const at = colRow(x, z);
    return at.row >= 8.45 && at.row <= 10.4 && at.col >= 5.7 && at.col <= 10.25;
  };
  const southWider = (x: number, z: number) => {
    const at = colRow(x, z);
    return at.row >= 7.7 && at.col >= 5.6 && at.col <= 10.3;
  };
  const sheepNeed = () => here("east-sheep") < 45;
  const sheepOk = (ids: string[]) => here("east-sheep") + ids.length <= 45;
  spread(
    loose,
    [
      { ids: ["east-sheep", "east-sheep", "east-sheep", "east-sheep"], region: south },
      { ids: ["east-sheep", "east-sheep", "east-sheep"], region: south },
      { ids: ["east-sheep", "east-sheep"], region: south },
    ],
    sheepOk,
    sheepNeed,
    0x51ee,
  );
  if (sheepNeed()) {
    spread(
      loose,
      [
        { ids: ["east-sheep", "east-sheep", "east-sheep"], region: southWider },
        { ids: ["east-sheep", "east-sheep"], region: southWider },
        { ids: ["east-sheep"], region: southWider },
      ],
      sheepOk,
      sheepNeed,
      0x51ef,
    );
  }

  const gobCap: Record<string, number> = { "east-thug": 21, "east-weaver": 14, "east-fisher": 4, "east-digger": 1 };
  const gobNeed = () => here("east-thug") < 21 || here("east-weaver") < 14;
  const paths = spots(8, eastPath);
  spread(
    paths,
    [
      { ids: ["east-thug", "east-weaver"] },
      { ids: ["east-thug", "east-thug"] },
      { ids: ["east-weaver", "east-weaver"] },
      { ids: ["east-thug"] },
      { ids: ["east-weaver"] },
    ],
    (ids) => tallyOk(ids, gobCap),
    gobNeed,
    0x60b1,
  );
  if (gobNeed()) {
    spread(
      loose,
      [
        { ids: ["east-thug", "east-weaver"] },
        { ids: ["east-thug"] },
        { ids: ["east-weaver"] },
      ],
      (ids) => tallyOk(ids, gobCap),
      gobNeed,
      0x60b2,
    );
  }
  const diggerNeed = () => here("east-digger") < 1;
  spread(paths, [{ ids: ["east-digger"] }], () => here("east-digger") < 1, diggerNeed, 0x60b3);
  if (diggerNeed()) spread(loose, [{ ids: ["east-digger"] }], () => here("east-digger") < 1, diggerNeed, 0x60b4);

  const central = (x: number, z: number) => {
    const at = colRow(x, z);
    return at.col >= 5.8 && at.col <= 10.2 && at.row >= 4.6 && at.row <= 10.2;
  };
  const beetleNeed = () => here("east-scarab") < 25;
  spread(
    loose,
    [
      { ids: ["east-scarab", "east-scarab"], region: central },
      { ids: ["east-scarab"], region: central },
    ],
    (ids) => here("east-scarab") + ids.length <= 25,
    beetleNeed,
    0xbe11,
  );
  const fungNeed = () => here("east-funguar") < 19;
  spread(
    loose,
    [
      { ids: ["east-funguar", "east-funguar"], region: central },
      { ids: ["east-funguar"], region: central },
    ],
    (ids) => here("east-funguar") + ids.length <= 19,
    fungNeed,
    0xf00d,
  );

  const gates = (x: number, z: number) => {
    const at = colRow(x, z);
    return at.col <= 7.2 || at.row <= 5.4 || at.row >= 9.2;
  };
  const field = spots(8);
  herds(
    field,
    [
      { id: "east-hare", want: 86, cluster: 3 },
      { id: "east-rabbit", want: 25, cluster: 3, region: gates },
      { id: "east-carrion", want: 30, cluster: 2 },
      { id: "east-tunnel", want: 14, cluster: 2, region: gates },
    ],
    0xea01,
  );
  herds(
    spots(6),
    [
      { id: "east-hare", want: 86, cluster: 2 },
      { id: "east-rabbit", want: 25, cluster: 2 },
      { id: "east-carrion", want: 30, cluster: 1 },
      { id: "east-tunnel", want: 14, cluster: 1 },
    ],
    0xea02,
  );

  for (const spot of banks) {
    if (here("east-pugil") >= 24) break;
    if (!canStand(spot.x, spot.z, specOf("east-pugil"), HERD_ROAM, "")) continue;
    addBody("east-pugil", spot.x, spot.z, "", "");
  }
  const fisherNeed = () => here("east-fisher") < 4;
  spread(banks, [{ ids: ["east-fisher"] }], () => here("east-fisher") < 4, fisherNeed, 0xf155);

  const night = spots(8);
  herds(
    night,
    [
      { id: "east-ding", want: 40, cluster: 3 },
      { id: "east-bones", want: 8, cluster: 2 },
      { id: "east-bones-drk", want: 6, cluster: 2 },
      { id: "east-hound", want: 10, cluster: 1 },
    ],
    0x190a,
  );
  const mouseNeed = () => here("east-mouse") < 21;
  spread(
    night,
    [{ ids: ["east-mouse", "east-mouse"] }, { ids: ["east-mouse"] }],
    (ids) => here("east-mouse") + ids.length <= 21,
    mouseNeed,
    0x190b,
  );
  herds(
    spots(6),
    [
      { id: "east-ding", want: 40, cluster: 2 },
      { id: "east-bones", want: 8, cluster: 1 },
      { id: "east-bones-drk", want: 6, cluster: 1 },
      { id: "east-hound", want: 10, cluster: 1 },
    ],
    0x190c,
  );
}

function tombGrid(story: 1 | 2 | 3): { x: number; z: number }[] {
  const box = story === 1
    ? { minX: 520, maxX: 860, minZ: 1080, maxZ: 1420 }
    : story === 2
      ? { minX: -700, maxX: -250, minZ: 1160, maxZ: 1420 }
      : { minX: 190, maxX: 330, minZ: 1560, maxZ: 1740 };
  const out: { x: number; z: number }[] = [];
  for (let x = box.minX; x <= box.maxX; x += 4.6) {
    for (let z = box.minZ; z <= box.maxZ; z += 4.6) {
      if (tombStory(x, z) !== story) continue;
      if (!inTomb(x, z, 1.35)) continue;
      if (story === 2 && Math.hypot(x - TOMB_HOLLOW.x, z - TOMB_HOLLOW.z) < 16) continue;
      out.push({ x, z });
    }
  }
  return out;
}

function tombDepth(story: 1 | 2 | 3, which: "shallow" | "deep" | "any"): { x: number; z: number }[] {
  const grid = tombGrid(story);
  if (which === "any" || grid.length < 2) return grid;
  const zs = grid.map((p) => p.z).sort((a, b) => a - b);
  const mid = zs[Math.floor(zs.length / 2)] ?? 0;
  return grid.filter((p) => (which === "shallow" ? p.z <= mid : p.z >= mid));
}

function tombSquares(story: 1 | 2 | 3, squares: string[]): { x: number; z: number }[] {
  return tombGrid(story).filter((p) => squares.includes(tombSquare(p.x, p.z)));
}

let tombSerial = 0;

function plantOne(id: string, x: number, z: number, link: string, ph: FieldBody["ph"]): boolean {
  const spec = specOf(id);
  const roam = spec.links ? 1.7 : 2.05;
  if (!canStand(x, z, spec, roam, link)) return false;
  addBody(id, x, z, link, ph);
  return true;
}

function plantParty(ids: string[], x: number, z: number, link: string, ph: FieldBody["ph"]): boolean {
  if (!ids.length) return false;
  const spec0 = specOf(ids[0]);
  const roam = spec0.links ? 1.55 : 2.05;
  if (tombStory(x, z) === 0 || !canStand(x, z, spec0, roam, link)) return false;
  const spots: { id: string; x: number; z: number }[] = [{ id: ids[0], x, z }];
  for (let i = 1; i < ids.length; i++) {
    const spec = specOf(ids[i]);
    let found = false;
    for (const rad of [5.3, 6.8]) {
      for (let turn = 0; turn < 8; turn++) {
        const ang = (i / ids.length) * Math.PI * 2 + turn * 0.72;
        const mx = x + Math.cos(ang) * rad;
        const mz = z + Math.sin(ang) * rad;
        if (tombStory(mx, mz) !== tombStory(x, z)) continue;
        if (!canStand(mx, mz, spec, roam, link)) continue;
        let crowded = false;
        for (const spot of spots) if (Math.hypot(spot.x - mx, spot.z - mz) < 5) crowded = true;
        if (crowded) continue;
        spots.push({ id: ids[i], x: mx, z: mz });
        found = true;
        break;
      }
      if (found) break;
    }
    if (!found) return false;
  }
  for (let i = 0; i < spots.length; i++) addBody(spots[i].id, spots[i].x, spots[i].z, link, i === 0 ? ph : "");
  return true;
}

function fillSpecies(id: string, spots: { x: number; z: number }[], want: number, cluster: number, ph: FieldBody["ph"] = ""): number {
  const spec = specOf(id);
  let placed = 0;
  for (const spot of spots) {
    if (placed >= want) break;
    if (spec.links && cluster > 1) {
      const room = Math.min(cluster, want - placed);
      const ids = Array.from({ length: room }, () => id);
      const link = `tomb-${id}-${tombSerial + 1}`;
      if (!plantParty(ids, spot.x, spot.z, link, placed === 0 ? ph : "")) continue;
      tombSerial += 1;
      placed += room;
    } else if (plantOne(id, spot.x, spot.z, spec.links ? `tomb-${id}-${++tombSerial}` : "", placed === 0 ? ph : "")) {
      placed += 1;
    }
  }
  return placed;
}

function buryCherry(): void {
  const cherry = live.find((body) => body.species === "tomb-cherry");
  if (!cherry) return;
  cherry.hp = 0;
  cherry.mode = "dead";
  cherry.anim = "dead";
  cherry.animLeft = 0;
  cherry.spoiled = true;
  cherry.respawn = 1e9;
  cherry.away = false;
  cherry.retired = false;
  cherry.claimed = false;
}

/** 75-era King Ranperre's Tomb. Small pops keep their squares. Herds take the halls that are left. */
function fillTomb(): void {
  if (live.some((body) => body.species.startsWith("tomb-"))) return;
  const shallow = tombDepth(1, "shallow");
  const deep = tombDepth(1, "deep");
  const upper = tombDepth(1, "any");
  const lower = tombDepth(2, "any");
  const crypt = tombDepth(2, "deep");
  const gear = tombDepth(3, "any");
  fillSpecies("tomb-ankou", tombSquares(1, ["J-8", "J-9", "I-8"]), 1, 1);
  fillSpecies("tomb-barbastelle", tombSquares(1, ["J-6", "J-7", "I-6", "K-6"]), 1, 1);
  fillSpecies("tomb-spook", tombSquares(1, ["I-10", "H-10", "I-9", "H-9"]), 1, 1);
  fillSpecies("tomb-cherry", tombSquares(2, ["H-8", "H-9", "G-8", "G-9"]), 1, 1);
  fillSpecies("tomb-sapling", tombSquares(2, ["H-8", "H-7", "H-9", "G-8", "I-8", "G-7", "I-7"]), 8, 4);
  fillSpecies("tomb-hati", tombSquares(2, ["J-8", "J-9", "I-8", "I-9", "K-8"]), 2, 1);
  fillSpecies("tomb-spartoi", tombSquares(2, ["I-8", "I-9", "J-8", "H-9", "J-7"]), 2, 2);
  fillSpecies("tomb-spartoi-sorc", tombSquares(2, ["I-9", "J-8", "J-9", "H-9", "I-8"]), 2, 2);
  fillSpecies("tomb-gruel", tombSquares(2, ["G-8", "G-9", "H-8", "F-8", "G-7"]), 2, 1);
  fillSpecies("tomb-gambler", lower, 4, 2);
  fillSpecies("tomb-leecher", lower, 4, 2);
  fillSpecies("tomb-mugger", lower, 4, 2);
  fillSpecies("tomb-bat", tombSquares(1, ["H-10", "G-10", "I-10", "H-9", "G-9"]), 3, 3, "crypt");
  fillSpecies("tomb-armet", gear, 5, 1);
  fillSpecies("tomb-scorpion", gear, 4, 1);
  fillSpecies("tomb-eyes", gear, 5, 1);
  fillSpecies("tomb-carrion", shallow, 19, 1);
  fillSpecies("tomb-ding", shallow, 30, 1);
  fillSpecies("tomb-mouse", shallow, 19, 2);
  fillSpecies("tomb-thug", shallow, 22, 2);
  fillSpecies("tomb-weaver", shallow, 21, 2);
  fillSpecies("tomb-stone", shallow, 6, 1);
  fillSpecies("tomb-wind", upper, 11, 2);
  fillSpecies("tomb-grave", upper, 20, 2);
  fillSpecies("tomb-bones", deep, 16, 2);
  fillSpecies("tomb-bones-drk", deep, 12, 2);
  fillSpecies("tomb-ambusher", deep, 13, 2);
  fillSpecies("tomb-butcher", deep, 13, 2);
  fillSpecies("tomb-tinkerer", deep, 13, 2);
  fillSpecies("tomb-plague", deep, 14, 2);
  fillSpecies("tomb-nach", deep, 12, 2, "gwyll");
  fillSpecies("tomb-nach-drk", deep, 8, 2, "gwyll");
  fillSpecies("tomb-rock", lower, 20, 1);
  fillSpecies("tomb-worm", crypt, 8, 1);
  fillSpecies("tomb-dire", lower, 13, 1);
  buryCherry();
}

export function assertRonfaure(): void {
  fillTomb();
  fillPass();
  fillDens();
  fillEast();
  const ids = Object.keys(SPECIES);
  if (ids.length < 24) throw new Error("ronfaure roster");
  const need = ["tunnel-worm", "wild-rabbit", "carrion-worm", "ding-bats", "forest-hare", "forest-funguar", "mouse-bat", "river-crab", "scarab-beetle", "orcish-fodder", "orcish-grappler", "orcish-mesmerizer", "goblin-thug", "goblin-weaver", "goblin-digger", "goblin-fisher", "enchanted-bones", "tainted-hound", "wild-sheep", "bomb", "amanita", "jaggedy-eared-jack", "fungus-beetle"];
  for (const id of need) if (!SPECIES[id]) throw new Error(`missing ${id}`);
  if (!ronfaureWindow("night-18", 20, false) || ronfaureWindow("night-18", 12, false)) throw new Error("bat window");
  if (!ronfaureWindow("day", 12, false) || ronfaureWindow("day", 3, false) || ronfaureWindow("day", 20, false)) throw new Error("day window");
  if (!ronfaureWindow("night-20", 22, false) || ronfaureWindow("night-20", 18, false)) throw new Error("undead window");
  if (!ronfaureWindow("fog", 1, true) || ronfaureWindow("fog", 1, false)) throw new Error("fog window");
  if (ronfaureFog(0) !== true || ronfaureFog(3) !== false) throw new Error("fog hours");
  const hare = bake(SPECIES["forest-hare"], 1);
  const orc = bake(SPECIES["orcish-fodder"], 8);
  if (hare.hp < 8 || hare.hp > 80) throw new Error(`hare hp ${hare.hp}`);
  if (orc.hp < 80 || orc.hp > 400) throw new Error(`orc hp ${orc.hp}`);
  if (SPECIES["river-crab"].moves.some((move) => move.name === "Big Scissors") !== true) throw new Error("crab kit");
  if (!SPECIES["tunnel-worm"].moves.some((move) => move.name === "Fluid Toss")) throw new Error("worm kit");
  const soft = fieldMagicDamage(16, 10, 8, 40, 8, "BLM");
  const hard = fieldMagicDamage(16, 80, 8, 40, 8, "BLM");
  if (!(hard > soft)) throw new Error(`int scaling ${soft} ${hard}`);
  const close = fieldMagicDamage(16, 40, 8, 40, 8, "BLM");
  const far = fieldMagicDamage(16, 40, 8, 40, 75, "BLM");
  if (!(far < close)) throw new Error(`level resist ${close} ${far}`);
  const war = fieldMagicDamage(16, 40, 8, 40, 8, "WAR");
  const blm = fieldMagicDamage(16, 40, 8, 40, 8, "BLM");
  if (!(blm > war)) throw new Error(`magic skill ${war} ${blm}`);
  let phJack = 0;
  let phBeetle = 0;
  const seen = new Set<string>();
  for (const body of live) {
    seen.add(body.species);
    if (ronfaureWet(body.spawnX, body.spawnZ)) throw new Error(`wet spawn ${body.id}`);
    if (inEast(body.spawnX, body.spawnZ, 0) && !eastDry(body.spawnX, body.spawnZ, 0)) throw new Error(`cheval spawn ${body.id}`);
    const home = body.species.startsWith("tomb-")
      ? "tomb"
      : body.species.startsWith("fort-") || body.species === "sentry-lizard" || body.species === "orcish-flamethrower" || body.species === "orcish-panzer" || body.species === "kegpaunch-doshgnosh"
      ? "fort"
      : body.species.startsWith("yug-") || body.species === "grotto-bats" || body.species === "stealth-bat" || body.species === "riding-lizard" || body.species === "morgawr"
        ? "yughott"
        : body.id.startsWith("spectacled-bats") || body.id.startsWith("watch-lizard") || body.id.startsWith("cheiroptera") || body.id.startsWith("ghelsba-") || body.id.startsWith("toadstool") || body.id.startsWith("orcish-stonelauncher") || body.id.startsWith("orcish-wallbreacher") || body.id.startsWith("orcish-barricader") || body.id.startsWith("warchief-vatgit") || body.id.startsWith("bloody-vrukwuk") || body.id.startsWith("thousandarm") || body.id.startsWith("fogweaver")
          ? "outpost"
          : body.species.startsWith("east-") || body.species === "bigmouth-billy" || body.species === "swamfisk" || body.species === "rambukk"
            ? "east"
            : body.species.startsWith("pass-")
              ? "pass"
            : "ronfaure";
    if (home === "tomb" && !inTomb(body.spawnX, body.spawnZ, 0)) throw new Error(`tomb miss ${body.id}`);
    else if (home === "fort" && !inFort(body.spawnX, body.spawnZ, 0)) throw new Error(`fort miss ${body.id}`);
    else if (home === "yughott" && !inYughott(body.spawnX, body.spawnZ, 0)) throw new Error(`grotto miss ${body.id}`);
    else if (home === "outpost" && !inGhelsba(body.spawnX, body.spawnZ, 0)) throw new Error(`outpost miss ${body.id}`);
    else if (home === "east" && !inEast(body.spawnX, body.spawnZ, 0)) throw new Error(`east miss ${body.id}`);
    else if (home === "pass" && !inPass(body.spawnX, body.spawnZ, 0)) throw new Error(`pass miss ${body.id}`);
    else if (home === "ronfaure" && !inRonfaure(body.spawnX, body.spawnZ)) throw new Error(`outside ${body.id}`);
    if (body.hp <= 0 && body.species !== "tomb-cherry") throw new Error(`empty ${body.id}`);
    if (body.look === "worm" && body.burrow !== "up") {
      if (body.pause >= 0) throw new Error(`worm clock ${body.id}`);
    } else {
      const stand = standSpan(body.family);
      if (body.pause < stand.lo || body.pause > stand.hi) throw new Error(`stand ${body.family} ${body.pause}`);
      if (body.index !== 0) throw new Error(`already walking ${body.id}`);
    }
    if (body.ph === "jack") phJack += 1;
    if (body.ph === "beetle") phBeetle += 1;
  }
  for (const id of need) {
    if (id === "jaggedy-eared-jack" || id === "fungus-beetle") continue;
    if (!seen.has(id)) throw new Error(`unspawned ${id}`);
  }
  if (seen.has("jaggedy-eared-jack") || seen.has("fungus-beetle")) throw new Error("lottery spawned early");
  if (phJack < 3 || phBeetle < 1) throw new Error("placeholders");
  const amanita = live.find((body) => body.species === "amanita");
  if (!amanita) throw new Error("amanita");
  const cell = ronCell(7, 6);
  if (Math.hypot(amanita.spawnX - cell.x, amanita.spawnZ - cell.z) > 20) throw new Error("amanita square");
  if (Math.hypot(110 - 102, 600 - 594) < 1) throw new Error("fisher on the bridge");
  if (ronfaureWet(110, 600)) throw new Error("ford marked wet");
  if (!ronfaureWindow("always", 3, false)) throw new Error("always window");
  const ghelsbaNeed = ["spectacled-bats", "watch-lizard", "cheiroptera", "ghelsba-pugil", "toadstool", "ghelsba-fodder", "ghelsba-grappler", "ghelsba-mesmerizer", "orcish-stonelauncher", "ghelsba-grunt", "ghelsba-neck", "ghelsba-chuck", "warchief-vatgit", "bloody-vrukwuk", "orcish-wallbreacher", "orcish-barricader"];
  for (const id of ghelsbaNeed) {
    if (!SPECIES[id]) throw new Error(`missing ${id}`);
    if (!seen.has(id)) throw new Error(`unspawned ${id}`);
  }
  if (seen.has("thousandarm-deshglesh") || seen.has("fogweaver-mozzfuzz") || seen.has("hundredscar-hajwaj") || seen.has("ashmaker-gotblut") || seen.has("chariotbuster-byakzak")) throw new Error("ghelsba lottery spawned early");
  if (SPECIES["ghelsba-fodder"].levelMin !== 3 || SPECIES["ghelsba-fodder"].levelMax !== 9) throw new Error("fodder levels");
  if (SPECIES["fort-fodder"].levelMin !== 8 || SPECIES["fort-fodder"].levelMax !== 10) throw new Error("fort fodder levels");
  if (SPECIES["yug-grunt"].levelMin !== 14 || SPECIES["yug-grunt"].levelMax !== 18) throw new Error("grotto grunt levels");
  if (SPECIES["orcish-barricader"].levelMax !== 18 || SPECIES["warchief-vatgit"].levelMin !== 16) throw new Error("nm levels");
  if (!SPECIES["watch-lizard"].moves.some((move) => move.name === "Tail Blow") || !SPECIES["ghelsba-pugil"].moves.some((move) => move.name === "Screwdriver")) throw new Error("beast kit");
  if (!SPECIES["sentry-lizard"].moves.some((move) => move.name === "Tail Blow") || !SPECIES["orcish-flamethrower"].moves.some((move) => move.name === "Arm Cannon")) throw new Error("fort kit");
  if (!SPECIES["orcish-wallbreacher"].drops.some((drop) => drop.id === "strike-baghnakhs")) throw new Error("wallbreacher drop");
  if (!SPECIES["chariotbuster-byakzak"].drops.some((drop) => drop.id === "auriga-xiphos" && drop.always)) throw new Error("byakzak drop");
  const fortNeed = ["fort-fodder", "fort-grappler", "fort-mesmerizer", "fort-grunt", "fort-neck", "fort-chuck", "fort-cursemaker", "fort-fighter", "fort-serjeant", "sentry-lizard", "orcish-flamethrower", "fort-spectacled", "fort-cheiroptera", "orcish-panzer", "kegpaunch-doshgnosh"];
  const yugNeed = ["grotto-bats", "stealth-bat", "riding-lizard", "yug-grunt", "yug-neck", "yug-chuck", "yug-cursemaker", "yug-fighter", "yug-serjeant"];
  for (const id of [...fortNeed, ...yugNeed]) {
    if (!SPECIES[id]) throw new Error(`missing ${id}`);
    if (!seen.has(id)) throw new Error(`unspawned ${id}`);
  }
  let phHaj = 0;
  let phAsh = 0;
  for (const body of live) {
    if (body.ph === "haj") phHaj += 1;
    if (body.ph === "ash") phAsh += 1;
  }
  if (phHaj < 2 || phAsh < 2) throw new Error("den placeholders");
  const outpostBodies = live.filter((body) => inGhelsba(body.spawnX, body.spawnZ, 0));
  let phDesh = 0;
  const stackGrid = new Map<number, number[]>();
  for (let i = 0; i < live.length; i++) pushGrid(stackGrid, live[i].spawnX, live[i].spawnZ, i);
  for (let i = 0; i < live.length; i++) {
    const a = live[i];
    const specA = specOf(a.species);
    if (a.ph === "desh") phDesh += 1;
    if (blocksLanding(a.spawnX, a.spawnZ, specA.detect.aggressive, roamOf(a))) throw new Error(`landing aggro ${a.id}`);
    if (specA.detect.aggressive) {
      for (const point of a.points) {
        if (blocksLanding(point.x, point.z, true, 0)) throw new Error(`patrol aggro ${a.id}`);
      }
    }
    const stacked = visitGrid(stackGrid, a.spawnX, a.spawnZ, 1, (j) => {
      if (j <= i) return false;
      const b = live[j];
      const specB = specOf(b.species);
      const gap = seatGap(
        { x: a.spawnX, z: a.spawnZ, link: a.link, links: specA.links, window: specA.window },
        { x: b.spawnX, z: b.spawnZ, link: b.link, links: specB.links, window: specB.window },
      ) - 0.6;
      return Math.hypot(a.spawnX - b.spawnX, a.spawnZ - b.spawnZ) < gap;
    });
    if (stacked) throw new Error(`stacked ${a.id}`);
  }
  if (phDesh < 3) throw new Error("desh placeholders");
  const westWant: [string, number][] = [
    ["tunnel-worm", 13],
    ["wild-rabbit", 27],
    ["carrion-worm", 36],
    ["ding-bats", 42],
    ["forest-hare", 75],
    ["forest-funguar", 15],
    ["mouse-bat", 26],
    ["river-crab", 8],
    ["scarab-beetle", 22],
    ["orcish-fodder", 12],
    ["orcish-grappler", 9],
    ["orcish-mesmerizer", 9],
    ["goblin-thug", 18],
    ["goblin-weaver", 15],
    ["goblin-digger", 1],
    ["goblin-fisher", 4],
    ["enchanted-bones", 8],
    ["enchanted-bones-drk", 7],
    ["tainted-hound", 7],
    ["wild-sheep", 32],
    ["bomb", 3],
  ];
  const short: string[] = [];
  for (const [id, want] of westWant) {
    const n = westCount(id);
    if (n < want) short.push(`${id} ${n}/${want}`);
  }
  if (short.length) throw new Error(`west short ${short.join(", ")}`);
  const denWant: [string, number][] = [
    ["ghelsba-fodder", 37],
    ["ghelsba-grappler", 38],
    ["ghelsba-mesmerizer", 34],
    ["ghelsba-grunt", 22],
    ["ghelsba-neck", 33],
    ["ghelsba-chuck", 19],
    ["orcish-stonelauncher", 10],
    ["watch-lizard", 18],
    ["toadstool", 13],
    ["spectacled-bats", 11],
    ["cheiroptera", 21],
    ["ghelsba-pugil", 15],
    ["fort-fodder", 19],
    ["fort-grappler", 20],
    ["fort-mesmerizer", 15],
    ["fort-grunt", 32],
    ["fort-neck", 33],
    ["fort-chuck", 28],
    ["fort-cursemaker", 3],
    ["fort-fighter", 2],
    ["fort-serjeant", 1],
    ["orcish-flamethrower", 8],
    ["sentry-lizard", 8],
    ["fort-spectacled", 15],
    ["fort-cheiroptera", 20],
    ["yug-grunt", 32],
    ["yug-neck", 29],
    ["yug-chuck", 30],
    ["yug-cursemaker", 18],
    ["yug-fighter", 7],
    ["yug-serjeant", 2],
    ["grotto-bats", 27],
    ["stealth-bat", 19],
    ["riding-lizard", 9],
  ];
  const denShort: string[] = [];
  for (const [id, want] of denWant) {
    const n = westCount(id);
    if (n < want) denShort.push(`${id} ${n}/${want}`);
  }
  if (denShort.length) throw new Error(`den short ${denShort.join(", ")}`);
  const nearNode = (species: string, at: { x: number; z: number }, label: string) => {
    const body = liveField().find((row) => row.species === species && Math.hypot(row.spawnX - at.x, row.spawnZ - at.z) <= 2.05);
    if (!body) throw new Error(`${label} left its node`);
    if (Math.hypot(body.spawnX - at.x, body.spawnZ - at.z) < 0.35) throw new Error(`${label} on the centreline`);
  };
  nearNode("orcish-panzer", fortPoi("nm_orcish_panzer"), "panzer");
  nearNode("fort-grappler", fortPoi("nm_hundredscar_hajwaj"), "hajwaj");
  nearNode("yug-grunt", yughottPoi("nm_ashmaker_gotblut", 1), "ashmaker");
  nearNode("morgawr", yughottNode(2, "area_se"), "morgawr");
  const eastWant: [string, number][] = [
    ["east-tunnel", 14],
    ["east-rabbit", 25],
    ["east-carrion", 30],
    ["east-ding", 40],
    ["east-hare", 86],
    ["east-funguar", 19],
    ["east-mouse", 21],
    ["east-scarab", 25],
    ["east-fisher", 4],
    ["east-thug", 21],
    ["east-weaver", 14],
    ["east-digger", 1],
    ["east-fodder", 21],
    ["east-grappler", 18],
    ["east-mesmerizer", 16],
    ["east-bones", 8],
    ["east-bones-drk", 6],
    ["east-hound", 10],
    ["east-sheep", 45],
    ["east-bomb", 3],
    ["east-pugil", 24],
    ["rambukk", 1],
  ];
  const eastShort: string[] = [];
  let phBilly = 0;
  let phSwam = 0;
  for (const body of live) {
    if (!inEast(body.spawnX, body.spawnZ, 0)) continue;
    if (body.ph === "billy") phBilly += 1;
    if (body.ph === "swam") phSwam += 1;
  }
  for (const [id, want] of eastWant) {
    let count = 0;
    for (const body of live) if (body.species === id && inEast(body.spawnX, body.spawnZ, 0)) count += 1;
    if (count < want) eastShort.push(`${id} ${count}/${want}`);
  }
  if (eastShort.length) throw new Error(`east short ${eastShort.join(", ")}`);
  if (phBilly < 3 || phSwam < 4) throw new Error(`east placeholders billy ${phBilly} swam ${phSwam}`);
  const ram = live.find((body) => body.species === "rambukk");
  const ramAt = eastAt(7.25, 7.55);
  if (!ram || Math.hypot(ram.spawnX - ramAt.x, ram.spawnZ - ramAt.z) > 36) throw new Error("rambukk square");
  if (ram.level < 12 || ram.level > 15 || !ram.nm) throw new Error("rambukk level");
  if (!SPECIES["bigmouth-billy"].moves.some((move) => move.name === "Sandspin") || !SPECIES["bigmouth-billy"].moves.some((move) => move.name === "Fluid Toss")) throw new Error("billy kit");
  if (!SPECIES["swamfisk"].moves.some((move) => move.name === "Water Wall") || !SPECIES["swamfisk"].drops.some((drop) => drop.id === "gelong-staff" && drop.always)) throw new Error("swamfisk kit");
  if (!SPECIES["rambukk"].moves.some((move) => move.name === "Ram Charge") || !SPECIES["east-pugil"].moves.some((move) => move.name === "Screwdriver")) throw new Error("east kit");
  if (SPECIES["east-hare"].levelMin !== 1 || SPECIES["east-fodder"].levelMax !== 8 || SPECIES["east-pugil"].levelMax !== 5) throw new Error("east levels");
  if (seen.has("bigmouth-billy") || seen.has("swamfisk")) throw new Error("east lottery spawned early");
  let fillerSight = 0;
  const sightGrid = new Map<number, number[]>();
  const sightIds: number[] = [];
  for (let i = 0; i < live.length; i++) {
    const a = live[i];
    if (!a.link.startsWith("fill-")) continue;
    if (inOrc(a.spawnX, a.spawnZ, 0)) continue;
    const specA2 = specOf(a.species);
    if (!specA2.links || !specA2.detect.sight) continue;
    sightIds.push(i);
    pushGrid(sightGrid, a.spawnX, a.spawnZ, i);
  }
  for (const i of sightIds) {
    const a = live[i];
    const specA2 = specOf(a.species);
    fillerSight += visitGrid(sightGrid, a.spawnX, a.spawnZ, 2, (j) => {
      if (j <= i) return false;
      const b = live[j];
      if (a.link === b.link) return false;
      const specB2 = specOf(b.species);
      if (!specB2.links || !specB2.detect.sight || specB2.family !== specA2.family) return false;
      if (!windowsShare(specA2.window, specB2.window)) return false;
      return Math.hypot(a.spawnX - b.spawnX, a.spawnZ - b.spawnZ) < 15;
    }) ? 1 : 0;
    if (fillerSight) break;
  }
  if (fillerSight) throw new Error(`west sight chain ${fillerSight}`);
  if (outpostBodies.length < 16) throw new Error("outpost emptied");
  for (const body of live) {
    const card = fieldCard(body);
    if (card.name !== body.name || card.level !== body.level || card.hpNatural !== body.maxHp || card.defense < 1 || card.evasion < 1) {
      throw new Error(`field card ${body.id}`);
    }
  }
  const sample = live.find((body) => body.species === "cheiroptera");
  if (!sample) throw new Error("cheiroptera");
  const pocket = peekFieldSteal(sample.id, "item", 75, 0, () => 0);
  if (!pocket || pocket.name !== "Cheiroptera" || pocket.item?.id !== "bat-wing") throw new Error(`steal ${pocket?.name ?? "none"} ${pocket?.item?.id ?? ""}`);
  const hp = sample.hp;
  const parked = { x: sample.x, z: sample.z, mode: sample.mode, claimed: sample.claimed, aggro: sample.hadAggro };
  sample.x = 0;
  sample.z = 0;
  sample.mode = "roam";
  sample.claimed = false;
  sample.hadAggro = false;
  try {
    if (selectField(sample.id) !== "selected" || readFieldPlate().id !== sample.id) throw new Error("field select");
    if (toggleFieldEngage() !== "claim" || (sample.mode as FieldBody["mode"]) !== "chase" || !sample.claimed || !readFieldPlate().claimed) {
      throw new Error("too-weak engage did not answer");
    }
    if (toggleFieldEngage() !== "release" || readFieldPlate().claimed || (sample.mode as FieldBody["mode"]) !== "chase" || !sample.claimed) {
      throw new Error("too-weak disengage walked off");
    }
    sample.mode = "roam";
    sample.claimed = false;
    sample.hadAggro = false;
    sample.x = 9;
    if (toggleFieldEngage() !== "claim" || sample.mode !== "roam" || !readFieldPlate().claimed) {
      throw new Error("engage did not draw");
    }
    if (toggleFieldEngage() !== "release" || sample.mode !== "roam" || sample.claimed) {
      throw new Error("drawn engage pulled");
    }
    sample.x = 40;
    if (toggleFieldEngage() !== "far" || sample.mode !== "roam" || claimedId) throw new Error("engage out of range");
    if (hurtField(sample.id, 1) || sample.hp !== hp - 1 || (sample.mode as FieldBody["mode"]) !== "chase" || !sample.claimed) {
      throw new Error("a hit did not call the monster");
    }
    sample.hp = hp;
    const foe = live.find((body) => body.species === "fort-fighter" && body.hp > 0);
    if (!foe) throw new Error("fighter engage");
    const foePark = { x: foe.x, z: foe.z, level: foe.level, mode: foe.mode, claimed: foe.claimed, aggro: foe.hadAggro };
    foe.x = 0;
    foe.z = 0;
    foe.level = 70;
    foe.mode = "roam";
    foe.claimed = false;
    foe.hadAggro = false;
    try {
      clearField();
      if (selectField(foe.id) !== "selected") throw new Error("fighter select");
      if (toggleFieldEngage() !== "claim" || (foe.mode as FieldBody["mode"]) !== "chase" || !foe.claimed) throw new Error("engage did not start the fight");
      if (toggleFieldEngage() !== "release" || (foe.mode as FieldBody["mode"]) !== "chase" || !foe.claimed || readFieldPlate().claimed) {
        throw new Error("disengage sent the monster home");
      }
      foe.mode = "roam";
      foe.claimed = false;
      foe.hadAggro = false;
      foe.x = 40;
      if (toggleFieldEngage() !== "far" || foe.mode !== "roam") throw new Error("level engage pulled");
    } finally {
      foe.x = foePark.x;
      foe.z = foePark.z;
      foe.level = foePark.level;
      foe.mode = foePark.mode;
      foe.claimed = foePark.claimed;
      foe.hadAggro = foePark.aggro;
      fightAge.delete(foe.id);
      clearField();
    }
  } finally {
    sample.x = parked.x;
    sample.z = parked.z;
    sample.hp = hp;
    sample.mode = parked.mode;
    sample.claimed = parked.claimed;
    sample.hadAggro = parked.aggro;
    fightAge.delete(sample.id);
    clearField();
  }
  if (readFieldPlate().id) throw new Error("field clear");
  const party = live.filter((body) => body.link === "orc-e5");
  const fortParty = live.filter((body) => body.link === "fort-i8");
  const h8Party = live.filter((body) => body.link === "orc-h8");
  if (party.length < 3 || fortParty.length < 3 || h8Party.length < 3) throw new Error("link party");
  const fodder = party.find((body) => body.species === "orcish-fodder");
  const grap = party.find((body) => body.species === "orcish-grappler");
  if (!fodder || !grap) throw new Error("orc party");
  const kept = {
    fx: fodder.x, fz: fodder.z, fmode: fodder.mode, fyaw: fodder.yaw, fclaim: fodder.claimed, faggro: fodder.hadAggro,
    gx: grap.x, gz: grap.z, gmode: grap.mode, gyaw: grap.yaw, gclaim: grap.claimed, gagro: grap.hadAggro,
  };
  const savedSolid = solidAt;
  try {
    const x0 = fodder.spawnX;
    const z0 = fodder.spawnZ;
    fodder.x = x0;
    fodder.z = z0;
    grap.x = x0 + 6.6;
    grap.z = z0;
    grap.yaw = faceYaw(grap.x, grap.z, fodder.x, fodder.z);
    fodder.mode = "chase";
    fodder.claimed = true;
    fightAge.set(fodder.id, 0);
    const early: FieldEvent[] = [];
    tickLinks(fodder.level, early);
    if (grap.mode !== "roam") throw new Error("link ignored the pull window");
    fightAge.set(fodder.id, LINK_DELAY);
    const heard: FieldEvent[] = [];
    tickLinks(fodder.level, heard);
    if ((grap.mode as FieldBody["mode"]) !== "chase" || !heard.some((row) => row.type === "log" && row.text.includes("links"))) throw new Error("camp did not link");
    grap.mode = "roam";
    grap.claimed = false;
    grap.hadAggro = false;
    fodder.x = x0 + 22;
    const dragged: FieldEvent[] = [];
    tickLinks(fodder.level, dragged);
    if (grap.mode !== "roam") throw new Error("dragged pull still linked");
    fodder.x = x0;
    solidAt = (x, z) => Math.abs(x - (x0 + 3.3)) < 0.6 && Math.abs(z - z0) < 2;
    const blocked: FieldEvent[] = [];
    tickLinks(fodder.level, blocked);
    if (grap.mode !== "roam") throw new Error("wall did not block the link");
    solidAt = savedSolid;
    fodder.x = x0;
    const weak: FieldEvent[] = [];
    tickLinks(75, weak);
    if (grap.mode !== "roam") throw new Error("too-weak linked");
  } finally {
    solidAt = savedSolid;
    fodder.x = kept.fx;
    fodder.z = kept.fz;
    fodder.mode = kept.fmode;
    fodder.yaw = kept.fyaw;
    fodder.claimed = kept.fclaim;
    fodder.hadAggro = kept.faggro;
    grap.x = kept.gx;
    grap.z = kept.gz;
    grap.mode = kept.gmode;
    grap.yaw = kept.gyaw;
    grap.claimed = kept.gclaim;
    grap.hadAggro = kept.gagro;
    fightAge.delete(fodder.id);
    fightAge.delete(grap.id);
  }
  if (LOTTERY_CHANCE !== 0.25 || NM_MIN !== 30 * 60 || NM_MAX !== 30 * 60) throw new Error("nm window");
  if (nmWait(() => 0) !== NM_MIN || nmWait(() => 1) !== NM_MAX) throw new Error("nm wait");
  for (const row of LOTTERY) {
    if (!SPECIES[row.nm]?.nm) throw new Error(`lottery nm ${row.nm}`);
    if (!live.some((body) => body.ph === row.ph && body.species === row.species)) throw new Error(`missing ph ${row.ph}`);
    if (seen.has(row.nm)) throw new Error(`lottery spawned early ${row.nm}`);
    const model = nmCampModel(row.nm);
    if (!model || model.ph !== row.species || model.popChance !== LOTTERY_CHANCE || model.cooldown !== 30 * 60) throw new Error(`camp model ${row.nm}`);
  }
  const harePh = live.find((body) => body.ph === "jack" && body.hp > 0);
  if (!harePh) throw new Error("jack placeholder");
  const snap = { hp: harePh.hp, mode: harePh.mode, anim: harePh.anim };
  harePh.hp = 0;
  harePh.mode = "dead";
  harePh.spoiled = true;
  harePh.respawn = 0;
  const noise: FieldEvent[] = [];
  try {
    if (tryLottery(harePh, noise, () => 0.25) || harePh.held) throw new Error("lottery edge");
    if (!tryLottery(harePh, noise, () => 0) || !harePh.held) throw new Error("lottery pop");
    const jack = live.find((body) => body.species === "jaggedy-eared-jack" && !body.retired);
    if (!jack || !noise.some((row) => row.type === "log" && row.text.includes("Jaggedy-Eared Jack"))) throw new Error("jack placeholder swap");
    jack.retired = true;
    jack.away = true;
    jack.hp = 0;
    sealLottery("jaggedy-eared-jack", "jack");
    if (harePh.held || (windowAt.get("jaggedy-eared-jack") ?? 0) < NM_MIN) throw new Error("jack window");
    harePh.respawn = 0;
    if (tryLottery(harePh, noise, () => 0)) throw new Error("jack window blocked");
  } finally {
    const jack = live.find((body) => body.species === "jaggedy-eared-jack");
    if (jack) {
      const at = live.indexOf(jack);
      if (at >= 0) {
        live.splice(at, 1);
        born.set(jack.species, (born.get(jack.species) ?? 1) - 1);
      }
    }
    windowAt.delete("jaggedy-eared-jack");
    harePh.hp = snap.hp;
    harePh.maxHp = snap.hp;
    harePh.mode = snap.mode;
    harePh.spoiled = false;
    harePh.held = false;
    harePh.respawn = 0;
    harePh.anim = snap.anim;
    harePh.away = false;
    harePh.retired = false;
    harePh.claimed = false;
    if (selectedId === harePh.id) selectedId = null;
  }
  assertFieldPlayerTp();
  assertFieldSneak();
  assertFieldFacing();
  if (selectedId || claimedId) throw new Error("field assert left a target");
  const tombNeed: [string, number][] = [
    ["tomb-carrion", 19],
    ["tomb-ding", 30],
    ["tomb-mouse", 19],
    ["tomb-thug", 22],
    ["tomb-weaver", 21],
    ["tomb-stone", 6],
    ["tomb-wind", 11],
    ["tomb-grave", 20],
    ["tomb-bones", 16],
    ["tomb-bones-drk", 12],
    ["tomb-ambusher", 13],
    ["tomb-butcher", 13],
    ["tomb-tinkerer", 13],
    ["tomb-plague", 14],
    ["tomb-nach", 12],
    ["tomb-nach-drk", 8],
    ["tomb-bat", 3],
    ["tomb-spook", 1],
    ["tomb-ankou", 1],
    ["tomb-barbastelle", 1],
    ["tomb-rock", 20],
    ["tomb-worm", 8],
    ["tomb-dire", 13],
    ["tomb-gambler", 4],
    ["tomb-leecher", 4],
    ["tomb-mugger", 4],
    ["tomb-gruel", 2],
    ["tomb-sapling", 8],
    ["tomb-cherry", 1],
    ["tomb-hati", 2],
    ["tomb-spartoi", 2],
    ["tomb-spartoi-sorc", 2],
    ["tomb-armet", 5],
    ["tomb-scorpion", 4],
    ["tomb-eyes", 5],
  ];
  const tombShort: string[] = [];
  for (const [id, want] of tombNeed) {
    let n = 0;
    for (const body of live) if (body.species === id) n += 1;
    if (n !== want) tombShort.push(`${id} ${n}/${want}`);
  }
  if (tombShort.length) throw new Error(`tomb count ${tombShort.join(", ")}`);
  const cherry = live.find((body) => body.species === "tomb-cherry");
  if (!cherry || cherry.hp !== 0 || cherry.mode !== "dead" || !inTomb(cherry.spawnX, cherry.spawnZ, 0)) throw new Error("cherry should be down");
  if (tombStory(cherry.spawnX, cherry.spawnZ) === tombStory(live.find((body) => body.species === "tomb-carrion")?.spawnX ?? 0, live.find((body) => body.species === "tomb-carrion")?.spawnZ ?? 0)) {
    throw new Error("worms climbed into the cherry crypt");
  }
  if (!live.some((body) => body.ph === "crypt" && body.species === "tomb-bat")) throw new Error("crypt placeholder");
  if (!live.some((body) => body.ph === "gwyll")) throw new Error("gwyllgi placeholder");
  if (Math.hypot((live.find((body) => body.species === "tomb-hati")?.spawnX ?? 0) - TOMB_HOLLOW.x, (live.find((body) => body.species === "tomb-hati")?.spawnZ ?? 0) - TOMB_HOLLOW.z) < 14) {
    throw new Error("hati stood in the hollow");
  }
  const passNeed: [string, number][] = [
    ["pass-wind", 5],
    ["pass-blade", 6],
    ["pass-thug", 2],
    ["pass-weaver", 3],
    ["pass-oil", 2],
    ["pass-seeker", 30],
    ["pass-gambler", 6],
    ["pass-leecher", 7],
    ["pass-mugger", 8],
    ["pass-ooze", 5],
    ["pass-cave-scorpion", 2],
    ["pass-stirge", 41],
    ["pass-hecteyes", 5],
    ["pass-pathfinder", 3],
    ["pass-bats", 3],
    ["pass-shaman", 3],
    ["pass-smithy", 3],
    ["pass-furrier", 3],
    ["pass-floating-eye", 5],
    ["pass-evil-weapon", 3],
    ["pass-taisai", 3],
    ["pass-giant-scorpion", 2],
    ["pass-bat-eye", 0],
    ["pass-mucoid", 1],
  ];
  const passShort: string[] = [];
  for (const [id, want] of passNeed) {
    let n = 0;
    for (const body of live) if (body.species === id && inPass(body.spawnX, body.spawnZ, 0)) n += 1;
    if (n !== want) passShort.push(`${id} ${n}/${want}`);
  }
  if (passShort.length) throw new Error(`pass count ${passShort.join(", ")}`);
  const blade = SPECIES["pass-blade"];
  const stirge = SPECIES["pass-stirge"];
  const gambler = SPECIES["pass-gambler"];
  const leecher = SPECIES["pass-leecher"];
  const weapon = SPECIES["pass-evil-weapon"];
  if (blade.levelMin !== 4 || blade.levelMax !== 7 || !blade.moves.some((move) => move.name === "Blood Drain")) throw new Error("blade kit");
  if (stirge.levelMin !== 30 || !stirge.links || !stirge.moves.some((move) => move.name === "Sonic Wave") || !stirge.moves.some((move) => move.name === "Jet Stream")) throw new Error("stirge kit");
  if (gambler.job !== "BLM" || !gambler.spells.some((move) => move.name === "Stone II") || !gambler.spells.some((move) => move.name === "Sleep")) throw new Error("gambler kit");
  if (leecher.job !== "WHM" || !leecher.spells.some((move) => move.name === "Cure") || !leecher.spells.some((move) => move.name === "Protect")) throw new Error("leecher kit");
  if (!weapon.detect.magic || !weapon.detect.sound || weapon.detect.sight) throw new Error("evil weapon senses");
  if (!weapon.moves.some((move) => move.name === "Arcane Stomp") || !weapon.moves.some((move) => move.name === "Shield Strike")) throw new Error("evil weapon kit");
  if (SPECIES["pass-seeker"].detect.aggressive || !SPECIES["pass-seeker"].links) throw new Error("seeker bats should link, not aggro");
  if (SPECIES["pass-wind"].detect.aggressive) throw new Error("wind bats aggro");
  if (SPECIES["pass-pathfinder"].job !== "BST" || SPECIES["pass-furrier"].job !== "RNG" || SPECIES["pass-smithy"].job !== "WAR") throw new Error("goblin jobs");
  if (!SPECIES["pass-taisaijin"].moves.some((move) => move.name === "Eyes On Me") || SPECIES["pass-taisaijin"].levelMin !== 60) throw new Error("taisaijin kit");
  const taisaiDrops = SPECIES["pass-taisaijin"].drops;
  const refresh = taisaiDrops.filter((drop) => drop.slot === "refresh");
  const refreshI = refresh.find((drop) => drop.id === "scroll-of-refresh");
  const refreshII = refresh.find((drop) => drop.id === "scroll-of-refresh-ii");
  if (refresh.length !== 2 || !refreshI || !refreshII || (refreshI.weight ?? 0) <= (refreshII.weight ?? 0) || refresh.some((drop) => drop.tier)) throw new Error("taisaijin scroll");
  const taisaiRolls = [0, 0.2, 0.79, 0.8, 0.99].map((n) => rollSpeciesItems("pass-taisaijin", 0, () => n).filter((item) => item.id.startsWith("scroll-of-refresh")));
  if (taisaiRolls.some((pile) => pile.length !== 1)) throw new Error("taisaijin scroll count");
  if (taisaiRolls[0]?.[0]?.id !== "scroll-of-refresh" || taisaiRolls[4]?.[0]?.id !== "scroll-of-refresh-ii") throw new Error("taisaijin scroll weight");
  if (SPECIES["pass-gloom"].moves.map((move) => move.name).join(",") !== "Blind Eye,Eyes On Me" || SPECIES["pass-gloom"].levelMin !== 73) throw new Error("gloom eye");
  if (!SPECIES["pass-gloom"].drops.some((drop) => drop.id === "wit-pendant")) throw new Error("gloom eye");
  const booster = SPECIES["pass-hyakume"].drops.find((drop) => drop.id === "booster-earring");
  if (!booster || booster.tier !== "common" || dropRate(booster.tier, 0) !== 0.15) throw new Error("hyakume");
  const ecu = SPECIES["pass-mucoid"].drops.find((drop) => drop.id === "spellcasters-ecu");
  if (!ecu || ecu.tier !== "common" || dropRate(ecu.tier, 0) !== 0.15 || SPECIES["pass-mucoid"].job !== "DRK") throw new Error("mucoid mass");
  const mucoid = nmCampModel("pass-mucoid");
  if (!mucoid || mucoid.ph !== null || mucoid.popChance !== 1 || mucoid.cooldown !== 30 * 60) throw new Error("mucoid camp");
  if (nmCampModel("forest-hare") !== null) throw new Error("hare is not an nm");
  const batSpec = SPECIES["pass-bat-eye"];
  const storm = batSpec.drops.find((drop) => drop.id === "storm-axe");
  if (!storm || storm.tier !== "rare" || batSpec.nm || batSpec.job !== "WAR" || batSpec.respawn !== RESPAWN) throw new Error("bat eye");
  const share = live.filter((body) => body.link === H5_SHARE);
  if (share.length !== 1) throw new Error("bat eye stand");
  const point = share[0];
  if (!point || passSquare(point.spawnX, point.spawnZ) !== "H-5" || passWet(point.spawnX, point.spawnZ)) throw new Error("bat eye stand");
  if (point.species !== "pass-giant-scorpion" && point.species !== "pass-bat-eye") throw new Error("bat eye stand");
  if (live.some((body) => body.species === "pass-bat-eye" && (body.link !== H5_SHARE || passSquare(body.spawnX, body.spawnZ) !== "H-5"))) {
    throw new Error("bat eye stood off H-5");
  }
  const dedicated = live.filter((body) => body.species === "pass-giant-scorpion" && body.link !== H5_SHARE);
  if (dedicated.length !== 1 || dedicated.some((body) => passSquare(body.spawnX, body.spawnZ) === "H-5")) throw new Error("giant scorpion deep");
  const keptLevel = point.level;
  restyle(point, "pass-bat-eye");
  try {
    if (point.species !== "pass-bat-eye" || point.nm || point.level < 42 || point.level > 44 || point.respawnMax !== RESPAWN) throw new Error("bat eye stand");
    if (passSquare(point.spawnX, point.spawnZ) !== "H-5" || live.filter((body) => body.species === "pass-bat-eye").length !== 1) throw new Error("bat eye stood off H-5");
  } finally {
    restyle(point, "pass-giant-scorpion", keptLevel);
  }
  if (shareSpecies(() => 0) !== "pass-giant-scorpion" || shareSpecies(() => 0.749) !== "pass-giant-scorpion") throw new Error("scorpion share");
  if (shareSpecies(() => 0.75) !== "pass-bat-eye" || shareSpecies(() => 0.99) !== "pass-bat-eye") throw new Error("bat eye share");
  armShare(point, () => 0.9);
  if (point.nextSpawn !== "pass-bat-eye") throw new Error("bat eye share pop");
  point.nextSpawn = "";
  armShare(point, () => 0);
  if (point.nextSpawn !== "pass-giant-scorpion") throw new Error("scorpion share pop");
  point.nextSpawn = "";
  if (!SPECIES["pass-cave-scorpion"].drops.some((drop) => drop.id === "frostreaper") || !SPECIES["pass-giant-scorpion"].drops.some((drop) => drop.id === "harvester")) throw new Error("scorpion steel");
  if (live.filter((body) => body.ph === "taisai").length < 3) throw new Error("taisai placeholders");
  if (!live.some((body) => body.ph === "gloom" && body.species === "pass-seeker")) throw new Error("gloom placeholder");
  if (!live.some((body) => body.ph === "hyaku" && body.species === "pass-hecteyes")) throw new Error("hyakume placeholder");
  let assisted = 0;
  const groups = new Map<string, string[]>();
  for (const body of live) {
    if (body.species !== "pass-pathfinder" && body.species !== "pass-bats") continue;
    const list = groups.get(body.link) ?? [];
    list.push(body.species);
    groups.set(body.link, list);
  }
  for (const list of groups.values()) {
    if (list.includes("pass-pathfinder") && list.includes("pass-bats")) assisted += 1;
  }
  if (assisted < 3) throw new Error("pathfinder bats");
}

let passSerial = 0;

function passGrid(squares: readonly string[]): { x: number; z: number }[] {
  const out: { x: number; z: number }[] = [];
  for (let x = 210; x <= 610; x += 3.4) {
    for (let z = -380; z <= 110; z += 3.4) {
      if (!inPass(x, z, 0.9) || passWet(x, z)) continue;
      if (squares.length && !squares.includes(passSquare(x, z))) continue;
      if (Math.hypot(x - PASS_NPCS.perchond.x, z - PASS_NPCS.perchond.z) < 3.4) continue;
      if (Math.hypot(x - PASS_NPCS.myffore.x, z - PASS_NPCS.myffore.z) < 3.4) continue;
      out.push({ x, z });
    }
  }
  return out;
}

function passCount(id: string): number {
  let n = 0;
  for (const body of live) if (body.species === id) n += 1;
  return n;
}

function passParty(ids: string[], x: number, z: number, link: string, ph: FieldBody["ph"]): boolean {
  if (!ids.length || !inPass(x, z, 0)) return false;
  const spec0 = specOf(ids[0]);
  const roam = 1.15;
  if (!canStand(x, z, spec0, roam, link)) return false;
  const spots: { id: string; x: number; z: number }[] = [{ id: ids[0], x, z }];
  for (let i = 1; i < ids.length; i++) {
    const spec = specOf(ids[i]);
    let found = false;
    for (const rad of [4.5, 5.6, 6.8]) {
      for (let turn = 0; turn < 10; turn++) {
        const ang = (i / ids.length) * Math.PI * 2 + turn * 0.5;
        const mx = x + Math.cos(ang) * rad;
        const mz = z + Math.sin(ang) * rad;
        if (!inPass(mx, mz, 0.7) || passWet(mx, mz) || oneWayBlocks(x, z, mx, mz)) continue;
        if (!canStand(mx, mz, spec, roam, link)) continue;
        let crowded = false;
        for (const spot of spots) if (Math.hypot(spot.x - mx, spot.z - mz) < 4.2) crowded = true;
        if (crowded) continue;
        spots.push({ id: ids[i], x: mx, z: mz });
        found = true;
        break;
      }
      if (found) break;
    }
    if (!found) return false;
  }
  for (let i = 0; i < spots.length; i++) addBody(spots[i].id, spots[i].x, spots[i].z, link, i === 0 ? ph : "");
  return true;
}

function passMix(ids: string[], squares: readonly string[], salt: number, ph: FieldBody["ph"] = ""): boolean {
  const grid = passGrid(squares);
  for (const index of visitOrder(grid.length, salt)) {
    const spot = grid[index];
    const link = `pass-mix-${passSerial + 1}`;
    if (!passParty(ids, spot.x, spot.z, link, ph)) continue;
    passSerial += 1;
    return true;
  }
  return false;
}

function passFill(id: string, squares: readonly string[], want: number, cluster: number, ph: FieldBody["ph"] = "", salt = 0): number {
  const spec = specOf(id);
  const grid = passGrid(squares);
  let placed = passCount(id);
  const order = visitOrder(grid.length, 0x0a11 + salt + id.length * 17);
  for (const index of order) {
    if (placed >= want) break;
    const spot = grid[index];
    const phNow = id === "pass-taisai" || id === "pass-hecteyes" ? ph : placed === passCount(id) ? ph : "";
    if (cluster > 1) {
      const room = Math.min(cluster, want - placed);
      const ids = Array.from({ length: room }, () => id);
      const link = `pass-${id}-${passSerial + 1}`;
      if (!passParty(ids, spot.x, spot.z, link, phNow)) continue;
      passSerial += 1;
      placed += room;
    } else if (passParty([id], spot.x, spot.z, spec.links ? `pass-${id}-${++passSerial}` : "", phNow)) {
      placed += 1;
    }
  }
  return placed;
}

/** H-5. Giant Scorpion takes the point three times in four. Bat Eye takes the rest. Only one stands. */
const H5_SHARE = "h5-share";
const BAT_EYE_CHANCE = 0.25;

function shareSpecies(rng: () => number): string {
  return rng() < 1 - BAT_EYE_CHANCE ? "pass-giant-scorpion" : "pass-bat-eye";
}

function armShare(body: FieldBody, rng: () => number = Math.random): void {
  if (body.link !== H5_SHARE) return;
  body.nextSpawn = shareSpecies(rng);
}

/** Fraction of a dedicated spawn this species occupies. Bat Eye only has the shared point. */
export function spawnShare(speciesId: string): number {
  return speciesId === "pass-bat-eye" ? BAT_EYE_CHANCE : 1;
}

/** Species a shared point can become, even while the other one is standing. */
export function sharedSpawns(): { species: string; x: number; z: number }[] {
  const body = live.find((row) => row.link === H5_SHARE);
  if (!body) return [];
  return [
    { species: "pass-bat-eye", x: body.spawnX, z: body.spawnZ },
    { species: "pass-giant-scorpion", x: body.spawnX, z: body.spawnZ },
  ];
}

function placeH5Share(): void {
  const grid = passGrid(["H-5"]);
  const species = shareSpecies(() => 0);
  for (const index of visitOrder(grid.length, 0x0b47)) {
    const spot = grid[index];
    if (passSquare(spot.x, spot.z) !== "H-5") continue;
    if (!passParty([species], spot.x, spot.z, H5_SHARE, "")) continue;
    const born = live.find((body) => body.link === H5_SHARE);
    if (born && passSquare(born.spawnX, born.spawnZ) === "H-5") return;
    throw new Error("h5 share moved");
  }
  throw new Error("h5 share");
}

/** 75-era Ranguemont Pass. Counts follow the classic field list. Later cap-99 camps stay out. */
function fillPass(): void {
  if (live.some((body) => body.species.startsWith("pass-"))) return;
  const mouth = ["F-11", "F-10"];
  const early = ["F-10", "F-9", "E-9", "E-8", "D-9", "D-8"];
  const mid = ["F-8", "G-8", "G-9", "H-8", "G-7", "F-7", "I-8", "D-7", "D-6"];
  const pool = ["D-5", "E-5", "E-4", "E-6", "D-6"];
  const deep = ["F-5", "F-6", "G-6", "H-5", "H-4", "I-4", "E-6", "G-7"];
  const glacier = ["I-3", "J-3", "K-3", "K-4", "H-4", "I-4"];
  const halls = [...mid, ...deep, ...glacier];
  placeH5Share();
  // The shared point already counts as one Giant Scorpion. This is the other deep spawn.
  passFill("pass-giant-scorpion", deep.filter((square) => square !== "H-5"), 2, 1, "", 2);
  passFill("pass-mucoid", glacier, 1, 1, "", 3);
  passFill("pass-taisai", glacier, 3, 1, "taisai", 4);
  passFill("pass-evil-weapon", pool, 3, 1, "", 5);
  passFill("pass-floating-eye", [...deep, ...glacier], 5, 1, "", 6);
  passFill("pass-hecteyes", deep, 5, 1, "hyaku", 7);
  passFill("pass-cave-scorpion", deep, 2, 1, "", 8);
  for (let i = 0; i < 3; i++) passMix(["pass-pathfinder", "pass-bats"], [...mid, ...deep], 0x70 + i);
  for (let i = 0; i < 3; i++) passMix(["pass-shaman", "pass-smithy", "pass-furrier"], deep, 0x80 + i);
  passFill("pass-wind", ["F-12", "F-11", "F-10"], 5, 1, "", 9);
  passFill("pass-blade", mouth, 6, 1, "", 10);
  passMix(["pass-thug", "pass-weaver"], early, 0x90);
  passMix(["pass-weaver", "pass-weaver"], early, 0x91);
  passFill("pass-thug", early, 2, 1, "", 11);
  passFill("pass-weaver", early, 3, 1, "", 12);
  passFill("pass-oil", early, 2, 1, "", 13);
  passFill("pass-ooze", [...pool, ...mid], 5, 1, "", 14);
  const goblinSquares = [...mid, ...deep];
  let guard = 0;
  while ((passCount("pass-mugger") < 8 || passCount("pass-gambler") < 6 || passCount("pass-leecher") < 7) && guard < 40) {
    guard += 1;
    const ids: string[] = [];
    if (passCount("pass-mugger") < 8) ids.push("pass-mugger");
    if (passCount("pass-gambler") < 6) ids.push("pass-gambler");
    if (passCount("pass-leecher") < 7) ids.push("pass-leecher");
    const party = ids.slice(0, Math.min(3, ids.length));
    if (passMix(party, goblinSquares, 0xa0 + guard)) continue;
    if (party.length > 1 && passMix(party.slice(0, 1), goblinSquares, 0xb0 + guard)) continue;
    break;
  }
  passFill("pass-seeker", halls, 27, 3, "", 15);
  passFill("pass-seeker", halls, 30, 3, "gloom", 16);
  passFill("pass-stirge", halls, 41, 3, "", 17);
  passFill("pass-stirge", [...early, ...halls], 41, 2, "", 18);
  passFill("pass-seeker", [...early, ...halls], 30, 2, "", 19);
}
