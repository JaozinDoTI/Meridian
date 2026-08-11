const visaoDoInventario = window.GrimorioInventoryView.createInventoryView({
  domain: dominioDoInventario,
  rarityConfig: CONFIGURACAO_DE_RARIDADE,
  itemTypeConfig: CONFIGURACAO_DE_TIPO_DE_ITEM,
  itemTypeSymbols: SIMBOLOS_DE_TIPO_DE_ITEM,
  failedImages: imagensDeItemComFalha,
  createItemCard: window.GrimorioInventoryCards.createItemCard
});
const {
  getVisualConfig: obterConfiguracaoVisualDoItem,
  configureArtOrientation: configurarOrientacaoVisualDaArte,
  preloadItemImage: preloadImagemDoItem,
  createItemArt: criarArteDoItem,
  createCard: criarCartaDoItem,
  updateCardFormat: atualizarFormatoDaCarta,
  formatWeight: formatarPeso,
  createTextElement: criarElementoComTexto
} = visaoDoInventario;

function obterItemDoInventarioPorId(itemId) {
  return personagem.inventario.find(function (item) {
    return item.id === itemId;
  }) || null;
}

function selecionarItemDoInventario(item, origem, slot = null) {
  if (!item?.id) return false;
  inventoryUIState.selectedItemId = item.id;
  inventoryUIState.selectedItemSource = {
    kind: origem,
    slot: origem === "equipment" ? slot : null
  };
  return true;
}

function limparSelecaoDoInventario() {
  inventoryUIState.selectedItemId = null;
  inventoryUIState.selectedItemSource = null;
}

function obterSelecaoAtualDoInventario() {
  const itemId = inventoryUIState.selectedItemId;
  if (!itemId) return null;
  const origem = inventoryUIState.selectedItemSource || { kind: "inventory", slot: null };

  if (origem.kind === "bench") {
    const item = personagem.inventarioStaging;
    return item?.id === itemId ? { item, kind: "bench", slot: null } : null;
  }
  if (origem.kind === "equipment") {
    const item = personagem.equipamentos?.[origem.slot] || null;
    return item?.id === itemId ? { item, kind: "equipment", slot: origem.slot } : null;
  }

  const item = obterItemDoInventarioPorId(itemId);
  return item ? { item, kind: "inventory", slot: null } : null;
}

function rotuloDaOrigemDoItem(selecao) {
  if (!selecao) return "Inventário";
  if (selecao.kind === "bench") return "Recebimento";
  if (selecao.kind === "equipment") return rotuloDoSlotDeEquipamento(selecao.slot);
  return "Mochila";
}

function obterIdsReservadosDoInventario() {
  const ids = new Set(personagem.inventario.map(function (item) { return item.id; }));
  Object.values(personagem.equipamentos || {}).forEach(function (item) {
    if (item?.id) ids.add(item.id);
  });
  if (personagem.inventarioStaging?.id) ids.add(personagem.inventarioStaging.id);
  return ids;
}

function normalizarEquipamentosPersistidos(equipamentos, inventario) {
  const origem = ehObjetoDeDados(equipamentos) ? equipamentos : {};
  const idsReservados = new Set((inventario || []).map(function (item) { return item.id; }));
  const resultado = { armadura: null, maoPrincipal: null, maoSecundaria: null };

  ["armadura", "maoPrincipal", "maoSecundaria"].forEach(function (slot) {
    const bruto = origem[slot];
    if (bruto === undefined || bruto === null || bruto === "") return;
    const ehInstancia = ehObjetoDeDados(bruto) && ehObjetoDeDados(bruto.item);
    const definicao = dominioDoInventario.normalizeItemDefinition(
      ehInstancia ? bruto.item : bruto,
      { allowLegacyString: true, allowDefaultSize: true }
    );
    resultado[slot] = dominioDoInventario.normalizeInventoryItem({
      id: ehInstancia ? bruto.id : undefined,
      item: definicao,
      posicao: { x: 0, y: 0 },
      rotacao: ehInstancia && [0, 90].includes(bruto.rotacao) ? bruto.rotacao : 0
    }, {
      usedIds: idsReservados,
      preserveValidId: true
    });
  });
  return resultado;
}

function normalizarItemPersistidoNaBancada(itemBruto, inventario, equipamentos) {
  if (itemBruto === undefined || itemBruto === null || itemBruto === "") return null;
  const idsReservados = new Set((inventario || []).map(function (item) { return item.id; }));
  Object.values(equipamentos || {}).forEach(function (item) {
    if (item?.id) idsReservados.add(item.id);
  });
  const ehInstancia = ehObjetoDeDados(itemBruto) && ehObjetoDeDados(itemBruto.item);
  const definicao = dominioDoInventario.normalizeItemDefinition(
    ehInstancia ? itemBruto.item : itemBruto,
    { allowLegacyString: true, allowDefaultSize: true }
  );
  return dominioDoInventario.normalizeInventoryItem({
    id: ehInstancia ? itemBruto.id : undefined,
    item: definicao,
    posicao: { x: 0, y: 0 },
    rotacao: ehInstancia && [0, 90].includes(itemBruto.rotacao) ? itemBruto.rotacao : 0
  }, {
    usedIds: idsReservados,
    preserveValidId: true
  });
}

function resetarEstadoTransitorioDoInventario() {
  inventoryUIState.reorganizingForPending = false;
  inventoryUIState.movingItemId = null;
  inventoryUIState.selectedItemId = null;
  inventoryUIState.selectedItemSource = null;
  inventoryUIState.hoveredCell = null;
  inventoryUIState.candidatePosition = null;
  inventoryUIState.discardingItemId = null;
  limparEstadoFisicoDoInventario();
}

function obterDisponibilidadeDoItemPendente() {
  const itemPendente = personagem.inventarioStaging;
  if (!itemPendente) return null;

  return dominioDoInventario.getInventoryPlacementAvailability(
    personagem.inventario,
    itemPendente,
    { rotation: itemPendente.rotacao }
  );
}

function obterItemEmPosicionamento() {
  const itemFisico = obterItemDoArrasteFisico();
  if (itemFisico) return itemFisico;
  if (inventoryUIState.movingItemId) {
    return obterItemDoInventarioPorId(inventoryUIState.movingItemId);
  }
  // Staging persistente não é, por si só, um estado de posicionamento.
  return inventoryUIState.candidatePosition ? personagem.inventarioStaging : null;
}

function avaliarPosicionamentoAtual() {
  const item = obterItemEmPosicionamento();
  const posicao = inventoryUIState.candidatePosition;
  if (!item || !posicao) return null;

  return dominioDoInventario.canPlaceItem(personagem.inventario, item, posicao, {
    rotation: item.rotacao,
    ignoreItemId: inventoryDrag.phase !== "idle"
      ? (inventoryDrag.source?.kind === "inventory" ? item.id : undefined)
      : inventoryUIState.movingItemId || undefined
  });
}

function descreverResultadoDoPosicionamento(resultado) {
  if (!resultado) return "Escolha uma célula da mochila.";
  const dimensoes = resultado.dimensions
    ? `${resultado.dimensions.largura} × ${resultado.dimensions.altura}`
    : "esta peça";
  if (resultado.valid) return `Cabe — ${dimensoes}. Confirme para concluir.`;
  if (resultado.code === "item-too-large") return "O item é maior do que os limites da mochila.";
  if (resultado.detail === "collision") {
    const itemEmConflito = obterItemDoInventarioPorId(resultado.conflictingItemId);
    const nome = itemEmConflito?.item?.nome || "outro item";
    return `Colisão com ${nome} — ${dimensoes}.`;
  }
  return `Fora dos limites — ${dimensoes}.`;
}

function definirMensagemNeutraDaMochila() {
  sheetInventoryPlacementStatus.textContent = "Selecione ou arraste uma peça para organizar a mochila.";
}

function removerPreviewDoInventarioComFade() {
  const elementos = Array.from(sheetInventoryPreviewLayer.children);
  if (!elementos.length) return;
  if (deveReduzirMovimento()) {
    sheetInventoryPreviewLayer.replaceChildren();
    return;
  }
  elementos.forEach(function (elemento) {
    if (elemento.classList.contains("is-preview-exiting")) return;
    elemento.classList.add("is-preview-exiting");
    window.GrimorioInventoryMotion.animatePreviewExit(elemento, {
      reduceMotion: false
    }).finally(function () {
      elemento.remove();
    });
  });
}

function clearBackpackPreview(opcoes = {}) {
  inventoryUIState.candidatePosition = null;
  inventoryUIState.hoveredCell = null;
  sheetInventoryCellLayer.querySelectorAll(".sheet-inventory-cell").forEach(function (celula) {
    celula.classList.remove("is-preview-valid", "is-preview-invalid");
  });
  removerPreviewDoInventarioComFade();
  sheetInventoryGrid.classList.remove(
    "is-positioning",
    "has-valid-preview",
    "has-invalid-preview",
    "is-dragging-item"
  );
  if (opcoes.restaurarMensagem !== false) definirMensagemNeutraDaMochila();
}

function renderizarPreviewDoInventario() {
  const dragEspacialAtivo = inventoryDrag.phase === "dragging"
    && inventoryDrag.target === "backpack";
  const item = obterItemEmPosicionamento();
  const posicao = inventoryUIState.candidatePosition;
  const resultado = avaliarPosicionamentoAtual();

  sheetInventoryGrid.classList.toggle("is-positioning", dragEspacialAtivo);
  sheetInventoryGrid.classList.toggle("has-valid-preview", Boolean(resultado?.valid));
  sheetInventoryGrid.classList.toggle("has-invalid-preview", Boolean(resultado && !resultado.valid));

  // Regra V3.1: ghost existe somente durante drag físico sobre a mochila.
  if (!dragEspacialAtivo || !item || !posicao || !resultado) {
    sheetInventoryGrid.classList.remove("has-valid-preview", "has-invalid-preview");
    removerPreviewDoInventarioComFade();
    return;
  }

  const fragmento = document.createDocumentFragment();
  const classeDeEstado = resultado.valid ? "is-valid" : "is-invalid";
  const geometria = medirGeometriaDaGradeDoInventario();
  const itemIdIgnorado = inventoryDrag.source?.kind === "inventory"
    ? item.id
    : inventoryUIState.movingItemId;
  const inventarioParaMatriz = itemIdIgnorado
    ? personagem.inventario.filter(function (entrada) { return entrada.id !== itemIdIgnorado; })
    : personagem.inventario;
  const matriz = dominioDoInventario.createOccupancyMatrix(inventarioParaMatriz);
  resultado.cells.forEach(function (celula, indice) {
    const fora = celula.x < 0
      || celula.y < 0
      || celula.x >= CONFIGURACAO_DO_INVENTARIO.columns
      || celula.y >= CONFIGURACAO_DO_INVENTARIO.rows;
    const colide = !fora && matriz[celula.y][celula.x] !== null;
    const marcador = document.createElement("span");
    marcador.className = `sheet-inventory-preview-cell ${classeDeEstado}`;
    marcador.classList.toggle("is-outside", fora);
    marcador.classList.toggle("is-collision", colide);
    marcador.classList.toggle("is-clear-invalid", !resultado.valid && !fora && !colide);
    marcador.style.left = `${celula.x * geometria.stepX}px`;
    marcador.style.top = `${celula.y * geometria.stepY}px`;
    marcador.style.width = `${geometria.cellWidth}px`;
    marcador.style.height = `${geometria.cellHeight}px`;
    marcador.style.setProperty("--preview-index", String(indice));
    fragmento.append(marcador);
  });

  const contorno = document.createElement("span");
  contorno.className = `sheet-inventory-preview-footprint ${classeDeEstado}`;
  contorno.classList.toggle("is-moving", Boolean(inventoryUIState.movingItemId));
  contorno.style.left = `${posicao.x * geometria.stepX}px`;
  contorno.style.top = `${posicao.y * geometria.stepY}px`;
  contorno.style.width = `${geometria.cellWidth * resultado.dimensions.largura + geometria.columnGap * (resultado.dimensions.largura - 1)}px`;
  contorno.style.height = `${geometria.cellHeight * resultado.dimensions.altura + geometria.rowGap * (resultado.dimensions.altura - 1)}px`;
  contorno.style.animationDelay = `${Math.min(resultado.cells.length * 12, 80)}ms`;
  contorno.dataset.label = resultado.valid
    ? `✓ Cabe — ${resultado.dimensions.largura} × ${resultado.dimensions.altura}`
    : resultado.detail === "collision"
      ? "× Colisão"
      : "× Fora";
  fragmento.append(contorno);
  sheetInventoryPreviewLayer.replaceChildren(fragmento);
}

function atualizarFeedbackVisualDoPosicionamento() {
  const resultado = avaliarPosicionamentoAtual();
  const chaves = new Set((resultado?.cells || []).map(function (celula) {
    return `${celula.x}:${celula.y}`;
  }));

  sheetInventoryCellLayer.querySelectorAll(".sheet-inventory-cell").forEach(function (celula) {
    const fazParte = chaves.has(`${celula.dataset.x}:${celula.dataset.y}`);
    celula.classList.toggle("is-preview-valid", fazParte && resultado?.valid === true);
    celula.classList.toggle("is-preview-invalid", fazParte && resultado?.valid === false);
  });
  renderizarPreviewDoInventario();

  if (resultado) {
    if (inventoryDrag.phase === "dragging" && inventoryDrag.target === "backpack") {
      sheetInventoryPlacementStatus.textContent = resultado.valid
        ? `Solte para guardar · ${resultado.dimensions.largura} × ${resultado.dimensions.altura}`
        : descreverResultadoDoPosicionamento(resultado);
    } else {
      sheetInventoryPlacementStatus.textContent = descreverResultadoDoPosicionamento(resultado);
    }
  }
}

