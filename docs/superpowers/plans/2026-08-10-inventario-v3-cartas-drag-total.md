# Inventário V3 — Cartas e Drag Total Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transformar bancada, mochila e os três slots em origens e destinos do mesmo drag físico, com staging persistente, swaps seguros e cartas premium responsivas ao footprint.

**Architecture:** `inventory-domain.js` permanece a fonte exclusiva de footprint, rotação, colisão e disponibilidade. O controller passa a descobrir um único target em um registro ordenado; cada target avalia, fornece feedback e aplica seu plano a cópias imutáveis de mochila/equipamentos/bancada. A bancada será o campo aditivo e opcional `personagem.inventarioStaging` da ficha versão 2, e um renderer compartilhado produzirá cartas adaptadas a cada superfície.

**Tech Stack:** HTML semântico, CSS nativo, JavaScript vanilla, Pointer Events, Web Animations API já existente e `inventory-domain.js` sem alterações.

**Verification policy:** A SPEC proíbe criar, modificar ou executar testes automatizados. As verificações permitidas são leitura/revisão de código, parser de sintaxe, integridade textual do diff e revisão visual manual quando houver navegador integrado.

---

## Chunk 0: Auditoria obrigatória do estado atual

### Task 0: Registrar a implementação real antes de editar produção

**Files:**
- Read: `script.js`, `inventory.css`, `index.html`, `inventory-domain.js`, `character-sheet.css`.

- [ ] Mapear `inventoryDrag`, ciclo `pointerdown` → rAF → `pointerup`, snapshot atual e todos os cancelamentos.
- [ ] Registrar origens existentes (`bench`, `inventory`, três slots) e destinos atuais (mochila/três slots), incluindo evaluator, planner, commit e destino visual.
- [ ] Registrar todos os usos de `pendingPlacement`, importação/reveal, posicionamento por teclado, descarte e reset transitório.
- [ ] Registrar persistência, envelope v2, migração, ordem de normalização e reserva de IDs entre mochila/equipamentos.
- [ ] Registrar renderização atual de bancada, mochila, slots e proxy, além de rotação, footprint, ghost, imagem/fallback e conflitos relevantes da cascata legada.
- [ ] Confirmar que a auditoria descreve o código atual, sem editar produção nem executar testes.

## Chunk 1: Targets e staging

### Task 1: Corrigir primeiro a arquitetura de targets

**Files:**
- Modify: `script.js` — descoberta, avaliação, preview e commit dos targets físicos.
- Preserve: `inventory-domain.js`.

- [ ] **Step 1: Introduzir o registro ordenado sem mudar comportamento**

Criar descritores equivalentes para `backpack`, `bench`, `maoPrincipal`, `maoSecundaria` e `armadura`, cada um com `getElement`, `locate/hitTest`, `evaluate`, `preview` e `apply`. A primeira refatoração mantém ativos apenas os destinos já existentes, para separar arquitetura de funcionalidade.

- [ ] **Step 2: Fixar prioridade determinística**

Percorrer equipamento → bancada → mochila. Um frame produz exatamente um target; regiões não vencedoras limpam feedback.

- [ ] **Step 3: Manter cache e revalidação final**

Hit test roda por rAF; a validação pesada só roda quando target/célula/rotação muda. `pointerup` chama o descritor novamente sem cache.

- [ ] **Step 4: Centralizar mensagens e feedback**

Cada descritor fornece código, mensagem e classes de preview. `avaliarAlvoFisicoDoInventario` deixa de conhecer regras específicas de cada destino.

### Task 2: Adicionar a bancada como destino real e persistente

**Files:**
- Modify: `script.js` — modelo da ficha, normalização, importação, staging, bancada e target `bench`.
- Modify: `index.html` — textos e ações da bancada, sem alterar outras seções.

- [ ] **Step 1: Definir staging aditivo na ficha v2**

Adicionar `inventarioStaging: null` a `personagem`/`MODELO_PERSONAGEM`. Manter envelope `versao: 2`; o novo campo é opcional e fichas antigas migram para `null`. O loader não passa a aceitar versão 3.

- [ ] **Step 2: Normalizar em ordem estável**

