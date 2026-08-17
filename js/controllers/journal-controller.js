(function exposeGrimorioJournalController(global) {
  "use strict";

  const domain = global.GrimorioJournalDomain;
  const view = global.GrimorioJournalView;
  const state = global.GrimorioUIState.createJournalUIState();
  let suppressNextQuickFocus = false;

  function allEntries() {
    return domain.ordenarRegistros(personagem.registros || []);
  }

  function selectedEntry() {
    return (personagem.registros || []).find(function findEntry(entry) {
      return entry.id === state.selectedId;
    }) || null;
  }

  function filteredEntries(entries) {
    return domain.filtrarRegistros(entries, {
      query: state.query,
      tipo: state.typeFilter,
      somenteFixados: state.pinnedOnly
    });
  }

  function ensureSelection(entries) {
    if (entries.some(function isSelected(entry) { return entry.id === state.selectedId; })) return;
    if (!selectedEntry()) state.selectedId = entries[0]?.id || null;
  }

  function announce(message) {
    journalLiveStatus.textContent = "";
    window.setTimeout(function writeAnnouncement() { journalLiveStatus.textContent = message; }, 0);
  }

  function render() {
    const entries = allEntries();
    const filtered = filteredEntries(entries);
    ensureSelection(filtered);
    view.render(sheetJournalView, {
      entries: filtered,
      allEntries: entries,
      selectedId: state.selectedId,
      newlyAddedId: state.newlyAddedId,
      query: state.query,
      typeFilter: state.typeFilter,
      pinnedOnly: state.pinnedOnly,
      totalCount: entries.length
    }, {
      onSelect: selectEntry,
      onCreate: openCreate,
      onClearFilters: clearFilters
    });
  }

  function activate() {
    render();
    view.animateEntry(sheetJournalView);
  }

  function selectEntry(id) {
    state.selectedId = id;
    state.newlyAddedId = null;
    render();
  }

  function setQuickExpanded(expanded) {
    journalQuickExpanded.hidden = !expanded;
    journalQuickCapture.classList.toggle("is-expanded", expanded);
    if (!expanded) {
      journalQuickError.textContent = "";
      journalQuickTitle.removeAttribute("aria-invalid");
    }
  }

  function expandQuickCapture() {
    if (suppressNextQuickFocus) {
      suppressNextQuickFocus = false;
      return;
    }
    setQuickExpanded(true);
  }

  function resetQuickCapture(options) {
    journalQuickTitle.value = "";
    journalQuickContent.value = "";
    journalQuickType.value = "nota";
    setQuickExpanded(false);
    if (options?.focus) journalQuickTitle.focus({ preventScroll: true });
  }

  function cancelQuickCapture() {
    suppressNextQuickFocus = true;
    resetQuickCapture({ focus: true });
  }

  function handleQuickEscape(event) {
    if (event.key !== "Escape") return;
    if (!journalQuickTitle.value.trim() && !journalQuickContent.value.trim()) {
      event.preventDefault();
      setQuickExpanded(false);
      suppressNextQuickFocus = true;
      journalQuickTitle.focus({ preventScroll: true });
      return;
    }
    event.preventDefault();
    journalQuickCancel.focus({ preventScroll: true });
  }

  function submitQuickCapture(event) {
    event?.preventDefault();
    try {
      const entry = domain.normalizarRegistro({
        tipo: journalQuickType.value,
        titulo: journalQuickTitle.value,
        conteudo: journalQuickContent.value
      });
      personagem.registros.push(entry);
      state.selectedId = entry.id;
      state.newlyAddedId = entry.id;
      marcarFichaComoAlterada();
      resetQuickCapture();
      render();
      announce("Registro adicionado à jornada.");
      journalReaderTitle.focus({ preventScroll: true });
    } catch (error) {
      journalQuickError.textContent = error.message;
      journalQuickTitle.setAttribute("aria-invalid", "true");
      journalQuickTitle.focus({ preventScroll: true });
    }
  }

  function quickCaptureKeydown(event) {
    if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) submitQuickCapture(event);
    else handleQuickEscape(event);
  }

  function emptyDraft() {
    return {
      tipo: "nota",
      titulo: "",
      conteudo: "",
      data: "",
      sessao: "",
      marcadores: [],
      fixado: false
    };
  }

  function cloneEntry(entry) {
    return JSON.parse(JSON.stringify(entry));
  }

  function readEditor() {
    return {
      tipo: journalEditorType.value,
      titulo: journalEditorTitle.value,
      conteudo: journalEditorContent.value,
      sessao: journalEditorSession.value,
      data: journalEditorDate.value,
      marcadores: journalEditorTags.value.split(/[,\n]/).map(function trimTag(tag) { return tag.trim(); }).filter(Boolean),
      fixado: journalEditorPinned.checked
    };
  }

  function editorChanged() {
    if (!state.draft) return false;
    const original = {
      tipo: state.draft.tipo,
      titulo: state.draft.titulo,
      conteudo: state.draft.conteudo,
      sessao: state.draft.sessao,
      data: state.draft.data,
      marcadores: state.draft.marcadores,
      fixado: state.draft.fixado
    };
    return JSON.stringify(readEditor()) !== JSON.stringify(original);
  }

  function clearEditorErrors() {
    journalEditorErrorSummary.textContent = "";
    journalEditorTitleError.textContent = "";
    journalEditorTitle.removeAttribute("aria-invalid");
  }

  function fillEditor(draft) {
    journalEditorType.value = draft.tipo;
    journalEditorTitle.value = draft.titulo;
    journalEditorContent.value = draft.conteudo;
    journalEditorSession.value = draft.sessao;
    journalEditorDate.value = draft.data;
    journalEditorTags.value = draft.marcadores.join(", ");
    journalEditorPinned.checked = draft.fixado;
  }

  function openEditor(mode, trigger) {
    const entry = mode === "edit" ? selectedEntry() : null;
    if (mode === "edit" && !entry) return;
    state.mode = mode;
    state.draft = entry ? cloneEntry(entry) : emptyDraft();
    state.returnFocusTo = trigger || document.activeElement;
    journalEditorHeading.textContent = mode === "edit" ? "Editar registro" : "Novo registro";
    fillEditor(state.draft);
    clearEditorErrors();
    journalEditorDialog.showModal();
    journalEditorTitle.focus({ preventScroll: true });
  }

  function openCreate(trigger) {
    openEditor("create", trigger || journalCreate);
  }

  function openEdit(trigger) {
    openEditor("edit", trigger || journalReaderEdit);
  }

  function closeEditor(options) {
    const returnTarget = state.returnFocusTo;
    journalEditorDialog.close();
    state.mode = null;
    state.draft = null;
    state.returnFocusTo = null;
    if (options?.restoreFocus && returnTarget?.isConnected) returnTarget.focus({ preventScroll: true });
  }

  function requestEditorCancel() {
    if (!editorChanged()) {
      closeEditor({ restoreFocus: true });
      return;
    }
    journalDiscardDialog.showModal();
    journalDiscardKeep.focus({ preventScroll: true });
  }

  function keepEditing() {
    journalDiscardDialog.close();
    journalEditorTitle.focus({ preventScroll: true });
  }

  function confirmDiscard() {
    journalDiscardDialog.close();
    closeEditor({ restoreFocus: true });
  }

  function showEditorError(error) {
    const message = error?.message || "Revise os campos do registro.";
    journalEditorErrorSummary.textContent = message;
    if (error?.code === "invalid-titulo") {
      journalEditorTitleError.textContent = message;
      journalEditorTitle.setAttribute("aria-invalid", "true");
      journalEditorTitle.focus({ preventScroll: true });
    } else journalEditorErrorSummary.focus({ preventScroll: true });
  }

  function submitEditor(event) {
    event?.preventDefault();
    clearEditorErrors();
    try {
      const values = readEditor();
      let saved;
      if (state.mode === "edit") {
        const current = selectedEntry();
        const now = new Date().toISOString();
        saved = domain.normalizarColecaoRegistros([{
          ...values,
          id: current.id,
          criadoEm: current.criadoEm,
          atualizadoEm: now
        }])[0];
        const index = personagem.registros.findIndex(function findIndex(entry) { return entry.id === current.id; });
        personagem.registros[index] = saved;
      } else {
        saved = domain.normalizarRegistro(values);
        personagem.registros.push(saved);
      }
      const created = state.mode === "create";
      state.selectedId = saved.id;
      state.newlyAddedId = created ? saved.id : null;
      marcarFichaComoAlterada();
      closeEditor();
      render();
      view.animateSaved(sheetJournalView);
      announce(created ? "Registro adicionado à jornada." : "Registro atualizado.");
      journalReaderTitle.focus({ preventScroll: true });
    } catch (error) {
      showEditorError(error);
    }
  }

  function togglePinned() {
    const entry = selectedEntry();
    if (!entry) return;
    entry.fixado = !entry.fixado;
    entry.atualizadoEm = new Date().toISOString();
    marcarFichaComoAlterada();
    render();
    journalReaderPin.focus({ preventScroll: true });
    announce(entry.fixado ? "Registro fixado." : "Registro desfixado.");
  }

  function requestDelete() {
    const entry = selectedEntry();
    if (!entry) return;
    state.returnFocusTo = journalReaderDelete;
    journalDeleteDescription.textContent = "Excluir “" + entry.titulo + "”? Esta ação remove o registro da ficha exportada.";
    journalDeleteDialog.showModal();
    journalDeleteCancel.focus({ preventScroll: true });
  }

  function cancelDelete() {
    journalDeleteDialog.close();
    journalReaderDelete.focus({ preventScroll: true });
  }

  function confirmDelete() {
    const ordered = allEntries();
    const index = ordered.findIndex(function findIndex(entry) { return entry.id === state.selectedId; });
    const nextId = ordered[index + 1]?.id || ordered[index - 1]?.id || null;
    personagem.registros = personagem.registros.filter(function keep(entry) { return entry.id !== state.selectedId; });
    state.selectedId = nextId;
    state.newlyAddedId = null;
    journalDeleteDialog.close();
    marcarFichaComoAlterada();
    render();
    announce("Registro excluído da jornada.");
    if (nextId) {
      sheetJournalView.querySelector('[data-journal-entry-id="' + CSS.escape(nextId) + '"]')?.focus({ preventScroll: true });
    } else journalCreate.focus({ preventScroll: true });
  }

  function setQuery(value) {
    state.query = value;
    render();
  }

  function setTypeFilter(value) {
    state.typeFilter = value;
    render();
  }

  function setPinnedOnly(value) {
    state.pinnedOnly = value === true;
    render();
  }

  function clearFilters() {
    state.query = "";
    state.typeFilter = "";
    state.pinnedOnly = false;
    journalSearch.value = "";
    journalTypeFilter.value = "";
    journalPinnedOnly.checked = false;
    render();
    journalSearch.focus({ preventScroll: true });
  }

  function focusSearchShortcut(event) {
    const tag = document.activeElement?.tagName;
    if (event.key !== "/" || ["INPUT", "TEXTAREA", "SELECT"].includes(tag) || journalEditorDialog.open) return;
    event.preventDefault();
    journalSearch.focus({ preventScroll: true });
  }

  function backToList() {
    const card = sheetJournalView.querySelector('[data-journal-entry-id="' + CSS.escape(state.selectedId || "") + '"]');
    card?.focus({ preventScroll: true });
    card?.scrollIntoView({ block: "center", behavior: "smooth" });
  }

  global.GrimorioJournalController = Object.freeze({
    render,
    activate,
    expandQuickCapture,
    cancelQuickCapture,
    quickCaptureKeydown,
    submitQuickCapture,
    openCreate,
    openEdit,
    requestEditorCancel,
    keepEditing,
    confirmDiscard,
    submitEditor,
    togglePinned,
    requestDelete,
    cancelDelete,
    confirmDelete,
    setQuery,
    setTypeFilter,
    setPinnedOnly,
    clearFilters,
    focusSearchShortcut,
    backToList
  });
})(window);
