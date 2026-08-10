function obterValorOuNaoInformado(valor) {
  const texto = String(valor ?? "").trim();
  return texto || "Não informado";
}

function obterNomeDaVarianteParaFicha() {
  const especie = obterEspecieSelecionada();
  const variante = obterVarianteSelecionada(especie);

  if (!variante) return "Não informado";
  return variante.nome;
}

function obterNomeDaEspecieComVariante() {
  const especie = obterEspecieSelecionada();
  const variante = obterVarianteSelecionada(especie);

  if (!especie) return "Não definida";
  return variante ? `${especie.nome} — ${variante.nome}` : especie.nome;
}

function obterModificadorTemporario(atributo) {
  if (!personagem.modificadoresTemporarios) return 0;
  return Number(personagem.modificadoresTemporarios[atributo]) || 0;
}

function calcularValorFinalDaFicha(atributo) {
  return calcularValorFinal(atributo) + obterModificadorTemporario(atributo);
}

const dominioDasHabilidades = window.GrimorioAbilitiesDomain;
const {
  limitarValor,
  criarIdHabilidade,
  normalizarTermoHabilidade,
  obterEstadoHabilidade,
  obterRotuloTipoHabilidade,
  obterRotuloEstadoHabilidade,
  obterResumoOperacionalHabilidade
} = dominioDasHabilidades;

function normalizarHabilidade(habilidade) {
  return dominioDasHabilidades.normalizarHabilidade(habilidade, {
    catalogoIcones: CATALOGO_ICONES_HABILIDADE
  });
}

function encontrarHabilidade(habilidadeId) {
  return personagem.habilidades.find(function (habilidade) {
    return habilidade.id === habilidadeId;
  }) || null;
}

function obterDefinicaoIconeHabilidade(iconeId) {
  return CATALOGO_ICONES_HABILIDADE.find(function (icone) {
    return icone.id === iconeId;
  }) || CATALOGO_ICONES_HABILIDADE[0];
}

function criarIconeHabilidade(iconeId) {
  const definicao = obterDefinicaoIconeHabilidade(iconeId);
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
  svg.classList.add("sheet-icon");
  svg.setAttribute("aria-hidden", "true");
  use.setAttribute("href", `#sheet-icon-${definicao.simbolo}`);
  svg.append(use);
  return svg;
}

function criarItemVisualHabilidade(habilidade, modoResumo) {
  const estado = obterEstadoHabilidade(habilidade);
  if (!modoResumo) {
    return window.GrimorioAbilitiesView.createAbilityListCard({
      ability: habilidade,
      state: estado,
      selected: habilidade.id === habilidadeSelecionadaId,
      typeLabel: obterRotuloTipoHabilidade(habilidade.tipo),
      stateLabel: obterRotuloEstadoHabilidade(estado),
      operation: obterResumoOperacionalHabilidade(habilidade),
      createIcon: criarIconeHabilidade
    });
  }

  const button = document.createElement("button");
  button.type = "button";
  button.className = `sheet-ability-summary-item is-${estado}`;
  button.dataset.abilityId = habilidade.id;
  button.setAttribute("aria-label", `${habilidade.nome}: ${obterRotuloEstadoHabilidade(estado)}`);
  const icon = document.createElement("span");
  icon.className = "sheet-ability-item-icon";
  icon.append(criarIconeHabilidade(habilidade.iconeId));

  const copy = document.createElement("span");
  copy.className = "sheet-ability-item-copy";
  const name = document.createElement("strong");
  name.textContent = habilidade.nome;
  const meta = document.createElement("small");
  const atributo = habilidade.atributo ? ` · ${habilidade.atributo.toUpperCase()}` : "";
  meta.textContent = `${obterRotuloTipoHabilidade(habilidade.tipo)}${atributo}`;
  copy.append(name, meta);

  const operation = document.createElement("span");
  operation.className = "sheet-ability-item-operation";
  operation.textContent = obterResumoOperacionalHabilidade(habilidade);

  button.append(icon, copy, operation);
  return button;
}

