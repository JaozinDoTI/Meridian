const { criarNomeSeguroParaArquivo } = window.GrimorioImportExportDomain;
const dominioDoPersonagem = window.GrimorioCharacterDomain;
const dominioDasHabilidadesDeClasse = window.GrimorioClassAbilitiesDomain;
const { normalizarAtributo, formatarModificador } = dominioDoPersonagem;
const {
  fillList: preencherLista,
  fillInfoBlock: preencherBloco,
  createChoiceOption: criarOpcao
} = window.GrimorioCreationView;

function podeUsarTilt() {
  return consultaPonteiroPreciso.matches && !deveReduzirMovimento();
}

function prepararCardInterativo(card, seletorDoSimbolo) {
  card.classList.add("interactive-card");
  card.style.setProperty("--tilt-x", "0deg");
  card.style.setProperty("--tilt-y", "0deg");
  card.style.setProperty("--pointer-x", "50%");
  card.style.setProperty("--pointer-y", "50%");
  card.style.setProperty("--card-lift", "0px");
  card.style.setProperty("--symbol-x", "0px");
  card.style.setProperty("--symbol-y", "0px");

  const simbolo = seletorDoSimbolo ? card.querySelector(seletorDoSimbolo) : null;
  if (simbolo) {
    simbolo.classList.add("interactive-card__symbol");
  }
}

function restaurarTilt(card) {
  card.classList.remove("is-tilting");
  card.style.removeProperty("will-change");
  card.style.setProperty("--tilt-x", "0deg");
  card.style.setProperty("--tilt-y", "0deg");
  card.style.setProperty("--pointer-x", "50%");
  card.style.setProperty("--pointer-y", "50%");
  card.style.setProperty("--card-lift", "0px");
  card.style.setProperty("--symbol-x", "0px");
  card.style.setProperty("--symbol-y", "0px");
}

function ativarTiltNoCard(card, seletorDoSimbolo) {
  prepararCardInterativo(card, seletorDoSimbolo);

  if (card.dataset.tiltEnabled === "true" || !podeUsarTilt()) {
    return;
  }

  let framePendente = null;
  let ultimoEvento = null;

  function atualizar() {
    framePendente = null;

    if (!ultimoEvento) {
      return;
    }

    const rect = card.getBoundingClientRect();
    const x = Math.min(Math.max(ultimoEvento.clientX - rect.left, 0), rect.width);
    const y = Math.min(Math.max(ultimoEvento.clientY - rect.top, 0), rect.height);
    const percentualX = rect.width ? x / rect.width : 0.5;
    const percentualY = rect.height ? y / rect.height : 0.5;
    const rotacaoY = (percentualX - 0.5) * 12;
    const rotacaoX = (0.5 - percentualY) * 10;
    const deslocamentoX = (percentualX - 0.5) * 3.6;
    const deslocamentoY = (percentualY - 0.5) * 3.2;

    card.style.setProperty("--tilt-x", `${rotacaoX.toFixed(2)}deg`);
    card.style.setProperty("--tilt-y", `${rotacaoY.toFixed(2)}deg`);
    card.style.setProperty("--pointer-x", `${(percentualX * 100).toFixed(1)}%`);
    card.style.setProperty("--pointer-y", `${(percentualY * 100).toFixed(1)}%`);
    card.style.setProperty("--symbol-x", `${deslocamentoX.toFixed(2)}px`);
    card.style.setProperty("--symbol-y", `${deslocamentoY.toFixed(2)}px`);
  }

  function aoEntrar() {
    card.classList.add("is-tilting");
    card.style.setProperty("--card-lift", "-2px");
  }

  function aoMover(event) {
    ultimoEvento = event;

    if (!framePendente) {
      framePendente = requestAnimationFrame(atualizar);
    }
  }

  function aoSair() {
    ultimoEvento = null;

    if (framePendente) {
      cancelAnimationFrame(framePendente);
      framePendente = null;
    }

    restaurarTilt(card);
  }

  card.dataset.tiltEnabled = "true";
  card.addEventListener("pointerenter", aoEntrar);
  card.addEventListener("pointermove", aoMover);
  card.addEventListener("pointerleave", aoSair);
  card.addEventListener("pointercancel", aoSair);
}

function ativarMicrointeracoes(raiz) {
  const escopo = raiz || document;
  escopo.querySelectorAll(".action-card").forEach(function (card) {
    ativarTiltNoCard(card, ".compass-icon, .file-icon");
  });
  escopo.querySelectorAll(".species-list-button").forEach(function (card) {
    ativarTiltNoCard(card, ".species-list-icon");
  });
  escopo.querySelectorAll(".class-card").forEach(function (card) {
    ativarTiltNoCard(card, ".class-card__icon");
  });
}

function animarSelecao(card) {
  if (!card || deveReduzirMovimento()) {
    return;
  }

  card.classList.remove("is-selecting");
  void card.offsetWidth;
  card.classList.add("is-selecting");
  card.addEventListener("animationend", function () {
    card.classList.remove("is-selecting");
  }, { once: true });
}

function trocarConteudoAnimado(elemento, atualizarConteudo, lateral) {
  if (!elemento || deveReduzirMovimento() || elemento.hidden) {
    atualizarConteudo();
    return;
  }

  elemento.classList.add("content-swap");
  if (lateral) {
    elemento.classList.add("content-swap--side");
  }
  elemento.classList.add("content-swap--leaving");

  window.setTimeout(function () {
    atualizarConteudo();
    elemento.classList.remove("content-swap--leaving");
    elemento.classList.add("content-swap--entering");
    elemento.addEventListener("animationend", function () {
      elemento.classList.remove("content-swap--entering", "content-swap--side");
    }, { once: true });
  }, 120);
}

function finalizarTransicaoDeEtapa(anterior) {
  if (temporizadorDaTransicaoDeEtapa) {
    window.clearTimeout(temporizadorDaTransicaoDeEtapa);
    temporizadorDaTransicaoDeEtapa = null;
  }

  etapasDaCriacao.forEach(function (etapa) {
    etapa.classList.remove(
      "stage-transition--enter-forward",
      "stage-transition--leave-forward",
      "stage-transition--enter-backward",
      "stage-transition--leave-backward"
    );
  });
  creationView.querySelector(".creation-body").classList.remove("is-transitioning");

  if (anterior) {
    anterior.hidden = true;
  }
}

const posicoesDeScrollDasEtapas = new WeakMap();

function navegarComTransicao(proximaEtapa, direcao, preparar, seletorDeFoco) {
  const anterior = etapasDaCriacao.find(function (etapa) {
    return !etapa.hidden;
  });
  const deveAnimar = anterior && anterior !== proximaEtapa && !deveReduzirMovimento();
  const corpo = creationView.querySelector(".creation-body");

  if (temporizadorDaTransicaoDeEtapa) {
    finalizarTransicaoDeEtapa(anterior);
  }

  if (anterior && anterior !== proximaEtapa) {
    posicoesDeScrollDasEtapas.set(anterior, anterior.scrollTop);
  }

  if (preparar) {
    preparar();
  }

  etapasDaCriacao.forEach(function (etapa) {
    if (etapa !== proximaEtapa && etapa !== anterior) {
      etapa.hidden = true;
    }
  });

  proximaEtapa.hidden = false;
  proximaEtapa.scrollTop = direcao === "backward"
    ? (posicoesDeScrollDasEtapas.get(proximaEtapa) || 0)
    : 0;

  if (deveAnimar) {
    corpo.classList.add("is-transitioning");
    anterior.classList.add(`stage-transition--leave-${direcao}`);
    proximaEtapa.classList.add(`stage-transition--enter-${direcao}`);
    temporizadorDaTransicaoDeEtapa = window.setTimeout(function () {
      finalizarTransicaoDeEtapa(anterior);
    }, 280);
  } else if (anterior && anterior !== proximaEtapa) {
    anterior.hidden = true;
  }

  if (seletorDeFoco) {
    const destinoDoFoco = document.querySelector(seletorDeFoco);
    if (destinoDoFoco) {
      destinoDoFoco.focus({ preventScroll: true });
    }
  }
}

function animarCardsDaCategoria(cards, tipo) {
  if (deveReduzirMovimento()) {
    return;
  }

  cards.forEach(function (card, indice) {
    card.classList.remove("stagger-enter", "page-enter-next", "page-enter-prev");
    card.style.setProperty("--stagger-delay", `${indice * 35}ms`);

    if (tipo === "page-next") {
      card.classList.add("page-enter-next");
      return;
    }

    if (tipo === "page-prev") {
      card.classList.add("page-enter-prev");
      return;
    }

    card.classList.add("stagger-enter");
  });
}

function esconderArteDaEspecie() {
  const transicaoAtual = ++transicaoDaArteDaEspecie;

  speciesVisual.classList.remove("has-character-art");
  speciesCharacterArt.classList.remove("is-visible");

  if (speciesCharacterArt.hidden) {
    speciesCharacterArt.removeAttribute("src");
    speciesCharacterArt.alt = "";
    speciesSymbol.hidden = false;
    return;
  }

  speciesSymbol.hidden = false;

  if (deveReduzirMovimento()) {
    speciesCharacterArt.hidden = true;
    speciesCharacterArt.removeAttribute("src");
    speciesCharacterArt.alt = "";
    speciesCharacterArt.classList.remove("is-leaving");
    return;
  }

  speciesCharacterArt.classList.add("is-leaving");
  speciesCharacterArt.addEventListener("transitionend", function finalizar(event) {
    if (event.propertyName !== "opacity") {
      return;
    }

    speciesCharacterArt.removeEventListener("transitionend", finalizar);

    if (transicaoAtual !== transicaoDaArteDaEspecie) {
      return;
    }

    speciesCharacterArt.hidden = true;
    speciesCharacterArt.removeAttribute("src");
    speciesCharacterArt.alt = "";
    speciesCharacterArt.classList.remove("is-leaving");
  });
}

