const {
  ehObjetoDeDados,
  obterPersonagemDoArquivo
} = window.GrimorioImportExportDomain;

function renderizarFicha() {
  renderizarIdentidadeDaFicha();
  renderizarHistoriaDaFicha();
  window.GrimorioJournalController.render();
  renderizarCombateDaFicha();
  renderizarArmasDaFicha();
  renderizarRecursosDaFicha();
  renderizarAtributosDaFicha();
  renderizarPericiasDaFicha();
  renderizarHabilidadesDaFicha();
  renderizarInventario();
  renderizarVulnerabilidadeDaFicha();
  renderizarEstadoDeSalvamento();
}

function exibirFicha() {
  sheetSaveStatus.textContent = "";
  document.body.classList.add("sheet-is-open");
  creationView.hidden = true;
  landingView.hidden = true;
  characterSheetScreen.hidden = false;
  ativarSecaoDaFicha("summary");
  characterSheetTitle.focus();
}

function abrirFicha() {
  if (!validarAtributosEPericias()) return;

  if (fichaSalvaNaSessao === null) resetarSnapshotsDosAtributosDaFicha();
  prepararDadosIniciaisDaFicha();
  renderizarFicha();
  if (fichaSalvaNaSessao === null) {
    fichaSalvaNaSessao = JSON.stringify(criarEnvelopeDaFicha(), null, 2);
    fichaPossuiAlteracoes = false;
    atualizarEstadoDeSalvamento();
  } else if (fichaAtualDifereDaSalvaNaSessao()) {
    fichaPossuiAlteracoes = true;
    atualizarEstadoDeSalvamento();
  }
  exibirFicha();
}

function fecharFicha() {
  document.body.classList.remove("sheet-is-open");
  characterSheetScreen.hidden = true;
}

function voltarParaRevisao() {
  fecharFicha();
  landingView.hidden = true;
  creationView.hidden = false;
  creationNextButton.hidden = true;
  reviewSaveStatus.textContent = "";
  renderizarRevisaoProvisoria();
  atualizarEstadoDaEtapa(6);
  reviewStep.hidden = false;
  reviewStep.querySelector("#review-heading").focus();
}

function abrirEtapaRevisao() {
  if (!validarAtributosEPericias()) return;

  navegarComTransicao(reviewStep, "forward", function () {
    creationNextButton.hidden = true;
    reviewSaveStatus.textContent = "";
    renderizarRevisaoProvisoria();
    atualizarEstadoDaEtapa(6);
  }, "#review-heading");
}

let historiaAntesDaEdicao = "";
let acionadorDoEditorDaHistoria = originStoryOpen;
let editorDaHistoriaAbertoNaFicha = false;
const LIMITE_CARACTERES_HISTORIA = Number(originStoryInput.maxLength) || 20000;

function renderizarHistoriaDaFicha() {
  window.GrimorioHistoryView.render(sheetHistoryView, personagem, {
    especie: obterNomeDaEspecieComVariante(),
    classe: obterNomeDaClasseParaResumo()
  });
}

function contarPalavrasDaHistoria(valor) {
  const historia = String(valor || "").trim();
  return historia ? historia.split(/\s+/).length : 0;
}

function formatarContagemDePalavras(total) {
  return `${total} ${total === 1 ? "palavra" : "palavras"}`;
}

function atualizarResumoDaHistoria() {
  const historia = typeof personagem.origem.historia === "string"
    ? personagem.origem.historia.trim()
    : "";
  const contagem = formatarContagemDePalavras(contarPalavrasDaHistoria(historia));
  originStoryPreview.textContent = historia || "Nenhuma história escrita. Use o editor para desenvolver o passado, os vínculos e as motivações do personagem.";
  originStorySummaryCount.textContent = contagem;
  originStoryOpenLabel.textContent = historia ? "Editar história" : "Escrever história";
}

function atualizarContadorDaHistoria() {
  originStoryCounter.textContent = `${originStoryInput.value.length} / ${LIMITE_CARACTERES_HISTORIA}`;
  originStoryWordCount.textContent = formatarContagemDePalavras(contarPalavrasDaHistoria(originStoryInput.value));
}

function definirErroDaHistoria(mensagem) {
  definirErro(originStoryInput, originStoryError, mensagem);
  originStoryOpen.setAttribute("aria-invalid", mensagem ? "true" : "false");
}

function definirPerguntaDeInspiracao(pergunta) {
  const texto = typeof pergunta === "string" ? pergunta.trim() : "";
  originStoryPromptText.textContent = texto;
  originStoryPromptContext.hidden = !texto;
}

function limparPerguntaDeInspiracao() {
  definirPerguntaDeInspiracao("");
}

function restaurarOrigem() {
  originTitleInput.value = personagem.origem.titulo;
  originPlaceInput.value = personagem.origem.local;
  originStoryInput.value = personagem.origem.historia;
  definirErro(originTitleInput, originTitleError, "");
  definirErro(originPlaceInput, originPlaceError, "");
  definirErroDaHistoria("");
  atualizarContadorDaHistoria();
  atualizarResumoDaHistoria();
}

