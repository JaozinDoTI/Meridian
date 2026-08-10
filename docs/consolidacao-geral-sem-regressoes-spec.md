# SPEC — Consolidação Geral do Grimório sem Regressões

**Status:** Proposta para aprovação. Não autoriza implementação automática.

## 1. Objetivo

Consolidar HTML, CSS e JavaScript do Grimório RPG, removendo regras legadas, overrides, seletores mortos e responsabilidades duplicadas sem alterar aparência, regras de negócio, schemas, persistência ou comportamento interativo.

O resultado deve possuir uma única autoridade por responsabilidade. A limpeza não é um redesign e não pode introduzir funcionalidade nova.

## 2. Problema atual

O projeto usa `css/app.css` como entrada, mas ainda carrega quatro arquivos completos dentro da layer `legacy`:

| Arquivo legado | Linhas atuais aproximadas |
| --- | ---: |
| `style.css` | 4.739 |
| `character-sheet.css` | 5.252 |
| `inventory.css` | 928 |
| `motion.css` | 1.095 |
| **Total legado** | **12.014** |

Ao mesmo tempo, existem aproximadamente 1.656 linhas nos módulos novos em `css/`. Isso criou sobreposição relevante:

- Sidebar global: regras em `character-sheet.css` e `css/layouts/sheet-navigation.css`.
- Habilidades: centenas de referências em `character-sheet.css`, além de `css/features/abilities.css` e `css/motion/abilities.css`.
- Inventário: regras em `character-sheet.css`, `inventory.css`, `motion.css` e `css/motion/inventory.css`.
- Motion geral: animações distribuídas entre `style.css`, `character-sheet.css`, `motion.css` e módulos novos.
- Aplicação: `script.js` possui aproximadamente 7.485 linhas e concentra bootstrap, domínio, estado, renderização e eventos.

O funcionamento atual depende da ordem da cascata. Excluir arquivos inteiros agora quebraria telas ativas.

## 3. Princípio central

> Nenhum código pode ser removido apenas porque parece antigo. Toda remoção precisa identificar o consumidor, comprovar o substituto e passar pelo baseline de regressão.

Uma migração só é aceita quando, no mesmo conjunto de mudanças:

1. a responsabilidade possui um destino canônico;
2. os consumidores usam esse destino;
3. o código substituído é removido;
4. os contratos automatizados e visuais continuam aprovados;
5. o total de código de produção não aumenta por causa de compatibilidade duplicada.

É proibido criar outra folha CSS apenas para neutralizar uma folha anterior.

## 4. Fora de escopo

Esta consolidação não pode:

- redesenhar qualquer tela;
- alterar cores, tipografia, espaçamento ou animações aprovadas;
- mudar schema de personagem, habilidade ou item;
- alterar `versao: 2` do envelope da ficha;
- mudar normalização ou compatibilidade dos JSONs existentes;
- mudar fórmulas, limites, custos ou regras de Meridian;
- mudar regras de Mana, PE, Usos, Recarga ou Situação;
- mudar footprint, rotação, colisão, equipamentos ou prioridades de drop;
- criar ações de usar, ativar ou conjurar habilidades;
- trocar framework, bundler ou formato de módulos durante a limpeza;
- atualizar a biblioteca Motion ou outras dependências;
- renomear IDs, `data-*` ou actions públicas sem uma fase específica posterior;
- misturar correção visual ou funcional com extração arquitetural.

Defeitos descobertos durante a consolidação devem ser registrados separadamente. Não devem ser corrigidos silenciosamente dentro da limpeza.

## 5. Contratos invioláveis

### 5.1 Ficha e criação

- Fluxo completo: landing → identidade → espécie → classe → origem → atributos/perícias → revisão → ficha.
- Validações, limites de atributos e quantidade de perícias treinadas.
- Upload, recorte e remoção de retrato.
- Importação e exportação da ficha completa.
- Nome e estrutura do arquivo exportado.
- Estado “salvo nesta sessão” e “alterações não salvas”.
- Valores exibidos no Resumo.

### 5.2 Navegação global

- `summary`, `abilities` e `inventory` continuam sendo as únicas views funcionais.
- `aria-current` acompanha a view visível.
- Seções futuras não alteram a view ativa.
- Desktop expandido, rail de tablet e barra inferior mobile permanecem visualmente iguais ao baseline aprovado.
- Menu “Mais” mantém clique externo, `Escape`, foco e `aria-expanded`.

### 5.3 Habilidades

- `personagem.habilidades` permanece a única fonte de verdade.
- Ordem original, busca e filtros por tipo/situação.
- Seleção e fallback para primeiro resultado visível.
- Empty states de coleção e filtro.
- Importação, normalização, duplicidade, escolha de ícone e remoção.
- Alterações de Usos e Recarga, incluindo limites mínimo/máximo.
- Precedência da situação atual.
- Os cinco resumos inferiores continuam calculados sobre a coleção completa.
- Nenhum consumo de Mana ou PE é criado.

