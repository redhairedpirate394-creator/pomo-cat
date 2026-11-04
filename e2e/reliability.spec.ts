import { expect, type Page, test } from "@playwright/test";
import {
  feedTuna,
  finishUnit,
  nameAndStart,
  savedGame,
  seedGame,
  useTestClock,
} from "./helpers";

test.beforeEach(async ({ page }) => {
  await useTestClock(page);
});

test("a second tab waits, shows a notice and takes over later", async ({
  page,
  context,
}) => {
  await nameAndStart(page);
  const second = await context.newPage();
  await second.goto("/");
  await expect(
    second.getByText("läuft schon in einem anderen Tab"),
  ).toBeVisible();
  await expect(second.getByRole("button")).toHaveCount(0);

  await page.close();
  await expect(second.getByRole("timer")).toBeVisible();
  await expect(second.getByRole("button", { name: "Stop" })).toBeVisible();
});

test("two tabs never earn twice", async ({ page, context }) => {
  await nameAndStart(page);
  const second = await context.newPage();
  await second.goto("/");
  await expect(
    second.getByText("läuft schon in einem anderen Tab"),
  ).toBeVisible();
  await finishUnit(page);
  await feedTuna(page);
  expect((await savedGame(page)).coins).toBe(5);
  await second.close();
});

test("a reload loses nothing, wherever it happens", async ({ page }) => {
  await seedGame(page, {
    coins: 10,
    owned: ["yarn"],
    todos: [{ id: "a", text: "Lesen", done: true }],
    studyLog: { "2026-11-03": 25 },
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Start" }).click();
  await finishUnit(page);

  await page.reload();
  await expect(page.getByRole("dialog", { name: "Füttern" })).toBeVisible();
  await feedTuna(page);
  await page.reload();
  await expect(page.getByText("15 Münzen", { exact: true })).toBeVisible();

  const game = await savedGame(page);
  expect(game.coins).toBe(15);
  expect(game.owned).toEqual(["yarn"]);
  expect(game.todos).toHaveLength(1);
  expect(game.studyLog).toEqual({ "2026-11-03": 25, "2026-11-04": 25 });
});

test("the app talks to nobody else", async ({ page }) => {
  const external: string[] = [];
  page.on("request", (request) => {
    const url = request.url();
    if (!/^(http:\/\/127\.0\.0\.1|blob:|data:)/.test(url)) external.push(url);
  });
  await nameAndStart(page);
  await finishUnit(page);
  await feedTuna(page);
  await page.getByRole("button", { name: "Shop" }).click();
  await page.getByRole("button", { name: "Kalender" }).click();
  expect(external).toEqual([]);
});

async function tabTo(page: Page, name: string) {
  for (let step = 0; step < 40; step += 1) {
    await page.keyboard.press("Tab");
    const focused = await page.evaluate(() => {
      const element = document.activeElement;
      return element?.getAttribute("aria-label") ?? element?.textContent ?? "";
    });
    if (focused.trim() === name) return;
  }
  throw new Error(`${name} cannot be reached with Tab`);
}

test("the whole game works with the keyboard alone", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "phones have no keyboard");
  await seedGame(page, { coins: 10 });
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Start" })).toBeVisible();

  await tabTo(page, "To-Dos");
  await page.keyboard.press("Enter");
  await page.keyboard.press("Tab");
  await page.keyboard.type("Lesen");
  await page.keyboard.press("Enter");
  await expect(page.getByRole("checkbox", { name: "Lesen" })).toBeVisible();

  await tabTo(page, "Start");
  await page.keyboard.press("Enter");
  await expect(page.getByRole("timer")).toBeVisible();

  await page.clock.fastForward("25:00");
  const dialog = page.getByRole("dialog", { name: "Füttern" });
  await expect(dialog).toBeVisible();
  // A key pressed by chance when the window opens must not feed.
  await page.keyboard.press("Enter");
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");
  await expect(dialog).toBeHidden();
  await expect(page.getByRole("status")).toContainText("Mimi gibt dir");

  await tabTo(page, "Mimi streicheln");
  await page.keyboard.press("Enter");
  await tabTo(page, "Anhalten");
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("button", { name: "Weiter mit Einheit 2 von 4" }),
  ).toBeVisible();

  await tabTo(page, "Shop");
  await page.keyboard.press("Enter");
  await tabTo(page, "Lachsstick für 3 Münzen kaufen");
  await page.keyboard.press("Enter");
  await expect(page.getByRole("status")).toHaveText("Mimi liebt Lachsstick!");

  await tabTo(page, "Kalender");
  await page.keyboard.press("Enter");
  await expect(page.getByText("November 2026")).toBeVisible();

  await tabTo(page, "Einstellungen");
  await page.keyboard.press("Enter");
  const settings = page.getByRole("dialog", { name: "Einstellungen" });
  await expect(settings).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(settings).toBeHidden();

  await tabTo(page, "Weiter mit Einheit 2 von 4");
  await page.keyboard.press("Enter");
  await tabTo(page, "Stop");
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("dialog", { name: "Einheit abbrechen?" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("timer")).toBeVisible();
});

test("every dialog has a name and keeps focus inside", async ({ page }) => {
  await nameAndStart(page);
  await page.getByRole("button", { name: "Einstellungen" }).click();
  const dialog = page.getByRole("dialog", { name: "Einstellungen" });
  await expect(dialog).toBeVisible();
  await expect(dialog.locator(":focus")).toBeVisible();
  await page.keyboard.press("Tab");
  await expect(dialog.locator(":focus")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(page.getByRole("button", { name: "Stop" })).toBeVisible();
});
