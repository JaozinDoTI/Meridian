# Revisão Coerente do Recebimento do Inventário — Plano de Implementação

> **For agentic workers:** Executar neste worktree. Não criar, alterar ou executar testes; validar por inspeção estática, revisão do diff e contratos de DOM/CSS.

**Goal:** Corrigir como uma única experiência o bloqueio de segunda importação, a hierarquia do reveal e a composição contextual do inspector.

**Architecture:** Manter `GrimorioInventoryDomain` e todas as transações espaciais intactas. Concentrar guardas e decisões contextuais no controller de inventário, reutilizar o sistema de `dialog` existente e consolidar o CSS local do reveal/inspector sobre a implementação premium já presente neste worktree.

**Tech Stack:** HTML semântico, CSS responsivo, JavaScript ES clássico e `<dialog>` nativo já adotado pelo projeto.

---

## Chunk 1: Segurança e feedback da importação

- [x] Reutilizar `ability-dialog` para o aviso de Recebimento ocupado.
- [x] Aplicar a guarda antes do seletor e novamente antes da atribuição ao staging.
- [x] Preservar o item existente e limpar somente a seleção recusada.

## Chunk 2: Reveal curto e equilibrado

- [x] Tornar “Equipar” a ação principal e “Levar ao Recebimento” a secundária.
- [x] Igualar geometria e responsividade dos CTAs.
- [x] Exigir escolha explícita quando houver duas mãos válidas.

## Chunk 3: Inspector contextual

- [x] Selecionar automaticamente o item recebido para inspeção.
- [x] Priorizar arte, atributo e métricas compactas.
- [x] Hierarquizar ações e separar visualmente a destrutiva.
- [x] Reduzir o conteúdo que causava scroll permanente, preservando scroll apenas quando necessário.

## Chunk 4: Verificação sem testes

- [x] Confirmar que arquivos de domínio e testes não foram tocados por esta revisão.
- [x] Verificar referências de IDs e handlers por inspeção estática.
- [x] Confirmar que grid, colisão, footprint, rotação e transações continuam delegados ao domínio existente.
