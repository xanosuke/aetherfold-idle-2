/**
 * Retail Beastmaster toolkit through level 75. No merits and no job points.
 *
 * A support job here is level 37. Charm, Gauge, Reward, Call Beast,
 * Bestial Loyalty, Tame, Fight, Heel, Stay, Sic, and Leave are inside
 * that. A jug is Beastmaster ammo. Fish Oil Broth sits in the ammo
 * slot, in a stack of 12, and it is what calls Courier Carrie. Call
 * Beast spends one. Bestial Loyalty leaves the stack. A support job
 * cannot equip a jug, so both calls fail. Familiar is main only. Ready
 * is level 25, so a support job can use it, but it still cannot call
 * the jug. Charm keeps a charmable quarry. The Tropical Rarab is a
 * rabbit, and rabbits can be charmed. Duration is the printed table.
 * The chance is the tested curve, capped at 95, not a printed cell.
 * Tame uses that same curve with INT in place of CHR.
 * Snarl is 45, which a master-level sub could reach. This kit has no
 * master levels. Feral Howl and Killer Instinct are group-2 merits.
 * Unleash, Spur, and Run Wild are past 75.
 *
 * Traits through 35 are a normal subjob's. Lizard Killer, Tandem Blow,
 * Damage Limit+, and Tandem Strike II start at 40 or 45, so a level-37
 * sub has not learned them. From 50 to 55 the killer and resist tiers
 * need a master-level sub. From 60 up they are main only, including
 * Beast Killer. Beast Affinity and Beast Healer are merits. At no
 * ranks they do not raise the pet's level or Reward's regen.
 *
 * Naked Hume Beastmaster grades, with no subjob: level 75 is 1167 HP,
 * 0 MP, STR 56, DEX 61, VIT 56, AGI 48, INT 53, MND 53, CHR 70.
 *
 * The model wears Beast armor, the artifact set: Beast Helm, Jackcoat,
 * Gloves, Trousers, and Gaiters. Brown leather, a fur ruff, bone teeth,
 * and short horns. The pieces are not equipped, so their stat lines are
 * not on the sheet. Barbaroi Axe is the artifact weapon and is not in
 * the bag. The axe in the hands is the equipped weapon. The Bronze Axe
 * stands in.
 *
 * Current BG-Wiki letters, through this repo's level-75 skill cap:
 * Axe A+ 276, Scythe B− 240, Dagger C+ 230, Club D 210, Sword E 200,
 * Evasion C 225, Parrying C 225, Shield E 200. No innate magic skill.
 * The Ash Staff's item line still lists Beastmaster. The job page does
 * not give Staff a rank, so the cap stays 0.
 *
 * Killer traits print +5% damage dealt and −5% special damage taken,
 * and an 8% intimidation rate at tier I. The Tropical Rarab is a rabbit,
 * which is a beast. Beast Killer is the only one that matches. The
 * others stay on the sheet and are not rolled.
 *
 * One jug. Courier Carrie, from Fish Oil Broth. Crab, aquan, paladin,
 * blunt, delay 317, level cap 75, 30 minutes. BG prints attack −10% and
 * defense +20%. The November 2019 retail /checkparam at level 75 already
 * includes those: accuracy 305, attack 319, evasion 283, defense 433.
 * They are not applied a second time. That card did not print HP, and
 * the JP level-75 HP cell is blank. The bar uses 1732, four times the
 * printed defense, only so a hit can wound the crab. It is not a retail HP.
 * BG's category column says TP/hit 75. Delay 317 under this yard's TP
 * table returns 94, which is what a connecting claw gives. The 75 is
 * not used.
 * Call Beast's page says the pet spawns 0, 1, or 2 levels below. The
 * weights are not printed. This yard calls it at 75, inside that range
 * and the only level whose combat line was measured. Monster Gloves and
 * Beast Affinity merits are not equipped.
 *
 * Ready holds three charges and refills one every 30 seconds. Sic uses
 * that same bank: it needs all three, spends them, and that is the
 * 0:01:30 recast. Calling a jug copies whatever charges are left. The
 * merit that cuts a charge to 10 seconds is not unlocked. Big Scissors
 * is Scission and slashing. Its damage and its critical-rate slope are
 * not printed, so the hit is one melee stand-in and the crit rate does
 * not grow. Bubble Shower's STR down is −9 for 3 minutes. The decay
 * slope and the damage are not printed, so the −9 holds for the whole
 * 3 minutes and the hit is the same stand-in. Bubble Curtain is −50%
 * magic damage taken for the crab and the beastmaster. Scissor Guard
 * is +100% defense for both. Metallic Body is about 200 HP of stoneskin
 * for both. Those three durations vary with TP and the seconds are not
 * printed, so they hold while the crab is out. Ready's range is 5'.
 */

import { tpPerHit } from "./formulas";
import { skillCap, type SkillRank } from "./skills";
import { characterBase, type JobId } from "./stats";
import { TROPICAL_RARAB } from "./rarab";
import type { JobAccess } from "./blm";

export const BST_CAP = 75;

/** Charm's reach. Gauge stands a little farther out. A broken charm attacks inside 30'. Tame's page leaves the range blank, so it uses Charm's 18'. */
export const CHARM_RANGE = 18;
export const GAUGE_RANGE = 22.6;
export const TAME_RANGE = CHARM_RANGE;
export const CHARM_DROP_YARDS = 30;
/** Familiar adds half an hour to a charm that is already running. It does not extend a jug. */
export const FAMILIAR_CHARM_SECONDS = 30 * 60;

/** Fish Oil Broth. Classic familiar tables print 30 minutes. */
export const JUG_SECONDS = 30 * 60;

/** Ready's charge refill. The window holds three. */
export const READY_CHARGES = 3;
export const READY_CHARGE_SECONDS = 30;