Em `prepararDadosIniciaisDaFicha`, normalizar mochila primeiro, equipamentos depois e staging por último. A primeira ocorrência conserva ID; duplicidades posteriores recebem ID novo. Staging usa posição neutra `{ x: 0, y: 0 }` e rotação 0/90 preservada.

- [ ] **Step 3: Cobrir todos os caminhos de carga/salvamento**

Revisar `aplicarPersonagemImportado`, reset transitório, `criarEnvelopeDaFicha`, salvar sessão, exportar e reabrir ficha. Reset de UI nunca apaga staging persistente.

- [ ] **Step 4: Substituir `pendingPlacement` como fonte da bancada**

Criar `obterItemDaBancada()` e remover a peça de `inventoryUIState`; manter na UI apenas seleção, reorganização, candidato e descarte. IDs de novas importações reservam mochila, equipamentos e staging.

- [ ] **Step 5: Importar somente quando a bancada estiver vazia**

Após validar JSON, escrever o item diretamente em `personagem.inventarioStaging`, marcar a ficha alterada e abrir reveal. Nova importação com staging ocupado é bloqueada com “A bancada já possui um item.”

- [ ] **Step 6: Ativar target `bench`**

Própria bancada é no-op. Bancada vazia aceita mochila/equipamentos. Bancada ocupada por outro item retorna `bench-occupied` sem plano de mutação.

- [ ] **Step 7: Separar staging de cancelamento de importação**

Eliminar `limparItemPendenteDoInventario` como remoção silenciosa. “Descartar” staging abre confirmação; “Cancelar/Deixar na bancada” apenas encerra modo de posicionamento/foca a carta. Rotação persiste e marca a ficha. Reveal/equipar agora, reorganizar e posicionamento por teclado usam o staging/target universal.

- [ ] **Step 8: Incluir staging nos resumos corretos**

Peso e contagem de itens incluem staging uma única vez; células usadas continuam contando apenas a mochila.

### Task 3: Implementar mão principal ↔ mão secundária

**Files:**
- Modify: `script.js` — compatibilidade e planejamento dos targets de mão.

- [ ] **Step 1: Definir compatibilidade explícita**

`equipavelEm` explícito continua restritivo. Armadura aceita apenas armadura. Arma sem slot explícito aceita mão principal e secundária. Não criar regra de “Duas mãos”, pois o sistema atual não possui semântica para ela.

- [ ] **Step 2: Mover entre mãos vazias**

Origem equipada compatível pode ir diretamente ao outro slot sem tocar na mochila.

- [ ] **Step 3: Planejar swap direto entre mãos ocupadas**

Validar o carregado no destino e o ocupante no slot de origem. Se ambos aceitarem seus novos slots, produzir `equipment-swap`; caso contrário, bloquear antes do commit.

- [ ] **Step 4: Manter mesmo slot como no-op**

Soltar sobre a própria origem não marca alteração e anima retorno/assentamento sem trocar referências.

### Task 4: Garantir equipamento ↔ mochila

**Files:**
- Modify: `script.js` — target `backpack`, target de slot e ações acessíveis existentes.

- [ ] **Step 1: Preservar equipamento → mochila**

Usar `inventory-domain.js` para posição/ghost; item só sai do slot quando o destino final é válido.

- [ ] **Step 2: Preservar mochila → slot vazio**

Remover o item do array apenas no commit publicado.

- [ ] **Step 3: Planejar mochila → slot ocupado**

Calcular posição para o ocupante usando a mochila sem o item carregado. Sem espaço, bloquear sem mutação; com espaço, guardar o ocupante e equipar o carregado no mesmo plano.

- [ ] **Step 4: Refatorar fallbacks de clique/teclado**

`equiparItemNoSlot` e `desequiparItemDoSlot` deixam de mutar objetos compartilhados e chamam o mesmo planner/commit usado pelo pointer.

### Task 5: Garantir qualquer origem → bancada

**Files:**
- Modify: `script.js` — target `bench`, destino visual e ações acessíveis.
- Modify: `index.html` — ação acessível “Mover para bancada” quando necessária.

- [ ] **Step 1: Cobrir mochila e três slots → bancada vazia**

O target remove do local de origem somente na publicação e conserva rotação/ID.

- [ ] **Step 2: Bloquear bancada ocupada**

`armor → occupied bench` e qualquer outra origem retornam “A bancada já possui um item.” sem sobrescrever ou procurar mochila.

