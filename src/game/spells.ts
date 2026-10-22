/**
 * Spell unlocks. No merits and no job points.
 *
 * Every spell except Blue Magic is learned by itself when a job that can
 * cast it reaches the required level. There is no scroll, quest, or
 * spell-up for those. Blue Magic stays locked until it is set, even at
 * the level that would let it be cast.
 *
 * Ninjutsu still names the tool a cast would spend, and the main-job
 * substitute used only when that tool is missing. Nothing is spent while
 * NINJUTSU_CONSUMES_TOOLS is false.
 *
 * Elemental magic is learned the same way, at each job's own level.
 * Stone, Water, Aero, Fire, Blizzard, and Thunder, through tier IV, are the single-target nukes.
 * Stonega, Stonega II, and Stonega III are the earth area nukes. There is no Stonega I.
 * Blizzaga, Blizzaga II, and Blizzaga III are the ice area nukes. There is no Blizzaga I.
 * Aeroga, Aeroga II, and Aeroga III are the wind area nukes. There is no Aeroga I.
 * Firaga, Firaga II, and Firaga III are the fire area nukes. There is no Firaga I.
 * Waterga, Waterga II, and Waterga III are the water area nukes. There is no Waterga I.
 * Thundaga, Thundaga II, and Thundaga III are the lightning area nukes. There is no Thundaga I.
 * Freeze, Tornado, Quake, Burst, Flood, and Flare are ancient magic. There is no merit tier here.
 * Blaze Spikes, Ice Spikes, and Shock Spikes are enhancing magic on yourself. They are not nukes.
 * Burn, Choke, Drown, Frost, Rasp, and Shock are elemental debuffs. Black Mage alone learns them.
 * Blind, Bind, Sleep, Sleep II, Sleepga, and Sleepga II are enfeebling black magic.
 * Poison, Poison II, and Poisonga are enfeebling black magic too. Poisonga II is not a player spell.
 * Distract and Frazzle are enfeebling black magic too. Distract II and Frazzle II are past 75.
 * Paralyze, Slow, Silence, Dia, Dia II, Dia III, and Diaga are enfeebling white magic. The cast is the white-magic chant.
 * Scholar and Geomancer are not jobs here.
 * Bard songs are learned the same way. The client rows cost 0 MP.
 * A party song can land with no target. An enemy song needs the enemy.
 * Nightingale and Troubadour are merits and are not spells.
 * Drain and Aspir are dark magic. Scholar and Geomancer are not jobs here.
 * Bio, Bio II, and Bio III are dark magic too. They share a tier ladder with Dia.
 * Bio III is Red Mage 75. Bio IV and Bio V are not here.
 * Stun is dark magic, lightning element. Black Mage 45 and Dark Knight 37. Red Mage does not learn it.
 * Warp and Warp II are enhancing black magic. Black Mage alone learns them.
 * Cure, Cure II, Cure III, Cure IV, and Cure V are healing magic. There is no Cure I.
 * Scholar learns the first four, and is not a job here.
 * Curaga, Curaga II, Curaga III, and Curaga IV are the area heals. There is no Curaga I.
 * Curaga V is level 91. Cura is White Mage 40. There is no Cura I. Cura II and Cura III are not in this kit.
 * White Mage alone learns Curaga and Cura.
 * Raise, Raise II, and Raise III revive a KO'd player. There is no Raise I.
 * Reraise, Reraise II, and Reraise III leave that same raise on you until you are KO'd.
 * Experience those spells would return is not used. Scholar is not a job here.
 * Red Mage learns Raise II at 95, which fails the level check.
 * Banish, Banish II, and Banish III are divine light nukes. There is no Banish I.
 * Banishga and Banishga II are the area nukes. There is no Banishga I. Banishga III is not in this kit.
 * Holy is a single-target divine nuke. Holy II is level 95 and is not in this kit.
 * Flash blinds. Repose is light sleep. Rune Fencer learns Flash at 45. Repose stays White Mage.
 * Stoneskin is enhancing magic on yourself. It does not overwrite a Stoneskin already up.
 * Scholar learns it at 44. Rune Fencer learns it at 55.
 * Protect, Protect II, Protect III, and Protect IV raise defense. There is no Protect I.
 * Protect V is level 76 and is not here. Protectra through Protectra V are the 10' party wards.
 * Shell, Shell II, Shell III, and Shell IV cut magic damage. There is no Shell I.
 * Shell V is level 76 and is not here. Shellra through Shellra V are the 10' party wards.
 * Protect and Shell stay up together. A weaker tier of the same ward does not land.
 * Shell and Shellra use table level 18 for the duration check. The catalog level is the earliest job, which is Rune Fencer 10.
 * Scholar and Rune Fencer learn the single-target line. Only White Mage learns the area line.
 * Regen, Regen II, and Regen III restore HP every 3 seconds. There is no Regen I.
 * Regen IV and Regen V are not here. Haste is 150/1024. Haste II and Hastega are not here.
 * Refresh restores 3 MP every 3 seconds. Red Mage 41. Refresh II and Refresh III are not here.
 * Auspice is Subtle Blow +10. Scholar and Rune Fencer are not jobs here.
 * Aquaveil spends one charge to stop a physical hit from breaking the cast. Blink grants two shadows.
 * Phalanx removes a flat amount of damage per hit. Reprisal raises shield skill and block rate.
 * A weaker Regen does not land. Haste, Refresh, Auspice, Aquaveil, and Blink each refresh themselves.
 * A weaker Phalanx does not land. Reprisal does not land over spikes.
 * Erase removes one detrimental effect that has no -na spell. Scholar is not a job here.
 * Barstonra through Barthundra, and the status bars through Barpetra, are White Mage area bars.
 * Baramnesra is level 78 and is not here. Red Mage's self-only bars are not here.
 * Poisona, Paralyna, Blindna, Silena, Stona, Viruna, and Cursna remove one status from a party member.
 * Esuna removes one of those from you, then from party members within 10' who have the same one.
 * Sacrifice moves one of those from another party member onto you. This yard has no other member.
 * Scholar is not a job here. Addendum: White is the condition on the Scholar levels.
 * Jobs that learn them later than Black Mage keep that later level.
 * A level past 75 is stored and simply fails the level check here.
 */

import type { JobId } from "./stats";
import { ALEXANDER_CAST, ALEXANDER_RECAST, ATOMOS_CAST, ATOMOS_RANGE, ATOMOS_RECAST, SUMMONS, SUMMON_CAST, SUMMON_RECAST, summonById } from "./smn";
import { KLIMAFORM_CAST, KLIMAFORM_MP, KLIMAFORM_RECAST, STORM_CAST, STORM_MP, STORM_RANGE, STORM_RECAST, STORMS } from "./weather";
import { SONGS } from "./brd";
import { BLUE_SPELLS } from "./blu";
import { auspiceBlockedByEnspell, enspellOverwrites, BLIND_II_MACC, DISPEL_MACC, DISTRACT_MACC, FRAZZLE_MACC, BIO_MACC, STUN_MACC, type ElementalSpell, type ElementDebuff, type SpikeSpell, type EnfeebleSpell, type SiphonSpell, type CureSpell, type CuragaSpell, type RaiseSpell, type ReraiseSpell, type BanishSpell, type BarrierKind, type BarrierTier, type RegenTier, type BarElement, type BarStatus, type BarSpellName } from "./magic";
import { geoElement, type GeoEffect } from "./geo";

export type SpellSchool =
  | "healing"
  | "divine"
  | "enhancing"
  | "enfeebling"
  | "elemental"
  | "dark"
  | "summoning"
  | "singing"
  | "ninjutsu"
  | "blue"
  | "geomancy";

/** One of the specific tool. The substitute is a Ninja main only. */
export type NinjaTool = {
  name: string;
  count: number;
  substitute: string;
};

export type Spell = {
  name: string;
  school: SpellSchool;
  /** Level the learning job must have reached. */
  level: number;
  jobs: readonly JobId[];
  /**
   * Seconds before the spell can be cast again.
   * A spell is not offered on the hotbar until this is set.
   * The count starts when the cast starts, and it is deleted if the cast breaks.
   */
  recast?: number;
  /** Base cast time in seconds, before Elemental Celerity. 0 is instant and shows no bar. */
  cast?: number;
  /** MP taken when the cast starts. Returned in full if the cast breaks. */
  mp?: number;
  /** Summoning magic. Calls this avatar or spirit. */
  summon?: string;
  /** Spell range in yalms. */
  range?: number;
  /** Flat magic accuracy printed on the spell. Added to skill and dSTAT when a resist is rolled. */
  macc?: number;
  /** Published nuke table, when the spell deals that damage. */
  nuke?: ElementalSpell;
  /** Enhancing spikes. The buff lands on you. */
  spike?: SpikeSpell;
  /** Elemental debuff. No opening hit. Stat down and a 3-second damage tick. */
  debuff?: ElementDebuff;
  /** Enfeebling magic. Dia also has a small light hit. The others do not. */
  enfeeble?: EnfeebleSpell;
  /** Dark magic that steals HP or MP. */
  siphon?: SiphonSpell;
  /** Enhancing black magic that sends you to your home point. */
  warp?: "Warp" | "Warp II";
  /** Single-target Cure. Heals a living target. Damages undead. */
  cure?: CureSpell;
  /** Area Cure on party members. Does not damage undead. There is no Curaga I. */
  curaga?: CuragaSpell;
  /** Self-centered party heal. There is no Cura I. Cura II and Cura III are not in this kit. */
  cura?: boolean;
  /** Area radius in yalms. */
  radius?: number;
  /** Enhancing Stoneskin. The shell lands on you. It does not refresh itself. */
  stoneskin?: boolean;
  /**
   * Protect or Shell. Tier 1 has no roman numeral. Area is Protectra or Shellra.
   * Single-target tier 5 is past 75 and is not on a spell here.
   */
  barrier?: { kind: BarrierKind; tier: BarrierTier; area?: boolean; effectLevel: number };
  /** Regen. The tiers share one status. There is no Regen I. Regen IV and V are not here. */
  regen?: { tier: RegenTier; effectLevel: number };
  /** Haste. One tier. Haste II and Hastega are not here. Power is filled in when it lands. */
  haste?: { effectLevel: number };
  /** Refresh. 3 MP every 3 seconds. Refresh II and Refresh III are not here. */
  refresh?: { effectLevel: number };
  /** Auspice. Subtle Blow on you, and a 10' suggestion for other members who are not here. */
  auspice?: { effectLevel: number };
  /** Aquaveil. Charges come from Enhancing Magic. The table's spell level is 1. */
  aquaveil?: { effectLevel: number };
  /** Blink. Two shadows. Overwrites itself. */
  blink?: { effectLevel: number };
  /** Foil. Evasion against special attacks, starting at 150, decaying 3 a tick. Rune Fencer 58. */
  foil?: { effectLevel: number };
  /** Phalanx. Flat damage reduction from Enhancing Magic. Phalanx II is not here. */
  phalanx?: { effectLevel: number };
  /** Reprisal. Shield skill and block rate. Spikes overwrite it. It does not overwrite them. */
  reprisal?: { effectLevel: number };
  /**
   * Red Mage enspell. One additional effect on the main hand.
   * Tier I cannot replace tier II. Tier II replaces either.
   */
  enspell?: { tier: 1 | 2; element: "fire" | "ice" | "wind" | "earth" | "thunder" | "water" };
  /** Erase. One detrimental effect that has no -na spell. A party member, not an enemy. */
  erase?: boolean;
  /**
   * Spell group 6. Enfeebling white magic still uses the white-magic chant.
   * Black enfeebles leave this unset and use the hands-at-the-face loop.
   */
  castGroup?: "white";
  /**
   * White Mage bar spell. Area, centered on you. One element bar and one status
   * bar can be up together. A new one of the same kind always replaces the old.
   */
  bar?: { kind: "element" | "status"; element: SpellElement; resists: BarElement | BarStatus; effectLevel: number };
  /** Status recovery on a party member. Not an enemy. */
  na?: "Poisona" | "Paralyna" | "Blindna" | "Silena" | "Stona" | "Viruna" | "Cursna";
  /** Esuna. You are the center. Party members inside the radius lose the same status. */
  esuna?: boolean;
  /** Sacrifice. Another party member loses one status and you gain it. */
  sacrifice?: boolean;
  /** Revive a KO'd player. There is no Raise I. A living target is refused. */
  raise?: RaiseSpell;
  /** Self buff. On KO it offers the matching Raise. It does not raise you now. */
  reraise?: ReraiseSpell;
  /** Divine light nuke. Undead take more damage and lose special defense. There is no Banish I. */
  banish?: BanishSpell;
  /** Divine light nuke. No undead bonus. Holy II is not in this kit. */
  holy?: boolean;
  /** Divine blind. Accuracy down, no damage. */
  flash?: boolean;
  /** Divine light sleep. Not the dark Sleep line. */
  repose?: boolean;
  /** Self. No enemy target and no range check. */
  self?: boolean;
  /**
   * Per-job level when the jobs do not share `level`.
   * A job omitted here uses `level`.
   */
  jobLevel?: Partial<Record<JobId, number>>;
  /**
   * Scholar learns this only under the matching Addendum, unless another
   * equipped job already knows it. Tabula Rasa opens both addenda.
   */
  addendum?: "white" | "black";
  /** Scholar helix. Tier-1 cards are 26 MP, 5s cast, 45s recast, 21'. Helix I supplies the damage. */
  helix?: boolean;
  /** Indicolure or Geocolure. Geo is main job only. The luopan is the pet. */
  colure?: { side: "indi" | "geo"; effect: GeoEffect };
  /** Scholar storm. Personal single weather on you. Storm II is not in this kit. */
  storm?: { element: "fire" | "ice" | "wind" | "earth" | "thunder" | "water" | "light" | "dark"; sky: string };
  /** Klimaform. Flat magic accuracy when the spell matches the weather. */
  klimaform?: boolean;
  /** Set on ninjutsu. Other schools cast from MP and have none. */
  tool?: NinjaTool;
  /**
   * Ninjutsu effect. The tool stays on `tool` and is not spent while
   * NINJUTSU_CONSUMES_TOOLS is false. Tonko is Invisible. Monomi is Sneak.
   */
  nin?: {
    kind: "nuke" | "huton" | "shadow" | "invisible" | "sneak" | "blind" | "slow" | "poison" | "paralyze";
    tier: 1 | 2 | 3;
    element?: "fire" | "ice" | "wind" | "earth" | "lightning" | "water";
    weaken?: "fire" | "ice" | "wind" | "earth" | "lightning" | "water";
    area?: boolean;
  };
  /**
   * Bard song. Party songs are centered on you. Enemy songs need a target.
   * Potency is resolved in brd.ts from combined skill.
   */
  song?: { family: string; hostile: boolean };
  /** Physical blue magic, a blue cure, area Flash, Shock Spikes, gaze Silence, a light dispel gaze, Blink shadows, light sleep, a party heal, Defense Boost, Haste, Magic Attack Bonus, a lightning hit, an earth area, a wind area, a poison shell, a self cure, a target-centered orb, a cone breath, a fire screech, a dark ray, an HP drain, an MP drain, a lightning stun, a wind cloud, a dark wall, a water gaze, a blood drain, a terror gaze, or an ice area. Locked until the spell is set. Only a Blue Mage main can cast it. */
  blue?: { physical: true } | { cure: true } | { flash: true } | { spikes: true } | { silence: true } | { mantle: true } | { song: true } | { breeze: true } | { cocoon: true } | { metal: true } | { refuel: true } | { memento: true } | { magical: true } | { sand: true } | { pollen: true } | { orb: true } | { breath: true } | { sound: true } | { ray: true } | { digest: true } | { kiss: true } | { blitz: true } | { gas: true } | { gaze: true } | { mystery: true } | { venom: true } | { geist: true } | { awful: true } | { saber: true } | { jetta: true } | { ice: true } | { destruct: true } | { roar: true } | { cold: true } | { hold: true } | { feather: true } | { penance: true } | { mael: true } | { eyes: true } | { needles: true } | { tickle: true } | { yawn: true } | { trunk: true } | { infra: true } | { spray: true } | { ooze: true } | { hide: true } | { enerv: true } | { warmup: true } | { spit: true } | { gorge: true } | { amp: true } | { lowing: true } | { triumph: true } | { saline: true } | { shift: true } | { hammer: true } | { reactor: true } | { exuv: true };
};

/** Flip this when ninjutsu should start spending tools. */
export const NINJUTSU_CONSUMES_TOOLS = false;

const NIN: readonly JobId[] = ["NIN"];

function jutsu(
  name: string,
  level: number,
  tool: string,
  substitute: string,
  cast: number,
  recast: number,
  nin: NonNullable<Spell["nin"]>,
  range?: number,
): Spell {
  return {
    name,
    school: "ninjutsu",
    level,
    jobs: NIN,
    tool: { name: tool, count: 1, substitute },
    cast,
    recast,
    mp: 0,
    ...(range != null ? { range } : {}),
    nin,
  };
}

const ELEMENTAL: readonly ["Katon" | "Hyoton" | "Huton" | "Doton" | "Raiton" | "Suiton", string, NonNullable<Spell["nin"]>["element"], NonNullable<Spell["nin"]>["weaken"]][] = [
  ["Katon", "Uchitake", "fire", "water"],
  ["Hyoton", "Tsurara", "ice", "fire"],
  ["Huton", "Kawahori-Ogi", "wind", "ice"],
  ["Doton", "Makibishi", "earth", "wind"],
  ["Raiton", "Hiraishin", "lightning", "earth"],
  ["Suiton", "Mizu-Deppo", "water", "lightning"],
];

const ELEMENTAL_TIER: readonly [string, number, number, number, 1 | 2 | 3][] = [
  ["Ichi", 15, 4, 30, 1],
  ["Ni", 40, 1.5, 45, 2],
  ["San", 75, 2.5, 60, 3],
];

/**
 * Ninjutsu through level 75. San is the level-75 spell, not a merit.
 * Utsusemi: San and the later buffs sit past 75 and are not in this kit.
 * Inoshishinofuda, Chonofuda, and Shikanofuda are the main-job substitutes.
 * Casting still names the tool. Nothing is spent while the switch is off.
 * Tonko lessens detection by sight (Invisible). Monomi lessens detection by sound (Sneak).
 */
export const SPELLS: readonly Spell[] = [
  jutsu("Tonko: Ichi", 9, "Shinobi-Tabi", "Shikanofuda", 1.5, 30, { kind: "invisible", tier: 1 }),
  jutsu("Utsusemi: Ichi", 12, "Shihei", "Shikanofuda", 4, 30, { kind: "shadow", tier: 1 }),
  jutsu("Monomi: Ichi", 25, "Sanjaku-Tenugui", "Shikanofuda", 1.5, 30, { kind: "sneak", tier: 1 }),
  jutsu("Tonko: Ni", 34, "Shinobi-Tabi", "Shikanofuda", 1.5, 45, { kind: "invisible", tier: 2 }),
  jutsu("Utsusemi: Ni", 37, "Shihei", "Shikanofuda", 1.5, 45, { kind: "shadow", tier: 2 }),
  jutsu("Kurayami: Ichi", 19, "Sairui-Ran", "Chonofuda", 4, 30, { kind: "blind", tier: 1 }, 17),
  jutsu("Hojo: Ichi", 23, "Kaginawa", "Chonofuda", 4, 30, { kind: "slow", tier: 1 }, 17),
  jutsu("Dokumori: Ichi", 27, "Kodoku", "Chonofuda", 4, 30, { kind: "poison", tier: 1 }, 17),
  jutsu("Jubaku: Ichi", 30, "Jusatsu", "Chonofuda", 4, 30, { kind: "paralyze", tier: 1 }, 17),
  jutsu("Kurayami: Ni", 44, "Sairui-Ran", "Chonofuda", 1.5, 45, { kind: "blind", tier: 2 }, 17),
  jutsu("Hojo: Ni", 48, "Kaginawa", "Chonofuda", 1.5, 45, { kind: "slow", tier: 2 }, 17),
  ...ELEMENTAL.flatMap(([element, tool, dealt, weaken]) =>
    ELEMENTAL_TIER.map(([tier, level, cast, recast, rank]) =>
      jutsu(
        `${element}: ${tier}`,
        level,
        tool,
        "Inoshishinofuda",
        cast,
        recast,
        element === "Huton"
          ? { kind: "huton", tier: rank, element: dealt, weaken }
          : { kind: "nuke", tier: rank, element: dealt, weaken },
        17,
      ),
    ),
  ),
].sort((a, b) => a.level - b.level || a.name.localeCompare(b.name));

function nukeSpell(
  name:
    | "Stone"
    | "Stone II"
    | "Stone III"
    | "Stone IV"
    | "Water"
    | "Water II"
    | "Water III"
    | "Water IV"
    | "Aero"
    | "Aero II"
    | "Aero III"
    | "Aero IV"
    | "Fire"
    | "Fire II"
    | "Fire III"
    | "Fire IV"
    | "Blizzard"
    | "Blizzard II"
    | "Blizzard III"
    | "Blizzard IV"
    | "Thunder"
    | "Thunder II"
    | "Thunder III"
    | "Thunder IV"
    | "Stonega"
    | "Stonega II"
    | "Stonega III"
    | "Blizzaga"
    | "Blizzaga II"
    | "Blizzaga III"
    | "Aeroga"
    | "Aeroga II"
    | "Aeroga III"
    | "Firaga"
    | "Firaga II"
    | "Firaga III"
    | "Waterga"
    | "Waterga II"
    | "Waterga III"
    | "Thundaga"
    | "Thundaga II"
    | "Thundaga III"
    | "Freeze"
    | "Tornado"
    | "Quake"
    | "Burst"
    | "Flood"
    | "Flare"
    | "Stonera"
    | "Stonera II"
    | "Watera"
    | "Watera II"
    | "Aera"
    | "Fira"
    | "Blizzara"
    | "Thundara",
  mp: number,
  cast: number,
  recast: number,
  macc: number,
  jobLevel: Partial<Record<JobId, number>>,
  addendum?: "black",
): Spell {
  const jobs = (Object.keys(jobLevel) as JobId[]).filter((job) => jobLevel[job] != null);
  return {
    name,
    school: "elemental",
    level: Math.min(...jobs.map((job) => jobLevel[job] ?? 99)),
    jobs,
    jobLevel,
    recast,
    cast,
    mp,
    range: 21,
    macc,
    nuke: name,
    ...(addendum ? { addendum } : {}),
  };
}

/**
 * Current-retail single-target nukes. MP, cast, and recast are the
 * post-2013 numbers. Geomancer learns the single-target line beside these jobs.
 * Dark Knight learns Stone III at 76, Water III at 80, Aero III at 84, Fire III at 88, Blizzard III at 92, and Thunder III at 96.
 * Red Mage learns Stone IV at 77, Water IV at 80, Aero IV at 83, Fire IV at 86, Blizzard IV at 89, and Thunder IV at 92.
 * Cast time, recast, and the 21' range are shared by a single-target tier.
 * Stonega does not share that clock. Black Mage learns it at 15, Stonega II at 40, and Stonega III at 63.
 * Blizzaga uses the same area clock. Black Mage learns it at 32, Blizzaga II at 57, and Blizzaga III at 71.
 * Aeroga uses that clock too. Black Mage learns it at 23, Aeroga II at 48, and Aeroga III at 67.
 * Firaga uses that clock too. Black Mage learns it at 28, Firaga II at 53, and Firaga III at 69.
 * Waterga uses that clock too. Black Mage learns it at 19, Waterga II at 44, and Waterga III at 65.
 * Thundaga uses that clock too. Black Mage learns it at 36, Thundaga II at 61, and Thundaga III at 73.
 * Ancient magic does not use either clock. Cast is 8.5s and recast is 60s. Black Mage alone learns Freeze at 50, Tornado at 52, Quake at 54, Burst at 56, Flood at 58, and Flare at 60.
 * Blaze Spikes, Ice Spikes, and Shock Spikes are their own clock: cast 3s, recast 10s, on yourself. Black Mage learns them at 10, 20, and 30. Red Mage learns them at 20, 40, and 60. Dark Knight does not.
 * Shock, Rasp, Choke, Frost, Burn, and Drown are elemental debuffs. Cast is 2.5s, recast is 10s, range is 20'. Black Mage learns them at 16, 18, 20, 22, 24, and 27. Red Mage and Dark Knight do not.
 * Red Mage and Dark Knight do not learn Stonega, Blizzaga, Aeroga, Firaga, Waterga, Thundaga, or ancient magic. The area spells cover 10'. Ancient magic is one target. This yard still has one enemy.
 * The element changes MP, the level, the spell's magic accuracy, and D.
 */
export const STONE_SPELLS: readonly Spell[] = [
  nukeSpell("Stone", 4, 0.5, 2, 0, { BLM: 1, RDM: 4, DRK: 5, SCH: 4, GEO: 4 }),
  nukeSpell("Stone II", 16, 1.5, 6, 10, { BLM: 26, RDM: 35, DRK: 42, SCH: 30, GEO: 34 }),
  nukeSpell("Stone III", 40, 3, 15, 20, { BLM: 51, RDM: 65, DRK: 76, SCH: 54, GEO: 58 }),
  nukeSpell("Stone IV", 88, 5, 30, 20, { BLM: 68, RDM: 77, SCH: 70 }, "black"),
];

export const WATER_SPELLS: readonly Spell[] = [
  nukeSpell("Water", 5, 0.5, 2, 0, { BLM: 5, RDM: 9, DRK: 11, SCH: 8, GEO: 9 }),
  nukeSpell("Water II", 19, 1.5, 6, 10, { BLM: 30, RDM: 40, DRK: 48, SCH: 34, GEO: 38 }),
  nukeSpell("Water III", 46, 3, 15, 20, { BLM: 55, RDM: 67, DRK: 80, SCH: 57, GEO: 61 }),
  nukeSpell("Water IV", 99, 5, 30, 20, { BLM: 70, RDM: 80, SCH: 71 }, "black"),
];

export const AERO_SPELLS: readonly Spell[] = [
  nukeSpell("Aero", 6, 0.5, 2, 0, { BLM: 9, RDM: 14, DRK: 17, SCH: 12, GEO: 14 }),
  nukeSpell("Aero II", 22, 1.5, 6, 10, { BLM: 34, RDM: 45, DRK: 54, SCH: 38, GEO: 42 }),
  nukeSpell("Aero III", 54, 3, 15, 20, { BLM: 59, RDM: 69, DRK: 84, SCH: 60, GEO: 64 }),
  nukeSpell("Aero IV", 115, 5, 30, 20, { BLM: 72, RDM: 83, SCH: 72 }, "black"),
];

export const FIRE_SPELLS: readonly Spell[] = [
  nukeSpell("Fire", 7, 0.5, 2, 0, { BLM: 13, RDM: 19, DRK: 23, SCH: 16, GEO: 19 }),
  nukeSpell("Fire II", 26, 1.5, 6, 10, { BLM: 38, RDM: 50, DRK: 60, SCH: 42, GEO: 46 }),
  nukeSpell("Fire III", 63, 3, 15, 20, { BLM: 62, RDM: 71, DRK: 88, SCH: 63, GEO: 67 }),
  nukeSpell("Fire IV", 135, 5, 30, 20, { BLM: 73, RDM: 86, SCH: 73 }, "black"),
];

export const BLIZZARD_SPELLS: readonly Spell[] = [
  nukeSpell("Blizzard", 8, 0.5, 2, 0, { BLM: 17, RDM: 24, DRK: 29, SCH: 20, GEO: 24 }),
  nukeSpell("Blizzard II", 31, 1.5, 6, 10, { BLM: 42, RDM: 55, DRK: 66, SCH: 46, GEO: 50 }),
  nukeSpell("Blizzard III", 75, 3, 15, 20, { BLM: 64, RDM: 73, DRK: 92, SCH: 66, GEO: 70 }),
  nukeSpell("Blizzard IV", 162, 5, 30, 20, { BLM: 74, RDM: 89, SCH: 74 }, "black"),
];

export const THUNDER_SPELLS: readonly Spell[] = [
  nukeSpell("Thunder", 9, 0.5, 2, 0, { BLM: 21, RDM: 29, DRK: 35, SCH: 24, GEO: 29 }),
  nukeSpell("Thunder II", 37, 1.5, 6, 10, { BLM: 46, RDM: 60, DRK: 72, SCH: 51, GEO: 54 }),
  nukeSpell("Thunder III", 91, 3, 15, 20, { BLM: 66, RDM: 75, DRK: 96, SCH: 69, GEO: 73 }),
  nukeSpell("Thunder IV", 195, 5, 30, 20, { BLM: 75, RDM: 92, SCH: 75 }, "black"),
];

/** Area earth. Own cast and recast. Magic accuracy is not published, so it is 0. */
export const STONEGA_SPELLS: readonly Spell[] = [
  nukeSpell("Stonega", 24, 2, 5, 0, { BLM: 15 }),
  nukeSpell("Stonega II", 93, 4, 10, 0, { BLM: 40 }),
  nukeSpell("Stonega III", 175, 7, 25, 0, { BLM: 63 }),
];

/** Area ice. Same cast and recast as Stonega. Magic accuracy is not published, so it is 0. */
export const BLIZZAGA_SPELLS: readonly Spell[] = [
  nukeSpell("Blizzaga", 80, 2, 5, 0, { BLM: 32 }),
  nukeSpell("Blizzaga II", 175, 4, 10, 0, { BLM: 57 }),
  nukeSpell("Blizzaga III", 297, 7, 25, 0, { BLM: 71 }),
];

/** Area wind. Same cast and recast as the other area nukes. Magic accuracy is not published, so it is 0. */
export const AEROGA_SPELLS: readonly Spell[] = [
  nukeSpell("Aeroga", 45, 2, 5, 0, { BLM: 23 }),
  nukeSpell("Aeroga II", 131, 4, 10, 0, { BLM: 48 }),
  nukeSpell("Aeroga III", 232, 7, 25, 0, { BLM: 67 }),
];

/** Area fire. Same cast and recast as the other area nukes. Magic accuracy is not published, so it is 0. */
export const FIRAGA_SPELLS: readonly Spell[] = [
  nukeSpell("Firaga", 57, 2, 5, 0, { BLM: 28 }),
  nukeSpell("Firaga II", 153, 4, 10, 0, { BLM: 53 }),
  nukeSpell("Firaga III", 263, 7, 25, 0, { BLM: 69 }),
];

/** Area water. Same cast and recast as the other area nukes. Magic accuracy is not published, so it is 0. */
export const WATERGA_SPELLS: readonly Spell[] = [
  nukeSpell("Waterga", 34, 2, 5, 0, { BLM: 19 }),
  nukeSpell("Waterga II", 112, 4, 10, 0, { BLM: 44 }),
  nukeSpell("Waterga III", 202, 7, 25, 0, { BLM: 65 }),
];

/** Area lightning. Same cast and recast as the other area nukes. Magic accuracy is not published, so it is 0. */
export const THUNDAGA_SPELLS: readonly Spell[] = [
  nukeSpell("Thundaga", 105, 2, 5, 0, { BLM: 36 }),
  nukeSpell("Thundaga II", 200, 4, 10, 0, { BLM: 61 }),
  nukeSpell("Thundaga III", 332, 7, 25, 0, { BLM: 73 }),
];

/** Ancient magic. One cast, one recast, one MP cost. Magic accuracy is not published, so it is 0. Merit tier II is not in this kit. */
export const ANCIENT_SPELLS: readonly Spell[] = [
  nukeSpell("Freeze", 315, 8.5, 60, 0, { BLM: 50 }),
  nukeSpell("Tornado", 315, 8.5, 60, 0, { BLM: 52 }),
  nukeSpell("Quake", 315, 8.5, 60, 0, { BLM: 54 }),
  nukeSpell("Burst", 315, 8.5, 60, 0, { BLM: 56 }),
  nukeSpell("Flood", 315, 8.5, 60, 0, { BLM: 58 }),
  nukeSpell("Flare", 315, 8.5, 60, 0, { BLM: 60 }),
];

function spikeSpell(name: SpikeSpell, mp: number, jobLevel: Partial<Record<JobId, number>>): Spell {
  const jobs = (Object.keys(jobLevel) as JobId[]).filter((job) => jobLevel[job] != null);
  return {
    name,
    school: "enhancing",
    level: Math.min(...jobs.map((job) => jobLevel[job] ?? 99)),
    jobs,
    jobLevel,
    recast: 10,
    cast: 3,
    mp,
    self: true,
    spike: name,
  };
}

/** Enhancing spikes. Not a nuke, and not shortened by Elemental Celerity. */
export const SPIKE_SPELLS: readonly Spell[] = [
  spikeSpell("Blaze Spikes", 8, { BLM: 10, RDM: 20, SCH: 30, RUN: 45 }),
  spikeSpell("Ice Spikes", 16, { BLM: 20, RDM: 40, SCH: 50, RUN: 65 }),
  spikeSpell("Shock Spikes", 24, { BLM: 30, RDM: 60, SCH: 70 }),
];

function debuffSpell(name: ElementDebuff, level: number): Spell {
  return {
    name,
    school: "elemental",
    level,
    jobs: ["BLM"],
    jobLevel: { BLM: level },
    recast: 10,
    cast: 2.5,
    mp: 25,
    range: 20,
    macc: 0,
    debuff: name,
  };
}

/** Elemental debuffs. Same cast, recast, MP, and 20' range. Magic accuracy is not published, so it is 0. */
export const DEBUFF_SPELLS: readonly Spell[] = [
  debuffSpell("Shock", 16),
  debuffSpell("Rasp", 18),
  debuffSpell("Choke", 20),
  debuffSpell("Frost", 22),
  debuffSpell("Burn", 24),
  debuffSpell("Drown", 27),
];

function enfeebleSpell(
  name: EnfeebleSpell,
  mp: number,
  cast: number,
  recast: number,
  range: number,
  jobLevel: Partial<Record<JobId, number>>,
  macc = 0,
  radius?: number,
): Spell {
  const jobs = (Object.keys(jobLevel) as JobId[]).filter((job) => jobLevel[job] != null);
  return {
    name,
    school: "enfeebling",
    level: Math.min(...jobs.map((job) => jobLevel[job] ?? 99)),
    jobs,
    jobLevel,
    recast,
    cast,
    mp,
    range,
    macc,
    enfeeble: name,
    ...(radius != null ? { radius } : {}),
    ...((name === "Sleep" || name === "Sleep II" || name === "Dispel") && jobLevel.SCH != null ? { addendum: "black" as const } : {}),
  };
}

/**
 * Enfeebling black magic. Magic accuracy is not rolled.
 * Sleep and Sleepga are tier 1. Sleep II and Sleepga II are tier 2.
 * Sleepga covers 10'. This yard still has one enemy.
 * Blind II is the heavier dark cloud, animation 281. Gravity is animation 216.
 * Dispel is animation 487. A target with no buff takes no effect. The landing still plays.
 * Distract is animation 933 for 2 seconds. Frazzle is animation 935 for 4 seconds.
 * Poison's land is the purple-green cloud. Poisonga lays that cloud in 10'.
 * The client spell_range column is 200, printed here as 21'.
 * Distract II, Frazzle II, and the job-point III spells are not here.
 * Poisonga II is not available to players and is not listed.
 */
