import { expect, test } from "@playwright/test";
import {
  DEMO_KEY,
  feedTuna,
  finishUnit,
  KEY,
  nameAndStart,
  savedGame,
  soundPlays,
  useTestClock,
} from "./helpers";

test.beforeEach(async ({ page }) => {
  await useTestClock(page);
});

test("first start asks for a name once and goes straight to the timer", async ({
  page,
}) => {
  await page.goto("/");
  const dialog = page.getByRole("dialog", { name: "Wie heißt deine Katze?" });
  await expect(dialog).toBeVisible();

  await page.getByRole("button", { name: "Los geht's" }).click();
  await expect(page.getByRole("alert")).toContainText("Namen");

  await page.getByLabel("Name").fill("Mimi");
  await page.getByRole("button", { name: "Los geht's" }).click();
  await expect(dialog).toBeHidden();
  await expect(page.getByRole("button", { name: "Start" })).toBeVisible();

  await page.reload();
  await expect(dialog).toBeHidden();
  await expect(page.getByRole("button", { name: "Start" })).toBeVisible();
});

test("a unit shows the timer, the unit and the sleeping cat, and nothing else to do", async ({
  page,
}) => {
  await nameAndStart(page);
  await expect(page.getByRole("timer")).toHaveText("25:00");
  await expect(page.getByText("Einheit 1 von 4")).toBeVisible();
  await expect(page.getByRole("img", { name: "Mimi schläft" })).toBeVisible();
  await expect(page).toHaveTitle(/^25:00 · Pomo Cat$/);
  // Exactly the controls of the owner's sketch.
  await expect(page.getByRole("button")).toHaveCount(3);
  await expect(page.getByRole("button", { name: "To-Dos" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Stop" })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Einstellungen" }),
  ).toBeVisible();
  await expect(page.getByText(/Münze/)).toBeHidden();

  await page.clock.fastForward("10:00");
  await expect(page.getByRole("timer")).toHaveText("15:00");
  await expect(page).toHaveTitle(/^15:00 · Pomo Cat$/);
});

test("the end of a unit meows, opens the feed window and pays when fed", async ({
  page,
}) => {
  await nameAndStart(page);
  await finishUnit(page);
  expect(await soundPlays(page)).toBe(1);
  await expect(page.getByText("0 Münzen", { exact: true })).toBeAttached();

  const dialog = page.getByRole("dialog", { name: "Füttern" });
  await expect(dialog).toContainText("Was bekommt Mimi?");
  await expect(dialog.getByRole("button")).toHaveText([
    "Trockenfutter",
    "Nassfutter",
    "Thunfisch",
  ]);
  await expect(dialog).toContainText("Noch 05:00 Pause");

  await feedTuna(page);
  await expect(page.getByRole("status")).toHaveText("Mimi gibt dir 5 Münzen.");
  await expect(page.getByRole("img", { name: "Mimi frisst" })).toBeVisible();
  await expect(page.getByText("5 Münzen", { exact: true })).toBeVisible();
});

test("the next unit starts by itself after a warning meow", async ({
  page,
}) => {
  await nameAndStart(page);
  await finishUnit(page);
  await feedTuna(page);

  await page.clock.fastForward("04:30");
  await expect(page.getByRole("status")).toHaveText("Gleich geht es weiter");
  await expect(page.getByRole("button", { name: "Stopp" })).toBeVisible();
  expect(await soundPlays(page)).toBe(2);

  await page.clock.fastForward("00:31");
  await expect(page.getByText("Einheit 2 von 4")).toBeVisible();
  await expect(page.getByRole("button", { name: "Stop" })).toBeVisible();
});

test("the warning's stop button holds the run until a click", async ({
  page,
}) => {
  await nameAndStart(page);
  await finishUnit(page);
  await feedTuna(page);
  await page.clock.fastForward("04:30");
  await page.getByRole("button", { name: "Stopp" }).click();
  await page.clock.fastForward("30:00");
  await expect(
    page.getByRole("button", { name: "Weiter mit Einheit 2 von 4" }),
  ).toBeVisible();
});

