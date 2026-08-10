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

## Fase 3 — Inventário: movimento reduzido

| Classificação | Origem | Destino canônico | Prova |
| --- | --- | --- | --- |
| Ativo, movido | neutralização de animação, transição e transformação do Inventário em `motion.css` | media query de `css/motion/inventory.css` | cenário dedicado com `prefers-reduced-motion: reduce`, 19 testes de navegador e 15 snapshots aprovados |

O fallback global de movimento reduzido da ficha permanece em `motion.css`; somente os cinco seletores pertencentes ao Inventário foram transferidos.

## Fase 3 — Inventário: shell e regiões

| Classificação | Origem | Destino canônico | Prova |
| --- | --- | --- | --- |
| Morto, removido | `.sheet-inventory-premium-shell`, commandbar, workspace e navegação móvel da composição anterior | `.inventory-shell`, `.inventory-header`, `.inventory-workspace` e navegação global atuais | produtores antigos ausentes no HTML/JS; 19 testes e 15 snapshots aprovados |
| Duplicado, removido | bancada, cabeçalhos regionais e moldura da mochila da composição anterior | `.inventory-bench*`, `.inventory-region-heading*` e `.inventory-backpack*` atuais | comparação visual nos cinco viewports sem diferença |

A etapa removeu 217 linhas e 46 seletores sem tocar nas declarações antigas ainda ativas de cards, drag e inspeção, que permanecem para consolidação nos respectivos commits.

## Fase 3 — Inventário: cards e arte

| Classificação | Origem | Destino canônico | Prova |
| --- | --- | --- | --- |
| Duplicado, removido | carta, hover, seleção, arte e fallback sob `.sheet-inventory-premium-shell` | `.inventory-shell .sheet-inventory-item` e sistema compartilhado `.inventory-item-art` | ausência do shell antigo; estados de seleção, rotação e drag aprovados |
| Morto, removido | `.sheet-inventory-item__caption` e `.sheet-inventory-drag-proxy` antigos | `.inventory-card*` e `.inventory-drag-object*` atuais | nenhum produtor no HTML/JS; importação e drag válido/inválido aprovados |
| Ativo, fundido | sombra do contador de quantidade na declaração antiga | `.inventory-shell .sheet-inventory-item__quantity` | 15 snapshots idênticos |

A etapa retirou 29 linhas e 16 seletores; a regra ativa que atenua outros itens durante drag ficou preservada para o commit específico de movimento.

## Fase 3 — Inventário: equipamentos

| Classificação | Origem | Destino canônico | Prova |
| --- | --- | --- | --- |
| Morto, removido | `.sheet-inventory-loadout`, `.sheet-inventory-armor-slot*` e arte de armadura da composição anterior | `.inventory-equipment*`, `.inventory-equipment-slot*` e `.inventory-card*` | nenhum produtor das classes antigas; equipar, desequipar, troca de estado e snapshots aprovados |

Foram removidas 12 linhas compactadas e 11 seletores. O teste funcional confirma a ida da Espada Colossal para a mão principal e seu retorno a uma posição válida da mochila.

## Fase 3 — Inventário: inspeção e ledger

| Classificação | Origem | Destino canônico | Prova |
| --- | --- | --- | --- |
| Duplicado, consolidado | detalhes e ações sob `.sheet-inventory-premium-shell` | `.inventory-details-panel` e regras contextualizadas por `.inventory-shell` | seleção, conteúdo completo, rotação e ações aprovados |
| Ativo, fundido | `letter-spacing` do rótulo do atributo principal | `.inventory-shell .sheet-inventory-details__hero-stat span` | declaração computada preservada e snapshots idênticos |
| Morto, removido | `.sheet-inventory-ledger*` da composição anterior | `.inventory-ledger*` atual | produtores antigos ausentes; peso, itens, espaços e moedas preservados |

A auditoria passou a 1.599 seletores; os 29 seletores retirados não tinham autoridade visual após a composição V2/V3.

## Fase 3 — Inventário: responsividade

| Classificação | Origem | Destino canônico | Prova |
| --- | --- | --- | --- |
| Morto, removido | breakpoints de 1180, 980 e 700 px ligados a `.sheet-inventory-premium-shell` e `data-inventory-mobile-panel` | breakpoints de 1120, 760 e 470 px da composição `.inventory-*` atual | atributos e produtores antigos ausentes; desktop, tablet e celular idênticos ao baseline |
| Morto, removido | reduced motion do shell premium inexistente | `css/motion/inventory.css` | cenário explícito com preferência reduzida aprovado |

Foram retirados 27 seletores responsivos antigos. A navegação do Inventário continua sendo a navegação global da ficha, sem uma segunda navegação móvel interna.

