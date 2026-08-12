(function disponibilizarDominioDeVinculos(raiz, fabrica) {
  "use strict";

  const api = fabrica();

  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }

  if (raiz) {
    raiz.GrimorioLinksDomain = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function criarDominioDeVinculos() {
  "use strict";

  const LIMITES = Object.freeze({
    id: 120,
    nome: 100,
    subtitulo: 120,
    descricao: 5000,
    imagem: 1500000
  });
  const TIPOS = Object.freeze(["pessoa", "lugar", "evento", "objeto"]);
  const TIPO_ENVELOPE = "grimorio-vinculo";
  const VERSAO_SCHEMA = 1;
  let sequenciaIdAlternativo = 0;

  class LinksDomainError extends Error {
    constructor(code, message, details) {
      super(message);
      this.name = "LinksDomainError";
      this.code = code;
      this.details = details || null;
    }
  }

  function ehObjetoDeDados(valor) {
    if (!valor || typeof valor !== "object" || Array.isArray(valor)) return false;
    const prototipo = Object.getPrototypeOf(valor);
    return prototipo === Object.prototype || prototipo === null;
  }

  function normalizarTextoObrigatorio(valor, campo, limite, rotulo) {
    if (valor === undefined || valor === null) {
      throw new LinksDomainError("invalid-" + campo, "O campo " + rotulo + " é obrigatório.");
    }
    if (typeof valor !== "string") {
      throw new LinksDomainError("invalid-" + campo, "O campo " + rotulo + " deve ser texto.");
    }

    const texto = valor.trim();
    if (!texto) {
      throw new LinksDomainError("invalid-" + campo, "O campo " + rotulo + " é obrigatório.");
    }
    if (texto.length > limite) {
      throw new LinksDomainError(
        "invalid-" + campo,
        "O campo " + rotulo + " deve possuir no máximo " + limite + " caracteres."
      );
    }
    return texto;
  }

  function normalizarTextoOpcional(valor, campo, limite, rotulo) {
    if (valor === undefined || valor === null) return "";
    if (typeof valor !== "string") {
      throw new LinksDomainError("invalid-" + campo, "O campo " + rotulo + " deve ser texto.");
    }

    const texto = valor.trim();
    if (texto.length > limite) {
      throw new LinksDomainError(
        "invalid-" + campo,
        "O campo " + rotulo + " deve possuir no máximo " + limite + " caracteres."
      );
    }
    return texto;
  }

  function normalizarTipo(valor) {
    if (valor === undefined || valor === null || valor === "") return "pessoa";
    if (typeof valor !== "string") {
      throw new LinksDomainError("invalid-tipo", "O tipo do vínculo deve ser texto.");
    }

    const tipo = valor.trim().toLowerCase();
    if (!tipo) return "pessoa";
    if (!TIPOS.includes(tipo)) {
      throw new LinksDomainError(
        "invalid-tipo",
        "O tipo do vínculo deve ser pessoa, lugar, evento ou objeto."
      );
    }
    return tipo;
  }

  function normalizarImagem(valor) {
    if (typeof valor === "string" && /[\u0000-\u001f\u007f]/.test(valor)) {
      throw new LinksDomainError(
        "invalid-imagem",
        "A imagem deve ser uma imagem PNG, JPEG ou WebP incorporada, ou um caminho local seguro."
      );
    }
    const imagem = normalizarTextoOpcional(valor, "imagem", LIMITES.imagem, "imagem");
    if (!imagem) return "";

    const imagemRasterIncorporada = /^data:image\/(?:png|jpeg|webp);base64,[a-z0-9+/]+={0,2}$/i.test(imagem);
    if (imagemRasterIncorporada) return imagem;

    const possuiControleOuEspaco = /[\u0000-\u0020\u007f]/.test(imagem);
    const possuiProtocolo = /^[a-z][a-z0-9+.-]*:/i.test(imagem) || imagem.includes(":");
    const caminhoAbsoluto = /^[\\/]/.test(imagem);
    const separadorInvalido = imagem.includes("\\") || imagem.includes("//");
    const sufixoAmbiguo = /[?#]/.test(imagem) || /%[0-9a-f]{2}/i.test(imagem);
    const possuiMarcacao = /[<>]/.test(imagem);
    const ultimoSegmento = imagem.slice(imagem.lastIndexOf("/") + 1);
    const indiceExtensao = ultimoSegmento.lastIndexOf(".");
    const possuiExtensao = indiceExtensao >= 0;
    const extensao = possuiExtensao ? ultimoSegmento.slice(indiceExtensao + 1).toLowerCase() : "";
    const extensaoInvalida = possuiExtensao
      && !["png", "jpg", "jpeg", "webp", "gif"].includes(extensao);
    const caminhoIncompleto = !ultimoSegmento || ultimoSegmento === "." || ultimoSegmento === "..";
    if (possuiControleOuEspaco
      || possuiProtocolo
      || caminhoAbsoluto
      || separadorInvalido
      || sufixoAmbiguo
      || possuiMarcacao
      || extensaoInvalida
      || caminhoIncompleto) {
      throw new LinksDomainError(
        "invalid-imagem",
        "A imagem deve ser uma imagem PNG, JPEG ou WebP incorporada, ou um caminho local seguro."
      );
    }
    return imagem;
  }

  function ehIdValido(valor) {
    return typeof valor === "string"
      && valor.trim().length > 0
      && valor.trim().length <= LIMITES.id;
  }

  function criarIdPadrao() {
    if (typeof globalThis !== "undefined"
      && globalThis.crypto
      && typeof globalThis.crypto.randomUUID === "function") {
      return globalThis.crypto.randomUUID();
    }

    sequenciaIdAlternativo += 1;
    return "vinculo-" + Date.now().toString(36) + "-" + sequenciaIdAlternativo.toString(36);
  }

  function criarIdVinculo(criarId, idsUsados) {
    const fabricaId = typeof criarId === "function" ? criarId : criarIdPadrao;
    const reservados = idsUsados instanceof Set ? idsUsados : new Set();

    for (let tentativa = 0; tentativa < 100; tentativa += 1) {
      const candidato = fabricaId();
      if (!ehIdValido(candidato)) continue;
      const id = candidato.trim();
      if (!reservados.has(id)) return id;
    }

    throw new LinksDomainError(
      "id-generation-failed",
      "Não foi possível gerar um ID interno único e válido para o vínculo."
    );
  }

  function obterCampo(dados, canonico, alias) {
    return dados[canonico] !== undefined ? dados[canonico] : dados[alias];
  }

  function normalizarConteudoVinculo(dados) {
    if (!ehObjetoDeDados(dados)) {
      throw new LinksDomainError("invalid-vinculo", "O vínculo deve ser um objeto válido.");
    }

    return {
      tipo: normalizarTipo(obterCampo(dados, "tipo", "type")),
      nome: normalizarTextoObrigatorio(obterCampo(dados, "nome", "name"), "nome", LIMITES.nome, "nome"),
      subtitulo: normalizarTextoOpcional(
        obterCampo(dados, "subtitulo", "subtitle"),
        "subtitulo",
        LIMITES.subtitulo,
        "subtítulo"
      ),
      descricao: normalizarTextoOpcional(
        obterCampo(dados, "descricao", "description"),
        "descricao",
        LIMITES.descricao,
        "descrição"
      ),
      imagem: normalizarImagem(obterCampo(dados, "imagem", "image"))
    };
  }

  function normalizarVinculoInterno(dados, opcoes) {
    const configuracao = ehObjetoDeDados(opcoes) ? opcoes : {};
    const idsUsados = configuracao.idsUsados instanceof Set ? configuracao.idsUsados : new Set();
    const idsIndisponiveis = configuracao.idsIndisponiveis instanceof Set
      ? configuracao.idsIndisponiveis
      : idsUsados;
    const conteudo = normalizarConteudoVinculo(dados);
    const idRecebido = ehIdValido(dados.id) ? dados.id.trim() : null;
    const preservarId = configuracao.idPersistido === true
      && idRecebido
      && !idsUsados.has(idRecebido);
    const id = preservarId
      ? idRecebido
      : criarIdVinculo(configuracao.criarId, idsIndisponiveis);
    const vinculo = {
      id,
      tipo: conteudo.tipo,
      nome: conteudo.nome,
      subtitulo: conteudo.subtitulo,
      descricao: conteudo.descricao,
      imagem: conteudo.imagem
    };

    idsUsados.add(id);
    idsIndisponiveis.add(id);
    return vinculo;
  }

  function normalizarVinculo(dados, opcoes) {
    const configuracao = ehObjetoDeDados(opcoes) ? opcoes : {};
    return normalizarVinculoInterno(dados, {
      criarId: configuracao.criarId,
      idsUsados: configuracao.idsUsados,
      idsIndisponiveis: configuracao.idsUsados,
      idPersistido: false
    });
  }

  function normalizarColecaoVinculos(colecao, opcoes) {
    if (colecao === undefined) return [];
    if (!Array.isArray(colecao)) {
      throw new LinksDomainError(
        "invalid-links-collection",
        "A coleção de vínculos deve ser uma lista."
      );
    }

    const configuracao = ehObjetoDeDados(opcoes) ? opcoes : {};
    const idsReservados = new Set();
    colecao.forEach(function reservarIdRecebido(dados) {
      if (ehObjetoDeDados(dados) && ehIdValido(dados.id)) {
        idsReservados.add(dados.id.trim());
      }
    });
    const idsUsados = new Set();
    return colecao.map(function (dados, indice) {
      try {
        const idRecebido = ehObjetoDeDados(dados) && ehIdValido(dados.id)
          ? dados.id.trim()
          : null;
        const preservarId = idRecebido !== null && !idsUsados.has(idRecebido);
        const vinculo = normalizarVinculoInterno(dados, {
          criarId: configuracao.criarId,
          idsUsados,
          idsIndisponiveis: idsReservados,
          idPersistido: preservarId
        });
        return vinculo;
      } catch (erro) {
        if (erro instanceof LinksDomainError && !erro.details) erro.details = { indice };
        throw erro;
      }
    });
  }

  function criarEnvelopeVinculo(dados) {
    const vinculo = normalizarConteudoVinculo(dados);
    return {
      tipo: TIPO_ENVELOPE,
      schemaVersion: VERSAO_SCHEMA,
      vinculo
    };
  }

  function lerEnvelopeVinculo(envelope, opcoes) {
    if (!ehObjetoDeDados(envelope)) {
      throw new LinksDomainError("invalid-envelope", "O envelope do vínculo deve ser um objeto válido.");
    }

    const tipo = obterCampo(envelope, "tipo", "type");
    if (tipo !== TIPO_ENVELOPE) {
      throw new LinksDomainError(
        "invalid-envelope-type",
        "O tipo do envelope deve ser grimorio-vinculo."
      );
    }

    const versao = envelope.schemaVersion !== undefined ? envelope.schemaVersion : envelope.versao;
    if (typeof versao === "number" && versao > VERSAO_SCHEMA) {
      throw new LinksDomainError(
        "future-schema-version",
        "A versão futura deste vínculo ainda não é compatível."
      );
    }
    if (versao !== VERSAO_SCHEMA) {
      throw new LinksDomainError(
        "invalid-schema-version",
        "A versão do vínculo deve ser 1."
      );
    }

    const dados = envelope.vinculo !== undefined ? envelope.vinculo : envelope.link;
    if (!ehObjetoDeDados(dados)) {
      throw new LinksDomainError(
        "invalid-envelope-link",
        "O campo vínculo do envelope deve ser um objeto válido."
      );
    }

    const configuracao = ehObjetoDeDados(opcoes) ? opcoes : {};
    return normalizarVinculoInterno(dados, {
      criarId: configuracao.criarId,
      idsUsados: configuracao.idsUsados,
      idsIndisponiveis: configuracao.idsUsados,
      idPersistido: false
    });
  }

  return Object.freeze({
    LIMITES,
    LinksDomainError,
    criarIdVinculo,
    normalizarVinculo,
    normalizarColecaoVinculos,
    criarEnvelopeVinculo,
    lerEnvelopeVinculo
  });
});
