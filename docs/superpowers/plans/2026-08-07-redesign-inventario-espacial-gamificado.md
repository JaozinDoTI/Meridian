# Redesign do Inventário Espacial Gamificado — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transformar a aba Inventário em uma experiência diegética de RPG centrada na organização física da mochila, preservando as regras espaciais e a compatibilidade das fichas existentes.

**Architecture:** Manter `inventory-domain.js` como núcleo puro de validação espacial e reorganizar a interface em quatro superfícies: recebimento, mochila, inspeção e equipamento/resumo. Evoluir o schema de forma compatível para suportar arte, atributos de item, quantidade, moedas, capacidade de peso e equipamento, sem reescrever a lógica de colisão, migração, drag-and-drop e persistência que já funciona.

**Tech Stack:** HTML sem framework, CSS responsivo, JavaScript DOM/Pointer Events, JSON versionado e SVG/assets locais.

**Restrição do projeto:** por solicitação do usuário, não criar, adicionar ou executar testes automatizados. A validação descrita neste plano é exclusivamente manual e visual.

---

## Diagnóstico do estado atual

### O que deve ser preservado

- `inventory-domain.js` já concentra a grade 6 × 5, dimensões, rotações 0°/90°, células ocupadas, colisão, limites, procura de posição e migração de inventários legados.
- `script.js` já possui estado transitório separado do personagem (`inventoryUIState`), importação validada, item pendente, seleção, movimentação, preview de footprint, confirmação, descarte e drag com Pointer Events.
- A importação atual já não persiste o item imediatamente. O item fica em `pendingPlacement` até um posicionamento válido ser confirmado.
- A interface já oferece navegação por teclado durante o posicionamento e mensagens por `aria-live`.
- O CSS já contém base visual de mochila, raridade, estados válido/inválido, proxy de arraste e animações curtas.

### Lacunas confirmadas

- O item pendente aparece dentro do painel genérico de detalhes; não existe uma bandeja visual autônoma e arrastável.
- O arraste direto existe apenas para itens que já estão na mochila; o item recebido ainda depende de selecionar uma célula e confirmar.
- Os cards usam símbolo tipográfico e texto, não imagem/silhueta como elemento dominante.
- O domínio aceita rotação, mas a UI não possui ação “Girar 90°” nem atualização de estado/persistência da rotação.
- Não há modelo de equipamento nem slot de armadura.
- Não há moedas, capacidade máxima de peso, quantidade/empilhamento funcional, dano, defesa, atributo principal ou campos especiais.
- O JSON de item v1 aceita apenas nome, tipo, raridade, descrição, peso e tamanho; portanto a proposta visual completa exige evolução compatível do schema.
- A responsividade atual apenas empilha painéis; não oferece navegação móvel entre Mochila, Recebido, Equipamento e Detalhes.

## Proposta de experiência

### Hierarquia desktop

1. Cabeçalho compacto com título, ação de importação e indicadores de peso/espaço.
2. Coluna esquerda estreita: “Item recebido”, exibida somente quando há item pendente; quando vazia, funciona como ponto de importação e instrução.
3. Centro dominante: mochila física, ocupando cerca de 55–65% da largura útil.
4. Coluna direita: equipamento na metade superior e inspeção contextual na metade inferior.
5. Rodapé interno: microcards de itens, espaço, peso, ouro e prata.

Em larguras intermediárias, a bandeja recebida vira uma faixa acima da mochila e equipamento/inspeção ficam abaixo. Em telas pequenas, usar abas internas (`Mochila`, `Recebido`, `Equipamento`, `Detalhes`) sem reduzir as células abaixo de 54 px; a mochila mantém rolagem horizontal quando necessário.

### Direção visual

- Mochila como objeto: couro/tecido escuro, costura, rebites e profundidade, sem transformar cada célula em um quadrado chamativo.
- Identidade coerente com o Grimório: pergaminho e vinho nos painéis externos; interior mais escuro e material na mochila.
- Itens como peças recortadas: imagem em `object-fit: contain`, sombra de contato, faixa mínima de raridade e texto apenas quando houver área útil.
- Silhueta local por categoria como fallback quando o JSON não trouxer imagem.
- Estados verdes/vermelhos limitados ao footprint e ao feedback de encaixe, evitando “neon” permanente.
- Respeitar `prefers-reduced-motion`; animações entre 140 e 240 ms.

