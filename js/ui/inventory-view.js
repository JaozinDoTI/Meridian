(function exposeGrimorioInventoryView(global) {
  "use strict";

  function createInventoryView({
    domain,
    rarityConfig,
    itemTypeConfig,
    itemTypeSymbols,
    failedImages,
    createItemCard
  }) {
    function getVisualConfig(item) {
      const definition = item.item;
      return {
        raridade: rarityConfig[definition.raridade] || rarityConfig.comum,
        tipo: itemTypeConfig[definition.tipo] || itemTypeConfig.outro
      };
    }

    function getVisualSymbol(item) {
      return itemTypeSymbols[item.item.tipo] || itemTypeSymbols.outro;
    }

    function markImageAsFailed(address) {
      if (address) failedImages.add(address);
    }

    function configureArtOrientation(frame, item, rotation) {
      const dimensions = domain.getEffectiveDimensions(item, rotation);
      const rotated = rotation === 90;
      frame.dataset.itemRotation = String(rotation);
      frame.style.setProperty("--item-art-rotation", `${rotation}deg`);
      frame.style.setProperty(
        "--item-art-width-scale",
        String(rotated ? dimensions.altura / dimensions.largura : 1)
      );
      frame.style.setProperty(
        "--item-art-height-scale",
        String(rotated ? dimensions.largura / dimensions.altura : 1)
      );
    }

    async function preloadItemImage(item) {
      const address = item?.item?.imagem;
      if (!address || failedImages.has(address)) return false;

      const image = new Image();
      image.src = address;
      try {
        if (typeof image.decode === "function") {
          await image.decode();
        } else {
          await new Promise(function waitForImage(resolve, reject) {
            image.addEventListener("load", resolve, { once: true });
            image.addEventListener("error", reject, { once: true });
          });
        }
        return true;
      } catch (_error) {
        markImageAsFailed(address);
        return false;
      }
    }

    function createItemArt(item, className, options = {}) {
      const frame = document.createElement("span");
      const rotation = options.rotacao ?? item.rotacao ?? 0;
      frame.className = className || "sheet-inventory-item__art";
      frame.classList.add("inventory-item-art");
      frame.dataset.itemSymbol = getVisualSymbol(item);
      configureArtOrientation(frame, item, rotation);
      if (item.item.imagem && !failedImages.has(item.item.imagem)) {
        const image = document.createElement("img");
        image.src = item.item.imagem;
        image.alt = "";
        image.loading = options.eager ? "eager" : "lazy";
        image.decoding = "async";
        frame.classList.add("is-loading-image");
        image.addEventListener("load", function handleLoad() {
          frame.classList.remove("is-loading-image", "uses-fallback");
        }, { once: true });
        image.addEventListener("error", function handleError() {
          markImageAsFailed(item.item.imagem);
          image.remove();
          frame.classList.remove("is-loading-image");
          frame.classList.add("uses-fallback", "has-image-error");
        }, { once: true });
        frame.append(image);
      } else {
        frame.classList.add("uses-fallback");
      }
      return frame;
    }

    function getCardFormat(item, rotation = item.rotacao) {
      const dimensions = domain.getEffectiveDimensions(item, rotation);
      const area = dimensions.largura * dimensions.altura;
      return {
        shape: dimensions.largura > dimensions.altura
          ? "wide"
          : dimensions.altura > dimensions.largura
            ? "tall"
            : "square",
        density: area <= 1 ? "compact" : area <= 2 ? "slim" : area <= 3 ? "small" : "full",
        dimensoes: dimensions
      };
    }

    function updateCardFormat(element, item, rotation = item.rotacao) {
      if (!element) return;
      const format = getCardFormat(item, rotation);
      element.dataset.shape = format.shape;
      element.dataset.density = format.density;
      element.dataset.rotation = String(rotation);
    }

    function formatWeight(value) {
      return `${Number(value || 0).toLocaleString("pt-BR", { maximumFractionDigits: 2 })} kg`;
    }

    function createCard(item, options = {}) {
      const visual = getVisualConfig(item);
      const rotation = options.rotacao ?? item.rotacao ?? 0;
      const format = getCardFormat(item, rotation);
      return createItemCard({
        item,
        options,
        visual,
        rotation,
        format,
        symbol: getVisualSymbol(item),
        createArt: createItemArt,
        formatWeight
      });
    }

    function createTextElement(tag, className, text) {
      const element = document.createElement(tag);
      if (className) element.className = className;
      element.textContent = text;
      return element;
    }

    function createDetailRow(label, value) {
      const row = document.createElement("div");
      const term = document.createElement("dt");
      const description = document.createElement("dd");
      row.className = "sheet-inventory-details__row";
      term.textContent = label;
      description.textContent = value;
      row.append(term, description);
      return row;
    }

    return Object.freeze({
      getVisualConfig,
      configureArtOrientation,
      preloadItemImage,
      createItemArt,
      createCard,
      updateCardFormat,
      formatWeight,
      createTextElement,
      createDetailRow
    });
  }

  global.GrimorioInventoryView = Object.freeze({ createInventoryView });
})(window);