function mostrarArteDaEspecie(especie) {
  if (!especie || !especie.imagem) {
    esconderArteDaEspecie();
    return;
  }

  transicaoDaArteDaEspecie += 1;
  speciesSymbol.hidden = true;
  speciesCharacterArt.hidden = false;
  speciesCharacterArt.classList.remove("is-visible", "is-leaving");
  speciesCharacterArt.src = especie.imagem;
  speciesCharacterArt.alt = especie.imagemAlt || `RepresentaÃ§Ã£o de ${especie.nome}`;
  speciesVisual.classList.add("has-character-art");

  if (deveReduzirMovimento()) {
    speciesCharacterArt.classList.add("is-visible");
    return;
  }

  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      speciesCharacterArt.classList.add("is-visible");
    });
  });
}

function ativarMovimentoDaArteDaEspecie() {
  if (speciesVisual.dataset.artMotionEnabled === "true") {
    return;
  }

  let framePendente = null;
  let ultimoEvento = null;

  function atualizar() {
    framePendente = null;

    if (!ultimoEvento || !podeUsarTilt() || speciesCharacterArt.hidden) {
      return;
    }

    const rect = speciesVisual.getBoundingClientRect();
    const x = rect.width ? (ultimoEvento.clientX - rect.left) / rect.width : 0.5;
    const y = rect.height ? (ultimoEvento.clientY - rect.top) / rect.height : 0.5;
    const deslocamentoX = Math.max(-4, Math.min(4, (x - 0.5) * 8));
    const deslocamentoY = Math.max(-3, Math.min(3, (y - 0.5) * 6));

    speciesVisual.style.setProperty("--art-x", `${deslocamentoX.toFixed(2)}px`);
    speciesVisual.style.setProperty("--art-y", `${deslocamentoY.toFixed(2)}px`);
  }

  function mover(event) {
    if (!podeUsarTilt()) {
      return;
    }

    ultimoEvento = event;

    if (!framePendente) {
      framePendente = requestAnimationFrame(atualizar);
    }
  }

  function restaurar() {
    ultimoEvento = null;

    if (framePendente) {
      cancelAnimationFrame(framePendente);
      framePendente = null;
    }

    speciesVisual.style.setProperty("--art-x", "0px");
    speciesVisual.style.setProperty("--art-y", "0px");
  }

  speciesVisual.dataset.artMotionEnabled = "true";
  speciesVisual.addEventListener("pointermove", mover);
  speciesVisual.addEventListener("pointerleave", restaurar);
  speciesVisual.addEventListener("pointercancel", restaurar);
}

function obterEspecieSelecionada() {
  return especies.find(function (especie) {
    return especie.id === personagem.especie;
  }) || null;
}

function obterVarianteSelecionada(especie) {
  if (!especie || !personagem.varianteEspecie) {
    return null;
  }

  return especie.variantes.find(function (variante) {
    return variante.id === personagem.varianteEspecie;
  }) || null;
}

function obterClasseSelecionada() {
  return classes.find(function (classe) {
    return classe.id === personagem.classe;
  }) || null;
}

function abrirCriacao() {
  landingView.hidden = true;
  document.body.classList.remove("sheet-is-open");
  characterSheetScreen.hidden = true;
  creationView.hidden = false;
  restaurarIdentidade();
  abrirEtapaIdentidade(true);
}

function voltarParaInicio() {
  creationView.hidden = true;
  document.body.classList.remove("sheet-is-open");
  characterSheetScreen.hidden = true;
  landingView.hidden = false;
  createButton.focus();
}

function restaurarIdentidade() {
  characterNameInput.value = personagem.nome;
  playerNameInput.value = personagem.jogador;
  campaignNameInput.value = personagem.campanha;
  gameMasterInput.value = personagem.mestre;
  mostrarRetrato();
}

function atualizarPersonagem() {
  personagem.nome = characterNameInput.value;
  personagem.jogador = playerNameInput.value;
  personagem.campanha = campaignNameInput.value;
  personagem.mestre = gameMasterInput.value;
  atualizarTextoAlternativo();
}

function atualizarTextoAlternativo() {
  const nome = personagem.nome.trim();
  portraitPreview.alt = nome ? `Retrato de ${nome}` : "Retrato do personagem";
}

function abrirSeletorDeRetrato() {
  portraitInput.value = "";
  portraitInput.click();
}

function carregarImagemParaRecorte(arquivo) {
  return new Promise(function (resolve, reject) {
    const url = URL.createObjectURL(arquivo);
    const imagem = new Image();

    imagem.addEventListener("load", function () {
      URL.revokeObjectURL(url);
      resolve(imagem);
    }, { once: true });

    imagem.addEventListener("error", function () {
      URL.revokeObjectURL(url);
      reject(new Error("Não foi possível carregar esta imagem."));
    }, { once: true });

    imagem.src = url;
  });
}

function limitarPosicaoDoRecorte() {
  if (!estadoDoRecorteDoRetrato) return;

  const estado = estadoDoRecorteDoRetrato;
  const larguraDesenhada = estado.imagem.naturalWidth * estado.escala;
  const alturaDesenhada = estado.imagem.naturalHeight * estado.escala;
  const limiteX = CONFIGURACAO_RETRATO.larguraFinal - larguraDesenhada;
  const limiteY = CONFIGURACAO_RETRATO.alturaFinal - alturaDesenhada;

  estado.x = Math.min(0, Math.max(limiteX, estado.x));
  estado.y = Math.min(0, Math.max(limiteY, estado.y));
}

function renderizarRecorteDoRetrato() {
  if (!estadoDoRecorteDoRetrato) return;

  const contexto = portraitCropCanvas.getContext("2d");
  const estado = estadoDoRecorteDoRetrato;

  contexto.clearRect(0, 0, portraitCropCanvas.width, portraitCropCanvas.height);
  contexto.imageSmoothingEnabled = true;
  contexto.imageSmoothingQuality = "high";
  contexto.drawImage(
    estado.imagem,
    estado.x,
    estado.y,
    estado.imagem.naturalWidth * estado.escala,
    estado.imagem.naturalHeight * estado.escala
  );
}

function definirZoomDoRecorte(valor) {
  if (!estadoDoRecorteDoRetrato) return;

  const estado = estadoDoRecorteDoRetrato;
  const fator = Math.min(
    CONFIGURACAO_RETRATO.zoomMaximo,
    Math.max(1, Number(valor) / 100)
  );
  const centroNaImagemX = (CONFIGURACAO_RETRATO.larguraFinal / 2 - estado.x) / estado.escala;
  const centroNaImagemY = (CONFIGURACAO_RETRATO.alturaFinal / 2 - estado.y) / estado.escala;

  estado.escala = estado.escalaMinima * fator;
  estado.x = CONFIGURACAO_RETRATO.larguraFinal / 2 - centroNaImagemX * estado.escala;
  estado.y = CONFIGURACAO_RETRATO.alturaFinal / 2 - centroNaImagemY * estado.escala;
  limitarPosicaoDoRecorte();
  renderizarRecorteDoRetrato();

  portraitCropRange.value = String(Math.round(fator * 100));
  portraitCropZoomValue.value = `${Math.round(fator * 100)}%`;
  portraitCropZoomValue.textContent = portraitCropZoomValue.value;
}

function abrirEditorDeRecorte(imagem) {
  const escalaMinima = Math.max(
    CONFIGURACAO_RETRATO.larguraFinal / imagem.naturalWidth,
    CONFIGURACAO_RETRATO.alturaFinal / imagem.naturalHeight
  );

  estadoDoRecorteDoRetrato = {
    imagem,
    escalaMinima,
    escala: escalaMinima,
    x: (CONFIGURACAO_RETRATO.larguraFinal - imagem.naturalWidth * escalaMinima) / 2,
    y: (CONFIGURACAO_RETRATO.alturaFinal - imagem.naturalHeight * escalaMinima) / 2
  };

  portraitCropRange.value = "100";
  portraitCropZoomValue.value = "100%";
  portraitCropZoomValue.textContent = "100%";
  portraitCropStatus.textContent = `${imagem.naturalWidth} × ${imagem.naturalHeight} px | saída 640 × 800 px`;
  renderizarRecorteDoRetrato();
  document.body.classList.add("portrait-crop-is-open");
  portraitCropDialog.showModal();
  portraitCropCanvas.focus();
}

function fecharEditorDeRecorte() {
  if (portraitCropDialog.open) {
    portraitCropDialog.close();
  }
}

function aplicarRecorteDoRetrato() {
  if (!estadoDoRecorteDoRetrato) return;

  try {
    personagem.retrato = portraitCropCanvas.toDataURL(
      "image/webp",
      CONFIGURACAO_RETRATO.qualidadeWebp
    );
    portraitStatus.textContent = "Retrato ajustado para 640 × 800 px.";
    mostrarRetrato();
    fecharEditorDeRecorte();
  } catch (erro) {
    portraitCropStatus.textContent = "Não foi possível finalizar o recorte.";
  }
}

function iniciarArrasteDoRecorte(event) {
  if (!estadoDoRecorteDoRetrato || event.button !== 0) return;

  ponteiroDoRecorteDoRetrato = {
    id: event.pointerId,
    inicioX: event.clientX,
    inicioY: event.clientY,
    origemX: estadoDoRecorteDoRetrato.x,
    origemY: estadoDoRecorteDoRetrato.y
  };

  portraitCropCanvas.setPointerCapture(event.pointerId);
  portraitCropCanvas.classList.add("is-dragging");
}

function arrastarRecorte(event) {
  if (!estadoDoRecorteDoRetrato || ponteiroDoRecorteDoRetrato?.id !== event.pointerId) return;

  const retangulo = portraitCropCanvas.getBoundingClientRect();
  const fatorX = portraitCropCanvas.width / retangulo.width;
  const fatorY = portraitCropCanvas.height / retangulo.height;

  estadoDoRecorteDoRetrato.x = ponteiroDoRecorteDoRetrato.origemX
    + (event.clientX - ponteiroDoRecorteDoRetrato.inicioX) * fatorX;
  estadoDoRecorteDoRetrato.y = ponteiroDoRecorteDoRetrato.origemY
    + (event.clientY - ponteiroDoRecorteDoRetrato.inicioY) * fatorY;
  limitarPosicaoDoRecorte();
  renderizarRecorteDoRetrato();
}

function encerrarArrasteDoRecorte(event) {
  if (ponteiroDoRecorteDoRetrato?.id !== event.pointerId) return;

  if (portraitCropCanvas.hasPointerCapture(event.pointerId)) {
    portraitCropCanvas.releasePointerCapture(event.pointerId);
  }
  ponteiroDoRecorteDoRetrato = null;
  portraitCropCanvas.classList.remove("is-dragging");
}