### Fluxo principal

1. Jogador clica em “Receber item” e escolhe o JSON.
2. O arquivo é validado e gera `pendingPlacement`; nenhum dado persistente muda.
3. A bandeja abre e apresenta arte, raridade, atributo principal, peso, quantidade e dimensões na proporção do item.
4. O jogador pode girar o item antes ou durante o posicionamento.
5. Ao arrastar a peça para a mochila, o proxy mantém a proporção em células e o grid mostra footprint válido/inválido.
6. Drop válido persiste o item e executa animação curta de encaixe; drop inválido devolve a peça à bandeja.
7. Teclado/toque têm fluxo equivalente: “Posicionar”, setas/toque na célula, “Confirmar”.
8. Selecionar item guardado abre inspeção; dali é possível mover, girar, equipar (quando compatível) ou descartar.

### Regras funcionais propostas

- Apenas um item recebido fica pendente por vez, preservando a regra atual e evitando fila não persistida.
- Rotação só aparece para peças não quadradas e deve ser validada antes de efetivar.
- Equipar armadura move a referência para `equipamentos.armadura`; o item continua pertencendo ao personagem, mas deixa de ocupar a mochila. Ao desequipar, exige posição válida antes de remover o equipamento do slot.
- Trocar armadura só ocorre se a armadura anterior puder voltar à mochila; caso contrário, a troca é bloqueada com explicação.
- Peso total inclui mochila + equipamentos. O primeiro incremento do projeto trata peso como indicador/alerta, não como bloqueio, até existir regra oficial de capacidade.
- Quantidade é apenas informacional nesta entrega inicial; empilhamento espacial automático fica fora do escopo até haver regra de negócio definida.
- Ouro e prata pertencem ao personagem, não ao inventário espacial, e são persistidos no envelope da ficha.
- Imagens importadas devem usar URL relativa/local ou `data:` com limite explícito; HTML e SVG arbitrário não devem ser injetados no DOM.

## Evolução de dados

### Item JSON v2, compatível com v1

Adicionar campos opcionais em `item`:

```json
{
  "tipo": "grimorio-item",
  "schemaVersion": 2,
  "item": {
    "nome": "Espada Serrilhada",
    "tipo": "arma",
    "raridade": "raro",
    "descricao": "Lâmina industrial de aço negro.",
    "peso": 3.2,
    "quantidade": 1,
    "tamanho": { "largura": 1, "altura": 4 },
    "imagem": "assets/items/espada-serrilhada.webp",
    "atributoPrincipal": { "rotulo": "Dano", "valor": "2d8 + FOR" },
    "propriedades": ["Duas mãos", "Serrilhada"],
    "equipavelEm": "maoPrincipal"
  }
}
```

Itens v1 continuam válidos, recebendo fallback de quantidade `1`, imagem por categoria e ausência de atributo principal. Antes de persistir a nova estrutura da ficha, incrementar a versão do envelope e manter migração dos inventários existentes.

### Personagem

```js
economia: { ouro: 0, prata: 0 },
capacidadeInventario: { pesoMaximo: null },
equipamentos: { armadura: null }
```

O slot deve guardar a instância completa do item para preservar ID, rotação e metadados. A UI deve suportar um registro declarativo de slots para expansão futura, mas somente `armadura` será ativado nesta entrega.

## Estrutura de arquivos

- Modify: `index.html` — substituir a marcação da aba por shell, bandeja, palco da mochila, resumo, equipamento, inspeção e navegação móvel; adicionar templates/símbolos necessários.
- Modify: `character-sheet.css` — concentrar todo o novo layout e estados do inventário; remover/substituir seletores antigos apenas depois de migrar a marcação.
- Modify: `script.js` — ampliar estado, renderização, drag da bandeja, rotação, equipamento, resumo e integração com persistência.
- Modify: `inventory-domain.js` — normalizar campos opcionais v2 e adicionar operações puras de rotação/equipamento apenas onde houver regra reutilizável.
- Modify: `style.css` — somente se tokens globais ou comportamento do shell da ficha forem necessários; evitar colocar estilos específicos do inventário aqui.
- Create: `assets/inventory/` — texturas leves e silhuetas fallback locais, otimizadas e com licença/proveniência registrada.
- Create: `docs/inventory-item-schema-v2.md` — contrato de importação com exemplos v1/v2 e limites de imagem.

