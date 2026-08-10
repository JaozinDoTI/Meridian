import { expect, test } from "@playwright/test";
import { importCompleteCharacter, openSheetSection, preparePage } from "../helpers/app.js";

test.beforeEach(async function ({ page }) {
  await preparePage(page);
  await importCompleteCharacter(page);
  await openSheetSection(page, "abilities");
});

test("preserva busca, filtros, seleção e contadores operacionais", async function ({ page }) {
  await expect(page.locator("#sheet-ability-list-count")).toHaveText("4");
  await expect(page.locator(".ability-list-card")).toHaveCount(4);

  await page.locator("#sheet-ability-search").fill("Pele de Pedra");
  await expect(page.locator(".ability-list-card")).toHaveCount(1);
  await expect(page.locator(".ability-list-card")).toContainText("Pele de Pedra");

  await page.locator("#sheet-ability-search").fill("");
  await page.locator("#sheet-ability-state-filter").selectOption("esgotada");
  await expect(page.locator(".ability-list-card")).toHaveCount(1);
  await expect(page.locator(".ability-list-card")).toContainText("Carga Voltaica");

  await page.locator("#sheet-ability-state-filter").selectOption("todos");
  await page.locator('#sheet-ability-list [data-ability-id="ability-arcane-strike"]').click();
  await expect(page.locator("#sheet-ability-details")).toContainText("2 / 3");
  await page.locator('[data-ability-action="decrease-uses"]').click();
  await expect(page.locator("#sheet-ability-details")).toContainText("1 / 3");
});

test("mantém os resumos calculados sobre a coleção completa durante filtros", async function ({ page }) {
  await page.locator("#sheet-ability-state-filter").selectOption("passiva");
  await expect(page.locator(".ability-list-card")).toHaveCount(1);
  await expect(page.locator("#sheet-ability-stats")).toContainText("Total de habilidades");
  await expect(page.locator("#sheet-ability-stats")).toContainText("4");
  await expect(page.locator("#sheet-ability-stats")).toContainText("2 / 5");
});