function renderizarResumoDoInventario(celulasUsadas) {
  const capacidade = CONFIGURACAO_DO_INVENTARIO.capacity;
  const celulasLivres = capacidade - celulasUsadas;
  const percentualOcupado = capacidade > 0 ? (celulasUsadas / capacidade) * 100 : 0;
  const rotuloOcupadas = celulasUsadas === 1 ? "célula ocupada" : "células ocupadas";
  const rotuloLivres = celulasLivres === 1 ? "célula livre" : "células livres";
  const shell = sheetInventoryCapacity.closest(".inventory-shell");
  shell?.classList.toggle("is-full", celulasLivres === 0);

  if (sheetInventoryUsedCells) sheetInventoryUsedCells.textContent = `${celulasUsadas} de ${capacidade} ${rotuloOcupadas}`;
  if (sheetInventoryFreeCells) sheetInventoryFreeCells.textContent = `${celulasLivres} ${rotuloLivres}`;
  sheetInventoryCapacity.textContent = `${celulasUsadas} / ${capacidade} células`;
  if (sheetInventoryOccupancy) {
    sheetInventoryOccupancy.setAttribute("aria-valuemax", String(capacidade));
    sheetInventoryOccupancy.setAttribute("aria-valuenow", String(celulasUsadas));
    sheetInventoryOccupancy.setAttribute("aria-valuetext", `${celulasUsadas} de ${capacidade} células ocupadas`);
  }
  if (sheetInventoryOccupancyBar) sheetInventoryOccupancyBar.style.width = `${percentualOcupado}%`;

  if (celulasUsadas === 0) {
    if (sheetInventorySummaryStatus) sheetInventorySummaryStatus.textContent = "A mochila está vazia e pronta para receber itens.";
  } else if (celulasUsadas === capacidade) {
    if (sheetInventorySummaryStatus) sheetInventorySummaryStatus.textContent = "A mochila está completamente ocupada.";
  } else {
    const quantidadeDeItens = personagem.inventario.length;
    const rotuloDeItens = quantidadeDeItens === 1 ? "item organizado" : "itens organizados";
    if (sheetInventorySummaryStatus) sheetInventorySummaryStatus.textContent = `${quantidadeDeItens} ${rotuloDeItens} na mochila.`;
  }
}

function renderizarAcoesDePosicionamento() {
  const item = obterItemEmPosicionamento();
  const emPosicionamento = inventoryDrag.phase === "idle"
    && Boolean(item)
    && Boolean(inventoryUIState.candidatePosition || inventoryUIState.movingItemId);
  sheetInventoryPositionActions.hidden = !emPosicionamento;
  if (!emPosicionamento) return;

  const dimensoesOriginais = item.item.tamanho;
  const resultado = avaliarPosicionamentoAtual();
  sheetPositionRotate.hidden = dimensoesOriginais.largura === dimensoesOriginais.altura;
  sheetPositionConfirm.disabled = !resultado?.valid;
  sheetPositionConfirm.setAttribute("aria-disabled", String(!resultado?.valid));
}

function sincronizarConfiguracaoVisualDaMochila(celulasUsadas) {
  const { columns, rows, capacity } = CONFIGURACAO_DO_INVENTARIO;
  const descricao = `Mochila com ${columns} colunas e ${rows} linhas; ${celulasUsadas} de ${capacity} células ocupadas.`;

  sheetInventoryGrid.style.setProperty("--inventory-columns", String(columns));
  sheetInventoryGrid.style.setProperty("--inventory-rows", String(rows));
  sheetInventoryGrid.dataset.columns = String(columns);
  sheetInventoryGrid.dataset.rows = String(rows);
  sheetInventoryGrid.setAttribute("aria-label", descricao);
  sheetInventoryGridScroll.setAttribute("aria-label", descricao);
  sheetInventoryCellLayer.style.setProperty("--inventory-columns", String(columns));
  sheetInventoryCellLayer.style.setProperty("--inventory-rows", String(rows));
  sheetInventoryPreviewLayer.style.setProperty("--inventory-columns", String(columns));
  sheetInventoryPreviewLayer.style.setProperty("--inventory-rows", String(rows));
  sheetInventoryItemLayer.style.setProperty("--inventory-columns", String(columns));
  sheetInventoryItemLayer.style.setProperty("--inventory-rows", String(rows));
}

function renderizarCamadaDeCelulasDoInventario(matrizDeOcupacao) {
  const fragmento = document.createDocumentFragment();
  const modoInterativo = Boolean(inventoryUIState.candidatePosition || inventoryUIState.movingItemId);
  const posicaoPreferida = inventoryUIState.candidatePosition || inventoryUIState.hoveredCell;
  const posicaoDoTabStop = posicaoPreferida
    && Number.isInteger(posicaoPreferida.x)
    && Number.isInteger(posicaoPreferida.y)
    && posicaoPreferida.x >= 0
    && posicaoPreferida.x < CONFIGURACAO_DO_INVENTARIO.columns
    && posicaoPreferida.y >= 0
    && posicaoPreferida.y < CONFIGURACAO_DO_INVENTARIO.rows
    ? posicaoPreferida
    : { x: 0, y: 0 };
  const itensPorId = new Map(personagem.inventario.map(function (item) {
    return [item.id, item];
  }));

  if (modoInterativo) {
    sheetInventoryCellLayer.removeAttribute("aria-hidden");
  } else {
    sheetInventoryCellLayer.setAttribute("aria-hidden", "true");
  }

  for (let y = 0; y < CONFIGURACAO_DO_INVENTARIO.rows; y += 1) {
    for (let x = 0; x < CONFIGURACAO_DO_INVENTARIO.columns; x += 1) {
      const itemId = matrizDeOcupacao[y][x];
      const item = itemId ? itensPorId.get(itemId) : null;
      const celula = document.createElement(modoInterativo ? "button" : "span");

      celula.className = "sheet-inventory-cell";
      celula.classList.add(item ? "is-occupied" : "is-free");
      celula.dataset.x = String(x);
      celula.dataset.y = String(y);
      celula.style.gridColumnStart = String(x + 1);
      celula.style.gridRowStart = String(y + 1);

      if (modoInterativo) {
        celula.type = "button";
        celula.tabIndex = x === posicaoDoTabStop.x && y === posicaoDoTabStop.y ? 0 : -1;
        celula.setAttribute(
          "aria-label",
          item
            ? `Coluna ${x + 1}, linha ${y + 1}: ocupada por ${item.item.nome}.`
            : `Coluna ${x + 1}, linha ${y + 1}: célula livre.`
        );
        celula.setAttribute("aria-keyshortcuts", "ArrowUp ArrowDown ArrowLeft ArrowRight Enter Escape R");
      }

      fragmento.append(celula);
    }
  }

  sheetInventoryCellLayer.replaceChildren(fragmento);
}

function criarBotaoDeItemDoInventario(item) {
  const dimensoes = dominioDoInventario.getEffectiveDimensions(item, item.rotacao);
  const visual = obterConfiguracaoVisualDoItem(item);
  const origemSelecionada = inventoryUIState.selectedItemSource?.kind || "inventory";
  const selecionado = origemSelecionada === "inventory" && inventoryUIState.selectedItemId === item.id;
  const botao = document.createElement("button");
  const arte = criarCartaDoItem(item, { contexto: "grid" });
  const medida = document.createElement("span");

  botao.type = "button";
  botao.className = "sheet-inventory-item";
  botao.classList.add(visual.raridade.cssClass);
  botao.classList.toggle("is-selected", selecionado);
  botao.classList.toggle("is-dragging", inventoryUIState.movingItemId === item.id);
  botao.dataset.inventoryItemId = item.id;
  botao.dataset.itemType = item.item.tipo;
  botao.dataset.itemWidth = String(dimensoes.largura);
  botao.dataset.itemHeight = String(dimensoes.altura);
  botao.dataset.density = arte.dataset.density || "full";
  botao.dataset.itemSymbol = SIMBOLOS_DE_TIPO_DE_ITEM[item.item.tipo] || SIMBOLOS_DE_TIPO_DE_ITEM.outro;
  botao.style.gridColumn = `${item.posicao.x + 1} / span ${dimensoes.largura}`;
  botao.style.gridRow = `${item.posicao.y + 1} / span ${dimensoes.altura}`;
  botao.setAttribute("aria-controls", "sheet-inventory-details");
  botao.setAttribute("aria-pressed", String(selecionado));
  botao.setAttribute(
    "aria-label",
    `${item.item.nome}, ${visual.raridade.label}, ${dimensoes.largura} por ${dimensoes.altura} células, coluna ${item.posicao.x + 1}, linha ${item.posicao.y + 1}.`
  );

  medida.className = "inventory-item-badge";
  medida.textContent = `${dimensoes.largura} × ${dimensoes.altura}`;
  if (item.item.quantidade > 1) {
    const quantidade = document.createElement("b");
    quantidade.className = "sheet-inventory-item__quantity";
    quantidade.textContent = `×${item.item.quantidade}`;
    botao.append(quantidade);
  }
  botao.append(arte, medida);
  return botao;
}

function renderizarCamadaDeItensDoInventario() {
  const fragmento = document.createDocumentFragment();
  const elementoFocado = document.activeElement;
  const itemIdFocado = elementoFocado
    && sheetInventoryItemLayer.contains(elementoFocado)
    ? elementoFocado.dataset.inventoryItemId || null
    : null;

  if (personagem.inventario.length === 0) {
    const estadoVazio = document.createElement("p");
    estadoVazio.className = "sheet-inventory-grid-empty";
    estadoVazio.textContent = "Mochila vazia";
    fragmento.append(estadoVazio);
  } else {
    personagem.inventario.forEach(function (item) {
      fragmento.append(criarBotaoDeItemDoInventario(item));
    });
  }

  sheetInventoryItemLayer.replaceChildren(fragmento);

  if (itemIdFocado) {
    const novoBotaoFocado = Array.from(sheetInventoryItemLayer.children).find(function (elemento) {
      return elemento.dataset.inventoryItemId === itemIdFocado;
    });
    novoBotaoFocado?.focus({ preventScroll: true });
  }
}

function criarDetalhesVisuaisDoItem(item, opcoes = {}) {
  const visual = obterConfiguracaoVisualDoItem(item);
  const dimensoes = dominioDoInventario.getEffectiveDimensions(item, item.rotacao);
  const conteudo = document.createElement("article");
  const cabecalho = document.createElement("header");
  const nome = document.createElement("h3");
  const raridade = document.createElement("span");
  const arte = criarArteDoItem(item, "sheet-inventory-details__art");
  const destaque = document.createElement("div");
  const metricas = document.createElement("dl");
  const descricao = document.createElement("p");
  const contexto = document.createElement("p");
  let propriedadesVisuais = null;

  conteudo.className = "sheet-inventory-details__content";
  conteudo.classList.add(visual.raridade.cssClass);
  conteudo.dataset.itemSymbol = SIMBOLOS_DE_TIPO_DE_ITEM[item.item.tipo] || SIMBOLOS_DE_TIPO_DE_ITEM.outro;
  cabecalho.className = "sheet-inventory-details__title";
  nome.textContent = item.item.nome;
  raridade.className = "sheet-inventory-details__rarity";
  raridade.textContent = opcoes.pendente
    ? `Importado · ${visual.raridade.label}`
    : visual.raridade.label;
  cabecalho.append(nome, raridade);

  destaque.className = "sheet-inventory-details__hero-stat";
  destaque.append(
    criarElementoComTexto("span", "", item.item.atributoPrincipal?.rotulo || visual.tipo.label),
    criarElementoComTexto("strong", "", item.item.atributoPrincipal?.valor || formatarPeso(item.item.peso))
  );

  metricas.className = "sheet-inventory-details__metrics";
  [
    ["Peso", formatarPeso(item.item.peso)],
    ["Espaço", `${dimensoes.largura} × ${dimensoes.altura}`],
    ["Rotação", `${item.rotacao}°`]
  ].forEach(function ([rotulo, valor]) {
    const metrica = document.createElement("div");
    metrica.append(
      criarElementoComTexto("dt", "", rotulo),
      criarElementoComTexto("dd", "", valor)
    );
    metricas.append(metrica);
  });

  descricao.className = "sheet-inventory-details__description";
  descricao.textContent = item.item.descricao || "Nenhuma descrição informada.";

  const partesDoContexto = [
    opcoes.origem || "Mochila",
    visual.tipo.label,
    `${item.item.quantidade || 1} un.`
  ];
  if (!opcoes.pendente && opcoes.mostrarPosicao !== false) {
    partesDoContexto.push(`coluna ${item.posicao.x + 1}, linha ${item.posicao.y + 1}`);
  }
  contexto.className = "sheet-inventory-details__context";
  contexto.textContent = partesDoContexto.join(" · ");

  if (item.item.propriedades?.length) {
    propriedadesVisuais = document.createElement("div");
    propriedadesVisuais.className = "sheet-inventory-details__properties";
    item.item.propriedades.forEach(function (propriedade) {
      const tag = document.createElement("span");
      tag.textContent = propriedade;
      propriedadesVisuais.append(tag);
    });
  }

  conteudo.append(cabecalho, arte, destaque, metricas, descricao, contexto);
  if (propriedadesVisuais) conteudo.append(propriedadesVisuais);
  return conteudo;
}

