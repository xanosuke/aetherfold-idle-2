// @ts-nocheck
/** Restored from the yard's Corsair check bundle after the source was overwritten. Behavior matches that build. */
import { skillCap, type SkillRank } from "./skills";
import { characterBase } from "./stats";
import { fieldStoreTp } from "./fov";
import type { JobAccess } from "./blm";

export type QuickDrawLand = {
  element: string;
  debuff?: string;
  sleep?: boolean;
  dispel?: boolean;
};

type CorAbility = {
  name: string;
  level: number;
  recast: number;
  duration: number;
  access: JobAccess;
  effect: string;
  merit?: boolean;
};

type CorTrait = {
  name: string;
  level: number;
  access: JobAccess;
  effect: string;
  merit?: boolean;
};

type CorSkill = {
  name: string;
  rank: SkillRank;
};

var COR_CAP = 75;
var WILD_CARD_RECAST = 60 * 60;
var ROLL_RECAST = 60;
var ROLL_SECONDS = 5 * 60;
var ROLL_ELEVEN_RECAST = 30;
var DOUBLE_UP_RECAST = 5;
var DOUBLE_UP_WINDOW = 45;
var ROLL_RANGE = 7.9;
var BUST_LINE = 11;
var QUICK_DRAW_RECAST = 60;
var QUICK_DRAW_RANGE = 22;
var RANDOM_DEAL_RECAST = 20 * 60;
var SNAKE_EYE_RECAST = 5 * 60;
var SNAKE_EYE_SECONDS = 60;
var FOLD_RECAST = 5 * 60;
var ROLL_CE = 1;
var ROLL_VE = 80;
var COR_CE = 1;
var COR_VE = 300;
var ONE_HOURS = /* @__PURE__ */ new Set([
  "Mighty Strikes",
  "Hundred Fists",
  "Benediction",
  "Manafont",
  "Chainspell",
  "Perfect Dodge",
  "Invincible",
  "Blood Weapon",
  "Meikyo Shisui",
  "Eagle Eye Shot",
  "Astral Flow",
  "Azure Lore",
  "Overdrive",
  "Familiar",
  "Mijin Gakure",
  "Spirit Surge",
  "Wild Card",
  "Trance"
]);
var EVA_TABLE = [10, 13, 15, 40, 18, 20, 25, 5, 28, 30, 50];
function rollAccess(level): JobAccess {
  if (level >= 61) return "main";
  if (level >= 50) return "master-sub";
  return "sub";
}
function rollRow(index, name, level, lucky, unlucky, effect, extra = {}) {
  return { index, name, level, access: rollAccess(level), lucky, unlucky, effect, ...extra };
}
var COR_ROLLS = [
  rollRow(1, "Corsair's Roll", 5, 5, 9, "Experience, capacity, and exemplar points, in percent. The number is exact. Nothing in this yard grants experience yet. Corsair's modifier is +5, and only when Corsair is the main job. A bust is \u22126 and does not take the modifier.", {
    values: [10, 11, 11, 12, 20, 13, 15, 16, 8, 17, 24],
    bust: -6,
    plus: 2,
    job: "COR",
    jobBonus: 5
  }),
  rollRow(2, "Ninja Roll", 8, 4, 8, "Evasion. Ninja's modifier is +15. A bust is \u221215.", {
    values: EVA_TABLE,
    bust: -15,
    plus: 5,
    job: "NIN",
    jobBonus: 15,
    apply: "evasion"
  }),
  rollRow(3, "Hunter's Roll", 11, 4, 8, "Accuracy and ranged accuracy. Ranger's modifier is +15. A bust is \u221215.", {
    values: EVA_TABLE,
    bust: -15,
    plus: 5,
    job: "RNG",
    jobBonus: 15,
    apply: "acc"
  }),
  rollRow(4, "Chaos Roll", 14, 4, 8, "Attack and ranged attack, in /1024. This yard's attack bonuses are /256, so the number is converted. Dark Knight's modifier is +100. A bust is \u2212100.", {
    values: [64, 80, 96, 256, 112, 128, 160, 32, 176, 192, 320],
    bust: -100,
    plus: 32,
    job: "DRK",
    jobBonus: 100,
    apply: "attack"
  }),
  rollRow(5, "Magus's Roll", 17, 2, 6, "Magic defense bonus. Catalogued. Blue Mage's modifier is +8. A bust is \u22128.", {
    values: [5, 20, 6, 8, 9, 3, 10, 13, 14, 15, 25],
    bust: -8,
    plus: 2,
    job: "BLU",
    jobBonus: 8
  }),
  rollRow(6, "Healer's Roll", 20, 3, 7, "Cure potency received. Catalogued. White Mage's modifier is +4. A bust is \u22124.", {
    values: [3, 4, 12, 5, 6, 7, 1, 8, 9, 10, 16],
    bust: -4,
    plus: 1,
    job: "WHM",
    jobBonus: 4
  }),
  rollRow(7, "Drachen Roll", 23, 4, 8, "Pet accuracy. Catalogued. Dragoon's modifier is +15. A bust has no effect.", {
    values: EVA_TABLE,
    bust: 0,
    plus: 5,
    job: "DRG",
    jobBonus: 15
  }),
  rollRow(8, "Choral Roll", 26, 2, 6, "Spell interruption rate. Catalogued. Bard's modifier is \u221225. A bust is +25.", {
    values: [-8, -42, -11, -15, -19, -4, -23, -27, -31, -35, -50],
    bust: 25,
    plus: -4,
    job: "BRD",
    jobBonus: -25
  }),
  rollRow(9, "Monk's Roll", 31, 3, 7, "Subtle Blow. Monk's modifier is +10. A bust is \u221210.", {
    values: [8, 10, 32, 12, 14, 16, 4, 20, 22, 24, 40],
    bust: -10,
    plus: 4,
    job: "MNK",
    jobBonus: 10,
    apply: "subtle"
  }),
  rollRow(10, "Beast Roll", 34, 4, 8, "Pet attack and ranged attack, in /1024, the same scale as Chaos Roll. Stored. No pet attack is rolled from it. Beastmaster's modifier is +100. A bust has no effect.", {
    values: [64, 80, 96, 256, 112, 128, 160, 32, 176, 192, 320],
    bust: 0,
    plus: 32,
    job: "BST",
    jobBonus: 100
  }),
  rollRow(11, "Samurai Roll", 37, 2, 6, "Store TP. It multiplies with the Store TP already on the sheet. Samurai's modifier is +10. A bust is \u221210.", {
    values: [8, 32, 10, 12, 14, 4, 16, 20, 22, 24, 40],
    bust: -10,
    plus: 4,
    job: "SAM",
    jobBonus: 10,
    apply: "stp"
  }),
  rollRow(12, "Evoker's Roll", 40, 5, 9, "MP each tick. Corsair has no MP of its own, so this matters with an MP sub. Summoner's modifier is +1. A bust is \u22121.", {
    values: [1, 1, 1, 1, 3, 2, 2, 2, 1, 3, 4],
    bust: -1,
    plus: 1,
    job: "SMN",
    jobBonus: 1,
    apply: "refresh"
  }),
  rollRow(13, "Rogue's Roll", 43, 5, 9, "Critical hit rate. Thief's modifier is +5. A bust is \u22125.", {
    values: [1, 2, 3, 4, 10, 5, 6, 7, 1, 8, 14],
    bust: -5,
    plus: 1,
    job: "THF",
    jobBonus: 5,
    apply: "crit"
  }),
  rollRow(14, "Warlock's Roll", 46, 4, 8, "Magic accuracy. Stored. No magic-accuracy check reads it yet. Red Mage's modifier is +15. A bust is \u221215.", {
    values: EVA_TABLE,
    bust: -15,
    plus: 5,
    job: "RDM",
    jobBonus: 15
  }),
  rollRow(15, "Fighter's Roll", 49, 5, 9, "Double Attack. Warrior's modifier is +5. The bust cell is blank, so a bust does nothing.", {
    values: [1, 2, 3, 4, 10, 5, 6, 6, 1, 7, 15],
    bust: 0,
    plus: 1,
    job: "WAR",
    jobBonus: 5,
    apply: "da"
  }),
  rollRow(16, "Puppet Roll", 52, 3, 7, "Pet magic accuracy and pet magic attack. The page prints one number for both. Stored. Puppetmaster's modifier is +12. A bust is \u221212. A normal subjob has not learned it.", {
    values: [5, 8, 35, 11, 14, 18, 2, 22, 26, 30, 40],
    bust: -12,
    plus: 3,
    job: "PUP",
    jobBonus: 12
  }),
  rollRow(17, "Gallant's Roll", 55, 3, 7, "Defense, in /1024, converted into this yard's /256 defense bonus. Paladin's modifier is +120. A bust is \u2212120. A normal subjob has not learned it.", {
    values: [48, 60, 200, 72, 88, 104, 32, 120, 140, 160, 240],
    bust: -120,
    plus: 24,
    job: "PLD",
    jobBonus: 120,
    apply: "defense"
  }),
  rollRow(18, "Wizard's Roll", 58, 5, 9, "Magic attack bonus. Stored. No spell reads it yet. Black Mage's modifier is +10. A bust is \u221210. A normal subjob has not learned it.", {
    values: [4, 6, 8, 10, 25, 12, 14, 17, 2, 20, 30],
    bust: -10,
    plus: 2,
    job: "BLM",
    jobBonus: 10
  }),
  rollRow(19, "Dancer's Roll", 61, 3, 7, "Regen, hit points each tick. Dancer's modifier is +4. A bust is \u22124. Main job only.", {
    values: [3, 4, 12, 5, 6, 7, 1, 8, 9, 10, 16],
    bust: -4,
    plus: 2,
    job: "DNC",
    jobBonus: 4,
    apply: "regen"
  }),
  rollRow(20, "Scholar's Roll", 64, 2, 6, "Conserve MP, added to the trait's proc chance. Scholar's modifier is +3. The Roll +1 cell is blank, so no plus is stored. A bust is \u22123. Main job only.", {
    values: [2, 10, 3, 4, 4, 1, 5, 6, 7, 7, 12],
    bust: -3,
    job: "SCH",
    jobBonus: 3,
    apply: "conserve"
  }),
  rollRow(21, "Naturalist's Roll", 67, 3, 7, "Enhancing magic duration, in percent. Stored. Duration is not stretched by it yet. Geomancer's modifier is +5. A bust is \u22125. Main job only.", {
    values: [6, 7, 15, 8, 9, 10, 5, 11, 12, 13, 20],
    bust: -5,
    plus: 1,
    job: "GEO",
    jobBonus: 5
  }),
  rollRow(22, "Runeist's Roll", 70, 4, 8, "Magic evasion. Stored. No magic-evasion check reads it yet. Rune Fencer's modifier is +15. A bust is \u221215. Main job only.", {
    values: EVA_TABLE,
    bust: -15,
    plus: 5,
    job: "RUN",
    jobBonus: 15
  })
];
var ROLL_BY_NAME = new Map(COR_ROLLS.map((roll) => [roll.name, roll]));
var ROLL_BY_INDEX = new Map(COR_ROLLS.map((roll) => [roll.index, roll]));
function isRoll(name) {
  return ROLL_BY_NAME.has(name);
}
function rollByName(name) {
  return ROLL_BY_NAME.get(name);
}
function rollFace(power) {
  const face = Math.abs(Math.floor(power)) % 100;
  return face >= 1 && face <= 11 ? face : 0;
}
function rollHasBonus(power) {
  return power >= 100;
}
function rollPower(face, bonus) {
  return (bonus ? 100 : 0) + face;
}
function bustList(power) {
  const packed = Math.abs(Math.floor(power));
  const first = Math.floor(packed / 100);
  const second = packed % 100;
  const out = [];
  if (first > 0) out.push(first);
  if (second > 0) out.push(second);
  return out;
}
function bustCount(power) {
  return bustList(power).length;
}
function packBust(list) {
  return (list[0] ?? 0) * 100 + (list[1] ?? 0);
}
var SHOTS = [
  ["Fire Shot", "fire", "Fire damage. An existing Burn is deepened by 4, then by 2. Burn itself is not applied."],
  ["Ice Shot", "ice", "Ice damage. An existing Frost is deepened by 4, then by 2. An existing Paralyze gains 5, twice. Frost is not applied."],
  ["Wind Shot", "wind", "Wind damage. An existing Choke is deepened by 4, then by 2. Choke itself is not applied."],
  ["Earth Shot", "earth", "Earth damage. An existing Rasp is deepened by 4, then by 2. An existing Slow gains 102/1024, twice. Rasp is not applied."],
  ["Thunder Shot", "thunder", "Lightning damage. An existing Shock is deepened by 4, then by 2. Shock itself is not applied."],
  ["Water Shot", "water", "Water damage. An existing Drown is deepened by 4, then by 2. Drown itself is not applied."],
  ["Light Shot", "light", "Light sleep for 60 seconds. It does not use the damage formula. An existing Dia gains 28/1024 defense down and 1 damage over time, once."],
  ["Dark Shot", "dark", "Dispels one beneficial effect. This foe has none, so that part has no effect. It does not use the damage formula. An existing Bio gains 28/1024 attack down and 3 damage over time, once. An existing Blind loses 10 accuracy, twice."]
];
var QUICK_DRAWS = SHOTS.map((shot) => shot[0]);
var SHOT_DEBUFF = {
  fire: "Burn",
  ice: "Frost",
  wind: "Choke",
  earth: "Rasp",
  thunder: "Shock",
  water: "Drown"
};
function quickDrawBonus(already) {
  if (already >= 2) return 0;
  return already === 0 ? 4 : 2;
}
function isQuickDraw(name) {
  return QUICK_DRAWS.includes(name);
}
function corsairJobLevel(job, sub, subLevel, mainLevel) {
  if (job === "COR") return mainLevel;
  if (sub === "COR") return subLevel;
  return 0;
}
function corRapidShot(level) {
  return level >= 15 ? 0.25 : 0;
}
function corRecycle(level, access) {
  if (access === "main" && level >= 65) return 0.2;
  if (level >= 35) return 0.1;
  return 0;
}
function corResistParalyze(level, access) {
  if (access === "main" && level >= 65) return 0.25;
  if (level >= 45) return 0.2;
  if (level >= 25) return 0.15;
  if (level >= 5) return 0.1;
  return 0;
}
function corResistAmnesia(level, access) {
  if (access === "main" && level >= 70) return 0.2;
  if (access !== "sub" && level >= 50) return 0.15;
  if (level >= 30) return 0.1;
  return 0;
}
function quickDrawDamage(gun, bullet, agi, targetAgi) {
  const base = (gun + bullet) * 2;
  const scaled = base * (1 + (agi - targetAgi) / 128);
  return Math.max(0, Math.floor(scaled));
}
function maxRolls(main) {
  return main ? 2 : 1;
}
function maxBusts(main) {
  return main ? 2 : 1;
}
function addApply(out, apply, value) {
  if (apply === "acc") out.acc += value;
  else if (apply === "evasion") out.eva += value;
  else if (apply === "crit") out.crit += value;
  else if (apply === "attack") out.attackNumer += Math.round(value * 256 / 1024);
  else if (apply === "defense") out.defenseNumer += Math.round(value * 256 / 1024);
  else if (apply === "stp") out.stp += value;
  else if (apply === "da") out.da += value / 100;
  else if (apply === "refresh") out.refresh += value;
  else if (apply === "regen") out.regen += value;
  else if (apply === "conserve") out.conserve += value;
  else out.subtle += value;
}
function rollCombat(buffs) {
  const out = { acc: 0, eva: 0, crit: 0, attackNumer: 0, defenseNumer: 0, stp: 0, da: 0, refresh: 0, subtle: 0, regen: 0, conserve: 0 };
  for (const buff of buffs) {
    const row = ROLL_BY_NAME.get(buff.name);
    if (!row?.values || !row.apply) continue;
    const face = rollFace(buff.power ?? 0);
    if (face < 1) continue;
    let value = row.values[face - 1] ?? 0;
    if (rollHasBonus(buff.power ?? 0) && row.jobBonus != null) value += row.jobBonus;
    addApply(out, row.apply, value);
  }
  const bust = buffs.find((buff) => buff.name === "Bust");
  if (bust) {
    for (const index of bustList(bust.power ?? 0)) {
      const row = ROLL_BY_INDEX.get(index);
      if (!row?.apply || row.bust == null || row.bust === 0 || !row.values) continue;
      addApply(out, row.apply, row.bust);
    }
  }
  return out;
}
function corsairExpPercent(buffs) {
  let pct = 0;
  for (const buff of buffs) {
    if (buff.name !== "Corsair's Roll") continue;
    const row = ROLL_BY_NAME.get(buff.name);
    const face = rollFace(buff.power ?? 0);
    if (!row?.values || face < 1) continue;
    pct += row.values[face - 1] ?? 0;
    if (rollHasBonus(buff.power ?? 0) && row.jobBonus != null) pct += row.jobBonus;
  }
  const bust = buffs.find((buff) => buff.name === "Bust");
  if (bust) {
    for (const index of bustList(bust.power ?? 0)) {
      const row = ROLL_BY_INDEX.get(index);
      if (row?.name === "Corsair's Roll" && row.bust != null) pct += row.bust;
    }
  }
  return pct;
}
function choralInterrupt(buffs) {
  let pct = 0;
  for (const buff of buffs) {
    if (buff.name !== "Choral Roll") continue;
    const row = ROLL_BY_NAME.get(buff.name);
    const face = rollFace(buff.power ?? 0);
    if (!row?.values || face < 1) continue;
    pct += row.values[face - 1] ?? 0;
    if (rollHasBonus(buff.power ?? 0) && row.jobBonus != null) pct += row.jobBonus;
  }
  const bust = buffs.find((buff) => buff.name === "Bust");
  if (bust) {
    for (const index of bustList(bust.power ?? 0)) {
      const row = ROLL_BY_INDEX.get(index);
      if (row?.name === "Choral Roll" && row.bust != null) pct += row.bust;
    }
  }
  return pct;
}
function rolledStoreTp(base, buffs) {
  const mult = base > 0 ? base : 1;
  return mult * (1 + rollCombat(buffs).stp / 100) * (1 + fieldStoreTp(buffs) / 100);
}
function fighterDoubleAttack(rate, buffs) {
  return Math.min(1, Math.max(0, rate + rollCombat(buffs).da));
}
function d6(snake, die) {
  if (snake) return 1;
  if (die != null && die >= 1 && die <= 6) return Math.floor(die);
  return 1 + Math.floor(Math.random() * 6);
}
function jobBonus(roll, main, party) {
  if (!roll.job) return false;
  if (roll.job === "COR") return main || party.includes("COR");
  return party.includes(roll.job);
}
function otherRolls(name) {
  return COR_ROLLS.map((roll) => roll.name).filter((roll) => roll !== name);
}
function bustPacked(ctx) {
  if (ctx.bustPower != null) return ctx.bustPower;
  const n = Math.max(0, Math.min(2, ctx.busts ?? 0));
  return packBust(Array.from({ length: n }, () => 1));
}
function elevenUp(rolls, busts) {
  return busts === 0 && rolls.some((roll) => rollFace(roll.power) === 11);
}
function describeFace(roll, face, bonus) {
  const luck = face === roll.lucky ? " Lucky." : face === roll.unlucky ? " Unlucky." : "";
  const mark = bonus ? " The job modifier is in." : "";
  if (!roll.values) return `${roll.name} is ${face}.${luck}${mark} The potency table is not in this yard.`;
  let value = roll.values[face - 1] ?? 0;
  if (bonus && roll.jobBonus != null) value += roll.jobBonus;
  return `${roll.name} is ${face} (${value}).${luck}${mark}`;
}
function castRoll(name, ctx, roll) {
  const main = ctx.corMain;
  const rolls = ctx.rolls ?? [];
  const packed = bustPacked(ctx);
  const busts = bustCount(packed);
  if (busts >= maxBusts(main)) return { ok: false, text: "Bust prevents another roll." };
  if (rolls.length >= maxRolls(main)) return { ok: false, text: main ? "Two rolls are already up." : "A support Corsair can keep one roll." };
  if (rolls.some((held) => held.name === name)) return { ok: false, text: `${name} is already up.` };
  const snake = ctx.snake === true;
  const die = d6(snake, ctx.die);
  const face = die;
  const bonus = jobBonus(roll, main, ctx.partyJobs ?? []);
  const power = rollPower(face, bonus);
  const clock = face === 11 ? 0 : elevenUp(rolls, busts) ? ROLL_ELEVEN_RECAST : ROLL_RECAST;
  const xi = face === 11 ? " An 11. Phantom Roll is ready again." : "";
  return {
    ok: true,
    text: `${describeFace(roll, face, bonus)}${xi} Recast ${clock === 0 ? "0" : clock === 30 ? "0:00:30" : "0:01:00"}.`,
    recast: clock,
    share: otherRolls(name),
    hate: { ce: ROLL_CE, ve: ROLL_VE },
    consumeSnake: snake,
    roll: { name, power, duration: ROLL_SECONDS, keep: false, bust: false, remove: false }
  };
}
function castDoubleUp(ctx) {
  const rolls = ctx.rolls ?? [];
  const open = rolls.filter((roll) => roll.left > ROLL_SECONDS - DOUBLE_UP_WINDOW);
  open.sort((a, b) => b.left - a.left);
  const target = open[0];
  if (!target) return { ok: false, text: "Double-Up is no longer available." };
  const row = ROLL_BY_NAME.get(target.name);
  if (!row) return { ok: false, text: "Double-Up is no longer available." };
  const snake = ctx.snake === true;
  const die = d6(snake, ctx.die);
  const current = rollFace(target.power);
  const bonus = rollHasBonus(target.power);
  if (current === 11) {
    return {
      ok: true,
      text: `${target.name} stays on 11. Double-Up cannot bust an 11. Phantom Roll is ready again.`,
      recast: DOUBLE_UP_RECAST,
      share: COR_ROLLS.map((roll) => roll.name),
      shareRecast: 0,
      hate: { ce: ROLL_CE, ve: ROLL_VE },
      consumeSnake: snake,
      roll: { name: target.name, power: target.power, duration: target.left, keep: true, bust: false, remove: false }
    };
  }
  const total = current + die;
  if (total > BUST_LINE) {
    const next = packBust([...bustList(bustPacked(ctx)), row.index].slice(0, 2));
    return {
      ok: true,
      text: `Bust. ${target.name} is lost.${row.bust ? ` The bust is ${row.bust}.` : ""}`,
      recast: DOUBLE_UP_RECAST,
      hate: { ce: ROLL_CE, ve: ROLL_VE },
      consumeSnake: snake,
      roll: { name: target.name, power: target.power, duration: 0, keep: false, bust: true, remove: true },
      fold: { name: null, bustPower: next }
    };
  }
  const face = total;
  const power = rollPower(face, bonus);
  const xi = face === 11;
  return {
    ok: true,
    text: `${describeFace(row, face, bonus)}${xi ? " An 11. Phantom Roll is ready again." : ""} The duration does not refresh.`,
    recast: DOUBLE_UP_RECAST,
    ...xi ? { share: COR_ROLLS.map((roll) => roll.name), shareRecast: 0 } : {},
    hate: { ce: ROLL_CE, ve: ROLL_VE },
    consumeSnake: snake,
    roll: { name: target.name, power, duration: target.left, keep: true, bust: false, remove: false }
  };
}
function castQuickDraw(name, ctx) {
  if (ctx.gun !== true) return { ok: false, text: `${name} needs a gun equipped.` };
  if (ctx.bullet !== true) return { ok: false, text: "You do not have the proper ammunition equipped." };
  if (ctx.targeted !== true) return { ok: false, text: `${name} needs a target.` };
  if ((ctx.distance ?? 0) > QUICK_DRAW_RANGE) return { ok: false, text: `${name} is out of range.` };
  const shot = SHOTS.find((row) => row[0] === name);
  const element = shot?.[1] ?? "fire";
  const elemental = element !== "light" && element !== "dark";
  const dmg = elemental ? quickDrawDamage(ctx.gunDmg ?? 0, ctx.bulletDmg ?? 0, ctx.agi ?? 0, ctx.targetAgi ?? 0) : 0;
  const debuff = element === "light" || element === "dark" ? void 0 : SHOT_DEBUFF[element];
  const kind = element === "light" ? " Sleep for 60 seconds." : element === "dark" ? " Dispel." : ` ${dmg} ${element} damage.`;
  return {
    ok: true,
    text: `${name}.${kind} The card is not spent. The bullet is not spent.`,
    recast: QUICK_DRAW_RECAST,
    share: QUICK_DRAWS.filter((row) => row !== name),
    ...dmg > 0 ? { bash: dmg } : {},
    quickDraw: {
      element,
      ...debuff ? { debuff } : {},
      ...element === "light" ? { sleep: true } : {},
      ...element === "dark" ? { dispel: true } : {}
    }
  };
}
function castWildCard(ctx) {
  const snake = ctx.snake === true;
  const face = d6(snake, ctx.die);
  const resetSp = face >= 5;
  let extra = "Job abilities come off recast. One-hour abilities stay.";
  let tp = 0;
  let mp = 0;
  if (face === 3) {
    tp = 1e3;
    extra = "Job abilities come off recast. One-hour abilities stay. TP +1000.";
  } else if (face === 4) {
    tp = 3e3;
    extra = "Job abilities come off recast. One-hour abilities stay. TP +3000.";
  } else if (face === 5) {
    mp = 0.5;
    extra = "Job abilities come off recast, including other one-hour abilities. MP +50%.";
  } else if (face === 6) {
    mp = 1;
    extra = "Job abilities come off recast, including other one-hour abilities. MP is refilled.";
  }
  return {
    ok: true,
    text: `Wild Card is ${face}. ${extra}`,
    recast: WILD_CARD_RECAST,
    hate: { ce: COR_CE, ve: COR_VE },
    consumeSnake: snake,
    wildCard: { resetSp },
    ...tp > 0 ? { tpGrant: tp } : {},
    ...mp > 0 ? { mpFrac: mp } : {}
  };
}
function castRandomDeal(ctx) {
  const waiting = (ctx.waiting ?? []).filter((name2) => name2 !== "Random Deal" && !ONE_HOURS.has(name2));
  if (waiting.length === 0) {
    return {
      ok: true,
      text: "Random Deal finds nothing on recast.",
      recast: RANDOM_DEAL_RECAST,
      hate: { ce: COR_CE, ve: COR_VE },
      randomDeal: null
    };
  }
  const die = d6(false, ctx.die);
  const name = waiting[(die - 1) % waiting.length] ?? waiting[0];
  return {
    ok: true,
    text: `Random Deal resets ${name}.`,
    recast: RANDOM_DEAL_RECAST,
    hate: { ce: COR_CE, ve: COR_VE },
    randomDeal: name
  };
}
function castFold(ctx) {
  const packed = bustPacked(ctx);
  const busts = bustList(packed);
  if (busts.length > 0) {
    const next = packBust(busts.slice(1));
    return {
      ok: true,
      text: next === 0 ? "Fold erases the bust." : "Fold erases one bust.",
      recast: FOLD_RECAST,
      hate: { ce: COR_CE, ve: COR_VE },
      fold: { name: null, bustPower: next }
    };
  }
  const rolls = [...ctx.rolls ?? []];
  rolls.sort((a, b) => b.left - a.left);
  const target = rolls[0];
  if (!target) return { ok: false, text: "Fold has no roll or bust to erase." };
  return {
    ok: true,
    text: `Fold erases ${target.name}.`,
    recast: FOLD_RECAST,
    hate: { ce: COR_CE, ve: COR_VE },
    fold: { name: target.name, bustPower: 0 }
  };
}
function castCorsair(name, ctx) {
  const roll = ROLL_BY_NAME.get(name);
  const ability = roll ? { name: roll.name, level: roll.level, access: roll.access, recast: ROLL_RECAST } : COR_BY_NAME.get(name);
  if (!ability && !roll) return null;
  const level = ability?.level ?? 0;
  const access = ability?.access ?? "sub";
  if ((ctx.corLevel ?? 0) < level) return { ok: false, text: `${name} is not learned.` };
  if (ctx.recastLeft > 0) return { ok: false, text: `${name} is not ready.` };
  if (access === "main" && ctx.corMain !== true) return { ok: false, text: `${name} requires Corsair as the main job.` };
  if (access === "master-sub" && ctx.corMain !== true) return { ok: false, text: `${name} needs a master-level subjob.` };
  if (roll) return castRoll(name, ctx, roll);
  if (name === "Double-Up") return castDoubleUp(ctx);
  if (isQuickDraw(name)) return castQuickDraw(name, ctx);
  if (name === "Wild Card") return castWildCard(ctx);
  if (name === "Random Deal") return castRandomDeal(ctx);
  if (name === "Snake Eye") {
    return {
      ok: true,
      text: "Snake Eye. The next Phantom Roll, Double-Up, or Wild Card comes up 1.",
      recast: SNAKE_EYE_RECAST,
      hate: { ce: COR_CE, ve: COR_VE },
      buff: { name: "Snake Eye", duration: SNAKE_EYE_SECONDS }
    };
  }
  if (name === "Fold") return castFold(ctx);
  return { ok: false, text: `${name} is not learned.` };
}
function shotAbility(name, element, note) {
  return {
    name,
    level: 40,
    recast: QUICK_DRAW_RECAST,
    duration: 0,
    access: "sub",
    effect: `${element[0].toUpperCase()}${element.slice(1)} Shot. ${note} Needs a gun and a bullet. Range 22'. All eight shots share recast 0:01:00. A level-37 sub has not learned it. The motion is the gun aim. A card of that element appears, and the shot goes through it. The card is not spent. The bullet is not spent.`
  };
}
var COR_ABILITIES: CorAbility[] = [
  {
    name: "Wild Card",
    level: 1,
    recast: WILD_CARD_RECAST,
    duration: 0,
    access: "main",
    effect: "One die for the party. 1 or 2 resets job abilities except one-hour abilities. 3 also gives 1000 TP. 4 also gives 3000 TP. 5 also resets other one-hour abilities and restores 50% of maximum MP. 6 restores MP in full and resets those one-hour abilities. Wild Card never resets itself. Recast 1:00:00. Main job only. The motion raises both hands."
  },
  {
    name: "Corsair's Roll",
    level: 5,
    recast: ROLL_RECAST,
    duration: ROLL_SECONDS,
    access: "sub",
    effect: COR_ROLLS[0].effect + " Lucky 5, unlucky 9. Duration 0:05:00. Range 7.9'. Recast 0:01:00, shared with every Phantom Roll. The right hand flicks the die."
  },
  {
    name: "Double-Up",
    level: 5,
    recast: DOUBLE_UP_RECAST,
    duration: 0,
    access: "sub",
    effect: "Adds another 1\u20136 to the roll that still has more than 45 seconds left, preferring the one with the most time remaining. It does not refresh the duration. A total over 11 busts that roll. An 11 stays 11. Recast 0:00:05."
  },
  ...COR_ROLLS.slice(1).map((roll) => ({
    name: roll.name,
    level: roll.level,
    recast: ROLL_RECAST,
    duration: ROLL_SECONDS,
    access: roll.access,
    effect: `${roll.effect}${roll.lucky > 0 ? ` Lucky ${roll.lucky}, unlucky ${roll.unlucky}.` : ""} Duration 0:05:00. Range 7.9'. The Phantom Roll recast is shared.`
  })),
  ...SHOTS.map((shot) => shotAbility(shot[0], shot[1], shot[2])),
  {
    name: "Random Deal",
    level: 50,
    recast: RANDOM_DEAL_RECAST,
    duration: 0,
    access: "master-sub",
    effect: "Resets one random job ability that is already on recast. It does not reset itself or a one-hour ability. Loaded Deck is a merit and is not applied. Recast 0:20:00. A normal subjob has not learned it. The motion shuffles."
  },
  {
    name: "Snake Eye",
    level: 75,
    recast: SNAKE_EYE_RECAST,
    duration: SNAKE_EYE_SECONDS,
    access: "main",
    effect: "The next Phantom Roll, Double-Up, or Wild Card is forced to 1. It lasts 0:01:00 or until that roll. Recast 0:05:00. Main job only. The merit that can turn a 5 or 6 into an 11 is not applied. The motion points."
  },
  {
    name: "Fold",
    level: 75,
    recast: FOLD_RECAST,
    duration: 0,
    access: "main",
    effect: "Erases one bust before any normal roll. Otherwise it erases the roll with the longest time remaining. Recast 0:05:00. Main job only. The merit that can reset Phantom Roll is not applied. The motion closes a card."
  }
];
var COR_BY_NAME = new Map(COR_ABILITIES.map((ability) => [ability.name, ability]));
var COR_TRAITS: CorTrait[] = [
  { name: "Resist Paralyze", level: 5, access: "sub", effect: "Paralyze resistance +10%. The next tier replaces this. Nothing here rolls the check." },
  { name: "Rapid Shot", level: 15, access: "sub", effect: "About 25% of ranged shots aim faster. The cut is 2% to 50% of that shot. Corsair II is 91." },
  { name: "Resist Paralyze II", level: 25, access: "sub", effect: "Paralyze resistance +15%. Replaces Resist Paralyze. A level-37 sub has this tier. Not rolled." },
  { name: "Resist Amnesia", level: 30, access: "sub", effect: "Amnesia resistance +10%. Nothing here inflicts amnesia, so it is not rolled." },
  { name: "Recycle", level: 35, access: "sub", effect: "10% chance to keep the ammunition. Ammunition is not spent in this yard, so it is not rolled. A level-37 sub has it." },
  { name: "Resist Paralyze III", level: 45, access: "sub", effect: "Paralyze resistance +20%. Replaces Resist Paralyze II. A level-37 sub has not learned it. Not rolled." },
  { name: "Resist Amnesia II", level: 50, access: "master-sub", effect: "Amnesia resistance +15%. Replaces Resist Amnesia. A normal subjob has not learned it. Not rolled." },
  { name: "Recycle II", level: 65, access: "main", effect: "20% chance to keep the ammunition. Replaces Recycle. Main job only. Not rolled." },
  { name: "Resist Paralyze IV", level: 65, access: "main", effect: "Paralyze resistance +25%. Replaces Resist Paralyze III. Main job only. Not rolled." },
  { name: "Resist Amnesia III", level: 70, access: "main", effect: "Amnesia resistance +20%. Replaces Resist Amnesia II. Main job only. Not rolled." },
  { name: "Winning Streak", level: 75, access: "main", effect: "Catalogued. The printed extension is a merit of +20 seconds per rank. Phantom Roll stays at 5 minutes." },
  { name: "Loaded Deck", level: 75, access: "main", effect: "Catalogued. The printed extension is a merit that lowers Random Deal's chance to fail. This yard only resets an ability that is already waiting." }
];
var COR_SKILLS: CorSkill[] = [
  { name: "Dagger", rank: "B+" },
  { name: "Sword", rank: "B-" },
  { name: "Marksmanship", rank: "B" },
  { name: "Throwing", rank: "C+" },
  { name: "Parrying", rank: "A" },
  { name: "Evasion", rank: "D" }
];
function corSkill(name, level) {
  const row = COR_SKILLS.find((skill) => skill.name === name);
  return row ? skillCap(row.rank, level) : 0;
}
var bare = { recastLeft: 0, corLevel: 75, corMain: true };
function assertCor() {
  const hume = characterBase("hume", "COR", 75);
  if (hume.hp !== 1046 || hume.mp !== 0 || hume.str !== 53 || hume.dex !== 61 || hume.vit !== 53 || hume.agi !== 61 || hume.int !== 61 || hume.mnd !== 53 || hume.chr !== 53) {
    throw new Error(`Hume COR 75 ${hume.hp}/${hume.mp}/${hume.str}/${hume.dex}/${hume.vit}/${hume.agi}/${hume.int}/${hume.mnd}/${hume.chr}`);
  }
  const first = characterBase("hume", "COR", 1);
  if (first.hp !== 28 || first.mp !== 0 || first.str !== 6 || first.dex !== 7 || first.vit !== 6 || first.agi !== 7 || first.int !== 7 || first.mnd !== 6 || first.chr !== 6) {
    throw new Error(`Hume COR 1 ${first.hp}/${first.mp}/${first.str}/${first.dex}/${first.vit}/${first.agi}/${first.int}/${first.mnd}/${first.chr}`);
  }
  if (corSkill("Dagger", 75) !== 256 || corSkill("Sword", 75) !== 240 || corSkill("Marksmanship", 75) !== 250 || corSkill("Throwing", 75) !== 230) {
    throw new Error("COR combat skills");
  }
  if (corSkill("Parrying", 75) !== 269 || corSkill("Evasion", 75) !== 210 || corSkill("Archery", 75) !== 0 || corSkill("Staff", 75) !== 0) {
    throw new Error("COR defensive skills");
  }
  if (corSkill("Dagger", 37) !== 109 || corSkill("Parrying", 37) !== 114 || corSkill("Throwing", 37) !== 105 || corSkill("Evasion", 37) !== 101) {
    throw new Error("COR subjob skills");
  }
  if (corRapidShot(14) !== 0 || corRapidShot(37) !== 0.25 || corRapidShot(75) !== 0.25) throw new Error("Rapid Shot");
  if (corRecycle(34, "sub") !== 0 || corRecycle(37, "sub") !== 0.1 || corRecycle(75, "sub") !== 0.1 || corRecycle(75, "main") !== 0.2) throw new Error("Recycle");
  if (corResistParalyze(37, "sub") !== 0.15 || corResistParalyze(45, "sub") !== 0.2 || corResistParalyze(75, "main") !== 0.25) throw new Error("Resist Paralyze");
  if (corResistAmnesia(37, "sub") !== 0.1 || corResistAmnesia(50, "sub") !== 0.1 || corResistAmnesia(50, "master-sub") !== 0.15 || corResistAmnesia(75, "main") !== 0.2) {
    throw new Error("Resist Amnesia");
  }
  if (quickDrawDamage(8, 10, 61, 61) !== 36 || quickDrawDamage(8, 10, 61, 61 - 128) !== 72 || quickDrawDamage(8, 10, 0, 128) !== 0) {
    throw new Error("Quick Draw");
  }
  const hunter = rollCombat([{ name: "Hunter's Roll", power: 4 }]);
  if (hunter.acc !== 40) throw new Error(`Hunter's Roll ${hunter.acc}`);
  const chaos = rollCombat([{ name: "Chaos Roll", power: 104 }]);
  if (chaos.attackNumer !== Math.round(356 * 256 / 1024)) throw new Error(`Chaos Roll ${chaos.attackNumer}`);
  const gallant = rollCombat([{ name: "Gallant's Roll", power: 3 }]);
  if (gallant.defenseNumer !== Math.round(200 * 256 / 1024)) throw new Error(`Gallant's Roll ${gallant.defenseNumer}`);
  if (rolledStoreTp(1.25, [{ name: "Samurai Roll", power: 102 }]) !== 1.25 * 1.42) throw new Error("Samurai Roll");
  const fighter = fighterDoubleAttack(0.14, [{ name: "Fighter's Roll", power: 5 }]);
  if (Math.abs(fighter - 0.24) > 1e-9) throw new Error(`Fighter's Roll ${fighter}`);
  const fighterBust = fighterDoubleAttack(0.14, [{ name: "Bust", power: packBust([15]) }]);
  if (Math.abs(fighterBust - 0.14) > 1e-9) throw new Error(`Fighter bust ${fighterBust}`);
  const faceOf = (name, face) => rollByName(name)?.values?.[face - 1];
  if (faceOf("Beast Roll", 4) !== 256 || rollByName("Beast Roll")?.bust !== 0) throw new Error("Beast Roll");
  if (faceOf("Warlock's Roll", 4) !== 40 || rollByName("Warlock's Roll")?.bust !== -15) throw new Error("Warlock's Roll");
  if (faceOf("Puppet Roll", 3) !== 35 || rollByName("Puppet Roll")?.bust !== -12) throw new Error("Puppet Roll");
  if (faceOf("Wizard's Roll", 5) !== 25 || rollByName("Wizard's Roll")?.bust !== -10) throw new Error("Wizard's Roll");
  if (faceOf("Dancer's Roll", 3) !== 12 || rollByName("Dancer's Roll")?.lucky !== 3 || rollByName("Dancer's Roll")?.unlucky !== 7) throw new Error("Dancer's Roll");
  if (faceOf("Scholar's Roll", 2) !== 10 || rollByName("Scholar's Roll")?.lucky !== 2 || rollByName("Scholar's Roll")?.plus != null || rollByName("Scholar's Roll")?.bust !== -3) {
    throw new Error("Scholar's Roll");
  }
  if (faceOf("Naturalist's Roll", 3) !== 15 || rollByName("Naturalist's Roll")?.lucky !== 3) throw new Error("Naturalist's Roll");
  if (faceOf("Runeist's Roll", 4) !== 40 || rollByName("Runeist's Roll")?.lucky !== 4 || rollByName("Runeist's Roll")?.unlucky !== 8) throw new Error("Runeist's Roll");
  if (corsairExpPercent([{ name: "Corsair's Roll", power: 5 }]) !== 20) throw new Error("Corsair face 5");
  if (corsairExpPercent([{ name: "Corsair's Roll", power: 105 }]) !== 25) throw new Error("Corsair face 5 bonus");
  if (corsairExpPercent([{ name: "Corsair's Roll", power: 111 }]) !== 29) throw new Error("Corsair face 11");
  if (corsairExpPercent([{ name: "Corsair's Roll", power: 109 }]) !== 13) throw new Error("Corsair face 9");
  if (corsairExpPercent([{ name: "Corsair's Roll", power: 1 }]) !== 10) throw new Error("Corsair face 1");
  if (corsairExpPercent([{ name: "Corsair's Roll", power: 101 }]) !== 15) throw new Error("Corsair snake");
  if (corsairExpPercent([{ name: "Bust", power: packBust([1]) }]) !== -6) throw new Error("Corsair bust");
  if (choralInterrupt([{ name: "Choral Roll", power: 11 }]) !== -50) throw new Error("Choral eleven");
  if (choralInterrupt([{ name: "Choral Roll", power: 111 }]) !== -75) throw new Error("Choral bard");
  if (choralInterrupt([{ name: "Bust", power: packBust([8]) }]) !== 25) throw new Error("Choral bust");
  if (rollCombat([{ name: "Dancer's Roll", power: 3 }]).regen !== 12) throw new Error("Dancer regen");
  if (rollCombat([{ name: "Dancer's Roll", power: 103 }]).regen !== 16) throw new Error("Dancer bonus");
  if (rollCombat([{ name: "Bust", power: packBust([19]) }]).regen !== -4) throw new Error("Dancer bust");
  if (rollCombat([{ name: "Scholar's Roll", power: 2 }]).conserve !== 10) throw new Error("Scholar conserve");
  if (rollCombat([{ name: "Scholar's Roll", power: 102 }]).conserve !== 13) throw new Error("Scholar bonus");
  if (rollCombat([{ name: "Bust", power: packBust([20]) }]).conserve !== -3) throw new Error("Scholar bust");
  if (rollCombat([{ name: "Bust", power: packBust([2]) }]).eva !== -15) throw new Error("Ninja bust");
  const sub = { recastLeft: 0, corLevel: 37, corMain: false };
  if (castCorsair("Wild Card", sub)?.ok) throw new Error("Wild Card sub");
  if (castCorsair("Fire Shot", sub)?.ok) throw new Error("Quick Draw sub");
  if (castCorsair("Evoker's Roll", sub)?.ok) throw new Error("Evoker's Roll sub");
  if (castCorsair("Random Deal", sub)?.ok) throw new Error("Random Deal sub");
  if (castCorsair("Snake Eye", sub)?.ok) throw new Error("Snake Eye sub");
  const samurai = castCorsair("Samurai Roll", { ...sub, die: 2, partyJobs: ["WAR"] });
  if (!samurai?.ok || samurai.roll?.power !== 2 || samurai.recast !== 60) throw new Error("Samurai Roll sub");
  const lucky = castCorsair("Ninja Roll", { ...bare, die: 4, partyJobs: ["COR", "NIN"] });
  if (!lucky?.ok || lucky.roll?.power !== 104) throw new Error("Ninja Roll bonus");
  const capped = castCorsair("Hunter's Roll", { ...bare, die: 1, rolls: [{ name: "Corsair's Roll", left: 200, power: 5 }, { name: "Ninja Roll", left: 200, power: 3 }] });
  if (capped?.ok) throw new Error("two-roll cap");
  const bustLock = castCorsair("Corsair's Roll", { ...bare, die: 1, busts: 2 });
  if (bustLock?.ok) throw new Error("bust lock");
  const snake = castCorsair("Corsair's Roll", { ...bare, die: 6, snake: true });
  if (!snake?.ok || snake.roll?.power !== 101 || !snake.consumeSnake) throw new Error("Snake Eye die");
  const bust = castCorsair("Double-Up", { ...bare, die: 6, rolls: [{ name: "Corsair's Roll", left: 280, power: 6 }] });
  if (!bust?.ok || !bust.roll?.bust || bust.fold?.bustPower !== packBust([1])) throw new Error("bust over 11");
  const held = castCorsair("Double-Up", { ...bare, die: 1, rolls: [{ name: "Hunter's Roll", left: 255, power: 4 }] });
  if (held?.ok) throw new Error("double-up window");
  const kept = castCorsair("Double-Up", { ...bare, die: 1, rolls: [{ name: "Hunter's Roll", left: 280, power: 4 }] });
  if (!kept?.ok || !kept.roll?.keep || kept.roll.power !== 5 || kept.roll.duration !== 280) throw new Error("double-up keeps duration");
  const xi = castCorsair("Double-Up", { ...bare, die: 6, rolls: [{ name: "Ninja Roll", left: 280, power: 5 }] });
  if (!xi?.ok || xi.roll?.power !== 11 || xi.recast !== DOUBLE_UP_RECAST || xi.shareRecast !== 0) throw new Error("eleven");
  const follow = castCorsair("Hunter's Roll", { ...bare, die: 2, rolls: [{ name: "Corsair's Roll", left: 200, power: 11 }] });
  if (!follow?.ok || follow.recast !== 30) throw new Error("follow-up 11");
  const shot = castCorsair("Light Shot", { ...bare, targeted: true, distance: 10, gun: true, bullet: true, gunDmg: 8, bulletDmg: 10, agi: 61, targetAgi: 61 });
  if (!shot?.ok || shot.bash != null || shot.quickDraw?.sleep !== true || shot.quickDraw.element !== "light") throw new Error("Light Shot");
  const fire = castCorsair("Fire Shot", { ...bare, targeted: true, distance: 10, gun: true, bullet: true, gunDmg: 8, bulletDmg: 10, agi: 61, targetAgi: 61 });
  if (!fire?.ok || fire.bash !== 36 || fire.quickDraw?.debuff !== "Burn" || fire.quickDraw.element !== "fire") throw new Error("Fire Shot");
  const dark = castCorsair("Dark Shot", { ...bare, targeted: true, distance: 10, gun: true, bullet: true, gunDmg: 8, bulletDmg: 10, agi: 61, targetAgi: 61 });
  if (!dark?.ok || dark.bash != null || dark.quickDraw?.dispel !== true) throw new Error("Dark Shot");
  if (quickDrawBonus(0) !== 4 || quickDrawBonus(1) !== 2 || quickDrawBonus(2) !== 0) throw new Error("Quick Draw deepen");
  if (castCorsair("Fire Shot", { ...bare, targeted: true, distance: 10, gun: false, bullet: true })?.ok) throw new Error("Quick Draw gun");
}
export {
  BUST_LINE,
  COR_ABILITIES,
  COR_CAP,
  COR_CE,
  COR_ROLLS,
  COR_SKILLS,
  COR_TRAITS,
  COR_VE,
  DOUBLE_UP_RECAST,
  DOUBLE_UP_WINDOW,
  FOLD_RECAST,
  ONE_HOURS,
  QUICK_DRAWS,
  QUICK_DRAW_RANGE,
  QUICK_DRAW_RECAST,
  RANDOM_DEAL_RECAST,
  ROLL_CE,
  ROLL_ELEVEN_RECAST,
  ROLL_RANGE,
  ROLL_RECAST,
  ROLL_SECONDS,
  ROLL_VE,
  SNAKE_EYE_RECAST,
  SNAKE_EYE_SECONDS,
  WILD_CARD_RECAST,
  assertCor,
  bustCount,
  bustList,
  castCorsair,
  choralInterrupt,
  corRapidShot,
  corRecycle,
  corResistAmnesia,
  corResistParalyze,
  corSkill,
  corsairExpPercent,
  corsairJobLevel,
  fighterDoubleAttack,
  isQuickDraw,
  isRoll,
  maxBusts,
  maxRolls,
  packBust,
  quickDrawBonus,
  quickDrawDamage,
  rollByName,
  rollCombat,
  rollFace,
  rollHasBonus,
  rollPower,
  rolledStoreTp
};
