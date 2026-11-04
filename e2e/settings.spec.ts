import { expect, test } from "@playwright/test";
import {
  feedTuna,
  finishUnit,
  nameAndStart,
  savedGame,
  seedGame,
  soundPlays,
  T0,
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
  await expect(page.getByRole("timer")).toHaveText("01:00");
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
    page.getByRole("button", { name: "Buy Salmon stick for 5 coins" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Start" }).click();
  await page.clock.fastForward("25:00");
  await page.getByRole("button", { name: "Tuna" }).click();
  await expect(page.getByRole("status")).toHaveText("Mimi gives you 5 coins.");
  const text = await page.locator("main").innerText();
  expect(text).not.toMatch(/Münze|Einheit|Füttern/);
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

test("a note follows a language change", async ({ page }) => {
  await nameAndStart(page);
  await finishUnit(page);
  await feedTuna(page);
  await expect(page.getByRole("status")).toHaveText("Mimi gibt dir 5 Münzen.");
  await openSettings(page);
  await page.getByLabel("Sprache").selectOption("en");
  await page.getByRole("button", { name: "Close" }).click();
  await expect(page.getByRole("status")).toHaveText("Mimi gives you 5 coins.");
});

test("the feed window closes the settings", async ({ page }) => {
  await nameAndStart(page);
  await openSettings(page);
  await page.clock.fastForward("25:00");
  await expect(page.getByRole("dialog", { name: "Füttern" })).toBeVisible();
  await expect(
    page.getByRole("dialog", { name: "Einstellungen" }),
  ).toBeHidden();
});

test("long text does not scroll sideways at 320 px", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await seedGame(page, {
    cat: { name: "M".repeat(20), mood: "normal", moodAt: T0.getTime() },
    todos: [{ id: "a", text: "x".repeat(120), done: false }],
    coins: 1234,
  });
  await page.goto("/");
  await page.getByRole("button", { name: "To-Dos" }).click();
  await page.getByRole("button", { name: "Shop" }).click();
  await page.getByRole("button", { name: "Kalender" }).click();
  await expect(
    page.getByRole("checkbox", { name: "x".repeat(120) }),
  ).toBeVisible();
  const overflow = () =>
    page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
  expect(await overflow()).toBeLessThanOrEqual(0);
  await page.getByRole("button", { name: "Einstellungen" }).click();
  await page.getByLabel("Sprache").selectOption("en");
  await expect(page.getByRole("dialog", { name: "Settings" })).toBeVisible();
  expect(await overflow()).toBeLessThanOrEqual(0);
});

test("the question mark explains how the cat stays happy", async ({ page }) => {
  await nameAndStart(page);
  const help = page.getByRole("button", { name: "Hilfe" });
  await help.click();
  const dialog = page.getByRole("dialog", {
    name: "So bleibt deine Katze glücklich:",
  });
  await expect(dialog.getByRole("listitem")).toHaveText([
    "Lernen, um sie zu füttern. Lernst du eine Zeit nicht, wird sie traurig :(",
    "Ab und zu ein leckerer Snack. Deine Katze wird durch diese glücklicher",
    "Ganz viele Streicheleinheiten!!!",
  ]);
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(help).toBeFocused();
});

test("the help follows the language", async ({ page }) => {
  await seedGame(page, {});
  await page.goto("/");
  await page.getByRole("button", { name: "Einstellungen" }).click();
  await page.getByLabel("Sprache").selectOption("en");
  await page.getByRole("button", { name: "Close" }).click();
  await page.getByRole("button", { name: "Help" }).click();
  const dialog = page.getByRole("dialog", {
    name: "How to keep your cat happy:",
  });
  await expect(dialog.getByRole("listitem")).toHaveCount(3);
});

test("the feed window closes the help", async ({ page }) => {
  await nameAndStart(page);
  await page.getByRole("button", { name: "Hilfe" }).click();
  await page.clock.fastForward("25:00");
  await expect(page.getByRole("dialog", { name: "Füttern" })).toBeVisible();
  await expect(
    page.getByRole("dialog", { name: "So bleibt deine Katze glücklich:" }),
  ).toBeHidden();
});

test("help and settings stay in the top left corner", async ({ page }) => {
  await seedGame(page, {});
  await page.goto("/");
  const inCorner = async () => {
    for (const name of ["Hilfe", "Einstellungen"]) {
      const box = await page.getByRole("button", { name }).boundingBox();
      expect(box?.x).toBeLessThan(120);
      expect(box?.y).toBeLessThan(30);
      expect(box?.width).toBe(box?.height);
    }
  };
  await inCorner();
  await page.getByRole("button", { name: "Start" }).click();
  await expect(page.getByRole("button", { name: "Stop" })).toBeVisible();
  await inCorner();
  await page.evaluate(() => window.scrollTo(0, 400));
  await inCorner();
});

test("the food lies in the bowl at the drawn size", async ({ page }) => {
  await nameAndStart(page);
  await page.clock.fastForward("25:00");
  const bowl = page.locator(".bowl").first();
  await expect(bowl).toBeVisible();
  const outer = await bowl.boundingBox();
  const food = await bowl.locator(".on-bowl").boundingBox();
  expect((food?.width ?? 0) / (outer?.width ?? 1)).toBeCloseTo(0.84, 2);
});

test("the corner stays clear of the timer at every width", async ({ page }) => {
  await seedGame(page, {});
  await page.goto("/");
  for (const width of [320, 704, 705, 760, 993, 1000, 1024, 1025, 1280]) {
    await page.setViewportSize({ width, height: 800 });
    const gear = await page
      .getByRole("button", { name: "Einstellungen" })
      .boundingBox();
    const timer = await page
      .getByRole("timer")
      .locator("span")
      .first()
      .boundingBox();
    const clear =
      (gear?.y ?? 0) + (gear?.height ?? 0) <= (timer?.y ?? 0) ||
      (gear?.x ?? 0) + (gear?.width ?? 0) <= (timer?.x ?? 0);
    expect(clear, `at ${width} px`).toBe(true);
  }
});

test("frames have square corners", async ({ page }) => {
  await seedGame(page, {});
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Start" })).toHaveCSS(
    "border-radius",
    "0px",
  );
  await page.getByRole("button", { name: "To-Dos" }).click();
  await expect(page.getByLabel("Neue Aufgabe")).toHaveCSS(
    "border-radius",
    "0px",
  );
});
