/**
 * Job abilities in the fight, and the passive traits that change a swing.
 *
 * Percent attack and defense bonuses are added together in one /256 term,
 * then floored once.
 */

import { AUTOMATON_OIL, DEFAULT_LOADOUT, FISH_OIL_BROTH, HARE, LEVEL, derive, fitLoadout } from "./content";
import { hitRate } from "./formulas";
import { BLM_ABILITIES } from "./blm";
import { RDM_ABILITIES, composureAccuracy } from "./rdm";
import { WHM_ABILITIES } from "./whm";
import { MNK_ABILITIES, boostSeconds, chakraHeal, dodgeEvasion, focusAccuracy, focusCrit, monkJobLevel } from "./mnk";
import { ACCOMPLICE_RATE, COLLABORATOR_RATE, FLEE_MOVE, HATE_STEAL_MOB, HATE_STEAL_RANGE, STEAL_RANGE, THF_ABILITIES } from "./thf";
import { KONZEN_RANGE, SAM_ABILITIES, hassoStr, samJobLevel, twoHandKind } from "./sam";
import { EAGLE_EYE_RANGE, RNG_ABILITIES, SHADOWBIND_RANGE, VELOCITY_ATTACK, camouflageSeconds } from "./rng";
import { PLD_ABILITIES, SHIELD_BASH_RANGE, coverSeconds, holyCircleBonus, sentinelEnmity, shieldBashDamage } from "./pld";
import { MIJIN_RANGE, NIN_ABILITIES, STANCE_SECONDS, mijinDamage, stanceMods } from "./nin";
import { BRD_ABILITIES } from "./brd";
import { DRK_ABILITIES, LAST_RESORT_NUMER, WEAPON_BASH_RANGE, arcaneCircleBonus, weaponBashDamage } from "./drk";
import { DRG_ABILITIES, HIGH_JUMP_RANGE, JUMP_RANGE, SPIRIT_SURGE_ACC, SPIRIT_SURGE_NUMER, SUPER_JUMP_RANGE, WYVERN_AURA, ancientCircleBonus, highJumpDamage, jumpDamage, spiritLinkCost, spiritSurgeStr } from "./drg";
import { SMN_ABILITIES, elementalSiphonMp } from "./smn";
import { BST_ABILITIES, CHARM_RANGE, GAUGE_RANGE, READY_CHARGES, READY_LEVEL, READY_RANGE, SIC_PET_RANGE, SIC_TP, TAME_CHARM_BONUS, TAME_RANGE, ZETA_REGEN_SECONDS, charmChance, charmDuration, charmLands, formatCharm, gaugeLine, petFoodHeal, rarabMoveByName, readyByName, rewardBiscuit, sicMove, tameChance } from "./bst";
import { BLU_ABILITIES, COCOON_DEFENSE_NUMER } from "./blu";
import { DEPLOY_RANGE, MANEUVERS, PUP_ABILITIES, REPAIR_REGEN, REPAIR_REGEN_SECONDS, isManeuver, repairInstant } from "./pup";
import { castCorsair, rollCombat, type QuickDrawLand } from "./cor";
import { castDancer, CHOCOBO_MOVE } from "./dnc";
import { castScholar } from "./sch";
import { castRune } from "./run";
import { castGeo, colureMelee } from "./geo";
import { fieldFoodAttackBonus, fieldFoodDefenseBonus } from "./fov";
import { PENALTY_25, WAR_ABILITIES, berserkAttackFraction, defenderDefenseFraction, scale256, warcryFraction } from "./war";
import type { JobId } from "./stats";

/** Ability names that can sit on the buff row. Spell buffs are added beside this. */
export type BuffName =
  | "Berserk" | "Defender" | "Warcry" | "Aggressor" | "Retaliation" | "Mighty Strikes" | "Provoke"
  | "Manafont" | "Elemental Seal"
  | "Divine Seal" | "Afflatus Solace" | "Afflatus Misery" | "Benediction"
  | "Chainspell" | "Composure" | "Convert"
  | "Hundred Fists" | "Boost" | "Dodge" | "Focus" | "Chakra" | "Counterstance" | "Chi Blast" | "Footwork"
  | "Sneak Attack" | "Flee" | "Trick Attack" | "Hide" | "Perfect Dodge"
  | "Meikyo Shisui" | "Hasso" | "Seigan" | "Meditate" | "Warding Circle" | "Sekkanoki" | "Third Eye" | "Konzen-ittai"
  | "Sharpshot" | "Barrage" | "Camouflage" | "Unlimited Shot" | "Velocity Shot"
  | "Invincible" | "Holy Circle" | "Sentinel" | "Cover" | "Rampart" | "Majesty"
  | "Yonin" | "Innin"
  | "Soul Voice" | "Pianissimo"
  | "Blood Weapon" | "Arcane Circle" | "Last Resort" | "Souleater" | "Consume Mana"
  | "Spirit Surge" | "Wyvern" | "Ancient Circle" | "Super Jump" | "Spirit Bond"
  | "Astral Flow" | "Apogee"
  | "Familiar" | "Scissor Guard" | "Bubble Curtain"
  | "Azure Lore" | "Burst Affinity" | "Chain Affinity" | "Convergence" | "Diffusion"
  | "Snake Eye" | "Bust"
  | "Corsair's Roll" | "Ninja Roll" | "Hunter's Roll" | "Chaos Roll" | "Magus's Roll" | "Healer's Roll" | "Drachen Roll" | "Choral Roll" | "Monk's Roll" | "Beast Roll" | "Samurai Roll" | "Evoker's Roll" | "Rogue's Roll" | "Warlock's Roll" | "Fighter's Roll" | "Puppet Roll" | "Gallant's Roll" | "Wizard's Roll" | "Dancer's Roll" | "Scholar's Roll" | "Naturalist's Roll" | "Runeist's Roll"
  | "Trance" | "Contradance" | "Finishing Move" | "Building Flourish" | "Wild Flourish" | "Chocobo Jig"
  | "Drain Samba" | "Drain Samba II" | "Drain Samba III" | "Aspir Samba" | "Aspir Samba II" | "Haste Samba"
  | "Tabula Rasa" | "Light Arts" | "Dark Arts" | "Sublimation" | "Sublimation: Complete" | "Stratagem" | "Modus Veritas"
  | "Penury" | "Addendum: White" | "Celerity" | "Accession" | "Rapture"
  | "Parsimony" | "Addendum: Black" | "Alacrity" | "Manifestation" | "Ebullience"
  | "Elemental Sforzo" | "Ignis" | "Gelus" | "Flabra" | "Tellus" | "Sulpor" | "Unda" | "Lux" | "Tenebrae"
  | "Vallation" | "Valiance" | "Swordplay" | "Pflug" | "Embolden" | "Gambit" | "Foil";

export type AbilityContext = {
  recastLeft: number;
  targeted: boolean;
  distance: number;
  mp?: number;
  delay?: number;
  vit?: number;
  mnd?: number;
  maxHp?: number;
  monkLevel?: number;
  monkMain?: boolean;
  seigan?: boolean;
  shield?: number | null;
  pldLevel?: number;
  pldMain?: boolean;
  hp?: number;
  ninLevel?: number;
  ninMain?: boolean;
  brdMain?: boolean;
  drkLevel?: number;
  drkMain?: boolean;
  drgLevel?: number;
  drgMain?: boolean;
  /** A wyvern is already out. Spirit Link and Dismiss need one. Call Wyvern refuses a second. */
  wyvernOut?: boolean;
  /** The wyvern is at full HP. Spirit Link then needs an Empathy merit, which is locked. Dismiss resets Call Wyvern. */
  wyvernFull?: boolean;
  /** Spirit Surge is up. Jump is a sure hit and can inflict Defense Down. Call Wyvern is blocked. */
  surge?: boolean;
  /** Summoner level actually granting Summoner abilities. 0 when Summoner is not equipped. */
  smnLevel?: number;
  smnMain?: boolean;
  /** An avatar or spirit is out. */
  avatarOut?: boolean;
  /** The pet is a spirit. Elemental Siphon refuses an avatar. */
  avatarSpirit?: boolean;
  /** Summoning Magic skill. */
  summoning?: number;
  /** Beastmaster level actually granting Beastmaster abilities. 0 when Beastmaster is not equipped. */
  bstLevel?: number;
  bstMain?: boolean;
  /** Courier Carrie is out. */
  jugOut?: boolean;
  /** Ready charges left on the shared bank. Sic needs all three. */
  jugCharges?: number;
  /** The jug's tactical points. Ready does not read them. */
  jugTp?: number;
  /** Ammo slot. Call Beast reads this. Only Fish Oil Broth is a jug. */
  jugItem?: string | null;
  /** Fish Oil Broth left in the stack. Call Beast spends one. */
  jugLeft?: number;
  /** Pet food stacks in the bag. When set, Reward spends the pin, or the highest level stack if nothing is pinned. */
  foodCounts?: Record<string, number>;
  /** Pinned biscuit id. Null or omitted is no selection. An empty pin falls back to the highest level stack. */
  foodId?: string | null;
  /**
   * A trust feeds a copy of the biscuit you selected.
   * The heal and the regen match that biscuit. The bag is not spent.
   */
  foodCopy?: boolean;
  /** Pet Food Zeta left in the bag. Used only when foodCounts is omitted. The ammo slot is not read. */
  zetaLeft?: number;
  /** The pet's current and maximum HP. Reward restores only the missing HP. */
  petHp?: number;
  petMax?: number;
  /** A charmed quarry is the pet. */
  charmOut?: boolean;
  /** Charm and Tame cannot open. Her jug is out, or a quarry is already charmed. */
  charmBlocked?: boolean;
  /** The charmed quarry's TP. Sic waits for 1000, and still spends the recast below that. */
  charmTp?: number;
  /** Yards from the master to the pet. Omitted stays in range. Sic is 4'. Ready is 5'. */
  petDistance?: number | null;
  /** Charges in the shared Ready bank. Omitted is a full bank. Sic reads this, not the jug's TP. */
  readyCharges?: number;
  /** 0–3. Sic's equal-weight pick. Omitted is Foot Kick. */
  sicRoll?: number;
  /** Character level. Charm duration uses this, not the Beastmaster job level. */
  playerLevel?: number;
  /** Sheet CHR. */
  playerChr?: number;
  /** Sheet INT. Tame uses it where Charm uses CHR. */
  playerInt?: number;
  /** Blue Mage level actually granting Blue Mage abilities. 0 when Blue Mage is not equipped. */
  bluLevel?: number;
  bluMain?: boolean;
  /** Puppetmaster level actually granting Puppetmaster abilities. 0 when Puppetmaster is not equipped. */
  pupLevel?: number;
  pupMain?: boolean;
  /** Animator is in the ranged slot. Maneuvers and Activate need it. */
  animator?: boolean;
  /** Automaton Oil is in the ammo slot. Repair spends one. */
  oilItem?: string | null;
  /** Automaton Oil left in the stack. */
  oilLeft?: number;
  /**
   * A trust uses a copy of the Automaton Oil you have equipped.
   * Repair still needs that oil in the ammo slot. The stack is not spent.
   */
  oilCopy?: boolean;
  /** The automaton's current and maximum HP. Repair restores only the missing HP. */
  autoHp?: number;
  autoMax?: number;
  /** An automaton is already active. */
  automatonOut?: boolean;
  /** Some other pet is out. Activate will not call a second. */
  otherPet?: boolean;
  /** Monster level and CHR. The Tropical Rarab is 75. */
  targetLevel?: number;
  targetChr?: number;
  /** Monster INT. The Tropical Rarab's pool is 58. */
  targetInt?: number;
  /** 1–100. Omitted is a miss, so a test cannot land by accident. Charm and Tame share it. */
  charmRoll?: number;
  /** Added to the next Charm after Tame lands. Gauge never receives it. */
  tameBonus?: number;
  /** Someone besides the player is on the hate list. Tame then has no effect. */
  sharedHate?: boolean;
  /** False when the quarry is down. Unset still allows the attempt, for the older checks. */
  foeAlive?: boolean;
  dmg?: number;
  fstr?: number;
  /** Melee hit percent, 0–100. Jump and High Jump use it. Spirit Surge ignores it. */
  hitChance?: number;
  /** 0–1. Omitted rolls at random. */
  hitRoll?: number;
  twoHand?: boolean;
  /** False when Thief is only the subjob. Unset still allows the main-only steals, for the boot checks. */
  thfMain?: boolean;
  /** Yards to the party member. Null when nobody is targeted. */
  allyDistance?: number | null;
  /** Yards to the monster. Falls back to distance. */
  mobDistance?: number;
  /** The enemy this ability is aimed at, when it is not the training rabbit. */
  targetName?: string;
  /** Steal on that enemy. Null means its pockets were empty. Omitted means the training rabbit. */
  stealFind?: { id: string; found: string } | null;
  /** Mug on that enemy. Null means it had no gil. Omitted means the training rabbit. */
  mugGil?: number | null;
  /** Corsair level actually granting Corsair abilities. 0 when Corsair is not equipped. */
  corLevel?: number;
  corMain?: boolean;
  /** Phantom Rolls already up. Double-Up reads the time remaining. */
  rolls?: { name: string; left: number; power: number }[];
  /** Packed bust indexes. busts is used when the pack is omitted. */
  bustPower?: number;
  busts?: number;
  /** Snake Eye is up. The next die is 1. */
  snake?: boolean;
  /** 1–6. Omitted rolls at random. */
  die?: number;
  /** Main jobs in the party, including the corsair. A subjob does not count. */
  partyJobs?: string[];
  /** Ability names already on recast. Random Deal picks one. */
  waiting?: string[];
  /** Musketoon is equipped. */
  gun?: boolean;
  /** Bronze Bullet is equipped. */
  bullet?: boolean;
  gunDmg?: number;
  bulletDmg?: number;
  agi?: number;
  targetAgi?: number;
  /** Dancer level actually granting Dancer abilities. 0 when Dancer is not equipped. */
  dncLevel?: number;
  dncMain?: boolean;
  tp?: number;
  /** Finishing moves currently stored. */
  finishing?: number;
  trance?: boolean;
  contradance?: boolean;
  chr?: number;
  /** A waltz is aimed at a party member. Self ignores range. */
  waltzAlly?: boolean;
  /** "self", "player", or a trust id. The waltz is centered here. */
  waltzCenter?: string;
  /** Stack of the daze the step would refresh. */
  dazeLevel?: number;
  /** Seconds still left on that daze. */
  dazeLeft?: number;
  /** Sneak is already up. Spectral Jig then does nothing. */
  sneak?: boolean;
  /** Flee is already up. A chocobo jig then does nothing. */
  flee?: boolean;
  /** A skillchain is already open. Wild Flourish then has no effect. */
  chainOpen?: boolean;
  /** 0–1. Violent Flourish's stun length. Omitted is the middle of 1–7 seconds. */
  stunRoll?: number;
  /** Scholar level actually granting Scholar abilities. 0 when Scholar is not equipped. */
  schLevel?: number;
  schMain?: boolean;
  lightArts?: boolean;
  darkArts?: boolean;
  tabula?: boolean;
  /** Stratagem charges currently stored. */
  charges?: number;
  /** MP already stored by Sublimation. */
  sublimation?: number;
  sublimationComplete?: boolean;
  /** Seconds left on a Helix on the foe. */
  helixLeft?: number;
  /** Modus Veritas has already doubled this helix. */
  helixModus?: boolean;
  /** Rune Fencer level actually granting Rune Fencer abilities. 0 when Rune Fencer is not equipped. */
  runLevel?: number;
  runMain?: boolean;
  runes?: { name: string; left: number; power: number }[];
  /** Main-hand combat skill. Swipe and Lunge read it. */
  combatSkill?: number;
  /** Divine Magic skill. Vivacious Pulse reads it. */
  divine?: number;
  str?: number;
  dex?: number;
  int?: number;
  /** Shadows on the target in front of Swipe and Lunge. This foe has none. */
  shadows?: number;
  /** HP Lunge is hitting. Omitted spends every element. */
  targetHp?: number | null;
  /** Geomancer level granting the abilities. 0 when Geomancer is not equipped. */
  geoLevel?: number;
  geoMain?: boolean;
  luopan?: boolean;
  luopanHp?: number;
  luopanMax?: number;
  luopanMp?: number;
  bolster?: boolean;
  eclipticOn?: boolean;
  lastingOn?: boolean;
};