/** Sic waits for a full thousand, the weaponskill line on a 3000 bar. */
export const SIC_TP = 1000;
/** Sic's recast. Three Ready charges of 30 seconds. The merit that shortens it is locked. */
export const SIC_RECAST = READY_CHARGES * READY_CHARGE_SECONDS;
/** The ability card prints 18'. The master still has to stand this close to the pet. */
export const SIC_PET_RANGE = 4;
/** Ready. Level 25, and the master has to stand this close to the jug. */
export const READY_LEVEL = 25;
export const READY_RANGE = 5;

/**
 * November 2019 retail /checkparam, Courier Carrie at level 75.
 * Accuracy, attack, evasion, defense. HP was not on that line.
 */
export const CARRIE_ACCURACY = 305;
export const CARRIE_ATTACK = 319;
export const CARRIE_EVASION = 283;
export const CARRIE_DEFENSE = 433;
/** Delay from the JP card (隔). Blunt. */
export const CARRIE_DELAY = 317;
/** Not a printed HP. 4 × the printed defense, so the bar can empty. */
export const CARRIE_HP_STANDIN = CARRIE_DEFENSE * 4;

/** Bubble Shower. −9 STR for 3 minutes. The decay slope is not printed. */
export const BUBBLE_STR = 9;
export const BUBBLE_STR_SECONDS = 180;

/** Metallic Body. About 200 HP of stoneskin for the pet and the master. */
export const METALLIC_SKIN = 200;

/** Familiar. +10% maximum HP. +3 base attributes are logged and not folded into the checkparam. */
export const FAMILIAR_HP = 0.1;
export const FAMILIAR_STATS = 3;

export type CarrieMove = "Bubble Shower" | "Bubble Curtain" | "Big Scissors" | "Scissor Guard" | "Metallic Body";

export type CarrieReady = {
  name: CarrieMove;
  charges: number;
  effect: string;
};

/** Courier Carrie's Ready list. The cast motions are the crab-family ids in crab.ts. */
export const CARRIE_READY: readonly CarrieReady[] = [
  {
    name: "Bubble Shower",
    charges: 1,
    effect: "Water damage in an area. Additional effect: STR −9 for 3 minutes. The decay and the area slope are not printed, so the −9 holds and the only foe is the one in front. Damage is not printed. The hit uses the melee stand-in. The master must be within 5'. Charge 1 of the shared Ready bank.",
  },
  {
    name: "Bubble Curtain",
    charges: 3,
    effect: "Magic damage taken −50% for Courier Carrie and the beastmaster. The duration varies with TP and the seconds are not printed, so it holds while the crab is out. The master must be within 5'. Charge 3 of the shared Ready bank.",
  },
  {
    name: "Big Scissors",
    charges: 1,
    effect: "One physical hit. Slashing. Skillchain: Scission. Critical rate varies with TP and the cells are blank, so it does not grow. Damage is not printed. The hit uses the melee stand-in. The master must be within 5'. Charge 1 of the shared Ready bank.",
  },
  {
    name: "Scissor Guard",
    charges: 2,
    effect: "Defense +100% for Courier Carrie and the beastmaster. The duration varies with TP and the seconds are not printed, so it holds while the crab is out. The master must be within 5'. Charge 2 of the shared Ready bank.",
  },
  {
    name: "Metallic Body",
    charges: 1,
    effect: "Stoneskin of about 200 HP for Courier Carrie and the beastmaster. The duration varies with TP. Stoneskin stays until it is spent. The master must be within 5'. Charge 1 of the shared Ready bank.",
  },
];

export function carrieTpPerHit(): number {
  return tpPerHit(CARRIE_DELAY);
}

export function carrieSwingSeconds(): number {
  return CARRIE_DELAY / 60;
}

/**
 * A connecting claw. Base weapon damage is not printed, so this is the
 * yard stand-in floor(level × 0.45 + 6). The same one a wyvern uses when
 * the card has attack and not a weapon. Attack 319 is the checkparam
 * and is not folded in a second time.
 */
export function carrieMeleeDamage(level: number): number {
  return Math.max(1, Math.floor(Math.max(0, level) * 0.45 + 6));
}

export function carrieDefense(guard: boolean): number {
  return guard ? CARRIE_DEFENSE * 2 : CARRIE_DEFENSE;
}

export function familiarMaxHp(base: number): number {
  return Math.max(1, Math.floor(base * (1 + FAMILIAR_HP)));
}

export type BstAbility = {
  name: string;
  level: number;
  recast: number;
  duration: number;
  access: JobAccess;
  effect: string;
  ce: number;
  ve: number;
  merit?: boolean;
};

