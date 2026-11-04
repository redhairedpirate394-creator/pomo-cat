import { describe, expect, it } from "vitest";
import { CatError, createCat, currentMood, NAME_MAX, raiseMood } from "./cat";

const HOUR = 60 * 60 * 1000;

describe("createCat", () => {
  it("trims the name and starts normal", () => {
    expect(createCat("  Mimi ", 5)).toEqual({
      name: "Mimi",
      mood: "normal",
      moodAt: 5,
    });
  });

  it("requires a name", () => {
    expect(() => createCat("   ", 0)).toThrow(CatError);
  });

  it("limits the name length after trimming", () => {
    expect(createCat(` ${"a".repeat(NAME_MAX)} `, 0).name).toHaveLength(
      NAME_MAX,
    );
    expect(() => createCat("a".repeat(NAME_MAX + 1), 0)).toThrow(
      "name-too-long",
    );
  });
});

describe("currentMood", () => {
  const happy = { name: "Mimi", mood: "happy", moodAt: 0 } as const;
  const normal = { ...happy, mood: "normal" } as const;

  it("keeps a happy cat for just under two days", () => {
    expect(currentMood(happy, 48 * HOUR - 1)).toBe("happy");
  });

  it("turns a happy cat normal after two days", () => {
    expect(currentMood(happy, 48 * HOUR)).toBe("normal");
  });

  it("turns any cat sad after four days", () => {
    expect(currentMood(normal, 96 * HOUR - 1)).toBe("normal");
    expect(currentMood(normal, 96 * HOUR)).toBe("sad");
    expect(currentMood(happy, 96 * HOUR)).toBe("sad");
  });

  it("stays sad forever", () => {
    expect(currentMood(happy, 10_000 * HOUR)).toBe("sad");
  });
});

describe("raiseMood", () => {
  it("raises one step from the current mood and restarts the clock", () => {
    const cat = { name: "Mimi", mood: "happy", moodAt: 0 } as const;
    expect(raiseMood(cat, 100 * HOUR)).toEqual({
      ...cat,
      mood: "normal",
      moodAt: 100 * HOUR,
    });
  });

  it("stops at happy", () => {
    const cat = { name: "Mimi", mood: "happy", moodAt: 0 } as const;
    expect(raiseMood(cat, HOUR).mood).toBe("happy");
  });

  it("raises normal to happy", () => {
    const cat = { name: "Mimi", mood: "normal", moodAt: 0 } as const;
    expect(raiseMood(cat, HOUR).mood).toBe("happy");
  });
});
