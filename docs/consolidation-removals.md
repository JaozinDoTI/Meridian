# Registro de remoções da consolidação

Este documento registra apenas migrações comprovadas. Itens desconhecidos permanecem no local de origem até que exista consumidor e substituto identificados.

## Fase 1 — Shell da ficha

| Classificação | Origem | Destino canônico | Prova |
| --- | --- | --- | --- |
| Ativo, movido | `body.sheet-is-open` e superfícies da ficha em `character-sheet.css` | `css/layouts/sheet-shell.css` | Contratos DOM, 3 testes de domínio, 6 fluxos e 15 snapshots aprovados |
| Ativo, movido | estrutura e ornamentos de `.sheet-shell` | `css/layouts/sheet-shell.css` | Comparação visual nos cinco viewports sem diferença |
| Ativo, movido | grid, overflow e responsividade de `.sheet-main` | `css/layouts/sheet-shell.css` | Resumo, Habilidades e Inventário aprovados em todos os viewports |
| Duplicado, consolidado | padding inferior mobile de `.sheet-main` em `sheet-navigation.css` | media query mobile de `css/layouts/sheet-shell.css` | Comparação visual mobile sem diferença |

A superfície externa da navegação é composta pelo shell; a aparência e os controles internos continuam pertencendo a `css/layouts/sheet-navigation.css`.

## Fase 1 — Navegação global

| Classificação | Origem | Destino canônico | Prova |
| --- | --- | --- | --- |
| Ativo, consolidado | propriedades herdadas da marca, botões e rodapé em `character-sheet.css` | `css/layouts/sheet-navigation.css` | 15 snapshots idênticos e fluxos de navegação aprovados |
| Duplicado, removido | regras base e breakpoints antigos de `.sheet-sidebar*` | implementação responsiva existente em `css/layouts/sheet-navigation.css` | nenhum seletor de sidebar restante em `character-sheet.css` |
| Morto, removido | `sheet-nav-activate` e `sheet-nav-marker` em `motion.css` | nenhum; a navegação atual declara `animation: none` | busca global encontrou apenas as definições antes da remoção |
| Duplicado, removido | valores antigos de `--sheet-sidebar-width` | `css/layouts/sheet-navigation.css` | largura desktop e rail preservadas nos cinco viewports |

Após a consolidação da navegação, a auditoria caiu de 81 para 79 sobreposições entre arquivos e de 1.841 para 1.826 seletores, sem diferença visual.

## Fase 2 — Habilidades

| Classificação | Origem | Destino canônico | Prova |
| --- | --- | --- | --- |
| Ativo, movido | grid externo de `.sheet-abilities-view` | `css/features/abilities.css` | tela aprovada nos cinco viewports |
| Ativo, movido | resumo de habilidades da ficha | `css/features/sheet-summary.css` | Resumo e navegação por seus cards aprovados visualmente |
| Ativo, compartilhado | diálogos de importação/remoção e seletor de ícones | `css/components.css` | importação, duplicidade, troca de ícone, remoção e descarte do Inventário preservados |
| Duplicado, removido | duas composições antigas de tabela/lista/detalhe em `character-sheet.css` | `css/features/abilities.css` e `js/ui/abilities-view.js` | busca estática sem classes antigas; lista, detalhe e ledger atuais aprovados |
| Morto, removido | breakpoints da tabela antiga e `sheet-selection-enter` | nenhum | nenhum produtor ou consumidor encontrado após a migração para cards |

O botão `.sheet-primary-action` continua temporariamente na camada legada porque também é consumido pelo Inventário e a ordem atual da cascata é funcional. A tentativa de promovê-lo isoladamente alterou a altura do Inventário móvel; o gate bloqueou a mudança e ela foi revertida. A migração deve ocorrer junto das regras específicas do Inventário na Fase 3.

Os testes de Habilidades agora também caracterizam normalização bilíngue, limites de Usos/Recarga, precedência de Situação, JSON inválido sem mutação, aviso de duplicidade, seleção de ícone e remoção. A auditoria ficou em 1.669 seletores e 78 sobreposições entre arquivos.

## Fase 3 — Inventário: propriedade estática

| Classificação | Origem | Destino canônico | Prova |
| --- | --- | --- | --- |
| Ativo, movido | apresentação premium, regiões, cards, mochila, bancada, equipamentos, inspeção, ledger e breakpoints em `character-sheet.css` | `css/features/inventory.css` | comparação linha a linha exata de 948 linhas e 15 snapshots idênticos |
| Ativo, movido | implementação física V2 e seus breakpoints em `inventory.css` | `css/features/inventory.css` | comparação linha a linha exata de 928 linhas e 15 snapshots idênticos |
| Legado, removido do carregamento | import de `inventory.css` na layer `legacy` | import único de `css/features/inventory.css` na layer `components` | Inventário aprovado nos cinco viewports sem diferença visual |

Esta etapa é uma realocação atômica e reversível: preserva a ordem interna das duas fontes sem editar declarações. A consolidação de duplicidades será feita por subdomínio em commits posteriores, com gates próprios; `motion.css` ainda não foi alterado.
