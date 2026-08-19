(function exposeGrimorioAbilitiesView(global) {
  "use strict";

  function createTextElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    element.textContent = text;
    return element;
  }

  function createAbilityListCard({
    ability,
    state,
    selected,
    typeLabel,
    stateLabel,
    operation,
    createIcon
  }) {
    const button = document.createElement("button");
    const accent = document.createElement("span");
    const icon = document.createElement("span");
    const copy = document.createElement("span");
    const heading = document.createElement("span");
    const name = document.createElement("strong");
    const type = document.createElement("small");
    const action = document.createElement("span");
    const status = document.createElement("span");
    const operational = document.createElement("small");
    const stateBadge = document.createElement("span");
    const selectedMark = document.createElement("span");

    button.type = "button";
    button.className = `ability-list-card is-type-${ability.tipo} is-state-${state}`;
    button.classList.toggle("is-selected", selected);
    button.dataset.abilityId = ability.id;
    button.setAttribute("aria-controls", "sheet-ability-details");
    button.setAttribute("aria-pressed", String(selected));
    button.setAttribute("aria-label", `${ability.nome}, ${typeLabel}, ${stateLabel}`);

    accent.className = "ability-list-card__accent";
    accent.setAttribute("aria-hidden", "true");
    icon.className = "ability-list-card__icon";
    icon.append(createIcon(ability.iconeId));

    copy.className = "ability-list-card__copy";
    heading.className = "ability-list-card__heading";
    name.textContent = ability.nome;
    type.className = "ability-type-badge";
    type.textContent = typeLabel;
    heading.append(name, type);
    action.className = "ability-list-card__action";
    action.textContent = ability.acao || "Ação não informada";
    copy.append(heading, action);

    status.className = "ability-list-card__status";
    operational.className = "ability-list-card__operation";
    operational.textContent = operation;
    stateBadge.className = `ability-state-badge is-${state}`;
    stateBadge.textContent = stateLabel;
    status.append(operational, stateBadge);

    selectedMark.className = "ability-list-card__selected-mark";
    selectedMark.setAttribute("aria-hidden", "true");
    selectedMark.textContent = "◆";
    button.append(accent, icon, copy, status, selectedMark);
    return button;
  }

  function createEmptyState({ title, description, actionLabel = "", action = "" }) {
    const empty = document.createElement("div");
    const ornament = document.createElement("span");
    const heading = document.createElement("strong");
    const copy = document.createElement("p");
    empty.className = "abilities-empty-state";
    ornament.className = "abilities-empty-state__ornament";
    ornament.setAttribute("aria-hidden", "true");
    ornament.textContent = "✦";
    heading.textContent = title;
    copy.textContent = description;
    empty.append(ornament, heading, copy);
    if (actionLabel && action) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "sheet-primary-action abilities-empty-state__action";
      button.dataset.abilityEmptyAction = action;
      button.textContent = actionLabel;
      empty.append(button);
    }
    return empty;
  }

  function createDetailHeader({
    ability,
    state,
    typeLabel,
    stateLabel,
    createIcon
  }) {
    const header = document.createElement("header");
    const identity = document.createElement("div");
    const icon = document.createElement("span");
    const copy = document.createElement("div");
    const overline = document.createElement("div");
    const type = createTextElement("span", "ability-type-badge", typeLabel);
    const stateBadge = createTextElement("span", `ability-state-badge is-${state}`, stateLabel);
    const title = createTextElement("h2", "", ability.nome);
    const meta = document.createElement("div");
    const action = createTextElement("span", "", ability.acao || "Ação não informada");
    const attribute = createTextElement("span", "", ability.atributo ? ability.atributo.toUpperCase() : "Sem atributo associado");
    const actions = document.createElement("details");
    const actionsSummary = document.createElement("summary");
    const actionsMenu = document.createElement("div");
    const changeIcon = createTextElement("button", "", "Alterar ícone");
    const remove = createTextElement("button", "", "Remover habilidade");

    header.className = `ability-detail__header is-type-${ability.tipo}`;
    identity.className = "ability-detail__identity";
    icon.className = "ability-detail__icon";
    icon.append(createIcon(ability.iconeId));
    copy.className = "ability-detail__identity-copy";
    overline.className = "ability-detail__overline";
    overline.append(type, stateBadge);
    meta.className = "ability-detail__meta";
    action.dataset.meta = "acao";
    attribute.dataset.meta = "atributo";
    meta.append(action, attribute);
    copy.append(overline, title, meta);
    identity.append(icon, copy);

    actions.className = "ability-detail__actions";
    actionsSummary.textContent = "⋯";
    actionsSummary.setAttribute("aria-label", `Mais ações para ${ability.nome}`);
    actionsMenu.className = "ability-detail__actions-menu";
    changeIcon.type = "button";
    changeIcon.dataset.abilityAction = "change-icon";
    remove.type = "button";
    remove.dataset.abilityAction = "remove";
    if (ability.removivel === false) {
      remove.disabled = true;
      remove.title = "Habilidade concedida pela classe.";
      remove.setAttribute("aria-label", `${ability.nome} não pode ser removida porque foi concedida pela classe`);
    }
    actionsMenu.append(changeIcon, remove);
    actions.append(actionsSummary, actionsMenu);

    header.append(identity, actions);
    return header;
  }

  function createMechanicCell({ label, value = "—", iconId = "", createIcon, lines = [] }) {
    const cell = document.createElement("section");
    const heading = document.createElement("header");
    const title = createTextElement("h3", "", label);
    cell.className = "ability-mechanic";
    if (iconId && createIcon) {
      const icon = document.createElement("span");
      icon.className = "ability-mechanic__icon";
      icon.append(createIcon(iconId));
      heading.append(icon);
    }
    heading.append(title);
    cell.append(heading);
    if (lines.length) {
      const list = document.createElement("dl");
      lines.forEach(function (line) {
        const row = document.createElement("div");
        row.append(
          createTextElement("dt", "", line.label),
          createTextElement("dd", "", line.value || "—")
        );
        list.append(row);
      });
      cell.append(list);
    } else {
      cell.append(createTextElement("strong", "ability-mechanic__value", value || "—"));
    }
    return cell;
  }

  function createTextSection({ title, content, variant }) {
    const items = Array.isArray(content) ? content : [];
    const text = Array.isArray(content) ? "" : String(content ?? "").trim();
    if (!items.length && !text) return null;
    const section = document.createElement("section");
    section.className = `ability-detail-section ability-detail-section--${variant}`;
    section.append(createTextElement("h3", "", title));
    if (Array.isArray(content)) {
      const list = document.createElement("ul");
      content.forEach(function (item) {
        list.append(createTextElement("li", "", item));
      });
      section.append(list);
    } else {
      section.append(createTextElement("p", "", text));
    }
    return section;
  }

  function createLedgerItem({ label, value, subtitle, iconId, createIcon }) {
    const item = document.createElement("div");
    const icon = document.createElement("span");
    const copy = document.createElement("span");
    item.className = "abilities-ledger__item";
    icon.className = "abilities-ledger__icon";
    icon.append(createIcon(iconId));
    copy.className = "abilities-ledger__copy";
    copy.append(
      createTextElement("small", "", label),
      createTextElement("strong", "", value)
    );
    if (subtitle) copy.append(createTextElement("span", "", subtitle));
    item.append(icon, copy);
    return item;
  }

  global.GrimorioAbilitiesView = Object.freeze({
    createAbilityListCard,
    createEmptyState,
    createDetailHeader,
    createMechanicCell,
    createTextSection,
    createLedgerItem
  });
})(window);
