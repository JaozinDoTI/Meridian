# Baseline da consolidação sem regressões

Data do registro: 2026-08-10

## Ponto de restauração

- Commit anterior à consolidação: `cb04c66` (`chore: checkpoint visual architecture before consolidation`).
- Branch de trabalho: `chore/consolidation-no-regressions`.
- A execução ocorre em worktree isolada; a branch de origem `feature/attribute-seals` permanece preservada.

## Ambiente de verificação

- Node.js portátil: 24.18.0.
- npm: 11.16.0.
- Playwright: 1.62.1.
- Chromium usado pelo Playwright: Chrome for Testing 151.0.7922.34 (Chromium v1234).
- O ambiente isolado não permite comunicação HTTP entre os processos locais. Por isso, os testes de navegador abrem `index.html` por `file://` e interceptam exclusivamente o CDN de Motion. O servidor estático continua disponível para ambientes normais.

## Contratos congelados

- Auditoria DOM: 327 IDs, 260 consultas de DOM (4 dinâmicas) e 8 scripts.
- Inventário: testes de rotação, colisão e migração de schema V2.
- Fluxos funcionais: navegação global, menu móvel, Habilidades e Inventário.
- Estados responsivos: desktop amplo, desktop baixo, tablet com rail, tablet retrato e celular.
- Vistas visuais por estado: Resumo, Habilidades e Inventário.

## Resultado inicial

- 3 testes de domínio aprovados.
- 6 testes funcionais/contratuais aprovados.
- 15 snapshots visuais registrados.
- Auditoria de ownership CSS: 14 arquivos, 1.853 seletores e 82 sobreposições entre arquivos.

A contagem de sobreposições é um indicador de dívida técnica, não uma aprovação arquitetural. Ela deve cair ao longo da consolidação e não pode aumentar sem justificativa registrada.

## Problemas preexistentes observados

Os itens abaixo pertencem ao baseline e não devem ser corrigidos incidentalmente em commits de consolidação:

1. A tabela de perícias rápidas do Resumo exibe `NaN` na coluna “Bônus” em algumas perícias treinadas.
2. Capturas `fullPage` em celular e tablet registram uma área bege vazia alta abaixo do conteúdo visível.
3. A navegação inferior móvel ocupa sua posição fixa sobre a área visível do conteúdo.
4. No Inventário desktop, a arte e os detalhes de itens equipados ficam visualmente compactados dentro do slot.
5. A ativação da carta da Bancada pelo teclado anuncia o modo de posicionamento, mas a camada de células continua renderizada com `span`; por isso `Enter`, setas e `Escape` não alcançam o listener que exige `button[data-x][data-y]`.

Cada correção funcional ou visual desses pontos deve ser tratada separadamente, com critério de aceite e baseline atualizado de forma explícita.

## Política dos gates

Após cada fase, devem ser executados:

1. auditoria dos contratos DOM;
2. testes de domínio;
3. testes funcionais do navegador;
4. comparação dos 15 snapshots, sem atualização automática;
5. auditoria de ownership CSS;
6. `git diff --check`.

Qualquer falha interrompe a fase. Snapshots só podem ser atualizados quando a mudança visual for intencional, aprovada e documentada.
