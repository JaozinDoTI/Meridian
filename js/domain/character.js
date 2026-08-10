(function exposeGrimorioCharacterDomain(global) {
  "use strict";

  function normalizarAtributo(valor) {
    return String(valor || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/ç/g, "c")
      .replace(/[^a-z]/g, "");
  }

  function obterIdDoAtributo(valor, atributos) {
    const normalizado = normalizarAtributo(valor);
    const atributo = atributos.find(function (item) {
      return normalizarAtributo(item.nome) === normalizado
        || normalizarAtributo(item.sigla) === normalizado
        || item.id === normalizado;
    });

    return atributo ? atributo.id : null;
  }

  function criarModificadoresZerados(atributos) {
    return atributos.reduce(function (modificadores, atributo) {
      modificadores[atributo.id] = 0;
      return modificadores;
    }, {});
  }

  function aplicarModificador(modificadores, atributo, valor, atributos) {
    const id = obterIdDoAtributo(atributo, atributos);
    if (id) modificadores[id] += valor;
  }

  function calcularCustoTotalDoAtributo(valor, custosPorNivel) {
    let custo = 0;
    for (let nivel = 1; nivel <= valor; nivel += 1) {
      custo += custosPorNivel[nivel] || 0;
    }
    return custo;
  }

  function valorPossuiCustosConfigurados(valor, custosPorNivel) {
    for (let nivel = 1; nivel <= valor; nivel += 1) {
      if (!(nivel in custosPorNivel)) return false;
    }
    return true;
  }

  function obterCustoDoProximoNivel(valorAtual, custosPorNivel) {
    return custosPorNivel[valorAtual + 1] ?? Infinity;
  }

  function formatarModificador(valor) {
    if (valor > 0) return `+${valor}`;
    return String(valor);
  }

  global.GrimorioCharacterDomain = Object.freeze({
    normalizarAtributo,
    obterIdDoAtributo,
    criarModificadoresZerados,
    aplicarModificador,
    calcularCustoTotalDoAtributo,
    valorPossuiCustosConfigurados,
    obterCustoDoProximoNivel,
    formatarModificador
  });
})(typeof window === "undefined" ? globalThis : window);
