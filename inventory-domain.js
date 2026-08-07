(function disponibilizarDominioDeInventario(raiz, fabrica) {
  "use strict";

  const api = fabrica();

  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }

  if (raiz) {
    raiz.GrimorioInventoryDomain = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function criarDominioDeInventario() {
  "use strict";

  const INVENTORY_COLUMNS = 6;
  const INVENTORY_ROWS = 5;
  const INVENTORY_CONFIG = Object.freeze({
    columns: INVENTORY_COLUMNS,
    rows: INVENTORY_ROWS,
    capacity: INVENTORY_COLUMNS * INVENTORY_ROWS,
    supportedRotations: Object.freeze([0, 90])
  });

  const RARITY_CONFIG = Object.freeze({
    comum: Object.freeze({ label: "Comum", cssClass: "is-rarity-common" }),
    incomum: Object.freeze({ label: "Incomum", cssClass: "is-rarity-uncommon" }),
    raro: Object.freeze({ label: "Raro", cssClass: "is-rarity-rare" }),
    epico: Object.freeze({ label: "Épico", cssClass: "is-rarity-epic" }),
    lendario: Object.freeze({ label: "Lendário", cssClass: "is-rarity-legendary" })
  });

  const ITEM_TYPE_CONFIG = Object.freeze({
    consumivel: Object.freeze({ label: "Consumível" }),
    arma: Object.freeze({ label: "Arma" }),
    armadura: Object.freeze({ label: "Armadura" }),
    equipamento: Object.freeze({ label: "Equipamento" }),
    ferramenta: Object.freeze({ label: "Ferramenta" }),
    material: Object.freeze({ label: "Material" }),
    outro: Object.freeze({ label: "Outro" })
  });

  const MAX_NAME_LENGTH = 120;
  const MAX_DESCRIPTION_LENGTH = 3000;
  const MAX_IMAGE_LENGTH = 240000;
  const MAX_PROPERTY_LENGTH = 90;
  const MAX_ITEM_DIMENSION = 20;
  const MAX_ID_LENGTH = 160;
  let fallbackIdSequence = 0;

  class InventoryDomainError extends Error {
    constructor(code, message, details) {
      super(message);
      this.name = "InventoryDomainError";
      this.code = code;
      this.details = details || null;
    }
  }

  function isPlainObject(value) {
    if (!value || typeof value !== "object" || Array.isArray(value)) return false;
    const prototype = Object.getPrototypeOf(value);
    return prototype === Object.prototype || prototype === null;
  }

  function normalizeToken(value) {
    if (typeof value !== "string") return "";
    return value
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function normalizeRequiredText(value, field, maxLength) {
    if (typeof value !== "string") {
      throw new InventoryDomainError("invalid-" + field, "O campo " + field + " deve ser texto.");
    }

    const normalized = value.trim();
    if (!normalized) {
      throw new InventoryDomainError("invalid-" + field, "O campo " + field + " é obrigatório.");
    }
    if (normalized.length > maxLength) {
      throw new InventoryDomainError("invalid-" + field, "O campo " + field + " excede o limite permitido.");
    }
    return normalized;
  }

  function normalizeOptionalText(value, field, maxLength) {
    if (value === undefined || value === null) return "";
    if (typeof value !== "string") {
      throw new InventoryDomainError("invalid-" + field, "O campo " + field + " deve ser texto.");
    }

    const normalized = value.trim();
    if (normalized.length > maxLength) {
      throw new InventoryDomainError("invalid-" + field, "O campo " + field + " excede o limite permitido.");
    }
    return normalized;
  }

  function normalizeEnum(value, aliases, fallback, field) {
    if (value === undefined || value === null) return fallback;
    if (typeof value !== "string") {
      throw new InventoryDomainError("invalid-" + field, "O campo " + field + " deve ser texto.");
    }

    if (!value.trim()) return fallback;
    const token = normalizeToken(value);
    if (!token || !Object.prototype.hasOwnProperty.call(aliases, token)) {
      throw new InventoryDomainError("invalid-" + field, "O campo " + field + " possui um valor desconhecido.");
    }
    return aliases[token];
  }

  function normalizeWeight(value) {
    if (value === undefined || value === null || value === "") return 0;
    if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
      throw new InventoryDomainError("invalid-weight", "O peso deve ser um número finito maior ou igual a zero.");
    }
    return value;
  }

  function normalizeQuantity(value) {
    if (value === undefined || value === null || value === "") return 1;
    if (!Number.isInteger(value) || value < 1 || value > 999) {
      throw new InventoryDomainError("invalid-quantity", "A quantidade deve ser um inteiro entre 1 e 999.");
    }
    return value;
  }

  function normalizeImage(value) {
    const image = normalizeOptionalText(value, "imagem", MAX_IMAGE_LENGTH);
    if (!image) return "";
    const isSafeDataImage = /^data:image\/(?:png|jpe?g|webp|gif);base64,/i.test(image);
    const isSafeRelativePath = !/^[a-z][a-z0-9+.-]*:/i.test(image) && !image.startsWith("//");
    if (!isSafeDataImage && !isSafeRelativePath) {
      throw new InventoryDomainError("invalid-image", "A imagem deve ser um caminho local ou uma imagem incorporada válida.");
    }
    return image;
  }

  function normalizePrimaryAttribute(value) {
    if (value === undefined || value === null) return null;
    if (!isPlainObject(value)) {
      throw new InventoryDomainError("invalid-primary-attribute", "O atributo principal deve possuir rótulo e valor.");
    }
    const label = normalizeOptionalText(value.rotulo !== undefined ? value.rotulo : value.label, "atributo-principal-rotulo", 40);
    const attributeValue = normalizeOptionalText(value.valor !== undefined ? value.valor : value.value, "atributo-principal-valor", 80);
    return label && attributeValue ? { rotulo: label, valor: attributeValue } : null;
  }

  function normalizeProperties(value) {
    if (value === undefined || value === null) return [];
    if (!Array.isArray(value) || value.length > 8) {
      throw new InventoryDomainError("invalid-properties", "As propriedades devem ser uma lista com até 8 entradas.");
    }
    return value.map(function (property) {
      return normalizeRequiredText(property, "propriedade", MAX_PROPERTY_LENGTH);
    });
  }

  function normalizeDimension(value, field) {
    if (!Number.isInteger(value) || value <= 0 || value > MAX_ITEM_DIMENSION) {
      throw new InventoryDomainError(
        "invalid-size",
        "A dimensão " + field + " deve ser um inteiro entre 1 e " + MAX_ITEM_DIMENSION + "."
      );
    }
    return value;
  }

  function normalizeSize(value, allowDefaultSize) {
    if ((value === undefined || value === null) && allowDefaultSize) {
      return { largura: 1, altura: 1 };
    }
    if (!isPlainObject(value)) {
      throw new InventoryDomainError("invalid-size", "O item deve possuir um tamanho válido.");
    }

    return {
      largura: normalizeDimension(value.largura !== undefined ? value.largura : value.width, "largura"),
      altura: normalizeDimension(value.altura !== undefined ? value.altura : value.height, "altura")
    };
  }

  function normalizeItemDefinition(data, options) {
    const settings = options && isPlainObject(options) ? options : {};
    const allowLegacyString = settings.allowLegacyString === true;
    const allowDefaultSize = settings.allowDefaultSize === true;
    let source = data;

    if (typeof source === "string" && allowLegacyString) {
      source = { nome: source };
    }
    if (!isPlainObject(source)) {
      throw new InventoryDomainError("invalid-item", "O item deve ser um objeto válido.");
    }

    const typeAliases = {
      consumivel: "consumivel",
      consumable: "consumivel",
      pocao: "consumivel",
      arma: "arma",
      weapon: "arma",
      armadura: "armadura",
      armor: "armadura",
      equipamento: "equipamento",
      equipment: "equipamento",
      ferramenta: "ferramenta",
      tool: "ferramenta",
      material: "material",
      outro: "outro",
      other: "outro"
    };
    const rarityAliases = {
      comum: "comum",
      common: "comum",
      incomum: "incomum",
      uncommon: "incomum",
      raro: "raro",
      rare: "raro",
      epico: "epico",
      epic: "epico",
      lendario: "lendario",
      legendary: "lendario"
    };

    return {
      nome: normalizeRequiredText(source.nome !== undefined ? source.nome : source.name, "nome", MAX_NAME_LENGTH),
      tipo: normalizeEnum(source.tipo !== undefined ? source.tipo : source.type, typeAliases, "outro", "tipo"),
      raridade: normalizeEnum(
        source.raridade !== undefined ? source.raridade : source.rarity,
        rarityAliases,
        "comum",
        "raridade"
      ),
      descricao: normalizeOptionalText(
        source.descricao !== undefined ? source.descricao : source.description,
        "descricao",
        MAX_DESCRIPTION_LENGTH
      ),
      peso: normalizeWeight(source.peso !== undefined ? source.peso : source.weight),
      tamanho: normalizeSize(source.tamanho !== undefined ? source.tamanho : source.size, allowDefaultSize),
      quantidade: normalizeQuantity(source.quantidade !== undefined ? source.quantidade : source.quantity),
      imagem: normalizeImage(source.imagem !== undefined ? source.imagem : source.image),
      atributoPrincipal: normalizePrimaryAttribute(
        source.atributoPrincipal !== undefined ? source.atributoPrincipal : source.primaryAttribute
      ),
      propriedades: normalizeProperties(source.propriedades !== undefined ? source.propriedades : source.properties),
      equipavelEm: normalizeOptionalText(
        source.equipavelEm !== undefined ? source.equipavelEm : source.equippableIn,
        "equipavel-em",
        40
      ),
      empilhavel: source.empilhavel === true || source.stackable === true,
      limiteEmpilhamento: Number.isInteger(source.limiteEmpilhamento || source.stackLimit)
        ? Math.max(1, Math.min(999, source.limiteEmpilhamento || source.stackLimit))
        : 1
    };
  }

  function normalizeRotation(value, defaultRotation) {
    const rotation = value === undefined || value === null ? defaultRotation : value;
    if (!INVENTORY_CONFIG.supportedRotations.includes(rotation)) {
      throw new InventoryDomainError("invalid-rotation", "A rotação deve ser 0 ou 90 graus.");
    }
    return rotation;
  }

  function normalizePosition(value) {
    if (!isPlainObject(value) || !Number.isInteger(value.x) || !Number.isInteger(value.y)) {
      throw new InventoryDomainError("invalid-position", "A posição deve conter coordenadas inteiras x e y.");
    }
    return { x: value.x, y: value.y };
  }

  function isValidInventoryId(value) {
    return typeof value === "string" && value.trim().length > 0 && value.trim().length <= MAX_ID_LENGTH;
  }

  function defaultIdFactory() {
    if (typeof globalThis !== "undefined" && globalThis.crypto && typeof globalThis.crypto.randomUUID === "function") {
      return globalThis.crypto.randomUUID();
    }

    fallbackIdSequence += 1;
    return "inventory-" + Date.now().toString(36) + "-" + fallbackIdSequence.toString(36);
  }

  function createInventoryItemId(idFactory, usedIds) {
    const factory = typeof idFactory === "function" ? idFactory : defaultIdFactory;
    const reservedIds = usedIds instanceof Set ? usedIds : new Set();

    for (let attempt = 0; attempt < 100; attempt += 1) {
      const candidate = factory();
      if (isValidInventoryId(candidate)) {
        const normalized = candidate.trim();
        if (!reservedIds.has(normalized)) return normalized;
      }
    }

    throw new InventoryDomainError("id-generation-failed", "Não foi possível gerar um ID único para o item.");
  }

  function normalizeInventoryItem(data, options) {
    if (!isPlainObject(data)) {
      throw new InventoryDomainError("invalid-inventory-item", "A instância de inventário deve ser um objeto válido.");
    }

    const settings = options && isPlainObject(options) ? options : {};
    const usedIds = settings.usedIds instanceof Set ? settings.usedIds : new Set();
    const preserveValidId = settings.preserveValidId !== false;
    const suppliedId = isValidInventoryId(data.id) ? data.id.trim() : null;
    const canPreserveId = preserveValidId && suppliedId && !usedIds.has(suppliedId);
    const id = canPreserveId ? suppliedId : createInventoryItemId(settings.idFactory, usedIds);
    const normalizedItem = {
      id,
      item: normalizeItemDefinition(data.item),
      posicao: normalizePosition(data.posicao !== undefined ? data.posicao : data.position),
      rotacao: normalizeRotation(data.rotacao !== undefined ? data.rotacao : data.rotation, 0)
    };

    usedIds.add(id);
    return normalizedItem;
  }

  function unwrapItemDefinition(item) {
    if (isPlainObject(item) && isPlainObject(item.item)) return item.item;
    return item;
  }

  function getEffectiveDimensions(item, rotation) {
    const definition = unwrapItemDefinition(item);
    if (!isPlainObject(definition) || !isPlainObject(definition.tamanho)) {
      throw new InventoryDomainError("invalid-size", "O item não possui dimensões válidas.");
    }

    const width = normalizeDimension(definition.tamanho.largura, "largura");
    const height = normalizeDimension(definition.tamanho.altura, "altura");
    const effectiveRotation = normalizeRotation(
      rotation,
      isPlainObject(item) && item.rotacao !== undefined ? item.rotacao : 0
    );

    return effectiveRotation === 90
      ? { largura: height, altura: width }
      : { largura: width, altura: height };
  }

  function getOccupiedCells(item, position, rotation) {
    const dimensions = getEffectiveDimensions(item, rotation);
    const normalizedPosition = normalizePosition(position);
    const cells = [];

    for (let y = normalizedPosition.y; y < normalizedPosition.y + dimensions.altura; y += 1) {
      for (let x = normalizedPosition.x; x < normalizedPosition.x + dimensions.largura; x += 1) {
        cells.push({ x, y });
      }
    }
    return cells;
  }

  function normalizeItemsArray(items) {
    if (!Array.isArray(items)) {
      throw new InventoryDomainError("invalid-inventory", "O inventário deve ser uma lista.");
    }
    return items;
  }

  function createOccupancyMatrix(items) {
    const inventory = normalizeItemsArray(items);
    const seenIds = new Set();
    const matrix = Array.from({ length: INVENTORY_CONFIG.rows }, function () {
      return Array(INVENTORY_CONFIG.columns).fill(null);
    });

    inventory.forEach(function (inventoryItem) {
      if (!isPlainObject(inventoryItem) || !isValidInventoryId(inventoryItem.id)) {
        throw new InventoryDomainError("invalid-inventory-item", "Todo item persistido deve possuir um ID válido.");
      }

      const inventoryItemId = inventoryItem.id.trim();
      if (seenIds.has(inventoryItemId)) {
        throw new InventoryDomainError("duplicate-item-id", "Dois itens persistidos possuem o mesmo ID.", {
          itemId: inventoryItemId
        });
      }
      seenIds.add(inventoryItemId);

      const cells = getOccupiedCells(inventoryItem, inventoryItem.posicao, inventoryItem.rotacao);
      cells.forEach(function (cell) {
        const inside = cell.x >= 0
          && cell.y >= 0
          && cell.x < INVENTORY_CONFIG.columns
          && cell.y < INVENTORY_CONFIG.rows;
        if (!inside) {
          throw new InventoryDomainError("item-out-of-bounds", "Um item está fora dos limites da mochila.", {
            itemId: inventoryItem.id,
            cell
          });
        }
        if (matrix[cell.y][cell.x] !== null) {
          throw new InventoryDomainError("inventory-collision", "Dois itens ocupam a mesma célula.", {
            itemId: inventoryItem.id,
            conflictingItemId: matrix[cell.y][cell.x],
            cell
          });
        }
        matrix[cell.y][cell.x] = inventoryItemId;
      });
    });

    return matrix;
  }

  function getUsedInventoryCells(items) {
    return createOccupancyMatrix(items).reduce(function (total, row) {
      return total + row.reduce(function (rowTotal, itemId) {
        return rowTotal + (itemId === null ? 0 : 1);
      }, 0);
    }, 0);
  }

  function canPlaceItem(items, item, position, options) {
    const inventory = normalizeItemsArray(items);
    const settings = options && isPlainObject(options) ? options : {};
    const normalizedPosition = normalizePosition(position);
    const rotation = normalizeRotation(
      settings.rotation,
      isPlainObject(item) && item.rotacao !== undefined ? item.rotacao : 0
    );
    const dimensions = getEffectiveDimensions(item, rotation);
    const cells = getOccupiedCells(item, normalizedPosition, rotation);
    const hasIgnoreItemId = settings.ignoreItemId !== undefined && settings.ignoreItemId !== null;
    let ignoreItemId = null;
    if (hasIgnoreItemId) {
      const candidateItemId = isPlainObject(item) ? item.id : null;
      if (
        !isValidInventoryId(settings.ignoreItemId)
        || !isValidInventoryId(candidateItemId)
        || settings.ignoreItemId !== candidateItemId
      ) {
        throw new InventoryDomainError(
          "invalid-ignore-item-id",
          "O ID ignorado deve corresponder exatamente ao ID válido do item movimentado."
        );
      }
      ignoreItemId = settings.ignoreItemId.trim();
    }

    if (dimensions.largura > INVENTORY_CONFIG.columns || dimensions.altura > INVENTORY_CONFIG.rows) {
      return {
        valid: false,
        code: "item-too-large",
        detail: "dimensions-exceed-grid",
        cells,
        dimensions
      };
    }

    const outside = cells.some(function (cell) {
      return cell.x < 0
        || cell.y < 0
        || cell.x >= INVENTORY_CONFIG.columns
        || cell.y >= INVENTORY_CONFIG.rows;
    });
    if (outside) {
      return {
        valid: false,
        code: "invalid-position",
        detail: "out-of-bounds",
        cells,
        dimensions
      };
    }

    const occupiedByCell = new Map();
    const seenIds = new Set();
    inventory.forEach(function (existingItem) {
      if (!isPlainObject(existingItem) || !isValidInventoryId(existingItem.id)) {
        throw new InventoryDomainError("invalid-inventory-item", "Todo item persistido deve possuir um ID válido.");
      }

      const existingId = existingItem.id.trim();
      if (seenIds.has(existingId)) {
        throw new InventoryDomainError("duplicate-item-id", "Dois itens persistidos possuem o mesmo ID.", {
          itemId: existingId
        });
      }
      seenIds.add(existingId);
      if (ignoreItemId && existingId === ignoreItemId) return;
      getOccupiedCells(existingItem, existingItem.posicao, existingItem.rotacao).forEach(function (cell) {
        const inside = cell.x >= 0
          && cell.y >= 0
          && cell.x < INVENTORY_CONFIG.columns
          && cell.y < INVENTORY_CONFIG.rows;
        if (!inside) {
          throw new InventoryDomainError("item-out-of-bounds", "O inventário atual possui um item fora dos limites.", {
            itemId: existingId,
            cell
          });
        }
        const key = cell.x + ":" + cell.y;
        if (occupiedByCell.has(key)) {
          throw new InventoryDomainError("inventory-collision", "O inventário atual já contém uma colisão.", {
            itemId: existingId,
            conflictingItemId: occupiedByCell.get(key),
            cell
          });
        }
        occupiedByCell.set(key, existingId);
      });
    });

    const collisionCell = cells.find(function (cell) {
      return occupiedByCell.has(cell.x + ":" + cell.y);
    });
    if (collisionCell) {
      return {
        valid: false,
        code: "invalid-position",
        detail: "collision",
        conflictingItemId: occupiedByCell.get(collisionCell.x + ":" + collisionCell.y),
        cells,
        dimensions
      };
    }

    return {
      valid: true,
      code: "valid",
      detail: null,
      cells,
      dimensions
    };
  }

  function findAvailablePosition(items, item, options) {
    const settings = options && isPlainObject(options) ? options : {};
    const rotation = normalizeRotation(
      settings.rotation,
      isPlainObject(item) && item.rotacao !== undefined ? item.rotacao : 0
    );
    const dimensions = getEffectiveDimensions(item, rotation);

    if (dimensions.largura > INVENTORY_CONFIG.columns || dimensions.altura > INVENTORY_CONFIG.rows) {
      return null;
    }

    for (let y = 0; y <= INVENTORY_CONFIG.rows - dimensions.altura; y += 1) {
      for (let x = 0; x <= INVENTORY_CONFIG.columns - dimensions.largura; x += 1) {
        const result = canPlaceItem(items, item, { x, y }, settings);
        if (result.valid) return { x, y };
      }
    }
    return null;
  }

  function hasAvailablePosition(items, item, options) {
    return findAvailablePosition(items, item, options) !== null;
  }

  function getInventoryPlacementAvailability(items, item, options) {
    const settings = options && isPlainObject(options) ? options : {};
    const rotation = normalizeRotation(
      settings.rotation,
      isPlainObject(item) && item.rotacao !== undefined ? item.rotacao : 0
    );
    const dimensions = getEffectiveDimensions(item, rotation);

    if (dimensions.largura > INVENTORY_CONFIG.columns || dimensions.altura > INVENTORY_CONFIG.rows) {
      return {
        available: false,
        code: "item-too-large",
        position: null,
        dimensions
      };
    }

    const position = findAvailablePosition(items, item, settings);
    if (!position) {
      return {
        available: false,
        code: "no-space-available",
        position: null,
        dimensions
      };
    }

    return {
      available: true,
      code: "available",
      position,
      dimensions
    };
  }

  function isRecognizableLegacyItem(data) {
    if (typeof data === "string") return data.trim().length > 0;
    if (!isPlainObject(data)) return false;
    const name = data.nome !== undefined ? data.nome : data.name;
    return typeof name === "string" && name.trim().length > 0;
  }

  function normalizeSheetVersion(sheetVersion) {
    if (sheetVersion === undefined || sheetVersion === null) return 1;
    if (sheetVersion !== 1 && sheetVersion !== 2 && sheetVersion !== "1" && sheetVersion !== "2") {
      throw new InventoryDomainError("unsupported-sheet-version", "A versão da ficha não é compatível com este inventário.");
    }
    return sheetVersion === 1 || sheetVersion === "1" ? 1 : 2;
  }

  function migrateLegacyInventory(data, settings) {
    const migratedItems = [];
    const usedIds = new Set();

    data.forEach(function (legacyItem, index) {
      if (!isRecognizableLegacyItem(legacyItem)) {
        throw new InventoryDomainError("unrecognized-legacy-item", "Um item legado não pôde ser reconhecido.", { index });
      }

      const definition = normalizeItemDefinition(legacyItem, {
        allowLegacyString: true,
        allowDefaultSize: true
      });
      const id = createInventoryItemId(settings.idFactory, usedIds);
      const candidate = {
        id,
        item: definition,
        posicao: { x: 0, y: 0 },
        rotacao: 0
      };
      const availability = getInventoryPlacementAvailability(migratedItems, candidate, { rotation: 0 });
      if (!availability.available) {
        throw new InventoryDomainError(
          availability.code,
          "Um item legado não pôde ser posicionado na mochila.",
          { index }
        );
      }

      usedIds.add(id);
      candidate.posicao = availability.position;
      migratedItems.push(candidate);
    });

    return migratedItems;
  }

  function migrateVersionTwoInventory(data, settings) {
    const normalizedItems = [];
    const usedIds = new Set();

    data.forEach(function (rawItem, index) {
      let normalizedItem;
      try {
        normalizedItem = normalizeInventoryItem(rawItem, {
          idFactory: settings.idFactory,
          usedIds,
          preserveValidId: true
        });
      } catch (error) {
        if (error instanceof InventoryDomainError && !error.details) error.details = { index };
        throw error;
      }

      const placement = canPlaceItem(normalizedItems, normalizedItem, normalizedItem.posicao, {
        rotation: normalizedItem.rotacao,
        ignoreItemId: normalizedItem.id
      });
      if (!placement.valid) {
        throw new InventoryDomainError(placement.code, "Um item da ficha v2 possui posicionamento inválido.", {
          index,
          detail: placement.detail
        });
      }
      normalizedItems.push(normalizedItem);
    });

    return normalizedItems;
  }

  function migrateInventory(data, sheetVersion, options) {
    const version = normalizeSheetVersion(sheetVersion);
    if (data === undefined || data === null) return [];
    const inventory = normalizeItemsArray(data);
    const settings = options && isPlainObject(options) ? options : {};

    return version === 2
      ? migrateVersionTwoInventory(inventory, settings)
      : migrateLegacyInventory(inventory, settings);
  }

  return Object.freeze({
    INVENTORY_CONFIG,
    RARITY_CONFIG,
    ITEM_TYPE_CONFIG,
    InventoryDomainError,
    normalizeItemDefinition,
    normalizeInventoryItem,
    getEffectiveDimensions,
    getOccupiedCells,
    createOccupancyMatrix,
    canPlaceItem,
    findAvailablePosition,
    hasAvailablePosition,
    getInventoryPlacementAvailability,
    getUsedInventoryCells,
    createInventoryItemId,
    isRecognizableLegacyItem,
    migrateInventory
  });
});