export const ENFEEBLE_SPELLS: readonly Spell[] = [
  enfeebleSpell("Blind", 5, 2, 10, 21, { BLM: 4, RDM: 8 }),
  enfeebleSpell("Bind", 8, 2, 40, 20, { BLM: 7, RDM: 11, DRK: 20 }),
  enfeebleSpell("Gravity", 24, 1.5, 60, 20, { RDM: 21 }),
  enfeebleSpell("Sleep", 19, 2.5, 30, 20, { BLM: 20, RDM: 25, DRK: 30, SCH: 30, GEO: 35 }),
  enfeebleSpell("Dispel", 25, 3, 10, 21, { RDM: 32, SCH: 32 }, DISPEL_MACC),
  enfeebleSpell("Distract", 32, 3, 10, 21, { RDM: 35 }, DISTRACT_MACC),
  enfeebleSpell("Sleepga", 38, 3, 30, 20, { BLM: 31 }),
  enfeebleSpell("Sleep II", 29, 3, 30, 20, { BLM: 41, RDM: 46, DRK: 56, SCH: 65, GEO: 70 }),
  enfeebleSpell("Frazzle", 38, 3, 10, 21, { RDM: 42 }, FRAZZLE_MACC),
  enfeebleSpell("Sleepga II", 58, 3.5, 45, 20, { BLM: 56 }),
  enfeebleSpell("Blind II", 31, 3, 20, 21, { RDM: 75 }, BLIND_II_MACC),
  enfeebleSpell("Poison", 5, 1, 5, 20, { BLM: 3, RDM: 5, DRK: 6 }),
  enfeebleSpell("Poisonga", 44, 2, 10, 20, { BLM: 24, DRK: 26 }, 0, 10),
  enfeebleSpell("Poison II", 38, 1, 5, 20, { BLM: 43, RDM: 46, DRK: 46 }, 30),
];

function siphonSpell(
  name: SiphonSpell,
  mp: number,
  range: number,
  jobLevel: Partial<Record<JobId, number>>,
): Spell {
  const jobs = (Object.keys(jobLevel) as JobId[]).filter((job) => jobLevel[job] != null);
  return {
    name,
    school: "dark",
    // Catalog order follows Black Mage. Dark Knight learns both sooner, and jobLevel keeps that.
    level: jobLevel.BLM ?? Math.min(...jobs.map((job) => jobLevel[job] ?? 99)),
    jobs,
    jobLevel,
    recast: 60,
    cast: 3,
    mp,
    range,
    macc: 0,
    siphon: name,
  };
}

/**
 * Drain steals HP. Aspir steals MP. Cast is 3 seconds and recast is 60.
 * Elemental Celerity does not shorten them. Geomancer learns Drain at 15 and Aspir at 30. Aspir II is not here.
 */
export const SIPHON_SPELLS: readonly Spell[] = [
  siphonSpell("Drain", 21, 20, { BLM: 12, DRK: 10, SCH: 21, GEO: 15 }),
  siphonSpell("Aspir", 10, 21, { BLM: 25, DRK: 20, SCH: 36, GEO: 30 }),
];

function darkStatusSpell(
  name: EnfeebleSpell,
  mp: number,
  cast: number,
  recast: number,
  jobLevel: Partial<Record<JobId, number>>,
  macc: number,
  catalogLevel: number,
): Spell {
  const jobs = (Object.keys(jobLevel) as JobId[]).filter((job) => jobLevel[job] != null);
  return {
    name,
    school: "dark",
    level: catalogLevel,
    jobs,
    jobLevel,
    recast,
    cast,
    mp,
    range: 21,
    macc,
    enfeeble: name,
  };
}

/**
 * Bio and Stun. Dark magic, spell group 2, so the cast is the hands-at-the-face loop.
 * Bio is dark. Stun is lightning, and the cast is only 0.5 seconds.
 * The land is animation 252: two thunder circles crossed into an X for 2 seconds.
 * An unfinished spell, ability, weaponskill, or melee round is interrupted. Nothing in progress is not an error.
 * Catalog order for Stun follows Black Mage 45. Dark Knight learns it at 37, and jobLevel keeps that.
 * The client spell_range column is 200, printed here as 21'.
 * Bio IV, Bio V, and a Red Mage Stun are not here.
 */
export const DARK_STATUS_SPELLS: readonly Spell[] = [
  darkStatusSpell("Bio", 15, 1.5, 5, { BLM: 10, RDM: 10, DRK: 15 }, BIO_MACC, 10),
  darkStatusSpell("Bio II", 36, 1.5, 5, { BLM: 35, RDM: 36, DRK: 40 }, BIO_MACC, 35),
  darkStatusSpell("Bio III", 54, 1.5, 15, { RDM: 75 }, BIO_MACC, 75),
  darkStatusSpell("Stun", 25, 0.5, 45, { BLM: 45, DRK: 37 }, STUN_MACC, 45),
];

function warpSpell(name: "Warp" | "Warp II", mp: number, cast: number, level: number, range?: number): Spell {
  return {
    name,
    school: "enhancing",
    level,
    jobs: ["BLM"],
    jobLevel: { BLM: level },
    recast: 10,
    cast,
    mp,
    range,
    self: true,
    warp: name,
  };
}

/**
 * Warp returns you to your home point. Warp II is the same spell on a party
 * member. This yard has no other party member, so it lands on you.
 * Enhancing skill. Elemental Celerity does not shorten either cast.
 */
export const WARP_SPELLS: readonly Spell[] = [
  warpSpell("Warp", 100, 3, 17),
  warpSpell("Warp II", 150, 5, 40, 20),
];

function cureSpell(
  name: CureSpell,
  mp: number,
  cast: number,
  recast: number,
  jobLevel: Partial<Record<JobId, number>>,
): Spell {
  const jobs = (Object.keys(jobLevel) as JobId[]).filter((job) => jobLevel[job] != null);
  return {
    name,
    school: "healing",
    level: Math.min(...jobs.map((job) => jobLevel[job] ?? 99)),
    jobs,
    jobLevel,
    recast,
    cast,
    mp,
    range: 20,
    cure: name,
  };
}

/**
 * Single-target Cure. Cast is not shortened by Elemental Celerity.
 * Scholar learns Cure at 5, Cure II at 17, Cure III at 30, and Cure IV at 55.
 * Scholar is not a job here. Cure V is White Mage only. No Cure I. Cura is its own spell.
 */
export const CURE_SPELLS: readonly Spell[] = [
  cureSpell("Cure", 8, 2, 5, { WHM: 1, RDM: 3, PLD: 5, SCH: 5 }),
  cureSpell("Cure II", 24, 2.25, 5.5, { WHM: 11, RDM: 14, PLD: 17, SCH: 17 }),
  cureSpell("Cure III", 46, 2.5, 6, { WHM: 21, RDM: 26, PLD: 30, SCH: 30 }),
  cureSpell("Cure IV", 88, 2.5, 8, { WHM: 41, RDM: 48, PLD: 55, SCH: 55 }),
  cureSpell("Cure V", 135, 2.5, 10, { WHM: 61 }),
];

function curagaSpell(name: CuragaSpell, mp: number, cast: number, recast: number, level: number): Spell {
  return {
    name,
    school: "healing",
    level,
    jobs: ["WHM"],
    jobLevel: { WHM: level },
    recast,
    cast,
    mp,
    range: 20,
    radius: 15,
    curaga: name,
  };
}

/**
 * Area Cure. The circle opens on a party member and everyone inside 15' is healed.
 * This yard's only party member is you. An enemy is not a legal center, so the
 * circle opens on you. Cast is not shortened by Elemental Celerity.
 * Afflatus Solace does not cover these.
 * Curaga II's recast is 10.25 on the client spell table. The BG card prints 10.
 * Curaga V is White Mage 91 and is not here. Cura is not a Curaga.
 */
export const CURAGA_SPELLS: readonly Spell[] = [
  curagaSpell("Curaga", 60, 4.5, 10, 16),
  curagaSpell("Curaga II", 120, 4.75, 10.25, 31),
  curagaSpell("Curaga III", 180, 5, 10.5, 51),
  curagaSpell("Curaga IV", 260, 5.25, 10.75, 71),
];

/**
 * Stoneskin. Enhancing, earth, on yourself.
 * Current card: 29 MP, 7s cast, 30s recast, 5:00. The old 10s cast is not used.
 * Elemental Celerity does not shorten it.
 * White Mage 28, Red Mage 34, Scholar 44, Rune Fencer 55.
 */
export const STONESKIN_SPELL: Spell = {
  name: "Stoneskin",
  school: "enhancing",
  level: 28,
  jobs: ["WHM", "RDM", "SCH", "RUN"],
  jobLevel: { WHM: 28, RDM: 34, SCH: 44, RUN: 55 },
  recast: 30,
  cast: 7,
  mp: 29,
  self: true,
  stoneskin: true,
};

function naSpell(
  name: NonNullable<Spell["na"]>,
  mp: number,
  recast: number,
  whmLevel: number,
  schLevel?: number,
): Spell {
  const jobLevel: Partial<Record<JobId, number>> = { WHM: whmLevel };
  if (schLevel != null) jobLevel.SCH = schLevel;
  const jobs = (Object.keys(jobLevel) as JobId[]).filter((job) => jobLevel[job] != null);
  return {
    name,
    school: "healing",
    level: Math.min(...jobs.map((job) => jobLevel[job] ?? 99)),
    jobs,
    jobLevel,
    recast,
    cast: 1,
    mp,
    range: 20,
    na: name,
    ...(schLevel != null ? { addendum: "white" as const } : {}),
  };
}

/**
 * Status recovery. Cast is 1s on the client spell table.
 * BG prints Poisona at 2s. The client clock is the one used here.
 * Range is the BG 20'. The client stores 12, the same way Cure does.
 * Scholar learns them under Addendum: White and is not a job here.
 * Silena's description names Mute. BG's tested note says it does not remove Mute.
 */
export const NA_SPELLS: readonly Spell[] = [
  naSpell("Poisona", 8, 5, 6, 10),
  naSpell("Paralyna", 12, 5, 9, 12),
  naSpell("Blindna", 16, 10, 14, 17),
  naSpell("Silena", 24, 5, 19, 22),
  naSpell("Cursna", 30, 10, 29, 32),
  naSpell("Viruna", 48, 5, 34, 46),
  naSpell("Stona", 40, 5, 39, 50),
];

/** Esuna is centered on you. The 10' circle is the party, not an enemy. */
export const ESUNA_SPELL: Spell = {
  name: "Esuna",
  school: "healing",
  level: 61,
  jobs: ["WHM"],
  jobLevel: { WHM: 61 },
  recast: 30,
  cast: 1,
  mp: 24,
  radius: 10,
  self: true,
  esuna: true,
};

/** Sacrifice can name you or a party member. The client range is stored as 12; BG prints 20'. */
export const SACRIFICE_SPELL: Spell = {
  name: "Sacrifice",
  school: "healing",
  level: 65,
  jobs: ["WHM"],
  jobLevel: { WHM: 65 },
  recast: 30,
  cast: 1,
  mp: 18,
  range: 20,
  sacrifice: true,
};

function raiseSpell(
  name: RaiseSpell,
  cast: number,
  jobLevel: Partial<Record<JobId, number>>,
): Spell {
  const jobs = (Object.keys(jobLevel) as JobId[]).filter((job) => jobLevel[job] != null);
  return {
    name,
    school: "healing",
    level: Math.min(...jobs.map((job) => jobLevel[job] ?? 99)),
    jobs,
    jobLevel,
    recast: 60,
    cast,
    mp: 150,
    range: 20,
    raise: name,
    ...(name === "Raise II" ? { addendum: "white" as const } : {}),
  };
}

/**
 * Revive a KO'd player. Cast times are the client spell table.
 * Raise 15s, Raise II 14s, Raise III 13s. Recast is 60s. MP is 150. Range is 20'.
 * Enmity is dynamic on the card, so none is added.
 * White Mage 25 / 56 / 70. Red Mage 38, and Raise II at 95. Paladin learns only Raise, at 50.
 * Raise is Scholar 35 and does not need an addendum. Raise II is Scholar 70 and needs Addendum: White.
 * Raise III is not a Scholar spell. There is no Raise I.
 */
export const RAISE_SPELLS: readonly Spell[] = [
  raiseSpell("Raise", 15, { WHM: 25, RDM: 38, PLD: 50, SCH: 35 }),
  raiseSpell("Raise II", 14, { WHM: 56, RDM: 95, SCH: 70 }),
  raiseSpell("Raise III", 13, { WHM: 70 }),
];

function reraiseSpell(name: ReraiseSpell, cast: number, level: number, schLevel?: number): Spell {
  const jobLevel: Partial<Record<JobId, number>> = { WHM: level };
  if (schLevel != null) jobLevel.SCH = schLevel;
  const jobs = (Object.keys(jobLevel) as JobId[]).filter((job) => jobLevel[job] != null);
  return {
    name,
    school: "healing",
    level: Math.min(...jobs.map((job) => jobLevel[job] ?? 99)),
    jobs,
    jobLevel,
    recast: 60,
    cast,
    mp: 150,
    self: true,
    reraise: name,
    ...(schLevel != null ? { addendum: "white" as const } : {}),
  };
}

/**
 * The matching Raise, kept on you for 60 minutes, spent only if you are KO'd.
 * Cast times are the client spell table: 8s, 7.5s, 7s. Recast is 60s. MP is 150.
 * Self only. Any tier replaces any other, including a weaker one.
 * It is not dispelled. A main-job change removes it.
 * Reraise prints cumulative enmity 0 and leaves volatile blank, so volatile is not added.
 * Reraise II and Reraise III print cumulative 1 and volatile 80. The hate counter does not take spell enmity.
 * White Mage 25 / 56 / 70. Scholar is not a job here. There is no Reraise I.
 */
export const RERAISE_SPELLS: readonly Spell[] = [
  reraiseSpell("Reraise", 8, 25, 35),
  reraiseSpell("Reraise II", 7.5, 56, 70),
  reraiseSpell("Reraise III", 7, 70),
];

function divineSpell(
  name: string,
  cast: number,
  recast: number,
  mp: number,
  range: number,
  jobLevel: Partial<Record<JobId, number>>,
  extra: Partial<Spell>,
): Spell {
  const jobs = (Object.keys(jobLevel) as JobId[]).filter((job) => jobLevel[job] != null);
  return {
    name,
    school: "divine",
    level: Math.min(...jobs.map((job) => jobLevel[job] ?? 99)),
    jobs,
    jobLevel,
    recast,
    cast,
    mp,
    range,
    ...extra,
  };
}

/**
 * Divine magic. Cast times are the client spell table when BG still prints the pre-2009 card.
 * Banish II is 2.5s, not 3.75s. Banish III is 3s, not 5.5s. Repose is 3s, not 4.5s.
 * There is no Banish I and no Banishga I. Holy II, Banish IV, and Banishga III are not in this kit.
 * Enmity on the nuke cards is dynamic, so none is added. Flash's numbered hate is added in combat.
 */
export const DIVINE_SPELLS: readonly Spell[] = [
  divineSpell("Banish", 2, 15, 15, 21, { WHM: 5, PLD: 7 }, { banish: "Banish" }),
  divineSpell("Banish II", 2.5, 30, 57, 21, { WHM: 30, PLD: 34 }, { banish: "Banish II" }),
  divineSpell("Banish III", 3, 45, 96, 21, { WHM: 65 }, { banish: "Banish III" }),
  divineSpell("Banishga", 2.75, 15, 41, 21, { WHM: 15, PLD: 30 }, { banish: "Banishga", radius: 10 }),
  divineSpell("Banishga II", 4.5, 30, 120, 21, { WHM: 40 }, { banish: "Banishga II", radius: 10 }),
  divineSpell("Flash", 0.5, 45, 25, 20, { WHM: 45, PLD: 37, RUN: 45 }, { flash: true }),
  divineSpell("Holy", 0.75, 60, 100, 20, { WHM: 50, PLD: 55 }, { holy: true }),
  divineSpell("Repose", 3, 30, 26, 20, { WHM: 48 }, { repose: true, macc: 175 }),
];

/**
 * Cura. Self only, then party members inside the circle. The hare is not a party member.
 * Client spell row: 30 MP, 3s cast, 30s recast, animation 298, radius 100 which is 10'.
 * BG's card also prints 3s. Its range box prints 20'. The client spell range is 0, so this is self.
 * Gamer Escape's 5s cast is the stale card. Enmity on the card is starred and tiered with HP healed, so none is added.
 * White Mage 40 only. There is no Cura I. Cura II and Cura III are not in this kit.
 */
export const CURA_SPELL: Spell = {
  name: "Cura",
  school: "healing",
  level: 40,
  jobs: ["WHM"],
  jobLevel: { WHM: 40 },
  recast: 30,
  cast: 3,
  mp: 30,
  radius: 10,
  self: true,
  cura: true,
};

function barrierSpell(
  name: string,
  kind: BarrierKind,
  tier: BarrierTier,
  area: boolean,
  mp: number,
  cast: number,
  recast: number,
  jobLevel: Partial<Record<JobId, number>>,
  effectLevel?: number,
): Spell {
  const jobs = (Object.keys(jobLevel) as JobId[]).filter((job) => jobLevel[job] != null);
  const level = Math.min(...jobs.map((job) => jobLevel[job] ?? 99));
  return {
    name,
    school: "enhancing",
    level,
    jobs,
    jobLevel,
    recast,
    cast,
    mp,
    ...(area ? { self: true, radius: 10 } : { range: 20 }),
    barrier: { kind, tier, area, effectLevel: effectLevel ?? level },
  };
}

/**
 * Protect and Shell. Cast times are the client spell table, not the rounded BG card.
 * Protect is 1s / 5s, then +0.25s cast and recast each tier. The area line recasts at 15s and adds 1s a tier.
 * Range is 20' for one party member. Protectra and Shellra are centered on you, 10' radius.
 * This yard's only party member is you, so both land on you.
 * White Mage, Red Mage, Paladin, Scholar, and Rune Fencer learn the single-target line. Only White Mage learns the area line.
 * Protect: SCH 10, RUN 20. II: SCH 30, RUN 40. III: SCH 50, RUN 60. IV: SCH 66, RUN 80. Protect IV is not castable at 75 on Rune Fencer.
 * Shell: SCH 20, RUN 10. II: SCH 40, RUN 30. III: SCH 60, RUN 50. IV: SCH 71, RUN 70.
 * Element is light. The cast is the white-magic chant. Elemental Celerity does not shorten it.
 * There is no Protect I and no Shell I. Protect V and Shell V are level 76 and are not here.
 * Duration uses the enhancing table's spell level. That matches the earliest job, except Shell and Shellra, whose table level is 18.
 */
export const PROTECT_SPELLS: readonly Spell[] = [
  barrierSpell("Protect", "protect", 1, false, 9, 1, 5, { WHM: 7, RDM: 7, PLD: 10, SCH: 10, RUN: 20 }),
  barrierSpell("Protect II", "protect", 2, false, 28, 1.25, 5.25, { WHM: 27, RDM: 27, PLD: 30, SCH: 30, RUN: 40 }),
  barrierSpell("Protect III", "protect", 3, false, 46, 1.5, 5.5, { WHM: 47, RDM: 47, PLD: 50, SCH: 50, RUN: 60 }),
  barrierSpell("Protect IV", "protect", 4, false, 65, 1.75, 5.75, { WHM: 63, RDM: 63, PLD: 70, SCH: 66, RUN: 80 }),
];

export const PROTECTRA_SPELLS: readonly Spell[] = [
  barrierSpell("Protectra", "protect", 1, true, 9, 1, 15, { WHM: 7 }),
  barrierSpell("Protectra II", "protect", 2, true, 28, 1.25, 16, { WHM: 27 }),
  barrierSpell("Protectra III", "protect", 3, true, 46, 1.5, 17, { WHM: 47 }),
  barrierSpell("Protectra IV", "protect", 4, true, 65, 1.75, 18, { WHM: 63 }),
  barrierSpell("Protectra V", "protect", 5, true, 84, 2, 19, { WHM: 75 }),
];

export const SHELL_SPELLS: readonly Spell[] = [
  barrierSpell("Shell", "shell", 1, false, 18, 1, 5, { WHM: 17, RDM: 17, PLD: 20, SCH: 20, RUN: 10 }, 18),
  barrierSpell("Shell II", "shell", 2, false, 37, 1.25, 5.25, { WHM: 37, RDM: 37, PLD: 40, SCH: 40, RUN: 30 }),
  barrierSpell("Shell III", "shell", 3, false, 56, 1.5, 5.5, { WHM: 57, RDM: 57, PLD: 60, SCH: 60, RUN: 50 }),
  barrierSpell("Shell IV", "shell", 4, false, 75, 1.75, 5.75, { WHM: 68, RDM: 68, PLD: 80, SCH: 71, RUN: 70 }),
];

export const SHELLRA_SPELLS: readonly Spell[] = [
  barrierSpell("Shellra", "shell", 1, true, 18, 1, 15, { WHM: 17 }, 18),
  barrierSpell("Shellra II", "shell", 2, true, 37, 1.25, 16, { WHM: 37 }),
  barrierSpell("Shellra III", "shell", 3, true, 56, 1.5, 17, { WHM: 57 }),
  barrierSpell("Shellra IV", "shell", 4, true, 75, 1.75, 18, { WHM: 68 }),
  barrierSpell("Shellra V", "shell", 5, true, 93, 2, 19, { WHM: 75 }),
];

const BARRIER_SPELLS: readonly Spell[] = [...PROTECT_SPELLS, ...PROTECTRA_SPELLS, ...SHELL_SPELLS, ...SHELLRA_SPELLS];

function listedSpell(
  name: string,
  mp: number,
  cast: number,
  recast: number,
  jobLevel: Partial<Record<JobId, number>>,
  extra: Partial<Spell>,
): Spell {
  const jobs = (Object.keys(jobLevel) as JobId[]).filter((job) => jobLevel[job] != null);
  const level = Math.min(...jobs.map((job) => jobLevel[job] ?? 99));
  return {
    name,
    school: "enhancing",
    level,
    jobs,
    jobLevel,
    recast,
    cast,
    mp,
    ...extra,
  };
}

/**
 * Regen, Haste, Refresh, and Auspice.
 * Cast times are the client spell table. The BG cards still print Haste at 6s
 * and Auspice at 7s and 30 MP. Those are stale. Gamer Escape matches the client.
 * All three are white magic, so the body is the enhancing chant.
 * Regen and Auspice gather light. Haste gathers wind. Elemental Celerity does not apply.
 * The land plays for 2 seconds (animationTime). Regen is 108, 139, 140.
 * Haste is 57. Auspice is 142. Refresh's client animation id is not stored here.
 * Regen is single target at 20' even though the AOE column is set. Its radius is 0.
 * Haste is 20' and can land on a party member. Auspice is centered on you, 10' radius.
 * Refresh is 20', single party member, enhancing white magic, element Light.
 * This yard's only party member is you, so all four land on you.
 * White Mage and Red Mage learn Regen. Regen II's Red Mage level is 76 and fails here.
 * Regen III and Auspice are White Mage only. Haste is White Mage 40 and Red Mage 48.
 * Refresh is Red Mage 41 only. White Mage does not learn it. A level-37 sub has not.
 * Scholar and Rune Fencer learn Regen. Rune Fencer learns Refresh at 62. White Mage does not.
 * Regen: SCH 18, RUN 23. II: SCH 37, RUN 48. III: SCH 59, RUN 70.
 * Haste has no Scholar byte. There is no Regen I. Regen IV, Regen V, Haste II, and Hastega are not here.
 * Refresh II is effect level 82 and Refresh III is 99. Neither is here.
 * Refresh is 40 MP, a 5 second cast, and an 18 second recast. 3 MP every 3 seconds for 150 seconds.
 * A private-server 50 MP cost and 16 second recast are not used.
 * Recasting Refresh overwrites it. The hate counter does not take its enmity.
 */
export const REGEN_SPELLS: readonly Spell[] = [
  listedSpell("Regen", 15, 1.5, 12, { WHM: 21, RDM: 21, SCH: 18, RUN: 23 }, { range: 20, regen: { tier: 1, effectLevel: 21 } }),
  listedSpell("Regen II", 36, 1.75, 16, { WHM: 44, RDM: 76, SCH: 37, RUN: 48 }, { range: 20, regen: { tier: 2, effectLevel: 44 } }),
  listedSpell("Regen III", 64, 2, 20, { WHM: 66, SCH: 59, RUN: 70 }, { range: 20, regen: { tier: 3, effectLevel: 66 } }),
];

export const HASTE_SPELL: Spell = listedSpell("Haste", 40, 3, 20, { WHM: 40, RDM: 48 }, { range: 20, haste: { effectLevel: 40 } });

/** Red Mage 41 and Rune Fencer 62. Refresh II and III are past 75 and are not on this spell. */
export const REFRESH_SPELL: Spell = listedSpell("Refresh", 40, 5, 18, { RDM: 41, RUN: 62 }, { range: 20, refresh: { effectLevel: 41 } });

export const AUSPICE_SPELL: Spell = listedSpell("Auspice", 48, 3, 10, { WHM: 55 }, { self: true, radius: 10, auspice: { effectLevel: 55 } });

const MAINTAIN_SPELLS: readonly Spell[] = [...REGEN_SPELLS, HASTE_SPELL, REFRESH_SPELL, AUSPICE_SPELL];

/**
 * Aquaveil and Blink. Self enhancing. Cast times are the client spell table.
 * Gamer Escape still prints Aquaveil at 9 seconds and 5 minutes. Those are stale.
 * The client cast is 5 seconds and the power table lasts 600 seconds.
 * Blink's cast is 6 seconds. Both recast at 10. Both gather their element:
 * Aquaveil is water, Blink is wind. The body is the white-magic chant.
 * The land plays for 2 seconds. Aquaveil is animation 55. Blink is 53.
 * Scholar and Rune Fencer learn both.
 * Aquaveil: SCH 13, RUN 15. Blink: the client job byte is SCH 29, and BG prints 30. RUN 35.
 */
export const AQUAVEIL_SPELL: Spell = listedSpell("Aquaveil", 12, 5, 10, { WHM: 10, RDM: 12, SCH: 13, RUN: 15 }, { self: true, aquaveil: { effectLevel: 1 } });
export const BLINK_SPELL: Spell = listedSpell("Blink", 20, 6, 10, { WHM: 19, RDM: 23, SCH: 30, RUN: 35 }, { self: true, blink: { effectLevel: 19 } });

const VEIL_SPELLS: readonly Spell[] = [AQUAVEIL_SPELL, BLINK_SPELL];

/**
 * Phalanx and Reprisal. Enhancing white magic, spell group 6, element light.
 * The cast is the white-magic chant: hands at the waist, palms up, light gathering.
 * The land plays for 2 seconds. Phalanx is animation 106. Reprisal is animation 143.
 *
 * Phalanx is 21 MP, a 3 second cast, and a 10 second recast. Red Mage 33.
 * Paladin 77 fails the level check. Rune Fencer learns it at 68.
 * The client target flag is self. The range column is 200 and is not a party radius.
 * Phalanx II is Red Mage 75, 42 MP, and 240 seconds. It is not this spell.
 *
 * Reprisal is 24 MP, a 1 second cast, and a 3 minute recast. Paladin 61 only.
 * Gamer Escape's 0.5 second cast is stale. The client row is 1 second.
 * The target flag is self and the range column is 0.
 */
export const PHALANX_SPELL: Spell = listedSpell("Phalanx", 21, 3, 10, { RDM: 33, PLD: 77, RUN: 68 }, { self: true, phalanx: { effectLevel: 33 } });
export const REPRISAL_SPELL: Spell = listedSpell("Reprisal", 24, 1, 180, { PLD: 61 }, { self: true, reprisal: { effectLevel: 1 } });

const WARD_SPELLS: readonly Spell[] = [PHALANX_SPELL, REPRISAL_SPELL];

export type EnspellName =
  | "Enthunder"
  | "Enstone"
  | "Enaero"
  | "Enblizzard"
  | "Enfire"
  | "Enwater"
  | "Enthunder II"
  | "Enstone II"
  | "Enaero II"
  | "Enblizzard II"
  | "Enfire II"
  | "Enwater II";

/** Flat 3:00. Not the enhancing-duration curve. Composure triples it, and stops at 30:00. */
export const ENSPELL_SECONDS = 180;
/** Client row. The BG card's 300 is stale. */
export const ENSPELL_CE = 1;
export const ENSPELL_VE = 165;
/** Client row. The BG card's 80 and 240 are stale. */
export const ENSPELL_II_CE = 44;
export const ENSPELL_II_VE = 132;

/**
 * The element a tier II enspell would make the target weaker to, for a few seconds.
 * Enfire II lowers water. Enthunder II lowers earth. Magic evasion is not rolled here.
 */
export const ENSPELL_OPPOSED = {
  thunder: "earth",
  earth: "wind",
  wind: "ice",
  ice: "fire",
  fire: "water",
  water: "thunder",
} as const;

/**
 * Red Mage enspells through level 75. White magic, enhancing, spell group 6, self only.
 * The cast is the white-magic chant: hands at the waist, palms up, while this element gathers.
 * The land is that spell's own animation for 2 seconds. Tier I animations are
 * Enfire 100, Enblizzard 101, Enaero 102, Enstone 103, Enthunder 104, Enwater 105.
 * Tier II are Enstone II 302, Enwater II 303, Enaero II 304, Enfire II 305,
 * Enblizzard II 306, and Enthunder II 307.
 * Cast is 3 seconds. Tier I recasts in 10. Tier II recasts in 30.
 * The BG cards still print tier II at 10 seconds. The client row is 30, and Gamer Escape matches it.
 * Duration is a flat 3:00. Paladin Enlight and Dark Knight Endark are not here.
 * A level 37 subjob learns the tier I line. Tier II starts at 50.
 */
const ENSPELL_ROWS: readonly {
  name: EnspellName;
  level: number;
  tier: 1 | 2;
  element: "fire" | "ice" | "wind" | "earth" | "thunder" | "water";
}[] = [
  { name: "Enthunder", level: 16, tier: 1, element: "thunder" },
  { name: "Enstone", level: 18, tier: 1, element: "earth" },
  { name: "Enaero", level: 20, tier: 1, element: "wind" },
  { name: "Enblizzard", level: 22, tier: 1, element: "ice" },
  { name: "Enfire", level: 24, tier: 1, element: "fire" },
  { name: "Enwater", level: 27, tier: 1, element: "water" },
  { name: "Enthunder II", level: 50, tier: 2, element: "thunder" },
  { name: "Enstone II", level: 52, tier: 2, element: "earth" },
  { name: "Enaero II", level: 54, tier: 2, element: "wind" },
  { name: "Enblizzard II", level: 56, tier: 2, element: "ice" },
  { name: "Enfire II", level: 58, tier: 2, element: "fire" },
  { name: "Enwater II", level: 60, tier: 2, element: "water" },
];

export const ENSPELL_SPELLS: readonly Spell[] = ENSPELL_ROWS.map((row) =>
  listedSpell(row.name, row.tier === 1 ? 12 : 24, 3, row.tier === 1 ? 10 : 30, { RDM: row.level }, {
    self: true,
    enspell: { tier: row.tier, element: row.element },
  }),
);

/**
 * Paralyze, Slow, Silence, Dia, and the tier II merit spells. Enfeebling skill, spell group 6.
 * The cast is cawh: hands at the waist, the same body as Cure and Protect.
 * It is not cabk. Dia gathers light. Paralyze gathers ice. Slow gathers earth. Silence gathers wind.
 * Inundation gathers light. The land plays for 2 seconds.
 * Paralyze is animation 58, Paralyze II is 282, Slow is 56, Slow II is 283, Silence is 59.
 * Dia's land is a gold shaft. Diaga is animation 33: a ring of daylight on the ground and light pillars around it for 2 seconds, not Dia's shaft and not Banishga. There is no Diaga II.
 * BG prints 21' for the tier I spells. The client spell_range column is 200.
 * Paralyze II and Slow II print 20'. Inundation prints 21'. Dia prints 20'.
 * Magic accuracy is not rolled. Scholar does not learn them.
 */
function whiteEnfeeble(
  name: "Paralyze" | "Paralyze II" | "Slow" | "Slow II" | "Silence" | "Inundation" | "Dia" | "Dia II" | "Dia III" | "Diaga",
  mp: number,
  cast: number,
  recast: number,
  macc: number,
  jobLevel: Partial<Record<JobId, number>>,
  range = 21,
  radius?: number,
): Spell {
  const jobs = (Object.keys(jobLevel) as JobId[]).filter((job) => jobLevel[job] != null);
  return {
    name,
    school: "enfeebling",
    level: Math.min(...jobs.map((job) => jobLevel[job] ?? 99)),
    jobs,
    jobLevel,
    recast,
    cast,
    mp,
    range,
    macc,
    enfeeble: name,
    castGroup: "white",
    ...(radius != null ? { radius } : {}),
  };
}

export const WHITE_ENFEEBLE_SPELLS: readonly Spell[] = [
  whiteEnfeeble("Dia", 7, 1, 5, 0, { RDM: 1, WHM: 3 }, 20),
  whiteEnfeeble("Paralyze", 6, 3, 10, -10, { WHM: 4, RDM: 6 }),
  whiteEnfeeble("Slow", 15, 2, 20, 10, { WHM: 13, RDM: 13 }),
  whiteEnfeeble("Diaga", 12, 1.5, 6, 0, { RDM: 15, WHM: 18 }, 20, 10),
  whiteEnfeeble("Silence", 16, 3, 10, 0, { WHM: 15, RDM: 18 }),
  whiteEnfeeble("Dia II", 30, 1.5, 6, 0, { RDM: 31, WHM: 36 }, 20),
  whiteEnfeeble("Inundation", 48, 3, 20, 0, { RDM: 64 }),
  whiteEnfeeble("Dia III", 45, 2, 7, 0, { RDM: 75 }, 20),
  whiteEnfeeble("Paralyze II", 36, 3, 20, 10, { RDM: 75 }, 20),
  whiteEnfeeble("Slow II", 45, 3, 20, 10, { RDM: 75 }, 20),
];

/**
 * Erase. Enhancing, light, one party member. The client cast is 2.5 seconds.
 * The BG card's 3 seconds is stale. Recast is 15. Range is 20'.
 * The land is animation 138 for 2 seconds, not the spell id.
 * Scholar learns it at 39 under Addendum: White and is not a job here.
 * Red Mage does not learn it.
 */
export const ERASE_SPELL: Spell = listedSpell("Erase", 18, 2.5, 15, { WHM: 32, SCH: 39 }, { range: 20, erase: true, addendum: "white" });

/**
 * White Mage area bars. The client cast is 0.5s for an element and 5s for a status.
 * Recast is 10s. Duration is 8 minutes. The radius is 10'.
 * The cast is the white-magic chant. The circle uses the spell's own element,
 * which is the element strong against the one the ward resists.
 * Barfira is water and resists fire. Barblizzara is fire and resists ice.
 * Baraera is ice and resists wind. Barstonra is wind and resists earth.
 * Barthundra is earth and resists lightning. Barwatera is thunder and resists water.
 * Status bars use light, thunder, fire, light, ice, water, and wind in that level order.
 * Cumulative enmity is 1. Volatile enmity is 80, except Barpoisonra, which is 300.
 * Baramnesra is 78. The self-target bars are Rune Fencer only. Red Mage's copies are not here.
 */
