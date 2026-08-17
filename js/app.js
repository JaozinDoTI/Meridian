createButton.addEventListener("click", abrirCriacao);
creationBackButton.addEventListener("click", voltarNaCriacao);
creationNextButton.addEventListener("click", avancarNaCriacao);
reviewSaveJsonButton.addEventListener("click", exportarFichaJson);
reviewOpenSheetButton.addEventListener("click", abrirFicha);
sheetSaveSessionButton.addEventListener("click", function () {
  salvarFichaNaSessao();
});
sheetExportJsonButton.addEventListener("click", exportarFichaJson);
sheetBackReviewButton.addEventListener("click", voltarParaRevisao);
sheetSidebar.addEventListener("click", function (event) {
  const moreButton = event.target.closest("#sheet-sidebar-more");
  if (moreButton) {
    definirMenuDeSecoesFuturasAberto(moreButton.getAttribute("aria-expanded") !== "true");
    return;
  }

  const button = event.target.closest("button[data-sheet-section]");
  if (!button) return;

  if (["summary", "abilities", "inventory", "history", "journal"].includes(button.dataset.sheetSection)) {
    ativarSecaoDaFicha(button.dataset.sheetSection);
    return;
  }

  definirMenuDeSecoesFuturasAberto(false);
  mostrarMensagemDaFicha(`${button.dataset.navLabel || "Esta seção"} ainda está em desenvolvimento.`);
});
document.addEventListener("click", function (event) {
  if (!sheetSidebar.classList.contains("is-more-open") || sheetSidebar.contains(event.target)) return;
  definirMenuDeSecoesFuturasAberto(false);
});
sheetSidebar.addEventListener("keydown", function (event) {
  if (event.key !== "Escape" || !sheetSidebar.classList.contains("is-more-open")) return;
  event.preventDefault();
  definirMenuDeSecoesFuturasAberto(false);
  sheetSidebarMore.focus({ preventScroll: true });
});
sheetOpenAbilities.addEventListener("click", function () {
  ativarSecaoDaFicha("abilities");
});
sheetOpenInventory.addEventListener("click", function () {
  ativarSecaoDaFicha("inventory");
});
journalCreate.addEventListener("click", function () {
  window.GrimorioJournalController.openCreate(journalCreate);
});
journalQuickTitle.addEventListener("focus", window.GrimorioJournalController.expandQuickCapture);
journalQuickTitle.addEventListener("input", window.GrimorioJournalController.expandQuickCapture);
journalQuickCapture.addEventListener("submit", window.GrimorioJournalController.submitQuickCapture);
journalQuickCapture.addEventListener("keydown", window.GrimorioJournalController.quickCaptureKeydown);
journalQuickCancel.addEventListener("click", window.GrimorioJournalController.cancelQuickCapture);
journalSearch.addEventListener("input", function () {
  window.GrimorioJournalController.setQuery(journalSearch.value);
});
journalTypeFilter.addEventListener("change", function () {
  window.GrimorioJournalController.setTypeFilter(journalTypeFilter.value);
});
journalPinnedOnly.addEventListener("change", function () {
  window.GrimorioJournalController.setPinnedOnly(journalPinnedOnly.checked);
});
journalClearFilters.addEventListener("click", window.GrimorioJournalController.clearFilters);
journalReaderEdit.addEventListener("click", function () {
  window.GrimorioJournalController.openEdit(journalReaderEdit);
});
journalReaderPin.addEventListener("click", window.GrimorioJournalController.togglePinned);
journalReaderDelete.addEventListener("click", window.GrimorioJournalController.requestDelete);
journalBackToList.addEventListener("click", window.GrimorioJournalController.backToList);
journalEditorForm.addEventListener("submit", window.GrimorioJournalController.submitEditor);
journalEditorClose.addEventListener("click", window.GrimorioJournalController.requestEditorCancel);
journalEditorCancel.addEventListener("click", window.GrimorioJournalController.requestEditorCancel);
journalEditorDialog.addEventListener("cancel", function (event) {
  event.preventDefault();
  window.GrimorioJournalController.requestEditorCancel();
});
journalDiscardKeep.addEventListener("click", window.GrimorioJournalController.keepEditing);
journalDiscardConfirm.addEventListener("click", window.GrimorioJournalController.confirmDiscard);
journalDiscardDialog.addEventListener("cancel", function (event) {
  event.preventDefault();
  window.GrimorioJournalController.keepEditing();
});
journalDeleteCancel.addEventListener("click", window.GrimorioJournalController.cancelDelete);
journalDeleteConfirm.addEventListener("click", window.GrimorioJournalController.confirmDelete);
journalDeleteDialog.addEventListener("cancel", function (event) {
  event.preventDefault();
  window.GrimorioJournalController.cancelDelete();
});
document.addEventListener("keydown", window.GrimorioJournalController.focusSearchShortcut);
sheetImportItem.addEventListener("click", abrirSeletorDeItemDoInventario);
sheetItemFile.addEventListener("change", importarArquivoDeItem);
sheetReorganizeForItem.addEventListener("click", reorganizarMochilaParaItemPendente);
sheetRotatePendingItem.addEventListener("click", function () {
  const item = personagem.inventarioStaging;
  if (!item) return;
  selecionarItemDoInventario(item, "bench");
  girarItemAtivoDoInventario();
});
sheetDiscardPendingItem.addEventListener("click", descartarItemImportado);
sheetCancelItemImport.addEventListener("click", cancelarImportacaoDeItem);
sheetInventoryItemLayer.addEventListener("click", function (event) {
  if (Date.now() < inventoryClickSuppressedUntil) return;
  const button = event.target.closest("button[data-inventory-item-id]");
  if (!button) return;
  if (inventoryUIState.movingItemId && inventoryUIState.movingItemId !== button.dataset.inventoryItemId) {
    sheetInventoryPlacementStatus.textContent = "Conclua ou cancele o movimento atual antes de selecionar outro item.";
    return;
  }

  executarMutacaoDoInventario(function (_inventario, estadoDaInterface) {
    estadoDaInterface.selectedItemId = button.dataset.inventoryItemId;
    estadoDaInterface.selectedItemSource = { kind: "inventory", slot: null };
  }, { persistente: false });
});
sheetInventoryReceived.addEventListener("click", function (event) {
  if (Date.now() < inventoryClickSuppressedUntil) return;
  const grab = event.target.closest("[data-inventory-drag-source='bench']");
  const item = personagem.inventarioStaging;
  if (!grab || !item) return;
  executarMutacaoDoInventario(function (_inventario, estadoDaInterface) {
    estadoDaInterface.selectedItemId = item.id;
    estadoDaInterface.selectedItemSource = { kind: "bench", slot: null };
  }, { persistente: false });
});
sheetMoveItem.addEventListener("click", iniciarModoExplicitoDeMovimento);
sheetRotateItem.addEventListener("click", girarItemAtivoDoInventario);
sheetEquipItem.addEventListener("click", equiparItemSelecionado);
sheetEquipChoice.addEventListener("click", function (event) {
  const botao = event.target.closest("[data-equip-selected-slot]");
  if (botao) equiparItemSelecionadoNoSlot(botao.dataset.equipSelectedSlot);
});
sheetStoreItem.addEventListener("click", guardarItemSelecionadoNaMochila);
sheetUnequipItem.addEventListener("click", desequiparItemSelecionado);
sheetSwitchHandItem.addEventListener("click", trocarMaoDoItemSelecionado);
sheetInventoryEquipmentSlots.addEventListener("click", function (event) {
  if (Date.now() < inventoryClickSuppressedUntil) return;
  const slot = event.target.closest("button[data-equipment-slot]")?.dataset.equipmentSlot;
  if (!slot) return;
  const item = personagem.equipamentos?.[slot];
  if (item) {
    executarMutacaoDoInventario(function (_inventario, estadoDaInterface) {
      estadoDaInterface.selectedItemId = item.id;
      estadoDaInterface.selectedItemSource = { kind: "equipment", slot };
    }, { persistente: false });
  } else sheetInventoryPlacementStatus.textContent = `${rotuloDoSlotDeEquipamento(slot)} está vazio.`;
});
sheetDiscardItem.addEventListener("click", solicitarDescarteDoItemSelecionado);
sheetPositionRotate.addEventListener("click", girarItemAtivoDoInventario);
sheetPositionConfirm.addEventListener("click", confirmarPosicionamentoAtual);
sheetPositionCancel.addEventListener("click", function () {
  if (inventoryUIState.movingItemId) cancelarMovimentoDoInventario();
  else cancelarImportacaoDeItem();
});
inventoryRevealConfirm.addEventListener("click", animarItemDoRevealAteBancada);
inventoryRevealEquip.addEventListener("click", equiparItemPendenteAgora);
inventoryRevealEquipChoices.addEventListener("click", function (event) {
  const slot = event.target.closest("button[data-reveal-equip-slot]")?.dataset.revealEquipSlot;
  if (slot) equiparItemPendenteNoSlot(slot);
});
inventoryRevealDialog.addEventListener("cancel", function (event) {
  event.preventDefault();
  animarItemDoRevealAteBancada();
});
inventoryOccupiedConfirm.addEventListener("click", fecharFeedbackDeRecebimentoOcupado);
inventoryOccupiedDialog.addEventListener("cancel", function (event) {
  event.preventDefault();
  fecharFeedbackDeRecebimentoOcupado();
});
inventoryDiscardCancel.addEventListener("click", cancelarDescarteDoInventario);
inventoryDiscardConfirm.addEventListener("click", confirmarDescarteDoInventario);
inventoryDiscardDialog.addEventListener("cancel", function (event) {
  event.preventDefault();
  cancelarDescarteDoInventario();
});
sheetInventoryItemLayer.addEventListener("pointerdown", iniciarArrasteDeItem);
sheetInventoryReceived.addEventListener("pointerdown", iniciarArrasteDeItemRecebido);
sheetInventoryEquipmentSlots.addEventListener("pointerdown", iniciarArrasteDeEquipamento);
document.addEventListener("pointermove", atualizarArrasteDeItem, { passive: false });
document.addEventListener("pointerup", function (event) {
  encerrarArrasteDeItem(event, false);
});
document.addEventListener("pointercancel", function (event) {
  encerrarArrasteDeItem(event, true);
});
document.addEventListener("lostpointercapture", function (event) {
  if (inventoryDrag.pointerId === event.pointerId && ["grabbed", "dragging"].includes(inventoryDrag.phase)) {
    cancelarArrasteFisicoAtivo("A captura do gesto foi interrompida. O objeto voltou ao lugar.");
  }
});
window.addEventListener("blur", function () {
  cancelarArrasteFisicoAtivo("A janela perdeu o foco. O objeto voltou ao lugar.");
});
document.addEventListener("visibilitychange", function () {
  if (document.hidden) cancelarArrasteFisicoAtivo("A página foi ocultada. O objeto voltou ao lugar.");
});
document.addEventListener("keydown", function (event) {
  if (!["grabbed", "dragging"].includes(inventoryDrag.phase)) return;
  if (event.key === "Escape") {
    event.preventDefault();
    cancelarArrasteFisicoAtivo("Gesto cancelado. O objeto voltou ao lugar.");
    return;
  }
  if (event.key.toLowerCase() !== "r") return;
  event.preventDefault();
  girarArrasteFisicoDoInventario();
});
sheetInventoryGrid.addEventListener("pointermove", function (event) {
  if (inventoryDrag.phase !== "idle" || !obterItemEmPosicionamento()) return;
  const celula = obterPosicaoDaCelulaPeloPonteiro(event);
  if (celula) definirPosicaoCandidata(celula);
});
sheetInventoryCellLayer.addEventListener("click", function (event) {
  const celula = event.target.closest("button[data-x][data-y]");
  if (!celula || !obterItemEmPosicionamento()) return;
  definirPosicaoCandidata({ x: Number(celula.dataset.x), y: Number(celula.dataset.y) });
  confirmarPosicionamentoAtual();
});
sheetInventoryCellLayer.addEventListener("keydown", function (event) {
  const celula = event.target.closest("button[data-x][data-y]");
  if (!celula || !obterItemEmPosicionamento()) return;

  if (event.key === "Escape") {
    event.preventDefault();
    if (inventoryUIState.movingItemId) cancelarMovimentoDoInventario();
    else cancelarImportacaoDeItem();
    return;
  }
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    definirPosicaoCandidata({ x: Number(celula.dataset.x), y: Number(celula.dataset.y) });
    confirmarPosicionamentoAtual();
    return;
  }
  if (event.key.toLowerCase() === "r") {
    event.preventDefault();
    girarItemAtivoDoInventario();
    return;
  }

  const deslocamentos = {
    ArrowLeft: { x: -1, y: 0 },
    ArrowRight: { x: 1, y: 0 },
    ArrowUp: { x: 0, y: -1 },
    ArrowDown: { x: 0, y: 1 }
  };
  const deslocamento = deslocamentos[event.key];
  if (!deslocamento) return;
  event.preventDefault();
  definirPosicaoCandidata({
    x: Math.max(0, Math.min(CONFIGURACAO_DO_INVENTARIO.columns - 1, Number(celula.dataset.x) + deslocamento.x)),
    y: Math.max(0, Math.min(CONFIGURACAO_DO_INVENTARIO.rows - 1, Number(celula.dataset.y) + deslocamento.y))
  }, { focar: true });
});
sheetAbilitiesSummary.addEventListener("click", function (event) {
  const button = event.target.closest("button[data-ability-id]");
  if (button) ativarSecaoDaFicha("abilities", button.dataset.abilityId);
});
sheetAbilityList.addEventListener("click", function (event) {
  const emptyAction = event.target.closest("button[data-ability-empty-action='import']");
  if (emptyAction) {
    sheetImportAbility.click();
    return;
  }
  const button = event.target.closest("button[data-ability-id]");
  if (!button) return;
  habilidadeSelecionadaId = button.dataset.abilityId;
  renderizarListaDeHabilidades();
});
sheetAbilityDetails.addEventListener("click", function (event) {
  const button = event.target.closest("button[data-ability-action]");
  if (!button) return;

  const action = button.dataset.abilityAction;
  button.closest("details")?.removeAttribute("open");
  if (action === "decrease-uses") alterarUsosDaHabilidade(habilidadeSelecionadaId, -1);
  if (action === "increase-uses") alterarUsosDaHabilidade(habilidadeSelecionadaId, 1);
  if (action === "decrease-cooldown") alterarRecargaDaHabilidade(habilidadeSelecionadaId, -1);
  if (action === "increase-cooldown") alterarRecargaDaHabilidade(habilidadeSelecionadaId, 1);
  if (action === "change-icon") {
    const habilidade = encontrarHabilidade(habilidadeSelecionadaId);
    if (habilidade) abrirDialogDeIcone(habilidade, "icone");
  }
  if (action === "remove") solicitarRemocaoDaHabilidade();
});
sheetAbilitySearch.addEventListener("input", function () {
  buscaHabilidade = sheetAbilitySearch.value;
  renderizarListaDeHabilidades();
});
sheetAbilityTypeFilter.addEventListener("change", function () {
  filtroTipoHabilidade = sheetAbilityTypeFilter.value;
  renderizarListaDeHabilidades();
});
sheetAbilityTypeTabs.addEventListener("click", function (event) {
  const button = event.target.closest("button[data-ability-type-filter]");
  if (!button) return;
  filtroTipoHabilidade = button.dataset.abilityTypeFilter;
  sheetAbilityTypeFilter.value = filtroTipoHabilidade;
  renderizarListaDeHabilidades();
});
sheetAbilityStateFilter.addEventListener("change", function () {
  filtroEstadoHabilidade = sheetAbilityStateFilter.value;
  renderizarListaDeHabilidades();
});
sheetImportAbility.addEventListener("click", function () {
  sheetAbilityFile.value = "";
  sheetAbilityFile.click();
});
sheetAbilityFile.addEventListener("change", importarArquivoDeHabilidade);
abilityIconOptions.addEventListener("change", function (event) {
  if (event.target.matches('input[name="ability-icon"]')) {
    iconeHabilidadePendente = event.target.value;
  }
});
abilityImportCancel.addEventListener("click", function () {
  abilityImportDialog.close();
  habilidadePendente = null;
});
abilityImportConfirm.addEventListener("click", confirmarDialogDeHabilidade);
abilityRemoveCancel.addEventListener("click", function () {
  abilityRemoveDialog.close();
});
abilityRemoveConfirm.addEventListener("click", removerHabilidadeSelecionada);
sheetLifeMinus.addEventListener("click", function () { alterarVidaAtual(-1); });
sheetLifePlus.addEventListener("click", function () { alterarVidaAtual(1); });
sheetLifeCurrent.addEventListener("blur", function () {
  definirVidaAtual(sheetLifeCurrent.value);
});
sheetManaMinus.addEventListener("click", function () { alterarManaAtual(-1); });
sheetManaPlus.addEventListener("click", function () { alterarManaAtual(1); });
sheetManaCurrent.addEventListener("blur", function () {
  definirManaAtual(sheetManaCurrent.value);
});
identityForm.addEventListener("submit", function (event) {
  event.preventDefault();
  abrirEtapaEspecie(true);
});