function atualizarOrigem() {
  personagem.origem.titulo = originTitleInput.value;
  personagem.origem.local = originPlaceInput.value;
  personagem.origem.historia = originStoryInput.value;
  atualizarContadorDaHistoria();
  atualizarResumoDaHistoria();
}

function atualizarHistoriaDaOrigem() {
  personagem.origem.historia = originStoryInput.value;
  atualizarContadorDaHistoria();
  atualizarResumoDaHistoria();
}

function abrirEditorDaHistoria(acionador, perguntaDeInspiracao = "") {
  if (originStoryDialog.open) {
    definirPerguntaDeInspiracao(perguntaDeInspiracao);
    originStoryInput.focus();
    return;
  }

  acionadorDoEditorDaHistoria = acionador && typeof acionador.focus === "function"
    ? acionador
    : originStoryOpen;
  editorDaHistoriaAbertoNaFicha = !characterSheetScreen.hidden;
  historiaAntesDaEdicao = personagem.origem.historia;
  originStoryInput.value = personagem.origem.historia;
  definirPerguntaDeInspiracao(perguntaDeInspiracao);
  atualizarContadorDaHistoria();
  document.body.classList.add("origin-story-is-open");
  originStoryDialog.showModal();
  originStoryInput.focus();
}

function fecharEditorDaHistoria(resultado) {
  document.body.classList.remove("origin-story-is-open");
  limparPerguntaDeInspiracao();
  if (originStoryDialog.open) originStoryDialog.close(resultado);
  acionadorDoEditorDaHistoria.focus();
}

function salvarHistoriaDoEditor() {
  const historiaFoiAlterada = originStoryInput.value !== historiaAntesDaEdicao;
  atualizarHistoriaDaOrigem();
  definirErroDaHistoria("");
  if (editorDaHistoriaAbertoNaFicha) {
    renderizarHistoriaDaFicha();
    if (historiaFoiAlterada) {
      marcarFichaComoAlterada();
      window.GrimorioHistoryView.confirmarAtualizacao(sheetHistoryView);
    }
  }
  fecharEditorDaHistoria("save");
}

function cancelarEditorDaHistoria() {
  personagem.origem.historia = historiaAntesDaEdicao;
  originStoryInput.value = historiaAntesDaEdicao;
  atualizarContadorDaHistoria();
  atualizarResumoDaHistoria();
  fecharEditorDaHistoria("cancel");
}

function usarPerguntaDeInspiracao(pergunta) {
  abrirEditorDaHistoria(originStoryOpen, pergunta);
}

function validarOrigem() {
  atualizarOrigem();

  personagem.origem.titulo = personagem.origem.titulo.trim();
  personagem.origem.local = personagem.origem.local.trim();
  personagem.origem.historia = personagem.origem.historia.trim();
  restaurarOrigem();

  definirErro(originTitleInput, originTitleError, !personagem.origem.titulo ? "Dê um título para a Origem do personagem." : "");
  definirErro(originPlaceInput, originPlaceError, personagem.origem.local.length > 100 ? "O Local de Origem pode ter no máximo 100 caracteres." : "");
  definirErroDaHistoria(personagem.origem.historia.length > LIMITE_CARACTERES_HISTORIA ? "A história pode ter no máximo 20.000 caracteres." : "");

  const primeiroInvalido = [originTitleInput, originPlaceInput, originStoryInput].find(function (campo) {
    return campo.getAttribute("aria-invalid") === "true";
  });

  if (primeiroInvalido) {
    if (primeiroInvalido === originStoryInput) abrirEditorDaHistoria(originStoryOpen);
    primeiroInvalido.focus();
    return false;
  }

  return true;
}

function abrirEtapaClasse() {
  if (!validarEspecie()) {
    return;
  }

  navegarComTransicao(classStep, etapaAtual > 3 ? "backward" : "forward", function () {
    creationNextButton.hidden = false;
    renderizarCategoriasDeClasse();
    renderizarClasses();
    renderizarSimboloDaClasse();
    renderizarDetalhesDaClasse();
    atualizarEstadoDaEtapa(3);
  }, "#class-heading");
}

function abrirEtapaOrigem(direcao) {
  if (!validarClasse()) {
    return;
  }

  concederHabilidadesDaClasseSelecionada();

  navegarComTransicao(originStep, direcao || "forward", function () {
    creationNextButton.hidden = false;
    restaurarOrigem();
    atualizarEstadoDaEtapa(4);
  }, "#origin-heading");
}

function abrirEtapaAtributos(direcao) {
  if (!validarOrigem()) {
    return;
  }

  navegarComTransicao(attributesStep, direcao || "forward", function () {
    creationNextButton.hidden = false;
    ajustarAtributosPelaEspecieAtual();
    renderizarAtributos();
    renderizarPericias();
    selecionarAbaDosAtributos(abaDosAtributosAtual);
    atualizarEstadoDaEtapa(5);
  }, "#attributes-heading");
}