function renderizarDetalhesDoInventario() {
  const selecao = obterSelecaoAtualDoInventario();
  const itemSelecionado = selecao?.item || null;

  if (!itemSelecionado) {
    limparSelecaoDoInventario();
    sheetInventoryDetails.replaceChildren(sheetInventoryDetailsEmpty);
    sheetInventoryItemActions.hidden = true;
    sheetInventoryPlacementStatus.textContent = "Selecione um item para ver seus detalhes ou reorganizar a mochila.";
    return;
  }

  sheetInventoryDetails.replaceChildren(criarDetalhesVisuaisDoItem(itemSelecionado, {
    pendente: selecao.kind === "bench",
    origem: rotuloDaOrigemDoItem(selecao),
    mostrarPosicao: selecao.kind === "inventory"
  }));
  sheetInventoryItemActions.hidden = false;
  sheetEquipItem.hidden = true;
  sheetEquipChoice.hidden = true;
  sheetStoreItem.hidden = true;
  sheetUnequipItem.hidden = true;
  sheetSwitchHandItem.hidden = true;
  sheetMoveItem.hidden = true;
  sheetRotateItem.hidden = true;
  sheetDiscardItem.hidden = true;

  const slotsEquipaveis = obterSlotsEquipaveisDoItem(itemSelecionado);
  if (selecao.kind === "inventory" || selecao.kind === "bench") {
    if (slotsEquipaveis.length === 1) {
      sheetEquipItem.hidden = false;
      sheetEquipItem.textContent = `Equipar em ${rotuloDoSlotDeEquipamento(slotsEquipaveis[0])}`;
    } else if (slotsEquipaveis.length > 1) {
      sheetEquipChoice.hidden = false;
      sheetEquipChoice.querySelectorAll("[data-equip-selected-slot]").forEach(function (botao) {
        botao.hidden = !slotsEquipaveis.includes(botao.dataset.equipSelectedSlot);
      });
    }
  }

  const dimensoes = dominioDoInventario.getEffectiveDimensions(itemSelecionado, itemSelecionado.rotacao);
  if (selecao.kind === "inventory") {
    sheetMoveItem.hidden = false;
    sheetRotateItem.hidden = dimensoes.largura === dimensoes.altura;
    sheetDiscardItem.hidden = false;
    sheetMoveItem.textContent = inventoryUIState.movingItemId === itemSelecionado.id
      ? "Cancelar movimento"
      : "Posicionar";
    sheetDiscardItem.textContent = "Descartar item";
  } else if (selecao.kind === "bench") {
    sheetStoreItem.hidden = false;
    sheetRotateItem.hidden = dimensoes.largura === dimensoes.altura;
    sheetDiscardItem.hidden = false;
    sheetDiscardItem.textContent = "Recusar item";
  } else if (selecao.kind === "equipment") {
    sheetUnequipItem.hidden = false;
    const outroSlot = selecao.slot === "maoPrincipal" ? "maoSecundaria" : "maoPrincipal";
    const podeTrocarDeMao = ["maoPrincipal", "maoSecundaria"].includes(selecao.slot)
      && itemPodeEquiparNoSlot(itemSelecionado, outroSlot);
    sheetSwitchHandItem.hidden = !podeTrocarDeMao;
    if (podeTrocarDeMao) sheetSwitchHandItem.textContent = `Mover para ${rotuloDoSlotDeEquipamento(outroSlot)}`;
  }
  sheetInventoryPlacementStatus.textContent = inventoryUIState.movingItemId === itemSelecionado.id
    ? `Movendo ${itemSelecionado.item.nome}. Use as setas e Enter, toque em uma célula ou arraste o item.`
    : `${itemSelecionado.item.nome} selecionado em ${rotuloDaOrigemDoItem(selecao)}.`;
}

function obterPrevisaoDoItemRecebido(item) {
  const atual = dominioDoInventario.getInventoryPlacementAvailability(
    personagem.inventario,
    item,
    { rotation: item.rotacao }
  );
  if (atual.available) {
    return { estado: "fits", texto: `Existe espaço na mochila · ${atual.dimensions.largura} × ${atual.dimensions.altura}` };
  }

  const rotacaoAlternativa = item.rotacao === 90 ? 0 : 90;
  const alternativa = item.item.tamanho.largura === item.item.tamanho.altura
    ? atual
    : dominioDoInventario.getInventoryPlacementAvailability(
        personagem.inventario,
        item,
        { rotation: rotacaoAlternativa }
      );
  if (alternativa.available) {
    return { estado: "rotate", texto: `Cabe após girar · ${alternativa.dimensions.largura} × ${alternativa.dimensions.altura}` };
  }
  if (atual.code === "item-too-large" && alternativa.code === "item-too-large") {
    return { estado: "oversize", texto: "Item maior que a mochila nas duas orientações" };
  }
  return { estado: "full", texto: "Mochila cheia — reorganize antes" };
}

function renderizarItemRecebido() {
  const item = personagem.inventarioStaging;
  if (!item) {
    sheetInventoryReceived.classList.remove("has-item", "is-selected");
    sheetInventoryReceived.innerHTML = `
      <div class="inventory-bench__empty">
        <span aria-hidden="true">✦</span>
        <strong>Nenhum item em recebimento</strong>
        <p>Importe um item ou deixe uma peça aqui temporariamente.</p>
      </div>`;
    return;
  }

  const visual = obterConfiguracaoVisualDoItem(item);
  const dimensoes = dominioDoInventario.getEffectiveDimensions(item, item.rotacao);
  const cartao = document.createElement("article");
  const zonaDeGrab = document.createElement("button");
  const arte = criarCartaDoItem(item, { contexto: "bench", eager: true });
  const selo = criarElementoComTexto("span", "inventory-receipt-badge", "Novo item");
  const previsao = obterPrevisaoDoItemRecebido(item);
  const estado = criarElementoComTexto("p", `inventory-receipt-status is-${previsao.estado}`, previsao.texto);
  const selecionado = inventoryUIState.selectedItemSource?.kind === "bench"
    && inventoryUIState.selectedItemId === item.id;

  cartao.className = `inventory-bench-card ${visual.raridade.cssClass}`;
  cartao.classList.toggle("is-selected", selecionado);
  zonaDeGrab.type = "button";
  zonaDeGrab.className = "inventory-bench-card__grab";
  zonaDeGrab.dataset.inventoryDragSource = "bench";
  zonaDeGrab.setAttribute("aria-pressed", String(selecionado));
  zonaDeGrab.setAttribute("aria-controls", "sheet-inventory-details");
  zonaDeGrab.setAttribute("aria-label", `Segurar ${item.item.nome}, ${dimensoes.largura} por ${dimensoes.altura} células, para mover`);
  zonaDeGrab.append(selo, arte);
  cartao.append(zonaDeGrab, estado);
  sheetInventoryReceived.classList.add("has-item");
  sheetInventoryReceived.classList.toggle("is-selected", selecionado);
  sheetInventoryReceived.replaceChildren(cartao);
}

function renderizarEquipamentoDoInventario() {
  const configuracoes = [
    { id: "armadura", rotulo: "Armadura", simbolo: "♜" },
    { id: "maoPrincipal", rotulo: "Mão principal", simbolo: "⚔" },
    { id: "maoSecundaria", rotulo: "Mão secundária", simbolo: "◈" }
  ];
  const fragmento = document.createDocumentFragment();

  configuracoes.forEach(function (configuracao) {
    const item = personagem.equipamentos?.[configuracao.id] || null;
    const botao = document.createElement("button");
    const texto = document.createElement("span");
    botao.type = "button";
    botao.className = `inventory-equipment-slot inventory-equipment-slot--${configuracao.id}`;
    botao.dataset.equipmentSlot = configuracao.id;
    const selecionado = inventoryUIState.selectedItemSource?.kind === "equipment"
      && inventoryUIState.selectedItemSource.slot === configuracao.id
      && inventoryUIState.selectedItemId === item?.id;
    botao.classList.toggle("is-selected", selecionado);
    botao.setAttribute("aria-pressed", String(selecionado));
    botao.setAttribute("aria-controls", "sheet-inventory-details");

    if (!item) {
      botao.innerHTML = `<span class="inventory-equipment-slot__ghost" aria-hidden="true">${configuracao.simbolo}</span><span><small>${configuracao.rotulo}</small><strong>Slot vazio</strong></span>`;
      botao.setAttribute("aria-label", `${configuracao.rotulo}: slot vazio`);
      fragmento.append(botao);
      return;
    }

    const visual = obterConfiguracaoVisualDoItem(item);
    botao.classList.add(visual.raridade.cssClass, "has-item");
    texto.append(
      criarElementoComTexto("small", "", configuracao.rotulo),
      criarElementoComTexto("strong", "", item.item.nome),
      criarElementoComTexto("em", "", item.item.atributoPrincipal?.valor || formatarPeso(item.item.peso))
    );
    botao.append(criarCartaDoItem(item, { contexto: "equipment", density: "small" }), texto);
    botao.setAttribute("aria-label", `${item.item.nome}, equipado em ${configuracao.rotulo}. Ative para guardar na mochila.`);
    fragmento.append(botao);
  });

  sheetInventoryEquipmentSlots.replaceChildren(fragmento);
}

function renderizarResumoPremiumDoInventario(celulasUsadas) {
  const itensEquipados = Object.values(personagem.equipamentos || {}).filter(Boolean);
  const itensNaBancada = personagem.inventarioStaging ? [personagem.inventarioStaging] : [];
  const pesoMochila = personagem.inventario.reduce(function (total, item) {
    return total + Number(item.item.peso || 0) * Number(item.item.quantidade || 1);
  }, 0);
  const pesoTotal = pesoMochila + itensEquipados.concat(itensNaBancada).reduce(function (total, item) {
    return total + Number(item.item.peso || 0) * Number(item.item.quantidade || 1);
  }, 0);
  const pesoMaximo = Number(personagem.capacidadeInventario?.pesoMaximo || 0);
  sheetInventoryWeight.textContent = pesoMaximo > 0 ? `${formatarPeso(pesoTotal)} / ${formatarPeso(pesoMaximo)}` : formatarPeso(pesoTotal);
  sheetInventoryWeightBar.style.width = `${pesoMaximo > 0 ? Math.min(100, (pesoTotal / pesoMaximo) * 100) : Math.min(100, pesoTotal * 2.5)}%`;
  sheetInventoryItemCount.textContent = String(personagem.inventario.length + itensEquipados.length + itensNaBancada.length);
  sheetInventorySpaceSummary.textContent = `${celulasUsadas} / ${CONFIGURACAO_DO_INVENTARIO.capacity}`;
  sheetInventoryGold.textContent = String(personagem.economia?.ouro || 0);
  sheetInventorySilver.textContent = String(personagem.economia?.prata || 0);
}

function renderizarEstadoDoItemPendente() {
  const itemPendente = personagem.inventarioStaging;
  sheetCancelItemImport.hidden = true;

  if (!itemPendente) {
    inventoryUIState.reorganizingForPending = false;
    sheetInventoryPendingActions.hidden = true;
    sheetReorganizeForItem.hidden = false;
    return;
  }

  const disponibilidade = obterDisponibilidadeDoItemPendente();
  sheetRotatePendingItem.hidden = itemPendente.item.tamanho.largura === itemPendente.item.tamanho.altura;

  sheetInventoryPendingActions.hidden = false;
  sheetReorganizeForItem.hidden = disponibilidade.code !== "no-space-available"
    || inventoryUIState.reorganizingForPending;

  if (inventoryUIState.reorganizingForPending) {
    sheetInventoryPendingHeading.textContent = "Reorganização manual";
    sheetInventoryPendingMessage.textContent = "Libere espaço movendo uma peça já guardada.";
    return;
  }

  if (disponibilidade.code === "item-too-large") {
    sheetInventoryPendingHeading.textContent = "Ajuste de footprint";
    const rotacaoAlternativa = itemPendente.rotacao === 90 ? 0 : 90;
    const alternativa = dominioDoInventario.getInventoryPlacementAvailability(
      personagem.inventario,
      itemPendente,
      { rotation: rotacaoAlternativa }
    );
    sheetInventoryPendingMessage.textContent = alternativa.code === "item-too-large"
      ? "Não cabe na mochila em nenhuma orientação."
      : `Não cabe nesta orientação. Gire para ${alternativa.dimensions.largura} × ${alternativa.dimensions.altura}.`;
    return;
  }

  if (disponibilidade.code === "no-space-available") {
    sheetInventoryPendingHeading.textContent = "Sem espaço livre";
    sheetInventoryPendingMessage.textContent = "Reorganize a mochila ou equipe a peça.";
    return;
  }

  sheetInventoryPendingHeading.textContent = "Item em recebimento";
  sheetInventoryPendingMessage.textContent = "Segure a carta para mover.";
}

function renderizarInventario() {
  const matrizDeOcupacao = dominioDoInventario.createOccupancyMatrix(personagem.inventario);
  const celulasUsadas = dominioDoInventario.getUsedInventoryCells(personagem.inventario);

  sincronizarConfiguracaoVisualDaMochila(celulasUsadas);
  renderizarResumoDoInventario(celulasUsadas);
  renderizarCamadaDeCelulasDoInventario(matrizDeOcupacao);
  renderizarCamadaDeItensDoInventario();
  renderizarItemRecebido();
  renderizarEquipamentoDoInventario();
  renderizarResumoPremiumDoInventario(celulasUsadas);
  renderizarDetalhesDoInventario();
  renderizarEstadoDoItemPendente();
  atualizarFeedbackVisualDoPosicionamento();
  renderizarAcoesDePosicionamento();
  if (inventoryDrag.phase === "idle" && !inventoryUIState.candidatePosition && !inventoryUIState.movingItemId) {
    definirMensagemNeutraDaMochila();
  }
}

