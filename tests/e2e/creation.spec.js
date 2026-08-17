import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";
import {
  completeCharacterFixture,
  importCompleteCharacter,
  preparePage
} from "../helpers/app.js";

const portraitPng = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
  "base64"
);

async function readCompleteCharacter() {
  return JSON.parse(await readFile(completeCharacterFixture, "utf8"));
}

async function importCharacterData(page, data, name = "character.json") {
  await page.setInputFiles("#json-file", {
    name,
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(data))
  });
}

async function exportCurrentCharacter(page) {
  const downloadPromise = page.waitForEvent("download");
  await page.locator("#sheet-export-json").click();
  const download = await downloadPromise;
  const stream = await download.createReadStream();
  let json = "";
  for await (const chunk of stream) json += chunk.toString("utf8");
  return JSON.parse(json);
}

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
  await page.locator("#origin-story-open").click();
  await page.locator("#origin-story").fill("Lyra atravessou as ruÃ­nas costeiras em busca de um mapa perdido.");
  await page.locator("#origin-story-save").click();
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
  expect(envelope.personagem.vinculos).toEqual([]);
  expect(envelope.personagem.registros).toEqual([]);
  expect(envelope.personagem.origem).not.toHaveProperty("vinculos");

  await page.locator("#review-open-sheet").click();
  await expect(page.locator("#character-sheet-screen")).toBeVisible();
  await expect(page.locator("#sheet-character-name")).toHaveText("Lyra do Meridiano");
  await expect(page.locator("#sheet-portrait-image")).toBeVisible();
});

test("preserva personagem em round-trip de exportacao e reimportacao", async function ({ page }) {
  const importedEnvelope = await readCompleteCharacter();
  importedEnvelope.personagem.vinculos = [
    {
      id: "aliada-01",
      tipo: "pessoa",
      nome: "  Maelis  ",
      subtitulo: "Aliada",
      descricao: "Conheceu Ariadne nas ruínas.",
      imagem: "assets/vinculos/maelis.webp"
    },
    {
      id: "porto-01",
      tipo: "lugar",
      nome: "Porto de Vidro",
      subtitulo: "",
      descricao: "Um refúgio costeiro.",
      imagem: ""
    }
  ];
  importedEnvelope.personagem.origem.vinculos = [{ nome: "não deve persistir" }];
  importedEnvelope.personagem.registros = [
    {
      id: "registro-01",
      tipo: "descoberta",
      titulo: "  A porta sob a torre  ",
      conteudo: "Encontramos inscrições antigas.",
      data: "12º dia da Névoa",
      sessao: "Sessão 4",
      marcadores: ["torre", "mistério"],
      fixado: true,
      criadoEm: "2026-08-10T10:00:00.000Z",
      atualizadoEm: "2026-08-11T10:00:00.000Z"
    }
  ];
  await importCharacterData(page, importedEnvelope, "round-trip-com-vinculos.json");
  await expect(page.locator("#character-sheet-screen")).toBeVisible();

  const firstEnvelope = await exportCurrentCharacter(page);
  expect(firstEnvelope.tipo).toBe("grimorio-ficha");
  expect(firstEnvelope.versao).toBe(2);
  expect(firstEnvelope.personagem.vinculos).toHaveLength(2);
  expect(firstEnvelope.personagem.vinculos[0]).toMatchObject({
    id: "aliada-01",
    nome: "Maelis"
  });
  expect(firstEnvelope.personagem.registros).toEqual([
    expect.objectContaining({
      id: "registro-01",
      tipo: "descoberta",
      titulo: "A porta sob a torre",
      fixado: true
    })
  ]);
  expect(firstEnvelope.personagem.origem).not.toHaveProperty("vinculos");

  await importCharacterData(page, firstEnvelope, "round-trip.json");
  const secondEnvelope = await exportCurrentCharacter(page);

  expect(secondEnvelope.personagem).toEqual(firstEnvelope.personagem);
});

test("normaliza vínculos legados e IDs duplicados ao importar", async function ({ page }) {
  const legacyEnvelope = await readCompleteCharacter();
  await importCharacterData(page, legacyEnvelope, "ficha-legada.json");
  let exportedEnvelope = await exportCurrentCharacter(page);
  expect(exportedEnvelope.personagem.vinculos).toEqual([]);

  const duplicateIdsEnvelope = await readCompleteCharacter();
  duplicateIdsEnvelope.personagem.vinculos = [
    { id: "repetido", tipo: "pessoa", nome: "Primeiro" },
    { id: "repetido", tipo: "evento", nome: "Segundo" }
  ];
  await importCharacterData(page, duplicateIdsEnvelope, "vinculos-duplicados.json");
  exportedEnvelope = await exportCurrentCharacter(page);

  const ids = exportedEnvelope.personagem.vinculos.map((vinculo) => vinculo.id);
  expect(ids[0]).toBe("repetido");
  expect(new Set(ids).size).toBe(2);
  expect(exportedEnvelope.personagem.vinculos.map((vinculo) => vinculo.nome)).toEqual([
    "Primeiro",
    "Segundo"
  ]);
});

test("rejeita vínculos inválidos sem substituir a ficha atual", async function ({ page }) {
  await importCompleteCharacter(page);
  const currentEnvelope = await exportCurrentCharacter(page);

  const nonArrayEnvelope = await readCompleteCharacter();
  nonArrayEnvelope.personagem.nome = "Ficha invasora";
  nonArrayEnvelope.personagem.vinculos = { nome: "formato incorreto" };
  await importCharacterData(page, nonArrayEnvelope, "vinculos-nao-lista.json");
  await expect(page.locator("#file-status")).toContainText(/vínculos deve ser uma lista/i);
  await expect(page.locator("#sheet-character-name")).toHaveText("Ariadne Vesper");
  expect((await exportCurrentCharacter(page)).personagem).toEqual(currentEnvelope.personagem);

  const missingNameEnvelope = await readCompleteCharacter();
  missingNameEnvelope.personagem.nome = "Outra ficha invasora";
  missingNameEnvelope.personagem.vinculos = [{ id: "sem-nome", tipo: "pessoa" }];
  await importCharacterData(page, missingNameEnvelope, "vinculo-sem-nome.json");
  await expect(page.locator("#file-status")).toContainText(/campo nome é obrigatório/i);
  await expect(page.locator("#sheet-character-name")).toHaveText("Ariadne Vesper");
  expect((await exportCurrentCharacter(page)).personagem).toEqual(currentEnvelope.personagem);
});