export type AbilityResult = {
  ok: boolean;
  text: string;
  recast?: number;
  buff?: { name: BuffName; duration: number; hold?: boolean; power?: number };
  hate?: { ce: number; ve: number };
  /** Tabula Rasa restores the stratagem bank to this many charges. */
  charges?: number;
  /** Second Sublimation. MP to return. */
  sublimationMp?: number;
  /** Modus Veritas halves the helix still on the foe. */
  helixCut?: boolean;
  /** A stratagem spent a charge. */
  spend?: boolean;
  claims?: boolean;
  convert?: boolean;
  fullHeal?: boolean;
  heal?: number;
  eagle?: boolean;
  shadowbind?: boolean;
  bash?: number;
  /** Quick Draw. The store applies sleep, dispel, and a deepen of a debuff already on the foe. */
  quickDraw?: QuickDrawLand;
  stun?: boolean;
  ko?: boolean;
  tpGrant?: number;
  replaces?: string[];
  /** The other stance, or the paired Thief hate steal, shares this recast. */
  share?: string[];
  /** Fraction of the target's CE and VE that moves onto the user. */
  steal?: number;
  /** An item lifted off the enemy. The store puts it in the bag. */
  taken?: { id: string; found: string };
  /** Gil lifted off the enemy. The store adds it. */
  takenGil?: number;
  /** Call Wyvern. The store summons the pet and puts the Wyvern aura up. */
  wyvernCall?: boolean;
  /** Dismiss, or Spirit Surge absorbing the pet. */
  wyvernDismiss?: boolean;
  /** Dismiss while the wyvern is at full HP. The store clears Call Wyvern's recast. */
  callWyvernReady?: boolean;
  /** Spirit Link's HP price, before Stoneskin. The store spends Stoneskin first and heals from the HP that was lost. */
  linkCost?: number;
  /** Spirit Surge. The store dismisses the pet, raises maximum HP, heals, and clears the jump recasts. */
  surgeAbsorb?: boolean;
  jumpKind?: "jump" | "high" | "super";
  jumpHit?: boolean;
  jumpDmg?: number;
  /** Jump during Spirit Surge. Defense Down −20% for 60 seconds. A stronger one is not replaced. */
  defenseDown?: boolean;
  /** High Jump keeps this fraction of CE and VE. 0.5 main, 0.7 sub. Applied before damage hate. */
  enmityKeep?: number;
  /** Super Jump sets cumulative enmity to 1 when a row already exists. */
  ceToOne?: boolean;
  /** Super Jump during Spirit Surge. Halve the enmity of the nearest person behind you. */
  halveBehind?: boolean;
  /** High Jump during Spirit Surge. Target TP lost. */
  tpCut?: number;
  /** Elemental Siphon's MP. The store adds it. */
  siphonMp?: number;
  /** Release. */
  avatarRelease?: boolean;
  /** Retreat. The avatar is ordered back. Top hate sends it in again. */
  avatarHeel?: boolean;
  /** Assault. The avatar attacks the foe. This is not the Engage command. */
  avatarAssault?: boolean;
  /** Call Beast, or Bestial Loyalty. The store calls Courier Carrie. */
  jugCall?: "call" | "loyalty";
  /** Leave. */
  jugLeave?: boolean;
  /** Fight, Heel, or Stay. */
  jugStance?: "fight" | "heel" | "stay";
  /** A Ready move. The store spends the charges. Ready itself has no ability recast. */
  jugReady?: "Bubble Shower" | "Bubble Curtain" | "Big Scissors" | "Scissor Guard" | "Metallic Body";
  /** Sic on a charmed pet. The store spends the Ready bank. A queued order waits for 1000 TP. */
  sic?: { queued: boolean; move?: "Foot Kick" | "Whirl Claws" | "Dust Cloud" | "Wild Carrot" };
  /** Snarl. The store moves 99% of the master's enmity onto the jug. */
  jugSnarl?: boolean;
  /** Familiar. The store raises the jug's maximum HP, or adds 30 minutes to a charm. */
  familiar?: boolean;
  /** Charm landed. The store keeps the quarry and does not let it swing. */
  charmKeep?: boolean;
  charmSeconds?: number;
  /** Hearts travel on a land and break apart on a miss. */
  charmFx?: "land" | "miss";
  /** A landed charm still stores the enmity, without the "turns on you" line. */
  quietClaim?: boolean;
  /** Tame landed. The store drops the player's hate and primes the next Charm. */
  tameKeep?: boolean;
  /** Reward. The store spends one biscuit, heals the pet, and starts the regen. A trust copy does not spend the bag. */
  reward?: { heal: number; restored: number; regen: number; seconds: number; remain: number; on: "jug" | "charm"; ve: number; foodId: string; copy?: boolean };
  /** Activate, or Deus Ex Automata when nothing is out. Fraction of max HP. */
  automatonCall?: number;
  /** Deactivate. */
  automatonDismiss?: boolean;
  /** Deploy or Retrieve. */
  automatonOrder?: "fight" | "heel";
  /** Repair. The store spends one Automaton Oil, restores 10% HP, and starts the mend. A trust copy does not spend the stack. */
  automatonRepair?: { instant: number; regen: number; seconds: number; remain: number; copy?: boolean };
  /** Overdrive. Maneuver bonuses double for 3 minutes. */
  automatonOverdrive?: boolean;
  /** A maneuver element placed on the automaton. Not a master buff. */
  maneuver?: "fire" | "ice" | "wind" | "earth" | "thunder" | "water" | "light" | "dark";
  /** Shared recast when it is not the ability's own recast. An 11 from Double-Up uses 0. */
  shareRecast?: number;
  /** A Phantom Roll or Double-Up. The store keeps the old duration on a Double-Up. */
  roll?: { name: string; power: number; duration: number; keep: boolean; bust: boolean; remove: boolean };
  /** Fold, or the bust left behind by Double-Up. */
  fold?: { name: string | null; bustPower: number };
  /** Snake Eye was spent on this die. */
  consumeSnake?: boolean;
  /** Wild Card. One-hour abilities reset only when the die is 5 or 6. */
  wildCard?: { resetSp: boolean };
  /** Random Deal. Null when nothing was waiting. */
  randomDeal?: string | null;
  /** Fraction of maximum MP restored. Wild Card's 5 and 6. */
  mpFrac?: number;
  /** The rune bank after a rune or a spender. The store replaces every rune buff. */
  runes?: { name: BuffName; duration: number; power: number }[];
  /** Vivacious Pulse MP, when a dark rune is harbored. */
  mpHeal?: number;
  /** Swipe or Lunge spent a shadow instead of dealing damage. */
  shadowPop?: boolean;
  /** Gambit. The store puts the element on the foe. The extra damage is not rolled. */
  gambit?: { element: string; power: number; left: number };
  /** TP a dance spends. Trance makes this absent. */
  tpSpend?: number;
  /** Divine Waltz. The caster's heal is `heal`. Party members inside 9.9' get the same amount. */
  partyHeal?: boolean;
  /** Violent Flourish. A landed hit stuns for 1 to 7 seconds. */
  stunSeconds?: number;
  /** Healing Waltz. One ailment, not Doom, Amnesia, or Petrification. */
  eraseOne?: boolean;
  /** Desperate Flourish. Gravity for 60 seconds and evasion −10. */
  weight?: boolean;
  /** Spectral Jig grants Sneak and Invisible. Chocobo Jig is also a buff. Chocobo Jig II is the same buff on the party. */
  jig?: "spectral" | "chocobo" | "chocobo2";
  daze?: { name: string; seconds: number; level?: number; cap?: number; evaDown?: number; defenseCut?: number; mevaDown?: number; text: string };
  /** Finishing moves left after a flourish. 0 removes the stack. */
  finishingLeft?: number;
  /** Which flourish landed. */
  flourish?: "animated" | "desperate" | "violent" | "reverse" | "building" | "wild";
  /** Violent Flourish connected. The store deals one non-crit hit. */
  strike?: boolean;
  /** Wild Flourish put Chainbound on the foe. */
  chainbound?: boolean;
  /** Waltz landing. The store heals or cleanses from this. `heal` stays for the cast line. */
  waltz?: {
    name: string;
    kind: "cure" | "divine" | "healing";
    main: boolean;
    chr: number;
    contradance: boolean;
    center: string;
    aoe?: boolean;
  };
};

type MeleeSheet = {
  attackFlat: number;
  defenseFlat: number;
  smite: number;
  accuracy: number;
  evasion: number;
  crit: number;
  pdifCap: number;
  warLevel?: number;
  job?: JobId;
  sub?: JobId | null;
  subLevel?: number;
  skillName?: string;
  delay?: number;
  stealth?: number;
};

type MeleeBuff = string | { name: string; left?: number; power?: number; song?: { family?: string }; attr?: string; mind?: number; skip?: string };

type MeleeMods = {
  attack: number;
  defense: number;
  accuracy: number;
  evasion: number;
  hit: number;
  crit: number;
  foeCrit: number;
  pdifCap: number;
  move: number;
  retaliation: number;
};

/**
 * Warrior job abilities in the fight, and the passive traits that change a swing.
 *
 * Percent attack and defense bonuses are added together in one /256 term,
 * then floored once. Berserk, Defender, and Warcry are that kind of term.
 * Monk's Boost is the next-swing ability, not an attack bonus, so it
 * does not add to this term and it does not block Warcry.
 *
 * Retaliation's chance follows the delay line quoted from the Japanese wiki
 * and the 2009 write-up BG-Wiki cites: about 50% at delay 200, about 20%
 * at delay 999, straight between those ends. A one-handed sword near
 * delay 230 is about 49%. A two-handed weapon near delay 480–504 is
 * about 39–40%. The 2009 Brass Jadagna sample does not sit on this line.
 */const PROVOKE_RANGE = 17.8; /** Volatile enmity lost per second. Provoke's page: 30 seconds × 60 = 1800. */const VE_DECAY = 60;
/**
 * Retaliation chance from main-hand delay.
 * 50% at delay 200, 20% at delay 999. Clamped to that span.
 */
function retaliationRate(delay: number): number {
  const d = Math.min(999, Math.max(200, delay));
  return 0.5 - (d - 200) * 0.3 / 799;
}
/** Movement is a separate term from gear. Gear in the yard is 0, so this is −14%. */
const RETALIATION_MOVE = -0.14;























































































const BY_NAME = new Map(WAR_ABILITIES.map((ability) => [ability.name, ability]));
const BLM_BY_NAME = new Map(BLM_ABILITIES.map((ability) => [ability.name, ability]));
const WHM_BY_NAME = new Map(WHM_ABILITIES.map((ability) => [ability.name, ability]));
const RDM_BY_NAME = new Map(RDM_ABILITIES.map((ability) => [ability.name, ability]));
const MNK_BY_NAME = new Map(MNK_ABILITIES.map((ability) => [ability.name, ability]));
const THF_BY_NAME = new Map(THF_ABILITIES.map((ability) => [ability.name, ability]));
const SAM_BY_NAME = new Map(SAM_ABILITIES.map((ability) => [ability.name, ability]));
const RNG_BY_NAME = new Map(RNG_ABILITIES.map((ability) => [ability.name, ability]));
const PLD_BY_NAME = new Map(PLD_ABILITIES.map((ability) => [ability.name, ability]));
const NIN_BY_NAME = new Map(NIN_ABILITIES.map((ability) => [ability.name, ability]));
const BRD_BY_NAME = new Map(BRD_ABILITIES.map((ability) => [ability.name, ability]));
const DRK_BY_NAME = new Map(DRK_ABILITIES.map((ability) => [ability.name, ability]));
const DRG_BY_NAME = new Map(DRG_ABILITIES.map((ability) => [ability.name, ability]));
const SMN_BY_NAME = new Map(SMN_ABILITIES.map((ability) => [ability.name, ability]));
const BST_BY_NAME = new Map(BST_ABILITIES.map((ability) => [ability.name, ability]));
const PUP_BY_NAME = new Map(PUP_ABILITIES.map((ability) => [ability.name, ability]));
const BLU_BY_NAME = new Map(BLU_ABILITIES.map((ability) => [ability.name, ability]));

function abilityByName(name: string) {
  return BY_NAME.get(name);
}

function meleeStats(
  sheet: MeleeSheet,
  buffs: readonly MeleeBuff[],
  protectDef = 0,
  bonusAcc = 0,
  evasionDown = 0,
  behind = false,
): MeleeMods {
  const named = buffs.map((buff) =>
  typeof buff === "string" ?
  { name: buff, left: STANCE_SECONDS, power: 0, family: "", attr: undefined as string | undefined, mind: 0, skip: undefined as string | undefined } :
  { name: buff.name, left: buff.left ?? STANCE_SECONDS, power: buff.power ?? 0, family: buff.song?.family ?? "", attr: buff.attr, mind: buff.mind ?? 0, skip: buff.skip }
  );
  const up = new Set(named.map((buff) => buff.name));
  const warLv = sheet.warLevel ?? LEVEL;
  let attackNumer = sheet.smite;
  let defenseNumer = 0;
  if (up.has("Berserk")) {
    attackNumer += Math.round(berserkAttackFraction(warLv) * 256);
    defenseNumer -= PENALTY_25;
  }
  if (up.has("Defender")) {
    defenseNumer += Math.round(defenderDefenseFraction(warLv) * 256);
    attackNumer -= PENALTY_25;
  }
  if (up.has("Warcry")) attackNumer += Math.round(warcryFraction(warLv) * 256);
  for (const buff of named) {
    if (buff.name === "Crimson Howl") attackNumer += buff.power;
    if (buff.name === "Shining Ruby") defenseNumer += buff.power;
  }
  if (up.has("Last Resort")) {
    attackNumer += LAST_RESORT_NUMER;
    defenseNumer -= LAST_RESORT_NUMER;
  }
  if (up.has("Wyvern")) {
    attackNumer += WYVERN_AURA;
    defenseNumer += WYVERN_AURA;
  }
  if (up.has("Spirit Surge")) {
    attackNumer += SPIRIT_SURGE_NUMER;
    defenseNumer += SPIRIT_SURGE_NUMER;
  }
  if (up.has("Counterstance")) defenseNumer -= 128;
  if (up.has("Defense Boost")) {
    const row = named.find((buff) => buff.name === "Defense Boost");
    defenseNumer += row && row.power > 0 ? row.power : COCOON_DEFENSE_NUMER;
  }
  for (const buff of named) {
    if (buff.name === "Attack Boost") attackNumer += buff.power;
  }
  let evasionBoost = 0;
  let accuracyBoost = 0;
  for (const buff of named) {
    if (buff.name === "Evasion Boost") evasionBoost += buff.power;
    if (buff.name === "Accuracy Boost") accuracyBoost += buff.power;
  }
  if (up.has("Velocity Shot")) attackNumer -= VELOCITY_ATTACK;
  const mnkLv = monkJobLevel(sheet.job ?? "WAR", sheet.sub ?? null, sheet.subLevel ?? 0, LEVEL);
  const samLv = samJobLevel(sheet.job ?? "WAR", sheet.sub ?? null, sheet.subLevel ?? 0, LEVEL);
  const hasso = up.has("Hasso") && twoHandKind(sheet.skillName ?? "");
  const stance = stanceMods(named, behind);
  let songAttack = 0;
  let songDefense = 0;
  let songAcc = 0;
  let songEva = 0;
  let mazurka = 0;
  for (const buff of named) {
    if (buff.family === "minuet") songAttack += buff.power;else
    if (buff.family === "minne") songDefense += buff.power;else
    if (buff.family === "madrigal") songAcc += buff.power;else
    if (buff.family === "mambo") songEva += buff.power;else
    if (buff.family === "mazurka") mazurka = Math.max(mazurka, buff.power);
  }
  let colureAcc = 0;
  let colureEva = 0;
  let colureFlat = 0;
  let colureDef = 0;
  for (const buff of named) {
    const colure = colureMelee(buff.name, buff.power);
    attackNumer += colure.attackNumer;
    defenseNumer += colure.defenseNumer;
    colureFlat += colure.attackFlat;
    colureDef += colure.defenseFlat;
    colureAcc += colure.accuracy;
    colureEva += colure.evasion;
  }
  let attackFlat = sheet.attackFlat + songAttack + colureFlat;
  let glitterDex = 0;
  let glitterVit = 0;
  let glitterAgi = 0;
  for (const buff of named) {
    if (buff.name !== "Glittering Ruby") continue;
    if (buff.attr === "STR") attackFlat += buff.power;
    else if (buff.attr === "DEX") glitterDex += Math.floor(buff.power * 0.75);
    else if (buff.attr === "VIT") glitterVit += Math.floor(buff.power * 1.5);
    else if (buff.attr === "AGI") glitterAgi += Math.floor(buff.power / 2);
  }
  for (const buff of named) {
    if (buff.name !== "Ecliptic Growl") continue;
    if (buff.skip !== "STR") attackFlat += buff.power;
    if (buff.skip !== "DEX") glitterDex += Math.floor(buff.power * 0.75);
    if (buff.skip !== "VIT") glitterVit += Math.floor(buff.power * 1.5);
    if (buff.skip !== "AGI") glitterAgi += Math.floor(buff.mind / 2);
  }
  if (hasso) attackFlat += hassoStr(samLv);
  const surge = named.find((buff) => buff.name === "Spirit Surge");
  if (surge) attackFlat += surge.power;
  const rolled = rollCombat(named);
  attackNumer += rolled.attackNumer;
  defenseNumer += rolled.defenseNumer;
  const accuracy = sheet.accuracy + (up.has("Aggressor") ? 25 : 0) + Math.max(0, bonusAcc) + (up.has("Composure") ? composureAccuracy(LEVEL) : 0) + (up.has("Focus") ? focusAccuracy(mnkLv) : 0) + (hasso ? 10 : 0) + stance.acc + songAcc + (surge ? SPIRIT_SURGE_ACC : 0) + glitterDex + accuracyBoost + rolled.acc + (named.find((buff) => buff.name === "Swordplay")?.power ?? 0) + colureAcc;
  const evasion = sheet.evasion - (up.has("Aggressor") ? 25 : 0) + (up.has("Dodge") ? dodgeEvasion(mnkLv) : 0) + stance.eva + songEva + glitterAgi + evasionBoost + rolled.eva + (named.find((buff) => buff.name === "Swordplay")?.power ?? 0) + (named.find((buff) => buff.name === "Foil")?.power ?? 0) + colureEva;
  const flatDefense = sheet.defenseFlat + Math.max(0, protectDef) + songDefense + glitterVit + colureDef;
    const songMove = Math.max(0, mazurka) / 100;
    const quickMove = up.has("Chocobo Jig") && !up.has("Flee") ? CHOCOBO_MOVE : 0;
    const travel = Math.min(0.2, quickMove + songMove);
    const attack = scale256(attackFlat, attackNumer) + fieldFoodAttackBonus(named, scale256(attackFlat, attackNumer));
    const defense = scale256(flatDefense, defenseNumer) + fieldFoodDefenseBonus(named, scale256(flatDefense, defenseNumer));
    return {
    attack,
    defense,
    accuracy,
    evasion,
    hit: hitRate(accuracy, HARE.evasion - Math.max(0, Math.floor(evasionDown)), HARE.level - LEVEL),
    crit: up.has("Mighty Strikes") ? 100 : sheet.crit + (up.has("Focus") ? focusCrit(mnkLv) : 0) + stance.crit + rolled.crit,
    foeCrit: stance.foeCrit,
    pdifCap: sheet.pdifCap,
    move: Math.min(
      1.6,
      1 + (
      up.has("Retaliation") ? RETALIATION_MOVE : 0) + (
      up.has("Flee") ? FLEE_MOVE : 0) +
      travel + (
      up.has("Invisible") ? sheet.stealth ?? 0 : 0)
    ),
    retaliation: up.has("Retaliation") ? retaliationRate(sheet.delay ?? 240) : 0
  };
}

