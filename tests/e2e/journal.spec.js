import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";
import {
  completeCharacterFixture,
  importCompleteCharacter,
  openSheetSection,
  preparePage
} from "../helpers/app.js";

async function importJournal(page, entries) {
  const envelope = JSON.parse(await readFile(completeCharacterFixture, "utf8"));
  envelope.personagem.registros = entries;
  await page.setInputFiles("#json-file", {
    name: "ficha-com-registro.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(envelope))
  });
}

test.beforeEach(async function ({ page }) {
  await preparePage(page);
});

test("promove Registro para view funcional e apresenta estado vazio acessível", async function ({ page }) {
  await importCompleteCharacter(page);
  const nav = page.locator('[data-sheet-section="journal"]');
  await expect(nav).not.toHaveAttribute("data-sheet-future");
  await expect(nav).not.toHaveAttribute("aria-disabled");

  await openSheetSection(page, "journal");
  await expect(page.locator("#sheet-journal-view-heading")).toBeFocused();
  await expect(page.locator("#journal-empty")).toContainText("A jornada ainda não foi registrada");
  await expect(page.locator("#journal-count")).toHaveText("0 registros");
  await expect(page.locator("#journal-create")).toBeVisible();
  await expect(page.locator("#journal-live-status")).toHaveAttribute("aria-live", "polite");
});

for (const viewport of [
  { name: "desktop", width: 1440, height: 900, columns: 2 },
  { name: "tablet-rail", width: 1024, height: 768, columns: 2 },
  { name: "mobile", width: 390, height: 844, columns: 1 }
]) {
  test(`mantém composição responsiva sem overflow em ${viewport.name}`, async function ({ page }) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await importJournal(page, [{
      id: "registro-layout",
      tipo: "nota",
      titulo: "A porta sob a torre",
      conteudo: "Um relato breve.",
      data: "12º dia da Névoa",
      sessao: "Sessão 4",
      marcadores: [],
      fixado: false,
      criadoEm: "2026-08-10T10:00:00.000Z",
      atualizadoEm: "2026-08-11T10:00:00.000Z"
    }]);
    await openSheetSection(page, "journal");

    const layout = await page.locator(".journal-workspace").evaluate(function (element) {
      const style = getComputedStyle(element);
      return {
        columns: style.display === "flex" && style.flexDirection === "column"
          ? 1
          : style.gridTemplateColumns.split(" ").length,
        pageOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        timelineWidth: element.querySelector(".journal-timeline")?.getBoundingClientRect().width || 0
      };
    });
    expect(layout.columns).toBe(viewport.columns);
    expect(layout.pageOverflow).toBe(0);
    if (viewport.width >= 1100) expect(layout.timelineWidth).toBeGreaterThanOrEqual(280);
    if (viewport.width >= 900 && viewport.width < 1100) {
      expect(layout.timelineWidth).toBeGreaterThanOrEqual(240);
      expect(layout.timelineWidth).toBeLessThanOrEqual(280);
    }
    if (viewport.width < 900) {
      const mobileChrome = await page.evaluate(function () {
        const navigationButtons = [...document.querySelectorAll(".sheet-navigation .sheet-sidebar__nav > button, .sheet-navigation .sheet-sidebar__group--primary > button")]
          .filter(function (button) { return getComputedStyle(button).display !== "none"; });
        const tops = new Set(navigationButtons.map(function (button) {
          return Math.round(button.getBoundingClientRect().top);
        }));
        return {
          navigationRows: tops.size,
          typeFilterWidth: document.querySelector("#journal-type-filter").getBoundingClientRect().width,
          pinnedVisible: document.querySelector("#journal-pinned-only").getBoundingClientRect().width > 0
        };
      });
      expect(mobileChrome.navigationRows).toBe(1);
      expect(mobileChrome.typeFilterWidth).toBeGreaterThanOrEqual(120);
      expect(mobileChrome.pinnedVisible).toBe(true);
    }
  });
}

