# Meridian Design System Consolidation Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Consolidar a linguagem visual do Meridian sobre os tokens e foundations existentes, padronizando tipografia, controles, espaçamento, radius, ícones e estados sem redesenhar a aplicação.

**Architecture:** `css/tokens.css` permanece como autoridade única para valores semânticos; `css/foundations.css` define herança, tipografia e estados globais seguros; `css/components.css` expõe primitives reutilizáveis; features e layouts consomem esses contratos e mantêm apenas exceções estruturais justificadas. Uma auditoria automatizada impede que controles canônicos retornem a valores arbitrários.

**Tech Stack:** HTML semântico, CSS Cascade Layers e custom properties, JavaScript sem framework, Node test runner, Playwright.

---

## Chunk 1: Contrato e fundação

### Task 1: Registrar auditoria e contrato automatizado

**Files:**
- Create: `tests/domain/design-system-contract.test.js`
- Create: `tools/audit-design-system.mjs`
- Modify: `package.json`

- [ ] Escrever teste que exija tokens semânticos de tipografia, controles, ícones, estados e cores.
- [ ] Escrever teste que exija consumo dos tokens por `.ui-button`, `.sheet-primary-action`, inputs/selects de Habilidades e controles do Registro.
- [ ] Executar `node --test --test-isolation=none tests/domain/design-system-contract.test.js` e confirmar falha por tokens ausentes.
- [ ] Implementar auditoria que reporte valores literais de `font-size`, alturas de controles e `border-radius`, separando ocorrências permitidas de violações canônicas.
- [ ] Adicionar `check:design-system` ao `package.json` e ao pipeline `npm test`.
- [ ] Reexecutar o teste focado; esperar sucesso somente após as Tasks 2 e 3.

### Task 2: Evoluir tokens existentes

**Files:**
- Modify: `css/tokens.css`
- Modify: `css/themes.css`

- [ ] Definir pesos e line-heights semânticos.
- [ ] Consolidar escala tipográfica para display, page title, section title, heading, body grande, body, control, label, caption e KPI.
- [ ] Definir alturas compacta, pequena, padrão e touch; padding horizontal; gap; radius; borda e tipografia de controle.
- [ ] Definir tamanhos de ícone `xs/sm/md/lg` e estados hover, pressed, selected e disabled derivados das cores semânticas.
- [ ] Preservar aliases portugueses e variáveis `--sheet-*` como compatibilidade temática, sem duplicar valores canônicos.

### Task 3: Fortalecer foundations e primitives reutilizáveis

**Files:**
- Modify: `css/foundations.css`
- Modify: `css/components.css`

- [ ] Fazer `select` herdar tipografia e normalizar disabled/focus sem afetar cards interativos.
- [ ] Atualizar classes tipográficas `.ui-*` para consumir peso e line-height semânticos.
- [ ] Consolidar `.ui-button` e variantes primary, secondary, ghost, danger, compact e icon-only.
- [ ] Criar primitive `.ui-field-control`/`.ui-select` aplicável a inputs, textareas e selects novos.
- [ ] Migrar `.sheet-primary-action`, chips, badges e status para tokens.
- [ ] Rodar o teste de contrato e a auditoria em verde.

## Chunk 2: Migração das interfaces

### Task 4: Migrar controles de ficha e navegação

**Files:**
- Modify: `css/components/sheet-chrome.css`
- Modify: `css/layouts/sheet-navigation.css`
- Modify: `css/features/sheet-summary.css`

- [ ] Migrar ações de documento e footer para tiers canônicos.
- [ ] Preservar navegação como exceção estrutural, mas consumir tipografia, radius, ícones e estados canônicos.
- [ ] Migrar controles numéricos do Resumo para tamanho compacto e estados comuns.
- [ ] Cobrir por Playwright alturas, foco, disabled e selected.

### Task 5: Migrar fluxos de criação e conteúdo

**Files:**
- Modify: `css/features/character-creation.css`
- Modify: `css/features/abilities.css`
- Modify: `css/features/history.css`
- Modify: `css/features/inventory.css`
- Modify: `css/features/journal.css`
- Test: `tests/e2e/design-system.spec.js`

- [ ] Escrever E2E que compare botão/select/input de mesma categoria via estilos computados.
- [ ] Executar o E2E e observar falha nas alturas/fontes/radius atuais.
- [ ] Migrar botões principais, secundários, ghost e icon-only sem alterar seus eventos.
- [ ] Migrar busca, selects, inputs, filtros e dialogs para os tokens de controle.
- [ ] Migrar tabs, menus e steppers para o tier compacto somente quando a densidade justificar.
- [ ] Uniformizar hover, focus-visible, active, disabled e selected com tokens de estado.
- [ ] Reexecutar E2E e regressões funcionais.

## Chunk 3: Evidência e documentação

### Task 6: Revisar visualmente sem absorver regressões antigas

**Files:**
- Create: `tests/visual/design-system.spec.js`
- Create: `tests/visual/design-system.spec.js-snapshots/*`

- [ ] Capturar criação, Habilidades, Inventário e Registro em desktop e mobile.
- [ ] Inspecionar alinhamento vertical, selects, hierarquia de botões, foco e overflow.
- [ ] Ajustar somente inconsistências ligadas ao design system.
- [ ] Preservar snapshots antigos e validar o conjunto novo sem update.

### Task 7: Documentar decisões e exceções

**Files:**
- Create: `docs/design-system.md`
- Create: `docs/quality/design-system-audit-2026-08-17.md`
- Modify: `docs/architecture.md`

- [ ] Documentar tipografia, spacing, controles, radius, ícones, cores e estados.
- [ ] Fornecer exemplos de uso e critérios para tiers compactos.
- [ ] Registrar valores encontrados antes da migração, componentes migrados e exceções estruturais.
- [ ] Explicar ownership: tokens → foundations → components → features/layouts.

### Task 8: Verificação final

**Files:**
- Verify only.

- [ ] Executar separadamente `npm run check:contracts`, `npm run check:css`, `npm run check:keyframes`, `npm run check:js`, `npm run check:design-system` e `npm run test:domain`.
- [ ] Executar `npx playwright test tests/contracts tests/e2e` e registrar qualquer falha preexistente separadamente.
- [ ] Executar os snapshots novos sem update.
- [ ] Executar `git diff --check` e revisar `git status --short`.
- [ ] Confirmar que `espada-longa.json` e `docs/superpowers/plans/2026-08-12-historia-vinculos-narrativos.md` continuam intocados.
