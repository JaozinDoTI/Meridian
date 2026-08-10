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

## Contrato de segurança

Durante uma migração visual, permanecem invariantes:

- JSON exportado/importado;
- schemas e normalização;
- regras de personagem, habilidades e inventário;
- propriedade e unicidade dos itens;
- persistência;
- acessibilidade por teclado;
- reduced motion.

Uma alteração funcional deve ser planejada separadamente de uma extração arquitetural.
