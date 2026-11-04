import { describe, expect, it } from "vitest";
import { FOODS, SHOP_ITEMS, SNACK_PRICE, SNACKS } from "./catalog";
import { coinsFor } from "./rewards";

describe("catalog", () => {
  it("offers three foods and three snacks", () => {
    expect(FOODS).toHaveLength(3);
    expect(SNACKS).toHaveLength(3);
  });

  it("keeps the small shop affordable with default settings", () => {
    const perUnit = coinsFor(25, "normal");
    expect(SNACK_PRICE).toBeLessThanOrEqual(perUnit);
  });

  it("offers only the drawn things in the shop for now", () => {
    expect(SHOP_ITEMS.map((item) => item.id)).toEqual([
      "yarn",
      "mouse",
      "pillow",
    ]);
  });
});
