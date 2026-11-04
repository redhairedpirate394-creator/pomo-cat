import { describe, expect, it } from "vitest";
import { formatClock } from "./format";

describe("formatClock", () => {
  it("shows minutes and seconds", () => {
    expect(formatClock(25 * 60_000)).toBe("25:00");
    expect(formatClock(61_000)).toBe("01:01");
    expect(formatClock(60 * 60_000)).toBe("60:00");
  });

  it("rounds up, so zero means the time is really over", () => {
    expect(formatClock(1)).toBe("00:01");
    expect(formatClock(59_001)).toBe("01:00");
    expect(formatClock(0)).toBe("00:00");
  });
});
