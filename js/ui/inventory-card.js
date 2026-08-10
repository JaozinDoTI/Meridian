(function exposeGrimorioInventoryCards(global) {
  "use strict";

  function createTextElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    element.textContent = text;
    return element;
  }

  function createItemCard({
    item,
    options = {},
    visual,
    rotation,
    format,
    symbol,
    createArt,
    formatWeight
  }) {
    const context = options.contexto || "grid";
    const variant = context === "bench"
      ? "bench"
      : context === "equipment"
        ? "equipment"
        : "spatial";
    const card = document.createElement("span");
    const eyebrow = document.createElement("span");
    const artField = document.createElement("span");
    const name = document.createElement("strong");
    const stat = document.createElement("span");
    const meta = document.createElement("span");
    const description = document.createElement("span");
    const properties = document.createElement("span");

    card.className = `inventory-card inventory-card--${context} item-card item-card--${variant} ${visual.raridade.cssClass}`;
    card.dataset.shape = variant === "bench" ? "presentation" : format.shape;
    card.dataset.density = options.density || (variant === "bench" ? "full" : format.density);
    card.dataset.rotation = String(rotation);
    card.dataset.itemSymbol = symbol;

    eyebrow.className = "inventory-card__eyebrow";
    eyebrow.append(
      createTextElement("span", "inventory-card__rarity", visual.raridade.label),
      createTextElement("span", "inventory-card__type", visual.tipo.label)
    );

    artField.className = "inventory-card__art-field item-card__art";
    artField.append(createArt(item, "inventory-card__art", { eager: options.eager, rotacao: rotation }));

    name.className = "inventory-card__name";
    name.textContent = item.item.nome;
    stat.className = "inventory-card__stat";
    stat.textContent = item.item.atributoPrincipal?.valor || formatWeight(item.item.peso);
    meta.className = "inventory-card__meta";

    if (variant === "bench") {
      meta.append(
        createTextElement("span", "inventory-card__dimensions", `${format.dimensoes.largura} × ${format.dimensoes.altura}`),
        createTextElement("span", "inventory-card__weight", formatWeight(item.item.peso))
      );
    } else {
      meta.textContent = `${format.dimensoes.largura} × ${format.dimensoes.altura} · ${formatWeight(item.item.peso)}`;
    }

    card.append(eyebrow, artField, name);
    if (variant !== "bench" || item.item.atributoPrincipal?.valor) card.append(stat);

    if (variant === "bench") {
      description.className = "inventory-card__description";
      description.textContent = item.item.descricao || "Sem descrição registrada.";
      properties.className = "inventory-card__properties";
      properties.textContent = (item.item.propriedades || []).slice(0, 3).join(" · ");
      card.append(description);
      if (properties.textContent) card.append(properties);
    }

    card.append(meta);
    if (Number(item.item.quantidade || 1) > 1) {
      card.append(createTextElement("b", "inventory-card__quantity", `×${item.item.quantidade}`));
    }
    return card;
  }

  global.GrimorioInventoryCards = Object.freeze({ createItemCard });
})(window);
