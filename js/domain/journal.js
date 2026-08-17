(function exposeGrimorioJournalDomain(global, factory) {
  "use strict";

  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (global) global.GrimorioJournalDomain = api;
})(typeof globalThis === "undefined" ? this : globalThis, function createJournalDomain() {
  "use strict";

  const LIMITES = Object.freeze({
    id: 120,
    titulo: 120,
    conteudo: 20000,
    data: 100,
    sessao: 100,
    marcador: 30,
    marcadores: 10
  });
  const TIPOS = Object.freeze(["sessao", "descoberta", "pendencia", "nota"]);
  let fallbackSequence = 0;

  class JournalDomainError extends Error {
    constructor(code, message, details) {
      super(message);
      this.name = "JournalDomainError";
      this.code = code;
      this.details = details || null;
    }
  }

  function isDataObject(value) {
    if (!value || typeof value !== "object" || Array.isArray(value)) return false;
    const prototype = Object.getPrototypeOf(value);
    return prototype === Object.prototype || prototype === null;
  }

  function normalizeRequiredText(value, field, label, limit) {
    if (typeof value !== "string" || !value.trim()) {
      throw new JournalDomainError("invalid-" + field, "O campo " + label + " é obrigatório.");
    }
    const text = value.trim();
    if (text.length > limit) {
      throw new JournalDomainError(
        "invalid-" + field,
        "O campo " + label + " deve possuir no máximo " + limit + " caracteres."
      );
    }
    return text;
  }

  function normalizeOptionalText(value, field, label, limit) {
    if (value === undefined || value === null) return "";
    if (typeof value !== "string") {
      throw new JournalDomainError("invalid-" + field, "O campo " + label + " deve ser texto.");
    }
    const text = value.trim();
    if (text.length > limit) {
      throw new JournalDomainError(
        "invalid-" + field,
        "O campo " + label + " deve possuir no máximo " + limit + " caracteres."
      );
    }
    return text;
  }

  function normalizeType(value) {
    if (value === undefined || value === null || value === "") return "nota";
    if (typeof value !== "string" || !TIPOS.includes(value.trim().toLowerCase())) {
      throw new JournalDomainError(
        "invalid-tipo",
        "O tipo deve ser sessao, descoberta, pendencia ou nota."
      );
    }
    return value.trim().toLowerCase();
  }

  function normalizeTags(value) {
    if (value === undefined || value === null) return [];
    if (!Array.isArray(value)) {
      throw new JournalDomainError("invalid-marcadores", "Os marcadores devem ser uma lista.");
    }

    const tags = [];
    const normalizedTags = new Set();
    value.forEach(function normalizeTag(entry) {
      if (typeof entry !== "string") {
        throw new JournalDomainError("invalid-marcador", "Cada marcador deve ser texto.");
      }
      const tag = entry.trim();
      if (!tag) return;
      if (tag.length > LIMITES.marcador) {
        throw new JournalDomainError(
          "invalid-marcador",
          "Cada marcador deve possuir no máximo 30 caracteres."
        );
      }
      const key = normalizeForSearch(tag);
      if (!normalizedTags.has(key)) {
        normalizedTags.add(key);
        tags.push(tag);
      }
    });
    if (tags.length > LIMITES.marcadores) {
      throw new JournalDomainError(
        "invalid-marcadores",
        "Um registro pode possuir no máximo 10 marcadores."
      );
    }
    return tags;
  }

  function isValidId(value) {
    return typeof value === "string"
      && value.trim().length > 0
      && value.trim().length <= LIMITES.id;
  }

  function defaultIdFactory() {
    if (globalThis.crypto && typeof globalThis.crypto.randomUUID === "function") {
      return "registro-" + globalThis.crypto.randomUUID();
    }
    fallbackSequence += 1;
    return "registro-" + Date.now().toString(36) + "-" + fallbackSequence.toString(36);
  }

  function createUniqueId(factory, unavailableIds) {
    const createId = typeof factory === "function" ? factory : defaultIdFactory;
    const unavailable = unavailableIds instanceof Set ? unavailableIds : new Set();
    for (let attempt = 0; attempt < 100; attempt += 1) {
      const candidate = createId();
      if (!isValidId(candidate)) continue;
      const id = candidate.trim();
      if (!unavailable.has(id)) return id;
    }
    throw new JournalDomainError(
      "id-generation-failed",
      "Não foi possível gerar um ID único para o registro."
    );
  }

  function currentIso(now) {
    const value = typeof now === "function" ? now() : new Date().toISOString();
    return normalizeTimestamp(value, "atualização");
  }

  function normalizeTimestamp(value, label, fallback) {
    if (value === undefined || value === null || value === "") return fallback;
    if (typeof value !== "string") {
      throw new JournalDomainError("invalid-timestamp", "A data de " + label + " deve estar no formato ISO.");
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime()) || date.toISOString() !== value) {
      throw new JournalDomainError("invalid-timestamp", "A data de " + label + " deve estar no formato ISO.");
    }
    return value;
  }

  function normalizeEntryInternal(data, options) {
    if (!isDataObject(data)) {
      throw new JournalDomainError("invalid-registro", "O registro deve ser um objeto válido.");
    }
    const settings = isDataObject(options) ? options : {};
    const usedIds = settings.usedIds instanceof Set ? settings.usedIds : new Set();
    const unavailableIds = settings.unavailableIds instanceof Set ? settings.unavailableIds : usedIds;
    const receivedId = isValidId(data.id) ? data.id.trim() : null;
    const id = settings.preserveId === true && receivedId && !usedIds.has(receivedId)
      ? receivedId
      : createUniqueId(settings.criarId, unavailableIds);
    const now = currentIso(settings.agora);
    const createdAt = normalizeTimestamp(data.criadoEm, "criação", now);
    const updatedAt = normalizeTimestamp(data.atualizadoEm, "atualização", createdAt);
    const entry = {
      id,
      tipo: normalizeType(data.tipo),
      titulo: normalizeRequiredText(data.titulo, "titulo", "título", LIMITES.titulo),
      conteudo: normalizeOptionalText(data.conteudo, "conteudo", "relato", LIMITES.conteudo),
      data: normalizeOptionalText(data.data, "data", "data", LIMITES.data),
      sessao: normalizeOptionalText(data.sessao, "sessao", "sessão", LIMITES.sessao),
      marcadores: normalizeTags(data.marcadores),
      fixado: data.fixado === true,
      criadoEm: createdAt,
      atualizadoEm: updatedAt
    };
    usedIds.add(id);
    unavailableIds.add(id);
    return entry;
  }

  function normalizarRegistro(data, options) {
    const settings = isDataObject(options) ? options : {};
    return normalizeEntryInternal(data, {
      criarId: settings.criarId,
      agora: settings.agora,
      preserveId: false
    });
  }

  function normalizarColecaoRegistros(collection, options) {
    if (collection === undefined) return [];
    if (!Array.isArray(collection)) {
      throw new JournalDomainError(
        "invalid-journal-collection",
        "A coleção de registros deve ser uma lista."
      );
    }
    const settings = isDataObject(options) ? options : {};
    const reservedIds = new Set();
    collection.forEach(function reserveReceivedId(data) {
      if (isDataObject(data) && isValidId(data.id)) reservedIds.add(data.id.trim());
    });
    const usedIds = new Set();
    return collection.map(function normalizeCollectionEntry(data, index) {
      try {
        const receivedId = isDataObject(data) && isValidId(data.id) ? data.id.trim() : null;
        return normalizeEntryInternal(data, {
          criarId: settings.criarId,
          agora: settings.agora,
          usedIds,
          unavailableIds: reservedIds,
          preserveId: Boolean(receivedId && !usedIds.has(receivedId))
        });
      } catch (error) {
        if (error instanceof JournalDomainError && !error.details) error.details = { indice: index };
        throw error;
      }
    });
  }

  function ordenarRegistros(entries) {
    return entries.slice().sort(function compareEntries(a, b) {
      if (Boolean(a.fixado) !== Boolean(b.fixado)) return a.fixado ? -1 : 1;
      return String(b.atualizadoEm || "").localeCompare(String(a.atualizadoEm || ""));
    });
  }

  function normalizeForSearch(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleLowerCase("pt-BR")
      .trim();
  }

  function filtrarRegistros(entries, filters) {
    const settings = isDataObject(filters) ? filters : {};
    const terms = normalizeForSearch(settings.query).split(/\s+/).filter(Boolean);
    const type = TIPOS.includes(settings.tipo) ? settings.tipo : "";
    return entries.filter(function matches(entry) {
      if (type && entry.tipo !== type) return false;
      if (settings.somenteFixados === true && entry.fixado !== true) return false;
      if (!terms.length) return true;
      const haystack = normalizeForSearch([
        entry.titulo,
        entry.conteudo,
        entry.data,
        entry.sessao,
        ...(Array.isArray(entry.marcadores) ? entry.marcadores : [])
      ].join(" "));
      return terms.every(function includesTerm(term) { return haystack.includes(term); });
    });
  }

  function agruparRegistros(entries) {
    const groups = new Map();
    entries.forEach(function addEntry(entry) {
      const label = typeof entry.sessao === "string" && entry.sessao.trim()
        ? entry.sessao.trim()
        : "Notas avulsas";
      if (!groups.has(label)) groups.set(label, []);
      groups.get(label).push(entry);
    });
    return [...groups.entries()].map(function toGroup([rotulo, registros]) {
      return { rotulo, registros };
    });
  }

  return Object.freeze({
    LIMITES,
    TIPOS,
    JournalDomainError,
    criarIdRegistro: createUniqueId,
    normalizarRegistro,
    normalizarColecaoRegistros,
    ordenarRegistros,
    filtrarRegistros,
    agruparRegistros
  });
});
