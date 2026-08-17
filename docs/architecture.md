# Arquitetura do Meridian

## Direção das dependências

```text
domain -> state -> controllers -> ui/motion -> app
```

- `domain`: regras puras, schemas, validação e cálculos. Nunca acessa DOM.
- `state`: fonte de verdade persistente e estados transitórios. Não renderiza.
- `controllers`: coordena domínio, estado, persistência e eventos da interface.
- `ui`: constrói e atualiza DOM a partir do estado. Não redefine regras.
- `motion`: executa transições visuais a partir de elementos e geometria já validados.
- `app`: contém somente listeners e bootstrap do carregamento clássico.

## Estado consolidado

`css/app.css` é o único entrypoint de estilos. Não existem CSS ou JavaScript de aplicação na raiz, layer `legacy` ou implementações paralelas de compatibilidade. Landing, criação, ficha, habilidades, inventário e movimento possuem autoridades próprias sob `css/` e `js/`.

O projeto continua sem framework. Domínios extraídos usam namespaces `window.Grimorio*` pequenos e congelados enquanto o carregamento clássico for mantido. A ordem dos scripts em `index.html` explicita as dependências: motion e domínio, estado, views, controllers e bootstrap.

## Design system

O CSS segue a direção `tokens → foundations → components → features/layouts`. `css/tokens.css` é a autoridade de tipografia, spacing, controles, radius, ícones, cores, movimento e estados; `css/foundations.css` aplica herança e acessibilidade; `css/components.css` expõe primitives reutilizáveis. Features podem compor e tematizar essas primitives, mas não devem criar uma segunda escala local para controles equivalentes.

A referência de uso está em `docs/design-system.md`. O comando `npm run check:design-system` mantém um inventário técnico e falha quando componentes canônicos deixam de consumir os tokens acordados.

## Registro de Jornada

`personagem.registros` é a fonte persistente da crônica de campanha e permanece fora de `origem.historia` e `vinculos`. Fichas v2 antigas sem o campo recebem uma coleção vazia durante a preparação inicial, sem mudança da versão do envelope.

- `js/domain/journal.js`: schema, limites, normalização, IDs, busca, ordenação e agrupamento puros;
- `js/state/ui-state.js`: seleção, filtros e draft transitórios;
- `js/ui/journal-view.js`: timeline, reader e estados vazios com construção segura de DOM;
- `js/controllers/journal-controller.js`: captura rápida, editor, foco, filtros e mutações persistentes;
- `css/features/journal.css`: composição e responsividade;
- `css/motion/journal.css`: entradas e feedbacks transitórios com reduced motion.

A view recebe um view model filtrado e callbacks de intenção. Ela não altera `personagem`; somente o controller normaliza e persiste a coleção.

## Contrato de segurança

Durante uma migração visual, permanecem invariantes:

- JSON exportado/importado;
- schemas e normalização;
- regras de personagem, habilidades e inventário;
- schema e IDs dos registros da jornada;
- propriedade e unicidade dos itens;
- persistência;
- acessibilidade por teclado;
- reduced motion.

Uma alteração funcional deve ser planejada separadamente de uma extração arquitetural.
