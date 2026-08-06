const personagem = {
  nome: "",
  jogador: "",
  campanha: "",
  mestre: "",
  retrato: null,
  especie: null,
  varianteEspecie: null,
  atributosEspecie: [],
  afinidadeEspecie: null,
  classe: null,
  classeImportada: false,
  origem: {
    titulo: "",
    local: "",
    historia: ""
  },
  atributos: {
    forca: 0,
    agilidade: 0,
    intelecto: 0,
    resistencia: 0
  },
  pericias: {
    acrobacia: false,
    adestramento: false,
    atuacao: false,
    cavalaria: false,
    conhecimento: false,
    diplomacia: false,
    enganacao: false,
    fortitude: false,
    furtividade: false,
    destreza: false,
    iniciativa: false,
    intimidacao: false,
    intuicao: false,
    investigacao: false,
    luta: false,
    misticismo: false,
    percepcao: false,
    pontaria: false,
    reflexos: false,
    religiao: false,
    sobrevivencia: false,
    vontade: false
  },
  nivel: 1,
  experiencia: 0,
  pontosEvolucao: 0,
  pontosGloria: 0,
  recursos: {
    vidaAtual: 20,
    vidaMaxima: 20,
    manaAtual: 10,
    manaMaxima: 10
  },
  combate: {
    defesa: 0,
    reducaoDano: 0,
    iniciativa: 0,
    movimento: 0
  },
  modificadoresTemporarios: {
    forca: 0,
    agilidade: 0,
    intelecto: 0,
    resistencia: 0
  },
  armas: [],
  habilidades: [],
  inventario: []
};

const MODELO_PERSONAGEM = JSON.parse(JSON.stringify(personagem));

const CONFIGURACAO_ATRIBUTOS = {
  pontosDisponiveis: 10,
  valorInicial: 0,
  limiteFinalNormal: 5,
  limiteFinalAfinidade: 6,

  custosPorNivel: {
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5
  }
};

const CONFIGURACAO_PERICIAS = {
  limiteTreinadas: 3,
  dadoTreinado: "1d20",
  dadoNaoTreinado: "1d12"
};

const atributosDeMeridian = [
  {
    id: "forca",
    nome: "Força",
    sigla: "FOR",
    descricao: "Poder físico, impacto, levantamento e esforço muscular."
  },
  {
    id: "agilidade",
    nome: "Agilidade",
    sigla: "AGI",
    descricao: "Reflexos, precisão, equilíbrio, velocidade e coordenação."
  },
  {
    id: "intelecto",
    nome: "Intelecto",
    sigla: "INT",
    descricao: "Conhecimento, análise, raciocínio, tecnologia e controle técnico."
  },
  {
    id: "resistencia",
    nome: "Resistência",
    sigla: "RES",
    descricao: "Vitalidade, tolerância física, estabilidade e capacidade de suportar danos."
  }
];

const PERICIAS = [
  { id: "acrobacia", nome: "Acrobacia", atributo: "agilidade" },
  { id: "adestramento", nome: "Adestramento", atributo: "intelecto" },
  { id: "atuacao", nome: "Atuação", atributo: "intelecto" },
  { id: "cavalaria", nome: "Cavalaria", atributo: "agilidade" },
  { id: "conhecimento", nome: "Conhecimento", atributo: "intelecto" },
  { id: "diplomacia", nome: "Diplomacia", atributo: "intelecto" },
  { id: "enganacao", nome: "Enganação", atributo: "intelecto" },
  { id: "fortitude", nome: "Fortitude", atributo: "resistencia" },
  { id: "furtividade", nome: "Furtividade", atributo: "agilidade" },
  { id: "destreza", nome: "Destreza", atributo: "agilidade" },
  { id: "iniciativa", nome: "Iniciativa", atributo: "agilidade" },
  { id: "intimidacao", nome: "Intimidação", atributo: "forca" },
  { id: "intuicao", nome: "Intuição", atributo: "intelecto" },
  { id: "investigacao", nome: "Investigação", atributo: "intelecto" },
  { id: "luta", nome: "Luta", atributo: "forca" },
  { id: "misticismo", nome: "Misticismo", atributo: "intelecto" },
  { id: "percepcao", nome: "Percepção", atributo: "intelecto" },
  { id: "pontaria", nome: "Pontaria", atributo: "agilidade" },
  { id: "reflexos", nome: "Reflexos", atributo: "agilidade" },
  { id: "religiao", nome: "Religião", atributo: "intelecto" },
  { id: "sobrevivencia", nome: "Sobrevivência", atributo: "resistencia" },
  { id: "vontade", nome: "Vontade", atributo: "resistencia" }
];

const PERICIAS_POR_PAGINA = 11;

const atributosDisponiveis = ["Força", "Agilidade", "Intelecto", "Resistência"];

const especies = [
  {
    id: "humano",
    nome: "Humano",
    resumo: "Versatilidade, aprendizado e improviso.",
    imagem: "./assets/especies/humano.png",
    imagemAlt: "RepresentaÃ§Ã£o visual de um Humano de Meridian",
    descricao: "Humanos transformam experiência, preparação e criatividade em ferramentas para sobreviver aos ambientes mais diversos.",
    atributos: ["+1 em dois atributos diferentes, escolhidos durante a criação."],
    afinidade: "Potencial Aberto — escolha qualquer atributo para aumentar futuramente seu limite máximo em 1.",
    traco: {
      nome: "Traço — Plasticidade",
      descricao: "O Humano começa com uma perícia adicional, uma especialização adicional e treinamento básico com uma ferramenta, arma ou equipamento.\n\nAdaptações artificiais, próteses e implantes possuem menor custo ou menos penalidades para Humanos."
    },
    habilidade: {
      nome: "Habilidade — Improviso",
      descricao: "Uma vez por cena, depois de falhar em um teste, o Humano pode repetir a rolagem.\n\nNa segunda tentativa recebe +2 no teste, mas precisa aceitar o novo resultado."
    },
    vulnerabilidade: {
      nome: "Limitação — Corpo Comum",
      descricao: "Humanos não possuem resistência natural contra calor, frio, gases, escuridão, pressão, toxinas ou ambientes aquáticos.\n\nDependem de equipamentos e preparação."
    },
    vulnerabilidadeResumo: "Sem resistências ambientais naturais.",
    estilo: "A escolha de quem procura flexibilidade, perícias e liberdade para construir um personagem muito específico.",
    variantes: []
  },
  {
    id: "vesperiano",
    imagem: "./assets/especies/vesperiano.png",
    imagemAlt: "Representacao visual de um Vesperiano de Meridian",
    nome: "Vesperiano",
    resumo: "Especialista em escuridão, percepção e emboscadas.",
    descricao: "Sua percepção é moldada para ambientes sem luz, onde movimento e vibração importam mais do que cor e detalhe.",
    atributos: ["+2 Agilidade", "+1 Intelecto", "–1 Resistência"],
    afinidade: "Agilidade",
    traco: {
      nome: "Traço — Mapeamento Sensorial",
      descricao: "Em escuridão ou iluminação fraca, o Vesperiano identifica movimento, distância, direção, quantidade aproximada de criaturas, obstáculos próximos e vibrações no chão e nas paredes.\n\nNão identifica cores, textos ou detalhes minúsculos sem luz.\n\nNo escuro, não pode ser surpreendido por movimentos comuns, ignora penalidades de baixa iluminação e recebe +2 para localizar criaturas escondidas."
    },
    habilidade: {
      nome: "Habilidade — Caçador do Breu",
      descricao: "Uma vez por cena, durante duas rodadas:\n\n• recebe +2 em Furtividade;\n• recebe +2 no primeiro ataque de cada rodada;\n• seu deslocamento não produz ruído;\n• inimigos não realizam ataques de reação contra seu movimento enquanto ele estiver em uma área escura."
    },
    vulnerabilidade: {
      nome: "Vulnerabilidade — Fotossensibilidade",
      descricao: "Clarões, explosões luminosas ou luz intensa repentina causam, durante uma rodada:\n\n• –2 em ataques à distância;\n• –2 em Percepção;\n• impossibilidade de usar Caçador do Breu.\n\nLentes especiais reduzem a penalidade para –1, mas não a anulam."
    },
    vulnerabilidadeResumo: "Clarões causam penalidades por uma rodada.",
    estilo: "",
    variantes: []
  },
  {
    id: "ferrano",
    imagem: "./assets/especies/ferrano.png",
    imagemAlt: "Representacao visual de um Ferrano de Meridian",
    nome: "Ferrano",
    resumo: "Resistência física, estabilidade e grande densidade corporal.",
    descricao: "Ferranos possuem corpos densos e estruturais, difíceis de mover e preparados para absorver impacto.",
    atributos: ["+2 Resistência", "+1 Força", "–1 Agilidade"],
    afinidade: "Resistência",
    fisicos: ["+4 de Vida máxima", "Deslocamento terrestre reduzido em 1 metro", "Peso corporal aproximadamente 50% maior"],
    traco: {
      nome: "Traço — Corpo Estrutural",
      descricao: "Reduz em 1 ponto todo dano físico recebido.\n\nRecebe +2 contra empurrões, quedas, agarrões, esmagamentos, perda de equilíbrio e efeitos que tentem derrubá-lo.\n\nA redução não funciona contra dano interno, veneno, eletricidade ou efeitos mentais."
    },
    habilidade: {
      nome: "Habilidade — Ancoragem",
      descricao: "Uma vez por cena, como reação, o Ferrano pode ancorar o corpo.\n\nAté o início do próximo turno:\n\n• reduz pela metade o dano físico de um ataque;\n• não pode ser empurrado ou derrubado;\n• interrompe movimento forçado;\n• criaturas que colidirem com ele também sofrem o impacto.\n\nEnquanto estiver ancorado, não pode se deslocar."
    },
    vulnerabilidade: {
      nome: "Vulnerabilidade — Massa Excessiva",
      descricao: "Possui deslocamento reduzido, sofre –2 em Natação, afunda rapidamente sem equipamento e sofre –1 em Furtividade ao correr ou usar armadura pesada.\n\nPisos frágeis, estruturas antigas e veículos pequenos podem não suportar seu peso."
    },
    vulnerabilidadeResumo: "Peso e densidade dificultam furtividade, natação e estruturas frágeis.",
    estilo: "",
    variantes: []
  },
  {
    id: "nacaro",
    imagem: "./assets/especies/nacaro.png",
    imagemAlt: "Representacao visual de um Nacaro de Meridian",
    nome: "Nácaro",
    resumo: "Mobilidade, evasão e adaptação a ambientes aquáticos.",
    descricao: "Nácaros combinam flexibilidade corporal e domínio de ambientes aquáticos com respostas defensivas rápidas.",
    atributos: ["+2 Agilidade", "+1 Resistência", "–1 Força"],
    afinidade: "Agilidade",
    fisicos: ["Deslocamento terrestre normal", "Deslocamento aquático de 12 metros", "Pode permanecer submerso por até uma hora"],
    traco: {
      nome: "Traço — Corpo Anfíbio",
      descricao: "Age normalmente dentro da água, ignora penalidades de combate em áreas alagadas, recebe +2 contra gases inalados e fumaça, enxerga formas e movimentos em água turva e atravessa espaços estreitos como se fosse uma categoria corporal menor."
    },
    habilidade: {
      nome: "Habilidade — Reflexo de Corrente",
      descricao: "Uma vez por cena, quando for alvo de um ataque, escolhe:\n\nDESLIZAR\nMove-se até 3 metros sem provocar ataques de reação. Caso saia do alcance, o ataque erra automaticamente.\n\nCONTORCER\nPermanece no lugar e recebe +3 de Defesa contra aquele ataque. Caso ainda seja atingido, o dano é reduzido pela metade."
    },
    vulnerabilidade: {
      nome: "Vulnerabilidade — Desidratação",
      descricao: "Após uma cena inteira em calor intenso, ambiente muito seco ou próximo de caldeiras sem proteção:\n\n• sofre –1 em Resistência;\n• não pode usar Reflexo de Corrente;\n• perde 1 metro de deslocamento.\n\nA condição termina depois de hidratação adequada."
    },
    vulnerabilidadeResumo: "Calor intenso reduz RES e impede Reflexo de Corrente.",
    estilo: "",
    variantes: []
  },
  {
    id: "quimerico",
    imagem: "./assets/especies/quimerico.png",
    imagemAlt: "Representacao visual de um Quimerico de Meridian",
    nome: "Quimérico",
    resumo: "Instintos, sentidos predominantes e adaptações de diferentes linhagens.",
    descricao: "Quiméricos manifestam adaptações próprias de uma Linhagem. Escolha uma Linhagem para revelar seus modificadores e capacidades.",
    atributos: ["Escolha uma Linhagem e depois um atributo adicional diferente do atributo principal."],
    afinidade: "Definida pela Linhagem",
    traco: null,
    habilidade: null,
    vulnerabilidade: null,
    estilo: "",
    variantes: [
      {
        id: "felina",
        nome: "Felina",
        principal: "Agilidade",
        atributos: ["+2 Agilidade", "+1 em outro atributo", "–1 Resistência"],
        afinidade: "Agilidade",
        traco: { nome: "Traço — Equilíbrio Predatório", descricao: "Reduz dano de queda pela metade, recebe +2 para escalar, não sofre penalidade ao lutar sobre estruturas estreitas e enxerga normalmente em iluminação fraca." },
        habilidade: { nome: "Habilidade — Salto Predatório", descricao: "Uma vez por cena, salta até metade do deslocamento e realiza um ataque.\n\nO ataque recebe +2 para acertar, causa dano adicional e derruba o alvo caso ele seja menor ou esteja desprevenido." },
        vulnerabilidade: { nome: "Vulnerabilidade", descricao: "Clarões e ruídos intensos impedem o uso do Salto Predatório durante uma rodada." },
        vulnerabilidadeResumo: "Clarões e ruídos intensos impedem Salto Predatório."
      },
      {
        id: "canidea",
        nome: "Canídea",
        principal: "Resistência",
        atributos: ["+2 Resistência", "+1 em outro atributo", "–1 Intelecto"],
        afinidade: "Resistência",
        traco: { nome: "Traço — Rastreador", descricao: "Reconhece e acompanha pessoas pelo cheiro.\n\nRecebe +2 para rastrear, identificar venenos, perceber sangue e detectar criaturas escondidas próximas." },
        habilidade: { nome: "Habilidade — Instinto de Matilha", descricao: "Uma vez por cena, escolhe um aliado próximo.\n\nDurante duas rodadas, ambos recebem +1 em ataques e Defesa.\n\nQuando um for atingido, o outro pode mover-se 2 metros como reação." },
        vulnerabilidade: { nome: "Vulnerabilidade", descricao: "Gases, odores químicos e substâncias muito fortes causam –2 em Percepção e rastreamento." },
        vulnerabilidadeResumo: "Gases e odores fortes prejudicam Percepção e rastreamento."
      },
      {
        id: "caprina",
        nome: "Caprina",
        principal: "Força",
        atributos: ["+2 Força", "+1 em outro atributo", "–1 Agilidade"],
        afinidade: "Força",
        traco: { nome: "Traço — Base Firme", descricao: "Recebe +2 contra empurrões, quedas, perda de equilíbrio e recuo.\n\nAtravessa terrenos inclinados ou irregulares sem redução de movimento." },
        habilidade: { nome: "Habilidade — Investida", descricao: "Uma vez por cena, move-se em linha reta e atinge uma criatura.\n\nQuanto maior a distância, maior o impacto.\n\nPode empurrar, derrubar, quebrar portas, destruir coberturas ou interromper uma ação." },
        vulnerabilidade: { nome: "Vulnerabilidade", descricao: "A Investida não pode ser usada em espaços estreitos ou sem uma linha adequada de movimento." },
        vulnerabilidadeResumo: "Espaços estreitos impedem Investida."
      },
      {
        id: "reptiliana",
        nome: "Reptiliana",
        principal: "Resistência",
        atributos: ["+2 Resistência", "+1 em outro atributo", "–1 Agilidade"],
        afinidade: "Resistência",
        traco: { nome: "Traço — Regulação Biológica", descricao: "Recebe +2 contra venenos e doenças, reduz dano químico em 1, consegue permanecer imóvel por longos períodos e necessita de menos alimento." },
        habilidade: { nome: "Habilidade — Estado de Conservação", descricao: "Uma vez por cena, ao ficar com metade da Vida ou menos, reduz seu metabolismo durante duas rodadas:\n\n• recebe +2 em Resistência;\n• reduz todo dano recebido em 1;\n• não pode sofrer Sangramento;\n• efeitos de veneno ficam suspensos." },
        vulnerabilidade: { nome: "Vulnerabilidade", descricao: "Em frio extremo, sofre –2 em Agilidade e não pode usar Estado de Conservação." },
        vulnerabilidadeResumo: "Frio extremo reduz AGI e bloqueia Estado de Conservação."
      }
    ]
  },
  {
    id: "caldeano",
    imagem: "./assets/especies/caldeano.png",
    imagemAlt: "Representacao visual de um Caldeano de Meridian",
    nome: "Caldeano",
    resumo: "Resistência ao calor, esforço extremo e superaquecimento.",
    descricao: "Caldeanos convertem calor e esforço em potência temporária. Escolha a Formação que definiu seu desenvolvimento.",
    atributos: ["Escolha uma Formação para definir os modificadores."],
    afinidade: "Resistência",
    traco: {
      nome: "Traço — Metabolismo Térmico",
      descricao: "Ignora calor comum, recebe +2 contra fumaça, exaustão e queimaduras, reduz dano de fogo em 2, age normalmente em áreas superaquecidas e recupera-se mais rapidamente de esforço físico."
    },
    habilidade: {
      nome: "Habilidade — Superaquecimento",
      descricao: "Uma vez por cena, durante duas rodadas, escolhe um modo:\n\nPOTÊNCIA\n+2 em Força, +2 no dano físico e maior facilidade para quebrar objetos e coberturas.\n\nACELERAÇÃO MENTAL\n+2 em Intelecto, uma interação adicional com equipamento, arma ou mecanismo e ignora penalidades de concentração.\n\nPERSISTÊNCIA\n+2 em Resistência, ignora dor e exaustão e continua consciente ao chegar a 0 de Vida até o final do próximo turno.\n\nDepois, sofre –1 em todos os testes físicos durante uma rodada."
    },
    vulnerabilidade: {
      nome: "Vulnerabilidade — Choque Térmico",
      descricao: "Frio extremo causa –2 em Agilidade, reduz o deslocamento em 2 metros e impede o uso de Superaquecimento.\n\nSer atingido por frio intenso enquanto está superaquecido causa dano adicional."
    },
    vulnerabilidadeResumo: "Frio extremo reduz AGI, Movimento e bloqueia Superaquecimento.",
    estilo: "",
    variantes: [
      { id: "operario", nome: "Operário", atributos: ["+2 Resistência", "+1 Força", "–1 Agilidade"], afinidade: "Resistência" },
      { id: "tecnico", nome: "Técnico", atributos: ["+2 Resistência", "+1 Intelecto", "–1 Agilidade"], afinidade: "Resistência" }
    ]
  }
];