test("captura uma nota rápida e seleciona o novo registro", async function ({ page }) {
  await importCompleteCharacter(page);
  await openSheetSection(page, "journal");

  await page.locator("#journal-quick-title").fill("Rascunho descartado");
  await page.locator("#journal-quick-content").fill("Não deve persistir.");
  await page.locator("#journal-quick-cancel").click();
  await expect(page.locator("#journal-quick-expanded")).toBeHidden();
  await expect(page.locator("#journal-quick-title")).toHaveValue("");
  await expect(page.locator("#journal-quick-title")).toBeFocused();

  await page.locator("#journal-quick-title").fill("A porta sob a torre");
  await expect(page.locator("#journal-quick-content")).toBeVisible();
  await page.locator("#journal-quick-content").fill("Encontramos inscrições antigas.");
  await page.locator("#journal-quick-save").click();

  const card = page.locator("[data-journal-entry-id]").filter({ hasText: "A porta sob a torre" });
  await expect(card).toHaveCount(1);
  await expect(card).toHaveAttribute("aria-current", "true");
  await expect(page.locator("#journal-reader-title")).toHaveText("A porta sob a torre");
  await expect(page.locator("#journal-reader-title")).toBeFocused();
  await expect(page.locator("#journal-live-status")).toHaveText("Registro adicionado à jornada.");
  await expect(page.locator("#sheet-save-state")).toContainText(/alterações não salvas/i);
});

test("cria, edita, fixa e exclui um registro com drafts canceláveis", async function ({ page }) {
  await importCompleteCharacter(page);
  await openSheetSection(page, "journal");
  await page.locator("#journal-create").click();
  await expect(page.locator("#journal-editor-dialog")).toBeVisible();
  await expect(page.locator("#journal-editor-title")).toBeFocused();

  await page.locator("#journal-editor-type").selectOption("descoberta");
  await page.locator("#journal-editor-title").fill("Mapa das marés");
  await page.locator("#journal-editor-content").fill("O mapa aponta para o litoral norte.");
  await page.locator("#journal-editor-session").fill("Sessão 5");
  await page.locator("#journal-editor-date").fill("13º dia da Névoa");
  await page.locator("#journal-editor-tags").fill("mapa, litoral");
  await page.locator("#journal-editor-pinned").check();
  await page.locator("#journal-editor-save").click();

  await expect(page.locator("#journal-reader-title")).toHaveText("Mapa das marés");
  await expect(page.locator("#journal-reader-pinned")).toContainText("Fixado");
  await expect(page.locator("#journal-reader-tags")).toContainText("litoral");

  await page.locator("#journal-reader-edit").click();
  await page.locator("#journal-editor-title").fill("Mapa das correntes");
  await page.locator("#journal-editor-cancel").click();
  await expect(page.locator("#journal-discard-confirm")).toBeVisible();
  await page.locator("#journal-discard-keep").click();
  await expect(page.locator("#journal-editor-dialog")).toBeVisible();
  await page.locator("#journal-editor-title").fill("Mapa das correntes");
  await page.locator("#journal-editor-save").click();
  await expect(page.locator("#journal-reader-title")).toHaveText("Mapa das correntes");

  await page.locator("#journal-reader-delete").click();
  await expect(page.locator("#journal-delete-description")).toContainText("Mapa das correntes");
  await page.locator("#journal-delete-confirm").click();
  await expect(page.locator("[data-journal-entry-id]")).toHaveCount(0);
  await expect(page.locator("#journal-empty")).toBeVisible();
  await expect(page.locator("#journal-create")).toBeFocused();
});

test("busca e combina filtros sem alterar a coleção", async function ({ page }) {
  await importJournal(page, [
    {
      id: "arcana",
      tipo: "descoberta",
      titulo: "Câmara Arcana",
      conteudo: "Runas antigas.",
      data: "",
      sessao: "Sessão 4",
      marcadores: ["Mistério"],
      fixado: true,
      criadoEm: "2026-08-10T10:00:00.000Z",
      atualizadoEm: "2026-08-12T10:00:00.000Z"
    },
    {
      id: "mercado",
      tipo: "nota",
      titulo: "Mercado",
      conteudo: "Comprar corda.",
      data: "",
      sessao: "",
      marcadores: [],
      fixado: false,
      criadoEm: "2026-08-10T10:00:00.000Z",
      atualizadoEm: "2026-08-11T10:00:00.000Z"
    }
  ]);
  await openSheetSection(page, "journal");

  await page.locator("#journal-search").fill("camara misterio");
  await page.locator("#journal-type-filter").selectOption("descoberta");
  await page.locator("#journal-pinned-only").check();
  await expect(page.locator("[data-journal-entry-id]")).toHaveCount(1);
  await expect(page.locator("#journal-results-status")).toHaveText("1 registro encontrado");

  await page.locator("#journal-search").fill("inexistente");
  await expect(page.locator("#journal-no-results")).toBeVisible();
  await page.locator("#journal-clear-filters").click();
  await expect(page.locator("[data-journal-entry-id]")).toHaveCount(2);
  await expect(page.locator("#journal-count")).toHaveText("2 registros");
});

