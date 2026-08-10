# Reconstrução Física do Inventário do Meridian — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reconstruir a experiência visual e física do inventário para que o jogador receba, segure, arraste e encaixe a imagem do objeto com continuidade visual, preservando integralmente o domínio espacial e a compatibilidade das fichas.

**Architecture:** `inventory-domain.js` permanece imutável como fonte das regras 6 × 5, footprint, colisão, rotação e migração. A interface passa a ter reveal, bancada, mochila, equipamentos expansíveis e um único controlador físico transitório com drag layer global, grab ratio e pipeline único por `requestAnimationFrame`. Estado persistente (`personagem.inventario/equipamentos`), gameplay (`pendingPlacement/selectedItemId`) e gesto (`inventoryDrag`) permanecem separados.

**Tech Stack:** HTML sem framework, CSS responsivo, JavaScript DOM, Pointer Events, Web Animations API e domínio existente.

---

## Chunk 1: Estrutura visual e estados

### Task 1: Reconstruir a superfície do inventário

**Files:**
- Modify: `index.html`
- Modify: `character-sheet.css`

- [ ] Substituir o layout escuro por shell claro, bancada, mochila material, três slots de equipamento e painel de detalhes.
- [ ] Adicionar o dialog cinematográfico de item recebido e o `#inventory-drag-layer` diretamente no `body`.
- [ ] Tornar bancada e mochila simultâneas no mobile e manter ações acessíveis por teclado.
- [ ] Respeitar `prefers-reduced-motion` e limitar `touch-action: none` às artes arrastáveis.

### Task 2: Separar estado persistente, gameplay e físico

**Files:**
- Modify: `script.js`

- [ ] Expandir `equipamentos` com `armadura`, `maoPrincipal` e `maoSecundaria`, mantendo defaults para fichas antigas.
- [ ] Remover `pointerSession` do estado de gameplay e criar `inventoryDrag` transitório com fases explícitas.
- [ ] Preservar `pendingPlacement`, seleção, importação/exportação e marcação de ficha alterada.

## Chunk 2: Continuidade e manipulação física

### Task 3: Implementar reveal e viagem até a bancada

**Files:**
- Modify: `script.js`

- [ ] Abrir reveal após validação do JSON com arte, nome, raridade, atributo e ação de equipar quando aplicável.
- [ ] Animar a mesma arte do reveal até a arte da bancada com Web Animations API.
- [ ] Manter o item pendente na bancada quando não houver espaço.

### Task 4: Substituir o drag antigo pelo controlador físico único

**Files:**
- Modify: `script.js`

- [ ] Iniciar o grab no `pointerdown`, capturar o ponto normalizado na arte e criar proxy somente com a arte.
- [ ] Atualizar proxy, morph, hit test, célula candidata e footprint em um único frame agendado.
- [ ] Recalcular o candidato no `pointerup`, fazer commit e encaixe no válido, ou recoil ao retângulo da arte no inválido.
- [ ] Usar o mesmo controlador para bancada e itens já guardados, preservando click para seleção e teclado para posicionamento.

### Task 5: Generalizar equipamento com troca segura

**Files:**
- Modify: `script.js`

- [ ] Renderizar slots de armadura, mão principal e mão secundária.
- [ ] Equipar da mochila ou diretamente do reveal.
- [ ] Antes de trocar slot ocupado, validar espaço para devolver o item anterior e nunca perder itens.

## Chunk 3: Revisão estática

### Task 6: Confirmar integridade sem testes

**Files:**
- Inspect: `index.html`
- Inspect: `character-sheet.css`
- Inspect: `script.js`
- Inspect: `inventory-domain.js`

- [ ] Confirmar que `inventory-domain.js` não foi alterado.
- [ ] Confirmar que existe apenas um controlador de drag físico e nenhum `pointerSession` remanescente.
- [ ] Conferir seletores, IDs, listeners e sintaxe sem criar ou executar testes.
- [ ] Revisar o diff para garantir que nenhuma área fora do inventário foi modificada.