function renderizarResumoDeHabilidades() {
  sheetAbilitiesSummary.replaceChildren();
  const habilidades = personagem.habilidades.slice(0, LIMITE_HABILIDADES_RESUMO);

  if (habilidades.length === 0) {
    const empty = document.createElement("div");
    empty.className = "sheet-ability-empty sheet-ability-empty--summary";
    empty.innerHTML = "<strong>Nenhuma habilidade adicionada.</strong><span>Use “Ver todas” para importar um arquivo JSON.</span>";
    sheetAbilitiesSummary.append(empty);
    return;
  }

  habilidades.forEach(function (habilidade) {
    sheetAbilitiesSummary.append(criarItemVisualHabilidade(habilidade, true));
  });
}

function obterHabilidadesFiltradas() {
  const busca = normalizarTermoHabilidade(buscaHabilidade);
  return personagem.habilidades.filter(function (habilidade) {
    const correspondeAoTipo = filtroTipoHabilidade === "todos" || habilidade.tipo === filtroTipoHabilidade;
    const correspondeAoEstado = filtroEstadoHabilidade === "todos"
      || obterEstadoHabilidade(habilidade) === filtroEstadoHabilidade;
    const correspondeABusca = !busca || normalizarTermoHabilidade(
      `${habilidade.nome} ${habilidade.tipo} ${habilidade.atributo} ${habilidade.descricao}`
    ).includes(busca);
    return correspondeAoTipo && correspondeAoEstado && correspondeABusca;
  });
}

function renderizarListaDeHabilidades() {
  sheetAbilityList.replaceChildren();
  const habilidades = obterHabilidadesFiltradas();
  const total = personagem.habilidades.length;
  sheetAbilityListCount.textContent = habilidades.length === total
    ? String(total)
    : `${habilidades.length} de ${total}`;
  sheetAbilityTypeFilter.value = filtroTipoHabilidade;
  sheetAbilityTypeTabs.querySelectorAll("button[data-ability-type-filter]").forEach(function (button) {
    const ativo = button.dataset.abilityTypeFilter === filtroTipoHabilidade;
    button.setAttribute("aria-pressed", String(ativo));
  });

  if (habilidades.length === 0) {
    sheetAbilityList.append(window.GrimorioAbilitiesView.createEmptyState({
      title: total ? "Nenhuma habilidade encontrada." : "Nenhuma habilidade cadastrada.",
      description: total
        ? "Altere os filtros ou tente buscar outro termo."
        : "Importe uma habilidade em JSON para começar.",
      actionLabel: total ? "" : "Importar habilidade",
      action: total ? "" : "import"
    }));
    renderizarDetalhesDaHabilidade(habilidades);
    return;
  }

  if (!habilidades.some(function (habilidade) { return habilidade.id === habilidadeSelecionadaId; })) {
    habilidadeSelecionadaId = habilidades[0].id;
  }

  habilidades.forEach(function (habilidade) {
    sheetAbilityList.append(criarItemVisualHabilidade(habilidade, false));
  });
  renderizarDetalhesDaHabilidade(habilidades);
}