const classes = [
  {
    id: "experimentalista",
    nome: "Experimentalista",
    categoria: "Científicas e tecnológicas",
    resumo: "Estuda fenômenos desconhecidos e cria soluções durante a aventura.",
    descricao: "O Experimentalista coleta amostras de criaturas, substâncias, runas, próteses e anomalias. Não fabrica apenas equipamentos prontos: observa problemas, formula teorias e transforma descobertas em soluções temporárias.",
    mecanica: {
      nome: "Hipóteses",
      descricao: "Ao observar um fenômeno, formula uma hipótese. Quando a confirma, recebe uma Descoberta, que pode virar antídoto, arma, sensor ou vantagem contra aquele fenômeno.",
      usos: ["Investigar como criaturas percebem o ambiente", "Identificar dependências de próteses e runas", "Transformar Descobertas em soluções temporárias"]
    },
    risco: { nome: "Resultado inesperado", descricao: "Uma hipótese incorreta pode fazer o experimento produzir efeitos imprevisíveis." },
    especializacoes: [
      { nome: "Naturalista", descricao: "Criaturas, plantas e mutações." },
      { nome: "Físico Industrial", descricao: "Energia, pressão, temperatura e materiais." },
      { nome: "Pesquisador Rúnico", descricao: "Poderes naturais e runas governamentais." }
    ],
    focos: ["Investigação", "Preparação", "Adaptação", "Exploração de fraquezas"],
    importada: false
  },
  {
    id: "protesico",
    nome: "Protésico",
    categoria: "Científicas e tecnológicas",
    resumo: "Especialista em conectar carne, metal e impulsos nervosos.",
    descricao: "Constrói próteses, instala módulos, realiza manutenção e altera corpos mecânicos durante uma missão.",
    mecanica: {
      nome: "Interfaces",
      descricao: "Equipa aliados com módulos e pode sobrecarregar temporariamente uma prótese para conceder uma função adicional.",
      usos: ["Instalar olhos térmicos, placas e órgãos artificiais", "Adaptar reservatórios e condutores elementais", "Manter e sobrecarregar próteses"]
    },
    risco: { nome: "Rejeição", descricao: "Cada modificação aumenta a chance de dor fantasma, falha nervosa ou rejeição mecânica." },
    especializacoes: [
      { nome: "Cirurgião Mecânico", descricao: "Suporte e instalação." },
      { nome: "Escultor de Guerra", descricao: "Próteses de combate." },
      { nome: "Transumanista", descricao: "Substituição progressiva do próprio corpo." }
    ],
    focos: ["Suporte", "Aprimoramento", "Manutenção", "Modificação corporal"],
    importada: false
  },
  {
    id: "maquinista",
    nome: "Maquinista",
    categoria: "Científicas e tecnológicas",
    resumo: "Constrói e controla máquinas autônomas.",
    descricao: "Enquanto o Experimentalista descobre e o Protésico modifica corpos, o Maquinista cria e coordena autômatos.",
    mecanica: {
      nome: "Rede de Comando",
      descricao: "Distribui comandos entre suas máquinas. Quanto mais máquinas estiver controlando, mais simples precisam ser as ordens.",
      usos: ["Proteger, perseguir e observar", "Transportar, reparar e iluminar", "Atacar ou bloquear passagens"]
    },
    risco: { nome: "Interferência", descricao: "Danos ao transmissor, campos magnéticos ou sinais falsos podem fazer os autômatos interpretarem comandos incorretamente." },
    especializacoes: [
      { nome: "Enxameiro", descricao: "Vários autômatos pequenos." },
      { nome: "Condutor", descricao: "Uma máquina grande e personalizável." },
      { nome: "Sentinela", descricao: "Torres, câmeras e defesa de área." }
    ],
    focos: ["Controle de campo", "Autômatos", "Defesa", "Utilidade"],
    importada: false
  },
  {
    id: "engenheiro-runico",
    nome: "Engenheiro Rúnico",
    categoria: "Científicas e tecnológicas",
    resumo: "Interfere nas runas implantadas pelo governo.",
    descricao: "Não depende necessariamente de um grande poder natural. Sua força está em compreender e alterar o sistema utilizado para controlar os outros.",
    mecanica: {
      nome: "Reprogramação",
      descricao: "Interfere temporariamente nas regras, identidades e punições de runas e selos governamentais.",
      usos: ["Enfraquecer uma runa ou silenciar um poder", "Criar runas, permissões e assinaturas falsas", "Transferir punições e sobrecarregar selos"]
    },
    risco: { nome: "Rastreamento", descricao: "Toda interferência deixa uma assinatura que pode ser detectada pelas autoridades." },
    especializacoes: [
      { nome: "Libertador", descricao: "Remove limitações." },
      { nome: "Inibidor", descricao: "Bloqueia poderes." },
      { nome: "Falsificador", descricao: "Cria identidades, permissões e assinaturas falsas." }
    ],
    focos: ["Runas", "Sabotagem", "Controle", "Falsificação"],
    importada: false
  },
  {
    id: "quimico-de-campo",
    nome: "Químico de Campo",
    categoria: "Científicas e tecnológicas",
    resumo: "Combina substâncias para produzir efeitos durante missões.",
    descricao: "Utiliza gases, medicamentos, ácidos, combustíveis e catalisadores. Pode curar um aliado, incendiar uma sala ou dissolver uma fechadura.",
    mecanica: {
      nome: "Reagentes",
      descricao: "Antes da missão escolhe reagentes básicos e, durante a aventura, combina dois ou mais para criar novos efeitos.",
      usos: ["Produzir estimulantes, anestésicos e coagulantes", "Criar fumaça, cola, espuma e solventes", "Preparar ácidos, venenos e combustíveis"]
    },
    risco: { nome: "Contaminação", descricao: "Misturas repetidas deixam resíduos no corpo e nos equipamentos." },
    especializacoes: [
      { nome: "Farmacêutico", descricao: "Cura e estimulantes." },
      { nome: "Toxicologista", descricao: "Venenos e enfraquecimento." },
      { nome: "Demolidor Químico", descricao: "Ácidos, combustíveis e reações violentas." }
    ],
    focos: ["Preparação", "Cura", "Enfraquecimento", "Área"],
    importada: false
  },
  {
    id: "hemurgista",
    nome: "Hemurgista",
    categoria: "Biológicas",
    resumo: "Controla o próprio sangue e o sangue recentemente derramado.",
    descricao: "A Hemurgia não é ilimitada. Toda técnica exige sangue real e cobra um preço físico.",
    mecanica: {
      nome: "Volume Sanguíneo",
      descricao: "Gasta o próprio sangue ou utiliza sangue presente no cenário. Controlar sangue dentro de outra pessoa exige contato, ferimento prévio ou várias marcas acumuladas.",
      usos: ["Fechar ferimentos e impedir hemorragias", "Criar lâminas, fios e agulhas", "Prender, rastrear e alterar circulação"]
    },
    risco: { nome: "Anemia", descricao: "Quanto mais sangue utiliza, mais fraco, lento e confuso o personagem se torna." },
    especializacoes: [
      { nome: "Coagulador", descricao: "Defesa, cura e contenção." },
      { nome: "Sangrador", descricao: "Armas e ferimentos progressivos." },
      { nome: "Pulsante", descricao: "Batimentos, circulação e controle corporal." }
    ],
    focos: ["Recurso corporal", "Contenção", "Cura", "Dano progressivo"],
    importada: false
  },
  {
    id: "morfologista",
    nome: "Morfologista",
    categoria: "Biológicas",
    resumo: "Altera temporariamente tecidos do próprio corpo.",
    descricao: "Pode fortalecer músculos, engrossar a pele, ampliar pupilas, modificar tendões ou desenvolver órgãos provisórios.",
    mecanica: {
      nome: "Adaptação",
      descricao: "Ao encontrar um problema, desenvolve uma adaptação biológica. Cada adaptação exige tempo ou uma substância adequada.",
      usos: ["Ampliar visão, sentidos e respiração", "Reforçar músculos, pele e ossos", "Criar aderência e resistência ambiental"]
    },
    risco: { nome: "Instabilidade", descricao: "Manter muitas alterações ao mesmo tempo causa deformações, dores ou mudanças permanentes." },
    especializacoes: [
      { nome: "Predador", descricao: "Sentidos, velocidade e combate." },
      { nome: "Couraçado", descricao: "Proteção e regeneração." },
      { nome: "Adaptativo", descricao: "Sobrevivência e exploração." }
    ],
    focos: ["Transformação", "Sobrevivência", "Combate corporal", "Adaptação"],
    importada: false
  },
  {
    id: "simbionte",
    nome: "Simbionte",
    categoria: "Biológicas",
    resumo: "Divide o próprio corpo com um organismo artificial ou modificado.",
    descricao: "O organismo não é completamente obediente. Possui necessidades, instintos e talvez uma consciência incompleta.",
    mecanica: {
      nome: "Concordância",
      descricao: "Quanto melhor a relação entre hospedeiro e organismo, mais funções podem ser utilizadas.",
      usos: ["Regenerar e resistir a toxinas", "Criar sentidos e membros temporários", "Produzir substâncias e perceber ameaças"]
    },
    risco: { nome: "Dominância", descricao: "Forçar demais o organismo aumenta sua influência sobre o corpo e o comportamento do personagem." },
    especializacoes: [
      { nome: "Mutualista", descricao: "Equilíbrio e suporte." },
      { nome: "Predatório", descricao: "Combate e consumo." },
      { nome: "Colmeia", descricao: "Pequenas criaturas associadas ao organismo principal." }
    ],
    focos: ["Transformação", "Relação com criatura", "Regeneração", "Risco progressivo"],
    importada: false
  },
  {
    id: "galvanico",
    nome: "Galvânico",
    categoria: "Elementais industriais",
    resumo: "Conduz e acumula eletricidade através do corpo ou de implantes.",
    descricao: "Converte movimento, impactos e fontes elétricas em energia utilizável por seu corpo e seus equipamentos.",
    mecanica: {
      nome: "Carga",
      descricao: "Gera Carga ao se mover, sofrer impactos ou entrar em contato com fontes elétricas.",
      usos: ["Acelerar reflexos", "Eletrificar armas", "Interromper músculos e alimentar máquinas"]
    },
    risco: { nome: "Curto neural", descricao: "O uso excessivo provoca espasmos, curtos neurais e perda de memória recente." },
    especializacoes: [],
    focos: ["Eletricidade", "Velocidade", "Interrupção", "Alimentação de equipamentos"],
    importada: false
  },
  {
    id: "caldeirista",
    nome: "Caldeirista",
    categoria: "Elementais industriais",
    resumo: "Utiliza calor, vapor e pressão através de equipamento acoplado.",
    descricao: "Transforma calor e pressão acumulados em potência física, mobilidade e ferramentas industriais.",
    mecanica: {
      nome: "Pressão",
      descricao: "Acumula Pressão e a libera de modo controlado para ampliar ações físicas.",
      usos: ["Impulsionar golpes e saltos", "Projetar jatos de vapor", "Operar ferramentas industriais"]
    },
    risco: { nome: "Sobrecarga", descricao: "O excesso de Pressão pode causar queimaduras, rompimento de válvulas e explosões." },
    especializacoes: [],
    focos: ["Calor", "Força", "Mobilidade", "Explosões controladas"],
    importada: false
  },
  {
    id: "criotecnico",
    nome: "Criotécnico",
    categoria: "Elementais industriais",
    resumo: "Retira calor de objetos e pequenas áreas.",
    descricao: "Controla a transferência térmica para preservar, fragilizar e interromper o funcionamento de alvos.",
    mecanica: {
      nome: "Extração térmica",
      descricao: "Retira calor de objetos, mecanismos, corpos e pequenas áreas.",
      usos: ["Congelar mecanismos", "Preservar feridos e reduzir hemorragias", "Fragilizar materiais"]
    },
    risco: { nome: "Hipotermia", descricao: "O uso excessivo causa perda de sensibilidade, hipotermia e lentidão." },
    especializacoes: [],
    focos: ["Frio", "Preservação", "Controle", "Fragilização"],
    importada: false
  },
  {
    id: "magnetista",
    nome: "Magnetista",
    categoria: "Elementais industriais",
    resumo: "Manipula atração e repulsão entre objetos previamente marcados.",
    descricao: "Trabalha com peso, distância e preparação limitados. Não controla indiscriminadamente todo metal da cidade.",
    mecanica: {
      nome: "Polaridades",
      descricao: "Aplica Polaridades em alvos e depois controla a interação entre eles.",
      usos: ["Puxar objetos marcados", "Repelir alvos", "Fixar objetos metálicos"]
    },
    risco: { nome: "Desalinhamento", descricao: "O uso excessivo pode desalojar próteses e implantes ou prejudicar a percepção espacial." },
    especializacoes: [],
    focos: ["Posicionamento", "Metais", "Preparação", "Controle de movimento"],
    importada: false
  },
  {
    id: "barometrico",
    nome: "Barométrico",
    categoria: "Elementais industriais",
    resumo: "Controla diferenças de pressão no ar.",
    descricao: "Cria e desfaz pequenas diferenças de pressão para mover, proteger ou interromper alvos.",
    mecanica: {
      nome: "Bolsões de Pressão",
      descricao: "Concentra ou retira ar de uma pequena área e libera a diferença de pressão de modo direcionado.",
      usos: ["Impulsionar projéteis e empurrar pessoas", "Amortecer quedas e impactos", "Desviar fumaça ou criar explosões de ar"]
    },
    risco: { nome: "Barotrauma", descricao: "O uso excessivo prejudica pulmões, ouvidos e circulação." },
    especializacoes: [
      { nome: "Impulsor", descricao: "Movimento e projéteis." },
      { nome: "Vácuo", descricao: "Silêncio, sufocamento e interrupção." },
      { nome: "Amortecedor", descricao: "Defesa e controle de impactos." }
    ],
    focos: ["Pressão", "Movimento", "Projéteis", "Controle"],
    importada: false
  },
  {
    id: "oxidante",
    nome: "Oxidante",
    categoria: "Elementais industriais",
    resumo: "Acelera corrosão, desgaste e decomposição material.",
    descricao: "Concentra degradação em equipamentos e estruturas para abrir caminhos ou reduzir a capacidade dos inimigos.",
    mecanica: {
      nome: "Degradação",
      descricao: "Acumula Degradação sobre objetos e estruturas até comprometer sua função.",
      usos: ["Enfraquecer armaduras e estruturas", "Emperrar armas", "Romper correntes e inutilizar próteses"]
    },
    risco: { nome: "Corrosão própria", descricao: "As próprias ferramentas do personagem começam a se degradar." },
    especializacoes: [],
    focos: ["Sabotagem", "Corrosão", "Destruição de equipamento", "Enfraquecimento"],
    importada: false
  },
  {
    id: "fuliginario",
    nome: "Fuliginário",
    categoria: "Elementais industriais",
    resumo: "Absorve e controla fumaça, cinzas e partículas suspensas.",
    descricao: "Usa resíduos presentes no ar como cobertura, marcador e extensão indireta dos próprios sentidos.",
    mecanica: {
      nome: "Fuligem",
      descricao: "Espalha Fuligem pelo ambiente e manipula sua densidade e movimento.",
      usos: ["Ocultar e marcar", "Sufocar", "Perceber movimentos dentro da nuvem"]
    },
    risco: { nome: "Asfixia", descricao: "O uso excessivo provoca asfixia e acúmulo de resíduos nos pulmões." },
    especializacoes: [],
    focos: ["Ocultação", "Fumaça", "Controle de área", "Percepção indireta"],
    importada: false
  },
  {
    id: "ressonante",
    nome: "Ressonante",
    categoria: "Elementais industriais",
    resumo: "Manipula vibrações físicas e frequências sonoras.",
    descricao: "Lê e altera frequências para investigar espaços, perturbar corpos e desestabilizar materiais ou máquinas.",
    mecanica: {
      nome: "Frequências",
      descricao: "Identifica a frequência de objetos, estruturas ou corpos e interfere nela.",
      usos: ["Quebrar vidro e desestabilizar máquinas", "Provocar vertigem ou silenciar áreas", "Localizar pessoas através de paredes"]
    },
    risco: { nome: "Dessincronia corporal", descricao: "O uso excessivo causa perda de equilíbrio, sangramento e dessincronia corporal." },
    especializacoes: [],
    focos: ["Som", "Vibração", "Investigação", "Desestabilização"],
    importada: false
  },
  {
    id: "operador-fantasma",
    nome: "Operador Fantasma",
    categoria: "Urbanas e conceituais",
    resumo: "Especialista em infiltração, identidades falsas e sabotagem.",
    descricao: "Seu diferencial não é magia, mas preparação, contatos e leitura do ambiente.",
    mecanica: {
      nome: "Exposição",
      descricao: "Quanto mais ações suspeitas realiza, maior sua Exposição. Em troca, amplia seu alcance dentro de operações clandestinas.",
      usos: ["Invadir locais e criar distrações", "Plantar provas", "Usar contatos clandestinos"]
    },
    risco: { nome: "Identidade revelada", descricao: "Quando a Exposição atinge o limite, a identidade ou posição do personagem é descoberta." },
    especializacoes: [],
    focos: ["Infiltração", "Disfarce", "Sabotagem", "Contatos"],
    importada: false
  },
  {
    id: "analista-de-padroes",
    nome: "Analista de Padrões",
    categoria: "Urbanas e conceituais",
    resumo: "Transforma informações e evidências em vantagens concretas.",
    descricao: "Pode ser detetive, perito, estatístico, estrategista ou antigo funcionário da administração de Meridian.",
    mecanica: {
      nome: "Evidências",
      descricao: "Coleta evidências sobre pessoas, lugares e acontecimentos e as converte em conclusões úteis.",
      usos: ["Prever ações e identificar mentiras", "Reconstruir cenas e descobrir fraquezas", "Encontrar entradas ou ligações escondidas"]
    },
    risco: { nome: "Falsa conclusão", descricao: "Uma interpretação errada pode produzir informações perigosamente convincentes." },
    especializacoes: [
      { nome: "Perito", descricao: "Cenas, corpos e materiais." },
      { nome: "Estrategista", descricao: "Comportamento de combate." },
      { nome: "Inquiridor", descricao: "Pessoas, mentiras e relações." }
    ],
    focos: ["Investigação", "Dedução", "Estratégia", "Informações"],
    importada: false
  }
];

const categoriasDeClasse = [
  { id: "tecnologia", rotulo: "Tecnologia", categoria: "Científicas e tecnológicas" },
  { id: "biologia", rotulo: "Biologia", categoria: "Biológicas" },
  { id: "elementais", rotulo: "Elementais", categoria: "Elementais industriais" },
  { id: "urbanas", rotulo: "Urbanas", categoria: "Urbanas e conceituais" }
];

