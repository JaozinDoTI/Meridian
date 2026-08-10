import { expect, test } from "@playwright/test";
import { preparePage } from "../helpers/app.js";

const portraitPng = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
  "base64"
);

test.beforeEach(async function ({ page }) {
  await preparePage(page);
});

test("preserva landing, validacao inicial e rejeicao de importacao invalida", async function ({ page }) {
  await expect(page.locator("#landing-view")).toBeVisible();
  await expect(page.locator("#creation-screen")).toBeHidden();
  await expect(page.locator("#character-sheet-screen")).toBeHidden();

  await page.setInputFiles("#json-file", {
    name: "ficha-invalida.json",
    mimeType: "application/json",
    buffer: Buffer.from("{json invalido")
  });
  await expect(page.locator("#file-status")).toContainText(/JSON v.lido/);
  await expect(page.locator("#landing-view")).toBeVisible();

  await page.locator("#create-character").click();
  await expect(page.locator("#identity-step")).toBeVisible();
  await page.locator("#creation-next").click();
  await expect(page.locator("#character-name-error")).not.toBeEmpty();
  await expect(page.locator("#player-name-error")).not.toBeEmpty();
  await expect(page.locator("#character-name")).toBeFocused();
});

test("preserva criacao completa, retrato, revisao, exportacao e abertura da ficha", async function ({ page }) {
  await page.locator("#create-character").click();
  await page.locator("#character-name").fill("Lyra do Meridiano");
  await page.locator("#player-name").fill("Jogadora Baseline");
  await page.locator("#campaign-name").fill("CÃ©us Partidos");
  await page.locator("#game-master").fill("Mestre Aster");

  await page.setInputFiles("#portrait-input", {
    name: "lyra.png",
    mimeType: "image/png",
    buffer: portraitPng
  });
  await expect(page.locator("#portrait-crop-dialog")).toBeVisible();
  await page.locator("#portrait-crop-apply").click();
  await expect(page.locator("#portrait-preview")).toBeVisible();

  await page.locator("#creation-next").click();
  await expect(page.locator("#species-step")).toBeVisible();
  await page.locator('[data-species-id="vesperiano"]').click();
  await page.locator("#creation-next").click();

  await expect(page.locator("#class-step")).toBeVisible();
  await page.locator("#class-list button[data-class-id]").first().click();
  await page.locator("#creation-next").click();

  await expect(page.locator("#origin-step")).toBeVisible();
  await page.locator("#origin-title").fill("Herdeira das MarÃ©s");
  await page.locator("#origin-place").fill("Costa de Vidro");
  await page.locator("#origin-story").fill("Lyra atravessou as ruÃ­nas costeiras em busca de um mapa perdido.");
  await page.locator("#creation-next").click();

  await expect(page.locator("#attributes-step")).toBeVisible();
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const remaining = Number(await page.locator("#attributes-points-remaining").textContent());
    if (remaining === 0) break;
    await page.locator('button[data-attribute-action="increase"]:not(:disabled)').first().click();
  }
  await expect(page.locator("#attributes-points-remaining")).toHaveText("0");

  await page.locator("#skills-tab-button").click();
  const skills = page.locator("#skills-list input[data-skill-id]");
  await skills.nth(0).check();
  await skills.nth(1).check();
  await skills.nth(2).check();
  await expect(page.locator("#skills-trained-count")).toHaveText("3");
  await expect(page.locator("#creation-next")).toBeEnabled();
  await page.locator("#creation-next").click();

  await expect(page.locator("#review-step")).toBeVisible();
  await expect(page.locator("#review-character-name")).toHaveText("Lyra do Meridiano");
  await expect(page.locator("#review-species-name")).not.toBeEmpty();
  await expect(page.locator("#review-class-name")).not.toBeEmpty();
  await expect(page.locator("#review-trained-skills")).not.toBeEmpty();

  const downloadPromise = page.waitForEvent("download");
  await page.locator("#review-save-json").click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/\.json$/);
  const stream = await download.createReadStream();
  let exported = "";
  for await (const chunk of stream) exported += chunk.toString("utf8");
  const envelope = JSON.parse(exported);
  expect(envelope.tipo).toBe("grimorio-ficha");
  expect(envelope.versao).toBe(2);
  expect(envelope.personagem.nome).toBe("Lyra do Meridiano");
  expect(envelope.personagem.retrato).toMatch(/^data:image\/webp;base64,/);

  await page.locator("#review-open-sheet").click();
  await expect(page.locator("#character-sheet-screen")).toBeVisible();
  await expect(page.locator("#sheet-character-name")).toHaveText("Lyra do Meridiano");
  await expect(page.locator("#sheet-portrait-image")).toBeVisible();
});
