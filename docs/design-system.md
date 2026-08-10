# Design System do Meridian

## Cascata

`css/app.css` é o único entrypoint e declara a ordem:

```text
legacy -> tokens -> foundations -> components -> layouts -> themes -> motion -> overrides
```

Os layers legados reproduzem a ordem anterior dos links. Componentes novos consomem tokens canônicos; não escolhem cores, sombras ou tempos arbitrários.

## Tokens

- `--color-*`: papéis semânticos, nunca nomes de telas.
- `--space-*`: escala de espaçamento de 4px.
- `--radius-*`: raios compartilhados.
- `--elevation-*`: três níveis de profundidade.
- `--duration-*` e `--ease-*`: movimento funcional.
- `--text-*` e `--font-*`: papéis tipográficos.

Tokens antigos continuam válidos e alimentam aliases canônicos. Eles só serão removidos depois que nenhum consumidor depender deles.

## Primitivas

- `ui-surface`, `ui-panel`;
- `ui-section-heading`;
- `ui-button` e variantes;
- `ui-chip`, `ui-badge`;
- `ui-status`;
- `ui-empty-state`;
- roles `ui-display`, `ui-title`, `ui-heading`, `ui-label`, `ui-body`, `ui-caption`, `ui-value`.

Primitivas fornecem identidade compartilhada. Componentes de domínio, como `inventory-item-card` e `ability-card`, continuam responsáveis por estrutura e comportamento específicos.

## Temas

Temas sobrescrevem tokens semânticos via `data-theme`. Overlays e proxies fora da subárvore temática devem receber o mesmo atributo explicitamente.

## Acessibilidade

- Nunca comunicar estado apenas por cor.
- Preservar foco visível e navegação por teclado.
- Usar `--touch-target-min` para controles principais.
- Toda motion deve respeitar `prefers-reduced-motion`.

## Motion do inventário

O inventário usa `css/motion/inventory.css` para estados declarativos e `js/motion/inventory-motion.js` para viagens, FLIP e feedbacks imperativos. A linguagem é organizada em três respostas: levantar (`lift`), encaixar (`settle`) e resistir (`return`).

- interações comuns: até 240ms;
- reveal compacto: até 400ms;
- reveal cerimonial: até 550ms;
- acompanhamento do ponteiro: somente `requestAnimationFrame`;
- viagens: `transform`, `scale` e `opacity`, sem interpolação de largura/altura;
- reduced motion: fade funcional de 70ms, sem tilt, shake, partículas ou viagens.