### 5.4 Inventário

- Schema V2 e compatibilidade com itens anteriores.
- Bancada, mochila, slots de equipamento e inspeção.
- Footprint, rotação e ocupação espacial.
- Seleção, movimento por teclado e drag físico.
- Preview válido/inválido e revalidação antes do drop.
- Trocas, deslocamentos e retorno à origem.
- Equipar, desequipar, descartar e importar.
- Peso, quantidade, moedas, espaços usados/livres e resumos.
- Cancelamento por `Escape`, perda de captura, blur e mudança de visibilidade.
- Reduced motion sem alterar decisão persistente.

### 5.5 Acessibilidade

- Ordem de tabulação e foco visível.
- Operação essencial por teclado.
- Labels, `aria-live`, `aria-current`, `aria-expanded` e `aria-disabled`.
- Contraste e estado não comunicados somente por cor.
- `prefers-reduced-motion` respeitado em todas as telas.

## 6. Pré-condição obrigatória: baseline confiável

A restrição antiga de não criar testes não pode valer para esta consolidação. Sem um baseline executável, não é tecnicamente honesto prometer que uma limpeza geral não quebrará nada.

Nenhuma linha de produção deve ser removida antes da aprovação e execução desta fase.

### 6.1 Checkpoint recuperável

- Criar um commit de checkpoint aprovado pelo usuário com todo o estado funcional atual.
- Executar a limpeza em branch e worktree próprios.
- Não misturar mudanças anteriores ainda não commitadas com commits de limpeza.
- Cada domínio deve gerar um commit independente e reversível.

### 6.2 Infraestrutura mínima

Criar:

```text
package.json
playwright.config.js
tests/
  contracts/
  domain/
  e2e/
  visual/
  fixtures/
tools/
  audit-dom-contracts.mjs
  audit-css-ownership.mjs
```

Dependência de desenvolvimento mínima: `@playwright/test`. Testes de domínio podem usar `node:test`.

### 6.3 Fixtures canônicas

- Ficha completa com retrato omitido ou fixture local estável.
- Habilidade técnica disponível.
- Habilidade passiva.
- Habilidade com usos esgotados.
- Habilidade em recarga.
- Item pequeno, item rotacionável, item equipável e item incompatível.
- Inventário parcialmente ocupado com staging e equipamentos.
- JSONs válidos anteriores que ainda precisam importar.
- JSONs inválidos para confirmar mensagens e ausência de mutação.

Fixtures nunca devem depender da data atual, rede ou CDN.

### 6.4 Matriz visual obrigatória

Capturar baseline das telas abaixo:

| Viewport | Estado principal |
| --- | --- |
| 1440 × 900 | Desktop amplo |
| 1280 × 720 | Desktop baixo |
| 1024 × 768 | Rail de tablet |
| 768 × 1024 | Tablet vertical/mobile expandido |
| 390 × 844 | Mobile |

Para cada viewport: Resumo, Habilidades, Inventário e estados relevantes de menu/dialog.

Diferenças visuais não intencionais bloqueiam a fase. Atualizar snapshot para “fazer passar” exige aprovação humana com comparação antes/depois.

### 6.5 Fluxos end-to-end mínimos

1. Importar ficha e abrir Resumo.
2. Navegar Resumo → Habilidades → Inventário → Resumo.
3. Abrir e fechar o menu “Mais”; ativar seção futura sem perder a view atual.
4. Importar habilidade, selecionar, buscar, filtrar, ajustar Usos/Recarga, trocar ícone e remover.
5. Importar item, manter na bancada, rotacionar, posicionar na mochila, equipar, desequipar e descartar.
6. Mover item com ponteiro e teclado, incluindo drop inválido e retorno.
7. Salvar na sessão e exportar JSON.
8. Reimportar o JSON exportado e comparar o objeto `personagem`.
9. Repetir navegação essencial com teclado.
10. Executar a matriz com `prefers-reduced-motion: reduce`.

## 7. Arquitetura CSS de destino

`css/app.css` continuará sendo o único entrypoint.

```text
css/
  app.css
  tokens.css
  foundations.css
  components.css
  themes.css
  layouts/
    app-shell.css
    sheet-shell.css
    sheet-navigation.css
  features/
    landing.css
    character-creation.css
    sheet-summary.css
    abilities.css
    inventory.css
  motion/
    primitives.css
    landing.css
    character-creation.css
    sheet.css
    abilities.css
    inventory.css
```

Ao final, `css/app.css` não deve possuir layer `legacy` nem importar arquivos CSS da raiz.

### 7.1 Regras de propriedade