function criarControleOperacionalHabilidade(habilidade, tipo) {
  const dados = habilidade[tipo];
  if (!dados) return null;

  const section = document.createElement("section");
  section.className = "sheet-ability-counter";
  const heading = document.createElement("h3");
  heading.textContent = tipo === "usos" ? "Usos" : "Recarga";
  const controls = document.createElement("div");
  controls.className = "sheet-ability-counter__controls";

  const minus = document.createElement("button");
  minus.type = "button";
  minus.dataset.abilityAction = tipo === "usos" ? "decrease-uses" : "decrease-cooldown";
  minus.setAttribute("aria-label", `Diminuir ${heading.textContent.toLowerCase()} de ${habilidade.nome}`);
  minus.append(criarIconeHabilidade("habilidade-generica"));
  minus.firstElementChild.replaceChildren();
  const minusUse = document.createElementNS("http://www.w3.org/2000/svg", "use");
  minusUse.setAttribute("href", "#sheet-icon-minus");
  minus.firstElementChild.append(minusUse);

  const value = document.createElement("strong");
  value.textContent = tipo === "usos"
    ? `${dados.atual} / ${dados.maximo}`
    : `${dados.restante} / ${dados.valor} ${dados.unidade}`;

  const plus = document.createElement("button");
  plus.type = "button";
  plus.dataset.abilityAction = tipo === "usos" ? "increase-uses" : "increase-cooldown";
  plus.setAttribute("aria-label", `Aumentar ${heading.textContent.toLowerCase()} de ${habilidade.nome}`);
  plus.append(criarIconeHabilidade("habilidade-generica"));
  plus.firstElementChild.replaceChildren();
  const plusUse = document.createElementNS("http://www.w3.org/2000/svg", "use");
  plusUse.setAttribute("href", "#sheet-icon-plus");
  plus.firstElementChild.append(plusUse);

  const atual = tipo === "usos" ? dados.atual : dados.restante;
  const maximo = tipo === "usos" ? dados.maximo : dados.valor;
  minus.disabled = atual <= 0;
  plus.disabled = atual >= maximo;
  controls.append(minus, value, plus);
  section.append(heading, controls);
  if (tipo === "usos" && dados.recuperacao) {
    const recovery = document.createElement("p");
    recovery.className = "sheet-ability-counter__recovery";
    recovery.textContent = `Recuperação: ${dados.recuperacao}`;
    section.append(recovery);
  }
  return section;
}

function renderizarDetalhesDaHabilidade(habilidadesVisiveis = obterHabilidadesFiltradas()) {
  sheetAbilityDetails.replaceChildren();
  const habilidade = habilidadesVisiveis.find(function (item) {
    return item.id === habilidadeSelecionadaId;
  }) || null;

  if (!habilidade) {
    const total = personagem.habilidades.length;
    sheetAbilityDetails.append(window.GrimorioAbilitiesView.createEmptyState({
      title: total ? "Nenhuma habilidade visível." : "Seu grimório está vazio.",
      description: total
        ? "Altere os filtros ou a busca para voltar a inspecionar uma habilidade."
        : "Importe uma habilidade para consultar seus detalhes aqui."
    }));
    return;
  }

  const estado = obterEstadoHabilidade(habilidade);
  const header = window.GrimorioAbilitiesView.createDetailHeader({
    ability: habilidade,
    state: estado,
    typeLabel: obterRotuloTipoHabilidade(habilidade.tipo),
    stateLabel: obterRotuloEstadoHabilidade(estado),
    createIcon: criarIconeHabilidade
  });

  const mechanics = document.createElement("div");
  mechanics.className = "ability-mechanics";
  mechanics.append(
    window.GrimorioAbilitiesView.createMechanicCell({
      label: "Custos",
      iconId: "mana",
      createIcon: criarIconeHabilidade,
      lines: [
        { label: "Mana", value: habilidade.custos.mana || "—" },
        { label: "PE", value: habilidade.custos.pe || "—" }
      ]
    }),
    window.GrimorioAbilitiesView.createMechanicCell({
      label: "Alcance",
      value: habilidade.alcance || "—",
      iconId: "alvo",
      createIcon: criarIconeHabilidade
    }),
    window.GrimorioAbilitiesView.createMechanicCell({
      label: "Dano",
      value: habilidade.dano || "—",
      iconId: "espada",
      createIcon: criarIconeHabilidade
    }),
    window.GrimorioAbilitiesView.createMechanicCell({
      label: "Duração",
      value: habilidade.duracao || "—",
      iconId: "tempo",
      createIcon: criarIconeHabilidade
    })
  );

  const counters = document.createElement("div");
  counters.className = "ability-operational";
  [
    criarControleOperacionalHabilidade(habilidade, "usos"),
    criarControleOperacionalHabilidade(habilidade, "recarga")
  ].filter(Boolean).forEach(function (counter) { counters.append(counter); });

  const content = document.createElement("div");
  content.className = "ability-detail__content";
  [
    window.GrimorioAbilitiesView.createTextSection({
      title: "Descrição",
      content: habilidade.descricao,
      variant: "description"
    }),
    window.GrimorioAbilitiesView.createTextSection({
      title: "Condições e efeitos",
      content: habilidade.efeitos,
      variant: "effects"
    }),
    window.GrimorioAbilitiesView.createTextSection({
      title: "Requisitos",
      content: habilidade.requisitos,
      variant: "requirements"
    }),
    window.GrimorioAbilitiesView.createTextSection({
      title: "Limitações",
      content: habilidade.limitacoes,
      variant: "limitations"
    }),
    window.GrimorioAbilitiesView.createTextSection({
      title: "Observações",
      content: habilidade.observacoes,
      variant: "observations"
    })
  ].filter(Boolean).forEach(function (section) { content.append(section); });

  sheetAbilityDetails.append(header, mechanics);
  if (counters.children.length) sheetAbilityDetails.append(counters);
  if (content.children.length) sheetAbilityDetails.append(content);
}