const caminhosDosSimbolos = {
  "experimentalista": "M53 33h28l-5 19 25 44c5 9-1 20-12 20H45c-11 0-17-11-12-20l25-44-5-19zm-5 61h44M98 35l4 8 9 2-7 6 1 9-7-5-8 5 2-9-7-6 9-2z",
  "protesico": "M47 35v42l-14 15 17 30 16-12-7-15 12-11 11 13 31-34-10-10-23 20-7-7 16-18V35zm24 49 13-15 17 16-13 15z",
  "maquinista": "M80 33v13m0 68v13M33 80h13m68 0h13M47 47l9 9m48 48 9 9M113 47l-9 9m-48 48-9 9M80 51a29 29 0 1 1 0 58 29 29 0 0 1 0-58zm0 18a11 11 0 1 1 0 22 11 11 0 0 1 0-22z",
  "engenheiro-runico": "M80 29l30 18v35l-30 48-30-48V47zm0 20v58M60 61h40M60 82h40M67 48v48m26-48v48",
  "quimico-de-campo": "M48 35h26M55 35v32L37 105c-5 10 1 19 12 19h31c11 0 17-9 12-19L68 67V35m23 8h21m-15 0v28l19 35c4 8-1 16-10 16H89M47 97h38m9 5h18",
  "hemurgista": "M80 28c-8 21-35 48-35 72a35 35 0 0 0 70 0c0-24-27-51-35-72zm-18 73c0 10 8 18 18 18",
  "morfologista": "M80 31c34 0 52 38 31 62-17 20-52 10-50-14 1-16 24-22 33-9 9 13-6 29-22 27-20-2-34-20-32-38 2-21 23-35 43-32 23 4 33 30 18 47-13 15-39 5-36-12",
  "simbionte": "M59 45c-19 8-25 34-11 49s38 7 44-12-1-38-21-41c-5-1-9 1-12 4zm42 26c18 7 22 30 9 42-12 10-31 6-38-8m-9-22 22 12",
  "galvanico": "M91 25 48 86h28l-8 49 44-68H83z",
  "caldeirista": "M80 38a42 42 0 1 1 0 84 42 42 0 0 1 0-84zm0 17v50M55 80h50m-37-12 24 24m0-24-24 24M80 69a11 11 0 1 1 0 22 11 11 0 0 1 0-22z",
  "criotecnico": "M80 27v106M34 53l92 54m0-54-92 54M80 27l-9 12m9-12 9 12M80 133l-9-12m9 12 9-12M34 53l15 1m-15-1 7 13m85-13-15 1m15-1-7 13",
  "magnetista": "M47 36v50c0 44 66 44 66 0V36H91v49c0 17-22 17-22 0V36zm0 19h22m22 0h22",
  "barometrico": "M31 57c17-16 34-16 51 0s34 16 47 0M31 80c17-16 34-16 51 0s34 16 47 0M31 103c17-16 34-16 51 0s34 16 47 0",
  "oxidante": "M43 39h74l-9 82H52zm37 0-9 27 18 13-20 15 13 27m-39-40h28m18 0h27",
  "fuliginario": "M38 105c9 17 34 18 45 4 12-15 2-33-14-37-14-4-20-20-10-31m30 74c10 14 31 12 38-3 7-16-6-30-20-29-14 2-26-8-23-20m-37 22c-12-8-11-27 2-33",
  "ressonante": "M35 66v28m18-43v58m18-72v86m18-72v58m18-43v28m18-16v4",
  "operador-fantasma": "M40 48c23-19 57-19 80 0l-10 55-30 26-30-26zm18 35c8-7 15-7 22 0m0 0c8-7 15-7 22 0M61 99c12 9 26 9 38 0",
  "analista-de-padroes": "M27 80c25-37 81-37 106 0-25 37-81 37-106 0zm53-23a23 23 0 1 1 0 46 23 23 0 0 1 0-46zm0 12a11 11 0 1 1 0 22 11 11 0 0 1 0-22zM35 42h20m50 0h20M35 118h20m50 0h20"
};

let categoriaDeClasseAtual = "Científicas e tecnológicas";
let paginaDeClassesAtual = 1;
let abaDeClasseAtual = "overview";
let abaDosAtributosAtual = "atributos";
let paginaDePericiasAtual = 1;
let temporizadorMensagemDeSalvamento = null;
let fichaSalvaNaSessao = null;
let fichaPossuiAlteracoes = false;

let etapaAtual = 1;

const landingView = document.querySelector("#landing-view");
const creationView = document.querySelector("#creation-view");
const identityStep = document.querySelector("#identity-step");
const speciesStep = document.querySelector("#species-step");
const classStep = document.querySelector("#class-step");
const originStep = document.querySelector("#origin-step");
const attributesStep = document.querySelector("#attributes-step");
const reviewStep = document.querySelector("#review-step");
const createButton = document.querySelector("#create-character");
const importButton = document.querySelector("#import-character");
const masterButton = document.querySelector("#master-access");
const creationBackButton = document.querySelector("#creation-back");
const creationNextButton = document.querySelector("#creation-next");
const reviewActions = document.querySelector("#review-actions");
const reviewSaveJsonButton = document.querySelector("#review-save-json");
const reviewOpenSheetButton = document.querySelector("#review-open-sheet");
const characterSheetScreen = document.querySelector("#character-sheet-screen");
const identityForm = document.querySelector("#identity-form");
const fileInput = document.querySelector("#json-file");
const fileStatus = document.querySelector("#file-status");
const masterStatus = document.querySelector("#master-status");

const characterNameInput = document.querySelector("#character-name");
const playerNameInput = document.querySelector("#player-name");
const campaignNameInput = document.querySelector("#campaign-name");
const gameMasterInput = document.querySelector("#game-master");
const characterNameError = document.querySelector("#character-name-error");
const playerNameError = document.querySelector("#player-name-error");
const campaignNameError = document.querySelector("#campaign-name-error");
const gameMasterError = document.querySelector("#game-master-error");

const portraitInput = document.querySelector("#portrait-input");
const choosePortraitButton = document.querySelector("#choose-portrait");
const removePortraitButton = document.querySelector("#remove-portrait");
const portraitPreview = document.querySelector("#portrait-preview");
const portraitEmpty = document.querySelector("#portrait-empty");
const portraitStatus = document.querySelector("#portrait-status");

const speciesList = document.querySelector("#species-list");
const speciesError = document.querySelector("#species-error");
const speciesVisual = document.querySelector("#species-visual");
const speciesCharacterArt = document.querySelector("#species-character-art");
const speciesSymbol = document.querySelector("#species-symbol");
const speciesSymbolName = document.querySelector("#species-symbol-name");
const speciesDetailsEmpty = document.querySelector("#species-details-empty");
const speciesDetailsContent = document.querySelector("#species-details-content");
const speciesDetailName = document.querySelector("#species-detail-name");
const speciesDetailSummary = document.querySelector("#species-detail-summary");
const speciesDetailDescription = document.querySelector("#species-detail-description");
const speciesDetailModifiers = document.querySelector("#species-detail-modifiers");
const speciesPhysicalBlock = document.querySelector("#species-physical-block");
const speciesDetailPhysical = document.querySelector("#species-detail-physical");
const speciesDetailAffinity = document.querySelector("#species-detail-affinity");
const speciesTraitBlock = document.querySelector("#species-trait-block");
const speciesDetailTraitName = document.querySelector("#species-detail-trait-name");
const speciesDetailTrait = document.querySelector("#species-detail-trait");
const speciesAbilityBlock = document.querySelector("#species-ability-block");
const speciesDetailAbilityName = document.querySelector("#species-detail-ability-name");
const speciesDetailAbility = document.querySelector("#species-detail-ability");
const speciesVulnerabilityBlock = document.querySelector("#species-vulnerability-block");
const speciesDetailVulnerabilityName = document.querySelector("#species-detail-vulnerability-name");
const speciesDetailVulnerability = document.querySelector("#species-detail-vulnerability");
const speciesStyleBlock = document.querySelector("#species-style-block");
const speciesDetailStyle = document.querySelector("#species-detail-style");
const speciesOptions = document.querySelector("#species-options");

const classCategories = document.querySelector("#class-categories");
const classList = document.querySelector("#class-list");
const classPagePrevious = document.querySelector("#class-page-previous");
const classPageNext = document.querySelector("#class-page-next");
const classPageStatus = document.querySelector("#class-page-status");
const importClassButton = document.querySelector("#import-class");
const classJsonInput = document.querySelector("#class-json-input");
const classMessage = document.querySelector("#class-message");
const classSymbol = document.querySelector("#class-symbol");
const classSymbolName = document.querySelector("#class-symbol-name");
const classSymbolMechanic = document.querySelector("#class-symbol-mechanic");
const classDetailsEmpty = document.querySelector("#class-details-empty");
const classDetailsContent = document.querySelector("#class-details-content");
const classDetailCategory = document.querySelector("#class-detail-category");
const classDetailName = document.querySelector("#class-detail-name");
const classDetailSummary = document.querySelector("#class-detail-summary");
const classTabs = document.querySelector(".class-tabs");
const classTabPanel = document.querySelector("#class-tab-panel");
const classPanelTitle = document.querySelector("#class-panel-title");
const classPanelDescription = document.querySelector("#class-panel-description");
const classPanelList = document.querySelector("#class-panel-list");

const stageLabel = document.querySelector("#stage-label");
const stageHelper = document.querySelector("#stage-helper");
const stageProgress = document.querySelector(".stage-progress");
const stageProgressBar = document.querySelector("#stage-progress-bar");
const originForm = document.querySelector("#origin-form");
const originTitleInput = document.querySelector("#origin-title");
const originPlaceInput = document.querySelector("#origin-place");
const originStoryInput = document.querySelector("#origin-story");
const originTitleError = document.querySelector("#origin-title-error");
const originPlaceError = document.querySelector("#origin-place-error");
const originStoryError = document.querySelector("#origin-story-error");
const originStoryCounter = document.querySelector("#origin-story-counter");
const originPromptList = document.querySelector(".origin-prompt-list");
const attributesTabButton = document.querySelector("#attributes-tab-button");
const skillsTabButton = document.querySelector("#skills-tab-button");
const attributesPanel = document.querySelector("#attributes-panel");
const skillsPanel = document.querySelector("#skills-panel");
const attributesList = document.querySelector("#attributes-list");
const attributesAdjustmentMessage = document.querySelector("#attributes-adjustment-message");
const attributesPointsRemaining = document.querySelector("#attributes-points-remaining");
const attributesPointsTotal = document.querySelector("#attributes-points-total");
const attributesPointsUsed = document.querySelector("#attributes-points-used");
const attributesPointsBar = document.querySelector("#attributes-points-bar");
const attributesAffinityName = document.querySelector("#attributes-affinity-name");
const attributesAffinityLimit = document.querySelector("#attributes-affinity-limit");
const attributesFinalSummary = document.querySelector("#attributes-final-summary");
const attributesError = document.querySelector("#attributes-error");
const skillsList = document.querySelector("#skills-list");
const skillsPrevPage = document.querySelector("#skills-prev-page");
const skillsNextPage = document.querySelector("#skills-next-page");
const skillsPageLabel = document.querySelector("#skills-page-label");
const skillsMessage = document.querySelector("#skills-message");
const skillsTrainedCount = document.querySelector("#skills-trained-count");
const skillsTrainedLimit = document.querySelector("#skills-trained-limit");
const skillsAttributeSummary = document.querySelector("#skills-attribute-summary");
const reviewCharacterName = document.querySelector("#review-character-name");
const reviewSpeciesName = document.querySelector("#review-species-name");
const reviewClassName = document.querySelector("#review-class-name");
const reviewOriginTitle = document.querySelector("#review-origin-title");
const reviewFinalForca = document.querySelector("#review-final-forca");
const reviewFinalAgilidade = document.querySelector("#review-final-agilidade");
const reviewFinalIntelecto = document.querySelector("#review-final-intelecto");
const reviewFinalResistencia = document.querySelector("#review-final-resistencia");
const reviewTrainedSkills = document.querySelector("#review-trained-skills");
const reviewSaveStatus = document.querySelector("#review-save-status");
const sheetSaveSessionButton = document.querySelector("#sheet-save-session");
const sheetExportJsonButton = document.querySelector("#sheet-export-json");
const sheetBackReviewButton = document.querySelector("#sheet-back-review");
const sheetSidebar = document.querySelector(".sheet-sidebar");
const characterSheetTitle = document.querySelector("#character-sheet-title");
const sheetSaveState = document.querySelector("#sheet-save-state");
const sheetPortraitImage = document.querySelector("#sheet-portrait-image");
const sheetPortraitEmpty = document.querySelector("#sheet-portrait-empty");
const sheetCharacterName = document.querySelector("#sheet-character-name");
const sheetPlayerName = document.querySelector("#sheet-player-name");
const sheetCampaignName = document.querySelector("#sheet-campaign-name");
const sheetMasterName = document.querySelector("#sheet-master-name");
const sheetSpeciesName = document.querySelector("#sheet-species-name");
const sheetLineageName = document.querySelector("#sheet-lineage-name");
const sheetClassName = document.querySelector("#sheet-class-name");
const sheetOriginTitle = document.querySelector("#sheet-origin-title");
const sheetOriginPlace = document.querySelector("#sheet-origin-place");
const sheetLevel = document.querySelector("#sheet-level");
const sheetExperience = document.querySelector("#sheet-experience");
const sheetEvolutionPoints = document.querySelector("#sheet-evolution-points");
const sheetGloryPoints = document.querySelector("#sheet-glory-points");
const sheetDefense = document.querySelector("#sheet-defense");
const sheetDamageReduction = document.querySelector("#sheet-damage-reduction");
const sheetInitiative = document.querySelector("#sheet-initiative");
const sheetMovement = document.querySelector("#sheet-movement");
const sheetLifeCard = document.querySelector(".sheet-resource-card--life");
const sheetLifeCurrent = document.querySelector("#sheet-life-current");
const sheetLifeCurrentDisplay = document.querySelector("#sheet-life-current-display");
const sheetLifeMax = document.querySelector("#sheet-life-max");
const sheetLifeMinus = document.querySelector("#sheet-life-minus");
const sheetLifePlus = document.querySelector("#sheet-life-plus");
const sheetLifeRestore = document.querySelector("#sheet-life-restore");
const sheetLifeBar = document.querySelector("#sheet-life-bar");
const sheetLifePercent = document.querySelector("#sheet-life-percent");
const sheetLifeStatus = document.querySelector("#sheet-life-status");
const sheetManaCurrent = document.querySelector("#sheet-mana-current");
const sheetManaCurrentDisplay = document.querySelector("#sheet-mana-current-display");
const sheetManaMax = document.querySelector("#sheet-mana-max");
const sheetManaMinus = document.querySelector("#sheet-mana-minus");
const sheetManaPlus = document.querySelector("#sheet-mana-plus");
const sheetManaRestore = document.querySelector("#sheet-mana-restore");
const sheetManaBar = document.querySelector("#sheet-mana-bar");
const sheetManaPercent = document.querySelector("#sheet-mana-percent");
const sheetAttributesList = document.querySelector("#sheet-attributes-list");
const sheetSkillsList = document.querySelector("#sheet-skills-list");
const sheetVulnerabilityTitle = document.querySelector("#sheet-vulnerability-title");
const sheetVulnerabilityDescription = document.querySelector("#sheet-vulnerability-description");
const sheetSaveStatus = document.querySelector("#sheet-save-status");
const sheetFooterSaveState = document.querySelector("#sheet-footer-save-state");
const creationSteps = document.querySelectorAll(".creation-step");

const fields = [
  [characterNameInput, characterNameError],
  [playerNameInput, playerNameError],
  [campaignNameInput, campaignNameError],
  [gameMasterInput, gameMasterError]
];

const consultaPonteiroPreciso = window.matchMedia("(hover: hover) and (pointer: fine)");
const consultaMovimentoReduzido = window.matchMedia("(prefers-reduced-motion: reduce)");
const etapasDaCriacao = [identityStep, speciesStep, classStep, originStep, attributesStep, reviewStep];
let temporizadorDaTransicaoDeEtapa = null;
let transicaoDaArteDaEspecie = 0;

function deveReduzirMovimento() {
  return consultaMovimentoReduzido.matches;
}

function podeUsarTilt() {
  return consultaPonteiroPreciso.matches && !deveReduzirMovimento();
}

function prepararCardInterativo(card, seletorDoSimbolo) {
  card.classList.add("interactive-card");
  card.style.setProperty("--tilt-x", "0deg");
  card.style.setProperty("--tilt-y", "0deg");
  card.style.setProperty("--pointer-x", "50%");
  card.style.setProperty("--pointer-y", "50%");
  card.style.setProperty("--card-lift", "0px");
  card.style.setProperty("--symbol-x", "0px");
  card.style.setProperty("--symbol-y", "0px");

  const simbolo = seletorDoSimbolo ? card.querySelector(seletorDoSimbolo) : null;
  if (simbolo) {
    simbolo.classList.add("interactive-card__symbol");
  }
}

function restaurarTilt(card) {
  card.classList.remove("is-tilting");
  card.style.removeProperty("will-change");
  card.style.setProperty("--tilt-x", "0deg");
  card.style.setProperty("--tilt-y", "0deg");
  card.style.setProperty("--pointer-x", "50%");
  card.style.setProperty("--pointer-y", "50%");
  card.style.setProperty("--card-lift", "0px");
  card.style.setProperty("--symbol-x", "0px");
  card.style.setProperty("--symbol-y", "0px");
}

function ativarTiltNoCard(card, seletorDoSimbolo) {
  prepararCardInterativo(card, seletorDoSimbolo);

  if (card.dataset.tiltEnabled === "true" || !podeUsarTilt()) {
    return;
  }

  let framePendente = null;
  let ultimoEvento = null;

  function atualizar() {
    framePendente = null;

    if (!ultimoEvento) {
      return;
    }

    const rect = card.getBoundingClientRect();
    const x = Math.min(Math.max(ultimoEvento.clientX - rect.left, 0), rect.width);
    const y = Math.min(Math.max(ultimoEvento.clientY - rect.top, 0), rect.height);
    const percentualX = rect.width ? x / rect.width : 0.5;
    const percentualY = rect.height ? y / rect.height : 0.5;
    const rotacaoY = (percentualX - 0.5) * 12;
    const rotacaoX = (0.5 - percentualY) * 10;
    const deslocamentoX = (percentualX - 0.5) * 3.6;
    const deslocamentoY = (percentualY - 0.5) * 3.2;

    card.style.setProperty("--tilt-x", `${rotacaoX.toFixed(2)}deg`);
    card.style.setProperty("--tilt-y", `${rotacaoY.toFixed(2)}deg`);
    card.style.setProperty("--pointer-x", `${(percentualX * 100).toFixed(1)}%`);
    card.style.setProperty("--pointer-y", `${(percentualY * 100).toFixed(1)}%`);
    card.style.setProperty("--symbol-x", `${deslocamentoX.toFixed(2)}px`);
    card.style.setProperty("--symbol-y", `${deslocamentoY.toFixed(2)}px`);
  }

  function aoEntrar() {
    card.classList.add("is-tilting");
    card.style.setProperty("--card-lift", "-2px");
  }

  function aoMover(event) {
    ultimoEvento = event;

    if (!framePendente) {
      framePendente = requestAnimationFrame(atualizar);
    }
  }

  function aoSair() {
    ultimoEvento = null;

    if (framePendente) {
      cancelAnimationFrame(framePendente);
      framePendente = null;
    }

    restaurarTilt(card);
  }

  card.dataset.tiltEnabled = "true";
  card.addEventListener("pointerenter", aoEntrar);
  card.addEventListener("pointermove", aoMover);
  card.addEventListener("pointerleave", aoSair);
  card.addEventListener("pointercancel", aoSair);
}

function ativarMicrointeracoes(raiz) {
  const escopo = raiz || document;
  escopo.querySelectorAll(".action-card").forEach(function (card) {
    ativarTiltNoCard(card, ".compass-icon, .file-icon");
  });
  escopo.querySelectorAll(".species-list-button").forEach(function (card) {
    ativarTiltNoCard(card, ".species-list-icon");
  });
  escopo.querySelectorAll(".class-card").forEach(function (card) {
    ativarTiltNoCard(card, ".class-card__icon");
  });
}

function animarSelecao(card) {
  if (!card || deveReduzirMovimento()) {
    return;
  }

  card.classList.remove("is-selecting");
  void card.offsetWidth;
  card.classList.add("is-selecting");
  card.addEventListener("animationend", function () {
    card.classList.remove("is-selecting");
  }, { once: true });
}

function trocarConteudoAnimado(elemento, atualizarConteudo, lateral) {
  if (!elemento || deveReduzirMovimento() || elemento.hidden) {
    atualizarConteudo();
    return;
  }

  elemento.classList.add("content-swap");
  if (lateral) {
    elemento.classList.add("content-swap--side");
  }
  elemento.classList.add("content-swap--leaving");

  window.setTimeout(function () {
    atualizarConteudo();
    elemento.classList.remove("content-swap--leaving");
    elemento.classList.add("content-swap--entering");
    elemento.addEventListener("animationend", function () {
      elemento.classList.remove("content-swap--entering", "content-swap--side");
    }, { once: true });
  }, 120);
}

