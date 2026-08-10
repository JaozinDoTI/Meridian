# Inventory Weight, Fit and Resistance Motion Implementation Plan

> **For agentic workers:** Execute no workspace atual para preservar o Inventário V3 não commitado. Não criar nem executar testes automatizados; validar por critérios estáticos e inspeção dos estados implementados.

**Goal:** Transformar a motion do inventário em uma linguagem consistente de peso, encaixe e resistência, mantendo interações comuns abaixo de 260ms e preservando todas as regras persistentes.

**Architecture:** Tokens e estados CSS ativos ficam centralizados em `css/motion/inventory.css`; viagens, FLIP e feedback imperativo ficam em `js/motion/inventory-motion.js`. `script.js` apenas fornece geometria e orquestra os estados, sem mover regras do domínio ou alterar o commit atômico dos targets.

**Tech Stack:** CSS Cascade Layers, Web Animations API, FLIP, requestAnimationFrame e JavaScript clássico.

---

## Chunk 1: Vocabulário e estados visuais

### Task 1: Consolidar tokens e CSS de motion

**Files:**
- Modify: `css/tokens.css`
- Create: `css/motion/inventory.css`
- Modify: `css/app.css`
- Modify: `inventory.css`
- Modify: `motion.css`

- [x] Adicionar tokens instant, fast, medium e ceremonial, mais easings lift, settle e return.
- [x] Manter a origem como silhueta em `opacity: .12`.
- [x] Implementar lift, sombra por velocidade, atração da mochila e targets com transições curtas.
- [x] Implementar entrada escalonada das células e impacto inválido único.
- [x] Remover pulsos infinitos e seletores do proxy legado.
- [x] Reduzir o reveal comum e reservar partículas para raridades altas.
- [x] Preservar feedback de validade e fade curto em reduced motion.

## Chunk 2: Orquestração imperativa

### Task 2: Expandir o módulo de motion

**Files:**
- Modify: `js/motion/inventory-motion.js`

- [x] Centralizar todas as durações e curvas do inventário.
- [x] Animar viagens com transform/scale, sem interpolar width e height.
- [x] Adicionar grab, rotação, settle, rejeição e FLIP coordenado.
- [x] Cancelar animações anteriores antes de iniciar outra.
- [x] Produzir fade de 70ms em reduced motion.

### Task 3: Integrar estados ao drag

**Files:**
- Modify: `js/state/ui-state.js`
- Modify: `script.js`

- [x] Reduzir tilt máximo para 3° e aplicar amortecimento/sombra por velocidade.
- [x] Limpar preview imediatamente ao sair da mochila.
- [x] Suspender preview durante rotação e recalcular somente ao final.
- [x] Aplicar sequência de compressão e assentamento no drop válido.
- [x] Aplicar recuo, retorno e shake único no drop inválido.
- [x] Aplicar FLIP ao item deslocado em trocas diretas entre mãos.
- [x] Manter o commit de dados atômico e independente da animação.

## Chunk 3: Reveal e verificação

### Task 4: Hierarquizar o reveal

**Files:**
- Modify: `script.js`
- Modify: `css/motion/inventory.css`

- [x] Marcar reveal comum como compacto e raridades alta como cerimonial.
- [x] Reduzir viagem do reveal até a bancada para a duração medium.
- [x] Fazer o conteúdo textual da bancada aparecer após o encaixe.

### Task 5: Verificar integração sem testes

**Files:**
- Verify: `css/**/*.css`
- Verify: `js/**/*.js`
- Verify: `script.js`

- [x] Confirmar inexistência de animações infinitas inválidas e seletores mortos.
- [x] Confirmar que viagens não interpolam width/height.
- [x] Confirmar tokens e helpers consumidos.
- [x] Validar delimitadores e referências estáticas.
- [x] Executar `git diff --check`.
- [x] Não executar testes automatizados.
