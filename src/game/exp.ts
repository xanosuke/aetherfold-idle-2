/**
 * Experience to the next level, and experience from a defeated enemy.
 * The level chart is the April 2005 reduction, still the 1–75 table.
 * Kill experience is current retail: the classic chart doubled on 14 February 2011.
 * No merits, limit points, dedication, Signet, or sanction. Trusts are not a party for the split.
 */
import { checkCon } from "./commands";

export function tnlFor(level: number): number {
  const lv = Math.floor(level);
  if (lv <= 1) return 500;
  if (lv <= 7) return 500 + (lv - 1) * 250;
  if (lv <= 22) return 2200 + (lv - 8) * 200;
  if (lv <= 50) return 5100 + (lv - 23) * 100;
  if (lv === 51) return 8000;
  if (lv <= 61) return 9200 + (lv - 52) * 1200;
  if (lv <= 69) return 21500 + (lv - 62) * 1500;
  if (lv >= 75) return 44000;
  return 34000 + (lv - 70) * 2000;
}

/**
 * How much experience this level can hold.
 * Below 75 that is the next level. At 75 retail stops one point short of 76 (44,000), so the bar fills to 43,999 and then stops. No merits.
 */
export const CAP_BUFFER = 43999;

export function expHold(level: number): number {
  if (Math.floor(level) >= 75) return CAP_BUFFER;
  return tnlFor(level);
}

/** Spend a job's own bar. At 75 the bar stops at 43,999. Below that, a full bar levels the job. */
export function bankExp(level: number, exp: number): { level: number; exp: number } {
  let lv = Math.floor(Number.isFinite(level) ? level : 1);
  lv = Math.max(1, Math.min(75, lv));
  let pool = Math.max(0, Math.floor(Number.isFinite(exp) ? exp : 0));
  if (lv >= 75) return { level: 75, exp: Math.min(CAP_BUFFER, pool) };
  while (lv < 75 && pool >= tnlFor(lv)) {
    pool -= tnlFor(lv);
    lv += 1;
  }
  if (lv >= 75) pool = Math.min(pool, CAP_BUFFER);
  return { level: lv, exp: pool };
}

export function expSegments(exp: number, level: number, parts = 10): { hold: number; held: number; fills: number[] } {
  const hold = expHold(level);
  const held = Math.max(0, Math.min(hold, Math.floor(exp)));
  const pct = hold <= 0 ? 0 : held / hold;
  const fills = Array.from({ length: parts }, (_, i) => Math.max(0, Math.min(1, pct * parts - i)));
  return { hold, held, fills };
}

/**
 * Classic base experience, mob level minus player level, columns of five levels from 1–5 through 71–75.
 * Lookup doubles these. Rows past −20 are zero. Columns past 75 are out of scope.
 */