function controlarRecortePeloTeclado(event) {
  if (!estadoDoRecorteDoRetrato) return;

  const deslocamento = event.shiftKey ? 32 : 12;
  const movimentos = {
    ArrowLeft: [deslocamento, 0],
    ArrowRight: [-deslocamento, 0],
    ArrowUp: [0, deslocamento],
    ArrowDown: [0, -deslocamento]
  };

  if (movimentos[event.key]) {
    event.preventDefault();
    estadoDoRecorteDoRetrato.x += movimentos[event.key][0];
    estadoDoRecorteDoRetrato.y += movimentos[event.key][1];
    limitarPosicaoDoRecorte();
    renderizarRecorteDoRetrato();
    return;
  }

  if (event.key === "+" || event.key === "=") {
    event.preventDefault();
    definirZoomDoRecorte(Number(portraitCropRange.value) + 10);
  } else if (event.key === "-") {
    event.preventDefault();
    definirZoomDoRecorte(Number(portraitCropRange.value) - 10);
  }
}

async function selecionarRetrato(event) {
  const arquivo = event.target.files[0];
  const formatosPermitidos = ["image/jpeg", "image/png", "image/webp"];

  if (!arquivo) {
    return;
  }

  if (!formatosPermitidos.includes(arquivo.type)) {
    portraitStatus.textContent = "Use uma imagem JPG, PNG ou WebP.";
    portraitInput.value = "";
    return;
  }

  if (arquivo.size > CONFIGURACAO_RETRATO.tamanhoMaximoArquivo) {
    portraitStatus.textContent = "A imagem deve ter no máximo 12 MB.";
    portraitInput.value = "";
    return;
  }

  portraitStatus.textContent = "Preparando imagem...";
  choosePortraitButton.disabled = true;

  try {
    const imagem = await carregarImagemParaRecorte(arquivo);
    portraitStatus.textContent = "";
    abrirEditorDeRecorte(imagem);
  } catch (erro) {
    portraitStatus.textContent = erro.message || "Não foi possível carregar esta imagem.";
  } finally {
    choosePortraitButton.disabled = false;
    portraitInput.value = "";
  }
}

function mostrarRetrato() {
  if (personagem.retrato) {
    portraitPreview.src = personagem.retrato;
    portraitPreview.hidden = false;
    portraitEmpty.hidden = true;
    removePortraitButton.hidden = false;
    choosePortraitButton.textContent = "Alterar imagem";
  } else {
    portraitPreview.hidden = true;
    portraitPreview.removeAttribute("src");
    portraitEmpty.hidden = false;
    removePortraitButton.hidden = true;
    choosePortraitButton.textContent = "Escolher imagem";
  }

  atualizarTextoAlternativo();
}

function removerRetrato() {
  personagem.retrato = null;
  portraitInput.value = "";
  portraitStatus.textContent = "";
  mostrarRetrato();
  choosePortraitButton.focus();
}

function definirErro(input, errorElement, mensagem) {
  errorElement.textContent = mensagem;
  input.setAttribute("aria-invalid", mensagem ? "true" : "false");
}

function validarIdentidade() {
  atualizarPersonagem();

  personagem.nome = personagem.nome.trim();
  personagem.jogador = personagem.jogador.trim();
  personagem.campanha = personagem.campanha.trim();
  personagem.mestre = personagem.mestre.trim();
  restaurarIdentidade();

  definirErro(characterNameInput, characterNameError, !personagem.nome ? "Informe o nome do personagem." : personagem.nome.length > 80 ? "O nome do personagem pode ter no máximo 80 caracteres." : "");
  definirErro(playerNameInput, playerNameError, !personagem.jogador ? "Informe o nome do jogador." : personagem.jogador.length > 80 ? "O nome do jogador pode ter no máximo 80 caracteres." : "");
  definirErro(campaignNameInput, campaignNameError, personagem.campanha.length > 120 ? "O nome da campanha pode ter no máximo 120 caracteres." : "");
  definirErro(gameMasterInput, gameMasterError, personagem.mestre.length > 120 ? "O nome do mestre pode ter no máximo 120 caracteres." : "");

  const primeiroInvalido = fields.find(function ([input]) {
    return input.getAttribute("aria-invalid") === "true";
  });

  if (primeiroInvalido) {
    primeiroInvalido[0].focus();
    return false;
  }

  return true;
}

function atualizarStepper(etapa) {
  const preenchimento = Math.max(0, ((etapa - 1) / 5) * 83.4);
  document.querySelector(".creation-stepper ol").style.setProperty("--stepper-fill", `${preenchimento}%`);

  creationSteps.forEach(function (step, index) {
    const numero = index + 1;
    step.classList.toggle("creation-step--active", numero === etapa);
    step.classList.toggle("creation-step--complete", numero < etapa);
    step.removeAttribute("aria-current");

    if (numero === etapa) {
      step.setAttribute("aria-current", "step");
    }
  });
}

function atualizarEstadoDaEtapa(etapa) {
  etapaAtual = etapa;
  stageLabel.textContent = `Etapa ${etapa} de 6`;
  stageProgressBar.style.width = `${(etapa / 6) * 100}%`;
  atualizarStepper(etapa);
  reviewActions.hidden = etapa !== 6;
  stageProgress.hidden = etapa === 6;
  if (etapa === 5) {
    atualizarEstadoDoBotaoDeRevisao();
  } else {
    creationNextButton.disabled = false;
    creationNextButton.setAttribute("aria-disabled", "false");
    stageHelper.textContent = "";
  }
}

function abrirEtapaIdentidade(moverFoco) {
  navegarComTransicao(identityStep, "backward", function () {
    creationNextButton.hidden = false;
    atualizarEstadoDaEtapa(1);
  }, moverFoco ? "#identity-heading" : "");
}

function abrirEtapaEspecie(validarEtapaAnterior) {
  if (validarEtapaAnterior && !validarIdentidade()) {
    return;
  }

  navegarComTransicao(speciesStep, validarEtapaAnterior ? "forward" : "backward", function () {
    creationNextButton.hidden = false;
    atualizarEstadoDaEtapa(2);
    renderizarEspecies();
    renderizarDetalhesDaEspecie();
    renderizarOpcoesDaEspecie();
  }, "#species-heading");
}

function renderizarEspecies() {
  speciesList.replaceChildren();

  especies.forEach(function (especie) {
    const button = document.createElement("button");
    const icon = document.createElement("span");
    const copy = document.createElement("span");
    const name = document.createElement("strong");
    const summary = document.createElement("small");
    const selected = document.createElement("span");
    const estaSelecionada = personagem.especie === especie.id;

    button.type = "button";
    button.className = "species-list-button";
    button.dataset.speciesId = especie.id;
    button.setAttribute("aria-pressed", estaSelecionada ? "true" : "false");
    icon.className = `species-list-icon species-list-icon--${especie.id}`;
    icon.setAttribute("aria-hidden", "true");
    copy.className = "species-list-button__copy";
    name.textContent = especie.nome;
    summary.textContent = especie.resumo;
    selected.className = "species-list-button__selected";
    selected.textContent = estaSelecionada ? "Selecionado" : "";

    copy.append(name, summary);
    button.append(icon, copy, selected);
    speciesList.append(button);
  });

  ativarMicrointeracoes(speciesList);
  animarCardsDaCategoria(Array.from(speciesList.querySelectorAll(".species-list-button")), "category");
}

function selecionarEspecie(id) {
  const especie = especies.find(function (item) {
    return item.id === id;
  });

  if (!especie) {
    return;
  }

  personagem.especie = id;
  personagem.varianteEspecie = null;
  personagem.atributosEspecie = [];
  personagem.afinidadeEspecie = id === "humano" || id === "quimerico" ? null : especie.afinidade;
  speciesError.textContent = "";
  renderizarEspecies();
  animarSelecao(speciesList.querySelector(`[data-species-id="${id}"]`));
  renderizarDetalhesDaEspecie(true);
  renderizarOpcoesDaEspecie();
}

function renderizarDetalhesDaEspecie(animarTroca) {
  const especie = obterEspecieSelecionada();

  if (!especie) {
    speciesSymbol.className = "species-symbol species-symbol--empty";
    speciesSymbolName.textContent = "Selecione uma espécie";
    esconderArteDaEspecie();
    speciesDetailsEmpty.hidden = false;
    speciesDetailsContent.hidden = true;
    return;
  }

  const variante = obterVarianteSelecionada(especie);
  const dados = variante ? Object.assign({}, especie, variante) : especie;

  if (animarTroca && !speciesDetailsContent.hidden) {
    if (especie.imagem) {
      mostrarArteDaEspecie(especie);
    } else {
      speciesSymbol.className = `species-symbol species-symbol--${especie.id}`;
      esconderArteDaEspecie();
    }

    trocarConteudoAnimado(speciesDetailsContent, function () {
      renderizarDetalhesDaEspecie(false);
    }, true);
    trocarConteudoAnimado(speciesSymbol, function () {}, false);
    return;
  }

  speciesSymbol.className = `species-symbol species-symbol--${especie.id}`;
  speciesSymbolName.textContent = variante ? `${especie.nome} — ${variante.nome}` : especie.nome;
  speciesDetailsEmpty.hidden = true;
  speciesDetailsContent.hidden = false;
  speciesDetailName.textContent = variante ? `${especie.nome} — ${variante.nome}` : especie.nome;
  speciesDetailSummary.textContent = especie.resumo;
  speciesDetailDescription.textContent = especie.descricao;
  preencherLista(speciesDetailModifiers, dados.atributos || []);
  speciesDetailAffinity.textContent = dados.afinidade || "Definida pelas escolhas da espécie";

  const fisicos = especie.fisicos || [];
  speciesPhysicalBlock.hidden = fisicos.length === 0;
  preencherLista(speciesDetailPhysical, fisicos);
  preencherBloco(speciesTraitBlock, speciesDetailTraitName, dados.traco);
  preencherBloco(speciesAbilityBlock, speciesDetailAbilityName, dados.habilidade);
  preencherBloco(speciesVulnerabilityBlock, speciesDetailVulnerabilityName, dados.vulnerabilidade);
  speciesStyleBlock.hidden = !especie.estilo;
  speciesDetailStyle.textContent = especie.estilo || "";
  mostrarArteDaEspecie(especie);
}

