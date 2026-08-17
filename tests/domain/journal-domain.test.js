import assert from "node:assert/strict";
import test from "node:test";

await import("../../js/domain/journal.js");
const journal = globalThis.GrimorioJournalDomain;

function idFactory(...ids) {
  return function createId() { return ids.shift(); };
}

test("expõe limites e tipos canônicos em um namespace congelado", function () {
  assert.equal(Object.isFrozen(journal), true);
  assert.deepEqual(journal.LIMITES, {
    id: 120,
    titulo: 120,
    conteudo: 20000,
    data: 100,
    sessao: 100,
    marcador: 30,
    marcadores: 10
  });
  assert.deepEqual(journal.TIPOS, ["sessao", "descoberta", "pendencia", "nota"]);
});

test("normaliza uma entrada usando nota e timestamps atuais como defaults", function () {
  const result = journal.normalizarRegistro({
    titulo: "  A porta sob a torre  ",
    conteudo: "  Encontramos inscrições.  ",
    marcadores: ["  Torre ", "mistério", "torre"],
    propriedadeExtra: true
  }, {
    criarId: function () { return "registro-1"; },
    agora: function () { return "2026-08-17T18:30:00.000Z"; }
  });

  assert.deepEqual(result, {
    id: "registro-1",
    tipo: "nota",
    titulo: "A porta sob a torre",
    conteudo: "Encontramos inscrições.",
    data: "",
    sessao: "",
    marcadores: ["Torre", "mistério"],
    fixado: false,
    criadoEm: "2026-08-17T18:30:00.000Z",
    atualizadoEm: "2026-08-17T18:30:00.000Z"
  });
});

test("valida tipos, campos textuais, marcadores e timestamps", function () {
  assert.throws(function () { journal.normalizarRegistro({ titulo: " " }); }, /título.*obrigatório/i);
  assert.throws(function () {
    journal.normalizarRegistro({ titulo: "x".repeat(121) });
  }, /título.*120/i);
  assert.throws(function () {
    journal.normalizarRegistro({ titulo: "Ok", conteudo: "x".repeat(20001) });
  }, /relato.*20000/i);
  assert.throws(function () {
    journal.normalizarRegistro({ titulo: "Ok", tipo: "combate" });
  }, /sessao.*descoberta.*pendencia.*nota/i);
  assert.throws(function () {
    journal.normalizarRegistro({ titulo: "Ok", marcadores: "pista" });
  }, /marcadores.*lista/i);
  assert.throws(function () {
    journal.normalizarRegistro({ titulo: "Ok", marcadores: Array.from({ length: 11 }, (_, i) => "m" + i) });
  }, /10 marcadores/i);
  assert.throws(function () {
    journal.normalizarRegistro({ titulo: "Ok", marcadores: ["x".repeat(31)] });
  }, /marcador.*30/i);
  assert.throws(function () {
    journal.normalizarRegistro({ titulo: "Ok", criadoEm: "ontem" });
  }, /criação.*ISO/i);
});

test("preserva IDs e criação válidos na coleção e regenera ausentes ou duplicados", function () {
  const result = journal.normalizarColecaoRegistros([
    {
      id: "registro-estavel",
      titulo: "Primeiro",
      criadoEm: "2026-08-10T10:00:00.000Z",
      atualizadoEm: "2026-08-11T10:00:00.000Z"
    },
    { id: "registro-estavel", titulo: "Duplicado" },
    { titulo: "Sem ID" }
  ], {
    criarId: idFactory("registro-2", "registro-3"),
    agora: function () { return "2026-08-17T18:30:00.000Z"; }
  });

  assert.deepEqual(result.map(function (entry) { return entry.id; }), [
    "registro-estavel",
    "registro-2",
    "registro-3"
  ]);
  assert.equal(result[0].criadoEm, "2026-08-10T10:00:00.000Z");
  assert.equal(result[0].atualizadoEm, "2026-08-11T10:00:00.000Z");
});

test("aceita coleção ausente e rejeita coleção presente inválida", function () {
  assert.deepEqual(journal.normalizarColecaoRegistros(undefined), []);
  assert.throws(function () { journal.normalizarColecaoRegistros({}); }, /coleção.*lista/i);
});

test("ordena fixados primeiro e depois por atualização decrescente sem mutar a entrada", function () {
  const entries = [
    { id: "a", fixado: false, atualizadoEm: "2026-08-17T10:00:00.000Z" },
    { id: "b", fixado: true, atualizadoEm: "2026-08-15T10:00:00.000Z" },
    { id: "c", fixado: true, atualizadoEm: "2026-08-16T10:00:00.000Z" },
    { id: "d", fixado: false, atualizadoEm: "2026-08-18T10:00:00.000Z" }
  ];

  const result = journal.ordenarRegistros(entries);
  assert.deepEqual(result.map(function (entry) { return entry.id; }), ["c", "b", "d", "a"]);
  assert.deepEqual(entries.map(function (entry) { return entry.id; }), ["a", "b", "c", "d"]);
});

test("busca sem diferenciar acentos e caixa e combina tipo e fixados", function () {
  const entries = [
    { id: "a", tipo: "descoberta", titulo: "Câmara Arcana", conteudo: "Runas", sessao: "Sessão 4", marcadores: ["Mistério"], fixado: true },
    { id: "b", tipo: "nota", titulo: "Mercado", conteudo: "Comprar corda", sessao: "Sessão 4", marcadores: [], fixado: false },
    { id: "c", tipo: "descoberta", titulo: "Bosque", conteudo: "Pegadas", sessao: "Sessão 3", marcadores: [], fixado: true }
  ];

  const result = journal.filtrarRegistros(entries, {
    query: "camara misterio",
    tipo: "descoberta",
    somenteFixados: true
  });
  assert.deepEqual(result.map(function (entry) { return entry.id; }), ["a"]);
});

test("agrupa sessões informadas e mantém notas avulsas em grupo próprio", function () {
  const groups = journal.agruparRegistros([
    { id: "a", sessao: "Sessão 4" },
    { id: "b", sessao: "" },
    { id: "c", sessao: "Sessão 4" },
    { id: "d", sessao: "Sessão 3" }
  ]);

  assert.deepEqual(groups.map(function (group) {
    return [group.rotulo, group.registros.map(function (entry) { return entry.id; })];
  }), [
    ["Sessão 4", ["a", "c"]],
    ["Notas avulsas", ["b"]],
    ["Sessão 3", ["d"]]
  ]);
});
