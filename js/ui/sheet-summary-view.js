function marcarFichaComoAlterada() {
  fichaPossuiAlteracoes = true;
  atualizarEstadoDeSalvamento();
}

function alterarVidaAtual(diferenca) {
  definirVidaAtual(personagem.recursos.vidaAtual + diferenca);
}

function definirVidaAtual(valor) {
  const valorAnterior = personagem.recursos.vidaAtual;
  const proximoValor = limitarValor(valor, 0, personagem.recursos.vidaMaxima);
  if (proximoValor === valorAnterior) {
    renderizarRecursosDaFicha();
    return;
  }

  personagem.recursos.vidaAtual = proximoValor;
  marcarFichaComoAlterada();
  renderizarRecursosDaFicha();
  animarMudancaDeRecurso(
    sheetLifeCard,
    proximoValor < valorAnterior ? "is-taking-damage" : "is-being-healed"
  );
}

function alterarManaAtual(diferenca) {
  definirManaAtual(personagem.recursos.manaAtual + diferenca);
}

function definirManaAtual(valor) {
  const valorAnterior = personagem.recursos.manaAtual;
  const proximoValor = limitarValor(valor, 0, personagem.recursos.manaMaxima);
  if (proximoValor === valorAnterior) {
    renderizarRecursosDaFicha();
    return;
  }

  personagem.recursos.manaAtual = proximoValor;
  marcarFichaComoAlterada();
  renderizarRecursosDaFicha();
  animarMudancaDeRecurso(
    sheetManaCard,
    proximoValor < valorAnterior ? "is-spending-mana" : "is-restoring-mana"
  );
}

function calcularPorcentagem(atual, maximo) {
  if (maximo <= 0) return 0;
  return Math.round(Math.min(100, Math.max(0, (atual / maximo) * 100)));
}

function renderizarIdentidadeDaFicha() {
  sheetCharacterName.textContent = personagem.nome || "Sem nome";
  sheetPlayerName.textContent = obterValorOuNaoInformado(personagem.jogador);
  sheetCampaignName.textContent = obterValorOuNaoInformado(personagem.campanha);
  sheetMasterName.textContent = obterValorOuNaoInformado(personagem.mestre);
  sheetSpeciesName.textContent = obterNomeDaEspecieComVariante();
  sheetLineageName.textContent = obterNomeDaVarianteParaFicha();
  sheetClassName.textContent = obterNomeDaClasseParaResumo();
  sheetOriginTitle.textContent = personagem.origem.titulo || "Não definida";
  sheetOriginPlace.textContent = obterValorOuNaoInformado(personagem.origem.local);
  sheetLevel.textContent = personagem.nivel;
  sheetExperience.textContent = personagem.experiencia;
  sheetEvolutionPoints.textContent = personagem.pontosEvolucao;
  sheetGloryPoints.textContent = personagem.pontosGloria;

  if (personagem.retrato) {
    sheetPortraitImage.src = personagem.retrato;
    sheetPortraitImage.alt = personagem.nome ? `Retrato de ${personagem.nome}` : "Retrato do personagem";
    sheetPortraitImage.hidden = false;
    sheetPortraitEmpty.hidden = true;
  } else {
    sheetPortraitImage.hidden = true;
    sheetPortraitImage.removeAttribute("src");
    sheetPortraitEmpty.hidden = false;
  }
}

function renderizarCombateDaFicha() {
  sheetDefense.textContent = personagem.combate.defesa;
  sheetDamageReduction.textContent = personagem.combate.reducaoDano;
  sheetInitiative.textContent = personagem.combate.iniciativa;
  sheetMovement.textContent = personagem.combate.movimento;
}

function ehArmaDoInventario(item) {
  return item?.item?.tipo === "arma";
}

