import { expect, test } from "@playwright/test";
import {
  feedTuna,
  finishUnit,
  nameAndStart,
  savedGame,
  seedGame,
  soundPlays,
  useTestClock,
} from "./helpers";

test.beforeEach(async ({ page }) => {
  await useTestClock(page);
});

const openSettings = (page: import("@playwright/test").Page) =>
  page.getByRole("button", { name: "Einstellungen" }).click();
const close = (page: import("@playwright/test").Page) =>
  page.getByRole("button", { name: "Schließen" }).click();

test("times come in five-minute steps inside their limits", async ({
  page,
}) => {
  await seedGame(page, {});
  await page.goto("/");
  await openSettings(page);
  const learn = page.getByLabel("Lernzeit").locator("option");
  await expect(learn).toHaveCount(12);
  await expect(learn.first()).toHaveText("5 Minuten");
  await expect(learn.last()).toHaveText("60 Minuten");
  await expect(page.getByLabel("Kurze Pause").locator("option")).toHaveCount(6);
  await expect(page.getByLabel("Einheiten").locator("option")).toHaveCount(8);
});

test("new times and units apply from the next start", async ({ page }) => {
  await seedGame(page, {});
  await page.goto("/");
  await openSettings(page);
  await page.getByLabel("Lernzeit").selectOption("30");
  await page.getByLabel("Einheiten").selectOption("2");
  await close(page);
  await page.getByRole("button", { name: "Start" }).click();
  await expect(page.getByRole("timer")).toHaveText("30:00");
  await expect(page.getByText("Einheit 1 von 2")).toBeVisible();
});

test("changes during a run wait for the next start", async ({ page }) => {
  await nameAndStart(page);
  await openSettings(page);
  await page.getByLabel("Lernzeit").selectOption("50");
  await close(page);
  await expect(page.getByText("Einheit 1 von 4")).toBeVisible();
  await page.clock.fastForward("24:00");
  await expect(page.getByRole("timer")).toContainText("00:");
  expect((await savedGame(page)).phase.plan.learnMinutes).toBe(25);
});

test("the language changes at once, also during a run", async ({ page }) => {
  await nameAndStart(page);
  await openSettings(page);
  await page.getByLabel("Sprache").selectOption("en");
  await expect(page.getByRole("dialog", { name: "Settings" })).toBeVisible();
  await page.getByRole("button", { name: "Close" }).click();
  await expect(page.getByText("Unit 1 of 4")).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");

  await page.reload();
  await expect(page.getByText("Unit 1 of 4")).toBeVisible();
});

test("the whole game can be played in English", async ({ page }) => {
  await seedGame(page, {
    settings: {
      learnMinutes: 25,
      shortBreakMinutes: 5,
      longBreakMinutes: 15,
      units: 4,
      sound: true,
      language: "en",
    },
    coins: 10,
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Calendar" }).click();
  await expect(page.getByText("November 2026")).toBeVisible();
  await page.getByRole("button", { name: "Shop" }).click();
  await expect(
    page.getByRole("button", { name: "Buy Salmon stick for 3 coins" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Start" }).click();
  await finishUnit(page).catch(() => undefined);
  await page.getByRole("button", { name: "Tuna" }).click();
  await expect(page.getByRole("status")).toHaveText("Mimi gives you 5 coins.");
  const german = await page.locator("main").innerText();
  expect(german).not.toMatch(/Münze|Einheit|Füttern/);
});

test("the browser language decides on the first start", async ({ browser }) => {
  const context = await browser.newContext({ locale: "en-GB" });
  const page = await context.newPage();
  await page.goto("/");
  await expect(
    page.getByRole("dialog", { name: "What is your cat called?" }),
  ).toBeVisible();
  await context.close();
});

test("with the sound off the warning still shows", async ({ page }) => {
  await nameAndStart(page);
  await openSettings(page);
  await page.getByLabel("Ton an").uncheck();
  await close(page);
  await finishUnit(page);
  await feedTuna(page);
  await page.clock.fastForward("04:30");
  await expect(page.getByRole("status")).toHaveText("Gleich geht es weiter");
  expect(await soundPlays(page)).toBe(0);
});
