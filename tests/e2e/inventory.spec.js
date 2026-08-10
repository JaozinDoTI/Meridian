import { expect, test } from "@playwright/test";
import { importCompleteCharacter, openSheetSection, preparePage } from "../helpers/app.js";

test.beforeEach(async function ({ page }) {
  await preparePage(page);
  await importCompleteCharacter(page);
  await openSheetSection(page, "inventory");
});

test("preserva mochila, bancada, equipamento e resumos", async function ({ page }) {
  await expect(page.locator('[data-inventory-item-id="item-colossal-sword"]')).toBeVisible();
  await expect(page.locator('[data-inventory-item-id="item-tonic"]')).toBeVisible();
  await expect(page.locator(".inventory-bench-card")).toContainText("Kit de Cartografia");
  await expect(page.locator('[data-equipment-slot="armadura"]')).toContainText("Casaco Blindado");
  await expect(page.locator("#sheet-inventory-used-cells")).toHaveText("7 de 30 células ocupadas");
  await expect(page.locator("#sheet-inventory-item-count")).toHaveText("4");
});

test("preserva seleção, inspeção e rotação do item", async function ({ page }) {
  await page.locator('[data-inventory-item-id="item-colossal-sword"]').click();
  await expect(page.locator("#sheet-inventory-details")).toContainText("Espada Colossal");
  await expect(page.locator("#sheet-inventory-details")).toContainText("2 × 3");
  await page.locator("#sheet-rotate-item").click();
  await expect(page.locator("#sheet-inventory-details")).toContainText("3 × 2");
});
