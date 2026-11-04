import { expect, test } from "@playwright/test";

// The owner reviews on the development server, where React starts every effect
// twice. That closed these dialogs at once while every other test stayed green.
test("dialogs stay open on the development server", async ({ page }) => {
  await page.goto("/");
  const name = page.getByRole("dialog", { name: "Wie heißt deine Katze?" });
  await expect(name).toBeVisible();
  await page.getByLabel("Name").fill("Mimi");
  await page.getByRole("button", { name: "Los geht's" }).click();
  await page.getByRole("button", { name: "Start" }).click();

  await page.getByRole("button", { name: "Stop" }).click();
  const stop = page.getByRole("dialog", { name: "Einheit abbrechen?" });
  await page.waitForTimeout(300);
  await expect(stop).toBeVisible();
  await page.getByRole("button", { name: "Weiterlernen" }).click();
  await expect(stop).toBeHidden();

  await page.getByRole("button", { name: "Einstellungen" }).click();
  const settings = page.getByRole("dialog", { name: "Einstellungen" });
  await page.waitForTimeout(300);
  await expect(settings).toBeVisible();
});