test("without feeding it stops at the end of the break and the coins stay", async ({
  page,
}) => {
  await nameAndStart(page);
  await finishUnit(page);
  await page.clock.fastForward("05:01");
  await expect(page.getByRole("dialog", { name: "Füttern" })).toBeHidden();
  await expect(page.getByText("5 Münzen", { exact: true })).toBeVisible();

  // Nothing piles up, however long nobody is there.
  await page.clock.fastForward("02:00:00");
  await expect(page.getByText("5 Münzen", { exact: true })).toBeVisible();

  await page
    .getByRole("button", { name: "Weiter mit Einheit 2 von 4" })
    .click();
  await expect(page.getByText("Einheit 2 von 4")).toBeVisible();
  await expect(page.getByRole("timer")).toHaveText("25:00");
});

test("a happy cat pays more in the next unit", async ({ page }) => {
  await nameAndStart(page);
  await finishUnit(page);
  await feedTuna(page);
  await page.clock.fastForward("05:00");
  await expect(page.getByText("Einheit 2 von 4")).toBeVisible();
  await finishUnit(page);
  await feedTuna(page);
  await expect(page.getByRole("status")).toHaveText("Mimi gibt dir 8 Münzen.");
  await expect(page.getByText("13 Münzen", { exact: true })).toBeVisible();
});

test("after the last unit comes the long break, then a click", async ({
  page,
}) => {
  await nameAndStart(page);
  for (const unit of [1, 2, 3]) {
    await finishUnit(page);
    await feedTuna(page);
    await page.clock.fastForward("05:00");
    await expect(page.getByText(`Einheit ${unit + 1} von 4`)).toBeVisible();
  }
  await finishUnit(page);
  await expect(page.getByRole("dialog", { name: "Füttern" })).toContainText(
    /Noch 1[45]:[0-9][0-9] Pause/,
  );
  await feedTuna(page);
  await expect(page.getByText("Lange Pause")).toBeVisible();

  const before = await soundPlays(page);
  await page.clock.fastForward("15:01");
  await expect(page.getByRole("button", { name: "Start" })).toBeVisible();
  expect(await soundPlays(page)).toBe(before + 1);
});

test("stop asks first, then ends the run without coins or a penalty", async ({
  page,
}) => {
  await nameAndStart(page);
  await page.clock.fastForward("12:00");
  await page.getByRole("button", { name: "Stop" }).click();
  await page.getByRole("button", { name: "Weiterlernen" }).click();
  await expect(page.getByRole("timer")).toBeVisible();
  await expect(page.getByRole("button", { name: "Stop" })).toBeVisible();

  await page.getByRole("button", { name: "Stop" }).click();
  await page.getByRole("button", { name: "Ja, abbrechen" }).click();
  await expect(page.getByRole("button", { name: "Start" })).toBeVisible();
  await expect(page.getByText("0 Münzen", { exact: true })).toBeVisible();

  const game = await savedGame(page);
  expect(game.studyLog).toEqual({ "2026-11-04": 12 });
  expect(game.cat.mood).toBe("normal");
});

test("closing the app for more than two minutes cancels the unit", async ({
  page,
}) => {
  await nameAndStart(page);
  await page.clock.fastForward("10:00");
  await page.goto("about:blank");
  await page.clock.fastForward("03:00");
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Start" })).toBeVisible();
  await expect(page.getByText("0 Münzen", { exact: true })).toBeVisible();
  expect((await savedGame(page)).studyLog).toEqual({ "2026-11-04": 10 });
});

test("coming back within two minutes continues the unit", async ({ page }) => {
  await nameAndStart(page);
  await page.clock.fastForward("10:00");
  await page.goto("about:blank");
  await page.clock.fastForward("01:00");
  await page.goto("/");
  await expect(page.getByRole("timer")).toHaveText("14:00");
  await expect(page.getByRole("button", { name: "Stop" })).toBeVisible();
});

test("the layout fits without sideways scrolling", async ({ page }) => {
  const fits = () =>
    page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    );
  await nameAndStart(page);
  expect(await fits(), "learning").toBe(true);
  await finishUnit(page);
  expect(await fits(), "feed window").toBe(true);
  await feedTuna(page);
  expect(await fits(), "break").toBe(true);
  await page.clock.fastForward("04:30");
  await page.getByRole("button", { name: "Stopp" }).click();
  expect(await fits(), "held").toBe(true);
});