function executarMutacaoDoInventario(mutacao, opcoes = {}) {
  if (typeof mutacao !== "function") {
    throw new TypeError("A mutação do inventário deve ser uma função.");
  }

  const resultado = mutacao(personagem.inventario, inventoryUIState);
  // Mutações persistentes retornam true somente depois de efetivar o commit no inventário.
  if (opcoes.persistente !== false && resultado === true) marcarFichaComoAlterada();
  renderizarInventario();
  renderizarArmasDaFicha();
  return resultado;
}

function normalizarSlotDeEquipamento(valor) {
  const token = String(valor || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z]/g, "");
  const aliases = {
    armadura: "armadura",
    armor: "armadura",
    maoprincipal: "maoPrincipal",
    mainhand: "maoPrincipal",
    mao: "maoPrincipal",
    maosecundaria: "maoSecundaria",
    offhand: "maoSecundaria",
    escudo: "maoSecundaria"
  };
  return aliases[token] || null;
}

function obterSlotEquipavelDoItem(item) {
  if (!item?.item) return null;
  return normalizarSlotDeEquipamento(item.item.equipavelEm)
    || (item.item.tipo === "armadura" ? "armadura" : null)
    || (item.item.tipo === "arma" ? "maoPrincipal" : null);
}

function obterSlotsEquipaveisDoItem(item) {
  if (!item?.item) return [];
  const slotExplicito = normalizarSlotDeEquipamento(item.item.equipavelEm);
  if (slotExplicito) return [slotExplicito];
  if (item.item.tipo === "armadura") return ["armadura"];
  if (item.item.tipo === "arma") return ["maoPrincipal", "maoSecundaria"];
  return [];
}

function itemPodeEquiparNoSlot(item, slot) {
  return obterSlotsEquipaveisDoItem(item).includes(slot);
}

function rotuloDoSlotDeEquipamento(slot) {
  return {
    armadura: "Armadura",
    maoPrincipal: "Mão principal",
    maoSecundaria: "Mão secundária"
  }[slot] || "Equipamento";
}

async function abrirRevealDeItemRecebido() {
  const item = personagem.inventarioStaging;
  if (!item) return;
  await preloadImagemDoItem(item);
  if (personagem.inventarioStaging?.id !== item.id) return;
  const visual = obterConfiguracaoVisualDoItem(item);
  const dimensoes = dominioDoInventario.getEffectiveDimensions(item, item.rotacao);
  const arte = criarArteDoItem(item, "sheet-inventory-item__art", { eager: true });
  const revealCerimonial = ["is-rarity-rare", "is-rarity-epic", "is-rarity-legendary"]
    .includes(visual.raridade.cssClass);
  inventoryRevealDialog.className = `inventory-reveal ${visual.raridade.cssClass}`;
  inventoryRevealDialog.dataset.motionLevel = revealCerimonial ? "ceremonial" : "compact";
  inventoryRevealDialog.querySelector(".inventory-reveal__stage").className = `inventory-reveal__stage ${visual.raridade.cssClass}`;
  inventoryRevealArt.replaceChildren(arte);
  inventoryRevealTitle.textContent = item.item.nome;
  inventoryRevealRarity.textContent = visual.raridade.label;
  inventoryRevealAttribute.textContent = item.item.atributoPrincipal
    ? `${visual.tipo.label} · ${item.item.atributoPrincipal.rotulo}: ${item.item.atributoPrincipal.valor}`
    : visual.tipo.label;
  inventoryRevealMeta.textContent = `${formatarPeso(item.item.peso)} · ${dimensoes.largura} × ${dimensoes.altura} células · ${item.rotacao}°`;
  const slotsEquipaveis = obterSlotsEquipaveisDoItem(item);
  inventoryRevealDialog.classList.toggle("has-equip-action", slotsEquipaveis.length > 0);
  inventoryRevealEquip.hidden = slotsEquipaveis.length === 0;
  inventoryRevealEquip.textContent = slotsEquipaveis.length > 1 ? "Escolher mão" : "Equipar";
  inventoryRevealEquip.setAttribute("aria-expanded", "false");
  inventoryRevealEquipChoices.hidden = true;
  inventoryRevealDialog.showModal();
  inventoryRevealConfirm.focus({ preventScroll: true });
}

async function animarItemDoRevealAteBancada() {
  const origem = inventoryRevealArt.querySelector(".inventory-item-art");
  const item = personagem.inventarioStaging;
  if (!origem || !item) {
    inventoryRevealDialog.close();
    return;
  }

  const origemRect = origem.getBoundingClientRect();
  const viajante = document.createElement("div");
  viajante.className = "inventory-drag-object";
  viajante.style.setProperty("--drag-left", `${origemRect.left}px`);
  viajante.style.setProperty("--drag-top", `${origemRect.top}px`);
  viajante.style.setProperty("--drag-width", `${origemRect.width}px`);
  viajante.style.setProperty("--drag-height", `${origemRect.height}px`);
  const arte = document.createElement("div");
  arte.className = "inventory-drag-object__art";
  arte.append(criarArteDoItem(item, "sheet-inventory-item__art", { eager: true }));
  viajante.append(arte);
  inventoryDragLayer.append(viajante);
  inventoryRevealDialog.close();

  await new Promise(function (resolve) { window.requestAnimationFrame(resolve); });
  const destino = sheetInventoryReceived.querySelector(".inventory-bench-card__grab .inventory-item-art");
  const destinoRect = destino?.getBoundingClientRect();
  if (!destinoRect) {
    viajante.remove();
    destino?.closest("button")?.focus({ preventScroll: true });
    if (destino) definirMensagemNeutraDaMochila();
    return;
  }

  destino.closest(".inventory-bench-card").classList.add("is-drag-origin");
  try {
    await window.GrimorioInventoryMotion.animateTravel(viajante, {
      from: origemRect,
      to: destinoRect,
      kind: "reveal",
      reduceMotion: deveReduzirMovimento()
    });
  } catch (_erro) {
    // A viagem visual pode ser interrompida por navegação sem afetar o item pendente.
  }
  viajante.remove();
  destino.closest(".inventory-bench-card")?.classList.remove("is-drag-origin");
  destino.closest("button")?.classList.add("is-settling");
  window.GrimorioInventoryMotion.animateSettle(destino.closest("button"), {
    reduceMotion: deveReduzirMovimento()
  }).finally(function () {
    destino.closest("button")?.classList.remove("is-settling");
  });
  definirMensagemNeutraDaMochila();
  destino.closest("button")?.focus({ preventScroll: true });
}

function mostrarFeedbackDeRecebimentoOcupado() {
  sheetInventoryPlacementStatus.textContent = "Recebimento ocupado. Guarde, equipe ou recuse o item atual antes de receber outro.";
  if (!inventoryOccupiedDialog.open) inventoryOccupiedDialog.showModal();
  inventoryOccupiedConfirm.focus({ preventScroll: true });
}

function fecharFeedbackDeRecebimentoOcupado() {
  inventoryOccupiedDialog.close();
  sheetImportItem.focus({ preventScroll: true });
}

function abrirSeletorDeItemDoInventario() {
  if (personagem.inventarioStaging) {
    mostrarFeedbackDeRecebimentoOcupado();
    return;
  }

  sheetItemFile.value = "";
  sheetItemFile.click();
}

function obterDefinicaoDoItemImportado(dados) {
  if (!ehObjetoDeDados(dados) || dados.tipo !== "grimorio-item") {
    throw new Error("Este JSON não é um item do Grimório RPG.");
  }

  if (typeof dados.schemaVersion !== "number" || ![1, 2].includes(dados.schemaVersion)) {
    throw new Error("A versão do item não é compatível com o Grimório RPG.");
  }

  if (!Object.prototype.hasOwnProperty.call(dados, "item")) {
    throw new Error("O arquivo JSON não contém os dados do item.");
  }

  return dominioDoInventario.normalizeItemDefinition(dados.item);
}

function criarItemPendenteDaImportacao(definicao) {
  const idsEmUso = obterIdsReservadosDoInventario();

  return {
    id: dominioDoInventario.createInventoryItemId(undefined, idsEmUso),
    item: definicao,
    posicao: { x: 0, y: 0 },
    rotacao: 0
  };
}

async function importarArquivoDeItem(event) {
  const arquivo = event.target.files[0];
  if (!arquivo) return;

  if (personagem.inventarioStaging) {
    event.target.value = "";
    mostrarFeedbackDeRecebimentoOcupado();
    return;
  }

  if (!arquivo.name.toLowerCase().endsWith(".json")) {
    sheetInventoryPlacementStatus.textContent = "Selecione um arquivo de item com extensão .json.";
    return;
  }

  if (arquivo.size > 1024 * 1024) {
    sheetInventoryPlacementStatus.textContent = "O arquivo de item excede o limite de 1 MB.";
    return;
  }

  sheetImportItem.disabled = true;
  sheetImportItem.setAttribute("aria-busy", "true");
  sheetInventoryPlacementStatus.textContent = "Validando item importado...";

  try {
    const conteudo = await arquivo.text();
    const dados = JSON.parse(conteudo);
    const definicao = obterDefinicaoDoItemImportado(dados);
    const itemPendente = criarItemPendenteDaImportacao(definicao);
    if (personagem.inventarioStaging) {
      event.target.value = "";
      mostrarFeedbackDeRecebimentoOcupado();
      return;
    }
    executarMutacaoDoInventario(function (_inventario, estadoDaInterface) {
      personagem.inventarioStaging = itemPendente;
      estadoDaInterface.reorganizingForPending = false;
      estadoDaInterface.movingItemId = null;
      estadoDaInterface.selectedItemId = itemPendente.id;
      estadoDaInterface.selectedItemSource = { kind: "bench", slot: null };
      estadoDaInterface.hoveredCell = null;
      estadoDaInterface.candidatePosition = null;
    });
    abrirRevealDeItemRecebido();
  } catch (erro) {
    sheetInventoryPlacementStatus.textContent = erro instanceof SyntaxError
      ? "O arquivo não contém um JSON válido."
      : erro.message || "Não foi possível importar este item.";
  } finally {
    sheetImportItem.disabled = false;
    sheetImportItem.removeAttribute("aria-busy");
  }
}

function limparItemPendenteDoInventario(mensagem) {
  if (!personagem.inventarioStaging) return;

  executarMutacaoDoInventario(function (_inventario, estadoDaInterface) {
    personagem.inventarioStaging = null;
    estadoDaInterface.reorganizingForPending = false;
    estadoDaInterface.movingItemId = null;
    if (estadoDaInterface.selectedItemSource?.kind === "bench") {
      estadoDaInterface.selectedItemId = null;
      estadoDaInterface.selectedItemSource = null;
    }
    estadoDaInterface.hoveredCell = null;
    estadoDaInterface.candidatePosition = null;
  });

  sheetInventoryPlacementStatus.textContent = mensagem;
}

function cancelarImportacaoDeItem() {
  inventoryUIState.reorganizingForPending = false;
  clearBackpackPreview({ restaurarMensagem: false });
  renderizarInventario();
  definirMensagemNeutraDaMochila();
}

function descartarItemImportado() {
  limparItemPendenteDoInventario("Item importado descartado antes de entrar na mochila.");
}

function reorganizarMochilaParaItemPendente() {
  if (!personagem.inventarioStaging) return;

  const disponibilidade = obterDisponibilidadeDoItemPendente();
  if (disponibilidade.code !== "no-space-available") {
    renderizarInventario();
    return;
  }

  executarMutacaoDoInventario(function (_inventario, estadoDaInterface) {
    estadoDaInterface.reorganizingForPending = true;
    estadoDaInterface.selectedItemId = null;
    estadoDaInterface.selectedItemSource = null;
    estadoDaInterface.movingItemId = null;
    estadoDaInterface.hoveredCell = null;
    estadoDaInterface.candidatePosition = null;
  }, { persistente: false });
}

function obterPosicaoDaCelulaPeloPonteiro(event) {
  const retangulo = sheetInventoryGrid.getBoundingClientRect();
  if (retangulo.width <= 0 || retangulo.height <= 0) return null;

  return {
    x: Math.floor(((event.clientX - retangulo.left) / retangulo.width) * CONFIGURACAO_DO_INVENTARIO.columns),
    y: Math.floor(((event.clientY - retangulo.top) / retangulo.height) * CONFIGURACAO_DO_INVENTARIO.rows)
  };
}

function definirPosicaoCandidata(posicao, opcoes = {}) {
  if (!posicao) return;
  inventoryUIState.candidatePosition = { x: posicao.x, y: posicao.y };
  inventoryUIState.hoveredCell = { x: posicao.x, y: posicao.y };

  const celulas = sheetInventoryCellLayer.querySelectorAll(".sheet-inventory-cell");
  celulas.forEach(function (celula) {
    const ehDestino = Number(celula.dataset.x) === posicao.x && Number(celula.dataset.y) === posicao.y;
    celula.tabIndex = ehDestino ? 0 : -1;
    if (ehDestino && opcoes.focar === true) celula.focus({ preventScroll: true });
  });
  atualizarFeedbackVisualDoPosicionamento();
}

function recalcularItemPendenteAposReorganizacao(inventario, estadoDaInterface) {
  if (!personagem.inventarioStaging) return;
  const disponibilidade = dominioDoInventario.getInventoryPlacementAvailability(
    inventario,
    personagem.inventarioStaging,
    { rotation: personagem.inventarioStaging.rotacao }
  );

  if (disponibilidade.available) {
    estadoDaInterface.reorganizingForPending = false;
  }
  estadoDaInterface.candidatePosition = null;
  estadoDaInterface.hoveredCell = null;
}