## Fase 3 — Inventário: containers espaciais

| Classificação | Origem | Destino canônico | Prova |
| --- | --- | --- | --- |
| Morto, removido | `.sheet-inventory-workspace`, grid/details panels, toolbar, capacidade e grid shell da primeira versão espacial | `.inventory-workspace`, `.inventory-header`, `.inventory-capacity`, `.inventory-backpack` e `.inventory-sidecar` | classes antigas sem produtor; contratos e snapshots aprovados |

As 104 linhas removidas eram exclusivamente containers da composição anterior. As bases ainda consumidas de grid, células, itens e preview não participaram deste commit.

## Fase 3 — Inventário: mochila e footprint

| Classificação | Origem | Destino canônico | Prova |
| --- | --- | --- | --- |
| Ativo, fundido | propriedades complementares de scroll, runas, foco, grade e células da primeira versão espacial | regras contextualizadas por `.inventory-shell` no bloco da mochila atual | posicionamento por teclado, drag válido/inválido e snapshots aprovados |
| Duplicado, removido | bases não contextualizadas de grid, layers, células ocupadas e moldura | `.inventory-shell .sheet-inventory-*` | propriedades computadas preservadas nos cinco viewports |
| Ativo, fundido | feedback de célula válida/inválida | `.inventory-shell .sheet-inventory-cell.is-preview-*` | colisão e preview continuam cobertos pelos testes de domínio e navegador |

O commit substituiu 134 linhas por 50 linhas canônicas, reduzindo a auditoria para 1.557 seletores e 67 sobreposições entre arquivos.

## Fase 3 — Inventário: cartas espaciais e estados de drag

| Classificação | Origem | Destino canônico | Prova |
| --- | --- | --- | --- |
| Ativo, fundido | base não contextualizada de `.sheet-inventory-item`, tipografia interna e badge de footprint | `.inventory-shell .sheet-inventory-item`, `.item-card--spatial*` e badge contextualizado | comparação de todas as propriedades computadas e 15 snapshots idênticos |
| Ativo, movido | `is-dragging`, escala da origem e atenuação dos demais itens | `css/motion/inventory.css` | teclado, drag válido/inválido, retorno e reduced motion aprovados |
| Ativo, fundido | cores de raridade e `--item-glow` | cinco regras `.is-rarity-*` da V3.1 | fallback, borda, brilho e arte preservados |

O gate visual inicialmente recusou a extração porque o badge espacial participava da segunda track implícita do grid. A regra computada foi identificada, explicitada no seletor canônico e só então os 15 snapshots voltaram ao baseline. O resultado líquido remove 69 linhas e reduz a auditoria a 1.553 seletores e 66 sobreposições.

## Fase 3 — Inventário: drag e preview

| Classificação | Origem | Destino canônico | Prova |
| --- | --- | --- | --- |
| Morto, removido | `.sheet-inventory-drag-proxy*` | `.inventory-drag-object*` em feature/motion | nenhum produtor antigo; drag válido, inválido e retorno aprovados |
| Ativo, fundido | sombra das células de preview, tipografia do footprint, empty state e status | regras contextualizadas por `.inventory-shell` | previews, colisão, colocação e mensagens aprovados |
| Duplicado, removido | base não contextualizada de preview válido/inválido | `.inventory-shell .sheet-inventory-preview-*` | revalidação final e screenshots preservadas |

Foram removidas 88 linhas líquidas; a auditoria caiu para 1.541 seletores e 65 sobreposições.

## Fase 3 — Inventário: inspeção e ações finais

| Classificação | Origem | Destino canônico | Prova |
| --- | --- | --- | --- |
| Ativo, fundido | scrollbar, ícone vazio, metadata e peso tipográfico da inspeção espacial | `.inventory-details-panel` e `.inventory-shell .sheet-inventory-details*` | seleção, rotação e inspeção completa aprovadas |
| Ativo, reposicionado | `.sheet-danger-action` | seção de ações do Inventário atual | cancelar e confirmar descarte aprovados |
| Morto/duplicado, removido | details panel, heading e pending actions da composição espacial antiga | `.inventory-sidecar`, `.inventory-region-heading`, `.inventory-details-panel` e `.inventory-pending-actions` | produtores antigos ausentes e snapshots idênticos |

O bloco antigo de inspeção/ações caiu de 118 para 22 linhas canônicas; a auditoria registra agora 1.523 seletores.

## Fase 3 — Inventário: breakpoints ativos finais

