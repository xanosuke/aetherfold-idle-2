/**
 * Vana'diel time. One Earth second is 25 Vana'diel seconds.
 * 2002-01-01 00:00:00 JST is 0886/01/01 00:00:00 Firesday.
 * That is the same scale as 2002-06-23 15:00:00 UTC = 0898/02/01 00:00:00.
 * Day is 06:00–18:00. The moon steps once a day across an 84-day cycle.
 * Its +26 day offset is counted from year 0, not from 886.
 * Checked against vana-portal.com at 2026-10-12T13:36:27.736Z:
 * Earthsday 1514/7/14 13:11:33, Waning Gibbous 64%.
 */

/** 2001-12-31 15:00:00 UTC, which is 2002-01-01 00:00:00 in Japan. */
export const VANA_EPOCH_MS = Date.UTC(2001, 11, 31, 15, 0, 0, 0);

const VANA_EPOCH_YEAR = 886;
const SCALE = 25;
const DAY = 24 * 60 * 60;
const YEAR_DAYS = 360;

export const VANADIEL_WEEKDAYS = [
  "Firesday",
  "Earthsday",
  "Watersday",
  "Windsday",
  "Iceday",
  "Lightningday",
  "Lightsday",
  "Darksday",
] as const;

export type VanadielWeekday = (typeof VANADIEL_WEEKDAYS)[number];

export type VanadielClock = {
  year: number;
  month: number;
  day: number;
  weekDay: number;
  weekDayName: VanadielWeekday;
  hour: number;
  minute: number;
  second: number;
  /** Whole Vana'diel seconds left in this day. */
  secondsUntilDay: number;
  /** 06:00 through 17:59. */
  daytime: boolean;
  /** 0 is new, 100 is full. */
  moonPercent: number;
  /** True while the moon is filling. False while it is emptying, including new and the waning full. */
  waxing: boolean;
  moonPhase: string;
};

function floorMod(value: number, span: number): number {
  return ((value % span) + span) % span;
}

function moonPhase(percent: number, waxing: boolean): string {
  if (percent >= 95 || (percent >= 90 && waxing)) return "Full Moon";
  if (percent <= 5 || (percent <= 10 && !waxing)) return "New Moon";
  if (waxing && percent >= 7 && percent <= 38) return "Waxing Crescent";
  if (waxing && percent >= 40 && percent <= 55) return "First Quarter";
  if (waxing && percent >= 57 && percent <= 88) return "Waxing Gibbous";
  if (!waxing && percent >= 62 && percent <= 93) return "Waning Gibbous";
  if (!waxing && percent >= 45 && percent <= 60) return "Last Quarter";
  if (!waxing && percent >= 12 && percent < 43) return "Waning Crescent";
  return waxing ? "Waxing Crescent" : "Waning Crescent";
}

export function vanadielTime(earthMs = Date.now()): VanadielClock {
  const vanaSec = Math.floor(((earthMs - VANA_EPOCH_MS) * SCALE) / 1000);
  const days = Math.floor(vanaSec / DAY);
  const year = VANA_EPOCH_YEAR + Math.floor(days / YEAR_DAYS);
  const dayOfYear = floorMod(days, YEAR_DAYS);
  const month = Math.floor(dayOfYear / 30) + 1;
  const day = (dayOfYear % 30) + 1;
  const weekDay = floorMod(days, 8);
  const clock = floorMod(vanaSec, DAY);
  const hour = Math.floor(clock / 3600);
  const minute = Math.floor((clock % 3600) / 60);
  const second = clock % 60;
  const daysFromYear0 = days + VANA_EPOCH_YEAR * YEAR_DAYS;
  const cycle = floorMod(daysFromYear0 + 26, 84);
  const signed = ((cycle - 42) / 42) * 100;
  const moonPercent = Math.round(Math.abs(signed));
  const waxing = signed > 0;
  return {
    year,
    month,
    day,
    weekDay,
    weekDayName: VANADIEL_WEEKDAYS[weekDay] ?? "Firesday",
    hour,
    minute,
    second,
    secondsUntilDay: clock === 0 ? DAY : DAY - clock,
    daytime: hour >= 6 && hour < 18,
    moonPercent,
    waxing,
    moonPhase: moonPhase(moonPercent, waxing),
  };
}

/**
 * The twelve clock phases. Waxing and waning each split Crescent and Gibbous.
 * New is the bottom, full is the top. The percent bands cover all 84 days.
 */
export function moonPhaseIndex(percent: number, waxing: boolean): number {
  if (percent >= 95 || (percent >= 90 && waxing)) return 6;
  if (percent <= 5 || (percent <= 10 && !waxing)) return 0;
  if (waxing) {
    if (percent <= 21) return 1;
    if (percent <= 38) return 2;
    if (percent <= 55) return 3;
    if (percent <= 71) return 4;
    return 5;
  }
  if (percent >= 79) return 7;
  if (percent >= 62) return 8;
  if (percent >= 43) return 9;
  if (percent >= 26) return 10;
  return 11;
}

export function vanadielMoonIndex(earthMs = Date.now()): number {
  const now = vanadielTime(earthMs);
  return moonPhaseIndex(now.moonPercent, now.waxing);
}

export function assertVanatime(): void {
  const born = vanadielTime(VANA_EPOCH_MS);
  if (born.year !== 886 || born.month !== 1 || born.day !== 1 || born.hour !== 0 || born.minute !== 0 || born.second !== 0 || born.weekDayName !== "Firesday") {
    throw new Error(`vana epoch ${born.year}/${born.month}/${born.day} ${born.weekDayName} ${born.hour}`);
  }
  const live = vanadielTime(Date.parse("2026-10-12T13:36:27.736Z"));
  if (live.year !== 1514 || live.month !== 7 || live.day !== 14 || live.weekDayName !== "Earthsday") {
    throw new Error(`vana date ${live.weekDayName} ${live.year}/${live.month}/${live.day}`);
  }
  if (live.hour !== 13 || live.minute !== 11 || live.second !== 33 || live.secondsUntilDay !== 38907 || !live.daytime) {
    throw new Error(`vana clock ${live.hour}:${live.minute}:${live.second}`);
  }
  if (live.moonPhase !== "Waning Gibbous" || live.moonPercent !== 64 || live.waxing || vanadielMoonIndex(Date.parse("2026-10-12T13:36:27.736Z")) !== 8) {
    throw new Error(`vana moon ${live.moonPhase} ${live.moonPercent}`);
  }
  if (moonPhaseIndex(0, false) !== 0 || moonPhaseIndex(100, true) !== 6 || moonPhaseIndex(100, false) !== 6 || moonPhaseIndex(16, true) !== 1 || moonPhaseIndex(50, true) !== 3 || moonPhaseIndex(50, false) !== 9) {
    throw new Error("moon phase index");
  }
}