- [ ] **Step 3: Implementar bench → slot ocupado**

Como a própria bancada será liberada, mover o antigo ocupante para staging e equipar o item carregado em um único plano, se compatível.

- [ ] **Step 4: Oferecer equivalência por teclado**

Adicionar ações focáveis ou seletor de destino que liste todos os targets compatíveis e use exatamente o mesmo `evaluate`/planner/commit do pointer: bancada/mochila → mão principal, mão secundária ou armadura escolhida; mochila → bancada; e equipamento → bancada, mochila ou outro slot compatível. Restaurar foco ao destino após commit e à origem após recusa; anunciar resultado em `aria-live`.

## Chunk 2: Atomicidade e cancelamento

### Task 6: Garantir atomicidade e retorno universal

**Files:**
- Modify: `script.js` — sessão, rascunho, publicação e cancelamentos.

- [ ] **Step 1: Registrar snapshot lógico da origem**

No `pointerdown`, congelar ID, kind, slot/posição, rotação e referência somente leitura do item. O snapshot serve para validar coerência e retorno, nunca para mutar durante o gesto.

- [ ] **Step 2: Criar rascunho sem referências mutáveis compartilhadas**

Copiar containers e clonar toda instância que receber nova `posicao`/`rotacao`. Nenhum código altera item persistente antes da publicação.

- [ ] **Step 3: Extrair origem e aplicar target apenas no rascunho**

Qualquer ID/ocupação divergente aborta. Depois da primeira alteração no rascunho, nenhuma guarda pode tocar em `personagem`.

- [ ] **Step 4: Publicar uma única vez**

Atribuir mochila, equipamentos e staging juntos; atualizar UI, marcar dirty e renderizar uma vez. Commit recusado deixa todos os objetos originais intactos.

- [ ] **Step 5: Centralizar cancelamento**

Escape, `pointercancel`, blur, perda de captura, página oculta e fechamento/navegação da ficha chamam o mesmo recoil não mutante. `R` continua girando apenas estado transitório.

- [ ] **Step 6: Fixar matriz funcional esperada**

| Origem | Destino | Resultado |
|---|---|---|
| bancada | mochila | move se footprint válido |
| mão principal/secundária/armadura | mochila | move se footprint válido |
| mochila | mochila | reposiciona/rotaciona |
| mochila | bancada vazia | move |
| qualquer equipamento | bancada vazia | move |
| qualquer origem externa | bancada ocupada | bloqueia |
| bancada/mochila | slot compatível vazio | move |
| bancada | slot compatível ocupado | swap com staging |
| mochila | slot compatível ocupado | ocupante volta à mochila se couber |
| mão principal | mão secundária vazia | move se compatível |
| mão secundária | mão principal vazia | move se compatível |
| mão principal | mão secundária ocupada | swap se ambos compatíveis |
| mão secundária | mão principal ocupada | swap se ambos compatíveis |
| mesmo destino | própria origem | no-op |
| incompatível/mochila cheia/drop externo | qualquer | recoil sem mutação |

## Chunk 3: Cartas por superfície, na ordem da SPEC

### Task 7: Criar a carta-base responsiva

**Files:**
- Modify: `script.js` — `criarCartaDoItem` e helpers de formato/densidade.
- Modify: `inventory.css` — componente BEM isolado.

- [ ] **Step 1: Classificar formato pelas dimensões efetivas**

Usar `tall` para ratio ≤ .45, `portrait` até .85, `square` até 1.2, `landscape` abaixo de 2.2 e `wide` acima disso. Rotação recalcula a classe, não gira uma moldura de debug.

- [ ] **Step 2: Classificar densidade concretamente**

1×1: `compact` (arte, quantidade, acento). 1×2/2×2 e área 2–4: `small` (arte e nome se couber). Área maior: `rich` (arte, nome e atributo pequeno).

- [ ] **Step 3: Criar DOM compartilhado não interativo**

Moldura, ornamento, header raridade/tipo, `.inventory-item-art`, nome, atributo e metadados. O host externo continua sendo o botão/div apropriado; não criar botões aninhados.

- [ ] **Step 4: Isolar cascata legada**

