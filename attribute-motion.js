(function disponibilizarMotionDeAtributo(raiz, fabrica) {
  "use strict";

  const api = fabrica();

  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }

  if (raiz) {
    raiz.GrimorioAttributeMotion = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function criarMotionDeAtributo() {
  "use strict";

  const VISUAIS_POR_ATRIBUTO = Object.freeze({
    forca: "impact",
    agilidade: "trail",
    intelecto: "inscription",
    resistencia: "seal"
  });

  const ORIGENS_EM_ORDEM_DE_PRIORIDADE = ["distributed", "species", "temporary"];

  function normalizarNumero(valor) {
    try {
      const numero = Number(valor);
      return Number.isFinite(numero) ? numero : 0;
    } catch (erro) {
      return 0;
    }
  }

  function obterVisualDoAtributo(id) {
    return Object.prototype.hasOwnProperty.call(VISUAIS_POR_ATRIBUTO, id)
      ? VISUAIS_POR_ATRIBUTO[id]
      : null;
  }

  function criarSnapshotDoAtributo(values) {
    const valores = values && typeof values === "object" ? values : {};

    return {
      distributed: normalizarNumero(valores.distributed),
      species: normalizarNumero(valores.species),
      temporary: normalizarNumero(valores.temporary),
      total: normalizarNumero(valores.total)
    };
  }

  function compararSnapshotsDoAtributo(previous, current) {
    const anterior = criarSnapshotDoAtributo(previous);
    const atual = criarSnapshotDoAtributo(current);
    const origem = ORIGENS_EM_ORDEM_DE_PRIORIDADE.find(function (parcela) {
      return anterior[parcela] !== atual[parcela];
    }) || null;
    let direcao = null;

    if (atual.total > anterior.total) direcao = "up";
    if (atual.total < anterior.total) direcao = "down";

    return {
      changed: origem !== null || anterior.total !== atual.total,
      source: origem,
      direction: direcao
    };
  }

  function obterClassesDaMudanca(change) {
    if (!change || change.changed !== true) return [];

    const classes = ["is-attribute-changing"];
    if (change.direction === "up" || change.direction === "down") {
      classes.push("is-changing-" + change.direction);
    }
    if (ORIGENS_EM_ORDEM_DE_PRIORIDADE.includes(change.source)) {
      classes.push("is-source-" + change.source);
    }
    return classes;
  }

  return Object.freeze({
    obterVisualDoAtributo,
    criarSnapshotDoAtributo,
    compararSnapshotsDoAtributo,
    obterClassesDaMudanca
  });
});