export const BST_ABILITIES: BstAbility[] = [
  {
    name: "Familiar",
    level: 1,
    recast: 3600,
    duration: 1800,
    access: "main",
    effect: "The pet must be out. On a jug, maximum HP +10% and current HP rises by that gift. Base attributes +3. Job-point ranks, which would add another 3 per rank, are not unlocked. It does not keep a jug past its own timer. On a charmed quarry it adds 30 minutes to the remaining charm. The rarab keeps its printed HP. The motion is a hand on the pet. Recast 1:00:00. Volatile enmity 80. Main job only.",
    ce: 0,
    ve: 80,
  },
  {
    name: "Charm",
    level: 1,
    recast: 15,
    duration: 0,
    access: "sub",
    effect: "Tries to control the target. Range 18'. Recast 0:00:15. Cumulative enmity 320. Duration is floor(1.25 × CHR + 150), then the printed level-difference step, then × (1 + 0.05 × Charm+). No Charm+ is equipped. The chance is the tested curve, capped at 95, not a printed cell. Beastmaster level is used even on a subjob. Character level sets the duration. A miss makes the quarry attack. It does not fire while a pet is already out, and that miss does not spend the recast. The motion brings the right hand to the mouth, then out toward the quarry. Pink hearts reach it when the charm lands, and break apart when it misses.",
    ce: 320,
    ve: 0,
  },
  {
    name: "Gauge",
    level: 10,
    recast: 30,
    duration: 0,
    access: "sub",
    effect: "Reads the same chance Charm would use, without a staff term. Range 22.6'. Recast 0:00:30. No enmity. The line is one of five: should, might, difficult, very difficult, or cannot. Light Staff and Apollo's Staff are not in the bag, and the size of that bonus is not printed, so it is not applied.",
    ce: 0,
    ve: 0,
  },
  {
    name: "Reward",
    level: 12,
    recast: 90,
    duration: 0,
    access: "sub",
    effect: "Feeds the pet one biscuit from the bag. Retail reads the ammo slot. This yard does not. The Food control on this card picks the biscuit. No choice uses the highest level pet food still in the bag. The heal is that biscuit's row on the BG pet-food table, not a printed cell. No Reward potency is equipped. Regen follows the biscuit for 3 minutes. A tick is 3 seconds. Beast Healer is not unlocked. Zeta is the level 72 row: minimum 900, then floor((MND−45)×768/256)+900 until MND 105, then the 105 and 200 rows, and 14 HP a tick (60 ticks, 840 HP). Recast 0:01:30. Volatile enmity 160, on the pet. Each stack is 12. Eta is 84 and Theta is 96, so neither is in the bag.",
    ce: 0,
    ve: 160,
  },
  {
    name: "Call Beast",
    level: 23,
    recast: 300,
    duration: 0,
    access: "sub",
    effect: "Calls the jug in the ammo slot. Fish Oil Broth calls Courier Carrie. The stack is 12, and one is used. A pebble or an arrow is not a jug, so the call does not fire and the recast is not spent. The crab is a paladin, blunt, delay 317, and it stays 30 minutes. It does not swing until Fight. A support job cannot equip a jug. Recast 0:05:00. The page prints no enmity.",
    ce: 0,
    ve: 0,
  },
  {
    name: "Bestial Loyalty",
    level: 23,
    recast: 1200,
    duration: 0,
    access: "sub",
    effect: "Calls the same jug and does not use one. Fish Oil Broth still has to be in the ammo slot. Recast 0:20:00. A support job still cannot equip the jug. The page prints no enmity.",
    ce: 0,
    ve: 0,
  },
  {
    name: "Tame",
    level: 30,
    recast: 600,
    duration: 0,
    access: "sub",
    effect: "Makes the quarry docile, and the next Charm is 10 more likely. That 10 is the tested bonus, not a printed cell. Gauge does not count it. It is spent on that Charm, hit or miss. The chance is Charm's curve with INT in place of CHR: base 50, the same Beastmaster level step, then your INT minus its INT, capped at 95. Light resistance belongs to Charm, so it is not in this. No Tame gear is equipped. A low-HP penalty is talked about and not printed, so it is not applied. Recast 0:10:00. No enmity. A pet already out means it does not fire. Someone else on the hate list means no effect, and that one does spend the recast. The page leaves the range blank. This yard uses Charm's 18'.",
    ce: 0,
    ve: 0,
  },
  {
    name: "Fight",
    level: 1,
    recast: 0,
    duration: 0,
    access: "sub",
    effect: "Sends the pet at the quarry. Courier Carrie runs in and swings on her own delay. You do not have to be engaged. Tandem Strike applies only while you are also attacking that quarry. A charmed Tropical Rarab is sent at the other Tropical Rarab and swings on delay 240 once the two are inside 3'. The motion points the weapon.",
    ce: 0,
    ve: 0,
  },
  {
    name: "Heel",
    level: 10,
    recast: 0,
    duration: 0,
    access: "sub",
    effect: "The pet follows and does not swing. The motion beckons the pet in.",
    ce: 0,
    ve: 0,
  },
  {
    name: "Stay",
    level: 15,
    recast: 0,
    duration: 0,
    access: "sub",
    effect: "The pet holds still and does not swing. The motion raises an open palm.",
    ce: 0,
    ve: 0,
  },
  {
    name: "Sic",
    level: 25,
    recast: SIC_RECAST,
    duration: 0,
    access: "sub",
    effect: "Orders a charmed pet to use one special attack. Recast 0:01:30. That clock is Ready's bank: 3 charges, 30 seconds each. Sic needs the bank full and spends all three. Cumulative enmity 0. Volatile enmity 160. The card prints 18', but the master must be within 4' of the pet. A jug answers to Ready, not Sic. Under 1000 TP the recast is still spent, and the pet uses a move when it later reaches 1000. At 1000 TP it picks Foot Kick, Whirl Claws, Dust Cloud, or Wild Carrot at equal weight, not the wild order, and the TP is spent when the move is performed. Foot Kick, Whirl Claws, and Dust Cloud strike the other Tropical Rarab when that one is alive and inside 3'. A miss, a dead foe, or a foe out of reach still spends the TP. Wild Carrot heals the pet for floor(max HP × 104 / 1024). The motion points the weapon, then the pet plays that move. The Sic recast merit is locked.",
    ce: 0,
    ve: 160,
  },
  {
    name: "Leave",
    level: 35,
    recast: 0,
    duration: 0,
    access: "sub",
    effect: "Sends the pet away. A jug is dismissed. A charmed quarry is released, and it attacks if you are within 30 yalms. A level-37 subjob has learned it. The motion sweeps the pet off.",
    ce: 0,
    ve: 0,
  },
  {
    name: "Snarl",
    level: 45,
    recast: 30,
    duration: 0,
    access: "sub",
    effect: "Moves 99% of your current enmity onto the jug pet. A charmed quarry is the only foe here, so Snarl has no other enemy to draw and does not fire. Recast 0:00:30. A level-37 subjob has not learned it. A master-level sub could. This kit has no master levels.",
    ce: 0,
    ve: 0,
  },
  {
    name: "Feral Howl",
    level: 75,
    recast: 300,
    duration: 0,
    access: "main",
    merit: true,
    effect: "Merit ability. Not unlocked. Would try to terrorize the target. Range 17.8'. Recast 0:05:00. Volatile enmity 640. The accuracy is not printed.",
    ce: 0,
    ve: 640,
  },
  {
    name: "Killer Instinct",
    level: 75,
    recast: 300,
    duration: 180,
    access: "main",
    merit: true,
    effect: "Merit ability. Not unlocked. Would share the pet's killer with the party for 3 minutes: damage dealt +15%, damage taken −15%. Range 7.9'. Recast 0:05:00. Volatile enmity 80.",
    ce: 0,
    ve: 80,
  },
];

