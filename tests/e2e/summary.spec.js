import { expect, test } from "@playwright/test";
import { importCompleteCharacter, preparePage } from "../helpers/app.js";

test.beforeEach(async function ({ page }) {
  await preparePage(page);
  await importCompleteCharacter(page);
});

test("preserva identidade, progressao e combate resumido", async function ({ page }) {
  await expect(page.locator("#sheet-character-name")).toHaveText("Ariadne Vesper");
  await expect(page.locator("#sheet-player-name")).toHaveText("Baseline");
  await expect(page.locator("#sheet-campaign-name")).toHaveText("Meridian");
  await expect(page.locator("#sheet-master-name")).toHaveText("Codex");
  await expect(page.locator("#sheet-origin-title")).toContainText("Cart");
  await expect(page.locator("#sheet-origin-place")).toContainText("Distrito");

  await expect(page.locator("#sheet-level")).toHaveText("3");
  await expect(page.locator("#sheet-experience")).toHaveText("180");
  await expect(page.locator("#sheet-evolution-points")).toHaveText("2");
  await expect(page.locator("#sheet-glory-points")).toHaveText("1");
  await expect(page.locator("#sheet-defense")).toHaveText("13");
  await expect(page.locator("#sheet-damage-reduction")).toHaveText("2");
  await expect(page.locator("#sheet-initiative")).toHaveText("4");
  await expect(page.locator("#sheet-movement")).toHaveText("9");
});

test("preserva recursos, limites e estado de alteracao", async function ({ page }) {
  const life = page.locator("#sheet-life-current");
  const mana = page.locator("#sheet-mana-current");

  await expect(life).toHaveValue("17");
  await expect(page.locator("#sheet-life-max")).toHaveText("24");
  await expect(page.locator("#sheet-life-percent")).toHaveText("71%");
  await expect(mana).toHaveValue("8");
  await expect(page.locator("#sheet-mana-max")).toHaveText("15");
  await expect(page.locator("#sheet-mana-percent")).toHaveText("53%");

  await page.locator("#sheet-life-minus").click();
  await expect(life).toHaveValue("16");
  await page.locator("#sheet-life-plus").click();
  await expect(life).toHaveValue("17");
  await page.locator("#sheet-mana-minus").click();
  await expect(mana).toHaveValue("7");
  await page.locator("#sheet-mana-plus").click();
  await expect(mana).toHaveValue("8");
  await expect(page.locator("#sheet-save-state")).toContainText("n");
  await expect(page.locator("#sheet-save-state")).toHaveClass(/is-dirty/);
});

test("preserva atributos, vulnerabilidade e consulta rapida de pericias", async function ({ page }) {
  await expect(page.locator(".sheet-attribute-card")).toHaveCount(4);
  await expect(page.locator('.sheet-attribute-card[data-attribute="forca"]')).toContainText("For");
  await expect(page.locator('.sheet-attribute-card[data-attribute="forca"] .sheet-attribute-final')).toHaveText("1");
  await expect(page.locator('.sheet-attribute-card[data-attribute="agilidade"] .sheet-attribute-final')).toHaveText("2");
  await expect(page.locator('.sheet-attribute-card[data-attribute="intelecto"] .sheet-attribute-final')).toHaveText("4");
  await expect(page.locator('.sheet-attribute-card[data-attribute="resistencia"] .sheet-attribute-final')).toHaveText("2");
  await expect(page.locator("#sheet-vulnerability-title")).not.toBeEmpty();
  await expect(page.locator("#sheet-vulnerability-description")).not.toBeEmpty();

  const skills = page.locator("#sheet-skills-list");
  await expect(skills).toContainText("Conhecimento");
  await expect(skills).toContainText("Investiga");
  await expect(skills).toContainText("Misticismo");
  await expect(skills.locator(".sheet-skill-row")).toHaveCount(4);
});

test("preserva resumos e atalhos para habilidades e inventario", async function ({ page }) {
  await expect(page.locator("#sheet-abilities-summary .sheet-ability-summary-item")).toHaveCount(4);
  await expect(page.locator("#sheet-abilities-summary")).toContainText("Golpe Arcano");
  await expect(page.locator("#sheet-inventory-used-cells")).toHaveText(/7 de 30 c.lulas ocupadas/);
  await expect(page.locator("#sheet-inventory-free-cells")).toHaveText(/23 c.lulas livres/);

  await page.locator("#sheet-open-abilities").click();
  await expect(page.locator("#sheet-abilities-view")).toBeVisible();
  await page.locator('[data-sheet-section="summary"]').click();
  await page.locator("#sheet-open-inventory").click();
  await expect(page.locator("#sheet-inventory-view")).toBeVisible();
});