const CLASSIC: Record<number, number[]> = {
  15: [800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800],
  14: [800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 720, 720, 720],
  13: [800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 630, 630, 630],
  12: [800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 580, 580, 580],
  11: [800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 580, 530, 530, 530],
  10: [800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 530, 480, 480, 480],
  9: [800, 800, 800, 800, 800, 800, 600, 600, 600, 600, 530, 480, 440, 440, 440],
  8: [600, 600, 600, 600, 600, 600, 550, 550, 550, 530, 480, 430, 400, 400, 400],
  7: [550, 550, 550, 550, 550, 550, 500, 500, 500, 470, 430, 380, 360, 360, 360],
  6: [450, 450, 450, 450, 450, 450, 450, 450, 450, 400, 370, 330, 320, 320, 320],
  5: [350, 350, 350, 350, 350, 350, 400, 400, 400, 340, 310, 280, 280, 280, 280],
  4: [200, 200, 200, 200, 200, 200, 300, 300, 300, 270, 250, 240, 240, 240, 240],
  3: [160, 160, 160, 160, 160, 160, 200, 200, 200, 200, 200, 200, 200, 200, 200],
  2: [140, 140, 140, 140, 140, 140, 150, 150, 150, 150, 150, 160, 160, 160, 160],
  1: [120, 120, 120, 120, 120, 120, 125, 125, 125, 125, 125, 130, 130, 130, 130],
  0: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
  [-1]: [90, 90, 90, 90, 90, 90, 93, 95, 95, 95, 96, 96, 96, 96, 96],
  [-2]: [80, 80, 80, 80, 80, 80, 86, 86, 90, 90, 93, 93, 93, 93, 94],
  [-3]: [70, 70, 75, 75, 75, 75, 75, 80, 86, 86, 88, 88, 91, 91, 92],
  [-4]: [65, 65, 70, 70, 70, 70, 72, 76, 80, 80, 82, 84, 86, 86, 90],
  [-5]: [60, 60, 65, 65, 65, 65, 68, 72, 76, 76, 78, 80, 83, 83, 86],
  [-6]: [50, 50, 60, 60, 60, 60, 65, 70, 72, 72, 74, 76, 80, 80, 83],
  [-7]: [0, 40, 50, 50, 55, 55, 60, 65, 68, 68, 70, 72, 76, 77, 80],
  [-8]: [0, 30, 40, 40, 50, 50, 55, 60, 65, 65, 68, 68, 73, 75, 77],
  [-9]: [0, 0, 30, 30, 40, 40, 50, 55, 60, 60, 65, 65, 70, 72, 75],
  [-10]: [0, 0, 0, 0, 30, 30, 40, 50, 55, 56, 60, 62, 66, 70, 73],
  [-11]: [0, 0, 0, 0, 0, 0, 30, 40, 50, 53, 56, 58, 63, 66, 70],
  [-12]: [0, 0, 0, 0, 0, 0, 0, 30, 40, 50, 53, 56, 60, 63, 66],
  [-13]: [0, 0, 0, 0, 0, 0, 0, 0, 30, 40, 50, 53, 56, 60, 63],
  [-14]: [0, 0, 0, 0, 0, 0, 0, 0, 0, 30, 40, 50, 53, 56, 60],
  [-15]: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 30, 40, 50, 53, 56],
  [-16]: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 30, 40, 50, 53],
  [-17]: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 30, 40, 50],
  [-18]: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 30, 40],
  [-19]: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 30]
};

/** Seconds allowed to earn the next chain. Row 0 follows the opening kill. Bands are 1–10 through 61–75. 6+ below 41 is unpublished, so it holds the chain-5 window. */
const CHAIN_WINDOW = [
  [50, 100, 150, 200, 250, 300, 360],
  [40, 80, 120, 160, 200, 240, 300],
  [30, 60, 90, 120, 150, 180, 240],
  [20, 40, 60, 80, 100, 120, 165],
  [10, 20, 30, 40, 50, 90, 105],
  [10, 20, 30, 40, 50, 60, 60]
];

function bandIndex(level: number): number {
  const lv = Math.min(75, Math.max(1, Math.floor(level)));
  if (lv <= 10) return 0;
  if (lv <= 20) return 1;
  if (lv <= 30) return 2;
  if (lv <= 40) return 3;
  if (lv <= 50) return 4;
  if (lv <= 60) return 5;
  return 6;
}

function perMonsterCap(level: number): number {
  const lv = Math.floor(level);
  if (lv <= 50) return 400;
  if (lv <= 60) return 500;
  return 600;
}

/** Chain 1 is +20%, then +25, +30, +40, and +50 from 5 on. Thousandths, so 1.2 does not floor to 239. */
function chainThousandths(chain: number): number {
  if (chain <= 1) return 1200;
  if (chain === 2) return 1250;
  if (chain === 3) return 1300;
  if (chain === 4) return 1400;
  return 1500;
}

export function baseExp(playerLevel: number, mobLevel: number): number {
  const diff = Math.min(15, Math.max(-34, Math.floor(mobLevel) - Math.floor(playerLevel)));
  const col = Math.min(14, Math.max(0, Math.floor((Math.floor(playerLevel) - 1) / 5)));
  const row = CLASSIC[diff];
  if (!row) return 0;
  return (row[col] ?? 0) * 2;
}

function evenOrTougher(playerLevel: number, mobLevel: number): boolean {
  const con = checkCon(playerLevel, mobLevel);
  return con === "even-match" || con === "tough" || con === "very-tough" || con === "incredibly-tough";
}

export type ChainClock = { count: number; until: number };

export type KillOutcome = {
  raw: number;
  gained: number;
  chain: number;
  exp: number;
  level: number;
  ding: boolean;
  clock: ChainClock;
};

const EMPTY_CLOCK: ChainClock = { count: 0, until: 0 };

/**
 * One defeated enemy, solo. Party share, level modifier, and monster bonus are all 1.
 * The cap applies before the chain. Decent Challenge and easier pay their base and leave the chain alone.
 * The first Even Match or tougher pays base only and opens the window. The next one inside that window is chain #1.
 */