function renderizarEstatisticasDeHabilidades() {
  sheetAbilityStats.replaceChildren();
  const totaisDeUsos = personagem.habilidades.reduce(function (total, habilidade) {
    if (!habilidade.usos) return total;
    total.atual += habilidade.usos.atual;
    total.maximo += habilidade.usos.maximo;
    return total;
  }, { atual: 0, maximo: 0 });

  const estatisticas = [
    { rotulo: "Total de habilidades", valor: personagem.habilidades.length, subtitulo: "no grimório", icone: "book" },
    { rotulo: "Passivas", valor: personagem.habilidades.filter(function (item) { return item.tipo === "passiva"; }).length, subtitulo: "sempre ativas", icone: "wing" },
    { rotulo: "Técnicas", valor: personagem.habilidades.filter(function (item) { return item.tipo === "tecnica"; }).length, subtitulo: "ações treinadas", icone: "rune-star" },
    { rotulo: "Supremas", valor: personagem.habilidades.filter(function (item) { return item.tipo === "suprema"; }).length, subtitulo: "poder máximo", icone: "crown" },
    { rotulo: "Usos restantes", valor: `${totaisDeUsos.atual} / ${totaisDeUsos.maximo}`, subtitulo: "cargas disponíveis", icone: "hourglass" }
  ];

  estatisticas.forEach(function (estatistica) {
    const iconId = CATALOGO_ICONES_HABILIDADE.find(function (definicao) {
      return definicao.simbolo === estatistica.icone;
    })?.id || "habilidade-generica";
    sheetAbilityStats.append(window.GrimorioAbilitiesView.createLedgerItem({
      label: estatistica.rotulo,
      value: estatistica.valor,
      subtitle: estatistica.subtitulo,
      iconId,
      createIcon: criarIconeHabilidade
    }));
  });
}

function renderizarHabilidadesDaFicha() {
  renderizarResumoDeHabilidades();
  renderizarListaDeHabilidades();
  renderizarEstatisticasDeHabilidades();
}

function renderizarHabilidadesAposMutacao() {
  marcarFichaComoAlterada();
  renderizarHabilidadesDaFicha();
}

function alterarUsosDaHabilidade(habilidadeId, diferenca) {
  const habilidade = encontrarHabilidade(habilidadeId);
  if (!habilidade?.usos) return;
  const proximo = limitarValor(habilidade.usos.atual + diferenca, 0, habilidade.usos.maximo);
  if (proximo === habilidade.usos.atual) return;
  habilidade.usos.atual = proximo;
  renderizarHabilidadesAposMutacao();
}