function aplicarFeedbackDeAssentamento(itemId, opcoes = {}) {
  const botao = sheetInventoryItemLayer.querySelector(`[data-inventory-item-id="${CSS.escape(itemId)}"]`);
  if (!botao) return null;

  botao.classList.add("is-settling");
  window.GrimorioInventoryMotion.animateSettle(botao, {
    reduceMotion: deveReduzirMovimento()
  }).finally(function () {
    botao.classList.remove("is-settling");
  });
  if (opcoes.focar !== false) botao.focus({ preventScroll: true });
  return botao;
}

function aplicarFeedbackDePosicaoRecusada() {
  const itemId = inventoryUIState.movingItemId || inventoryUIState.selectedItemId;
  const botao = itemId
    ? sheetInventoryItemLayer.querySelector(`[data-inventory-item-id="${CSS.escape(itemId)}"]`)
    : null;
  const alvo = botao || sheetInventoryPreviewLayer.querySelector(".sheet-inventory-preview-footprint");
  if (!alvo) return;
  alvo.classList.add("is-rejected");
  window.GrimorioInventoryMotion.animateRejection(alvo, {
    reduceMotion: deveReduzirMovimento()
  }).finally(function () {
    alvo.classList.remove("is-rejected");
  });
}

function confirmarPosicionamentoAtual(opcoes = {}) {
  const item = obterItemEmPosicionamento();
  const resultado = avaliarPosicionamentoAtual();
  const posicao = inventoryUIState.candidatePosition;
  if (!item || !resultado || !posicao) return false;

  if (!resultado.valid) {
    sheetInventoryPlacementStatus.textContent = descreverResultadoDoPosicionamento(resultado);
    aplicarFeedbackDePosicaoRecusada();
    return false;
  }

  const estavaMovendo = Boolean(inventoryUIState.movingItemId);
  const itemId = item.id;
  if (
    estavaMovendo
    && item.posicao.x === posicao.x
    && item.posicao.y === posicao.y
  ) {
    cancelarMovimentoDoInventario();
    sheetInventoryPlacementStatus.textContent = "Movimento cancelado: o item já estava nessa posição.";
    return false;
  }
  executarMutacaoDoInventario(function (inventario, estadoDaInterface) {
    if (estavaMovendo) {
      const indice = inventario.findIndex(function (itemAtual) {
        return itemAtual.id === itemId;
      });
      if (indice < 0) return false;
      inventario[indice] = {
        ...inventario[indice],
        posicao: { x: posicao.x, y: posicao.y }
      };
      estadoDaInterface.movingItemId = null;
      estadoDaInterface.hoveredCell = null;
      estadoDaInterface.candidatePosition = null;
      recalcularItemPendenteAposReorganizacao(inventario, estadoDaInterface);
      return true;
    }

    inventario.push({
      id: item.id,
      item: item.item,
      posicao: { x: posicao.x, y: posicao.y },
      rotacao: item.rotacao
    });
    personagem.inventarioStaging = null;
    estadoDaInterface.reorganizingForPending = false;
    estadoDaInterface.selectedItemId = item.id;
    estadoDaInterface.selectedItemSource = { kind: "inventory", slot: null };
    estadoDaInterface.hoveredCell = null;
    estadoDaInterface.candidatePosition = null;
    return true;
  });

  aplicarFeedbackDeAssentamento(itemId, { focar: opcoes.focarItem !== false });
  return true;
}

function cancelarMovimentoDoInventario(opcoes = {}) {
  const itemId = inventoryUIState.movingItemId;
  if (!itemId) return;

  executarMutacaoDoInventario(function (_inventario, estadoDaInterface) {
    estadoDaInterface.movingItemId = null;
    estadoDaInterface.hoveredCell = null;
    estadoDaInterface.candidatePosition = null;
  }, { persistente: false });

  if (opcoes.focarItem !== false) {
    const botao = sheetInventoryItemLayer.querySelector(`[data-inventory-item-id="${CSS.escape(itemId)}"]`);
    botao?.focus({ preventScroll: true });
  }
}

function iniciarModoExplicitoDeMovimento() {
  const item = obterItemDoInventarioPorId(inventoryUIState.selectedItemId);
  if (!item) return;
  if (inventoryUIState.movingItemId === item.id) {
    cancelarMovimentoDoInventario();
    return;
  }

  executarMutacaoDoInventario(function (_inventario, estadoDaInterface) {
    estadoDaInterface.movingItemId = item.id;
    estadoDaInterface.hoveredCell = { x: item.posicao.x, y: item.posicao.y };
    estadoDaInterface.candidatePosition = { x: item.posicao.x, y: item.posicao.y };
  }, { persistente: false });

  const celulaInicial = sheetInventoryCellLayer.querySelector(
    `[data-x="${item.posicao.x}"][data-y="${item.posicao.y}"]`
  );
  celulaInicial?.focus({ preventScroll: true });
}

function girarItemAtivoDoInventario() {
  if (girarArrasteFisicoDoInventario()) return;
  const selecao = obterSelecaoAtualDoInventario();
  const item = obterItemEmPosicionamento() || selecao?.item || obterItemDoInventarioPorId(inventoryUIState.selectedItemId);
  if (!item) return;
  const tamanho = item.item.tamanho;
  if (tamanho.largura === tamanho.altura) return;
  const novaRotacao = item.rotacao === 90 ? 0 : 90;

  if (personagem.inventarioStaging === item) {
    executarMutacaoDoInventario(function () {
      personagem.inventarioStaging = { ...item, rotacao: novaRotacao };
      return true;
    });
    return;
  }

  const resultado = dominioDoInventario.canPlaceItem(personagem.inventario, item, item.posicao, {
    rotation: novaRotacao,
    ignoreItemId: item.id
  });
  if (!resultado.valid) {
    sheetInventoryPlacementStatus.textContent = "Não há espaço para girar esta peça aqui. Mova-a para uma área livre e tente novamente.";
    aplicarFeedbackDePosicaoRecusada();
    return;
  }
  executarMutacaoDoInventario(function () {
    item.rotacao = novaRotacao;
    return true;
  });
  aplicarFeedbackDeAssentamento(item.id);
}

function equiparItemNoSlot(item, origem, slotPreferido = null) {
  const slot = slotPreferido || obterSlotEquipavelDoItem(item);
  if (!item || !slot) return false;
  if (!itemPodeEquiparNoSlot(item, slot)) return false;
  const source = { kind: origem };
  const plano = planejarDestinoDeEquipamento(item, slot, source);
  if (!plano.valid) {
    sheetInventoryPlacementStatus.textContent = criarDescritorDeSlotDeEquipamento(slot).describe(plano, item);
    return false;
  }
  const descriptor = inventoryTargets?.[slot] || criarDescritorDeSlotDeEquipamento(slot);
  const resultado = aplicarPlanoAtomicoDoTarget(descriptor, {
    source,
    itemPersistente: item,
    item: { ...item },
    evaluation: {
      targetId: slot,
      kind: "equipment",
      valid: true,
      code: plano.code,
      mode: plano.mode,
      slot,
      displacedPosition: plano.displacedPosition
    }
  });
  if (resultado.changed) sheetInventoryPlacementStatus.textContent = resultado.message;
  return resultado.changed;
}

function equiparItemSelecionado() {
  const selecao = obterSelecaoAtualDoInventario();
  if (!selecao || !["inventory", "bench"].includes(selecao.kind)) return;
  const slots = obterSlotsEquipaveisDoItem(selecao.item);
  if (slots.length === 1) equiparItemNoSlot(selecao.item, selecao.kind, slots[0]);
}

function equiparItemSelecionadoNoSlot(slot) {
  const selecao = obterSelecaoAtualDoInventario();
  if (!selecao || !["inventory", "bench"].includes(selecao.kind)) return;
  equiparItemNoSlot(selecao.item, selecao.kind, slot);
}

function equiparItemPendenteAgora() {
  const item = personagem.inventarioStaging;
  if (!item) return;
  const slots = obterSlotsEquipaveisDoItem(item);
  if (slots.length > 1) {
    inventoryRevealEquipChoices.hidden = false;
    inventoryRevealEquip.setAttribute("aria-expanded", "true");
    inventoryRevealEquipChoices.querySelector("button")?.focus({ preventScroll: true });
    return;
  }
  if (equiparItemNoSlot(item, "bench", slots[0])) {
    inventoryRevealDialog.close();
    return;
  }
  inventoryRevealAttribute.textContent = "Troca bloqueada: libere espaço na mochila";
  inventoryRevealEquip.focus({ preventScroll: true });
}

function equiparItemPendenteNoSlot(slot) {
  const item = personagem.inventarioStaging;
  if (!item || !itemPodeEquiparNoSlot(item, slot)) return;
  if (equiparItemNoSlot(item, "bench", slot)) {
    inventoryRevealDialog.close();
    return;
  }
  inventoryRevealAttribute.textContent = "Troca bloqueada: libere espaço na mochila";
  inventoryRevealEquip.focus({ preventScroll: true });
}

function iniciarPosicionamentoDoItemRecebido() {
  const item = personagem.inventarioStaging;
  if (!item) return false;
  const disponibilidade = obterDisponibilidadeDoItemPendente();
  if (!disponibilidade.available) {
    sheetInventoryPlacementStatus.textContent = disponibilidade.code === "item-too-large"
      ? "Este item não cabe nesta orientação. Gire a peça para tentar novamente."
      : "Mochila cheia — reorganize as peças antes de guardar este item.";
    return false;
  }

  executarMutacaoDoInventario(function (_inventario, estadoDaInterface) {
    estadoDaInterface.selectedItemId = item.id;
    estadoDaInterface.selectedItemSource = { kind: "bench", slot: null };
    estadoDaInterface.movingItemId = null;
    estadoDaInterface.candidatePosition = { ...disponibilidade.position };
    estadoDaInterface.hoveredCell = { ...disponibilidade.position };
  }, { persistente: false });
  definirPosicaoCandidata(disponibilidade.position, { focar: true });
  sheetInventoryPlacementStatus.textContent = `Posicionando ${item.item.nome}. Use as setas, Girar e Confirmar.`;
  return true;
}

function guardarItemSelecionadoNaMochila() {
  const selecao = obterSelecaoAtualDoInventario();
  if (selecao?.kind === "bench") iniciarPosicionamentoDoItemRecebido();
  if (selecao?.kind === "equipment") desequiparItemDoSlot(selecao.slot);
}

function desequiparItemSelecionado() {
  const selecao = obterSelecaoAtualDoInventario();
  if (selecao?.kind === "equipment") desequiparItemDoSlot(selecao.slot);
}

function trocarMaoDoItemSelecionado() {
  const selecao = obterSelecaoAtualDoInventario();
  if (selecao?.kind !== "equipment" || !["maoPrincipal", "maoSecundaria"].includes(selecao.slot)) return;
  const destino = selecao.slot === "maoPrincipal" ? "maoSecundaria" : "maoPrincipal";
  equiparItemNoSlot(selecao.item, selecao.slot, destino);
}

function desequiparItemDoSlot(slot) {
  const item = personagem.equipamentos?.[slot];
  if (!item) return;
  const disponibilidade = dominioDoInventario.getInventoryPlacementAvailability(personagem.inventario, item, { rotation: item.rotacao });
  if (!disponibilidade.available) {
    sheetInventoryPlacementStatus.textContent = `Não há espaço na mochila para guardar ${item.item.nome}.`;
    return;
  }
  executarMutacaoDoInventario(function (inventario, estadoDaInterface) {
    item.posicao = { ...disponibilidade.position };
    inventario.push(item);
    personagem.equipamentos[slot] = null;
    estadoDaInterface.selectedItemId = item.id;
    estadoDaInterface.selectedItemSource = { kind: "inventory", slot: null };
    return true;
  });
  aplicarFeedbackDeAssentamento(item.id);
}

function iniciarArrasteDeItem(event) {
  iniciarArrasteFisicoDoInventario(event, { kind: "inventory" });
}

function iniciarArrasteDeItemRecebido(event) {
  iniciarArrasteFisicoDoInventario(event, { kind: "bench" });
}

function iniciarArrasteDeEquipamento(event) {
  const slot = event.target.closest("[data-equipment-slot]")?.dataset.equipmentSlot;
  if (slot) iniciarArrasteFisicoDoInventario(event, { kind: slot });
}

function origemFisicaEhEquipamento(origem) {
  return ["armadura", "maoPrincipal", "maoSecundaria"].includes(origem?.kind);
}

function obterItemPersistenteDaOrigemFisica(origem = inventoryDrag.source) {
  if (!origem) return null;
  if (origem.kind === "bench") return personagem.inventarioStaging;
  if (origem.kind === "inventory") return obterItemDoInventarioPorId(inventoryDrag.itemId);
  if (origemFisicaEhEquipamento(origem)) return personagem.equipamentos?.[origem.kind] || null;
  return null;
}

function obterItemDoArrasteFisico() {
  if (inventoryDrag.phase === "idle") return null;
  const item = obterItemPersistenteDaOrigemFisica();
  return item ? { ...item, rotacao: inventoryDrag.rotation } : null;
}