const BAR_ROWS: readonly {
  name: BarSpellName;
  mp: number;
  cast: number;
  level: number;
  kind: "element" | "status";
  element: SpellElement;
  resists: BarElement | BarStatus;
}[] = [
  { name: "Barstonra", mp: 12, cast: 0.5, level: 5, kind: "element", element: "wind", resists: "earth" },
  { name: "Barsleepra", mp: 14, cast: 5, level: 7, kind: "status", element: "light", resists: "Sleep" },
  { name: "Barwatera", mp: 12, cast: 0.5, level: 9, kind: "element", element: "thunder", resists: "water" },
  { name: "Barpoisonra", mp: 18, cast: 5, level: 10, kind: "status", element: "thunder", resists: "Poison" },
  { name: "Barparalyzra", mp: 22, cast: 5, level: 12, kind: "status", element: "fire", resists: "Paralysis" },
  { name: "Baraera", mp: 12, cast: 0.5, level: 13, kind: "element", element: "ice", resists: "wind" },
  { name: "Barfira", mp: 12, cast: 0.5, level: 17, kind: "element", element: "water", resists: "fire" },
  { name: "Barblindra", mp: 26, cast: 5, level: 18, kind: "status", element: "light", resists: "Blindness" },
  { name: "Barblizzara", mp: 12, cast: 0.5, level: 21, kind: "element", element: "fire", resists: "ice" },
  { name: "Barsilencera", mp: 30, cast: 5, level: 23, kind: "status", element: "ice", resists: "Silence" },
  { name: "Barthundra", mp: 12, cast: 0.5, level: 25, kind: "element", element: "earth", resists: "thunder" },
  { name: "Barvira", mp: 50, cast: 5, level: 39, kind: "status", element: "water", resists: "Plague" },
  { name: "Barpetra", mp: 40, cast: 5, level: 43, kind: "status", element: "wind", resists: "Petrification" },
];

export const BAR_SPELLS: readonly Spell[] = BAR_ROWS.map((row) =>
  listedSpell(row.name, row.mp, row.cast, 10, { WHM: row.level }, {
    self: true,
    radius: 10,
    bar: { kind: row.kind, element: row.element, resists: row.resists, effectLevel: row.level },
  }),
);

/**
 * Rune Fencer self bars. No radius, so they do not splash.
 * Elemental cards are 6 MP and a 0.5s cast. Status cards are half the area MP and a 2.5s cast.
 * Barwater is 6, not the 9 an older list printed. Barvirus is 25. Barpetrify is 20.
 * Volatile enmity is 300. Duration is 8:00. Baramnesia is 76 and is not here.
 */
const RUN_BAR_ROWS: readonly {
  name: string;
  mp: number;
  cast: number;
  level: number;
  kind: "element" | "status";
  element: SpellElement;
  resists: BarElement | BarStatus;
}[] = [
  { name: "Barstone", mp: 6, cast: 0.5, level: 4, kind: "element", element: "wind", resists: "earth" },
  { name: "Barsleep", mp: 7, cast: 2.5, level: 6, kind: "status", element: "light", resists: "Sleep" },
  { name: "Barwater", mp: 6, cast: 0.5, level: 8, kind: "element", element: "thunder", resists: "water" },
  { name: "Barpoison", mp: 9, cast: 2.5, level: 9, kind: "status", element: "thunder", resists: "Poison" },
  { name: "Barparalyze", mp: 11, cast: 2.5, level: 11, kind: "status", element: "fire", resists: "Paralysis" },
  { name: "Baraero", mp: 6, cast: 0.5, level: 12, kind: "element", element: "ice", resists: "wind" },
  { name: "Barfire", mp: 6, cast: 0.5, level: 16, kind: "element", element: "water", resists: "fire" },
  { name: "Barblind", mp: 13, cast: 2.5, level: 17, kind: "status", element: "light", resists: "Blindness" },
  { name: "Barblizzard", mp: 6, cast: 0.5, level: 20, kind: "element", element: "fire", resists: "ice" },
  { name: "Barsilence", mp: 15, cast: 2.5, level: 22, kind: "status", element: "ice", resists: "Silence" },
  { name: "Barthunder", mp: 6, cast: 0.5, level: 24, kind: "element", element: "earth", resists: "thunder" },
  { name: "Barvirus", mp: 25, cast: 2.5, level: 38, kind: "status", element: "water", resists: "Plague" },
  { name: "Barpetrify", mp: 20, cast: 2.5, level: 42, kind: "status", element: "wind", resists: "Petrification" },
];

export const RUN_BAR_SPELLS: readonly Spell[] = RUN_BAR_ROWS.map((row) =>
  listedSpell(row.name, row.mp, row.cast, 10, { RUN: row.level }, {
    self: true,
    bar: { kind: row.kind, element: row.element, resists: row.resists, effectLevel: row.level },
  }),
);

/** Foil. Rune Fencer 58. 48 MP, 1s cast, 45s recast, 30s. Evasion 150, decaying 3 a tick. */
export const FOIL_SPELL: Spell = listedSpell("Foil", 48, 1, 45, { RUN: 58 }, { self: true, foil: { effectLevel: 58 } });

/** Bard songs through 75. Party songs stay self so a gambit does not walk in before singing. The job book reads songCard for the 12' area. */
export const SONG_SPELLS: readonly Spell[] = SONGS.map((song) => ({
  name: song.name,
  school: "singing" as const,
  level: song.level,
  jobs: ["BRD"] as const,
  cast: song.cast,
  recast: song.recast,
  mp: 0,
  ...(song.hostile ? { range: song.range } : { self: true }),
  song: { family: song.family, hostile: song.hostile },
}));

/**
 * Tier-1 helix. Geohelix and Hydrohelix both print 26 MP, a 5 second cast, a 45 second recast, and 21'.
 * Every tier-1 helix shares one M and one V. The Magic Damage page's Helix I row is the damage.
 * Duration follows the scholar's own level: 30s, 60s, or 90s.
 * Helix II is a level-99 job-point gift and is not in this yard.
 */
export const HELIX_SPELLS: readonly Spell[] = (
  [
    ["Geohelix", 18],
    ["Hydrohelix", 20],
    ["Anemohelix", 22],
    ["Pyrohelix", 24],
    ["Cryohelix", 26],
    ["Ionohelix", 28],
    ["Noctohelix", 30],
    ["Luminohelix", 32],
  ] as const
).map(([name, level]) => ({
  name,
  school: "elemental" as const,
  level,
  jobs: ["SCH"] as const,
  jobLevel: { SCH: level },
  recast: 45,
  cast: 5,
  mp: 26,
  range: 21,
  helix: true,
}));

/**
 * Scholar storms. White magic, enhancing, one party member.
 * This yard's party is you, so each one lands on you.
 * The body is the white-magic chant. The gather uses the storm's element.
 * The land is that weather around you, and it stays while the status does.
 */
export const STORM_SPELLS: readonly Spell[] = STORMS.map((row) =>
  listedSpell(row.name, STORM_MP, STORM_CAST, STORM_RECAST, { SCH: row.level }, {
    range: STORM_RANGE,
    storm: { element: row.element, sky: row.sky },
  }),
);

/** Scholar Klimaform. Black magic, Dark Magic, self. The body is the black-magic chant. */
export const KLIMAFORM_SPELL: Spell = {
  name: "Klimaform",
  school: "dark",
  level: 46,
  jobs: ["SCH"],
  jobLevel: { SCH: 46 },
  mp: KLIMAFORM_MP,
  cast: KLIMAFORM_CAST,
  recast: KLIMAFORM_RECAST,
  self: true,
  klimaform: true,
};

/** Geomancer -ra line. Black magic, centered on the caster, 10' radius. Tier I is 1.5s / 5s. Tier II is 3s / 15s. Aera II is 80 and is not here. */
function raSpell(
  name: "Stonera" | "Stonera II" | "Watera" | "Watera II" | "Aera" | "Fira" | "Blizzara" | "Thundara",
  mp: number,
  cast: number,
  recast: number,
  jobLevel: Partial<Record<JobId, number>>,
): Spell {
  const card = nukeSpell(name, mp, cast, recast, 0, jobLevel);
  const { range: _dropped, ...rest } = card;
  return { ...rest, self: true, radius: 10 };
}

export const RA_SPELLS: readonly Spell[] = [
  raSpell("Stonera", 67, 1.5, 5, { GEO: 25 }),
  raSpell("Watera", 81, 1.5, 5, { GEO: 30 }),
  raSpell("Aera", 94, 1.5, 5, { GEO: 35 }),
  raSpell("Fira", 108, 1.5, 5, { GEO: 40 }),
  raSpell("Blizzara", 121, 1.5, 5, { GEO: 45 }),
  raSpell("Thundara", 135, 1.5, 5, { GEO: 50 }),
  raSpell("Stonera II", 166, 3, 15, { GEO: 70 }),
  raSpell("Watera II", 185, 3, 15, { GEO: 75 }),
];

type ColureCard = { side: "indi" | "geo"; effect: GeoEffect; label: string; mp: number; level: number };

const COLURE_CARDS: readonly ColureCard[] = [
  { side: "indi", effect: "poison", label: "Poison", mp: 12, level: 1 },
  { side: "geo", effect: "poison", label: "Poison", mp: 25, level: 5 },
  { side: "indi", effect: "voidance", label: "Voidance", mp: 17, level: 4 },
  { side: "geo", effect: "voidance", label: "Voidance", mp: 35, level: 8 },
  { side: "indi", effect: "precision", label: "Precision", mp: 25, level: 10 },
  { side: "geo", effect: "precision", label: "Precision", mp: 50, level: 14 },
  { side: "indi", effect: "regen", label: "Regen", mp: 37, level: 15 },
  { side: "geo", effect: "regen", label: "Regen", mp: 74, level: 19 },
  { side: "indi", effect: "attunement", label: "Attunement", mp: 38, level: 16 },
  { side: "geo", effect: "attunement", label: "Attunement", mp: 77, level: 20 },
  { side: "indi", effect: "focus", label: "Focus", mp: 49, level: 22 },
  { side: "geo", effect: "focus", label: "Focus", mp: 98, level: 26 },
  { side: "indi", effect: "barrier", label: "Barrier", mp: 59, level: 28 },
  { side: "geo", effect: "barrier", label: "Barrier", mp: 119, level: 32 },
  { side: "indi", effect: "refresh", label: "Refresh", mp: 63, level: 30 },
  { side: "geo", effect: "refresh", label: "Refresh", mp: 126, level: 34 },
  { side: "indi", effect: "chr", label: "CHR", mp: 63, level: 30 },
  { side: "geo", effect: "chr", label: "CHR", mp: 126, level: 34 },
  { side: "indi", effect: "mnd", label: "MND", mp: 63, level: 33 },
  { side: "geo", effect: "mnd", label: "MND", mp: 126, level: 37 },
  { side: "indi", effect: "fury", label: "Fury", mp: 70, level: 34 },
  { side: "geo", effect: "fury", label: "Fury", mp: 140, level: 38 },
  { side: "indi", effect: "int", label: "INT", mp: 63, level: 36 },
  { side: "geo", effect: "int", label: "INT", mp: 126, level: 40 },
  { side: "indi", effect: "agi", label: "AGI", mp: 63, level: 39 },
  { side: "geo", effect: "agi", label: "AGI", mp: 126, level: 43 },
  { side: "indi", effect: "fend", label: "Fend", mp: 80, level: 40 },
  { side: "geo", effect: "fend", label: "Fend", mp: 161, level: 44 },
  { side: "indi", effect: "vit", label: "VIT", mp: 63, level: 42 },
  { side: "geo", effect: "vit", label: "VIT", mp: 126, level: 46 },
  { side: "indi", effect: "dex", label: "DEX", mp: 63, level: 45 },
  { side: "geo", effect: "dex", label: "DEX", mp: 126, level: 49 },
  { side: "indi", effect: "acumen", label: "Acumen", mp: 91, level: 46 },
  { side: "geo", effect: "acumen", label: "Acumen", mp: 182, level: 50 },
  { side: "indi", effect: "str", label: "STR", mp: 63, level: 48 },
  { side: "geo", effect: "str", label: "STR", mp: 126, level: 52 },
  { side: "indi", effect: "slow", label: "Slow", mp: 94, level: 48 },
  { side: "geo", effect: "slow", label: "Slow", mp: 189, level: 52 },
  { side: "indi", effect: "torpor", label: "Torpor", mp: 101, level: 52 },
  { side: "geo", effect: "torpor", label: "Torpor", mp: 203, level: 56 },
  { side: "indi", effect: "slip", label: "Slip", mp: 112, level: 58 },
  { side: "geo", effect: "slip", label: "Slip", mp: 225, level: 62 },
  { side: "indi", effect: "languor", label: "Languor", mp: 124, level: 64 },
  { side: "geo", effect: "languor", label: "Languor", mp: 249, level: 68 },
  { side: "indi", effect: "paralysis", label: "Paralysis", mp: 107, level: 68 },
  { side: "geo", effect: "paralysis", label: "Paralysis", mp: 215, level: 72 },
  { side: "indi", effect: "vex", label: "Vex", mp: 136, level: 70 },
  { side: "geo", effect: "vex", label: "Vex", mp: 273, level: 74 },
];

function colureSpell(card: ColureCard): Spell {
  const geo = card.side === "geo";
  return {
    name: `${geo ? "Geo" : "Indi"}-${card.label}`,
    school: "geomancy",
    level: card.level,
    jobs: ["GEO"],
    jobLevel: { GEO: card.level },
    recast: geo ? 24 : 12,
    cast: geo ? 8 : 4,
    mp: card.mp,
    ...(geo ? { range: 21 } : { self: true }),
    colure: { side: card.side, effect: card.effect },
  };
}

/** Indicolure and Geocolure through level 75. No Frailty, Wilt, Haste, or anything at 76. */
export const GEOMANCY_SPELLS: readonly Spell[] = COLURE_CARDS.map(colureSpell);

const ELEMENTAL_SPELLS: readonly Spell[] = [...STONE_SPELLS, ...WATER_SPELLS, ...AERO_SPELLS, ...FIRE_SPELLS, ...BLIZZARD_SPELLS, ...THUNDER_SPELLS, ...STONEGA_SPELLS, ...BLIZZAGA_SPELLS, ...AEROGA_SPELLS, ...FIRAGA_SPELLS, ...WATERGA_SPELLS, ...THUNDAGA_SPELLS, ...ANCIENT_SPELLS, ...RA_SPELLS, ...SPIKE_SPELLS, ...DEBUFF_SPELLS, ...ENFEEBLE_SPELLS, ...SIPHON_SPELLS, ...DARK_STATUS_SPELLS, ...WARP_SPELLS, ...HELIX_SPELLS].sort(
  (a, b) => a.level - b.level || a.name.localeCompare(b.name),
);

const SUMMON_SPELLS: Spell[] = SUMMONS.map((row) => ({
  name: row.name,
  school: "summoning" as const,
  level: row.level,
  jobs: ["SMN"] as const,
  recast: row.family === "burst" ? ATOMOS_RECAST : row.id === "alexander" ? ALEXANDER_RECAST : SUMMON_RECAST,
  cast: row.family === "burst" ? ATOMOS_CAST : row.id === "alexander" ? ALEXANDER_CAST : SUMMON_CAST,
  mp: row.mp,
  summon: row.id,
  ...(row.family === "burst" ? { range: ATOMOS_RANGE } : {}),
}));

const BLUE_MAGIC_SPELLS: readonly Spell[] = BLUE_SPELLS.map((row) => ({
  name: row.name,
  school: "blue" as const,
  level: row.level,
  jobs: ["BLU"] as const,
  cast: row.cast,
  recast: row.recast,
  mp: row.mp,
  ...(row.kind === "flash"
    ? { self: true as const, radius: row.radius, macc: row.macc, blue: { flash: true as const } }
    : row.kind === "spikes"
      ? { self: true as const, blue: { spikes: true as const } }
      : row.kind === "silence"
        ? { range: row.range, blue: { silence: true as const } }
        : row.kind === "mantle"
          ? { self: true as const, blue: { mantle: true as const } }
          : row.kind === "song"
            ? { self: true as const, radius: row.radius, blue: { song: true as const } }
            : row.kind === "breeze"
              ? { self: true as const, radius: row.radius, blue: { breeze: true as const } }
              : row.kind === "cocoon"
                ? { self: true as const, blue: { cocoon: true as const } }
                : row.kind === "metal"
                  ? { self: true as const, blue: { metal: true as const } }
                  : row.kind === "refuel"
                  ? { self: true as const, blue: { refuel: true as const } }
                  : row.kind === "memento"
                    ? { self: true as const, blue: { memento: true as const } }
                    : row.kind === "magical"
                      ? { range: row.range, blue: { magical: true as const } }
                      : row.kind === "sand"
                        ? { self: true as const, radius: row.radius, blue: { sand: true as const } }
                        : row.kind === "orb"
                          ? { range: row.range, blue: { orb: true as const } }
                          : row.kind === "breath" && row.radial
                            ? { self: true as const, radius: row.range, blue: { breath: true as const } }
                            : row.kind === "breath"
                            ? { range: row.range, blue: { breath: true as const } }
                            : row.kind === "sound"
                              ? { self: true as const, radius: row.radius, blue: { sound: true as const } }
                              : row.kind === "ray"
                                ? { range: row.range, blue: { ray: true as const } }
                                : row.kind === "digest"
                                  ? { range: row.range, blue: { digest: true as const } }
                                  : row.kind === "kiss"
                                    ? { range: row.range, blue: { kiss: true as const } }
                                    : row.kind === "blitz"
                                      ? { range: row.range, blue: { blitz: true as const } }
                                      : row.kind === "gas"
                                        ? { self: true as const, radius: row.radius, blue: { gas: true as const } }
                                        : row.kind === "pollen"
                          ? { self: true as const, blue: { pollen: true as const } }
                          : row.kind === "cure"
                ? { range: row.range, blue: { cure: true as const } }
                : row.kind === "gaze"
                  ? { range: row.range, blue: { gaze: true as const } }
                  : row.kind === "mystery"
                    ? { self: true as const, radius: row.radius, blue: { mystery: true as const } }
                    : row.kind === "venom"
                      ? { self: true as const, radius: row.radius, blue: { venom: true as const } }
                      : row.kind === "geist"
                        ? { self: true as const, radius: row.radius, blue: { geist: true as const } }
                        : row.kind === "awful"
                          ? { range: row.range, blue: { awful: true as const } }
                          : row.kind === "saber"
                            ? { self: true as const, radius: row.radius, blue: { saber: true as const } }
                            : row.kind === "jetta"
                              ? { range: row.range, blue: { jetta: true as const } }
                              : row.kind === "ice"
                                ? { self: true as const, radius: row.radius, blue: { ice: true as const } }
                                : row.kind === "destruct"
                                  ? { self: true as const, radius: row.radius, blue: { destruct: true as const } }
                                  : row.kind === "roar"
                                    ? { self: true as const, radius: row.radius, blue: { roar: true as const } }
                                    : row.kind === "cold"
                                      ? { self: true as const, radius: row.radius, blue: { cold: true as const } }
                                      : row.kind === "hold"
                                        ? { range: row.range, blue: { hold: true as const } }
                                        : row.kind === "feather"
                                          ? { self: true as const, blue: { feather: true as const } }
                                          : row.kind === "penance"
                                            ? { range: row.range, blue: { penance: true as const } }
                                            : row.kind === "mael"
                                              ? { self: true as const, radius: row.radius, blue: { mael: true as const } }
                                              : row.kind === "eyes"
                                                ? { range: row.range, blue: { eyes: true as const } }
                                                : row.kind === "needles"
                                                  ? { self: true as const, radius: row.radius, blue: { needles: true as const } }
                                                  : row.kind === "tickle"
                                                    ? { range: row.range, blue: { tickle: true as const } }
                                                    : row.kind === "yawn"
                                                      ? { self: true as const, radius: row.radius, blue: { yawn: true as const } }
                                                      : row.kind === "trunk"
                                                        ? { range: row.range, blue: { trunk: true as const } }
                                                        : row.kind === "infra"
                                                          ? { range: row.range, blue: { infra: true as const } }
                                                          : row.kind === "spray"
                                                            ? { range: row.range, blue: { spray: true as const } }
                                                            : row.kind === "ooze"
                                                              ? { range: row.range, blue: { ooze: true as const } }
                                                              : row.kind === "hide"
                                                                ? { self: true as const, radius: row.radius, blue: { hide: true as const } }
                                                                : row.kind === "enerv"
                                                                  ? { self: true as const, radius: row.radius, blue: { enerv: true as const } }
                                                                  : row.kind === "warmup"
                                                                    ? { self: true as const, blue: { warmup: true as const } }
                                                                    : row.kind === "spit"
                                                                      ? { range: row.range, blue: { spit: true as const } }
                                                                      : row.kind === "gorge"
                                                                        ? { range: row.range, blue: { gorge: true as const } }
                                                                        : row.kind === "amp"
                                                                          ? { self: true as const, blue: { amp: true as const } }
                                                                          : row.kind === "lowing"
                                                                            ? { self: true as const, radius: row.radius, blue: { lowing: true as const } }
                                                                            : row.kind === "triumph"
                                                                              ? { self: true as const, blue: { triumph: true as const } }
                                                                              : row.kind === "saline"
                                                                                ? { self: true as const, blue: { saline: true as const } }
                                                                                : row.kind === "shift"
                                                                                  ? { self: true as const, radius: row.radius, blue: { shift: true as const } }
                                                                                  : row.kind === "hammer"
                                                                                    ? { range: row.range, blue: { hammer: true as const } }
                                                                                    : row.kind === "reactor"
                                                                                      ? { self: true as const, blue: { reactor: true as const } }
                                                                                      : row.kind === "exuv"
                                                                                        ? { self: true as const, blue: { exuv: true as const } }
                                        : row.kind === "physical" && row.radius != null
                        ? { self: true as const, radius: row.radius, blue: { physical: true as const } }
                        : { range: row.range, blue: { physical: true as const } }),
}));

const CATALOG: readonly Spell[] = [...SPELLS, ...ELEMENTAL_SPELLS, ...GEOMANCY_SPELLS, ...CURE_SPELLS, ...CURAGA_SPELLS, STONESKIN_SPELL, ...VEIL_SPELLS, ...WARD_SPELLS, ...ENSPELL_SPELLS, ...NA_SPELLS, ESUNA_SPELL, SACRIFICE_SPELL, ERASE_SPELL, ...RAISE_SPELLS, ...RERAISE_SPELLS, ...DIVINE_SPELLS, ...WHITE_ENFEEBLE_SPELLS, CURA_SPELL, ...BARRIER_SPELLS, ...MAINTAIN_SPELLS, ...BAR_SPELLS, ...RUN_BAR_SPELLS, FOIL_SPELL, ...SONG_SPELLS, ...STORM_SPELLS, KLIMAFORM_SPELL, ...SUMMON_SPELLS, ...BLUE_MAGIC_SPELLS];

/** Level this job must reach. Jobs with their own number use that, not the shared level. */
export function spellLevel(spell: Spell, job: JobId): number {
  return spell.jobLevel?.[job] ?? spell.level;
}

/**
 * The list tag when Scholar is the only equipped job that knows the spell.
 * A main or support job that already learned it casts it with no addendum, so the tag stays off.
 * The word matches the magic list: (Add.: Black): Sleep.
 */
export function spellListName(spell: Spell, main: JobId, sub: JobId | null, mainLevel: number, subLevel: number): string {
  if (spell.addendum !== "white" && spell.addendum !== "black") return spell.name;
  const schLevel = main === "SCH" ? mainLevel : sub === "SCH" ? subLevel : 0;
  if (schLevel < spellLevel(spell, "SCH")) return spell.name;
  for (const job of spell.jobs) {
    if (job === "SCH") continue;
    const lv = job === main ? mainLevel : job === sub ? subLevel : 0;
    if (lv >= spellLevel(spell, job)) return spell.name;
  }
  const tag = spell.addendum === "white" ? "(Add.: White)" : "(Add.: Black)";
  return `${tag}: ${spell.name}`;
}

/**
 * Conserve MP's reduced cost. The numerator is an even 8, 10, 12, or 14,
 * chosen by `slot` 0..3. 16 is not a result, so a proc always costs less.
 */
export function conserveMpCost(cost: number, slot: number): number {
  const n = 8 + (((slot % 4) + 4) % 4) * 2;
  return Math.floor((cost * n) / 16);
}

export function isBlueMagic(spell: Spell): boolean {
  return spell.school === "blue";
}

/**
 * True when the spell is on the character's list.
 * `levels` is each job's own level, main or sub. Blue Magic also has to
 * be in `blueSet`, and `main` must be Blue Mage when it is passed.
 * The level alone never unlocks it. A support job does not cast it.
 */
export function spellUnlocked(
  spell: Spell,
  levels: Partial<Record<JobId, number>>,
  blueSet?: ReadonlySet<string>,
  main?: JobId,
): boolean {
  const reached = spell.jobs.some((job) => (levels[job] ?? 0) >= spellLevel(spell, job));
  if (!reached) return false;
  if (isBlueMagic(spell)) {
    if (main != null && main !== "BLU") return false;
    return blueSet?.has(spell.name) ?? false;
  }
  if (spell.colure?.side === "geo" && main != null && main !== "GEO") return false;
  return true;
}

export function spellsKnown(
  levels: Partial<Record<JobId, number>>,
  blueSet?: ReadonlySet<string>,
  main?: JobId,
): Spell[] {
  return CATALOG.filter((spell) => spellUnlocked(spell, levels, blueSet, main));
}

export function spellByName(name: string): Spell | undefined {
  return CATALOG.find((spell) => spell.name === name);
}

/**
 * Retail elements, in the client order fire through dark.
 * Black magic uses one chant for every elemental nuke. The element
 * chooses the gather and the release, not a second body clip.
 * Enfeebling black magic uses that same hands-at-the-face loop.
 * Flash and Repose are divine. They use the white-magic cast, not this loop.
 * Ninjutsu is a different cast and is not an elemental nuke.
 */
export type SpellElement = "fire" | "ice" | "wind" | "earth" | "thunder" | "water" | "light" | "dark";

export type ElementMote = "ember" | "crystal" | "streak" | "dust" | "spark" | "drop" | "gleam" | "mote";

export type ElementLook = {
  element: SpellElement;
  /** Main particle color. */
  color: number;
  /** Brighter accent so the mote still reads on the grass. */
  accent: number;
  mote: ElementMote;
};

/** Classic reads: ochre dust, pale crystals, embers, green streaks, violet sparks, droplets, gold, purple-black. */
export const ELEMENT_LOOK: Record<SpellElement, ElementLook> = {
  fire: { element: "fire", color: 0xe05a1a, accent: 0xffc14a, mote: "ember" },
  ice: { element: "ice", color: 0xb8e4ff, accent: 0xf4fbff, mote: "crystal" },
  wind: { element: "wind", color: 0x7dff9a, accent: 0xe8ffd4, mote: "streak" },
  earth: { element: "earth", color: 0x6b3e1f, accent: 0xe6c36a, mote: "dust" },
  thunder: { element: "thunder", color: 0x9b5cff, accent: 0xf0e6ff, mote: "spark" },
  water: { element: "water", color: 0x3a7ec8, accent: 0x9fd4ff, mote: "drop" },
  light: { element: "light", color: 0xf4ecd4, accent: 0xfff6d0, mote: "gleam" },
  dark: { element: "dark", color: 0x3a1848, accent: 0xb07cff, mote: "mote" },
};

/** Longer prefixes first so Stonega is not read as something else later. Helix names are their own elements. */
const ELEMENT_PREFIX: readonly [string, SpellElement][] = [
  ["pyrohelix", "fire"],
  ["cryohelix", "ice"],
  ["anemohelix", "wind"],
  ["geohelix", "earth"],
  ["ionohelix", "thunder"],
  ["hydrohelix", "water"],
  ["luminohelix", "light"],
  ["noctohelix", "dark"],
  ["blazespikes", "fire"],
  ["icespikes", "ice"],
  ["shockspikes", "thunder"],
  ["burn", "fire"],
  ["frost", "ice"],
  ["choke", "wind"],
  ["rasp", "earth"],
  ["drown", "water"],
  ["shock", "thunder"],
  ["blind", "dark"],
  ["bind", "ice"],
  ["dispel", "dark"],
  ["gravity", "wind"],
  ["inundation", "light"],
  ["dia", "light"],
  ["poison", "water"],
  ["sleepga", "dark"],
  ["sleep", "dark"],
  ["stonega", "earth"],
  ["stoneja", "earth"],
  ["stone", "earth"],
  ["quake", "earth"],
  ["blizzara", "ice"],
  ["blizzaga", "ice"],
  ["blizzaja", "ice"],
  ["blizzard", "ice"],
  ["freeze", "ice"],
  ["firaga", "fire"],
  ["firaja", "fire"],
  ["fira", "fire"],
  ["flare", "fire"],
  ["fire", "fire"],
  ["aera", "wind"],
  ["aeroga", "wind"],
  ["aeroja", "wind"],
  ["aero", "wind"],
  ["tornado", "wind"],
  ["thundara", "thunder"],
  ["thundaga", "thunder"],
  ["thundaja", "thunder"],
  ["thunder", "thunder"],
  ["burst", "thunder"],
  ["waterga", "water"],
  ["waterja", "water"],
  ["water", "water"],
  ["flood", "water"],
  ["banish", "light"],
  ["holy", "light"],
  ["comet", "dark"],
];

/** Name only. "Stone II" and "Blizzard IV" both resolve. Unknown names do not. */
export function elementFromName(name: string): SpellElement | null {
  const key = name.toLowerCase().replace(/[^a-z]/g, "");
  if (key === "blindna" || key === "poisona" || key === "paralyna" || key === "silena" || key === "stona" || key === "viruna" || key === "cursna" || key === "esuna" || key === "sacrifice") {
    return null;
  }
  for (const [prefix, element] of ELEMENT_PREFIX) {
    if (key.startsWith(prefix)) return element;
  }
  return null;
}

/**
 * Element of a castable elemental nuke.
 * Other schools stay null, so a ninjutsu name never starts this chant.
 */
export function spellElement(spell: Spell): SpellElement | null {
  if (spell.school !== "elemental" && spell.school !== "enfeebling") return null;
  return elementFromName(spell.name);
}

/** Element gathered while casting. Spikes use it too. Ninjutsu still does not. */
export function castElement(spell: Spell): SpellElement | null {
  if (spell.colure) return geoElement(spell.colure.effect);
  if (spell.storm) return spell.storm.element;
  if (spell.klimaform) return "dark";
  if (spell.enspell) return spell.enspell.element;
  if (spell.cure || spell.curaga || spell.cura || spell.na || spell.esuna || spell.sacrifice || spell.raise || spell.reraise) return "light";
  if (spell.barrier || spell.regen || spell.auspice || spell.refresh) return "light";
  if (spell.bar) return spell.bar.element;
  if (spell.haste || spell.blink) return "wind";
  if (spell.aquaveil) return "water";
  if (spell.phalanx || spell.reprisal) return "light";
  if (spell.erase) return "light";
  if (spell.enfeeble === "Slow" || spell.enfeeble === "Slow II") return "earth";
  if (spell.enfeeble === "Paralyze" || spell.enfeeble === "Paralyze II") return "ice";
  if (spell.enfeeble === "Silence") return "wind";
  if (spell.enfeeble === "Gravity") return "wind";
  if (spell.enfeeble === "Dispel") return "dark";
  if (spell.enfeeble === "Distract") return "ice";
  if (spell.enfeeble === "Frazzle") return "dark";
  if (spell.enfeeble === "Inundation") return "light";
  if (spell.enfeeble === "Dia" || spell.enfeeble === "Dia II" || spell.enfeeble === "Dia III" || spell.enfeeble === "Diaga") return "light";
  if (spell.enfeeble === "Poison" || spell.enfeeble === "Poison II" || spell.enfeeble === "Poisonga") return "water";
  if (spell.enfeeble === "Bio" || spell.enfeeble === "Bio II" || spell.enfeeble === "Bio III") return "dark";
  if (spell.enfeeble === "Stun") return "thunder";
  if (spell.school === "divine" || spell.banish || spell.holy || spell.flash || spell.repose) return "light";
  if (spell.stoneskin) return "earth";
  if (spell.spike === "Blaze Spikes") return "fire";
  if (spell.spike === "Ice Spikes") return "ice";
  if (spell.spike === "Shock Spikes") return "thunder";
  if (spell.siphon) return "dark";
  if (spell.warp) return "light";
  return spellElement(spell);
}

export type ToolCharge = {
  /** Specific tool the spell asks for. */
  tool: string;
  /** Present only for a Ninja main, and only if the specific tool is absent. */
  substitute: string | null;
  /** What this cast spends. Zero while ninjutsu consumption is off. */
  count: number;
  /** What a cast spends once consumption is turned on. */
  retail: number;
};

/**
 * Tool line for a cast. Non-ninjutsu returns null.
 * Pass `consume` to preview the other side of the switch without flipping it.
 */
export function toolsConsumed(
  spell: Spell,
  opts?: { mainJob?: JobId; consume?: boolean },
): ToolCharge | null {
  if (spell.school !== "ninjutsu" || !spell.tool) return null;
  const consume = opts?.consume ?? NINJUTSU_CONSUMES_TOOLS;
  const main = opts?.mainJob === "NIN";
  return {
    tool: spell.tool.name,
    substitute: main ? spell.tool.substitute : null,
    count: consume ? spell.tool.count : 0,
    retail: spell.tool.count,
  };
}

export type NaSpell = NonNullable<Spell["na"]>;
export type CleanseSpell = NaSpell | "Esuna" | "Sacrifice";

/**
 * Statuses a -na spell is allowed to take off a party member.
 * Mute is on Silena's description and is not removed. BG's tested note says so.
 * Zombie and Haunt are curse effects Cursna does not remove.
 * Doom is not in this list. Cursna rolls it on its own.
 */
export const NA_REMOVES: Record<NaSpell, readonly AilmentName[]> = {
  Poisona: ["Poison"],
  Paralyna: ["Paralysis"],
  Blindna: ["Blindness"],
  Silena: ["Silence"],
  Stona: ["Petrification"],
  Viruna: ["Disease", "Plague"],
  Cursna: ["Curse", "Bane"],
};

/** Esuna and Sacrifice, with no stance. The caster's own copy is required for Esuna. */
export const ESUNA_BASE: readonly AilmentName[] = ["Poison", "Paralysis", "Blindness", "Disease", "Plague", "Curse", "Bane"];

/**
 * Effects BG names on Erase. "Various other" is not guessed.
 * Attribute and status downs are the named category, matched by the " Down" ending too.
 * Esuna never takes the songs, even under Afflatus Misery. Sacrifice under Afflatus Solace can.
 */
export const ERASE_NAMED: readonly AilmentName[] = [
  "Bio",
  "Dia",
  "Gravity",
  "Flash",
  "Addle",
  "Slow",
  "Helix",
  "Burn",
  "Choke",
  "Drown",
  "Frost",
  "Rasp",
  "Shock",
  "Elegy",
  "Requiem",
  "STR Down",
  "DEX Down",
  "VIT Down",
  "AGI Down",
  "INT Down",
  "MND Down",
  "CHR Down",
  "Attack Down",
  "Defense Down",
  "Accuracy Down",
  "Evasion Down",
  "Magic Atk. Down",
  "Magic Def. Down",
  "Magic Acc. Down",
  "Magic Evasion Down",
];