fields.forEach(function ([input, errorElement]) {
  input.addEventListener("input", function () {
    atualizarPersonagem();
    definirErro(input, errorElement, "");
  });
});

originForm.addEventListener("submit", function (event) {
  event.preventDefault();
  abrirEtapaAtributos();
});

[originTitleInput, originPlaceInput].forEach(function (input) {
  input.addEventListener("input", function () {
    atualizarOrigem();
    definirErro(input, input === originTitleInput ? originTitleError : input === originPlaceInput ? originPlaceError : originStoryError, "");
  });
});

originStoryInput.addEventListener("input", function () {
  atualizarHistoriaDaOrigem();
  definirErroDaHistoria("");
});

originStoryOpen.addEventListener("click", function () {
  abrirEditorDaHistoria(originStoryOpen);
});
sheetEditHistory.addEventListener("click", function () {
  abrirEditorDaHistoria(sheetEditHistory);
});
originStoryClose.addEventListener("click", cancelarEditorDaHistoria);
originStoryCancel.addEventListener("click", cancelarEditorDaHistoria);
originStorySave.addEventListener("click", salvarHistoriaDoEditor);
originStoryDialog.addEventListener("cancel", function (event) {
  event.preventDefault();
  cancelarEditorDaHistoria();
});
originStoryDialog.addEventListener("close", function () {
  document.body.classList.remove("origin-story-is-open");
  limparPerguntaDeInspiracao();
});

