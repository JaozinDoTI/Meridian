import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  forbidOnly: true,
  retries: 0,
  workers: 1,
  timeout: 30_000,
  expect: {
    timeout: 5_000,
    toHaveScreenshot: {
      animations: "disabled",
      maxDiffPixelRatio: 0.001
    }
  },
  use: {
    browserName: "chromium",
    colorScheme: "light",
    locale: "pt-BR",
    screenshot: "only-on-failure",
    trace: "retain-on-failure"
  }
});