const ERASE_SONGS = new Set<AilmentName>(["Elegy", "Requiem"]);

export type AilmentName =
  | "Poison"
  | "Paralysis"
  | "Blindness"
  | "Silence"
  | "Petrification"
  | "Disease"
  | "Plague"
  | "Curse"
  | "Bane"
  | "Doom"
  | "Curse (Recovery)"
  | "Bio"
  | "Dia"
  | "Gravity"
  | "Flash"
  | "Addle"
  | "Slow"
  | "Helix"
  | "Burn"
  | "Choke"
  | "Drown"
  | "Frost"
  | "Rasp"
  | "Shock"
  | "Elegy"
  | "Requiem"
  | "STR Down"
  | "DEX Down"
  | "VIT Down"
  | "AGI Down"
  | "INT Down"
  | "MND Down"
  | "CHR Down"
  | "Attack Down"
  | "Defense Down"
  | "Accuracy Down"
  | "Evasion Down"
  | "Magic Atk. Down"
  | "Magic Def. Down"
  | "Magic Acc. Down"
  | "Magic Evasion Down";

export type PlayerAilment = { name: AilmentName; left: number; power?: number };

/** Doom removal. Base is 10 + Healing Magic / 30. Cursna+ gear multiplies it. None of that gear is equipped. */
export function cursnaDoomRate(healing: number, cursnaPlus = 0): number {
  return (10 + Math.max(0, healing) / 30) * (1 + cursnaPlus / 100);
}

export function cursnaDoomLands(healing: number, roll: number, cursnaPlus = 0): boolean {
  return roll * 100 < cursnaDoomRate(healing, cursnaPlus);
}

export function esunaNames(misery: boolean): readonly AilmentName[] {
  if (!misery) return ESUNA_BASE;
  return [...ESUNA_BASE, ...ERASE_NAMED.filter((name) => !ERASE_SONGS.has(name)), "Curse (Recovery)"];
}

export function sacrificeNames(solace: boolean): readonly AilmentName[] {
  if (!solace) return ESUNA_BASE;
  return [...ESUNA_BASE, ...ERASE_NAMED, "Curse (Recovery)"];
}

/** Earliest matching statuses, up to limit. Retail does not publish which one is chosen. */
export function takeAilments(
  list: readonly PlayerAilment[],
  names: readonly AilmentName[],
  limit: number,
): { kept: PlayerAilment[]; taken: PlayerAilment[] } {
  const want = new Set<AilmentName>(names);
  const taken: PlayerAilment[] = [];
  const kept: PlayerAilment[] = [];
  for (const row of list) {
    if (taken.length < limit && want.has(row.name)) taken.push(row);
    else kept.push(row);
  }
  return { kept, taken };
}

/**
 * Moves statuses off someone else and onto the caller.
 * The same person is not a transfer. Silence and Petrification are not in the set.
 */
export function sacrificeTransfer(
  donor: readonly PlayerAilment[],
  solace: boolean,
  samePerson: boolean,
): { kept: PlayerAilment[]; taken: PlayerAilment[] } | null {
  if (samePerson) return null;
  return takeAilments(donor, sacrificeNames(solace), solace ? 7 : 1);
}

function joinAilments(rows: readonly PlayerAilment[]): string {
  const names = rows.map((row) => row.name);
  if (names.length <= 1) return names[0] ?? "";
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;
}

/** What the completed cast does to your own status list. Sacrifice has no other party member here. */
export function resolveCleanse(
  spell: Spell,
  ailments: readonly PlayerAilment[],
  opts: { misery: boolean; solace: boolean; healing: number; roll: number },
): { ailments: PlayerAilment[]; text: string } {
  if (spell.sacrifice) {
    return { ailments: ailments.map((row) => ({ ...row })), text: "No effect." };
  }
  if (spell.esuna) {
    const result = takeAilments(ailments, esunaNames(opts.misery), opts.misery ? 2 : 1);
    if (result.taken.length === 0) return { ailments: result.kept, text: "No effect." };
    return { ailments: result.kept, text: `Esuna removes ${joinAilments(result.taken)}.` };
  }
  if (spell.na) {
    let result = takeAilments(ailments, NA_REMOVES[spell.na], NA_REMOVES[spell.na].length);
    if (spell.na === "Cursna" && result.kept.some((row) => row.name === "Doom") && cursnaDoomLands(opts.healing, opts.roll)) {
      const doom = takeAilments(result.kept, ["Doom"], 1);
      result = { kept: doom.kept, taken: [...result.taken, ...doom.taken] };
    }
    if (result.taken.length === 0) return { ailments: result.kept, text: "No effect." };
    return { ailments: result.kept, text: `${spell.na} removes ${joinAilments(result.taken)}.` };
  }
  if (spell.erase) {
    const result = takeAilments(ailments, ERASE_NAMED, 1);
    if (result.taken.length === 0) return { ailments: result.kept, text: "No effect." };
    return { ailments: result.kept, text: `Erase removes ${joinAilments(result.taken)}.` };
  }
  return { ailments: ailments.map((row) => ({ ...row })), text: "No effect." };
}

export type SpellFocus = "enemy" | "self" | "npc" | "none";

/**
 * Who the spell is allowed to land on.
 * Client target bits: Curaga is Self and Party only. Cure also lists Enemy so it
 * can strike undead; a living monster is not a Cure target. Stone is Enemy only.
 * Raise's bit is a dead player. This yard's only player is you, so that bit is `deadPlayer`.
 * A spell that can land on you falls back to you. Anything else is refused.
 */
export function spellAim(spell: Spell, focus: SpellFocus, enemyUndead: boolean, deadPlayer = false): "self" | "enemy" | null {
  if (spell.raise) return deadPlayer ? "self" : null;
  if (spell.blue && "physical" in spell.blue) return spell.self ? "self" : focus === "enemy" ? "enemy" : null;
  if (spell.blue && "breath" in spell.blue && spell.self) return "self";
  if (spell.blue && "feather" in spell.blue) return "self";
  if (spell.blue && ("silence" in spell.blue || "magical" in spell.blue || "orb" in spell.blue || "breath" in spell.blue || "ray" in spell.blue || "digest" in spell.blue || "kiss" in spell.blue || "blitz" in spell.blue || "awful" in spell.blue || "jetta" in spell.blue || "hold" in spell.blue || "penance" in spell.blue || "eyes" in spell.blue || "tickle" in spell.blue || "trunk" in spell.blue || "infra" in spell.blue || "spray" in spell.blue || "ooze" in spell.blue || "spit" in spell.blue || "gorge" in spell.blue || "hammer" in spell.blue)) return focus === "enemy" ? "enemy" : null;
  if (spell.blue && "cure" in spell.blue) return focus === "enemy" ? null : "self";
  if (spell.blue && ("flash" in spell.blue || "spikes" in spell.blue || "mantle" in spell.blue || "song" in spell.blue || "breeze" in spell.blue || "cocoon" in spell.blue || "metal" in spell.blue || "refuel" in spell.blue || "memento" in spell.blue || "sand" in spell.blue || "pollen" in spell.blue || "sound" in spell.blue || "gas" in spell.blue || "geist" in spell.blue || "saber" in spell.blue || "ice" in spell.blue || "destruct" in spell.blue || "roar" in spell.blue || "cold" in spell.blue || "needles" in spell.blue || "yawn" in spell.blue || "hide" in spell.blue || "enerv" in spell.blue || "warmup" in spell.blue || "amp" in spell.blue || "lowing" in spell.blue || "triumph" in spell.blue || "saline" in spell.blue || "shift" in spell.blue || "reactor" in spell.blue || "exuv" in spell.blue)) return "self";
  if (spell.summon) {
    if (summonById(spell.summon)?.family === "burst") return focus === "enemy" ? "enemy" : null;
    return "self";
  }
  if (spell.song) {
    if (spell.song.hostile) return focus === "enemy" ? "enemy" : null;
    return "self";
  }
  if (spell.colure?.side === "indi") return "self";
  if (spell.colure?.side === "geo") return focus === "enemy" ? "enemy" : null;
  const ninHostile =
    spell.nin != null &&
    (spell.nin.kind === "nuke" ||
      spell.nin.kind === "huton" ||
      spell.nin.kind === "blind" ||
      spell.nin.kind === "slow" ||
      spell.nin.kind === "poison" ||
      spell.nin.kind === "paralyze");
  if (spell.nuke && spell.self === true) return "self";
  const enemyOk =
    focus === "enemy" &&
    (spell.cure != null
      ? enemyUndead
      : spell.nuke != null || spell.helix === true || spell.debuff != null || spell.enfeeble != null || spell.siphon != null || spell.banish != null || spell.holy === true || spell.flash === true || spell.repose === true || ninHostile);
  if (enemyOk) return "enemy";
  if (spell.self === true || spell.storm != null || spell.barrier != null || spell.regen != null || spell.haste != null || spell.refresh != null || spell.auspice != null || spell.aquaveil != null || spell.blink != null || spell.erase === true || spell.bar != null || spell.cure != null || spell.curaga != null || spell.cura === true || spell.na != null || spell.esuna === true || spell.sacrifice === true || spell.reraise != null || (spell.nin != null && !ninHostile)) return "self";
  return null;
}

