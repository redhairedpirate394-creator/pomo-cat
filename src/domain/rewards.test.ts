import { describe, expect, it } from "vitest";
import { coinsFor } from "./rewards";

describe("coinsFor", () => {
  it("pays one coin per five minutes", () => {
    expect(coinsFor(5, "normal")).toBe(1);
    expect(coinsFor(25, "normal")).toBe(5);
    expect(coinsFor(60, "normal")).toBe(12);
  });

  it("pays the same for a sad and a normal cat", () => {
    expect(coinsFor(25, "sad")).toBe(5);
  });

  it("pays 50 percent more for a happy cat, rounded up", () => {
    expect(coinsFor(25, "happy")).toBe(8);
    expect(coinsFor(5, "happy")).toBe(2);
    expect(coinsFor(20, "happy")).toBe(6);
  });
});
