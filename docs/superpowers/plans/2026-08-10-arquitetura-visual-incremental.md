# Arquitetura Visual Incremental Implementation Plan

> **For agentic workers:** Execute no workspace atual para preservar o Inventário V3 ainda não commitado. Não criar, modificar ou executar testes automatizados.

**Goal:** Criar a fundação do design system e separar responsabilidades visuais reais sem alterar domínio, schemas, persistência ou fluxos existentes.

**Architecture:** Um único `css/app.css` controla a ordem da cascata com layers e importa os estilos legados sem reescrevê-los. Novos tokens e primitivas são introduzidos por aliases para permitir migração progressiva. No JavaScript, estado transitório, renderer de carta e execução de motion do inventário saem do monólito por APIs globais pequenas e explícitas, mantendo o carregamento clássico atual.

**Tech Stack:** HTML, CSS Cascade Layers, JavaScript clássico, DOM e Web Animations API; sem framework e sem dependências novas.

---

## Chunk 1: Fundação CSS e contratos

### Task 1: Documentar os contratos

**Files:**
- Create: `docs/architecture.md`
- Create: `docs/design-system.md`

- [x] Registrar a direção das dependências `domain -> state -> ui -> motion/app`.
- [x] Definir tokens canônicos, aliases legados, cascade layers, temas e critérios de migração.
- [x] Proibir alterações funcionais durante migrações visuais.

### Task 2: Criar o entrypoint CSS

**Files:**
- Create: `css/app.css`
- Create: `css/tokens.css`
- Create: `css/foundations.css`
- Create: `css/components.css`
- Create: `css/layouts.css`
- Create: `css/themes.css`
- Create: `css/motion/primitives.css`
- Modify: `index.html`

- [x] Importar os quatro estilos existentes em um layer legado que preserve a ordem atual.
- [x] Adicionar layers canônicos depois do legado sem sobrescrever componentes ainda não migrados.
- [x] Criar tokens por aliases para `--papel`, `--sheet-*` e motion existentes.
- [x] Criar primitivas `ui-*`, roles tipográficas e layouts sem acoplar features.
- [x] Trocar os quatro links CSS por `css/app.css`.

## Chunk 2: Extrações JavaScript seguras

### Task 3: Extrair estado transitório

**Files:**
- Create: `js/state/ui-state.js`
- Modify: `index.html`
- Modify: `script.js`

- [x] Expor factories para estado da UI e sessão física do inventário.
- [x] Inicializar os mesmos campos e valores atualmente usados.
- [x] Reutilizar a factory ao limpar a sessão de drag.

### Task 4: Extrair renderer da carta

**Files:**
- Create: `js/ui/inventory-card.js`
- Modify: `index.html`
- Modify: `script.js`

- [x] Mover somente a construção DOM da carta.
- [x] Receber visual, formato e callbacks como dependências explícitas.
- [x] Preservar classes, datasets, densidade e conteúdo atuais.

### Task 5: Extrair motion do inventário

**Files:**
- Create: `js/motion/inventory-motion.js`
- Modify: `index.html`
- Modify: `script.js`

- [x] Centralizar threshold, durações e easing.
- [x] Encapsular a chamada Web Animations usada nas viagens de drop/retorno.
- [x] Preservar reduced motion e os tempos atuais.

## Chunk 3: Verificação estática

### Task 6: Verificar a integração

**Files:**
- Verify: `index.html`
- Verify: `script.js`
- Verify: `css/**/*.css`
- Verify: `js/**/*.js`

- [x] Validar estaticamente os JavaScript criados e suas referências.
- [x] Validar equilíbrio de blocos CSS e ordem dos imports/layers.
- [x] Confirmar que todos os scripts aparecem antes de `script.js`.
- [x] Executar `git diff --check`.
- [x] Não executar testes automatizados.
