# Inventário V3.1 Implementation Plan

> **For agentic workers:** Execute este plano no workspace atual, preservando o V3 não commitado. Não criar, modificar ou executar testes automatizados.

**Goal:** Separar semanticamente o item persistido na bancada, o item segurado e o alvo espacial da mochila, refinando as cartas sem reconstruir o controlador de targets.

**Architecture:** `personagem.inventarioStaging` continua sendo a única localização persistente da bancada. `inventoryDrag` controla apenas o gesto; `inventoryUIState.candidatePosition` passa a existir somente para movimento por teclado ou drag ativo sobre a mochila. Um único `clearBackpackPreview()` limpa candidato, validação visual, células e ghost.

**Tech Stack:** HTML, CSS e JavaScript existentes; sem bibliotecas novas e sem testes automatizados.

---

### Task 1: Estado neutro e preview

**Files:**
- Modify: `script.js`

- [ ] Remover o staging parado de `obterItemEmPosicionamento` e da interatividade automática do grid.
- [ ] Não criar candidato durante a importação ou rotação na bancada.
- [ ] Criar `clearBackpackPreview()` e usá-la em saída do alvo, cancelamento e encerramento.
- [ ] Tornar explícita a regra do ghost: apenas `phase === "dragging" && target === "backpack"`.
- [ ] Restaurar a mensagem neutra imediatamente quando o alvo mochila deixa de estar ativo.

### Task 2: Bancada e integridade

**Files:**
- Modify: `index.html`
- Modify: `script.js`
- Modify: `inventory.css`

- [ ] Manter capacidade unitária e bloquear drop em bancada ocupada sem swap.
- [ ] Integrar informação de compatibilidade e Girar 90° na própria bancada.
- [ ] Remover a ação redundante "Deixar na bancada" e reduzir a ênfase do descarte.
- [ ] Preservar commits atômicos e verificar IDs únicos entre as cinco regiões.

### Task 3: Cartas premium por contexto

**Files:**
- Modify: `script.js`
- Modify: `inventory.css`

- [ ] Separar as variantes `bench`, `spatial` e `equipment` com identidade visual compartilhada.
- [ ] Dar à carta da bancada presentation size próximo de 3:4, independente do footprint.
- [ ] Manter mochila e proxy no spatial footprint.
- [ ] Ajustar densidade: compacto só arte, médio arte/nome, grande metadados completos.
- [ ] Reutilizar tokens `--sheet-*` e evitar preto/cinza cru.

### Task 4: Verificação estática

**Files:**
- Verify: `script.js`, `inventory.css`, `index.html`

- [ ] Validar sintaxe JavaScript.
- [ ] Validar blocos CSS e `git diff --check`.
- [ ] Confirmar por inspeção que staging não cria candidato e que commits continuam atômicos.
- [ ] Não executar testes automatizados.
