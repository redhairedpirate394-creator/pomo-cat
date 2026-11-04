import { expect, type Page } from "@playwright/test";

export const KEY = "pomo-cat:game:v1";
export const DEMO_KEY = "pomo-cat:demo:v1";
export const T0 = new Date("2026-11-04T09:00:00");

/** Fixes the page's time, so tests can jump instead of waiting. */
export async function useTestClock(page: Page) {
  await page.clock.install({ time: T0 });
  await page.addInitScript(() => {
    const plays = { count: 0 };
    Object.defineProperty(window, "soundPlays", { value: plays });
    HTMLMediaElement.prototype.play = async function (this: HTMLMediaElement) {
      if (!this.muted) plays.count += 1;
    };
  });
}

export function soundPlays(page: Page) {
  return page.evaluate(
    () =>
      (window as unknown as { soundPlays: { count: number } }).soundPlays.count,
  );
}

export async function nameAndStart(page: Page) {
  await page.goto("/");
  await page.getByLabel("Name").fill("Mimi");
  await page.getByRole("button", { name: "Los geht's" }).click();
  await page.getByRole("button", { name: "Start" }).click();
  await expect(page.getByRole("timer")).toBeVisible();
}

export async function finishUnit(page: Page) {
  await page.clock.fastForward("25:00");
  await expect(page.getByRole("dialog", { name: "Füttern" })).toBeVisible();
}

export async function feedTuna(page: Page) {
  await page.getByRole("button", { name: "Thunfisch" }).click();
  await expect(page.getByRole("dialog", { name: "Füttern" })).toBeHidden();
}

export function savedGame(page: Page, key = KEY) {
  return page.evaluate((k) => {
    const raw = localStorage.getItem(k);
    return raw === null ? null : JSON.parse(raw);
  }, key);
}
