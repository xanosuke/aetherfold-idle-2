/**
 * Things a hotbar slot can hold, filtered to the Warrior's current level.
 *
 * Sword weapon skills come from the full catalog. Only the ones this
 * Warrior can use are offered. Other weapons still list their skill-5 opener.
 */

import { ITEMS as GEAR, LEVEL } from "./content";
import { spellsKnown, spellByName, spellListName, type Spell } from "./spells";
import { WAR_ABILITIES, warSkill } from "./war";
import { BLM_ABILITIES } from "./blm";
import { WHM_ABILITIES } from "./whm";
import { RDM_ABILITIES } from "./rdm";
import { MNK_ABILITIES } from "./mnk";
import { SAM_ABILITIES } from "./sam";
import { THF_ABILITIES } from "./thf";
import { RNG_ABILITIES } from "./rng";
import { PLD_ABILITIES } from "./pld";
import { NIN_ABILITIES } from "./nin";
import { BRD_ABILITIES } from "./brd";
import { DRK_ABILITIES } from "./drk";
import { DRG_ABILITIES } from "./drg";
import { BLOOD_PACT_RECAST, SMN_ABILITIES, SMN_PACTS, orderedPacts, pactBlurb, pactByName, pactMp, type BloodPact } from "./smn";
import { BST_ABILITIES, CARRIE_READY, RARAB_MOVES } from "./bst";
import { BLU_ABILITIES, BLUE_SPELLS } from "./blu";
import { PUP_ABILITIES } from "./pup";
import { COR_ABILITIES } from "./cor";
import { DNC_ABILITIES } from "./dnc";
import { addendumBlock, SCH_ABILITIES } from "./sch";
import { RUN_ABILITIES } from "./run";
import { GEO_ABILITIES } from "./geo";
import { combinedSkill, subjobLevel } from "./jobs";
import type { JobId } from "./stats";
import { ARCHERY_SKILLS, AXE_SKILLS, CLUB_SKILLS, DAGGER_SKILLS, GREAT_AXE_SKILLS, GREAT_KATANA_SKILLS, GREAT_SWORD_SKILLS, HAND_SKILLS, KATANA_SKILLS, MARKSMANSHIP_SKILLS, POLEARM_SKILLS, SCYTHE_SKILLS, STAFF_SKILLS, SWORD_SKILLS, archeryByName, axeByName, blmCanUse, clubByName, daggerByName, greatAxeByName, greatKatanaByName, greatSwordByName, handByName, katanaByName, marksmanshipByName, mnkCanUse, thfCanUse, samCanUse, modText, polearmByName, pldCanUse, ninCanUse, brdCanUse, drkCanUse, drgCanUse, smnCanUse, bstCanUse, bluCanUse, pupCanUse, corCanUse, dncCanUse, schCanUse, runCanUse, geoCanUse, rdmCanUse, rngCanUse, scytheByName, staffByName, swordByName, warArcheryList, warAxeList, warCanUse, warCanUseArchery, warCanUseAxe, warCanUseClub, warCanUseDagger, warCanUseGreatAxe, warCanUseGreatKatana, warCanUseGreatSword, warCanUseHand, warCanUseKatana, warCanUseMarksmanship, warCanUsePolearm, warCanUseScythe, warCanUseStaff, warClubList, warDaggerList, warGreatAxeList, warGreatKatanaList, warGreatSwordList, warHandList, warKatanaList, warMarksmanshipList, warPolearmList, warScytheList, warStaffList, warSwordList, chainText, whmCanUse, type WsContext } from "./weaponskills";

export type HotKind = "ability" | "spell" | "item" | "weaponskill" | "ranged";

export type HotAction = {
  id: string;
  name: string;
  kind: HotKind;
  /** Weapon skill this action belongs to, when it is a weapon skill. */
  weapon?: string;
  /** Combat skill required. */
  skill?: number;
  /**
   * Seconds until the slot can be used again.
   * Abilities, spells, and items always carry one. Weapon skills do not.
   */
  recast?: number;
  /** Spell cast time, in seconds. Melee waits this out. */
  cast?: number;
  /** Item activate time, in seconds. Melee and other actions wait this out. */
  activate?: number;
  detail: string;
  /** Picker text when it differs from the spell name. Slots keep `name`. */
  label?: string;
};

/** The hotbar counts these down. Weapon skills wait on TP instead. */
export function countsDown(kind: HotKind): boolean {
  return kind === "ability" || kind === "spell" || kind === "item";
}

const WEAPON_SKILLS: readonly { weapon: string; name: string; skill: number }[] = [];

function slug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/** Songs whose default two-letter mark hits another bar action or another song. */
const SONG_MARK: Record<string, string> = {
  "Army's Paeon": "PA",
  "Army's Paeon II": "N2",
  "Army's Paeon III": "N3",
  "Army's Paeon IV": "N4",
  "Foe Requiem": "1Q",
  "Foe Requiem II": "2Q",
  "Foe Requiem III": "3Q",
  "Foe Requiem IV": "4Q",
  "Victory March": "VH",
  "Advancing March": "AV",
  "Hunter's Prelude": "HU",
  "Archer's Prelude": "AR",
  "Lightning Threnody": "LN",
  "Dark Threnody": "DY",
  "Earth Threnody": "EH",
  "Water Threnody": "WH",
  "Wind Threnody": "WN",
  "Fire Threnody": "TF",
  "Ice Threnody": "IH",
  "Sword Madrigal": "SR",
  "Blade Madrigal": "LM",
  "Sheepfoe Mambo": "MM",
  "Foe Lullaby": "LB",
  "Scop's Operetta": "OT",
  "Knight's Minne II": "2K",
  "Knight's Minne III": "3K",
  "Spirited Etude": "MN",
  "Logical Etude": "ND",
  "Vital Etude": "VL",
  "Dextrous Etude": "DX",
  "Sinewy Etude": "SQ",
  "Bewitching Etude": "RH",
  "Sage Etude": "SJ",
  "Swift Etude": "FX",
  "Lightning Carol": "GL",
  "Earth Carol": "EA",
  "Water Carol": "OC",
  "Wind Carol": "NC",
  "Fire Carol": "YC",
  "Battlefield Elegy": "YG",
  "Fowl Aubade": "AW",
  "Raptor Mazurka": "RZ",
  "Chocobo Mazurka": "CZ",
  "Shining Fantasia": "NF",
  "Mage's Ballad": "ML",
};

