(function exposeGrimorioAbilitiesDomain(global) {
  "use strict";

  const tipos = new Set(["passiva", "tecnica", "reacao", "suprema", "outro"]);

  function ehObjetoDeDados(valor) {
    return valor !== null && typeof valor === "object" && !Array.isArray(valor);
  }

  function limitarValor(valor, minimo, maximo) {
    const numero = Number.parseInt(valor, 10);
    const normalizado = Number.isFinite(numero) ? numero : minimo;
    return Math.min(Math.max(normalizado, minimo), maximo);
  }

  function criarIdHabilidade() {
    if (global.crypto && typeof global.crypto.randomUUID === "function") {
      return global.crypto.randomUUID();
    }
    return `habilidade-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function normalizarTermoHabilidade(valor) {
    return String(valor ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim()
      .toLowerCase();
  }

  function normalizarTipoHabilidade(valor) {
    const aliases = {
      passive: "passiva",
      technique: "tecnica",
      reaction: "reacao",
      supreme: "suprema",
      other: "outro"
    };
    const termo = normalizarTermoHabilidade(valor);
    const tipo = aliases[termo] || termo;
    return tipos.has(tipo) ? tipo : "tecnica";
  }

  function normalizarListaHabilidade(valor) {
    return Array.isArray(valor)
      ? valor.map(function (item) { return String(item ?? "").trim(); }).filter(Boolean)
      : [];
  }

  function normalizarUsosDaHabilidade(usos) {
    if (!ehObjetoDeDados(usos)) return null;
    const maximo = Math.max(0, Number.parseInt(usos.maximo ?? usos.max, 10) || 0);
    return {
      atual: limitarValor(usos.atual ?? usos.current, 0, maximo),
      maximo,
      recuperacao: String(usos.recuperacao ?? usos.recharge ?? "").trim()
    };
  }

  function normalizarRecargaDaHabilidade(recarga) {
    if (!ehObjetoDeDados(recarga)) return null;
    const valor = Math.max(0, Number.parseInt(recarga.valor ?? recarga.value, 10) || 0);
    return {
      valor,
      unidade: String(recarga.unidade ?? recarga.unit ?? "rodadas").trim() || "rodadas",
      restante: limitarValor(recarga.restante ?? recarga.remaining, 0, valor)
    };
  }

  function normalizarHabilidade(habilidade, opcoes = {}) {
    const dados = ehObjetoDeDados(habilidade) ? habilidade : {};
    const custosOriginais = ehObjetoDeDados(dados.custos) ? dados.custos : {};
    const catalogoIcones = Array.isArray(opcoes.catalogoIcones) ? opcoes.catalogoIcones : [];
    const criarId = typeof opcoes.criarId === "function" ? opcoes.criarId : criarIdHabilidade;
    const iconeSolicitado = String(dados.iconeId ?? dados.iconId ?? "habilidade-generica").trim();
    const iconeExiste = catalogoIcones.some(function (icone) {
      return (typeof icone === "string" ? icone : icone?.id) === iconeSolicitado;
    });

    return {
      id: String(dados.id || criarId()),
      nome: String(dados.nome ?? dados.name ?? "Habilidade sem nome").trim() || "Habilidade sem nome",
      tipo: normalizarTipoHabilidade(dados.tipo ?? dados.type),
      iconeId: iconeExiste ? iconeSolicitado : "habilidade-generica",
      descricao: String(dados.descricao ?? dados.description ?? "").trim(),
      atributo: String(dados.atributo ?? dados.attribute ?? "").trim(),
      acao: String(dados.acao ?? dados.action ?? "").trim(),
      custos: {
        mana: Math.max(0, Number(custosOriginais.mana ?? dados.manaCost) || 0),
        pe: Math.max(0, Number(custosOriginais.pe ?? dados.peCost) || 0)
      },
      alcance: String(dados.alcance ?? dados.range?.label ?? "").trim(),
      dano: String(dados.dano ?? dados.damage ?? "").trim(),
      duracao: String(dados.duracao ?? dados.duration ?? "").trim(),
      usos: normalizarUsosDaHabilidade(dados.usos ?? dados.uses),
      recarga: normalizarRecargaDaHabilidade(dados.recarga ?? dados.cooldown),
      efeitos: normalizarListaHabilidade(dados.efeitos ?? dados.effects),
      requisitos: normalizarListaHabilidade(dados.requisitos ?? dados.requirements),
      limitacoes: normalizarListaHabilidade(dados.limitacoes ?? dados.limitations),
      observacoes: String(dados.observacoes ?? dados.notes ?? "").trim()
    };
  }

  function obterEstadoHabilidade(habilidade) {
    if (habilidade.tipo === "passiva") return "passiva";
    if (habilidade.usos && habilidade.usos.maximo > 0 && habilidade.usos.atual <= 0) return "esgotada";
    if (habilidade.recarga && habilidade.recarga.restante > 0) return "recarga";
    return "disponivel";
  }

  function obterRotuloTipoHabilidade(tipo) {
    return {
      passiva: "Passiva",
      tecnica: "Técnica",
      reacao: "Reação",
      suprema: "Suprema",
      outro: "Outro"
    }[tipo] || "Técnica";
  }

  function obterRotuloEstadoHabilidade(estado) {
    return {
      passiva: "Passiva",
      esgotada: "Sem usos",
      recarga: "Em recarga",
      disponivel: "Disponível"
    }[estado] || "Disponível";
  }

  function obterResumoOperacionalHabilidade(habilidade) {
    if (habilidade.tipo === "passiva") return "Sempre ativa";
    if (habilidade.usos) return `${habilidade.usos.atual}/${habilidade.usos.maximo} usos`;
    if (habilidade.recarga?.restante > 0) {
      return `${habilidade.recarga.restante} ${habilidade.recarga.unidade}`;
    }
    return "Disponível";
  }

  global.GrimorioAbilitiesDomain = Object.freeze({
    ehObjetoDeDados,
    limitarValor,
    criarIdHabilidade,
    normalizarTermoHabilidade,
    normalizarTipoHabilidade,
    normalizarListaHabilidade,
    normalizarUsosDaHabilidade,
    normalizarRecargaDaHabilidade,
    normalizarHabilidade,
    obterEstadoHabilidade,
    obterRotuloTipoHabilidade,
    obterRotuloEstadoHabilidade,
    obterResumoOperacionalHabilidade
  });
})(typeof window === "undefined" ? globalThis : window);