test("the trial link runs faster and leaves real progress alone", async ({
  page,
}) => {
  await page.goto("/?probelauf");
  await page.getByLabel("Name").fill("Probe");
  await page.getByRole("button", { name: "Los geht's" }).click();
  await page.getByRole("button", { name: "Start" }).click();
  await expect(page.getByText("30-mal schneller")).toBeVisible();

  await page.clock.fastForward("00:50");
  await expect(page.getByRole("dialog", { name: "Füttern" })).toBeVisible();
  expect(await savedGame(page, KEY)).toBeNull();
  expect((await savedGame(page, DEMO_KEY)).coins).toBe(5);
});

test("damaged data is never deleted without asking", async ({ page }) => {
  await page.addInitScript((key) => {
    if (sessionStorage.getItem("seeded") === null) {
      localStorage.setItem(key, "{broken");
      localStorage.setItem("unrelated", "keep");
      sessionStorage.setItem("seeded", "yes");
    }
  }, KEY);
  await page.goto("/");
  await expect(page.getByRole("alert")).toContainText("beschädigt");

  await page.getByRole("button", { name: "Erneut versuchen" }).click();
  await expect(page.getByRole("alert")).toContainText("beschädigt");
  expect(await page.evaluate((k) => localStorage.getItem(k), KEY)).toBe(
    "{broken",
  );

  await page.getByRole("button", { name: "Neu anfangen" }).click();
  await page.getByRole("button", { name: "Abbrechen" }).click();
  expect(await page.evaluate((k) => localStorage.getItem(k), KEY)).toBe(
    "{broken",
  );

  await page.getByRole("button", { name: "Neu anfangen" }).click();
  await page.getByRole("button", { name: "Ja, alles löschen" }).click();
  await expect(
    page.getByRole("dialog", { name: "Wie heißt deine Katze?" }),
  ).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem("unrelated"))).toBe(
    "keep",
  );
});

test("unreadable storage offers a retry and no reset", async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => {
      throw new Error("denied");
    };
  });
  await page.goto("/");
  await expect(page.getByRole("alert")).toContainText("nicht gelesen");
  await expect(
    page.getByRole("button", { name: "Erneut versuchen" }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Neu anfangen" })).toBeHidden();
});

test("a failed save says so, keeps playing and recovers on retry", async ({
  page,
}) => {
  await nameAndStart(page);
  await page.evaluate(() => {
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = () => {
      throw new Error("full");
    };
    (window as unknown as { restoreSave: () => void }).restoreSave = () => {
      Storage.prototype.setItem = original;
    };
  });
  await finishUnit(page);
  await feedTuna(page);
  await expect(page.getByRole("alert")).toContainText(
    "nicht gespeichert werden",
  );
  await expect(page.getByText("5 Münzen", { exact: true })).toBeVisible();

  await page.evaluate(() =>
    (window as unknown as { restoreSave: () => void }).restoreSave(),
  );
  await page.getByRole("button", { name: "Erneut versuchen" }).click();
  await expect(page.getByRole("alert")).toBeHidden();
  expect((await savedGame(page)).coins).toBe(5);
});

test("after an unfed stop the screen says it is paused", async ({ page }) => {
  await nameAndStart(page);
  await finishUnit(page);
  await page.clock.fastForward("05:01");
  await expect(page.getByRole("status")).toHaveText(
    "Angehalten. Es geht weiter, wenn du bereit bist.",
  );
});

test("the coin note is gone when the break is over", async ({ page }) => {
  await nameAndStart(page);
  await finishUnit(page);
  await feedTuna(page);
  await expect(page.getByRole("status")).toContainText("Mimi gibt dir");
  await page.clock.fastForward("04:30");
  await page.getByRole("button", { name: "Stopp" }).click();
  await expect(page.getByRole("status")).not.toContainText("Mimi gibt dir");
});