export function settleKill(playerLevel: number, mobLevel: number, exp: number, now: number, clock: ChainClock = EMPTY_CLOCK): KillOutcome {
  const start = Math.max(1, Math.floor(playerLevel));
  let level = start;
  let pool = Math.max(0, Math.floor(exp));
  const capped = Math.min(baseExp(level, mobLevel), perMonsterCap(level));
  const next: ChainClock = { count: clock.count, until: clock.until };
  let chain = 0;
  let raw = capped;
  if (capped > 0 && evenOrTougher(level, mobLevel)) {
    const open = next.until > 0 && now <= next.until;
    if (open) {
      chain = next.count + 1;
      raw = Math.floor((capped * chainThousandths(chain)) / 1000);
      const row = Math.min(CHAIN_WINDOW.length - 1, chain);
      next.count = chain;
      next.until = now + CHAIN_WINDOW[row][bandIndex(level)] * 1000;
    } else {
      raw = capped;
      next.count = 0;
      next.until = now + CHAIN_WINDOW[0][bandIndex(level)] * 1000;
    }
  }
  let gained = 0;
  let ding = false;
  if (raw > 0) {
    if (level >= 75) {
      const room = Math.max(0, CAP_BUFFER - Math.min(pool, CAP_BUFFER));
      gained = Math.min(raw, room);
      pool = Math.min(CAP_BUFFER, pool + gained);
    } else {
      gained = raw;
      pool += raw;
      while (level < 75 && pool >= tnlFor(level)) {
        pool -= tnlFor(level);
        level += 1;
        ding = true;
      }
      if (level >= 75) pool = Math.min(pool, CAP_BUFFER);
    }
  }
  return { raw, gained, chain, exp: pool, level, ding, clock: next };
}

let liveClock: ChainClock = { count: 0, until: 0 };

/** Session chain. A reload starts it over. The save does not carry it. */
export function noteDefeat(playerLevel: number, mobLevel: number, exp: number, now = Date.now()): KillOutcome {
  const outcome = settleKill(playerLevel, mobLevel, exp, now, liveClock);
  liveClock = outcome.clock;
  return outcome;
}

export type ExpMark = { amount: number; chain: number; where: "hare" | "kin" | "pack"; id: string | null };

const pendingExp: ExpMark[] = [];

export function queueExpMark(mark: ExpMark): void {
  pendingExp.push(mark);
}

export function takeExpMarks(): ExpMark[] {
  if (!pendingExp.length) return [];
  const marks = pendingExp.slice();
  pendingExp.length = 0;
  return marks;
}