| Classificação | Origem | Destino canônico | Prova |
| --- | --- | --- | --- |
| Ativo, reposicionado | `grid-row: auto` em 1099 px | media query junto aos breakpoints V2/V3 | tablet/desktop baixo idênticos ao baseline |
| Ativo, explicitado | ações de inspeção empilhadas entre 471 e 560 px | seletor contextualizado por `.inventory-shell` | comportamento até 470 px continua sob o breakpoint atual já existente |
| Morto, removido | toolbar, workspace, grid shell, details panel e pending actions dos breakpoints espaciais antigos | composição responsiva `.inventory-*` atual | produtores ausentes e cinco viewports aprovados |

A Fase 3 termina com 1.512 seletores e 64 sobreposições. Toda apresentação estática do Inventário pertence a `css/features/inventory.css`, todo movimento específico pertence a `css/motion/inventory.css`, e o antigo `inventory.css` não existe mais.

## Fase 4 — Resumo: mochila resumida

| Classificação | Origem | Destino canônico | Prova |
| --- | --- | --- | --- |
| Ativo, movido | `.sheet-inventory-summary*` e barra `.sheet-inventory-occupancy` | `css/features/sheet-summary.css` | contagens da coleção completa, progresso e 15 snapshots aprovados |

Esses seletores representam o card resumido presente na view `summary`; a tela completa de Inventário deixou de ser sua proprietária.

## Fase 4 — Resumo: retirada do CSS raiz

| Classificação | Origem | Destino canônico | Prova |
| --- | --- | --- | --- |
| Ativo, movido | conteúdo remanescente de `character-sheet.css` | `css/features/sheet-summary.css`, preservando a ordem total antes das regras incrementais já canônicas | 18 contratos funcionais e 15 snapshots aprovados |
| Ativo, movido | fallback global de `prefers-reduced-motion` no fim de `motion.css` | `css/motion/primitives.css` | propriedades computadas comparadas com o checkpoint e cinco viewports aprovados |
| Legado, removido | import de `character-sheet.css` na layer `legacy` | import canônico de `features/sheet-summary.css` | auditoria registra 1.512 seletores e 70 sobreposições, sem o arquivo raiz |

A retirada foi atômica porque promover apenas as regras-base do Resumo fazia essas regras vencerem os breakpoints ainda legados. A ordem completa foi mantida no destino; os blocos realmente compartilhados serão extraídos dali para `components` e `layouts` em commits separados.

## Fase 4 — Resumo: responsabilidades compartilhadas

| Classificação | Origem | Destino canônico | Prova |
| --- | --- | --- | --- |
| Ativo, movido | base visual, dimensões e variáveis responsivas de `.character-sheet-screen` | `css/layouts/sheet-shell.css` | cinco viewports e altura integral preservados |
| Ativo, movido | sprite, ícone SVG e utilitário de conteúdo somente para leitores de tela | `css/components.css` | contratos DOM, acessibilidade e 15 snapshots aprovados |
| Ativo, movido | `.sheet-primary-action`, consumida por Habilidades e Inventário | `css/components.css` | importação de habilidade, importação/equipamento de item e estados visuais aprovados |

A primeira tentativa moveu a base sem suas variáveis de breakpoint e foi recusada pelo gate visual. As variáveis foram reunidas ao mesmo proprietário de layout antes do commit; o resultado final não altera nenhum snapshot.

## Fase 4 — Resumo: chrome e contrato de views

| Classificação | Origem | Destino canônico | Prova |
| --- | --- | --- | --- |
| Ativo, movido | topbar, título, ações de documento, feedback, estado de salvamento e rodapé | `css/components/sheet-chrome.css` | salvar/exportar, feedback, cinco breakpoints e 15 snapshots aprovados |
| Ativo, movido | `.sheet-primary-action` responsiva | `css/components.css` | Habilidades e Inventário preservados |
| Ativo, movido | ocultação de `[data-sheet-view]` | `css/layouts/sheet-shell.css` | navegação entre Resumo, Habilidades e Inventário aprovada |
| Ativo, movido | entrada animada das views | `css/motion/primitives.css` | movimento reduzido e ausência de classes residuais aprovados |

Nenhum seletor de topbar, ação de documento, feedback ou rodapé permanece em `features/sheet-summary.css`.

## Fase 5 — Landing e criação: retirada do CSS raiz

| Classificação | Origem | Destino canônico | Prova |
| --- | --- | --- | --- |
| Ativo, movido | conteúdo integral de `style.css` | `css/features/landing.css`, temporariamente ainda na layer `legacy` | 22 contratos de navegador, 3 testes de domínio e 15 snapshots aprovados |
| Legado, removido | import e arquivo `style.css` na raiz | import explícito de `features/landing.css` | auditoria dinâmica preservou 1.514 seletores e 69 sobreposições |

Esta etapa é somente uma realocação recuperável: a separação entre Landing, Criação e componentes compartilhados ocorre nos commits seguintes, sem promoção prematura de cascata.