export function markOf(name: string) {
  const songMark = SONG_MARK[name];
  if (songMark) return songMark;
  if (name === "Stonega") return "SG";
  if (name === "Stonega II") return "G2";
  if (name === "Stonega III") return "G3";
  if (name === "Blizzaga") return "BG";
  if (name === "Blizzaga II") return "Z2";
  if (name === "Blizzaga III") return "Z3";
  if (name === "Aeroga") return "AG";
  if (name === "Aeroga II") return "R2";
  if (name === "Aeroga III") return "R3";
  if (name === "Firaga") return "FG";
  if (name === "Firaga II") return "I2";
  if (name === "Firaga III") return "I3";
  if (name === "Waterga") return "WG";
  if (name === "Waterga II") return "E2";
  if (name === "Waterga III") return "E3";
  if (name === "Thundaga") return "TG";
  if (name === "Thundaga II") return "U2";
  if (name === "Thundaga III") return "U3";
  if (name === "Freeze") return "FR";
  if (name === "Tornado") return "TO";
  if (name === "Quake") return "QK";
  if (name === "Burst") return "BU";
  if (name === "Flood") return "FD";
  if (name === "Flare") return "FA";
  if (name === "Burn") return "BN";
  if (name === "Frost") return "FT";
  if (name === "Choke") return "CK";
  if (name === "Rasp") return "RP";
  if (name === "Shock") return "SK";
  if (name === "Drown") return "DW";
  if (name === "Blind") return "BD";
  if (name === "Blind II") return "D2";
  if (name === "Bind") return "BI";
  if (name === "Sleep") return "SL";
  if (name === "Sleep II") return "L2";
  if (name === "Sleepga") return "LG";
  if (name === "Sleepga II") return "Q2";
  if (name === "Drain") return "DR";
  if (name === "Aspir") return "AS";
  if (name === "Warp") return "WP";
  if (name === "Warp II") return "P2";
  if (name === "Stoneskin") return "SN";
  if (name === "Poisona") return "PN";
  if (name === "Paralyna") return "PY";
  if (name === "Blindna") return "DN";
  if (name === "Silena") return "SI";
  if (name === "Stona") return "TN";
  if (name === "Viruna") return "VR";
  if (name === "Cursna") return "CN";
  if (name === "Esuna") return "ES";
  if (name === "Sacrifice") return "SF";
  if (name === "Curaga") return "CG";
  if (name === "Curaga II") return "2G";
  if (name === "Curaga III") return "3G";
  if (name === "Curaga IV") return "4G";
  if (name === "Cura") return "CA";
  if (name === "Protect") return "PT";
  if (name === "Protect II") return "2T";
  if (name === "Protect III") return "3T";
  if (name === "Protect IV") return "4T";
  if (name === "Protectra") return "TR";
  if (name === "Protectra II") return "2R";
  if (name === "Protectra III") return "3R";
  if (name === "Protectra IV") return "4R";
  if (name === "Protectra V") return "5R";
  if (name === "Shell") return "SH";
  if (name === "Shell II") return "2H";
  if (name === "Shell III") return "3H";
  if (name === "Shell IV") return "4H";
  if (name === "Shellra") return "LR";
  if (name === "Shellra II") return "2L";
  if (name === "Shellra III") return "3L";
  if (name === "Shellra IV") return "4L";
  if (name === "Shellra V") return "5L";
  if (name === "Regen") return "RG";
  if (name === "Regen II") return "2N";
  if (name === "Regen III") return "3N";
  if (name === "Haste") return "HA";
  if (name === "Refresh") return "RF";
  if (name === "Auspice") return "AU";
  if (name === "Aquaveil") return "AQ";
  if (name === "Blink") return "LK";
  if (name === "Phalanx") return "PX";
  if (name === "Reprisal") return "RL";
  if (name === "Enthunder") return "ET";
  if (name === "Enstone") return "EO";
  if (name === "Enaero") return "NA";
  if (name === "Enblizzard") return "IZ";
  if (name === "Enfire") return "FR";
  if (name === "Enwater") return "WT";
  if (name === "Enthunder II") return "2U";
  if (name === "Enstone II") return "2O";
  if (name === "Enaero II") return "2A";
  if (name === "Enblizzard II") return "2B";
  if (name === "Enfire II") return "2F";
  if (name === "Enwater II") return "2W";
  if (name === "Paralyze") return "PZ";
  if (name === "Paralyze II") return "2Z";
  if (name === "Silence") return "SE";
  if (name === "Slow") return "SO";
  if (name === "Souleater") return "OE";
  if (name === "Blood Weapon") return "OD";
  if (name === "Arcane Circle") return "KC";
  if (name === "Last Resort") return "DV";
  if (name === "Weapon Bash") return "BX";
  if (name === "Consume Mana") return "MP";
  if (name === "Slow II") return "2S";
  if (name === "Gravity") return "GV";
  if (name === "Dispel") return "DS";
  if (name === "Distract") return "DT";
  if (name === "Frazzle") return "FZ";
  if (name === "Inundation") return "IU";
  if (name === "Dia") return "DA";
  if (name === "Dia II") return "2D";
  if (name === "Dia III") return "3D";
  if (name === "Diaga") return "DG";
  if (name === "Poison") return "PS";
  if (name === "Poison II") return "2P";
  if (name === "Poisonga") return "PG";
  if (name === "Bio") return "BO";
  if (name === "Bio II") return "2O";
  if (name === "Bio III") return "3O";
  if (name === "Stun") return "SU";
  if (name === "Erase") return "ER";
  if (name === "Barstonra") return "BS";
  if (name === "Barwatera") return "BW";
  if (name === "Baraera") return "WI";
  if (name === "Barfira") return "BF";
  if (name === "Barblizzara") return "BZ";
  if (name === "Barthundra") return "BT";
  if (name === "Barsleepra") return "LS";
  if (name === "Barpoisonra") return "BP";
  if (name === "Barparalyzra") return "BY";
  if (name === "Barblindra") return "BB";
  if (name === "Barsilencera") return "BC";
  if (name === "Barvira") return "BV";
  if (name === "Barpetra") return "BK";
  if (name === "Hexa Strike") return "HX";
  if (name === "Hundred Fists") return "HF";
  if (name === "Boost") return "OB";
  if (name === "Dodge") return "DD";
  if (name === "Focus") return "FC";
  if (name === "Chakra") return "KA";
  if (name === "Chi Blast") return "CB";
  if (name === "Counterstance") return "CT";
  if (name === "Footwork") return "FW";
  if (name === "Shoulder Tackle") return "TL";
  if (name === "One Inch Punch") return "OP";
  if (name === "Backhand Blow") return "BH";
  if (name === "Raging Fists") return "R1";
  if (name === "Howling Fist") return "HO";
  if (name === "Perfect Dodge") return "PD";
  if (name === "Steal") return "SY";
  if (name === "Sneak Attack") return "NK";
  if (name === "Flee") return "FE";
  if (name === "Trick Attack") return "TQ";
  if (name === "Mug") return "MG";
  if (name === "Hide") return "HD";
  if (name === "Accomplice") return "AP";
  if (name === "Collaborator") return "CQ";
  if (name === "Meikyo Shisui") return "MQ";
  if (name === "Warding Circle") return "WC";
  if (name === "Third Eye") return "3E";
  if (name === "Hasso") return "HZ";
  if (name === "Meditate") return "MD";
  if (name === "Seigan") return "IG";
  if (name === "Sekkanoki") return "KK";
  if (name === "Konzen-ittai") return "KZ";
  if (name === "Tachi: Enpi") return "EP";
  if (name === "Tachi: Hobaku") return "HB";
  if (name === "Tachi: Goten") return "GN";
  if (name === "Tachi: Kagero") return "KG";
  if (name === "Tachi: Jinpu") return "JP";
  if (name === "Tachi: Koki") return "KO";
  if (name === "Tachi: Yukikaze") return "YK";
  if (name === "Tachi: Gekko") return "GE";
  if (name === "Tachi: Kasha") return "KS";
  if (name === "Tachi: Ageha") return "AG";
  if (name === "Tachi: Shoha") return "SH";
  if (name === "Tachi: Kaiten") return "KT";
  if (name === "Tachi: Fudo") return "FD";
  if (name === "Tachi: Rana") return "RN";
  if (name === "Tachi: Mumei") return "MU";
  if (name === "Flaming Arrow") return "FY";
  if (name === "Eagle Eye Shot") return "1E";
  if (name === "Velocity Shot") return "VY";
  if (name === "Sharpshot") return "XP";
  if (name === "Scavenge") return "VC";
  if (name === "Camouflage") return "LF";
  if (name === "Barrage") return "1B";
  if (name === "Shadowbind") return "NB";
  if (name === "Unlimited Shot") return "UL";
  if (name === "Piercing Arrow") return "PR";
  if (name === "Dulling Arrow") return "DU";
  if (name === "Sidewinder") return "SW";
  if (name === "Blast Arrow") return "BA";
  if (name === "Arching Arrow") return "AC";
  if (name === "Empyreal Arrow") return "EY";
  if (name === "Refulgent Arrow") return "RY";
  if (name === "Apex Arrow") return "AX";
  if (name === "Namas Arrow") return "NM";
  if (name === "Jishnu's Radiance") return "JR";
  if (name === "Sarv") return "SV";
  if (name === "Ranged Attack") return "RG";
  if (name === "Invincible") return "IV";
  if (name === "Holy Circle") return "HC";
  if (name === "Shield Bash") return "XB";
  if (name === "Sentinel") return "NL";
  if (name === "Cover") return "CV";
  if (name === "Rampart") return "RM";
  if (name === "Majesty") return "MJ";
  if (name === "Mijin Gakure") return "JG";
  if (name === "Yonin") return "YN";
  if (name === "Innin") return "NN";
  if (name === "Soul Voice") return "OV";
  if (name === "Pianissimo") return "PP";
  if (name === "Blade: Rin") return "BR";
  if (name === "Blade: Retsu") return "RT";
  if (name === "Blade: Teki") return "TK";
  if (name === "Blade: To") return "BO";
  if (name === "Blade: Chi") return "CI";
  if (name === "Blade: Ei") return "EI";
  if (name === "Blade: Jin") return "JI";
  if (name === "Blade: Ten") return "TE";
  if (name === "Blade: Ku") return "KU";
  if (name === "Utsusemi: Ichi") return "UI";
  if (name === "Utsusemi: Ni") return "UN";
  if (name === "Katon: Ichi") return "K1";
  if (name === "Katon: Ni") return "K2";
  if (name === "Katon: San") return "K3";
  if (name === "Huton: Ichi") return "H1";
  if (name === "Huton: Ni") return "H2";
  if (name === "Huton: San") return "H3";
  if (name === "Astral Flow") return "ZW";
  if (name === "Elemental Siphon") return "EH";
  if (name === "Apogee") return "AO";
  if (name === "Assault") return "LT";
  if (name === "Retreat") return "RX";
  if (name === "Release") return "RZ";
  if (name === "Carbuncle") return "KL";
  if (name === "Cait Sith") return "CS";
  if (name === "Ifrit") return "IT";
  if (name === "Shiva") return "HV";
  if (name === "Garuda") return "GD";
  if (name === "Titan") return "TA";
  if (name === "Ramuh") return "RH";
  if (name === "Leviathan") return "LV";
  if (name === "Fenrir") return "FN";
  if (name === "Diabolos") return "DB";
  if (name === "Siren") return "SR";
  if (name === "Atomos") return "AM";
  if (name === "Alexander") return "AX";
  if (name === "Odin") return "ON";
  if (name === "Light Spirit") return "L8";
  if (name === "Fire Spirit") return "F8";
  if (name === "Ice Spirit") return "I8";
  if (name === "Air Spirit") return "A8";
  if (name === "Earth Spirit") return "E8";
  if (name === "Thunder Spirit") return "T8";
  if (name === "Water Spirit") return "W8";
  if (name === "Dark Spirit") return "D8";
  if (name === "Foot Kick") return "FK";
  if (name === "Sandspin") return "5N";
  if (name === "Pollen") return "PL";
  if (name === "Power Attack") return "9A";
  if (name === "Sprout Smack") return "4S";
  if (name === "Wild Oats") return "WO";
  if (name === "Whirl Claws") return "WL";
  if (name === "Dust Cloud") return "DC";
  if (name === "Wild Carrot") return "RC";
  if (name === "Healing Breeze") return "HB";
  if (name === "Sheep Song") return "SP";
  if (name === "Actinic Burst") return "AB";
  if (name === "Plasma Charge") return "PC";
  if (name === "Chaotic Eye") return "CE";
  if (name === "Zephyr Mantle") return "ZM";
  if (name === "Battle Dance") return "9D";
  if (name === "Uppercut") return "UC";
  if (name === "Frenetic Rip") return "3R";
  if (name === "Disseverment") return "5V";
  if (name === "Cocoon") return "8C";
  if (name === "Refueling") return "4U";
  if (name === "Cannonball") return "7B";
  if (name === "Magic Fruit") return "5F";
  if (name === "Memento Mori") return "6M";
  if (name === "Mind Blast") return "3B";
  if (name === "Metallic Body") return "8M";
  if (name === "Queasyshroom") return "QY";
  if (name === "Head Butt") return "6H";
  if (name === "Feather Storm") return "3F";
  if (name === "Helldive") return "1D";
  if (name === "Bludgeon") return "8U";
  if (name === "Cursed Sphere") return "9S";
  if (name === "Blastbomb") return "9B";
  if (name === "Claw Cyclone") return "LW";
  if (name === "Poison Breath") return "PB";
  if (name === "Soporific") return "0P";
  if (name === "Screwdriver") return "7W";
  if (name === "Bomb Toss") return "6T";
  if (name === "Grand Slam") return "0L";
  if (name === "Sound Blast") return "0S";
  if (name === "Death Ray") return "5S";
  if (name === "Smite of Rage") return "8S";
  if (name === "Digest") return "0G";
  if (name === "Pinecone Bomb") return "8B";
  if (name === "MP Drainkiss") return "1K";
  if (name === "Blitzstrahl") return "9Z";
  if (name === "Stinking Gas") return "1N";
  if (name === "Mandibular Bite") return "4I";
  if (name === "Magnetite Cloud") return "9C";
  if (name === "Blank Gaze") return "0Z";
  if (name === "Jet Stream") return "JS";
  if (name === "Mysterious Light") return "9L";
  if (name === "Terror Touch") return "0T";
  if (name === "Venom Shell") return "6V";
  if (name === "Geist Wall") return "GW";
  if (name === "Awful Eye") return "AY";
  if (name === "Blood Saber") return "8R";
  if (name === "Jettatura") return "JT";
  if (name === "Ice Break") return "IB";
  if (name === "Radiant Breath") return "9W";
  if (name === "Feather Barrier") return "0F";
  if (name === "Flying Hip Press") return "6Y";
  if (name === "Light of Penance") return "8N";
  if (name === "Death Scissors") return "2X";
  if (name === "Dimensional Death") return "4D";
  if (name === "Spiral Spin") return "7P";
  if (name === "Maelstrom") return "M5";
  if (name === "Eyes On Me") return "5E";
  if (name === "Seedspray") return "1S";
  if (name === "Bad Breath") return "3W";
  if (name === "Body Slam") return "B1";
  if (name === "1000 Needles") return "8K";
  if (name === "Spinal Cleave") return "3C";
  if (name === "Frypan") return "6P";
  if (name === "Hydro Shot") return "H9";
  if (name === "Feather Tickle") return "F9";
  if (name === "Yawn") return "YW";
  if (name === "Voracious Trunk") return "V9";
  if (name === "Infrasonics") return "I9";
  if (name === "Frost Breath") return "R8";
  if (name === "Sandspray") return "S8";
  if (name === "Corrosive Ooze") return "C8";
  if (name === "Diamondhide") return "D9";
  if (name === "Enervation") return "N8";
  if (name === "Warm-Up") return "WU";
  if (name === "Firespit") return "FP";
  if (name === "Tail Slap") return "LP";
  if (name === "Hysteric Barrage") return "H8";
  if (name === "Regurgitation") return "G9";
  if (name === "Amplification") return "A1";
  if (name === "Asuran Claws") return "6A";
  if (name === "Lowing") return "L1";
  if (name === "Heat Breath") return "EB";
  if (name === "Triumphant Roar") return "T1";
  if (name === "Sickle Slash") return "K8";
  if (name === "Sub-zero Smash") return "Z8";
  if (name === "Saline Coat") return "C7";
  if (name === "Ram Charge") return "R7";
  if (name === "Temporal Shift") return "TM";
  if (name === "Magic Hammer") return "LH";
  if (name === "Reactor Cool") return "IR";
  if (name === "Exuviation") return "XU";
  if (name === "Vertical Cleave") return "VX";
  if (name === "Azure Lore") return "ZL";
  if (name === "Burst Affinity") return "YF";
  if (name === "Chain Affinity") return "NY";
  if (name === "Convergence") return "VG";
  if (name === "Diffusion") return "DF";
  if (name === "Overdrive") return "P0";
  if (name === "Activate") return "P1";
  if (name === "Deactivate") return "P3";
  if (name === "Deploy") return "P4";
  if (name === "Fire Maneuver") return "P5";
  if (name === "Ice Maneuver") return "P6";
  if (name === "Wind Maneuver") return "P7";
  if (name === "Earth Maneuver") return "P8";
  if (name === "Thunder Maneuver") return "P9";
  if (name === "Water Maneuver") return "Q0";
  if (name === "Light Maneuver") return "Q1";
  if (name === "Dark Maneuver") return "Q3";
  if (name === "Deus Ex Automata") return "Q4";
  if (name === "Retrieve") return "Q5";
  if (name === "Repair") return "Q6";
  if (name === "Maintenance") return "Q7";
  if (name === "Wild Card") return "J0";
  if (name === "Corsair's Roll") return "J1";
  if (name === "Double-Up") return "J2";
  if (name === "Ninja Roll") return "J3";
  if (name === "Hunter's Roll") return "J4";
  if (name === "Chaos Roll") return "J5";
  if (name === "Magus's Roll") return "J6";
  if (name === "Healer's Roll") return "J7";
  if (name === "Drachen Roll") return "J8";
  if (name === "Choral Roll") return "J9";
  if (name === "Monk's Roll") return "O0";
  if (name === "Beast Roll") return "O1";
  if (name === "Samurai Roll") return "O2";
  if (name === "Evoker's Roll") return "O3";
  if (name === "Rogue's Roll") return "O4";
  if (name === "Warlock's Roll") return "O5";
  if (name === "Fighter's Roll") return "O6";
  if (name === "Puppet Roll") return "O7";
  if (name === "Gallant's Roll") return "O8";
  if (name === "Wizard's Roll") return "O9";
  if (name === "Dancer's Roll") return "U0";
  if (name === "Scholar's Roll") return "U1";
  if (name === "Naturalist's Roll") return "U4";
  if (name === "Runeist's Roll") return "U5";
  if (name === "Fire Shot") return "U6";
  if (name === "Ice Shot") return "U7";
  if (name === "Wind Shot") return "U8";
  if (name === "Earth Shot") return "U9";
  if (name === "Thunder Shot") return "I0";
  if (name === "Water Shot") return "I1";
  if (name === "Light Shot") return "I4";
  if (name === "Dark Shot") return "I5";
  if (name === "Random Deal") return "I6";
  if (name === "Snake Eye") return "I7";
  if (name === "Fold") return "H0";
  if (name === "Hot Shot") return "Q8";
  if (name === "Split Shot") return "Q9";
  if (name === "Sniper Shot") return "N1";
  if (name === "Slug Shot") return "S9";
  if (name === "Blast Shot") return "B8";
  if (name === "Heavy Shot") return "K5";
  if (name === "Detonator") return "D6";
  if (name === "Numbing Shot") return "K6";
  if (name === "Last Stand") return "K7";
  if (name === "Coronach") return "K9";
  if (name === "Wildfire") return "W9";
  if (name === "Trueflight") return "F1";
  if (name === "Leaden Salute") return "L9";
  if (name === "Terminus") return "X9";
  if (name === "Trance") return "Y0";
  if (name === "Drain Samba") return "Y1";
  if (name === "Curing Waltz") return "Y2";
  if (name === "Animated Flourish") return "Y3";
  if (name === "Quickstep") return "Y4";
  if (name === "Aspir Samba") return "Y5";
  if (name === "Divine Waltz") return "Y6";
  if (name === "Spectral Jig") return "Y7";
  if (name === "Box Step") return "Y8";
  if (name === "Curing Waltz II") return "Y9";
  if (name === "Desperate Flourish") return "Z0";
  if (name === "Drain Samba II") return "Z1";
  if (name === "Healing Waltz") return "Z4";
  if (name === "Reverse Flourish") return "Z5";
  if (name === "Stutter Step") return "Z6";
  if (name === "Curing Waltz III") return "Z7";
  if (name === "Haste Samba") return "Z9";
  if (name === "Violent Flourish") return "V0";
  if (name === "Building Flourish") return "V1";
  if (name === "Contradance") return "V5";
  if (name === "Chocobo Jig") return "V6";
  if (name === "Aspir Samba II") return "V7";
  if (name === "Wild Flourish") return "V8";
  if (name === "Drain Samba III") return "W0";
  if (name === "Curing Waltz IV") return "W1";
  if (name === "Chocobo Jig II") return "W5";
  if (name === "Tabula Rasa") return "A0";
  if (name === "Light Arts") return "A7";
  if (name === "Dark Arts") return "A9";
  if (name === "Sublimation") return "B0";
  if (name === "Modus Veritas") return "B7";
  if (name === "Penury") return "B9";
  if (name === "Addendum: White") return "C0";
  if (name === "Celerity") return "C1";
  if (name === "Accession") return "C9";
  if (name === "Rapture") return "D0";
  if (name === "Parsimony") return "D1";
  if (name === "Alacrity") return "D7";
  if (name === "Addendum: Black") return "E0";
  if (name === "Manifestation") return "E1";
  if (name === "Ebullience") return "E7";
  if (name === "Geohelix") return "E9";
  if (name === "Hydrohelix") return "F0";
  if (name === "Anemohelix") return "F7";
  if (name === "Pyrohelix") return "G7";
  if (name === "Cryohelix") return "G8";
  if (name === "Ionohelix") return "H7";
  if (name === "Noctohelix") return "K0";
  if (name === "Luminohelix") return "L0";
  if (name === "Elemental Sforzo") return "SZ";
  if (name === "Ignis") return "AD";
  if (name === "Gelus") return "EQ";
  if (name === "Flabra") return "WF";
  if (name === "Tellus") return "AH";
  if (name === "Sulpor") return "AI";
  if (name === "Unda") return "AJ";
  if (name === "Lux") return "AK";
  if (name === "Tenebrae") return "AL";
  if (name === "Vallation") return "AN";
  if (name === "Swordplay") return "SX";
  if (name === "Swipe") return "AZ";
  if (name === "Lunge") return "BJ";
  if (name === "Pflug") return "BQ";
  if (name === "Valiance") return "VA";
  if (name === "Embolden") return "CD";
  if (name === "Vivacious Pulse") return "CF";
  if (name === "Gambit") return "CJ";
  if (name === "Foil") return "CL";
  if (name === "Barstone") return "CM";
  if (name === "Barsleep") return "DQ";
  if (name === "Barwater") return "CP";
  if (name === "Barpoison") return "CR";
  if (name === "Barparalyze") return "CW";
  if (name === "Baraero") return "CX";
  if (name === "Barfire") return "CY";
  if (name === "Barblind") return "DE";
  if (name === "Barblizzard") return "DH";
  if (name === "Barsilence") return "DI";
  if (name === "Barthunder") return "DJ";
  if (name === "Barvirus") return "DK";
  if (name === "Barpetrify") return "DL";
  if (name === "Bolster") return "QA";
  if (name === "Full Circle") return "QB";
  if (name === "Lasting Emanation") return "QC";
  if (name === "Ecliptic Attrition") return "QD";
  if (name === "Collimated Fervor") return "QF";
  if (name === "Life Cycle") return "QG";
  if (name === "Blaze of Glory") return "QH";
  if (name === "Dematerialize") return "QI";
  if (name === "Entrust") return "QJ";
  if (name === "Indi-Poison") return "QL";
  if (name === "Geo-Poison") return "QM";
  if (name === "Indi-Voidance") return "QN";
  if (name === "Geo-Voidance") return "QO";
  if (name === "Indi-Precision") return "QP";
  if (name === "Geo-Precision") return "QQ";
  if (name === "Indi-Regen") return "QR";
  if (name === "Geo-Regen") return "QS";
  if (name === "Indi-Attunement") return "QT";
  if (name === "Geo-Attunement") return "QV";
  if (name === "Indi-Focus") return "QW";
  if (name === "Geo-Focus") return "QX";
  if (name === "Indi-Barrier") return "QZ";
  if (name === "Geo-Barrier") return "JA";
  if (name === "Indi-Refresh") return "JB";
  if (name === "Geo-Refresh") return "JC";
  if (name === "Indi-CHR") return "JD";
  if (name === "Geo-CHR") return "JE";
  if (name === "Indi-MND") return "JF";
  if (name === "Geo-MND") return "JH";
  if (name === "Indi-Fury") return "JJ";
  if (name === "Geo-Fury") return "JK";
  if (name === "Indi-INT") return "JL";
  if (name === "Geo-INT") return "JM";
  if (name === "Indi-AGI") return "JN";
  if (name === "Geo-AGI") return "JO";
  if (name === "Indi-Fend") return "JQ";
  if (name === "Geo-Fend") return "JV";
  if (name === "Indi-VIT") return "JW";
  if (name === "Geo-VIT") return "JX";
  if (name === "Indi-DEX") return "JY";
  if (name === "Geo-DEX") return "JZ";
  if (name === "Indi-Acumen") return "XA";
  if (name === "Geo-Acumen") return "XC";
  if (name === "Indi-STR") return "XD";
  if (name === "Geo-STR") return "XE";
  if (name === "Indi-Slow") return "XF";
  if (name === "Geo-Slow") return "XG";
  if (name === "Indi-Torpor") return "XH";
  if (name === "Geo-Torpor") return "XI";
  if (name === "Indi-Slip") return "XJ";
  if (name === "Geo-Slip") return "XK";
  if (name === "Indi-Languor") return "XL";
  if (name === "Geo-Languor") return "XM";
  if (name === "Indi-Paralysis") return "XN";
  if (name === "Geo-Paralysis") return "XO";
  if (name === "Indi-Vex") return "XQ";
  if (name === "Geo-Vex") return "XR";
  if (name === "Stonera") return "XS";
  if (name === "Watera") return "XT";
  if (name === "Aera") return "XV";
  if (name === "Fira") return "XW";
  if (name === "Blizzara") return "XX";
  if (name === "Thundara") return "XY";
  if (name === "Stonera II") return "XZ";
  if (name === "Watera II") return "ZA";
  const tier = name.match(/^(.*?) (II|III|IV|V|VI)$/);
  if (tier) {
    const n = { II: "2", III: "3", IV: "4", V: "5", VI: "6" }[tier[2] as "II"];
    return `${tier[1][0] ?? ""}${n}`.toUpperCase();
  }
  const parts = name.split(/[\s:]+/).filter(Boolean);
  if (parts.length < 2) return name.slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function abilityClock(seconds: number): string {
  const whole = Math.max(0, Math.round(seconds));
  const h = Math.floor(whole / 3600);
  const m = Math.floor((whole % 3600) / 60);
  const s = whole % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function toAbility(ability: { name: string; recast: number; duration: number; effect: string }): HotAction {
  const recast = `recast ${abilityClock(ability.recast)}`;
  const detail = ability.duration > 0 ? `${abilityClock(ability.duration)} · ${recast}` : recast;
  return {
    id: `ability:${slug(ability.name)}`,
    name: ability.name,
    kind: "ability",
    recast: ability.recast,
    detail,
  };
}

const ABILITIES: HotAction[] = WAR_ABILITIES.filter((ability) => ability.level <= LEVEL).map(toAbility);
const BLM_BAR: HotAction[] = BLM_ABILITIES.filter((ability) => ability.level <= LEVEL).map(toAbility);
const WHM_BAR: HotAction[] = WHM_ABILITIES.filter((ability) => ability.level <= LEVEL && !ability.merit).map(toAbility);
const RDM_BAR: HotAction[] = RDM_ABILITIES.filter((ability) => ability.level <= LEVEL).map(toAbility);
const MNK_BAR: HotAction[] = MNK_ABILITIES.filter((ability) => ability.level <= LEVEL).map(toAbility);
const THF_BAR: HotAction[] = THF_ABILITIES.filter((ability) => ability.level <= LEVEL).map(toAbility);
const SAM_BAR: HotAction[] = SAM_ABILITIES.filter((ability) => ability.level <= LEVEL).map(toAbility);
const RNG_BAR: HotAction[] = RNG_ABILITIES.filter((ability) => ability.level <= LEVEL).map(toAbility);
const PLD_BAR: HotAction[] = PLD_ABILITIES.filter((ability) => ability.level <= LEVEL && !ability.merit).map(toAbility);
const NIN_BAR: HotAction[] = NIN_ABILITIES.filter((ability) => ability.level <= LEVEL && !ability.merit).map(toAbility);
const BRD_BAR: HotAction[] = BRD_ABILITIES.filter((ability) => ability.level <= LEVEL && !ability.merit).map(toAbility);
const DRK_BAR: HotAction[] = DRK_ABILITIES.filter((ability) => ability.level <= LEVEL && !ability.merit).map(toAbility);
const DRG_BAR: HotAction[] = DRG_ABILITIES.filter((ability) => ability.level <= LEVEL && !ability.merit).map(toAbility);
const SMN_BAR: HotAction[] = SMN_ABILITIES.filter((ability) => ability.level <= LEVEL && !ability.merit).map(toAbility);
const BST_BAR: HotAction[] = BST_ABILITIES.filter((ability) => ability.level <= LEVEL && !ability.merit).map(toAbility);
const BLU_BAR: HotAction[] = BLU_ABILITIES.filter((ability) => ability.level <= LEVEL && !ability.merit).map(toAbility);
const PUP_BAR: HotAction[] = PUP_ABILITIES.filter((ability) => ability.level <= LEVEL && !ability.merit).map(toAbility);
const COR_BAR: HotAction[] = COR_ABILITIES.filter((ability) => ability.level <= LEVEL && !ability.merit).map(toAbility);
const DNC_BAR: HotAction[] = DNC_ABILITIES.filter((ability) => ability.level <= LEVEL && !ability.merit).map(toAbility);
const SCH_BAR: HotAction[] = SCH_ABILITIES.filter((ability) => ability.level <= LEVEL && !ability.merit).map(toAbility);
const RUN_BAR: HotAction[] = RUN_ABILITIES.filter((ability) => ability.level <= LEVEL && !ability.merit).map(toAbility);
const GEO_BAR: HotAction[] = GEO_ABILITIES.filter((ability) => ability.level <= LEVEL && !ability.merit).map(toAbility);
const READY_BAR: HotAction[] = CARRIE_READY.map((move) => ({
  id: `ability:${slug(move.name)}`,
  name: move.name,
  kind: "ability" as const,
  recast: 0,
  detail: move.effect,
}));
const RARAB_BAR: HotAction[] = RARAB_MOVES.map((move) => ({
  id: `ability:${slug(move.name)}`,
  name: move.name,
  kind: "ability" as const,
  recast: 0,
  detail: move.effect,
}));

/**
 * Pet TP moves. Courier Carrie's Ready list shows while Fish Oil Broth
 * is in the ammo slot and no quarry is charmed. The rabbit's moves show
 * only while that quarry is kept. A move already on the hotbar stays
 * there after Leave or after the jug comes off.
 * Fight, Heel, Stay, Sic, Leave, and Snarl stay on the list.
 */
const CARRIE_TP_MOVES = new Set(["Bubble Shower", "Bubble Curtain", "Big Scissors", "Scissor Guard", "Metallic Body"]);
const RARAB_TP_MOVES = new Set(["Foot Kick", "Whirl Claws", "Dust Cloud", "Wild Carrot"]);

export function isCarrieTpMove(name: string): boolean {
  return CARRIE_TP_MOVES.has(name);
}

export function isRarabTpMove(name: string): boolean {
  return RARAB_TP_MOVES.has(name);
}

export function isPetTpMove(name: string): boolean {
  return isCarrieTpMove(name) || isRarabTpMove(name);
}

function toPact(pact: BloodPact): HotAction {
  const cost = pact.name === "Zantetsuken" || pact.name === "Perfect Defense" ? "All MP" : `${pactMp(pact, LEVEL)} MP`;
  return {
    id: `pact:${slug(pact.name)}`,
    name: pact.name,
    kind: "ability",
    recast: BLOOD_PACT_RECAST,
    detail: `${pact.avatar} · ${pact.kind === "ward" ? "Ward" : "Rage"} · ${cost}. ${pactBlurb(pact)}`,
  };
}

/** Every non-merit pact through 75, grouped by avatar and then by level. findAction resolves these even when the bar filters them. */
const PACT_BAR: HotAction[] = orderedPacts(SMN_PACTS.filter((pact) => pact.level <= LEVEL && !pact.merit)).map(toPact);

export function bloodPactActions(job: JobId, sub: JobId | null): HotAction[] {
  if (job === "SMN") return PACT_BAR;
  if (sub !== "SMN") return [];
  const subLv = subjobLevel(LEVEL);
  return orderedPacts(SMN_PACTS.filter((pact) => !pact.merit && !pact.astral && pact.access === "sub" && pact.level <= subLv)).map(toPact);
}

/** Main job abilities, plus subjob abilities that a normal subjob can use. */
export function barAbilities(job: JobId = "WAR", sub: JobId | null = null): HotAction[] {
  const main = job === "BLM" ? BLM_BAR : job === "WHM" ? WHM_BAR : job === "RDM" ? RDM_BAR : job === "MNK" ? MNK_BAR : job === "THF" ? THF_BAR : job === "SAM" ? SAM_BAR : job === "RNG" ? RNG_BAR : job === "PLD" ? PLD_BAR : job === "NIN" ? NIN_BAR : job === "BRD" ? BRD_BAR : job === "DRK" ? DRK_BAR : job === "DRG" ? DRG_BAR : job === "SMN" ? SMN_BAR : job === "BST" ? [...BST_BAR, ...READY_BAR, ...RARAB_BAR] : job === "BLU" ? BLU_BAR : job === "PUP" ? PUP_BAR : job === "COR" ? COR_BAR : job === "DNC" ? DNC_BAR : job === "SCH" ? SCH_BAR : job === "RUN" ? RUN_BAR : job === "GEO" ? GEO_BAR : ABILITIES;
  if (!sub || sub === job) return main;
  const subLv = subjobLevel(LEVEL);
  const rows = (sub === "BLM" ? BLM_ABILITIES : sub === "WHM" ? WHM_ABILITIES : sub === "RDM" ? RDM_ABILITIES : sub === "MNK" ? MNK_ABILITIES : sub === "THF" ? THF_ABILITIES : sub === "SAM" ? SAM_ABILITIES : sub === "RNG" ? RNG_ABILITIES : sub === "PLD" ? PLD_ABILITIES : sub === "NIN" ? NIN_ABILITIES : sub === "BRD" ? BRD_ABILITIES : sub === "DRK" ? DRK_ABILITIES : sub === "DRG" ? DRG_ABILITIES : sub === "SMN" ? SMN_ABILITIES : sub === "BST" ? BST_ABILITIES : sub === "BLU" ? BLU_ABILITIES : sub === "PUP" ? PUP_ABILITIES : sub === "COR" ? COR_ABILITIES : sub === "DNC" ? DNC_ABILITIES : sub === "SCH" ? SCH_ABILITIES : sub === "RUN" ? RUN_ABILITIES : sub === "GEO" ? GEO_ABILITIES : WAR_ABILITIES).filter((ability) => ability.level <= subLv && ability.access === "sub" && !("merit" in ability && ability.merit));
  const have = new Set(main.map((ability) => ability.name));
  return [...main, ...rows.filter((ability) => !have.has(ability.name)).map(toAbility)];
}

const SPELLS: HotAction[] = spellsKnown({ WAR: LEVEL }).flatMap((spell) => {
  if (spell.recast == null) return [];
  return [{
    id: `spell:${slug(spell.name)}`,
    name: spell.name,
    kind: "spell" as const,
    recast: spell.recast,
    cast: spell.cast,
    detail: spell.mp != null ? `${spell.mp} MP` : spell.school,
  }];
});

function toSpell(spell: Spell, job: JobId, sub: JobId | null): HotAction {
  const support = sub && sub !== job ? sub : null;
  const label = spellListName(spell, job, support, LEVEL, support ? subjobLevel(LEVEL) : 0);
  return {
    id: `spell:${slug(spell.name)}`,
    name: spell.name,
    ...(label === spell.name ? {} : { label }),
    kind: "spell",
    recast: spell.recast,
    cast: spell.cast,
    detail: spell.mp != null ? `${spell.mp} MP` : spell.school,
  };
}

/** Spells this main and support job have learned that carry a recast. Set blue magic is included only for a Blue Mage main. */
export function barSpells(job: JobId, sub: JobId | null, blueSet: readonly string[] = []): HotAction[] {
  const levels: Partial<Record<JobId, number>> = { [job]: LEVEL };
  if (sub && sub !== job) levels[sub] = subjobLevel(LEVEL);
  const set = job === "BLU" ? new Set(blueSet) : undefined;
  return spellsKnown(levels, set, job).flatMap((spell) => (spell.recast == null ? [] : [toSpell(spell, job, sub)]));
}

/**
 * Why a learned addendum spell cannot be used yet.
 * Null means the slot can be used. The spell can still be assigned either way.
 * A main or support job that already learned it is never sealed.
 */
export function addendumHold(name: string, buffs: readonly { name: string }[], job: JobId, sub: JobId | null): string | null {
  const spell = spellByName(name);
  if (!spell) return null;
  return addendumBlock(spell, buffs, job, sub, LEVEL, sub && sub !== job ? subjobLevel(LEVEL) : 0);
}

const STONE_BAR: HotAction[] = barSpells("BLM", null);
const CURE_BAR: HotAction[] = barSpells("WHM", null);
const ENSPELL_BAR: HotAction[] = barSpells("RDM", null).filter((action) => action.name.startsWith("En"));
const RDM_MAGIC: HotAction[] = barSpells("RDM", null);
const PLD_MAGIC: HotAction[] = barSpells("PLD", null);
const NIN_MAGIC: HotAction[] = barSpells("NIN", null);
const BRD_MAGIC: HotAction[] = barSpells("BRD", null);
const DRK_MAGIC: HotAction[] = barSpells("DRK", null);
const SMN_MAGIC: HotAction[] = barSpells("SMN", null);
const SCH_MAGIC: HotAction[] = barSpells("SCH", null);
const RUN_MAGIC: HotAction[] = barSpells("RUN", null);
const GEO_MAGIC: HotAction[] = barSpells("GEO", null);

const BLUE_MAGIC: HotAction[] = BLUE_SPELLS.map((spell) => ({
  id: `spell:${slug(spell.name)}`,
  name: spell.name,
  kind: "spell" as const,
  recast: spell.recast,
  cast: spell.cast,
  detail: `${spell.mp} MP`,
}));

/**
 * Usable items. Each one needs a recast before it can sit on the bar.
 * The yard bag has none yet.
 */
const ITEMS: HotAction[] = [];

/** /ra. Not a job ability. Ammunition is not spent. */
const RANGED_ATTACK: HotAction = {
  id: "ranged:attack",
  name: "Ranged Attack",
  kind: "ranged",
  detail: "Draw, aim, and loose. Ammunition is not spent.",
};

const ALL_WS: HotAction[] = WEAPON_SKILLS.map((ws) => ({
  id: `ws:${slug(ws.name)}`,
  name: ws.name,
  kind: "weaponskill",
  weapon: ws.weapon,
  skill: ws.skill,
  detail: `${ws.weapon} · skill ${ws.skill}`,
}));

function wsFor<T extends { name: string; jobs: readonly string[] }>(
  all: readonly T[],
  war: (ctx: WsContext) => readonly T[],
  skill: number,
  weaponName: string,
  job: JobId,
  sub: JobId | null = null,
): readonly T[] {
  const base = { main: true, level: LEVEL, skill, weaponName, quests: [] as string[], sub };
  if (job === "BLM") return all.filter((ws) => blmCanUse(ws, { ...base, job: "BLM" }) === null);
  if (job === "WHM") return all.filter((ws) => whmCanUse(ws, { ...base, job: "WHM" }) === null);
  if (job === "RDM") return all.filter((ws) => rdmCanUse(ws, { ...base, job: "RDM" }) === null);
  if (job === "MNK") return all.filter((ws) => mnkCanUse(ws, { ...base, job: "MNK" }) === null);
  if (job === "THF") return all.filter((ws) => thfCanUse(ws, { ...base, job: "THF" }) === null);
  if (job === "SAM") return all.filter((ws) => samCanUse(ws, { ...base, job: "SAM" }) === null);
  if (job === "RNG") return all.filter((ws) => rngCanUse(ws, { ...base, job: "RNG" }) === null);
  if (job === "PLD") return all.filter((ws) => pldCanUse(ws, { ...base, job: "PLD" }) === null);
  if (job === "NIN") return all.filter((ws) => ninCanUse(ws, { ...base, job: "NIN" }) === null);
  if (job === "BRD") return all.filter((ws) => brdCanUse(ws, { ...base, job: "BRD" }) === null);
  if (job === "DRK") return all.filter((ws) => drkCanUse(ws, { ...base, job: "DRK" }) === null);
  if (job === "DRG") return all.filter((ws) => drgCanUse(ws, { ...base, job: "DRG" }) === null);
  if (job === "SMN") return all.filter((ws) => smnCanUse(ws, { ...base, job: "SMN" }) === null);
  if (job === "BST") return all.filter((ws) => bstCanUse(ws, { ...base, job: "BST" }) === null);
  if (job === "BLU") return all.filter((ws) => bluCanUse(ws, { ...base, job: "BLU" }) === null);
  if (job === "PUP") return all.filter((ws) => pupCanUse(ws, { ...base, job: "PUP" }) === null);
  if (job === "COR") return all.filter((ws) => corCanUse(ws, { ...base, job: "COR" }) === null);
  if (job === "DNC") return all.filter((ws) => dncCanUse(ws, { ...base, job: "DNC" }) === null);
  if (job === "SCH") return all.filter((ws) => schCanUse(ws, { ...base, job: "SCH" }) === null);
  if (job === "RUN") return all.filter((ws) => runCanUse(ws, { ...base, job: "RUN" }) === null);
  if (job === "GEO") return all.filter((ws) => geoCanUse(ws, { ...base, job: "GEO" }) === null);
  return war({ ...base, job: "WAR" });
}

function swordActions(skill: number, weaponName: string, job: JobId = "WAR", sub: JobId | null = null): HotAction[] {
  return wsFor(SWORD_SKILLS, warSwordList, skill, weaponName, job, sub).map((ws) => ({
    id: `ws:${slug(ws.name)}`,
    name: ws.name,
    kind: "weaponskill" as const,
    weapon: "Sword",
    skill: ws.skill ?? undefined,
    detail: `${ws.skill ?? "weapon"} · ${modText(ws)} · ${chainText(ws)}`,
  }));
}

function marksmanshipActions(skill: number, weaponName: string, job: JobId = "WAR", sub: JobId | null = null): HotAction[] {
  return wsFor(MARKSMANSHIP_SKILLS, warMarksmanshipList, skill, weaponName, job, sub).map((ws) => ({
    id: `ws:${slug(ws.name)}`,
    name: ws.name,
    kind: "weaponskill" as const,
    weapon: "Marksmanship",
    skill: ws.skill ?? undefined,
    detail: `${ws.skill ?? "weapon"} · ${modText(ws)} · ${chainText(ws)}`,
  }));
}

function archeryActions(skill: number, weaponName: string, job: JobId = "WAR", sub: JobId | null = null): HotAction[] {
  return wsFor(ARCHERY_SKILLS, warArcheryList, skill, weaponName, job, sub).map((ws) => ({
    id: `ws:${slug(ws.name)}`,
    name: ws.name,
    kind: "weaponskill" as const,
    weapon: "Archery",
    skill: ws.skill ?? undefined,
    detail: `${ws.skill ?? "weapon"} · ${modText(ws)} · ${chainText(ws)}`,
  }));
}

function greatKatanaActions(skill: number, weaponName: string, job: JobId = "WAR", sub: JobId | null = null): HotAction[] {
  return wsFor(GREAT_KATANA_SKILLS, warGreatKatanaList, skill, weaponName, job, sub).map((ws) => ({
    id: `ws:${slug(ws.name)}`,
    name: ws.name,
    kind: "weaponskill" as const,
    weapon: "Great Katana",
    skill: ws.skill ?? undefined,
    detail: `${ws.skill ?? "weapon"} · ${modText(ws)} · ${chainText(ws)}`,
  }));
}

function katanaActions(skill: number, weaponName: string, job: JobId = "WAR", sub: JobId | null = null): HotAction[] {
  return wsFor(KATANA_SKILLS, warKatanaList, skill, weaponName, job, sub).map((ws) => ({
    id: `ws:${slug(ws.name)}`,
    name: ws.name,
    kind: "weaponskill" as const,
    weapon: "Katana",
    skill: ws.skill ?? undefined,
    detail: `${ws.skill ?? "weapon"} · ${modText(ws)} · ${chainText(ws)}`,
  }));
}

function polearmActions(skill: number, weaponName: string, job: JobId = "WAR", sub: JobId | null = null): HotAction[] {
  return wsFor(POLEARM_SKILLS, warPolearmList, skill, weaponName, job, sub).map((ws) => ({
    id: `ws:${slug(ws.name)}`,
    name: ws.name,
    kind: "weaponskill" as const,
    weapon: "Polearm",
    skill: ws.skill ?? undefined,
    detail: `${ws.skill ?? "weapon"} · ${modText(ws)} · ${chainText(ws)}`,
  }));
}

function scytheActions(skill: number, weaponName: string, job: JobId = "WAR", sub: JobId | null = null): HotAction[] {
  return wsFor(SCYTHE_SKILLS, warScytheList, skill, weaponName, job, sub).map((ws) => ({
    id: `ws:${slug(ws.name)}`,
    name: ws.name,
    kind: "weaponskill" as const,
    weapon: "Scythe",
    skill: ws.skill ?? undefined,
    detail: `${ws.skill ?? "weapon"} · ${modText(ws)} · ${chainText(ws)}`,
  }));
}

function clubActions(skill: number, weaponName: string, job: JobId = "WAR", sub: JobId | null = null): HotAction[] {
  return wsFor(CLUB_SKILLS, warClubList, skill, weaponName, job, sub).map((ws) => ({
    id: `ws:${slug(ws.name)}`,
    name: ws.name,
    kind: "weaponskill" as const,
    weapon: "Club",
    skill: ws.skill ?? undefined,
    detail: `${ws.skill ?? "weapon"} · ${modText(ws)} · ${chainText(ws)}`,
  }));
}

function staffActions(skill: number, weaponName: string, job: JobId = "WAR", sub: JobId | null = null): HotAction[] {
  return wsFor(STAFF_SKILLS, warStaffList, skill, weaponName, job, sub).map((ws) => ({
    id: `ws:${slug(ws.name)}`,
    name: ws.name,
    kind: "weaponskill" as const,
    weapon: "Staff",
    skill: ws.skill ?? undefined,
    detail: `${ws.skill ?? "weapon"} · ${modText(ws)} · ${chainText(ws)}`,
  }));
}

function axeActions(skill: number, weaponName: string, job: JobId = "WAR", sub: JobId | null = null): HotAction[] {
  return wsFor(AXE_SKILLS, warAxeList, skill, weaponName, job, sub).map((ws) => ({
    id: `ws:${slug(ws.name)}`,
    name: ws.name,
    kind: "weaponskill" as const,
    weapon: "Axe",
    skill: ws.skill ?? undefined,
    detail: `${ws.skill ?? "weapon"} · ${modText(ws)} · ${chainText(ws)}`,
  }));
}

function daggerActions(skill: number, weaponName: string, job: JobId = "WAR", sub: JobId | null = null): HotAction[] {
  return wsFor(DAGGER_SKILLS, warDaggerList, skill, weaponName, job, sub).map((ws) => ({
    id: `ws:${slug(ws.name)}`,
    name: ws.name,
    kind: "weaponskill" as const,
    weapon: "Dagger",
    skill: ws.skill ?? undefined,
    detail: `${ws.skill ?? "weapon"} · ${modText(ws)} · ${chainText(ws)}`,
  }));
}

function handActions(skill: number, weaponName: string, job: JobId = "WAR", sub: JobId | null = null): HotAction[] {
  return wsFor(HAND_SKILLS, warHandList, skill, weaponName, job, sub).map((ws) => ({
    id: `ws:${slug(ws.name)}`,
    name: ws.name,
    kind: "weaponskill" as const,
    weapon: "Hand-to-Hand",
    skill: ws.skill ?? undefined,
    detail: `${ws.skill ?? "weapon"} · ${modText(ws)} · ${chainText(ws)}`,
  }));
}

function greatSwordActions(skill: number, weaponName: string, job: JobId = "WAR", sub: JobId | null = null): HotAction[] {
  return wsFor(GREAT_SWORD_SKILLS, warGreatSwordList, skill, weaponName, job, sub).map((ws) => ({
    id: `ws:${slug(ws.name)}`,
    name: ws.name,
    kind: "weaponskill" as const,
    weapon: "Great Sword",
    skill: ws.skill ?? undefined,
    detail: `${ws.skill ?? "weapon"} · ${modText(ws)} · ${chainText(ws)}`,
  }));
}

function greatAxeActions(skill: number, weaponName: string, job: JobId = "WAR", sub: JobId | null = null): HotAction[] {
  return wsFor(GREAT_AXE_SKILLS, warGreatAxeList, skill, weaponName, job, sub).map((ws) => ({
    id: `ws:${slug(ws.name)}`,
    name: ws.name,
    kind: "weaponskill" as const,
    weapon: "Great Axe",
    skill: ws.skill ?? undefined,
    detail: `${ws.skill ?? "weapon"} · ${modText(ws)} · ${chainText(ws)}`,
  }));
}

const ALL_SWORD: HotAction[] = SWORD_SKILLS.map((ws) => ({
  id: `ws:${slug(ws.name)}`,
  name: ws.name,
  kind: "weaponskill" as const,
  weapon: "Sword",
  skill: ws.skill ?? undefined,
  detail: `${ws.skill ?? "weapon"} · ${modText(ws)} · ${chainText(ws)}`,
}));

const ALL_GA: HotAction[] = GREAT_AXE_SKILLS.map((ws) => ({
  id: `ws:${slug(ws.name)}`,
  name: ws.name,
  kind: "weaponskill" as const,
  weapon: "Great Axe",
  skill: ws.skill ?? undefined,
  detail: `${ws.skill ?? "weapon"} · ${modText(ws)} · ${chainText(ws)}`,
}));

const ALL_GS: HotAction[] = GREAT_SWORD_SKILLS.map((ws) => ({
  id: `ws:${slug(ws.name)}`,
  name: ws.name,
  kind: "weaponskill" as const,
  weapon: "Great Sword",
  skill: ws.skill ?? undefined,
  detail: `${ws.skill ?? "weapon"} · ${modText(ws)} · ${chainText(ws)}`,
}));

const ALL_HAND: HotAction[] = HAND_SKILLS.map((ws) => ({
  id: `ws:${slug(ws.name)}`,
  name: ws.name,
  kind: "weaponskill" as const,
  weapon: "Hand-to-Hand",
  skill: ws.skill ?? undefined,
  detail: `${ws.skill ?? "weapon"} · ${modText(ws)} · ${chainText(ws)}`,
}));

const ALL_DAGGER: HotAction[] = DAGGER_SKILLS.map((ws) => ({
  id: `ws:${slug(ws.name)}`,
  name: ws.name,
  kind: "weaponskill" as const,
  weapon: "Dagger",
  skill: ws.skill ?? undefined,
  detail: `${ws.skill ?? "weapon"} · ${modText(ws)} · ${chainText(ws)}`,
}));

const ALL_AXE: HotAction[] = AXE_SKILLS.map((ws) => ({
  id: `ws:${slug(ws.name)}`,
  name: ws.name,
  kind: "weaponskill" as const,
  weapon: "Axe",
  skill: ws.skill ?? undefined,
  detail: `${ws.skill ?? "weapon"} · ${modText(ws)} · ${chainText(ws)}`,
}));

const ALL_STAFF: HotAction[] = STAFF_SKILLS.map((ws) => ({
  id: `ws:${slug(ws.name)}`,
  name: ws.name,
  kind: "weaponskill" as const,
  weapon: "Staff",
  skill: ws.skill ?? undefined,
  detail: `${ws.skill ?? "weapon"} · ${modText(ws)} · ${chainText(ws)}`,
}));

const ALL_CLUB: HotAction[] = CLUB_SKILLS.map((ws) => ({
  id: `ws:${slug(ws.name)}`,
  name: ws.name,
  kind: "weaponskill" as const,
  weapon: "Club",
  skill: ws.skill ?? undefined,
  detail: `${ws.skill ?? "weapon"} · ${modText(ws)} · ${chainText(ws)}`,
}));

const ALL_SCYTHE: HotAction[] = SCYTHE_SKILLS.map((ws) => ({
  id: `ws:${slug(ws.name)}`,
  name: ws.name,
  kind: "weaponskill" as const,
  weapon: "Scythe",
  skill: ws.skill ?? undefined,
  detail: `${ws.skill ?? "weapon"} · ${modText(ws)} · ${chainText(ws)}`,
}));

const ALL_POLE: HotAction[] = POLEARM_SKILLS.map((ws) => ({
  id: `ws:${slug(ws.name)}`,
  name: ws.name,
  kind: "weaponskill" as const,
  weapon: "Polearm",
  skill: ws.skill ?? undefined,
  detail: `${ws.skill ?? "weapon"} · ${modText(ws)} · ${chainText(ws)}`,
}));

const ALL_KATANA: HotAction[] = KATANA_SKILLS.map((ws) => ({
  id: `ws:${slug(ws.name)}`,
  name: ws.name,
  kind: "weaponskill" as const,
  weapon: "Katana",
  skill: ws.skill ?? undefined,
  detail: `${ws.skill ?? "weapon"} · ${modText(ws)} · ${chainText(ws)}`,
}));

const ALL_GK: HotAction[] = GREAT_KATANA_SKILLS.map((ws) => ({
  id: `ws:${slug(ws.name)}`,
  name: ws.name,
  kind: "weaponskill" as const,
  weapon: "Great Katana",
  skill: ws.skill ?? undefined,
  detail: `${ws.skill ?? "weapon"} · ${modText(ws)} · ${chainText(ws)}`,
}));

const ALL_ARCHERY: HotAction[] = ARCHERY_SKILLS.map((ws) => ({
  id: `ws:${slug(ws.name)}`,
  name: ws.name,
  kind: "weaponskill" as const,
  weapon: "Archery",
  skill: ws.skill ?? undefined,
  detail: `${ws.skill ?? "weapon"} · ${modText(ws)} · ${chainText(ws)}`,
}));

const ALL_MARK: HotAction[] = MARKSMANSHIP_SKILLS.map((ws) => ({
  id: `ws:${slug(ws.name)}`,
  name: ws.name,
  kind: "weaponskill" as const,
  weapon: "Marksmanship",
  skill: ws.skill ?? undefined,
  detail: `${ws.skill ?? "weapon"} · ${modText(ws)} · ${chainText(ws)}`,
}));

const ALL: HotAction[] = [...ABILITIES, ...BLM_BAR, ...WHM_BAR, ...RDM_BAR, ...MNK_BAR, ...THF_BAR, ...SAM_BAR, ...RNG_BAR, ...PLD_BAR, ...NIN_BAR, ...BRD_BAR, ...DRK_BAR, ...DRG_BAR, ...SMN_BAR, ...BST_BAR, ...READY_BAR, ...RARAB_BAR, ...BLU_BAR, ...PUP_BAR, ...COR_BAR, ...DNC_BAR, ...SCH_BAR, ...RUN_BAR, ...GEO_BAR, ...SPELLS, ...STONE_BAR, ...CURE_BAR, ...ENSPELL_BAR, ...RDM_MAGIC, ...PLD_MAGIC, ...NIN_MAGIC, ...BRD_MAGIC, ...DRK_MAGIC, ...SMN_MAGIC, ...SCH_MAGIC, ...RUN_MAGIC, ...GEO_MAGIC, ...BLUE_MAGIC, ...ITEMS, RANGED_ATTACK, ...ALL_WS, ...ALL_SWORD, ...ALL_GA, ...ALL_GS, ...ALL_HAND, ...ALL_DAGGER, ...ALL_AXE, ...ALL_STAFF, ...ALL_CLUB, ...ALL_SCYTHE, ...ALL_POLE, ...ALL_KATANA, ...ALL_GK, ...ALL_ARCHERY, ...ALL_MARK];

export function findAction(id: string | null): HotAction | null {
  if (!id) return null;
  return ALL.find((action) => action.id === id) ?? PACT_BAR.find((action) => action.id === id) ?? null;
}

export type HotGroup = { title: string; actions: HotAction[]; empty: string };

export type RangeBar = { kind: string; skill: number; weapon: string };

/** Archery skill for the bow in the range slot. Null when that slot is not a bow. */
export function archeryBar(job: JobId, sub: JobId | null, rangeId: string | null | undefined): RangeBar | null {
  const item = rangeId ? GEAR[rangeId] : undefined;
  if (!item || item.kind !== "Archery") return null;
  return {
    kind: "Archery",
    skill: combinedSkill("Archery", job, LEVEL, sub, sub ? subjobLevel(LEVEL) : 0),
    weapon: item.name,
  };
}

/** Marksmanship skill for the gun or crossbow in the range slot. */
export function marksmanshipBar(job: JobId, sub: JobId | null, rangeId: string | null | undefined): RangeBar | null {
  const item = rangeId ? GEAR[rangeId] : undefined;
  if (!item || item.kind !== "Marksmanship") return null;
  return {
    kind: "Marksmanship",
    skill: combinedSkill("Marksmanship", job, LEVEL, sub, sub ? subjobLevel(LEVEL) : 0),
    weapon: item.name,
  };
}

/** The bow or the gun in the range slot. Only one of those can be equipped. */
export function rangedBar(job: JobId, sub: JobId | null, rangeId: string | null | undefined): RangeBar | null {
  return archeryBar(job, sub, rangeId) ?? marksmanshipBar(job, sub, rangeId);
}

/** What this job can put on the bar with the weapon in hand. Defaults stay Warrior so the old checks hold. */
export function hotbarGroups(skillName: string, skill: number, weaponName = "", job: JobId = "WAR", sub: JobId | null = null, range: RangeBar | null = null, blueSet: readonly string[] = []): HotGroup[] {
  let ws =
    skillName === "Sword" ? swordActions(skill, weaponName, job, sub)
    : skillName === "Great Axe" ? greatAxeActions(skill, weaponName, job, sub)
    : skillName === "Great Sword" ? greatSwordActions(skill, weaponName, job, sub)
    : skillName === "Hand-to-Hand" ? handActions(skill, weaponName, job, sub)
    : skillName === "Dagger" ? daggerActions(skill, weaponName, job, sub)
    : skillName === "Axe" ? axeActions(skill, weaponName, job, sub)
    : skillName === "Staff" ? staffActions(skill, weaponName, job, sub)
    : skillName === "Club" ? clubActions(skill, weaponName, job, sub)
    : skillName === "Scythe" ? scytheActions(skill, weaponName, job, sub)
    : skillName === "Polearm" ? polearmActions(skill, weaponName, job, sub)
    : skillName === "Katana" ? katanaActions(skill, weaponName, job, sub)
    : skillName === "Great Katana" ? greatKatanaActions(skill, weaponName, job, sub)
    : skillName === "Archery" ? archeryActions(skill, weaponName, job, sub)
    : skillName === "Marksmanship" ? marksmanshipActions(skill, weaponName, job, sub)
    : ALL_WS.filter((action) => action.weapon === skillName && skill >= (action.skill ?? 0));
  if (range?.kind === "Archery" && skillName !== "Archery") {
    const seen = new Set(ws.map((action) => action.id));
    ws = [...ws, ...archeryActions(range.skill, range.weapon, job, sub).filter((action) => !seen.has(action.id))];
  }
  if (range?.kind === "Marksmanship" && skillName !== "Marksmanship") {
    const seen = new Set(ws.map((action) => action.id));
    ws = [...ws, ...marksmanshipActions(range.skill, range.weapon, job, sub).filter((action) => !seen.has(action.id))];
  }
  const pacts = bloodPactActions(job, sub);
  const groups: HotGroup[] = [
    { title: "Ranged", actions: [RANGED_ATTACK], empty: "Ranged Attack is not available." },
    { title: "Abilities", actions: barAbilities(job, sub), empty: "None at this level." },
  ];
  if (pacts.length > 0 || job === "SMN" || sub === "SMN") {
    groups.push({
      title: "Blood Pacts",
      actions: pacts,
      empty: "No blood pact is learned yet.",
    });
  }
  groups.push(
    {
      title: "Spells",
      actions: barSpells(job, sub, blueSet),
      empty: job === "BLU" || sub === "BLU" ? "Blue magic is not set yet." : job === "BLM" || sub === "BLM" || job === "WHM" || sub === "WHM" || job === "RDM" || sub === "RDM" || job === "PLD" || sub === "PLD" || job === "NIN" || sub === "NIN" || job === "DRK" || sub === "DRK" || job === "SCH" || sub === "SCH" || job === "RUN" || sub === "RUN" || job === "GEO" || sub === "GEO" ? "No spell is learned yet." : job === "BRD" || sub === "BRD" ? "No song is learned yet." : job === "MNK" ? "Monk has no spells." : job === "THF" ? "Thief has no spells." : job === "RNG" ? "Ranger has no spells." : job === "SMN" ? "No summon is learned yet." : job === "PUP" ? "Puppetmaster has no spells." : job === "COR" ? "Corsair has no spells." : job === "DNC" ? "Dancer has no spells." : "Warrior has no spells.",
    },
    { title: "Items", actions: ITEMS, empty: "No usable items in the bag." },
    {
      title: "Weapon skills",
      actions: ws,
      empty: skill >= 5 ? "This weapon has no weapon skill yet." : `${skillName} skill ${skill} is under 5.`,
    },
  );
  return groups;
}

export function canUse(action: HotAction, skillName: string, skill: number, weaponName = "", job: JobId = "WAR", range: RangeBar | null = null, sub: JobId | null = null): string | null {
  if (action.kind !== "weaponskill") return null;
  if (action.weapon === "Archery" && skillName !== "Archery") {
    if (range?.kind !== "Archery") return `${action.name} needs a bow.`;
    skillName = "Archery";
    skill = range.skill;
    weaponName = range.weapon;
  }
  if (action.weapon === "Marksmanship" && skillName !== "Marksmanship") {
    if (range?.kind !== "Marksmanship") return `${action.name} needs a gun.`;
    skillName = "Marksmanship";
    skill = range.skill;
    weaponName = range.weapon;
  }
  if (action.weapon !== skillName) return `${action.name} needs ${action.weapon}.`;
  if (job === "BLM") {
    const ws =
      swordByName(action.name) ??
      greatAxeByName(action.name) ??
      greatSwordByName(action.name) ??
      handByName(action.name) ??
      daggerByName(action.name) ??
      axeByName(action.name) ??
      staffByName(action.name) ??
      clubByName(action.name) ??
      scytheByName(action.name) ??
      polearmByName(action.name) ??
      katanaByName(action.name) ??
      greatKatanaByName(action.name) ??
      archeryByName(action.name) ??
      marksmanshipByName(action.name);
    if (!ws) return `${action.name} is not a Black Mage weapon skill.`;
    return blmCanUse(ws, { job: "BLM", main: true, level: LEVEL, skill, weaponName, quests: [], sub });
  }
  if (job === "WHM") {
    const ws =
      swordByName(action.name) ??
      greatAxeByName(action.name) ??
      greatSwordByName(action.name) ??
      handByName(action.name) ??
      daggerByName(action.name) ??
      axeByName(action.name) ??
      staffByName(action.name) ??
      clubByName(action.name) ??
      scytheByName(action.name) ??
      polearmByName(action.name) ??
      katanaByName(action.name) ??
      greatKatanaByName(action.name) ??
      archeryByName(action.name) ??
      marksmanshipByName(action.name);
    if (!ws) return `${action.name} is not a White Mage weapon skill.`;
    return whmCanUse(ws, { job: "WHM", main: true, level: LEVEL, skill, weaponName, quests: [], sub });
  }
  if (job === "RDM") {
    const ws =
      swordByName(action.name) ??
      greatAxeByName(action.name) ??
      greatSwordByName(action.name) ??
      handByName(action.name) ??
      daggerByName(action.name) ??
      axeByName(action.name) ??
      staffByName(action.name) ??
      clubByName(action.name) ??
      scytheByName(action.name) ??
      polearmByName(action.name) ??
      katanaByName(action.name) ??
      greatKatanaByName(action.name) ??
      archeryByName(action.name) ??
      marksmanshipByName(action.name);
    if (!ws) return `${action.name} is not a Red Mage weapon skill.`;
    return rdmCanUse(ws, { job: "RDM", main: true, level: LEVEL, skill, weaponName, quests: [], sub });
  }
  if (job === "MNK") {
    const ws =
      swordByName(action.name) ??
      greatAxeByName(action.name) ??
      greatSwordByName(action.name) ??
      handByName(action.name) ??
      daggerByName(action.name) ??
      axeByName(action.name) ??
      staffByName(action.name) ??
      clubByName(action.name) ??
      scytheByName(action.name) ??
      polearmByName(action.name) ??
      katanaByName(action.name) ??
      greatKatanaByName(action.name) ??
      archeryByName(action.name) ??
      marksmanshipByName(action.name);
    if (!ws) return `${action.name} is not a Monk weapon skill.`;
    return mnkCanUse(ws, { job: "MNK", main: true, level: LEVEL, skill, weaponName, quests: [], sub });
  }
  if (job === "THF") {
    const ws =
      swordByName(action.name) ??
      greatAxeByName(action.name) ??
      greatSwordByName(action.name) ??
      handByName(action.name) ??
      daggerByName(action.name) ??
      axeByName(action.name) ??
      staffByName(action.name) ??
      clubByName(action.name) ??
      scytheByName(action.name) ??
      polearmByName(action.name) ??
      katanaByName(action.name) ??
      greatKatanaByName(action.name) ??
      archeryByName(action.name) ??
      marksmanshipByName(action.name);
    if (!ws) return `${action.name} is not a Thief weapon skill.`;
    return thfCanUse(ws, { job: "THF", main: true, level: LEVEL, skill, weaponName, quests: [], sub });
  }
  if (job === "SAM") {
    const ws =
      swordByName(action.name) ??
      greatAxeByName(action.name) ??
      greatSwordByName(action.name) ??
      handByName(action.name) ??
      daggerByName(action.name) ??
      axeByName(action.name) ??
      staffByName(action.name) ??
      clubByName(action.name) ??
      scytheByName(action.name) ??
      polearmByName(action.name) ??
      katanaByName(action.name) ??
      greatKatanaByName(action.name) ??
      archeryByName(action.name) ??
      marksmanshipByName(action.name);
    if (!ws) return `${action.name} is not a Samurai weapon skill.`;
    return samCanUse(ws, { job: "SAM", main: true, level: LEVEL, skill, weaponName, quests: [], sub });
  }
  if (job === "RNG") {
    const ws =
      swordByName(action.name) ??
      greatAxeByName(action.name) ??
      greatSwordByName(action.name) ??
      handByName(action.name) ??
      daggerByName(action.name) ??
      axeByName(action.name) ??
      staffByName(action.name) ??
      clubByName(action.name) ??
      scytheByName(action.name) ??
      polearmByName(action.name) ??
      katanaByName(action.name) ??
      greatKatanaByName(action.name) ??
      archeryByName(action.name) ??
      marksmanshipByName(action.name);
    if (!ws) return `${action.name} is not a Ranger weapon skill.`;
    return rngCanUse(ws, { job: "RNG", main: true, level: LEVEL, skill, weaponName, quests: [], sub });
  }
  if (job === "PLD") {
    const ws =
      swordByName(action.name) ??
      greatAxeByName(action.name) ??
      greatSwordByName(action.name) ??
      handByName(action.name) ??
      daggerByName(action.name) ??
      axeByName(action.name) ??
      staffByName(action.name) ??
      clubByName(action.name) ??
      scytheByName(action.name) ??
      polearmByName(action.name) ??
      katanaByName(action.name) ??
      greatKatanaByName(action.name) ??
      archeryByName(action.name) ??
      marksmanshipByName(action.name);
    if (!ws) return `${action.name} is not a Paladin weapon skill.`;
    return pldCanUse(ws, { job: "PLD", main: true, level: LEVEL, skill, weaponName, quests: [], sub });
  }
  if (job === "NIN") {
    const ws =
      swordByName(action.name) ??
      greatAxeByName(action.name) ??
      greatSwordByName(action.name) ??
      handByName(action.name) ??
      daggerByName(action.name) ??
      axeByName(action.name) ??
      staffByName(action.name) ??
      clubByName(action.name) ??
      scytheByName(action.name) ??
      polearmByName(action.name) ??
      katanaByName(action.name) ??
      greatKatanaByName(action.name) ??
      archeryByName(action.name) ??
      marksmanshipByName(action.name);
    if (!ws) return `${action.name} is not a Ninja weapon skill.`;
    return ninCanUse(ws, { job: "NIN", main: true, level: LEVEL, skill, weaponName, quests: [], sub });
  }
  if (job === "BRD") {
    const ws =
      swordByName(action.name) ??
      greatAxeByName(action.name) ??
      greatSwordByName(action.name) ??
      handByName(action.name) ??
      daggerByName(action.name) ??
      axeByName(action.name) ??
      staffByName(action.name) ??
      clubByName(action.name) ??
      scytheByName(action.name) ??
      polearmByName(action.name) ??
      katanaByName(action.name) ??
      greatKatanaByName(action.name) ??
      archeryByName(action.name) ??
      marksmanshipByName(action.name);
    if (!ws) return `${action.name} is not a Bard weapon skill.`;
    return brdCanUse(ws, { job: "BRD", main: true, level: LEVEL, skill, weaponName, quests: [], sub });
  }
  if (job === "DRK") {
    const ws =
      swordByName(action.name) ??
      greatAxeByName(action.name) ??
      greatSwordByName(action.name) ??
      handByName(action.name) ??
      daggerByName(action.name) ??
      axeByName(action.name) ??
      staffByName(action.name) ??
      clubByName(action.name) ??
      scytheByName(action.name) ??
      polearmByName(action.name) ??
      katanaByName(action.name) ??
      greatKatanaByName(action.name) ??
      archeryByName(action.name) ??
      marksmanshipByName(action.name);
    if (!ws) return `${action.name} is not a Dark Knight weapon skill.`;
    return drkCanUse(ws, { job: "DRK", main: true, level: LEVEL, skill, weaponName, quests: [], sub });
  }
  if (job === "DRG") {
    const ws =
      swordByName(action.name) ??
      greatAxeByName(action.name) ??
      greatSwordByName(action.name) ??
      handByName(action.name) ??
      daggerByName(action.name) ??
      axeByName(action.name) ??
      staffByName(action.name) ??
      clubByName(action.name) ??
      scytheByName(action.name) ??
      polearmByName(action.name) ??
      katanaByName(action.name) ??
      greatKatanaByName(action.name) ??
      archeryByName(action.name) ??
      marksmanshipByName(action.name);
    if (!ws) return `${action.name} is not a Dragoon weapon skill.`;
    return drgCanUse(ws, { job: "DRG", main: true, level: LEVEL, skill, weaponName, quests: [], sub });
  }
  if (job === "SMN") {
    const ws =
      swordByName(action.name) ??
      greatAxeByName(action.name) ??
      greatSwordByName(action.name) ??
      handByName(action.name) ??
      daggerByName(action.name) ??
      axeByName(action.name) ??
      staffByName(action.name) ??
      clubByName(action.name) ??
      scytheByName(action.name) ??
      polearmByName(action.name) ??
      katanaByName(action.name) ??
      greatKatanaByName(action.name) ??
      archeryByName(action.name) ??
      marksmanshipByName(action.name);
    if (!ws) return `${action.name} is not a Summoner weapon skill.`;
    return smnCanUse(ws, { job: "SMN", main: true, level: LEVEL, skill, weaponName, quests: [], sub });
  }
  if (job === "BST") {
    const ws =
      swordByName(action.name) ??
      greatAxeByName(action.name) ??
      greatSwordByName(action.name) ??
      handByName(action.name) ??
      daggerByName(action.name) ??
      axeByName(action.name) ??
      staffByName(action.name) ??
      clubByName(action.name) ??
      scytheByName(action.name) ??
      polearmByName(action.name) ??
      katanaByName(action.name) ??
      greatKatanaByName(action.name) ??
      archeryByName(action.name) ??
      marksmanshipByName(action.name);
    if (!ws) return `${action.name} is not a Beastmaster weapon skill.`;
    return bstCanUse(ws, { job: "BST", main: true, level: LEVEL, skill, weaponName, quests: [], sub });
  }
  if (job === "BLU") {
    const ws =
      swordByName(action.name) ??
      greatAxeByName(action.name) ??
      greatSwordByName(action.name) ??
      handByName(action.name) ??
      daggerByName(action.name) ??
      axeByName(action.name) ??
      staffByName(action.name) ??
      clubByName(action.name) ??
      scytheByName(action.name) ??
      polearmByName(action.name) ??
      katanaByName(action.name) ??
      greatKatanaByName(action.name) ??
      archeryByName(action.name) ??
      marksmanshipByName(action.name);
    if (!ws) return `${action.name} is not a Blue Mage weapon skill.`;
    return bluCanUse(ws, { job: "BLU", main: true, level: LEVEL, skill, weaponName, quests: [], sub });
  }
  if (job === "PUP") {
    const ws =
      swordByName(action.name) ??
      greatAxeByName(action.name) ??
      greatSwordByName(action.name) ??
      handByName(action.name) ??
      daggerByName(action.name) ??
      axeByName(action.name) ??
      staffByName(action.name) ??
      clubByName(action.name) ??
      scytheByName(action.name) ??
      polearmByName(action.name) ??
      katanaByName(action.name) ??
      greatKatanaByName(action.name) ??
      archeryByName(action.name) ??
      marksmanshipByName(action.name);
    if (!ws) return `${action.name} is not a Puppetmaster weapon skill.`;
    return pupCanUse(ws, { job: "PUP", main: true, level: LEVEL, skill, weaponName, quests: [], sub });
  }
  if (job === "COR") {
    const ws =
      swordByName(action.name) ??
      greatAxeByName(action.name) ??
      greatSwordByName(action.name) ??
      handByName(action.name) ??
      daggerByName(action.name) ??
      axeByName(action.name) ??
      staffByName(action.name) ??
      clubByName(action.name) ??
      scytheByName(action.name) ??
      polearmByName(action.name) ??
      katanaByName(action.name) ??
      greatKatanaByName(action.name) ??
      archeryByName(action.name) ??
      marksmanshipByName(action.name);
    if (!ws) return `${action.name} is not a Corsair weapon skill.`;
    return corCanUse(ws, { job: "COR", main: true, level: LEVEL, skill, weaponName, quests: [], sub });
  }
  if (job === "DNC") {
    const ws =
      swordByName(action.name) ??
      greatAxeByName(action.name) ??
      greatSwordByName(action.name) ??
      handByName(action.name) ??
      daggerByName(action.name) ??
      axeByName(action.name) ??
      staffByName(action.name) ??
      clubByName(action.name) ??
      scytheByName(action.name) ??
      polearmByName(action.name) ??
      katanaByName(action.name) ??
      greatKatanaByName(action.name) ??
      archeryByName(action.name) ??
      marksmanshipByName(action.name);
    if (!ws) return `${action.name} is not a Dancer weapon skill.`;
    return dncCanUse(ws, { job: "DNC", main: true, level: LEVEL, skill, weaponName, quests: [], sub });
  }
  if (job === "SCH") {
    const ws =
      swordByName(action.name) ??
      greatAxeByName(action.name) ??
      greatSwordByName(action.name) ??
      handByName(action.name) ??
      daggerByName(action.name) ??
      axeByName(action.name) ??
      staffByName(action.name) ??
      clubByName(action.name) ??
      scytheByName(action.name) ??
      polearmByName(action.name) ??
      katanaByName(action.name) ??
      greatKatanaByName(action.name) ??
      archeryByName(action.name) ??
      marksmanshipByName(action.name);
    if (!ws) return `${action.name} is not a Scholar weapon skill.`;
    return schCanUse(ws, { job: "SCH", main: true, level: LEVEL, skill, weaponName, quests: [], sub });
  }
  if (job === "RUN") {
    const ws =
      swordByName(action.name) ??
      greatAxeByName(action.name) ??
      greatSwordByName(action.name) ??
      handByName(action.name) ??
      daggerByName(action.name) ??
      axeByName(action.name) ??
      staffByName(action.name) ??
      clubByName(action.name) ??
      scytheByName(action.name) ??
      polearmByName(action.name) ??
      katanaByName(action.name) ??
      greatKatanaByName(action.name) ??
      archeryByName(action.name) ??
      marksmanshipByName(action.name);
    if (!ws) return `${action.name} is not a Rune Fencer weapon skill.`;
    return runCanUse(ws, { job: "RUN", main: true, level: LEVEL, skill, weaponName, quests: [], sub });
  }
  if (job === "GEO") {
    const ws =
      swordByName(action.name) ??
      greatAxeByName(action.name) ??
      greatSwordByName(action.name) ??
      handByName(action.name) ??
      daggerByName(action.name) ??
      axeByName(action.name) ??
      staffByName(action.name) ??
      clubByName(action.name) ??
      scytheByName(action.name) ??
      polearmByName(action.name) ??
      katanaByName(action.name) ??
      greatKatanaByName(action.name) ??
      archeryByName(action.name) ??
      marksmanshipByName(action.name);
    if (!ws) return `${action.name} is not a Geomancer weapon skill.`;
    return geoCanUse(ws, { job: "GEO", main: true, level: LEVEL, skill, weaponName, quests: [], sub });
  }
  const sword = action.weapon === "Sword" ? swordByName(action.name) : undefined;
  if (sword) return warCanUse(sword, { job: "WAR", main: true, level: LEVEL, skill, weaponName, quests: [], sub });
  const axe = action.weapon === "Great Axe" ? greatAxeByName(action.name) : undefined;
  if (axe) return warCanUseGreatAxe(axe, { job: "WAR", main: true, level: LEVEL, skill, weaponName, quests: [], sub });
  const claymore = action.weapon === "Great Sword" ? greatSwordByName(action.name) : undefined;
  if (claymore) return warCanUseGreatSword(claymore, { job: "WAR", main: true, level: LEVEL, skill, weaponName, quests: [], sub });
  const hand = action.weapon === "Hand-to-Hand" ? handByName(action.name) : undefined;
  if (hand) return warCanUseHand(hand, { job: "WAR", main: true, level: LEVEL, skill, weaponName, quests: [], sub });
  const dagger = action.weapon === "Dagger" ? daggerByName(action.name) : undefined;
  if (dagger) return warCanUseDagger(dagger, { job: "WAR", main: true, level: LEVEL, skill, weaponName, quests: [], sub });
  const hatchet = action.weapon === "Axe" ? axeByName(action.name) : undefined;
  if (hatchet) return warCanUseAxe(hatchet, { job: "WAR", main: true, level: LEVEL, skill, weaponName, quests: [], sub });
  const staff = action.weapon === "Staff" ? staffByName(action.name) : undefined;
  if (staff) return warCanUseStaff(staff, { job: "WAR", main: true, level: LEVEL, skill, weaponName, quests: [], sub });
  const club = action.weapon === "Club" ? clubByName(action.name) : undefined;
  if (club) return warCanUseClub(club, { job: "WAR", main: true, level: LEVEL, skill, weaponName, quests: [], sub });
  const scythe = action.weapon === "Scythe" ? scytheByName(action.name) : undefined;
  if (scythe) return warCanUseScythe(scythe, { job: "WAR", main: true, level: LEVEL, skill, weaponName, quests: [], sub });
  const spear = action.weapon === "Polearm" ? polearmByName(action.name) : undefined;
  if (spear) return warCanUsePolearm(spear, { job: "WAR", main: true, level: LEVEL, skill, weaponName, quests: [], sub });
  const katana = action.weapon === "Katana" ? katanaByName(action.name) : undefined;
  if (katana) return warCanUseKatana(katana, { job: "WAR", main: true, level: LEVEL, skill, weaponName, quests: [], sub });
  const nodachi = action.weapon === "Great Katana" ? greatKatanaByName(action.name) : undefined;
  if (nodachi) return warCanUseGreatKatana(nodachi, { job: "WAR", main: true, level: LEVEL, skill, weaponName, quests: [], sub });
  const shot = action.weapon === "Archery" ? archeryByName(action.name) : undefined;
  if (shot) return warCanUseArchery(shot, { job: "WAR", main: true, level: LEVEL, skill, weaponName, quests: [], sub });
  const bullet = action.weapon === "Marksmanship" ? marksmanshipByName(action.name) : undefined;
  if (bullet) return warCanUseMarksmanship(bullet, { job: "WAR", main: true, level: LEVEL, skill, weaponName, quests: [], sub });
  if (skill < (action.skill ?? 0)) return `${action.name} needs ${action.weapon} skill ${action.skill}.`;
  return null;
}

export function assertHotbar(): void {
  const names = ABILITIES.map((ability) => ability.name);
  if (!names.includes("Mighty Strikes") || !names.includes("Retaliation")) throw new Error("level 75 abilities");
  if (names.includes("Tomahawk") || names.includes("Warrior's Charge")) throw new Error("merit ability on the bar");
  if (SPELLS.length !== 0) throw new Error("Warrior spells");
  const sword = hotbarGroups("Sword", warSkill("Sword", LEVEL), "Bronze Sword");
  const ws = sword.find((group) => group.title === "Weapon skills");
  if (!ws || ws.actions[0]?.name !== "Fast Blade" || !ws.actions.some((action) => action.name === "Savage Blade") || ws.actions.length !== 10) throw new Error("sword weapon skills");
  if (ws.actions.some((action) => action.name === "Swift Blade" || action.name === "Sanguine Blade")) throw new Error("gated sword skill listed");
  const axes = hotbarGroups("Great Axe", warSkill("Great Axe", LEVEL), "Butterfly Axe");
  const ga = axes.find((group) => group.title === "Weapon skills");
  if (!ga || ga.actions[0]?.name !== "Shield Break" || !ga.actions.some((action) => action.name === "Steel Cyclone") || ga.actions.length !== 9) throw new Error("great axe weapon skills");
  if (ga.actions.some((action) => action.name === "Fell Cleave" || action.name === "Ukko's Fury")) throw new Error("gated great axe skill listed");
  const claymores = hotbarGroups("Great Sword", warSkill("Great Sword", LEVEL), "Rusty Greatsword");
  const gs = claymores.find((group) => group.title === "Weapon skills");
  if (!gs || gs.actions[0]?.name !== "Hard Slash" || !gs.actions.some((action) => action.name === "Ground Strike") || gs.actions.length !== 7) throw new Error("great sword weapon skills");
  if (gs.actions.some((action) => action.name === "Sickle Moon" || action.name === "Herculean Slash" || action.name === "Scourge")) throw new Error("gated great sword skill listed");
  const fists = hotbarGroups("Hand-to-Hand", warSkill("Hand-to-Hand", LEVEL), "Cesti");
  const hh = fists.find((group) => group.title === "Weapon skills");
  if (!hh || hh.actions[0]?.name !== "Combo" || !hh.actions.some((action) => action.name === "Spinning Attack") || hh.actions.length !== 4) throw new Error("hand weapon skills");
  if (hh.actions.some((action) => action.name === "One Inch Punch" || action.name === "Howling Fist" || action.name === "Asuran Fists")) throw new Error("gated hand skill listed");
  const knives = hotbarGroups("Dagger", warSkill("Dagger", LEVEL), "Bronze Dagger");
  const dagger = knives.find((group) => group.title === "Weapon skills");
  if (!dagger || dagger.actions[0]?.name !== "Wasp Sting" || !dagger.actions.some((action) => action.name === "Evisceration") || dagger.actions.length !== 5) throw new Error("dagger weapon skills");
  if (dagger.actions.some((action) => action.name === "Viper Bite" || action.name === "Shark Bite" || action.name === "Mercy Stroke")) throw new Error("gated dagger skill listed");
  const hatchets = hotbarGroups("Axe", warSkill("Axe", LEVEL), "Bronze Axe");
  const one = hatchets.find((group) => group.title === "Weapon skills");
  if (!one || one.actions[0]?.name !== "Raging Axe" || !one.actions.some((action) => action.name === "Decimation") || one.actions.length !== 9) throw new Error("axe weapon skills");
  if (one.actions.some((action) => action.name === "Bora Axe" || action.name === "Onslaught" || action.name === "Ruinator")) throw new Error("gated axe skill listed");
  const poles = hotbarGroups("Staff", warSkill("Staff", LEVEL), "Ash Staff");
  const staff = poles.find((group) => group.title === "Weapon skills");
  if (!staff || staff.actions[0]?.name !== "Heavy Swing" || !staff.actions.some((action) => action.name === "Retribution") || staff.actions.length !== 9) throw new Error("staff weapon skills");
  if (staff.actions.some((action) => action.name === "Cataclysm" || action.name === "Shattersoul" || action.name === "Myrkr")) throw new Error("gated staff skill listed");
  const clubs = hotbarGroups("Club", warSkill("Club", LEVEL), "Ash Club");
  const club = clubs.find((group) => group.title === "Weapon skills");
  if (!club || club.actions[0]?.name !== "Shining Strike" || !club.actions.some((action) => action.name === "Black Halo") || club.actions.length !== 9) throw new Error("club weapon skills");
  if (club.actions.some((action) => action.name === "Hexa Strike" || action.name === "Flash Nova" || action.name === "Randgrith")) throw new Error("gated club skill listed");
  const scythes = hotbarGroups("Scythe", warSkill("Scythe", LEVEL), "Bronze Zaghnal");
  const scythe = scythes.find((group) => group.title === "Weapon skills");
  if (!scythe || scythe.actions[0]?.name !== "Slice" || !scythe.actions.some((action) => action.name === "Spiral Hell") || scythe.actions.length !== 7) throw new Error("scythe weapon skills");
  if (scythe.actions.some((action) => action.name === "Guillotine" || action.name === "Entropy" || action.name === "Catastrophe")) throw new Error("gated scythe skill listed");
  const spears = hotbarGroups("Polearm", warSkill("Polearm", LEVEL), "Harpoon");
  const spear = spears.find((group) => group.title === "Weapon skills");
  if (!spear || spear.actions[0]?.name !== "Double Thrust" || !spear.actions.some((action) => action.name === "Impulse Drive") || spear.actions.length !== 7) throw new Error("polearm weapon skills");
  if (spear.actions.some((action) => action.name === "Skewer" || action.name === "Stardiver" || action.name === "Geirskogul")) throw new Error("gated polearm skill listed");
  const katanas = hotbarGroups("Katana", warSkill("Katana", LEVEL), "Trainee Burin");
  const katana = katanas.find((group) => group.title === "Weapon skills");
  if (!katana || katana.actions.length !== 0 || katana.actions.some((action) => action.name === "Blade: Rin" || action.name === "Blade: Ku")) throw new Error("katana weapon skills");
  const nodachi = hotbarGroups("Great Katana", warSkill("Great Katana", LEVEL), "Hardwood Katana");
  const gk = nodachi.find((group) => group.title === "Weapon skills");
  if (!gk || gk.actions.length !== 0 || gk.actions.some((action) => action.name === "Tachi: Enpi" || action.name === "Tachi: Kasha")) throw new Error("great katana weapon skills");
  const shots = hotbarGroups("Archery", warSkill("Archery", LEVEL), "Shortbow");
  const shot = shots.find((group) => group.title === "Weapon skills");
  if (!shot || shot.actions.length !== 0) throw new Error(`archery without Ranger ${shot?.actions.map((action) => action.name).join(", ")}`);
  const bowOnSword = hotbarGroups("Sword", warSkill("Sword", LEVEL), "Bronze Sword", "WAR", null, archeryBar("WAR", null, "shortbow"));
  const bowWs = bowOnSword.find((group) => group.title === "Weapon skills")?.actions.map((action) => action.name) ?? [];
  if (!bowWs.includes("Fast Blade") || bowWs.some((name) => name === "Flaming Arrow" || name === "Sidewinder")) throw new Error(`bow on a sword ${bowWs.join(", ")}`);
  if (hotbarGroups("Sword", warSkill("Sword", LEVEL), "Bronze Sword").find((group) => group.title === "Weapon skills")?.actions.some((action) => action.name === "Sidewinder")) throw new Error("archery without a bow");
  const warRngBow = hotbarGroups("Sword", 210, "Bronze Sword", "WAR", "RNG", archeryBar("WAR", "RNG", "shortbow")).find((group) => group.title === "Weapon skills")?.actions.map((action) => action.name) ?? [];
  const sharedShots = ["Flaming Arrow", "Piercing Arrow", "Dulling Arrow", "Sidewinder"];
  if (!warRngBow.includes("Fast Blade") || warRngBow.slice(-4).join("|") !== sharedShots.join("|") || warRngBow.includes("Blast Arrow")) throw new Error(`WAR/RNG bow ${warRngBow.join(", ")}`);
  const bullets = hotbarGroups("Marksmanship", warSkill("Marksmanship", LEVEL), "Light Crossbow");
  const bullet = bullets.find((group) => group.title === "Weapon skills");
  if (!bullet || bullet.actions.length !== 0 || bullet.actions.some((action) => action.name === "Hot Shot" || action.name === "Slug Shot")) throw new Error("marksmanship weapon skills");
  const rdmSword = hotbarGroups("Sword", 250, "Bronze Sword", "RDM").find((group) => group.title === "Weapon skills");
  if (rdmSword?.actions.map((action) => action.name).join(",") !== "Fast Blade,Burning Blade,Red Lotus Blade,Flat Blade,Shining Blade,Seraph Blade,Circle Blade,Spirits Within,Vorpal Blade,Savage Blade") {
    throw new Error(`RDM sword skills ${rdmSword?.actions.map((action) => action.name).join(",")}`);
  }
  const rdmKnife = hotbarGroups("Dagger", 250, "Bronze Dagger", "RDM").find((group) => group.title === "Weapon skills");
  if (rdmKnife?.actions.map((action) => action.name).join(",") !== "Wasp Sting,Gust Slash,Shadowstitch,Viper Bite,Cyclone,Energy Steal,Energy Drain,Evisceration") {
    throw new Error(`RDM dagger skills ${rdmKnife?.actions.map((action) => action.name).join(",")}`);
  }
  const rdmClub = hotbarGroups("Club", 210, "Ash Club", "RDM").find((group) => group.title === "Weapon skills");
  if (rdmClub?.actions.map((action) => action.name).join(",") !== "Shining Strike,Brainshaker,Starlight,Skullbreaker,True Strike") {
    throw new Error(`RDM club skills ${rdmClub?.actions.map((action) => action.name).join(",")}`);
  }
  const rdmShot = hotbarGroups("Archery", 210, "Shortbow", "RDM").find((group) => group.title === "Weapon skills");
  if (rdmShot?.actions.length !== 0) throw new Error(`RDM archery ${rdmShot?.actions.map((action) => action.name).join(",")}`);
  const rdmRngShot = hotbarGroups("Archery", 210, "Shortbow", "RDM", "RNG").find((group) => group.title === "Weapon skills");
  if (rdmRngShot?.actions.map((action) => action.name).join("|") !== "Flaming Arrow|Piercing Arrow|Dulling Arrow|Sidewinder") throw new Error(`RDM/RNG archery ${rdmRngShot?.actions.map((action) => action.name).join(",")}`);
  const rdmBar = hotbarGroups("Sword", 250, "Bronze Sword", "RDM").find((group) => group.title === "Abilities");
  if (rdmBar?.actions.map((action) => action.name).join(",") !== "Chainspell,Convert,Composure") throw new Error("RDM abilities");
  const mnkNames = ["Hundred Fists", "Boost", "Dodge", "Focus", "Chakra", "Chi Blast", "Counterstance", "Footwork"];
  for (const name of mnkNames) {
    const id = `ability:${slug(name)}`;
    const slotted = findAction(id);
    if (!slotted || slotted.name !== name || slotted.kind !== "ability") throw new Error(`${name} does not slot`);
  }
  const mnkMarks = ["HF", "OB", "DD", "FC", "KA", "CB", "CT", "FW"];
  if (mnkNames.map((name) => markOf(name)).join(",") !== mnkMarks.join(",")) throw new Error("MNK marks");
  if (new Set(mnkMarks).size !== mnkMarks.length) throw new Error("MNK marks collide");
  const mnkBar = hotbarGroups("Hand-to-Hand", 276, "Cesti", "MNK");
  if (mnkBar.find((group) => group.title === "Abilities")?.actions.map((action) => action.name).join(",") !== mnkNames.join(",")) {
    throw new Error("MNK abilities");
  }
  const mnkWs = mnkBar.find((group) => group.title === "Weapon skills")?.actions.map((action) => action.name) ?? [];
  if (mnkWs.join("|") !== ["Combo", "Shoulder Tackle", "One Inch Punch", "Backhand Blow", "Raging Fists", "Spinning Attack", "Howling Fist", "Dragon Kick", "Asuran Fists"].join("|")) {
    throw new Error(`MNK hand weapon skills ${mnkWs.join(", ")}`);
  }
  const mnkWsMarks = ["CO", "TL", "OP", "BH", "R1", "SA", "HO", "DK", "AF"];
  if (mnkWs.map((name) => markOf(name)).join(",") !== mnkWsMarks.join(",")) throw new Error("MNK weapon skill marks");
  const shared = new Set([...mnkMarks, ...mnkWsMarks]);
  if (shared.size !== mnkMarks.length + mnkWsMarks.length) throw new Error("MNK marks collide");
  if (mnkBar.find((group) => group.title === "Spells")?.actions.length !== 0) throw new Error("Monk spells");
  const thfNames = ["Perfect Dodge", "Steal", "Sneak Attack", "Flee", "Trick Attack", "Mug", "Hide", "Accomplice", "Collaborator"];
  const thfMarks = ["PD", "SY", "NK", "FE", "TQ", "MG", "HD", "AP", "CQ"];
  if (thfNames.map((name) => markOf(name)).join(",") !== thfMarks.join(",")) throw new Error("THF marks");
  const taken = new Set(ALL.filter((action) => !thfNames.includes(action.name)).map((action) => markOf(action.name)));
  for (const mark of thfMarks) if (taken.has(mark)) throw new Error(`THF mark ${mark} collides`);
  if (new Set(thfMarks).size !== thfMarks.length) throw new Error("THF marks collide");
  for (const name of thfNames) {
    const slotted = findAction(`ability:${slug(name)}`);
    if (!slotted || slotted.name !== name || slotted.kind !== "ability") throw new Error(`${name} does not slot`);
  }
  const thfBar = hotbarGroups("Dagger", 276, "Bronze Dagger", "THF");
  if (thfBar.find((group) => group.title === "Abilities")?.actions.map((action) => action.name).join(",") !== thfNames.join(",")) {
    throw new Error("THF abilities");
  }
  const thfWs = thfBar.find((group) => group.title === "Weapon skills")?.actions.map((action) => action.name) ?? [];
  if (thfWs.join("|") !== ["Wasp Sting", "Gust Slash", "Shadowstitch", "Viper Bite", "Cyclone", "Energy Steal", "Energy Drain", "Dancing Edge", "Shark Bite", "Evisceration"].join("|")) {
    throw new Error(`THF dagger skills ${thfWs.join(", ")}`);
  }
  if (thfWs.some((name) => name === "Aeolian Edge" || name === "Exenterator" || name === "Mercy Stroke")) throw new Error("THF post-75 dagger");
  if (thfBar.find((group) => group.title === "Spells")?.actions.length !== 0) throw new Error("Thief spells");
  const thfSword = hotbarGroups("Sword", 210, "Bronze Sword", "THF").find((group) => group.title === "Weapon skills")?.actions.map((action) => action.name) ?? [];
  if (thfSword.join("|") !== ["Fast Blade", "Burning Blade", "Flat Blade", "Shining Blade", "Circle Blade", "Spirits Within"].join("|")) {
    throw new Error(`THF sword skills ${thfSword.join(", ")}`);
  }
  const thfHands = hotbarGroups("Hand-to-Hand", 200, "Cesti", "THF").find((group) => group.title === "Weapon skills")?.actions.map((action) => action.name) ?? [];
  if (thfHands.join("|") !== ["Combo", "Shoulder Tackle", "Backhand Blow", "Spinning Attack"].join("|")) {
    throw new Error(`THF hand skills ${thfHands.join(", ")}`);
  }
  const warSub = hotbarGroups("Sword", 250, "Bronze Sword", "WAR", "THF").find((group) => group.title === "Abilities")?.actions.map((action) => action.name) ?? [];
  const subOnly = warSub.filter((name) => thfNames.includes(name));
  if (subOnly.join(",") !== "Steal,Sneak Attack,Flee,Trick Attack,Mug") throw new Error(`THF sub abilities ${subOnly.join(",")}`);
  const samNames = ["Meikyo Shisui", "Warding Circle", "Third Eye", "Hasso", "Meditate", "Seigan", "Sekkanoki", "Konzen-ittai"];
  const samMarks = ["MQ", "WC", "3E", "HZ", "MD", "IG", "KK", "KZ"];
  if (samNames.map((name) => markOf(name)).join(",") !== samMarks.join(",")) throw new Error("SAM marks");
  const samTaken = new Set(ALL.filter((action) => !samNames.includes(action.name)).map((action) => markOf(action.name)));
  for (const mark of samMarks) if (samTaken.has(mark)) throw new Error(`SAM mark ${mark} collides`);
  if (new Set(samMarks).size !== samMarks.length) throw new Error("SAM marks collide");
  for (const name of samNames) {
    const slotted = findAction(`ability:${slug(name)}`);
    if (!slotted || slotted.name !== name || slotted.kind !== "ability") throw new Error(`${name} does not slot`);
  }
  const samBar = hotbarGroups("Great Katana", 276, "Mumeito", "SAM");
  if (samBar.find((group) => group.title === "Abilities")?.actions.map((action) => action.name).join(",") !== samNames.join(",")) {
    throw new Error("SAM abilities");
  }
  const samWs = samBar.find((group) => group.title === "Weapon skills")?.actions.map((action) => action.name) ?? [];
  if (samWs.join("|") !== ["Tachi: Enpi", "Tachi: Hobaku", "Tachi: Goten", "Tachi: Kagero", "Tachi: Jinpu", "Tachi: Koki", "Tachi: Yukikaze", "Tachi: Gekko", "Tachi: Kasha"].join("|")) {
    throw new Error(`SAM great katana skills ${samWs.join(", ")}`);
  }
  if (samWs.some((name) => name === "Tachi: Ageha" || name === "Tachi: Shoha" || name === "Tachi: Kaiten")) throw new Error("SAM post-75 or relic great katana");
  const samBow = hotbarGroups("Great Katana", 276, "Mumeito", "SAM", null, { kind: "Archery", skill: 230, weapon: "Shortbow" }).find((group) => group.title === "Weapon skills")?.actions.map((action) => action.name) ?? [];
  if (!samBow.includes("Tachi: Kasha") || samBow.some((name) => name === "Flaming Arrow")) throw new Error(`SAM bow skills ${samBow.join(", ")}`);
  const samRngBow = hotbarGroups("Great Katana", 276, "Mumeito", "SAM", "RNG", { kind: "Archery", skill: 230, weapon: "Shortbow" }).find((group) => group.title === "Weapon skills")?.actions.map((action) => action.name) ?? [];
  if (!samRngBow.includes("Tachi: Kasha") || samRngBow.slice(-4).join("|") !== "Flaming Arrow|Piercing Arrow|Dulling Arrow|Sidewinder") throw new Error(`SAM/RNG bow skills ${samRngBow.join(", ")}`);
  const flaming = findAction("ws:flaming-arrow");
  if (!flaming || canUse(flaming, "Sword", 250, "Bronze Sword", "WAR", archeryBar("WAR", null, "shortbow")) !== "Flaming Arrow requires Ranger as main or sub.") throw new Error("WAR cannot keep Flaming Arrow");
  if (canUse(flaming!, "Sword", 210, "Bronze Sword", "WAR", archeryBar("WAR", "RNG", "shortbow"), "RNG") !== null) throw new Error("WAR/RNG can keep Flaming Arrow");
  if (canUse(flaming!, "Sword", 250, "Bronze Sword", "WAR", null) !== "Flaming Arrow needs a bow.") throw new Error("Flaming Arrow without a bow");
  if (canUse(flaming!, "Archery", 4, "Shortbow", "WAR", null, "RNG") === null) throw new Error("Flaming Arrow skill");
  const samWsMarks = ["EP", "HB", "GN", "KG", "JP", "KO", "YK", "GE", "KS"];
  if (samWs.map((name) => markOf(name)).join(",") !== samWsMarks.join(",")) throw new Error("SAM weapon skill marks");
  const samShared = new Set([...samMarks, ...samWsMarks]);
  if (samShared.size !== samMarks.length + samWsMarks.length) throw new Error("SAM marks collide with weapon skills");
  if (samBar.find((group) => group.title === "Spells")?.actions.length !== 0) throw new Error("Samurai spells");
  const warSam = hotbarGroups("Sword", 250, "Bronze Sword", "WAR", "SAM").find((group) => group.title === "Abilities")?.actions.map((action) => action.name) ?? [];
  const samSub = warSam.filter((name) => samNames.includes(name));
  if (samSub.join(",") !== "Warding Circle,Third Eye,Hasso,Meditate,Seigan") throw new Error(`SAM sub abilities ${samSub.join(",")}`);
  const rngNames = ["Eagle Eye Shot", "Velocity Shot", "Sharpshot", "Scavenge", "Camouflage", "Barrage", "Shadowbind", "Unlimited Shot"];
  const rngMarks = ["1E", "VY", "XP", "VC", "LF", "1B", "NB", "UL"];
  if (rngNames.map((name) => markOf(name)).join(",") !== rngMarks.join(",")) throw new Error("RNG marks");
  const rngTaken = new Set(ALL.filter((action) => !rngNames.includes(action.name)).map((action) => markOf(action.name)));
  for (const mark of rngMarks) if (rngTaken.has(mark)) throw new Error(`RNG mark ${mark} collides`);
  if (new Set(rngMarks).size !== rngMarks.length) throw new Error("RNG marks collide");
  for (const name of rngNames) {
    const slotted = findAction(`ability:${slug(name)}`);
    if (!slotted || slotted.name !== name || slotted.kind !== "ability") throw new Error(`${name} does not slot`);
  }
  const rngBar = hotbarGroups("Sword", 210, "Bronze Sword", "RNG");
  if (rngBar.find((group) => group.title === "Abilities")?.actions.map((action) => action.name).join(",") !== rngNames.join(",")) {
    throw new Error("RNG abilities");
  }
  const rngSword = rngBar.find((group) => group.title === "Weapon skills")?.actions.map((action) => action.name) ?? [];
  if (rngSword.join("|") !== ["Fast Blade", "Burning Blade", "Flat Blade", "Shining Blade", "Circle Blade", "Spirits Within"].join("|")) {
    throw new Error(`RNG sword skills ${rngSword.join(", ")}`);
  }
  const rngDagger = hotbarGroups("Dagger", 240, "Bronze Dagger", "RNG").find((group) => group.title === "Weapon skills")?.actions.map((action) => action.name) ?? [];
  if (rngDagger.join("|") !== ["Wasp Sting", "Gust Slash", "Shadowstitch", "Viper Bite", "Cyclone", "Energy Steal", "Energy Drain", "Evisceration"].join("|")) {
    throw new Error(`RNG dagger skills ${rngDagger.join(", ")}`);
  }
  const rngAxe = hotbarGroups("Axe", 240, "Bronze Axe", "RNG").find((group) => group.title === "Weapon skills")?.actions.map((action) => action.name) ?? [];
  if (rngAxe.join("|") !== ["Raging Axe", "Smash Axe", "Gale Axe", "Avalanche Axe", "Spinning Axe", "Rampage", "Decimation"].join("|")) {
    throw new Error(`RNG axe skills ${rngAxe.join(", ")}`);
  }
  const rngClub = hotbarGroups("Club", 200, "Ash Club", "RNG").find((group) => group.title === "Weapon skills")?.actions.map((action) => action.name) ?? [];
  if (rngClub.join("|") !== ["Shining Strike", "Brainshaker", "Starlight", "Skullbreaker", "True Strike"].join("|")) {
    throw new Error(`RNG club skills ${rngClub.join(", ")}`);
  }
  const rngBow = hotbarGroups("Sword", 210, "Bronze Sword", "RNG", null, archeryBar("RNG", null, "shortbow")).find((group) => group.title === "Weapon skills")?.actions.map((action) => action.name) ?? [];
  if (rngBow.slice(-7).join("|") !== "Flaming Arrow|Piercing Arrow|Dulling Arrow|Sidewinder|Blast Arrow|Arching Arrow|Empyreal Arrow") throw new Error(`RNG bow skills ${rngBow.join(", ")}`);
  const rngGun = hotbarGroups("Marksmanship", 276, "Light Crossbow", "RNG").find((group) => group.title === "Weapon skills")?.actions.map((action) => action.name) ?? [];
  if (rngGun.join("|") !== ["Hot Shot", "Split Shot", "Sniper Shot", "Slug Shot", "Blast Shot", "Detonator"].join("|")) {
    throw new Error(`RNG marksmanship ${rngGun.join(", ")}`);
  }
  if (rngBar.find((group) => group.title === "Spells")?.actions.length !== 0) throw new Error("Ranger spells");
  const warRng = hotbarGroups("Sword", 250, "Bronze Sword", "WAR", "RNG").find((group) => group.title === "Abilities")?.actions.map((action) => action.name) ?? [];
  const rngSub = warRng.filter((name) => rngNames.includes(name));
  if (rngSub.join(",") !== "Sharpshot,Scavenge,Camouflage,Barrage") throw new Error(`RNG sub abilities ${rngSub.join(",")}`);
  const pldNames = ["Invincible", "Holy Circle", "Shield Bash", "Sentinel", "Cover", "Rampart", "Majesty"];
  const pldMarks = ["IV", "HC", "XB", "NL", "CV", "RM", "MJ"];
  if (pldNames.map((name) => markOf(name)).join(",") !== pldMarks.join(",")) throw new Error("PLD marks");
  const pldTaken = new Set(ALL.filter((action) => !pldNames.includes(action.name)).map((action) => markOf(action.name)));
  for (const mark of pldMarks) if (pldTaken.has(mark)) throw new Error(`PLD mark ${mark} collides`);
  if (new Set(pldMarks).size !== pldMarks.length) throw new Error("PLD marks collide");
  for (const name of pldNames) {
    const slotted = findAction(`ability:${slug(name)}`);
    if (!slotted || slotted.name !== name || slotted.kind !== "ability") throw new Error(`${name} does not slot`);
  }
  const pldBar = hotbarGroups("Sword", 276, "Bronze Sword", "PLD");
  if (pldBar.find((group) => group.title === "Abilities")?.actions.map((action) => action.name).join(",") !== pldNames.join(",")) {
    throw new Error("PLD abilities");
  }
  if (pldBar.find((group) => group.title === "Abilities")?.actions.some((action) => action.name === "Fealty" || action.name === "Chivalry")) {
    throw new Error("PLD merits stay off the bar");
  }
  const warPld = hotbarGroups("Sword", 250, "Bronze Sword", "WAR", "PLD").find((group) => group.title === "Abilities")?.actions.map((action) => action.name) ?? [];
  const pldSub = warPld.filter((name) => pldNames.includes(name));
  if (pldSub.join(",") !== "Holy Circle,Shield Bash,Sentinel,Cover") throw new Error(`PLD sub abilities ${pldSub.join(",")}`);
  const ninNames = ["Mijin Gakure", "Yonin", "Innin"];
  const ninMarks = ["JG", "YN", "NN"];
  if (ninNames.map((name) => markOf(name)).join(",") !== ninMarks.join(",")) throw new Error("NIN marks");
  const ninTaken = new Set(ALL.filter((action) => !ninNames.includes(action.name)).map((action) => markOf(action.name)));
  for (const mark of ninMarks) if (ninTaken.has(mark)) throw new Error(`NIN mark ${mark} collides`);
  const ninBar = hotbarGroups("Katana", 276, "Kunai", "NIN");
  if (ninBar.find((group) => group.title === "Abilities")?.actions.map((action) => action.name).join(",") !== ninNames.join(",")) {
    throw new Error("NIN abilities");
  }
  if (ninBar.find((group) => group.title === "Abilities")?.actions.some((action) => action.name === "Sange")) throw new Error("Sange stays off the bar");
  const ninSpells = ninBar.find((group) => group.title === "Spells")?.actions.map((action) => action.name) ?? [];
  if (!ninSpells.includes("Katon: Ichi") || !ninSpells.includes("Utsusemi: Ni") || !ninSpells.includes("Katon: San")) throw new Error("NIN ninjutsu");
  const katon = findAction("spell:katon-ichi");
  if (!katon || katon.kind !== "spell") throw new Error("Katon: Ichi does not slot");
  const utsu = findAction("spell:utsusemi-ni");
  if (!utsu || utsu.name !== "Utsusemi: Ni") throw new Error("Utsusemi: Ni does not slot");
  const rin = findAction("ws:blade-rin");
  if (!rin || canUse(rin, "Katana", 276, "Kunai", "NIN") !== null) throw new Error("NIN can keep Blade: Rin");
  if (canUse(rin!, "Katana", 276, "Kunai", "WAR") === null) throw new Error("WAR cannot keep Blade: Rin");
  const ninWs = ninBar.find((group) => group.title === "Weapon skills")?.actions.map((action) => action.name) ?? [];
  if (!ninWs.includes("Blade: Rin") || !ninWs.includes("Blade: Ten") || ninWs.includes("Blade: Yu")) {
    throw new Error(`NIN katana skills ${ninWs.join(", ")}`);
  }
  const warNin = hotbarGroups("Sword", 250, "Bronze Sword", "WAR", "NIN").find((group) => group.title === "Abilities")?.actions.map((action) => action.name) ?? [];
  if (warNin.some((name) => ninNames.includes(name))) throw new Error("NIN subjob has no job abilities");
  const brdNames = ["Soul Voice", "Pianissimo"];
  const brdMarks = ["OV", "PP"];
  if (brdNames.map((name) => markOf(name)).join(",") !== brdMarks.join(",")) throw new Error("BRD marks");
  const brdTaken = new Set(ALL.filter((action) => !brdNames.includes(action.name)).map((action) => markOf(action.name)));
  for (const mark of brdMarks) if (brdTaken.has(mark)) throw new Error(`BRD mark ${mark} collides`);
  const brdBar = hotbarGroups("Dagger", 240, "Bronze Dagger", "BRD");
  if (brdBar.find((group) => group.title === "Abilities")?.actions.map((action) => action.name).join(",") !== brdNames.join(",")) {
    throw new Error("BRD abilities");
  }
  if (brdBar.find((group) => group.title === "Abilities")?.actions.some((action) => action.name === "Nightingale" || action.name === "Troubadour")) {
    throw new Error("BRD merits stay off the bar");
  }
  const brdSongs = brdBar.find((group) => group.title === "Spells")?.actions.map((action) => action.name) ?? [];
  if (!brdSongs.includes("Valor Minuet") || !brdSongs.includes("Foe Lullaby") || brdSongs.includes("Adventurer's Dirge") || brdSongs.includes("Foe Sirvente")) {
    throw new Error("BRD songs");
  }
  const minuetSlot = findAction("spell:valor-minuet");
  if (!minuetSlot || minuetSlot.kind !== "spell") throw new Error("Valor Minuet does not slot");
  const wasp = findAction("ws:wasp-sting");
  if (!wasp || canUse(wasp, "Dagger", 240, "Bronze Dagger", "BRD") !== null) throw new Error("BRD can keep Wasp Sting");
  const brdWs = brdBar.find((group) => group.title === "Weapon skills")?.actions.map((action) => action.name) ?? [];
  if (!brdWs.includes("Wasp Sting")) throw new Error(`BRD dagger skills ${brdWs.join(", ")}`);
  const warBrd = hotbarGroups("Sword", 250, "Bronze Sword", "WAR", "BRD").find((group) => group.title === "Abilities")?.actions.map((action) => action.name) ?? [];
  if (warBrd.filter((name) => brdNames.includes(name)).join(",") !== "Pianissimo") throw new Error("BRD subjob abilities");
  const warBrdSongs = hotbarGroups("Sword", 250, "Bronze Sword", "WAR", "BRD").find((group) => group.title === "Spells")?.actions ?? [];
  if (warBrdSongs.length === 0 || warBrdSongs.some((action) => action.name === "Valor Minuet IV")) throw new Error("BRD subjob songs");
  const drkNames = ["Blood Weapon", "Arcane Circle", "Last Resort", "Weapon Bash", "Souleater", "Consume Mana"];
  const drkMarks = ["OD", "KC", "DV", "BX", "OE", "MP"];
  if (drkNames.map((name) => markOf(name)).join(",") !== drkMarks.join(",")) throw new Error(`DRK marks ${drkNames.map((name) => markOf(name)).join(",")}`);
  const drkTaken = new Set(ALL.filter((action) => !drkNames.includes(action.name)).map((action) => markOf(action.name)));
  const drkHits = drkMarks.filter((mark) => drkTaken.has(mark));
  if (drkHits.length) throw new Error(`DRK mark ${drkHits.join(",")} collides`);
  const drkBar = hotbarGroups("Scythe", 276, "Bronze Zaghnal", "DRK");
  if (drkBar.find((group) => group.title === "Abilities")?.actions.map((action) => action.name).join(",") !== drkNames.join(",")) {
    throw new Error("DRK abilities");
  }
  if (drkBar.find((group) => group.title === "Abilities")?.actions.some((action) => action.name === "Dark Seal" || action.name === "Diabolic Eye")) {
    throw new Error("DRK merits stay off the bar");
  }
  const drkSpells = drkBar.find((group) => group.title === "Spells")?.actions.map((action) => action.name) ?? [];
  if (!drkSpells.includes("Drain") || !drkSpells.includes("Aspir") || !drkSpells.includes("Bio II") || !drkSpells.includes("Stun") || !drkSpells.includes("Sleep II") || !drkSpells.includes("Thunder II")) {
    throw new Error("DRK spells");
  }
  if (drkSpells.some((name) => name.startsWith("Absorb") || name === "Drain II" || name === "Dread Spikes" || name === "Tractor" || name === "Stone III")) {
    throw new Error("DRK spell past the book");
  }
  const guillotine = findAction("ws:guillotine");
  if (!guillotine || canUse(guillotine, "Scythe", 276, "Bronze Zaghnal", "DRK") !== null) throw new Error("DRK can keep Guillotine");
  if (canUse(guillotine!, "Scythe", 256, "Bronze Zaghnal", "WAR") === null) throw new Error("WAR cannot keep Guillotine");
  const spiral = findAction("ws:spiral-hell");
  if (!spiral || canUse(spiral, "Scythe", 276, "Bronze Zaghnal", "DRK") !== null) throw new Error("DRK can keep Spiral Hell");
  const drkWs = drkBar.find((group) => group.title === "Weapon skills")?.actions.map((action) => action.name) ?? [];
  if (!drkWs.includes("Guillotine") || !drkWs.includes("Spiral Hell") || drkWs.includes("Cross Reaper")) {
    throw new Error(`DRK scythe skills ${drkWs.join(", ")}`);
  }
  const warDrk = hotbarGroups("Sword", 250, "Bronze Sword", "WAR", "DRK").find((group) => group.title === "Abilities")?.actions.map((action) => action.name) ?? [];
  if (warDrk.filter((name) => drkNames.includes(name)).join(",") !== "Arcane Circle,Last Resort,Weapon Bash,Souleater") throw new Error("DRK subjob abilities");
  if (findAction("ability:jump")?.name !== "Jump" || findAction("ability:call-wyvern")?.name !== "Call Wyvern" || findAction("ability:super-jump")?.name !== "Super Jump") {
    throw new Error("DRG bar actions");
  }
  if (findAction("ability:call-beast")?.name !== "Call Beast" || findAction("ability:big-scissors")?.name !== "Big Scissors") {
    throw new Error("BST bar actions");
  }
  if (isPetTpMove("Fight") || isPetTpMove("Leave") || isPetTpMove("Snarl") || !isPetTpMove("Big Scissors") || !isPetTpMove("Metallic Body") || isPetTpMove("Call Beast")) {
    throw new Error("pet tp moves");
  }
  if (!isRarabTpMove("Foot Kick") || !isRarabTpMove("Wild Carrot") || isRarabTpMove("Big Scissors") || isCarrieTpMove("Foot Kick")) {
    throw new Error("rarab tp moves");
  }
  if (findAction("ability:foot-kick")?.name !== "Foot Kick") throw new Error("Foot Kick slots");
  const bstWs = hotbarGroups("Axe", 276, "Bronze Axe", "BST").find((group) => group.title === "Weapon skills")?.actions.map((action) => action.name) ?? [];
  if (!bstWs.includes("Raging Axe") || !bstWs.includes("Mistral Axe") || bstWs.includes("Onslaught") || bstWs.includes("Primal Rend")) {
    throw new Error(`BST axe skills ${bstWs.join(", ")}`);
  }
  const bluNames = ["Azure Lore", "Burst Affinity", "Chain Affinity", "Convergence", "Diffusion"];
  const bluLive = ["Azure Lore", "Burst Affinity", "Chain Affinity"];
  const bluMarks = ["ZL", "YF", "NY", "VG", "DF"];
  if (bluNames.map((name) => markOf(name)).join(",") !== bluMarks.join(",")) throw new Error(`BLU marks ${bluNames.map((name) => markOf(name)).join(",")}`);
  const bluTaken = new Set(ALL.filter((action) => !bluNames.includes(action.name)).map((action) => markOf(action.name)));
  const bluHits = bluMarks.filter((mark) => bluTaken.has(mark));
  if (bluHits.length) throw new Error(`BLU mark ${bluHits.join(",")} collides`);
  const bluBar = hotbarGroups("Sword", 276, "Bronze Sword", "BLU");
  if (bluBar.find((group) => group.title === "Abilities")?.actions.map((action) => action.name).join(",") !== bluLive.join(",")) {
    throw new Error("BLU abilities");
  }
  const bluWs = bluBar.find((group) => group.title === "Weapon skills")?.actions.map((action) => action.name) ?? [];
  if (bluWs.join(",") !== "Fast Blade,Burning Blade,Red Lotus Blade,Flat Blade,Shining Blade,Seraph Blade,Circle Blade,Spirits Within,Vorpal Blade,Savage Blade") {
    throw new Error(`BLU sword skills ${bluWs.join(",")}`);
  }
  if (bluBar.find((group) => group.title === "Spells")?.empty !== "Blue magic is not set yet.") throw new Error("BLU spell copy");
  if ((bluBar.find((group) => group.title === "Spells")?.actions.length ?? 0) !== 0) throw new Error("unset blue magic");
  const setKick = hotbarGroups("Sword", 276, "Bronze Sword", "BLU", null, null, ["Foot Kick"]);
  if (setKick.find((group) => group.title === "Spells")?.actions.map((action) => action.name).join(",") !== "Foot Kick") throw new Error("set Foot Kick");
  if (findAction("spell:foot-kick")?.name !== "Foot Kick") throw new Error("Foot Kick spell slot");
  const setCarrot = hotbarGroups("Sword", 276, "Bronze Sword", "BLU", null, null, ["Wild Carrot"]);
  if (setCarrot.find((group) => group.title === "Spells")?.actions.map((action) => action.name).join(",") !== "Wild Carrot") throw new Error("set Wild Carrot");
  const setBoth = hotbarGroups("Sword", 276, "Bronze Sword", "BLU", null, null, ["Foot Kick", "Wild Carrot"]);
  if (setBoth.find((group) => group.title === "Spells")?.actions.map((action) => action.name).join(",") !== "Foot Kick,Wild Carrot") throw new Error("set both blue spells");
  if (findAction("spell:wild-carrot")?.name !== "Wild Carrot") throw new Error("Wild Carrot spell slot");
  const setLuminion = hotbarGroups("Sword", 276, "Bronze Sword", "BLU", null, null, ["Actinic Burst", "Plasma Charge"]);
  if (setLuminion.find((group) => group.title === "Spells")?.actions.map((action) => action.name).join(",") !== "Actinic Burst,Plasma Charge") {
    throw new Error("set Actinic Burst and Plasma Charge");
  }
  if (findAction("spell:actinic-burst")?.name !== "Actinic Burst" || findAction("spell:plasma-charge")?.name !== "Plasma Charge") {
    throw new Error("luminion spell slots");
  }
  if (markOf("Actinic Burst") !== "AB" || markOf("Plasma Charge") !== "PC") throw new Error("luminion marks");
  const setGaze = hotbarGroups("Sword", 276, "Bronze Sword", "BLU", null, null, ["Zephyr Mantle", "Chaotic Eye"]);
  if (setGaze.find((group) => group.title === "Spells")?.actions.map((action) => action.name).join(",") !== "Chaotic Eye,Zephyr Mantle") {
    throw new Error("set Chaotic Eye and Zephyr Mantle");
  }
  if (findAction("spell:chaotic-eye")?.name !== "Chaotic Eye" || findAction("spell:zephyr-mantle")?.name !== "Zephyr Mantle") {
    throw new Error("gaze spell slots");
  }
  if (markOf("Chaotic Eye") !== "CE" || markOf("Zephyr Mantle") !== "ZM") throw new Error("gaze marks");
  const setBeast = hotbarGroups("Sword", 276, "Bronze Sword", "BLU", null, null, ["Sheep Song", "Healing Breeze"]);
  if (setBeast.find((group) => group.title === "Spells")?.actions.map((action) => action.name).join(",") !== "Healing Breeze,Sheep Song") {
    throw new Error("set Healing Breeze and Sheep Song");
  }
  if (findAction("spell:healing-breeze")?.name !== "Healing Breeze" || findAction("spell:sheep-song")?.name !== "Sheep Song") {
    throw new Error("beast spell slots");
  }
  if (markOf("Healing Breeze") !== "HB" || markOf("Sheep Song") !== "SP" || markOf("Shock Spikes") !== "SS" || markOf("Steal") !== "SY") throw new Error("beast marks");
  const setBrawl = hotbarGroups("Sword", 276, "Bronze Sword", "BLU", null, null, ["Uppercut", "Battle Dance"]);
  if (setBrawl.find((group) => group.title === "Spells")?.actions.map((action) => action.name).join(",") !== "Battle Dance,Uppercut") {
    throw new Error("set Battle Dance and Uppercut");
  }
  if (findAction("spell:battle-dance")?.name !== "Battle Dance" || findAction("spell:uppercut")?.name !== "Uppercut") {
    throw new Error("brawler spell slots");
  }
  if (markOf("Battle Dance") !== "9D" || markOf("Uppercut") !== "UC" || markOf("Frenetic Rip") !== "3R" || markOf("Disseverment") !== "5V" || markOf("Battle Dance") === markOf("Blind") || markOf("Uppercut") === markOf("Upheaval")) {
    throw new Error("brawler marks");
  }
  const setSilk = hotbarGroups("Sword", 276, "Bronze Sword", "BLU", null, null, ["Cocoon", "Refueling"]);
  if (setSilk.find((group) => group.title === "Spells")?.actions.map((action) => action.name).join(",") !== "Cocoon,Refueling") {
    throw new Error("set Cocoon and Refueling");
  }
  if (findAction("spell:cocoon")?.name !== "Cocoon" || findAction("spell:refueling")?.name !== "Refueling") {
    throw new Error("silk spell slots");
  }
  if (markOf("Cocoon") !== "8C" || markOf("Refueling") !== "4U" || markOf("Cocoon") === markOf("Convert") || markOf("Refueling") === markOf("Reraise") || markOf("Refueling") === markOf("Haste") || markOf("Refueling") === markOf("Refresh")) {
    throw new Error("silk marks");
  }
  const setOrchard = hotbarGroups("Sword", 276, "Bronze Sword", "BLU", null, null, ["Cannonball", "Magic Fruit"]);
  if (setOrchard.find((group) => group.title === "Spells")?.actions.map((action) => action.name).join(",") !== "Magic Fruit,Cannonball") {
    throw new Error("set Magic Fruit and Cannonball");
  }
  if (findAction("spell:magic-fruit")?.name !== "Magic Fruit" || findAction("spell:cannonball")?.name !== "Cannonball") {
    throw new Error("orchard spell slots");
  }
  if (markOf("Cannonball") !== "7B" || markOf("Magic Fruit") !== "5F" || markOf("Cannonball") === markOf("Cura") || markOf("Cannonball") === markOf("Chi Blast") || markOf("Magic Fruit") === markOf("Magic Finale")) {
    throw new Error("orchard marks");
  }
  const orchardTaken = new Set(ALL.filter((action) => action.name !== "Cannonball" && action.name !== "Magic Fruit").map((action) => markOf(action.name)));
  if (orchardTaken.has("7B") || orchardTaken.has("5F")) throw new Error("orchard marks collide");
  const subOrchard = hotbarGroups("Sword", 250, "Bronze Sword", "WAR", "BLU", null, ["Cannonball", "Magic Fruit"]);
  if (subOrchard.find((group) => group.title === "Spells")?.actions.some((action) => action.name === "Cannonball" || action.name === "Magic Fruit")) {
    throw new Error("subjob Magic Fruit and Cannonball");
  }
  const setMind = hotbarGroups("Sword", 276, "Bronze Sword", "BLU", null, null, ["Memento Mori", "Mind Blast"]);
  if (setMind.find((group) => group.title === "Spells")?.actions.map((action) => action.name).join(",") !== "Memento Mori,Mind Blast") {
    throw new Error("set Memento Mori and Mind Blast");
  }
  if (findAction("spell:memento-mori")?.name !== "Memento Mori" || findAction("spell:mind-blast")?.name !== "Mind Blast") {
    throw new Error("Memento Mori and Mind Blast ids");
  }
  if (markOf("Memento Mori") !== "6M" || markOf("Mind Blast") !== "3B" || markOf("Memento Mori") === markOf("Sheepfoe Mambo") || markOf("Mind Blast") === markOf("Metallic Body") || markOf("Mind Blast") === markOf("Mystic Boon")) {
    throw new Error("Memento Mori and Mind Blast marks");
  }
  const mindHits = ALL.filter((action) => action.name !== "Memento Mori" && action.name !== "Mind Blast" && (markOf(action.name) === "6M" || markOf(action.name) === "3B")).map((action) => `${action.name}=${markOf(action.name)}`);
  if (mindHits.length > 0) throw new Error(`Memento Mori and Mind Blast marks collide ${mindHits.join(",")}`);
  const starterNames = ["Sandspin", "Pollen", "Power Attack", "Sprout Smack", "Wild Oats"];
  const starterMarks = ["5N", "PL", "9A", "4S", "WO"];
  if (starterNames.map((name) => markOf(name)).join(",") !== starterMarks.join(",")) throw new Error("starter blue marks");
  const starterHits = ALL.filter((action) => !starterNames.includes(action.name) && starterMarks.includes(markOf(action.name))).map((action) => `${action.name}=${markOf(action.name)}`);
  if (starterHits.length > 0) throw new Error(`starter blue marks collide ${starterHits.join(",")}`);
  const shellNames = ["Metallic Body", "Queasyshroom", "Head Butt", "Feather Storm", "Helldive"];
  const shellMarks = ["8M", "QY", "6H", "3F", "1D"];
  if (shellNames.map((name) => markOf(name)).join(",") !== shellMarks.join(",")) throw new Error("shell blue marks");
  const shellHits = ALL.filter((action) => !shellNames.includes(action.name) && shellMarks.includes(markOf(action.name))).map((action) => `${action.name}=${markOf(action.name)}`);
  if (shellHits.length > 0) throw new Error(`shell blue marks collide ${shellHits.join(",")}`);
  const cardianNames = ["Bludgeon", "Cursed Sphere", "Blastbomb", "Claw Cyclone", "Poison Breath"];
  const cardianMarks = ["8U", "9S", "9B", "LW", "PB"];
  if (cardianNames.map((name) => markOf(name)).join(",") !== cardianMarks.join(",")) throw new Error("cardian blue marks");
  const cardianHits = ALL.filter((action) => !cardianNames.includes(action.name) && cardianMarks.includes(markOf(action.name))).map((action) => `${action.name}=${markOf(action.name)}`);
  if (cardianHits.length > 0) throw new Error(`cardian blue marks collide ${cardianHits.join(",")}`);
  if (markOf("Cursed Sphere") === markOf("Cait Sith") || markOf("Cursed Sphere") === markOf("Cure")) throw new Error("Cursed Sphere mark");
  const setCardian = hotbarGroups("Sword", 276, "Bronze Sword", "BLU", null, null, cardianNames);
  if (setCardian.find((group) => group.title === "Spells")?.actions.map((action) => action.name).join(",") !== cardianNames.join(",")) {
    throw new Error("set cardian blue spells");
  }
  if (findAction("spell:bludgeon")?.name !== "Bludgeon" || findAction("spell:cursed-sphere")?.name !== "Cursed Sphere" || findAction("spell:blastbomb")?.name !== "Blastbomb" || findAction("spell:claw-cyclone")?.name !== "Claw Cyclone" || findAction("spell:poison-breath")?.name !== "Poison Breath") {
    throw new Error("cardian blue spell slots");
  }
  const subCardian = hotbarGroups("Sword", 250, "Bronze Sword", "WAR", "BLU", null, cardianNames);
  if (subCardian.find((group) => group.title === "Spells")?.actions.some((action) => cardianNames.includes(action.name))) {
    throw new Error("subjob cardian blue spells");
  }
  const midNames = ["Soporific", "Screwdriver", "Bomb Toss", "Grand Slam"];
  const midMarks = ["0P", "7W", "6T", "0L"];
  if (midNames.map((name) => markOf(name)).join(",") !== midMarks.join(",")) throw new Error("mid blue marks");
  const midHits = ALL.filter((action) => !midNames.includes(action.name) && midMarks.includes(markOf(action.name))).map((action) => `${action.name}=${markOf(action.name)}`);
  if (midHits.length > 0) throw new Error(`mid blue marks collide ${midHits.join(",")}`);
  const setMid = hotbarGroups("Sword", 276, "Bronze Sword", "BLU", null, null, midNames);
  if (setMid.find((group) => group.title === "Spells")?.actions.map((action) => action.name).join(",") !== midNames.join(",")) {
    throw new Error("set mid blue spells");
  }
  if (findAction("spell:soporific")?.name !== "Soporific" || findAction("spell:screwdriver")?.name !== "Screwdriver" || findAction("spell:bomb-toss")?.name !== "Bomb Toss" || findAction("spell:grand-slam")?.name !== "Grand Slam") {
    throw new Error("mid blue spell slots");
  }
  const subMid = hotbarGroups("Sword", 250, "Bronze Sword", "WAR", "BLU", null, midNames);
  if (subMid.find((group) => group.title === "Spells")?.actions.some((action) => midNames.includes(action.name))) {
    throw new Error("subjob mid blue spells");
  }
  const yardNames = ["Sound Blast", "Death Ray", "Smite of Rage", "Digest", "Pinecone Bomb"];
  const yardMarks = ["0S", "5S", "8S", "0G", "8B"];
  if (yardNames.map((name) => markOf(name)).join(",") !== yardMarks.join(",")) throw new Error("yard blue marks");
  const yardHits = ALL.filter((action) => !yardNames.includes(action.name) && yardMarks.includes(markOf(action.name))).map((action) => `${action.name}=${markOf(action.name)}`);
  if (yardHits.length > 0) throw new Error(`yard blue marks collide ${yardHits.join(",")}`);
  const setYard = hotbarGroups("Sword", 276, "Bronze Sword", "BLU", null, null, yardNames);
  if (setYard.find((group) => group.title === "Spells")?.actions.map((action) => action.name).join(",") !== yardNames.join(",")) {
    throw new Error("set yard blue spells");
  }
  if (findAction("spell:sound-blast")?.name !== "Sound Blast" || findAction("spell:death-ray")?.name !== "Death Ray" || findAction("spell:smite-of-rage")?.name !== "Smite of Rage" || findAction("spell:digest")?.name !== "Digest" || findAction("spell:pinecone-bomb")?.name !== "Pinecone Bomb") {
    throw new Error("yard blue spell slots");
  }
  const subYard = hotbarGroups("Sword", 250, "Bronze Sword", "WAR", "BLU", null, yardNames);
  if (subYard.find((group) => group.title === "Spells")?.actions.some((action) => yardNames.includes(action.name))) {
    throw new Error("subjob yard blue spells");
  }
  const gazeNames = ["Blank Gaze", "Jet Stream", "Mysterious Light", "Terror Touch", "Venom Shell"];
  const gazeMarks = ["0Z", "JS", "9L", "0T", "6V"];
  if (gazeNames.map((name) => markOf(name)).join(",") !== gazeMarks.join(",")) throw new Error("gaze blue marks");
  const gazeHits = ALL.filter((action) => !gazeNames.includes(action.name) && gazeMarks.includes(markOf(action.name))).map((action) => `${action.name}=${markOf(action.name)}`);
  if (gazeHits.length > 0) throw new Error(`gaze blue marks collide ${gazeHits.join(",")}`);
  if (markOf("Blank Gaze") === markOf("Blizzaga") || markOf("Mysterious Light") === markOf("Mage's Ballad")) throw new Error("gaze marks collide with black and songs");
  const setGazeBatch = hotbarGroups("Sword", 276, "Bronze Sword", "BLU", null, null, gazeNames);
  if (setGazeBatch.find((group) => group.title === "Spells")?.actions.map((action) => action.name).join(",") !== gazeNames.join(",")) {
    throw new Error("set gaze blue spells");
  }
  if (findAction("spell:blank-gaze")?.name !== "Blank Gaze" || findAction("spell:jet-stream")?.name !== "Jet Stream" || findAction("spell:mysterious-light")?.name !== "Mysterious Light" || findAction("spell:terror-touch")?.name !== "Terror Touch" || findAction("spell:venom-shell")?.name !== "Venom Shell") {
    throw new Error("gaze blue spell slots");
  }
  const subBatch = hotbarGroups("Sword", 250, "Bronze Sword", "WAR", "BLU", null, gazeNames);
  if (subBatch.find((group) => group.title === "Spells")?.actions.some((action) => gazeNames.includes(action.name))) {
    throw new Error("subjob gaze blue spells");
  }
  const lizardNames = ["Geist Wall", "Awful Eye", "Blood Saber", "Jettatura", "Ice Break"];
  const lizardMarks = ["GW", "AY", "8R", "JT", "IB"];
  if (lizardNames.map((name) => markOf(name)).join(",") !== lizardMarks.join(",")) throw new Error("lizard blue marks");
  const lizardHits = ALL.filter((action) => !lizardNames.includes(action.name) && lizardMarks.includes(markOf(action.name))).map((action) => `${action.name}=${markOf(action.name)}`);
  if (lizardHits.length > 0) throw new Error(`lizard blue marks collide ${lizardHits.join(",")}`);
  const setLizard = hotbarGroups("Sword", 276, "Bronze Sword", "BLU", null, null, lizardNames);
  if (setLizard.find((group) => group.title === "Spells")?.actions.map((action) => action.name).join(",") !== lizardNames.join(",")) {
    throw new Error("set lizard blue spells");
  }
  if (findAction("spell:geist-wall")?.name !== "Geist Wall" || findAction("spell:awful-eye")?.name !== "Awful Eye" || findAction("spell:blood-saber")?.name !== "Blood Saber" || findAction("spell:jettatura")?.name !== "Jettatura" || findAction("spell:ice-break")?.name !== "Ice Break") {
    throw new Error("lizard blue spell slots");
  }
  const subLizard = hotbarGroups("Sword", 250, "Bronze Sword", "WAR", "BLU", null, lizardNames);
  if (subLizard.find((group) => group.title === "Spells")?.actions.some((action) => lizardNames.includes(action.name))) {
    throw new Error("subjob lizard blue spells");
  }
  const wyvernNames = ["Radiant Breath", "Feather Barrier", "Flying Hip Press", "Light of Penance", "Death Scissors"];
  const wyvernMarks = ["9W", "0F", "6Y", "8N", "2X"];
  if (wyvernNames.map((name) => markOf(name)).join(",") !== wyvernMarks.join(",")) throw new Error("wyvern blue marks");
  const wyvernHits = ALL.filter((action) => !wyvernNames.includes(action.name) && wyvernMarks.includes(markOf(action.name))).map((action) => `${action.name}=${markOf(action.name)}`);
  if (wyvernHits.length > 0) throw new Error(`wyvern blue marks collide ${wyvernHits.join(",")}`);
  const setWyvern = hotbarGroups("Sword", 276, "Bronze Sword", "BLU", null, null, wyvernNames);
  if (setWyvern.find((group) => group.title === "Spells")?.actions.map((action) => action.name).join(",") !== wyvernNames.join(",")) {
    throw new Error("set wyvern blue spells");
  }
  if (findAction("spell:radiant-breath")?.name !== "Radiant Breath" || findAction("spell:feather-barrier")?.name !== "Feather Barrier" || findAction("spell:flying-hip-press")?.name !== "Flying Hip Press" || findAction("spell:light-of-penance")?.name !== "Light of Penance" || findAction("spell:death-scissors")?.name !== "Death Scissors") {
    throw new Error("wyvern blue spell slots");
  }
  const subWyvern = hotbarGroups("Sword", 250, "Bronze Sword", "WAR", "BLU", null, wyvernNames);
  if (subWyvern.find((group) => group.title === "Spells")?.actions.some((action) => wyvernNames.includes(action.name))) {
    throw new Error("subjob wyvern blue spells");
  }
  const shadowNames = ["Dimensional Death", "Spiral Spin", "Maelstrom", "Eyes On Me", "Seedspray"];
  const shadowMarks = ["4D", "7P", "M5", "5E", "1S"];
  if (shadowNames.map((name) => markOf(name)).join(",") !== shadowMarks.join(",")) throw new Error("shadow blue marks");
  const shadowHits = ALL.filter((action) => !shadowNames.includes(action.name) && shadowMarks.includes(markOf(action.name))).map((action) => `${action.name}=${markOf(action.name)}`);
  if (shadowHits.length > 0) throw new Error(`shadow blue marks collide ${shadowHits.join(",")}`);
  const setShadow = hotbarGroups("Sword", 276, "Bronze Sword", "BLU", null, null, shadowNames);
  if (setShadow.find((group) => group.title === "Spells")?.actions.map((action) => action.name).join(",") !== shadowNames.join(",")) {
    throw new Error("set shadow blue spells");
  }
  if (findAction("spell:dimensional-death")?.name !== "Dimensional Death" || findAction("spell:spiral-spin")?.name !== "Spiral Spin" || findAction("spell:maelstrom")?.name !== "Maelstrom" || findAction("spell:eyes-on-me")?.name !== "Eyes On Me" || findAction("spell:seedspray")?.name !== "Seedspray") {
    throw new Error("shadow blue spell slots");
  }
  const subShadow = hotbarGroups("Sword", 250, "Bronze Sword", "WAR", "BLU", null, shadowNames);
  if (subShadow.find((group) => group.title === "Spells")?.actions.some((action) => shadowNames.includes(action.name))) {
    throw new Error("subjob shadow blue spells");
  }
  const morbolNames = ["Bad Breath", "Body Slam", "1000 Needles", "Spinal Cleave", "Frypan"];
  const morbolMarks = ["3W", "B1", "8K", "3C", "6P"];
  if (morbolNames.map((name) => markOf(name)).join(",") !== morbolMarks.join(",")) throw new Error("morbol blue marks");
  const morbolHits = ALL.filter((action) => !morbolNames.includes(action.name) && morbolMarks.includes(markOf(action.name))).map((action) => `${action.name}=${markOf(action.name)}`);
  if (morbolHits.length > 0) throw new Error(`morbol blue marks collide ${morbolHits.join(",")}`);
  const setMorbol = hotbarGroups("Sword", 276, "Bronze Sword", "BLU", null, null, morbolNames);
  if (setMorbol.find((group) => group.title === "Spells")?.actions.map((action) => action.name).join(",") !== morbolNames.join(",")) {
    throw new Error("set morbol blue spells");
  }
  if (findAction("spell:bad-breath")?.name !== "Bad Breath" || findAction("spell:body-slam")?.name !== "Body Slam" || findAction("spell:1000-needles")?.name !== "1000 Needles" || findAction("spell:spinal-cleave")?.name !== "Spinal Cleave" || findAction("spell:frypan")?.name !== "Frypan") {
    throw new Error("morbol blue spell slots");
  }
  const subMorbol = hotbarGroups("Sword", 250, "Bronze Sword", "WAR", "BLU", null, morbolNames);
  if (subMorbol.find((group) => group.title === "Spells")?.actions.some((action) => morbolNames.includes(action.name))) {
    throw new Error("subjob morbol blue spells");
  }
  const sahaginNames = ["Hydro Shot", "Feather Tickle", "Yawn", "Voracious Trunk", "Infrasonics"];
  const sahaginMarks = ["H9", "F9", "YW", "V9", "I9"];
  if (sahaginNames.map((name) => markOf(name)).join(",") !== sahaginMarks.join(",")) throw new Error("sahagin blue marks");
  const sahaginHits = ALL.filter((action) => !sahaginNames.includes(action.name) && sahaginMarks.includes(markOf(action.name))).map((action) => `${action.name}=${markOf(action.name)}`);
  if (sahaginHits.length > 0) throw new Error(`sahagin blue marks collide ${sahaginHits.join(",")}`);
  const setSahagin = hotbarGroups("Sword", 276, "Bronze Sword", "BLU", null, null, sahaginNames);
  if (setSahagin.find((group) => group.title === "Spells")?.actions.map((action) => action.name).join(",") !== sahaginNames.join(",")) {
    throw new Error("set sahagin blue spells");
  }
  if (findAction("spell:hydro-shot")?.name !== "Hydro Shot" || findAction("spell:feather-tickle")?.name !== "Feather Tickle" || findAction("spell:yawn")?.name !== "Yawn" || findAction("spell:voracious-trunk")?.name !== "Voracious Trunk" || findAction("spell:infrasonics")?.name !== "Infrasonics") {
    throw new Error("sahagin blue spell slots");
  }
  const subSahagin = hotbarGroups("Sword", 250, "Bronze Sword", "WAR", "BLU", null, sahaginNames);
  if (subSahagin.find((group) => group.title === "Spells")?.actions.some((action) => sahaginNames.includes(action.name))) {
    throw new Error("subjob sahagin blue spells");
  }
  const raptorNames = ["Frost Breath", "Sandspray", "Corrosive Ooze", "Diamondhide", "Enervation"];
  const raptorMarks = ["R8", "S8", "C8", "D9", "N8"];
  if (raptorNames.map((name) => markOf(name)).join(",") !== raptorMarks.join(",")) throw new Error("raptor blue marks");
  const mamoolNames = ["Warm-Up", "Firespit", "Tail Slap", "Hysteric Barrage", "Regurgitation"];
  const mamoolMarks = ["WU", "FP", "LP", "H8", "G9"];
  if (mamoolNames.map((name) => markOf(name)).join(",") !== mamoolMarks.join(",")) throw new Error("mamool blue marks");
  const mamoolHits = ALL.filter((action) => !mamoolNames.includes(action.name) && mamoolMarks.includes(markOf(action.name))).map((action) => `${action.name}=${markOf(action.name)}`);
  if (mamoolHits.length > 0) throw new Error(`mamool mark collision ${mamoolHits.join(",")}`);
  const setMamool = hotbarGroups("Sword", 276, "Bronze Sword", "BLU", null, null, mamoolNames);
  if (setMamool.find((group) => group.title === "Spells")?.actions.map((action) => action.name).join(",") !== mamoolNames.join(",")) {
    throw new Error("mamool blue set");
  }
  const subMamool = hotbarGroups("Sword", 250, "Bronze Sword", "WAR", "BLU", null, mamoolNames);
  if (subMamool.find((group) => group.title === "Spells")?.actions.some((action) => mamoolNames.includes(action.name))) {
    throw new Error("subjob mamool blue");
  }
  const flanNames = ["Amplification", "Asuran Claws", "Lowing", "Heat Breath", "Triumphant Roar"];
  const flanMarks = ["A1", "6A", "L1", "EB", "T1"];
  if (flanNames.map((name) => markOf(name)).join(",") !== flanMarks.join(",")) throw new Error("flan blue marks");
  const flanHits = ALL.filter((action) => !flanNames.includes(action.name) && flanMarks.includes(markOf(action.name))).map((action) => `${action.name}=${markOf(action.name)}`);
  if (flanHits.length > 0) throw new Error(`flan mark collision ${flanHits.join(",")}`);
  const setFlan = hotbarGroups("Sword", 276, "Bronze Sword", "BLU", null, null, flanNames);
  if (setFlan.find((group) => group.title === "Spells")?.actions.map((action) => action.name).join(",") !== flanNames.join(",")) {
    throw new Error("flan blue set");
  }
  const subFlan = hotbarGroups("Sword", 250, "Bronze Sword", "WAR", "BLU", null, flanNames);
  if (subFlan.find((group) => group.title === "Spells")?.actions.some((action) => flanNames.includes(action.name))) {
    throw new Error("subjob flan blue");
  }
  const spiderNames = ["Sickle Slash", "Sub-zero Smash", "Saline Coat", "Ram Charge", "Temporal Shift"];
  const spiderMarks = ["K8", "Z8", "C7", "R7", "TM"];
  if (spiderNames.map((name) => markOf(name)).join(",") !== spiderMarks.join(",")) throw new Error("spider blue marks");
  const spiderHits = ALL.filter((action) => !spiderNames.includes(action.name) && spiderMarks.includes(markOf(action.name))).map((action) => `${action.name}=${markOf(action.name)}`);
  if (spiderHits.length > 0) throw new Error(`spider mark collision ${spiderHits.join(",")}`);
  const setSpider = hotbarGroups("Sword", 276, "Bronze Sword", "BLU", null, null, spiderNames);
  if (setSpider.find((group) => group.title === "Spells")?.actions.map((action) => action.name).join(",") !== spiderNames.join(",")) {
    throw new Error("spider blue set");
  }
  const subSpider = hotbarGroups("Sword", 250, "Bronze Sword", "WAR", "BLU", null, spiderNames);
  if (subSpider.find((group) => group.title === "Spells")?.actions.some((action) => spiderNames.includes(action.name))) {
    throw new Error("subjob spider blue");
  }
  const lateNames = ["Magic Hammer", "Reactor Cool", "Exuviation", "Vertical Cleave"];
  const lateMarks = ["LH", "IR", "XU", "VX"];
  if (lateNames.map((name) => markOf(name)).join(",") !== lateMarks.join(",")) throw new Error("late blue marks");
  const lateHits = ALL.filter((action) => !lateNames.includes(action.name) && lateMarks.includes(markOf(action.name))).map((action) => `${action.name}=${markOf(action.name)}`);
  if (lateHits.length > 0) throw new Error(`late blue mark collision ${lateHits.join(",")}`);
  const setLate = hotbarGroups("Sword", 276, "Bronze Sword", "BLU", null, null, lateNames);
  if (setLate.find((group) => group.title === "Spells")?.actions.map((action) => action.name).join(",") !== lateNames.join(",")) {
    throw new Error("late blue set");
  }
  if (findAction("spell:magic-hammer")?.name !== "Magic Hammer" || findAction("spell:reactor-cool")?.name !== "Reactor Cool" || findAction("spell:exuviation")?.name !== "Exuviation" || findAction("spell:vertical-cleave")?.name !== "Vertical Cleave") {
    throw new Error("late blue spell slots");
  }
  const subLate = hotbarGroups("Sword", 250, "Bronze Sword", "WAR", "BLU", null, lateNames);
  if (subLate.find((group) => group.title === "Spells")?.actions.some((action) => lateNames.includes(action.name))) {
    throw new Error("subjob late blue");
  }
  const raptorHits = ALL.filter((action) => !raptorNames.includes(action.name) && raptorMarks.includes(markOf(action.name))).map((action) => `${action.name}=${markOf(action.name)}`);
  if (raptorHits.length > 0) throw new Error(`raptor blue marks collide ${raptorHits.join(",")}`);
  const setRaptor = hotbarGroups("Sword", 276, "Bronze Sword", "BLU", null, null, raptorNames);
  if (setRaptor.find((group) => group.title === "Spells")?.actions.map((action) => action.name).join(",") !== raptorNames.join(",")) {
    throw new Error("set raptor blue spells");
  }
  if (findAction("spell:frost-breath")?.name !== "Frost Breath" || findAction("spell:sandspray")?.name !== "Sandspray" || findAction("spell:corrosive-ooze")?.name !== "Corrosive Ooze" || findAction("spell:diamondhide")?.name !== "Diamondhide" || findAction("spell:enervation")?.name !== "Enervation") {
    throw new Error("raptor blue spell slots");
  }
  const subRaptor = hotbarGroups("Sword", 250, "Bronze Sword", "WAR", "BLU", null, raptorNames);
  if (subRaptor.find((group) => group.title === "Spells")?.actions.some((action) => raptorNames.includes(action.name))) {
    throw new Error("subjob raptor blue spells");
  }
  const setShell = hotbarGroups("Sword", 276, "Bronze Sword", "BLU", null, null, shellNames);
  if (setShell.find((group) => group.title === "Spells")?.actions.map((action) => action.name).join(",") !== shellNames.join(",")) {
    throw new Error("set shell blue spells");
  }
  if (findAction("spell:metallic-body")?.name !== "Metallic Body" || findAction("spell:queasyshroom")?.name !== "Queasyshroom" || findAction("spell:head-butt")?.name !== "Head Butt" || findAction("spell:feather-storm")?.name !== "Feather Storm" || findAction("spell:helldive")?.name !== "Helldive") {
    throw new Error("shell blue spell slots");
  }
  const setStarter = hotbarGroups("Sword", 276, "Bronze Sword", "BLU", null, null, starterNames);
  if (setStarter.find((group) => group.title === "Spells")?.actions.map((action) => action.name).join(",") !== "Sandspin,Pollen,Power Attack,Sprout Smack,Wild Oats") {
    throw new Error("set starter blue spells");
  }
  if (findAction("spell:sandspin")?.name !== "Sandspin" || findAction("spell:pollen")?.name !== "Pollen" || findAction("spell:power-attack")?.name !== "Power Attack" || findAction("spell:sprout-smack")?.name !== "Sprout Smack" || findAction("spell:wild-oats")?.name !== "Wild Oats") {
    throw new Error("starter blue spell slots");
  }
  const subMind = hotbarGroups("Sword", 250, "Bronze Sword", "WAR", "BLU", null, ["Memento Mori", "Mind Blast"]);
  if (subMind.find((group) => group.title === "Spells")?.actions.some((action) => action.name === "Memento Mori" || action.name === "Mind Blast")) {
    throw new Error("subjob Memento Mori and Mind Blast");
  }
  const subSilk = hotbarGroups("Sword", 250, "Bronze Sword", "WAR", "BLU", null, ["Cocoon", "Refueling"]);
  if (subSilk.find((group) => group.title === "Spells")?.actions.some((action) => action.name === "Cocoon" || action.name === "Refueling")) {
    throw new Error("subjob Cocoon and Refueling");
  }
  const subBrawl = hotbarGroups("Sword", 250, "Bronze Sword", "WAR", "BLU", null, ["Battle Dance", "Uppercut"]);
  if (subBrawl.find((group) => group.title === "Spells")?.actions.some((action) => action.name === "Battle Dance" || action.name === "Uppercut")) {
    throw new Error("subjob brawler spells");
  }
  const subBeast = hotbarGroups("Sword", 250, "Bronze Sword", "WAR", "BLU", null, ["Healing Breeze", "Sheep Song"]);
  if (subBeast.find((group) => group.title === "Spells")?.actions.some((action) => action.name === "Healing Breeze" || action.name === "Sheep Song")) {
    throw new Error("subjob beast spells");
  }
  const subGaze = hotbarGroups("Sword", 250, "Bronze Sword", "WAR", "BLU", null, ["Chaotic Eye", "Zephyr Mantle"]);
  if (subGaze.find((group) => group.title === "Spells")?.actions.some((action) => action.name === "Chaotic Eye" || action.name === "Zephyr Mantle")) {
    throw new Error("subjob gaze spells");
  }
  const subLuminion = hotbarGroups("Sword", 250, "Bronze Sword", "WAR", "BLU", null, ["Actinic Burst", "Plasma Charge"]);
  if (subLuminion.find((group) => group.title === "Spells")?.actions.some((action) => action.name === "Actinic Burst" || action.name === "Plasma Charge")) {
    throw new Error("subjob luminion spells");
  }
  const subKick = hotbarGroups("Sword", 250, "Bronze Sword", "WAR", "BLU", null, ["Foot Kick"]);
  if (subKick.find((group) => group.title === "Spells")?.actions.some((action) => action.name === "Foot Kick")) throw new Error("subjob Foot Kick");
  const subCarrot = hotbarGroups("Sword", 250, "Bronze Sword", "WAR", "BLU", null, ["Wild Carrot", "Foot Kick"]);
  if (subCarrot.find((group) => group.title === "Spells")?.actions.some((action) => action.name === "Wild Carrot" || action.name === "Foot Kick")) throw new Error("subjob blue magic");
  const warBlu = hotbarGroups("Sword", 250, "Bronze Sword", "WAR", "BLU").find((group) => group.title === "Abilities")?.actions.map((action) => action.name) ?? [];
  if (warBlu.filter((name) => bluNames.includes(name)).join(",") !== "Burst Affinity") throw new Error(`BLU subjob abilities ${warBlu.filter((name) => bluNames.includes(name)).join(",")}`);
  if (findAction("ability:azure-lore")?.name !== "Azure Lore") throw new Error("Azure Lore slots");
  const savage = findAction("ws:savage-blade");
  if (!savage || canUse(savage, "Sword", 276, "Bronze Sword", "BLU") !== null) throw new Error("BLU can keep Savage Blade");
  const sanguine = findAction("ws:sanguine-blade");
  if (sanguine && canUse(sanguine, "Sword", 276, "Bronze Sword", "BLU") === null) throw new Error("Sanguine Blade is past 75");
  if (findAction("ability:astral-flow")?.name !== "Astral Flow" || findAction("ability:elemental-siphon")?.name !== "Elemental Siphon" || findAction("spell:carbuncle")?.name !== "Carbuncle") {
    throw new Error("SMN bar actions");
  }
  const smnBar = hotbarGroups("Staff", 250, "Ash Staff", "SMN");
  const smnAbilities = smnBar.find((group) => group.title === "Abilities")?.actions.map((action) => action.name) ?? [];
  if (smnAbilities.join(",") !== "Astral Flow,Elemental Siphon,Apogee,Assault,Retreat,Release") throw new Error(`SMN abilities ${smnAbilities.join(",")}`);
  const smnPacts = smnBar.find((group) => group.title === "Blood Pacts")?.actions.map((action) => action.name) ?? [];
  if (!smnPacts.includes("Healing Ruby") || !smnPacts.includes("Flaming Crush") || !smnPacts.includes("Inferno") || !smnPacts.includes("Punch") || smnPacts.includes("Meteor Strike")) {
    throw new Error("SMN blood pacts");
  }
  let lastAvatar = "";
  let lastLevel = -1;
  const avatarOrder: string[] = [];
  for (const name of smnPacts) {
    const pact = pactByName(name);
    if (!pact) throw new Error(`missing pact ${name}`);
    if (pact.avatar !== lastAvatar) {
      if (avatarOrder.includes(pact.avatar)) throw new Error(`${pact.avatar} pacts are split`);
      avatarOrder.push(pact.avatar);
      lastAvatar = pact.avatar;
      lastLevel = -1;
    }
    if (pact.level < lastLevel) throw new Error(`${name} is above a higher-level pact`);
    lastLevel = pact.level;
  }
  if (avatarOrder.join(",") !== "Carbuncle,Cait Sith,Ifrit,Shiva,Garuda,Titan,Ramuh,Leviathan,Fenrir,Diabolos,Siren,Alexander,Odin") {
    throw new Error(`pact avatars ${avatarOrder.join(",")}`);
  }
  const carbuncle = smnPacts.filter((name) => pactByName(name)?.avatar === "Carbuncle");
  if (carbuncle.join(",") !== "Healing Ruby,Searing Light,Poison Nails,Shining Ruby,Glittering Ruby,Meteorite,Healing Ruby II") {
    throw new Error(`Carbuncle order ${carbuncle.join(",")}`);
  }
  if (findAction("pact:healing-ruby")?.name !== "Healing Ruby" || findAction("pact:fire-ii")?.id !== "pact:fire-ii") throw new Error("pact slot");
  const warSmnPacts = hotbarGroups("Sword", 250, "Bronze Sword", "WAR", "SMN").find((group) => group.title === "Blood Pacts")?.actions.map((action) => action.name) ?? [];
  if (!warSmnPacts.includes("Healing Ruby") || !warSmnPacts.includes("Poison Nails") || warSmnPacts.includes("Flaming Crush") || warSmnPacts.includes("Inferno") || warSmnPacts.includes("Meteorite")) {
    throw new Error(`SMN subjob pacts ${warSmnPacts.join(",")}`);
  }
  const smnSpells = smnBar.find((group) => group.title === "Spells")?.actions.map((action) => action.name) ?? [];
  if (!smnSpells.includes("Carbuncle") || !smnSpells.includes("Ifrit") || !smnSpells.includes("Fire Spirit") || !smnSpells.includes("Odin")) {
    throw new Error("SMN spells");
  }
  const warSmn = hotbarGroups("Sword", 250, "Bronze Sword", "WAR", "SMN").find((group) => group.title === "Abilities")?.actions.map((action) => action.name) ?? [];
  if (warSmn.filter((name) => name === "Assault" || name === "Retreat" || name === "Release" || name === "Astral Flow" || name === "Apogee").join(",") !== "Assault,Retreat,Release") {
    throw new Error("SMN subjob abilities");
  }
  const enpi = findAction("ws:tachi-enpi");
  if (!enpi || canUse(enpi, "Great Katana", 276, "Mumeito", "SAM") !== null) throw new Error("SAM can keep Tachi: Enpi");
  if (canUse(enpi!, "Great Katana", 0, "Hardwood Katana", "WAR") === null) throw new Error("WAR cannot keep Tachi: Enpi");
  const combo = findAction("ws:combo");
  if (!combo || canUse(combo, "Hand-to-Hand", 276, "Cesti", "MNK") !== null) throw new Error("MNK can keep Combo");
  const howling = findAction("ws:howling-fist");
  if (!howling || canUse(howling, "Hand-to-Hand", 276, "Cesti", "MNK") !== null) throw new Error("MNK can keep Howling Fist");
  if (canUse(howling!, "Hand-to-Hand", 210, "Cesti", "WAR") === null) throw new Error("WAR cannot keep Howling Fist");
  const hands = hotbarGroups("Hand-to-Hand", warSkill("Hand-to-Hand", LEVEL));
  const h2h = hands.find((group) => group.title === "Weapon skills");
  if (!h2h?.actions.some((action) => action.name === "Combo")) throw new Error("Combo at 75");
  const fast = ALL_SWORD.find((action) => action.name === "Fast Blade");
  if (!fast || canUse(fast, "Axe", 6, "Bronze Axe") !== "Fast Blade needs Sword.") throw new Error("wrong weapon");
  const abilities = hotbarGroups("Sword", warSkill("Sword", LEVEL), "Bronze Sword").find((group) => group.title === "Abilities");
  if (!abilities || abilities.actions.length !== 7) throw new Error("ability bar");
  const ranged = hotbarGroups("Sword", warSkill("Sword", LEVEL), "Bronze Sword").find((group) => group.title === "Ranged");
  if (!ranged || ranged.actions.length !== 1 || ranged.actions[0]?.id !== "ranged:attack" || ranged.actions[0]?.name !== "Ranged Attack") {
    throw new Error("ranged attack is not on the bar");
  }
  if (findAction("ranged:attack")?.kind !== "ranged" || countsDown("ranged")) throw new Error("ranged attack action");
  if (markOf("Ranged Attack") !== "RG" || markOf("Raise") === "RG") throw new Error("ranged mark");
  for (const action of [...ABILITIES, ...BLM_BAR, ...WHM_BAR, ...RDM_BAR, ...RNG_BAR, ...PLD_BAR, ...NIN_BAR, ...SPELLS, ...STONE_BAR, ...CURE_BAR, ...NIN_MAGIC, ...ITEMS]) {
    if (!countsDown(action.kind) || action.recast == null || action.recast <= 0) throw new Error(`${action.name} needs a hotbar countdown`);
    if (action.kind === "item" && (action.activate == null || action.activate <= 0)) throw new Error(`${action.name} needs an activate time`);
  }
  const cureSlot = findAction("spell:cure");
  if (!cureSlot || cureSlot.name !== "Cure" || cureSlot.kind !== "spell" || cureSlot.recast !== 5) throw new Error("Cure does not slot");
  if (findAction("spell:cure-ii")?.recast !== 5.5 || findAction("spell:cure-iii")?.recast !== 6 || findAction("spell:cure-iv")?.recast !== 8 || findAction("spell:cure-v")?.name !== "Cure V" || findAction("spell:cure-v")?.recast !== 10) {
    throw new Error("Cure tiers do not slot");
  }
  if (markOf("Stone") !== "ST" || markOf("Stone II") !== "S2" || markOf("Stone III") !== "S3" || markOf("Stone IV") !== "S4") {
    throw new Error("stone marks");
  }
  if (markOf("Water") !== "WA" || markOf("Water II") !== "W2" || markOf("Water III") !== "W3" || markOf("Water IV") !== "W4") {
    throw new Error("water marks");
  }
  if (markOf("Aero") !== "AE" || markOf("Aero II") !== "A2" || markOf("Aero III") !== "A3" || markOf("Aero IV") !== "A4") {
    throw new Error("aero marks");
  }
  if (markOf("Blizzard") !== "BL" || markOf("Blizzard II") !== "B2" || markOf("Blizzard III") !== "B3" || markOf("Blizzard IV") !== "B4") {
    throw new Error("blizzard marks");
  }
  if (markOf("Fire") !== "FI" || markOf("Fire II") !== "F2" || markOf("Fire III") !== "F3" || markOf("Fire IV") !== "F4") {
    throw new Error("fire marks");
  }
  if (markOf("Thunder") !== "TH" || markOf("Thunder II") !== "T2" || markOf("Thunder III") !== "T3" || markOf("Thunder IV") !== "T4") {
    throw new Error("thunder marks");
  }
  if (markOf("Stonega") !== "SG" || markOf("Stonega II") !== "G2" || markOf("Stonega III") !== "G3") {
    throw new Error("stonega marks");
  }
  if (markOf("Blizzaga") !== "BG" || markOf("Blizzaga II") !== "Z2" || markOf("Blizzaga III") !== "Z3") {
    throw new Error("blizzaga marks");
  }
  if (markOf("Blizzaga") === "BL" || markOf("Blizzaga II") === "B2" || markOf("Blizzaga III") === "B3") {
    throw new Error("blizzaga marks collide");
  }
  if (markOf("Aeroga") !== "AG" || markOf("Aeroga II") !== "R2" || markOf("Aeroga III") !== "R3") {
    throw new Error("aeroga marks");
  }
  if (markOf("Aeroga") === "AE" || markOf("Aeroga II") === "A2" || markOf("Aeroga III") === "A3") {
    throw new Error("aeroga marks collide");
  }
  if (markOf("Firaga") !== "FG" || markOf("Firaga II") !== "I2" || markOf("Firaga III") !== "I3") {
    throw new Error("firaga marks");
  }
  if (markOf("Firaga") === "FI" || markOf("Firaga II") === "F2" || markOf("Firaga III") === "F3") {
    throw new Error("firaga marks collide");
  }
  if (markOf("Waterga") !== "WG" || markOf("Waterga II") !== "E2" || markOf("Waterga III") !== "E3") {
    throw new Error("waterga marks");
  }
  if (markOf("Waterga") === "WA" || markOf("Waterga II") === "W2" || markOf("Waterga III") === "W3") {
    throw new Error("waterga marks collide");
  }
  if (markOf("Thundaga") !== "TG" || markOf("Thundaga II") !== "U2" || markOf("Thundaga III") !== "U3") {
    throw new Error("thundaga marks");
  }
  if (markOf("Thundaga") === "TH" || markOf("Thundaga II") === "T2" || markOf("Thundaga III") === "T3") {
    throw new Error("thundaga marks collide");
  }
  if (markOf("Freeze") !== "FR" || markOf("Tornado") !== "TO" || markOf("Quake") !== "QK" || markOf("Burst") !== "BU" || markOf("Flood") !== "FD" || markOf("Flare") !== "FA") {
    throw new Error("ancient marks");
  }
  if (markOf("Flood") === markOf("Flare") || markOf("Flare") === "FI" || markOf("Freeze") === "FI") {
    throw new Error("ancient marks collide");
  }
  if (markOf("Blaze Spikes") !== "BS" || markOf("Ice Spikes") !== "IS" || markOf("Shock Spikes") !== "SS") {
    throw new Error("spike marks");
  }
  if (markOf("Blaze Spikes") === "FI" || markOf("Ice Spikes") === "BL" || markOf("Shock Spikes") === markOf("Blaze Spikes")) {
    throw new Error("spike marks collide");
  }
  if (markOf("Burn") !== "BN" || markOf("Frost") !== "FT" || markOf("Choke") !== "CK" || markOf("Rasp") !== "RP" || markOf("Shock") !== "SK" || markOf("Drown") !== "DW") {
    throw new Error("debuff marks");
  }
  if (markOf("Burn") === markOf("Burst") || markOf("Frost") === markOf("Freeze") || markOf("Shock") === markOf("Shock Spikes")) {
    throw new Error("debuff marks collide");
  }
  if (markOf("Blind") !== "BD" || markOf("Blind II") !== "D2" || markOf("Bind") !== "BI" || markOf("Sleep") !== "SL" || markOf("Sleep II") !== "L2" || markOf("Sleepga") !== "LG" || markOf("Sleepga II") !== "Q2") {
    throw new Error("enfeeble marks");
  }
  if (markOf("Paralyze II") !== "2Z" || markOf("Slow II") !== "2S" || markOf("Gravity") !== "GV" || markOf("Dispel") !== "DS" || markOf("Distract") !== "DT" || markOf("Frazzle") !== "FZ" || markOf("Inundation") !== "IU") {
    throw new Error("enfeeble ii marks");
  }
  if (markOf("Dia") !== "DA" || markOf("Dia II") !== "2D" || markOf("Dia III") !== "3D" || markOf("Diaga") !== "DG" || markOf("Poison") !== "PS" || markOf("Poison II") !== "2P" || markOf("Poisonga") !== "PG" || markOf("Bio") !== "BO" || markOf("Bio II") !== "2O" || markOf("Bio III") !== "3O" || markOf("Stun") !== "SU") {
    throw new Error("dia poison marks");
  }
  if (markOf("Bio") === markOf("Bind") || markOf("Bio II") === markOf("Blizzard II") || markOf("Bio III") === markOf("Blizzard III") || markOf("Stun") === markOf("Stone") || markOf("Stun") === markOf("Stoneskin") || markOf("Bio") === markOf("Burn")) {
    throw new Error("Bio marks collide");
  }
  if (markOf("Dia II") === markOf("Blind II") || markOf("Poison II") === markOf("Stone II") || markOf("Poison II") === markOf("Warp II") || markOf("Poison") === markOf("Poisona") || markOf("Diaga") === markOf("Dia") || markOf("Poisonga") === markOf("Poison")) {
    throw new Error("dia poison marks collide");
  }
  if (markOf("Frazzle") === markOf("Freeze") || markOf("Frazzle") === markOf("Enfire") || markOf("Distract") === markOf("Dispel") || markOf("Distract") === markOf("Drain")) {
    throw new Error("Distract marks collide");
  }
  if (markOf("Blind II") === markOf("Blizzard II") || markOf("Paralyze II") === markOf("Warp II") || markOf("Slow II") === markOf("Stone II") || markOf("Dispel") === markOf("Drain")) {
    throw new Error("enfeeble ii marks collide");
  }
  if (markOf("Blind") === markOf("Blizzard") || markOf("Sleep II") === markOf("Stone II") || markOf("Sleepga") === markOf("Stonega") || markOf("Sleepga II") === markOf("Stonega II")) {
    throw new Error("enfeeble marks collide");
  }
  if (markOf("Drain") !== "DR" || markOf("Aspir") !== "AS" || markOf("Drain") === markOf("Drown") || markOf("Aspir") === markOf("Aero") || markOf("Warp") !== "WP" || markOf("Warp II") !== "P2" || markOf("Warp") === markOf("Water") || markOf("Warp II") === markOf("Water II")) {
    throw new Error("siphon marks");
  }
  if (markOf("Cure") !== "CU" || markOf("Cure II") !== "C2" || markOf("Cure III") !== "C3" || markOf("Cure IV") !== "C4" || markOf("Cure V") !== "C5") {
    throw new Error("cure marks");
  }
  if (markOf("Cure") === markOf("Choke") || markOf("Cure II") === markOf("Stone II")) throw new Error("cure marks collide");
  if (markOf("Curaga") !== "CG" || markOf("Curaga II") !== "2G" || markOf("Curaga III") !== "3G" || markOf("Curaga IV") !== "4G") {
    throw new Error("curaga marks");
  }
  if (markOf("Curaga") === markOf("Cure") || markOf("Curaga II") === markOf("Cure II") || markOf("Curaga III") === markOf("Cure III") || markOf("Curaga IV") === markOf("Cure IV") || markOf("Curaga") === markOf("Choke") || markOf("Curaga II") === markOf("Stonega II")) {
    throw new Error("curaga marks collide");
  }
  if (markOf("Cura") !== "CA" || markOf("Cura") === markOf("Cure") || markOf("Cura") === markOf("Curaga") || markOf("Cura") === markOf("Cursna")) {
    throw new Error("Cura mark");
  }
  if (markOf("Protect") !== "PT" || markOf("Protect II") !== "2T" || markOf("Protect III") !== "3T" || markOf("Protect IV") !== "4T") {
    throw new Error("Protect marks");
  }
  if (markOf("Protectra") !== "TR" || markOf("Protectra II") !== "2R" || markOf("Protectra III") !== "3R" || markOf("Protectra IV") !== "4R" || markOf("Protectra V") !== "5R") {
    throw new Error("Protectra marks");
  }
  if (markOf("Shell") !== "SH" || markOf("Shell II") !== "2H" || markOf("Shell III") !== "3H" || markOf("Shell IV") !== "4H") {
    throw new Error("Shell marks");
  }
  if (markOf("Shellra") !== "LR" || markOf("Shellra II") !== "2L" || markOf("Shellra III") !== "3L" || markOf("Shellra IV") !== "4L" || markOf("Shellra V") !== "5L") {
    throw new Error("Shellra marks");
  }
  if (markOf("Regen") !== "RG" || markOf("Regen II") !== "2N" || markOf("Regen III") !== "3N" || markOf("Haste") !== "HA" || markOf("Refresh") !== "RF" || markOf("Auspice") !== "AU") {
    throw new Error("maintain marks");
  }
  const barMarks = ["Barstonra", "Barwatera", "Baraera", "Barfira", "Barblizzara", "Barthundra", "Barsleepra", "Barpoisonra", "Barparalyzra", "Barblindra", "Barsilencera", "Barvira", "Barpetra"].map(markOf);
  if (new Set(barMarks).size !== barMarks.length || barMarks.some((mark) => mark === "BA" || mark === "AU" || mark === "HA" || mark === "BI" || mark === "BD" || mark === "RG")) {
    throw new Error(`bar marks ${barMarks.join(",")}`);
  }
  if (markOf("Regen") === markOf("Reraise") || markOf("Regen II") === markOf("Aeroga II") || markOf("Regen III") === markOf("Aeroga III") || markOf("Haste") === markOf("Holy") || markOf("Refresh") === markOf("Regen") || markOf("Refresh") === markOf("Reraise") || markOf("Refresh") === markOf("Raise") || markOf("Refresh") === markOf("Rasp") || markOf("Auspice") === markOf("Aspir") || markOf("Auspice") === markOf("Aero") || markOf("Regen II") === markOf("Stone II")) {
    throw new Error("maintain marks collide");
  }
  if (markOf("Protect") === markOf("Protectra") || markOf("Protect II") === markOf("Warp II") || markOf("Shell") === markOf("Shellra") || markOf("Shell II") === markOf("Stone II") || markOf("Protectra II") === markOf("Aeroga II") || markOf("Shellra II") === markOf("Sleep II")) {
    throw new Error("barrier marks collide");
  }
  if (findAction("spell:cura")?.name !== "Cura" || findAction("spell:cura")?.cast !== 3 || findAction("spell:cura")?.recast !== 30) {
    throw new Error("Cura does not slot");
  }
  if (findAction("spell:refresh")?.name !== "Refresh" || findAction("spell:refresh")?.cast !== 5 || findAction("spell:refresh")?.recast !== 18) {
    throw new Error("Refresh does not slot");
  }
  if (findAction("spell:curaga")?.recast !== 10 || findAction("spell:curaga-ii")?.recast !== 10.25 || findAction("spell:curaga-iii")?.recast !== 10.5 || findAction("spell:curaga-iv")?.name !== "Curaga IV" || findAction("spell:curaga-iv")?.recast !== 10.75) {
    throw new Error("Curaga does not slot");
  }
  if (markOf("Stoneskin") !== "SN" || markOf("Stoneskin") === markOf("Stone") || markOf("Stoneskin") === markOf("Sleep") || markOf("Stoneskin") === markOf("Shock")) {
    throw new Error("Stoneskin mark");
  }
  if (markOf("Poisona") !== "PN" || markOf("Paralyna") !== "PY" || markOf("Blindna") !== "DN" || markOf("Silena") !== "SI" || markOf("Stona") !== "TN" || markOf("Viruna") !== "VR" || markOf("Cursna") !== "CN" || markOf("Esuna") !== "ES" || markOf("Sacrifice") !== "SF") {
    throw new Error("na marks");
  }
  if (markOf("Blindna") === markOf("Blind") || markOf("Blindna") === markOf("Blizzard") || markOf("Stona") === markOf("Stone") || markOf("Cursna") === markOf("Cure") || markOf("Poisona") === markOf("Paralyna")) {
    throw new Error("na marks collide");
  }
  if (markOf("Aquaveil") !== "AQ" || markOf("Blink") !== "LK" || markOf("Phalanx") !== "PX" || markOf("Reprisal") !== "RL" || markOf("Paralyze") !== "PZ" || markOf("Silence") !== "SE" || markOf("Slow") !== "SO" || markOf("Erase") !== "ER") {
    throw new Error("white marks");
  }
  const enMarks = ["Enthunder", "Enstone", "Enaero", "Enblizzard", "Enfire", "Enwater", "Enthunder II", "Enstone II", "Enaero II", "Enblizzard II", "Enfire II", "Enwater II"];
  const enCodes = enMarks.map(markOf);
  if (enCodes.join(",") !== "ET,EO,NA,IZ,FR,WT,2U,2O,2A,2B,2F,2W" || new Set(enCodes).size !== enCodes.length) throw new Error("enspell marks");
  if (markOf("Enthunder") === markOf("Thunder") || markOf("Enfire") === markOf("Fire") || markOf("Enstone") === markOf("Stone") || markOf("Enaero") === markOf("Aero") || markOf("Enblizzard") === markOf("Blizzard") || markOf("Enwater") === markOf("Water")) {
    throw new Error("enspell marks collide");
  }
  if (markOf("Enfire II") === markOf("Fire II") || markOf("Enwater II") === markOf("Water II") || markOf("Enaero II") === markOf("Aero II") || markOf("Enthunder II") === markOf("Thunder II") || markOf("Enstone II") === markOf("Stone II") || markOf("Enblizzard II") === markOf("Blizzard II")) {
    throw new Error("enspell II marks collide");
  }
  if (findAction("spell:enfire")?.recast !== 10 || findAction("spell:enfire")?.cast !== 3 || findAction("spell:enfire-ii")?.recast !== 30 || findAction("spell:enfire-ii")?.cast !== 3) {
    throw new Error("enspell does not slot");
  }
  if (ENSPELL_BAR.length !== 12 || ENSPELL_BAR[0]?.name !== "Enthunder" || ENSPELL_BAR[11]?.name !== "Enwater II") throw new Error("enspell bar");
  if (findAction("spell:gravity")?.name !== "Gravity" || findAction("spell:dispel")?.name !== "Dispel" || findAction("spell:inundation")?.name !== "Inundation" || findAction("spell:blind-ii")?.name !== "Blind II" || findAction("spell:slow-ii")?.name !== "Slow II" || findAction("spell:paralyze-ii")?.name !== "Paralyze II") {
    throw new Error("RDM enfeeble bar");
  }
  if (findAction("spell:dia")?.name !== "Dia" || findAction("spell:dia-ii")?.name !== "Dia II" || findAction("spell:dia-iii")?.name !== "Dia III" || findAction("spell:diaga")?.name !== "Diaga" || findAction("spell:poison")?.name !== "Poison" || findAction("spell:poison-ii")?.name !== "Poison II" || findAction("spell:poisonga")?.name !== "Poisonga" || findAction("spell:bio")?.name !== "Bio" || findAction("spell:bio-ii")?.name !== "Bio II" || findAction("spell:bio-iii")?.name !== "Bio III" || findAction("spell:stun")?.name !== "Stun") {
    throw new Error("dia poison bar");
  }
  if (markOf("Blink") === markOf("Blizzard") || markOf("Phalanx") === markOf("Protect") || markOf("Phalanx") === markOf("Poison") || markOf("Reprisal") === markOf("Rasp") || markOf("Reprisal") === markOf("Refresh") || markOf("Reprisal") === markOf("Rampart") || markOf("Paralyze") === markOf("Paralyna") || markOf("Silence") === markOf("Silena") || markOf("Silence") === markOf("Sleep") || markOf("Slow") === markOf("Sleep") || markOf("Slow") === markOf("Shell") || markOf("Erase") === markOf("Esuna") || markOf("Aquaveil") === markOf("Aspir") || markOf("Aquaveil") === markOf("Auspice")) {
    throw new Error("white marks collide");
  }
  if (findAction("spell:phalanx")?.name !== "Phalanx" || findAction("spell:phalanx")?.cast !== 3 || findAction("spell:phalanx")?.recast !== 10 || findAction("spell:reprisal")?.name !== "Reprisal" || findAction("spell:reprisal")?.cast !== 1 || findAction("spell:reprisal")?.recast !== 180) {
    throw new Error("Phalanx or Reprisal does not slot");
  }
  if (findAction("spell:poisona")?.recast !== 5 || findAction("spell:blindna")?.recast !== 10 || findAction("spell:cursna")?.recast !== 10 || findAction("spell:esuna")?.recast !== 30 || findAction("spell:sacrifice")?.name !== "Sacrifice") {
    throw new Error("na spells do not slot");
  }
  if (countsDown("weaponskill")) throw new Error("weapon skills do not recast");
  const blm = hotbarGroups("Staff", 240, "Ash Staff", "BLM");
  const blmAbilities = blm.find((group) => group.title === "Abilities");
  if (blmAbilities?.actions.map((action) => action.name).join(",") !== "Manafont,Elemental Seal") throw new Error("BLM abilities");
  const whm = hotbarGroups("Club", 256, "Ash Club", "WHM");
  if (whm.find((group) => group.title === "Abilities")?.actions.map((action) => action.name).join(",") !== "Benediction,Divine Seal,Afflatus Solace,Afflatus Misery") {
    throw new Error("WHM abilities");
  }
  const whmSpells = whm.find((group) => group.title === "Spells");
  if (whmSpells?.actions.map((action) => action.name).join(",") !== "Cure,Cure II,Cure III,Cure IV,Cure V,Curaga,Curaga II,Curaga III,Curaga IV,Stoneskin,Aquaveil,Blink,Poisona,Paralyna,Blindna,Silena,Cursna,Viruna,Stona,Esuna,Sacrifice,Erase,Raise,Raise II,Raise III,Reraise,Reraise II,Reraise III,Banish,Banish II,Banish III,Banishga,Banishga II,Flash,Holy,Repose,Dia,Paralyze,Slow,Diaga,Silence,Dia II,Cura,Protect,Protect II,Protect III,Protect IV,Protectra,Protectra II,Protectra III,Protectra IV,Protectra V,Shell,Shell II,Shell III,Shell IV,Shellra,Shellra II,Shellra III,Shellra IV,Shellra V,Regen,Regen II,Regen III,Haste,Auspice,Barstonra,Barsleepra,Barwatera,Barpoisonra,Barparalyzra,Baraera,Barfira,Barblindra,Barblizzara,Barsilencera,Barthundra,Barvira,Barpetra") {
    throw new Error("WHM cures");
  }
  if (whmSpells?.actions.map((action) => action.cast).join(",") !== "2,2.25,2.5,2.5,2.5,4.5,4.75,5,5.25,7,5,6,1,1,1,1,1,1,1,1,1,2.5,15,14,13,8,7.5,7,2,2.5,3,2.75,4.5,0.5,0.75,3,1,3,2,1.5,3,1.5,3,1,1.25,1.5,1.75,1,1.25,1.5,1.75,2,1,1.25,1.5,1.75,1,1.25,1.5,1.75,2,1.5,1.75,2,3,3,0.5,5,0.5,5,5,0.5,0.5,5,0.5,5,0.5,5,5") throw new Error("WHM cure casts");
  const whmWs = whm.find((group) => group.title === "Weapon skills")?.actions.map((action) => action.name) ?? [];
  const whmClub = ["Shining Strike", "Seraph Strike", "Brainshaker", "Starlight", "Moonlight", "Skullbreaker", "True Strike", "Judgment", "Hexa Strike", "Black Halo"];
  if (whmWs.join("|") !== whmClub.join("|")) throw new Error(`WHM club weapon skills ${whmWs.join(", ")}`);
  if (markOf("Hexa Strike") !== "HX" || markOf("Hexa Strike") === markOf("Heavy Swing") || markOf("Hexa Strike") === markOf("Haste") || markOf("Hexa Strike") === markOf("Holy")) {
    throw new Error("Hexa Strike mark");
  }
  const hexa = findAction("ws:hexa-strike");
  if (!hexa || canUse(hexa, "Club", 256, "Ash Club", "WHM") !== null) throw new Error("WHM can keep Hexa Strike");
  if (canUse(hexa, "Club", 240, "Ash Club", "WAR") === null) throw new Error("WAR cannot keep Hexa Strike");
  const whmSub = hotbarGroups("Sword", warSkill("Sword", LEVEL), "Bronze Sword", "WAR", "WHM").find((group) => group.title === "Spells");
  if (whmSub?.actions.map((action) => action.name).join(",") !== "Cure,Cure II,Cure III,Curaga,Curaga II,Stoneskin,Aquaveil,Blink,Poisona,Paralyna,Blindna,Silena,Cursna,Viruna,Erase,Raise,Reraise,Banish,Banish II,Banishga,Dia,Paralyze,Slow,Diaga,Silence,Dia II,Protect,Protect II,Protectra,Protectra II,Shell,Shell II,Shellra,Shellra II,Regen,Barstonra,Barsleepra,Barwatera,Barpoisonra,Barparalyzra,Baraera,Barfira,Barblindra,Barblizzara,Barsilencera,Barthundra") throw new Error("WHM subjob cures");
  const skinSlot = findAction("spell:stoneskin");
  if (!skinSlot || skinSlot.name !== "Stoneskin" || skinSlot.kind !== "spell" || skinSlot.recast !== 30 || skinSlot.cast !== 7) throw new Error("Stoneskin does not slot");
  if (!blm.find((group) => group.title === "Weapon skills")?.actions.some((action) => action.name === "Heavy Swing")) {
    throw new Error("BLM staff weapon skill");
  }
  const blmWs = blm.find((group) => group.title === "Weapon skills")?.actions.map((action) => action.name) ?? [];
  if (blmWs.includes("Gate of Tartarus") || blmWs.includes("Vidohunir") || blmWs.includes("Myrkr")) throw new Error("BLM relic weapon skill listed");
  const blmSpells = blm.find((group) => group.title === "Spells");
  if (blmSpells?.actions.map((action) => action.name).join(",") !== "Stone,Poison,Blind,Water,Bind,Aero,Bio,Blaze Spikes,Drain,Fire,Stonega,Shock,Blizzard,Warp,Rasp,Waterga,Choke,Ice Spikes,Sleep,Thunder,Frost,Aeroga,Burn,Poisonga,Aspir,Stone II,Drown,Firaga,Shock Spikes,Water II,Sleepga,Blizzaga,Aero II,Bio II,Thundaga,Fire II,Stonega II,Warp II,Sleep II,Blizzard II,Poison II,Waterga II,Stun,Thunder II,Aeroga II,Freeze,Stone III,Tornado,Firaga II,Quake,Water III,Burst,Sleepga II,Blizzaga II,Flood,Aero III,Flare,Thundaga II,Fire III,Stonega III,Blizzard III,Waterga III,Thunder III,Aeroga III,Stone IV,Firaga III,Water IV,Blizzaga III,Aero IV,Fire IV,Thundaga III,Blizzard IV,Thunder IV") {
    throw new Error("BLM nukes");
  }
  if (blmSpells?.actions.map((action) => action.cast).join(",") !== "0.5,1,2,0.5,2,0.5,1.5,3,3,0.5,2,2.5,0.5,3,2.5,2,2.5,3,2.5,0.5,2.5,2,2.5,2,3,1.5,2.5,2,3,1.5,3,2,1.5,1.5,2,1.5,4,5,3,1.5,1,4,0.5,1.5,4,8.5,3,8.5,4,8.5,3,8.5,3.5,4,8.5,3,8.5,4,3,7,3,7,3,7,5,7,5,7,5,5,7,5,5") throw new Error("nuke cast times");
  if (blmSpells?.actions.map((action) => action.recast).join(",") !== "2,5,10,2,40,2,5,10,60,2,5,10,2,10,10,5,10,10,30,2,10,5,10,10,60,6,10,5,10,6,30,5,6,5,5,6,10,10,30,6,5,10,45,6,10,60,15,60,10,60,15,60,45,10,60,15,60,10,15,25,15,25,15,25,30,25,30,25,30,30,25,30,30") throw new Error("nuke recasts");
  const warStones = hotbarGroups("Staff", 240, "Ash Staff", "WAR", "BLM").find((group) => group.title === "Spells");
  if (warStones?.actions.map((action) => action.name).join(",") !== "Stone,Poison,Blind,Water,Bind,Aero,Bio,Blaze Spikes,Drain,Fire,Stonega,Shock,Blizzard,Warp,Rasp,Waterga,Choke,Ice Spikes,Sleep,Thunder,Frost,Aeroga,Burn,Poisonga,Aspir,Stone II,Drown,Firaga,Shock Spikes,Water II,Sleepga,Blizzaga,Aero II,Bio II,Thundaga") throw new Error("WAR subjob nukes");
  if (hotbarGroups("Sword", warSkill("Sword", LEVEL), "Bronze Sword").find((group) => group.title === "Spells")?.actions.length !== 0) {
    throw new Error("Warrior spells listed");
  }
  const supported = hotbarGroups("Staff", 240, "Ash Staff", "BLM", "WAR");
  const subNames = supported.find((group) => group.title === "Abilities")?.actions.map((action) => action.name) ?? [];
  if (!subNames.includes("Warcry") || subNames.includes("Mighty Strikes") || subNames.includes("Aggressor") || subNames.includes("Retaliation")) {
    throw new Error("WAR subjob abilities");
  }
  const pupNames = ["Overdrive", "Activate", "Deactivate", "Deploy", "Fire Maneuver", "Ice Maneuver", "Wind Maneuver", "Earth Maneuver", "Thunder Maneuver", "Water Maneuver", "Light Maneuver", "Dark Maneuver", "Deus Ex Automata", "Retrieve", "Repair", "Maintenance"];
  const pupMarks = ["P0", "P1", "P3", "P4", "P5", "P6", "P7", "P8", "P9", "Q0", "Q1", "Q3", "Q4", "Q5", "Q6", "Q7"];
  if (pupNames.map((name) => markOf(name)).join(",") !== pupMarks.join(",")) throw new Error(`PUP marks ${pupNames.map((name) => markOf(name)).join(",")}`);
  const pupTaken = new Set(ALL.filter((action) => !pupNames.includes(action.name)).map((action) => markOf(action.name)));
  const pupHits = pupMarks.filter((mark) => pupTaken.has(mark));
  if (pupHits.length) throw new Error(`PUP mark ${pupHits.join(",")} collides`);
  const pupBar = hotbarGroups("Hand-to-Hand", 276, "Cat Baghnakhs", "PUP");
  if (pupBar.find((group) => group.title === "Abilities")?.actions.map((action) => action.name).join(",") !== pupNames.join(",")) {
    throw new Error(`PUP abilities ${pupBar.find((group) => group.title === "Abilities")?.actions.map((action) => action.name).join(",")}`);
  }
  if (pupBar.find((group) => group.title === "Spells")?.actions.length !== 0) throw new Error("PUP spells");
  const pupWs = pupBar.find((group) => group.title === "Weapon skills")?.actions.map((action) => action.name) ?? [];
  if (pupWs.join(",") !== "Combo,Shoulder Tackle,One Inch Punch,Backhand Blow,Raging Fists,Spinning Attack,Howling Fist,Dragon Kick,Asuran Fists") {
    throw new Error(`PUP hand skills ${pupWs.join(",")}`);
  }
  const warPup = hotbarGroups("Sword", 250, "Bronze Sword", "WAR", "PUP").find((group) => group.title === "Abilities")?.actions.map((action) => action.name) ?? [];
  const pupSub = ["Activate", "Deactivate", "Deploy", "Fire Maneuver", "Ice Maneuver", "Wind Maneuver", "Earth Maneuver", "Thunder Maneuver", "Water Maneuver", "Light Maneuver", "Dark Maneuver", "Deus Ex Automata", "Retrieve", "Repair"];
  if (warPup.filter((name) => pupNames.includes(name)).join(",") !== pupSub.join(",")) {
    throw new Error(`PUP subjob abilities ${warPup.filter((name) => pupNames.includes(name)).join(",")}`);
  }
  if (findAction("ability:overdrive")?.name !== "Overdrive" || findAction("ability:fire-maneuver")?.name !== "Fire Maneuver") {
    throw new Error("PUP bar actions");
  }
  const corNames = COR_ABILITIES.filter((ability) => ability.level <= LEVEL && !ability.merit).map((ability) => ability.name);
  const corMarks = corNames.map((name) => markOf(name));
  if (new Set(corMarks).size !== corMarks.length) throw new Error(`COR mark duplicate ${corMarks.join(",")}`);
  const corTaken = new Set(ALL.filter((action) => !corNames.includes(action.name)).map((action) => markOf(action.name)));
  const corHits = corMarks.filter((mark) => corTaken.has(mark));
  if (corHits.length) throw new Error(`COR mark ${corHits.join(",")} collides`);
  const corBar = hotbarGroups("Sword", 240, "Bronze Sword", "COR");
  if (corBar.find((group) => group.title === "Abilities")?.actions.map((action) => action.name).join(",") !== corNames.join(",")) {
    throw new Error("COR abilities");
  }
  if (corBar.find((group) => group.title === "Spells")?.actions.length !== 0) throw new Error("COR spells");
  const corShots = hotbarGroups("Marksmanship", 250, "Musketoon", "COR").find((group) => group.title === "Weapon skills")?.actions.map((action) => action.name) ?? [];
  if (corShots.join(",") !== "Hot Shot,Split Shot,Sniper Shot,Slug Shot,Detonator") throw new Error(`COR guns ${corShots.join(",")}`);
  const corHeld = hotbarGroups("Sword", 240, "Bronze Sword", "COR", null, marksmanshipBar("COR", null, "musketoon")).find((group) => group.title === "Weapon skills")?.actions.map((action) => action.name) ?? [];
  for (const name of ["Hot Shot", "Split Shot", "Sniper Shot", "Slug Shot", "Detonator"]) {
    if (!corHeld.includes(name)) throw new Error(`COR musketoon missing ${name}`);
  }
  if (corHeld.includes("Leaden Salute") || corHeld.includes("Wildfire") || corHeld.includes("Blast Shot")) throw new Error(`COR musketoon listed ${corHeld.join(",")}`);
  if (hotbarGroups("Sword", 240, "Bronze Sword", "COR").find((group) => group.title === "Weapon skills")?.actions.some((action) => action.name === "Hot Shot")) {
    throw new Error("gun skill without a gun");
  }
  const hot = findAction("ws:hot-shot");
  if (!hot || canUse(hot, "Sword", 240, "Bronze Sword", "COR", null) !== "Hot Shot needs a gun.") throw new Error("Hot Shot without a gun");
  if (canUse(hot, "Sword", 240, "Bronze Sword", "COR", marksmanshipBar("COR", null, "musketoon")) !== null) throw new Error("COR can keep Hot Shot");
  const warCorGun = hotbarGroups("Sword", 250, "Bronze Sword", "WAR", "COR", marksmanshipBar("WAR", "COR", "light-crossbow")).find((group) => group.title === "Weapon skills")?.actions.map((action) => action.name) ?? [];
  for (const name of ["Hot Shot", "Split Shot", "Sniper Shot", "Slug Shot"]) {
    if (!warCorGun.includes(name)) throw new Error(`WAR/COR crossbow missing ${name}`);
  }
  if (warCorGun.includes("Detonator") || warCorGun.includes("Blast Shot") || warCorGun.includes("Leaden Salute")) throw new Error(`WAR/COR crossbow listed ${warCorGun.join(",")}`);
  const gunNames = ["Hot Shot", "Split Shot", "Sniper Shot", "Slug Shot", "Blast Shot", "Heavy Shot", "Detonator", "Numbing Shot", "Last Stand", "Coronach", "Wildfire", "Trueflight", "Leaden Salute", "Terminus"];
  const gunMarks = gunNames.map((name) => markOf(name));
  if (new Set(gunMarks).size !== gunMarks.length) throw new Error(`gun mark duplicate ${gunMarks.join(",")}`);
  const gunTaken = new Set(ALL.filter((action) => !gunNames.includes(action.name)).map((action) => markOf(action.name)));
  const gunHits = gunNames.filter((name) => gunTaken.has(markOf(name)));
  if (gunHits.length) throw new Error(`gun mark ${gunHits.join(",")} collides`);
  const warCor = hotbarGroups("Sword", 250, "Bronze Sword", "WAR", "COR").find((group) => group.title === "Abilities")?.actions.map((action) => action.name) ?? [];
  const corSub = ["Corsair's Roll", "Double-Up", "Ninja Roll", "Hunter's Roll", "Chaos Roll", "Magus's Roll", "Healer's Roll", "Drachen Roll", "Choral Roll", "Monk's Roll", "Beast Roll", "Samurai Roll"];
  if (warCor.filter((name) => corNames.includes(name)).join(",") !== corSub.join(",")) {
    throw new Error(`COR subjob abilities ${warCor.filter((name) => corNames.includes(name)).join(",")}`);
  }
  const dncNames = DNC_ABILITIES.filter((ability) => ability.level <= LEVEL && !ability.merit).map((ability) => ability.name);
  const dncMarks = dncNames.map((name) => markOf(name));
  if (new Set(dncMarks).size !== dncMarks.length) throw new Error(`DNC mark duplicate ${dncMarks.join(",")}`);
  const dncTaken = new Set(ALL.filter((action) => !dncNames.includes(action.name)).map((action) => markOf(action.name)));
  const dncHits = dncMarks.filter((mark) => dncTaken.has(mark));
  if (dncHits.length) throw new Error(`DNC mark ${dncHits.join(",")} collides`);
  const dncBar = hotbarGroups("Dagger", 276, "Bronze Dagger", "DNC");
  if (dncBar.find((group) => group.title === "Abilities")?.actions.map((action) => action.name).join(",") !== dncNames.join(",")) {
    throw new Error("DNC abilities");
  }
  if (dncBar.find((group) => group.title === "Spells")?.actions.length !== 0) throw new Error("DNC spells");
  const dncWs = dncBar.find((group) => group.title === "Weapon skills")?.actions.map((action) => action.name) ?? [];
  if (!dncWs.includes("Dancing Edge") || !dncWs.includes("Shark Bite") || !dncWs.includes("Evisceration")) throw new Error(`DNC daggers ${dncWs.join(",")}`);
  if (dncWs.includes("Pyrrhic Kleos") || dncWs.includes("Mercy Stroke") || dncWs.includes("Rudra's Storm")) throw new Error(`DNC mythic listed ${dncWs.join(",")}`);
  const dncHands = hotbarGroups("Hand-to-Hand", 210, "Cesti", "DNC").find((group) => group.title === "Weapon skills")?.actions.map((action) => action.name) ?? [];
  if (dncHands.join(",") !== "Combo,Shoulder Tackle,Backhand Blow,Spinning Attack") throw new Error(`DNC hands ${dncHands.join(",")}`);
  const warDnc = hotbarGroups("Sword", 250, "Bronze Sword", "WAR", "DNC").find((group) => group.title === "Abilities")?.actions.map((action) => action.name) ?? [];
  const dncSub = dncNames.filter((name) => {
    const row = DNC_ABILITIES.find((ability) => ability.name === name);
    return row != null && row.level <= 37 && row.access === "sub";
  });
  if (warDnc.filter((name) => dncNames.includes(name)).join(",") !== dncSub.join(",")) {
    throw new Error(`DNC subjob abilities ${warDnc.filter((name) => dncNames.includes(name)).join(",")}`);
  }
  const schNames = SCH_ABILITIES.filter((ability) => ability.level <= LEVEL && !ability.merit).map((ability) => ability.name);
  const schMarks = schNames.map((name) => markOf(name));
  if (new Set(schMarks).size !== schMarks.length) throw new Error(`SCH mark duplicate ${schMarks.join(",")}`);
  const schTaken = new Set(ALL.filter((action) => !schNames.includes(action.name)).map((action) => markOf(action.name)));
  const schHits = schMarks.filter((mark) => schTaken.has(mark));
  if (schHits.length) throw new Error(`SCH mark ${schHits.join(",")} collides`);
  const schBar = hotbarGroups("Club", 230, "Ash Club", "SCH");
  if (schBar.find((group) => group.title === "Abilities")?.actions.map((action) => action.name).join(",") !== schNames.join(",")) {
    throw new Error("SCH abilities");
  }
  const schSpells = schBar.find((group) => group.title === "Spells")?.actions.map((action) => action.name) ?? [];
  if (!schSpells.includes("Cure") || !schSpells.includes("Stone") || !schSpells.includes("Geohelix") || schSpells.includes("Cure V") || schSpells.includes("Stonega")) {
    throw new Error(`SCH spells ${schSpells.join(",")}`);
  }
  const schRows = schBar.find((group) => group.title === "Spells")?.actions ?? [];
  const tagged = (rows: readonly HotAction[], name: string) => rows.find((action) => action.name === name);
  const sleepRow = tagged(schRows, "Sleep");
  const spikeRow = tagged(schRows, "Blaze Spikes");
  if (sleepRow?.label !== "(Add.: Black): Sleep" || sleepRow.name !== "Sleep" || sleepRow.id !== "spell:sleep") throw new Error("sleep picker tag");
  if (spikeRow?.label != null || spikeRow?.name !== "Blaze Spikes") throw new Error("spikes picker tag");
  const schBlm = hotbarGroups("Club", 230, "Ash Club", "SCH", "BLM").find((group) => group.title === "Spells")?.actions ?? [];
  const schWhm = hotbarGroups("Club", 230, "Ash Club", "SCH", "WHM").find((group) => group.title === "Spells")?.actions ?? [];
  const blmSch = hotbarGroups("Staff", 240, "Ash Staff", "BLM", "SCH").find((group) => group.title === "Spells")?.actions ?? [];
  if (tagged(schBlm, "Sleep")?.label != null) throw new Error("sch/blm sleep picker");
  if (tagged(schBlm, "Stone IV")?.label !== "(Add.: Black): Stone IV") throw new Error("sch/blm stone iv picker");
  if (tagged(schWhm, "Silena")?.label != null || tagged(schWhm, "Stona")?.label !== "(Add.: White): Stona") throw new Error("sch/whm picker tags");
  if (tagged(blmSch, "Stone IV")?.label != null) throw new Error("blm/sch stone iv picker");
  if (!schSpells.includes("Sleep") || !schSpells.includes("Stone IV") || !schSpells.includes("Silena") || !schSpells.includes("Stona")) {
    throw new Error("addendum spells stay on the picker");
  }
  if (addendumHold("Sleep", [], "SCH", null) !== "Addendum: Black needs Dark Arts.") throw new Error("sleep bar seal");
  if (addendumHold("Sleep", [{ name: "Dark Arts" }], "SCH", null) !== "Addendum: Black is not up.") throw new Error("sleep bar needs the addendum");
  if (addendumHold("Sleep", [{ name: "Dark Arts" }, { name: "Addendum: Black" }], "SCH", null) !== null) throw new Error("sleep bar open");
  if (addendumHold("Sleep", [{ name: "Tabula Rasa" }], "SCH", null) !== null) throw new Error("tabula opens the bar");
  if (addendumHold("Sleep", [], "SCH", "BLM") !== null) throw new Error("sch/blm sleep stays usable");
  if (addendumHold("Stona", [], "SCH", "WHM") !== "Addendum: White needs Light Arts.") throw new Error("stona bar seal");
  if (addendumHold("Stona", [{ name: "Light Arts" }, { name: "Addendum: White" }], "SCH", "WHM") !== null) throw new Error("stona bar open");
  if (addendumHold("Silena", [], "SCH", "WHM") !== null) throw new Error("silena bar open");
  if (addendumHold("Stone IV", [], "BLM", "SCH") !== null) throw new Error("blm stone iv open");
  if (addendumHold("Cure", [], "SCH", null) !== null) throw new Error("cure is not sealed");
  const schWs = schBar.find((group) => group.title === "Weapon skills")?.actions.map((action) => action.name) ?? [];
  if (!schWs.includes("Black Halo") || !schWs.includes("Shining Strike")) throw new Error(`SCH clubs ${schWs.join(",")}`);
  if (schWs.includes("Omniscience") || schWs.includes("Myrkr") || schWs.includes("Randgrith") || schWs.includes("Realmrazer") || schWs.includes("Oshala") || schWs.includes("Seraph Strike") || schWs.includes("Judgment")) {
    throw new Error(`SCH club listed ${schWs.join(",")}`);
  }
  const warSch = hotbarGroups("Sword", 250, "Bronze Sword", "WAR", "SCH").find((group) => group.title === "Abilities")?.actions.map((action) => action.name) ?? [];
  const schSub = schNames.filter((name) => {
    const row = SCH_ABILITIES.find((ability) => ability.name === name);
    return row != null && row.level <= 37 && row.access === "sub";
  });
  if (warSch.filter((name) => schNames.includes(name)).join(",") !== schSub.join(",")) {
    throw new Error(`SCH subjob abilities ${warSch.filter((name) => schNames.includes(name)).join(",")}`);
  }
  const runNames = RUN_ABILITIES.filter((ability) => ability.level <= LEVEL && !ability.merit).map((ability) => ability.name);
  const runMarks = runNames.map((name) => markOf(name));
  if (new Set(runMarks).size !== runMarks.length) throw new Error(`RUN mark duplicate ${runMarks.join(",")}`);
  const runTaken = new Set(ALL.filter((action) => !runNames.includes(action.name)).map((action) => markOf(action.name)));
  const runHits = runMarks.filter((mark) => runTaken.has(mark));
  if (runHits.length) throw new Error(`RUN mark ${runHits.join(",")} collides`);
  const runBar = hotbarGroups("Great Sword", 276, "Rusty Greatsword", "RUN");
  if (runBar.find((group) => group.title === "Abilities")?.actions.map((action) => action.name).join(",") !== runNames.join(",")) {
    throw new Error("RUN abilities");
  }
  const runSpells = runBar.find((group) => group.title === "Spells")?.actions.map((action) => action.name) ?? [];
  if (!runSpells.includes("Barstone") || !runSpells.includes("Shell") || !runSpells.includes("Foil") || !runSpells.includes("Phalanx") || runSpells.includes("Protect IV") || runSpells.includes("Cure")) {
    throw new Error(`RUN spells ${runSpells.join(",")}`);
  }
  const runWs = runBar.find((group) => group.title === "Weapon skills")?.actions.map((action) => action.name) ?? [];
  const runGs = ["Hard Slash", "Power Slash", "Frostbite", "Freezebite", "Shockwave", "Crescent Moon", "Sickle Moon", "Spinning Slash", "Ground Strike"];
  if (runWs.join("|") !== runGs.join("|")) throw new Error(`RUN great sword ${runWs.join(",")}`);
  const runSword = hotbarGroups("Sword", 269, "Onion Sword", "RUN").find((group) => group.title === "Weapon skills")?.actions.map((action) => action.name) ?? [];
  const runSwordExpected = ["Fast Blade", "Burning Blade", "Red Lotus Blade", "Flat Blade", "Shining Blade", "Seraph Blade", "Circle Blade", "Spirits Within", "Vorpal Blade", "Swift Blade", "Savage Blade"];
  if (runSword.join("|") !== runSwordExpected.join("|")) throw new Error(`RUN sword ${runSword.join(",")}`);
  const runAxe = hotbarGroups("Great Axe", 250, "Butterfly Axe", "RUN").find((group) => group.title === "Weapon skills")?.actions.map((action) => action.name) ?? [];
  const runAxeExpected = ["Shield Break", "Iron Tempest", "Sturmwind", "Armor Break", "Keen Edge", "Weapon Break", "Steel Cyclone"];
  if (runAxe.join("|") !== runAxeExpected.join("|")) throw new Error(`RUN great axe ${runAxe.join(",")}`);
  const runHatchet = hotbarGroups("Axe", 240, "Bronze Axe", "RUN").find((group) => group.title === "Weapon skills")?.actions.map((action) => action.name) ?? [];
  const runHatchetExpected = ["Raging Axe", "Smash Axe", "Gale Axe", "Avalanche Axe", "Spinning Axe", "Rampage", "Decimation"];
  if (runHatchet.join("|") !== runHatchetExpected.join("|")) throw new Error(`RUN axe ${runHatchet.join(",")}`);
  const runClub = hotbarGroups("Club", 220, "Ash Club", "RUN").find((group) => group.title === "Weapon skills")?.actions.map((action) => action.name) ?? [];
  const runClubExpected = ["Shining Strike", "Brainshaker", "Starlight", "Skullbreaker", "True Strike"];
  if (runClub.join("|") !== runClubExpected.join("|")) throw new Error(`RUN club ${runClub.join(",")}`);
  const warRun = hotbarGroups("Sword", 250, "Bronze Sword", "WAR", "RUN").find((group) => group.title === "Abilities")?.actions.map((action) => action.name) ?? [];
  const runSub = runNames.filter((name) => {
    const row = RUN_ABILITIES.find((ability) => ability.name === name);
    return row != null && row.level <= 37 && row.access === "sub";
  });
  if (warRun.filter((name) => runNames.includes(name)).join(",") !== runSub.join(",")) {
    throw new Error(`RUN subjob abilities ${warRun.filter((name) => runNames.includes(name)).join(",")}`);
  }
  if (runSub.includes("Pflug") || runSub.includes("Embolden") || !runSub.includes("Swipe") || !runSub.includes("Lunge")) throw new Error("RUN sub set");
  const helixNames = ["Geohelix", "Hydrohelix", "Anemohelix", "Pyrohelix", "Cryohelix", "Ionohelix", "Noctohelix", "Luminohelix"];
  const helixMarks = helixNames.map((name) => markOf(name));
  if (new Set(helixMarks).size !== helixMarks.length) throw new Error(`helix mark duplicate ${helixMarks.join(",")}`);
  const helixTaken = new Set(ALL.filter((action) => !helixNames.includes(action.name)).map((action) => markOf(action.name)));
  const helixHits = helixNames.filter((name) => helixTaken.has(markOf(name)));
  if (helixHits.length) throw new Error(`helix mark ${helixHits.join(",")} collides`);
  const geoNames = GEO_ABILITIES.filter((ability) => ability.level <= LEVEL && !ability.merit).map((ability) => ability.name);
  const geoBar = hotbarGroups("Club", 256, "Ash Club", "GEO");
  const geoAbilities = geoBar.find((group) => group.title === "Abilities")?.actions.map((action) => action.name) ?? [];
  if (geoAbilities.join(",") !== geoNames.join(",")) throw new Error(`GEO abilities ${geoAbilities.join(",")}`);
  const geoSpells = geoBar.find((group) => group.title === "Spells")?.actions.map((action) => action.name) ?? [];
  if (!geoSpells.includes("Indi-Poison") || !geoSpells.includes("Geo-Vex") || !geoSpells.includes("Stonera") || !geoSpells.includes("Watera II") || !geoSpells.includes("Thunder III") || geoSpells.includes("Stone IV") || geoSpells.includes("Stonega")) {
    throw new Error("GEO spell list");
  }
  const geoClub = geoBar.find((group) => group.title === "Weapon skills")?.actions.map((action) => action.name) ?? [];
  if (!geoClub.includes("Seraph Strike") || !geoClub.includes("Moonlight") || !geoClub.includes("Judgment") || !geoClub.includes("Hexa Strike") || !geoClub.includes("Black Halo") || geoClub.includes("Flash Nova")) {
    throw new Error(`GEO club ${geoClub.join(",")}`);
  }
  const warGeo = hotbarGroups("Sword", 250, "Bronze Sword", "WAR", "GEO");
  const warGeoAbilities = warGeo.find((group) => group.title === "Abilities")?.actions.map((action) => action.name) ?? [];
  const geoSub = ["Full Circle", "Lasting Emanation", "Ecliptic Attrition"];
  if (geoSub.some((name) => !warGeoAbilities.includes(name)) || warGeoAbilities.includes("Bolster") || warGeoAbilities.includes("Collimated Fervor") || warGeoAbilities.includes("Entrust") || warGeoAbilities.includes("Blaze of Glory")) {
    throw new Error(`GEO sub abilities ${warGeoAbilities.filter((name) => geoNames.includes(name)).join(",")}`);
  }
  const warGeoSpells = warGeo.find((group) => group.title === "Spells")?.actions.map((action) => action.name) ?? [];
  if (warGeoSpells.some((name) => name.startsWith("Geo-")) || !warGeoSpells.includes("Indi-Fury") || !warGeoSpells.includes("Indi-INT") || warGeoSpells.includes("Indi-AGI") || !warGeoSpells.includes("Stonera") || !warGeoSpells.includes("Aera") || warGeoSpells.includes("Fira") || warGeoSpells.includes("Water II")) {
    throw new Error("GEO subjob spells");
  }
  const geoOwn = [...geoNames, ...geoSpells.filter((name) => name.startsWith("Indi-") || name.startsWith("Geo-") || /^(Stonera|Watera|Aera|Fira|Blizzara|Thundara)( II)?$/.test(name))];
  const geoMarks = geoOwn.map((name) => markOf(name));
  if (new Set(geoMarks).size !== geoMarks.length) throw new Error(`GEO mark duplicate ${geoMarks.join(",")}`);
  const geoTaken = new Set(ALL.filter((action) => !geoOwn.includes(action.name)).map((action) => markOf(action.name)));
  const geoHits = geoOwn.filter((name) => geoTaken.has(markOf(name)));
  if (geoHits.length) throw new Error(`GEO mark ${geoHits.map((name) => `${name}=${markOf(name)}`).join(",")} collides`);
  if (findAction("spell:indi-regen")?.name !== "Indi-Regen" || findAction("ability:bolster")?.name !== "Bolster") throw new Error("GEO slot");
  if (findAction("spell:geohelix")?.name !== "Geohelix" || findAction("spell:geohelix")?.recast !== 45 || findAction("spell:luminohelix")?.name !== "Luminohelix") {
    throw new Error("helix slot");
  }
}