function finalizarTransicaoDeEtapa(anterior) {
  if (temporizadorDaTransicaoDeEtapa) {
    window.clearTimeout(temporizadorDaTransicaoDeEtapa);
    temporizadorDaTransicaoDeEtapa = null;
  }

  etapasDaCriacao.forEach(function (etapa) {
    etapa.classList.remove(
      "stage-transition--enter-forward",
      "stage-transition--leave-forward",
      "stage-transition--enter-backward",
      "stage-transition--leave-backward"
    );
  });
  creationView.querySelector(".creation-body").classList.remove("is-transitioning");

  if (anterior) {
    anterior.hidden = true;
  }
}

function navegarComTransicao(proximaEtapa, direcao, preparar, seletorDeFoco) {
  const anterior = etapasDaCriacao.find(function (etapa) {
    return !etapa.hidden;
  });
  const deveAnimar = anterior && anterior !== proximaEtapa && !deveReduzirMovimento();
  const corpo = creationView.querySelector(".creation-body");

  if (temporizadorDaTransicaoDeEtapa) {
    finalizarTransicaoDeEtapa(anterior);
  }

  if (preparar) {
    preparar();
  }

  etapasDaCriacao.forEach(function (etapa) {
    if (etapa !== proximaEtapa && etapa !== anterior) {
      etapa.hidden = true;
    }
  });

  proximaEtapa.hidden = false;

  if (deveAnimar) {
    corpo.classList.add("is-transitioning");
    anterior.classList.add(`stage-transition--leave-${direcao}`);
    proximaEtapa.classList.add(`stage-transition--enter-${direcao}`);
    temporizadorDaTransicaoDeEtapa = window.setTimeout(function () {
      finalizarTransicaoDeEtapa(anterior);
    }, 280);
  } else if (anterior && anterior !== proximaEtapa) {
    anterior.hidden = true;
  }

  if (seletorDeFoco) {
    document.querySelector(seletorDeFoco).focus({ preventScroll: true });
  }
}

function animarCardsDaCategoria(cards, tipo) {
  if (deveReduzirMovimento()) {
    return;
  }

  cards.forEach(function (card, indice) {
    card.classList.remove("stagger-enter", "page-enter-next", "page-enter-prev");
    card.style.setProperty("--stagger-delay", `${indice * 35}ms`);

    if (tipo === "page-next") {
      card.classList.add("page-enter-next");
      return;
    }

    if (tipo === "page-prev") {
      card.classList.add("page-enter-prev");
      return;
    }

    card.classList.add("stagger-enter");
  });
}

function esconderArteDaEspecie() {
  const transicaoAtual = ++transicaoDaArteDaEspecie;

  speciesVisual.classList.remove("has-character-art");
  speciesCharacterArt.classList.remove("is-visible");

  if (speciesCharacterArt.hidden) {
    speciesCharacterArt.removeAttribute("src");
    speciesCharacterArt.alt = "";
    speciesSymbol.hidden = false;
    return;
  }

  speciesSymbol.hidden = false;

  if (deveReduzirMovimento()) {
    speciesCharacterArt.hidden = true;
    speciesCharacterArt.removeAttribute("src");
    speciesCharacterArt.alt = "";
    speciesCharacterArt.classList.remove("is-leaving");
    return;
  }

  speciesCharacterArt.classList.add("is-leaving");
  speciesCharacterArt.addEventListener("transitionend", function finalizar(event) {
    if (event.propertyName !== "opacity") {
      return;
    }

    speciesCharacterArt.removeEventListener("transitionend", finalizar);

    if (transicaoAtual !== transicaoDaArteDaEspecie) {
      return;
    }

    speciesCharacterArt.hidden = true;
    speciesCharacterArt.removeAttribute("src");
    speciesCharacterArt.alt = "";
    speciesCharacterArt.classList.remove("is-leaving");
  });
}

function mostrarArteDaEspecie(especie) {
  if (!especie || !especie.imagem) {
    esconderArteDaEspecie();
    return;
  }

  transicaoDaArteDaEspecie += 1;
  speciesSymbol.hidden = true;
  speciesCharacterArt.hidden = false;
  speciesCharacterArt.classList.remove("is-visible", "is-leaving");
  speciesCharacterArt.src = especie.imagem;
  speciesCharacterArt.alt = especie.imagemAlt || `RepresentaÃ§Ã£o de ${especie.nome}`;
  speciesVisual.classList.add("has-character-art");

  if (deveReduzirMovimento()) {
    speciesCharacterArt.classList.add("is-visible");
    return;
  }

  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      speciesCharacterArt.classList.add("is-visible");
    });
  });
}

function ativarMovimentoDaArteDaEspecie() {
  if (speciesVisual.dataset.artMotionEnabled === "true") {
    return;
  }

  let framePendente = null;
  let ultimoEvento = null;

  function atualizar() {
    framePendente = null;

    if (!ultimoEvento || !podeUsarTilt() || speciesCharacterArt.hidden) {
      return;
    }

    const rect = speciesVisual.getBoundingClientRect();
    const x = rect.width ? (ultimoEvento.clientX - rect.left) / rect.width : 0.5;
    const y = rect.height ? (ultimoEvento.clientY - rect.top) / rect.height : 0.5;
    const deslocamentoX = Math.max(-4, Math.min(4, (x - 0.5) * 8));
    const deslocamentoY = Math.max(-3, Math.min(3, (y - 0.5) * 6));

    speciesVisual.style.setProperty("--art-x", `${deslocamentoX.toFixed(2)}px`);
    speciesVisual.style.setProperty("--art-y", `${deslocamentoY.toFixed(2)}px`);
  }

  function mover(event) {
    if (!podeUsarTilt()) {
      return;
    }

    ultimoEvento = event;

    if (!framePendente) {
      framePendente = requestAnimationFrame(atualizar);
    }
  }

  function restaurar() {
    ultimoEvento = null;

    if (framePendente) {
      cancelAnimationFrame(framePendente);
      framePendente = null;
    }

    speciesVisual.style.setProperty("--art-x", "0px");
    speciesVisual.style.setProperty("--art-y", "0px");
  }

  speciesVisual.dataset.artMotionEnabled = "true";
  speciesVisual.addEventListener("pointermove", mover);
  speciesVisual.addEventListener("pointerleave", restaurar);
  speciesVisual.addEventListener("pointercancel", restaurar);
}

function obterEspecieSelecionada() {
  return especies.find(function (especie) {
    return especie.id === personagem.especie;
  }) || null;
}

function obterVarianteSelecionada(especie) {
  if (!especie || !personagem.varianteEspecie) {
    return null;
  }

  return especie.variantes.find(function (variante) {
    return variante.id === personagem.varianteEspecie;
  }) || null;
}

function obterClasseSelecionada() {
  return classes.find(function (classe) {
    return classe.id === personagem.classe;
  }) || null;
}

function abrirCriacao() {
  landingView.hidden = true;
  document.body.classList.remove("sheet-is-open");
  characterSheetScreen.hidden = true;
  creationView.hidden = false;
  restaurarIdentidade();
  abrirEtapaIdentidade(true);
}

function voltarParaInicio() {
  creationView.hidden = true;
  document.body.classList.remove("sheet-is-open");
  characterSheetScreen.hidden = true;
  landingView.hidden = false;
  createButton.focus();
}

function restaurarIdentidade() {
  characterNameInput.value = personagem.nome;
  playerNameInput.value = personagem.jogador;
  campaignNameInput.value = personagem.campanha;
  gameMasterInput.value = personagem.mestre;
  mostrarRetrato();
}

function atualizarPersonagem() {
  personagem.nome = characterNameInput.value;
  personagem.jogador = playerNameInput.value;
  personagem.campanha = campaignNameInput.value;
  personagem.mestre = gameMasterInput.value;
  atualizarTextoAlternativo();
}

function atualizarTextoAlternativo() {
  const nome = personagem.nome.trim();
  portraitPreview.alt = nome ? `Retrato de ${nome}` : "Retrato do personagem";
}

function abrirSeletorDeRetrato() {
  portraitInput.value = "";
  portraitInput.click();
}

function selecionarRetrato(event) {
  const arquivo = event.target.files[0];
  const formatosPermitidos = ["image/jpeg", "image/png", "image/webp"];

  if (!arquivo) {
    return;
  }

  if (!formatosPermitidos.includes(arquivo.type)) {
    portraitStatus.textContent = "Use uma imagem JPG, PNG ou WebP.";
    portraitInput.value = "";
    return;
  }

  const leitor = new FileReader();

  leitor.addEventListener("load", function () {
    if (typeof leitor.result !== "string") {
      portraitStatus.textContent = "Não foi possível carregar esta imagem.";
      return;
    }

    personagem.retrato = leitor.result;
    portraitStatus.textContent = "";
    mostrarRetrato();
  });

  leitor.addEventListener("error", function () {
    portraitStatus.textContent = "Não foi possível carregar esta imagem.";
  });

  leitor.readAsDataURL(arquivo);
}

function mostrarRetrato() {
  if (personagem.retrato) {
    portraitPreview.src = personagem.retrato;
    portraitPreview.hidden = false;
    portraitEmpty.hidden = true;
    removePortraitButton.hidden = false;
    choosePortraitButton.textContent = "Alterar imagem";
  } else {
    portraitPreview.hidden = true;
    portraitPreview.removeAttribute("src");
    portraitEmpty.hidden = false;
    removePortraitButton.hidden = true;
    choosePortraitButton.textContent = "Escolher imagem";
  }

  atualizarTextoAlternativo();
}

function removerRetrato() {
  personagem.retrato = null;
  portraitInput.value = "";
  portraitStatus.textContent = "";
  mostrarRetrato();
  choosePortraitButton.focus();
}

function definirErro(input, errorElement, mensagem) {
  errorElement.textContent = mensagem;
  input.setAttribute("aria-invalid", mensagem ? "true" : "false");
}

function validarIdentidade() {
  atualizarPersonagem();

  personagem.nome = personagem.nome.trim();
  personagem.jogador = personagem.jogador.trim();
  personagem.campanha = personagem.campanha.trim();
  personagem.mestre = personagem.mestre.trim();
  restaurarIdentidade();

  definirErro(characterNameInput, characterNameError, !personagem.nome ? "Informe o nome do personagem." : personagem.nome.length > 80 ? "O nome do personagem pode ter no máximo 80 caracteres." : "");
  definirErro(playerNameInput, playerNameError, !personagem.jogador ? "Informe o nome do jogador." : personagem.jogador.length > 80 ? "O nome do jogador pode ter no máximo 80 caracteres." : "");
  definirErro(campaignNameInput, campaignNameError, personagem.campanha.length > 120 ? "O nome da campanha pode ter no máximo 120 caracteres." : "");
  definirErro(gameMasterInput, gameMasterError, personagem.mestre.length > 120 ? "O nome do mestre pode ter no máximo 120 caracteres." : "");

  const primeiroInvalido = fields.find(function ([input]) {
    return input.getAttribute("aria-invalid") === "true";
  });

  if (primeiroInvalido) {
    primeiroInvalido[0].focus();
    return false;
  }

  return true;
}

function atualizarStepper(etapa) {
  const preenchimento = Math.max(0, ((etapa - 1) / 5) * 83.4);
  document.querySelector(".creation-stepper ol").style.setProperty("--stepper-fill", `${preenchimento}%`);

  creationSteps.forEach(function (step, index) {
    const numero = index + 1;
    step.classList.toggle("creation-step--active", numero === etapa);
    step.classList.toggle("creation-step--complete", numero < etapa);
    step.removeAttribute("aria-current");

    if (numero === etapa) {
      step.setAttribute("aria-current", "step");
    }
  });
}

function atualizarEstadoDaEtapa(etapa) {
  etapaAtual = etapa;
  stageLabel.textContent = `Etapa ${etapa} de 6`;
  stageProgressBar.style.width = `${(etapa / 6) * 100}%`;
  atualizarStepper(etapa);
  reviewActions.hidden = etapa !== 6;
  stageProgress.hidden = etapa === 6;
  if (etapa === 5) {
    atualizarEstadoDoBotaoDeRevisao();
  } else {
    creationNextButton.disabled = false;
    creationNextButton.setAttribute("aria-disabled", "false");
    stageHelper.textContent = "";
  }
}

function abrirEtapaIdentidade(moverFoco) {
  navegarComTransicao(identityStep, "backward", function () {
    creationNextButton.hidden = false;
    atualizarEstadoDaEtapa(1);
  }, moverFoco ? "#identity-heading" : "");
}

function abrirEtapaEspecie(validarEtapaAnterior) {
  if (validarEtapaAnterior && !validarIdentidade()) {
    return;
  }

  navegarComTransicao(speciesStep, validarEtapaAnterior ? "forward" : "backward", function () {
    creationNextButton.hidden = false;
    atualizarEstadoDaEtapa(2);
    renderizarEspecies();
    renderizarDetalhesDaEspecie();
    renderizarOpcoesDaEspecie();
  }, "#species-heading");
}

function renderizarEspecies() {
  speciesList.replaceChildren();

  especies.forEach(function (especie) {
    const button = document.createElement("button");
    const icon = document.createElement("span");
    const copy = document.createElement("span");
    const name = document.createElement("strong");
    const summary = document.createElement("small");
    const selected = document.createElement("span");
    const estaSelecionada = personagem.especie === especie.id;

    button.type = "button";
    button.className = "species-list-button";
    button.dataset.speciesId = especie.id;
    button.setAttribute("aria-pressed", estaSelecionada ? "true" : "false");
    icon.className = `species-list-icon species-list-icon--${especie.id}`;
    icon.setAttribute("aria-hidden", "true");
    copy.className = "species-list-button__copy";
    name.textContent = especie.nome;
    summary.textContent = especie.resumo;
    selected.className = "species-list-button__selected";
    selected.textContent = estaSelecionada ? "Selecionado" : "";

    copy.append(name, summary);
    button.append(icon, copy, selected);
    speciesList.append(button);
  });

  ativarMicrointeracoes(speciesList);
  animarCardsDaCategoria(Array.from(speciesList.querySelectorAll(".species-list-button")), "category");
}

function selecionarEspecie(id) {
  const especie = especies.find(function (item) {
    return item.id === id;
  });

  if (!especie) {
    return;
  }

  personagem.especie = id;
  personagem.varianteEspecie = null;
  personagem.atributosEspecie = [];
  personagem.afinidadeEspecie = id === "humano" || id === "quimerico" ? null : especie.afinidade;
  speciesError.textContent = "";
  renderizarEspecies();
  animarSelecao(speciesList.querySelector(`[data-species-id="${id}"]`));
  renderizarDetalhesDaEspecie(true);
  renderizarOpcoesDaEspecie();
}

function preencherLista(elemento, itens) {
  elemento.replaceChildren();
  itens.forEach(function (item) {
    const li = document.createElement("li");
    li.textContent = item;
    elemento.append(li);
  });
}

function preencherBloco(bloco, titulo, texto) {
  bloco.hidden = !texto;
  titulo.textContent = texto ? texto.nome : "";
  titulo.nextElementSibling.textContent = texto ? texto.descricao : "";
}

function renderizarDetalhesDaEspecie(animarTroca) {
  const especie = obterEspecieSelecionada();

  if (!especie) {
    speciesSymbol.className = "species-symbol species-symbol--empty";
    speciesSymbolName.textContent = "Selecione uma espécie";
    esconderArteDaEspecie();
    speciesDetailsEmpty.hidden = false;
    speciesDetailsContent.hidden = true;
    return;
  }

  const variante = obterVarianteSelecionada(especie);
  const dados = variante ? Object.assign({}, especie, variante) : especie;

  if (animarTroca && !speciesDetailsContent.hidden) {
    if (especie.imagem) {
      mostrarArteDaEspecie(especie);
    } else {
      speciesSymbol.className = `species-symbol species-symbol--${especie.id}`;
      esconderArteDaEspecie();
    }

    trocarConteudoAnimado(speciesDetailsContent, function () {
      renderizarDetalhesDaEspecie(false);
    }, true);
    trocarConteudoAnimado(speciesSymbol, function () {}, false);
    return;
  }

  speciesSymbol.className = `species-symbol species-symbol--${especie.id}`;
  speciesSymbolName.textContent = variante ? `${especie.nome} — ${variante.nome}` : especie.nome;
  speciesDetailsEmpty.hidden = true;
  speciesDetailsContent.hidden = false;
  speciesDetailName.textContent = variante ? `${especie.nome} — ${variante.nome}` : especie.nome;
  speciesDetailSummary.textContent = especie.resumo;
  speciesDetailDescription.textContent = especie.descricao;
  preencherLista(speciesDetailModifiers, dados.atributos || []);
  speciesDetailAffinity.textContent = dados.afinidade || "Definida pelas escolhas da espécie";

  const fisicos = especie.fisicos || [];
  speciesPhysicalBlock.hidden = fisicos.length === 0;
  preencherLista(speciesDetailPhysical, fisicos);
  preencherBloco(speciesTraitBlock, speciesDetailTraitName, dados.traco);
  preencherBloco(speciesAbilityBlock, speciesDetailAbilityName, dados.habilidade);
  preencherBloco(speciesVulnerabilityBlock, speciesDetailVulnerabilityName, dados.vulnerabilidade);
  speciesStyleBlock.hidden = !especie.estilo;
  speciesDetailStyle.textContent = especie.estilo || "";
  mostrarArteDaEspecie(especie);
}

function criarGrupoDeEscolha(id, titulo, ajuda) {
  const fieldset = document.createElement("fieldset");
  const legend = document.createElement("legend");
  const help = document.createElement("small");
  const list = document.createElement("div");
  const error = document.createElement("p");

  fieldset.id = id;
  fieldset.className = "species-choice-group";
  legend.textContent = titulo;
  help.textContent = ajuda;
  list.className = "choice-list";
  error.id = `${id}-error`;
  error.className = "choice-error";
  error.setAttribute("aria-live", "polite");
  legend.append(help);
  fieldset.append(legend, list, error);
  speciesOptions.append(fieldset);
  return list;
}

function criarOpcao(lista, tipo, nome, valor, rotulo, marcada, desabilitada) {
  const label = document.createElement("label");
  const input = document.createElement("input");
  const text = document.createElement("span");

  label.className = "choice-option";
  input.type = tipo;
  input.name = nome;
  input.value = valor;
  input.checked = marcada;
  input.disabled = desabilitada;
  text.textContent = rotulo;
  label.append(input, text);
  lista.append(label);
}

