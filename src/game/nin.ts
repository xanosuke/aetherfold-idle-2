/**
 * Retail Ninja toolkit through level 75. No merits and no job points.
 *
 * A support job here is level 37. Yonin, Innin, and Mijin Gakure are not
 * support-job abilities. Sange is a group-2 merit, so it stays locked.
 * Futae and everything after it are past 75.
 *
 * Traits a normal subjob reaches: Stealth, Resist Bind I–II, Dual Wield I–II,
 * Subtle Blow I–II, Max HP Boost I, and Daken I. Resist Bind III, Damage
 * Limit+ I, and Daken III need a master-level sub. From Subtle Blow IV up
 * is main only. Ninja Tool Expertise is on the trait list at 75 and is a
 * merit: with no ranks unlocked it adds nothing, and tools are not spent.
 *
 * Naked Hume Ninja grades, with no subjob and no Max HP Boost: level 75 is
 * 1046 HP, 0 MP, STR 61, DEX 65, VIT 61, AGI 65, INT 56, MND 44, CHR 48.
 * Ninjutsu does not cost MP. The tool is still named on the spell.
 *
 * The model wears Ninja Chainmail, the artifact set: Hatsuburi, Chainmail,
 * Tekko, Hakama, and Kyahan. Black chain, a red sash, an iron face mask,
 * and a dark hakama. The pieces are not equipped, so their stat lines are
 * not on the sheet. The katanas in the hands are the equipped weapons.
 */

import type { JobAccess } from "./blm";
import { skillCap, type SkillRank } from "./skills";
import { characterBase, type JobId } from "./stats";
import type { Spell } from "./spells";

export const NIN_CAP = 75;

/** Mijin Gakure reaches this far. The page prints 17.6'. */
export const MIJIN_RANGE = 17.6;

/** Yonin and Innin. The pages print 5 minutes up and 3 minutes down. They share that recast. */
export const STANCE_SECONDS = 300;
export const STANCE_RECAST = 180;

/** Utsusemi lasts 15 minutes, or until the shadows are gone. */
export const UTSUSEMI_SECONDS = 900;

/** Tonko: Ichi. The page prints 7 minutes. The element cell is blank. */
export const TONKO_ICHI_SECONDS = 420;

/** Tonko: Ni. The page prints 10 minutes and recast 45. Target is Self, not a party radius. */
export const TONKO_NI_SECONDS = 600;

/** Monomi: Ichi. The page prints 7 minutes. */
export const MONOMI_SECONDS = 420;

export function ninHideSeconds(kind: "invisible" | "sneak", tier: 1 | 2 | 3): number {
  if (kind === "invisible" && tier >= 2) return TONKO_NI_SECONDS;
  return kind === "sneak" ? MONOMI_SECONDS : TONKO_ICHI_SECONDS;
}

/** Kurayami: Ichi. The page prints 3 minutes and accuracy −20. */
export const KURAYAMI_ICHI_SECONDS = 180;

/** Kurayami: Ni. The page prints 4 minutes and accuracy −30. It overwrites Ichi and Blind. */
export const KURAYAMI_NI_SECONDS = 240;

/** Dokumori: Ichi. The page prints 1 minute and 3 damage a tick. */
export const DOKUMORI_SECONDS = 60;

/** Jubaku: Ichi. The page prints 90 seconds and a 20% proc. Jubaku: Ni is a monster spell. */
export const JUBAKU_SECONDS = 90;

/** Hojo's infobox prints Varies. A partial resist is not rolled, so this yard keeps 3 minutes. */
export const HOJO_SECONDS = 180;

/** The pages print 150/1024 and 200/1024. A rounded percent of 1024 is 154 and 205, and those are wrong. */
export const HOJO_SLOW: Record<1 | 2, number> = { 1: 150, 2: 200 };

/**
 * The ninjutsu page says elemental ninjutsu lowers the opposing resist by 30.
 * Ichi, Ni, and San use the same amount.
 */
export const NIN_RESIST_DOWN = 30;