function alterarRecargaDaHabilidade(habilidadeId, diferenca) {
  const habilidade = encontrarHabilidade(habilidadeId);
  if (!habilidade?.recarga) return;
  const proximo = limitarValor(habilidade.recarga.restante + diferenca, 0, habilidade.recarga.valor);
  if (proximo === habilidade.recarga.restante) return;
  habilidade.recarga.restante = proximo;
  renderizarHabilidadesAposMutacao();
}

function definirMenuDeSecoesFuturasAberto(aberto) {
  const deveAbrir = Boolean(aberto);
  sheetSidebar.classList.toggle("is-more-open", deveAbrir);
  sheetSidebarMore.setAttribute("aria-expanded", String(deveAbrir));
}

function ativarSecaoDaFicha(secao, habilidadeId) {
  if (!["summary", "abilities", "inventory"].includes(secao)) return;
  definirMenuDeSecoesFuturasAberto(false);
  if (habilidadeId && encontrarHabilidade(habilidadeId)) habilidadeSelecionadaId = habilidadeId;

  sheetViews.forEach(function (view) {
    view.hidden = view.dataset.sheetView !== secao;
  });
  sheetSidebar.querySelectorAll("button[data-sheet-section]").forEach(function (button) {
    const ativa = button.dataset.sheetSection === secao;
    button.classList.toggle("is-active", ativa);
    if (ativa) {
      button.setAttribute("aria-current", "page");
    } else {
      button.removeAttribute("aria-current");
    }
  });

  if (secao === "abilities") {
    renderizarListaDeHabilidades();
    sheetAbilitiesViewHeading.focus({ preventScroll: true });
  }
  if (secao === "inventory") {
    sheetInventoryViewHeading.focus({ preventScroll: true });
  }
  mostrarMensagemDaFicha("");
}

function existeHabilidadeComMesmoNome(nome) {
  const nomeNormalizado = normalizarTermoHabilidade(nome);
  return personagem.habilidades.some(function (habilidade) {
    return normalizarTermoHabilidade(habilidade.nome) === nomeNormalizado;
  });
}

function validarHabilidadeImportada(dados) {
  if (!dominioDasHabilidades.ehObjetoDeDados(dados)) {
    throw new Error("O arquivo não contém uma habilidade válida.");
  }

  const versao = Number(dados.schemaVersion ?? dados.versao ?? 1);
  if (Number.isFinite(versao) && versao > 1) {
    throw new Error("A habilidade foi criada em uma versão mais recente do Grimório RPG.");
  }

  const conteudo = dados.habilidade ?? dados.ability ?? dados;
  if (!dominioDasHabilidades.ehObjetoDeDados(conteudo)) {
    throw new Error("O campo 'habilidade' precisa ser um objeto.");
  }
  if (!String(conteudo.nome ?? conteudo.name ?? "").trim()) {
    throw new Error("O campo 'nome' é obrigatório.");
  }

  const habilidade = normalizarHabilidade(conteudo);
  habilidade.id = criarIdHabilidade();
  return habilidade;
}

function renderizarOpcoesDeIcone() {
  abilityIconOptions.replaceChildren();
  CATALOGO_ICONES_HABILIDADE.forEach(function (icone) {
    const label = document.createElement("label");
    label.className = "ability-icon-option";
    label.title = icone.nome;
    const input = document.createElement("input");
    input.type = "radio";
    input.name = "ability-icon";
    input.value = icone.id;
    input.checked = icone.id === iconeHabilidadePendente;
    const visual = document.createElement("span");
    visual.append(criarIconeHabilidade(icone.id));
    const name = document.createElement("span");
    name.className = "sr-only";
    name.textContent = icone.nome;
    label.append(input, visual, name);
    abilityIconOptions.append(label);
  });
}