- Cada seletor de componente possui um único arquivo proprietário.
- Media queries ficam no mesmo arquivo do componente que modificam.
- Tokens não contêm seletores.
- Foundations não conhecem Habilidades ou Inventário.
- Layouts controlam composição, não aparência interna de componentes.
- Features não sobrescrevem outra feature.
- Motion não define layout permanente.
- `!important` novo é proibido, exceto utilitários acessíveis documentados.
- Seletores antigos não podem ser mantidos comentados.
- Prefixos renomeados só podem existir com atualização atômica de HTML, CSS e JS.

## 8. Arquitetura JavaScript de destino

A migração JavaScript acontece somente depois da consolidação visual e sem trocar o modelo de carregamento no mesmo passo.

```text
js/
  app.js
  domain/
    character.js
    abilities.js
    inventory.js
    import-export.js
  state/
    character-state.js
    ui-state.js
  controllers/
    creation-controller.js
    sheet-controller.js
    abilities-controller.js
    inventory-controller.js
  ui/
    creation-view.js
    sheet-summary-view.js
    sheet-navigation.js
    abilities-view.js
    inventory-view.js
    inventory-card.js
  motion/
    creation-motion.js
    sheet-motion.js
    inventory-motion.js
```

### 8.1 Direção obrigatória

```text
domain → state → controller → ui/motion
```

- Domain não acessa DOM.
- State não renderiza.
- UI não altera regras nem cria cópias persistentes.
- Motion não decide regras de negócio.
- Controller é o único local que coordena evento, mutação e render.
- `app.js` apenas resolve dependências e inicializa.

### 8.2 Protocolo de extração

Para cada grupo de funções:

1. Registrar entradas, saídas, mutações e elementos DOM usados.
2. Criar teste de caracterização do comportamento atual.
3. Extrair o menor grupo coeso.
4. Manter nomes e formatos de retorno inicialmente.
5. Atualizar consumidores.
6. Remover a implementação original na mesma alteração.
7. Executar domínio, contratos, E2E e visual aplicáveis.

É proibido copiar a função para um módulo novo e deixar a versão antiga “por segurança”.

## 9. Fases de execução

### Fase 0 — Baseline e mapa de propriedade

Entregas:

- checkpoint recuperável;
- testes e fixtures;
- screenshots aprovados;
- inventário de seletores, keyframes, IDs, `data-*`, actions e funções globais;
- relatório `ativo`, `dinâmico`, `duplicado`, `morto` ou `desconhecido`.

Gate: toda suíte baseline aprovada sem alterar produção.

### Fase 1 — Shell e navegação global

Fonte canônica:

- `css/layouts/sheet-shell.css`;
- `css/layouts/sheet-navigation.css`;
- futuro `js/ui/sheet-navigation.js` somente quando a extração JS chegar.

Remover de `character-sheet.css` todas as regras comprovadamente substituídas de:

- `.sheet-shell` estrutural;
- `.sheet-sidebar*`;
- breakpoints exclusivos da sidebar;
- keyframes e estados ativos antigos sem consumidor.

Gate: cinco viewports, navegação, foco, menu “Mais” e seções futuras idênticos ao baseline.

### Fase 2 — Habilidades

Fonte canônica:

- `css/features/abilities.css`;
- `css/motion/abilities.css`;
- `js/ui/abilities-view.js`;
- domínio/controlador extraídos apenas na fase JS.

Remover de `character-sheet.css` tabela antiga, detalhe antigo, cards antigos e media queries sem DOM correspondente.

Preservar estilos do resumo de habilidades que ainda sejam usados na view Resumo; movê-los para `sheet-summary.css` em vez de apagá-los.

Gate: todos os estados de habilidade, imports, filtros, contadores e screenshots aprovados.

### Fase 3 — Inventário

Esta é a fase de maior risco e deve ser dividida em commits independentes:

1. shell e regiões;
2. cards e arte;
3. mochila e footprint;
4. bancada;
5. equipamentos;
6. inspeção e ledger;
7. drag, preview e motion;
8. responsividade.

Consolidar `character-sheet.css`, `inventory.css`, `motion.css` e módulos novos em `features/inventory.css` e `motion/inventory.css`.

Nenhum commit pode misturar CSS visual com regra de drop ou mutação persistente.

Gate por commit: fixtures espaciais, teclado, ponteiro, cancelamentos, reduced motion e screenshots.

### Fase 4 — Resumo da ficha

Extrair de `character-sheet.css` somente o que pertence ao Resumo para `features/sheet-summary.css`. Compartilhados reais vão para components/layouts; regras específicas não podem ser generalizadas artificialmente.

Gate: identidade, combate, recursos, atributos, vulnerabilidade, habilidades resumidas, perícias e inventário resumido.

### Fase 5 — Landing e criação

Separar `style.css` em `landing.css`, `character-creation.css`, components e motion correspondentes.