function medirGeometriaDaGradeDoInventario() {
  const retangulo = sheetInventoryGrid.getBoundingClientRect();
  const estilo = window.getComputedStyle(sheetInventoryCellLayer);
  const columnGap = Number.parseFloat(estilo.columnGap) || 0;
  const rowGap = Number.parseFloat(estilo.rowGap) || 0;
  const cellWidth = (retangulo.width - columnGap * (CONFIGURACAO_DO_INVENTARIO.columns - 1))
    / CONFIGURACAO_DO_INVENTARIO.columns;
  const cellHeight = (retangulo.height - rowGap * (CONFIGURACAO_DO_INVENTARIO.rows - 1))
    / CONFIGURACAO_DO_INVENTARIO.rows;
  return {
    rect: retangulo,
    columnGap,
    rowGap,
    cellWidth,
    cellHeight,
    stepX: cellWidth + columnGap,
    stepY: cellHeight + rowGap
  };
}

function medirPecaNoGrid(item, geometria = medirGeometriaDaGradeDoInventario()) {
  const dimensions = dominioDoInventario.getEffectiveDimensions(item, item.rotacao);
  return {
    dimensions,
    width: geometria.cellWidth * dimensions.largura + geometria.columnGap * (dimensions.largura - 1),
    height: geometria.cellHeight * dimensions.altura + geometria.rowGap * (dimensions.altura - 1)
  };
}

function pontoEstaNoRetangulo(x, y, retangulo) {
  return x >= retangulo.left && x <= retangulo.right && y >= retangulo.top && y <= retangulo.bottom;
}

function planejarDestinoDeEquipamento(item, slot, source) {
  if (source?.kind === slot) {
    return { valid: true, code: "same-slot", mode: "noop", displacedPosition: null };
  }
  if (!itemPodeEquiparNoSlot(item, slot)) {
    return { valid: false, code: "incompatible-slot", mode: "blocked", displacedPosition: null };
  }

  const inventarioSemCarregado = source?.kind === "inventory"
    ? personagem.inventario.filter(function (entrada) { return entrada.id !== item.id; })
    : personagem.inventario.slice();
  const itemDeslocado = personagem.equipamentos?.[slot] || null;
  if (!itemDeslocado) return { valid: true, code: "available", mode: "move", displacedPosition: null };

  if (source?.kind === "bench") {
    return { valid: true, code: "bench-swap", mode: "bench-swap", displacedPosition: null };
  }

  if (origemFisicaEhEquipamento(source)) {
    const trocaCompativel = itemPodeEquiparNoSlot(itemDeslocado, source.kind);
    return trocaCompativel
      ? { valid: true, code: "direct-swap", mode: "direct-swap", displacedPosition: null }
      : { valid: false, code: "incompatible-swap", mode: "blocked", displacedPosition: null };
  }

  const disponibilidade = dominioDoInventario.getInventoryPlacementAvailability(
    inventarioSemCarregado,
    itemDeslocado,
    { rotation: itemDeslocado.rotacao }
  );
  return disponibilidade.available
    ? { valid: true, code: "swap-available", mode: "backpack-swap", displacedPosition: disponibilidade.position }
    : { valid: false, code: "no-space-for-displaced", mode: "blocked", displacedPosition: null };
}

function clonarItemFisico(item) {
  return item ? {
    ...item,
    item: { ...item.item },
    posicao: { ...(item.posicao || { x: 0, y: 0 }) }
  } : null;
}

function criarRascunhoFisicoDoInventario() {
  return {
    inventario: personagem.inventario.map(clonarItemFisico),
    equipamentos: {
      armadura: clonarItemFisico(personagem.equipamentos?.armadura),
      maoPrincipal: clonarItemFisico(personagem.equipamentos?.maoPrincipal),
      maoSecundaria: clonarItemFisico(personagem.equipamentos?.maoSecundaria)
    },
    bancada: clonarItemFisico(personagem.inventarioStaging)
  };
}

function extrairItemDoRascunhoFisico(rascunho, source, itemId) {
  if (source.kind === "inventory") {
    const indice = rascunho.inventario.findIndex(function (item) { return item.id === itemId; });
    return indice >= 0 ? rascunho.inventario.splice(indice, 1)[0] : null;
  }
  if (source.kind === "bench") {
    if (rascunho.bancada?.id !== itemId) return null;
    const item = rascunho.bancada;
    rascunho.bancada = null;
    return item;
  }
  if (origemFisicaEhEquipamento(source)) {
    if (rascunho.equipamentos[source.kind]?.id !== itemId) return null;
    const item = rascunho.equipamentos[source.kind];
    rascunho.equipamentos[source.kind] = null;
    return item;
  }
  return null;
}

function rascunhoFisicoPossuiIdsUnicos(rascunho) {
  const ids = [];
  rascunho.inventario.forEach(function (item) { if (item?.id) ids.push(item.id); });
  Object.values(rascunho.equipamentos).forEach(function (item) { if (item?.id) ids.push(item.id); });
  if (rascunho.bancada?.id) ids.push(rascunho.bancada.id);
  return new Set(ids).size === ids.length;
}

function aplicarPlanoAtomicoDoTarget(descriptor, contexto) {
  const { source, itemPersistente, item, evaluation } = contexto;
  if (evaluation.code === "same-slot") return { changed: false, noop: true };
  if (
    descriptor.id === "backpack"
    && source.kind === "inventory"
    && itemPersistente.posicao.x === evaluation.position.x
    && itemPersistente.posicao.y === evaluation.position.y
    && itemPersistente.rotacao === item.rotacao
  ) return { changed: false, noop: true };

  const rascunho = criarRascunhoFisicoDoInventario();
  const itemMovido = extrairItemDoRascunhoFisico(rascunho, source, item.id);
  if (!itemMovido) return { changed: false, noop: false };
  itemMovido.rotacao = item.rotacao;

  if (descriptor.id === "backpack") {
    itemMovido.posicao = { ...evaluation.position };
    rascunho.inventario.push(itemMovido);
  } else if (descriptor.id === "bench") {
    if (rascunho.bancada) return { changed: false, noop: false };
    itemMovido.posicao = { x: 0, y: 0 };
    rascunho.bancada = itemMovido;
  } else if (descriptor.kind === "equipment") {
    const slot = evaluation.slot;
    const itemDeslocado = rascunho.equipamentos[slot];
    if (itemDeslocado) {
      if (evaluation.mode === "bench-swap") {
        itemDeslocado.posicao = { x: 0, y: 0 };
        rascunho.bancada = itemDeslocado;
      } else if (evaluation.mode === "direct-swap") {
        rascunho.equipamentos[source.kind] = itemDeslocado;
      } else if (evaluation.mode === "backpack-swap" && evaluation.displacedPosition) {
        itemDeslocado.posicao = { ...evaluation.displacedPosition };
        rascunho.inventario.push(itemDeslocado);
      } else return { changed: false, noop: false };
    }
    itemMovido.posicao = { x: 0, y: 0 };
    rascunho.equipamentos[slot] = itemMovido;
  } else return { changed: false, noop: false };

  if (!rascunhoFisicoPossuiIdsUnicos(rascunho)) {
    return { changed: false, noop: false, code: "duplicate-item-location" };
  }

  const changed = executarMutacaoDoInventario(function (_inventario, estadoDaInterface) {
    personagem.inventario = rascunho.inventario;
    personagem.equipamentos = rascunho.equipamentos;
    personagem.inventarioStaging = rascunho.bancada;
    estadoDaInterface.reorganizingForPending = false;
    estadoDaInterface.selectedItemId = item.id;
    estadoDaInterface.selectedItemSource = descriptor.id === "backpack"
      ? { kind: "inventory", slot: null }
      : descriptor.id === "bench"
        ? { kind: "bench", slot: null }
        : { kind: "equipment", slot: evaluation.slot };
    estadoDaInterface.movingItemId = null;
    estadoDaInterface.hoveredCell = null;
    estadoDaInterface.candidatePosition = null;
    return true;
  });

  const destino = descriptor.id === "backpack"
    ? "a mochila"
    : descriptor.id === "bench"
      ? "o recebimento"
      : rotuloDoSlotDeEquipamento(evaluation.slot);
  return {
    changed,
    noop: false,
    itemId: item.id,
    targetId: descriptor.id,
    targetKind: descriptor.kind,
    slot: evaluation.slot,
    message: `${item.item.nome} movido para ${destino}.`
  };
}

function criarDescritorDeSlotDeEquipamento(slot) {
  return {
    id: slot,
    kind: "equipment",
    priority: 300,
    getElement() {
      return sheetInventoryEquipmentSlots.querySelector(`[data-equipment-slot="${slot}"]`);
    },
    locate(contexto) {
      const element = this.getElement();
      if (!element || !pontoEstaNoRetangulo(contexto.clientX, contexto.clientY, element.getBoundingClientRect())) {
        return null;
      }
      return { element, slot };
    },
    evaluate(contexto) {
      const plano = planejarDestinoDeEquipamento(contexto.item, slot, contexto.source);
      return {
        targetId: this.id,
        kind: this.kind,
        valid: plano.valid,
        code: plano.code,
        element: contexto.location.element,
        slot,
        position: null,
        validation: null,
        dimensions: dominioDoInventario.getEffectiveDimensions(contexto.item, contexto.item.rotacao),
        displacedPosition: plano.displacedPosition,
        mode: plano.mode
      };
    },
    preview(contexto) {
      const element = this.getElement();
      if (!element) return;
      const ativa = contexto.evaluation?.targetId === this.id;
      const compativel = itemPodeEquiparNoSlot(contexto.item, slot);
      element.classList.toggle("is-compatible-target", compativel);
      element.classList.toggle("is-incompatible-target", !compativel);
      element.classList.toggle("is-valid-target", ativa && contexto.evaluation.valid);
      element.classList.toggle("is-invalid-target", ativa && !contexto.evaluation.valid);
    },
    describe(avaliacao, item) {
      if (avaliacao.code === "incompatible-slot") {
        return `${item.item.nome} n\u00e3o pode ser equipado em ${rotuloDoSlotDeEquipamento(slot)}.`;
      }
      if (avaliacao.code === "no-space-for-displaced") {
        return "N\u00e3o h\u00e1 espa\u00e7o na mochila para guardar o item equipado.";
      }
      if (avaliacao.code === "incompatible-swap") return "A troca direta entre estes slots n\u00e3o é compatível.";
      if (avaliacao.code === "direct-swap") return "Solte para trocar os itens entre as mãos.";
      if (avaliacao.code === "bench-swap") {
        const equipado = personagem.equipamentos?.[slot];
        return equipado
          ? `Solte para equipar e enviar ${equipado.item.nome} ao recebimento.`
          : `Solte para equipar em ${rotuloDoSlotDeEquipamento(slot)}.`;
      }
      if (avaliacao.code === "swap-available") {
        const equipado = personagem.equipamentos?.[slot];
        return equipado
          ? `Solte para equipar; ${equipado.item.nome} volta para a mochila.`
          : `Solte para equipar em ${rotuloDoSlotDeEquipamento(slot)}.`;
      }
      if (avaliacao.code === "same-slot") return `${item.item.nome} j\u00e1 ocupa este slot.`;
      return `Solte para equipar em ${rotuloDoSlotDeEquipamento(slot)}.`;
    },
    apply(contexto) {
      return aplicarPlanoAtomicoDoTarget(this, contexto);
    }
  };
}

const inventoryTargets = {
  backpack: {
    id: "backpack",
    kind: "backpack",
    priority: 100,
    getElement() {
      return sheetInventoryGrid;
    },
    locate(contexto) {
      const element = this.getElement();
      const geometria = medirGeometriaDaGradeDoInventario();
      if (!element || !pontoEstaNoRetangulo(contexto.clientX, contexto.clientY, geometria.rect)) return null;
      const peca = medirPecaNoGrid(contexto.item, geometria);
      const objetoLeft = contexto.clientX - contexto.grabRatio.x * peca.width;
      const objetoTop = contexto.clientY - contexto.grabRatio.y * peca.height;
      return {
        element,
        position: {
          x: Math.round((objetoLeft - geometria.rect.left) / geometria.stepX),
          y: Math.round((objetoTop - geometria.rect.top) / geometria.stepY)
        }
      };
    },
    evaluate(contexto) {
      const validation = dominioDoInventario.canPlaceItem(
        personagem.inventario,
        contexto.item,
        contexto.location.position,
        {
          rotation: contexto.item.rotacao,
          ignoreItemId: contexto.source?.kind === "inventory" ? contexto.item.id : undefined
        }
      );
      return {
        targetId: this.id,
        kind: this.kind,
        valid: validation.valid,
        code: validation.code,
        element: contexto.location.element,
        slot: null,
        position: contexto.location.position,
        validation,
        dimensions: validation.dimensions
      };
    },
    preview(contexto) {
      const ativa = contexto.evaluation?.targetId === this.id;
      sheetInventoryGrid.classList.toggle("is-dragging-item", inventoryDrag.phase === "dragging" && ativa);
      sheetInventoryGrid.classList.toggle("is-positioning", ativa);
      sheetInventoryGrid.classList.toggle("has-valid-preview", ativa && contexto.evaluation.valid);
      sheetInventoryGrid.classList.toggle("has-invalid-preview", ativa && !contexto.evaluation.valid);
    },
    describe(avaliacao) {
      return descreverResultadoDoPosicionamento(avaliacao.validation);
    },
    apply(contexto) {
      return aplicarPlanoAtomicoDoTarget(this, contexto);
    }
  },
  bench: {
    id: "bench",
    kind: "bench",
    priority: 200,
    getElement() {
      return sheetInventoryReceived;
    },
    locate(contexto) {
      const element = this.getElement();
      if (!element || !pontoEstaNoRetangulo(contexto.clientX, contexto.clientY, element.getBoundingClientRect())) {
        return null;
      }
      return { element };
    },
    evaluate(contexto) {
      return {
        targetId: this.id,
        kind: this.kind,
        valid: contexto.source?.kind === "bench" || !personagem.inventarioStaging,
        code: contexto.source?.kind === "bench"
          ? "same-bench"
          : personagem.inventarioStaging
            ? "bench-occupied"
            : "available",
        element: contexto.location?.element || this.getElement(),
        slot: null,
        position: null,
        validation: null,
        dimensions: dominioDoInventario.getEffectiveDimensions(contexto.item, contexto.item.rotacao)
      };
    },
    preview(contexto) {
      const ativa = contexto.evaluation?.targetId === this.id;
      sheetInventoryReceived.classList.toggle("is-compatible-target", !personagem.inventarioStaging || contexto.source?.kind === "bench");
      sheetInventoryReceived.classList.toggle("is-valid-target", ativa && contexto.evaluation.valid);
      sheetInventoryReceived.classList.toggle("is-invalid-target", ativa && !contexto.evaluation.valid);
    },
    describe(avaliacao, item) {
      if (avaliacao.code === "same-bench") return `${item.item.nome} j\u00e1 est\u00e1 no recebimento.`;
      if (avaliacao.code === "bench-occupied") return "O recebimento comporta um item por vez.";
      return "Solte para deixar o item no recebimento.";
    },
    apply(contexto) {
      if (contexto.source.kind === "bench") return { changed: false, noop: true };
      return aplicarPlanoAtomicoDoTarget(this, contexto);
    }
  },
  maoPrincipal: criarDescritorDeSlotDeEquipamento("maoPrincipal"),
  maoSecundaria: criarDescritorDeSlotDeEquipamento("maoSecundaria"),
  armadura: criarDescritorDeSlotDeEquipamento("armadura")
};