function abrirDialogDeIcone(habilidade, modo) {
  habilidadePendente = habilidade;
  modoDialogHabilidade = modo;
  iconeHabilidadePendente = habilidade.iconeId || "habilidade-generica";
  abilityImportTitle.textContent = modo === "icone"
    ? `Alterar ícone de ${habilidade.nome}`
    : "Revise os dados e escolha um ícone";
  abilityImportConfirm.textContent = modo === "icone" ? "Salvar ícone" : "Adicionar à ficha";
  abilityImportStatus.textContent = "";
  abilityImportPreview.replaceChildren();

  const name = document.createElement("strong");
  name.textContent = habilidade.nome;
  const meta = document.createElement("span");
  meta.textContent = `${obterRotuloTipoHabilidade(habilidade.tipo)}${habilidade.atributo ? ` · ${habilidade.atributo.toUpperCase()}` : ""}`;
  const description = document.createElement("p");
  description.textContent = habilidade.descricao || "Sem descrição.";
  abilityImportPreview.append(name, meta, description);

  const duplicada = modo === "importar" && existeHabilidadeComMesmoNome(habilidade.nome);
  abilityDuplicateWarning.hidden = !duplicada;
  abilityDuplicateWarning.textContent = duplicada
    ? `Já existe uma habilidade chamada “${habilidade.nome}”. Confirme para importar mesmo assim.`
    : "";
  if (duplicada) abilityImportConfirm.textContent = "Importar mesmo assim";

  renderizarOpcoesDeIcone();
  abilityImportDialog.showModal();
  const selecionado = abilityIconOptions.querySelector("input:checked");
  if (selecionado) selecionado.focus();
}

async function importarArquivoDeHabilidade(event) {
  const arquivo = event.target.files[0];
  if (!arquivo) return;

  try {
    if (!arquivo.name.toLowerCase().endsWith(".json")) {
      throw new Error("Selecione um arquivo de habilidade em formato JSON.");
    }
    if (arquivo.size > 1024 * 1024) {
      throw new Error("O arquivo de habilidade excede o limite de 1 MB.");
    }

    const dados = JSON.parse(await arquivo.text());
    abrirDialogDeIcone(validarHabilidadeImportada(dados), "importar");
  } catch (erro) {
    mostrarMensagemDaFicha(
      erro instanceof SyntaxError
        ? "O arquivo não contém um JSON válido."
        : erro.message || "Não foi possível importar esta habilidade.",
      true
    );
  } finally {
    sheetAbilityFile.value = "";
  }
}

function confirmarDialogDeHabilidade() {
  if (!habilidadePendente) return;
  habilidadePendente.iconeId = iconeHabilidadePendente;

  if (modoDialogHabilidade === "icone") {
    renderizarHabilidadesAposMutacao();
  } else {
    personagem.habilidades.push(normalizarHabilidade(habilidadePendente));
    habilidadeSelecionadaId = habilidadePendente.id;
    renderizarHabilidadesAposMutacao();
  }

  abilityImportDialog.close();
  habilidadePendente = null;
}

function solicitarRemocaoDaHabilidade() {
  const habilidade = encontrarHabilidade(habilidadeSelecionadaId);
  if (!habilidade) return;
  abilityRemoveDescription.textContent = `“${habilidade.nome}” será removida da ficha atual.`;
  abilityRemoveDialog.showModal();
  abilityRemoveConfirm.focus();
}

function removerHabilidadeSelecionada() {
  const indice = personagem.habilidades.findIndex(function (habilidade) {
    return habilidade.id === habilidadeSelecionadaId;
  });
  if (indice < 0) return;

  personagem.habilidades.splice(indice, 1);
  habilidadeSelecionadaId = personagem.habilidades[indice]?.id
    || personagem.habilidades[indice - 1]?.id
    || null;
  abilityRemoveDialog.close();
  renderizarHabilidadesAposMutacao();
}
