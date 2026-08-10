import assert from "node:assert/strict";
import test from "node:test";

await import("../../js/domain/inventory.js");
const inventory = globalThis.GrimorioInventoryDomain;

function createItem(overrides = {}) {
  return {
    id: overrides.id || "item-a",
    item: {
      nome: overrides.nome || "Objeto de teste",
      tipo: "outro",
      raridade: "comum",
      descricao: "",
      peso: 1,
      tamanho: overrides.tamanho || { largura: 2, altura: 3 },
      quantidade: 1,
      imagem: "",
      atributoPrincipal: null,
      propriedades: [],
      equipavelEm: "",
      empilhavel: false,
      limiteEmpilhamento: 1
    },
    posicao: overrides.posicao || { x: 0, y: 0 },
    rotacao: overrides.rotacao || 0
  };
}

test("preserva as dimensões efetivas nas rotações suportadas", function () {
  const item = createItem();
  assert.deepEqual(inventory.getEffectiveDimensions(item, 0), { largura: 2, altura: 3 });
  assert.deepEqual(inventory.getEffectiveDimensions(item, 90), { largura: 3, altura: 2 });
});

test("recusa uma posição que colide com outro item", function () {
  const placed = createItem({ id: "placed", tamanho: { largura: 2, altura: 2 } });
  const candidate = createItem({ id: "candidate", tamanho: { largura: 1, altura: 1 } });
  const result = inventory.canPlaceItem([placed], candidate, { x: 1, y: 1 });
  assert.equal(result.valid, false);
  assert.equal(result.code, "invalid-position");
  assert.equal(result.detail, "collision");
});

test("migra inventário v2 preservando IDs e posições válidas", function () {
  const item = createItem({ id: "stable-id", posicao: { x: 2, y: 1 } });
  const migrated = inventory.migrateInventory([item], 2);
  assert.equal(migrated[0].id, "stable-id");
  assert.deepEqual(migrated[0].posicao, { x: 2, y: 1 });
});
