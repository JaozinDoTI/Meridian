import assert from "node:assert/strict";
import test from "node:test";

await import("../../js/domain/abilities.js");
const abilities = globalThis.GrimorioAbilitiesDomain;

test("normaliza aliases, custos, usos, recarga e icone sem alterar o schema", function () {
  const result = abilities.normalizarHabilidade({
    id: "ability-1",
    name: "  Passo Astral  ",
    type: "reaction",
    iconId: "movimento",
    manaCost: -3,
    peCost: 2,
    uses: { current: 8, max: 3, recharge: "descanso" },
    cooldown: { value: 4, remaining: 9, unit: "rodadas" },
    effects: [" Teleporte ", ""],
    requirements: "inválido"
  }, {
    catalogoIcones: [{ id: "habilidade-generica" }, { id: "movimento" }]
  });

  assert.deepEqual(result, {
    id: "ability-1",
    nome: "Passo Astral",
    tipo: "reacao",
    iconeId: "movimento",
    descricao: "",
    atributo: "",
    acao: "",
    custos: { mana: 0, pe: 2 },
    alcance: "",
    dano: "",
    duracao: "",
    usos: { atual: 3, maximo: 3, recuperacao: "descanso" },
    recarga: { valor: 4, unidade: "rodadas", restante: 4 },
    efeitos: ["Teleporte"],
    requisitos: [],
    limitacoes: [],
    observacoes: ""
  });
});

test("mantem a precedencia atual de situacao e o resumo operacional", function () {
  assert.equal(abilities.obterEstadoHabilidade({ tipo: "passiva" }), "passiva");
  assert.equal(abilities.obterEstadoHabilidade({
    tipo: "tecnica",
    usos: { atual: 0, maximo: 2 },
    recarga: { restante: 3 }
  }), "esgotada");
  assert.equal(abilities.obterEstadoHabilidade({
    tipo: "tecnica",
    usos: null,
    recarga: { restante: 3 }
  }), "recarga");
  assert.equal(abilities.obterResumoOperacionalHabilidade({
    tipo: "tecnica",
    usos: { atual: 1, maximo: 2 },
    recarga: { restante: 3, unidade: "rodadas" }
  }), "1/2 usos");
});