function renderizarOpcoesDaEspecie() {
  const especie = obterEspecieSelecionada();
  speciesOptions.replaceChildren();
  speciesOptions.hidden = !especie || !["humano", "quimerico", "caldeano"].includes(especie.id);

  if (!especie || speciesOptions.hidden) {
    return;
  }

  if (especie.id === "humano") {
    const bonusList = criarGrupoDeEscolha("human-bonus-group", "Bônus de atributos", "Escolha dois atributos diferentes.");
    atributosDisponiveis.forEach(function (atributo) {
      const marcada = personagem.atributosEspecie.includes(atributo);
      const desabilitada = personagem.atributosEspecie.length >= 2 && !marcada;
      criarOpcao(bonusList, "checkbox", "human-bonus", atributo, atributo, marcada, desabilitada);
    });

    const affinityList = criarGrupoDeEscolha("human-affinity-group", "Afinidade — Potencial Aberto", "Escolha qualquer atributo.");
    atributosDisponiveis.forEach(function (atributo) {
      criarOpcao(affinityList, "radio", "human-affinity", atributo, atributo, personagem.afinidadeEspecie === atributo, false);
    });
    return;
  }

  if (especie.id === "quimerico") {
    const variantList = criarGrupoDeEscolha("variant-group", "Escolha sua Linhagem", "A Linhagem define seu atributo principal.");
    especie.variantes.forEach(function (variante) {
      criarOpcao(variantList, "radio", "species-variant", variante.id, variante.nome, personagem.varianteEspecie === variante.id, false);
    });

    const variante = obterVarianteSelecionada(especie);
    if (variante) {
      const attributeList = criarGrupoDeEscolha("quimeric-attribute-group", "Atributo adicional", `Não pode ser ${variante.principal}.`);
      atributosDisponiveis.forEach(function (atributo) {
        criarOpcao(attributeList, "radio", "quimeric-attribute", atributo, atributo, personagem.atributosEspecie[0] === atributo, atributo === variante.principal);
      });
    }
    return;
  }

  const formationList = criarGrupoDeEscolha("variant-group", "Escolha sua Formação", "A Formação define seus modificadores.");
  especie.variantes.forEach(function (variante) {
    criarOpcao(formationList, "radio", "species-variant", variante.id, variante.nome, personagem.varianteEspecie === variante.id, false);
  });
}

function selecionarVariante(id) {
  const especie = obterEspecieSelecionada();
  const variante = especie ? especie.variantes.find(function (item) { return item.id === id; }) : null;

  if (!variante) {
    return;
  }

  personagem.varianteEspecie = id;
  personagem.atributosEspecie = [];
  personagem.afinidadeEspecie = variante.afinidade || especie.afinidade;
  renderizarDetalhesDaEspecie(true);
  renderizarOpcoesDaEspecie();
}

function selecionarBonusHumano(atributo, selecionado) {
  if (selecionado && !personagem.atributosEspecie.includes(atributo) && personagem.atributosEspecie.length < 2) {
    personagem.atributosEspecie.push(atributo);
  }

  if (!selecionado) {
    personagem.atributosEspecie = personagem.atributosEspecie.filter(function (item) {
      return item !== atributo;
    });
  }

  renderizarOpcoesDaEspecie();
}

function selecionarAfinidade(atributo) {
  personagem.afinidadeEspecie = atributo;
}

function selecionarAtributoQuimerico(atributo) {
  const especie = obterEspecieSelecionada();
  const variante = obterVarianteSelecionada(especie);

  if (!variante || atributo === variante.principal) {
    return;
  }

  personagem.atributosEspecie = [atributo];
}

function focarGrupo(id, nomeDoInput) {
  const group = document.querySelector(`#${id}`);
  const input = group ? group.querySelector(`input[name="${nomeDoInput}"]:not(:disabled)`) : null;

  if (input) {
    input.focus();
  }
}

function validarEspecie() {
  speciesError.textContent = "";

  if (!personagem.especie) {
    speciesError.textContent = "Escolha uma espécie para continuar.";
    const primeiroBotao = speciesList.querySelector("button");
    if (primeiroBotao) primeiroBotao.focus();
    return false;
  }

  const especie = obterEspecieSelecionada();

  if (especie.id === "humano") {
    const bonusError = document.querySelector("#human-bonus-group-error");
    const affinityError = document.querySelector("#human-affinity-group-error");
    bonusError.textContent = personagem.atributosEspecie.length === 2 ? "" : "Escolha dois atributos diferentes.";
    affinityError.textContent = personagem.afinidadeEspecie ? "" : "Escolha uma afinidade.";

    if (bonusError.textContent) {
      focarGrupo("human-bonus-group", "human-bonus");
      return false;
    }
    if (affinityError.textContent) {
      focarGrupo("human-affinity-group", "human-affinity");
      return false;
    }
  }

  if (especie.id === "quimerico") {
    const variantError = document.querySelector("#variant-group-error");
    variantError.textContent = personagem.varianteEspecie ? "" : "Escolha uma linhagem.";
    if (variantError.textContent) {
      focarGrupo("variant-group", "species-variant");
      return false;
    }

    const attributeError = document.querySelector("#quimeric-attribute-group-error");
    attributeError.textContent = personagem.atributosEspecie.length === 1 ? "" : "Escolha o atributo adicional da linhagem.";
    if (attributeError.textContent) {
      focarGrupo("quimeric-attribute-group", "quimeric-attribute");
      return false;
    }
  }

  if (especie.id === "caldeano") {
    const variantError = document.querySelector("#variant-group-error");
    variantError.textContent = personagem.varianteEspecie ? "" : "Escolha uma formação.";
    if (variantError.textContent) {
      focarGrupo("variant-group", "species-variant");
      return false;
    }
  }

  return true;
}

function obterCategoriasVisiveis() {
  const categorias = categoriasDeClasse.slice();
  const possuiImportadas = classes.some(function (classe) { return classe.importada; });

  if (possuiImportadas) {
    categorias.push({ id: "importadas", rotulo: "Importadas", categoria: "Importadas" });
  }

  return categorias;
}

function obterClassesDaCategoria() {
  return classes.filter(function (classe) {
    return classe.categoria === categoriaDeClasseAtual;
  });
}

function renderizarCategoriasDeClasse() {
  classCategories.replaceChildren();

  obterCategoriasVisiveis().forEach(function (categoria) {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.classCategory = categoria.categoria;
    button.textContent = categoria.rotulo;
    button.setAttribute("aria-pressed", categoria.categoria === categoriaDeClasseAtual ? "true" : "false");
    classCategories.append(button);
  });
}

function selecionarCategoriaDeClasse(categoria) {
  const existe = obterCategoriasVisiveis().some(function (item) {
    return item.categoria === categoria;
  });

  if (!existe) {
    return;
  }

  categoriaDeClasseAtual = categoria;
  paginaDeClassesAtual = 1;
  renderizarCategoriasDeClasse();
  renderizarClasses("category");
}

function criarSimboloDaClasse(id, classeCss) {
  const namespace = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(namespace, "svg");
  const path = document.createElementNS(namespace, "path");
  const circle = document.createElementNS(namespace, "circle");
  const possuiSimboloProprio = Object.prototype.hasOwnProperty.call(caminhosDosSimbolos, id);
  const caminho = possuiSimboloProprio ? caminhosDosSimbolos[id] : "M80 31 95 64l34 4-25 23 7 34-31-17-31 17 7-34-25-23 34-4z";

  svg.setAttribute("viewBox", "0 0 160 160");
  svg.setAttribute("focusable", "false");
  svg.setAttribute("aria-hidden", "true");
  if (classeCss) svg.setAttribute("class", classeCss);
  circle.setAttribute("cx", "80");
  circle.setAttribute("cy", "80");
  circle.setAttribute("r", "58");
  circle.setAttribute("fill", "none");
  circle.setAttribute("stroke", "currentColor");
  circle.setAttribute("stroke-width", "1");
  circle.setAttribute("stroke-dasharray", "3 8");
  circle.setAttribute("opacity", "0.34");
  path.setAttribute("d", caminho);
  path.setAttribute("fill", "none");
  path.setAttribute("stroke", "currentColor");
  path.setAttribute("stroke-width", "5");
  path.setAttribute("stroke-linecap", "round");
  path.setAttribute("stroke-linejoin", "round");
  svg.append(circle, path);
  return svg;
}

function renderizarClasses(tipoDeEntrada) {
  const classesDaCategoria = obterClassesDaCategoria();
  const totalDePaginas = Math.max(1, Math.ceil(classesDaCategoria.length / 4));
  paginaDeClassesAtual = Math.min(paginaDeClassesAtual, totalDePaginas);
  const inicio = (paginaDeClassesAtual - 1) * 4;
  const classesDaPagina = classesDaCategoria.slice(inicio, inicio + 4);
  classList.replaceChildren();

  classesDaPagina.forEach(function (classe) {
    const button = document.createElement("button");
    const icon = document.createElement("span");
    const copy = document.createElement("span");
    const name = document.createElement("strong");
    const summary = document.createElement("small");
    const category = document.createElement("em");
    const selected = document.createElement("span");
    const estaSelecionada = personagem.classe === classe.id;

    button.type = "button";
    button.className = "class-card";
    button.dataset.classId = classe.id;
    button.setAttribute("aria-pressed", estaSelecionada ? "true" : "false");
    icon.className = "class-card__icon";
    icon.append(criarSimboloDaClasse(classe.id));
    copy.className = "class-card__copy";
    name.textContent = classe.nome;
    summary.textContent = classe.resumo;
    category.textContent = classe.categoria;
    selected.className = "class-card__selected";
    selected.textContent = estaSelecionada ? "Selecionado" : "";
    copy.append(name, summary, category);
    button.append(icon, copy, selected);
    classList.append(button);
  });

  ativarMicrointeracoes(classList);
  animarCardsDaCategoria(Array.from(classList.querySelectorAll(".class-card")), tipoDeEntrada || "category");

  classPageStatus.textContent = `${paginaDeClassesAtual} / ${totalDePaginas}`;
  classPagePrevious.disabled = paginaDeClassesAtual === 1;
  classPageNext.disabled = paginaDeClassesAtual === totalDePaginas;
  classPagePrevious.hidden = totalDePaginas === 1;
  classPageNext.hidden = totalDePaginas === 1;
}

function mudarPaginaDeClasses(direcao) {
  const totalDePaginas = Math.max(1, Math.ceil(obterClassesDaCategoria().length / 4));
  const novaPagina = paginaDeClassesAtual + direcao;

  if (novaPagina < 1 || novaPagina > totalDePaginas) {
    return;
  }

  paginaDeClassesAtual = novaPagina;
  renderizarClasses(direcao > 0 ? "page-next" : "page-prev");
  const primeiroCard = classList.querySelector("button");
  if (primeiroCard) primeiroCard.focus();
}

function selecionarClasse(id) {
  const classe = classes.find(function (item) { return item.id === id; });

  if (!classe) {
    return;
  }

  personagem.classe = classe.id;
  personagem.classeImportada = classe.importada === true;
  abaDeClasseAtual = "overview";
  classMessage.textContent = "";
  classMessage.removeAttribute("data-state");
  renderizarClasses("category");
  animarSelecao(classList.querySelector(`[data-class-id="${id}"]`));
  renderizarSimboloDaClasse(true);
  renderizarDetalhesDaClasse(true);
}

function renderizarSimboloDaClasse(animarTroca) {
  if (animarTroca && classSymbol.childNodes.length) {
    trocarConteudoAnimado(classSymbol, function () {
      renderizarSimboloDaClasse(false);
    }, false);
    return;
  }

  const classe = obterClasseSelecionada();
  classSymbol.replaceChildren();

  if (!classe) {
    classSymbolName.textContent = "Selecione uma Classe";
    classSymbolMechanic.textContent = "Como você interage com o mundo";
    return;
  }

  const simbolo = criarSimboloDaClasse(classe.id);
  while (simbolo.firstChild) {
    classSymbol.append(simbolo.firstChild);
  }
  classSymbolName.textContent = classe.nome;
  classSymbolMechanic.textContent = classe.mecanica.nome;
}

function preencherPainelDaClasse(titulo, descricao, itens) {
  classPanelTitle.textContent = titulo;
  classPanelDescription.textContent = descricao;
  classPanelList.replaceChildren();
  classPanelList.hidden = itens.length === 0;

  itens.forEach(function (item) {
    const li = document.createElement("li");
    li.textContent = item;
    classPanelList.append(li);
  });
}

function selecionarAbaDaClasse(aba, moverFoco) {
  const classe = obterClasseSelecionada();
  const abasValidas = ["overview", "mechanic", "risk", "specializations"];

  if (!classe || !abasValidas.includes(aba)) {
    return;
  }

  abaDeClasseAtual = aba;
  classTabs.querySelectorAll("[role='tab']").forEach(function (button) {
    const ativa = button.dataset.classTab === aba;
    button.setAttribute("aria-selected", ativa ? "true" : "false");
    button.tabIndex = ativa ? 0 : -1;
    if (ativa) {
      classTabPanel.setAttribute("aria-labelledby", button.id);
      if (moverFoco) button.focus();
    }
  });

  if (aba === "overview") {
    preencherPainelDaClasse("Como interage com o mundo", classe.descricao, classe.focos.map(function (foco) { return `Foco: ${foco}`; }));
  }

  if (aba === "mechanic") {
    preencherPainelDaClasse(classe.mecanica.nome, classe.mecanica.descricao, classe.mecanica.usos || []);
  }

  if (aba === "risk") {
    preencherPainelDaClasse(classe.risco.nome, classe.risco.descricao, []);
  }

  if (aba === "specializations") {
    const especializacoes = classe.especializacoes || [];
    const descricao = especializacoes.length ? "Possibilidades futuras desta Classe. Nenhuma especialização é escolhida nesta etapa." : "As especializações desta Classe ainda serão definidas.";
    const itens = especializacoes.map(function (especializacao) {
      return `${especializacao.nome} — ${especializacao.descricao}`;
    });
    preencherPainelDaClasse("Especializações", descricao, itens);
  }
}

function animarEntradaDoPainelDaClasse() {
  if (deveReduzirMovimento()) {
    return;
  }

  classTabPanel.classList.remove("content-swap--entering");
  void classTabPanel.offsetWidth;
  classTabPanel.classList.add("content-swap", "content-swap--entering");
  classTabPanel.addEventListener("animationend", function () {
    classTabPanel.classList.remove("content-swap--entering");
  }, { once: true });
}

function renderizarDetalhesDaClasse(animarTroca) {
  const classe = obterClasseSelecionada();

  if (!classe) {
    classDetailsEmpty.hidden = false;
    classDetailsContent.hidden = true;
    return;
  }

  if (animarTroca && !classDetailsContent.hidden) {
    trocarConteudoAnimado(classDetailsContent, function () {
      renderizarDetalhesDaClasse(false);
    }, true);
    return;
  }

  classDetailsEmpty.hidden = true;
  classDetailsContent.hidden = false;
  classDetailCategory.textContent = classe.categoria;
  classDetailName.textContent = classe.nome;
  classDetailSummary.textContent = classe.resumo;
  selecionarAbaDaClasse(abaDeClasseAtual, false);
}

function abrirImportacaoDeClasse() {
  classJsonInput.value = "";
  classJsonInput.click();
}

function validarClasseImportada(dados) {
  if (!dados || dados.tipo !== "grimorio-classe") {
    return "Este arquivo não contém uma Classe do Grimório.";
  }

  if (dados.versao !== 1) {
    return "A versão desta Classe não é compatível.";
  }

  const classe = dados.classe;
  const campos = [
    classe && classe.id,
    classe && classe.nome,
    classe && classe.resumo,
    classe && classe.descricao,
    classe && classe.mecanica && classe.mecanica.nome,
    classe && classe.mecanica && classe.mecanica.descricao,
    classe && classe.risco && classe.risco.nome,
    classe && classe.risco && classe.risco.descricao
  ];

  if (!classe || campos.some(function (campo) { return typeof campo !== "string" || !campo.trim(); })) {
    return "A Classe importada possui campos obrigatórios ausentes.";
  }

  if ((classe.especializacoes !== undefined && !Array.isArray(classe.especializacoes)) || (classe.focos !== undefined && !Array.isArray(classe.focos))) {
    return "A Classe importada possui campos obrigatórios ausentes.";
  }

  const idNormalizado = classe.id.trim().toLocaleLowerCase("pt-BR");
  if (classes.some(function (item) { return item.id.toLocaleLowerCase("pt-BR") === idNormalizado; })) {
    return "Já existe uma Classe com este identificador.";
  }

  return "";
}

function criarClasseImportada(dados) {
  const origem = dados.classe;
  const especializacoes = Array.isArray(origem.especializacoes) ? origem.especializacoes.filter(function (item) {
    return item && typeof item.nome === "string" && typeof item.descricao === "string";
  }).map(function (item) {
    return { nome: item.nome.trim(), descricao: item.descricao.trim() };
  }) : [];
  const focos = Array.isArray(origem.focos) ? origem.focos.filter(function (item) {
    return typeof item === "string";
  }).map(function (item) { return item.trim(); }).filter(Boolean) : [];

  return {
    id: origem.id.trim(),
    nome: origem.nome.trim(),
    categoria: "Importadas",
    resumo: origem.resumo.trim(),
    descricao: origem.descricao.trim(),
    mecanica: {
      nome: origem.mecanica.nome.trim(),
      descricao: origem.mecanica.descricao.trim(),
      usos: []
    },
    risco: {
      nome: origem.risco.nome.trim(),
      descricao: origem.risco.descricao.trim()
    },
    especializacoes: especializacoes,
    focos: focos,
    importada: true
  };
}

function importarClasse(event) {
  const arquivo = event.target.files[0];
  classMessage.removeAttribute("data-state");

  if (!arquivo || !arquivo.name.toLowerCase().endsWith(".json")) {
    classMessage.textContent = "Selecione um arquivo JSON válido.";
    return;
  }

  const leitor = new FileReader();
  leitor.addEventListener("load", function () {
    let dados;

    try {
      dados = JSON.parse(String(leitor.result));
    } catch (erro) {
      classMessage.textContent = "Selecione um arquivo JSON válido.";
      return;
    }

    const erroDeValidacao = validarClasseImportada(dados);
    if (erroDeValidacao) {
      classMessage.textContent = erroDeValidacao;
      return;
    }

    const classe = criarClasseImportada(dados);
    classes.push(classe);
    personagem.classe = classe.id;
    personagem.classeImportada = true;
    categoriaDeClasseAtual = "Importadas";
    paginaDeClassesAtual = 1;
    abaDeClasseAtual = "overview";
    classMessage.textContent = "Classe importada com sucesso.";
    classMessage.dataset.state = "success";
    renderizarCategoriasDeClasse();
    renderizarClasses("category");
    animarSelecao(classList.querySelector(`[data-class-id="${classe.id}"]`));
    renderizarSimboloDaClasse(true);
    renderizarDetalhesDaClasse(true);
  });

  leitor.addEventListener("error", function () {
    classMessage.textContent = "Não foi possível ler este arquivo.";
  });
  leitor.readAsText(arquivo);
}

function validarClasse() {
  classMessage.removeAttribute("data-state");

  if (personagem.classe) {
    classMessage.textContent = "";
    return true;
  }

  classMessage.textContent = "Escolha uma Classe para continuar.";
  const primeiroCard = classList.querySelector("button[data-class-id]");
  if (primeiroCard) primeiroCard.focus();
  return false;
}

function obterNomeDaEspecieParaResumo() {
  const especie = obterEspecieSelecionada();
  return especie ? especie.nome : "Não definida";
}

function obterNomeDaClasseParaResumo() {
  const classe = obterClasseSelecionada();
  return classe ? classe.nome : "Não definida";
}

function normalizarAtributo(valor) {
  return String(valor || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/ç/g, "c")
    .replace(/[^a-z]/g, "");
}

function obterIdDoAtributo(valor) {
  const normalizado = normalizarAtributo(valor);
  const atributo = atributosDeMeridian.find(function (item) {
    return normalizarAtributo(item.nome) === normalizado || normalizarAtributo(item.sigla) === normalizado || item.id === normalizado;
  });

  return atributo ? atributo.id : null;
}

function criarModificadoresZerados() {
  return atributosDeMeridian.reduce(function (modificadores, atributo) {
    modificadores[atributo.id] = 0;
    return modificadores;
  }, {});
}

function aplicarModificador(modificadores, atributo, valor) {
  const id = obterIdDoAtributo(atributo);
  if (id) modificadores[id] += valor;
}

