import { expect, test } from "@playwright/test";
import { importCompleteCharacter, preparePage } from "../helpers/app.js";

test("mantém os destinos globais e troca somente entre views funcionais", async function ({ page }) {
  const pageErrors = await preparePage(page);
  await importCompleteCharacter(page);

  await expect(page.locator('[data-sheet-section="summary"]')).toHaveAttribute("aria-current", "page");
  await page.locator('[data-sheet-section="abilities"]').click();
  await expect(page.locator("#sheet-abilities-view")).toBeVisible();
  await expect(page.locator('[data-sheet-section="abilities"]')).toHaveAttribute("aria-current", "page");

  await page.locator('[data-sheet-section="combat"]').click({ force: true });
  await expect(page.locator("#sheet-abilities-view")).toBeVisible();
  await expect(page.locator("#sheet-save-status")).toContainText("Combate ainda está em desenvolvimento");
  expect(pageErrors).toEqual([]);
});

test("abre e fecha o menu Mais no mobile preservando o foco", async function ({ page }) {
  await page.setViewportSize({ width: 390, height: 844 });
  await preparePage(page);
  await importCompleteCharacter(page);

  const more = page.locator("#sheet-sidebar-more");
  await more.click();
  await expect(more).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("#sheet-sidebar-future-menu")).toBeVisible();
  await more.press("Escape");
  await expect(more).toHaveAttribute("aria-expanded", "false");
  await expect(more).toBeFocused();
});
