import { afterEach, describe, expect, it, vi } from "vitest";
import { createDemoClock } from "./clock";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("createDemoClock", () => {
  it("runs faster from its starting point", () => {
    vi.spyOn(Date, "now").mockReturnValue(1000 + 10_000);
    expect(createDemoClock(30, 1000).now()).toBe(1000 + 300_000);
  });

  it("gives the same time after a reload, so saved timestamps stay valid", () => {
    vi.spyOn(Date, "now").mockReturnValue(5000);
    const before = createDemoClock(30, 1000).now();
    const afterReload = createDemoClock(30, 1000).now();
    expect(afterReload).toBe(before);
  });
});