originPromptList.addEventListener("click", function (event) {
  const button = event.target.closest("button[data-origin-question]");
  if (button) usarPerguntaDeInspiracao(button.dataset.originQuestion);
});

attributesList.addEventListener("click", function (event) {
  const button = event.target.closest("button[data-attribute-action]");
  if (!button) return;

  if (button.dataset.attributeAction === "increase") aumentarAtributo(button.dataset.attribute);
  if (button.dataset.attributeAction === "decrease") diminuirAtributo(button.dataset.attribute);
});

attributesTabButton.addEventListener("click", function () {
  selecionarAbaDosAtributos("atributos");
});

skillsTabButton.addEventListener("click", function () {
  selecionarAbaDosAtributos("pericias");
});

skillsList.addEventListener("change", function (event) {
  const input = event.target;
  if (!(input instanceof HTMLInputElement) || !input.dataset.skillId) return;
  alternarTreinamentoDaPericia(input.dataset.skillId, input.checked);
});

skillsPrevPage.addEventListener("click", function () {
  mudarPaginaDePericias(-1);
});

skillsNextPage.addEventListener("click", function () {
  mudarPaginaDePericias(1);
});

speciesList.addEventListener("click", function (event) {
  const button = event.target.closest("button[data-species-id]");
  if (button) selecionarEspecie(button.dataset.speciesId);
});