---

## Chunk 1: Fundação visual e dados compatíveis

### Task 1: Congelar o contrato atual e documentar a migração

**Files:**
- Modify: `inventory-domain.js`
- Create: `docs/inventory-item-schema-v2.md`

- [ ] Mapear os campos atualmente aceitos por `normalizeItemDefinition` e a versão atual do envelope da ficha.
- [ ] Documentar defaults e limites de `imagem`, `quantidade`, `atributoPrincipal`, `propriedades` e `equipavelEm`.
- [ ] Implementar normalização aditiva: JSON v1 deve produzir exatamente o comportamento atual, acrescido apenas de defaults seguros.
- [ ] Atualizar a migração da ficha para aceitar inventários antigos sem alterar posições ou IDs.
- [ ] Fazer validação manual no console com um item v1 existente e um item v2 de exemplo; confirmar normalização e mensagens de erro.
- [ ] Commit sugerido: `feat: evolve inventory item schema`

### Task 2: Construir o novo shell do inventário

**Files:**
- Modify: `index.html`
- Modify: `character-sheet.css`

- [ ] Substituir `sheet-inventory-workspace` por regiões semânticas para recebimento, mochila, equipamento, inspeção e resumo.
- [ ] Preservar IDs necessários durante a migração para não quebrar os listeners atuais em um único passo.
- [ ] Fazer a mochila ocupar a área central e estabelecer breakpoints desktop, intermediário e móvel.
- [ ] Adicionar navegação interna móvel com `aria-selected`, `aria-controls` e painéis alternáveis.
- [ ] Verificar manualmente 1440 px, 1024 px, 768 px e 390 px; confirmar que o grid nunca fica ilegível e que não há corte vertical de ações.
- [ ] Commit sugerido: `feat: rebuild inventory workspace layout`

### Task 3: Aplicar a direção de arte da mochila

**Files:**
- Modify: `character-sheet.css`
- Create: `assets/inventory/backpack-texture.webp`
- Create: `assets/inventory/item-fallback-*.svg`

- [ ] Criar textura discreta e fallbacks de arma, armadura, consumível, ferramenta, material e genérico.
- [ ] Reduzir contraste das divisões de célula e concentrar costuras/rebites no contorno da mochila.
- [ ] Definir tokens locais de material, raridade, estado válido, estado inválido e alerta de capacidade.
- [ ] Adicionar fallback sem textura para impressão, alto contraste e falha de asset.
- [ ] Verificar manualmente legibilidade, foco visível e contraste em estados normal, hover, selecionado, válido e inválido.
- [ ] Commit sugerido: `style: create diegetic backpack inventory`

---

## Chunk 2: Recebimento, arraste e peças visuais

### Task 4: Transformar item pendente em bandeja de recebimento

**Files:**
- Modify: `index.html`
- Modify: `script.js`
- Modify: `character-sheet.css`

- [ ] Criar renderizador dedicado da bandeja, separado de `renderizarDetalhesDoInventario`.
- [ ] Renderizar arte/fallback, nome, tipo, raridade, descrição curta, atributo principal, peso, quantidade e dimensões.
- [ ] Dimensionar a miniatura pela proporção efetiva, com limites para peças muito grandes.
- [ ] Manter cancelar/descartar/reorganizar e estados “grande demais”/“sem espaço” na própria bandeja.
- [ ] Remover a sugestão automática visual do grid até o jogador iniciar “Posicionar” ou arrastar.
- [ ] Validar manualmente JSON inválido, v1, v2, item grande demais e mochila sem posição disponível.
- [ ] Commit sugerido: `feat: add received item staging tray`

### Task 5: Permitir drag da bandeja para a mochila

**Files:**
- Modify: `script.js`
- Modify: `character-sheet.css`

