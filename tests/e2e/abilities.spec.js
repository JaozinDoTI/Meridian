import { expect, test } from "@playwright/test";
import { importCompleteCharacter, openSheetSection, preparePage } from "../helpers/app.js";

test.beforeEach(async function ({ page }) {
  await preparePage(page);
  await importCompleteCharacter(page);
  await openSheetSection(page, "abilities");
});

test("mantem habilidades e resumo operacional no shell do notebook HD baixo", async function ({ page }) {
  await page.setViewportSize({ width: 1366, height: 650 });

  const composicao = await page.evaluate(function () {
    const resumo = document.querySelector("#sheet-ability-stats").getBoundingClientRect();
    const rodape = document.querySelector(".sheet-footer").getBoundingClientRect();
    const alturaDoDocumento = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight
    );
    return {
      semScrollGlobal: alturaDoDocumento <= window.innerHeight,
      resumoDentroDaViewport: resumo.top >= 0 && resumo.bottom <= window.innerHeight,
      painelAntesDoRodape: resumo.bottom <= rodape.top
    };
  });

  expect(composicao.semScrollGlobal).toBe(true);
  expect(composicao.resumoDentroDaViewport).toBe(true);
  expect(composicao.painelAntesDoRodape).toBe(true);
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
  await page.locator('[data-ability-action="decrease-uses"]').click();
  await expect(page.locator("#sheet-ability-details")).toContainText("0 / 3");
  await expect(page.locator('[data-ability-action="decrease-uses"]')).toBeDisabled();
  await expect(page.locator(".ability-detail__header .ability-state-badge")).toHaveText("Sem usos");

  await page.locator('#sheet-ability-list [data-ability-id="ability-cooldown"]').click();
  await expect(page.locator("#sheet-ability-details")).toContainText("2 / 3 rodadas");
  await page.locator('[data-ability-action="decrease-cooldown"]').click();
  await page.locator('[data-ability-action="decrease-cooldown"]').click();
  await expect(page.locator("#sheet-ability-details")).toContainText("0 / 3 rodadas");
  await expect(page.locator('[data-ability-action="decrease-cooldown"]')).toBeDisabled();
  await expect(page.locator(".ability-detail__header .ability-state-badge")).toHaveText("Disponível");
});

test("mantém os resumos calculados sobre a coleção completa durante filtros", async function ({ page }) {
  await page.locator("#sheet-ability-state-filter").selectOption("passiva");
  await expect(page.locator(".ability-list-card")).toHaveCount(1);
  await expect(page.locator("#sheet-ability-stats")).toContainText("Total de habilidades");
  await expect(page.locator("#sheet-ability-stats")).toContainText("4");
  await expect(page.locator("#sheet-ability-stats")).toContainText("2 / 5");
});

test("preserva importação, normalização, duplicidade, ícone e remoção", async function ({ page }) {
  const importedAbility = {
    schemaVersion: 1,
    ability: {
      name: "Vórtice de Teste",
      type: "reaction",
      iconId: "icone-inexistente",
      description: "Habilidade usada para caracterizar o fluxo de importação.",
      attribute: "Agilidade",
      action: "Reação",
      manaCost: -4,
      peCost: "2",
      uses: { current: 99, max: 3, recharge: "Descanso curto" },
      cooldown: { value: 4, remaining: -2, unit: "turnos" }
    }
  };
  const file = {
    name: "vortice-de-teste.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(importedAbility))
  };

  await page.setInputFiles("#sheet-ability-file", file);
  await expect(page.locator("#ability-import-dialog")).toBeVisible();
  await expect(page.locator("#ability-import-preview")).toContainText("Vórtice de Teste");
  await page.locator('input[name="ability-icon"][value="energia"]').check();
  await page.locator("#ability-import-confirm").click();

  await expect(page.locator("#sheet-ability-list-count")).toHaveText("5");
  await expect(page.locator("#sheet-ability-details")).toContainText("Vórtice de Teste");
  await expect(page.locator("#sheet-ability-details")).toContainText("3 / 3");
  await expect(page.locator("#sheet-ability-details")).toContainText("0 / 4 turnos");
  await expect(page.locator("#sheet-ability-details .ability-detail__icon use")).toHaveAttribute("href", "#sheet-icon-bolt");

  await page.setInputFiles("#sheet-ability-file", file);
  await expect(page.locator("#ability-duplicate-warning")).toBeVisible();
  await expect(page.locator("#ability-import-confirm")).toHaveText("Importar mesmo assim");
  await page.locator("#ability-import-confirm").click();
  await expect(page.locator("#sheet-ability-list-count")).toHaveText("6");

  await page.locator(".ability-detail__actions summary").click();
  await page.locator('[data-ability-action="change-icon"]').click();
  await page.locator('input[name="ability-icon"][value="escudo"]').check();
  await page.locator("#ability-import-confirm").click();
  await expect(page.locator("#sheet-ability-details .ability-detail__icon use")).toHaveAttribute("href", "#sheet-icon-shield");

  await page.locator(".ability-detail__actions summary").click();
  await page.locator('[data-ability-action="remove"]').click();
  await expect(page.locator("#ability-remove-dialog")).toBeVisible();
  await page.locator("#ability-remove-confirm").click();
  await expect(page.locator("#sheet-ability-list-count")).toHaveText("5");
});

test("rejeita JSON inválido sem alterar a coleção", async function ({ page }) {
  await page.setInputFiles("#sheet-ability-file", {
    name: "habilidade-invalida.json",
    mimeType: "application/json",
    buffer: Buffer.from("{isto não é json}")
  });

  await expect(page.locator("#sheet-save-status")).toContainText("não contém um JSON válido");
  await expect(page.locator("#sheet-ability-list-count")).toHaveText("4");
  await expect(page.locator("#ability-import-dialog")).not.toBeVisible();
});