speciesOptions.addEventListener("change", function (event) {
  const input = event.target;
  if (!(input instanceof HTMLInputElement)) return;

  if (input.name === "human-bonus") selecionarBonusHumano(input.value, input.checked);
  if (input.name === "human-affinity") selecionarAfinidade(input.value);
  if (input.name === "species-variant") selecionarVariante(input.value);
  if (input.name === "quimeric-attribute") selecionarAtributoQuimerico(input.value);
});

classCategories.addEventListener("click", function (event) {
  const button = event.target.closest("button[data-class-category]");
  if (button) selecionarCategoriaDeClasse(button.dataset.classCategory);
});

classList.addEventListener("click", function (event) {
  const button = event.target.closest("button[data-class-id]");
  if (button) selecionarClasse(button.dataset.classId);
});

classPagePrevious.addEventListener("click", function () { mudarPaginaDeClasses(-1); });
classPageNext.addEventListener("click", function () { mudarPaginaDeClasses(1); });
importClassButton.addEventListener("click", abrirImportacaoDeClasse);
classJsonInput.addEventListener("change", importarClasse);

classTabs.addEventListener("click", function (event) {
  const button = event.target.closest("button[data-class-tab]");
  if (button) {
    selecionarAbaDaClasse(button.dataset.classTab, false);
    animarEntradaDoPainelDaClasse();
  }
});