export function assertExp(): void {
  if (tnlFor(1) !== 500) throw new Error("level 1");
  if (tnlFor(7) !== 2000) throw new Error("level 7");
  if (tnlFor(8) !== 2200) throw new Error("level 8");
  if (tnlFor(22) !== 5000) throw new Error("level 22");
  if (tnlFor(23) !== 5100) throw new Error("level 23");
  if (tnlFor(50) !== 7800) throw new Error("level 50");
  if (tnlFor(51) !== 8000) throw new Error("level 51");
  if (tnlFor(52) !== 9200) throw new Error("level 52");
  if (tnlFor(61) !== 20000) throw new Error("level 61");
  if (tnlFor(62) !== 21500) throw new Error("level 62");
  if (tnlFor(69) !== 32000) throw new Error("level 69");
  if (tnlFor(70) !== 34000) throw new Error("level 70");
  if (tnlFor(74) !== 42000) throw new Error("level 74");
  if (tnlFor(75) !== 44000) throw new Error("level 75 next");
  if (expHold(74) !== 42000) throw new Error("74 still levels");
  if (expHold(75) !== 43999) throw new Error("75 stops one short of 76");
  const empty = expSegments(0, 75);
  if (empty.held !== 0 || empty.fills.some((n) => n !== 0)) throw new Error("empty bar");
  const half = expSegments(21999, 75);
  if (half.fills[4] <= 0 || half.fills[5] !== 0) throw new Error("fifth segment");
  const full = expSegments(999999, 75);
  if (full.held !== 43999 || full.fills.some((n) => n !== 1)) throw new Error("75 cap");
  if (baseExp(75, 75) !== 200) throw new Error("even match base");
  if (baseExp(75, 74) !== 192) throw new Error("decent challenge base");
  if (baseExp(75, 55) !== 0) throw new Error("too weak base");
  if (baseExp(10, 10) !== 200) throw new Error("low even match");
  const first = settleKill(75, 75, 0, 1_000, EMPTY_CLOCK);
  if (first.raw !== 200 || first.gained !== 200 || first.chain !== 0 || first.exp !== 200 || first.clock.count !== 0) throw new Error("first kill is base");
  if (first.clock.until - 1_000 !== 360_000) throw new Error("window for chain 1");
  const second = settleKill(75, 75, first.exp, first.clock.until, first.clock);
  if (second.chain !== 1 || second.raw !== 240 || second.gained !== 240) throw new Error("chain 1");
  if (second.clock.until - first.clock.until !== 300_000) throw new Error("window for chain 2");
  const third = settleKill(75, 75, second.exp, second.clock.until, second.clock);
  if (third.chain !== 2 || third.raw !== 250) throw new Error("chain 2");
  if (third.clock.until - second.clock.until !== 240_000) throw new Error("window for chain 3");
  const late = settleKill(75, 75, 0, first.clock.until + 1, first.clock);
  if (late.chain !== 0 || late.raw !== 200 || late.clock.count !== 0) throw new Error("chain expired");
  const kept = settleKill(75, 74, 0, 5_000, { count: 3, until: 9_000 });
  if (kept.chain !== 0 || kept.raw !== 192 || kept.clock.count !== 3 || kept.clock.until !== 9_000) throw new Error("decent challenge keeps the chain");
  const weak = settleKill(75, 55, 100, 5_000, { count: 3, until: 9_000 });
  if (weak.raw !== 0 || weak.gained !== 0 || weak.chain !== 0 || weak.exp !== 100 || weak.clock.count !== 3) throw new Error("too weak");
  const room = settleKill(75, 75, 43_990, 1, EMPTY_CLOCK);
  if (room.gained !== 9 || room.exp !== 43_999 || room.chain !== 0 || room.raw !== 200) throw new Error("cap room");
  const stopped = settleKill(75, 75, 43_999, 1, EMPTY_CLOCK);
  if (stopped.gained !== 0 || stopped.exp !== 43_999 || stopped.chain !== 0 || stopped.raw !== 200 || stopped.clock.count !== 0) throw new Error("cap opens the window");
  const chainedCap = settleKill(75, 75, 43_999, 1, { count: 0, until: 5_000 });
  if (chainedCap.gained !== 0 || chainedCap.exp !== 43_999 || chainedCap.chain !== 1 || chainedCap.raw !== 240) throw new Error("cap still chains");
  const ding = settleKill(74, 74, 41_990, 1, EMPTY_CLOCK);
  if (!ding.ding || ding.level !== 75 || ding.exp !== 190 || ding.gained !== 200 || ding.chain !== 0) throw new Error("ding");
  const tough = settleKill(75, 81, 0, 1, EMPTY_CLOCK);
  if (tough.raw !== 600 || tough.chain !== 0) throw new Error("cap before chain");
  const toughChain = settleKill(75, 81, 0, tough.clock.until, tough.clock);
  if (toughChain.chain !== 1 || toughChain.raw !== 720) throw new Error("capped chain 1");
  const fifth = settleKill(75, 75, 0, 1, { count: 4, until: 50_000 });
  if (fifth.chain !== 5 || fifth.raw !== 300 || fifth.clock.until - 1 !== 60_000) throw new Error("chain 5");
  const sixth = settleKill(75, 75, 0, fifth.clock.until, fifth.clock);
  if (sixth.chain !== 6 || sixth.raw !== 300 || sixth.clock.until - fifth.clock.until !== 60_000) throw new Error("chain 6 window");
  queueExpMark({ amount: 240, chain: 1, where: "pack", id: "mouth" });
  queueExpMark({ amount: 250, chain: 2, where: "hare", id: null });
  const marks = takeExpMarks();
  if (marks.length !== 2 || marks[0].id !== "mouth" || marks[1].chain !== 2 || takeExpMarks().length !== 0) throw new Error("exp marks");
  const heldBank = bankExp(75, 100);
  if (heldBank.level !== 75 || heldBank.exp !== 100) throw new Error("75 holds its bar");
  const cappedBank = bankExp(75, 999999);
  if (cappedBank.level !== 75 || cappedBank.exp !== 43999) throw new Error("75 banks to the cap");
  const dingBank = bankExp(1, 600);
  if (dingBank.level !== 2 || dingBank.exp !== 100) throw new Error("bank spends a level");
}