const inventoryTargetsPorPrioridade = Object.values(inventoryTargets).sort(function (alvoA, alvoB) {
  return alvoB.priority - alvoA.priority;
});

function criarChaveDaAvaliacaoFisica(avaliacao, rotacao) {
  const celula = avaliacao.position ? `${avaliacao.position.x}:${avaliacao.position.y}` : "-";
  return `${avaliacao.targetId || "none"}:${celula}:${rotacao}`;
}

function criarAvaliacaoForaDosAlvos(item) {
  return {
    targetId: "none",
    kind: "none",
    valid: false,
    code: "outside-targets",
    element: null,
    slot: null,
    position: null,
    validation: null,
    dimensions: dominioDoInventario.getEffectiveDimensions(item, item.rotacao)
  };
}

function avaliarAlvoFisicoDoInventario(clientX, clientY, item, opcoes = {}) {
  const contextoBase = {
    clientX,
    clientY,
    item,
    source: inventoryDrag.source,
    grabRatio: inventoryDrag.grabRatio,
    location: null
  };
  let descriptor = null;
  for (const alvo of inventoryTargetsPorPrioridade) {
    const location = alvo.locate(contextoBase);
    if (!location) continue;
    contextoBase.location = location;
    descriptor = alvo;
    break;
  }
  if (!descriptor) return criarAvaliacaoForaDosAlvos(item);

  const chave = criarChaveDaAvaliacaoFisica({
    targetId: descriptor.id,
    position: contextoBase.location.position || null
  }, item.rotacao);
  if (opcoes.reusarAvaliacao === true && opcoes.revalidar !== true && inventoryDrag.evaluationCache?.has(chave)) {
    return inventoryDrag.evaluationCache.get(chave);
  }
  const avaliacaoSemCache = descriptor.evaluate(contextoBase);
  if (opcoes.revalidar !== true) inventoryDrag.evaluationCache?.set(chave, avaliacaoSemCache);
  return avaliacaoSemCache;
}

function descreverAvaliacaoFisica(avaliacao, item) {
  const descriptor = inventoryTargets[avaliacao.targetId];
  return descriptor
    ? descriptor.describe(avaliacao, item)
    : `${item.item.nome} est\u00e1 fora de um destino v\u00e1lido.`;
}

function atualizarFeedbackDosAlvosFisicos(item, avaliacao) {
  inventoryTargetsPorPrioridade.forEach(function (descriptor) {
    descriptor.preview({ item, evaluation: avaliacao, source: inventoryDrag.source });
  });
  if (avaliacao.kind === "backpack") {
    sheetInventoryPlacementStatus.textContent = avaliacao.valid
      ? `Solte para guardar · ${avaliacao.dimensions.largura} × ${avaliacao.dimensions.altura}`
      : descreverResultadoDoPosicionamento(avaliacao.validation);
  } else if (avaliacao.targetId && inventoryTargets[avaliacao.targetId]) {
    sheetInventoryPlacementStatus.textContent = descreverAvaliacaoFisica(avaliacao, item);
  } else {
    definirMensagemNeutraDaMochila();
  }
}

function criarProxyVisualDoArraste(sessao, item) {
  const visual = obterConfiguracaoVisualDoItem(item);
  const proxy = document.createElement("div");
  const morph = document.createElement("div");
  const arte = document.createElement("div");
  const label = document.createElement("span");
  proxy.className = "inventory-drag-object";
  proxy.dataset.dragSource = sessao.source?.kind || "unknown";
  morph.className = "inventory-drag-object__morph";
  arte.className = `inventory-drag-object__art ${visual.raridade.cssClass}`;
  arte.append(criarCartaDoItem(item, { contexto: "proxy", eager: true, rotacao: sessao.rotation }));
  label.className = "inventory-drag-object__label";
  morph.append(arte);
  proxy.append(morph, label);
  proxy.style.setProperty("--drag-left", `${sessao.originRect.left}px`);
  proxy.style.setProperty("--drag-top", `${sessao.originRect.top}px`);
  proxy.style.setProperty("--drag-width", `${sessao.originRect.width}px`);
  proxy.style.setProperty("--drag-height", `${sessao.originRect.height}px`);
  inventoryDragLayer.append(proxy);
  sessao.proxy = proxy;
  sessao.morph = morph;
  sessao.art = arte;
  if (sessao.source?.kind !== "bench") {
    sessao.spatialized = true;
    window.GrimorioInventoryMotion.animateGrab(morph, {
      reduceMotion: deveReduzirMovimento()
    });
  }
  return proxy;
}

function atualizarRotuloDoProxy(sessao, item) {
  const dimensoes = dominioDoInventario.getEffectiveDimensions(item, sessao.rotation);
  const label = sessao.proxy?.querySelector(".inventory-drag-object__label");
  const podeGirar = item.item.tamanho.largura !== item.item.tamanho.altura;
  if (label) {
    label.textContent = `${item.item.nome} · ${dimensoes.largura} × ${dimensoes.altura} · ${sessao.rotation}°${podeGirar ? " · R — Girar" : ""}`;
  }
}

function iniciarArrasteFisicoDoInventario(event, source) {
  if (event.button !== 0 || !event.isPrimary || inventoryDrag.phase !== "idle") return;
  const arteClicada = event.target.closest(".inventory-item-art");
  if (!arteClicada) return;
  const origem = source.kind === "bench"
    ? arteClicada.closest("[data-inventory-drag-source='bench']")
    : source.kind === "inventory"
      ? arteClicada.closest("button[data-inventory-item-id]")
      : arteClicada.closest("[data-equipment-slot]");
  const item = source.kind === "bench"
    ? personagem.inventarioStaging
    : source.kind === "inventory"
      ? obterItemDoInventarioPorId(origem?.dataset.inventoryItemId)
      : personagem.equipamentos?.[source.kind] || null;
  if (!origem || !item) return;
  if (source.kind === "inventory" && inventoryUIState.movingItemId && inventoryUIState.movingItemId !== item.id) {
    sheetInventoryPlacementStatus.textContent = "Conclua ou cancele o movimento por teclado antes de segurar outro item.";
    return;
  }

  const retangulo = arteClicada.getBoundingClientRect();
  if (retangulo.width <= 0 || retangulo.height <= 0) return;
  const grabRatio = {
    x: Math.max(0, Math.min(1, (event.clientX - retangulo.left) / retangulo.width)),
    y: Math.max(0, Math.min(1, (event.clientY - retangulo.top) / retangulo.height))
  };
  const elementoDeOrigem = origem.closest(".inventory-bench-card, .sheet-inventory-item, .inventory-equipment-slot") || origem;
  Object.assign(inventoryDrag, {
    phase: "grabbed",
    source,
    sourceSnapshot: null,
    target: null,
    pointerId: event.pointerId,
    itemId: item.id,
    rotation: item.rotacao,
    grabRatio,
    originRect: retangulo,
    latestPointer: { x: event.clientX, y: event.clientY },
    startPointer: { x: event.clientX, y: event.clientY },
    candidateKey: "",
    evaluation: null,
    evaluationCache: new Map(),
    proxy: null,
    morph: null,
    art: null,
    originElement: elementoDeOrigem,
    animationFrame: 0,
    renderedPointer: { x: event.clientX, y: event.clientY },
    tilt: 0,
    rotationInProgress: false,
    spatialized: false,
    moved: false
  });

  if (source.kind === "inventory") selecionarItemDoInventario(item, "inventory");
  else if (source.kind === "bench") selecionarItemDoInventario(item, "bench");
  else if (origemFisicaEhEquipamento(source)) selecionarItemDoInventario(item, "equipment", source.kind);
  clearBackpackPreview();
  try { origem.setPointerCapture(event.pointerId); } catch (_erro) { /* captura é apenas uma otimização */ }
  event.preventDefault();
}

function desenharProxyDoArraste(sessao) {
  sessao.animationFrame = 0;
  if (!sessao.proxy) return;
  const item = obterItemDoArrasteFisico();
  if (!item) return;
  const avaliacao = avaliarAlvoFisicoDoInventario(
    sessao.latestPointer.x,
    sessao.latestPointer.y,
    item,
    { reusarAvaliacao: true }
  );
  const geometria = medirGeometriaDaGradeDoInventario();
  const peca = medirPecaNoGrid(item, geometria);
  const left = sessao.latestPointer.x - sessao.grabRatio.x * peca.width;
  const top = sessao.latestPointer.y - sessao.grabRatio.y * peca.height;
  const deltaX = sessao.latestPointer.x - sessao.renderedPointer.x;
  const configuracaoDeMovimento = window.GrimorioInventoryMotion.config;
  const inclinacaoAlvo = deveReduzirMovimento()
    ? 0
    : Math.max(-configuracaoDeMovimento.maxTilt, Math.min(configuracaoDeMovimento.maxTilt, deltaX * .14));
  sessao.tilt += (inclinacaoAlvo - sessao.tilt) * configuracaoDeMovimento.tiltDamping;
  sessao.renderedPointer = { ...sessao.latestPointer };
  sessao.proxy.style.setProperty("--drag-left", `${left}px`);
  sessao.proxy.style.setProperty("--drag-top", `${top}px`);
  sessao.proxy.style.setProperty("--drag-width", `${peca.width}px`);
  sessao.proxy.style.setProperty("--drag-height", `${peca.height}px`);
  if (sessao.source?.kind === "bench" && !sessao.spatialized) {
    sessao.spatialized = true;
    window.GrimorioInventoryMotion.animateSpatialize(
      sessao.morph,
      sessao.originRect,
      { width: peca.width, height: peca.height },
      { reduceMotion: deveReduzirMovimento() }
    );
  }
  sessao.art.style.setProperty("--drag-tilt", `${sessao.tilt.toFixed(2)}deg`);
  sessao.art.style.setProperty("--drag-shadow-x", `${Math.max(-6, Math.min(6, deltaX * .3)).toFixed(2)}px`);
  sessao.proxy.classList.toggle("is-over-grid", avaliacao.kind === "backpack" && !sessao.rotationInProgress);

  if (sessao.rotationInProgress) return;

  const chave = criarChaveDaAvaliacaoFisica(avaliacao, sessao.rotation);
  if (chave !== sessao.candidateKey) {
    sessao.candidateKey = chave;
    const novoTarget = avaliacao.kind === "none" ? null : avaliacao.kind;
    sessao.target = novoTarget;
    sessao.evaluation = novoTarget ? avaliacao : null;
    if (novoTarget === "backpack" && sessao.phase === "dragging") {
      inventoryUIState.candidatePosition = { ...avaliacao.position };
      inventoryUIState.hoveredCell = { ...avaliacao.position };
    } else {
      clearBackpackPreview({ restaurarMensagem: false });
    }
    sessao.proxy.classList.toggle("is-invalid", Boolean(novoTarget && !avaliacao.valid));
    atualizarFeedbackDosAlvosFisicos(item, avaliacao);
    atualizarFeedbackVisualDoPosicionamento();
  }
  if (sessao.phase === "dragging" && Math.abs(sessao.tilt) > .04 && !sessao.animationFrame) {
    sessao.animationFrame = window.requestAnimationFrame(function () {
      desenharProxyDoArraste(sessao);
    });
  }
}

function agendarDesenhoDoProxy(sessao, ponteiro) {
  sessao.latestPointer = { x: ponteiro.clientX, y: ponteiro.clientY };
  if (sessao.animationFrame) return;
  sessao.animationFrame = window.requestAnimationFrame(function () {
    desenharProxyDoArraste(sessao);
  });
}

