# Registro de Jornada Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transformar a seção futura “Registro” em um diário cronológico de campanha, com captura rápida durante a sessão e leitura/edição organizada depois dela.

**Architecture:** O modelo persistente recebe `personagem.registros` como uma coleção independente de `origem.historia` e `vinculos`. Um domínio puro concentra schema, validação, IDs e ordenação; view e controller próprios cuidam da linha do tempo, editor, filtros e foco. A ficha v2 continua importando arquivos antigos sem `registros`, usando coleção vazia como fallback.

**Tech Stack:** HTML semântico, CSS em layers/tokens existentes, JavaScript clássico com namespaces `window.Grimorio*`, Node test runner e Playwright.

---

## Proposta de produto

“História” deve continuar respondendo **quem o personagem era antes da aventura**. “Registro de Jornada” passa a responder **o que aconteceu desde que a aventura começou**.

O MVP combina dois ritmos:

1. **Durante a sessão:** uma captura rápida de título curto + anotação, salva com `Ctrl+Enter`/`Cmd+Enter`.
2. **Depois da sessão:** o jogador abre o registro, completa o texto, escolhe um tipo e organiza as entradas em ordem cronológica.

Tipos iniciais, deliberadamente pequenos:

- `sessao`: resumo amplo de uma sessão;
- `descoberta`: pista, segredo, lugar ou informação relevante;
- `pendencia`: objetivo, promessa ou assunto a retomar;
- `nota`: registro livre.

Cada entrada usa o schema canônico:

```js
{
  id: "registro-...",
  tipo: "nota",
  titulo: "A porta sob a torre",
  conteudo: "Encontramos inscrições...",
  data: "",
  sessao: "",
  marcadores: [],
  fixado: false,
  criadoEm: "2026-08-17T18:30:00.000Z",
  atualizadoEm: "2026-08-17T18:30:00.000Z"
}
```

`data` é texto opcional para aceitar calendários do mundo fictício. `criadoEm` e `atualizadoEm` são metadados técnicos ISO. No MVP, registros não mantêm cópias de habilidades, itens ou vínculos; integrações futuras armazenam apenas IDs estáveis.

## Especificação front-end

### Direção de experiência

O Registro não deve parecer um painel administrativo nem uma réplica de Notion/Trello. A metáfora é uma **crônica de campanha aberta sobre a mesa**: o usuário percorre acontecimentos no trilho e lê uma página por vez. A interface precisa ser rápida o bastante para receber uma nota no meio da sessão, mas editorial o bastante para recompensar a leitura posterior.

Princípios:

1. **Capturar sem interromper:** uma nota deve ser salva em poucos segundos e com poucas decisões.
2. **Ler antes de administrar:** o estado padrão mostra a crônica; ações destrutivas ou organizacionais ficam secundárias.
3. **Progressive disclosure:** título e nota bastam na captura rápida; metadados aparecem no editor completo.
4. **Uma superfície, dois ritmos:** captura rápida e edição completa trabalham sobre o mesmo registro, sem tipos de dados paralelos.
5. **Identidade Meridian:** papel, vinho, dourado, ícones lineares e hierarquia serifada; nenhum card genérico de SaaS.

### Arquitetura de informação

A view possui cinco regiões semânticas:

```text
┌──────────────────────────────────────────────────────────────────┐
│ CRÔNICA DA CAMPANHA                     18 registros  [Novo]     │
│ Registro de Jornada · acontecimentos, pistas e promessas          │
├──────────────────────────────────────────────────────────────────┤
│ Captura rápida: [Título ou acontecimento................] [＋]    │
├───────────────────────┬──────────────────────────────────────────┤
│ Buscar...   Tipo ▾    │ NOTA · SESSÃO 04                ☆  ⋯     │
│                       │ A porta sob a torre                       │
│ ● Hoje                │ 12º dia da Névoa · atualizado agora      │
│   A porta sob a torre │ ──────────────────────────────────────── │
│   trecho do relato... │ Encontramos inscrições antigas...         │
│                       │                                           │
│ ○ Sessão 03           │ marcadores: torre  mistério               │
│   O acordo quebrado   │                                           │
│                       │                           [Editar registro] │
└───────────────────────┴──────────────────────────────────────────┘
```

