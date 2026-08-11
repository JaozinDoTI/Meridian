(function exposeGrimorioHistoryView(global) {
  "use strict";

  function normalizarTexto(valor) {
    return typeof valor === "string" ? valor.trim() : "";
  }

  function contarPalavras(valor) {
    const texto = normalizarTexto(valor);
    return texto ? texto.split(/\s+/).length : 0;
  }

  function preencher(root, seletor, valor) {
    const elemento = root.querySelector(seletor);
    if (elemento) elemento.textContent = valor;
  }

  function render(root, personagem, contexto) {
    if (!root || !personagem) return;

    const origem = personagem.origem || {};
    const historia = normalizarTexto(origem.historia);
    const totalDePalavras = contarPalavras(historia);
    const minutosDeLeitura = totalDePalavras ? Math.max(1, Math.ceil(totalDePalavras / 200)) : 0;
    const local = normalizarTexto(origem.local);
    const nome = normalizarTexto(personagem.nome);
    const titulo = normalizarTexto(origem.titulo);
    const legenda = [local, nome].filter(Boolean).join(" · ");

    preencher(root, "#sheet-history-character-name", nome || "Sem nome");
    preencher(root, "#sheet-history-origin-place", local || "Não informado");
    preencher(root, "#sheet-history-species-name", contexto?.especie || "Não definida");
    preencher(root, "#sheet-history-class-name", contexto?.classe || "Não definida");
    preencher(root, "#sheet-history-word-count", String(totalDePalavras));
    preencher(root, "#sheet-history-reading-time", minutosDeLeitura ? `${minutosDeLeitura} min de leitura` : "Sem tempo de leitura");
    preencher(root, "#sheet-history-origin-title", titulo || "História sem título");
    preencher(root, "#sheet-history-origin-caption", legenda || "Origem ainda não definida");

    const conteudo = root.querySelector("#sheet-history-content");
    const vazio = root.querySelector("#sheet-history-empty");
    conteudo.replaceChildren();
    if (historia) {
      historia.split(/\n\s*\n/).forEach(function criarParagrafo(bloco) {
        const paragrafo = document.createElement("p");
        paragrafo.textContent = bloco.trim();
        conteudo.append(paragrafo);
      });
    }
    conteudo.hidden = !historia;
    vazio.hidden = Boolean(historia);
  }

  function reiniciarAnimacao(elemento, classe) {
    if (!elemento || global.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    elemento.classList.remove(classe);
    void elemento.offsetWidth;
    elemento.classList.add(classe);
  }

  function animarEntrada(root) {
    reiniciarAnimacao(root, "history-is-entering");
  }

  function confirmarAtualizacao(root) {
    reiniciarAnimacao(root?.querySelector("#sheet-history-content"), "history-was-updated");
  }

  global.GrimorioHistoryView = Object.freeze({
    render,
    animarEntrada,
    confirmarAtualizacao
  });
})(window);