function criarGrupoDeEscolha(id, titulo, ajuda) {
  return window.GrimorioCreationView.createChoiceGroup(speciesOptions, id, titulo, ajuda);
}

function renderizarOpcoesDaEspecie() {
  const especie = obterEspecieSelecionada();
  speciesOptions.replaceChildren();
  speciesOptions.hidden = !especie || !["humano", "quimerico", "caldeano"].includes(especie.id);

  if (!especie || speciesOptions.hidden) {
    return;
  }

  if (especie.id === "humano") {
    const bonusList = criarGrupoDeEscolha("human-bonus-group", "Bônus de atributos", "Escolha dois atributos diferentes.");
    atributosDisponiveis.forEach(function (atributo) {
      const marcada = personagem.atributosEspecie.includes(atributo);
      const desabilitada = personagem.atributosEspecie.length >= 2 && !marcada;
      criarOpcao(bonusList, "checkbox", "human-bonus", atributo, atributo, marcada, desabilitada);
    });

    const affinityList = criarGrupoDeEscolha("human-affinity-group", "Afinidade — Potencial Aberto", "Escolha qualquer atributo.");
    atributosDisponiveis.forEach(function (atributo) {
      criarOpcao(affinityList, "radio", "human-affinity", atributo, atributo, personagem.afinidadeEspecie === atributo, false);
    });
    return;
  }

  if (especie.id === "quimerico") {
    const variantList = criarGrupoDeEscolha("variant-group", "Escolha sua Linhagem", "A Linhagem define seu atributo principal.");
    especie.variantes.forEach(function (variante) {
      criarOpcao(variantList, "radio", "species-variant", variante.id, variante.nome, personagem.varianteEspecie === variante.id, false);
    });

    const variante = obterVarianteSelecionada(especie);
    if (variante) {
      const attributeList = criarGrupoDeEscolha("quimeric-attribute-group", "Atributo adicional", `Não pode ser ${variante.principal}.`);
      atributosDisponiveis.forEach(function (atributo) {
        criarOpcao(attributeList, "radio", "quimeric-attribute", atributo, atributo, personagem.atributosEspecie[0] === atributo, atributo === variante.principal);
      });
    }
    return;
  }

  const formationList = criarGrupoDeEscolha("variant-group", "Escolha sua Formação", "A Formação define seus modificadores.");
  especie.variantes.forEach(function (variante) {
    criarOpcao(formationList, "radio", "species-variant", variante.id, variante.nome, personagem.varianteEspecie === variante.id, false);
  });
}

function selecionarVariante(id) {
  const especie = obterEspecieSelecionada();
  const variante = especie ? especie.variantes.find(function (item) { return item.id === id; }) : null;

  if (!variante) {
    return;
  }

  personagem.varianteEspecie = id;
  personagem.atributosEspecie = [];
  personagem.afinidadeEspecie = variante.afinidade || especie.afinidade;
  renderizarDetalhesDaEspecie(true);
  renderizarOpcoesDaEspecie();
}

function selecionarBonusHumano(atributo, selecionado) {
  if (selecionado && !personagem.atributosEspecie.includes(atributo) && personagem.atributosEspecie.length < 2) {
    personagem.atributosEspecie.push(atributo);
  }

  if (!selecionado) {
    personagem.atributosEspecie = personagem.atributosEspecie.filter(function (item) {
      return item !== atributo;
    });
  }

  renderizarOpcoesDaEspecie();
}

function selecionarAfinidade(atributo) {
  personagem.afinidadeEspecie = atributo;
}

function selecionarAtributoQuimerico(atributo) {
  const especie = obterEspecieSelecionada();
  const variante = obterVarianteSelecionada(especie);

  if (!variante || atributo === variante.principal) {
    return;
  }

  personagem.atributosEspecie = [atributo];
}

function focarGrupo(id, nomeDoInput) {
  const group = document.querySelector(`#${id}`);
  const input = group ? group.querySelector(`input[name="${nomeDoInput}"]:not(:disabled)`) : null;

  if (input) {
    input.focus();
  }
}

function validarEspecie() {
  speciesError.textContent = "";

  if (!personagem.especie) {
    speciesError.textContent = "Escolha uma espécie para continuar.";
    const primeiroBotao = speciesList.querySelector("button");
    if (primeiroBotao) primeiroBotao.focus();
    return false;
  }

  const especie = obterEspecieSelecionada();

  if (especie.id === "humano") {
    const bonusError = document.querySelector("#human-bonus-group-error");
    const affinityError = document.querySelector("#human-affinity-group-error");
    bonusError.textContent = personagem.atributosEspecie.length === 2 ? "" : "Escolha dois atributos diferentes.";
    affinityError.textContent = personagem.afinidadeEspecie ? "" : "Escolha uma afinidade.";

    if (bonusError.textContent) {
      focarGrupo("human-bonus-group", "human-bonus");
      return false;
    }
    if (affinityError.textContent) {
      focarGrupo("human-affinity-group", "human-affinity");
      return false;
    }
  }

  if (especie.id === "quimerico") {
    const variantError = document.querySelector("#variant-group-error");
    variantError.textContent = personagem.varianteEspecie ? "" : "Escolha uma linhagem.";
    if (variantError.textContent) {
      focarGrupo("variant-group", "species-variant");
      return false;
    }

    const attributeError = document.querySelector("#quimeric-attribute-group-error");
    attributeError.textContent = personagem.atributosEspecie.length === 1 ? "" : "Escolha o atributo adicional da linhagem.";
    if (attributeError.textContent) {
      focarGrupo("quimeric-attribute-group", "quimeric-attribute");
      return false;
    }
  }

  if (especie.id === "caldeano") {
    const variantError = document.querySelector("#variant-group-error");
    variantError.textContent = personagem.varianteEspecie ? "" : "Escolha uma formação.";
    if (variantError.textContent) {
      focarGrupo("variant-group", "species-variant");
      return false;
    }
  }

  return true;
}

function obterCategoriasVisiveis() {
  const categorias = categoriasDeClasse.slice();
  const possuiImportadas = classes.some(function (classe) { return classe.importada; });

  if (possuiImportadas) {
    categorias.push({ id: "importadas", rotulo: "Importadas", categoria: "Importadas" });
  }

  return categorias;
}

function obterClassesDaCategoria() {
  return classes.filter(function (classe) {
    return classe.categoria === categoriaDeClasseAtual;
  });
}

function renderizarCategoriasDeClasse() {
  classCategories.replaceChildren();

  obterCategoriasVisiveis().forEach(function (categoria) {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.classCategory = categoria.categoria;
    button.textContent = categoria.rotulo;
    button.setAttribute("aria-pressed", categoria.categoria === categoriaDeClasseAtual ? "true" : "false");
    classCategories.append(button);
  });
}

function selecionarCategoriaDeClasse(categoria) {
  const existe = obterCategoriasVisiveis().some(function (item) {
    return item.categoria === categoria;
  });

  if (!existe) {
    return;
  }

  categoriaDeClasseAtual = categoria;
  paginaDeClassesAtual = 1;
  renderizarCategoriasDeClasse();
  renderizarClasses("category");
}

function criarSimboloDaClasse(id, classeCss) {
  return window.GrimorioCreationView.createClassSymbol(id, classeCss, caminhosDosSimbolos);
}

function renderizarClasses(tipoDeEntrada) {
  const classesDaCategoria = obterClassesDaCategoria();
  const totalDePaginas = Math.max(1, Math.ceil(classesDaCategoria.length / 4));
  paginaDeClassesAtual = Math.min(paginaDeClassesAtual, totalDePaginas);
  const inicio = (paginaDeClassesAtual - 1) * 4;
  const classesDaPagina = classesDaCategoria.slice(inicio, inicio + 4);
  classList.replaceChildren();

  classesDaPagina.forEach(function (classe) {
    const button = document.createElement("button");
    const icon = document.createElement("span");
    const copy = document.createElement("span");
    const name = document.createElement("strong");
    const summary = document.createElement("small");
    const category = document.createElement("em");
    const selected = document.createElement("span");
    const estaSelecionada = personagem.classe === classe.id;

    button.type = "button";
    button.className = "class-card";
    button.dataset.classId = classe.id;
    button.setAttribute("aria-pressed", estaSelecionada ? "true" : "false");
    icon.className = "class-card__icon";
    icon.append(criarSimboloDaClasse(classe.id));
    copy.className = "class-card__copy";
    name.textContent = classe.nome;
    summary.textContent = classe.resumo;
    category.textContent = classe.categoria;
    selected.className = "class-card__selected";
    selected.textContent = estaSelecionada ? "Selecionado" : "";
    copy.append(name, summary, category);
    button.append(icon, copy, selected);
    classList.append(button);
  });

  ativarMicrointeracoes(classList);
  animarCardsDaCategoria(Array.from(classList.querySelectorAll(".class-card")), tipoDeEntrada || "category");

  classPageStatus.textContent = `${paginaDeClassesAtual} / ${totalDePaginas}`;
  classPagePrevious.disabled = paginaDeClassesAtual === 1;
  classPageNext.disabled = paginaDeClassesAtual === totalDePaginas;
  classPagePrevious.hidden = totalDePaginas === 1;
  classPageNext.hidden = totalDePaginas === 1;
}

function mudarPaginaDeClasses(direcao) {
  const totalDePaginas = Math.max(1, Math.ceil(obterClassesDaCategoria().length / 4));
  const novaPagina = paginaDeClassesAtual + direcao;

  if (novaPagina < 1 || novaPagina > totalDePaginas) {
    return;
  }

  paginaDeClassesAtual = novaPagina;
  renderizarClasses(direcao > 0 ? "page-next" : "page-prev");
  const primeiroCard = classList.querySelector("button");
  if (primeiroCard) primeiroCard.focus();
}

function selecionarClasse(id) {
  const classe = classes.find(function (item) { return item.id === id; });

  if (!classe) {
    return;
  }

  personagem.classe = classe.id;
  personagem.classeImportada = classe.importada === true;
  abaDeClasseAtual = "overview";
  classMessage.textContent = "";
  classMessage.removeAttribute("data-state");
  renderizarClasses("category");
  animarSelecao(classList.querySelector(`[data-class-id="${id}"]`));
  renderizarSimboloDaClasse(true);
  renderizarDetalhesDaClasse(true);
}

