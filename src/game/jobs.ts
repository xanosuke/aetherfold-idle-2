/**
 * Support job rules used at level 75. No master levels and no job points.
 *
 * The support job's level is half the main job, rounded down. At 75 that
 * is 37. Level 49 is the level-99 cap, and master levels are what raise a
 * subjob past that. This kit has neither.
 *
 * The same job cannot be both. Base HP, MP, and attributes are already
 * halved in characterBase. Traits and abilities use the subjob's own
 * level, and they skip anything marked main-only or master-level sub.
 *
 * The combat skill cap is the higher of the two numbers: the main job's
 * rank at the main level, and the support job's rank at the support
 * level. A skill only the subjob has is therefore capped at 37. A better
 * subjob rank does not replace a higher main-job cap. Black Mage staff
 * is B− at 75 (240). Warrior staff is B at 37 (109). Black Mage / Warrior
 * keeps 240.
 */

import { BLM_SKILLS } from "./blm";
import { MNK_SKILLS } from "./mnk";
import { RDM_SKILLS } from "./rdm";
import { skillCap, type SkillRank } from "./skills";
import type { JobId } from "./stats";
import { SAM_SKILLS } from "./sam";
import { RNG_SKILLS } from "./rng";
import { PLD_SKILLS } from "./pld";
import { NIN_SKILLS } from "./nin";
import { BRD_SKILLS } from "./brd";
import { DRK_SKILLS } from "./drk";
import { DRG_SKILLS } from "./drg";
import { SMN_SKILLS } from "./smn";
import { BST_SKILLS } from "./bst";
import { BLU_SKILLS } from "./blu";
import { THF_SKILLS } from "./thf";
import { PUP_SKILLS } from "./pup";
import { COR_SKILLS } from "./cor";
import { DNC_SKILLS } from "./dnc";
import { SCH_SKILLS } from "./sch";
import { RUN_SKILLS } from "./run";
import { GEO_SKILLS } from "./geo";
import { WAR_SKILLS } from "./war";
import { WHM_SKILLS } from "./whm";

export const PLAYABLE: readonly JobId[] = ["WAR", "MNK", "THF", "SAM", "BLM", "WHM", "RDM", "RNG", "PLD", "NIN", "BRD", "DRK", "DRG", "SMN", "BST", "BLU", "PUP", "COR", "DNC", "SCH", "RUN", "GEO"];

export function subjobLevel(mainLevel: number): number {
  if (mainLevel <= 0) return 0;
  return Math.floor(mainLevel / 2);
}

function ranksOf(job: JobId): readonly { name: string; rank: SkillRank }[] {
  if (job === "WAR") return WAR_SKILLS;
  if (job === "MNK") return MNK_SKILLS;
  if (job === "THF") return THF_SKILLS;
  if (job === "SAM") return SAM_SKILLS;
  if (job === "BLM") return BLM_SKILLS;
  if (job === "WHM") return WHM_SKILLS;
  if (job === "RDM") return RDM_SKILLS;
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
  return [];
}

export function jobSkill(job: JobId, name: string, level: number): number {
  const row = ranksOf(job).find((skill) => skill.name === name);
  return row ? skillCap(row.rank, level) : 0;
}

export function combinedSkill(
  name: string,
  main: JobId,
  mainLevel: number,
  sub: JobId | null,
  subLevel: number,
): number {
  const mainCap = jobSkill(main, name, mainLevel);
  const subCap = sub && sub !== main ? jobSkill(sub, name, subLevel) : 0;
  return Math.max(mainCap, subCap);
}

const SKILL_NAMES: readonly string[] = (() => {
  const names = new Set<string>();
  for (const job of PLAYABLE) for (const row of ranksOf(job)) names.add(row.name);
  return [...names];
})();

/** Current caps for this job and subjob. There is no skill-up yet, so this is the live table. */
export function skillSnapshot(main: JobId, mainLevel: number, sub: JobId | null): Record<string, number> {
  const subLevel = sub ? subjobLevel(mainLevel) : 0;
  const out: Record<string, number> = {};
  for (const name of SKILL_NAMES) out[name] = combinedSkill(name, main, mainLevel, sub, subLevel);
  return out;
}

/**
 * Known skills take the current cap, so a formula change is not frozen.
 * A name this build does not know yet is kept for the next one.
 */
