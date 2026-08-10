# Checkpoint — 2026-08-10

Branch: `feature/attribute-seals`

## Concluído

- consolidação CSS/JavaScript integrada à branch de trabalho;
- arquivos legados da raiz removidos e responsabilidades distribuídas entre `domain`, `state`, `controllers`, `ui` e `motion`;
- `css/app.css` mantido como único entrypoint, sem layer `legacy`;
- auditorias de DOM, ownership CSS, keyframes e arquitetura JavaScript adicionadas ao gate;
- último gate completo aprovado: 15 testes de domínio, 21 contratos/E2E e 15 snapshots da ficha em cinco viewports.

## Ponto exato da pausa

A captura enviada depois da integração mostrou uma regressão visual ainda não corrigida na Landing: em viewport baixo, o conteúdo fica cortado verticalmente, com o título truncado no topo e “Acesso do Mestre” fora da área útil.

Nenhuma hipótese foi aplicada ainda. O próximo passo é reproduzir o mesmo viewport, medir o container/overflow, criar um teste visual específico da Landing que falhe e só então corrigir a regra responsável. Os snapshots atuais cobrem Resumo, Habilidades e Inventário, mas não a Landing.
