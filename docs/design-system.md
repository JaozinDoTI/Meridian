# Design System do Meridian

Este documento é a referência para qualquer interface nova do Meridian. A identidade permanece editorial: superfícies de papel, vinho como ação e seleção, dourado como metal/foco, Georgia para conteúdo narrativo e Inter/system-ui para controles e metadados.

## Autoridade e ordem de decisão

```text
css/tokens.css → css/foundations.css → css/components.css → features/layouts
```

- `tokens.css` é a única autoridade para valores reutilizáveis.
- `foundations.css` controla herança, tipografia semântica, foco e disabled.
- `components.css` implementa primitives como botão, campo, select, badge e painel.
- `features/` e `layouts/` compõem essas primitives. Valores locais só são aceitos quando representam geometria própria, arte, densidade ou responsividade que não possa ser expressa por um token existente.
- Antes de criar um token, procure um token semântico existente. Não crie aliases específicos de uma única tela.

## Tipografia

Famílias:

- `--font-editorial`: Georgia/Times. Títulos, texto narrativo, conteúdo de campos e valores.
- `--font-interface`: Inter/system-ui. Botões, selects, labels, captions, badges e metadados operacionais.

Pesos permitidos:

| Papel | Token | Valor |
|---|---|---:|
| Regular | `--font-weight-regular` | 400 |
| Medium | `--font-weight-medium` | 500 |
| Semibold | `--font-weight-semibold` | 600 |
| Bold | `--font-weight-bold` | 700 |
| Extra bold | `--font-weight-extrabold` | 800 |

Escala semântica:

| Papel | Token | Uso |
|---|---|---|
| Display | `--text-display` | Landing e chamadas editoriais únicas |
| Page title | `--text-page-title` | Título principal de uma view |
| Section title | `--text-section-title` | Título de dialog ou grande seção |
| Heading | `--text-heading` | Card, painel ou subseção |
| Body grande | `--text-body-lg` | Leitura narrativa longa |
| Body | `--text-body` | Texto e valores de campos |
| Controle | `--text-control` | Botões e selects padrão |
| Controle pequeno | `--text-control-sm` | Ação compacta justificada |
| Label | `--text-label` | Rótulo curto e overline |
| Caption | `--text-caption` | Metadado, badge e ajuda curta |
| KPI | `--text-kpi` | Números com destaque |

Line-heights devem vir de `--line-height-display`, `--line-height-title`, `--line-height-heading`, `--line-height-body`, `--line-height-control`, `--line-height-label` e `--line-height-caption`.

As classes `.ui-display`, `.ui-page-title`, `.ui-section-title`, `.ui-heading`, `.ui-body`, `.ui-label`, `.ui-caption` e `.ui-kpi` são a implementação pronta dessa hierarquia. `--text-title` existe apenas como alias compatível de `--text-page-title`.

## Espaçamento

| Token | Valor | Uso típico |
|---|---:|---|
| `--space-1` | 4 px | Ajustes internos mínimos |
| `--space-2` | 8 px | Gap entre ícone e texto; controles compactos |
| `--space-3` | 12 px | Padding de controle e gaps locais |
| `--space-4` | 16 px | Padding padrão de container |
| `--space-5` | 24 px | Separação entre grupos |
| `--space-6` | 32 px | Separação entre seções |
| `--space-7` | 48 px | Ritmo editorial amplo |

Em controles, use `--control-gap`, `--control-padding-x-sm`, `--control-padding-x` e `--control-padding-x-lg`. Valores intermediários só devem permanecer em geometria já calibrada, nunca em um novo botão ou campo.

## Controles

| Tier | Token | Uso |
|---|---:|---|
| Compacto | `--control-height-compact` — 28 px | Stepper ou tab em área muito densa |
| Pequeno | `--control-height-sm` — 32 px | Menu, toolbar secundária e ação auxiliar |
| Padrão | `--control-height` — 40 px | Botão, input e select normais |
| Touch | `--control-height-touch` — 44 px | Mobile e ação que exige alvo confortável |
| Proeminente | `--control-height-prominent` — 48 px | Ação cerimonial única, como reveal de item |

Todos os controles da mesma linha e mesma importância usam o mesmo tier. O padrão também inclui `--control-radius`, `--control-border` e `--control-gap`. Compartilhar geometria não significa clonar hierarquia: botões usam `--button-font-*`, enquanto selects usam `--select-font-*` para manter a leitura mais leve.

### Botões