export function assertSpells(): void {
  const tonko = SPELLS.find((spell) => spell.name === "Tonko: Ichi");
  const katon = SPELLS.find((spell) => spell.name === "Katon: San");
  if (!tonko || !katon) throw new Error("ninjutsu catalog");
  if (!spellUnlocked(tonko, { NIN: 9 }) || spellUnlocked(tonko, { NIN: 8 })) throw new Error("Tonko unlock");
  if (spellUnlocked(tonko, { WAR: 75 })) throw new Error("Warrior learned a spell");
  if (!spellUnlocked(katon, { NIN: 75 }) || spellUnlocked(katon, { NIN: 74 })) throw new Error("Katon: San unlock");
  const katonIchi = SPELLS.find((spell) => spell.name === "Katon: Ichi");
  const utsuNi = SPELLS.find((spell) => spell.name === "Utsusemi: Ni");
  if (!katonIchi || katonIchi.cast !== 4 || katonIchi.recast !== 30 || katonIchi.range !== 17 || katonIchi.nin?.weaken !== "water" || katonIchi.mp !== 0) {
    throw new Error("Katon: Ichi card");
  }
  if (!utsuNi || utsuNi.cast !== 1.5 || utsuNi.recast !== 45 || utsuNi.nin?.kind !== "shadow" || utsuNi.tool?.name !== "Shihei") {
    throw new Error("Utsusemi: Ni card");
  }
  if (SPELLS.find((spell) => spell.name === "Tonko: Ichi")?.nin?.kind !== "invisible") throw new Error("Tonko is Invisible");
  const tonkoNi = SPELLS.find((spell) => spell.name === "Tonko: Ni");
  if (!tonkoNi || tonkoNi.cast !== 1.5 || tonkoNi.recast !== 45 || tonkoNi.nin?.area || tonkoNi.nin?.kind !== "invisible") {
    throw new Error("Tonko: Ni card");
  }
  if (SPELLS.find((spell) => spell.name === "Monomi: Ichi")?.nin?.kind !== "sneak") throw new Error("Monomi is Sneak");
  if (spellsKnown({ NIN: 75 }).length !== SPELLS.length) throw new Error("level 75 knows every listed spell");
  if (spellsKnown({ NIN: 1 }).length !== 0 || spellsKnown({ WAR: 75 }).length !== 0) throw new Error("empty spell list");
  const brdSongs = spellsKnown({ BRD: 75 }).filter((spell) => spell.song);
  if (brdSongs.length !== 76) throw new Error(`BRD songs ${brdSongs.length}`);
  const minuet = spellByName("Valor Minuet");
  const lullaby = spellByName("Foe Lullaby");
  if (!minuet?.song || minuet.mp !== 0 || minuet.self !== true || minuet.radius != null || spellAim(minuet, "none", false) !== "self" || spellAim(minuet, "enemy", false) !== "self") {
    throw new Error("Valor Minuet aim");
  }
  if (!lullaby?.song?.hostile || lullaby.mp !== 0 || lullaby.range !== 12 || spellAim(lullaby, "enemy", false) !== "enemy" || spellAim(lullaby, "none", false) !== null) {
    throw new Error("Foe Lullaby aim");
  }
  if (brdSongs.some((spell) => spell.mp !== 0)) throw new Error("song mp");
  if (spellsKnown({ WAR: 75, BRD: 37 }).some((spell) => spell.song && spell.level > 37)) throw new Error("subjob songs");

  const blue: Spell = { name: "Pollen", school: "blue", level: 1, jobs: ["WHM"] };
  const cure: Spell = { name: "Cure", school: "healing", level: 1, jobs: ["WHM"] };
  if (spellUnlocked(cure, { WHM: 1 }) !== true || spellUnlocked(cure, { WHM: 0 })) throw new Error("Cure unlock");
  if (spellUnlocked(blue, { WHM: 75 })) throw new Error("Blue Magic unlocked by level");
  if (!spellUnlocked(blue, { WHM: 1 }, new Set(["Pollen"]))) throw new Error("set Blue Magic");
  if (spellUnlocked(blue, { WHM: 0 }, new Set(["Pollen"]))) throw new Error("Blue Magic under its level");
  const kick = spellByName("Foot Kick");
  if (!kick || kick.school !== "blue" || kick.mp !== 5 || kick.cast !== 0.5 || kick.recast !== 6.5 || kick.range !== 4.5 || kick.jobs.join(",") !== "BLU") {
    throw new Error("Foot Kick catalog");
  }
  if (spellUnlocked(kick, { BLU: 75 })) throw new Error("Foot Kick unlocked by level");
  if (!spellUnlocked(kick, { BLU: 1 }, new Set(["Foot Kick"]), "BLU")) throw new Error("set Foot Kick");
  if (spellUnlocked(kick, { WAR: 75, BLU: 37 }, new Set(["Foot Kick"]), "WAR")) throw new Error("subjob Foot Kick");
  if (spellAim(kick, "enemy", false) !== "enemy" || spellAim(kick, "self", false) !== null) throw new Error("Foot Kick aim");
  const carrot = spellByName("Wild Carrot");
  if (!carrot || carrot.school !== "blue" || carrot.mp !== 37 || carrot.cast !== 2.5 || carrot.recast !== 6 || carrot.range !== 20 || carrot.level !== 30 || carrot.jobs.join(",") !== "BLU" || !carrot.blue || !("cure" in carrot.blue)) {
    throw new Error("Wild Carrot catalog");
  }
  if (spellUnlocked(carrot, { BLU: 75 })) throw new Error("Wild Carrot unlocked by level");
  if (!spellUnlocked(carrot, { BLU: 30 }, new Set(["Wild Carrot"]), "BLU")) throw new Error("set Wild Carrot");
  if (spellUnlocked(carrot, { WAR: 75, BLU: 37 }, new Set(["Wild Carrot"]), "WAR")) throw new Error("subjob Wild Carrot");
  if (spellAim(carrot, "enemy", false) !== null || spellAim(carrot, "enemy", true) !== null || spellAim(carrot, "self", false) !== "self" || spellAim(carrot, "none", false) !== "self" || spellAim(carrot, "npc", false) !== "self") {
    throw new Error("Wild Carrot aim");
  }
  const burst = spellByName("Actinic Burst");
  if (!burst || burst.school !== "blue" || burst.mp !== 24 || burst.cast !== 0.5 || burst.recast !== 60 || burst.level !== 74 || burst.radius !== 10 || burst.self !== true || burst.macc !== 200 || !burst.blue || !("flash" in burst.blue)) {
    throw new Error("Actinic Burst catalog");
  }
  if (spellUnlocked(burst, { BLU: 75 })) throw new Error("Actinic Burst unlocked by level");
  if (!spellUnlocked(burst, { BLU: 74 }, new Set(["Actinic Burst"]), "BLU")) throw new Error("set Actinic Burst");
  if (spellUnlocked(burst, { BLU: 73 }, new Set(["Actinic Burst"]), "BLU")) throw new Error("Actinic Burst under 74");
  if (spellUnlocked(burst, { WAR: 75, BLU: 37 }, new Set(["Actinic Burst"]), "WAR")) throw new Error("subjob Actinic Burst");
  if (spellAim(burst, "enemy", false) !== "self" || spellAim(burst, "self", false) !== "self" || spellAim(burst, "none", false) !== "self") {
    throw new Error("Actinic Burst aim");
  }
  const plasma = spellByName("Plasma Charge");
  if (!plasma || plasma.school !== "blue" || plasma.mp !== 24 || plasma.cast !== 3 || plasma.recast !== 60 || plasma.level !== 75 || plasma.self !== true || plasma.range != null || !plasma.blue || !("spikes" in plasma.blue)) {
    throw new Error("Plasma Charge catalog");
  }
  if (spellUnlocked(plasma, { BLU: 75 })) throw new Error("Plasma Charge unlocked by level");
  if (!spellUnlocked(plasma, { BLU: 75 }, new Set(["Plasma Charge"]), "BLU")) throw new Error("set Plasma Charge");
  if (spellUnlocked(plasma, { WAR: 75, BLU: 37 }, new Set(["Plasma Charge"]), "WAR")) throw new Error("subjob Plasma Charge");
  if (spellAim(plasma, "enemy", false) !== "self" || spellAim(plasma, "none", false) !== "self") throw new Error("Plasma Charge aim");
  const eye = spellByName("Chaotic Eye");
  if (!eye || eye.school !== "blue" || eye.mp !== 13 || eye.cast !== 3 || eye.recast !== 10 || eye.level !== 32 || eye.range !== 21 || eye.self === true || !eye.blue || !("silence" in eye.blue)) {
    throw new Error("Chaotic Eye catalog");
  }
  if (spellUnlocked(eye, { BLU: 75 })) throw new Error("Chaotic Eye unlocked by level");
  if (!spellUnlocked(eye, { BLU: 32 }, new Set(["Chaotic Eye"]), "BLU")) throw new Error("set Chaotic Eye");
  if (spellUnlocked(eye, { BLU: 31 }, new Set(["Chaotic Eye"]), "BLU")) throw new Error("Chaotic Eye under 32");
  if (spellUnlocked(eye, { WAR: 75, BLU: 37 }, new Set(["Chaotic Eye"]), "WAR")) throw new Error("subjob Chaotic Eye");
  if (spellAim(eye, "enemy", false) !== "enemy" || spellAim(eye, "self", false) !== null || spellAim(eye, "none", false) !== null) {
    throw new Error("Chaotic Eye aim");
  }
  const mantle = spellByName("Zephyr Mantle");
  if (!mantle || mantle.school !== "blue" || mantle.mp !== 31 || mantle.cast !== 7 || mantle.recast !== 60 || mantle.level !== 65 || mantle.self !== true || mantle.range != null || !mantle.blue || !("mantle" in mantle.blue)) {
    throw new Error("Zephyr Mantle catalog");
  }
  if (spellUnlocked(mantle, { BLU: 75 })) throw new Error("Zephyr Mantle unlocked by level");
  if (!spellUnlocked(mantle, { BLU: 65 }, new Set(["Zephyr Mantle"]), "BLU")) throw new Error("set Zephyr Mantle");
  if (spellUnlocked(mantle, { BLU: 64 }, new Set(["Zephyr Mantle"]), "BLU")) throw new Error("Zephyr Mantle under 65");
  if (spellUnlocked(mantle, { WAR: 75, BLU: 37 }, new Set(["Zephyr Mantle"]), "WAR")) throw new Error("subjob Zephyr Mantle");
  if (spellAim(mantle, "enemy", false) !== "self" || spellAim(mantle, "none", false) !== "self") throw new Error("Zephyr Mantle aim");
  const cocoon = spellByName("Cocoon");
  if (!cocoon || cocoon.school !== "blue" || cocoon.mp !== 10 || cocoon.cast !== 1.75 || cocoon.recast !== 60 || cocoon.level !== 8 || cocoon.self !== true || cocoon.range != null || !cocoon.blue || !("cocoon" in cocoon.blue)) {
    throw new Error("Cocoon catalog");
  }
  if (spellUnlocked(cocoon, { BLU: 75 })) throw new Error("Cocoon unlocked by level");
  if (!spellUnlocked(cocoon, { BLU: 8 }, new Set(["Cocoon"]), "BLU")) throw new Error("set Cocoon");
  if (spellUnlocked(cocoon, { BLU: 7 }, new Set(["Cocoon"]), "BLU")) throw new Error("Cocoon under 8");
  if (spellUnlocked(cocoon, { WAR: 75, BLU: 37 }, new Set(["Cocoon"]), "WAR")) throw new Error("subjob Cocoon");
  if (spellAim(cocoon, "enemy", false) !== "self" || spellAim(cocoon, "none", false) !== "self") throw new Error("Cocoon aim");
  const refuel = spellByName("Refueling");
  if (!refuel || refuel.school !== "blue" || refuel.mp !== 29 || refuel.cast !== 1.5 || refuel.recast !== 30 || refuel.level !== 48 || refuel.self !== true || refuel.range != null || !refuel.blue || !("refuel" in refuel.blue)) {
    throw new Error("Refueling catalog");
  }
  if (spellUnlocked(refuel, { BLU: 75 })) throw new Error("Refueling unlocked by level");
  if (!spellUnlocked(refuel, { BLU: 48 }, new Set(["Refueling"]), "BLU")) throw new Error("set Refueling");
  if (spellUnlocked(refuel, { BLU: 47 }, new Set(["Refueling"]), "BLU")) throw new Error("Refueling under 48");
  if (spellUnlocked(refuel, { WAR: 75, BLU: 37 }, new Set(["Refueling"]), "WAR")) throw new Error("subjob Refueling");
  if (spellAim(refuel, "enemy", false) !== "self" || spellAim(refuel, "none", false) !== "self") throw new Error("Refueling aim");
  const breeze = spellByName("Healing Breeze");
  if (!breeze || breeze.school !== "blue" || breeze.mp !== 55 || breeze.cast !== 4.5 || breeze.recast !== 15 || breeze.level !== 16 || breeze.radius !== 10 || breeze.self !== true || breeze.range != null || !breeze.blue || !("breeze" in breeze.blue)) {
    throw new Error("Healing Breeze catalog");
  }
  if (spellUnlocked(breeze, { BLU: 75 })) throw new Error("Healing Breeze unlocked by level");
  if (!spellUnlocked(breeze, { BLU: 16 }, new Set(["Healing Breeze"]), "BLU")) throw new Error("set Healing Breeze");
  if (spellUnlocked(breeze, { BLU: 15 }, new Set(["Healing Breeze"]), "BLU")) throw new Error("Healing Breeze under 16");
  if (spellUnlocked(breeze, { WAR: 75, BLU: 37 }, new Set(["Healing Breeze"]), "WAR")) throw new Error("subjob Healing Breeze");
  if (spellAim(breeze, "enemy", false) !== "self" || spellAim(breeze, "none", false) !== "self") throw new Error("Healing Breeze aim");
  const song = spellByName("Sheep Song");
  if (!song || song.school !== "blue" || song.mp !== 22 || song.cast !== 3 || song.recast !== 60 || song.level !== 16 || song.radius !== 6 || song.self !== true || song.range != null || !song.blue || !("song" in song.blue)) {
    throw new Error("Sheep Song catalog");
  }
  if (spellUnlocked(song, { BLU: 75 })) throw new Error("Sheep Song unlocked by level");
  if (!spellUnlocked(song, { BLU: 16 }, new Set(["Sheep Song"]), "BLU")) throw new Error("set Sheep Song");
  if (spellUnlocked(song, { BLU: 15 }, new Set(["Sheep Song"]), "BLU")) throw new Error("Sheep Song under 16");
  if (spellUnlocked(song, { WAR: 75, BLU: 37 }, new Set(["Sheep Song"]), "WAR")) throw new Error("subjob Sheep Song");
  if (spellAim(song, "enemy", false) !== "self" || spellAim(song, "none", false) !== "self") throw new Error("Sheep Song aim");
  const dance = spellByName("Battle Dance");
  if (!dance || dance.school !== "blue" || dance.mp !== 12 || dance.cast !== 1 || dance.recast !== 10 || dance.level !== 12 || dance.radius !== 10 || dance.self !== true || dance.range != null || !dance.blue || !("physical" in dance.blue)) {
    throw new Error("Battle Dance catalog");
  }
  if (spellUnlocked(dance, { BLU: 75 })) throw new Error("Battle Dance unlocked by level");
  if (!spellUnlocked(dance, { BLU: 12 }, new Set(["Battle Dance"]), "BLU")) throw new Error("set Battle Dance");
  if (spellUnlocked(dance, { BLU: 11 }, new Set(["Battle Dance"]), "BLU")) throw new Error("Battle Dance under 12");
  if (spellUnlocked(dance, { WAR: 75, BLU: 37 }, new Set(["Battle Dance"]), "WAR")) throw new Error("subjob Battle Dance");
  if (spellAim(dance, "enemy", false) !== "self" || spellAim(dance, "none", false) !== "self" || spellAim(dance, "self", false) !== "self") {
    throw new Error("Battle Dance aim");
  }
  const upper = spellByName("Uppercut");
  if (!upper || upper.school !== "blue" || upper.mp !== 31 || upper.cast !== 0.5 || upper.recast !== 17 || upper.level !== 38 || upper.range !== 4.5 || upper.self === true || upper.radius != null || !upper.blue || !("physical" in upper.blue)) {
    throw new Error("Uppercut catalog");
  }
  if (spellUnlocked(upper, { BLU: 75 })) throw new Error("Uppercut unlocked by level");
  if (!spellUnlocked(upper, { BLU: 38 }, new Set(["Uppercut"]), "BLU")) throw new Error("set Uppercut");
  if (spellUnlocked(upper, { BLU: 37 }, new Set(["Uppercut"]), "BLU")) throw new Error("Uppercut under 38");
  if (spellUnlocked(upper, { WAR: 75, BLU: 37 }, new Set(["Uppercut"]), "WAR")) throw new Error("subjob Uppercut");
  if (spellAim(upper, "enemy", false) !== "enemy" || spellAim(upper, "self", false) !== null || spellAim(upper, "none", false) !== null) {
    throw new Error("Uppercut aim");
  }
  const fruit = spellByName("Magic Fruit");
  if (!fruit || fruit.school !== "blue" || fruit.mp !== 72 || fruit.cast !== 3.5 || fruit.recast !== 6 || fruit.level !== 58 || fruit.range !== 20 || fruit.self === true || !fruit.blue || !("cure" in fruit.blue)) {
    throw new Error("Magic Fruit catalog");
  }
  if (spellUnlocked(fruit, { BLU: 75 })) throw new Error("Magic Fruit unlocked by level");
  if (!spellUnlocked(fruit, { BLU: 58 }, new Set(["Magic Fruit"]), "BLU")) throw new Error("set Magic Fruit");
  if (spellUnlocked(fruit, { BLU: 57 }, new Set(["Magic Fruit"]), "BLU")) throw new Error("Magic Fruit under 58");
  if (spellUnlocked(fruit, { WAR: 75, BLU: 37 }, new Set(["Magic Fruit"]), "WAR")) throw new Error("subjob Magic Fruit");
  if (spellAim(fruit, "enemy", false) !== null || spellAim(fruit, "enemy", true) !== null || spellAim(fruit, "self", false) !== "self" || spellAim(fruit, "none", false) !== "self" || spellAim(fruit, "npc", false) !== "self") {
    throw new Error("Magic Fruit aim");
  }
  const ball = spellByName("Cannonball");
  if (!ball || ball.school !== "blue" || ball.mp !== 66 || ball.cast !== 0.5 || ball.recast !== 28.5 || ball.level !== 70 || ball.range !== 21 || ball.self === true || ball.radius != null || !ball.blue || !("physical" in ball.blue)) {
    throw new Error("Cannonball catalog");
  }
  if (spellUnlocked(ball, { BLU: 75 })) throw new Error("Cannonball unlocked by level");
  if (!spellUnlocked(ball, { BLU: 70 }, new Set(["Cannonball"]), "BLU")) throw new Error("set Cannonball");
  if (spellUnlocked(ball, { BLU: 69 }, new Set(["Cannonball"]), "BLU")) throw new Error("Cannonball under 70");
  if (spellUnlocked(ball, { WAR: 75, BLU: 37 }, new Set(["Cannonball"]), "WAR")) throw new Error("subjob Cannonball");
  if (spellAim(ball, "enemy", false) !== "enemy" || spellAim(ball, "self", false) !== null || spellAim(ball, "none", false) !== null) {
    throw new Error("Cannonball aim");
  }
  const memento = spellByName("Memento Mori");
  if (!memento || memento.school !== "blue" || memento.mp !== 46 || memento.cast !== 3.5 || memento.recast !== 120 || memento.level !== 62 || memento.range != null || memento.self !== true || !memento.blue || !("memento" in memento.blue)) {
    throw new Error("Memento Mori catalog");
  }
  if (spellUnlocked(memento, { BLU: 75 })) throw new Error("Memento Mori unlocked by level");
  if (!spellUnlocked(memento, { BLU: 62 }, new Set(["Memento Mori"]), "BLU")) throw new Error("set Memento Mori");
  if (spellUnlocked(memento, { BLU: 61 }, new Set(["Memento Mori"]), "BLU")) throw new Error("Memento Mori under 62");
  if (spellUnlocked(memento, { WAR: 75, BLU: 37 }, new Set(["Memento Mori"]), "WAR")) throw new Error("subjob Memento Mori");
  if (spellAim(memento, "enemy", false) !== "self" || spellAim(memento, "none", false) !== "self") throw new Error("Memento Mori aim");
  const mind = spellByName("Mind Blast");
  if (!mind || mind.school !== "blue" || mind.mp !== 82 || mind.cast !== 3 || mind.recast !== 30 || mind.level !== 73 || mind.range !== 10 || mind.self === true || !mind.blue || !("magical" in mind.blue)) {
    throw new Error("Mind Blast catalog");
  }
  if (spellUnlocked(mind, { BLU: 75 })) throw new Error("Mind Blast unlocked by level");
  if (!spellUnlocked(mind, { BLU: 73 }, new Set(["Mind Blast"]), "BLU")) throw new Error("set Mind Blast");
  if (spellUnlocked(mind, { BLU: 72 }, new Set(["Mind Blast"]), "BLU")) throw new Error("Mind Blast under 73");
  if (spellUnlocked(mind, { WAR: 75, BLU: 37 }, new Set(["Mind Blast"]), "WAR")) throw new Error("subjob Mind Blast");
  if (spellAim(mind, "enemy", false) !== "enemy" || spellAim(mind, "self", false) !== null || spellAim(mind, "none", false) !== null) {
    throw new Error("Mind Blast aim");
  }
  const screech = spellByName("Sound Blast");
  const ray = spellByName("Death Ray");
  const smite = spellByName("Smite of Rage");
  const digest = spellByName("Digest");
  const pine = spellByName("Pinecone Bomb");
  if (!screech || screech.mp !== 25 || screech.cast !== 4 || screech.recast !== 30 || screech.radius !== 6 || screech.self !== true || !screech.blue || !("sound" in screech.blue) || spellAim(screech, "enemy", false) !== "self") {
    throw new Error("Sound Blast catalog");
  }
  if (!ray || ray.mp !== 49 || ray.cast !== 4.5 || ray.recast !== 29.25 || ray.range !== 12 || !ray.blue || !("ray" in ray.blue) || spellAim(ray, "enemy", false) !== "enemy" || spellAim(ray, "self", false) !== null) {
    throw new Error("Death Ray catalog");
  }
  if (!smite || smite.mp !== 28 || smite.range !== 4.5 || smite.self === true || !smite.blue || !("physical" in smite.blue) || spellAim(smite, "enemy", false) !== "enemy") {
    throw new Error("Smite of Rage catalog");
  }
  if (!digest || digest.mp !== 20 || digest.recast !== 90 || digest.range !== 3 || !digest.blue || !("digest" in digest.blue) || spellAim(digest, "enemy", false) !== "enemy" || spellAim(digest, "none", false) !== null) {
    throw new Error("Digest catalog");
  }
  if (!pine || pine.mp !== 48 || pine.recast !== 26.5 || pine.range !== 21.5 || !pine.blue || !("physical" in pine.blue) || spellAim(pine, "enemy", false) !== "enemy") {
    throw new Error("Pinecone Bomb catalog");
  }
  const kiss = spellByName("MP Drainkiss");
  const bolt = spellByName("Blitzstrahl");
  const gas = spellByName("Stinking Gas");
  const bite = spellByName("Mandibular Bite");
  const cloud = spellByName("Magnetite Cloud");
  if (!kiss || kiss.mp !== 20 || kiss.recast !== 90 || kiss.range !== 3 || !kiss.blue || !("kiss" in kiss.blue) || spellAim(kiss, "enemy", false) !== "enemy" || spellAim(kiss, "self", false) !== null) {
    throw new Error("MP Drainkiss catalog");
  }
  if (!bolt || bolt.mp !== 70 || bolt.cast !== 4.5 || bolt.recast !== 29.25 || bolt.range !== 12 || !bolt.blue || !("blitz" in bolt.blue) || spellAim(bolt, "enemy", false) !== "enemy") {
    throw new Error("Blitzstrahl catalog");
  }
  if (!gas || gas.mp !== 37 || gas.recast !== 60 || gas.radius !== 6 || gas.self !== true || !gas.blue || !("gas" in gas.blue) || spellAim(gas, "enemy", false) !== "self") {
    throw new Error("Stinking Gas catalog");
  }
  if (!bite || bite.mp !== 38 || bite.recast !== 19.25 || bite.range !== 3 || !bite.blue || !("physical" in bite.blue) || spellAim(bite, "enemy", false) !== "enemy") {
    throw new Error("Mandibular Bite catalog");
  }
  if (!cloud || cloud.mp !== 86 || cloud.recast !== 29.25 || cloud.range !== 10 || !cloud.blue || !("breath" in cloud.blue) || spellAim(cloud, "enemy", false) !== "enemy" || spellAim(cloud, "self", false) !== null) {
    throw new Error("Magnetite Cloud catalog");
  }
  if (spellUnlocked(kiss, { WAR: 75, BLU: 37 }, new Set(["MP Drainkiss", "Blitzstrahl", "Stinking Gas", "Mandibular Bite", "Magnetite Cloud"]), "WAR")) {
    throw new Error("subjob leech blue");
  }
  if (spellUnlocked(screech, { WAR: 75, BLU: 37 }, new Set(["Sound Blast", "Death Ray", "Smite of Rage", "Digest", "Pinecone Bomb"]), "WAR")) {
    throw new Error("subjob cockatrice blue");
  }
  const geist = spellByName("Geist Wall");
  const awful = spellByName("Awful Eye");
  const saber = spellByName("Blood Saber");
  const jetta = spellByName("Jettatura");
  const iceBreak = spellByName("Ice Break");
  if (!geist || geist.mp !== 35 || geist.recast !== 30 || geist.radius !== 6 || geist.self !== true || !geist.blue || !("geist" in geist.blue) || spellAim(geist, "enemy", false) !== "self") {
    throw new Error("Geist Wall catalog");
  }
  if (!awful || awful.mp !== 32 || awful.cast !== 2.5 || awful.recast !== 60 || awful.range !== 10 || !awful.blue || !("awful" in awful.blue) || spellAim(awful, "enemy", false) !== "enemy" || spellAim(awful, "none", false) !== null) {
    throw new Error("Awful Eye catalog");
  }
  if (!saber || saber.mp !== 48 || saber.recast !== 90 || saber.radius !== 6 || saber.self !== true || !saber.blue || !("saber" in saber.blue) || spellAim(saber, "enemy", false) !== "self") {
    throw new Error("Blood Saber catalog");
  }
  if (!jetta || jetta.mp !== 37 || jetta.cast !== 0.5 || jetta.recast !== 120 || jetta.range !== 9 || !jetta.blue || !("jetta" in jetta.blue) || spellAim(jetta, "enemy", false) !== "enemy" || spellAim(jetta, "self", false) !== null) {
    throw new Error("Jettatura catalog");
  }
  if (!iceBreak || iceBreak.mp !== 142 || iceBreak.cast !== 5.25 || iceBreak.recast !== 33.75 || iceBreak.radius !== 6 || iceBreak.self !== true || !iceBreak.blue || !("ice" in iceBreak.blue) || spellAim(iceBreak, "none", false) !== "self") {
    throw new Error("Ice Break catalog");
  }
  if (spellUnlocked(iceBreak, { WAR: 75, BLU: 37 }, new Set(["Geist Wall", "Awful Eye", "Blood Saber", "Jettatura", "Ice Break"]), "WAR")) {
    throw new Error("subjob lizard blue");
  }
  const boom = spellByName("Self-Destruct");
  const roar = spellByName("Frightful Roar");
  const cold = spellByName("Cold Wave");
  const hold = spellByName("Filamented Hold");
  const hecatomb = spellByName("Hecatomb Wave");
  if (!boom || boom.mp !== 100 || boom.cast !== 3.25 || boom.recast !== 21 || boom.radius !== 6 || boom.self !== true || !boom.blue || !("destruct" in boom.blue) || spellAim(boom, "none", false) !== "self") {
    throw new Error("Self-Destruct catalog");
  }
  if (!roar || roar.mp !== 32 || roar.cast !== 2 || roar.recast !== 20 || roar.radius !== 6 || roar.self !== true || !roar.blue || !("roar" in roar.blue) || spellAim(roar, "enemy", false) !== "self") {
    throw new Error("Frightful Roar catalog");
  }
  if (!cold || cold.mp !== 37 || cold.cast !== 4 || cold.recast !== 60 || cold.radius !== 6 || cold.self !== true || !cold.blue || !("cold" in cold.blue) || spellAim(cold, "none", false) !== "self") {
    throw new Error("Cold Wave catalog");
  }
  if (!hold || hold.mp !== 38 || hold.cast !== 2 || hold.recast !== 20 || hold.range !== 9 || !hold.blue || !("hold" in hold.blue) || spellAim(hold, "enemy", false) !== "enemy" || spellAim(hold, "self", false) !== null) {
    throw new Error("Filamented Hold catalog");
  }
  if (!hecatomb || hecatomb.mp !== 116 || hecatomb.cast !== 5.25 || hecatomb.recast !== 33.75 || hecatomb.range !== 10 || !hecatomb.blue || !("breath" in hecatomb.blue) || spellAim(hecatomb, "enemy", false) !== "enemy" || spellAim(hecatomb, "self", false) !== null) {
    throw new Error("Hecatomb Wave catalog");
  }
  const radiant = spellByName("Radiant Breath");
  const feather = spellByName("Feather Barrier");
  const hip = spellByName("Flying Hip Press");
  const penance = spellByName("Light of Penance");
  const scissors = spellByName("Death Scissors");
  if (!radiant || radiant.mp !== 116 || radiant.cast !== 5.25 || radiant.recast !== 33.75 || radiant.range !== 13 || radiant.self === true || !radiant.blue || !("breath" in radiant.blue) || spellAim(radiant, "enemy", false) !== "enemy" || spellAim(radiant, "self", false) !== null) {
    throw new Error("Radiant Breath catalog");
  }
  if (!feather || feather.mp !== 29 || feather.cast !== 2 || feather.recast !== 120 || feather.self !== true || feather.range != null || !feather.blue || !("feather" in feather.blue) || spellAim(feather, "none", false) !== "self") {
    throw new Error("Feather Barrier catalog");
  }
  if (!hip || hip.mp !== 125 || hip.cast !== 5.75 || hip.recast !== 34.5 || hip.radius !== 10 || hip.self !== true || hip.range != null || !hip.blue || !("breath" in hip.blue) || spellAim(hip, "enemy", false) !== "self" || spellAim(hip, "none", false) !== "self") {
    throw new Error("Flying Hip Press catalog");
  }
  if (!penance || penance.mp !== 53 || penance.cast !== 3 || penance.recast !== 60 || penance.range !== 15 || penance.self === true || !penance.blue || !("penance" in penance.blue) || spellAim(penance, "enemy", false) !== "enemy" || spellAim(penance, "self", false) !== null) {
    throw new Error("Light of Penance catalog");
  }
  if (!scissors || scissors.mp !== 51 || scissors.cast !== 0.5 || scissors.recast !== 24.5 || scissors.range !== 3 || scissors.self === true || !scissors.blue || !("physical" in scissors.blue) || spellAim(scissors, "enemy", false) !== "enemy" || spellAim(scissors, "self", false) !== null) {
    throw new Error("Death Scissors catalog");
  }
  if (spellUnlocked(scissors, { WAR: 75, BLU: 37 }, new Set(["Radiant Breath", "Feather Barrier", "Flying Hip Press", "Light of Penance", "Death Scissors"]), "WAR")) {
    throw new Error("subjob wyvern blue");
  }
  const dimension = spellByName("Dimensional Death");
  const spiral = spellByName("Spiral Spin");
  const mael = spellByName("Maelstrom");
  const eyes = spellByName("Eyes On Me");
  const seeds = spellByName("Seedspray");
  if (!dimension || dimension.mp !== 48 || dimension.cast !== 0.5 || dimension.recast !== 23.75 || dimension.range !== 3 || dimension.self === true || !dimension.blue || !("physical" in dimension.blue) || spellAim(dimension, "enemy", false) !== "enemy" || spellAim(dimension, "self", false) !== null) {
    throw new Error("Dimensional Death catalog");
  }
  if (!spiral || spiral.mp !== 39 || spiral.cast !== 4 || spiral.recast !== 45 || spiral.range !== 15 || spiral.self === true || !spiral.blue || !("physical" in spiral.blue) || spellAim(spiral, "enemy", false) !== "enemy") {
    throw new Error("Spiral Spin catalog");
  }
  if (!mael || mael.mp !== 162 || mael.cast !== 6 || mael.recast !== 39 || mael.radius !== 5 || mael.self !== true || mael.range != null || !mael.blue || !("mael" in mael.blue) || spellAim(mael, "enemy", false) !== "self" || spellAim(mael, "none", false) !== "self") {
    throw new Error("Maelstrom catalog");
  }
  if (!eyes || eyes.mp !== 112 || eyes.cast !== 4.5 || eyes.recast !== 29.25 || eyes.range !== 13 || eyes.self === true || !eyes.blue || !("eyes" in eyes.blue) || spellAim(eyes, "enemy", false) !== "enemy" || spellAim(eyes, "self", false) !== null) {
    throw new Error("Eyes On Me catalog");
  }
  if (!seeds || seeds.mp !== 61 || seeds.cast !== 4 || seeds.recast !== 35 || seeds.range !== 11.5 || seeds.self === true || !seeds.blue || !("physical" in seeds.blue) || spellAim(seeds, "enemy", false) !== "enemy") {
    throw new Error("Seedspray catalog");
  }
  const breath = spellByName("Bad Breath");
  const slam = spellByName("Body Slam");
  const needles = spellByName("1000 Needles");
  const spinal = spellByName("Spinal Cleave");
  const frypan = spellByName("Frypan");
  if (!breath || breath.mp !== 212 || breath.cast !== 8.75 || breath.recast !== 120 || breath.range !== 10 || breath.self === true || !breath.blue || !("breath" in breath.blue) || spellAim(breath, "enemy", false) !== "enemy" || spellAim(breath, "self", false) !== null) {
    throw new Error("Bad Breath catalog");
  }
  if (!slam || slam.mp !== 74 || slam.cast !== 1 || slam.recast !== 27.75 || slam.radius !== 10 || slam.self !== true || slam.range != null || !slam.blue || !("physical" in slam.blue) || spellAim(slam, "enemy", false) !== "self" || spellAim(slam, "none", false) !== "self") {
    throw new Error("Body Slam catalog");
  }
  if (!needles || needles.mp !== 350 || needles.cast !== 12 || needles.recast !== 120 || needles.radius !== 10 || needles.self !== true || needles.range != null || !needles.blue || !("needles" in needles.blue) || spellAim(needles, "enemy", false) !== "self" || spellAim(needles, "none", false) !== "self") {
    throw new Error("1000 Needles catalog");
  }
  if (!spinal || spinal.mp !== 61 || spinal.cast !== 0.5 || spinal.recast !== 28.5 || spinal.range !== 9 || spinal.self === true || !spinal.blue || !("physical" in spinal.blue) || spellAim(spinal, "enemy", false) !== "enemy" || spellAim(spinal, "self", false) !== null) {
    throw new Error("Spinal Cleave catalog");
  }
  if (!frypan || frypan.mp !== 65 || frypan.cast !== 1 || frypan.recast !== 26 || frypan.radius !== 10 || frypan.self !== true || frypan.range != null || !frypan.blue || !("physical" in frypan.blue) || spellAim(frypan, "none", false) !== "self") {
    throw new Error("Frypan catalog");
  }
  if (spellUnlocked(needles, { WAR: 75, BLU: 37 }, new Set(["Bad Breath", "Body Slam", "1000 Needles", "Spinal Cleave", "Frypan"]), "WAR")) {
    throw new Error("subjob morbol blue");
  }
  if (!spellUnlocked(breath, { BLU: 61 }, new Set(["Bad Breath"]), "BLU") || spellUnlocked(breath, { BLU: 60 }, new Set(["Bad Breath"]), "BLU") || !spellUnlocked(spinal, { BLU: 63 }, new Set(["Spinal Cleave"]), "BLU") || spellUnlocked(spinal, { BLU: 62 }, new Set(["Spinal Cleave"]), "BLU")) {
    throw new Error("morbol family level");
  }
  const hydro = spellByName("Hydro Shot");
  const tickle = spellByName("Feather Tickle");
  const yawn = spellByName("Yawn");
  const trunk = spellByName("Voracious Trunk");
  const infra = spellByName("Infrasonics");
  if (!hydro || hydro.mp !== 55 || hydro.cast !== 0.5 || hydro.recast !== 26 || hydro.range !== 6 || hydro.self === true || !hydro.blue || !("physical" in hydro.blue) || spellAim(hydro, "enemy", false) !== "enemy" || spellAim(hydro, "self", false) !== null) {
    throw new Error("Hydro Shot catalog");
  }
  if (!tickle || tickle.mp !== 48 || tickle.cast !== 4 || tickle.recast !== 90 || tickle.range !== 11 || tickle.self === true || !tickle.blue || !("tickle" in tickle.blue) || spellAim(tickle, "enemy", false) !== "enemy" || spellAim(tickle, "self", false) !== null) {
    throw new Error("Feather Tickle catalog");
  }
  if (!yawn || yawn.mp !== 55 || yawn.cast !== 3 || yawn.recast !== 60 || yawn.radius !== 10 || yawn.self !== true || yawn.range != null || !yawn.blue || !("yawn" in yawn.blue) || spellAim(yawn, "enemy", false) !== "self" || spellAim(yawn, "none", false) !== "self") {
    throw new Error("Yawn catalog");
  }
  if (!trunk || trunk.mp !== 72 || trunk.cast !== 10 || trunk.recast !== 120 || trunk.range !== 6 || trunk.self === true || !trunk.blue || !("trunk" in trunk.blue) || spellAim(trunk, "enemy", false) !== "enemy") {
    throw new Error("Voracious Trunk catalog");
  }
  if (!infra || infra.mp !== 42 || infra.cast !== 5 || infra.recast !== 120 || infra.range !== 10 || infra.self === true || !infra.blue || !("infra" in infra.blue) || spellAim(infra, "enemy", false) !== "enemy" || spellAim(infra, "self", false) !== null) {
    throw new Error("Infrasonics catalog");
  }
  const frostBreath = spellByName("Frost Breath");
  const spray = spellByName("Sandspray");
  const ooze = spellByName("Corrosive Ooze");
  const hide = spellByName("Diamondhide");
  const enerv = spellByName("Enervation");
  if (!frostBreath || frostBreath.mp !== 136 || frostBreath.cast !== 6.5 || frostBreath.recast !== 42.75 || frostBreath.range !== 10 || frostBreath.self === true || !frostBreath.blue || !("breath" in frostBreath.blue) || spellAim(frostBreath, "enemy", false) !== "enemy" || spellAim(frostBreath, "self", false) !== null) {
    throw new Error("Frost Breath catalog");
  }
  if (!spray || spray.mp !== 43 || spray.cast !== 3 || spray.recast !== 90 || spray.range !== 6.5 || spray.self === true || !spray.blue || !("spray" in spray.blue) || spellAim(spray, "enemy", false) !== "enemy" || spellAim(spray, "self", false) !== null) {
    throw new Error("Sandspray catalog");
  }
  if (!ooze || ooze.mp !== 55 || ooze.cast !== 5 || ooze.recast !== 30 || ooze.range !== 11 || ooze.self === true || !ooze.blue || !("ooze" in ooze.blue) || spellAim(ooze, "enemy", false) !== "enemy" || spellAim(ooze, "self", false) !== null) {
    throw new Error("Corrosive Ooze catalog");
  }
  if (!hide || hide.mp !== 99 || hide.cast !== 7 || hide.recast !== 90 || hide.radius !== 10 || hide.self !== true || hide.range != null || !hide.blue || !("hide" in hide.blue) || spellAim(hide, "enemy", false) !== "self" || spellAim(hide, "none", false) !== "self") {
    throw new Error("Diamondhide catalog");
  }
  if (!enerv || enerv.mp !== 48 || enerv.cast !== 6 || enerv.recast !== 60 || enerv.radius !== 11.5 || enerv.self !== true || enerv.range != null || !enerv.blue || !("enerv" in enerv.blue) || spellAim(enerv, "enemy", false) !== "self" || spellAim(enerv, "none", false) !== "self") {
    throw new Error("Enervation catalog");
  }
  if (spellUnlocked(frostBreath, { WAR: 75, BLU: 37 }, new Set(["Frost Breath", "Sandspray", "Corrosive Ooze", "Diamondhide", "Enervation"]), "WAR") || spellUnlocked(hide, { BLU: 66 }, new Set(["Diamondhide"]), "BLU") || !spellUnlocked(frostBreath, { BLU: 66 }, new Set(["Frost Breath"]), "BLU") || spellUnlocked(frostBreath, { BLU: 65 }, new Set(["Frost Breath"]), "BLU") || !spellUnlocked(enerv, { BLU: 67 }, new Set(["Enervation"]), "BLU") || spellUnlocked(enerv, { BLU: 66 }, new Set(["Enervation"]), "BLU")) {
    throw new Error("raptor family level");
  }
  const warmup = spellByName("Warm-Up");
  const firespit = spellByName("Firespit");
  const tail = spellByName("Tail Slap");
  const hysteric = spellByName("Hysteric Barrage");
  const gorge = spellByName("Regurgitation");
  if (!warmup || warmup.mp !== 59 || warmup.cast !== 7 || warmup.recast !== 120 || warmup.self !== true || warmup.range != null || !warmup.blue || !("warmup" in warmup.blue) || spellAim(warmup, "enemy", false) !== "self" || spellAim(warmup, "none", false) !== "self") {
    throw new Error("Warm-Up catalog");
  }
  if (!firespit || firespit.mp !== 121 || firespit.cast !== 6.5 || firespit.recast !== 42.75 || firespit.range !== 20 || firespit.self === true || !firespit.blue || !("spit" in firespit.blue) || spellAim(firespit, "enemy", false) !== "enemy" || spellAim(firespit, "self", false) !== null) {
    throw new Error("Firespit catalog");
  }
  if (!tail || tail.mp !== 77 || tail.cast !== 1 || tail.recast !== 28.5 || tail.range !== 10 || tail.self === true || !tail.blue || !("physical" in tail.blue) || spellAim(tail, "enemy", false) !== "enemy" || spellAim(tail, "self", false) !== null) {
    throw new Error("Tail Slap catalog");
  }
  if (!hysteric || hysteric.mp !== 61 || hysteric.cast !== 0.5 || hysteric.recast !== 28.5 || hysteric.range !== 4.5 || hysteric.self === true || !hysteric.blue || !("physical" in hysteric.blue) || spellAim(hysteric, "enemy", false) !== "enemy") {
    throw new Error("Hysteric Barrage catalog");
  }
  if (!gorge || gorge.mp !== 69 || gorge.cast !== 5 || gorge.recast !== 24 || gorge.range !== 21 || gorge.self === true || !gorge.blue || !("gorge" in gorge.blue) || spellAim(gorge, "enemy", false) !== "enemy" || spellAim(gorge, "self", false) !== null) {
    throw new Error("Regurgitation catalog");
  }
  const amp = spellByName("Amplification");
  const claws = spellByName("Asuran Claws");
  const lowing = spellByName("Lowing");
  const heat = spellByName("Heat Breath");
  const triumph = spellByName("Triumphant Roar");
  if (!amp || amp.mp !== 48 || amp.cast !== 7 || amp.recast !== 120 || amp.self !== true || amp.range != null || !amp.blue || !("amp" in amp.blue) || spellAim(amp, "enemy", false) !== "self" || spellAim(amp, "none", false) !== "self") {
    throw new Error("Amplification catalog");
  }
  if (!claws || claws.mp !== 81 || claws.cast !== 3 || claws.recast !== 60 || claws.range !== 4.5 || claws.self === true || !claws.blue || !("physical" in claws.blue) || spellAim(claws, "enemy", false) !== "enemy" || spellAim(claws, "self", false) !== null) {
    throw new Error("Asuran Claws catalog");
  }
  if (!lowing || lowing.mp !== 66 || lowing.cast !== 7 || lowing.recast !== 56 || lowing.self !== true || lowing.radius !== 10 || !lowing.blue || !("lowing" in lowing.blue) || spellAim(lowing, "enemy", false) !== "self" || spellAim(lowing, "none", false) !== "self") {
    throw new Error("Lowing catalog");
  }
  if (!heat || heat.mp !== 169 || heat.cast !== 7.5 || heat.recast !== 49 || heat.range !== 16 || heat.self === true || !heat.blue || !("breath" in heat.blue) || spellAim(heat, "enemy", false) !== "enemy" || spellAim(heat, "self", false) !== null) {
    throw new Error("Heat Breath catalog");
  }
  if (!triumph || triumph.mp !== 24 || triumph.cast !== 3 || triumph.recast !== 90 || triumph.self !== true || triumph.range != null || !triumph.blue || !("triumph" in triumph.blue) || spellAim(triumph, "enemy", false) !== "self" || spellAim(triumph, "none", false) !== "self") {
    throw new Error("Triumphant Roar catalog");
  }
  const sickle = spellByName("Sickle Slash");
  const subzero = spellByName("Sub-zero Smash");
  const saline = spellByName("Saline Coat");
  const ram = spellByName("Ram Charge");
  const shift = spellByName("Temporal Shift");
  if (!sickle || sickle.mp !== 41 || sickle.cast !== 0.5 || sickle.recast !== 20.5 || sickle.range !== 4.5 || sickle.self === true || !sickle.blue || !("physical" in sickle.blue) || spellAim(sickle, "enemy", false) !== "enemy" || spellAim(sickle, "self", false) !== null) {
    throw new Error("Sickle Slash catalog");
  }
  if (!subzero || subzero.mp !== 44 || subzero.cast !== 1 || subzero.recast !== 30 || subzero.range !== 5 || subzero.self === true || !subzero.blue || !("physical" in subzero.blue) || spellAim(subzero, "enemy", false) !== "enemy" || spellAim(subzero, "self", false) !== null) {
    throw new Error("Sub-zero Smash catalog");
  }
  if (!saline || saline.mp !== 66 || saline.cast !== 3 || saline.recast !== 60 || saline.self !== true || saline.range != null || !saline.blue || !("saline" in saline.blue) || spellAim(saline, "enemy", false) !== "self" || spellAim(saline, "none", false) !== "self") {
    throw new Error("Saline Coat catalog");
  }
  if (!ram || ram.mp !== 79 || ram.cast !== 0.5 || ram.recast !== 34.75 || ram.range !== 4.5 || ram.self === true || !ram.blue || !("physical" in ram.blue) || spellAim(ram, "enemy", false) !== "enemy" || spellAim(ram, "self", false) !== null) {
    throw new Error("Ram Charge catalog");
  }
  if (!shift || shift.mp !== 48 || shift.cast !== 0.5 || shift.recast !== 120 || shift.self !== true || shift.radius !== 10 || shift.range != null || !shift.blue || !("shift" in shift.blue) || spellAim(shift, "enemy", false) !== "self" || spellAim(shift, "none", false) !== "self") {
    throw new Error("Temporal Shift catalog");
  }
  const hammer = spellByName("Magic Hammer");
  const reactor = spellByName("Reactor Cool");
  const exuv = spellByName("Exuviation");
  const cleave = spellByName("Vertical Cleave");
  if (!hammer || hammer.mp !== 40 || hammer.cast !== 4 || hammer.recast !== 180 || hammer.range !== 12 || hammer.self === true || !hammer.blue || !("hammer" in hammer.blue) || spellAim(hammer, "enemy", false) !== "enemy" || spellAim(hammer, "self", false) !== null) {
    throw new Error("Magic Hammer catalog");
  }
  if (!reactor || reactor.mp !== 28 || reactor.cast !== 3 || reactor.recast !== 60 || reactor.self !== true || reactor.range != null || !reactor.blue || !("reactor" in reactor.blue) || spellAim(reactor, "enemy", false) !== "self" || spellAim(reactor, "none", false) !== "self") {
    throw new Error("Reactor Cool catalog");
  }
  if (!exuv || exuv.mp !== 40 || exuv.cast !== 3 || exuv.recast !== 60 || exuv.self !== true || exuv.range != null || !exuv.blue || !("exuv" in exuv.blue) || spellAim(exuv, "enemy", false) !== "self" || spellAim(exuv, "none", false) !== "self") {
    throw new Error("Exuviation catalog");
  }
  if (!cleave || cleave.mp !== 86 || cleave.cast !== 0.5 || cleave.recast !== 37.25 || cleave.range !== 4.5 || cleave.self === true || !cleave.blue || !("physical" in cleave.blue) || spellAim(cleave, "enemy", false) !== "enemy" || spellAim(cleave, "self", false) !== null) {
    throw new Error("Vertical Cleave catalog");
  }
  if (spellUnlocked(hammer, { BLU: 73 }, new Set(["Magic Hammer"]), "BLU") || !spellUnlocked(hammer, { BLU: 74 }, new Set(["Magic Hammer"]), "BLU") || spellUnlocked(reactor, { BLU: 73 }, new Set(["Reactor Cool"]), "BLU") || !spellUnlocked(reactor, { BLU: 74 }, new Set(["Reactor Cool"]), "BLU") || spellUnlocked(exuv, { BLU: 74 }, new Set(["Exuviation"]), "BLU") || !spellUnlocked(exuv, { BLU: 75 }, new Set(["Exuviation"]), "BLU") || spellUnlocked(cleave, { BLU: 74 }, new Set(["Vertical Cleave"]), "BLU") || !spellUnlocked(cleave, { BLU: 75 }, new Set(["Vertical Cleave"]), "BLU") || spellUnlocked(hammer, { WAR: 75, BLU: 37 }, new Set(["Magic Hammer", "Reactor Cool", "Exuviation", "Vertical Cleave"]), "WAR")) {
    throw new Error("aht urhgan blue level");
  }
  if (spellUnlocked(sickle, { BLU: 47 }, new Set(["Sickle Slash"]), "BLU") || !spellUnlocked(sickle, { BLU: 48 }, new Set(["Sickle Slash"]), "BLU") || spellUnlocked(subzero, { BLU: 71 }, new Set(["Sub-zero Smash"]), "BLU") || !spellUnlocked(subzero, { BLU: 72 }, new Set(["Sub-zero Smash"]), "BLU") || spellUnlocked(saline, { BLU: 71 }, new Set(["Saline Coat"]), "BLU") || !spellUnlocked(saline, { BLU: 72 }, new Set(["Saline Coat"]), "BLU") || spellUnlocked(ram, { BLU: 72 }, new Set(["Ram Charge"]), "BLU") || !spellUnlocked(ram, { BLU: 73 }, new Set(["Ram Charge"]), "BLU") || spellUnlocked(shift, { BLU: 72 }, new Set(["Temporal Shift"]), "BLU") || !spellUnlocked(shift, { BLU: 73 }, new Set(["Temporal Shift"]), "BLU") || spellUnlocked(sickle, { WAR: 75, BLU: 37 }, new Set(["Sickle Slash", "Sub-zero Smash", "Saline Coat", "Ram Charge", "Temporal Shift"]), "WAR")) {
    throw new Error("spider family level");
  }
  if (spellUnlocked(amp, { WAR: 75, BLU: 37 }, new Set(["Amplification", "Asuran Claws", "Lowing", "Heat Breath", "Triumphant Roar"]), "WAR") || spellUnlocked(amp, { BLU: 69 }, new Set(["Amplification"]), "BLU") || !spellUnlocked(amp, { BLU: 70 }, new Set(["Amplification"]), "BLU") || !spellUnlocked(claws, { BLU: 70 }, new Set(["Asuran Claws"]), "BLU") || spellUnlocked(claws, { BLU: 69 }, new Set(["Asuran Claws"]), "BLU") || spellUnlocked(lowing, { BLU: 70 }, new Set(["Lowing"]), "BLU") || !spellUnlocked(lowing, { BLU: 71 }, new Set(["Lowing"]), "BLU") || !spellUnlocked(heat, { BLU: 71 }, new Set(["Heat Breath"]), "BLU") || spellUnlocked(heat, { BLU: 70 }, new Set(["Heat Breath"]), "BLU") || !spellUnlocked(triumph, { BLU: 71 }, new Set(["Triumphant Roar"]), "BLU") || spellUnlocked(triumph, { BLU: 70 }, new Set(["Triumphant Roar"]), "BLU")) {
    throw new Error("flan family level");
  }
  if (spellUnlocked(warmup, { WAR: 75, BLU: 37 }, new Set(["Warm-Up", "Firespit", "Tail Slap", "Hysteric Barrage", "Regurgitation"]), "WAR") || spellUnlocked(warmup, { BLU: 67 }, new Set(["Warm-Up"]), "BLU") || !spellUnlocked(warmup, { BLU: 68 }, new Set(["Warm-Up"]), "BLU") || !spellUnlocked(firespit, { BLU: 68 }, new Set(["Firespit"]), "BLU") || spellUnlocked(firespit, { BLU: 67 }, new Set(["Firespit"]), "BLU") || spellUnlocked(tail, { BLU: 68 }, new Set(["Tail Slap"]), "BLU") || !spellUnlocked(tail, { BLU: 69 }, new Set(["Tail Slap"]), "BLU") || !spellUnlocked(hysteric, { BLU: 69 }, new Set(["Hysteric Barrage"]), "BLU") || spellUnlocked(hysteric, { BLU: 68 }, new Set(["Hysteric Barrage"]), "BLU") || !spellUnlocked(gorge, { BLU: 69 }, new Set(["Regurgitation"]), "BLU") || spellUnlocked(gorge, { BLU: 68 }, new Set(["Regurgitation"]), "BLU")) {
    throw new Error("mamool family level");
  }
  if (spellUnlocked(hydro, { WAR: 75, BLU: 37 }, new Set(["Hydro Shot", "Feather Tickle", "Yawn", "Voracious Trunk", "Infrasonics"]), "WAR")) {
    throw new Error("subjob sahagin blue");
  }
  if (!spellUnlocked(hydro, { BLU: 63 }, new Set(["Hydro Shot"]), "BLU") || spellUnlocked(hydro, { BLU: 62 }, new Set(["Hydro Shot"]), "BLU") || !spellUnlocked(tickle, { BLU: 64 }, new Set(["Feather Tickle"]), "BLU") || spellUnlocked(tickle, { BLU: 63 }, new Set(["Feather Tickle"]), "BLU") || !spellUnlocked(infra, { BLU: 65 }, new Set(["Infrasonics"]), "BLU") || spellUnlocked(infra, { BLU: 64 }, new Set(["Infrasonics"]), "BLU")) {
    throw new Error("sahagin family level");
  }
  if (spellUnlocked(eyes, { WAR: 75, BLU: 37 }, new Set(["Dimensional Death", "Spiral Spin", "Maelstrom", "Eyes On Me", "Seedspray"]), "WAR")) {
    throw new Error("subjob shadow blue");
  }
  if (!spellUnlocked(dimension, { BLU: 60 }, new Set(["Dimensional Death"]), "BLU") || spellUnlocked(dimension, { BLU: 59 }, new Set(["Dimensional Death"]), "BLU") || !spellUnlocked(mael, { BLU: 61 }, new Set(["Maelstrom"]), "BLU") || spellUnlocked(mael, { BLU: 60 }, new Set(["Maelstrom"]), "BLU")) {
    throw new Error("shadow family level");
  }
  if (spellUnlocked(hecatomb, { WAR: 75, BLU: 37 }, new Set(["Self-Destruct", "Frightful Roar", "Cold Wave", "Filamented Hold", "Hecatomb Wave"]), "WAR")) {
    throw new Error("subjob bomb blue");
  }
  if (!spellUnlocked(geist, { BLU: 46 }, new Set(["Geist Wall"]), "BLU") || spellUnlocked(geist, { BLU: 45 }, new Set(["Geist Wall"]), "BLU")) {
    throw new Error("Geist Wall level");
  }

  const spent = toolsConsumed(tonko);
  const asMain = toolsConsumed(katon, { mainJob: "NIN" });
  const paying = toolsConsumed(katon, { mainJob: "NIN", consume: true });
  if (!spent || spent.tool !== "Shinobi-Tabi" || spent.count !== 0 || spent.retail !== 1 || spent.substitute !== null) {
    throw new Error("ninjutsu spends nothing");
  }
  if (!asMain || asMain.tool !== "Uchitake" || asMain.substitute !== "Inoshishinofuda" || asMain.count !== 0) {
    throw new Error("main-job substitute");
  }
  if (!paying || paying.count !== 1) throw new Error("consumption switch");
  if (NINJUTSU_CONSUMES_TOOLS) throw new Error("ninjutsu consumption is still off");
  if (toolsConsumed(cure) !== null) throw new Error("healing has no tool");

  const names = (levels: Partial<Record<JobId, number>>) => spellsKnown(levels).map((spell) => spell.name).join(",");
  const blmOrder: readonly [number, string][] = [
    [1, "Stone"],
    [3, "Poison"],
    [4, "Blind"],
    [5, "Water"],
    [7, "Bind"],
    [9, "Aero"],
    [10, "Bio"],
    [10, "Blaze Spikes"],
    [12, "Drain"],
    [13, "Fire"],
    [15, "Stonega"],
    [16, "Shock"],
    [17, "Blizzard"],
    [17, "Warp"],
    [18, "Rasp"],
    [19, "Waterga"],
    [20, "Choke"],
    [20, "Ice Spikes"],
    [20, "Sleep"],
    [21, "Thunder"],
    [22, "Frost"],
    [23, "Aeroga"],
    [24, "Burn"],
    [24, "Poisonga"],
    [25, "Aspir"],
    [26, "Stone II"],
    [27, "Drown"],
    [28, "Firaga"],
    [30, "Shock Spikes"],
    [30, "Water II"],
    [31, "Sleepga"],
    [32, "Blizzaga"],
    [34, "Aero II"],
    [35, "Bio II"],
    [36, "Thundaga"],
    [38, "Fire II"],
    [40, "Stonega II"],
    [40, "Warp II"],
    [41, "Sleep II"],
    [42, "Blizzard II"],
    [43, "Poison II"],
    [44, "Waterga II"],
    [45, "Stun"],
    [46, "Thunder II"],
    [48, "Aeroga II"],
    [50, "Freeze"],
    [51, "Stone III"],
    [52, "Tornado"],
    [53, "Firaga II"],
    [54, "Quake"],
    [55, "Water III"],
    [56, "Burst"],
    [56, "Sleepga II"],
    [57, "Blizzaga II"],
    [58, "Flood"],
    [59, "Aero III"],
    [60, "Flare"],
    [61, "Thundaga II"],
    [62, "Fire III"],
    [63, "Stonega III"],
    [64, "Blizzard III"],
    [65, "Waterga III"],
    [66, "Thunder III"],
    [67, "Aeroga III"],
    [68, "Stone IV"],
    [69, "Firaga III"],
    [70, "Water IV"],
    [71, "Blizzaga III"],
    [72, "Aero IV"],
    [73, "Fire IV"],
    [73, "Thundaga III"],
    [74, "Blizzard IV"],
    [75, "Thunder IV"],
  ];
  let built = "";
  for (let i = 0; i < blmOrder.length; ) {
    const level = blmOrder[i][0];
    const group: string[] = [];
    while (i < blmOrder.length && blmOrder[i][0] === level) group.push(blmOrder[i++][1]);
    if (names({ BLM: level - 1 }) !== built) throw new Error(`${group[0]} level`);
    built = [built, ...group].filter(Boolean).join(",");
    if (names({ BLM: level }) !== built) throw new Error(`${group.join(",")} level`);
  }
  if (names({ BLM: 75 }) !== built) throw new Error("BLM nukes");
  if (names({ RDM: 3 }) !== "Cure,Dia" || names({ RDM: 4 }) !== "Stone,Cure,Dia" || names({ RDM: 8 }) !== "Stone,Poison,Blind,Cure,Dia,Paralyze,Protect" || names({ RDM: 9 }) !== "Stone,Poison,Blind,Water,Cure,Dia,Paralyze,Protect") throw new Error("RDM Water");
  if (names({ RDM: 14 }) !== "Stone,Poison,Blind,Water,Bind,Aero,Bio,Cure,Cure II,Aquaveil,Dia,Paralyze,Slow,Protect") throw new Error("RDM Aero");
  if (names({ RDM: 18 }) !== "Stone,Poison,Blind,Water,Bind,Aero,Bio,Cure,Cure II,Aquaveil,Enthunder,Enstone,Dia,Paralyze,Slow,Diaga,Silence,Protect,Shell" || names({ RDM: 19 }) !== "Stone,Poison,Blind,Water,Bind,Aero,Bio,Fire,Cure,Cure II,Aquaveil,Enthunder,Enstone,Dia,Paralyze,Slow,Diaga,Silence,Protect,Shell") throw new Error("RDM Fire");
  if (names({ RDM: 20 }) !== "Stone,Poison,Blind,Water,Bind,Aero,Bio,Blaze Spikes,Fire,Cure,Cure II,Aquaveil,Enthunder,Enstone,Enaero,Dia,Paralyze,Slow,Diaga,Silence,Protect,Shell") throw new Error("RDM Blaze Spikes");
  if (names({ RDM: 23 }) !== "Stone,Poison,Blind,Water,Bind,Aero,Bio,Blaze Spikes,Fire,Gravity,Cure,Cure II,Aquaveil,Blink,Enthunder,Enstone,Enaero,Enblizzard,Dia,Paralyze,Slow,Diaga,Silence,Protect,Shell,Regen" || names({ RDM: 24 }) !== "Stone,Poison,Blind,Water,Bind,Aero,Bio,Blaze Spikes,Fire,Blizzard,Gravity,Cure,Cure II,Aquaveil,Blink,Enthunder,Enstone,Enaero,Enblizzard,Enfire,Dia,Paralyze,Slow,Diaga,Silence,Protect,Shell,Regen") throw new Error("RDM Blizzard");
  if (names({ RDM: 28 }) !== "Stone,Poison,Blind,Water,Bind,Aero,Bio,Blaze Spikes,Fire,Blizzard,Sleep,Gravity,Cure,Cure II,Cure III,Aquaveil,Blink,Enthunder,Enstone,Enaero,Enblizzard,Enfire,Enwater,Dia,Paralyze,Slow,Diaga,Silence,Protect,Protect II,Shell,Regen" || names({ RDM: 29 }) !== "Stone,Poison,Blind,Water,Bind,Aero,Bio,Blaze Spikes,Fire,Blizzard,Sleep,Gravity,Thunder,Cure,Cure II,Cure III,Aquaveil,Blink,Enthunder,Enstone,Enaero,Enblizzard,Enfire,Enwater,Dia,Paralyze,Slow,Diaga,Silence,Protect,Protect II,Shell,Regen") throw new Error("RDM Thunder");
  if (names({ RDM: 37 }) !== "Stone,Poison,Blind,Water,Bind,Aero,Bio,Blaze Spikes,Fire,Blizzard,Sleep,Gravity,Thunder,Stone II,Dispel,Bio II,Distract,Cure,Cure II,Cure III,Stoneskin,Aquaveil,Blink,Phalanx,Enthunder,Enstone,Enaero,Enblizzard,Enfire,Enwater,Dia,Paralyze,Slow,Diaga,Silence,Dia II,Protect,Protect II,Shell,Shell II,Regen" || names({ RDM: 38 }) !== "Stone,Poison,Blind,Water,Bind,Aero,Bio,Blaze Spikes,Fire,Blizzard,Sleep,Gravity,Thunder,Stone II,Dispel,Bio II,Distract,Cure,Cure II,Cure III,Stoneskin,Aquaveil,Blink,Phalanx,Enthunder,Enstone,Enaero,Enblizzard,Enfire,Enwater,Raise,Dia,Paralyze,Slow,Diaga,Silence,Dia II,Protect,Protect II,Shell,Shell II,Regen") throw new Error("RDM Raise");
  if (names({ RDM: 39 }) !== "Stone,Poison,Blind,Water,Bind,Aero,Bio,Blaze Spikes,Fire,Blizzard,Sleep,Gravity,Thunder,Stone II,Dispel,Bio II,Distract,Cure,Cure II,Cure III,Stoneskin,Aquaveil,Blink,Phalanx,Enthunder,Enstone,Enaero,Enblizzard,Enfire,Enwater,Raise,Dia,Paralyze,Slow,Diaga,Silence,Dia II,Protect,Protect II,Shell,Shell II,Regen" || names({ RDM: 40 }) !== "Stone,Poison,Blind,Water,Bind,Aero,Bio,Blaze Spikes,Fire,Blizzard,Ice Spikes,Sleep,Gravity,Thunder,Stone II,Water II,Dispel,Bio II,Distract,Cure,Cure II,Cure III,Stoneskin,Aquaveil,Blink,Phalanx,Enthunder,Enstone,Enaero,Enblizzard,Enfire,Enwater,Raise,Dia,Paralyze,Slow,Diaga,Silence,Dia II,Protect,Protect II,Shell,Shell II,Regen") throw new Error("RDM Ice Spikes");
  if (names({ RDM: 59 }) !== "Stone,Poison,Blind,Water,Bind,Aero,Bio,Blaze Spikes,Fire,Blizzard,Ice Spikes,Sleep,Gravity,Thunder,Stone II,Water II,Dispel,Aero II,Bio II,Distract,Fire II,Sleep II,Blizzard II,Frazzle,Poison II,Cure,Cure II,Cure III,Cure IV,Stoneskin,Aquaveil,Blink,Phalanx,Enthunder,Enstone,Enaero,Enblizzard,Enfire,Enwater,Enthunder II,Enstone II,Enaero II,Enblizzard II,Enfire II,Raise,Dia,Paralyze,Slow,Diaga,Silence,Dia II,Protect,Protect II,Protect III,Shell,Shell II,Shell III,Regen,Haste,Refresh" || names({ RDM: 60 }) !== "Stone,Poison,Blind,Water,Bind,Aero,Bio,Blaze Spikes,Fire,Blizzard,Ice Spikes,Sleep,Gravity,Thunder,Stone II,Shock Spikes,Water II,Dispel,Aero II,Bio II,Distract,Fire II,Sleep II,Blizzard II,Frazzle,Poison II,Thunder II,Cure,Cure II,Cure III,Cure IV,Stoneskin,Aquaveil,Blink,Phalanx,Enthunder,Enstone,Enaero,Enblizzard,Enfire,Enwater,Enthunder II,Enstone II,Enaero II,Enblizzard II,Enfire II,Enwater II,Raise,Dia,Paralyze,Slow,Diaga,Silence,Dia II,Protect,Protect II,Protect III,Shell,Shell II,Shell III,Regen,Haste,Refresh") throw new Error("RDM Shock Spikes");
  if (names({ RDM: 74 }) !== "Stone,Poison,Blind,Water,Bind,Aero,Bio,Blaze Spikes,Fire,Blizzard,Ice Spikes,Sleep,Gravity,Thunder,Stone II,Shock Spikes,Water II,Dispel,Aero II,Bio II,Distract,Fire II,Sleep II,Blizzard II,Frazzle,Poison II,Thunder II,Stone III,Water III,Aero III,Fire III,Blizzard III,Cure,Cure II,Cure III,Cure IV,Stoneskin,Aquaveil,Blink,Phalanx,Enthunder,Enstone,Enaero,Enblizzard,Enfire,Enwater,Enthunder II,Enstone II,Enaero II,Enblizzard II,Enfire II,Enwater II,Raise,Dia,Paralyze,Slow,Diaga,Silence,Dia II,Inundation,Protect,Protect II,Protect III,Protect IV,Shell,Shell II,Shell III,Shell IV,Regen,Haste,Refresh" || names({ RDM: 75 }) !== "Stone,Poison,Blind,Water,Bind,Aero,Bio,Blaze Spikes,Fire,Blizzard,Ice Spikes,Sleep,Gravity,Thunder,Stone II,Shock Spikes,Water II,Dispel,Aero II,Bio II,Distract,Fire II,Sleep II,Blizzard II,Frazzle,Poison II,Thunder II,Stone III,Water III,Aero III,Fire III,Blizzard III,Thunder III,Bio III,Blind II,Cure,Cure II,Cure III,Cure IV,Stoneskin,Aquaveil,Blink,Phalanx,Enthunder,Enstone,Enaero,Enblizzard,Enfire,Enwater,Enthunder II,Enstone II,Enaero II,Enblizzard II,Enfire II,Enwater II,Raise,Dia,Paralyze,Slow,Diaga,Silence,Dia II,Inundation,Dia III,Paralyze II,Slow II,Protect,Protect II,Protect III,Protect IV,Shell,Shell II,Shell III,Shell IV,Regen,Haste,Refresh") {
    throw new Error("RDM tier IV is past 75");
  }
  const enfire = spellByName("Enfire");
  const enfireTwo = spellByName("Enfire II");
  const enthunder = spellByName("Enthunder");
  if (!enfire?.enspell || enfire.enspell.tier !== 1 || enfire.enspell.element !== "fire" || enfire.mp !== 12 || enfire.cast !== 3 || enfire.recast !== 10 || enfire.self !== true || castElement(enfire) !== "fire") {
    throw new Error("Enfire");
  }
  if (!enfireTwo?.enspell || enfireTwo.enspell.tier !== 2 || enfireTwo.mp !== 24 || enfireTwo.cast !== 3 || enfireTwo.recast !== 30 || castElement(enfireTwo) !== "fire") {
    throw new Error("Enfire II");
  }
  if (!enthunder || spellUnlocked(enthunder, { RDM: 15 }) || !spellUnlocked(enthunder, { RDM: 16 }) || spellUnlocked(enfire, { RDM: 23 }) || !spellUnlocked(enfire, { RDM: 24 })) {
    throw new Error("enspell level");
  }
  if (spellUnlocked(enfireTwo, { RDM: 37 }) || spellUnlocked(enfireTwo, { RDM: 57 }) || !spellUnlocked(enfireTwo, { RDM: 58 }) || spellUnlocked(enfire, { WHM: 75 }) || spellUnlocked(enfireTwo, { BLM: 75 })) {
    throw new Error("enspell job");
  }
  if (ENSPELL_SPELLS.length !== 12 || ENSPELL_SECONDS !== 180 || ENSPELL_CE !== 1 || ENSPELL_VE !== 165 || ENSPELL_II_CE !== 44 || ENSPELL_II_VE !== 132) {
    throw new Error("enspell card");
  }
  if (ENSPELL_OPPOSED.fire !== "water" || ENSPELL_OPPOSED.thunder !== "earth" || ENSPELL_OPPOSED.water !== "thunder") throw new Error("enspell opposed");
  if (enspellOverwrites(2, 1) || auspiceBlockedByEnspell(1) || !auspiceBlockedByEnspell(2)) throw new Error("enspell overwrite");
  if (names({ WHM: 1 }) !== "Cure" || names({ WHM: 11 }) !== "Cure,Cure II,Aquaveil,Poisona,Paralyna,Banish,Dia,Paralyze,Protect,Protectra,Barstonra,Barsleepra,Barwatera,Barpoisonra" || names({ WHM: 15 }) !== "Cure,Cure II,Aquaveil,Poisona,Paralyna,Blindna,Banish,Banishga,Dia,Paralyze,Slow,Silence,Protect,Protectra,Barstonra,Barsleepra,Barwatera,Barpoisonra,Barparalyzra,Baraera" || names({ WHM: 16 }) !== "Cure,Cure II,Curaga,Aquaveil,Poisona,Paralyna,Blindna,Banish,Banishga,Dia,Paralyze,Slow,Silence,Protect,Protectra,Barstonra,Barsleepra,Barwatera,Barpoisonra,Barparalyzra,Baraera") {
    throw new Error("WHM Curaga unlock");
  }
  if (names({ WHM: 21 }) !== "Cure,Cure II,Cure III,Curaga,Aquaveil,Blink,Poisona,Paralyna,Blindna,Silena,Banish,Banishga,Dia,Paralyze,Slow,Diaga,Silence,Protect,Protectra,Shell,Shellra,Regen,Barstonra,Barsleepra,Barwatera,Barpoisonra,Barparalyzra,Baraera,Barfira,Barblindra,Barblizzara" || names({ WHM: 24 }) !== "Cure,Cure II,Cure III,Curaga,Aquaveil,Blink,Poisona,Paralyna,Blindna,Silena,Banish,Banishga,Dia,Paralyze,Slow,Diaga,Silence,Protect,Protectra,Shell,Shellra,Regen,Barstonra,Barsleepra,Barwatera,Barpoisonra,Barparalyzra,Baraera,Barfira,Barblindra,Barblizzara,Barsilencera" || names({ WHM: 25 }) !== "Cure,Cure II,Cure III,Curaga,Aquaveil,Blink,Poisona,Paralyna,Blindna,Silena,Raise,Reraise,Banish,Banishga,Dia,Paralyze,Slow,Diaga,Silence,Protect,Protectra,Shell,Shellra,Regen,Barstonra,Barsleepra,Barwatera,Barpoisonra,Barparalyzra,Baraera,Barfira,Barblindra,Barblizzara,Barsilencera,Barthundra") {
    throw new Error("WHM Raise unlock");
  }
  if (names({ WHM: 27 }) !== "Cure,Cure II,Cure III,Curaga,Aquaveil,Blink,Poisona,Paralyna,Blindna,Silena,Raise,Reraise,Banish,Banishga,Dia,Paralyze,Slow,Diaga,Silence,Protect,Protect II,Protectra,Protectra II,Shell,Shellra,Regen,Barstonra,Barsleepra,Barwatera,Barpoisonra,Barparalyzra,Baraera,Barfira,Barblindra,Barblizzara,Barsilencera,Barthundra" || names({ WHM: 28 }) !== "Cure,Cure II,Cure III,Curaga,Stoneskin,Aquaveil,Blink,Poisona,Paralyna,Blindna,Silena,Raise,Reraise,Banish,Banishga,Dia,Paralyze,Slow,Diaga,Silence,Protect,Protect II,Protectra,Protectra II,Shell,Shellra,Regen,Barstonra,Barsleepra,Barwatera,Barpoisonra,Barparalyzra,Baraera,Barfira,Barblindra,Barblizzara,Barsilencera,Barthundra") {
    throw new Error("WHM cures");
  }
  if (names({ WHM: 30 }) !== "Cure,Cure II,Cure III,Curaga,Stoneskin,Aquaveil,Blink,Poisona,Paralyna,Blindna,Silena,Cursna,Raise,Reraise,Banish,Banish II,Banishga,Dia,Paralyze,Slow,Diaga,Silence,Protect,Protect II,Protectra,Protectra II,Shell,Shellra,Regen,Barstonra,Barsleepra,Barwatera,Barpoisonra,Barparalyzra,Baraera,Barfira,Barblindra,Barblizzara,Barsilencera,Barthundra" || names({ WHM: 31 }) !== "Cure,Cure II,Cure III,Curaga,Curaga II,Stoneskin,Aquaveil,Blink,Poisona,Paralyna,Blindna,Silena,Cursna,Raise,Reraise,Banish,Banish II,Banishga,Dia,Paralyze,Slow,Diaga,Silence,Protect,Protect II,Protectra,Protectra II,Shell,Shellra,Regen,Barstonra,Barsleepra,Barwatera,Barpoisonra,Barparalyzra,Baraera,Barfira,Barblindra,Barblizzara,Barsilencera,Barthundra") {
    throw new Error("WHM Curaga II unlock");
  }
  if (names({ WHM: 39 }) !== "Cure,Cure II,Cure III,Curaga,Curaga II,Stoneskin,Aquaveil,Blink,Poisona,Paralyna,Blindna,Silena,Cursna,Viruna,Stona,Erase,Raise,Reraise,Banish,Banish II,Banishga,Dia,Paralyze,Slow,Diaga,Silence,Dia II,Protect,Protect II,Protectra,Protectra II,Shell,Shell II,Shellra,Shellra II,Regen,Barstonra,Barsleepra,Barwatera,Barpoisonra,Barparalyzra,Baraera,Barfira,Barblindra,Barblizzara,Barsilencera,Barthundra,Barvira" || names({ WHM: 40 }) !== "Cure,Cure II,Cure III,Curaga,Curaga II,Stoneskin,Aquaveil,Blink,Poisona,Paralyna,Blindna,Silena,Cursna,Viruna,Stona,Erase,Raise,Reraise,Banish,Banish II,Banishga,Banishga II,Dia,Paralyze,Slow,Diaga,Silence,Dia II,Cura,Protect,Protect II,Protectra,Protectra II,Shell,Shell II,Shellra,Shellra II,Regen,Haste,Barstonra,Barsleepra,Barwatera,Barpoisonra,Barparalyzra,Baraera,Barfira,Barblindra,Barblizzara,Barsilencera,Barthundra,Barvira") {
    throw new Error("WHM Cura unlock");
  }
  if (names({ WHM: 41 }) !== "Cure,Cure II,Cure III,Cure IV,Curaga,Curaga II,Stoneskin,Aquaveil,Blink,Poisona,Paralyna,Blindna,Silena,Cursna,Viruna,Stona,Erase,Raise,Reraise,Banish,Banish II,Banishga,Banishga II,Dia,Paralyze,Slow,Diaga,Silence,Dia II,Cura,Protect,Protect II,Protectra,Protectra II,Shell,Shell II,Shellra,Shellra II,Regen,Haste,Barstonra,Barsleepra,Barwatera,Barpoisonra,Barparalyzra,Baraera,Barfira,Barblindra,Barblizzara,Barsilencera,Barthundra,Barvira" || names({ WHM: 50 }) !== "Cure,Cure II,Cure III,Cure IV,Curaga,Curaga II,Stoneskin,Aquaveil,Blink,Poisona,Paralyna,Blindna,Silena,Cursna,Viruna,Stona,Erase,Raise,Reraise,Banish,Banish II,Banishga,Banishga II,Flash,Holy,Repose,Dia,Paralyze,Slow,Diaga,Silence,Dia II,Cura,Protect,Protect II,Protect III,Protectra,Protectra II,Protectra III,Shell,Shell II,Shellra,Shellra II,Regen,Regen II,Haste,Barstonra,Barsleepra,Barwatera,Barpoisonra,Barparalyzra,Baraera,Barfira,Barblindra,Barblizzara,Barsilencera,Barthundra,Barvira,Barpetra" || names({ WHM: 51 }) !== "Cure,Cure II,Cure III,Cure IV,Curaga,Curaga II,Curaga III,Stoneskin,Aquaveil,Blink,Poisona,Paralyna,Blindna,Silena,Cursna,Viruna,Stona,Erase,Raise,Reraise,Banish,Banish II,Banishga,Banishga II,Flash,Holy,Repose,Dia,Paralyze,Slow,Diaga,Silence,Dia II,Cura,Protect,Protect II,Protect III,Protectra,Protectra II,Protectra III,Shell,Shell II,Shellra,Shellra II,Regen,Regen II,Haste,Barstonra,Barsleepra,Barwatera,Barpoisonra,Barparalyzra,Baraera,Barfira,Barblindra,Barblizzara,Barsilencera,Barthundra,Barvira,Barpetra") {
    throw new Error("WHM Curaga III unlock");
  }
  if (names({ WHM: 55 }) !== "Cure,Cure II,Cure III,Cure IV,Curaga,Curaga II,Curaga III,Stoneskin,Aquaveil,Blink,Poisona,Paralyna,Blindna,Silena,Cursna,Viruna,Stona,Erase,Raise,Reraise,Banish,Banish II,Banishga,Banishga II,Flash,Holy,Repose,Dia,Paralyze,Slow,Diaga,Silence,Dia II,Cura,Protect,Protect II,Protect III,Protectra,Protectra II,Protectra III,Shell,Shell II,Shellra,Shellra II,Regen,Regen II,Haste,Auspice,Barstonra,Barsleepra,Barwatera,Barpoisonra,Barparalyzra,Baraera,Barfira,Barblindra,Barblizzara,Barsilencera,Barthundra,Barvira,Barpetra" || names({ WHM: 56 }) !== "Cure,Cure II,Cure III,Cure IV,Curaga,Curaga II,Curaga III,Stoneskin,Aquaveil,Blink,Poisona,Paralyna,Blindna,Silena,Cursna,Viruna,Stona,Erase,Raise,Raise II,Reraise,Reraise II,Banish,Banish II,Banishga,Banishga II,Flash,Holy,Repose,Dia,Paralyze,Slow,Diaga,Silence,Dia II,Cura,Protect,Protect II,Protect III,Protectra,Protectra II,Protectra III,Shell,Shell II,Shellra,Shellra II,Regen,Regen II,Haste,Auspice,Barstonra,Barsleepra,Barwatera,Barpoisonra,Barparalyzra,Baraera,Barfira,Barblindra,Barblizzara,Barsilencera,Barthundra,Barvira,Barpetra") {
    throw new Error("WHM Raise II unlock");
  }
  if (names({ WHM: 61 }) !== "Cure,Cure II,Cure III,Cure IV,Cure V,Curaga,Curaga II,Curaga III,Stoneskin,Aquaveil,Blink,Poisona,Paralyna,Blindna,Silena,Cursna,Viruna,Stona,Esuna,Erase,Raise,Raise II,Reraise,Reraise II,Banish,Banish II,Banishga,Banishga II,Flash,Holy,Repose,Dia,Paralyze,Slow,Diaga,Silence,Dia II,Cura,Protect,Protect II,Protect III,Protectra,Protectra II,Protectra III,Shell,Shell II,Shell III,Shellra,Shellra II,Shellra III,Regen,Regen II,Haste,Auspice,Barstonra,Barsleepra,Barwatera,Barpoisonra,Barparalyzra,Baraera,Barfira,Barblindra,Barblizzara,Barsilencera,Barthundra,Barvira,Barpetra" || names({ WHM: 70 }) !== "Cure,Cure II,Cure III,Cure IV,Cure V,Curaga,Curaga II,Curaga III,Stoneskin,Aquaveil,Blink,Poisona,Paralyna,Blindna,Silena,Cursna,Viruna,Stona,Esuna,Sacrifice,Erase,Raise,Raise II,Raise III,Reraise,Reraise II,Reraise III,Banish,Banish II,Banish III,Banishga,Banishga II,Flash,Holy,Repose,Dia,Paralyze,Slow,Diaga,Silence,Dia II,Cura,Protect,Protect II,Protect III,Protect IV,Protectra,Protectra II,Protectra III,Protectra IV,Shell,Shell II,Shell III,Shell IV,Shellra,Shellra II,Shellra III,Shellra IV,Regen,Regen II,Regen III,Haste,Auspice,Barstonra,Barsleepra,Barwatera,Barpoisonra,Barparalyzra,Baraera,Barfira,Barblindra,Barblizzara,Barsilencera,Barthundra,Barvira,Barpetra") {
    throw new Error("WHM Raise III unlock");
  }
  if (names({ WHM: 71 }) !== "Cure,Cure II,Cure III,Cure IV,Cure V,Curaga,Curaga II,Curaga III,Curaga IV,Stoneskin,Aquaveil,Blink,Poisona,Paralyna,Blindna,Silena,Cursna,Viruna,Stona,Esuna,Sacrifice,Erase,Raise,Raise II,Raise III,Reraise,Reraise II,Reraise III,Banish,Banish II,Banish III,Banishga,Banishga II,Flash,Holy,Repose,Dia,Paralyze,Slow,Diaga,Silence,Dia II,Cura,Protect,Protect II,Protect III,Protect IV,Protectra,Protectra II,Protectra III,Protectra IV,Shell,Shell II,Shell III,Shell IV,Shellra,Shellra II,Shellra III,Shellra IV,Regen,Regen II,Regen III,Haste,Auspice,Barstonra,Barsleepra,Barwatera,Barpoisonra,Barparalyzra,Baraera,Barfira,Barblindra,Barblizzara,Barsilencera,Barthundra,Barvira,Barpetra" || names({ WHM: 75 }) !== "Cure,Cure II,Cure III,Cure IV,Cure V,Curaga,Curaga II,Curaga III,Curaga IV,Stoneskin,Aquaveil,Blink,Poisona,Paralyna,Blindna,Silena,Cursna,Viruna,Stona,Esuna,Sacrifice,Erase,Raise,Raise II,Raise III,Reraise,Reraise II,Reraise III,Banish,Banish II,Banish III,Banishga,Banishga II,Flash,Holy,Repose,Dia,Paralyze,Slow,Diaga,Silence,Dia II,Cura,Protect,Protect II,Protect III,Protect IV,Protectra,Protectra II,Protectra III,Protectra IV,Protectra V,Shell,Shell II,Shell III,Shell IV,Shellra,Shellra II,Shellra III,Shellra IV,Shellra V,Regen,Regen II,Regen III,Haste,Auspice,Barstonra,Barsleepra,Barwatera,Barpoisonra,Barparalyzra,Baraera,Barfira,Barblindra,Barblizzara,Barsilencera,Barthundra,Barvira,Barpetra") {
    throw new Error("WHM cures");
  }
  const regen = spellByName("Regen");
  const hasteSpell = spellByName("Haste");
  const auspice = spellByName("Auspice");
  const regenTwo = spellByName("Regen II");
  if (!regen?.regen || regen.regen.tier !== 1 || regen.mp !== 15 || regen.cast !== 1.5 || regen.recast !== 12 || regen.regen.effectLevel !== 21 || castElement(regen) !== "light" || spellElement(regen) !== null) {
    throw new Error("Regen card");
  }
  if (!regenTwo || regenTwo.cast !== 1.75 || regenTwo.mp !== 36 || spellUnlocked(regenTwo, { RDM: 75 }) || !spellUnlocked(regenTwo, { WHM: 44 }) || spellByName("Regen III")?.jobs.includes("RDM")) {
    throw new Error("Regen tiers");
  }
  if (!hasteSpell?.haste || hasteSpell.cast !== 3 || hasteSpell.recast !== 20 || hasteSpell.mp !== 40 || castElement(hasteSpell) !== "wind" || elementFromName("Haste") !== null || spellElement(hasteSpell) !== null) {
    throw new Error("Haste card");
  }
  const refresh = spellByName("Refresh");
  if (!refresh?.refresh || refresh.mp !== 40 || refresh.cast !== 5 || refresh.recast !== 18 || refresh.range !== 20 || refresh.refresh.effectLevel !== 41 || refresh.jobLevel?.RDM !== 41 || refresh.jobLevel?.RUN !== 62 || refresh.jobs.length !== 2 || refresh.jobs.includes("WHM") || castElement(refresh) !== "light" || spellElement(refresh) !== null) {
    throw new Error("Refresh card");
  }
  if (spellUnlocked(refresh, { RDM: 40 }) || !spellUnlocked(refresh, { RDM: 41 }) || spellUnlocked(refresh, { WHM: 75 }) || spellUnlocked(refresh, { RDM: 37 })) {
    throw new Error("Refresh unlock");
  }
  if (spellAim(refresh, "enemy", false) !== "self" || spellAim(refresh, "none", false) !== "self" || names({ RDM: 41 }) !== `${names({ RDM: 40 })},Refresh` || names({ RDM: 40 }).includes("Refresh") || names({ WHM: 75 }).includes("Refresh")) {
    throw new Error("Refresh stays on you");
  }
  if (!auspice?.auspice || auspice.cast !== 3 || auspice.mp !== 48 || auspice.recast !== 10 || auspice.radius !== 10 || !auspice.self || castElement(auspice) !== "light" || auspice.jobs.includes("RDM")) {
    throw new Error("Auspice card");
  }
  const barfira = spellByName("Barfira");
  const barsleep = spellByName("Barsleepra");
  const barpetra = spellByName("Barpetra");
  const barvira = spellByName("Barvira");
  if (!barfira?.bar || barfira.bar.kind !== "element" || barfira.bar.element !== "water" || barfira.bar.resists !== "fire" || barfira.mp !== 12 || barfira.cast !== 0.5 || barfira.recast !== 10 || barfira.radius !== 10 || !barfira.self || barfira.jobLevel?.WHM !== 17 || castElement(barfira) !== "water" || elementFromName("Barfira") !== null || barfira.jobs.includes("RDM")) {
    throw new Error("Barfira card");
  }
  if (!barsleep?.bar || barsleep.bar.kind !== "status" || barsleep.bar.resists !== "Sleep" || barsleep.mp !== 14 || barsleep.cast !== 5 || barsleep.bar.element !== "light") {
    throw new Error("Barsleepra card");
  }
  if (!barpetra?.bar || barpetra.mp !== 40 || barpetra.jobLevel?.WHM !== 43 || barpetra.bar.resists !== "Petrification" || !barvira || barvira.mp !== 50 || barvira.jobLevel?.WHM !== 39 || barvira.bar?.resists !== "Plague") {
    throw new Error("later status bars");
  }
  const barstone = spellByName("Barstone");
  const foil = spellByName("Foil");
  if (!barstone?.bar || barstone.radius != null || barstone.mp !== 6 || barstone.cast !== 0.5 || barstone.jobLevel?.RUN !== 4 || barstone.bar.resists !== "earth" || barstone.jobs.join(",") !== "RUN" || spellByName("Barwater")?.mp !== 6 || spellByName("Barvirus")?.mp !== 25 || spellByName("Barpetrify")?.mp !== 20 || spellByName("Barsleep")?.cast !== 2.5) {
    throw new Error("RUN self bars");
  }
  if (!foil?.foil || foil.mp !== 48 || foil.cast !== 1 || foil.recast !== 45 || foil.jobLevel?.RUN !== 58 || foil.jobs.join(",") !== "RUN" || foil.radius != null) {
    throw new Error("Foil card");
  }
  const barfire = spellByName("Barfire");
  if (spellByName("Baramnesra") != null || spellByName("Baramnesia") != null || barfire?.jobs.join(",") !== "RUN" || spellUnlocked(barfire, { WHM: 75 }) || spellUnlocked(barfire, { RDM: 75 }) || spellUnlocked(barfira, { WHM: 16 }) || !spellUnlocked(barfira, { WHM: 17 })) {
    throw new Error("bar spell gate");
  }
  if (elementFromName("Barblindra") !== null || elementFromName("Barwatera") !== null || castElement(spellByName("Barthundra")!) !== "earth" || castElement(spellByName("Barblizzara")!) !== "fire") {
    throw new Error("bar element");
  }
  if (names({ PLD: 4 }) !== "" || names({ PLD: 5 }) !== "Cure" || names({ PLD: 17 }) !== "Cure,Cure II,Banish,Protect" || names({ PLD: 30 }) !== "Cure,Cure II,Cure III,Banish,Banishga,Protect,Protect II,Shell" || names({ PLD: 49 }) !== "Cure,Cure II,Cure III,Banish,Banish II,Banishga,Flash,Protect,Protect II,Shell,Shell II" || names({ PLD: 50 }) !== "Cure,Cure II,Cure III,Raise,Banish,Banish II,Banishga,Flash,Protect,Protect II,Protect III,Shell,Shell II" || names({ PLD: 55 }) !== "Cure,Cure II,Cure III,Cure IV,Raise,Banish,Banish II,Banishga,Flash,Holy,Protect,Protect II,Protect III,Shell,Shell II" || names({ PLD: 75 }) !== "Cure,Cure II,Cure III,Cure IV,Reprisal,Raise,Banish,Banish II,Banishga,Flash,Holy,Protect,Protect II,Protect III,Protect IV,Shell,Shell II,Shell III") {
    throw new Error("PLD cures");
  }
  if (names({ DRK: 19 }) !== "Stone,Poison,Water,Aero,Bio,Drain" || names({ DRK: 20 }) !== "Stone,Poison,Water,Bind,Aero,Bio,Drain,Aspir") throw new Error("DRK Bind");
  if (names({ DRK: 29 }) !== "Stone,Poison,Water,Bind,Aero,Bio,Drain,Fire,Blizzard,Poisonga,Aspir" || names({ DRK: 30 }) !== "Stone,Poison,Water,Bind,Aero,Bio,Drain,Fire,Blizzard,Sleep,Poisonga,Aspir") throw new Error("DRK Sleep");
  if (names({ DRK: 71 }) !== "Stone,Poison,Water,Bind,Aero,Bio,Drain,Fire,Blizzard,Sleep,Thunder,Poisonga,Aspir,Stone II,Water II,Aero II,Bio II,Fire II,Sleep II,Blizzard II,Poison II,Stun" || names({ DRK: 72 }) !== "Stone,Poison,Water,Bind,Aero,Bio,Drain,Fire,Blizzard,Sleep,Thunder,Poisonga,Aspir,Stone II,Water II,Aero II,Bio II,Fire II,Sleep II,Blizzard II,Poison II,Stun,Thunder II") {
    throw new Error("DRK Thunder II is 72");
  }
  if (names({ DRK: 75 }) !== "Stone,Poison,Water,Bind,Aero,Bio,Drain,Fire,Blizzard,Sleep,Thunder,Poisonga,Aspir,Stone II,Water II,Aero II,Bio II,Fire II,Sleep II,Blizzard II,Poison II,Stun,Thunder II" || names({ DRK: 76 }) !== "Stone,Poison,Water,Bind,Aero,Bio,Drain,Fire,Blizzard,Sleep,Thunder,Poisonga,Aspir,Stone II,Water II,Aero II,Bio II,Fire II,Sleep II,Blizzard II,Poison II,Stun,Thunder II,Stone III") {
    throw new Error("DRK Stone III is 76");
  }
  if (names({ DRK: 79 }) !== "Stone,Poison,Water,Bind,Aero,Bio,Drain,Fire,Blizzard,Sleep,Thunder,Poisonga,Aspir,Stone II,Water II,Aero II,Bio II,Fire II,Sleep II,Blizzard II,Poison II,Stun,Thunder II,Stone III" || names({ DRK: 80 }) !== "Stone,Poison,Water,Bind,Aero,Bio,Drain,Fire,Blizzard,Sleep,Thunder,Poisonga,Aspir,Stone II,Water II,Aero II,Bio II,Fire II,Sleep II,Blizzard II,Poison II,Stun,Thunder II,Stone III,Water III") {
    throw new Error("DRK Water III is 80");
  }
  if (names({ DRK: 83 }) !== "Stone,Poison,Water,Bind,Aero,Bio,Drain,Fire,Blizzard,Sleep,Thunder,Poisonga,Aspir,Stone II,Water II,Aero II,Bio II,Fire II,Sleep II,Blizzard II,Poison II,Stun,Thunder II,Stone III,Water III" || names({ DRK: 84 }) !== "Stone,Poison,Water,Bind,Aero,Bio,Drain,Fire,Blizzard,Sleep,Thunder,Poisonga,Aspir,Stone II,Water II,Aero II,Bio II,Fire II,Sleep II,Blizzard II,Poison II,Stun,Thunder II,Stone III,Water III,Aero III") {
    throw new Error("DRK Aero III is 84");
  }
  if (names({ DRK: 87 }) !== "Stone,Poison,Water,Bind,Aero,Bio,Drain,Fire,Blizzard,Sleep,Thunder,Poisonga,Aspir,Stone II,Water II,Aero II,Bio II,Fire II,Sleep II,Blizzard II,Poison II,Stun,Thunder II,Stone III,Water III,Aero III" || names({ DRK: 88 }) !== "Stone,Poison,Water,Bind,Aero,Bio,Drain,Fire,Blizzard,Sleep,Thunder,Poisonga,Aspir,Stone II,Water II,Aero II,Bio II,Fire II,Sleep II,Blizzard II,Poison II,Stun,Thunder II,Stone III,Water III,Aero III,Fire III") {
    throw new Error("DRK Fire III is 88");
  }
  if (names({ DRK: 91 }) !== "Stone,Poison,Water,Bind,Aero,Bio,Drain,Fire,Blizzard,Sleep,Thunder,Poisonga,Aspir,Stone II,Water II,Aero II,Bio II,Fire II,Sleep II,Blizzard II,Poison II,Stun,Thunder II,Stone III,Water III,Aero III,Fire III" || names({ DRK: 92 }) !== "Stone,Poison,Water,Bind,Aero,Bio,Drain,Fire,Blizzard,Sleep,Thunder,Poisonga,Aspir,Stone II,Water II,Aero II,Bio II,Fire II,Sleep II,Blizzard II,Poison II,Stun,Thunder II,Stone III,Water III,Aero III,Fire III,Blizzard III") {
    throw new Error("DRK Blizzard III is 92");
  }
  if (names({ WAR: 75 }) !== "" || names({ NIN: 75 }).includes("Cure") || names({ NIN: 75 }).includes("Stone") || names({ NIN: 75 }).includes("Water") || names({ NIN: 75 }).includes("Aero") || names({ NIN: 75 }).includes("Fire") || names({ NIN: 75 }).includes("Firaga") || names({ NIN: 75 }).includes("Blizzard") || names({ NIN: 75 }).includes("Blizzaga") || names({ NIN: 75 }).includes("Thunder") || names({ NIN: 75 }).includes("Freeze") || names({ NIN: 75 }).includes("Tornado") || names({ NIN: 75 }).includes("Quake") || names({ NIN: 75 }).includes("Burst") || names({ NIN: 75 }).includes("Flood") || names({ NIN: 75 }).includes("Flare") || names({ NIN: 75 }).includes("Spikes") || names({ NIN: 75 }).includes("Burn") || names({ NIN: 75 }).includes("Choke") || names({ NIN: 75 }).includes("Drown") || names({ NIN: 75 }).includes("Frost") || names({ NIN: 75 }).includes("Rasp") || names({ NIN: 75 }).includes("Shock") || names({ NIN: 75 }).includes("Blind") || names({ NIN: 75 }).includes("Bind") || names({ NIN: 75 }).includes("Sleep") || names({ NIN: 75 }).includes("Drain") || names({ NIN: 75 }).includes("Aspir")) {
    throw new Error("elemental nuke on the wrong job");
  }
  const stone = spellByName("Stone");
  const second = spellByName("Stone II");
  const third = spellByName("Stone III");
  const fourth = spellByName("Stone IV");
  if (!stone || stone.mp !== 4 || stone.cast !== 0.5 || stone.recast !== 2 || stone.range !== 21 || stone.macc !== 0) {
    throw new Error("Stone card");
  }
  if (!second || second.mp !== 16 || second.cast !== 1.5 || second.recast !== 6 || second.macc !== 10) throw new Error("Stone II card");
  if (!third || third.mp !== 40 || third.cast !== 3 || third.recast !== 15 || third.macc !== 20 || !third.jobs.includes("DRK")) {
    throw new Error("Stone III card");
  }
  if (!fourth || fourth.mp !== 88 || fourth.cast !== 5 || fourth.recast !== 30 || fourth.macc !== 20 || fourth.jobs.includes("DRK") || fourth.addendum !== "black") {
    throw new Error("Stone IV card");
  }
  const water = spellByName("Water");
  const water2 = spellByName("Water II");
  const water3 = spellByName("Water III");
  const water4 = spellByName("Water IV");
  if (!water || water.mp !== 5 || water.cast !== 0.5 || water.recast !== 2 || water.range !== 21 || water.macc !== 0 || water.nuke !== "Water") {
    throw new Error("Water card");
  }
  if (!water2 || water2.mp !== 19 || water2.cast !== 1.5 || water2.recast !== 6 || water2.macc !== 10) throw new Error("Water II card");
  if (!water3 || water3.mp !== 46 || water3.cast !== 3 || water3.recast !== 15 || water3.macc !== 20 || !water3.jobs.includes("DRK")) {
    throw new Error("Water III card");
  }
  if (!water4 || water4.mp !== 99 || water4.cast !== 5 || water4.recast !== 30 || water4.macc !== 20 || water4.jobs.includes("DRK")) {
    throw new Error("Water IV card");
  }
  const aero = spellByName("Aero");
  const aero2 = spellByName("Aero II");
  const aero3 = spellByName("Aero III");
  const aero4 = spellByName("Aero IV");
  if (!aero || aero.mp !== 6 || aero.cast !== 0.5 || aero.recast !== 2 || aero.range !== 21 || aero.macc !== 0 || aero.nuke !== "Aero") {
    throw new Error("Aero card");
  }
  if (!aero2 || aero2.mp !== 22 || aero2.cast !== 1.5 || aero2.recast !== 6 || aero2.macc !== 10) throw new Error("Aero II card");
  if (!aero3 || aero3.mp !== 54 || aero3.cast !== 3 || aero3.recast !== 15 || aero3.macc !== 20 || !aero3.jobs.includes("DRK")) {
    throw new Error("Aero III card");
  }
  if (!aero4 || aero4.mp !== 115 || aero4.cast !== 5 || aero4.recast !== 30 || aero4.macc !== 20 || aero4.jobs.includes("DRK")) {
    throw new Error("Aero IV card");
  }
  const fire = spellByName("Fire");
  const fire2 = spellByName("Fire II");
  const fire3 = spellByName("Fire III");
  const fire4 = spellByName("Fire IV");
  if (!fire || fire.mp !== 7 || fire.cast !== 0.5 || fire.recast !== 2 || fire.range !== 21 || fire.macc !== 0 || fire.nuke !== "Fire") {
    throw new Error("Fire card");
  }
  if (!fire2 || fire2.mp !== 26 || fire2.cast !== 1.5 || fire2.recast !== 6 || fire2.macc !== 10) throw new Error("Fire II card");
  if (!fire3 || fire3.mp !== 63 || fire3.cast !== 3 || fire3.recast !== 15 || fire3.macc !== 20 || !fire3.jobs.includes("DRK")) {
    throw new Error("Fire III card");
  }
  if (!fire4 || fire4.mp !== 135 || fire4.cast !== 5 || fire4.recast !== 30 || fire4.macc !== 20 || fire4.jobs.includes("DRK")) {
    throw new Error("Fire IV card");
  }
  const blizzard = spellByName("Blizzard");
  const blizzard2 = spellByName("Blizzard II");
  const blizzard3 = spellByName("Blizzard III");
  const blizzard4 = spellByName("Blizzard IV");
  if (!blizzard || blizzard.mp !== 8 || blizzard.cast !== 0.5 || blizzard.recast !== 2 || blizzard.range !== 21 || blizzard.macc !== 0 || blizzard.nuke !== "Blizzard") {
    throw new Error("Blizzard card");
  }
  if (!blizzard2 || blizzard2.mp !== 31 || blizzard2.cast !== 1.5 || blizzard2.recast !== 6 || blizzard2.macc !== 10) throw new Error("Blizzard II card");
  if (!blizzard3 || blizzard3.mp !== 75 || blizzard3.cast !== 3 || blizzard3.recast !== 15 || blizzard3.macc !== 20 || !blizzard3.jobs.includes("DRK")) {
    throw new Error("Blizzard III card");
  }
  if (!blizzard4 || blizzard4.mp !== 162 || blizzard4.cast !== 5 || blizzard4.recast !== 30 || blizzard4.macc !== 20 || blizzard4.jobs.includes("DRK")) {
    throw new Error("Blizzard IV card");
  }
  const thunder = spellByName("Thunder");
  const thunder2 = spellByName("Thunder II");
  const thunder3 = spellByName("Thunder III");
  const thunder4 = spellByName("Thunder IV");
  if (!thunder || thunder.mp !== 9 || thunder.cast !== 0.5 || thunder.recast !== 2 || thunder.range !== 21 || thunder.macc !== 0 || thunder.nuke !== "Thunder") {
    throw new Error("Thunder card");
  }
  if (!thunder2 || thunder2.mp !== 37 || thunder2.cast !== 1.5 || thunder2.recast !== 6 || thunder2.macc !== 10) throw new Error("Thunder II card");
  if (!thunder3 || thunder3.mp !== 91 || thunder3.cast !== 3 || thunder3.recast !== 15 || thunder3.macc !== 20 || !thunder3.jobs.includes("DRK")) {
    throw new Error("Thunder III card");
  }
  if (!thunder4 || thunder4.mp !== 195 || thunder4.cast !== 5 || thunder4.recast !== 30 || thunder4.macc !== 20 || thunder4.jobs.includes("DRK")) {
    throw new Error("Thunder IV card");
  }
  const stonega = spellByName("Stonega");
  const stonega2 = spellByName("Stonega II");
  const stonega3 = spellByName("Stonega III");
  if (!stonega || stonega.mp !== 24 || stonega.cast !== 2 || stonega.recast !== 5 || stonega.range !== 21 || stonega.macc !== 0 || stonega.nuke !== "Stonega" || stonega.jobs.join(",") !== "BLM") {
    throw new Error("Stonega card");
  }
  if (!stonega2 || stonega2.mp !== 93 || stonega2.cast !== 4 || stonega2.recast !== 10 || stonega2.macc !== 0 || stonega2.jobs.join(",") !== "BLM") {
    throw new Error("Stonega II card");
  }
  if (!stonega3 || stonega3.mp !== 175 || stonega3.cast !== 7 || stonega3.recast !== 25 || stonega3.macc !== 0 || stonega3.jobs.includes("DRK") || stonega3.jobs.join(",") !== "BLM") {
    throw new Error("Stonega III card");
  }
  const blizzaga = spellByName("Blizzaga");
  const blizzaga2 = spellByName("Blizzaga II");
  const blizzaga3 = spellByName("Blizzaga III");
  if (!blizzaga || blizzaga.mp !== 80 || blizzaga.cast !== 2 || blizzaga.recast !== 5 || blizzaga.range !== 21 || blizzaga.macc !== 0 || blizzaga.nuke !== "Blizzaga" || blizzaga.jobs.join(",") !== "BLM") {
    throw new Error("Blizzaga card");
  }
  if (!blizzaga2 || blizzaga2.mp !== 175 || blizzaga2.cast !== 4 || blizzaga2.recast !== 10 || blizzaga2.macc !== 0 || blizzaga2.jobs.join(",") !== "BLM") {
    throw new Error("Blizzaga II card");
  }
  if (!blizzaga3 || blizzaga3.mp !== 297 || blizzaga3.cast !== 7 || blizzaga3.recast !== 25 || blizzaga3.macc !== 0 || blizzaga3.jobs.includes("DRK") || blizzaga3.jobs.join(",") !== "BLM") {
    throw new Error("Blizzaga III card");
  }
  const aeroga = spellByName("Aeroga");
  const aeroga2 = spellByName("Aeroga II");
  const aeroga3 = spellByName("Aeroga III");
  if (!aeroga || aeroga.mp !== 45 || aeroga.cast !== 2 || aeroga.recast !== 5 || aeroga.range !== 21 || aeroga.macc !== 0 || aeroga.nuke !== "Aeroga" || aeroga.jobs.join(",") !== "BLM") {
    throw new Error("Aeroga card");
  }
  if (!aeroga2 || aeroga2.mp !== 131 || aeroga2.cast !== 4 || aeroga2.recast !== 10 || aeroga2.macc !== 0 || aeroga2.jobs.join(",") !== "BLM") {
    throw new Error("Aeroga II card");
  }
  if (!aeroga3 || aeroga3.mp !== 232 || aeroga3.cast !== 7 || aeroga3.recast !== 25 || aeroga3.macc !== 0 || aeroga3.jobs.includes("DRK") || aeroga3.jobs.join(",") !== "BLM") {
    throw new Error("Aeroga III card");
  }
  const firaga = spellByName("Firaga");
  const firaga2 = spellByName("Firaga II");
  const firaga3 = spellByName("Firaga III");
  if (!firaga || firaga.mp !== 57 || firaga.cast !== 2 || firaga.recast !== 5 || firaga.range !== 21 || firaga.macc !== 0 || firaga.nuke !== "Firaga" || firaga.jobs.join(",") !== "BLM") {
    throw new Error("Firaga card");
  }
  if (!firaga2 || firaga2.mp !== 153 || firaga2.cast !== 4 || firaga2.recast !== 10 || firaga2.macc !== 0 || firaga2.jobs.join(",") !== "BLM") {
    throw new Error("Firaga II card");
  }
  if (!firaga3 || firaga3.mp !== 263 || firaga3.cast !== 7 || firaga3.recast !== 25 || firaga3.macc !== 0 || firaga3.jobs.includes("DRK") || firaga3.jobs.join(",") !== "BLM") {
    throw new Error("Firaga III card");
  }
  const waterga = spellByName("Waterga");
  const waterga2 = spellByName("Waterga II");
  const waterga3 = spellByName("Waterga III");
  if (!waterga || waterga.mp !== 34 || waterga.cast !== 2 || waterga.recast !== 5 || waterga.range !== 21 || waterga.macc !== 0 || waterga.nuke !== "Waterga" || waterga.jobs.join(",") !== "BLM") {
    throw new Error("Waterga card");
  }
  if (!waterga2 || waterga2.mp !== 112 || waterga2.cast !== 4 || waterga2.recast !== 10 || waterga2.macc !== 0 || waterga2.jobs.join(",") !== "BLM") {
    throw new Error("Waterga II card");
  }
  if (!waterga3 || waterga3.mp !== 202 || waterga3.cast !== 7 || waterga3.recast !== 25 || waterga3.macc !== 0 || waterga3.jobs.includes("DRK") || waterga3.jobs.join(",") !== "BLM") {
    throw new Error("Waterga III card");
  }
  const thundaga = spellByName("Thundaga");
  const thundaga2 = spellByName("Thundaga II");
  const thundaga3 = spellByName("Thundaga III");
  if (!thundaga || thundaga.mp !== 105 || thundaga.cast !== 2 || thundaga.recast !== 5 || thundaga.range !== 21 || thundaga.macc !== 0 || thundaga.nuke !== "Thundaga" || thundaga.jobs.join(",") !== "BLM") {
    throw new Error("Thundaga card");
  }
  if (!thundaga2 || thundaga2.mp !== 200 || thundaga2.cast !== 4 || thundaga2.recast !== 10 || thundaga2.macc !== 0 || thundaga2.jobs.join(",") !== "BLM") {
    throw new Error("Thundaga II card");
  }
  if (!thundaga3 || thundaga3.mp !== 332 || thundaga3.cast !== 7 || thundaga3.recast !== 25 || thundaga3.macc !== 0 || thundaga3.jobs.includes("DRK") || thundaga3.jobs.join(",") !== "BLM") {
    throw new Error("Thundaga III card");
  }
  for (const [name, level] of [["Freeze", 50], ["Tornado", 52], ["Quake", 54], ["Burst", 56], ["Flood", 58], ["Flare", 60]] as const) {
    const card = spellByName(name);
    if (!card || card.mp !== 315 || card.cast !== 8.5 || card.recast !== 60 || card.range !== 21 || card.macc !== 0 || card.nuke !== name || card.jobLevel?.BLM !== level || card.jobs.join(",") !== "BLM") {
      throw new Error(`${name} card`);
    }
  }
  if (conserveMpCost(88, 0) !== 44 || conserveMpCost(88, 1) !== 55 || conserveMpCost(88, 2) !== 66 || conserveMpCost(88, 3) !== 77) {
    throw new Error("Conserve MP numerators");
  }
  if (conserveMpCost(4, 0) !== 2 || conserveMpCost(16, 3) !== 14) throw new Error("Conserve MP floor");

  if (!stone || spellElement(stone) !== "earth" || spellElement(second!) !== "earth" || spellElement(third!) !== "earth" || spellElement(fourth!) !== "earth") {
    throw new Error("Stone is earth");
  }
  if (!water || spellElement(water) !== "water" || spellElement(water2!) !== "water" || spellElement(water3!) !== "water" || spellElement(water4!) !== "water") {
    throw new Error("Water is water");
  }
  if (!aero || spellElement(aero) !== "wind" || spellElement(aero2!) !== "wind" || spellElement(aero3!) !== "wind" || spellElement(aero4!) !== "wind") {
    throw new Error("Aero is wind");
  }
  if (!fire || spellElement(fire) !== "fire" || spellElement(fire2!) !== "fire" || spellElement(fire3!) !== "fire" || spellElement(fire4!) !== "fire") {
    throw new Error("Fire is fire");
  }
  if (!blizzard || spellElement(blizzard) !== "ice" || spellElement(blizzard2!) !== "ice" || spellElement(blizzard3!) !== "ice" || spellElement(blizzard4!) !== "ice") {
    throw new Error("Blizzard is ice");
  }
  if (!thunder || spellElement(thunder) !== "thunder" || spellElement(thunder2!) !== "thunder" || spellElement(thunder3!) !== "thunder" || spellElement(thunder4!) !== "thunder") {
    throw new Error("Thunder is thunder");
  }
  if (!stonega || spellElement(stonega) !== "earth" || spellElement(stonega2!) !== "earth" || spellElement(stonega3!) !== "earth") {
    throw new Error("Stonega is earth");
  }
  if (elementFromName("Stonega") !== "earth" || elementFromName("Stonega II") !== "earth" || elementFromName("Stone") !== "earth") {
    throw new Error("Stonega is not Stone");
  }
  if (!blizzaga || spellElement(blizzaga) !== "ice" || spellElement(blizzaga2!) !== "ice" || spellElement(blizzaga3!) !== "ice") {
    throw new Error("Blizzaga is ice");
  }
  if (elementFromName("Blizzaga") !== "ice" || elementFromName("Blizzaga III") !== "ice" || elementFromName("Blizzard") !== "ice") {
    throw new Error("Blizzaga is not Blizzard");
  }
  if (!aeroga || spellElement(aeroga) !== "wind" || spellElement(aeroga2!) !== "wind" || spellElement(aeroga3!) !== "wind") {
    throw new Error("Aeroga is wind");
  }
  if (elementFromName("Aeroga") !== "wind" || elementFromName("Aeroga III") !== "wind" || elementFromName("Aero") !== "wind") {
    throw new Error("Aeroga is not Aero");
  }
  if (!firaga || spellElement(firaga) !== "fire" || spellElement(firaga2!) !== "fire" || spellElement(firaga3!) !== "fire") {
    throw new Error("Firaga is fire");
  }
  if (elementFromName("Firaga") !== "fire" || elementFromName("Firaga III") !== "fire" || elementFromName("Fire") !== "fire") {
    throw new Error("Firaga is not Fire");
  }
  if (!waterga || spellElement(waterga) !== "water" || spellElement(waterga2!) !== "water" || spellElement(waterga3!) !== "water") {
    throw new Error("Waterga is water");
  }
  if (elementFromName("Waterga") !== "water" || elementFromName("Waterga III") !== "water" || elementFromName("Water") !== "water") {
    throw new Error("Waterga is not Water");
  }
  if (!thundaga || spellElement(thundaga) !== "thunder" || spellElement(thundaga2!) !== "thunder" || spellElement(thundaga3!) !== "thunder") {
    throw new Error("Thundaga is lightning");
  }
  if (elementFromName("Thundaga") !== "thunder" || elementFromName("Thundaga III") !== "thunder" || elementFromName("Thunder") !== "thunder") {
    throw new Error("Thundaga is not Thunder");
  }
  if (elementFromName("Freeze") !== "ice" || elementFromName("Tornado") !== "wind" || elementFromName("Quake") !== "earth") {
    throw new Error("ancient elements");
  }
  if (elementFromName("Burst") !== "thunder" || elementFromName("Flood") !== "water" || elementFromName("Flare") !== "fire") {
    throw new Error("ancient elements");
  }
  if (spellElement(spellByName("Freeze")!) !== "ice" || spellElement(spellByName("Quake")!) !== "earth" || spellElement(spellByName("Flood")!) !== "water") {
    throw new Error("ancient spell element");
  }
  if (elementFromName("Blizzard") !== "ice" || elementFromName("Blizzard IV") !== "ice") throw new Error("Blizzard is ice");
  if (elementFromName("Fire III") !== "fire" || elementFromName("Flare") !== "fire") throw new Error("Fire look");
  if (elementFromName("Aera") !== "wind" || elementFromName("Aeroga") !== "wind" || elementFromName("Aero II") !== "wind" || elementFromName("Tornado") !== "wind") throw new Error("Wind look");
  if (elementFromName("Blizzara") !== "ice" || elementFromName("Thundara") !== "thunder" || elementFromName("Stonera II") !== "earth" || elementFromName("Watera") !== "water" || elementFromName("Fira") !== "fire") {
    throw new Error("ra elements");
  }
  if (elementFromName("Thunder") !== "thunder" || elementFromName("Water IV") !== "water") throw new Error("Thunder and Water");
  if (elementFromName("Holy") !== "light" || elementFromName("Comet") !== "dark") throw new Error("Light and dark");
  if (elementFromName("Cure") !== null) throw new Error("Cure is not an element");
  const pyrohelix = spellByName("Pyrohelix");
  const geohelix = spellByName("Geohelix");
  if (
    !pyrohelix?.helix ||
    pyrohelix.school !== "elemental" ||
    pyrohelix.mp !== 26 ||
    pyrohelix.cast !== 5 ||
    pyrohelix.recast !== 45 ||
    pyrohelix.range !== 21 ||
    pyrohelix.level !== 24 ||
    pyrohelix.jobLevel?.SCH !== 24 ||
    !geohelix?.helix ||
    geohelix.level !== 18 ||
    geohelix.jobLevel?.SCH !== 18
  ) {
    throw new Error("helix card");
  }
  if (
    spellByName("Hydrohelix")?.level !== 20 ||
    spellByName("Anemohelix")?.level !== 22 ||
    spellByName("Cryohelix")?.level !== 26 ||
    spellByName("Ionohelix")?.level !== 28 ||
    spellByName("Noctohelix")?.level !== 30 ||
    spellByName("Luminohelix")?.level !== 32
  ) {
    throw new Error("helix levels");
  }
  if (spellByName("Pyrohelix II") || spellByName("Luminohelix II")) throw new Error("Helix II is not in this yard");
  if (
    elementFromName("Pyrohelix") !== "fire" ||
    spellElement(pyrohelix) !== "fire" ||
    castElement(pyrohelix) !== "fire" ||
    elementFromName("Cryohelix") !== "ice" ||
    elementFromName("Anemohelix") !== "wind" ||
    elementFromName("Geohelix") !== "earth" ||
    elementFromName("Ionohelix") !== "thunder" ||
    elementFromName("Hydrohelix") !== "water" ||
    elementFromName("Luminohelix") !== "light" ||
    elementFromName("Noctohelix") !== "dark" ||
    castElement(spellByName("Noctohelix")!) !== "dark" ||
    spellElement(spellByName("Luminohelix")!) !== "light"
  ) {
    throw new Error("helix elements");
  }
  if (!geohelix || spellAim(geohelix, "enemy", false) !== "enemy" || spellAim(geohelix, "self", false) !== null || spellAim(geohelix, "none", false) !== null || spellAim(pyrohelix, "enemy", true) !== "enemy") {
    throw new Error("helix aim");
  }
  const blaze = spellByName("Blaze Spikes");
  const ice = spellByName("Ice Spikes");
  const shock = spellByName("Shock Spikes");
  if (!blaze || blaze.school !== "enhancing" || blaze.mp !== 8 || blaze.cast !== 3 || blaze.recast !== 10 || blaze.self !== true || blaze.spike !== "Blaze Spikes" || blaze.nuke != null || blaze.addendum != null || blaze.jobs.includes("DRK") || blaze.jobLevel?.BLM !== 10 || blaze.jobLevel?.RDM !== 20 || blaze.jobLevel?.SCH !== 30) {
    throw new Error("Blaze Spikes card");
  }
  if (!ice || ice.mp !== 16 || ice.jobLevel?.BLM !== 20 || ice.jobLevel?.RDM !== 40 || ice.spike !== "Ice Spikes") throw new Error("Ice Spikes card");
  if (!shock || shock.mp !== 24 || shock.jobLevel?.BLM !== 30 || shock.jobLevel?.RDM !== 60 || shock.spike !== "Shock Spikes") throw new Error("Shock Spikes card");
  if (spellElement(blaze) !== null || castElement(blaze) !== "fire" || castElement(ice!) !== "ice" || castElement(shock!) !== "thunder") {
    throw new Error("spike element");
  }
  if (elementFromName("Blaze Spikes") !== "fire" || elementFromName("Ice Spikes") !== "ice" || elementFromName("Shock Spikes") !== "thunder") {
    throw new Error("spike name");
  }
  const burn = spellByName("Burn");
  const choke = spellByName("Choke");
  const drown = spellByName("Drown");
  const frost = spellByName("Frost");
  const rasp = spellByName("Rasp");
  const shockSpell = spellByName("Shock");
  if (!burn || burn.mp !== 25 || burn.cast !== 2.5 || burn.recast !== 10 || burn.range !== 20 || burn.macc !== 0 || burn.school !== "elemental" || burn.debuff !== "Burn" || burn.jobs.includes("RDM") || burn.jobLevel?.BLM !== 24) {
    throw new Error("Burn card");
  }
  if (!shockSpell || shockSpell.jobLevel?.BLM !== 16 || shockSpell.debuff !== "Shock" || !rasp || rasp.jobLevel?.BLM !== 18 || !choke || choke.jobLevel?.BLM !== 20 || !frost || frost.jobLevel?.BLM !== 22 || !drown || drown.jobLevel?.BLM !== 27) {
    throw new Error("debuff levels");
  }
  if (spellElement(burn) !== "fire" || spellElement(frost!) !== "ice" || spellElement(choke!) !== "wind" || spellElement(rasp!) !== "earth" || spellElement(shockSpell!) !== "thunder" || spellElement(drown!) !== "water") {
    throw new Error("debuff element");
  }
  if (elementFromName("Shock Spikes") !== "thunder" || elementFromName("Shock") !== "thunder") throw new Error("Shock is not Shock Spikes");
  const blind = spellByName("Blind");
  const bind = spellByName("Bind");
  const sleep = spellByName("Sleep");
  const sleepTwo = spellByName("Sleep II");
  const sleepga = spellByName("Sleepga");
  const sleepgaTwo = spellByName("Sleepga II");
  if (!blind || blind.mp !== 5 || blind.cast !== 2 || blind.recast !== 10 || blind.range !== 21 || blind.school !== "enfeebling" || blind.enfeeble !== "Blind" || blind.jobLevel?.BLM !== 4 || blind.jobLevel?.RDM !== 8 || blind.jobs.includes("DRK")) {
    throw new Error("Blind card");
  }
  if (!bind || bind.mp !== 8 || bind.cast !== 2 || bind.recast !== 40 || bind.range !== 20 || bind.jobLevel?.BLM !== 7 || bind.jobLevel?.RDM !== 11 || bind.jobLevel?.DRK !== 20) {
    throw new Error("Bind card");
  }
  if (!sleep || sleep.mp !== 19 || sleep.cast !== 2.5 || sleep.recast !== 30 || sleep.jobLevel?.BLM !== 20 || sleep.jobLevel?.RDM !== 25 || sleep.jobLevel?.DRK !== 30 || sleep.addendum !== "black") {
    throw new Error("Sleep card");
  }
  if (spellListName(sleep!, "SCH", null, 75, 0) !== "(Add.: Black): Sleep" || spellListName(sleep!, "SCH", "BLM", 75, 37) !== "Sleep" || spellListName(sleep!, "SCH", "WHM", 75, 37) !== "(Add.: Black): Sleep" || spellListName(sleep!, "SCH", "RDM", 75, 37) !== "Sleep") {
    throw new Error("Sleep addendum tag");
  }
  if (!sleepTwo || sleepTwo.mp !== 29 || sleepTwo.cast !== 3 || sleepTwo.recast !== 30 || sleepTwo.jobLevel?.BLM !== 41 || sleepTwo.jobLevel?.RDM !== 46 || sleepTwo.jobLevel?.DRK !== 56 || sleepTwo.addendum !== "black" || sleepTwo.jobLevel?.SCH !== 65) {
    throw new Error("Sleep II card");
  }
  if (spellListName(sleepTwo!, "SCH", "BLM", 75, 37) !== "(Add.: Black): Sleep II") throw new Error("Sleep II stays addendum under a level 37 Black Mage");
  const listSilena = spellByName("Silena");
  const stona = spellByName("Stona");
  const stoneFour = spellByName("Stone IV");
  if (!listSilena || spellListName(listSilena, "SCH", null, 75, 0) !== "(Add.: White): Silena" || spellListName(listSilena, "SCH", "WHM", 75, 37) !== "Silena") throw new Error("Silena tag");
  if (!stona || spellListName(stona, "SCH", "WHM", 75, 37) !== "(Add.: White): Stona" || stona.jobLevel?.WHM !== 39 || stona.jobLevel?.SCH !== 50) throw new Error("Stona tag");
  if (!stoneFour || spellListName(stoneFour, "SCH", "BLM", 75, 37) !== "(Add.: Black): Stone IV" || spellListName(stoneFour, "BLM", "SCH", 75, 37) !== "Stone IV") throw new Error("Stone IV tag");
  if (spellListName(blaze!, "SCH", null, 75, 0) !== "Blaze Spikes") throw new Error("spikes are not addendum");
  const raiseBare = spellByName("Raise");
  const eraseCard = spellByName("Erase");
  const reraiseTwo = spellByName("Reraise II");
  if (!raiseBare || spellListName(raiseBare, "SCH", null, 75, 0) !== "Raise") throw new Error("Raise is not addendum");
  if (!eraseCard || eraseCard.addendum !== "white" || spellListName(eraseCard, "SCH", null, 75, 0) !== "(Add.: White): Erase" || spellListName(eraseCard, "SCH", "WHM", 75, 37) !== "Erase") throw new Error("Erase tag");
  if (!reraiseTwo || reraiseTwo.addendum !== "white" || reraiseTwo.jobLevel?.SCH !== 70 || spellListName(reraiseTwo, "SCH", "WHM", 75, 37) !== "(Add.: White): Reraise II") throw new Error("Reraise II tag");
  if (sleepga?.addendum != null || sleepga?.jobs.includes("SCH")) throw new Error("Sleepga is not addendum");
  if (!sleepga || sleepga.mp !== 38 || sleepga.cast !== 3 || sleepga.recast !== 30 || sleepga.jobLevel?.BLM !== 31 || sleepga.jobs.includes("RDM")) {
    throw new Error("Sleepga card");
  }
  if (!sleepgaTwo || sleepgaTwo.mp !== 58 || sleepgaTwo.cast !== 3.5 || sleepgaTwo.recast !== 45 || sleepgaTwo.jobLevel?.BLM !== 56 || sleepgaTwo.jobs.includes("DRK")) {
    throw new Error("Sleepga II card");
  }
  if (spellElement(blind) !== "dark" || spellElement(bind!) !== "ice" || spellElement(sleep!) !== "dark" || spellElement(sleepgaTwo!) !== "dark") {
    throw new Error("enfeeble element");
  }
  const drain = spellByName("Drain");
  const aspir = spellByName("Aspir");
  if (!drain || drain.mp !== 21 || drain.cast !== 3 || drain.recast !== 60 || drain.range !== 20 || drain.school !== "dark" || drain.siphon !== "Drain" || drain.jobLevel?.BLM !== 12 || drain.jobLevel?.DRK !== 10 || drain.jobs.includes("RDM")) {
    throw new Error("Drain card");
  }
  if (!aspir || aspir.mp !== 10 || aspir.cast !== 3 || aspir.recast !== 60 || aspir.range !== 21 || aspir.siphon !== "Aspir" || aspir.jobLevel?.BLM !== 25 || aspir.jobLevel?.DRK !== 20 || aspir.jobs.includes("RDM") || castElement(drain) !== "dark" || castElement(aspir) !== "dark" || spellElement(drain) !== null) {
    throw new Error("Aspir card");
  }
  const warp = spellByName("Warp");
  const warp2 = spellByName("Warp II");
  if (!warp || warp.mp !== 100 || warp.cast !== 3 || warp.recast !== 10 || warp.school !== "enhancing" || warp.self !== true || warp.warp !== "Warp" || warp.jobLevel?.BLM !== 17 || warp.jobs.length !== 1 || castElement(warp) !== "light") {
    throw new Error("Warp card");
  }
  if (!warp2 || warp2.mp !== 150 || warp2.cast !== 5 || warp2.recast !== 10 || warp2.range !== 20 || warp2.self !== true || warp2.warp !== "Warp II" || warp2.jobLevel?.BLM !== 40 || warp2.jobs.includes("WHM") || warp2.jobs.includes("RDM")) {
    throw new Error("Warp II card");
  }
  const cure1 = spellByName("Cure");
  const cure2 = spellByName("Cure II");
  const cure3 = spellByName("Cure III");
  const cure4 = spellByName("Cure IV");
  const cure5 = spellByName("Cure V");
  if (!cure1 || cure1.school !== "healing" || cure1.mp !== 8 || cure1.cast !== 2 || cure1.recast !== 5 || cure1.range !== 20 || cure1.cure !== "Cure" || cure1.self === true || cure1.jobLevel?.WHM !== 1 || cure1.jobLevel?.RDM !== 3 || cure1.jobLevel?.PLD !== 5 || cure1.jobs.includes("BLM")) {
    throw new Error("Cure card");
  }
  if (!cure2 || cure2.mp !== 24 || cure2.cast !== 2.25 || cure2.recast !== 5.5 || cure2.cure !== "Cure II" || cure2.jobLevel?.WHM !== 11 || cure2.jobLevel?.RDM !== 14 || cure2.jobLevel?.PLD !== 17) {
    throw new Error("Cure II card");
  }
  if (!cure3 || cure3.mp !== 46 || cure3.cast !== 2.5 || cure3.recast !== 6 || cure3.jobLevel?.WHM !== 21 || cure3.jobLevel?.RDM !== 26 || cure3.jobLevel?.PLD !== 30) {
    throw new Error("Cure III card");
  }
  if (!cure4 || cure4.mp !== 88 || cure4.cast !== 2.5 || cure4.recast !== 8 || cure4.jobLevel?.WHM !== 41 || cure4.jobLevel?.RDM !== 48 || cure4.jobLevel?.PLD !== 55) {
    throw new Error("Cure IV card");
  }
  if (!cure5 || cure5.mp !== 135 || cure5.cast !== 2.5 || cure5.recast !== 10 || cure5.cure !== "Cure V" || cure5.jobLevel?.WHM !== 61 || cure5.jobs.join(",") !== "WHM") {
    throw new Error("Cure V card");
  }
  if (elementFromName("Cure") !== null || elementFromName("Cure V") !== null || spellElement(cure1) !== null || castElement(cure1) !== "light" || castElement(cure5) !== "light") {
    throw new Error("Cure element");
  }
  const curaga = spellByName("Curaga");
  const curaga2 = spellByName("Curaga II");
  const curaga3 = spellByName("Curaga III");
  const curaga4 = spellByName("Curaga IV");
  if (!curaga || curaga.school !== "healing" || curaga.mp !== 60 || curaga.cast !== 4.5 || curaga.recast !== 10 || curaga.range !== 20 || curaga.radius !== 15 || curaga.curaga !== "Curaga" || curaga.cure != null || curaga.jobLevel?.WHM !== 16 || curaga.jobs.join(",") !== "WHM") {
    throw new Error("Curaga card");
  }
  if (!curaga2 || curaga2.mp !== 120 || curaga2.cast !== 4.75 || curaga2.recast !== 10.25 || curaga2.curaga !== "Curaga II" || curaga2.jobLevel?.WHM !== 31) {
    throw new Error("Curaga II card");
  }
  if (!curaga3 || curaga3.mp !== 180 || curaga3.cast !== 5 || curaga3.recast !== 10.5 || curaga3.jobLevel?.WHM !== 51) throw new Error("Curaga III card");
  if (!curaga4 || curaga4.mp !== 260 || curaga4.cast !== 5.25 || curaga4.recast !== 10.75 || curaga4.curaga !== "Curaga IV" || curaga4.jobLevel?.WHM !== 71 || curaga4.jobs.includes("RDM") || curaga4.jobs.includes("PLD")) {
    throw new Error("Curaga IV card");
  }
  if (elementFromName("Curaga") !== null || elementFromName("Curaga IV") !== null || castElement(curaga) !== "light" || spellElement(curaga) !== null) {
    throw new Error("Curaga element");
  }
  const skin = spellByName("Stoneskin");
  if (!skin || skin.school !== "enhancing" || skin.mp !== 29 || skin.cast !== 7 || skin.recast !== 30 || skin.self !== true || skin.stoneskin !== true || skin.range != null || skin.jobLevel?.WHM !== 28 || skin.jobLevel?.RDM !== 34 || skin.jobLevel?.SCH !== 44 || skin.jobLevel?.RUN !== 55 || skin.jobs.join(",") !== "WHM,RDM,SCH,RUN" || skin.jobs.includes("BLM") || skin.jobs.includes("PLD")) {
    throw new Error("Stoneskin card");
  }
  if (castElement(skin) !== "earth" || spellElement(skin) !== null || elementFromName("Stoneskin") !== "earth") throw new Error("Stoneskin element");
  const protect = spellByName("Protect");
  const protect4 = spellByName("Protect IV");
  const protectra = spellByName("Protectra");
  const protectra5 = spellByName("Protectra V");
  const shell = spellByName("Shell");
  const shell4 = spellByName("Shell IV");
  const shellra5 = spellByName("Shellra V");
  if (!protect || protect.school !== "enhancing" || protect.mp !== 9 || protect.cast !== 1 || protect.recast !== 5 || protect.range !== 20 || protect.self === true || protect.barrier?.kind !== "protect" || protect.barrier.tier !== 1 || protect.barrier.area === true || protect.barrier.effectLevel !== 7 || protect.jobLevel?.WHM !== 7 || protect.jobLevel?.RDM !== 7 || protect.jobLevel?.PLD !== 10 || protect.jobs.includes("BLM")) {
    throw new Error("Protect card");
  }
  if (!protect4 || protect4.mp !== 65 || protect4.cast !== 1.75 || protect4.recast !== 5.75 || protect4.barrier?.tier !== 4 || protect4.jobLevel?.WHM !== 63 || protect4.jobLevel?.RDM !== 63 || protect4.jobLevel?.PLD !== 70) {
    throw new Error("Protect IV card");
  }
  if (!protectra || protectra.mp !== 9 || protectra.cast !== 1 || protectra.recast !== 15 || protectra.radius !== 10 || protectra.self !== true || protectra.range != null || protectra.barrier?.area !== true || protectra.jobs.join(",") !== "WHM") {
    throw new Error("Protectra card");
  }
  if (!protectra5 || protectra5.mp !== 84 || protectra5.cast !== 2 || protectra5.recast !== 19 || protectra5.barrier?.tier !== 5 || protectra5.jobLevel?.WHM !== 75 || spellByName("Protect V") != null) {
    throw new Error("Protectra V card");
  }
  if (!shell || shell.mp !== 18 || shell.cast !== 1 || shell.recast !== 5 || shell.range !== 20 || shell.level !== 10 || shell.barrier?.kind !== "shell" || shell.barrier.tier !== 1 || shell.barrier.effectLevel !== 18 || shell.jobLevel?.WHM !== 17 || shell.jobLevel?.RDM !== 17 || shell.jobLevel?.PLD !== 20 || shell.jobLevel?.SCH !== 20 || shell.jobLevel?.RUN !== 10) {
    throw new Error("Shell card");
  }
  if (!shell4 || shell4.mp !== 75 || shell4.cast !== 1.75 || shell4.recast !== 5.75 || shell4.jobLevel?.WHM !== 68 || shell4.jobLevel?.RDM !== 68 || shell4.jobLevel?.PLD !== 80 || spellUnlocked(shell4, { PLD: 75 })) {
    throw new Error("Shell IV card");
  }
  if (!shellra5 || shellra5.mp !== 93 || shellra5.cast !== 2 || shellra5.recast !== 19 || shellra5.radius !== 10 || shellra5.barrier?.tier !== 5 || shellra5.barrier.effectLevel !== 75 || shellra5.jobLevel?.WHM !== 75 || spellByName("Shell V") != null || spellByName("Shellra")?.barrier?.effectLevel !== 18) {
    throw new Error("Shellra V card");
  }
  if (castElement(protect) !== "light" || castElement(shellra5) !== "light" || spellElement(protect) !== null || elementFromName("Protect") !== null || elementFromName("Shell") !== null) {
    throw new Error("barrier element");
  }
  if (spellAim(protect, "enemy", false) !== "self" || spellAim(protect, "none", false) !== "self" || spellAim(protectra, "enemy", true) !== "self") {
    throw new Error("Protect stays on you");
  }
  const katonSpell = SPELLS.find((spell) => spell.name === "Katon: Ichi");
  if (!katonSpell || spellElement(katonSpell) !== null) throw new Error("ninjutsu is not an elemental chant");
  const looks = Object.keys(ELEMENT_LOOK);
  if (looks.length !== 8 || ELEMENT_LOOK.earth.mote !== "dust" || ELEMENT_LOOK.ice.mote !== "crystal") throw new Error("element looks");
  const cureCard = spellByName("Cure");
  if (!cureCard || !stone || !sleep) throw new Error("aim catalog");
  if (spellAim(cureCard, "enemy", false) !== "self" || spellAim(cureCard, "npc", false) !== "self" || spellAim(cureCard, "none", false) !== "self" || spellAim(cureCard, "self", false) !== "self") {
    throw new Error("Cure falls back to you");
  }
  if (spellAim(cureCard, "enemy", true) !== "enemy") throw new Error("Cure hits undead");
  if (spellAim(curaga, "enemy", false) !== "self" || spellAim(curaga, "npc", false) !== "self" || spellAim(curaga, "none", false) !== "self") {
    throw new Error("Curaga stays on you");
  }
  if (spellAim(stone, "enemy", false) !== "enemy") throw new Error("Stone needs the enemy");
  if (spellAim(stone, "self", false) !== null || spellAim(stone, "npc", false) !== null || spellAim(stone, "none", false) !== null) {
    throw new Error("Stone refuses an invalid target");
  }
  const atomosCard = spellByName("Atomos");
  const carbuncleCard = spellByName("Carbuncle");
  if (!atomosCard || atomosCard.mp !== 50 || atomosCard.cast !== 6 || atomosCard.recast !== 60 || atomosCard.range !== 21 || atomosCard.summon !== "atomos") {
    throw new Error("Atomos card");
  }
  if (spellAim(atomosCard, "enemy", false) !== "enemy" || spellAim(atomosCard, "self", false) !== null || spellAim(atomosCard, "none", false) !== null) {
    throw new Error("Atomos target");
  }
  const alexanderCard = spellByName("Alexander");
  if (!alexanderCard || alexanderCard.mp !== 0 || alexanderCard.cast !== 1 || alexanderCard.recast !== 60 || alexanderCard.range != null || alexanderCard.summon !== "alexander") {
    throw new Error("Alexander card");
  }
  if (spellAim(alexanderCard, "self", false) !== "self" || spellAim(alexanderCard, "enemy", false) !== "self" || spellAim(alexanderCard, "none", false) !== "self") {
    throw new Error("Alexander target");
  }
  if (!carbuncleCard || carbuncleCard.range != null || carbuncleCard.mp !== 5 || spellAim(carbuncleCard, "none", false) !== "self" || spellAim(carbuncleCard, "enemy", false) !== "self") {
    throw new Error("Carbuncle stays a pet");
  }
  if (spellAim(sleep, "self", false) !== null || spellAim(sleep, "npc", false) !== null || spellAim(sleep, "enemy", false) !== "enemy") {
    throw new Error("Sleep target");
  }
  if (spellAim(skin, "enemy", false) !== "self") throw new Error("Stoneskin stays on you");
  const raise = spellByName("Raise");
  const raise2 = spellByName("Raise II");
  const raise3 = spellByName("Raise III");
  const reraise = spellByName("Reraise");
  const reraise2 = spellByName("Reraise II");
  const reraise3 = spellByName("Reraise III");
  if (!raise || raise.mp !== 150 || raise.cast !== 15 || raise.recast !== 60 || raise.range !== 20 || raise.raise !== "Raise" || raise.self === true || raise.jobLevel?.WHM !== 25 || raise.jobLevel?.RDM !== 38 || raise.jobLevel?.PLD !== 50 || raise.jobLevel?.SCH !== 35 || raise.addendum != null) {
    throw new Error("Raise card");
  }
  if (!raise2 || raise2.cast !== 14 || raise2.raise !== "Raise II" || raise2.jobLevel?.WHM !== 56 || raise2.jobLevel?.RDM !== 95 || raise2.jobLevel?.SCH !== 70 || raise2.addendum !== "white" || raise2.jobLevel?.PLD != null || spellUnlocked(raise2, { RDM: 75 })) {
    throw new Error("Raise II card");
  }
  if (!raise3 || raise3.cast !== 13 || raise3.raise !== "Raise III" || raise3.jobLevel?.WHM !== 70 || raise3.jobs.join(",") !== "WHM") throw new Error("Raise III card");
  if (!reraise || reraise.mp !== 150 || reraise.cast !== 8 || reraise.recast !== 60 || reraise.self !== true || reraise.reraise !== "Reraise" || reraise.range != null || reraise.jobLevel?.WHM !== 25 || reraise.jobLevel?.SCH !== 35 || reraise.jobs.join(",") !== "WHM,SCH" || reraise.addendum !== "white") {
    throw new Error("Reraise card");
  }
  if (!reraise2 || reraise2.cast !== 7.5 || reraise2.reraise !== "Reraise II" || reraise2.jobLevel?.WHM !== 56) throw new Error("Reraise II card");
  if (!reraise3 || reraise3.cast !== 7 || reraise3.reraise !== "Reraise III" || reraise3.jobLevel?.WHM !== 70) throw new Error("Reraise III card");
  if (castElement(raise) !== "light" || castElement(reraise3!) !== "light" || spellElement(raise) !== null) throw new Error("raise element");
  if (spellAim(raise, "self", false) !== null || spellAim(raise, "enemy", true) !== null || spellAim(raise, "none", false, true) !== "self") {
    throw new Error("Raise needs a KO");
  }
  if (spellAim(reraise, "none", false) !== "self" || spellAim(reraise, "enemy", false) !== "self") throw new Error("Reraise stays on you");
  const banish = spellByName("Banish");
  const banish2 = spellByName("Banish II");
  const banish3 = spellByName("Banish III");
  const banishga = spellByName("Banishga");
  const banishga2 = spellByName("Banishga II");
  const flash = spellByName("Flash");
  const holy = spellByName("Holy");
  const repose = spellByName("Repose");
  if (!banish || banish.school !== "divine" || banish.mp !== 15 || banish.cast !== 2 || banish.recast !== 15 || banish.range !== 21 || banish.banish !== "Banish" || banish.jobLevel?.WHM !== 5 || banish.jobLevel?.PLD !== 7) {
    throw new Error("Banish card");
  }
  if (!banish2 || banish2.mp !== 57 || banish2.cast !== 2.5 || banish2.recast !== 30 || banish2.banish !== "Banish II" || banish2.jobLevel?.WHM !== 30 || banish2.jobLevel?.PLD !== 34) {
    throw new Error("Banish II card");
  }
  if (!banish3 || banish3.mp !== 96 || banish3.cast !== 3 || banish3.recast !== 45 || banish3.banish !== "Banish III" || banish3.jobLevel?.WHM !== 65 || banish3.jobs.join(",") !== "WHM") {
    throw new Error("Banish III card");
  }
  if (!banishga || banishga.mp !== 41 || banishga.cast !== 2.75 || banishga.recast !== 15 || banishga.radius !== 10 || banishga.banish !== "Banishga" || banishga.jobLevel?.WHM !== 15 || banishga.jobLevel?.PLD !== 30) {
    throw new Error("Banishga card");
  }
  if (!banishga2 || banishga2.mp !== 120 || banishga2.cast !== 4.5 || banishga2.recast !== 30 || banishga2.radius !== 10 || banishga2.jobs.join(",") !== "WHM") {
    throw new Error("Banishga II card");
  }
  if (!flash || flash.mp !== 25 || flash.cast !== 0.5 || flash.recast !== 45 || flash.range !== 20 || flash.flash !== true || flash.jobLevel?.WHM !== 45 || flash.jobLevel?.PLD !== 37) {
    throw new Error("Flash card");
  }
  if (!holy || holy.mp !== 100 || holy.cast !== 0.75 || holy.recast !== 60 || holy.range !== 20 || holy.holy !== true || holy.jobLevel?.WHM !== 50 || holy.jobLevel?.PLD !== 55) {
    throw new Error("Holy card");
  }
  if (!repose || repose.mp !== 26 || repose.cast !== 3 || repose.recast !== 30 || repose.range !== 20 || repose.macc !== 175 || repose.repose !== true || repose.jobLevel?.WHM !== 48 || repose.jobs.join(",") !== "WHM") {
    throw new Error("Repose card");
  }
  if (castElement(banish) !== "light" || castElement(flash) !== "light" || castElement(holy) !== "light" || castElement(repose) !== "light" || spellElement(banish) !== null || spellElement(holy) !== null) {
    throw new Error("divine element");
  }
  if (spellAim(banish, "enemy", false) !== "enemy" || spellAim(banishga, "enemy", true) !== "enemy" || spellAim(holy, "enemy", false) !== "enemy" || spellAim(flash, "enemy", false) !== "enemy" || spellAim(repose, "enemy", false) !== "enemy") {
    throw new Error("divine needs the enemy");
  }
  if (spellAim(banish, "self", false) !== null || spellAim(holy, "none", false) !== null || spellAim(flash, "npc", false) !== null || spellAim(repose, "self", false) !== null || spellAim(banishga2!, "none", false) !== null) {
    throw new Error("divine refuses you");
  }
  const cura = spellByName("Cura");
  if (!cura || cura.school !== "healing" || cura.mp !== 30 || cura.cast !== 3 || cura.recast !== 30 || cura.radius !== 10 || cura.range != null || cura.self !== true || cura.cura !== true || cura.cure != null || cura.curaga != null || cura.jobLevel?.WHM !== 40 || cura.jobs.join(",") !== "WHM") {
    throw new Error("Cura card");
  }
  if (castElement(cura) !== "light" || spellElement(cura) !== null || elementFromName("Cura") !== null) throw new Error("Cura element");
  if (spellAim(cura, "enemy", true) !== "self" || spellAim(cura, "enemy", false) !== "self" || spellAim(cura, "npc", false) !== "self" || spellAim(cura, "none", false) !== "self") {
    throw new Error("Cura stays on you");
  }
  if (spellUnlocked(cura, { WHM: 39 }) || !spellUnlocked(cura, { WHM: 40 }) || spellUnlocked(cura, { PLD: 75 }) || spellUnlocked(cura, { RDM: 75 })) {
    throw new Error("Cura unlock");
  }
  const poisona = spellByName("Poisona");
  const blindna = spellByName("Blindna");
  const esuna = spellByName("Esuna");
  const sacrifice = spellByName("Sacrifice");
  if (!poisona || poisona.cast !== 1 || poisona.mp !== 8 || poisona.recast !== 5 || poisona.range !== 20 || poisona.na !== "Poisona" || poisona.jobLevel?.WHM !== 6) throw new Error("Poisona card");
  if (spellByName("Paralyna")?.mp !== 12 || spellByName("Silena")?.mp !== 24 || spellByName("Cursna")?.mp !== 30 || spellByName("Cursna")?.recast !== 10 || spellByName("Viruna")?.mp !== 48 || spellByName("Stona")?.mp !== 40 || spellByName("Stona")?.jobLevel?.WHM !== 39) {
    throw new Error("na cards");
  }
  if (!esuna || esuna.mp !== 24 || esuna.cast !== 1 || esuna.recast !== 30 || esuna.radius !== 10 || esuna.self !== true || esuna.range != null) throw new Error("Esuna card");
  if (!sacrifice || sacrifice.mp !== 18 || sacrifice.cast !== 1 || sacrifice.recast !== 30 || sacrifice.range !== 20 || sacrifice.sacrifice !== true) throw new Error("Sacrifice card");
  if (elementFromName("Blindna") !== null || elementFromName("Stona") !== null || elementFromName("Esuna") !== null || castElement(poisona) !== "light") {
    throw new Error("na element");
  }
  if (!blindna || spellAim(blindna, "enemy", false) !== "self" || spellAim(esuna, "npc", false) !== "self" || spellAim(sacrifice, "none", false) !== "self") {
    throw new Error("na falls back to you");
  }
  if (cursnaDoomRate(0) !== 10 || cursnaDoomRate(276) !== 19.2 || cursnaDoomRate(613, 70) !== (10 + 613 / 30) * 1.7) throw new Error("Cursna doom rate");
  if (!cursnaDoomLands(276, 0.191) || cursnaDoomLands(276, 0.192)) throw new Error("Cursna doom roll");
  const sample: PlayerAilment[] = [
    { name: "Bio", left: 30 },
    { name: "Poison", left: 20 },
    { name: "Paralysis", left: 20 },
    { name: "Elegy", left: 20 },
    { name: "Curse", left: 20 },
    { name: "Doom", left: 20 },
    { name: "Attack Down", left: 20 },
    { name: "Silence", left: 20 },
  ];
  const poisonaHit = resolveCleanse(poisona, sample, { misery: false, solace: false, healing: 276, roll: 0.99 });
  if (poisonaHit.text !== "Poisona removes Poison." || poisonaHit.ailments.some((row) => row.name === "Poison") || !poisonaHit.ailments.some((row) => row.name === "Paralysis")) {
    throw new Error("Poisona");
  }
  const silena = spellByName("Silena");
  if (!silena || resolveCleanse(silena, sample, { misery: false, solace: false, healing: 0, roll: 1 }).text !== "Silena removes Silence.") throw new Error("Silena");
  if (NA_REMOVES.Silena.includes("Silence") && NA_REMOVES.Silena.length !== 1) throw new Error("Silena only Silence");
  const cursna = spellByName("Cursna");
  if (!cursna) throw new Error("Cursna missing");
  const cursed = resolveCleanse(cursna, sample, { misery: false, solace: false, healing: 276, roll: 0.99 });
  if (cursed.text !== "Cursna removes Curse." || cursed.ailments.some((row) => row.name === "Curse") || !cursed.ailments.some((row) => row.name === "Doom")) throw new Error("Cursna leaves Doom");
  const doomed = resolveCleanse(cursna, sample, { misery: false, solace: false, healing: 276, roll: 0.1 });
  if (doomed.text !== "Cursna removes Curse and Doom." || doomed.ailments.some((row) => row.name === "Doom")) throw new Error("Cursna Doom");
  const bare = resolveCleanse(esuna, sample, { misery: false, solace: false, healing: 0, roll: 0 });
  if (bare.text !== "Esuna removes Poison." || bare.ailments.some((row) => row.name === "Poison") || !bare.ailments.some((row) => row.name === "Bio")) throw new Error("Esuna base");
  const miseried = resolveCleanse(esuna, sample, { misery: true, solace: false, healing: 0, roll: 0 });
  if (miseried.text !== "Esuna removes Bio and Poison." || miseried.ailments.some((row) => row.name === "Elegy") === false) throw new Error("Esuna misery");
  if (resolveCleanse(sacrifice, sample, { misery: false, solace: true, healing: 0, roll: 0 }).text !== "No effect.") throw new Error("Sacrifice on yourself");
  const donor = sacrificeTransfer(sample, false, false);
  if (!donor || donor.taken.map((row) => row.name).join(",") !== "Poison" || donor.kept.some((row) => row.name === "Poison")) throw new Error("Sacrifice donor");
  const solaceDonor = sacrificeTransfer(sample, true, false);
  if (!solaceDonor || solaceDonor.taken.length !== 6 || solaceDonor.taken.some((row) => row.name === "Silence") || solaceDonor.taken.some((row) => row.name === "Doom") || !solaceDonor.taken.some((row) => row.name === "Elegy")) {
    throw new Error("Sacrifice solace");
  }
  if (sacrificeTransfer(sample, true, true) !== null) throw new Error("Sacrifice same person");
  const erase = spellByName("Erase");
  if (!erase || erase.cast !== 2.5 || erase.recast !== 15 || erase.mp !== 18 || erase.range !== 20 || erase.erase !== true || erase.school !== "enhancing" || erase.jobLevel?.WHM !== 32 || erase.jobs.includes("RDM") || castElement(erase) !== "light") {
    throw new Error("Erase card");
  }
  const erased = resolveCleanse(erase, sample, { misery: false, solace: false, healing: 0, roll: 0 });
  if (erased.text !== "Erase removes Bio." || erased.ailments.some((row) => row.name === "Bio") || !erased.ailments.some((row) => row.name === "Poison") || !erased.ailments.some((row) => row.name === "Silence")) {
    throw new Error("Erase");
  }
  const none = resolveCleanse(erase, [{ name: "Poison", left: 10 }, { name: "Silence", left: 10 }], { misery: false, solace: false, healing: 0, roll: 0 });
  if (none.text !== "No effect." || none.ailments.length !== 2) throw new Error("Erase leaves -na effects");
  const aqua = spellByName("Aquaveil");
  const blink = spellByName("Blink");
  const slow = spellByName("Slow");
  const para = spellByName("Paralyze");
  const silence = spellByName("Silence");
  if (!aqua?.aquaveil || aqua.cast !== 5 || aqua.recast !== 10 || aqua.mp !== 12 || aqua.self !== true || aqua.jobLevel?.WHM !== 10 || aqua.jobLevel?.RDM !== 12 || castElement(aqua) !== "water" || spellElement(aqua) !== null) {
    throw new Error("Aquaveil card");
  }
  if (!blink?.blink || blink.cast !== 6 || blink.mp !== 20 || blink.jobLevel?.WHM !== 19 || blink.jobLevel?.RDM !== 23 || castElement(blink) !== "wind" || spellUnlocked(blink, { WHM: 18 })) {
    throw new Error("Blink card");
  }
  const phalanx = spellByName("Phalanx");
  const reprisal = spellByName("Reprisal");
  if (!phalanx?.phalanx || phalanx.cast !== 3 || phalanx.recast !== 10 || phalanx.mp !== 21 || phalanx.self !== true || phalanx.phalanx.effectLevel !== 33 || phalanx.jobLevel?.RDM !== 33 || phalanx.jobLevel?.PLD !== 77 || castElement(phalanx) !== "light" || spellElement(phalanx) !== null || spellUnlocked(phalanx, { RDM: 32 }) || !spellUnlocked(phalanx, { RDM: 33 }) || spellUnlocked(phalanx, { PLD: 75 }) || spellUnlocked(phalanx, { WHM: 75 }) || spellUnlocked(phalanx, { PLD: 77 }) !== true) {
    throw new Error("Phalanx card");
  }
  if (!reprisal?.reprisal || reprisal.cast !== 1 || reprisal.recast !== 180 || reprisal.mp !== 24 || reprisal.self !== true || reprisal.reprisal.effectLevel !== 1 || reprisal.jobs.length !== 1 || reprisal.jobLevel?.PLD !== 61 || castElement(reprisal) !== "light" || spellUnlocked(reprisal, { PLD: 60 }) || !spellUnlocked(reprisal, { PLD: 61 }) || spellUnlocked(reprisal, { RDM: 75 }) || spellUnlocked(reprisal, { PLD: 37 })) {
    throw new Error("Reprisal card");
  }
  if (names({ RDM: 32 }).split(",").includes("Phalanx") || !names({ RDM: 33 }).split(",").includes("Phalanx") || names({ PLD: 60 }).split(",").includes("Reprisal") || !names({ PLD: 61 }).split(",").includes("Reprisal") || names({ PLD: 75 }).split(",").includes("Phalanx")) {
    throw new Error("Phalanx or Reprisal unlock");
  }
  if (!para || para.enfeeble !== "Paralyze" || para.castGroup !== "white" || para.school !== "enfeebling" || para.mp !== 6 || para.cast !== 3 || para.recast !== 10 || para.range !== 21 || para.macc !== -10 || para.jobLevel?.WHM !== 4 || para.jobLevel?.RDM !== 6 || castElement(para) !== "ice") {
    throw new Error("Paralyze card");
  }
  if (!slow || slow.enfeeble !== "Slow" || slow.cast !== 2 || slow.recast !== 20 || slow.mp !== 15 || slow.macc !== 10 || slow.jobLevel?.WHM !== 13 || slow.jobLevel?.RDM !== 13 || castElement(slow) !== "earth" || spellElement(slow) !== null) {
    throw new Error("Slow card");
  }
  if (!silence || silence.enfeeble !== "Silence" || silence.cast !== 3 || silence.mp !== 16 || silence.macc !== 0 || silence.jobLevel?.WHM !== 15 || silence.jobLevel?.RDM !== 18 || castElement(silence) !== "wind" || silence.jobs.includes("BLM")) {
    throw new Error("Silence card");
  }
  const gravity = spellByName("Gravity");
  const dispel = spellByName("Dispel");
  const inundation = spellByName("Inundation");
  const blindTwo = spellByName("Blind II");
  const paraTwo = spellByName("Paralyze II");
  const slowTwo = spellByName("Slow II");
  if (!gravity || gravity.enfeeble !== "Gravity" || gravity.castGroup != null || gravity.mp !== 24 || gravity.cast !== 1.5 || gravity.recast !== 60 || gravity.range !== 20 || gravity.jobLevel?.RDM !== 21 || gravity.jobs.includes("BLM") || castElement(gravity) !== "wind" || spellElement(gravity) !== "wind") {
    throw new Error("Gravity card");
  }
  if (!dispel || dispel.enfeeble !== "Dispel" || dispel.mp !== 25 || dispel.cast !== 3 || dispel.recast !== 10 || dispel.range !== 21 || dispel.macc !== 175 || dispel.jobLevel?.RDM !== 32 || dispel.jobLevel?.SCH !== 32 || dispel.addendum !== "black" || dispel.jobs.length !== 2 || castElement(dispel) !== "dark") {
    throw new Error("Dispel card");
  }
  const distract = spellByName("Distract");
  const frazzle = spellByName("Frazzle");
  if (!distract || distract.enfeeble !== "Distract" || distract.castGroup != null || distract.mp !== 32 || distract.cast !== 3 || distract.recast !== 10 || distract.range !== 21 || distract.macc !== 150 || distract.jobLevel?.RDM !== 35 || distract.jobs.length !== 1 || castElement(distract) !== "ice" || spellElement(distract) !== null) {
    throw new Error("Distract card");
  }
  if (!frazzle || frazzle.enfeeble !== "Frazzle" || frazzle.castGroup != null || frazzle.mp !== 38 || frazzle.cast !== 3 || frazzle.recast !== 10 || frazzle.range !== 21 || frazzle.macc !== 150 || frazzle.jobLevel?.RDM !== 42 || frazzle.jobs.length !== 1 || castElement(frazzle) !== "dark" || spellElement(frazzle) !== null) {
    throw new Error("Frazzle card");
  }
  if (spellUnlocked(distract, { RDM: 34 }) || !spellUnlocked(distract, { RDM: 35 }) || spellUnlocked(frazzle, { RDM: 41 }) || !spellUnlocked(frazzle, { RDM: 42 })) {
    throw new Error("Distract level");
  }
  if (spellUnlocked(distract, { BLM: 75 }) || spellUnlocked(frazzle, { WHM: 75 }) || !spellUnlocked(distract, { BLM: 75, RDM: 37 }) || spellUnlocked(frazzle, { BLM: 75, RDM: 37 })) {
    throw new Error("Distract jobs");
  }
  const bio = spellByName("Bio");
  const bioTwo = spellByName("Bio II");
  const bioThree = spellByName("Bio III");
  const stun = spellByName("Stun");
  if (!bio || bio.enfeeble !== "Bio" || bio.school !== "dark" || bio.mp !== 15 || bio.cast !== 1.5 || bio.recast !== 5 || bio.range !== 21 || bio.macc !== 10 || bio.jobLevel?.BLM !== 10 || bio.jobLevel?.RDM !== 10 || bio.jobLevel?.DRK !== 15 || castElement(bio) !== "dark" || spellElement(bio) !== null) {
    throw new Error("Bio card");
  }
  if (!bioTwo || bioTwo.enfeeble !== "Bio II" || bioTwo.mp !== 36 || bioTwo.cast !== 1.5 || bioTwo.recast !== 5 || bioTwo.jobLevel?.BLM !== 35 || bioTwo.jobLevel?.RDM !== 36 || bioTwo.jobLevel?.DRK !== 40 || castElement(bioTwo) !== "dark") {
    throw new Error("Bio II card");
  }
  if (!bioThree || bioThree.enfeeble !== "Bio III" || bioThree.mp !== 54 || bioThree.cast !== 1.5 || bioThree.recast !== 15 || bioThree.jobLevel?.RDM !== 75 || bioThree.jobs.length !== 1 || bioThree.jobs.includes("BLM") || castElement(bioThree) !== "dark") {
    throw new Error("Bio III card");
  }
  if (!stun || stun.enfeeble !== "Stun" || stun.school !== "dark" || stun.mp !== 25 || stun.cast !== 0.5 || stun.recast !== 45 || stun.range !== 21 || stun.macc !== 200 || stun.jobLevel?.BLM !== 45 || stun.jobLevel?.DRK !== 37 || stun.jobs.includes("RDM") || castElement(stun) !== "thunder" || spellElement(stun) !== null) {
    throw new Error("Stun card");
  }
  if (spellUnlocked(bio, { RDM: 9 }) || !spellUnlocked(bio, { RDM: 10 }) || spellUnlocked(bioTwo, { RDM: 35 }) || !spellUnlocked(bioTwo, { RDM: 36 }) || spellUnlocked(bioThree, { RDM: 74 }) || !spellUnlocked(bioThree, { RDM: 75 })) {
    throw new Error("Bio level");
  }
  if (spellUnlocked(stun, { RDM: 75 }) || spellUnlocked(stun, { BLM: 44 }) || !spellUnlocked(stun, { BLM: 45 }) || spellUnlocked(stun, { DRK: 36 }) || !spellUnlocked(stun, { DRK: 37 })) {
    throw new Error("Stun level");
  }
  if (!inundation || inundation.enfeeble !== "Inundation" || inundation.castGroup !== "white" || inundation.mp !== 48 || inundation.cast !== 3 || inundation.recast !== 20 || inundation.range !== 21 || inundation.jobLevel?.RDM !== 64 || inundation.jobs.includes("WHM") || castElement(inundation) !== "light") {
    throw new Error("Inundation card");
  }
  if (!blindTwo || blindTwo.enfeeble !== "Blind II" || blindTwo.castGroup != null || blindTwo.mp !== 31 || blindTwo.cast !== 3 || blindTwo.recast !== 20 || blindTwo.macc !== 10 || blindTwo.jobLevel?.RDM !== 75 || blindTwo.jobs.includes("BLM") || castElement(blindTwo) !== "dark") {
    throw new Error("Blind II card");
  }
  if (!paraTwo || paraTwo.enfeeble !== "Paralyze II" || paraTwo.castGroup !== "white" || paraTwo.mp !== 36 || paraTwo.cast !== 3 || paraTwo.recast !== 20 || paraTwo.range !== 20 || paraTwo.macc !== 10 || paraTwo.jobLevel?.RDM !== 75 || paraTwo.jobs.includes("WHM") || castElement(paraTwo) !== "ice") {
    throw new Error("Paralyze II card");
  }
  if (!slowTwo || slowTwo.enfeeble !== "Slow II" || slowTwo.castGroup !== "white" || slowTwo.mp !== 45 || slowTwo.range !== 20 || slowTwo.macc !== 10 || slowTwo.jobLevel?.RDM !== 75 || castElement(slowTwo) !== "earth") {
    throw new Error("Slow II card");
  }
  if (spellAim(para, "enemy", false) !== "enemy" || spellAim(para, "self", false) !== null || spellAim(aqua, "enemy", false) !== "self" || spellAim(erase, "enemy", true) !== "self") {
    throw new Error("white spell aim");
  }
  const indi = spellByName("Indi-Regen");
  const geoRegen = spellByName("Geo-Regen");
  const stonera = spellByName("Stonera");
  const watera2 = spellByName("Watera II");
  const vex = spellByName("Geo-Vex");
  if (!indi || indi.school !== "geomancy" || indi.mp !== 37 || indi.cast !== 4 || indi.recast !== 12 || indi.self !== true || indi.colure?.effect !== "regen" || indi.jobLevel?.GEO !== 15 || !spellUnlocked(indi, { GEO: 15 }, undefined, "GEO") || spellUnlocked(indi, { GEO: 14 }, undefined, "GEO")) {
    throw new Error("Indi-Regen card");
  }
  if (!geoRegen || geoRegen.mp !== 74 || geoRegen.cast !== 8 || geoRegen.recast !== 24 || geoRegen.range !== 21 || geoRegen.colure?.side !== "geo" || spellUnlocked(geoRegen, { WAR: 75, GEO: 37 }, undefined, "WAR") || !spellUnlocked(geoRegen, { GEO: 75 }, undefined, "GEO")) {
    throw new Error("Geo-Regen is main only");
  }
  if (spellAim(indi, "enemy", false) !== "self" || spellAim(geoRegen, "enemy", false) !== "enemy" || spellAim(geoRegen, "none", false) !== null) throw new Error("colure aim");
  if (!stonera || stonera.mp !== 67 || stonera.cast !== 1.5 || stonera.recast !== 5 || stonera.range != null || stonera.self !== true || stonera.radius !== 10 || stonera.nuke !== "Stonera" || stonera.jobLevel?.GEO !== 25 || stonera.jobs.join(",") !== "GEO" || spellUnlocked(stonera, { WHM: 75 }) || spellUnlocked(stonera, { SCH: 75 })) {
    throw new Error("Stonera card");
  }
  if (spellAim(stonera, "enemy", false) !== "self" || spellAim(stonera, "none", false) !== "self") throw new Error("Stonera aims at you");
  const aera = spellByName("Aera");
  const fira = spellByName("Fira");
  const thundara = spellByName("Thundara");
  if (!aera || aera.mp !== 94 || aera.cast !== 1.5 || aera.recast !== 5 || aera.self !== true || aera.radius !== 10 || aera.jobLevel?.GEO !== 35 || spellByName("Aerora") != null || castElement(aera) !== "wind") {
    throw new Error("Aera card");
  }
  if (!fira || fira.mp !== 108 || fira.jobLevel?.GEO !== 40 || fira.radius !== 10 || !thundara || thundara.mp !== 135 || thundara.jobLevel?.GEO !== 50 || thundara.cast !== 1.5 || castElement(spellByName("Blizzara")!) !== "ice") {
    throw new Error("Fira or Thundara card");
  }
  if (!watera2 || watera2.mp !== 185 || watera2.cast !== 3 || watera2.recast !== 15 || watera2.jobLevel?.GEO !== 75 || !vex || vex.mp !== 273 || vex.jobLevel?.GEO !== 74) {
    throw new Error("Watera II or Geo-Vex");
  }
  if (spellByName("Indi-Frailty") != null || spellByName("Geo-Haste") != null || spellByName("Stone IV")?.jobLevel?.GEO != null) throw new Error("GEO past 75");
  const subIndi = spellsKnown({ WAR: 75, GEO: 37 }, undefined, "WAR").filter((spell) => spell.colure);
  if (subIndi.some((spell) => spell.colure?.side === "geo") || !subIndi.some((spell) => spell.name === "Indi-MND") || !subIndi.some((spell) => spell.name === "Indi-Fury") || !subIndi.some((spell) => spell.name === "Indi-INT") || subIndi.some((spell) => spell.name === "Indi-AGI")) {
    throw new Error("GEO subjob colures");
  }
}
