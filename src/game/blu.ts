/**
 * Retail Blue Mage toolkit through level 75. No merits and no job points.
 *
 * A support job here is level 37. Burst Affinity is the only ability
 * inside that. Azure Lore is a one-hour and stays main-only. Chain
 * Affinity is 40. Convergence and Diffusion are Group 2 merits at 75.
 * They stay in the book, locked, until merits are turned on. Efflux is
 * 83. Unbridled Learning and Unbridled Wisdom are past the cap.
 * Enchainment and Assimilation are merit traits. None of those are in
 * this kit.
 *
 * Traits come from the spells that are set. Foot Kick does not grant
 * Lizard Killer by itself. Claw Cyclone is the other half. Wild Carrot is 4 trait points of Resist Sleep
 * and 3 set points. That trait needs 8 trait points and 4 set points, so
 * it is not granted alone. Actinic Burst and Plasma Charge are each 4
 * trait points of Auto Refresh. That trait needs 8 trait points and 8
 * set points, so it appears only when both are set. Chaotic Eye and
 * Zephyr Mantle are each 4 trait points of Conserve MP. That trait
 * needs 8 trait points and 4 set points, so it appears only when both
 * are set. Healing Breeze and Sheep Song are each 4 trait points of
 * Auto Regen. That trait needs 8 trait points and 6 set points, so it
 * appears only when both are set. Battle Dance and Uppercut are each
 * 4 trait points of Attack Bonus. That trait needs 8 trait points and
 * 6 set points, so it appears only when both are set. Frenetic Rip
 * and Disseverment are each 4 trait points of Accuracy Bonus. That
 * trait needs 8 trait points and 5 set points, so it appears only when
 * both are set. Magic Fruit is 4 trait points of Resist Sleep and 3
 * set points, the same as Wild Carrot. Setting both meets the 8 trait
 * points and 4 set points, so Resist Sleep I appears. Memento Mori is
 * 4 trait points of Magic Attack Bonus and 4 set points. Cursed Sphere
 * is 4 trait points and 2 set points. The trait needs 8 trait points
 * and 3 set points, so either spell alone does not grant it. Setting
 * both does. The +20 status is not the trait. Mind Blast is 4 trait
 * points of Clear Mind and 4 set points. Poison Breath is 4 trait
 * points and 1 set point. The trait needs 8 trait points and 3 set
 * points, so either spell alone does not grant it. Setting both does.
 * Cocoon, Refueling, and Cannonball are not trait spells. The Defense
 * Bonus page does not list Cocoon, and its script says Combos: None.
 * Cannonball's script says Combos: None. The static trait list stays empty. The set is what
 * adds Auto Regen, Attack Bonus, Accuracy Bonus, Auto Refresh,
 * Conserve MP, and Resist Sleep.
 * Blue Magic skill is ranked. The affinity buffs are stored. Chain
 * Affinity is spent by the next physical blue spell. Burst Affinity
 * waits for a damaging magical one. Mind Blast spends it. Wild Carrot is a cure and does not
 * spend it. Magic Fruit is a cure and does not spend it. Healing Breeze is a cure and does not spend it. Sheep Song,
 * Actinic Burst, Chaotic Eye, Zephyr Mantle, Cocoon, Refueling, and
 * Memento Mori deal no damage, so they do not spend it.
 *
 * Naked Hume Blue Mage grades, with no subjob: level 75 is 1046 HP,
 * 464 MP, and 53 in every attribute. Every job attribute is E. Spell
 * sets are what raise them, and none are set. A Warrior / Blue Mage
 * support job, which has no MP of its own, is 118 MP.
 *
 * The model wears Magus Attire, the artifact set: Magus Keffiyeh,
 * Jubbah, Bazubands, Shalwar, and Charuqs. Blue turban and veil, white
 * sleeves, a navy vest, a magenta sash, slate pants, and gold-toed
 * boots. The pieces are not equipped, so their stat lines are not on
 * the sheet. Immortal's Scimitar is the artifact weapon and is not in
 * the bag. The sword in the hands is the equipped weapon. The Bronze
 * Sword stands in.
 *
 * Current BG-Wiki letters, through this repo's level-75 skill cap.
 * Sword became A+ on 2014-10-07: Sword A+ 276, Club B− 240, Evasion C−
 * 220, Parrying D 210, Blue Magic A+ 276. No shield, no staff, no guard,
 * and no other weapon. A club can be skilled. The yard has no club this
 * job can wear.
 */

import type { JobAccess } from "./blm";
import { hitRate, rollSwordPdif } from "./formulas";
import { composedMagicAccuracy } from "./resist";
import { skillCap, type SkillRank } from "./skills";
import { characterBase, type JobId } from "./stats";

export const BLU_CAP = 75;

export type BluAbility = {
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

export const BLU_ABILITIES: BluAbility[] = [
  {
    name: "Azure Lore",
    level: 1,
    recast: 3600,
    duration: 30,
    access: "main",
    effect: "Enhances blue magic for 30 seconds. Physical blue magic acts as if 3500 TP were spent, and no TP is spent. Magical blue magic deals more damage. Foot Kick is the same at 3500 TP, so this does not change it. Uppercut's attack multiplier becomes 2.4. Frenetic Rip's weapon-skill coefficient becomes 2.609375. Disseverment's stays 1.5, and its attack stays at 90%. Cannonball's weapon-skill coefficient becomes 2.875. Tail Slap's coefficient stays 1.625 and its attack becomes 2.65. Hysteric Barrage's coefficient becomes 1.875. Firespit stays 3. Regurgitation stays 1.83. Asuran Claws stays 0.625 and its attack stays ×1.05. Heat Breath stays current HP divided by 2. Sickle Slash stays 1.5, its attack stays ×2.1, and its critical chance becomes 35%. Sub-zero Smash stays 2 and its attack stays ×1.05. Ram Charge's coefficient becomes 1.875 and its attack stays ×2.5. Vertical Cleave's coefficient stays 3 and its attack becomes 2.25. Magic Hammer's coefficient becomes 2. Dimensional Death's attack multiplier becomes 2.3. Battle Dance's DEX Down lasts as long as 3000 TP, which is 680 seconds. The unverified 800-second note is not used. Mind Blast's coefficient becomes 2.57421875, which is 2.07421875 plus 0.5. It does not double the stat term, and it is not consumed. Eyes On Me adds 2 to its coefficient. Maelstrom's coefficient stays 2.375. Wild Carrot and Magic Fruit are cures, so the damage clause does not change them. Exuviation is a cure, so it does not change. The motion is the one-hour: a short crouch, then the sword goes straight up and the off hand comes to the chest while a cyan pillar rises. Recast 1:00:00. Cumulative enmity 1, volatile enmity 300. Main job only.",
    ce: 1,
    ve: 300,
  },
  {
    name: "Burst Affinity",
    level: 25,
    recast: 120,
    duration: 30,
    access: "sub",
    effect: "The next magical blue spell can magic burst, and its weapon-skill coefficient is doubled. It lasts 30 seconds or until that spell, whichever is first. Mind Blast spends it. Magic Hammer spends it. The doubled term is 30% of MND times the level alpha, not the coefficient. A matching skillchain lets that spell magic burst, and the target shows Magic Burst in the chain's color. Lightning matches Impaction, Fragmentation, Light, and Radiance. Light, for Magic Hammer, matches Transfixion, Fusion, Light, and Radiance. Cannonball's Fusion is fire and light, so Mind Blast does not burst it. A matching chain multiplies the hit. BG-Wiki's current page is +35% for two weapon skills and +10% for each further weapon skill. The floor is taken after that step, then after Magic Burst Bonus. Blue Mage has no Magic Burst Bonus trait, so that second step stays 1 unless Black Mage supplies it. Day, weather, staff, affinity, and the resistance-rank bonus are not applied. Azure Lore does not open the window. It is spent even when the spell misses or the target is out of range. Wild Carrot and Magic Fruit are cures and do not magic burst, so the timer holds. Exuviation is a cure and does not spend it. Memento Mori, Amplification, and Triumphant Roar are self buffs and do not spend it. Lowing deals no damage, so it does not spend it. Heat Breath's damage is not magic-bursted, so Burst Affinity is not spent. Saline Coat, Temporal Shift, and Reactor Cool deal no damage, so they do not spend it. The motion is a horizontal sword slash that stops, with a red ring in front of the blade. Recast 0:02:00. Cumulative enmity 1, volatile enmity 300. A support job can use it.",
    ce: 1,
    ve: 300,
  },
  {
    name: "Chain Affinity",
    level: 40,
    recast: 120,
    duration: 30,
    access: "sub",
    effect: "The next physical blue spell can skillchain, spends all TP, and doubles its weapon-skill coefficient. It lasts 30 seconds or until that spell. Foot Kick spends it. Vertical Cleave spends it. Its coefficient stays 3. Its attack walks 1.05 at 0 TP, 2.1 at 1500, and 2.2 at 3000. Additional TP does not raise the coefficient. Cannonball spends it and can open Fusion. Without this, Cannonball's coefficient stays 1.75. With it, that coefficient walks 1.75 at 0 TP, 2.125 at 1500, and 2.75 at 3000. The motion raises the sword overhead, then cuts down on a diagonal and holds, with a pale trail along the blade. Recast 0:02:00. Cumulative enmity 1, volatile enmity 300. Level 40, so a level-37 sub has not learned it.",
    ce: 1,
    ve: 300,
  },
  {
    name: "Convergence",
    level: 75,
    recast: 600,
    duration: 60,
    access: "main",
    merit: true,
    effect: "Merit ability. Not unlocked. Would make the next magical blue spell single-target and stronger, for 60 seconds or until that spell. The motion would bring both hands together at the chest around a tight violet wisp. Recast 0:10:00. Cumulative enmity 1, volatile enmity 300. Main job only.",
    ce: 1,
    ve: 300,
  },
  {
    name: "Diffusion",
    level: 75,
    recast: 600,
    duration: 60,
    access: "main",
    merit: true,
    effect: "Merit ability. Not unlocked. Would share the next support blue spell with party members within 9 yalms, for 60 seconds or until that spell. The motion would spread both arms while a pale blue ring opens on the ground. Recast 0:10:00. Cumulative enmity 1, volatile enmity 300. Main job only.",
    ce: 1,
    ve: 300,
  },
];

export type BluTrait = {
  name: string;
  level: number;
  access: JobAccess;
  effect: string;
};

/** Traits are learned from set blue magic. Nothing is set, so the menu stays empty instead of falling through to Warrior. */
export const BLU_TRAITS: BluTrait[] = [];

export const BLU_SKILLS: { name: string; rank: SkillRank }[] = [
  { name: "Sword", rank: "A+" },
  { name: "Club", rank: "B-" },
  { name: "Evasion", rank: "C-" },
  { name: "Parrying", rank: "D" },
  { name: "Blue Magic", rank: "A+" },
];

/**
 * Blue magic through level 75. Points and slots are the level-75 table:
 * 1–10 is 10/6, then +5 points and +2 slots each 10 levels, through
 * 45 points and 20 spells at 71–75. Assimilation is a merit and adds
 * nothing. A spell is learned only as Blue Mage main, alive, with the
 * monster claimed, after that monster readied the move during that life.
 * The skill gate is 31 below the A+ cap at the spell's level.
 * Actinic Burst and Plasma Charge are granted until a Ghrah and a Phuabo
 * are in the yard to learn them from. Chaotic Eye and Zephyr Mantle are
 * granted until a Coeurl and a Puk are in the yard. Healing Breeze and
 * Sheep Song are granted until a Dhalmel and a Sheep are in the yard.
 * Battle Dance and Uppercut are granted until an Orc and a Goobbue are
 * in the yard. Frenetic Rip and Disseverment are granted until an Imp
 * and an Aern are in the yard. Cocoon and Refueling are granted until
 * a Crawler and a Cluster are in the yard. Neither is a trait combo.
 * Magic Fruit and Cannonball are granted until an Opo-opo and a
 * Wamouracampa are in the yard. Memento Mori and Mind Blast are granted
 * until a Corse and a Soulflayer are in the yard. Bludgeon, Cursed
 * Sphere, Blastbomb, Claw Cyclone, and Poison Breath are granted
 * until a Cardian, a Fly, an Orcish Warmachine, a Tiger, and a Hound
 * are in the yard. Sandspin, Pollen,
 * Power Attack, Sprout Smack, and Wild Oats are granted until a Worm,
 * a Bee, a Beetle, a Sapling, and a Mandragora are in the yard.
 * Metallic Body, Queasyshroom, Head Butt, Feather Storm, and Helldive
 * are granted until a Crab, a Funguar, a Quadav, a Yagudo, and a
 * Lesser Bird are in the yard. Soporific, Screwdriver, Bomb Toss, and
 * Grand Slam are granted until a Flytrap, a Pugil, a Goblin, and a Gigas
 * are in the yard. Sound Blast, Death Ray, Smite of Rage, Digest, and
 * Pinecone Bomb are granted until a Cockatrice, a Hecteyes, an Evil
 * Weapon, a Slime, and a Treant are in the yard. MP Drainkiss,
 * Blitzstrahl, Stinking Gas, Mandibular Bite, and Magnetite Cloud are
 * granted until a Leech, a Doll, a Doomed, an Antlion, and an Antica
 * are in the yard. Blank Gaze, Jet Stream,
 * Mysterious Light, Terror Touch, and Venom Shell are granted until an
 * Opo-opo, a Flock Bat, a Magic Pot, a Ghost, and an Uragnite are in the
 * yard. Geist Wall, Awful Eye, Blood Saber, Jettatura, and Ice Break
 * are granted until an Eft, a Bugard, a Skeleton, a Hippogryph, and a
 * Golem are in the yard. Self-Destruct, Frightful Roar, Cold Wave,
 * Filamented Hold, and Hecatomb Wave are granted until a Bomb, a Taurus,
 * a Snoll, a Diremite, and a Demon are in the yard. Radiant Breath,
 * Feather Barrier, Flying Hip Press, Light of Penance, and Death Scissors
 * are granted until a Wyvern, a Greater Bird, a Bugbear, a Tonberry, and
 * a Scorpion are in the yard. Dimensional Death, Spiral Spin, Maelstrom,
 * Eyes On Me, and Seedspray are granted until a Shadow, a Ladybug, a
 * Sea Monk, an Ahriman, and a Rafflesia are in the yard. Bad Breath,
 * Body Slam, 1000 Needles, Spinal Cleave, and Frypan are granted until
 * a Morbol, a Dragon, a Sabotender, a Qutrub, and a Moblin are in the yard.
 * Hydro Shot, Feather Tickle, Yawn, Voracious Trunk, and Infrasonics are
 * granted until a Sahagin, a Colibri, an Apkallu, a Marid, and a Lizard
 * are in the yard. Frost Breath, Sandspray, Corrosive Ooze, Diamondhide,
 * and Enervation are granted until a Raptor, a Qiqirn, a Slug, and a
 * Troll are in the yard. Warm-Up and Firespit are granted until a
 * Mamool Ja is in the yard. Tail Slap and Hysteric Barrage are granted
 * until a Lamia is in the yard. Regurgitation is granted until a Peiste
 * is in the yard. Amplification is granted until a Flan is in the yard.
 * Asuran Claws is granted until a Gnole is in the yard. Lowing is granted
 * until a Buffalo is in the yard. Heat Breath is granted until a Manticore
 * is in the yard. Triumphant Roar is granted until a Gargouille is in the
 * yard. Sickle Slash is granted until a Spider is in the yard.
 * Sub-zero Smash is granted until a Ruszor is in the yard. Saline Coat
 * is granted until an Xzomit is in the yard. Ram Charge is granted until
 * a Ram is in the yard. Temporal Shift is granted until an Hpemde is in
 * the yard. Magic Hammer is granted until a Poroggo is in the yard.
 * Reactor Cool is granted until a Zdei is in the yard. Exuviation is
 * granted until a Wamoura is in the yard. Vertical Cleave is granted
 * until an Euvhi is in the yard. Foot Kick and Wild Carrot are not.
 */
type BlueShared = {
  name: string;
  level: number;
  mp: number;
  points: number;
  cast: number;
  recast: number;
  /** HP granted while the spell is set and Blue Mage is main. */
  hp: number;
  /** AGI granted while the spell is set and Blue Mage is main. */
  agi: number;
  /** STR granted while the spell is set and Blue Mage is main. */
  str: number;
  /** DEX granted while the spell is set and Blue Mage is main. */
  dex: number;
  /** CHR granted while the spell is set and Blue Mage is main. */
  chr: number;
  /** Trait points toward Auto Refresh. Zero when the spell is not on that list. */
  refreshTrait: number;
  /** Trait points toward Conserve MP. Zero when the spell is not on that list. */
  conserveTrait: number;
  /** Trait points toward Auto Regen. Zero when the spell is not on that list. */
  regenTrait: number;
  /** Trait points toward Attack Bonus. Zero when the spell is not on that list. */
  attackTrait: number;
  /** Trait points toward Accuracy Bonus. Zero when the spell is not on that list. */
  accuracyTrait: number;
  /** Trait points toward Resist Sleep. Zero when the spell is not on that list. */
  sleepTrait: number;
  /** INT granted while the spell is set and Blue Mage is main. */
  int: number;
  /** MND granted while the spell is set and Blue Mage is main. Negative is a penalty. */
  mnd: number;
  /** VIT granted while the spell is set and Blue Mage is main. */
  vit: number;
  /** MP granted while the spell is set and Blue Mage is main. Absent is 0. Mind Blast is 5. */
  setMp?: number;
  /** Trait points toward Magic Attack Bonus. Absent is 0. */
  mabTrait?: number;
  /** Trait points toward Clear Mind. Absent is 0. */
  clearTrait?: number;
  /** Trait points toward Counter. Absent is 0. Enervation is 4. */
  counterTrait?: number;
  /** Trait points toward Beast Killer. Absent is 0. */
  beastTrait?: number;
  /** Trait points toward Plantoid Killer. Absent is 0. */
  plantTrait?: number;
  /** Trait points toward Max MP Boost. Absent is 0. Metallic Body is 4. */
  mpTrait?: number;
  /** Trait points toward Rapid Shot. Absent is 0. Feather Storm is 4. */
  rapidTrait?: number;
  /** Trait points toward Undead Killer. Absent is 0. Bludgeon and Smite of Rage are 4. */
  undeadTrait?: number;
  /** Trait points toward Lizard Killer. Absent is 0. Foot Kick, Claw Cyclone, and Ram Charge are 4. */
  lizardTrait?: number;
  /** Trait points toward Evasion Bonus. Absent is 0. Screwdriver is 4. */
  evasionTrait?: number;
  /** Trait points toward Defense Bonus. Absent is 0. Grand Slam and Saline Coat are 4. */
  defenseTrait?: number;
  /** Trait points toward Magic Defense Bonus. Absent is 0. Magnetite Cloud is 4. */
  mdbTrait?: number;
  /** Trait points toward Resist Gravity. Absent is 0. Feather Barrier is 4. */
  gravityTrait?: number;
  /** Trait points toward Store TP. Absent is 0. Tail Slap and Sickle Slash are 4. */
  storeTrait?: number;
  /** Trait points toward Max HP Boost. Absent is 0. Flying Hip Press is 4. Body Slam and Frypan are 4. */
  hpTrait?: number;
  /** Trait points toward Fast Cast. Absent is 0. Bad Breath and Sub-zero Smash are 4. */
  fastTrait?: number;
  family: "Rabbit" | "Ghrah" | "Phuabo" | "Coeurl" | "Puk" | "Dhalmel" | "Sheep" | "Orc" | "Goobbue" | "Imp" | "Aern" | "Crawler" | "Cluster" | "Opo-opo" | "Wamouracampa" | "Corse" | "Soulflayer" | "Worm" | "Bee" | "Beetle" | "Sapling" | "Mandragora" | "Crab" | "Funguar" | "Quadav" | "Yagudo" | "Bird" | "Cardian" | "Fly" | "Warmachine" | "Tiger" | "Hound" | "Flytrap" | "Pugil" | "Goblin" | "Gigas" | "Cockatrice" | "Hecteyes" | "Evil Weapon" | "Slime" | "Treant" | "Bat" | "Pot" | "Ghost" | "Uragnite" | "Leech" | "Doll" | "Doomed" | "Antlion" | "Antica" | "Eft" | "Bugard" | "Skeleton" | "Hippogryph" | "Golem" | "Bomb" | "Taurus" | "Snoll" | "Diremite" | "Demon" | "Wyvern" | "Roc" | "Bugbear" | "Tonberry" | "Scorpion" | "Shadow" | "Ladybug" | "Sea Monk" | "Ahriman" | "Rafflesia" | "Morbol" | "Dragon" | "Sabotender" | "Qutrub" | "Moblin" | "Sahagin" | "Colibri" | "Apkallu" | "Marid" | "Lizard" | "Raptor" | "Slug" | "Qiqirn" | "Troll" | "Mamool" | "Lamia" | "Peiste" | "Flan" | "Gnole" | "Buffalo" | "Manticore" | "Gargouille" | "Spider" | "Ruszor" | "Xzomit" | "Ram" | "Hpemde" | "Poroggo" | "Zdei" | "Wamoura" | "Euvhi";
  learnSkill: number;
  /** True until the monster that teaches it is in the yard. */
  granted: boolean;
};

export type BlueSpell =
  | (BlueShared & {
      kind: "physical";
      hits: number;
      ftp: number;
      /** Upper cap on the skill term of base damage. */
      dCap: number;
      strMod: number;
      dexMod: number;
      /** Absent when the spell does not read VIT. Cannonball is 50% VIT. Power Attack is 10%. Sprout Smack is 30%. */
      vitMod?: number;
      /** Absent when the spell does not read AGI. Wild Oats is 30% AGI. Feather Storm and Helldive are 30% AGI. */
      agiMod?: number;
      /** Absent when the spell does not read INT. Queasyshroom is 20% INT. Head Butt is 20% INT. */
      intMod?: number;
      /** Ranged attack type. Queasyshroom and Feather Storm. The yard's pDIF still uses melee attack. */
      ranged?: boolean;
      /** Absent when the spell does not read CHR. Bludgeon is 30% CHR. */
      chrMod?: number;
      /** Absent when the spell does not read MND. Screwdriver is 20% MND. */
      mndMod?: number;
      chain: "Detonation" | "Impaction" | "Liquefaction" | "Induration" | "Distortion" | "Fusion" | "Reverberation" | "Transfixion" | "Compression" | "Scission" | "Fragmentation" | "Gravitation";
      /** Second skillchain property, tried after the first. Uppercut is Impaction. Screwdriver is Scission. Terror Touch is Reverberation. Seedspray is Detonation. Dimensional Death is Impaction. */
      chain2?: "Impaction" | "Scission" | "Reverberation" | "Detonation";
      /** Single-target range. Absent when the spell is centered on you. */
      range?: number;
      /** Area around the caster, in yalms. Absent for a single-target hit. */
      radius?: number;
      /** Fan in front of you. Claw Cyclone. The half-angle is BLUE_CONE. */
      cone?: boolean;
    })
  | (BlueShared & {
      kind: "cure";
      range: number;
    })
  | (BlueShared & {
      kind: "flash";
      /** Area around the caster, in yalms. */
      radius: number;
      seconds: number;
      /** Printed magic accuracy. BG says it is unknown and probably Flash's +200. */
      macc: number;
      accDown: number;
      ce: number;
      ve: number;
    })
  | (BlueShared & {
      kind: "spikes";
      seconds: number;
      ce: number;
      ve: number;
    })
  | (BlueShared & {
      kind: "silence";
      /** Single-target range, in yalms. The card leaves it blank. */
      range: number;
      seconds: number;
      ce: number;
      ve: number;
    })
  | (BlueShared & {
      kind: "mantle";
      seconds: number;
      shadows: number;
      ce: number;
      ve: number;
    })
  | (BlueShared & {
      kind: "song";
      /** Area around the caster, in yalms. */
      radius: number;
      ce: number;
      ve: number;
    })
  | (BlueShared & {
      kind: "breeze";
      /** Party area around the caster, in yalms. */
      radius: number;
    })
  | (BlueShared & {
      kind: "cocoon";
      seconds: number;
      /** Defense percent, in 256ths. 128 is +50%. */
      defenseNumer: number;
      ce: number;
      ve: number;
    })
  | (BlueShared & {
      kind: "metal";
      seconds: number;
      ce: number;
      ve: number;
    })
  | (BlueShared & {
      kind: "refuel";
      seconds: number;
      /** Haste on the /1024 scale. 102 is 10%. */
      haste: number;
      ce: number;
      ve: number;
    })
  | (BlueShared & {
      kind: "memento";
      seconds: number;
      /** Magic Attack Bonus from the status. The trait is separate and is not this number. */
      mab: number;
      ce: number;
      ve: number;
    })
  | (BlueShared & {
      kind: "magical";
      range: number;
      /** Printed fTP. BG 531/256. The script's 2.08 is the rounded form and is not used. */
      ftp: number;
      /** Added to fTP while Azure Lore is up. Not the 3500 interpolation. */
      azureFtp: number;
      /** Fraction of MND in the stat term. */
      mndMod: number;
      /** Multiplier on caster MND minus target MND. */
      dStat: number;
      /** Cap on main level + 2. */
      dCap: number;
      /** Additional-effect potency. A percent, not the enfeeble formula. */
      paralyze: number;
      paralyzeSeconds: number;
    })
  | (BlueShared & {
      kind: "sand";
      /** Area around the caster, in yalms. */
      radius: number;
      ftp: number;
      intMod: number;
      dStat: number;
      dCap: number;
      half: number;
      low: number;
      accDown: number;
      seconds: number;
    })
  | (BlueShared & {
      kind: "pollen";
      /** Printed floor. The curve is not clamped to the soft cap. */
      min: number;
    })
  | (BlueShared & {
      kind: "orb";
      /** Cast range. The splash is centered on that target. */
      range: number;
      ftp: number;
      intMod: number;
      /** Multiplier on caster INT minus target INT. */
      dStat: number;
      dCap: number;
      half: number;
      low: number;
      element: "water" | "fire";
      /** Bind seconds. Absent when the spell does not bind. Blastbomb is 30. */
      bind?: number;
    })
  | (BlueShared & {
      kind: "breath";
      /** Fan in front of you. The card leaves the range blank. */
      range: number;
      /** Current HP is divided by this. Poison Breath is 10. Magnetite Cloud is 6. */
      hpMod: number;
      /** Main level is divided by this, then added. Poison Breath is 1.25. Magnetite Cloud is 1.875. */
      lvlMod: number;
      /** Absent when the breath does not poison. Poison Breath is 4. */
      poison?: number;
      poisonSeconds?: number;
      /** Weight's movement cut, in percent. Magnetite Cloud is 25. */
      weight?: number;
      weightSeconds?: number;
      /** Blind's accuracy down. Hecatomb Wave is 20. Absent when the breath does not blind. */
      blind?: number;
      blindSeconds?: number;
      /** Slow in 1024ths. Radiant Breath stores the script's 2500 as 250. Absent when the breath does not slow. */
      slow?: number;
      slowSeconds?: number;
      /** Silence seconds. The status has no potency. Radiant Breath is 90. Bad Breath is 60. Absent when the breath does not silence. */
      silenceSeconds?: number;
      /** Paralyze proc chance, in percent. Bad Breath is 15. Absent when the breath does not paralyze. */
      paralyze?: number;
      paralyzeSeconds?: number;
      /** Bind seconds. Bad Breath is 60. Absent when the breath does not bind. */
      bindSeconds?: number;
      /** Centered on you, not a fan. Flying Hip Press. */
      radial?: boolean;
      /** Damage is not magic-bursted and Burst Affinity is not spent. Flying Hip Press. */
      noBurst?: boolean;
      element: "water" | "earth" | "wind" | "light" | "ice" | "fire";
    })
  | (BlueShared & {
      kind: "sound";
      /** Area around the caster, in yalms. The card's 6', not the client 50. */
      radius: number;
      seconds: number;
      /** INT Down potency. It does not tick down. */
      intDown: number;
      ce: number;
      ve: number;
    })
  | (BlueShared & {
      kind: "ray";
      /** Single-target range. The card leaves it blank. This yard uses 12'. */
      range: number;
      /** Base fTP. Azure Lore adds azureFtp. It does not replace this. */
      ftp: number;
      azureFtp: number;
      /** Fraction of INT in the stat term. Not floored before the alpha. */
      intMod: number;
      /** Fraction of MND in the stat term. Not floored before the alpha. */
      mndMod: number;
      /** Multiplier on caster INT minus target INT. */
      dStat: number;
      dCap: number;
      half: number;
      low: number;
    })
  | (BlueShared & {
      kind: "digest";
      /** Single-target range. The card leaves it blank. This yard uses 3'. */
      range: number;
      /** Multiplier on floor(Blue Magic skill × 0.11). Digest is 5. */
      dmgMult: number;
      ce: number;
      ve: number;
    })
  | (BlueShared & {
      kind: "kiss";
      /** Single-target range. The card leaves it blank. The client stores 30, so this yard uses 3'. */
      range: number;
      /** Multiplier on floor(Blue Magic skill × 0.11). MP Drainkiss is 3.5. */
      dmgMult: number;
      /** Soft cap before resist, magic burst, and Magic Attack Bonus. */
      cap: number;
      ce: number;
      ve: number;
    })
  | (BlueShared & {
      kind: "blitz";
      /** Single-target range. The client stores 120, so this yard uses 12'. */
      range: number;
      /** Base fTP. Azure Lore adds nothing. The default azure bonus is 0. */
      ftp: number;
      /** Fraction of INT in the stat term. Not floored before the alpha. */
      intMod: number;
      /** Fraction of MND in the stat term. Not floored before the alpha. */
      mndMod: number;
      /** Multiplier on caster INT minus target INT. */
      dStat: number;
      dCap: number;
      half: number;
      low: number;
      /** Stun seconds before a resist. A quarter resist does not stun. */
      stun: number;
    })
  | (BlueShared & {
      kind: "gas";
      /** Area around the caster, in yalms. The card's 6'. */
      radius: number;
      seconds: number;
      /** VIT Down potency. It does not tick. */
      vitDown: number;
      ce: number;
      ve: number;
    })
  | (BlueShared & {
      kind: "gaze";
      /** Single-target range. The card prints 14'. */
      range: number;
      ce: number;
      ve: number;
    })
  | (BlueShared & {
      kind: "mystery";
      /** Area around the caster, in yalms. */
      radius: number;
      /** Printed fTP. 248/256. The script's 2.0 is the rewritten coefficient and is not used. */
      ftp: number;
      chrMod: number;
      /** Multiplier on caster CHR minus target CHR. */
      dStat: number;
      dCap: number;
      half: number;
      low: number;
      /** Weight's movement cut, in percent. It is the Gravity status. */
      weight: number;
      seconds: number;
    })
  | (BlueShared & {
      kind: "venom";
      /** Area around the caster, in yalms. The card prints about 6'. */
      radius: number;
      poison: number;
      seconds: number;
      ce: number;
      ve: number;
    })
  | (BlueShared & {
      kind: "geist";
      /** Area around the caster, in yalms. The card prints 6'. */
      radius: number;
      ce: number;
      ve: number;
    })
  | (BlueShared & {
      kind: "awful";
      /** Fan in front of you. The card leaves the range blank. */
      range: number;
      seconds: number;
      /** STR Down at the moment it lands. It decays. */
      strDown: number;
      /** Seconds between each lost point of STR. */
      tick: number;
      ce: number;
      ve: number;
    })
  | (BlueShared & {
      kind: "saber";
      /** Area around the caster, in yalms. The card leaves it blank. */
      radius: number;
      /** Multiplier on floor(Blue Magic skill × 0.11). Blood Saber is 3.5. No cap. */
      dmgMult: number;
      ce: number;
      ve: number;
    })
  | (BlueShared & {
      kind: "jetta";
      /** Fan in front of you. The card prints 9'. */
      range: number;
      /** Terror seconds. The card's about 2. The script's 5 is not used. */
      seconds: number;
      ce: number;
      ve: number;
    })
  | (BlueShared & {
      kind: "ice";
      /** Area around the caster, in yalms. The card leaves it blank. */
      radius: number;
      ftp: number;
      intMod: number;
      dStat: number;
      dCap: number;
      half: number;
      low: number;
      /** Bind seconds. The card leaves it blank. The script stores 30. */
      bind: number;
    })
  | (BlueShared & {
      kind: "destruct";
      /** Area around the caster, in yalms. The card leaves it blank. This yard uses 6'. */
      radius: number;
    })
  | (BlueShared & {
      kind: "roar";
      /** Area around the caster, in yalms. Not a fan. */
      radius: number;
      seconds: number;
      /** Defense cut as a fraction in (0, 1). 26/256 is about 10%. */
      defense: number;
      ce: number;
      ve: number;
    })
  | (BlueShared & {
      kind: "cold";
      /** Area around the caster, in yalms. The header says a fan. The script is not conal. */
      radius: number;
      seconds: number;
    })
  | (BlueShared & {
      kind: "hold";
      /** Fan in front of you. The card prints about 9'. Not a gaze. */
      range: number;
      seconds: number;
      /** Slow in 1024ths. The script's 2500 is stored as 250, the same /10 scale as Sprout Smack. */
      slow: number;
      ce: number;
      ve: number;
    })
  | (BlueShared & {
      kind: "feather";
      seconds: number;
      /** Evasion added by the status. The tested page is +25. The script's 20 is not used. */
      evasion: number;
      ce: number;
      ve: number;
    })
  | (BlueShared & {
      kind: "penance";
      /** Single-target range. The card prints 15'. Not a cone. */
      range: number;
      seconds: number;
      /** Blind's accuracy down. The card is −100. The script's 10 is not used. */
      accDown: number;
      /** TP removed. Not a duration. */
      tpCut: number;
      ce: number;
      ve: number;
    })
  | (BlueShared & {
      kind: "mael";
      /** Area around the caster, in yalms. The card leaves it blank. */
      radius: number;
      /** Printed coefficient. The card and the script both say 2.375. */
      ftp: number;
      intMod: number;
      mndMod: number;
      /** Multiplier on caster INT minus target INT. */
      dStat: number;
      dCap: number;
      half: number;
      low: number;
      /** STR Down potency. It does not tick. */
      strDown: number;
      seconds: number;
    })
  | (BlueShared & {
      kind: "eyes";
      /** Single-target range. The card prints about 13'. */
      range: number;
      /** Printed coefficient. Azure Lore adds azureFtp. */
      ftp: number;
      azureFtp: number;
      chrMod: number;
      /** Multiplier on caster CHR minus target CHR. */
      dStat: number;
      dCap: number;
      half: number;
      low: number;
    })
  | (BlueShared & {
      kind: "needles";
      /** Circle around you, in yalms. The card leaves it blank. */
      radius: number;
      /** Unsplit damage. Divided by the number of targets in the circle. */
      damage: number;
      /** Magic accuracy penalty. The script's −50. */
      maccPenalty: number;
    })
  | (BlueShared & {
      kind: "tickle";
      /** Single-target range. The card prints 11'. */
      range: number;
      /** TP removed on a full hit. A half resist removes half. */
      tpCut: number;
      ce: number;
      ve: number;
    })
  | (BlueShared & {
      kind: "yawn";
      /** Circle around you, in yalms. A gaze, not a fan. */
      radius: number;
      /** Unresisted sleep. The script stores 90. The card's 70–90 is not a second roll. */
      seconds: number;
      ce: number;
      ve: number;
    })
  | (BlueShared & {
      kind: "trunk";
      /** Single-target range. The card leaves it blank. */
      range: number;
      ce: number;
      ve: number;
    })
  | (BlueShared & {
      kind: "infra";
      /** Fan in front of you. The card leaves the range blank. */
      range: number;
      /** Evasion down. It does not tick. */
      evaDown: number;
      seconds: number;
      ce: number;
      ve: number;
    })
  | (BlueShared & {
      kind: "spray";
      /** Fan in front of you. The card prints about 6.5'. */
      range: number;
      /** Blind's accuracy down. It does not tick. */
      accDown: number;
      seconds: number;
      ce: number;
      ve: number;
    })
  | (BlueShared & {
      kind: "ooze";
      /** Single-target range. The card's ~11'. The script hits one enemy. */
      range: number;
      /** Printed fTP. 556/256. The script's 2.125 is not used. */
      ftp: number;
      /** Added to fTP while Azure Lore is up. */
      azureFtp: number;
      intMod: number;
      /** Multiplier on caster INT minus target INT. */
      dStat: number;
      dCap: number;
      half: number;
      low: number;
      /** Attack Down numer out of 256. Defense Down uses the same cut as a fraction. */
      downNumer: number;
      seconds: number;
      ce: number;
    })
  | (BlueShared & {
      kind: "hide";
      seconds: number;
      /** Party area around you, in yalms. The card leaves it blank. */
      radius: number;
      ce: number;
      ve: number;
    })
  | (BlueShared & {
      kind: "enerv";
      /** Area around the caster, in yalms. The card prints about 11.5'. */
      radius: number;
      seconds: number;
      /** Defense cut as a fraction in (0, 1). 26/256 is about 10%. */
      defense: number;
      /** Magic Defense Bonus removed. */
      mdb: number;
      ce: number;
      ve: number;
    })
  | (BlueShared & {
      kind: "warmup";
      seconds: number;
      /** Accuracy Boost. Flat, not a percent. */
      accuracy: number;
      /** Evasion Boost. Flat. Feather Barrier's +25 is a stronger status and is left alone. */
      evasion: number;
      ce: number;
      ve: number;
    })
  | (BlueShared & {
      kind: "spit";
      range: number;
      /** Printed multiplier. The script stores 3. Azure Lore does not add to it. */
      ftp: number;
      azureFtp: number;
      intMod: number;
      mndMod: number;
      /** Multiplier on caster INT minus target INT. */
      dStat: number;
      dCap: number;
      half: number;
      low: number;
    })
  | (BlueShared & {
      kind: "gorge";
      range: number;
      /** Script multiplier. The card's 1.875 is not used. */
      ftp: number;
      azureFtp: number;
      mndMod: number;
      /** Multiplier on caster INT minus target INT. The stat term is MND. dINT is still INT. */
      dStat: number;
      dCap: number;
      half: number;
      low: number;
      /** Bind seconds. Applied after a hit that dealt damage. */
      bind: number;
      /** Final multiplier when you are behind the target. */
      behind: number;
      ce: number;
      ve: number;
    })
  | (BlueShared & {
      kind: "amp";
      seconds: number;
      /** Magic Atk. Boost. A stronger Magic Atk. Boost is left alone. */
      mab: number;
      /** Magic Def. Boost. Flat. It stacks with Dream Shroud's magic defense. */
      mdb: number;
      ce: number;
      ve: number;
    })
  | (BlueShared & {
      kind: "lowing";
      /** Circle around you, in yalms. The card leaves it blank. */
      radius: number;
      seconds: number;
      /** TP removed every 3 seconds. */
      tpCut: number;
      /** MP the status would remove each tick. The hare has no MP pool, so this is not drained. */
      mpCut: number;
      ce: number;
      ve: number;
    })
  | (BlueShared & {
      kind: "triumph";
      seconds: number;
      /** Attack bonus in 256ths. 38 is about 15%. It stacks with Berserk. */
      numer: number;
      ce: number;
      ve: number;
    })
  | (BlueShared & {
      kind: "saline";
      seconds: number;
      /** Magic Def. Boost. It decays by 1 every tick seconds, and it does not fall under 0. */
      mdb: number;
      /** Seconds between each point of decay. */
      tick: number;
      ce: number;
      ve: number;
    })
  | (BlueShared & {
      kind: "shift";
      /** Circle around you, in yalms. The card leaves it blank. */
      radius: number;
      seconds: number;
      ce: number;
      ve: number;
    })
  | (BlueShared & {
      kind: "hammer";
      /** Single-target range. The card leaves it blank. This yard uses 12'. */
      range: number;
      /** Base coefficient. Azure Lore adds azureFtp. Burst Affinity does not. */
      ftp: number;
      azureFtp: number;
      /** Fraction of MND in the stat term. */
      mndMod: number;
      /** Multiplier on caster MND minus target MND. */
      dStat: number;
      /** Cap on main level + 2. */
      dCap: number;
      /** dMND above this counts for half. */
      half: number;
      /** Floor on the dMND term. */
      low: number;
    })
  | (BlueShared & {
      kind: "reactor";
      seconds: number;
      /** Defense Boost in 256ths. 31 is the 12% the script stores as power 12. */
      defenseNumer: number;
      /** Ice Spikes base before Magic Attack Bonus. The script stores 5. */
      spike: number;
      ce: number;
      ve: number;
    })
  | (BlueShared & {
      kind: "exuv";
      ce: number;
      ve: number;
    });

export const FOOT_KICK = {
  kind: "physical",
  name: "Foot Kick",
  level: 1,
  mp: 5,
  points: 2,
  cast: 0.5,
  recast: 6.5,
  range: 4.5,
  hits: 1,
  ftp: 1,
  dCap: 9,
  strMod: 0.1,
  dexMod: 0.1,
  hp: 0,
  agi: 1,
  str: 0,
  dex: 0,
  chr: 0,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 0,
  mnd: 0,
  vit: 0,
  lizardTrait: 4,
  chain: "Detonation",
  family: "Rabbit",
  learnSkill: 0,
  granted: false,
} satisfies BlueSpell;

/**
 * BG-Wiki Cocoon. Defense Boost on yourself.
 * Level 8, 10 MP, 1 point, cast 1.75s, recast 60s, duration 90s.
 * Defense +50%. That is 128/256, applied after Protect is added to
 * defense, then floored once with the other defense percents.
 * BG-Wiki says it overwrites most Defense Down. This yard's Defense
 * Down is on the hare, not on you. Aegis Schism is not here.
 * Reactor Cool's Defense Boost is weaker, and this spell overwrites it.
 * The card says Target: Single and leaves the range blank. The client
 * row matches Zephyr Mantle: valid targets 1, area 6, range 0. This
 * yard casts it on you. Diffusion would share it. Diffusion is a
 * locked merit, so it stays on you.
 * The duration is not passed through Enhancing Magic. You are 75, so
 * a lower-level penalty does not apply.
 * Gamer Escape calls the element earth. The spell list stores none.
 * There is no damage, so the element is not rolled.
 * Cumulative enmity 1, volatile 80. A spell on yourself does not claim.
 * Set bonus VIT +3. The script says Combos: None. The Defense Bonus
 * page does not list this spell, so it grants no trait.
 * It does not break Mazurka. Chain Affinity and Burst Affinity are
 * not spent.
 * Learned from Crawler at Blue Magic 0+. Granted until a Crawler is
 * in the yard.
 */
export const COCOON_SECONDS = 90;
export const COCOON_DEFENSE_NUMER = 128;
export const COCOON_CE = 1;
export const COCOON_VE = 80;

export const COCOON = {
  kind: "cocoon",
  name: "Cocoon",
  level: 8,
  mp: 10,
  points: 1,
  cast: 1.75,
  recast: 60,
  seconds: COCOON_SECONDS,
  defenseNumer: COCOON_DEFENSE_NUMER,
  ce: COCOON_CE,
  ve: COCOON_VE,
  hp: 0,
  agi: 0,
  str: 0,
  dex: 0,
  chr: 0,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 0,
  mnd: 0,
  vit: 3,
  family: "Crawler",
  learnSkill: blueLearnSkill(8),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Wild Carrot. Restores HP for one party member.
 * Level 30, 37 MP, 3 points, cast 2.5s, recast 6s, range 20'.
 * Set bonus HP +5. Resist Sleep is 4 trait points, and the trait
 * needs 8, so this spell alone does not grant it. Learned from Rabbit
 * at Blue Magic 62+. The monster's own Wild Carrot heal is a different
 * formula and is not this spell.
 */
export const WILD_CARROT = {
  kind: "cure",
  name: "Wild Carrot",
  level: 30,
  mp: 37,
  points: 3,
  cast: 2.5,
  recast: 6,
  range: 20,
  hp: 5,
  agi: 0,
  str: 0,
  dex: 0,
  chr: 0,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 4,
  int: 0,
  mnd: 0,
  vit: 0,
  family: "Rabbit",
  learnSkill: blueLearnSkill(30),
  granted: false,
} satisfies BlueSpell;

/**
 * BG-Wiki Actinic Burst. Area Flash, centered on you.
 * Level 74, 24 MP, 4 points, cast 0.5s, recast 60s.
 * Accuracy −300 for about 15 seconds. No damage.
 * Cumulative enmity 180, volatile 1080.
 * Set bonus CHR +2 and HP +20. Auto Refresh trait points 4.
 * It does not overwrite Flash. Flash overwrites it.
 * Magic accuracy bonus is unpublished. The note says it is probably
 * Flash's +200, so that 200 is what is rolled.
 * The range box is blank. This yard uses 10', the area used by the
 * other radial spells here. Learned from Ghrah at Blue Magic 240+.
 * Granted until a Ghrah is in the yard.
 */
export const ACTINIC_RADIUS = 10;
export const ACTINIC_SECONDS = 15;
export const ACTINIC_MACC = 200;
export const ACTINIC_CE = 180;
export const ACTINIC_VE = 1080;

export const ACTINIC_BURST = {
  kind: "flash",
  name: "Actinic Burst",
  level: 74,
  mp: 24,
  points: 4,
  cast: 0.5,
  recast: 60,
  radius: ACTINIC_RADIUS,
  seconds: ACTINIC_SECONDS,
  macc: ACTINIC_MACC,
  accDown: 300,
  ce: ACTINIC_CE,
  ve: ACTINIC_VE,
  hp: 20,
  agi: 0,
  str: 0,
  dex: 0,
  chr: 2,
  refreshTrait: 4,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 0,
  mnd: 0,
  vit: 0,
  family: "Ghrah",
  learnSkill: blueLearnSkill(74),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Plasma Charge. Shock Spikes on yourself.
 * Level 75, 24 MP, 5 points, cast 3s, recast 60s.
 * The duration is listed as over 12 minutes. This yard keeps 12 minutes
 * and does not add an unpublished remainder. Classic 60 seconds is the
 * old card.
 * Damage is the Shock Spikes formula. INT is read at the cast. Magic
 * Attack Bonus is read when the hit connects. The stun rate is not
 * published, so a proc is not rolled.
 * It overwrites Shock Spikes, Ice Spikes, Blaze Spikes, and Reprisal,
 * and Shock Spikes overwrites it. They are the same status.
 * Cumulative enmity 1, volatile 480. A spell on yourself does not claim.
 * Set bonus STR +3 and DEX +3. Auto Refresh trait points 4.
 * Diffusion would share it. Diffusion is a locked merit, so it stays on you.
 * Learned from Phuabo at Blue Magic 245+. Granted until a Phuabo is in the yard.
 */
export const PLASMA_SECONDS = 12 * 60;
export const PLASMA_CE = 1;
export const PLASMA_VE = 480;

export const PLASMA_CHARGE = {
  kind: "spikes",
  name: "Plasma Charge",
  level: 75,
  mp: 24,
  points: 5,
  cast: 3,
  recast: 60,
  seconds: PLASMA_SECONDS,
  ce: PLASMA_CE,
  ve: PLASMA_VE,
  hp: 0,
  agi: 0,
  str: 3,
  dex: 3,
  chr: 0,
  refreshTrait: 4,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 0,
  mnd: 0,
  vit: 0,
  family: "Phuabo",
  learnSkill: blueLearnSkill(75),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Chaotic Eye. Gaze Silence, wind.
 * Level 32, 13 MP, 2 points, cast 3s, recast 10s.
 * Roughly the enfeebling spell Silence. This yard uses that spell's
 * 120 seconds, and a partial resist halves it. BG lists 5 to 120
 * seconds. A 5-second floor is not added.
 * The target must be facing you. You do not need to face the target.
 * It does not overwrite Silence. Silence overwrites it.
 * The magic accuracy bonus is not printed, so none is added. Blue Magic
 * skill and dMND are rolled. The element is wind.
 * The range box is blank. This yard uses 21', the range Silence uses here.
 * Cumulative enmity 1, volatile 320. It claims when the gaze connects.
 * Set bonus AGI +1. Conserve MP trait points 4.
 * It deals no damage, so Burst Affinity is not spent.
 * Learned from Coeurl at Blue Magic 68+. Granted until a Coeurl is in the yard.
 */
export const CHAOTIC_RANGE = 21;
export const CHAOTIC_CE = 1;
export const CHAOTIC_VE = 320;

export const CHAOTIC_EYE = {
  kind: "silence",
  name: "Chaotic Eye",
  level: 32,
  mp: 13,
  points: 2,
  cast: 3,
  recast: 10,
  range: CHAOTIC_RANGE,
  seconds: 120,
  ce: CHAOTIC_CE,
  ve: CHAOTIC_VE,
  hp: 0,
  agi: 1,
  str: 0,
  dex: 0,
  chr: 0,
  refreshTrait: 0,
  conserveTrait: 4,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 0,
  mnd: 0,
  vit: 0,
  family: "Coeurl",
  learnSkill: blueLearnSkill(32),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Sound Blast. Fire INT Down around you. It does not deal damage.
 * Level 32, 25 MP, 1 point, cast 4s, recast 30s.
 * INT Down 9 for 30 seconds. The potency does not tick. A half resist
 * shortens the 30. A full resist, and a quarter resist, do not land.
 * The script's resist threshold is 0.5, so a half resist still lands.
 * It refreshes its own INT Down. No stronger INT Down is in the yard.
 * Magic accuracy is Blue Magic skill plus dINT. The element is fire.
 * The script can tag a magic-burst message on Liquefaction, Fusion, or
 * Light. There is no damage, so Burst Affinity is not spent and no
 * burst multiplier is applied.
 * The card's range is 6', centered on you. The client stores spell
 * range 50 and radius 50, the same columns Sheep Song uses for 6'.
 * This yard uses 6'.
 * Cumulative enmity 1, volatile 320, when the hare is in the area,
 * including a resist. A land or a resist in range claims.
 * No stat bonus. Magic Attack Bonus is 4 trait points and 1 set point.
 * With Cursed Sphere, or with Memento Mori, the trait is +20. Alone it is not.
 * It breaks Mazurka. Chain Affinity is not spent.
 * Learned from Cockatrice at Blue Magic 68+. Granted until a Cockatrice is in the yard.
 */
export const SOUND_RADIUS = 6;
export const SOUND_SECONDS = 30;
export const SOUND_INT = 9;
export const SOUND_CE = 1;
export const SOUND_VE = 320;

export const SOUND_BLAST = {
  kind: "sound",
  name: "Sound Blast",
  level: 32,
  mp: 25,
  points: 1,
  cast: 4,
  recast: 30,
  radius: SOUND_RADIUS,
  seconds: SOUND_SECONDS,
  intDown: SOUND_INT,
  ce: SOUND_CE,
  ve: SOUND_VE,
  hp: 0,
  agi: 0,
  str: 0,
  dex: 0,
  chr: 0,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 0,
  mnd: 0,
  vit: 0,
  mabTrait: 4,
  family: "Cockatrice",
  learnSkill: blueLearnSkill(32),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Death Ray. One dark hit.
 * Level 34, 49 MP, 2 points, cast 4.5s.
 * The card prints recast 30. The script header and the spell list
 * store 29.25. This yard uses 29.25.
 * The range box is blank. The client stores 120 where Wild Carrot
 * stores 200, and this yard treats that 200 as 20', so this spell uses 12'.
 * The base is level + 2, capped at 51. At 75 that term is 51.
 * The stat term is (20% of INT + 10% of MND) times the level alpha.
 * Those percents are not floored before the alpha. Burst Affinity
 * doubles that term and is spent, even on a miss or when the target
 * is out of range. Azure Lore adds 2 to the coefficient 1.625, so
 * the coefficient becomes 3.625. It does not replace 1.625, it does
 * not open a magic burst, and it is not consumed.
 * dINT is multiplied by 1. Anything above 77 counts for half, and the
 * term cannot fall under −30.
 * Dark matches Compression, Gravitation, Darkness, and Umbra.
 * No additional status. Set bonus HP −5 and MP +5. The script says
 * Combos: None.
 * The enmity box is blank. The cast claims, and the damage adds its
 * own enmity. It breaks Mazurka.
 * Learned from Hecteyes at Blue Magic 74+. Granted until a Hecteyes is in the yard.
 */
export const DEATH_RAY_RANGE = 12;
export const DEATH_RAY_FTP = 1.625;
export const DEATH_RAY_AZURE = 2;

export const DEATH_RAY = {
  kind: "ray",
  name: "Death Ray",
  level: 34,
  mp: 49,
  points: 2,
  cast: 4.5,
  recast: 29.25,
  range: DEATH_RAY_RANGE,
  ftp: DEATH_RAY_FTP,
  azureFtp: DEATH_RAY_AZURE,
  intMod: 0.2,
  mndMod: 0.1,
  dStat: 1,
  dCap: 51,
  half: 77,
  low: -30,
  hp: -5,
  agi: 0,
  str: 0,
  dex: 0,
  chr: 0,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 0,
  mnd: 0,
  vit: 0,
  setMp: 5,
  family: "Hecteyes",
  learnSkill: blueLearnSkill(34),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Smite of Rage. One slashing hit.
 * Level 34, 28 MP, 3 points, cast 0.5s, recast 13s, range 4.5'.
 * The client stores spell range 30, which this yard would read as 3'.
 * Horizon also prints 3. The card prints 4.5', the same range Foot Kick
 * keeps when the client disagrees, so this yard uses 4.5'.
 * The weapon-skill coefficient stays 1.5 until Chain Affinity or Azure
 * Lore is up. Chain Affinity walks 1.5 at 0 TP, 2.25 at 1500, and 2.5
 * at 3000. Azure Lore replaces it with 2.53125. Raw TP does not walk it.
 * Azure Lore does not force a critical hit. The script sets no crit chance.
 * Attack is ×1.3 at every tier. Chain Affinity does not walk the attack.
 * Horizon's note that this spell skips the shared fSTR cap is not used.
 * The script sets no special fSTR flag, and this yard uses one blue fSTR.
 * The skill term stops at 35. At 276 the uncapped term is 63, so the cap binds.
 * The stat term is 20% of STR and 20% of DEX.
 * Skillchain is Detonation, and only under Chain Affinity, and only on a hit.
 * No additional status. The enmity box is blank.
 * Set bonus AGI +3. Undead Killer is 4 trait points and 3 set points.
 * With Bludgeon the trait is +8%. Alone it is not. The Tropical Rarab
 * is not undead, so the bonus is not rolled.
 * It breaks Mazurka. Burst Affinity is not spent.
 * Learned from Evil Weapon at Blue Magic 74+. Granted until an Evil Weapon is in the yard.
 */
export const SMITE_FTP = [1.5, 2.25, 2.5] as const;
export const SMITE_FTP_AZURE = 2.53125;
export const SMITE_MULT = 1.3;

export const SMITE_OF_RAGE = {
  kind: "physical",
  name: "Smite of Rage",
  level: 34,
  mp: 28,
  points: 3,
  cast: 0.5,
  recast: 13,
  range: 4.5,
  hits: 1,
  ftp: SMITE_FTP[0],
  dCap: 35,
  strMod: 0.2,
  dexMod: 0.2,
  hp: 0,
  agi: 3,
  str: 0,
  dex: 0,
  chr: 0,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 0,
  mnd: 0,
  vit: 0,
  undeadTrait: 4,
  chain: "Detonation",
  family: "Evil Weapon",
  learnSkill: blueLearnSkill(34),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Digest. Dark HP drain. Not the black-magic Drain spell.
 * Level 36, 20 MP, 2 points, cast 4s.
 * The script header and the card say recast 90. The spell list stores
 * 26000 and Windower says 26. This yard uses 90, the same way Soporific
 * kept the card over the list's 26.
 * The range box is blank. The client stores 30. This yard reads that
 * column the way it reads Wild Carrot's 200, so the range is 3'.
 * Damage is floor(floor(Blue Magic skill × 0.11) × 5). At 276 that is
 * floor(30.36) × 5 = 150. The page's skill × 0.55 is the unfloored form
 * and is not used. There is no stat term and no damage cap.
 * INT does not add magic accuracy. Magic accuracy is Blue Magic skill
 * alone. The element is dark. Ecosystem correlation is not in the hit.
 * Undead take nothing. The Tropical Rarab is a beast, so the drain works.
 * Resist, then a magic burst, then Magic Attack Bonus. Burst Affinity
 * opens a dark magic burst and does not double a stat term. It is spent
 * even on a miss, when the target is out of range, and on the undead
 * no-effect. Azure Lore does not open the window and is not consumed.
 * The caster heals the HP that lands, clamped to the target's current
 * HP and then to the caster's missing HP.
 * Cumulative enmity 320, volatile 0, when the hare is in range, alive,
 * and not a pet, including a resist and the undead no-effect.
 * Set bonus HP −5 and MP +5. The script says Combos: None.
 * It breaks Mazurka.
 * Learned from Slime at Blue Magic 80+. Granted until a Slime is in the yard.
 */
export const DIGEST_RANGE = 3;
export const DIGEST_CE = 320;
export const DIGEST_VE = 0;

export const DIGEST = {
  kind: "digest",
  name: "Digest",
  level: 36,
  mp: 20,
  points: 2,
  cast: 4,
  recast: 90,
  range: DIGEST_RANGE,
  dmgMult: 5,
  ce: DIGEST_CE,
  ve: DIGEST_VE,
  hp: -5,
  agi: 0,
  str: 0,
  dex: 0,
  chr: 0,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 0,
  mnd: 0,
  vit: 0,
  setMp: 5,
  family: "Slime",
  learnSkill: blueLearnSkill(36),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Pinecone Bomb. One piercing ranged hit. Additional effect: Sleep.
 * Level 36, 48 MP, 2 points, cast 2.5s.
 * The script header, the spell list, and Gamer Escape say recast 26.5.
 * The card says 26. This yard uses 26.5.
 * The card's range is 21.5'. Gamer Escape and Horizon print 23.5'.
 * The client stores 200, which this yard would read as 20'. The card
 * wins over the client, the same way Queasyshroom keeps its card, so
 * this yard uses 21.5'.
 * One hit. The weapon-skill coefficient is 2.25 at every tier, including
 * Azure Lore. The skill term stops at 37. At 276 the uncapped term is 63,
 * so the cap binds. The stat term is 20% of STR and 20% of AGI.
 * Attack stays ×1. The script does not set an attack multiplier.
 * It is a ranged attack. This yard has no Blue Mage ranged skill, so the
 * hit uses melee accuracy and melee attack.
 * Sleep only if a hit lands. The script's base is 90 seconds, not the
 * card's 10–60. Azure Lore is 240. Chain Affinity walks 90 at 0 TP,
 * 150 at 1500, and 210 at 3000. The script marks the 3000 and Azure
 * anchors as needing verification. They are the numbers used. Without
 * Chain Affinity or Azure Lore the duration stays 90, even though the
 * card says it varies with TP.
 * A quarter resist does not sleep. A half resist halves the duration.
 * The damage type is piercing, which is not an element, so the resist
 * roll has no element. The page calls the sleep dark. The script does not.
 * Damage lands first and wakes Sleep, Sleep II, Sheep Song, Soporific,
 * and Lullaby. The new Sleep is applied after that wake, so it can
 * overwrite any of them, including its own.
 * A connecting hit interrupts a spell the hare has started. It does not
 * knock the hare back. A miss does not sleep and does not interrupt.
 * Skillchain is Liquefaction, and only under Chain Affinity, and only on a hit.
 * The enmity box is blank. Set bonus STR +1. The script says Combos: None.
 * It breaks Mazurka. Burst Affinity is not spent.
 * Learned from Treant at Blue Magic 80+. Granted until a Treant is in the yard.
 */
export const PINECONE_RANGE = 21.5;
export const PINECONE_SECONDS = 90;
export const PINECONE_AZURE = 240;

export const PINECONE_BOMB = {
  kind: "physical",
  name: "Pinecone Bomb",
  level: 36,
  mp: 48,
  points: 2,
  cast: 2.5,
  recast: 26.5,
  range: PINECONE_RANGE,
  hits: 1,
  ftp: 2.25,
  dCap: 37,
  strMod: 0.2,
  dexMod: 0,
  agiMod: 0.2,
  ranged: true,
  hp: 0,
  agi: 0,
  str: 1,
  dex: 0,
  chr: 0,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 0,
  mnd: 0,
  vit: 0,
  chain: "Liquefaction",
  family: "Treant",
  learnSkill: blueLearnSkill(36),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki MP Drainkiss. Steals MP. Not the dark-magic Aspir spell.
 * Level 42, 20 MP, 4 points, cast 4s.
 * The script header and the spell list both recast in 90 seconds.
 * The Final Fantasy Wiki's 26 is not used.
 * The range box is blank. The client stores 30, the same column Digest
 * uses, so this yard uses 3'.
 * Damage is floor(floor(Blue Magic skill × 0.11) × 3.5), then clamped
 * to 165, before a resist. At 276 that is 105, so the cap does not bind.
 * There is no stat term. INT adds magic accuracy and does not add damage.
 * The element is dark. Ecosystem correlation is not in the hit.
 * Undead take nothing. The Tropical Rarab is a beast with 0 MP, so a
 * land steals nothing. The amount is still clamped to the target's MP
 * and then to the caster's missing MP.
 * Resist, then a magic burst, then Magic Attack Bonus. The page says
 * Magic Attack Bonus does not enhance this spell, unlike Magic Hammer.
 * The shared drain helper applies the magic-bonus difference, and Digest
 * already follows that helper, so this yard does too.
 * Burst Affinity opens a dark magic burst and does not double a stat term.
 * It is spent even on a miss, when the target is out of range, and on the
 * undead no-effect. Azure Lore does not open the window and is not consumed.
 * Current LandSandBoat can open a burst from Azure Lore on magical blue
 * spells. This yard does not, the same way Death Ray stays closed.
 * Cumulative enmity 320, volatile 0, when the hare is in range, alive,
 * and not a pet, including a resist and the undead no-effect.
 * Set bonus MP +5. The script says Combos: None.
 * It breaks Mazurka.
 * Learned from Leech at Blue Magic 98+. Granted until a Leech is in the yard.
 */
export const KISS_RANGE = 3;
export const KISS_CAP = 165;
export const KISS_CE = 320;
export const KISS_VE = 0;

export const MP_DRAINKISS = {
  kind: "kiss",
  name: "MP Drainkiss",
  level: 42,
  mp: 20,
  points: 4,
  cast: 4,
  recast: 90,
  range: KISS_RANGE,
  dmgMult: 3.5,
  cap: KISS_CAP,
  ce: KISS_CE,
  ve: KISS_VE,
  hp: 0,
  agi: 0,
  str: 0,
  dex: 0,
  chr: 0,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 0,
  mnd: 0,
  vit: 0,
  setMp: 5,
  family: "Leech",
  learnSkill: blueLearnSkill(42),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Blitzstrahl. One lightning hit. Additional effect: Stun.
 * Level 44, 70 MP, 4 points, cast 4.5s, recast 29.25s.
 * The card prints range 13. The client stores 120, the same column
 * Death Ray uses for 12'. This yard uses 12'.
 * The base is level + 2, capped at 61. At 75 that term is 61.
 * The stat term is (30% of INT + 10% of MND) times the level alpha.
 * Those percents are not floored before the alpha. Burst Affinity
 * doubles that term and is spent, even on a miss or when the target
 * is out of range. The script sets no Azure bonus, so Azure Lore
 * leaves the coefficient at 1.5625. It does not open a magic burst
 * and is not consumed.
 * dINT is multiplied by 1. The script does not set a half cap or a
 * floor, so the defaults apply: anything above 999 counts for half,
 * and the term cannot fall under −399.
 * Lightning matches Impaction, Fragmentation, Light, and Radiance.
 * Stun is attempted only when the hit deals damage. The script's
 * duration is 5 seconds. A quarter resist does not stun. A half
 * resist shortens the 5. The element of that second roll is thunder,
 * and the stat is INT. It refreshes a Stun already up.
 * Set bonus DEX +3. The script says Combos: None.
 * The enmity box is blank. The cast claims, and the damage adds its
 * own enmity. A connecting hit interrupts a spell the hare has started.
 * It breaks Mazurka.
 * Learned from Doll at Blue Magic 104+. Granted until a Doll is in the yard.
 */
export const BLITZ_RANGE = 12;
export const BLITZ_FTP = 1.5625;
export const BLITZ_STUN = 5;
export const BLITZ_HALF = 999;
export const BLITZ_LOW = -399;

export const BLITZSTRAHL = {
  kind: "blitz",
  name: "Blitzstrahl",
  level: 44,
  mp: 70,
  points: 4,
  cast: 4.5,
  recast: 29.25,
  range: BLITZ_RANGE,
  ftp: BLITZ_FTP,
  intMod: 0.3,
  mndMod: 0.1,
  dStat: 1,
  dCap: 61,
  half: BLITZ_HALF,
  low: BLITZ_LOW,
  stun: BLITZ_STUN,
  hp: 0,
  agi: 0,
  str: 0,
  dex: 3,
  chr: 0,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 0,
  mnd: 0,
  vit: 0,
  family: "Doll",
  learnSkill: blueLearnSkill(44),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Stinking Gas. Wind VIT Down on enemies around you.
 * Level 44, 37 MP, 2 points, cast 4s, recast 60s, range 6'.
 * The area is centered on you. The client stores 50 and 50, the same
 * columns Sheep Song uses for 6'. The card prints 6'.
 * It does not deal damage. An unresisted land is VIT −10 for 60 seconds.
 * The potency does not tick. Wild Oats is the same status and does tick,
 * so this spell overwrites that decay, and Wild Oats overwrites this one.
 * A half resist shortens the 60. A full resist, and a quarter resist,
 * do not land. The script's resist threshold is 0.5, so a half resist
 * still lands. It refreshes its own VIT Down.
 * Magic accuracy is Blue Magic skill plus dINT. The element is wind.
 * The script can tag a magic-burst message on Detonation, Fragmentation,
 * or Light. There is no damage, so Burst Affinity is not spent.
 * Cumulative enmity 320, volatile 320, when the hare is in the area,
 * including a resist. A land or a resist in range claims.
 * Set bonus AGI +1. Auto Refresh is 1 trait point and 2 set points.
 * The trait needs 8 trait points and 8 set points. With Actinic Burst
 * that is 5 trait points and 6 set points. With Plasma Charge that is
 * 5 trait points and 7 set points. Neither pair grants it. Actinic Burst
 * with Plasma Charge already does, and adding this spell does not raise
 * the tier.
 * It breaks Mazurka. Chain Affinity is not spent.
 * Learned from Doomed at Blue Magic 104+. Granted until a Doomed is in the yard.
 */
export const STINK_RADIUS = 6;
export const STINK_SECONDS = 60;
export const STINK_VIT = 10;
export const STINK_CE = 320;
export const STINK_VE = 320;

export const STINKING_GAS = {
  kind: "gas",
  name: "Stinking Gas",
  level: 44,
  mp: 37,
  points: 2,
  cast: 4,
  recast: 60,
  radius: STINK_RADIUS,
  seconds: STINK_SECONDS,
  vitDown: STINK_VIT,
  ce: STINK_CE,
  ve: STINK_VE,
  hp: 0,
  agi: 1,
  str: 0,
  dex: 0,
  chr: 0,
  refreshTrait: 1,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 0,
  mnd: 0,
  vit: 0,
  family: "Doomed",
  learnSkill: blueLearnSkill(44),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Mandibular Bite. One slashing hit. Damage varies with TP.
 * Level 44, 38 MP, 2 points, cast 0.5s, recast 19.25s.
 * The range box is blank. The client stores 30. Foot Kick's card
 * overrides that same 30 with 4.5'. This card prints nothing, so this
 * yard reads the column as 3', the same way Digest does.
 * The weapon-skill coefficient stays 2 at every tier, including Chain
 * Affinity and Azure Lore. The card's TP clause is the attack, not the
 * coefficient. Attack is ×1.75 until one of those is up. Chain Affinity
 * walks 1.75 at 0 TP, 2.1 at 1500, and 2.5 at 3000. Azure Lore sets it
 * to 2.65 and wins over Chain Affinity. Raw TP does not walk the attack.
 * Azure Lore does not force a critical hit. The script sets no crit chance.
 * The skill term stops at 45. At 276 the uncapped term is 63, so the cap binds.
 * The stat term is 20% of STR and 20% of INT.
 * Skillchain is Induration, and only under Chain Affinity, and only on a hit.
 * No additional status. The enmity box is blank.
 * Set bonus INT +1. Plantoid Killer is 4 trait points and 2 set points.
 * With Power Attack the trait is +8%. Alone it is not. The Tropical Rarab
 * is not a plantoid, so the bonus is not rolled.
 * It breaks Mazurka. Burst Affinity is not spent.
 * Learned from Antlion at Blue Magic 104+. Granted until an Antlion is in the yard.
 */
export const BITE_RANGE = 3;
export const BITE_FTP = 2;
export const BITE_ATTACK = [1.75, 2.1, 2.5] as const;
export const BITE_ATTACK_AZURE = 2.65;

export const MANDIBULAR_BITE = {
  kind: "physical",
  name: "Mandibular Bite",
  level: 44,
  mp: 38,
  points: 2,
  cast: 0.5,
  recast: 19.25,
  range: BITE_RANGE,
  hits: 1,
  ftp: BITE_FTP,
  dCap: 45,
  strMod: 0.2,
  dexMod: 0,
  intMod: 0.2,
  hp: 0,
  agi: 0,
  str: 0,
  dex: 0,
  chr: 0,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 1,
  mnd: 0,
  vit: 0,
  plantTrait: 4,
  chain: "Induration",
  family: "Antlion",
  learnSkill: blueLearnSkill(44),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Magnetite Cloud. Earth breath in a fan in front of you.
 * Additional effect: Weight.
 * Level 46, 86 MP, 3 points, cast 4.5s, recast 29.25s.
 * The range box is blank. The client stores 120 and 50, the same
 * columns Poison Breath uses, so this yard uses that spell's 10' fan
 * and 45° each side of where you are facing. The page's type line says
 * Breath. The script's attack type is breath.
 * The page multiplies (HP / 6) by (level / 1.875). The script adds them.
 * This yard adds them, the same way Poison Breath adds its two terms.
 * A level 75 Blue Mage at 1046 HP is 1046 / 6 + 75 / 1.875 before a resist.
 * Magic Attack Bonus is not applied. Day, weather, staff, affinity, and
 * breath damage dealt are not applied. Beastmen would take 25% more.
 * The Tropical Rarab is not Beastmen, so that bonus is not rolled.
 * Burst Affinity can magic burst it. Earth matches Scission, Gravitation,
 * Darkness, and Umbra. Azure Lore does not open the window and does not
 * change the breath. Burst Affinity is spent even on a miss or when the
 * target is outside the fan.
 * Weight is attempted only when the breath deals damage. The script's
 * power is 25 and the duration is 60. The page's 30–120 and about −26%
 * are not used. A quarter resist does not weigh the target down. A half
 * resist shortens the 60. The second roll has no attribute, because a
 * breath additional effect sets the stat to 0. The element is earth.
 * It lands as Gravity and refreshes Gravity, including Mysterious Light's
 * Weight and the black-magic Gravity spell.
 * Set bonus VIT +2. Magic Defense Bonus is 4 trait points and 3 set points.
 * The trait needs 8 trait points and 6 set points, and tier I is level 50.
 * Ice Break is the other half. This spell alone does not grant it.
 * The enmity box is blank. A hare in the fan is claimed. A connecting hit
 * gives the hare 100 TP. It breaks Mazurka.
 * Learned from Antica at Blue Magic 110+. Granted until an Antica is in the yard.
 */
export const CLOUD_RANGE = 10;
export const CLOUD_WEIGHT = 25;
export const CLOUD_WEIGHT_SECONDS = 60;

export const MAGNETITE_CLOUD = {
  kind: "breath",
  name: "Magnetite Cloud",
  level: 46,
  mp: 86,
  points: 3,
  cast: 4.5,
  recast: 29.25,
  range: CLOUD_RANGE,
  hpMod: 6,
  lvlMod: 1.875,
  weight: CLOUD_WEIGHT,
  weightSeconds: CLOUD_WEIGHT_SECONDS,
  element: "earth",
  hp: 0,
  agi: 0,
  str: 0,
  dex: 0,
  chr: 0,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 0,
  mnd: 0,
  vit: 2,
  mdbTrait: 4,
  family: "Antica",
  learnSkill: blueLearnSkill(46),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Zephyr Mantle. Blink on yourself, wind.
 * Level 65, 31 MP, 2 points, cast 7s, recast 60s.
 * Four shadow images for 5 minutes. They are Blink, not Utsusemi.
 * This yard's Blink removes a shadow on a connecting auto or Foot Kick.
 * The separate retail chance to ignore a shadow is not rolled, because
 * Blink here is not rolled that way.
 * It does not overwrite Utsusemi, Blink, or Aerial Armor. Those overwrite it.
 * Cumulative enmity 320, volatile 320. A spell on yourself does not claim.
 * Set bonus AGI +2. Conserve MP trait points 4.
 * Diffusion would share it. Diffusion is a locked merit, so it stays on you.
 * The duration is not passed through Enhancing Magic. The card prints 5 minutes.
 * Learned from Puk at Blue Magic 196+. Granted until a Puk is in the yard.
 */
export const ZEPHYR_SECONDS = 5 * 60;
export const ZEPHYR_SHADOWS = 4;
export const ZEPHYR_CE = 320;
export const ZEPHYR_VE = 320;

export const ZEPHYR_MANTLE = {
  kind: "mantle",
  name: "Zephyr Mantle",
  level: 65,
  mp: 31,
  points: 2,
  cast: 7,
  recast: 60,
  seconds: ZEPHYR_SECONDS,
  shadows: ZEPHYR_SHADOWS,
  ce: ZEPHYR_CE,
  ve: ZEPHYR_VE,
  hp: 0,
  agi: 2,
  str: 0,
  dex: 0,
  chr: 0,
  refreshTrait: 0,
  conserveTrait: 4,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 0,
  mnd: 0,
  vit: 0,
  family: "Puk",
  learnSkill: blueLearnSkill(65),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Healing Breeze. Restores HP for party members around you.
 * Level 16, 55 MP, 4 points, cast 4.5s, recast 15s, range 10'.
 * Power is the Wild Carrot power: 3×MND + VIT + 3×floor(Healing Magic ÷ 5).
 * The heal table is the Curaga table that stops at 180. The first band
 * that the power is under is the one used. A result under that band's
 * floor is raised to the floor. A result over that band's ceiling is cut.
 * The last band's ceiling is 180. Day, weather, and cure potency are not
 * applied. Divine Seal doubles afterwards.
 * It does not damage undead. The enmity box is blank, so the only enmity
 * is the cure enmity of the HP that actually landed.
 * Set bonus CHR +2 and HP +10. Auto Regen trait points 4.
 * Diffusion would share it farther. Diffusion is a locked merit, so the
 * area stays 10'. It does not break Mazurka. Burst Affinity is not spent.
 * Learned from Dhalmel at Blue Magic 20+. Granted until a Dhalmel is in the yard.
 */
export const BREEZE_RADIUS = 10;

export const HEALING_BREEZE = {
  kind: "breeze",
  name: "Healing Breeze",
  level: 16,
  mp: 55,
  points: 4,
  cast: 4.5,
  recast: 15,
  radius: BREEZE_RADIUS,
  hp: 10,
  agi: 0,
  str: 0,
  dex: 0,
  chr: 2,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 4,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 0,
  mnd: 0,
  vit: 0,
  family: "Dhalmel",
  learnSkill: blueLearnSkill(16),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Sheep Song. Light sleep on enemies around you.
 * Level 16, 22 MP, 2 points, cast 3s, recast 60s, range 6'.
 * The card prints 40 to 60 seconds. An unresisted land is a whole
 * second in that span. A partial resist halves it. A full resist
 * does not land. A 5-second floor is not added.
 * It refreshes its own Sheep Song. It does not overwrite Lullaby,
 * and Lullaby does not overwrite it. Sleep, Sleep II, Sleepga,
 * Sleepga II, and Repose overwrite it. It does not overwrite those.
 * Magic accuracy is unpublished, so none is added. Blue Magic skill
 * and dMND are rolled. The element is light.
 * Cumulative enmity 320, volatile 320. That is added when the Tropical
 * Rarab is inside the area, including a resist and a sleep that is
 * already up. A target outside the area, dead, or charmed adds none.
 * A land claims. Damage and a heal wake it.
 * Set bonus CHR +1 and HP +5. Auto Regen trait points 4.
 * It deals no damage, so Burst Affinity is not spent. It breaks Mazurka.
 * Learned from Sheep at Blue Magic 20+. Granted until a Sheep is in the yard.
 */
export const SHEEP_RADIUS = 6;
export const SHEEP_LOW = 40;
export const SHEEP_HIGH = 60;
export const SHEEP_CE = 320;
export const SHEEP_VE = 320;

export const SHEEP_SONG = {
  kind: "song",
  name: "Sheep Song",
  level: 16,
  mp: 22,
  points: 2,
  cast: 3,
  recast: 60,
  radius: SHEEP_RADIUS,
  ce: SHEEP_CE,
  ve: SHEEP_VE,
  hp: 5,
  agi: 0,
  str: 0,
  dex: 0,
  chr: 1,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 4,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 0,
  mnd: 0,
  vit: 0,
  family: "Sheep",
  learnSkill: blueLearnSkill(16),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Battle Dance. Area slash, centered on you.
 * Level 12, 12 MP, 3 points, cast 1s, recast 10s.
 * One hit. The weapon-skill coefficient is 2.0 at every TP tier.
 * The stat term is 30% of STR. The skill term stops at 17.
 * Additional effect DEX Down 9, only if the hit lands. There is no
 * separate resist roll. The duration is 90 seconds. Chain Affinity
 * scales it from 90 at 0 TP through 480 at 1500 TP to 680 at 3000 TP.
 * Azure Lore uses that 3000 TP anchor, 680 seconds. The script's
 * unverified 800 is not used. Without Chain Affinity or Azure Lore
 * the duration stays 90, even though the card says it varies with TP.
 * The range box is blank. This yard uses 10', the same house rule as
 * Actinic Burst. The check is at the land, not at the start of the cast.
 * A target outside that area, dead, or charmed takes nothing and is
 * not claimed. Chain Affinity is still spent if nobody is there.
 * The skillchain is Impaction, and only a connecting hit opens it.
 * The script can remove 1, 2, or 3 shadows. The hare has none, so
 * that removal is not rolled. It does not strip the caster's shadows.
 * The enmity box is blank. A connecting cast claims, and the damage
 * adds its own enmity. No fixed hate is invented.
 * Set bonus DEX +2. Attack Bonus trait points 4.
 * It breaks Mazurka. Burst Affinity is not spent.
 * Learned from Orc at Blue Magic 8+. Granted until an Orc is in the yard.
 */
export const BATTLE_RADIUS = 10;
export const BATTLE_DEX = 9;
export const BATTLE_SECONDS = 90;

export const BATTLE_DANCE = {
  kind: "physical",
  name: "Battle Dance",
  level: 12,
  mp: 12,
  points: 3,
  cast: 1,
  recast: 10,
  radius: BATTLE_RADIUS,
  hits: 1,
  ftp: 2,
  dCap: 17,
  strMod: 0.3,
  dexMod: 0,
  hp: 0,
  agi: 0,
  str: 0,
  dex: 2,
  chr: 0,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 4,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 0,
  mnd: 0,
  vit: 0,
  chain: "Impaction",
  family: "Orc",
  learnSkill: blueLearnSkill(12),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Uppercut. One blunt hit.
 * Level 38, 31 MP, 3 points, cast 0.5s, recast 17s, range 4.5'.
 * The printed recast on the current card is 17. The script header's
 * 17.75 is the older number and is not used.
 * The weapon-skill coefficient is 1.5 at every TP tier. "Damage varies
 * with TP" is the attack multiplier, not that coefficient.
 * Attack is 1.6× even at 0 TP. Chain Affinity scales it from 1.6 at
 * 0 TP through 2.0 at 1500 TP to 2.3 at 3000 TP, and still doubles the
 * stat term, forces the critical hit, and spends all TP. Azure Lore
 * sets the multiplier to 2.4 and does not itself double the stat term
 * or force a critical hit. It is not consumed.
 * The stat term is 35% of STR. The skill term stops at 39.
 * The monster version knocks back. The player spell does not.
 * No additional status.
 * Skillchain is Liquefaction, then Impaction. A miss does not open it.
 * Chain Affinity is spent on the cast, including a miss.
 * The enmity box is blank. The cast claims, and the damage adds its
 * own enmity. No fixed hate is invented.
 * Set bonus STR +2 and DEX +1. Attack Bonus trait points 4.
 * It breaks Mazurka. Burst Affinity is not spent.
 * Learned from Goobbue at Blue Magic 86+. Granted until a Goobbue is in the yard.
 */
export const UPPERCUT = {
  kind: "physical",
  name: "Uppercut",
  level: 38,
  mp: 31,
  points: 3,
  cast: 0.5,
  recast: 17,
  range: 4.5,
  hits: 1,
  ftp: 1.5,
  dCap: 39,
  strMod: 0.35,
  dexMod: 0,
  hp: 0,
  agi: 0,
  str: 2,
  dex: 1,
  chr: 0,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 4,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 0,
  mnd: 0,
  vit: 0,
  chain: "Liquefaction",
  chain2: "Impaction",
  family: "Goobbue",
  learnSkill: blueLearnSkill(38),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Refueling. Haste on yourself. Wind.
 * Level 48, 29 MP, 4 points, cast 1.5s, recast 30s, duration 5 minutes.
 * The haste is 10%. White Haste is 14.65%. 1000 on the 10000 scale is
 * round(1000 / 10000 × 1024) = 102. That 102 is stored on the Haste
 * status, so delay and recast already read it. The magic haste cap
 * stays 448. March is a different status and still adds.
 * It does not overwrite Haste or Hastega. Those overwrite it, whatever
 * the potency. Casting it again refreshes the 5 minutes. A Haste whose
 * source was not stored is treated as one of the stronger ones.
 * BG-Wiki says it is overwritten by, and does not overwrite, any other
 * haste or slow, except the slow from a Pugil's Intimidate, a Crawler's
 * Sticky Thread, and a Skeleton's Horror Cloud. None of those slows
 * are on you. Slow, Slowga, and Spider Web are not on you either.
 * It shortens melee delay and spell recast. It does not shorten cast
 * time. Archery and Marksmanship delay are not shortened.
 * The client row matches Zephyr Mantle: valid targets 1, area 6, range 0.
 * Diffusion would share it. Diffusion is a locked merit, so it stays
 * on you. The duration is not passed through Enhancing Magic.
 * Cumulative enmity 1, volatile 300. A spell on yourself does not claim.
 * Set bonus AGI +2. The script says Combos: None, so it grants no trait.
 * It does not break Mazurka. Chain Affinity and Burst Affinity are
 * not spent.
 * Learned from Cluster at Blue Magic 116+. Granted until a Cluster is
 * in the yard.
 */
export const REFUEL_SECONDS = 5 * 60;
/** 10% haste. hasteFromPercent(1000). */
export const REFUEL_HASTE = 102;
export const REFUEL_CE = 1;
export const REFUEL_VE = 300;

export const REFUELING = {
  kind: "refuel",
  name: "Refueling",
  level: 48,
  mp: 29,
  points: 4,
  cast: 1.5,
  recast: 30,
  seconds: REFUEL_SECONDS,
  haste: REFUEL_HASTE,
  ce: REFUEL_CE,
  ve: REFUEL_VE,
  hp: 0,
  agi: 2,
  str: 0,
  dex: 0,
  chr: 0,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 0,
  mnd: 0,
  vit: 0,
  family: "Cluster",
  learnSkill: blueLearnSkill(48),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Magic Fruit. Restores HP for one party member.
 * Level 58, 72 MP, 3 points, cast 3.5s, recast 6s, range 20'.
 * Roughly Cure IV. The power is the blue-cure power, not Cure IV's
 * single-target power. The bands are the Cure Formula row: rate 0.6666
 * and constant 130 until power reaches 320, then rate 1 and constant 210
 * until power reaches 560, then rate 2.833 and constant 391.2.
 * The floor is 250. The formula page says no maximum has been found for
 * blue magic, so the spell page's 550 and 610 are not a clamp.
 * Day, weather, and cure potency are not applied. Divine Seal doubles
 * afterwards. It does not damage undead. The enmity box is blank, so
 * the only enmity is the cure enmity of the HP that actually landed.
 * Set bonus CHR +1 and HP +5. Resist Sleep is 4 trait points and 3
 * set points. With Wild Carrot the trait is met. Burst Affinity is not
 * spent. Diffusion does not share it. Diffusion is a locked merit.
 * Learned from Opo-opo at Blue Magic 162+. Granted until an Opo-opo
 * is in the yard.
 */
export const MAGIC_FRUIT = {
  kind: "cure",
  name: "Magic Fruit",
  level: 58,
  mp: 72,
  points: 3,
  cast: 3.5,
  recast: 6,
  range: 20,
  hp: 5,
  agi: 0,
  str: 0,
  dex: 0,
  chr: 1,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 4,
  int: 0,
  mnd: 0,
  vit: 0,
  family: "Opo-opo",
  learnSkill: blueLearnSkill(58),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Memento Mori. Magic Attack Bonus on yourself.
 * Level 62, 46 MP, 4 points, cast 3.5s, recast 120s, duration 60s.
 * The bonus is +20. It does not scale with Blue Magic skill or INT.
 * Gamer Escape's 6-second cast and 30-second cap are stale. The script
 * header's 6-second cast is the same stale card. The current BG card
 * is 3.5 seconds and 120 seconds, and the script's base duration is 60.
 * The client row matches Zephyr Mantle: valid targets 1, area 6, range 0.
 * This yard casts it on you. Diffusion would share it. Diffusion is a
 * locked merit, so it stays on you. The duration is not passed through
 * Enhancing Magic. You are 75, so a lower-level penalty does not apply.
 * BG calls the element ice. There is no damage, so the element is not rolled.
 * Cumulative enmity 320, volatile 320. A spell on yourself does not claim.
 * Set bonus INT +1. Magic Attack Bonus is 4 trait points and 4 set points.
 * The trait needs 8 trait points and 3 set points, so this spell alone
 * does not grant it. Cursed Sphere and Sound Blast each complete it. The status still adds 20, and that 20 stacks with
 * a job trait or with gear. It does not break Mazurka. Chain Affinity
 * and Burst Affinity are not spent.
 * Learned from Corse at Blue Magic 181+. Granted until a Corse is in the yard.
 */
export const MEMENTO_SECONDS = 60;
export const MEMENTO_MAB = 20;
export const MEMENTO_CE = 320;
export const MEMENTO_VE = 320;

export const MEMENTO_MORI = {
  kind: "memento",
  name: "Memento Mori",
  level: 62,
  mp: 46,
  points: 4,
  cast: 3.5,
  recast: 120,
  seconds: MEMENTO_SECONDS,
  mab: MEMENTO_MAB,
  ce: MEMENTO_CE,
  ve: MEMENTO_VE,
  hp: 0,
  agi: 0,
  str: 0,
  dex: 0,
  chr: 0,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 1,
  mnd: 0,
  vit: 0,
  setMp: 0,
  mabTrait: 4,
  clearTrait: 0,
  family: "Corse",
  learnSkill: blueLearnSkill(62),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Frenetic Rip. Three blunt hits.
 * Level 63, 61 MP, 3 points, cast 0.5s, recast 28.5s.
 * The range box is blank. This yard uses 4.5', the same reach as Uppercut.
 * The stat term is 20% of STR and 20% of DEX. The skill term stops at 73.
 * At Blue Magic 276 the skill term is 63, so the cap does not bind.
 * Damage varies with TP through the weapon-skill coefficient: 1.359375
 * at 0 TP, 2.0703125 at 1500, and 2.359375 at 3000. Azure Lore uses the
 * 3500 anchor, 2.609375. Only the first hit uses that coefficient. The
 * second and third stay at 1. That later-hit coefficient is not printed.
 * The physical blue function uses 1, and that is what is rolled.
 * Without Chain Affinity or Azure Lore the coefficient stays 1.359375,
 * even though the card says damage varies with TP. Chain Affinity walks
 * the three anchors, doubles the stat term, forces the critical hit, and
 * spends all TP, including when every hit misses. Azure Lore does not
 * itself double the stat term or force a critical hit, and it is not consumed.
 * BG-Wiki says the spell possesses an attack bonus and does not print the
 * multiplier. The script leaves attack at 1. The unpublished bonus is not applied.
 * Each hit rolls accuracy on its own. A first-hit accuracy bonus is not
 * printed, so none is added. A miss on one hit does not cancel the others.
 * A connecting hit can open Induration, and it closes Reverberation into
 * Induration. A full miss does not skillchain. No additional status.
 * The monster version waits until an Imp's horn breaks. This spell does not
 * break a horn. The enmity box is blank. The cast claims, and the damage
 * adds its own enmity. Each connecting hit gives the target 100 TP.
 * Set bonus INT +1. Accuracy Bonus is 4 trait points and 3 set points.
 * It breaks Mazurka. Burst Affinity is not spent.
 * Learned from Imp at Blue Magic 186+. Granted until an Imp is in the yard.
 */
export const FRENETIC_FTP = [1.359375, 2.0703125, 2.359375] as const;
export const FRENETIC_FTP_AZURE = 2.609375;

export const FRENETIC_RIP = {
  kind: "physical",
  name: "Frenetic Rip",
  level: 63,
  mp: 61,
  points: 3,
  cast: 0.5,
  recast: 28.5,
  range: 4.5,
  hits: 3,
  ftp: FRENETIC_FTP[0],
  dCap: 73,
  strMod: 0.2,
  dexMod: 0.2,
  hp: 0,
  agi: 0,
  str: 0,
  dex: 0,
  chr: 0,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 4,
  sleepTrait: 0,
  int: 1,
  mnd: 0,
  vit: 0,
  chain: "Induration",
  family: "Imp",
  learnSkill: blueLearnSkill(63),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Cannonball. One blunt hit. Damage varies with TP.
 * Level 70, 66 MP, 3 points, cast 0.5s, recast 28.5s, range 21'.
 * The tested ceiling is about 21.5. This yard uses 21. It is not a
 * ranged attack, so shadows, Sneak Attack, and Trick Attack would see
 * a melee hit. Sneak Attack and Trick Attack are not in this kit.
 * The stat term is 50% of STR and 50% of VIT. fSTR stops at 22.
 * The skill term is not capped. At Blue Magic 276 it is 63.
 * The weapon-skill coefficient stays 1.75 until Chain Affinity or
 * Azure Lore is up, even though the card says damage varies with TP.
 * Chain Affinity walks 1.75 at 0 TP, 2.125 at 1500, and 2.75 at 3000.
 * It doubles the stat term, forces the critical hit, spends all TP,
 * and a connecting hit opens Fusion. Azure Lore uses the 3500 anchor,
 * 2.875. It does not itself double the stat term or force a critical
 * hit, and it is not consumed. The script's 3 is not used.
 * The pDIF ratio uses the caster's Defense in place of Attack.
 * Blue Magic skill + 8 + STR/2 is not used. Cocoon and Protect raise it
 * because they are already on Defense. There is no additional status.
 * The enmity box is blank. The cast claims, and the damage adds its own
 * enmity. A connecting hit gives the target 100 TP. It breaks Mazurka.
 * Burst Affinity is not spent. The script says Combos: None.
 * Set bonus STR +1 and DEX +1. No trait.
 * Learned from Wamouracampa at Blue Magic 220+. Granted until a
 * Wamouracampa is in the yard.
 */
export const CANNONBALL_FTP = [1.75, 2.125, 2.75] as const;
export const CANNONBALL_FTP_AZURE = 2.875;
export const CANNONBALL_RANGE = 21;

export const CANNONBALL = {
  kind: "physical",
  name: "Cannonball",
  level: 70,
  mp: 66,
  points: 3,
  cast: 0.5,
  recast: 28.5,
  range: CANNONBALL_RANGE,
  hits: 1,
  ftp: CANNONBALL_FTP[0],
  dCap: 999,
  strMod: 0.5,
  dexMod: 0,
  vitMod: 0.5,
  hp: 0,
  agi: 0,
  str: 1,
  dex: 1,
  chr: 0,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 0,
  mnd: 0,
  vit: 0,
  chain: "Fusion",
  family: "Wamouracampa",
  learnSkill: blueLearnSkill(70),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Disseverment. Five piercing hits. Additional effect: Poison.
 * Accuracy varies with TP.
 * Level 72, 74 MP, 5 points, cast 0.5s, recast 32.75s.
 * The range box is blank. This yard uses 4.5'.
 * The stat term is 20% of STR and 20% of DEX. The skill term stops at 89.
 * At Blue Magic 276 the skill term is 63, so the cap does not bind.
 * The weapon-skill coefficient is 1.5 at 0, 1500, 3000, and 3500 TP.
 * Azure Lore does not change it. Only the first hit uses 1.5. The other
 * four stay at 1. Attack is always 90%. BG-Wiki prints a 10% penalty.
 * The script's 1.05 is not used. Chain Affinity does not raise that attack.
 * The card says accuracy varies with TP. No anchors are printed. The
 * script's floor(TP / 50), and its Azure Lore bonus of 70, are marked as
 * made up, so no accuracy is added. Each hit rolls accuracy on its own.
 * A connecting hit tries Distortion. A full miss does not.
 * Poison lands when any hit connects. There is no separate resist roll.
 * The slip is floor(level / 5) + 3, and it stops at 22. At 75 that is 18
 * HP every 3 seconds for 180 seconds. A stronger poison already on the
 * target is left alone. Poison, Poison II, and Poisonga are that status.
 * The enmity box is blank. The cast claims, and the damage adds its own
 * enmity. Each connecting hit gives the target 100 TP.
 * Set bonus INT +1 and MND −1. Accuracy Bonus is 4 trait points and 5 set
 * points. With Frenetic Rip the trait is Accuracy +10. Neither spell grants
 * it alone. It does not stack with Ranger. The higher value is kept.
 * It breaks Mazurka. Burst Affinity is not spent.
 * Learned from an Aern at Blue Magic 230+. Only a dagger Aern readies it.
 * No Aern is in the yard yet, so it is already learned.
 */
export const DISSEVER_ATTACK = 0.9;
export const DISSEVER_POISON_CAP = 22;
export const DISSEVER_POISON_SECONDS = 180;

export const DISSEVERMENT = {
  kind: "physical",
  name: "Disseverment",
  level: 72,
  mp: 74,
  points: 5,
  cast: 0.5,
  recast: 32.75,
  range: 4.5,
  hits: 5,
  ftp: 1.5,
  dCap: 89,
  strMod: 0.2,
  dexMod: 0.2,
  hp: 0,
  agi: 0,
  str: 0,
  dex: 0,
  chr: 0,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 4,
  sleepTrait: 0,
  int: 1,
  mnd: -1,
  vit: 0,
  chain: "Distortion",
  family: "Aern",
  learnSkill: blueLearnSkill(72),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Mind Blast. One lightning hit. Additional effect: Paralyze.
 * Level 73, 82 MP, 4 points, cast 3s, recast 30s.
 * The range box is blank. The client spell list stores 100 in the same
 * column where Wild Carrot stores 200, and this yard treats that 200 as
 * 20'. This yard uses 10'. It is not a tested ceiling from a wiki box.
 * The base is main level + 2, and it stops at 69. At 75 that term is 69.
 * The stat term is 30% of MND, times the level alpha. At 75 alpha is
 * ceil(100 − (75 − 40) / 2) / 100, which is 0.83. Burst Affinity doubles
 * that term. The artifact augment and Enhances Burst Affinity are not
 * in this kit. Chain Affinity does not apply and is not spent.
 * The weapon-skill coefficient is 531/256, which is 2.07421875. The
 * script's 2.08 is the rounded form and is not used. It does not walk
 * with TP. Azure Lore adds 0.5 to that coefficient. It does not use the
 * 3500 interpolation, and it is not consumed.
 * dMND is multiplied by 1.5. The script does not set a half cap or a
 * floor, so the defaults apply: overflow above 999 counts for half, and
 * the term cannot fall under −399. Day, weather, staff, affinity, SDT,
 * Ebullience, the blue power setting, Convergence, and ecosystem
 * correlation are not applied. Magic Attack Bonus is the yard's
 * (100 + MAB) / (100 + MDB) step, after the resist floor. The hare's
 * magic defense is 0.
 * A resist can cut the hit to 1/2, 1/4, or 1/8. 1/8 is not a full resist.
 * The additional effect is a second roll. Paralyze is 20% for 90 seconds.
 * That 20 is not the enfeeble potency. A full resist on that second roll
 * does not land it, which is the script's resist of 0.25 or lower. A
 * half resist lasts floor(90 / 2) seconds, and the potency stays 20.
 * Damage of 0 skips the effect. Paralyze II is stronger and is left alone.
 * It does not open a skillchain. Burst Affinity lets it magic burst
 * Impaction, Fragmentation, Light, and Radiance while that window is open.
 * Azure Lore does not. Cannonball's Fusion is fire and light, so this
 * lightning hit does not burst it. A matching chain is +35% for two
 * weapon skills and +10% for each further one, from the current
 * Magic Burst page. The older 1.30 step is not used. The floor is
 * taken after that step, then after Magic Burst Bonus. Blue Mage has
 * no such trait. Day, weather, and the resistance-rank table are not
 * applied. The doubled stat term is not that bonus.
 * The enmity box is blank. The cast claims, and the damage adds its own
 * enmity. It does not give the hare TP. It breaks Mazurka.
 * Set bonus MP +5 and MND +1. Clear Mind is 4 trait points and 4 set
 * points. The trait needs 8 and 3, so this spell alone does not grant it.
 * Learned from Soulflayer at Blue Magic 235+. Granted until a Soulflayer
 * is in the yard.
 */
export const MIND_BLAST_RANGE = 10;
export const MIND_BLAST_FTP = 531 / 256;
export const MIND_BLAST_AZURE = 0.5;
export const MIND_BLAST_CAP = 69;
export const MIND_BLAST_HALF = 999;
export const MIND_BLAST_LOW = -399;
export const MIND_BLAST_PARA = 20;
export const MIND_BLAST_PARA_SECONDS = 90;

export const MIND_BLAST = {
  kind: "magical",
  name: "Mind Blast",
  level: 73,
  mp: 82,
  points: 4,
  cast: 3,
  recast: 30,
  range: MIND_BLAST_RANGE,
  ftp: MIND_BLAST_FTP,
  azureFtp: MIND_BLAST_AZURE,
  mndMod: 0.3,
  dStat: 1.5,
  dCap: MIND_BLAST_CAP,
  paralyze: MIND_BLAST_PARA,
  paralyzeSeconds: MIND_BLAST_PARA_SECONDS,
  hp: 0,
  agi: 0,
  str: 0,
  dex: 0,
  chr: 0,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 0,
  mnd: 1,
  vit: 0,
  setMp: 5,
  mabTrait: 0,
  clearTrait: 4,
  family: "Soulflayer",
  learnSkill: blueLearnSkill(73),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Sandspin. Earth damage to enemies around you.
 * Additional effect: Accuracy Down.
 * Level 1, 10 MP, 2 points, cast 1.5s, recast 9.75s.
 * The card says Target: Single and Range 6'. The client row is an
 * area spell: AOE 1, radius 50, the same radius column Sheep Song
 * uses for 6'. The description is enemies within range. This yard
 * uses 6', centered on you, checked when the spell lands.
 * The skill term is main level + 2, and it stops at 13. At 75 that
 * term is 13. The stat term is 20% of INT times the level alpha.
 * Burst Affinity doubles that term and is spent, even on a miss or
 * when nobody is in the area. dINT is not halved until it passes 16,
 * and it cannot fall under −6. The weapon-skill coefficient is 1.0.
 * Azure Lore does not add to it. The script leaves azureBonus unset.
 * Day, weather, staff, affinity, SDT, Ebullience, Convergence, and
 * ecosystem correlation are not applied. Magic Attack Bonus is the
 * yard's step after the resist floor.
 * A resist can cut the hit to 1/2, 1/4, or 1/8. Earth matches
 * Scission, Gravitation, Darkness, and Umbra.
 * Accuracy Down is −25. The card prints 3 minutes. The script's 60
 * seconds is not used. It is a second roll. A full resist does not
 * land it. A half resist shortens the 180 seconds, and the −25 stays.
 * Damage of 0 skips it. It does not overwrite Flash, and Flash does
 * not overwrite it. They are different statuses, and both cut accuracy.
 * The enmity box is blank, and the client row stores 0 and 0. A hare
 * inside the area is claimed. No fixed hate is added.
 * Set bonus VIT +1. The script says Combos: None, so it grants no trait.
 * It breaks Mazurka. Learned from Worm at Blue Magic 0+. Granted until
 * a Worm is in the yard.
 */
export const SANDSPIN_RADIUS = 6;
export const SANDSPIN_CAP = 13;
export const SANDSPIN_HALF = 16;
export const SANDSPIN_LOW = -6;
export const SANDSPIN_ACC = 25;
export const SANDSPIN_SECONDS = 180;

export const SANDSPIN = {
  kind: "sand",
  name: "Sandspin",
  level: 1,
  mp: 10,
  points: 2,
  cast: 1.5,
  recast: 9.75,
  radius: SANDSPIN_RADIUS,
  ftp: 1,
  intMod: 0.2,
  dStat: 1,
  dCap: SANDSPIN_CAP,
  half: SANDSPIN_HALF,
  low: SANDSPIN_LOW,
  accDown: SANDSPIN_ACC,
  seconds: SANDSPIN_SECONDS,
  hp: 0,
  agi: 0,
  str: 0,
  dex: 0,
  chr: 0,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 0,
  mnd: 0,
  vit: 1,
  family: "Worm",
  learnSkill: blueLearnSkill(1),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Pollen. Restores your own HP.
 * Level 1, 1 point, cast 2s, recast 5s.
 * The current card prints 5 MP. The client row and the script header
 * both store 8. This yard uses 8. The card's 5 is not used.
 * The target is you. The client valid-targets bit is self. An enemy
 * is not healed, and it does not damage undead.
 * Power is the blue-cure power: 3×MND + VIT + 3×floor(Healing Magic ÷ 5).
 * The base is floor(power ÷ 2) on the script's three bands.
 * Power through 59 uses rate 1 and constant −6.
 * Power through 99 uses rate 2 and constant 9.
 * Higher power uses rate 57 and constant 33.125.
 * The floor is 14. The card's soft cap of 36 is the neighborhood of
 * the last band, not a clamp. Day, weather, and cure potency are not
 * applied. Divine Seal doubles afterwards.
 * The enmity box is blank, so only the HP that lands adds cure enmity.
 * It does not claim. It does not break Mazurka. Burst Affinity is not spent.
 * Set bonus CHR +1 and HP +5. Resist Sleep is 4 trait points and 1 set
 * point. The trait needs 8 trait points and 4 set points, so this spell
 * alone does not grant it. With Wild Carrot or Magic Fruit it does.
 * Learned from Bee at Blue Magic 0+. Granted until a Bee is in the yard.
 */
export const POLLEN_MIN = 14;
export const POLLEN_MP = 8;

export const POLLEN = {
  kind: "pollen",
  name: "Pollen",
  level: 1,
  mp: POLLEN_MP,
  points: 1,
  cast: 2,
  recast: 5,
  min: POLLEN_MIN,
  hp: 5,
  agi: 0,
  str: 0,
  dex: 0,
  chr: 1,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 4,
  int: 0,
  mnd: 0,
  vit: 0,
  family: "Bee",
  learnSkill: blueLearnSkill(1),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Power Attack. One blunt hit. Chance of critical hit varies with TP.
 * Level 4, 5 MP, 1 point, cast 0.5s, recast 7.25s, range 4.5'.
 * The client range column is 30. Foot Kick uses that same 30 and this
 * yard keeps the card's 4.5', so this spell does too.
 * The stat term is 10% of STR and 10% of VIT. The skill term stops at 11.
 * The weapon-skill coefficient is 1.125 at 0, 1500, 3000, and 3500 TP.
 * Azure Lore does not change it. Attack is 1.8× at every tier. Chain
 * Affinity does not raise that attack. It doubles the stat term, forces
 * the critical hit, spends all TP, and a connecting hit opens Reverberation.
 * The script's critical-hit walk, 0 at 0 TP, 15 at 1500, and 30 at 3000,
 * is not used, because Chain Affinity in this yard forces the critical hit.
 * Without Chain Affinity or Azure Lore the chance stays 0, even though
 * the card says it varies with TP. Azure Lore sets the chance to 35%.
 * That 35 is not a forced critical hit, and Azure Lore is not consumed.
 * Native critical hit rate is not added. The script subtracts the 5%
 * floor and this yard's blue magic has none left.
 * No additional status. The monster version is a horn slam. This spell
 * does not move you. The enmity box is blank. The cast claims, and the
 * damage adds its own enmity. A connecting hit gives the target 100 TP.
 * Set bonus MND +1. Plantoid Killer is 4 trait points and 1 set point.
 * The trait needs 8 trait points and 3 set points. Mandibular Bite is
 * 4 trait points and 2 set points, so setting both grants it. Spiral
 * Spin is not in the yard. This spell alone does not grant it.
 * It breaks Mazurka. Burst Affinity is not spent.
 * Learned from Beetle at Blue Magic 0+. Granted until a Beetle is in the yard.
 */
export const POWER_ATTACK_FTP = 1.125;
export const POWER_ATTACK_MULT = 1.8;
export const POWER_ATTACK_AZURE_CRIT = 0.35;

export const POWER_ATTACK = {
  kind: "physical",
  name: "Power Attack",
  level: 4,
  mp: 5,
  points: 1,
  cast: 0.5,
  recast: 7.25,
  range: 4.5,
  hits: 1,
  ftp: POWER_ATTACK_FTP,
  dCap: 11,
  strMod: 0.1,
  dexMod: 0,
  vitMod: 0.1,
  hp: 0,
  agi: 0,
  str: 0,
  dex: 0,
  chr: 0,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 0,
  mnd: 1,
  vit: 0,
  plantTrait: 4,
  chain: "Reverberation",
  family: "Beetle",
  learnSkill: blueLearnSkill(4),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Sprout Smack. One blunt hit. Additional effect: Slow.
 * Duration of the effect varies with TP.
 * Level 4, 6 MP, 2 points, cast 0.5s, recast 7.25s, range 4.5'.
 * The stat term is 30% of VIT. The skill term stops at 11.
 * The weapon-skill coefficient is 1.5 at every TP tier, including Azure Lore.
 * Slow is a static 15%. This yard stores that as 150/1024, the same unit
 * Slow uses at 0 dMND. The script's power 1500 is the other scale and is
 * not stored. There is no separate resist roll. A miss does not slow.
 * Slow II is stronger and is left alone. A Slow whose potency is already
 * above 150 is left alone. An equal or weaker Slow is refreshed.
 * The duration is 180 seconds unless Chain Affinity is spent, which walks
 * 180 at 0 TP, 360 at 1500, and 400 at 3000. Azure Lore uses 450. The
 * script marks those anchors as needing verification. They are the only
 * numbers printed, so this yard uses them. Without either buff the
 * duration stays 180, even though the card says it varies with TP.
 * Skillchain is Reverberation. A miss does not open it.
 * The enmity box is blank. The cast claims, and the damage adds its own.
 * Set bonus MND +1. Beast Killer is 4 trait points and 2 set points.
 * With Wild Oats the trait is met. This spell alone does not grant it.
 * It breaks Mazurka. Burst Affinity is not spent.
 * Learned from Sapling at Blue Magic 0+. Granted until a Sapling is in the yard.
 */
export const SPROUT_SLOW = 150;
export const SPROUT_SECONDS = 180;

export const SPROUT_SMACK = {
  kind: "physical",
  name: "Sprout Smack",
  level: 4,
  mp: 6,
  points: 2,
  cast: 0.5,
  recast: 7.25,
  range: 4.5,
  hits: 1,
  ftp: 1.5,
  dCap: 11,
  strMod: 0,
  dexMod: 0,
  vitMod: 0.3,
  hp: 0,
  agi: 0,
  str: 0,
  dex: 0,
  chr: 0,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 0,
  mnd: 1,
  vit: 0,
  beastTrait: 4,
  chain: "Reverberation",
  family: "Sapling",
  learnSkill: blueLearnSkill(4),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Wild Oats. One piercing hit. Additional effect: Vitality Down.
 * Duration of the effect varies with TP. It is not a ranged attack.
 * Level 4, 9 MP, 3 points, cast 0.5s, recast 7.25s, range 13.5'.
 * The client range column is 120. This yard keeps the card's 13.5'.
 * Shadows, Sneak Attack, and Trick Attack would see a melee hit.
 * The stat term is 30% of AGI. The skill term stops at 11.
 * The weapon-skill coefficient is 1.8359375 at every TP tier. The card's
 * 1.84 is the rounded form and is not used. Azure Lore does not change it.
 * Vitality Down is −9, and it cannot drop the target under 0 VIT.
 * It decays by 1 every 6 seconds, which is the script's tick. The effect
 * comment's "every 3 ticks" is not used, because the tick function
 * restores 1 VIT every time it is called. Nine steps empty it in 54
 * seconds, so a longer duration cap does not keep the last point up.
 * The cap is still 180 seconds, 450 under Azure Lore, and the Chain
 * Affinity walk 180 / 360 / 400. Those anchors are marked as needing
 * verification. They are the only numbers printed.
 * A miss does not lower VIT. There is no separate resist roll.
 * Casting it again starts the −9 over. It counts as an attribute down.
 * Skillchain is Transfixion. A miss does not open it.
 * The enmity box is blank. The cast claims, and the damage adds its own.
 * Set bonus CHR +1 and HP +10. Beast Killer is 4 trait points and 3 set
 * points. With Sprout Smack the trait is +8% damage dealt to beasts.
 * The Tropical Rarab is a beast. It does not stack with Beastmaster.
 * The higher value is kept. This spell alone does not grant the trait.
 * It breaks Mazurka. Burst Affinity is not spent.
 * Learned from Mandragora at Blue Magic 0+. Granted until a Mandragora
 * is in the yard.
 */
export const WILD_OATS_FTP = 1.8359375;
export const WILD_OATS_VIT = 9;
export const WILD_OATS_TICK = 6;

export const WILD_OATS = {
  kind: "physical",
  name: "Wild Oats",
  level: 4,
  mp: 9,
  points: 3,
  cast: 0.5,
  recast: 7.25,
  range: 13.5,
  hits: 1,
  ftp: WILD_OATS_FTP,
  dCap: 11,
  strMod: 0,
  dexMod: 0,
  agiMod: 0.3,
  hp: 10,
  agi: 0,
  str: 0,
  dex: 0,
  chr: 1,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 0,
  mnd: 0,
  vit: 0,
  beastTrait: 4,
  chain: "Transfixion",
  family: "Mandragora",
  learnSkill: blueLearnSkill(4),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Metallic Body. A stoneskin shell on you.
 * Level 8, 19 MP, 1 point, cast 7s, recast 60s.
 * Power is floor(Blue Magic skill × 0.375 + 12.5). Skill is held from
 * 0 through 500. The result stops at 200. At 500 skill that is 200.
 * The script clamps the power at 150. That disagrees with the card and
 * does not bind at skill 276, so the card's 200 is the cap.
 * Duration is 300 seconds. Diffusion would lengthen it. Diffusion is a
 * locked merit, so the duration stays 300.
 * It does not overwrite Stoneskin, whether that shell is the spell or
 * Afflatus Solace. Earthen Ward is not in the yard. Stoneskin and
 * Afflatus Solace overwrite this shell. Casting it again refreshes it.
 * Stoneskin+ gear is not equipped, and the page says it would not apply.
 * Gamer Escape calls the element earth. There is no damage, so the
 * element is not rolled.
 * Cumulative enmity 1, volatile 300. A spell on yourself does not claim.
 * It does not break Mazurka. Chain Affinity and Burst Affinity are not spent.
 * No stat bonus. Max MP Boost is 4 trait points and 1 set point. The
 * trait needs 8 trait points and 4 set points, and tier I is level 40.
 * Mysterious Light is the other half. This spell alone grants nothing.
 * Courier Carrie's Metallic Body is a pet weaponskill. It is not this spell.
 * Learned from Crab at Blue Magic 0+. Granted until a Crab is in the yard.
 */
export const METAL_SECONDS = 300;
export const METAL_CE = 1;
export const METAL_VE = 300;
export const METAL_SKILL_CAP = 500;
export const METAL_POWER_CAP = 200;

export const METALLIC_BODY = {
  kind: "metal",
  name: "Metallic Body",
  level: 8,
  mp: 19,
  points: 1,
  cast: 7,
  recast: 60,
  seconds: METAL_SECONDS,
  ce: METAL_CE,
  ve: METAL_VE,
  hp: 0,
  agi: 0,
  str: 0,
  dex: 0,
  chr: 0,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 0,
  mnd: 0,
  vit: 0,
  mpTrait: 4,
  family: "Crab",
  learnSkill: blueLearnSkill(8),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Queasyshroom. One piercing ranged hit. Additional effect: Poison.
 * Level 8, 20 MP, 2 points, cast 2s, recast 15s, range 13.5'.
 * The stat term is 20% of INT. The skill term stops at 15. At Blue Magic
 * 276 that term would be 63, so the cap binds.
 * The weapon-skill coefficient is 1.75 at every TP tier, including Azure Lore.
 * The spell is a ranged attack. This yard has no Blue Mage ranged skill,
 * and a ranged attack of 0 would miss, so the pDIF roll uses melee attack
 * and melee accuracy. Sneak Attack and Trick Attack are not in the kit.
 * Poison is 3 HP every 3 seconds. The duration is 90 seconds unless Chain
 * Affinity is spent, which walks 90 at 0 TP, 150 at 1500, and 180 at 3000.
 * Azure Lore uses 210. The script marks those anchors as needing
 * verification. They are the only numbers printed. Without either buff the
 * duration stays 90, even though the card says it varies with TP.
 * The additional effect is a magic resist roll. The element is not water.
 * A piercing damage type is not an element, so the roll uses no element.
 * A full resist does not poison. A half resist shortens the duration, and
 * the potency stays 3. A miss does not poison. A stronger poison is left
 * alone. An equal poison is refreshed.
 * The page says the spell removes every shadow, hit or miss. The Tropical
 * Rarab has no Blink, so that wipe does nothing.
 * Skillchain is Compression. A miss does not open it.
 * The enmity box is blank. The cast claims, and the damage adds its own.
 * Set bonus HP −5 and MP +5. The script says Combos: None, so it grants no trait.
 * It breaks Mazurka. Burst Affinity is not spent.
 * Learned from Funguar at Blue Magic 0+. Granted until a Funguar is in the yard.
 */
export const QUEASY_POISON = 3;
export const QUEASY_SECONDS = 90;
export const QUEASY_AZURE = 210;

export const QUEASYSHROOM = {
  kind: "physical",
  name: "Queasyshroom",
  level: 8,
  mp: 20,
  points: 2,
  cast: 2,
  recast: 15,
  range: 13.5,
  hits: 1,
  ftp: 1.75,
  dCap: 15,
  strMod: 0,
  dexMod: 0,
  intMod: 0.2,
  ranged: true,
  hp: -5,
  agi: 0,
  str: 0,
  dex: 0,
  chr: 0,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 0,
  mnd: 0,
  vit: 0,
  setMp: 5,
  chain: "Compression",
  family: "Funguar",
  learnSkill: blueLearnSkill(8),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Head Butt. One blunt hit. Additional effect: Stun.
 * Damage varies with TP.
 * Level 12, 12 MP, 3 points, cast 0.5s, recast 10s, range 4.5'.
 * The client range column is shorter. The card prints 4.5', so that is the range.
 * The stat term is 20% of STR and 20% of INT. The skill term stops at 17.
 * At Blue Magic 276 that term would be 63, so the cap binds.
 * The weapon-skill coefficient is 1.75 at 0 TP, 2.125 at 1500, and 2.25 at 3000.
 * Azure Lore uses 2.375, the 3500 column. This yard walks that coefficient
 * only under Chain Affinity. Raw TP stays at 1.75. Azure Lore replaces it
 * and is not consumed. The script walks whenever TP is above 0. That is
 * not used, the same rule as Cannonball and Frenetic Rip.
 * Attack is ×1.05 at every tier. Chain Affinity does not raise it. It
 * doubles the stat term, forces the critical hit, spends all TP, and a
 * connecting hit opens Impaction.
 * Stun lasts a whole second from 1 through 5. The script's random 2–8 is
 * longer than the card and is not used. It is a second magic resist roll.
 * The element is lightning, because a monster that resists lightning or
 * stun resists the effect. Magic accuracy is Blue Magic skill plus dINT.
 * A full resist does not stun. A half resist shortens the duration, and
 * the potency is the duration itself. A miss does not stun. It replaces
 * a Stun already up.
 * Knockback is graphical. The hare does not move. A connecting hit
 * interrupts a spell the hare has started and not finished. If the stun
 * also lands, that interrupt is not logged a second time.
 * The enmity box is blank. The cast claims, and the damage adds its own.
 * Set bonus DEX +2. The script says Combos: None, so it grants no trait.
 * It breaks Mazurka. Burst Affinity is not spent.
 * Learned from Quadav at Blue Magic 8+. Granted until a Quadav is in the yard.
 */
export const HEAD_BUTT_FTP = [1.75, 2.125, 2.25] as const;
export const HEAD_BUTT_FTP_AZURE = 2.375;
export const HEAD_BUTT_MULT = 1.05;

export const HEAD_BUTT = {
  kind: "physical",
  name: "Head Butt",
  level: 12,
  mp: 12,
  points: 3,
  cast: 0.5,
  recast: 10,
  range: 4.5,
  hits: 1,
  ftp: HEAD_BUTT_FTP[0],
  dCap: 17,
  strMod: 0.2,
  dexMod: 0,
  intMod: 0.2,
  hp: 0,
  agi: 0,
  str: 0,
  dex: 2,
  chr: 0,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 0,
  mnd: 0,
  vit: 0,
  chain: "Impaction",
  family: "Quadav",
  learnSkill: blueLearnSkill(12),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Feather Storm. One piercing ranged hit. Additional effect: Poison.
 * Chance of effect varies with TP. The duration box is blank.
 * Level 12, 12 MP, 3 points, cast 0.5s, recast 10s, range 13.5'.
 * The stat term is 30% of AGI. The skill term stops at 17. At Blue Magic
 * 276 that term would be 63, so the cap binds.
 * The weapon-skill coefficient is 2 at every TP tier, including Azure Lore.
 * The spell is a ranged attack. This yard has no Blue Mage ranged skill,
 * so the pDIF roll uses melee attack and melee accuracy, the same choice
 * as Queasyshroom.
 * The script stores the effect as poison of power 1 and tick 3, and the
 * TP modifier is duration, not accuracy. There is no separate chance term.
 * A hit always attempts the poison. The only chance rolled is the magic
 * resist. The element is not set. A full resist does not poison. A half
 * resist shortens the duration, and the potency stays 1. A miss does not
 * poison. A stronger poison is left alone. An equal poison is refreshed.
 * The duration anchors are the same unverified set Sprout Smack uses:
 * 180 seconds, the Chain Affinity walk 180 / 360 / 400, and 450 under
 * Azure Lore. Without either buff the duration stays 180.
 * Skillchain is Transfixion. A miss does not open it.
 * The enmity box is blank. The cast claims, and the damage adds its own.
 * Set bonus CHR +2 and HP +5. Rapid Shot is 4 trait points and 3 set
 * points. The trait needs 8 trait points and 6 set points, and tier I is
 * level 38, about 25%. Jet Stream is the other half, so this spell alone
 * grants nothing. A Ranger's Rapid Shot, when it is higher, is kept.
 * It breaks Mazurka. Burst Affinity is not spent.
 * Learned from Yagudo at Blue Magic 8+. Granted until a Yagudo is in the yard.
 */
export const FEATHER_FTP = 2;
export const FEATHER_POISON = 1;

export const FEATHER_STORM = {
  kind: "physical",
  name: "Feather Storm",
  level: 12,
  mp: 12,
  points: 3,
  cast: 0.5,
  recast: 10,
  range: 13.5,
  hits: 1,
  ftp: FEATHER_FTP,
  dCap: 17,
  strMod: 0,
  dexMod: 0,
  agiMod: 0.3,
  ranged: true,
  hp: 5,
  agi: 0,
  str: 0,
  dex: 0,
  chr: 2,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 0,
  mnd: 0,
  vit: 0,
  rapidTrait: 4,
  chain: "Transfixion",
  family: "Yagudo",
  learnSkill: blueLearnSkill(12),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Helldive. One blunt hit. Damage varies with TP.
 * The page does not name the damage type. The script uses blunt, so this
 * yard uses blunt.
 * Level 16, 16 MP, 2 points, cast 0.5s, recast 11.25s, range 4.5'.
 * The stat term is 30% of AGI. The skill term stops at 19. At Blue Magic
 * 276 that term would be 63, so the cap binds.
 * The weapon-skill coefficient is 1.25 at 0 TP, 1.625 at 1500, and 2 at 3000.
 * Azure Lore uses 2.125. This yard walks that coefficient only under Chain
 * Affinity. Raw TP stays at 1.25. Azure Lore replaces it and is not consumed.
 * Attack is ×1.85 at every tier. Chain Affinity does not raise it. It
 * doubles the stat term, forces the critical hit, spends all TP, and a
 * connecting hit opens Transfixion.
 * No additional status. Knockback is graphical. The hare does not move.
 * A connecting hit interrupts a spell the hare has started and not finished.
 * The enmity box is blank. The cast claims, and the damage adds its own.
 * Set bonus CHR +1 and HP +5. The script says Combos: None, so it grants no trait.
 * It breaks Mazurka. Burst Affinity is not spent.
 * Learned from Lesser Bird at Blue Magic 20+. Granted until a Lesser Bird
 * is in the yard.
 */
export const HELLDIVE_FTP = [1.25, 1.625, 2] as const;
export const HELLDIVE_FTP_AZURE = 2.125;
export const HELLDIVE_MULT = 1.85;

export const HELLDIVE = {
  kind: "physical",
  name: "Helldive",
  level: 16,
  mp: 16,
  points: 2,
  cast: 0.5,
  recast: 11.25,
  range: 4.5,
  hits: 1,
  ftp: HELLDIVE_FTP[0],
  dCap: 19,
  strMod: 0,
  dexMod: 0,
  agiMod: 0.3,
  hp: 5,
  agi: 0,
  str: 0,
  dex: 0,
  chr: 1,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 0,
  mnd: 0,
  vit: 0,
  chain: "Transfixion",
  family: "Bird",
  learnSkill: blueLearnSkill(16),
  granted: true,
} satisfies BlueSpell;

/** Half-angle of a blue cone, in degrees. LandSandBoat's 32 rotation units are 45° each side. */
export const BLUE_CONE = 45;

/**
 * BG-Wiki Bludgeon. Three blunt hits. Accuracy varies with TP.
 * Level 18, 16 MP, 2 points, cast 0.5s, recast 11.75s, range 4.5'.
 * Blue Magic skill sets the base, and it stops at 21. At 276 the skill
 * term is 63, so the cap binds. fSTR stops at 22. The stat term is 30% of CHR.
 * The weapon-skill coefficient is 1.0 at every tier, including Azure Lore.
 * Only the first hit uses 1.0. The other two stay at 1.
 * BG-Wiki's ~33% attack bonus is not an exact number. The script prints 1.55,
 * and that is the multiplier at every tier. Chain Affinity does not walk it.
 * The script's accuracy, floor(TP / 50) under Chain Affinity and +70 under
 * Azure Lore, is marked as made up. No accuracy is added. The card's
 * "accuracy varies with TP" has no anchors.
 * Chain Affinity doubles the stat term, forces the critical hit, spends all TP,
 * and a connecting hit opens Liquefaction. Azure Lore does not change the
 * coefficient or the attack, and it is not consumed.
 * Set bonus STR +1. Undead Killer is 4 trait points and 2 set points.
 * The trait needs 8 trait points and 5 set points. Smite of Rage is the
 * other half, 4 trait points and 3 set points. Setting both grants it.
 * This spell alone does not.
 * Learned from Cardian at Blue Magic 26+. Granted until a Cardian is in the yard.
 */
export const BLUDGEON_MULT = 1.55;

export const BLUDGEON = {
  kind: "physical",
  name: "Bludgeon",
  level: 18,
  mp: 16,
  points: 2,
  cast: 0.5,
  recast: 11.75,
  range: 4.5,
  hits: 3,
  ftp: 1,
  dCap: 21,
  strMod: 0,
  dexMod: 0,
  chrMod: 0.3,
  hp: 0,
  agi: 0,
  str: 1,
  dex: 0,
  chr: 0,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 0,
  mnd: 0,
  vit: 0,
  undeadTrait: 4,
  chain: "Liquefaction",
  family: "Cardian",
  learnSkill: blueLearnSkill(18),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Cursed Sphere. Water damage around the target.
 * Level 18, 36 MP, 2 points. The current player card and the script
 * header are 3 seconds to cast and 19.5 seconds to recast. The range is 13.5'.
 * The splash is centered on the enemy you aimed at, not on you.
 * The base is level + 2, capped at 30. The stat term is 30% of INT times
 * the level alpha, doubled while Burst Affinity is up. dINT uses a half
 * cap of 46 and a floor of −6. The coefficient is 1.5. Azure Lore adds
 * nothing to it and does not open a magic burst.
 * Water matches Reverberation, Distortion, Darkness, and Umbra.
 * No additional status. Set bonus MND +1. Magic Attack Bonus is 4 trait
 * points and 2 set points. With Memento Mori, or with Sound Blast, the trait is +20.
 * Learned from Fly at Blue Magic 26+. Granted until a Fly is in the yard.
 */
export const CURSED_SPHERE = {
  kind: "orb",
  name: "Cursed Sphere",
  level: 18,
  mp: 36,
  points: 2,
  cast: 3,
  recast: 19.5,
  range: 13.5,
  ftp: 1.5,
  intMod: 0.3,
  dStat: 1,
  dCap: 30,
  half: 46,
  low: -6,
  element: "water",
  hp: 0,
  agi: 0,
  str: 0,
  dex: 0,
  chr: 0,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 0,
  mnd: 1,
  vit: 0,
  mabTrait: 4,
  family: "Fly",
  learnSkill: blueLearnSkill(18),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Blastbomb. Fire damage around the target. Additional effect: Bind.
 * Level 18, 36 MP, 2 points, cast 2.25s, recast 15s, range 13.5'.
 * The splash is centered on the enemy. It bypasses shadow images.
 * The hare has none, so that bypass is not rolled.
 * The base is level + 2, capped at 30. The stat term is 20% of INT times
 * the level alpha, doubled while Burst Affinity is up. dINT uses a half
 * cap of 25 and a floor of −10. The coefficient is 1.375. Azure Lore adds
 * nothing to it and does not open a magic burst.
 * Fire matches Liquefaction, Fusion, Light, and Radiance.
 * Bind is 30 seconds. The card leaves the duration blank. The script stores 30.
 * Damage lands first, and that damage removes a Bind already up. The new
 * Bind is attempted after that, so a land refreshes it. A full resist on
 * the damage skips the Bind. The Bind itself is a second resist roll.
 * The script says Combos: None. Set bonus STR +1.
 * Learned from Orcish Warmachine at Blue Magic 26+. Granted until one is in the yard.
 */
export const BLAST_BIND = 30;

export const BLASTBOMB = {
  kind: "orb",
  name: "Blastbomb",
  level: 18,
  mp: 36,
  points: 2,
  cast: 2.25,
  recast: 15,
  range: 13.5,
  ftp: 1.375,
  intMod: 0.2,
  dStat: 1,
  dCap: 30,
  half: 25,
  low: -10,
  element: "fire",
  bind: BLAST_BIND,
  hp: 0,
  agi: 0,
  str: 1,
  dex: 0,
  chr: 0,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 0,
  mnd: 0,
  vit: 0,
  family: "Warmachine",
  learnSkill: blueLearnSkill(18),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Claw Cyclone. Two slashing hits in a fan in front of you.
 * Level 20, 24 MP, 2 points, cast 1s, recast 19.75s, range 13.7'.
 * The fan is 45° each side of where you are facing. A target behind you
 * is missed. Damage varies with TP through the attack multiplier, not
 * the coefficient. The coefficient is 1.4375 at every tier, including
 * Azure Lore. Only the first hit uses it. The second stays at 1.
 * Attack is ×1.3 until Chain Affinity or Azure Lore is up. Chain Affinity
 * walks 1.3 at 0 TP, 1.8 at 1500, and 2.0 at 3000. Azure Lore sets it to 2.1.
 * It does not itself double the stat term or force a critical hit.
 * The stat term is 30% of DEX. The skill term stops at 23.
 * Chain Affinity doubles the stat term, forces the critical hit, spends all TP,
 * and a connecting hit opens Scission.
 * Set bonus VIT +1. Lizard Killer is 4 trait points and 2 set points.
 * With Foot Kick, also 4 and 2, the trait is +8%. Neither spell grants it alone.
 * Learned from Tiger at Blue Magic 32+. Granted until a Tiger is in the yard.
 */
export const CLAW_FTP = 1.4375;
export const CLAW_ATTACK = [1.3, 1.8, 2] as const;
export const CLAW_ATTACK_AZURE = 2.1;

export const CLAW_CYCLONE = {
  kind: "physical",
  name: "Claw Cyclone",
  level: 20,
  mp: 24,
  points: 2,
  cast: 1,
  recast: 19.75,
  range: 13.7,
  cone: true,
  hits: 2,
  ftp: CLAW_FTP,
  dCap: 23,
  strMod: 0,
  dexMod: 0.3,
  hp: 0,
  agi: 0,
  str: 0,
  dex: 0,
  chr: 0,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 0,
  mnd: 0,
  vit: 1,
  lizardTrait: 4,
  chain: "Scission",
  family: "Tiger",
  learnSkill: blueLearnSkill(20),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Poison Breath. Water breath in a fan in front of you. Additional effect: Poison.
 * Level 22, 22 MP, 1 point. Gamer Escape and the script header are 3 seconds
 * to cast and 19.5 seconds to recast. The 2022 card's 00:00:05 and 00:01:00
 * use the monster-timer layout and are not the player spell.
 * The range box is blank. This yard uses 10', the same fan length the
 * script's cone is checked across, 45° each side of where you are facing.
 * Damage is current HP / 10 + main level / 1.25. A level 22 Blue Mage at
 * 400 HP is 57 before a resist. Magic Attack Bonus is not applied.
 * Day, weather, staff, affinity, and breath damage dealt are not applied.
 * Arcana would take 25% more. The Tropical Rarab is not Arcana, so that
 * bonus is not rolled. Burst Affinity can magic burst it. Water matches
 * Reverberation, Distortion, Darkness, and Umbra. The older note that a
 * magic burst only raises accuracy is not used. Azure Lore does not open
 * the window and does not change the breath.
 * Poison is 4 HP every 3 seconds. The card prints 30 seconds. The script's
 * 60 is not used. The poison is attempted only when the breath deals damage.
 * A full resist on that second roll does not poison. A half resist shortens
 * the 30 seconds. Set bonus MND +1. Clear Mind is 4 trait points and 1 set
 * point. With Mind Blast the trait is +3 while resting.
 * Learned from Hound at Blue Magic 38+. Granted until a Hound is in the yard.
 */
export const POISON_BREATH_RANGE = 10;
export const POISON_BREATH_DOT = 4;
export const POISON_BREATH_SECONDS = 30;

export const POISON_BREATH = {
  kind: "breath",
  name: "Poison Breath",
  level: 22,
  mp: 22,
  points: 1,
  cast: 3,
  recast: 19.5,
  range: POISON_BREATH_RANGE,
  hpMod: 10,
  lvlMod: 1.25,
  poison: POISON_BREATH_DOT,
  poisonSeconds: POISON_BREATH_SECONDS,
  element: "water",
  hp: 0,
  agi: 0,
  str: 0,
  dex: 0,
  chr: 0,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 0,
  mnd: 1,
  vit: 0,
  clearTrait: 4,
  family: "Hound",
  learnSkill: blueLearnSkill(22),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Soporific. Dark sleep on enemies around you.
 * Level 24, 38 MP, 4 points, cast 3s, recast 90s, range 6'.
 * The area is centered on you. The card and the script both print 90 seconds.
 * A partial resist halves that. A full resist, and a quarter resist, do not land.
 * The script's resist threshold is 0.5, so a half resist still sleeps.
 * It refreshes its own Soporific. It overwrites Sheep Song. Sleep, Sleep II,
 * Sleepga, Sleepga II, Repose, and Lullaby overwrite it, and it does not
 * overwrite those. A direct hit or a heal wakes the target.
 * Magic accuracy is unpublished, so none is added. Blue Magic skill and dINT
 * are rolled. The element is dark. The script can tag a magic-burst message
 * on Compression, Gravitation, or Darkness. There is no damage, so this yard
 * does not spend Burst Affinity and does not apply a burst multiplier.
 * Cumulative enmity 320, volatile 320, when the Tropical Rarab is inside the
 * area, including a resist. A land claims. It breaks Mazurka.
 * Set bonus HP −5 and MP +5. Clear Mind is 4 trait points and 4 set points.
 * With Poison Breath or Mind Blast the trait is +3 while resting.
 * This spell alone does not grant it.
 * Learned from Flytrap at Blue Magic 44+. Granted until a Flytrap is in the yard.
 */
export const SOPORIFIC_RADIUS = 6;
export const SOPORIFIC_SECONDS = 90;
export const SOPORIFIC_CE = 320;
export const SOPORIFIC_VE = 320;

export const SOPORIFIC = {
  kind: "song",
  name: "Soporific",
  level: 24,
  mp: 38,
  points: 4,
  cast: 3,
  recast: 90,
  radius: SOPORIFIC_RADIUS,
  ce: SOPORIFIC_CE,
  ve: SOPORIFIC_VE,
  hp: -5,
  agi: 0,
  str: 0,
  dex: 0,
  chr: 0,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 0,
  mnd: 0,
  vit: 0,
  setMp: 5,
  clearTrait: 4,
  family: "Flytrap",
  learnSkill: blueLearnSkill(24),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Screwdriver. One piercing hit. Chance of critical hit varies with TP.
 * Level 26, 21 MP, 3 points, cast 0.5s, recast 14s, range 4.5'.
 * The stat term is 20% of STR and 20% of MND. The skill term stops at 27.
 * The weapon-skill coefficient is 1.375 at every tier, including Azure Lore.
 * Attack is ×1.6 at every tier. Chain Affinity does not walk that attack.
 * The script's critical-hit walk, 0 at 0 TP, 15 at 1500, and 30 at 3000,
 * is not used, because Chain Affinity in this yard forces the critical hit.
 * Without Chain Affinity or Azure Lore the chance stays 0, even though
 * the card says it varies with TP. Azure Lore sets the chance to 35%.
 * That 35 is not a forced critical hit, and Azure Lore is not consumed.
 * Native critical hit rate is not added.
 * A connecting hit opens Transfixion, then Scission.
 * The enmity box is blank. The cast claims, and the damage adds its own enmity.
 * A connecting hit gives the target 100 TP.
 * Set bonus VIT +1, CHR +1, and HP +10. Evasion Bonus is 4 trait points and
 * 3 set points. The trait needs 8 trait points and 6 set points. Hysteric
 * Barrage is the other half. Setting both grants Evasion Bonus. This
 * spell alone does not.
 * Learned from Pugil at Blue Magic 50+. Granted until a Pugil is in the yard.
 */
export const SCREWDRIVER_MULT = 1.6;
export const SCREWDRIVER_FTP = 1.375;
export const SCREWDRIVER_AZURE_CRIT = 0.35;

export const SCREWDRIVER = {
  kind: "physical",
  name: "Screwdriver",
  level: 26,
  mp: 21,
  points: 3,
  cast: 0.5,
  recast: 14,
  range: 4.5,
  hits: 1,
  ftp: SCREWDRIVER_FTP,
  dCap: 27,
  strMod: 0.2,
  dexMod: 0,
  mndMod: 0.2,
  hp: 10,
  agi: 0,
  str: 0,
  dex: 0,
  chr: 1,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 0,
  mnd: 0,
  vit: 1,
  evasionTrait: 4,
  chain: "Transfixion",
  chain2: "Scission",
  family: "Pugil",
  learnSkill: blueLearnSkill(26),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Bomb Toss. Fire damage around the target.
 * Level 28, 42 MP, 3 points. BG-Wiki prints 4 seconds to cast and 25 to recast.
 * The script header is 3.75 and 24.5, and this yard uses those.
 * The range is 13.5'. The splash is centered on the enemy you aimed at.
 * The base is level + 2, capped at 40. The stat term is 20% of INT times
 * the level alpha, doubled while Burst Affinity is up. The script does not
 * set a half cap or a floor, so dINT uses 999 and −399. The coefficient is
 * 1.625. Azure Lore adds nothing to it and does not open a magic burst.
 * Fire matches Liquefaction, Fusion, Light, and Radiance.
 * No additional status. The script says Combos: None. Set bonus STR +2.
 * Learned from Goblin at Blue Magic 56+. Granted until a Goblin is in the yard.
 */
export const BOMB_TOSS = {
  kind: "orb",
  name: "Bomb Toss",
  level: 28,
  mp: 42,
  points: 3,
  cast: 3.75,
  recast: 24.5,
  range: 13.5,
  ftp: 1.625,
  intMod: 0.2,
  dStat: 1,
  dCap: 40,
  half: 999,
  low: -399,
  element: "fire",
  hp: 0,
  agi: 0,
  str: 2,
  dex: 0,
  chr: 0,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 0,
  mnd: 0,
  vit: 0,
  family: "Goblin",
  learnSkill: blueLearnSkill(28),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Grand Slam. One blunt hit in an area centered on you.
 * Level 30, 24 MP, 2 points, cast 1s, recast 14.25s.
 * The range box is blank. The note says the area is 5' around the caster,
 * not around the target, so this yard uses 5'. The check is at the land.
 * The stat term is 30% of VIT. The skill term stops at 33.
 * The weapon-skill coefficient is 1.0 at every tier, including Azure Lore.
 * Damage varies with TP through the attack multiplier. Attack is ×1.6 until
 * Chain Affinity or Azure Lore is up. Chain Affinity walks 1.6 at 0 TP,
 * 2.0 at 1500, and 2.3 at 3000. Azure Lore sets it to 2.4.
 * Chain Affinity doubles the stat term, forces the critical hit, spends all TP
 * even if nobody is in the ring, and a connecting hit opens Induration.
 * The script can remove 3 shadows. That line is marked as a guess.
 * The hare has none, so that removal is not rolled.
 * The enmity box is blank. A connecting cast claims, and the damage adds
 * its own enmity. A connecting hit gives the target 100 TP.
 * Set bonus INT +1. Defense Bonus is 4 trait points and 2 set points.
 * The trait needs 8 trait points and 5 set points. Terror Touch is the
 * other half, so this spell alone does not grant it.
 * Learned from Gigas at Blue Magic 62+. Granted until a Gigas is in the yard.
 */
export const GRAND_RADIUS = 5;
export const GRAND_ATTACK = [1.6, 2, 2.3] as const;
export const GRAND_ATTACK_AZURE = 2.4;

export const GRAND_SLAM = {
  kind: "physical",
  name: "Grand Slam",
  level: 30,
  mp: 24,
  points: 2,
  cast: 1,
  recast: 14.25,
  radius: GRAND_RADIUS,
  hits: 1,
  ftp: 1,
  dCap: 33,
  strMod: 0,
  dexMod: 0,
  vitMod: 0.3,
  hp: 0,
  agi: 0,
  str: 0,
  dex: 0,
  chr: 0,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 1,
  mnd: 0,
  vit: 0,
  defenseTrait: 4,
  chain: "Induration",
  family: "Gigas",
  learnSkill: blueLearnSkill(30),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Blank Gaze. Removes one beneficial magic effect.
 * Light-based gaze. Level 38, 25 MP, 2 points, cast 3s, recast 10s, range 14'.
 * You do not need to face the enemy. The enemy must be facing you.
 * The script also requires you to face the target. That extra check is not used.
 * There is no damage, so Burst Affinity is not spent. Chain Affinity is not spent.
 * The resist is light, Blue Magic skill plus dINT. The script uses INT.
 * A full resist does not dispel. The hare has no beneficial effect, so a
 * connecting gaze still logs that there is nothing to remove.
 * Cumulative enmity 320, volatile 320. A gaze in range that the hare is
 * facing claims, including a resist. A gaze from behind does not.
 * No stat bonus. The script says Combos: None.
 * It breaks Mazurka. Learned from Opo-opo at Blue Magic 86+.
 * Granted until an Opo-opo is in the yard. Magic Fruit is the other Opo-opo spell.
 */
export const BLANK_RANGE = 14;
export const BLANK_CE = 320;
export const BLANK_VE = 320;

export const BLANK_GAZE = {
  kind: "gaze",
  name: "Blank Gaze",
  level: 38,
  mp: 25,
  points: 2,
  cast: 3,
  recast: 10,
  range: BLANK_RANGE,
  hp: 0,
  agi: 0,
  str: 0,
  dex: 0,
  chr: 0,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 0,
  mnd: 0,
  vit: 0,
  ce: BLANK_CE,
  ve: BLANK_VE,
  family: "Opo-opo",
  learnSkill: blueLearnSkill(38),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Jet Stream. Three blunt hits. Accuracy varies with TP.
 * Level 38, 47 MP, 4 points, cast 0.5s, recast 23s, range 12.5'.
 * The stat term is 30% of AGI. The skill term stops at 39.
 * The weapon-skill coefficient is 1.125 at every tier, including Azure Lore.
 * Only the first hit uses 1.125. The other two stay at 1, the same rule as Bludgeon.
 * The script's attack multiplier is 1.3 at every tier. Chain Affinity does not walk it.
 * The script's accuracy, floor(TP / 50) under Chain Affinity and +70 under
 * Azure Lore, is marked as made up. No accuracy is added.
 * Chain Affinity doubles the stat term, forces the critical hit, spends all TP,
 * and a connecting hit opens Impaction.
 * No additional status. The enmity box is blank. The cast claims, and the
 * damage adds its own. A connecting hit gives the hare 100 TP.
 * Set bonus DEX +2. Rapid Shot is 4 trait points and 4 set points.
 * With Feather Storm, 4 trait points and 3 set points, the trait's 8 points
 * and 6 set points are met. Neither spell grants it alone. Tier I is level 38.
 * It breaks Mazurka. Burst Affinity is not spent.
 * Learned from Flock Bat at Blue Magic 86+. Granted until a Flock Bat is in the yard.
 */
export const JET_FTP = 1.125;
export const JET_MULT = 1.3;
export const JET_CAP = 39;

export const JET_STREAM = {
  kind: "physical",
  name: "Jet Stream",
  level: 38,
  mp: 47,
  points: 4,
  cast: 0.5,
  recast: 23,
  range: 12.5,
  hits: 3,
  ftp: JET_FTP,
  dCap: JET_CAP,
  strMod: 0,
  dexMod: 0,
  agiMod: 0.3,
  hp: 0,
  agi: 0,
  str: 0,
  dex: 2,
  chr: 0,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 0,
  mnd: 0,
  vit: 0,
  rapidTrait: 4,
  chain: "Impaction",
  family: "Bat",
  learnSkill: blueLearnSkill(38),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Mysterious Light. Wind damage to enemies around you.
 * Additional effect: Weight.
 * Level 40, 73 MP, 4 points, cast 3.75s, recast 24.5s.
 * The card says AoE and Range 6'. This yard uses 6', centered on you.
 * The skill term is main level + 2, and it stops at 56. At 75 that term is 56.
 * The stat term is 30% of CHR times the level alpha. Burst Affinity doubles
 * that term and is spent, even on a miss or when nobody is in the area.
 * dCHR uses a half cap of 77 and a floor of −24. The printed coefficient is
 * 248/256, which is 0.96875. The script's 2.0 is the rewritten magical
 * coefficient and is not this yard's fTP. Azure Lore does not add to it.
 * Day, weather, staff, affinity, and ecosystem correlation are not applied.
 * Magic Attack Bonus is the yard's step after the resist floor.
 * A resist can cut the hit to 1/2, 1/4, or 1/8. Wind matches Detonation,
 * Fragmentation, Light, and Radiance.
 * Weight is the Gravity status. The cut is 26%, the same as Gravity here.
 * The script's power 25 is not used. The card prints 30–120 seconds.
 * The script stores 60. That 60 is the unresisted duration. A half resist
 * shortens it, and the 26% stays. Damage of 0 skips it. It refreshes Gravity.
 * The enmity box is blank. A hare inside the area is claimed.
 * Set bonus AGI +3. Max MP Boost is 4 trait points and 4 set points.
 * With Metallic Body, 4 trait points and 1 set point, the trait is +10 MP.
 * Neither spell grants it alone. The tier is level 40.
 * It breaks Mazurka. Learned from Magic Pot at Blue Magic 92+.
 * Granted until a Magic Pot is in the yard.
 */
export const MYSTERY_RADIUS = 6;
export const MYSTERY_FTP = 248 / 256;
export const MYSTERY_CAP = 56;
export const MYSTERY_HALF = 77;
export const MYSTERY_LOW = -24;
export const MYSTERY_WEIGHT = 26;
export const MYSTERY_SECONDS = 60;

export const MYSTERIOUS_LIGHT = {
  kind: "mystery",
  name: "Mysterious Light",
  level: 40,
  mp: 73,
  points: 4,
  cast: 3.75,
  recast: 24.5,
  radius: MYSTERY_RADIUS,
  ftp: MYSTERY_FTP,
  chrMod: 0.3,
  dStat: 1,
  dCap: MYSTERY_CAP,
  half: MYSTERY_HALF,
  low: MYSTERY_LOW,
  weight: MYSTERY_WEIGHT,
  seconds: MYSTERY_SECONDS,
  hp: 0,
  agi: 3,
  str: 0,
  dex: 0,
  chr: 0,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 0,
  mnd: 0,
  vit: 0,
  mpTrait: 4,
  family: "Pot",
  learnSkill: blueLearnSkill(40),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Terror Touch. One blunt hit. Additional effect: Attack Down.
 * Accuracy varies with TP.
 * Level 40, 62 MP, 3 points, cast 3.25s, recast 21s, range 6'.
 * The stat term is 20% of DEX and 20% of INT. The skill term stops at 41.
 * The weapon-skill coefficient is 1.5 at every tier, including Azure Lore.
 * The script's attack multiplier is 1.05 at every tier. Chain Affinity does not walk it.
 * The script's accuracy bonus is marked as made up. No accuracy is added.
 * Chain Affinity doubles the stat term, forces the critical hit, spends all TP,
 * and a connecting hit opens Compression, then Reverberation.
 * Attack Down is 38/256, which the page calls 15%, for 60 seconds.
 * A hit always attempts it. The only chance rolled is the magic resist, with
 * no element. A full resist does not lower attack. A half resist shortens
 * the 60 seconds, and the 38/256 stays. A miss does not lower attack.
 * It replaces an Attack Down already on the hare.
 * The enmity box is blank. The cast claims, and the damage adds its own.
 * A connecting hit gives the hare 100 TP.
 * Set bonus HP −5 and MP +10. Defense Bonus is 4 trait points and 3 set points.
 * With Grand Slam, 4 trait points and 2 set points, the trait is +10 defense.
 * Neither spell grants it alone.
 * It breaks Mazurka. Burst Affinity is not spent.
 * Learned from Ghost at Blue Magic 92+. Granted until a Ghost is in the yard.
 */
export const TERROR_FTP = 1.5;
export const TERROR_MULT = 1.05;
export const TERROR_CAP = 41;
export const TERROR_ATTACK_NUMER = 38;
export const TERROR_ATTACK_SECONDS = 60;

export const TERROR_TOUCH = {
  kind: "physical",
  name: "Terror Touch",
  level: 40,
  mp: 62,
  points: 3,
  cast: 3.25,
  recast: 21,
  range: 6,
  hits: 1,
  ftp: TERROR_FTP,
  dCap: TERROR_CAP,
  strMod: 0,
  dexMod: 0.2,
  intMod: 0.2,
  hp: -5,
  agi: 0,
  str: 0,
  dex: 0,
  chr: 0,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 0,
  mnd: 0,
  vit: 0,
  setMp: 10,
  defenseTrait: 4,
  chain: "Compression",
  chain2: "Reverberation",
  family: "Ghost",
  learnSkill: blueLearnSkill(40),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Venom Shell. Poisons enemies around you. No direct hit.
 * Level 42, 86 MP, 3 points, cast 3s, recast 45s.
 * The card says AoE and about 6'. This yard uses 6', centered on you.
 * Poison is 6 HP every 3 seconds for 45 seconds. The script's 60 is not used.
 * A full resist does not poison. A half resist shortens the 45 seconds,
 * and the 6 stays. The element is water. There is no damage, so Burst
 * Affinity is not spent and a skillchain is not burst.
 * A stronger poison is left alone. An equal poison is refreshed.
 * Cumulative enmity 1, volatile 320. A hare inside the area is claimed.
 * Set bonus MND +2. Clear Mind is 4 trait points and 3 set points.
 * With Mind Blast, Poison Breath, or Soporific, the trait's 8 points and
 * 3 set points are met. This spell alone does not grant it.
 * It breaks Mazurka. Learned from Uragnite at Blue Magic 98+.
 * Granted until an Uragnite is in the yard.
 */
export const VENOM_RADIUS = 6;
export const VENOM_POISON = 6;
export const VENOM_SECONDS = 45;
export const VENOM_CE = 1;
export const VENOM_VE = 320;

export const VENOM_SHELL = {
  kind: "venom",
  name: "Venom Shell",
  level: 42,
  mp: 86,
  points: 3,
  cast: 3,
  recast: 45,
  radius: VENOM_RADIUS,
  poison: VENOM_POISON,
  seconds: VENOM_SECONDS,
  hp: 0,
  agi: 0,
  str: 0,
  dex: 0,
  chr: 0,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 0,
  mnd: 2,
  vit: 0,
  clearTrait: 4,
  ce: VENOM_CE,
  ve: VENOM_VE,
  family: "Uragnite",
  learnSkill: blueLearnSkill(42),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Geist Wall. Removes one beneficial magic effect around you.
 * Dark. Level 46, 35 MP, 3 points, cast 3s, recast 30s, range 6'.
 * The area is centered on you. It is not a gaze. The target does not
 * have to face you, and you do not have to face the target.
 * There is no damage. Burst Affinity is not spent. The script can
 * magic burst on Compression, Gravitation, and Darkness, and there is
 * nothing to multiply, so the window stays closed.
 * The resist is dark, Blue Magic skill plus dINT. The script's
 * threshold is 0.5, so a half resist still dispels and a quarter
 * resist does not. The hare has no beneficial effect, so a connecting
 * cast still logs that there is nothing to remove.
 * Cumulative enmity 320, volatile 320, when the hare is in the area,
 * including a resist. A hare outside, dead, or charmed adds none.
 * Set bonus HP −5 and MP +10. The script says Combos: None.
 * It breaks Mazurka. Learned from Eft at Blue Magic 110+.
 * Granted until an Eft is in the yard.
 */
export const GEIST_RADIUS = 6;
export const GEIST_CE = 320;
export const GEIST_VE = 320;

export const GEIST_WALL = {
  kind: "geist",
  name: "Geist Wall",
  level: 46,
  mp: 35,
  points: 3,
  cast: 3,
  recast: 30,
  radius: GEIST_RADIUS,
  hp: -5,
  agi: 0,
  str: 0,
  dex: 0,
  chr: 0,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 0,
  mnd: 0,
  vit: 0,
  setMp: 10,
  ce: GEIST_CE,
  ve: GEIST_VE,
  family: "Eft",
  learnSkill: blueLearnSkill(46),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Awful Eye. STR Down in a fan in front of you. Water gaze.
 * Level 46, 32 MP, 2 points, cast 2.5s, recast 60s.
 * The card leaves the range blank. A blank cone in this yard is the
 * Poison Breath fan, 10' and 45° each side of where you are facing.
 * The target must be facing you. You must be facing the target.
 * A gaze from behind does not land.
 * STR Down is −30 and decays by 1 every second. The script stores
 * power 30, tick 1, and duration 30. The card prints that −30 and
 * 30 seconds. STR cannot fall under 0. A half resist shortens the 30.
 * A full resist, and a quarter resist, do not land. The script's
 * threshold is 0.5, so a half resist still lands. It refreshes its
 * own STR Down. It does not touch Bubble Shower.
 * Magic accuracy is Blue Magic skill plus dMND. The element is water.
 * There is no damage, so Burst Affinity is not spent. Water would
 * match Reverberation, Distortion, and Darkness.
 * Cumulative enmity 1, volatile 180, when the gaze connects, including
 * a resist. A target behind you, outside the fan, dead, or charmed
 * adds none.
 * Set bonus MND +1. Clear Mind is 4 trait points and 2 set points.
 * The trait needs 8 trait points and 3 set points. With Poison Breath,
 * Venom Shell, Mind Blast, or Soporific, the trait appears. This
 * spell alone does not grant it.
 * It breaks Mazurka. Learned from Bugard at Blue Magic 110+.
 * Granted until a Bugard is in the yard.
 */
export const AWFUL_RANGE = 10;
export const AWFUL_STR = 30;
export const AWFUL_SECONDS = 30;
export const AWFUL_TICK = 1;
export const AWFUL_CE = 1;
export const AWFUL_VE = 180;

export const AWFUL_EYE = {
  kind: "awful",
  name: "Awful Eye",
  level: 46,
  mp: 32,
  points: 2,
  cast: 2.5,
  recast: 60,
  range: AWFUL_RANGE,
  seconds: AWFUL_SECONDS,
  strDown: AWFUL_STR,
  tick: AWFUL_TICK,
  hp: 0,
  agi: 0,
  str: 0,
  dex: 0,
  chr: 0,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 0,
  mnd: 1,
  vit: 0,
  clearTrait: 4,
  ce: AWFUL_CE,
  ve: AWFUL_VE,
  family: "Bugard",
  learnSkill: blueLearnSkill(46),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Blood Saber. Steals HP from enemies around you.
 * Dark. Ineffective against undead. Level 48, 2 points, cast 4s.
 * The current card is 48 MP and recast 90s. The script header's 25 MP
 * and the older client recast of 26 are not used.
 * The card leaves the range blank. Geist Wall is the other self-centered
 * dark area and prints 6'. This yard uses 6', centered on you.
 * Damage is floor(floor(Blue Magic skill × 0.11) × 3.5). The helper
 * is called with a damage cap of 0, so the 165 cap on MP Drainkiss is
 * not applied. There is no stat term. INT does not add magic accuracy.
 * Magic accuracy is Blue Magic skill alone.
 * The page says elemental affinity changes accuracy and damage.
 * Day, weather, staff, and affinity are not applied, the same way the
 * other blue drains leave them out. Ecosystem correlation is not in
 * the hit.
 * Resist, then a magic burst, then Magic Attack Bonus. Burst Affinity
 * opens a dark magic burst and does not double a stat term. It is spent
 * even on a miss, when nobody is in the area, and on the undead
 * no-effect. Azure Lore does not open the window and is not consumed.
 * Undead take nothing. The Tropical Rarab is a beast, so the drain
 * works. You heal the HP that lands, clamped to the hare's current HP
 * and then to your missing HP.
 * Cumulative enmity 320, volatile 0, when the hare is in the area,
 * including a resist and the undead no-effect.
 * Set bonus HP −5 and MP +5. The script says Combos: None.
 * It breaks Mazurka. Learned from Skeleton at Blue Magic 116+.
 * Granted until a Skeleton is in the yard.
 */
export const SABER_RADIUS = 6;
export const SABER_CE = 320;
export const SABER_VE = 0;

export const BLOOD_SABER = {
  kind: "saber",
  name: "Blood Saber",
  level: 48,
  mp: 48,
  points: 2,
  cast: 4,
  recast: 90,
  radius: SABER_RADIUS,
  dmgMult: 3.5,
  hp: -5,
  agi: 0,
  str: 0,
  dex: 0,
  chr: 0,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 0,
  mnd: 0,
  vit: 0,
  setMp: 5,
  ce: SABER_CE,
  ve: SABER_VE,
  family: "Skeleton",
  learnSkill: blueLearnSkill(48),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Jettatura. Terror in a fan in front of you. Dark gaze.
 * Level 48, 37 MP, 4 points, cast 0.5s, recast 120s, range 9'.
 * The fan is 45° each side of where you are facing. The target must
 * be facing you. You must be facing the target.
 * The card prints about 2 seconds. The script stores 5. This yard
 * uses 2. A half resist shortens the 2. A full resist, and a quarter
 * resist, do not terrify. The script's threshold is 0.5, so a half
 * resist still lands. Terror stops the hare the way Stun does.
 * A land interrupts a spell the hare has started.
 * There is no damage, so Burst Affinity is not spent. The script can
 * magic burst on Compression, Gravitation, and Darkness.
 * Magic accuracy is Blue Magic skill plus dINT. The element is dark.
 * Enmity is added even when the terror itself does not land. That is
 * a resist in range. A target behind you, outside the fan, dead, or
 * charmed adds none. Cumulative enmity 180, volatile 1020.
 * Set bonus MP +15. The script says Combos: None.
 * It breaks Mazurka. Learned from Hippogryph at Blue Magic 116+.
 * Granted until a Hippogryph is in the yard.
 */
export const JETTA_RANGE = 9;
export const JETTA_SECONDS = 2;
export const JETTA_CE = 180;
export const JETTA_VE = 1020;

export const JETTATURA = {
  kind: "jetta",
  name: "Jettatura",
  level: 48,
  mp: 37,
  points: 4,
  cast: 0.5,
  recast: 120,
  range: JETTA_RANGE,
  seconds: JETTA_SECONDS,
  hp: 0,
  agi: 0,
  str: 0,
  dex: 0,
  chr: 0,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 0,
  mnd: 0,
  vit: 0,
  setMp: 15,
  ce: JETTA_CE,
  ve: JETTA_VE,
  family: "Hippogryph",
  learnSkill: blueLearnSkill(48),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Ice Break. Ice damage around you. Additional effect: Bind.
 * Level 50, 142 MP, 3 points, recast 33.75s.
 * The card prints a 5 second cast. The client and the script header
 * store 5.25. This yard uses 5.25.
 * The card leaves the range blank. The self-centered blue areas this
 * yard already reads as 6' are the shape. This yard uses 6', centered
 * on you. It is not a fan.
 * The base is level + 2, capped at 69. At 75 that term is 69.
 * The stat term is 30% of INT times the level alpha. Burst Affinity
 * doubles that term and is spent, even on a miss or when nobody is
 * in the area. The script sets no Azure bonus, so Azure Lore leaves
 * the coefficient at 2.25. It does not open a magic burst and is not
 * consumed. dINT is multiplied by 1. The script does not set a half
 * cap or a floor, so the defaults apply: anything above 999 counts
 * for half, and the term cannot fall under −399.
 * Ice matches Induration, Distortion, Darkness, and Umbra.
 * Day, weather, staff, affinity, and ecosystem correlation are not
 * applied. Magic Attack Bonus is the step after the resist floor.
 * Bind is 30 seconds. The card leaves the duration blank. The script
 * stores 30. Damage lands first and removes a Bind already up. The
 * new Bind is a second resist, attempted only when the hit dealt
 * damage. A half resist shortens the 30. A quarter resist does not
 * bind. The element of that roll is ice.
 * Set bonus INT +1. Magic Defense Bonus is 4 trait points and 3 set
 * points. With Magnetite Cloud, 4 trait points and 3 set points, the
 * trait is +10, and only at Blue Mage 50 or higher. Neither spell
 * grants it alone.
 * The enmity box is blank. A hare inside the area is claimed. A
 * connecting hit gives the hare 100 TP. It breaks Mazurka.
 * Learned from Golem at Blue Magic 122+. Granted until a Golem is
 * in the yard.
 */
export const ICE_BREAK_RADIUS = 6;
export const ICE_BREAK_FTP = 2.25;
export const ICE_BREAK_CAP = 69;
export const ICE_BREAK_HALF = 999;
export const ICE_BREAK_LOW = -399;
export const ICE_BREAK_BIND = 30;

export const ICE_BREAK = {
  kind: "ice",
  name: "Ice Break",
  level: 50,
  mp: 142,
  points: 3,
  cast: 5.25,
  recast: 33.75,
  radius: ICE_BREAK_RADIUS,
  ftp: ICE_BREAK_FTP,
  intMod: 0.3,
  dStat: 1,
  dCap: ICE_BREAK_CAP,
  half: ICE_BREAK_HALF,
  low: ICE_BREAK_LOW,
  bind: ICE_BREAK_BIND,
  hp: 0,
  agi: 0,
  str: 0,
  dex: 0,
  chr: 0,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 1,
  mnd: 0,
  vit: 0,
  mdbTrait: 4,
  family: "Golem",
  learnSkill: blueLearnSkill(50),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Self-Destruct. Fire damage around you. You are left at 1 HP.
 * Level 50, 100 MP, 3 points, cast 3.25s, recast 21s.
 * The card leaves the range blank. The self-centered blue areas this
 * yard already reads as 6' are the shape. It is not a fan.
 * Damage before a resist is current HP − 1. A caster already at 1 HP
 * deals nothing, does not gain Weakness, and does not change HP.
 * The hit resists with Blue Magic skill and dINT. Burst Affinity can
 * magic burst it. Fire matches Liquefaction, Fusion, Light, and Radiance.
 * Magic Attack Bonus, day, weather, and staff are not applied. The wiki
 * line that the damage seems affected by nothing else is the reason those
 * stay out. A resist still lands, which is the tested retail behavior.
 * Azure Lore does not open the window. Burst Affinity is spent even on
 * a miss, when the hare is outside the area, when it is a pet, when it
 * is dead, and when you were already at 1 HP.
 * If you had more than 1 HP, current HP becomes 1 and Weakness is 300
 * seconds even when the hare is out of range, dead, charmed, or the hit
 * resists. The script deletes Weakness and adds it again, so a doubled
 * Weakness from Raise becomes a normal Weakness and the five minutes
 * start over. It does not use the raise rule that doubles Weakness.
 * Maximum HP is not cut. Only weapon delay doubles.
 * The enmity box is blank. A hare inside the area is claimed. A
 * connecting hit gives the hare 100 TP. It breaks Mazurka.
 * Set bonus STR +2. Auto Refresh is 2 trait points and 3 set points.
 * The trait needs 8 trait points and 8 set points. This spell alone
 * does not grant it. With Frightful Roar and Actinic Burst it does.
 * Learned from Bomb at Blue Magic 122+. Granted until a Bomb is in the yard.
 */
export const SELF_DESTRUCT_RADIUS = 6;

export const SELF_DESTRUCT = {
  kind: "destruct",
  name: "Self-Destruct",
  level: 50,
  mp: 100,
  points: 3,
  cast: 3.25,
  recast: 21,
  radius: SELF_DESTRUCT_RADIUS,
  hp: 0,
  agi: 0,
  str: 2,
  dex: 0,
  chr: 0,
  refreshTrait: 2,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 0,
  mnd: 0,
  vit: 0,
  family: "Bomb",
  learnSkill: blueLearnSkill(50),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Frightful Roar. Wind Defense Down around you.
 * Level 50, 32 MP, 3 points, cast 2s, recast 20s.
 * The card leaves the range blank. It is not a fan. This yard uses 6',
 * the same self-centered area Ice Break uses.
 * The script's power is 10. The wiki's 10% is 26/256. This yard stores
 * 26/256 so a cut in (0, 1) is that fraction, not the default 25%.
 * Duration is 180 seconds. It does not tick. A half resist shortens the
 * 180. A full resist, and a quarter resist, do not land. The script's
 * resist threshold is 0.5.
 * A stronger Defense Down is left alone. Jump's 20% and a Defense Down
 * with no stored power, which is 25%, are both stronger. An equal or
 * weaker cut is replaced.
 * There is no damage, so Burst Affinity is not spent. Wind would match
 * Detonation, Fragmentation, Light, and Radiance.
 * Cumulative enmity 1, volatile 320, when the hare is in the area,
 * including a resist. It breaks Mazurka.
 * Set bonus AGI +2. Auto Refresh is 2 trait points and 3 set points.
 * With Self-Destruct and Actinic Burst the trait is 1 MP a tick.
 * This spell alone does not grant it.
 * Learned from Taurus at Blue Magic 122+. Granted until a Taurus is in the yard.
 */
export const FRIGHTFUL_RADIUS = 6;
export const FRIGHTFUL_SECONDS = 180;
export const FRIGHTFUL_DEF = 26 / 256;
export const FRIGHTFUL_CE = 1;
export const FRIGHTFUL_VE = 320;

export const FRIGHTFUL_ROAR = {
  kind: "roar",
  name: "Frightful Roar",
  level: 50,
  mp: 32,
  points: 3,
  cast: 2,
  recast: 20,
  radius: FRIGHTFUL_RADIUS,
  seconds: FRIGHTFUL_SECONDS,
  defense: FRIGHTFUL_DEF,
  hp: 0,
  agi: 2,
  str: 0,
  dex: 0,
  chr: 0,
  refreshTrait: 2,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 0,
  mnd: 0,
  vit: 0,
  ce: FRIGHTFUL_CE,
  ve: FRIGHTFUL_VE,
  family: "Taurus",
  learnSkill: blueLearnSkill(50),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Cold Wave. Ice Frost around you. The header says a cone of
 * ice damage. The script deals none, and the area is not a cone.
 * Level 52, 37 MP, 1 point, cast 4s, recast 60s.
 * This yard uses 6', centered on you, the same shape as Ice Break.
 * Frost cannot land while Burn is up. A land removes Choke. Burn and
 * Choke are not otherwise in the yard.
 * The duration is 60 seconds. A half resist shortens it. A full resist,
 * and a quarter resist, do not land. The script's resist threshold is 0.5.
 * The status power the script passes is the damage-over-time, not the
 * AGI down. AGI down is (power − 1) × 2 + 5. The DoT is
 * clamp(floor((level / 2 − 3) / 2), 0, 23), and level / 2 is clamped
 * to 49 before that. At 75 the DoT is 17 and AGI falls by 37.
 * The tick is 3 seconds. Regen down equals that DoT. The hare has no
 * regen, so regen down is not applied.
 * Magic accuracy is Blue Magic skill plus dINT. The element is ice.
 * There is no direct hit, so Burst Affinity is not spent. Ice would
 * match Induration, Distortion, Darkness, and Umbra.
 * The enmity box is blank. A hare inside the area is claimed.
 * It breaks Mazurka.
 * Set bonus INT −1. Auto Refresh is 1 trait point and 1 set point.
 * This spell alone does not grant it, and it does not finish the trait
 * with Self-Destruct or Frightful Roar.
 * Learned from Snoll at Blue Magic 132+. Granted until a Snoll is in the yard.
 */
export const COLD_RADIUS = 6;
export const COLD_SECONDS = 60;

export const COLD_WAVE = {
  kind: "cold",
  name: "Cold Wave",
  level: 52,
  mp: 37,
  points: 1,
  cast: 4,
  recast: 60,
  radius: COLD_RADIUS,
  seconds: COLD_SECONDS,
  hp: 0,
  agi: 0,
  str: 0,
  dex: 0,
  chr: 0,
  refreshTrait: 1,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: -1,
  mnd: 0,
  vit: 0,
  family: "Snoll",
  learnSkill: blueLearnSkill(52),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Filamented Hold. Earth Slow in a fan in front of you.
 * Level 52, 38 MP, 3 points, cast 2s, recast 20s.
 * Not a gaze. You must face the cone. The hare does not have to face you.
 * The card prints about 9'. Awful Eye is the same client range column and
 * uses 10' only because its card was blank. This yard uses 9'.
 * The script's Slow power is 2500. Sprout Smack stores 1500 as 150/1024.
 * This yard stores 250/1024. Duration is 90 seconds. A half resist
 * shortens it. A full resist, and a quarter resist, do not land.
 * Slow II, or a Slow whose power is above 250, stays. An equal or weaker
 * Slow is replaced. The wiki says this spell does not overwrite Sprout
 * Smack. The script's 2500 is stronger than Sprout Smack's 1500, so
 * potency wins here.
 * There is no damage, so Burst Affinity is not spent. Earth would match
 * Scission, Gravitation, Darkness, and Umbra.
 * Cumulative enmity 1, volatile 320, when the hare is in the fan,
 * including a resist. It breaks Mazurka.
 * Set bonus VIT +1. Clear Mind is 4 trait points and 3 set points.
 * With Poison Breath the trait is +3 while resting. This spell alone
 * does not grant it.
 * Learned from Diremite at Blue Magic 132+. Granted until a Diremite is in the yard.
 */
export const HOLD_RANGE = 9;
export const HOLD_SECONDS = 90;
export const HOLD_SLOW = 250;
export const HOLD_CE = 1;
export const HOLD_VE = 320;

export const FILAMENTED_HOLD = {
  kind: "hold",
  name: "Filamented Hold",
  level: 52,
  mp: 38,
  points: 3,
  cast: 2,
  recast: 20,
  range: HOLD_RANGE,
  seconds: HOLD_SECONDS,
  slow: HOLD_SLOW,
  hp: 0,
  agi: 0,
  str: 0,
  dex: 0,
  chr: 0,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 0,
  mnd: 0,
  vit: 1,
  clearTrait: 4,
  ce: HOLD_CE,
  ve: HOLD_VE,
  family: "Diremite",
  learnSkill: blueLearnSkill(52),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Hecatomb Wave. Wind breath in a fan in front of you.
 * Additional effect: Blind.
 * Level 54, 116 MP, 3 points, cast 5.25s, recast 33.75s.
 * The client stores the same range column as Poison Breath, so this
 * yard uses that spell's 10' fan, 45° each side.
 * Damage is current HP / 4 + main level / 1.5. The wiki's sum matches
 * the script. Magic Attack Bonus is not applied. Day, weather, staff,
 * affinity, and breath damage dealt are not applied.
 * Dragons would take 25% more. The Tropical Rarab is not a dragon, so
 * that bonus is not rolled. Beastmen correlation is likewise unused.
 * Burst Affinity can magic burst it. Wind matches Detonation,
 * Fragmentation, Light, and Radiance. Azure Lore does not open the
 * window and does not change the breath. Burst Affinity is spent even
 * on a miss or when the target is outside the fan.
 * Blind is accuracy −20 for 60 seconds, and only when the breath deals
 * damage. A quarter resist does not blind. A half resist shortens the
 * 60. The second roll has no attribute, because a breath additional
 * effect sets the stat to 0. The element is wind. Blind II, or a Blind
 * whose accuracy down is above 20, stays. An equal Blind is refreshed.
 * The enmity box is blank. A hare in the fan is claimed. A connecting
 * hit gives the hare 100 TP, the same way Poison Breath does. It breaks
 * Mazurka.
 * Set bonus AGI +1. Max MP Boost is 4 trait points and 3 set points.
 * With Metallic Body the trait is +10 MP at Blue Mage 40. This spell
 * alone does not grant it.
 * Learned from Demon at Blue Magic 142+. Granted until a Demon is in the yard.
 */
export const HECATOMB_RANGE = 10;
export const HECATOMB_BLIND = 20;
export const HECATOMB_BLIND_SECONDS = 60;

export const HECATOMB_WAVE = {
  kind: "breath",
  name: "Hecatomb Wave",
  level: 54,
  mp: 116,
  points: 3,
  cast: 5.25,
  recast: 33.75,
  range: HECATOMB_RANGE,
  hpMod: 4,
  lvlMod: 1.5,
  blind: HECATOMB_BLIND,
  blindSeconds: HECATOMB_BLIND_SECONDS,
  element: "wind",
  hp: 0,
  agi: 1,
  str: 0,
  dex: 0,
  chr: 0,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 0,
  mnd: 0,
  vit: 0,
  mpTrait: 4,
  family: "Demon",
  learnSkill: blueLearnSkill(54),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Radiant Breath. Light breath in a fan in front of you.
 * Additional effect: Slow and Silence.
 * Level 54, 116 MP, 4 points, cast 5.25s, recast 33.75s, range 13'.
 * The fan is 45° each side of where you are facing.
 * Damage is current HP / 5 + main level / 0.75. The wiki's sum matches
 * the script. Magic Attack Bonus is not applied. Day, weather, staff,
 * affinity, and breath damage dealt are not applied.
 * Demons would take 25% more. The Tropical Rarab is not a demon, so
 * that bonus is not rolled.
 * Burst Affinity can magic burst it. Light matches Transfixion, Fusion,
 * Light, and Radiance. Azure Lore does not open the window and does not
 * change the breath. Burst Affinity is spent even on a miss or when the
 * target is outside the fan.
 * Slow and Silence last 90 seconds. The script stores 60. This yard uses
 * the card. Slow's power is the script's 2500, stored as 250/1024, the
 * same scale as Filamented Hold. Silence has no potency. The script's 25
 * is not used. Both are attempted only when the breath deals damage, and
 * each is its own roll. A quarter resist does not land that status. A
 * half resist shortens the 90. The second rolls have no attribute. The
 * element is light. Slow II, or a Slow whose power is above 250, stays.
 * The enfeebling Silence spell stays. Chaotic Eye's Silence is replaced.
 * The enmity box is blank. A hare in the fan is claimed. A connecting
 * hit gives the hare 100 TP. It breaks Mazurka.
 * Set bonus CHR +1 and HP +5. The script says Combos: None.
 * Learned from Wyvern at Blue Magic 142+. Granted until a Wyvern is in the yard.
 */
export const RADIANT_RANGE = 13;
export const RADIANT_SLOW = 250;
export const RADIANT_SLOW_SECONDS = 90;
export const RADIANT_SILENCE_SECONDS = 90;

export const RADIANT_BREATH = {
  kind: "breath",
  name: "Radiant Breath",
  level: 54,
  mp: 116,
  points: 4,
  cast: 5.25,
  recast: 33.75,
  range: RADIANT_RANGE,
  hpMod: 5,
  lvlMod: 0.75,
  slow: RADIANT_SLOW,
  slowSeconds: RADIANT_SLOW_SECONDS,
  silenceSeconds: RADIANT_SILENCE_SECONDS,
  element: "light",
  hp: 5,
  agi: 0,
  str: 0,
  dex: 0,
  chr: 1,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 0,
  mnd: 0,
  vit: 0,
  family: "Wyvern",
  learnSkill: blueLearnSkill(54),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Feather Barrier. Evasion Boost on yourself.
 * Level 56, 29 MP, 2 points, cast 2s, recast 120s.
 * The status is +25 evasion for 30 seconds. The script stores 20.
 * Ophannus's test on the page is +25, and that is what is used.
 * It refreshes its own Evasion Boost. Diffusion is a locked merit, so
 * the duration stays 30.
 * There is no damage, so Burst Affinity is not spent. Wind would match
 * Detonation, Fragmentation, Light, and Radiance.
 * Cumulative enmity 1, volatile 300. It does not claim. It does not
 * break Mazurka.
 * No stat bonus. Resist Gravity is 4 trait points and 2 set points.
 * The trait needs 8 trait points and 3 set points, and tier I is level 69
 * for 10%. Setting it with Regurgitation grants the trait. This spell
 * alone does not. Nothing here weighs you, so the trait is not rolled.
 * Learned from Greater Bird at Blue Magic 152+. Granted until a Greater Bird is in the yard.
 */
export const FEATHER_SECONDS = 30;
export const FEATHER_EVASION = 25;
export const FEATHER_CE = 1;
export const FEATHER_VE = 300;

export const FEATHER_BARRIER = {
  kind: "feather",
  name: "Feather Barrier",
  level: 56,
  mp: 29,
  points: 2,
  cast: 2,
  recast: 120,
  seconds: FEATHER_SECONDS,
  evasion: FEATHER_EVASION,
  hp: 0,
  agi: 0,
  str: 0,
  dex: 0,
  chr: 0,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 0,
  mnd: 0,
  vit: 0,
  gravityTrait: 4,
  ce: FEATHER_CE,
  ve: FEATHER_VE,
  family: "Roc",
  learnSkill: blueLearnSkill(56),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Flying Hip Press. Wind breath in a circle around you.
 * Level 58, 125 MP, 3 points, cast 5.75s, recast 34.5s.
 * Unlike the other breaths, it is not a fan. The card leaves the range
 * blank. This yard uses a 10' circle, the same reach as Poison Breath's
 * fan, centered on you.
 * Damage is current HP / 3. The level term is 0, so it is not divided.
 * The wiki's product is not used. Magic Attack Bonus is not applied.
 * Gamer Escape says a magic burst does not change the damage, only the
 * accuracy. This yard does not spend Burst Affinity and does not multiply
 * the hit. Wind would match Detonation, Fragmentation, Light, and Radiance.
 * Azure Lore does not change the breath.
 * No additional effect. Beastmen correlation is not rolled.
 * The enmity box is blank. A hare inside the circle is claimed. A
 * connecting hit gives the hare 100 TP. It breaks Mazurka.
 * Set bonus AGI +1. Max HP Boost is 4 trait points and 3 set points.
 * The trait needs 8 trait points and 5 set points, and tier I is level 62
 * for +30 HP. Body Slam is 4 and 4. Frypan is 4 and 3. This spell with
 * either of those grants it. This spell alone does not.
 * Learned from Bugbear at Blue Magic 162+. Granted until a Bugbear is in the yard.
 */
export const HIP_RANGE = 10;

export const FLYING_HIP_PRESS = {
  kind: "breath",
  name: "Flying Hip Press",
  level: 58,
  mp: 125,
  points: 3,
  cast: 5.75,
  recast: 34.5,
  range: HIP_RANGE,
  hpMod: 3,
  lvlMod: 0,
  radial: true,
  noBurst: true,
  element: "wind",
  hp: 0,
  agi: 1,
  str: 0,
  dex: 0,
  chr: 0,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 0,
  mnd: 0,
  vit: 0,
  hpTrait: 4,
  family: "Bugbear",
  learnSkill: blueLearnSkill(58),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Light of Penance. Light gaze. TP down, then Blind and Bind.
 * Level 58, 53 MP, 5 points, cast 3s, recast 60s, range 15'.
 * It is not a cone. You do not have to face the enemy. The enemy must
 * be facing you. The script also requires you to face them, and it
 * deletes TP before that check. Neither is used.
 * There is no damage, so Burst Affinity is not spent. Light would match
 * Transfixion, Fusion, Light, and Radiance.
 * Magic accuracy is Blue Magic skill plus dINT. The element is light.
 * A full resist, and a quarter resist, do not cut TP and do not blind
 * or bind. A half resist still does, and it shortens the 30 seconds.
 * A connecting land removes 100 TP, floored at 0. The cut is not a
 * duration, so a half resist does not shrink it.
 * Blind is accuracy −100. The script's power 10 is not used. Blind II,
 * or a Blind whose accuracy down is above 100, stays. Bind uses the
 * same 30 seconds. The script's resist threshold is 0.5.
 * Cumulative enmity 1, volatile 640, when the gaze connects, including
 * a resist. A target that is not facing you, out of range, dead, or
 * charmed adds none and loses no TP. It breaks Mazurka.
 * Set bonus CHR +1 and HP +15. Auto Refresh is 2 trait points and 5 set
 * points. The trait needs 8 trait points and 8 set points. This spell
 * alone does not grant it. Actinic Burst with Self-Destruct and this
 * spell does.
 * Learned from Tonberry at Blue Magic 162+. Granted until a Tonberry is in the yard.
 */
export const PENANCE_RANGE = 15;
export const PENANCE_SECONDS = 30;
export const PENANCE_BLIND = 100;
export const PENANCE_TP = 100;
export const PENANCE_CE = 1;
export const PENANCE_VE = 640;

export const LIGHT_OF_PENANCE = {
  kind: "penance",
  name: "Light of Penance",
  level: 58,
  mp: 53,
  points: 5,
  cast: 3,
  recast: 60,
  range: PENANCE_RANGE,
  seconds: PENANCE_SECONDS,
  accDown: PENANCE_BLIND,
  tpCut: PENANCE_TP,
  hp: 15,
  agi: 0,
  str: 0,
  dex: 0,
  chr: 1,
  refreshTrait: 2,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 0,
  mnd: 0,
  vit: 0,
  ce: PENANCE_CE,
  ve: PENANCE_VE,
  family: "Tonberry",
  learnSkill: blueLearnSkill(58),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Death Scissors. One slashing hit. Damage varies with TP.
 * Level 60, 51 MP, 5 points, cast 0.5s, recast 24.5s.
 * The range box is blank. This yard uses 3', the same reach as
 * Mandibular Bite.
 * The stat term is 60% of STR. The skill term is not capped. The
 * script's base cap of 999 does not bind. At Blue Magic 276 the skill
 * term is 63.
 * The weapon-skill coefficient stays 1.5 until Chain Affinity or Azure
 * Lore is up, even though the card says damage varies with TP. Chain
 * Affinity walks 1.5 at 0 TP, 2.75 at 1500, and 3.25 at 3000. It doubles
 * the stat term, forces the critical hit, and spends all TP, including
 * when the hit misses. Azure Lore uses the 3500 anchor, 844/256. The
 * script's 3.3 is the rounded form and is not used. Azure Lore does not
 * itself double the stat term or force a critical hit, and it is not
 * consumed.
 * The attack multiplier stays 1.7. It does not walk with TP.
 * A connecting hit can open Compression, and then Reverberation. A miss
 * does not skillchain.
 * The enmity box is blank. The cast claims, and the damage adds its own
 * enmity. A connecting hit gives the target 100 TP. It breaks Mazurka.
 * Burst Affinity is not spent.
 * Set bonus MND +2, CHR +2, and HP +5. Attack Bonus is 4 trait points
 * and 5 set points. With Uppercut, or with Battle Dance, the trait is
 * +10. This spell alone does not grant it.
 * Learned from Scorpion at Blue Magic 172+. Granted until a Scorpion is in the yard.
 */
export const DEATH_RANGE = 3;
export const DEATH_FTP = [1.5, 2.75, 3.25] as const;
export const DEATH_FTP_AZURE = 844 / 256;
export const DEATH_ATTACK = 1.7;

export const DEATH_SCISSORS = {
  kind: "physical",
  name: "Death Scissors",
  level: 60,
  mp: 51,
  points: 5,
  cast: 0.5,
  recast: 24.5,
  range: DEATH_RANGE,
  hits: 1,
  ftp: DEATH_FTP[0],
  dCap: 999,
  strMod: 0.6,
  dexMod: 0,
  hp: 5,
  agi: 0,
  str: 0,
  dex: 0,
  chr: 2,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 4,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 0,
  mnd: 2,
  vit: 0,
  chain: "Compression",
  chain2: "Reverberation",
  family: "Scorpion",
  learnSkill: blueLearnSkill(60),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Dimensional Death. One blunt hit. Damage varies with TP.
 * Level 60, 48 MP, 5 points, cast 0.5s, recast 23.75s.
 * The range box is blank. The client stores 30, so this yard uses 3'.
 * The stat term is 50% of STR. The skill term is not capped. The
 * script's base cap of 999 does not bind. At Blue Magic 276 the skill
 * term is 63.
 * The weapon-skill coefficient stays 2.25 at every tier, including
 * Chain Affinity and Azure Lore. The card's TP clause is the attack,
 * not the coefficient. Attack is ×1.2 until Chain Affinity or Azure
 * Lore is up. Chain Affinity walks 1.2 at 0 TP, 2.2 at 1500, and 2.25
 * at 3000. It doubles the stat term, forces the critical hit, and spends
 * all TP, including when the hit misses. Azure Lore sets the attack to
 * 2.3 and wins over Chain Affinity. It does not itself double the stat
 * term or force a critical hit, and it is not consumed. Raw TP does not
 * walk the attack. The script's tpMod.ATTACK is unused as a general
 * switch. This spell writes the multiplier itself.
 * A connecting hit opens Transfixion, and then Impaction. The card
 * prints Impaction only. The script stores both, and this yard uses both.
 * A miss does not skillchain. No additional status.
 * The enmity box is blank. The cast claims, and the damage adds its own
 * enmity. A connecting hit gives the target 100 TP. It breaks Mazurka.
 * Burst Affinity is not spent.
 * Set bonus DEX +1, CHR +1, and HP +5. Accuracy Bonus is 4 trait points
 * and 5 set points. With Frenetic Rip, or with Disseverment, the trait
 * is +10. This spell alone does not grant it.
 * Learned from Fomor at Blue Magic 172+. A Shadow stands in for that
 * family. Granted until a Shadow is in the yard.
 */
export const DIMENSION_RANGE = 3;
export const DIMENSION_FTP = 2.25;
export const DIMENSION_ATTACK = [1.2, 2.2, 2.25] as const;
export const DIMENSION_ATTACK_AZURE = 2.3;

export const DIMENSIONAL_DEATH = {
  kind: "physical",
  name: "Dimensional Death",
  level: 60,
  mp: 48,
  points: 5,
  cast: 0.5,
  recast: 23.75,
  range: DIMENSION_RANGE,
  hits: 1,
  ftp: DIMENSION_FTP,
  dCap: 999,
  strMod: 0.5,
  dexMod: 0,
  hp: 5,
  agi: 0,
  str: 0,
  dex: 1,
  chr: 1,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 4,
  sleepTrait: 0,
  int: 0,
  mnd: 0,
  vit: 0,
  chain: "Transfixion",
  chain2: "Impaction",
  family: "Shadow",
  learnSkill: blueLearnSkill(60),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Spiral Spin. One slashing hit. Additional effect: Accuracy Down.
 * Level 60, 39 MP, 3 points, cast 4s, recast 45s. The client cast of
 * 2.5 seconds is not used. The card prints 4. The card's range is 15'.
 * The client stores 120, which this yard would read as 12'. The card wins.
 * The stat term is 30% of AGI. The skill term is not capped.
 * The weapon-skill coefficient stays 2.0 at every tier, including Chain
 * Affinity and Azure Lore. Attack stays ×1. Chain Affinity doubles the
 * stat term, forces the critical hit, and spends all TP. A connecting
 * hit opens Transfixion.
 * Accuracy Down is −15. The card prints 45–60 seconds. The script stores
 * 60. tpMod.DURATION is unused, so the duration does not walk with TP,
 * and the chance does not either. A hit always attempts it. The only
 * miss is the magic resist, with no element. A full resist does not
 * lower accuracy. A half resist shortens the 60 seconds, and the −15
 * stays. A miss does not. A stronger Accuracy Down is left alone. An
 * equal one is refreshed. It ignores shadows. The hare has none, so
 * that clause is not rolled.
 * The enmity box is blank. The cast claims, and the damage adds its own
 * enmity. It breaks Mazurka. Burst Affinity is not spent.
 * Set bonus STR +1 and HP +5. Plantoid Killer is 4 trait points and 3
 * set points. With Power Attack, or with Mandibular Bite, the trait is
 * +8% damage dealt to plantoids. This spell alone does not grant it.
 * Learned from Ladybug at Blue Magic 172+. Granted until a Ladybug is
 * in the yard. Ladybugs ready it only in the daytime. The yard does not
 * gate the spell on the clock once it is known.
 */
export const SPIRAL_RANGE = 15;
export const SPIRAL_FTP = 2;
export const SPIRAL_ACC = 15;
export const SPIRAL_SECONDS = 60;

export const SPIRAL_SPIN = {
  kind: "physical",
  name: "Spiral Spin",
  level: 60,
  mp: 39,
  points: 3,
  cast: 4,
  recast: 45,
  range: SPIRAL_RANGE,
  hits: 1,
  ftp: SPIRAL_FTP,
  dCap: 999,
  strMod: 0,
  dexMod: 0,
  agiMod: 0.3,
  hp: 5,
  agi: 0,
  str: 1,
  dex: 0,
  chr: 0,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 0,
  mnd: 0,
  vit: 0,
  plantTrait: 4,
  chain: "Transfixion",
  family: "Ladybug",
  learnSkill: blueLearnSkill(60),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Maelstrom. Water damage around you. Additional effect: STR Down.
 * Level 61, 162 MP, 5 points, cast 6s, recast 39s.
 * The range box is blank. The client stores radius 50, so this yard uses
 * 5', centered on you, not on the target.
 * The base is your level + 2, and it stops at 69. At 75 that term is 69.
 * The stat term is 30% of INT and 10% of MND, times the level alpha, not
 * floored per stat. Burst Affinity doubles that term and is spent, even
 * on a miss or when nobody is in the area. It does not change 2.375.
 * dINT is multiplied by 1.5. The script sets no half cap and no floor, so
 * anything above 999 counts for half, and the term cannot fall under −399.
 * Azure Lore does not add to the coefficient and does not open a magic
 * burst. Water matches Reverberation, Distortion, Darkness, and Umbra.
 * STR Down is −20 for 60 seconds. It does not tick. It lands only when
 * the hit deals damage. A full resist, or a hit of 0, does not lower STR.
 * A half resist shortens the 60 seconds, and the −20 stays. A stronger
 * STR Down is left alone. It is an attribute down, so it replaces a
 * weaker or equal one. It does not stack.
 * The enmity box is blank, and the client row is 0 and 0. A hare inside
 * the area is claimed. No fixed hate is added. It breaks Mazurka. Chain
 * Affinity is not spent.
 * Set bonus MND +2. Clear Mind is 4 trait points and 5 set points. With
 * Poison Breath, the trait is +3 while resting. This spell alone does
 * not grant it.
 * Learned from Sea Monk at Blue Magic 176+. Granted until a Sea Monk is
 * in the yard.
 */
export const MAEL_RADIUS = 5;
export const MAEL_FTP = 2.375;
export const MAEL_CAP = 69;
export const MAEL_HALF = 999;
export const MAEL_LOW = -399;
export const MAEL_STR = 20;
export const MAEL_SECONDS = 60;

export const MAELSTROM = {
  kind: "mael",
  name: "Maelstrom",
  level: 61,
  mp: 162,
  points: 5,
  cast: 6,
  recast: 39,
  radius: MAEL_RADIUS,
  ftp: MAEL_FTP,
  intMod: 0.3,
  mndMod: 0.1,
  dStat: 1.5,
  dCap: MAEL_CAP,
  half: MAEL_HALF,
  low: MAEL_LOW,
  strDown: MAEL_STR,
  seconds: MAEL_SECONDS,
  hp: 0,
  agi: 0,
  str: 0,
  dex: 0,
  chr: 0,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 0,
  mnd: 2,
  vit: 0,
  clearTrait: 4,
  family: "Sea Monk",
  learnSkill: blueLearnSkill(61),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Eyes On Me. Dark damage to one enemy.
 * Level 61, 112 MP, 4 points, cast 4.5s, recast 29.25s.
 * The card prints about 13'. The client stores 120, which this yard
 * would read as 12'. The card wins.
 * The base is your level + 2, and it stops at 69. The stat term is 40%
 * of CHR times the level alpha. Burst Affinity doubles that term and is
 * spent, even on a miss or when the target is out of range. It does not
 * change 2.625. Azure Lore adds 2 to the coefficient. It does not double
 * the stat term, it does not open a magic burst, and it is not consumed.
 * dCHR is multiplied by 1.5. The script sets no half cap and no floor, so
 * anything above 999 counts for half, and the term cannot fall under −399.
 * Dark matches Compression, Gravitation, Darkness, and Umbra.
 * No additional status. It ignores shadows and can still be absorbed by
 * Blink. The hare has neither, so neither is rolled. Ecosystem
 * correlation against dragons is not applied.
 * The enmity box is blank, and the client row is 0 and 0. The cast
 * claims, and the damage adds its own enmity. It breaks Mazurka. Chain
 * Affinity is not spent.
 * Set bonus HP −5 and MP +15. Magic Attack Bonus is 4 trait points and
 * 4 set points. With Cursed Sphere, or with Sound Blast, or with
 * Memento Mori, the trait is +20. This spell alone does not grant it.
 * Learned from Ahriman at Blue Magic 176+. Granted until an Ahriman is
 * in the yard.
 */
export const EYES_RANGE = 13;
export const EYES_FTP = 2.625;
export const EYES_AZURE = 2;
export const EYES_CAP = 69;
export const EYES_HALF = 999;
export const EYES_LOW = -399;

export const EYES_ON_ME = {
  kind: "eyes",
  name: "Eyes On Me",
  level: 61,
  mp: 112,
  points: 4,
  cast: 4.5,
  recast: 29.25,
  range: EYES_RANGE,
  ftp: EYES_FTP,
  azureFtp: EYES_AZURE,
  chrMod: 0.4,
  dStat: 1.5,
  dCap: EYES_CAP,
  half: EYES_HALF,
  low: EYES_LOW,
  hp: -5,
  agi: 0,
  str: 0,
  dex: 0,
  chr: 0,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 0,
  mnd: 0,
  vit: 0,
  setMp: 15,
  mabTrait: 4,
  family: "Ahriman",
  learnSkill: blueLearnSkill(61),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Seedspray. Three slashing hits. Additional effect: Defense Down.
 * Level 61, 61 MP, 2 points, cast 4s, recast 35s. The client recast of
 * 36 seconds is not used. The card prints 35. The card's range is about
 * 11.5'. The client stores 100, which this yard would read as 10'. The
 * card wins.
 * The stat term is 30% of DEX. The skill term is not capped. The
 * weapon-skill coefficient is 0.875 on the first hit and 1 on the other
 * two, at every tier, including Azure Lore. Attack stays ×1. Chain
 * Affinity doubles the stat term, forces the critical hit, and spends
 * all TP. A connecting hit opens Induration, and then Detonation.
 * Defense Down is 20/256, about 8%. The script's power 8 is that
 * percent, not the 256ths, so this yard stores 20/256. The script
 * applies the status after the hit is figured, so this hit uses the
 * defense the target already had. The new 20/256 starts afterward. The card prints 90–120 seconds. The script stores
 * 120. tpMod.DURATION is unused, so the duration does not walk, and the
 * chance does not either. A hit always attempts it. The only miss is
 * the magic resist, with no element. A full resist does not lower
 * defense, and the hit uses the defense it already had. A half resist
 * shortens the 120 seconds, and the 20/256 stays. A miss does not.
 * Defense Down effects do not stack. A stronger one is left alone. Dia
 * is a different status and still multiplies. An equal one is refreshed.
 * The enmity box is blank. The client row's 1 and 640 are not on the
 * card, so they are not added. The cast claims, and the damage adds its
 * own enmity. It breaks Mazurka. Burst Affinity is not spent.
 * Set bonus VIT +1. Beast Killer is 4 trait points and 2 set points.
 * With Wild Oats, also 4 trait points and 3 set points, the trait is
 * +8% damage dealt to beasts. With Sprout Smack the set points are 4,
 * short of 5, so that pair does not grant it. This spell alone does not.
 * Learned from Rafflesia at Blue Magic 176+. Granted until a Rafflesia
 * is in the yard.
 */
export const SEED_RANGE = 11.5;
export const SEED_FTP = 0.875;
export const SEED_DEF = 20 / 256;
export const SEED_SECONDS = 120;

export const SEEDSPRAY = {
  kind: "physical",
  name: "Seedspray",
  level: 61,
  mp: 61,
  points: 2,
  cast: 4,
  recast: 35,
  range: SEED_RANGE,
  hits: 3,
  ftp: SEED_FTP,
  dCap: 999,
  strMod: 0,
  dexMod: 0.3,
  hp: 0,
  agi: 0,
  str: 0,
  dex: 0,
  chr: 0,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 0,
  mnd: 0,
  vit: 1,
  beastTrait: 4,
  chain: "Induration",
  chain2: "Detonation",
  family: "Rafflesia",
  learnSkill: blueLearnSkill(61),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Bad Breath. Earth breath in a fan in front of you.
 * Additional effect: Slow, Poison, Silence, Paralyze, Weight, Bind, and Blind.
 * Level 61, 212 MP, 5 points, cast 8.75s, recast 120s.
 * The card leaves the range blank. This yard uses a 10' fan, the same
 * reach as Poison Breath, 45° each side of where you are facing.
 * Damage is current HP / 8 + main level / 3. The wiki's sum matches the
 * script. Magic Attack Bonus is not applied. Day, weather, staff,
 * affinity, and breath damage dealt are not applied.
 * Beasts would take 25% more and vermin 25% less. The Tropical Rarab is
 * a beast, and that correlation is not rolled.
 * Burst Affinity can magic burst it. Earth matches Scission, Gravitation,
 * Darkness, and Umbra. An older page says a magic burst only helps
 * accuracy. The breath script does not disable the burst, so this yard
 * spends Burst Affinity and multiplies the hit. Azure Lore does not open
 * the window and does not change the breath. Burst Affinity is spent even
 * on a miss or when the target is outside the fan.
 * Each status is its own roll, only when the breath deals damage. The
 * wiki's shared timer is not used. A quarter resist does not land that
 * status. A half resist shortens the 60 seconds. The script stores 60
 * for every one of them. The wiki's "10 to under 60" is that resist.
 * Slow is the script's 2000, stored as 200/1024, about 20%, which matches
 * the tested page. Poison is 4 HP a tick. Silence has no potency. Paralyze
 * is a 15% chance to cancel an auto-attack or TP move. The script's power
 * 15 is that percent. Weight cuts movement to 86%. The wiki's about 14%
 * is used. The script's power 20 is not the percent. Bind has no potency.
 * Blind is accuracy −20. Slow II, or a Slow whose power is above 200,
 * stays. The enfeebling Silence spell stays. A stronger Paralyze, Blind,
 * or Poison stays. Weight replaces Gravity.
 * The enmity box is blank. A hare in the fan is claimed. A connecting
 * hit gives the hare 100 TP. It breaks Mazurka.
 * Set bonus INT +2 and MND +2. Fast Cast is 4 trait points and 5 set
 * points. The trait needs 8 trait points and 6 set points, and tier 0 is
 * level 72 for −5% casting time. Sub-zero Smash is the other half.
 * This spell alone does not grant it. Setting both does.
 * Learned from Morbol at Blue Magic 176+. Granted until a Morbol is in the yard.
 */
export const BAD_RANGE = 10;
export const BAD_POISON = 4;
export const BAD_SECONDS = 60;
export const BAD_SLOW = 200;
export const BAD_WEIGHT = 14;
export const BAD_BLIND = 20;
export const BAD_PARALYZE = 15;

export const BAD_BREATH = {
  kind: "breath",
  name: "Bad Breath",
  level: 61,
  mp: 212,
  points: 5,
  cast: 8.75,
  recast: 120,
  range: BAD_RANGE,
  hpMod: 8,
  lvlMod: 3,
  poison: BAD_POISON,
  poisonSeconds: BAD_SECONDS,
  slow: BAD_SLOW,
  slowSeconds: BAD_SECONDS,
  silenceSeconds: BAD_SECONDS,
  weight: BAD_WEIGHT,
  weightSeconds: BAD_SECONDS,
  blind: BAD_BLIND,
  blindSeconds: BAD_SECONDS,
  paralyze: BAD_PARALYZE,
  paralyzeSeconds: BAD_SECONDS,
  bindSeconds: BAD_SECONDS,
  element: "earth",
  hp: 0,
  agi: 0,
  str: 0,
  dex: 0,
  chr: 0,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 2,
  mnd: 2,
  vit: 0,
  fastTrait: 4,
  family: "Morbol",
  learnSkill: blueLearnSkill(61),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Body Slam. One blunt hit in a circle around you.
 * Damage varies with TP.
 * Level 62, 74 MP, 4 points, cast 1s, recast 27.75s.
 * The card leaves the range blank. The clopedia says the area is centered
 * on the caster. This yard uses a 10' circle, the same reach as Battle Dance.
 * The stat term is 40% of VIT. The skill term is not capped. The script's
 * base cap of 999 does not bind. At Blue Magic 276 the skill term is 63.
 * The weapon-skill coefficient stays 1.5 at every tier, including Chain
 * Affinity and Azure Lore. The card's TP clause is the attack, not the
 * coefficient. Attack is ×1.3 until Chain Affinity or Azure Lore is up.
 * Chain Affinity walks 1.3 at 0 TP, 1.7 at 1500, and 2.1 at 3000. It
 * doubles the stat term, forces the critical hit, and spends all TP,
 * including when the hit misses. Azure Lore sets the attack to 2.15 and
 * wins over Chain Affinity. It does not itself double the stat term or
 * force a critical hit, and it is not consumed. Raw TP does not walk the
 * attack. The script's 2.10 is 2.1.
 * A connecting hit opens Impaction. A miss does not skillchain.
 * The script guesses three shadows. The hare has none, so that is not rolled.
 * No additional status.
 * The enmity box is blank. A hare inside the circle is claimed. A
 * connecting hit gives the hare 100 TP. It breaks Mazurka. Burst Affinity
 * is not spent.
 * Set bonus VIT +1 and MP +5. Max HP Boost is 4 trait points and 4 set
 * points. With Flying Hip Press, or with Frypan, the trait is +30 HP at
 * Blue Mage 62. This spell alone does not grant it.
 * Learned from Dragon at Blue Magic 181+. Not every dragon readies it.
 * Granted until a Dragon is in the yard.
 */
export const SLAM_RADIUS = 10;
export const SLAM_FTP = 1.5;
export const SLAM_ATTACK = [1.3, 1.7, 2.1] as const;
export const SLAM_ATTACK_AZURE = 2.15;

export const BODY_SLAM = {
  kind: "physical",
  name: "Body Slam",
  level: 62,
  mp: 74,
  points: 4,
  cast: 1,
  recast: 27.75,
  radius: SLAM_RADIUS,
  hits: 1,
  ftp: SLAM_FTP,
  dCap: 999,
  strMod: 0,
  dexMod: 0,
  vitMod: 0.4,
  hp: 0,
  agi: 0,
  str: 0,
  dex: 0,
  chr: 0,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 0,
  mnd: 0,
  vit: 1,
  setMp: 5,
  hpTrait: 4,
  chain: "Impaction",
  family: "Dragon",
  learnSkill: blueLearnSkill(62),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki 1000 Needles. Light damage in a circle around you.
 * Level 62, 350 MP, 5 points, cast 12s, recast 120s.
 * The card leaves the range blank. The clopedia says the radius is
 * centered on the user. This yard uses a 10' circle, so you can cast it
 * with no enemy selected.
 * The unresisted hit is 1000, divided equally by the number of targets
 * in the circle, and floored. This yard has one hare, so a connecting
 * hit is 1000. A resist of any size, including a half, fails the spell.
 * There is no 500 or 250. The older page's partial hits are not used.
 * Magic Attack Bonus is not applied. Day, weather, staff, affinity, and
 * breath damage dealt are not applied. Magic burst does not change the
 * damage. This yard's magic burst is a damage multiplier, so Burst
 * Affinity is not spent. Light would match Transfixion, Fusion, Light,
 * and Radiance, and a burst would only have helped accuracy.
 * Magic accuracy takes a −50 penalty. The stat term is dINT. The element
 * is light. Monster correlation is not rolled. It would only have changed
 * accuracy.
 * The enmity box is blank. A hare inside the circle is claimed. A
 * connecting hit gives the hare 100 TP. It breaks Mazurka. Chain Affinity
 * is not spent.
 * Set bonus VIT +3 and AGI +3. Beast Killer is 4 trait points and 5 set
 * points. With Seedspray, Sprout Smack, or Wild Oats, the trait is +8%
 * damage dealt to beasts. This spell alone does not grant it.
 * Learned from Sabotender at Blue Magic 181+. Granted until a Sabotender
 * is in the yard.
 */
export const NEEDLES_RADIUS = 10;
export const NEEDLES_DAMAGE = 1000;
export const NEEDLES_MACC = 50;

export const THOUSAND_NEEDLES = {
  kind: "needles",
  name: "1000 Needles",
  level: 62,
  mp: 350,
  points: 5,
  cast: 12,
  recast: 120,
  radius: NEEDLES_RADIUS,
  damage: NEEDLES_DAMAGE,
  maccPenalty: NEEDLES_MACC,
  hp: 0,
  agi: 3,
  str: 0,
  dex: 0,
  chr: 0,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 0,
  mnd: 0,
  vit: 3,
  beastTrait: 4,
  family: "Sabotender",
  learnSkill: blueLearnSkill(62),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Spinal Cleave. One slashing hit. Accuracy varies with TP.
 * Level 63, 61 MP, 4 points, cast 0.5s, recast 28.5s, range about 9'.
 * The stat term is 30% of STR. The skill term is not capped. The script's
 * base cap of 999 does not bind. At Blue Magic 276 the skill term is 63.
 * The weapon-skill coefficient stays 3.0 at every tier, including Chain
 * Affinity and Azure Lore. Attack stays ×1.05. It does not walk.
 * The card's TP clause is accuracy, and only while Chain Affinity or
 * Azure Lore is up. The script marks the amounts as made up. They are
 * the numbers used: Chain Affinity adds floor(TP / 50), so 0 at 0 TP,
 * 30 at 1500, and 60 at 3000. Azure Lore adds 70 and wins over Chain
 * Affinity. Raw TP adds nothing. Chain Affinity still doubles the stat
 * term, forces the critical hit, and spends all TP, including when the
 * hit misses. Azure Lore does not.
 * A connecting hit opens Scission, and then Detonation. A miss does not
 * skillchain. The clopedia says it ignores shadows. The hare has none,
 * so that is not rolled. No additional status.
 * The enmity box is blank. The cast claims, and the damage adds its own
 * enmity. A connecting hit gives the target 100 TP. It breaks Mazurka.
 * Burst Affinity is not spent.
 * Set bonus VIT +2, INT +1, and MND +1. Attack Bonus is 4 trait points
 * and 4 set points. With Battle Dance, Uppercut, or Death Scissors, the
 * trait is +10. This spell alone does not grant it.
 * Learned from Qutrub at Blue Magic 186+. A qutrub readies it only with
 * the sword broken. The yard does not gate the spell once it is known.
 * Granted until a Qutrub is in the yard.
 */
export const SPINAL_RANGE = 9;
export const SPINAL_FTP = 3;
export const SPINAL_ATTACK = 1.05;
export const BLUE_ACC_DIV = 50;
export const BLUE_ACC_AZURE = 70;

export const SPINAL_CLEAVE = {
  kind: "physical",
  name: "Spinal Cleave",
  level: 63,
  mp: 61,
  points: 4,
  cast: 0.5,
  recast: 28.5,
  range: SPINAL_RANGE,
  hits: 1,
  ftp: SPINAL_FTP,
  dCap: 999,
  strMod: 0.3,
  dexMod: 0,
  hp: 0,
  agi: 0,
  str: 0,
  dex: 0,
  chr: 0,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 4,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 1,
  mnd: 1,
  vit: 2,
  chain: "Scission",
  chain2: "Detonation",
  family: "Qutrub",
  learnSkill: blueLearnSkill(63),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Frypan. One blunt hit in a circle around you.
 * Additional effect: Stun. Accuracy varies with TP.
 * Level 63, 65 MP, 3 points, cast 1s, recast 26s.
 * The card leaves the range blank. This yard uses a 10' circle, the same
 * reach as Body Slam, centered on you.
 * The stat term is 20% of STR and 20% of MND. The skill term is not capped.
 * The weapon-skill coefficient stays 454/256 at every tier, including
 * Chain Affinity and Azure Lore. The card's 1.77 is that fraction rounded.
 * Attack stays ×1. It does not walk.
 * Accuracy uses the same made-up Chain Affinity curve as Spinal Cleave.
 * Chain Affinity adds floor(TP / 50). Azure Lore adds 70 and wins. Raw TP
 * adds nothing. Chain Affinity doubles the stat term, forces the critical
 * hit, and spends all TP. Azure Lore does not.
 * A connecting hit opens Impaction. A miss does not skillchain.
 * Stun is 5 seconds. It is attempted only when a hit lands. The element
 * is none. A quarter resist does not stun. A half resist shortens the 5.
 * A stun already up is replaced. The script guesses three shadows. The
 * hare has none, so that is not rolled.
 * The enmity box is blank. A hare inside the circle is claimed. A
 * connecting hit gives the hare 100 TP. It breaks Mazurka. Burst Affinity
 * is not spent.
 * Set bonus DEX +2. Max HP Boost is 4 trait points and 3 set points.
 * With Flying Hip Press, or with Body Slam, the trait is +30 HP at Blue
 * Mage 62. This spell alone does not grant it.
 * Learned from Moblin at Blue Magic 186+. Granted until a Moblin is in the yard.
 */
export const FRYPAN_RADIUS = 10;
export const FRYPAN_FTP = 454 / 256;
export const FRYPAN_STUN = 5;

export const FRYPAN = {
  kind: "physical",
  name: "Frypan",
  level: 63,
  mp: 65,
  points: 3,
  cast: 1,
  recast: 26,
  radius: FRYPAN_RADIUS,
  hits: 1,
  ftp: FRYPAN_FTP,
  dCap: 999,
  strMod: 0.2,
  dexMod: 0,
  mndMod: 0.2,
  hp: 0,
  agi: 0,
  str: 0,
  dex: 2,
  chr: 0,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 0,
  mnd: 0,
  vit: 0,
  hpTrait: 4,
  chain: "Impaction",
  family: "Moblin",
  learnSkill: blueLearnSkill(63),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Hydro Shot. One physical hit. Additional effect: Enmity Down.
 * Level 63, 55 MP, 3 points, cast 0.5s, recast 26s.
 * The card's "Available Level 55" fights its own 186 learn skill. Skill
 * 186 is blueLearnSkill(63), so the level is 63. The 55 is not used.
 * The range box is blank. A sahagin's water pistol is a short jet. This
 * yard uses 6', not the 12' stand-in a blank ray uses.
 * The stat term is 30% of AGI. The skill term is not capped. The script's
 * base cap of 999 does not bind. The weapon-skill coefficient stays 1.25
 * at every tier, including Azure Lore. Attack stays ×1.85. It does not walk.
 * The script header says Blunt. The params use hand-to-hand. This yard's
 * pDIF is still the melee curve every physical blue uses.
 * Chain Affinity doubles the stat term, forces the critical hit, and spends
 * all TP. Azure Lore does not. A connecting hit opens Reverberation.
 * The additional effect is Enmity Down, and the chance is marked as varying
 * with TP. The script's comment says the amount is trivial and not worth
 * implementing. The card calls the potency an unsolved mystery. No enmity
 * down is rolled.
 * The enmity box is blank. The cast claims, and the damage adds its own
 * enmity. A connecting hit gives the target 100 TP. It breaks Mazurka.
 * Burst Affinity is not spent.
 * Set bonus MND +2. Rapid Shot is 4 trait points and 3 set points. With
 * Feather Storm, or with Jet Stream, the trait is about 25% at Blue Mage 38.
 * This spell alone does not grant it.
 * Learned from Sahagin at Blue Magic 186+. Granted until a Sahagin is in the yard.
 */
export const HYDRO_RANGE = 6;
export const HYDRO_FTP = 1.25;
export const HYDRO_ATTACK = 1.85;

export const HYDRO_SHOT = {
  kind: "physical",
  name: "Hydro Shot",
  level: 63,
  mp: 55,
  points: 3,
  cast: 0.5,
  recast: 26,
  range: HYDRO_RANGE,
  hits: 1,
  ftp: HYDRO_FTP,
  dCap: 999,
  strMod: 0,
  dexMod: 0,
  agiMod: 0.3,
  hp: 0,
  agi: 0,
  str: 0,
  dex: 0,
  chr: 0,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 0,
  mnd: 2,
  vit: 0,
  rapidTrait: 4,
  chain: "Reverberation",
  family: "Sahagin",
  learnSkill: blueLearnSkill(63),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Feather Tickle. Reduces an enemy's TP.
 * Level 64, 48 MP, 3 points, cast 4s, recast 90s, range 11'.
 * The script header's recast is 26. That looks copied from a physical
 * spell. The card prints 90, so this yard uses 90.
 * It does not deal damage. A full hit removes 1500 TP. A half resist
 * removes 750. The script multiplies 1500 by the resist rate, and the
 * resist threshold is 0.5, so a quarter resist and a full resist do not
 * land. The card's random 0–1500 with no correlation is not used. There
 * is no monster correlation. If the target has 0 TP, the script says no
 * effect even when the resist would have hit.
 * Magic accuracy is Blue Magic skill plus dINT. The element is wind.
 * The script can tag a magic-burst message on Detonation, Fragmentation,
 * or Light. There is no damage, so Burst Affinity is not spent. A burst
 * would only have helped accuracy.
 * Cumulative enmity 1, volatile 320, when the cast connects, including a
 * resist and a target that already has 0 TP. A target outside the range,
 * dead, or charmed adds none.
 * It breaks Mazurka. Chain Affinity is not spent.
 * Set bonus AGI +1. Clear Mind is 4 trait points and 3 set points. With
 * Poison Breath, Mind Blast, or Soporific, the trait is +3 while resting.
 * This spell alone does not grant it.
 * Learned from Colibri at Blue Magic 191+. Granted until a Colibri is in the yard.
 */
export const FEATHER_TICKLE_RANGE = 11;
export const FEATHER_TICKLE_TP = 1500;
export const FEATHER_TICKLE_CE = 1;
export const FEATHER_TICKLE_VE = 320;

export const FEATHER_TICKLE = {
  kind: "tickle",
  name: "Feather Tickle",
  level: 64,
  mp: 48,
  points: 3,
  cast: 4,
  recast: 90,
  range: FEATHER_TICKLE_RANGE,
  tpCut: FEATHER_TICKLE_TP,
  ce: FEATHER_TICKLE_CE,
  ve: FEATHER_TICKLE_VE,
  hp: 0,
  agi: 1,
  str: 0,
  dex: 0,
  chr: 0,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 0,
  mnd: 0,
  vit: 0,
  clearTrait: 4,
  family: "Colibri",
  learnSkill: blueLearnSkill(64),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Yawn. Light sleep in a circle around you. It is a gaze.
 * Level 64, 55 MP, 3 points, cast 3s, recast 60s, area 10'.
 * You do not need to face the enemy. The enemy must be facing you.
 * It is not a fan. The script sets isGaze and is not conal.
 * It does not deal damage. An unresisted land lasts 90 seconds. The
 * script stores 90. The card's 70–90 is not a second random. A half
 * resist shortens the 90. A full resist, and a quarter resist, do not
 * land. The script's resist threshold is 0.5.
 * It lands as its own status, Yawn, the same way Sheep Song and Soporific
 * keep their own names. It refreshes its own Yawn. It does not overwrite
 * Sleep, Sleep II, Sleepga, Sleepga II, Repose, Lullaby, Sheep Song, or
 * Soporific, and those blue sleeps do not overwrite it. Sleep, Sleep II,
 * Sleepga, Sleepga II, Repose, and Lullaby do overwrite it. A direct hit
 * or a heal wakes it. It interrupts an action in progress, the way Sleep does.
 * Magic accuracy is Blue Magic skill plus dMND. The element is light.
 * The script can tag a magic-burst message on Transfixion, Fusion, or Light.
 * There is no damage, so Burst Affinity is not spent.
 * Cumulative enmity 320, volatile 320, when the gaze connects, including a
 * resist. A target that is not facing you, outside the circle, dead, or
 * charmed adds none.
 * It breaks Mazurka. Chain Affinity is not spent.
 * Set bonus CHR +1 and HP +5. Resist Sleep is 4 trait points and 3 set
 * points. With Pollen, or with Wild Carrot, or with Magic Fruit, the trait
 * is 10%. This spell alone does not grant it.
 * Learned from Apkallu at Blue Magic 191+. Granted until an Apkallu is in the yard.
 */
export const YAWN_RADIUS = 10;
export const YAWN_SECONDS = 90;
export const YAWN_CE = 320;
export const YAWN_VE = 320;

export const YAWN = {
  kind: "yawn",
  name: "Yawn",
  level: 64,
  mp: 55,
  points: 3,
  cast: 3,
  recast: 60,
  radius: YAWN_RADIUS,
  seconds: YAWN_SECONDS,
  ce: YAWN_CE,
  ve: YAWN_VE,
  hp: 5,
  agi: 0,
  str: 0,
  dex: 0,
  chr: 1,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 4,
  int: 0,
  mnd: 0,
  vit: 0,
  family: "Apkallu",
  learnSkill: blueLearnSkill(64),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Voracious Trunk. Steals one beneficial effect.
 * Level 64, 72 MP, 4 points, cast 10s.
 * The script header says level 72. Skill 191 is blueLearnSkill(64), and
 * the card says 64, so the level is 64. The script's 72 is not used.
 * The card's recast is 120. The script header and the encyclopedia say 56.
 * This yard uses the card's 120.
 * The range box is blank. A marid's trunk is a close grab. This yard uses
 * 6', not the 12' stand-in a blank ray uses.
 * It does not deal damage. Magic accuracy is Blue Magic skill plus dINT.
 * The element is wind. The resist threshold is 0.5. A half resist still
 * steals. A quarter resist and a full resist do not.
 * One beneficial effect is stolen, with the time it had left. The script
 * calls stealStatusEffect. Stolen nothing is no effect, not a resist.
 * The Tropical Rarab has no beneficial effects, so a connecting cast that
 * is not resisted is no effect. The steal path is still the one that runs.
 * The script can tag a magic burst on wind. There is no damage, so Burst
 * Affinity is not spent.
 * Cumulative enmity 320, volatile 640, when the cast connects, including a
 * resist and a target with nothing to steal. A target outside the range,
 * dead, or charmed adds none.
 * It breaks Mazurka. Chain Affinity is not spent.
 * Set bonus AGI +2. Auto Refresh is 3 trait points and 4 set points. The
 * encyclopedia's "3 Auto Refresh points" is the trait, not a fourth set
 * point. With Actinic Burst the trait points are 7, still short of 8.
 * Actinic Burst with this spell and Stinking Gas, or with Cold Wave, meets
 * 8 trait points and 8 set points. This spell alone does not grant it.
 * Learned from Marid at Blue Magic 191+. Granted until a Marid is in the yard.
 */
export const TRUNK_RANGE = 6;
export const TRUNK_CE = 320;
export const TRUNK_VE = 640;

export const VORACIOUS_TRUNK = {
  kind: "trunk",
  name: "Voracious Trunk",
  level: 64,
  mp: 72,
  points: 4,
  cast: 10,
  recast: 120,
  range: TRUNK_RANGE,
  ce: TRUNK_CE,
  ve: TRUNK_VE,
  hp: 0,
  agi: 2,
  str: 0,
  dex: 0,
  chr: 0,
  refreshTrait: 3,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 0,
  mnd: 0,
  vit: 0,
  family: "Marid",
  learnSkill: blueLearnSkill(64),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Infrasonics. Evasion Down in a fan in front of you.
 * Level 65, 42 MP, 4 points, cast 5s, recast 120s.
 * The card leaves the range blank. Other blank fans in this yard are 10'.
 * This one is the same: 10' long and BLUE_CONE degrees each side of where
 * you are facing. It is not a gaze. The script sets isConal and not a gaze.
 * It does not deal damage. An unresisted land is evasion −20 for 60 seconds.
 * The potency does not tick. A half resist shortens the 60. A full resist,
 * and a quarter resist, do not land. The script's resist threshold is 0.5.
 * It refreshes its own Evasion Down. It does not land over Lunar Cry or
 * Feint, even when those cuts differ from 20. Lunar Cry replaces this row
 * when it lands. Feint is a Thief merit and is not learned here, so that
 * row is only the refusal. It stacks with Distract, which is a separate
 * power, and it would stack with Quickstep. Quickstep is not in this yard.
 * Magic accuracy is Blue Magic skill plus dINT. The element is ice.
 * The script can tag a magic-burst message on Induration, Distortion, or
 * Darkness. There is no damage, so Burst Affinity is not spent.
 * Cumulative enmity 1, volatile 320, when the hare is in the fan, including
 * a resist and a refused overwrite. A target outside the fan, dead, or
 * charmed adds none.
 * It breaks Mazurka. Chain Affinity is not spent. No trait.
 * Set bonus INT +1.
 * Learned from Hill Lizard at Blue Magic 196+. Granted until a Lizard is in the yard.
 */
export const INFRA_RANGE = 10;
export const INFRA_EVA = 20;
export const INFRA_SECONDS = 60;
export const INFRA_CE = 1;
export const INFRA_VE = 320;

export const INFRASONICS = {
  kind: "infra",
  name: "Infrasonics",
  level: 65,
  mp: 42,
  points: 4,
  cast: 5,
  recast: 120,
  range: INFRA_RANGE,
  evaDown: INFRA_EVA,
  seconds: INFRA_SECONDS,
  ce: INFRA_CE,
  ve: INFRA_VE,
  hp: 0,
  agi: 0,
  str: 0,
  dex: 0,
  chr: 0,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 1,
  mnd: 0,
  vit: 0,
  family: "Lizard",
  learnSkill: blueLearnSkill(65),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Frost Breath. Ice breath in a fan in front of you.
 * Additional effect: Paralyze.
 * Level 66, 136 MP, 3 points, cast 6.5s, recast 42.75s.
 * The card rounds the recast to 43. The script header stores 42.75.
 * The card leaves the range blank. This yard uses a 10' fan, the same
 * reach as Poison Breath, 45° each side of where you are facing.
 * Damage is current HP / 3 + main level / 0.625. The wiki's sum matches
 * the script. Magic Attack Bonus is not applied. Day, weather, staff,
 * affinity, and breath damage dealt are not applied.
 * Vermin would take 25% more and beasts 25% less. The Tropical Rarab is
 * a beast, and that correlation is not rolled.
 * Burst Affinity can magic burst it. Ice matches Induration, Distortion,
 * Darkness, and Umbra. Azure Lore does not open the window and does not
 * change the breath. Burst Affinity is spent even on a miss or when the
 * target is outside the fan.
 * Paralyze is attempted only when the breath deals damage. The tested
 * page is a 12.5% chance to cancel an auto-attack or TP move, for 3
 * minutes. The script's power 15 and 60 seconds are not used. A half
 * resist shortens the 180. A quarter resist does not paralyze. A
 * stronger Paralyze stays.
 * The enmity box is blank. A hare in the fan is claimed. A connecting
 * hit gives the hare 100 TP. It breaks Mazurka.
 * Set bonus INT −2. Conserve MP is 4 trait points and 3 set points.
 * The trait needs 8 trait points and 4 set points. Chaotic Eye and
 * Zephyr Mantle are 4 trait points and 2 set points each. This spell
 * alone does not grant it. Setting it with either of those does.
 * Learned from Raptor at Blue Magic 201+. Only the raptors in Uleguerand
 * Range ready it. Granted until a Raptor is in the yard.
 */
export const FROST_RANGE = 10;
export const FROST_PARALYZE = 12.5;
export const FROST_SECONDS = 180;

export const FROST_BREATH = {
  kind: "breath",
  name: "Frost Breath",
  level: 66,
  mp: 136,
  points: 3,
  cast: 6.5,
  recast: 42.75,
  range: FROST_RANGE,
  hpMod: 3,
  lvlMod: 0.625,
  paralyze: FROST_PARALYZE,
  paralyzeSeconds: FROST_SECONDS,
  element: "ice",
  hp: 0,
  agi: 0,
  str: 0,
  dex: 0,
  chr: 0,
  refreshTrait: 0,
  conserveTrait: 4,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: -2,
  mnd: 0,
  vit: 0,
  family: "Raptor",
  learnSkill: blueLearnSkill(66),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Sandspray. Blind in a fan in front of you. Dark.
 * Level 66, 43 MP, 2 points, cast 3s.
 * The card prints a recast of 60 to 120 seconds. The script header
 * stores 90, so this yard uses 90.
 * The card prints about 6.5'. The fan is 45° each side of where you
 * are facing. It is not a gaze.
 * It does not deal damage. An unresisted land is accuracy −25 for 120
 * seconds. The card leaves the duration blank. The script stores 120.
 * The potency does not tick. A half resist shortens the 120. A full
 * resist, and a quarter resist, do not land. The script's resist
 * threshold is 0.5.
 * It refreshes its own Blind. It does not overwrite Blind, Blind II,
 * Kurayami: Ichi, or Kurayami: Ni. Those overwrite it. Kurayami is not
 * in this yard. A Blind whose source was not stored is treated as the
 * spell. A breath Blind is also left alone.
 * Magic accuracy is Blue Magic skill plus dINT. The element is dark.
 * There is no damage, so Burst Affinity is not spent. The script can
 * tag a magic-burst message on Compression, Gravitation, or Darkness.
 * Cumulative enmity 1, volatile 640, when the hare is in the fan,
 * including a resist and a refused overwrite. A target outside the fan,
 * dead, or charmed adds none.
 * It breaks Mazurka. Chain Affinity is not spent.
 * Set bonus VIT +1. Clear Mind is 4 trait points and 2 set points.
 * The trait needs 8 trait points and 3 set points, so this spell alone
 * does not grant it.
 * Learned from Qiqirn at Blue Magic 201+. Granted until a Qiqirn is in the yard.
 */
export const SANDSPRAY_RANGE = 6.5;
export const SANDSPRAY_ACC = 25;
export const SANDSPRAY_SECONDS = 120;
export const SANDSPRAY_CE = 1;
export const SANDSPRAY_VE = 640;

export const SANDSPRAY = {
  kind: "spray",
  name: "Sandspray",
  level: 66,
  mp: 43,
  points: 2,
  cast: 3,
  recast: 90,
  range: SANDSPRAY_RANGE,
  accDown: SANDSPRAY_ACC,
  seconds: SANDSPRAY_SECONDS,
  ce: SANDSPRAY_CE,
  ve: SANDSPRAY_VE,
  hp: 0,
  agi: 0,
  str: 0,
  dex: 0,
  chr: 0,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 0,
  mnd: 0,
  vit: 1,
  clearTrait: 4,
  family: "Qiqirn",
  learnSkill: blueLearnSkill(66),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Corrosive Ooze. Water damage to one enemy.
 * Additional effect: Attack Down and Defense Down.
 * Level 66, 55 MP, 4 points, recast 30s, range about 11'.
 * The card prints a 4.5 second cast. The script header stores 5.
 * This yard uses 5.
 * The card says AoE. The script hits the one enemy the cast selected
 * and sets no radius. This yard uses that one target, inside 11'.
 * The base is level + 2, capped at 69. At 75 that term is 69.
 * The stat term is 20% of INT times the level alpha. Burst Affinity
 * doubles that term and is spent, even on a miss or when the target
 * is out of range. The printed coefficient is 2.171875, which is
 * 556/256. The script's 2.125 is not used. Azure Lore adds 0.5 and
 * does not open a magic burst. dINT is multiplied by 2. The script
 * does not set a half cap or a floor, so the defaults apply: anything
 * above 999 counts for half, and the term cannot fall under −399.
 * Water matches Reverberation, Distortion, Darkness, and Umbra.
 * Day, weather, staff, affinity, and ecosystem correlation are not
 * applied. Magic Attack Bonus is the step after the resist floor.
 * Attack Down and Defense Down are each 13/256, the page's 5%. They
 * are a second resist, attempted together, and only when the hit
 * dealt damage. The unresisted duration is 90 seconds. The card's
 * 60 to 90 is that resist. A half resist shortens the 90. A quarter
 * resist lands neither. Defense Down does not stack with another
 * Defense Down. A stronger cut is left alone. Dia still multiplies.
 * Attack Down replaces a weaker or equal Attack Down.
 * Cumulative enmity 1. Volatile enmity is blank, so none is added.
 * The damage is nearly hateless. A hare in range is claimed. A
 * connecting hit gives the hare 100 TP. It breaks Mazurka.
 * Set bonus HP −10 and MP +10. Clear Mind is 4 trait points and 4
 * set points. The trait needs 8 trait points and 3 set points, so
 * this spell alone does not grant it.
 * Learned from Slug at Blue Magic 201+. Granted until a Slug is in the yard.
 */
export const OOZE_RANGE = 11;
export const OOZE_FTP = 2.171875;
export const OOZE_AZURE = 0.5;
export const OOZE_CAP = 69;
export const OOZE_HALF = 999;
export const OOZE_LOW = -399;
export const OOZE_DOWN = 13;
export const OOZE_SECONDS = 90;
export const OOZE_CE = 1;

export const CORROSIVE_OOZE = {
  kind: "ooze",
  name: "Corrosive Ooze",
  level: 66,
  mp: 55,
  points: 4,
  cast: 5,
  recast: 30,
  range: OOZE_RANGE,
  ftp: OOZE_FTP,
  azureFtp: OOZE_AZURE,
  intMod: 0.2,
  dStat: 2,
  dCap: OOZE_CAP,
  half: OOZE_HALF,
  low: OOZE_LOW,
  downNumer: OOZE_DOWN,
  seconds: OOZE_SECONDS,
  ce: OOZE_CE,
  hp: -10,
  agi: 0,
  str: 0,
  dex: 0,
  chr: 0,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 0,
  mnd: 0,
  vit: 0,
  setMp: 10,
  clearTrait: 4,
  family: "Slug",
  learnSkill: blueLearnSkill(66),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Diamondhide. Stoneskin for party members around you.
 * Level 67, 99 MP, 3 points, cast 7s, recast 90s.
 * The card leaves the range blank. This yard uses 10', the same party
 * circle Healing Breeze uses, centered on you.
 * Power is floor((Blue Magic skill / 3) × 2). Skill is held from 0
 * through 500. At 500 that is 333. Stoneskin+ gear is not applied.
 * The card's duration is 15 minutes. The script stores 300 seconds and
 * would lengthen that with Diffusion. Diffusion is a locked merit, so
 * the card's 900 seconds is what lands.
 * It refreshes its own shell and it replaces Metallic Body. It does not
 * overwrite Stoneskin, whether that shell is the spell or Afflatus
 * Solace. Earthen Ward and Rampart are not in the yard. Stoneskin and
 * Afflatus Solace overwrite this shell. Metallic Body does not.
 * Gamer Escape calls the element earth. There is no damage, so the
 * element is not rolled.
 * Cumulative enmity 1, volatile 300. A spell on yourself does not claim.
 * It does not break Mazurka. Chain Affinity and Burst Affinity are not spent.
 * Set bonus VIT +1. The script says Combos: None, so it grants no trait.
 * Learned from armored Trolls, the ones that fight as Warrior, Paladin,
 * or Dark Knight, at Blue Magic 205+. Granted until a Troll is in the yard.
 */
export const HIDE_SECONDS = 900;
export const HIDE_RADIUS = 10;
export const HIDE_CE = 1;
export const HIDE_VE = 300;
export const HIDE_SKILL_CAP = 500;

export const DIAMONDHIDE = {
  kind: "hide",
  name: "Diamondhide",
  level: 67,
  mp: 99,
  points: 3,
  cast: 7,
  recast: 90,
  seconds: HIDE_SECONDS,
  radius: HIDE_RADIUS,
  ce: HIDE_CE,
  ve: HIDE_VE,
  hp: 0,
  agi: 0,
  str: 0,
  dex: 0,
  chr: 0,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 0,
  mnd: 0,
  vit: 1,
  family: "Troll",
  learnSkill: blueLearnSkill(67),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Enervation. Defense Down and Magic Defense Down around you.
 * Dark. Level 67, 48 MP, 5 points, cast 6s, recast 60s.
 * The card prints about 11.5'. It is a circle, not a fan.
 * It does not deal damage. An unresisted land is defense −26/256,
 * about 10%, and Magic Defense Bonus −8, for 30 seconds. Neither
 * potency ticks. A half resist shortens the 30. A full resist, and a
 * quarter resist, land neither. The script's resist threshold is 0.5.
 * Both statuses share that one roll.
 * Defense Down does not stack with another Defense Down. A stronger
 * cut is left alone. Dia, Box Step, and Geo-Frailty are different
 * statuses. Dia still multiplies. Magic Defense Down refreshes itself.
 * Magic accuracy is Blue Magic skill plus dINT. The element is dark.
 * There is no damage, so Burst Affinity is not spent. The script can
 * tag a magic-burst message on Compression, Gravitation, or Darkness.
 * Cumulative enmity 1, volatile 320, when the hare is in the circle,
 * including a resist. A target outside it, dead, or charmed adds none.
 * It breaks Mazurka. Chain Affinity is not spent.
 * Set bonus HP −5 and MP +5. Counter is 4 trait points and 5 set
 * points. The trait needs 8 trait points and 5 set points, and tier I
 * is level 70, an 8% counter rate. Asuran Claws is 4 trait points and
 * 2 set points. Setting both grants it. This spell alone does not.
 * The counter is not rolled.
 * Learned from light-armored Trolls, the ones that fight as Monk, Red
 * Mage, Ranger, or Puppetmaster, at Blue Magic 205+. Granted until a
 * Troll is in the yard.
 */
export const ENERV_RADIUS = 11.5;
export const ENERV_SECONDS = 30;
export const ENERV_DEF = 26 / 256;
export const ENERV_MDB = 8;
export const ENERV_CE = 1;
export const ENERV_VE = 320;

export const ENERVATION = {
  kind: "enerv",
  name: "Enervation",
  level: 67,
  mp: 48,
  points: 5,
  cast: 6,
  recast: 60,
  radius: ENERV_RADIUS,
  seconds: ENERV_SECONDS,
  defense: ENERV_DEF,
  mdb: ENERV_MDB,
  ce: ENERV_CE,
  ve: ENERV_VE,
  hp: -5,
  agi: 0,
  str: 0,
  dex: 0,
  chr: 0,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 0,
  mnd: 0,
  vit: 0,
  setMp: 5,
  counterTrait: 4,
  family: "Troll",
  learnSkill: blueLearnSkill(67),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Warm-Up. Accuracy and evasion on yourself. Earth.
 * Level 68, 59 MP, 4 points, cast 7s, recast 120s.
 * Accuracy +10 and Evasion +10 for 180 seconds. Both are flat.
 * Diffusion is a locked merit, so the duration stays 180.
 * Feather Barrier's Evasion Boost is +25. A stronger Evasion Boost
 * is left alone. Accuracy Boost is its own status and always lands.
 * There is no damage, so Burst Affinity is not spent. Chain Affinity
 * is not spent. It does not break Mazurka.
 * The enmity box is blank. Cumulative 1, volatile 300, the same pair
 * Feather Barrier uses. A spell on yourself does not claim.
 * Set bonus VIT +1. Clear Mind is 4 trait points and 4 set points.
 * The trait needs 8 trait points and 3 set points. Poison Breath is
 * the other half. This spell alone does not grant it.
 * Learned from a melee Mamool Ja at Blue Magic 210+. Granted until
 * one is in the yard.
 */
export const WARMUP_SECONDS = 180;
export const WARMUP_ACC = 10;
export const WARMUP_EVA = 10;
export const WARMUP_CE = 1;
export const WARMUP_VE = 300;

export const WARM_UP = {
  kind: "warmup",
  name: "Warm-Up",
  level: 68,
  mp: 59,
  points: 4,
  cast: 7,
  recast: 120,
  seconds: WARMUP_SECONDS,
  accuracy: WARMUP_ACC,
  evasion: WARMUP_EVA,
  ce: WARMUP_CE,
  ve: WARMUP_VE,
  hp: 0,
  agi: 0,
  str: 0,
  dex: 0,
  chr: 0,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 0,
  mnd: 0,
  vit: 1,
  clearTrait: 4,
  family: "Mamool",
  learnSkill: blueLearnSkill(68),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Firespit. One fire hit. Level 68, 121 MP, 5 points.
 * Cast 6.5s. The script header recasts in 42.75. The card's 43 is not used.
 * Range about 20'. WSC is INT 20% and MND 20%, not floored per stat.
 * The multiplier is 3. Azure Lore adds nothing. dINT is multiplied by 1.5.
 * The skill term stops at 69. Half of anything above 999, floor −399.
 * Burst Affinity doubles the stat term and is spent even on a miss.
 * Azure Lore does not open a magic burst. Fire matches Liquefaction,
 * Fusion, Light, and Radiance.
 * The enmity box is blank. The cast claims, and the damage adds its own.
 * Set bonus STR +3. Conserve MP is 4 trait points and 5 set points.
 * The trait needs 8 trait points and 4 set points. This spell alone
 * does not grant it. Chaotic Eye, Zephyr Mantle, or Frost Breath does.
 * Learned from a mage Mamool Ja at Blue Magic 210+. Granted until one
 * is in the yard.
 */
export const FIRESPIT_RANGE = 20;

export const FIRESPIT = {
  kind: "spit",
  name: "Firespit",
  level: 68,
  mp: 121,
  points: 5,
  cast: 6.5,
  recast: 42.75,
  range: FIRESPIT_RANGE,
  ftp: 3,
  azureFtp: 0,
  intMod: 0.2,
  mndMod: 0.2,
  dStat: 1.5,
  dCap: 69,
  half: 999,
  low: -399,
  hp: 0,
  agi: 0,
  str: 3,
  dex: 0,
  chr: 0,
  refreshTrait: 0,
  conserveTrait: 4,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 0,
  mnd: 0,
  vit: 0,
  family: "Mamool",
  learnSkill: blueLearnSkill(68),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Tail Slap. One blunt fan. Additional effect: Stun.
 * Level 69, 77 MP, 4 points, cast 1s, recast 28.5s.
 * The script's damage type is hand-to-hand. This yard's pDIF stays
 * the melee curve. The range box is blank, so the fan is 10' and
 * BLUE_CONE, the same stand-in other blank fans use.
 * WSC is STR 20% and VIT 50%. The coefficient stays 1.625 at every
 * tier, including Azure Lore. The skill term is not capped.
 * Attack is ×1.05. Chain Affinity walks 1.05 / 2.5 / 2.60.
 * Azure Lore sets 2.65 and wins. A connecting hit opens Reverberation.
 * Stun is 5 seconds. A blunt type is not an element, so the roll uses
 * none. The guessed three-shadow wipe is not rolled. The hare has none.
 * Set bonus MND +2. Store TP is 4 trait points and 4 set points.
 * The trait needs 8 trait points and 5 set points, and Blue Mage 69.
 * Sickle Slash is the other half. Setting both grants Store TP +10.
 * This spell alone never grants it.
 * Learned from Merrows at Blue Magic 215+. Lamiae use it, and you do
 * not learn it from them. Granted until a Merrow is in the yard.
 */
export const TAIL_RANGE = 10;
export const TAIL_FTP = 1.625;
export const TAIL_ATTACK = [1.05, 2.5, 2.6] as const;
export const TAIL_ATTACK_AZURE = 2.65;
export const TAIL_STUN = 5;

export const TAIL_SLAP = {
  kind: "physical",
  name: "Tail Slap",
  level: 69,
  mp: 77,
  points: 4,
  cast: 1,
  recast: 28.5,
  range: TAIL_RANGE,
  hits: 1,
  ftp: TAIL_FTP,
  dCap: 999,
  strMod: 0.2,
  dexMod: 0,
  vitMod: 0.5,
  chain: "Reverberation",
  cone: true,
  hp: 0,
  agi: 0,
  str: 0,
  dex: 0,
  chr: 0,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 0,
  mnd: 2,
  vit: 0,
  storeTrait: 4,
  family: "Lamia",
  learnSkill: blueLearnSkill(69),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Hysteric Barrage. Five blunt hits. Level 69, 61 MP, 5 points.
 * Cast 0.5s, recast 28.5s. The range box is blank, so this yard uses
 * 4.5', the same reach as Uppercut.
 * WSC is DEX 30%. The coefficient is 1.25 until Chain Affinity or
 * Azure Lore is up. Chain Affinity walks 1.25 / 1.625 / 1.75.
 * Azure Lore replaces it with 1.875. Raw TP stays 1.25.
 * Only the first hit uses that coefficient. The other four stay at 1.
 * The skill term stops at 80. At Blue Magic 276 the skill term is 63,
 * so the cap does not bind. Attack stays ×1. The page's −10% attack
 * is not in the current script, so it is not applied.
 * A connecting hit opens Detonation.
 * Set bonus DEX +2 and AGI +1. Evasion Bonus is 4 trait points and
 * 5 set points. With Screwdriver the trait is +10. This spell alone
 * does not grant it.
 * Learned from Lamiae after the weapon breaks, at Blue Magic 215+.
 * Merrows may use it. You learn it from Lamiae. Granted until one
 * is in the yard.
 */
export const HYSTERIC_FTP = [1.25, 1.625, 1.75] as const;
export const HYSTERIC_FTP_AZURE = 1.875;
export const HYSTERIC_RANGE = 4.5;

export const HYSTERIC_BARRAGE = {
  kind: "physical",
  name: "Hysteric Barrage",
  level: 69,
  mp: 61,
  points: 5,
  cast: 0.5,
  recast: 28.5,
  range: HYSTERIC_RANGE,
  hits: 5,
  ftp: HYSTERIC_FTP[0],
  dCap: 80,
  strMod: 0,
  dexMod: 0.3,
  chain: "Detonation",
  hp: 0,
  agi: 1,
  str: 0,
  dex: 2,
  chr: 0,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 0,
  mnd: 0,
  vit: 0,
  evasionTrait: 4,
  family: "Lamia",
  learnSkill: blueLearnSkill(69),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Regurgitation. One water hit. Additional effect: Bind.
 * The card and the encyclopedia say level 69, and the learn skill is
 * 215. The script header says 68. This yard uses 69.
 * 69 MP, 1 point, cast 5s, recast 24s. Range about 21'.
 * WSC is MND 30%. dINT is still INT, multiplied by 2.
 * The script multiplier is 1.83. The card's 1.875 is not used.
 * Azure Lore sets no azure bonus, so the coefficient stays 1.83.
 * The damage table's 2.46 from behind is not used. After Magic
 * Attack Bonus, a hit from behind is floored times 1.25.
 * The skill term stops at 69. Half of anything above 999, floor −399.
 * Bind is 30 seconds, only when the hit dealt damage. The element
 * is water. A half resist shortens it. A full resist does not bind.
 * Cumulative enmity 1, volatile 640, when the hare is in range,
 * including a resist. Out of range, dead, or charmed adds none.
 * Water matches Reverberation, Distortion, Darkness, and Umbra.
 * Burst Affinity doubles the stat term and is spent even on a miss.
 * Azure Lore does not open the window.
 * Gamer Escape notes an unlisted knockback. This yard does not move
 * the hare.
 * Set bonus MP +3, INT +1, MND +1. Resist Gravity is 4 trait points
 * and 1 set point. With Feather Barrier the trait is 10% at Blue Mage 69.
 * This spell alone does not grant it. Nothing here weighs you.
 * Learned from Peiste at Blue Magic 215+. Granted until one is in the yard.
 */
export const REGURG_RANGE = 21;
export const REGURG_FTP = 1.83;
export const REGURG_BIND = 30;
export const REGURG_BEHIND = 1.25;
export const REGURG_CE = 1;
export const REGURG_VE = 640;

export const REGURGITATION = {
  kind: "gorge",
  name: "Regurgitation",
  level: 69,
  mp: 69,
  points: 1,
  cast: 5,
  recast: 24,
  range: REGURG_RANGE,
  ftp: REGURG_FTP,
  azureFtp: 0,
  mndMod: 0.3,
  dStat: 2,
  dCap: 69,
  half: 999,
  low: -399,
  bind: REGURG_BIND,
  behind: REGURG_BEHIND,
  ce: REGURG_CE,
  ve: REGURG_VE,
  hp: 0,
  agi: 0,
  str: 0,
  dex: 0,
  chr: 0,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 1,
  mnd: 1,
  vit: 0,
  setMp: 3,
  gravityTrait: 4,
  family: "Peiste",
  learnSkill: blueLearnSkill(69),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Amplification. Magic attack and magic defense on yourself.
 * Water. Level 70, 48 MP, 3 points, cast 7s, recast 120s.
 * Magic Atk. Boost +10 and Magic Def. Boost +10 for 90 seconds.
 * Diffusion is a locked merit, so the duration stays 90.
 * Memento Mori's Magic Atk. Boost is +20. A stronger one is left alone.
 * Magic Def. Boost still lands. It refreshes its own +10.
 * There is no damage, so Burst Affinity is not spent. Chain Affinity
 * is not spent. It does not break Mazurka.
 * Cumulative enmity 320, volatile 320. A spell on yourself does not claim.
 * Set bonus HP −5 and MP +5. The script says Combos: None, so it grants
 * no trait.
 * Learned from Flans at Blue Magic 220+. Granted until a Flan is in the yard.
 */
export const AMP_SECONDS = 90;
export const AMP_MAB = 10;
export const AMP_MDB = 10;
export const AMP_CE = 320;
export const AMP_VE = 320;

export const AMPLIFICATION = {
  kind: "amp",
  name: "Amplification",
  level: 70,
  mp: 48,
  points: 3,
  cast: 7,
  recast: 120,
  seconds: AMP_SECONDS,
  mab: AMP_MAB,
  mdb: AMP_MDB,
  ce: AMP_CE,
  ve: AMP_VE,
  hp: -5,
  agi: 0,
  str: 0,
  dex: 0,
  chr: 0,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 0,
  mnd: 0,
  vit: 0,
  setMp: 5,
  family: "Flan",
  learnSkill: blueLearnSkill(70),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Asuran Claws. Six blunt hits. Level 70, 81 MP, 2 points.
 * The script, Gamer Escape, and the encyclopedia cast in 3 seconds.
 * The card's 2 seconds matches the point cost and is not used.
 * Recast 60s. The range box is blank, so this yard uses 4.5', the same
 * reach as Uppercut.
 * WSC is STR 10% and DEX 10%. The coefficient stays 0.625 at every tier,
 * including Azure Lore. Only the first hit uses it. The other five stay at 1.
 * The skill term is not capped. Attack stays ×1.05, including Azure Lore.
 * Chain Affinity does not walk that attack. It doubles the stat term,
 * forces the critical hit, and spends all TP.
 * Accuracy varies with TP only under Chain Affinity: floor(TP / 50).
 * Azure Lore is +70 and wins. The script marks that curve as made up.
 * Raw TP adds nothing. A connecting hit opens Liquefaction, then Impaction.
 * The script's damage type is hand-to-hand. This yard's pDIF stays the melee curve.
 * Set bonus AGI +3. Counter is 4 trait points and 2 set points.
 * Enervation is the other half. The trait needs 8 trait points and 5 set
 * points, and tier I is level 70, an 8% rate. This spell alone does not
 * grant it. The counter is not rolled.
 * Learned from standing Gnoles at Blue Magic 220+. Granted until a Gnole
 * is in the yard.
 */
export const ASURAN_RANGE = 4.5;
export const ASURAN_FTP = 0.625;
export const ASURAN_MULT = 1.05;
export const ASURAN_HITS = 6;

export const ASURAN_CLAWS = {
  kind: "physical",
  name: "Asuran Claws",
  level: 70,
  mp: 81,
  points: 2,
  cast: 3,
  recast: 60,
  range: ASURAN_RANGE,
  hits: ASURAN_HITS,
  ftp: ASURAN_FTP,
  dCap: 999,
  strMod: 0.1,
  dexMod: 0.1,
  chain: "Liquefaction",
  chain2: "Impaction",
  hp: 0,
  agi: 3,
  str: 0,
  dex: 0,
  chr: 0,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 0,
  mnd: 0,
  vit: 0,
  counterTrait: 4,
  family: "Gnole",
  learnSkill: blueLearnSkill(70),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Lowing. Plague around you. Fire. Level 71, 66 MP, 2 points,
 * cast 7s. The script and the encyclopedia recast in 56 seconds.
 * The current card says 120. This yard uses 56.
 * The radius box is blank, so the circle is 10', the same stand-in
 * Battle Dance uses. It is not a fan.
 * Plague lasts 60 seconds. A half resist shortens it. A full resist,
 * and a quarter resist, do not land. The script's resist threshold is 0.5.
 * The status removes 50 TP and 3 MP every tick. This yard's tick is 3 seconds.
 * The hare has no MP pool, so the 3 MP is not drained. The TP is.
 * Wild Carrot restores no HP while Plague is up.
 * The script header can tag a magic-burst message on Liquefaction, Fusion,
 * or Light. The current card lists no burst. There is no damage, so Burst
 * Affinity is not spent.
 * Cumulative enmity 1, volatile 320, when the hare is in the circle,
 * including a resist. It breaks Mazurka. Chain Affinity is not spent.
 * Set bonus HP −5. Clear Mind is 4 trait points and 2 set points.
 * Poison Breath completes it. This spell alone does not grant it.
 * Learned from Buffalo at Blue Magic 225+. Granted until one is in the yard.
 */
export const LOWING_RADIUS = 10;
export const LOWING_SECONDS = 60;
export const LOWING_TP = 50;
export const LOWING_MP = 3;
export const LOWING_CE = 1;
export const LOWING_VE = 320;

export const LOWING = {
  kind: "lowing",
  name: "Lowing",
  level: 71,
  mp: 66,
  points: 2,
  cast: 7,
  recast: 56,
  radius: LOWING_RADIUS,
  seconds: LOWING_SECONDS,
  tpCut: LOWING_TP,
  mpCut: LOWING_MP,
  ce: LOWING_CE,
  ve: LOWING_VE,
  hp: -5,
  agi: 0,
  str: 0,
  dex: 0,
  chr: 0,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 0,
  mnd: 0,
  vit: 0,
  clearTrait: 4,
  family: "Buffalo",
  learnSkill: blueLearnSkill(71),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Heat Breath. Fire breath in a fan. Level 71, 169 MP, 4 points,
 * cast 7.5s, recast 49s. Range about 16'.
 * Damage is current HP / 2. The level term is 0, so it is not divided.
 * Resist applies. Magic Attack Bonus is not applied, and the target's
 * magic defense is not applied. A magic burst would raise accuracy only.
 * This yard's magic burst is a damage multiplier, so Burst Affinity is
 * not spent and the hit is not multiplied. The script header still names
 * Liquefaction, Fusion, and Light.
 * Convergence is a locked merit, so it does not increase the breath.
 * The enmity box is blank. A hare in the fan is claimed.
 * Set bonus STR +3. Magic Attack Bonus is 4 trait points and 4 set points.
 * Memento Mori, Cursed Sphere, Sound Blast, or Eyes On Me completes it.
 * This spell alone does not grant the +20.
 * Learned from Manticores at Blue Magic 225+. Granted until one is in the yard.
 */
export const HEAT_RANGE = 16;

export const HEAT_BREATH = {
  kind: "breath",
  name: "Heat Breath",
  level: 71,
  mp: 169,
  points: 4,
  cast: 7.5,
  recast: 49,
  range: HEAT_RANGE,
  hpMod: 2,
  lvlMod: 0,
  noBurst: true,
  element: "fire",
  hp: 0,
  agi: 0,
  str: 3,
  dex: 0,
  chr: 0,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 0,
  mnd: 0,
  vit: 0,
  mabTrait: 4,
  family: "Manticore",
  learnSkill: blueLearnSkill(71),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Triumphant Roar. Attack on yourself. Fire, but a self buff.
 * Level 71, cast 3s, recast 90s, 3 points, duration 60s.
 * The card says 24 MP. The script header says 36. This yard uses 24.
 * The bonus is 15% attack, stored as 38/256. It stacks with Berserk,
 * Warcry, and Last Resort. It refreshes its own Attack Boost.
 * Nature's Meditation would overwrite it. That spell is not in the yard.
 * Diffusion is a locked merit, so the duration stays 60.
 * There is no damage, so Burst Affinity is not spent. Chain Affinity
 * is not spent. It does not break Mazurka.
 * Cumulative enmity 320, volatile 320. A spell on yourself does not claim.
 * Set bonus STR +3. The script says Combos: None, so it grants no trait.
 * Learned from Gargouilles, when they are not flying, at Blue Magic 225+.
 * Granted until one is in the yard.
 */
export const ROAR_SECONDS = 60;
export const ROAR_NUMER = 38;
export const ROAR_CE = 320;
export const ROAR_VE = 320;

export const TRIUMPHANT_ROAR = {
  kind: "triumph",
  name: "Triumphant Roar",
  level: 71,
  mp: 24,
  points: 3,
  cast: 3,
  recast: 90,
  seconds: ROAR_SECONDS,
  numer: ROAR_NUMER,
  ce: ROAR_CE,
  ve: ROAR_VE,
  hp: 0,
  agi: 0,
  str: 3,
  dex: 0,
  chr: 0,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 0,
  mnd: 0,
  vit: 0,
  family: "Gargouille",
  learnSkill: blueLearnSkill(71),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Sickle Slash. One blunt hit. Level 48, 41 MP, 4 points,
 * cast 0.5s. The script header and Gamer Escape recast in 20.5 seconds.
 * The current card says 20. This yard uses 20.5.
 * The script's damage type is hand-to-hand. This yard's pDIF stays the melee curve.
 * Range is 4.5'. WSC is DEX 50%. The coefficient stays 1.5 at every tier,
 * including Azure Lore. The skill term stops at 49.
 * Attack stays ×2.1, including Azure Lore and Chain Affinity. The script sets it unconditionally.
 * A connecting hit opens Compression.
 * The card says the critical chance varies with TP. The script sets 35 under Azure Lore,
 * and otherwise calculatefTP(TP, 0, 15, 30) only while Chain Affinity is up.
 * Chain Affinity already forces the critical hit, so that 0/15/30 walk is not used.
 * Without Chain Affinity or Azure Lore the chance stays 0.
 * Azure Lore sets the chance to 35%. That 35 is not a forced critical hit, and Azure Lore is not consumed.
 * The script subtracts the native 5% floor, so this yard does not add it.
 * Set bonus HP −5 and MP +15. Store TP is 4 trait points and 4 set points.
 * Tail Slap is the other half, also 4 and 4. The trait needs 8 trait points and 5 set points, and Blue Mage 69.
 * Neither spell grants it alone. Setting both does.
 * Learned from Spiders at Blue Magic 116+. Granted until a Spider is in the yard.
 */
export const SICKLE_RANGE = 4.5;
export const SICKLE_FTP = 1.5;
export const SICKLE_MULT = 2.1;
export const SICKLE_AZURE_CRIT = 0.35;

export const SICKLE_SLASH = {
  kind: "physical",
  name: "Sickle Slash",
  level: 48,
  mp: 41,
  points: 4,
  cast: 0.5,
  recast: 20.5,
  range: SICKLE_RANGE,
  hits: 1,
  ftp: SICKLE_FTP,
  dCap: 49,
  strMod: 0,
  dexMod: 0.5,
  chain: "Compression",
  hp: -5,
  agi: 0,
  str: 0,
  dex: 0,
  chr: 0,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 0,
  mnd: 0,
  vit: 0,
  setMp: 15,
  storeTrait: 4,
  family: "Spider",
  learnSkill: blueLearnSkill(48),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Sub-zero Smash. One blunt hit in a fan. Gamer Escape's animation looks like two hits.
 * Only one of them deals damage. Level 72, 44 MP, 4 points, cast 1s, recast 30s.
 * The fan is 5'. WSC is VIT 60%. The coefficient stays 2 at every tier, including Azure Lore.
 * The skill term is not capped. Attack stays ×1.05, including Azure Lore and Chain Affinity.
 * A connecting hit opens Fragmentation.
 * Additional effect: Paralyze, 10% for 180 seconds, only when the hit connects.
 * A blunt type is not an element, so the resist roll uses none. Magic accuracy uses INT.
 * A full resist and a quarter resist do not land. A half resist lasts 90 seconds.
 * It does not overwrite Paralyze, Paralyze II, or Jubaku. Jubaku is stored as Paralyze.
 * Mind Blast does overwrite. This spell does not.
 * Set bonus HP +10 and VIT +3. Fast Cast is 4 trait points and 4 set points.
 * Bad Breath is 4 trait points and 5 set points. The trait needs 8 trait points and 6 set points, and Blue Mage 72.
 * The rate is −5% casting time. Recast loses half of that. This spell alone does not grant it.
 * Setting it with Bad Breath does.
 * Learned from Ruszors at Blue Magic 230+. Granted until a Ruszor is in the yard.
 */
export const SUBZERO_RANGE = 5;
export const SUBZERO_FTP = 2;
export const SUBZERO_MULT = 1.05;
export const SUBZERO_PARA = 10;
export const SUBZERO_PARA_SECONDS = 180;

export const SUBZERO_SMASH = {
  kind: "physical",
  name: "Sub-zero Smash",
  level: 72,
  mp: 44,
  points: 4,
  cast: 1,
  recast: 30,
  range: SUBZERO_RANGE,
  hits: 1,
  ftp: SUBZERO_FTP,
  dCap: 999,
  strMod: 0,
  dexMod: 0,
  vitMod: 0.6,
  chain: "Fragmentation",
  cone: true,
  hp: 10,
  agi: 0,
  str: 0,
  dex: 0,
  chr: 0,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 0,
  mnd: 0,
  vit: 3,
  fastTrait: 4,
  family: "Ruszor",
  learnSkill: blueLearnSkill(72),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Saline Coat. Magic defense on yourself. Light. Level 72, 66 MP, 3 points,
 * cast 3s, recast 60s. The script's duration, with Diffusion's base, is 180 seconds.
 * The current card and Gamer Escape say 60. This yard uses 180.
 * Diffusion is a locked merit, so it is not applied.
 * The status is Magic Def. Boost 50. It loses 1 every 4 seconds and does not fall under 0.
 * BG-Wiki's stepped list, 50 then 37, 27, 20, 15, 11, and 8, is not the current script.
 * BG also notes a retail bug where the timer says 3 minutes and the effect wears a minute early.
 * That bug is not reproduced. The duration stays 180.
 * It overwrites Amplification's Magic Def. Boost of 10 and refreshes its own decay back to 50.
 * Amplification leaves this buff alone when it is still stronger than 10.
 * There is no damage, so Burst Affinity is not spent. Chain Affinity is not spent.
 * It does not break Mazurka.
 * Cumulative enmity 1, volatile 480. The script stores no enmity. The card prints that pair.
 * A spell on yourself does not claim.
 * Set bonus MP +10, VIT +2, and AGI +2. Defense Bonus is 4 trait points and 3 set points.
 * Grand Slam is 4 and 2. Terror Touch is 4 and 3. The trait needs 8 trait points and 5 set points.
 * This spell alone does not grant it. Setting it with Grand Slam does. Setting it with Terror Touch does.
 * Learned from Xzomits at Blue Magic 230+. Granted until an Xzomit is in the yard.
 */
export const SALINE_SECONDS = 180;
export const SALINE_MDB = 50;
export const SALINE_TICK = 4;
export const SALINE_CE = 1;
export const SALINE_VE = 480;

export const SALINE_COAT = {
  kind: "saline",
  name: "Saline Coat",
  level: 72,
  mp: 66,
  points: 3,
  cast: 3,
  recast: 60,
  seconds: SALINE_SECONDS,
  mdb: SALINE_MDB,
  tick: SALINE_TICK,
  ce: SALINE_CE,
  ve: SALINE_VE,
  hp: 0,
  agi: 2,
  str: 0,
  dex: 0,
  chr: 0,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 0,
  mnd: 0,
  vit: 2,
  setMp: 10,
  defenseTrait: 4,
  family: "Xzomit",
  learnSkill: blueLearnSkill(72),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Ram Charge. One blunt hit. Level 73, 79 MP, 4 points,
 * cast 0.5s, recast 34.75s. The range box is blank, so this yard uses 4.5',
 * the same reach as Uppercut.
 * WSC is STR 30% and MND 50%. The coefficient is 1 until Chain Affinity or Azure Lore is up.
 * Chain Affinity walks 1 at 0 TP, 1.375 at 1500, and 1.75 at 3000.
 * Azure Lore replaces it with 1.875. Raw TP stays 1.
 * The skill term is not capped. Attack stays ×2.5, including Azure Lore and Chain Affinity.
 * A connecting hit opens Fragmentation.
 * Knockback is graphical. The hare does not move. A connecting hit interrupts a spell the hare has started.
 * It does not apply Stun.
 * Set bonus HP +5. Lizard Killer is 4 trait points and 4 set points.
 * Foot Kick and Claw Cyclone are each 4 trait points and 2 set points.
 * The trait needs 8 trait points and 4 set points. This spell alone does not grant it.
 * Setting it with Foot Kick does. Setting it with Claw Cyclone does.
 * The Tropical Rarab is not a lizard, so the trait is not rolled.
 * Learned from Rams at Blue Magic 235+. Granted until a Ram is in the yard.
 */
export const RAM_RANGE = 4.5;
export const RAM_FTP = [1, 1.375, 1.75] as const;
export const RAM_FTP_AZURE = 1.875;
export const RAM_MULT = 2.5;

export const RAM_CHARGE = {
  kind: "physical",
  name: "Ram Charge",
  level: 73,
  mp: 79,
  points: 4,
  cast: 0.5,
  recast: 34.75,
  range: RAM_RANGE,
  hits: 1,
  ftp: RAM_FTP[0],
  dCap: 999,
  strMod: 0.3,
  dexMod: 0,
  mndMod: 0.5,
  chain: "Fragmentation",
  hp: 5,
  agi: 0,
  str: 0,
  dex: 0,
  chr: 0,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 0,
  mnd: 0,
  vit: 0,
  lizardTrait: 4,
  family: "Ram",
  learnSkill: blueLearnSkill(73),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Temporal Shift. Lightning stun around you. Level 73, 48 MP, 5 points,
 * cast 0.5s, recast 120s. The radius box is blank, so the circle is 10',
 * the same stand-in Battle Dance and Lowing use. It is not a fan and it is not a gaze.
 * Stun lasts 5 seconds. A half resist shortens it. A full resist does not land.
 * The script would still land a quarter resist at floor(5 × 0.25), one second.
 * This yard's second miss does not land that one second.
 * Magic accuracy is Blue Magic skill plus dINT. The element is lightning.
 * There is no damage, so Burst Affinity is not spent, even though the header
 * can magic burst Impaction, Fragmentation, and Light.
 * It overwrites a Stun already up and interrupts a spell the hare has started.
 * It does not give the hare TP. It breaks Mazurka.
 * Cumulative enmity 180, volatile 1020, when the hare is in the circle. The script stores no enmity.
 * The card prints that pair. A hare in range is claimed.
 * Set bonus HP +10 and MP +15. Attack Bonus is 4 trait points and 5 set points.
 * Battle Dance and Uppercut are 4 and 3. Death Scissors is 4 and 5. Spinal Cleave is 4 and 4.
 * The trait needs 8 trait points and 6 set points. This spell alone does not grant the +10.
 * Setting it with any one of those four does.
 * Learned from Hpemdes at Blue Magic 235+. Granted until an Hpemde is in the yard.
 */
export const SHIFT_RADIUS = 10;
export const SHIFT_SECONDS = 5;
export const SHIFT_CE = 180;
export const SHIFT_VE = 1020;

export const TEMPORAL_SHIFT = {
  kind: "shift",
  name: "Temporal Shift",
  level: 73,
  mp: 48,
  points: 5,
  cast: 0.5,
  recast: 120,
  radius: SHIFT_RADIUS,
  seconds: SHIFT_SECONDS,
  ce: SHIFT_CE,
  ve: SHIFT_VE,
  hp: 10,
  agi: 0,
  str: 0,
  dex: 0,
  chr: 0,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 4,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 0,
  mnd: 0,
  vit: 0,
  setMp: 15,
  family: "Hpemde",
  learnSkill: blueLearnSkill(73),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Magic Hammer. Light damage that steals MP equal to the damage.
 * Level 74, 40 MP, 4 points, cast 4s, recast 180s.
 * The range box is blank. This yard uses 12', the same stand-in Blitzstrahl uses.
 * The script's coefficient is 1.5, not the card's 1.0. Azure Lore adds 0.5.
 * Burst Affinity doubles the MND stat term and does not change 1.5.
 * initial D is level + 2, capped at 35. At 75 that term is 35.
 * WSC is 30% of MND times the level alpha. dMND is multiplied by 1.
 * Anything above 60 counts for half, and the term cannot fall under −17.
 * Magic Attack Bonus applies after the resist. Light staff, day, and weather do not.
 * The MP stolen is the damage, then clamped to the target's MP and to the caster's missing MP.
 * The script still deals the HP damage to undead and only skips the steal.
 * The spell page says it is ineffective against undead, so this yard deals no damage and steals nothing.
 * The Tropical Rarab is not undead. It has no MP, so a land steals nothing and the HP damage still lands.
 * Light matches Transfixion, Fusion, Light, and Radiance.
 * The enmity box is blank. The cast claims, and the damage adds its own enmity.
 * It breaks Mazurka. Chain Affinity is not spent.
 * Set bonus MP −5 and MND +2. Magic Attack Bonus is 4 trait points and 4 set points.
 * The trait needs 8 trait points and 3 set points. This spell alone does not grant it.
 * Cursed Sphere, Sound Blast, Memento Mori, Eyes On Me, Heat Breath, or Reactor Cool completes it.
 * Learned from Poroggo at Blue Magic 240+. Granted until a Poroggo is in the yard.
 */
export const HAMMER_RANGE = 12;
export const HAMMER_FTP = 1.5;
export const HAMMER_AZURE = 0.5;
export const HAMMER_CAP = 35;
export const HAMMER_HALF = 60;
export const HAMMER_LOW = -17;

export const MAGIC_HAMMER = {
  kind: "hammer",
  name: "Magic Hammer",
  level: 74,
  mp: 40,
  points: 4,
  cast: 4,
  recast: 180,
  range: HAMMER_RANGE,
  ftp: HAMMER_FTP,
  azureFtp: HAMMER_AZURE,
  mndMod: 0.3,
  dStat: 1,
  dCap: HAMMER_CAP,
  half: HAMMER_HALF,
  low: HAMMER_LOW,
  hp: 0,
  agi: 0,
  str: 0,
  dex: 0,
  chr: 0,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 0,
  mnd: 2,
  vit: 0,
  setMp: -5,
  mabTrait: 4,
  family: "Poroggo",
  learnSkill: blueLearnSkill(74),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Reactor Cool. Defense Boost and Ice Spikes on yourself. Ice.
 * Level 74, 28 MP, 5 points, cast 3s, recast 60s.
 * The card says 3 minutes. The script's base duration is 120 seconds.
 * This yard uses 120. Diffusion would lengthen it. Diffusion is a locked merit.
 * Defense is +12%. That is 31/256, the same scale Cocoon uses for 128/256.
 * It overwrites Defense Boost and Ice Spikes no matter which is stronger,
 * including Cocoon's +50%. Cocoon overwrites this boost in return.
 * Ice Spikes use the script's power 5, not the black-magic INT formula.
 * Magic Attack Bonus is read when a hit connects. There is no stun.
 * It overwrites Blaze Spikes and Shock Spikes because this yard keeps one spikes status.
 * Reprisal is left alone.
 * Cumulative enmity 1, volatile 480. The script stores no enmity. The card prints that pair.
 * A spell on yourself does not claim. There is no damage, so Burst Affinity is not spent.
 * Chain Affinity is not spent. It does not break Mazurka.
 * Set bonus INT +3 and MND +3. Magic Attack Bonus is 4 trait points and 5 set points.
 * This spell alone does not grant the +20. Magic Hammer, Memento Mori, Cursed Sphere,
 * Sound Blast, Eyes On Me, or Heat Breath completes it.
 * Learned from Zdei at Blue Magic 240+. Granted until a Zdei is in the yard.
 */
export const REACTOR_SECONDS = 120;
export const REACTOR_DEFENSE = 31;
export const REACTOR_SPIKE = 5;
export const REACTOR_CE = 1;
export const REACTOR_VE = 480;

export const REACTOR_COOL = {
  kind: "reactor",
  name: "Reactor Cool",
  level: 74,
  mp: 28,
  points: 5,
  cast: 3,
  recast: 60,
  seconds: REACTOR_SECONDS,
  defenseNumer: REACTOR_DEFENSE,
  spike: REACTOR_SPIKE,
  ce: REACTOR_CE,
  ve: REACTOR_VE,
  hp: 0,
  agi: 0,
  str: 0,
  dex: 0,
  chr: 0,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 3,
  mnd: 3,
  vit: 0,
  mabTrait: 4,
  family: "Zdei",
  learnSkill: blueLearnSkill(74),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Exuviation. Restores HP and removes one Erase effect. Fire, on yourself.
 * Level 75, 40 MP, 4 points, cast 3s, recast 60s.
 * The cure table is the script's: minimum 60, then the Healing Breeze bands.
 * The spell page's soft cap is 85, so every band stops there.
 * Ailments do not change the heal. Diffusion would share it. Diffusion is locked.
 * Erase removes one effect Erase can remove. Songs that Erase takes are on that list.
 * Poisona effects are not removed. Nothing to remove still heals.
 * Divine Seal doubles the heal. It does not damage undead.
 * Cumulative enmity 640, volatile 640, plus the cure enmity of the HP that landed.
 * A spell on yourself does not claim. There is no damage, so Burst Affinity is not spent.
 * Chain Affinity is not spent. It does not break Mazurka.
 * Set bonus HP +5, MP +5, and CHR +1. Resist Sleep is 4 trait points and 4 set points.
 * The trait needs 8 trait points and 4 set points. This spell alone does not grant it.
 * Pollen, Wild Carrot, Magic Fruit, or Yawn completes it.
 * Learned from Wamoura at Blue Magic 245+. Granted until a Wamoura is in the yard.
 */
export const EXUV_CAP = 85;
export const EXUV_CE = 640;
export const EXUV_VE = 640;

export const EXUVIATION = {
  kind: "exuv",
  name: "Exuviation",
  level: 75,
  mp: 40,
  points: 4,
  cast: 3,
  recast: 60,
  ce: EXUV_CE,
  ve: EXUV_VE,
  hp: 5,
  agi: 0,
  str: 0,
  dex: 0,
  chr: 1,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 4,
  int: 0,
  mnd: 0,
  vit: 0,
  setMp: 5,
  family: "Wamoura",
  learnSkill: blueLearnSkill(75),
  granted: true,
} satisfies BlueSpell;

/**
 * BG-Wiki Vertical Cleave. One slashing hit. Level 75, 86 MP, 3 points,
 * cast 0.5s, recast 37.25s. The range box is blank, so this yard uses 4.5'.
 * WSC is 50% STR. The coefficient stays 3 at every TP tier, including Chain Affinity and Azure Lore.
 * The skill term stops at 89. Attack is ×1.05. Chain Affinity walks that attack
 * 1.05 at 0 TP, 2.1 at 1500, and 2.2 at 3000. Azure Lore replaces it with 2.25.
 * Additional TP does not raise the coefficient. The script's tp modifier is attack.
 * A connecting hit opens Gravitation. It ignores Utsusemi. The hare has no shadows, so that clause is not rolled.
 * The enmity box is blank. The cast claims, and the damage adds its own enmity.
 * A connecting hit gives the hare 100 TP. It breaks Mazurka. Burst Affinity is not spent.
 * Set bonus VIT +1, HP −5, and MP +5. Defense Bonus is 4 trait points and 3 set points.
 * The trait needs 8 trait points and 5 set points. This spell alone does not grant it.
 * Grand Slam, Terror Touch, or Saline Coat completes it.
 * Learned from Euvhi, in the open flower state, at Blue Magic 245+.
 * Granted until an Euvhi is in the yard.
 */
export const CLEAVE_RANGE = 4.5;
export const CLEAVE_FTP = 3;
export const CLEAVE_MULT = 1.05;
export const CLEAVE_ATTACK = [1.05, 2.1, 2.2] as const;
export const CLEAVE_ATTACK_AZURE = 2.25;

export const VERTICAL_CLEAVE = {
  kind: "physical",
  name: "Vertical Cleave",
  level: 75,
  mp: 86,
  points: 3,
  cast: 0.5,
  recast: 37.25,
  range: CLEAVE_RANGE,
  hits: 1,
  ftp: CLEAVE_FTP,
  dCap: 89,
  strMod: 0.5,
  dexMod: 0,
  chain: "Gravitation",
  hp: -5,
  agi: 0,
  str: 0,
  dex: 0,
  chr: 0,
  refreshTrait: 0,
  conserveTrait: 0,
  regenTrait: 0,
  attackTrait: 0,
  accuracyTrait: 0,
  sleepTrait: 0,
  int: 0,
  mnd: 0,
  vit: 1,
  setMp: 5,
  defenseTrait: 4,
  family: "Euvhi",
  learnSkill: blueLearnSkill(75),
  granted: true,
} satisfies BlueSpell;

export const BLUE_SPELLS: readonly BlueSpell[] = [FOOT_KICK, SANDSPIN, POLLEN, POWER_ATTACK, SPROUT_SMACK, WILD_OATS, COCOON, METALLIC_BODY, QUEASYSHROOM, BATTLE_DANCE, HEAD_BUTT, FEATHER_STORM, HEALING_BREEZE, SHEEP_SONG, HELLDIVE, BLUDGEON, CURSED_SPHERE, BLASTBOMB, CLAW_CYCLONE, POISON_BREATH, SOPORIFIC, SCREWDRIVER, BOMB_TOSS, GRAND_SLAM, WILD_CARROT, CHAOTIC_EYE, SOUND_BLAST, DEATH_RAY, SMITE_OF_RAGE, DIGEST, PINECONE_BOMB, MP_DRAINKISS, BLITZSTRAHL, STINKING_GAS, MANDIBULAR_BITE, MAGNETITE_CLOUD, UPPERCUT, BLANK_GAZE, JET_STREAM, MYSTERIOUS_LIGHT, TERROR_TOUCH, VENOM_SHELL, REFUELING, MAGIC_FRUIT, MEMENTO_MORI, FRENETIC_RIP, ZEPHYR_MANTLE, CANNONBALL, DISSEVERMENT, MIND_BLAST, ACTINIC_BURST, PLASMA_CHARGE, GEIST_WALL, AWFUL_EYE, BLOOD_SABER, JETTATURA, ICE_BREAK, SELF_DESTRUCT, FRIGHTFUL_ROAR, COLD_WAVE, FILAMENTED_HOLD, HECATOMB_WAVE, RADIANT_BREATH, FEATHER_BARRIER, FLYING_HIP_PRESS, LIGHT_OF_PENANCE, DEATH_SCISSORS, DIMENSIONAL_DEATH, SPIRAL_SPIN, MAELSTROM, EYES_ON_ME, SEEDSPRAY, BAD_BREATH, BODY_SLAM, THOUSAND_NEEDLES, SPINAL_CLEAVE, FRYPAN, HYDRO_SHOT, FEATHER_TICKLE, YAWN, VORACIOUS_TRUNK, INFRASONICS, FROST_BREATH, SANDSPRAY, CORROSIVE_OOZE, DIAMONDHIDE, ENERVATION, WARM_UP, FIRESPIT, TAIL_SLAP, HYSTERIC_BARRAGE, REGURGITATION, AMPLIFICATION, ASURAN_CLAWS, LOWING, HEAT_BREATH, TRIUMPHANT_ROAR, SICKLE_SLASH, SUBZERO_SMASH, SALINE_COAT, RAM_CHARGE, TEMPORAL_SHIFT, MAGIC_HAMMER, REACTOR_COOL, EXUVIATION, VERTICAL_CLEAVE];

export function blueSpellByName(name: string): BlueSpell | undefined {
  return BLUE_SPELLS.find((spell) => spell.name === name);
}

/** Points and spell slots a main-job Blue Mage can set. Level 75 is 45 and 20. */
export function bluePointCap(level: number): { points: number; slots: number } {
  const lv = Math.max(1, Math.min(75, Math.floor(level)));
  const band = Math.floor((lv - 1) / 10);
  return { points: 10 + band * 5, slots: Math.min(20, 6 + band * 2) };
}

/** Blue Magic skill required to learn a spell of this level. Foot Kick is 0. */
export function blueLearnSkill(spellLevel: number): number {
  return Math.max(0, skillCap("A+", spellLevel) - 31);
}

export function blueSetAgi(names: readonly string[]): number {
  let agi = 0;
  for (const name of names) agi += blueSpellByName(name)?.agi ?? 0;
  return agi;
}

export function blueSetHp(names: readonly string[]): number {
  let hp = 0;
  for (const name of names) hp += blueSpellByName(name)?.hp ?? 0;
  return hp;
}

export function blueSetStr(names: readonly string[]): number {
  let str = 0;
  for (const name of names) str += blueSpellByName(name)?.str ?? 0;
  return str;
}

export function blueSetDex(names: readonly string[]): number {
  let dex = 0;
  for (const name of names) dex += blueSpellByName(name)?.dex ?? 0;
  return dex;
}

export function blueSetChr(names: readonly string[]): number {
  let chr = 0;
  for (const name of names) chr += blueSpellByName(name)?.chr ?? 0;
  return chr;
}

export function blueSetInt(names: readonly string[]): number {
  let int = 0;
  for (const name of names) int += blueSpellByName(name)?.int ?? 0;
  return int;
}

export function blueSetMnd(names: readonly string[]): number {
  let mnd = 0;
  for (const name of names) mnd += blueSpellByName(name)?.mnd ?? 0;
  return mnd;
}

export function blueSetVit(names: readonly string[]): number {
  let vit = 0;
  for (const name of names) vit += blueSpellByName(name)?.vit ?? 0;
  return vit;
}

/** MP granted by set spells. Mind Blast is 5. A support job does not receive it. */
export function blueSetMp(names: readonly string[]): number {
  let mp = 0;
  for (const name of names) mp += blueSpellByName(name)?.setMp ?? 0;
  return mp;
}

/** Auto Refresh I is 1 MP a tick. The page needs 8 trait points and 8 set points. */
export const AUTO_REFRESH_TRAIT = 8;
export const AUTO_REFRESH_SET = 8;

export function blueAutoRefresh(names: readonly string[]): number {
  let trait = 0;
  let set = 0;
  for (const name of names) {
    const spell = blueSpellByName(name);
    if (!spell || spell.refreshTrait <= 0) continue;
    trait += spell.refreshTrait;
    set += spell.points;
  }
  return trait >= AUTO_REFRESH_TRAIT && set >= AUTO_REFRESH_SET ? 1 : 0;
}

/** Spells the yard grants before their monsters exist. */
export function grantedBlueSpells(): string[] {
  return BLUE_SPELLS.filter((spell) => spell.granted).map((spell) => spell.name);
}

export function withGrantedBlue(learned: readonly string[]): string[] {
  const out = [...learned];
  for (const name of grantedBlueSpells()) {
    if (!out.includes(name)) out.push(name);
  }
  return out;
}

/**
 * Flash from the white-magic spell is stronger. Actinic Burst refreshes
 * its own Flash and does not replace the white-magic one.
 */
export function actinicCanReplace(current: { name: string; flashFrom?: "spell" | "burst" } | undefined): boolean {
  if (!current || current.name !== "Flash") return true;
  return current.flashFrom === "burst";
}

/** Blue Magic skill, plus dMND, plus the probable +200. */
export function actinicMagicAccuracy(blueSkill: number, dMnd: number): number {
  return composedMagicAccuracy(blueSkill, dMnd, ACTINIC_MACC);
}

/**
 * Silence from the enfeebling spell is stronger. Chaotic Eye refreshes
 * its own Silence and does not replace any other Silence.
 * A missing source is treated as the spell.
 */
export function chaoticCanReplace(current: { name: string; silenceFrom?: "spell" | "eye" | "breath" } | undefined): boolean {
  if (!current || current.name !== "Silence") return true;
  return current.silenceFrom === "eye";
}

/** Blue Magic skill plus dMND. Chaotic Eye prints no magic accuracy bonus. */
export function chaoticMagicAccuracy(blueSkill: number, dMnd: number): number {
  return composedMagicAccuracy(blueSkill, dMnd, 0);
}

/**
 * Zephyr Mantle is the weakest shadow. Utsusemi, white Blink, and Aerial
 * Armor are already up when this returns false. Its own Blink can refresh.
 * A Blink with no source is treated as one of the stronger ones.
 */
export function mantleCanReplace(buffs: readonly { name: string; charges?: number; blinkFrom?: "spell" | "mantle" | "aerial" }[]): boolean {
  if (buffs.some((buff) => buff.name === "Copy Image" && (buff.charges ?? 0) > 0)) return false;
  const blink = buffs.find((buff) => buff.name === "Blink");
  if (!blink) return true;
  return blink.blinkFrom === "mantle";
}

/**
 * Refueling is the weakest Haste. White Haste and Hastega replace it.
 * Its own Haste can refresh. A Haste with no source is treated as one
 * of the stronger ones. Slow, Slowga, Spider Web, Intimidate, Sticky
 * Thread, and Horror Cloud are not on you, so they are not checked.
 */
export function refuelCanReplace(buffs: readonly { name: string; hasteFrom?: "spell" | "refuel" | "hastega" }[]): boolean {
  const haste = buffs.find((buff) => buff.name === "Haste");
  if (!haste) return true;
  return haste.hasteFrom === "refuel";
}

/** Conserve MP I is a 25% proc. The page needs 8 trait points and 4 set points. */
export const CONSERVE_TRAIT = 8;
export const CONSERVE_SET = 4;
export const CONSERVE_RATE = 0.25;

export function blueConserveMp(names: readonly string[]): number {
  let trait = 0;
  let set = 0;
  for (const name of names) {
    const spell = blueSpellByName(name);
    if (!spell || spell.conserveTrait <= 0) continue;
    trait += spell.conserveTrait;
    set += spell.points;
  }
  return trait >= CONSERVE_TRAIT && set >= CONSERVE_SET ? CONSERVE_RATE : 0;
}

/** Auto Regen I is 1 HP a tick. The page needs 8 trait points and 6 set points. */
export const AUTO_REGEN_TRAIT = 8;
export const AUTO_REGEN_SET = 6;

export function blueAutoRegen(names: readonly string[]): number {
  let trait = 0;
  let set = 0;
  for (const name of names) {
    const spell = blueSpellByName(name);
    if (!spell || spell.regenTrait <= 0) continue;
    trait += spell.regenTrait;
    set += spell.points;
  }
  return trait >= AUTO_REGEN_TRAIT && set >= AUTO_REGEN_SET ? 1 : 0;
}

/** Attack Bonus I is +10. The page needs 8 trait points and 6 set points. */
export const ATTACK_BONUS_TRAIT = 8;
export const ATTACK_BONUS_SET = 6;
export const ATTACK_BONUS_ATTACK = 10;

export function blueAttackBonus(names: readonly string[]): number {
  let trait = 0;
  let set = 0;
  for (const name of names) {
    const spell = blueSpellByName(name);
    if (!spell || spell.attackTrait <= 0) continue;
    trait += spell.attackTrait;
    set += spell.points;
  }
  return trait >= ATTACK_BONUS_TRAIT && set >= ATTACK_BONUS_SET ? ATTACK_BONUS_ATTACK : 0;
}

/** Accuracy Bonus I is +10. The page needs 8 trait points and 5 set points. Tier II is level 82. */
export const ACCURACY_BONUS_TRAIT = 8;
export const ACCURACY_BONUS_SET = 5;
export const ACCURACY_BONUS_ACC = 10;

export function blueAccuracyBonus(names: readonly string[]): number {
  let trait = 0;
  let set = 0;
  for (const name of names) {
    const spell = blueSpellByName(name);
    if (!spell || spell.accuracyTrait <= 0) continue;
    trait += spell.accuracyTrait;
    set += spell.points;
  }
  return trait >= ACCURACY_BONUS_TRAIT && set >= ACCURACY_BONUS_SET ? ACCURACY_BONUS_ACC : 0;
}

/** Resist Sleep I is 10%. The page needs 8 trait points and 4 set points. Tier II is level 64. */
export const RESIST_SLEEP_TRAIT = 8;
export const RESIST_SLEEP_SET = 4;
export const RESIST_SLEEP_RATE = 0.1;

export function blueResistSleep(names: readonly string[]): number {
  let trait = 0;
  let set = 0;
  for (const name of names) {
    const spell = blueSpellByName(name);
    if (!spell || spell.sleepTrait <= 0) continue;
    trait += spell.sleepTrait;
    set += spell.points;
  }
  return trait >= RESIST_SLEEP_TRAIT && set >= RESIST_SLEEP_SET ? RESIST_SLEEP_RATE : 0;
}

/** Magic Attack Bonus I is +20. The page needs 8 trait points and 3 set points. Tier II is 16 trait points. */
export const MAGIC_ATTACK_TRAIT = 8;
export const MAGIC_ATTACK_SET = 3;
export const MAGIC_ATTACK_BONUS = 20;

export function blueMagicAttackBonus(names: readonly string[]): number {
  let trait = 0;
  let set = 0;
  for (const name of names) {
    const spell = blueSpellByName(name);
    if (!spell || (spell.mabTrait ?? 0) <= 0) continue;
    trait += spell.mabTrait ?? 0;
    set += spell.points;
  }
  return trait >= MAGIC_ATTACK_TRAIT && set >= MAGIC_ATTACK_SET ? MAGIC_ATTACK_BONUS : 0;
}

/** Clear Mind I is +3 while resting. The page needs 8 trait points and 3 set points. */
export const CLEAR_MIND_TRAIT = 8;
export const CLEAR_MIND_SET = 3;
export const CLEAR_MIND_BONUS = 3;

export function blueClearMind(names: readonly string[]): number {
  let trait = 0;
  let set = 0;
  for (const name of names) {
    const spell = blueSpellByName(name);
    if (!spell || (spell.clearTrait ?? 0) <= 0) continue;
    trait += spell.clearTrait ?? 0;
    set += spell.points;
  }
  return trait >= CLEAR_MIND_TRAIT && set >= CLEAR_MIND_SET ? CLEAR_MIND_BONUS : 0;
}

/** Beast Killer I is +8% damage dealt to beasts. The page needs 8 trait points and 5 set points. */
export const BEAST_KILLER_TRAIT = 8;
export const BEAST_KILLER_SET = 5;
export const BEAST_KILLER_RATE = 0.08;

export function blueBeastKiller(names: readonly string[]): number {
  let trait = 0;
  let set = 0;
  for (const name of names) {
    const spell = blueSpellByName(name);
    if (!spell || (spell.beastTrait ?? 0) <= 0) continue;
    trait += spell.beastTrait ?? 0;
    set += spell.points;
  }
  return trait >= BEAST_KILLER_TRAIT && set >= BEAST_KILLER_SET ? BEAST_KILLER_RATE : 0;
}

/** Plantoid Killer I is +8%. The page needs 8 trait points and 3 set points. Tier I is level 44. */
export const PLANTOID_KILLER_TRAIT = 8;
export const PLANTOID_KILLER_SET = 3;

export function bluePlantoidKiller(names: readonly string[]): number {
  let trait = 0;
  let set = 0;
  for (const name of names) {
    const spell = blueSpellByName(name);
    if (!spell || (spell.plantTrait ?? 0) <= 0) continue;
    trait += spell.plantTrait ?? 0;
    set += spell.points;
  }
  return trait >= PLANTOID_KILLER_TRAIT && set >= PLANTOID_KILLER_SET ? 0.08 : 0;
}

/** Max MP Boost I is +10 MP. The page needs 8 trait points, 4 set points, and Blue Mage 40. */
export const MAX_MP_BOOST_TRAIT = 8;
export const MAX_MP_BOOST_SET = 4;
export const MAX_MP_BOOST_LEVEL = 40;
export const MAX_MP_BOOST_MP = 10;

export function blueMaxMpBoost(names: readonly string[], level: number): number {
  let trait = 0;
  let set = 0;
  for (const name of names) {
    const spell = blueSpellByName(name);
    if (!spell || (spell.mpTrait ?? 0) <= 0) continue;
    trait += spell.mpTrait ?? 0;
    set += spell.points;
  }
  return trait >= MAX_MP_BOOST_TRAIT && set >= MAX_MP_BOOST_SET && level >= MAX_MP_BOOST_LEVEL ? MAX_MP_BOOST_MP : 0;
}

/** Rapid Shot I is about 25%. The page needs 8 trait points, 6 set points, and Blue Mage 38. */
export const RAPID_SHOT_TRAIT = 8;
export const RAPID_SHOT_SET = 6;
export const RAPID_SHOT_LEVEL = 38;
export const RAPID_SHOT_RATE = 0.25;

export function blueRapidShot(names: readonly string[], level: number): number {
  let trait = 0;
  let set = 0;
  for (const name of names) {
    const spell = blueSpellByName(name);
    if (!spell || (spell.rapidTrait ?? 0) <= 0) continue;
    trait += spell.rapidTrait ?? 0;
    set += spell.points;
  }
  return trait >= RAPID_SHOT_TRAIT && set >= RAPID_SHOT_SET && level >= RAPID_SHOT_LEVEL ? RAPID_SHOT_RATE : 0;
}

/** Undead Killer I is +8%. The page needs 8 trait points and 5 set points. Smite of Rage is the other half. */
export const UNDEAD_KILLER_TRAIT = 8;
export const UNDEAD_KILLER_SET = 5;
export const UNDEAD_KILLER_RATE = 0.08;

export function blueUndeadKiller(names: readonly string[]): number {
  let trait = 0;
  let set = 0;
  for (const name of names) {
    const spell = blueSpellByName(name);
    if (!spell || (spell.undeadTrait ?? 0) <= 0) continue;
    trait += spell.undeadTrait ?? 0;
    set += spell.points;
  }
  return trait >= UNDEAD_KILLER_TRAIT && set >= UNDEAD_KILLER_SET ? UNDEAD_KILLER_RATE : 0;
}

/** Lizard Killer I is +8%. The page needs 8 trait points and 4 set points. Foot Kick and Claw Cyclone are the pair. */
export const LIZARD_KILLER_TRAIT = 8;
export const LIZARD_KILLER_SET = 4;
export const LIZARD_KILLER_RATE = 0.08;

export function blueLizardKiller(names: readonly string[]): number {
  let trait = 0;
  let set = 0;
  for (const name of names) {
    const spell = blueSpellByName(name);
    if (!spell || (spell.lizardTrait ?? 0) <= 0) continue;
    trait += spell.lizardTrait ?? 0;
    set += spell.points;
  }
  return trait >= LIZARD_KILLER_TRAIT && set >= LIZARD_KILLER_SET ? LIZARD_KILLER_RATE : 0;
}

/** Evasion Bonus I is +10. The page needs 8 trait points and 6 set points. Hysteric Barrage is the other half. */
export const EVASION_BONUS_TRAIT = 8;
export const EVASION_BONUS_SET = 6;
export const EVASION_BONUS = 10;

export function blueEvasionBonus(names: readonly string[]): number {
  let trait = 0;
  let set = 0;
  for (const name of names) {
    const spell = blueSpellByName(name);
    if (!spell || (spell.evasionTrait ?? 0) <= 0) continue;
    trait += spell.evasionTrait ?? 0;
    set += spell.points;
  }
  return trait >= EVASION_BONUS_TRAIT && set >= EVASION_BONUS_SET ? EVASION_BONUS : 0;
}

/** Defense Bonus I is +10 defense. The page needs 8 trait points and 5 set points. Terror Touch is the other half. */
export const DEFENSE_BONUS_TRAIT = 8;
export const DEFENSE_BONUS_SET = 5;
export const DEFENSE_BONUS = 10;

export function blueDefenseBonus(names: readonly string[]): number {
  let trait = 0;
  let set = 0;
  for (const name of names) {
    const spell = blueSpellByName(name);
    if (!spell || (spell.defenseTrait ?? 0) <= 0) continue;
    trait += spell.defenseTrait ?? 0;
    set += spell.points;
  }
  return trait >= DEFENSE_BONUS_TRAIT && set >= DEFENSE_BONUS_SET ? DEFENSE_BONUS : 0;
}

/** Magic Defense Bonus I is +10. The page needs 8 trait points, 6 set points, and Blue Mage 50. Ice Break is the other half. */
export const MAGIC_DEFENSE_TRAIT = 8;
export const MAGIC_DEFENSE_SET = 6;
export const MAGIC_DEFENSE_LEVEL = 50;
export const MAGIC_DEFENSE_BONUS = 10;

export function blueMagicDefenseBonus(names: readonly string[], level: number): number {
  let trait = 0;
  let set = 0;
  for (const name of names) {
    const spell = blueSpellByName(name);
    if (!spell || (spell.mdbTrait ?? 0) <= 0) continue;
    trait += spell.mdbTrait ?? 0;
    set += spell.points;
  }
  return trait >= MAGIC_DEFENSE_TRAIT && set >= MAGIC_DEFENSE_SET && level >= MAGIC_DEFENSE_LEVEL ? MAGIC_DEFENSE_BONUS : 0;
}

/** Max HP Boost I is +30 HP. The page needs 8 trait points, 5 set points, and Blue Mage 62. Flying Hip Press is 4 and 3. */
export const MAX_HP_BOOST_TRAIT = 8;
export const MAX_HP_BOOST_SET = 5;
export const MAX_HP_BOOST_LEVEL = 62;
export const MAX_HP_BOOST_HP = 30;

export function blueMaxHpBoost(names: readonly string[], level: number): number {
  let trait = 0;
  let set = 0;
  for (const name of names) {
    const spell = blueSpellByName(name);
    if (!spell || (spell.hpTrait ?? 0) <= 0) continue;
    trait += spell.hpTrait ?? 0;
    set += spell.points;
  }
  return trait >= MAX_HP_BOOST_TRAIT && set >= MAX_HP_BOOST_SET && level >= MAX_HP_BOOST_LEVEL ? MAX_HP_BOOST_HP : 0;
}

/** Fast Cast tier 0 is −5% casting time. The page needs 8 trait points, 6 set points, and Blue Mage 72. Bad Breath is 4 and 5. */
export const FAST_CAST_TRAIT = 8;
export const FAST_CAST_SET = 6;
export const FAST_CAST_LEVEL = 72;
export const FAST_CAST_RATE = 0.05;

export function blueFastCast(names: readonly string[], level: number): number {
  let trait = 0;
  let set = 0;
  for (const name of names) {
    const spell = blueSpellByName(name);
    if (!spell || (spell.fastTrait ?? 0) <= 0) continue;
    trait += spell.fastTrait ?? 0;
    set += spell.points;
  }
  return trait >= FAST_CAST_TRAIT && set >= FAST_CAST_SET && level >= FAST_CAST_LEVEL ? FAST_CAST_RATE : 0;
}

/** Resist Gravity I is 10%. The page needs 8 trait points, 3 set points, and Blue Mage 69. Feather Barrier is 4 and 2. */
export const RESIST_GRAVITY_TRAIT = 8;
export const RESIST_GRAVITY_SET = 3;
export const RESIST_GRAVITY_LEVEL = 69;
export const RESIST_GRAVITY_RATE = 0.1;

export function blueResistGravity(names: readonly string[], level: number): number {
  let trait = 0;
  let set = 0;
  for (const name of names) {
    const spell = blueSpellByName(name);
    if (!spell || (spell.gravityTrait ?? 0) <= 0) continue;
    trait += spell.gravityTrait ?? 0;
    set += spell.points;
  }
  return trait >= RESIST_GRAVITY_TRAIT && set >= RESIST_GRAVITY_SET && level >= RESIST_GRAVITY_LEVEL ? RESIST_GRAVITY_RATE : 0;
}

/** Store TP I is +10. The page needs 8 trait points, 5 set points, and Blue Mage 69. Tail Slap and Sickle Slash are each 4 and 4, so neither reaches it alone. */
export const STORE_TP_TRAIT = 8;
export const STORE_TP_SET = 5;
export const STORE_TP_LEVEL = 69;
export const STORE_TP = 10;

export function blueStoreTp(names: readonly string[], level: number): number {
  let trait = 0;
  let set = 0;
  for (const name of names) {
    const spell = blueSpellByName(name);
    if (!spell || (spell.storeTrait ?? 0) <= 0) continue;
    trait += spell.storeTrait ?? 0;
    set += spell.points;
  }
  return trait >= STORE_TP_TRAIT && set >= STORE_TP_SET && level >= STORE_TP_LEVEL ? STORE_TP : 0;
}

/** Counter I is an 8% rate. The page needs 8 trait points and 5 set points. Tier I is level 70. Enervation and Asuran Claws are each 4 trait points, so neither reaches 8 alone. */
export const COUNTER_TRAIT = 8;
export const COUNTER_SET = 5;
export const COUNTER_LEVEL = 70;
export const COUNTER_RATE = 0.08;

export function blueCounter(names: readonly string[]): number {
  let trait = 0;
  let set = 0;
  for (const name of names) {
    const spell = blueSpellByName(name);
    if (!spell || (spell.counterTrait ?? 0) <= 0) continue;
    trait += spell.counterTrait ?? 0;
    set += spell.points;
  }
  return trait >= COUNTER_TRAIT && set >= COUNTER_SET ? COUNTER_RATE : 0;
}

export function blueSetTraits(names: readonly string[]): BluTrait[] {
  const rows: BluTrait[] = [];
  if (blueAutoRegen(names) >= 1) {
    rows.push({
      name: "Auto Regen",
      level: 16,
      access: "main",
      effect: "1 HP every 3 seconds. Healing Breeze is 4 trait points and 4 set points. Sheep Song is 4 trait points and 2 set points. Auto Regen needs 8 trait points and 6 set points, so neither spell grants it alone. Setting both does. It does not stack with a support job. The higher value is kept. It is separate from the Regen spell, which still ticks on its own.",
    });
  }
  if (blueResistSleep(names) > 0) {
    rows.push({
      name: "Resist Sleep",
      level: 30,
      access: "main",
      effect: "10% chance to fully resist Sleep. Pollen is 4 trait points and 1 set point. Wild Carrot and Magic Fruit are 4 trait points and 3 set points each. Yawn is 4 trait points and 3 set points. Exuviation is 4 trait points and 4 set points. Resist Sleep needs 8 trait points and 4 set points, so none of them grants it alone. Pollen with either cure does. Wild Carrot with Magic Fruit does. Pollen with Yawn does. Yawn with Wild Carrot does. Yawn with Magic Fruit does. Exuviation with Pollen, Wild Carrot, Magic Fruit, or Yawn does. It does not stack with Paladin. The higher value is kept. Nothing here sleeps you, so it is not rolled. It does not apply to Repose or Sheep Song.",
    });
  }
  if (blueAttackBonus(names) > 0) {
    rows.push({
      name: "Attack Bonus",
      level: 38,
      access: "main",
      effect: "Attack +10. Battle Dance is 4 trait points and 3 set points. Uppercut is 4 trait points and 3 set points. Death Scissors is 4 trait points and 5 set points. Spinal Cleave is 4 trait points and 4 set points. Temporal Shift is 4 trait points and 5 set points. Attack Bonus needs 8 trait points and 6 set points, so none of them grants it alone. Setting Battle Dance with Uppercut does. Death Scissors with either of those does. Spinal Cleave with Battle Dance, Uppercut, or Death Scissors does. Temporal Shift with Battle Dance, Uppercut, Death Scissors, or Spinal Cleave does. It does not stack with Warrior, Dark Knight, or Dragoon. The higher value is kept.",
    });
  }
  if (blueAccuracyBonus(names) > 0) {
    rows.push({
      name: "Accuracy Bonus",
      level: 63,
      access: "main",
      effect: "Accuracy +10, melee and ranged. Frenetic Rip is 4 trait points and 3 set points. Disseverment is 4 trait points and 5 set points. Dimensional Death is 4 trait points and 5 set points. Accuracy Bonus needs 8 trait points and 5 set points, so none of them grants it alone. Setting Frenetic Rip with Disseverment does. Dimensional Death with either of those does. The next tier is level 82. It does not stack with Ranger. The higher value is kept.",
    });
  }
  if (blueAutoRefresh(names) >= 1) {
    rows.push({
      name: "Auto Refresh",
      level: 58,
      access: "main",
      effect: "1 MP every 3 seconds. Actinic Burst and Plasma Charge are 4 trait points each. Stinking Gas is 1 trait point and 2 set points. Self-Destruct and Frightful Roar are 2 trait points and 3 set points each. Cold Wave is 1 trait point and 1 set point. Light of Penance is 2 trait points and 5 set points. Voracious Trunk is 3 trait points and 4 set points. Auto Refresh needs 8 trait points and 8 set points, so none of them grants it alone. Stinking Gas with either Actinic Burst or Plasma Charge is still short. Cold Wave with any one of them is still short. Self-Destruct with Frightful Roar is still short. Light of Penance alone is still short. Voracious Trunk alone is still short. Voracious Trunk with Actinic Burst is 7 trait points, still short. Setting Actinic Burst and Plasma Charge does. Self-Destruct with Frightful Roar and Actinic Burst does. Actinic Burst with Self-Destruct and Light of Penance does. Voracious Trunk with Actinic Burst and Stinking Gas does. Voracious Trunk with Actinic Burst and Cold Wave does. Adding Stinking Gas or Cold Wave to a pair that already meets the trait does not raise the tier. It does not stack with a support job. The higher value is kept.",
    });
  }
  if (blueConserveMp(names) > 0) {
    rows.push({
      name: "Conserve MP",
      level: 65,
      access: "main",
      effect: "Sometimes a spell costs less MP. The chance is 25%. The reduced cost is floor(cost × 8, 10, 12, or 14 ÷ 16), the same roll Black Mage uses. Chaotic Eye and Zephyr Mantle are 4 trait points each and 2 set points each. Frost Breath is 4 trait points and 3 set points. Firespit is 4 trait points and 5 set points. Conserve MP needs 8 trait points and 4 set points, so none of them grants it alone. Setting Chaotic Eye with Zephyr Mantle does. Frost Breath with either of those does. Firespit with Chaotic Eye, Zephyr Mantle, or Frost Breath does. It does not stack with a support job. The higher value is kept. It does not let you cast a spell you could not afford.",
    });
  }
  if (blueMagicAttackBonus(names) > 0) {
    rows.push({
      name: "Magic Attack Bonus",
      level: 32,
      access: "main",
      effect: "Magic Attack Bonus +20. Memento Mori is 4 trait points and 4 set points. Cursed Sphere is 4 trait points and 2 set points. Sound Blast is 4 trait points and 1 set point. Eyes On Me is 4 trait points and 4 set points. Heat Breath is 4 trait points and 4 set points. Magic Hammer is 4 trait points and 4 set points. Reactor Cool is 4 trait points and 5 set points. Magic Attack Bonus needs 8 trait points and 3 set points, so none of them grants it alone. Memento Mori with Cursed Sphere does. Memento Mori with Sound Blast does. Sound Blast with Cursed Sphere does. Eyes On Me with any of those three does. Heat Breath with Memento Mori, Cursed Sphere, Sound Blast, or Eyes On Me does. Magic Hammer with any of those does. Reactor Cool with any of those, including Magic Hammer, does. It does not stack with Black Mage or Red Mage. The higher value is kept. The Memento Mori status is a separate +20 and still stacks.",
    });
  }
  if (blueClearMind(names) > 0) {
    rows.push({
      name: "Clear Mind",
      level: 24,
      access: "main",
      effect: "+3 MP while resting, on top of the base. Mind Blast is 4 trait points and 4 set points. Poison Breath is 4 trait points and 1 set point. Soporific is 4 trait points and 4 set points. Venom Shell is 4 trait points and 3 set points. Awful Eye is 4 trait points and 2 set points. Filamented Hold is 4 trait points and 3 set points. Maelstrom is 4 trait points and 5 set points. Feather Tickle is 4 trait points and 3 set points. Sandspray is 4 trait points and 2 set points. Corrosive Ooze is 4 trait points and 4 set points. Warm-Up is 4 trait points and 4 set points. Lowing is 4 trait points and 2 set points. Clear Mind needs 8 trait points and 3 set points, so none of them grants it alone. Mind Blast with Poison Breath does. Mind Blast with Soporific does. Poison Breath with Soporific does. Venom Shell with any of those three does. Awful Eye with Poison Breath, Venom Shell, Mind Blast, or Soporific does. Filamented Hold with Poison Breath does. Maelstrom with Poison Breath does. Feather Tickle with Poison Breath does. Feather Tickle with Mind Blast does. Feather Tickle with Soporific does. Sandspray with Poison Breath does. Corrosive Ooze with Poison Breath does. Sandspray with Corrosive Ooze does. Warm-Up with Poison Breath does. Lowing with Poison Breath does. It does not stack with Black Mage, White Mage, Red Mage, or Summoner. The higher value is kept.",
    });
  }
  if (blueBeastKiller(names) > 0) {
    rows.push({
      name: "Beast Killer",
      level: 4,
      access: "main",
      effect: "Damage dealt to beasts +8%. Sprout Smack is 4 trait points and 2 set points. Wild Oats is 4 trait points and 3 set points. Seedspray is 4 trait points and 2 set points. 1000 Needles is 4 trait points and 5 set points. Beast Killer needs 8 trait points and 5 set points, so none of them grants it alone. Setting Sprout Smack with Wild Oats does. Seedspray with Wild Oats does. Seedspray with Sprout Smack is 4 set points, short of 5, so that pair does not. 1000 Needles with any of those three does, because its own 5 set points already meet the set cost. The Tropical Rarab is a beast. It does not stack with Beastmaster. The higher value is kept.",
    });
  }
  if (bluePlantoidKiller(names) > 0) {
    rows.push({
      name: "Plantoid Killer",
      level: 44,
      access: "main",
      effect: "Damage dealt to plantoids +8%. Power Attack is 4 trait points and 1 set point. Mandibular Bite is 4 trait points and 2 set points. Spiral Spin is 4 trait points and 3 set points. Plantoid Killer needs 8 trait points and 3 set points, so none of them grants it alone. Setting Power Attack with Mandibular Bite does. Spiral Spin with either of those does. The Tropical Rarab is not a plantoid, so the bonus is not rolled.",
    });
  }
  if (blueMaxMpBoost(names, 75) > 0) {
    rows.push({
      name: "Max MP Boost",
      level: MAX_MP_BOOST_LEVEL,
      access: "main",
      effect: "Maximum MP +10. Metallic Body is 4 trait points and 1 set point. Mysterious Light is 4 trait points and 4 set points. Hecatomb Wave is 4 trait points and 3 set points. Max MP Boost needs 8 trait points and 4 set points, and the tier is level 40, so none of them grants it alone. Metallic Body with Mysterious Light does. Metallic Body with Hecatomb Wave does. It does not stack with a support job. The higher value is kept. Summoner's Max MP Boost is a different trait and is not this one.",
    });
  }
  if (blueRapidShot(names, 75) > 0) {
    rows.push({
      name: "Rapid Shot",
      level: RAPID_SHOT_LEVEL,
      access: "main",
      effect: "About 25% chance to shorten a ranged delay. Feather Storm is 4 trait points and 3 set points. Jet Stream is 4 trait points and 4 set points. Hydro Shot is 4 trait points and 3 set points. Rapid Shot needs 8 trait points and 6 set points, and the tier is level 38, so none of them grants it alone. Feather Storm with Jet Stream does. Feather Storm with Hydro Shot does. Jet Stream with Hydro Shot does. It does not stack with Ranger. The higher value is kept.",
    });
  }
  if (blueUndeadKiller(names) > 0) {
    rows.push({
      name: "Undead Killer",
      level: 34,
      access: "main",
      effect: "Damage dealt to undead +8%. Bludgeon is 4 trait points and 2 set points. Smite of Rage is 4 trait points and 3 set points. Undead Killer needs 8 trait points and 5 set points, so neither spell grants it alone. Setting both does. The Tropical Rarab is not undead. It does not stack with Paladin. The higher value is kept.",
    });
  }
  if (blueLizardKiller(names) > 0) {
    rows.push({
      name: "Lizard Killer",
      level: 20,
      access: "main",
      effect: "Damage dealt to lizards +8%. Foot Kick is 4 trait points and 2 set points. Claw Cyclone is 4 trait points and 2 set points. Ram Charge is 4 trait points and 4 set points. Lizard Killer needs 8 trait points and 4 set points, so none of them grants it alone. Setting Foot Kick with Claw Cyclone does. Ram Charge with Foot Kick does. Ram Charge with Claw Cyclone does. The Tropical Rarab is not a lizard. It does not stack with Beastmaster. The higher value is kept.",
    });
  }
  if (blueEvasionBonus(names) > 0) {
    rows.push({
      name: "Evasion Bonus",
      level: 26,
      access: "main",
      effect: "Evasion +10. Screwdriver is 4 trait points and 3 set points. Hysteric Barrage is 4 trait points and 5 set points. Evasion Bonus needs 8 trait points and 6 set points, so neither spell grants it alone. Setting both does. It does not stack with Thief. The higher value is kept.",
    });
  }
  if (blueDefenseBonus(names) > 0) {
    rows.push({
      name: "Defense Bonus",
      level: 30,
      access: "main",
      effect: "Defense +10. Grand Slam is 4 trait points and 2 set points. Terror Touch is 4 trait points and 3 set points. Saline Coat is 4 trait points and 3 set points. Vertical Cleave is 4 trait points and 3 set points. Defense Bonus needs 8 trait points and 5 set points, so none of them grants it alone. Setting Grand Slam with Terror Touch does. Saline Coat with Grand Slam does. Saline Coat with Terror Touch does. Vertical Cleave with Grand Slam, Terror Touch, or Saline Coat does. It does not stack with Warrior or Paladin. The higher value is kept.",
    });
  }
  if (blueMagicDefenseBonus(names, 75) > 0) {
    rows.push({
      name: "Magic Defense Bonus",
      level: MAGIC_DEFENSE_LEVEL,
      access: "main",
      effect: "Magic Defense Bonus +10. Magnetite Cloud is 4 trait points and 3 set points. Ice Break is 4 trait points and 3 set points. Magic Defense Bonus needs 8 trait points and 6 set points, and the tier is level 50, so neither spell grants it alone. Setting both does. It does not stack with White Mage or Red Mage. The higher value is kept.",
    });
  }
  if (blueMaxHpBoost(names, 75) > 0) {
    rows.push({
      name: "Max HP Boost",
      level: MAX_HP_BOOST_LEVEL,
      access: "main",
      effect: "Maximum HP +30. Flying Hip Press is 4 trait points and 3 set points. Body Slam is 4 trait points and 4 set points. Frypan is 4 trait points and 3 set points. Max HP Boost needs 8 trait points and 5 set points, and the tier is level 62, so none of them grants it alone. Flying Hip Press with Body Slam does. Flying Hip Press with Frypan does. Body Slam with Frypan does. It does not stack with Warrior, Monk, Paladin, or Ninja. The higher value is kept.",
    });
  }
  if (blueFastCast(names, 75) > 0) {
    rows.push({
      name: "Fast Cast",
      level: FAST_CAST_LEVEL,
      access: "main",
      effect: "Casting time −5%. Recast time loses half of that. Bad Breath is 4 trait points and 5 set points. Sub-zero Smash is 4 trait points and 4 set points. Fast Cast needs 8 trait points and 6 set points, and tier 0 is level 72, so neither spell grants it alone. Setting both does. It does not stack with Red Mage. The higher value is kept.",
    });
  }
  if (blueResistGravity(names, 75) > 0) {
    rows.push({
      name: "Resist Gravity",
      level: RESIST_GRAVITY_LEVEL,
      access: "main",
      effect: "10% chance to fully resist Gravity and Weight. Feather Barrier is 4 trait points and 2 set points. Regurgitation is 4 trait points and 1 set point. Resist Gravity needs 8 trait points and 3 set points, and the tier is level 69, so neither spell grants it alone. Setting both does. Nothing here weighs you, so it is not rolled.",
    });
  }
  if (blueStoreTp(names, 75) > 0) {
    rows.push({
      name: "Store TP",
      level: STORE_TP_LEVEL,
      access: "main",
      effect: "Store TP +10. Tail Slap is 4 trait points and 4 set points. Sickle Slash is 4 trait points and 4 set points. Store TP needs 8 trait points and 5 set points, and the tier is level 69, so neither spell grants it alone. Setting both does. It does not stack with Samurai. The higher value is kept.",
    });
  }
  if (blueCounter(names) > 0) {
    rows.push({
      name: "Counter",
      level: COUNTER_LEVEL,
      access: "main",
      effect: "8% chance to counter an auto-attack. Enervation is 4 trait points and 5 set points. Asuran Claws is 4 trait points and 2 set points. Counter needs 8 trait points and 5 set points, and the tier is level 70, so neither spell grants it alone. Setting both does. It is not rolled. It does not stack with Monk. The higher value is kept.",
    });
  }
  return rows;
}

/**
 * BG-Wiki Cure Formula, the Wild Carrot row. Magic Fruit is a different table.
 * Power = 3×MND + VIT + 3×floor(Healing Magic ÷ 5).
 * Those are the caster's MND, the caster's VIT, and the caster's Healing Magic.
 * Blue Mage has no Healing Magic rank, so the skill term is 0 unless a subjob has it.
 * Base walks floor(Power ÷ 2) the way Curaga does.
 * Rate 1, constant 60, until the result would reach 150.
 * Then rate 2, constant 105, until it would reach 180.
 * Then rate 15.66, constant 170.43. 180 is that soft step, not a hard maximum.
 * The printed minimum is 120. No maximum has been found.
 * Day and weather do not apply. Divine Seal doubles afterwards, in cureFinal.
 * Cure potency gear is not applied in this yard.
 */
export function wildCarrotPower(mnd: number, vit: number, healing: number): number {
  return 3 * mnd + vit + 3 * Math.floor(Math.max(0, healing) / 5);
}

export function wildCarrotBase(power: number): number {
  const bands: { hp: number | null; rate: number; c: number }[] = [
    { hp: null, rate: 1, c: 60 },
    { hp: 150, rate: 2, c: 105 },
    { hp: 180, rate: 15.66, c: 170.43 },
  ];
  let rate = bands[0].rate;
  let c = bands[0].c;
  const half = Math.floor(Math.max(0, power) / 2);
  for (const band of bands) {
    if (band.hp == null) continue;
    if (half / rate + c >= band.hp) {
      rate = band.rate;
      c = band.c;
    } else break;
  }
  return Math.floor(Math.max(120, half / rate + c));
}

/**
 * BG-Wiki Cure Formula, the Magic Fruit row.
 * Power is the same blue-cure power as Wild Carrot.
 * The band changes when that power reaches 320, then 560.
 * Base is floor(floor(Power ÷ 2) / Rate + Const), and it cannot fall under 250.
 * The formula page does not print a maximum. The spell page's 550 and 610 are not applied.
 * Day and weather do not apply. Divine Seal doubles afterwards, in cureFinal.
 */
export function magicFruitBase(power: number): number {
  const half = Math.floor(Math.max(0, power) / 2);
  let rate = 0.6666;
  let c = 130;
  if (power >= 560) {
    rate = 2.833;
    c = 391.2;
  } else if (power >= 320) {
    rate = 1;
    c = 210;
  }
  return Math.floor(Math.max(250, half / rate + c));
}

/**
 * Level alpha on a magical blue stat term.
 * At 60 and below it is ceil(100 − level / 6) / 100.
 * At 75 and below it is ceil(100 − (level − 40) / 2) / 100.
 * Past 75 it stays 0.83. This yard stops at 75, so that last step is not used.
 */
export function blueWscAlpha(level: number): number {
  if (level <= 60) return Math.ceil(100 - level / 6) / 100;
  if (level <= 75) return Math.ceil(100 - (level - 40) / 2) / 100;
  return 0.83;
}

/**
 * Mind Blast before resist and before Magic Attack Bonus.
 * initial D is main level + 2, capped at 69.
 * The stat term is MND × 0.3 × alpha, doubled while Burst Affinity is up.
 * dMND × 1.5 uses the script defaults: half of anything above 999, and a floor of −399.
 * Azure Lore adds 0.5 to 531/256. Correlation and Convergence stay out.
 */
export function mindBlastRaw(input: {
  level: number;
  mnd: number;
  targetMnd: number;
  burstAffinity: boolean;
  azureLore: boolean;
}): number {
  const initial = Math.min(MIND_BLAST_CAP, Math.max(0, Math.floor(input.level) + 2));
  let wsc = input.mnd * MIND_BLAST.mndMod * blueWscAlpha(input.level);
  if (input.burstAffinity) wsc *= 2;
  let stat = (input.mnd - input.targetMnd) * MIND_BLAST.dStat;
  if (stat > MIND_BLAST_HALF) stat = Math.floor((stat - MIND_BLAST_HALF) * 0.5 + MIND_BLAST_HALF);
  if (stat < MIND_BLAST_LOW) stat = MIND_BLAST_LOW;
  const ftp = MIND_BLAST_FTP + (input.azureLore ? MIND_BLAST_AZURE : 0);
  return (initial + wsc) * ftp + stat;
}

/**
 * Magic Hammer before resist and before Magic Attack Bonus.
 * initial D is main level + 2, capped at 35.
 * The stat term is MND × 0.3 × alpha, doubled while Burst Affinity is up.
 * dMND × 1 uses a half cap of 60 and a floor of −17.
 * The coefficient is 1.5. Azure Lore adds 0.5. It does not open a magic burst.
 */
export function magicHammerRaw(input: {
  level: number;
  mnd: number;
  targetMnd: number;
  burstAffinity: boolean;
  azureLore: boolean;
}): number {
  const initial = Math.min(HAMMER_CAP, Math.max(0, Math.floor(input.level) + 2));
  let wsc = input.mnd * MAGIC_HAMMER.mndMod * blueWscAlpha(input.level);
  if (input.burstAffinity) wsc *= 2;
  let stat = (input.mnd - input.targetMnd) * MAGIC_HAMMER.dStat;
  if (stat > HAMMER_HALF) stat = Math.floor((stat - HAMMER_HALF) * 0.5 + HAMMER_HALF);
  if (stat < HAMMER_LOW) stat = HAMMER_LOW;
  const ftp = HAMMER_FTP + (input.azureLore ? HAMMER_AZURE : 0);
  return (initial + wsc) * ftp + stat;
}

/**
 * Exuviation. The script's cure bands, then the spell page's soft cap of 85.
 * Power is the blue-cure power. The floor is 60. Divine Seal is applied later.
 */
export function exuviationBase(power: number): number {
  const bands: { under: number | null; rate: number; c: number; min: number; max: number }[] = [
    { under: 220, rate: 0.6666, c: -45, min: 60, max: EXUV_CAP },
    { under: 460, rate: 2, c: 65, min: 60, max: EXUV_CAP },
    { under: null, rate: 6.5, c: 144.6666, min: 60, max: EXUV_CAP },
  ];
  const half = Math.floor(Math.max(0, power) / 2);
  const band = bands.find((row) => row.under == null || power < row.under) ?? bands[bands.length - 1];
  const raw = Math.floor(half / band.rate + band.c);
  return Math.floor(Math.max(band.min, Math.min(band.max, raw)));
}

/**
 * Healing Breeze uses the same power as Wild Carrot and Curaga.
 * The table is the one that produces the printed 180 soft cap.
 * Power under 220 stays in the first band, under 460 in the second,
 * and anything higher in the last. The result is cut to that band.
 */
export function healingBreezePower(mnd: number, vit: number, healing: number): number {
  return wildCarrotPower(mnd, vit, healing);
}

export function healingBreezeBase(power: number): number {
  const bands: { under: number | null; rate: number; c: number; min: number; max: number }[] = [
    { under: 220, rate: 0.6666, c: -45, min: 60, max: 120 },
    { under: 460, rate: 2, c: 65, min: 60, max: 120 },
    { under: null, rate: 6.5, c: 144.6666, min: 60, max: 180 },
  ];
  const half = Math.floor(Math.max(0, power) / 2);
  const band = bands.find((row) => row.under == null || power < row.under) ?? bands[bands.length - 1];
  const raw = Math.floor(half / band.rate + band.c);
  return Math.floor(Math.max(band.min, Math.min(band.max, raw)));
}

/** Unresisted Sheep Song duration. A whole second from 40 through 60. */
export function sheepSongSeconds(roll: number): number {
  const span = SHEEP_HIGH - SHEEP_LOW + 1;
  const slot = Math.min(span - 1, Math.max(0, Math.floor(roll * span)));
  return SHEEP_LOW + slot;
}

/** Drop unknown names, then anything that no longer fits the point and slot caps. */
export function trimBlueSet(names: readonly string[], level: number): string[] {
  const cap = bluePointCap(level);
  const out: string[] = [];
  let points = 0;
  for (const name of names) {
    const spell = blueSpellByName(name);
    if (!spell || out.includes(spell.name)) continue;
    if (out.length >= cap.slots) break;
    if (points + spell.points > cap.points) continue;
    out.push(spell.name);
    points += spell.points;
  }
  return out;
}

/**
 * Check or uncheck one learned spell. Unsetting is always allowed.
 * A support job cannot change the set. The save keeps it until Blue Mage is main again.
 */
export function nextBlueSet(input: {
  name: string;
  main: boolean;
  learned: readonly string[];
  set: readonly string[];
  level: number;
}): { ok: true; set: string[] } | { ok: false; reason: string } {
  const spell = blueSpellByName(input.name);
  if (!spell) return { ok: false, reason: "That is not blue magic." };
  if (!input.main) return { ok: false, reason: "Blue magic can be set only as Blue Mage." };
  if (!input.learned.includes(spell.name)) return { ok: false, reason: `You have not learned ${spell.name}.` };
  if (input.set.includes(spell.name)) return { ok: true, set: input.set.filter((name) => name !== spell.name) };
  const cap = bluePointCap(input.level);
  const points = input.set.reduce((n, name) => n + (blueSpellByName(name)?.points ?? 0), 0);
  if (input.set.length >= cap.slots) return { ok: false, reason: "No spell slots left." };
  if (points + spell.points > cap.points) return { ok: false, reason: "Not enough blue magic points." };
  return { ok: true, set: [...input.set, spell.name] };
}

/**
 * Deterministic once the monster readied the move and the Blue Mage is
 * alive and has claim when it falls. A miss still counts. A support job does not.
 */
export function offerBlueLearn(input: {
  name: string;
  used: boolean;
  main: boolean;
  alive: boolean;
  claimed: boolean;
  already: boolean;
  blueSkill: number;
}): { learn: boolean; line: string | null } {
  const spell = blueSpellByName(input.name);
  if (!spell || !input.used || !input.main || !input.alive || !input.claimed || input.already) return { learn: false, line: null };
  if (input.blueSkill < spell.learnSkill) return { learn: false, line: null };
  return { learn: true, line: `You learn ${spell.name}!` };
}

/** Skill term of physical blue damage, then the spell's own cap. */
export function blueBaseDamage(skill: number, dCap: number): number {
  const raw = Math.floor(Math.floor(skill * 0.11) * 2 + 3);
  return Math.min(dCap, Math.max(0, raw));
}

/** dSTR + 4 steps fSTR by 1. Level 75 melee blue magic stops at 22. */
export function blueFstr(dStr: number): number {
  return Math.max(-22, Math.min(22, Math.floor((dStr + 4) / 4)));
}

/**
 * LandSandBoat calculatefTP. TP is held from 0 through 3000.
 * Below 1500 it walks the first pair. From 1500 it walks the second.
 */
export function blueFtp(tp: number, at0: number, at1500: number, at3000: number): number {
  const clamped = Math.max(0, Math.min(3000, tp));
  if (clamped >= 1500) return at1500 + ((at3000 - at1500) * (clamped - 1500)) / 1500;
  return at0 + ((at1500 - at0) * clamped) / 1500;
}

/**
 * Battle Dance DEX Down. Flat 90 seconds unless Chain Affinity is spent,
 * which walks 90 / 480 / 680. Azure Lore is the 3000 TP anchor, 680.
 */
export function battleDanceSeconds(tp: number, chainAffinity: boolean, azureLore: boolean): number {
  if (azureLore) return 680;
  if (chainAffinity) return Math.floor(blueFtp(tp, 90, 480, 680));
  return BATTLE_SECONDS;
}

/**
 * Sprout Smack Slow and Wild Oats Vitality Down.
 * Flat 180 seconds unless Chain Affinity is spent, which walks
 * 180 / 360 / 400. Azure Lore is 450. The script marks the anchors
 * as needing verification. They are the only numbers printed.
 */
export function plantEffectSeconds(tp: number, chainAffinity: boolean, azureLore: boolean): number {
  if (azureLore) return 450;
  if (chainAffinity) return Math.floor(blueFtp(tp, 180, 360, 400));
  return SPROUT_SECONDS;
}

/**
 * Queasyshroom Poison. Flat 90 seconds unless Chain Affinity is spent,
 * which walks 90 / 150 / 180. Azure Lore is 210. The script marks the
 * anchors as needing verification. They are the only numbers printed.
 */
export function queasySeconds(tp: number, chainAffinity: boolean, azureLore: boolean): number {
  if (azureLore) return QUEASY_AZURE;
  if (chainAffinity) return Math.floor(blueFtp(tp, 90, 150, 180));
  return QUEASY_SECONDS;
}

/**
 * Metallic Body absorb. floor(skill × 0.375 + 12.5), skill held at 500,
 * power held at 200. The script's 150 is not the cap.
 */
export function metallicBodyPower(skill: number): number {
  const clamped = Math.max(0, Math.min(METAL_SKILL_CAP, skill));
  return Math.min(METAL_POWER_CAP, Math.floor(clamped * 0.375 + 12.5));
}

/** Metallic Body refreshes itself. It does not replace Stoneskin, Afflatus Solace, or Diamondhide. */
export function metallicCanLand(existing: "spell" | "solace" | "metal" | "hide" | null): boolean {
  return existing == null || existing === "metal";
}

/**
 * Diamondhide refreshes itself and replaces Metallic Body.
 * It does not replace Stoneskin or Afflatus Solace.
 */
export function diamondhideCanLand(existing: "spell" | "solace" | "metal" | "hide" | null): boolean {
  return existing == null || existing === "hide" || existing === "metal";
}

/** Diamondhide absorb. floor((skill / 3) × 2), skill held at 500. No second cap. */
export function diamondhidePower(skill: number): number {
  const clamped = Math.max(0, Math.min(HIDE_SKILL_CAP, skill));
  return Math.floor((clamped / 3) * 2);
}

/**
 * Sandspray refreshes its own Blind. Blind, Blind II, and a breath
 * Blind are stronger. A missing source is the spell.
 */
export function sandsprayCanReplace(current: { name: string; blindFrom?: "spell" | "spray" | "breath" } | undefined): boolean {
  if (!current || (current.name !== "Blind" && current.name !== "Blind II")) return true;
  return current.name === "Blind" && current.blindFrom === "spray";
}

/**
 * Head Butt Stun. A whole second from 1 through 5.
 * The script's random 2 through 8 is not used.
 */
export function headButtStunSeconds(roll: number): number {
  return 1 + Math.min(4, Math.floor(Math.max(0, roll) * 5));
}

/**
 * Sandspin before resist and before Magic Attack Bonus.
 * initial D is main level + 2, capped at 13.
 * The stat term is INT × 0.2 × alpha, doubled while Burst Affinity is up.
 * dINT uses a half cap of 16 and a floor of −6. The coefficient stays 1.
 */
export function sandspinRaw(input: {
  level: number;
  int: number;
  targetInt: number;
  burstAffinity: boolean;
}): number {
  const initial = Math.min(SANDSPIN_CAP, Math.max(0, Math.floor(input.level) + 2));
  let wsc = input.int * SANDSPIN.intMod * blueWscAlpha(input.level);
  if (input.burstAffinity) wsc *= 2;
  let stat = (input.int - input.targetInt) * SANDSPIN.dStat;
  if (stat > SANDSPIN_HALF) stat = Math.floor((stat - SANDSPIN_HALF) * 0.5 + SANDSPIN_HALF);
  if (stat < SANDSPIN_LOW) stat = SANDSPIN_LOW;
  return (initial + wsc) * SANDSPIN.ftp + stat;
}

/**
 * Mysterious Light before resist and before Magic Attack Bonus.
 * initial D is main level + 2, capped at 56.
 * The stat term is CHR × 0.3 × alpha, doubled while Burst Affinity is up.
 * dCHR uses a half cap of 77 and a floor of −24. The coefficient stays 248/256.
 */
export function mysteriousLightRaw(input: {
  level: number;
  chr: number;
  targetChr: number;
  burstAffinity: boolean;
}): number {
  const initial = Math.min(MYSTERY_CAP, Math.max(0, Math.floor(input.level) + 2));
  let wsc = input.chr * MYSTERIOUS_LIGHT.chrMod * blueWscAlpha(input.level);
  if (input.burstAffinity) wsc *= 2;
  let stat = (input.chr - input.targetChr) * MYSTERIOUS_LIGHT.dStat;
  if (stat > MYSTERY_HALF) stat = Math.floor((stat - MYSTERY_HALF) * 0.5 + MYSTERY_HALF);
  if (stat < MYSTERY_LOW) stat = MYSTERY_LOW;
  return (initial + wsc) * MYSTERIOUS_LIGHT.ftp + stat;
}

/**
 * Terror Touch Attack Down. 38/256 is about 15%. 1 is full attack.
 */
export function attackDownFactor(rows: readonly { name: string; power?: number }[]): number {
  const row = rows.find((entry) => entry.name === "Attack Down");
  if (!row) return 1;
  return (256 - (row.power ?? TERROR_ATTACK_NUMER)) / 256;
}

/**
 * Pollen. floor(power ÷ 2) on the script's three bands, then the floor of 14.
 * Power is the blue-cure power. The card's soft cap of 36 is not a clamp.
 */
export function pollenBase(power: number): number {
  const half = Math.max(0, power) / 2;
  let divisor = 1;
  let constant = -6;
  if (power > 99) {
    divisor = 57;
    constant = 33.125;
  } else if (power > 59) {
    divisor = 2;
    constant = 9;
  }
  return Math.floor(Math.max(POLLEN_MIN, half / divisor + constant));
}

/**
 * Target-centered magical blue damage, before resist and before Magic Attack Bonus.
 * initial D is main level + 2, then the spell's cap.
 * The stat term is INT × the printed fraction × alpha, doubled while Burst Affinity is up.
 * dINT uses the spell's half cap and floor. Azure Lore does not change the coefficient.
 */
export function blueOrbRaw(input: {
  name: string;
  level: number;
  int: number;
  targetInt: number;
  burstAffinity: boolean;
}): number {
  const spell = blueSpellByName(input.name);
  if (!spell || spell.kind !== "orb") return 0;
  const initial = Math.min(spell.dCap, Math.max(0, Math.floor(input.level) + 2));
  let wsc = input.int * spell.intMod * blueWscAlpha(input.level);
  if (input.burstAffinity) wsc *= 2;
  let stat = (input.int - input.targetInt) * spell.dStat;
  if (stat > spell.half) stat = Math.floor((stat - spell.half) * 0.5 + spell.half);
  if (stat < spell.low) stat = spell.low;
  return (initial + wsc) * spell.ftp + stat;
}

/** Poison Breath before resist. Current HP / 10 + main level / 1.25. Magic Attack Bonus is not in this number. */
export function poisonBreathRaw(hp: number, level: number): number {
  return Math.max(0, hp) / POISON_BREATH.hpMod + Math.max(0, level) / POISON_BREATH.lvlMod;
}

/** Frost Breath before resist. Current HP / 3 + main level / 0.625. Magic Attack Bonus is not in this number. */
export function frostBreathRaw(hp: number, level: number): number {
  return Math.max(0, hp) / FROST_BREATH.hpMod + Math.max(0, level) / FROST_BREATH.lvlMod;
}

/**
 * Corrosive Ooze before resist and before Magic Attack Bonus.
 * initial D is main level + 2, capped at 69.
 * The stat term is INT × 0.2 × alpha, doubled while Burst Affinity is up.
 * dINT is multiplied by 2. The half cap is 999 and the floor is −399.
 * Azure Lore adds 0.5 to 556/256.
 */
export function corrosiveOozeRaw(input: {
  level: number;
  int: number;
  targetInt: number;
  burstAffinity: boolean;
  azureLore: boolean;
}): number {
  const initial = Math.min(CORROSIVE_OOZE.dCap, Math.max(0, Math.floor(input.level) + 2));
  let wsc = input.int * CORROSIVE_OOZE.intMod * blueWscAlpha(input.level);
  if (input.burstAffinity) wsc *= 2;
  let stat = (input.int - input.targetInt) * CORROSIVE_OOZE.dStat;
  if (stat > CORROSIVE_OOZE.half) stat = Math.floor((stat - CORROSIVE_OOZE.half) * 0.5 + CORROSIVE_OOZE.half);
  if (stat < CORROSIVE_OOZE.low) stat = CORROSIVE_OOZE.low;
  const ftp = CORROSIVE_OOZE.ftp + (input.azureLore ? CORROSIVE_OOZE.azureFtp : 0);
  return (initial + wsc) * ftp + stat;
}

/**
 * Death Ray before resist and before Magic Attack Bonus.
 * initial D is main level + 2, capped at 51.
 * The stat term is (INT × 0.2 + MND × 0.1) × alpha, not floored per stat.
 * Burst Affinity doubles that term. Azure Lore adds 2 to 1.625.
 * dINT uses a half cap of 77 and a floor of −30.
 */
export function deathRayRaw(input: {
  level: number;
  int: number;
  mnd: number;
  targetInt: number;
  burstAffinity: boolean;
  azureLore: boolean;
}): number {
  const initial = Math.min(DEATH_RAY.dCap, Math.max(0, Math.floor(input.level) + 2));
  let wsc = (input.int * DEATH_RAY.intMod + input.mnd * DEATH_RAY.mndMod) * blueWscAlpha(input.level);
  if (input.burstAffinity) wsc *= 2;
  let stat = (input.int - input.targetInt) * DEATH_RAY.dStat;
  if (stat > DEATH_RAY.half) stat = Math.floor((stat - DEATH_RAY.half) * 0.5 + DEATH_RAY.half);
  if (stat < DEATH_RAY.low) stat = DEATH_RAY.low;
  const ftp = DEATH_RAY.ftp + (input.azureLore ? DEATH_RAY.azureFtp : 0);
  return (initial + wsc) * ftp + stat;
}

/**
 * Firespit before resist and before Magic Attack Bonus.
 * initial D is main level + 2, capped at 69.
 * The stat term is (INT × 0.2 + MND × 0.2) × alpha, not floored per stat.
 * Burst Affinity doubles that term. Azure Lore does not change 3.
 * dINT uses a half cap of 999 and a floor of −399.
 */
export function firespitRaw(input: {
  level: number;
  int: number;
  mnd: number;
  targetInt: number;
  burstAffinity: boolean;
  azureLore: boolean;
}): number {
  const initial = Math.min(FIRESPIT.dCap, Math.max(0, Math.floor(input.level) + 2));
  let wsc = (input.int * FIRESPIT.intMod + input.mnd * FIRESPIT.mndMod) * blueWscAlpha(input.level);
  if (input.burstAffinity) wsc *= 2;
  let stat = (input.int - input.targetInt) * FIRESPIT.dStat;
  if (stat > FIRESPIT.half) stat = Math.floor((stat - FIRESPIT.half) * 0.5 + FIRESPIT.half);
  if (stat < FIRESPIT.low) stat = FIRESPIT.low;
  const ftp = FIRESPIT.ftp + (input.azureLore ? FIRESPIT.azureFtp : 0);
  return (initial + wsc) * ftp + stat;
}

/**
 * Regurgitation before resist, before Magic Attack Bonus, and before the behind multiplier.
 * initial D is main level + 2, capped at 69.
 * The stat term is MND × 0.3 × alpha. dINT is still INT, multiplied by 2.
 * Burst Affinity doubles the stat term. Azure Lore does not change 1.83.
 */
export function regurgitationRaw(input: {
  level: number;
  int: number;
  mnd: number;
  targetInt: number;
  burstAffinity: boolean;
  azureLore: boolean;
}): number {
  const initial = Math.min(REGURGITATION.dCap, Math.max(0, Math.floor(input.level) + 2));
  let wsc = input.mnd * REGURGITATION.mndMod * blueWscAlpha(input.level);
  if (input.burstAffinity) wsc *= 2;
  let stat = (input.int - input.targetInt) * REGURGITATION.dStat;
  if (stat > REGURGITATION.half) stat = Math.floor((stat - REGURGITATION.half) * 0.5 + REGURGITATION.half);
  if (stat < REGURGITATION.low) stat = REGURGITATION.low;
  const ftp = REGURGITATION.ftp + (input.azureLore ? REGURGITATION.azureFtp : 0);
  return (initial + wsc) * ftp + stat;
}

/** Digest before resist. floor(floor(skill × 0.11) × 5). No stat term and no cap. */
export function digestRaw(skill: number): number {
  return Math.floor(Math.floor(Math.max(0, skill) * 0.11) * DIGEST.dmgMult);
}

/** MP Drainkiss before resist. floor(floor(skill × 0.11) × 3.5), then the soft cap of 165. */
export function kissRaw(skill: number): number {
  const base = Math.floor(Math.floor(Math.max(0, skill) * 0.11) * MP_DRAINKISS.dmgMult);
  return Math.min(MP_DRAINKISS.cap, Math.max(0, base));
}

/** Blood Saber before resist. floor(floor(skill × 0.11) × 3.5). The helper's damage cap is 0, so nothing clamps it. */
export function saberRaw(skill: number): number {
  return Math.floor(Math.floor(Math.max(0, skill) * 0.11) * BLOOD_SABER.dmgMult);
}

/**
 * Ice Break before resist and before Magic Attack Bonus.
 * initial D is main level + 2, capped at 69.
 * The stat term is INT × 0.3 × alpha, doubled while Burst Affinity is up.
 * dINT uses the script defaults: half of anything above 999, and a floor of −399.
 * Azure Lore does not change the coefficient.
 */
export function iceBreakRaw(input: {
  level: number;
  int: number;
  targetInt: number;
  burstAffinity: boolean;
}): number {
  const initial = Math.min(ICE_BREAK.dCap, Math.max(0, Math.floor(input.level) + 2));
  let wsc = input.int * ICE_BREAK.intMod * blueWscAlpha(input.level);
  if (input.burstAffinity) wsc *= 2;
  let stat = (input.int - input.targetInt) * ICE_BREAK.dStat;
  if (stat > ICE_BREAK.half) stat = Math.floor((stat - ICE_BREAK.half) * 0.5 + ICE_BREAK.half);
  if (stat < ICE_BREAK.low) stat = ICE_BREAK.low;
  return (initial + wsc) * ICE_BREAK.ftp + stat;
}

/**
 * Maelstrom before resist and before Magic Attack Bonus.
 * initial D is main level + 2, capped at 69.
 * The stat term is (INT × 0.3 + MND × 0.1) × alpha, not floored per stat.
 * Burst Affinity doubles that term. Azure Lore does not change 2.375.
 * dINT uses the script defaults: half of anything above 999, and a floor of −399.
 */
export function maelRaw(input: {
  level: number;
  int: number;
  mnd: number;
  targetInt: number;
  burstAffinity: boolean;
}): number {
  const initial = Math.min(MAELSTROM.dCap, Math.max(0, Math.floor(input.level) + 2));
  let wsc = (input.int * MAELSTROM.intMod + input.mnd * MAELSTROM.mndMod) * blueWscAlpha(input.level);
  if (input.burstAffinity) wsc *= 2;
  let stat = (input.int - input.targetInt) * MAELSTROM.dStat;
  if (stat > MAELSTROM.half) stat = Math.floor((stat - MAELSTROM.half) * 0.5 + MAELSTROM.half);
  if (stat < MAELSTROM.low) stat = MAELSTROM.low;
  return (initial + wsc) * MAELSTROM.ftp + stat;
}

/**
 * Eyes On Me before resist and before Magic Attack Bonus.
 * initial D is main level + 2, capped at 69.
 * The stat term is CHR × 0.4 × alpha, doubled while Burst Affinity is up.
 * Azure Lore adds 2 to 2.625. It does not double the stat term.
 * dCHR uses the script defaults: half of anything above 999, and a floor of −399.
 */
export function eyesRaw(input: {
  level: number;
  chr: number;
  targetChr: number;
  burstAffinity: boolean;
  azureLore: boolean;
}): number {
  const initial = Math.min(EYES_ON_ME.dCap, Math.max(0, Math.floor(input.level) + 2));
  let wsc = input.chr * EYES_ON_ME.chrMod * blueWscAlpha(input.level);
  if (input.burstAffinity) wsc *= 2;
  let stat = (input.chr - input.targetChr) * EYES_ON_ME.dStat;
  if (stat > EYES_ON_ME.half) stat = Math.floor((stat - EYES_ON_ME.half) * 0.5 + EYES_ON_ME.half);
  if (stat < EYES_ON_ME.low) stat = EYES_ON_ME.low;
  const ftp = EYES_ON_ME.ftp + (input.azureLore ? EYES_ON_ME.azureFtp : 0);
  return (initial + wsc) * ftp + stat;
}

/** Self-Destruct before resist and before a magic burst. Current HP − 1. No Magic Attack Bonus. */
export function selfDestructRaw(hp: number): number {
  return Math.max(0, Math.floor(hp) - 1);
}

/**
 * Cold Wave's Frost. The script passes only the DoT as the status power.
 * The effect then sets AGI to −((power − 1) × 2 + 5). Regen down equals
 * the DoT and is not returned, because nothing here regens the hare.
 * At 75 the DoT is 17 and AGI falls by 37.
 */
export function coldWaveFrost(level: number): { agi: number; dot: number } {
  const agiDown = Math.min(49, Math.max(0, level / 2));
  const dot = Math.min(23, Math.max(0, Math.floor((agiDown - 3) / 2)));
  return { agi: (dot - 1) * 2 + 5, dot };
}

/** Hecatomb Wave before resist. Current HP / 4 + main level / 1.5. The page's sum matches the script. */
export function hecatombWaveRaw(hp: number, level: number): number {
  return Math.max(0, hp) / HECATOMB_WAVE.hpMod + Math.max(0, level) / HECATOMB_WAVE.lvlMod;
}

/** Radiant Breath before resist. Current HP / 5 + main level / 0.75. The page's sum matches the script. */
export function radiantBreathRaw(hp: number, level: number): number {
  return Math.max(0, hp) / RADIANT_BREATH.hpMod + Math.max(0, level) / RADIANT_BREATH.lvlMod;
}

/** Flying Hip Press before resist. Current HP / 3. The level term is 0 and is not divided. */
export function hipPressRaw(hp: number): number {
  return Math.max(0, hp) / FLYING_HIP_PRESS.hpMod;
}

/** Heat Breath before resist. Current HP / 2. The level term is 0 and is not divided. Magic Attack Bonus is not in this number. */
export function heatBreathRaw(hp: number): number {
  return Math.max(0, hp) / HEAT_BREATH.hpMod;
}

/** Bad Breath before resist. Current HP / 8 + main level / 3. The page's sum matches the script. */
export function badBreathRaw(hp: number, level: number): number {
  return Math.max(0, hp) / BAD_BREATH.hpMod + Math.max(0, level) / BAD_BREATH.lvlMod;
}

/** 1000 Needles after the split. Zero targets is a miss. The unsplit 1000 is floored per share. */
export function needlesSplit(targets: number): number {
  const n = Math.max(0, Math.floor(targets));
  if (n < 1) return 0;
  return Math.floor(NEEDLES_DAMAGE / n);
}

/**
 * Blitzstrahl before resist and before Magic Attack Bonus.
 * initial D is main level + 2, capped at 61.
 * The stat term is (INT × 0.3 + MND × 0.1) × alpha, not floored per stat.
 * Burst Affinity doubles that term. Azure Lore adds nothing.
 * dINT uses the script defaults: half of anything above 999, and a floor of −399.
 */
export function blitzRaw(input: {
  level: number;
  int: number;
  mnd: number;
  targetInt: number;
  burstAffinity: boolean;
}): number {
  const initial = Math.min(BLITZSTRAHL.dCap, Math.max(0, Math.floor(input.level) + 2));
  let wsc = (input.int * BLITZSTRAHL.intMod + input.mnd * BLITZSTRAHL.mndMod) * blueWscAlpha(input.level);
  if (input.burstAffinity) wsc *= 2;
  let stat = (input.int - input.targetInt) * BLITZSTRAHL.dStat;
  if (stat > BLITZSTRAHL.half) stat = Math.floor((stat - BLITZSTRAHL.half) * 0.5 + BLITZSTRAHL.half);
  if (stat < BLITZSTRAHL.low) stat = BLITZSTRAHL.low;
  return (initial + wsc) * BLITZSTRAHL.ftp + stat;
}

/** Magnetite Cloud before resist. Current HP / 6 + main level / 1.875. The page's product is not used. */
export function magnetiteCloudRaw(hp: number, level: number): number {
  return Math.max(0, hp) / MAGNETITE_CLOUD.hpMod + Math.max(0, level) / MAGNETITE_CLOUD.lvlMod;
}

/**
 * Pinecone Bomb Sleep. Flat 90 seconds unless Chain Affinity is spent,
 * which walks 90 / 150 / 210. Azure Lore is 240. The script marks the
 * 3000 and Azure anchors as needing verification. They are the numbers used.
 */
export function pineconeSeconds(tp: number, chainAffinity: boolean, azureLore: boolean): number {
  if (azureLore) return PINECONE_AZURE;
  if (chainAffinity) return Math.floor(blueFtp(tp, PINECONE_SECONDS, 150, 210));
  return PINECONE_SECONDS;
}

/** Uppercut's attack multiplier. Azure Lore is 2.4 and wins over Chain Affinity. */
export function uppercutAttackMult(tp: number, chainAffinity: boolean, azureLore: boolean): number {
  if (azureLore) return 2.4;
  if (chainAffinity) return blueFtp(tp, 1.6, 2, 2.3);
  return 1.6;
}

/** Foot Kick and Battle Dance stay at 1. Uppercut multiplies attack. Disseverment stays at 90%. Power Attack stays at 1.8. Head Butt stays at 1.05. Helldive stays at 1.85. Bludgeon stays at 1.55. Screwdriver stays at 1.6. Smite of Rage stays at 1.3. Jet Stream stays at 1.3. Terror Touch stays at 1.05. Mandibular Bite walks its attack under Chain Affinity, and Azure Lore sets 2.65. Claw Cyclone and Grand Slam walk their attack under Chain Affinity. Death Scissors stays at 1.7. Dimensional Death walks its attack under Chain Affinity, and Azure Lore sets 2.3. Spiral Spin and Seedspray stay at 1. Hydro Shot stays at 1.85. */
export function blueAttackMult(name: string, tp: number, chainAffinity: boolean, azureLore: boolean): number {
  if (name === "Uppercut") return uppercutAttackMult(tp, chainAffinity, azureLore);
  if (name === "Disseverment") return DISSEVER_ATTACK;
  if (name === "Power Attack") return POWER_ATTACK_MULT;
  if (name === "Head Butt") return HEAD_BUTT_MULT;
  if (name === "Helldive") return HELLDIVE_MULT;
  if (name === "Bludgeon") return BLUDGEON_MULT;
  if (name === "Screwdriver") return SCREWDRIVER_MULT;
  if (name === "Smite of Rage") return SMITE_MULT;
  if (name === "Jet Stream") return JET_MULT;
  if (name === "Terror Touch") return TERROR_MULT;
  if (name === "Mandibular Bite") return mandibularAttackMult(tp, chainAffinity, azureLore);
  if (name === "Claw Cyclone") return clawAttackMult(tp, chainAffinity, azureLore);
  if (name === "Grand Slam") return grandSlamAttackMult(tp, chainAffinity, azureLore);
  if (name === "Death Scissors") return DEATH_ATTACK;
  if (name === "Dimensional Death") return dimensionalAttackMult(tp, chainAffinity, azureLore);
  if (name === "Body Slam") return bodySlamAttackMult(tp, chainAffinity, azureLore);
  if (name === "Spinal Cleave") return SPINAL_ATTACK;
  if (name === "Hydro Shot") return HYDRO_ATTACK;
  if (name === "Tail Slap") return tailSlapAttackMult(tp, chainAffinity, azureLore);
  if (name === "Asuran Claws") return ASURAN_MULT;
  if (name === "Sickle Slash") return SICKLE_MULT;
  if (name === "Sub-zero Smash") return SUBZERO_MULT;
  if (name === "Ram Charge") return RAM_MULT;
  if (name === "Vertical Cleave") return verticalAttackMult(tp, chainAffinity, azureLore);
  return 1;
}

/** Claw Cyclone's attack. Azure Lore is 2.1 and wins over Chain Affinity. The coefficient does not walk. */
export function clawAttackMult(tp: number, chainAffinity: boolean, azureLore: boolean): number {
  if (azureLore) return CLAW_ATTACK_AZURE;
  if (chainAffinity) return blueFtp(tp, CLAW_ATTACK[0], CLAW_ATTACK[1], CLAW_ATTACK[2]);
  return CLAW_ATTACK[0];
}

/** Grand Slam's attack. Azure Lore is 2.4 and wins over Chain Affinity. The coefficient stays 1. */
export function grandSlamAttackMult(tp: number, chainAffinity: boolean, azureLore: boolean): number {
  if (azureLore) return GRAND_ATTACK_AZURE;
  if (chainAffinity) return blueFtp(tp, GRAND_ATTACK[0], GRAND_ATTACK[1], GRAND_ATTACK[2]);
  return GRAND_ATTACK[0];
}

/** Dimensional Death's attack. Azure Lore is 2.3 and wins over Chain Affinity. The coefficient stays 2.25. */
export function dimensionalAttackMult(tp: number, chainAffinity: boolean, azureLore: boolean): number {
  if (azureLore) return DIMENSION_ATTACK_AZURE;
  if (chainAffinity) return blueFtp(tp, DIMENSION_ATTACK[0], DIMENSION_ATTACK[1], DIMENSION_ATTACK[2]);
  return DIMENSION_ATTACK[0];
}

/** Body Slam's attack. Azure Lore is 2.15 and wins over Chain Affinity. The coefficient stays 1.5. */
export function bodySlamAttackMult(tp: number, chainAffinity: boolean, azureLore: boolean): number {
  if (azureLore) return SLAM_ATTACK_AZURE;
  if (chainAffinity) return blueFtp(tp, SLAM_ATTACK[0], SLAM_ATTACK[1], SLAM_ATTACK[2]);
  return SLAM_ATTACK[0];
}

/**
 * Accuracy added by Chain Affinity or Azure Lore.
 * Spinal Cleave, Frypan, and Asuran Claws. The script marks the curve as made up.
 * Raw TP adds nothing. Azure Lore is +70 and wins.
 */
export function blueAccBonus(name: string, tp: number, chainAffinity: boolean, azureLore: boolean): number {
  if (name !== "Spinal Cleave" && name !== "Frypan" && name !== "Asuran Claws") return 0;
  if (azureLore) return BLUE_ACC_AZURE;
  if (chainAffinity) return Math.floor(Math.max(0, tp) / BLUE_ACC_DIV);
  return 0;
}

/** Vertical Cleave's attack. The coefficient stays 3. Azure Lore is 2.25 and wins over Chain Affinity. */
export function verticalAttackMult(tp: number, chainAffinity: boolean, azureLore: boolean): number {
  if (azureLore) return CLEAVE_ATTACK_AZURE;
  if (chainAffinity) return blueFtp(tp, CLEAVE_ATTACK[0], CLEAVE_ATTACK[1], CLEAVE_ATTACK[2]);
  return CLEAVE_MULT;
}

/** Mandibular Bite's attack. Azure Lore is 2.65 and wins over Chain Affinity. The coefficient stays 2. */
export function mandibularAttackMult(tp: number, chainAffinity: boolean, azureLore: boolean): number {
  if (azureLore) return BITE_ATTACK_AZURE;
  if (chainAffinity) return blueFtp(tp, BITE_ATTACK[0], BITE_ATTACK[1], BITE_ATTACK[2]);
  return BITE_ATTACK[0];
}

/** Tail Slap's attack. Azure Lore is 2.65 and wins over Chain Affinity. The coefficient stays 1.625. */
export function tailSlapAttackMult(tp: number, chainAffinity: boolean, azureLore: boolean): number {
  if (azureLore) return TAIL_ATTACK_AZURE;
  if (chainAffinity) return blueFtp(tp, TAIL_ATTACK[0], TAIL_ATTACK[1], TAIL_ATTACK[2]);
  return TAIL_ATTACK[0];
}

/**
 * Weapon-skill coefficient for one physical blue spell.
 * Frenetic Rip walks its anchors only under Chain Affinity.
 * Azure Lore replaces that with the 3500 anchor. Raw TP does not.
 * Cannonball walks its anchors only under Chain Affinity.
 * Azure Lore replaces that with the 3500 anchor, 2.875. Raw TP does not.
 * Head Butt and Helldive walk their anchors only under Chain Affinity.
 * Azure Lore replaces those with the 3500 anchors. Raw TP does not.
 * Disseverment is 1.5 at every tier. Queasyshroom and Feather Storm do not walk.
 * Death Scissors walks its anchors only under Chain Affinity.
 * Azure Lore replaces that with 844/256. Raw TP does not.
 */
export function blueSpellFtp(name: string, tp: number, chainAffinity: boolean, azureLore: boolean): number {
  if (name === "Frenetic Rip") {
    if (azureLore) return FRENETIC_FTP_AZURE;
    if (chainAffinity) return blueFtp(tp, FRENETIC_FTP[0], FRENETIC_FTP[1], FRENETIC_FTP[2]);
    return FRENETIC_FTP[0];
  }
  if (name === "Cannonball") {
    if (azureLore) return CANNONBALL_FTP_AZURE;
    if (chainAffinity) return blueFtp(tp, CANNONBALL_FTP[0], CANNONBALL_FTP[1], CANNONBALL_FTP[2]);
    return CANNONBALL_FTP[0];
  }
  if (name === "Head Butt") {
    if (azureLore) return HEAD_BUTT_FTP_AZURE;
    if (chainAffinity) return blueFtp(tp, HEAD_BUTT_FTP[0], HEAD_BUTT_FTP[1], HEAD_BUTT_FTP[2]);
    return HEAD_BUTT_FTP[0];
  }
  if (name === "Helldive") {
    if (azureLore) return HELLDIVE_FTP_AZURE;
    if (chainAffinity) return blueFtp(tp, HELLDIVE_FTP[0], HELLDIVE_FTP[1], HELLDIVE_FTP[2]);
    return HELLDIVE_FTP[0];
  }
  if (name === "Smite of Rage") {
    if (azureLore) return SMITE_FTP_AZURE;
    if (chainAffinity) return blueFtp(tp, SMITE_FTP[0], SMITE_FTP[1], SMITE_FTP[2]);
    return SMITE_FTP[0];
  }
  if (name === "Death Scissors") {
    if (azureLore) return DEATH_FTP_AZURE;
    if (chainAffinity) return blueFtp(tp, DEATH_FTP[0], DEATH_FTP[1], DEATH_FTP[2]);
    return DEATH_FTP[0];
  }
  if (name === "Hysteric Barrage") {
    if (azureLore) return HYSTERIC_FTP_AZURE;
    if (chainAffinity) return blueFtp(tp, HYSTERIC_FTP[0], HYSTERIC_FTP[1], HYSTERIC_FTP[2]);
    return HYSTERIC_FTP[0];
  }
  if (name === "Ram Charge") {
    if (azureLore) return RAM_FTP_AZURE;
    if (chainAffinity) return blueFtp(tp, RAM_FTP[0], RAM_FTP[1], RAM_FTP[2]);
    return RAM_FTP[0];
  }
  const spell = blueSpellByName(name);
  return spell && spell.kind === "physical" ? spell.ftp : 1;
}

/** Poison slip for Disseverment. floor(level / 5) + 3, stopping at 22. */
export function dissevermentPoison(level: number): number {
  return Math.min(DISSEVER_POISON_CAP, Math.floor(Math.max(0, level) / 5) + 3);
}

/** Primary property, then the second when the spell has one. Foot Kick is Detonation only. */
export function blueChainProps(name: string): string[] {
  const spell = blueSpellByName(name);
  if (!spell || spell.kind !== "physical") return [];
  return spell.chain2 ? [spell.chain, spell.chain2] : [spell.chain];
}

export function rollPhysicalBlue(input: {
  name: string;
  blueSkill: number;
  str: number;
  dex: number;
  /** Cannonball's stat term reads VIT. Power Attack and Sprout Smack read it too. */
  vit?: number;
  /** Wild Oats, Feather Storm, and Helldive read AGI. Other spells leave it unused. */
  agi?: number;
  /** Queasyshroom and Head Butt read INT. Other spells leave it unused. */
  int?: number;
  /** Bludgeon reads CHR. Other spells leave it unused. */
  chr?: number;
  /** Screwdriver reads MND. Other spells leave it unused. */
  mnd?: number;
  targetVit: number;
  attack: number;
  defense: number;
  accuracy: number;
  evasion: number;
  dLevel: number;
  chainAffinity: boolean;
  /** 1 for Foot Kick and Battle Dance. Uppercut passes its attack curve. Disseverment passes 0.9. */
  attackMult?: number;
  /** Overrides the card's 0 TP coefficient. Frenetic Rip passes the Chain Affinity or Azure Lore value. */
  ftp?: number;
  /** Chain Affinity forces a critical hit. Power Attack can also pass Azure Lore's 35% roll. */
  crit?: boolean;
  targetName: string;
  hitRoll: number;
  pdifRoll: number;
  /** One accuracy roll per hit. Missing entries reuse hitRoll. */
  hitRolls?: readonly number[];
  /** One pDIF roll per hit. Missing entries reuse pdifRoll. */
  pdifRolls?: readonly number[];
}): { hit: boolean; crit: boolean; dmg: number; hits: number; text: string } {
  const spell = blueSpellByName(input.name);
  if (!spell || spell.kind !== "physical") return { hit: false, crit: false, dmg: 0, hits: 0, text: "No effect." };
  const chance = hitRate(input.accuracy, input.evasion, input.dLevel);
  const ftp = input.ftp ?? spell.ftp;
  const vitMod = spell.vitMod ?? 0;
  const agiMod = spell.agiMod ?? 0;
  const intMod = spell.intMod ?? 0;
  const chrMod = spell.chrMod ?? 0;
  const mndMod = spell.mndMod ?? 0;
  const wsc = Math.floor(input.str * spell.strMod) + Math.floor(input.dex * spell.dexMod) + Math.floor((input.vit ?? 0) * vitMod) + Math.floor((input.agi ?? 0) * agiMod) + Math.floor((input.int ?? 0) * intMod) + Math.floor((input.chr ?? 0) * chrMod) + Math.floor((input.mnd ?? 0) * mndMod);
  const mod = input.chainAffinity ? wsc * 2 : wsc;
  const stat = blueBaseDamage(input.blueSkill, spell.dCap) + blueFstr(input.str - input.targetVit) + mod;
  const defense = Math.max(1, input.defense);
  const ratio = (input.attack * (input.attackMult ?? 1)) / defense;
  const crit = input.crit ?? input.chainAffinity;
  let landed = 0;
  let dmg = 0;
  for (let i = 0; i < spell.hits; i++) {
    const roll = input.hitRolls?.[i] ?? input.hitRoll;
    if (roll >= chance) continue;
    const coeff = spell.hits > 1 && i > 0 ? 1 : ftp;
    const base = Math.floor(stat * coeff);
    const pdif = rollSwordPdif(ratio, crit, () => input.pdifRolls?.[i] ?? input.pdifRoll);
    dmg += Math.max(0, Math.floor(base * pdif));
    landed += 1;
  }
  if (landed === 0) return { hit: false, crit: false, dmg: 0, hits: 0, text: `${spell.name} misses the ${input.targetName}.` };
  const verb = crit ? "critical hit" : "hit";
  const points = dmg === 1 ? "point" : "points";
  const times = spell.hits > 1 ? ` ${landed} time${landed === 1 ? "" : "s"}` : "";
  return { hit: true, crit, dmg, hits: landed, text: `${spell.name} ${verb}s the ${input.targetName}${times} for ${dmg} ${points} of damage.` };
}

export function bluJobLevel(job: JobId, sub: JobId | null, subLevel: number, mainLevel: number): number {
  if (job === "BLU") return mainLevel;
  if (sub === "BLU") return subLevel;
  return 0;
}

export function bluSkill(name: string, level: number): number {
  const row = BLU_SKILLS.find((skill) => skill.name === name);
  return row ? skillCap(row.rank, level) : 0;
}

export function assertBlu(): void {
  const naked = characterBase("hume", "BLU", 75);
  if (naked.hp !== 1046 || naked.mp !== 464 || naked.str !== 53 || naked.dex !== 53 || naked.vit !== 53 || naked.agi !== 53 || naked.int !== 53 || naked.mnd !== 53 || naked.chr !== 53) {
    throw new Error(`Hume BLU 75 ${naked.hp}/${naked.mp}/${naked.str}/${naked.dex}/${naked.vit}/${naked.agi}/${naked.int}/${naked.mnd}/${naked.chr}`);
  }
  const warBlu = characterBase("hume", "WAR", 75, "BLU", 37);
  if (warBlu.mp !== 118) throw new Error(`WAR/BLU MP ${warBlu.mp}`);
  if (bluJobLevel("BLU", null, 0, 75) !== 75 || bluJobLevel("WAR", "BLU", 37, 75) !== 37 || bluJobLevel("WAR", null, 0, 75) !== 0) throw new Error("Blue Mage level");
  if (bluSkill("Sword", 75) !== 276 || bluSkill("Club", 75) !== 240 || bluSkill("Evasion", 75) !== 220 || bluSkill("Parrying", 75) !== 210 || bluSkill("Blue Magic", 75) !== 276) {
    throw new Error("weapon ranks");
  }
  if (bluSkill("Sword", 37) !== 114 || bluSkill("Club", 37) !== 109 || bluSkill("Evasion", 37) !== 105 || bluSkill("Parrying", 37) !== 101 || bluSkill("Blue Magic", 37) !== 114) {
    throw new Error("sub ranks");
  }
  if (bluSkill("Shield", 75) !== 0 || bluSkill("Staff", 75) !== 0 || bluSkill("Axe", 75) !== 0 || bluSkill("Dagger", 75) !== 0) throw new Error("missing rank");
  if (BLU_TRAITS.length !== 0) throw new Error("traits come from set spells");
  const banned = ["Efflux", "Unbridled Learning", "Unbridled Wisdom", "Enchainment", "Assimilation"];
  if (BLU_ABILITIES.some((ability) => banned.includes(ability.name))) throw new Error("post-75 kit");
  if (BLU_ABILITIES.filter((ability) => ability.merit).map((ability) => ability.name).join(",") !== "Convergence,Diffusion") throw new Error("merit abilities");
  if (BLU_ABILITIES.some((ability) => !ability.merit && (ability.name === "Convergence" || ability.name === "Diffusion"))) throw new Error("merit flag");
  if (BLU_ABILITIES.map((ability) => ability.name).join(",") !== "Azure Lore,Burst Affinity,Chain Affinity,Convergence,Diffusion") throw new Error("ability order");
  if (BLU_ABILITIES.filter((ability) => ability.access === "sub" && ability.level <= 37 && !ability.merit).map((ability) => ability.name).join(",") !== "Burst Affinity") {
    throw new Error("subjob abilities");
  }
  const lore = BLU_ABILITIES[0];
  if (!lore || lore.level !== 1 || lore.access !== "main" || lore.recast !== 3600 || lore.duration !== 30 || lore.ce !== 1 || lore.ve !== 300) throw new Error("Azure Lore");
  const burst = BLU_ABILITIES[1];
  if (!burst || burst.level !== 25 || burst.recast !== 120 || burst.duration !== 30) throw new Error("Burst Affinity");
  const chain = BLU_ABILITIES[2];
  if (!chain || chain.level !== 40 || chain.access !== "sub") throw new Error("Chain Affinity");
  const converge = BLU_ABILITIES[3];
  const diffuse = BLU_ABILITIES[4];
  if (!converge || !diffuse || !converge.merit || !diffuse.merit || converge.access !== "main" || diffuse.access !== "main" || converge.level !== 75 || diffuse.level !== 75 || converge.recast !== 600 || diffuse.recast !== 600 || converge.duration !== 60 || diffuse.duration !== 60) {
    throw new Error("level 75 affinities");
  }
  if (BLUE_SPELLS.map((spell) => spell.name).join(",") !== "Foot Kick,Sandspin,Pollen,Power Attack,Sprout Smack,Wild Oats,Cocoon,Metallic Body,Queasyshroom,Battle Dance,Head Butt,Feather Storm,Healing Breeze,Sheep Song,Helldive,Bludgeon,Cursed Sphere,Blastbomb,Claw Cyclone,Poison Breath,Soporific,Screwdriver,Bomb Toss,Grand Slam,Wild Carrot,Chaotic Eye,Sound Blast,Death Ray,Smite of Rage,Digest,Pinecone Bomb,MP Drainkiss,Blitzstrahl,Stinking Gas,Mandibular Bite,Magnetite Cloud,Uppercut,Blank Gaze,Jet Stream,Mysterious Light,Terror Touch,Venom Shell,Refueling,Magic Fruit,Memento Mori,Frenetic Rip,Zephyr Mantle,Cannonball,Disseverment,Mind Blast,Actinic Burst,Plasma Charge,Geist Wall,Awful Eye,Blood Saber,Jettatura,Ice Break,Self-Destruct,Frightful Roar,Cold Wave,Filamented Hold,Hecatomb Wave,Radiant Breath,Feather Barrier,Flying Hip Press,Light of Penance,Death Scissors,Dimensional Death,Spiral Spin,Maelstrom,Eyes On Me,Seedspray,Bad Breath,Body Slam,1000 Needles,Spinal Cleave,Frypan,Hydro Shot,Feather Tickle,Yawn,Voracious Trunk,Infrasonics,Frost Breath,Sandspray,Corrosive Ooze,Diamondhide,Enervation,Warm-Up,Firespit,Tail Slap,Hysteric Barrage,Regurgitation,Amplification,Asuran Claws,Lowing,Heat Breath,Triumphant Roar,Sickle Slash,Sub-zero Smash,Saline Coat,Ram Charge,Temporal Shift,Magic Hammer,Reactor Cool,Exuviation,Vertical Cleave") throw new Error("blue spell list");
  if (FOOT_KICK.kind !== "physical" || FOOT_KICK.level !== 1 || FOOT_KICK.mp !== 5 || FOOT_KICK.points !== 2 || FOOT_KICK.cast !== 0.5 || FOOT_KICK.recast !== 6.5 || FOOT_KICK.range !== 4.5 || FOOT_KICK.hits !== 1 || FOOT_KICK.ftp !== 1 || FOOT_KICK.dCap !== 9 || FOOT_KICK.agi !== 1 || FOOT_KICK.hp !== 0 || FOOT_KICK.str !== 0 || FOOT_KICK.dex !== 0 || FOOT_KICK.chr !== 0 || FOOT_KICK.refreshTrait !== 0 || FOOT_KICK.conserveTrait !== 0 || FOOT_KICK.regenTrait !== 0 || FOOT_KICK.attackTrait !== 0 || FOOT_KICK.chain !== "Detonation" || "chain2" in FOOT_KICK || FOOT_KICK.family !== "Rabbit" || FOOT_KICK.strMod !== 0.1 || FOOT_KICK.dexMod !== 0.1 || FOOT_KICK.granted) {
    throw new Error("Foot Kick card");
  }
  if (WILD_CARROT.kind !== "cure" || WILD_CARROT.level !== 30 || WILD_CARROT.mp !== 37 || WILD_CARROT.points !== 3 || WILD_CARROT.cast !== 2.5 || WILD_CARROT.recast !== 6 || WILD_CARROT.range !== 20 || WILD_CARROT.hp !== 5 || WILD_CARROT.agi !== 0 || WILD_CARROT.str !== 0 || WILD_CARROT.dex !== 0 || WILD_CARROT.chr !== 0 || WILD_CARROT.refreshTrait !== 0 || WILD_CARROT.conserveTrait !== 0 || WILD_CARROT.regenTrait !== 0 || WILD_CARROT.sleepTrait !== 4 || WILD_CARROT.family !== "Rabbit" || WILD_CARROT.granted) {
    throw new Error("Wild Carrot card");
  }
  if (HEALING_BREEZE.kind !== "breeze" || HEALING_BREEZE.level !== 16 || HEALING_BREEZE.mp !== 55 || HEALING_BREEZE.points !== 4 || HEALING_BREEZE.cast !== 4.5 || HEALING_BREEZE.recast !== 15 || HEALING_BREEZE.radius !== 10 || HEALING_BREEZE.hp !== 10 || HEALING_BREEZE.chr !== 2 || HEALING_BREEZE.agi !== 0 || HEALING_BREEZE.str !== 0 || HEALING_BREEZE.dex !== 0 || HEALING_BREEZE.refreshTrait !== 0 || HEALING_BREEZE.conserveTrait !== 0 || HEALING_BREEZE.regenTrait !== 4 || HEALING_BREEZE.family !== "Dhalmel" || !HEALING_BREEZE.granted) {
    throw new Error("Healing Breeze card");
  }
  if (SHEEP_SONG.kind !== "song" || SHEEP_SONG.level !== 16 || SHEEP_SONG.mp !== 22 || SHEEP_SONG.points !== 2 || SHEEP_SONG.cast !== 3 || SHEEP_SONG.recast !== 60 || SHEEP_SONG.radius !== 6 || SHEEP_SONG.ce !== 320 || SHEEP_SONG.ve !== 320 || SHEEP_SONG.hp !== 5 || SHEEP_SONG.chr !== 1 || SHEEP_SONG.agi !== 0 || SHEEP_SONG.str !== 0 || SHEEP_SONG.dex !== 0 || SHEEP_SONG.refreshTrait !== 0 || SHEEP_SONG.conserveTrait !== 0 || SHEEP_SONG.regenTrait !== 4 || SHEEP_SONG.family !== "Sheep" || !SHEEP_SONG.granted) {
    throw new Error("Sheep Song card");
  }
  if (CHAOTIC_EYE.kind !== "silence" || CHAOTIC_EYE.level !== 32 || CHAOTIC_EYE.mp !== 13 || CHAOTIC_EYE.points !== 2 || CHAOTIC_EYE.cast !== 3 || CHAOTIC_EYE.recast !== 10 || CHAOTIC_EYE.range !== 21 || CHAOTIC_EYE.seconds !== 120 || CHAOTIC_EYE.ce !== 1 || CHAOTIC_EYE.ve !== 320 || CHAOTIC_EYE.agi !== 1 || CHAOTIC_EYE.hp !== 0 || CHAOTIC_EYE.refreshTrait !== 0 || CHAOTIC_EYE.conserveTrait !== 4 || CHAOTIC_EYE.regenTrait !== 0 || CHAOTIC_EYE.family !== "Coeurl" || !CHAOTIC_EYE.granted) {
    throw new Error("Chaotic Eye card");
  }
  if (ZEPHYR_MANTLE.kind !== "mantle" || ZEPHYR_MANTLE.level !== 65 || ZEPHYR_MANTLE.mp !== 31 || ZEPHYR_MANTLE.points !== 2 || ZEPHYR_MANTLE.cast !== 7 || ZEPHYR_MANTLE.recast !== 60 || ZEPHYR_MANTLE.seconds !== 300 || ZEPHYR_MANTLE.shadows !== 4 || ZEPHYR_MANTLE.ce !== 320 || ZEPHYR_MANTLE.ve !== 320 || ZEPHYR_MANTLE.agi !== 2 || ZEPHYR_MANTLE.hp !== 0 || ZEPHYR_MANTLE.refreshTrait !== 0 || ZEPHYR_MANTLE.conserveTrait !== 4 || ZEPHYR_MANTLE.regenTrait !== 0 || ZEPHYR_MANTLE.family !== "Puk" || !ZEPHYR_MANTLE.granted) {
    throw new Error("Zephyr Mantle card");
  }
  if (ACTINIC_BURST.kind !== "flash" || ACTINIC_BURST.level !== 74 || ACTINIC_BURST.mp !== 24 || ACTINIC_BURST.points !== 4 || ACTINIC_BURST.cast !== 0.5 || ACTINIC_BURST.recast !== 60 || ACTINIC_BURST.radius !== 10 || ACTINIC_BURST.seconds !== 15 || ACTINIC_BURST.macc !== 200 || ACTINIC_BURST.accDown !== 300 || ACTINIC_BURST.ce !== 180 || ACTINIC_BURST.ve !== 1080 || ACTINIC_BURST.hp !== 20 || ACTINIC_BURST.chr !== 2 || ACTINIC_BURST.str !== 0 || ACTINIC_BURST.dex !== 0 || ACTINIC_BURST.refreshTrait !== 4 || ACTINIC_BURST.conserveTrait !== 0 || ACTINIC_BURST.regenTrait !== 0 || ACTINIC_BURST.family !== "Ghrah" || !ACTINIC_BURST.granted) {
    throw new Error("Actinic Burst card");
  }
  if (PLASMA_CHARGE.kind !== "spikes" || PLASMA_CHARGE.level !== 75 || PLASMA_CHARGE.mp !== 24 || PLASMA_CHARGE.points !== 5 || PLASMA_CHARGE.cast !== 3 || PLASMA_CHARGE.recast !== 60 || PLASMA_CHARGE.seconds !== 720 || PLASMA_CHARGE.ce !== 1 || PLASMA_CHARGE.ve !== 480 || PLASMA_CHARGE.str !== 3 || PLASMA_CHARGE.dex !== 3 || PLASMA_CHARGE.hp !== 0 || PLASMA_CHARGE.chr !== 0 || PLASMA_CHARGE.refreshTrait !== 4 || PLASMA_CHARGE.conserveTrait !== 0 || PLASMA_CHARGE.regenTrait !== 0 || PLASMA_CHARGE.family !== "Phuabo" || !PLASMA_CHARGE.granted) {
    throw new Error("Plasma Charge card");
  }
  if (blueLearnSkill(1) !== 0 || FOOT_KICK.learnSkill !== 0) throw new Error("Foot Kick skill gate");
  if (blueLearnSkill(8) !== 0 || COCOON.learnSkill !== 0) throw new Error("Cocoon skill gate");
  if (blueLearnSkill(12) !== 8 || BATTLE_DANCE.learnSkill !== 8) throw new Error("Battle Dance skill gate");
  if (blueLearnSkill(16) !== 20 || HEALING_BREEZE.learnSkill !== 20 || SHEEP_SONG.learnSkill !== 20) throw new Error("level 16 skill gate");
  if (blueLearnSkill(30) !== 62 || WILD_CARROT.learnSkill !== 62) throw new Error("Wild Carrot skill gate");
  if (blueLearnSkill(32) !== 68 || CHAOTIC_EYE.learnSkill !== 68) throw new Error("Chaotic Eye skill gate");
  if (blueLearnSkill(38) !== 86 || UPPERCUT.learnSkill !== 86) throw new Error("Uppercut skill gate");
  if (blueLearnSkill(48) !== 116 || REFUELING.learnSkill !== 116) throw new Error("Refueling skill gate");
  if (blueLearnSkill(65) !== 196 || ZEPHYR_MANTLE.learnSkill !== 196) throw new Error("Zephyr Mantle skill gate");
  if (blueLearnSkill(74) !== 240 || ACTINIC_BURST.learnSkill !== 240) throw new Error("Actinic Burst skill gate");
  if (blueLearnSkill(75) !== 245 || PLASMA_CHARGE.learnSkill !== 245) throw new Error("Plasma Charge skill gate");
  if (bluePointCap(1).points !== 10 || bluePointCap(1).slots !== 6) throw new Error("point cap 1");
  if (bluePointCap(37).points !== 25 || bluePointCap(37).slots !== 12) throw new Error("point cap 37");
  if (bluePointCap(75).points !== 45 || bluePointCap(75).slots !== 20) throw new Error("point cap 75");
  if (blueSetAgi([]) !== 0 || blueSetAgi(["Foot Kick"]) !== 1 || blueSetAgi(["Wild Carrot"]) !== 0 || blueSetAgi(["Pollen"]) !== 0 || blueSetAgi(["Chaotic Eye"]) !== 1 || blueSetAgi(["Zephyr Mantle"]) !== 2 || blueSetAgi(["Foot Kick", "Chaotic Eye", "Zephyr Mantle"]) !== 4) throw new Error("set AGI");
  if (blueSetHp([]) !== 0 || blueSetHp(["Wild Carrot"]) !== 5 || blueSetHp(["Foot Kick"]) !== 0 || blueSetHp(["Foot Kick", "Wild Carrot"]) !== 5 || blueSetHp(["Pollen"]) !== 5) {
    throw new Error("set HP");
  }
  if (blueSetHp(["Actinic Burst"]) !== 20 || blueSetChr(["Actinic Burst"]) !== 2 || blueSetStr(["Actinic Burst"]) !== 0 || blueSetDex(["Plasma Charge"]) !== 3 || blueSetStr(["Plasma Charge"]) !== 3 || blueSetChr(["Plasma Charge"]) !== 0) {
    throw new Error("luminion set bonus");
  }
  if (blueSetHp(["Actinic Burst", "Plasma Charge"]) !== 20 || blueSetStr(["Actinic Burst", "Plasma Charge"]) !== 3 || blueSetDex(["Foot Kick", "Plasma Charge"]) !== 3 || blueSetChr(["Wild Carrot", "Actinic Burst"]) !== 2) {
    throw new Error("combined set bonus");
  }
  if (blueAutoRefresh([]) !== 0 || blueAutoRefresh(["Actinic Burst"]) !== 0 || blueAutoRefresh(["Plasma Charge"]) !== 0 || blueAutoRefresh(["Actinic Burst", "Plasma Charge"]) !== 1 || blueAutoRefresh(["Foot Kick", "Actinic Burst", "Plasma Charge"]) !== 1) {
    throw new Error("Auto Refresh");
  }
  if (blueSetTraits(["Actinic Burst"]).length !== 0 || blueSetTraits(["Chaotic Eye"]).length !== 0 || blueSetTraits(["Zephyr Mantle"]).length !== 0 || blueSetTraits(["Healing Breeze"]).length !== 0 || blueSetTraits(["Sheep Song"]).length !== 0 || blueSetTraits(["Battle Dance"]).length !== 0 || blueSetTraits(["Uppercut"]).length !== 0 || blueSetTraits(["Actinic Burst", "Plasma Charge"]).map((trait) => trait.name).join(",") !== "Auto Refresh" || blueSetTraits(["Chaotic Eye", "Zephyr Mantle"]).map((trait) => trait.name).join(",") !== "Conserve MP" || blueSetTraits(["Healing Breeze", "Sheep Song"]).map((trait) => trait.name).join(",") !== "Auto Regen" || blueSetTraits(["Battle Dance", "Uppercut"]).map((trait) => trait.name).join(",") !== "Attack Bonus" || blueSetTraits(["Healing Breeze", "Sheep Song", "Chaotic Eye", "Zephyr Mantle", "Actinic Burst", "Plasma Charge"]).map((trait) => trait.name).join(",") !== "Auto Regen,Auto Refresh,Conserve MP" || blueSetTraits(["Healing Breeze", "Sheep Song", "Battle Dance", "Uppercut", "Chaotic Eye", "Zephyr Mantle", "Actinic Burst", "Plasma Charge"]).map((trait) => trait.name).join(",") !== "Auto Regen,Attack Bonus,Auto Refresh,Conserve MP") {
    throw new Error("Auto Refresh trait row");
  }
  if (blueAutoRegen([]) !== 0 || blueAutoRegen(["Healing Breeze"]) !== 0 || blueAutoRegen(["Sheep Song"]) !== 0 || blueAutoRegen(["Healing Breeze", "Sheep Song"]) !== 1 || blueAutoRegen(["Foot Kick", "Healing Breeze", "Sheep Song"]) !== 1) {
    throw new Error("Auto Regen");
  }
  if (blueSetHp(["Healing Breeze"]) !== 10 || blueSetChr(["Healing Breeze"]) !== 2 || blueSetHp(["Sheep Song"]) !== 5 || blueSetChr(["Sheep Song"]) !== 1 || blueSetHp(["Healing Breeze", "Sheep Song"]) !== 15 || blueSetChr(["Healing Breeze", "Sheep Song"]) !== 3) {
    throw new Error("beast set bonus");
  }
  if (blueConserveMp([]) !== 0 || blueConserveMp(["Chaotic Eye"]) !== 0 || blueConserveMp(["Zephyr Mantle"]) !== 0 || blueConserveMp(["Actinic Burst", "Plasma Charge"]) !== 0 || blueConserveMp(["Chaotic Eye", "Zephyr Mantle"]) !== 0.25 || blueConserveMp(["Foot Kick", "Chaotic Eye", "Zephyr Mantle"]) !== 0.25) {
    throw new Error("Conserve MP");
  }
  if (grantedBlueSpells().join(",") !== "Sandspin,Pollen,Power Attack,Sprout Smack,Wild Oats,Cocoon,Metallic Body,Queasyshroom,Battle Dance,Head Butt,Feather Storm,Healing Breeze,Sheep Song,Helldive,Bludgeon,Cursed Sphere,Blastbomb,Claw Cyclone,Poison Breath,Soporific,Screwdriver,Bomb Toss,Grand Slam,Chaotic Eye,Sound Blast,Death Ray,Smite of Rage,Digest,Pinecone Bomb,MP Drainkiss,Blitzstrahl,Stinking Gas,Mandibular Bite,Magnetite Cloud,Uppercut,Blank Gaze,Jet Stream,Mysterious Light,Terror Touch,Venom Shell,Refueling,Magic Fruit,Memento Mori,Frenetic Rip,Zephyr Mantle,Cannonball,Disseverment,Mind Blast,Actinic Burst,Plasma Charge,Geist Wall,Awful Eye,Blood Saber,Jettatura,Ice Break,Self-Destruct,Frightful Roar,Cold Wave,Filamented Hold,Hecatomb Wave,Radiant Breath,Feather Barrier,Flying Hip Press,Light of Penance,Death Scissors,Dimensional Death,Spiral Spin,Maelstrom,Eyes On Me,Seedspray,Bad Breath,Body Slam,1000 Needles,Spinal Cleave,Frypan,Hydro Shot,Feather Tickle,Yawn,Voracious Trunk,Infrasonics,Frost Breath,Sandspray,Corrosive Ooze,Diamondhide,Enervation,Warm-Up,Firespit,Tail Slap,Hysteric Barrage,Regurgitation,Amplification,Asuran Claws,Lowing,Heat Breath,Triumphant Roar,Sickle Slash,Sub-zero Smash,Saline Coat,Ram Charge,Temporal Shift,Magic Hammer,Reactor Cool,Exuviation,Vertical Cleave" || withGrantedBlue(["Foot Kick"]).join(",") !== "Foot Kick,Sandspin,Pollen,Power Attack,Sprout Smack,Wild Oats,Cocoon,Metallic Body,Queasyshroom,Battle Dance,Head Butt,Feather Storm,Healing Breeze,Sheep Song,Helldive,Bludgeon,Cursed Sphere,Blastbomb,Claw Cyclone,Poison Breath,Soporific,Screwdriver,Bomb Toss,Grand Slam,Chaotic Eye,Sound Blast,Death Ray,Smite of Rage,Digest,Pinecone Bomb,MP Drainkiss,Blitzstrahl,Stinking Gas,Mandibular Bite,Magnetite Cloud,Uppercut,Blank Gaze,Jet Stream,Mysterious Light,Terror Touch,Venom Shell,Refueling,Magic Fruit,Memento Mori,Frenetic Rip,Zephyr Mantle,Cannonball,Disseverment,Mind Blast,Actinic Burst,Plasma Charge,Geist Wall,Awful Eye,Blood Saber,Jettatura,Ice Break,Self-Destruct,Frightful Roar,Cold Wave,Filamented Hold,Hecatomb Wave,Radiant Breath,Feather Barrier,Flying Hip Press,Light of Penance,Death Scissors,Dimensional Death,Spiral Spin,Maelstrom,Eyes On Me,Seedspray,Bad Breath,Body Slam,1000 Needles,Spinal Cleave,Frypan,Hydro Shot,Feather Tickle,Yawn,Voracious Trunk,Infrasonics,Frost Breath,Sandspray,Corrosive Ooze,Diamondhide,Enervation,Warm-Up,Firespit,Tail Slap,Hysteric Barrage,Regurgitation,Amplification,Asuran Claws,Lowing,Heat Breath,Triumphant Roar,Sickle Slash,Sub-zero Smash,Saline Coat,Ram Charge,Temporal Shift,Magic Hammer,Reactor Cool,Exuviation,Vertical Cleave" || withGrantedBlue(["Actinic Burst"]).join(",") !== "Actinic Burst,Sandspin,Pollen,Power Attack,Sprout Smack,Wild Oats,Cocoon,Metallic Body,Queasyshroom,Battle Dance,Head Butt,Feather Storm,Healing Breeze,Sheep Song,Helldive,Bludgeon,Cursed Sphere,Blastbomb,Claw Cyclone,Poison Breath,Soporific,Screwdriver,Bomb Toss,Grand Slam,Chaotic Eye,Sound Blast,Death Ray,Smite of Rage,Digest,Pinecone Bomb,MP Drainkiss,Blitzstrahl,Stinking Gas,Mandibular Bite,Magnetite Cloud,Uppercut,Blank Gaze,Jet Stream,Mysterious Light,Terror Touch,Venom Shell,Refueling,Magic Fruit,Memento Mori,Frenetic Rip,Zephyr Mantle,Cannonball,Disseverment,Mind Blast,Plasma Charge,Geist Wall,Awful Eye,Blood Saber,Jettatura,Ice Break,Self-Destruct,Frightful Roar,Cold Wave,Filamented Hold,Hecatomb Wave,Radiant Breath,Feather Barrier,Flying Hip Press,Light of Penance,Death Scissors,Dimensional Death,Spiral Spin,Maelstrom,Eyes On Me,Seedspray,Bad Breath,Body Slam,1000 Needles,Spinal Cleave,Frypan,Hydro Shot,Feather Tickle,Yawn,Voracious Trunk,Infrasonics,Frost Breath,Sandspray,Corrosive Ooze,Diamondhide,Enervation,Warm-Up,Firespit,Tail Slap,Hysteric Barrage,Regurgitation,Amplification,Asuran Claws,Lowing,Heat Breath,Triumphant Roar,Sickle Slash,Sub-zero Smash,Saline Coat,Ram Charge,Temporal Shift,Magic Hammer,Reactor Cool,Exuviation,Vertical Cleave") {
    throw new Error("granted blue magic");
  }
  if (actinicCanReplace(undefined) !== true || actinicCanReplace({ name: "Flash", flashFrom: "burst" }) !== true || actinicCanReplace({ name: "Flash" }) !== false || actinicCanReplace({ name: "Flash", flashFrom: "spell" }) !== false) {
    throw new Error("Actinic Burst does not overwrite Flash");
  }
  if (chaoticCanReplace(undefined) !== true || chaoticCanReplace({ name: "Silence", silenceFrom: "eye" }) !== true || chaoticCanReplace({ name: "Silence" }) !== false || chaoticCanReplace({ name: "Silence", silenceFrom: "spell" }) !== false) {
    throw new Error("Chaotic Eye does not overwrite Silence");
  }
  if (!mantleCanReplace([]) || !mantleCanReplace([{ name: "Blink", blinkFrom: "mantle", charges: 1 }]) || mantleCanReplace([{ name: "Blink", charges: 2 }]) || mantleCanReplace([{ name: "Blink", blinkFrom: "spell" }]) || mantleCanReplace([{ name: "Blink", blinkFrom: "aerial" }]) || mantleCanReplace([{ name: "Copy Image", charges: 3 }]) || !mantleCanReplace([{ name: "Copy Image", charges: 0 }])) {
    throw new Error("Zephyr Mantle overwrite");
  }
  if (COCOON.kind !== "cocoon" || COCOON.level !== 8 || COCOON.mp !== 10 || COCOON.points !== 1 || COCOON.cast !== 1.75 || COCOON.recast !== 60 || COCOON.seconds !== 90 || COCOON.defenseNumer !== 128 || COCOON.ce !== 1 || COCOON.ve !== 80 || COCOON.vit !== 3 || COCOON.agi !== 0 || COCOON.hp !== 0 || COCOON.refreshTrait !== 0 || COCOON.conserveTrait !== 0 || COCOON.regenTrait !== 0 || COCOON.attackTrait !== 0 || COCOON.accuracyTrait !== 0 || COCOON.family !== "Crawler" || !COCOON.granted) {
    throw new Error("Cocoon card");
  }
  if (REFUELING.kind !== "refuel" || REFUELING.level !== 48 || REFUELING.mp !== 29 || REFUELING.points !== 4 || REFUELING.cast !== 1.5 || REFUELING.recast !== 30 || REFUELING.seconds !== 300 || REFUELING.haste !== 102 || Math.round((1000 / 10000) * 1024) !== 102 || REFUELING.ce !== 1 || REFUELING.ve !== 300 || REFUELING.agi !== 2 || REFUELING.vit !== 0 || REFUELING.hp !== 0 || REFUELING.refreshTrait !== 0 || REFUELING.conserveTrait !== 0 || REFUELING.family !== "Cluster" || !REFUELING.granted) {
    throw new Error("Refueling card");
  }
  if (blueSetVit([]) !== 0 || blueSetVit(["Cocoon"]) !== 3 || blueSetVit(["Refueling"]) !== 0 || blueSetVit(["Foot Kick", "Cocoon"]) !== 3 || blueSetAgi(["Refueling"]) !== 2 || blueSetAgi(["Refueling", "Zephyr Mantle"]) !== 4) {
    throw new Error("Cocoon and Refueling set bonus");
  }
  if (blueSetTraits(["Cocoon"]).length !== 0 || blueSetTraits(["Refueling"]).length !== 0 || blueSetTraits(["Cocoon", "Refueling"]).length !== 0) {
    throw new Error("Cocoon and Refueling grant no trait");
  }
  if (!refuelCanReplace([]) || !refuelCanReplace([{ name: "Haste", hasteFrom: "refuel" }]) || refuelCanReplace([{ name: "Haste", hasteFrom: "spell" }]) || refuelCanReplace([{ name: "Haste", hasteFrom: "hastega" }]) || refuelCanReplace([{ name: "Haste" }])) {
    throw new Error("Refueling overwrite");
  }
  if (actinicMagicAccuracy(276, 0) !== 476) throw new Error("Actinic Burst magic accuracy");
  if (chaoticMagicAccuracy(276, 0) !== 276) throw new Error("Chaotic Eye magic accuracy");
  if (wildCarrotPower(53, 53, 0) !== 212 || wildCarrotBase(212) !== 158 || wildCarrotBase(0) !== 120 || wildCarrotBase(400) <= 180) {
    throw new Error("Wild Carrot heal");
  }
  if (healingBreezePower(53, 53, 0) !== 212 || healingBreezeBase(212) !== 114 || healingBreezeBase(0) !== 60 || healingBreezeBase(219) !== 118 || healingBreezeBase(220) !== 120 || healingBreezeBase(459) !== 120 || healingBreezeBase(460) !== 180 || healingBreezeBase(2000) !== 180) {
    throw new Error("Healing Breeze heal");
  }
  if (sheepSongSeconds(0) !== 40 || sheepSongSeconds(0.999) !== 60 || sheepSongSeconds(1) !== 60) throw new Error("Sheep Song duration");
  if (BATTLE_DANCE.kind !== "physical" || BATTLE_DANCE.level !== 12 || BATTLE_DANCE.mp !== 12 || BATTLE_DANCE.points !== 3 || BATTLE_DANCE.cast !== 1 || BATTLE_DANCE.recast !== 10 || BATTLE_DANCE.radius !== 10 || "range" in BATTLE_DANCE || BATTLE_DANCE.hits !== 1 || BATTLE_DANCE.ftp !== 2 || BATTLE_DANCE.dCap !== 17 || BATTLE_DANCE.strMod !== 0.3 || BATTLE_DANCE.dexMod !== 0 || BATTLE_DANCE.dex !== 2 || BATTLE_DANCE.str !== 0 || BATTLE_DANCE.hp !== 0 || BATTLE_DANCE.attackTrait !== 4 || BATTLE_DANCE.chain !== "Impaction" || "chain2" in BATTLE_DANCE || BATTLE_DANCE.family !== "Orc" || !BATTLE_DANCE.granted) {
    throw new Error("Battle Dance card");
  }
  if (UPPERCUT.kind !== "physical" || UPPERCUT.level !== 38 || UPPERCUT.mp !== 31 || UPPERCUT.points !== 3 || UPPERCUT.cast !== 0.5 || UPPERCUT.recast !== 17 || UPPERCUT.range !== 4.5 || "radius" in UPPERCUT || UPPERCUT.hits !== 1 || UPPERCUT.ftp !== 1.5 || UPPERCUT.dCap !== 39 || UPPERCUT.strMod !== 0.35 || UPPERCUT.dexMod !== 0 || UPPERCUT.str !== 2 || UPPERCUT.dex !== 1 || UPPERCUT.hp !== 0 || UPPERCUT.attackTrait !== 4 || UPPERCUT.chain !== "Liquefaction" || UPPERCUT.chain2 !== "Impaction" || UPPERCUT.family !== "Goobbue" || !UPPERCUT.granted) {
    throw new Error("Uppercut card");
  }
  if (blueBaseDamage(276, 17) !== 17 || blueBaseDamage(276, 39) !== 39 || blueBaseDamage(0, 17) !== 3) throw new Error("physical damage caps");
  if (blueFtp(0, 1.6, 2, 2.3) !== 1.6 || blueFtp(1500, 1.6, 2, 2.3) !== 2 || blueFtp(3000, 1.6, 2, 2.3) !== 2.3 || blueFtp(750, 90, 480, 680) !== 285 || blueFtp(4000, 90, 480, 680) !== 680) {
    throw new Error("blue fTP");
  }
  if (battleDanceSeconds(0, false, false) !== 90 || battleDanceSeconds(3000, false, false) !== 90 || battleDanceSeconds(0, true, false) !== 90 || battleDanceSeconds(1500, true, false) !== 480 || battleDanceSeconds(3000, true, false) !== 680 || battleDanceSeconds(0, true, true) !== 680) {
    throw new Error("Battle Dance duration");
  }
  if (uppercutAttackMult(0, false, false) !== 1.6 || uppercutAttackMult(0, true, false) !== 1.6 || uppercutAttackMult(3000, true, false) !== 2.3 || uppercutAttackMult(0, false, true) !== 2.4 || uppercutAttackMult(3000, true, true) !== 2.4) {
    throw new Error("Uppercut attack multiplier");
  }
  if (blueAttackMult("Foot Kick", 3000, true, true) !== 1 || blueAttackMult("Battle Dance", 3000, true, true) !== 1 || blueAttackMult("Uppercut", 0, false, false) !== 1.6 || blueAttackMult("Power Attack", 0, false, false) !== 1.8 || blueAttackMult("Power Attack", 3000, true, true) !== 1.8) {
    throw new Error("attack multiplier gate");
  }
  if (blueChainProps("Foot Kick").join(",") !== "Detonation" || blueChainProps("Battle Dance").join(",") !== "Impaction" || blueChainProps("Uppercut").join(",") !== "Liquefaction,Impaction" || blueChainProps("Frenetic Rip").join(",") !== "Induration" || blueChainProps("Disseverment").join(",") !== "Distortion" || blueChainProps("Cannonball").join(",") !== "Fusion" || blueChainProps("Power Attack").join(",") !== "Reverberation" || blueChainProps("Sprout Smack").join(",") !== "Reverberation" || blueChainProps("Wild Oats").join(",") !== "Transfixion" || blueChainProps("Wild Carrot").length !== 0 || blueChainProps("Magic Fruit").length !== 0 || blueChainProps("Pollen").length !== 0 || blueChainProps("Sandspin").length !== 0) {
    throw new Error("blue skillchain properties");
  }
  if (blueAttackBonus([]) !== 0 || blueAttackBonus(["Battle Dance"]) !== 0 || blueAttackBonus(["Uppercut"]) !== 0 || blueAttackBonus(["Battle Dance", "Uppercut"]) !== 10 || blueAttackBonus(["Foot Kick", "Battle Dance", "Uppercut"]) !== 10) {
    throw new Error("Attack Bonus");
  }
  if (blueSetDex(["Battle Dance"]) !== 2 || blueSetStr(["Battle Dance"]) !== 0 || blueSetStr(["Uppercut"]) !== 2 || blueSetDex(["Uppercut"]) !== 1 || blueSetStr(["Battle Dance", "Uppercut"]) !== 2 || blueSetDex(["Battle Dance", "Uppercut"]) !== 3) {
    throw new Error("brawler set bonus");
  }
  const learned = offerBlueLearn({ name: "Foot Kick", used: true, main: true, alive: true, claimed: true, already: false, blueSkill: 0 });
  if (!learned.learn || learned.line !== "You learn Foot Kick!") throw new Error("learn Foot Kick");
  if (offerBlueLearn({ name: "Foot Kick", used: false, main: true, alive: true, claimed: true, already: false, blueSkill: 276 }).learn) throw new Error("learn without the move");
  if (offerBlueLearn({ name: "Foot Kick", used: true, main: false, alive: true, claimed: true, already: false, blueSkill: 276 }).learn) throw new Error("subjob learn");
  if (offerBlueLearn({ name: "Foot Kick", used: true, main: true, alive: false, claimed: true, already: false, blueSkill: 276 }).learn) throw new Error("dead learn");
  if (offerBlueLearn({ name: "Foot Kick", used: true, main: true, alive: true, claimed: false, already: false, blueSkill: 276 }).learn) throw new Error("unclaimed learn");
  if (offerBlueLearn({ name: "Foot Kick", used: true, main: true, alive: true, claimed: true, already: true, blueSkill: 276 }).learn) throw new Error("learn twice");
  const on = nextBlueSet({ name: "Foot Kick", main: true, learned: ["Foot Kick"], set: [], level: 75 });
  if (!on.ok || on.set.join(",") !== "Foot Kick") throw new Error("set Foot Kick");
  const off = nextBlueSet({ name: "Foot Kick", main: true, learned: ["Foot Kick"], set: ["Foot Kick"], level: 75 });
  if (!off.ok || off.set.length !== 0) throw new Error("unset Foot Kick");
  if (nextBlueSet({ name: "Foot Kick", main: true, learned: [], set: [], level: 75 }).ok) throw new Error("set unlearned");
  if (nextBlueSet({ name: "Foot Kick", main: false, learned: ["Foot Kick"], set: [], level: 75 }).ok) throw new Error("subjob set");
  const carrotOn = nextBlueSet({ name: "Wild Carrot", main: true, learned: ["Foot Kick", "Wild Carrot"], set: ["Foot Kick"], level: 75 });
  if (!carrotOn.ok || carrotOn.set.join(",") !== "Foot Kick,Wild Carrot") throw new Error("set Wild Carrot");
  if (offerBlueLearn({ name: "Wild Carrot", used: true, main: true, alive: true, claimed: true, already: false, blueSkill: 61 }).learn) throw new Error("Wild Carrot under 62");
  const carrotLearn = offerBlueLearn({ name: "Wild Carrot", used: true, main: true, alive: true, claimed: true, already: false, blueSkill: 62 });
  if (!carrotLearn.learn || carrotLearn.line !== "You learn Wild Carrot!") throw new Error("learn Wild Carrot");
  if (offerBlueLearn({ name: "Wild Carrot", used: true, main: false, alive: true, claimed: true, already: false, blueSkill: 276 }).learn) throw new Error("subjob Wild Carrot");
  if (rollPhysicalBlue({
    name: "Wild Carrot",
    blueSkill: 276,
    str: 53,
    dex: 53,
    targetVit: 53,
    attack: 400,
    defense: 200,
    accuracy: 999,
    evasion: 0,
    dLevel: 0,
    chainAffinity: false,
    targetName: "Tropical Rarab",
    hitRoll: 0,
    pdifRoll: 0,
  }).hit) throw new Error("Wild Carrot is not a hit");
  if (blueBaseDamage(0, 9) !== 3 || blueBaseDamage(276, 9) !== 9) throw new Error("Foot Kick damage cap");
  const hit = rollPhysicalBlue({
    name: "Foot Kick",
    blueSkill: 276,
    str: 53,
    dex: 53,
    targetVit: 53,
    attack: 400,
    defense: 200,
    accuracy: 999,
    evasion: 0,
    dLevel: 0,
    chainAffinity: false,
    targetName: "Tropical Rarab",
    hitRoll: 0,
    pdifRoll: 0,
  });
  if (!hit.hit || hit.crit || hit.dmg <= 0) throw new Error("Foot Kick hit");
  const miss = rollPhysicalBlue({ ...{
    name: "Foot Kick",
    blueSkill: 276,
    str: 53,
    dex: 53,
    targetVit: 53,
    attack: 400,
    defense: 200,
    accuracy: 0,
    evasion: 999,
    dLevel: 0,
    chainAffinity: false,
    targetName: "Tropical Rarab",
    hitRoll: 100,
    pdifRoll: 0,
  } });
  if (miss.hit || miss.dmg !== 0 || miss.hits !== 0) throw new Error("Foot Kick miss");
  if (FRENETIC_RIP.kind !== "physical" || FRENETIC_RIP.level !== 63 || FRENETIC_RIP.mp !== 61 || FRENETIC_RIP.points !== 3 || FRENETIC_RIP.cast !== 0.5 || FRENETIC_RIP.recast !== 28.5 || FRENETIC_RIP.range !== 4.5 || FRENETIC_RIP.hits !== 3 || FRENETIC_RIP.ftp !== 1.359375 || FRENETIC_RIP.dCap !== 73 || FRENETIC_RIP.strMod !== 0.2 || FRENETIC_RIP.dexMod !== 0.2 || FRENETIC_RIP.int !== 1 || FRENETIC_RIP.mnd !== 0 || FRENETIC_RIP.accuracyTrait !== 4 || FRENETIC_RIP.attackTrait !== 0 || FRENETIC_RIP.chain !== "Induration" || "chain2" in FRENETIC_RIP || FRENETIC_RIP.family !== "Imp" || !FRENETIC_RIP.granted) {
    throw new Error("Frenetic Rip card");
  }
  if (DISSEVERMENT.kind !== "physical" || DISSEVERMENT.level !== 72 || DISSEVERMENT.mp !== 74 || DISSEVERMENT.points !== 5 || DISSEVERMENT.cast !== 0.5 || DISSEVERMENT.recast !== 32.75 || DISSEVERMENT.range !== 4.5 || DISSEVERMENT.hits !== 5 || DISSEVERMENT.ftp !== 1.5 || DISSEVERMENT.dCap !== 89 || DISSEVERMENT.strMod !== 0.2 || DISSEVERMENT.dexMod !== 0.2 || DISSEVERMENT.int !== 1 || DISSEVERMENT.mnd !== -1 || DISSEVERMENT.accuracyTrait !== 4 || DISSEVERMENT.chain !== "Distortion" || "chain2" in DISSEVERMENT || DISSEVERMENT.family !== "Aern" || !DISSEVERMENT.granted) {
    throw new Error("Disseverment card");
  }
  if (blueLearnSkill(63) !== 186 || FRENETIC_RIP.learnSkill !== 186) throw new Error("Frenetic Rip skill gate");
  if (blueLearnSkill(72) !== 230 || DISSEVERMENT.learnSkill !== 230) throw new Error("Disseverment skill gate");
  if (blueSpellFtp("Frenetic Rip", 0, false, false) !== 1.359375 || blueSpellFtp("Frenetic Rip", 3000, false, false) !== 1.359375 || blueSpellFtp("Frenetic Rip", 0, true, false) !== 1.359375 || blueSpellFtp("Frenetic Rip", 1500, true, false) !== 2.0703125 || blueSpellFtp("Frenetic Rip", 3000, true, false) !== 2.359375 || blueSpellFtp("Frenetic Rip", 0, true, true) !== 2.609375 || blueSpellFtp("Disseverment", 3000, true, true) !== 1.5) {
    throw new Error("Frenetic Rip fTP");
  }
  if (blueAttackMult("Frenetic Rip", 3000, true, true) !== 1 || blueAttackMult("Disseverment", 0, false, false) !== 0.9 || blueAttackMult("Disseverment", 3000, true, true) !== 0.9) {
    throw new Error("Disseverment attack");
  }
  if (dissevermentPoison(75) !== 18 || dissevermentPoison(72) !== 17 || dissevermentPoison(100) !== 22 || dissevermentPoison(0) !== 3) throw new Error("Disseverment poison");
  if (blueSetInt(["Frenetic Rip"]) !== 1 || blueSetInt(["Disseverment"]) !== 1 || blueSetInt(["Frenetic Rip", "Disseverment"]) !== 2 || blueSetMnd(["Frenetic Rip"]) !== 0 || blueSetMnd(["Disseverment"]) !== -1 || blueSetMnd(["Frenetic Rip", "Disseverment"]) !== -1) {
    throw new Error("demon set bonus");
  }
  if (blueAccuracyBonus([]) !== 0 || blueAccuracyBonus(["Frenetic Rip"]) !== 0 || blueAccuracyBonus(["Disseverment"]) !== 0 || blueAccuracyBonus(["Frenetic Rip", "Disseverment"]) !== 10 || blueSetTraits(["Frenetic Rip"]).length !== 0 || blueSetTraits(["Disseverment"]).length !== 0 || blueSetTraits(["Frenetic Rip", "Disseverment"]).map((trait) => trait.name).join(",") !== "Accuracy Bonus") {
    throw new Error("Accuracy Bonus");
  }
  const rip = rollPhysicalBlue({
    name: "Frenetic Rip",
    blueSkill: 276,
    str: 53,
    dex: 53,
    targetVit: 53,
    attack: 400,
    defense: 200,
    accuracy: 999,
    evasion: 0,
    dLevel: 0,
    chainAffinity: false,
    ftp: blueSpellFtp("Frenetic Rip", 3000, false, false),
    attackMult: blueAttackMult("Frenetic Rip", 3000, false, false),
    targetName: "Tropical Rarab",
    hitRoll: 0,
    pdifRoll: 0,
  });
  if (!rip.hit || rip.crit || rip.hits !== 3 || rip.dmg !== 477) throw new Error(`Frenetic Rip damage ${rip.dmg}/${rip.hits}`);
  const ripPart = rollPhysicalBlue({
    name: "Frenetic Rip",
    blueSkill: 276,
    str: 53,
    dex: 53,
    targetVit: 53,
    attack: 400,
    defense: 200,
    accuracy: 999,
    evasion: 0,
    dLevel: 0,
    chainAffinity: false,
    ftp: 1.359375,
    targetName: "Tropical Rarab",
    hitRoll: 0,
    pdifRoll: 0,
    hitRolls: [0, 100, 0],
  });
  if (!ripPart.hit || ripPart.hits !== 2 || ripPart.dmg !== 335) throw new Error(`Frenetic Rip partial ${ripPart.dmg}/${ripPart.hits}`);
  const severed = rollPhysicalBlue({
    name: "Disseverment",
    blueSkill: 276,
    str: 53,
    dex: 53,
    targetVit: 53,
    attack: 400,
    defense: 200,
    accuracy: 999,
    evasion: 0,
    dLevel: 0,
    chainAffinity: false,
    ftp: 1.5,
    attackMult: 0.9,
    targetName: "Tropical Rarab",
    hitRoll: 0,
    pdifRoll: 0,
  });
  if (!severed.hit || severed.crit || severed.hits !== 5 || severed.dmg !== 693) throw new Error(`Disseverment damage ${severed.dmg}/${severed.hits}`);
  const severedMiss = rollPhysicalBlue({
    name: "Disseverment",
    blueSkill: 276,
    str: 53,
    dex: 53,
    targetVit: 53,
    attack: 400,
    defense: 200,
    accuracy: 0,
    evasion: 999,
    dLevel: 0,
    chainAffinity: false,
    targetName: "Tropical Rarab",
    hitRoll: 100,
    pdifRoll: 0,
  });
  if (severedMiss.hit || severedMiss.hits !== 0 || severedMiss.dmg !== 0) throw new Error("Disseverment miss");
  if (MAGIC_FRUIT.kind !== "cure" || MAGIC_FRUIT.level !== 58 || MAGIC_FRUIT.mp !== 72 || MAGIC_FRUIT.points !== 3 || MAGIC_FRUIT.cast !== 3.5 || MAGIC_FRUIT.recast !== 6 || MAGIC_FRUIT.range !== 20 || MAGIC_FRUIT.hp !== 5 || MAGIC_FRUIT.chr !== 1 || MAGIC_FRUIT.sleepTrait !== 4 || MAGIC_FRUIT.family !== "Opo-opo" || !MAGIC_FRUIT.granted || MAGIC_FRUIT.learnSkill !== 162) {
    throw new Error("Magic Fruit card");
  }
  if (blueLearnSkill(58) !== 162) throw new Error("Magic Fruit skill gate");
  if (magicFruitBase(0) !== 250 || magicFruitBase(212) !== 289 || magicFruitBase(319) !== 368 || magicFruitBase(320) !== 370 || magicFruitBase(559) !== 489 || magicFruitBase(560) !== 490) {
    throw new Error("Magic Fruit heal");
  }
  if (CANNONBALL.kind !== "physical" || CANNONBALL.level !== 70 || CANNONBALL.mp !== 66 || CANNONBALL.points !== 3 || CANNONBALL.cast !== 0.5 || CANNONBALL.recast !== 28.5 || CANNONBALL.range !== 21 || CANNONBALL.hits !== 1 || CANNONBALL.ftp !== 1.75 || CANNONBALL.dCap !== 999 || CANNONBALL.strMod !== 0.5 || CANNONBALL.vitMod !== 0.5 || CANNONBALL.dexMod !== 0 || CANNONBALL.str !== 1 || CANNONBALL.dex !== 1 || CANNONBALL.sleepTrait !== 0 || CANNONBALL.chain !== "Fusion" || "chain2" in CANNONBALL || CANNONBALL.family !== "Wamouracampa" || !CANNONBALL.granted || CANNONBALL.learnSkill !== 220) {
    throw new Error("Cannonball card");
  }
  if (blueLearnSkill(70) !== 220) throw new Error("Cannonball skill gate");
  if (blueSpellFtp("Cannonball", 0, false, false) !== 1.75 || blueSpellFtp("Cannonball", 1500, false, false) !== 1.75 || blueSpellFtp("Cannonball", 3000, false, false) !== 1.75 || blueSpellFtp("Cannonball", 0, true, false) !== 1.75 || blueSpellFtp("Cannonball", 1500, true, false) !== 2.125 || blueSpellFtp("Cannonball", 3000, true, false) !== 2.75 || blueSpellFtp("Cannonball", 3000, true, true) !== 2.875 || blueSpellFtp("Cannonball", 0, false, true) !== 2.875) {
    throw new Error("Cannonball fTP");
  }
  if (blueAttackMult("Cannonball", 3000, true, true) !== 1) throw new Error("Cannonball attack multiplier");
  if (blueBaseDamage(276, CANNONBALL.dCap) !== 63) throw new Error("Cannonball skill term");
  const ball = rollPhysicalBlue({
    name: "Cannonball",
    blueSkill: 276,
    str: 53,
    dex: 53,
    vit: 53,
    targetVit: 53,
    attack: 200,
    defense: 200,
    accuracy: 999,
    evasion: 0,
    dLevel: 0,
    chainAffinity: false,
    ftp: blueSpellFtp("Cannonball", 0, false, false),
    targetName: "Tropical Rarab",
    hitRoll: 0,
    pdifRoll: 0,
  });
  if (!ball.hit || ball.crit || ball.hits !== 1 || ball.dmg !== 142) throw new Error(`Cannonball damage ${ball.dmg}`);
  const ballHard = rollPhysicalBlue({
    name: "Cannonball",
    blueSkill: 276,
    str: 53,
    dex: 53,
    vit: 53,
    targetVit: 53,
    attack: 400,
    defense: 200,
    accuracy: 999,
    evasion: 0,
    dLevel: 0,
    chainAffinity: false,
    ftp: 1.75,
    targetName: "Tropical Rarab",
    hitRoll: 0,
    pdifRoll: 0,
  });
  if (!ballHard.hit || ballHard.dmg !== 345 || ballHard.dmg <= ball.dmg) throw new Error(`Cannonball defense ${ballHard.dmg}`);
  if (blueResistSleep([]) !== 0 || blueResistSleep(["Wild Carrot"]) !== 0 || blueResistSleep(["Magic Fruit"]) !== 0 || blueResistSleep(["Pollen"]) !== 0 || blueResistSleep(["Wild Carrot", "Magic Fruit"]) !== 0.1 || blueResistSleep(["Pollen", "Wild Carrot"]) !== 0.1 || blueResistSleep(["Pollen", "Magic Fruit"]) !== 0.1) {
    throw new Error("Resist Sleep");
  }
  if (blueSetTraits(["Wild Carrot"]).length !== 0 || blueSetTraits(["Magic Fruit"]).length !== 0 || blueSetTraits(["Pollen"]).length !== 0 || blueSetTraits(["Wild Carrot", "Magic Fruit"]).map((trait) => trait.name).join(",") !== "Resist Sleep" || blueSetTraits(["Pollen", "Wild Carrot"]).map((trait) => trait.name).join(",") !== "Resist Sleep") {
    throw new Error("Resist Sleep trait row");
  }
  if (blueSetHp(["Magic Fruit"]) !== 5 || blueSetChr(["Magic Fruit"]) !== 1 || blueSetHp(["Wild Carrot", "Magic Fruit"]) !== 10 || blueSetChr(["Wild Carrot", "Magic Fruit"]) !== 1 || blueSetStr(["Cannonball"]) !== 1 || blueSetDex(["Cannonball"]) !== 1) {
    throw new Error("Magic Fruit and Cannonball set bonus");
  }
  if (MEMENTO_MORI.kind !== "memento" || MEMENTO_MORI.level !== 62 || MEMENTO_MORI.mp !== 46 || MEMENTO_MORI.points !== 4 || MEMENTO_MORI.cast !== 3.5 || MEMENTO_MORI.recast !== 120 || MEMENTO_MORI.seconds !== 60 || MEMENTO_MORI.mab !== 20 || MEMENTO_MORI.ce !== 320 || MEMENTO_MORI.ve !== 320 || MEMENTO_MORI.int !== 1 || MEMENTO_MORI.mabTrait !== 4 || MEMENTO_MORI.setMp !== 0 || MEMENTO_MORI.family !== "Corse" || !MEMENTO_MORI.granted || MEMENTO_MORI.learnSkill !== 181) {
    throw new Error("Memento Mori card");
  }
  if (blueLearnSkill(62) !== 181) throw new Error("Memento Mori skill gate");
  if (MIND_BLAST.kind !== "magical" || MIND_BLAST.level !== 73 || MIND_BLAST.mp !== 82 || MIND_BLAST.points !== 4 || MIND_BLAST.cast !== 3 || MIND_BLAST.recast !== 30 || MIND_BLAST.range !== 10 || MIND_BLAST.ftp !== 531 / 256 || MIND_BLAST.azureFtp !== 0.5 || MIND_BLAST.mndMod !== 0.3 || MIND_BLAST.dStat !== 1.5 || MIND_BLAST.dCap !== 69 || MIND_BLAST.paralyze !== 20 || MIND_BLAST.paralyzeSeconds !== 90 || MIND_BLAST.mnd !== 1 || MIND_BLAST.setMp !== 5 || MIND_BLAST.clearTrait !== 4 || MIND_BLAST.family !== "Soulflayer" || !MIND_BLAST.granted || MIND_BLAST.learnSkill !== 235) {
    throw new Error("Mind Blast card");
  }
  if (blueLearnSkill(73) !== 235) throw new Error("Mind Blast skill gate");
  if (blueWscAlpha(60) !== 0.9 || blueWscAlpha(75) !== 0.83) throw new Error("blue WSC alpha");
  const mind = mindBlastRaw({ level: 75, mnd: 54, targetMnd: 58, burstAffinity: false, azureLore: false });
  const mindBurst = mindBlastRaw({ level: 75, mnd: 54, targetMnd: 58, burstAffinity: true, azureLore: false });
  const mindAzure = mindBlastRaw({ level: 75, mnd: 54, targetMnd: 58, burstAffinity: false, azureLore: true });
  const mindBoth = mindBlastRaw({ level: 75, mnd: 54, targetMnd: 58, burstAffinity: true, azureLore: true });
  if (Math.floor(mind) !== 165 || Math.floor(mindBurst) !== 192 || Math.floor(mindAzure) !== 206 || Math.floor(mindBoth) !== 240) {
    throw new Error(`Mind Blast damage ${mind}/${mindBurst}/${mindAzure}/${mindBoth}`);
  }
  if (Math.floor(Math.floor(mind) * 120 / 100) !== 198) throw new Error("Mind Blast Magic Attack Bonus");
  const mindHigh = mindBlastRaw({ level: 75, mnd: 1050, targetMnd: 0, burstAffinity: false, azureLore: false });
  const mindLow = mindBlastRaw({ level: 75, mnd: 0, targetMnd: 400, burstAffinity: false, azureLore: false });
  if (Math.abs(mindHigh - 1972.4255859374998) > 1e-6) throw new Error(`Mind Blast half threshold ${mindHigh}`);
  if (Math.abs(mindLow - ((69) * (531 / 256) - 399)) > 1e-9) throw new Error(`Mind Blast floor ${mindLow}`);
  if (blueSetInt(["Memento Mori"]) !== 1 || blueSetMp(["Memento Mori"]) !== 0 || blueMagicAttackBonus(["Memento Mori"]) !== 0 || blueSetTraits(["Memento Mori"]).length !== 0) {
    throw new Error("Memento Mori set");
  }
  if (blueSetMp(["Mind Blast"]) !== 5 || blueSetMnd(["Mind Blast"]) !== 1 || blueClearMind(["Mind Blast"]) !== 0 || blueSetTraits(["Mind Blast"]).length !== 0 || blueMagicAttackBonus(["Mind Blast"]) !== 0) {
    throw new Error("Mind Blast set");
  }
  if (SANDSPIN.kind !== "sand" || SANDSPIN.level !== 1 || SANDSPIN.mp !== 10 || SANDSPIN.points !== 2 || SANDSPIN.cast !== 1.5 || SANDSPIN.recast !== 9.75 || SANDSPIN.radius !== 6 || SANDSPIN.ftp !== 1 || SANDSPIN.intMod !== 0.2 || SANDSPIN.dCap !== 13 || SANDSPIN.accDown !== 25 || SANDSPIN.seconds !== 180 || SANDSPIN.vit !== 1 || SANDSPIN.family !== "Worm" || !SANDSPIN.granted || SANDSPIN.learnSkill !== 0) {
    throw new Error("Sandspin card");
  }
  if (POLLEN.kind !== "pollen" || POLLEN.level !== 1 || POLLEN.mp !== 8 || POLLEN.points !== 1 || POLLEN.cast !== 2 || POLLEN.recast !== 5 || POLLEN.min !== 14 || POLLEN.hp !== 5 || POLLEN.chr !== 1 || POLLEN.sleepTrait !== 4 || POLLEN.family !== "Bee" || !POLLEN.granted) {
    throw new Error("Pollen card");
  }
  if (POWER_ATTACK.kind !== "physical" || POWER_ATTACK.level !== 4 || POWER_ATTACK.mp !== 5 || POWER_ATTACK.points !== 1 || POWER_ATTACK.cast !== 0.5 || POWER_ATTACK.recast !== 7.25 || POWER_ATTACK.range !== 4.5 || POWER_ATTACK.ftp !== 1.125 || POWER_ATTACK.dCap !== 11 || POWER_ATTACK.strMod !== 0.1 || POWER_ATTACK.vitMod !== 0.1 || POWER_ATTACK.mnd !== 1 || POWER_ATTACK.plantTrait !== 4 || POWER_ATTACK.chain !== "Reverberation" || POWER_ATTACK.family !== "Beetle" || !POWER_ATTACK.granted) {
    throw new Error("Power Attack card");
  }
  if (SPROUT_SMACK.kind !== "physical" || SPROUT_SMACK.level !== 4 || SPROUT_SMACK.mp !== 6 || SPROUT_SMACK.points !== 2 || SPROUT_SMACK.ftp !== 1.5 || SPROUT_SMACK.vitMod !== 0.3 || SPROUT_SMACK.mnd !== 1 || SPROUT_SMACK.beastTrait !== 4 || SPROUT_SMACK.chain !== "Reverberation" || SPROUT_SMACK.family !== "Sapling" || !SPROUT_SMACK.granted) {
    throw new Error("Sprout Smack card");
  }
  if (WILD_OATS.kind !== "physical" || WILD_OATS.level !== 4 || WILD_OATS.mp !== 9 || WILD_OATS.points !== 3 || WILD_OATS.range !== 13.5 || WILD_OATS.ftp !== 1.8359375 || WILD_OATS.agiMod !== 0.3 || WILD_OATS.hp !== 10 || WILD_OATS.chr !== 1 || WILD_OATS.beastTrait !== 4 || WILD_OATS.chain !== "Transfixion" || WILD_OATS.family !== "Mandragora" || !WILD_OATS.granted) {
    throw new Error("Wild Oats card");
  }
  if (pollenBase(0) !== 14 || pollenBase(212) !== 34 || pollenBase(59) !== 23 || pollenBase(60) !== 24 || pollenBase(100) !== 34) {
    throw new Error("Pollen heal");
  }
  if (Math.floor(sandspinRaw({ level: 75, int: 53, targetInt: 53, burstAffinity: false })) !== 21 || Math.floor(sandspinRaw({ level: 75, int: 53, targetInt: 53, burstAffinity: true })) !== 30) {
    throw new Error("Sandspin damage");
  }
  if (plantEffectSeconds(0, false, false) !== 180 || plantEffectSeconds(3000, false, false) !== 180 || plantEffectSeconds(0, true, false) !== 180 || plantEffectSeconds(1500, true, false) !== 360 || plantEffectSeconds(3000, true, false) !== 400 || plantEffectSeconds(0, false, true) !== 450) {
    throw new Error("plant status duration");
  }
  if (blueBeastKiller([]) !== 0 || blueBeastKiller(["Sprout Smack"]) !== 0 || blueBeastKiller(["Wild Oats"]) !== 0 || blueBeastKiller(["Sprout Smack", "Wild Oats"]) !== 0.08) {
    throw new Error("Beast Killer");
  }
  if (bluePlantoidKiller(["Power Attack"]) !== 0 || blueSetTraits(["Power Attack"]).length !== 0 || blueSetTraits(["Sprout Smack"]).length !== 0 || blueSetTraits(["Sprout Smack", "Wild Oats"]).map((trait) => trait.name).join(",") !== "Beast Killer") {
    throw new Error("Plantoid Killer stays locked");
  }
  if (blueSetVit(["Sandspin"]) !== 1 || blueSetChr(["Pollen"]) !== 1 || blueSetHp(["Pollen", "Wild Oats"]) !== 15 || blueSetMnd(["Power Attack", "Sprout Smack"]) !== 2) {
    throw new Error("starter set bonus");
  }
  if (METALLIC_BODY.kind !== "metal" || METALLIC_BODY.level !== 8 || METALLIC_BODY.mp !== 19 || METALLIC_BODY.points !== 1 || METALLIC_BODY.cast !== 7 || METALLIC_BODY.recast !== 60 || METALLIC_BODY.seconds !== 300 || METALLIC_BODY.ce !== 1 || METALLIC_BODY.ve !== 300 || METALLIC_BODY.hp !== 0 || METALLIC_BODY.mpTrait !== 4 || METALLIC_BODY.family !== "Crab" || !METALLIC_BODY.granted || METALLIC_BODY.learnSkill !== 0) {
    throw new Error("Metallic Body card");
  }
  if (QUEASYSHROOM.kind !== "physical" || QUEASYSHROOM.level !== 8 || QUEASYSHROOM.mp !== 20 || QUEASYSHROOM.points !== 2 || QUEASYSHROOM.cast !== 2 || QUEASYSHROOM.recast !== 15 || QUEASYSHROOM.range !== 13.5 || QUEASYSHROOM.ftp !== 1.75 || QUEASYSHROOM.dCap !== 15 || QUEASYSHROOM.intMod !== 0.2 || QUEASYSHROOM.ranged !== true || QUEASYSHROOM.hp !== -5 || QUEASYSHROOM.setMp !== 5 || QUEASYSHROOM.chain !== "Compression" || QUEASYSHROOM.family !== "Funguar" || !QUEASYSHROOM.granted || QUEASYSHROOM.learnSkill !== 0) {
    throw new Error("Queasyshroom card");
  }
  if (HEAD_BUTT.kind !== "physical" || HEAD_BUTT.level !== 12 || HEAD_BUTT.mp !== 12 || HEAD_BUTT.points !== 3 || HEAD_BUTT.cast !== 0.5 || HEAD_BUTT.recast !== 10 || HEAD_BUTT.range !== 4.5 || HEAD_BUTT.ftp !== 1.75 || HEAD_BUTT.dCap !== 17 || HEAD_BUTT.strMod !== 0.2 || HEAD_BUTT.intMod !== 0.2 || HEAD_BUTT.dex !== 2 || HEAD_BUTT.chain !== "Impaction" || HEAD_BUTT.family !== "Quadav" || !HEAD_BUTT.granted || HEAD_BUTT.learnSkill !== 8) {
    throw new Error("Head Butt card");
  }
  if (FEATHER_STORM.kind !== "physical" || FEATHER_STORM.level !== 12 || FEATHER_STORM.mp !== 12 || FEATHER_STORM.points !== 3 || FEATHER_STORM.cast !== 0.5 || FEATHER_STORM.recast !== 10 || FEATHER_STORM.range !== 13.5 || FEATHER_STORM.ftp !== 2 || FEATHER_STORM.dCap !== 17 || FEATHER_STORM.agiMod !== 0.3 || FEATHER_STORM.ranged !== true || FEATHER_STORM.hp !== 5 || FEATHER_STORM.chr !== 2 || FEATHER_STORM.rapidTrait !== 4 || FEATHER_STORM.chain !== "Transfixion" || FEATHER_STORM.family !== "Yagudo" || !FEATHER_STORM.granted || FEATHER_STORM.learnSkill !== 8) {
    throw new Error("Feather Storm card");
  }
  if (HELLDIVE.kind !== "physical" || HELLDIVE.level !== 16 || HELLDIVE.mp !== 16 || HELLDIVE.points !== 2 || HELLDIVE.cast !== 0.5 || HELLDIVE.recast !== 11.25 || HELLDIVE.range !== 4.5 || HELLDIVE.ftp !== 1.25 || HELLDIVE.dCap !== 19 || HELLDIVE.agiMod !== 0.3 || HELLDIVE.hp !== 5 || HELLDIVE.chr !== 1 || HELLDIVE.chain !== "Transfixion" || HELLDIVE.family !== "Bird" || !HELLDIVE.granted || HELLDIVE.learnSkill !== 20) {
    throw new Error("Helldive card");
  }
  if (metallicBodyPower(0) !== 12 || metallicBodyPower(276) !== 116 || metallicBodyPower(500) !== 200 || metallicBodyPower(600) !== 200 || !metallicCanLand(null) || !metallicCanLand("metal") || metallicCanLand("spell") || metallicCanLand("solace")) {
    throw new Error("Metallic Body power");
  }
  if (queasySeconds(0, false, false) !== 90 || queasySeconds(3000, false, false) !== 90 || queasySeconds(0, true, false) !== 90 || queasySeconds(1500, true, false) !== 150 || queasySeconds(3000, true, false) !== 180 || queasySeconds(0, false, true) !== 210) {
    throw new Error("Queasyshroom duration");
  }
  if (headButtStunSeconds(0) !== 1 || headButtStunSeconds(0.199) !== 1 || headButtStunSeconds(0.2) !== 2 || headButtStunSeconds(0.999) !== 5 || headButtStunSeconds(1) !== 5) {
    throw new Error("Head Butt stun");
  }
  if (blueSpellFtp("Head Butt", 3000, false, false) !== 1.75 || blueSpellFtp("Head Butt", 0, true, false) !== 1.75 || blueSpellFtp("Head Butt", 1500, true, false) !== 2.125 || blueSpellFtp("Head Butt", 3000, true, false) !== 2.25 || blueSpellFtp("Head Butt", 0, false, true) !== 2.375) {
    throw new Error("Head Butt coefficient");
  }
  if (blueSpellFtp("Helldive", 3000, false, false) !== 1.25 || blueSpellFtp("Helldive", 0, true, false) !== 1.25 || blueSpellFtp("Helldive", 1500, true, false) !== 1.625 || blueSpellFtp("Helldive", 3000, true, false) !== 2 || blueSpellFtp("Helldive", 0, true, true) !== 2.125) {
    throw new Error("Helldive coefficient");
  }
  if (blueSpellFtp("Queasyshroom", 3000, true, true) !== 1.75 || blueSpellFtp("Feather Storm", 3000, true, true) !== 2) {
    throw new Error("flat ranged coefficient");
  }
  if (blueAttackMult("Head Butt", 3000, true, true) !== 1.05 || blueAttackMult("Helldive", 0, false, false) !== 1.85 || blueAttackMult("Queasyshroom", 3000, true, true) !== 1 || blueAttackMult("Feather Storm", 3000, true, true) !== 1) {
    throw new Error("shell attack multiplier");
  }
  if (blueBaseDamage(276, 15) !== 15 || blueBaseDamage(276, 17) !== 17 || blueBaseDamage(276, 19) !== 19) throw new Error("low physical caps bind");
  if (blueChainProps("Queasyshroom").join(",") !== "Compression" || blueChainProps("Head Butt").join(",") !== "Impaction" || blueChainProps("Feather Storm").join(",") !== "Transfixion" || blueChainProps("Helldive").join(",") !== "Transfixion" || blueChainProps("Bludgeon").join(",") !== "Liquefaction" || blueChainProps("Claw Cyclone").join(",") !== "Scission" || blueChainProps("Cursed Sphere").length !== 0 || blueChainProps("Blastbomb").length !== 0 || blueChainProps("Poison Breath").length !== 0 || blueChainProps("Metallic Body").length !== 0) {
    throw new Error("shell skillchains");
  }
  if (blueLearnSkill(18) !== 26 || blueLearnSkill(20) !== 32 || blueLearnSkill(22) !== 38 || BLUE_CONE !== 45 || FOOT_KICK.lizardTrait !== 4) throw new Error("blue learn gates");
  if (BLUDGEON.kind !== "physical" || BLUDGEON.level !== 18 || BLUDGEON.mp !== 16 || BLUDGEON.points !== 2 || BLUDGEON.cast !== 0.5 || BLUDGEON.recast !== 11.75 || BLUDGEON.range !== 4.5 || BLUDGEON.hits !== 3 || BLUDGEON.ftp !== 1 || BLUDGEON.dCap !== 21 || BLUDGEON.chrMod !== 0.3 || BLUDGEON.str !== 1 || BLUDGEON.undeadTrait !== 4 || BLUDGEON.chain !== "Liquefaction" || BLUDGEON.family !== "Cardian" || !BLUDGEON.granted || "cone" in BLUDGEON) {
    throw new Error("Bludgeon card");
  }
  if (CURSED_SPHERE.kind !== "orb" || CURSED_SPHERE.level !== 18 || CURSED_SPHERE.mp !== 36 || CURSED_SPHERE.points !== 2 || CURSED_SPHERE.cast !== 3 || CURSED_SPHERE.recast !== 19.5 || CURSED_SPHERE.range !== 13.5 || CURSED_SPHERE.ftp !== 1.5 || CURSED_SPHERE.intMod !== 0.3 || CURSED_SPHERE.dStat !== 1 || CURSED_SPHERE.dCap !== 30 || CURSED_SPHERE.half !== 46 || CURSED_SPHERE.low !== -6 || CURSED_SPHERE.element !== "water" || CURSED_SPHERE.mnd !== 1 || CURSED_SPHERE.mabTrait !== 4 || CURSED_SPHERE.family !== "Fly" || !CURSED_SPHERE.granted) {
    throw new Error("Cursed Sphere card");
  }
  if (BLASTBOMB.kind !== "orb" || BLASTBOMB.level !== 18 || BLASTBOMB.mp !== 36 || BLASTBOMB.points !== 2 || BLASTBOMB.cast !== 2.25 || BLASTBOMB.recast !== 15 || BLASTBOMB.range !== 13.5 || BLASTBOMB.ftp !== 1.375 || BLASTBOMB.intMod !== 0.2 || BLASTBOMB.dCap !== 30 || BLASTBOMB.half !== 25 || BLASTBOMB.low !== -10 || BLASTBOMB.element !== "fire" || BLASTBOMB.bind !== BLAST_BIND || BLAST_BIND !== 30 || BLASTBOMB.str !== 1 || BLASTBOMB.family !== "Warmachine" || !BLASTBOMB.granted) {
    throw new Error("Blastbomb card");
  }
  if (CLAW_CYCLONE.kind !== "physical" || CLAW_CYCLONE.level !== 20 || CLAW_CYCLONE.mp !== 24 || CLAW_CYCLONE.points !== 2 || CLAW_CYCLONE.cast !== 1 || CLAW_CYCLONE.recast !== 19.75 || CLAW_CYCLONE.range !== 13.7 || CLAW_CYCLONE.cone !== true || CLAW_CYCLONE.hits !== 2 || CLAW_CYCLONE.ftp !== CLAW_FTP || CLAW_FTP !== 1.4375 || CLAW_CYCLONE.dCap !== 23 || CLAW_CYCLONE.dexMod !== 0.3 || CLAW_CYCLONE.vit !== 1 || CLAW_CYCLONE.lizardTrait !== 4 || CLAW_CYCLONE.chain !== "Scission" || CLAW_CYCLONE.family !== "Tiger" || !CLAW_CYCLONE.granted) {
    throw new Error("Claw Cyclone card");
  }
  if (POISON_BREATH.kind !== "breath" || POISON_BREATH.level !== 22 || POISON_BREATH.mp !== 22 || POISON_BREATH.points !== 1 || POISON_BREATH.cast !== 3 || POISON_BREATH.recast !== 19.5 || POISON_BREATH.range !== POISON_BREATH_RANGE || POISON_BREATH_RANGE !== 10 || POISON_BREATH.hpMod !== 10 || POISON_BREATH.lvlMod !== 1.25 || POISON_BREATH.poison !== POISON_BREATH_DOT || POISON_BREATH_DOT !== 4 || POISON_BREATH.poisonSeconds !== POISON_BREATH_SECONDS || POISON_BREATH_SECONDS !== 30 || POISON_BREATH.element !== "water" || POISON_BREATH.mnd !== 1 || POISON_BREATH.clearTrait !== 4 || POISON_BREATH.family !== "Hound" || !POISON_BREATH.granted) {
    throw new Error("Poison Breath card");
  }
  if (SOPORIFIC.kind !== "song" || SOPORIFIC.level !== 24 || SOPORIFIC.mp !== 38 || SOPORIFIC.points !== 4 || SOPORIFIC.cast !== 3 || SOPORIFIC.recast !== 90 || SOPORIFIC.radius !== SOPORIFIC_RADIUS || SOPORIFIC_RADIUS !== 6 || SOPORIFIC_SECONDS !== 90 || SOPORIFIC.ce !== 320 || SOPORIFIC.ve !== 320 || SOPORIFIC.hp !== -5 || SOPORIFIC.setMp !== 5 || SOPORIFIC.clearTrait !== 4 || SOPORIFIC.family !== "Flytrap" || !SOPORIFIC.granted || SOPORIFIC.learnSkill !== 44) {
    throw new Error("Soporific card");
  }
  if (SCREWDRIVER.kind !== "physical" || SCREWDRIVER.level !== 26 || SCREWDRIVER.mp !== 21 || SCREWDRIVER.points !== 3 || SCREWDRIVER.cast !== 0.5 || SCREWDRIVER.recast !== 14 || SCREWDRIVER.range !== 4.5 || SCREWDRIVER.hits !== 1 || SCREWDRIVER.ftp !== SCREWDRIVER_FTP || SCREWDRIVER_FTP !== 1.375 || SCREWDRIVER.dCap !== 27 || SCREWDRIVER.strMod !== 0.2 || SCREWDRIVER.mndMod !== 0.2 || SCREWDRIVER.hp !== 10 || SCREWDRIVER.vit !== 1 || SCREWDRIVER.chr !== 1 || SCREWDRIVER.evasionTrait !== 4 || SCREWDRIVER.chain !== "Transfixion" || SCREWDRIVER.chain2 !== "Scission" || SCREWDRIVER.family !== "Pugil" || !SCREWDRIVER.granted || SCREWDRIVER.learnSkill !== 50) {
    throw new Error("Screwdriver card");
  }
  if (BOMB_TOSS.kind !== "orb" || BOMB_TOSS.level !== 28 || BOMB_TOSS.mp !== 42 || BOMB_TOSS.points !== 3 || BOMB_TOSS.cast !== 3.75 || BOMB_TOSS.recast !== 24.5 || BOMB_TOSS.range !== 13.5 || BOMB_TOSS.ftp !== 1.625 || BOMB_TOSS.intMod !== 0.2 || BOMB_TOSS.dStat !== 1 || BOMB_TOSS.dCap !== 40 || BOMB_TOSS.half !== 999 || BOMB_TOSS.low !== -399 || BOMB_TOSS.element !== "fire" || BOMB_TOSS.str !== 2 || "bind" in BOMB_TOSS || BOMB_TOSS.family !== "Goblin" || !BOMB_TOSS.granted || BOMB_TOSS.learnSkill !== 56) {
    throw new Error("Bomb Toss card");
  }
  if (GRAND_SLAM.kind !== "physical" || GRAND_SLAM.level !== 30 || GRAND_SLAM.mp !== 24 || GRAND_SLAM.points !== 2 || GRAND_SLAM.cast !== 1 || GRAND_SLAM.recast !== 14.25 || GRAND_SLAM.radius !== GRAND_RADIUS || GRAND_RADIUS !== 5 || GRAND_SLAM.hits !== 1 || GRAND_SLAM.ftp !== 1 || GRAND_SLAM.dCap !== 33 || GRAND_SLAM.vitMod !== 0.3 || GRAND_SLAM.int !== 1 || GRAND_SLAM.defenseTrait !== 4 || GRAND_SLAM.chain !== "Induration" || "chain2" in GRAND_SLAM || "range" in GRAND_SLAM || GRAND_SLAM.family !== "Gigas" || !GRAND_SLAM.granted || GRAND_SLAM.learnSkill !== 62) {
    throw new Error("Grand Slam card");
  }
  if (blueLearnSkill(24) !== 44 || blueLearnSkill(26) !== 50 || blueLearnSkill(28) !== 56 || blueLearnSkill(30) !== 62) throw new Error("mid blue learn gates");
  if (blueAttackMult("Screwdriver", 3000, true, true) !== SCREWDRIVER_MULT || grandSlamAttackMult(0, false, false) !== 1.6 || grandSlamAttackMult(0, true, false) !== 1.6 || grandSlamAttackMult(1500, true, false) !== 2 || grandSlamAttackMult(3000, true, false) !== 2.3 || grandSlamAttackMult(0, true, true) !== GRAND_ATTACK_AZURE || blueSpellFtp("Screwdriver", 3000, true, true) !== SCREWDRIVER_FTP || blueSpellFtp("Grand Slam", 3000, true, true) !== 1) {
    throw new Error("screwdriver and grand slam attack");
  }
  if (blueChainProps("Screwdriver").join(",") !== "Transfixion,Scission" || blueChainProps("Grand Slam").join(",") !== "Induration" || blueChainProps("Soporific").length !== 0 || blueChainProps("Bomb Toss").length !== 0) {
    throw new Error("mid blue skillchains");
  }
  if (blueEvasionBonus(["Screwdriver"]) !== 0 || blueDefenseBonus(["Grand Slam"]) !== 0 || blueClearMind(["Soporific"]) !== 0 || blueClearMind(["Poison Breath", "Soporific"]) !== 3 || blueClearMind(["Mind Blast", "Soporific"]) !== 3 || blueSetHp(["Soporific"]) !== -5 || blueSetMp(["Soporific"]) !== 5 || blueSetHp(["Screwdriver"]) !== 10 || blueSetVit(["Screwdriver"]) !== 1 || blueSetChr(["Screwdriver"]) !== 1 || blueSetStr(["Bomb Toss"]) !== 2 || blueSetInt(["Grand Slam"]) !== 1) {
    throw new Error("mid blue set");
  }
  if (blueAttackMult("Bludgeon", 3000, true, true) !== BLUDGEON_MULT || BLUDGEON_MULT !== 1.55 || clawAttackMult(0, false, false) !== 1.3 || clawAttackMult(0, true, false) !== 1.3 || clawAttackMult(1500, true, false) !== 1.8 || clawAttackMult(3000, true, false) !== 2 || clawAttackMult(0, false, true) !== CLAW_ATTACK_AZURE || clawAttackMult(3000, true, true) !== 2.1 || blueSpellFtp("Bludgeon", 3000, true, true) !== 1 || blueSpellFtp("Claw Cyclone", 3000, true, true) !== CLAW_FTP) {
    throw new Error("cardian attack");
  }
  if (blueUndeadKiller([]) !== 0 || blueUndeadKiller(["Bludgeon"]) !== 0 || blueLizardKiller(["Foot Kick"]) !== 0 || blueLizardKiller(["Claw Cyclone"]) !== 0 || blueLizardKiller(["Foot Kick", "Claw Cyclone"]) !== LIZARD_KILLER_RATE || blueMagicAttackBonus(["Cursed Sphere"]) !== 0 || blueMagicAttackBonus(["Memento Mori", "Cursed Sphere"]) !== 20 || blueClearMind(["Poison Breath"]) !== 0 || blueClearMind(["Mind Blast", "Poison Breath"]) !== 3) {
    throw new Error("cardian traits");
  }
  if (blueSetStr(["Bludgeon"]) !== 1 || blueSetStr(["Blastbomb"]) !== 1 || blueSetMnd(["Cursed Sphere"]) !== 1 || blueSetVit(["Claw Cyclone"]) !== 1 || blueSetMnd(["Poison Breath"]) !== 1 || blueSetTraits(["Bludgeon"]).some((row) => row.name === "Undead Killer") || !blueSetTraits(["Foot Kick", "Claw Cyclone"]).some((row) => row.name === "Lizard Killer") || !blueSetTraits(["Memento Mori", "Cursed Sphere"]).some((row) => row.name === "Magic Attack Bonus") || !blueSetTraits(["Mind Blast", "Poison Breath"]).some((row) => row.name === "Clear Mind")) {
    throw new Error("cardian set");
  }
  const sphereRaw = blueOrbRaw({ name: "Cursed Sphere", level: 75, int: 53, targetInt: 53, burstAffinity: false });
  const sphereBurst = blueOrbRaw({ name: "Cursed Sphere", level: 75, int: 53, targetInt: 53, burstAffinity: true });
  const bombRaw = blueOrbRaw({ name: "Blastbomb", level: 75, int: 53, targetInt: 53, burstAffinity: false });
  const breathRaw = poisonBreathRaw(1046, 75);
  const youngBreath = poisonBreathRaw(400, 22);
  if (Math.abs(sphereRaw - 64.7955) > 1e-9 || Math.abs(sphereBurst - 84.591) > 1e-9 || Math.abs(bombRaw - 53.34725) > 1e-9 || Math.abs(breathRaw - 164.6) > 1e-9 || Math.floor(breathRaw) !== 164 || Math.abs(youngBreath - 57.6) > 1e-9 || Math.floor(youngBreath) !== 57) {
    throw new Error(`orb and breath raw ${sphereRaw}/${sphereBurst}/${bombRaw}/${breathRaw}/${youngBreath}`);
  }
  const clubbed = rollPhysicalBlue({
    name: "Bludgeon",
    blueSkill: 276,
    str: 53,
    dex: 53,
    chr: 53,
    targetVit: 53,
    attack: 400,
    defense: 200,
    accuracy: 999,
    evasion: 0,
    dLevel: 0,
    chainAffinity: false,
    attackMult: blueAttackMult("Bludgeon", 0, false, false),
    ftp: blueSpellFtp("Bludgeon", 0, false, false),
    targetName: "Tropical Rarab",
    hitRoll: 0,
    pdifRoll: 0,
  });
  if (!clubbed.hit || clubbed.hits !== 3 || clubbed.dmg !== 309) throw new Error(`Bludgeon damage ${clubbed.dmg}/${clubbed.hits}`);
  const claws = rollPhysicalBlue({
    name: "Claw Cyclone",
    blueSkill: 276,
    str: 53,
    dex: 53,
    targetVit: 53,
    attack: 400,
    defense: 200,
    accuracy: 999,
    evasion: 0,
    dLevel: 0,
    chainAffinity: false,
    attackMult: blueAttackMult("Claw Cyclone", 0, false, false),
    ftp: blueSpellFtp("Claw Cyclone", 0, false, false),
    targetName: "Tropical Rarab",
    hitRoll: 0,
    pdifRoll: 0,
  });
  if (!claws.hit || claws.hits !== 2 || claws.dmg !== 217) throw new Error(`Claw Cyclone damage ${claws.dmg}/${claws.hits}`);
  const drilled = rollPhysicalBlue({
    name: "Screwdriver",
    blueSkill: 276,
    str: 53,
    dex: 53,
    mnd: 53,
    targetVit: 53,
    attack: 400,
    defense: 200,
    accuracy: 999,
    evasion: 0,
    dLevel: 0,
    chainAffinity: false,
    attackMult: blueAttackMult("Screwdriver", 0, false, false),
    ftp: blueSpellFtp("Screwdriver", 0, false, false),
    targetName: "Tropical Rarab",
    hitRoll: 0,
    pdifRoll: 0,
  });
  if (!drilled.hit || drilled.hits !== 1 || drilled.crit || drilled.dmg !== 191) throw new Error(`Screwdriver damage ${drilled.dmg}/${drilled.hits}/${drilled.crit}`);
  const slammed = rollPhysicalBlue({
    name: "Grand Slam",
    blueSkill: 276,
    str: 53,
    dex: 53,
    vit: 53,
    targetVit: 53,
    attack: 400,
    defense: 200,
    accuracy: 999,
    evasion: 0,
    dLevel: 0,
    chainAffinity: false,
    attackMult: blueAttackMult("Grand Slam", 0, false, false),
    ftp: blueSpellFtp("Grand Slam", 0, false, false),
    targetName: "Tropical Rarab",
    hitRoll: 0,
    pdifRoll: 0,
  });
  if (!slammed.hit || slammed.hits !== 1 || slammed.dmg !== 142) throw new Error(`Grand Slam damage ${slammed.dmg}`);
  const tossed = blueOrbRaw({ name: "Bomb Toss", level: 75, int: 53, targetInt: 53, burstAffinity: false });
  const tossedBurst = blueOrbRaw({ name: "Bomb Toss", level: 75, int: 53, targetInt: 53, burstAffinity: true });
  if (Math.abs(tossed - 79.29675) > 1e-9 || Math.abs(tossedBurst - 93.5935) > 1e-9) throw new Error(`Bomb Toss raw ${tossed}/${tossedBurst}`);
  if (blueSetHp(["Queasyshroom"]) !== -5 || blueSetMp(["Queasyshroom"]) !== 5 || blueSetDex(["Head Butt"]) !== 2 || blueSetChr(["Feather Storm"]) !== 2 || blueSetHp(["Feather Storm"]) !== 5 || blueSetChr(["Helldive"]) !== 1 || blueSetHp(["Helldive"]) !== 5 || blueSetHp(["Metallic Body"]) !== 0) {
    throw new Error("shell set bonus");
  }
  if (blueMaxMpBoost(["Metallic Body"], 75) !== 0 || blueMaxMpBoost(["Metallic Body"], 40) !== 0 || blueMaxMpBoost([], 75) !== 0 || blueRapidShot(["Feather Storm"], 75) !== 0 || blueRapidShot(["Feather Storm"], 38) !== 0 || blueSetTraits(["Metallic Body"]).length !== 0 || blueSetTraits(["Feather Storm"]).length !== 0 || blueSetTraits(["Queasyshroom"]).length !== 0 || blueSetTraits(["Head Butt"]).length !== 0 || blueSetTraits(["Helldive"]).length !== 0) {
    throw new Error("shell traits stay locked");
  }
  if (BLANK_GAZE.kind !== "gaze" || BLANK_GAZE.level !== 38 || BLANK_GAZE.mp !== 25 || BLANK_GAZE.points !== 2 || BLANK_GAZE.cast !== 3 || BLANK_GAZE.recast !== 10 || BLANK_GAZE.range !== 14 || BLANK_GAZE.ce !== 320 || BLANK_GAZE.ve !== 320 || BLANK_GAZE.family !== "Opo-opo" || !BLANK_GAZE.granted || BLANK_GAZE.learnSkill !== 86) {
    throw new Error("Blank Gaze card");
  }
  if (JET_STREAM.kind !== "physical" || JET_STREAM.level !== 38 || JET_STREAM.mp !== 47 || JET_STREAM.points !== 4 || JET_STREAM.cast !== 0.5 || JET_STREAM.recast !== 23 || JET_STREAM.range !== 12.5 || JET_STREAM.hits !== 3 || JET_STREAM.ftp !== 1.125 || JET_STREAM.dCap !== 39 || JET_STREAM.agiMod !== 0.3 || JET_STREAM.dex !== 2 || JET_STREAM.rapidTrait !== 4 || JET_STREAM.chain !== "Impaction" || "chain2" in JET_STREAM || JET_STREAM.family !== "Bat" || !JET_STREAM.granted || JET_STREAM.learnSkill !== 86) {
    throw new Error("Jet Stream card");
  }
  if (MYSTERIOUS_LIGHT.kind !== "mystery" || MYSTERIOUS_LIGHT.level !== 40 || MYSTERIOUS_LIGHT.mp !== 73 || MYSTERIOUS_LIGHT.points !== 4 || MYSTERIOUS_LIGHT.cast !== 3.75 || MYSTERIOUS_LIGHT.recast !== 24.5 || MYSTERIOUS_LIGHT.radius !== 6 || MYSTERIOUS_LIGHT.ftp !== 248 / 256 || MYSTERIOUS_LIGHT.chrMod !== 0.3 || MYSTERIOUS_LIGHT.dCap !== 56 || MYSTERIOUS_LIGHT.half !== 77 || MYSTERIOUS_LIGHT.low !== -24 || MYSTERIOUS_LIGHT.weight !== 26 || MYSTERIOUS_LIGHT.seconds !== 60 || MYSTERIOUS_LIGHT.agi !== 3 || MYSTERIOUS_LIGHT.mpTrait !== 4 || MYSTERIOUS_LIGHT.family !== "Pot" || !MYSTERIOUS_LIGHT.granted || MYSTERIOUS_LIGHT.learnSkill !== 92) {
    throw new Error("Mysterious Light card");
  }
  if (TERROR_TOUCH.kind !== "physical" || TERROR_TOUCH.level !== 40 || TERROR_TOUCH.mp !== 62 || TERROR_TOUCH.points !== 3 || TERROR_TOUCH.cast !== 3.25 || TERROR_TOUCH.recast !== 21 || TERROR_TOUCH.range !== 6 || TERROR_TOUCH.hits !== 1 || TERROR_TOUCH.ftp !== 1.5 || TERROR_TOUCH.dCap !== 41 || TERROR_TOUCH.dexMod !== 0.2 || TERROR_TOUCH.intMod !== 0.2 || TERROR_TOUCH.hp !== -5 || TERROR_TOUCH.setMp !== 10 || TERROR_TOUCH.defenseTrait !== 4 || TERROR_TOUCH.chain !== "Compression" || TERROR_TOUCH.chain2 !== "Reverberation" || TERROR_TOUCH.family !== "Ghost" || !TERROR_TOUCH.granted || TERROR_TOUCH.learnSkill !== 92) {
    throw new Error("Terror Touch card");
  }
  if (VENOM_SHELL.kind !== "venom" || VENOM_SHELL.level !== 42 || VENOM_SHELL.mp !== 86 || VENOM_SHELL.points !== 3 || VENOM_SHELL.cast !== 3 || VENOM_SHELL.recast !== 45 || VENOM_SHELL.radius !== 6 || VENOM_SHELL.poison !== 6 || VENOM_SHELL.seconds !== 45 || VENOM_SHELL.mnd !== 2 || VENOM_SHELL.clearTrait !== 4 || VENOM_SHELL.ce !== 1 || VENOM_SHELL.ve !== 320 || VENOM_SHELL.family !== "Uragnite" || !VENOM_SHELL.granted || VENOM_SHELL.learnSkill !== 98) {
    throw new Error("Venom Shell card");
  }
  if (blueSpellFtp("Jet Stream", 3000, true, true) !== 1.125 || blueSpellFtp("Terror Touch", 3000, true, true) !== 1.5 || blueAttackMult("Jet Stream", 3000, true, true) !== 1.3 || blueAttackMult("Terror Touch", 0, false, false) !== 1.05) {
    throw new Error("new blue physical coefficients");
  }
  if (blueChainProps("Jet Stream").join(",") !== "Impaction" || blueChainProps("Terror Touch").join(",") !== "Compression,Reverberation" || blueChainProps("Blank Gaze").length !== 0) {
    throw new Error("new blue skillchains");
  }
  const light = mysteriousLightRaw({ level: 75, chr: 53, targetChr: 53, burstAffinity: false });
  const lightBurst = mysteriousLightRaw({ level: 75, chr: 53, targetChr: 53, burstAffinity: true });
  if (Math.abs(light - 67.03459375) > 1e-9 || Math.abs(lightBurst - 79.8191875) > 1e-9) throw new Error(`Mysterious Light raw ${light}/${lightBurst}`);
  if (blueMaxMpBoost(["Mysterious Light"], 75) !== 0 || blueMaxMpBoost(["Metallic Body", "Mysterious Light"], 75) !== 10 || blueMaxMpBoost(["Metallic Body", "Mysterious Light"], 39) !== 0) {
    throw new Error("Max MP Boost pair");
  }
  if (blueRapidShot(["Jet Stream"], 75) !== 0 || blueRapidShot(["Feather Storm", "Jet Stream"], 75) !== 0.25 || blueRapidShot(["Feather Storm", "Jet Stream"], 37) !== 0) {
    throw new Error("Rapid Shot pair");
  }
  if (blueDefenseBonus(["Terror Touch"]) !== 0 || blueDefenseBonus(["Grand Slam", "Terror Touch"]) !== 10 || blueSetHp(["Terror Touch"]) !== -5 || blueSetMp(["Terror Touch"]) !== 10) {
    throw new Error("Defense Bonus pair");
  }
  if (blueClearMind(["Venom Shell"]) !== 0 || blueClearMind(["Venom Shell", "Mind Blast"]) !== 3 || blueClearMind(["Venom Shell", "Poison Breath"]) !== 3 || blueSetMnd(["Venom Shell"]) !== 2 || attackDownFactor([]) !== 1 || attackDownFactor([{ name: "Attack Down", power: 38 }]) !== 218 / 256) {
    throw new Error("Venom Shell Clear Mind");
  }
  const queasy = rollPhysicalBlue({
    name: "Queasyshroom",
    blueSkill: 276,
    str: 53,
    dex: 53,
    int: 0,
    targetVit: 53,
    attack: 400,
    defense: 200,
    accuracy: 999,
    evasion: 0,
    dLevel: 0,
    chainAffinity: false,
    targetName: "Tropical Rarab",
    hitRoll: 0,
    pdifRoll: 0,
  });
  const queasyInt = rollPhysicalBlue({
    name: "Queasyshroom",
    blueSkill: 276,
    str: 53,
    dex: 53,
    int: 100,
    targetVit: 53,
    attack: 400,
    defense: 200,
    accuracy: 999,
    evasion: 0,
    dLevel: 0,
    chainAffinity: false,
    targetName: "Tropical Rarab",
    hitRoll: 0,
    pdifRoll: 0,
  });
  if (!queasy.hit || !queasyInt.hit || queasyInt.dmg <= queasy.dmg) throw new Error("Queasyshroom INT");
  if (blueLearnSkill(12) !== 8 || blueLearnSkill(16) !== 20) throw new Error("shell skill gates");
  if (SOUND_BLAST.kind !== "sound" || SOUND_BLAST.level !== 32 || SOUND_BLAST.mp !== 25 || SOUND_BLAST.points !== 1 || SOUND_BLAST.cast !== 4 || SOUND_BLAST.recast !== 30 || SOUND_BLAST.radius !== 6 || "range" in SOUND_BLAST || SOUND_BLAST.seconds !== 30 || SOUND_BLAST.intDown !== 9 || SOUND_BLAST.ce !== 1 || SOUND_BLAST.ve !== 320 || SOUND_BLAST.hp !== 0 || SOUND_BLAST.mabTrait !== 4 || SOUND_BLAST.family !== "Cockatrice" || !SOUND_BLAST.granted || SOUND_BLAST.learnSkill !== 68) {
    throw new Error("Sound Blast card");
  }
  if (DEATH_RAY.kind !== "ray" || DEATH_RAY.level !== 34 || DEATH_RAY.mp !== 49 || DEATH_RAY.points !== 2 || DEATH_RAY.cast !== 4.5 || DEATH_RAY.recast !== 29.25 || DEATH_RAY.range !== 12 || DEATH_RAY.ftp !== 1.625 || DEATH_RAY.azureFtp !== 2 || DEATH_RAY.intMod !== 0.2 || DEATH_RAY.mndMod !== 0.1 || DEATH_RAY.dStat !== 1 || DEATH_RAY.dCap !== 51 || DEATH_RAY.half !== 77 || DEATH_RAY.low !== -30 || DEATH_RAY.hp !== -5 || DEATH_RAY.setMp !== 5 || DEATH_RAY.family !== "Hecteyes" || !DEATH_RAY.granted || DEATH_RAY.learnSkill !== 74) {
    throw new Error("Death Ray card");
  }
  if (SMITE_OF_RAGE.kind !== "physical" || SMITE_OF_RAGE.level !== 34 || SMITE_OF_RAGE.mp !== 28 || SMITE_OF_RAGE.points !== 3 || SMITE_OF_RAGE.cast !== 0.5 || SMITE_OF_RAGE.recast !== 13 || SMITE_OF_RAGE.range !== 4.5 || "radius" in SMITE_OF_RAGE || SMITE_OF_RAGE.hits !== 1 || SMITE_OF_RAGE.ftp !== 1.5 || SMITE_OF_RAGE.dCap !== 35 || SMITE_OF_RAGE.strMod !== 0.2 || SMITE_OF_RAGE.dexMod !== 0.2 || SMITE_OF_RAGE.agi !== 3 || SMITE_OF_RAGE.undeadTrait !== 4 || SMITE_OF_RAGE.chain !== "Detonation" || "chain2" in SMITE_OF_RAGE || SMITE_OF_RAGE.family !== "Evil Weapon" || !SMITE_OF_RAGE.granted || SMITE_OF_RAGE.learnSkill !== 74) {
    throw new Error("Smite of Rage card");
  }
  if (DIGEST.kind !== "digest" || DIGEST.level !== 36 || DIGEST.mp !== 20 || DIGEST.points !== 2 || DIGEST.cast !== 4 || DIGEST.recast !== 90 || DIGEST.range !== 3 || DIGEST.dmgMult !== 5 || DIGEST.ce !== 320 || DIGEST.ve !== 0 || DIGEST.hp !== -5 || DIGEST.setMp !== 5 || DIGEST.family !== "Slime" || !DIGEST.granted || DIGEST.learnSkill !== 80) {
    throw new Error("Digest card");
  }
  if (PINECONE_BOMB.kind !== "physical" || PINECONE_BOMB.level !== 36 || PINECONE_BOMB.mp !== 48 || PINECONE_BOMB.points !== 2 || PINECONE_BOMB.cast !== 2.5 || PINECONE_BOMB.recast !== 26.5 || PINECONE_BOMB.range !== 21.5 || PINECONE_BOMB.hits !== 1 || PINECONE_BOMB.ftp !== 2.25 || PINECONE_BOMB.dCap !== 37 || PINECONE_BOMB.strMod !== 0.2 || PINECONE_BOMB.agiMod !== 0.2 || PINECONE_BOMB.ranged !== true || PINECONE_BOMB.str !== 1 || PINECONE_BOMB.chain !== "Liquefaction" || PINECONE_BOMB.family !== "Treant" || !PINECONE_BOMB.granted || PINECONE_BOMB.learnSkill !== 80) {
    throw new Error("Pinecone Bomb card");
  }
  if (blueLearnSkill(34) !== 74 || blueLearnSkill(36) !== 80) throw new Error("level 34 and 36 skill gates");
  const ray = deathRayRaw({ level: 75, int: 53, mnd: 53, targetInt: 53, burstAffinity: false, azureLore: false });
  const rayBurst = deathRayRaw({ level: 75, int: 53, mnd: 53, targetInt: 53, burstAffinity: true, azureLore: false });
  const rayAzure = deathRayRaw({ level: 75, int: 53, mnd: 53, targetInt: 53, burstAffinity: false, azureLore: true });
  if (Math.abs(ray - 104.320125) > 1e-9 || Math.abs(rayBurst - 125.76525) > 1e-9 || Math.abs(rayAzure - 232.714125) > 1e-9) {
    throw new Error(`Death Ray raw ${ray}/${rayBurst}/${rayAzure}`);
  }
  if (digestRaw(276) !== 150 || digestRaw(0) !== 0) throw new Error(`Digest raw ${digestRaw(276)}`);
  if (blueSpellFtp("Smite of Rage", 3000, false, false) !== 1.5 || blueSpellFtp("Smite of Rage", 0, true, false) !== 1.5 || blueSpellFtp("Smite of Rage", 1500, true, false) !== 2.25 || blueSpellFtp("Smite of Rage", 3000, true, false) !== 2.5 || blueSpellFtp("Smite of Rage", 0, false, true) !== 2.53125 || blueAttackMult("Smite of Rage", 3000, true, true) !== 1.3) {
    throw new Error("Smite of Rage ftp");
  }
  if (blueSpellFtp("Pinecone Bomb", 3000, true, true) !== 2.25 || pineconeSeconds(0, false, false) !== 90 || pineconeSeconds(0, true, false) !== 90 || pineconeSeconds(1500, true, false) !== 150 || pineconeSeconds(3000, true, false) !== 210 || pineconeSeconds(0, false, true) !== 240) {
    throw new Error("Pinecone Bomb duration");
  }
  if (blueMagicAttackBonus(["Sound Blast"]) !== 0 || blueMagicAttackBonus(["Sound Blast", "Cursed Sphere"]) !== 20 || blueMagicAttackBonus(["Sound Blast", "Memento Mori"]) !== 20 || blueUndeadKiller(["Smite of Rage"]) !== 0 || blueUndeadKiller(["Bludgeon"]) !== 0 || blueUndeadKiller(["Smite of Rage", "Bludgeon"]) !== 0.08) {
    throw new Error("Sound Blast and Smite traits");
  }
  if (blueSetHp(["Death Ray"]) !== -5 || blueSetMp(["Death Ray"]) !== 5 || blueSetAgi(["Smite of Rage"]) !== 3 || blueSetHp(["Digest"]) !== -5 || blueSetMp(["Digest"]) !== 5 || blueSetStr(["Pinecone Bomb"]) !== 1 || blueSetHp(["Sound Blast"]) !== 0) {
    throw new Error("cockatrice set bonus");
  }
  if (blueLearnSkill(42) !== 98 || blueLearnSkill(44) !== 104 || blueLearnSkill(46) !== 110) throw new Error("level 42 to 46 skill gates");
  if (MP_DRAINKISS.kind !== "kiss" || MP_DRAINKISS.level !== 42 || MP_DRAINKISS.mp !== 20 || MP_DRAINKISS.points !== 4 || MP_DRAINKISS.cast !== 4 || MP_DRAINKISS.recast !== 90 || MP_DRAINKISS.range !== 3 || MP_DRAINKISS.dmgMult !== 3.5 || MP_DRAINKISS.cap !== 165 || MP_DRAINKISS.ce !== 320 || MP_DRAINKISS.ve !== 0 || MP_DRAINKISS.setMp !== 5 || MP_DRAINKISS.hp !== 0 || MP_DRAINKISS.family !== "Leech" || !MP_DRAINKISS.granted || MP_DRAINKISS.learnSkill !== 98) {
    throw new Error("MP Drainkiss card");
  }
  if (BLITZSTRAHL.kind !== "blitz" || BLITZSTRAHL.level !== 44 || BLITZSTRAHL.mp !== 70 || BLITZSTRAHL.points !== 4 || BLITZSTRAHL.cast !== 4.5 || BLITZSTRAHL.recast !== 29.25 || BLITZSTRAHL.range !== 12 || BLITZSTRAHL.ftp !== 1.5625 || BLITZSTRAHL.intMod !== 0.3 || BLITZSTRAHL.mndMod !== 0.1 || BLITZSTRAHL.dStat !== 1 || BLITZSTRAHL.dCap !== 61 || BLITZSTRAHL.half !== 999 || BLITZSTRAHL.low !== -399 || BLITZSTRAHL.stun !== 5 || BLITZSTRAHL.dex !== 3 || BLITZSTRAHL.family !== "Doll" || !BLITZSTRAHL.granted || BLITZSTRAHL.learnSkill !== 104) {
    throw new Error("Blitzstrahl card");
  }
  if (STINKING_GAS.kind !== "gas" || STINKING_GAS.level !== 44 || STINKING_GAS.mp !== 37 || STINKING_GAS.points !== 2 || STINKING_GAS.cast !== 4 || STINKING_GAS.recast !== 60 || STINKING_GAS.radius !== 6 || "range" in STINKING_GAS || STINKING_GAS.seconds !== 60 || STINKING_GAS.vitDown !== 10 || STINKING_GAS.ce !== 320 || STINKING_GAS.ve !== 320 || STINKING_GAS.agi !== 1 || STINKING_GAS.refreshTrait !== 1 || STINKING_GAS.family !== "Doomed" || !STINKING_GAS.granted || STINKING_GAS.learnSkill !== 104) {
    throw new Error("Stinking Gas card");
  }
  if (MANDIBULAR_BITE.kind !== "physical" || MANDIBULAR_BITE.level !== 44 || MANDIBULAR_BITE.mp !== 38 || MANDIBULAR_BITE.points !== 2 || MANDIBULAR_BITE.cast !== 0.5 || MANDIBULAR_BITE.recast !== 19.25 || MANDIBULAR_BITE.range !== 3 || MANDIBULAR_BITE.hits !== 1 || MANDIBULAR_BITE.ftp !== 2 || MANDIBULAR_BITE.dCap !== 45 || MANDIBULAR_BITE.strMod !== 0.2 || MANDIBULAR_BITE.intMod !== 0.2 || MANDIBULAR_BITE.int !== 1 || MANDIBULAR_BITE.plantTrait !== 4 || MANDIBULAR_BITE.chain !== "Induration" || "chain2" in MANDIBULAR_BITE || MANDIBULAR_BITE.family !== "Antlion" || !MANDIBULAR_BITE.granted || MANDIBULAR_BITE.learnSkill !== 104) {
    throw new Error("Mandibular Bite card");
  }
  if (MAGNETITE_CLOUD.kind !== "breath" || MAGNETITE_CLOUD.level !== 46 || MAGNETITE_CLOUD.mp !== 86 || MAGNETITE_CLOUD.points !== 3 || MAGNETITE_CLOUD.cast !== 4.5 || MAGNETITE_CLOUD.recast !== 29.25 || MAGNETITE_CLOUD.range !== 10 || MAGNETITE_CLOUD.hpMod !== 6 || MAGNETITE_CLOUD.lvlMod !== 1.875 || MAGNETITE_CLOUD.weight !== 25 || MAGNETITE_CLOUD.weightSeconds !== 60 || "poison" in MAGNETITE_CLOUD || MAGNETITE_CLOUD.element !== "earth" || MAGNETITE_CLOUD.vit !== 2 || MAGNETITE_CLOUD.mdbTrait !== 4 || MAGNETITE_CLOUD.family !== "Antica" || !MAGNETITE_CLOUD.granted || MAGNETITE_CLOUD.learnSkill !== 110) {
    throw new Error("Magnetite Cloud card");
  }
  if (kissRaw(276) !== 105 || kissRaw(0) !== 0 || kissRaw(500) !== 165) throw new Error(`MP Drainkiss raw ${kissRaw(276)}/${kissRaw(500)}`);
  const bolt = blitzRaw({ level: 75, int: 53, mnd: 53, targetInt: 53, burstAffinity: false });
  const boltBurst = blitzRaw({ level: 75, int: 53, mnd: 53, targetInt: 53, burstAffinity: true });
  if (Math.abs(bolt - 122.80625) > 1e-9 || Math.abs(boltBurst - 150.3) > 1e-9) throw new Error(`Blitzstrahl raw ${bolt}/${boltBurst}`);
  if (Math.abs(magnetiteCloudRaw(1046, 75) - (1046 / 6 + 40)) > 1e-9 || magnetiteCloudRaw(0, 0) !== 0) throw new Error(`Magnetite Cloud raw ${magnetiteCloudRaw(1046, 75)}`);
  if (blueSpellFtp("Mandibular Bite", 3000, true, true) !== 2 || blueAttackMult("Mandibular Bite", 3000, false, false) !== 1.75 || blueAttackMult("Mandibular Bite", 0, true, false) !== 1.75 || blueAttackMult("Mandibular Bite", 1500, true, false) !== 2.1 || blueAttackMult("Mandibular Bite", 3000, true, false) !== 2.5 || blueAttackMult("Mandibular Bite", 0, true, true) !== 2.65) {
    throw new Error("Mandibular Bite attack");
  }
  if (bluePlantoidKiller(["Mandibular Bite"]) !== 0 || bluePlantoidKiller(["Power Attack"]) !== 0 || bluePlantoidKiller(["Power Attack", "Mandibular Bite"]) !== 0.08 || blueSetTraits(["Power Attack", "Mandibular Bite"]).map((trait) => trait.name).join(",") !== "Plantoid Killer") {
    throw new Error("Plantoid Killer pair");
  }
  if (blueAutoRefresh(["Stinking Gas"]) !== 0 || blueAutoRefresh(["Stinking Gas", "Actinic Burst"]) !== 0 || blueAutoRefresh(["Stinking Gas", "Plasma Charge"]) !== 0 || blueAutoRefresh(["Actinic Burst", "Plasma Charge", "Stinking Gas"]) !== 1) {
    throw new Error("Stinking Gas refresh");
  }
  if (blueMagicDefenseBonus(["Magnetite Cloud"], 75) !== 0 || blueMagicDefenseBonus(["Magnetite Cloud"], 46) !== 0 || blueSetTraits(["Magnetite Cloud"]).length !== 0 || blueSetMp(["MP Drainkiss"]) !== 5 || blueSetDex(["Blitzstrahl"]) !== 3 || blueSetAgi(["Stinking Gas"]) !== 1 || blueSetInt(["Mandibular Bite"]) !== 1 || blueSetVit(["Magnetite Cloud"]) !== 2) {
    throw new Error("leech set bonus");
  }
  const smote = rollPhysicalBlue({
    name: "Smite of Rage",
    blueSkill: 276,
    str: 53,
    dex: 53,
    targetVit: 53,
    attack: 400,
    defense: 200,
    accuracy: 999,
    evasion: 0,
    dLevel: 0,
    chainAffinity: false,
    attackMult: blueAttackMult("Smite of Rage", 0, false, false),
    ftp: blueSpellFtp("Smite of Rage", 0, false, false),
    targetName: "Tropical Rarab",
    hitRoll: 0,
    pdifRoll: 0,
  });
  if (!smote.hit || smote.crit || smote.hits !== 1 || smote.dmg !== 193) throw new Error(`Smite of Rage damage ${smote.dmg}/${smote.hits}/${smote.crit}`);
  const cone = rollPhysicalBlue({
    name: "Pinecone Bomb",
    blueSkill: 276,
    str: 53,
    dex: 53,
    agi: 53,
    targetVit: 53,
    attack: 400,
    defense: 200,
    accuracy: 999,
    evasion: 0,
    dLevel: 0,
    chainAffinity: false,
    attackMult: blueAttackMult("Pinecone Bomb", 0, false, false),
    ftp: blueSpellFtp("Pinecone Bomb", 0, false, false),
    targetName: "Tropical Rarab",
    hitRoll: 0,
    pdifRoll: 0,
  });
  if (!cone.hit || cone.hits !== 1 || cone.dmg !== 221) throw new Error(`Pinecone Bomb damage ${cone.dmg}`);
  if (GEIST_WALL.kind !== "geist" || GEIST_WALL.level !== 46 || GEIST_WALL.mp !== 35 || GEIST_WALL.points !== 3 || GEIST_WALL.cast !== 3 || GEIST_WALL.recast !== 30 || GEIST_WALL.radius !== 6 || GEIST_WALL.ce !== 320 || GEIST_WALL.ve !== 320 || GEIST_WALL.hp !== -5 || GEIST_WALL.setMp !== 10 || GEIST_WALL.family !== "Eft" || !GEIST_WALL.granted || GEIST_WALL.learnSkill !== 110) {
    throw new Error("Geist Wall card");
  }
  if (AWFUL_EYE.kind !== "awful" || AWFUL_EYE.level !== 46 || AWFUL_EYE.mp !== 32 || AWFUL_EYE.points !== 2 || AWFUL_EYE.cast !== 2.5 || AWFUL_EYE.recast !== 60 || AWFUL_EYE.range !== 10 || AWFUL_EYE.seconds !== 30 || AWFUL_EYE.strDown !== 30 || AWFUL_EYE.tick !== 1 || AWFUL_EYE.ce !== 1 || AWFUL_EYE.ve !== 180 || AWFUL_EYE.mnd !== 1 || AWFUL_EYE.clearTrait !== 4 || AWFUL_EYE.family !== "Bugard" || !AWFUL_EYE.granted || AWFUL_EYE.learnSkill !== 110) {
    throw new Error("Awful Eye card");
  }
  if (BLOOD_SABER.kind !== "saber" || BLOOD_SABER.level !== 48 || BLOOD_SABER.mp !== 48 || BLOOD_SABER.points !== 2 || BLOOD_SABER.cast !== 4 || BLOOD_SABER.recast !== 90 || BLOOD_SABER.radius !== 6 || BLOOD_SABER.dmgMult !== 3.5 || BLOOD_SABER.ce !== 320 || BLOOD_SABER.ve !== 0 || BLOOD_SABER.hp !== -5 || BLOOD_SABER.setMp !== 5 || BLOOD_SABER.family !== "Skeleton" || !BLOOD_SABER.granted || BLOOD_SABER.learnSkill !== 116) {
    throw new Error("Blood Saber card");
  }
  if (JETTATURA.kind !== "jetta" || JETTATURA.level !== 48 || JETTATURA.mp !== 37 || JETTATURA.points !== 4 || JETTATURA.cast !== 0.5 || JETTATURA.recast !== 120 || JETTATURA.range !== 9 || JETTATURA.seconds !== 2 || JETTATURA.setMp !== 15 || JETTATURA.ce !== 180 || JETTATURA.ve !== 1020 || JETTATURA.family !== "Hippogryph" || !JETTATURA.granted || JETTATURA.learnSkill !== 116) {
    throw new Error("Jettatura card");
  }
  if (ICE_BREAK.kind !== "ice" || ICE_BREAK.level !== 50 || ICE_BREAK.mp !== 142 || ICE_BREAK.points !== 3 || ICE_BREAK.cast !== 5.25 || ICE_BREAK.recast !== 33.75 || ICE_BREAK.radius !== 6 || ICE_BREAK.ftp !== 2.25 || ICE_BREAK.intMod !== 0.3 || ICE_BREAK.dStat !== 1 || ICE_BREAK.dCap !== 69 || ICE_BREAK.half !== 999 || ICE_BREAK.low !== -399 || ICE_BREAK.bind !== 30 || ICE_BREAK.int !== 1 || ICE_BREAK.mdbTrait !== 4 || ICE_BREAK.family !== "Golem" || !ICE_BREAK.granted || ICE_BREAK.learnSkill !== 122) {
    throw new Error("Ice Break card");
  }
  if (saberRaw(276) !== 105 || saberRaw(0) !== 0 || saberRaw(500) !== 192) throw new Error(`Blood Saber raw ${saberRaw(276)}/${saberRaw(500)}`);
  const ice = iceBreakRaw({ level: 75, int: 53, targetInt: 53, burstAffinity: false });
  const iceBurst = iceBreakRaw({ level: 75, int: 53, targetInt: 53, burstAffinity: true });
  if (Math.abs(ice - 184.94325) > 1e-9 || Math.abs(iceBurst - 214.6365) > 1e-9) throw new Error(`Ice Break raw ${ice}/${iceBurst}`);
  if (blueClearMind(["Awful Eye"]) !== 0 || blueClearMind(["Awful Eye", "Poison Breath"]) !== 3 || blueClearMind(["Awful Eye", "Venom Shell"]) !== 3 || blueClearMind(["Awful Eye", "Mind Blast"]) !== 3 || blueClearMind(["Awful Eye", "Soporific"]) !== 3) {
    throw new Error("Awful Eye Clear Mind");
  }
  if (blueSetHp(["Geist Wall"]) !== -5 || blueSetMp(["Geist Wall"]) !== 10 || blueSetMnd(["Awful Eye"]) !== 1 || blueSetHp(["Blood Saber"]) !== -5 || blueSetMp(["Blood Saber"]) !== 5 || blueSetMp(["Jettatura"]) !== 15 || blueSetInt(["Ice Break"]) !== 1) {
    throw new Error("lizard and undead set bonus");
  }
  if (blueMagicDefenseBonus(["Ice Break"], 75) !== 0 || blueMagicDefenseBonus(["Magnetite Cloud", "Ice Break"], 49) !== 0 || blueMagicDefenseBonus(["Magnetite Cloud", "Ice Break"], 75) !== 10 || blueSetTraits(["Magnetite Cloud", "Ice Break"]).map((trait) => trait.name).join(",") !== "Magic Defense Bonus") {
    throw new Error("Magic Defense Bonus pair");
  }
  if (blueChainProps("Geist Wall").length !== 0 || blueChainProps("Awful Eye").length !== 0 || blueChainProps("Blood Saber").length !== 0 || blueChainProps("Jettatura").length !== 0 || blueChainProps("Ice Break").length !== 0) {
    throw new Error("new blue spells open no skillchain");
  }
  if (SELF_DESTRUCT.kind !== "destruct" || SELF_DESTRUCT.level !== 50 || SELF_DESTRUCT.mp !== 100 || SELF_DESTRUCT.points !== 3 || SELF_DESTRUCT.cast !== 3.25 || SELF_DESTRUCT.recast !== 21 || SELF_DESTRUCT.radius !== 6 || SELF_DESTRUCT.str !== 2 || SELF_DESTRUCT.refreshTrait !== 2 || SELF_DESTRUCT.family !== "Bomb" || !SELF_DESTRUCT.granted || SELF_DESTRUCT.learnSkill !== 122) {
    throw new Error("Self-Destruct card");
  }
  if (FRIGHTFUL_ROAR.kind !== "roar" || FRIGHTFUL_ROAR.level !== 50 || FRIGHTFUL_ROAR.mp !== 32 || FRIGHTFUL_ROAR.points !== 3 || FRIGHTFUL_ROAR.cast !== 2 || FRIGHTFUL_ROAR.recast !== 20 || FRIGHTFUL_ROAR.radius !== 6 || FRIGHTFUL_ROAR.seconds !== 180 || FRIGHTFUL_ROAR.defense !== 26 / 256 || FRIGHTFUL_ROAR.ce !== 1 || FRIGHTFUL_ROAR.ve !== 320 || FRIGHTFUL_ROAR.agi !== 2 || FRIGHTFUL_ROAR.refreshTrait !== 2 || FRIGHTFUL_ROAR.family !== "Taurus" || !FRIGHTFUL_ROAR.granted || FRIGHTFUL_ROAR.learnSkill !== 122) {
    throw new Error("Frightful Roar card");
  }
  if (COLD_WAVE.kind !== "cold" || COLD_WAVE.level !== 52 || COLD_WAVE.mp !== 37 || COLD_WAVE.points !== 1 || COLD_WAVE.cast !== 4 || COLD_WAVE.recast !== 60 || COLD_WAVE.radius !== 6 || COLD_WAVE.seconds !== 60 || COLD_WAVE.int !== -1 || COLD_WAVE.refreshTrait !== 1 || COLD_WAVE.family !== "Snoll" || !COLD_WAVE.granted || COLD_WAVE.learnSkill !== 132 || blueLearnSkill(52) !== 132) {
    throw new Error("Cold Wave card");
  }
  if (FILAMENTED_HOLD.kind !== "hold" || FILAMENTED_HOLD.level !== 52 || FILAMENTED_HOLD.mp !== 38 || FILAMENTED_HOLD.points !== 3 || FILAMENTED_HOLD.cast !== 2 || FILAMENTED_HOLD.recast !== 20 || FILAMENTED_HOLD.range !== 9 || FILAMENTED_HOLD.seconds !== 90 || FILAMENTED_HOLD.slow !== 250 || FILAMENTED_HOLD.ce !== 1 || FILAMENTED_HOLD.ve !== 320 || FILAMENTED_HOLD.vit !== 1 || FILAMENTED_HOLD.clearTrait !== 4 || FILAMENTED_HOLD.family !== "Diremite" || !FILAMENTED_HOLD.granted || FILAMENTED_HOLD.learnSkill !== 132) {
    throw new Error("Filamented Hold card");
  }
  if (HECATOMB_WAVE.kind !== "breath" || HECATOMB_WAVE.level !== 54 || HECATOMB_WAVE.mp !== 116 || HECATOMB_WAVE.points !== 3 || HECATOMB_WAVE.cast !== 5.25 || HECATOMB_WAVE.recast !== 33.75 || HECATOMB_WAVE.range !== 10 || HECATOMB_WAVE.hpMod !== 4 || HECATOMB_WAVE.lvlMod !== 1.5 || HECATOMB_WAVE.blind !== 20 || HECATOMB_WAVE.blindSeconds !== 60 || HECATOMB_WAVE.element !== "wind" || HECATOMB_WAVE.agi !== 1 || HECATOMB_WAVE.mpTrait !== 4 || HECATOMB_WAVE.family !== "Demon" || !HECATOMB_WAVE.granted || HECATOMB_WAVE.learnSkill !== 142 || blueLearnSkill(54) !== 142) {
    throw new Error("Hecatomb Wave card");
  }
  if (selfDestructRaw(1046) !== 1045 || selfDestructRaw(1) !== 0 || selfDestructRaw(2) !== 1 || selfDestructRaw(0) !== 0) {
    throw new Error(`Self-Destruct raw ${selfDestructRaw(1046)}`);
  }
  const frost = coldWaveFrost(75);
  if (frost.dot !== 17 || frost.agi !== 37) throw new Error(`Cold Wave frost ${frost.dot}/${frost.agi}`);
  if (Math.abs(hecatombWaveRaw(1046, 75) - (1046 / 4 + 75 / 1.5)) > 1e-9 || Math.abs(hecatombWaveRaw(1046, 75) - 311.5) > 1e-9) {
    throw new Error(`Hecatomb Wave raw ${hecatombWaveRaw(1046, 75)}`);
  }
  if (blueAutoRefresh(["Self-Destruct"]) !== 0 || blueAutoRefresh(["Frightful Roar"]) !== 0 || blueAutoRefresh(["Cold Wave"]) !== 0 || blueAutoRefresh(["Self-Destruct", "Frightful Roar"]) !== 0 || blueAutoRefresh(["Self-Destruct", "Frightful Roar", "Cold Wave"]) !== 0 || blueAutoRefresh(["Self-Destruct", "Actinic Burst"]) !== 0 || blueAutoRefresh(["Frightful Roar", "Actinic Burst"]) !== 0 || blueAutoRefresh(["Self-Destruct", "Frightful Roar", "Actinic Burst"]) !== 1 || blueAutoRefresh(["Self-Destruct", "Frightful Roar", "Actinic Burst", "Cold Wave", "Stinking Gas"]) !== 1) {
    throw new Error("bomb and taurus Auto Refresh");
  }
  if (blueClearMind(["Filamented Hold"]) !== 0 || blueClearMind(["Filamented Hold", "Poison Breath"]) !== 3) {
    throw new Error("Filamented Hold Clear Mind");
  }
  if (blueMaxMpBoost(["Hecatomb Wave"], 75) !== 0 || blueMaxMpBoost(["Metallic Body", "Hecatomb Wave"], 75) !== 10 || blueMaxMpBoost(["Metallic Body", "Hecatomb Wave"], 39) !== 0) {
    throw new Error("Hecatomb Wave Max MP Boost");
  }
  if (blueSetStr(["Self-Destruct"]) !== 2 || blueSetAgi(["Frightful Roar"]) !== 2 || blueSetInt(["Cold Wave"]) !== -1 || blueSetVit(["Filamented Hold"]) !== 1 || blueSetAgi(["Hecatomb Wave"]) !== 1) {
    throw new Error("bomb family set bonus");
  }
  if (blueChainProps("Self-Destruct").length !== 0 || blueChainProps("Frightful Roar").length !== 0 || blueChainProps("Cold Wave").length !== 0 || blueChainProps("Filamented Hold").length !== 0 || blueChainProps("Hecatomb Wave").length !== 0) {
    throw new Error("bomb blue spells open no skillchain");
  }
  if (RADIANT_BREATH.kind !== "breath" || RADIANT_BREATH.level !== 54 || RADIANT_BREATH.mp !== 116 || RADIANT_BREATH.points !== 4 || RADIANT_BREATH.cast !== 5.25 || RADIANT_BREATH.recast !== 33.75 || RADIANT_BREATH.range !== 13 || RADIANT_BREATH.hpMod !== 5 || RADIANT_BREATH.lvlMod !== 0.75 || RADIANT_BREATH.slow !== 250 || RADIANT_BREATH.slowSeconds !== 90 || RADIANT_BREATH.silenceSeconds !== 90 || RADIANT_BREATH.element !== "light" || RADIANT_BREATH.chr !== 1 || RADIANT_BREATH.hp !== 5 || RADIANT_BREATH.family !== "Wyvern" || !RADIANT_BREATH.granted || RADIANT_BREATH.learnSkill !== 142 || blueLearnSkill(54) !== 142) {
    throw new Error("Radiant Breath card");
  }
  if (FEATHER_BARRIER.kind !== "feather" || FEATHER_BARRIER.level !== 56 || FEATHER_BARRIER.mp !== 29 || FEATHER_BARRIER.points !== 2 || FEATHER_BARRIER.cast !== 2 || FEATHER_BARRIER.recast !== 120 || FEATHER_BARRIER.seconds !== 30 || FEATHER_BARRIER.evasion !== 25 || FEATHER_BARRIER.ce !== 1 || FEATHER_BARRIER.ve !== 300 || FEATHER_BARRIER.hp !== 0 || FEATHER_BARRIER.gravityTrait !== 4 || FEATHER_BARRIER.family !== "Roc" || !FEATHER_BARRIER.granted || FEATHER_BARRIER.learnSkill !== 152 || blueLearnSkill(56) !== 152) {
    throw new Error("Feather Barrier card");
  }
  if (FLYING_HIP_PRESS.kind !== "breath" || FLYING_HIP_PRESS.level !== 58 || FLYING_HIP_PRESS.mp !== 125 || FLYING_HIP_PRESS.points !== 3 || FLYING_HIP_PRESS.cast !== 5.75 || FLYING_HIP_PRESS.recast !== 34.5 || FLYING_HIP_PRESS.range !== 10 || FLYING_HIP_PRESS.hpMod !== 3 || FLYING_HIP_PRESS.lvlMod !== 0 || FLYING_HIP_PRESS.radial !== true || FLYING_HIP_PRESS.noBurst !== true || FLYING_HIP_PRESS.element !== "wind" || FLYING_HIP_PRESS.agi !== 1 || FLYING_HIP_PRESS.hpTrait !== 4 || FLYING_HIP_PRESS.family !== "Bugbear" || !FLYING_HIP_PRESS.granted || FLYING_HIP_PRESS.learnSkill !== 162 || blueLearnSkill(58) !== 162) {
    throw new Error("Flying Hip Press card");
  }
  if (LIGHT_OF_PENANCE.kind !== "penance" || LIGHT_OF_PENANCE.level !== 58 || LIGHT_OF_PENANCE.mp !== 53 || LIGHT_OF_PENANCE.points !== 5 || LIGHT_OF_PENANCE.cast !== 3 || LIGHT_OF_PENANCE.recast !== 60 || LIGHT_OF_PENANCE.range !== 15 || LIGHT_OF_PENANCE.seconds !== 30 || LIGHT_OF_PENANCE.accDown !== 100 || LIGHT_OF_PENANCE.tpCut !== 100 || LIGHT_OF_PENANCE.ce !== 1 || LIGHT_OF_PENANCE.ve !== 640 || LIGHT_OF_PENANCE.chr !== 1 || LIGHT_OF_PENANCE.hp !== 15 || LIGHT_OF_PENANCE.refreshTrait !== 2 || LIGHT_OF_PENANCE.family !== "Tonberry" || !LIGHT_OF_PENANCE.granted || LIGHT_OF_PENANCE.learnSkill !== 162) {
    throw new Error("Light of Penance card");
  }
  if (DEATH_SCISSORS.kind !== "physical" || DEATH_SCISSORS.level !== 60 || DEATH_SCISSORS.mp !== 51 || DEATH_SCISSORS.points !== 5 || DEATH_SCISSORS.cast !== 0.5 || DEATH_SCISSORS.recast !== 24.5 || DEATH_SCISSORS.range !== 3 || DEATH_SCISSORS.hits !== 1 || DEATH_SCISSORS.ftp !== 1.5 || DEATH_SCISSORS.dCap !== 999 || DEATH_SCISSORS.strMod !== 0.6 || DEATH_SCISSORS.dexMod !== 0 || DEATH_SCISSORS.mnd !== 2 || DEATH_SCISSORS.chr !== 2 || DEATH_SCISSORS.hp !== 5 || DEATH_SCISSORS.attackTrait !== 4 || DEATH_SCISSORS.chain !== "Compression" || DEATH_SCISSORS.chain2 !== "Reverberation" || DEATH_SCISSORS.family !== "Scorpion" || !DEATH_SCISSORS.granted || DEATH_SCISSORS.learnSkill !== 172 || blueLearnSkill(60) !== 172) {
    throw new Error("Death Scissors card");
  }
  if (Math.abs(radiantBreathRaw(1046, 75) - (1046 / 5 + 75 / 0.75)) > 1e-9 || Math.abs(radiantBreathRaw(1046, 75) - 309.2) > 1e-9) {
    throw new Error(`Radiant Breath raw ${radiantBreathRaw(1046, 75)}`);
  }
  if (Math.abs(hipPressRaw(1046) - 1046 / 3) > 1e-9) throw new Error(`Flying Hip Press raw ${hipPressRaw(1046)}`);
  if (blueSpellFtp("Death Scissors", 0, false, false) !== 1.5 || blueSpellFtp("Death Scissors", 3000, false, false) !== 1.5 || blueSpellFtp("Death Scissors", 0, true, false) !== 1.5 || blueSpellFtp("Death Scissors", 1500, true, false) !== 2.75 || blueSpellFtp("Death Scissors", 3000, true, false) !== 3.25 || blueSpellFtp("Death Scissors", 0, false, true) !== 844 / 256 || blueSpellFtp("Death Scissors", 3000, true, true) !== 844 / 256) {
    throw new Error("Death Scissors coefficient");
  }
  if (blueAttackMult("Death Scissors", 0, false, false) !== 1.7 || blueAttackMult("Death Scissors", 3000, true, true) !== 1.7) {
    throw new Error("Death Scissors attack multiplier");
  }
  if (blueChainProps("Death Scissors").join(",") !== "Compression,Reverberation" || blueChainProps("Radiant Breath").length !== 0 || blueChainProps("Feather Barrier").length !== 0 || blueChainProps("Flying Hip Press").length !== 0 || blueChainProps("Light of Penance").length !== 0) {
    throw new Error("Death Scissors skillchain");
  }
  if (blueAttackBonus(["Death Scissors"]) !== 0 || blueAttackBonus(["Uppercut", "Death Scissors"]) !== 10 || blueAttackBonus(["Battle Dance", "Death Scissors"]) !== 10) {
    throw new Error("Death Scissors Attack Bonus");
  }
  if (blueAutoRefresh(["Light of Penance"]) !== 0 || blueAutoRefresh(["Actinic Burst", "Self-Destruct", "Light of Penance"]) !== 1 || blueAutoRefresh(["Actinic Burst", "Plasma Charge", "Light of Penance"]) !== 1) {
    throw new Error("Light of Penance Auto Refresh");
  }
  if (blueMaxHpBoost(["Flying Hip Press"], 75) !== 0 || blueMaxHpBoost(["Flying Hip Press"], 62) !== 0 || blueResistGravity(["Feather Barrier"], 75) !== 0 || blueResistGravity(["Feather Barrier"], 69) !== 0) {
    throw new Error("Hip Press and Feather Barrier traits");
  }
  if (blueSetChr(["Radiant Breath"]) !== 1 || blueSetHp(["Radiant Breath"]) !== 5 || blueSetHp(["Feather Barrier"]) !== 0 || blueSetAgi(["Flying Hip Press"]) !== 1 || blueSetHp(["Flying Hip Press"]) !== 0 || blueSetChr(["Light of Penance"]) !== 1 || blueSetHp(["Light of Penance"]) !== 15 || blueSetMnd(["Death Scissors"]) !== 2 || blueSetChr(["Death Scissors"]) !== 2 || blueSetHp(["Death Scissors"]) !== 5) {
    throw new Error("wyvern family set bonus");
  }
  if (blueSetTraits(["Feather Barrier"]).length !== 0 || blueSetTraits(["Flying Hip Press"]).length !== 0 || blueSetTraits(["Light of Penance"]).length !== 0 || blueSetTraits(["Death Scissors"]).length !== 0 || blueSetTraits(["Uppercut", "Death Scissors"]).map((trait) => trait.name).join(",") !== "Attack Bonus") {
    throw new Error("new blue trait rows");
  }
  if (DIMENSIONAL_DEATH.kind !== "physical" || DIMENSIONAL_DEATH.level !== 60 || DIMENSIONAL_DEATH.mp !== 48 || DIMENSIONAL_DEATH.points !== 5 || DIMENSIONAL_DEATH.cast !== 0.5 || DIMENSIONAL_DEATH.recast !== 23.75 || DIMENSIONAL_DEATH.range !== 3 || DIMENSIONAL_DEATH.hits !== 1 || DIMENSIONAL_DEATH.ftp !== 2.25 || DIMENSIONAL_DEATH.dCap !== 999 || DIMENSIONAL_DEATH.strMod !== 0.5 || DIMENSIONAL_DEATH.dexMod !== 0 || DIMENSIONAL_DEATH.dex !== 1 || DIMENSIONAL_DEATH.chr !== 1 || DIMENSIONAL_DEATH.hp !== 5 || DIMENSIONAL_DEATH.accuracyTrait !== 4 || DIMENSIONAL_DEATH.chain !== "Transfixion" || DIMENSIONAL_DEATH.chain2 !== "Impaction" || DIMENSIONAL_DEATH.family !== "Shadow" || !DIMENSIONAL_DEATH.granted || DIMENSIONAL_DEATH.learnSkill !== 172) {
    throw new Error("Dimensional Death card");
  }
  if (SPIRAL_SPIN.kind !== "physical" || SPIRAL_SPIN.level !== 60 || SPIRAL_SPIN.mp !== 39 || SPIRAL_SPIN.points !== 3 || SPIRAL_SPIN.cast !== 4 || SPIRAL_SPIN.recast !== 45 || SPIRAL_SPIN.range !== 15 || SPIRAL_SPIN.hits !== 1 || SPIRAL_SPIN.ftp !== 2 || SPIRAL_SPIN.agiMod !== 0.3 || SPIRAL_SPIN.str !== 1 || SPIRAL_SPIN.hp !== 5 || SPIRAL_SPIN.plantTrait !== 4 || SPIRAL_SPIN.chain !== "Transfixion" || "chain2" in SPIRAL_SPIN || SPIRAL_SPIN.family !== "Ladybug" || !SPIRAL_SPIN.granted || SPIRAL_SPIN.learnSkill !== 172 || SPIRAL_ACC !== 15 || SPIRAL_SECONDS !== 60) {
    throw new Error("Spiral Spin card");
  }
  if (MAELSTROM.kind !== "mael" || MAELSTROM.level !== 61 || MAELSTROM.mp !== 162 || MAELSTROM.points !== 5 || MAELSTROM.cast !== 6 || MAELSTROM.recast !== 39 || MAELSTROM.radius !== 5 || "range" in MAELSTROM || MAELSTROM.ftp !== 2.375 || MAELSTROM.intMod !== 0.3 || MAELSTROM.mndMod !== 0.1 || MAELSTROM.dStat !== 1.5 || MAELSTROM.dCap !== 69 || MAELSTROM.half !== 999 || MAELSTROM.low !== -399 || MAELSTROM.strDown !== 20 || MAELSTROM.seconds !== 60 || MAELSTROM.mnd !== 2 || MAELSTROM.clearTrait !== 4 || MAELSTROM.family !== "Sea Monk" || !MAELSTROM.granted || MAELSTROM.learnSkill !== 176 || blueLearnSkill(61) !== 176) {
    throw new Error("Maelstrom card");
  }
  if (EYES_ON_ME.kind !== "eyes" || EYES_ON_ME.level !== 61 || EYES_ON_ME.mp !== 112 || EYES_ON_ME.points !== 4 || EYES_ON_ME.cast !== 4.5 || EYES_ON_ME.recast !== 29.25 || EYES_ON_ME.range !== 13 || EYES_ON_ME.ftp !== 2.625 || EYES_ON_ME.azureFtp !== 2 || EYES_ON_ME.chrMod !== 0.4 || EYES_ON_ME.dStat !== 1.5 || EYES_ON_ME.dCap !== 69 || EYES_ON_ME.half !== 999 || EYES_ON_ME.low !== -399 || EYES_ON_ME.hp !== -5 || EYES_ON_ME.setMp !== 15 || EYES_ON_ME.mabTrait !== 4 || EYES_ON_ME.family !== "Ahriman" || !EYES_ON_ME.granted || EYES_ON_ME.learnSkill !== 176) {
    throw new Error("Eyes On Me card");
  }
  if (SEEDSPRAY.kind !== "physical" || SEEDSPRAY.level !== 61 || SEEDSPRAY.mp !== 61 || SEEDSPRAY.points !== 2 || SEEDSPRAY.cast !== 4 || SEEDSPRAY.recast !== 35 || SEEDSPRAY.range !== 11.5 || SEEDSPRAY.hits !== 3 || SEEDSPRAY.ftp !== 0.875 || SEEDSPRAY.dexMod !== 0.3 || SEEDSPRAY.vit !== 1 || SEEDSPRAY.beastTrait !== 4 || SEEDSPRAY.chain !== "Induration" || SEEDSPRAY.chain2 !== "Detonation" || SEEDSPRAY.family !== "Rafflesia" || !SEEDSPRAY.granted || SEEDSPRAY.learnSkill !== 176 || Math.abs(SEED_DEF - 20 / 256) > 1e-12 || SEED_SECONDS !== 120) {
    throw new Error("Seedspray card");
  }
  if (blueSpellFtp("Dimensional Death", 3000, true, true) !== 2.25 || blueSpellFtp("Spiral Spin", 3000, true, true) !== 2 || blueSpellFtp("Seedspray", 0, false, true) !== 0.875) {
    throw new Error("shadow family coefficient");
  }
  if (blueAttackMult("Dimensional Death", 0, false, false) !== 1.2 || blueAttackMult("Dimensional Death", 3000, false, false) !== 1.2 || blueAttackMult("Dimensional Death", 0, true, false) !== 1.2 || blueAttackMult("Dimensional Death", 1500, true, false) !== 2.2 || blueAttackMult("Dimensional Death", 3000, true, false) !== 2.25 || blueAttackMult("Dimensional Death", 0, false, true) !== 2.3 || blueAttackMult("Dimensional Death", 3000, true, true) !== 2.3 || blueAttackMult("Spiral Spin", 3000, true, true) !== 1 || blueAttackMult("Seedspray", 3000, true, true) !== 1) {
    throw new Error("Dimensional Death attack multiplier");
  }
  if (blueChainProps("Dimensional Death").join(",") !== "Transfixion,Impaction" || blueChainProps("Spiral Spin").join(",") !== "Transfixion" || blueChainProps("Seedspray").join(",") !== "Induration,Detonation" || blueChainProps("Maelstrom").length !== 0 || blueChainProps("Eyes On Me").length !== 0) {
    throw new Error("shadow family skillchain");
  }
  if (blueAccuracyBonus(["Dimensional Death"]) !== 0 || blueAccuracyBonus(["Frenetic Rip", "Dimensional Death"]) !== 10 || blueAccuracyBonus(["Disseverment", "Dimensional Death"]) !== 10) {
    throw new Error("Dimensional Death Accuracy Bonus");
  }
  if (bluePlantoidKiller(["Spiral Spin"]) !== 0 || bluePlantoidKiller(["Power Attack", "Spiral Spin"]) !== 0.08 || bluePlantoidKiller(["Mandibular Bite", "Spiral Spin"]) !== 0.08) {
    throw new Error("Spiral Spin Plantoid Killer");
  }
  if (blueClearMind(["Maelstrom"]) !== 0 || blueClearMind(["Poison Breath", "Maelstrom"]) !== 3) {
    throw new Error("Maelstrom Clear Mind");
  }
  if (blueMagicAttackBonus(["Eyes On Me"]) !== 0 || blueMagicAttackBonus(["Memento Mori", "Eyes On Me"]) !== 20 || blueMagicAttackBonus(["Sound Blast", "Eyes On Me"]) !== 20 || blueMagicAttackBonus(["Cursed Sphere", "Eyes On Me"]) !== 20) {
    throw new Error("Eyes On Me Magic Attack Bonus");
  }
  if (blueBeastKiller(["Seedspray"]) !== 0 || blueBeastKiller(["Wild Oats", "Seedspray"]) !== 0.08 || blueBeastKiller(["Sprout Smack", "Seedspray"]) !== 0) {
    throw new Error("Seedspray Beast Killer");
  }
  if (Math.abs(maelRaw({ level: 75, int: 0, mnd: 0, targetInt: 0, burstAffinity: false }) - 69 * 2.375) > 1e-9 || Math.abs(maelRaw({ level: 75, int: 0, mnd: 0, targetInt: 0, burstAffinity: true }) - 69 * 2.375) > 1e-9) {
    throw new Error("Maelstrom raw");
  }
  const eyesBare = eyesRaw({ level: 75, chr: 0, targetChr: 0, burstAffinity: false, azureLore: false });
  const eyesAzure = eyesRaw({ level: 75, chr: 0, targetChr: 0, burstAffinity: false, azureLore: true });
  if (Math.abs(eyesBare - 69 * 2.625) > 1e-9 || Math.abs(eyesAzure - 69 * 4.625) > 1e-9 || eyesRaw({ level: 75, chr: 0, targetChr: 0, burstAffinity: true, azureLore: true }) !== eyesAzure) {
    throw new Error(`Eyes On Me raw ${eyesBare}/${eyesAzure}`);
  }
  if (blueSetDex(["Dimensional Death"]) !== 1 || blueSetChr(["Dimensional Death"]) !== 1 || blueSetHp(["Dimensional Death"]) !== 5 || blueSetStr(["Spiral Spin"]) !== 1 || blueSetHp(["Spiral Spin"]) !== 5 || blueSetMnd(["Maelstrom"]) !== 2 || blueSetHp(["Eyes On Me"]) !== -5 || blueSetMp(["Eyes On Me"]) !== 15 || blueSetVit(["Seedspray"]) !== 1) {
    throw new Error("shadow family set bonus");
  }
  if (blueSetTraits(["Dimensional Death"]).length !== 0 || blueSetTraits(["Spiral Spin"]).length !== 0 || blueSetTraits(["Maelstrom"]).length !== 0 || blueSetTraits(["Eyes On Me"]).length !== 0 || blueSetTraits(["Seedspray"]).length !== 0 || blueSetTraits(["Frenetic Rip", "Dimensional Death"]).map((trait) => trait.name).join(",") !== "Accuracy Bonus" || blueSetTraits(["Power Attack", "Spiral Spin"]).map((trait) => trait.name).join(",") !== "Plantoid Killer" || blueSetTraits(["Poison Breath", "Maelstrom"]).map((trait) => trait.name).join(",") !== "Clear Mind" || blueSetTraits(["Memento Mori", "Eyes On Me"]).map((trait) => trait.name).join(",") !== "Magic Attack Bonus" || blueSetTraits(["Wild Oats", "Seedspray"]).map((trait) => trait.name).join(",") !== "Beast Killer") {
    throw new Error("shadow family trait rows");
  }
  if (BAD_BREATH.kind !== "breath" || BAD_BREATH.level !== 61 || BAD_BREATH.mp !== 212 || BAD_BREATH.points !== 5 || BAD_BREATH.cast !== 8.75 || BAD_BREATH.recast !== 120 || BAD_BREATH.range !== 10 || BAD_BREATH.hpMod !== 8 || BAD_BREATH.lvlMod !== 3 || BAD_BREATH.poison !== 4 || BAD_BREATH.slow !== 200 || BAD_BREATH.weight !== 14 || BAD_BREATH.blind !== 20 || BAD_BREATH.paralyze !== 15 || BAD_BREATH.silenceSeconds !== 60 || BAD_BREATH.bindSeconds !== 60 || BAD_BREATH.element !== "earth" || BAD_BREATH.int !== 2 || BAD_BREATH.mnd !== 2 || BAD_BREATH.fastTrait !== 4 || BAD_BREATH.family !== "Morbol" || !BAD_BREATH.granted || BAD_BREATH.learnSkill !== 176 || blueLearnSkill(61) !== 176) {
    throw new Error("Bad Breath card");
  }
  if (BODY_SLAM.kind !== "physical" || BODY_SLAM.level !== 62 || BODY_SLAM.mp !== 74 || BODY_SLAM.points !== 4 || BODY_SLAM.cast !== 1 || BODY_SLAM.recast !== 27.75 || BODY_SLAM.radius !== 10 || BODY_SLAM.hits !== 1 || BODY_SLAM.ftp !== 1.5 || BODY_SLAM.vitMod !== 0.4 || BODY_SLAM.vit !== 1 || BODY_SLAM.setMp !== 5 || BODY_SLAM.hpTrait !== 4 || BODY_SLAM.chain !== "Impaction" || "chain2" in BODY_SLAM || BODY_SLAM.family !== "Dragon" || !BODY_SLAM.granted || BODY_SLAM.learnSkill !== 181 || blueLearnSkill(62) !== 181) {
    throw new Error("Body Slam card");
  }
  if (THOUSAND_NEEDLES.kind !== "needles" || THOUSAND_NEEDLES.level !== 62 || THOUSAND_NEEDLES.mp !== 350 || THOUSAND_NEEDLES.points !== 5 || THOUSAND_NEEDLES.cast !== 12 || THOUSAND_NEEDLES.recast !== 120 || THOUSAND_NEEDLES.radius !== 10 || THOUSAND_NEEDLES.damage !== 1000 || THOUSAND_NEEDLES.maccPenalty !== 50 || THOUSAND_NEEDLES.vit !== 3 || THOUSAND_NEEDLES.agi !== 3 || THOUSAND_NEEDLES.beastTrait !== 4 || THOUSAND_NEEDLES.family !== "Sabotender" || !THOUSAND_NEEDLES.granted || THOUSAND_NEEDLES.learnSkill !== 181) {
    throw new Error("1000 Needles card");
  }
  if (SPINAL_CLEAVE.kind !== "physical" || SPINAL_CLEAVE.level !== 63 || SPINAL_CLEAVE.mp !== 61 || SPINAL_CLEAVE.points !== 4 || SPINAL_CLEAVE.cast !== 0.5 || SPINAL_CLEAVE.recast !== 28.5 || SPINAL_CLEAVE.range !== 9 || SPINAL_CLEAVE.hits !== 1 || SPINAL_CLEAVE.ftp !== 3 || SPINAL_CLEAVE.strMod !== 0.3 || SPINAL_CLEAVE.vit !== 2 || SPINAL_CLEAVE.int !== 1 || SPINAL_CLEAVE.mnd !== 1 || SPINAL_CLEAVE.attackTrait !== 4 || SPINAL_CLEAVE.chain !== "Scission" || SPINAL_CLEAVE.chain2 !== "Detonation" || SPINAL_CLEAVE.family !== "Qutrub" || !SPINAL_CLEAVE.granted || SPINAL_CLEAVE.learnSkill !== 186 || blueLearnSkill(63) !== 186) {
    throw new Error("Spinal Cleave card");
  }
  if (FRYPAN.kind !== "physical" || FRYPAN.level !== 63 || FRYPAN.mp !== 65 || FRYPAN.points !== 3 || FRYPAN.cast !== 1 || FRYPAN.recast !== 26 || FRYPAN.radius !== 10 || FRYPAN.hits !== 1 || FRYPAN.ftp !== 454 / 256 || FRYPAN.strMod !== 0.2 || FRYPAN.mndMod !== 0.2 || FRYPAN.dex !== 2 || FRYPAN.hpTrait !== 4 || FRYPAN.chain !== "Impaction" || FRYPAN_STUN !== 5 || FRYPAN.family !== "Moblin" || !FRYPAN.granted || FRYPAN.learnSkill !== 186) {
    throw new Error("Frypan card");
  }
  if (Math.abs(badBreathRaw(1046, 75) - (1046 / 8 + 75 / 3)) > 1e-9 || Math.abs(badBreathRaw(1046, 75) - 155.75) > 1e-9) {
    throw new Error(`Bad Breath raw ${badBreathRaw(1046, 75)}`);
  }
  if (needlesSplit(1) !== 1000 || needlesSplit(4) !== 250 || needlesSplit(0) !== 0 || needlesSplit(3) !== 333) {
    throw new Error("1000 Needles split");
  }
  if (blueSpellFtp("Body Slam", 3000, true, true) !== 1.5 || blueSpellFtp("Spinal Cleave", 3000, true, true) !== 3 || blueSpellFtp("Frypan", 0, false, true) !== 454 / 256) {
    throw new Error("morbol family coefficient");
  }
  if (blueAttackMult("Body Slam", 0, false, false) !== 1.3 || blueAttackMult("Body Slam", 3000, false, false) !== 1.3 || blueAttackMult("Body Slam", 0, true, false) !== 1.3 || blueAttackMult("Body Slam", 1500, true, false) !== 1.7 || blueAttackMult("Body Slam", 3000, true, false) !== 2.1 || blueAttackMult("Body Slam", 0, false, true) !== 2.15 || blueAttackMult("Body Slam", 3000, true, true) !== 2.15 || blueAttackMult("Spinal Cleave", 3000, true, true) !== 1.05 || blueAttackMult("Frypan", 3000, true, true) !== 1) {
    throw new Error("Body Slam attack multiplier");
  }
  if (blueAccBonus("Spinal Cleave", 3000, false, false) !== 0 || blueAccBonus("Spinal Cleave", 0, true, false) !== 0 || blueAccBonus("Spinal Cleave", 1500, true, false) !== 30 || blueAccBonus("Spinal Cleave", 3000, true, false) !== 60 || blueAccBonus("Spinal Cleave", 100, false, true) !== 70 || blueAccBonus("Frypan", 3000, true, false) !== 60 || blueAccBonus("Frypan", 0, false, true) !== 70 || blueAccBonus("Death Scissors", 3000, true, true) !== 0) {
    throw new Error("Spinal Cleave accuracy");
  }
  if (blueChainProps("Body Slam").join(",") !== "Impaction" || blueChainProps("Spinal Cleave").join(",") !== "Scission,Detonation" || blueChainProps("Frypan").join(",") !== "Impaction" || blueChainProps("Bad Breath").length !== 0 || blueChainProps("1000 Needles").length !== 0) {
    throw new Error("morbol family skillchain");
  }
  if (blueFastCast(["Bad Breath"], 75) !== 0 || blueFastCast(["Bad Breath"], 72) !== 0 || blueMaxHpBoost(["Body Slam"], 75) !== 0 || blueMaxHpBoost(["Frypan"], 75) !== 0 || blueMaxHpBoost(["Flying Hip Press", "Body Slam"], 75) !== 30 || blueMaxHpBoost(["Flying Hip Press", "Frypan"], 75) !== 30 || blueMaxHpBoost(["Body Slam", "Frypan"], 75) !== 30 || blueMaxHpBoost(["Body Slam", "Frypan"], 61) !== 0) {
    throw new Error("Bad Breath and Body Slam traits");
  }
  if (blueBeastKiller(["1000 Needles"]) !== 0 || blueBeastKiller(["1000 Needles", "Seedspray"]) !== 0.08 || blueBeastKiller(["1000 Needles", "Sprout Smack"]) !== 0.08 || blueBeastKiller(["1000 Needles", "Wild Oats"]) !== 0.08) {
    throw new Error("1000 Needles Beast Killer");
  }
  if (blueAttackBonus(["Spinal Cleave"]) !== 0 || blueAttackBonus(["Spinal Cleave", "Death Scissors"]) !== 10 || blueAttackBonus(["Spinal Cleave", "Battle Dance"]) !== 10 || blueAttackBonus(["Spinal Cleave", "Uppercut"]) !== 10) {
    throw new Error("Spinal Cleave Attack Bonus");
  }
  if (blueSetInt(["Bad Breath"]) !== 2 || blueSetMnd(["Bad Breath"]) !== 2 || blueSetVit(["Body Slam"]) !== 1 || blueSetMp(["Body Slam"]) !== 5 || blueSetVit(["1000 Needles"]) !== 3 || blueSetAgi(["1000 Needles"]) !== 3 || blueSetVit(["Spinal Cleave"]) !== 2 || blueSetInt(["Spinal Cleave"]) !== 1 || blueSetMnd(["Spinal Cleave"]) !== 1 || blueSetDex(["Frypan"]) !== 2) {
    throw new Error("morbol family set bonus");
  }
  if (blueSetTraits(["Bad Breath"]).length !== 0 || blueSetTraits(["Body Slam"]).length !== 0 || blueSetTraits(["1000 Needles"]).length !== 0 || blueSetTraits(["Spinal Cleave"]).length !== 0 || blueSetTraits(["Frypan"]).length !== 0 || blueSetTraits(["Flying Hip Press", "Body Slam"]).map((trait) => trait.name).join(",") !== "Max HP Boost" || blueSetTraits(["1000 Needles", "Seedspray"]).map((trait) => trait.name).join(",") !== "Beast Killer" || blueSetTraits(["Spinal Cleave", "Death Scissors"]).map((trait) => trait.name).join(",") !== "Attack Bonus") {
    throw new Error("morbol family trait rows");
  }
  if (HYDRO_SHOT.kind !== "physical" || HYDRO_SHOT.level !== 63 || HYDRO_SHOT.mp !== 55 || HYDRO_SHOT.points !== 3 || HYDRO_SHOT.cast !== 0.5 || HYDRO_SHOT.recast !== 26 || HYDRO_SHOT.range !== 6 || HYDRO_SHOT.ftp !== 1.25 || HYDRO_SHOT.agiMod !== 0.3 || HYDRO_SHOT.mnd !== 2 || HYDRO_SHOT.rapidTrait !== 4 || HYDRO_SHOT.chain !== "Reverberation" || HYDRO_SHOT.family !== "Sahagin" || !HYDRO_SHOT.granted || HYDRO_SHOT.learnSkill !== 186 || blueLearnSkill(63) !== 186) {
    throw new Error("Hydro Shot card");
  }
  if (FEATHER_TICKLE.kind !== "tickle" || FEATHER_TICKLE.level !== 64 || FEATHER_TICKLE.mp !== 48 || FEATHER_TICKLE.points !== 3 || FEATHER_TICKLE.cast !== 4 || FEATHER_TICKLE.recast !== 90 || FEATHER_TICKLE.range !== 11 || FEATHER_TICKLE.tpCut !== 1500 || FEATHER_TICKLE.agi !== 1 || FEATHER_TICKLE.clearTrait !== 4 || FEATHER_TICKLE.ce !== 1 || FEATHER_TICKLE.ve !== 320 || FEATHER_TICKLE.family !== "Colibri" || !FEATHER_TICKLE.granted || FEATHER_TICKLE.learnSkill !== 191 || blueLearnSkill(64) !== 191) {
    throw new Error("Feather Tickle card");
  }
  if (YAWN.kind !== "yawn" || YAWN.level !== 64 || YAWN.mp !== 55 || YAWN.points !== 3 || YAWN.cast !== 3 || YAWN.recast !== 60 || YAWN.radius !== 10 || YAWN.seconds !== 90 || YAWN.chr !== 1 || YAWN.hp !== 5 || YAWN.sleepTrait !== 4 || YAWN.ce !== 320 || YAWN.ve !== 320 || YAWN.family !== "Apkallu" || !YAWN.granted || YAWN.learnSkill !== 191) {
    throw new Error("Yawn card");
  }
  if (VORACIOUS_TRUNK.kind !== "trunk" || VORACIOUS_TRUNK.level !== 64 || VORACIOUS_TRUNK.mp !== 72 || VORACIOUS_TRUNK.points !== 4 || VORACIOUS_TRUNK.cast !== 10 || VORACIOUS_TRUNK.recast !== 120 || VORACIOUS_TRUNK.range !== 6 || VORACIOUS_TRUNK.agi !== 2 || VORACIOUS_TRUNK.refreshTrait !== 3 || VORACIOUS_TRUNK.ce !== 320 || VORACIOUS_TRUNK.ve !== 640 || VORACIOUS_TRUNK.family !== "Marid" || !VORACIOUS_TRUNK.granted || VORACIOUS_TRUNK.learnSkill !== 191) {
    throw new Error("Voracious Trunk card");
  }
  if (INFRASONICS.kind !== "infra" || INFRASONICS.level !== 65 || INFRASONICS.mp !== 42 || INFRASONICS.points !== 4 || INFRASONICS.cast !== 5 || INFRASONICS.recast !== 120 || INFRASONICS.range !== 10 || INFRASONICS.evaDown !== 20 || INFRASONICS.seconds !== 60 || INFRASONICS.int !== 1 || INFRASONICS.ce !== 1 || INFRASONICS.ve !== 320 || INFRASONICS.family !== "Lizard" || !INFRASONICS.granted || INFRASONICS.learnSkill !== 196 || blueLearnSkill(65) !== 196) {
    throw new Error("Infrasonics card");
  }
  if (blueSpellFtp("Hydro Shot", 3000, true, true) !== 1.25 || blueAttackMult("Hydro Shot", 0, false, false) !== 1.85 || blueAttackMult("Hydro Shot", 3000, true, true) !== 1.85 || blueChainProps("Hydro Shot").join(",") !== "Reverberation") {
    throw new Error("Hydro Shot coefficient");
  }
  if (blueRapidShot(["Hydro Shot"], 75) !== 0 || blueRapidShot(["Feather Storm", "Hydro Shot"], 75) !== 0.25 || blueRapidShot(["Jet Stream", "Hydro Shot"], 75) !== 0.25 || blueRapidShot(["Feather Storm", "Jet Stream"], 75) !== 0.25 || blueRapidShot(["Feather Storm", "Hydro Shot"], 37) !== 0) {
    throw new Error("Hydro Shot Rapid Shot");
  }
  if (blueClearMind(["Feather Tickle"]) !== 0 || blueClearMind(["Poison Breath", "Feather Tickle"]) !== 3 || blueClearMind(["Mind Blast", "Feather Tickle"]) !== 3 || blueClearMind(["Soporific", "Feather Tickle"]) !== 3) {
    throw new Error("Feather Tickle Clear Mind");
  }
  if (blueResistSleep(["Yawn"]) !== 0 || blueResistSleep(["Pollen", "Yawn"]) !== 0.1 || blueResistSleep(["Wild Carrot", "Yawn"]) !== 0.1 || blueResistSleep(["Magic Fruit", "Yawn"]) !== 0.1) {
    throw new Error("Yawn Resist Sleep");
  }
  if (blueAutoRefresh(["Voracious Trunk"]) !== 0 || blueAutoRefresh(["Voracious Trunk", "Actinic Burst"]) !== 0 || blueAutoRefresh(["Voracious Trunk", "Actinic Burst", "Stinking Gas"]) !== 1 || blueAutoRefresh(["Voracious Trunk", "Actinic Burst", "Cold Wave"]) !== 1) {
    throw new Error("Voracious Trunk Auto Refresh");
  }
  if (blueSetMnd(["Hydro Shot"]) !== 2 || blueSetAgi(["Feather Tickle"]) !== 1 || blueSetChr(["Yawn"]) !== 1 || blueSetHp(["Yawn"]) !== 5 || blueSetAgi(["Voracious Trunk"]) !== 2 || blueSetInt(["Infrasonics"]) !== 1) {
    throw new Error("sahagin family set bonus");
  }
  if (blueSetTraits(["Hydro Shot"]).length !== 0 || blueSetTraits(["Feather Tickle"]).length !== 0 || blueSetTraits(["Yawn"]).length !== 0 || blueSetTraits(["Voracious Trunk"]).length !== 0 || blueSetTraits(["Infrasonics"]).length !== 0 || blueSetTraits(["Feather Storm", "Hydro Shot"]).map((trait) => trait.name).join(",") !== "Rapid Shot" || blueSetTraits(["Poison Breath", "Feather Tickle"]).map((trait) => trait.name).join(",") !== "Clear Mind" || blueSetTraits(["Pollen", "Yawn"]).map((trait) => trait.name).join(",") !== "Resist Sleep" || blueSetTraits(["Voracious Trunk", "Actinic Burst", "Stinking Gas"]).map((trait) => trait.name).join(",") !== "Auto Refresh") {
    throw new Error("sahagin family trait rows");
  }
  if (FROST_BREATH.kind !== "breath" || FROST_BREATH.level !== 66 || FROST_BREATH.mp !== 136 || FROST_BREATH.points !== 3 || FROST_BREATH.cast !== 6.5 || FROST_BREATH.recast !== 42.75 || FROST_BREATH.range !== 10 || FROST_BREATH.hpMod !== 3 || FROST_BREATH.lvlMod !== 0.625 || FROST_BREATH.paralyze !== 12.5 || FROST_BREATH.paralyzeSeconds !== 180 || FROST_BREATH.element !== "ice" || FROST_BREATH.int !== -2 || FROST_BREATH.conserveTrait !== 4 || FROST_BREATH.family !== "Raptor" || !FROST_BREATH.granted || FROST_BREATH.learnSkill !== blueLearnSkill(66)) {
    throw new Error("Frost Breath card");
  }
  if (SANDSPRAY.kind !== "spray" || SANDSPRAY.level !== 66 || SANDSPRAY.mp !== 43 || SANDSPRAY.points !== 2 || SANDSPRAY.cast !== 3 || SANDSPRAY.recast !== 90 || SANDSPRAY.range !== 6.5 || SANDSPRAY.accDown !== 25 || SANDSPRAY.seconds !== 120 || SANDSPRAY.vit !== 1 || SANDSPRAY.clearTrait !== 4 || SANDSPRAY.ce !== 1 || SANDSPRAY.ve !== 640 || SANDSPRAY.family !== "Qiqirn" || !SANDSPRAY.granted || SANDSPRAY.learnSkill !== blueLearnSkill(66)) {
    throw new Error("Sandspray card");
  }
  if (CORROSIVE_OOZE.kind !== "ooze" || CORROSIVE_OOZE.level !== 66 || CORROSIVE_OOZE.mp !== 55 || CORROSIVE_OOZE.points !== 4 || CORROSIVE_OOZE.cast !== 5 || CORROSIVE_OOZE.recast !== 30 || CORROSIVE_OOZE.range !== 11 || CORROSIVE_OOZE.ftp !== 2.171875 || CORROSIVE_OOZE.azureFtp !== 0.5 || CORROSIVE_OOZE.intMod !== 0.2 || CORROSIVE_OOZE.dStat !== 2 || CORROSIVE_OOZE.dCap !== 69 || CORROSIVE_OOZE.downNumer !== 13 || CORROSIVE_OOZE.seconds !== 90 || CORROSIVE_OOZE.hp !== -10 || CORROSIVE_OOZE.setMp !== 10 || CORROSIVE_OOZE.clearTrait !== 4 || CORROSIVE_OOZE.ce !== 1 || CORROSIVE_OOZE.family !== "Slug" || !CORROSIVE_OOZE.granted || CORROSIVE_OOZE.learnSkill !== blueLearnSkill(66)) {
    throw new Error("Corrosive Ooze card");
  }
  if (DIAMONDHIDE.kind !== "hide" || DIAMONDHIDE.level !== 67 || DIAMONDHIDE.mp !== 99 || DIAMONDHIDE.points !== 3 || DIAMONDHIDE.cast !== 7 || DIAMONDHIDE.recast !== 90 || DIAMONDHIDE.seconds !== 900 || DIAMONDHIDE.radius !== 10 || DIAMONDHIDE.vit !== 1 || DIAMONDHIDE.ce !== 1 || DIAMONDHIDE.ve !== 300 || DIAMONDHIDE.family !== "Troll" || !DIAMONDHIDE.granted || DIAMONDHIDE.learnSkill !== blueLearnSkill(67)) {
    throw new Error("Diamondhide card");
  }
  if (ENERVATION.kind !== "enerv" || ENERVATION.level !== 67 || ENERVATION.mp !== 48 || ENERVATION.points !== 5 || ENERVATION.cast !== 6 || ENERVATION.recast !== 60 || ENERVATION.radius !== 11.5 || ENERVATION.seconds !== 30 || ENERVATION.defense !== 26 / 256 || ENERVATION.mdb !== 8 || ENERVATION.hp !== -5 || ENERVATION.setMp !== 5 || ENERVATION.counterTrait !== 4 || ENERVATION.ce !== 1 || ENERVATION.ve !== 320 || ENERVATION.family !== "Troll" || !ENERVATION.granted || ENERVATION.learnSkill !== blueLearnSkill(67)) {
    throw new Error("Enervation card");
  }
  if (Math.abs(frostBreathRaw(1046, 75) - (1046 / 3 + 75 / 0.625)) > 1e-9 || Math.abs(corrosiveOozeRaw({ level: 75, int: 0, targetInt: 0, burstAffinity: false, azureLore: false }) - 69 * 2.171875) > 1e-6 || Math.abs(corrosiveOozeRaw({ level: 75, int: 0, targetInt: 0, burstAffinity: false, azureLore: true }) - 69 * 2.671875) > 1e-6) {
    throw new Error("frost and ooze raw");
  }
  if (diamondhidePower(0) !== 0 || diamondhidePower(500) !== 333 || diamondhidePower(501) !== 333 || diamondhidePower(276) !== 184 || metallicCanLand("hide") || !diamondhideCanLand(null) || !diamondhideCanLand("hide") || !diamondhideCanLand("metal") || diamondhideCanLand("spell") || diamondhideCanLand("solace")) {
    throw new Error("Diamondhide shell");
  }
  if (!sandsprayCanReplace(undefined) || !sandsprayCanReplace({ name: "Blind", blindFrom: "spray" }) || sandsprayCanReplace({ name: "Blind" }) || sandsprayCanReplace({ name: "Blind", blindFrom: "spell" }) || sandsprayCanReplace({ name: "Blind", blindFrom: "breath" }) || sandsprayCanReplace({ name: "Blind II" })) {
    throw new Error("Sandspray blind");
  }
  if (blueSetInt(["Frost Breath"]) !== -2 || blueConserveMp(["Frost Breath"]) !== 0 || blueConserveMp(["Frost Breath", "Chaotic Eye"]) !== 0.25 || blueConserveMp(["Frost Breath", "Zephyr Mantle"]) !== 0.25 || blueSetVit(["Sandspray"]) !== 1 || blueSetVit(["Diamondhide"]) !== 1 || blueClearMind(["Sandspray"]) !== 0 || blueClearMind(["Poison Breath", "Sandspray"]) !== 3 || blueSetHp(["Corrosive Ooze"]) !== -10 || blueSetMp(["Corrosive Ooze"]) !== 10 || blueClearMind(["Corrosive Ooze"]) !== 0 || blueClearMind(["Poison Breath", "Corrosive Ooze"]) !== 3 || blueClearMind(["Sandspray", "Corrosive Ooze"]) !== 3 || blueSetHp(["Enervation"]) !== -5 || blueSetMp(["Enervation"]) !== 5 || blueCounter([]) !== 0 || blueCounter(["Enervation"]) !== 0) {
    throw new Error("raptor family set bonus");
  }
  if (blueSetTraits(["Frost Breath"]).length !== 0 || blueSetTraits(["Sandspray"]).length !== 0 || blueSetTraits(["Corrosive Ooze"]).length !== 0 || blueSetTraits(["Diamondhide"]).length !== 0 || blueSetTraits(["Enervation"]).length !== 0 || blueSetTraits(["Frost Breath", "Chaotic Eye"]).map((trait) => trait.name).join(",") !== "Conserve MP" || blueSetTraits(["Frost Breath", "Zephyr Mantle"]).map((trait) => trait.name).join(",") !== "Conserve MP" || blueSetTraits(["Poison Breath", "Sandspray"]).map((trait) => trait.name).join(",") !== "Clear Mind" || blueSetTraits(["Poison Breath", "Corrosive Ooze"]).map((trait) => trait.name).join(",") !== "Clear Mind" || blueSetTraits(["Sandspray", "Corrosive Ooze"]).map((trait) => trait.name).join(",") !== "Clear Mind") {
    throw new Error("raptor family trait rows");
  }
  if (WARM_UP.kind !== "warmup" || WARM_UP.level !== 68 || WARM_UP.mp !== 59 || WARM_UP.points !== 4 || WARM_UP.cast !== 7 || WARM_UP.recast !== 120 || WARM_UP.seconds !== 180 || WARM_UP.accuracy !== 10 || WARM_UP.evasion !== 10 || WARM_UP.vit !== 1 || WARM_UP.clearTrait !== 4 || WARM_UP.ce !== 1 || WARM_UP.ve !== 300 || WARM_UP.family !== "Mamool" || !WARM_UP.granted || WARM_UP.learnSkill !== blueLearnSkill(68)) {
    throw new Error("Warm-Up card");
  }
  if (FIRESPIT.kind !== "spit" || FIRESPIT.level !== 68 || FIRESPIT.mp !== 121 || FIRESPIT.points !== 5 || FIRESPIT.cast !== 6.5 || FIRESPIT.recast !== 42.75 || FIRESPIT.range !== 20 || FIRESPIT.ftp !== 3 || FIRESPIT.azureFtp !== 0 || FIRESPIT.intMod !== 0.2 || FIRESPIT.mndMod !== 0.2 || FIRESPIT.dStat !== 1.5 || FIRESPIT.dCap !== 69 || FIRESPIT.half !== 999 || FIRESPIT.low !== -399 || FIRESPIT.str !== 3 || FIRESPIT.conserveTrait !== 4 || FIRESPIT.family !== "Mamool" || !FIRESPIT.granted || FIRESPIT.learnSkill !== blueLearnSkill(68)) {
    throw new Error("Firespit card");
  }
  if (TAIL_SLAP.kind !== "physical" || TAIL_SLAP.level !== 69 || TAIL_SLAP.mp !== 77 || TAIL_SLAP.points !== 4 || TAIL_SLAP.cast !== 1 || TAIL_SLAP.recast !== 28.5 || TAIL_SLAP.range !== 10 || TAIL_SLAP.hits !== 1 || TAIL_SLAP.ftp !== 1.625 || TAIL_SLAP.dCap !== 999 || TAIL_SLAP.strMod !== 0.2 || TAIL_SLAP.vitMod !== 0.5 || TAIL_SLAP.cone !== true || TAIL_SLAP.chain !== "Reverberation" || TAIL_SLAP.mnd !== 2 || TAIL_SLAP.storeTrait !== 4 || TAIL_STUN !== 5 || TAIL_SLAP.family !== "Lamia" || !TAIL_SLAP.granted || TAIL_SLAP.learnSkill !== blueLearnSkill(69)) {
    throw new Error("Tail Slap card");
  }
  if (HYSTERIC_BARRAGE.kind !== "physical" || HYSTERIC_BARRAGE.level !== 69 || HYSTERIC_BARRAGE.mp !== 61 || HYSTERIC_BARRAGE.points !== 5 || HYSTERIC_BARRAGE.cast !== 0.5 || HYSTERIC_BARRAGE.recast !== 28.5 || HYSTERIC_BARRAGE.range !== 4.5 || HYSTERIC_BARRAGE.hits !== 5 || HYSTERIC_BARRAGE.ftp !== 1.25 || HYSTERIC_BARRAGE.dCap !== 80 || HYSTERIC_BARRAGE.dexMod !== 0.3 || HYSTERIC_BARRAGE.dex !== 2 || HYSTERIC_BARRAGE.agi !== 1 || HYSTERIC_BARRAGE.evasionTrait !== 4 || HYSTERIC_BARRAGE.chain !== "Detonation" || HYSTERIC_BARRAGE.family !== "Lamia" || !HYSTERIC_BARRAGE.granted || HYSTERIC_BARRAGE.learnSkill !== blueLearnSkill(69)) {
    throw new Error("Hysteric Barrage card");
  }
  if (REGURGITATION.kind !== "gorge" || REGURGITATION.level !== 69 || REGURGITATION.mp !== 69 || REGURGITATION.points !== 1 || REGURGITATION.cast !== 5 || REGURGITATION.recast !== 24 || REGURGITATION.range !== 21 || REGURGITATION.ftp !== 1.83 || REGURGITATION.azureFtp !== 0 || REGURGITATION.mndMod !== 0.3 || REGURGITATION.dStat !== 2 || REGURGITATION.dCap !== 69 || REGURGITATION.bind !== 30 || REGURGITATION.behind !== 1.25 || REGURGITATION.ce !== 1 || REGURGITATION.ve !== 640 || REGURGITATION.setMp !== 3 || REGURGITATION.int !== 1 || REGURGITATION.mnd !== 1 || REGURGITATION.gravityTrait !== 4 || REGURGITATION.family !== "Peiste" || !REGURGITATION.granted || REGURGITATION.learnSkill !== blueLearnSkill(69)) {
    throw new Error("Regurgitation card");
  }
  if (Math.abs(firespitRaw({ level: 75, int: 0, mnd: 0, targetInt: 0, burstAffinity: false, azureLore: false }) - 207) > 1e-6 || Math.abs(firespitRaw({ level: 75, int: 0, mnd: 0, targetInt: 0, burstAffinity: false, azureLore: true }) - 207) > 1e-6 || Math.abs(firespitRaw({ level: 75, int: 100, mnd: 0, targetInt: 0, burstAffinity: false, azureLore: false }) - 406.8) > 1e-6 || Math.abs(firespitRaw({ level: 75, int: 100, mnd: 0, targetInt: 0, burstAffinity: true, azureLore: false }) - 456.6) > 1e-6) {
    throw new Error("Firespit raw");
  }
  if (Math.abs(regurgitationRaw({ level: 75, int: 0, mnd: 0, targetInt: 0, burstAffinity: false, azureLore: false }) - 69 * 1.83) > 1e-6 || Math.abs(regurgitationRaw({ level: 75, int: 0, mnd: 0, targetInt: 0, burstAffinity: false, azureLore: true }) - 69 * 1.83) > 1e-6) {
    throw new Error("Regurgitation raw");
  }
  if (tailSlapAttackMult(3000, false, false) !== 1.05 || tailSlapAttackMult(0, true, false) !== 1.05 || tailSlapAttackMult(1500, true, false) !== 2.5 || tailSlapAttackMult(3000, true, false) !== 2.6 || tailSlapAttackMult(750, true, false) !== 1.775 || tailSlapAttackMult(0, true, true) !== 2.65 || blueAttackMult("Tail Slap", 3000, true, true) !== 2.65 || blueAttackMult("Hysteric Barrage", 3000, true, true) !== 1) {
    throw new Error("Tail Slap attack");
  }
  if (blueSpellFtp("Hysteric Barrage", 3000, false, false) !== 1.25 || blueSpellFtp("Hysteric Barrage", 0, true, false) !== 1.25 || blueSpellFtp("Hysteric Barrage", 1500, true, false) !== 1.625 || blueSpellFtp("Hysteric Barrage", 3000, true, false) !== 1.75 || blueSpellFtp("Hysteric Barrage", 0, false, true) !== 1.875 || blueSpellFtp("Tail Slap", 3000, true, true) !== 1.625) {
    throw new Error("Hysteric Barrage coefficient");
  }
  if (blueStoreTp(["Tail Slap"], 69) !== 0 || blueStoreTp(["Tail Slap"], 75) !== 0 || blueEvasionBonus(["Hysteric Barrage"]) !== 0 || blueEvasionBonus(["Screwdriver", "Hysteric Barrage"]) !== 10 || blueResistGravity(["Regurgitation"], 75) !== 0 || blueResistGravity(["Feather Barrier", "Regurgitation"], 68) !== 0 || blueResistGravity(["Feather Barrier", "Regurgitation"], 69) !== 0.1 || blueClearMind(["Warm-Up"]) !== 0 || blueClearMind(["Poison Breath", "Warm-Up"]) !== 3 || blueConserveMp(["Firespit"]) !== 0 || blueConserveMp(["Firespit", "Chaotic Eye"]) !== 0.25 || blueConserveMp(["Firespit", "Frost Breath"]) !== 0.25 || blueSetVit(["Warm-Up"]) !== 1 || blueSetStr(["Firespit"]) !== 3 || blueSetMnd(["Tail Slap"]) !== 2 || blueSetDex(["Hysteric Barrage"]) !== 2 || blueSetAgi(["Hysteric Barrage"]) !== 1 || blueSetMp(["Regurgitation"]) !== 3 || blueSetInt(["Regurgitation"]) !== 1 || blueSetMnd(["Regurgitation"]) !== 1) {
    throw new Error("mamool family set bonus");
  }
  if (blueSetTraits(["Warm-Up"]).length !== 0 || blueSetTraits(["Firespit"]).length !== 0 || blueSetTraits(["Tail Slap"]).length !== 0 || blueSetTraits(["Hysteric Barrage"]).length !== 0 || blueSetTraits(["Regurgitation"]).length !== 0 || blueSetTraits(["Poison Breath", "Warm-Up"]).map((trait) => trait.name).join(",") !== "Clear Mind" || blueSetTraits(["Firespit", "Chaotic Eye"]).map((trait) => trait.name).join(",") !== "Conserve MP" || blueSetTraits(["Screwdriver", "Hysteric Barrage"]).map((trait) => trait.name).join(",") !== "Evasion Bonus" || blueSetTraits(["Feather Barrier", "Regurgitation"]).map((trait) => trait.name).join(",") !== "Resist Gravity") {
    throw new Error("mamool family trait rows");
  }
  if (AMPLIFICATION.kind !== "amp" || AMPLIFICATION.level !== 70 || AMPLIFICATION.mp !== 48 || AMPLIFICATION.points !== 3 || AMPLIFICATION.cast !== 7 || AMPLIFICATION.recast !== 120 || AMPLIFICATION.seconds !== 90 || AMPLIFICATION.mab !== 10 || AMPLIFICATION.mdb !== 10 || AMPLIFICATION.hp !== -5 || AMPLIFICATION.setMp !== 5 || AMPLIFICATION.ce !== 320 || AMPLIFICATION.ve !== 320 || AMPLIFICATION.family !== "Flan" || !AMPLIFICATION.granted || AMPLIFICATION.learnSkill !== blueLearnSkill(70)) {
    throw new Error("Amplification card");
  }
  if (ASURAN_CLAWS.kind !== "physical" || ASURAN_CLAWS.level !== 70 || ASURAN_CLAWS.mp !== 81 || ASURAN_CLAWS.points !== 2 || ASURAN_CLAWS.cast !== 3 || ASURAN_CLAWS.recast !== 60 || ASURAN_CLAWS.range !== 4.5 || ASURAN_CLAWS.hits !== 6 || ASURAN_CLAWS.ftp !== 0.625 || ASURAN_CLAWS.dCap !== 999 || ASURAN_CLAWS.strMod !== 0.1 || ASURAN_CLAWS.dexMod !== 0.1 || ASURAN_CLAWS.chain !== "Liquefaction" || ASURAN_CLAWS.chain2 !== "Impaction" || ASURAN_CLAWS.agi !== 3 || ASURAN_CLAWS.counterTrait !== 4 || ASURAN_CLAWS.family !== "Gnole" || !ASURAN_CLAWS.granted || ASURAN_CLAWS.learnSkill !== blueLearnSkill(70)) {
    throw new Error("Asuran Claws card");
  }
  if (LOWING.kind !== "lowing" || LOWING.level !== 71 || LOWING.mp !== 66 || LOWING.points !== 2 || LOWING.cast !== 7 || LOWING.recast !== 56 || LOWING.radius !== 10 || LOWING.seconds !== 60 || LOWING.tpCut !== 50 || LOWING.mpCut !== 3 || LOWING.hp !== -5 || LOWING.clearTrait !== 4 || LOWING.ce !== 1 || LOWING.ve !== 320 || LOWING.family !== "Buffalo" || !LOWING.granted || LOWING.learnSkill !== blueLearnSkill(71)) {
    throw new Error("Lowing card");
  }
  if (HEAT_BREATH.kind !== "breath" || HEAT_BREATH.level !== 71 || HEAT_BREATH.mp !== 169 || HEAT_BREATH.points !== 4 || HEAT_BREATH.cast !== 7.5 || HEAT_BREATH.recast !== 49 || HEAT_BREATH.range !== 16 || HEAT_BREATH.hpMod !== 2 || HEAT_BREATH.lvlMod !== 0 || HEAT_BREATH.noBurst !== true || HEAT_BREATH.element !== "fire" || HEAT_BREATH.str !== 3 || HEAT_BREATH.mabTrait !== 4 || HEAT_BREATH.family !== "Manticore" || !HEAT_BREATH.granted || HEAT_BREATH.learnSkill !== blueLearnSkill(71)) {
    throw new Error("Heat Breath card");
  }
  if (TRIUMPHANT_ROAR.kind !== "triumph" || TRIUMPHANT_ROAR.level !== 71 || TRIUMPHANT_ROAR.mp !== 24 || TRIUMPHANT_ROAR.points !== 3 || TRIUMPHANT_ROAR.cast !== 3 || TRIUMPHANT_ROAR.recast !== 90 || TRIUMPHANT_ROAR.seconds !== 60 || TRIUMPHANT_ROAR.numer !== 38 || TRIUMPHANT_ROAR.str !== 3 || TRIUMPHANT_ROAR.ce !== 320 || TRIUMPHANT_ROAR.ve !== 320 || TRIUMPHANT_ROAR.family !== "Gargouille" || !TRIUMPHANT_ROAR.granted || TRIUMPHANT_ROAR.learnSkill !== blueLearnSkill(71)) {
    throw new Error("Triumphant Roar card");
  }
  if (heatBreathRaw(1046) !== 523 || heatBreathRaw(0) !== 0 || heatBreathRaw(-4) !== 0) throw new Error("Heat Breath raw");
  if (blueAttackMult("Asuran Claws", 0, false, false) !== 1.05 || blueAttackMult("Asuran Claws", 3000, true, true) !== 1.05 || blueSpellFtp("Asuran Claws", 3000, true, true) !== 0.625 || blueSpellFtp("Asuran Claws", 0, false, false) !== 0.625) {
    throw new Error("Asuran Claws attack");
  }
  if (blueChainProps("Asuran Claws").join(",") !== "Liquefaction,Impaction" || blueAccBonus("Asuran Claws", 3000, false, false) !== 0 || blueAccBonus("Asuran Claws", 3000, true, false) !== 60 || blueAccBonus("Asuran Claws", 0, true, true) !== 70 || blueAccBonus("Foot Kick", 3000, true, true) !== 0) {
    throw new Error("Asuran Claws accuracy");
  }
  if (blueCounter(["Asuran Claws"]) !== 0 || blueCounter(["Enervation", "Asuran Claws"]) !== 0.08 || blueMagicAttackBonus(["Heat Breath"]) !== 0 || blueMagicAttackBonus(["Memento Mori", "Heat Breath"]) !== 20 || blueMagicAttackBonus(["Cursed Sphere", "Heat Breath"]) !== 20 || blueClearMind(["Lowing"]) !== 0 || blueClearMind(["Poison Breath", "Lowing"]) !== 3 || blueSetHp(["Amplification"]) !== -5 || blueSetMp(["Amplification"]) !== 5 || blueSetAgi(["Asuran Claws"]) !== 3 || blueSetStr(["Heat Breath"]) !== 3 || blueSetStr(["Triumphant Roar"]) !== 3 || blueSetHp(["Lowing"]) !== -5) {
    throw new Error("flan family set bonus");
  }
  if (blueSetTraits(["Amplification"]).length !== 0 || blueSetTraits(["Asuran Claws"]).length !== 0 || blueSetTraits(["Lowing"]).length !== 0 || blueSetTraits(["Heat Breath"]).length !== 0 || blueSetTraits(["Triumphant Roar"]).length !== 0 || blueSetTraits(["Enervation", "Asuran Claws"]).map((trait) => trait.name).join(",") !== "Counter" || blueSetTraits(["Poison Breath", "Lowing"]).map((trait) => trait.name).join(",") !== "Clear Mind" || blueSetTraits(["Memento Mori", "Heat Breath"]).map((trait) => trait.name).join(",") !== "Magic Attack Bonus") {
    throw new Error("flan family trait rows");
  }
  if (SICKLE_SLASH.kind !== "physical" || SICKLE_SLASH.level !== 48 || SICKLE_SLASH.mp !== 41 || SICKLE_SLASH.points !== 4 || SICKLE_SLASH.cast !== 0.5 || SICKLE_SLASH.recast !== 20.5 || SICKLE_SLASH.range !== 4.5 || SICKLE_SLASH.hits !== 1 || SICKLE_SLASH.ftp !== 1.5 || SICKLE_SLASH.dCap !== 49 || SICKLE_SLASH.dexMod !== 0.5 || SICKLE_SLASH.strMod !== 0 || SICKLE_SLASH.chain !== "Compression" || SICKLE_SLASH.hp !== -5 || SICKLE_SLASH.setMp !== 15 || SICKLE_SLASH.storeTrait !== 4 || SICKLE_AZURE_CRIT !== 0.35 || SICKLE_MULT !== 2.1 || SICKLE_SLASH.family !== "Spider" || !SICKLE_SLASH.granted || SICKLE_SLASH.learnSkill !== blueLearnSkill(48) || blueLearnSkill(48) !== 116) {
    throw new Error("Sickle Slash card");
  }
  if (SUBZERO_SMASH.kind !== "physical" || SUBZERO_SMASH.level !== 72 || SUBZERO_SMASH.mp !== 44 || SUBZERO_SMASH.points !== 4 || SUBZERO_SMASH.cast !== 1 || SUBZERO_SMASH.recast !== 30 || SUBZERO_SMASH.range !== 5 || SUBZERO_SMASH.cone !== true || SUBZERO_SMASH.hits !== 1 || SUBZERO_SMASH.ftp !== 2 || SUBZERO_SMASH.dCap !== 999 || SUBZERO_SMASH.vitMod !== 0.6 || SUBZERO_SMASH.chain !== "Fragmentation" || SUBZERO_SMASH.hp !== 10 || SUBZERO_SMASH.vit !== 3 || SUBZERO_SMASH.fastTrait !== 4 || SUBZERO_PARA !== 10 || SUBZERO_PARA_SECONDS !== 180 || SUBZERO_MULT !== 1.05 || SUBZERO_SMASH.family !== "Ruszor" || !SUBZERO_SMASH.granted || SUBZERO_SMASH.learnSkill !== blueLearnSkill(72)) {
    throw new Error("Sub-zero Smash card");
  }
  if (SALINE_COAT.kind !== "saline" || SALINE_COAT.level !== 72 || SALINE_COAT.mp !== 66 || SALINE_COAT.points !== 3 || SALINE_COAT.cast !== 3 || SALINE_COAT.recast !== 60 || SALINE_COAT.seconds !== 180 || SALINE_COAT.mdb !== 50 || SALINE_COAT.tick !== 4 || SALINE_COAT.ce !== 1 || SALINE_COAT.ve !== 480 || SALINE_COAT.setMp !== 10 || SALINE_COAT.vit !== 2 || SALINE_COAT.agi !== 2 || SALINE_COAT.defenseTrait !== 4 || SALINE_COAT.family !== "Xzomit" || !SALINE_COAT.granted || SALINE_COAT.learnSkill !== blueLearnSkill(72)) {
    throw new Error("Saline Coat card");
  }
  if (RAM_CHARGE.kind !== "physical" || RAM_CHARGE.level !== 73 || RAM_CHARGE.mp !== 79 || RAM_CHARGE.points !== 4 || RAM_CHARGE.cast !== 0.5 || RAM_CHARGE.recast !== 34.75 || RAM_CHARGE.range !== 4.5 || RAM_CHARGE.hits !== 1 || RAM_CHARGE.ftp !== 1 || RAM_CHARGE.dCap !== 999 || RAM_CHARGE.strMod !== 0.3 || RAM_CHARGE.mndMod !== 0.5 || RAM_CHARGE.chain !== "Fragmentation" || RAM_CHARGE.hp !== 5 || RAM_CHARGE.lizardTrait !== 4 || RAM_FTP_AZURE !== 1.875 || RAM_MULT !== 2.5 || RAM_CHARGE.family !== "Ram" || !RAM_CHARGE.granted || RAM_CHARGE.learnSkill !== blueLearnSkill(73)) {
    throw new Error("Ram Charge card");
  }
  if (TEMPORAL_SHIFT.kind !== "shift" || TEMPORAL_SHIFT.level !== 73 || TEMPORAL_SHIFT.mp !== 48 || TEMPORAL_SHIFT.points !== 5 || TEMPORAL_SHIFT.cast !== 0.5 || TEMPORAL_SHIFT.recast !== 120 || TEMPORAL_SHIFT.radius !== 10 || TEMPORAL_SHIFT.seconds !== 5 || TEMPORAL_SHIFT.ce !== 180 || TEMPORAL_SHIFT.ve !== 1020 || TEMPORAL_SHIFT.hp !== 10 || TEMPORAL_SHIFT.setMp !== 15 || TEMPORAL_SHIFT.attackTrait !== 4 || TEMPORAL_SHIFT.family !== "Hpemde" || !TEMPORAL_SHIFT.granted || TEMPORAL_SHIFT.learnSkill !== blueLearnSkill(73)) {
    throw new Error("Temporal Shift card");
  }
  if (MAGIC_HAMMER.kind !== "hammer" || MAGIC_HAMMER.level !== 74 || MAGIC_HAMMER.mp !== 40 || MAGIC_HAMMER.points !== 4 || MAGIC_HAMMER.cast !== 4 || MAGIC_HAMMER.recast !== 180 || MAGIC_HAMMER.range !== 12 || MAGIC_HAMMER.ftp !== 1.5 || MAGIC_HAMMER.azureFtp !== 0.5 || MAGIC_HAMMER.mndMod !== 0.3 || MAGIC_HAMMER.dStat !== 1 || MAGIC_HAMMER.dCap !== 35 || MAGIC_HAMMER.half !== 60 || MAGIC_HAMMER.low !== -17 || MAGIC_HAMMER.mnd !== 2 || MAGIC_HAMMER.setMp !== -5 || MAGIC_HAMMER.mabTrait !== 4 || MAGIC_HAMMER.family !== "Poroggo" || !MAGIC_HAMMER.granted || MAGIC_HAMMER.learnSkill !== blueLearnSkill(74)) {
    throw new Error("Magic Hammer card");
  }
  if (REACTOR_COOL.kind !== "reactor" || REACTOR_COOL.level !== 74 || REACTOR_COOL.mp !== 28 || REACTOR_COOL.points !== 5 || REACTOR_COOL.cast !== 3 || REACTOR_COOL.recast !== 60 || REACTOR_COOL.seconds !== 120 || REACTOR_COOL.defenseNumer !== 31 || REACTOR_COOL.spike !== 5 || REACTOR_COOL.ce !== 1 || REACTOR_COOL.ve !== 480 || REACTOR_COOL.int !== 3 || REACTOR_COOL.mnd !== 3 || REACTOR_COOL.mabTrait !== 4 || REACTOR_COOL.family !== "Zdei" || !REACTOR_COOL.granted || REACTOR_COOL.learnSkill !== blueLearnSkill(74)) {
    throw new Error("Reactor Cool card");
  }
  if (EXUVIATION.kind !== "exuv" || EXUVIATION.level !== 75 || EXUVIATION.mp !== 40 || EXUVIATION.points !== 4 || EXUVIATION.cast !== 3 || EXUVIATION.recast !== 60 || EXUVIATION.ce !== 640 || EXUVIATION.ve !== 640 || EXUVIATION.hp !== 5 || EXUVIATION.setMp !== 5 || EXUVIATION.chr !== 1 || EXUVIATION.sleepTrait !== 4 || EXUVIATION.family !== "Wamoura" || !EXUVIATION.granted || EXUVIATION.learnSkill !== blueLearnSkill(75)) {
    throw new Error("Exuviation card");
  }
  if (VERTICAL_CLEAVE.kind !== "physical" || VERTICAL_CLEAVE.level !== 75 || VERTICAL_CLEAVE.mp !== 86 || VERTICAL_CLEAVE.points !== 3 || VERTICAL_CLEAVE.cast !== 0.5 || VERTICAL_CLEAVE.recast !== 37.25 || VERTICAL_CLEAVE.range !== 4.5 || VERTICAL_CLEAVE.hits !== 1 || VERTICAL_CLEAVE.ftp !== 3 || VERTICAL_CLEAVE.dCap !== 89 || VERTICAL_CLEAVE.strMod !== 0.5 || VERTICAL_CLEAVE.chain !== "Gravitation" || VERTICAL_CLEAVE.hp !== -5 || VERTICAL_CLEAVE.vit !== 1 || VERTICAL_CLEAVE.setMp !== 5 || VERTICAL_CLEAVE.defenseTrait !== 4 || VERTICAL_CLEAVE.family !== "Euvhi" || !VERTICAL_CLEAVE.granted || VERTICAL_CLEAVE.learnSkill !== blueLearnSkill(75)) {
    throw new Error("Vertical Cleave card");
  }
  if (exuviationBase(0) !== 60 || exuviationBase(600) !== 85 || blueAttackMult("Vertical Cleave", 0, false, false) !== 1.05 || blueAttackMult("Vertical Cleave", 0, true, false) !== 1.05 || blueAttackMult("Vertical Cleave", 1500, true, false) !== 2.1 || blueAttackMult("Vertical Cleave", 3000, true, false) !== 2.2 || blueAttackMult("Vertical Cleave", 0, false, true) !== 2.25 || blueSpellFtp("Vertical Cleave", 3000, true, true) !== 3 || blueChainProps("Vertical Cleave").join(",") !== "Gravitation") {
    throw new Error("cleave and exuviation math");
  }
  if (blueDefenseBonus(["Vertical Cleave"]) !== 0 || blueDefenseBonus(["Grand Slam", "Vertical Cleave"]) !== 10 || blueDefenseBonus(["Terror Touch", "Vertical Cleave"]) !== 10 || blueDefenseBonus(["Saline Coat", "Vertical Cleave"]) !== 10 || blueMagicAttackBonus(["Magic Hammer"]) !== 0 || blueMagicAttackBonus(["Cursed Sphere", "Magic Hammer"]) !== 20 || blueMagicAttackBonus(["Reactor Cool"]) !== 0 || blueMagicAttackBonus(["Magic Hammer", "Reactor Cool"]) !== 20 || blueResistSleep(["Exuviation"]) !== 0 || blueResistSleep(["Wild Carrot", "Exuviation"]) !== 0.1 || blueSetMnd(["Magic Hammer"]) !== 2 || blueSetMp(["Magic Hammer"]) !== -5 || blueSetInt(["Reactor Cool"]) !== 3 || blueSetMnd(["Reactor Cool"]) !== 3 || blueSetHp(["Exuviation"]) !== 5 || blueSetChr(["Exuviation"]) !== 1 || blueSetMp(["Exuviation"]) !== 5 || blueSetHp(["Vertical Cleave"]) !== -5 || blueSetVit(["Vertical Cleave"]) !== 1) {
    throw new Error("aht urhgan set bonus");
  }
  if (blueAttackMult("Sickle Slash", 3000, true, true) !== 2.1 || blueAttackMult("Sub-zero Smash", 0, false, false) !== 1.05 || blueAttackMult("Sub-zero Smash", 3000, true, true) !== 1.05 || blueAttackMult("Ram Charge", 0, true, true) !== 2.5 || blueSpellFtp("Sickle Slash", 3000, true, true) !== 1.5 || blueSpellFtp("Sub-zero Smash", 3000, true, true) !== 2 || blueSpellFtp("Ram Charge", 3000, false, false) !== 1 || blueSpellFtp("Ram Charge", 0, true, false) !== 1 || blueSpellFtp("Ram Charge", 1500, true, false) !== 1.375 || blueSpellFtp("Ram Charge", 3000, true, false) !== 1.75 || blueSpellFtp("Ram Charge", 0, false, true) !== 1.875 || blueSpellFtp("Ram Charge", 750, true, false) !== 1.1875) {
    throw new Error("spider family coefficients");
  }
  if (blueChainProps("Sub-zero Smash").join(",") !== "Fragmentation" || blueChainProps("Ram Charge").join(",") !== "Fragmentation" || blueChainProps("Sickle Slash").join(",") !== "Compression") {
    throw new Error("spider family chains");
  }
  if (blueStoreTp(["Sickle Slash"], 75) !== 0 || blueStoreTp(["Tail Slap", "Sickle Slash"], 68) !== 0 || blueStoreTp(["Tail Slap", "Sickle Slash"], 69) !== 10 || blueFastCast(["Sub-zero Smash"], 75) !== 0 || blueFastCast(["Bad Breath", "Sub-zero Smash"], 71) !== 0 || blueFastCast(["Bad Breath", "Sub-zero Smash"], 72) !== 0.05 || blueDefenseBonus(["Saline Coat"]) !== 0 || blueDefenseBonus(["Grand Slam", "Saline Coat"]) !== 10 || blueDefenseBonus(["Terror Touch", "Saline Coat"]) !== 10 || blueLizardKiller(["Ram Charge"]) !== 0 || blueLizardKiller(["Foot Kick", "Ram Charge"]) !== 0.08 || blueLizardKiller(["Claw Cyclone", "Ram Charge"]) !== 0.08 || blueAttackBonus(["Temporal Shift"]) !== 0 || blueAttackBonus(["Battle Dance", "Temporal Shift"]) !== 10 || blueAttackBonus(["Uppercut", "Temporal Shift"]) !== 10 || blueAttackBonus(["Death Scissors", "Temporal Shift"]) !== 10 || blueAttackBonus(["Spinal Cleave", "Temporal Shift"]) !== 10 || blueSetHp(["Sickle Slash"]) !== -5 || blueSetMp(["Sickle Slash"]) !== 15 || blueSetHp(["Sub-zero Smash"]) !== 10 || blueSetVit(["Sub-zero Smash"]) !== 3 || blueSetMp(["Saline Coat"]) !== 10 || blueSetVit(["Saline Coat"]) !== 2 || blueSetAgi(["Saline Coat"]) !== 2 || blueSetHp(["Ram Charge"]) !== 5 || blueSetHp(["Temporal Shift"]) !== 10 || blueSetMp(["Temporal Shift"]) !== 15) {
    throw new Error("spider family set bonus");
  }
  if (blueSetTraits(["Sickle Slash"]).length !== 0 || blueSetTraits(["Sub-zero Smash"]).length !== 0 || blueSetTraits(["Saline Coat"]).length !== 0 || blueSetTraits(["Ram Charge"]).length !== 0 || blueSetTraits(["Temporal Shift"]).length !== 0 || blueSetTraits(["Tail Slap", "Sickle Slash"]).map((trait) => trait.name).join(",") !== "Store TP" || blueSetTraits(["Bad Breath", "Sub-zero Smash"]).map((trait) => trait.name).join(",") !== "Fast Cast" || blueSetTraits(["Grand Slam", "Saline Coat"]).map((trait) => trait.name).join(",") !== "Defense Bonus" || blueSetTraits(["Terror Touch", "Saline Coat"]).map((trait) => trait.name).join(",") !== "Defense Bonus" || blueSetTraits(["Foot Kick", "Ram Charge"]).map((trait) => trait.name).join(",") !== "Lizard Killer" || blueSetTraits(["Claw Cyclone", "Ram Charge"]).map((trait) => trait.name).join(",") !== "Lizard Killer" || blueSetTraits(["Battle Dance", "Temporal Shift"]).map((trait) => trait.name).join(",") !== "Attack Bonus" || blueSetTraits(["Uppercut", "Temporal Shift"]).map((trait) => trait.name).join(",") !== "Attack Bonus" || blueSetTraits(["Death Scissors", "Temporal Shift"]).map((trait) => trait.name).join(",") !== "Attack Bonus" || blueSetTraits(["Spinal Cleave", "Temporal Shift"]).map((trait) => trait.name).join(",") !== "Attack Bonus") {
    throw new Error("spider family trait rows");
  }
}