function obterModificadoresDaEspecie() {
  const especie = obterEspecieSelecionada();
  const modificadores = criarModificadoresZerados();

  if (!especie) return null;

  if (especie.id === "humano") {
    if (personagem.atributosEspecie.length !== 2 || !personagem.afinidadeEspecie) return null;
    personagem.atributosEspecie.forEach(function (atributo) {
      aplicarModificador(modificadores, atributo, 1);
    });
    return modificadores;
  }

  if (especie.id === "vesperiano") {
    aplicarModificador(modificadores, "Agilidade", 2);
    aplicarModificador(modificadores, "Intelecto", 1);
    aplicarModificador(modificadores, "Resistência", -1);
    return modificadores;
  }

  if (especie.id === "ferrano") {
    aplicarModificador(modificadores, "Resistência", 2);
    aplicarModificador(modificadores, "Força", 1);
    aplicarModificador(modificadores, "Agilidade", -1);
    return modificadores;
  }

  if (especie.id === "nacaro") {
    aplicarModificador(modificadores, "Agilidade", 2);
    aplicarModificador(modificadores, "Resistência", 1);
    aplicarModificador(modificadores, "Força", -1);
    return modificadores;
  }

  if (especie.id === "quimerico") {
    const variante = obterVarianteSelecionada(especie);
    const atributoAdicional = personagem.atributosEspecie[0];
    if (!variante || !atributoAdicional) return null;

    aplicarModificador(modificadores, variante.principal, 2);
    aplicarModificador(modificadores, atributoAdicional, 1);

    if (variante.id === "felina") aplicarModificador(modificadores, "Resistência", -1);
    if (variante.id === "canidea") aplicarModificador(modificadores, "Intelecto", -1);
    if (variante.id === "caprina" || variante.id === "reptiliana") aplicarModificador(modificadores, "Agilidade", -1);

    return modificadores;
  }

  if (especie.id === "caldeano") {
    const variante = obterVarianteSelecionada(especie);
    if (!variante) return null;

    aplicarModificador(modificadores, "Resistência", 2);
    aplicarModificador(modificadores, variante.id === "tecnico" ? "Intelecto" : "Força", 1);
    aplicarModificador(modificadores, "Agilidade", -1);
    return modificadores;
  }

  return null;
}

function obterAfinidadeDoPersonagem() {
  return obterIdDoAtributo(personagem.afinidadeEspecie);
}

function calcularCustoTotalDoAtributo(valor) {
  let custo = 0;

  for (let nivel = 1; nivel <= valor; nivel += 1) {
    custo += CONFIGURACAO_ATRIBUTOS.custosPorNivel[nivel] || 0;
  }

  return custo;
}

function valorPossuiCustosConfigurados(valor) {
  for (let nivel = 1; nivel <= valor; nivel += 1) {
    if (!(nivel in CONFIGURACAO_ATRIBUTOS.custosPorNivel)) return false;
  }

  return true;
}

function obterCustoDoProximoNivel(valorAtual) {
  const proximoNivel = valorAtual + 1;

  return (
    CONFIGURACAO_ATRIBUTOS.custosPorNivel[proximoNivel] ??
    Infinity
  );
}

function calcularPontosUtilizados() {
  return atributosDeMeridian.reduce(function (total, atributo) {
    return total + calcularCustoTotalDoAtributo(personagem.atributos[atributo.id]);
  }, 0);
}

function calcularPontosRestantes() {
  return CONFIGURACAO_ATRIBUTOS.pontosDisponiveis - calcularPontosUtilizados();
}

function calcularLimiteFinal(atributo) {
  return obterAfinidadeDoPersonagem() === atributo
    ? CONFIGURACAO_ATRIBUTOS.limiteFinalAfinidade
    : CONFIGURACAO_ATRIBUTOS.limiteFinalNormal;
}

function calcularValorFinal(atributo, valorDistribuido) {
  const modificadores = obterModificadoresDaEspecie();
  const valor = valorDistribuido ?? personagem.atributos[atributo];

  if (!modificadores) return NaN;
  return valor + modificadores[atributo];
}

function podeAumentarAtributo(atributo) {
  const valorAtual = personagem.atributos[atributo];
  const proximoValor = valorAtual + 1;
  const custo = obterCustoDoProximoNivel(valorAtual);

  if (!Number.isFinite(custo)) return false;
  if (custo > calcularPontosRestantes()) return false;

  return calcularValorFinal(atributo, proximoValor) <= calcularLimiteFinal(atributo);
}

function obterMensagemDoProximoNivel(atributo) {
  const valorAtual = personagem.atributos[atributo];
  const custo = obterCustoDoProximoNivel(valorAtual);

  if (!Number.isFinite(custo) || calcularValorFinal(atributo, valorAtual + 1) > calcularLimiteFinal(atributo)) {
    return "Limite alcançado";
  }

  if (custo > calcularPontosRestantes()) {
    return "Pontos insuficientes";
  }

  return `Próximo nível: ${custo} ponto${custo === 1 ? "" : "s"}`;
}

function renderizarAtributos(direcaoAlteracao, atributoAlterado) {
  const modificadores = obterModificadoresDaEspecie();
  const afinidade = obterAfinidadeDoPersonagem();

  attributesList.replaceChildren();
  attributesError.textContent = modificadores ? "" : "Não foi possível aplicar os modificadores da Espécie.";

  atributosDeMeridian.forEach(function (atributo) {
    const valorDistribuido = personagem.atributos[atributo.id];
    const modificador = modificadores ? modificadores[atributo.id] : 0;
    const valorFinal = valorDistribuido + modificador;
    const possuiAfinidade = afinidade === atributo.id;

    const card = document.createElement("article");
    card.className = "attribute-card";

    const icon = document.createElement("span");
    icon.className = "attribute-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = atributo.sigla;

    const copy = document.createElement("div");
    copy.className = "attribute-copy";

    const title = document.createElement("div");
    title.className = "attribute-title";
    const name = document.createElement("strong");
    name.textContent = atributo.nome;
    const acronym = document.createElement("span");
    acronym.textContent = atributo.sigla;
    title.append(name, acronym);

    const description = document.createElement("p");
    description.textContent = atributo.descricao;
    copy.append(title, description);

    if (possuiAfinidade) {
      const affinity = document.createElement("span");
      affinity.className = "attribute-affinity";
      affinity.textContent = `Afinidade - limite ${CONFIGURACAO_ATRIBUTOS.limiteFinalAfinidade}`;
      copy.append(affinity);
    }

    const controls = document.createElement("div");
    controls.className = "attribute-controls";
    const decrease = document.createElement("button");
    decrease.type = "button";
    decrease.dataset.attributeAction = "decrease";
    decrease.dataset.attribute = atributo.id;
    decrease.setAttribute("aria-label", `Diminuir ${atributo.nome}`);
    decrease.disabled = valorDistribuido <= CONFIGURACAO_ATRIBUTOS.valorInicial;
    decrease.textContent = "-";
    const distributedValue = document.createElement("span");
    distributedValue.className = "attribute-distributed-value";
    distributedValue.textContent = valorDistribuido;
    const increase = document.createElement("button");
    increase.type = "button";
    increase.dataset.attributeAction = "increase";
    increase.dataset.attribute = atributo.id;
    increase.setAttribute("aria-label", `Aumentar ${atributo.nome}`);
    increase.disabled = !podeAumentarAtributo(atributo.id);
    increase.textContent = "+";
    controls.append(decrease, distributedValue, increase);

    const values = document.createElement("dl");
    values.className = "attribute-values";

    [
      ["Distribuído", valorDistribuido, ""],
      ["Espécie", formatarModificador(modificador), modificador < 0 ? "attribute-modifier--negative" : modificador > 0 ? "attribute-modifier--positive" : ""],
      ["Final", valorFinal, "attribute-final-value"]
    ].forEach(function ([label, value, className]) {
      const item = document.createElement("div");
      const dt = document.createElement("dt");
      const dd = document.createElement("dd");
      dt.textContent = label;
      dd.textContent = value;
      if (className) dd.className = className;
      if (label === "Final") dd.dataset.finalValue = atributo.id;
      item.append(dt, dd);
      values.append(item);
    });

    const note = document.createElement("p");
    note.className = "attribute-note";
    note.textContent = obterMensagemDoProximoNivel(atributo.id);

    card.append(icon, copy, controls, values, note);
    attributesList.append(card);
  });

  renderizarResumoDosAtributos();
  atualizarEstadoDoBotaoDeRevisao();

  if (direcaoAlteracao && atributoAlterado) {
    animarValorFinal(atributoAlterado, direcaoAlteracao);
  }
}

function formatarModificador(valor) {
  if (valor > 0) return `+${valor}`;
  return String(valor);
}

function obterPericiaPorId(id) {
  return PERICIAS.find(function (pericia) {
    return pericia.id === id;
  }) || null;
}

function contarPericiasTreinadas() {
  return Object.values(personagem.pericias)
    .filter(Boolean)
    .length;
}

function atingiuLimiteDePericias() {
  return (
    contarPericiasTreinadas() >=
    CONFIGURACAO_PERICIAS.limiteTreinadas
  );
}

function mostrarMensagemDePericias(mensagem) {
  skillsMessage.textContent = mensagem;
}

function obterDadoDaPericia(id) {
  return personagem.pericias[id]
    ? CONFIGURACAO_PERICIAS.dadoTreinado
    : CONFIGURACAO_PERICIAS.dadoNaoTreinado;
}

function obterAtributoDaPericia(id) {
  const pericia = obterPericiaPorId(id);
  return pericia ? pericia.atributo : null;
}

function obterValorFinalDaPericia(id) {
  const atributo = obterAtributoDaPericia(id);
  return atributo ? calcularValorFinal(atributo) : NaN;
}

function alternarTreinamentoDaPericia(id, treinada) {
  const periciaExiste = PERICIAS.some(function (pericia) {
    return pericia.id === id;
  });

  if (!periciaExiste) return;

  const jaEstaTreinada = personagem.pericias[id] === true;

  if (
    treinada &&
    !jaEstaTreinada &&
    atingiuLimiteDePericias()
  ) {
    mostrarMensagemDePericias(
      `Você já escolheu o limite de ${CONFIGURACAO_PERICIAS.limiteTreinadas} Perícias treinadas.`
    );
    renderizarPericias();
    return;
  }

  personagem.pericias[id] = treinada;
  mostrarMensagemDePericias("");
  renderizarPericias();
}

function obterSiglaDoAtributo(atributoId) {
  const atributo = atributosDeMeridian.find(function (atributo) {
    return atributo.id === atributoId;
  });

  return atributo ? atributo.sigla : "";
}

function obterPericiasVisiveis() {
  if (window.matchMedia("(max-width: 899px)").matches) {
    const inicio = (paginaDePericiasAtual - 1) * PERICIAS_POR_PAGINA;
    return [PERICIAS.slice(inicio, inicio + PERICIAS_POR_PAGINA)];
  }

  return [PERICIAS.slice(0, 11), PERICIAS.slice(11, 22)];
}

function criarCabecalhoDePericias() {
  const header = document.createElement("div");
  header.className = "skill-header";
  ["Perícia", "Atributo", "Treinado?", "Teste"].forEach(function (texto) {
    const span = document.createElement("span");
    span.textContent = texto;
    header.append(span);
  });
  return header;
}

function criarLinhaDePericia(pericia) {
  const treinada = personagem.pericias[pericia.id] === true;
  const limiteAtingido = atingiuLimiteDePericias();
  const bloqueada = limiteAtingido && !treinada;
  const row = document.createElement("div");
  row.className = bloqueada ? "skill-row is-disabled" : "skill-row";
  if (bloqueada) {
    row.title = `Limite de ${CONFIGURACAO_PERICIAS.limiteTreinadas} Perícias treinadas alcançado.`;
  }

  const nome = document.createElement("span");
  nome.className = "skill-name";
  nome.textContent = pericia.nome;

  const atributo = document.createElement("span");
  atributo.className = "skill-attribute";
  atributo.textContent = `${obterSiglaDoAtributo(pericia.atributo)} ${calcularValorFinal(pericia.atributo)}`;

  const treinamento = document.createElement("label");
  treinamento.className = treinada ? "skill-training is-trained" : "skill-training";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.dataset.skillId = pericia.id;
  checkbox.checked = treinada;
  checkbox.disabled = bloqueada;
  checkbox.setAttribute("aria-label", `Marcar ${pericia.nome} como treinada`);
  if (bloqueada) {
    checkbox.title = `Limite de ${CONFIGURACAO_PERICIAS.limiteTreinadas} Perícias treinadas alcançado.`;
  }

  const treinamentoTexto = document.createElement("span");
  treinamentoTexto.textContent = treinada ? "Treinada" : "Não treinada";
  treinamento.append(checkbox, treinamentoTexto);

  const teste = document.createElement("span");
  teste.className = "skill-test";
  teste.textContent = `${obterDadoDaPericia(pericia.id)} + ${obterValorFinalDaPericia(pericia.id)}`;

  row.append(nome, atributo, treinamento, teste);
  return row;
}

function renderizarPericias() {
  const totalPaginas = window.matchMedia("(max-width: 899px)").matches ? 2 : 1;
  paginaDePericiasAtual = Math.min(Math.max(1, paginaDePericiasAtual), totalPaginas);

  skillsList.replaceChildren();
  obterPericiasVisiveis().forEach(function (periciasDaColuna) {
    const column = document.createElement("div");
    column.className = "skills-column";
    column.append(criarCabecalhoDePericias());
    periciasDaColuna.forEach(function (pericia) {
      column.append(criarLinhaDePericia(pericia));
    });
    skillsList.append(column);
  });

  skillsPageLabel.textContent = `${paginaDePericiasAtual} / ${totalPaginas}`;
  skillsPrevPage.disabled = paginaDePericiasAtual <= 1;
  skillsNextPage.disabled = paginaDePericiasAtual >= totalPaginas;
  renderizarResumoDasPericias();
}

function renderizarResumoDasPericias() {
  const treinadas = contarPericiasTreinadas();
  const periciasRestantes = Math.max(0, CONFIGURACAO_PERICIAS.limiteTreinadas - treinadas);

  skillsTrainedCount.textContent = treinadas;
  skillsTrainedLimit.textContent = CONFIGURACAO_PERICIAS.limiteTreinadas;
  if (treinadas === CONFIGURACAO_PERICIAS.limiteTreinadas && !skillsMessage.textContent.startsWith("Você já")) {
    mostrarMensagemDePericias("Seleção completa.");
  } else if (periciasRestantes > 0 && !skillsMessage.textContent) {
    mostrarMensagemDePericias(`Escolha mais ${periciasRestantes} Perícia${periciasRestantes === 1 ? "" : "s"}.`);
  }
  skillsAttributeSummary.replaceChildren();

  atributosDeMeridian.forEach(function (atributo) {
    const quantidade = PERICIAS.filter(function (pericia) {
      return pericia.atributo === atributo.id;
    }).length;

    const item = document.createElement("div");
    const dt = document.createElement("dt");
    const dd = document.createElement("dd");
    dt.textContent = atributo.sigla;
    dd.textContent = `${quantidade} perícia${quantidade === 1 ? "" : "s"}`;
    item.append(dt, dd);
    skillsAttributeSummary.append(item);
  });
  atualizarEstadoDoBotaoDeRevisao();
}

function mostrarMensagemDeAtributos(mensagem) {
  attributesError.textContent = mensagem;
}

function obterPendenciasDosAtributos() {
  const pontosRestantes = calcularPontosRestantes();
  const periciasTreinadas = contarPericiasTreinadas();
  const periciasRestantes = CONFIGURACAO_PERICIAS.limiteTreinadas - periciasTreinadas;

  return {
    pontosRestantes,
    periciasTreinadas,
    periciasRestantes
  };
}

function atributosEPericiasCompletos() {
  const pendencias = obterPendenciasDosAtributos();

  return pendencias.pontosRestantes === 0 && pendencias.periciasTreinadas === CONFIGURACAO_PERICIAS.limiteTreinadas;
}

function obterMensagemDePendenciasDosAtributos() {
  const pendencias = obterPendenciasDosAtributos();
  const partes = [];

  if (pendencias.pontosRestantes > 0) {
    partes.push(`distribua ${pendencias.pontosRestantes} ponto${pendencias.pontosRestantes === 1 ? "" : "s"} restante${pendencias.pontosRestantes === 1 ? "" : "s"}`);
  }

  if (pendencias.periciasRestantes > 0) {
    partes.push(`escolha mais ${pendencias.periciasRestantes} Perícia${pendencias.periciasRestantes === 1 ? "" : "s"}`);
  }

  if (partes.length === 0) {
    return "Escolhas concluídas. Você pode avançar.";
  }

  return `Para continuar, ${partes.join(" e ")}.`;
}

function atualizarEstadoDoBotaoDeRevisao() {
  if (etapaAtual !== 5) return;

  const completo = atributosEPericiasCompletos();
  creationNextButton.disabled = !completo;
  creationNextButton.setAttribute("aria-disabled", String(!completo));
  stageHelper.textContent = obterMensagemDePendenciasDosAtributos();
}

function focarPrimeiroControleDeAtributoDisponivel() {
  const botao = attributesList.querySelector('button[data-attribute-action="increase"]:not(:disabled)');
  if (botao) botao.focus();
}

function focarPrimeiraPericiaDisponivel() {
  const checkbox = skillsList.querySelector('input[data-skill-id]:not(:disabled)');
  if (checkbox) checkbox.focus();
}

function validarAtributosEPericias() {
  const pontosRestantes = calcularPontosRestantes();
  const totalPericias = contarPericiasTreinadas();

  if (!validarAtributos()) {
    return false;
  }

  if (pontosRestantes !== 0) {
    mostrarMensagemDeAtributos(`Distribua todos os pontos de atributos antes de continuar. Você ainda possui ${pontosRestantes} ponto${pontosRestantes === 1 ? "" : "s"} para distribuir.`);
    selecionarAbaDosAtributos("atributos");
    focarPrimeiroControleDeAtributoDisponivel();
    atualizarEstadoDoBotaoDeRevisao();
    return false;
  }

  if (totalPericias !== CONFIGURACAO_PERICIAS.limiteTreinadas) {
    mostrarMensagemDePericias(`Escolha exatamente ${CONFIGURACAO_PERICIAS.limiteTreinadas} Perícias treinadas antes de continuar. Você escolheu ${totalPericias} de ${CONFIGURACAO_PERICIAS.limiteTreinadas} Perícias.`);
    selecionarAbaDosAtributos("pericias");
    focarPrimeiraPericiaDisponivel();
    atualizarEstadoDoBotaoDeRevisao();
    return false;
  }

  return true;
}

function selecionarAbaDosAtributos(aba) {
  abaDosAtributosAtual = aba === "pericias" ? "pericias" : "atributos";
  const mostrandoPericias = abaDosAtributosAtual === "pericias";

  attributesPanel.hidden = mostrandoPericias;
  skillsPanel.hidden = !mostrandoPericias;
  attributesTabButton.classList.toggle("is-active", !mostrandoPericias);
  skillsTabButton.classList.toggle("is-active", mostrandoPericias);
  attributesTabButton.setAttribute("aria-selected", mostrandoPericias ? "false" : "true");
  skillsTabButton.setAttribute("aria-selected", mostrandoPericias ? "true" : "false");

  if (mostrandoPericias) {
    renderizarPericias();
  } else {
    renderizarAtributos();
  }
}

function mudarPaginaDePericias(direcao) {
  paginaDePericiasAtual += direcao;
  renderizarPericias();
}

