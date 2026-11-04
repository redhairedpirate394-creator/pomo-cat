import { describe, expect, it } from "vitest";
import {
  DEFAULT_SETTINGS,
  isValidMinutes,
  isValidUnits,
  LIMITS,
  planFrom,
} from "./settings";

describe("settings", () => {
  it("defaults to 25, 5 and 15 minutes with four units", () => {
    expect(planFrom(DEFAULT_SETTINGS)).toEqual({
      learnMinutes: 25,
      shortBreakMinutes: 5,
      longBreakMinutes: 15,
      units: 4,
    });
  });

  it("accepts only multiples of five inside the limits", () => {
    const limit = LIMITS.shortBreakMinutes;
    expect(isValidMinutes(5, limit)).toBe(true);
    expect(isValidMinutes(30, limit)).toBe(true);
    expect(isValidMinutes(0, limit)).toBe(false);
    expect(isValidMinutes(35, limit)).toBe(false);
    expect(isValidMinutes(7, limit)).toBe(false);
    expect(isValidMinutes(7.5, limit)).toBe(false);
  });

  it("accepts one to eight units", () => {
    expect(isValidUnits(1)).toBe(true);
    expect(isValidUnits(8)).toBe(true);
    expect(isValidUnits(0)).toBe(false);
    expect(isValidUnits(9)).toBe(false);
    expect(isValidUnits(1.5)).toBe(false);
  });
});
