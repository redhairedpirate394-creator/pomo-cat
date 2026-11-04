import { describe, expect, it } from "vitest";
import { addMinutes, dayKey, monthDays, streak } from "./studyLog";

const at = (day: number, hour = 12) => new Date(2026, 10, day, hour).getTime();

describe("dayKey", () => {
  it("uses the local date", () => {
    expect(dayKey(new Date(2026, 0, 5, 23, 59).getTime())).toBe("2026-01-05");
  });
});

describe("addMinutes", () => {
  it("adds up within a day", () => {
    const log = addMinutes(addMinutes({}, at(3), 12), at(3, 15), 25);
    expect(log).toEqual({ "2026-11-03": 37 });
  });

  it("ignores zero minutes", () => {
    expect(addMinutes({}, at(3), 0)).toEqual({});
  });
});

describe("streak", () => {
  const log = {
    "2026-11-01": 5,
    "2026-11-02": 30,
    "2026-11-03": 25,
  };

  it("counts consecutive days ending today", () => {
    expect(streak(log, at(3))).toBe(3);
  });

  it("stays while today is still open", () => {
    expect(streak(log, at(4))).toBe(3);
  });

  it("is gone once a full day is missed", () => {
    expect(streak(log, at(5))).toBe(0);
  });

  it("does not count days under five minutes", () => {
    expect(streak({ "2026-11-02": 4, "2026-11-03": 5 }, at(3))).toBe(1);
  });

  it("is zero for an empty log", () => {
    expect(streak({}, at(3))).toBe(0);
  });

  it("crosses month borders", () => {
    expect(streak({ "2026-10-31": 5, "2026-11-01": 5 }, at(1))).toBe(2);
  });
});

describe("monthDays", () => {
  it("lists every day of the month with its minutes", () => {
    const days = monthDays({ "2026-02-28": 25 }, 2026, 1);
    expect(days).toHaveLength(28);
    expect(days[27]).toEqual({ day: 28, minutes: 25 });
    expect(days[0]).toEqual({ day: 1, minutes: 0 });
  });
});