1. **Cabeçalho da crônica:** kicker, `h2`, descrição curta, contador e CTA primário.
2. **Captura rápida:** campo de uma linha que começa recolhido e expande para título + nota somente após foco/digitação.
3. **Ferramentas do acervo:** busca, filtro por tipo, filtro “Fixados” e ação “Limpar filtros” quando necessário.
4. **Trilho cronológico:** grupos por sessão quando informada; entradas sem sessão aparecem em “Notas avulsas”.
5. **Página de leitura:** tipo, título, metadados, conteúdo, marcadores e ações secundárias.

### Hierarquia e composição

#### Cabeçalho

- Kicker em caixa alta: `CRÔNICA DA CAMPANHA`.
- Título: `Registro de Jornada` com ícone `sheet-icon-book`.
- Descrição: `Acontecimentos, pistas e promessas que moldaram esta jornada.`
- Contador usa singular/plural correto: `1 registro` / `18 registros`.
- `Novo registro` é o único botão vinho sólido no cabeçalho.
- Em largura reduzida, contador fica abaixo do texto; CTA continua visível sem depender de menu overflow.

#### Captura rápida

- Estado repouso: uma superfície de papel com placeholder `O que aconteceu?` e ícone de pena.
- Ao receber foco, expande verticalmente e revela textarea curta, seletor de tipo com default `Nota` e ações `Cancelar`/`Registrar`.
- Não mostrar sessão, data e marcadores nessa etapa; eles pertencem ao editor completo.
- `Ctrl+Enter`/`Cmd+Enter` salva; `Escape` recolhe se o draft estiver vazio. Com conteúdo, Escape não descarta silenciosamente: mantém aberto e move foco para `Cancelar`.
- Após salvar, o novo card entra no topo, torna-se selecionado e a página de leitura recebe foco programático no título.
- O feedback `Registro adicionado à jornada.` é anunciado em `aria-live`; não usar toast flutuante como única confirmação.

#### Trilho cronológico

- Largura desktop: `clamp(280px, 24vw, 340px)`; tablet rail: `clamp(240px, 31vw, 280px)`.
- Fundo levemente mais profundo que a página de leitura para criar separação física.
- Cada item é um `button`, não um `div` clicável.
- Card contém: ícone + tipo, título em até duas linhas, excerto em até duas linhas, sessão/data e indicação textual de fixado.
- Seleção usa borda vinho à esquerda, fundo de papel elevado e `aria-current="true"`; hover sozinho nunca comunica seleção.
- Grupos de sessão são headings reais, com contador opcional, e não componentes expansíveis no MVP.
- A lista não virtualiza no MVP; com 100 entradas deve permanecer utilizável. O trilho pode rolar internamente apenas no desktop de altura limitada.

#### Página de leitura

- É o foco visual: uma folha clara com largura de texto confortável, `max-width` equivalente a aproximadamente 75 caracteres por linha.
- Cabeçalho editorial com tipo, sessão/data, título, fixar e menu de ações.
- Conteúdo preserva quebras de parágrafo, nunca interpreta HTML ou Markdown.
- Marcadores aparecem após o conteúdo como chips discretos; não competem com o título.
- `Editar registro` fica no fim do cabeçalho ou no rodapé da folha; `Excluir` existe apenas no menu secundário e exige confirmação.
- Conteúdo vazio mostra `Nenhum relato detalhado foi escrito para este registro.` sem remover título/metadados.

### Linguagem visual

O tema deriva dos tokens existentes, evitando uma paleta paralela:

- superfície principal: `--sheet-paper` / `--sheet-surface-primary`;
- trilho: `--sheet-paper-soft` / `--sheet-surface-secondary`;
- ação e seleção: `--sheet-wine` / `--sheet-wine-dark`;
- ornamentos e metadados: `--sheet-gold` / `--sheet-gold-strong`;
- texto: `--sheet-ink`, `--sheet-ink-soft`, `--sheet-muted`;
- bordas: `--sheet-border`, `--sheet-divider`;
- elevação: `--sheet-shadow`, sem sombras novas arbitrárias.

Regras:

- título de página entre 28–34 px no desktop e 24–28 px no mobile;
- corpo de leitura mínimo de 16 px e `line-height` entre 1.65–1.8;
- labels/metadados nunca menores que 11 px no desktop ou mobile;
- touch target mínimo de 44 px;
- raio discreto, igual ao restante da ficha; evitar cards excessivamente arredondados;
- tipos usam ícone + nome: sessão/livro, descoberta/estrela, pendência/ampulheta, nota/pena.

### Estados completos da interface

| Estado | Trilho | Página principal | Ação dominante |
| --- | --- | --- | --- |
| Primeira visita | Ilustração/estado vazio | Explicação curta e exemplo de uso | `Criar primeiro registro` |
| Coleção preenchida | Primeiro item válido selecionado | Registro selecionado | `Novo registro` |
| Busca sem resultado | Mensagem contextual e filtros ativos | Mantém último registro ou instrução neutra | `Limpar filtros` |
| Carregando/importando ficha | Não há spinner assíncrono próprio; render é local | Preservar shell estável | Nenhuma |
| Captura aberta | Lista continua visível | Composer ocupa faixa superior | `Registrar` |
| Edição | Trilho permanece, sem mutação | Dialog/editor com draft | `Salvar alterações` |
| Erro de validação | Não muda seleção | Campo inválido recebe foco e mensagem próxima | Corrigir e salvar |
| Exclusão | Item permanece até confirmar | Dialog compacto informa título afetado | `Excluir registro` |
| Registro removido | Seleciona próximo, anterior ou vazio | Destino determinístico | `Novo registro` se vazio |

Não há skeleton: todos os dados são locais e síncronos. Introduzi-lo seria ruído visual e complexidade falsa.

### Responsividade

#### Desktop amplo — 1400 px ou mais

- Cabeçalho e captura rápida ocupam a largura total.
- Workspace em duas colunas: trilho `clamp(280px, 24vw, 340px)` + página `minmax(0, 1fr)`.
- Apenas o trilho pode ter scroll interno quando a ficha usa altura travada; a página segue a política de scroll já adotada pela view.
- Página de leitura centraliza o bloco tipográfico sem criar uma terceira coluna vazia.

#### Desktop baixo — 1100–1399 px ou pouca altura

- Mantém duas colunas, mas a própria página/documento passa a rolar conforme o shell existente.
- Captura rápida não deve consumir mais de 160 px quando expandida.
- Metadados podem quebrar em duas linhas; ações não sobrepõem título.

#### Tablet rail — 900–1099 px

- Duas colunas com trilho de 240–280 px.
- Filtros viram uma linha rolável horizontalmente somente dentro da barra, com gradiente de continuidade; a página inteira não cria overflow.
- Excertos do trilho podem cair para uma linha.

#### Tablet portrait e mobile — até 899 px

- Uma coluna.
- Cabeçalho, CTA e captura rápida aparecem antes da lista.
- Ao selecionar um registro, a página de leitura entra após as ferramentas e antes da lista completa, evitando rolar por dezenas de cards para ler.
- Uma ação `Voltar aos registros` posiciona o foco novamente no card selecionado.
- Editor usa dialog quase full-screen com margem segura de 8–12 px, cabeçalho e ações sticky; não usar drawer lateral.
- Barra inferior da ficha não pode cobrir `Salvar`, `Cancelar` ou o último parágrafo; respeitar `env(safe-area-inset-bottom)`.

### Editor completo

O editor é um dialog nativo e não edição inline. Isso evita saltos de layout e preserva um draft cancelável.

Ordem dos campos:

