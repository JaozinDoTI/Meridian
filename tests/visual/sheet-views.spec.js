import { expect, test } from "@playwright/test";
import { importCompleteCharacter, openSheetSection, preparePage } from "../helpers/app.js";

const viewports = [
  { name: "desktop-wide", width: 1440, height: 900 },
  { name: "desktop-low", width: 1280, height: 720 },
  { name: "tablet-rail", width: 1024, height: 768 },
  { name: "tablet-portrait", width: 768, height: 1024 },
  { name: "mobile", width: 390, height: 844 }
];

for (const viewport of viewports) {
  test(`registra baseline visual em ${viewport.name}`, async function ({ page }) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await preparePage(page);
    await importCompleteCharacter(page);

    for (const section of ["summary", "abilities", "inventory"]) {
      await openSheetSection(page, section);
      await expect(page).toHaveScreenshot(`${viewport.name}-${section}.png`, { fullPage: true });
    }
  });
}
