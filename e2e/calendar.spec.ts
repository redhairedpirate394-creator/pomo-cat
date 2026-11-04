import { expect, test } from "@playwright/test";
import { finishUnit, nameAndStart, seedGame, useTestClock } from "./helpers";

test.beforeEach(async ({ page }) => {
  await useTestClock(page);
});

const openCalendar = (page: import("@playwright/test").Page) =>
  page.getByRole("button", { name: "Kalender" }).click();

test("the month shows learned minutes per day", async ({ page }) => {
  await seedGame(page, { studyLog: { "2026-11-02": 50 } });
  await page.goto("/");
  await expect(page.getByText("November 2026")).toBeHidden();
  await openCalendar(page);
  await expect(page.getByText("November 2026")).toBeVisible();
  await expect(
    page.getByLabel("2. November: 50 Minuten gelernt"),
  ).toBeVisible();
});

test("a cancelled unit counts up to the moment it stopped", async ({
  page,
}) => {
  await nameAndStart(page);
  await page.clock.fastForward("12:00");
  await page.getByRole("button", { name: "Stop" }).click();
  await page.getByRole("button", { name: "Ja, abbrechen" }).click();
  await openCalendar(page);
  await expect(
    page.getByLabel("4. November: 12 Minuten gelernt"),
  ).toBeVisible();
});

test("breaks do not count", async ({ page }) => {
  await nameAndStart(page);
  await finishUnit(page);
  await page.clock.fastForward("05:01");
  await openCalendar(page);
  await expect(
    page.getByLabel("4. November: 25 Minuten gelernt"),
  ).toBeVisible();
});

test("three days in a row show as a small streak", async ({ page }) => {
  await seedGame(page, {
    studyLog: { "2026-11-02": 5, "2026-11-03": 25, "2026-11-04": 10 },
  });
  await page.goto("/");
  await openCalendar(page);
  await expect(page.getByText("3 Tage in Folge")).toBeVisible();
});

test("after a gap the streak starts again without a word", async ({ page }) => {
  await seedGame(page, {
    studyLog: { "2026-11-01": 25, "2026-11-04": 25 },
  });
  await page.goto("/");
  await openCalendar(page);
  await expect(page.getByText("1 Tag in Folge")).toBeVisible();
});

test("earlier months can be browsed, the future cannot", async ({ page }) => {
  await seedGame(page, { studyLog: { "2026-10-31": 25 } });
  await page.goto("/");
  await openCalendar(page);
  await expect(
    page.getByRole("button", { name: "Nächster Monat" }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Vorheriger Monat" }).click();
  await expect(page.getByText("Oktober 2026")).toBeVisible();
  await expect(
    page.getByLabel("31. Oktober: 25 Minuten gelernt"),
  ).toBeVisible();
});

test("the calendar is out of reach during a unit", async ({ page }) => {
  await nameAndStart(page);
  await expect(page.getByRole("button", { name: "Kalender" })).toBeHidden();
});
