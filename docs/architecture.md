# Arquitetura do Meridian

## Direção das dependências

```text
domain -> state -> ui -> motion/app
```

- `domain`: regras puras, schemas, validação e cálculos. Nunca acessa DOM.
- `state`: fonte de verdade persistente e estados transitórios. Não renderiza.
- `ui`: constrói e atualiza DOM a partir do estado. Não redefine regras.
- `motion`: executa transições visuais a partir de elementos e geometria já validados.
- `app`: inicializa dependências e conecta eventos.

## Estratégia incremental

Os arquivos legados continuam carregados através de `css/app.css` e mantêm sua ordem original. Novas responsabilidades são extraídas somente quando existe uma fronteira clara. Mover código de arquivo não autoriza alterar comportamento.

O projeto continua sem framework. APIs extraídas usam namespaces `window.Grimorio*` pequenos e documentados enquanto o carregamento clássico for mantido.

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
