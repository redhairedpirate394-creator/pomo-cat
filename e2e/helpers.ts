import { expect, type Page } from "@playwright/test";

export const KEY = "pomo-cat:game:v1";
export const DEMO_KEY = "pomo-cat:demo:v1";
export const T0 = new Date("2026-11-04T09:00:00");

/** Fixes the page's time, so tests can jump instead of waiting. */
export async function useTestClock(page: Page) {
  await page.clock.install({ time: T0 });
  // Time moves only when a test says so, which keeps exact checks exact.
  await page.clock.pauseAt(T0.getTime() + 1000);
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

/** Starts the page with a saved game; `T0` is the page's time. */
export async function seedGame(page: Page, overrides: Record<string, unknown>) {
  const game = {
    version: 1,
    cat: { name: "Mimi", mood: "normal", moodAt: T0.getTime() },
    coins: 0,
    owned: [],
    studyLog: {},
    todos: [],
    settings: {
      learnMinutes: 25,
      shortBreakMinutes: 5,
      longBreakMinutes: 15,
      units: 4,
      sound: true,
      language: null,
    },
    phase: { kind: "idle" },
    lastSeenAt: null,
    ...overrides,
  };
  await page.addInitScript(
    ([key, value]) => {
      if (sessionStorage.getItem("seeded") === null) {
        sessionStorage.setItem("seeded", "yes");
        localStorage.setItem(key as string, value as string);
      }
    },
    [KEY, JSON.stringify(game)],
  );
}