function voltarNaCriacao() {
  if (etapaAtual === 6) {
    abrirEtapaAtributos("backward");
    return;
  }

  if (etapaAtual === 5) {
    abrirEtapaOrigem("backward");
    return;
  }

  if (etapaAtual === 4) {
    abrirEtapaClasse();
    return;
  }

  if (etapaAtual === 3) {
    abrirEtapaEspecie(false);
    return;
  }

  if (etapaAtual === 2) {
    restaurarIdentidade();
    abrirEtapaIdentidade(true);
    return;
  }

  voltarParaInicio();
}

function avancarNaCriacao() {
  if (etapaAtual === 1) {
    abrirEtapaEspecie(true);
    return;
  }

  if (etapaAtual === 2) {
    abrirEtapaClasse();
    return;
  }

  if (etapaAtual === 3) {
    abrirEtapaOrigem();
    return;
  }

  if (etapaAtual === 4) {
    abrirEtapaAtributos();
    return;
  }

  if (etapaAtual === 5) {
    if (!validarAtributosEPericias()) return;
    abrirEtapaRevisao();
  }
}

function abrirSeletorDeArquivo() {
  fileInput.value = "";
  fileInput.click();
}

function aplicarPersonagemImportado(dadosImportados, versaoDaFicha) {
  const dadosNormalizados = JSON.parse(JSON.stringify(MODELO_PERSONAGEM));

  Object.keys(dadosNormalizados).forEach(function (campo) {
    if (!Object.prototype.hasOwnProperty.call(dadosImportados, campo)) return;

    const valorPadrao = dadosNormalizados[campo];
    const valorImportado = dadosImportados[campo];

    if (Array.isArray(valorPadrao)) {
      if (campo === "inventario") {
        dadosNormalizados[campo] = JSON.parse(JSON.stringify(valorImportado));
        return;
      }

      if (campo === "vinculos") {
        dadosNormalizados[campo] = valorImportado === undefined
          ? undefined
          : JSON.parse(JSON.stringify(valorImportado));
        return;
      }

      if (campo === "registros") {
        dadosNormalizados[campo] = valorImportado === undefined
          ? undefined
          : JSON.parse(JSON.stringify(valorImportado));
        return;
      }

      dadosNormalizados[campo] = Array.isArray(valorImportado)
        ? JSON.parse(JSON.stringify(valorImportado))
        : valorPadrao;
      return;
    }

    if (ehObjetoDeDados(valorPadrao)) {
      if (!ehObjetoDeDados(valorImportado)) return;

      Object.keys(valorPadrao).forEach(function (subcampo) {
        if (Object.prototype.hasOwnProperty.call(valorImportado, subcampo)) {
          dadosNormalizados[campo][subcampo] = valorImportado[subcampo];
        }
      });
      return;
    }

    dadosNormalizados[campo] = valorImportado;
  });

  prepararDadosIniciaisDaFicha(dadosNormalizados, versaoDaFicha);

  Object.keys(personagem).forEach(function (campo) {
    delete personagem[campo];
  });
  Object.assign(personagem, dadosNormalizados);
  resetarEstadoTransitorioDoInventario();
}

async function selecionarArquivo(event) {
  const arquivo = event.target.files[0];
  if (!arquivo) return;

  if (!arquivo.name.toLowerCase().endsWith(".json")) {
    fileStatus.textContent = "Selecione um arquivo JSON válido.";
    return;
  }

  if (arquivo.size > 15 * 1024 * 1024) {
    fileStatus.textContent = "O arquivo excede o limite de 15 MB.";
    return;
  }

  fileStatus.textContent = "Carregando ficha...";
  importButton.disabled = true;
  importButton.setAttribute("aria-busy", "true");

  try {
    const conteudo = await arquivo.text();
    const dados = JSON.parse(conteudo);
    const fichaImportada = obterPersonagemDoArquivo(dados);

    aplicarPersonagemImportado(fichaImportada.personagem, fichaImportada.versao);
    resetarSnapshotsDosAtributosDaFicha();
    renderizarFicha();
    salvarFichaNaSessao(criarEnvelopeDaFicha(), false);

    fileStatus.textContent = `Ficha de ${personagem.nome || "personagem"} carregada.`;
    exibirFicha();
  } catch (erro) {
    fileStatus.textContent = erro instanceof SyntaxError
      ? "O arquivo não contém um JSON válido."
      : erro.message || "Não foi possível importar esta ficha.";
  } finally {
    importButton.disabled = false;
    importButton.removeAttribute("aria-busy");
  }
}

function mostrarAvisoDoMestre() {
  masterStatus.textContent = "O Editor do Mestre será implementado em uma próxima etapa.";
}