1. tipo — radio cards compactos ou select nativo estilizado em mobile;
2. título — obrigatório;
3. relato — textarea principal;
4. sessão e data do mundo — lado a lado no desktop, empilhados no mobile;
5. marcadores — entrada simples separada por Enter/vírgula, com remoção por botão nomeado;
6. fixado — checkbox explícito.

Comportamento:

- foco inicial no título ao criar e no título existente ao editar;
- `Escape` equivale a cancelar e nunca persiste draft;
- ao tentar fechar com mudanças, o dialog permanece aberto e mostra confirmação interna `Descartar alterações?`;
- erro aparece junto do campo, atualiza `aria-invalid` e é resumido em região `role="alert"`;
- footer sticky contém `Cancelar` e ação primária; nunca inverter ordem entre breakpoints;
- salvar preserva `id` e `criadoEm`, atualiza `atualizadoEm` e retorna foco ao card correspondente.

### Motion e feedback

- entrada da view: header 220 ms, trilho 260 ms e página 300 ms, com atraso máximo de 60 ms;
- novo card: `opacity + translateY(6px)` por até 240 ms;
- seleção: transição de borda/fundo por até 160 ms, sem mover layout;
- confirmação de salvamento: pequeno traço dourado ou selo que desaparece em até 520 ms;
- nenhuma animação em loop, parallax, tilt ou partículas;
- em `prefers-reduced-motion: reduce`, usar somente troca instantânea ou fade funcional de até 70 ms.

### Acessibilidade e teclado

- heading da view recebe foco ao navegar para Registro;
- ordem: cabeçalho/CTA → captura → busca/filtros → trilho → página/a ações;
- `/` foca a busca apenas quando o foco não está em input, textarea, select ou dialog;
- cards usam ativação nativa por Enter/Espaço;
- `aria-current="true"` identifica seleção no trilho;
- resultados anunciam `N registros encontrados` em região live discreta;
- ícones decorativos usam `aria-hidden="true"`;
- foco nunca é enviado para elemento oculto após filtro ou exclusão;
- contraste alvo WCAG AA para texto e controles; dourado claro não pode ser cor exclusiva de texto pequeno;
- zoom a 200% deve manter leitura e ações sem sobreposição em 1280×720.

### Conteúdo e microcopy

- Estado vazio: `A jornada ainda não foi registrada.`
- Apoio: `Anote acontecimentos, pistas e promessas para retomar quando precisar.`
- Busca: `Buscar na jornada...`
- Captura: `O que aconteceu?`
- Sem resultado: `Nenhum registro corresponde a estes filtros.`
- Confirmação de exclusão: `Excluir “<título>”? Esta ação remove o registro da ficha exportada.`
- Evitar “CRUD”, “item”, “objeto” e mensagens técnicas na interface.

### Critérios front-end não negociáveis

- nenhum overflow horizontal nos cinco viewports de baseline;
- nenhum texto essencial truncado sem forma de acesso ao conteúdo completo;
- nenhuma ação somente em hover;
- nenhum estado comunicado apenas por cor;
- nenhum HTML vindo do conteúdo do usuário;
- nenhum `innerHTML`/handler inline na view;
- somente um scroll principal no mobile;
- no desktop de altura travada, no máximo trilho + página podem ter scroll independente, e apenas se necessário;
- preservar conteúdo digitado em filtros, resize e troca de seleção enquanto o editor estiver aberto;
- renderizar 100 registros em menos de um frame perceptível no ambiente de teste, sem animação aplicada a todos de uma vez.

### Mapa de componentes e responsabilidade

```text
#sheet-journal-view                         região/tema da feature
  .journal-page                            shell visual
    .journal-header                        título, descrição, contador, CTA
    .journal-quick-capture                 composer transitório
    .journal-toolbar                       busca e filtros
    .journal-workspace                     composição responsiva
      .journal-timeline                    acervo e grupos
        .journal-entry-card                botão de seleção
      .journal-reader                      página selecionada
        .journal-reader__header
        .journal-reader__content
        .journal-reader__tags

#journal-editor-dialog                     criação/edição completa
#journal-delete-dialog                     confirmação destrutiva
#journal-live-status                       anúncios não visuais
```