function tryAbility(name: string, ctx: AbilityContext): AbilityResult {
  const rdm = RDM_BY_NAME.get(name);
  if (rdm) {
    if (rdm.level > LEVEL) return { ok: false, text: `${name} is not learned.` };
    if (ctx.recastLeft > 0) return { ok: false, text: `${rdm.name} is not ready.` };
    if (rdm.name === "Convert") {
      if ((ctx.mp ?? 0) <= 0) return { ok: false, text: "Convert cannot be used with no MP." };
      return {
        ok: true,
        text: "Convert swaps your HP and MP. Volatile enmity 80.",
        recast: rdm.recast,
        convert: true,
        hate: { ce: 0, ve: 80 }
      };
    }
    const text =
    rdm.name === "Chainspell" ?
    "Chainspell. Spells keep a short chant and that spell's recast is 0. The land still plays. A recast that was already running stays." :
    "Composure. Accuracy +38. Self-targeted enhancing magic lasts three times as long, up to 30 minutes. Enspell damage is tripled. Spell recast is 25% longer. Volatile enmity 80.";
    return {
      ok: true,
      text,
      recast: rdm.recast,
      buff: rdm.duration > 0 ? { name: rdm.name as BuffName, duration: rdm.duration } : undefined,
      hate: rdm.name === "Composure" ? { ce: 0, ve: 80 } : undefined
    };
  }
  const whm = WHM_BY_NAME.get(name);
  if (whm) {
    if (whm.level > LEVEL) return { ok: false, text: `${name} is not learned.` };
    if (ctx.recastLeft > 0) return { ok: false, text: `${whm.name} is not ready.` };
    if (whm.merit) return { ok: false, text: `${whm.name} is not unlocked.` };
    if (whm.name === "Benediction") {
      return { ok: true, text: "Benediction restores your HP.", recast: whm.recast, fullHeal: true };
    }
    const replaced = whm.name === "Afflatus Solace" ? "Afflatus Misery" : whm.name === "Afflatus Misery" ? "Afflatus Solace" : null;
    const text =
    whm.name === "Divine Seal" ?
    "Divine Seal. The next Cure or Curaga is doubled, then this wears off. Cura would be doubled too, but that amount is not published, so the seal is not spent on it. It does not change undead damage. Volatile enmity 80." :
    whm.name === "Afflatus Solace" ?
    "Afflatus Solace. Afflatus Misery wears off. Cumulative enmity 1, volatile enmity 80." :
    replaced ?
    `${whm.name}. ${replaced} wears off.` :
    `${whm.name}.`;
    return {
      ok: true,
      text,
      recast: whm.recast,
      buff: whm.duration > 0 ? { name: whm.name as BuffName, duration: whm.duration } : undefined,
      hate: whm.name === "Divine Seal" ? { ce: 0, ve: 80 } : whm.name === "Afflatus Solace" ? { ce: 1, ve: 80 } : undefined
    };
  }
  const blm = BLM_BY_NAME.get(name);
  if (blm) {
    if (blm.level > LEVEL) return { ok: false, text: `${name} is not learned.` };
    if (ctx.recastLeft > 0) return { ok: false, text: `${blm.name} is not ready.` };
    const text =
    blm.name === "Elemental Seal" ?
    "Elemental Seal. The next completed spell wears it off. Volatile enmity 80. No flat accuracy bonus is applied." :
    "Manafont. Spells cost no MP while it lasts. A hit cannot break the cast.";
    return {
      ok: true,
      text,
      recast: blm.recast,
      buff: { name: blm.name as BuffName, duration: blm.duration },
      hate: blm.name === "Elemental Seal" ? { ce: 0, ve: 80 } : undefined
    };
  }
  const thf = THF_BY_NAME.get(name);
  if (thf) {
    if (thf.level > LEVEL) return { ok: false, text: `${name} is not learned.` };
    if (ctx.recastLeft > 0) return { ok: false, text: `${thf.name} is not ready.` };
    if (thf.name === "Steal" || thf.name === "Mug") {
      if (!ctx.targeted) return { ok: false, text: `${thf.name} needs a target.` };
      if (ctx.distance > STEAL_RANGE) return { ok: false, text: `${thf.name} is out of range.` };
      const who = ctx.targetName ?? "Tropical Rarab";
      let found = thf.name === "Steal" ? "The Tropical Rarab has nothing to steal." : "The Tropical Rarab has no gil.";
      let taken: { id: string; found: string } | undefined;
      let takenGil: number | undefined;
      if (thf.name === "Steal" && ctx.stealFind) {
        const article = /^[aeiou]/i.test(ctx.stealFind.found) ? "an" : "a";
        found = `You steal ${article} ${ctx.stealFind.found} from the ${who}.`;
        taken = ctx.stealFind;
      } else if (thf.name === "Steal" && ctx.stealFind === null && ctx.targetName) {
        found = `The ${who} has nothing to steal.`;
      } else if (thf.name === "Mug" && ctx.mugGil != null && ctx.targetName) {
        if (ctx.mugGil > 0) {
          found = `You mug ${ctx.mugGil} gil from the ${who}.`;
          takenGil = ctx.mugGil;
        } else found = `The ${who} has no gil.`;
      }
      return {
        ok: true,
        text: `${thf.name}. ${found} Cumulative enmity ${thf.ce}, volatile enmity ${thf.ve}.`,
        recast: thf.recast,
        hate: { ce: thf.ce, ve: thf.ve },
        claims: true,
        ...(taken ? { taken } : {}),
        ...(takenGil ? { takenGil } : {})
      };
    }
    if (thf.name === "Accomplice" || thf.name === "Collaborator") {
      if (ctx.thfMain === false) return { ok: false, text: `${thf.name} requires Thief as the main job.` };
      const rate = thf.name === "Accomplice" ? ACCOMPLICE_RATE : COLLABORATOR_RATE;
      const other = thf.name === "Accomplice" ? "Collaborator" : "Accomplice";
      if (ctx.allyDistance == null) return { ok: false, text: `${thf.name} needs a party member.` };
      if (ctx.allyDistance > HATE_STEAL_RANGE) return { ok: false, text: `${thf.name} is out of range.` };
      if ((ctx.mobDistance ?? ctx.distance) > HATE_STEAL_MOB) return { ok: false, text: `${thf.name} is too far from the monster.` };
      const pct = Math.round(rate * 100);
      return {
        ok: true,
        text: `${thf.name}. ${pct}% of that party member's enmity comes to you. The other ability shares this recast.`,
        recast: thf.recast,
        share: [other],
        steal: rate,
      };
    }
    const hate = thf.ce !== 0 || thf.ve !== 0 ? { ce: thf.ce, ve: thf.ve } : undefined;
    const hold = thf.name === "Hide";
    return {
      ok: true,
      text: thf.name === "Sneak Attack" ?
      "Sneak Attack. The next auto-attack, or the first hit of a physical weapon skill, crits from behind. Hide lets that land from any side. Thief main adds DEX to that first hit. A frontal swing does not spend it." :
      thf.name === "Trick Attack" ?
      "Trick Attack. The next melee round, struck from behind a party member, cannot miss. That enmity goes to the member in front. Thief main adds AGI. Assassin makes it critical. A swing with nobody in front does not spend it. Ranged attacks do not spend it." :
      `${thf.name}.`,
      recast: thf.recast,
      buff: thf.duration > 0 || hold ? { name: thf.name as BuffName, duration: hold ? 1 : thf.duration, hold } : undefined,
      hate
    };
  }
  const sam = SAM_BY_NAME.get(name);
  if (sam) {
    if (sam.level > LEVEL) return { ok: false, text: `${name} is not learned.` };
    if (ctx.recastLeft > 0) return { ok: false, text: `${sam.name} is not ready.` };
    if (sam.name === "Konzen-ittai") {
      if (!ctx.targeted) return { ok: false, text: "Konzen-ittai needs a target." };
      if (ctx.distance > KONZEN_RANGE) return { ok: false, text: "Konzen-ittai is out of range." };
    }
    const hate = sam.ce !== 0 || sam.ve !== 0 ? { ce: sam.ce, ve: sam.ve } : undefined;
    const recast = sam.name === "Third Eye" && ctx.seigan ? 30 : sam.recast;
    const text =
    sam.name === "Meikyo Shisui" ?
    "Meikyo Shisui. TP is 3000. The next weapon skills cost 1000, and the fTP uses the TP you still have. Melee TP stops. Meditate does not." :
    sam.name === "Hasso" ?
    "Hasso. Seigan wears off. A two-handed weapon gains STR, accuracy +10, and haste." :
    sam.name === "Seigan" ?
    "Seigan. Hasso wears off. Third Eye recasts in 30 seconds." :
    sam.name === "Meditate" ?
    "Meditate. TP lands now, then every 3 seconds." :
    sam.name === "Warding Circle" ?
    "Warding Circle. Against a demon, damage dealt rises and damage taken falls. The Tropical Rarab is not a demon." :
    sam.name === "Sekkanoki" ?
    "Sekkanoki. The next weapon skill spends 1000 TP. The fTP still uses the TP you have." :
    sam.name === "Third Eye" ?
    "Third Eye. The next physical hit misses." :
    sam.name === "Konzen-ittai" ?
    "Konzen-ittai. The target is readied for a skillchain." :
    `${sam.name}.`;
    return {
      ok: true,
      text,
      recast,
      buff: sam.duration > 0 ? { name: sam.name as BuffName, duration: sam.duration } : undefined,
      hate,
      ...(sam.name === "Meikyo Shisui" ? { tpGrant: 3000 } : {})
    };
  }
  const mnk = MNK_BY_NAME.get(name);
  if (mnk) {
    if (mnk.level > LEVEL) return { ok: false, text: `${name} is not learned.` };
    if (ctx.recastLeft > 0) return { ok: false, text: `${mnk.name} is not ready.` };
    if (mnk.name === "Chi Blast") {
      if (!ctx.targeted) return { ok: false, text: "Chi Blast needs a target." };
      return { ok: true, text: "Chi Blast. Spirit damage. No level-75 multiplier is printed, so nothing is rolled.", recast: mnk.recast };
    }
    if (mnk.name === "Chakra") {
      const healed = chakraHeal(ctx.monkLevel ?? LEVEL, ctx.vit ?? 0, ctx.maxHp ?? 0);
      const status = ctx.monkMain ? " Blind, Poison, and Taint would be removed. This yard has no status list." : " A subjob does not remove status.";
      return {
        ok: true,
        text: `Chakra restores ${healed} HP.${status} Volatile enmity 320.`,
        recast: mnk.recast,
        heal: healed,
        hate: { ce: mnk.ce, ve: mnk.ve }
      };
    }
    const duration = mnk.name === "Boost" ? boostSeconds(ctx.delay ?? 348) : mnk.duration;
    const hate = mnk.ce !== 0 || mnk.ve !== 0 ? { ce: mnk.ce, ve: mnk.ve } : undefined;
    return {
      ok: true,
      text: `${mnk.name}.`,
      recast: mnk.recast,
      buff: duration > 0 ? { name: mnk.name as BuffName, duration } : undefined,
      hate
    };
  }
  const rng = RNG_BY_NAME.get(name);
  if (rng) {
    if (rng.level > LEVEL) return { ok: false, text: `${name} is not learned.` };
    if (ctx.recastLeft > 0) return { ok: false, text: `${rng.name} is not ready.` };
    if (rng.name === "Eagle Eye Shot") {
      if (!ctx.targeted) return { ok: false, text: "Eagle Eye Shot needs a target." };
      if (ctx.distance > EAGLE_EYE_RANGE) return { ok: false, text: "Eagle Eye Shot is out of range." };
      return { ok: true, text: "Eagle Eye Shot.", recast: rng.recast, eagle: true };
    }
    if (rng.name === "Shadowbind") {
      if (!ctx.targeted) return { ok: false, text: "Shadowbind needs a target." };
      if (ctx.distance > SHADOWBIND_RANGE) return { ok: false, text: "Shadowbind is out of range." };
      return {
        ok: true,
        text: "Shadowbind.",
        recast: rng.recast,
        shadowbind: true,
        hate: { ce: rng.ce, ve: rng.ve },
        claims: true
      };
    }
    if (rng.name === "Scavenge") {
      return { ok: true, text: "Scavenge. Nothing was found.", recast: rng.recast };
    }
    const duration = rng.name === "Camouflage" ? camouflageSeconds(Math.random()) : rng.duration;
    const replaces = rng.name === "Barrage" ? ["Unlimited Shot"] : rng.name === "Unlimited Shot" ? ["Barrage"] : undefined;
    const hate = rng.ce !== 0 || rng.ve !== 0 ? { ce: rng.ce, ve: rng.ve } : undefined;
    const text =
    rng.name === "Sharpshot" ?
    "Sharpshot. Ranged accuracy +40. The ranged hit cap is 99%." :
    rng.name === "Velocity Shot" ?
    "Velocity Shot. Ranged attack rises. Melee attack falls. Aiming is quicker. Melee is slower." :
    rng.name === "Camouflage" ?
    "Camouflage." :
    rng.name === "Barrage" ?
    "Barrage. Unlimited Shot wears off. The next ranged attack fires several shots." :
    rng.name === "Unlimited Shot" ?
    "Unlimited Shot. Barrage wears off." :
    `${rng.name}.`;
    return {
      ok: true,
      text,
      recast: rng.recast,
      buff: duration > 0 ? { name: rng.name as BuffName, duration } : undefined,
      hate,
      ...(replaces ? { replaces } : {})
    };
  }
  const pld = PLD_BY_NAME.get(name);
  if (pld) {
    if (pld.merit) return { ok: false, text: `${pld.name} is not unlocked.` };
    if (pld.level > LEVEL) return { ok: false, text: `${name} is not learned.` };
    if (ctx.recastLeft > 0) return { ok: false, text: `${pld.name} is not ready.` };
    const level = ctx.pldLevel ?? LEVEL;
    if (pld.name === "Shield Bash") {
      if (ctx.shield == null) return { ok: false, text: "Shield Bash needs a shield." };
      if (!ctx.targeted) return { ok: false, text: "Shield Bash needs a target." };
      if (ctx.distance > SHIELD_BASH_RANGE) return { ok: false, text: "Shield Bash is out of range." };
      const dmg = shieldBashDamage(level, ctx.shield, Math.random());
      return {
        ok: true,
        text: `Shield Bash hits the ${HARE.name} for ${dmg}. The stun lands. Cumulative enmity 450, volatile enmity 900.`,
        recast: pld.recast,
        hate: { ce: pld.ce, ve: pld.ve },
        claims: true,
        bash: dmg,
        stun: true
      };
    }
    if (pld.name === "Cover") {
      const seconds = coverSeconds(ctx.vit ?? 0, ctx.mnd ?? 0, 0);
      return {
        ok: true,
        text: "Cover. No party member currently has the enemy's attention, so no blow is caught.",
        recast: pld.recast,
        buff: { name: "Cover", duration: seconds },
        hate: { ce: pld.ce, ve: pld.ve }
      };
    }
    const hate = pld.ce !== 0 || pld.ve !== 0 ? { ce: pld.ce, ve: pld.ve } : undefined;
    const paladinMain = ctx.pldMain === true || ctx.pldMain == null && level >= 75;
    const text =
    pld.name === "Invincible" ?
    "Invincible. Physical damage is 0. Magic still lands. Volatile enmity 7200." :
    pld.name === "Holy Circle" ?
    `Holy Circle. Against undead, damage dealt and taken would shift by ${Math.round(holyCircleBonus(paladinMain) * 100)}%. The ${HARE.name} is not undead.` :
    pld.name === "Sentinel" ?
    paladinMain ?
    "Sentinel. Physical damage taken starts at 90% less. Enmity +100." :
    "Sentinel. Physical damage taken starts at 90% less. Enmity +50." :
    pld.name === "Rampart" ?
    "Rampart. Damage taken is 25% less for 30 seconds." :
    pld.name === "Majesty" ?
    "Majesty. Cure is stronger, and Cure and Protect splash." :
    `${pld.name}.`;
    return {
      ok: true,
      text,
      recast: pld.recast,
      buff: pld.duration > 0 ? { name: pld.name as BuffName, duration: pld.duration, ...(pld.name === "Sentinel" ? { power: sentinelEnmity(paladinMain) } : {}) } : undefined,
      hate
    };
  }
  const nin = NIN_BY_NAME.get(name);
  if (nin) {
    if (nin.merit) return { ok: false, text: `${nin.name} is not unlocked.` };
    if (nin.level > LEVEL) return { ok: false, text: `${name} is not learned.` };
    if (ctx.recastLeft > 0) return { ok: false, text: `${nin.name} is not ready.` };
    if (nin.access === "main" && ctx.ninMain !== true) return { ok: false, text: `${nin.name} requires Ninja as the main job.` };
    if (nin.name === "Mijin Gakure") {
      if (!ctx.targeted) return { ok: false, text: "Mijin Gakure needs a target." };
      if (ctx.distance > MIJIN_RANGE) return { ok: false, text: "Mijin Gakure is out of range." };
      const dmg = mijinDamage(ctx.hp ?? 0);
      return {
        ok: true,
        text: `Mijin Gakure hits the ${HARE.name} for ${dmg}. You are knocked out with no Weakness. A Raise returns half your maximum HP.`,
        recast: nin.recast,
        claims: true,
        bash: dmg,
        ko: true
      };
    }
    const replaced = nin.name === "Yonin" ? "Innin" : "Yonin";
    const text = nin.name === "Yonin" ?
    "Yonin. Innin wears off. Enmity rises and accuracy falls. In front of the target, evasion rises and the enemy's critical hit rate falls. Utsusemi enmity becomes 160 CE / 480 VE." :
    "Innin. Yonin wears off. Enmity and evasion fall. From behind the target, accuracy, critical hit rate, and ninjutsu damage rise.";
    return {
      ok: true,
      text,
      recast: nin.recast,
      buff: { name: nin.name as BuffName, duration: nin.duration },
      hate: nin.ce !== 0 || nin.ve !== 0 ? { ce: nin.ce, ve: nin.ve } : undefined,
      replaces: [replaced],
      share: [replaced]
    };
  }
  const brd = BRD_BY_NAME.get(name);
  if (brd) {
    if (brd.merit) return { ok: false, text: `${brd.name} is not unlocked.` };
    if (brd.level > LEVEL) return { ok: false, text: `${name} is not learned.` };
    if (ctx.recastLeft > 0) return { ok: false, text: `${brd.name} is not ready.` };
    if (brd.access === "main" && ctx.brdMain !== true) return { ok: false, text: `${brd.name} requires Bard as the main job.` };
    const text = brd.name === "Soul Voice" ?
    "Soul Voice. Songs cast while it is up are doubled. Lullaby and Virelai last twice as long." :
    "Pianissimo. The next song hits one target. A cast longer than 4 seconds becomes 4.";
    return {
      ok: true,
      text,
      recast: brd.recast,
      buff: { name: brd.name as BuffName, duration: brd.duration },
      hate: brd.ce !== 0 || brd.ve !== 0 ? { ce: brd.ce, ve: brd.ve } : undefined
    };
  }
  const drk = DRK_BY_NAME.get(name);
  if (drk) {
    if (drk.merit) return { ok: false, text: `${drk.name} is not unlocked.` };
    if (drk.level > LEVEL) return { ok: false, text: `${name} is not learned.` };
    if (ctx.recastLeft > 0) return { ok: false, text: `${drk.name} is not ready.` };
    if (drk.access !== "sub" && ctx.drkMain !== true) return { ok: false, text: `${drk.name} requires Dark Knight as the main job.` };
    const level = ctx.drkLevel ?? LEVEL;
    const main = ctx.drkMain === true;
    if (drk.name === "Weapon Bash") {
      if (!ctx.twoHand) return { ok: false, text: "Weapon Bash needs a two-handed weapon." };
      if (!ctx.targeted) return { ok: false, text: "Weapon Bash needs a target." };
      if (ctx.distance > WEAPON_BASH_RANGE) return { ok: false, text: "Weapon Bash is out of range." };
      const dmg = weaponBashDamage(level);
      return {
        ok: true,
        text: `Weapon Bash hits the ${HARE.name} for ${dmg}. The stun lands. Volatile enmity 900.`,
        recast: drk.recast,
        hate: { ce: drk.ce, ve: drk.ve },
        claims: true,
        bash: dmg,
        stun: true
      };
    }
    const text =
    drk.name === "Blood Weapon" ?
    "Blood Weapon. Melee hits drain HP equal to the damage dealt, including Souleater. Volatile enmity 80." :
    drk.name === "Arcane Circle" ?
    `Arcane Circle. Against arcana, damage dealt and taken would shift by ${Math.round(arcaneCircleBonus(main) * 100)}%. The ${HARE.name} is not arcana.` :
    drk.name === "Last Resort" ?
    "Last Resort. Attack +25% and defense −25%. Desperate Blows adds job-ability haste on a two-handed weapon. Volatile enmity 1280." :
    drk.name === "Souleater" ?
    main ?
    "Souleater. A connecting hit spends current HP and adds 10% of it as damage. Stalwart Soul lowers the price. Volatile enmity 1280." :
    "Souleater. A connecting hit spends current HP and adds 5% of it as damage. Volatile enmity 1280." :
    "Consume Mana. The next connecting attack adds 1 damage for every 10 MP, then that MP is gone.";
    return {
      ok: true,
      text,
      recast: drk.recast,
      buff: drk.duration > 0 ? { name: drk.name as BuffName, duration: drk.duration } : undefined,
      hate: drk.ce !== 0 || drk.ve !== 0 ? { ce: drk.ce, ve: drk.ve } : undefined
    };
  }
  const drg = DRG_BY_NAME.get(name);
  if (drg) {
    if (drg.merit) return { ok: false, text: `${drg.name} is not unlocked.` };
    if (drg.level > LEVEL) return { ok: false, text: `${name} is not learned.` };
    if (ctx.recastLeft > 0) return { ok: false, text: `${drg.name} is not ready.` };
    if (drg.access !== "sub" && ctx.drgMain !== true) return { ok: false, text: `${drg.name} requires Dragoon as the main job.` };
    const level = ctx.drgLevel ?? LEVEL;
    const main = ctx.drgMain === true;
    if (drg.name === "Call Wyvern") {
      if (ctx.surge) return { ok: false, text: "Spirit Surge is up. The wyvern cannot be called." };
      if (ctx.wyvernOut) return { ok: false, text: "A wyvern is already out." };
      if (ctx.avatarOut || ctx.jugOut || ctx.charmOut) return { ok: false, text: "You already have a pet." };
      return {
        ok: true,
        text: "Call Wyvern. A wyvern answers. Attack and defense +10% while it lives. Cumulative enmity 1, volatile enmity 300.",
        recast: drg.recast,
        hate: { ce: drg.ce, ve: drg.ve },
        claims: true,
        wyvernCall: true
      };
    }
    if (drg.name === "Dismiss") {
      if (!ctx.wyvernOut) return { ok: false, text: "No wyvern is out." };
      const ready = ctx.wyvernFull === true;
      return {
        ok: true,
        text: ready ? "Dismiss. The wyvern was at full HP, so Call Wyvern is ready." : "Dismiss. The wyvern leaves.",
        recast: drg.recast,
        wyvernDismiss: true,
        callWyvernReady: ready
      };
    }
    if (drg.name === "Spirit Link") {
      if (!ctx.wyvernOut) return { ok: false, text: "Spirit Link needs a wyvern." };
      if (ctx.wyvernFull) return { ok: false, text: "Spirit Link needs a wounded wyvern. Empathy merits, which would allow a full one, are not unlocked." };
      const cost = spiritLinkCost(ctx.hp ?? 0, ctx.hitRoll ?? Math.random());
      return {
        ok: true,
        text: cost > 0 ? `Spirit Link. You offer ${cost} HP. Stoneskin is spent first.` : "Spirit Link. You have no HP to give.",
        recast: drg.recast,
        linkCost: cost
      };
    }
    if (drg.name === "Jump" || drg.name === "High Jump" || drg.name === "Super Jump") {
      const range = drg.name === "Super Jump" ? SUPER_JUMP_RANGE : drg.name === "High Jump" ? HIGH_JUMP_RANGE : JUMP_RANGE;
      if (!ctx.targeted) return { ok: false, text: `${drg.name} needs a target.` };
      if (ctx.distance > range) return { ok: false, text: `${drg.name} is out of range.` };
      if (drg.name === "Super Jump") {
        const surged = ctx.surge === true;
        return {
          ok: true,
          text: surged
            ? "Super Jump. You leave the ground. If you had enmity, cumulative enmity becomes 1. The nearest person behind you loses half their enmity."
            : "Super Jump. You leave the ground. If you had enmity, cumulative enmity becomes 1.",
          recast: drg.recast,
          buff: { name: "Super Jump", duration: drg.duration },
          jumpKind: "super",
          ceToOne: true,
          halveBehind: surged
        };
      }
      const surge = ctx.surge === true;
      const roll = ctx.hitRoll ?? Math.random();
      const chance = ctx.hitChance ?? 75;
      const hit = surge || roll * 100 < chance;
      const dmg = hit ? (drg.name === "High Jump" ? highJumpDamage(ctx.dmg ?? 0, ctx.fstr ?? 0) : jumpDamage(ctx.dmg ?? 0, ctx.fstr ?? 0, ctx.vit ?? 0)) : 0;
      const kind = drg.name === "High Jump" ? "high" : "jump";
      const miss = hit ? "" : " The attack misses.";
      return {
        ok: true,
        text: drg.name === "High Jump"
          ? `High Jump.${miss}${hit ? ` It hits for ${dmg}.` : ""} Enmity is cut. The target gains no TP.`
          : `Jump.${miss}${hit ? ` It hits for ${dmg}.` : ""}${surge && hit ? " Defense Down (−20%) lands." : ""}`,
        recast: drg.recast,
        jumpKind: kind,
        jumpHit: hit,
        jumpDmg: dmg,
        defenseDown: kind === "jump" && surge && hit,
        enmityKeep: kind === "high" ? (main ? 0.5 : 0.7) : undefined,
        tpCut: kind === "high" && surge && hit ? dmg * 2 : undefined
      };
    }
    if (drg.name === "Spirit Surge") {
      if (!ctx.wyvernOut) return { ok: false, text: "Spirit Surge needs a wyvern." };
      return {
        ok: true,
        text: "Spirit Surge. The wyvern is absorbed. Maximum HP rises. Accuracy +50. Attack and defense +25%. Jump recasts reset.",
        recast: drg.recast,
        buff: { name: "Spirit Surge", duration: drg.duration, power: spiritSurgeStr(level) },
        surgeAbsorb: true,
        wyvernDismiss: true
      };
    }
    const text = drg.name === "Ancient Circle"
      ? `Ancient Circle. Against dragons, damage dealt and taken would shift by ${Math.round(ancientCircleBonus(main) * 100)}%. The hare is not a dragon.`
      : "Spirit Bond. Damage the wyvern takes is split evenly for 3 minutes. Healing Breath also heals the wyvern.";
    return {
      ok: true,
      text,
      recast: drg.recast,
      buff: drg.duration > 0 ? { name: drg.name as BuffName, duration: drg.duration } : undefined,
      hate: drg.ce !== 0 || drg.ve !== 0 ? { ce: drg.ce, ve: drg.ve } : undefined
    };
  }
  const smn = SMN_BY_NAME.get(name);
  if (smn) {
    if (smn.merit) return { ok: false, text: `${smn.name} is not unlocked.` };
    if ((ctx.smnLevel ?? 0) < smn.level) return { ok: false, text: `${name} is not learned.` };
    if (ctx.recastLeft > 0) return { ok: false, text: `${smn.name} is not ready.` };
    if (smn.access !== "sub" && ctx.smnMain !== true) return { ok: false, text: `${smn.name} requires Summoner as the main job.` };
    if (smn.name === "Elemental Siphon") {
      if (!ctx.avatarOut || ctx.avatarSpirit !== true) return { ok: false, text: "Elemental Siphon needs a spirit." };
      const gain = elementalSiphonMp(ctx.summoning ?? 0);
      return {
        ok: true,
        text: `Elemental Siphon restores ${gain} MP. The spirit stays.`,
        recast: smn.recast,
        hate: { ce: smn.ce, ve: smn.ve },
        siphonMp: gain,
      };
    }
    if (smn.name === "Release") {
      if (!ctx.avatarOut) return { ok: false, text: "No avatar is out." };
      return { ok: true, text: "Release. The avatar leaves.", avatarRelease: true };
    }
    if (smn.name === "Retreat") {
      if (!ctx.avatarOut) return { ok: false, text: "Retreat needs an avatar." };
      return { ok: true, text: "Retreat. The avatar is called back. It stays back until Assault, or a blood pact aimed at the foe.", recast: smn.recast, avatarHeel: true };
    }
    if (smn.name === "Assault") {
      if (!ctx.avatarOut) return { ok: false, text: "Assault needs an avatar." };
      return {
        ok: true,
        text: "Assault. The avatar attacks. Cumulative enmity 1.",
        recast: smn.recast,
        avatarAssault: true,
        hate: { ce: smn.ce, ve: smn.ve },
        claims: true,
      };
    }
    const text = smn.name === "Astral Flow"
      ? "Astral Flow. Astral blood pacts can be used for 3 minutes. Avatar stats do not rise. Those merit ranks are locked."
      : "Apogee. The next blood pact costs 50% more MP and does not wait on its recast. A ward lasts about 25% less.";
    return {
      ok: true,
      text,
      recast: smn.recast,
      buff: smn.duration > 0 ? { name: smn.name as BuffName, duration: smn.duration } : undefined,
      hate: smn.ce !== 0 || smn.ve !== 0 ? { ce: smn.ce, ve: smn.ve } : undefined,
    };
  }
  const bst = BST_BY_NAME.get(name);
  if (bst) {
    if (bst.merit) return { ok: false, text: `${bst.name} is not unlocked.` };
    if ((ctx.bstLevel ?? 0) < bst.level) return { ok: false, text: `${name} is not learned.` };
    if (ctx.recastLeft > 0) return { ok: false, text: `${bst.name} is not ready.` };
    if (bst.access !== "sub" && ctx.bstMain !== true) return { ok: false, text: `${bst.name} requires Beastmaster as the main job.` };
    const hate = bst.ce !== 0 || bst.ve !== 0 ? { ce: bst.ce, ve: bst.ve } : undefined;
    if (bst.name === "Call Beast" || bst.name === "Bestial Loyalty") {
      if (ctx.bstMain !== true) return { ok: false, text: "A support job cannot equip a jug." };
      if (ctx.wyvernOut || ctx.avatarOut || ctx.jugOut || ctx.charmOut) return { ok: false, text: "You already have a pet." };
      const broth = ctx.jugItem === FISH_OIL_BROTH && (ctx.jugLeft ?? 0) >= 1;
      if (!broth) {
        return {
          ok: false,
          text: `${bst.name} needs Fish Oil Broth in the ammo slot. That jug calls Courier Carrie. Call Beast uses one. Bestial Loyalty leaves the stack. A pebble or an arrow is not a jug.`,
        };
      }
      const loyalty = bst.name === "Bestial Loyalty";
      const left = ctx.jugLeft ?? 0;
      return {
        ok: true,
        text: loyalty
          ? `Bestial Loyalty. Fish Oil Broth stays in the ammo slot. ${left} remain. Courier Carrie is called.`
          : `Call Beast. One Fish Oil Broth is used. ${left - 1} remain. Courier Carrie is called.`,
        recast: bst.recast,
        jugCall: loyalty ? "loyalty" : "call",
      };
    }
    if (bst.name === "Reward") {
      if (ctx.jugOut !== true && ctx.charmOut !== true) return { ok: false, text: "Reward needs a pet." };
      const counts = ctx.foodCounts ?? (ctx.zetaLeft != null ? { "pet-food-zeta": ctx.zetaLeft } : {});
      const food = rewardBiscuit(counts, ctx.foodCounts ? (ctx.foodId ?? null) : "pet-food-zeta");
      const left = food ? (counts[food.id] ?? 0) : 0;
      if (!food || left < 1) {
        return {
          ok: false,
          text: ctx.foodCopy
            ? "Reward needs the pet food you selected. None is in the bag, so it does not fire."
            : "Reward needs pet food in the bag. None is there, so it does not fire.",
        };
      }
      const heal = petFoodHeal(food, ctx.mnd ?? 0);
      const room = Math.max(0, Math.floor(ctx.petMax ?? 0) - Math.floor(ctx.petHp ?? 0));
      const restored = Math.min(heal, room);
      const on = ctx.jugOut === true ? "jug" : "charm";
      const who = on === "jug" ? "Courier Carrie" : `The ${HARE.name}`;
      const hpLine = restored > 0 ? `${who} recovers ${restored} HP.` : `${who} is already at full HP.`;
      if (ctx.foodCopy) {
        return {
          ok: true,
          text: `Reward. ${hpLine} Regen is ${food.regen} HP a tick for 3 minutes. A copy of ${food.name} is used. ${left} remain.`,
          recast: bst.recast,
          reward: { heal, restored, regen: food.regen, seconds: ZETA_REGEN_SECONDS, remain: left, on, ve: bst.ve, foodId: food.id, copy: true },
        };
      }
      return {
        ok: true,
        text: `Reward. ${hpLine} Regen is ${food.regen} HP a tick for 3 minutes. One ${food.name} is used. ${left - 1} remain.`,
        recast: bst.recast,
        reward: { heal, restored, regen: food.regen, seconds: ZETA_REGEN_SECONDS, remain: left - 1, on, ve: bst.ve, foodId: food.id },
      };
    }
    if (bst.name === "Charm") {
      if (ctx.wyvernOut || ctx.avatarOut || ctx.jugOut || ctx.charmOut) return { ok: false, text: "You already have a pet." };
      if (!ctx.targeted) return { ok: false, text: "Charm needs a target." };
      if (ctx.foeAlive === false) return { ok: false, text: "Charm needs a living target." };
      if (ctx.distance > CHARM_RANGE) return { ok: false, text: "Charm is out of range." };
      const playerChr = ctx.playerChr ?? 0;
      const targetChr = ctx.targetChr ?? 0;
      const bonus = ctx.tameBonus ?? 0;
      const chance = charmChance({
        bstLevel: ctx.bstLevel ?? 0,
        targetLevel: ctx.targetLevel ?? 75,
        playerChr,
        targetChr,
        bonus,
      });
      const landed = charmLands(chance, ctx.charmRoll ?? 100);
      const spent = bonus > 0 ? " Tame's 10 was used." : "";
      if (!landed) {
        return {
          ok: true,
          text: `Charm fails.${spent}`,
          recast: bst.recast,
          hate,
          claims: true,
          charmFx: "miss",
        };
      }
      const seconds = charmDuration(playerChr, ctx.playerLevel ?? 75, ctx.targetLevel ?? 75, 0);
      return {
        ok: true,
        text: `Charm. The Tropical Rarab is now under your control for ${formatCharm(seconds)}.${spent}`,
        recast: bst.recast,
        hate,
        claims: true,
        quietClaim: true,
        charmFx: "land",
        charmKeep: true,
        charmSeconds: seconds,
      };
    }
    if (bst.name === "Gauge") {
      if (!ctx.targeted) return { ok: false, text: "Gauge needs a target." };
      if (ctx.foeAlive === false) return { ok: false, text: "Gauge needs a living target." };
      if (ctx.distance > GAUGE_RANGE) return { ok: false, text: "Gauge is out of range." };
      const chance = charmChance({
        bstLevel: ctx.bstLevel ?? 0,
        targetLevel: ctx.targetLevel ?? 75,
        playerChr: ctx.playerChr ?? 0,
        targetChr: ctx.targetChr ?? 0,
      });
      return { ok: true, text: gaugeLine(chance), recast: bst.recast };
    }
    if (bst.name === "Tame") {
      if (ctx.wyvernOut || ctx.avatarOut || ctx.jugOut || ctx.charmOut) return { ok: false, text: "You already have a pet." };
      if (!ctx.targeted) return { ok: false, text: "Tame needs a target." };
      if (ctx.foeAlive === false) return { ok: false, text: "Tame needs a living target." };
      if (ctx.distance > TAME_RANGE) return { ok: false, text: "Tame is out of range." };
      if (ctx.sharedHate) return { ok: true, text: "Tame has no effect. Someone else is on the hate list.", recast: bst.recast };
      const playerInt = ctx.playerInt ?? 0;
      const targetInt = ctx.targetInt ?? 0;
      const chance = tameChance({
        bstLevel: ctx.bstLevel ?? 0,
        targetLevel: ctx.targetLevel ?? 75,
        playerInt,
        targetInt,
      });
      const landed = charmLands(chance, ctx.charmRoll ?? 100);
      if (!landed) {
        return { ok: true, text: `Tame misses. Chance ${chance}. INT ${playerInt} against ${targetInt}.`, recast: bst.recast };
      }
      return {
        ok: true,
        text: `Tame. The Tropical Rarab seems friendlier. Next Charm +${TAME_CHARM_BONUS}. Chance ${chance}. INT ${playerInt} against ${targetInt}.`,
        recast: bst.recast,
        tameKeep: true,
      };
    }
    const petOut = ctx.jugOut === true || ctx.charmOut === true;
    if (bst.name === "Fight" || bst.name === "Heel" || bst.name === "Stay") {
      if (!petOut) return { ok: false, text: "No pet is out." };
      const stance = bst.name === "Fight" ? "fight" : bst.name === "Heel" ? "heel" : "stay";
      return { ok: true, text: `${bst.name}.`, jugStance: stance };
    }
    if (bst.name === "Leave") {
      if (!petOut) return { ok: false, text: "No pet is out." };
      return {
        ok: true,
        text: ctx.jugOut ? "Leave. Courier Carrie is sent away." : "Leave. The Tropical Rarab is released.",
        jugLeave: true,
      };
    }
    if (bst.name === "Sic") {
      if (!petOut) return { ok: false, text: "Sic needs a pet." };
      if (ctx.jugOut) return { ok: false, text: "Sic does not order a jug. Courier Carrie answers to Ready." };
      const bank = ctx.readyCharges ?? READY_CHARGES;
      if (bank < READY_CHARGES) return { ok: false, text: "Sic needs 3 Ready charges." };
      if (ctx.petDistance != null && ctx.petDistance > SIC_PET_RANGE) return { ok: false, text: "Sic is out of range. The master must be within 4' of the pet." };
      if ((ctx.charmTp ?? 0) < SIC_TP) {
        return {
          ok: true,
          text: "Sic. The Tropical Rarab will use a move when it reaches 1000 TP. Recast 0:01:30. Volatile enmity 160.",
          recast: bst.recast,
          hate,
          sic: { queued: true },
        };
      }
      const move = sicMove(ctx.sicRoll ?? 0);
      return {
        ok: true,
        text: `Sic. The Tropical Rarab uses ${move}. Recast 0:01:30. Volatile enmity 160.`,
        recast: bst.recast,
        hate,
        sic: { queued: false, move },
      };
    }
    if (bst.name === "Snarl") {
      if (!petOut) return { ok: false, text: "Snarl needs a pet." };
      if (!ctx.jugOut) return { ok: false, text: "Snarl has no other enemy to draw. The Tropical Rarab is the only quarry." };
      return { ok: true, text: "Snarl. 99% of your enmity moves onto Courier Carrie.", recast: bst.recast, jugSnarl: true };
    }
    if (bst.name === "Familiar") {
      if (!petOut) return { ok: false, text: "Familiar needs a pet." };
      return {
        ok: true,
        text: ctx.charmOut && !ctx.jugOut
          ? "Familiar. Charm lasts another 30 minutes. The rarab keeps its printed HP. Volatile enmity 80."
          : "Familiar. The pet's maximum HP rises by 10%. Base attributes +3 are not folded into the checkparam. Volatile enmity 80.",
        recast: bst.recast,
        buff: { name: "Familiar", duration: bst.duration },
        hate,
        familiar: true,
      };
    }
    return { ok: true, text: `${bst.name}.`, recast: bst.recast, hate };
  }
  const ready = readyByName(name);
  if (ready) {
    if ((ctx.bstLevel ?? 0) < READY_LEVEL) return { ok: false, text: `${ready.name} is not learned.` };
    if (!ctx.jugOut) return { ok: false, text: "Ready needs Courier Carrie." };
    if (ctx.petDistance != null && ctx.petDistance > READY_RANGE) return { ok: false, text: `${ready.name} is out of range. Ready needs the master within 5' of the pet.` };
    if ((ctx.jugCharges ?? 0) < ready.charges) return { ok: false, text: `${ready.name} needs ${ready.charges} Ready ${ready.charges === 1 ? "charge" : "charges"}.` };
    const held = ready.name === "Scissor Guard" || ready.name === "Bubble Curtain" ? ready.name : null;
    return {
      ok: true,
      text: ready.name === "Bubble Shower"
        ? "Bubble Shower. STR −9 for 3 minutes. The damage is the melee stand-in."
        : ready.name === "Big Scissors"
          ? "Big Scissors. One physical hit. Slashing. Skillchain: Scission. The damage is the melee stand-in."
          : ready.name === "Scissor Guard"
            ? "Scissor Guard. Defense +100% for Courier Carrie and you, while the crab is out."
            : ready.name === "Bubble Curtain"
              ? "Bubble Curtain. Magic damage taken −50% for Courier Carrie and you, while the crab is out."
              : "Metallic Body. Stoneskin of about 200 HP for Courier Carrie and you.",
      jugReady: ready.name,
      buff: held ? { name: held, duration: 1, hold: true } : undefined,
    };
  }
  const rabbit = rarabMoveByName(name);
  if (rabbit) {
    if (!ctx.charmOut) return { ok: false, text: `${rabbit.name} needs a charmed quarry.` };
    return { ok: false, text: `A charmed pet chooses ${rabbit.name} through Sic. It is not ordered from the bar.` };
  }
  const blu = BLU_BY_NAME.get(name);
  if (blu) {
    if (blu.merit) return { ok: false, text: `${blu.name} is not unlocked.` };
    if ((ctx.bluLevel ?? 0) < blu.level) return { ok: false, text: `${name} is not learned.` };
    if (ctx.recastLeft > 0) return { ok: false, text: `${blu.name} is not ready.` };
    if (blu.access === "main" && ctx.bluMain !== true) return { ok: false, text: `${blu.name} requires Blue Mage as the main job.` };
    return {
      ok: true,
      text: `${blu.name}.`,
      recast: blu.recast,
      buff: blu.duration > 0 ? { name: blu.name as BuffName, duration: blu.duration } : undefined,
      hate: { ce: blu.ce, ve: blu.ve },
    };
  }
  const pup = PUP_BY_NAME.get(name);
  if (pup) {
    if (pup.merit) return { ok: false, text: `${pup.name} is not unlocked.` };
    if ((ctx.pupLevel ?? 0) < pup.level) return { ok: false, text: `${name} is not learned.` };
    if (ctx.recastLeft > 0) return { ok: false, text: `${pup.name} is not ready.` };
    if (pup.access === "main" && ctx.pupMain !== true) return { ok: false, text: `${pup.name} requires Puppetmaster as the main job.` };
    const maneuver = isManeuver(pup.name);
    const calls = pup.name === "Activate" || pup.name === "Deus Ex Automata";
    const needsPet = maneuver || pup.name === "Overdrive" || pup.name === "Deactivate" || pup.name === "Deploy" || pup.name === "Retrieve" || pup.name === "Repair" || pup.name === "Maintenance";
    const repairCopy = ctx.oilCopy === true && pup.name === "Repair";
    if ((calls || maneuver || needsPet) && ctx.animator !== true && !repairCopy) return { ok: false, text: `${pup.name} needs an Animator equipped.` };
    if (calls) {
      if (ctx.automatonOut) return { ok: false, text: "An automaton is already active." };
      if (ctx.otherPet) return { ok: false, text: "You already have a pet." };
    }
    if (needsPet && ctx.automatonOut !== true) return { ok: false, text: `${pup.name} needs an active automaton.` };
    if (pup.name === "Deploy") {
      if (!ctx.targeted) return { ok: false, text: "Deploy needs a target." };
      if (ctx.distance > DEPLOY_RANGE) return { ok: false, text: "Deploy is out of range." };
      return { ok: true, text: "Deploy. The automaton attacks.", recast: pup.recast, automatonOrder: "fight" };
    }
    if (pup.name === "Activate") return { ok: true, text: "Activate. The automaton is called.", recast: pup.recast, automatonCall: 1 };
    if (pup.name === "Deus Ex Automata") return { ok: true, text: "Deus Ex Automata. The automaton is called at one third HP.", recast: pup.recast, automatonCall: 1 / 3 };
    if (pup.name === "Deactivate") return { ok: true, text: "Deactivate. The automaton is put away.", recast: pup.recast, automatonDismiss: true };
    if (pup.name === "Retrieve") return { ok: true, text: "Retrieve. The automaton returns.", recast: pup.recast, automatonOrder: "heel" };
    if (pup.name === "Repair") {
      const stocked = ctx.oilItem === AUTOMATON_OIL && (ctx.oilLeft ?? 0) >= 1;
      if (!stocked) {
        return {
          ok: false,
          text: ctx.oilCopy ? "Repair needs the Automaton Oil you have equipped." : "Repair needs Automaton Oil equipped in the ammo slot.",
        };
      }
      const instant = repairInstant(ctx.autoMax ?? 0);
      const room = Math.max(0, (ctx.autoMax ?? 0) - (ctx.autoHp ?? 0));
      const restored = Math.min(room, instant);
      const left = ctx.oilLeft ?? 0;
      const now = restored > 0 ? `${restored} HP now` : "The automaton is already at full HP";
      if (ctx.oilCopy) {
        return {
          ok: true,
          text: `Repair. A copy of Automaton Oil is used. ${left} remain. ${now}. Then ${REPAIR_REGEN} HP every 3 seconds for ${REPAIR_REGEN_SECONDS} seconds.`,
          recast: pup.recast,
          automatonRepair: { instant, regen: REPAIR_REGEN, seconds: REPAIR_REGEN_SECONDS, remain: left, copy: true },
        };
      }
      return {
        ok: true,
        text: `Repair. One Automaton Oil is used. ${left - 1} remain. ${now}. Then ${REPAIR_REGEN} HP every 3 seconds for ${REPAIR_REGEN_SECONDS} seconds.`,
        recast: pup.recast,
        automatonRepair: { instant, regen: REPAIR_REGEN, seconds: REPAIR_REGEN_SECONDS, remain: left - 1 },
      };
    }
    if (pup.name === "Overdrive") return { ok: true, text: "Overdrive. Maneuver bonuses are doubled for 3 minutes.", recast: pup.recast, automatonOverdrive: true };
    if (pup.name === "Maintenance") return { ok: true, text: "Maintenance. The automaton has no status ailments.", recast: pup.recast };
    if (maneuver) {
      const element = pup.name.slice(0, pup.name.indexOf(" ")).toLowerCase() as "fire" | "ice" | "wind" | "earth" | "thunder" | "water" | "light" | "dark";
      return { ok: true, text: `${pup.name}. It is placed on the automaton.`, recast: pup.recast, maneuver: element, share: MANEUVERS.filter((row) => row !== pup.name) };
    }
    return { ok: true, text: `${pup.name}. ${pup.effect}`, recast: pup.recast };
  }
  const corsair = castCorsair(name, {
    recastLeft: ctx.recastLeft,
    corLevel: ctx.corLevel ?? 0,
    corMain: ctx.corMain === true,
    rolls: ctx.rolls,
    bustPower: ctx.bustPower,
    busts: ctx.busts,
    snake: ctx.snake,
    die: ctx.die,
    partyJobs: ctx.partyJobs,
    waiting: ctx.waiting,
    targeted: ctx.targeted,
    distance: ctx.distance,
    gun: ctx.gun,
    bullet: ctx.bullet,
    gunDmg: ctx.gunDmg,
    bulletDmg: ctx.bulletDmg,
    agi: ctx.agi,
    targetAgi: ctx.targetAgi,
  });
  if (corsair) {
    if ("buff" in corsair && corsair.buff) {
      const buff = corsair.buff;
      return {
        ...corsair,
        buff: { name: buff.name as BuffName, duration: buff.duration },
      };
    }
    return corsair;
  }
  const dancer = castDancer(name, {
    recastLeft: ctx.recastLeft,
    dncLevel: ctx.dncLevel ?? 0,
    dncMain: ctx.dncMain === true,
    tp: ctx.tp ?? 0,
    finishing: ctx.finishing ?? 0,
    trance: ctx.trance === true,
    contradance: ctx.contradance === true,
    targeted: ctx.targeted,
    distance: ctx.distance,
    chr: ctx.chr ?? ctx.playerChr ?? 0,
    vit: ctx.vit ?? 0,
    hitChance: ctx.hitChance,
    hitRoll: ctx.hitRoll,
    dazeLevel: ctx.dazeLevel,
    dazeLeft: ctx.dazeLeft,
    ally: ctx.waltzAlly === true,
    waltzCenter: ctx.waltzCenter,
    sneak: ctx.sneak === true,
    flee: ctx.flee === true,
    chainOpen: ctx.chainOpen === true,
    stunRoll: ctx.stunRoll,
  });
  if (dancer) {
    const buff = dancer.buff;
    return {
      ...dancer,
      buff: buff ? { name: buff.name as BuffName, duration: buff.duration, ...(buff.power != null ? { power: buff.power } : {}) } : undefined,
    };
  }
  const scholar = castScholar(name, {
    recastLeft: ctx.recastLeft,
    schLevel: ctx.schLevel ?? 0,
    schMain: ctx.schMain === true,
    light: ctx.lightArts === true,
    dark: ctx.darkArts === true,
    tabula: ctx.tabula === true,
    charges: ctx.charges ?? 0,
    sublimation: ctx.sublimation ?? 0,
    sublimationComplete: ctx.sublimationComplete === true,
    helixLeft: ctx.helixLeft ?? 0,
    helixModus: ctx.helixModus === true,
    maxHp: ctx.maxHp ?? 0,
  });
  if (scholar) {
    const buff = scholar.buff;
    return {
      ...scholar,
      buff: buff ? { name: buff.name as BuffName, duration: buff.duration, ...(buff.hold ? { hold: true } : {}), ...(buff.power != null ? { power: buff.power } : {}) } : undefined,
    };
  }
  const rune = castRune(name, {
    recastLeft: ctx.recastLeft,
    runLevel: ctx.runLevel ?? 0,
    runMain: ctx.runMain === true,
    runes: (ctx.runes ?? []).flatMap((row) => {
      if (row.name !== "Ignis" && row.name !== "Gelus" && row.name !== "Flabra" && row.name !== "Tellus" && row.name !== "Sulpor" && row.name !== "Unda" && row.name !== "Lux" && row.name !== "Tenebrae") return [];
      return [{ name: row.name, left: row.left, power: row.power }];
    }),
    skill: ctx.combatSkill ?? 0,
    targeted: ctx.targeted,
    distance: ctx.distance,
    divine: ctx.divine ?? 0,
    stats: {
      str: ctx.str ?? 0,
      dex: ctx.dex ?? 0,
      vit: ctx.vit ?? 0,
      agi: ctx.agi ?? 0,
      int: ctx.int ?? 0,
      mnd: ctx.mnd ?? 0,
      chr: ctx.chr ?? ctx.playerChr ?? 0,
    },
    shadows: ctx.shadows ?? 0,
    targetHp: ctx.targetHp,
  });
  if (rune) {
    const buff = rune.buff;
    return {
      ...rune,
      buff: buff ? { name: buff.name as BuffName, duration: buff.duration, ...(buff.power != null ? { power: buff.power } : {}) } : undefined,
      runes: rune.runes?.map((row) => ({ name: row.name, duration: row.duration, power: row.power })),
    };
  }
  const geo = castGeo(name, {
    recastLeft: ctx.recastLeft,
    geoLevel: ctx.geoLevel ?? 0,
    geoMain: ctx.geoMain === true,
    hp: ctx.hp ?? 0,
    luopan: ctx.luopan === true,
    luopanHp: ctx.luopanHp ?? 0,
    luopanMax: ctx.luopanMax ?? 0,
    luopanMp: ctx.luopanMp ?? 0,
    bolster: ctx.bolster === true,
    ecliptic: ctx.eclipticOn === true,
    lasting: ctx.lastingOn === true,
  });
  if (geo) {
    const buff = geo.buff;
    return {
      ...geo,
      buff: buff ? { name: buff.name as BuffName, duration: buff.duration } : undefined,
    };
  }
  const ability = BY_NAME.get(name);
  if (!ability || ability.level > LEVEL) return { ok: false, text: `${name} is not learned.` };
  if (ctx.recastLeft > 0) return { ok: false, text: `${ability.name} is not ready.` };
  if (ability.name === "Provoke") {
    if (!ctx.targeted) return { ok: false, text: "Provoke needs a target." };
    if (ctx.distance > PROVOKE_RANGE) return { ok: false, text: "Provoke is out of range." };
    return {
      ok: true,
      text: "Provoke. Cumulative enmity 1, volatile enmity 1800.",
      recast: ability.recast,
      hate: { ce: ability.ce, ve: ability.ve },
      claims: true
    };
  }
  const buff = ability.duration > 0 ? { name: ability.name as BuffName, duration: ability.duration } : undefined;
  const hate = ability.ce !== 0 || ability.ve !== 0 ? { ce: ability.ce, ve: ability.ve } : undefined;
  return { ok: true, text: `${ability.name}.`, recast: ability.recast, buff, hate };
}