function renderizarResumoDosAtributos() {
  const pontosUtilizados = calcularPontosUtilizados();
  const pontosRestantes = calcularPontosRestantes();
  const afinidade = obterAfinidadeDoPersonagem();
  const atributoAfinidade = atributosDeMeridian.find(function (atributo) {
    return atributo.id === afinidade;
  });

  attributesPointsTotal.textContent = CONFIGURACAO_ATRIBUTOS.pontosDisponiveis;
  attributesPointsRemaining.textContent = pontosRestantes;
  attributesPointsUsed.textContent = pontosUtilizados;
  attributesPointsBar.style.width = `${Math.min(100, Math.max(0, (pontosUtilizados / CONFIGURACAO_ATRIBUTOS.pontosDisponiveis) * 100))}%`;
  attributesAffinityName.textContent = atributoAfinidade ? atributoAfinidade.nome : "Não definida";
  attributesAffinityLimit.textContent = CONFIGURACAO_ATRIBUTOS.limiteFinalAfinidade;
  mostrarMensagemDeAtributos(
    pontosRestantes === 0
      ? "Distribuição completa."
      : `Você ainda possui ${pontosRestantes} ponto${pontosRestantes === 1 ? "" : "s"} para distribuir.`
  );
  attributesFinalSummary.replaceChildren();

  atributosDeMeridian.forEach(function (atributo) {
    const item = document.createElement("div");
    const dt = document.createElement("dt");
    const dd = document.createElement("dd");
    dt.textContent = atributo.sigla;
    dd.textContent = calcularValorFinal(atributo.id);
    item.append(dt, dd);
    attributesFinalSummary.append(item);
  });
}

function animarValorFinal(atributo, direcao) {
  const elemento = attributesList.querySelector(`[data-final-value="${atributo}"]`);
  if (!elemento) return;

  const classe = direcao === "up" ? "is-changing-up" : "is-changing-down";
  elemento.classList.remove("is-changing-up", "is-changing-down");
  window.requestAnimationFrame(function () {
    elemento.classList.add(classe);
    window.setTimeout(function () {
      elemento.classList.remove(classe);
    }, direcao === "up" ? 200 : 160);
  });
}

function aumentarAtributo(atributo) {
  if (!podeAumentarAtributo(atributo)) return;
  personagem.atributos[atributo] += 1;
  renderizarAtributos("up", atributo);
  if (abaDosAtributosAtual === "pericias") renderizarPericias();
}

function diminuirAtributo(atributo) {
  if (personagem.atributos[atributo] <= CONFIGURACAO_ATRIBUTOS.valorInicial) return;
  personagem.atributos[atributo] -= 1;
  renderizarAtributos("down", atributo);
  if (abaDosAtributosAtual === "pericias") renderizarPericias();
}

function ajustarAtributosPelaEspecieAtual() {
  let ajustou = false;

  atributosDeMeridian.forEach(function (atributo) {
    while (
      personagem.atributos[atributo.id] > CONFIGURACAO_ATRIBUTOS.valorInicial &&
      calcularValorFinal(atributo.id) > calcularLimiteFinal(atributo.id)
    ) {
      personagem.atributos[atributo.id] -= 1;
      ajustou = true;
    }
  });

  attributesAdjustmentMessage.textContent = ajustou
    ? "Alguns atributos foram ajustados porque a nova Espécie possui limites diferentes."
    : "";
}

function validarAtributos() {
  const modificadores = obterModificadoresDaEspecie();
  const pontosUtilizados = calcularPontosUtilizados();

  attributesError.textContent = "";

  if (!modificadores || !obterAfinidadeDoPersonagem()) {
    attributesError.textContent = "Não foi possível aplicar os modificadores da Espécie.";
    return false;
  }

  const algumValorInvalido = atributosDeMeridian.some(function (atributo) {
    const valor = personagem.atributos[atributo.id];
    return !Number.isInteger(valor) || valor < CONFIGURACAO_ATRIBUTOS.valorInicial || !valorPossuiCustosConfigurados(valor);
  });

  if (algumValorInvalido) {
    attributesError.textContent = "A distribuição de atributos contém um valor inválido.";
    return false;
  }

  if (pontosUtilizados > CONFIGURACAO_ATRIBUTOS.pontosDisponiveis) {
    attributesError.textContent = "Os pontos utilizados ultrapassam o limite disponível.";
    return false;
  }

  if (contarPericiasTreinadas() > CONFIGURACAO_PERICIAS.limiteTreinadas) {
    attributesError.textContent = `O personagem não pode possuir mais de ${CONFIGURACAO_PERICIAS.limiteTreinadas} Perícias treinadas.`;
    return false;
  }

  const ultrapassouLimite = atributosDeMeridian.some(function (atributo) {
    return calcularValorFinal(atributo.id) > calcularLimiteFinal(atributo.id);
  });

  if (ultrapassouLimite) {
    attributesError.textContent = "Um atributo ultrapassou seu limite inicial.";
    return false;
  }

  return true;
}

function renderizarRevisaoProvisoria() {
  const periciasTreinadas = PERICIAS.filter(function (pericia) {
    return personagem.pericias[pericia.id];
  }).map(function (pericia) {
    return pericia.nome;
  });
  const resumoDasPericias = `${contarPericiasTreinadas()} / ${CONFIGURACAO_PERICIAS.limiteTreinadas}`;

  reviewCharacterName.textContent = personagem.nome || "Sem nome";
  reviewSpeciesName.textContent = obterNomeDaEspecieParaResumo();
  reviewClassName.textContent = obterNomeDaClasseParaResumo();
  reviewOriginTitle.textContent = personagem.origem.titulo || "Não definida";
  reviewFinalForca.textContent = calcularValorFinal("forca");
  reviewFinalAgilidade.textContent = calcularValorFinal("agilidade");
  reviewFinalIntelecto.textContent = calcularValorFinal("intelecto");
  reviewFinalResistencia.textContent = calcularValorFinal("resistencia");
  reviewTrainedSkills.textContent = periciasTreinadas.length
    ? `${resumoDasPericias} - ${periciasTreinadas.join(", ")}`
    : `${resumoDasPericias} - Nenhuma Perícia treinada.`;
}

function criarNomeSeguroParaArquivo(nome) {
  return nome
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function mostrarMensagemDeSalvamento(mensagem, erro) {
  const destino = characterSheetScreen.hidden ? reviewSaveStatus : sheetSaveStatus;

  if (temporizadorMensagemDeSalvamento) {
    window.clearTimeout(temporizadorMensagemDeSalvamento);
  }

  destino.textContent = mensagem;
  destino.classList.toggle("is-error", erro === true);

  temporizadorMensagemDeSalvamento = window.setTimeout(function () {
    destino.textContent = "";
    destino.classList.remove("is-error");
  }, 3600);
}

function criarEnvelopeDaFicha() {
  prepararDadosIniciaisDaFicha();

  return {
    tipo: "grimorio-ficha",
    versao: 1,
    salvoEm: new Date().toISOString(),
    personagem
  };
}

function salvarFichaJson(envelopePronto) {
  try {
    const envelope = envelopePronto || criarEnvelopeDaFicha();
    const conteudo = JSON.stringify(envelope, null, 2);
    const arquivo = new Blob(
      [conteudo],
      { type: "application/json;charset=utf-8" }
    );

    const url = URL.createObjectURL(arquivo);
    const link = document.createElement("a");
    const nomeSeguro = criarNomeSeguroParaArquivo(personagem.nome) || "personagem";

    link.href = url;
    link.download = `${nomeSeguro}-ficha.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    mostrarMensagemDeSalvamento("Ficha exportada em JSON.");
  } catch (erro) {
    mostrarMensagemDeSalvamento("Não foi possível gerar o arquivo da ficha.", true);
  }
}

function prepararDadosIniciaisDaFicha() {
  personagem.nivel ??= 1;
  personagem.experiencia ??= 0;
  personagem.pontosEvolucao ??= 0;
  personagem.pontosGloria ??= 0;
  personagem.recursos ??= {
    vidaAtual: 20,
    vidaMaxima: 20,
    manaAtual: 10,
    manaMaxima: 10
  };
  personagem.combate ??= {
    defesa: 0,
    reducaoDano: 0,
    iniciativa: 0,
    movimento: 0
  };
  personagem.modificadoresTemporarios ??= {
    forca: 0,
    agilidade: 0,
    intelecto: 0,
    resistencia: 0
  };
  personagem.armas ??= [];
  personagem.habilidades ??= [];
  personagem.inventario ??= [];

  personagem.recursos.vidaMaxima ??= 20;
  personagem.recursos.vidaAtual ??= personagem.recursos.vidaMaxima;
  personagem.recursos.manaMaxima ??= 10;
  personagem.recursos.manaAtual ??= personagem.recursos.manaMaxima;
  personagem.combate.defesa ??= 0;
  personagem.combate.reducaoDano ??= 0;
  personagem.combate.iniciativa ??= 0;
  personagem.combate.movimento ??= 0;

  atributosDeMeridian.forEach(function (atributo) {
    personagem.modificadoresTemporarios[atributo.id] ??= 0;
  });

  personagem.recursos.vidaAtual = limitarValor(
    personagem.recursos.vidaAtual,
    0,
    personagem.recursos.vidaMaxima
  );
  personagem.recursos.manaAtual = limitarValor(
    personagem.recursos.manaAtual,
    0,
    personagem.recursos.manaMaxima
  );
}

function obterValorOuNaoInformado(valor) {
  const texto = String(valor ?? "").trim();
  return texto || "Não informado";
}

function obterNomeDaVarianteParaFicha() {
  const especie = obterEspecieSelecionada();
  const variante = obterVarianteSelecionada(especie);

  if (!variante) return "Não informado";
  return variante.nome;
}

function obterNomeDaEspecieComVariante() {
  const especie = obterEspecieSelecionada();
  const variante = obterVarianteSelecionada(especie);

  if (!especie) return "Não definida";
  return variante ? `${especie.nome} — ${variante.nome}` : especie.nome;
}

function obterModificadorTemporario(atributo) {
  if (!personagem.modificadoresTemporarios) return 0;
  return Number(personagem.modificadoresTemporarios[atributo]) || 0;
}

function calcularValorFinalDaFicha(atributo) {
  return calcularValorFinal(atributo) + obterModificadorTemporario(atributo);
}

function limitarValor(valor, minimo, maximo) {
  const numero = Number.parseInt(valor, 10);
  const normalizado = Number.isFinite(numero) ? numero : minimo;
  return Math.min(Math.max(normalizado, minimo), maximo);
}

function marcarFichaComoAlterada() {
  fichaPossuiAlteracoes = true;
  atualizarEstadoDeSalvamento();
}

function alterarVidaAtual(diferenca) {
  definirVidaAtual(personagem.recursos.vidaAtual + diferenca);
}

function definirVidaAtual(valor) {
  const proximoValor = limitarValor(valor, 0, personagem.recursos.vidaMaxima);
  if (proximoValor === personagem.recursos.vidaAtual) {
    renderizarRecursosDaFicha();
    return;
  }

  personagem.recursos.vidaAtual = proximoValor;
  marcarFichaComoAlterada();
  renderizarRecursosDaFicha();
}

function restaurarVida() {
  definirVidaAtual(personagem.recursos.vidaMaxima);
}

function alterarManaAtual(diferenca) {
  definirManaAtual(personagem.recursos.manaAtual + diferenca);
}

function definirManaAtual(valor) {
  const proximoValor = limitarValor(valor, 0, personagem.recursos.manaMaxima);
  if (proximoValor === personagem.recursos.manaAtual) {
    renderizarRecursosDaFicha();
    return;
  }

  personagem.recursos.manaAtual = proximoValor;
  marcarFichaComoAlterada();
  renderizarRecursosDaFicha();
}

function restaurarMana() {
  definirManaAtual(personagem.recursos.manaMaxima);
}

function calcularPorcentagem(atual, maximo) {
  if (maximo <= 0) return 0;
  return Math.round((atual / maximo) * 100);
}

function renderizarIdentidadeDaFicha() {
  sheetCharacterName.textContent = personagem.nome || "Sem nome";
  sheetPlayerName.textContent = obterValorOuNaoInformado(personagem.jogador);
  sheetCampaignName.textContent = obterValorOuNaoInformado(personagem.campanha);
  sheetMasterName.textContent = obterValorOuNaoInformado(personagem.mestre);
  sheetSpeciesName.textContent = obterNomeDaEspecieComVariante();
  sheetLineageName.textContent = obterNomeDaVarianteParaFicha();
  sheetClassName.textContent = obterNomeDaClasseParaResumo();
  sheetOriginTitle.textContent = personagem.origem.titulo || "Não definida";
  sheetOriginPlace.textContent = obterValorOuNaoInformado(personagem.origem.local);
  sheetLevel.textContent = personagem.nivel;
  sheetExperience.textContent = personagem.experiencia;
  sheetEvolutionPoints.textContent = personagem.pontosEvolucao;
  sheetGloryPoints.textContent = personagem.pontosGloria;

  if (personagem.retrato) {
    sheetPortraitImage.src = personagem.retrato;
    sheetPortraitImage.alt = personagem.nome ? `Retrato de ${personagem.nome}` : "Retrato do personagem";
    sheetPortraitImage.hidden = false;
    sheetPortraitEmpty.hidden = true;
  } else {
    sheetPortraitImage.hidden = true;
    sheetPortraitImage.removeAttribute("src");
    sheetPortraitEmpty.hidden = false;
  }
}

function renderizarCombateDaFicha() {
  sheetDefense.textContent = personagem.combate.defesa;
  sheetDamageReduction.textContent = personagem.combate.reducaoDano;
  sheetInitiative.textContent = personagem.combate.iniciativa;
  sheetMovement.textContent = personagem.combate.movimento;
}

function renderizarRecursoDaFicha(config) {
  const atual = personagem.recursos[config.atual];
  const maximo = personagem.recursos[config.maximo];
  const porcentagem = calcularPorcentagem(atual, maximo);

  config.input.max = maximo;
  config.input.value = atual;
  config.display.textContent = atual;
  config.maxDisplay.textContent = maximo;
  config.minusButton.disabled = atual <= 0;
  config.plusButton.disabled = atual >= maximo;
  config.bar.style.width = `${porcentagem}%`;
  config.percent.textContent = `${porcentagem}%`;
}

function renderizarRecursosDaFicha() {
  renderizarRecursoDaFicha({
    atual: "vidaAtual",
    maximo: "vidaMaxima",
    input: sheetLifeCurrent,
    display: sheetLifeCurrentDisplay,
    maxDisplay: sheetLifeMax,
    minusButton: sheetLifeMinus,
    plusButton: sheetLifePlus,
    bar: sheetLifeBar,
    percent: sheetLifePercent
  });

  renderizarRecursoDaFicha({
    atual: "manaAtual",
    maximo: "manaMaxima",
    input: sheetManaCurrent,
    display: sheetManaCurrentDisplay,
    maxDisplay: sheetManaMax,
    minusButton: sheetManaMinus,
    plusButton: sheetManaPlus,
    bar: sheetManaBar,
    percent: sheetManaPercent
  });

  const vidaMaxima = personagem.recursos.vidaMaxima;
  const vidaCritica = vidaMaxima > 0 && personagem.recursos.vidaAtual / vidaMaxima <= 0.25;
  sheetLifeCard.classList.toggle("is-critical", vidaCritica);
  sheetLifeStatus.hidden = !vidaCritica;
}

function renderizarAtributosDaFicha() {
  const modificadores = obterModificadoresDaEspecie() || criarModificadoresZerados();
  const iconesPorAtributo = {
    forca: "sheet-icon-arm",
    agilidade: "sheet-icon-wing",
    intelecto: "sheet-icon-eye",
    resistencia: "sheet-icon-shield"
  };

  sheetAttributesList.replaceChildren();
  atributosDeMeridian.forEach(function (atributo) {
    const distribuido = personagem.atributos[atributo.id];
    const modificadorEspecie = modificadores[atributo.id] || 0;
    const temporario = obterModificadorTemporario(atributo.id);
    const final = distribuido + modificadorEspecie + temporario;
    const card = document.createElement("article");
    const titulo = document.createElement("h3");
    const icone = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const usoDoIcone = document.createElementNS("http://www.w3.org/2000/svg", "use");
    const finalLabel = document.createElement("span");
    const finalValue = document.createElement("strong");
    const lista = document.createElement("dl");

    card.className = "sheet-attribute-card";
    icone.setAttribute("class", "sheet-icon");
    icone.setAttribute("aria-hidden", "true");
    usoDoIcone.setAttribute("href", `#${iconesPorAtributo[atributo.id]}`);
    icone.append(usoDoIcone);
    titulo.append(icone, document.createTextNode(atributo.nome));
    finalLabel.textContent = "Total";
    finalValue.className = "sheet-attribute-final";
    finalValue.textContent = final;
    lista.className = "sheet-attribute-breakdown";

    [
      ["Distribuído", distribuido, ""],
      ["Espécie", formatarModificador(modificadorEspecie), modificadorEspecie > 0 ? "sheet-modifier-positive" : modificadorEspecie < 0 ? "sheet-modifier-negative" : ""],
      ["Temporário", formatarModificador(temporario), temporario > 0 ? "sheet-modifier-positive" : temporario < 0 ? "sheet-modifier-negative" : ""]
    ].forEach(function ([label, value, className]) {
      const linha = document.createElement("div");
      const dt = document.createElement("dt");
      const dd = document.createElement("dd");

      dt.textContent = label;
      dd.textContent = value;
      if (className) dd.className = className;
      linha.append(dt, dd);
      lista.append(linha);
    });

    card.append(titulo, finalLabel, finalValue, lista);
    sheetAttributesList.append(card);
  });
}

function criarCabecalhoDaTabelaDePericiasDaFicha() {
  const header = document.createElement("div");
  header.className = "sheet-skill-row sheet-skill-row--header";
  header.setAttribute("role", "row");
  ["Perícia", "Atributo", "Treinada?", "Dado", "Bônus"].forEach(function (texto) {
    const span = document.createElement("span");
    span.textContent = texto;
    span.setAttribute("role", "columnheader");
    header.append(span);
  });
  return header;
}

function criarLinhaDePericiaDaFicha(pericia) {
  const treinada = personagem.pericias[pericia.id] === true;
  const row = document.createElement("div");
  row.className = "sheet-skill-row";
  row.setAttribute("role", "row");

  [
    pericia.nome,
    obterSiglaDoAtributo(pericia.atributo),
    treinada ? "SIM" : "NÃO",
    treinada ? CONFIGURACAO_PERICIAS.dadoTreinado : CONFIGURACAO_PERICIAS.dadoNaoTreinado,
    calcularValorFinalDaFicha(pericia.atributo)
  ].forEach(function (valor, index) {
    const span = document.createElement("span");
    span.textContent = valor;
    span.setAttribute("role", "cell");
    if (index === 1) {
      span.className = `sheet-skill-attribute sheet-skill-attribute--${pericia.atributo}`;
    }
    if (index === 2 && treinada) span.className = "sheet-trained";
    if (index === 2 && !treinada) span.className = "sheet-untrained";
    row.append(span);
  });

  return row;
}

function renderizarPericiasDaFicha() {
  sheetSkillsList.replaceChildren();

  [PERICIAS.slice(0, 11), PERICIAS.slice(11, 22)].forEach(function (periciasDaColuna, indice) {
    const tabela = document.createElement("div");
    tabela.className = "sheet-skills-table";
    tabela.setAttribute("role", "table");
    tabela.setAttribute("aria-label", indice === 0 ? "Perícias 1 a 11" : "Perícias 12 a 22");
    tabela.append(criarCabecalhoDaTabelaDePericiasDaFicha());
    periciasDaColuna.forEach(function (pericia) {
      tabela.append(criarLinhaDePericiaDaFicha(pericia));
    });
    sheetSkillsList.append(tabela);
  });
}

