import { expect, test } from "@playwright/test";
import { importCompleteCharacter, openSheetSection, preparePage } from "../helpers/app.js";
import path from "node:path";

const importedItemFixture = path.resolve("tests/fixtures/item-field-lantern.json");

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

test("preserva movimento por teclado e cancelamento sem mutação", async function ({ page }) {
  const item = page.locator('[data-inventory-item-id="item-tonic"]');
  await item.click();
  await page.locator("#sheet-move-item").click();

  const originCell = page.locator('.sheet-inventory-cell[data-x="3"][data-y="0"]');
  await expect(originCell).toBeFocused();
  await originCell.press("ArrowRight");
  const targetCell = page.locator('.sheet-inventory-cell[data-x="4"][data-y="0"]');
  await expect(targetCell).toBeFocused();
  await targetCell.press("Escape");

  await expect(item).toHaveAttribute("aria-label", /coluna 4, linha 1/);
  await expect(page.locator("#sheet-inventory-placement-status")).toContainText("Selecione ou arraste");
});

test("preserva equipar e desequipar com retorno à mochila", async function ({ page }) {
  await page.locator('[data-inventory-item-id="item-colossal-sword"]').click();
  await page.locator("#sheet-equip-item").click();

  const mainHand = page.locator('[data-equipment-slot="maoPrincipal"]');
  await expect(mainHand).toContainText("Espada Colossal");
  await expect(page.locator('[data-inventory-item-id="item-colossal-sword"]')).toHaveCount(0);

  await mainHand.click();
  await expect(page.locator('[data-inventory-item-id="item-colossal-sword"]')).toBeVisible();
  await expect(mainHand).not.toContainText("Espada Colossal");
});

test("preserva descarte cancelado e descarte confirmado", async function ({ page }) {
  const tonic = page.locator('[data-inventory-item-id="item-tonic"]');
  await tonic.click();
  await page.locator("#sheet-discard-item").click();
  await expect(page.locator("#inventory-discard-dialog")).toBeVisible();
  await page.locator("#inventory-discard-cancel").click();
  await expect(tonic).toBeVisible();

  await page.locator("#sheet-discard-item").click();
  await page.locator("#inventory-discard-confirm").click();
  await expect(tonic).toHaveCount(0);
  await expect(page.locator("#sheet-inventory-item-count")).toHaveText("3");
});

test("preserva importação, reveal e colocação da bancada por arraste físico", async function ({ page }) {
  await page.locator("#sheet-discard-pending-item").click();
  await expect(page.locator(".inventory-bench__empty")).toBeVisible();

  await page.setInputFiles("#sheet-item-file", importedItemFixture);
  await expect(page.locator("#inventory-reveal-dialog")).toBeVisible();
  await expect(page.locator("#inventory-reveal-title")).toHaveText("Lanterna de Campo");
  await page.locator("#inventory-reveal-confirm").click();
  await expect(page.locator(".inventory-bench-card")).toContainText("Lanterna de Campo");

  const benchArt = page.locator('[data-inventory-drag-source="bench"] .inventory-item-art');
  const origin = await benchArt.boundingBox();
  const target = await page.locator('.sheet-inventory-cell[data-x="4"][data-y="1"]').boundingBox();
  if (!origin || !target) throw new Error("Elementos do gesto não possuem geometria");
  await page.mouse.move(origin.x + origin.width / 2, origin.y + origin.height / 2);
  await page.mouse.down();
  await page.mouse.move(origin.x + origin.width / 2 + 18, origin.y + origin.height / 2 + 12, { steps: 3 });
  await page.mouse.move(target.x + target.width / 2, target.y + target.height / 2, { steps: 5 });
  await page.mouse.up();

  await expect(page.locator(".sheet-inventory-item", { hasText: "Lanterna de Campo" })).toBeVisible();
  await expect(page.locator(".inventory-bench__empty")).toBeVisible();
});

test("preserva retorno à origem após drop físico inválido", async function ({ page }) {
  const tonic = page.locator('[data-inventory-item-id="item-tonic"]');
  const before = await tonic.getAttribute("aria-label");
  const origin = await tonic.boundingBox();
  const outside = await page.locator(".inventory-header").boundingBox();
  if (!origin || !outside) throw new Error("Elementos do gesto não possuem geometria");

  await page.mouse.move(origin.x + origin.width / 2, origin.y + origin.height / 2);
  await page.mouse.down();
  await page.mouse.move(origin.x + origin.width / 2 + 20, origin.y + origin.height / 2 + 12, { steps: 3 });
  await page.mouse.move(outside.x + 8, outside.y + 8, { steps: 4 });
  await page.mouse.up();

  await expect(page.locator('[data-inventory-item-id="item-tonic"]')).toHaveAttribute("aria-label", before || "");
  await expect(page.locator("#sheet-inventory-placement-status")).toContainText(/voltou|destino/i);
});

test.describe("movimento reduzido", function () {
  test.use({ reducedMotion: "reduce" });

  test("mantém a decisão persistente sem animação residual", async function ({ page }) {
    await page.locator('[data-inventory-item-id="item-tonic"]').click();
    await page.locator("#sheet-move-item").click();
    const originCell = page.locator('.sheet-inventory-cell[data-x="3"][data-y="0"]');
    await originCell.press("ArrowRight");
    await page.locator('.sheet-inventory-cell[data-x="4"][data-y="0"]').press("Enter");

    const moved = page.locator('[data-inventory-item-id="item-tonic"]');
    await expect(moved).toHaveAttribute("aria-label", /coluna 5, linha 1/);
    await expect(moved).not.toHaveClass(/is-settling|is-rejected/);
  });
});