function concederHabilidadesDaClasseSelecionada() {
  const classe = obterClasseSelecionada();
  return dominioDasHabilidadesDeClasse.reconciliarHabilidadesDaClasse(
    personagem,
    classe,
    function (habilidade) {
      return window.GrimorioAbilitiesDomain.normalizarHabilidade(habilidade, {
        catalogoIcones: CATALOGO_ICONES_HABILIDADE
      });
    }
  );
}

function renderizarSimboloDaClasse(animarTroca) {
  if (animarTroca && classSymbol.childNodes.length) {
    trocarConteudoAnimado(classSymbol, function () {
      renderizarSimboloDaClasse(false);
    }, false);
    return;
  }

  const classe = obterClasseSelecionada();
  classSymbol.replaceChildren();

  if (!classe) {
    classSymbolName.textContent = "Selecione uma Classe";
    classSymbolMechanic.textContent = "Como você interage com o mundo";
    return;
  }

  const simbolo = criarSimboloDaClasse(classe.id);
  while (simbolo.firstChild) {
    classSymbol.append(simbolo.firstChild);
  }
  classSymbolName.textContent = classe.nome;
  classSymbolMechanic.textContent = classe.mecanica.nome;
}

function preencherPainelDaClasse(titulo, descricao, itens) {
  window.GrimorioCreationView.fillClassPanel(
    classPanelTitle,
    classPanelDescription,
    classPanelList,
    titulo,
    descricao,
    itens
  );
}

function selecionarAbaDaClasse(aba, moverFoco) {
  const classe = obterClasseSelecionada();
  const abasValidas = ["overview", "mechanic", "risk", "specializations"];

  if (!classe || !abasValidas.includes(aba)) {
    return;
  }

  abaDeClasseAtual = aba;
  classTabs.querySelectorAll("[role='tab']").forEach(function (button) {
    const ativa = button.dataset.classTab === aba;
    button.setAttribute("aria-selected", ativa ? "true" : "false");
    button.tabIndex = ativa ? 0 : -1;
    if (ativa) {
      classTabPanel.setAttribute("aria-labelledby", button.id);
      if (moverFoco) button.focus();
    }
  });

  if (aba === "overview") {
    preencherPainelDaClasse("Como interage com o mundo", classe.descricao, classe.focos.map(function (foco) { return `Foco: ${foco}`; }));
  }

  if (aba === "mechanic") {
    preencherPainelDaClasse(classe.mecanica.nome, classe.mecanica.descricao, classe.mecanica.usos || []);
  }

  if (aba === "risk") {
    preencherPainelDaClasse(classe.risco.nome, classe.risco.descricao, []);
  }

  if (aba === "specializations") {
    const especializacoes = classe.especializacoes || [];
    const descricao = especializacoes.length ? "Possibilidades futuras desta Classe. Nenhuma especialização é escolhida nesta etapa." : "As especializações desta Classe ainda serão definidas.";
    const itens = especializacoes.map(function (especializacao) {
      return `${especializacao.nome} — ${especializacao.descricao}`;
    });
    preencherPainelDaClasse("Especializações", descricao, itens);
  }
}

function animarEntradaDoPainelDaClasse() {
  if (deveReduzirMovimento()) {
    return;
  }

  classTabPanel.classList.remove("content-swap--entering");
  void classTabPanel.offsetWidth;
  classTabPanel.classList.add("content-swap", "content-swap--entering");
  classTabPanel.addEventListener("animationend", function () {
    classTabPanel.classList.remove("content-swap--entering");
  }, { once: true });
}

function renderizarDetalhesDaClasse(animarTroca) {
  const classe = obterClasseSelecionada();

  if (!classe) {
    classDetailsEmpty.hidden = false;
    classDetailsContent.hidden = true;
    return;
  }

  if (animarTroca && !classDetailsContent.hidden) {
    trocarConteudoAnimado(classDetailsContent, function () {
      renderizarDetalhesDaClasse(false);
    }, true);
    return;
  }

  classDetailsEmpty.hidden = true;
  classDetailsContent.hidden = false;
  classDetailCategory.textContent = classe.categoria;
  classDetailName.textContent = classe.nome;
  classDetailSummary.textContent = classe.resumo;
  selecionarAbaDaClasse(abaDeClasseAtual, false);
}

function abrirImportacaoDeClasse() {
  classJsonInput.value = "";
  classJsonInput.click();
}

function validarClasseImportada(dados) {
  if (!dados || dados.tipo !== "grimorio-classe") {
    return "Este arquivo não contém uma Classe do Grimório.";
  }

  if (dados.versao !== 1) {
    return "A versão desta Classe não é compatível.";
  }

  const classe = dados.classe;
  const campos = [
    classe && classe.id,
    classe && classe.nome,
    classe && classe.resumo,
    classe && classe.descricao,
    classe && classe.mecanica && classe.mecanica.nome,
    classe && classe.mecanica && classe.mecanica.descricao,
    classe && classe.risco && classe.risco.nome,
    classe && classe.risco && classe.risco.descricao
  ];

  if (!classe || campos.some(function (campo) { return typeof campo !== "string" || !campo.trim(); })) {
    return "A Classe importada possui campos obrigatórios ausentes.";
  }

  if ((classe.especializacoes !== undefined && !Array.isArray(classe.especializacoes)) || (classe.focos !== undefined && !Array.isArray(classe.focos))) {
    return "A Classe importada possui campos obrigatórios ausentes.";
  }

  const idNormalizado = classe.id.trim().toLocaleLowerCase("pt-BR");
  if (classes.some(function (item) { return item.id.toLocaleLowerCase("pt-BR") === idNormalizado; })) {
    return "Já existe uma Classe com este identificador.";
  }

  return "";
}

function criarClasseImportada(dados) {
  const origem = dados.classe;
  const especializacoes = Array.isArray(origem.especializacoes) ? origem.especializacoes.filter(function (item) {
    return item && typeof item.nome === "string" && typeof item.descricao === "string";
  }).map(function (item) {
    return { nome: item.nome.trim(), descricao: item.descricao.trim() };
  }) : [];
  const focos = Array.isArray(origem.focos) ? origem.focos.filter(function (item) {
    return typeof item === "string";
  }).map(function (item) { return item.trim(); }).filter(Boolean) : [];

  return {
    id: origem.id.trim(),
    nome: origem.nome.trim(),
    categoria: "Importadas",
    resumo: origem.resumo.trim(),
    descricao: origem.descricao.trim(),
    mecanica: {
      nome: origem.mecanica.nome.trim(),
      descricao: origem.mecanica.descricao.trim(),
      usos: []
    },
    risco: {
      nome: origem.risco.nome.trim(),
      descricao: origem.risco.descricao.trim()
    },
    especializacoes: especializacoes,
    focos: focos,
    importada: true
  };
}

function importarClasse(event) {
  const arquivo = event.target.files[0];
  classMessage.removeAttribute("data-state");

  if (!arquivo || !arquivo.name.toLowerCase().endsWith(".json")) {
    classMessage.textContent = "Selecione um arquivo JSON válido.";
    return;
  }

  const leitor = new FileReader();
  leitor.addEventListener("load", function () {
    let dados;

    try {
      dados = JSON.parse(String(leitor.result));
    } catch (erro) {
      classMessage.textContent = "Selecione um arquivo JSON válido.";
      return;
    }

    const erroDeValidacao = validarClasseImportada(dados);
    if (erroDeValidacao) {
      classMessage.textContent = erroDeValidacao;
      return;
    }

    const classe = criarClasseImportada(dados);
    classes.push(classe);
    personagem.classe = classe.id;
    personagem.classeImportada = true;
    categoriaDeClasseAtual = "Importadas";
    paginaDeClassesAtual = 1;
    abaDeClasseAtual = "overview";
    classMessage.textContent = "Classe importada com sucesso.";
    classMessage.dataset.state = "success";
    renderizarCategoriasDeClasse();
    renderizarClasses("category");
    animarSelecao(classList.querySelector(`[data-class-id="${classe.id}"]`));
    renderizarSimboloDaClasse(true);
    renderizarDetalhesDaClasse(true);
  });

  leitor.addEventListener("error", function () {
    classMessage.textContent = "Não foi possível ler este arquivo.";
  });
  leitor.readAsText(arquivo);
}

function validarClasse() {
  classMessage.removeAttribute("data-state");

  if (personagem.classe) {
    classMessage.textContent = "";
    return true;
  }

  classMessage.textContent = "Escolha uma Classe para continuar.";
  const primeiroCard = classList.querySelector("button[data-class-id]");
  if (primeiroCard) primeiroCard.focus();
  return false;
}

function obterNomeDaEspecieParaResumo() {
  const especie = obterEspecieSelecionada();
  return especie ? especie.nome : "Não definida";
}

function obterNomeDaClasseParaResumo() {
  const classe = obterClasseSelecionada();
  return classe ? classe.nome : "Não definida";
}

function obterIdDoAtributo(valor) {
  return dominioDoPersonagem.obterIdDoAtributo(valor, atributosDeMeridian);
}

function criarModificadoresZerados() {
  return dominioDoPersonagem.criarModificadoresZerados(atributosDeMeridian);
}

function aplicarModificador(modificadores, atributo, valor) {
  dominioDoPersonagem.aplicarModificador(modificadores, atributo, valor, atributosDeMeridian);
}