Usar classes `.inventory-card*` e resets explícitos para neutralizar `.sheet-inventory-item span` e `.sheet-inventory-item__art !important`, inclusive no proxy/reveal fora de `.inventory-shell`.

- [ ] **Step 5: Aplicar o design system oficial**

Usar apenas `--sheet-paper*`, `--sheet-ink*`, `--sheet-gold*`, `--sheet-wine*` e `--sheet-border` na carta. Raridade altera fio, selo/ornamento e halo discreto; nunca tema neon.

### Task 8: Aplicar carta à bancada

**Files:**
- Modify: `script.js`, `inventory.css`, `index.html`.

- [ ] Renderizar variante rica dentro da zona de grab, com arte, raridade/tipo, nome, peso, dimensão e orientação; renomear a região para staging geral e manter a superfície inteira como target com estados “Soltar na bancada”/ocupada.

### Task 9: Aplicar carta aos equipamentos

**Files:**
- Modify: `script.js`, `inventory.css`.

- [ ] Renderizar variante compacta compartilhada, tornar a arte realmente `grab`/`touch-action: none`, manter ações por teclado e redesenhar slot vazio como linha/ornamento discreto em papel.

### Task 10: Aplicar carta à mochila

**Files:**
- Modify: `script.js`, `inventory.css`.

- [ ] Manter host exatamente no bounding box do footprint. Usar densidade 1×1/pequena/rica, preservar quantidade/seleção e impedir vazamento textual ilegível.

### Task 11: Aplicar carta ao proxy

**Files:**
- Modify: `script.js`, `inventory.css`.

- [ ] Usar carta física reduzida com arte, acento de raridade e nome curto. Refinar label como pequeno selo do Grimório em duas linhas: nome e `largura × altura · rotação`. O proxy continua separado do ghost e acompanha o footprint real.

### Task 12: Polir fallback, raridade e microinterações

**Files:**
- Modify: `script.js`, `inventory.css`.

- [ ] Mostrar fallback somente sem imagem/erro, dentro do campo de arte com símbolo vinho/dourado e tipo “sem arte”; texto repetido fica `aria-hidden`.
- [ ] Preservar `object-fit: contain`, escala/orientação correta e marcador discreto de erro.
- [ ] Refinar grab, rotação, snap e return nos tempos da SPEC; sob reduced motion remover tilt/partículas/transições mantendo funcionalidade.
- [ ] Garantir foco visível, `aria-live`, nomes completos e feedback que não dependa somente de cor.

## Chunk 4: Verificação manual e handoff

### Task 13: Revisar integração final sem testes automatizados

**Files:**
- Review: `index.html`, `script.js`, `inventory.css`, `inventory-domain.js`.

- [ ] **Step 1: Validar sintaxe JavaScript**

Executar parser equivalente a `node --check script.js` e exigir saída sem `SyntaxError`. Se o executável `node` não existir, usar `node:vm.Script` no runtime disponível; isso valida sintaxe sem executar a aplicação.

- [ ] **Step 2: Validar integridade textual**

Executar `git diff --check`, conferir IDs do DOM, balanceamento CSS, inexistência de referências a `pendingPlacement` e confirmar `inventory-domain.js` sem alterações.

- [ ] **Step 3: Auditar persistência manualmente**

Conferir por leitura/save manual staging ocupado em salvar sessão, fechar/reabrir, exportar/reimportar; fichas antigas sem staging; IDs duplicados; rotação persistida e descarte confirmado.

- [ ] **Step 4: Percorrer toda a matriz funcional**

Verificar bancada ocupada, mão↔mão vazia/ocupada, swaps com e sem espaço, equipamento↔mochila, todas as origens→bancada, no-op, incompatibilidade, mochila cheia, rotação e cancelamentos por Escape/pointercancel/blur/lost capture/fechamento.

- [ ] **Step 5: Tentar revisão visual manual no navegador**

Se houver navegador integrado, conferir desktop/mobile, formatos 1×1/1×4/2×3/4×2/6×2, imagem/fallback, cartas nas quatro superfícies, targets e recoil. Se indisponível, registrar a limitação sem substituir por E2E.

- [ ] **Step 6: Executar revisão final independente**

Solicitar primeiro conformidade com a SPEC e depois qualidade, ambas sem edição nem testes; corrigir críticos/importantes e repetir até aprovação.