export type BstTrait = {
  name: string;
  level: number;
  access: JobAccess;
  effect: string;
  merit?: boolean;
};

export const BST_TRAITS: BstTrait[] = [
  { name: "Wide Scan", level: 1, access: "sub", effect: "Wide Scan III. This yard has no scan, so it is not used." },
  { name: "Vermin Killer", level: 10, access: "sub", effect: "Damage dealt to vermin +5%. Special damage taken from vermin −5%. Intimidation 8%. The Tropical Rarab is not vermin, so it is not rolled." },
  { name: "Resist Slow", level: 15, access: "sub", effect: "Slow is fully resisted 10% of the time. Nothing here inflicts Slow, so it is not rolled." },
  { name: "Resist Amnesia", level: 15, access: "sub", effect: "The percent is not printed on the page this kit read. Nothing here inflicts Amnesia, so it is not rolled." },
  { name: "Bird Killer", level: 20, access: "sub", effect: "An edge against birds. The Tropical Rarab is not a bird, so it is not rolled." },
  { name: "Amorph Killer", level: 30, access: "sub", effect: "An edge against amorphs. The Tropical Rarab is not an amorph, so it is not rolled." },
  { name: "Tandem Strike", level: 30, access: "sub", effect: "Accuracy and magic accuracy +10 for you and the pet while you strike the same foe. A level-37 subjob has this tier." },
  { name: "Resist Slow II", level: 35, access: "sub", effect: "Replaces Resist Slow. 15%. A level-37 subjob has this tier." },
  { name: "Resist Amnesia II", level: 35, access: "sub", effect: "Replaces Resist Amnesia. The percent is not printed. A level-37 subjob has this tier." },
  { name: "Lizard Killer", level: 40, access: "sub", effect: "An edge against lizards. The Tropical Rarab is not a lizard. A level-37 subjob has not learned it." },
  { name: "Tandem Blow", level: 40, access: "sub", effect: "Subtle Blow +5 while you and the pet strike the same foe. A level-37 subjob has not learned it." },
  { name: "Damage Limit+", level: 45, access: "sub", effect: "Physical pDIF cap +26/256. A level-37 subjob has not learned it." },
  { name: "Tandem Strike II", level: 45, access: "sub", effect: "Accuracy and magic accuracy +20. Replaces Tandem Strike. A level-37 subjob has not learned it." },
  { name: "Aquan Killer", level: 50, access: "master-sub", effect: "An edge against aquans. The Tropical Rarab is not an aquan. A support job needs master levels." },
  { name: "Resist Slow III", level: 55, access: "master-sub", effect: "20%. Replaces Resist Slow II. A support job needs master levels." },
  { name: "Resist Amnesia III", level: 55, access: "master-sub", effect: "Replaces Resist Amnesia II. The percent is not printed. A support job needs master levels." },
  { name: "Plantoid Killer", level: 60, access: "main", effect: "An edge against plantoids. The Tropical Rarab is not a plantoid. Main job only." },
  { name: "Tandem Blow II", level: 60, access: "main", effect: "Subtle Blow +10. Replaces Tandem Blow. Main job only." },
  { name: "Tandem Strike III", level: 60, access: "main", effect: "Accuracy and magic accuracy +30. Replaces Tandem Strike II. Main job only." },
  { name: "Wide Scan IV", level: 60, access: "main", effect: "Replaces Wide Scan. This yard has no scan. Main job only." },
  { name: "Beast Killer", level: 70, access: "main", effect: "Damage dealt to beasts +5%. Special damage taken from beasts −5%. Intimidation 8%. The Tropical Rarab is a rabbit, and rabbits are beasts, so this one is rolled. Main job only." },
  { name: "Resist Slow IV", level: 75, access: "main", effect: "25%. Replaces Resist Slow III. Main job only." },
  { name: "Resist Amnesia IV", level: 75, access: "main", effect: "Replaces Resist Amnesia III. The percent is not printed. Main job only." },
  { name: "Tandem Strike IV", level: 75, access: "main", effect: "Accuracy and magic accuracy +40. Replaces Tandem Strike III. Main job only." },
  { name: "Beast Affinity", level: 75, access: "main", merit: true, effect: "Merit trait. Not unlocked. Would raise a jug pet's level cap by 2 per rank." },
  { name: "Beast Healer", level: 75, access: "main", merit: true, effect: "Merit trait. Not unlocked. Would add 1 HP per tick to Reward's Regen per rank." },
];

export const BST_SKILLS: { name: string; rank: SkillRank }[] = [
  { name: "Axe", rank: "A+" },
  { name: "Scythe", rank: "B-" },
  { name: "Dagger", rank: "C+" },
  { name: "Club", rank: "D" },
  { name: "Sword", rank: "E" },
  { name: "Evasion", rank: "C" },
  { name: "Parrying", rank: "C" },
  { name: "Shield", rank: "E" },
];

export function bstJobLevel(job: JobId, sub: JobId | null, subLevel: number, mainLevel: number): number {
  if (job === "BST") return mainLevel;
  if (sub === "BST") return subLevel;
  return 0;
}

/** Damage dealt to beasts. Beast Killer I is +5% at 70, main only. */
export function beastKiller(level: number, access: JobAccess): number {
  if (access !== "main" || level < 70) return 0;
  return 0.05;
}

/** Intimidation rate against beasts. 8% at tier I. */
export function beastIntimidate(level: number, access: JobAccess): number {
  if (access !== "main" || level < 70) return 0;
  return 0.08;
}

/** Special damage taken from beasts. −5% at tier I. */
export function beastSpecialCut(level: number, access: JobAccess): number {
  if (access !== "main" || level < 70) return 0;
  return 0.05;
}

