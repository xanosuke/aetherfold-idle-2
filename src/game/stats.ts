/**
 * Retail FFXI race and job base stats.
 *
 * Grades and the growth formula are the ones the 2004 guide and the in-game
 * Hume Warrior sheet both use. Each race part and each job part is floored
 * before they are added. Flooring the sum is one high (Hume Warrior level 3
 * DEX would print 8; the sheet says 7). Level 1 is just the race base plus
 * the job base. A support job, if any, adds half of its own base, floored.
 * Anything past level 10 / 30 follows the same scales. A negative
 * (level − 10) term is treated as 0.
 *
 * Checked against the recorded Hume Warrior rows: level 1 is 31 HP,
 * STR 8, DEX 7, VIT 6, AGI 7, INT 5, MND 5, CHR 6. Level 3 is STR 9 / DEX 7.
 * Level 10 is 157 HP / STR 15. Level 75, with no subjob and no trait HP,
 * is 1242 HP / STR 70 / DEX 61 / VIT 56 / AGI 61 / INT 48 / MND 48 / CHR 53.
 * Max HP Boost is not in that HP number.
 */

export type RaceId = "hume" | "elvaan" | "tarutaru" | "mithra" | "galka";

export type JobId =
  | "WAR"
  | "MNK"
  | "WHM"
  | "BLM"
  | "RDM"
  | "THF"
  | "PLD"
  | "DRK"
  | "BST"
  | "BRD"
  | "RNG"
  | "SAM"
  | "NIN"
  | "DRG"
  | "SMN"
  | "BLU"
  | "PUP"
  | "COR"
  | "DNC"
  | "SCH"
  | "RUN"
  | "GEO";

/** X means the job has no MP pool of its own. */
export type Grade = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "X";

export type AttrKey = "str" | "dex" | "vit" | "agi" | "int" | "mnd" | "chr";

export type BaseStats = {
  hp: number;
  mp: number;
  str: number;
  dex: number;
  vit: number;
  agi: number;
  int: number;
  mnd: number;
  chr: number;
};

type StatKey = "hp" | "mp" | AttrKey;

/** HP is base / scale-to-75 / extra past 30. MP and attributes are base / scale. */
const GRADE: Record<Exclude<Grade, "X">, { hp: [number, number, number]; mp: [number, number]; attr: [number, number] }> = {
  A: { hp: [19, 9, 1], mp: [16, 6], attr: [5, 0.5] },
  B: { hp: [17, 8, 1], mp: [14, 5], attr: [4, 0.45] },
  C: { hp: [16, 7, 1], mp: [12, 4], attr: [4, 0.4] },
  D: { hp: [14, 6, 0], mp: [10, 3], attr: [3, 0.35] },
  E: { hp: [13, 5, 0], mp: [8, 2], attr: [3, 0.3] },
  F: { hp: [11, 4, 0], mp: [6, 1], attr: [2, 0.25] },
  G: { hp: [10, 3, 0], mp: [4, 0.5], attr: [2, 0.2] },
};

const RACE_GRADE: Record<RaceId, Record<StatKey, Grade>> = {
  hume: { hp: "D", mp: "D", str: "D", dex: "D", vit: "D", agi: "D", int: "D", mnd: "D", chr: "D" },
  elvaan: { hp: "C", mp: "E", str: "B", dex: "E", vit: "C", agi: "F", int: "F", mnd: "B", chr: "D" },
  tarutaru: { hp: "G", mp: "A", str: "F", dex: "D", vit: "E", agi: "C", int: "A", mnd: "E", chr: "D" },
  mithra: { hp: "D", mp: "D", str: "E", dex: "A", vit: "E", agi: "B", int: "D", mnd: "E", chr: "F" },
  galka: { hp: "A", mp: "G", str: "C", dex: "D", vit: "A", agi: "E", int: "E", mnd: "D", chr: "F" },
};

