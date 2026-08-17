import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { completeCharacterFixture, openSheetSection, preparePage } from "../helpers/app.js";

const viewports = [
  { name: "desktop-wide", width: 1440, height: 900 },
  { name: "desktop-low", width: 1280, height: 720 },
  { name: "tablet-rail", width: 1024, height: 768 },
  { name: "tablet-portrait", width: 768, height: 1024 },
  { name: "mobile", width: 390, height: 844 }
];

async function importCharacterWithJournal(page) {
  const envelope = JSON.parse(await readFile(completeCharacterFixture, "utf8"));
  envelope.personagem.registros = [
    {
      id: "porta-torre",
      tipo: "descoberta",
      titulo: "A porta sob a torre",
      conteudo: "Encontramos inscrições antigas sob a torre do relógio. O selo menciona uma passagem que só se abre quando a lua toca o horizonte.\n\nMaelis acredita que a chave esteja no antigo observatório.",
      data: "12º dia da Névoa",
      sessao: "Sessão 4",
      marcadores: ["torre", "mistério"],
      fixado: true,
      criadoEm: "2026-08-10T10:00:00.000Z",
      atualizadoEm: "2026-08-12T10:00:00.000Z"
    },
    {
      id: "acordo-quebrado",
      tipo: "sessao",
      titulo: "O acordo quebrado",
      conteudo: "A guarda recusou nossa proposta e fechou os portões antes do anoitecer.",
      data: "11º dia da Névoa",
      sessao: "Sessão 3",
      marcadores: ["guarda"],
      fixado: false,
      criadoEm: "2026-08-09T10:00:00.000Z",
      atualizadoEm: "2026-08-11T10:00:00.000Z"
    },
    {
      id: "promessa-maelis",
      tipo: "pendencia",
      titulo: "Cumprir a promessa feita a Maelis",
      conteudo: "Voltar ao Porto de Vidro com notícias sobre o mapa.",
      data: "",
      sessao: "",
      marcadores: ["Maelis", "porto"],
      fixado: false,
      criadoEm: "2026-08-08T10:00:00.000Z",
      atualizadoEm: "2026-08-10T10:00:00.000Z"
    }
  ];
  await page.setInputFiles("#json-file", {
    name: "ficha-registro-visual.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(envelope))
  });
}

for (const viewport of viewports) {
  test(`registra baseline do Registro em ${viewport.name}`, async function ({ page }) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await preparePage(page);
    await importCharacterWithJournal(page);
    await openSheetSection(page, "journal");
    await expect(page).toHaveScreenshot(`${viewport.name}-journal.png`, { fullPage: true });
  });
}
