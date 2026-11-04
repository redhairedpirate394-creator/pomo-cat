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

describe("plurals and number formatting", () => {
  it("picks singular and plural for minutes, including 1", () => {
    expect(catalogs.de.minutes(1)).toBe("1 Minute");
    expect(catalogs.de.minutes(5)).toBe("5 Minuten");
    expect(catalogs.en.minutes(1)).toBe("1 minute");
    expect(catalogs.en.minutes(25)).toBe("25 minutes");
  });

  it("picks singular and plural for streak days", () => {
    expect(catalogs.de.streak(1)).toBe("1 Tag in Folge");
    expect(catalogs.de.streak(3)).toBe("3 Tage in Folge");
    expect(catalogs.en.streak(1)).toBe("1 day in a row");
    expect(catalogs.en.streak(3)).toBe("3 days in a row");
  });

  it("uses singular and plural in the calendar day label", () => {
    expect(catalogs.de.dayMinutes("4. Nov", 1)).toBe(
      "4. Nov: 1 Minute gelernt",
    );
    expect(catalogs.en.dayMinutes("4 Nov", 30)).toBe(
      "4 Nov: 30 minutes learned",
    );
    expect(catalogs.en.dayMinutes("4 Nov", 0)).toBe("4 Nov");
  });

  it("groups thousands for the catalog's locale", () => {
    expect(catalogs.de.coins(1000)).toBe("1.000 Münzen");
    expect(catalogs.en.coins(1000)).toBe("1,000 coins");
    expect(catalogs.en.coins(1)).toBe("1 coin");
  });
});
