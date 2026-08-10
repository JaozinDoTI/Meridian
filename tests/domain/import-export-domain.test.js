import assert from "node:assert/strict";
import test from "node:test";

await import("../../js/domain/import-export.js");
const transfer = globalThis.GrimorioImportExportDomain;

const character = { nome: "Ária do Norte", atributos: {}, pericias: {} };

test("cria envelope v2 e nome de arquivo deterministico", function () {
  const envelope = transfer.criarEnvelopeDaFicha(character, {
    salvoEm: "2026-08-10T12:00:00.000Z"
  });
  assert.deepEqual(envelope, {
    tipo: "grimorio-ficha",
    versao: 2,
    salvoEm: "2026-08-10T12:00:00.000Z",
    personagem: character
  });
  assert.equal(transfer.criarNomeSeguroParaArquivo("  Ária do Norte!  "), "aria-do-norte");
});

test("aceita envelopes v1/v2 e personagem legado sem envelope", function () {
  assert.deepEqual(transfer.obterPersonagemDoArquivo({
    tipo: "grimorio-ficha",
    versao: 2,
    personagem: character
  }), { personagem: character, versao: 2 });
  assert.deepEqual(transfer.obterPersonagemDoArquivo(character), {
    personagem: character,
    versao: 1
  });
});

test("rejeita tipo, versao futura e ficha sem contratos minimos", function () {
  assert.throws(() => transfer.obterPersonagemDoArquivo({ tipo: "outro" }), /não é uma ficha/i);
  assert.throws(() => transfer.obterPersonagemDoArquivo({
    tipo: "grimorio-ficha",
    versao: 3,
    personagem: character
  }), /versão mais recente/i);
  assert.throws(() => transfer.obterPersonagemDoArquivo({ nome: "Incompleta" }), /dados necessários/i);
});
