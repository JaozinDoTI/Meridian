# Premium Spatial Inventory Implementation Plan

> **For agentic workers:** Execute incrementally in the current worktree. Automated tests are explicitly out of scope for this change.

**Goal:** Transformar a apresentação do inventário espacial em uma mesa de preparação premium, preservando domínio, grid, colisão, rotação, Pointer Events e transações existentes.

**Architecture:** `personagem` e `GrimorioInventoryDomain` permanecem como fontes de verdade. A mudança estende apenas estado transitório, renderização, eventos, DOM e CSS do inventário; o motor espacial não será substituído.

**Tech Stack:** HTML, CSS e JavaScript nativos existentes.

---

### Task 1: Reorganizar a composição visual

**Files:**
- Modify: `index.html`
- Modify: `css/features/inventory.css`

- [ ] Renomear staging para Recebimento e ajustar a linguagem para o jogador.
- [ ] Aplicar proporções 16/58/26 e tornar mochila, equipamento e inspector hierarquicamente claros.
- [ ] Preservar o contrato de altura e scroll interno já corrigido.

### Task 2: Formalizar cards por footprint

**Files:**
- Modify: `js/ui/inventory-view.js`
- Modify: `js/ui/inventory-card.js`
- Modify: `css/features/inventory.css`

- [ ] Introduzir densidades compact, slim, small e full usando as dimensões atuais.
- [ ] Remover textos secundários de footprints pequenos sem esconder arte, quantidade ou nome necessário.

### Task 3: Unificar seleção e inspeção

**Files:**
- Modify: `js/state/ui-state.js`
- Modify: `js/controllers/inventory-controller.js`
- Modify: `js/ui/dom-bindings.js`
- Modify: `js/app.js`
- Modify: `index.html`

- [ ] Representar origem da seleção sem duplicar dados persistentes.
- [ ] Permitir seleção de mochila, Recebimento e equipamento.
- [ ] Exibir somente ações válidas e tornar desequipar uma ação explícita.
- [ ] Oferecer escolha de mão quando houver duas opções reais.

### Task 4: Melhorar feedback espacial

**Files:**
- Modify: `js/controllers/inventory-controller.js`
- Modify: `css/features/inventory.css`
- Modify: `css/motion/inventory.css`

- [ ] Mostrar footprint, rotação e atalho de giro no proxy.
- [ ] Diferenciar encaixe, colisão e limite, informando o item bloqueador quando disponível.
- [ ] Evidenciar slots compatíveis, incompatíveis e destino de trocas.

### Task 5: Evoluir Recebimento e equipamentos

**Files:**
- Modify: `js/controllers/inventory-controller.js`
- Modify: `css/features/inventory.css`
- Modify: `index.html`

- [ ] Mostrar previsão de encaixe usando o domínio existente.
- [ ] Compor armadura e mãos espacialmente.
- [ ] Manter bancada de uma peça e transferências atômicas.

### Task 6: Touch e responsividade

**Files:**
- Modify: `index.html`
- Modify: `js/controllers/inventory-controller.js`
- Modify: `js/ui/dom-bindings.js`
- Modify: `js/app.js`
- Modify: `css/features/inventory.css`

- [ ] Expor modo Posicionar com Girar, Confirmar e Cancelar.
- [ ] Adaptar layout para notebook, tablet e mobile sem remover drag ou teclado.

### Task 7: Verificação sem testes automatizados

- [ ] Executar `git diff --check`.
- [ ] Revisar seletores, IDs, bindings e chamadas alteradas.
- [ ] Confirmar que nenhum arquivo de teste foi criado, alterado ou executado nesta implementação.
- [ ] Registrar limitações de verificação visual se o navegador integrado permanecer indisponível.

---

## Corrective pass: vertical footprint and reveal hierarchy

**Goal:** Corrigir a apresentação de peças estreitas e separar claramente descoberta no reveal de gerenciamento no Recebimento, sem alterar domínio ou fluxo persistente.

**Architecture:** A variante visual será derivada dos atributos `data-shape` e `data-density` já existentes. O reveal continuará usando o mesmo markup e handlers, com mudanças mínimas de texto e CSS; o Recebimento permanece como etapa de gerenciamento.

### Task 8: Peça vertical estreita

**Files:**
- Modify: `css/features/inventory.css`

- [ ] Remover atributo principal e metadados da variante `tall/small`.
- [ ] Reservar o footprint para arte e nome, sem posicionamento absoluto concorrente.
- [ ] Preservar as variantes compact, slim, wide e full.

### Task 9: Reveal de descoberta

**Files:**
- Modify: `index.html`
- Modify: `css/features/inventory.css`

- [ ] Manter o reveal curto, cerimonial e com poucos níveis de informação.
- [ ] Usar ações explícitas: equipar quando houver destino único e continuar para o Recebimento.
- [ ] Não duplicar previsão de encaixe nem funções de gerenciamento do Recebimento.

### Task 10: Verificação estática

- [ ] Executar `git diff --check` apenas nos arquivos relacionados.
- [ ] Confirmar que `js/domain/inventory.js` e testes permanecem intocados por esta correção.