classTabs.addEventListener("keydown", function (event) {
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
  const tabs = Array.from(classTabs.querySelectorAll("[role='tab']"));
  const atual = tabs.indexOf(document.activeElement);
  if (atual < 0) return;
  event.preventDefault();
  let proximo = atual;
  if (event.key === "ArrowLeft") proximo = (atual - 1 + tabs.length) % tabs.length;
  if (event.key === "ArrowRight") proximo = (atual + 1) % tabs.length;
  if (event.key === "Home") proximo = 0;
  if (event.key === "End") proximo = tabs.length - 1;
  selecionarAbaDaClasse(tabs[proximo].dataset.classTab, true);
  animarEntradaDoPainelDaClasse();
});

choosePortraitButton.addEventListener("click", abrirSeletorDeRetrato);
removePortraitButton.addEventListener("click", removerRetrato);
portraitInput.addEventListener("change", selecionarRetrato);
portraitCropRange.addEventListener("input", function () {
  definirZoomDoRecorte(portraitCropRange.value);
});
portraitCropCanvas.addEventListener("pointerdown", iniciarArrasteDoRecorte);
portraitCropCanvas.addEventListener("pointermove", arrastarRecorte);
portraitCropCanvas.addEventListener("pointerup", encerrarArrasteDoRecorte);
portraitCropCanvas.addEventListener("pointercancel", encerrarArrasteDoRecorte);
portraitCropCanvas.addEventListener("keydown", controlarRecortePeloTeclado);
portraitCropCancel.addEventListener("click", fecharEditorDeRecorte);
portraitCropApply.addEventListener("click", aplicarRecorteDoRetrato);
portraitCropDialog.addEventListener("close", function () {
  document.body.classList.remove("portrait-crop-is-open");
  estadoDoRecorteDoRetrato = null;
  ponteiroDoRecorteDoRetrato = null;
  portraitCropCanvas.classList.remove("is-dragging");
});
importButton.addEventListener("click", abrirSeletorDeArquivo);
fileInput.addEventListener("change", selecionarArquivo);
masterButton.addEventListener("click", mostrarAvisoDoMestre);

ativarMicrointeracoes(document);
ativarMovimentoDaArteDaEspecie();
renderizarEspecies();
renderizarCategoriasDeClasse();
renderizarClasses();
renderizarSimboloDaClasse();
renderizarDetalhesDaClasse();
