import { useEffect, useState } from "react";
import { Sword } from "lucide-react";
import {
  ALL_ITEM_IDS,
  canEquipInSub,
  canWear,
  derive,
  HARE,
  ITEMS,
  jugCount,
  LEVEL,
  oilCount,
  PAPER_DOLL,
  petFoodCount,
  petFoodCounts,
  SLOT_LABEL,
  type Item,
  type Slot,
} from "@/game/content";
import { bonusesFor, describeMagian, emptyMagian } from "@/game/magian";
import { emptyEquipSets, overlayGear, underGear, type EquipMode } from "@/game/equipsets";
import { BAG_SLOTS, bagCells } from "@/game/inventory";
import { JOB_NAME, RACES, type AttrKey, type JobId } from "@/game/stats";
import { PLAYABLE, combinedSkill, subjobLevel } from "@/game/jobs";
import { WAR_ABILITIES, WAR_SKILLS, WAR_TRAITS, maxHpBoost, type WarAccess } from "@/game/war";
import { MNK_ABILITIES, MNK_SKILLS, MNK_TRAITS, mnkMaxHp } from "@/game/mnk";
import { THF_ABILITIES, THF_SKILLS, THF_TRAITS } from "@/game/thf";
import { SAM_ABILITIES, SAM_SKILLS, SAM_TRAITS } from "@/game/sam";
import { RNG_ABILITIES, RNG_SKILLS, RNG_TRAITS } from "@/game/rng";
import { PLD_ABILITIES, PLD_SKILLS, PLD_TRAITS, pldMaxHp } from "@/game/pld";
import { NIN_ABILITIES, NIN_SKILLS, NIN_TRAITS, ninMaxHp, ninjutsuDamage, utsusemiShadows, TONKO_ICHI_SECONDS, TONKO_NI_SECONDS, MONOMI_SECONDS, KURAYAMI_ICHI_SECONDS, KURAYAMI_NI_SECONDS, DOKUMORI_SECONDS, JUBAKU_SECONDS, HOJO_SECONDS, HOJO_SLOW, NIN_RESIST_DOWN, NIN_RESIST_SECONDS } from "@/game/nin";
import { BRD_ABILITIES, BRD_SKILLS, BRD_TRAITS, instrumentKind, pianissimoCast, songByName, songCard, SONG_RADIUS } from "@/game/brd";
import { DRK_ABILITIES, DRK_SKILLS, DRK_TRAITS } from "@/game/drk";
import { DRG_ABILITIES, DRG_SKILLS, DRG_TRAITS } from "@/game/drg";
import { SMN_ABILITIES, SMN_PACTS, SMN_SKILLS, SMN_TRAITS, perpetuation, perfectDefenseSeconds, summonByName, summonCostsAllMp } from "@/game/smn";
import { BST_ABILITIES, BST_SKILLS, BST_TRAITS, CARRIE_READY, PET_FOODS, rewardBiscuit } from "@/game/bst";
import { ACTINIC_BURST, ACTINIC_CE, ACTINIC_RADIUS, ACTINIC_SECONDS, ACTINIC_VE, BATTLE_DANCE, BATTLE_DEX, BATTLE_RADIUS, BATTLE_SECONDS, BLAST_BIND, BLASTBOMB, BLU_ABILITIES, BLU_SKILLS, BLU_TRAITS, BLUE_CONE, BLUE_SPELLS, BLUDGEON, BLUDGEON_MULT, BREEZE_RADIUS, CANNONBALL, CHAOTIC_CE, CHAOTIC_EYE, CHAOTIC_RANGE, CHAOTIC_VE, CLAW_ATTACK, CLAW_ATTACK_AZURE, CLAW_CYCLONE, CLAW_FTP, COCOON, COCOON_CE, COCOON_SECONDS, COCOON_VE, CURSED_SPHERE, DEATH_RAY, DEATH_RAY_AZURE, DEATH_RAY_FTP, DEATH_RAY_RANGE, DIGEST, DIGEST_CE, DIGEST_RANGE, DIGEST_VE, DISSEVER_POISON_SECONDS, DISSEVERMENT, FEATHER_POISON, FEATHER_STORM, FRENETIC_RIP, HEAD_BUTT, HEAD_BUTT_FTP, HEAD_BUTT_FTP_AZURE, HEAD_BUTT_MULT, HEALING_BREEZE, HELLDIVE, HELLDIVE_FTP, HELLDIVE_FTP_AZURE, HELLDIVE_MULT, MAGIC_FRUIT, MEMENTO_CE, MEMENTO_MAB, MEMENTO_MORI, MEMENTO_SECONDS, MEMENTO_VE, METAL_CE, METAL_SECONDS, METAL_VE, METALLIC_BODY, MIND_BLAST, MIND_BLAST_FTP, MIND_BLAST_PARA, MIND_BLAST_PARA_SECONDS, MIND_BLAST_RANGE, PINECONE_AZURE, PINECONE_BOMB, PINECONE_RANGE, PINECONE_SECONDS, PLASMA_CHARGE, PLASMA_CE, PLASMA_SECONDS, PLASMA_VE, POISON_BREATH, POISON_BREATH_DOT, POISON_BREATH_RANGE, SOPORIFIC, SOPORIFIC_RADIUS, SOPORIFIC_SECONDS, SOUND_BLAST, SOUND_CE, SOUND_INT, SOUND_RADIUS, SOUND_SECONDS, SOUND_VE, SMITE_FTP, SMITE_FTP_AZURE, SMITE_MULT, SMITE_OF_RAGE, SCREWDRIVER, SCREWDRIVER_AZURE_CRIT, SCREWDRIVER_FTP, SCREWDRIVER_MULT, BOMB_TOSS, GRAND_SLAM, GRAND_ATTACK, GRAND_ATTACK_AZURE, GRAND_RADIUS, POISON_BREATH_SECONDS, POLLEN, POWER_ATTACK, POWER_ATTACK_AZURE_CRIT, POWER_ATTACK_FTP, POWER_ATTACK_MULT, QUEASY_POISON, QUEASY_SECONDS, QUEASYSHROOM, REFUEL_CE, REFUEL_HASTE, REFUEL_SECONDS, REFUEL_VE, REFUELING, SANDSPIN, SANDSPIN_ACC, SANDSPIN_RADIUS, SANDSPIN_SECONDS, SHEEP_CE, SHEEP_HIGH, SHEEP_LOW, SHEEP_RADIUS, SHEEP_SONG, SHEEP_VE, SPROUT_SLOW, SPROUT_SMACK, UPPERCUT, WILD_OATS, WILD_OATS_FTP, WILD_OATS_TICK, WILD_OATS_VIT, ZEPHYR_CE, ZEPHYR_MANTLE, ZEPHYR_SECONDS, ZEPHYR_SHADOWS, ZEPHYR_VE, blueOrbRaw, bluePointCap, blueSetTraits, blueSpellByName, deathRayRaw, digestRaw, dissevermentPoison, healingBreezeBase, healingBreezePower, magicFruitBase, metallicBodyPower, mindBlastRaw, mysteriousLightRaw, poisonBreathRaw, pollenBase, sandspinRaw, wildCarrotBase, wildCarrotPower, BLANK_GAZE, JET_STREAM, JET_MULT, MYSTERIOUS_LIGHT, TERROR_TOUCH, TERROR_ATTACK_NUMER, TERROR_ATTACK_SECONDS, TERROR_MULT, VENOM_SHELL, MP_DRAINKISS, BLITZSTRAHL, STINKING_GAS, MANDIBULAR_BITE, BITE_ATTACK, BITE_ATTACK_AZURE, MAGNETITE_CLOUD, kissRaw, blitzRaw, magnetiteCloudRaw, saberRaw, iceBreakRaw, GEIST_WALL, AWFUL_EYE, BLOOD_SABER, JETTATURA, ICE_BREAK, SELF_DESTRUCT, FRIGHTFUL_ROAR, COLD_WAVE, FILAMENTED_HOLD, HECATOMB_WAVE, RADIANT_BREATH, FEATHER_BARRIER, FLYING_HIP_PRESS, LIGHT_OF_PENANCE, DEATH_SCISSORS, DEATH_FTP, DEATH_FTP_AZURE, DEATH_ATTACK, selfDestructRaw, coldWaveFrost, hecatombWaveRaw, radiantBreathRaw, hipPressRaw, blueMaxHpBoost, DIMENSIONAL_DEATH, DIMENSION_ATTACK, DIMENSION_FTP, SPIRAL_SPIN, SPIRAL_ACC, SPIRAL_SECONDS, MAELSTROM, MAEL_STR, maelRaw, EYES_ON_ME, EYES_AZURE, eyesRaw, SEEDSPRAY, SEED_FTP, SEED_SECONDS, HYDRO_SHOT, HYDRO_RANGE, HYDRO_FTP, HYDRO_ATTACK, FEATHER_TICKLE, FEATHER_TICKLE_RANGE, FEATHER_TICKLE_TP, FEATHER_TICKLE_CE, FEATHER_TICKLE_VE, YAWN, YAWN_RADIUS, YAWN_SECONDS, YAWN_CE, YAWN_VE, VORACIOUS_TRUNK, TRUNK_RANGE, TRUNK_CE, TRUNK_VE, INFRASONICS, INFRA_RANGE, INFRA_EVA, INFRA_SECONDS, INFRA_CE, INFRA_VE, FROST_BREATH, FROST_RANGE, FROST_PARALYZE, FROST_SECONDS, SANDSPRAY, SANDSPRAY_RANGE, SANDSPRAY_ACC, SANDSPRAY_SECONDS, SANDSPRAY_CE, SANDSPRAY_VE, CORROSIVE_OOZE, OOZE_RANGE, OOZE_SECONDS, OOZE_DOWN, OOZE_CE, DIAMONDHIDE, HIDE_SECONDS, HIDE_RADIUS, HIDE_CE, HIDE_VE, ENERVATION, ENERV_RADIUS, ENERV_SECONDS, ENERV_MDB, ENERV_CE, ENERV_VE, frostBreathRaw, corrosiveOozeRaw, diamondhidePower, WARM_UP, FIRESPIT, TAIL_SLAP, TAIL_ATTACK, TAIL_ATTACK_AZURE, TAIL_STUN, HYSTERIC_BARRAGE, HYSTERIC_FTP, HYSTERIC_FTP_AZURE, REGURGITATION, firespitRaw, regurgitationRaw, AMPLIFICATION, ASURAN_CLAWS, ASURAN_MULT, LOWING, HEAT_BREATH, TRIUMPHANT_ROAR, heatBreathRaw, BLUE_ACC_DIV, BLUE_ACC_AZURE, SICKLE_SLASH, SICKLE_FTP, SICKLE_MULT, SICKLE_AZURE_CRIT, SUBZERO_SMASH, SUBZERO_FTP, SUBZERO_MULT, SUBZERO_PARA, SUBZERO_PARA_SECONDS, SALINE_COAT, SALINE_SECONDS, SALINE_MDB, SALINE_TICK, RAM_CHARGE, RAM_FTP, RAM_FTP_AZURE, RAM_MULT, TEMPORAL_SHIFT, SHIFT_RADIUS, SHIFT_SECONDS, MAGIC_HAMMER, magicHammerRaw, REACTOR_COOL, REACTOR_SECONDS, REACTOR_DEFENSE, REACTOR_SPIKE, EXUVIATION, EXUV_CAP, exuviationBase, VERTICAL_CLEAVE, CLEAVE_FTP, CLEAVE_MULT, CLEAVE_ATTACK, CLEAVE_ATTACK_AZURE } from "@/game/blu";
import { BLM_ABILITIES, BLM_SKILLS, BLM_TRAITS, type JobAccess } from "@/game/blm";
import { PUP_ABILITIES, PUP_SKILLS, PUP_TRAITS } from "@/game/pup";
import { COR_ABILITIES, COR_SKILLS, COR_TRAITS } from "@/game/cor";
import { DNC_ABILITIES, DNC_SKILLS, DNC_TRAITS } from "@/game/dnc";
import { SCH_ABILITIES, SCH_SKILLS, SCH_TRAITS, darkArtsHelixBonus, helixSeconds, HELIX_TOCK_CAP, HELIX_TOCK_GAP, KLIMAFORM_SECONDS, STORM_OPPOSE, STORM_SECONDS, stormByName } from "@/game/sch";
import { RUN_ABILITIES, RUN_SKILLS, RUN_TRAITS, runMaxHp } from "@/game/run";
import { GEO_ABILITIES, GEO_SKILLS, GEO_TRAITS, COLURE_YARDS, colureLine, colurePower, geoElement } from "@/game/geo";
import {
  AUTO_ATTACHMENTS,
  AUTO_ELEMENT_COLOR,
  AUTO_ELEMENT_LABEL,
  AUTO_ELEMENT_ROWS,
  AUTO_FRAMES,
  AUTO_HEADS,
  AUTO_SLOTS,
  autoFrame,
  autoHead,
  elementalCapacity,
  usedCapacity,
} from "@/game/automaton";
import { WHM_ABILITIES, WHM_SKILLS, WHM_TRAITS } from "@/game/whm";
import { RDM_ABILITIES, RDM_SKILLS, RDM_TRAITS } from "@/game/rdm";
import { useGame } from "@/game/store";
import { meleeStats } from "@/game/abilities";
import { ammoCount } from "@/game/ranged";
import {
  applyMab,
  elementalD,
  helixD,
  elementalCastSeconds,
  elementDebuffPotency,
  blindPotency,
  spikeBase,
  spikeDamage,
  siphonMax,
  siphonMin,
  DEBUFF_SECONDS,
  DEBUFF_STAT,
  DEBUFF_STAT_LABEL,
  BLIND_SECONDS,
  BIND_SECONDS,
  WEAKNESS_SECONDS,
  BIND_CE,
  BIND_VE,
  SPIKE_SECONDS,
  STONESKIN_SECONDS,
  sleepSeconds,
  stoneskinPower,
  curePower,
  cureBase,
  cureUndeadD,
  curagaPower,
  curagaBase,
  banishDamage,
  holyDamage,
  BANISH_DOWN,
  FLASH_SECONDS,
  FLASH_ACC,
  FLASH_CE,
  FLASH_VE,
  BARRIER_SECONDS,
  BARRIER_CE,
  BARRIER_VE,
  BARRIER_AREA_VE,
  PROTECT_DEF,
  protectPower,
  SHELL_CUT,
  REGEN_HP,
  REGEN_SECONDS,
  REGEN_CE,
  REGEN_VE,
  HASTE_NUMER,
  HASTE_SECONDS,
  HASTE_CE,
  HASTE_VE,
  REFRESH_MP,
  REFRESH_SECONDS,
  REFRESH_CE,
  REFRESH_VE,
  RERAISE_SECONDS,
  enhancingDuration,
  raiseExpFraction,
  raiseFromReraise,
  raiseHpRestored,
  AUSPICE_SUBTLE_BLOW,
  AUSPICE_SECONDS,
  AUSPICE_CE,
  AUSPICE_VE,
  AUSPICE_MISS_ACC,
  AUSPICE_MISS_ACC_CAP,
  enspellTwoBase,
  auspiceAccuracy,
  slowPotency,
  slowTwoPotency,
  slowDelayFactor,
  paralyzeChance,
  paralyzeTwoChance,
  DIA_DEF,
  DIA_DOT,
  DIA_HIT,
  DIA_SECONDS,
  poisonSeconds,
  poisonPotency,
  poisongaPotency,
  POISON_CE,
  POISON_VE,
  BIO_ATK,
  BIO_HIT,
  BIO_SECONDS,
  BIO_CE,
  BIO_VE,
  bioPotency,
  STUN_SECONDS,
  STUN_MACC,
  STUN_CE,
  STUN_VE,
  blindTwoPotency,
  SLOW_SECONDS,
  SLOW_II_SECONDS,
  PARALYZE_SECONDS,
  PARALYZE_II_SECONDS,
  BLIND_II_SECONDS,
  GRAVITY_SECONDS,
  GRAVITY_MOVE,
  INUNDATION_SECONDS,
  DISPEL_MACC,
  SILENCE_SECONDS,
  DISTRACT_SECONDS,
  FRAZZLE_SECONDS,
  DISTRACT_CE,
  DISTRACT_VE,
  FRAZZLE_CE,
  FRAZZLE_VE,
  evasionDownPotency,
  aquaveilCharges,
  AQUAVEIL_SECONDS,
  BLINK_SECONDS,
  BLINK_SHADOWS,
  AQUAVEIL_CE,
  AQUAVEIL_VE,
  BLINK_CE,
  BLINK_VE,
  phalanxPower,
  PHALANX_SECONDS,
  PHALANX_CE,
  PHALANX_VE,
  REPRISAL_SECONDS,
  REPRISAL_CE,
  REPRISAL_VE,
  REPRISAL_REFLECT,
  REPRISAL_SKILL,
  REPRISAL_BLOCK,
  SLOW_CE,
  SLOW_VE,
  PARALYZE_CE,
  PARALYZE_VE,
  SILENCE_CE,
  SILENCE_VE,
  ERASE_CE,
  ERASE_VE,
  elementalBarResistance,
  STATUS_BAR_RESIST,
  BAR_SECONDS,
  barResistLabel,
  dStatMagicAccuracy,
  type ElementalSpell,
} from "@/game/magic";
import { chartResistance, composedMagicAccuracy, damageChart, durationChart, monsterMagicEvasion } from "@/game/resist";
import { cursnaDoomRate, spellLevel, spellListName, spellsKnown, ENSPELL_SECONDS, ENSPELL_CE, ENSPELL_VE, ENSPELL_II_CE, ENSPELL_II_VE, ENSPELL_OPPOSED, NINJUTSU_CONSUMES_TOOLS, type Spell, elementFromName } from "@/game/spells";
import { NO_HASTE, hitRate, swingTiming } from "@/game/formulas";
import {
  ARCHERY_SKILLS,
  AXE_SKILLS,
  CLUB_SKILLS,
  DAGGER_SKILLS,
  GREAT_AXE_SKILLS,
  GREAT_KATANA_SKILLS,
  GREAT_SWORD_SKILLS,
  HAND_SKILLS,
  KATANA_SKILLS,
  MARKSMANSHIP_SKILLS,
  POLEARM_SKILLS,
  SCYTHE_SKILLS,
  STAFF_SKILLS,
  SWORD_SKILLS,
  type StatKey,
  type SwordWs,
} from "@/game/weaponskills";

const SWATCH: Record<string, string> = {
  bronze: "#c47b3a",
  wood: "#8d7340",
  sea: "#3d7dff",
  cloth: "#2f6dff",
  oil: "#8a5a28",
};

const ATTRS: { key: AttrKey; label: string }[] = [
  { key: "str", label: "STR" },
  { key: "dex", label: "DEX" },
  { key: "vit", label: "VIT" },
  { key: "agi", label: "AGI" },
  { key: "int", label: "INT" },
  { key: "mnd", label: "MND" },
  { key: "chr", label: "CHR" },
];

/** Fire Wind Lightning Light / Ice Earth Water Dark, the retail order. */
const ELEMENTS: { name: string; color: string; key: string }[] = [
  { name: "Fire", color: "#e23d3d", key: "fire" },
  { name: "Wind", color: "#3cba4a", key: "wind" },
  { name: "Lightning", color: "#d15ad8", key: "thunder" },
  { name: "Light", color: "#f4ecd4", key: "light" },
  { name: "Ice", color: "#7fd4ea", key: "ice" },
  { name: "Earth", color: "#e3c04a", key: "earth" },
  { name: "Water", color: "#3d7dff", key: "water" },
  { name: "Dark", color: "#6b5344", key: "dark" },
];

const STAT_LINES: { key: keyof Item; label: string; signed?: boolean }[] = [
  { key: "dmg", label: "DMG" },
  { key: "delay", label: "Delay" },
  { key: "acc", label: "Accuracy", signed: true },
  { key: "def", label: "DEF" },
  { key: "hp", label: "HP", signed: true },
  { key: "mp", label: "MP", signed: true },
  { key: "str", label: "STR", signed: true },
  { key: "dex", label: "DEX", signed: true },
  { key: "vit", label: "VIT", signed: true },
  { key: "agi", label: "AGI", signed: true },
  { key: "int", label: "INT", signed: true },
  { key: "mnd", label: "MND", signed: true },
  { key: "chr", label: "CHR", signed: true },
];

function jobCanWear(item: Item, job: JobId, sub: JobId | null): boolean {
  return canWear(item, job, sub);
}

function nakedMeva(): number {
  return monsterMagicEvasion(HARE.level);
}

/** Job-book magic accuracy. Ninjutsu passes a null stat. The hare's live debuffs are not in this number. */
function bookMacc(
  spell: Spell,
  sheet: { job: JobId; sub: JobId | null; subLevel: number; int: number; mnd: number },
  skillName: string,
  stat: "int" | "mnd" | null,
): number {
  const skill = combinedSkill(skillName, sheet.job, LEVEL, sheet.sub, sheet.subLevel);
  const dStat = stat == null ? null : sheet[stat] - (stat === "int" ? HARE.int : HARE.mnd);
  return composedMagicAccuracy(skill, dStat, spell.macc ?? 0);
}

const GEAR_TABS: { id: EquipMode; label: string }[] = [
  { id: "idle", label: "Idle" },
  { id: "tp", label: "TP" },
  { id: "ws", label: "WS" },
  { id: "magic", label: "Magic" },
];

export function EquipmentMenu() {
  const gearBase = useGame((s) => s.gearBase ?? s.loadout);
  const equipSets = useGame((s) => s.equipSets);
  const engaged = useGame((s) => s.engaged);
  const inventory = useGame((s) => s.inventory);
  const race = useGame((s) => s.race);
  const mainJob = useGame((s) => s.mainJob);
  const subJob = useGame((s) => s.subJob);
  const jobLevels = useGame((s) => s.jobLevels);
  const mainLevel = jobLevels?.[mainJob] ?? LEVEL;
  const subShown = subJob ? Math.min(subjobLevel(mainLevel), jobLevels?.[subJob] ?? subjobLevel(mainLevel)) : 0;
  const sheet = useGame((s) => s.sheet);
  const tp = useGame((s) => s.tp);
  const setMainJob = useGame((s) => s.setMainJob);
  const setSubJob = useGame((s) => s.setSubJob);
  const equip = useGame((s) => s.equip);
  const unequip = useGame((s) => s.unequip);
  const close = useGame((s) => s.setEquipOpen);
  const blueSet = useGame((s) => s.blueSet);
  const magian = useGame((s) => s.magian ?? emptyMagian());
  const [activeSlot, setActiveSlot] = useState<Slot | null>(null);
  const [inspectedId, setInspectedId] = useState<string | null>(null);
  const [view, setView] = useState<"gear" | "job" | "blu" | "pup">("gear");
  const [gearTab, setGearTab] = useState<EquipMode>("idle");
  const sets = equipSets ?? emptyEquipSets();
  const setRow = sets[gearTab];
  const fighting = gearTab === "ws" || (gearTab === "magic" && engaged);
  const under = underGear(gearTab, gearBase, sets, mainJob, subJob, fighting);
  const draft = { ...setRow };
  if (inspectedId && activeSlot) draft[activeSlot] = inspectedId;
  const preview = derive(overlayGear(under, draft, mainJob, subJob), race, mainJob, subJob, mainJob === "BLU" ? blueSet : [], bonusesFor(magian));
  const buffs = useGame((s) => s.buffs);
  const runLevel = mainJob === "RUN" ? LEVEL : subJob === "RUN" ? subjobLevel(LEVEL) : 0;
  const resist = chartResistance(buffs, runLevel);
  const buffNames = buffs.map((buff) => buff.name);
  const ward = protectPower(buffs);
  const bonusAcc = auspiceAccuracy(buffs);
  const live = meleeStats(sheet, buffNames, ward, bonusAcc);
  const livePreview = meleeStats(preview, buffNames, ward, bonusAcc);
  const inspected = inspectedId ? ITEMS[inspectedId] : null;
  const inscribed = inspected ? describeMagian(inspected.id, magian) : null;
  const tpPct = Math.floor(tp / 10);

  const shownMain = setRow.main ?? under.main;
  const twoHanded = Boolean(shownMain && ITEMS[shownMain]?.grip === "two");
  const mainItem = shownMain ? ITEMS[shownMain] : null;
  const choices =
    activeSlot == null
      ? []
      : ALL_ITEM_IDS.filter((id) => {
          const item = ITEMS[id];
          if (!item) return false;
          if (item.kind === "Pet Food") return false;
          if (!jobCanWear(item, mainJob, subJob)) return false;
          if (item.kind === "Jug" && jugCount(inventory, id) < 1) return false;
          if (item.kind === "Oil" && oilCount(inventory) < 1) return false;
          if (PAPER_DOLL.some((slot) => slot !== activeSlot && setRow[slot] === id)) return false;
          if (activeSlot === "sub") return canEquipInSub(item, mainJob, subJob, mainItem);
          return item.slot === activeSlot;
        });

  function pickSlot(slot: Slot) {
    setActiveSlot((current) => {
      if (current === slot) return null;
      return slot;
    });
    setInspectedId(null);
  }

  return (
    <section className="ffxi-frame mx-auto flex h-full min-h-0 w-full max-w-3xl flex-col overflow-hidden" style={{ background: "#12141a" }}>
      <header className="flex items-center justify-between gap-2 border-b border-gold-dim/70 px-2 py-2">
        <div className="flex min-w-0 flex-1 flex-wrap gap-1">
          <button
            type="button"
            onClick={() => setView("gear")}
            className={`h-10 border px-2 font-display text-lg leading-none ${view === "gear" ? "border-gold text-gold" : "border-[#3a3d46] text-muted"}`}
          >
            Equipment
          </button>
          <button
            type="button"
            onClick={() => setView("job")}
            className={`h-10 border px-2 font-display text-lg leading-none ${view === "job" ? "border-gold text-gold" : "border-[#3a3d46] text-muted"}`}
          >
            Job
          </button>
          <button
            type="button"
            onClick={() => setView("blu")}
            className={`h-10 border px-2 font-display text-lg leading-none ${view === "blu" ? "border-gold text-gold" : "border-[#3a3d46] text-muted"}`}
          >
            BLU
          </button>
          <button
            type="button"
            onClick={() => setView("pup")}
            className={`h-10 border px-2 font-display text-lg leading-none ${view === "pup" ? "border-gold text-gold" : "border-[#3a3d46] text-muted"}`}
          >
            PUP
          </button>
        </div>
        <button
          type="button"
          className="h-10 shrink-0 border border-gold px-2 text-sm font-semibold text-ink"
          onClick={() => close(false)}
        >
          Close
        </button>
      </header>
      <div className="relative min-h-0 flex-1 overflow-hidden">
        <div className={view === "gear" ? "flex h-full min-h-0 flex-col overflow-hidden" : "h-full overflow-y-auto"}>
          <div className={view === "gear" ? "flex min-h-0 flex-1 flex-col p-2 sm:p-3" : "p-2 sm:p-3"}>
            {view === "gear" ? (
              <div className="mb-2">
                <div className="flex flex-wrap gap-1">
                  {GEAR_TABS.map((entry) => (
                    <button
                      key={entry.id}
                      type="button"
                      onClick={() => {
                        setGearTab(entry.id);
                        setActiveSlot(null);
                        setInspectedId(null);
                      }}
                      className={`border px-2 py-0.5 font-sans text-[11px] ${gearTab === entry.id ? "border-gold text-gold" : "border-[#3a3d46] text-muted"}`}
                    >
                      {entry.label}
                    </button>
                  ))}
                </div>
                <p className="mt-1 text-[10px] text-muted">Idle is the main set. An empty slot on TP, WS, or Magic uses the Idle piece. An empty Idle slot keeps what is already equipped.</p>
              </div>
            ) : view === "job" ? (
              <div className="mb-2 grid grid-cols-2 gap-2">
                <label className="block">
                  <span className="mb-1 block font-sans text-[11px] tracking-[0.14em] text-gold">MAIN</span>
                  <select
                    value={mainJob}
                    onChange={(event) => setMainJob(event.target.value as JobId)}
                    className="h-10 w-full border border-gold bg-[#12141a] px-2 text-base text-ink"
                    style={{ colorScheme: "dark" }}
                  >
                    {PLAYABLE.map((id) => (
                      <option key={id} value={id}>
                        {JOB_NAME[id]} {jobLevels?.[id] ?? LEVEL}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1 block font-sans text-[11px] tracking-[0.14em] text-gold">SUBJOB</span>
                  <select
                    value={subJob ?? ""}
                    onChange={(event) => setSubJob(event.target.value === "" ? null : (event.target.value as JobId))}
                    className="h-10 w-full border border-[#c4b48a] bg-[#12141a] px-2 text-base text-ink"
                    style={{ colorScheme: "dark" }}
                  >
                    <option value="">None</option>
                    {PLAYABLE.filter((id) => id !== mainJob).map((id) => (
                      <option key={id} value={id}>
                        {JOB_NAME[id]} {jobLevels?.[id] ?? LEVEL}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            ) : null}
            {view === "job" ? (
              <JobBook />
            ) : view === "blu" ? (
              <BlueBook />
            ) : view === "pup" ? (
              <PupBook />
            ) : (
              <div className="flex min-h-0 flex-1 flex-col">
              <div className="grid shrink-0 grid-cols-[7.4rem_minmax(0,1fr)] gap-2 sm:gap-3">
                <div className="font-mono text-[12px] leading-tight text-ink sm:text-[13px]">
                  <p className="text-center tracking-[0.18em] text-ink">Status</p>
                  <p className="mt-2 font-sans text-sm font-semibold sm:text-base">Xanosuke</p>
                  <p className="mt-1">
                    Lv{mainLevel} {JOB_NAME[mainJob]}
                    {subJob ? ` / ${JOB_NAME[subJob]} ${subShown}` : ""}
                  </p>
                  <div className="mt-3 grid grid-cols-[2.4rem_1fr] gap-y-1">
                    <span>HP</span>
                    <Pool now={sheet.hp} next={preview.hp} />
                    <span>MP</span>
                    <Pool now={sheet.mp} next={preview.mp} />
                    <span>TP</span>
                    <span className="tabular-nums">{tpPct}%</span>
                  </div>
                  <div className="mt-3 grid grid-cols-[2.4rem_1.6rem_2.2rem] gap-y-1">
                    {ATTRS.map((row) => (
                      <AttrRow
                        key={row.key}
                        label={row.label}
                        base={sheet.naked[row.key]}
                        bonus={preview[row.key] - preview.naked[row.key]}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {PAPER_DOLL.map((slot) => (
                      <SlotButton
                        key={slot}
                        slot={slot}
                        itemId={setRow[slot] ?? null}
                        selected={activeSlot === slot}
                        onSelect={() => pickSlot(slot)}
                      />
                    ))}
                  </div>
                  <div className="mt-3 flex justify-between gap-3 font-mono text-sm text-ink">
                    <span>
                      Attack <Delta now={live.attack} next={livePreview.attack} />
                    </span>
                    <span>
                      Defense <Delta now={live.defense} next={livePreview.defense} />
                    </span>
                  </div>
                  <p className="mt-1 font-mono text-xs text-muted">
                    {preview.skillName} <Delta now={sheet.skill} next={preview.skill} />
                  </p>
                  <div className="mt-2 grid grid-cols-4 gap-x-2 gap-y-1 font-mono text-xs text-ink">
                    {ELEMENTS.map((el) => (
                      <span key={el.name} className="flex items-center gap-1.5" title={el.name}>
                        <span className="inline-block size-3 rounded-full" style={{ background: el.color }} />
                        <span className="tabular-nums">{resist[el.key] ?? 0}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <Bag
                used={bagCells(inventory)}
                activeSlot={activeSlot}
                setPiece={activeSlot ? setRow[activeSlot] ?? null : null}
                twoHanded={twoHanded}
                fits={(id) => choices.includes(id)}
                onClear={() => {
                  if (!activeSlot) return;
                  unequip(activeSlot, gearTab);
                  setInspectedId(null);
                }}
                onPick={(id) => setInspectedId(id)}
                onDismiss={() => setActiveSlot(null)}
              />
              </div>
            )}
          </div>
        </div>
        {inspected && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/55 p-3" onClick={() => setInspectedId(null)}>
            <div
              className="max-h-full w-full max-w-sm overflow-y-auto border border-gold p-3"
              style={{ background: "#12141a" }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center gap-2">
                <span className="inline-block size-3" style={{ background: SWATCH[inspected.swatch] }} />
                <p className="font-display text-2xl leading-none text-gold">{inspected.name}</p>
              </div>
              <p className="mt-1 text-xs text-muted">
                {inspected.kind} · Lv {inspected.level}
              </p>
              <p className="mt-2 font-mono text-sm text-ink">{inspected.line}</p>
              {inscribed ? <p className="mt-2 font-mono text-sm text-gold">{inscribed}</p> : null}
              <dl className="mt-3 grid grid-cols-[5.5rem_1fr] gap-y-1 font-mono text-sm">
                {STAT_LINES.map((row) => {
                  const value = inspected[row.key];
                  if (typeof value !== "number") return null;
                  const text = row.signed && value > 0 ? `+${value}` : String(value);
                  return (
                    <span key={row.label} className="contents">
                      <dt className="text-muted">{row.label}</dt>
                      <dd>{text}</dd>
                    </span>
                  );
                })}
              </dl>
              <p className="mt-2 text-[11px] leading-relaxed text-muted">{inspected.jobs}</p>
              <div className="mt-3 flex gap-2">
                {inspected.kind === "Pet Food" ? (
                  <p className="flex-1 text-sm text-muted">It stays in the bag. Reward uses one. It does not go in the ammo slot. ×{petFoodCount(inventory, inspected.id)}.</p>
                ) : (
                  <>
                    {activeSlot && choices.includes(inspected.id) ? (
                      <button
                        type="button"
                        onClick={() => {
                          equip(inspected.id, activeSlot, gearTab);
                          setInspectedId(null);
                        }}
                        className="h-10 flex-1 border border-gold bg-gold text-sm font-semibold text-navy"
                      >
                        Equip
                      </button>
                    ) : null}
                    {PAPER_DOLL.some((slot) => setRow[slot] === inspected.id) ? (
                      <button
                        type="button"
                        onClick={() => {
                          const worn = PAPER_DOLL.find((slot) => setRow[slot] === inspected.id);
                          if (worn) unequip(worn, gearTab);
                          setInspectedId(null);
                        }}
                        className="h-10 flex-1 border border-gold px-3 text-sm font-semibold text-gold"
                      >
                        Unequip
                      </button>
                    ) : null}
                  </>
                )}
                <button
                  type="button"
                  onClick={() => setInspectedId(null)}
                  className="h-10 border border-gold px-3 text-sm font-semibold text-gold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

const ACCESS: Record<WarAccess | JobAccess, string> = {
  sub: "Sub",
  "master-sub": "Master sub",
  main: "Main",
};

const SCHOOL: Record<Spell["school"], string> = {
  healing: "Healing",
  divine: "Divine",
  enhancing: "Enhancing",
  enfeebling: "Enfeebling",
  elemental: "Elemental",
  dark: "Dark",
  summoning: "Summoning",
  singing: "Singing",
  ninjutsu: "Ninjutsu",
  blue: "Blue",
  geomancy: "Geomancy",
};

const ANCIENT = new Set<ElementalSpell>(["Freeze", "Tornado", "Quake", "Burst", "Flood", "Flare"]);

const WS_BOOKS: { weapon: string; rows: readonly SwordWs[] }[] = [
  { weapon: "Hand-to-Hand", rows: HAND_SKILLS },
  { weapon: "Dagger", rows: DAGGER_SKILLS },
  { weapon: "Sword", rows: SWORD_SKILLS },
  { weapon: "Great Sword", rows: GREAT_SWORD_SKILLS },
  { weapon: "Axe", rows: AXE_SKILLS },
  { weapon: "Great Axe", rows: GREAT_AXE_SKILLS },
  { weapon: "Scythe", rows: SCYTHE_SKILLS },
  { weapon: "Polearm", rows: POLEARM_SKILLS },
  { weapon: "Katana", rows: KATANA_SKILLS },
  { weapon: "Great Katana", rows: GREAT_KATANA_SKILLS },
  { weapon: "Club", rows: CLUB_SKILLS },
  { weapon: "Staff", rows: STAFF_SKILLS },
  { weapon: "Archery", rows: ARCHERY_SKILLS },
  { weapon: "Marksmanship", rows: MARKSMANSHIP_SKILLS },
];

type Held<T> = { job: JobId; row: T };

type Detail =
  | { kind: "stat"; id: string }
  | { kind: "spell"; name: string }
  | { kind: "ability"; job: JobId; name: string }
  | { kind: "trait"; job: JobId; name: string }
  | { kind: "ws"; weapon: string; name: string };

function clock(seconds: number): string {
  if (seconds <= 0) return "—";
  const m = Math.floor(seconds / 60);
  const remain = seconds - m * 60;
  if (Number.isInteger(remain)) return `${m}:${String(remain).padStart(2, "0")}`;
  const text = (Math.round(remain * 100) / 100).toFixed(2).replace(/0$/, "");
  return `${m}:${text}`;
}

function secs(seconds: number): string {
  if (seconds >= 60) return clock(seconds);
  const text = Number.isInteger(seconds) ? String(seconds) : String(Math.round(seconds * 100) / 100);
  return `${text}s`;
}

function num(n: number): string {
  const rounded = Math.round(n * 1000) / 1000;
  return String(rounded);
}

function abilityBook(job: JobId) {
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
  if (job === "SMN") {
    return [
      ...SMN_ABILITIES,
      ...SMN_PACTS.map((pact) => ({
        name: pact.name,
        level: pact.level,
        access: pact.access,
        merit: pact.merit,
        recast: 0,
        duration: 0,
        effect: `${pact.avatar} · ${pact.kind === "ward" ? "Ward" : "Rage"}. ${pact.effect} On the Blood Pacts bar. A pet command, not a spell.`,
        ce: 0,
        ve: 0,
      })),
    ];
  }
  if (job === "BST") {
    return [
      ...BST_ABILITIES,
      ...CARRIE_READY.map((move) => ({
        name: move.name,
        level: 1,
        access: "main" as const,
        recast: 0,
        duration: 0,
        effect: `Ready. ${move.effect}`,
        ce: 0,
        ve: 0,
      })),
    ];
  }
  if (job === "BLU") return BLU_ABILITIES;
  if (job === "PUP") return PUP_ABILITIES;
  if (job === "COR") return COR_ABILITIES;
  if (job === "DNC") return DNC_ABILITIES;
  if (job === "SCH") return SCH_ABILITIES;
  if (job === "RUN") return RUN_ABILITIES;
  if (job === "GEO") return GEO_ABILITIES;
  return WAR_ABILITIES;
}

function traitBook(job: JobId) {
  if (job === "BLM") return BLM_TRAITS;
  if (job === "WHM") return WHM_TRAITS;
  if (job === "RDM") return RDM_TRAITS;
  if (job === "MNK") return MNK_TRAITS;
  if (job === "THF") return THF_TRAITS;
  if (job === "SAM") return SAM_TRAITS;
  if (job === "RNG") return RNG_TRAITS;
  if (job === "PLD") return PLD_TRAITS;
  if (job === "NIN") return NIN_TRAITS;
  if (job === "BRD") return BRD_TRAITS;
  if (job === "DRK") return DRK_TRAITS;
  if (job === "DRG") return DRG_TRAITS;
  if (job === "SMN") return SMN_TRAITS;
  if (job === "BST") return BST_TRAITS;
  if (job === "BLU") return BLU_TRAITS;
  if (job === "PUP") return PUP_TRAITS;
  if (job === "COR") return COR_TRAITS;
  if (job === "DNC") return DNC_TRAITS;
  if (job === "SCH") return SCH_TRAITS;
  if (job === "RUN") return RUN_TRAITS;
  if (job === "GEO") return GEO_TRAITS;
  return WAR_TRAITS;
}

function skillBook(job: JobId) {
  if (job === "BLM") return BLM_SKILLS;
  if (job === "WHM") return WHM_SKILLS;
  if (job === "RDM") return RDM_SKILLS;
  if (job === "MNK") return MNK_SKILLS;
  if (job === "THF") return THF_SKILLS;
  if (job === "SAM") return SAM_SKILLS;
  if (job === "RNG") return RNG_SKILLS;
  if (job === "PLD") return PLD_SKILLS;
  if (job === "NIN") return NIN_SKILLS;
  if (job === "BRD") return BRD_SKILLS;
  if (job === "DRK") return DRK_SKILLS;
  if (job === "DRG") return DRG_SKILLS;
  if (job === "SMN") return SMN_SKILLS;
  if (job === "BST") return BST_SKILLS;
  if (job === "BLU") return BLU_SKILLS;
  if (job === "PUP") return PUP_SKILLS;
  if (job === "COR") return COR_SKILLS;
  if (job === "DNC") return DNC_SKILLS;
  if (job === "SCH") return SCH_SKILLS;
  if (job === "RUN") return RUN_SKILLS;
  if (job === "GEO") return GEO_SKILLS;
  return WAR_SKILLS;
}

function held<T extends { name: string; level: number; access: WarAccess | JobAccess; merit?: boolean }>(
  job: JobId,
  rows: readonly T[],
  asMain: boolean,
  level: number,
): Held<T>[] {
  return rows
    .filter((row) => !row.merit && row.level <= level && (asMain || row.access === "sub"))
    .sort((a, b) => a.level - b.level || a.name.localeCompare(b.name))
    .map((row) => ({ job, row }));
}

function areaNuke(name: string): boolean {
  return /ga(\s|$)/i.test(name);
}

const NIN_ELEMENT_LABEL = {
  fire: "Fire",
  ice: "Ice",
  wind: "Wind",
  earth: "Earth",
  lightning: "Lightning",
  water: "Water",
} as const;

function ninElementName(spell: Spell): string {
  const el = spell.nin?.element;
  return el ? NIN_ELEMENT_LABEL[el] : "None";
}

function ninjutsuDuration(spell: Spell): string {
  const spec = spell.nin;
  if (!spec) return "—";
  if (spec.kind === "invisible") return clock(spec.tier >= 2 ? TONKO_NI_SECONDS : TONKO_ICHI_SECONDS);
  if (spec.kind === "sneak") return clock(MONOMI_SECONDS);
  if (spec.kind === "shadow") return "15:00, or until the shadows are gone";
  if (spec.kind === "blind") return clock(spec.tier >= 2 ? KURAYAMI_NI_SECONDS : KURAYAMI_ICHI_SECONDS);
  if (spec.kind === "slow") return "Varies";
  if (spec.kind === "poison") return clock(DOKUMORI_SECONDS);
  if (spec.kind === "paralyze") return clock(JUBAKU_SECONDS);
  return clock(NIN_RESIST_SECONDS);
}

function ninjutsuCost(spell: Spell): string {
  const tool = spell.tool;
  if (!tool) return "—";
  const alt = tool.substitute ? `, or ${tool.substitute} if Ninja is main` : "";
  const spent = NINJUTSU_CONSUMES_TOOLS ? "Spent." : "Not spent.";
  return `${tool.name}${alt}. 0 MP. ${spent}`;
}

function ninjutsuEffect(spell: Spell, skill: number, dInt: number, main: boolean): string {
  const spec = spell.nin;
  if (!spec) return "—";
  const tool = "The specific tool is used before the master tool.";
  if (spec.kind === "invisible") {
    const minutes = (spec.tier >= 2 ? TONKO_NI_SECONDS : TONKO_ICHI_SECONDS) / 60;
    const party = spec.tier >= 2 ? " It does not cover the party. The page's target is Self." : "";
    return `Grants Invisible for ${minutes} minutes. Lessens detection by sight. The Invisible page says it wears off when you are attacked, cast a spell, or use most abilities. True Sight is not in this yard.${party} The infobox left element blank. Cumulative enmity 1, volatile 0. The cast adds that enmity. ${tool}`;
  }
  if (spec.kind === "sneak") {
    return `Grants Sneak for ${MONOMI_SECONDS / 60} minutes. Lessens detection by sound. The infobox left element blank. Cumulative enmity 80, volatile 240. The cast adds that enmity. ${tool}`;
  }
  if (spec.kind === "shadow") {
    const shadows = utsusemiShadows(spec.tier >= 2 ? 2 : 1, main);
    const who = spec.tier >= 2
      ? `Ninja main grants 4 shadows. A subjob grants 3. This is ${shadows}.`
      : "3 shadows, whether Ninja is main or sub.";
    const overwrite = spec.tier >= 2
      ? "It overwrites itself and Utsusemi: Ichi."
      : "It does not overwrite Utsusemi: Ni while that still has a shadow. Utsusemi: Ni overwrites this.";
    return `${who} Each shadow absorbs one melee attack or one single-target spell. Lasts 15 minutes, or until the shadows are gone. ${overwrite} Yonin changes the enmity to cumulative 160 and volatile 480. Otherwise it is cumulative 0 and volatile 160. The cast adds that enmity. Yagyu Darkblade's party shadows are not in this kit. The infobox left element blank. ${tool}`;
  }
  if (spec.kind === "blind") {
    const down = spec.tier >= 2 ? 30 : 20;
    const seconds = spec.tier >= 2 ? KURAYAMI_NI_SECONDS : KURAYAMI_ICHI_SECONDS;
    const dur = clock(seconds);
    const rule = spec.tier >= 2
      ? "It overwrites Kurayami: Ichi and Blind."
      : "Kurayami: Ni overwrites this. A stronger Blind already up is no effect.";
    return `Blind. Accuracy −${down} for ${dur}. It stacks with Accuracy Down. It is not the dINT Blind formula. ${rule} ${durationChart(skill, monsterMagicEvasion(HARE.level), seconds)} Ninjutsu magic accuracy is the skill alone. The infobox left element blank. Cumulative enmity 20, volatile 100. The cast adds that enmity. ${tool}`;
  }
  if (spec.kind === "slow") {
    const power = spec.tier >= 2 ? HOJO_SLOW[2] : HOJO_SLOW[1];
    const wait = Math.round((HARE.delay / 60) * slowDelayFactor(power) * 100) / 100;
    const hate = spec.tier >= 2 ? "Cumulative enmity 80, volatile 240." : "Cumulative enmity 20, volatile 100.";
    return `Static Slow ${power}/1024. The Tropical Rarab's delay ${HARE.delay} is ${HARE.delay / 60} seconds, and that becomes ${wait}. It is not the dMND Slow formula. The infobox prints Varies. A partial resist is not rolled, so this yard keeps ${HOJO_SECONDS / 60} minutes. The infobox left element blank. The ninjutsu page calls Hojo an earth-based spell, with Doton. ${hate} The cast adds that enmity. ${tool}`;
  }
  if (spec.kind === "poison") {
    return `Poison. 3 HP every tick for 1 minute. The page prints 1 minute and 3 damage a tick. This yard uses the 3-second tick. It lands as Poison, so a Poison spell replaces it and this replaces a Poison already up. ${durationChart(skill, monsterMagicEvasion(HARE.level), DOKUMORI_SECONDS)} Ninjutsu magic accuracy is the skill alone. The infobox left element blank. Cumulative enmity 20, volatile 100. The cast adds that enmity. ${tool}`;
  }
  if (spec.kind === "paralyze") {
    return `Paralyze. Each auto-attack or TP move has a 20% chance to be canceled. The page calls that a proc rate and says the effect is assumed to be static. ${durationChart(skill, monsterMagicEvasion(HARE.level), JUBAKU_SECONDS)} Ninjutsu magic accuracy is the skill alone. Jubaku: Ni is a monster spell and is not here. It lands as Paralyze. The infobox left element blank. Cumulative enmity 20, volatile 100. The cast adds that enmity. ${tool}`;
  }
  const element = NIN_ELEMENT_LABEL[spec.element ?? "fire"].toLowerCase();
  const weaken = spec.weaken ? NIN_ELEMENT_LABEL[spec.weaken].toLowerCase() : null;
  const hit = ninjutsuDamage(spec.tier, skill, dInt);
  const row = spec.tier === 1 ? "V is 28 and M is 0.5." : spec.tier === 2 ? "V is 69 and M is 1." : "V is 134 and M is 1.5.";
  const resist = weaken
    ? ` Lowers ${weaken} resistance by ${NIN_RESIST_DOWN}. The ninjutsu page prints that 30, the same on Ichi, Ni, and San. The infobox left the duration blank. This yard keeps it for ${NIN_RESIST_SECONDS} seconds. A merit would add 2 seconds and is not unlocked. A later spell of that element subtracts ${NIN_RESIST_DOWN} from the Tropical Rarab's magic evasion.`
    : "";
  const haste = spec.kind === "huton" ? " It does not grant Haste. The description is wind damage and ice resistance down." : "";
  const macc = composedMagicAccuracy(skill, null, 0);
  return `Deals ${element} damage to one enemy. The unresisted hit against the Tropical Rarab, at Ninjutsu ${skill} and dINT ${dInt}, is ${hit}. dINT changes the damage and does not add magic accuracy. ${damageChart(macc, monsterMagicEvasion(HARE.level))} ${row} The skill term is the ninjutsu page's potency, and it holds at the tier's skill ceiling. Staff, day, weather, affinity, Magic Attack Bonus, and Magic Damage stay out. Innin is not in this number.${resist}${haste} The infobox left element blank. Cumulative and volatile enmity are −D−. That enmity is not added. Futae is past 75. ${tool}`;
}

function elementName(el: string): string {
  if (el === "thunder") return "Lightning";
  if (!el) return "—";
  return el.charAt(0).toUpperCase() + el.slice(1);
}

function colureEffect(spell: Spell, geomancy: number, handbell: number): string {
  if (!spell.colure) return "—";
  const power = colurePower(spell.colure.effect, geomancy, handbell, false, false, false);
  const told = colureLine(spell.colure.effect, power, spell.colure.side);
  const indi = spell.colure.side === "indi";
  const place = indi
    ? "The bubble follows you. A support Geomancer can cast it."
    : "A main Geomancer places the luopan on the target. A support job cannot cast this.";
  const swap = indi ? "Another Indicolure replaces this one." : "Another Geocolure replaces the luopan.";
  return `${told} Geomancy ${geomancy} and Handbell ${handbell} set that number. Bolster, Blaze of Glory, and Ecliptic Attrition are not in it. ${place} ${swap} The aura is ${COLURE_YARDS}'.`;
}

function raiseEffect(spell: Spell, maxHp: number): string {
  if (!spell.raise) return "—";
  const hp = raiseHpRestored(spell.raise, maxHp);
  const exp = Math.round(raiseExpFraction(spell.raise, LEVEL) * 100);
  return `Revives a KO'd player. A living target is no effect. On a body whose maximum is ${maxHp}, they stand with ${hp} HP. That is a share of the maximum after Weakness has cut it by 75%. Weakness lasts 5:00 and doubles attack delay. A raise while Weakness remains becomes double weakness and starts the five minutes again. Experience is not spent here. The spell would return ${exp}% of what was lost. Enmity is dynamic, so none is added.`;
}

function reraiseEffect(spell: Spell, maxHp: number): string {
  if (!spell.reraise) return "—";
  const asRaise = raiseFromReraise(spell.reraise);
  const hp = raiseHpRestored(asRaise, maxHp);
  return `Keeps ${asRaise} on you for ${clock(RERAISE_SECONDS)}. It does not stand you up now. On KO you would rise with ${hp} HP, from a maximum of ${maxHp} after Weakness. Any Reraise replaces any other, including a weaker one. It is not dispelled. A main-job change removes it.`;
}

function foilEffect(): string {
  const seconds = enhancingDuration(30, 58, LEVEL);
  return `Evasion against special attacks +150 for ${clock(seconds)}. It loses 3 every 3 seconds. Embolden makes the opening evasion 225 and cuts that duration in half. It is added to evasion. Cumulative enmity 320, volatile enmity 880.`;
}

function summonEffect(spell: Spell, summoning: number): string {
  const spec = summonByName(spell.name);
  if (!spec) return "—";
  const element = elementName(spec.element);
  if (spec.id === "atomos") {
    return `Calls Atomos onto one enemy. ${element}. It uses Deconstruction and Chronoshift, then leaves. There is no perpetuation. The cost is ${spec.mp} MP.`;
  }
  if (spec.id === "alexander") {
    return `Calls Alexander during Astral Flow. ${element}. The cost is all of your current MP. He uses Perfect Defense for ${perfectDefenseSeconds(summoning)} seconds at Summoning Magic ${summoning}, then leaves, and Astral Flow ends. The damage cut is not numbered, so it is not applied.`;
  }
  if (spec.id === "odin") {
    return `Calls Odin during Astral Flow. ${element}. The cost is all of your current MP. He uses Zantetsuken, then leaves, and Astral Flow ends.`;
  }
  const perp = perpetuation(spec.id, LEVEL);
  const kind = spec.family === "spirit" ? "spirit" : "avatar";
  const siphon = spec.family === "spirit" ? " Elemental Siphon needs a spirit, and it does not dismiss this one." : "";
  return `Calls ${spec.name}. ${element} ${kind}. Initial MP ${spec.mp}. Perpetuation at level ${LEVEL} is ${perp} MP every 3 seconds. One pet at a time. Release sends it away.${siphon}`;
}

function spellCost(spell: Spell): string {
  if (spell.tool) return ninjutsuCost(spell);
  if (spell.summon && summonCostsAllMp(spell.summon)) return "All MP";
  if (spell.mp != null) return `${spell.mp} MP`;
  return "—";
}

function elementLabel(spell: Spell): string {
  if (spell.school === "blue") {
    if (spell.name === "Soporific") return "Dark";
    if (spell.name === "Sound Blast") return "Fire";
    if (spell.name === "Death Ray" || spell.name === "Digest" || spell.name === "MP Drainkiss") return "Dark";
    if (spell.blue != null && ("cure" in spell.blue || "flash" in spell.blue || "song" in spell.blue || "pollen" in spell.blue)) return "Light";
    if (spell.blue != null && "spikes" in spell.blue) return "Lightning";
    if (spell.blue != null && ("silence" in spell.blue || "mantle" in spell.blue || "refuel" in spell.blue)) return "Wind";
    if (spell.blue != null && ("cocoon" in spell.blue || "sand" in spell.blue || "metal" in spell.blue)) return "Earth";
    if (spell.blue != null && "breeze" in spell.blue) return "None";
    if (spell.name === "Blastbomb" || spell.name === "Bomb Toss") return "Fire";
    if (spell.name === "Cursed Sphere" || spell.name === "Poison Breath" || spell.name === "Venom Shell") return "Water";
    if (spell.name === "Blank Gaze") return "Light";
    if (spell.name === "Mysterious Light" || spell.name === "Stinking Gas") return "Wind";
    if (spell.name === "Blitzstrahl") return "Lightning";
    if (spell.name === "Magnetite Cloud") return "Earth";
    if (spell.name === "Geist Wall" || spell.name === "Blood Saber" || spell.name === "Jettatura") return "Dark";
    if (spell.name === "Awful Eye") return "Water";
    if (spell.name === "Ice Break" || spell.name === "Cold Wave") return "Ice";
    if (spell.name === "Self-Destruct") return "Fire";
    if (spell.name === "Frightful Roar" || spell.name === "Hecatomb Wave" || spell.name === "Feather Barrier" || spell.name === "Flying Hip Press") return "Wind";
    if (spell.name === "Filamented Hold") return "Earth";
    if (spell.name === "Radiant Breath" || spell.name === "Light of Penance") return "Light";
    if (spell.name === "Maelstrom") return "Water";
    if (spell.name === "Eyes On Me") return "Dark";
    if (spell.name === "Feather Tickle" || spell.name === "Voracious Trunk") return "Wind";
    if (spell.name === "Yawn") return "Light";
    if (spell.name === "Infrasonics" || spell.name === "Frost Breath") return "Ice";
    if (spell.name === "Sandspray" || spell.name === "Enervation") return "Dark";
    if (spell.name === "Corrosive Ooze") return "Water";
    if (spell.name === "Diamondhide") return "Earth";
    if (spell.name === "Warm-Up") return "Earth";
    if (spell.name === "Firespit") return "Fire";
    if (spell.name === "Regurgitation") return "Water";
    if (spell.name === "Amplification") return "Water";
    if (spell.name === "Saline Coat") return "Light";
    if (spell.name === "Lowing" || spell.name === "Heat Breath" || spell.name === "Triumphant Roar") return "Fire";
    if (spell.name === "Temporal Shift") return "Lightning";
    if (spell.name === "Magic Hammer") return "Light";
    if (spell.name === "Reactor Cool") return "Ice";
    if (spell.name === "Exuviation") return "Fire";
    return "None";
  }
  if (spell.song) {
    const song = songByName(spell.name);
    if (!song) return "—";
    if (song.element === "thunder") return "Lightning";
    return song.element.charAt(0).toUpperCase() + song.element.slice(1);
  }
  if (spell.nin) return ninElementName(spell);
  if (spell.bar) {
    const el = spell.bar.element;
    if (el === "thunder") return "Lightning";
    return el.charAt(0).toUpperCase() + el.slice(1);
  }
  if (spell.enspell) {
    const el = spell.enspell.element;
    if (el === "thunder") return "Lightning";
    return el.charAt(0).toUpperCase() + el.slice(1);
  }
  if (spell.haste || spell.blink || spell.enfeeble === "Silence") return "Wind";
  if (spell.aquaveil) return "Water";
  if (spell.phalanx || spell.reprisal) return "Light";
  if (spell.enfeeble === "Slow" || spell.enfeeble === "Slow II") return "Earth";
  if (spell.enfeeble === "Paralyze" || spell.enfeeble === "Paralyze II") return "Ice";
  if (spell.enfeeble === "Gravity") return "Wind";
  if (spell.enfeeble === "Dispel") return "Dark";
  if (spell.enfeeble === "Distract") return "Ice";
  if (spell.enfeeble === "Frazzle") return "Dark";
  if (spell.enfeeble === "Inundation") return "Light";
  if (spell.enfeeble === "Dia" || spell.enfeeble === "Dia II" || spell.enfeeble === "Dia III" || spell.enfeeble === "Diaga") return "Light";
  if (spell.enfeeble === "Poison" || spell.enfeeble === "Poison II" || spell.enfeeble === "Poisonga") return "Water";
  if (spell.enfeeble === "Bio" || spell.enfeeble === "Bio II" || spell.enfeeble === "Bio III") return "Dark";
  if (spell.enfeeble === "Stun") return "Lightning";
  if (spell.regen || spell.auspice || spell.erase || spell.cure || spell.curaga || spell.cura || spell.na || spell.esuna || spell.sacrifice || spell.school === "divine" || spell.barrier) return "Light";
  if (spell.siphon) return "Dark";
  if (spell.colure) return elementName(geoElement(spell.colure.effect));
  if (spell.summon) {
    const spec = summonByName(spell.name);
    return spec ? elementName(spec.element) : "—";
  }
  if (spell.refresh || spell.raise || spell.reraise || spell.foil || spell.warp) return "Light";
  if (spell.klimaform) return "Dark";
  if (spell.storm) {
    const el = spell.storm.element;
    if (el === "thunder") return "Lightning";
    return el.charAt(0).toUpperCase() + el.slice(1);
  }
  const el = elementFromName(spell.name);
  if (!el) return "—";
  if (el === "thunder") return "Lightning";
  return el.charAt(0).toUpperCase() + el.slice(1);
}

function jobNeeds(spell: Spell): string {
  const levels = spell.jobLevel ?? Object.fromEntries(spell.jobs.map((job) => [job, spell.level]));
  const line = Object.entries(levels)
    .map(([job, level]) => `${job} ${level}`)
    .join(" · ");
  const notes: string[] = [];
  if (spell.addendum === "white") notes.push("Addendum: White");
  if (spell.addendum === "black") notes.push("Addendum: Black");
  if (spell.haste) notes.push("Scholar does not learn it");
  if (spell.blink) notes.push("BG prints 30. The client byte is 29.");
  return notes.length ? `${line} · ${notes.join(" · ")}` : line;
}

function spellCast(spell: Spell, celerity: number): string {
  const base = spell.cast ?? 0;
  if (spell.song && base > 4) return `${secs(base)} base, ${secs(pianissimoCast(base, true))} with Pianissimo`;
  if (spell.school !== "elemental" || celerity <= 0) return secs(base);
  return `${secs(base)} base, ${secs(elementalCastSeconds(base, celerity))} with Elemental Celerity`;
}

function stormMotion(element: string): string {
  if (element === "earth") return "A dust cyclone spins up around you.";
  if (element === "water") return "Rain shafts fall in a tight column.";
  if (element === "wind") return "Wind streaks whip around you.";
  if (element === "fire") return "Embers rise off the ground.";
  if (element === "ice") return "Hail crystals fall and fade.";
  if (element === "thunder") return "Lightning sparks crack around you.";
  if (element === "dark") return "A gloom sinks around you.";
  return "Pale aurora curtains open around you.";
}

function stormCard(spell: Spell): string {
  if (!spell.storm) return "";
  const row = stormByName(spell.name);
  const element = spell.storm.element;
  const word = element === "thunder" ? "lightning" : element;
  const other = STORM_OPPOSE[element];
  const otherWord = other === "thunder" ? "lightning" : other;
  const sky = spell.storm.sky;
  const stat = row?.stat === "all"
    ? "Voidstorm would add every attribute at half of Stormsurge, floored. One rank is +1. Two ranks are +2. Three ranks are +2. Four and five ranks are +3. None of that is added."
    : `Stormsurge would add ${row?.stat ?? "an attribute"}. One rank is +3, then +1 a rank, through +7. None is added.`;
  return `Changes the weather around one party member to "${sky}." This yard's party is you, so it lands on you. It is single ${word} weather for 3:00. Another storm replaces it. There is no zone weather, so it cannot become double weather, and the 25% is not used. A matching elemental hit is 10% higher. ${otherWord.charAt(0).toUpperCase() + otherWord.slice(1)} is 10% lower. A neutral element is unchanged. The 10% is floored. Day is not in the term. Helix always takes the weather. A nuke's chance is about a third without an obi, and that rate is not printed, so the 10% is applied. The weather magic-accuracy bonus is not printed as a number, so it is not added. ${stat} Stormsurge is not unlocked. The body is the white-magic chant, gathered in ${word}. ${stormMotion(element)} That weather stays while the status does. The client cast is 2 seconds. BG still prints 7. The card prints 20'. The client range field is 12, the same field Stone uses, and it is not read as yalms. Cumulative enmity 1, volatile enmity 300. It is credited only when you are already on the hate list.`;
}

function spellDuration(spell: Spell): string {
  if (spell.song) {
    const song = songByName(spell.name);
    if (!song || song.duration <= 0) return "Instant";
    return clock(song.duration);
  }
  if (spell.nin) return ninjutsuDuration(spell);
  if (spell.spike) return clock(SPIKE_SECONDS);
  if (spell.debuff) return clock(DEBUFF_SECONDS);
  if (spell.enfeeble === "Blind" || spell.enfeeble === "Blind II") return clock(spell.enfeeble === "Blind II" ? BLIND_II_SECONDS : BLIND_SECONDS);
  if (spell.enfeeble === "Bind") return clock(BIND_SECONDS);
  if (spell.enfeeble === "Slow" || spell.enfeeble === "Slow II") return clock(spell.enfeeble === "Slow II" ? SLOW_II_SECONDS : SLOW_SECONDS);
  if (spell.enfeeble === "Paralyze" || spell.enfeeble === "Paralyze II") return clock(spell.enfeeble === "Paralyze II" ? PARALYZE_II_SECONDS : PARALYZE_SECONDS);
  if (spell.enfeeble === "Silence") return clock(SILENCE_SECONDS);
  if (spell.enfeeble === "Gravity") return clock(GRAVITY_SECONDS);
  if (spell.enfeeble === "Inundation") return clock(INUNDATION_SECONDS);
  if (spell.enfeeble === "Distract") return clock(DISTRACT_SECONDS);
  if (spell.enfeeble === "Frazzle") return clock(FRAZZLE_SECONDS);
  if (spell.enfeeble === "Dia" || spell.enfeeble === "Dia II" || spell.enfeeble === "Dia III" || spell.enfeeble === "Diaga") return clock(DIA_SECONDS[spell.enfeeble]);
  if (spell.enfeeble === "Bio" || spell.enfeeble === "Bio II" || spell.enfeeble === "Bio III") return clock(BIO_SECONDS[spell.enfeeble]);
  if (spell.enfeeble === "Stun") return clock(STUN_SECONDS);
  if (spell.enfeeble === "Poison" || spell.enfeeble === "Poison II" || spell.enfeeble === "Poisonga") return clock(poisonSeconds(spell.enfeeble));
  if (spell.enfeeble === "Sleep" || spell.enfeeble === "Sleep II" || spell.enfeeble === "Sleepga" || spell.enfeeble === "Sleepga II") {
    return clock(sleepSeconds(spell.enfeeble));
  }
  if (spell.banish) return clock(BANISH_DOWN[spell.banish].seconds);
  if (spell.flash) return clock(FLASH_SECONDS);
  if (spell.repose) return clock(sleepSeconds("Repose"));
  if (spell.nuke && ANCIENT.has(spell.nuke)) return "10s";
  if (spell.stoneskin) return clock(STONESKIN_SECONDS);
  if (spell.barrier) return clock(BARRIER_SECONDS);
  if (spell.regen) return clock(REGEN_SECONDS[spell.regen.tier]);
  if (spell.haste) return clock(HASTE_SECONDS);
  if (spell.auspice) return clock(AUSPICE_SECONDS);
  if (spell.aquaveil) return clock(AQUAVEIL_SECONDS);
  if (spell.blink) return clock(BLINK_SECONDS);
  if (spell.phalanx) return clock(PHALANX_SECONDS);
  if (spell.reprisal) return clock(REPRISAL_SECONDS);
  if (spell.enspell) return clock(ENSPELL_SECONDS);
  if (spell.storm) return clock(STORM_SECONDS);
  if (spell.klimaform) return clock(KLIMAFORM_SECONDS);
  if (spell.bar) return clock(BAR_SECONDS);
  if (spell.colure) return spell.colure.side === "indi" ? clock(180) : "While the luopan stands";
  if (spell.refresh) return clock(REFRESH_SECONDS);
  if (spell.reraise) return clock(RERAISE_SECONDS);
  if (spell.foil) return clock(enhancingDuration(30, spell.foil.effectLevel, LEVEL));
  if (spell.summon) {
    const spec = summonByName(spell.name);
    if (spec && (spec.family === "astral" || spec.family === "burst")) return "Instant";
    return "Until Release";
  }
  if (spell.raise || spell.warp || spell.cure || spell.curaga || spell.cura || spell.na || spell.erase || spell.esuna || spell.sacrifice || spell.siphon || spell.enfeeble === "Dispel" || spell.nuke) return "Instant";
  if (spell.name === "Sprout Smack" || spell.name === "Wild Oats" || spell.name === "Queasyshroom" || spell.name === "Feather Storm" || spell.name === "Head Butt" || spell.name === "Pinecone Bomb") return "Varies";
  if (spell.name === "Spiral Spin") return clock(SPIRAL_SECONDS);
  if (spell.name === "Seedspray") return clock(SEED_SECONDS);
  if (spell.name === "Tail Slap") return clock(TAIL_STUN);
  if (spell.name === "Maelstrom") return clock(MAELSTROM.seconds);
  if (spell.name === "Eyes On Me") return "Instant";
  if (spell.blue != null && "metal" in spell.blue) return clock(METAL_SECONDS);
  if (spell.blue != null && "sand" in spell.blue) return clock(SANDSPIN_SECONDS);
  if (spell.blue != null && "pollen" in spell.blue) return "Instant";
  if (spell.blue != null && "physical" in spell.blue) return "Instant";
  if (spell.blue != null && "gaze" in spell.blue) return "Instant";
  if (spell.blue != null && "mystery" in spell.blue) return clock(MYSTERIOUS_LIGHT.seconds);
  if (spell.blue != null && "venom" in spell.blue) return clock(VENOM_SHELL.seconds);
  if (spell.name === "MP Drainkiss") return "Instant";
  if (spell.name === "Blitzstrahl") return clock(BLITZSTRAHL.stun);
  if (spell.name === "Stinking Gas") return clock(STINKING_GAS.seconds);
  if (spell.name === "Magnetite Cloud") return clock(MAGNETITE_CLOUD.weightSeconds ?? 0);
  if (spell.name === "Awful Eye") return clock(AWFUL_EYE.seconds);
  if (spell.name === "Jettatura") return clock(JETTATURA.seconds);
  if (spell.name === "Ice Break") return clock(ICE_BREAK.bind);
  if (spell.name === "Self-Destruct") return clock(WEAKNESS_SECONDS);
  if (spell.name === "Frightful Roar") return clock(FRIGHTFUL_ROAR.seconds);
  if (spell.name === "Cold Wave") return clock(COLD_WAVE.seconds);
  if (spell.name === "Filamented Hold") return clock(FILAMENTED_HOLD.seconds);
  if (spell.name === "Hecatomb Wave") return clock(HECATOMB_WAVE.blindSeconds ?? 0);
  if (spell.name === "Radiant Breath") return clock(RADIANT_BREATH.slowSeconds ?? 0);
  if (spell.name === "Feather Barrier") return clock(FEATHER_BARRIER.seconds);
  if (spell.name === "Light of Penance") return clock(LIGHT_OF_PENANCE.seconds);
  if (spell.name === "Frost Breath") return clock(FROST_SECONDS);
  if (spell.name === "Geist Wall" || spell.name === "Blood Saber") return "Instant";
  if (spell.blue != null && ("orb" in spell.blue || "breath" in spell.blue || "ray" in spell.blue || "digest" in spell.blue || "kiss" in spell.blue || "blitz" in spell.blue)) return "Instant";
  if (spell.blue != null && "flash" in spell.blue) return clock(ACTINIC_SECONDS);
  if (spell.blue != null && "spikes" in spell.blue) return clock(PLASMA_SECONDS);
  if (spell.blue != null && "silence" in spell.blue) return clock(SILENCE_SECONDS);
  if (spell.blue != null && "mantle" in spell.blue) return clock(ZEPHYR_SECONDS);
  if (spell.blue != null && "cocoon" in spell.blue) return clock(COCOON_SECONDS);
  if (spell.blue != null && "refuel" in spell.blue) return clock(REFUEL_SECONDS);
  if (spell.name === "Soporific") return clock(SOPORIFIC_SECONDS);
  if (spell.name === "Sound Blast") return clock(SOUND_SECONDS);
  if (spell.blue != null && "song" in spell.blue) return `${SHEEP_LOW}–${SHEEP_HIGH}s`;
  if (spell.blue != null && "breeze" in spell.blue) return "Instant";
  if (spell.name === "Feather Tickle" || spell.name === "Voracious Trunk") return "Instant";
  if (spell.name === "Yawn") return clock(YAWN_SECONDS);
  if (spell.name === "Infrasonics") return clock(INFRA_SECONDS);
  if (spell.name === "Sandspray") return clock(SANDSPRAY_SECONDS);
  if (spell.name === "Corrosive Ooze") return clock(OOZE_SECONDS);
  if (spell.name === "Diamondhide") return clock(HIDE_SECONDS);
  if (spell.name === "Enervation") return clock(ENERV_SECONDS);
  if (spell.name === "Warm-Up") return clock(WARM_UP.seconds);
  if (spell.name === "Amplification") return clock(AMPLIFICATION.seconds);
  if (spell.name === "Lowing") return clock(LOWING.seconds);
  if (spell.name === "Triumphant Roar") return clock(TRIUMPHANT_ROAR.seconds);
  if (spell.name === "Saline Coat") return clock(SALINE_SECONDS);
  if (spell.name === "Sub-zero Smash") return clock(SUBZERO_PARA_SECONDS);
  if (spell.name === "Temporal Shift") return clock(SHIFT_SECONDS);
  if (spell.name === "Firespit" || spell.name === "Asuran Claws" || spell.name === "Heat Breath") return "Instant";
  if (spell.name === "Regurgitation") return clock(REGURGITATION.bind);
  if (spell.name === "Magic Hammer" || spell.name === "Exuviation") return "Instant";
  if (spell.name === "Reactor Cool") return clock(REACTOR_SECONDS);
  return "—";
}

function spellRadius(spell: Spell): string {
  if (spell.song) {
    const song = songByName(spell.name);
    if (!song) return "—";
    if (!song.hostile) return `${SONG_RADIUS}'`;
    if (song.wide && song.family === "lullaby") return "4'–8'";
    if (song.wide) return "Area";
    return "Single target";
  }
  if (spell.nin) {
    if (spell.nin.area) return "10'";
    if (spell.range == null) return "Self";
    return "Single target";
  }
  if (spell.name === "Magnetite Cloud") return `${MAGNETITE_CLOUD.range}' fan`;
  if (spell.name === "Awful Eye") return `${AWFUL_EYE.range}' fan`;
  if (spell.name === "Jettatura") return `${JETTATURA.range}' fan`;
  if (spell.name === "Filamented Hold") return `${FILAMENTED_HOLD.range}' fan`;
  if (spell.name === "Hecatomb Wave") return `${HECATOMB_WAVE.range}' fan`;
  if (spell.name === "Radiant Breath") return `${RADIANT_BREATH.range}' fan`;
  if (spell.name === "Flying Hip Press") return `${FLYING_HIP_PRESS.range}' circle`;
  if (spell.name === "Infrasonics") return `${INFRA_RANGE}' fan`;
  if (spell.name === "Frost Breath") return `${FROST_RANGE}' fan`;
  if (spell.name === "Sandspray") return `${SANDSPRAY_RANGE}' fan`;
  if (spell.name === "Corrosive Ooze") return `${OOZE_RANGE}'`;
  if (spell.name === "Diamondhide") return `${HIDE_RADIUS}' party`;
  if (spell.name === "Enervation") return `${ENERV_RADIUS}' circle`;
  if (spell.name === "Tail Slap") return `${TAIL_SLAP.range}' fan`;
  if (spell.name === "Firespit") return `${FIRESPIT.range}'`;
  if (spell.name === "Hysteric Barrage") return `${HYSTERIC_BARRAGE.range}'`;
  if (spell.name === "Regurgitation") return `${REGURGITATION.range}'`;
  if (spell.name === "Asuran Claws") return `${ASURAN_CLAWS.range}'`;
  if (spell.name === "Lowing") return `${LOWING.radius}' circle`;
  if (spell.name === "Heat Breath") return `${HEAT_BREATH.range}' fan`;
  if (spell.name === "Sickle Slash") return `${SICKLE_SLASH.range}'`;
  if (spell.name === "Sub-zero Smash") return `${SUBZERO_SMASH.range}' fan`;
  if (spell.name === "Ram Charge") return `${RAM_CHARGE.range}'`;
  if (spell.name === "Temporal Shift") return `${SHIFT_RADIUS}' circle`;
  if (spell.name === "Magic Hammer") return `${MAGIC_HAMMER.range}'`;
  if (spell.name === "Vertical Cleave") return `${VERTICAL_CLEAVE.range}'`;
  if (spell.radius != null) return `${spell.radius}'`;
  if (spell.colure) return `${COLURE_YARDS}'`;
  if (spell.summon && spell.range == null) return "Self";
  if (spell.nuke && areaNuke(spell.name)) return "10'";
  if (spell.enfeeble === "Sleepga" || spell.enfeeble === "Sleepga II") return "10'";
  if (spell.self || spell.warp === "Warp") return "Self";
  return "Single target";
}

function ownsWs(ws: SwordWs, job: JobId, asMain: boolean, level: number): boolean {
  if (!ws.jobs.includes(job)) return false;
  if (ws.mainOnly && !asMain) return false;
  if (ws.level != null && level < ws.level) return false;
  return true;
}

function wsOpen(ws: SwordWs, main: JobId, sub: JobId | null, subLv: number, skill: number, weaponName: string): boolean {
  const mainOk = ownsWs(ws, main, true, LEVEL);
  const subOk = sub != null && ownsWs(ws, sub, false, subLv);
  if (!mainOk && !subOk) return false;
  if (ws.requires && !ws.requires.includes(main) && !(sub && ws.requires.includes(sub))) return false;
  const named = [...(ws.weapons ?? []), ...(ws.warWeapons ?? [])];
  const onWeapon = named.includes(weaponName);
  if (ws.skill == null) return onWeapon;
  if (skill < ws.skill && !(ws.bypassSkill && onWeapon)) return false;
  return true;
}

function modLine(mods: Partial<Record<StatKey, number>>): string {
  const parts = (Object.entries(mods) as [StatKey, number][]).map(([key, rate]) => `${key.toUpperCase()} ${Math.round(rate * 100)}%`);
  return parts.length > 0 ? parts.join(" · ") : "None";
}

function tpLine(ws: SwordWs): string {
  const lines: string[] = [];
  if (ws.ftp && ws.ftp.length > 0) {
    lines.push(ws.ftp.length === 1 ? `fTP ${num(ws.ftp[0])}` : `fTP ${ws.ftp.map((n) => num(n)).join(" / ")} at 1000 / 2000 / 3000`);
  }
  if (ws.attackBonus) lines.push(`Attack ${ws.attackBonus.map((n) => num(n)).join(" / ")}`);
  if (ws.critBonus) lines.push(`Critical hit rate ${ws.critBonus.map((n) => `${Math.round(n * 100)}%`).join(" / ")}`);
  if (ws.defenseIgnored) lines.push(`Defense ignored ${ws.defenseIgnored.map((n) => `${Math.round(n * 100)}%`).join(" / ")}`);
  if (ws.hpRatio) lines.push(`Current HP ${ws.hpRatio.map((n) => `${Math.round(n * 100)}%`).join(" / ")}`);
  if (ws.drain) lines.push(`Damage to HP ${ws.drain.map((n) => `${Math.round(n * 100)}%`).join(" / ")}`);
  if (lines.length === 0) return "—";
  return lines.join(". ");
}

function wsRadius(ws: SwordWs): string {
  if (ws.radius) return ws.radius.map((n) => `${n}'`).join(" / ");
  if (/area/i.test(ws.effect)) return "Area";
  if (ws.self) return "Self";
  return "Single target";
}

function abilityTarget(effect: string): { range: string; radius: string } {
  const within = effect.match(/within ([\d.]+)'/);
  const radius = effect.match(/Radius ([\d.]+)'/);
  const area = effect.match(/Area ([\d.]+)'/);
  if (radius) return { range: "Self", radius: `${radius[1]}'` };
  if (area) return { range: "Self", radius: `${area[1]}'` };
  if (within) return { range: `${within[1]}'`, radius: "Single target" };
  if (/party member/i.test(effect)) return { range: "—", radius: "Party member" };
  return { range: "Self", radius: "Self" };
}

function Lines({ rows }: { rows: { k: string; v: string }[] }) {
  return (
    <dl className="mt-3 flex flex-col gap-2">
      {rows.map((row) => (
        <div key={row.k}>
          <dt className="font-sans text-[11px] tracking-[0.14em] text-gold">{row.k}</dt>
          <dd className="mt-0.5 text-sm leading-snug text-ink">{row.v}</dd>
        </div>
      ))}
    </dl>
  );
}

function RewardFoodList({
  inventory,
  pinned,
  onPick,
}: {
  inventory: Record<string, number>;
  pinned: string | null;
  onPick: (id: string | null) => void;
}) {
  const counts = petFoodCounts(inventory);
  const pinnedLive = pinned != null && (counts[pinned] ?? 0) > 0;
  const highest = rewardBiscuit(counts, null);
  const inBag = PET_FOODS.filter((food) => (counts[food.id] ?? 0) > 0).sort((a, b) => b.level - a.level);
  return (
    <ul id="reward-food-list" data-food-root="" role="listbox" aria-label="Pet food in the bag" className="mt-3 flex flex-col gap-1">
      <li>
        <button
          type="button"
          role="option"
          aria-selected={!pinnedLive}
          onClick={() => onPick(null)}
          className={`flex min-h-10 w-full items-center justify-between gap-2 border px-2 text-left ${!pinnedLive ? "border-gold bg-navy" : "border-gold-dim/70"}`}
        >
          <span className="text-sm font-semibold">Highest level</span>
          <span className="text-[11px] text-muted">{highest ? `${highest.name.replace("Pet Food ", "")} ×${counts[highest.id]}` : "Empty"}</span>
        </button>
      </li>
      {inBag.map((food) => {
        const on = pinnedLive && pinned === food.id;
        return (
          <li key={food.id}>
            <button
              type="button"
              role="option"
              aria-selected={on}
              onClick={() => onPick(food.id)}
              className={`flex min-h-10 w-full items-center justify-between gap-2 border px-2 text-left ${on ? "border-gold bg-navy" : "border-gold-dim/70"}`}
            >
              <span className="text-sm font-semibold">{food.name}</span>
              <span className="text-[11px] text-muted">Lv {food.level} · ×{counts[food.id]}</span>
            </button>
          </li>
        );
      })}
      {inBag.length === 0 ? <li className="px-2 py-1 text-sm text-muted">No pet food in the bag.</li> : null}
    </ul>
  );
}

const BLUE_BY_LEVEL = [...BLUE_SPELLS].sort((a, b) => a.level - b.level || a.name.localeCompare(b.name));

function PupBook() {
  const headId = useGame((s) => s.autoHead);
  const frameId = useGame((s) => s.autoFrame);
  const autoSet = useGame((s) => s.autoSet);
  const setAutoHead = useGame((s) => s.setAutoHead);
  const setAutoFrame = useGame((s) => s.setAutoFrame);
  const toggleAutoAttachment = useGame((s) => s.toggleAutoAttachment);
  const [picked, setPicked] = useState<string | null>(null);
  const frame = autoFrame(frameId);
  const head = autoHead(headId);
  const used = usedCapacity(autoSet);
  const room = elementalCapacity(head?.id ?? headId, frame?.id ?? frameId);
  return (
    <div className="font-sans text-ink">
      <p className="text-sm font-semibold">Automaton · {autoSet.length}/{AUTO_SLOTS} attachments</p>
      <p className="mt-2 text-sm text-muted">Tap once to read a piece. Tap it again to equip or remove it. Maneuvers need an Animator in the ranged slot.</p>
      <p className="mt-3 text-[11px] tracking-[0.14em] text-gold">HEAD</p>
      <ul className="mt-1 flex flex-col gap-1">
        {AUTO_HEADS.map((head) => {
          const key = `head:${head.id}`;
          const open = picked === key;
          const on = headId === head.id;
          return (
            <li key={head.id}>
              <button
                type="button"
                aria-selected={open}
                onClick={() => {
                  if (picked !== key) {
                    setPicked(key);
                    return;
                  }
                  setAutoHead(head.id);
                }}
                className={`flex min-h-10 w-full items-center gap-2 border px-2 text-left ${open ? "border-gold bg-navy" : "border-gold-dim/70"}`}
              >
                <span className={`inline-flex size-5 shrink-0 items-center justify-center border ${on ? "border-gold" : "border-[#3a3d46]"}`}>
                  {on ? <span className="size-3 rounded-full bg-gold" /> : null}
                </span>
                <span className={`text-sm font-semibold ${open || on ? "text-gold" : ""}`}>{head.name}</span>
              </button>
              {open ? <p className="border border-t-0 border-gold-dim/70 px-2 py-1.5 text-[12px] leading-snug text-muted">{head.blurb}</p> : null}
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-[11px] tracking-[0.14em] text-gold">FRAME</p>
      <ul className="mt-1 flex flex-col gap-1">
        {AUTO_FRAMES.map((row) => {
          const key = `frame:${row.id}`;
          const open = picked === key;
          const on = frameId === row.id;
          return (
            <li key={row.id}>
              <button
                type="button"
                aria-selected={open}
                onClick={() => {
                  if (picked !== key) {
                    setPicked(key);
                    return;
                  }
                  setAutoFrame(row.id);
                }}
                className={`flex min-h-10 w-full items-center gap-2 border px-2 text-left ${open ? "border-gold bg-navy" : "border-gold-dim/70"}`}
              >
                <span className={`inline-flex size-5 shrink-0 items-center justify-center border ${on ? "border-gold" : "border-[#3a3d46]"}`}>
                  {on ? <span className="size-3 rounded-full bg-gold" /> : null}
                </span>
                <span className={`text-sm font-semibold ${open || on ? "text-gold" : ""}`}>{row.name}</span>
                <span className="ml-auto shrink-0 text-[11px] text-muted">{row.hp} HP</span>
              </button>
              {open ? <p className="border border-t-0 border-gold-dim/70 px-2 py-1.5 text-[12px] leading-snug text-muted">{row.blurb}</p> : null}
            </li>
          );
        })}
      </ul>
      <div className="mt-3 flex flex-col gap-1">
        {AUTO_ELEMENT_ROWS.map((row) => (
          <div key={row.join("-")} className="flex flex-wrap gap-x-3 gap-y-1">
            {row.map((element) => (
              <span key={element} className="inline-flex items-center gap-1 text-[12px] tabular-nums">
                <span className="inline-block size-2.5 rounded-full" style={{ background: AUTO_ELEMENT_COLOR[element] }} />
                {used[element]}/{room[element]}
              </span>
            ))}
          </div>
        ))}
      </div>
      <p className="mt-3 text-[11px] tracking-[0.14em] text-gold">ATTACHMENTS</p>
      <ul className="mt-1 flex flex-col gap-1">
        {AUTO_ATTACHMENTS.map((row) => {
          const open = picked === row.name;
          const on = autoSet.includes(row.name);
          return (
            <li key={row.name}>
              <button
                type="button"
                aria-selected={open}
                onClick={() => {
                  if (picked !== row.name) {
                    setPicked(row.name);
                    return;
                  }
                  toggleAutoAttachment(row.name);
                }}
                className={`flex min-h-10 w-full items-center gap-2 border px-2 text-left ${open ? "border-gold bg-navy" : "border-gold-dim/70"}`}
              >
                <span className={`inline-flex size-5 shrink-0 items-center justify-center border ${on ? "border-gold" : "border-[#3a3d46]"}`}>
                  {on ? <span className="size-3 bg-gold" /> : null}
                </span>
                <span className="inline-block size-2.5 shrink-0 rounded-full" style={{ background: AUTO_ELEMENT_COLOR[row.element] }} />
                <span className={`text-sm font-semibold ${open || on ? "text-gold" : ""}`}>{row.name}</span>
                <span className="ml-auto shrink-0 text-[11px] text-muted">
                  {AUTO_ELEMENT_LABEL[row.element]} {row.cost}
                </span>
              </button>
              {open ? (
                <p className="border border-t-0 border-gold-dim/70 px-2 py-1.5 text-[12px] leading-snug text-muted">
                  {AUTO_ELEMENT_LABEL[row.element]} × {row.cost}. {row.effect}
                </p>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function BlueBook() {
  const mainJob = useGame((s) => s.mainJob);
  const blueLearned = useGame((s) => s.blueLearned);
  const blueSet = useGame((s) => s.blueSet);
  const toggleBlueSpell = useGame((s) => s.toggleBlueSpell);
  const [picked, setPicked] = useState<string | null>(null);
  const cap = bluePointCap(LEVEL);
  const points = blueSet.reduce((n, name) => n + (blueSpellByName(name)?.points ?? 0), 0);
  const main = mainJob === "BLU";
  const spell = picked ? blueSpellByName(picked) : undefined;
  return (
    <div className="font-sans text-ink">
      <p className="text-sm font-semibold">
        Blue magic · {points}/{cap.points} points · {blueSet.length}/{cap.slots} spells
      </p>
      <p className="mt-2 text-sm text-muted">
        {main
          ? "Tap a spell to read it. Tap the same spell again to set or unset it."
          : "The set is saved. It works only while Blue Mage is your main job."}
      </p>
      <ul className="mt-3 flex flex-col gap-1">
        {BLUE_BY_LEVEL.map((row) => {
          const learned = blueLearned.includes(row.name);
          const on = blueSet.includes(row.name);
          const open = picked === row.name;
          return (
            <li key={row.name}>
              <button
                type="button"
                aria-selected={open}
                onClick={() => {
                  if (picked !== row.name) {
                    setPicked(row.name);
                    return;
                  }
                  if (main && learned) toggleBlueSpell(row.name);
                }}
                className={`flex min-h-10 w-full items-center gap-2 border px-2 text-left ${open ? "border-gold bg-navy" : "border-gold-dim/70"} ${learned ? "" : "opacity-60"}`}
              >
                <span className={`inline-flex size-5 shrink-0 items-center justify-center border ${on ? "border-gold" : "border-[#3a3d46]"}`}>
                  {on ? <span className="size-3 bg-gold" /> : null}
                </span>
                <span className={`text-sm font-semibold ${open ? "text-gold" : ""}`}>{row.name}</span>
                <span className="ml-auto shrink-0 text-[11px] text-muted">Lv {row.level}</span>
              </button>
            </li>
          );
        })}
      </ul>
      {spell ? <BlueSpellCard spell={spell} learned={blueLearned.includes(spell.name)} /> : <p className="mt-3 text-sm text-muted">Select a spell.</p>}
    </div>
  );
}

const BLUE_MONSTER: Record<string, string> = {
  Rabbit: "Beast",
  Coeurl: "Beast",
  Puk: "Dragon",
  Ghrah: "Luminion",
  Phuabo: "Empty",
  Dhalmel: "Beast",
  Sheep: "Beast",
  Orc: "Beastmen",
  Goobbue: "Plantoid",
  Imp: "Demon",
  Aern: "Luminian",
  Crawler: "Vermin",
  Cluster: "Arcana",
  "Opo-opo": "Beast",
  Wamouracampa: "Vermin",
  Corse: "Undead",
  Soulflayer: "Demons",
  Worm: "Amorph",
  Bee: "Vermin",
  Beetle: "Vermin",
  Sapling: "Plantoid",
  Mandragora: "Plantoid",
  Crab: "Aquan",
  Funguar: "Plantoid",
  Quadav: "Beastmen",
  Yagudo: "Beastmen",
  Bird: "Bird",
  Cardian: "Arcana",
  Fly: "Vermin",
  Warmachine: "Beastmen",
  Tiger: "Beast",
  Hound: "Undead",
  Flytrap: "Plantoid",
  Pugil: "Aquan",
  Goblin: "Beastmen",
  Gigas: "Beastmen",
  Cockatrice: "Birds",
  Hecteyes: "Amorph",
  "Evil Weapon": "Arcana",
  Slime: "Amorph",
  Treant: "Plantoid",
  Leech: "Amorph",
  Doll: "Arcana",
  Doomed: "Undead",
  Antlion: "Vermin",
  Antica: "Beastmen",
  Bat: "Bird",
  Pot: "Arcana",
  Ghost: "Undead",
  Uragnite: "Aquan",
  Eft: "Lizards",
  Bugard: "Lizards",
  Skeleton: "Undead",
  Hippogryph: "Birds",
  Golem: "Arcana",
  Bomb: "Arcana",
  Taurus: "Demon",
  Snoll: "Arcana",
  Diremite: "Vermin",
  Demon: "Demons",
  Wyvern: "Dragons",
  Roc: "Birds",
  Bugbear: "Beastmen",
  Tonberry: "Beastmen",
  Scorpion: "Vermin",
  Shadow: "Undead",
  Ladybug: "Vermin",
  "Sea Monk": "Aquan",
  Ahriman: "Demons",
  Rafflesia: "Plantoid",
  Sahagin: "Beastmen",
  Colibri: "Bird",
  Apkallu: "Bird",
  Marid: "Beast",
  Lizard: "Lizard",
  Raptor: "Lizards",
  Slug: "Amorph",
  Qiqirn: "Beastmen",
  Troll: "Beastmen",
  Mamool: "Beastmen",
  Lamia: "Beastmen",
  Peiste: "Dragon",
  Flan: "Amorph",
  Gnole: "Beast",
  Buffalo: "Beast",
  Manticore: "Beast",
  Gargouille: "Demon",
  Spider: "Vermin",
  Ruszor: "Aquan",
  Xzomit: "Luminian",
  Ram: "Beast",
  Hpemde: "Luminian",
  Poroggo: "Beast",
  Zdei: "Empty",
  Wamoura: "Vermin",
  Euvhi: "Plantoid",
};

const BLUE_BLURB: Record<string, string> = {
  "Foot Kick": "Deals critical damage. Chance of critical hit varies with TP.",
  "Wild Carrot": "Restores HP for the target.",
  "Chaotic Eye": "Silences an enemy.",
  "Zephyr Mantle": "Creates shadow images that each absorb a single attack directed at you.",
  "Actinic Burst": "Greatly lowers the accuracy of enemies within range.",
  "Plasma Charge": "Covers you with shock spikes.",
  "Healing Breeze": "Restores HP for party members within area of effect.",
  "Sheep Song": "Puts all enemies within range to sleep.",
  "Battle Dance": "Delivers an area attack. Additional effect: DEX Down. Duration of effect varies with TP.",
  "Uppercut": "Damage varies with TP.",
  "Frenetic Rip": "Delivers a threefold attack. Damage varies with TP.",
  "Disseverment": "Delivers a fivefold attack. Additional effect: Poison. Accuracy varies with TP.",
  Cocoon: "Enhances defense.",
  Refueling: "Increases attack speed.",
  "Magic Fruit": "Restores HP for the target party member.",
  Cannonball: "Damage varies with TP.",
  "Memento Mori": "Enhances magic attack.",
  "Mind Blast": "Deals lightning damage to an enemy. Additional effect: Paralysis.",
  Sandspin: "Deals earth damage to enemies within range. Additional effect: Accuracy Down.",
  Pollen: "Restores HP.",
  "Power Attack": "Deals critical damage. Chance of critical hit varies with TP.",
  "Sprout Smack": "Additional effect: Slow. Duration of effect varies with TP.",
  "Wild Oats": "Additional effect: Vitality Down. Duration of effect varies with TP.",
  "Metallic Body": "Absorbs a certain amount of damage from physical and magical attacks.",
  Queasyshroom: "Additional effect: Poison. Poison effect varies with TP.",
  "Head Butt": "Damage varies with TP. Additional effect: Stun.",
  "Feather Storm": "Additional effect: Poison. Chance of effect varies with TP.",
  Helldive: "Damage varies with TP.",
  Bludgeon: "Delivers a threefold attack. Accuracy varies with TP.",
  "Cursed Sphere": "Deals water damage to enemies within area of effect.",
  Blastbomb: "Deals fire damage to enemies within area of effect. Additional effect: Bind.",
  "Claw Cyclone": "Damages enemies within area of effect with a twofold attack. Damage varies with TP.",
  "Poison Breath": "Deals water damage to enemies within a fan-shaped area originating from the caster. Additional effect: Poison.",
  Soporific: "Puts all enemies within range to sleep.",
  Screwdriver: "Deals critical damage. Chance of critical hit varies with TP.",
  "Bomb Toss": "Throws a bomb at an enemy.",
  "Grand Slam": "Delivers an area attack. Damage varies with TP.",
  "Sound Blast": "Lowers the intelligence of enemies within range.",
  "Death Ray": "Deals dark damage to an enemy.",
  "Smite of Rage": "Delivers an attack. Damage varies with TP.",
  Digest: "Steals HP from an enemy.",
  "MP Drainkiss": "Steals an enemy's MP. Ineffective against undead.",
  Blitzstrahl: "Deals lightning damage to an enemy. Additional effect: Stun.",
  "Stinking Gas": "Lowers Vitality of enemies within range.",
  "Mandibular Bite": "Damage varies with TP.",
  "Magnetite Cloud": "Deals earth damage to enemies within a fan-shaped area originating from the caster. Additional effect: Weight.",
  "Pinecone Bomb": "Additional effect: Sleep. Duration of effect varies with TP.",
  "Blank Gaze": "Removes one beneficial magic effect from an enemy.",
  "Jet Stream": "Delivers a threefold attack. Accuracy varies with TP.",
  "Mysterious Light": "Deals wind damage to enemies within range. Additional effect: Weight.",
  "Terror Touch": "Additional effect: Weakens attacks. Accuracy varies with TP.",
  "Venom Shell": "Poisons enemies within range and gradually reduces their HP.",
  "Geist Wall": "Removes one beneficial magic effect from enemies within area of effect.",
  "Awful Eye": "Lowers an enemy's attack power. Gaze attack.",
  "Blood Saber": "Steals HP from enemies within range. Ineffective against undead.",
  "Jettatura": "Inflicts Terror on enemies in a fan-shaped area originating from the caster. Gaze attack.",
  "Ice Break": "Deals ice damage to enemies within range. Additional effect: Bind.",
  "Self-Destruct": "Sacrifices HP to deal fire damage to enemies within range. HP becomes 1. Additional effect: Weakness.",
  "Frightful Roar": "Lowers the defense of enemies within range.",
  "Cold Wave": "Inflicts Frost on enemies within range.",
  "Filamented Hold": "Inflicts Slow on enemies within a fan-shaped area originating from the caster.",
  "Hecatomb Wave": "Deals wind damage to enemies within a fan-shaped area originating from the caster. Additional effect: Blind.",
  "Radiant Breath": "Deals light damage to enemies within a fan-shaped area originating from the caster. Additional effect: Slow and Silence.",
  "Feather Barrier": "Enhances evasion.",
  "Flying Hip Press": "Deals wind damage to enemies within range.",
  "Light of Penance": "Reduces an enemy's TP. Additional effect: Blindness and Bind. Gaze.",
  "Death Scissors": "Damage varies with TP.",
  "Dimensional Death": "Damage varies with TP.",
  "Spiral Spin": "Additional effect: Lowers accuracy. Chance of effect varies with TP.",
  Maelstrom: "Deals water damage to enemies within range. Additional effect: STR Down.",
  "Eyes On Me": "Deals dark damage to an enemy.",
  Seedspray: "Delivers a threefold attack. Additional effect: Weakens defense. Chance of effect varies with TP.",
  "Hydro Shot": "Additional effect: Enmity Down. Chance of effect varies with TP.",
  "Feather Tickle": "Reduces an enemy's TP.",
  Yawn: "Puts all enemies within range to sleep. Gaze.",
  "Voracious Trunk": "Steals one beneficial effect from an enemy.",
  Infrasonics: "Lowers the evasion of enemies within a fan-shaped area originating from the caster.",
  "Frost Breath": "Breathes ice at enemies within a fan-shaped area originating from the caster. Additional effect: Paralysis.",
  Sandspray: "Blinds enemies within a fan-shaped area originating from the caster.",
  "Corrosive Ooze": "Deals water damage to an enemy. Additional effect: Attack Down and Defense Down.",
  Diamondhide: "Gives party members within area of effect the effect of Stoneskin.",
  Enervation: "Lowers the defense and magical defense of enemies within range.",
  "Warm-Up": "Enhances accuracy and evasion.",
  Firespit: "Deals fire damage to an enemy.",
  "Tail Slap": "Delivers an area attack. Additional effect: Stun. Damage varies with TP.",
  "Hysteric Barrage": "Delivers a fivefold attack. Damage varies with TP.",
  Regurgitation: "Deals water damage to an enemy. Additional effect: Bind.",
  Amplification: "Enhances magic attack and magic defense.",
  "Asuran Claws": "Delivers a sixfold attack. Damage varies with TP.",
  Lowing: "Inflicts Plague on enemies within range.",
  "Heat Breath": "Deals fire damage to enemies within a fan-shaped area originating from the caster.",
  "Triumphant Roar": "Enhances attack.",
  "Sickle Slash": "Deals critical damage. Chance of critical hit varies with TP.",
  "Sub-zero Smash": "Delivers an area attack. Additional effect: Paralysis. Damage varies with TP.",
  "Saline Coat": "Enhances magic defense.",
  "Ram Charge": "Damage varies with TP.",
  "Temporal Shift": "Inflicts Stun on enemies within range.",
  "Magic Hammer": "Steals MP equal to damage dealt.",
  "Reactor Cool": "Defense up and Ice Spikes.",
  Exuviation: "Restores HP and removes one effect.",
  "Vertical Cleave": "Damage varies with TP.",
};

function blueStatLine(spell: (typeof BLUE_SPELLS)[number]): string | null {
  const parts: string[] = [];
  if (spell.str) parts.push(`STR+${spell.str}`);
  if (spell.dex) parts.push(`DEX+${spell.dex}`);
  if (spell.vit) parts.push(`VIT+${spell.vit}`);
  if (spell.agi) parts.push(`AGI+${spell.agi}`);
  if (spell.chr) parts.push(`CHR+${spell.chr}`);
  if (spell.int > 0) parts.push(`INT+${spell.int}`);
  else if (spell.int < 0) parts.push(`INT${spell.int}`);
  if (spell.mnd > 0) parts.push(`MND+${spell.mnd}`);
  else if (spell.mnd < 0) parts.push(`MND${spell.mnd}`);
  if (spell.hp > 0) parts.push(`HP+${spell.hp}`);
  else if (spell.hp < 0) parts.push(`HP−${-spell.hp}`);
  if (spell.setMp) parts.push(`MP+${spell.setMp}`);
  return parts.length > 0 ? parts.join(" ") : null;
}

function blueTraitLine(spell: (typeof BLUE_SPELLS)[number]): string | null {
  if (spell.sleepTrait > 0) return `Job Trait: Resist Sleep (${spell.sleepTrait})`;
  if (spell.refreshTrait > 0) return `Job Trait: Auto Refresh (${spell.refreshTrait})`;
  if (spell.conserveTrait > 0) return `Job Trait: Conserve MP (${spell.conserveTrait})`;
  if (spell.regenTrait > 0) return `Job Trait: Auto Regen (${spell.regenTrait})`;
  if (spell.attackTrait > 0) return `Job Trait: Attack Bonus (${spell.attackTrait})`;
  if (spell.accuracyTrait > 0) return `Job Trait: Accuracy Bonus (${spell.accuracyTrait})`;
  if ((spell.mabTrait ?? 0) > 0) return `Job Trait: Magic Attack Bonus (${spell.mabTrait})`;
  if ((spell.clearTrait ?? 0) > 0) return `Job Trait: Clear Mind (${spell.clearTrait})`;
  if ((spell.beastTrait ?? 0) > 0) return `Job Trait: Beast Killer (${spell.beastTrait})`;
  if ((spell.plantTrait ?? 0) > 0) return `Job Trait: Plantoid Killer (${spell.plantTrait})`;
  if ((spell.mpTrait ?? 0) > 0) return `Job Trait: Max MP Boost (${spell.mpTrait})`;
  if ((spell.rapidTrait ?? 0) > 0) return `Job Trait: Rapid Shot (${spell.rapidTrait})`;
  if ((spell.undeadTrait ?? 0) > 0) return `Job Trait: Undead Killer (${spell.undeadTrait})`;
  if ((spell.lizardTrait ?? 0) > 0) return `Job Trait: Lizard Killer (${spell.lizardTrait})`;
  if ((spell.evasionTrait ?? 0) > 0) return `Job Trait: Evasion Bonus (${spell.evasionTrait})`;
  if ((spell.defenseTrait ?? 0) > 0) return `Job Trait: Defense Bonus (${spell.defenseTrait})`;
  if ((spell.mdbTrait ?? 0) > 0) return `Job Trait: Magic Defense Bonus (${spell.mdbTrait})`;
  if ((spell.hpTrait ?? 0) > 0) return `Job Trait: Max HP Boost (${spell.hpTrait})`;
  if ((spell.gravityTrait ?? 0) > 0) return `Job Trait: Resist Gravity (${spell.gravityTrait})`;
  if ((spell.storeTrait ?? 0) > 0) return `Job Trait: Store TP (${spell.storeTrait})`;
  if ((spell.fastTrait ?? 0) > 0) return `Job Trait: Fast Cast (${spell.fastTrait})`;
  if ((spell.counterTrait ?? 0) > 0) return `Job Trait: Counter (${spell.counterTrait})`;
  return null;
}

function BlueSpellCard({ spell, learned }: { spell: (typeof BLUE_SPELLS)[number]; learned: boolean }) {
  const kind = spell.kind === "physical" ? "Physical" : spell.kind === "breath" ? "Breath" : spell.kind === "pollen" || spell.kind === "exuv" ? "Cure" : spell.kind === "metal" || spell.kind === "feather" || spell.kind === "hide" || spell.kind === "warmup" || spell.kind === "amp" || spell.kind === "triumph" || spell.kind === "saline" || spell.kind === "reactor" ? "Buff" : "Magical";
  const monster = BLUE_MONSTER[spell.family] ?? spell.family;
  const stats = blueStatLine(spell);
  const trait = blueTraitLine(spell);
  return (
    <div className="mt-3 border border-gold-dim/70 px-2 py-2 text-sm">
      <p className="flex items-baseline justify-between gap-2">
        <span className="font-semibold">{spell.name}</span>
        <span className="shrink-0 text-[11px] text-muted">({monster} - {kind})</span>
      </p>
      <p className="mt-1">{BLUE_BLURB[spell.name] ?? spell.name}</p>
      {stats ? <p className="mt-1">{stats}</p> : null}
      {trait ? <p className="mt-1">{trait}</p> : null}
      <p className="mt-1">Lv.{spell.level} MP cost {spell.mp} Blue Magic Points {spell.points}</p>
      {learned ? null : <p className="mt-1 text-muted">Unlearned. A {spell.family} must ready it.</p>}
    </div>
  );
}

function JobBook() {
  const race = useGame((s) => s.race);
  const mainJob = useGame((s) => s.mainJob);
  const subJob = useGame((s) => s.subJob);
  const sheet = useGame((s) => s.sheet);
  const loadout = useGame((s) => s.loadout);
  const buffs = useGame((s) => s.buffs);
  const live = meleeStats(sheet, buffs.map((buff) => buff.name), protectPower(buffs), auspiceAccuracy(buffs));
  const [pick, setPick] = useState<Detail | null>(null);
  const [foodOpen, setFoodOpen] = useState(false);
  const inventory = useGame((s) => s.inventory);
  const rewardFood = useGame((s) => (typeof s.flags.rewardFood === "string" ? s.flags.rewardFood : null));
  const setRewardFood = useGame((s) => s.setRewardFood);
  const subLv = subJob ? subjobLevel(LEVEL) : 0;
  const jobLevels = useGame((s) => s.jobLevels);
  const shownLevel = jobLevels?.[mainJob] ?? LEVEL;
  const shownSub = subJob ? Math.min(subjobLevel(shownLevel), jobLevels?.[subJob] ?? subjobLevel(shownLevel)) : 0;
  const raceName = RACES.find((entry) => entry.id === race)?.name ?? race;
  const levels: Partial<Record<JobId, number>> = { [mainJob]: LEVEL };
  if (subJob && subJob !== mainJob) levels[subJob] = subLv;
  const blueSet = useGame((s) => s.blueSet);
  const spells = spellsKnown(levels, mainJob === "BLU" ? new Set(blueSet) : undefined, mainJob);
  const abilities = [
    ...held(mainJob, abilityBook(mainJob), true, LEVEL),
    ...(subJob && subJob !== mainJob ? held(subJob, abilityBook(subJob), false, subLv) : []),
  ];
  const traits = [
    ...held(mainJob, mainJob === "BLU" ? [...traitBook(mainJob), ...blueSetTraits(blueSet)] : traitBook(mainJob), true, LEVEL),
    ...(subJob && subJob !== mainJob ? held(subJob, traitBook(subJob), false, subLv) : []),
  ];
  const skills = skillBook(mainJob);
  const extra = (subJob && subJob !== mainJob ? skillBook(subJob) : []).filter(
    (skill) => !skills.some((row) => row.name === skill.name),
  );
  const skillRows = [...skills, ...extra];
  const weapons = WS_BOOKS.map((book) => {
    const skill = combinedSkill(book.weapon, mainJob, LEVEL, subJob, subLv);
    const rows = book.rows.filter((ws) => wsOpen(ws, mainJob, subJob, subLv, skill, sheet.weaponName));
    return { weapon: book.weapon, skill, rows };
  }).filter((book) => book.rows.length > 0);
  const boost = Math.max(
    mainJob === "WAR" || subJob === "WAR" ? maxHpBoost(mainJob === "WAR" ? LEVEL : subLv) : 0,
    mainJob === "MNK" || subJob === "MNK" ? mnkMaxHp(mainJob === "MNK" ? LEVEL : subLv) : 0,
    mainJob === "PLD" || subJob === "PLD" ? pldMaxHp(mainJob === "PLD" ? LEVEL : subLv, mainJob === "PLD" ? "main" : "sub") : 0,
    mainJob === "NIN" || subJob === "NIN" ? ninMaxHp(mainJob === "NIN" ? LEVEL : subLv, mainJob === "NIN" ? "main" : "sub") : 0,
    mainJob === "BLU" ? blueMaxHpBoost(blueSet, LEVEL) : 0,
    mainJob === "RUN" || subJob === "RUN" ? runMaxHp(mainJob === "RUN" ? LEVEL : subLv, mainJob === "RUN" ? "main" : "sub") : 0,
  );

  useEffect(() => {
    setPick(null);
    setFoodOpen(false);
  }, [mainJob, subJob, race]);

  useEffect(() => {
    setFoodOpen(false);
  }, [pick]);

  const stats = [
    { id: "hp", label: "HP", value: sheet.hp },
    { id: "mp", label: "MP", value: sheet.mp },
    { id: "str", label: "STR", value: sheet.str },
    { id: "dex", label: "DEX", value: sheet.dex },
    { id: "vit", label: "VIT", value: sheet.vit },
    { id: "agi", label: "AGI", value: sheet.agi },
    { id: "int", label: "INT", value: sheet.int },
    { id: "mnd", label: "MND", value: sheet.mnd },
    { id: "chr", label: "CHR", value: sheet.chr },
  ];

  function statLines(id: string): { title: string; rows: { k: string; v: string }[] } {
    if (id === "hp") {
      return {
        title: "HP",
        rows: [
          { k: "You have", v: String(sheet.hp) },
          { k: "What it does", v: "Maximum hit points." },
          { k: "How much it adds", v: `Race and job base ${sheet.naked.hp}. Gear ${sheet.hp - sheet.naked.hp - boost}. Max HP Boost ${boost}.` },
        ],
      };
    }
    if (id === "mp") {
      return {
        title: "MP",
        rows: [
          { k: "You have", v: String(sheet.mp) },
          { k: "What it does", v: "Maximum magic points. A spell spends its cost when the cast starts." },
          { k: "How much it adds", v: `Race and job base ${sheet.naked.mp}. Gear ${sheet.mp - sheet.naked.mp}.` },
        ],
      };
    }
    if (id === "str") {
      return {
        title: "STR",
        rows: [
          { k: "You have", v: String(sheet.str) },
          { k: "What it does", v: "Each point is +1 main-hand attack. The difference against the target's VIT is fSTR, added to weapon damage." },
          { k: "How much it adds", v: `+${sheet.str} attack. Attack is ${live.attack}. Against the Tropical Rarab (VIT ${HARE.vit}), fSTR is ${sheet.fstr}.` },
        ],
      };
    }
    if (id === "dex") {
      return {
        title: "DEX",
        rows: [
          { k: "You have", v: String(sheet.dex) },
          { k: "What it does", v: "Accuracy includes floor(DEX × 0.75). The difference against the target's AGI raises critical hit rate, from a 5% base." },
          { k: "How much it adds", v: `floor(${sheet.dex} × 0.75) is ${Math.floor(sheet.dex * 0.75)} accuracy. Accuracy is ${sheet.accuracy}. Critical hit rate against the hare is ${sheet.crit}%.` },
        ],
      };
    }
    if (id === "vit") {
      return {
        title: "VIT",
        rows: [
          { k: "You have", v: String(sheet.vit) },
          { k: "What it does", v: "Defense includes floor(VIT × 1.5), then level, then armor." },
          { k: "How much it adds", v: `floor(${sheet.vit} × 1.5) is ${Math.floor(sheet.vit * 1.5)} defense. Defense is ${live.defense}.` },
        ],
      };
    }
    if (id === "agi") {
      return {
        title: "AGI",
        rows: [
          { k: "You have", v: String(sheet.agi) },
          { k: "What it does", v: "Evasion includes floor(AGI / 2), then evasion skill." },
          { k: "How much it adds", v: `floor(${sheet.agi} / 2) is ${Math.floor(sheet.agi / 2)} evasion. Evasion is ${sheet.evasion}.` },
        ],
      };
    }
    if (id === "int") {
      const d = sheet.magic.dInt;
      const stone = sheet.magic.stone;
      return {
        title: "INT",
        rows: [
          { k: "You have", v: String(sheet.int) },
          { k: "What it does", v: "Black magic accuracy uses your INT minus the target's INT. That difference also sets elemental damage. It caps at ±30 magic accuracy." },
          { k: "How much it adds", v: `Against the Tropical Rarab (INT ${HARE.int}), dINT is ${d} and that adds ${sheet.magic.macc > 0 ? "+" : ""}${sheet.magic.macc} magic accuracy. The spell's skill is added on top. Stone's unresisted hit after Magic Attack Bonus is ${stone ?? "—"}. A resist can cut that hit to 1/2, 1/4, or 1/8.` },
        ],
      };
    }
    if (id === "mnd") {
      const healing = combinedSkill("Healing Magic", mainJob, LEVEL, subJob, subLv);
      const enhancing = combinedSkill("Enhancing Magic", mainJob, LEVEL, subJob, subLv);
      const power = curePower(sheet.mnd, sheet.vit, healing);
      const cure = cureBase("Cure", power);
      const skin = stoneskinPower(sheet.mnd, enhancing);
      return {
        title: "MND",
        rows: [
          { k: "You have", v: String(sheet.mnd) },
          { k: "What it does", v: "White magic accuracy uses MND the same way black magic uses INT. Cure power is floor(MND / 2) + floor(VIT / 4) + Healing Magic. Curaga power is 3×MND + VIT + 3×floor(Healing Magic / 5). Stoneskin also uses MND with Enhancing Magic." },
          { k: "How much it adds", v: `floor(${sheet.mnd} / 2) is ${Math.floor(sheet.mnd / 2)}. With VIT ${sheet.vit} and Healing Magic ${healing}, Cure power is ${power} and Cure is ${cure} HP before Divine Seal. Curaga power is ${curagaPower(sheet.mnd, sheet.vit, healing)} and Curaga is ${curagaBase("Curaga", curagaPower(sheet.mnd, sheet.vit, healing))} HP before Divine Seal. Stoneskin at Enhancing Magic ${enhancing} absorbs ${skin}, capped at 350. Slow, Paralyze, Silence, Distract, Frazzle, and divine magic add dMND ${dStatMagicAccuracy(sheet.mnd - HARE.mnd)} to magic accuracy and then roll. Cure does not.` },
        ],
      };
    }
    return {
      title: "CHR",
      rows: [
        { k: "You have", v: String(sheet.chr) },
        { k: "What it does", v: "Songs use CHR for magic accuracy. Combined skill plus that dCHR is rolled on a hostile song." },
        { k: "How much it adds", v: `dCHR ${sheet.chr - HARE.chr} adds ${dStatMagicAccuracy(sheet.chr - HARE.chr)} magic accuracy. One miss halves a fixed-duration song. A second miss resists it.` },
      ],
    };
  }

  function spellLines(spell: Spell): { title: string; rows: { k: string; v: string }[] } {
    if (spell.song) {
      const singing = combinedSkill("Singing", mainJob, LEVEL, subJob, subLv);
      const kind = instrumentKind(loadout.range ? ITEMS[loadout.range]?.kind : undefined);
      const instrument = kind === "string"
        ? combinedSkill("String Instrument", mainJob, LEVEL, subJob, subLv)
        : kind === "wind"
          ? combinedSkill("Wind Instrument", mainJob, LEVEL, subJob, subLv)
          : 0;
      const card = songCard(spell.name, singing, instrument, kind === "string" ? instrument : 0);
      if (card) {
        return {
          title: spell.name,
          rows: [
            { k: "Effect", v: card.effect },
            { k: "Type", v: SCHOOL[spell.school] },
            { k: "Element", v: card.element },
            { k: "Duration", v: card.duration },
            { k: "Cost", v: "0 MP" },
            { k: "Cast", v: spellCast(spell, sheet.celerity) },
            { k: "Recast", v: spell.recast != null ? clock(spell.recast) : "—" },
            { k: "Range", v: card.range },
            { k: "Radius", v: card.radius },
            { k: "Job levels", v: jobNeeds(spell) },
          ],
        };
      }
    }
    let effect = "—";
    if (spell.colure) {
      const geomancy = combinedSkill("Geomancy", mainJob, LEVEL, subJob, subLv);
      const bell = combinedSkill("Handbell", mainJob, LEVEL, subJob, subLv);
      effect = colureEffect(spell, geomancy, bell);
    } else if (spell.raise) {
      effect = raiseEffect(spell, sheet.hp);
    } else if (spell.reraise) {
      effect = reraiseEffect(spell, sheet.hp);
    } else if (spell.foil) {
      effect = foilEffect();
    } else if (spell.summon) {
      const summoning = combinedSkill("Summoning Magic", mainJob, LEVEL, subJob, subLv);
      effect = summonEffect(spell, summoning);
    } else if (spell.nuke && ANCIENT.has(spell.nuke)) {
      effect = `Deals heavy elemental damage to one enemy. Lowers that enemy's magic evasion by 30 for 10 seconds against the element that beats this one. This yard does not store that 30. ${damageChart(bookMacc(spell, sheet, "Elemental Magic", "int"), nakedMeva())}`;
    } else if (spell.nuke && areaNuke(spell.name)) {
      const d = elementalD(spell.nuke, sheet.magic.dInt, 0);
      const hit = d == null ? "—" : String(applyMab(d, sheet.mab, 0));
      effect = `Deals ${elementLabel(spell).toLowerCase()} damage in a 10' area. The unresisted hit against the Tropical Rarab is ${hit}. ${damageChart(bookMacc(spell, sheet, "Elemental Magic", "int"), nakedMeva())}`;
    } else if (spell.nuke) {
      const d = elementalD(spell.nuke, sheet.magic.dInt, 0);
      const hit = d == null ? "—" : String(applyMab(d, sheet.mab, 0));
      effect = `Deals ${elementLabel(spell).toLowerCase()} damage to one enemy. The unresisted hit against the Tropical Rarab is ${hit}. ${damageChart(bookMacc(spell, sheet, "Elemental Magic", "int"), nakedMeva())}`;
    } else if (spell.helix) {
      const schLevel = mainJob === "SCH" ? LEVEL : subJob === "SCH" ? subLv : 0;
      const d = helixD(sheet.magic.dInt, 0);
      const arts = mainJob === "SCH" ? darkArtsHelixBonus(schLevel, true) : 0;
      const hit = d == null ? "—" : String(applyMab(d + arts, sheet.mab, 0));
      const left = helixSeconds(schLevel);
      const artsLine = arts > 0 ? ` Dark Arts adds ${arts} to the base before Magic Attack Bonus.` : "";
      effect = `Deals ${elementLabel(spell).toLowerCase()} damage to one enemy, then the same hit again. The unresisted opening hit against the Tropical Rarab is ${hit}.${artsLine} It lasts ${left} seconds. The same damage tocks once between 1 and 10 seconds, then every ${HELIX_TOCK_GAP}. A tock cannot pass ${HELIX_TOCK_CAP}. A new Helix replaces the one already there. It does not splash. Ebullience adds 20% and is spent. Manifestation does not spread it. ${damageChart(bookMacc(spell, sheet, "Elemental Magic", "int"), nakedMeva())}`;
    } else if (spell.storm) {
      effect = stormCard(spell);
    } else if (spell.klimaform) {
      effect = `Raises magic accuracy by 15 for a spell whose element matches the weather. Dark Magic skill does not change that 15. No weather means no bonus. It does not deal damage. Savant's Loafers and Arbatel Loafers are not equipped, so there is no damage term. It lasts 5:00. Enhancing duration gear does not lengthen it. Perpetuance is not in this kit. Composure triples it and stops at 30:00. Intension is not in this yard, so it is not overwritten. Manifestation would share it inside 10', centered on you. This yard's party is you. The Tropical Rarab is not a party member. The body is the black-magic chant. A dark sigil opens under you, and a faint ring stays while Klimaform does. The client cast is 3 seconds and the recast is 3:00. BG still prints a 7 second cast. Gamer Escape still prints 5 seconds and 3 minutes. Cumulative enmity 300, volatile enmity 1.`;
    } else if (spell.spike) {
      const base = spikeBase(spell.spike, sheet.int);
      effect = `Covers you. A connecting melee hit deals ${elementLabel(spell).toLowerCase()} damage back. At this INT the base is ${base}, and after Magic Attack Bonus the hit is ${spikeDamage(base, sheet.mab)}.`;
    } else if (spell.debuff) {
      const pot = elementDebuffPotency(sheet.int);
      effect = `Lowers ${DEBUFF_STAT_LABEL[DEBUFF_STAT[spell.debuff]]}. At this INT that is −${pot.stat}, and ${pot.dot} damage every 3 seconds.`;
    } else if (spell.enfeeble === "Blind") {
      effect = `Lowers accuracy. Against the Tropical Rarab that is −${blindPotency(sheet.int - HARE.int)}. ${durationChart(bookMacc(spell, sheet, "Enfeebling Magic", "int"), nakedMeva(), BLIND_SECONDS)}`;
    } else if (spell.enfeeble === "Blind II") {
      effect = `Lowers accuracy further. Against the Tropical Rarab that is −${blindTwoPotency(sheet.int - HARE.int)}. It replaces Blind. Blind does not replace it. ${durationChart(bookMacc(spell, sheet, "Enfeebling Magic", "int"), nakedMeva(), BLIND_II_SECONDS)}`;
    } else if (spell.enfeeble === "Bind") {
      effect = `Stops movement. Damage removes it. A miss does not. Cumulative enmity ${BIND_CE}, volatile ${BIND_VE}. The cast adds that enmity, and the hare still cannot walk until Bind wears off.`;
    } else if (spell.enfeeble === "Sleep" || spell.enfeeble === "Sleep II") {
      effect = `Puts one enemy to sleep. A direct hit wakes it. A damage-over-time tick does not. ${durationChart(bookMacc(spell, sheet, "Enfeebling Magic", "int"), nakedMeva(), sleepSeconds(spell.enfeeble))}`;
    } else if (spell.enfeeble === "Sleepga" || spell.enfeeble === "Sleepga II") {
      effect = `Puts enemies in the area to sleep. A direct hit wakes one. A damage-over-time tick does not. ${durationChart(bookMacc(spell, sheet, "Enfeebling Magic", "int"), nakedMeva(), sleepSeconds(spell.enfeeble))}`;
    } else if (spell.enfeeble === "Slow") {
      const potency = slowPotency(sheet.mnd - HARE.mnd);
      const wait = Math.round((HARE.delay / 60) * slowDelayFactor(potency) * 100) / 100;
      effect = `Lengthens the Tropical Rarab's delay by ${potency}/1024 against its MND ${HARE.mnd}. Delay ${HARE.delay} is ${HARE.delay / 60} seconds, and that becomes ${wait}. The same ratio would lengthen a spell recast. Cast time is not lengthened. The rarab does not cast spells. ${durationChart(bookMacc(spell, sheet, "Enfeebling Magic", "mnd"), nakedMeva(), SLOW_SECONDS)} It refreshes itself. Cumulative enmity ${SLOW_CE}, volatile ${SLOW_VE}. The BG card's 320 is stale. The cast adds that enmity. The printed range is 21'. The client column is 200.`;
    } else if (spell.enfeeble === "Slow II") {
      const potency = slowTwoPotency(sheet.mnd - HARE.mnd);
      const wait = Math.round((HARE.delay / 60) * slowDelayFactor(potency) * 100) / 100;
      effect = `A heavier Slow. Against the Tropical Rarab that is ${potency}/1024, so the ${HARE.delay / 60} second cut becomes ${wait}. The page's ends are about 16.5% and about 39.1%. It replaces Slow. Slow does not replace it. ${durationChart(bookMacc(spell, sheet, "Enfeebling Magic", "mnd"), nakedMeva(), SLOW_II_SECONDS)} The printed range is 20'.`;
    } else if (spell.enfeeble === "Paralyze") {
      const chance = paralyzeChance(sheet.mnd - HARE.mnd);
      effect = `Each melee round has a ${chance}% chance to be canceled against the Tropical Rarab. That is the slashing auto-attack and a TP move. Sleep still blocks the round and does not also roll this chance. A canceled round does not play. ${durationChart(bookMacc(spell, sheet, "Enfeebling Magic", "mnd"), nakedMeva(), PARALYZE_SECONDS)} It refreshes itself. It is not a timed lock. Cumulative enmity ${PARALYZE_CE}, volatile ${PARALYZE_VE}. The cast adds that enmity. The printed range is 21'.`;
    } else if (spell.enfeeble === "Paralyze II") {
      const chance = paralyzeTwoChance(sheet.mnd - HARE.mnd);
      effect = `A heavier Paralyze. Against the Tropical Rarab each auto-attack or TP move has a ${chance}% chance to be canceled. It replaces Paralyze. Paralyze does not replace it. ${durationChart(bookMacc(spell, sheet, "Enfeebling Magic", "mnd"), nakedMeva(), PARALYZE_II_SECONDS)} The printed range is 20'.`;
    } else if (spell.enfeeble === "Gravity") {
      effect = `Lowers movement by about ${GRAVITY_MOVE}%. It does not change attack delay. The client row is cumulative 0 and volatile 0. The first cast still claims, so the rarab turns and chases at ${100 - GRAVITY_MOVE}% speed. The lunge uses the same cut. The page prints 30–120 seconds. A partial resist is not rolled, so it lasts 120. Saboteur is not applied.`;
    } else if (spell.enfeeble === "Dispel") {
      effect = `Removes one beneficial effect. The Tropical Rarab has none, so the log is no effect. Animation 487 still plays for 2 seconds: dark rings climb the body and one gleam lifts off. It is not Erase. Magic accuracy +${DISPEL_MACC} is not rolled.`;
    } else if (spell.enfeeble === "Inundation") {
      effect = "Marks the target for 5 minutes. A skillchain gains ×1.2 for each weapon type after the first, and only when different attackers use them. One attacker stays at ×1. It refreshes itself. It cannot be resisted.";
    } else if (spell.enfeeble === "Distract" || spell.enfeeble === "Frazzle") {
      const skill = combinedSkill("Enfeebling Magic", sheet.job, LEVEL, sheet.sub, sheet.subLevel);
      const down = evasionDownPotency(skill, sheet.mnd - HARE.mnd);
      const bare = hitRate(sheet.accuracy, HARE.evasion, HARE.level - LEVEL);
      const cut = hitRate(sheet.accuracy, HARE.evasion - down, HARE.level - LEVEL);
      effect = spell.enfeeble === "Distract"
        ? `Lowers evasion. Enfeebling Magic ${skill} and dMND ${sheet.mnd - HARE.mnd} give −${down}, capped at 35. The Tropical Rarab's evasion is ${HARE.evasion}. Hit rate is ${bare}, and after the cut it is ${cut}. The hands-at-the-face cast is ice. Animation 933 plays for 2 seconds: ice chevrons slip down the legs. It refreshes itself and does not remove Frazzle. ${durationChart(bookMacc(spell, sheet, "Enfeebling Magic", "mnd"), nakedMeva(), DISTRACT_SECONDS)} Accuracy uses dMND, not dINT. The script's 120 seconds is the pre-2017 base. Composure does not lengthen it. Saboteur is not applied. Cumulative enmity ${DISTRACT_CE}, volatile ${DISTRACT_VE}. The card leaves both blank. The cast adds that enmity. The client range column is 200, printed as 21'. Distract II is level 85 and is not here.`
        : `Lowers magic evasion by the same line. Enfeebling Magic ${skill} and dMND ${sheet.mnd - HARE.mnd} give −${down}, capped at 35. A later spell subtracts that from the Tropical Rarab's magic evasion. This cast is resisted first, then the down is stored. The hands-at-the-face cast is dark. Animation 935 plays for 4 seconds: a broken dark ring at the chest. It refreshes itself and does not remove Distract. ${durationChart(bookMacc(spell, sheet, "Enfeebling Magic", "mnd"), nakedMeva(), FRAZZLE_SECONDS)} Accuracy uses dMND, not dINT. The script's 120 seconds is the pre-2017 base. Composure does not lengthen it. Saboteur is not applied. Cumulative enmity ${FRAZZLE_CE}, volatile ${FRAZZLE_VE}. The card leaves both blank. The cast adds that enmity. The client range column is 200, printed as 21'. Frazzle II is level 92 and is not here.`;
    } else if (spell.enfeeble === "Silence") {
      effect = `Stops spells for 120 seconds before a resist. The Tropical Rarab does not cast, so nothing here is interrupted. No extra magic accuracy is printed, so the bonus is 0. Enfeebling Magic and dMND still count. ${durationChart(bookMacc(spell, sheet, "Enfeebling Magic", "mnd"), nakedMeva(), SILENCE_SECONDS)} The notorious-monster resist counter is not this check. It refreshes itself. Cumulative enmity ${SILENCE_CE}, volatile ${SILENCE_VE}. The BG card leaves volatile blank. The cast adds that enmity. The printed range is 21'.`;
    } else if (spell.enfeeble === "Dia" || spell.enfeeble === "Dia II" || spell.enfeeble === "Dia III" || spell.enfeeble === "Diaga") {
      const hit = applyMab(DIA_HIT[spell.enfeeble], sheet.mab, 0);
      const area = spell.enfeeble === "Diaga" ? " It covers enemies in 10'." : "";
      const land = spell.enfeeble === "Diaga"
        ? " Animation 33 plays for 2 seconds: a ring of daylight on the ground and light pillars standing around it. It is not Dia's shaft, and not Banishga."
        : " The land is a gold shaft for 2 seconds.";
      effect = `Lowers defense by ${DIA_DEF[spell.enfeeble]}/1024 and slips ${DIA_DOT[spell.enfeeble]} HP every 3 seconds. The opening light hit is ${hit} after Magic Attack Bonus. Mind does not add to that hit. It cannot be resisted. A weaker Dia does not replace a stronger Bio or Dia. Dia and Diaga refresh each other. Bio of a higher tier replaces this.${area} The cast is the white-magic chant, light in the hands.${land}`;
    } else if (spell.enfeeble === "Poison" || spell.enfeeble === "Poison II" || spell.enfeeble === "Poisonga") {
      const skill = combinedSkill("Enfeebling Magic", sheet.job, LEVEL, sheet.sub, sheet.subLevel);
      const dot = spell.enfeeble === "Poisonga" ? poisongaPotency(skill) : poisonPotency(skill, spell.enfeeble === "Poison II" ? 2 : 1);
      const rule = spell.enfeeble === "Poisonga"
        ? "It does not overwrite Poison or Poison II. The same Poisonga refreshes."
        : spell.enfeeble === "Poison II"
          ? "It overwrites Poison and Poisonga."
          : "It overwrites Poisonga. Poison II overwrites it.";
      const area = spell.enfeeble === "Poisonga" ? " Enemies in 10' are poisoned." : "";
      effect = `Poisons the target. Enfeebling Magic ${skill} gives ${dot} HP every 3 seconds. INT is not used.${area} ${rule} ${durationChart(bookMacc(spell, sheet, "Enfeebling Magic", "int"), nakedMeva(), poisonSeconds(spell.enfeeble))} The cast gathers water. The land is a purple-green cloud for 2 seconds. Poisonga II is not a player spell. Cumulative enmity ${POISON_CE}, volatile ${POISON_VE}. The cast adds that enmity.`;
    } else if (spell.enfeeble === "Bio" || spell.enfeeble === "Bio II" || spell.enfeeble === "Bio III") {
      const skill = combinedSkill("Dark Magic", mainJob, LEVEL, subJob, subLv);
      const dot = bioPotency(skill, spell.enfeeble);
      const hit = applyMab(BIO_HIT[spell.enfeeble], sheet.mab, 0);
      effect = `Lowers attack by ${BIO_ATK[spell.enfeeble]}/1024 and slips ${dot} HP every 3 seconds at Dark Magic ${skill}. The unresisted opening dark hit is ${hit}. The hit and the status resist separately. INT does not add to that hit, and the Magic Damage stat does not either. ${damageChart(bookMacc(spell, sheet, "Dark Magic", "int"), nakedMeva())} ${durationChart(bookMacc(spell, sheet, "Dark Magic", "int"), nakedMeva(), BIO_SECONDS[spell.enfeeble])} The tiers with Dia are Dia, Bio, Dia II, Bio II, Dia III, Bio III. A weaker one does not land. The same tier refreshes and reads skill again. The dark hit still lands when the status does not. The cast is the dark-magic chant. The land is a dark column and falling drips for 2 seconds, not Poison's green bubbles. Bio IV and Bio V are not here. Cumulative enmity ${BIO_CE}, volatile ${BIO_VE}. The BG card's 320 is stale. The cast adds that enmity. The client range column is 200, printed as 21'.`;
    } else if (spell.enfeeble === "Stun") {
      effect = `Stops the Tropical Rarab from acting for ${STUN_SECONDS} seconds. The card prints 0.5–2 seconds. A partial resist is not rolled, so the full 2 is kept. The script's random 2–8 is not used. It refreshes itself. It does not remove Sleep. An unfinished spell, ability, weaponskill, or swing is interrupted. Nothing in progress is not an error. A hit that already connected is not undone. Magic accuracy +${STUN_MACC} is stored and not rolled. The cast is the dark-magic chant and lasts 0.5 seconds, lightning in the hands. Animation 252 plays for 2 seconds: two thunder circles crossed into an X, not a bolt and not a weapon-skill slap. Red Mage does not learn it. Cumulative enmity ${STUN_CE}, volatile ${STUN_VE}. The cast adds that enmity. The client range column is 200, printed as 21'.`;
    } else if (spell.siphon === "Drain") {
      const max = siphonMax("Drain", sheet.darkMagic);
      effect = `Steals HP. At Dark Magic ${sheet.darkMagic} the unresisted amount is ${siphonMin(max)}–${max}. ${damageChart(bookMacc(spell, sheet, "Dark Magic", "int"), nakedMeva())}`;
    } else if (spell.siphon === "Aspir") {
      const max = siphonMax("Aspir", sheet.darkMagic);
      effect = `Steals MP. At Dark Magic ${sheet.darkMagic} the unresisted amount is ${siphonMin(max)}–${max}. ${damageChart(bookMacc(spell, sheet, "Dark Magic", "int"), nakedMeva())}`;
    } else if (spell.warp) {
      effect = spell.warp === "Warp II"
        ? "Sends one party member to their home point. This yard has no other member, so it lands on you."
        : "Sends you to your registered home point.";
    } else if (spell.cure) {
      const healing = combinedSkill("Healing Magic", mainJob, LEVEL, subJob, subLv);
      const base = cureBase(spell.cure, curePower(sheet.mnd, sheet.vit, healing));
      const raw = cureUndeadD(spell.cure, sheet.mnd - HARE.mnd);
      const undead = raw == null
        ? "Undead damage is not published."
        : `Undead take ${applyMab(raw, sheet.mab, 0)} light damage after Magic Attack Bonus. Potency does not apply.`;
      effect = `Restores ${base} HP before Divine Seal. A living enemy is not a valid target, so it lands on you. ${undead} The Tropical Rarab is not undead.`;
    } else if (spell.curaga) {
      const healing = combinedSkill("Healing Magic", mainJob, LEVEL, subJob, subLv);
      const base = curagaBase(spell.curaga, curagaPower(sheet.mnd, sheet.vit, healing));
      effect = `Restores ${base} HP to party members within 15' of a party target before Divine Seal. The Tropical Rarab is not a valid target, so the circle opens on you and spreads out. Afflatus Solace does not cover it.`;
    } else if (spell.cura) {
      effect = "Restores HP to party members within 10' of you. You cannot center it on someone else. The Tropical Rarab is not a party member, so only you are healed. The cure formula is not published, so no HP number is applied. Divine Seal would double it and is not spent. Afflatus Solace does not cover it. Afflatus Misery records the last HP you lost and would add a bonus; that curve is not published. Enmity is tiered with the HP healed, so none is added.";
    } else if (spell.stoneskin) {
      const enhancing = combinedSkill("Enhancing Magic", mainJob, LEVEL, subJob, subLv);
      const skin = stoneskinPower(sheet.mnd, enhancing);
      effect = `Covers you. At MND ${sheet.mnd} and Enhancing Magic ${enhancing} it absorbs ${skin} damage, capped at 350. It does not refresh while it is already up.`;
    } else if (spell.barrier) {
      const tier = spell.barrier.tier;
      const ve = spell.barrier.area ? BARRIER_AREA_VE : BARRIER_VE;
      const shared = spell.barrier.kind === "protect" ? "Protect" : "Shell";
      const overwrite = `A higher ${shared} replaces a lower one. The same tier refreshes the 30 minutes. A lower tier is no effect. Protect and Shell can both be up. The 30 minutes shrink by target level / spell level ${spell.barrier.effectLevel} only when the target is lower. You are level 75, so they do not.`;
      const hate = `Cumulative enmity ${BARRIER_CE}, volatile ${ve}. The cast adds that enmity.`;
      if (spell.barrier.kind === "protect") {
        const bonus = PROTECT_DEF[tier];
        effect = spell.barrier.area
          ? `Raises defense by ${bonus} for every party member within 10' of you. A summoned trust inside that circle receives the same Protect. Enhancing Magic does not change the number. ${overwrite} ${hate}`
          : `Raises one party member's defense by ${bonus}. An enemy is not a valid target, so this lands on you. Enhancing Magic does not change the number. ${overwrite} ${hate}`;
      } else {
        const cut = SHELL_CUT[tier];
        effect = spell.barrier.area
          ? `Cuts magic damage by ${cut}/256 for every party member within 10' of you. A summoned trust inside that circle receives the same Shell. It is not Magic Defense Bonus, and it does not cut a physical hit. Dust Cloud is earth magic, so Shell cuts that. ${overwrite} ${hate}`
          : `Cuts one party member's magic damage by ${cut}/256. An enemy is not a valid target, so this lands on you. It is not Magic Defense Bonus, and it does not cut a physical hit. Dust Cloud is earth magic, so Shell cuts that. ${overwrite} ${hate}`;
      }
    } else if (spell.regen) {
      const tier = spell.regen.tier;
      const hp = REGEN_HP[tier];
      const veNote = tier === 3 ? " A BG card prints volatile enmity 300. The client row is 165." : "";
      effect = `Restores ${hp} HP every 3 seconds. An enemy is not a valid target, so this lands on you. Enhancing Magic does not change the amount. A higher Regen replaces a lower one. The same tier refreshes. A lower tier is no effect. Auto Regen stacks and stays silent. Merits, Light Arts, Tabula Rasa, Composure, and Regen+ gear are not here. The duration shrinks by target level / spell level ${spell.regen.effectLevel} only when the target is lower. You are level 75, so it does not. Cumulative enmity ${REGEN_CE}, volatile ${REGEN_VE}.${veNote} The cast adds that enmity.`;
    } else if (spell.haste) {
      const modified = swingTiming(sheet.delay, { ...NO_HASTE, magic: HASTE_NUMER }).modifiedDelay;
      const ranged = sheet.skillName === "Archery" || sheet.skillName === "Marksmanship";
      const delayLine = ranged
        ? `This ${sheet.skillName.toLowerCase()} delay stays ${sheet.delay}.`
        : `This weapon's delay ${sheet.delay} becomes ${modified}.`;
      effect = `Magic haste ${HASTE_NUMER}/1024, from 14.65%. ${delayLine} It shortens melee delay and spell recast. It does not shorten cast time, raise movement speed, or change TP per hit. The magic haste cap is 448/1024. Haste II and Hastega are not in this kit. The BG card's 6 second cast is stale; this cast is 3 seconds. Enhancing Magic does not change the amount. Cumulative enmity ${HASTE_CE}, volatile ${HASTE_VE}. The cast adds that enmity.`;
    } else if (spell.refresh) {
      effect = `Restores ${REFRESH_MP} MP every 3 seconds for ${REFRESH_SECONDS} seconds. An enemy is not a valid target, so this lands on you. The cast gathers light. Enhancing Magic does not change the amount. Recasting overwrites it. Refresh II and Refresh III are not here. The duration shrinks by target level / spell level ${spell.refresh.effectLevel} only when the target is lower. You are level 75, so it does not. Composure triples that duration on yourself and stops at 30:00. The amount per tick does not change. Cumulative enmity ${REFRESH_CE}, volatile ${REFRESH_VE}. The cast adds that enmity.`;
    } else if (spell.auspice) {
      const base = enspellTwoBase(sheet.enhancing);
      effect = `Subtle Blow +${AUSPICE_SUBTLE_BLOW}, toward the +50 Subtle Blow I cap. Combined with Subtle Blow II the cut stops at 75%. A summoned trust within 10' receives Auspice. The Tropical Rarab gains less TP from a hit that connects. Each hit is floored on its own. Haste does not change that TP. Orison Duckbills are not equipped. Subtle Blow itself has no hit flash. With Afflatus Misery, only you gain two more effects. The first swing of an attack round that connects deals Enspell II light damage and plays a small light flash. A miss on that first swing does not flash or deal light damage, even if a later Double Attack hits. The light damage does not grant TP. It does add enmity. Enhancing Magic ${sheet.enhancing} gives a base of ${base}, then +1 for each later round that connects, up to ${base * 2}. Day, weather, staff, and resist are not applied. A missed attack round adds about +${AUSPICE_MISS_ACC} accuracy, up to +${AUSPICE_MISS_ACC_CAP}. The page calls that step approximate. It helps later swings and weapon skills while both effects are up. Recasting Auspice resets the damage count and keeps the accuracy. Switching to Afflatus Solace, or letting either effect wear, clears the accuracy. Letting Auspice wear also clears the damage count. Animus Misery merits are not unlocked. Casting Auspice removes a tier I enspell. Casting a tier I enspell removes Auspice. A tier II enspell removes Auspice, and Auspice does not land while one is up. Composure is not here. Gamer Escape's 2:30 is stale; this lasts 3 minutes. The BG card's 7 second cast and 30 MP are stale; this is 3 seconds and 48 MP. The duration shrinks by target level / spell level ${spell.auspice.effectLevel} only when the target is lower. You are level 75, so it does not. Cumulative enmity ${AUSPICE_CE}, volatile ${AUSPICE_VE}. The cast adds that enmity.`;
    } else if (spell.aquaveil) {
      const enhancing = combinedSkill("Enhancing Magic", mainJob, LEVEL, subJob, subLv);
      const charges = aquaveilCharges(enhancing);
      effect = `Covers you. Enhancing Magic ${enhancing} grants ${charges} ${charges === 1 ? "charge" : "charges"}. 300 and below is 1. 301 through 500 is 2. 501 and above is 3. Aquaveil+ gear is not equipped. It would stop one damage interrupt per charge. A hit's interrupt chance is not a published percent, so the charges are kept and not spent. Moving still breaks the cast. The spell overwrites itself. The client cast is 5 seconds. The power table lasts 600 seconds. Gamer Escape's 9 second cast and 5 minute cap are stale. The duration shrinks by target level / spell level 1 only when the target is lower. You are level 75, so it does not. Cumulative enmity ${AQUAVEIL_CE}, volatile ${AQUAVEIL_VE}. The cast adds that enmity.`;
    } else if (spell.blink) {
      effect = `Covers you with ${BLINK_SHADOWS} shadows and overwrites itself, even if a shadow remains. One shadow absorbs one single-target physical hit. An auto-attack and Foot Kick each take one. Whirl Claws needs three, and fewer than that still lets the cut land and strips what remains. Dust Cloud ignores shadows. The proc rate is not published, so a connecting physical hit that the shadows cover does not trigger spikes. Utsusemi is a different shadow spell and is not here. The duration is 300 seconds. It shrinks by target level / spell level 19 only when the target is lower. You are level 75, so it does not. Cumulative enmity ${BLINK_CE}, volatile ${BLINK_VE}. The BG card's 1 and 300 are stale. The cast adds that enmity.`;
    } else if (spell.phalanx) {
      const enhancing = combinedSkill("Enhancing Magic", mainJob, LEVEL, subJob, subLv);
      const cut = phalanxPower(enhancing);
      effect = `Reduces each hit by ${cut} at Enhancing Magic ${enhancing}. At 300 skill and below that is floor(skill / 10) − 2. Above 300 it is 28 + floor((skill − 300.5) / 28.5), and it stops at 35. Phalanx+ gear is not equipped. The cut is applied after damage taken. An equal or stronger Phalanx replaces this. A weaker one is no effect. A cut from the Tropical Rarab loses that many points, then Stoneskin. The cast is the white-magic chant, light in the hands. Animation 106 plays for 2 seconds: gold spear-wall plates close around you, not Protect's cage and not Shell's dome. Paladin learns it at 77, which fails here. Phalanx II is not this spell. The duration is ${PHALANX_SECONDS} seconds. It shrinks by target level / spell level 33 only when the target is lower. You are level 75, so it does not. Composure triples that on yourself. Cumulative enmity ${PHALANX_CE}, volatile ${PHALANX_VE}. The BG card's 0 and 160 are stale. The cast adds that enmity.`;
    } else if (spell.reprisal) {
      effect = `Raises the shield skill you have right now by ×${REPRISAL_SKILL}. It is not snapshotted. Block rate is multiplied by ${REPRISAL_BLOCK}, so 30% becomes 45%. Priwen and Adamas are not equipped. A block reflects ${REPRISAL_REFLECT}% of the damage the shield kept, as light magic, before Phalanx, Stoneskin, Sentinel, and Invincible. A blocked weaponskill is not reflected. The old cap of twice your maximum HP was removed in May 2021, so only the minute ends it. A block reflects that light damage. Shield Mastery adds its TP when the hit would have passed Stoneskin before the shield's percent. Spikes overwrite this. This does not overwrite spikes. The cast is the white-magic chant and lasts 1 second. Gamer Escape's 0.5 is stale. Animation 143 plays for 2 seconds: a pale shield disc and a light spike, not a spike-spell cloak. The duration is ${REPRISAL_SECONDS} seconds. Spell level is 1, so it does not shrink. Composure triples it on yourself. Cumulative enmity ${REPRISAL_CE}, volatile ${REPRISAL_VE}. The BG card's cumulative 0 is stale. The cast adds that enmity.`;
    } else if (spell.enspell) {
      const element = elementLabel(spell).toLowerCase();
      const base = enspellTwoBase(sheet.enhancing);
      const opposed = ENSPELL_OPPOSED[spell.enspell.element];
      const opposedLabel = opposed === "thunder" ? "lightning" : opposed;
      const castLine = `The cast is the white-magic chant, hands at the waist, while ${element} gathers. The land plays for 2 seconds on the main hand, because the weapon stays hidden through the raise. A few ${element} motes then ride the drawn weapon until this wears off.`;
      const skip = "A miss does not proc. A weapon skill does not. Archery, marksmanship, and throwing do not. Day, weather, staff, affinity, and resist stay 1. Magic Attack Bonus does not apply. The hit gives no TP and no enmity.";
      effect = spell.enspell.tier === 1
        ? `${castLine} Every connecting melee hit of the round deals ${element} damage, including a double attack. The amount is set when this lands. Enhancing Magic ${sheet.enhancing} gives ${base}, or ${base * 3} while Composure is up. ${skip} Another tier I enspell replaces this and takes a new snapshot. This cannot replace a tier II enspell. It removes Auspice, and Auspice removes it. Duration is a flat 3:00, not the enhancing-duration curve. Composure makes that 9:00 and stops at 30:00. Cumulative enmity ${ENSPELL_CE}, volatile ${ENSPELL_VE}. The BG card's 300 is stale. The cast adds that enmity.`
        : `${castLine} Only the first hit of an attack round procs. A double attack and a later punch do not. If that first hit misses, nothing else in the round procs and the count does not rise. Enhancing Magic is read again each round. At ${sheet.enhancing} the first connecting round is ${base}, then +1 per later round that connects, up to ${base * 2}. The count keeps climbing after the cap. Recasting, or letting this wear off, resets it. Composure triples the damage that lands, not the +1 step, so the cap is ${base * 6}. ${skip} It would lower the target's ${opposedLabel} resistance for a few seconds. Magic evasion is not rolled, so that −10 is not applied. This replaces a tier I enspell, another tier II enspell, and Auspice. Auspice cannot land over it. Duration is a flat 3:00. Composure makes that 9:00 and stops at 30:00. The BG card's 10 second recast, cumulative enmity 80, and volatile 240 are stale. The client row is 30 seconds, cumulative ${ENSPELL_II_CE}, volatile ${ENSPELL_II_VE}. The cast adds that enmity.`;
    } else if (spell.erase) {
      effect = `Removes the first detrimental effect you have that has no -na spell. That list is the one the page names. Poison, Paralysis, Silence, Blindness, and the other -na statuses stay. Terror, Amnesia, Muddle, and Curse (Recovery) stay. "Various other" is not guessed. This yard's only party member is you, so an enemy is not a target. If nothing matches, there is no effect. The client cast is 2.5 seconds. The BG card's 3 seconds is stale. The client radius column is not a party radius. Cumulative enmity ${ERASE_CE}, volatile ${ERASE_VE}. The cast adds that enmity.`;
    } else if (spell.na === "Poisona") {
      effect = "Removes Poison from a party member. An enemy is not a valid target, so this lands on you. If you do not have Poison, there is no effect.";
    } else if (spell.na === "Paralyna") {
      effect = "Removes Paralysis from a party member. An enemy is not a valid target, so this lands on you. If you do not have Paralysis, there is no effect.";
    } else if (spell.na === "Blindna") {
      effect = "Removes Blindness from a party member. An enemy is not a valid target, so this lands on you. It does not remove the Tropical Rarab's Blind.";
    } else if (spell.na === "Silena") {
      effect = "Removes Silence from a party member. The description also names Mute. Tested notes say it does not remove Mute, so this yard does not.";
    } else if (spell.na === "Stona") {
      effect = "Removes Petrification from a party member. An enemy is not a valid target, so this lands on you.";
    } else if (spell.na === "Viruna") {
      effect = "Removes Disease and Plague from a party member. An enemy is not a valid target, so this lands on you.";
    } else if (spell.na === "Cursna") {
      const healing = combinedSkill("Healing Magic", mainJob, LEVEL, subJob, subLv);
      const rate = Math.round(cursnaDoomRate(healing) * 100) / 100;
      effect = `Removes Curse and Bane. Doom is a separate chance: 10 + Healing Magic / 30, then Cursna+ gear. No Cursna+ gear is equipped, so at Healing Magic ${healing} the chance is ${rate}%. It does not remove Zombie, Haunt, or Curse (Recovery).`;
    } else if (spell.esuna) {
      effect = "Removes one status you have that Poisona, Paralyna, Blindna, Viruna, or Cursna would remove. Party members within 10' lose that same status. This yard has no other party member. Afflatus Misery removes up to two, and can also remove what Erase removes, plus Curse (Recovery). Songs stay. Divine Seal does not change it.";
    } else if (spell.sacrifice) {
      effect = "Transfers one status that Poisona, Paralyna, Blindna, Viruna, or Cursna would remove from another party member to you. It does not take Silence or Petrification. This yard has no other party member, so there is no effect. Afflatus Solace can take up to seven, including what Erase removes and Curse (Recovery).";
    } else if (spell.banish) {
      const dMnd = sheet.mnd - HARE.mnd;
      const hit = banishDamage(spell.banish, dMnd, sheet.mab, 0, false);
      const undead = banishDamage(spell.banish, dMnd, sheet.mab, 0, true);
      const down = BANISH_DOWN[spell.banish];
      const area = spell.radius != null ? ` to enemies within ${spell.radius}'` : " to one enemy";
      effect = `Deals light damage${area}. The unresisted hit against the Tropical Rarab is ${hit}. Undead take ${undead}, and their special defense falls by ${down.num}/256 for ${down.seconds}s. A lower tier does not replace a higher one. The hare is not undead, so only the damage lands. Divine Magic does not change the damage number. ${damageChart(bookMacc(spell, sheet, "Divine Magic", "mnd"), nakedMeva())}`;
    } else if (spell.holy) {
      const hit = holyDamage(sheet.mnd - HARE.mnd, sheet.mab, 0);
      effect = `Deals light damage to one enemy. The unresisted hit against the Tropical Rarab is ${hit}. It does not add undead damage and it does not lower special defense. Divine Magic does not change the damage number. ${damageChart(bookMacc(spell, sheet, "Divine Magic", "mnd"), nakedMeva())}`;
    } else if (spell.flash) {
      effect = `Blinds one enemy. Accuracy −${FLASH_ACC} before a resist. It is said to decrease rapidly, and no curve is published, so a full land holds for the duration. It does not deal damage. ${durationChart(bookMacc(spell, sheet, "Divine Magic", "mnd"), nakedMeva(), FLASH_SECONDS)} Cumulative enmity ${FLASH_CE}, volatile enmity ${FLASH_VE}.`;
    } else if (spell.repose) {
      effect = `Light sleep on any enemy, not only undead. It replaces Sleep and Sleepga. It does not replace Sleep II, and Sleep II does not replace it. A direct hit wakes the target. ${durationChart(bookMacc(spell, sheet, "Divine Magic", "mnd"), nakedMeva(), sleepSeconds("Repose"))}`;
    } else if (spell.bar) {
      const enhancing = combinedSkill("Enhancing Magic", mainJob, LEVEL, subJob, subLv);
      const meva = nakedMeva();
      if (spell.bar.kind === "element") {
        const power = elementalBarResistance(enhancing);
        const label = barResistLabel(spell.bar.resists);
        effect = `Adds ${power} magic evasion against ${label} for party members within 10'. Enhancing Magic ${enhancing}: at 300 and below the bar is 40 plus floor(skill / 5). Above 300 it is 25 plus floor(skill / 4). It stops at 150. Merits are not ranked. One point is one magic evasion against that element, after the target's base. A monster's base is C rank. The Tropical Rarab at 75 is ${meva}. Its resistance rank is not published, so the multiplier stays 1. Magic hit rate below 0 is 50 plus floor(dMAcc / 2). At 0 and above it is 50 plus dMAcc, and it stops at 95. Damage can fall to 1/2, 1/4, and 1/8. 1/8 is not zero. Rank 5 or lower forces that last step. Rank 10 or lower holds the hit rate at 5%. Rank 50 or lower is the high-resistance side of the table, and that side is at least a half resist. 100% is not forced to half. This ward is on you. Dust Cloud is earth magic, but the monster's magic accuracy is not published and a player's base magic evasion is not on the skill table, so the breath is not cut by this bar. Duration is ${BAR_SECONDS / 60} minutes. It shrinks only when the target is lower than the spell. You are 75, so it does not. A new element bar replaces the old one. A status bar can be up at the same time.`;
      } else {
        const label = barResistLabel(spell.bar.resists);
        const blind = spell.name === "Barblindra"
          ? " Dust Cloud blinds you. This bar would add magic evasion against Blindness, but monster magic accuracy and player base magic evasion are not published, so the blind is not stopped here. Resist Blind, when the job has it, is the separate Resist! roll."
          : " Nothing in this yard puts that status on you, so a monster spell does not test this magic evasion.";
        const para = spell.name === "Barparalyzra" ? " Paralysis is also ice, so an ice bar adds as well. The other status elements are not printed and are not guessed." : "";
        effect = `Adds ${STATUS_BAR_RESIST} magic evasion against ${label}. It does not read Enhancing Magic. A self-target status bar would be 30. This kit's bars are area bars, so it is ${STATUS_BAR_RESIST}. This is magic evasion, not the Resist! trait. Resist! is a separate check: 1 point is 1% against a normal monster and 0.5% against a notorious monster, and it stops at 90%.${para}${blind} The Tropical Rarab's base magic evasion is ${meva}. Duration is 8 minutes. A new status bar replaces the old one. An element bar can be up at the same time.`;
      }
    } else if (spell.nin) {
      const skill = combinedSkill("Ninjutsu", sheet.job, LEVEL, sheet.sub, sheet.subLevel);
      effect = ninjutsuEffect(spell, skill, sheet.int - HARE.int, mainJob === "NIN");
    } else if (spell.blue != null && "physical" in spell.blue && spell.name === "Battle Dance") {
      effect = `Area slash, centered on you. One physical hit. Blue Magic skill sets the base, and it stops at ${BATTLE_DANCE.dCap}. fSTR is floor((your STR − the target's VIT + 4) / 4), and it stops at 22. The stat term is 30% of STR. The weapon-skill coefficient is 2.0 at every TP tier. Chain Affinity doubles that term, forces the critical hit, spends all of your TP, and a connecting hit can open Impaction. It is spent even when nobody is in the area. It does not spend TP otherwise. A hit also lowers DEX by ${BATTLE_DEX}. There is no separate resist roll. The duration is ${BATTLE_SECONDS} seconds. Under Chain Affinity it walks 90 at 0 TP, 480 at 1500 TP, and 680 at 3000 TP. Azure Lore uses that 3000 TP anchor, 680 seconds. The unverified 800-second note is not used. Without either buff the duration stays ${BATTLE_SECONDS}, even though the card says it varies with TP. The hare's accuracy becomes floor((DEX − ${BATTLE_DEX}) × 0.75) plus its combat skill, and its critical-hit DEX falls by ${BATTLE_DEX}. It refreshes its own DEX Down. The range box is blank, so this yard uses ${BATTLE_RADIUS}', checked when the spell lands. A target outside that area, dead, or charmed takes no damage, gains no DEX Down, and is not claimed. The script can remove 1, 2, or 3 shadows. The hare has none, so that removal is not rolled, and it does not strip your shadows. The enmity box is blank. A connecting cast claims, and the damage adds its own enmity. No fixed hate is added. It breaks Mazurka. Burst Affinity is not spent. An Orc teaches it at Blue Magic 8. No Orc is in the yard yet, so it is already learned. Setting it grants DEX +${BATTLE_DANCE.dex} while Blue Mage is main. It is 4 trait points of Attack Bonus and 3 set points. With Uppercut, also 4 trait points and 3 set points, Attack Bonus is +10. Neither spell grants it alone. It does not stack with Warrior, Dark Knight, or Dragoon. The higher value is kept. A support job gets neither the trait nor the DEX. The motion is the blue-magic cast, then bronze slashes spin around you. A landed hit drops an ochre puff on the target.`;
    } else if (spell.blue != null && "physical" in spell.blue && spell.name === "Uppercut") {
      effect = `One blunt hit at ${UPPERCUT.range}'. Blue Magic skill sets the base, and it stops at ${UPPERCUT.dCap}. fSTR is floor((your STR − the target's VIT + 4) / 4), and it stops at 22. The stat term is 35% of STR. The weapon-skill coefficient is 1.5 at every TP tier. Damage varies with TP through the attack multiplier, not that coefficient. Attack is ×1.6 even at 0 TP. Chain Affinity walks that from 1.6 at 0 TP through 2.0 at 1500 TP to 2.3 at 3000 TP, doubles the stat term, forces the critical hit, and spends all TP, including on a miss. Azure Lore sets the multiplier to 2.4. It does not itself double the stat term or force a critical hit, and it is not consumed. A miss does not skillchain. A connecting hit tries Liquefaction, then Impaction. The monster version knocks back. This spell does not move the target. No additional status. The current card's recast is 17 seconds. The script header's 17.75 is not used. The enmity box is blank. The cast claims, and the damage adds its own enmity. No fixed hate is added. It breaks Mazurka. Burst Affinity is not spent. A Goobbue teaches it at Blue Magic 86. No Goobbue is in the yard yet, so it is already learned. Setting it grants STR +${UPPERCUT.str} and DEX +${UPPERCUT.dex} while Blue Mage is main. It is 4 trait points of Attack Bonus and 3 set points. With Battle Dance, Attack Bonus is +10. The +2 STR still changes attack when the trait is not up. A support job gets neither the stats nor the trait. The motion is the blue-magic cast, then a rising blunt strike and a short impact on the target. The sword stays in hand. Nothing lingers.`;
    } else if (spell.blue != null && "physical" in spell.blue && spell.name === "Frenetic Rip") {
      effect = `Three blunt hits at ${FRENETIC_RIP.range}'. Blue Magic skill sets the base, and it stops at ${FRENETIC_RIP.dCap}. At Blue Magic 276 that term is 63, so the cap does not bind. fSTR is floor((your STR − the target's VIT + 4) / 4), and it stops at 22. The stat term is 20% of STR and 20% of DEX. Only the first hit uses the weapon-skill coefficient. The second and third stay at 1. That later coefficient is not printed. The physical blue function uses 1. The first coefficient is 1.359375 until Chain Affinity or Azure Lore is up, even though the card says damage varies with TP. Chain Affinity walks 1.359375 at 0 TP, 2.0703125 at 1500 TP, and 2.359375 at 3000 TP, doubles the stat term, forces the critical hit on every connecting hit, and spends all TP, including when every hit misses. Azure Lore sets that first coefficient to 2.609375. It does not itself double the stat term or force a critical hit, and it is not consumed. BG-Wiki says the spell possesses an attack bonus and does not print it. The script leaves attack at 1, so no bonus is applied. Each hit rolls accuracy on its own. A first-hit accuracy bonus is not printed, so none is added. A miss on one hit does not cancel the others. A connecting hit opens Induration, and it closes Reverberation into Induration. A full miss does not skillchain. No additional status. The range box is blank, so this yard uses ${FRENETIC_RIP.range}'. The enmity box is blank. The cast claims, and the damage adds its own enmity. Each connecting hit gives the hare 100 TP. It breaks Mazurka. Burst Affinity is not spent. An Imp teaches it at Blue Magic 186, and only after a critical hit breaks the horn. No Imp is in the yard yet, so it is already learned. Setting it grants INT +${FRENETIC_RIP.int} while Blue Mage is main. It is 4 trait points of Accuracy Bonus and 3 set points. With Disseverment, also 4 trait points and 5 set points, Accuracy Bonus is +10. Neither spell grants it alone. It does not stack with Ranger. The higher value is kept. A support job gets neither the trait nor the INT. The motion is the blue-magic cast, then three blunt rips into the target.`;
    } else if (spell.blue != null && "physical" in spell.blue && spell.name === "Cannonball") {
      effect = `One blunt hit at ${CANNONBALL.range}'. It is not a ranged attack. Blue Magic skill sets the base, and it is not capped. At Blue Magic 276 that term is 63. fSTR is floor((your STR − the target's VIT + 4) / 4), and it stops at 22. The stat term is 50% of STR and 50% of VIT. The weapon-skill coefficient stays 1.75 until Chain Affinity or Azure Lore is up, even though the card says damage varies with TP. Chain Affinity walks 1.75 at 0 TP, 2.125 at 1500 TP, and 2.75 at 3000 TP. It doubles the stat term, forces the critical hit, spends all TP, and a connecting hit opens Fusion. Azure Lore sets the coefficient to 2.875. It does not itself double the stat term or force a critical hit, and it is not consumed. The script's 3 is not used. The pDIF ratio uses your Defense in place of Attack. On this sheet that Defense is ${sheet.defense}. Cocoon and Protect raise it because they are already on Defense. Blue Magic skill + 8 + STR/2 is not used. No additional status. The enmity box is blank. The cast claims, and the damage adds its own enmity. A connecting hit gives the hare 100 TP. It breaks Mazurka. Burst Affinity is not spent. A Wamouracampa teaches it at Blue Magic 220. No Wamouracampa is in the yard yet, so it is already learned. Setting it grants STR +${CANNONBALL.str} and DEX +${CANNONBALL.dex} while Blue Mage is main. The script says Combos: None, so it grants no trait. A support job gets neither the stats nor the spell. The motion is the blue-magic cast, then an iron sphere rolls out of you and slams the target. Dust kicks up where it lands.`;
    } else if (spell.blue != null && "physical" in spell.blue && spell.name === "Disseverment") {
      effect = `Five piercing hits at ${DISSEVERMENT.range}'. Blue Magic skill sets the base, and it stops at ${DISSEVERMENT.dCap}. At Blue Magic 276 that term is 63, so the cap does not bind. fSTR is floor((your STR − the target's VIT + 4) / 4), and it stops at 22. The stat term is 20% of STR and 20% of DEX. The weapon-skill coefficient is 1.5 at every TP tier, including Azure Lore. Only the first hit uses 1.5. The other four stay at 1. Attack is 90% of normal. BG-Wiki prints that 10% penalty. The script's 1.05 is not used. Chain Affinity doubles the stat term, forces the critical hit, and spends all TP. It does not raise the attack. The card says accuracy varies with TP. No anchors are printed. The script's floor(TP / 50) and its Azure Lore bonus of 70 are marked as made up, so no accuracy is added. Each hit rolls accuracy on its own. A connecting hit tries Distortion. A full miss does not skillchain and does not poison. Poison lands when any hit connects. There is no separate resist roll. The slip is floor(level / 5) + 3, stopping at 22. On this sheet that is ${dissevermentPoison(LEVEL)} HP every 3 seconds for ${DISSEVER_POISON_SECONDS} seconds. A stronger poison already on the hare is left alone. The range box is blank, so this yard uses ${DISSEVERMENT.range}'. The enmity box is blank. The cast claims, and the damage adds its own enmity. Each connecting hit gives the hare 100 TP. It breaks Mazurka. Burst Affinity is not spent. A dagger Aern teaches it at Blue Magic 230. No Aern is in the yard yet, so it is already learned. Setting it grants INT +${DISSEVERMENT.int} and MND ${DISSEVERMENT.mnd} while Blue Mage is main. It is 4 trait points of Accuracy Bonus and 5 set points. With Frenetic Rip, Accuracy Bonus is +10. A support job gets neither the stats nor the trait. The motion is the blue-magic cast, then five pierces. A landed poison leaves a violet puff on the target.`;
    } else if (spell.blue != null && "physical" in spell.blue && spell.name === "Power Attack") {
      effect = `One blunt hit at ${POWER_ATTACK.range}'. Blue Magic skill sets the base, and it stops at ${POWER_ATTACK.dCap}. fSTR is floor((your STR − the target's VIT + 4) / 4), and it stops at 22. The stat term is 10% of STR and 10% of VIT. The weapon-skill coefficient is ${POWER_ATTACK_FTP} at every TP tier, including Azure Lore. Attack is ×${POWER_ATTACK_MULT} at every tier. Chain Affinity does not raise that attack. It doubles the stat term, forces the critical hit, spends all TP, and a connecting hit opens Reverberation. The script's critical-hit walk, 0 at 0 TP, 15 at 1500, and 30 at 3000, is not used, because Chain Affinity in this yard forces the critical hit. Without Chain Affinity or Azure Lore the chance stays 0, even though the card says it varies with TP. Azure Lore sets the chance to ${Math.round(POWER_ATTACK_AZURE_CRIT * 100)}%. That is not a forced critical hit, and Azure Lore is not consumed. Native critical hit rate is not added. No additional status. The monster version is a horn slam. This spell does not move you. The client range column is 30. Foot Kick uses that same 30 and this yard keeps the card's ${POWER_ATTACK.range}', so this spell does too. The enmity box is blank. The cast claims, and the damage adds its own enmity. A connecting hit gives the hare 100 TP. It breaks Mazurka. Burst Affinity is not spent. A Beetle teaches it at Blue Magic 0. No Beetle is in the yard yet, so it is already learned. Setting it grants MND +${POWER_ATTACK.mnd} while Blue Mage is main. It is 4 trait points of Plantoid Killer and 1 set point. The trait needs 8 trait points and 3 set points. Mandibular Bite is 4 trait points and 2 set points, so setting both grants Plantoid Killer. Spiral Spin is 4 trait points and 3 set points, so setting it with this spell also grants Plantoid Killer. This spell alone does not grant it. A support job gets neither the MND nor the trait. The motion is the blue-magic cast, then a beetle horn drops onto the target. It is heavier and more vertical than Uppercut.`;
    } else if (spell.blue != null && "physical" in spell.blue && spell.name === "Sprout Smack") {
      effect = `One blunt hit at ${SPROUT_SMACK.range}'. Blue Magic skill sets the base, and it stops at ${SPROUT_SMACK.dCap}. fSTR is floor((your STR − the target's VIT + 4) / 4), and it stops at 22. The stat term is 30% of VIT. The weapon-skill coefficient is ${SPROUT_SMACK.ftp} at every TP tier, including Azure Lore. Slow is a static 15%, stored as ${SPROUT_SLOW}/1024, the same unit Slow uses at 0 dMND. The script's power 1500 is the other scale and is not stored. There is no separate resist roll. A miss does not slow. Slow II is stronger and is left alone. A Slow whose potency is already above ${SPROUT_SLOW} is left alone. An equal or weaker Slow is refreshed. The duration is 180 seconds unless Chain Affinity is spent, which walks 180 at 0 TP, 360 at 1500, and 400 at 3000. Azure Lore uses 450. The script marks those anchors as needing verification. They are the only numbers printed, so this yard uses them. Without either buff the duration stays 180, even though the card says it varies with TP. A connecting hit opens Reverberation. A miss does not. The enmity box is blank. The cast claims, and the damage adds its own enmity. A connecting hit gives the hare 100 TP. It breaks Mazurka. Burst Affinity is not spent. A Sapling teaches it at Blue Magic 0. No Sapling is in the yard yet, so it is already learned. Setting it grants MND +${SPROUT_SMACK.mnd} while Blue Mage is main. It is 4 trait points of Beast Killer and 2 set points. With Wild Oats the trait is +8% damage dealt to beasts. This spell alone does not grant it. The Tropical Rarab is a beast. It does not stack with Beastmaster. The higher value is kept. A support job gets neither the MND nor the trait. The motion is the blue-magic cast, then a green branch slaps the target. A landed Slow uses the earth rings already drawn for Slow.`;
    } else if (spell.blue != null && "physical" in spell.blue && spell.name === "Wild Oats") {
      effect = `One piercing hit at ${WILD_OATS.range}'. It is not a ranged attack. The client range column is 120, which this yard would read as 12'. The card prints ${WILD_OATS.range}', so that is the range. Shadows, Sneak Attack, and Trick Attack would see a melee hit. Blue Magic skill sets the base, and it stops at ${WILD_OATS.dCap}. fSTR is floor((your STR − the target's VIT + 4) / 4), and it stops at 22. The stat term is 30% of AGI. The weapon-skill coefficient is ${WILD_OATS_FTP} at every TP tier. The card's 1.84 is the rounded form and is not used. Azure Lore does not change it. Vitality Down is −${WILD_OATS_VIT}, and it cannot drop the target under 0 VIT. Defense is read again from that VIT. It decays by 1 every ${WILD_OATS_TICK} seconds. The effect comment's "every 3 ticks" is not used. Nine steps empty a fresh −${WILD_OATS_VIT} in ${WILD_OATS_VIT * WILD_OATS_TICK} seconds, so a longer duration cap does not keep the last point up. The cap is still 180 seconds, 450 under Azure Lore, and the Chain Affinity walk 180 / 360 / 400. Those anchors are marked as needing verification. They are the only numbers printed. Casting it again starts the −${WILD_OATS_VIT} over. A miss does not lower VIT. There is no separate resist roll. A connecting hit opens Transfixion. A miss does not. The enmity box is blank. The cast claims, and the damage adds its own enmity. A connecting hit gives the hare 100 TP. It breaks Mazurka. Burst Affinity is not spent. A Mandragora teaches it at Blue Magic 0. No Mandragora is in the yard yet, so it is already learned. Setting it grants CHR +${WILD_OATS.chr} and HP +${WILD_OATS.hp} while Blue Mage is main. It is 4 trait points of Beast Killer and 3 set points. With Sprout Smack the trait is +8% damage dealt to beasts. This spell alone does not grant it. A support job gets neither the stats nor the trait. The motion is the blue-magic cast, then a fan of seeds travels to the target. A landed Vitality Down wilts.`;
    } else if (spell.blue != null && "physical" in spell.blue && spell.name === "Queasyshroom") {
      effect = `One piercing ranged hit at ${QUEASYSHROOM.range}'. Blue Magic skill sets the base, and it stops at ${QUEASYSHROOM.dCap}. At Blue Magic 276 that term is 63, so the cap binds. fSTR is floor((your STR − the target's VIT + 4) / 4), and it stops at 22. The stat term is 20% of INT. The weapon-skill coefficient is ${QUEASYSHROOM.ftp} at every TP tier, including Azure Lore. It is a ranged attack. This yard has no Blue Mage ranged skill, so the hit uses melee accuracy and melee attack. A ranged attack of 0 would miss. Sneak Attack and Trick Attack are not in the kit. Poison is ${QUEASY_POISON} HP every 3 seconds. The duration is ${QUEASY_SECONDS} seconds unless Chain Affinity is spent, which walks 90 at 0 TP, 150 at 1500, and 180 at 3000. Azure Lore uses 210. The script marks those anchors as needing verification. They are the only numbers printed. Without either buff the duration stays ${QUEASY_SECONDS}, even though the card says it varies with TP. The additional effect is a magic resist roll. A piercing type is not an element, so the roll uses none. A full resist does not poison. A half resist shortens the duration, and the potency stays ${QUEASY_POISON}. A miss does not poison. A stronger poison is left alone. An equal poison is refreshed. The page removes every shadow, hit or miss. The Tropical Rarab has none, so that wipe does nothing. A connecting hit opens Compression. A miss does not. Chain Affinity doubles the stat term, forces the critical hit, and spends all TP. It does not walk the coefficient. The enmity box is blank. The cast claims, and the damage adds its own enmity. A connecting hit gives the hare 100 TP. It breaks Mazurka. Burst Affinity is not spent. A Funguar teaches it at Blue Magic 0. No Funguar is in the yard yet, so it is already learned. Setting it grants HP −5 and MP +${QUEASYSHROOM.setMp} while Blue Mage is main. The script says Combos: None, so it grants no trait. A support job gets neither the stats nor a trait. The motion is the blue-magic cast, then a purple-green spore cloud travels to the target. A landed poison leaves bubbles.`;
    } else if (spell.blue != null && "physical" in spell.blue && spell.name === "Head Butt") {
      effect = `One blunt hit at ${HEAD_BUTT.range}'. The client range is shorter. The card prints ${HEAD_BUTT.range}', so that is the range. Blue Magic skill sets the base, and it stops at ${HEAD_BUTT.dCap}. At Blue Magic 276 that term is 63, so the cap binds. fSTR is floor((your STR − the target's VIT + 4) / 4), and it stops at 22. The stat term is 20% of STR and 20% of INT. The weapon-skill coefficient stays ${HEAD_BUTT_FTP[0]} until Chain Affinity or Azure Lore is up, even though the card says damage varies with TP. Chain Affinity walks ${HEAD_BUTT_FTP[0]} at 0 TP, ${HEAD_BUTT_FTP[1]} at 1500, and ${HEAD_BUTT_FTP[2]} at 3000. Azure Lore sets it to ${HEAD_BUTT_FTP_AZURE}. It does not itself double the stat term or force a critical hit, and it is not consumed. The script walks whenever TP is above 0. That is not used. Attack is ×${HEAD_BUTT_MULT} at every tier. Chain Affinity does not raise it. It doubles the stat term, forces the critical hit, spends all TP, and a connecting hit opens Impaction. Stun lasts a whole second from 1 through 5. The script's random 2–8 is longer than the card and is not used. It is a second roll. The element is lightning, because a monster that resists lightning or stun resists the effect. Magic accuracy is Blue Magic skill plus dINT. A full resist does not stun. A half resist shortens it. A miss does not stun. It replaces a Stun already up. Knockback does not move the hare. A connecting hit interrupts a spell the hare has started and not finished. If the stun also lands, that interrupt is not logged twice. The enmity box is blank. The cast claims, and the damage adds its own enmity. A connecting hit gives the hare 100 TP. It breaks Mazurka. Burst Affinity is not spent. A Quadav teaches it at Blue Magic 8. No Quadav is in the yard yet, so it is already learned. Setting it grants DEX +${HEAD_BUTT.dex} while Blue Mage is main. The script says Combos: None, so it grants no trait. A support job gets neither the DEX nor a trait. The motion is the blue-magic cast, then a quadav iron helm slams the target. A landed stun draws the thunder cross. The knockback is debris only.`;
    } else if (spell.blue != null && "physical" in spell.blue && spell.name === "Feather Storm") {
      effect = `One piercing ranged hit at ${FEATHER_STORM.range}'. Blue Magic skill sets the base, and it stops at ${FEATHER_STORM.dCap}. At Blue Magic 276 that term is 63, so the cap binds. fSTR is floor((your STR − the target's VIT + 4) / 4), and it stops at 22. The stat term is 30% of AGI. The weapon-skill coefficient is ${FEATHER_STORM.ftp} at every TP tier, including Azure Lore. It is a ranged attack. This yard has no Blue Mage ranged skill, so the hit uses melee accuracy and melee attack, the same choice as Queasyshroom. Poison is ${FEATHER_POISON} HP every 3 seconds. The card says the chance varies with TP and leaves the duration blank. The script stores a duration modifier, not an accuracy modifier, and the effect table has no chance term. A hit always attempts the poison. The only chance rolled is the magic resist, with no element. A full resist does not poison. A half resist shortens the duration, and the potency stays ${FEATHER_POISON}. A miss does not poison. A stronger poison is left alone. An equal poison is refreshed. The duration is 180 seconds, the Chain Affinity walk 180 / 360 / 400, and 450 under Azure Lore. Those anchors are the same unverified set Sprout Smack uses. Without either buff the duration stays 180. A connecting hit opens Transfixion. A miss does not. Chain Affinity doubles the stat term, forces the critical hit, and spends all TP. It does not walk the coefficient. The enmity box is blank. The cast claims, and the damage adds its own enmity. A connecting hit gives the hare 100 TP. It breaks Mazurka. Burst Affinity is not spent. A Yagudo teaches it at Blue Magic 8. No Yagudo is in the yard yet, so it is already learned. Setting it grants CHR +${FEATHER_STORM.chr} and HP +${FEATHER_STORM.hp} while Blue Mage is main. It is 4 trait points of Rapid Shot and 3 set points. The trait needs 8 trait points and 6 set points, and tier I is level 38, about 25%. Jet Stream is the other half. Setting both grants Rapid Shot. This spell alone does not. A Ranger's Rapid Shot, when it is higher, is kept. A support job gets neither the stats nor the trait. The motion is the blue-magic cast, then a fan of feathers travels to the target. A landed poison leaves motes.`;
    } else if (spell.blue != null && "physical" in spell.blue && spell.name === "Helldive") {
      effect = `One blunt hit at ${HELLDIVE.range}'. The page does not name the damage type. The script uses blunt, so this yard uses blunt. Blue Magic skill sets the base, and it stops at ${HELLDIVE.dCap}. At Blue Magic 276 that term is 63, so the cap binds. fSTR is floor((your STR − the target's VIT + 4) / 4), and it stops at 22. The stat term is 30% of AGI. The weapon-skill coefficient stays ${HELLDIVE_FTP[0]} until Chain Affinity or Azure Lore is up, even though the card says damage varies with TP. Chain Affinity walks ${HELLDIVE_FTP[0]} at 0 TP, ${HELLDIVE_FTP[1]} at 1500, and ${HELLDIVE_FTP[2]} at 3000. Azure Lore sets it to ${HELLDIVE_FTP_AZURE}. It does not itself double the stat term or force a critical hit, and it is not consumed. Attack is ×${HELLDIVE_MULT} at every tier. Chain Affinity does not raise it. It doubles the stat term, forces the critical hit, spends all TP, and a connecting hit opens Transfixion. No additional status. Knockback does not move the hare. A connecting hit interrupts a spell the hare has started and not finished. The enmity box is blank. The cast claims, and the damage adds its own enmity. A connecting hit gives the hare 100 TP. It breaks Mazurka. Burst Affinity is not spent. A Lesser Bird teaches it at Blue Magic 20. No Lesser Bird is in the yard yet, so it is already learned. Setting it grants CHR +${HELLDIVE.chr} and HP +${HELLDIVE.hp} while Blue Mage is main. The script says Combos: None, so it grants no trait. A support job gets neither the stats nor a trait. The motion is the blue-magic cast, then a bird silhouette dives onto the target. The knockback is debris only.`;
    } else if (spell.blue != null && "physical" in spell.blue && spell.name === "Bludgeon") {
      effect = `Three blunt hits at ${BLUDGEON.range}'. Blue Magic skill sets the base, and it stops at ${BLUDGEON.dCap}. At Blue Magic 276 that term is 63, so the cap binds. fSTR is floor((your STR − the target's VIT + 4) / 4), and it stops at 22. The stat term is 30% of CHR. Only the first hit uses the weapon-skill coefficient. The other two stay at 1. That coefficient is 1.0 at every tier, including Azure Lore. Attack is ×${BLUDGEON_MULT} at every tier. BG-Wiki's ~33% is not an exact number. The script prints ${BLUDGEON_MULT}, so that is the multiplier. Chain Affinity does not walk it. It doubles the stat term, forces the critical hit, spends all TP, and a connecting hit opens Liquefaction. Azure Lore does not change the coefficient or the attack, and it is not consumed. The card says accuracy varies with TP. The script's floor(TP / 50) and its Azure Lore bonus of 70 are marked as made up, so no accuracy is added. Each hit rolls accuracy on its own. No additional status. The enmity box is blank. The cast claims, and the damage adds its own enmity. Each connecting hit gives the hare 100 TP. It breaks Mazurka. Burst Affinity is not spent. A Cardian teaches it at Blue Magic ${BLUDGEON.learnSkill}. No Cardian is in the yard yet, so it is already learned. Setting it grants STR +${BLUDGEON.str} while Blue Mage is main. It is 4 trait points of Undead Killer and 2 set points. The trait needs 8 trait points and 5 set points. Smite of Rage is the other half. Setting both grants Undead Killer +8%. This spell alone does not grant it. The Tropical Rarab is not undead. A support job gets neither the STR nor the trait. The motion is the blue-magic cast, then three wooden clubs strike the target.`;
    } else if (spell.blue != null && "physical" in spell.blue && spell.name === "Claw Cyclone") {
      effect = `Two slashing hits in a fan in front of you, ${CLAW_CYCLONE.range}' long and ${BLUE_CONE}° each side of where you are facing. A target behind you is missed. Blue Magic skill sets the base, and it stops at ${CLAW_CYCLONE.dCap}. At Blue Magic 276 that term is 63, so the cap binds. fSTR is floor((your STR − the target's VIT + 4) / 4), and it stops at 22. The stat term is 30% of DEX. Only the first hit uses the weapon-skill coefficient. The second stays at 1. That coefficient is ${CLAW_FTP} at every tier, including Azure Lore. Damage varies with TP through the attack multiplier. Attack is ×${CLAW_ATTACK[0]} until Chain Affinity or Azure Lore is up. Chain Affinity walks ${CLAW_ATTACK[0]} at 0 TP, ${CLAW_ATTACK[1]} at 1500, and ${CLAW_ATTACK[2]} at 3000. Azure Lore sets it to ${CLAW_ATTACK_AZURE}. It does not itself double the stat term or force a critical hit. Chain Affinity doubles the stat term, forces the critical hit, spends all TP even if nobody is in the fan, and a connecting hit opens Scission. The enmity box is blank. The cast claims, and the damage adds its own enmity. Each connecting hit gives the hare 100 TP. It breaks Mazurka. Burst Affinity is not spent. A Tiger teaches it at Blue Magic ${CLAW_CYCLONE.learnSkill}. No Tiger is in the yard yet, so it is already learned. Setting it grants VIT +${CLAW_CYCLONE.vit} while Blue Mage is main. It is 4 trait points of Lizard Killer and 2 set points. With Foot Kick, also 4 and 2, the trait is +8% damage dealt to lizards. Neither spell grants it alone. The Tropical Rarab is not a lizard. A support job gets neither the VIT nor the trait. The motion is the blue-magic cast, then two pale claw arcs sweep the fan in front of you.`;
    } else if (spell.blue != null && "physical" in spell.blue && spell.name === "Screwdriver") {
      effect = `One piercing hit at ${SCREWDRIVER.range}'. Blue Magic skill sets the base, and it stops at ${SCREWDRIVER.dCap}. At Blue Magic 276 that term is 63, so the cap binds. fSTR is floor((your STR − the target's VIT + 4) / 4), and it stops at 22. The stat term is 20% of STR and 20% of MND. The weapon-skill coefficient is ${SCREWDRIVER_FTP} at every tier, including Azure Lore. Attack is ×${SCREWDRIVER_MULT} at every tier. Chain Affinity does not walk it. The script walks the critical-hit chance, 0 at 0 TP, 15 at 1500, and 30 at 3000, only while Chain Affinity is up. This yard's Chain Affinity forces the critical hit, so that walk is not used. Without Chain Affinity or Azure Lore the chance stays 0, even though the card says it varies with TP. Azure Lore sets the chance to ${Math.round(SCREWDRIVER_AZURE_CRIT * 100)}%. That is not a forced critical hit, and Azure Lore is not consumed. A connecting hit opens Transfixion, then Scission. The enmity box is blank. The cast claims, and the damage adds its own enmity. A connecting hit gives the hare 100 TP. It breaks Mazurka. Burst Affinity is not spent. A Pugil teaches it at Blue Magic ${SCREWDRIVER.learnSkill}. No Pugil is in the yard yet, so it is already learned. Setting it grants VIT +${SCREWDRIVER.vit}, CHR +${SCREWDRIVER.chr}, and HP +${SCREWDRIVER.hp} while Blue Mage is main. It is 4 trait points of Evasion Bonus and 3 set points. The trait needs 8 trait points and 6 set points. Hysteric Barrage is 4 trait points and 5 set points. Setting both grants Evasion Bonus +10. This spell alone does not grant it. A support job gets neither the stats nor the trait. The motion is the blue-magic cast, then a pale corkscrew thrust.`;
    } else if (spell.blue != null && "physical" in spell.blue && spell.name === "Grand Slam") {
      effect = `One blunt hit on enemies within ${GRAND_RADIUS}', centered on you, not on the target. The range box is blank. The note prints that 5'. Blue Magic skill sets the base, and it stops at ${GRAND_SLAM.dCap}. At Blue Magic 276 that term is 63, so the cap binds. fSTR is floor((your STR − the target's VIT + 4) / 4), and it stops at 22. The stat term is 30% of VIT. The weapon-skill coefficient is 1.0 at every tier, including Azure Lore. Damage varies with TP through the attack multiplier. Attack is ×${GRAND_ATTACK[0]} until Chain Affinity or Azure Lore is up. Chain Affinity walks ${GRAND_ATTACK[0]} at 0 TP, ${GRAND_ATTACK[1]} at 1500, and ${GRAND_ATTACK[2]} at 3000. Azure Lore sets it to ${GRAND_ATTACK_AZURE}. Chain Affinity doubles the stat term, forces the critical hit, spends all TP even if nobody is in the ring, and a connecting hit opens Induration. The script can remove 3 shadows. That line is marked as a guess. The hare has none, so it is not rolled. The enmity box is blank. A connecting cast claims, and the damage adds its own enmity. A connecting hit gives the hare 100 TP. It breaks Mazurka. Burst Affinity is not spent. A Gigas teaches it at Blue Magic ${GRAND_SLAM.learnSkill}. No Gigas is in the yard yet, so it is already learned. Setting it grants INT +${GRAND_SLAM.int} while Blue Mage is main. It is 4 trait points of Defense Bonus and 2 set points. The trait needs 8 trait points and 5 set points. Terror Touch is the other half. Setting both grants Defense Bonus +10. This spell alone does not. A support job gets neither the INT nor the trait. The motion is the blue-magic cast, then a shockwave opens on the ground around you.`;
    } else if (spell.blue != null && "physical" in spell.blue && spell.name === "Smite of Rage") {
      effect = `One slashing hit at ${SMITE_OF_RAGE.range}'. The client stores a range this yard would read as 3', and Horizon prints 3. The card prints ${SMITE_OF_RAGE.range}', so that is the range. Blue Magic skill sets the base, and it stops at ${SMITE_OF_RAGE.dCap}. At Blue Magic 276 that term is 63, so the cap binds. fSTR is floor((your STR − the target's VIT + 4) / 4), and it stops at 22. Horizon's note that this spell skips that cap is not used. The stat term is 20% of STR and 20% of DEX. The weapon-skill coefficient stays ${SMITE_FTP[0]} until Chain Affinity or Azure Lore is up, even though the card says damage varies with TP. Chain Affinity walks ${SMITE_FTP[0]} at 0 TP, ${SMITE_FTP[1]} at 1500, and ${SMITE_FTP[2]} at 3000. Azure Lore sets it to ${SMITE_FTP_AZURE}. Raw TP does not walk it. Azure Lore does not force a critical hit and is not consumed. Attack is ×${SMITE_MULT} at every tier. Chain Affinity does not walk the attack. It doubles the stat term, forces the critical hit, spends all TP, and a connecting hit opens Detonation. No additional status. The enmity box is blank. The cast claims, and the damage adds its own enmity. A connecting hit gives the hare 100 TP. It breaks Mazurka. Burst Affinity is not spent. An Evil Weapon teaches it at Blue Magic ${SMITE_OF_RAGE.learnSkill}. No Evil Weapon is in the yard yet, so it is already learned. Setting it grants AGI +${SMITE_OF_RAGE.agi} while Blue Mage is main. It is 4 trait points of Undead Killer and 3 set points. With Bludgeon, 4 trait points and 2 set points, the trait is +8% damage dealt to undead. Neither spell grants it alone. The Tropical Rarab is not undead. A support job gets neither the AGI nor the trait. The motion is the blue-magic cast, then one heavy red-gold slash on the target.`;
    } else if (spell.blue != null && "physical" in spell.blue && spell.name === "Pinecone Bomb") {
      effect = `One piercing ranged hit at ${PINECONE_RANGE}'. Gamer Escape and Horizon print 23.5'. The client stores 200, which this yard would read as 20'. The card prints ${PINECONE_RANGE}', so that is the range. The script header, the spell list, and Gamer Escape recast in ${PINECONE_BOMB.recast} seconds. The card's 26 is not used. Blue Magic skill sets the base, and it stops at ${PINECONE_BOMB.dCap}. At Blue Magic 276 that term is 63, so the cap binds. fSTR is floor((your STR − the target's VIT + 4) / 4), and it stops at 22. The stat term is 20% of STR and 20% of AGI. The weapon-skill coefficient is ${PINECONE_BOMB.ftp} at every tier, including Azure Lore. Attack stays ×1. It is a ranged attack. This yard has no Blue Mage ranged skill, so the hit uses melee accuracy and melee attack. Sleep is attempted only when a hit lands. The script's base is ${PINECONE_SECONDS} seconds, not the card's 10–60. Chain Affinity walks ${PINECONE_SECONDS} at 0 TP, 150 at 1500, and 210 at 3000. Azure Lore uses ${PINECONE_AZURE}. The script marks those 3000 and Azure anchors as needing verification. Without either buff the duration stays ${PINECONE_SECONDS}. A piercing type is not an element, so the resist roll uses none. The page calls the sleep dark. A quarter resist does not sleep. A half resist halves the duration. Damage lands first and wakes Sleep, Sleep II, Sheep Song, Soporific, and Lullaby. The new Sleep is applied after that, so it can overwrite any of them. A connecting hit interrupts a spell the hare has started. It does not knock the hare back. A miss does not sleep and does not interrupt. Chain Affinity doubles the stat term, forces the critical hit, spends all TP, and a connecting hit opens Liquefaction. The enmity box is blank. The cast claims, and the damage adds its own enmity. A connecting hit gives the hare 100 TP. It breaks Mazurka. Burst Affinity is not spent. A Treant teaches it at Blue Magic ${PINECONE_BOMB.learnSkill}. No Treant is in the yard yet, so it is already learned. Setting it grants STR +${PINECONE_BOMB.str} while Blue Mage is main. The script says Combos: None. A support job gets the STR only while Blue Mage is main. The motion is the blue-magic cast, then a pinecone lobs onto the target. A landed sleep uses the same Sleep Zs as Sleep.`;
    } else if (spell.blue != null && "physical" in spell.blue && spell.name === "Jet Stream") {
      effect = `Three blunt hits at ${JET_STREAM.range}'. Blue Magic skill sets the base, and it stops at ${JET_STREAM.dCap}. At Blue Magic 276 that term is 63, so the cap binds. fSTR is floor((your STR − the target's VIT + 4) / 4), and it stops at 22. The stat term is 30% of AGI. The weapon-skill coefficient is ${JET_STREAM.ftp} on the first hit and 1 on the other two, at every tier, including Azure Lore. Attack is ×${JET_MULT} at every tier. Chain Affinity does not walk it. It doubles the stat term, forces the critical hit, spends all TP, and a connecting hit opens Impaction. The script's accuracy bonus is marked as made up, so none is added. No additional status. The enmity box is blank. The cast claims, and the damage adds its own enmity. A connecting hit gives the hare 100 TP. It breaks Mazurka. Burst Affinity is not spent. A Flock Bat teaches it at Blue Magic ${JET_STREAM.learnSkill}. No Flock Bat is in the yard yet, so it is already learned. Setting it grants DEX +${JET_STREAM.dex} while Blue Mage is main. It is 4 trait points of Rapid Shot and 4 set points. With Feather Storm, Rapid Shot is about 25%. Neither spell grants it alone. A support job gets neither the DEX nor the trait. The motion is the blue-magic cast, then three wind cuts land on the target.`;
    } else if (spell.blue != null && "physical" in spell.blue && spell.name === "Terror Touch") {
      effect = `One blunt hit at ${TERROR_TOUCH.range}'. Additional effect: Attack Down. Blue Magic skill sets the base, and it stops at ${TERROR_TOUCH.dCap}. At Blue Magic 276 that term is 63, so the cap binds. fSTR is floor((your STR − the target's VIT + 4) / 4), and it stops at 22. The stat term is 20% of DEX and 20% of INT. The weapon-skill coefficient is ${TERROR_TOUCH.ftp} at every tier, including Azure Lore. Attack is ×${TERROR_MULT} at every tier. Chain Affinity does not walk it. It doubles the stat term, forces the critical hit, spends all TP, and a connecting hit opens Compression, then Reverberation. The script's accuracy bonus is marked as made up, so none is added. Attack Down is ${TERROR_ATTACK_NUMER}/256 for ${TERROR_ATTACK_SECONDS} seconds. That is the page's 15%. A hit always attempts it. The resist has no element. A full resist does not lower attack. A half resist shortens the duration, and the ${TERROR_ATTACK_NUMER}/256 stays. A miss does not. It replaces Attack Down already on the hare. The hare's swings use that cut. The enmity box is blank. The cast claims, and the damage adds its own enmity. A connecting hit gives the hare 100 TP. It breaks Mazurka. Burst Affinity is not spent. A Ghost teaches it at Blue Magic ${TERROR_TOUCH.learnSkill}. No Ghost is in the yard yet, so it is already learned. Setting it grants HP −5 and MP +${TERROR_TOUCH.setMp} while Blue Mage is main. It is 4 trait points of Defense Bonus and 3 set points. With Grand Slam, Defense Bonus is +10. Neither spell grants it alone. A support job gets neither the stats nor the trait. The motion is the blue-magic cast, then a pale hand crosses the target. A landed Attack Down sinks red marks.`;
    } else if (spell.blue != null && "gaze" in spell.blue) {
      effect = `Light gaze dispel at ${BLANK_GAZE.range}'. It removes one beneficial magic effect. It does not deal damage. The ${HARE.name} must be facing you. You do not need to face it. The script also requires you to face the target. That extra check is not used. The resist is light. Magic accuracy is Blue Magic skill plus dINT. A full resist does not dispel. The hare has no beneficial effect, so a connecting gaze still has nothing to remove. Cumulative enmity ${BLANK_GAZE.ce}, volatile ${BLANK_GAZE.ve}. That enmity is added, and the target is claimed, when the gaze connects, including a resist. A target that is not facing you, out of range, dead, or charmed adds none. It breaks Mazurka. Chain Affinity and Burst Affinity are not spent. An Opo-opo teaches it at Blue Magic ${BLANK_GAZE.learnSkill}. No Opo-opo is in the yard yet, so it is already learned. Magic Fruit is the other Opo-opo spell. It grants no stat. The script says Combos: None, so it grants no trait. A support job gets neither. The motion is the blue-magic cast, then a pale eye opens on you and a light beam looks at the target. There is no erase sparkle, because nothing was removed.`;
    } else if (spell.blue != null && "mystery" in spell.blue) {
      const raw = mysteriousLightRaw({ level: LEVEL, chr: sheet.chr, targetChr: HARE.chr, burstAffinity: false });
      const burst = mysteriousLightRaw({ level: LEVEL, chr: sheet.chr, targetChr: HARE.chr, burstAffinity: true });
      const hit = applyMab(Math.floor(raw), sheet.mab, 0);
      effect = `Wind damage to enemies within ${MYSTERIOUS_LIGHT.radius}', centered on you. Additional effect: Weight. The base is your level + 2, and it stops at ${MYSTERIOUS_LIGHT.dCap}. At 75 that term is ${MYSTERIOUS_LIGHT.dCap}. The stat term is 30% of CHR times the level alpha. At 75 that alpha is 0.83. Your CHR is ${sheet.chr}. The hare's CHR is ${HARE.chr}. dCHR is multiplied by 1. Anything above ${MYSTERIOUS_LIGHT.half} counts for half, and the term cannot fall under ${MYSTERIOUS_LIGHT.low}. The coefficient is ${MYSTERIOUS_LIGHT.ftp}, which is 248/256. The script's 2.0 is the rewritten magical coefficient and is not used. Azure Lore does not add to it and does not open a magic burst. Burst Affinity doubles the stat term and is spent, even on a miss or when nobody is in the area. Wind matches Detonation, Fragmentation, Light, and Radiance. Two weapon skills multiply the hit by 1.35. Each further weapon skill adds 0.10. Day, weather, staff, affinity, SDT, Ebullience, and ecosystem correlation are not applied. Magic Attack Bonus is applied after the resist floor. On this sheet, before a resist and without Burst Affinity, the hit is ${hit}. Before that floor the raw hit is ${raw}, and with Burst Affinity it is ${burst}. A resist can cut it to 1/2, 1/4, or 1/8. 1/8 is not zero. Weight is the Gravity status already in this yard. The cut is ${MYSTERIOUS_LIGHT.weight}%. The script's 25 is not used. The card prints 30–120 seconds. The unresisted duration is ${MYSTERIOUS_LIGHT.seconds}. A half resist shortens it, and the ${MYSTERIOUS_LIGHT.weight}% stays. Damage of 0 skips it. It refreshes Gravity. The enmity box is blank. A hare inside the area is claimed. No fixed hate is added. It breaks Mazurka. A Magic Pot teaches it at Blue Magic ${MYSTERIOUS_LIGHT.learnSkill}. No Magic Pot is in the yard yet, so it is already learned. Setting it grants AGI +${MYSTERIOUS_LIGHT.agi} while Blue Mage is main. It is 4 trait points of Max MP Boost and 4 set points. With Metallic Body, also 4 trait points and 1 set point, Max MP Boost is +10 MP at level 40. Neither spell grants it alone. Summoner's Max MP Boost is a different trait. A support job gets neither the AGI nor the trait. The motion is the blue-magic cast, then a pale wind ring and mint motes open around you. A landed Weight uses the Gravity rings.`;
    } else if (spell.blue != null && "venom" in spell.blue) {
      effect = `Water poison on enemies within ${VENOM_SHELL.radius}', centered on you. It does not deal damage. Poison is ${VENOM_SHELL.poison} HP every 3 seconds for ${VENOM_SHELL.seconds} seconds. The script's 60 is not used. The card prints ${VENOM_SHELL.seconds}. A full resist does not poison. A half resist shortens the ${VENOM_SHELL.seconds} seconds, and the ${VENOM_SHELL.poison} stays. Magic accuracy is Blue Magic skill plus dMND. The element is water. There is no damage, so Burst Affinity is not spent and a skillchain is not burst. A stronger poison is left alone. An equal poison is refreshed. Cumulative enmity ${VENOM_SHELL.ce}, volatile ${VENOM_SHELL.ve}. That enmity is added, and the target is claimed, when the Tropical Rarab is inside the area, including a resist. A target outside the area, dead, or charmed adds none. It breaks Mazurka. Chain Affinity is not spent. An Uragnite teaches it at Blue Magic ${VENOM_SHELL.learnSkill}. No Uragnite is in the yard yet, so it is already learned. Setting it grants MND +${VENOM_SHELL.mnd} while Blue Mage is main. It is 4 trait points of Clear Mind and 3 set points. With Mind Blast, Poison Breath, or Soporific, Clear Mind is +3 while resting. This spell alone does not grant it. A support job gets neither the MND nor the trait. The motion is the blue-magic cast, then purple and green bubbles open around you. A landed poison drips on the target.`;
    } else if (spell.blue != null && "physical" in spell.blue && spell.name === "Mandibular Bite") {
      effect = `One slashing hit at ${MANDIBULAR_BITE.range}'. The range box is blank. The client stores 30. This yard reads that as ${MANDIBULAR_BITE.range}', the same way Digest does. Blue Magic skill sets the base, and it stops at ${MANDIBULAR_BITE.dCap}. At Blue Magic 276 that term is 63, so the cap binds. fSTR is floor((your STR − the target's VIT + 4) / 4), and it stops at 22. The stat term is 20% of STR and 20% of INT. The weapon-skill coefficient stays ${MANDIBULAR_BITE.ftp} at every tier, including Chain Affinity and Azure Lore. The card's TP clause is the attack, not the coefficient. Attack is ×${BITE_ATTACK[0]} until Chain Affinity or Azure Lore is up. Chain Affinity walks ${BITE_ATTACK[0]} at 0 TP, ${BITE_ATTACK[1]} at 1500, and ${BITE_ATTACK[2]} at 3000. Azure Lore sets it to ${BITE_ATTACK_AZURE} and wins over Chain Affinity. Raw TP does not walk the attack. Azure Lore does not force a critical hit. The script sets no crit chance. Chain Affinity doubles the stat term, forces the critical hit, spends all TP, and a connecting hit opens Induration. A miss does not skillchain. No additional status. The enmity box is blank. The cast claims, and the damage adds its own enmity. A connecting hit gives the hare 100 TP. It breaks Mazurka. Burst Affinity is not spent. An Antlion teaches it at Blue Magic ${MANDIBULAR_BITE.learnSkill}. No Antlion is in the yard yet, so it is already learned. Setting it grants INT +${MANDIBULAR_BITE.int} while Blue Mage is main. It is 4 trait points of Plantoid Killer and 2 set points. With Power Attack, also 4 trait points and 1 set point, Plantoid Killer is +8% damage dealt to plantoids. Neither spell grants it alone. Spiral Spin is 4 trait points and 3 set points, so setting it with this spell also grants Plantoid Killer. The Tropical Rarab is not a plantoid, so the bonus is not rolled. A support job gets neither the INT nor the trait. The motion is the blue-magic cast, then two sand jaws close on the target.`;
    } else if (spell.blue != null && "physical" in spell.blue && spell.name === "Death Scissors") {
      effect = `One slashing hit at ${DEATH_SCISSORS.range}'. The range box is blank. This yard uses ${DEATH_SCISSORS.range}', the same reach as Mandibular Bite. Blue Magic skill sets the base, and it stops at ${DEATH_SCISSORS.dCap}. At Blue Magic 276 that term is 63, so the cap does not bind. fSTR is floor((your STR − the target's VIT + 4) / 4), and it stops at 22. The stat term is 60% of STR. The weapon-skill coefficient stays ${DEATH_FTP[0]} until Chain Affinity or Azure Lore is up, even though the card says damage varies with TP. Chain Affinity walks ${DEATH_FTP[0]} at 0 TP, ${DEATH_FTP[1]} at 1500, and ${DEATH_FTP[2]} at 3000. It doubles the stat term, forces the critical hit, and spends all TP, including when the hit misses. Azure Lore uses the 3500 anchor, ${DEATH_FTP_AZURE}, which is 844/256. The script's 3.3 is the rounded form and is not used. Azure Lore wins over Chain Affinity. It does not itself double the stat term or force a critical hit, and it is not consumed. Raw TP does not walk the coefficient. Attack stays ×${DEATH_ATTACK}. It does not walk with TP. A connecting hit opens Compression, and then Reverberation. A miss does not skillchain. No additional status. The enmity box is blank. The cast claims, and the damage adds its own enmity. A connecting hit gives the hare 100 TP. It breaks Mazurka. Burst Affinity is not spent. A Scorpion teaches it at Blue Magic ${DEATH_SCISSORS.learnSkill}. No Scorpion is in the yard yet, so it is already learned. Setting it grants MND +${DEATH_SCISSORS.mnd}, CHR +${DEATH_SCISSORS.chr}, and HP +${DEATH_SCISSORS.hp} while Blue Mage is main. It is ${DEATH_SCISSORS.attackTrait} trait points of Attack Bonus and ${DEATH_SCISSORS.points} set points. With Uppercut, or with Battle Dance, Attack Bonus is +10. This spell alone does not grant it. It does not stack with Warrior, Dark Knight, or Dragoon. The higher value is kept. A support job gets neither the stats nor the trait. The motion is the blue-magic cast, then two dark blades close on the target.`;
    } else if (spell.blue != null && "physical" in spell.blue && spell.name === "Dimensional Death") {
      effect = `One blunt hit at ${DIMENSIONAL_DEATH.range}'. Hand-to-hand, not a slash. The range box is blank. The client stores 30, so this yard uses ${DIMENSIONAL_DEATH.range}'. Blue Magic skill sets the base, and it is not capped. At Blue Magic 276 that term is 63. fSTR is floor((your STR − the target's VIT + 4) / 4), and it stops at 22. The stat term is 50% of STR. The weapon-skill coefficient stays ${DIMENSION_FTP} at every tier, including Chain Affinity and Azure Lore. The card's TP clause is the attack, not the coefficient. Attack is ×${DIMENSION_ATTACK[0]} until Chain Affinity or Azure Lore is up. Chain Affinity walks ${DIMENSION_ATTACK[0]} at 0 TP, ${DIMENSION_ATTACK[1]} at 1500, and ${DIMENSION_ATTACK[2]} at 3000. It doubles the stat term, forces the critical hit, and spends all TP, including when the hit misses. Azure Lore sets the attack to 2.3 and wins over Chain Affinity. It does not itself double the stat term or force a critical hit, and it is not consumed. Raw TP does not walk the attack. A connecting hit opens Transfixion, and then Impaction. The card prints Impaction only. The script stores both, and this yard uses both. A miss does not skillchain. No additional status. The enmity box is blank. The cast claims, and the damage adds its own enmity. A connecting hit gives the hare 100 TP. It breaks Mazurka. Burst Affinity is not spent. A Fomor teaches it at Blue Magic ${DIMENSIONAL_DEATH.learnSkill}. A Shadow stands in for that family. No Shadow is in the yard yet, so it is already learned. Setting it grants DEX +${DIMENSIONAL_DEATH.dex}, CHR +${DIMENSIONAL_DEATH.chr}, and HP +${DIMENSIONAL_DEATH.hp} while Blue Mage is main. It is 4 trait points of Accuracy Bonus and 5 set points. With Frenetic Rip, or with Disseverment, Accuracy Bonus is +10. This spell alone does not grant it. A support job gets neither the stats nor the trait. The motion is the blue-magic cast, then a dark rift opens on the target and collapses. It is a blunt hit, not a blade.`;
    } else if (spell.blue != null && "physical" in spell.blue && spell.name === "Spiral Spin") {
      effect = `One slashing hit at ${SPIRAL_SPIN.range}'. The client stores 120, which this yard would read as 12'. The card prints ${SPIRAL_SPIN.range}', so that is the range. When a ladybug uses it, the attack is a thin cone. When a Blue Mage casts it, it is one target. Blue Magic skill sets the base, and it is not capped. The stat term is 30% of AGI. The weapon-skill coefficient stays ${SPIRAL_SPIN.ftp} at every tier, including Azure Lore. Attack stays ×1. Chain Affinity doubles the stat term, forces the critical hit, spends all TP, and a connecting hit opens Transfixion. Accuracy Down is −${SPIRAL_ACC}. The card prints 45–60 seconds. The script stores ${SPIRAL_SECONDS}. tpMod.DURATION is set and unused, so the duration does not walk with TP, and the chance does not either. A hit always attempts it. The only miss is the magic resist, with no element. A full resist does not lower accuracy. A half resist shortens the ${SPIRAL_SECONDS} seconds, and the −${SPIRAL_ACC} stays. A miss does not. It ignores shadows. The hare has none, so that clause is not rolled. A stronger Accuracy Down is left alone. An equal one is refreshed. The enmity box is blank. The cast claims, and the damage adds its own enmity. It breaks Mazurka. Burst Affinity is not spent. Ladybugs ready it only in the daytime. Once it is known, the yard does not gate the cast on the clock. A Ladybug teaches it at Blue Magic ${SPIRAL_SPIN.learnSkill}. No Ladybug is in the yard yet, so it is already learned. Setting it grants STR +${SPIRAL_SPIN.str} and HP +${SPIRAL_SPIN.hp} while Blue Mage is main. It is 4 trait points of Plantoid Killer and 3 set points. With Power Attack, or with Mandibular Bite, Plantoid Killer is +8% damage dealt to plantoids. This spell alone does not grant it. The Tropical Rarab is not a plantoid, so the bonus is not rolled. A support job gets neither the stats nor the trait. The motion is the blue-magic cast, then a green drill flies to the target and wraps it. A landed Accuracy Down leaves grit.`;
    } else if (spell.blue != null && "physical" in spell.blue && spell.name === "Seedspray") {
      effect = `Three slashing hits at ${SEEDSPRAY.range}'. The client stores 100, which this yard would read as 10'. The card prints about ${SEEDSPRAY.range}', so that is the range. The client recast of 36 seconds is not used. The card prints ${SEEDSPRAY.recast}. Blue Magic skill sets the base, and it is not capped. The stat term is 30% of DEX. The weapon-skill coefficient is ${SEED_FTP} on the first hit and 1 on the other two, at every tier, including Azure Lore. Attack stays ×1. Chain Affinity doubles the stat term, forces the critical hit, spends all TP, and a connecting hit opens Induration, and then Detonation. Defense Down is 20/256, about 8%. The script's power 8 is that percent. The hit is figured first, with the defense the target already had. Dia and a Defense Down already up still multiply that hit. The new 20/256 starts afterward, so it does not change the damage just rolled. The card prints 90–120 seconds. The script stores 120. tpMod.DURATION is unused, so the duration does not walk, and the chance does not either. A hit always attempts it. The only miss is the magic resist, with no element. A full resist does not lower defense. A half resist shortens the 120 seconds, and the 20/256 stays. Defense Down effects do not stack. A stronger one is left alone. Dia is a different status and still multiplies. An equal one is refreshed. The enmity box is blank. The client row's 1 and 640 are not on the card, so they are not added. The cast claims, and the damage adds its own enmity. It breaks Mazurka. Burst Affinity is not spent. A Rafflesia teaches it at Blue Magic ${SEEDSPRAY.learnSkill}. No Rafflesia is in the yard yet, so it is already learned. Setting it grants VIT +${SEEDSPRAY.vit} while Blue Mage is main. It is 4 trait points of Beast Killer and 2 set points. With Wild Oats, also 4 trait points and 3 set points, Beast Killer is +8% damage dealt to beasts. With Sprout Smack the set points are 4, short of 5, so that pair does not grant it. This spell alone does not. The Tropical Rarab is a beast, so the bonus is rolled when the trait is up. A support job gets neither the VIT nor the trait. The motion is the blue-magic cast, then three seeds spit onto the target. A landed Defense Down cracks the hide.`;
    } else if (spell.blue != null && "mael" in spell.blue) {
      const raw = maelRaw({ level: LEVEL, int: sheet.int, mnd: sheet.mnd, targetInt: HARE.int, burstAffinity: false });
      const hit = applyMab(Math.floor(raw), sheet.mab, 0);
      effect = `Water damage to enemies within ${MAELSTROM.radius}', centered on you. The range box is blank. The client stores radius 50, so this yard uses ${MAELSTROM.radius}', checked when the spell lands. The base is your level + 2, and it stops at ${MAELSTROM.dCap}. At 75 that term is ${MAELSTROM.dCap}. The stat term is 30% of INT and 10% of MND, times the level alpha, not floored per stat. At 75 that alpha is 0.83. Your INT is ${sheet.int} and your MND is ${sheet.mnd}. The hare's INT is ${HARE.int}. dINT is multiplied by ${MAELSTROM.dStat}. The script sets no half cap and no floor, so anything above ${MAELSTROM.half} counts for half, and the term cannot fall under ${MAELSTROM.low}. The coefficient is ${MAELSTROM.ftp}. Azure Lore does not add to it and does not open a magic burst. Burst Affinity doubles the stat term and is spent, even on a miss or when nobody is in the area. It does not change ${MAELSTROM.ftp}. Water matches Reverberation, Distortion, Darkness, and Umbra. Two weapon skills multiply the hit by 1.35. Each further weapon skill adds 0.10. Day, weather, staff, affinity, SDT, Ebullience, Convergence, and ecosystem correlation are not applied. Magic Attack Bonus is applied after the resist floor. On this sheet, before a resist and without Burst Affinity, the hit is ${hit}. A resist can cut it to 1/2, 1/4, or 1/8. 1/8 is not zero. STR Down is −${MAEL_STR} for ${MAELSTROM.seconds} seconds. It does not tick. It lands only when the hit deals damage. A full resist, or a hit of 0, does not lower STR. A half resist shortens the ${MAELSTROM.seconds} seconds, and the −${MAEL_STR} stays. A stronger STR Down is left alone. It replaces a weaker or equal one. It does not stack. The enmity box is blank, and the client row is 0 and 0. A hare inside the area is claimed. No fixed hate is added. It breaks Mazurka. Chain Affinity is not spent. A Sea Monk teaches it at Blue Magic ${MAELSTROM.learnSkill}. No Sea Monk is in the yard yet, so it is already learned. Setting it grants MND +${MAELSTROM.mnd} while Blue Mage is main. It is 4 trait points of Clear Mind and 5 set points. With Poison Breath, Clear Mind is +3 while resting. This spell alone does not grant it. A support job gets neither the MND nor the trait. The motion is the blue-magic cast, then a water whirlpool rises around you. A landed STR Down marks the hare.`;
    } else if (spell.blue != null && "eyes" in spell.blue) {
      const raw = eyesRaw({ level: LEVEL, chr: sheet.chr, targetChr: HARE.chr, burstAffinity: false, azureLore: false });
      const hit = applyMab(Math.floor(raw), sheet.mab, 0);
      effect = `One dark hit at ${EYES_ON_ME.range}'. The client stores 120, which this yard would read as 12'. The card prints about ${EYES_ON_ME.range}', so that is the range. The base is your level + 2, and it stops at ${EYES_ON_ME.dCap}. The stat term is 40% of CHR times the level alpha. At 75 that alpha is 0.83. Your CHR is ${sheet.chr}. The hare's CHR is ${HARE.chr}. dCHR is multiplied by ${EYES_ON_ME.dStat}. The script sets no half cap and no floor, so anything above ${EYES_ON_ME.half} counts for half, and the term cannot fall under ${EYES_ON_ME.low}. The coefficient is ${EYES_ON_ME.ftp}. Burst Affinity doubles the stat term and is spent, even on a miss or when the target is out of range. It does not change ${EYES_ON_ME.ftp}. Azure Lore adds ${EYES_AZURE} to the coefficient. It does not double the stat term, it does not open a magic burst, and it is not consumed. Dark matches Compression, Gravitation, Darkness, and Umbra. Two weapon skills multiply the hit by 1.35. Each further weapon skill adds 0.10. Day, weather, staff, affinity, SDT, Ebullience, Convergence, and ecosystem correlation are not applied. Positive correlation against dragons is not rolled. The hare is not a dragon. Magic Attack Bonus is applied after the resist floor. On this sheet, before a resist and without Burst Affinity or Azure Lore, the hit is ${hit}. A resist can cut it to 1/2, 1/4, or 1/8. 1/8 is not zero. No additional status. It ignores shadows and can still be absorbed by Blink. The hare has neither, so neither is rolled. The enmity box is blank, and the client row is 0 and 0. The cast claims, and the damage adds its own enmity. It breaks Mazurka. Chain Affinity is not spent. An Ahriman teaches it at Blue Magic ${EYES_ON_ME.learnSkill}. No Ahriman is in the yard yet, so it is already learned. Setting it grants HP −5 and MP +${EYES_ON_ME.setMp} while Blue Mage is main. It is 4 trait points of Magic Attack Bonus and 4 set points. With Cursed Sphere, or with Sound Blast, or with Memento Mori, the trait is +20. This spell alone does not grant it. A support job gets neither the stats nor the trait. The motion is the blue-magic cast, then an Ahriman eye opens in front of you and fires one dark beam.`;
    } else if (spell.blue != null && "physical" in spell.blue && spell.name === "Hydro Shot") {
      effect = `One blunt hit at ${HYDRO_RANGE}'. The card's "Available Level 55" fights its own 186 learn skill. Skill 186 is level 63, so the level is ${HYDRO_SHOT.level}. The 55 is not used. The range box is blank. A sahagin's water pistol is a short jet, so this yard uses ${HYDRO_RANGE}', not the 12' stand-in a blank ray uses. The script header says Blunt. The params use hand-to-hand. This yard's pDIF stays the melee curve every physical blue uses. Blue Magic skill sets the base, and the 999 cap does not bind. fSTR is floor((your STR − the target's VIT + 4) / 4), and it stops at 22. The stat term is 30% of AGI. The weapon-skill coefficient stays ${HYDRO_FTP} at every tier, including Azure Lore. Attack stays ×${HYDRO_ATTACK}. It does not walk. Chain Affinity doubles the stat term, forces the critical hit, spends all TP, and a connecting hit opens Reverberation. Azure Lore does not change the coefficient or the attack, and it is not consumed. The additional effect is Enmity Down, and the card says the chance varies with TP. The script's comment says the amount is trivial and not worth implementing. The card calls the potency an unsolved mystery. No enmity down is rolled. The enmity box is blank. The cast claims, and the damage adds its own enmity. A connecting hit gives the hare 100 TP. It breaks Mazurka. Burst Affinity is not spent. A Sahagin teaches it at Blue Magic ${HYDRO_SHOT.learnSkill}. No Sahagin is in the yard yet, so it is already learned. Setting it grants MND +${HYDRO_SHOT.mnd} while Blue Mage is main. It is ${HYDRO_SHOT.rapidTrait} trait points of Rapid Shot and ${HYDRO_SHOT.points} set points. With Feather Storm, or with Jet Stream, Rapid Shot is about 25% at Blue Mage 38. This spell alone does not grant it. A support job gets neither the MND nor the trait. The motion is the blue-magic cast, then a short pale-blue water jet. It is not a pan.`;
    } else if (spell.blue != null && "tickle" in spell.blue) {
      effect = `Wind. It reduces one enemy's TP at ${FEATHER_TICKLE_RANGE}'. It does not deal damage. A full hit removes ${FEATHER_TICKLE_TP} TP. A half resist removes ${FEATHER_TICKLE_TP / 2}. The script multiplies ${FEATHER_TICKLE_TP} by the resist rate, and the resist threshold is 0.5, so a quarter resist and a full resist do not land. The card's random 0–${FEATHER_TICKLE_TP} with no correlation is not used. If the target has 0 TP, the result is no effect even when the resist would have hit. Only the TP the target actually had is removed. The script header's recast is 26. That looks copied from a physical spell. The card prints ${FEATHER_TICKLE.recast}, so this yard uses ${FEATHER_TICKLE.recast}. Magic accuracy is Blue Magic skill plus dINT. The element is wind. The script can tag a magic-burst message on Detonation, Fragmentation, or Light. There is no damage, so Burst Affinity is not spent. Cumulative enmity ${FEATHER_TICKLE_CE}, volatile ${FEATHER_TICKLE_VE}, when the cast connects, including a resist and a target that already has 0 TP. A target outside the range, dead, or charmed adds none. It breaks Mazurka. Chain Affinity is not spent. A Colibri teaches it at Blue Magic ${FEATHER_TICKLE.learnSkill}. No Colibri is in the yard yet, so it is already learned. Setting it grants AGI +${FEATHER_TICKLE.agi} while Blue Mage is main. It is ${FEATHER_TICKLE.clearTrait} trait points of Clear Mind and ${FEATHER_TICKLE.points} set points. With Poison Breath, Mind Blast, or Soporific, Clear Mind is +3 while resting. This spell alone does not grant it. A support job gets neither the AGI nor the trait. The motion is the blue-magic cast, then feathers brush the target. The TP cut is a floater. Nothing is left on the hare.`;
    } else if (spell.blue != null && "yawn" in spell.blue) {
      effect = `Light sleep in a ${YAWN_RADIUS}' circle around you. It is a gaze. You do not need to face the enemy. The enemy must be facing you. It is not a fan. It does not deal damage. An unresisted land lasts ${YAWN_SECONDS} seconds. The script stores ${YAWN_SECONDS}. The card's 70–90 is not a second random. A half resist shortens the ${YAWN_SECONDS}. A full resist, and a quarter resist, do not land. The script's resist threshold is 0.5. It lands as its own status, Yawn. It refreshes its own Yawn. It does not overwrite Sleep, Sleep II, Sleepga, Sleepga II, Repose, Lullaby, Sheep Song, or Soporific, and Sheep Song and Soporific do not overwrite it. Sleep, Sleep II, Sleepga, Sleepga II, Repose, and Lullaby do overwrite it. A direct hit or a heal wakes it. It interrupts an action in progress. Magic accuracy is Blue Magic skill plus dMND. The element is light. The script can tag a magic-burst message on Transfixion, Fusion, or Light. There is no damage, so Burst Affinity is not spent. Cumulative enmity ${YAWN_CE}, volatile ${YAWN_VE}, when the gaze connects, including a resist. A target that is not facing you, outside the circle, dead, or charmed adds none. It breaks Mazurka. Chain Affinity is not spent. An Apkallu teaches it at Blue Magic ${YAWN.learnSkill}. No Apkallu is in the yard yet, so it is already learned. Setting it grants CHR +${YAWN.chr} and HP +${YAWN.hp} while Blue Mage is main. It is ${YAWN.sleepTrait} trait points of Resist Sleep and ${YAWN.points} set points. With Pollen, or with Wild Carrot, or with Magic Fruit, Resist Sleep is 10%. This spell alone does not grant it. A support job gets neither the stats nor the trait. The motion is the blue-magic cast, then a sleepy gold ring opens around you. A landed Yawn keeps gold sleep marks while it is up.`;
    } else if (spell.blue != null && "trunk" in spell.blue) {
      effect = `Wind. It steals one beneficial effect at ${TRUNK_RANGE}'. The script header says level 72. Skill 191 is level 64, and the card says ${VORACIOUS_TRUNK.level}, so the level is ${VORACIOUS_TRUNK.level}. The script's 72 is not used. The card's recast is ${VORACIOUS_TRUNK.recast}. The script header and the encyclopedia say 56. This yard uses ${VORACIOUS_TRUNK.recast}. The range box is blank. A marid's trunk is a close grab, so this yard uses ${TRUNK_RANGE}', not the 12' stand-in a blank ray uses. It does not deal damage. Magic accuracy is Blue Magic skill plus dINT. The element is wind. The resist threshold is 0.5. A half resist still steals. A quarter resist and a full resist do not. One beneficial effect would be stolen with the time it had left. Stolen nothing is no effect, not a resist. The ${HARE.name} has no beneficial effect, so a connecting cast that is not resisted is no effect. The steal path is still the one that runs. There is no erase sparkle, because nothing was removed. The script can tag a magic burst on wind. There is no damage, so Burst Affinity is not spent. Cumulative enmity ${TRUNK_CE}, volatile ${TRUNK_VE}, when the cast connects, including a resist and a target with nothing to steal. A target outside the range, dead, or charmed adds none. It breaks Mazurka. Chain Affinity is not spent. A Marid teaches it at Blue Magic ${VORACIOUS_TRUNK.learnSkill}. No Marid is in the yard yet, so it is already learned. Setting it grants AGI +${VORACIOUS_TRUNK.agi} while Blue Mage is main. Auto Refresh is ${VORACIOUS_TRUNK.refreshTrait} trait points and ${VORACIOUS_TRUNK.points} set points. With Actinic Burst the trait points are 7, still short of 8. Actinic Burst with this spell and Stinking Gas, or with Cold Wave, meets 8 trait points. This spell alone does not grant it. A support job gets neither the AGI nor the trait. The motion is the blue-magic cast, then a trunk and a wind grab reach the target.`;
    } else if (spell.blue != null && "infra" in spell.blue) {
      effect = `Ice. Evasion −${INFRA_EVA} in a fan in front of you, ${INFRA_RANGE}' long and ${BLUE_CONE}° each side of where you are facing. The card leaves the range blank. Other blank fans in this yard are ${INFRA_RANGE}'. It is not a gaze. It does not deal damage. An unresisted land lasts ${INFRA_SECONDS} seconds. The potency does not tick. A half resist shortens the ${INFRA_SECONDS}, and the −${INFRA_EVA} stays. A full resist, and a quarter resist, do not land. The script's resist threshold is 0.5. It refreshes its own Evasion Down. It does not land over Lunar Cry or Feint, even when those cuts differ from ${INFRA_EVA}. Lunar Cry replaces this row when it lands. Feint is a Thief merit and is not learned here. It stacks with Distract, which is a separate power. Quickstep is not in this yard. Magic accuracy is Blue Magic skill plus dINT. The element is ice. The script can tag a magic-burst message on Induration, Distortion, or Darkness. There is no damage, so Burst Affinity is not spent. Cumulative enmity ${INFRA_CE}, volatile ${INFRA_VE}, when the hare is in the fan, including a resist and a refused overwrite. A target outside the fan, dead, or charmed adds none. It breaks Mazurka. Chain Affinity is not spent. No trait. A Lizard teaches it at Blue Magic ${INFRASONICS.learnSkill}. No Lizard is in the yard yet, so it is already learned. Setting it grants INT +${INFRASONICS.int} while Blue Mage is main. A support job gets neither the INT nor a cast of this spell. The motion is the blue-magic cast, then a low ice pulse fans out from you. A landed Evasion Down leaves ice grit, and the chevrons stay while it is up.`;
    } else if (spell.name === "Frost Breath") {
      const raw = frostBreathRaw(sheet.hp, LEVEL);
      effect = `Ice breath in a fan in front of you, ${FROST_RANGE}' long and ${BLUE_CONE}° each side of where you are facing. The card leaves the range blank. This yard uses the same 10' fan as Poison Breath. Damage is current HP / 3 + main level / 0.625. On this sheet, before a resist, that is ${Math.floor(raw)}. Magic Attack Bonus is not applied. Vermin would take 25% more and beasts 25% less. The Tropical Rarab is a beast, and that correlation is not rolled. Burst Affinity can magic burst it. Ice matches Induration, Distortion, Darkness, and Umbra. Azure Lore does not open the window and does not change the breath. Burst Affinity is spent even on a miss or when the target is outside the fan. Paralyze is a ${FROST_PARALYZE}% chance to cancel an auto-attack or TP move, for ${FROST_SECONDS} seconds, and only when the breath deals damage. The script's power 15 and 60 seconds are not used. A half resist shortens the ${FROST_SECONDS}. A quarter resist does not paralyze. A stronger Paralyze stays. The enmity box is blank. A hare in the fan is claimed. A connecting hit gives the hare 100 TP. It breaks Mazurka. Set bonus INT −2. Conserve MP is 4 trait points and 3 set points. Chaotic Eye or Zephyr Mantle, each 4 and 2, grants the trait with this spell. This spell alone does not. A Raptor teaches it at Blue Magic ${FROST_BREATH.learnSkill}. No Raptor is in the yard yet, so it is already learned. A support job gets neither the INT nor a cast of this spell. The motion is the blue-magic cast, then a pale ice fan. A landed Paralyze leaves crystals.`;
    } else if (spell.blue != null && "spray" in spell.blue) {
      effect = `Dark. Blind in a fan in front of you, ${SANDSPRAY_RANGE}' long and ${BLUE_CONE}° each side of where you are facing. The card's recast band of 60 to 120 is not used. The script stores ${SANDSPRAY.recast}. It does not deal damage. An unresisted land is accuracy −${SANDSPRAY_ACC} for ${SANDSPRAY_SECONDS} seconds. The card leaves the duration blank. A half resist shortens the ${SANDSPRAY_SECONDS}. A full resist, and a quarter resist, do not land. It refreshes its own Blind. It does not overwrite Blind, Blind II, or a breath Blind. A Blind whose source was not stored is treated as the spell. Those overwrite it. Kurayami is not in this yard. Magic accuracy is Blue Magic skill plus dINT. There is no damage, so Burst Affinity is not spent. Cumulative enmity ${SANDSPRAY_CE}, volatile ${SANDSPRAY_VE}, when the hare is in the fan, including a resist and a refused overwrite. A target outside the fan, dead, or charmed adds none. It breaks Mazurka. Chain Affinity is not spent. Set bonus VIT +1. Clear Mind is 4 trait points and 2 set points. With Poison Breath the trait is +3 while resting. This spell alone does not grant it. A Qiqirn teaches it at Blue Magic ${SANDSPRAY.learnSkill}. No Qiqirn is in the yard yet, so it is already learned. A support job gets neither the VIT nor a cast of this spell. The motion is the blue-magic cast, then brown sand fans out. A landed Blind draws the veil.`;
    } else if (spell.blue != null && "ooze" in spell.blue) {
      const raw = corrosiveOozeRaw({ level: LEVEL, int: sheet.int, targetInt: HARE.int, burstAffinity: false, azureLore: false });
      const hit = applyMab(Math.floor(raw), sheet.mab, 0);
      effect = `Water damage to one enemy at ${OOZE_RANGE}'. The card says an area. The script hits the one enemy the cast selected and sets no radius, so this yard uses that one target. The card's 4.5 second cast is not used. The script header stores ${CORROSIVE_OOZE.cast}. The base is level + 2, capped at ${CORROSIVE_OOZE.dCap}. The stat term is 20% of INT times the level alpha. Burst Affinity doubles that term and is spent, even on a miss or when the target is out of range. The coefficient is ${CORROSIVE_OOZE.ftp}, which is 556/256. The script's 2.125 is not used. Azure Lore adds ${CORROSIVE_OOZE.azureFtp} and does not open a magic burst. dINT is multiplied by 2. Anything above 999 counts for half, and the term cannot fall under −399. Water matches Reverberation, Distortion, Darkness, and Umbra. Magic Attack Bonus is the step after the resist floor. On this sheet, before a resist and without Burst Affinity or Azure Lore, the hit is ${hit}. Attack Down and Defense Down are each ${OOZE_DOWN}/256 for ${OOZE_SECONDS} seconds. They share one second resist, and only when the hit dealt damage. A half resist shortens the ${OOZE_SECONDS}. A quarter resist lands neither. A stronger Defense Down or Attack Down is left alone. Dia still multiplies. Cumulative enmity ${OOZE_CE}. Volatile enmity is blank, so none is added. A hare in range is claimed. A connecting hit gives the hare 100 TP. It breaks Mazurka. Set bonus HP −10 and MP +10. Clear Mind is 4 trait points and 4 set points. With Poison Breath, or with Sandspray, the trait is +3 while resting. This spell alone does not grant it. A Slug teaches it at Blue Magic ${CORROSIVE_OOZE.learnSkill}. No Slug is in the yard yet, so it is already learned. A support job gets neither the stats nor a cast of this spell. The motion is the blue-magic cast, then a green-brown slime glob hits the target. A landed Attack Down leaves red marks, and a landed Defense Down cracks the hide.`;
    } else if (spell.blue != null && "hide" in spell.blue) {
      const shell = diamondhidePower(500);
      effect = `Stoneskin for party members within ${HIDE_RADIUS}', centered on you. The card leaves the range blank. This yard uses the same party circle Healing Breeze uses. Power is floor((Blue Magic skill / 3) × 2). Skill is held from 0 through 500. At 500 that is ${shell}. Stoneskin+ gear is not applied. The duration is ${HIDE_SECONDS} seconds, the card's 15 minutes. The script's 300 seconds, and Diffusion, are not used. Diffusion is a locked merit. It refreshes its own shell and it replaces Metallic Body. It does not overwrite Stoneskin, whether that shell is the spell or Afflatus Solace. Those overwrite this shell. Metallic Body does not overwrite it. Gamer Escape calls the element earth. There is no damage, so the element is not rolled. Cumulative enmity ${HIDE_CE}, volatile ${HIDE_VE}. A spell on yourself does not claim. It does not break Mazurka. Chain Affinity and Burst Affinity are not spent. Set bonus VIT +1. The script says Combos: None, so it grants no trait. An armored Troll, one that fights as Warrior, Paladin, or Dark Knight, teaches it at Blue Magic ${DIAMONDHIDE.learnSkill}. No Troll is in the yard yet, so it is already learned. A support job gets neither the VIT nor a cast of this spell. The motion is the blue-magic cast, then a crystalline earth shell closes around you.`;
    } else if (spell.blue != null && "enerv" in spell.blue) {
      effect = `Dark. Defense Down and Magic Defense Down in a ${ENERV_RADIUS}' circle around you. It is not a fan. It does not deal damage. An unresisted land is defense −26/256 and Magic Defense Bonus −${ENERV_MDB}, for ${ENERV_SECONDS} seconds. A half resist shortens the ${ENERV_SECONDS}. A full resist, and a quarter resist, land neither. Both statuses share that one roll. A stronger Defense Down stays. Frightful Roar is the same 26/256, so it refreshes. Jump's 20% and a Defense Down with no stored power stay. Dia still multiplies. Magic Defense Down refreshes itself, and later magic against the hare uses that −${ENERV_MDB}. Magic accuracy is Blue Magic skill plus dINT. There is no damage, so Burst Affinity is not spent. Cumulative enmity ${ENERV_CE}, volatile ${ENERV_VE}, when the hare is in the circle, including a resist. A target outside it, dead, or charmed adds none. It breaks Mazurka. Chain Affinity is not spent. Set bonus HP −5 and MP +5. Counter is 4 trait points and 5 set points. The trait needs 8 trait points and 5 set points, and tier I is level 70, an 8% counter rate. Asuran Claws is 4 trait points and 2 set points. Setting both grants it. This spell alone does not grant it. The counter is not rolled. A light-armored Troll, one that fights as Monk, Red Mage, Ranger, or Puppetmaster, teaches it at Blue Magic ${ENERVATION.learnSkill}. No Troll is in the yard yet, so it is already learned. A support job gets neither the stats nor a cast of this spell. The motion is the blue-magic cast, then a dark ring opens around you. A landed Defense Down cracks the hide, and Magic Defense Down leaves a violet wisp.`;
    } else if (spell.blue != null && "warmup" in spell.blue) {
      effect = `Earth. Accuracy +${WARM_UP.accuracy} and Evasion +${WARM_UP.evasion} on you for ${WARM_UP.seconds} seconds. Both are flat. It refreshes its own Accuracy Boost. Feather Barrier's Evasion Boost is +${FEATHER_BARRIER.evasion}. A stronger Evasion Boost is left alone, and this Accuracy Boost still lands. Diffusion is a locked merit, so the duration stays ${WARM_UP.seconds}. There is no damage, so Burst Affinity is not spent. It does not break Mazurka. Chain Affinity is not spent. The enmity box is blank. Cumulative enmity ${WARM_UP.ce}, volatile ${WARM_UP.ve}, the same pair Feather Barrier uses. A spell on yourself does not claim. A melee Mamool Ja teaches it at Blue Magic ${WARM_UP.learnSkill}. No Mamool Ja is in the yard yet, so it is already learned. Setting it grants VIT +${WARM_UP.vit} while Blue Mage is main. It is ${WARM_UP.clearTrait} trait points of Clear Mind and ${WARM_UP.points} set points. With Poison Breath, Clear Mind is +3 while resting. This spell alone does not grant it. A support job gets neither the VIT nor the trait. The motion is the blue-magic cast, then an amber earth ring rises around you. It is not feathers.`;
    } else if (spell.blue != null && "spit" in spell.blue) {
      const raw = firespitRaw({ level: LEVEL, int: sheet.int, mnd: sheet.mnd, targetInt: HARE.int, burstAffinity: false, azureLore: false });
      const hit = applyMab(Math.floor(raw), sheet.mab, 0);
      effect = `One fire hit at ${FIRESPIT.range}'. The script header recasts in ${FIRESPIT.recast} seconds. The card's 43 is not used. The base is level + 2, capped at ${FIRESPIT.dCap}. The stat term is 20% of INT and 20% of MND, times the level alpha, not floored per stat. At 75 that alpha is 0.83. Burst Affinity doubles that term and is spent, even on a miss or when the target is out of range. The coefficient is ${FIRESPIT.ftp}. Azure Lore adds nothing and does not open a magic burst. dINT is multiplied by ${FIRESPIT.dStat}. Anything above ${FIRESPIT.half} counts for half, and the term cannot fall under ${FIRESPIT.low}. Fire matches Liquefaction, Fusion, Light, and Radiance. Magic Attack Bonus is the step after the resist floor. On this sheet, before a resist and without Burst Affinity, the hit is ${hit}. No additional effect. The enmity box is blank. The cast claims, and the damage adds its own enmity. A connecting hit gives the hare 100 TP. It breaks Mazurka. Chain Affinity is not spent. Set bonus STR +${FIRESPIT.str}. Conserve MP is ${FIRESPIT.conserveTrait} trait points and ${FIRESPIT.points} set points. With Chaotic Eye, Zephyr Mantle, or Frost Breath, the trait sometimes costs less MP. This spell alone does not grant it. A mage Mamool Ja teaches it at Blue Magic ${FIRESPIT.learnSkill}. No Mamool Ja is in the yard yet, so it is already learned. A support job gets neither the STR nor a cast of this spell. The motion is the blue-magic cast, then a flame leaves your mouth and bursts on the target.`;
    } else if (spell.blue != null && "physical" in spell.blue && spell.name === "Tail Slap") {
      effect = `One blunt hit in a fan in front of you, ${TAIL_SLAP.range}' long and ${BLUE_CONE}° each side of where you are facing. A target behind you is missed. The range box is blank, so this yard uses that 10' fan. The script's damage type is hand-to-hand. This yard's pDIF stays the melee curve. Blue Magic skill sets the base, and the ${TAIL_SLAP.dCap} cap does not bind. fSTR is floor((your STR − the target's VIT + 4) / 4), and it stops at 22. The stat term is 20% of STR and 50% of VIT. The weapon-skill coefficient stays ${TAIL_SLAP.ftp} at every tier, including Azure Lore. Attack is ×${TAIL_ATTACK[0]} until Chain Affinity or Azure Lore is up. Chain Affinity walks ${TAIL_ATTACK[0]} at 0 TP, ${TAIL_ATTACK[1]} at 1500, and ${TAIL_ATTACK[2]} at 3000. Azure Lore sets the attack to ${TAIL_ATTACK_AZURE} and wins. It does not change ${TAIL_SLAP.ftp}, it does not force a critical hit, and it is not consumed. Chain Affinity doubles the stat term, forces the critical hit, spends all TP even if nobody is in the fan, and a connecting hit opens Reverberation. Stun lasts ${TAIL_STUN} seconds. A blunt type is not an element, so the resist roll uses none. A full resist does not stun. A half resist shortens the ${TAIL_STUN}. A miss does not stun. It replaces a Stun already up. A connecting hit interrupts a spell the hare has started. The script's three-shadow wipe is marked as a guess. The hare has none, so it is not rolled. The enmity box is blank. The cast claims, and the damage adds its own enmity. A connecting hit gives the hare 100 TP. It breaks Mazurka. Burst Affinity is not spent. Set bonus MND +${TAIL_SLAP.mnd}. Store TP is ${TAIL_SLAP.storeTrait} trait points and ${TAIL_SLAP.points} set points. The trait needs 8 trait points and 5 set points, and Blue Mage 69. Sickle Slash is the other half. Setting both grants Store TP +10 at Blue Mage 69. This spell alone never grants it. A Merrow teaches it at Blue Magic ${TAIL_SLAP.learnSkill}. Lamiae use it, and you do not learn it from them. No Merrow is in the yard yet, so it is already learned. A support job gets neither the MND nor the trait. The motion is the blue-magic cast, then a tan tail sweeps the fan in front of you. A landed stun draws the stars.`;
    } else if (spell.blue != null && "physical" in spell.blue && spell.name === "Hysteric Barrage") {
      effect = `Five blunt hits at ${HYSTERIC_BARRAGE.range}'. The range box is blank, so this yard uses ${HYSTERIC_BARRAGE.range}', the same reach as Uppercut. Blue Magic skill sets the base, and it stops at ${HYSTERIC_BARRAGE.dCap}. At Blue Magic 276 that term is 63, so the cap does not bind. fSTR is floor((your STR − the target's VIT + 4) / 4), and it stops at 22. The stat term is 30% of DEX. Only the first hit uses the weapon-skill coefficient. The other four stay at 1. That first coefficient stays ${HYSTERIC_FTP[0]} until Chain Affinity or Azure Lore is up, even though the card says damage varies with TP. Chain Affinity walks ${HYSTERIC_FTP[0]} at 0 TP, ${HYSTERIC_FTP[1]} at 1500, and ${HYSTERIC_FTP[2]} at 3000. Azure Lore replaces it with ${HYSTERIC_FTP_AZURE}. Raw TP stays ${HYSTERIC_FTP[0]}. Azure Lore does not force a critical hit and is not consumed. Attack stays ×1. The page's −10% attack is not in the current script, so it is not applied. Chain Affinity doubles the stat term, forces the critical hit, spends all TP, and a connecting hit opens Detonation. Each hit rolls accuracy on its own. No additional status. The enmity box is blank. The cast claims, and the damage adds its own enmity. Each connecting hit gives the hare 100 TP. It breaks Mazurka. Burst Affinity is not spent. Set bonus DEX +${HYSTERIC_BARRAGE.dex} and AGI +${HYSTERIC_BARRAGE.agi}. Evasion Bonus is ${HYSTERIC_BARRAGE.evasionTrait} trait points and ${HYSTERIC_BARRAGE.points} set points. With Screwdriver, Evasion Bonus is +10. This spell alone does not grant it. It does not stack with Thief. The higher value is kept. A Lamia teaches it after her weapon breaks, at Blue Magic ${HYSTERIC_BARRAGE.learnSkill}. Merrows may use it. You learn it from Lamiae. No Lamia is in the yard yet, so it is already learned. A support job gets neither the stats nor the trait. The motion is the blue-magic cast, then five pale fists land one after another. They are blunt, not needles.`;
    } else if (spell.blue != null && "gorge" in spell.blue) {
      const raw = regurgitationRaw({ level: LEVEL, int: sheet.int, mnd: sheet.mnd, targetInt: HARE.int, burstAffinity: false, azureLore: false });
      const hit = applyMab(Math.floor(raw), sheet.mab, 0);
      effect = `One water hit at ${REGURGITATION.range}'. The card and the encyclopedia say level ${REGURGITATION.level}. The script header says 68. This yard uses ${REGURGITATION.level}. The base is level + 2, capped at ${REGURGITATION.dCap}. The stat term is 30% of MND times the level alpha. dINT is still INT, multiplied by ${REGURGITATION.dStat}. Burst Affinity doubles the stat term and is spent, even on a miss or when the target is out of range. The coefficient is ${REGURGITATION.ftp}. The card's 1.875 is not used. Azure Lore adds nothing and does not open a magic burst. Anything above ${REGURGITATION.half} counts for half, and the term cannot fall under ${REGURGITATION.low}. After Magic Attack Bonus, a hit from behind is floored times ${REGURGITATION.behind}. The damage table's 2.46 is not used. Magic Attack Bonus is the step after the resist floor. On this sheet, before a resist, without Burst Affinity, and not from behind, the hit is ${hit}. Water matches Reverberation, Distortion, Darkness, and Umbra. Bind lasts ${REGURGITATION.bind} seconds, and only when the hit dealt damage. The element is water. A half resist shortens the ${REGURGITATION.bind}. A quarter resist does not bind. Gamer Escape notes an unlisted knockback. This yard does not move the hare. Cumulative enmity ${REGURGITATION.ce}, volatile ${REGURGITATION.ve}, when the hare is in range, including a resist. Out of range, dead, or charmed adds none. It breaks Mazurka. Chain Affinity is not spent. Set bonus MP +${REGURGITATION.setMp}, INT +${REGURGITATION.int}, and MND +${REGURGITATION.mnd}. Resist Gravity is ${REGURGITATION.gravityTrait} trait points and ${REGURGITATION.points} set point. With Feather Barrier the trait is 10% at Blue Mage 69. This spell alone does not grant it. Nothing here weighs you, so it is not rolled. A Peiste teaches it at Blue Magic ${REGURGITATION.learnSkill}. No Peiste is in the yard yet, so it is already learned. A support job gets neither the stats nor a cast of this spell. The motion is the blue-magic cast, then a water stream leaves you and splashes. A landed Bind draws water rings at the feet, not ice chains.`;
    } else if (spell.blue != null && "amp" in spell.blue) {
      effect = `Water. Magic attack +${AMPLIFICATION.mab} and magic defense +${AMPLIFICATION.mdb} on you for ${AMPLIFICATION.seconds} seconds. It refreshes its own Magic Def. Boost when that boost is not already stronger. Memento Mori's Magic Atk. Boost is +${MEMENTO_MAB}. A stronger Magic Atk. Boost is left alone. Saline Coat's Magic Def. Boost starts at ${SALINE_MDB} and is left alone. A weaker Magic Def. Boost, or none, is replaced by +${AMPLIFICATION.mdb}. Magic Def. Boost stacks with Dream Shroud. Diffusion is a locked merit, so the duration stays ${AMPLIFICATION.seconds}. There is no damage, so Burst Affinity is not spent. It does not break Mazurka. Chain Affinity is not spent. Cumulative enmity ${AMPLIFICATION.ce}, volatile ${AMPLIFICATION.ve}. A spell on yourself does not claim. Set bonus HP −5 and MP +5. The script says Combos: None, so it grants no trait. A Flan teaches it at Blue Magic ${AMPLIFICATION.learnSkill}. No Flan is in the yard yet, so it is already learned. A support job gets neither the stats nor a cast of this spell. The motion is the blue-magic cast, then a water ring and a pale shield rise around you.`;
    } else if (spell.blue != null && "physical" in spell.blue && spell.name === "Asuran Claws") {
      effect = `Six blunt hits at ${ASURAN_CLAWS.range}'. The script, Gamer Escape, and the encyclopedia cast in ${ASURAN_CLAWS.cast} seconds. The card's 2 seconds matches the point cost and is not used. The range box is blank, so this yard uses ${ASURAN_CLAWS.range}', the same reach as Uppercut. The script's damage type is hand-to-hand. This yard's pDIF stays the melee curve. Blue Magic skill sets the base, and the ${ASURAN_CLAWS.dCap} cap does not bind. fSTR is floor((your STR − the target's VIT + 4) / 4), and it stops at 22. The stat term is 10% of STR and 10% of DEX. Only the first hit uses the weapon-skill coefficient. The other five stay at 1. That coefficient stays ${ASURAN_CLAWS.ftp} at every tier, including Azure Lore. Attack stays ×${ASURAN_MULT}, including Azure Lore. Chain Affinity does not walk it. Chain Affinity doubles the stat term, forces the critical hit, spends all TP, and a connecting hit opens Liquefaction, then Impaction. Accuracy is the made-up curve the script marks as a guess. Raw TP adds nothing. Chain Affinity adds floor(TP / ${BLUE_ACC_DIV}). Azure Lore is +${BLUE_ACC_AZURE} and wins. Each hit rolls accuracy on its own. The enmity box is blank. The cast claims, and the damage adds its own enmity. Each connecting hit gives the hare 100 TP. It breaks Mazurka. Burst Affinity is not spent. Set bonus AGI +${ASURAN_CLAWS.agi}. Counter is ${ASURAN_CLAWS.counterTrait} trait points and ${ASURAN_CLAWS.points} set points. With Enervation the trait is an 8% counter rate at level 70. This spell alone does not grant it. The counter is not rolled. It does not stack with Monk. The higher value is kept. A standing Gnole teaches it at Blue Magic ${ASURAN_CLAWS.learnSkill}. No Gnole is in the yard yet, so it is already learned. A support job gets neither the AGI nor the trait. The motion is the blue-magic cast, then six pale claws rake the target.`;
    } else if (spell.blue != null && "lowing" in spell.blue) {
      effect = `Fire. Plague on enemies within ${LOWING.radius}', centered on you. It is not a fan. It does not deal damage. The radius box is blank, so this yard uses the same 10' circle as Battle Dance. The script and the encyclopedia recast in ${LOWING.recast} seconds. The current card says 120. This yard uses ${LOWING.recast}. An unresisted land lasts ${LOWING.seconds} seconds. A half resist shortens it. A full resist, and a quarter resist, do not land. The script's resist threshold is 0.5. Plague removes ${LOWING.tpCut} TP and ${LOWING.mpCut} MP every 3 seconds. The ${HARE.name} has no MP pool, so the ${LOWING.mpCut} MP is not drained. The TP is. Wild Carrot restores no HP while Plague is up. Magic accuracy is Blue Magic skill plus dINT. The element is fire. The script header can tag a magic-burst message on Liquefaction, Fusion, or Light. The current card lists no burst. There is no damage, so Burst Affinity is not spent. Cumulative enmity ${LOWING.ce}, volatile ${LOWING.ve}, when the hare is in the circle, including a resist. A target outside it, dead, or charmed adds none. It breaks Mazurka. Chain Affinity is not spent. Set bonus HP −5. Clear Mind is ${LOWING.clearTrait} trait points and ${LOWING.points} set points. With Poison Breath, Clear Mind is +3 while resting. This spell alone does not grant it. A Buffalo teaches it at Blue Magic ${LOWING.learnSkill}. No Buffalo is in the yard yet, so it is already learned. A support job gets neither the HP nor the trait. The motion is the blue-magic cast, then a sickly fire ring opens around you. A landed Plague hangs a green wisp on the target.`;
    } else if (spell.name === "Heat Breath") {
      const raw = Math.floor(heatBreathRaw(sheet.hp));
      effect = `Fire breath in a fan in front of you, ${HEAT_BREATH.range}' long and ${BLUE_CONE}° each side of where you are facing. The card prints about ${HEAT_BREATH.range}'. Damage is current HP / ${HEAT_BREATH.hpMod}. The level term is 0, so it is not divided. On this sheet that is ${raw} before a resist. Magic Attack Bonus is not applied, and magic defense is not applied. Day, weather, staff, affinity, and breath damage dealt are not applied. Convergence is a locked merit, so it does not increase the breath. A magic burst would raise accuracy only. This yard's magic burst is a damage multiplier, so Burst Affinity is not spent and the hit is not multiplied. The script header still names Liquefaction, Fusion, and Light. Azure Lore does not change the breath. No additional effect. The enmity box is blank. A hare in the fan is claimed. A connecting hit gives the hare 100 TP. It breaks Mazurka. Chain Affinity is not spent. Set bonus STR +${HEAT_BREATH.str}. Magic Attack Bonus is ${HEAT_BREATH.mabTrait} trait points and ${HEAT_BREATH.points} set points. With Memento Mori, Cursed Sphere, Sound Blast, or Eyes On Me, the trait is +20. This spell alone does not grant it. A Manticore teaches it at Blue Magic ${HEAT_BREATH.learnSkill}. No Manticore is in the yard yet, so it is already learned. A support job gets neither the STR nor the trait. The motion is the blue-magic cast, then a fan of fire leaves your mouth. It is not Firespit's projectile.`;
    } else if (spell.blue != null && "triumph" in spell.blue) {
      effect = `Fire, but it lands on you. Attack +${TRIUMPHANT_ROAR.numer}/256, about 15%, for ${TRIUMPHANT_ROAR.seconds} seconds. The card says ${TRIUMPHANT_ROAR.mp} MP. The script header says 36. This yard uses ${TRIUMPHANT_ROAR.mp}. It stacks with Berserk, Warcry, and Last Resort. It refreshes its own Attack Boost. Nature's Meditation would overwrite it. That spell is not in the yard. Diffusion is a locked merit, so the duration stays ${TRIUMPHANT_ROAR.seconds}. There is no damage, so Burst Affinity is not spent. It does not break Mazurka. Chain Affinity is not spent. Cumulative enmity ${TRIUMPHANT_ROAR.ce}, volatile ${TRIUMPHANT_ROAR.ve}. A spell on yourself does not claim. Set bonus STR +${TRIUMPHANT_ROAR.str}. The script says Combos: None, so it grants no trait. A Gargouille teaches it, when it is not flying, at Blue Magic ${TRIUMPHANT_ROAR.learnSkill}. No Gargouille is in the yard yet, so it is already learned. A support job gets neither the STR nor a cast of this spell. The motion is the blue-magic cast, then gold shockwave rings leave you. It is not a damage cone.`;
    } else if (spell.blue != null && "physical" in spell.blue && spell.name === "Sickle Slash") {
      effect = `One blunt hit at ${SICKLE_SLASH.range}'. The script's damage type is hand-to-hand. This yard's pDIF stays the melee curve. Blue Magic skill sets the base, and it stops at ${SICKLE_SLASH.dCap}. fSTR is floor((your STR − the target's VIT + 4) / 4), and it stops at 22. The stat term is 50% of DEX. The weapon-skill coefficient stays ${SICKLE_FTP} at every tier, including Azure Lore. Attack stays ×${SICKLE_MULT}, including Azure Lore and Chain Affinity. The script header and Gamer Escape recast in ${SICKLE_SLASH.recast} seconds. The current card says 20. This yard uses ${SICKLE_SLASH.recast}. The card says the critical chance varies with TP. The script walks 0, 15, and 30 only while Chain Affinity is up, and sets 35 under Azure Lore. Chain Affinity already forces the critical hit, so that walk is not used. Without Chain Affinity or Azure Lore the chance stays 0. Azure Lore's ${SICKLE_AZURE_CRIT * 100}% is not a forced critical hit, and Azure Lore is not consumed. The native 5% floor is not added. Chain Affinity doubles the stat term, forces the critical hit, spends all TP, and a connecting hit opens Compression. The enmity box is blank. The cast claims, and the damage adds its own enmity. A connecting hit gives the hare 100 TP. It breaks Mazurka. Burst Affinity is not spent. Set bonus HP −5 and MP +${SICKLE_SLASH.setMp}. Store TP is ${SICKLE_SLASH.storeTrait} trait points and ${SICKLE_SLASH.points} set points. With Tail Slap, Store TP is +10 at Blue Mage 69. This spell alone does not grant it. A Spider teaches it at Blue Magic ${SICKLE_SLASH.learnSkill}. No Spider is in the yard yet, so it is already learned. A support job gets neither the stats nor the trait. The motion is the blue-magic cast, then one pale sickle cuts the target. A critical hit flashes white.`;
    } else if (spell.blue != null && "physical" in spell.blue && spell.name === "Sub-zero Smash") {
      effect = `One blunt hit in a fan in front of you, ${SUBZERO_SMASH.range}' long and ${BLUE_CONE}° each side of where you are facing. Gamer Escape's animation looks like two hits. Only one of them deals damage. Blue Magic skill sets the base, and the ${SUBZERO_SMASH.dCap} cap does not bind. fSTR is floor((your STR − the target's VIT + 4) / 4), and it stops at 22. The stat term is 60% of VIT. The weapon-skill coefficient stays ${SUBZERO_FTP} at every tier, including Azure Lore. Attack stays ×${SUBZERO_MULT}, including Azure Lore and Chain Affinity. Chain Affinity doubles the stat term, forces the critical hit, spends all TP even if nobody is in the fan, and a connecting hit opens Fragmentation. Paralyze is a ${SUBZERO_PARA}% chance to cancel an auto-attack or TP move, for ${SUBZERO_PARA_SECONDS} seconds, and only when the hit connects. A blunt type is not an element, so the resist roll uses none. Magic accuracy uses INT. A half resist lasts ${Math.floor(SUBZERO_PARA_SECONDS / 2)} seconds. A full resist and a quarter resist do not land. It does not overwrite Paralyze, Paralyze II, or Jubaku. Jubaku is stored as Paralyze. Mind Blast does overwrite. A later black-magic Paralyze can still refresh a Paralyze of the same tier. The enmity box is blank. The cast claims, and the damage adds its own enmity. A connecting hit gives the hare 100 TP. It breaks Mazurka. Burst Affinity is not spent. Set bonus HP +${SUBZERO_SMASH.hp} and VIT +${SUBZERO_SMASH.vit}. Fast Cast is ${SUBZERO_SMASH.fastTrait} trait points and ${SUBZERO_SMASH.points} set points. With Bad Breath, casting time is −5% at Blue Mage 72, and recast loses half of that. This spell alone does not grant it. A Ruszor teaches it at Blue Magic ${SUBZERO_SMASH.learnSkill}. No Ruszor is in the yard yet, so it is already learned. A support job gets neither the stats nor the trait. The motion is the blue-magic cast, then two icy impacts fan out. One damage number lands. A landed Paralyze leaves crystals. It is not Frost Breath.`;
    } else if (spell.blue != null && "saline" in spell.blue) {
      effect = `Light. Magic defense +${SALINE_MDB} on you for ${SALINE_SECONDS} seconds. The script's duration is ${SALINE_SECONDS}. Gamer Escape says 60. This yard uses ${SALINE_SECONDS}. It loses 1 Magic Def. Boost every ${SALINE_TICK} seconds and does not fall under 0. BG-Wiki's stepped list, 50 then 37, 27, 20, 15, 11, and 8, is not the current script. The retail bug that wears the effect a minute early is not reproduced. Diffusion is a locked merit, so it is not applied. It overwrites Amplification's +${AMPLIFICATION.mdb} and refreshes its own decay back to ${SALINE_MDB}. Amplification leaves this buff alone while it is still stronger than ${AMPLIFICATION.mdb}. Magic Def. Boost stacks with Dream Shroud, and the decaying power is what later magic damage reads. There is no damage, so Burst Affinity is not spent. It does not break Mazurka. Chain Affinity is not spent. Cumulative enmity ${SALINE_COAT.ce}, volatile ${SALINE_COAT.ve}. The script stores no enmity. The card prints that pair. A spell on yourself does not claim. Set bonus MP +${SALINE_COAT.setMp}, VIT +${SALINE_COAT.vit}, and AGI +${SALINE_COAT.agi}. Defense Bonus is ${SALINE_COAT.defenseTrait} trait points and ${SALINE_COAT.points} set points. With Grand Slam, or with Terror Touch, Defense Bonus is +10. This spell alone does not grant it. An Xzomit teaches it at Blue Magic ${SALINE_COAT.learnSkill}. No Xzomit is in the yard yet, so it is already learned. A support job gets neither the stats nor the trait. The motion is the blue-magic cast, then a pale salt crust closes around you. It is not Amplification's water ring.`;
    } else if (spell.blue != null && "physical" in spell.blue && spell.name === "Ram Charge") {
      effect = `One blunt hit at ${RAM_CHARGE.range}'. The range box is blank, so this yard uses ${RAM_CHARGE.range}', the same reach as Uppercut. Blue Magic skill sets the base, and the ${RAM_CHARGE.dCap} cap does not bind. fSTR is floor((your STR − the target's VIT + 4) / 4), and it stops at 22. The stat term is 30% of STR and 50% of MND. The coefficient stays ${RAM_FTP[0]} until Chain Affinity or Azure Lore is up. Chain Affinity walks ${RAM_FTP[0]} at 0 TP, ${RAM_FTP[1]} at 1500, and ${RAM_FTP[2]} at 3000. Azure Lore replaces it with ${RAM_FTP_AZURE}. Raw TP stays ${RAM_FTP[0]}. Attack stays ×${RAM_MULT}, including Azure Lore and Chain Affinity. Chain Affinity doubles the stat term, forces the critical hit, spends all TP, and a connecting hit opens Fragmentation. Knockback is graphical. The hare does not move. A connecting hit interrupts a spell the hare has started and does not apply Stun. The enmity box is blank. The cast claims, and the damage adds its own enmity. A connecting hit gives the hare 100 TP. It breaks Mazurka. Burst Affinity is not spent. Set bonus HP +${RAM_CHARGE.hp}. Lizard Killer is ${RAM_CHARGE.lizardTrait} trait points and ${RAM_CHARGE.points} set points. With Foot Kick, or with Claw Cyclone, damage dealt to lizards is +8%. This spell alone does not grant it. The ${HARE.name} is not a lizard, so the trait is not rolled. A Ram teaches it at Blue Magic ${RAM_CHARGE.learnSkill}. No Ram is in the yard yet, so it is already learned. A support job gets neither the HP nor the trait. The motion is the blue-magic cast, then a dust rush toward the hare. Knockback debris stays where the hare is.`;
    } else if (spell.blue != null && "shift" in spell.blue) {
      effect = `Lightning. Stun on enemies within ${SHIFT_RADIUS}', centered on you. The radius box is blank, so this yard uses the same 10' circle as Battle Dance. It is not a fan and it is not a gaze. It does not deal damage. An unresisted land lasts ${SHIFT_SECONDS} seconds. A half resist shortens it. A full resist does not land. The script would still land a quarter resist at 1 second. This yard's second miss does not. It overwrites a Stun already up and interrupts a spell the hare has started. Magic accuracy is Blue Magic skill plus dINT. The header can magic burst Impaction, Fragmentation, and Light. There is no damage, so Burst Affinity is not spent. It does not give the hare TP. Cumulative enmity ${TEMPORAL_SHIFT.ce}, volatile ${TEMPORAL_SHIFT.ve}, when the hare is in the circle, including a resist. The script stores no enmity. The card prints that pair. A hare in range is claimed. Out of range, dead, or charmed adds none. It breaks Mazurka. Chain Affinity is not spent. Set bonus HP +${TEMPORAL_SHIFT.hp} and MP +${TEMPORAL_SHIFT.setMp}. Attack Bonus is ${TEMPORAL_SHIFT.attackTrait} trait points and ${TEMPORAL_SHIFT.points} set points. With Battle Dance, Uppercut, Death Scissors, or Spinal Cleave, Attack Bonus is +10. This spell alone does not grant it. An Hpemde teaches it at Blue Magic ${TEMPORAL_SHIFT.learnSkill}. No Hpemde is in the yard yet, so it is already learned. A support job gets neither the stats nor the trait. The motion is the blue-magic cast, then a lightning ring opens around you. A landed Stun draws the stars. It is not a projectile.`;
    } else if (spell.blue != null && "hammer" in spell.blue) {
      const raw = magicHammerRaw({ level: LEVEL, mnd: sheet.mnd, targetMnd: HARE.mnd, burstAffinity: false, azureLore: false });
      const hit = applyMab(Math.floor(raw), sheet.mab, 0);
      effect = `Light damage that steals MP equal to the damage, at ${MAGIC_HAMMER.range}'. The range box is blank. This yard uses ${MAGIC_HAMMER.range}', the same stand-in as Blitzstrahl. The script's coefficient is ${MAGIC_HAMMER.ftp}, not the card's 1.0. Azure Lore adds ${MAGIC_HAMMER.azureFtp}. Burst Affinity doubles the MND term and does not change ${MAGIC_HAMMER.ftp}. It is spent even on a miss, when the target is out of range, and on the undead no-effect. The base is your level + 2, and it stops at ${MAGIC_HAMMER.dCap}. At 75 that term is ${MAGIC_HAMMER.dCap}. The stat term is ${MAGIC_HAMMER.mndMod * 100}% of MND times the level alpha. At 75 that alpha is 0.83. Your MND is ${sheet.mnd}. The hare's MND is ${HARE.mnd}. dMND is multiplied by ${MAGIC_HAMMER.dStat}. Anything above ${MAGIC_HAMMER.half} counts for half, and the term cannot fall under ${MAGIC_HAMMER.low}. Light matches Transfixion, Fusion, Light, and Radiance. Day, weather, and staff are not applied. Magic Attack Bonus is applied after the resist floor. On this sheet, before a resist and without Burst Affinity or Azure Lore, the hit is ${hit}. A resist can cut it to 1/2, 1/4, or 1/8. The MP stolen is the damage that landed, then clamped to the target's MP and to your missing MP. The Tropical Rarab has ${HARE.mp} MP, so the steal is 0 and the log says it has no MP. The HP damage still lands. The spell page says it is ineffective against undead, so undead take no damage and no MP is stolen. The hare is not undead. Chain Affinity is not spent. The enmity box is blank. The cast claims, and the damage adds its own enmity. It does not give the hare TP. It breaks Mazurka. A Poroggo teaches it at Blue Magic ${MAGIC_HAMMER.learnSkill}. No Poroggo is in the yard yet, so it is already learned. Setting it grants MP ${MAGIC_HAMMER.setMp} and MND +${MAGIC_HAMMER.mnd} while Blue Mage is main. Magic Attack Bonus is ${MAGIC_HAMMER.mabTrait} trait points and ${MAGIC_HAMMER.points} set points. With Cursed Sphere, Sound Blast, Memento Mori, Eyes On Me, Heat Breath, or Reactor Cool, the trait is +20. This spell alone does not grant it. A support job gets neither the stats nor the trait. The motion is the blue-magic cast, then a gold hammer drops onto the target and a light flash opens.`;
    } else if (spell.blue != null && "reactor" in spell.blue) {
      effect = `Ice, on you. Defense +12% and Ice Spikes for ${REACTOR_SECONDS} seconds. The card says 3 minutes. The script's duration is ${REACTOR_SECONDS}. This yard uses ${REACTOR_SECONDS}. Diffusion would lengthen it. Diffusion is a locked merit. The defense bonus is ${REACTOR_DEFENSE}/256, the same scale Cocoon uses for 128/256. It overwrites Defense Boost no matter which is stronger, including Cocoon's +50%. Cocoon overwrites this boost in return. Ice Spikes use the script's power ${REACTOR_SPIKE}, not the black-magic INT formula. Magic Attack Bonus is read when a hit connects. There is no stun. It overwrites Blaze Spikes and Shock Spikes, because this yard keeps one spikes status. Reprisal is left alone. There is no damage, so Burst Affinity is not spent. Chain Affinity is not spent. It does not break Mazurka. Cumulative enmity ${REACTOR_COOL.ce}, volatile ${REACTOR_COOL.ve}. The script stores no enmity. The card prints that pair. A spell on yourself does not claim. A Zdei teaches it at Blue Magic ${REACTOR_COOL.learnSkill}. No Zdei is in the yard yet, so it is already learned. Setting it grants INT +${REACTOR_COOL.int} and MND +${REACTOR_COOL.mnd} while Blue Mage is main. Magic Attack Bonus is ${REACTOR_COOL.mabTrait} trait points and ${REACTOR_COOL.points} set points. With Magic Hammer, Memento Mori, Cursed Sphere, Sound Blast, Eyes On Me, or Heat Breath, the trait is +20. This spell alone does not grant it. A support job gets neither the stats nor the trait. The motion is the blue-magic cast, then ice crystals orbit you inside a frost shell. It is not Plasma Charge.`;
    } else if (spell.blue != null && "exuv" in spell.blue) {
      const healing = combinedSkill("Healing Magic", mainJob, LEVEL, subJob, subLv);
      const healed = exuviationBase(wildCarrotPower(sheet.mnd, sheet.vit, healing));
      effect = `Fire, on you. It restores HP and removes one effect Erase can remove. The cure table is the script's Healing Breeze bands, then the spell page's soft cap of ${EXUV_CAP}. Ailments do not change the heal. Power is 3×MND + VIT + 3×floor(Healing Magic ÷ 5). Your MND is ${sheet.mnd} and your VIT is ${sheet.vit}. Healing Magic is ${healing}. On this sheet the heal is ${healed} before Divine Seal, and it cannot pass ${EXUV_CAP}. Divine Seal doubles it. It does not damage undead. Diffusion would share it. Diffusion is a locked merit, so it stays on you. Poisona effects are not removed. Nothing to remove still heals. The erase sparkle is drawn only when something was removed. There is no damage, so Burst Affinity is not spent. Chain Affinity is not spent. It does not break Mazurka. Cumulative enmity ${EXUVIATION.ce}, volatile ${EXUVIATION.ve}, plus the cure enmity of the HP that landed. A spell on yourself does not claim. A Wamoura teaches it at Blue Magic ${EXUVIATION.learnSkill}. No Wamoura is in the yard yet, so it is already learned. Setting it grants HP +${EXUVIATION.hp}, MP +${EXUVIATION.setMp}, and CHR +${EXUVIATION.chr} while Blue Mage is main. Resist Sleep is ${EXUVIATION.sleepTrait} trait points and ${EXUVIATION.points} set points. With Pollen, Wild Carrot, Magic Fruit, or Yawn, Resist Sleep is 10%. This spell alone does not grant it. A support job gets neither the stats nor the trait. The motion is the blue-magic cast, then pale shell fragments peel upward and a fire-gold glow stays. It is not a white-magic cure.`;
    } else if (spell.blue != null && "physical" in spell.blue && spell.name === "Vertical Cleave") {
      effect = `One slashing hit at ${VERTICAL_CLEAVE.range}'. The range box is blank, so this yard uses ${VERTICAL_CLEAVE.range}'. The script's damage type is slashing. This yard's pDIF stays the melee curve every physical blue uses. Blue Magic skill sets the base, and it stops at ${VERTICAL_CLEAVE.dCap}. fSTR is floor((your STR − the target's VIT + 4) / 4), and it stops at 22. The stat term is 50% of STR. The weapon-skill coefficient stays ${CLEAVE_FTP} at every tier, including Chain Affinity and Azure Lore. Attack is ×${CLEAVE_MULT}. Chain Affinity walks that attack ${CLEAVE_ATTACK[0]} at 0 TP, ${CLEAVE_ATTACK[1]} at 1500, and ${CLEAVE_ATTACK[2]} at 3000. Azure Lore replaces the attack with ${CLEAVE_ATTACK_AZURE} and wins. It does not change ${CLEAVE_FTP}, and it is not consumed. Additional TP does not raise the coefficient. Chain Affinity doubles the stat term, forces the critical hit, spends all TP, and a connecting hit opens Gravitation. It ignores Utsusemi. The hare has no shadows, so that clause is not rolled. The enmity box is blank. The cast claims, and the damage adds its own enmity. A connecting hit gives the hare 100 TP. It breaks Mazurka. Burst Affinity is not spent. An Euvhi, in the open flower state, teaches it at Blue Magic ${VERTICAL_CLEAVE.learnSkill}. No Euvhi is in the yard yet, so it is already learned. Setting it grants VIT +${VERTICAL_CLEAVE.vit}, HP −5, and MP +${VERTICAL_CLEAVE.setMp} while Blue Mage is main. Defense Bonus is ${VERTICAL_CLEAVE.defenseTrait} trait points and ${VERTICAL_CLEAVE.points} set points. With Grand Slam, Terror Touch, or Saline Coat, Defense Bonus is +10. This spell alone does not grant it. A support job gets neither the stats nor the trait. The motion is the blue-magic cast, then a sword chops straight down. The trail is Gravitation's dark violet.`;
    } else if (spell.blue != null && "physical" in spell.blue) {
      effect = "Deals critical damage. The chance is not published, so it does not critical hit unless Chain Affinity is up. One physical hit. Blue Magic skill sets the base, and it stops at 9. fSTR is floor((your STR − the target's VIT + 4) / 4), and it stops at 22. The stat term is 10% of STR plus 10% of DEX. Chain Affinity doubles that term, forces the critical hit, spends all of your TP, and the hit can close Detonation. It does not spend TP otherwise. Setting it grants AGI +1 while Blue Mage is main. Foot Kick alone does not grant Lizard Killer. Claw Cyclone is the other half. Setting both is +8% damage dealt to lizards. A Rabbit has to ready Foot Kick. You learn it when that Rabbit falls while you are Blue Mage, alive, and have claim.";
    } else if (spell.blue != null && "cure" in spell.blue && spell.name === "Magic Fruit") {
      const healing = combinedSkill("Healing Magic", mainJob, LEVEL, subJob, subLv);
      const healed = magicFruitBase(wildCarrotPower(sheet.mnd, sheet.vit, healing));
      effect = `Restores HP for you or one trust. Roughly Cure IV. An enemy is not a valid target, and it does not damage undead. Power is 3×MND + VIT + 3×floor(Healing Magic ÷ 5). That is your MND ${sheet.mnd} and your VIT ${sheet.vit}. Healing Magic is ${healing}. The band is rate 0.6666 and constant 130 until power reaches 320, then rate 1 and constant 210 until power reaches 560, then rate 2.833 and constant 391.2. The floor is 250. The formula page does not print a maximum, so the spell page's 550 and 610 are not a clamp. On this sheet the heal is ${healed} before Divine Seal. A naked Hume Blue Mage 75, MND 53 and VIT 53, heals 289. Divine Seal doubles it. Day, weather, and cure potency are not applied. Diffusion does not share it. Burst Affinity is not spent. Setting it grants CHR +${MAGIC_FRUIT.chr} and HP +${MAGIC_FRUIT.hp} while Blue Mage is main. It is 4 trait points of Resist Sleep and 3 set points. With Wild Carrot, also 4 and 3, Resist Sleep is 10%. Neither spell grants it alone. It does not stack with Paladin. The higher value is kept. Nothing here sleeps you, so it is not rolled. An Opo-opo teaches it at Blue Magic 162. No Opo-opo is in the yard yet, so it is already learned. A support job gets neither the stats nor the trait. The motion is the blue-magic cast, then a green fruit arcs onto the target and bursts.`;
    } else if (spell.blue != null && "memento" in spell.blue) {
      effect = `Magic Attack Bonus +${MEMENTO_MAB} on you for ${MEMENTO_SECONDS} seconds. It does not scale with Blue Magic skill or INT. Gamer Escape's 6-second cast and 30-second cap are stale. The script header's 6-second cast is the same stale card. The current card is 3.5 seconds to cast and 120 seconds to recast, and the status lasts ${MEMENTO_SECONDS} seconds. The client row matches Zephyr Mantle: valid targets 1, area 6, range 0, so this yard casts it on you. Diffusion would share it. Diffusion is a locked merit, so it stays on you. The duration is not passed through Enhancing Magic. You are 75, so a lower-level penalty does not apply. BG-Wiki calls the element ice. There is no damage, so the element is not rolled. It refreshes its own Magic Atk. Boost. The status stacks with the job trait and with gear. On this sheet the trait Magic Attack Bonus is ${sheet.mab}. The status is not in that number until it is cast. It does not deal damage, so Chain Affinity and Burst Affinity are not spent. It does not break Mazurka. Cumulative enmity ${MEMENTO_CE}, volatile enmity ${MEMENTO_VE}. A spell on yourself does not claim. A Corse teaches it at Blue Magic 181. No Corse is in the yard yet, so it is already learned. Setting it grants INT +${MEMENTO_MORI.int} while Blue Mage is main. It is 4 trait points of Magic Attack Bonus and 4 set points. The trait needs 8 trait points and 3 set points, so this spell alone does not grant it. Cursed Sphere, Sound Blast, or Heat Breath is the other half. Setting any of those pairs grants Magic Attack Bonus +20. It does not stack with Black Mage or Red Mage. The higher value is kept. A support job gets neither the INT nor the trait. The motion is the blue-magic cast, then pale ice wisps rise and settle into a Magic Attack Bonus glow.`;
    } else if (spell.blue != null && "magical" in spell.blue) {
      const raw = mindBlastRaw({ level: LEVEL, mnd: sheet.mnd, targetMnd: HARE.mnd, burstAffinity: false, azureLore: false });
      const hit = applyMab(Math.floor(raw), sheet.mab, 0);
      effect = `One lightning hit at ${MIND_BLAST_RANGE}'. The range box is blank. The client list stores 100 where Wild Carrot stores 200, and this yard treats that 200 as 20', so this spell uses ${MIND_BLAST_RANGE}'. The base is your level + 2, and it stops at ${MIND_BLAST.dCap}. At 75 that term is ${MIND_BLAST.dCap}. The stat term is 30% of MND times the level alpha. At 75 that alpha is 0.83. Your MND is ${sheet.mnd}. The hare's MND is ${HARE.mnd}. dMND is multiplied by 1.5. Anything above 999 counts for half, and the term cannot fall under −399. The weapon-skill coefficient is ${MIND_BLAST_FTP}, which is 531/256. The script's 2.08 is not used. It does not walk with TP. Burst Affinity doubles the stat term and is spent, even on a miss or when the target is out of range. It does not change 531/256. A matching skillchain shows Magic Burst on the target. Lightning matches Impaction, Fragmentation, Light, and Radiance. Cannonball's Fusion does not. Two weapon skills multiply the hit by 1.35. Each further weapon skill adds 0.10. The floor is taken after that step, then after Magic Burst Bonus. This job has no such trait, so the second step stays 1 unless Black Mage supplies it. Azure Lore does not open that window. Azure Lore adds 0.5 to that coefficient and is not consumed. Chain Affinity does not apply and is not spent. Day, weather, staff, affinity, SDT, Ebullience, and ecosystem correlation are not applied. Magic Attack Bonus is applied after the resist floor. On this sheet, before a resist and without Burst Affinity or Azure Lore, the hit is ${hit}. A resist can cut it to 1/2, 1/4, or 1/8. 1/8 is not zero. Paralyze is ${MIND_BLAST_PARA}% for ${MIND_BLAST_PARA_SECONDS} seconds. That 20 is not the enfeeble potency. A second roll uses Blue Magic skill and dMND. A full resist on that roll does not land it. A half resist lasts ${Math.floor(MIND_BLAST_PARA_SECONDS / 2)} seconds, and the potency stays ${MIND_BLAST_PARA}. Damage of 0 skips it. Paralyze II is stronger and is left alone. It does not open a skillchain. It can magic burst Impaction, Fragmentation, Light, and Radiance when Burst Affinity is up and that window is open. Azure Lore does not open it. Two weapon skills multiply the hit by 1.35. Each further weapon skill adds 0.10. The enmity box is blank. The cast claims, and the damage adds its own enmity. It does not give the hare TP. It breaks Mazurka. A Soulflayer teaches it at Blue Magic 235. No Soulflayer is in the yard yet, so it is already learned. Setting it grants MP +${MIND_BLAST.setMp} and MND +${MIND_BLAST.mnd} while Blue Mage is main. It is 4 trait points of Clear Mind and 4 set points. The trait needs 8 trait points and 3 set points, so this spell alone does not grant it. Poison Breath or Soporific is the other half. Setting either pair grants Clear Mind +3 while resting. It does not stack with Black Mage, White Mage, Red Mage, or Summoner. The higher value is kept. A support job gets neither the stats nor the trait. The motion is the blue-magic cast, then a violet lance strikes the target. A landed paralyze leaves amber crystals.`;
    } else if (spell.blue != null && "cure" in spell.blue) {
      const healing = combinedSkill("Healing Magic", mainJob, LEVEL, subJob, subLv);
      const healed = wildCarrotBase(wildCarrotPower(sheet.mnd, sheet.vit, healing));
      effect = `Restores HP for you or one trust. An enemy is not a valid target, and it does not damage undead. Power is 3×MND + VIT + 3×floor(Healing Magic ÷ 5). That is your MND ${sheet.mnd} and your VIT ${sheet.vit}, not the target's VIT. Healing Magic is ${healing}. Blue Mage has no Healing Magic rank, so that term is 0 unless a subjob supplies it. The base walks floor(Power ÷ 2): rate 1 and constant 60 until the result would reach 150, then rate 2 and constant 105 until it would reach 180, then rate 15.66 and constant 170.43. 180 is a soft step, not a maximum. The floor is 120. On this sheet the heal is ${healed} before Divine Seal. A naked Hume Blue Mage 75, MND 53 and VIT 53, heals 158. Divine Seal doubles it. Day and weather do not change it. Cure potency gear is not applied in this yard. Majesty, Afflatus Solace, and Chain Affinity do not apply. Burst Affinity does not magic burst a cure. Setting it grants HP +5 while Blue Mage is main. It is 4 trait points of Resist Sleep and 3 set points. The trait needs 8 trait points and 4 set points, so Wild Carrot alone does not grant Resist Sleep. A Rabbit has to ready Wild Carrot. You learn it when that Rabbit falls while you are Blue Mage, alive, and have claim. Blue Magic skill 62 is required.`;
    } else if (spell.blue != null && "flash" in spell.blue) {
      effect = `Area Flash, centered on you. Enemies within ${ACTINIC_RADIUS}' lose ${ACTINIC_BURST.accDown} accuracy for about ${ACTINIC_SECONDS} seconds. It does not deal damage. It does not overwrite Flash. Flash overwrites it. Blindna does not remove it. The magic accuracy bonus is unpublished. BG-Wiki says it is probably Flash's +200, so that 200 is rolled with Blue Magic skill and dMND. The range box is blank, so this yard uses ${ACTINIC_RADIUS}'. A Ghrah teaches it at Blue Magic 240. No Ghrah is in the yard yet, so it is already learned. Setting it grants CHR +${ACTINIC_BURST.chr} and HP +${ACTINIC_BURST.hp} while Blue Mage is main. It is 4 trait points of Auto Refresh. The trait needs 8, so this spell alone does not grant it. Burst Affinity is not spent, because there is no damage to burst. Cumulative enmity ${ACTINIC_CE}, volatile enmity ${ACTINIC_VE}. The cast adds that enmity only when the Tropical Rarab is inside the area. The motion is the blue-magic cast, then a white radial flash from you. A landed Flash also draws the white cross on the target.`;
    } else if (spell.blue != null && "spikes" in spell.blue) {
      const base = spikeBase("Shock Spikes", sheet.int);
      effect = `Shock Spikes on you for ${PLASMA_SECONDS / 60} minutes. BG-Wiki lists the duration as over 12 minutes. This yard keeps 12 minutes and does not add an unpublished remainder. The old card's 60 seconds is not used. Damage is the Shock Spikes formula: floor((INT + 50) / 20), stopping at 15, then floor of that times (1 + Magic Attack Bonus / 100) when a hit connects. On this sheet the base is ${base}. INT is read now. Magic Attack Bonus is read on the hit. The stun rate is not published, so a stun is not rolled. It overwrites Blaze Spikes, Ice Spikes, Shock Spikes, and Reprisal. Shock Spikes overwrites it. They are the same status. Diffusion would share it. Diffusion is a locked merit, so it stays on you. A Phuabo teaches it at Blue Magic 245. No Phuabo is in the yard yet, so it is already learned. Setting it grants STR +${PLASMA_CHARGE.str} and DEX +${PLASMA_CHARGE.dex} while Blue Mage is main. It is 4 trait points of Auto Refresh. With Actinic Burst, also 4, the trait's 8 points are met and you gain 1 MP every 3 seconds. Cumulative enmity ${PLASMA_CE}, volatile enmity ${PLASMA_VE}. A spell on yourself does not claim. The motion is the blue-magic cast, then lightning bolts close around you and keep circling while Shock Spikes is up.`;
    } else if (spell.blue != null && "silence" in spell.blue) {
      effect = `Gaze Silence. The ${HARE.name} must be facing you. You do not need to face it. It does not deal damage. The duration is the Silence duration already in this yard, ${SILENCE_SECONDS} seconds, and a partial resist halves it. BG-Wiki lists 5 to 120 seconds. A 5-second floor is not added. It does not overwrite Silence. Silence overwrites it, including a Silence whose source was not stored. The magic accuracy bonus is not printed, so none is added. Blue Magic skill and dMND are rolled. The element is wind. The range box is blank, so this yard uses ${CHAOTIC_RANGE}', the range Silence uses here. A Coeurl teaches it at Blue Magic 68. No Coeurl is in the yard yet, so it is already learned. Setting it grants AGI +${CHAOTIC_EYE.agi} while Blue Mage is main. It is 4 trait points of Conserve MP. With Zephyr Mantle, also 4, the trait's 8 points and 4 set points are met and a spell sometimes costs less MP. The chance is 25%. Burst Affinity is not spent, because there is no damage to burst. Cumulative enmity ${CHAOTIC_CE}, volatile enmity ${CHAOTIC_VE}. That enmity is added only when the gaze connects, including a resist and a Silence that is already the spell's. A target that is not facing you, out of range, dead, or charmed adds none. The motion is the blue-magic cast, then a violet eye looks down the line to the target. A landed Silence also draws the gag.`;
    } else if (spell.blue != null && "mantle" in spell.blue) {
      effect = `Blink on you for ${ZEPHYR_SECONDS / 60} minutes. ${ZEPHYR_SHADOWS} shadow images. BG-Wiki prints a 7-second cast and 5 minutes. They function like Blink in this yard, not like Utsusemi: an auto-attack or Foot Kick removes one, Whirl Claws needs three, and Dust Cloud ignores them. The separate chance for a Blink shadow to miss the hit is not rolled, because Blink here is not rolled that way. It does not overwrite Utsusemi, Blink, or Aerial Armor. Those overwrite it. Its own shadows can be cast again. Diffusion would share it. Diffusion is a locked merit, so it stays on you. The duration is not passed through Enhancing Magic. A Puk teaches it at Blue Magic 196. No Puk is in the yard yet, so it is already learned. Setting it grants AGI +${ZEPHYR_MANTLE.agi} while Blue Mage is main. It is 4 trait points of Conserve MP and 2 set points. With Chaotic Eye, also 4 trait points and 2 set points, Conserve MP is 25%. Cumulative enmity ${ZEPHYR_CE}, volatile enmity ${ZEPHYR_VE}. A spell on yourself does not claim. The motion is the blue-magic cast, then wind closes into four afterimages.`;
    } else if (spell.blue != null && "cocoon" in spell.blue) {
      effect = `Defense +50% on you for ${COCOON_SECONDS} seconds. The bonus is ${COCOON.defenseNumer}/256. Protect is added to defense first, then this percent is floored once with the other defense percents. BG-Wiki says it overwrites most Defense Down. This yard's Defense Down is on the ${HARE.name}, not on you. Aegis Schism is not in the yard. Reactor Cool's Defense Boost is weaker, and this spell overwrites it. It refreshes its own Defense Boost. Gamer Escape calls the element earth and the target self. The spell list stores no element. There is no damage, so the element is not rolled. The card says Target: Single and leaves the range blank. The client row matches Zephyr Mantle: valid targets 1, area 6, range 0, so this yard casts it on you. Diffusion would share it. Diffusion is a locked merit, so it stays on you. The duration is not passed through Enhancing Magic. You are 75, so a lower-level penalty does not apply. It does not deal damage, so Chain Affinity and Burst Affinity are not spent. It does not break Mazurka. A Crawler teaches it at Blue Magic 0. No Crawler is in the yard yet, so it is already learned. Setting it grants VIT +${COCOON.vit} while Blue Mage is main. The script says Combos: None. The Defense Bonus page does not list it, so it grants no trait. A support job gets neither the VIT nor the trait. Cumulative enmity ${COCOON_CE}, volatile enmity ${COCOON_VE}. A spell on yourself does not claim. The motion is the blue-magic cast, then cream silk wraps you into a chrysalis and fades.`;
    } else if (spell.blue != null && "metal" in spell.blue) {
      const shell = metallicBodyPower(combinedSkill("Blue Magic", sheet.job, LEVEL, sheet.sub, sheet.subLevel));
      effect = `A stoneskin shell on you for ${METAL_SECONDS} seconds. Power is floor(Blue Magic skill × 0.375 + 12.5). Skill is held from 0 through 500, and the result stops at 200. On this sheet the shell is ${shell}. The script clamps the power at 150. That disagrees with the card and does not bind here, so 200 is the cap. Diffusion would lengthen it. Diffusion is a locked merit, so the duration stays ${METAL_SECONDS}. It does not overwrite Stoneskin, whether that shell is the spell or Afflatus Solace. Earthen Ward is not in the yard. Stoneskin and Afflatus Solace overwrite this shell. Casting it again refreshes it. Stoneskin+ gear is not equipped. Gamer Escape calls the element earth. There is no damage, so the element is not rolled. It does not deal damage, so Chain Affinity and Burst Affinity are not spent. It does not break Mazurka. Courier Carrie's Metallic Body is a pet weaponskill and is not this spell. A Crab teaches it at Blue Magic 0. No Crab is in the yard yet, so it is already learned. It grants no stat. It is ${METALLIC_BODY.mpTrait} trait points of Max MP Boost and ${METALLIC_BODY.points} set point. The trait needs 8 trait points and 4 set points, and tier I is +10 MP at level 40. Mysterious Light is the other half. Setting both grants Max MP Boost. This spell alone grants nothing. Summoner's Max MP Boost is a different trait. A support job gets neither. Cumulative enmity ${METAL_CE}, volatile enmity ${METAL_VE}. A spell on yourself does not claim. The motion is the blue-magic cast, then silver plates and a chrome ring close around you. It is not the crab's shell.`;
    } else if (spell.blue != null && "refuel" in spell.blue) {
      effect = `Haste on you for ${REFUEL_SECONDS / 60} minutes. The haste is 10%, stored as ${REFUEL_HASTE}/1024. White Haste is ${HASTE_NUMER}/1024. It does not overwrite Haste or Hastega, and those overwrite it, whatever the potency. Casting it again refreshes the ${REFUEL_SECONDS / 60} minutes. A Haste whose source was not stored is treated as one of the stronger ones. March is a different status and still adds. The magic haste cap stays 448/1024. It shortens melee delay and spell recast. It does not shorten cast time, raise movement speed, or change TP per hit. Archery and Marksmanship delay are not shortened. BG-Wiki says it is overwritten by, and does not overwrite, any other haste or slow, except the slow from a Pugil's Intimidate, a Crawler's Sticky Thread, and a Skeleton's Horror Cloud. None of those slows are on you. Slow, Slowga, and Spider Web are not on you either. The element is wind. The client row matches Zephyr Mantle: valid targets 1, area 6, range 0. Diffusion would share it. Diffusion is a locked merit, so it stays on you. The duration is not passed through Enhancing Magic. It does not deal damage, so Chain Affinity and Burst Affinity are not spent. It does not break Mazurka. A Cluster teaches it at Blue Magic 116. No Cluster is in the yard yet, so it is already learned. Setting it grants AGI +${REFUELING.agi} while Blue Mage is main. The script says Combos: None, so it grants no trait. A support job gets neither the AGI nor a trait. Cumulative enmity ${REFUEL_CE}, volatile enmity ${REFUEL_VE}. A spell on yourself does not claim. The motion is the blue-magic cast, then a short green wind and a fuel flare. It is not the white Haste streaks.`;
    } else if (spell.blue != null && "breeze" in spell.blue) {
      const healing = combinedSkill("Healing Magic", mainJob, LEVEL, subJob, subLv);
      const healed = healingBreezeBase(healingBreezePower(sheet.mnd, sheet.vit, healing));
      effect = `Restores HP for you and trusts within ${BREEZE_RADIUS}'. An enemy is not healed, and it does not damage undead. Power is 3×MND + VIT + 3×floor(Healing Magic ÷ 5), the same power Wild Carrot uses. Your MND is ${sheet.mnd} and your VIT is ${sheet.vit}. Healing Magic is ${healing}. Blue Mage has no Healing Magic rank, so that term is 0 unless a subjob supplies it. The table stops at a soft cap of 180. Power under 220 uses rate 0.6666 and constant −45, and the result stays between 60 and 120. Power under 460 uses rate 2 and constant 65, still between 60 and 120. Higher power uses rate 6.5 and constant 144.6666, between 60 and 180. On this sheet the heal is ${healed} before Divine Seal. A naked Hume Blue Mage 75, MND 53 and VIT 53, heals 114. Divine Seal doubles it. Day, weather, and cure potency are not applied. Majesty and Afflatus Solace do not apply. The enmity box is blank, so only the HP that lands adds cure enmity, and it does not claim. It does not break Mazurka. Burst Affinity is not spent. Diffusion would share it. Diffusion is a locked merit, so the area stays ${BREEZE_RADIUS}'. A Dhalmel teaches it at Blue Magic 20. No Dhalmel is in the yard yet, so it is already learned. Setting it grants CHR +${HEALING_BREEZE.chr} and HP +${HEALING_BREEZE.hp} while Blue Mage is main. It is 4 trait points of Auto Regen and 4 set points. With Sheep Song, also 4 trait points and 2 set points, Auto Regen is 1 HP every 3 seconds. The motion is the blue-magic cast, then mint wind rises around you and around a trust inside the area.`;
    } else if (spell.blue != null && "song" in spell.blue && spell.name === "Soporific") {
      effect = `Dark sleep on enemies within ${SOPORIFIC_RADIUS}', centered on you. It does not deal damage. An unresisted land lasts ${SOPORIFIC_SECONDS} seconds. The card, the script, and the page all print ${SOPORIFIC_SECONDS}. Sheep Song's random ${SHEEP_LOW}–${SHEEP_HIGH} is not used. A partial resist halves it. A full resist, and a quarter resist, do not land. The script's resist threshold is 0.5, so a half resist still sleeps. A 5-second floor is not added. It refreshes its own Soporific. It overwrites Sheep Song. Sleep, Sleep II, Sleepga, Sleepga II, Repose, and Lullaby overwrite it, and it does not overwrite those. Sheep Song does not overwrite it. Lullaby still does not overwrite Sheep Song. A direct hit or a heal wakes the target. The magic accuracy bonus is not printed, so none is added. Blue Magic skill and dINT are rolled. The element is dark. The script can tag a magic-burst message on Compression, Gravitation, or Darkness. There is no damage, so Burst Affinity is not spent and no burst multiplier is applied. A Flytrap teaches it at Blue Magic ${SOPORIFIC.learnSkill}. No Flytrap is in the yard yet, so it is already learned. Setting it grants HP ${SOPORIFIC.hp} and MP +${SOPORIFIC.setMp} while Blue Mage is main. It is ${SOPORIFIC.clearTrait} trait points of Clear Mind and ${SOPORIFIC.points} set points. The trait needs 8 trait points and 3 set points. With Poison Breath or Mind Blast the trait is +3 while resting. This spell alone does not grant it. A support job gets neither the stats nor the trait. Cumulative enmity ${SOPORIFIC.ce}, volatile enmity ${SOPORIFIC.ve}. That enmity is added, and the target is claimed, when the Tropical Rarab is inside the area, including a resist. A target outside the area, dead, or charmed adds none. It breaks Mazurka. The motion is the blue-magic cast, then a dark purple spore ring opens around you. A landed sleep draws purple sleep marks on the target, and those marks stay while Soporific is up.`;
    } else if (spell.blue != null && "song" in spell.blue) {
      effect = `Light sleep on enemies within ${SHEEP_RADIUS}', centered on you. It does not deal damage. An unresisted land lasts a whole second from ${SHEEP_LOW} through ${SHEEP_HIGH}. A partial resist halves it. A full resist does not land. A 5-second floor is not added. It refreshes its own Sheep Song. It does not overwrite Lullaby, and Lullaby does not overwrite it. It does not overwrite Soporific. Soporific overwrites it. Sleep, Sleep II, Sleepga, Sleepga II, and Repose overwrite it, and it does not overwrite those. A direct hit or a heal wakes the target. The magic accuracy bonus is not printed, so none is added. Blue Magic skill and dMND are rolled. The element is light. A Sheep teaches it at Blue Magic 20. No Sheep is in the yard yet, so it is already learned. Setting it grants CHR +${SHEEP_SONG.chr} and HP +${SHEEP_SONG.hp} while Blue Mage is main. It is 4 trait points of Auto Regen and 2 set points. Alone that is not Auto Regen. With Healing Breeze the trait is 1 HP every 3 seconds. Burst Affinity is not spent, because there is no damage to burst. Cumulative enmity ${SHEEP_CE}, volatile enmity ${SHEEP_VE}. That enmity is added, and the target is claimed, when the Tropical Rarab is inside the area, including a resist and a sleep that is already up. A target outside the area, dead, or charmed adds none. The motion is the blue-magic cast, then a pale light ring opens around you. A landed sleep draws light sleep marks on the target, and those marks stay while Sheep Song is up.`;
    } else if (spell.blue != null && "sand" in spell.blue) {
      const raw = sandspinRaw({ level: LEVEL, int: sheet.int, targetInt: HARE.int, burstAffinity: false });
      const hit = applyMab(Math.floor(raw), sheet.mab, 0);
      effect = `Earth damage to enemies within ${SANDSPIN_RADIUS}', centered on you. The card says Target: Single and Range 6'. The client row is an area spell with the same radius column Sheep Song uses for 6', so this yard uses ${SANDSPIN_RADIUS}', checked when the spell lands. The base is your level + 2, and it stops at ${SANDSPIN.dCap}. At 75 that term is ${SANDSPIN.dCap}. The stat term is 20% of INT times the level alpha. At 75 that alpha is 0.83. Your INT is ${sheet.int}. The hare's INT is ${HARE.int}. dINT is not halved until it passes 16, and it cannot fall under −6. The weapon-skill coefficient is 1. Azure Lore does not add to it. Burst Affinity doubles the stat term and is spent, even on a miss or when nobody is in the area. A matching skillchain shows Magic Burst on the target. Earth matches Scission, Gravitation, Darkness, and Umbra. Two weapon skills multiply the hit by 1.35. Each further weapon skill adds 0.10. Day, weather, staff, affinity, SDT, Ebullience, Convergence, and ecosystem correlation are not applied. Magic Attack Bonus is applied after the resist floor. On this sheet, before a resist and without Burst Affinity, the hit is ${hit}. A resist can cut it to 1/2, 1/4, or 1/8. 1/8 is not zero. Accuracy Down is −${SANDSPIN_ACC} for ${SANDSPIN_SECONDS} seconds. The script's 60 seconds is not used. It is a second roll. A full resist on that roll does not land it. A half resist lasts ${Math.floor(SANDSPIN_SECONDS / 2)} seconds, and the −${SANDSPIN_ACC} stays. Damage of 0 skips it. It does not overwrite Flash, and Flash does not overwrite it. Both cut accuracy. The enmity box is blank, and the client row stores 0 and 0. A hare inside the area is claimed. No fixed hate is added. It breaks Mazurka. A Worm teaches it at Blue Magic 0. No Worm is in the yard yet, so it is already learned. Setting it grants VIT +${SANDSPIN.vit} while Blue Mage is main. The script says Combos: None, so it grants no trait. A support job gets neither the VIT nor a trait. The motion is the blue-magic cast, then a brown sand cyclone around you. A landed Accuracy Down leaves grit on the target.`;
    } else if (spell.blue != null && "orb" in spell.blue && spell.name === "Cursed Sphere") {
      const raw = blueOrbRaw({ name: "Cursed Sphere", level: LEVEL, int: sheet.int, targetInt: HARE.int, burstAffinity: false });
      const hit = applyMab(Math.floor(raw), sheet.mab, 0);
      effect = `Water damage around the enemy you aimed at, range ${CURSED_SPHERE.range}'. The splash is centered on that enemy, not on you. The base is your level + 2, and it stops at ${CURSED_SPHERE.dCap}. At 75 that term is ${CURSED_SPHERE.dCap}. The stat term is 30% of INT times the level alpha. At 75 that alpha is 0.83. Your INT is ${sheet.int}. The hare's INT is ${HARE.int}. dINT is not halved until it passes ${CURSED_SPHERE.half}, and it cannot fall under ${CURSED_SPHERE.low}. The coefficient is ${CURSED_SPHERE.ftp}. Azure Lore adds nothing to it and does not open a magic burst. Burst Affinity doubles the stat term and is spent, even on a miss or when the target is out of range. Water matches Reverberation, Distortion, Darkness, and Umbra. Two weapon skills multiply the hit by 1.35. Each further weapon skill adds 0.10. Day, weather, staff, affinity, SDT, Ebullience, Convergence, and ecosystem correlation are not applied. Magic Attack Bonus is applied after the resist floor. On this sheet, before a resist and without Burst Affinity, the hit is ${hit}. A resist can cut it to 1/2, 1/4, or 1/8. 1/8 is not zero. No additional status. The current card and the script header are ${CURSED_SPHERE.cast} seconds to cast and ${CURSED_SPHERE.recast} seconds to recast. The enmity box is blank. A hare in range is claimed. No fixed hate is added. A connecting hit gives the hare 100 TP. It breaks Mazurka. A Fly teaches it at Blue Magic ${CURSED_SPHERE.learnSkill}. No Fly is in the yard yet, so it is already learned. Setting it grants MND +${CURSED_SPHERE.mnd} while Blue Mage is main. It is 4 trait points of Magic Attack Bonus and 2 set points. With Memento Mori, or with Sound Blast, the trait is +20. This spell alone does not grant it. A support job gets neither the MND nor the trait. The motion is the blue-magic cast, then a dark water orb travels to the target and bursts.`;
    } else if (spell.blue != null && "orb" in spell.blue && spell.name === "Blastbomb") {
      const raw = blueOrbRaw({ name: "Blastbomb", level: LEVEL, int: sheet.int, targetInt: HARE.int, burstAffinity: false });
      const hit = applyMab(Math.floor(raw), sheet.mab, 0);
      effect = `Fire damage around the enemy you aimed at, range ${BLASTBOMB.range}'. Additional effect: Bind. The splash is centered on that enemy. It bypasses shadow images. The hare has none, so that bypass is not rolled. The base is your level + 2, and it stops at ${BLASTBOMB.dCap}. The stat term is 20% of INT times the level alpha, doubled while Burst Affinity is up. Your INT is ${sheet.int}. The hare's INT is ${HARE.int}. dINT is not halved until it passes ${BLASTBOMB.half}, and it cannot fall under ${BLASTBOMB.low}. The coefficient is ${BLASTBOMB.ftp}. Azure Lore adds nothing and does not open a magic burst. Burst Affinity is spent even on a miss or when the target is out of range. Fire matches Liquefaction, Fusion, Light, and Radiance. Day, weather, staff, affinity, SDT, Ebullience, and Convergence are not applied. Magic Attack Bonus is applied after the resist floor. On this sheet, before a resist and without Burst Affinity, the hit is ${hit}. Bind is ${BLAST_BIND} seconds. The card leaves the duration blank. The script stores ${BLAST_BIND}. Damage lands first and removes a Bind already up. The new Bind is a second resist, attempted after that, so a land refreshes it. A full resist on the damage skips the Bind. A half resist shortens the ${BLAST_BIND} seconds. The script says Combos: None. The enmity box is blank. A hare in range is claimed. A connecting hit gives the hare 100 TP. It breaks Mazurka. An Orcish Warmachine teaches it at Blue Magic ${BLASTBOMB.learnSkill}. None is in the yard yet, so it is already learned. Setting it grants STR +${BLASTBOMB.str} while Blue Mage is main. A support job gets neither the STR nor a trait. The motion is the blue-magic cast, then an orange fireball lobs onto the target. A landed Bind draws ice chains.`;
    } else if (spell.blue != null && "orb" in spell.blue && spell.name === "Bomb Toss") {
      const raw = blueOrbRaw({ name: "Bomb Toss", level: LEVEL, int: sheet.int, targetInt: HARE.int, burstAffinity: false });
      const hit = applyMab(Math.floor(raw), sheet.mab, 0);
      effect = `Fire damage around the enemy you aimed at, range ${BOMB_TOSS.range}'. The splash is centered on that enemy, not on you. BG-Wiki prints 4 seconds to cast and 25 to recast. The script header is ${BOMB_TOSS.cast} and ${BOMB_TOSS.recast}, and this yard uses those. The base is your level + 2, and it stops at ${BOMB_TOSS.dCap}. At 75 that term is ${BOMB_TOSS.dCap}. The stat term is 20% of INT times the level alpha, doubled while Burst Affinity is up. At 75 that alpha is 0.83. Your INT is ${sheet.int}. The hare's INT is ${HARE.int}. The script does not set a half cap or a floor, so dINT is not halved until it passes ${BOMB_TOSS.half}, and it cannot fall under ${BOMB_TOSS.low}. The coefficient is ${BOMB_TOSS.ftp}. Azure Lore adds nothing and does not open a magic burst. Burst Affinity doubles the INT term and is spent, even on a miss or when the target is out of range. Fire matches Liquefaction, Fusion, Light, and Radiance. Two weapon skills multiply the hit by 1.35. Each further weapon skill adds 0.10. Day, weather, staff, affinity, SDT, Ebullience, Convergence, and ecosystem correlation are not applied. Magic Attack Bonus is applied after the resist floor. On this sheet, before a resist and without Burst Affinity, the hit is ${hit}. A resist can cut it to 1/2, 1/4, or 1/8. 1/8 is not zero. No additional status. The script says Combos: None. The enmity box is blank. A hare in range is claimed. A connecting hit gives the hare 100 TP. It breaks Mazurka. A Goblin teaches it at Blue Magic ${BOMB_TOSS.learnSkill}. No Goblin is in the yard yet, so it is already learned. Setting it grants STR +${BOMB_TOSS.str} while Blue Mage is main. It grants no trait. A support job gets neither the STR nor a trait. The motion is the blue-magic cast, then a dark bomb with a fuse lobs in a high arc onto the target and bursts into orange shards. It does not draw bind chains.`;
    } else if (spell.blue != null && "breath" in spell.blue && spell.name === "Magnetite Cloud") {
      const raw = Math.floor(magnetiteCloudRaw(sheet.hp, LEVEL));
      effect = `Earth breath in a fan in front of you, ${MAGNETITE_CLOUD.range}' long and ${BLUE_CONE}° each side of where you are facing. Additional effect: Weight. The range box is blank. The client stores 120 and 50, the same columns Poison Breath uses, so this yard uses that spell's ${MAGNETITE_CLOUD.range}' fan. The page multiplies (HP / ${MAGNETITE_CLOUD.hpMod}) by (level / ${MAGNETITE_CLOUD.lvlMod}). The script adds them, the same way Poison Breath adds its two terms. On this sheet that is ${raw} before a resist. Magic Attack Bonus is not applied. Day, weather, staff, affinity, and breath damage dealt are not applied. Beastmen would take 25% more. The Tropical Rarab is not Beastmen, so that bonus is not rolled. Burst Affinity can magic burst it. Earth matches Scission, Gravitation, Darkness, and Umbra. Azure Lore does not open the window and does not change the breath. Burst Affinity is spent even on a miss or when the target is outside the fan. Weight is the Gravity status. The script's power is ${MAGNETITE_CLOUD.weight} and the duration is ${MAGNETITE_CLOUD.weightSeconds}. The page's 30–120 and about −26% are not used. It is attempted only when the breath deals damage. A quarter resist does not weigh the target down. A half resist shortens the ${MAGNETITE_CLOUD.weightSeconds}. The second roll has no attribute, because a breath additional effect sets the stat to 0. The element is earth. It refreshes Gravity, including Mysterious Light's Weight and the black-magic Gravity spell. The enmity box is blank. A hare in the fan is claimed. A connecting hit gives the hare 100 TP. It breaks Mazurka. An Antica teaches it at Blue Magic ${MAGNETITE_CLOUD.learnSkill}. No Antica is in the yard yet, so it is already learned. Setting it grants VIT +${MAGNETITE_CLOUD.vit} while Blue Mage is main. It is 4 trait points of Magic Defense Bonus and 3 set points. The trait needs 8 trait points and 6 set points, and tier I is level 50. Ice Break is the other half. Setting both grants Magic Defense Bonus +10 at Blue Mage 50. This spell alone does not grant it. A support job gets neither the VIT nor the trait. The motion is the blue-magic cast, then iron grit and gold flakes fan out from you. A landed Weight uses the Gravity rings.`;
    } else if (spell.blue != null && "breath" in spell.blue && spell.name === "Poison Breath") {
      const raw = Math.floor(poisonBreathRaw(sheet.hp, LEVEL));
      effect = `Water breath in a fan in front of you, ${POISON_BREATH_RANGE}' long and ${BLUE_CONE}° each side of where you are facing. Additional effect: Poison. The range box is blank. This yard uses ${POISON_BREATH_RANGE}'. Gamer Escape and the script header are ${POISON_BREATH.cast} seconds to cast and ${POISON_BREATH.recast} seconds to recast. The 2022 card's 00:00:05 and 00:01:00 use the monster-timer layout and are not the player spell. Damage is current HP / ${POISON_BREATH.hpMod} + main level / ${POISON_BREATH.lvlMod}. On this sheet that is ${raw} before a resist. Magic Attack Bonus is not applied. Day, weather, staff, affinity, and breath damage dealt are not applied. Arcana would take 25% more. The Tropical Rarab is not Arcana, so that bonus is not rolled. Burst Affinity can magic burst it. Water matches Reverberation, Distortion, Darkness, and Umbra. The older note that a magic burst only raises accuracy is not used. Azure Lore does not open the window and does not change the breath. Burst Affinity is spent even on a miss or when the target is outside the fan. Poison is ${POISON_BREATH_DOT} HP every 3 seconds. The card prints ${POISON_BREATH_SECONDS} seconds. The script's 60 is not used. The poison is attempted only when the breath deals damage. A full resist on that second roll does not poison. A half resist shortens the ${POISON_BREATH_SECONDS} seconds. A stronger poison is left alone. The enmity box is blank. A hare in the fan is claimed. A connecting hit gives the hare 100 TP. It breaks Mazurka. A Hound teaches it at Blue Magic ${POISON_BREATH.learnSkill}. No Hound is in the yard yet, so it is already learned. Setting it grants MND +${POISON_BREATH.mnd} while Blue Mage is main. It is 4 trait points of Clear Mind and 1 set point. With Mind Blast or Soporific the trait is +3 while resting. This spell alone does not grant it. A support job gets neither the MND nor the trait. The motion is the blue-magic cast, then a green-purple mist fans out from you. A landed poison leaves bubbles on the target.`;
    } else if (spell.blue != null && "sound" in spell.blue) {
      effect = `Fire INT Down on enemies within ${SOUND_RADIUS}', centered on you. It does not deal damage. An unresisted land is INT −${SOUND_INT} for ${SOUND_SECONDS} seconds. The potency does not tick. A half resist shortens the ${SOUND_SECONDS}. A full resist, and a quarter resist, do not land. The script's resist threshold is 0.5, so a half resist still lands. It refreshes its own INT Down. Magic accuracy is Blue Magic skill plus dINT. The element is fire. The script can tag a magic-burst message on Liquefaction, Fusion, or Light. There is no damage, so Burst Affinity is not spent. The card's range is ${SOUND_RADIUS}'. The client stores 50 and 50, the same columns Sheep Song uses for 6'. Cumulative enmity ${SOUND_CE}, volatile ${SOUND_VE}, when the hare is in the area, including a resist. A land or a resist in range claims. It breaks Mazurka. Chain Affinity is not spent. A Cockatrice teaches it at Blue Magic ${SOUND_BLAST.learnSkill}. No Cockatrice is in the yard yet, so it is already learned. It grants no stat bonus. It is 4 trait points of Magic Attack Bonus and 1 set point. With Cursed Sphere, or with Memento Mori, the trait is +20. Alone it is not. A support job gets neither the trait nor a cast. The motion is the blue-magic cast, then dusty gold sound rings open around you. A landed INT Down marks the hare. It is not a fireball.`;
    } else if (spell.blue != null && "ray" in spell.blue) {
      const raw = deathRayRaw({ level: LEVEL, int: sheet.int, mnd: sheet.mnd, targetInt: HARE.int, burstAffinity: false, azureLore: false });
      const hit = applyMab(Math.floor(raw), sheet.mab, 0);
      effect = `One dark hit at ${DEATH_RAY_RANGE}'. The range box is blank. The client stores 120 where Wild Carrot stores 200, and this yard treats that 200 as 20', so this spell uses ${DEATH_RAY_RANGE}'. The card prints recast 30. The script header and the spell list store ${DEATH_RAY.recast}. This yard uses ${DEATH_RAY.recast}. The base is your level + 2, and it stops at ${DEATH_RAY.dCap}. At 75 that term is ${DEATH_RAY.dCap}. The stat term is 20% of INT plus 10% of MND, times the level alpha. Those percents are not floored before the alpha. At 75 that alpha is 0.83. Your INT is ${sheet.int} and your MND is ${sheet.mnd}. The hare's INT is ${HARE.int}. dINT is not halved until it passes ${DEATH_RAY.half}, and it cannot fall under ${DEATH_RAY.low}. The coefficient is ${DEATH_RAY_FTP}. Azure Lore adds ${DEATH_RAY_AZURE} to it, so the coefficient becomes ${DEATH_RAY_FTP + DEATH_RAY_AZURE}. It does not replace ${DEATH_RAY_FTP}, it does not open a magic burst, and it is not consumed. Burst Affinity doubles the stat term and is spent, even on a miss or when the target is out of range. Dark matches Compression, Gravitation, Darkness, and Umbra. Two weapon skills multiply the hit by 1.35. Each further weapon skill adds 0.10. Day, weather, staff, affinity, SDT, Ebullience, Convergence, and ecosystem correlation are not applied. Magic Attack Bonus is applied after the resist floor. On this sheet, before a resist and without Burst Affinity or Azure Lore, the hit is ${hit}. A resist can cut it to 1/2, 1/4, or 1/8. 1/8 is not zero. No additional status. The script says Combos: None. The enmity box is blank. The cast claims, and the damage adds its own enmity. It breaks Mazurka. A Hecteyes teaches it at Blue Magic ${DEATH_RAY.learnSkill}. No Hecteyes is in the yard yet, so it is already learned. Setting it grants HP −5 and MP +${DEATH_RAY.setMp} while Blue Mage is main. A support job gets neither. The motion is the blue-magic cast, then a dark purple beam strikes the target.`;
    } else if (spell.blue != null && "digest" in spell.blue) {
      const raw = digestRaw(combinedSkill("Blue Magic", mainJob, LEVEL, subJob, subLv));
      effect = `Dark HP drain at ${DIGEST_RANGE}'. Not the black-magic Drain spell. The range box is blank. The client stores 30, and this yard reads that as ${DIGEST_RANGE}'. The script header and the card say recast ${DIGEST.recast}. The spell list's 26 and Windower's 26 are not used, the same way Soporific kept the card. Damage is floor(floor(Blue Magic skill × 0.11) × ${DIGEST.dmgMult}). On this sheet that is ${raw} before a resist. The page's skill × 0.55 is the unfloored form and is not used. There is no stat term and no damage cap. INT does not add magic accuracy. Magic accuracy is Blue Magic skill alone. The element is dark. Undead take nothing. The Tropical Rarab is a beast, so the drain works. Resist, then a magic burst, then Magic Attack Bonus. Burst Affinity opens a dark magic burst and does not double anything. It is spent even on a miss, when the target is out of range, and on the undead no-effect. Dark matches Compression, Gravitation, Darkness, and Umbra. Azure Lore does not open the window. You heal the HP that lands, clamped to the hare's current HP and then to your missing HP. Cumulative enmity ${DIGEST_CE}, volatile ${DIGEST_VE}, when the hare is in range, including a resist and the undead no-effect. It breaks Mazurka. A Slime teaches it at Blue Magic ${DIGEST.learnSkill}. No Slime is in the yard yet, so it is already learned. Setting it grants HP −5 and MP +${DIGEST.setMp} while Blue Mage is main. The script says Combos: None. A support job gets neither. The motion is the blue-magic cast, then green and purple slime pulls HP from the hare to you. The damage shows on the hare and the HP gained shows on you.`;
    } else if (spell.blue != null && "kiss" in spell.blue) {
      const raw = kissRaw(combinedSkill("Blue Magic", mainJob, LEVEL, subJob, subLv));
      effect = `Dark MP drain at ${MP_DRAINKISS.range}'. Not the black-magic Aspir spell, and not Magic Hammer. The range box is blank. The client stores 30, so this yard uses ${MP_DRAINKISS.range}'. The amount is floor(floor(Blue Magic skill × 0.11) × ${MP_DRAINKISS.dmgMult}), then a soft cap of ${MP_DRAINKISS.cap} before a resist or a magic burst. On this sheet that is ${raw} before a resist. Day, weather, and staff are not applied. INT does not add magic accuracy and is not a modifier. Magic Attack Bonus does not increase it. Magic accuracy is Blue Magic skill alone. The element is dark. You cannot take more MP than the target has. The Tropical Rarab has ${HARE.mp} MP, so the steal is 0 and the log says it has no MP. Undead take nothing. The hare is not undead. Resist, then a magic burst. Burst Affinity opens a dark magic burst and does not double a stat term. It is spent even on a miss, when the target is out of range, and on the undead no-effect. Dark matches Compression, Gravitation, Darkness, and Umbra. Azure Lore does not open the window and is not consumed. You recover the MP that lands, clamped to your missing MP. Cumulative enmity ${MP_DRAINKISS.ce}, volatile ${MP_DRAINKISS.ve}, when the hare is in range, alive, and not a pet, including a resist and the undead no-effect. It breaks Mazurka. A Leech teaches it at Blue Magic ${MP_DRAINKISS.learnSkill}. No Leech is in the yard yet, so it is already learned. Setting it grants MP +${MP_DRAINKISS.setMp} while Blue Mage is main. The script says Combos: None. A support job gets neither the MP nor a cast. The motion is the blue-magic cast, then a violet heart crosses to the target. Stolen MP rides back as purple motes. Nothing rides back when the hare has no MP.`;
    } else if (spell.blue != null && "blitz" in spell.blue) {
      const raw = blitzRaw({ level: LEVEL, int: sheet.int, mnd: sheet.mnd, targetInt: HARE.int, burstAffinity: false });
      const hit = applyMab(Math.floor(raw), sheet.mab, 0);
      effect = `One lightning hit at ${BLITZSTRAHL.range}'. The card prints 13. The client stores 120, the same column Death Ray uses for 12', so this yard uses ${BLITZSTRAHL.range}'. Additional effect: Stun. The base is your level + 2, and it stops at ${BLITZSTRAHL.dCap}. At 75 that term is ${BLITZSTRAHL.dCap}. The stat term is 30% of INT plus 10% of MND, times the level alpha. Those percents are not floored before the alpha. At 75 that alpha is 0.83. Your INT is ${sheet.int} and your MND is ${sheet.mnd}. The hare's INT is ${HARE.int}. dINT is multiplied by 1. The script does not set a half cap or a floor, so anything above ${BLITZSTRAHL.half} counts for half, and the term cannot fall under ${BLITZSTRAHL.low}. The coefficient is ${BLITZSTRAHL.ftp}. The script sets no Azure bonus, so Azure Lore leaves it at ${BLITZSTRAHL.ftp}. It does not open a magic burst and is not consumed. Burst Affinity doubles the stat term and is spent, even on a miss or when the target is out of range. Lightning matches Impaction, Fragmentation, Light, and Radiance. Two weapon skills multiply the hit by 1.35. Each further weapon skill adds 0.10. Day, weather, staff, affinity, SDT, Ebullience, and ecosystem correlation are not applied. Magic Attack Bonus is applied after the resist floor. On this sheet, before a resist and without Burst Affinity, the hit is ${hit}. A resist can cut it to 1/2, 1/4, or 1/8. 1/8 is not zero. Stun is ${BLITZSTRAHL.stun} seconds and is attempted only when the hit deals damage. A quarter resist does not stun. A half resist shortens the ${BLITZSTRAHL.stun}. The element of that second roll is thunder, and the stat is INT. It refreshes a Stun already up. A connecting hit interrupts a spell the hare has started. The enmity box is blank. The cast claims, and the damage adds its own enmity. It breaks Mazurka. A Doll teaches it at Blue Magic ${BLITZSTRAHL.learnSkill}. No Doll is in the yard yet, so it is already learned. Setting it grants DEX +${BLITZSTRAHL.dex} while Blue Mage is main. The script says Combos: None. A support job gets neither the DEX nor a trait. The motion is the blue-magic cast, then a white lightning ray strikes the target. A landed stun draws the thunder cross.`;
    } else if (spell.blue != null && "gas" in spell.blue) {
      effect = `Wind VIT Down on enemies within ${STINKING_GAS.radius}', centered on you. It does not deal damage. An unresisted land is VIT −${STINKING_GAS.vitDown} for ${STINKING_GAS.seconds} seconds. The potency does not tick. Wild Oats is the same status and does tick, so this spell overwrites that decay, and Wild Oats overwrites this one. A half resist shortens the ${STINKING_GAS.seconds}. A full resist, and a quarter resist, do not land. The script's resist threshold is 0.5, so a half resist still lands. It refreshes its own VIT Down. Magic accuracy is Blue Magic skill plus dINT. The element is wind. The script can tag a magic-burst message on Detonation, Fragmentation, or Light. There is no damage, so Burst Affinity is not spent. The area is the card's ${STINKING_GAS.radius}'. The client stores 50 and 50, the same columns Sheep Song uses for 6'. Cumulative enmity ${STINKING_GAS.ce}, volatile ${STINKING_GAS.ve}, when the hare is in the area, including a resist. A land or a resist in range claims. It breaks Mazurka. Chain Affinity is not spent. A Doomed teaches it at Blue Magic ${STINKING_GAS.learnSkill}. No Doomed is in the yard yet, so it is already learned. Setting it grants AGI +${STINKING_GAS.agi} while Blue Mage is main. It is 1 trait point of Auto Refresh and 2 set points. The trait needs 8 trait points and 8 set points. With Actinic Burst or Plasma Charge it is still short. Those two already grant it, and adding this spell does not raise the tier. A support job gets neither the AGI nor the trait. The motion is the blue-magic cast, then a low yellow-green cloud opens around you. A landed Vitality Down wilts, and it does not lose a point every 6 seconds.`;
    } else if (spell.blue != null && "geist" in spell.blue) {
      effect = `Dark dispel in a ${GEIST_WALL.radius}' area centered on you. It removes one beneficial magic effect. It is not a gaze. The target does not have to face you, and you do not have to face the target. It does not deal damage. The ${HARE.name} has no beneficial effect, so a connecting cast still has nothing to remove. Magic accuracy is Blue Magic skill plus dINT. The element is dark. A half resist still dispels. A full resist, and a quarter resist, do not. The script can magic burst on Compression, Gravitation, and Darkness. There is nothing to multiply, so Burst Affinity is not spent. Cumulative enmity ${GEIST_WALL.ce}, volatile ${GEIST_WALL.ve}, when the hare is in the area, including a resist. A hare outside, dead, or charmed adds none. It breaks Mazurka. An Eft teaches it at Blue Magic ${GEIST_WALL.learnSkill}. No Eft is in the yard yet, so it is already learned. Setting it grants HP −5 and MP +${GEIST_WALL.setMp} while Blue Mage is main. The script says Combos: None. A support job gets neither. The motion is the blue-magic cast, then dark purple panels open in a ring around you. It is not Blank Gaze's pale eye.`;
    } else if (spell.blue != null && "awful" in spell.blue) {
      effect = `Water gaze. STR Down in a fan in front of you, ${AWFUL_EYE.range}' long and ${BLUE_CONE}° each side of where you are facing. The card leaves the range blank. A blank cone in this yard is Poison Breath's fan. The target must be facing you, and you must be facing the target. A gaze from behind does not land. It does not deal damage. An unresisted land is STR −${AWFUL_EYE.strDown} for ${AWFUL_EYE.seconds} seconds. It loses 1 STR every ${AWFUL_EYE.tick} second. STR cannot fall under 0. A half resist shortens the ${AWFUL_EYE.seconds}. A full resist, and a quarter resist, do not land. It refreshes its own STR Down. It does not touch Bubble Shower. Magic accuracy is Blue Magic skill plus dMND. The element is water. Burst Affinity is not spent. Cumulative enmity ${AWFUL_EYE.ce}, volatile ${AWFUL_EYE.ve}, when the gaze connects, including a resist. A target behind you, outside the fan, dead, or charmed adds none. It breaks Mazurka. A Bugard teaches it at Blue Magic ${AWFUL_EYE.learnSkill}. No Bugard is in the yard yet, so it is already learned. Setting it grants MND +${AWFUL_EYE.mnd} while Blue Mage is main. It is ${AWFUL_EYE.clearTrait} trait points of Clear Mind and ${AWFUL_EYE.points} set points. With Poison Breath, Venom Shell, Mind Blast, or Soporific, Clear Mind is +3 while resting. This spell alone does not grant it. A support job gets neither the MND nor the trait. The motion is the blue-magic cast, then a sickly water-green eye opens and a cyan cone leaves your face. A landed STR Down draws red shrinking marks on the hare.`;
    } else if (spell.blue != null && "saber" in spell.blue) {
      const raw = saberRaw(combinedSkill("Blue Magic", mainJob, LEVEL, subJob, subLv));
      effect = `Dark HP drain in a ${BLOOD_SABER.radius}' area centered on you. Ineffective against undead. The current card is ${BLOOD_SABER.mp} MP and recast ${BLOOD_SABER.recast}. The script header's 25 MP and the older client recast of 26 are not used. The card leaves the range blank. Geist Wall prints ${GEIST_WALL.radius}' for a self-centered dark area, so this yard uses ${BLOOD_SABER.radius}'. Damage is floor(floor(Blue Magic skill × 0.11) × ${BLOOD_SABER.dmgMult}). The helper's damage cap is 0, so the 165 cap on MP Drainkiss is not applied. On this sheet that is ${raw} before a resist. There is no stat term. INT does not add magic accuracy. Magic accuracy is Blue Magic skill alone. Day, weather, staff, affinity, and ecosystem correlation are not applied. Resist, then a magic burst, then Magic Attack Bonus. Burst Affinity opens a dark magic burst and does not double a stat term. It is spent even on a miss, when nobody is in the area, and on the undead no-effect. Azure Lore does not open the window. You heal the HP that lands, clamped to the hare's current HP and then to your missing HP. Cumulative enmity ${BLOOD_SABER.ce}, volatile ${BLOOD_SABER.ve}, when the hare is in the area, including a resist and the undead no-effect. It breaks Mazurka. A Skeleton teaches it at Blue Magic ${BLOOD_SABER.learnSkill}. No Skeleton is in the yard yet, so it is already learned. Setting it grants HP −5 and MP +${BLOOD_SABER.setMp} while Blue Mage is main. The script says Combos: None. A support job gets neither. The motion is the blue-magic cast, then red crescent slashes orbit you. Crimson orbs ride from the hare to you only when HP was gained.`;
    } else if (spell.blue != null && "jetta" in spell.blue) {
      effect = `Dark gaze. Terror in a fan in front of you, ${JETTATURA.range}' long and ${BLUE_CONE}° each side of where you are facing. The target must be facing you, and you must be facing the target. It does not deal damage. An unresisted land is Terror for ${JETTATURA.seconds} seconds. The card prints about 2. The script stores 5. This yard uses ${JETTATURA.seconds}. A half resist shortens it. A full resist, and a quarter resist, do not terrify. Terror stops the hare the way Stun does, and a land interrupts a spell the hare has started. Magic accuracy is Blue Magic skill plus dINT. The element is dark. Burst Affinity is not spent. Enmity is added even when the terror resists, if the target was in the fan and facing you. Cumulative enmity ${JETTATURA.ce}, volatile ${JETTATURA.ve}. A target behind you, outside the fan, dead, or charmed adds none. It breaks Mazurka. A Hippogryph teaches it at Blue Magic ${JETTATURA.learnSkill}. No Hippogryph is in the yard yet, so it is already learned. Setting it grants MP +${JETTATURA.setMp} while Blue Mage is main. The script says Combos: None. A support job gets neither. The motion is the blue-magic cast, then a larger dark-violet eye flashes white-violet and a short fear cone leaves your face. A landed Terror freezes a ring on the hare. It is not Blank Gaze and it is not Chaotic Eye.`;
    } else if (spell.blue != null && "ice" in spell.blue) {
      const raw = iceBreakRaw({ level: LEVEL, int: sheet.int, targetInt: HARE.int, burstAffinity: false });
      const hit = applyMab(Math.floor(raw), sheet.mab, 0);
      effect = `Ice damage in a ${ICE_BREAK.radius}' area centered on you. Additional effect: Bind. It is not a fan. The card leaves the range blank. The self-centered blue areas this yard already reads as 6' are the shape. The card prints a 5 second cast. The client and the script header store ${ICE_BREAK.cast}. This yard uses ${ICE_BREAK.cast}. The base is your level + 2, and it stops at ${ICE_BREAK.dCap}. At 75 that term is ${ICE_BREAK.dCap}. The stat term is 30% of INT times the level alpha. At 75 that alpha is 0.83. Your INT is ${sheet.int}. The hare's INT is ${HARE.int}. Burst Affinity doubles that term and is spent, even on a miss or when nobody is in the area. dINT is multiplied by 1. Anything above ${ICE_BREAK.half} counts for half, and the term cannot fall under ${ICE_BREAK.low}. The coefficient is ${ICE_BREAK.ftp}. Azure Lore does not change it and does not open a magic burst. Ice matches Induration, Distortion, Darkness, and Umbra. Day, weather, staff, affinity, and ecosystem correlation are not applied. Magic Attack Bonus is applied after the resist floor. On this sheet, before a resist and without Burst Affinity, the hit is ${hit}. Bind is ${ICE_BREAK.bind} seconds. Damage lands first and removes a Bind already up. The new Bind is a second resist, attempted only when the hit dealt damage. A half resist shortens the ${ICE_BREAK.bind}. A quarter resist does not bind. The element of that roll is ice. The enmity box is blank. A hare inside the area is claimed. A connecting hit gives the hare 100 TP. It breaks Mazurka. A Golem teaches it at Blue Magic ${ICE_BREAK.learnSkill}. No Golem is in the yard yet, so it is already learned. Setting it grants INT +${ICE_BREAK.int} while Blue Mage is main. It is ${ICE_BREAK.mdbTrait} trait points of Magic Defense Bonus and ${ICE_BREAK.points} set points. With Magnetite Cloud the trait is +10 at Blue Mage 50. Neither spell grants it alone. A support job gets neither the INT nor the trait. The motion is the blue-magic cast, then ice shards erupt in a ring and a frost ring opens on the ground. A landed Bind draws ice chains on the hare.`;
    } else if (spell.blue != null && "destruct" in spell.blue) {
      const raw = selfDestructRaw(sheet.hp);
      effect = `Fire damage in a ${SELF_DESTRUCT.radius}' area centered on you. It is not a fan. The card leaves the range blank. This yard uses the same 6' as Ice Break. Damage before a resist is your current HP − 1. At full HP on this sheet that is ${raw}. If you are already at 1 HP, nothing happens: no damage, no Weakness, and your HP does not change. The hit resists with Blue Magic skill and dINT. Burst Affinity can magic burst it. Fire matches Liquefaction, Fusion, Light, and Radiance. Magic Attack Bonus, day, weather, and staff are not applied. The wiki line that the damage seems affected by nothing else is why those stay out. A resist still cuts the hit, which is the tested retail behavior. Azure Lore does not open the window. Burst Affinity is spent even on a miss, when the hare is outside the area, when it is a pet, when it is dead, and when you were already at 1 HP. If you had more than 1 HP, your current HP becomes 1 and Weakness lasts ${WEAKNESS_SECONDS} seconds even when the hare is out of range, dead, charmed, or the hit resists. The script deletes Weakness and adds it again, so a doubled Weakness from Raise becomes a normal Weakness and the five minutes start over. It does not use the raise rule that doubles Weakness. Your maximum HP is not cut while you are alive. Only weapon delay doubles, the same 100% Slow Weakness already uses. The enmity box is blank. A hare inside the area is claimed. A connecting hit gives the hare 100 TP. It breaks Mazurka. A Bomb teaches it at Blue Magic ${SELF_DESTRUCT.learnSkill}. No Bomb is in the yard yet, so it is already learned. Setting it grants STR +${SELF_DESTRUCT.str} while Blue Mage is main. It is ${SELF_DESTRUCT.refreshTrait} trait points of Auto Refresh and ${SELF_DESTRUCT.points} set points. The trait needs 8 trait points and 8 set points. This spell alone does not grant it. With Frightful Roar and Actinic Burst it does. A support job gets neither the STR nor the trait. The motion is the blue-magic cast, then an orange blast and a shock ring open on you, even if the hare is out of range.`;
    } else if (spell.blue != null && "roar" in spell.blue) {
      effect = `Wind Defense Down on enemies within ${FRIGHTFUL_ROAR.radius}', centered on you. It is not a fan and it does not deal damage. An unresisted land cuts defense by 26/256, about 10%, for ${FRIGHTFUL_ROAR.seconds} seconds. The script's power is 10. A Defense Down with no stored power is 25%, and Jump's is 20%. Both are stronger, so they stay. An equal or weaker cut is replaced. The potency does not tick. A half resist shortens the ${FRIGHTFUL_ROAR.seconds}. A full resist, and a quarter resist, do not land. The script's resist threshold is 0.5. Magic accuracy is Blue Magic skill plus dINT. The element is wind. The script can tag a magic-burst message on Detonation, Fragmentation, or Light. There is no damage, so Burst Affinity is not spent. Cumulative enmity ${FRIGHTFUL_ROAR.ce}, volatile ${FRIGHTFUL_ROAR.ve}, when the hare is in the area, including a resist. It breaks Mazurka. A Taurus teaches it at Blue Magic ${FRIGHTFUL_ROAR.learnSkill}. No Taurus is in the yard yet, so it is already learned. Setting it grants AGI +${FRIGHTFUL_ROAR.agi} while Blue Mage is main. It is ${FRIGHTFUL_ROAR.refreshTrait} trait points of Auto Refresh and ${FRIGHTFUL_ROAR.points} set points. With Self-Destruct and Actinic Burst the trait is 1 MP every 3 seconds. This spell alone does not grant it. A support job gets neither the AGI nor the trait. The motion is the blue-magic cast, then brown and green sound rings open around you. It is not a cone.`;
    } else if (spell.blue != null && "cold" in spell.blue) {
      const frost = coldWaveFrost(LEVEL);
      effect = `Ice Frost on enemies within ${COLD_WAVE.radius}', centered on you. The header calls it a fan of ice damage. The script deals no hit, and the area is not a cone, so this yard does not draw one. Frost cannot land while Burn is up. A cast removes Choke. Burn and Choke are not otherwise in the yard. An unresisted land lasts ${COLD_WAVE.seconds} seconds. A half resist shortens it. A full resist, and a quarter resist, do not land. The script's resist threshold is 0.5. The status power the script passes is the damage over time. AGI down is (power − 1) × 2 + 5. The damage over time is clamp(floor((level / 2 − 3) / 2), 0, 23), and level / 2 stops at 49. At 75 that is ${frost.dot} HP every 3 seconds and AGI −${frost.agi}. Regen down equals that damage over time. The Tropical Rarab has no regen, so regen down is not applied. Magic accuracy is Blue Magic skill plus dINT. The element is ice. There is no direct hit, so Burst Affinity is not spent. Ice would match Induration, Distortion, Darkness, and Umbra. The enmity box is blank. A hare inside the area is claimed. It breaks Mazurka. A Snoll teaches it at Blue Magic ${COLD_WAVE.learnSkill}. No Snoll is in the yard yet, so it is already learned. Setting it grants INT −1 while Blue Mage is main. It is ${COLD_WAVE.refreshTrait} trait point of Auto Refresh and ${COLD_WAVE.points} set point. It does not grant the trait alone, and it does not finish it with Self-Destruct or Frightful Roar. A support job gets neither the penalty nor the trait. The motion is the blue-magic cast, then a frost ring opens around you. A landed Frost ices the hare. Melee critical hits in this yard do not read the hare's AGI. A ranged critical hit does, and Frost is subtracted there.`;
    } else if (spell.blue != null && "hold" in spell.blue) {
      effect = `Earth Slow in a fan in front of you, ${FILAMENTED_HOLD.range}' long and ${BLUE_CONE}° each side of where you are facing. It is not a gaze. You must face the cone. The hare does not have to face you. It does not deal damage. Awful Eye uses the same client range column and is 10' only because its card was blank. This card prints about 9', so this yard uses ${FILAMENTED_HOLD.range}'. An unresisted land is Slow ${FILAMENTED_HOLD.slow}/1024 for ${FILAMENTED_HOLD.seconds} seconds. The script's power is 2500. Sprout Smack stores 1500 as 150/1024, so this spell stores 250. A half resist shortens the ${FILAMENTED_HOLD.seconds}. A full resist, and a quarter resist, do not land. Slow II, or a Slow whose power is above ${FILAMENTED_HOLD.slow}, stays. An equal or weaker Slow is replaced, including Sprout Smack. The wiki says this spell does not overwrite Sprout Smack. The script's 2500 is stronger than 1500, so potency wins here. Magic accuracy is Blue Magic skill plus dINT. The element is earth. There is no damage, so Burst Affinity is not spent. Earth would match Scission, Gravitation, Darkness, and Umbra. Cumulative enmity ${FILAMENTED_HOLD.ce}, volatile ${FILAMENTED_HOLD.ve}, when the hare is in the fan, including a resist. A hare behind you, outside the fan, dead, or charmed adds none. It breaks Mazurka. A Diremite teaches it at Blue Magic ${FILAMENTED_HOLD.learnSkill}. No Diremite is in the yard yet, so it is already learned. Setting it grants VIT +${FILAMENTED_HOLD.vit} while Blue Mage is main. It is ${FILAMENTED_HOLD.clearTrait} trait points of Clear Mind and ${FILAMENTED_HOLD.points} set points. With Poison Breath, Clear Mind is +3 while resting. This spell alone does not grant it. A support job gets neither the VIT nor the trait. The motion is the blue-magic cast, then pale web filaments fan out from you. A landed Slow uses the slow bands.`;
    } else if (spell.blue != null && "breath" in spell.blue && spell.name === "Hecatomb Wave") {
      const raw = Math.floor(hecatombWaveRaw(sheet.hp, LEVEL));
      effect = `Wind breath in a fan in front of you, ${HECATOMB_WAVE.range}' long and ${BLUE_CONE}° each side of where you are facing. Additional effect: Blind. The client stores the same range column as Poison Breath, so this yard uses that spell's ${HECATOMB_WAVE.range}' fan. Damage is current HP / ${HECATOMB_WAVE.hpMod} + main level / ${HECATOMB_WAVE.lvlMod}. The wiki's sum matches the script. On this sheet that is ${raw} before a resist. Magic Attack Bonus is not applied. Day, weather, staff, affinity, and breath damage dealt are not applied. Dragons would take 25% more. The Tropical Rarab is not a dragon, so that bonus is not rolled. Beastmen correlation is likewise unused. Burst Affinity can magic burst it. Wind matches Detonation, Fragmentation, Light, and Radiance. Azure Lore does not open the window and does not change the breath. Burst Affinity is spent even on a miss or when the target is outside the fan. Blind is accuracy −${HECATOMB_WAVE.blind} for ${HECATOMB_WAVE.blindSeconds} seconds, and only when the breath deals damage. A quarter resist does not blind. A half resist shortens the ${HECATOMB_WAVE.blindSeconds}. The second roll has no attribute, because a breath additional effect sets the stat to 0. The element is wind. Blind II, or a Blind whose accuracy down is above ${HECATOMB_WAVE.blind}, stays. An equal Blind is refreshed. The enmity box is blank. A hare in the fan is claimed. A connecting hit gives the hare 100 TP, the same way Poison Breath does. It breaks Mazurka. A Demon teaches it at Blue Magic ${HECATOMB_WAVE.learnSkill}. No Demon is in the yard yet, so it is already learned. Setting it grants AGI +${HECATOMB_WAVE.agi} while Blue Mage is main. It is ${HECATOMB_WAVE.mpTrait} trait points of Max MP Boost and ${HECATOMB_WAVE.points} set points. The trait needs 8 trait points and 4 set points, and the tier is level 40. With Metallic Body it is +10 MP. This spell alone does not grant it. A support job gets neither the AGI nor the trait. The motion is the blue-magic cast, then dark wind grit fans out from you. A landed Blind draws the dark veil.`;
    } else if (spell.blue != null && "breath" in spell.blue && spell.name === "Radiant Breath") {
      const raw = Math.floor(radiantBreathRaw(sheet.hp, LEVEL));
      effect = `Light breath in a fan in front of you, ${RADIANT_BREATH.range}' long and ${BLUE_CONE}° each side of where you are facing. Additional effect: Slow and Silence. The card prints ${RADIANT_BREATH.range}'. Damage is current HP / ${RADIANT_BREATH.hpMod} + main level / ${RADIANT_BREATH.lvlMod}. The wiki's sum matches the script. On this sheet that is ${raw} before a resist. Magic Attack Bonus is not applied. Day, weather, staff, affinity, and breath damage dealt are not applied. Demons would take 25% more. The Tropical Rarab is a beast, so that bonus is not rolled. Burst Affinity can magic burst it. Light matches Transfixion, Fusion, Light, and Radiance. Azure Lore does not open the window and does not change the breath. Burst Affinity is spent even on a miss or when the target is outside the fan. Slow is ${RADIANT_BREATH.slow}/1024 for ${RADIANT_BREATH.slowSeconds} seconds. The script stores 2500, the same scale Sprout Smack uses when it stores 1500 as 150/1024, so this spell stores 250. The script's 60 seconds is not used. The card's duration is ${RADIANT_BREATH.slowSeconds}. Silence lasts the same ${RADIANT_BREATH.silenceSeconds} seconds. The script's power 25 is unused, because Silence is on or off. Each status is its own roll, and only when the breath deals damage. A quarter resist does not land that status. A half resist shortens its ${RADIANT_BREATH.slowSeconds}. The second roll has no attribute. The element is light. Slow II, or a Slow whose power is above ${RADIANT_BREATH.slow}, stays. An enfeebling Silence stays. Chaotic Eye's Silence, and a Silence this breath already left, are replaced. The enmity box is blank. A hare in the fan is claimed. A connecting hit gives the hare 100 TP. It breaks Mazurka. A Wyvern teaches it at Blue Magic ${RADIANT_BREATH.learnSkill}. No Wyvern is in the yard yet, so it is already learned. Setting it grants CHR +${RADIANT_BREATH.chr} and HP +${RADIANT_BREATH.hp} while Blue Mage is main. The script says Combos: None, so it grants no trait. A support job gets neither the stats nor a trait. The motion is the blue-magic cast, then a pale gold-white fan leaves you. A landed Slow uses the slow bands. A landed Silence mutes the hare.`;
    } else if (spell.blue != null && "feather" in spell.blue) {
      effect = `Evasion +${FEATHER_BARRIER.evasion} on you for ${FEATHER_BARRIER.seconds} seconds. The script stores 20. A tested land is +${FEATHER_BARRIER.evasion}, and that is what is used. It refreshes its own Evasion Boost. Diffusion is a locked merit, so the duration stays ${FEATHER_BARRIER.seconds}. There is no damage, so Burst Affinity is not spent. Wind would match Detonation, Fragmentation, Light, and Radiance. Cumulative enmity ${FEATHER_BARRIER.ce}, volatile ${FEATHER_BARRIER.ve}. It does not claim. It does not break Mazurka. A Greater Bird teaches it at Blue Magic ${FEATHER_BARRIER.learnSkill}. No Greater Bird is in the yard yet, so it is already learned. It grants no stat bonus. It is ${FEATHER_BARRIER.gravityTrait} trait points of Resist Gravity and ${FEATHER_BARRIER.points} set points. The trait needs 8 trait points and 3 set points, and tier I is level 69 for 10%. Regurgitation is 4 trait points and 1 set point. Setting both grants it. This spell alone does not grant it. Nothing here weighs you, so it is not rolled. A support job gets neither the trait nor the evasion. The motion is the blue-magic cast, then white feathers lift around you.`;
    } else if (spell.blue != null && "breath" in spell.blue && spell.name === "Flying Hip Press") {
      const raw = Math.floor(hipPressRaw(sheet.hp));
      effect = `Wind breath in a ${FLYING_HIP_PRESS.range}' circle around you. It is not a fan. The card leaves the range blank. This yard uses the same reach as Poison Breath's fan, centered on you, so you can cast it with no enemy selected. Damage is current HP / ${FLYING_HIP_PRESS.hpMod}. The level term is 0, so it is not divided. The wiki's product is not used. On this sheet that is ${raw} before a resist. Magic Attack Bonus is not applied. Day, weather, staff, affinity, and breath damage dealt are not applied. Gamer Escape says a magic burst does not change the damage, only the accuracy. This yard's magic burst is a damage multiplier, so Burst Affinity is not spent and the hit is not multiplied. Wind would match Detonation, Fragmentation, Light, and Radiance. Azure Lore does not change the breath. No additional effect. Beastmen correlation is not rolled. The enmity box is blank. A hare inside the circle is claimed. A connecting hit gives the hare 100 TP. It breaks Mazurka. A Bugbear teaches it at Blue Magic ${FLYING_HIP_PRESS.learnSkill}. No Bugbear is in the yard yet, so it is already learned. Setting it grants AGI +${FLYING_HIP_PRESS.agi} while Blue Mage is main. It is ${FLYING_HIP_PRESS.hpTrait} trait points of Max HP Boost and ${FLYING_HIP_PRESS.points} set points. The trait needs 8 trait points and 5 set points, and tier I is level 62 for +30 HP. Body Slam is not in the yard. This spell alone does not grant it. It does not stack with Warrior, Monk, Paladin, or Ninja. The higher value is kept. A support job gets neither the AGI nor the trait. The motion is the blue-magic cast, then a wind shock ring opens around you. It is not a cone, and it does not draw a magic-burst floater.`;
    } else if (spell.blue != null && "penance" in spell.blue) {
      effect = `Light gaze at ${LIGHT_OF_PENANCE.range}'. It cuts TP, then Blind and Bind. It is not a cone. You do not have to face the enemy. The enemy must be facing you. The script also requires you to face them, and it deletes TP before that check. Neither is used. There is no damage, so Burst Affinity is not spent. Light would match Transfixion, Fusion, Light, and Radiance. Magic accuracy is Blue Magic skill plus dINT. The element is light. A full resist, and a quarter resist, do not cut TP and do not blind or bind. Enmity is still added on that resist. A half resist still lands, and it shortens the ${LIGHT_OF_PENANCE.seconds} seconds. The TP cut is ${LIGHT_OF_PENANCE.tpCut}, floored at 0. It is not a duration, so a half resist does not shrink it. Blind is accuracy −${LIGHT_OF_PENANCE.accDown}. The script's power 10 is not used. Blind II, or a Blind whose accuracy down is above ${LIGHT_OF_PENANCE.accDown}, stays. Bind uses the same ${LIGHT_OF_PENANCE.seconds} seconds. The script's resist threshold is 0.5. Cumulative enmity ${LIGHT_OF_PENANCE.ce}, volatile ${LIGHT_OF_PENANCE.ve}, when the gaze connects, including a resist. A target that is not facing you, out of range, dead, or charmed adds none and loses no TP. It breaks Mazurka. A Tonberry teaches it at Blue Magic ${LIGHT_OF_PENANCE.learnSkill}. No Tonberry is in the yard yet, so it is already learned. Setting it grants CHR +${LIGHT_OF_PENANCE.chr} and HP +${LIGHT_OF_PENANCE.hp} while Blue Mage is main. It is ${LIGHT_OF_PENANCE.refreshTrait} trait points of Auto Refresh and ${LIGHT_OF_PENANCE.points} set points. The trait needs 8 trait points and 8 set points. This spell alone does not grant it. Actinic Burst with Self-Destruct and this spell does. Actinic Burst with Plasma Charge already grants it, and adding this spell does not raise the tier. A support job gets neither the stats nor the trait. The motion is the blue-magic cast, then a pale lantern opens on the target. A landed Bind draws ice chains. A landed Blind draws the dark veil.`;
    } else if (spell.blue != null && "pollen" in spell.blue) {
      const healing = combinedSkill("Healing Magic", mainJob, LEVEL, subJob, subLv);
      const healed = pollenBase(wildCarrotPower(sheet.mnd, sheet.vit, healing));
      effect = `Restores your own HP. An enemy is not a valid target, a trust is not healed, and it does not damage undead. The current card prints 5 MP. The client row and the script header both store ${POLLEN.mp}. This yard uses ${POLLEN.mp}. Power is 3×MND + VIT + 3×floor(Healing Magic ÷ 5). That is your MND ${sheet.mnd} and your VIT ${sheet.vit}. Healing Magic is ${healing}. Power through 59 uses rate 1 and constant −6. Power through 99 uses rate 2 and constant 9. Higher power uses rate 57 and constant 33.125. The floor is ${POLLEN.min}. The card's soft cap of 36 is not a clamp. On this sheet the heal is ${healed} before Divine Seal. A naked Hume Blue Mage 75, MND 53 and VIT 53, heals 34. Divine Seal doubles it. Day, weather, and cure potency are not applied. Burst Affinity is not spent. It does not claim. It does not break Mazurka. Only the HP that lands adds cure enmity. Setting it grants CHR +${POLLEN.chr} and HP +${POLLEN.hp} while Blue Mage is main. It is 4 trait points of Resist Sleep and 1 set point. The trait needs 8 trait points and 4 set points, so this spell alone does not grant it. With Wild Carrot or Magic Fruit it does. A Bee teaches it at Blue Magic 0. No Bee is in the yard yet, so it is already learned. A support job gets neither the stats nor the trait. The motion is the blue-magic cast, then yellow-white pollen and a green heal glow on you. It is not the rabbit phantom.`;
    }
    return {
      title: spell.name,
      rows: [
        { k: "Effect", v: effect },
        { k: "Type", v: SCHOOL[spell.school] },
        { k: "Element", v: elementLabel(spell) },
        { k: "Duration", v: spell.helix ? clock(helixSeconds(mainJob === "SCH" ? LEVEL : subJob === "SCH" ? subLv : 0)) : spellDuration(spell) },
        { k: "Cost", v: spellCost(spell) },
        { k: "Cast", v: spellCast(spell, sheet.celerity) },
        { k: "Recast", v: spell.recast != null ? clock(spell.recast) : "—" },
        { k: "Range", v: spell.range != null ? `${spell.range}'` : "Self" },
        { k: "Radius", v: spellRadius(spell) },
        { k: "Job levels", v: jobNeeds(spell) },
      ],
    };
  }

  let detail: { title: string; rows: { k: string; v: string }[] } | null = null;
  if (pick?.kind === "stat") detail = statLines(pick.id);
  if (pick?.kind === "spell") {
    const spell = spells.find((row) => row.name === pick.name);
    if (spell) detail = spellLines(spell);
  }
  if (pick?.kind === "ability") {
    const hit = abilities.find((row) => row.job === pick.job && row.row.name === pick.name);
    if (hit) {
      const target = abilityTarget(hit.row.effect);
      detail = {
        title: hit.row.name,
        rows: [
          { k: "Effect", v: hit.row.effect },
          { k: "Duration", v: clock(hit.row.duration) },
          { k: "Recast", v: clock(hit.row.recast) },
          { k: "Range", v: target.range },
          { k: "Radius", v: target.radius },
          { k: "Job level", v: `${JOB_NAME[hit.job]} ${hit.row.level}. ${ACCESS[hit.row.access]}.` },
        ],
      };
    }
  }
  if (pick?.kind === "trait") {
    const hit = traits.find((row) => row.job === pick.job && row.row.name === pick.name);
    if (hit) {
      detail = {
        title: hit.row.name,
        rows: [
          { k: "Effect", v: hit.row.effect },
          { k: "Job level", v: `${JOB_NAME[hit.job]} ${hit.row.level}. ${ACCESS[hit.row.access]}.` },
        ],
      };
    }
  }
  if (pick?.kind === "ws") {
    const book = weapons.find((row) => row.weapon === pick.weapon);
    const ws = book?.rows.find((row) => row.name === pick.name);
    if (ws && book) {
      detail = {
        title: ws.name,
        rows: [
          { k: "Effect", v: ws.effect },
          { k: "Stat modifiers", v: modLine(ws.mods) },
          { k: "TP modifiers", v: tpLine(ws) },
          { k: "Range", v: "Melee range" },
          { k: "Radius", v: wsRadius(ws) },
          { k: "Combat skill", v: ws.skill == null ? `${book.weapon}, granted by its weapon` : `${book.weapon} ${ws.skill}` },
        ],
      };
    }
  }

  function same(next: Detail): boolean {
    return JSON.stringify(pick) === JSON.stringify(next);
  }

  return (
    <div className="font-sans text-ink">
      <p className="text-sm font-semibold">
        {raceName} · {JOB_NAME[mainJob]} {shownLevel}
        {subJob ? ` / ${JOB_NAME[subJob]} ${shownSub}` : " · no support job"}
      </p>

      <h3 className="mt-4 font-display text-xl leading-none text-gold">Stats</h3>
      <ul className="mt-2 flex flex-col gap-1">
        {stats.map((stat) => (
          <li key={stat.id}>
            <button
              type="button"
              onClick={() => setPick((current) => (same({ kind: "stat", id: stat.id }) && current?.kind === "stat" ? null : { kind: "stat", id: stat.id }))}
              className={`flex min-h-10 w-full items-center justify-between border px-2 ${pick?.kind === "stat" && pick.id === stat.id ? "border-gold bg-navy" : "border-gold-dim/70"}`}
            >
              <span className="text-sm font-semibold">{stat.label}</span>
              <span className="font-mono text-sm tabular-nums">{stat.value}</span>
            </button>
          </li>
        ))}
      </ul>

      <h3 className="mt-4 font-display text-xl leading-none text-gold">Magic</h3>
      {spells.length === 0 ? <p className="mt-2 text-sm text-muted">No spells.</p> : null}
      <ul className="mt-2 flex flex-col gap-1">
        {spells.map((spell) => (
          <li key={spell.name}>
            <button
              type="button"
              onClick={() => setPick((current) => (current?.kind === "spell" && current.name === spell.name ? null : { kind: "spell", name: spell.name }))}
              className={`flex min-h-10 w-full items-center justify-between gap-2 border px-2 text-left ${pick?.kind === "spell" && pick.name === spell.name ? "border-gold bg-navy" : "border-gold-dim/70"}`}
            >
              <span className="min-w-0 flex-1 text-sm font-semibold leading-tight">{spellListName(spell, mainJob, subJob && subJob !== mainJob ? subJob : null, LEVEL, subLv)}</span>
              <span className="shrink-0 text-[11px] text-muted">{SCHOOL[spell.school]} · {spellLevel(spell, mainJob) <= LEVEL && spell.jobs.includes(mainJob) ? mainJob : subJob} {Math.min(...spell.jobs.map((job) => (levels[job] ?? 0) >= spellLevel(spell, job) ? spellLevel(spell, job) : 99))}</span>
            </button>
          </li>
        ))}
      </ul>

      <h3 className="mt-4 font-display text-xl leading-none text-gold">Abilities</h3>
      {abilities.length === 0 ? <p className="mt-2 text-sm text-muted">No abilities.</p> : null}
      <ul className="mt-2 flex flex-col gap-1">
        {abilities.map((ability) => (
          <li key={`${ability.job}:${ability.row.name}`}>
            <button
              type="button"
              onClick={() =>
                setPick((current) =>
                  current?.kind === "ability" && current.job === ability.job && current.name === ability.row.name
                    ? null
                    : { kind: "ability", job: ability.job, name: ability.row.name },
                )
              }
              className={`flex min-h-10 w-full items-center justify-between gap-2 border px-2 text-left ${pick?.kind === "ability" && pick.job === ability.job && pick.name === ability.row.name ? "border-gold bg-navy" : "border-gold-dim/70"}`}
            >
              <span className="text-sm font-semibold">{ability.row.name}</span>
              <span className="text-[11px] text-muted">{ability.job} {ability.row.level}</span>
            </button>
          </li>
        ))}
      </ul>

      <h3 className="mt-4 font-display text-xl leading-none text-gold">Traits</h3>
      {traits.length === 0 ? <p className="mt-2 text-sm text-muted">No traits.</p> : null}
      <ul className="mt-2 flex flex-col gap-1">
        {traits.map((trait) => (
          <li key={`${trait.job}:${trait.row.name}`}>
            <button
              type="button"
              onClick={() =>
                setPick((current) =>
                  current?.kind === "trait" && current.job === trait.job && current.name === trait.row.name
                    ? null
                    : { kind: "trait", job: trait.job, name: trait.row.name },
                )
              }
              className={`flex min-h-10 w-full items-center justify-between gap-2 border px-2 text-left ${pick?.kind === "trait" && pick.job === trait.job && pick.name === trait.row.name ? "border-gold bg-navy" : "border-gold-dim/70"}`}
            >
              <span className="text-sm font-semibold">{trait.row.name}</span>
              <span className="text-[11px] text-muted">{trait.job} {trait.row.level}</span>
            </button>
          </li>
        ))}
      </ul>

      <h3 className="mt-4 font-display text-xl leading-none text-gold">Combat skills</h3>
      <div className="mt-2 grid grid-cols-[minmax(0,1fr)_2.6rem_2.8rem] gap-y-1 font-mono text-[12px]">
        <span className="text-muted">Skill</span>
        <span className="text-muted">Rank</span>
        <span className="text-right text-muted">Level</span>
        {skillRows.map((skill) => (
          <span key={skill.name} className="contents">
            <span>{skill.name}</span>
            <span>{skill.rank}</span>
            <span className="text-right tabular-nums">{combinedSkill(skill.name, mainJob, LEVEL, subJob, subLv)}</span>
          </span>
        ))}
      </div>

      <h3 className="mt-4 font-display text-xl leading-none text-gold">Weapon skills</h3>
      {weapons.length === 0 ? <p className="mt-2 text-sm text-muted">No weapon skills.</p> : null}
      {weapons.map((book) => (
        <div key={book.weapon} className="mt-2">
          <p className="text-[11px] tracking-[0.12em] text-muted">{book.weapon} {book.skill}</p>
          <ul className="mt-1 flex flex-col gap-1">
            {book.rows.map((ws) => (
              <li key={ws.name}>
                <button
                  type="button"
                  onClick={() =>
                    setPick((current) =>
                      current?.kind === "ws" && current.weapon === book.weapon && current.name === ws.name
                        ? null
                        : { kind: "ws", weapon: book.weapon, name: ws.name },
                    )
                  }
                  className={`flex min-h-10 w-full items-center justify-between gap-2 border px-2 text-left ${pick?.kind === "ws" && pick.weapon === book.weapon && pick.name === ws.name ? "border-gold bg-navy" : "border-gold-dim/70"}`}
                >
                  <span className="text-sm font-semibold">{ws.name}</span>
                  <span className="text-[11px] text-muted">{ws.skill ?? "Weapon"}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}

      {detail && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/55 p-3 sm:items-center" onClick={() => setPick(null)}>
          <div
            className="ffxi-frame max-h-[78%] w-full max-w-md overflow-y-auto p-4"
            style={{ background: "#12141a" }}
            onClick={(event) => {
              event.stopPropagation();
              const target = event.target;
              if (!(target instanceof Element) || !target.closest("[data-food-root]")) setFoodOpen(false);
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <p className="font-display text-2xl leading-none text-gold">{detail.title}</p>
              <div className="flex shrink-0 items-start gap-2">
                {detail.title === "Reward" ? (
                  <button
                    type="button"
                    data-food-root=""
                    aria-expanded={foodOpen}
                    aria-controls="reward-food-list"
                    onClick={() => setFoodOpen((open) => !open)}
                    className={`h-8 border border-gold px-2 text-xs font-semibold text-gold ${foodOpen || (rewardFood != null && petFoodCount(inventory, rewardFood) > 0) ? "bg-navy" : ""}`}
                  >
                    {rewardFood != null && petFoodCount(inventory, rewardFood) > 0
                      ? `Food · ${PET_FOODS.find((food) => food.id === rewardFood)?.name.replace("Pet Food ", "") ?? "Food"}`
                      : "Food"}
                  </button>
                ) : null}
                <button type="button" onClick={() => setPick(null)} className="h-8 border border-gold px-2 text-xs font-semibold text-gold">
                  Close
                </button>
              </div>
            </div>
            {detail.title === "Reward" && foodOpen ? <RewardFoodList inventory={inventory} pinned={rewardFood} onPick={(id) => { setRewardFood(id); setFoodOpen(false); }} /> : null}
            <Lines rows={detail.rows} />
          </div>
        </div>
      )}
    </div>
  );
}

function Pool({ now, next }: { now: number; next: number }) {
  const changed = next !== now;
  return (
    <span className="tabular-nums">
      {now}/
      <span className={changed ? (next > now ? "text-good" : "text-bad") : undefined}>{next}</span>
    </span>
  );
}

function Delta({ now, next }: { now: number; next: number }) {
  const changed = next !== now;
  return <span className={`tabular-nums ${changed ? (next > now ? "text-good" : "text-bad") : ""}`}>{next}</span>;
}

function AttrRow({ label, base, bonus }: { label: string; base: number; bonus: number }) {
  const up = bonus > 0;
  const down = bonus < 0;
  return (
    <>
      <span>{label}</span>
      <span className="tabular-nums">{base}</span>
      <span className={`tabular-nums ${up ? "text-good" : down ? "text-bad" : ""}`}>
        {bonus === 0 ? "" : `${bonus > 0 ? "+" : ""}${bonus}`}
      </span>
    </>
  );
}

function Bag({
  used,
  activeSlot,
  setPiece,
  twoHanded,
  fits,
  onClear,
  onPick,
  onDismiss,
}: {
  used: { id: string; qty: number }[];
  activeSlot: Slot | null;
  setPiece: string | null;
  twoHanded: boolean;
  fits: (id: string) => boolean;
  onClear: () => void;
  onPick: (id: string) => void;
  onDismiss: () => void;
}) {
  const visible = activeSlot ? used.filter((cell) => fits(cell.id)) : used;
  const slots = activeSlot ? visible : Array.from({ length: BAG_SLOTS }, (_, index) => used[index] ?? null);
  const full = used.length >= BAG_SLOTS;
  return (
    <div className="mt-3 flex min-h-[9rem] min-w-0 flex-1 flex-col border border-gold-dim/70">
      <div className="flex items-center justify-between gap-2 px-2 py-1">
        <span className="font-sans text-[11px] tracking-[0.14em] text-gold">INVENTORY</span>
        <span className={`font-mono text-[11px] tabular-nums ${full ? "text-bad" : "text-muted"}`}>
          {activeSlot ? visible.length : `${Math.min(used.length, BAG_SLOTS)}/${BAG_SLOTS}`}
        </span>
      </div>
      {activeSlot ? (
        <div className="flex items-center justify-between gap-2 border-t border-gold-dim/40 px-2 py-1">
          <span className="text-[10px] text-muted">
            {activeSlot === "sub" && twoHanded ? "That weapon leaves no room for a sub." : `${SLOT_LABEL[activeSlot]} — tap a piece`}
          </span>
          {setPiece ? (
            <button type="button" onClick={onClear} className="shrink-0 text-[10px] text-gold">
              Clear slot
            </button>
          ) : null}
        </div>
      ) : (
        <p className="border-t border-gold-dim/40 px-2 py-1 text-[10px] text-muted">Stacks share a slot up to 99.</p>
      )}
      <div
        className="min-h-0 flex-1 overflow-y-auto p-1"
        onClick={() => {
          if (activeSlot) onDismiss();
        }}
      >
        {activeSlot && visible.length === 0 ? (
          <p className="px-1 py-2 text-[11px] text-muted">Nothing in the bag for this slot.</p>
        ) : (
          <div className="grid grid-cols-5 gap-1">
            {slots.map((cell, index) => {
              if (!cell) return <div key={index} className="h-11 border border-[#2a2d36]" />;
              const item = ITEMS[cell.id];
              if (!item) return <div key={index} className="h-11 border border-[#2a2d36]" />;
              return (
                <button
                  key={`${cell.id}-${index}`}
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onPick(cell.id);
                  }}
                  className="flex h-11 flex-col justify-between border border-gold-dim/70 px-1 py-0.5 text-left"
                >
                  <span className="flex items-center justify-between gap-1">
                    <span className="inline-block size-2 shrink-0" style={{ background: SWATCH[item.swatch] }} />
                    {cell.qty > 1 ? <span className="font-mono text-[9px] text-gold">×{cell.qty}</span> : null}
                  </span>
                  <span className="truncate text-[9px] leading-tight text-ink">{item.name}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function SlotButton({
  slot,
  itemId,
  inherited,
  selected,
  onSelect,
}: {
  slot: Slot;
  itemId: string | null;
  inherited?: boolean;
  selected: boolean;
  onSelect: () => void;
}) {
  const item = itemId ? ITEMS[itemId] : null;
  const inventory = useGame((s) => s.inventory);
  const stack = item?.kind === "Jug" ? jugCount(inventory, item.id) : item?.kind === "Oil" ? oilCount(inventory) : item?.kind === "Bait" ? Math.max(0, Math.floor(inventory?.[item.id] ?? 0)) : item ? ammoCount(item.id) : 0;
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex min-h-14 flex-col justify-between border px-1 py-1 text-left ${selected ? "border-gold bg-navy" : "border-gold-dim/70"}`}
    >
      <span className="flex items-center gap-1 text-[10px] tracking-[0.08em] text-gold">
        {slot === "main" ? <Sword className="size-3" aria-hidden /> : null}
        {SLOT_LABEL[slot]}
      </span>
      <span className={`flex items-baseline justify-between gap-1 text-[11px] ${item && !inherited ? "text-ink" : "text-muted"}`}>
        <span className="truncate">{item ? item.name : "—"}</span>
        {stack > 0 ? <span className="shrink-0 text-[10px] text-gold">×{stack}</span> : null}
      </span>
    </button>
  );
}