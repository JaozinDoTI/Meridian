import assert from "node:assert/strict";
import test from "node:test";

await import("../../js/domain/character.js");
const character = globalThis.GrimorioCharacterDomain;

const attributes = [
  { id: "forca", nome: "Força", sigla: "FOR" },
  { id: "agilidade", nome: "Agilidade", sigla: "AGI" },
  { id: "intelecto", nome: "Intelecto", sigla: "INT" },
  { id: "resistencia", nome: "Resistência", sigla: "RES" }
];

const costs = { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5 };

test("resolve atributos por nome, sigla ou id sem depender da interface", function () {
  assert.equal(character.obterIdDoAtributo("Força", attributes), "forca");
  assert.equal(character.obterIdDoAtributo("FOR", attributes), "forca");
  assert.equal(character.obterIdDoAtributo("forca", attributes), "forca");
  assert.equal(character.obterIdDoAtributo("desconhecido", attributes), null);

  const modifiers = character.criarModificadoresZerados(attributes);
  character.aplicarModificador(modifiers, "Resistência", -1, attributes);

  assert.deepEqual(modifiers, {
    forca: 0,
    agilidade: 0,
    intelecto: 0,
    resistencia: -1
  });
});

test("preserva a progressão cumulativa e os limites configurados", function () {
  assert.equal(character.calcularCustoTotalDoAtributo(1, costs), 1);
  assert.equal(character.calcularCustoTotalDoAtributo(2, costs), 3);
  assert.equal(character.calcularCustoTotalDoAtributo(3, costs), 6);
  assert.equal(character.valorPossuiCustosConfigurados(5, costs), true);
  assert.equal(character.valorPossuiCustosConfigurados(6, costs), false);
  assert.equal(character.obterCustoDoProximoNivel(4, costs), 5);
  assert.equal(character.obterCustoDoProximoNivel(5, costs), Infinity);
});

test("mantém a formatação pública dos modificadores", function () {
  assert.equal(character.formatarModificador(2), "+2");
  assert.equal(character.formatarModificador(0), "0");
  assert.equal(character.formatarModificador(-1), "-1");
});