Responsabilidades:

- `journal.css`: aparência, layout e breakpoints de todos os seletores `.journal-*`.
- `css/motion/journal.css`: somente estados transitórios/animações da feature.
- `journal-view.js`: criação segura do DOM de lista, grupos, leitura e estados vazios.
- `journal-controller.js`: drafts, seleção, filtros, foco, dialogs, mutações e persistência.
- `journal.js`: schema, validação, busca, agrupamento e ordenação puros.
- `ui-state.js`: estado transitório serializável; nenhum nó DOM armazenado, exceto destino efêmero de retorno de foco se o padrão atual exigir.

Contrato de renderização proposto:

```js
GrimorioJournalView.render(root, {
  entries,
  selectedId,
  query,
  typeFilter,
  pinnedOnly,
  totalCount
}, {
  onSelect,
  onEdit,
  onTogglePinned,
  onDelete
});
```

A view emite intenção e não altera `personagem`. O controller normaliza a coleção uma vez por mutação e fornece um view model já filtrado/ordenado. Listeners delegados no root evitam recriar centenas de closures a cada render.

## Fora do MVP

- editor rich text ou Markdown;
- colaboração online, contas ou sincronização em nuvem;
- comentários do mestre;
- anexos e imagens;
- calendário completo de Meridian;
- grafo automático de pessoas/lugares;
- cópia persistente de dados de inventário ou habilidades.

---

## Chunk 1: Contrato persistente

### Task 1: Domínio puro dos registros

**Files:**
- Create: `js/domain/journal.js`
- Create: `tests/domain/journal-domain.test.js`
- Modify: `index.html`
- Modify: `tools/audit-js-architecture.mjs`

- [ ] Escrever testes para normalização do schema, limites, tipos válidos e defaults.
- [ ] Cobrir título obrigatório (1–120), conteúdo opcional (até 20.000), data/sessão (até 100), no máximo 10 marcadores únicos de 30 caracteres e timestamps ISO válidos.
- [ ] Cobrir preservação do primeiro ID válido, regeneração de ID ausente/duplicado e ordenação por `fixado`, depois `atualizadoEm` decrescente.
- [ ] Executar `node --test --test-isolation=none tests/domain/journal-domain.test.js` e confirmar falha pela ausência do domínio.
- [ ] Implementar `GrimorioJournalDomain` sem DOM ou persistência, expondo limites, normalização de item/coleção, criação de ID e ordenação.
- [ ] Carregar `journal.js` antes de state/controllers e registrá-lo como arquivo canônico na auditoria JS.
- [ ] Reexecutar o teste focado e `npm run check:js`; esperar sucesso.
- [ ] Commitar com `git add js/domain/journal.js tests/domain/journal-domain.test.js index.html tools/audit-js-architecture.mjs && git commit -m "feat: add campaign journal domain"`.

### Task 2: Ficha v2 e retrocompatibilidade

**Files:**
- Modify: `js/state/character-state.js`
- Modify: `js/controllers/sheet-controller.js`
- Modify: `tests/domain/import-export-domain.test.js`
- Modify: `tests/e2e/creation.spec.js`

- [ ] Adicionar um teste que importe ficha v2 antiga sem `registros` e espere `personagem.registros === []`.
- [ ] Adicionar round-trip de ficha contendo registros e confirmar igualdade de conteúdo e IDs após exportar/reimportar.
- [ ] Executar os testes e confirmar as falhas esperadas.
- [ ] Adicionar `registros: []` ao modelo canônico e normalizar a coleção importada pelo domínio.
- [ ] Preservar `versao: 2`; ausência significa coleção vazia, coleção presente inválida produz erro compreensível sem mutação parcial.
- [ ] Executar `npm run test:domain` e o E2E focado de import/export; esperar sucesso.
- [ ] Commitar com `git add js/state/character-state.js js/controllers/sheet-controller.js tests/domain/import-export-domain.test.js tests/e2e/creation.spec.js && git commit -m "feat: persist campaign journal entries"`.