Fazer uma etapa da criação por commit: identidade, espécie, classe, origem, atributos/perícias e revisão.

Gate: fluxo completo, erros de validação, retrato, importação e exportação.

### Fase 6 — Motion

Inventariar todos os keyframes por nome e consumidor.

- Mover motion ainda ativa para o arquivo do domínio.
- Fundir keyframes semanticamente idênticos somente com prova visual.
- Remover keyframes sem consumidor estático ou dinâmico.
- Garantir que reduced motion tenha regra equivalente em cada domínio.
- Remover `motion.css` apenas quando não houver consumidor restante.

Gate: screenshots estáticos, testes de estado final e ausência de animações contínuas inesperadas.

### Fase 7 — JavaScript

Ordem obrigatória:

1. domínio puro e import/export;
2. estado;
3. views sem regra;
4. controllers;
5. bootstrap e eventos;
6. redução final de `script.js` para bootstrap temporário ou sua substituição por `js/app.js`.

Cada extração remove o bloco original no mesmo commit.

Gate: testes de domínio, todos os E2E, round-trip JSON e zero erro de console.

### Fase 8 — Remoção final do legado

Somente após todos os gates:

- remover imports da layer `legacy`;
- remover `style.css`, `character-sheet.css`, `inventory.css` e `motion.css` vazios de responsabilidade;
- remover a própria layer `legacy` de `css/app.css`;
- remover classes, IDs, actions, constantes e queries sem consumidor;
- atualizar `docs/architecture.md` e `docs/design-system.md` para o estado real;
- executar auditoria final de produção e testes.

## 10. Protocolo obrigatório para cada remoção

Antes de apagar um seletor, função, variável ou listener:

1. Buscar referência literal no repositório.
2. Buscar construção dinâmica do nome.
3. Identificar quem produz o elemento/estado.
4. Identificar quem consome o elemento/estado.
5. Classificar o item.
6. Registrar substituto canônico.
7. Remover código antigo e override correspondente juntos.
8. Executar os checks do domínio.
9. Inspecionar diff procurando alteração funcional acidental.
10. Criar commit reversível.

Itens classificados como `desconhecido` não podem ser removidos.

## 11. Disciplina de commits e rollback

- Um domínio por branch ou sequência claramente isolada.
- Um comportamento preservado por commit.
- Nenhum commit chamado genericamente de “cleanup geral”.
- Não usar `git reset --hard` para recuperar falhas.
- Reverter o commit específico quando um gate falhar.
- Não avançar de fase com regressão conhecida.
- Não atualizar baseline para esconder regressão.
- Manter relatório de remoções por fase com origem, destino e prova.

Exemplos de commits aceitáveis:

```text
test: lock current sheet navigation behavior
refactor(css): make sheet navigation the sole sidebar owner
refactor(css): remove obsolete ability table styles
refactor(css): consolidate inventory bench styles
refactor(js): extract pure ability normalization
chore(css): remove empty legacy layer
```

## 12. Critérios finais de aceitação

A consolidação estará concluída somente quando:

- `css/app.css` for o único entrypoint CSS;
- nenhum CSS da raiz for importado;
- a layer `legacy` não existir;
- cada seletor tiver proprietário único ou exceção documentada;
- media queries estiverem junto de seus componentes;
- não houver keyframe sem consumidor;
- não houver query DOM obrigatória apontando para elemento inexistente;
- não houver função duplicada entre `script.js` e módulos;
- o código de produção não crescer por compatibilidade paralela;
- o round-trip JSON preservar `personagem`;
- todos os testes de domínio, contratos, E2E e visuais passarem;
- os cinco viewports forem aprovados;
- não houver erro ou warning novo no console;
- `git diff --check` estiver limpo;
- documentação refletir o estado real;
- a exclusão dos quatro arquivos legados for confirmada por busca final.

## 13. Condições que bloqueiam imediatamente a limpeza

- workspace sem checkpoint recuperável;
- baseline inexistente ou falhando;
- navegador de validação indisponível durante uma fase visual;
- mudança de schema não planejada;
- diferença visual sem aprovação;
- função ou seletor com consumidor desconhecido;
- necessidade de `!important` para vencer regra que deveria ter sido removida;
- nova cópia temporária de lógica persistente;
- tentativa de consolidar Inventário e Habilidades no mesmo commit;
- pressão para “apagar tudo e ver o que quebra”.

## 14. Decisão necessária antes da execução

Para cumprir o pedido de não quebrar nada, a implementação desta spec exige aprovação explícita para:

1. criar a infraestrutura mínima de testes;
2. registrar screenshots baseline;
3. criar um checkpoint recuperável;
4. trabalhar por fases, sem promessa de uma única alteração gigante;
5. interromper imediatamente qualquer fase cujo gate não passe.

Sem essas cinco condições, a limpeza geral não deve começar.