## Fase 5 — Landing e criação: autoridades separadas

| Classificação | Origem | Destino canônico | Prova |
| --- | --- | --- | --- |
| Ativo, separado | composição inicial e preview | `css/features/landing.css` | landing, importação inválida e cinco viewports aprovados |
| Ativo, separado | identidade, espécie, classe, origem, atributos/perícias, revisão e recorte de retrato | `css/features/character-creation.css` | fluxo completo, exportação e abertura da ficha aprovados |
| Ativo, movido | moldura e cenário compartilhados da aplicação | `css/layouts/app-shell.css` | Resumo, Habilidades e Inventário idênticos nos cinco viewports |
| Ativo, movido | keyframes de entrada e criação | `css/motion/landing.css` e `css/motion/character-creation.css` | snapshots sem alteração e reduced motion preservado |
| Ativo, movido | tokens, fundamentos e tilt compartilhado | `css/tokens.css`, `css/foundations.css` e `css/components.css` | cascata validada por contratos, E2E e comparação visual |

A auditoria registra 1.514 seletores e 77 sobreposições entre arquivos. O aumento aparente decorre de oito responsabilidades antes contidas no mesmo arquivo que agora atravessam base e breakpoint ou feature e motion (`:root`, listas interativas, `.attribute-card` e arte de espécie); essas exceções permanecem explícitas até a auditoria final por tipo de propriedade. A primeira divisão foi recusada porque cortou dois blocos CSS; o teste de criação detectou a perda da grade. Depois, o gate visual detectou prioridade incorreta de `min-width`; Landing e Criação foram promovidas para a layer canônica de componentes, sem override adicional. O gate final aprovou 20 testes de navegador, 4 testes de domínio e 15 snapshots.

## Fase 6 — Movimento: retirada do CSS raiz

| Classificação | Origem | Destino canônico | Prova |
| --- | --- | --- | --- |
| Ativo, movido | propriedades registradas, estados e keyframes compartilhados de atributos | `css/motion/primitives.css` | criação, resumo, feedback de recursos e reduced motion aprovados |
| Ativo, movido | keyframes de entrada, status, recursos, atenção e estado crítico da ficha | `css/motion/sheet.css` | Resumo e chrome preservados nos cinco viewports |
| Legado, removido | import e arquivo `motion.css` na raiz | imports canônicos em `css/motion/` | busca final sem import raiz e teste arquitetural explícito |

A auditoria caiu para 71 sobreposições entre arquivos. O gate final aprovou 20 testes de navegador, 5 testes de domínio e 15 snapshots, sem atualização de baseline.

## Fase 7 — JavaScript: retirada dos arquivos raiz

| Classificação | Origem | Destino canônico | Prova |
| --- | --- | --- | --- |
| Ativo, dividido | estado, DOM, criação, habilidades, resumo, inventário, navegação e bootstrap de `script.js` | `js/state/character-state.js`, `js/ui/dom-bindings.js`, `js/controllers/`, `js/ui/sheet-summary-view.js` e `js/app.js` | 20 contratos/E2E, 6 testes de domínio e 15 snapshots aprovados |
| Ativo, movido | domínio espacial de `inventory-domain.js` | `js/domain/inventory.js` | 3 testes puros e todos os fluxos de inventário aprovados |
| Ativo, movido | `attribute-motion.js` e `motion-enhancements.js` | `js/motion/creation-motion.js` e `js/motion/sheet-motion.js` | atributos, recursos, navegação e reduced motion aprovados |
| Infraestrutura, corrigida | auditor DOM acoplado a `script.js` | descoberta dos scripts locais declarados em `index.html` | 327 IDs, 261 consultas e 15 scripts auditados |

Este commit é uma divisão mecânica de responsabilidades e preserva o carregamento clássico. `js/app.js` contém apenas listeners e bootstrap; nenhuma função de domínio ou renderização permanece nele. As extrações puras de Habilidades e import/export seguem em commits separados.

## Fase 7 — JavaScript: domínio de Habilidades

| Classificação | Origem | Destino canônico | Prova |
| --- | --- | --- | --- |
| Ativo, extraído | normalização de schema, aliases, custos, usos e recarga | `js/domain/abilities.js` | testes puros de normalização e importação E2E aprovados |
| Ativo, extraído | precedência da situação, rótulos e resumo operacional | `js/domain/abilities.js` | passiva → esgotada → recarga → disponível preservado por teste |
| Original, removido | implementações puras dentro de `abilities-controller.js` | ponte de controller que injeta somente o catálogo de ícones | busca, filtros, resumos, mutações e diálogos aprovados |

O gate final aprovou 20 testes de navegador, 8 testes de domínio e 15 snapshots. O domínio não acessa DOM nem estado persistente.