function obterModificadoresDaEspecie() {
  const especie = obterEspecieSelecionada();
  const modificadores = criarModificadoresZerados();

  if (!especie) return null;

  if (especie.id === "humano") {
    if (personagem.atributosEspecie.length !== 2 || !personagem.afinidadeEspecie) return null;
    personagem.atributosEspecie.forEach(function (atributo) {
      aplicarModificador(modificadores, atributo, 1);
    });
    return modificadores;
  }

  if (especie.id === "vesperiano") {
    aplicarModificador(modificadores, "Agilidade", 2);
    aplicarModificador(modificadores, "Intelecto", 1);
    aplicarModificador(modificadores, "Resistência", -1);
    return modificadores;
  }

  if (especie.id === "ferrano") {
    aplicarModificador(modificadores, "Resistência", 2);
    aplicarModificador(modificadores, "Força", 1);
    aplicarModificador(modificadores, "Agilidade", -1);
    return modificadores;
  }

  if (especie.id === "nacaro") {
    aplicarModificador(modificadores, "Agilidade", 2);
    aplicarModificador(modificadores, "Resistência", 1);
    aplicarModificador(modificadores, "Força", -1);
    return modificadores;
  }

  if (especie.id === "quimerico") {
    const variante = obterVarianteSelecionada(especie);
    const atributoAdicional = personagem.atributosEspecie[0];
    if (!variante || !atributoAdicional) return null;

    aplicarModificador(modificadores, variante.principal, 2);
    aplicarModificador(modificadores, atributoAdicional, 1);

    if (variante.id === "felina") aplicarModificador(modificadores, "Resistência", -1);
    if (variante.id === "canidea") aplicarModificador(modificadores, "Intelecto", -1);
    if (variante.id === "caprina" || variante.id === "reptiliana") aplicarModificador(modificadores, "Agilidade", -1);

    return modificadores;
  }

  if (especie.id === "caldeano") {
    const variante = obterVarianteSelecionada(especie);
    if (!variante) return null;

    aplicarModificador(modificadores, "Resistência", 2);
    aplicarModificador(modificadores, variante.id === "tecnico" ? "Intelecto" : "Força", 1);
    aplicarModificador(modificadores, "Agilidade", -1);
    return modificadores;
  }

  return null;
}

function obterAfinidadeDoPersonagem() {
  return obterIdDoAtributo(personagem.afinidadeEspecie);
}

function calcularCustoTotalDoAtributo(valor) {
  return dominioDoPersonagem.calcularCustoTotalDoAtributo(valor, CONFIGURACAO_ATRIBUTOS.custosPorNivel);
}

function valorPossuiCustosConfigurados(valor) {
  return dominioDoPersonagem.valorPossuiCustosConfigurados(valor, CONFIGURACAO_ATRIBUTOS.custosPorNivel);
}

function obterCustoDoProximoNivel(valorAtual) {
  return dominioDoPersonagem.obterCustoDoProximoNivel(valorAtual, CONFIGURACAO_ATRIBUTOS.custosPorNivel);
}

function calcularPontosUtilizados() {
  return atributosDeMeridian.reduce(function (total, atributo) {
    return total + calcularCustoTotalDoAtributo(personagem.atributos[atributo.id]);
  }, 0);
}

function calcularPontosRestantes() {
  return CONFIGURACAO_ATRIBUTOS.pontosDisponiveis - calcularPontosUtilizados();
}

function calcularLimiteFinal(atributo) {
  return obterAfinidadeDoPersonagem() === atributo
    ? CONFIGURACAO_ATRIBUTOS.limiteFinalAfinidade
    : CONFIGURACAO_ATRIBUTOS.limiteFinalNormal;
}

function calcularValorFinal(atributo, valorDistribuido) {
  const modificadores = obterModificadoresDaEspecie();
  const valor = valorDistribuido ?? personagem.atributos[atributo];

  if (!modificadores) return NaN;
  return valor + modificadores[atributo];
}

function podeAumentarAtributo(atributo) {
  const valorAtual = personagem.atributos[atributo];
  const proximoValor = valorAtual + 1;
  const custo = obterCustoDoProximoNivel(valorAtual);

  if (!Number.isFinite(custo)) return false;
  if (custo > calcularPontosRestantes()) return false;

  return calcularValorFinal(atributo, proximoValor) <= calcularLimiteFinal(atributo);
}

function obterMensagemDoProximoNivel(atributo) {
  const valorAtual = personagem.atributos[atributo];
  const custo = obterCustoDoProximoNivel(valorAtual);

  if (!Number.isFinite(custo) || calcularValorFinal(atributo, valorAtual + 1) > calcularLimiteFinal(atributo)) {
    return "Limite alcançado";
  }

  if (custo > calcularPontosRestantes()) {
    return "Pontos insuficientes";
  }

  return `Próximo nível: ${custo} ponto${custo === 1 ? "" : "s"}`;
}

function renderizarAtributos(direcaoAlteracao, atributoAlterado) {
  const modificadores = obterModificadoresDaEspecie();
  const afinidade = obterAfinidadeDoPersonagem();
  const motionDeAtributo = window.GrimorioAttributeMotion;

  attributesList.replaceChildren();
  attributesError.textContent = modificadores ? "" : "Não foi possível aplicar os modificadores da Espécie.";

  atributosDeMeridian.forEach(function (atributo) {
    const valorDistribuido = personagem.atributos[atributo.id];
    const modificador = modificadores ? modificadores[atributo.id] : 0;
    const valorFinal = valorDistribuido + modificador;
    const possuiAfinidade = afinidade === atributo.id;
    const identidadeVisual = typeof motionDeAtributo?.obterVisualDoAtributo === "function"
      ? motionDeAtributo.obterVisualDoAtributo(atributo.id)
      : null;

    const card = document.createElement("article");
    card.className = "attribute-card";
    card.dataset.attribute = atributo.id;
    if (typeof identidadeVisual === "string" && identidadeVisual) {
      card.dataset.attributeMotion = identidadeVisual;
    }
    card.classList.toggle("is-at-limit", valorFinal >= calcularLimiteFinal(atributo.id));

    const icon = document.createElement("span");
    icon.className = "attribute-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = atributo.sigla;

    const copy = document.createElement("div");
    copy.className = "attribute-copy";

    const title = document.createElement("div");
    title.className = "attribute-title";
    const name = document.createElement("strong");
    name.textContent = atributo.nome;
    const acronym = document.createElement("span");
    acronym.textContent = atributo.sigla;
    title.append(name, acronym);

    const description = document.createElement("p");
    description.textContent = atributo.descricao;
    copy.append(title, description);

    if (possuiAfinidade) {
      const affinity = document.createElement("span");
      affinity.className = "attribute-affinity";
      affinity.textContent = `Afinidade - limite ${CONFIGURACAO_ATRIBUTOS.limiteFinalAfinidade}`;
      copy.append(affinity);
    }

    const controls = document.createElement("div");
    controls.className = "attribute-controls";
    const decrease = document.createElement("button");
    decrease.type = "button";
    decrease.dataset.attributeAction = "decrease";
    decrease.dataset.attribute = atributo.id;
    decrease.setAttribute("aria-label", `Diminuir ${atributo.nome}`);
    decrease.disabled = valorDistribuido <= CONFIGURACAO_ATRIBUTOS.valorInicial;
    decrease.textContent = "-";
    const distributedValue = document.createElement("span");
    distributedValue.className = "attribute-distributed-value";
    distributedValue.textContent = valorDistribuido;
    const increase = document.createElement("button");
    increase.type = "button";
    increase.dataset.attributeAction = "increase";
    increase.dataset.attribute = atributo.id;
    increase.setAttribute("aria-label", `Aumentar ${atributo.nome}`);
    increase.disabled = !podeAumentarAtributo(atributo.id);
    increase.textContent = "+";
    controls.append(decrease, distributedValue, increase);

    const values = document.createElement("dl");
    values.className = "attribute-values";

    [
      ["Distribuído", valorDistribuido, "", "distributed"],
      ["Espécie", formatarModificador(modificador), modificador < 0 ? "attribute-modifier--negative" : modificador > 0 ? "attribute-modifier--positive" : "", "species"],
      ["Final", valorFinal, "attribute-final-value", ""]
    ].forEach(function ([label, value, className, source]) {
      const item = document.createElement("div");
      const dt = document.createElement("dt");
      const dd = document.createElement("dd");
      if (source) item.dataset.attributeSource = source;
      dt.textContent = label;
      dd.textContent = value;
      if (className) dd.className = className;
      if (label === "Final") dd.dataset.finalValue = atributo.id;
      item.append(dt, dd);
      values.append(item);
    });

    const note = document.createElement("p");
    note.className = "attribute-note";
    note.textContent = obterMensagemDoProximoNivel(atributo.id);

    card.append(icon, copy, controls, values, note);
    attributesList.append(card);
  });

  renderizarResumoDosAtributos();
  atualizarEstadoDoBotaoDeRevisao();

  if (direcaoAlteracao && atributoAlterado) {
    animarValorFinal(atributoAlterado, direcaoAlteracao);
  }
}

function obterPericiaPorId(id) {
  return PERICIAS.find(function (pericia) {
    return pericia.id === id;
  }) || null;
}

function contarPericiasTreinadas() {
  return Object.values(personagem.pericias)
    .filter(Boolean)
    .length;
}

function atingiuLimiteDePericias() {
  return (
    contarPericiasTreinadas() >=
    CONFIGURACAO_PERICIAS.limiteTreinadas
  );
}

function mostrarMensagemDePericias(mensagem) {
  skillsMessage.textContent = mensagem;
}

function obterDadoDaPericia(id) {
  return personagem.pericias[id]
    ? CONFIGURACAO_PERICIAS.dadoTreinado
    : CONFIGURACAO_PERICIAS.dadoNaoTreinado;
}

function obterAtributoDaPericia(id) {
  const pericia = obterPericiaPorId(id);
  return pericia ? pericia.atributo : null;
}

function obterValorFinalDaPericia(id) {
  const atributo = obterAtributoDaPericia(id);
  return atributo ? calcularValorFinal(atributo) : NaN;
}

function alternarTreinamentoDaPericia(id, treinada) {
  const periciaExiste = PERICIAS.some(function (pericia) {
    return pericia.id === id;
  });

  if (!periciaExiste) return;

  const jaEstaTreinada = personagem.pericias[id] === true;

  if (
    treinada &&
    !jaEstaTreinada &&
    atingiuLimiteDePericias()
  ) {
    mostrarMensagemDePericias(
      `Você já escolheu o limite de ${CONFIGURACAO_PERICIAS.limiteTreinadas} Perícias treinadas.`
    );
    renderizarPericias();
    return;
  }

  personagem.pericias[id] = treinada;
  mostrarMensagemDePericias("");
  renderizarPericias();
}

function obterSiglaDoAtributo(atributoId) {
  const atributo = atributosDeMeridian.find(function (atributo) {
    return atributo.id === atributoId;
  });

  return atributo ? atributo.sigla : "";
}

