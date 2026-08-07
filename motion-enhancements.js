(function iniciarMotionDoGrimorio() {
  "use strict";

  const consultaMovimentoReduzido = window.matchMedia("(prefers-reduced-motion: reduce)");
  const bibliotecaMotion = window.Motion;
  const animar = typeof bibliotecaMotion?.animate === "function"
    ? bibliotecaMotion.animate.bind(bibliotecaMotion)
    : null;

  const CLASSES_DE_FEEDBACK_DE_RECURSO = [
    "is-taking-damage",
    "is-being-healed",
    "is-spending-mana",
    "is-restoring-mana"
  ];

  const finalizadoresDeFeedbackDeRecurso = new WeakMap();
  const finalizadoresDeMudancaDeAtributo = new WeakMap();
  const cardsPreparados = new WeakSet();
  let frameDeAtualizacaoDosCards = null;

  function deveReduzirMovimento() {
    return consultaMovimentoReduzido.matches;
  }

  function executarAnimacao(elemento, propriedades, opcoes) {
    if (!animar || !elemento || deveReduzirMovimento()) return null;

    try {
      return animar(elemento, propriedades, opcoes);
    } catch (erro) {
      return null;
    }
  }

  function animarMudancaDeRecurso(card, classeSemantica) {
    if (!card || !CLASSES_DE_FEEDBACK_DE_RECURSO.includes(classeSemantica)) return;

    const finalizadorAnterior = finalizadoresDeFeedbackDeRecurso.get(card);
    if (finalizadorAnterior) {
      card.removeEventListener("animationend", finalizadorAnterior);
      finalizadoresDeFeedbackDeRecurso.delete(card);
    }

    card.classList.remove(...CLASSES_DE_FEEDBACK_DE_RECURSO);
    if (deveReduzirMovimento()) return;

    void card.offsetWidth;

    const percentual = card.querySelector(".sheet-resource-footer span");
    executarAnimacao(
      percentual,
      { opacity: [0.45, 1], scale: [0.96, 1] },
      { duration: 0.26, ease: "easeOut" }
    );

    function finalizarFeedback(event) {
      if (event.target !== card || event.pseudoElement !== "::after") return;
      card.classList.remove(classeSemantica);
      card.removeEventListener("animationend", finalizarFeedback);
      finalizadoresDeFeedbackDeRecurso.delete(card);
    }

    finalizadoresDeFeedbackDeRecurso.set(card, finalizarFeedback);
    card.addEventListener("animationend", finalizarFeedback);
    card.classList.add(classeSemantica);
  }

  function animarMudancaDeAtributo(card, classes) {
    if (!card || !card.classList) return;

    const finalizadorAnterior = finalizadoresDeMudancaDeAtributo.get(card);
    if (finalizadorAnterior) {
      card.removeEventListener("animationend", finalizadorAnterior.handler);
      card.removeEventListener("animationcancel", finalizadorAnterior.handler);
      card.classList.remove(...finalizadorAnterior.classes);
      finalizadoresDeMudancaDeAtributo.delete(card);
    }

    if (deveReduzirMovimento()) return;

    const classesAtivas = Array.isArray(classes)
      ? [...new Set(classes.filter(function (classe) {
        return typeof classe === "string" && classe.length > 0;
      }))]
      : [];
    if (classesAtivas.length === 0) return;

    function finalizarMudancaDeAtributo(event) {
      if (event.target !== card || event.animationName !== "attribute-state-sentinel") return;

      card.classList.remove(...classesAtivas);
      card.removeEventListener("animationend", finalizarMudancaDeAtributo);
      card.removeEventListener("animationcancel", finalizarMudancaDeAtributo);
      finalizadoresDeMudancaDeAtributo.delete(card);
    }

    finalizadoresDeMudancaDeAtributo.set(card, {
      handler: finalizarMudancaDeAtributo,
      classes: classesAtivas
    });
    card.addEventListener("animationend", finalizarMudancaDeAtributo);
    card.addEventListener("animationcancel", finalizarMudancaDeAtributo);
    card.classList.add(...classesAtivas);
  }

  function prepararCardInterativo(card) {
    if (!animar || !card || cardsPreparados.has(card)) return;

    cardsPreparados.add(card);
    card.addEventListener("pointerenter", function () {
      if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
      executarAnimacao(
        card,
        { y: -2, scale: 1.003 },
        { duration: 0.18, ease: "easeOut" }
      );
    });
    card.addEventListener("pointerleave", function () {
      executarAnimacao(
        card,
        { y: 0, scale: 1 },
        { duration: 0.2, ease: "easeOut" }
      );
    });
  }

  function prepararCardsInterativos(escopo) {
    const raiz = escopo || document;
    raiz.querySelectorAll(
      ".sheet-resource-card, .sheet-abilities-panel, .sheet-ability-summary-item"
    ).forEach(prepararCardInterativo);
  }

  function animarAberturaDaFicha() {
    if (!animar || deveReduzirMovimento()) return;

    const elementos = document.querySelectorAll([
      ".sheet-top-row:not([hidden]) > *",
      ".sheet-stats-row:not([hidden]) > *",
      ".sheet-middle-row:not([hidden]) > *",
      ".sheet-bottom-row:not([hidden]) > *"
    ].join(", "));

    elementos.forEach(function (elemento, indice) {
      executarAnimacao(
        elemento,
        { opacity: [0, 1], y: [8, 0] },
        { duration: 0.32, delay: indice * 0.025, ease: "easeOut" }
      );
    });
  }

  function observarFicha() {
    const telaDaFicha = document.querySelector("#character-sheet-screen");
    const sidebar = document.querySelector(".sheet-sidebar__nav");
    if (!telaDaFicha) return;

    prepararCardsInterativos(telaDaFicha);

    const observadorDeVisibilidade = new MutationObserver(function () {
      if (telaDaFicha.hidden) return;
      window.requestAnimationFrame(function () {
        prepararCardsInterativos(telaDaFicha);
        animarAberturaDaFicha();
      });
    });
    observadorDeVisibilidade.observe(telaDaFicha, {
      attributes: true,
      attributeFilter: ["hidden"]
    });

    const observadorDeCards = new MutationObserver(function () {
      if (frameDeAtualizacaoDosCards) return;
      frameDeAtualizacaoDosCards = window.requestAnimationFrame(function () {
        frameDeAtualizacaoDosCards = null;
        prepararCardsInterativos(telaDaFicha);
      });
    });
    observadorDeCards.observe(telaDaFicha, { childList: true, subtree: true });

    sidebar?.addEventListener("click", function (event) {
      const botao = event.target.closest("button[data-sheet-section]");
      executarAnimacao(
        botao,
        { scale: [0.985, 1] },
        { duration: 0.2, ease: "easeOut" }
      );
    });
  }

  window.GrimorioMotion = Object.freeze({
    animarAberturaDaFicha,
    animarMudancaDeAtributo,
    animarMudancaDeRecurso,
    deveReduzirMovimento,
    prepararCardsInterativos
  });

  if (bibliotecaMotion) {
    document.documentElement.classList.add("has-motion-library");
  }

  observarFicha();
})();
