(function exposeGrimorioJournalView(global) {
  "use strict";

  const callbacksByRoot = new WeakMap();
  const TYPE_CONFIG = Object.freeze({
    sessao: { label: "Sessão", icon: "sheet-icon-book" },
    descoberta: { label: "Descoberta", icon: "sheet-icon-star" },
    pendencia: { label: "Pendência", icon: "sheet-icon-hourglass" },
    nota: { label: "Nota", icon: "sheet-icon-feather" }
  });

  function createIcon(icon) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    svg.classList.add("sheet-icon");
    svg.setAttribute("aria-hidden", "true");
    use.setAttribute("href", "#" + icon);
    svg.append(use);
    return svg;
  }

  function typeConfig(type) {
    return TYPE_CONFIG[type] || TYPE_CONFIG.nota;
  }

  function pluralize(count, singular, plural) {
    return count + " " + (count === 1 ? singular : plural);
  }

  function entryExcerpt(entry) {
    if (entry.conteudo) return entry.conteudo.replace(/\s+/g, " ");
    return "Nenhum relato detalhado.";
  }

  function entryMeta(entry) {
    return [entry.data, entry.sessao].filter(Boolean).join(" · ") || "Nota avulsa";
  }

  function createEntryCard(entry, selectedId, newlyAddedId) {
    const config = typeConfig(entry.tipo);
    const button = document.createElement("button");
    const top = document.createElement("span");
    const type = document.createElement("span");
    const title = document.createElement("strong");
    const excerpt = document.createElement("p");
    const meta = document.createElement("small");

    button.type = "button";
    button.className = "journal-entry-card";
    button.dataset.journalEntryId = entry.id;
    button.setAttribute("aria-label", "Abrir registro " + entry.titulo);
    if (entry.id === selectedId) button.setAttribute("aria-current", "true");
    if (entry.id === newlyAddedId) button.classList.add("journal-entry-is-new");

    top.className = "journal-entry-card__top";
    type.className = "journal-entry-card__type";
    type.append(createIcon(config.icon), document.createTextNode(config.label));
    top.append(type);
    if (entry.fixado) {
      const pinned = document.createElement("span");
      pinned.className = "journal-entry-card__pinned";
      pinned.textContent = "Fixado";
      top.append(pinned);
    }
    title.textContent = entry.titulo;
    excerpt.textContent = entryExcerpt(entry);
    meta.textContent = entryMeta(entry);
    button.append(top, title, excerpt, meta);
    return button;
  }

  function renderTimeline(root, model) {
    const list = root.querySelector("#journal-entry-list");
    const empty = root.querySelector("#journal-empty");
    const noResults = root.querySelector("#journal-no-results");
    list.replaceChildren();

    const hasCollection = model.totalCount > 0;
    const hasResults = model.entries.length > 0;
    empty.hidden = hasCollection;
    noResults.hidden = !hasCollection || hasResults;
    list.hidden = !hasResults;

    if (!hasResults) return;
    const groups = global.GrimorioJournalDomain.agruparRegistros(model.entries);
    groups.forEach(function renderGroup(group) {
      const section = document.createElement("section");
      const heading = document.createElement("h3");
      const count = document.createElement("span");
      const cards = document.createElement("div");

      section.className = "journal-group";
      heading.className = "journal-group__heading";
      heading.textContent = group.rotulo;
      count.textContent = String(group.registros.length);
      heading.append(count);
      cards.className = "journal-group__cards";
      group.registros.forEach(function appendCard(entry) {
        cards.append(createEntryCard(entry, model.selectedId, model.newlyAddedId));
      });
      section.append(heading, cards);
      list.append(section);
    });
  }

  function renderReader(root, selectedEntry) {
    const empty = root.querySelector("#journal-reader-empty");
    const content = root.querySelector("#journal-reader-content");
    const body = root.querySelector("#journal-reader-body");
    const tags = root.querySelector("#journal-reader-tags");
    body.replaceChildren();
    tags.replaceChildren();

    empty.hidden = Boolean(selectedEntry);
    content.hidden = !selectedEntry;
    if (!selectedEntry) return;

    const config = typeConfig(selectedEntry.tipo);
    root.querySelector("#journal-reader-type").textContent = config.label;
    root.querySelector("#journal-reader-title").textContent = selectedEntry.titulo;
    root.querySelector("#journal-reader-meta").textContent = entryMeta(selectedEntry);
    root.querySelector("#journal-reader-pinned").hidden = !selectedEntry.fixado;
    root.querySelector("#journal-reader-pin").textContent = selectedEntry.fixado ? "Desfixar" : "Fixar";

    if (selectedEntry.conteudo) {
      selectedEntry.conteudo.split(/\n\s*\n/).forEach(function appendParagraph(block) {
        const paragraph = document.createElement("p");
        paragraph.textContent = block.trim();
        body.append(paragraph);
      });
    } else {
      const paragraph = document.createElement("p");
      paragraph.className = "journal-reader__empty-copy";
      paragraph.textContent = "Nenhum relato detalhado foi escrito para este registro.";
      body.append(paragraph);
    }

    selectedEntry.marcadores.forEach(function appendTag(tag) {
      const element = document.createElement("span");
      element.className = "journal-reader__tag";
      element.textContent = tag;
      tags.append(element);
    });
    tags.hidden = selectedEntry.marcadores.length === 0;
  }

  function ensureDelegation(root) {
    if (root.dataset.journalDelegated === "true") return;
    root.dataset.journalDelegated = "true";
    root.addEventListener("click", function handleJournalClick(event) {
      const callbacks = callbacksByRoot.get(root) || {};
      const card = event.target.closest("button[data-journal-entry-id]");
      if (card && root.contains(card)) {
        callbacks.onSelect?.(card.dataset.journalEntryId, card);
        return;
      }
      const emptyAction = event.target.closest("button[data-journal-empty-action]");
      if (emptyAction?.dataset.journalEmptyAction === "create") callbacks.onCreate?.(emptyAction);
      if (emptyAction?.dataset.journalEmptyAction === "clear") callbacks.onClearFilters?.();
    });
  }

  function render(root, model, callbacks) {
    if (!root) return;
    callbacksByRoot.set(root, callbacks || {});
    ensureDelegation(root);
    root.classList.toggle("journal-has-entries", model.totalCount > 0);
    root.querySelector("#journal-count").textContent = pluralize(model.totalCount, "registro", "registros");
    root.querySelector("#journal-results-status").textContent = pluralize(model.entries.length, "registro encontrado", "registros encontrados");
    root.querySelector("#journal-clear-filters").hidden = !(model.query || model.typeFilter || model.pinnedOnly);
    renderTimeline(root, model);
    const selected = model.entries.find(function findSelected(entry) { return entry.id === model.selectedId; })
      || model.allEntries.find(function findSelectedFallback(entry) { return entry.id === model.selectedId; })
      || null;
    renderReader(root, selected);
  }

  function animateEntry(root) {
    if (!root || global.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    root.classList.remove("journal-is-entering");
    void root.offsetWidth;
    root.classList.add("journal-is-entering");
  }

  function animateSaved(root) {
    const reader = root?.querySelector("#journal-reader");
    if (!reader || global.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    reader.classList.remove("journal-reader-was-saved");
    void reader.offsetWidth;
    reader.classList.add("journal-reader-was-saved");
  }

  global.GrimorioJournalView = Object.freeze({ render, animateEntry, animateSaved });
})(window);
