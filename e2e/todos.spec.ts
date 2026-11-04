import { expect, test } from "@playwright/test";
import { nameAndStart, savedGame, seedGame, useTestClock } from "./helpers";

test.beforeEach(async ({ page }) => {
  await useTestClock(page);
});

const openTodos = (page: import("@playwright/test").Page) =>
  page.getByRole("button", { name: "To-Dos" }).click();

async function add(page: import("@playwright/test").Page, text: string) {
  await page.getByLabel("Neue Aufgabe").fill(text);
  await page.getByRole("button", { name: "Eintragen" }).click();
}

test("a task can be added while a unit runs", async ({ page }) => {
  await nameAndStart(page);
  await openTodos(page);
  await add(page, "Vokabeln lernen");
  await expect(
    page.getByRole("checkbox", { name: "Vokabeln lernen" }),
  ).toBeVisible();
  await expect(page.getByLabel("Neue Aufgabe")).toHaveValue("");
});

test("an empty task is refused", async ({ page }) => {
  await seedGame(page, {});
  await page.goto("/");
  await openTodos(page);
  await add(page, "   ");
  await expect(page.getByRole("alert")).toContainText("Aufgabe");
});

test("ticking crosses a task out and pays nothing", async ({ page }) => {
  await seedGame(page, {
    todos: [{ id: "a", text: "Lesen", done: false }],
    coins: 2,
  });
  await page.goto("/");
  await openTodos(page);
  await page.getByRole("checkbox", { name: "Lesen" }).check();
  await expect(page.getByRole("checkbox", { name: "Lesen" })).toBeChecked();
  const game = await savedGame(page);
  expect(game.todos[0].done).toBe(true);
  expect(game.coins).toBe(2);
});

test("a task can be deleted", async ({ page }) => {
  await seedGame(page, { todos: [{ id: "a", text: "Lesen", done: false }] });
  await page.goto("/");
  await openTodos(page);
  await page.getByRole("button", { name: "Lesen löschen" }).click();
  await expect(page.getByRole("checkbox", { name: "Lesen" })).toBeHidden();
  expect((await savedGame(page)).todos).toEqual([]);
});

test("tasks survive a reload and the list starts closed", async ({ page }) => {
  await seedGame(page, {});
  await page.goto("/");
  await openTodos(page);
  await add(page, "Lesen");
  await page.reload();
  await expect(page.getByLabel("Neue Aufgabe")).toBeHidden();
  await openTodos(page);
  await expect(page.getByRole("checkbox", { name: "Lesen" })).toBeVisible();
});