/**
 * Resist Slow. 10 / 15 / 20 / 25 at 15 / 35 / 55 / 75.
 * Tier III needs a master-level sub. Tier IV is main only.
 */
export function bstResistSlow(level: number, access: JobAccess): number {
  if (access === "main" && level >= 75) return 0.25;
  if (access !== "sub" && level >= 55) return 0.2;
  if (level >= 35) return 0.15;
  if (level >= 15) return 0.1;
  return 0;
}

/** Accuracy while you and the pet strike the same foe. Tiers replace. */
export function tandemStrike(level: number, access: JobAccess): number {
  if (access === "main" && level >= 75) return 40;
  if (access === "main" && level >= 60) return 30;
  if (level >= 45) return 20;
  if (level >= 30) return 10;
  return 0;
}

/** Subtle Blow while you and the pet strike the same foe. Tier II is main only. */
export function tandemBlow(level: number, access: JobAccess): number {
  if (access === "main" && level >= 60) return 10;
  if (level >= 40) return 5;
  return 0;
}

/** Damage Limit+ I is +26/256 at 45. II is level 90. */
export function bstDamageLimit(level: number): number {
  return level >= 45 ? 26 / 256 : 0;
}

export function bstSkill(name: string, level: number): number {
  const row = BST_SKILLS.find((skill) => skill.name === name);
  return row ? skillCap(row.rank, level) : 0;
}

export function readyByName(name: string): CarrieReady | null {
  return CARRIE_READY.find((move) => move.name === name) ?? null;
}

/**
 * Printed charm-duration steps. dLevel is character level minus monster
 * level, not Beastmaster job level. LandSandBoat fits a quintic through
 * these cells. The cells themselves are what the page prints, and they
 * are what this yard uses.
 */
export function charmLevelStep(dLevel: number): number {
  if (dLevel <= -6) return 1 / 24;
  if (dLevel === -5) return 1 / 12;
  if (dLevel === -4) return 1 / 8;
  if (dLevel === -3) return 1 / 6;
  if (dLevel === -2) return 1 / 3;
  if (dLevel === -1) return 2 / 3;
  if (dLevel <= 0) return 1;
  if (dLevel === 1) return 1.4;
  if (dLevel === 2) return 1.8;
  if (dLevel === 3) return 2.2;
  if (dLevel === 4) return 2.6;
  if (dLevel === 5) return 3;
  if (dLevel === 6) return 3.4;
  if (dLevel === 7) return 4;
  if (dLevel === 8) return 5;
  return 6;
}

/** floor(1.25 × CHR + 150), then the level step, then 5% per Charm+. */
export function charmDuration(chr: number, playerLevel: number, monsterLevel: number, charmPlus = 0): number {
  const base = Math.floor(1.25 * chr + 150);
  const step = charmLevelStep(playerLevel - monsterLevel);
  return Math.max(0, Math.floor(base * step * (1 + 0.05 * charmPlus)));
}

