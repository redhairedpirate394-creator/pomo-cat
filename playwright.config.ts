import { defineConfig, devices } from "@playwright/test";

// E2E_PORT moves the preview server off 4173 when another process holds it.
const port = Number(process.env.E2E_PORT ?? 4173);
const url = `http://127.0.0.1:${port}`;
const devPort = port + 1;
const devUrl = `http://127.0.0.1:${devPort}`;

export default defineConfig({
  testDir: "./e2e",
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL: url,
    locale: "de-DE",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      testIgnore: /dev-smoke/,
      use: { ...devices["Desktop Chrome"] },
    },
    { name: "mobile", testIgnore: /dev-smoke/, use: { ...devices["Pixel 7"] } },
    // Round reviews use the development server, where React starts every
    // effect twice; a production build cannot show what that breaks.
    {
      name: "dev",
      testMatch: /dev-smoke/,
      use: { ...devices["Desktop Chrome"], baseURL: devUrl },
    },
  ],
  webServer: [
    {
      command: `pnpm preview --host 127.0.0.1 --port ${port} --strictPort`,
      url,
      reuseExistingServer: false,
    },
    {
      command: `pnpm dev --host 127.0.0.1 --port ${devPort} --strictPort`,
      url: devUrl,
      reuseExistingServer: false,
    },
  ],
});