---

## Chunk 2: Leitura e captura rápida

### Task 3: Estrutura visual responsiva

**Files:**
- Modify: `index.html`
- Modify: `css/app.css`
- Create: `css/features/journal.css`
- Create: `css/motion/journal.css`
- Modify: `js/controllers/abilities-controller.js`
- Modify: `tests/contracts/sheet-contracts.spec.js`
- Create: `tests/e2e/journal.spec.js`

- [ ] Escrever contrato para tornar `data-sheet-section="journal"` funcional e exigir `data-sheet-view="journal"`, heading focável, landmark correto, `aria-live` e CTAs acessíveis.
- [ ] Escrever E2E da composição nos cinco baselines: 1440×900, 1280×720, 1024×768, 768×1024 e 390×844.
- [ ] No E2E, medir trilho entre 280–340 px no desktop amplo, 240–280 px no tablet rail e uma coluna até 899 px; afirmar `scrollWidth === clientWidth` em todos.
- [ ] Cobrir ordem visual/DOM no mobile: header → captura → toolbar → reader selecionado → timeline, com barra inferior sem cobrir a última ação.
- [ ] Executar os testes e confirmar falha porque Registro ainda é seção futura.
- [ ] Mover “Registro” para o grupo funcional da navegação, mantendo “Combate” e “Companheiros” como futuros.
- [ ] Criar exatamente as regiões e IDs do mapa de componentes, com títulos, labels e microcopy definidos nesta spec.
- [ ] Implementar desktop em duas colunas, tablet rail em duas colunas compactas e mobile em uma coluna com reader antes da lista completa.
- [ ] Reutilizar apenas tokens semânticos existentes e papéis `--sheet-*`; não introduzir hex/rgb na feature salvo exceção documentada.
- [ ] Garantir corpo ≥16 px, metadados ≥11 px, touch targets ≥44 px, linha de leitura de aproximadamente 75 caracteres e foco visível em todos os controles.
- [ ] Adicionar `journal.css` e `motion/journal.css` aos layers canônicos; respeitar reduced motion.
- [ ] Incluir `journal` na whitelist de navegação e focar `#sheet-journal-view-heading` ao ativar.
- [ ] Executar auditorias de DOM/CSS/keyframes e o E2E responsivo; inspecionar screenshot temporária dos cinco viewports antes de aceitar a composição.
- [ ] Commitar com `git add index.html css/app.css css/features/journal.css css/motion/journal.css js/controllers/abilities-controller.js tests/contracts/sheet-contracts.spec.js tests/e2e/journal.spec.js && git commit -m "feat: add campaign journal workspace"`.

### Task 4: View segura e estados da coleção

**Files:**
- Create: `js/ui/journal-view.js`
- Modify: `index.html`
- Modify: `js/ui/dom-bindings.js`
- Create: `tests/domain/journal-view-contract.test.js`
- Modify: `tests/e2e/journal.spec.js`

- [ ] Escrever contrato que proíba `innerHTML`, `insertAdjacentHTML` e handlers inline na nova view.
- [ ] Cobrir os oito estados da matriz: primeira visita, preenchido, busca vazia, captura, edição, validação, exclusão e destino após remoção.
- [ ] Cobrir cards por tipo com ícone + texto, título/excerto/data/sessão, indicação “Fixado”, `aria-current` e seleção por clique/teclado.
- [ ] Cobrir agrupamento por sessão e grupo “Notas avulsas”, sem accordion ou estado persistente adicional.
- [ ] Cobrir reader com parágrafos seguros, conteúdo vazio explícito, marcadores e menu de ações acessível sem depender de hover.
- [ ] Implementar `GrimorioJournalView.render(root, model, callbacks)` somente com `createElement`, `textContent` e atributos seguros.
- [ ] Usar delegação de eventos no root; garantir nomes como `Abrir registro <título>` e estado sem resultados distinto de coleção vazia.
- [ ] Registrar os bindings sem colocar regras de negócio na view.
- [ ] Executar contratos, teste de view e E2E com 100 registros; esperar sucesso sem handlers duplicados ou animação aplicada em massa.
- [ ] Commitar com `git add js/ui/journal-view.js index.html js/ui/dom-bindings.js tests/domain/journal-view-contract.test.js tests/e2e/journal.spec.js && git commit -m "feat: render campaign journal timeline"`.