test("Escape never removes the name window", async ({ page }) => {
  await page.goto("/");
  const dialog = page.getByRole("dialog", { name: "Wie heißt deine Katze?" });
  for (const _ of [1, 2, 3, 4]) {
    await page.keyboard.press("Escape");
    await expect(dialog).toBeVisible();
  }
  await page.getByLabel("Name").fill("Mimi");
  await page.getByRole("button", { name: "Los geht's" }).click();
  await expect(page.getByRole("button", { name: "Start" })).toBeVisible();
});

test("Escape never removes the feed window", async ({ page }) => {
  await nameAndStart(page);
  await finishUnit(page);
  const dialog = page.getByRole("dialog", { name: "Füttern" });
  for (const _ of [1, 2, 3, 4]) {
    await page.keyboard.press("Escape");
    await expect(dialog).toBeVisible();
  }
  await feedTuna(page);
  await expect(page.getByText("5 Münzen", { exact: true })).toBeVisible();
});

test("Escape on the stop question keeps learning", async ({ page }) => {
  await nameAndStart(page);
  for (const _ of [1, 2, 3]) {
    await page.getByRole("button", { name: "Stop" }).click();
    await page.keyboard.press("Escape");
    await expect(
      page.getByRole("dialog", { name: "Einheit abbrechen?" }),
    ).toBeHidden();
    await expect(page.getByRole("timer")).toBeVisible();
  }
  await expect(page.getByRole("button", { name: "Stop" })).toBeVisible();
});

test("leaving the page records the last moment it was open", async ({
  page,
}) => {
  await nameAndStart(page);
  const before = (await savedGame(page)).lastSeenAt;
  await page.clock.fastForward("00:05");
  await page.evaluate(() => window.dispatchEvent(new Event("pagehide")));
  const after = (await savedGame(page)).lastSeenAt;
  expect(after - before).toBeGreaterThanOrEqual(5000);
  expect(after - before).toBeLessThan(15_000);
});

test("hiding the tab records the last moment it was open", async ({ page }) => {
  await nameAndStart(page);
  const before = (await savedGame(page)).lastSeenAt;
  await page.clock.fastForward("00:05");
  await page.evaluate(() => {
    Object.defineProperty(document, "visibilityState", { value: "hidden" });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  const after = (await savedGame(page)).lastSeenAt;
  expect(after - before).toBeGreaterThanOrEqual(5000);
  expect(after - before).toBeLessThan(15_000);
});

test("a running unit keeps saving that the app is open", async ({ page }) => {
  await nameAndStart(page);
  const before = (await savedGame(page)).lastSeenAt;
  await page.clock.fastForward("00:16");
  await expect
    .poll(async () => (await savedGame(page)).lastSeenAt - before)
    .toBeGreaterThanOrEqual(15_000);
});

test("a failed reset stays blocked and loses nothing", async ({ page }) => {
  await page.addInitScript((key) => {
    localStorage.setItem(key, "{broken");
    Storage.prototype.removeItem = () => {
      throw new Error("denied");
    };
  }, KEY);
  await page.goto("/");
  await page.getByRole("button", { name: "Neu anfangen" }).click();
  await page.getByRole("button", { name: "Ja, alles löschen" }).click();
  await expect(page.getByRole("alert")).toContainText("nicht gelöscht");
  await page.getByRole("button", { name: "Erneut versuchen" }).click();
  await expect(page.getByRole("alert")).toContainText("beschädigt");
  expect(await page.evaluate((k) => localStorage.getItem(k), KEY)).toBe(
    "{broken",
  );
});

test("retry recovers once storage can be read again", async ({ page }) => {
  await page.addInitScript(() => {
    const original = Storage.prototype.getItem;
    Storage.prototype.getItem = () => {
      throw new Error("denied");
    };
    (window as unknown as { allowRead: () => void }).allowRead = () => {
      Storage.prototype.getItem = original;
    };
  });
  await page.goto("/");
  await expect(page.getByRole("alert")).toContainText("nicht gelesen");
  await page.evaluate(() =>
    (window as unknown as { allowRead: () => void }).allowRead(),
  );
  await page.getByRole("button", { name: "Erneut versuchen" }).click();
  await expect(
    page.getByRole("dialog", { name: "Wie heißt deine Katze?" }),
  ).toBeVisible();
});
