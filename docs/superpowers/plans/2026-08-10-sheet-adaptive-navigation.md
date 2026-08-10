# Sheet Adaptive Navigation Implementation Plan

> **For agentic workers:** Execute no workspace atual para preservar as mudanças ainda não commitadas. Não criar ou executar testes; validar contratos por inspeção estática e revisão visual.

**Goal:** Substituir a navegação lateral instável da ficha por uma navegação adaptativa, semanticamente clara e sem mudanças de geometria no estado ativo.

**Architecture:** O HTML mantém os mesmos `data-sheet-section` consumidos por `ativarSecaoDaFicha`. Um módulo CSS isolado controla os três estados responsivos — sidebar expandida, rail compacta e barra mobile — enquanto `script.js` continua responsável apenas por navegação e mensagens.

**Tech Stack:** HTML semântico, CSS Grid/Flexbox, Cascade Layers e JavaScript DOM existente.

---

## Chunk 1: Contrato e estrutura

### Task 1: Reorganizar a marca e os grupos de navegação

**Files:**
- Modify: `index.html`

- [x] Preservar todos os `data-sheet-section` existentes.
- [x] Identificar visual e semanticamente seções disponíveis e futuras.
- [x] Adicionar rótulos curtos, tooltips e estrutura para o menu móvel.
- [x] Transformar o rodapé decorativo em estado útil da ficha.

### Task 2: Preservar comportamento e acessibilidade

**Files:**
- Modify: `script.js`

- [x] Preservar `ativarSecaoDaFicha` e `aria-current`.
- [x] Tratar seções futuras por identificadores individuais.
- [x] Manter mensagem de indisponibilidade sem alterar a seção ativa.

## Chunk 2: Layout adaptativo

### Task 3: Criar estilos isolados da navegação

**Files:**
- Create: `css/layouts/sheet-navigation.css`
- Modify: `css/app.css`

- [x] Desktop: sidebar estável entre 184 e 200 px.
- [x] Tablet: rail de ícones entre 72 e 78 px com rótulos acessíveis.
- [x] Mobile: barra inferior com três destinos ativos e botão Mais.
- [x] Permitir scroll apenas na lista de navegação.
- [x] Remover `clip-path` e mudanças de largura do item ativo.
- [x] Cobrir hover, active, focus-visible, current e indisponível.
- [x] Respeitar safe areas e `prefers-reduced-motion`.

## Chunk 3: Verificação

### Task 4: Auditar contratos sem testes

**Files:**
- Verify: `index.html`
- Verify: `script.js`
- Verify: `css/layouts/sheet-navigation.css`

- [x] Confirmar uma única navegação global.
- [x] Confirmar três seções disponíveis e quatro futuras.
- [x] Confirmar que itens futuros não alteram a seção ativa.
- [x] Confirmar breakpoints desktop, tablet e mobile.
- [x] Confirmar ordem do novo import CSS.
- [x] Executar `git diff --check`.
- [x] Não executar testes automatizados.