function obterPericiasVisiveis() {
  if (window.matchMedia("(max-width: 899px)").matches) {
    const inicio = (paginaDePericiasAtual - 1) * PERICIAS_POR_PAGINA;
    return [PERICIAS.slice(inicio, inicio + PERICIAS_POR_PAGINA)];
  }

  return [PERICIAS.slice(0, 11), PERICIAS.slice(11, 22)];
}

function criarCabecalhoDePericias() {
  const header = document.createElement("div");
  header.className = "skill-header";
  ["Perícia", "Atributo", "Treinado?", "Teste"].forEach(function (texto) {
    const span = document.createElement("span");
    span.textContent = texto;
    header.append(span);
  });
  return header;
}

function criarLinhaDePericia(pericia) {
  const treinada = personagem.pericias[pericia.id] === true;
  const limiteAtingido = atingiuLimiteDePericias();
  const bloqueada = limiteAtingido && !treinada;
  const row = document.createElement("div");
  row.className = bloqueada ? "skill-row is-disabled" : "skill-row";
  if (bloqueada) {
    row.title = `Limite de ${CONFIGURACAO_PERICIAS.limiteTreinadas} Perícias treinadas alcançado.`;
  }

  const nome = document.createElement("span");
  nome.className = "skill-name";
  nome.textContent = pericia.nome;

  const atributo = document.createElement("span");
  atributo.className = "skill-attribute";
  atributo.textContent = `${obterSiglaDoAtributo(pericia.atributo)} ${calcularValorFinal(pericia.atributo)}`;

  const treinamento = document.createElement("label");
  treinamento.className = treinada ? "skill-training is-trained" : "skill-training";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.dataset.skillId = pericia.id;
  checkbox.checked = treinada;
  checkbox.disabled = bloqueada;
  checkbox.setAttribute("aria-label", `Marcar ${pericia.nome} como treinada`);
  if (bloqueada) {
    checkbox.title = `Limite de ${CONFIGURACAO_PERICIAS.limiteTreinadas} Perícias treinadas alcançado.`;
  }

  const treinamentoTexto = document.createElement("span");
  treinamentoTexto.textContent = treinada ? "Treinada" : "Não treinada";
  treinamento.append(checkbox, treinamentoTexto);

  const teste = document.createElement("span");
  teste.className = "skill-test";
  teste.textContent = `${obterDadoDaPericia(pericia.id)} + ${obterValorFinalDaPericia(pericia.id)}`;

  row.append(nome, atributo, treinamento, teste);
  return row;
}

function renderizarPericias() {
  const totalPaginas = window.matchMedia("(max-width: 899px)").matches ? 2 : 1;
  paginaDePericiasAtual = Math.min(Math.max(1, paginaDePericiasAtual), totalPaginas);

  skillsList.replaceChildren();
  obterPericiasVisiveis().forEach(function (periciasDaColuna) {
    const column = document.createElement("div");
    column.className = "skills-column";
    column.append(criarCabecalhoDePericias());
    periciasDaColuna.forEach(function (pericia) {
      column.append(criarLinhaDePericia(pericia));
    });
    skillsList.append(column);
  });

  skillsPageLabel.textContent = `${paginaDePericiasAtual} / ${totalPaginas}`;
  skillsPrevPage.disabled = paginaDePericiasAtual <= 1;
  skillsNextPage.disabled = paginaDePericiasAtual >= totalPaginas;
  renderizarResumoDasPericias();
}

function renderizarResumoDasPericias() {
  const treinadas = contarPericiasTreinadas();
  const periciasRestantes = Math.max(0, CONFIGURACAO_PERICIAS.limiteTreinadas - treinadas);

  skillsTrainedCount.textContent = treinadas;
  skillsTrainedLimit.textContent = CONFIGURACAO_PERICIAS.limiteTreinadas;
  if (treinadas === CONFIGURACAO_PERICIAS.limiteTreinadas && !skillsMessage.textContent.startsWith("Você já")) {
    mostrarMensagemDePericias("Seleção completa.");
  } else if (periciasRestantes > 0 && !skillsMessage.textContent) {
    mostrarMensagemDePericias(`Escolha mais ${periciasRestantes} Perícia${periciasRestantes === 1 ? "" : "s"}.`);
  }
  skillsAttributeSummary.replaceChildren();

  atributosDeMeridian.forEach(function (atributo) {
    const quantidade = PERICIAS.filter(function (pericia) {
      return pericia.atributo === atributo.id;
    }).length;

    const item = document.createElement("div");
    const dt = document.createElement("dt");
    const dd = document.createElement("dd");
    dt.textContent = atributo.sigla;
    dd.textContent = `${quantidade} perícia${quantidade === 1 ? "" : "s"}`;
    item.append(dt, dd);
    skillsAttributeSummary.append(item);
  });
  atualizarEstadoDoBotaoDeRevisao();
}

function mostrarMensagemDeAtributos(mensagem) {
  attributesError.textContent = mensagem;
}

function obterPendenciasDosAtributos() {
  const pontosRestantes = calcularPontosRestantes();
  const periciasTreinadas = contarPericiasTreinadas();
  const periciasRestantes = CONFIGURACAO_PERICIAS.limiteTreinadas - periciasTreinadas;

  return {
    pontosRestantes,
    periciasTreinadas,
    periciasRestantes
  };
}

function atributosEPericiasCompletos() {
  const pendencias = obterPendenciasDosAtributos();

  return pendencias.periciasTreinadas === CONFIGURACAO_PERICIAS.limiteTreinadas;
}

function obterMensagemDePendenciasDosAtributos() {
  const pendencias = obterPendenciasDosAtributos();

  if (pendencias.periciasRestantes > 0) {
    return `Para continuar, escolha mais ${pendencias.periciasRestantes} Perícia${pendencias.periciasRestantes === 1 ? "" : "s"}.`;
  }

  if (pendencias.pontosRestantes > 0) {
    return `Você pode avançar ou distribuir os ${pendencias.pontosRestantes} ponto${pendencias.pontosRestantes === 1 ? "" : "s"} restante${pendencias.pontosRestantes === 1 ? "" : "s"}.`;
  }

  return "Escolhas concluídas. Você pode avançar.";
}

function atualizarEstadoDoBotaoDeRevisao() {
  if (etapaAtual !== 5) return;

  const completo = atributosEPericiasCompletos();
  creationNextButton.disabled = !completo;
  creationNextButton.setAttribute("aria-disabled", String(!completo));
  stageHelper.textContent = obterMensagemDePendenciasDosAtributos();
}

function focarPrimeiroControleDeAtributoDisponivel() {
  const botao = attributesList.querySelector('button[data-attribute-action="increase"]:not(:disabled)');
  if (botao) botao.focus();
}

function focarPrimeiraPericiaDisponivel() {
  const checkbox = skillsList.querySelector('input[data-skill-id]:not(:disabled)');
  if (checkbox) checkbox.focus();
}

function validarAtributosEPericias() {
  const totalPericias = contarPericiasTreinadas();

  if (!validarAtributos()) {
    return false;
  }

  if (totalPericias !== CONFIGURACAO_PERICIAS.limiteTreinadas) {
    mostrarMensagemDePericias(`Escolha exatamente ${CONFIGURACAO_PERICIAS.limiteTreinadas} Perícias treinadas antes de continuar. Você escolheu ${totalPericias} de ${CONFIGURACAO_PERICIAS.limiteTreinadas} Perícias.`);
    selecionarAbaDosAtributos("pericias");
    focarPrimeiraPericiaDisponivel();
    atualizarEstadoDoBotaoDeRevisao();
    return false;
  }

  return true;
}

function selecionarAbaDosAtributos(aba) {
  abaDosAtributosAtual = aba === "pericias" ? "pericias" : "atributos";
  const mostrandoPericias = abaDosAtributosAtual === "pericias";

  attributesPanel.hidden = mostrandoPericias;
  skillsPanel.hidden = !mostrandoPericias;
  attributesTabButton.classList.toggle("is-active", !mostrandoPericias);
  skillsTabButton.classList.toggle("is-active", mostrandoPericias);
  attributesTabButton.setAttribute("aria-selected", mostrandoPericias ? "false" : "true");
  skillsTabButton.setAttribute("aria-selected", mostrandoPericias ? "true" : "false");

  if (mostrandoPericias) {
    renderizarPericias();
  } else {
    renderizarAtributos();
  }
}

function mudarPaginaDePericias(direcao) {
  paginaDePericiasAtual += direcao;
  renderizarPericias();
}

function renderizarResumoDosAtributos() {
  const pontosUtilizados = calcularPontosUtilizados();
  const pontosRestantes = calcularPontosRestantes();
  const afinidade = obterAfinidadeDoPersonagem();
  const atributoAfinidade = atributosDeMeridian.find(function (atributo) {
    return atributo.id === afinidade;
  });

  attributesPointsTotal.textContent = CONFIGURACAO_ATRIBUTOS.pontosDisponiveis;
  attributesPointsRemaining.textContent = pontosRestantes;
  attributesPointsUsed.textContent = pontosUtilizados;
  attributesPointsBar.style.width = `${Math.min(100, Math.max(0, (pontosUtilizados / CONFIGURACAO_ATRIBUTOS.pontosDisponiveis) * 100))}%`;
  attributesAffinityName.textContent = atributoAfinidade ? atributoAfinidade.nome : "Não definida";
  attributesAffinityLimit.textContent = CONFIGURACAO_ATRIBUTOS.limiteFinalAfinidade;
  mostrarMensagemDeAtributos(
    pontosRestantes === 0
      ? "Orçamento de atributos utilizado por completo."
      : `Você pode distribuir mais ${pontosRestantes} ponto${pontosRestantes === 1 ? "" : "s"} ou avançar sem gastar todo o saldo.`
  );
  attributesFinalSummary.replaceChildren();

  atributosDeMeridian.forEach(function (atributo) {
    const item = document.createElement("div");
    const dt = document.createElement("dt");
    const dd = document.createElement("dd");
    dt.textContent = atributo.sigla;
    dd.textContent = calcularValorFinal(atributo.id);
    item.append(dt, dd);
    attributesFinalSummary.append(item);
  });
}