function atualizarArrasteDeItem(event) {
  const sessao = inventoryDrag;
  if (!sessao || sessao.pointerId !== event.pointerId) return;
  const distancia = Math.hypot(event.clientX - sessao.startPointer.x, event.clientY - sessao.startPointer.y);
  if (!sessao.moved && distancia < LIMIAR_DE_ARRASTE_DO_INVENTARIO) return;
  if (!sessao.moved) {
    sessao.moved = true;
    sessao.phase = "dragging";
    sessao.originElement.classList.add("is-drag-origin");
    document.body.classList.add("is-inventory-grabbing");
    const item = obterItemDoArrasteFisico();
    if (!item) return;
    sessao.sourceSnapshot = Object.freeze({
      kind: sessao.source.kind,
      itemId: item.id,
      rotacao: item.rotacao,
      posicao: Object.freeze({ ...(item.posicao || { x: 0, y: 0 }) })
    });
    criarProxyVisualDoArraste(sessao, item);
    atualizarRotuloDoProxy(sessao, item);
  }
  agendarDesenhoDoProxy(sessao, event);
  event.preventDefault();
}

function girarArrasteFisicoDoInventario() {
  if (!["grabbed", "dragging"].includes(inventoryDrag.phase)) return false;
  const itemPersistente = obterItemPersistenteDaOrigemFisica();
  if (
    !itemPersistente
    || inventoryDrag.rotationInProgress
    || itemPersistente.item.tamanho.largura === itemPersistente.item.tamanho.altura
  ) return false;
  const direcao = inventoryDrag.rotation === 90 ? -1 : 1;
  inventoryDrag.rotationInProgress = true;
  inventoryDrag.proxy?.classList.add("is-rotating");
  inventoryDrag.target = null;
  inventoryDrag.evaluation = null;
  limparFeedbackDosAlvosFisicos();
  clearBackpackPreview({ restaurarMensagem: false });
  inventoryDrag.rotation = inventoryDrag.rotation === 90 ? 0 : 90;
  inventoryDrag.candidateKey = "";
  inventoryDrag.evaluationCache.clear();
  const arte = inventoryDrag.art?.querySelector(".inventory-item-art");
  if (arte) {
    configurarOrientacaoVisualDaArte(arte, itemPersistente, inventoryDrag.rotation);
  }
  atualizarFormatoDaCarta(inventoryDrag.art?.querySelector(".inventory-card"), itemPersistente, inventoryDrag.rotation);
  atualizarRotuloDoProxy(inventoryDrag, itemPersistente);
  agendarDesenhoDoProxy(inventoryDrag, {
    clientX: inventoryDrag.latestPointer.x,
    clientY: inventoryDrag.latestPointer.y
  });
  window.GrimorioInventoryMotion.animateRotation(inventoryDrag.morph, {
    direction: direcao,
    reduceMotion: deveReduzirMovimento()
  }).finally(function () {
    if (!["grabbed", "dragging"].includes(inventoryDrag.phase)) return;
    inventoryDrag.rotationInProgress = false;
    inventoryDrag.proxy?.classList.remove("is-rotating");
    inventoryDrag.candidateKey = "";
    agendarDesenhoDoProxy(inventoryDrag, {
      clientX: inventoryDrag.latestPointer.x,
      clientY: inventoryDrag.latestPointer.y
    });
  });
  return true;
}

function limparFeedbackDosAlvosFisicos() {
  sheetInventoryEquipmentSlots.querySelectorAll("[data-equipment-slot]").forEach(function (slot) {
    slot.classList.remove("is-compatible-target", "is-incompatible-target", "is-valid-target", "is-invalid-target", "is-drop-target");
  });
  sheetInventoryReceived.classList.remove("is-compatible-target", "is-valid-target", "is-invalid-target", "is-drop-target");
}

function removerProxyDoInventario(sessao) {
  if (sessao.animationFrame) window.cancelAnimationFrame(sessao.animationFrame);
  sessao.proxy?.remove();
  sessao.originElement?.classList.remove("is-drag-origin");
  document.querySelectorAll(".is-drop-target").forEach(function (elemento) { elemento.classList.remove("is-drop-target"); });
  limparFeedbackDosAlvosFisicos();
  document.body.classList.remove("is-inventory-grabbing");
  clearBackpackPreview();
  Object.assign(sessao, window.GrimorioUIState.createInventoryDragState());
}

function limparEstadoFisicoDoInventario() {
  removerProxyDoInventario(inventoryDrag);
}

function confirmarDropFisico(avaliacao) {
  const sessao = inventoryDrag;
  const itemPersistente = obterItemPersistenteDaOrigemFisica();
  const descriptor = inventoryTargets[avaliacao?.targetId];
  if (!itemPersistente || !avaliacao?.valid || !descriptor) {
    return { changed: false, noop: false };
  }
  const elementoDeslocadoAntes = avaliacao.mode === "direct-swap"
    ? descriptor.getElement()?.querySelector(".inventory-card")
    : null;
  const retanguloDeslocadoAntes = elementoDeslocadoAntes?.getBoundingClientRect() || null;
  const resultado = descriptor.apply({
    source: sessao.source,
    itemPersistente,
    item: { ...itemPersistente, rotacao: sessao.rotation },
    evaluation: avaliacao,
    session: sessao
  });
  if (resultado.changed && retanguloDeslocadoAntes && origemFisicaEhEquipamento(sessao.source)) {
    const elementoDeslocadoDepois = sheetInventoryEquipmentSlots
      .querySelector(`[data-equipment-slot="${sessao.source.kind}"] .inventory-card`);
    const retanguloDeslocadoDepois = elementoDeslocadoDepois?.getBoundingClientRect() || null;
    if (elementoDeslocadoDepois && retanguloDeslocadoDepois) {
      resultado.displacedFlip = {
        element: elementoDeslocadoDepois,
        from: retanguloDeslocadoAntes,
        to: retanguloDeslocadoDepois
      };
    }
  }
  return resultado;
}

function encontrarDestinoVisualDoDrop(resultado) {
  if (resultado.targetKind === "backpack") {
    const elemento = sheetInventoryItemLayer.querySelector(`[data-inventory-item-id="${CSS.escape(resultado.itemId)}"]`);
    return { element: elemento, art: elemento?.querySelector(".inventory-item-art") || elemento };
  }
  if (resultado.targetKind === "equipment") {
    const elemento = sheetInventoryEquipmentSlots.querySelector(`[data-equipment-slot="${resultado.slot}"]`);
    return { element: elemento, art: elemento?.querySelector(".inventory-item-art") || elemento };
  }
  if (resultado.targetKind === "bench") {
    const elemento = sheetInventoryReceived.querySelector("[data-inventory-drag-source='bench']") || sheetInventoryReceived;
    return { element: elemento, art: elemento.querySelector?.(".inventory-item-art") || elemento };
  }
  return { element: null, art: null };
}

async function animarProxyAteRetangulo(sessao, retangulo, tipo, destino) {
  const proxy = sessao.proxy;
  if (!proxy || !retangulo) {
    removerProxyDoInventario(sessao);
    return;
  }
  if (sessao.animationFrame) window.cancelAnimationFrame(sessao.animationFrame);
  sessao.animationFrame = 0;
  sessao.phase = tipo === "retorno" ? "returning" : "dropping";
  window.GrimorioInventoryMotion.cancelAnimations(sessao.morph);
  proxy.classList.remove("is-over-grid", "is-invalid", "is-rotating");
  proxy.classList.add("is-travelling");
  sessao.art?.style.setProperty("--drag-tilt", "0deg");
  sessao.art?.style.setProperty("--drag-shadow-x", "0px");
  const atual = proxy.getBoundingClientRect();
  try {
    await window.GrimorioInventoryMotion.animateTravel(proxy, {
      from: atual,
      to: retangulo,
      kind: tipo === "retorno" ? "return" : "drop",
      direction: sessao.latestPointer.x >= sessao.startPointer.x ? 1 : -1,
      reduceMotion: deveReduzirMovimento()
    });
  } catch (_erro) {
    // A interrupção visual não altera a decisão persistente já tomada.
  }
  removerProxyDoInventario(sessao);
  if (!destino) return;
  destino.classList.remove("is-drop-target");
  if (tipo === "retorno") {
    const controleDeOrigem = destino.matches("button") ? destino : destino.querySelector("button");
    const alvoDaRecusa = controleDeOrigem || destino;
    alvoDaRecusa?.classList.add("is-rejected");
    window.GrimorioInventoryMotion.animateRejection(alvoDaRecusa, {
      reduceMotion: deveReduzirMovimento()
    }).finally(function () {
      alvoDaRecusa?.classList.remove("is-rejected");
    });
    controleDeOrigem?.focus({ preventScroll: true });
  } else {
    destino.focus?.({ preventScroll: true });
    if (destino.dataset.inventoryItemId) aplicarFeedbackDeAssentamento(destino.dataset.inventoryItemId, { focar: false });
    else {
      destino.classList.add("is-settling");
      window.GrimorioInventoryMotion.animateSettle(destino, {
        reduceMotion: deveReduzirMovimento()
      }).finally(function () {
        destino.classList.remove("is-settling");
      });
    }
  }
}

function encerrarArrasteDeItem(event, cancelado) {
  const sessao = inventoryDrag;
  if (
    !sessao
    || sessao.pointerId !== event.pointerId
    || !["grabbed", "dragging"].includes(sessao.phase)
  ) return;
  const item = obterItemDoArrasteFisico();
  const source = sessao.source;
  const itemId = sessao.itemId;
  const avaliacaoFinal = !cancelado && item
    ? avaliarAlvoFisicoDoInventario(event.clientX, event.clientY, item, { revalidar: true })
    : null;

  if (!sessao.moved) {
    removerProxyDoInventario(sessao);
    if (item) {
      if (source.kind === "inventory") selecionarItemDoInventario(item, "inventory");
      else if (source.kind === "bench") selecionarItemDoInventario(item, "bench");
      else if (origemFisicaEhEquipamento(source)) selecionarItemDoInventario(item, "equipment", source.kind);
      renderizarInventario();
    }
    event.preventDefault();
    return;
  }

  inventoryClickSuppressedUntil = Date.now() + 350;
  if (avaliacaoFinal?.valid) {
    const resultado = confirmarDropFisico(avaliacaoFinal);
    if (resultado.changed) {
      const destino = encontrarDestinoVisualDoDrop(resultado);
      destino.element?.classList.add("is-drop-target");
      sheetInventoryPlacementStatus.textContent = resultado.message;
      if (resultado.displacedFlip) {
        window.GrimorioInventoryMotion.animateFlip(
          resultado.displacedFlip.element,
          resultado.displacedFlip.from,
          resultado.displacedFlip.to,
          { reduceMotion: deveReduzirMovimento() }
        );
      }
      animarProxyAteRetangulo(sessao, destino.art?.getBoundingClientRect(), "encaixe", destino.element);
      event.preventDefault();
      return;
    }
    if (resultado.noop) {
      sheetInventoryPlacementStatus.textContent = "O objeto já estava neste destino.";
    }
  }

  clearBackpackPreview({ restaurarMensagem: false });
  if (!avaliacaoFinal?.valid && avaliacaoFinal && item) {
    sheetInventoryPlacementStatus.textContent = descreverAvaliacaoFisica(avaliacaoFinal, item);
  } else if (cancelado) {
    sheetInventoryPlacementStatus.textContent = "Gesto cancelado. O objeto voltou ao lugar.";
  }
  animarProxyAteRetangulo(sessao, sessao.originRect, "retorno", sessao.originElement);
  event.preventDefault();
}

function cancelarArrasteFisicoAtivo(mensagem) {
  if (!["grabbed", "dragging"].includes(inventoryDrag.phase)) return;
  inventoryClickSuppressedUntil = Date.now() + 350;
  inventoryDrag.target = null;
  inventoryDrag.evaluation = null;
  clearBackpackPreview({ restaurarMensagem: false });
  sheetInventoryPlacementStatus.textContent = mensagem || "Gesto interrompido. O objeto voltou ao lugar.";
  animarProxyAteRetangulo(
    inventoryDrag,
    inventoryDrag.originRect,
    "retorno",
    inventoryDrag.originElement
  );
}

function abrirConfirmacaoDeDescarte() {
  const item = obterItemDoInventarioPorId(inventoryUIState.selectedItemId);
  if (!item) return;
  inventoryUIState.discardingItemId = item.id;
  inventoryDiscardDescription.textContent = `Descartar ${item.item.nome}? Este item será removido da ficha.`;
  inventoryDiscardDialog.showModal();
  inventoryDiscardCancel.focus({ preventScroll: true });
}

function solicitarDescarteDoItemSelecionado() {
  const selecao = obterSelecaoAtualDoInventario();
  if (!selecao) return;
  if (selecao.kind === "bench") {
    descartarItemImportado();
    return;
  }
  if (selecao.kind === "inventory") abrirConfirmacaoDeDescarte();
}

function cancelarDescarteDoInventario() {
  inventoryUIState.discardingItemId = null;
  inventoryDiscardDialog.close();
  sheetDiscardItem.focus({ preventScroll: true });
}

function confirmarDescarteDoInventario() {
  const itemId = inventoryUIState.discardingItemId;
  if (!itemId) return;
  inventoryDiscardDialog.close();
  executarMutacaoDoInventario(function (inventario, estadoDaInterface) {
    const indice = inventario.findIndex(function (item) {
      return item.id === itemId;
    });
    if (indice < 0) return false;
    inventario.splice(indice, 1);
    estadoDaInterface.discardingItemId = null;
    estadoDaInterface.selectedItemId = null;
    estadoDaInterface.selectedItemSource = null;
    estadoDaInterface.movingItemId = null;
    recalcularItemPendenteAposReorganizacao(inventario, estadoDaInterface);
    return true;
  });
  sheetImportItem.focus({ preventScroll: true });
}