- [ ] Generalizar a sessão de ponteiro para origens `backpack` e `receivedTray`.
- [ ] Calcular offset e footprint do item recebido sem depender de `posicao` persistida.
- [ ] Reutilizar `canPlaceItem`, preview de células e confirmação existentes.
- [ ] Em drop inválido, animar retorno à bandeja e manter `pendingPlacement` intacto.
- [ ] Em drop válido, persistir somente no encerramento e mover foco para o item colocado.
- [ ] Manter o fluxo alternativo por teclado/toque: botão “Posicionar”, navegação de célula e Enter.
- [ ] Validar manualmente mouse, toque em emulação, teclado, colisão, limites e cancelamento por Escape.
- [ ] Commit sugerido: `feat: drag received items into backpack`

### Task 6: Renderizar itens como peças ilustradas

**Files:**
- Modify: `script.js`
- Modify: `character-sheet.css`

- [ ] Refatorar `criarBotaoDeItemDoInventario` para criar camada de arte, véu de legibilidade, nome, quantidade e indicadores.
- [ ] Mostrar nome somente quando a área comportar; preservar nome completo no `aria-label` e na inspeção.
- [ ] Aplicar borda de raridade como detalhe, sem preencher o card inteiro por cor.
- [ ] Usar a mesma composição no grid, proxy de arraste e bandeja para continuidade visual.
- [ ] Tratar erro de imagem com fallback por categoria sem layout shift.
- [ ] Verificar manualmente peças 1×1, 1×4, 2×2, 2×5 e rotacionadas.
- [ ] Commit sugerido: `feat: render illustrated inventory pieces`

---

## Chunk 3: Inspeção, rotação e equipamentos

### Task 7: Criar painel de inspeção contextual

**Files:**
- Modify: `index.html`
- Modify: `script.js`
- Modify: `character-sheet.css`

- [ ] Ampliar `criarDetalhesVisuaisDoItem` com imagem grande, categoria, raridade, atributo principal, peso, dimensão, descrição e propriedades.
- [ ] Adicionar ações contextuais `Mover`, `Girar 90°`, `Equipar/Desequipar` e `Descartar` conforme compatibilidade.
- [ ] Manter descarte em confirmação; evitar novos modais para inspeção ou posicionamento.
- [ ] Atualizar foco ao selecionar/fechar ações e manter anúncios sucintos por `aria-live`.
- [ ] Validar manualmente estados vazio, item selecionado, item em movimento e item equipado.
- [ ] Commit sugerido: `feat: add contextual inventory inspection`

### Task 8: Implementar rotação acionável

**Files:**
- Modify: `inventory-domain.js`
- Modify: `script.js`
- Modify: `character-sheet.css`

- [ ] Criar operação pura que proponha 0° ↔ 90° e valide a posição atual ou candidata.
- [ ] Para item pendente, girar imediatamente a peça e recalcular preview/disponibilidade.
- [ ] Para item guardado, efetivar rotação apenas se couber na posição; caso contrário, entrar em modo de reposicionamento com preview, sem corromper o estado anterior.
- [ ] Ocultar/desabilitar a ação para peças quadradas e explicar bloqueios.
- [ ] Suportar atalho `R` durante posicionamento e registrar em `aria-keyshortcuts`.
- [ ] Validar manualmente rotação com borda, colisão, item quadrado e retorno/cancelamento.
- [ ] Commit sugerido: `feat: rotate spatial inventory items`

### Task 9: Adicionar equipamento e slot de armadura

**Files:**
- Modify: `script.js`
- Modify: `index.html`
- Modify: `character-sheet.css`

- [ ] Adicionar `equipamentos.armadura` ao modelo e à migração de ficha.
- [ ] Criar registro declarativo de slots, ativando somente armadura nesta entrega.
- [ ] Renderizar slot físico vazio/preenchido com arte, nome, defesa e peso.
- [ ] Equipar somente itens `armadura`/compatíveis e removê-los da ocupação espacial no mesmo commit de estado.
- [ ] Ao desequipar ou trocar, exigir posição válida para o item que volta à mochila antes de alterar o equipamento.
- [ ] Atualizar imediatamente os resumos visuais dependentes; não inventar bônus de combate sem regra existente.
- [ ] Validar manualmente equipar, desequipar, troca com espaço, troca sem espaço e exportar/importar ficha equipada.
- [ ] Commit sugerido: `feat: add armor equipment slot`

