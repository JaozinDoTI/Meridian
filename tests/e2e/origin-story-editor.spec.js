import { expect, test } from "@playwright/test";
import { preparePage } from "../helpers/app.js";

async function abrirEtapaDeOrigem(page) {
  await page.locator("#create-character").click();
  await page.locator("#character-name").fill("Iria Valedouro");
  await page.locator("#player-name").fill("Jogadora de Notebook");
  await page.locator("#creation-next").click();
  await page.locator('[data-species-id="vesperiano"]').click();
  await page.locator("#creation-next").click();
  await page.locator("#class-list button[data-class-id]").first().click();
  await page.locator("#creation-next").click();
  await expect(page.locator("#origin-step")).toBeVisible();
}

test.beforeEach(async function ({ page }) {
  await page.setViewportSize({ width: 1366, height: 768 });
  await preparePage(page);
  await abrirEtapaDeOrigem(page);
});

test("edita uma história longa em modal e preserva o mesmo estado da criação", async function ({ page }) {
  const editor = page.locator("#origin-story-dialog");
  const story = page.locator("#origin-story");
  const historiaLonga = Array.from({ length: 420 }, function (_, index) {
    return index % 9 === 0 ? "Meridian." : "memória";
  }).join(" ");

  await expect(editor).toBeHidden();
  await page.locator("#origin-story-open").click();
  await expect(editor).toBeVisible();
  await expect(story).toBeFocused();
  const editorBox = await editor.boundingBox();
  const storyBox = await story.boundingBox();
  expect(editorBox.height).toBeGreaterThan(600);
  expect(editorBox.y).toBeGreaterThanOrEqual(0);
  expect(editorBox.y + editorBox.height).toBeLessThanOrEqual(768);
  expect(storyBox.height).toBeGreaterThan(350);
  await story.fill("Este rascunho deve ser descartado.");
  await story.press("Escape");

  await expect(editor).toBeHidden();
  await page.locator("#origin-story-open").click();
  await expect(story).toHaveValue("");
  await story.fill(historiaLonga);
  await expect(page.locator("#origin-story-word-count")).toContainText("420 palavras");
  await page.locator("#origin-story-save").click();

  await expect(editor).toBeHidden();
  await expect(page.locator("#origin-story-preview")).toContainText("Meridian");
  await expect(page.locator("#origin-story-summary-count")).toContainText("420 palavras");

  await page.locator("#origin-story-open").click();
  await expect(story).toHaveValue(historiaLonga);
  await page.locator("#origin-story-save").click();
  await page.locator("#origin-title").fill("As memórias de Valedouro");
  await page.locator("#creation-next").click();
  await expect(page.locator("#attributes-step")).toBeVisible();
});

test("uma pergunta de inspiração abre o editor sem salvar ao cancelar", async function ({ page }) {
  await page.locator(".origin-prompt-list button").first().click();

  await expect(page.locator("#origin-story-dialog")).toBeVisible();
  await expect(page.locator("#origin-story")).not.toHaveValue("");
  await page.locator("#origin-story-cancel").click();

  await expect(page.locator("#origin-story-dialog")).toBeHidden();
  await expect(page.locator("#origin-story-preview")).toContainText("Nenhuma história escrita");

  await page.locator("#origin-title").fill("Origem incompleta");
  await page.locator("#creation-next").click();
  await expect(page.locator("#origin-story-dialog")).toBeVisible();
  await expect(page.locator("#origin-story-error")).toContainText("Conte um pouco mais");
  await expect(page.locator("#origin-story")).toBeFocused();
});

test("ocupa a tela móvel e preserva o limite ao fechar ou salvar", async function ({ page }) {
  await page.setViewportSize({ width: 390, height: 844 });
  const editor = page.locator("#origin-story-dialog");
  const story = page.locator("#origin-story");
  const historiaNoLimite = "a".repeat(20000);

  await page.locator("#origin-story-open").click();
  const editorBox = await editor.boundingBox();
  const actionsBox = await page.locator(".origin-story-dialog__actions").boundingBox();
  expect(editorBox.width).toBe(390);
  expect(editorBox.height).toBe(844);
  expect(actionsBox.y + actionsBox.height).toBeLessThanOrEqual(844);
  await story.fill("Rascunho fechado pelo botão superior.");
  await page.locator("#origin-story-close").click();

  await page.locator("#origin-story-open").click();
  await expect(story).toHaveValue("");
  await story.fill(historiaNoLimite);
  await expect(story).toHaveAttribute("maxlength", "20000");
  await expect(page.locator("#origin-story-counter")).toHaveText("20000 / 20000");
  await page.locator("#origin-story-save").click();

  await page.locator("#origin-story-open").click();
  await expect(story).toHaveValue(historiaNoLimite);
});
