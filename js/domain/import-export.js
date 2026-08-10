(function exposeGrimorioImportExportDomain(global) {
  "use strict";

  function ehObjetoDeDados(valor) {
    return valor !== null && typeof valor === "object" && !Array.isArray(valor);
  }

  function criarNomeSeguroParaArquivo(nome) {
    return String(nome ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function criarEnvelopeDaFicha(personagem, opcoes = {}) {
    return {
      tipo: "grimorio-ficha",
      versao: 2,
      salvoEm: opcoes.salvoEm || new Date().toISOString(),
      personagem
    };
  }

  function obterPersonagemDoArquivo(dados) {
    if (!ehObjetoDeDados(dados)) {
      throw new Error("O arquivo JSON não contém uma ficha válida.");
    }

    if (Object.prototype.hasOwnProperty.call(dados, "tipo")) {
      if (dados.tipo !== "grimorio-ficha") {
        throw new Error("Este JSON não é uma ficha do Grimório RPG.");
      }

      const versao = dados.versao === undefined || dados.versao === null ? 1 : dados.versao;
      if (typeof versao === "number" && Number.isInteger(versao) && versao > 2) {
        throw new Error("Esta ficha foi criada em uma versão mais recente do Grimório RPG.");
      }
      if (typeof versao !== "number" || !Number.isInteger(versao) || (versao !== 1 && versao !== 2)) {
        throw new Error("A versão desta ficha não é compatível com o Grimório RPG.");
      }
      if (!ehObjetoDeDados(dados.personagem)) {
        throw new Error("O arquivo JSON não contém os dados da ficha.");
      }
      if (!ehObjetoDeDados(dados.personagem.atributos) || !ehObjetoDeDados(dados.personagem.pericias)) {
        throw new Error("O JSON não possui os dados necessários de uma ficha de personagem.");
      }
      return { personagem: dados.personagem, versao };
    }

    if (!ehObjetoDeDados(dados.atributos) || !ehObjetoDeDados(dados.pericias)) {
      throw new Error("O JSON não possui os dados necessários de uma ficha de personagem.");
    }
    return { personagem: dados, versao: 1 };
  }

  global.GrimorioImportExportDomain = Object.freeze({
    ehObjetoDeDados,
    criarNomeSeguroParaArquivo,
    criarEnvelopeDaFicha,
    obterPersonagemDoArquivo
  });
})(typeof window === "undefined" ? globalThis : window);
