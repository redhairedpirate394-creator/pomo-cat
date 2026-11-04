import { expect, test } from "@playwright/test";
import {
  feedTuna,
  finishUnit,
  KEY,
  nameAndStart,
  savedGame,
  seedGame,
  useTestClock,
} from "./helpers";

test.beforeEach(async ({ page }) => {
  await useTestClock(page);
});

async function openShop(page: import("@playwright/test").Page) {
  await page.getByRole("button", { name: "Shop" }).click();
}

test("the shop is closed at first and lists everything with prices", async ({
  page,
}) => {
  await seedGame(page, { coins: 40 });
  await page.goto("/");
  await expect(page.getByText("Lachsstick")).toBeHidden();
  await openShop(page);
  for (const name of [
    "Lachsstick für 3 Münzen kaufen",
    "Knusperkissen für 3 Münzen kaufen",
    "Katzenminze für 3 Münzen kaufen",
    "Wollknäuel für 5 Münzen kaufen",
    "Spielmaus für 5 Münzen kaufen",
    "Kissen für 5 Münzen kaufen",
    "Pflanze für 10 Münzen kaufen",
    "Teppich für 10 Münzen kaufen",
    "Kratzbaum für 20 Münzen kaufen",
  ]) {
    await expect(page.getByRole("button", { name })).toBeEnabled();
  }
});

test("a snack is fed at once and lifts the mood", async ({ page }) => {
  await seedGame(page, { coins: 3 });
  await page.goto("/");
  await expect(page.getByRole("img", { name: "Mimi sitzt da" })).toBeVisible();
  await openShop(page);
  await page
    .getByRole("button", { name: "Lachsstick für 3 Münzen kaufen" })
    .click();
  await expect(page.getByRole("status")).toHaveText("Mimi liebt Lachsstick!");
  await expect(page.getByText("0 Münzen", { exact: true })).toBeVisible();
  expect((await savedGame(page)).cat.mood).toBe("happy");
});

test("a room item stays at its place, once, also after a reload", async ({
  page,
}) => {
  await seedGame(page, { coins: 5 });
  await page.goto("/");
  await openShop(page);
  await page
    .getByRole("button", { name: "Kissen für 5 Münzen kaufen" })
    .click();
  await expect(page.getByRole("img", { name: "Kissen" })).toBeVisible();
  await expect(page.getByText("Kissen: gehört dir")).toBeVisible();
  await expect(page.getByRole("button", { name: /Kissen für/ })).toHaveCount(0);

  await page.reload();
  await expect(page.getByRole("img", { name: "Kissen" })).toBeVisible();
  await openShop(page);
  await expect(page.getByText("Kissen: gehört dir")).toBeVisible();
});

test("too few coins show the price but do not buy", async ({ page }) => {
  await seedGame(page, { coins: 2 });
  await page.goto("/");
  await openShop(page);
  await expect(
    page.getByRole("button", { name: "Lachsstick für 3 Münzen kaufen" }),
  ).toBeDisabled();
  await expect(
    page.getByRole("button", { name: "Kratzbaum für 20 Münzen kaufen" }),
  ).toBeDisabled();
});

test("shop is out of reach during a unit", async ({ page }) => {
  await nameAndStart(page);
  await expect(page.getByRole("button", { name: "Shop" })).toBeHidden();
});

test("a toy can be played with in a break, not during a unit", async ({
  page,
}) => {
  await seedGame(page, { owned: ["yarn", "pillow"], coins: 0 });
  await page.goto("/");
  await page.getByRole("button", { name: "Start" }).click();
  await expect(
    page.getByRole("button", { name: /Mit Wollknäuel/ }),
  ).toBeHidden();
  await finishUnit(page);
  await feedTuna(page);
  await page.getByRole("button", { name: "Mit Wollknäuel spielen" }).click();
  await expect(page.getByRole("status")).toHaveText(
    "Mimi spielt mit Wollknäuel.",
  );
  await expect(page.getByRole("button", { name: /Mit Kissen/ })).toHaveCount(0);
});

test("the scratching post is affordable after four default units", async ({
  page,
}) => {
  await nameAndStart(page);
  for (const unit of [1, 2, 3, 4]) {
    await finishUnit(page);
    await feedTuna(page);
    if (unit < 4) {
      await page.getByRole("button", { name: "Jetzt weiterlernen" }).click();
    }
  }
  await openShop(page);
  await expect(
    page.getByRole("button", { name: "Kratzbaum für 20 Münzen kaufen" }),
  ).toBeEnabled();
  expect((await savedGame(page, KEY)).coins).toBeGreaterThanOrEqual(20);
});

test("buying everything still fits without sideways scrolling", async ({
  page,
}) => {
  await seedGame(page, {
    owned: ["yarn", "mouse", "pillow", "plant", "rug", "scratching-post"],
  });
  await page.goto("/");
  await openShop(page);
  await expect(page.getByRole("img", { name: "Pflanze" })).toBeVisible();
  const fits = await page.evaluate(
    () => document.documentElement.scrollWidth <= window.innerWidth,
  );
  expect(fits).toBe(true);
});

test("every toy can be clicked or tapped in a break", async ({ page }) => {
  await seedGame(page, { owned: ["yarn", "mouse", "scratching-post"] });
  await page.goto("/");
  await page.getByRole("button", { name: "Start" }).click();
  await finishUnit(page);
  await feedTuna(page);
  for (const [button, note] of [
    ["Mit Wollknäuel spielen", "Mimi spielt mit Wollknäuel."],
    ["Mit Spielmaus spielen", "Mimi spielt mit Spielmaus."],
    ["Mit Kratzbaum spielen", "Mimi spielt mit Kratzbaum."],
  ] as const) {
    await page.getByRole("button", { name: button }).click();
    await expect(page.getByRole("status")).toHaveText(note);
  }
});

test("buying says so, also while the run is held", async ({ page }) => {
  await seedGame(page, {
    coins: 20,
    phase: {
      kind: "held",
      plan: {
        learnMinutes: 25,
        shortBreakMinutes: 5,
        longBreakMinutes: 15,
        units: 4,
      },
      nextUnit: 2,
    },
  });
  await page.goto("/");
  await openShop(page);
  await page
    .getByRole("button", { name: "Lachsstick für 3 Münzen kaufen" })
    .click();
  await expect(page.getByRole("status")).toHaveText("Mimi liebt Lachsstick!");
  await page
    .getByRole("button", { name: "Kissen für 5 Münzen kaufen" })
    .click();
  await expect(page.getByRole("status")).toHaveText(
    "Kissen steht jetzt im Raum.",
  );
});

test("room items keep their shape while the cat sleeps", async ({ page }) => {
  await seedGame(page, {
    owned: ["yarn", "mouse", "pillow", "plant", "rug", "scratching-post"],
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Start" }).click();
  await page.getByRole("img", { name: "Spielmaus" }).waitFor();
  const shapes = await page.locator("img.room-item").evaluateAll((images) =>
    images.map((element) => {
      const image = element as HTMLImageElement;
      const box = image.getBoundingClientRect();
      return {
        name: image.alt,
        drawn: image.naturalWidth / image.naturalHeight,
        shown: box.width / box.height,
      };
    }),
  );
  expect(shapes).toHaveLength(6);
  for (const { name, drawn, shown } of shapes) {
    expect(Math.abs(shown / drawn - 1), name).toBeLessThan(0.05);
  }
});
