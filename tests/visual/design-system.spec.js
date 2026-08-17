import { expect, test } from "@playwright/test";
import { importCompleteCharacter, openSheetSection, preparePage } from "../helpers/app.js";

const scenarios = [
  { name: "creation-desktop", viewport: { width: 1440, height: 900 }, view: "creation" },
  { name: "creation-mobile", viewport: { width: 390, height: 844 }, view: "creation" },
  { name: "abilities-desktop", viewport: { width: 1440, height: 900 }, view: "abilities" },
  { name: "inventory-desktop", viewport: { width: 1440, height: 900 }, view: "inventory" },
  { name: "journal-desktop", viewport: { width: 1440, height: 900 }, view: "journal" },
  { name: "journal-mobile", viewport: { width: 390, height: 844 }, view: "journal" }
];

for (const scenario of scenarios) {
  test(`registra componentes padronizados em ${scenario.name}`, async function ({ page }) {
    await page.setViewportSize(scenario.viewport);
    await preparePage(page);

    if (scenario.view === "creation") {
      await page.locator("#create-character").click();
    } else {
      await importCompleteCharacter(page);
      await openSheetSection(page, scenario.view);
    }

    await expect(page).toHaveScreenshot(`${scenario.name}.png`, { animations: "disabled" });
  });
}