/**
 * The spell infobox leaves this duration blank.
 * This yard keeps the resist down for 15 seconds.
 * A merit would add 2 seconds. No merits are unlocked.
 */
export const NIN_RESIST_SECONDS = 15;

/** Ninjutsu cast on an enemy. Self spells leave this unset and use the seal anyway. */
export const NIN_CAST_RANGE = 17;

export type NinAbility = {
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

export type NinTrait = {
  name: string;
  level: number;
  access: JobAccess;
  effect: string;
};

export type NinSkill = {
  name: string;
  rank: SkillRank;
};

export type NinKind = "nuke" | "huton" | "shadow" | "invisible" | "sneak" | "blind" | "slow" | "poison" | "paralyze";

export type NinElement = "fire" | "ice" | "wind" | "earth" | "lightning" | "water";

export type NinSpec = {
  kind: NinKind;
  tier: 1 | 2 | 3;
  element?: NinElement;
  /** The resist this nuke lowers. */
  weaken?: NinElement;
  area?: boolean;
};

export function ninJobLevel(job: JobId, sub: JobId | null, subLevel: number, mainLevel: number): number {
  if (job === "NIN") return mainLevel;
  if (sub === "NIN") return subLevel;
  return 0;
}

/**
 * Dual Wield, as a fraction of delay removed. The higher tier replaces the lower.
 * I 10% at 10, II 15% at 25, III 25% at 45, IV 30% at 65 (main), V 35% at 85.
 * It applies only while both hands hold a one-handed weapon.
 * Each hand's delay is (Delay 1 + Delay 2) / 2, then this cut.
 * (1 − Dual Wield) × (1 − Haste) cannot fall under 0.20.
 */
export function ninDualWield(level: number, access: JobAccess): number {
  if (access === "main" && level >= 65) return 0.3;
  if (level >= 45) return 0.25;
  if (level >= 25) return 0.15;
  if (level >= 10) return 0.1;
  return 0;
}

/** True when the off hand is a weapon, not a shield, and the main hand is one-handed. */
export function handsDualWield(
  main: { grip?: string; kind: string } | null,
  sub: { kind: string } | null,
): boolean {
  if (!main || !sub) return false;
  if (main.grip === "two" || main.kind === "Hand-to-Hand" || main.kind === "Shield") return false;
  if (sub.kind === "Shield") return false;
  return true;
}

/**
 * Subtle Blow. The higher tier replaces the lower.
 * I 5 at 15, II 10 at 30, III 15 at 45, IV 20 at 60 (main), V 25 at 75 (main).
 * A level-37 subjob stops at II.
 */
export function ninSubtleBlow(level: number, access: JobAccess): number {
  if (access === "main" && level >= 75) return 25;
  if (access === "main" && level >= 60) return 20;
  if (level >= 45) return 15;
  if (level >= 30) return 10;
  if (level >= 15) return 5;
  return 0;
}

/**
 * Max HP Boost. Tiers replace. They do not stack with another job's Max HP Boost.
 * I +30 at 20, II +60 at 40, III +120 at 60 (main). A level-37 subjob has I.
 */
export function ninMaxHp(level: number, access: JobAccess): number {
  if (access === "main" && level >= 60) return 120;
  if (level >= 40) return 60;
  if (level >= 20) return 30;
  return 0;
}

/**
 * Daken. The chance a shuriken throws itself on an auto-attack.
 * I 20% at 25, II 25% at 40, III 30% at 55 (master sub), IV 35% at 70 (main).
 * No shuriken is equipped, so the chance is not rolled. Shuriken would not be consumed.
 */
export function dakenRate(level: number, access: JobAccess): number {
  if (access === "main") {
    if (level >= 70) return 0.35;
    if (level >= 55) return 0.3;
    if (level >= 40) return 0.25;
    if (level >= 25) return 0.2;
    return 0;
  }
  if (access === "master-sub") {
    if (level >= 55) return 0.3;
    if (level >= 40) return 0.25;
    if (level >= 25) return 0.2;
    return 0;
  }
  if (level >= 40) return 0.25;
  if (level >= 25) return 0.2;
  return 0;
}

/**
 * Resist Bind. The page does not print the percents. Tier IV is described as
 * about 20%, so each tier is 5% and the higher tier replaces the lower.
 * I at 10, II at 30, III at 50 (master sub), IV at 70 (main).
 * Nothing here binds you, so it is not rolled.
 */
export function resistBind(level: number, access: JobAccess): number {
  if (access === "main" && level >= 70) return 0.2;
  if (access !== "sub" && level >= 50) return 0.15;
  if (level >= 30) return 0.1;
  if (level >= 10) return 0.05;
  return 0;
}

/**
 * Damage Limit+ I is +26/256, the same first rank the other jobs use.
 * It is learned at 50, inside the master-sub bracket, so a normal subjob
 * does not have it. It adds to the physical pDIF cap.
 */
export function ninDamageLimit(level: number, access: JobAccess): number {
  if (access === "sub" || level < 50) return 0;
  return 26 / 256;
}

/**
 * Stealth I. The page does not print the percent. Tier I is treated as +12%
 * movement speed, and only while Invisible is up. Stealth II is 86.
 */
export function stealthMove(level: number): number {
  return level >= 5 ? 0.12 : 0;
}

/**
 * Yonin and Innin start near ±30 and fall one point every 15 seconds, holding at 10.
 * `left` is the seconds still on the 5-minute buff.
 * Evasion and enemy critical hit rate on Yonin are marked likely on the page.
 * Innin's accuracy, critical hit rate, and ninjutsu damage are the same shape.
 */
export function stancePower(left: number, duration = STANCE_SECONDS): number {
  const elapsed = Math.max(0, duration - left);
  return Math.max(10, 30 - Math.floor(elapsed / 15));
}

export function utsusemiShadows(tier: 1 | 2, main: boolean): number {
  if (tier >= 2) return main ? 4 : 3;
  return 3;
}

const POTENCY: Record<1 | 2 | 3, { v: number; m: number; lo: number; hi: number }> = {
  1: { v: 28, m: 0.5, lo: 50, hi: 250 },
  2: { v: 69, m: 1, lo: 125, hi: 325 },
  3: { v: 134, m: 1.5, lo: 275, hi: 475 },
};

/** Skill term from the ninjutsu page. Below the tier's skill floor it is 1. Above the ceiling it holds. */
export function ninjutsuPotency(tier: 1 | 2 | 3, skill: number): number {
  const row = POTENCY[tier];
  if (skill < row.lo) return 1;
  const used = Math.min(row.hi, skill);
  return (100 + (used - row.lo) * 0.5) / 100;
}

/**
 * [V + floor(dINT × M)] × the skill term. Magic Attack Bonus is not in this kit's ninjutsu.
 * Staff, day, weather, affinity, and resist stay 1. A negative result becomes 0.
 * Ninjutsu magic accuracy uses no dSTAT. This dINT is only the damage term.
 */
export function ninjutsuDamage(tier: 1 | 2 | 3, skill: number, dInt: number): number {
  const row = POTENCY[tier];
  const base = row.v + Math.floor(dInt * row.m);
  return Math.max(0, Math.floor(base * ninjutsuPotency(tier, skill)));
}

/** Average of current HP. The page says the hit varies from 6% to 80% when it is resisted. Resist is not rolled. */
export function mijinDamage(hp: number): number {
  return Math.max(0, Math.floor(Math.max(0, hp) * 0.5));
}

/** A later Raise after Mijin Gakure. Half of maximum HP, and no Weakness. */
export function mijinRaiseHp(maxHp: number): number {
  return Math.max(0, Math.floor(Math.max(0, maxHp) * 0.5));
}

const WEAKEN_NAME: Record<NinElement, string> = {
  fire: "Fire Resist Down",
  ice: "Ice Resist Down",
  wind: "Wind Resist Down",
  earth: "Earth Resist Down",
  lightning: "Lightning Resist Down",
  water: "Water Resist Down",
};

export function resistDownName(element: NinElement): string {
  return WEAKEN_NAME[element];
}

export type NinEnfeeble = {
  name: string;
  left: number;
  accDown?: number;
  power?: number;
  dot?: number;
  acc?: number;
};

export type NinBuffGive = {
  name: "Copy Image" | "Invisible" | "Sneak";
  left: number;
  power?: number;
  charges?: number;
  tier?: number;
};

export type NinLand = {
  text: string;
  dmg: number;
  hate?: { ce: number; ve: number };
  give?: NinBuffGive;
  /** Buff names removed before `give` lands. */
  drop: string[];
  enfeeble?: NinEnfeeble;
  /** Party members inside 10' also receive Invisible or Sneak. */
  area?: "Invisible" | "Sneak";
  noEffect?: boolean;
};

function toolNote(spell: Spell): string {
  const tool = spell.tool?.name;
  return tool ? ` ${tool} is not spent.` : "";
}

/**
 * What one finished ninjutsu does. The cast has already passed its range check.
 * A lower Utsusemi does not replace a higher one that still has a shadow.
 * Tonko is Invisible. Monomi is Sneak. Huton is wind damage, not Haste.
 */
export function landNinjutsu(
  spell: Spell,
  ctx: {
    skill: number;
    dInt: number;
    main: boolean;
    yonin: boolean;
    inninPower: number;
    behind: boolean;
    shadows: { tier: number; charges: number } | null;
    /** Accuracy down already on the target from Blind, including Kurayami. */
    blindDown?: number;
  },
): NinLand | null {
  const spec = spell.nin;
  if (!spec) return null;
  const spent = toolNote(spell);
  if (spec.kind === "nuke" || spec.kind === "huton") {
    const tier = spec.tier;
    let dmg = ninjutsuDamage(tier, ctx.skill, ctx.dInt);
    if (ctx.behind && ctx.inninPower > 0) {
      dmg = Math.floor(dmg * (1 + ctx.inninPower / 100));
    }
    const element = spec.element ?? "fire";
    const weaken = spec.weaken;
    const resist = weaken
      ? `${resistDownName(weaken)} lowers resistance by ${NIN_RESIST_DOWN} for ${NIN_RESIST_SECONDS} seconds.`
      : "";
    const enfeeble: NinEnfeeble | undefined = weaken
      ? { name: resistDownName(weaken), left: NIN_RESIST_SECONDS, power: NIN_RESIST_DOWN }
      : undefined;
    return {
      text: `${spell.name} deals ${dmg} points of ${element} damage.${resist ? ` ${resist}` : ""}${spent}`,
      dmg,
      drop: [],
      enfeeble,
    };
  }
  if (spec.kind === "shadow") {
    const tier = spec.tier === 3 ? 2 : spec.tier;
    const shadows = utsusemiShadows(tier === 2 ? 2 : 1, ctx.main);
    const hate = ctx.yonin ? { ce: 160, ve: 480 } : { ce: 0, ve: 160 };
    if (ctx.shadows && ctx.shadows.tier > tier && ctx.shadows.charges > 0) {
      return {
        text: `${spell.name} has no effect. A stronger Copy Image is already up.${spent}`,
        dmg: 0,
        drop: [],
        hate,
        noEffect: true,
      };
    }
    return {
      text: `${spell.name}. ${shadows} shadows. Each one absorbs one attack.${spent}`,
      dmg: 0,
      give: { name: "Copy Image", left: UTSUSEMI_SECONDS, charges: shadows, tier },
      drop: ["Copy Image"],
      hate,
    };
  }
  if (spec.kind === "invisible" || spec.kind === "sneak") {
    const name = spec.kind === "invisible" ? "Invisible" : "Sneak";
    const which = spec.kind === "invisible" ? "sight" : "sound";
    const left = ninHideSeconds(spec.kind, spec.tier);
    const hate = spec.kind === "sneak" ? { ce: 80, ve: 240 } : { ce: 1, ve: 0 };
    return {
      text: `${spell.name}. Harder to detect by ${which} for ${left / 60} minutes.${spec.area ? " Party members within 10' receive it." : ""}${spent}`,
      dmg: 0,
      give: { name, left, tier: spec.tier },
      drop: [name],
      area: spec.area ? name : undefined,
      hate,
    };
  }
  if (spec.kind === "blind") {
    const down = spec.tier >= 2 ? 30 : 20;
    const left = spec.tier >= 2 ? KURAYAMI_NI_SECONDS : KURAYAMI_ICHI_SECONDS;
    const hate = { ce: 20, ve: 100 };
    if (spec.tier < 2 && (ctx.blindDown ?? 0) > down) {
      return {
        text: `${spell.name} has no effect. A stronger Blind is already up.${spent}`,
        dmg: 0,
        drop: [],
        hate,
        noEffect: true,
      };
    }
    return {
      text: `${spell.name} lowers accuracy by ${down}.${spent}`,
      dmg: 0,
      drop: [],
      enfeeble: { name: "Blind", left, accDown: down },
      hate,
    };
  }
  if (spec.kind === "slow") {
    const power = spec.tier >= 2 ? HOJO_SLOW[2] : HOJO_SLOW[1];
    const hate = spec.tier >= 2 ? { ce: 80, ve: 240 } : { ce: 20, ve: 100 };
    return {
      text: `${spell.name}. Auto-attack delay is multiplied by ${1024 + power}/1024.${spent}`,
      dmg: 0,
      drop: [],
      enfeeble: { name: "Slow", left: HOJO_SECONDS, power },
      hate,
    };
  }
  if (spec.kind === "poison") {
    return {
      text: `${spell.name}. 3 HP slips every 3 seconds.${spent}`,
      dmg: 0,
      drop: [],
      enfeeble: { name: "Poison", left: DOKUMORI_SECONDS, dot: 3, acc: 0 },
      hate: { ce: 20, ve: 100 },
    };
  }
  return {
    text: `${spell.name}. 20% chance to cancel an auto-attack or TP move.${spent}`,
    dmg: 0,
    drop: [],
    enfeeble: { name: "Paralyze", left: JUBAKU_SECONDS, power: 20 },
    hate: { ce: 20, ve: 100 },
  };
}

/**
 * Yonin while it is up, and Innin while it is up. They do not stack.
 * Front bonuses on Yonin apply when you are not behind the target.
 * Innin's accuracy, critical hit rate, and ninjutsu damage apply from behind.
 */
export function stanceMods(
  buffs: readonly { name: string; left: number }[],
  behind: boolean,
): { acc: number; eva: number; crit: number; foeCrit: number; nin: number } {
  const yonin = buffs.find((buff) => buff.name === "Yonin");
  const innin = buffs.find((buff) => buff.name === "Innin");
  if (yonin) {
    const power = stancePower(yonin.left);
    return {
      acc: -power,
      eva: behind ? 0 : power,
      crit: 0,
      foeCrit: behind ? 0 : power,
      nin: 0,
    };
  }
  if (innin) {
    const power = stancePower(innin.left);
    return {
      acc: behind ? power : 0,
      eva: -power,
      crit: behind ? power : 0,
      foeCrit: 0,
      nin: behind ? power : 0,
    };
  }
  return { acc: 0, eva: 0, crit: 0, foeCrit: 0, nin: 0 };
}

export const NIN_ABILITIES: NinAbility[] = [
  {
    name: "Mijin Gakure",
    level: 1,
    recast: 3600,
    duration: 0,
    access: "main",
    effect: "Sacrifices your life to damage the enemy. Range 17.6'. Damage is half of your current HP, the page's average. The 6% to 80% resist spread is not rolled. You are knocked out with no experience loss and no Weakness. A Raise returns half your maximum HP. The motion crosses the katanas, then both hands open and a white-red burst takes the body. Recast 1:00:00. Main job only. The damage merit is not applied.",
    ce: 0,
    ve: 0,
  },
  {
    name: "Yonin",
    level: 40,
    recast: STANCE_RECAST,
    duration: STANCE_SECONDS,
    access: "main",
    effect: "Enmity up and accuracy down, about +30 and −30, falling to ±10 one point every 15 seconds. Ninja Tool Expertise would rise with it, and tools are not spent. In front of the target, evasion is likely +30 and the enemy's critical hit rate is likely −30%, on that same decay. Utsusemi enmity becomes 160 CE / 480 VE. Innin wears off. The motion steps in and crosses the blades under a red ring. Duration 0:05:00. Recast 0:03:00, shared with Innin. Cumulative enmity 1, volatile enmity 600. Not a support job ability. The HP merit is not applied.",
    ce: 1,
    ve: 600,
  },
  {
    name: "Innin",
    level: 40,
    recast: STANCE_RECAST,
    duration: STANCE_SECONDS,
    access: "main",
    effect: "Enmity down, about −20 falling toward −10, and evasion down about 30 falling to 10. From behind the target, accuracy, critical hit rate, and ninjutsu damage are about +30% and fall to ±10, one point every 15 seconds. Yonin wears off. The motion slips a half-step back and the off hand seals under a violet ring. Duration 0:05:00. Recast 0:03:00, shared with Yonin. Cumulative enmity 1, volatile enmity 60. Not a support job ability. The skillchain merit is not applied.",
    ce: 1,
    ve: 60,
  },
  {
    name: "Sange",
    level: 75,
    recast: 180,
    duration: 60,
    access: "main",
    merit: true,
    effect: "Daken would proc on every swing and consume a shuriken. Further merits add ranged accuracy. No merit ranks are unlocked.",
    ce: 0,
    ve: 0,
  },
];

export const NIN_TRAITS: NinTrait[] = [
  { name: "Stealth", level: 5, access: "sub", effect: "Movement speed +12% while Invisible. The page does not print the percent." },
  { name: "Resist Bind", level: 10, access: "sub", effect: "5% chance to fully resist Bind. The page does not print it. Tier IV is described as about 20%." },
  { name: "Dual Wield", level: 10, access: "sub", effect: "Delay −10% while two one-handed weapons are equipped." },
  { name: "Subtle Blow", level: 15, access: "sub", effect: "Monster TP gain −5." },
  { name: "Max HP Boost", level: 20, access: "sub", effect: "+30 HP. The higher tier replaces this. It does not stack with another job's Max HP Boost." },
  { name: "Dual Wield II", level: 25, access: "sub", effect: "Delay −15%." },
  { name: "Daken", level: 25, access: "sub", effect: "20% chance to throw a shuriken on auto-attack. No shuriken is equipped." },
  { name: "Resist Bind II", level: 30, access: "sub", effect: "10% chance to fully resist Bind." },
  { name: "Subtle Blow II", level: 30, access: "sub", effect: "Monster TP gain −10." },
  { name: "Daken II", level: 40, access: "sub", effect: "25%. A level-37 subjob has not learned it." },
  { name: "Max HP Boost II", level: 40, access: "sub", effect: "+60 HP. A level-37 subjob has not learned it." },
  { name: "Dual Wield III", level: 45, access: "sub", effect: "Delay −25%. A level-37 subjob has not learned it." },
  { name: "Subtle Blow III", level: 45, access: "sub", effect: "Monster TP gain −15%. A level-37 subjob has not learned it." },
  { name: "Resist Bind III", level: 50, access: "master-sub", effect: "15%. A support job needs master levels." },
  { name: "Damage Limit+ I", level: 50, access: "master-sub", effect: "+26/256 physical pDIF cap. A normal subjob does not have it." },
  { name: "Daken III", level: 55, access: "master-sub", effect: "30%. A support job needs master levels." },
  { name: "Subtle Blow IV", level: 60, access: "main", effect: "Monster TP gain −20. Main job only." },
  { name: "Max HP Boost III", level: 60, access: "main", effect: "+120 HP. Main job only." },
  { name: "Dual Wield IV", level: 65, access: "main", effect: "Delay −30%. Main job only. This is the level-75 tier." },
  { name: "Resist Bind IV", level: 70, access: "main", effect: "20%. Main job only." },
  { name: "Daken IV", level: 70, access: "main", effect: "35%. Main job only. Not rolled without a shuriken." },
  { name: "Subtle Blow V", level: 75, access: "main", effect: "Monster TP gain −25. Main job only." },
  { name: "Ninja Tool Expertise", level: 75, access: "main", effect: "Merit. Occasionally skips a tool. No ranks are unlocked, and tools are already not spent." },
];

export const NIN_SKILLS: NinSkill[] = [
  { name: "Hand-to-Hand", rank: "E" },
  { name: "Dagger", rank: "C+" },
  { name: "Sword", rank: "C" },
  { name: "Katana", rank: "A+" },
  { name: "Great Katana", rank: "C-" },
  { name: "Club", rank: "E" },
  { name: "Archery", rank: "E" },
  { name: "Marksmanship", rank: "C" },
  { name: "Throwing", rank: "A+" },
  { name: "Evasion", rank: "A" },
  { name: "Parrying", rank: "A" },
  { name: "Ninjutsu", rank: "A" },
];

export function assertNin(): void {
  const naked = characterBase("hume", "NIN", 75);
  if (naked.hp !== 1046 || naked.mp !== 0 || naked.str !== 61 || naked.dex !== 65 || naked.vit !== 61 || naked.agi !== 65 || naked.int !== 56 || naked.mnd !== 44 || naked.chr !== 48) {
    throw new Error("Hume NIN 75");
  }
  if (ninDualWield(75, "main") !== 0.3 || ninDualWield(37, "sub") !== 0.15 || ninDualWield(45, "sub") !== 0.25 || ninDualWield(65, "sub") !== 0.25) {
    throw new Error("Dual Wield");
  }
  if (ninSubtleBlow(75, "main") !== 25 || ninSubtleBlow(37, "sub") !== 10 || ninSubtleBlow(45, "sub") !== 15) throw new Error("Subtle Blow");
  if (ninMaxHp(75, "main") !== 120 || ninMaxHp(37, "sub") !== 30 || ninMaxHp(40, "sub") !== 60) throw new Error("Max HP Boost");
  if (dakenRate(75, "main") !== 0.35 || dakenRate(37, "sub") !== 0.2 || dakenRate(55, "sub") !== 0.25 || dakenRate(55, "master-sub") !== 0.3) {
    throw new Error("Daken");
  }
  if (resistBind(75, "main") !== 0.2 || resistBind(37, "sub") !== 0.1 || resistBind(50, "sub") !== 0.1) throw new Error("Resist Bind");
  if (ninDamageLimit(75, "main") !== 26 / 256 || ninDamageLimit(37, "sub") !== 0) throw new Error("Damage Limit");
  if (stealthMove(5) !== 0.12 || stealthMove(4) !== 0) throw new Error("Stealth");
  if (stancePower(300) !== 30 || stancePower(300 - 15) !== 29 || stancePower(0) !== 10) throw new Error("stance decay");
  if (utsusemiShadows(1, true) !== 3 || utsusemiShadows(1, false) !== 3 || utsusemiShadows(2, true) !== 4 || utsusemiShadows(2, false) !== 3) {
    throw new Error("Utsusemi shadows");
  }
  if (skillCap("A+", 75) !== 276 || skillCap("A", 75) !== 269) throw new Error("skill caps");
  if (ninjutsuPotency(1, 269) !== 2 || ninjutsuPotency(3, 269) !== 1) throw new Error("San is under the skill floor");
  if (ninjutsuDamage(1, 269, 0) !== 56 || ninjutsuDamage(3, 269, 0) !== 134) throw new Error("ninjutsu base");
  if (ninjutsuDamage(1, 269, 10) !== Math.floor((28 + Math.floor(10 * 0.5)) * 2)) throw new Error("ninjutsu dINT");
  if (mijinDamage(1166) !== 583 || mijinRaiseHp(1166) !== 583) throw new Error("Mijin");
  const front = stanceMods([{ name: "Yonin", left: 300 }], false);
  if (front.acc !== -30 || front.eva !== 30 || front.foeCrit !== 30 || front.nin !== 0) throw new Error("Yonin front");
  const rear = stanceMods([{ name: "Innin", left: 300 }], true);
  if (rear.acc !== 30 || rear.eva !== -30 || rear.crit !== 30 || rear.nin !== 30) throw new Error("Innin behind");
  if (NIN_ABILITIES.filter((ability) => ability.level <= 75 && !ability.merit).map((ability) => ability.name).join() !== "Mijin Gakure,Yonin,Innin") {
    throw new Error("NIN abilities");
  }
  const bare = (name: string, nin: NonNullable<Spell["nin"]>): Spell =>
    ({ name, school: "ninjutsu", level: 1, jobs: ["NIN"], tool: { name: "Tool", count: 1, substitute: "Sub" }, nin }) as Spell;
  const cast = { skill: 269, dInt: 0, main: true, yonin: false, inninPower: 0, behind: false, shadows: null, blindDown: 0 };
  const hojo = landNinjutsu(bare("Hojo: Ichi", { kind: "slow", tier: 1 }), cast);
  const hojoNi = landNinjutsu(bare("Hojo: Ni", { kind: "slow", tier: 2 }), cast);
  if (!hojo || hojo.enfeeble?.power !== 150 || hojo.enfeeble.left !== HOJO_SECONDS || hojo.hate?.ce !== 20) throw new Error("Hojo: Ichi");
  if (!hojoNi || hojoNi.enfeeble?.power !== 200 || hojoNi.hate?.ce !== 80 || hojoNi.hate?.ve !== 240) throw new Error("Hojo: Ni");
  const tonkoNi = landNinjutsu(bare("Tonko: Ni", { kind: "invisible", tier: 2 }), cast);
  const monomi = landNinjutsu(bare("Monomi: Ichi", { kind: "sneak", tier: 1 }), cast);
  if (!tonkoNi || tonkoNi.give?.left !== TONKO_NI_SECONDS || tonkoNi.area || tonkoNi.hate?.ce !== 1 || tonkoNi.hate?.ve !== 0) throw new Error("Tonko: Ni");
  if (!monomi || monomi.give?.left !== MONOMI_SECONDS || monomi.hate?.ce !== 80) throw new Error("Monomi");
  const kura = landNinjutsu(bare("Kurayami: Ichi", { kind: "blind", tier: 1 }), { ...cast, blindDown: 30 });
  const kuraNi = landNinjutsu(bare("Kurayami: Ni", { kind: "blind", tier: 2 }), { ...cast, blindDown: 40 });
  if (!kura?.noEffect || !kuraNi || kuraNi.enfeeble?.accDown !== 30 || kuraNi.enfeeble.left !== KURAYAMI_NI_SECONDS) throw new Error("Kurayami overwrite");
  const huton = landNinjutsu(bare("Huton: Ichi", { kind: "huton", tier: 1, element: "wind", weaken: "ice" }), cast);
  if (!huton || huton.give || huton.dmg !== 56 || huton.enfeeble?.power !== NIN_RESIST_DOWN || huton.enfeeble.left !== NIN_RESIST_SECONDS) {
    throw new Error("Huton is wind damage");
  }
  const doku = landNinjutsu(bare("Dokumori: Ichi", { kind: "poison", tier: 1 }), cast);
  const jubaku = landNinjutsu(bare("Jubaku: Ichi", { kind: "paralyze", tier: 1 }), cast);
  if (!doku || doku.enfeeble?.left !== DOKUMORI_SECONDS || doku.enfeeble.dot !== 3) throw new Error("Dokumori");
  if (!jubaku || jubaku.enfeeble?.left !== JUBAKU_SECONDS || jubaku.enfeeble.power !== 20) throw new Error("Jubaku");
}