### Task 5: Captura rápida

**Files:**
- Create: `js/controllers/journal-controller.js`
- Modify: `js/state/ui-state.js`
- Modify: `js/app.js`
- Modify: `tools/audit-js-architecture.mjs`
- Modify: `tests/e2e/journal.spec.js`

- [ ] Escrever E2E dos estados recolhido → focado → expandido → salvo, com `Ctrl+Enter`/`Cmd+Enter`, novo card selecionado e ficha marcada como alterada.
- [ ] Cobrir título vazio, limites, cancelar/limpar, Escape com draft vazio e Escape com draft preenchido sem descarte silencioso.
- [ ] Afirmar que sessão/data/marcadores não aparecem na captura rápida e que o tipo default é `nota`.
- [ ] Executar o E2E e confirmar falha pela ausência do controller.
- [ ] Criar estado transitório com `selectedId`, filtros, query, draft e destino de retorno de foco.
- [ ] Implementar controller para validar via domínio, gerar ID/timestamps apenas no save, mutar `personagem.registros`, re-renderizar e anunciar `Registro adicionado à jornada.` em `aria-live`.
- [ ] Após salvar, focar o heading do reader; após cancelar, retornar foco ao acionador sem mover o scroll inesperadamente.
- [ ] Conectar apenas listeners no `js/app.js` e registrar o controller na auditoria JS.
- [ ] Executar `npm run check:js` e E2E focado; esperar sucesso.
- [ ] Commitar com `git add js/controllers/journal-controller.js js/state/ui-state.js js/app.js tools/audit-js-architecture.mjs tests/e2e/journal.spec.js && git commit -m "feat: capture quick journal notes"`.

---

## Chunk 3: Gestão completa

### Task 6: Criar, editar, fixar e excluir

**Files:**
- Modify: `index.html`
- Modify: `js/controllers/journal-controller.js`
- Modify: `js/ui/dom-bindings.js`
- Modify: `js/app.js`
- Modify: `css/features/journal.css`
- Modify: `css/motion/journal.css`
- Modify: `tests/e2e/journal.spec.js`

- [ ] Escrever E2E do dialog na ordem especificada: tipo, título, relato, sessão/data, marcadores e fixado; footer permanece visível em 390×844.
- [ ] Cobrir foco inicial, cancelar/Escape sem mutação, confirmação interna de descarte, retorno de foco, manter ID/criadoEm e atualizar apenas `atualizadoEm`.
- [ ] Cobrir erro próximo ao campo, `aria-invalid`, `aria-describedby`, resumo `role="alert"` e foco no primeiro inválido.
- [ ] Cobrir fixar/desfixar e ordenação determinística.
- [ ] Cobrir exclusão confirmada com título interpolado, cancelamento e foco no próximo card, anterior ou CTA vazio.
- [ ] Implementar dialogs nativos com `aria-labelledby`, erros com `aria-invalid`/`aria-describedby` e status em `aria-live`.
- [ ] Manter o draft fora de `personagem` até o usuário salvar.
- [ ] Em mobile, implementar editor quase full-screen com ações sticky e safe area; em desktop, largura máxima legível sem cobrir a view inteira.
- [ ] Executar auditorias e E2E completo de gestão; “CRUD” não deve aparecer em nenhuma microcopy.
- [ ] Commitar com `git add index.html js/controllers/journal-controller.js js/ui/dom-bindings.js js/app.js css/features/journal.css css/motion/journal.css tests/e2e/journal.spec.js && git commit -m "feat: manage campaign journal entries"`.

