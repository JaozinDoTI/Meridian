# Abilities Premium Management Redesign Implementation Plan

> **For agentic workers:** Execute no workspace atual para preservar Inventário V3 e a fundação visual ainda não commitados. Não criar nem executar testes automatizados; validar contratos por inspeção estática.

**Goal:** Substituir a tabela de habilidades por uma experiência premium master/detail, preservando integralmente schema, filtros, importação, seleção, contadores, remoção, estatísticas e persistência.

**Architecture:** `personagem.habilidades` continua como única fonte de verdade. `script.js` mantém domínio e eventos, enquanto `js/ui/abilities-view.js` constrói cards e primitivas do detalhe; estilos ativos ficam isolados em `css/features/abilities.css` e `css/motion/abilities.css`.

**Tech Stack:** HTML semântico, CSS Grid/Flexbox, Cascade Layers, JavaScript clássico, DOM e Web Animations/CSS animations reduzidas.

---

## Chunk 1: Estrutura e renderer

### Task 1: Reestruturar a página

**Files:**
- Modify: `index.html`

- [x] Criar header real com título, descrição, busca, situação, tipo mobile e importação.
- [x] Criar sidebar com contador, segmented control e lista rolável.
- [x] Preservar todos os IDs consumidos pelo JavaScript.
- [x] Remover tabela e roles tabulares.
- [x] Criar detalhe expansível e ledger inferior estável.

### Task 2: Isolar primitivas de renderização

**Files:**
- Create: `js/ui/abilities-view.js`
- Modify: `index.html`
- Modify: `script.js`

- [x] Criar card de reconhecimento rápido sem duplicar detalhe.
- [x] Criar header, célula mecânica, seção textual, empty state e item do ledger.
- [x] Receber ícones, labels e dados derivados como dependências explícitas.
- [x] Não armazenar cópias das habilidades no módulo.

## Chunk 2: Renderização e contratos

### Task 3: Migrar lista e seleção

**Files:**
- Modify: `script.js`

- [x] Manter busca, filtros e ordem original.
- [x] Sincronizar tabs desktop e select mobile com `filtroTipoHabilidade`.
- [x] Manter seleção atual quando visível e selecionar o primeiro resultado quando necessário.
- [x] Ocultar detalhe quando não houver resultado sem limpar a seleção global.
- [x] Implementar empty states de coleção vazia e filtro vazio.

### Task 4: Migrar detalhe

**Files:**
- Modify: `script.js`

- [x] Renderizar identidade, tipo, ação, atributo, situação e menu existente.
- [x] Criar faixa mecânica única para custos, alcance, dano e duração.
- [x] Preservar controles de usos e recarga com limites existentes.
- [x] Exibir recuperação como texto quando presente.
- [x] Renderizar descrição, efeitos, requisitos, limitações e observações sem alterar dados.
- [x] Não criar ativação, uso ou consumo de recursos.

### Task 5: Migrar estatísticas

**Files:**
- Modify: `script.js`

- [x] Preservar os cinco cálculos sobre `personagem.habilidades` completo.
- [x] Renderizar como ledger contínuo, sem cards aninhados grandes.

## Chunk 3: Design e motion

### Task 6: Criar os estilos da feature

**Files:**
- Create: `css/features/abilities.css`
- Modify: `css/app.css`

- [x] Criar proporção master/detail de aproximadamente 30/70.
- [x] Diferenciar tipo, situação e seleção por canais visuais independentes.
- [x] Manter header e ledger estáveis com scroll interno da lista/detalhe.
- [x] Implementar responsividade desktop, tablet e mobile sem alturas rígidas.
- [x] Cobrir hover, focus-visible, active, disabled e selected.

### Task 7: Criar motion discreta

**Files:**
- Create: `css/motion/abilities.css`
- Modify: `css/app.css`

- [x] Animar seleção, entrada do detalhe e feedback de filtros em até 180ms.
- [x] Evitar pulsos, parallax e movimentos contínuos.
- [x] Respeitar `prefers-reduced-motion`.

## Chunk 4: Verificação

### Task 8: Auditar os contratos sem testes

**Files:**
- Verify: `index.html`
- Verify: `script.js`
- Verify: `js/ui/abilities-view.js`
- Verify: `css/features/abilities.css`
- Verify: `css/motion/abilities.css`

- [x] Confirmar IDs, eventos e actions existentes.
- [x] Confirmar ausência de segundo estado de habilidades.
- [x] Confirmar ausência de botão usar/ativar/conjurar.
- [x] Confirmar estatísticas sobre a coleção completa.
- [x] Validar ordem de scripts, imports e delimitadores.
- [x] Executar `git diff --check`.
- [x] Não executar testes automatizados.
