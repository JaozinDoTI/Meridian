(function exposeGrimorioClassAbilitiesDomain(global) {
  "use strict";

  function congelarProfundamente(valor) {
    if (!valor || typeof valor !== "object" || Object.isFrozen(valor)) return valor;
    Object.values(valor).forEach(congelarProfundamente);
    return Object.freeze(valor);
  }

  const definicoesPorClasse = congelarProfundamente({
  "experimentalista": {
    "passiva": {
      "id": "metodo-experimental",
      "nome": "Método Experimental",
      "tipo": "passiva",
      "subtipo": "",
      "iconeId": "habilidade-generica",
      "descricao": "",
      "acao": "Sempre ativa",
      "atributo": "intelecto",
      "gatilho": "Sempre que o personagem tiver tempo para observar um fenômeno, criatura, objeto ou mecanismo antes de agir.",
      "teste": "Nenhum.",
      "custo": "Sem custo de Mana.",
      "custos": {
        "mana": 0,
        "pe": 0
      },
      "alcance": "Pessoal (observação)",
      "alvo": "Você",
      "dano": "",
      "duracao": "Cena",
      "efeitos": [
        "Após observar algo relevante, você pode formular uma hipótese curta e verificável. Quando ela for confirmada em jogo, você obtém uma Descoberta narrativa relacionada ao alvo. A primeira ação diretamente apoiada por essa Descoberta recebe um bônus de +1 no teste."
      ],
      "falha": "Nenhuma.",
      "usosTexto": "Livre; apenas uma hipótese ativa por alvo de cada vez.",
      "recargaTexto": "Nenhuma.",
      "requisitos": [],
      "limitacoes": [
        "Hipóteses precisam ser específicas e verificáveis. O bônus não se acumula e não substitui conhecimento que o personagem não poderia obter pela cena."
      ],
      "observacoes": ""
    },
    "iniciais": [
      {
        "id": "observacao-dirigida",
        "nome": "Observação Dirigida",
        "tipo": "tecnica",
        "subtipo": "",
        "iconeId": "habilidade-generica",
        "descricao": "",
        "acao": "Ação",
        "atributo": "intelecto",
        "gatilho": "Ter linha de visão ou acesso direto ao alvo por alguns segundos.",
        "teste": "Teste de Intelecto contra CD definida pela complexidade do alvo.",
        "custo": "Sem custo de Mana.",
        "custos": {
          "mana": 0,
          "pe": 0
        },
        "alcance": "6 metros",
        "alvo": "Uma criatura, objeto ou fenômeno",
        "dano": "",
        "duracao": "Instantânea",
        "efeitos": [
          "Em caso de sucesso, descubra uma característica útil e concreta: padrão de movimento, material, vulnerabilidade aparente, fonte de energia, mecanismo ou comportamento. A informação pode sustentar uma hipótese do Método Experimental."
        ],
        "falha": "A informação obtida é parcial, ambígua ou insuficiente para gerar vantagem mecânica.",
        "usosTexto": "1 por alvo por cena.",
        "recargaTexto": "Ao fim da cena.",
        "requisitos": [],
        "limitacoes": [
          "Não revela segredos impossíveis de observar, pensamentos, estatísticas exatas ou fraquezas que não tenham manifestação perceptível."
        ],
        "observacoes": ""
      },
      {
        "id": "aplicacao-improvisada",
        "nome": "Aplicação Improvisada",
        "tipo": "tecnica",
        "subtipo": "",
        "iconeId": "habilidade-generica",
        "descricao": "",
        "acao": "Ação",
        "atributo": "intelecto",
        "gatilho": "Possuir uma Descoberta relevante ou material de campo compatível com o problema.",
        "teste": "Teste de Intelecto contra CD definida pela complexidade da improvisação.",
        "custo": "1 ponto de Mana.",
        "custos": {
          "mana": 1,
          "pe": 0
        },
        "alcance": "Pessoal ou toque",
        "alvo": "Você, uma criatura ou um objeto",
        "dano": "",
        "duracao": "Cena ou até ser consumida",
        "efeitos": [
          "Crie uma solução temporária e específica: isolante, filtro, sensor simples, reforço, ferramenta ou neutralizante. Ela concede um bônus de +1 em um tipo de teste diretamente ligado ao problema ou remove uma penalidade menor causada pelo ambiente."
        ],
        "falha": "A solução funciona de forma incompleta: não concede bônus e se desfaz após a primeira tentativa.",
        "usosTexto": "Livre enquanto puder pagar o custo e tiver justificativa material.",
        "recargaTexto": "Nenhuma.",
        "requisitos": [],
        "limitacoes": [
          "Não cria tecnologia sofisticada, cura completa, armas permanentes ou efeitos que substituam habilidades especializadas de outras classes."
        ],
        "observacoes": ""
      },
      {
        "id": "falha-instrutiva",
        "nome": "Falha Instrutiva",
        "tipo": "reacao",
        "subtipo": "",
        "iconeId": "habilidade-generica",
        "descricao": "",
        "acao": "Reação",
        "atributo": "intelecto",
        "gatilho": "Falhar em um teste de Intelecto ligado a investigação, experimento, análise ou improvisação.",
        "teste": "Nenhum.",
        "custo": "Sem custo de Mana.",
        "custos": {
          "mana": 0,
          "pe": 0
        },
        "alcance": "Pessoal",
        "alvo": "Você",
        "dano": "",
        "duracao": "Instantânea",
        "efeitos": [
          "Transforme a falha em informação: o mestre revela um indício concreto sobre por que a abordagem falhou. Se ela causasse uma consequência técnica menor, reduza a severidade dessa consequência em um grau, sem transformar a falha em sucesso."
        ],
        "falha": "Nenhuma.",
        "usosTexto": "1 por cena.",
        "recargaTexto": "Ao fim da cena.",
        "requisitos": [],
        "limitacoes": [
          "Não anula dano grave, não reverte falhas críticas e não fornece a solução completa do problema."
        ],
        "observacoes": ""
      }
    ]
  },
  "protesico": {
    "passiva": {
      "id": "interface-integrada",
      "nome": "Interface Integrada",
      "tipo": "passiva",
      "subtipo": "",
      "iconeId": "habilidade-generica",
      "descricao": "",
      "acao": "Sempre ativa",
      "atributo": "intelecto",
      "gatilho": "Estar em contato com uma prótese, implante ou equipamento compatível.",
      "teste": "Nenhum.",
      "custo": "Sem custo de Mana.",
      "custos": {
        "mana": 0,
        "pe": 0
      },
      "alcance": "Pessoal ou toque",
      "alvo": "Você ou equipamento conectado",
      "dano": "",
      "duracao": "Enquanto conectado",
      "efeitos": [
        "Você interpreta sinais mecânicos e biotécnicos como extensões do próprio corpo. Você recebe um bônus de +1 em testes para diagnosticar, ajustar ou operar próteses e pode identificar falhas básicas sem desmontagem completa."
      ],
      "falha": "Nenhuma.",
      "usosTexto": "Livre.",
      "recargaTexto": "Nenhuma.",
      "requisitos": [],
      "limitacoes": [
        "Não concede controle remoto, conhecimento automático de tecnologias desconhecidas ou imunidade a rejeição e pane."
      ],
      "observacoes": ""
    },
    "iniciais": [
      {
        "id": "modulo-de-campo",
        "nome": "Módulo de Campo",
        "tipo": "tecnica",
        "subtipo": "",
        "iconeId": "habilidade-generica",
        "descricao": "",
        "acao": "Ação",
        "atributo": "intelecto",
        "gatilho": "Ter acesso a uma prótese, implante ou equipamento modular e ferramentas mínimas.",
        "teste": "Teste de Intelecto contra CD da adaptação.",
        "custo": "1 ponto de Mana.",
        "custos": {
          "mana": 1,
          "pe": 0
        },
        "alcance": "Toque",
        "alvo": "Uma prótese, implante ou equipamento",
        "dano": "",
        "duracao": "Cena",
        "efeitos": [
          "Instale uma função temporária simples. Escolha uma finalidade coerente, como aderência, visão ampliada, estabilização, reforço ou ferramenta embutida. Quem usar a prótese recebe um bônus de +1 nos testes diretamente ligados à função escolhida."
        ],
        "falha": "O módulo não estabiliza; nenhum bônus é concedido e o equipamento fica indisponível para nova tentativa até o próximo turno.",
        "usosTexto": "Livre enquanto puder pagar o custo.",
        "recargaTexto": "Nenhuma.",
        "requisitos": [],
        "limitacoes": [
          "A adaptação deve ser fisicamente plausível e não cria armas pesadas, voo, invisibilidade ou sistemas complexos do nada."
        ],
        "observacoes": ""
      },
      {
        "id": "sobrecarga-sinaptica",
        "nome": "Sobrecarga Sináptica",
        "tipo": "tecnica",
        "subtipo": "",
        "iconeId": "habilidade-generica",
        "descricao": "",
        "acao": "Ação",
        "atributo": "resistencia",
        "gatilho": "Possuir uma interface corporal ativa.",
        "teste": "Teste de Resistência CD moderada.",
        "custo": "1 ponto de Mana.",
        "custos": {
          "mana": 1,
          "pe": 0
        },
        "alcance": "Pessoal",
        "alvo": "Você",
        "dano": "",
        "duracao": "Até o fim do próximo turno",
        "efeitos": [
          "Force uma interface além do regime seguro. Em caso de sucesso, receba um bônus de +2 em um único teste físico ou técnico realizado pela interface antes do fim do próximo turno."
        ],
        "falha": "A sobrecarga falha e você recebe uma penalidade de −1 no próximo teste físico antes do fim do próximo turno.",
        "usosTexto": "Livre enquanto puder pagar o custo.",
        "recargaTexto": "Nenhuma.",
        "requisitos": [],
        "limitacoes": [
          "O bônus não se acumula. Não aumenta Vida, não concede ações extras e não permite superar limites estruturais óbvios."
        ],
        "observacoes": ""
      },
      {
        "id": "manutencao-de-emergencia",
        "nome": "Manutenção de Emergência",
        "tipo": "reacao",
        "subtipo": "",
        "iconeId": "habilidade-generica",
        "descricao": "",
        "acao": "Reação",
        "atributo": "intelecto",
        "gatilho": "Uma prótese, implante ou equipamento a até 2 metros sofrer pane, quebra leve ou condição que o tornaria inutilizável.",
        "teste": "Teste de Intelecto contra CD da avaria.",
        "custo": "1 ponto de Mana.",
        "custos": {
          "mana": 1,
          "pe": 0
        },
        "alcance": "2 metros",
        "alvo": "Uma prótese, implante ou equipamento",
        "dano": "",
        "duracao": "Até o fim do próximo turno",
        "efeitos": [
          "Em caso de sucesso, o equipamento continua funcional até o fim do próximo turno e ignora uma penalidade causada pela avaria durante esse período."
        ],
        "falha": "O equipamento permanece inoperante.",
        "usosTexto": "1 por equipamento por cena.",
        "recargaTexto": "Ao fim da cena.",
        "requisitos": [],
        "limitacoes": [
          "Não restaura equipamento destruído, não recupera munição e não remove dano estrutural permanente."
        ],
        "observacoes": ""
      }
    ]
  },
  "maquinista": {
    "passiva": {
      "id": "rede-de-comando",
      "nome": "Rede de Comando",
      "tipo": "passiva",
      "subtipo": "",
      "iconeId": "habilidade-generica",
      "descricao": "",
      "acao": "Sempre ativa",
      "atributo": "intelecto",
      "gatilho": "Possuir um autômato, drone ou máquina compatível sob comando.",
      "teste": "Nenhum.",
      "custo": "Sem custo de Mana.",
      "custos": {
        "mana": 0,
        "pe": 0
      },
      "alcance": "12 metros",
      "alvo": "Máquinas vinculadas",
      "dano": "",
      "duracao": "Enquanto o vínculo permanecer",
      "efeitos": [
        "Você mantém uma rede simples de ordens e pode transmitir comandos curtos sem contato físico e sabe o estado funcional básico de uma máquina vinculada dentro do alcance."
      ],
      "falha": "Nenhuma.",
      "usosTexto": "Livre.",
      "recargaTexto": "Nenhuma.",
      "requisitos": [],
      "limitacoes": [
        "A rede não concede ações extras por si só e pode ser interrompida por distância, isolamento, dano severo ou interferência adequada."
      ],
      "observacoes": ""
    },
    "iniciais": [
      {
        "id": "ordem-prioritaria",
        "nome": "Ordem Prioritária",
        "tipo": "tecnica",
        "subtipo": "",
        "iconeId": "habilidade-generica",
        "descricao": "",
        "acao": "Ação",
        "atributo": "intelecto",
        "gatilho": "Ter uma máquina vinculada dentro da Rede de Comando.",
        "teste": "Teste de Intelecto apenas se a ordem exigir precisão, risco ou adaptação fora da rotina.",
        "custo": "1 ponto de Mana.",
        "custos": {
          "mana": 1,
          "pe": 0
        },
        "alcance": "12 metros",
        "alvo": "Uma máquina vinculada",
        "dano": "",
        "duracao": "Instantânea",
        "efeitos": [
          "A máquina executa imediatamente uma ação simples coerente com suas capacidades: mover, manipular, observar, abrir, transportar ou atacar se possuir meios próprios. Em uma ação que exija teste, recebe um bônus de +1."
        ],
        "falha": "A máquina executa apenas a parte segura da ordem ou não consegue adaptá-la à situação.",
        "usosTexto": "Livre enquanto puder pagar o custo.",
        "recargaTexto": "Nenhuma.",
        "requisitos": [],
        "limitacoes": [
          "Não concede à máquina capacidades inexistentes nem permite múltiplas ações completas no mesmo instante."
        ],
        "observacoes": ""
      },
      {
        "id": "interposicao-mecanica",
        "nome": "Interposição Mecânica",
        "tipo": "reacao",
        "subtipo": "",
        "iconeId": "habilidade-generica",
        "descricao": "",
        "acao": "Reação",
        "atributo": "",
        "gatilho": "Você ou um aliado a até 3 metros de uma máquina vinculada sofrer um ataque ou impacto.",
        "teste": "Nenhum, desde que a máquina tenha caminho livre.",
        "custo": "Sem custo de Mana.",
        "custos": {
          "mana": 0,
          "pe": 0
        },
        "alcance": "3 metros da máquina",
        "alvo": "Você ou um aliado",
        "dano": "",
        "duracao": "Instantânea",
        "efeitos": [
          "A máquina se interpõe e reduz o dano sofrido em 1d4. O mestre pode transferir parte da consequência física para a própria máquina quando fizer sentido."
        ],
        "falha": "Nenhuma.",
        "usosTexto": "1 por cena por máquina.",
        "recargaTexto": "Ao fim da cena.",
        "requisitos": [],
        "limitacoes": [
          "Exige caminho livre e uma máquina de porte suficiente. Não funciona contra efeitos que não possam ser fisicamente interceptados."
        ],
        "observacoes": ""
      },
      {
        "id": "rotina-autonoma",
        "nome": "Rotina Autônoma",
        "tipo": "tecnica",
        "subtipo": "preparacao",
        "iconeId": "habilidade-generica",
        "descricao": "",
        "acao": "Ação",
        "atributo": "intelecto",
        "gatilho": "Ter acesso a uma máquina vinculada e definir um gatilho simples.",
        "teste": "Teste de Intelecto se a rotina tiver mais de uma condição.",
        "custo": "Sem custo de Mana.",
        "custos": {
          "mana": 0,
          "pe": 0
        },
        "alcance": "6 metros",
        "alvo": "Uma máquina vinculada",
        "dano": "",
        "duracao": "Cena ou até ser acionada",
        "efeitos": [
          "Programe uma rotina simples do tipo “quando X acontecer, faça Y”. Quando o gatilho ocorrer, a máquina executa uma ação simples sem consumir uma nova ação sua."
        ],
        "falha": "A rotina é programada de forma rígida e pode interpretar o gatilho de modo literal ou não disparar.",
        "usosTexto": "1 rotina ativa por vez.",
        "recargaTexto": "Nenhuma.",
        "requisitos": [],
        "limitacoes": [
          "O gatilho deve ser observável pela máquina e a resposta deve caber em uma única ação simples."
        ],
        "observacoes": ""
      }
    ]
  },
  "engenheiro-runico": {
    "passiva": {
      "id": "leitura-runica",
      "nome": "Leitura Rúnica",
      "tipo": "passiva",
      "subtipo": "",
      "iconeId": "habilidade-generica",
      "descricao": "",
      "acao": "Sempre ativa",
      "atributo": "intelecto",
      "gatilho": "Observar ou tocar uma runa, selo ou circuito rúnico.",
      "teste": "Nenhum para reconhecer estrutura básica; testes ainda podem ser exigidos para detalhes.",
      "custo": "Sem custo de Mana.",
      "custos": {
        "mana": 0,
        "pe": 0
      },
      "alcance": "Até 3 metros ou toque",
      "alvo": "Uma runa ou selo",
      "dano": "",
      "duracao": "Enquanto estiver analisando",
      "efeitos": [
        "Você distingue a função aparente, o fluxo, o estado e os sinais de alteração de inscrições rúnicas comuns. Você recebe um bônus de +1 em testes para interpretar ou manipular runas."
      ],
      "falha": "Nenhuma.",
      "usosTexto": "Livre.",
      "recargaTexto": "Nenhuma.",
      "requisitos": [],
      "limitacoes": [
        "Não revela automaticamente autoria, propósito oculto, chaves secretas ou mecanismos deliberadamente mascarados."
      ],
      "observacoes": ""
    },
    "iniciais": [
      {
        "id": "leitura-de-assinatura",
        "nome": "Leitura de Assinatura",
        "tipo": "tecnica",
        "subtipo": "",
        "iconeId": "habilidade-generica",
        "descricao": "",
        "acao": "Ação",
        "atributo": "intelecto",
        "gatilho": "Ter acesso visual claro ou contato com a inscrição.",
        "teste": "Teste de Intelecto contra CD da runa.",
        "custo": "Sem custo de Mana.",
        "custos": {
          "mana": 0,
          "pe": 0
        },
        "alcance": "3 metros",
        "alvo": "Uma runa, selo ou circuito",
        "dano": "",
        "duracao": "Instantânea",
        "efeitos": [
          "Em caso de sucesso, identifique até duas informações relevantes entre: gatilho, função principal, alvo autorizado, punição, condição de ativação ou traço de origem."
        ],
        "falha": "Receba apenas uma informação parcial ou uma hipótese sem confirmação.",
        "usosTexto": "1 por runa por cena.",
        "recargaTexto": "Ao fim da cena.",
        "requisitos": [],
        "limitacoes": [
          "Não fornece senhas, nomes verdadeiros ou conteúdo escondido que não esteja codificado na estrutura analisada."
        ],
        "observacoes": ""
      },
      {
        "id": "patch-ilegal",
        "nome": "Patch Ilegal",
        "tipo": "tecnica",
        "subtipo": "",
        "iconeId": "habilidade-generica",
        "descricao": "",
        "acao": "Ação",
        "atributo": "intelecto",
        "gatilho": "Ter identificado ao menos uma função da runa e conseguir alcançá-la.",
        "teste": "Teste de Intelecto contra a a defesa ou a CD da runa.",
        "custo": "1 ponto de Mana.",
        "custos": {
          "mana": 1,
          "pe": 0
        },
        "alcance": "Toque",
        "alvo": "Uma runa ou selo",
        "dano": "",
        "duracao": "Até o fim do próximo turno ou até ser acionada uma vez",
        "efeitos": [
          "Altere temporariamente um único parâmetro simples: atrasar um gatilho, permitir um alvo adicional, bloquear uma ativação ou inverter uma condição binária."
        ],
        "falha": "A runa permanece inalterada e produz uma assinatura anômala perceptível a quem souber procurá-la.",
        "usosTexto": "1 tentativa por runa por cena.",
        "recargaTexto": "Ao fim da cena.",
        "requisitos": [],
        "limitacoes": [
          "Não reescreve efeitos inteiros, não cria runas novas e não altera sistemas muito acima da capacidade do personagem."
        ],
        "observacoes": ""
      },
      {
        "id": "desvio-de-punicao",
        "nome": "Desvio de Punição",
        "tipo": "reacao",
        "subtipo": "",
        "iconeId": "habilidade-generica",
        "descricao": "",
        "acao": "Reação",
        "atributo": "intelecto",
        "gatilho": "Uma runa analisada a até 3 metros ativar uma punição ou efeito hostil.",
        "teste": "Teste de Intelecto contra a CD da runa.",
        "custo": "1 ponto de Mana.",
        "custos": {
          "mana": 1,
          "pe": 0
        },
        "alcance": "3 metros",
        "alvo": "Uma ativação rúnica",
        "dano": "",
        "duracao": "Instantânea",
        "efeitos": [
          "Em caso de sucesso, reduza em 1d6 o dano provocado pela ativação ou adie um efeito não danoso até o fim do próximo turno."
        ],
        "falha": "A punição ocorre normalmente.",
        "usosTexto": "1 por cena.",
        "recargaTexto": "Ao fim da cena.",
        "requisitos": [],
        "limitacoes": [
          "Não anula efeitos permanentes, não desfaz contratos já concluídos e só afeta a ativação imediata."
        ],
        "observacoes": ""
      }
    ]
  },
  "quimico-de-campo": {
    "passiva": {
      "id": "bancada-de-campo",
      "nome": "Bancada de Campo",
      "tipo": "passiva",
      "subtipo": "",
      "iconeId": "habilidade-generica",
      "descricao": "",
      "acao": "Sempre ativa",
      "atributo": "intelecto",
      "gatilho": "Ter acesso a materiais, recipientes e alguns minutos de preparação ou a um kit químico.",
      "teste": "Nenhum para preparações simples.",
      "custo": "Sem custo de Mana.",
      "custos": {
        "mana": 0,
        "pe": 0
      },
      "alcance": "Pessoal",
      "alvo": "Você",
      "dano": "",
      "duracao": "Cena",
      "efeitos": [
        "Você consegue reconhecer substâncias comuns, improvisar reagentes simples e manter compostos instáveis utilizáveis durante uma cena. Você recebe um bônus de +1 em testes para identificar toxinas, solventes, combustíveis e reações químicas."
      ],
      "falha": "Nenhuma.",
      "usosTexto": "Livre.",
      "recargaTexto": "Nenhuma.",
      "requisitos": [],
      "limitacoes": [
        "Não cria substâncias raras sem matéria-prima, antídotos universais ou compostos permanentes sem equipamento adequado."
      ],
      "observacoes": ""
    },
    "iniciais": [
      {
        "id": "mistura-rapida",
        "nome": "Mistura Rápida",
        "tipo": "tecnica",
        "subtipo": "",
        "iconeId": "habilidade-generica",
        "descricao": "",
        "acao": "Ação",
        "atributo": "intelecto",
        "gatilho": "Possuir um kit ou materiais químicos plausíveis.",
        "teste": "Teste de Intelecto CD moderada.",
        "custo": "1 ponto de Mana ou um reagente preparado, se disponível.",
        "custos": {
          "mana": 1,
          "pe": 0
        },
        "alcance": "Até 4 metros ou toque",
        "alvo": "Uma criatura, objeto ou área pequena",
        "dano": "1d6 químico (opção)",
        "duracao": "Instantânea ou até o próximo turno",
        "efeitos": [
          "Escolha um efeito coerente: corrosivo (causa 1d6 de dano químico a um objeto ou alvo atingido), fumaça (criaturas em uma área pequena recebem uma penalidade de −1 em testes visuais até o próximo turno) ou aderente (reduz em 2 metros o próximo deslocamento do alvo)."
        ],
        "falha": "O composto perde eficiência e produz apenas um efeito narrativo menor, sem bônus, dano ou penalidade.",
        "usosTexto": "Livre enquanto houver material ou recursos para pagar o custo.",
        "recargaTexto": "Nenhuma.",
        "requisitos": [],
        "limitacoes": [
          "Escolha apenas um efeito por uso. Equipamentos de proteção adequados podem reduzir ou ignorar o efeito secundário."
        ],
        "observacoes": ""
      },
      {
        "id": "neutralizacao",
        "nome": "Neutralização",
        "tipo": "reacao",
        "subtipo": "",
        "iconeId": "habilidade-generica",
        "descricao": "",
        "acao": "Reação",
        "atributo": "intelecto",
        "gatilho": "Você ou uma criatura tocada estar sob efeito de ácido, toxina, fumaça ou outro composto químico reconhecível.",
        "teste": "Teste de Intelecto contra CD do agente.",
        "custo": "1 ponto de Mana.",
        "custos": {
          "mana": 1,
          "pe": 0
        },
        "alcance": "Toque",
        "alvo": "Você ou uma criatura",
        "dano": "",
        "duracao": "Instantânea",
        "efeitos": [
          "Em caso de sucesso, reduza em 1d6 o dano químico imediato ou conceda um bônus de +1 no próximo teste de Resistência contra o agente antes do fim da cena."
        ],
        "falha": "O tratamento não produz benefício mecânico, mas não agrava a exposição.",
        "usosTexto": "1 por alvo por agente na cena.",
        "recargaTexto": "Nenhuma.",
        "requisitos": [],
        "limitacoes": [
          "Não cura dano já consolidado e não neutraliza agentes desconhecidos sem algum meio de identificação."
        ],
        "observacoes": ""
      },
      {
        "id": "catalisador-instavel",
        "nome": "Catalisador Instável",
        "tipo": "tecnica",
        "subtipo": "",
        "iconeId": "habilidade-generica",
        "descricao": "",
        "acao": "Ação",
        "atributo": "intelecto",
        "gatilho": "Ter um composto químico próprio preparado ou ativo.",
        "teste": "Teste de Intelecto CD moderada.",
        "custo": "Sem custo de Mana; consome o composto catalisado.",
        "custos": {
          "mana": 0,
          "pe": 0
        },
        "alcance": "6 metros",
        "alvo": "Um composto ou área afetada",
        "dano": "",
        "duracao": "Instantânea",
        "efeitos": [
          "Aumente uma única característica do composto: +1d4 de dano, +2 metros de alcance ou área, ou +1 rodada de duração."
        ],
        "falha": "O composto é consumido sem amplificação e deixa resíduos incômodos ou perigosos no local.",
        "usosTexto": "1 por composto.",
        "recargaTexto": "Nenhuma.",
        "requisitos": [],
        "limitacoes": [
          "Nunca amplifica mais de uma característica e não pode ser aplicado a efeitos permanentes ou a compostos de origem desconhecida."
        ],
        "observacoes": ""
      }
    ]
  },
  "hemurgista": {
    "passiva": {
      "id": "controle-hematico",
      "nome": "Controle Hemático",
      "tipo": "passiva",
      "subtipo": "",
      "iconeId": "habilidade-generica",
      "descricao": "",
      "acao": "Sempre ativa",
      "atributo": "resistencia",
      "gatilho": "Haver sangue seu exposto ou sangue recentemente derramado ao alcance.",
      "teste": "Nenhum para movimentos simples.",
      "custo": "Sem custo de Mana.",
      "custos": {
        "mana": 0,
        "pe": 0
      },
      "alcance": "3 metros",
      "alvo": "Sangue disponível",
      "dano": "",
      "duracao": "Enquanto houver sangue utilizável",
      "efeitos": [
        "Você consegue mover pequenas quantidades de sangue, estancar fluxos superficiais e dar uma forma simples ao próprio sangue fora do corpo. Essas manipulações não causam dano por si só."
      ],
      "falha": "Nenhuma.",
      "usosTexto": "Livre.",
      "recargaTexto": "Nenhuma.",
      "requisitos": [],
      "limitacoes": [
        "Não controla sangue dentro do corpo de outra criatura, não drena Vida à distância e perde precisão quando o sangue seca ou se dispersa."
      ],
      "observacoes": ""
    },
    "iniciais": [
      {
        "id": "sangria-controlada",
        "nome": "Sangria Controlada",
        "tipo": "tecnica",
        "subtipo": "",
        "iconeId": "habilidade-generica",
        "descricao": "",
        "acao": "Ação",
        "atributo": "resistencia",
        "gatilho": "Ter condições de produzir um corte controlado em si mesmo.",
        "teste": "Nenhum.",
        "custo": "Você sofre 1d4 de dano, que não pode ser reduzido.",
        "custos": {
          "mana": 0,
          "pe": 0
        },
        "alcance": "Pessoal",
        "alvo": "Você",
        "dano": "",
        "duracao": "Cena ou até ser consumida",
        "efeitos": [
          "Você produz uma quantidade útil de sangue sem depender de ferimento externo. Até o fim da cena, uma técnica hemúrgica pode usar esse sangue como preparação e recebe um bônus de +1 no teste ou dispensa uma exigência narrativa de sangue disponível."
        ],
        "falha": "Nenhuma.",
        "usosTexto": "1 sangria ativa por vez.",
        "recargaTexto": "Nenhuma.",
        "requisitos": [],
        "limitacoes": [
          "Não pode reduzir você abaixo de 1 Vida por escolha. O dano representa perda real e não é recuperado automaticamente ao fim da cena."
        ],
        "observacoes": ""
      },
      {
        "id": "fio-hematico",
        "nome": "Fio Hemático",
        "tipo": "tecnica",
        "subtipo": "",
        "iconeId": "habilidade-generica",
        "descricao": "",
        "acao": "Ação",
        "atributo": "resistencia",
        "gatilho": "Haver sangue utilizável dentro do alcance.",
        "teste": "Teste de Resistência contra a defesa física apropriada do alvo.",
        "custo": "1 ponto de Mana; uma Sangria Controlada ativa pode substituir a necessidade narrativa de sangue.",
        "custos": {
          "mana": 1,
          "pe": 0
        },
        "alcance": "4 metros",
        "alvo": "Uma criatura ou objeto pequeno",
        "dano": "1d6 cortante",
        "duracao": "Até o fim do próximo turno",
        "efeitos": [
          "Em caso de sucesso contra uma criatura, cause 1d6 de dano cortante e reduza em 1 metro seu próximo deslocamento. Contra objetos leves, o fio pode puxar, prender ou manipular algo simples dentro do alcance."
        ],
        "falha": "O fio perde coesão e não causa dano nem prende o alvo.",
        "usosTexto": "Livre enquanto puder pagar o custo.",
        "recargaTexto": "Nenhuma.",
        "requisitos": [],
        "limitacoes": [
          "Não imobiliza completamente, não atravessa proteção pesada e não manipula objetos grandes ou firmemente fixados."
        ],
        "observacoes": ""
      },
      {
        "id": "coagulacao-forcada",
        "nome": "Coagulação Forçada",
        "tipo": "reacao",
        "subtipo": "",
        "iconeId": "habilidade-generica",
        "descricao": "",
        "acao": "Reação",
        "atributo": "resistencia",
        "gatilho": "Você ou uma criatura tocada sofrer Sangramento, corte profundo ou risco imediato de perda de sangue.",
        "teste": "Nenhum para Sangramento comum; Resistência pode ser exigida em ferimentos graves.",
        "custo": "1 ponto de Mana.",
        "custos": {
          "mana": 1,
          "pe": 0
        },
        "alcance": "Toque",
        "alvo": "Você ou uma criatura",
        "dano": "",
        "duracao": "Cena",
        "efeitos": [
          "Interrompa um efeito de Sangramento comum e estabilize o ferimento. Se acionada imediatamente após um golpe cortante, reduza em 1d4 o dano desse golpe."
        ],
        "falha": "Em ferimentos graves, a técnica apenas diminui o fluxo e concede um bônus de +1 no próximo teste de estabilização.",
        "usosTexto": "1 por alvo por cena.",
        "recargaTexto": "Ao fim da cena.",
        "requisitos": [],
        "limitacoes": [
          "Não regenera tecido, não remove dano já sofrido além da redução imediata e não trata causas internas complexas."
        ],
        "observacoes": ""
      }
    ]
  },
  "morfologista": {
    "passiva": {
      "id": "plasticidade-adaptativa",
      "nome": "Plasticidade Adaptativa",
      "tipo": "passiva",
      "subtipo": "",
      "iconeId": "habilidade-generica",
      "descricao": "",
      "acao": "Sempre ativa",
      "atributo": "resistencia",
      "gatilho": "Ser exposto por algum tempo a uma exigência ambiental ou física clara.",
      "teste": "Nenhum.",
      "custo": "Sem custo de Mana.",
      "custos": {
        "mana": 0,
        "pe": 0
      },
      "alcance": "Pessoal",
      "alvo": "Você",
      "dano": "",
      "duracao": "Cena",
      "efeitos": [
        "Seu corpo consegue manifestar ajustes menores e reversíveis. Uma vez por cena, após observar uma necessidade física clara, você pode obter um bônus de +1 em um único teste coerente de escalada, natação, equilíbrio, respiração, percepção corporal ou resistência ambiental."
      ],
      "falha": "Nenhuma.",
      "usosTexto": "1 benefício por cena.",
      "recargaTexto": "Ao fim da cena.",
      "requisitos": [],
      "limitacoes": [
        "As mudanças são discretas, não criam órgãos completos, não concedem voo, cura acelerada ou imunidades."
      ],
      "observacoes": ""
    },
    "iniciais": [
      {
        "id": "adaptacao-expressa",
        "nome": "Adaptação Expressa",
        "tipo": "tecnica",
        "subtipo": "",
        "iconeId": "habilidade-generica",
        "descricao": "",
        "acao": "Ação",
        "atributo": "resistencia",
        "gatilho": "Identificar uma necessidade física concreta do ambiente.",
        "teste": "Teste de Resistência CD moderada.",
        "custo": "1 ponto de Mana.",
        "custos": {
          "mana": 1,
          "pe": 0
        },
        "alcance": "Pessoal",
        "alvo": "Você",
        "dano": "",
        "duracao": "Cena",
        "efeitos": [
          "Escolha uma adaptação simples: aderência, visão em baixa luz, membrana respiratória limitada, amortecimento, musculatura localizada ou pele mais resistente. Receba um bônus de +1 nos testes diretamente ligados à adaptação durante a cena."
        ],
        "falha": "A adaptação surge incompleta e dura apenas até o fim do próximo turno, sem bônus.",
        "usosTexto": "Livre enquanto puder pagar o custo; apenas uma Adaptação Expressa ativa.",
        "recargaTexto": "Nenhuma.",
        "requisitos": [],
        "limitacoes": [
          "Não concede habilidades sobrenaturais completas nem substitui equipamentos especializados em situações extremas."
        ],
        "observacoes": ""
      },
      {
        "id": "resposta-evolutiva",
        "nome": "Resposta Evolutiva",
        "tipo": "reacao",
        "subtipo": "",
        "iconeId": "habilidade-generica",
        "descricao": "",
        "acao": "Reação",
        "atributo": "resistencia",
        "gatilho": "Sofrer dano de um tipo físico ou ambiental identificável.",
        "teste": "Nenhum.",
        "custo": "Sem custo de Mana.",
        "custos": {
          "mana": 0,
          "pe": 0
        },
        "alcance": "Pessoal",
        "alvo": "Você",
        "dano": "",
        "duracao": "Até o fim do próximo turno",
        "efeitos": [
          "Após sofrer o dano, seu corpo se ajusta. Reduza em 2 pontos o próximo dano do mesmo tipo recebido antes do fim do próximo turno."
        ],
        "falha": "Nenhuma.",
        "usosTexto": "1 por cena.",
        "recargaTexto": "Ao fim da cena.",
        "requisitos": [],
        "limitacoes": [
          "Não reduz o ataque que ativou a habilidade e não funciona contra efeitos puramente mentais, conceituais ou sem mecanismo físico identificável."
        ],
        "observacoes": ""
      },
      {
        "id": "sobrecarga-anatomica",
        "nome": "Sobrecarga Anatômica",
        "tipo": "tecnica",
        "subtipo": "",
        "iconeId": "habilidade-generica",
        "descricao": "",
        "acao": "Ação",
        "atributo": "resistencia",
        "gatilho": "Ter uma adaptação ativa.",
        "teste": "Teste de Resistência CD moderada.",
        "custo": "1 ponto de Mana.",
        "custos": {
          "mana": 1,
          "pe": 0
        },
        "alcance": "Pessoal",
        "alvo": "Você",
        "dano": "+1d4 (opção)",
        "duracao": "Até o fim do próximo turno",
        "efeitos": [
          "Intensifique uma adaptação. Escolha entre receber um bônus de +2 em um único teste físico ligado a ela ou causar +1d4 de dano em um único ataque corpo a corpo realizado antes do fim do próximo turno."
        ],
        "falha": "A adaptação perde estabilidade; você recebe uma penalidade de −1 no próximo teste físico.",
        "usosTexto": "1 por adaptação por cena.",
        "recargaTexto": "Ao fim da cena.",
        "requisitos": [],
        "limitacoes": [
          "Não concede ação extra, não acumula consigo mesma e termina imediatamente após produzir o benefício escolhido."
        ],
        "observacoes": ""
      }
    ]
  },
  "simbionte": {
    "passiva": {
      "id": "concordancia-simbiotica",
      "nome": "Concordância Simbiótica",
      "tipo": "passiva",
      "subtipo": "",
      "iconeId": "habilidade-generica",
      "descricao": "",
      "acao": "Sempre ativa",
      "atributo": "resistencia",
      "gatilho": "Manter o simbionte alimentado, consciente e não submetê-lo continuamente a estímulos que rejeita.",
      "teste": "Nenhum.",
      "custo": "Sem custo de Mana.",
      "custos": {
        "mana": 0,
        "pe": 0
      },
      "alcance": "Pessoal",
      "alvo": "Você",
      "dano": "",
      "duracao": "Enquanto houver concordância",
      "efeitos": [
        "O organismo reage a ameaças e necessidades do hospedeiro. Você recebe um bônus de +1 em testes para perceber perigo biológico próximo, alterações no próprio corpo ou sinais de envenenamento e infecção."
      ],
      "falha": "Nenhuma.",
      "usosTexto": "Livre.",
      "recargaTexto": "Nenhuma.",
      "requisitos": [],
      "limitacoes": [
        "A percepção é instintiva, não identifica automaticamente a origem exata do perigo e pode ser prejudicada quando a relação com o simbionte estiver deteriorada."
      ],
      "observacoes": ""
    },
    "iniciais": [
      {
        "id": "manifestacao-simbiotica",
        "nome": "Manifestação Simbiótica",
        "tipo": "tecnica",
        "subtipo": "",
        "iconeId": "habilidade-generica",
        "descricao": "",
        "acao": "Ação",
        "atributo": "resistencia",
        "gatilho": "O simbionte estar responsivo e o hospedeiro conseguir se concentrar na manifestação.",
        "teste": "Teste de Resistência CD moderada.",
        "custo": "1 ponto de Mana.",
        "custos": {
          "mana": 1,
          "pe": 0
        },
        "alcance": "Pessoal",
        "alvo": "Você",
        "dano": "1d4 natural (opção)",
        "duracao": "Cena",
        "efeitos": [
          "Manifeste uma função simples: carapaça, garra, membro auxiliar, membrana sensorial ou tecido aderente. Escolha um benefício coerente: um bônus de +1 em um tipo de teste físico ou sensorial, ou um ataque natural que cause 1d4 de dano."
        ],
        "falha": "A manifestação fica incompleta e desaparece no fim do próximo turno sem bônus.",
        "usosTexto": "Livre enquanto puder pagar o custo; uma manifestação principal por vez.",
        "recargaTexto": "Nenhuma.",
        "requisitos": [],
        "limitacoes": [
          "Não cria membros plenamente independentes, armas grandes, regeneração intensa ou sentidos de alcance extraordinário."
        ],
        "observacoes": ""
      },
      {
        "id": "reflexo-do-hospedeiro",
        "nome": "Reflexo do Hospedeiro",
        "tipo": "reacao",
        "subtipo": "",
        "iconeId": "habilidade-generica",
        "descricao": "",
        "acao": "Reação",
        "atributo": "",
        "gatilho": "Você sofrer um ataque, impacto ou ameaça física súbita que o simbionte possa perceber.",
        "teste": "Nenhum.",
        "custo": "Sem custo de Mana.",
        "custos": {
          "mana": 0,
          "pe": 0
        },
        "alcance": "Pessoal",
        "alvo": "Você",
        "dano": "",
        "duracao": "Instantânea",
        "efeitos": [
          "O simbionte reage por instinto e reduz o dano recebido em 1d4 ou impede que você seja derrubado por um efeito físico menor. Escolha apenas um dos benefícios."
        ],
        "falha": "Nenhuma.",
        "usosTexto": "1 por cena.",
        "recargaTexto": "Ao fim da cena.",
        "requisitos": [],
        "limitacoes": [
          "Não funciona contra efeitos mentais, ataques sem contato físico perceptível ou consequências já resolvidas."
        ],
        "observacoes": ""
      },
      {
        "id": "necessidade-compartilhada",
        "nome": "Necessidade Compartilhada",
        "tipo": "tecnica",
        "subtipo": "preparacao",
        "iconeId": "habilidade-generica",
        "descricao": "",
        "acao": "Ação",
        "atributo": "",
        "gatilho": "Ter oportunidade de atender uma necessidade simples do simbionte: alimento, repouso, calor, umidade ou estímulo apropriado.",
        "teste": "Nenhum.",
        "custo": "Sem custo de Mana.",
        "custos": {
          "mana": 0,
          "pe": 0
        },
        "alcance": "Pessoal",
        "alvo": "Você",
        "dano": "",
        "duracao": "Cena",
        "efeitos": [
          "Ao satisfazer conscientemente uma necessidade do organismo, escolha um benefício para a cena: recupere 1 ponto de Mana ou receba um bônus de +1 no próximo teste de Resistência ligado ao corpo."
        ],
        "falha": "Nenhuma.",
        "usosTexto": "1 por cena.",
        "recargaTexto": "Ao fim da cena.",
        "requisitos": [],
        "limitacoes": [
          "A necessidade deve fazer sentido na ficção. Não pode ser acionada repetidamente com o mesmo recurso trivial dentro da mesma cena."
        ],
        "observacoes": ""
      }
    ]
  },
  "galvanico": {
    "passiva": {
      "id": "acumulo-galvanico",
      "nome": "Acúmulo Galvânico",
      "tipo": "passiva",
      "subtipo": "",
      "iconeId": "habilidade-generica",
      "descricao": "",
      "acao": "Sempre ativa",
      "atributo": "",
      "gatilho": "Entrar em contato com uma fonte elétrica adequada, produzir eletricidade por técnica própria ou permanecer em situação de forte atividade eletromecânica.",
      "teste": "Nenhum.",
      "custo": "Sem custo de Mana.",
      "custos": {
        "mana": 0,
        "pe": 0
      },
      "alcance": "Pessoal",
      "alvo": "Você",
      "dano": "",
      "duracao": "Cena",
      "efeitos": [
        "Seu corpo consegue armazenar pequenas quantidades de energia elétrica de forma instável. Essa energia serve como justificativa e requisito para técnicas galvânicas, podendo ser descarregada sem causar dano por si só."
      ],
      "falha": "Nenhuma.",
      "usosTexto": "Livre.",
      "recargaTexto": "Nenhuma.",
      "requisitos": [],
      "limitacoes": [
        "A reserva é pequena e imprecisa. Não alimenta máquinas grandes, não sustenta descargas contínuas e se dissipa ao fim da cena ou após longo período sem estímulo."
      ],
      "observacoes": ""
    },
    "iniciais": [
      {
        "id": "arco-neural",
        "nome": "Arco Neural",
        "tipo": "tecnica",
        "subtipo": "",
        "iconeId": "habilidade-generica",
        "descricao": "",
        "acao": "Ação",
        "atributo": "intelecto",
        "gatilho": "Possuir energia elétrica acumulada ou acesso a uma fonte elétrica adequada.",
        "teste": "Teste de Intelecto contra a defesa apropriada do alvo.",
        "custo": "1 ponto de Mana.",
        "custos": {
          "mana": 1,
          "pe": 0
        },
        "alcance": "6 metros",
        "alvo": "Uma criatura",
        "dano": "1d6 elétrico",
        "duracao": "Instantânea",
        "efeitos": [
          "Em caso de sucesso, cause 1d6 de dano elétrico. O alvo recebe uma penalidade de −1 no próximo teste físico realizado antes do fim do próximo turno."
        ],
        "falha": "O alvo não sofre dano nem penalidade.",
        "usosTexto": "Livre enquanto puder pagar o custo.",
        "recargaTexto": "Nenhuma.",
        "requisitos": [],
        "limitacoes": [
          "Não paralisa completamente. Criaturas ou equipamentos eletricamente isolados podem reduzir ou ignorar o efeito secundário."
        ],
        "observacoes": ""
      },
      {
        "id": "impulso-eletromuscular",
        "nome": "Impulso Eletromuscular",
        "tipo": "tecnica",
        "subtipo": "",
        "iconeId": "habilidade-generica",
        "descricao": "",
        "acao": "Movimento",
        "atributo": "agilidade",
        "gatilho": "Possuir energia elétrica acumulada e liberdade de movimento.",
        "teste": "Nenhum; um teste de Agilidade pode ser exigido em terreno perigoso.",
        "custo": "1 ponto de Mana.",
        "custos": {
          "mana": 1,
          "pe": 0
        },
        "alcance": "Pessoal",
        "alvo": "Você",
        "dano": "",
        "duracao": "Instantânea; efeito até o fim do turno",
        "efeitos": [
          "Estimule os próprios músculos. Aumente seu deslocamento em até 3 metros neste turno ou receba um bônus de +1 no próximo teste de Agilidade realizado antes do fim do turno."
        ],
        "falha": "Em terreno perigoso, uma falha pode encerrar o deslocamento antes do ponto desejado.",
        "usosTexto": "Livre enquanto puder pagar o custo.",
        "recargaTexto": "Nenhuma.",
        "requisitos": [],
        "limitacoes": [
          "Não concede uma ação adicional, não permite atravessar obstáculos impossíveis e não se acumula consigo mesma."
        ],
        "observacoes": ""
      },
      {
        "id": "descarga-reflexa",
        "nome": "Descarga Reflexa",
        "tipo": "reacao",
        "subtipo": "",
        "iconeId": "habilidade-generica",
        "descricao": "",
        "acao": "Reação",
        "atributo": "resistencia",
        "gatilho": "Ser atingido em combate corpo a corpo, agarrado ou tocado de forma hostil.",
        "teste": "Nenhum para o dano; teste de Resistência contra a defesa do agressor se tentar romper um agarrão.",
        "custo": "1 ponto de Mana.",
        "custos": {
          "mana": 1,
          "pe": 0
        },
        "alcance": "Toque",
        "alvo": "A criatura em contato com você",
        "dano": "1d4 elétrico",
        "duracao": "Instantânea",
        "efeitos": [
          "O agressor sofre 1d4 de dano elétrico. Se você estiver agarrado, em vez de causar dano, pode realizar imediatamente um teste de Resistência com um bônus de +1 para tentar romper o agarrão."
        ],
        "falha": "Se optar por romper o agarrão e falhar, permanece agarrado e não causa dano.",
        "usosTexto": "1 reação por rodada, controlada pelo custo.",
        "recargaTexto": "Nenhuma.",
        "requisitos": [],
        "limitacoes": [
          "Não atordoa, não paralisa e exige contato físico direto ou condutor adequado."
        ],
        "observacoes": ""
      }
    ]
  },
  "caldeirista": {
    "passiva": {
      "id": "sistema-pressurizado",
      "nome": "Sistema Pressurizado",
      "tipo": "passiva",
      "subtipo": "",
      "iconeId": "habilidade-generica",
      "descricao": "",
      "acao": "Sempre ativa",
      "atributo": "resistencia",
      "gatilho": "Executar esforço físico intenso, aquecer o equipamento ou usar uma técnica de pressão.",
      "teste": "Nenhum.",
      "custo": "Sem custo de Mana.",
      "custos": {
        "mana": 0,
        "pe": 0
      },
      "alcance": "Pessoal",
      "alvo": "Você",
      "dano": "",
      "duracao": "Cena",
      "efeitos": [
        "Seu equipamento e corpo trabalham com pequenas reservas de pressão. Você percebe quando o sistema está próximo do limite e recebe um bônus de +1 em testes para resistir a calor, vapor ou falhas do próprio equipamento."
      ],
      "falha": "Nenhuma.",
      "usosTexto": "Livre.",
      "recargaTexto": "Nenhuma.",
      "requisitos": [],
      "limitacoes": [
        "A pressão disponível é limitada e não gera força industrial contínua nem imunidade a calor."
      ],
      "observacoes": ""
    },
    "iniciais": [
      {
        "id": "pressurizar",
        "nome": "Pressurizar",
        "tipo": "tecnica",
        "subtipo": "preparacao",
        "iconeId": "habilidade-generica",
        "descricao": "",
        "acao": "Ação",
        "atributo": "resistencia",
        "gatilho": "Ter o sistema funcional e alguns segundos para concentrar pressão.",
        "teste": "Teste de Resistência CD baixa apenas sob dano, movimento brusco ou ambiente desfavorável.",
        "custo": "Sem custo de Mana.",
        "custos": {
          "mana": 0,
          "pe": 0
        },
        "alcance": "Pessoal",
        "alvo": "Você",
        "dano": "+1d4 (opção)",
        "duracao": "Cena ou até ser consumida",
        "efeitos": [
          "Você entra no estado Pressurizado. A próxima técnica de Caldeirista que exigir pressão recebe um bônus de +1 no teste ou +1d4 no dano, escolhido ao usar a técnica. O estado termina após esse benefício."
        ],
        "falha": "Sob condições adversas, a pressão não estabiliza e a ação é perdida.",
        "usosTexto": "1 estado Pressurizado por vez.",
        "recargaTexto": "Nenhuma.",
        "requisitos": [],
        "limitacoes": [
          "Não acumula múltiplas pressurizações e se perde se o sistema for desligado, inundado ou seriamente danificado."
        ],
        "observacoes": ""
      },
      {
        "id": "pistao-de-impacto",
        "nome": "Pistão de Impacto",
        "tipo": "tecnica",
        "subtipo": "",
        "iconeId": "habilidade-generica",
        "descricao": "",
        "acao": "Ação",
        "atributo": "forca",
        "gatilho": "Estar Pressurizado.",
        "teste": "Teste de Força contra a defesa física do alvo ou CD do obstáculo.",
        "custo": "Consome o estado Pressurizado.",
        "custos": {
          "mana": 0,
          "pe": 0
        },
        "alcance": "Toque",
        "alvo": "Uma criatura, porta, obstáculo ou objeto",
        "dano": "1d8 físico",
        "duracao": "Instantânea",
        "efeitos": [
          "Em caso de sucesso, cause 1d8 de dano físico a uma criatura ou aplique força suficiente para empurrá-la 1 metro. Contra objetos e portas, receba um bônus adicional de +1 no teste para quebrar ou deslocar."
        ],
        "falha": "Não causa dano e a pressão é consumida.",
        "usosTexto": "Controlado pela preparação.",
        "recargaTexto": "Nenhuma.",
        "requisitos": [],
        "limitacoes": [
          "Não lança criaturas grandes, não atravessa estruturas reforçadas e exige contato direto."
        ],
        "observacoes": ""
      },
      {
        "id": "valvula-de-escape",
        "nome": "Válvula de Escape",
        "tipo": "reacao",
        "subtipo": "",
        "iconeId": "habilidade-generica",
        "descricao": "",
        "acao": "Reação",
        "atributo": "resistencia",
        "gatilho": "Sofrer superaquecimento, impacto forte ou precisar liberar pressão imediatamente.",
        "teste": "Nenhum.",
        "custo": "Sem custo de Mana.",
        "custos": {
          "mana": 0,
          "pe": 0
        },
        "alcance": "Pessoal; área de 2 metros",
        "alvo": "Você e criaturas adjacentes",
        "dano": "",
        "duracao": "Instantânea",
        "efeitos": [
          "Libere vapor e pressão. Reduza em 1d6 um dano de calor ou impacto recebido. Como alternativa, criaturas adjacentes fazem um teste de Resistência; se falharem, recuam 1 metro."
        ],
        "falha": "Na opção de empurrão, criaturas que resistirem não se movem.",
        "usosTexto": "1 por cena.",
        "recargaTexto": "Ao fim da cena.",
        "requisitos": [],
        "limitacoes": [
          "Escolha redução de dano ou empurrão, nunca ambos. O vapor pode revelar sua posição e não funciona bem em ambientes que dispersem a pressão imediatamente."
        ],
        "observacoes": ""
      }
    ]
  },
  "criotecnico": {
    "passiva": {
      "id": "gradiente-termico",
      "nome": "Gradiente Térmico",
      "tipo": "passiva",
      "subtipo": "",
      "iconeId": "habilidade-generica",
      "descricao": "",
      "acao": "Sempre ativa",
      "atributo": "intelecto",
      "gatilho": "Existirem diferenças de temperatura perceptíveis no ambiente.",
      "teste": "Nenhum.",
      "custo": "Sem custo de Mana.",
      "custos": {
        "mana": 0,
        "pe": 0
      },
      "alcance": "6 metros",
      "alvo": "Ambiente e objetos",
      "dano": "",
      "duracao": "Enquanto estiver consciente",
      "efeitos": [
        "Você percebe variações térmicas próximas e consegue resfriar lentamente pequenos objetos sem causar dano. Você recebe um bônus de +1 em testes para localizar fontes de calor, vazamentos térmicos ou mudanças bruscas de temperatura."
      ],
      "falha": "Nenhuma.",
      "usosTexto": "Livre.",
      "recargaTexto": "Nenhuma.",
      "requisitos": [],
      "limitacoes": [
        "A percepção não atravessa isolamento pesado nem fornece imagem térmica perfeita através de paredes."
      ],
      "observacoes": ""
    },
    "iniciais": [
      {
        "id": "extracao-localizada",
        "nome": "Extração Localizada",
        "tipo": "tecnica",
        "subtipo": "",
        "iconeId": "habilidade-generica",
        "descricao": "",
        "acao": "Ação",
        "atributo": "intelecto",
        "gatilho": "Ter linha de visão do alvo e meio razoável para dissipar o calor extraído.",
        "teste": "Teste de Intelecto contra a defesa apropriada do alvo.",
        "custo": "1 ponto de Mana.",
        "custos": {
          "mana": 1,
          "pe": 0
        },
        "alcance": "6 metros",
        "alvo": "Uma criatura ou objeto",
        "dano": "1d6 frio",
        "duracao": "Até o fim do próximo turno",
        "efeitos": [
          "Em caso de sucesso, cause 1d6 de dano de frio e o alvo recebe uma penalidade de −1 no próximo teste físico realizado antes do fim do próximo turno. Contra um objeto, você pode resfriar, contrair ou tornar a superfície quebradiça."
        ],
        "falha": "Nenhum dano ou penalidade mecânica é aplicado.",
        "usosTexto": "Livre enquanto puder pagar o custo.",
        "recargaTexto": "Nenhuma.",
        "requisitos": [],
        "limitacoes": [
          "Não congela instantaneamente criaturas, não paralisa membros e perde eficiência contra forte isolamento térmico."
        ],
        "observacoes": ""
      },
      {
        "id": "fratura-termica",
        "nome": "Fratura Térmica",
        "tipo": "tecnica",
        "subtipo": "",
        "iconeId": "habilidade-generica",
        "descricao": "",
        "acao": "Ação",
        "atributo": "intelecto",
        "gatilho": "O alvo ter sido resfriado por você nesta cena ou estar naturalmente muito frio.",
        "teste": "Teste de Intelecto contra a a defesa ou a CD do alvo.",
        "custo": "Sem custo de Mana; exige que o alvo esteja resfriado.",
        "custos": {
          "mana": 0,
          "pe": 0
        },
        "alcance": "6 metros",
        "alvo": "Uma criatura, armadura ou objeto",
        "dano": "+1d4 no próximo dano",
        "duracao": "Até o fim do próximo turno",
        "efeitos": [
          "Em caso de sucesso, o próximo dano físico causado ao alvo antes do fim do próximo turno recebe um bônus de +1d4. Contra um objeto frágil ou uma estrutura fina, o mestre pode converter isso em vantagem para quebrar."
        ],
        "falha": "O alvo não fica vulnerável e perde a condição de preparação para esta técnica.",
        "usosTexto": "1 por alvo por cena.",
        "recargaTexto": "Ao fim da cena.",
        "requisitos": [],
        "limitacoes": [
          "Não multiplica dano, não quebra materiais extremamente resistentes e exige que exista contraste térmico relevante."
        ],
        "observacoes": ""
      },
      {
        "id": "conservacao-de-emergencia",
        "nome": "Conservação de Emergência",
        "tipo": "reacao",
        "subtipo": "",
        "iconeId": "habilidade-generica",
        "descricao": "",
        "acao": "Reação",
        "atributo": "intelecto",
        "gatilho": "Uma criatura tocada ficar inconsciente, sangrar ou sofrer o agravamento rápido de uma toxina ou ferimento.",
        "teste": "Nenhum em estabilização simples; Intelecto pode ser exigido em quadro grave.",
        "custo": "1 ponto de Mana.",
        "custos": {
          "mana": 1,
          "pe": 0
        },
        "alcance": "Toque",
        "alvo": "Uma criatura",
        "dano": "",
        "duracao": "Cena",
        "efeitos": [
          "Resfrie o corpo de forma controlada. Estabilize uma criatura que esteja morrendo ou conceda um bônus de +1 no próximo teste contra Sangramento ou toxina antes do fim da cena."
        ],
        "falha": "Em quadro grave, apenas atrasa a piora até o fim do próximo turno.",
        "usosTexto": "1 por alvo por cena.",
        "recargaTexto": "Ao fim da cena.",
        "requisitos": [],
        "limitacoes": [
          "Não cura Vida, não remove veneno e uso prolongado pode ser perigoso sem tratamento posterior."
        ],
        "observacoes": ""
      }
    ]
  },
  "magnetista": {
    "passiva": {
      "id": "sensibilidade-magnetica",
      "nome": "Sensibilidade Magnética",
      "tipo": "passiva",
      "subtipo": "",
      "iconeId": "habilidade-generica",
      "descricao": "",
      "acao": "Sempre ativa",
      "atributo": "intelecto",
      "gatilho": "Haver massa metálica ou campo magnético perceptível nas proximidades.",
      "teste": "Nenhum.",
      "custo": "Sem custo de Mana.",
      "custos": {
        "mana": 0,
        "pe": 0
      },
      "alcance": "6 metros",
      "alvo": "Ambiente",
      "dano": "",
      "duracao": "Enquanto consciente",
      "efeitos": [
        "Você percebe presença e direção aproximada de metais ferromagnéticos relevantes e alterações magnéticas próximas. Você recebe um bônus de +1 em testes para localizar mecanismo metálico oculto ou identificar orientação de peças."
      ],
      "falha": "Nenhuma.",
      "usosTexto": "Livre.",
      "recargaTexto": "Nenhuma.",
      "requisitos": [],
      "limitacoes": [
        "Não identifica composição exata, não localiza objetos minúsculos através de grande massa e pode ser confundida por campos intensos ou ambientes saturados de metal."
      ],
      "observacoes": ""
    },
    "iniciais": [
      {
        "id": "marcar-polaridade",
        "nome": "Marcar Polaridade",
        "tipo": "tecnica",
        "subtipo": "",
        "iconeId": "habilidade-generica",
        "descricao": "",
        "acao": "Ação",
        "atributo": "intelecto",
        "gatilho": "O alvo possuir metal suficiente ou ser um objeto metálico.",
        "teste": "Nenhum em objeto solto; Intelecto contra a Resistência ou a defesa apropriada em objeto carregado por criatura resistente.",
        "custo": "1 ponto de Mana.",
        "custos": {
          "mana": 1,
          "pe": 0
        },
        "alcance": "6 metros",
        "alvo": "Uma criatura com metal ou objeto metálico",
        "dano": "",
        "duracao": "Cena",
        "efeitos": [
          "Aplique uma polaridade simples ao alvo. A marca permite que suas técnicas magnéticas posteriores o atraiam, repilam ou usem como âncora. Você pode manter até dois alvos marcados."
        ],
        "falha": "A marca não se fixa em alvo resistente e o Mana é gasto.",
        "usosTexto": "Controlado pelo custo; máximo de dois alvos.",
        "recargaTexto": "Nenhuma.",
        "requisitos": [],
        "limitacoes": [
          "Não funciona em materiais não magnéticos sem componente adequado e a marca não causa dano por si só."
        ],
        "observacoes": ""
      },
      {
        "id": "atracao-repulsao",
        "nome": "Atração / Repulsão",
        "tipo": "tecnica",
        "subtipo": "",
        "iconeId": "habilidade-generica",
        "descricao": "",
        "acao": "Ação",
        "atributo": "intelecto",
        "gatilho": "Existir ao menos um alvo marcado por Polaridade.",
        "teste": "Teste de Intelecto contra a Resistência ou a defesa apropriada se tentar mover uma criatura; nenhum para objeto solto leve.",
        "custo": "Sem custo de Mana; exige uma Polaridade ativa.",
        "custos": {
          "mana": 0,
          "pe": 0
        },
        "alcance": "6 metros",
        "alvo": "Um alvo marcado",
        "dano": "",
        "duracao": "Instantânea",
        "efeitos": [
          "Mova um objeto metálico leve em até 3 metros. Contra criatura portando metal suficiente, em caso de sucesso, desloque-a 1 metro em direção escolhida coerente com atração ou repulsão."
        ],
        "falha": "A criatura não se move; objetos firmemente presos permanecem no lugar.",
        "usosTexto": "Livre enquanto houver marca válida.",
        "recargaTexto": "Nenhuma.",
        "requisitos": [],
        "limitacoes": [
          "Não arremessa criaturas, não remove armaduras vestidas e objetos pesados exigem apoio, alavanca ou circunstância favorável."
        ],
        "observacoes": ""
      },
      {
        "id": "ancora-magnetica",
        "nome": "Âncora Magnética",
        "tipo": "reacao",
        "subtipo": "",
        "iconeId": "habilidade-generica",
        "descricao": "",
        "acao": "Reação",
        "atributo": "intelecto",
        "gatilho": "Você ou um alvo marcado sofrer queda, empurrão ou deslocamento forçado perto de uma superfície ou objeto metálico adequado.",
        "teste": "Teste de Intelecto CD moderada em situações extremas.",
        "custo": "1 ponto de Mana.",
        "custos": {
          "mana": 1,
          "pe": 0
        },
        "alcance": "3 metros",
        "alvo": "Você ou um alvo marcado",
        "dano": "",
        "duracao": "Instantânea",
        "efeitos": [
          "Reduza em até 3 metros um deslocamento forçado ou queda, podendo impedir que o alvo seja derrubado quando a força for moderada."
        ],
        "falha": "O deslocamento ocorre normalmente.",
        "usosTexto": "1 reação por rodada, controlada pelo custo.",
        "recargaTexto": "Nenhuma.",
        "requisitos": [],
        "limitacoes": [
          "Exige massa metálica adequada para ancoragem e não detém impactos enormes ou quedas muito longas sozinho."
        ],
        "observacoes": ""
      }
    ]
  },
  "barometrico": {
    "passiva": {
      "id": "leitura-de-pressao",
      "nome": "Leitura de Pressão",
      "tipo": "passiva",
      "subtipo": "",
      "iconeId": "habilidade-generica",
      "descricao": "",
      "acao": "Sempre ativa",
      "atributo": "intelecto",
      "gatilho": "Haver ar ou outro meio gasoso ao redor.",
      "teste": "Nenhum.",
      "custo": "Sem custo de Mana.",
      "custos": {
        "mana": 0,
        "pe": 0
      },
      "alcance": "6 metros",
      "alvo": "Ambiente",
      "dano": "",
      "duracao": "Enquanto consciente",
      "efeitos": [
        "Você percebe pequenas mudanças de pressão, correntes e deslocamentos de ar. Você recebe um bônus de +1 em testes para notar movimento oculto próximo, mudanças de ventilação ou abertura repentina em ambiente fechado."
      ],
      "falha": "Nenhuma.",
      "usosTexto": "Livre.",
      "recargaTexto": "Nenhuma.",
      "requisitos": [],
      "limitacoes": [
        "Não substitui visão, não detecta criaturas completamente imóveis e perde precisão em tempestades, máquinas de ventilação intensa ou grandes correntes de ar."
      ],
      "observacoes": ""
    },
    "iniciais": [
      {
        "id": "pulso-barometrico",
        "nome": "Pulso Barométrico",
        "tipo": "tecnica",
        "subtipo": "",
        "iconeId": "habilidade-generica",
        "descricao": "",
        "acao": "Ação",
        "atributo": "intelecto",
        "gatilho": "Haver ar suficiente no espaço.",
        "teste": "Teste de Intelecto contra a Resistência ou a defesa apropriada das criaturas afetadas.",
        "custo": "1 ponto de Mana.",
        "custos": {
          "mana": 1,
          "pe": 0
        },
        "alcance": "Cone curto de 3 metros",
        "alvo": "Criaturas e objetos leves na área",
        "dano": "Até 1d4 por colisão",
        "duracao": "Instantânea",
        "efeitos": [
          "Se o alvo falhar, empurre-o 1 metro. Objetos leves podem ser deslocados em até 3 metros. Se o mestre permitir dano por colisão muito próxima, o máximo causado pela própria pressão é 1d4."
        ],
        "falha": "Criaturas resistentes não se movem.",
        "usosTexto": "Livre enquanto puder pagar o custo.",
        "recargaTexto": "Nenhuma.",
        "requisitos": [],
        "limitacoes": [
          "Não lança alvos grandes, não derruba automaticamente e é muito menos eficaz em espaços sem atmosfera adequada."
        ],
        "observacoes": ""
      },
      {
        "id": "bolsa-de-amortecimento",
        "nome": "Bolsa de Amortecimento",
        "tipo": "reacao",
        "subtipo": "",
        "iconeId": "habilidade-generica",
        "descricao": "",
        "acao": "Reação",
        "atributo": "",
        "gatilho": "Você ou uma criatura a até 3 metros sofrer queda, colisão ou impacto de movimento.",
        "teste": "Nenhum.",
        "custo": "1 ponto de Mana.",
        "custos": {
          "mana": 1,
          "pe": 0
        },
        "alcance": "3 metros",
        "alvo": "Uma criatura",
        "dano": "",
        "duracao": "Instantânea",
        "efeitos": [
          "Crie um bolsão de ar comprimido que reduz em 1d6 o dano de queda, colisão ou impacto relacionado a movimento."
        ],
        "falha": "Nenhuma.",
        "usosTexto": "1 reação por rodada, controlada pelo custo.",
        "recargaTexto": "Nenhuma.",
        "requisitos": [],
        "limitacoes": [
          "Não reduz dano cortante, perfurante ou energético que não derive do impacto amortecido."
        ],
        "observacoes": ""
      },
      {
        "id": "vacuo-parcial",
        "nome": "Vácuo Parcial",
        "tipo": "tecnica",
        "subtipo": "",
        "iconeId": "habilidade-generica",
        "descricao": "",
        "acao": "Ação",
        "atributo": "intelecto",
        "gatilho": "Haver uma área pequena de ar relativamente estável dentro do alcance.",
        "teste": "Teste de Intelecto contra CD ambiental; criaturas não fazem teste apenas para o efeito acústico.",
        "custo": "1 ponto de Mana.",
        "custos": {
          "mana": 1,
          "pe": 0
        },
        "alcance": "6 metros; área de 2 metros",
        "alvo": "Uma área pequena",
        "dano": "",
        "duracao": "Até o fim do próximo turno",
        "efeitos": [
          "Reduza fortemente a pressão local. Sons dentro da área ficam abafados, e testes que dependam de respiração, chama aberta ou fala clara recebem uma penalidade de −1 enquanto permanecerem nela."
        ],
        "falha": "A área perde coesão e dura apenas até o início do seu próximo turno.",
        "usosTexto": "Livre enquanto puder pagar o custo.",
        "recargaTexto": "Nenhuma.",
        "requisitos": [],
        "limitacoes": [
          "Não cria vácuo letal, não sufoca instantaneamente e não impede explosões ou som por meios sólidos."
        ],
        "observacoes": ""
      }
    ]
  },
  "oxidante": {
    "passiva": {
      "id": "olhar-de-desgaste",
      "nome": "Olhar de Desgaste",
      "tipo": "passiva",
      "subtipo": "",
      "iconeId": "habilidade-generica",
      "descricao": "",
      "acao": "Sempre ativa",
      "atributo": "intelecto",
      "gatilho": "Observar um objeto, armadura, arma ou mecanismo por alguns instantes.",
      "teste": "Nenhum.",
      "custo": "Sem custo de Mana.",
      "custos": {
        "mana": 0,
        "pe": 0
      },
      "alcance": "3 metros",
      "alvo": "Um objeto ou equipamento",
      "dano": "",
      "duracao": "Enquanto estiver analisando",
      "efeitos": [
        "Você identifica ferrugem, fadiga, juntas vulneráveis e sinais de manutenção deficiente. Você recebe um bônus de +1 em testes para sabotar, desmontar ou avaliar a condição de objetos degradáveis."
      ],
      "falha": "Nenhuma.",
      "usosTexto": "Livre.",
      "recargaTexto": "Nenhuma.",
      "requisitos": [],
      "limitacoes": [
        "Não revela defeitos internos completamente ocultos nem funciona em materiais sem processo de desgaste compatível."
      ],
      "observacoes": ""
    },
    "iniciais": [
      {
        "id": "oxidacao-acelerada",
        "nome": "Oxidação Acelerada",
        "tipo": "tecnica",
        "subtipo": "",
        "iconeId": "habilidade-generica",
        "descricao": "",
        "acao": "Ação",
        "atributo": "intelecto",
        "gatilho": "O alvo possuir metal ou material suscetível a degradação química.",
        "teste": "Teste de Intelecto contra defesa do portador ou CD do objeto.",
        "custo": "1 ponto de Mana.",
        "custos": {
          "mana": 1,
          "pe": 0
        },
        "alcance": "3 metros",
        "alvo": "Uma arma, armadura, mecanismo ou objeto",
        "dano": "",
        "duracao": "Cena",
        "efeitos": [
          "Em caso de sucesso, o alvo fica Degradado. Escolha uma função coerente: o próximo teste realizado com o equipamento recebe uma penalidade de −1, ou o próximo dano causado por uma arma degradada é reduzido em 1."
        ],
        "falha": "O efeito não se fixa.",
        "usosTexto": "1 marca de Degradação por alvo.",
        "recargaTexto": "Nenhuma.",
        "requisitos": [],
        "limitacoes": [
          "Não destrói equipamento instantaneamente, não atravessa proteção selada e não afeta materiais inertes à oxidação comum sem justificativa adicional."
        ],
        "observacoes": ""
      },
      {
        "id": "falha-programada",
        "nome": "Falha Programada",
        "tipo": "tecnica",
        "subtipo": "",
        "iconeId": "habilidade-generica",
        "descricao": "",
        "acao": "Ação",
        "atributo": "intelecto",
        "gatilho": "O alvo estar Degradado por você.",
        "teste": "Teste de Intelecto contra a defesa ou a CD do alvo.",
        "custo": "Sem custo de Mana; consome a marca de Degradação.",
        "custos": {
          "mana": 0,
          "pe": 0
        },
        "alcance": "3 metros",
        "alvo": "Um objeto, arma, armadura ou mecanismo degradado",
        "dano": "1d6 contra objeto",
        "duracao": "Instantânea; efeito até o fim do próximo turno",
        "efeitos": [
          "Em caso de sucesso, provoque uma falha simples: travar uma peça, soltar um encaixe, interromper um mecanismo por uma rodada ou causar 1d6 de dano direto a um objeto."
        ],
        "falha": "A Degradação é consumida, mas a falha induzida não acontece.",
        "usosTexto": "1 por marca de Degradação.",
        "recargaTexto": "Nenhuma.",
        "requisitos": [],
        "limitacoes": [
          "Não explode máquinas, não remove armadura vestida e não destrói estruturas robustas com um único uso."
        ],
        "observacoes": ""
      },
      {
        "id": "desgaste-reativo",
        "nome": "Desgaste Reativo",
        "tipo": "reacao",
        "subtipo": "",
        "iconeId": "habilidade-generica",
        "descricao": "",
        "acao": "Reação",
        "atributo": "",
        "gatilho": "Ser atingido por uma arma metálica ou mecanismo de contato degradável.",
        "teste": "Nenhum.",
        "custo": "Sem custo de Mana.",
        "custos": {
          "mana": 0,
          "pe": 0
        },
        "alcance": "Toque",
        "alvo": "O equipamento que atingiu você",
        "dano": "",
        "duracao": "Até o fim do próximo turno",
        "efeitos": [
          "Acelere o desgaste no ponto de contato. O próximo ataque ou teste realizado com esse equipamento recebe uma penalidade de −1."
        ],
        "falha": "Nenhuma.",
        "usosTexto": "1 por cena.",
        "recargaTexto": "Ao fim da cena.",
        "requisitos": [],
        "limitacoes": [
          "Não causa dano direto ao usuário, não afeta projéteis após o contato e não funciona contra materiais imunes ao processo."
        ],
        "observacoes": ""
      }
    ]
  },
  "fuliginario": {
    "passiva": {
      "id": "dominio-fuliginario",
      "nome": "Domínio Fuliginário",
      "tipo": "passiva",
      "subtipo": "",
      "iconeId": "habilidade-generica",
      "descricao": "",
      "acao": "Sempre ativa",
      "atributo": "intelecto",
      "gatilho": "Haver fuligem, fumaça pesada, cinzas finas ou partículas semelhantes disponíveis.",
      "teste": "Nenhum.",
      "custo": "Sem custo de Mana.",
      "custos": {
        "mana": 0,
        "pe": 0
      },
      "alcance": "3 metros",
      "alvo": "Partículas próximas",
      "dano": "",
      "duracao": "Enquanto houver material",
      "efeitos": [
        "Você consegue mover e concentrar pequenas quantidades de fuligem sem gerar densidade suficiente para cegar. Suas próprias partículas são reconhecíveis para você e não atrapalham sua orientação básica em curta distância."
      ],
      "falha": "Nenhuma.",
      "usosTexto": "Livre.",
      "recargaTexto": "Nenhuma.",
      "requisitos": [],
      "limitacoes": [
        "Não cria matéria do nada, não controla fumaça em grande escala e correntes fortes dispersam facilmente o material."
      ],
      "observacoes": ""
    },
    "iniciais": [
      {
        "id": "semear-fuligem",
        "nome": "Semear Fuligem",
        "tipo": "tecnica",
        "subtipo": "",
        "iconeId": "habilidade-generica",
        "descricao": "",
        "acao": "Ação",
        "atributo": "intelecto",
        "gatilho": "Possuir fuligem, cinzas ou uma fonte capaz de produzi-las.",
        "teste": "Nenhum em condições normais.",
        "custo": "1 ponto de Mana se não houver material abundante; caso contrário, nenhum.",
        "custos": {
          "mana": 1,
          "pe": 0
        },
        "alcance": "4 metros; área de 3 metros",
        "alvo": "Uma área pequena",
        "dano": "",
        "duracao": "Cena",
        "efeitos": [
          "Espalhe uma camada fina de partículas em uma área. A área passa a contar como seu território fuliginário para outras habilidades e pegadas ou movimentos físicos deixam perturbações visíveis nas partículas."
        ],
        "falha": "Nenhuma.",
        "usosTexto": "1 área principal ativa por vez.",
        "recargaTexto": "Nenhuma.",
        "requisitos": [],
        "limitacoes": [
          "Vento forte, chuva, limpeza ou passagem intensa pode remover o território antes do fim da cena."
        ],
        "observacoes": ""
      },
      {
        "id": "leitura-de-particulas",
        "nome": "Leitura de Partículas",
        "tipo": "passiva",
        "subtipo": "",
        "iconeId": "habilidade-generica",
        "descricao": "",
        "acao": "Sempre ativa",
        "atributo": "intelecto",
        "gatilho": "Uma criatura ou objeto se mover dentro de uma área Semear Fuligem ativa.",
        "teste": "Nenhum para movimento evidente; Intelecto contra Agilidade ou Furtividade para movimento cuidadoso.",
        "custo": "Sem custo de Mana.",
        "custos": {
          "mana": 0,
          "pe": 0
        },
        "alcance": "Dentro da área semeada",
        "alvo": "Criaturas e objetos em movimento",
        "dano": "",
        "duracao": "Enquanto a área existir",
        "efeitos": [
          "Você percebe perturbações nas partículas e recebe um bônus de +1 em testes para detectar movimento, direção ou passagem dentro da área, mesmo com visão prejudicada."
        ],
        "falha": "Movimento furtivo bem-sucedido não é localizado com precisão.",
        "usosTexto": "Livre.",
        "recargaTexto": "Nenhuma.",
        "requisitos": [],
        "limitacoes": [
          "Não identifica automaticamente quem se moveu, não revela criaturas completamente imóveis e não atravessa paredes."
        ],
        "observacoes": ""
      },
      {
        "id": "cortina-densa",
        "nome": "Cortina Densa",
        "tipo": "tecnica",
        "subtipo": "",
        "iconeId": "habilidade-generica",
        "descricao": "",
        "acao": "Ação",
        "atributo": "intelecto",
        "gatilho": "Ter uma área Semear Fuligem ativa.",
        "teste": "Nenhum.",
        "custo": "Consome a preparação da área; sem custo adicional de Mana.",
        "custos": {
          "mana": 0,
          "pe": 0
        },
        "alcance": "Área semeada",
        "alvo": "Uma área pequena",
        "dano": "",
        "duracao": "Até o fim do próximo turno",
        "efeitos": [
          "Concentre as partículas em uma cortina opaca. Testes visuais feitos através da área ou dentro dela recebem uma penalidade de −1. Você continua percebendo movimentos amplos pela Leitura de Partículas, se a possuir."
        ],
        "falha": "Nenhuma.",
        "usosTexto": "1 por área semeada.",
        "recargaTexto": "Nenhuma.",
        "requisitos": [],
        "limitacoes": [
          "Não causa cegueira total, não bloqueia sensores que independam de visão ou partículas, e correntes fortes podem encerrar o efeito antes."
        ],
        "observacoes": ""
      }
    ]
  },
  "ressonante": {
    "passiva": {
      "id": "sensibilidade-harmonica",
      "nome": "Sensibilidade Harmônica",
      "tipo": "passiva",
      "subtipo": "",
      "iconeId": "habilidade-generica",
      "descricao": "",
      "acao": "Sempre ativa",
      "atributo": "intelecto",
      "gatilho": "Haver vibração, som ou contato com uma estrutura.",
      "teste": "Nenhum.",
      "custo": "Sem custo de Mana.",
      "custos": {
        "mana": 0,
        "pe": 0
      },
      "alcance": "Até 6 metros ou toque",
      "alvo": "Ambiente, objetos e estruturas",
      "dano": "",
      "duracao": "Enquanto consciente",
      "efeitos": [
        "Você percebe vibrações anormais e diferenças grosseiras de ressonância. Você recebe um bônus de +1 em testes para encontrar cavidades, peças soltas, fontes vibratórias ou alterações estruturais por som e toque."
      ],
      "falha": "Nenhuma.",
      "usosTexto": "Livre.",
      "recargaTexto": "Nenhuma.",
      "requisitos": [],
      "limitacoes": [
        "Não funciona como sonar perfeito, não lê pensamentos e perde precisão em ambientes muito ruidosos ou vibrantes."
      ],
      "observacoes": ""
    },
    "iniciais": [
      {
        "id": "leitura-harmonica",
        "nome": "Leitura Harmônica",
        "tipo": "tecnica",
        "subtipo": "",
        "iconeId": "habilidade-generica",
        "descricao": "",
        "acao": "Ação",
        "atributo": "intelecto",
        "gatilho": "Ter contato ou linha de som clara com o alvo.",
        "teste": "Teste de Intelecto contra a CD do material ou da complexidade.",
        "custo": "Sem custo de Mana.",
        "custos": {
          "mana": 0,
          "pe": 0
        },
        "alcance": "Até 6 metros ou toque",
        "alvo": "Uma criatura, objeto ou estrutura",
        "dano": "",
        "duracao": "Cena",
        "efeitos": [
          "Em caso de sucesso, você identifica a frequência útil do alvo. O próximo uso de Ruptura Harmônica contra ele nesta cena recebe um bônus de +1 no teste. Contra objetos, também descobre um ponto de maior fragilidade vibratória."
        ],
        "falha": "Você obtém apenas uma frequência aproximada e não recebe bônus.",
        "usosTexto": "1 por alvo por cena.",
        "recargaTexto": "Ao fim da cena.",
        "requisitos": [],
        "limitacoes": [
          "Não revela composição completa nem garante que o alvo possa ser quebrado com a força disponível."
        ],
        "observacoes": ""
      },
      {
        "id": "contrafase",
        "nome": "Contrafase",
        "tipo": "reacao",
        "subtipo": "",
        "iconeId": "habilidade-generica",
        "descricao": "",
        "acao": "Reação",
        "atributo": "intelecto",
        "gatilho": "Você ou alvo a até 3 metros sofrer dano de impacto, som ou vibração perceptível.",
        "teste": "Nenhum.",
        "custo": "1 ponto de Mana.",
        "custos": {
          "mana": 1,
          "pe": 0
        },
        "alcance": "3 metros",
        "alvo": "Você, uma criatura ou um objeto",
        "dano": "",
        "duracao": "Instantânea",
        "efeitos": [
          "Produza vibração oposta e reduza em 1d6 o dano de impacto, sônico ou vibratório recebido."
        ],
        "falha": "Nenhuma.",
        "usosTexto": "1 reação por rodada, controlada pelo custo.",
        "recargaTexto": "Nenhuma.",
        "requisitos": [],
        "limitacoes": [
          "Não reduz dano químico, térmico, elétrico ou perfurante sem componente vibratório relevante."
        ],
        "observacoes": ""
      },
      {
        "id": "ruptura-harmonica",
        "nome": "Ruptura Harmônica",
        "tipo": "tecnica",
        "subtipo": "",
        "iconeId": "habilidade-generica",
        "descricao": "",
        "acao": "Ação",
        "atributo": "intelecto",
        "gatilho": "Ter realizado Leitura Harmônica no alvo nesta cena.",
        "teste": "Teste de Intelecto contra a defesa ou a CD do alvo.",
        "custo": "Sem custo de Mana; exige preparação com Leitura Harmônica.",
        "custos": {
          "mana": 0,
          "pe": 0
        },
        "alcance": "6 metros",
        "alvo": "Uma criatura, objeto ou estrutura",
        "dano": "1d6 sônico; 1d8 estrutural",
        "duracao": "Instantânea",
        "efeitos": [
          "Em caso de sucesso, cause 1d6 de dano sônico a uma criatura; ela recebe uma penalidade de −1 no próximo teste de equilíbrio ou movimento antes do fim do próximo turno. Contra objetos, cause 1d8 de dano estrutural."
        ],
        "falha": "Nenhum dano ou penalidade é aplicado.",
        "usosTexto": "1 por Leitura Harmônica válida.",
        "recargaTexto": "Nenhuma.",
        "requisitos": [],
        "limitacoes": [
          "Não pulveriza estruturas grandes, não causa surdez permanente e exige meio pelo qual a vibração possa alcançar o alvo."
        ],
        "observacoes": ""
      }
    ]
  },
  "operador-fantasma": {
    "passiva": {
      "id": "identidade-de-cobertura",
      "nome": "Identidade de Cobertura",
      "tipo": "passiva",
      "subtipo": "",
      "iconeId": "habilidade-generica",
      "descricao": "",
      "acao": "Sempre ativa",
      "atributo": "intelecto",
      "gatilho": "Manter comportamento, aparência e história coerentes com uma identidade assumida.",
      "teste": "Nenhum para manter a cobertura; testes ainda são exigidos quando alguém confronta ou investiga diretamente.",
      "custo": "Sem custo de Mana.",
      "custos": {
        "mana": 0,
        "pe": 0
      },
      "alcance": "Pessoal",
      "alvo": "Você",
      "dano": "",
      "duracao": "Cena ou enquanto a identidade for sustentável",
      "efeitos": [
        "Enquanto a cobertura permanecer coerente, receba um bônus de +1 no primeiro teste social ou furtivo da cena feito especificamente para agir como aquela identidade."
      ],
      "falha": "Nenhuma.",
      "usosTexto": "1 bônus por cena.",
      "recargaTexto": "Ao fim da cena.",
      "requisitos": [],
      "limitacoes": [
        "Contradições claras, documentação ausente ou reconhecimento pessoal podem anular o benefício até a cobertura ser restaurada."
      ],
      "observacoes": ""
    },
    "iniciais": [
      {
        "id": "janela-de-oportunidade",
        "nome": "Janela de Oportunidade",
        "tipo": "reacao",
        "subtipo": "",
        "iconeId": "habilidade-generica",
        "descricao": "",
        "acao": "Reação",
        "atributo": "agilidade",
        "gatilho": "Um observador se distrair, perder linha de visão ou surgir uma mudança súbita no ambiente.",
        "teste": "Teste de Agilidade contra a Percepção ou a defesa apropriada de quem poderia notar.",
        "custo": "Sem custo de Mana.",
        "custos": {
          "mana": 0,
          "pe": 0
        },
        "alcance": "Pessoal; até 3 metros de movimento",
        "alvo": "Você",
        "dano": "",
        "duracao": "Instantânea",
        "efeitos": [
          "Em caso de sucesso, mova-se até 3 metros ou realize uma interação simples, como ocultar um objeto pequeno, atravessar uma porta aberta ou trocar algo de lugar, sem chamar atenção imediata."
        ],
        "falha": "A ação ocorre, mas um observador percebe que algo mudou ou identifica sua movimentação.",
        "usosTexto": "1 por cena.",
        "recargaTexto": "Ao fim da cena.",
        "requisitos": [],
        "limitacoes": [
          "Não permite atacar sem consequências, atravessar espaço impossível ou realizar ações longas dentro da reação."
        ],
        "observacoes": ""
      },
      {
        "id": "plantar-narrativa",
        "nome": "Plantar Narrativa",
        "tipo": "tecnica",
        "subtipo": "",
        "iconeId": "habilidade-generica",
        "descricao": "",
        "acao": "Ação",
        "atributo": "intelecto",
        "gatilho": "Ter uma explicação plausível, elemento físico ou contexto social que possa sustentar a mentira.",
        "teste": "Teste de Intelecto contra a percepção, investigação ou resistência social do alvo.",
        "custo": "Sem custo de Mana.",
        "custos": {
          "mana": 0,
          "pe": 0
        },
        "alcance": "Até 6 metros durante uma cena social",
        "alvo": "Uma criatura, pequeno grupo ou situação",
        "dano": "",
        "duracao": "Cena",
        "efeitos": [
          "Em caso de sucesso, estabeleça uma versão plausível para um fato imediato: álibi, motivo, origem de objeto ou explicação para sua presença. Alvos que não possuam evidência contrária tratam a narrativa como plausível até surgir contradição."
        ],
        "falha": "A narrativa parece forçada; alvos atentos ficam desconfiados e podem investigar.",
        "usosTexto": "1 narrativa ativa por cena.",
        "recargaTexto": "Ao fim da cena.",
        "requisitos": [],
        "limitacoes": [
          "Não reescreve memórias, não obriga crença contra prova direta e perde força diante de contradições verificáveis."
        ],
        "observacoes": ""
      },
      {
        "id": "apagar-rastros",
        "nome": "Apagar Rastros",
        "tipo": "tecnica",
        "subtipo": "",
        "iconeId": "habilidade-generica",
        "descricao": "",
        "acao": "Ação",
        "atributo": "agilidade",
        "gatilho": "Ter acesso físico ao vestígio que deseja remover e alguns segundos para agir.",
        "teste": "Teste de Agilidade ou Intelecto, escolhido conforme o vestígio, contra CD da dificuldade.",
        "custo": "Sem custo de Mana.",
        "custos": {
          "mana": 0,
          "pe": 0
        },
        "alcance": "Toque; área pequena",
        "alvo": "Um vestígio físico ou informacional simples",
        "dano": "",
        "duracao": "Instantânea",
        "efeitos": [
          "Em caso de sucesso, remova ou disfarce um rastro simples deixado na cena: impressão, objeto fora do lugar, registro manual, sujeira, marca de passagem ou evidência superficial."
        ],
        "falha": "O vestígio permanece parcialmente reconhecível para alguém que o procure.",
        "usosTexto": "1 por cena.",
        "recargaTexto": "Ao fim da cena.",
        "requisitos": [],
        "limitacoes": [
          "Não apaga sistemas remotos, gravações inacessíveis, testemunhas, evidências já coletadas ou consequências de grande escala."
        ],
        "observacoes": ""
      }
    ]
  },
  "analista-de-padroes": {
    "passiva": {
      "id": "raciocinio-associativo",
      "nome": "Raciocínio Associativo",
      "tipo": "passiva",
      "subtipo": "",
      "iconeId": "habilidade-generica",
      "descricao": "",
      "acao": "Sempre ativa",
      "atributo": "intelecto",
      "gatilho": "Observar uma cena, sequência de eventos ou conjunto de informações relacionadas.",
      "teste": "Nenhum.",
      "custo": "Sem custo de Mana.",
      "custos": {
        "mana": 0,
        "pe": 0
      },
      "alcance": "Pessoal",
      "alvo": "Você",
      "dano": "",
      "duracao": "Cena",
      "efeitos": [
        "A primeira vez em uma cena que você conectar duas pistas ou comportamentos relacionados, receba um bônus de +1 no próximo teste de Intelecto diretamente ligado àquela relação."
      ],
      "falha": "Nenhuma.",
      "usosTexto": "1 por cena.",
      "recargaTexto": "Ao fim da cena.",
      "requisitos": [],
      "limitacoes": [
        "A conexão precisa ser sustentada por informação real. A passiva não inventa pistas e não confirma automaticamente uma teoria."
      ],
      "observacoes": ""
    },
    "iniciais": [
      {
        "id": "coleta-sistematica",
        "nome": "Coleta Sistemática",
        "tipo": "tecnica",
        "subtipo": "",
        "iconeId": "habilidade-generica",
        "descricao": "",
        "acao": "Ação",
        "atributo": "intelecto",
        "gatilho": "Ter acesso a uma pista, cena, documento, comportamento ou objeto relevante.",
        "teste": "Teste de Intelecto contra CD da complexidade ou ocultação.",
        "custo": "Sem custo de Mana.",
        "custos": {
          "mana": 0,
          "pe": 0
        },
        "alcance": "Toque ou até 6 metros, conforme a pista",
        "alvo": "Uma pista ou elemento da cena",
        "dano": "",
        "duracao": "Cena",
        "efeitos": [
          "Em caso de sucesso, registre uma Evidência narrativa clara e obtenha um detalhe útil associado a ela. Evidências podem servir de requisito para Inferência Tática e outras decisões investigativas."
        ],
        "falha": "A pista é registrada, mas sem detalhe adicional ou segurança suficiente para sustentar uma inferência mecânica.",
        "usosTexto": "1 por elemento por cena.",
        "recargaTexto": "Ao fim da cena.",
        "requisitos": [],
        "limitacoes": [
          "Não transforma ausência de informação em prova e não fornece fatos que o personagem não tenha meios de observar."
        ],
        "observacoes": ""
      },
      {
        "id": "inferencia-tatica",
        "nome": "Inferência Tática",
        "tipo": "tecnica",
        "subtipo": "",
        "iconeId": "habilidade-generica",
        "descricao": "",
        "acao": "Ação",
        "atributo": "intelecto",
        "gatilho": "Possuir ao menos duas Evidências coerentes sobre o mesmo alvo, evento ou padrão.",
        "teste": "Teste de Intelecto contra CD definida pela incerteza da situação.",
        "custo": "Compromete as Evidências usadas nesta inferência; sem custo de Mana.",
        "custos": {
          "mana": 0,
          "pe": 0
        },
        "alcance": "Na própria cena ou até 12 metros para um alvo visível",
        "alvo": "Uma criatura, rota, evento ou problema",
        "dano": "",
        "duracao": "Até o fim da cena ou até a previsão ser testada",
        "efeitos": [
          "Em caso de sucesso, formule uma conclusão útil. Escolha um efeito coerente: conceder um bônus de +1 ao próximo teste do grupo contra o alvo; identificar a rota mais provável; apontar uma vulnerabilidade situacional; ou prever a próxima ação simples do padrão analisado."
        ],
        "falha": "A inferência é inconclusiva; as Evidências permanecem, mas não geram bônus nesta tentativa.",
        "usosTexto": "1 inferência sobre o mesmo conjunto de evidências por cena.",
        "recargaTexto": "Ao fim da cena.",
        "requisitos": [],
        "limitacoes": [
          "Não prevê decisões totalmente aleatórias, não lê pensamentos e conclusões podem deixar de valer se o contexto mudar de forma relevante."
        ],
        "observacoes": ""
      },
      {
        "id": "contradicao",
        "nome": "Contradição",
        "tipo": "reacao",
        "subtipo": "",
        "iconeId": "habilidade-generica",
        "descricao": "",
        "acao": "Reação",
        "atributo": "intelecto",
        "gatilho": "Receber uma informação nova que conflite com Evidências já estabelecidas.",
        "teste": "Teste de Intelecto contra CD da sutileza da contradição.",
        "custo": "Sem custo de Mana.",
        "custos": {
          "mana": 0,
          "pe": 0
        },
        "alcance": "Pessoal (informação percebida)",
        "alvo": "Você e a informação",
        "dano": "",
        "duracao": "Instantânea",
        "efeitos": [
          "Em caso de sucesso, identifique imediatamente qual elemento não se encaixa no padrão. Em seguida, escolha: você recebe um bônus de +1 no próximo teste para investigar a inconsistência; ou um aliado informado por você recebe um bônus de +1 no próximo teste para reagir à consequência imediata."
        ],
        "falha": "Você percebe que algo está errado, mas não identifica o ponto exato da inconsistência.",
        "usosTexto": "1 por cena.",
        "recargaTexto": "Ao fim da cena.",
        "requisitos": [],
        "limitacoes": [
          "Não revela automaticamente qual informação é falsa; apenas localiza o conflito lógico ou factual."
        ],
        "observacoes": ""
      }
    ]
  }
});

  const templatesPorId = new Map();
  Object.values(definicoesPorClasse).forEach(function (definicao) {
    [definicao.passiva].concat(definicao.iniciais).forEach(function (template) {
      if (templatesPorId.has(template.id)) {
        throw new Error(`Template de habilidade de classe duplicado: ${template.id}`);
      }
      templatesPorId.set(template.id, template);
    });
  });

  function clonar(valor) {
    return JSON.parse(JSON.stringify(valor));
  }

  function obterTemplate(templateId) {
    const template = templatesPorId.get(templateId);
    return template ? clonar(template) : null;
  }

  function ehConcessaoDeClasse(habilidade) {
    return habilidade?.origem?.tipo === "classe";
  }

  function criarChaveDaConcessao(fonteId, templateId, concessao) {
    return `${fonteId}::${templateId}::${concessao}`;
  }

  function obterChaveDaHabilidade(habilidade) {
    if (!ehConcessaoDeClasse(habilidade)) return "";
    return criarChaveDaConcessao(
      habilidade.origem.fonteId,
      habilidade.templateId,
      habilidade.origem.concessao
    );
  }

  function obterConcessoesEsperadas(classe) {
    if (!classe || classe.importada === true) return [];
    const idsIniciais = Array.isArray(classe.habilidadesIniciaisIds)
      ? classe.habilidadesIniciaisIds
      : [];
    return [
      { templateId: classe.passivaBaseId, concessao: "passiva-base" },
      ...idsIniciais.map(function (templateId) {
        return { templateId, concessao: "inicial" };
      })
    ].filter(function (item) {
      return typeof item.templateId === "string" && templatesPorId.has(item.templateId);
    });
  }

  function reconciliarHabilidadesDaClasse(personagem, classe, normalizarHabilidade) {
    if (!personagem || !Array.isArray(personagem.habilidades) || typeof normalizarHabilidade !== "function") {
      return [];
    }

    const fonteId = String(classe?.id ?? "").trim();
    const esperadas = obterConcessoesEsperadas(classe);
    const chavesEsperadas = new Set(esperadas.map(function (item) {
      return criarChaveDaConcessao(fonteId, item.templateId, item.concessao);
    }));
    const chavesMantidas = new Set();
    const reconciliadas = [];

    personagem.habilidades.forEach(function (habilidade) {
      if (!ehConcessaoDeClasse(habilidade)) {
        reconciliadas.push(habilidade);
        return;
      }

      const chave = obterChaveDaHabilidade(habilidade);
      if (!chavesEsperadas.has(chave) || chavesMantidas.has(chave)) return;
      habilidade.removivel = false;
      reconciliadas.push(habilidade);
      chavesMantidas.add(chave);
    });

    esperadas.forEach(function (concessao) {
      const chave = criarChaveDaConcessao(fonteId, concessao.templateId, concessao.concessao);
      if (chavesMantidas.has(chave)) return;
      const template = obterTemplate(concessao.templateId);
      if (!template) return;
      delete template.id;
      reconciliadas.push(normalizarHabilidade({
        ...template,
        templateId: concessao.templateId,
        origem: {
          tipo: "classe",
          fonteId,
          concessao: concessao.concessao
        },
        removivel: false
      }));
      chavesMantidas.add(chave);
    });

    personagem.habilidades = reconciliadas;
    return reconciliadas;
  }

  global.GrimorioClassAbilitiesDomain = Object.freeze({
    definicoesPorClasse,
    obterTemplate,
    obterConcessoesEsperadas,
    reconciliarHabilidadesDaClasse
  });
})(typeof window === "undefined" ? globalThis : window);
