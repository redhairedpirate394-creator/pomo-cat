/** Learned minutes per local calendar day, keyed YYYY-MM-DD. */
export type StudyLog = Readonly<Record<string, number>>;

const STREAK_MINUTES = 5;

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

function key(year: number, month: number, day: number): string {
  return `${year}-${pad(month + 1)}-${pad(day)}`;
}

export function dayKey(time: number): string {
  const date = new Date(time);
  return key(date.getFullYear(), date.getMonth(), date.getDate());
}

export function addMinutes(
  log: StudyLog,
  time: number,
  minutes: number,
): StudyLog {
  if (minutes <= 0) return log;
  const day = dayKey(time);
  return { ...log, [day]: (log[day] ?? 0) + minutes };
}

function counts(log: StudyLog, date: Date): boolean {
  const day = key(date.getFullYear(), date.getMonth(), date.getDate());
  return (log[day] ?? 0) >= STREAK_MINUTES;
}

/** Days in a row ending today, or yesterday while today is still open. */
export function streak(log: StudyLog, now: number): number {
  const date = new Date(now);
  if (!counts(log, date)) date.setDate(date.getDate() - 1);
  let days = 0;
  while (counts(log, date)) {
    days += 1;
    date.setDate(date.getDate() - 1);
  }
  return days;
}

export interface MonthDay {
  readonly day: number;
  readonly minutes: number;
}

/** month is zero-based, as in Date. */
export function monthDays(
  log: StudyLog,
  year: number,
  month: number,
): MonthDay[] {
  const length = new Date(year, month + 1, 0).getDate();
  return Array.from({ length }, (_, index) => ({
    day: index + 1,
    minutes: log[key(year, month, index + 1)] ?? 0,
  }));
}