const JOB_GRADE: Record<JobId, Record<StatKey, Grade>> = {
  WAR: { hp: "B", mp: "X", str: "A", dex: "C", vit: "D", agi: "C", int: "F", mnd: "F", chr: "E" },
  MNK: { hp: "A", mp: "X", str: "C", dex: "B", vit: "A", agi: "F", int: "G", mnd: "D", chr: "E" },
  WHM: { hp: "E", mp: "C", str: "D", dex: "F", vit: "D", agi: "E", int: "E", mnd: "A", chr: "C" },
  BLM: { hp: "F", mp: "B", str: "F", dex: "C", vit: "F", agi: "C", int: "A", mnd: "E", chr: "D" },
  RDM: { hp: "D", mp: "D", str: "D", dex: "D", vit: "E", agi: "E", int: "C", mnd: "C", chr: "D" },
  THF: { hp: "D", mp: "X", str: "D", dex: "A", vit: "D", agi: "B", int: "C", mnd: "G", chr: "G" },
  PLD: { hp: "C", mp: "F", str: "B", dex: "E", vit: "A", agi: "G", int: "G", mnd: "C", chr: "C" },
  DRK: { hp: "C", mp: "F", str: "A", dex: "C", vit: "C", agi: "D", int: "C", mnd: "G", chr: "G" },
  BST: { hp: "C", mp: "X", str: "D", dex: "C", vit: "D", agi: "F", int: "E", mnd: "E", chr: "A" },
  BRD: { hp: "D", mp: "X", str: "D", dex: "D", vit: "D", agi: "F", int: "D", mnd: "D", chr: "B" },
  RNG: { hp: "E", mp: "X", str: "E", dex: "D", vit: "D", agi: "A", int: "E", mnd: "D", chr: "E" },
  SAM: { hp: "B", mp: "X", str: "C", dex: "C", vit: "C", agi: "D", int: "E", mnd: "E", chr: "D" },
  NIN: { hp: "D", mp: "X", str: "C", dex: "B", vit: "C", agi: "B", int: "D", mnd: "G", chr: "F" },
  DRG: { hp: "C", mp: "X", str: "C", dex: "E", vit: "C", agi: "E", int: "F", mnd: "E", chr: "C" },
  SMN: { hp: "G", mp: "A", str: "G", dex: "D", vit: "G", agi: "D", int: "B", mnd: "C", chr: "C" },
  BLU: { hp: "D", mp: "D", str: "E", dex: "E", vit: "E", agi: "E", int: "E", mnd: "E", chr: "E" },
  PUP: { hp: "D", mp: "X", str: "E", dex: "B", vit: "D", agi: "C", int: "E", mnd: "F", chr: "C" },
  COR: { hp: "D", mp: "X", str: "E", dex: "C", vit: "E", agi: "C", int: "C", mnd: "E", chr: "E" },
  DNC: { hp: "D", mp: "X", str: "D", dex: "C", vit: "E", agi: "B", int: "F", mnd: "F", chr: "B" },
  SCH: { hp: "E", mp: "D", str: "F", dex: "D", vit: "E", agi: "D", int: "C", mnd: "D", chr: "C" },
  RUN: { hp: "C", mp: "F", str: "C", dex: "D", vit: "E", agi: "B", int: "D", mnd: "D", chr: "F" },
  GEO: { hp: "C", mp: "B", str: "F", dex: "D", vit: "E", agi: "D", int: "C", mnd: "C", chr: "D" },
};

export const RACES: { id: RaceId; name: string }[] = [
  { id: "hume", name: "Hume" },
  { id: "elvaan", name: "Elvaan" },
  { id: "tarutaru", name: "Tarutaru" },
  { id: "mithra", name: "Mithra" },
  { id: "galka", name: "Galka" },
];

export const JOB_NAME: Record<JobId, string> = {
  WAR: "Warrior",
  MNK: "Monk",
  WHM: "White Mage",
  BLM: "Black Mage",
  RDM: "Red Mage",
  THF: "Thief",
  PLD: "Paladin",
  DRK: "Dark Knight",
  BST: "Beastmaster",
  BRD: "Bard",
  RNG: "Ranger",
  SAM: "Samurai",
  NIN: "Ninja",
  DRG: "Dragoon",
  SMN: "Summoner",
  BLU: "Blue Mage",
  PUP: "Puppetmaster",
  COR: "Corsair",
  DNC: "Dancer",
  SCH: "Scholar",
  RUN: "Rune Fencer",
  GEO: "Geomancer",
};

const ATTRS: AttrKey[] = ["str", "dex", "vit", "agi", "int", "mnd", "chr"];

function nonNeg(n: number) {
  return n > 0 ? n : 0;
}

function attrPart(grade: Grade, level: number) {
  if (grade === "X" || level <= 0) return 0;
  const [base, scale] = GRADE[grade].attr;
  return base + scale * (level - 1);
}

function hpPart(grade: Grade, level: number, kind: "race" | "job" | "sub") {
  if (grade === "X" || level <= 0) return 0;
  const [base, scale, extra] = GRADE[grade].hp;
  const over10 = nonNeg(level - 10);
  const over30 = nonNeg(level - 30);
  if (kind === "race") return base + scale * (level - 1) + 2 * over10 + extra * over30;
  if (kind === "job") return base + scale * (level - 1) + extra * over30;
  return (base + scale * (level - 1) + over10) / 2;
}

