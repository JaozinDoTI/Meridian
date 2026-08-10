import { expect } from "@playwright/test";
import path from "node:path";
import { pathToFileURL } from "node:url";

export const completeCharacterFixture = path.resolve("tests/fixtures/character-complete.json");
const appUrl = pathToFileURL(path.resolve("index.html")).href;

export async function preparePage(page) {
  const pageErrors = [];
  page.on("pageerror", function collectPageError(error) { pageErrors.push(error); });
  await page.route("https://cdn.jsdelivr.net/**", function replaceMotion(route) {
    return route.fulfill({
      contentType: "text/javascript",
      body: "window.Motion = window.Motion || {};"
    });
  });
  await page.goto(appUrl);
  return pageErrors;
}

export async function importCompleteCharacter(page) {
  await page.setInputFiles("#json-file", completeCharacterFixture);
  await expect(page.locator("#character-sheet-screen")).toBeVisible();
  await expect(page.locator("#sheet-character-name")).toHaveText("Ariadne Vesper");
}

export async function openSheetSection(page, section) {
  await page.locator(`[data-sheet-section="${section}"]`).click();
  await expect(page.locator(`[data-sheet-view="${section}"]:not([hidden])`).first()).toBeVisible();
}