function animarValorFinal(atributo, direcao) {
  const card = attributesList.querySelector(`[data-attribute="${atributo}"]`);
  const motionDeAtributo = window.GrimorioAttributeMotion;
  const motion = window.GrimorioMotion;
  const identidadeVisual = card?.dataset.attributeMotion;

  if (
    card &&
    typeof identidadeVisual === "string" &&
    identidadeVisual &&
    typeof motionDeAtributo?.obterClassesDaMudanca === "function" &&
    typeof motion?.animarMudancaDeAtributo === "function"
  ) {
    const classesDaMudanca = motionDeAtributo.obterClassesDaMudanca({
      changed: true,
      source: "distributed",
      direction: direcao
    });
    const classesUtilizaveis = Array.isArray(classesDaMudanca)
      ? classesDaMudanca.filter(function (classe) {
        return typeof classe === "string" && classe;
      })
      : [];

    if (classesUtilizaveis.length > 0) {
      motion.animarMudancaDeAtributo(card, classesUtilizaveis);
      return;
    }
  }

  const elemento = card
    ? card.querySelector(".attribute-final-value")
    : attributesList.querySelector(`[data-final-value="${atributo}"]`);
  if (!elemento) return;

  const classe = direcao === "up" ? "is-changing-up" : "is-changing-down";
  elemento.classList.remove("is-changing-up", "is-changing-down");
  window.requestAnimationFrame(function () {
    elemento.classList.add(classe);
    window.setTimeout(function () {
      elemento.classList.remove(classe);
    }, direcao === "up" ? 200 : 160);
  });
}

function aumentarAtributo(atributo) {
  if (!podeAumentarAtributo(atributo)) return;
  personagem.atributos[atributo] += 1;
  renderizarAtributos("up", atributo);
  if (abaDosAtributosAtual === "pericias") renderizarPericias();
}

function diminuirAtributo(atributo) {
  if (personagem.atributos[atributo] <= CONFIGURACAO_ATRIBUTOS.valorInicial) return;
  personagem.atributos[atributo] -= 1;
  renderizarAtributos("down", atributo);
  if (abaDosAtributosAtual === "pericias") renderizarPericias();
}

function ajustarAtributosPelaEspecieAtual() {
  let ajustou = false;

  atributosDeMeridian.forEach(function (atributo) {
    while (
      personagem.atributos[atributo.id] > CONFIGURACAO_ATRIBUTOS.valorInicial &&
      calcularValorFinal(atributo.id) > calcularLimiteFinal(atributo.id)
    ) {
      personagem.atributos[atributo.id] -= 1;
      ajustou = true;
    }
  });

  attributesAdjustmentMessage.textContent = ajustou
    ? "Alguns atributos foram ajustados porque a nova Espécie possui limites diferentes."
    : "";
}

function validarAtributos() {
  const modificadores = obterModificadoresDaEspecie();
  const pontosUtilizados = calcularPontosUtilizados();

  attributesError.textContent = "";

  if (!modificadores || !obterAfinidadeDoPersonagem()) {
    attributesError.textContent = "Não foi possível aplicar os modificadores da Espécie.";
    return false;
  }

  const algumValorInvalido = atributosDeMeridian.some(function (atributo) {
    const valor = personagem.atributos[atributo.id];
    return !Number.isInteger(valor) || valor < CONFIGURACAO_ATRIBUTOS.valorInicial || !valorPossuiCustosConfigurados(valor);
  });

  if (algumValorInvalido) {
    attributesError.textContent = "A distribuição de atributos contém um valor inválido.";
    return false;
  }

  if (pontosUtilizados > CONFIGURACAO_ATRIBUTOS.pontosDisponiveis) {
    attributesError.textContent = "Os pontos utilizados ultrapassam o limite disponível.";
    return false;
  }

  if (contarPericiasTreinadas() > CONFIGURACAO_PERICIAS.limiteTreinadas) {
    attributesError.textContent = `O personagem não pode possuir mais de ${CONFIGURACAO_PERICIAS.limiteTreinadas} Perícias treinadas.`;
    return false;
  }

  const ultrapassouLimite = atributosDeMeridian.some(function (atributo) {
    return calcularValorFinal(atributo.id) > calcularLimiteFinal(atributo.id);
  });

  if (ultrapassouLimite) {
    attributesError.textContent = "Um atributo ultrapassou seu limite inicial.";
    return false;
  }

  return true;
}

function renderizarRevisaoProvisoria() {
  const periciasTreinadas = PERICIAS.filter(function (pericia) {
    return personagem.pericias[pericia.id];
  }).map(function (pericia) {
    return pericia.nome;
  });
  const resumoDasPericias = `${contarPericiasTreinadas()} / ${CONFIGURACAO_PERICIAS.limiteTreinadas}`;

  reviewCharacterName.textContent = personagem.nome || "Sem nome";
  reviewSpeciesName.textContent = obterNomeDaEspecieParaResumo();
  reviewClassName.textContent = obterNomeDaClasseParaResumo();
  reviewOriginTitle.textContent = personagem.origem.titulo || "Não definida";
  reviewFinalForca.textContent = calcularValorFinal("forca");
  reviewFinalAgilidade.textContent = calcularValorFinal("agilidade");
  reviewFinalIntelecto.textContent = calcularValorFinal("intelecto");
  reviewFinalResistencia.textContent = calcularValorFinal("resistencia");
  reviewTrainedSkills.textContent = periciasTreinadas.length
    ? `${resumoDasPericias} - ${periciasTreinadas.join(", ")}`
    : `${resumoDasPericias} - Nenhuma Perícia treinada.`;
}

function mostrarMensagemDeSalvamento(mensagem, erro) {
  const destino = characterSheetScreen.hidden ? reviewSaveStatus : sheetSaveStatus;

  if (temporizadorMensagemDeSalvamento) {
    window.clearTimeout(temporizadorMensagemDeSalvamento);
  }

  destino.textContent = mensagem;
  destino.classList.toggle("is-error", erro === true);

  temporizadorMensagemDeSalvamento = window.setTimeout(function () {
    destino.textContent = "";
    destino.classList.remove("is-error");
  }, 3600);
}

function criarEnvelopeDaFicha() {
  prepararDadosIniciaisDaFicha();
  return window.GrimorioImportExportDomain.criarEnvelopeDaFicha(personagem);
}

function salvarFichaJson(envelopePronto) {
  try {
    const envelope = envelopePronto || criarEnvelopeDaFicha();
    const conteudo = JSON.stringify(envelope, null, 2);
    const arquivo = new Blob(
      [conteudo],
      { type: "application/json;charset=utf-8" }
    );

    const url = URL.createObjectURL(arquivo);
    const link = document.createElement("a");
    const nomeSeguro = criarNomeSeguroParaArquivo(personagem.nome) || "personagem";

    link.href = url;
    link.download = `${nomeSeguro}-ficha.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    mostrarMensagemDeSalvamento("Ficha exportada em JSON.");
  } catch (erro) {
    mostrarMensagemDeSalvamento("Não foi possível gerar o arquivo da ficha.", true);
  }
}

function prepararDadosIniciaisDaFicha(personagemAlvo = personagem, versaoDoInventario = 2) {
  personagemAlvo.nivel ??= 1;
  personagemAlvo.experiencia ??= 0;
  personagemAlvo.pontosEvolucao ??= 0;
  personagemAlvo.pontosGloria ??= 0;
  personagemAlvo.recursos ??= {
    vidaAtual: 20,
    vidaMaxima: 20,
    manaAtual: 10,
    manaMaxima: 10
  };
  personagemAlvo.combate ??= {
    defesa: 0,
    reducaoDano: 0,
    iniciativa: 0,
    movimento: 0
  };
  personagemAlvo.modificadoresTemporarios ??= {
    forca: 0,
    agilidade: 0,
    intelecto: 0,
    resistencia: 0
  };
  personagemAlvo.armas ??= [];
  personagemAlvo.habilidades ??= [];
  personagemAlvo.vinculos = window.GrimorioLinksDomain.normalizarColecaoVinculos(
    personagemAlvo.vinculos
  );
  personagemAlvo.registros = window.GrimorioJournalDomain.normalizarColecaoRegistros(
    personagemAlvo.registros
  );
  personagemAlvo.inventario ??= [];
  personagemAlvo.inventarioStaging ??= null;
  personagemAlvo.equipamentos ??= {};
  personagemAlvo.equipamentos.armadura ??= null;
  personagemAlvo.equipamentos.maoPrincipal ??= null;
  personagemAlvo.equipamentos.maoSecundaria ??= null;
  personagemAlvo.habilidades = personagemAlvo.habilidades.map(normalizarHabilidade);
  personagemAlvo.inventario = dominioDoInventario.migrateInventory(
    personagemAlvo.inventario,
    versaoDoInventario
  );
  personagemAlvo.equipamentos = normalizarEquipamentosPersistidos(
    personagemAlvo.equipamentos,
    personagemAlvo.inventario
  );
  personagemAlvo.inventarioStaging = normalizarItemPersistidoNaBancada(
    personagemAlvo.inventarioStaging,
    personagemAlvo.inventario,
    personagemAlvo.equipamentos
  );

  personagemAlvo.recursos.vidaMaxima ??= 20;
  personagemAlvo.recursos.vidaAtual ??= personagemAlvo.recursos.vidaMaxima;
  personagemAlvo.recursos.manaMaxima ??= 10;
  personagemAlvo.recursos.manaAtual ??= personagemAlvo.recursos.manaMaxima;
  personagemAlvo.combate.defesa ??= 0;
  personagemAlvo.combate.reducaoDano ??= 0;
  personagemAlvo.combate.iniciativa ??= 0;
  personagemAlvo.combate.movimento ??= 0;

  atributosDeMeridian.forEach(function (atributo) {
    personagemAlvo.modificadoresTemporarios[atributo.id] ??= 0;
  });

  personagemAlvo.recursos.vidaAtual = limitarValor(
    personagemAlvo.recursos.vidaAtual,
    0,
    personagemAlvo.recursos.vidaMaxima
  );
  personagemAlvo.recursos.manaAtual = limitarValor(
    personagemAlvo.recursos.manaAtual,
    0,
    personagemAlvo.recursos.manaMaxima
  );

  return personagemAlvo;
}