/** Counter check. Rate is the delay line. Facing and a blocked hit still stop it. */
function retaliationProcs(args: { active: boolean; facing: boolean; blocked: boolean; rate: number; roll: number }): boolean {
  if (!args.active || !args.facing || args.blocked) return false;
  return args.roll < args.rate;
}

function assertAbilities(): void {
  const sword = {
    attackFlat: 350,
    defenseFlat: 198,
    smite: 0,
    accuracy: 100,
    evasion: 80,
    crit: 12,
    pdifCap: 3.25 + 26 / 256
  };
  const plain = meleeStats(sword, []);
  if (plain.attack !== 350 || plain.defense !== 198 || plain.crit !== 12) throw new Error("no buff");
  const covered = meleeStats(sword, [], 20);
  if (covered.defense !== 218) throw new Error(`Protect ${covered.defense}`);
  const coveredDefender = meleeStats(sword, ["Defender"], 20);
  if (coveredDefender.defense !== 285) throw new Error(`Defender Protect ${coveredDefender.defense}`);
  const cocoon = meleeStats(sword, ["Defense Boost"]);
  if (cocoon.defense !== 297) throw new Error(`Cocoon ${cocoon.defense}`);
  const cocoonProtect = meleeStats(sword, ["Defense Boost"], 20);
  if (cocoonProtect.defense !== 327) throw new Error(`Cocoon Protect ${cocoonProtect.defense}`);
  const feather = meleeStats(sword, [{ name: "Evasion Boost", power: 25 }]);
  if (feather.evasion !== 105) throw new Error(`Feather Barrier ${feather.evasion}`);
  const warm = meleeStats(sword, [{ name: "Accuracy Boost", power: 10 }, { name: "Evasion Boost", power: 10 }]);
  if (warm.accuracy !== 110 || warm.evasion !== 90) throw new Error(`Warm-Up ${warm.accuracy}/${warm.evasion}`);
  const roar = meleeStats(sword, [{ name: "Attack Boost", power: 38 }]);
  if (roar.attack !== 401) throw new Error(`Triumphant Roar ${roar.attack}`);
  const roarBerserk = meleeStats(sword, ["Berserk", { name: "Attack Boost", power: 38 }]);
  if (roarBerserk.attack !== 509) throw new Error(`Triumphant Roar Berserk ${roarBerserk.attack}`);
  const berserk = meleeStats(sword, ["Berserk"]);
  if (berserk.attack !== 458 || berserk.defense !== 148) throw new Error(`Berserk ${berserk.attack}/${berserk.defense}`);
  const defender = meleeStats(sword, ["Defender"]);
  if (defender.attack !== 262 || defender.defense !== 259) throw new Error(`Defender ${defender.attack}/${defender.defense}`);
  const both = meleeStats(sword, ["Berserk", "Defender"]);
  if (both.attack !== 370 || both.defense !== 209) throw new Error(`both ${both.attack}/${both.defense}`);
  const cry = meleeStats(sword, ["Berserk", "Warcry"]);
  if (cry.attack !== 489) throw new Error(`Warcry ${cry.attack}`);
  const agg = meleeStats(sword, ["Aggressor"]);
  if (agg.accuracy !== 125 || agg.evasion !== 55) throw new Error("Aggressor");
  const play = meleeStats(sword, [{ name: "Swordplay", power: 12 }]);
  if (play.accuracy !== 112 || play.evasion !== 92) throw new Error(`Swordplay ${play.accuracy}/${play.evasion}`);
  const foil = meleeStats(sword, [{ name: "Foil", power: 150 }]);
  if (foil.evasion !== 230 || foil.accuracy !== 100) throw new Error(`Foil ${foil.evasion}`);
  const ignis = tryAbility("Ignis", { recastLeft: 0, targeted: false, distance: 99, runLevel: 75, runMain: true, runes: [] });
  if (!ignis.ok || ignis.runes?.[0]?.name !== "Ignis" || ignis.runes[0].power !== 1) throw new Error("Ignis use");
  if (tryAbility("Battuta", { recastLeft: 0, targeted: false, distance: 99, runLevel: 75, runMain: true }).ok) throw new Error("Battuta locked");
  const aimed = meleeStats(sword, [], 0, 10);
  if (aimed.accuracy !== plain.accuracy + 10 || aimed.hit < plain.hit) throw new Error("bonus accuracy");
  const distracted = meleeStats(sword, [], 0, 0, 35);
  if (distracted.hit !== 20 || plain.hit !== 20) throw new Error("Distract hit floor");
  const open = meleeStats({ ...sword, accuracy: 300 }, []);
  const opened = meleeStats({ ...sword, accuracy: 300 }, [], 0, 0, 35);
  if (open.hit !== 75 || opened.hit !== 92) throw new Error("Distract moves the hit rate");
  const growl = meleeStats(sword, [{ name: "Ecliptic Growl", power: 5, mind: 3 }]);
  if (growl.attack !== 355 || growl.accuracy !== 103 || growl.defense !== 205 || growl.evasion !== 81) {
    throw new Error(`growl ${growl.attack}/${growl.accuracy}/${growl.defense}/${growl.evasion}`);
  }
  const held = meleeStats(sword, [
    { name: "Glittering Ruby", power: 18, attr: "STR" },
    { name: "Ecliptic Growl", power: 5, mind: 3, skip: "STR" },
  ]);
  if (held.attack !== 368 || held.accuracy !== 103 || held.defense !== 205 || held.evasion !== 81) {
    throw new Error(`growl skip ${held.attack}/${held.accuracy}/${held.defense}/${held.evasion}`);
  }
  const ms = meleeStats(sword, ["Mighty Strikes"]);
  if (ms.crit !== 100) throw new Error("Mighty Strikes");
  const swordRate = retaliationRate(231);
  const axeRate = retaliationRate(504);
  if (Math.abs(swordRate - 0.48836) > 0.001) throw new Error(`1H retaliation ${swordRate}`);
  if (Math.abs(axeRate - 0.38586) > 0.001) throw new Error(`2H retaliation ${axeRate}`);
  if (retaliationRate(100) !== 0.5 || retaliationRate(999) !== 0.2) throw new Error("retaliation ends");
  const retal = meleeStats({ ...sword, delay: 231 }, ["Retaliation"]);
  if (Math.abs(retal.move - 0.86) > 1e-9 || Math.abs(retal.retaliation - swordRate) > 1e-9) throw new Error("Retaliation move");
  if (!retaliationProcs({ active: true, facing: true, blocked: false, rate: swordRate, roll: 0.4 })) throw new Error("would proc");
  if (retaliationProcs({ active: true, facing: true, blocked: false, rate: swordRate, roll: 0.49 })) throw new Error("would not proc");
  if (retaliationProcs({ active: true, facing: false, blocked: false, rate: 1, roll: 0 })) throw new Error("must face");
  if (retaliationProcs({ active: true, facing: true, blocked: true, rate: 1, roll: 0 })) throw new Error("blocked");
  const provoke = tryAbility("Provoke", { recastLeft: 0, targeted: true, distance: 17.8 });
  if (!provoke.ok || provoke.hate?.ce !== 1 || provoke.hate.ve !== 1800) throw new Error("Provoke");
  if (tryAbility("Provoke", { recastLeft: 0, targeted: true, distance: 17.81 }).ok) throw new Error("Provoke range");
  if (tryAbility("Provoke", { recastLeft: 0, targeted: false, distance: 1 }).ok) throw new Error("Provoke target");
  if (tryAbility("Berserk", { recastLeft: 1, targeted: false, distance: 99 }).ok) throw new Error("recast");
  const used = tryAbility("Berserk", { recastLeft: 0, targeted: false, distance: 99 });
  if (!used.ok || used.buff?.duration !== 180 || used.hate?.ve !== 80) throw new Error("Berserk use");
  if (tryAbility("Mighty Strikes", { recastLeft: 0, targeted: false, distance: 99 }).hate?.ve !== 320) throw new Error("Mighty Strikes hate");
  if (tryAbility("Retaliation", { recastLeft: 0, targeted: false, distance: 99 }).hate) throw new Error("Retaliation hate");
  const font = tryAbility("Manafont", { recastLeft: 0, targeted: false, distance: 99 });
  if (!font.ok || font.buff?.name !== "Manafont" || font.buff.duration !== 60 || font.recast !== 3600 || font.hate) throw new Error("Manafont");
  if (tryAbility("Manafont", { recastLeft: 1, targeted: false, distance: 99 }).ok) throw new Error("Manafont recast");
  const seal = tryAbility("Elemental Seal", { recastLeft: 0, targeted: false, distance: 99 });
  if (!seal.ok || seal.buff?.duration !== 60 || seal.recast !== 600 || seal.hate?.ce !== 0 || seal.hate?.ve !== 80) throw new Error("Elemental Seal");
  if (tryAbility("Elemental Seal", { recastLeft: 1, targeted: false, distance: 99 }).ok) throw new Error("Elemental Seal recast");
  const benediction = tryAbility("Benediction", { recastLeft: 0, targeted: false, distance: 99 });
  if (!benediction.ok || !benediction.fullHeal || benediction.recast !== 3600 || benediction.buff || benediction.hate) throw new Error("Benediction");
  const divine = tryAbility("Divine Seal", { recastLeft: 0, targeted: false, distance: 99 });
  if (!divine.ok || divine.buff?.name !== "Divine Seal" || divine.buff.duration !== 60 || divine.recast !== 600 || divine.hate?.ve !== 80) throw new Error("Divine Seal");
  const solace = tryAbility("Afflatus Solace", { recastLeft: 0, targeted: false, distance: 99 });
  if (!solace.ok || solace.buff?.duration !== 7200 || solace.recast !== 60 || solace.hate?.ce !== 1 || solace.hate?.ve !== 80) {
    throw new Error("Afflatus Solace");
  }
  const misery = tryAbility("Afflatus Misery", { recastLeft: 0, targeted: false, distance: 99 });
  if (!misery.ok || misery.hate || misery.buff?.duration !== 7200) throw new Error("Afflatus Misery");
  if (tryAbility("Martyr", { recastLeft: 0, targeted: true, distance: 5 }).text !== "Martyr is not unlocked.") throw new Error("Martyr merit");
  if (tryAbility("Devotion", { recastLeft: 0, targeted: false, distance: 1 }).text !== "Devotion is not unlocked.") throw new Error("Devotion merit");
  const chain = tryAbility("Chainspell", { recastLeft: 0, targeted: false, distance: 99 });
  if (!chain.ok || chain.buff?.name !== "Chainspell" || chain.buff.duration !== 60 || chain.recast !== 3600 || chain.hate) throw new Error("Chainspell");
  const convert = tryAbility("Convert", { recastLeft: 0, targeted: false, distance: 99, mp: 40 });
  if (!convert.ok || !convert.convert || convert.recast !== 600 || convert.hate?.ve !== 80 || convert.buff) throw new Error("Convert");
  if (tryAbility("Convert", { recastLeft: 0, targeted: false, distance: 99, mp: 0 }).text !== "Convert cannot be used with no MP.") throw new Error("Convert empty");
  const composure = tryAbility("Composure", { recastLeft: 0, targeted: false, distance: 99 });
  if (!composure.ok || composure.buff?.duration !== 7200 || composure.recast !== 300 || composure.hate?.ve !== 80) throw new Error("Composure");
  const posed = meleeStats(sword, ["Composure"]);
  if (posed.accuracy !== 138) throw new Error(`Composure accuracy ${posed.accuracy}`);
  const motions = ["Mighty Strikes", "Provoke", "Berserk", "Defender", "Warcry", "Aggressor", "Retaliation"];
  if (WAR_ABILITIES.length !== motions.length || WAR_ABILITIES.some((ability) => !motions.includes(ability.name))) {
    throw new Error("Warrior ability is missing its animation");
  }
  if (tryAbility("Mantra", { recastLeft: 0, targeted: false, distance: 99 }).text !== "Mantra is not learned.") throw new Error("Mantra merit");
  const fists = tryAbility("Hundred Fists", { recastLeft: 0, targeted: false, distance: 99 });
  if (!fists.ok || fists.buff?.duration !== 45 || fists.recast !== 3600 || fists.hate?.ve !== 320) throw new Error("Hundred Fists");
  const boost = tryAbility("Boost", { recastLeft: 0, targeted: false, distance: 99, delay: 348 });
  if (!boost.ok || boost.buff?.duration !== 23.2 || boost.recast !== 60 || boost.hate?.ve !== 320) throw new Error("Boost");
  const mnkSheet = derive(fitLoadout(DEFAULT_LOADOUT, "MNK"), "hume", "MNK");
  const dodged = meleeStats(mnkSheet, ["Dodge"]);
  if (dodged.evasion !== mnkSheet.evasion + 76) throw new Error("Dodge");
  const focused = meleeStats(mnkSheet, ["Focus"]);
  if (focused.accuracy !== mnkSheet.accuracy + 76 || Math.abs(focused.crit - (mnkSheet.crit + 15.2)) > 1e-9) throw new Error("Focus");
  const stance = meleeStats(mnkSheet, ["Counterstance"]);
  if (stance.defense !== scale256(mnkSheet.defenseFlat, -128)) throw new Error("Counterstance");
  const chakra = tryAbility("Chakra", { recastLeft: 0, targeted: false, distance: 0, vit: 70, maxHp: 1748, monkLevel: 75, monkMain: true });
  if (!chakra.ok || chakra.heal !== 402 || chakra.hate?.ve !== 320) throw new Error("Chakra");
  if (tryAbility("Chi Blast", { recastLeft: 0, targeted: false, distance: 1 }).ok) throw new Error("Chi Blast target");
  const bash = tryAbility("Shield Bash", { recastLeft: 0, targeted: true, distance: 5.4, shield: 13, pldLevel: 75, pldMain: true });
  if (!bash.ok || bash.bash == null || bash.bash < 34 || bash.bash > 35 || !bash.stun || bash.hate?.ce !== 450 || bash.hate.ve !== 900) throw new Error("Shield Bash");
  if (tryAbility("Shield Bash", { recastLeft: 0, targeted: true, distance: 1, shield: null, pldLevel: 75, pldMain: true }).ok) throw new Error("Shield Bash shield");
  if (tryAbility("Shield Bash", { recastLeft: 0, targeted: true, distance: 5.41, shield: 0, pldLevel: 75, pldMain: true }).ok) throw new Error("Shield Bash range");
  const sentinel = tryAbility("Sentinel", { recastLeft: 0, targeted: false, distance: 99, pldMain: true });
  if (!sentinel.ok || sentinel.buff?.duration !== 30 || sentinel.buff.power !== 2 || sentinel.hate?.ve !== 900) throw new Error("Sentinel");
  const subSentinel = tryAbility("Sentinel", { recastLeft: 0, targeted: false, distance: 99, pldLevel: 37, pldMain: false });
  if (subSentinel.buff?.power !== 1.5) throw new Error("Sentinel sub");
  const invincible = tryAbility("Invincible", { recastLeft: 0, targeted: false, distance: 99, pldMain: true });
  if (!invincible.ok || invincible.buff?.duration !== 30 || invincible.recast !== 3600 || invincible.hate?.ve !== 7200) throw new Error("Invincible");
  if (tryAbility("Fealty", { recastLeft: 0, targeted: false, distance: 1 }).text !== "Fealty is not unlocked.") throw new Error("Fealty merit");
  if (tryAbility("Chivalry", { recastLeft: 0, targeted: false, distance: 1 }).text !== "Chivalry is not unlocked.") throw new Error("Chivalry merit");
  const yonin = tryAbility("Yonin", { recastLeft: 0, targeted: false, distance: 99, ninMain: true });
  if (!yonin.ok || yonin.buff?.name !== "Yonin" || yonin.buff.duration !== 300 || yonin.recast !== 180 || yonin.share?.[0] !== "Innin" || yonin.replaces?.[0] !== "Innin" || yonin.hate?.ve !== 600) {
    throw new Error("Yonin");
  }
  const innin = tryAbility("Innin", { recastLeft: 0, targeted: false, distance: 99, ninMain: true });
  if (!innin.ok || innin.buff?.name !== "Innin" || innin.share?.[0] !== "Yonin" || innin.hate?.ve !== 60) throw new Error("Innin");
  if (tryAbility("Yonin", { recastLeft: 0, targeted: false, distance: 99, ninLevel: 37, ninMain: false }).ok) throw new Error("Yonin sub");
  if (tryAbility("Sange", { recastLeft: 0, targeted: false, distance: 1, ninMain: true }).text !== "Sange is not unlocked.") throw new Error("Sange merit");
  const mijin = tryAbility("Mijin Gakure", { recastLeft: 0, targeted: true, distance: 17.6, hp: 1166, ninMain: true });
  if (!mijin.ok || mijin.bash !== 583 || !mijin.ko || mijin.recast !== 3600) throw new Error("Mijin Gakure");
  if (tryAbility("Mijin Gakure", { recastLeft: 0, targeted: true, distance: 17.61, hp: 100, ninMain: true }).ok) throw new Error("Mijin range");
  const voice = tryAbility("Soul Voice", { recastLeft: 0, targeted: false, distance: 99, brdMain: true });
  if (!voice.ok || voice.buff?.name !== "Soul Voice" || voice.buff.duration !== 180 || voice.recast !== 3600 || voice.hate?.ve !== 80) throw new Error("Soul Voice");
  const piano = tryAbility("Pianissimo", { recastLeft: 0, targeted: false, distance: 99, brdMain: false });
  if (!piano.ok || piano.buff?.name !== "Pianissimo" || piano.buff.duration !== 60 || piano.recast !== 5 || piano.hate?.ve !== 80) throw new Error("Pianissimo");
  if (tryAbility("Soul Voice", { recastLeft: 0, targeted: false, distance: 99, brdMain: false }).ok) throw new Error("Soul Voice sub");
  if (tryAbility("Nightingale", { recastLeft: 0, targeted: false, distance: 1, brdMain: true }).text !== "Nightingale is not unlocked.") throw new Error("Nightingale merit");
  if (tryAbility("Troubadour", { recastLeft: 0, targeted: false, distance: 1, brdMain: true }).text !== "Troubadour is not unlocked.") throw new Error("Troubadour merit");
  const plainSong = meleeStats(sword, []);
  const minuetSwing = meleeStats(sword, [{ name: "Valor Minuet", power: 32, song: { family: "minuet" } }]);
  const madrigalSwing = meleeStats(sword, [{ name: "Sword Madrigal", power: 45, song: { family: "madrigal" } }]);
  const mamboSwing = meleeStats(sword, [{ name: "Sheepfoe Mambo", power: 48, song: { family: "mambo" } }]);
  const minneSwing = meleeStats(sword, [{ name: "Knight's Minne", power: 30, song: { family: "minne" } }]);
  if (minuetSwing.attack <= plainSong.attack) throw new Error("minuet attack");
  if (madrigalSwing.accuracy !== plainSong.accuracy + 45) throw new Error("madrigal accuracy");
  if (mamboSwing.evasion !== plainSong.evasion + 48) throw new Error("mambo evasion");
  if (minneSwing.defense <= plainSong.defense) throw new Error("minne defense");
  const ninSheet = derive(fitLoadout(DEFAULT_LOADOUT, "NIN"), "hume", "NIN");
  const front = meleeStats(ninSheet, ["Yonin"], 0, 0, 0, false);
  if (front.accuracy !== ninSheet.accuracy - 30 || front.evasion !== ninSheet.evasion + 30 || front.foeCrit !== 30) throw new Error("Yonin front");
  const rear = meleeStats(ninSheet, [{ name: "Innin", left: 300 }], 0, 0, 0, true);
  if (rear.accuracy !== ninSheet.accuracy + 30 || rear.crit !== ninSheet.crit + 30) throw new Error("Innin behind");
  const hidden = meleeStats(ninSheet, ["Invisible"]);
  if (Math.abs(hidden.move - 1.12) > 1e-9) throw new Error("Stealth");
  const cover = tryAbility("Cover", { recastLeft: 0, targeted: false, distance: 1, vit: 70, mnd: 61 });
  if (!cover.ok || cover.buff?.name !== "Cover" || cover.buff.duration !== 30) throw new Error("Cover");
  const chi = tryAbility("Chi Blast", { recastLeft: 0, targeted: true, distance: 5 });
  if (!chi.ok || chi.heal || chi.buff) throw new Error("Chi Blast");
  const swordSheet = derive(DEFAULT_LOADOUT, "hume");
  if (swordSheet.fencerTp !== 400 || swordSheet.smite !== 0) throw new Error("sword Fencer");
  if (swordSheet.pdifCap !== 3.25 + 26 / 256) throw new Error("Damage Limit cap");
  if (swordSheet.attack !== swordSheet.attackFlat) throw new Error("sword has no Smite");
  const axe = derive({ ...DEFAULT_LOADOUT, main: "butterfly-axe", sub: null }, "hume");
  if (axe.smite !== 38 || axe.fencerTp !== 0 || axe.attack !== scale256(axe.attackFlat, 38)) throw new Error("great axe Smite");
  const shielded = derive({ ...DEFAULT_LOADOUT, sub: "lauan-shield" }, "hume");
  if (shielded.fencerTp !== 400) throw new Error("Fencer keeps a shield");
  const flee = meleeStats(sword, ["Flee"]);
  if (Math.abs(flee.move - 1.6) > 1e-9) throw new Error("Flee");
  const raptorMove = meleeStats(sword, [{ name: "Raptor Mazurka", power: 10, song: { family: "mazurka" } }]);
  const chocoboMove = meleeStats(sword, [{ name: "Chocobo Mazurka", power: 20, song: { family: "mazurka" } }]);
  const fleeMazurka = meleeStats(sword, ["Flee", { name: "Chocobo Mazurka", power: 20, song: { family: "mazurka" } }]);
  if (Math.abs(raptorMove.move - 1.1) > 1e-9) throw new Error("Raptor Mazurka");
  if (Math.abs(chocoboMove.move - 1.2) > 1e-9) throw new Error("Chocobo Mazurka");
  if (Math.abs(fleeMazurka.move - 1.6) > 1e-9) throw new Error("Flee already caps Mazurka");
  const jigMove = meleeStats(sword, ["Chocobo Jig"]);
  const jigMazurka = meleeStats(sword, ["Chocobo Jig", { name: "Chocobo Mazurka", power: 20, song: { family: "mazurka" } }]);
  const fleeJig = meleeStats(sword, ["Flee", "Chocobo Jig"]);
  if (Math.abs(jigMove.move - 1.2) > 1e-9) throw new Error("Chocobo Jig move");
  if (Math.abs(jigMazurka.move - 1.2) > 1e-9) throw new Error("Jig and Mazurka share the cap");
  if (Math.abs(fleeJig.move - 1.6) > 1e-9) throw new Error("Flee overwrites Chocobo Jig");
  const steal = tryAbility("Steal", { recastLeft: 0, targeted: true, distance: 4.4 });
  if (!steal.ok || steal.recast !== 300 || steal.hate?.ce !== 1 || steal.hate.ve !== 320 || steal.buff) throw new Error("Steal");
  if (tryAbility("Mug", { recastLeft: 0, targeted: false, distance: 1 }).ok) throw new Error("Mug target");
  if (tryAbility("Steal", { recastLeft: 0, targeted: true, distance: 4.41 }).ok) throw new Error("Steal range");
  const sneak = tryAbility("Sneak Attack", { recastLeft: 0, targeted: false, distance: 99 });
  if (!sneak.ok || sneak.buff?.name !== "Sneak Attack" || sneak.buff.duration !== 60 || sneak.recast !== 60) throw new Error("Sneak Attack");
  const hide = tryAbility("Hide", { recastLeft: 0, targeted: false, distance: 99 });
  if (!hide.ok || !hide.buff?.hold || hide.recast !== 300) throw new Error("Hide");
  const dodge = tryAbility("Perfect Dodge", { recastLeft: 0, targeted: false, distance: 99 });
  if (!dodge.ok || dodge.buff?.duration !== 30 || dodge.recast !== 3600 || dodge.hate) throw new Error("Perfect Dodge");
  const party = tryAbility("Accomplice", { recastLeft: 0, targeted: false, distance: 99 });
  if (party.ok) throw new Error("Accomplice needs a member");
  const lined = tryAbility("Accomplice", { recastLeft: 0, targeted: false, distance: 4, allyDistance: 2, mobDistance: 4, thfMain: true });
  if (!lined.ok || lined.recast !== 300 || lined.steal !== 0.5 || !lined.share?.includes("Collaborator")) throw new Error("Accomplice");
  if (tryAbility("Accomplice", { recastLeft: 0, targeted: false, distance: 4, allyDistance: 13, mobDistance: 4, thfMain: true }).ok) throw new Error("Accomplice range");
  if (tryAbility("Accomplice", { recastLeft: 0, targeted: false, distance: 4, allyDistance: 2, mobDistance: 21, thfMain: true }).ok) throw new Error("Accomplice mob");
  if (tryAbility("Accomplice", { recastLeft: 0, targeted: false, distance: 4, allyDistance: 2, mobDistance: 4, thfMain: false }).ok) throw new Error("Accomplice sub");
  const collab = tryAbility("Collaborator", { recastLeft: 0, targeted: false, distance: 4, allyDistance: 2, mobDistance: 4, thfMain: true });
  if (!collab.ok || collab.recast !== 60 || collab.steal !== 0.25 || !collab.share?.includes("Accomplice")) throw new Error("Collaborator");
  if (tryAbility("Feint", { recastLeft: 0, targeted: false, distance: 99 }).text !== "Feint is not learned.") throw new Error("Feint merit");
  const meikyo = tryAbility("Meikyo Shisui", { recastLeft: 0, targeted: false, distance: 99 });
  if (!meikyo.ok || meikyo.buff?.duration !== 30 || meikyo.recast !== 3600 || meikyo.tpGrant !== 3000 || meikyo.hate?.ve !== 300) throw new Error("Meikyo Shisui");
  const eye = tryAbility("Third Eye", { recastLeft: 0, targeted: false, distance: 99, seigan: true });
  if (!eye.ok || eye.recast !== 30 || eye.buff?.name !== "Third Eye") throw new Error("Third Eye under Seigan");
  if (tryAbility("Third Eye", { recastLeft: 0, targeted: false, distance: 99 }).recast !== 60) throw new Error("Third Eye recast");
  const konzen = tryAbility("Konzen-ittai", { recastLeft: 0, targeted: true, distance: KONZEN_RANGE });
  if (!konzen.ok || konzen.recast !== 180 || konzen.buff?.duration !== 60) throw new Error("Konzen-ittai");
  if (tryAbility("Konzen-ittai", { recastLeft: 0, targeted: false, distance: 1 }).ok) throw new Error("Konzen target");
  if (tryAbility("Blade Bash", { recastLeft: 0, targeted: false, distance: 99 }).text !== "Blade Bash is not learned.") throw new Error("Blade Bash merit");
  const samSheet = derive(fitLoadout(DEFAULT_LOADOUT, "SAM"), "hume", "SAM");
  const hasso = meleeStats(samSheet, ["Hasso"]);
  if (hasso.accuracy !== samSheet.accuracy + 10 || hasso.attack !== scale256(samSheet.attackFlat + hassoStr(75), 0)) throw new Error("Hasso");
  const swordHasso = meleeStats(sword, ["Hasso"]);
  if (swordHasso.accuracy !== sword.accuracy || swordHasso.attack !== plain.attack) throw new Error("Hasso needs two hands");
  const camo = tryAbility("Camouflage", { recastLeft: 0, targeted: false, distance: 99 });
  if (!camo.ok || !camo.buff || camo.buff.name !== "Camouflage" || camo.buff.duration < 30 || camo.buff.duration > 240) throw new Error("Camouflage duration");
  if (tryAbility("Eagle Eye Shot", { recastLeft: 0, targeted: false, distance: 1 }).ok) throw new Error("Eagle Eye Shot target");
  const eagle = tryAbility("Eagle Eye Shot", { recastLeft: 0, targeted: true, distance: EAGLE_EYE_RANGE });
  if (!eagle.ok || !eagle.eagle || eagle.buff || eagle.hate || eagle.recast !== 3600) throw new Error("Eagle Eye Shot");
  if (tryAbility("Shadowbind", { recastLeft: 0, targeted: true, distance: SHADOWBIND_RANGE + 0.01 }).ok) throw new Error("Shadowbind range");
  const rngSheet = derive(fitLoadout(DEFAULT_LOADOUT, "RNG"), "hume", "RNG");
  const velocity = meleeStats(rngSheet, ["Velocity Shot"]);
  if (velocity.attack !== scale256(rngSheet.attackFlat, -VELOCITY_ATTACK)) throw new Error("Velocity Shot");
  const barrage = tryAbility("Barrage", { recastLeft: 0, targeted: false, distance: 99 });
  if (!barrage.ok || !barrage.replaces?.includes("Unlimited Shot")) throw new Error("Barrage replaces Unlimited Shot");
  const unlimited = tryAbility("Unlimited Shot", { recastLeft: 0, targeted: false, distance: 99 });
  if (!unlimited.ok || !unlimited.replaces?.includes("Barrage")) throw new Error("Unlimited Shot replaces Barrage");
  const lastResort = meleeStats(sword, ["Last Resort"]);
  if (lastResort.attack !== 437 || lastResort.defense !== 148) throw new Error(`Last Resort ${lastResort.attack}/${lastResort.defense}`);
  const weaponBash = tryAbility("Weapon Bash", { recastLeft: 0, targeted: true, distance: 5.4, twoHand: true, drkLevel: 75, drkMain: true });
  if (!weaponBash.ok || weaponBash.bash !== 21 || !weaponBash.stun || weaponBash.hate?.ve !== 900 || weaponBash.buff) throw new Error("Weapon Bash");
  if (tryAbility("Weapon Bash", { recastLeft: 0, targeted: true, distance: 1, twoHand: false, drkLevel: 75, drkMain: true }).ok) throw new Error("Weapon Bash hands");
  if (tryAbility("Weapon Bash", { recastLeft: 0, targeted: true, distance: 5.41, twoHand: true, drkLevel: 75, drkMain: true }).ok) throw new Error("Weapon Bash range");
  if (tryAbility("Weapon Bash", { recastLeft: 0, targeted: false, distance: 1, twoHand: true, drkLevel: 75, drkMain: true }).ok) throw new Error("Weapon Bash target");
  const subBash = tryAbility("Weapon Bash", { recastLeft: 0, targeted: true, distance: 1, twoHand: true, drkLevel: 37, drkMain: false });
  if (subBash.bash !== 12) throw new Error("Weapon Bash sub");
  const blood = tryAbility("Blood Weapon", { recastLeft: 0, targeted: false, distance: 99, drkMain: true });
  if (!blood.ok || blood.buff?.name !== "Blood Weapon" || blood.buff.duration !== 30 || blood.recast !== 3600 || blood.hate?.ve !== 80) throw new Error("Blood Weapon");
  if (tryAbility("Blood Weapon", { recastLeft: 0, targeted: false, distance: 99, drkMain: false }).ok) throw new Error("Blood Weapon sub");
  const resort = tryAbility("Last Resort", { recastLeft: 0, targeted: false, distance: 99, drkMain: false, drkLevel: 37 });
  if (!resort.ok || resort.buff?.duration !== 180 || resort.recast !== 300 || resort.hate?.ve !== 1280) throw new Error("Last Resort use");
  const circle = tryAbility("Arcane Circle", { recastLeft: 0, targeted: false, distance: 99, drkMain: true });
  if (!circle.ok || circle.buff?.duration !== 180 || circle.hate?.ve !== 5) throw new Error("Arcane Circle");
  const soul = tryAbility("Souleater", { recastLeft: 0, targeted: false, distance: 99, drkMain: true });
  if (!soul.ok || soul.buff?.name !== "Souleater" || soul.buff.duration !== 60 || soul.recast !== 360 || soul.hate?.ve !== 1280) throw new Error("Souleater");
  const eaten = tryAbility("Consume Mana", { recastLeft: 0, targeted: false, distance: 99, drkMain: true });
  if (!eaten.ok || eaten.buff?.name !== "Consume Mana" || eaten.buff.duration !== 60 || eaten.recast !== 60 || eaten.hate) throw new Error("Consume Mana");
  if (tryAbility("Consume Mana", { recastLeft: 0, targeted: false, distance: 99, drkMain: false, drkLevel: 37 }).ok) throw new Error("Consume Mana sub");
  if (tryAbility("Dark Seal", { recastLeft: 0, targeted: false, distance: 1, drkMain: true }).text !== "Dark Seal is not unlocked.") throw new Error("Dark Seal");
  if (tryAbility("Diabolic Eye", { recastLeft: 0, targeted: false, distance: 1, drkMain: true }).text !== "Diabolic Eye is not unlocked.") throw new Error("Diabolic Eye");
  const surged = meleeStats(sword, [{ name: "Spirit Surge", power: 16 }]);
  if (surged.attack !== 457 || surged.defense !== 247 || surged.accuracy !== 150) throw new Error(`Spirit Surge ${surged.attack}/${surged.defense}/${surged.accuracy}`);
  const aura = meleeStats(sword, ["Wyvern"]);
  if (aura.attack !== 385 || aura.defense !== 218) throw new Error(`Wyvern aura ${aura.attack}/${aura.defense}`);
  const leap = tryAbility("Jump", { recastLeft: 0, targeted: true, distance: JUMP_RANGE, drgLevel: 75, drgMain: true, dmg: 8, fstr: 2, vit: 61, hitChance: 95, hitRoll: 0 });
  if (!leap.ok || leap.recast !== 60 || leap.jumpKind !== "jump" || leap.jumpDmg !== 12 || leap.jumpHit !== true) throw new Error("Jump");
  if (tryAbility("Jump", { recastLeft: 0, targeted: true, distance: JUMP_RANGE + 0.01, drgMain: true, dmg: 8, fstr: 2, vit: 61 }).ok) throw new Error("Jump range");
  const whiff = tryAbility("Jump", { recastLeft: 0, targeted: true, distance: 1, drgMain: true, dmg: 8, fstr: 2, vit: 61, hitChance: 20, hitRoll: 0.99 });
  if (!whiff.ok || whiff.jumpHit !== false || whiff.jumpDmg !== 0 || whiff.recast !== 60) throw new Error("Jump miss");
  const sure = tryAbility("Jump", { recastLeft: 0, targeted: true, distance: 1, drgMain: true, dmg: 8, fstr: 2, vit: 61, hitChance: 20, hitRoll: 0.99, surge: true });
  if (!sure.jumpHit || !sure.defenseDown || sure.jumpDmg !== 12) throw new Error("Jump during Spirit Surge");
  const high = tryAbility("High Jump", { recastLeft: 0, targeted: true, distance: HIGH_JUMP_RANGE, drgMain: true, drgLevel: 75, dmg: 8, fstr: 2, hitChance: 95, hitRoll: 0 });
  if (!high.ok || high.recast !== 120 || high.jumpDmg !== 10 || high.enmityKeep !== 0.5) throw new Error("High Jump");
  const highSub = tryAbility("High Jump", { recastLeft: 0, targeted: true, distance: 1, drgMain: false, drgLevel: 37, dmg: 8, fstr: 2, hitRoll: 0.99, hitChance: 20 });
  if (!highSub.ok || highSub.enmityKeep !== 0.7 || highSub.jumpHit) throw new Error("High Jump sub");
  const cut = tryAbility("High Jump", { recastLeft: 0, targeted: true, distance: 1, drgMain: true, dmg: 8, fstr: 2, hitRoll: 0, hitChance: 95, surge: true });
  if (cut.tpCut !== 20) throw new Error("High Jump TP cut");
  if (tryAbility("Super Jump", { recastLeft: 0, targeted: true, distance: 1, drgMain: false, drgLevel: 37 }).ok) throw new Error("Super Jump sub");
  const sky = tryAbility("Super Jump", { recastLeft: 0, targeted: true, distance: SUPER_JUMP_RANGE, drgMain: true });
  if (!sky.ok || !sky.ceToOne || sky.halveBehind || sky.buff?.name !== "Super Jump" || sky.buff.duration !== 5 || sky.recast !== 180 || sky.jumpDmg) throw new Error("Super Jump");
  const skySurge = tryAbility("Super Jump", { recastLeft: 0, targeted: true, distance: 1, drgMain: true, surge: true });
  if (!skySurge.ok || !skySurge.halveBehind) throw new Error("Super Jump during Spirit Surge");
  if (tryAbility("Call Wyvern", { recastLeft: 0, targeted: false, distance: 99, drgMain: false }).ok) throw new Error("Call Wyvern sub");
  if (tryAbility("Call Wyvern", { recastLeft: 0, targeted: false, distance: 99, drgMain: true, wyvernOut: true }).ok) throw new Error("Call Wyvern twice");
  if (tryAbility("Call Wyvern", { recastLeft: 0, targeted: false, distance: 99, drgMain: true, wyvernOut: false, surge: true }).ok) throw new Error("Call Wyvern during Spirit Surge");
  const called = tryAbility("Call Wyvern", { recastLeft: 0, targeted: false, distance: 99, drgMain: true, wyvernOut: false });
  if (!called.ok || !called.wyvernCall || called.recast !== 1200 || called.hate?.ce !== 1 || called.hate?.ve !== 300) throw new Error("Call Wyvern");
  if (tryAbility("Astral Flow", { recastLeft: 0, targeted: false, distance: 1, smnMain: false, smnLevel: 37 }).ok) throw new Error("Astral Flow sub");
  if (tryAbility("Apogee", { recastLeft: 0, targeted: false, distance: 1, smnMain: false, smnLevel: 37 }).ok) throw new Error("Apogee sub");
  if (tryAbility("Elemental Siphon", { recastLeft: 0, targeted: false, distance: 1, smnMain: false, smnLevel: 37 }).ok) throw new Error("Siphon sub");
  const flow = tryAbility("Astral Flow", { recastLeft: 0, targeted: false, distance: 1, smnMain: true, smnLevel: 75 });
  if (!flow.ok || flow.recast !== 3600 || flow.buff?.name !== "Astral Flow" || flow.buff.duration !== 180) throw new Error("Astral Flow");
  const apogee = tryAbility("Apogee", { recastLeft: 0, targeted: false, distance: 1, smnMain: true, smnLevel: 75 });
  if (!apogee.ok || apogee.recast !== 180 || apogee.buff?.duration !== 60) throw new Error("Apogee");
  if (tryAbility("Elemental Siphon", { recastLeft: 0, targeted: false, distance: 1, smnMain: true, smnLevel: 75, avatarOut: true, avatarSpirit: false }).ok) {
    throw new Error("Siphon on an avatar");
  }
  const siphon = tryAbility("Elemental Siphon", { recastLeft: 0, targeted: false, distance: 1, smnMain: true, smnLevel: 75, avatarOut: true, avatarSpirit: true, summoning: 269 });
  if (!siphon.ok || siphon.siphonMp !== 227 || siphon.recast !== 300) throw new Error("Elemental Siphon");
  if (!tryAbility("Release", { recastLeft: 0, targeted: false, distance: 1, smnMain: false, smnLevel: 37, avatarOut: true }).avatarRelease) throw new Error("Release");
  if (tryAbility("Assault", { recastLeft: 0, targeted: false, distance: 1, smnMain: true, smnLevel: 75, avatarOut: false }).ok) throw new Error("Assault without a pet");
  if (tryAbility("Spirit Link", { recastLeft: 0, targeted: false, distance: 1, drgMain: true, wyvernOut: false }).ok) throw new Error("Spirit Link needs a wyvern");
  if (tryAbility("Spirit Link", { recastLeft: 0, targeted: false, distance: 1, drgMain: true, wyvernOut: true, wyvernFull: true, hp: 1167, hitRoll: 0 }).ok) throw new Error("Spirit Link at full HP");
  const link = tryAbility("Spirit Link", { recastLeft: 0, targeted: false, distance: 1, drgMain: true, wyvernOut: true, wyvernFull: false, hp: 1167, hitRoll: 0 });
  if (!link.ok || link.linkCost !== 140 || link.recast !== 90) throw new Error("Spirit Link");
  if (tryAbility("Dismiss", { recastLeft: 0, targeted: false, distance: 1, drgMain: true, wyvernOut: false }).ok) throw new Error("Dismiss empty");
  const gone = tryAbility("Dismiss", { recastLeft: 0, targeted: false, distance: 1, drgMain: true, wyvernOut: true });
  if (!gone.ok || !gone.wyvernDismiss || gone.recast !== 300 || gone.callWyvernReady) throw new Error("Dismiss");
  const goneFull = tryAbility("Dismiss", { recastLeft: 0, targeted: false, distance: 1, drgMain: true, wyvernOut: true, wyvernFull: true });
  if (!goneFull.callWyvernReady || goneFull.recast !== 300) throw new Error("Dismiss at full HP");
  if (tryAbility("Spirit Surge", { recastLeft: 0, targeted: false, distance: 99, drgMain: true, drgLevel: 75 }).ok) throw new Error("Spirit Surge needs a wyvern");
  const surge = tryAbility("Spirit Surge", { recastLeft: 0, targeted: false, distance: 99, drgMain: true, drgLevel: 75, wyvernOut: true });
  if (!surge.ok || surge.buff?.name !== "Spirit Surge" || surge.buff.duration !== 60 || surge.buff.power !== 16 || surge.recast !== 3600 || !surge.surgeAbsorb) throw new Error("Spirit Surge");
  const bond = tryAbility("Spirit Bond", { recastLeft: 0, targeted: false, distance: 1, drgMain: true });
  if (!bond.ok || bond.buff?.name !== "Spirit Bond" || bond.buff.duration !== 180 || bond.recast !== 60) throw new Error("Spirit Bond");
  if (tryAbility("Deep Breathing", { recastLeft: 0, targeted: false, distance: 1, drgMain: true }).text !== "Deep Breathing is not unlocked.") throw new Error("Deep Breathing");
  if (tryAbility("Angon", { recastLeft: 0, targeted: false, distance: 1, drgMain: true }).text !== "Angon is not unlocked.") throw new Error("Angon");
  const circleDrg = tryAbility("Ancient Circle", { recastLeft: 0, targeted: false, distance: 99, drgMain: true });
  if (!circleDrg.ok || circleDrg.buff?.duration !== 180 || circleDrg.recast !== 300 || circleDrg.hate?.ve !== 20) throw new Error("Ancient Circle");
  if (tryAbility("Call Beast", { recastLeft: 0, targeted: false, distance: 1, bstMain: false, bstLevel: 37 }).text !== "A support job cannot equip a jug.") {
    throw new Error("Call Beast sub");
  }
  if (tryAbility("Call Beast", { recastLeft: 0, targeted: false, distance: 1, bstMain: true, bstLevel: 75 }).ok) throw new Error("Call Beast without a jug");
  if (tryAbility("Call Beast", { recastLeft: 0, targeted: false, distance: 1, bstMain: true, bstLevel: 75, jugItem: "pebble", jugLeft: 0 }).ok) throw new Error("Call Beast with a pebble");
  const calledBeast = tryAbility("Call Beast", { recastLeft: 0, targeted: false, distance: 1, bstMain: true, bstLevel: 75, jugItem: FISH_OIL_BROTH, jugLeft: 12 });
  if (!calledBeast.ok || calledBeast.jugCall !== "call" || calledBeast.recast !== 300 || !calledBeast.text.includes("11 remain")) throw new Error("Call Beast");
  const loyal = tryAbility("Bestial Loyalty", { recastLeft: 0, targeted: false, distance: 1, bstMain: true, bstLevel: 75, jugItem: FISH_OIL_BROTH, jugLeft: 12 });
  if (!loyal.ok || loyal.jugCall !== "loyalty" || loyal.recast !== 1200 || !loyal.text.includes("12 remain")) throw new Error("Bestial Loyalty");
  if (tryAbility("Call Beast", { recastLeft: 0, targeted: false, distance: 1, bstMain: true, bstLevel: 75, jugItem: FISH_OIL_BROTH, jugLeft: 12, wyvernOut: true }).ok) throw new Error("Call Beast with a pet");
  if (tryAbility("Bestial Loyalty", { recastLeft: 0, targeted: false, distance: 1, bstMain: true, bstLevel: 75, jugItem: FISH_OIL_BROTH, jugLeft: 12, avatarOut: true }).ok) throw new Error("Bestial Loyalty with a pet");
  if (tryAbility("Familiar", { recastLeft: 0, targeted: false, distance: 1, bstMain: true, bstLevel: 75 }).ok) throw new Error("Familiar needs a pet");
  const familiar = tryAbility("Familiar", { recastLeft: 0, targeted: false, distance: 1, bstMain: true, bstLevel: 75, jugOut: true });
  if (!familiar.ok || !familiar.familiar || familiar.recast !== 3600 || familiar.buff?.name !== "Familiar") throw new Error("Familiar");
  if (tryAbility("Big Scissors", { recastLeft: 0, targeted: false, distance: 1, bstMain: true, bstLevel: 75, jugOut: true, jugCharges: 0 }).ok) throw new Error("Ready needs charges");
  const scissors = tryAbility("Big Scissors", { recastLeft: 0, targeted: false, distance: 1, bstMain: true, bstLevel: 75, jugOut: true, jugCharges: 1 });
  if (!scissors.ok || scissors.jugReady !== "Big Scissors" || scissors.recast) throw new Error("Big Scissors");
  if (tryAbility("Sic", { recastLeft: 0, targeted: false, distance: 1, bstMain: true, bstLevel: 75, jugOut: true, jugTp: 999 }).ok) throw new Error("Sic on a jug");
  if (tryAbility("Sic", { recastLeft: 0, targeted: false, distance: 1, bstMain: true, bstLevel: 75, jugOut: true, jugTp: 3000, readyCharges: 3 }).ok) throw new Error("Sic on a jug at 3000");
  const readyFar = tryAbility("Big Scissors", { recastLeft: 0, targeted: false, distance: 1, bstMain: true, bstLevel: 75, jugOut: true, jugCharges: 1, petDistance: 6 });
  if (readyFar.ok || readyFar.recast) throw new Error("Ready out of range");
  const readyNear = tryAbility("Big Scissors", { recastLeft: 0, targeted: false, distance: 1, bstMain: true, bstLevel: 75, jugOut: true, jugCharges: 1, petDistance: 5 });
  if (!readyNear.ok || readyNear.jugReady !== "Big Scissors" || readyNear.recast) throw new Error("Ready at 5");
  if (tryAbility("Bubble Shower", { recastLeft: 0, targeted: false, distance: 1, bstMain: true, bstLevel: 24, jugOut: true, jugCharges: 3 }).ok) throw new Error("Ready before 25");
  const readySub = tryAbility("Bubble Shower", { recastLeft: 0, targeted: false, distance: 1, bstMain: false, bstLevel: 37, jugOut: true, jugCharges: 1 });
  if (!readySub.ok || readySub.jugReady !== "Bubble Shower" || readySub.recast) throw new Error("Ready on a subjob");
  const reward = tryAbility("Reward", { recastLeft: 0, targeted: false, distance: 1, bstMain: true, bstLevel: 75, jugOut: true });
  if (reward.ok || reward.recast) throw new Error("Reward without food");
  const rewardFed = tryAbility("Reward", {
    recastLeft: 0,
    targeted: false,
    distance: 1,
    bstMain: true,
    bstLevel: 75,
    jugOut: true,
    jugItem: FISH_OIL_BROTH,
    mnd: 53,
    zetaLeft: 12,
    petHp: 100,
    petMax: 1732,
  });
  if (!rewardFed.ok || rewardFed.recast !== 90 || rewardFed.hate || rewardFed.reward?.heal !== 924 || rewardFed.reward?.restored !== 924 || rewardFed.reward?.remain !== 11 || rewardFed.reward?.on !== "jug" || rewardFed.reward?.regen !== 14 || rewardFed.reward?.seconds !== 180 || rewardFed.reward?.ve !== 160) {
    throw new Error("Reward zeta");
  }
  if (!rewardFed.text.includes("924") || !rewardFed.text.includes("11 remain")) throw new Error("Reward text");
  const rewardAmmo = tryAbility("Reward", { recastLeft: 0, targeted: false, distance: 1, bstMain: true, bstLevel: 75, jugOut: true, jugItem: null, mnd: 53, zetaLeft: 12, petHp: 0, petMax: 1732 });
  if (!rewardAmmo.ok || rewardAmmo.reward?.heal !== 924) throw new Error("Reward ignores ammo");
  const rewardSub = tryAbility("Reward", { recastLeft: 0, targeted: false, distance: 1, bstMain: false, bstLevel: 37, charmOut: true, mnd: 53, zetaLeft: 1, petHp: 10, petMax: 100 });
  if (!rewardSub.ok || rewardSub.reward?.on !== "charm" || rewardSub.reward.remain !== 0 || rewardSub.reward.restored !== 90) throw new Error("Reward sub");
  const rewardEmpty = tryAbility("Reward", { recastLeft: 0, targeted: false, distance: 1, bstMain: true, bstLevel: 75, jugOut: true, zetaLeft: 0, mnd: 53 });
  if (rewardEmpty.ok || rewardEmpty.recast) throw new Error("Reward empty bag");
  const rewardNoPet = tryAbility("Reward", { recastLeft: 0, targeted: false, distance: 1, bstMain: true, bstLevel: 75, zetaLeft: 12, mnd: 53, wyvernOut: true });
  if (rewardNoPet.ok || rewardNoPet.recast) throw new Error("Reward no pet");
  const rewardFull = tryAbility("Reward", { recastLeft: 0, targeted: false, distance: 1, bstMain: true, bstLevel: 75, jugOut: true, mnd: 53, zetaLeft: 12, petHp: 1732, petMax: 1732 });
  if (!rewardFull.ok || rewardFull.reward?.restored !== 0 || rewardFull.reward?.heal !== 924 || !rewardFull.text.includes("full HP")) throw new Error("Reward overheal");
  const bag = { "pet-food-alpha": 12, "pet-food-epsilon": 4, "pet-food-zeta": 2 };
  const pinned = tryAbility("Reward", { recastLeft: 0, targeted: false, distance: 1, bstMain: true, bstLevel: 75, jugOut: true, mnd: 53, foodCounts: bag, foodId: "pet-food-alpha", petHp: 0, petMax: 2000 });
  if (!pinned.ok || pinned.reward?.foodId !== "pet-food-alpha" || pinned.reward.heal !== 71 || pinned.reward.regen !== 1 || pinned.reward.remain !== 11 || !pinned.text.includes("Pet Food Alpha")) {
    throw new Error("Reward pin");
  }
  const highest = tryAbility("Reward", { recastLeft: 0, targeted: false, distance: 1, bstMain: true, bstLevel: 75, jugOut: true, mnd: 53, foodCounts: bag, foodId: null, petHp: 0, petMax: 2000 });
  if (!highest.ok || highest.reward?.foodId !== "pet-food-zeta" || highest.reward.heal !== 924 || highest.reward.regen !== 14 || highest.reward.remain !== 1) throw new Error("Reward highest");
  const fallback = tryAbility("Reward", { recastLeft: 0, targeted: false, distance: 1, bstMain: true, bstLevel: 75, jugOut: true, mnd: 53, foodCounts: { "pet-food-alpha": 0, "pet-food-epsilon": 4 }, foodId: "pet-food-alpha", petHp: 0, petMax: 2000 });
  if (!fallback.ok || fallback.reward?.foodId !== "pet-food-epsilon" || fallback.reward.heal !== 739 || fallback.reward.regen !== 11 || fallback.reward.remain !== 3) throw new Error("Reward empty pin");
  const copied = tryAbility("Reward", { recastLeft: 0, targeted: false, distance: 1, bstMain: true, bstLevel: 75, jugOut: true, mnd: 53, foodCounts: bag, foodId: "pet-food-alpha", foodCopy: true, petHp: 0, petMax: 2000 });
  if (!copied.ok || copied.reward?.copy !== true || copied.reward.foodId !== "pet-food-alpha" || copied.reward.heal !== 71 || copied.reward.regen !== 1 || copied.reward.remain !== 12 || !copied.text.includes("copy of Pet Food Alpha") || copied.text.includes("11 remain")) {
    throw new Error("Reward copy");
  }
  const copiedHighest = tryAbility("Reward", { recastLeft: 0, targeted: false, distance: 1, bstMain: true, bstLevel: 75, jugOut: true, mnd: 53, foodCounts: bag, foodId: null, foodCopy: true, petHp: 100, petMax: 2000 });
  if (!copiedHighest.ok || copiedHighest.reward?.foodId !== "pet-food-zeta" || copiedHighest.reward.remain !== 2 || copiedHighest.reward.copy !== true || copiedHighest.reward.restored !== 924) {
    throw new Error("Reward copy of the unpinned biscuit");
  }
  const copiedGone = tryAbility("Reward", { recastLeft: 0, targeted: false, distance: 1, bstMain: true, bstLevel: 75, jugOut: true, mnd: 53, foodCounts: { "pet-food-alpha": 0 }, foodId: "pet-food-alpha", foodCopy: true });
  if (copiedGone.ok || copiedGone.recast) throw new Error("Reward copy of an empty bag");
  if (tryAbility("Feral Howl", { recastLeft: 0, targeted: true, distance: 1, bstMain: true, bstLevel: 75 }).text !== "Feral Howl is not unlocked.") throw new Error("Feral Howl");
  if (tryAbility("Snarl", { recastLeft: 0, targeted: false, distance: 1, bstMain: false, bstLevel: 37, jugOut: true }).ok) throw new Error("Snarl sub");
  const charmCtx = {
    recastLeft: 0,
    targeted: true,
    distance: 5,
    bstMain: true,
    bstLevel: 75,
    playerLevel: 75,
    playerChr: 70,
    targetLevel: 75,
    targetChr: 65,
  };
  if (tryAbility("Charm", { ...charmCtx, distance: 19 }).ok) throw new Error("Charm range");
  if (tryAbility("Charm", { ...charmCtx, jugOut: true, charmRoll: 1 }).ok) throw new Error("Charm with a pet");
  const charmMiss = tryAbility("Charm", { ...charmCtx, charmRoll: 55 });
  if (!charmMiss.ok || charmMiss.charmKeep || charmMiss.recast !== 15 || !charmMiss.claims || charmMiss.quietClaim || charmMiss.charmFx !== "miss") {
    throw new Error("Charm miss");
  }
  const charmLand = tryAbility("Charm", { ...charmCtx, charmRoll: 54 });
  if (!charmLand.ok || !charmLand.charmKeep || charmLand.charmSeconds !== 237 || !charmLand.quietClaim || charmLand.charmFx !== "land" || !charmLand.text.includes("3:57")) {
    throw new Error("Charm land");
  }
  const gauge = tryAbility("Gauge", charmCtx);
  if (!gauge.ok || gauge.recast !== 30 || !gauge.text.includes("might be able")) throw new Error("Gauge");
  const gaugeSub = tryAbility("Gauge", { ...charmCtx, bstMain: false, bstLevel: 37 });
  if (!gaugeSub.ok || !gaugeSub.text.includes("cannot charm")) throw new Error("Gauge sub");
  if (!tryAbility("Fight", { ...charmCtx, charmOut: true }).ok) throw new Error("Fight on a charm");
  const sicFar = tryAbility("Sic", { ...charmCtx, charmOut: true, charmTp: 1000, petDistance: 5, readyCharges: 3, sicRoll: 0 });
  if (sicFar.ok || sicFar.recast) throw new Error("Sic out of range");
  const sicDry = tryAbility("Sic", { ...charmCtx, charmOut: true, charmTp: 1000, petDistance: 4, readyCharges: 2, sicRoll: 0 });
  if (sicDry.ok || sicDry.recast) throw new Error("Sic needs a full bank");
  const sicKick = tryAbility("Sic", { ...charmCtx, charmOut: true, charmTp: 1000, petDistance: 4, readyCharges: 3, sicRoll: 0 });
  if (!sicKick.ok || sicKick.sic?.queued || sicKick.sic?.move !== "Foot Kick" || sicKick.recast !== 90 || sicKick.hate?.ve !== 160 || sicKick.hate?.ce !== 0) throw new Error("Sic Foot Kick");
  const sicWhirl = tryAbility("Sic", { ...charmCtx, charmOut: true, charmTp: 1000, sicRoll: 1 });
  if (!sicWhirl.ok || sicWhirl.sic?.move !== "Whirl Claws" || sicWhirl.sic.queued) throw new Error("Sic Whirl Claws");
  const sicDust = tryAbility("Sic", { ...charmCtx, charmOut: true, charmTp: 1000, sicRoll: 2 });
  if (sicDust.sic?.move !== "Dust Cloud") throw new Error("Sic Dust Cloud");
  const sicCarrot = tryAbility("Sic", { ...charmCtx, charmOut: true, charmTp: 1000, sicRoll: 3 });
  if (sicCarrot.sic?.move !== "Wild Carrot") throw new Error("Sic Wild Carrot");
  const sicQueue = tryAbility("Sic", { ...charmCtx, charmOut: true, charmTp: 400, petDistance: 4, readyCharges: 3 });
  if (!sicQueue.ok || !sicQueue.sic?.queued || sicQueue.sic.move || sicQueue.recast !== 90 || sicQueue.hate?.ve !== 160) throw new Error("Sic queues under 1000");
  const sicOpen = tryAbility("Sic", { ...charmCtx, charmOut: true, charmTp: 1000 });
  if (!sicOpen.ok || sicOpen.sic?.move !== "Foot Kick" || sicOpen.recast !== 90) throw new Error("Sic omitted distance stays in range");
  if (tryAbility("Foot Kick", { ...charmCtx, charmOut: true, charmTp: 1000 }).ok) throw new Error("Foot Kick is not ordered");
  if (tryAbility("Call Beast", { ...charmCtx, jugItem: FISH_OIL_BROTH, jugLeft: 12, charmOut: true }).ok) throw new Error("Call Beast during charm");
  const familiarCharm = tryAbility("Familiar", { ...charmCtx, charmOut: true });
  if (!familiarCharm.ok || !familiarCharm.familiar) throw new Error("Familiar on a charm");
  const tameCtx = { ...charmCtx, playerInt: 53, targetInt: 58 };
  if (tryAbility("Tame", { ...tameCtx, charmOut: true, charmRoll: 1 }).ok) throw new Error("Tame with a pet");
  if (tryAbility("Tame", { ...tameCtx, distance: 19, charmRoll: 1 }).ok) throw new Error("Tame range");
  const tameMiss = tryAbility("Tame", { ...tameCtx, charmRoll: 45 });
  if (!tameMiss.ok || tameMiss.tameKeep || tameMiss.recast !== 600 || tameMiss.hate || tameMiss.claims) throw new Error("Tame miss");
  const tameLand = tryAbility("Tame", { ...tameCtx, charmRoll: 44 });
  if (!tameLand.ok || !tameLand.tameKeep || tameLand.recast !== 600 || tameLand.hate) throw new Error("Tame land");
  const tameBlocked = tryAbility("Tame", { ...tameCtx, charmRoll: 1, sharedHate: true });
  if (!tameBlocked.ok || tameBlocked.tameKeep || tameBlocked.recast !== 600 || !tameBlocked.text.includes("no effect")) throw new Error("Tame shared hate");
  const charmBoost = tryAbility("Charm", { ...charmCtx, charmRoll: 64, tameBonus: 10 });
  if (!charmBoost.ok || !charmBoost.charmKeep || !charmBoost.text.includes("Tame's 10")) throw new Error("Charm after Tame");
  const charmBoostMiss = tryAbility("Charm", { ...charmCtx, charmRoll: 65, tameBonus: 10 });
  if (!charmBoostMiss.ok || charmBoostMiss.charmKeep || !charmBoostMiss.text.includes("Tame's 10")) throw new Error("Charm after Tame misses");
  const gaugeTame = tryAbility("Gauge", { ...charmCtx, playerChr: 85, tameBonus: 10 });
  if (!gaugeTame.ok || !gaugeTame.text.includes("might") || gaugeTame.text.includes("should")) throw new Error("Gauge counts Tame");
  if (tryAbility("Azure Lore", { recastLeft: 0, targeted: false, distance: 1, bluMain: false, bluLevel: 37 }).ok) throw new Error("Azure Lore sub");
  if (tryAbility("Chain Affinity", { recastLeft: 0, targeted: false, distance: 1, bluMain: false, bluLevel: 37 }).ok) throw new Error("Chain Affinity sub");
  if (tryAbility("Convergence", { recastLeft: 0, targeted: false, distance: 1, bluMain: true, bluLevel: 75 }).text !== "Convergence is not unlocked.") throw new Error("Convergence merit");
  if (tryAbility("Diffusion", { recastLeft: 0, targeted: false, distance: 1, bluMain: true, bluLevel: 75 }).text !== "Diffusion is not unlocked.") throw new Error("Diffusion merit");
  if (tryAbility("Efflux", { recastLeft: 0, targeted: false, distance: 1, bluMain: true, bluLevel: 75 }).text !== "Efflux is not learned.") throw new Error("Efflux");
  const lore = tryAbility("Azure Lore", { recastLeft: 0, targeted: false, distance: 1, bluMain: true, bluLevel: 75 });
  if (!lore.ok || lore.recast !== 3600 || lore.buff?.name !== "Azure Lore" || lore.buff.duration !== 30 || lore.hate?.ce !== 1 || lore.hate.ve !== 300) throw new Error("Azure Lore");
  const burst = tryAbility("Burst Affinity", { recastLeft: 0, targeted: false, distance: 1, bluMain: false, bluLevel: 37 });
  if (!burst.ok || burst.recast !== 120 || burst.buff?.duration !== 30 || burst.hate?.ve !== 300) throw new Error("Burst Affinity sub");
  if (tryAbility("Burst Affinity", { recastLeft: 1, targeted: false, distance: 1, bluMain: true, bluLevel: 75 }).ok) throw new Error("Burst Affinity recast");
  const bluChain = tryAbility("Chain Affinity", { recastLeft: 0, targeted: false, distance: 1, bluMain: true, bluLevel: 75 });
  if (!bluChain.ok || bluChain.buff?.name !== "Chain Affinity" || bluChain.recast !== 120) throw new Error("Chain Affinity");
  if (tryAbility("Overdrive", { recastLeft: 0, targeted: false, distance: 1, pupMain: false, pupLevel: 37 }).ok) throw new Error("Overdrive sub");
  const hunterRoll = meleeStats(sword, [{ name: "Hunter's Roll", power: 4 }]);
  if (hunterRoll.accuracy !== 140) throw new Error(`Hunter's Roll ${hunterRoll.accuracy}`);
  const chaosRoll = meleeStats(sword, [{ name: "Chaos Roll", power: 4 }]);
  if (chaosRoll.attack !== 437) throw new Error(`Chaos Roll ${chaosRoll.attack}`);
  const ninjaRoll = meleeStats(sword, [{ name: "Ninja Roll", power: 4 }]);
  if (ninjaRoll.evasion !== 120) throw new Error(`Ninja Roll ${ninjaRoll.evasion}`);
  const rogueRoll = meleeStats(sword, [{ name: "Rogue's Roll", power: 5 }]);
  if (rogueRoll.crit !== 22) throw new Error(`Rogue's Roll ${rogueRoll.crit}`);
  if (tryAbility("Wild Card", { recastLeft: 0, targeted: false, distance: 1, corMain: false, corLevel: 37 }).ok) throw new Error("Wild Card sub");
  if (tryAbility("Fire Shot", { recastLeft: 0, targeted: true, distance: 1, corMain: false, corLevel: 37, gun: true, bullet: true }).ok) throw new Error("Quick Draw sub");
  if (tryAbility("Evoker's Roll", { recastLeft: 0, targeted: false, distance: 1, corMain: false, corLevel: 37, die: 1 }).ok) throw new Error("Evoker's Roll sub");
  const busted = tryAbility("Double-Up", { recastLeft: 0, targeted: false, distance: 1, corMain: true, corLevel: 75, die: 6, rolls: [{ name: "Corsair's Roll", left: 280, power: 6 }] });
  if (!busted.ok || !busted.roll?.bust) throw new Error("bust over 11");
  const eyed = tryAbility("Corsair's Roll", { recastLeft: 0, targeted: false, distance: 1, corMain: true, corLevel: 75, die: 6, snake: true, partyJobs: [] });
  if (!eyed.ok || eyed.roll?.power !== 101) throw new Error("snake eye forces 1");
  const two = tryAbility("Hunter's Roll", { recastLeft: 0, targeted: false, distance: 1, corMain: true, corLevel: 75, die: 1, rolls: [{ name: "Corsair's Roll", left: 200, power: 1 }, { name: "Ninja Roll", left: 200, power: 1 }] });
  if (two.ok) throw new Error("two-roll cap");
  const windowed = tryAbility("Double-Up", { recastLeft: 0, targeted: false, distance: 1, corMain: true, corLevel: 75, die: 1, rolls: [{ name: "Hunter's Roll", left: 255, power: 4 }] });
  if (windowed.ok) throw new Error("double-up window");
  if (tryAbility("Maintenance", { recastLeft: 0, targeted: false, distance: 1, pupMain: false, pupLevel: 37 }).ok) throw new Error("Maintenance sub");
  if (tryAbility("Ventriloquy", { recastLeft: 0, targeted: false, distance: 1, pupMain: true, pupLevel: 75 }).text !== "Ventriloquy is not unlocked.") throw new Error("Ventriloquy merit");
  if (tryAbility("Role Reversal", { recastLeft: 0, targeted: false, distance: 1, pupMain: true, pupLevel: 75 }).text !== "Role Reversal is not unlocked.") throw new Error("Role Reversal merit");
  const activateBare = tryAbility("Activate", { recastLeft: 0, targeted: false, distance: 1, pupMain: false, pupLevel: 37 });
  if (activateBare.ok || !activateBare.text.includes("Animator")) throw new Error("Activate needs Animator");
  const activate = tryAbility("Activate", { recastLeft: 0, targeted: false, distance: 1, pupMain: false, pupLevel: 37, animator: true });
  if (!activate.ok || activate.recast !== 1200 || activate.automatonCall !== 1) throw new Error("Activate");
  if (tryAbility("Activate", { recastLeft: 0, targeted: false, distance: 1, pupMain: true, pupLevel: 75, animator: true, automatonOut: true }).ok) throw new Error("Activate twice");
  if (tryAbility("Activate", { recastLeft: 0, targeted: false, distance: 1, pupMain: true, pupLevel: 75, animator: true, otherPet: true }).ok) throw new Error("Activate with a pet");
  if (tryAbility("Activate", { recastLeft: 1, targeted: false, distance: 1, pupMain: true, pupLevel: 75, animator: true }).ok) throw new Error("Activate recast");
  const fireBare = tryAbility("Fire Maneuver", { recastLeft: 0, targeted: false, distance: 1, pupMain: true, pupLevel: 75, animator: true });
  if (fireBare.ok || !fireBare.text.includes("automaton")) throw new Error("Fire Maneuver needs a pet");
  const fire = tryAbility("Fire Maneuver", { recastLeft: 0, targeted: false, distance: 1, pupMain: true, pupLevel: 75, animator: true, automatonOut: true });
  if (!fire.ok || fire.recast !== 10 || fire.buff || fire.maneuver !== "fire") throw new Error("Fire Maneuver");
  if (tryAbility("Deploy", { recastLeft: 0, targeted: false, distance: 1, pupMain: true, pupLevel: 75, animator: true, automatonOut: true }).ok) throw new Error("Deploy needs a target");
  if (tryAbility("Deploy", { recastLeft: 0, targeted: true, distance: 18, pupMain: true, pupLevel: 75, animator: true, automatonOut: true }).ok) throw new Error("Deploy range");
  const deploy = tryAbility("Deploy", { recastLeft: 0, targeted: true, distance: 10, pupMain: false, pupLevel: 37, animator: true, automatonOut: true });
  if (!deploy.ok || deploy.recast !== 5 || deploy.automatonOrder !== "fight") throw new Error("Deploy sub");
  if (tryAbility("Repair", { recastLeft: 0, targeted: false, distance: 1, pupMain: false, pupLevel: 37, animator: true }).ok) throw new Error("Repair needs a pet");
  const repairDry = tryAbility("Repair", { recastLeft: 0, targeted: false, distance: 1, pupMain: false, pupLevel: 37, animator: true, automatonOut: true });
  if (repairDry.ok || repairDry.recast) throw new Error("Repair without oil");
  const repair = tryAbility("Repair", {
    recastLeft: 0,
    targeted: false,
    distance: 1,
    pupMain: false,
    pupLevel: 37,
    animator: true,
    automatonOut: true,
    oilItem: AUTOMATON_OIL,
    oilLeft: 12,
    autoHp: 200,
    autoMax: 800,
  });
  if (!repair.ok || repair.recast !== 90 || repair.automatonRepair?.instant !== 80 || repair.automatonRepair.regen !== 20 || repair.automatonRepair.seconds !== 15 || repair.automatonRepair.remain !== 11 || !repair.text.includes("80 HP now") || !repair.text.includes("11 remain")) {
    throw new Error("Repair oil");
  }
  const repairFull = tryAbility("Repair", { recastLeft: 0, targeted: false, distance: 1, pupMain: true, pupLevel: 75, animator: true, automatonOut: true, oilItem: AUTOMATON_OIL, oilLeft: 1, autoHp: 800, autoMax: 800 });
  if (!repairFull.ok || repairFull.automatonRepair?.remain !== 0 || !repairFull.text.includes("full HP")) throw new Error("Repair full");
  const repairCopy = tryAbility("Repair", { recastLeft: 0, targeted: false, distance: 1, pupMain: true, pupLevel: 75, automatonOut: true, oilItem: AUTOMATON_OIL, oilLeft: 12, oilCopy: true, autoHp: 200, autoMax: 800 });
  if (!repairCopy.ok || repairCopy.automatonRepair?.copy !== true || repairCopy.automatonRepair.remain !== 12 || repairCopy.automatonRepair.instant !== 80 || repairCopy.automatonRepair.regen !== 20 || !repairCopy.text.includes("copy of Automaton Oil") || repairCopy.text.includes("11 remain")) {
    throw new Error("Repair copy");
  }
  const repairCopyDry = tryAbility("Repair", { recastLeft: 0, targeted: false, distance: 1, pupMain: true, pupLevel: 75, automatonOut: true, oilCopy: true, oilLeft: 0 });
  if (repairCopyDry.ok || repairCopyDry.recast) throw new Error("Repair copy without oil");
  if (tryAbility("Fire Maneuver", { recastLeft: 0, targeted: false, distance: 1, pupMain: true, pupLevel: 75, automatonOut: true, oilCopy: true }).ok) throw new Error("oil copy does not skip the animator");
}

export { PROVOKE_RANGE, VE_DECAY, RETALIATION_MOVE, abilityByName, assertAbilities, meleeStats, retaliationProcs, retaliationRate, tryAbility };
 