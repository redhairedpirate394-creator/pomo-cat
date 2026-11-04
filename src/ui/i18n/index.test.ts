import { describe, expect, it } from "vitest";
import { CatError } from "../../domain/cat";
import { StoreError } from "../../storage/port";
import { catalogs, defaultLocale, detectLocale, errorCode } from "./index";

describe("catalogs", () => {
  it("defaults to German", () => {
    expect(defaultLocale).toBe("de");
  });

  it("has the same top-level strings in every locale", () => {
    expect(Object.keys(catalogs.en).sort()).toEqual(
      Object.keys(catalogs.de).sort(),
    );
  });

  it("uses singular and plural for coins", () => {
    expect(catalogs.de.coins(1)).toBe("1 Münze");
    expect(catalogs.de.coins(5)).toBe("5 Münzen");
    expect(catalogs.en.coins(1)).toBe("1 coin");
    expect(catalogs.en.coins(0)).toBe("0 coins");
  });
});

describe("detectLocale", () => {
  it("follows the browser", () => {
    expect(detectLocale(["de-AT", "en"])).toBe("de");
    expect(detectLocale(["en-GB"])).toBe("en");
  });

  it("takes the first language it knows", () => {
    expect(detectLocale(["fr", "en-US", "de"])).toBe("en");
  });

  it("falls back to German", () => {
    expect(detectLocale(["fr"])).toBe("de");
    expect(detectLocale([])).toBe("de");
  });
});

describe("errorCode", () => {
  it("passes typed codes through", () => {
    expect(errorCode(new CatError("name-required"))).toBe("name-required");
    expect(errorCode(new StoreError("save-failed"))).toBe("save-failed");
  });

  it("maps anything else to unexpected", () => {
    expect(errorCode(new Error("boom"))).toBe("unexpected");
  });
});
