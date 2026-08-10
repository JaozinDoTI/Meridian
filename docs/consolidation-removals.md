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
