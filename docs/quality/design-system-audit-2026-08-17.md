# Auditoria de consistência visual — 2026-08-17

## Escopo

Foram auditados `css/tokens.css`, `css/foundations.css`, `css/themes.css`, `css/components.css`, `css/components/`, `css/features/` e `css/layouts/`. O objetivo foi consolidar o sistema existente, não criar uma folha paralela nem redesenhar o Meridian.

## Inconsistências encontradas

Antes da migração, controles equivalentes usavam alturas de 26, 27, 30, 34, 36, 38, 40, 42, 43, 44 e 48 px. Os casos mais visíveis eram:

- `.sheet-primary-action` com 26 px, enquanto ações principais de Habilidades e Inventário chegavam a 36 px;
- inputs da criação com 43 px e botões relacionados com 38, 42 ou 48 px;
- selects de Habilidades com 36 px/9 px e ações adjacentes com regras próprias;
- selects do Registro com 44 px e radius de 3 px, ao lado de botão com radius de 5 px;
- steppers com 26, 28, 32, 38 ou 42 px sem nomenclatura de densidade;
- controles com radius de 1, 2, 3, 4, 5, 7, 9 ou 11 px sem distinção semântica;
- foco entre 2 e 3 px, ou removido com `outline: none`;
- disabled com opacidade `.34`, `.35`, `.4`, `.42` ou `.48`;
- tipografia de controle entre 7 e 14 px, com pesos e line-heights locais.

A contagem bruta também mostrou dezenas de expressões diferentes de tipografia, spacing e geometria. Essa contagem inclui arte, media queries, grids, selos e ornamentos; por isso ela é inventário de dívida, não uma regra para substituir números cegamente.

## Consolidação aplicada

- `css/tokens.css` agora define escala tipográfica, pesos, line-heights, quatro tiers comuns de controle, tier proeminente, padding, radius, ícones, feedback e estados.
- `css/foundations.css` inclui `select` na herança, foco global seguro, disabled consistente e classes tipográficas completas.
- `css/components.css` consolida botão primário/secundário/ghost/danger/compact/icon-only, field control, select, badges e ação primária da ficha.
- Habilidades: busca, dropdowns, importação, tabs, menu e steppers foram migrados.
- Criação: inputs, botões principais/secundários/terciários, escolhas, tabs, prompts, dialogs e controles de atributo foram migrados, incluindo touch no mobile.
- Inventário: receber item, ações de item, perigo, equipar, posicionar e reveal foram migrados.
- História: ação de edição foi elevada ao tier padrão.
- Registro: busca, selects, captura, reader, dialogs e estados hover/active/focus foram migrados.
- Chrome, navegação e Resumo consomem tokens de controle, foco, ícones e KPI.
- Títulos e textos de apoio das páginas Habilidades, Inventário, História e Registro usam a mesma hierarquia semântica.

## Estado após a migração

`npm run check:design-system` audita 23 stylesheets e reporta zero violações nos componentes canônicos. O inventário atual ainda contém valores literais em áreas de composição e ilustração; eles permanecem visíveis no relatório JSON para migrações futuras.

## Exceções mantidas

- Navegação móvel com 52 px: combina ícone, label e safe area.
- Ação de reveal com 48 px: ação cerimonial proeminente.
- Cards selecionáveis: são superfícies compostas, não controles de formulário.
- Alturas da grade de inventário, selos, retratos, ilustrações e ornamentos: geometria visual própria.
- Ajustes responsivos do título global da ficha: necessários em viewports baixos e tablets.
- Textos legados internos de cards ainda possuem valores locais quando a densidade foi calibrada para evitar truncamento; novos componentes não podem copiá-los e devem começar pelos tokens documentados.

## Regra para novas mudanças

Uma nova tela deve começar por `.ui-*` e pelos tokens existentes. Um novo valor literal em botão, input, select, label ou título exige justificativa explícita nesta auditoria ou a criação de um papel semântico realmente reutilizável em `tokens.css`.