function mpPart(grade: Grade, level: number) {
  if (grade === "X" || level <= 0) return 0;
  const [base, scale] = GRADE[grade].mp;
  return base + scale * (level - 1);
}

/** Summoner Max MP Boost. Tiers replace: +10 / +20 / +40 / +60 at 10 / 30 / 50 / 70. */
function smnMp(level: number) {
  if (level >= 70) return 60;
  if (level >= 50) return 40;
  if (level >= 30) return 20;
  if (level >= 10) return 10;
  return 0;
}

/** A support job stops at +20. Tier III needs master levels, which this kit does not have. */
function smnSubMp(level: number) {
  if (level >= 30) return 20;
  if (level >= 10) return 10;
  return 0;
}

/** Naked race + main job + optional support job. No equipment, no merits. */
export function characterBase(
  race: RaceId,
  job: JobId,
  level: number,
  sub: JobId | null = null,
  subLevel = 0,
): BaseStats {
  const raceG = RACE_GRADE[race];
  const jobG = JOB_GRADE[job];
  const subG = sub && subLevel > 0 ? JOB_GRADE[sub] : null;
  const stats = {} as BaseStats;
  for (const key of ATTRS) {
    const subPart = subG ? Math.floor(attrPart(subG[key], subLevel) / 2) : 0;
    stats[key] = Math.floor(attrPart(raceG[key], level)) + Math.floor(attrPart(jobG[key], level)) + subPart;
  }
  let hp = hpPart(raceG.hp, level, "race") + hpPart(jobG.hp, level, "job");
  if (subG && sub) hp += hpPart(subG.hp, subLevel, "sub");
  stats.hp = Math.floor(hp);

  const mainMp = jobG.mp !== "X";
  const subMp = subG != null && subG.mp !== "X";
  let mp = 0;
  if (mainMp) mp += mpPart(raceG.mp, level) + mpPart(jobG.mp, level);
  else if (subMp) mp += mpPart(raceG.mp, subLevel) / 2;
  if (job === "SMN") mp += smnMp(level);
  if (subMp && subG && sub) {
    mp += mpPart(subG.mp, subLevel) / 2;
    if (sub === "SMN") mp += smnSubMp(subLevel);
  }
  stats.mp = Math.max(0, Math.floor(mp));
  return stats;
}

/**
 * Naked Warrior sheets. No subjob, no gear, no merits, and no Max HP Boost.
 * Level 1 and the early Hume rows are the recorded status screen.
 * Level 75 is the published five-race table.
 */
export function assertStats(): void {
  const h1 = characterBase("hume", "WAR", 1);
  if (
    h1.hp !== 31 ||
    h1.mp !== 0 ||
    h1.str !== 8 ||
    h1.dex !== 7 ||
    h1.vit !== 6 ||
    h1.agi !== 7 ||
    h1.int !== 5 ||
    h1.mnd !== 5 ||
    h1.chr !== 6
  ) {
    throw new Error("Hume WAR 1");
  }
  const h3 = characterBase("hume", "WAR", 3);
  if (h3.hp !== 59 || h3.str !== 9 || h3.dex !== 7 || h3.vit !== 6) throw new Error("Hume WAR 3");
  const h10 = characterBase("hume", "WAR", 10);
  if (h10.hp !== 157 || h10.str !== 15 || h10.dex !== 13 || h10.vit !== 12 || h10.agi !== 13 || h10.chr !== 11) {
    throw new Error("Hume WAR 10");
  }
  const at75: Record<RaceId, BaseStats> = {
    hume: { hp: 1242, mp: 0, str: 70, dex: 61, vit: 56, agi: 61, int: 48, mnd: 48, chr: 53 },
    galka: { hp: 1514, mp: 0, str: 75, dex: 61, vit: 70, agi: 58, int: 45, mnd: 48, chr: 45 },
    elvaan: { hp: 1363, mp: 0, str: 79, dex: 58, vit: 61, agi: 53, int: 40, mnd: 57, chr: 53 },
    mithra: { hp: 1242, mp: 0, str: 67, dex: 75, vit: 53, agi: 70, int: 48, mnd: 45, chr: 45 },
    tarutaru: { hp: 1016, mp: 0, str: 62, dex: 61, vit: 53, agi: 66, int: 62, mnd: 45, chr: 53 },
  };
  for (const race of Object.keys(at75) as RaceId[]) {
    const got = characterBase(race, "WAR", 75);
    const want = at75[race];
    for (const key of ["hp", "mp", "str", "dex", "vit", "agi", "int", "mnd", "chr"] as const) {
      if (got[key] !== want[key]) throw new Error(`${race} WAR 75 ${key} ${got[key]} != ${want[key]}`);
    }
  }
}