---

## Chunk 4: Resumo, responsividade e acabamento

### Task 10: Criar resumo gamificado do inventário

**Files:**
- Modify: `script.js`
- Modify: `index.html`
- Modify: `character-sheet.css`

- [ ] Calcular peso da mochila e dos equipamentos a partir dos itens normalizados.
- [ ] Exibir microcards de peso, itens, espaço, ouro e prata sem tabela.
- [ ] Usar barra de espaço existente e adicionar barra de peso somente quando `pesoMaximo` estiver definido.
- [ ] Definir estados graduais: normal abaixo de 75%, atenção entre 75–89%, crítico a partir de 90%.
- [ ] Não bloquear importação por peso até existir regra oficial explícita.
- [ ] Validar manualmente zero, valores intermediários, limite e ausência de peso máximo.
- [ ] Commit sugerido: `feat: add inventory resource summary`

### Task 11: Finalizar interação móvel e acessibilidade

**Files:**
- Modify: `script.js`
- Modify: `index.html`
- Modify: `character-sheet.css`

- [ ] Implementar alternância de painéis móveis mantendo seleção, item pendente e posição candidata.
- [ ] Garantir alternativa por toque sem drag: selecionar item, escolher “Posicionar”, tocar célula e confirmar.
- [ ] Garantir ordem de foco coerente, Escape para cancelar, mensagens que não se sobrepõem e alvos de toque ≥44 px.
- [ ] Aplicar `prefers-reduced-motion` ao proxy, encaixe, retorno e vibração visual.
- [ ] Validar manualmente com teclado apenas e em 390×844; confirmar ausência de ações inacessíveis.
- [ ] Commit sugerido: `feat: finish responsive inventory interactions`

### Task 12: Limpeza e verificação final

**Files:**
- Modify: `index.html`
- Modify: `script.js`
- Modify: `character-sheet.css`
- Modify: `style.css` (somente se necessário)

- [ ] Remover marcação, seletores e funções antigas somente após confirmar que não têm consumidores.
- [ ] Confirmar que alterações não relacionadas já existentes no worktree foram preservadas.
- [ ] Executar validação manual do fluxo completo: abrir ficha, importar item, examinar, girar, arrastar, recusar colisão, colocar, mover, equipar, desequipar, descartar, salvar, exportar e reimportar.
- [ ] Conferir console sem erros e ausência de referências a IDs removidos.
- [ ] Conferir visualmente desktop, tablet e celular, com e sem redução de movimento.
- [ ] Registrar capturas de antes/depois para aprovação visual.
- [ ] Commit sugerido: `chore: finalize gamified inventory redesign`

## Critérios de aceite

- Importar um JSON nunca adiciona o item diretamente ao array persistido do inventário.
- O item recebido é visualmente independente e pode ser arrastado ou posicionado por alternativa acessível.
- O footprint mostrado antes do drop corresponde exatamente às células validadas pelo domínio.
- Colisão e limites nunca permitem commit inválido.
- Itens v1 e fichas existentes continuam abrindo sem perda de posição ou ID.
- Imagem é a informação visual dominante; fallback funciona sem quebrar a peça.
- Rotação altera imediatamente dimensões e preview e nunca corrompe a posição anterior.
- Armadura equipada sai da ocupação da mochila e só retorna quando existe posição válida.
- O grid permanece utilizável em 390 px sem reduzir as células abaixo do mínimo definido.
- Toda operação de ponteiro tem alternativa por teclado/toque e feedback textual.
- A estética final parece parte do universo do Grimório, não um dashboard administrativo.

## Decisões que não devem ser improvisadas durante a execução

- Capacidade máxima de peso: até o jogo definir a fórmula, usar `null` e exibir apenas peso atual.
- Bônus de armadura: mostrar dados do item, mas não alterar defesa automaticamente sem regra formal.
- Empilhamento: manter quantidade informacional; não fundir instâncias automaticamente.
- Slots futuros: preparar registro extensível, mas não criar mão/capacete/botas vazios nesta primeira entrega.
- Assets: usar arquivos locais otimizados; não depender de imagens remotas em runtime.