function obterTituloDaVulnerabilidadeParaFicha(especie, variante, vulnerabilidade) {
  if (!vulnerabilidade) return "Não definida";

  const nome = vulnerabilidade.nome || "";
  if (nome.includes("—")) {
    return nome.split("—").pop().trim().toUpperCase();
  }

  const titulosPorVariante = {
    felina: "Fotossensibilidade",
    canidea: "Sensibilidade química",
    caprina: "Investida limitada",
    reptiliana: "Frio extremo"
  };

  return (titulosPorVariante[variante?.id] || especie?.nome || nome).toUpperCase();
}

function renderizarVulnerabilidadeDaFicha() {
  const especie = obterEspecieSelecionada();
  const variante = obterVarianteSelecionada(especie);
  const fonte = variante || especie;
  const vulnerabilidade = fonte?.vulnerabilidade || especie?.vulnerabilidade || null;
  const resumo = fonte?.vulnerabilidadeResumo || especie?.vulnerabilidadeResumo || vulnerabilidade?.descricao || "Não definida.";

  sheetVulnerabilityTitle.textContent = obterTituloDaVulnerabilidadeParaFicha(especie, variante, vulnerabilidade);
  sheetVulnerabilityDescription.textContent = resumo;
  sheetVulnerabilityDescription.title = resumo;
}

function atualizarEstadoDeSalvamento() {
  const estado = fichaPossuiAlteracoes ? "Alterações não salvas" : "Salvo nesta sessão";
  sheetSaveState.textContent = estado;
  sheetSaveState.classList.toggle("is-dirty", fichaPossuiAlteracoes);
  sheetFooterSaveState.textContent = fichaPossuiAlteracoes
    ? "Última atualização: alterações não salvas"
    : "Última atualização: salvo nesta sessão";
}

function renderizarEstadoDeSalvamento() {
  atualizarEstadoDeSalvamento();
}

function salvarFichaNaSessao(envelopePronto, mostrarMensagem) {
  const envelope = envelopePronto || criarEnvelopeDaFicha();

  fichaSalvaNaSessao = JSON.stringify(envelope, null, 2);
  fichaPossuiAlteracoes = false;

  atualizarEstadoDeSalvamento();
  if (mostrarMensagem !== false) {
    mostrarMensagemDaFicha("Alterações salvas nesta sessão.");
  }
}

function fichaAtualDifereDaSalvaNaSessao() {
  if (!fichaSalvaNaSessao) return true;

  try {
    const fichaSalva = JSON.parse(fichaSalvaNaSessao);
    return JSON.stringify(fichaSalva.personagem) !== JSON.stringify(personagem);
  } catch (erro) {
    return true;
  }
}

function exportarFichaJson() {
  const envelope = criarEnvelopeDaFicha();
  salvarFichaNaSessao(envelope, false);
  salvarFichaJson(envelope);
}

function mostrarMensagemDaFicha(mensagem, erro) {
  mostrarMensagemDeSalvamento(mensagem, erro);
}

function renderizarFicha() {
  renderizarIdentidadeDaFicha();
  renderizarCombateDaFicha();
  renderizarRecursosDaFicha();
  renderizarAtributosDaFicha();
  renderizarPericiasDaFicha();
  renderizarVulnerabilidadeDaFicha();
  renderizarEstadoDeSalvamento();
}

function exibirFicha() {
  sheetSaveStatus.textContent = "";
  document.body.classList.add("sheet-is-open");
  creationView.hidden = true;
  landingView.hidden = true;
  characterSheetScreen.hidden = false;
  characterSheetTitle.focus();
}

function abrirFicha() {
  if (!validarAtributosEPericias()) return;

  prepararDadosIniciaisDaFicha();
  renderizarFicha();
  if (fichaSalvaNaSessao === null) {
    fichaSalvaNaSessao = JSON.stringify(criarEnvelopeDaFicha(), null, 2);
    fichaPossuiAlteracoes = false;
    atualizarEstadoDeSalvamento();
  } else if (fichaAtualDifereDaSalvaNaSessao()) {
    fichaPossuiAlteracoes = true;
    atualizarEstadoDeSalvamento();
  }
  exibirFicha();
}

function fecharFicha() {
  document.body.classList.remove("sheet-is-open");
  characterSheetScreen.hidden = true;
}

function voltarParaRevisao() {
  fecharFicha();
  landingView.hidden = true;
  creationView.hidden = false;
  creationNextButton.hidden = true;
  reviewSaveStatus.textContent = "";
  renderizarRevisaoProvisoria();
  atualizarEstadoDaEtapa(6);
  reviewStep.hidden = false;
  reviewStep.querySelector("#review-heading").focus();
}

function abrirEtapaRevisao() {
  if (!validarAtributosEPericias()) return;

  navegarComTransicao(reviewStep, "forward", function () {
    creationNextButton.hidden = true;
    reviewSaveStatus.textContent = "";
    renderizarRevisaoProvisoria();
    atualizarEstadoDaEtapa(6);
  }, "#review-heading");
}

function atualizarContadorDaHistoria() {
  originStoryCounter.textContent = `${originStoryInput.value.length} / 5000`;
}

function restaurarOrigem() {
  originTitleInput.value = personagem.origem.titulo;
  originPlaceInput.value = personagem.origem.local;
  originStoryInput.value = personagem.origem.historia;
  definirErro(originTitleInput, originTitleError, "");
  definirErro(originPlaceInput, originPlaceError, "");
  definirErro(originStoryInput, originStoryError, "");
  atualizarContadorDaHistoria();
}

function atualizarOrigem() {
  personagem.origem.titulo = originTitleInput.value;
  personagem.origem.local = originPlaceInput.value;
  personagem.origem.historia = originStoryInput.value;
  atualizarContadorDaHistoria();
}

function usarPerguntaDeInspiracao(pergunta) {
  if (!pergunta || originStoryInput.value.includes(pergunta)) {
    originStoryInput.focus();
    return;
  }

  const separador = originStoryInput.value.trim() ? "\n\n" : "";
  const proximaHistoria = `${originStoryInput.value}${separador}${pergunta}\n\n`;
  originStoryInput.value = proximaHistoria.slice(0, Number(originStoryInput.maxLength) || 5000);
  atualizarOrigem();
  definirErro(originStoryInput, originStoryError, "");
  originStoryInput.focus();
}

function validarOrigem() {
  atualizarOrigem();

  personagem.origem.titulo = personagem.origem.titulo.trim();
  personagem.origem.local = personagem.origem.local.trim();
  personagem.origem.historia = personagem.origem.historia.trim();
  restaurarOrigem();

  definirErro(originTitleInput, originTitleError, !personagem.origem.titulo ? "Dê um título para a Origem do personagem." : "");
  definirErro(originPlaceInput, originPlaceError, personagem.origem.local.length > 100 ? "O Local de Origem pode ter no máximo 100 caracteres." : "");
  definirErro(originStoryInput, originStoryError, !personagem.origem.historia || personagem.origem.historia.length < 20 ? "Conte um pouco mais sobre o passado do personagem." : personagem.origem.historia.length > 5000 ? "A história pode ter no máximo 5000 caracteres." : "");

  const primeiroInvalido = [originTitleInput, originPlaceInput, originStoryInput].find(function (campo) {
    return campo.getAttribute("aria-invalid") === "true";
  });

  if (primeiroInvalido) {
    primeiroInvalido.focus();
    return false;
  }

  return true;
}

function abrirEtapaClasse() {
  if (!validarEspecie()) {
    return;
  }

  navegarComTransicao(classStep, etapaAtual > 3 ? "backward" : "forward", function () {
    creationNextButton.hidden = false;
    renderizarCategoriasDeClasse();
    renderizarClasses();
    renderizarSimboloDaClasse();
    renderizarDetalhesDaClasse();
    atualizarEstadoDaEtapa(3);
  }, "#class-heading");
}

function abrirEtapaOrigem(direcao) {
  if (!validarClasse()) {
    return;
  }

  navegarComTransicao(originStep, direcao || "forward", function () {
    creationNextButton.hidden = false;
    restaurarOrigem();
    atualizarEstadoDaEtapa(4);
  }, "#origin-heading");
}

function abrirEtapaAtributos(direcao) {
  if (!validarOrigem()) {
    return;
  }

  navegarComTransicao(attributesStep, direcao || "forward", function () {
    creationNextButton.hidden = false;
    ajustarAtributosPelaEspecieAtual();
    renderizarAtributos();
    renderizarPericias();
    selecionarAbaDosAtributos(abaDosAtributosAtual);
    atualizarEstadoDaEtapa(5);
  }, "#attributes-heading");
}

function voltarNaCriacao() {
  if (etapaAtual === 6) {
    abrirEtapaAtributos("backward");
    return;
  }

  if (etapaAtual === 5) {
    abrirEtapaOrigem("backward");
    return;
  }

  if (etapaAtual === 4) {
    abrirEtapaClasse();
    return;
  }

  if (etapaAtual === 3) {
    abrirEtapaEspecie(false);
    return;
  }

  if (etapaAtual === 2) {
    restaurarIdentidade();
    abrirEtapaIdentidade(true);
    return;
  }

  voltarParaInicio();
}

function avancarNaCriacao() {
  if (etapaAtual === 1) {
    abrirEtapaEspecie(true);
    return;
  }

  if (etapaAtual === 2) {
    abrirEtapaClasse();
    return;
  }

  if (etapaAtual === 3) {
    abrirEtapaOrigem();
    return;
  }

  if (etapaAtual === 4) {
    abrirEtapaAtributos();
    return;
  }

  if (etapaAtual === 5) {
    if (!validarAtributosEPericias()) return;
    abrirEtapaRevisao();
  }
}

function abrirSeletorDeArquivo() {
  fileInput.value = "";
  fileInput.click();
}

function ehObjetoDeDados(valor) {
  return valor !== null && typeof valor === "object" && !Array.isArray(valor);
}

function obterPersonagemDoArquivo(dados) {
  if (!ehObjetoDeDados(dados)) {
    throw new Error("O arquivo JSON não contém uma ficha válida.");
  }

  if (Object.prototype.hasOwnProperty.call(dados, "tipo")) {
    if (dados.tipo !== "grimorio-ficha") {
      throw new Error("Este JSON não é uma ficha do Grimório RPG.");
    }

    const versao = Number(dados.versao);
    if (Number.isFinite(versao) && versao > 1) {
      throw new Error("Esta ficha foi criada em uma versão mais recente do Grimório RPG.");
    }
  }

  const dadosDoPersonagem = ehObjetoDeDados(dados.personagem)
    ? dados.personagem
    : dados;

  if (!ehObjetoDeDados(dadosDoPersonagem.atributos) || !ehObjetoDeDados(dadosDoPersonagem.pericias)) {
    throw new Error("O JSON não possui os dados necessários de uma ficha de personagem.");
  }

  return dadosDoPersonagem;
}

function aplicarPersonagemImportado(dadosImportados) {
  const dadosNormalizados = JSON.parse(JSON.stringify(MODELO_PERSONAGEM));

  Object.keys(dadosNormalizados).forEach(function (campo) {
    if (!Object.prototype.hasOwnProperty.call(dadosImportados, campo)) return;

    const valorPadrao = dadosNormalizados[campo];
    const valorImportado = dadosImportados[campo];

    if (Array.isArray(valorPadrao)) {
      dadosNormalizados[campo] = Array.isArray(valorImportado)
        ? JSON.parse(JSON.stringify(valorImportado))
        : valorPadrao;
      return;
    }

    if (ehObjetoDeDados(valorPadrao)) {
      if (!ehObjetoDeDados(valorImportado)) return;

      Object.keys(valorPadrao).forEach(function (subcampo) {
        if (Object.prototype.hasOwnProperty.call(valorImportado, subcampo)) {
          dadosNormalizados[campo][subcampo] = valorImportado[subcampo];
        }
      });
      return;
    }

    dadosNormalizados[campo] = valorImportado;
  });

  Object.keys(personagem).forEach(function (campo) {
    delete personagem[campo];
  });
  Object.assign(personagem, dadosNormalizados);
}

async function selecionarArquivo(event) {
  const arquivo = event.target.files[0];
  if (!arquivo) return;

  if (!arquivo.name.toLowerCase().endsWith(".json")) {
    fileStatus.textContent = "Selecione um arquivo JSON válido.";
    return;
  }

  if (arquivo.size > 15 * 1024 * 1024) {
    fileStatus.textContent = "O arquivo excede o limite de 15 MB.";
    return;
  }

  fileStatus.textContent = "Carregando ficha...";
  importButton.disabled = true;
  importButton.setAttribute("aria-busy", "true");

  try {
    const conteudo = await arquivo.text();
    const dados = JSON.parse(conteudo);
    const dadosDoPersonagem = obterPersonagemDoArquivo(dados);

    aplicarPersonagemImportado(dadosDoPersonagem);
    prepararDadosIniciaisDaFicha();
    renderizarFicha();
    salvarFichaNaSessao(criarEnvelopeDaFicha(), false);

    fileStatus.textContent = `Ficha de ${personagem.nome || "personagem"} carregada.`;
    exibirFicha();
  } catch (erro) {
    fileStatus.textContent = erro instanceof SyntaxError
      ? "O arquivo não contém um JSON válido."
      : erro.message || "Não foi possível importar esta ficha.";
  } finally {
    importButton.disabled = false;
    importButton.removeAttribute("aria-busy");
  }
}

function mostrarAvisoDoMestre() {
  masterStatus.textContent = "O Editor do Mestre será implementado em uma próxima etapa.";
}

createButton.addEventListener("click", abrirCriacao);
creationBackButton.addEventListener("click", voltarNaCriacao);
creationNextButton.addEventListener("click", avancarNaCriacao);
reviewSaveJsonButton.addEventListener("click", exportarFichaJson);
reviewOpenSheetButton.addEventListener("click", abrirFicha);
sheetSaveSessionButton.addEventListener("click", function () {
  salvarFichaNaSessao();
});
sheetExportJsonButton.addEventListener("click", exportarFichaJson);
sheetBackReviewButton.addEventListener("click", voltarParaRevisao);
sheetSidebar.addEventListener("click", function (event) {
  const button = event.target.closest("button[data-sheet-section]");
  if (!button) return;

  if (button.dataset.sheetSection === "summary") {
    mostrarMensagemDaFicha("");
    return;
  }

  mostrarMensagemDaFicha("Esta seção ainda está em desenvolvimento.");
});
sheetLifeMinus.addEventListener("click", function () { alterarVidaAtual(-1); });
sheetLifePlus.addEventListener("click", function () { alterarVidaAtual(1); });
sheetLifeRestore.addEventListener("click", restaurarVida);
sheetLifeCurrent.addEventListener("blur", function () {
  definirVidaAtual(sheetLifeCurrent.value);
});
sheetManaMinus.addEventListener("click", function () { alterarManaAtual(-1); });
sheetManaPlus.addEventListener("click", function () { alterarManaAtual(1); });
sheetManaRestore.addEventListener("click", restaurarMana);
sheetManaCurrent.addEventListener("blur", function () {
  definirManaAtual(sheetManaCurrent.value);
});
identityForm.addEventListener("submit", function (event) {
  event.preventDefault();
  abrirEtapaEspecie(true);
});

fields.forEach(function ([input, errorElement]) {
  input.addEventListener("input", function () {
    atualizarPersonagem();
    definirErro(input, errorElement, "");
  });
});

originForm.addEventListener("submit", function (event) {
  event.preventDefault();
  abrirEtapaAtributos();
});

[originTitleInput, originPlaceInput, originStoryInput].forEach(function (input) {
  input.addEventListener("input", function () {
    atualizarOrigem();
    definirErro(input, input === originTitleInput ? originTitleError : input === originPlaceInput ? originPlaceError : originStoryError, "");
  });
});

originPromptList.addEventListener("click", function (event) {
  const button = event.target.closest("button[data-origin-question]");
  if (button) usarPerguntaDeInspiracao(button.dataset.originQuestion);
});

attributesList.addEventListener("click", function (event) {
  const button = event.target.closest("button[data-attribute-action]");
  if (!button) return;

  if (button.dataset.attributeAction === "increase") aumentarAtributo(button.dataset.attribute);
  if (button.dataset.attributeAction === "decrease") diminuirAtributo(button.dataset.attribute);
});

attributesTabButton.addEventListener("click", function () {
  selecionarAbaDosAtributos("atributos");
});

skillsTabButton.addEventListener("click", function () {
  selecionarAbaDosAtributos("pericias");
});

skillsList.addEventListener("change", function (event) {
  const input = event.target;
  if (!(input instanceof HTMLInputElement) || !input.dataset.skillId) return;
  alternarTreinamentoDaPericia(input.dataset.skillId, input.checked);
});

skillsPrevPage.addEventListener("click", function () {
  mudarPaginaDePericias(-1);
});

skillsNextPage.addEventListener("click", function () {
  mudarPaginaDePericias(1);
});

speciesList.addEventListener("click", function (event) {
  const button = event.target.closest("button[data-species-id]");
  if (button) selecionarEspecie(button.dataset.speciesId);
});

speciesOptions.addEventListener("change", function (event) {
  const input = event.target;
  if (!(input instanceof HTMLInputElement)) return;

  if (input.name === "human-bonus") selecionarBonusHumano(input.value, input.checked);
  if (input.name === "human-affinity") selecionarAfinidade(input.value);
  if (input.name === "species-variant") selecionarVariante(input.value);
  if (input.name === "quimeric-attribute") selecionarAtributoQuimerico(input.value);
});

classCategories.addEventListener("click", function (event) {
  const button = event.target.closest("button[data-class-category]");
  if (button) selecionarCategoriaDeClasse(button.dataset.classCategory);
});

classList.addEventListener("click", function (event) {
  const button = event.target.closest("button[data-class-id]");
  if (button) selecionarClasse(button.dataset.classId);
});

classPagePrevious.addEventListener("click", function () { mudarPaginaDeClasses(-1); });
classPageNext.addEventListener("click", function () { mudarPaginaDeClasses(1); });
importClassButton.addEventListener("click", abrirImportacaoDeClasse);
classJsonInput.addEventListener("change", importarClasse);

classTabs.addEventListener("click", function (event) {
  const button = event.target.closest("button[data-class-tab]");
  if (button) {
    selecionarAbaDaClasse(button.dataset.classTab, false);
    animarEntradaDoPainelDaClasse();
  }
});

classTabs.addEventListener("keydown", function (event) {
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
  const tabs = Array.from(classTabs.querySelectorAll("[role='tab']"));
  const atual = tabs.indexOf(document.activeElement);
  if (atual < 0) return;
  event.preventDefault();
  let proximo = atual;
  if (event.key === "ArrowLeft") proximo = (atual - 1 + tabs.length) % tabs.length;
  if (event.key === "ArrowRight") proximo = (atual + 1) % tabs.length;
  if (event.key === "Home") proximo = 0;
  if (event.key === "End") proximo = tabs.length - 1;
  selecionarAbaDaClasse(tabs[proximo].dataset.classTab, true);
  animarEntradaDoPainelDaClasse();
});

choosePortraitButton.addEventListener("click", abrirSeletorDeRetrato);
removePortraitButton.addEventListener("click", removerRetrato);
portraitInput.addEventListener("change", selecionarRetrato);
importButton.addEventListener("click", abrirSeletorDeArquivo);
fileInput.addEventListener("change", selecionarArquivo);
masterButton.addEventListener("click", mostrarAvisoDoMestre);

ativarMicrointeracoes(document);
ativarMovimentoDaArteDaEspecie();
renderizarEspecies();
renderizarCategoriasDeClasse();
renderizarClasses();
renderizarSimboloDaClasse();
renderizarDetalhesDaClasse();
