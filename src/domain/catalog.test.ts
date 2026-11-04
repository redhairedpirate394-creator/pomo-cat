import { describe, expect, it } from "vitest";
import { FOODS, ROOM_ITEMS, SNACK_PRICE, SNACKS } from "./catalog";
import { coinsFor } from "./rewards";

describe("catalog", () => {
  it("offers three foods and three snacks", () => {
    expect(FOODS).toHaveLength(3);
    expect(SNACKS).toHaveLength(3);
  });

  it("keeps the small shop affordable with default settings", () => {
    const perUnit = coinsFor(25, "normal");
    expect(SNACK_PRICE).toBeLessThanOrEqual(perUnit);
    const postPrice = ROOM_ITEMS.find(
      (item) => item.id === "scratching-post",
    )?.price;
    expect(postPrice).toBe(20);
    expect(postPrice).toBeLessThanOrEqual(perUnit * 4);
  });
});