export function formatCharm(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, "0")}`;
}

/**
 * Tested charm chance. Not a printed wiki cell.
 * Base 50, minus charm resistance. Beastmaster job level, even on a
 * subjob, is penalized only when it is under the monster: 10 per level
 * at 71+, 5 per level at 51–70, 3 per level below that. Light resistance
 * rank then scales it. Charm+ gear is not part of this. A staff's
 * CHARM_CHANCE would be `bonus`, and Gauge does not include it. This
 * yard has no such staff. dCHR is added last. The result is clamped
 * from 0 to 95. A charmable mob's "always a small chance" is the
 * qualitative note. The tested curve itself can read 0, and that is
 * what is rolled.
 * The rabbit's light rank is not published. It is treated as 0.
 */
export function charmChance(args: {
  bstLevel: number;
  targetLevel: number;
  playerChr: number;
  targetChr: number;
  charmRes?: number;
  lightRank?: number;
  bonus?: number;
}): number {
  let chance = 50 - (args.charmRes ?? 0);
  if (args.bstLevel < args.targetLevel) {
    const gap = args.targetLevel - args.bstLevel;
    const slope = args.targetLevel >= 71 ? 10 : args.targetLevel >= 51 ? 5 : 3;
    chance -= slope * gap;
  }
  const rank = args.lightRank ?? 0;
  if (rank <= -3) chance *= 1.5;
  else if (rank <= -2) chance *= 1.4;
  else if (rank <= -1) chance *= 1.2;
  else if (rank > 0) chance /= 2;
  chance += args.bonus ?? 0;
  chance += args.playerChr - args.targetChr;
  return Math.min(95, Math.max(0, chance));
}

/** LandSandBoat: the charm lands when the chance is strictly above a roll of 1–100. */
export function charmLands(chance: number, roll: number): boolean {
  const face = Math.min(100, Math.max(1, Math.floor(roll)));
  return chance > face;
}

/**
 * Tame's percent is not printed. Classic notes compare the player's
 * INT to the foe's INT. This is Charm's tested curve with those two
 * INT values in the CHR slots. Light resistance is not applied. Charm
 * resistance is not applied. The same 0–95 cap and the same roll are.
 * A landed Tame adds this to the next Charm only. The wiki does not
 * print the 10. Gauge does not see it.
 */
export const TAME_CHARM_BONUS = 10;

export function tameChance(args: { bstLevel: number; targetLevel: number; playerInt: number; targetInt: number }): number {
  return charmChance({
    bstLevel: args.bstLevel,
    targetLevel: args.targetLevel,
    playerChr: args.playerInt,
    targetChr: args.targetInt,
  });
}

/** Gauge's five sentences. The percent is not shown. */
export function gaugeLine(chance: number, actor = "Xanosuke", target = "the Tropical Rarab"): string {
  if (chance >= 75) return `${actor} should be able to charm ${target}.`;
  if (chance >= 50) return `${actor} might be able to charm ${target}.`;
  if (chance >= 25) return `It would be difficult for ${actor} to charm ${target}.`;
  if (chance >= 1) return `It would be very difficult for ${actor} to charm ${target}.`;
  return `${actor} cannot charm ${target}.`;
}

/** The charmed rabbit's own TP moves. Sic picks among these at equal weight. The other Tropical Rarab is the foe. */
export const RARAB_MOVES: readonly { name: "Foot Kick" | "Whirl Claws" | "Dust Cloud" | "Wild Carrot"; effect: string }[] = [
  {
    name: "Foot Kick",
    effect: "The charmed rabbit's physical TP move. It always crits when it hits, and it takes one shadow. fTP is 2.0 from level 50. Sic can order it at 1000 TP. It strikes the other Tropical Rarab when that one is alive and inside 3'. A miss, a dead foe, or a foe out of reach still spends the TP.",
  },
  {
    name: "Whirl Claws",
    effect: "The charmed rabbit's physical TP move. Three shadows. fTP 2. Sic can order it at 1000 TP. It strikes the other Tropical Rarab when that one is alive and inside 3'. A miss, a dead foe, or a foe out of reach still spends the TP.",
  },
  {
    name: "Dust Cloud",
    effect: "The charmed rabbit's earth-magic TP move. It ignores shadows. Sic can order it at 1000 TP. It strikes the other Tropical Rarab when that one is alive and inside 3'. A miss, a dead foe, or a foe out of reach still spends the TP.",
  },
  {
    name: "Wild Carrot",
    effect: "The charmed rabbit heals itself. floor(max HP × 104 / 1024). It does not need a foe. Sic can order it at 1000 TP, and the TP is spent.",
  },
];

export type SicMove = (typeof RARAB_MOVES)[number]["name"];

export function rarabMoveByName(name: string) {
  return RARAB_MOVES.find((move) => move.name === name) ?? null;
}

/** Equal weight. 0 is Foot Kick, then Whirl Claws, Dust Cloud, and Wild Carrot. Not the wild AI order. */
export function sicMove(roll: number): SicMove {
  const face = Math.min(RARAB_MOVES.length - 1, Math.max(0, Math.floor(roll)));
  return RARAB_MOVES[face]!.name;
}

/** Wild Carrot. The printed fraction. No potency gear is equipped. */
export function wildCarrotHeal(maxHp: number): number {
  return Math.floor(Math.max(0, maxHp) * 104 / 1024);
}

/**
 * Pet food through level 75. The BG pet-food table, not a printed SE cell.
 * Base = floor((MND − Start MND) × Rate / 256) + Const.
 * The minimum cap is the first term. Three linear rows follow. Below the first Start MND, the heal stays at the minimum.
 * The last row is the small rate. Potency is 1. Beast Healer is not unlocked, so regen is the biscuit's own tick.
 * Eta is level 84 and Theta is 96. They are not in this yard.
 */
export type PetFoodCard = {
  id: string;
  name: string;
  /** Item level. With no pin, Reward spends the highest of these that still has a stack. */
  level: number;
  regen: number;
  min: number;
  segments: readonly { start: number; rate: number; base: number }[];
};

export const PET_FOODS: readonly PetFoodCard[] = [
  {
    id: "pet-food-alpha",
    name: "Pet Food Alpha",
    level: 12,
    regen: 1,
    min: 60,
    segments: [
      { start: 15, rate: 256, base: 60 },
      { start: 25, rate: 10, base: 70 },
      { start: 175, rate: 10, base: 75 },
    ],
  },
  {
    id: "pet-food-beta",
    name: "Pet Food Beta",
    level: 24,
    regen: 3,
    min: 150,
    segments: [
      { start: 20, rate: 512, base: 150 },
      { start: 27, rate: 256, base: 164 },
      { start: 43, rate: 15, base: 180 },
    ],
  },
  {
    id: "pet-food-gamma",
    name: "Pet Food Gamma",
    level: 36,
    regen: 5,
    min: 300,
    segments: [
      { start: 30, rate: 512, base: 300 },
      { start: 45, rate: 256, base: 330 },
      { start: 75, rate: 32, base: 360 },
    ],
  },
  {
    id: "pet-food-delta",
    name: "Pet Food Delta",
    level: 48,
    regen: 8,
    min: 500,
    segments: [
      { start: 35, rate: 768, base: 500 },
      { start: 55, rate: 256, base: 560 },
      { start: 115, rate: 79, base: 620 },
    ],
  },
  {
    id: "pet-food-epsilon",
    name: "Pet Food Epsilon",
    level: 60,
    regen: 11,
    min: 700,
    segments: [
      { start: 40, rate: 768, base: 700 },
      { start: 80, rate: 512, base: 820 },
      { start: 140, rate: 181, base: 940 },
    ],
  },
  {
    id: "pet-food-zeta",
    name: "Pet Food Zeta",
    level: 72,
    regen: 14,
    min: 900,
    segments: [
      { start: 45, rate: 768, base: 900 },
      { start: 105, rate: 512, base: 1080 },
      { start: 200, rate: 25, base: 1310 },
    ],
  },
];

export const ZETA_REGEN = 14;
export const ZETA_REGEN_SECONDS = 180;

export function petFoodById(id: string | null | undefined): PetFoodCard | null {
  if (!id) return null;
  return PET_FOODS.find((food) => food.id === id) ?? null;
}

export function petFoodHeal(food: PetFoodCard, mnd: number): number {
  const stat = Math.floor(mnd);
  let heal = food.min;
  for (const seg of food.segments) {
    if (stat < seg.start) break;
    heal = Math.floor(((stat - seg.start) * seg.rate) / 256) + seg.base;
  }
  return Math.max(food.min, heal);
}

/** Highest level biscuit that still has at least one. Null when the bag has none. */
export function highestPetFood(counts: Record<string, number>): PetFoodCard | null {
  let best: PetFoodCard | null = null;
  for (const food of PET_FOODS) {
    if ((counts[food.id] ?? 0) < 1) continue;
    if (!best || food.level > best.level) best = food;
  }
  return best;
}

/**
 * The biscuit Reward will spend.
 * A pin is kept only while that stack remains.
 * No pin, an unknown pin, or an empty pinned stack uses the highest level biscuit still in the bag.
 */
export function rewardBiscuit(counts: Record<string, number>, pinned: string | null): PetFoodCard | null {
  const chosen = petFoodById(pinned);
  if (chosen && (counts[chosen.id] ?? 0) > 0) return chosen;
  return highestPetFood(counts);
}

export function zetaHeal(mnd: number): number {
  const zeta = petFoodById("pet-food-zeta");
  return zeta ? petFoodHeal(zeta, mnd) : 900;
}

export function assertBst(): void {
  const naked = characterBase("hume", "BST", 75);
  if (naked.hp !== 1167 || naked.mp !== 0 || naked.str !== 56 || naked.dex !== 61 || naked.vit !== 56 || naked.agi !== 48 || naked.int !== 53 || naked.mnd !== 53 || naked.chr !== 70) {
    throw new Error(`Hume BST 75 ${naked.hp}/${naked.mp}/${naked.str}/${naked.dex}/${naked.vit}/${naked.agi}/${naked.int}/${naked.mnd}/${naked.chr}`);
  }
  if (bstJobLevel("BST", null, 0, 75) !== 75 || bstJobLevel("WAR", "BST", 37, 75) !== 37 || bstJobLevel("WAR", null, 0, 75) !== 0) throw new Error("Beastmaster level");
  if (beastKiller(69, "main") !== 0 || beastKiller(75, "main") !== 0.05 || beastKiller(75, "sub") !== 0) throw new Error("Beast Killer");
  if (beastIntimidate(75, "main") !== 0.08 || beastSpecialCut(75, "main") !== 0.05 || beastIntimidate(37, "sub") !== 0) throw new Error("Beast Killer rates");
  if (bstResistSlow(14, "sub") !== 0 || bstResistSlow(37, "sub") !== 0.15 || bstResistSlow(55, "sub") !== 0.15 || bstResistSlow(55, "master-sub") !== 0.2 || bstResistSlow(75, "main") !== 0.25) {
    throw new Error("Resist Slow");
  }
  if (tandemStrike(29, "sub") !== 0 || tandemStrike(37, "sub") !== 10 || tandemStrike(45, "sub") !== 20 || tandemStrike(75, "main") !== 40 || tandemStrike(60, "sub") !== 20) {
    throw new Error("Tandem Strike");
  }
  if (tandemBlow(37, "sub") !== 0 || tandemBlow(40, "sub") !== 5 || tandemBlow(75, "main") !== 10 || tandemBlow(75, "sub") !== 5) throw new Error("Tandem Blow");
  if (bstDamageLimit(37) !== 0 || bstDamageLimit(45) !== 26 / 256 || bstDamageLimit(75) !== 26 / 256) throw new Error("Damage Limit+");
  if (bstSkill("Axe", 75) !== 276 || bstSkill("Scythe", 75) !== 240 || bstSkill("Dagger", 75) !== 230 || bstSkill("Club", 75) !== 210) throw new Error("weapon ranks");
  if (bstSkill("Sword", 75) !== 200 || bstSkill("Evasion", 75) !== 225 || bstSkill("Parrying", 75) !== 225 || bstSkill("Shield", 75) !== 200) throw new Error("low ranks");
  if (bstSkill("Axe", 37) !== 114 || bstSkill("Staff", 75) !== 0 || bstSkill("Great Axe", 75) !== 0) throw new Error("missing or sub rank");
  if (carrieTpPerHit() !== 94 || carrieSwingSeconds() !== 317 / 60 || carrieMeleeDamage(75) !== 39) throw new Error("carrie swing");
  if (carrieDefense(false) !== 433 || carrieDefense(true) !== 866 || familiarMaxHp(CARRIE_HP_STANDIN) !== 1905) throw new Error("carrie card");
  if (CARRIE_ACCURACY !== 305 || CARRIE_ATTACK !== 319 || CARRIE_EVASION !== 283 || CARRIE_HP_STANDIN !== 1732) throw new Error("carrie line");
  const banned = ["Unleash", "Spur", "Run Wild"];
  if (BST_ABILITIES.some((a) => banned.includes(a.name))) throw new Error("post-75 in the level-75 kit");
  if (BST_ABILITIES.filter((a) => a.merit).map((a) => a.name).join(",") !== "Feral Howl,Killer Instinct") throw new Error("merits");
  if (BST_ABILITIES.filter((a) => a.access === "sub" && a.level <= 37 && !a.merit).map((a) => a.name).join(",") !== "Charm,Gauge,Reward,Call Beast,Bestial Loyalty,Tame,Fight,Heel,Stay,Sic,Leave") {
    throw new Error("subjob abilities");
  }
  if (CARRIE_READY.map((move) => `${move.name}:${move.charges}`).join(",") !== "Bubble Shower:1,Bubble Curtain:3,Big Scissors:1,Scissor Guard:2,Metallic Body:1") {
    throw new Error("ready list");
  }
  const hareChr = TROPICAL_RARAB.chr;
  if (charmDuration(70, 75, 75, 0) !== 237 || charmDuration(75, 75, 75, 0) !== 243) throw new Error("charm base");
  if (charmDuration(70, 75, 81, 0) !== 9 || charmDuration(70, 75, 66, 0) !== 1422) throw new Error("charm level step");
  if (charmDuration(70, 75, 75, 1) !== 248 || charmDuration(70, 75, 74, 0) !== 331) throw new Error("charm gear or plus one");
  if (formatCharm(237) !== "3:57") throw new Error("charm clock");
  const even = charmChance({ bstLevel: 75, targetLevel: 75, playerChr: 70, targetChr: hareChr });
  if (even !== 50 + (70 - hareChr)) throw new Error(`even charm ${even}`);
  if (charmChance({ bstLevel: 37, targetLevel: 75, playerChr: 70, targetChr: hareChr }) !== 0) throw new Error("subjob charm");
  if (charmChance({ bstLevel: 75, targetLevel: 75, playerChr: 70, targetChr: hareChr, lightRank: -3 }) !== Math.min(95, (50) * 1.5 + (70 - hareChr))) {
    throw new Error("light charm");
  }
  if (charmChance({ bstLevel: 75, targetLevel: 75, playerChr: 400, targetChr: hareChr }) !== 95) throw new Error("charm cap");
  if (TROPICAL_RARAB.int !== 58) throw new Error(`rarab int ${TROPICAL_RARAB.int}`);
  const tameEven = tameChance({ bstLevel: 75, targetLevel: 75, playerInt: 53, targetInt: TROPICAL_RARAB.int });
  if (tameEven !== 50 + (53 - TROPICAL_RARAB.int)) throw new Error(`tame even ${tameEven}`);
  if (tameChance({ bstLevel: 37, targetLevel: 75, playerInt: 53, targetInt: TROPICAL_RARAB.int }) !== 0) throw new Error("subjob tame");
  if (tameChance({ bstLevel: 75, targetLevel: 75, playerInt: 400, targetInt: TROPICAL_RARAB.int }) !== 95) throw new Error("tame cap");
  if (TAME_CHARM_BONUS !== 10) throw new Error("tame bonus");
  if (charmLands(even, 54) !== even > 54 || charmLands(even, even) || charmLands(0, 1)) throw new Error("charm roll");
  if (!gaugeLine(even).includes("might be able") || !gaugeLine(75).includes("should be able") || !gaugeLine(25).includes("difficult for") || gaugeLine(25).includes("very")) {
    throw new Error("gauge bands");
  }
  if (!gaugeLine(1).includes("very difficult") || !gaugeLine(0).includes("cannot charm")) throw new Error("gauge ends");
  if (RARAB_MOVES.map((move) => move.name).join(",") !== "Foot Kick,Whirl Claws,Dust Cloud,Wild Carrot") throw new Error("rarab moves");
  if (sicMove(0) !== "Foot Kick" || sicMove(1) !== "Whirl Claws" || sicMove(2) !== "Dust Cloud" || sicMove(3) !== "Wild Carrot") throw new Error("sic pick");
  if (sicMove(-4) !== "Foot Kick" || sicMove(9) !== "Wild Carrot") throw new Error("sic pick clamp");
  if (wildCarrotHeal(1024) !== 104 || wildCarrotHeal(0) !== 0 || wildCarrotHeal(4611) !== Math.floor(4611 * 104 / 1024)) throw new Error("wild carrot");
  const sicCard = BST_ABILITIES.find((a) => a.name === "Sic");
  if (!sicCard || sicCard.level !== 25 || sicCard.recast !== 90 || sicCard.ce !== 0 || sicCard.ve !== 160) throw new Error("sic card");
  if (SIC_RECAST !== 90 || SIC_PET_RANGE !== 4 || READY_RANGE !== 5 || READY_LEVEL !== 25 || SIC_TP !== 1000) throw new Error("sic clock");
  if (zetaHeal(44) !== 900 || zetaHeal(45) !== 900 || zetaHeal(53) !== 924) throw new Error("zeta low");
  if (zetaHeal(104) !== 1077 || zetaHeal(105) !== 1080 || zetaHeal(199) !== 1268 || zetaHeal(200) !== 1310) throw new Error("zeta steps");
  for (let mnd = 45; mnd <= 104; mnd++) {
    if (zetaHeal(mnd) !== Math.floor(900 + 3 * (mnd - 45))) throw new Error(`zeta segment ${mnd}`);
  }
  if (ZETA_REGEN !== 14 || ZETA_REGEN_SECONDS !== 180) throw new Error("zeta regen");
  if (PET_FOODS.map((food) => `${food.level}:${food.regen}`).join(",") !== "12:1,24:3,36:5,48:8,60:11,72:14") throw new Error("pet food ranks");
  if (PET_FOODS.some((food) => food.level > 75 || food.id === "pet-food-eta")) throw new Error("post-75 food");
  const alpha = petFoodById("pet-food-alpha");
  const beta = petFoodById("pet-food-beta");
  const epsilon = petFoodById("pet-food-epsilon");
  if (!alpha || !beta || !epsilon) throw new Error("pet food cards");
  if (petFoodHeal(alpha, 0) !== 60 || petFoodHeal(alpha, 24) !== 69 || petFoodHeal(alpha, 25) !== 70 || petFoodHeal(alpha, 53) !== 71 || petFoodHeal(alpha, 175) !== 75) {
    throw new Error("alpha heal");
  }
  if (petFoodHeal(beta, 19) !== 150 || petFoodHeal(beta, 26) !== 162 || petFoodHeal(beta, 27) !== 164 || petFoodHeal(beta, 43) !== 180 || petFoodHeal(beta, 53) !== 180) {
    throw new Error("beta heal");
  }
  if (petFoodHeal(epsilon, 53) !== 739 || petFoodHeal(epsilon, 80) !== 820) throw new Error("epsilon heal");
  const full: Record<string, number> = {};
  for (const food of PET_FOODS) full[food.id] = 12;
  if (rewardBiscuit(full, null)?.id !== "pet-food-zeta") throw new Error("highest food");
  if (rewardBiscuit(full, "pet-food-alpha")?.id !== "pet-food-alpha") throw new Error("pinned food");
  if (rewardBiscuit({ ...full, "pet-food-alpha": 0 }, "pet-food-alpha")?.id !== "pet-food-zeta") throw new Error("empty pin falls back");
  if (rewardBiscuit({ "pet-food-beta": 1, "pet-food-zeta": 0 }, null)?.id !== "pet-food-beta") throw new Error("highest remaining");
  if (rewardBiscuit({}, null) !== null || rewardBiscuit(full, "not-food")?.id !== "pet-food-zeta") throw new Error("food fallback");
}
