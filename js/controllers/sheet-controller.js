function renderizarFicha() {
  renderizarIdentidadeDaFicha();
  renderizarCombateDaFicha();
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

function atualizarContadorDaHistoria() {
  originStoryCounter.textContent = `${originStoryInput.value.length} / 5000`;
}

function restaurarOrigem() {
  originTitleInput.value = personagem.origem.titulo;
  originPlaceInput.value = personagem.origem.local;
  originStoryInput.value = personagem.origem.historia;
  definirErro(originTitleInput, originTitleError, "");
  definirErro(originPlaceInput, originPlaceError, "");
  definirErro(originStoryInput, originStoryError, "");
  atualizarContadorDaHistoria();
}

function atualizarOrigem() {
  personagem.origem.titulo = originTitleInput.value;
  personagem.origem.local = originPlaceInput.value;
  personagem.origem.historia = originStoryInput.value;
  atualizarContadorDaHistoria();
}

function usarPerguntaDeInspiracao(pergunta) {
  if (!pergunta || originStoryInput.value.includes(pergunta)) {
    originStoryInput.focus();
    return;
  }

  const separador = originStoryInput.value.trim() ? "\n\n" : "";
  const proximaHistoria = `${originStoryInput.value}${separador}${pergunta}\n\n`;
  originStoryInput.value = proximaHistoria.slice(0, Number(originStoryInput.maxLength) || 5000);
  atualizarOrigem();
  definirErro(originStoryInput, originStoryError, "");
  originStoryInput.focus();
}

function validarOrigem() {
  atualizarOrigem();

  personagem.origem.titulo = personagem.origem.titulo.trim();
  personagem.origem.local = personagem.origem.local.trim();
  personagem.origem.historia = personagem.origem.historia.trim();
  restaurarOrigem();

  definirErro(originTitleInput, originTitleError, !personagem.origem.titulo ? "Dê um título para a Origem do personagem." : "");
  definirErro(originPlaceInput, originPlaceError, personagem.origem.local.length > 100 ? "O Local de Origem pode ter no máximo 100 caracteres." : "");
  definirErro(originStoryInput, originStoryError, !personagem.origem.historia || personagem.origem.historia.length < 20 ? "Conte um pouco mais sobre o passado do personagem." : personagem.origem.historia.length > 5000 ? "A história pode ter no máximo 5000 caracteres." : "");

  const primeiroInvalido = [originTitleInput, originPlaceInput, originStoryInput].find(function (campo) {
    return campo.getAttribute("aria-invalid") === "true";
  });

  if (primeiroInvalido) {
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

function ehObjetoDeDados(valor) {
  return valor !== null && typeof valor === "object" && !Array.isArray(valor);
}

function obterPersonagemDoArquivo(dados) {
  if (!ehObjetoDeDados(dados)) {
    throw new Error("O arquivo JSON não contém uma ficha válida.");
  }

  if (Object.prototype.hasOwnProperty.call(dados, "tipo")) {
    if (dados.tipo !== "grimorio-ficha") {
      throw new Error("Este JSON não é uma ficha do Grimório RPG.");
    }

    const versao = dados.versao === undefined || dados.versao === null
      ? 1
      : dados.versao;
    if (typeof versao === "number" && Number.isInteger(versao) && versao > 2) {
      throw new Error("Esta ficha foi criada em uma versão mais recente do Grimório RPG.");
    }

    if (typeof versao !== "number" || !Number.isInteger(versao) || (versao !== 1 && versao !== 2)) {
      throw new Error("A versão desta ficha não é compatível com o Grimório RPG.");
    }

    if (!ehObjetoDeDados(dados.personagem)) {
      throw new Error("O arquivo JSON não contém os dados da ficha.");
    }

    if (!ehObjetoDeDados(dados.personagem.atributos) || !ehObjetoDeDados(dados.personagem.pericias)) {
      throw new Error("O JSON não possui os dados necessários de uma ficha de personagem.");
    }

    return {
      personagem: dados.personagem,
      versao
    };
  }

  const dadosDoPersonagem = dados;

  if (!ehObjetoDeDados(dadosDoPersonagem.atributos) || !ehObjetoDeDados(dadosDoPersonagem.pericias)) {
    throw new Error("O JSON não possui os dados necessários de uma ficha de personagem.");
  }

  return {
    personagem: dadosDoPersonagem,
    versao: 1
  };
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
