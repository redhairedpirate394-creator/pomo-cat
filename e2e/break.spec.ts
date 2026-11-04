import { expect, test } from "@playwright/test";
import {
  feedTuna,
  finishUnit,
  nameAndStart,
  savedGame,
  seedGame,
  T0,
  useTestClock,
} from "./helpers";

const HOUR = 60 * 60 * 1000;

test.beforeEach(async ({ page }) => {
  await useTestClock(page);
});

test("petting makes the cat react and leaves the break and the game alone", async ({
  page,
}) => {
  await nameAndStart(page);
  await finishUnit(page);
  await feedTuna(page);
  const before = await savedGame(page);
  const timer = await page.getByRole("timer").textContent();

  await page.getByRole("button", { name: "Mimi streicheln" }).click();
  await expect(
    page.getByRole("img", { name: "Mimi genießt es" }),
  ).toBeVisible();
  await expect(page.getByRole("timer")).not.toHaveText("");
  expect(timer).toBeTruthy();

  const after = await savedGame(page);
  expect(after.coins).toBe(before.coins);
  expect(after.cat).toEqual(before.cat);
});

test("the cat cannot be petted during a unit", async ({ page }) => {
  await nameAndStart(page);
  await expect(page.getByRole("button", { name: /streicheln/ })).toBeHidden();
});

test("holding stops the countdown without a limit, and continue goes on", async ({
  page,
}) => {
  await nameAndStart(page);
  await finishUnit(page);
  await feedTuna(page);
  await page.getByRole("button", { name: "Anhalten" }).click();
  await page.clock.fastForward("02:00:00");
  await page
    .getByRole("button", { name: "Weiter mit Einheit 2 von 4" })
    .click();
  await expect(page.getByText("Einheit 2 von 4")).toBeVisible();
  await expect(page.getByRole("timer")).toHaveText("25:00");
});

test("a held run is still there after closing the app", async ({ page }) => {
  await nameAndStart(page);
  await finishUnit(page);
  await feedTuna(page);
  await page.getByRole("button", { name: "Anhalten" }).click();
  await page.goto("about:blank");
  await page.clock.fastForward("24:00:00");
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Weiter mit Einheit 2 von 4" }),
  ).toBeVisible();
});

test("closing the app during a break holds the run", async ({ page }) => {
  await nameAndStart(page);
  await finishUnit(page);
  await feedTuna(page);
  await page.goto("about:blank");
  await page.clock.fastForward("03:00");
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Weiter mit Einheit 2 von 4" }),
  ).toBeVisible();
});

test("learn now ends the break early", async ({ page }) => {
  await nameAndStart(page);
  await finishUnit(page);
  await feedTuna(page);
  await page.getByRole("button", { name: "Jetzt weiterlernen" }).click();
  await expect(page.getByText("Einheit 2 von 4")).toBeVisible();
  await expect(page.getByRole("timer")).toHaveText("25:00");
});

test("the long break has learn now but no hold", async ({ page }) => {
  await seedGame(page, {
    settings: {
      learnMinutes: 25,
      shortBreakMinutes: 5,
      longBreakMinutes: 15,
      units: 1,
      sound: true,
      language: null,
    },
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Start" }).click();
  await finishUnit(page);
  await feedTuna(page);
  await expect(page.getByRole("button", { name: "Anhalten" })).toBeHidden();
  await page.getByRole("button", { name: "Jetzt weiterlernen" }).click();
  await expect(page.getByText("Einheit 1 von 1")).toBeVisible();
});

for (const [hours, mood, alt] of [
  [47, "happy", "Mimi ist fröhlich"],
  [48, "happy", "Mimi sitzt da"],
  [96, "happy", "Mimi ist traurig"],
  [24 * 365, "normal", "Mimi ist traurig"],
] as const) {
  test(`after ${hours} hours a ${mood} cat shows as "${alt}"`, async ({
    page,
  }) => {
    await seedGame(page, {
      cat: { name: "Mimi", mood, moodAt: T0.getTime() - hours * HOUR },
    });
    await page.goto("/");
    await expect(page.getByRole("img", { name: alt })).toBeVisible();
  });
}

test("a finished unit lifts a sad cat one step and it never disappears", async ({
  page,
}) => {
  await seedGame(page, {
    cat: { name: "Mimi", mood: "sad", moodAt: T0.getTime() - 1000 * HOUR },
  });
  await page.goto("/");
  await expect(
    page.getByRole("img", { name: "Mimi ist traurig" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Start" }).click();
  await finishUnit(page);
  await feedTuna(page);
  await page.clock.fastForward("00:04");
  await expect(page.getByRole("img", { name: "Mimi sitzt da" })).toBeVisible();
  expect((await savedGame(page)).cat.mood).toBe("normal");
});