export function mergeSkillSnapshot(saved: unknown, fresh: Record<string, number>): Record<string, number> {
  const out = { ...fresh };
  if (!saved || typeof saved !== "object") return out;
  for (const [name, value] of Object.entries(saved as Record<string, unknown>)) {
    if (name in out) continue;
    if (typeof value !== "number" || !Number.isFinite(value)) continue;
    if (!/^[A-Za-z0-9 :'+.-]{1,40}$/.test(name)) continue;
    out[name] = Math.max(0, Math.min(999, Math.floor(value)));
  }
  return out;
}

export function assertJobs(): void {
  if (subjobLevel(75) !== 37 || subjobLevel(1) !== 0 || subjobLevel(99) !== 49) throw new Error("subjob level");
  if (combinedSkill("Staff", "BLM", 75, "WAR", 37) !== 240) throw new Error("BLM/WAR staff");
  if (combinedSkill("Staff", "WAR", 75, "BLM", 37) !== 250) throw new Error("WAR/BLM staff");
  if (combinedSkill("Elemental Magic", "WAR", 75, "BLM", 37) !== 114) throw new Error("sub-only magic skill");
  if (combinedSkill("Elemental Magic", "BLM", 75, null, 0) !== 276) throw new Error("BLM elemental");
  if (combinedSkill("Katana", "BLM", 75, "WAR", 37) !== 0) throw new Error("no katana from either");
  if (combinedSkill("Club", "WHM", 75, null, 0) !== 256) throw new Error("WHM club");
  if (combinedSkill("Healing Magic", "WHM", 75, "BLM", 37) !== 276) throw new Error("WHM healing");
  if (combinedSkill("Staff", "WHM", 75, "BLM", 37) !== 230) throw new Error("WHM/BLM staff keeps the White Mage cap");
  if (combinedSkill("Sword", "RDM", 75, null, 0) !== 250) throw new Error("RDM sword");
  if (combinedSkill("Enfeebling Magic", "RDM", 75, null, 0) !== 276) throw new Error("RDM enfeebling");
  if (combinedSkill("Enhancing Magic", "RDM", 75, "WHM", 37) !== 256) throw new Error("RDM/WHM enhancing");
  if (combinedSkill("Sword", "WHM", 75, "RDM", 37) !== 109) throw new Error("WHM/RDM sword is the subjob cap");
  if (combinedSkill("Staff", "RDM", 75, "BLM", 37) !== 109) throw new Error("RDM/BLM staff is only the subjob");
  if (combinedSkill("Hand-to-Hand", "MNK", 75, null, 0) !== 276) throw new Error("MNK hand-to-hand");
  if (combinedSkill("Guard", "MNK", 75, null, 0) !== 269) throw new Error("MNK guard");
  if (combinedSkill("Hand-to-Hand", "WAR", 75, "MNK", 37) !== 210) throw new Error("WAR/MNK hand-to-hand keeps the main cap");
  if (combinedSkill("Staff", "MNK", 75, "WAR", 37) !== 250) throw new Error("MNK staff");
  if (combinedSkill("Dagger", "THF", 75, null, 0) !== 276) throw new Error("THF dagger");
  if (combinedSkill("Evasion", "THF", 75, null, 0) !== 276) throw new Error("THF evasion");
  if (combinedSkill("Parrying", "THF", 75, null, 0) !== 269) throw new Error("THF parrying");
  if (combinedSkill("Dagger", "WAR", 75, "THF", 37) !== 240) throw new Error("WAR/THF dagger keeps the main cap");
  if (combinedSkill("Sword", "THF", 75, "WAR", 37) !== 210) throw new Error("THF sword");
  if (combinedSkill("Great Katana", "SAM", 75, null, 0) !== 276) throw new Error("SAM great katana");
  if (combinedSkill("Parrying", "SAM", 75, null, 0) !== 269) throw new Error("SAM parrying");
  if (combinedSkill("Evasion", "SAM", 75, null, 0) !== 256) throw new Error("SAM evasion");
  if (combinedSkill("Polearm", "SAM", 75, null, 0) !== 240) throw new Error("SAM polearm");
  if (combinedSkill("Sword", "SAM", 75, null, 0) !== 230) throw new Error("SAM sword");
  if (combinedSkill("Dagger", "SAM", 75, null, 0) !== 200) throw new Error("SAM dagger");
  if (combinedSkill("Great Katana", "WAR", 75, "SAM", 37) !== 114) throw new Error("WAR/SAM great katana is the subjob cap");
  if (combinedSkill("Katana", "SAM", 75, null, 0) !== 0) throw new Error("SAM has no katana rank");
  if (combinedSkill("Archery", "RNG", 75, null, 0) !== 276) throw new Error("RNG archery");
  if (combinedSkill("Archery", "WAR", 75, "RNG", 37) !== 210) throw new Error("WAR/RNG archery keeps the main cap");
  if (combinedSkill("Dagger", "RNG", 75, null, 0) !== 240) throw new Error("RNG dagger");
  if (combinedSkill("Marksmanship", "RNG", 75, null, 0) !== 276) throw new Error("RNG marksmanship");
  if (combinedSkill("Parrying", "RNG", 75, null, 0) !== 0) throw new Error("RNG has no parrying");
  if (combinedSkill("Sword", "PLD", 75, null, 0) !== 276) throw new Error("PLD sword");
  if (combinedSkill("Shield", "PLD", 75, null, 0) !== 276) throw new Error("PLD shield");
  if (combinedSkill("Healing Magic", "PLD", 75, null, 0) !== 225) throw new Error("PLD healing");
  if (combinedSkill("Sword", "WAR", 75, "PLD", 37) !== 250) throw new Error("WAR/PLD sword keeps the main cap");
  if (combinedSkill("Shield", "WAR", 75, "PLD", 37) !== 230) throw new Error("WAR/PLD shield keeps the main cap");
  if (combinedSkill("Katana", "NIN", 75, null, 0) !== 276) throw new Error("NIN katana");
  if (combinedSkill("Ninjutsu", "NIN", 75, null, 0) !== 269) throw new Error("NIN ninjutsu");
  if (combinedSkill("Throwing", "NIN", 75, null, 0) !== 276) throw new Error("NIN throwing");
  if (combinedSkill("Evasion", "NIN", 75, null, 0) !== 269) throw new Error("NIN evasion");
  if (combinedSkill("Parrying", "NIN", 75, null, 0) !== 269) throw new Error("NIN parrying");
  if (combinedSkill("Dagger", "NIN", 75, null, 0) !== 230) throw new Error("NIN dagger");
  if (combinedSkill("Sword", "NIN", 75, null, 0) !== 225) throw new Error("NIN sword");
  if (combinedSkill("Great Katana", "NIN", 75, null, 0) !== 220) throw new Error("NIN great katana");
  if (combinedSkill("Katana", "WAR", 75, "NIN", 37) !== 114) throw new Error("WAR/NIN katana is the subjob cap");
  if (combinedSkill("Ninjutsu", "WAR", 75, "NIN", 37) !== 114) throw new Error("WAR/NIN ninjutsu");
  if (combinedSkill("Dagger", "BRD", 75, null, 0) !== 240) throw new Error("BRD dagger");
  if (combinedSkill("Staff", "BRD", 75, null, 0) !== 230) throw new Error("BRD staff");
  if (combinedSkill("Sword", "BRD", 75, null, 0) !== 220) throw new Error("BRD sword");
  if (combinedSkill("Club", "BRD", 75, null, 0) !== 210) throw new Error("BRD club");
  if (combinedSkill("Throwing", "BRD", 75, null, 0) !== 200) throw new Error("BRD throwing");
  if (combinedSkill("Evasion", "BRD", 75, null, 0) !== 210) throw new Error("BRD evasion");
  if (combinedSkill("Parrying", "BRD", 75, null, 0) !== 200) throw new Error("BRD parrying");
  if (combinedSkill("Singing", "BRD", 75, null, 0) !== 225) throw new Error("BRD singing");
  if (combinedSkill("String Instrument", "BRD", 75, null, 0) !== 225) throw new Error("BRD string");
  if (combinedSkill("Wind Instrument", "BRD", 75, null, 0) !== 225) throw new Error("BRD wind");
  if (combinedSkill("Singing", "WAR", 75, "BRD", 37) !== 105) throw new Error("WAR/BRD singing is the subjob cap");
  if (combinedSkill("Dagger", "WAR", 75, "BRD", 37) !== 240) throw new Error("WAR/BRD dagger keeps the main cap");
  if (combinedSkill("Scythe", "DRK", 75, null, 0) !== 276) throw new Error("DRK scythe");
  if (combinedSkill("Great Sword", "DRK", 75, null, 0) !== 269) throw new Error("DRK great sword");
  if (combinedSkill("Dark Magic", "DRK", 75, null, 0) !== 269) throw new Error("DRK dark magic");
  if (combinedSkill("Elemental Magic", "DRK", 75, null, 0) !== 256) throw new Error("DRK elemental");
  if (combinedSkill("Enfeebling Magic", "DRK", 75, null, 0) !== 225) throw new Error("DRK enfeebling");
  if (combinedSkill("Scythe", "WAR", 75, "DRK", 37) !== 256) throw new Error("WAR/DRK scythe keeps the main cap");
  if (combinedSkill("Dark Magic", "WAR", 75, "DRK", 37) !== 114) throw new Error("WAR/DRK dark magic is the subjob cap");
  if (combinedSkill("Polearm", "DRG", 75, null, 0) !== 276) throw new Error("DRG polearm");
  if (combinedSkill("Staff", "DRG", 75, null, 0) !== 240) throw new Error("DRG staff");
  if (combinedSkill("Sword", "DRG", 75, null, 0) !== 220) throw new Error("DRG sword");
  if (combinedSkill("Dagger", "DRG", 75, null, 0) !== 200) throw new Error("DRG dagger");
  if (combinedSkill("Club", "DRG", 75, null, 0) !== 200) throw new Error("DRG club");
  if (combinedSkill("Parrying", "DRG", 75, null, 0) !== 225) throw new Error("DRG parrying");
  if (combinedSkill("Evasion", "DRG", 75, null, 0) !== 240) throw new Error("DRG evasion");
  if (combinedSkill("Polearm", "WAR", 75, "DRG", 37) !== 240) throw new Error("WAR/DRG polearm keeps the main cap");
  if (combinedSkill("Staff", "SMN", 75, null, 0) !== 250) throw new Error("SMN staff");
  if (combinedSkill("Club", "SMN", 75, null, 0) !== 230) throw new Error("SMN club");
  if (combinedSkill("Dagger", "SMN", 75, null, 0) !== 200) throw new Error("SMN dagger");
  if (combinedSkill("Evasion", "SMN", 75, null, 0) !== 200) throw new Error("SMN evasion");
  if (combinedSkill("Summoning Magic", "SMN", 75, null, 0) !== 269) throw new Error("SMN summoning");
  if (combinedSkill("Summoning Magic", "WAR", 75, "SMN", 37) !== 114) throw new Error("WAR/SMN summoning is the subjob cap");
  if (combinedSkill("Staff", "WAR", 75, "SMN", 37) !== 250) throw new Error("WAR/SMN staff keeps the main cap");
  if (combinedSkill("Axe", "BST", 75, null, 0) !== 276) throw new Error("BST axe");
  if (combinedSkill("Scythe", "BST", 75, null, 0) !== 240) throw new Error("BST scythe");
  if (combinedSkill("Dagger", "BST", 75, null, 0) !== 230) throw new Error("BST dagger");
  if (combinedSkill("Club", "BST", 75, null, 0) !== 210) throw new Error("BST club");
  if (combinedSkill("Sword", "BST", 75, null, 0) !== 200) throw new Error("BST sword");
  if (combinedSkill("Evasion", "BST", 75, null, 0) !== 225) throw new Error("BST evasion");
  if (combinedSkill("Parrying", "BST", 75, null, 0) !== 225) throw new Error("BST parrying");
  if (combinedSkill("Shield", "BST", 75, null, 0) !== 200) throw new Error("BST shield");
  if (combinedSkill("Axe", "WAR", 75, "BST", 37) !== 269) throw new Error("WAR/BST axe keeps the main cap");
  if (combinedSkill("Staff", "BST", 75, null, 0) !== 0) throw new Error("BST has no staff rank");
  if (combinedSkill("Sword", "BLU", 75, null, 0) !== 276) throw new Error("BLU sword");
  if (combinedSkill("Club", "BLU", 75, null, 0) !== 240) throw new Error("BLU club");
  if (combinedSkill("Evasion", "BLU", 75, null, 0) !== 220) throw new Error("BLU evasion");
  if (combinedSkill("Parrying", "BLU", 75, null, 0) !== 210) throw new Error("BLU parrying");
  if (combinedSkill("Blue Magic", "BLU", 75, null, 0) !== 276) throw new Error("BLU blue magic");
  if (combinedSkill("Shield", "BLU", 75, null, 0) !== 0 || combinedSkill("Staff", "BLU", 75, null, 0) !== 0) throw new Error("BLU has no shield or staff");
  if (combinedSkill("Sword", "WAR", 75, "BLU", 37) !== 250) throw new Error("WAR/BLU sword keeps the main cap");
  if (combinedSkill("Sword", "BLU", 75, "WAR", 37) !== 276) throw new Error("BLU/WAR sword keeps the Blue Mage cap");
  if (combinedSkill("Blue Magic", "WAR", 75, "BLU", 37) !== 114) throw new Error("WAR/BLU blue magic is the subjob cap");
  if (combinedSkill("Hand-to-Hand", "PUP", 75, null, 0) !== 276) throw new Error("PUP hand-to-hand");
  if (combinedSkill("Dagger", "PUP", 75, null, 0) !== 220) throw new Error("PUP dagger");
  if (combinedSkill("Club", "PUP", 75, null, 0) !== 210) throw new Error("PUP club");
  if (combinedSkill("Throwing", "PUP", 75, null, 0) !== 230) throw new Error("PUP throwing");
  if (combinedSkill("Evasion", "PUP", 75, null, 0) !== 250) throw new Error("PUP evasion");
  if (combinedSkill("Guard", "PUP", 75, null, 0) !== 250) throw new Error("PUP guard");
  if (combinedSkill("Parrying", "PUP", 75, null, 0) !== 210) throw new Error("PUP parrying");
  if (combinedSkill("Staff", "PUP", 75, null, 0) !== 0) throw new Error("PUP has no staff rank");
  if (combinedSkill("Hand-to-Hand", "WAR", 75, "PUP", 37) !== 210) throw new Error("WAR/PUP hand-to-hand keeps the main cap");
  if (combinedSkill("Hand-to-Hand", "PUP", 75, "WAR", 37) !== 276) throw new Error("PUP/WAR hand-to-hand keeps the Puppetmaster cap");
  if (combinedSkill("Throwing", "WAR", 75, "PUP", 37) !== 210) throw new Error("WAR/PUP throwing keeps the main cap");
  if (combinedSkill("Dagger", "COR", 75, null, 0) !== 256) throw new Error("COR dagger");
  if (combinedSkill("Sword", "COR", 75, null, 0) !== 240) throw new Error("COR sword");
  if (combinedSkill("Marksmanship", "COR", 75, null, 0) !== 250) throw new Error("COR marksmanship");
  if (combinedSkill("Throwing", "COR", 75, null, 0) !== 230) throw new Error("COR throwing");
  if (combinedSkill("Parrying", "COR", 75, null, 0) !== 269) throw new Error("COR parrying");
  if (combinedSkill("Evasion", "COR", 75, null, 0) !== 210) throw new Error("COR evasion");
  if (combinedSkill("Archery", "COR", 75, null, 0) !== 0 || combinedSkill("Staff", "COR", 75, null, 0) !== 0) throw new Error("COR has no archery or staff");
  if (combinedSkill("Marksmanship", "WAR", 75, "COR", 37) !== 210) throw new Error("WAR/COR marksmanship keeps the main cap");
  if (combinedSkill("Sword", "COR", 75, "WAR", 37) !== 240) throw new Error("COR/WAR sword keeps the Corsair cap");
  if (combinedSkill("Dagger", "WAR", 75, "COR", 37) !== 240) throw new Error("WAR/COR dagger keeps the main cap");
  if (combinedSkill("Dagger", "DNC", 75, null, 0) !== 276) throw new Error("DNC dagger");
  if (combinedSkill("Hand-to-Hand", "DNC", 75, null, 0) !== 210) throw new Error("DNC hand-to-hand");
  if (combinedSkill("Sword", "DNC", 75, null, 0) !== 210) throw new Error("DNC sword");
  if (combinedSkill("Throwing", "DNC", 75, null, 0) !== 230) throw new Error("DNC throwing");
  if (combinedSkill("Evasion", "DNC", 75, null, 0) !== 256) throw new Error("DNC evasion");
  if (combinedSkill("Parrying", "DNC", 75, null, 0) !== 250) throw new Error("DNC parrying");
  if (combinedSkill("Staff", "DNC", 75, null, 0) !== 0) throw new Error("DNC has no staff");
  if (combinedSkill("Dagger", "WAR", 75, "DNC", 37) !== 240) throw new Error("WAR/DNC dagger keeps the main cap");
  if (combinedSkill("Dagger", "DNC", 75, "WAR", 37) !== 276) throw new Error("DNC/WAR dagger stays at the Dancer cap");
  if (combinedSkill("Club", "SCH", 75, null, 0) !== 230) throw new Error("SCH club");
  if (combinedSkill("Staff", "SCH", 75, null, 0) !== 230) throw new Error("SCH staff");
  if (combinedSkill("Dagger", "SCH", 75, null, 0) !== 210) throw new Error("SCH dagger");
  if (combinedSkill("Healing Magic", "SCH", 75, null, 0) !== 210) throw new Error("SCH healing");
  if (combinedSkill("Elemental Magic", "SCH", 75, null, 0) !== 210) throw new Error("SCH elemental");
  if (combinedSkill("Evasion", "SCH", 75, null, 0) !== 200) throw new Error("SCH evasion");
  if (combinedSkill("Parrying", "SCH", 75, null, 0) !== 200) throw new Error("SCH parrying");
  if (combinedSkill("Sword", "SCH", 75, null, 0) !== 0) throw new Error("SCH has no sword");
  if (combinedSkill("Club", "WHM", 75, "SCH", 37) !== 256) throw new Error("WHM/SCH club keeps the White Mage cap");
  if (combinedSkill("Healing Magic", "SCH", 75, "WHM", 37) !== 210) throw new Error("SCH/WHM healing stays at the Scholar cap");
  if (combinedSkill("Great Sword", "RUN", 75, null, 0) !== 276) throw new Error("RUN great sword");
  if (combinedSkill("Sword", "RUN", 75, null, 0) !== 269) throw new Error("RUN sword");
  if (combinedSkill("Great Axe", "RUN", 75, null, 0) !== 250) throw new Error("RUN great axe");
  if (combinedSkill("Axe", "RUN", 75, null, 0) !== 240) throw new Error("RUN axe");
  if (combinedSkill("Club", "RUN", 75, null, 0) !== 220) throw new Error("RUN club");
  if (combinedSkill("Parrying", "RUN", 75, null, 0) !== 276) throw new Error("RUN parrying");
  if (combinedSkill("Evasion", "RUN", 75, null, 0) !== 256) throw new Error("RUN evasion");
  if (combinedSkill("Divine Magic", "RUN", 75, null, 0) !== 250) throw new Error("RUN divine");
  if (combinedSkill("Enhancing Magic", "RUN", 75, null, 0) !== 240) throw new Error("RUN enhancing");
  if (combinedSkill("Shield", "RUN", 75, null, 0) !== 0 || combinedSkill("Staff", "RUN", 75, null, 0) !== 0) throw new Error("RUN has no shield or staff");
  if (combinedSkill("Great Sword", "WAR", 75, "RUN", 37) !== 256) throw new Error("WAR/RUN great sword keeps the main cap");
  if (combinedSkill("Divine Magic", "WAR", 75, "RUN", 37) !== 109) throw new Error("WAR/RUN divine is the subjob cap");
  if (combinedSkill("Club", "GEO", 75, null, 0) !== 256) throw new Error("GEO club");
  if (combinedSkill("Staff", "GEO", 75, null, 0) !== 230) throw new Error("GEO staff");
  if (combinedSkill("Dagger", "GEO", 75, null, 0) !== 220) throw new Error("GEO dagger");
  if (combinedSkill("Geomancy", "GEO", 75, null, 0) !== 225) throw new Error("GEO geomancy");
  if (combinedSkill("Handbell", "GEO", 75, null, 0) !== 225) throw new Error("GEO handbell");
  if (combinedSkill("Elemental Magic", "GEO", 75, null, 0) !== 256) throw new Error("GEO elemental");
  if (combinedSkill("Geomancy", "WAR", 75, "GEO", 37) !== 105) throw new Error("WAR/GEO geomancy is the subjob cap");
  if (combinedSkill("Club", "WHM", 75, "GEO", 37) !== 256) throw new Error("WHM/GEO club keeps the White Mage cap");
}