### Task 7: Busca, filtros e teclado

**Files:**
- Modify: `js/domain/journal.js`
- Modify: `js/controllers/journal-controller.js`
- Modify: `js/ui/journal-view.js`
- Modify: `tests/domain/journal-domain.test.js`
- Modify: `tests/e2e/journal.spec.js`

- [ ] Escrever testes de busca por título/conteúdo/sessão/marcadores, ignorando acentos e caixa.
- [ ] Cobrir combinação de query + tipo + somente fixados e reset dos filtros.
- [ ] Cobrir navegação por Tab, ativação nativa dos cards e atalho `/` para focar busca somente fora de campos editáveis.
- [ ] Implementar seletores puros no domínio e coordenação de filtros no controller.
- [ ] Confirmar que filtros nunca alteram a coleção persistente e que seleção possui fallback previsível.
- [ ] Executar testes de domínio e E2E; esperar sucesso.
- [ ] Commitar com `git add js/domain/journal.js js/controllers/journal-controller.js js/ui/journal-view.js tests/domain/journal-domain.test.js tests/e2e/journal.spec.js && git commit -m "feat: search and filter campaign journal"`.

---

## Chunk 4: Qualidade integrada

### Task 8: Visual, acessibilidade e documentação

**Files:**
- Modify: `tests/visual/sheet-views.spec.js`
- Create: `tests/visual/sheet-views.spec.js-snapshots/*-journal-win32.png`
- Modify: `docs/architecture.md`
- Modify: `docs/consolidation-baseline-report.md`

- [ ] Incluir `journal` no loop visual e gerar somente os cinco snapshots ausentes.
- [ ] Inspecionar desktop amplo/baixo, tablet rail/retrato e mobile, comparando hierarquia, densidade, linha de leitura, alinhamentos, safe area e ausência de grande vazio artificial; não atualizar snapshots antigos.
- [ ] Capturar também estados temporários para revisão humana: vazio, captura expandida, registro longo, busca sem resultado, editor desktop e editor mobile.
- [ ] Testar reduced motion, foco visível, labels, anúncios, Escape, retorno de foco, contraste AA e ausência de estado comunicado apenas por cor.
- [ ] Testar zoom 200% em 1280×720 e teclado completo sem ação inacessível ou sobreposição.
- [ ] Testar 100+ registros, relato de 20.000 caracteres e 10 marcadores sem overflow horizontal, travamento ou animação em cascata sobre toda a coleção.
- [ ] Afirmar no E2E: título da view focado na entrada, card selecionado com `aria-current`, ações disponíveis sem hover, um único scroll principal no mobile e no máximo dois scrolls necessários no desktop travado.
- [ ] Atualizar a arquitetura com `journal.js`, `journal-view.js`, `journal-controller.js` e `personagem.registros`.
- [ ] Executar separadamente `npm run check:contracts`, `npm run check:css`, `npm run check:keyframes`, `npm run check:js` e `npm run test:domain`.
- [ ] Executar `npx playwright test tests/contracts tests/e2e` e depois `npx playwright test tests/visual/sheet-views.spec.js` sem update.
- [ ] Executar `git diff --check`, revisar `git status --short` e confirmar que `espada-longa.json` e o plano de vínculos não foram alterados.
- [ ] Commitar com `git add tests/visual docs/architecture.md docs/consolidation-baseline-report.md && git commit -m "test: verify campaign journal integration"`.

## Evolução recomendada após o MVP

Somente depois do Registro estar estável:

1. permitir associar uma entrada a IDs de `personagem.vinculos`;
2. transformar `pendencia` em concluída/reaberta, sem criar um gerenciador de tarefas completo;
3. exportar uma entrada individual como JSON compartilhável;
4. agrupar visualmente entradas pela mesma `sessao`;
5. gerar um resumo manual de sessão a partir das notas selecionadas — sem IA obrigatória e sem rede.