function obterDanoDaArma(item) {
  const atributo = item?.item?.atributoPrincipal;
  const rotulo = String(atributo?.rotulo || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  return rotulo === "dano" && atributo?.valor ? atributo.valor : "—";
}

function obterAlcanceDaArma(item) {
  const propriedade = (item?.item?.propriedades || []).find(function (valor) {
    return /^\s*alcance\s*:/i.test(valor);
  });
  return propriedade ? propriedade.replace(/^\s*alcance\s*:\s*/i, "").trim() || "—" : "—";
}

function obterArmasDaFicha() {
  const equipadas = [
    { item: personagem.equipamentos?.maoPrincipal, slot: "Mão principal" },
    { item: personagem.equipamentos?.maoSecundaria, slot: "Mão secundária" }
  ].filter(function (entrada) {
    return ehArmaDoInventario(entrada.item);
  });
  const guardadas = (personagem.inventario || [])
    .filter(ehArmaDoInventario)
    .map(function (item) { return { item, slot: "Mochila" }; });
  return equipadas.concat(guardadas);
}

function criarCelulaDaTabelaDeArmas(valor) {
  const celula = document.createElement("span");
  celula.setAttribute("role", "cell");
  celula.textContent = valor;
  celula.title = valor;
  return celula;
}

function criarLinhaDaTabelaDeArmas(entrada) {
  const { item, slot } = entrada;
  const linha = document.createElement("div");
  const propriedades = item.item.propriedades?.length
    ? item.item.propriedades.join(" · ")
    : "—";
  linha.className = "sheet-weapons-row";
  linha.classList.toggle("is-equipped", slot !== "Mochila");
  linha.setAttribute("role", "row");
  linha.setAttribute("aria-label", `${item.item.nome}, ${slot}`);
  linha.append(
    criarCelulaDaTabelaDeArmas(item.item.nome),
    criarCelulaDaTabelaDeArmas(obterDanoDaArma(item)),
    criarCelulaDaTabelaDeArmas(slot),
    criarCelulaDaTabelaDeArmas(propriedades),
    criarCelulaDaTabelaDeArmas(String(item.item.quantidade || 1))
  );
  return linha;
}

function renderizarArmasDaFicha() {
  const maoPrincipal = personagem.equipamentos?.maoPrincipal;
  const maoSecundaria = personagem.equipamentos?.maoSecundaria;
  const armaEquipada = ehArmaDoInventario(maoPrincipal)
    ? maoPrincipal
    : ehArmaDoInventario(maoSecundaria)
      ? maoSecundaria
      : null;
  sheetCombatWeapon.textContent = armaEquipada?.item.nome || "Nenhuma";
  sheetCombatWeaponDamage.textContent = armaEquipada ? obterDanoDaArma(armaEquipada) : "—";
  sheetCombatWeaponRange.textContent = armaEquipada ? obterAlcanceDaArma(armaEquipada) : "—";

  const armas = obterArmasDaFicha();
  if (!armas.length) {
    const vazio = document.createElement("div");
    const mensagem = criarCelulaDaTabelaDeArmas("Nenhuma arma cadastrada.");
    vazio.className = "sheet-static-table__empty";
    vazio.setAttribute("role", "row");
    vazio.append(mensagem);
    sheetWeaponsList.replaceChildren(vazio);
    return;
  }
  sheetWeaponsList.replaceChildren(...armas.map(criarLinhaDaTabelaDeArmas));
}

function renderizarRecursoDaFicha(config) {
  const atual = personagem.recursos[config.atual];
  const maximo = personagem.recursos[config.maximo];
  const porcentagem = calcularPorcentagem(atual, maximo);

  config.input.max = maximo;
  config.input.value = atual;
  config.maxDisplay.textContent = maximo;
  config.minusButton.disabled = atual <= 0;
  config.plusButton.disabled = atual >= maximo;
  config.bar.style.width = `${porcentagem}%`;
  config.percent.textContent = `${porcentagem}%`;
}

function renderizarRecursosDaFicha() {
  RECURSOS_DA_FICHA.forEach(renderizarRecursoDaFicha);

  const vidaMaxima = personagem.recursos.vidaMaxima;
  const vidaCritica = vidaMaxima > 0 && personagem.recursos.vidaAtual / vidaMaxima <= 0.25;
  sheetLifeCard.classList.toggle("is-critical", vidaCritica);
  sheetLifeStatus.hidden = !vidaCritica;
}

function renderizarAtributosDaFicha() {
  const modificadores = obterModificadoresDaEspecie() || criarModificadoresZerados();
  const motionDeAtributo = window.GrimorioAttributeMotion;
  const iconesPorAtributo = {
    forca: "sheet-icon-arm",
    agilidade: "sheet-icon-wing",
    intelecto: "sheet-icon-eye",
    resistencia: "sheet-icon-shield"
  };

  sheetAttributesList.replaceChildren();
  atributosDeMeridian.forEach(function (atributo) {
    const distribuido = personagem.atributos[atributo.id];
    const modificadorEspecie = modificadores[atributo.id] || 0;
    const temporario = obterModificadorTemporario(atributo.id);
    const final = distribuido + modificadorEspecie + temporario;
    const snapshotAtual = motionDeAtributo?.criarSnapshotDoAtributo({
      distributed: distribuido,
      species: modificadorEspecie,
      temporary: temporario,
      total: final
    });
    const snapshotAnterior = snapshotsAnterioresDosAtributosDaFicha.get(atributo.id);
    const mudanca = snapshotAnterior && snapshotAtual
      ? motionDeAtributo.compararSnapshotsDoAtributo(snapshotAnterior, snapshotAtual)
      : null;
    const card = document.createElement("article");
    const titulo = document.createElement("h3");
    const icone = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const usoDoIcone = document.createElementNS("http://www.w3.org/2000/svg", "use");
    const finalLabel = document.createElement("span");
    const finalValue = document.createElement("strong");
    const lista = document.createElement("dl");

    card.className = "sheet-attribute-card";
    card.dataset.attribute = atributo.id;
    card.dataset.attributeMotion = motionDeAtributo?.obterVisualDoAtributo(atributo.id) || "";
    card.classList.toggle("is-at-limit", final >= calcularLimiteFinal(atributo.id));
    icone.setAttribute("class", "sheet-icon");
    icone.setAttribute("aria-hidden", "true");
    usoDoIcone.setAttribute("href", `#${iconesPorAtributo[atributo.id]}`);
    icone.append(usoDoIcone);
    titulo.append(icone, document.createTextNode(atributo.nome));
    finalLabel.textContent = "Total";
    finalValue.className = "sheet-attribute-final";
    finalValue.textContent = final;
    lista.className = "sheet-attribute-breakdown";

    [
      ["Distribuído", distribuido, "", "distributed"],
      ["Espécie", formatarModificador(modificadorEspecie), modificadorEspecie > 0 ? "sheet-modifier-positive" : modificadorEspecie < 0 ? "sheet-modifier-negative" : "", "species"],
      ["Temporário", formatarModificador(temporario), temporario > 0 ? "sheet-modifier-positive" : temporario < 0 ? "sheet-modifier-negative" : "", "temporary"]
    ].forEach(function ([label, value, className, source]) {
      const linha = document.createElement("div");
      const dt = document.createElement("dt");
      const dd = document.createElement("dd");

      linha.dataset.attributeSource = source;
      dt.textContent = label;
      dd.textContent = value;
      if (className) dd.className = className;
      linha.append(dt, dd);
      lista.append(linha);
    });

    card.append(titulo, finalLabel, finalValue, lista);
    sheetAttributesList.append(card);

    if (mudanca?.changed) {
      const classesDaMudanca = motionDeAtributo.obterClassesDaMudanca(mudanca);
      window.GrimorioMotion?.animarMudancaDeAtributo(card, classesDaMudanca);
    }
    if (snapshotAtual) snapshotsAnterioresDosAtributosDaFicha.set(atributo.id, snapshotAtual);
  });
}

function resetarSnapshotsDosAtributosDaFicha() {
  snapshotsAnterioresDosAtributosDaFicha.clear();
}

function criarCabecalhoDaTabelaDePericiasDaFicha() {
  const header = document.createElement("div");
  header.className = "sheet-skill-row sheet-skill-row--header";
  header.setAttribute("role", "row");
  ["Perícia", "Atributo", "Dado", "Bônus"].forEach(function (texto) {
    const span = document.createElement("span");
    span.textContent = texto;
    span.setAttribute("role", "columnheader");
    header.append(span);
  });
  return header;
}

function criarLinhaDePericiaDaFicha(pericia) {
  const row = document.createElement("div");
  row.className = "sheet-skill-row";
  row.setAttribute("role", "row");

  [
    pericia.nome,
    obterSiglaDoAtributo(pericia.atributo),
    CONFIGURACAO_PERICIAS.dadoTreinado,
    calcularValorFinalDaFicha(pericia.atributo)
  ].forEach(function (valor, index) {
    const span = document.createElement("span");
    span.textContent = valor;
    span.setAttribute("role", "cell");
    if (index === 1) {
      span.className = `sheet-skill-attribute sheet-skill-attribute--${pericia.atributo}`;
    }
    row.append(span);
  });

  return row;
}

function renderizarPericiasDaFicha() {
  sheetSkillsList.replaceChildren();

  const periciasTreinadas = PERICIAS.filter(function (pericia) {
    return personagem.pericias[pericia.id] === true;
  });
  const tabela = document.createElement("div");
  tabela.className = "sheet-skills-table";
  tabela.setAttribute("role", "table");
  tabela.setAttribute("aria-label", "Perícias treinadas");
  tabela.append(criarCabecalhoDaTabelaDePericiasDaFicha());
  periciasTreinadas.forEach(function (pericia) {
    tabela.append(criarLinhaDePericiaDaFicha(pericia));
  });
  sheetSkillsList.append(tabela);
}

function obterTituloDaVulnerabilidadeParaFicha(especie, variante, vulnerabilidade) {
  if (!vulnerabilidade) return "Não definida";

  const nome = vulnerabilidade.nome || "";
  if (nome.includes("—")) {
    return nome.split("—").pop().trim().toUpperCase();
  }

  const titulosPorVariante = {
    felina: "Fotossensibilidade",
    canidea: "Sensibilidade química",
    caprina: "Investida limitada",
    reptiliana: "Frio extremo"
  };

  return (titulosPorVariante[variante?.id] || especie?.nome || nome).toUpperCase();
}

function renderizarVulnerabilidadeDaFicha() {
  const especie = obterEspecieSelecionada();
  const variante = obterVarianteSelecionada(especie);
  const fonte = variante || especie;
  const vulnerabilidade = fonte?.vulnerabilidade || especie?.vulnerabilidade || null;
  const resumo = fonte?.vulnerabilidadeResumo || especie?.vulnerabilidadeResumo || vulnerabilidade?.descricao || "Não definida.";

  sheetVulnerabilityTitle.textContent = obterTituloDaVulnerabilidadeParaFicha(especie, variante, vulnerabilidade);
  sheetVulnerabilityDescription.textContent = resumo;
  sheetVulnerabilityDescription.title = resumo;
}

function atualizarEstadoDeSalvamento() {
  const estado = fichaPossuiAlteracoes ? "Alterações não salvas" : "Salvo nesta sessão";
  sheetSaveState.textContent = estado;
  sheetSaveState.classList.toggle("is-dirty", fichaPossuiAlteracoes);
  sheetFooterSaveState.textContent = fichaPossuiAlteracoes
    ? "Última atualização: alterações não salvas"
    : "Última atualização: salvo nesta sessão";
}

function renderizarEstadoDeSalvamento() {
  atualizarEstadoDeSalvamento();
}

function salvarFichaNaSessao(envelopePronto, mostrarMensagem) {
  const envelope = envelopePronto || criarEnvelopeDaFicha();

  fichaSalvaNaSessao = JSON.stringify(envelope, null, 2);
  fichaPossuiAlteracoes = false;

  atualizarEstadoDeSalvamento();
  if (mostrarMensagem !== false) {
    mostrarMensagemDaFicha("Alterações salvas nesta sessão.");
  }
}

function fichaAtualDifereDaSalvaNaSessao() {
  if (!fichaSalvaNaSessao) return true;

  try {
    const fichaSalva = JSON.parse(fichaSalvaNaSessao);
    return JSON.stringify(fichaSalva.personagem) !== JSON.stringify(personagem);
  } catch (erro) {
    return true;
  }
}

function exportarFichaJson() {
  const envelope = criarEnvelopeDaFicha();
  salvarFichaNaSessao(envelope, false);
  salvarFichaJson(envelope);
}

function mostrarMensagemDaFicha(mensagem, erro) {
  mostrarMensagemDeSalvamento(mensagem, erro);
}