- `.ui-button`: ação primária padrão.
- `.ui-button--secondary`: superfície clara e borda; ação alternativa.
- `.ui-button--ghost`: ação terciária sem caixa permanente.
- `.ui-button--danger`: ação destrutiva.
- `.ui-button--compact`: somente quando o container é realmente denso.
- `.ui-button--icon`: botão quadrado; combine com `--compact` quando necessário.

`.sheet-primary-action` é a primitive compacta da ficha e deve ser elevada a `--control-height` ou `--control-height-touch` pela feature quando representar a ação principal da página.

### Inputs, selects e filtros

- `.ui-field-control`: input ou textarea de conteúdo.
- `.ui-select`: dropdown padrão, com o mesmo tier, borda e radius de um botão equivalente, mas texto medium e indicador próprio. O popup de opções permanece nativo para preservar teclado, leitor de tela e comportamento da plataforma.
- Inputs usam a fonte editorial para o valor; selects usam a fonte de interface porque representam escolha operacional.
- Busca com ícone deve usar `--icon-size-sm`, `--control-gap` e padding derivado dos tokens.
- Em mobile, filtros acionáveis usam `--control-height-touch`.

## Radius, bordas e superfícies

| Token | Valor | Uso |
|---|---:|---|
| `--radius-sm` | 3 px | Detalhe muito compacto, não controles novos |
| `--radius-md` / `--control-radius` | 5 px | Controles e painéis compactos |
| `--radius-lg` | 10 px | Cards e containers |
| `--radius-xl` | 16 px | Shells e páginas destacadas |
| `999px` | — | Apenas pill/badge |
| `50%` | — | Apenas círculo real |

Use `--border-subtle` para divisores e `--border-default`/`--control-border` para limites interativos.

## Ícones

| Token | Valor | Uso |
|---|---:|---|
| `--icon-size-xs` | 12 px | Stepper e metadado |
| `--icon-size-sm` | 16 px | Controle padrão |
| `--icon-size-md` | 20 px | Navegação e icon-only |
| `--icon-size-lg` | 24 px | Título de página e destaque |

Ícones não devem definir o tamanho do botão. O container escolhe o tier de controle e o SVG escolhe um token de ícone.

## Cores semânticas

- Texto: `--color-text`, `--color-text-muted`.
- Superfície: `--color-canvas`, `--color-surface`, `--color-surface-soft`.
- Ação: `--color-primary`, `--color-primary-dark`, `--color-on-primary`.
- Metal/foco: `--color-metal`, `--color-metal-highlight`.
- Feedback: `--color-danger`, `--color-warning`, `--color-success`, `--color-info`.

As variáveis `--sheet-*`, `--journal-*`, `--history-*` e `--inventory-*` podem adaptar o tema, mas componentes reutilizáveis devem consumir primeiro o papel semântico.

## Estados interativos

- Hover: `--state-hover-surface`; pode elevar em 1 px quando a ação é um botão, nunca quando é campo.
- Pressed/active: `--state-pressed-surface` e deslocamento para baixo de 1 px em botões.
- Selected: `--state-selected-surface`, borda primária e atributo semântico (`aria-pressed`, `aria-selected` ou `aria-current`).
- Focus-visible: `--focus-ring` e `--focus-ring-offset`. Não remover outline sem substituição equivalente.
- Disabled: `--state-disabled-opacity`, cursor `not-allowed` e ausência de hover/active.
- Erro: borda/texto `--color-danger` e descrição associada; cor nunca deve ser o único indicador.

## Exemplo

```html
<label class="ui-label" for="filter">Situação</label>
<select id="filter" class="ui-select">
  <option>Todas</option>
</select>

<button class="ui-button" type="button">
  <svg class="sheet-icon" aria-hidden="true">...</svg>
  Salvar
</button>
```

```css
.feature-toolbar {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

@media (max-width: 720px) {
  .feature-toolbar .ui-button,
  .feature-toolbar .ui-select {
    min-height: var(--control-height-touch);
  }
}
```

## Exceções intencionais

- Cards de espécie, classe, habilidade e inventário são superfícies de seleção, não botões convencionais; mantêm geometria própria, mas usam foco/selected semânticos.
- Navegação inferior móvel mantém 52 px para acomodar ícone, label e safe area.
- Reveal do inventário mantém 48 px porque é uma ação proeminente e isolada.
- Tamanhos de arte, selos, retratos, grids e ornamentos não são tokens de controle.
- A topbar ajusta o título responsivamente para caber em viewports baixos; essa exceção pertence ao chrome, não à escala de componentes.

Execute `npm run check:design-system` ao criar ou alterar controles canônicos.