test("mantém último registro e ações do editor acima da navegação móvel", async function ({ page }) {
  await page.setViewportSize({ width: 390, height: 844 });
  await importJournal(page, Array.from({ length: 8 }, function (_, index) {
    return {
      id: "registro-" + index,
      tipo: "nota",
      titulo: "Registro " + (index + 1),
      conteudo: "Conteúdo da jornada " + (index + 1),
      data: "",
      sessao: index < 4 ? "Sessão 2" : "Sessão 1",
      marcadores: [],
      fixado: false,
      criadoEm: `2026-08-${String(index + 1).padStart(2, "0")}T10:00:00.000Z`,
      atualizadoEm: `2026-08-${String(index + 1).padStart(2, "0")}T10:00:00.000Z`
    };
  }));
  await openSheetSection(page, "journal");

  const lastCard = page.locator("[data-journal-entry-id]").last();
  await lastCard.scrollIntoViewIfNeeded();
  await expect(lastCard).toBeVisible();
  const cardIsClear = await page.evaluate(function () {
    const card = [...document.querySelectorAll("[data-journal-entry-id]")].at(-1).getBoundingClientRect();
    const navigation = document.querySelector(".sheet-navigation").getBoundingClientRect();
    return card.bottom <= navigation.top;
  });
  expect(cardIsClear).toBe(true);

  await page.locator("#journal-create").click();
  const footerIsClear = await page.evaluate(function () {
    const footer = document.querySelector("#journal-editor-dialog .journal-dialog__actions").getBoundingClientRect();
    return footer.bottom <= window.innerHeight && footer.top >= 0;
  });
  expect(footerIsClear).toBe(true);
});

test("oferece atalhos, validação acessível e reduced motion", async function ({ page }) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await importCompleteCharacter(page);
  await openSheetSection(page, "journal");

  await page.keyboard.press("/");
  await expect(page.locator("#journal-search")).toBeFocused();
  await page.locator("#journal-create").click();
  await page.locator("#journal-editor-save").click();
  await expect(page.locator("#journal-editor-title")).toHaveAttribute("aria-invalid", "true");
  await expect(page.locator("#journal-editor-title-error")).not.toBeEmpty();
  await expect(page.locator("#journal-editor-title")).toBeFocused();

  await page.locator("#journal-editor-title").fill("Teste de movimento");
  await page.locator("#journal-editor-save").click();
  const animationName = await page.locator("#journal-reader").evaluate(function (element) {
    return getComputedStyle(element).animationName;
  });
  expect(animationName).toBe("none");
});

test("mantém alvos principais com pelo menos 44 pixels", async function ({ page }) {
  await page.setViewportSize({ width: 390, height: 844 });
  await importJournal(page, [{
    id: "touch",
    tipo: "nota",
    titulo: "Alvos de toque",
    conteudo: "Teste",
    data: "",
    sessao: "",
    marcadores: [],
    fixado: false,
    criadoEm: "2026-08-10T10:00:00.000Z",
    atualizadoEm: "2026-08-10T10:00:00.000Z"
  }]);
  await openSheetSection(page, "journal");

  for (const selector of [
    "#journal-create",
    "#journal-quick-title",
    "#journal-search",
    "#journal-type-filter",
    "#journal-reader-pin",
    "#journal-reader-edit",
    "#journal-reader-delete"
  ]) {
    const height = await page.locator(selector).evaluate(function (element) {
      return element.getBoundingClientRect().height;
    });
    expect(height, selector).toBeGreaterThanOrEqual(43.99);
  }
});
