(function exposeGrimorioCreationView(global) {
  "use strict";

  function fillList(element, items) {
    element.replaceChildren();
    items.forEach(function appendItem(item) {
      const listItem = document.createElement("li");
      listItem.textContent = item;
      element.append(listItem);
    });
  }

  function fillInfoBlock(block, title, content) {
    block.hidden = !content;
    title.textContent = content ? content.nome : "";
    title.nextElementSibling.textContent = content ? content.descricao : "";
  }

  function createChoiceGroup(container, id, title, helpText) {
    const fieldset = document.createElement("fieldset");
    const legend = document.createElement("legend");
    const help = document.createElement("small");
    const list = document.createElement("div");
    const error = document.createElement("p");

    fieldset.id = id;
    fieldset.className = "species-choice-group";
    legend.textContent = title;
    help.textContent = helpText;
    list.className = "choice-list";
    error.id = `${id}-error`;
    error.className = "choice-error";
    error.setAttribute("aria-live", "polite");
    legend.append(help);
    fieldset.append(legend, list, error);
    container.append(fieldset);
    return list;
  }

  function createChoiceOption(list, type, name, value, labelText, checked, disabled) {
    const label = document.createElement("label");
    const input = document.createElement("input");
    const text = document.createElement("span");

    label.className = "choice-option";
    input.type = type;
    input.name = name;
    input.value = value;
    input.checked = checked;
    input.disabled = disabled;
    text.textContent = labelText;
    label.append(input, text);
    list.append(label);
  }

  function createClassSymbol(id, className, symbolPaths) {
    const namespace = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(namespace, "svg");
    const path = document.createElementNS(namespace, "path");
    const circle = document.createElementNS(namespace, "circle");
    const hasCustomSymbol = Object.prototype.hasOwnProperty.call(symbolPaths, id);
    const pathDefinition = hasCustomSymbol
      ? symbolPaths[id]
      : "M80 31 95 64l34 4-25 23 7 34-31-17-31 17 7-34-25-23 34-4z";

    svg.setAttribute("viewBox", "0 0 160 160");
    svg.setAttribute("focusable", "false");
    svg.setAttribute("aria-hidden", "true");
    if (className) svg.setAttribute("class", className);
    circle.setAttribute("cx", "80");
    circle.setAttribute("cy", "80");
    circle.setAttribute("r", "58");
    circle.setAttribute("fill", "none");
    circle.setAttribute("stroke", "currentColor");
    circle.setAttribute("stroke-width", "1");
    circle.setAttribute("stroke-dasharray", "3 8");
    circle.setAttribute("opacity", "0.34");
    path.setAttribute("d", pathDefinition);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "currentColor");
    path.setAttribute("stroke-width", "5");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");
    svg.append(circle, path);
    return svg;
  }

  function fillClassPanel(titleElement, descriptionElement, listElement, title, description, items) {
    titleElement.textContent = title;
    descriptionElement.textContent = description;
    listElement.replaceChildren();
    listElement.hidden = items.length === 0;

    items.forEach(function appendItem(item) {
      const listItem = document.createElement("li");
      listItem.textContent = item;
      listElement.append(listItem);
    });
  }

  global.GrimorioCreationView = Object.freeze({
    fillList,
    fillInfoBlock,
    createChoiceGroup,
    createChoiceOption,
    createClassSymbol,
    fillClassPanel
  });
})(window);
