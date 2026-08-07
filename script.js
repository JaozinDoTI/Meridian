const { animarMudancaDeRecurso, deveReduzirMovimento } = window.GrimorioMotion;
const dominioDoInventario = window.GrimorioInventoryDomain;
const CONFIGURACAO_DO_INVENTARIO = dominioDoInventario.INVENTORY_CONFIG;
const CONFIGURACAO_DE_RARIDADE = dominioDoInventario.RARITY_CONFIG;
const CONFIGURACAO_DE_TIPO_DE_ITEM = dominioDoInventario.ITEM_TYPE_CONFIG;

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
  inventario: [],
  economia: { ouro: 0, prata: 0 },
  capacidadeInventario: { pesoMaximo: null },
  equipamentos: { armadura: null }
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

const LIMITE_HABILIDADES_RESUMO = 4;
const TIPOS_HABILIDADE = new Set(["passiva", "tecnica", "reacao", "suprema", "outro"]);
const CATALOGO_ICONES_HABILIDADE = Object.freeze([
  { id: "habilidade-generica", simbolo: "rune-star", nome: "Runa" },
  { id: "espada", simbolo: "sword", nome: "Espada" },
  { id: "espadas", simbolo: "swords", nome: "Combate" },
  { id: "escudo", simbolo: "shield", nome: "Escudo" },
  { id: "protecao", simbolo: "ward", nome: "Proteção" },
  { id: "energia", simbolo: "bolt", nome: "Energia" },
  { id: "explosao", simbolo: "burst", nome: "Explosão" },
  { id: "alvo", simbolo: "target", nome: "Alvo" },
  { id: "mana", simbolo: "drop", nome: "Mana" },
  { id: "vida", simbolo: "heart", nome: "Vida" },
  { id: "movimento", simbolo: "wing", nome: "Movimento" },
  { id: "tempo", simbolo: "hourglass", nome: "Tempo" },
  { id: "mente", simbolo: "eye", nome: "Percepção" },
  { id: "estrela", simbolo: "star", nome: "Estrela" },
  { id: "livro", simbolo: "book", nome: "Conhecimento" },
  { id: "coroa", simbolo: "crown", nome: "Suprema" }
]);

let categoriaDeClasseAtual = "Científicas e tecnológicas";
let paginaDeClassesAtual = 1;
let abaDeClasseAtual = "overview";
let abaDosAtributosAtual = "atributos";
let paginaDePericiasAtual = 1;
let temporizadorMensagemDeSalvamento = null;
let fichaSalvaNaSessao = null;
let fichaPossuiAlteracoes = false;
let estadoDoRecorteDoRetrato = null;
let ponteiroDoRecorteDoRetrato = null;
let habilidadeSelecionadaId = null;
let filtroTipoHabilidade = "todos";
let filtroEstadoHabilidade = "todos";
let buscaHabilidade = "";
let habilidadePendente = null;
let iconeHabilidadePendente = "habilidade-generica";
let modoDialogHabilidade = "importar";
const inventoryUIState = {
  pendingPlacement: null,
  reorganizingForPending: false,
  movingItemId: null,
  selectedItemId: null,
  hoveredCell: null,
  candidatePosition: null,
  pointerSession: null,
  discardingItemId: null
};

const SIMBOLOS_DE_TIPO_DE_ITEM = Object.freeze({
  consumivel: "\u2697",
  arma: "\u2694",
  armadura: "\u2b21",
  equipamento: "\u2699",
  ferramenta: "\u2692",
  material: "\u25c8",
  outro: "\u2726"
});
const LIMIAR_DE_ARRASTE_DO_INVENTARIO = 4;
const DURACAO_DE_ENCAIXE_DO_INVENTARIO = 210;
const DURACAO_DE_RETORNO_DO_INVENTARIO = 240;

const CONFIGURACAO_RETRATO = Object.freeze({
  larguraFinal: 640,
  alturaFinal: 800,
  tamanhoMaximoArquivo: 12 * 1024 * 1024,
  qualidadeWebp: 0.88,
  zoomMaximo: 3
});

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
const portraitCropDialog = document.querySelector("#portrait-crop-dialog");
const portraitCropCanvas = document.querySelector("#portrait-crop-canvas");
const portraitCropRange = document.querySelector("#portrait-crop-range");
const portraitCropZoomValue = document.querySelector("#portrait-crop-zoom-value");
const portraitCropStatus = document.querySelector("#portrait-crop-status");
const portraitCropCancel = document.querySelector("#portrait-crop-cancel");
const portraitCropApply = document.querySelector("#portrait-crop-apply");

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
const sheetLifeMax = document.querySelector("#sheet-life-max");
const sheetLifeMinus = document.querySelector("#sheet-life-minus");
const sheetLifePlus = document.querySelector("#sheet-life-plus");
const sheetLifeBar = document.querySelector("#sheet-life-bar");
const sheetLifePercent = document.querySelector("#sheet-life-percent");
const sheetLifeStatus = document.querySelector("#sheet-life-status");
const sheetManaCard = document.querySelector(".sheet-resource-card--mana");
const sheetManaCurrent = document.querySelector("#sheet-mana-current");
const sheetManaMax = document.querySelector("#sheet-mana-max");
const sheetManaMinus = document.querySelector("#sheet-mana-minus");
const sheetManaPlus = document.querySelector("#sheet-mana-plus");
const sheetManaBar = document.querySelector("#sheet-mana-bar");
const sheetManaPercent = document.querySelector("#sheet-mana-percent");
const RECURSOS_DA_FICHA = [
  {
    atual: "vidaAtual",
    maximo: "vidaMaxima",
    input: sheetLifeCurrent,
    maxDisplay: sheetLifeMax,
    minusButton: sheetLifeMinus,
    plusButton: sheetLifePlus,
    bar: sheetLifeBar,
    percent: sheetLifePercent
  },
  {
    atual: "manaAtual",
    maximo: "manaMaxima",
    input: sheetManaCurrent,
    maxDisplay: sheetManaMax,
    minusButton: sheetManaMinus,
    plusButton: sheetManaPlus,
    bar: sheetManaBar,
    percent: sheetManaPercent
  }
];
const sheetAttributesList = document.querySelector("#sheet-attributes-list");
const snapshotsAnterioresDosAtributosDaFicha = new Map();
const sheetSkillsList = document.querySelector("#sheet-skills-list");
const sheetVulnerabilityTitle = document.querySelector("#sheet-vulnerability-title");
const sheetVulnerabilityDescription = document.querySelector("#sheet-vulnerability-description");
const sheetViews = document.querySelectorAll("[data-sheet-view]");
const sheetAbilitiesSummary = document.querySelector("#sheet-abilities-summary");
const sheetOpenAbilities = document.querySelector("#sheet-open-abilities");
const sheetOpenInventory = document.querySelector("#sheet-open-inventory");
const sheetAbilitiesView = document.querySelector("#sheet-abilities-view");
const sheetAbilitiesViewHeading = document.querySelector("#sheet-abilities-view-heading");
const sheetAbilitySearch = document.querySelector("#sheet-ability-search");
const sheetAbilityTypeFilter = document.querySelector("#sheet-ability-type-filter");
const sheetAbilityStateFilter = document.querySelector("#sheet-ability-state-filter");
const sheetImportAbility = document.querySelector("#sheet-import-ability");
const sheetAbilityFile = document.querySelector("#sheet-ability-file");
const sheetAbilityList = document.querySelector("#sheet-ability-list");
const sheetAbilityDetails = document.querySelector("#sheet-ability-details");
const sheetAbilityStats = document.querySelector("#sheet-ability-stats");
const abilityImportDialog = document.querySelector("#ability-import-dialog");
const abilityImportTitle = document.querySelector("#ability-import-title");
const abilityImportPreview = document.querySelector("#ability-import-preview");
const abilityDuplicateWarning = document.querySelector("#ability-duplicate-warning");
const abilityIconOptions = document.querySelector("#ability-icon-options");
const abilityImportStatus = document.querySelector("#ability-import-status");
const abilityImportCancel = document.querySelector("#ability-import-cancel");
const abilityImportConfirm = document.querySelector("#ability-import-confirm");
const abilityRemoveDialog = document.querySelector("#ability-remove-dialog");
const abilityRemoveDescription = document.querySelector("#ability-remove-description");
const abilityRemoveCancel = document.querySelector("#ability-remove-cancel");
const abilityRemoveConfirm = document.querySelector("#ability-remove-confirm");
const sheetInventoryView = document.querySelector("#sheet-inventory-view");
const sheetInventoryViewHeading = document.querySelector("#sheet-inventory-view-heading");
const sheetInventoryUsedCells = document.querySelector("#sheet-inventory-used-cells");
const sheetInventoryFreeCells = document.querySelector("#sheet-inventory-free-cells");
const sheetInventoryOccupancy = document.querySelector("#sheet-inventory-occupancy");
const sheetInventoryOccupancyBar = document.querySelector("#sheet-inventory-occupancy-bar");
const sheetInventorySummaryStatus = document.querySelector("#sheet-inventory-summary-status");
const sheetInventoryCapacity = document.querySelector("#sheet-inventory-capacity");
const sheetImportItem = document.querySelector("#sheet-import-item");
const sheetItemFile = document.querySelector("#sheet-item-file");
const sheetInventoryGridScroll = document.querySelector("#sheet-inventory-grid-scroll");
const sheetInventoryGrid = document.querySelector("#sheet-inventory-grid");
const sheetInventoryCellLayer = document.querySelector("#sheet-inventory-cell-layer");
const sheetInventoryPreviewLayer = document.querySelector("#sheet-inventory-preview-layer");
const sheetInventoryItemLayer = document.querySelector("#sheet-inventory-item-layer");
const sheetInventoryPlacementStatus = document.querySelector("#sheet-inventory-placement-status");
const sheetInventoryDetails = document.querySelector("#sheet-inventory-details");
const sheetInventoryDetailsEmpty = document.querySelector("#sheet-inventory-details-empty");
const sheetInventoryItemActions = document.querySelector("#sheet-inventory-item-actions");
const sheetInventoryReceived = document.querySelector("#sheet-inventory-received");
const sheetInventoryArmorSlot = document.querySelector("#sheet-inventory-armor-slot");
const sheetEquipItem = document.querySelector("#sheet-equip-item");
const sheetRotateItem = document.querySelector("#sheet-rotate-item");
const sheetInventoryWeight = document.querySelector("#sheet-inventory-weight");
const sheetInventoryWeightBar = document.querySelector("#sheet-inventory-weight-bar");
const sheetInventoryItemCount = document.querySelector("#sheet-inventory-item-count");
const sheetInventorySpaceSummary = document.querySelector("#sheet-inventory-space-summary");
const sheetInventoryGold = document.querySelector("#sheet-inventory-gold");
const sheetInventorySilver = document.querySelector("#sheet-inventory-silver");
const sheetInventoryMobileNav = document.querySelector(".sheet-inventory-mobile-nav");
const sheetMoveItem = document.querySelector("#sheet-move-item");
const sheetDiscardItem = document.querySelector("#sheet-discard-item");
const sheetInventoryPendingActions = document.querySelector("#sheet-inventory-pending-actions");
const sheetInventoryPendingHeading = document.querySelector("#sheet-inventory-pending-heading");
const sheetInventoryPendingMessage = document.querySelector("#sheet-inventory-pending-message");
const sheetReorganizeForItem = document.querySelector("#sheet-reorganize-for-item");
const sheetRotatePendingItem = document.querySelector("#sheet-rotate-pending-item");
const sheetDiscardPendingItem = document.querySelector("#sheet-discard-pending-item");
const sheetCancelItemImport = document.querySelector("#sheet-cancel-item-import");
const inventoryDiscardDialog = document.querySelector("#inventory-discard-dialog");
const inventoryDiscardDescription = document.querySelector("#inventory-discard-description");
const inventoryDiscardCancel = document.querySelector("#inventory-discard-cancel");
const inventoryDiscardConfirm = document.querySelector("#inventory-discard-confirm");
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
const etapasDaCriacao = [identityStep, speciesStep, classStep, originStep, attributesStep, reviewStep];
let temporizadorDaTransicaoDeEtapa = null;
let transicaoDaArteDaEspecie = 0;

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

function carregarImagemParaRecorte(arquivo) {
  return new Promise(function (resolve, reject) {
    const url = URL.createObjectURL(arquivo);
    const imagem = new Image();

    imagem.addEventListener("load", function () {
      URL.revokeObjectURL(url);
      resolve(imagem);
    }, { once: true });

    imagem.addEventListener("error", function () {
      URL.revokeObjectURL(url);
      reject(new Error("Não foi possível carregar esta imagem."));
    }, { once: true });

    imagem.src = url;
  });
}

function limitarPosicaoDoRecorte() {
  if (!estadoDoRecorteDoRetrato) return;

  const estado = estadoDoRecorteDoRetrato;
  const larguraDesenhada = estado.imagem.naturalWidth * estado.escala;
  const alturaDesenhada = estado.imagem.naturalHeight * estado.escala;
  const limiteX = CONFIGURACAO_RETRATO.larguraFinal - larguraDesenhada;
  const limiteY = CONFIGURACAO_RETRATO.alturaFinal - alturaDesenhada;

  estado.x = Math.min(0, Math.max(limiteX, estado.x));
  estado.y = Math.min(0, Math.max(limiteY, estado.y));
}

function renderizarRecorteDoRetrato() {
  if (!estadoDoRecorteDoRetrato) return;

  const contexto = portraitCropCanvas.getContext("2d");
  const estado = estadoDoRecorteDoRetrato;

  contexto.clearRect(0, 0, portraitCropCanvas.width, portraitCropCanvas.height);
  contexto.imageSmoothingEnabled = true;
  contexto.imageSmoothingQuality = "high";
  contexto.drawImage(
    estado.imagem,
    estado.x,
    estado.y,
    estado.imagem.naturalWidth * estado.escala,
    estado.imagem.naturalHeight * estado.escala
  );
}

function definirZoomDoRecorte(valor) {
  if (!estadoDoRecorteDoRetrato) return;

  const estado = estadoDoRecorteDoRetrato;
  const fator = Math.min(
    CONFIGURACAO_RETRATO.zoomMaximo,
    Math.max(1, Number(valor) / 100)
  );
  const centroNaImagemX = (CONFIGURACAO_RETRATO.larguraFinal / 2 - estado.x) / estado.escala;
  const centroNaImagemY = (CONFIGURACAO_RETRATO.alturaFinal / 2 - estado.y) / estado.escala;

  estado.escala = estado.escalaMinima * fator;
  estado.x = CONFIGURACAO_RETRATO.larguraFinal / 2 - centroNaImagemX * estado.escala;
  estado.y = CONFIGURACAO_RETRATO.alturaFinal / 2 - centroNaImagemY * estado.escala;
  limitarPosicaoDoRecorte();
  renderizarRecorteDoRetrato();

  portraitCropRange.value = String(Math.round(fator * 100));
  portraitCropZoomValue.value = `${Math.round(fator * 100)}%`;
  portraitCropZoomValue.textContent = portraitCropZoomValue.value;
}

function abrirEditorDeRecorte(imagem) {
  const escalaMinima = Math.max(
    CONFIGURACAO_RETRATO.larguraFinal / imagem.naturalWidth,
    CONFIGURACAO_RETRATO.alturaFinal / imagem.naturalHeight
  );

  estadoDoRecorteDoRetrato = {
    imagem,
    escalaMinima,
    escala: escalaMinima,
    x: (CONFIGURACAO_RETRATO.larguraFinal - imagem.naturalWidth * escalaMinima) / 2,
    y: (CONFIGURACAO_RETRATO.alturaFinal - imagem.naturalHeight * escalaMinima) / 2
  };

  portraitCropRange.value = "100";
  portraitCropZoomValue.value = "100%";
  portraitCropZoomValue.textContent = "100%";
  portraitCropStatus.textContent = `${imagem.naturalWidth} × ${imagem.naturalHeight} px | saída 640 × 800 px`;
  renderizarRecorteDoRetrato();
  document.body.classList.add("portrait-crop-is-open");
  portraitCropDialog.showModal();
  portraitCropCanvas.focus();
}

function fecharEditorDeRecorte() {
  if (portraitCropDialog.open) {
    portraitCropDialog.close();
  }
}

function aplicarRecorteDoRetrato() {
  if (!estadoDoRecorteDoRetrato) return;

  try {
    personagem.retrato = portraitCropCanvas.toDataURL(
      "image/webp",
      CONFIGURACAO_RETRATO.qualidadeWebp
    );
    portraitStatus.textContent = "Retrato ajustado para 640 × 800 px.";
    mostrarRetrato();
    fecharEditorDeRecorte();
  } catch (erro) {
    portraitCropStatus.textContent = "Não foi possível finalizar o recorte.";
  }
}

function iniciarArrasteDoRecorte(event) {
  if (!estadoDoRecorteDoRetrato || event.button !== 0) return;

  ponteiroDoRecorteDoRetrato = {
    id: event.pointerId,
    inicioX: event.clientX,
    inicioY: event.clientY,
    origemX: estadoDoRecorteDoRetrato.x,
    origemY: estadoDoRecorteDoRetrato.y
  };

  portraitCropCanvas.setPointerCapture(event.pointerId);
  portraitCropCanvas.classList.add("is-dragging");
}

function arrastarRecorte(event) {
  if (!estadoDoRecorteDoRetrato || ponteiroDoRecorteDoRetrato?.id !== event.pointerId) return;

  const retangulo = portraitCropCanvas.getBoundingClientRect();
  const fatorX = portraitCropCanvas.width / retangulo.width;
  const fatorY = portraitCropCanvas.height / retangulo.height;

  estadoDoRecorteDoRetrato.x = ponteiroDoRecorteDoRetrato.origemX
    + (event.clientX - ponteiroDoRecorteDoRetrato.inicioX) * fatorX;
  estadoDoRecorteDoRetrato.y = ponteiroDoRecorteDoRetrato.origemY
    + (event.clientY - ponteiroDoRecorteDoRetrato.inicioY) * fatorY;
  limitarPosicaoDoRecorte();
  renderizarRecorteDoRetrato();
}

function encerrarArrasteDoRecorte(event) {
  if (ponteiroDoRecorteDoRetrato?.id !== event.pointerId) return;

  if (portraitCropCanvas.hasPointerCapture(event.pointerId)) {
    portraitCropCanvas.releasePointerCapture(event.pointerId);
  }
  ponteiroDoRecorteDoRetrato = null;
  portraitCropCanvas.classList.remove("is-dragging");
}

function controlarRecortePeloTeclado(event) {
  if (!estadoDoRecorteDoRetrato) return;

  const deslocamento = event.shiftKey ? 32 : 12;
  const movimentos = {
    ArrowLeft: [deslocamento, 0],
    ArrowRight: [-deslocamento, 0],
    ArrowUp: [0, deslocamento],
    ArrowDown: [0, -deslocamento]
  };

  if (movimentos[event.key]) {
    event.preventDefault();
    estadoDoRecorteDoRetrato.x += movimentos[event.key][0];
    estadoDoRecorteDoRetrato.y += movimentos[event.key][1];
    limitarPosicaoDoRecorte();
    renderizarRecorteDoRetrato();
    return;
  }

  if (event.key === "+" || event.key === "=") {
    event.preventDefault();
    definirZoomDoRecorte(Number(portraitCropRange.value) + 10);
  } else if (event.key === "-") {
    event.preventDefault();
    definirZoomDoRecorte(Number(portraitCropRange.value) - 10);
  }
}

async function selecionarRetrato(event) {
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

  if (arquivo.size > CONFIGURACAO_RETRATO.tamanhoMaximoArquivo) {
    portraitStatus.textContent = "A imagem deve ter no máximo 12 MB.";
    portraitInput.value = "";
    return;
  }

  portraitStatus.textContent = "Preparando imagem...";
  choosePortraitButton.disabled = true;

  try {
    const imagem = await carregarImagemParaRecorte(arquivo);
    portraitStatus.textContent = "";
    abrirEditorDeRecorte(imagem);
  } catch (erro) {
    portraitStatus.textContent = erro.message || "Não foi possível carregar esta imagem.";
  } finally {
    choosePortraitButton.disabled = false;
    portraitInput.value = "";
  }
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
  const motionDeAtributo = window.GrimorioAttributeMotion;

  attributesList.replaceChildren();
  attributesError.textContent = modificadores ? "" : "Não foi possível aplicar os modificadores da Espécie.";

  atributosDeMeridian.forEach(function (atributo) {
    const valorDistribuido = personagem.atributos[atributo.id];
    const modificador = modificadores ? modificadores[atributo.id] : 0;
    const valorFinal = valorDistribuido + modificador;
    const possuiAfinidade = afinidade === atributo.id;
    const identidadeVisual = typeof motionDeAtributo?.obterVisualDoAtributo === "function"
      ? motionDeAtributo.obterVisualDoAtributo(atributo.id)
      : null;

    const card = document.createElement("article");
    card.className = "attribute-card";
    card.dataset.attribute = atributo.id;
    if (typeof identidadeVisual === "string" && identidadeVisual) {
      card.dataset.attributeMotion = identidadeVisual;
    }
    card.classList.toggle("is-at-limit", valorFinal >= calcularLimiteFinal(atributo.id));

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
      ["Distribuído", valorDistribuido, "", "distributed"],
      ["Espécie", formatarModificador(modificador), modificador < 0 ? "attribute-modifier--negative" : modificador > 0 ? "attribute-modifier--positive" : "", "species"],
      ["Final", valorFinal, "attribute-final-value", ""]
    ].forEach(function ([label, value, className, source]) {
      const item = document.createElement("div");
      const dt = document.createElement("dt");
      const dd = document.createElement("dd");
      if (source) item.dataset.attributeSource = source;
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
  const card = attributesList.querySelector(`[data-attribute="${atributo}"]`);
  const motionDeAtributo = window.GrimorioAttributeMotion;
  const motion = window.GrimorioMotion;
  const identidadeVisual = card?.dataset.attributeMotion;

  if (
    card &&
    typeof identidadeVisual === "string" &&
    identidadeVisual &&
    typeof motionDeAtributo?.obterClassesDaMudanca === "function" &&
    typeof motion?.animarMudancaDeAtributo === "function"
  ) {
    const classesDaMudanca = motionDeAtributo.obterClassesDaMudanca({
      changed: true,
      source: "distributed",
      direction: direcao
    });
    const classesUtilizaveis = Array.isArray(classesDaMudanca)
      ? classesDaMudanca.filter(function (classe) {
        return typeof classe === "string" && classe;
      })
      : [];

    if (classesUtilizaveis.length > 0) {
      motion.animarMudancaDeAtributo(card, classesUtilizaveis);
      return;
    }
  }

  const elemento = card
    ? card.querySelector(".attribute-final-value")
    : attributesList.querySelector(`[data-final-value="${atributo}"]`);
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
    versao: 2,
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

function prepararDadosIniciaisDaFicha(personagemAlvo = personagem, versaoDoInventario = 2) {
  personagemAlvo.nivel ??= 1;
  personagemAlvo.experiencia ??= 0;
  personagemAlvo.pontosEvolucao ??= 0;
  personagemAlvo.pontosGloria ??= 0;
  personagemAlvo.recursos ??= {
    vidaAtual: 20,
    vidaMaxima: 20,
    manaAtual: 10,
    manaMaxima: 10
  };
  personagemAlvo.combate ??= {
    defesa: 0,
    reducaoDano: 0,
    iniciativa: 0,
    movimento: 0
  };
  personagemAlvo.modificadoresTemporarios ??= {
    forca: 0,
    agilidade: 0,
    intelecto: 0,
    resistencia: 0
  };
  personagemAlvo.armas ??= [];
  personagemAlvo.habilidades ??= [];
  personagemAlvo.inventario ??= [];
  personagemAlvo.habilidades = personagemAlvo.habilidades.map(normalizarHabilidade);
  personagemAlvo.inventario = dominioDoInventario.migrateInventory(
    personagemAlvo.inventario,
    versaoDoInventario
  );

  personagemAlvo.recursos.vidaMaxima ??= 20;
  personagemAlvo.recursos.vidaAtual ??= personagemAlvo.recursos.vidaMaxima;
  personagemAlvo.recursos.manaMaxima ??= 10;
  personagemAlvo.recursos.manaAtual ??= personagemAlvo.recursos.manaMaxima;
  personagemAlvo.combate.defesa ??= 0;
  personagemAlvo.combate.reducaoDano ??= 0;
  personagemAlvo.combate.iniciativa ??= 0;
  personagemAlvo.combate.movimento ??= 0;

  atributosDeMeridian.forEach(function (atributo) {
    personagemAlvo.modificadoresTemporarios[atributo.id] ??= 0;
  });

  personagemAlvo.recursos.vidaAtual = limitarValor(
    personagemAlvo.recursos.vidaAtual,
    0,
    personagemAlvo.recursos.vidaMaxima
  );
  personagemAlvo.recursos.manaAtual = limitarValor(
    personagemAlvo.recursos.manaAtual,
    0,
    personagemAlvo.recursos.manaMaxima
  );

  return personagemAlvo;
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

function criarIdHabilidade() {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return window.crypto.randomUUID();
  }

  return `habilidade-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normalizarTermoHabilidade(valor) {
  return String(valor ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function normalizarTipoHabilidade(valor) {
  const aliases = {
    passive: "passiva",
    technique: "tecnica",
    reaction: "reacao",
    supreme: "suprema",
    other: "outro"
  };
  const tipo = aliases[normalizarTermoHabilidade(valor)] || normalizarTermoHabilidade(valor);
  return TIPOS_HABILIDADE.has(tipo) ? tipo : "tecnica";
}

function normalizarListaHabilidade(valor) {
  return Array.isArray(valor)
    ? valor.map(function (item) { return String(item ?? "").trim(); }).filter(Boolean)
    : [];
}

function normalizarUsosDaHabilidade(usos) {
  if (!ehObjetoDeDados(usos)) return null;

  const maximo = Math.max(0, Number.parseInt(usos.maximo ?? usos.max, 10) || 0);
  return {
    atual: limitarValor(usos.atual ?? usos.current, 0, maximo),
    maximo,
    recuperacao: String(usos.recuperacao ?? usos.recharge ?? "").trim()
  };
}

function normalizarRecargaDaHabilidade(recarga) {
  if (!ehObjetoDeDados(recarga)) return null;

  const valor = Math.max(0, Number.parseInt(recarga.valor ?? recarga.value, 10) || 0);
  return {
    valor,
    unidade: String(recarga.unidade ?? recarga.unit ?? "rodadas").trim() || "rodadas",
    restante: limitarValor(recarga.restante ?? recarga.remaining, 0, valor)
  };
}

function normalizarHabilidade(habilidade) {
  const dados = ehObjetoDeDados(habilidade) ? habilidade : {};
  const custosOriginais = ehObjetoDeDados(dados.custos) ? dados.custos : {};
  const iconeSolicitado = String(dados.iconeId ?? dados.iconId ?? "habilidade-generica").trim();
  const iconeExiste = CATALOGO_ICONES_HABILIDADE.some(function (icone) {
    return icone.id === iconeSolicitado;
  });

  return {
    id: String(dados.id || criarIdHabilidade()),
    nome: String(dados.nome ?? dados.name ?? "Habilidade sem nome").trim() || "Habilidade sem nome",
    tipo: normalizarTipoHabilidade(dados.tipo ?? dados.type),
    iconeId: iconeExiste ? iconeSolicitado : "habilidade-generica",
    descricao: String(dados.descricao ?? dados.description ?? "").trim(),
    atributo: String(dados.atributo ?? dados.attribute ?? "").trim(),
    acao: String(dados.acao ?? dados.action ?? "").trim(),
    custos: {
      mana: Math.max(0, Number(custosOriginais.mana ?? dados.manaCost) || 0),
      pe: Math.max(0, Number(custosOriginais.pe ?? dados.peCost) || 0)
    },
    alcance: String(dados.alcance ?? dados.range?.label ?? "").trim(),
    dano: String(dados.dano ?? dados.damage ?? "").trim(),
    duracao: String(dados.duracao ?? dados.duration ?? "").trim(),
    usos: normalizarUsosDaHabilidade(dados.usos ?? dados.uses),
    recarga: normalizarRecargaDaHabilidade(dados.recarga ?? dados.cooldown),
    efeitos: normalizarListaHabilidade(dados.efeitos ?? dados.effects),
    requisitos: normalizarListaHabilidade(dados.requisitos ?? dados.requirements),
    limitacoes: normalizarListaHabilidade(dados.limitacoes ?? dados.limitations),
    observacoes: String(dados.observacoes ?? dados.notes ?? "").trim()
  };
}

function obterEstadoHabilidade(habilidade) {
  if (habilidade.tipo === "passiva") return "passiva";

  if (habilidade.usos && habilidade.usos.maximo > 0 && habilidade.usos.atual <= 0) {
    return "esgotada";
  }

  if (habilidade.recarga && habilidade.recarga.restante > 0) {
    return "recarga";
  }

  return "disponivel";
}

function encontrarHabilidade(habilidadeId) {
  return personagem.habilidades.find(function (habilidade) {
    return habilidade.id === habilidadeId;
  }) || null;
}

function obterDefinicaoIconeHabilidade(iconeId) {
  return CATALOGO_ICONES_HABILIDADE.find(function (icone) {
    return icone.id === iconeId;
  }) || CATALOGO_ICONES_HABILIDADE[0];
}

function criarIconeHabilidade(iconeId) {
  const definicao = obterDefinicaoIconeHabilidade(iconeId);
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
  svg.classList.add("sheet-icon");
  svg.setAttribute("aria-hidden", "true");
  use.setAttribute("href", `#sheet-icon-${definicao.simbolo}`);
  svg.append(use);
  return svg;
}

function obterRotuloTipoHabilidade(tipo) {
  return {
    passiva: "Passiva",
    tecnica: "Técnica",
    reacao: "Reação",
    suprema: "Suprema",
    outro: "Outro"
  }[tipo] || "Técnica";
}

function obterRotuloEstadoHabilidade(estado) {
  return {
    passiva: "Passiva",
    esgotada: "Sem usos",
    recarga: "Em recarga",
    disponivel: "Disponível"
  }[estado] || "Disponível";
}

function obterResumoOperacionalHabilidade(habilidade) {
  if (habilidade.tipo === "passiva") return "Sempre ativa";
  if (habilidade.usos) return `${habilidade.usos.atual}/${habilidade.usos.maximo} usos`;
  if (habilidade.recarga?.restante > 0) {
    return `${habilidade.recarga.restante} ${habilidade.recarga.unidade}`;
  }
  return "Disponível";
}

function criarItemVisualHabilidade(habilidade, modoResumo) {
  const button = document.createElement("button");
  const estado = obterEstadoHabilidade(habilidade);
  button.type = "button";
  button.className = modoResumo ? "sheet-ability-summary-item" : "sheet-ability-list-item";
  button.dataset.abilityId = habilidade.id;
  button.classList.toggle("is-selected", !modoResumo && habilidade.id === habilidadeSelecionadaId);
  button.classList.add(`is-${estado}`);
  button.setAttribute("aria-label", `${habilidade.nome}: ${obterRotuloEstadoHabilidade(estado)}`);

  if (!modoResumo) {
    button.setAttribute("role", "row");
    const criarCelula = function (valor, classe) {
      const cell = document.createElement("span");
      cell.className = classe || "";
      const texto = valor || "—";
      cell.textContent = texto;
      if (texto !== "—") cell.title = texto;
      return cell;
    };

    const marker = document.createElement("span");
    marker.className = `sheet-ability-table-state sheet-ability-col-state is-${estado}`;
    marker.title = obterRotuloEstadoHabilidade(estado);
    marker.setAttribute("aria-label", obterRotuloEstadoHabilidade(estado));
    marker.append(criarIconeHabilidade(
      estado === "recarga" ? "tempo" : estado === "esgotada" ? "habilidade-generica" : "estrela"
    ));

    const nameCell = document.createElement("span");
    nameCell.className = "sheet-ability-table-name sheet-ability-col-name";
    nameCell.title = habilidade.nome;
    const tableIcon = document.createElement("span");
    tableIcon.className = "sheet-ability-table-icon";
    tableIcon.append(criarIconeHabilidade(habilidade.iconeId));
    const tableName = document.createElement("strong");
    tableName.textContent = habilidade.nome;
    nameCell.append(tableIcon, tableName);

    const type = criarCelula(obterRotuloTipoHabilidade(habilidade.tipo), "sheet-ability-table-type sheet-ability-col-type");
    type.classList.add(`is-${habilidade.tipo}`);
    const status = criarCelula(obterRotuloEstadoHabilidade(estado), `sheet-ability-table-status sheet-ability-col-status is-${estado}`);

    button.append(
      marker,
      nameCell,
      type,
      criarCelula(habilidade.custos.mana || "—", "sheet-ability-col-mana sheet-ability-table-number"),
      criarCelula(habilidade.custos.pe || "—", "sheet-ability-col-pe sheet-ability-table-number"),
      criarCelula(habilidade.acao, "sheet-ability-col-action"),
      criarCelula(habilidade.atributo ? habilidade.atributo.toUpperCase() : "—", "sheet-ability-table-attribute sheet-ability-col-attribute"),
      criarCelula(habilidade.alcance, "sheet-ability-col-range"),
      criarCelula(habilidade.dano, "sheet-ability-col-damage"),
      criarCelula(habilidade.duracao, "sheet-ability-col-duration"),
      criarCelula(habilidade.usos ? `${habilidade.usos.atual}/${habilidade.usos.maximo}` : "—", "sheet-ability-col-uses sheet-ability-table-number"),
      criarCelula(habilidade.recarga ? `${habilidade.recarga.restante}/${habilidade.recarga.valor}` : "—", "sheet-ability-col-cooldown sheet-ability-table-number"),
      status
    );
    return button;
  }

  const icon = document.createElement("span");
  icon.className = "sheet-ability-item-icon";
  icon.append(criarIconeHabilidade(habilidade.iconeId));

  const copy = document.createElement("span");
  copy.className = "sheet-ability-item-copy";
  const name = document.createElement("strong");
  name.textContent = habilidade.nome;
  const meta = document.createElement("small");
  const atributo = habilidade.atributo ? ` · ${habilidade.atributo.toUpperCase()}` : "";
  meta.textContent = `${obterRotuloTipoHabilidade(habilidade.tipo)}${atributo}`;
  copy.append(name, meta);

  const operation = document.createElement("span");
  operation.className = "sheet-ability-item-operation";
  operation.textContent = obterResumoOperacionalHabilidade(habilidade);

  button.append(icon, copy, operation);
  return button;
}

function renderizarResumoDeHabilidades() {
  sheetAbilitiesSummary.replaceChildren();
  const habilidades = personagem.habilidades.slice(0, LIMITE_HABILIDADES_RESUMO);

  if (habilidades.length === 0) {
    const empty = document.createElement("div");
    empty.className = "sheet-ability-empty sheet-ability-empty--summary";
    empty.innerHTML = "<strong>Nenhuma habilidade adicionada.</strong><span>Use “Ver todas” para importar um arquivo JSON.</span>";
    sheetAbilitiesSummary.append(empty);
    return;
  }

  habilidades.forEach(function (habilidade) {
    sheetAbilitiesSummary.append(criarItemVisualHabilidade(habilidade, true));
  });
}

function obterHabilidadesFiltradas() {
  const busca = normalizarTermoHabilidade(buscaHabilidade);
  return personagem.habilidades.filter(function (habilidade) {
    const correspondeAoTipo = filtroTipoHabilidade === "todos" || habilidade.tipo === filtroTipoHabilidade;
    const correspondeAoEstado = filtroEstadoHabilidade === "todos"
      || obterEstadoHabilidade(habilidade) === filtroEstadoHabilidade;
    const correspondeABusca = !busca || normalizarTermoHabilidade(
      `${habilidade.nome} ${habilidade.tipo} ${habilidade.atributo} ${habilidade.descricao}`
    ).includes(busca);
    return correspondeAoTipo && correspondeAoEstado && correspondeABusca;
  });
}

function renderizarListaDeHabilidades() {
  sheetAbilityList.replaceChildren();
  const habilidades = obterHabilidadesFiltradas();

  if (habilidades.length === 0) {
    const empty = document.createElement("div");
    empty.className = "sheet-ability-empty";
    const title = document.createElement("strong");
    const description = document.createElement("span");
    title.textContent = personagem.habilidades.length ? "Nenhum resultado." : "Nenhuma habilidade adicionada.";
    description.textContent = personagem.habilidades.length
      ? "Altere a busca ou o filtro de tipo."
      : "Importe um arquivo JSON para começar.";
    empty.append(title, description);
    sheetAbilityList.append(empty);
    renderizarDetalhesDaHabilidade();
    return;
  }

  if (!habilidades.some(function (habilidade) { return habilidade.id === habilidadeSelecionadaId; })) {
    habilidadeSelecionadaId = habilidades[0].id;
  }

  habilidades.forEach(function (habilidade) {
    sheetAbilityList.append(criarItemVisualHabilidade(habilidade, false));
  });
  renderizarDetalhesDaHabilidade();
}

function criarDadoDaHabilidade(rotulo, valor, iconeId) {
  if (valor === "" || valor === null || valor === undefined || valor === 0) return null;
  const wrapper = document.createElement("div");
  const term = document.createElement("dt");
  const description = document.createElement("dd");
  term.textContent = rotulo;
  description.textContent = valor;
  if (iconeId) {
    const icon = document.createElement("span");
    icon.className = "sheet-ability-fact-icon";
    icon.append(criarIconeHabilidade(iconeId));
    wrapper.append(icon);
  }
  wrapper.append(term, description);
  return wrapper;
}

function criarSecaoTextualHabilidade(titulo, conteudo) {
  const itens = Array.isArray(conteudo) ? conteudo : [];
  if (!itens.length && !String(conteudo ?? "").trim()) return null;

  const section = document.createElement("section");
  const modificador = normalizarTermoHabilidade(titulo).replace(/\s+/g, "-");
  section.className = `sheet-ability-text-section sheet-ability-text-section--${modificador}`;
  const heading = document.createElement("h3");
  heading.textContent = titulo;
  section.append(heading);

  if (Array.isArray(conteudo)) {
    const list = document.createElement("ul");
    conteudo.forEach(function (item) {
      const li = document.createElement("li");
      li.textContent = item;
      list.append(li);
    });
    section.append(list);
  } else {
    const paragraph = document.createElement("p");
    paragraph.textContent = conteudo;
    section.append(paragraph);
  }

  return section;
}

function criarControleOperacionalHabilidade(habilidade, tipo) {
  const dados = habilidade[tipo];
  if (!dados) return null;

  const section = document.createElement("section");
  section.className = "sheet-ability-counter";
  const heading = document.createElement("h3");
  heading.textContent = tipo === "usos" ? "Usos" : "Recarga";
  const controls = document.createElement("div");
  controls.className = "sheet-ability-counter__controls";

  const minus = document.createElement("button");
  minus.type = "button";
  minus.dataset.abilityAction = tipo === "usos" ? "decrease-uses" : "decrease-cooldown";
  minus.setAttribute("aria-label", `Diminuir ${heading.textContent.toLowerCase()} de ${habilidade.nome}`);
  minus.append(criarIconeHabilidade("habilidade-generica"));
  minus.firstElementChild.replaceChildren();
  const minusUse = document.createElementNS("http://www.w3.org/2000/svg", "use");
  minusUse.setAttribute("href", "#sheet-icon-minus");
  minus.firstElementChild.append(minusUse);

  const value = document.createElement("strong");
  value.textContent = tipo === "usos"
    ? `${dados.atual} / ${dados.maximo}`
    : `${dados.restante} / ${dados.valor} ${dados.unidade}`;

  const plus = document.createElement("button");
  plus.type = "button";
  plus.dataset.abilityAction = tipo === "usos" ? "increase-uses" : "increase-cooldown";
  plus.setAttribute("aria-label", `Aumentar ${heading.textContent.toLowerCase()} de ${habilidade.nome}`);
  plus.append(criarIconeHabilidade("habilidade-generica"));
  plus.firstElementChild.replaceChildren();
  const plusUse = document.createElementNS("http://www.w3.org/2000/svg", "use");
  plusUse.setAttribute("href", "#sheet-icon-plus");
  plus.firstElementChild.append(plusUse);

  const atual = tipo === "usos" ? dados.atual : dados.restante;
  const maximo = tipo === "usos" ? dados.maximo : dados.valor;
  minus.disabled = atual <= 0;
  plus.disabled = atual >= maximo;
  controls.append(minus, value, plus);
  section.append(heading, controls);
  return section;
}

function renderizarDetalhesDaHabilidade() {
  sheetAbilityDetails.replaceChildren();
  const panelHeading = document.createElement("header");
  panelHeading.className = "sheet-ability-details__panel-heading";
  panelHeading.append(criarIconeHabilidade("estrela"));
  const panelTitle = document.createElement("h2");
  panelTitle.textContent = "Detalhes da habilidade selecionada";
  panelHeading.append(panelTitle);
  sheetAbilityDetails.append(panelHeading);

  const habilidade = encontrarHabilidade(habilidadeSelecionadaId);

  if (!habilidade) {
    const empty = document.createElement("div");
    empty.className = "sheet-ability-empty sheet-ability-empty--details";
    empty.innerHTML = "<strong>Selecione uma habilidade.</strong><span>Os detalhes e controles aparecerão aqui.</span>";
    sheetAbilityDetails.append(empty);
    return;
  }

  const header = document.createElement("header");
  header.className = "sheet-ability-details__header";
  const identity = document.createElement("div");
  identity.className = "sheet-ability-details__identity";
  const icon = document.createElement("span");
  icon.className = `sheet-ability-details__icon is-${habilidade.tipo}`;
  icon.append(criarIconeHabilidade(habilidade.iconeId));
  const copy = document.createElement("div");
  const overline = document.createElement("span");
  overline.textContent = `${obterRotuloTipoHabilidade(habilidade.tipo)}${habilidade.atributo ? ` · ${habilidade.atributo.toUpperCase()}` : ""}`;
  const title = document.createElement("h2");
  title.textContent = habilidade.nome;
  const state = document.createElement("small");
  const estado = obterEstadoHabilidade(habilidade);
  state.className = `sheet-ability-state is-${estado}`;
  state.textContent = obterRotuloEstadoHabilidade(estado);
  copy.append(overline, title, state);
  identity.append(icon, copy);

  const actions = document.createElement("details");
  actions.className = "sheet-ability-details__actions";
  const actionsSummary = document.createElement("summary");
  actionsSummary.textContent = "⋯";
  actionsSummary.setAttribute("aria-label", `Mais ações para ${habilidade.nome}`);
  const actionsMenu = document.createElement("div");
  actionsMenu.className = "sheet-ability-details__actions-menu";
  const changeIcon = document.createElement("button");
  changeIcon.type = "button";
  changeIcon.dataset.abilityAction = "change-icon";
  changeIcon.textContent = "Alterar ícone";
  const remove = document.createElement("button");
  remove.type = "button";
  remove.dataset.abilityAction = "remove";
  remove.textContent = "Remover";
  actionsMenu.append(changeIcon, remove);
  actions.append(actionsSummary, actionsMenu);
  header.append(identity, actions);

  const facts = document.createElement("dl");
  facts.className = "sheet-ability-facts";
  [
    criarDadoDaHabilidade("Mana", habilidade.custos.mana, "mana"),
    criarDadoDaHabilidade("Atributo", habilidade.atributo, "mente"),
    criarDadoDaHabilidade("Alcance", habilidade.alcance, "alvo"),
    criarDadoDaHabilidade("Ação", habilidade.acao, "tempo"),
    criarDadoDaHabilidade("Duração", habilidade.duracao, "tempo"),
    criarDadoDaHabilidade("Dano", habilidade.dano, "espada"),
    criarDadoDaHabilidade("PE", habilidade.custos.pe, "estrela")
  ].filter(Boolean).forEach(function (fact) { facts.append(fact); });

  const counters = document.createElement("div");
  counters.className = "sheet-ability-counters";
  [
    criarControleOperacionalHabilidade(habilidade, "usos"),
    criarControleOperacionalHabilidade(habilidade, "recarga")
  ].filter(Boolean).forEach(function (counter) { counters.append(counter); });

  const content = document.createElement("div");
  content.className = "sheet-ability-details__content";
  const primaryColumn = document.createElement("div");
  primaryColumn.className = "sheet-ability-text-column sheet-ability-text-column--primary";
  [
    criarSecaoTextualHabilidade("Descrição", habilidade.descricao),
    criarSecaoTextualHabilidade("Condições e efeitos", habilidade.efeitos)
  ].filter(Boolean).forEach(function (section) { primaryColumn.append(section); });

  const textColumns = [
    primaryColumn.children.length ? primaryColumn : null,
    criarSecaoTextualHabilidade("Requisitos", habilidade.requisitos),
    criarSecaoTextualHabilidade("Limitações", habilidade.limitacoes),
    criarSecaoTextualHabilidade("Observações", habilidade.observacoes)
  ].filter(Boolean);
  content.classList.add(`has-${textColumns.length}-columns`);
  textColumns.forEach(function (section) { content.append(section); });

  const overview = document.createElement("div");
  overview.className = "sheet-ability-details__overview";
  overview.append(header);
  if (facts.children.length) overview.append(facts);
  if (counters.children.length) overview.append(counters);
  sheetAbilityDetails.append(overview);
  if (content.children.length) sheetAbilityDetails.append(content);
}

function renderizarEstatisticasDeHabilidades() {
  sheetAbilityStats.replaceChildren();
  const totaisDeUsos = personagem.habilidades.reduce(function (total, habilidade) {
    if (!habilidade.usos) return total;
    total.atual += habilidade.usos.atual;
    total.maximo += habilidade.usos.maximo;
    return total;
  }, { atual: 0, maximo: 0 });

  const estatisticas = [
    { rotulo: "Total de habilidades", valor: personagem.habilidades.length, icone: "book" },
    { rotulo: "Passivas", valor: personagem.habilidades.filter(function (item) { return item.tipo === "passiva"; }).length, icone: "wing" },
    { rotulo: "Técnicas", valor: personagem.habilidades.filter(function (item) { return item.tipo === "tecnica"; }).length, icone: "rune-star" },
    { rotulo: "Supremas", valor: personagem.habilidades.filter(function (item) { return item.tipo === "suprema"; }).length, icone: "crown" },
    { rotulo: "Usos restantes", valor: `${totaisDeUsos.atual} / ${totaisDeUsos.maximo}`, icone: "hourglass" }
  ];

  estatisticas.forEach(function (estatistica) {
    const item = document.createElement("div");
    const icon = document.createElement("span");
    icon.append(criarIconeHabilidade(
      CATALOGO_ICONES_HABILIDADE.find(function (definicao) {
        return definicao.simbolo === estatistica.icone;
      })?.id || "habilidade-generica"
    ));
    const copy = document.createElement("span");
    const label = document.createElement("small");
    const value = document.createElement("strong");
    label.textContent = estatistica.rotulo;
    value.textContent = estatistica.valor;
    copy.append(label, value);
    item.append(icon, copy);
    sheetAbilityStats.append(item);
  });
}

function renderizarHabilidadesDaFicha() {
  renderizarResumoDeHabilidades();
  renderizarListaDeHabilidades();
  renderizarEstatisticasDeHabilidades();
}

function renderizarHabilidadesAposMutacao() {
  marcarFichaComoAlterada();
  renderizarHabilidadesDaFicha();
}

function alterarUsosDaHabilidade(habilidadeId, diferenca) {
  const habilidade = encontrarHabilidade(habilidadeId);
  if (!habilidade?.usos) return;
  const proximo = limitarValor(habilidade.usos.atual + diferenca, 0, habilidade.usos.maximo);
  if (proximo === habilidade.usos.atual) return;
  habilidade.usos.atual = proximo;
  renderizarHabilidadesAposMutacao();
}

function alterarRecargaDaHabilidade(habilidadeId, diferenca) {
  const habilidade = encontrarHabilidade(habilidadeId);
  if (!habilidade?.recarga) return;
  const proximo = limitarValor(habilidade.recarga.restante + diferenca, 0, habilidade.recarga.valor);
  if (proximo === habilidade.recarga.restante) return;
  habilidade.recarga.restante = proximo;
  renderizarHabilidadesAposMutacao();
}

function ativarSecaoDaFicha(secao, habilidadeId) {
  if (!["summary", "abilities", "inventory"].includes(secao)) return;
  if (habilidadeId && encontrarHabilidade(habilidadeId)) habilidadeSelecionadaId = habilidadeId;

  sheetViews.forEach(function (view) {
    view.hidden = view.dataset.sheetView !== secao;
  });
  sheetSidebar.querySelectorAll("button[data-sheet-section]").forEach(function (button) {
    const ativa = button.dataset.sheetSection === secao;
    button.classList.toggle("is-active", ativa);
    if (ativa) {
      button.setAttribute("aria-current", "page");
    } else {
      button.removeAttribute("aria-current");
    }
  });

  if (secao === "abilities") {
    renderizarListaDeHabilidades();
    sheetAbilitiesViewHeading.focus({ preventScroll: true });
  }
  if (secao === "inventory") {
    sheetInventoryViewHeading.focus({ preventScroll: true });
  }
  mostrarMensagemDaFicha("");
}

function existeHabilidadeComMesmoNome(nome) {
  const nomeNormalizado = normalizarTermoHabilidade(nome);
  return personagem.habilidades.some(function (habilidade) {
    return normalizarTermoHabilidade(habilidade.nome) === nomeNormalizado;
  });
}

function validarHabilidadeImportada(dados) {
  if (!ehObjetoDeDados(dados)) {
    throw new Error("O arquivo não contém uma habilidade válida.");
  }

  const versao = Number(dados.schemaVersion ?? dados.versao ?? 1);
  if (Number.isFinite(versao) && versao > 1) {
    throw new Error("A habilidade foi criada em uma versão mais recente do Grimório RPG.");
  }

  const conteudo = dados.habilidade ?? dados.ability ?? dados;
  if (!ehObjetoDeDados(conteudo)) {
    throw new Error("O campo 'habilidade' precisa ser um objeto.");
  }
  if (!String(conteudo.nome ?? conteudo.name ?? "").trim()) {
    throw new Error("O campo 'nome' é obrigatório.");
  }

  const habilidade = normalizarHabilidade(conteudo);
  habilidade.id = criarIdHabilidade();
  return habilidade;
}

function renderizarOpcoesDeIcone() {
  abilityIconOptions.replaceChildren();
  CATALOGO_ICONES_HABILIDADE.forEach(function (icone) {
    const label = document.createElement("label");
    label.className = "ability-icon-option";
    label.title = icone.nome;
    const input = document.createElement("input");
    input.type = "radio";
    input.name = "ability-icon";
    input.value = icone.id;
    input.checked = icone.id === iconeHabilidadePendente;
    const visual = document.createElement("span");
    visual.append(criarIconeHabilidade(icone.id));
    const name = document.createElement("span");
    name.className = "sr-only";
    name.textContent = icone.nome;
    label.append(input, visual, name);
    abilityIconOptions.append(label);
  });
}

function abrirDialogDeIcone(habilidade, modo) {
  habilidadePendente = habilidade;
  modoDialogHabilidade = modo;
  iconeHabilidadePendente = habilidade.iconeId || "habilidade-generica";
  abilityImportTitle.textContent = modo === "icone"
    ? `Alterar ícone de ${habilidade.nome}`
    : "Revise os dados e escolha um ícone";
  abilityImportConfirm.textContent = modo === "icone" ? "Salvar ícone" : "Adicionar à ficha";
  abilityImportStatus.textContent = "";
  abilityImportPreview.replaceChildren();

  const name = document.createElement("strong");
  name.textContent = habilidade.nome;
  const meta = document.createElement("span");
  meta.textContent = `${obterRotuloTipoHabilidade(habilidade.tipo)}${habilidade.atributo ? ` · ${habilidade.atributo.toUpperCase()}` : ""}`;
  const description = document.createElement("p");
  description.textContent = habilidade.descricao || "Sem descrição.";
  abilityImportPreview.append(name, meta, description);

  const duplicada = modo === "importar" && existeHabilidadeComMesmoNome(habilidade.nome);
  abilityDuplicateWarning.hidden = !duplicada;
  abilityDuplicateWarning.textContent = duplicada
    ? `Já existe uma habilidade chamada “${habilidade.nome}”. Confirme para importar mesmo assim.`
    : "";
  if (duplicada) abilityImportConfirm.textContent = "Importar mesmo assim";

  renderizarOpcoesDeIcone();
  abilityImportDialog.showModal();
  const selecionado = abilityIconOptions.querySelector("input:checked");
  if (selecionado) selecionado.focus();
}

async function importarArquivoDeHabilidade(event) {
  const arquivo = event.target.files[0];
  if (!arquivo) return;

  try {
    if (!arquivo.name.toLowerCase().endsWith(".json")) {
      throw new Error("Selecione um arquivo de habilidade em formato JSON.");
    }
    if (arquivo.size > 1024 * 1024) {
      throw new Error("O arquivo de habilidade excede o limite de 1 MB.");
    }

    const dados = JSON.parse(await arquivo.text());
    abrirDialogDeIcone(validarHabilidadeImportada(dados), "importar");
  } catch (erro) {
    mostrarMensagemDaFicha(
      erro instanceof SyntaxError
        ? "O arquivo não contém um JSON válido."
        : erro.message || "Não foi possível importar esta habilidade.",
      true
    );
  } finally {
    sheetAbilityFile.value = "";
  }
}

function confirmarDialogDeHabilidade() {
  if (!habilidadePendente) return;
  habilidadePendente.iconeId = iconeHabilidadePendente;

  if (modoDialogHabilidade === "icone") {
    renderizarHabilidadesAposMutacao();
  } else {
    personagem.habilidades.push(normalizarHabilidade(habilidadePendente));
    habilidadeSelecionadaId = habilidadePendente.id;
    renderizarHabilidadesAposMutacao();
  }

  abilityImportDialog.close();
  habilidadePendente = null;
}

function solicitarRemocaoDaHabilidade() {
  const habilidade = encontrarHabilidade(habilidadeSelecionadaId);
  if (!habilidade) return;
  abilityRemoveDescription.textContent = `“${habilidade.nome}” será removida da ficha atual.`;
  abilityRemoveDialog.showModal();
  abilityRemoveConfirm.focus();
}

function removerHabilidadeSelecionada() {
  const indice = personagem.habilidades.findIndex(function (habilidade) {
    return habilidade.id === habilidadeSelecionadaId;
  });
  if (indice < 0) return;

  personagem.habilidades.splice(indice, 1);
  habilidadeSelecionadaId = personagem.habilidades[indice]?.id
    || personagem.habilidades[indice - 1]?.id
    || null;
  abilityRemoveDialog.close();
  renderizarHabilidadesAposMutacao();
}

function marcarFichaComoAlterada() {
  fichaPossuiAlteracoes = true;
  atualizarEstadoDeSalvamento();
}

function alterarVidaAtual(diferenca) {
  definirVidaAtual(personagem.recursos.vidaAtual + diferenca);
}

function definirVidaAtual(valor) {
  const valorAnterior = personagem.recursos.vidaAtual;
  const proximoValor = limitarValor(valor, 0, personagem.recursos.vidaMaxima);
  if (proximoValor === valorAnterior) {
    renderizarRecursosDaFicha();
    return;
  }

  personagem.recursos.vidaAtual = proximoValor;
  marcarFichaComoAlterada();
  renderizarRecursosDaFicha();
  animarMudancaDeRecurso(
    sheetLifeCard,
    proximoValor < valorAnterior ? "is-taking-damage" : "is-being-healed"
  );
}

function alterarManaAtual(diferenca) {
  definirManaAtual(personagem.recursos.manaAtual + diferenca);
}

function definirManaAtual(valor) {
  const valorAnterior = personagem.recursos.manaAtual;
  const proximoValor = limitarValor(valor, 0, personagem.recursos.manaMaxima);
  if (proximoValor === valorAnterior) {
    renderizarRecursosDaFicha();
    return;
  }

  personagem.recursos.manaAtual = proximoValor;
  marcarFichaComoAlterada();
  renderizarRecursosDaFicha();
  animarMudancaDeRecurso(
    sheetManaCard,
    proximoValor < valorAnterior ? "is-spending-mana" : "is-restoring-mana"
  );
}

function calcularPorcentagem(atual, maximo) {
  if (maximo <= 0) return 0;
  return Math.round(Math.min(100, Math.max(0, (atual / maximo) * 100)));
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
  config.maxDisplay.textContent = maximo;
  config.minusButton.disabled = atual <= 0;
  config.plusButton.disabled = atual >= maximo;
  config.bar.style.width = `${porcentagem}%`;
  config.percent.textContent = `${porcentagem}%`;
}

function renderizarRecursosDaFicha() {
  RECURSOS_DA_FICHA.forEach(renderizarRecursoDaFicha);

  const vidaMaxima = personagem.recursos.vidaMaxima;
  const vidaCritica = vidaMaxima > 0 && personagem.recursos.vidaAtual / vidaMaxima <= 0.25;
  sheetLifeCard.classList.toggle("is-critical", vidaCritica);
  sheetLifeStatus.hidden = !vidaCritica;
}

function renderizarAtributosDaFicha() {
  const modificadores = obterModificadoresDaEspecie() || criarModificadoresZerados();
  const motionDeAtributo = window.GrimorioAttributeMotion;
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
    const snapshotAtual = motionDeAtributo?.criarSnapshotDoAtributo({
      distributed: distribuido,
      species: modificadorEspecie,
      temporary: temporario,
      total: final
    });
    const snapshotAnterior = snapshotsAnterioresDosAtributosDaFicha.get(atributo.id);
    const mudanca = snapshotAnterior && snapshotAtual
      ? motionDeAtributo.compararSnapshotsDoAtributo(snapshotAnterior, snapshotAtual)
      : null;
    const card = document.createElement("article");
    const titulo = document.createElement("h3");
    const icone = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const usoDoIcone = document.createElementNS("http://www.w3.org/2000/svg", "use");
    const finalLabel = document.createElement("span");
    const finalValue = document.createElement("strong");
    const lista = document.createElement("dl");

    card.className = "sheet-attribute-card";
    card.dataset.attribute = atributo.id;
    card.dataset.attributeMotion = motionDeAtributo?.obterVisualDoAtributo(atributo.id) || "";
    card.classList.toggle("is-at-limit", final >= calcularLimiteFinal(atributo.id));
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
      ["Distribuído", distribuido, "", "distributed"],
      ["Espécie", formatarModificador(modificadorEspecie), modificadorEspecie > 0 ? "sheet-modifier-positive" : modificadorEspecie < 0 ? "sheet-modifier-negative" : "", "species"],
      ["Temporário", formatarModificador(temporario), temporario > 0 ? "sheet-modifier-positive" : temporario < 0 ? "sheet-modifier-negative" : "", "temporary"]
    ].forEach(function ([label, value, className, source]) {
      const linha = document.createElement("div");
      const dt = document.createElement("dt");
      const dd = document.createElement("dd");

      linha.dataset.attributeSource = source;
      dt.textContent = label;
      dd.textContent = value;
      if (className) dd.className = className;
      linha.append(dt, dd);
      lista.append(linha);
    });

    card.append(titulo, finalLabel, finalValue, lista);
    sheetAttributesList.append(card);

    if (mudanca?.changed) {
      const classesDaMudanca = motionDeAtributo.obterClassesDaMudanca(mudanca);
      window.GrimorioMotion?.animarMudancaDeAtributo(card, classesDaMudanca);
    }
    if (snapshotAtual) snapshotsAnterioresDosAtributosDaFicha.set(atributo.id, snapshotAtual);
  });
}

function resetarSnapshotsDosAtributosDaFicha() {
  snapshotsAnterioresDosAtributosDaFicha.clear();
}

function criarCabecalhoDaTabelaDePericiasDaFicha() {
  const header = document.createElement("div");
  header.className = "sheet-skill-row sheet-skill-row--header";
  header.setAttribute("role", "row");
  ["Perícia", "Atributo", "Dado", "Bônus"].forEach(function (texto) {
    const span = document.createElement("span");
    span.textContent = texto;
    span.setAttribute("role", "columnheader");
    header.append(span);
  });
  return header;
}

function criarLinhaDePericiaDaFicha(pericia) {
  const row = document.createElement("div");
  row.className = "sheet-skill-row";
  row.setAttribute("role", "row");

  [
    pericia.nome,
    obterSiglaDoAtributo(pericia.atributo),
    CONFIGURACAO_PERICIAS.dadoTreinado,
    calcularValorFinalDaFicha(pericia.atributo)
  ].forEach(function (valor, index) {
    const span = document.createElement("span");
    span.textContent = valor;
    span.setAttribute("role", "cell");
    if (index === 1) {
      span.className = `sheet-skill-attribute sheet-skill-attribute--${pericia.atributo}`;
    }
    row.append(span);
  });

  return row;
}

function renderizarPericiasDaFicha() {
  sheetSkillsList.replaceChildren();

  const periciasTreinadas = PERICIAS.filter(function (pericia) {
    return personagem.pericias[pericia.id] === true;
  });
  const tabela = document.createElement("div");
  tabela.className = "sheet-skills-table";
  tabela.setAttribute("role", "table");
  tabela.setAttribute("aria-label", "Perícias treinadas");
  tabela.append(criarCabecalhoDaTabelaDePericiasDaFicha());
  periciasTreinadas.forEach(function (pericia) {
    tabela.append(criarLinhaDePericiaDaFicha(pericia));
  });
  sheetSkillsList.append(tabela);
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

function obterConfiguracaoVisualDoItem(item) {
  const definicao = item.item;
  return {
    raridade: CONFIGURACAO_DE_RARIDADE[definicao.raridade] || CONFIGURACAO_DE_RARIDADE.comum,
    tipo: CONFIGURACAO_DE_TIPO_DE_ITEM[definicao.tipo] || CONFIGURACAO_DE_TIPO_DE_ITEM.outro
  };
}

function obterSimboloVisualDoItem(item) {
  return SIMBOLOS_DE_TIPO_DE_ITEM[item.item.tipo] || SIMBOLOS_DE_TIPO_DE_ITEM.outro;
}

function criarArteDoItem(item, classe) {
  const moldura = document.createElement("span");
  moldura.className = classe || "sheet-inventory-item__art";
  moldura.dataset.itemSymbol = obterSimboloVisualDoItem(item);
  if (item.item.imagem) {
    const imagem = document.createElement("img");
    imagem.src = item.item.imagem;
    imagem.alt = "";
    imagem.loading = "lazy";
    imagem.addEventListener("error", function () {
      imagem.remove();
      moldura.classList.add("uses-fallback");
    }, { once: true });
    moldura.append(imagem);
  } else {
    moldura.classList.add("uses-fallback");
  }
  return moldura;
}

function formatarPeso(valor) {
  return `${Number(valor || 0).toLocaleString("pt-BR", { maximumFractionDigits: 2 })} kg`;
}

function criarElementoComTexto(tag, classe, texto) {
  const elemento = document.createElement(tag);
  if (classe) elemento.className = classe;
  elemento.textContent = texto;
  return elemento;
}

function criarLinhaDeDetalheDoInventario(rotulo, valor) {
  const linha = document.createElement("div");
  const termo = document.createElement("dt");
  const descricao = document.createElement("dd");

  linha.className = "sheet-inventory-details__row";
  termo.textContent = rotulo;
  descricao.textContent = valor;
  linha.append(termo, descricao);
  return linha;
}

function obterItemDoInventarioPorId(itemId) {
  return personagem.inventario.find(function (item) {
    return item.id === itemId;
  }) || null;
}

function resetarEstadoTransitorioDoInventario() {
  inventoryUIState.pendingPlacement = null;
  inventoryUIState.reorganizingForPending = false;
  inventoryUIState.movingItemId = null;
  inventoryUIState.selectedItemId = null;
  inventoryUIState.hoveredCell = null;
  inventoryUIState.candidatePosition = null;
  inventoryUIState.pointerSession = null;
  inventoryUIState.discardingItemId = null;
}

function obterDisponibilidadeDoItemPendente() {
  const itemPendente = inventoryUIState.pendingPlacement;
  if (!itemPendente) return null;

  return dominioDoInventario.getInventoryPlacementAvailability(
    personagem.inventario,
    itemPendente,
    { rotation: itemPendente.rotacao }
  );
}

function obterItemEmPosicionamento() {
  if (inventoryUIState.movingItemId) {
    return obterItemDoInventarioPorId(inventoryUIState.movingItemId);
  }
  return inventoryUIState.pendingPlacement;
}

function avaliarPosicionamentoAtual() {
  const item = obterItemEmPosicionamento();
  const posicao = inventoryUIState.candidatePosition;
  if (!item || !posicao) return null;

  return dominioDoInventario.canPlaceItem(personagem.inventario, item, posicao, {
    rotation: item.rotacao,
    ignoreItemId: inventoryUIState.movingItemId || undefined
  });
}

function descreverResultadoDoPosicionamento(resultado) {
  if (!resultado) return "Escolha uma célula da mochila.";
  if (resultado.valid) return "Posição válida. Confirme para concluir.";
  if (resultado.code === "item-too-large") return "O item é maior do que os limites da mochila.";
  if (resultado.detail === "collision") return "Posição inválida: o espaço está ocupado por outro item.";
  return "Posição inválida: parte do item ficaria fora da mochila.";
}

function renderizarPreviewDoInventario() {
  const item = obterItemEmPosicionamento();
  const posicao = inventoryUIState.candidatePosition;
  const resultado = avaliarPosicionamentoAtual();

  sheetInventoryGrid.classList.toggle("is-positioning", Boolean(item));
  sheetInventoryGrid.classList.toggle("has-valid-preview", Boolean(resultado?.valid));
  sheetInventoryGrid.classList.toggle("has-invalid-preview", Boolean(resultado && !resultado.valid));

  if (!item || !posicao || !resultado) {
    sheetInventoryPreviewLayer.replaceChildren();
    return;
  }

  const fragmento = document.createDocumentFragment();
  const classeDeEstado = resultado.valid ? "is-valid" : "is-invalid";
  resultado.cells.forEach(function (celula) {
    if (
      celula.x < 0
      || celula.y < 0
      || celula.x >= CONFIGURACAO_DO_INVENTARIO.columns
      || celula.y >= CONFIGURACAO_DO_INVENTARIO.rows
    ) return;

    const marcador = document.createElement("span");
    marcador.className = `sheet-inventory-preview-cell ${classeDeEstado}`;
    marcador.style.gridColumnStart = String(celula.x + 1);
    marcador.style.gridRowStart = String(celula.y + 1);
    fragmento.append(marcador);
  });

  const contorno = document.createElement("span");
  contorno.className = `sheet-inventory-preview-footprint ${classeDeEstado}`;
  contorno.classList.toggle("is-moving", Boolean(inventoryUIState.movingItemId));
  contorno.style.gridColumn = `${posicao.x + 1} / span ${resultado.dimensions.largura}`;
  contorno.style.gridRow = `${posicao.y + 1} / span ${resultado.dimensions.altura}`;
  contorno.dataset.label = resultado.valid ? "✓ Encaixe" : "× Bloqueado";
  fragmento.append(contorno);
  sheetInventoryPreviewLayer.replaceChildren(fragmento);
}

function atualizarFeedbackVisualDoPosicionamento() {
  const resultado = avaliarPosicionamentoAtual();
  const chaves = new Set((resultado?.cells || []).map(function (celula) {
    return `${celula.x}:${celula.y}`;
  }));

  sheetInventoryCellLayer.querySelectorAll(".sheet-inventory-cell").forEach(function (celula) {
    const fazParte = chaves.has(`${celula.dataset.x}:${celula.dataset.y}`);
    celula.classList.toggle("is-preview-valid", fazParte && resultado?.valid === true);
    celula.classList.toggle("is-preview-invalid", fazParte && resultado?.valid === false);
  });
  renderizarPreviewDoInventario();

  if (resultado) {
    sheetInventoryPlacementStatus.textContent = descreverResultadoDoPosicionamento(resultado);
  }
}

function renderizarResumoDoInventario(celulasUsadas) {
  const capacidade = CONFIGURACAO_DO_INVENTARIO.capacity;
  const celulasLivres = capacidade - celulasUsadas;
  const percentualOcupado = capacidade > 0 ? (celulasUsadas / capacidade) * 100 : 0;
  const rotuloOcupadas = celulasUsadas === 1 ? "célula ocupada" : "células ocupadas";
  const rotuloLivres = celulasLivres === 1 ? "célula livre" : "células livres";

  sheetInventoryUsedCells.textContent = `${celulasUsadas} de ${capacidade} ${rotuloOcupadas}`;
  sheetInventoryFreeCells.textContent = `${celulasLivres} ${rotuloLivres}`;
  sheetInventoryCapacity.textContent = `${celulasUsadas} / ${capacidade} células`;
  sheetInventoryOccupancy.setAttribute("aria-valuemax", String(capacidade));
  sheetInventoryOccupancy.setAttribute("aria-valuenow", String(celulasUsadas));
  sheetInventoryOccupancy.setAttribute(
    "aria-valuetext",
    `${celulasUsadas} de ${capacidade} células ocupadas`
  );
  sheetInventoryOccupancyBar.style.width = `${percentualOcupado}%`;

  if (celulasUsadas === 0) {
    sheetInventorySummaryStatus.textContent = "A mochila está vazia e pronta para receber itens.";
  } else if (celulasUsadas === capacidade) {
    sheetInventorySummaryStatus.textContent = "A mochila está completamente ocupada.";
  } else {
    const quantidadeDeItens = personagem.inventario.length;
    const rotuloDeItens = quantidadeDeItens === 1 ? "item organizado" : "itens organizados";
    sheetInventorySummaryStatus.textContent = `${quantidadeDeItens} ${rotuloDeItens} na mochila.`;
  }
}

function sincronizarConfiguracaoVisualDaMochila(celulasUsadas) {
  const { columns, rows, capacity } = CONFIGURACAO_DO_INVENTARIO;
  const descricao = `Mochila com ${columns} colunas e ${rows} linhas; ${celulasUsadas} de ${capacity} células ocupadas.`;

  sheetInventoryGrid.style.setProperty("--inventory-columns", String(columns));
  sheetInventoryGrid.style.setProperty("--inventory-rows", String(rows));
  sheetInventoryGrid.dataset.columns = String(columns);
  sheetInventoryGrid.dataset.rows = String(rows);
  sheetInventoryGrid.setAttribute("aria-label", descricao);
  sheetInventoryGridScroll.setAttribute("aria-label", descricao);
  sheetInventoryCellLayer.style.setProperty("--inventory-columns", String(columns));
  sheetInventoryCellLayer.style.setProperty("--inventory-rows", String(rows));
  sheetInventoryPreviewLayer.style.setProperty("--inventory-columns", String(columns));
  sheetInventoryPreviewLayer.style.setProperty("--inventory-rows", String(rows));
  sheetInventoryItemLayer.style.setProperty("--inventory-columns", String(columns));
  sheetInventoryItemLayer.style.setProperty("--inventory-rows", String(rows));
}

function renderizarCamadaDeCelulasDoInventario(matrizDeOcupacao) {
  const fragmento = document.createDocumentFragment();
  const modoInterativo = Boolean(inventoryUIState.pendingPlacement || inventoryUIState.movingItemId);
  const posicaoPreferida = inventoryUIState.candidatePosition || inventoryUIState.hoveredCell;
  const posicaoDoTabStop = posicaoPreferida
    && Number.isInteger(posicaoPreferida.x)
    && Number.isInteger(posicaoPreferida.y)
    && posicaoPreferida.x >= 0
    && posicaoPreferida.x < CONFIGURACAO_DO_INVENTARIO.columns
    && posicaoPreferida.y >= 0
    && posicaoPreferida.y < CONFIGURACAO_DO_INVENTARIO.rows
    ? posicaoPreferida
    : { x: 0, y: 0 };
  const itensPorId = new Map(personagem.inventario.map(function (item) {
    return [item.id, item];
  }));

  if (modoInterativo) {
    sheetInventoryCellLayer.removeAttribute("aria-hidden");
  } else {
    sheetInventoryCellLayer.setAttribute("aria-hidden", "true");
  }

  for (let y = 0; y < CONFIGURACAO_DO_INVENTARIO.rows; y += 1) {
    for (let x = 0; x < CONFIGURACAO_DO_INVENTARIO.columns; x += 1) {
      const itemId = matrizDeOcupacao[y][x];
      const item = itemId ? itensPorId.get(itemId) : null;
      const celula = document.createElement(modoInterativo ? "button" : "span");

      celula.className = "sheet-inventory-cell";
      celula.classList.add(item ? "is-occupied" : "is-free");
      celula.dataset.x = String(x);
      celula.dataset.y = String(y);
      celula.style.gridColumnStart = String(x + 1);
      celula.style.gridRowStart = String(y + 1);

      if (modoInterativo) {
        celula.type = "button";
        celula.tabIndex = x === posicaoDoTabStop.x && y === posicaoDoTabStop.y ? 0 : -1;
        celula.setAttribute(
          "aria-label",
          item
            ? `Coluna ${x + 1}, linha ${y + 1}: ocupada por ${item.item.nome}.`
            : `Coluna ${x + 1}, linha ${y + 1}: célula livre.`
        );
        celula.setAttribute("aria-keyshortcuts", "ArrowUp ArrowDown ArrowLeft ArrowRight Enter Escape");
      }

      fragmento.append(celula);
    }
  }

  sheetInventoryCellLayer.replaceChildren(fragmento);
}

function criarBotaoDeItemDoInventario(item) {
  const dimensoes = dominioDoInventario.getEffectiveDimensions(item, item.rotacao);
  const visual = obterConfiguracaoVisualDoItem(item);
  const selecionado = inventoryUIState.selectedItemId === item.id;
  const botao = document.createElement("button");
  const arte = criarArteDoItem(item);
  const legenda = document.createElement("span");
  const nome = document.createElement("strong");
  const metadados = document.createElement("span");

  botao.type = "button";
  botao.className = "sheet-inventory-item";
  botao.classList.add(visual.raridade.cssClass);
  botao.classList.toggle("is-selected", selecionado);
  botao.classList.toggle("is-dragging", inventoryUIState.movingItemId === item.id);
  botao.dataset.inventoryItemId = item.id;
  botao.dataset.itemType = item.item.tipo;
  botao.dataset.itemWidth = String(dimensoes.largura);
  botao.dataset.itemHeight = String(dimensoes.altura);
  botao.dataset.itemSymbol = SIMBOLOS_DE_TIPO_DE_ITEM[item.item.tipo] || SIMBOLOS_DE_TIPO_DE_ITEM.outro;
  botao.style.gridColumn = `${item.posicao.x + 1} / span ${dimensoes.largura}`;
  botao.style.gridRow = `${item.posicao.y + 1} / span ${dimensoes.altura}`;
  botao.setAttribute("aria-controls", "sheet-inventory-details");
  botao.setAttribute("aria-pressed", String(selecionado));
  botao.setAttribute(
    "aria-label",
    `${item.item.nome}, ${visual.raridade.label}, ${dimensoes.largura} por ${dimensoes.altura} células, coluna ${item.posicao.x + 1}, linha ${item.posicao.y + 1}.`
  );

  nome.textContent = item.item.nome;
  metadados.textContent = item.item.atributoPrincipal?.valor || visual.raridade.label;
  legenda.className = "sheet-inventory-item__caption";
  legenda.append(nome, metadados);
  if (item.item.quantidade > 1) {
    const quantidade = document.createElement("b");
    quantidade.className = "sheet-inventory-item__quantity";
    quantidade.textContent = `×${item.item.quantidade}`;
    botao.append(quantidade);
  }
  botao.append(arte, legenda);
  return botao;
}

function renderizarCamadaDeItensDoInventario() {
  const fragmento = document.createDocumentFragment();
  const elementoFocado = document.activeElement;
  const itemIdFocado = elementoFocado
    && sheetInventoryItemLayer.contains(elementoFocado)
    ? elementoFocado.dataset.inventoryItemId || null
    : null;

  if (personagem.inventario.length === 0) {
    const estadoVazio = document.createElement("p");
    estadoVazio.className = "sheet-inventory-grid-empty";
    estadoVazio.textContent = "Mochila vazia";
    fragmento.append(estadoVazio);
  } else {
    personagem.inventario.forEach(function (item) {
      fragmento.append(criarBotaoDeItemDoInventario(item));
    });
  }

  sheetInventoryItemLayer.replaceChildren(fragmento);

  if (itemIdFocado) {
    const novoBotaoFocado = Array.from(sheetInventoryItemLayer.children).find(function (elemento) {
      return elemento.dataset.inventoryItemId === itemIdFocado;
    });
    novoBotaoFocado?.focus({ preventScroll: true });
  }
}

function criarDetalhesVisuaisDoItem(item, opcoes = {}) {
  const visual = obterConfiguracaoVisualDoItem(item);
  const dimensoes = dominioDoInventario.getEffectiveDimensions(item, item.rotacao);
  const conteudo = document.createElement("article");
  const cabecalho = document.createElement("header");
  const nome = document.createElement("h3");
  const raridade = document.createElement("span");
  const arte = criarArteDoItem(item, "sheet-inventory-details__art");
  const destaque = document.createElement("div");
  const descricao = document.createElement("p");
  const lista = document.createElement("dl");

  conteudo.className = "sheet-inventory-details__content";
  conteudo.classList.add(visual.raridade.cssClass);
  conteudo.dataset.itemSymbol = SIMBOLOS_DE_TIPO_DE_ITEM[item.item.tipo] || SIMBOLOS_DE_TIPO_DE_ITEM.outro;
  cabecalho.className = "sheet-inventory-details__title";
  nome.textContent = item.item.nome;
  raridade.className = "sheet-inventory-details__rarity";
  raridade.textContent = opcoes.pendente
    ? `Importado · ${visual.raridade.label}`
    : visual.raridade.label;
  cabecalho.append(nome, raridade);

  destaque.className = "sheet-inventory-details__hero-stat";
  destaque.append(
    criarElementoComTexto("span", "", item.item.atributoPrincipal?.rotulo || visual.tipo.label),
    criarElementoComTexto("strong", "", item.item.atributoPrincipal?.valor || formatarPeso(item.item.peso))
  );

  descricao.className = "sheet-inventory-details__description";
  descricao.textContent = item.item.descricao || "Nenhuma descrição informada.";

  lista.className = "sheet-inventory-details__metadata";
  lista.append(
    criarLinhaDeDetalheDoInventario("Tipo", visual.tipo.label),
    criarLinhaDeDetalheDoInventario("Tamanho", `${dimensoes.largura} × ${dimensoes.altura} células`),
    criarLinhaDeDetalheDoInventario("Peso", formatarPeso(item.item.peso)),
    criarLinhaDeDetalheDoInventario("Rotação", `${item.rotacao}°`)
  );

  if (item.item.propriedades?.length) {
    const propriedades = document.createElement("div");
    propriedades.className = "sheet-inventory-details__properties";
    item.item.propriedades.forEach(function (propriedade) {
      const tag = document.createElement("span");
      tag.textContent = propriedade;
      propriedades.append(tag);
    });
    lista.after(propriedades);
    conteudo.append(cabecalho, arte, destaque, descricao, lista, propriedades);
    return conteudo;
  }

  if (opcoes.pendente) {
    lista.append(criarLinhaDeDetalheDoInventario("Estado", "Aguardando posicionamento"));
  } else {
    lista.append(
      criarLinhaDeDetalheDoInventario(
        "Posição",
        `Coluna ${item.posicao.x + 1}, linha ${item.posicao.y + 1}`
      )
    );
  }

  conteudo.append(cabecalho, arte, destaque, descricao, lista);
  return conteudo;
}

function renderizarDetalhesDoInventario() {
  const itemPendente = inventoryUIState.pendingPlacement;
  const itemSelecionado = obterItemDoInventarioPorId(inventoryUIState.selectedItemId);
  const deveMostrarItemPendente = itemPendente
    && (!inventoryUIState.reorganizingForPending || !itemSelecionado);

  if (deveMostrarItemPendente) {
    sheetInventoryDetails.replaceChildren(criarDetalhesVisuaisDoItem(itemPendente, { pendente: true }));
    sheetInventoryItemActions.hidden = true;
    return;
  }

  if (!itemSelecionado) {
    inventoryUIState.selectedItemId = null;
    sheetInventoryDetails.replaceChildren(sheetInventoryDetailsEmpty);
    sheetInventoryItemActions.hidden = true;
    sheetInventoryPlacementStatus.textContent = "Selecione um item para ver seus detalhes ou reorganizar a mochila.";
    return;
  }

  sheetInventoryDetails.replaceChildren(criarDetalhesVisuaisDoItem(itemSelecionado));
  sheetInventoryItemActions.hidden = false;
  const ehArmadura = itemSelecionado.item.tipo === "armadura" || itemSelecionado.item.equipavelEm === "armadura";
  sheetEquipItem.hidden = !ehArmadura;
  sheetEquipItem.textContent = "Equipar armadura";
  const dimensoes = dominioDoInventario.getEffectiveDimensions(itemSelecionado, itemSelecionado.rotacao);
  sheetRotateItem.hidden = dimensoes.largura === dimensoes.altura;
  sheetMoveItem.textContent = inventoryUIState.movingItemId === itemSelecionado.id
    ? "Cancelar movimento"
    : "Mover item";
  sheetInventoryPlacementStatus.textContent = inventoryUIState.movingItemId === itemSelecionado.id
    ? `Movendo ${itemSelecionado.item.nome}. Use as setas e Enter, toque em uma célula ou arraste o item.`
    : `${itemSelecionado.item.nome} selecionado.`;
}

function renderizarItemRecebido() {
  const item = inventoryUIState.pendingPlacement;
  if (!item) {
    sheetInventoryReceived.classList.remove("has-item");
    sheetInventoryReceived.innerHTML = `
      <div class="sheet-inventory-received__empty">
        <span class="sheet-inventory-received__seal" aria-hidden="true">✦</span>
        <strong>Bancada livre</strong>
        <p>Itens importados aparecem aqui antes de entrar na mochila.</p>
      </div>`;
    return;
  }

  const visual = obterConfiguracaoVisualDoItem(item);
  const dimensoes = dominioDoInventario.getEffectiveDimensions(item, item.rotacao);
  const cartao = document.createElement("article");
  const arte = criarArteDoItem(item, "sheet-inventory-received__art");
  const proporcao = Math.max(0.45, Math.min(1.45, dimensoes.largura / dimensoes.altura));
  arte.style.setProperty("--received-ratio", String(proporcao));
  cartao.className = `sheet-inventory-received__card ${visual.raridade.cssClass}`;
  cartao.append(arte);
  const texto = document.createElement("div");
  texto.append(
    criarElementoComTexto("span", "sheet-inventory-received__rarity", `${visual.tipo.label} · ${visual.raridade.label}`),
    criarElementoComTexto("h4", "", item.item.nome),
    criarElementoComTexto("p", "", item.item.descricao || "Uma nova peça aguarda lugar na mochila.")
  );
  const lista = document.createElement("dl");
  lista.append(
    criarLinhaDeDetalheDoInventario(
      item.item.atributoPrincipal?.rotulo || "Peso",
      item.item.atributoPrincipal?.valor || formatarPeso(item.item.peso)
    ),
    criarLinhaDeDetalheDoInventario("Volume", `${dimensoes.largura} × ${dimensoes.altura}`)
  );
  texto.append(lista);
  cartao.append(texto);
  sheetInventoryReceived.classList.add("has-item");
  sheetInventoryReceived.replaceChildren(cartao);
}

function renderizarEquipamentoDoInventario() {
  const armadura = personagem.equipamentos?.armadura;
  sheetInventoryArmorSlot.classList.toggle("has-item", Boolean(armadura));
  if (!armadura) {
    sheetInventoryArmorSlot.setAttribute("aria-label", "Slot de armadura vazio");
    sheetInventoryArmorSlot.innerHTML = `<span class="sheet-inventory-armor-slot__ghost" aria-hidden="true">♜</span><span><small>Armadura</small><strong>Nenhuma equipada</strong></span>`;
    return;
  }
  const arte = criarArteDoItem(armadura, "sheet-inventory-armor-slot__art");
  const texto = document.createElement("span");
  texto.append(
    criarElementoComTexto("small", "", "Armadura equipada"),
    criarElementoComTexto("strong", "", armadura.item.nome),
    criarElementoComTexto("em", "", armadura.item.atributoPrincipal?.valor || formatarPeso(armadura.item.peso))
  );
  sheetInventoryArmorSlot.replaceChildren(arte, texto);
  sheetInventoryArmorSlot.setAttribute("aria-label", `${armadura.item.nome}, armadura equipada. Ative para desequipar.`);
}

function renderizarResumoPremiumDoInventario(celulasUsadas) {
  const armadura = personagem.equipamentos?.armadura;
  const pesoMochila = personagem.inventario.reduce(function (total, item) {
    return total + Number(item.item.peso || 0) * Number(item.item.quantidade || 1);
  }, 0);
  const pesoTotal = pesoMochila + (armadura ? Number(armadura.item.peso || 0) * Number(armadura.item.quantidade || 1) : 0);
  const pesoMaximo = Number(personagem.capacidadeInventario?.pesoMaximo || 0);
  sheetInventoryWeight.textContent = pesoMaximo > 0 ? `${formatarPeso(pesoTotal)} / ${formatarPeso(pesoMaximo)}` : formatarPeso(pesoTotal);
  sheetInventoryWeightBar.style.width = `${pesoMaximo > 0 ? Math.min(100, (pesoTotal / pesoMaximo) * 100) : Math.min(100, pesoTotal * 2.5)}%`;
  sheetInventoryItemCount.textContent = String(personagem.inventario.length + (armadura ? 1 : 0));
  sheetInventorySpaceSummary.textContent = `${celulasUsadas} / ${CONFIGURACAO_DO_INVENTARIO.capacity}`;
  sheetInventoryGold.textContent = String(personagem.economia?.ouro || 0);
  sheetInventorySilver.textContent = String(personagem.economia?.prata || 0);
}

function renderizarEstadoDoItemPendente() {
  const itemPendente = inventoryUIState.pendingPlacement;

  if (!itemPendente) {
    inventoryUIState.reorganizingForPending = false;
    sheetInventoryPendingActions.hidden = true;
    sheetReorganizeForItem.hidden = false;
    return;
  }

  const disponibilidade = obterDisponibilidadeDoItemPendente();
  const dimensoes = disponibilidade.dimensions;
  sheetRotatePendingItem.hidden = itemPendente.item.tamanho.largura === itemPendente.item.tamanho.altura;
  const visual = obterConfiguracaoVisualDoItem(itemPendente);
  const resumo = `${itemPendente.item.nome} · ${dimensoes.largura} × ${dimensoes.altura} · ${visual.raridade.label}`;

  sheetInventoryPendingActions.hidden = false;
  sheetReorganizeForItem.hidden = disponibilidade.code !== "no-space-available"
    || inventoryUIState.reorganizingForPending;

  if (inventoryUIState.reorganizingForPending) {
    sheetInventoryPendingHeading.textContent = "Reorganização manual";
    sheetInventoryPendingMessage.textContent = `${resumo}. Selecione um item já guardado e use Mover item para liberar espaço. O item importado continuará pendente.`;
    sheetInventoryPlacementStatus.textContent = "Reorganização manual ativa. Nenhum item foi movido automaticamente.";
    return;
  }

  if (disponibilidade.code === "item-too-large") {
    sheetInventoryPendingHeading.textContent = "Item incompatível com a mochila";
    sheetInventoryPendingMessage.textContent = `${resumo}. As dimensões excedem os limites da mochila; reorganizar os itens não resolverá.`;
    sheetInventoryPlacementStatus.textContent = "Este item é grande demais para a mochila. Cancele a importação ou descarte o item importado.";
    return;
  }

  if (disponibilidade.code === "no-space-available") {
    sheetInventoryPendingHeading.textContent = "Item aguardando espaço";
    sheetInventoryPendingMessage.textContent = `${resumo}. Não existe uma posição válida na organização atual.`;
    sheetInventoryPlacementStatus.textContent = "Não há espaço disponível na organização atual. Reorganize manualmente, cancele ou descarte o item importado.";
    return;
  }

  sheetInventoryPendingHeading.textContent = "Item aguardando posicionamento";
  sheetInventoryPendingMessage.textContent = `${resumo}. Escolha uma posição válida na mochila para confirmar a importação.`;
  sheetInventoryPlacementStatus.textContent = "Item validado. A posição destacada é apenas uma sugestão; escolha e confirme uma posição para adicioná-lo.";
}

function renderizarInventario() {
  const matrizDeOcupacao = dominioDoInventario.createOccupancyMatrix(personagem.inventario);
  const celulasUsadas = dominioDoInventario.getUsedInventoryCells(personagem.inventario);

  sincronizarConfiguracaoVisualDaMochila(celulasUsadas);
  renderizarResumoDoInventario(celulasUsadas);
  renderizarCamadaDeCelulasDoInventario(matrizDeOcupacao);
  renderizarCamadaDeItensDoInventario();
  renderizarItemRecebido();
  renderizarEquipamentoDoInventario();
  renderizarResumoPremiumDoInventario(celulasUsadas);
  renderizarDetalhesDoInventario();
  renderizarEstadoDoItemPendente();
  atualizarFeedbackVisualDoPosicionamento();
}

function executarMutacaoDoInventario(mutacao, opcoes = {}) {
  if (typeof mutacao !== "function") {
    throw new TypeError("A mutação do inventário deve ser uma função.");
  }

  const resultado = mutacao(personagem.inventario, inventoryUIState);
  // Mutações persistentes retornam true somente depois de efetivar o commit no inventário.
  if (opcoes.persistente !== false && resultado === true) marcarFichaComoAlterada();
  renderizarInventario();
  return resultado;
}

function abrirSeletorDeItemDoInventario() {
  if (inventoryUIState.pendingPlacement) {
    sheetInventoryPlacementStatus.textContent = "Posicione, cancele ou descarte o item pendente antes de importar outro.";
    return;
  }

  sheetItemFile.value = "";
  sheetItemFile.click();
}

function obterDefinicaoDoItemImportado(dados) {
  if (!ehObjetoDeDados(dados) || dados.tipo !== "grimorio-item") {
    throw new Error("Este JSON não é um item do Grimório RPG.");
  }

  if (typeof dados.schemaVersion !== "number" || ![1, 2].includes(dados.schemaVersion)) {
    throw new Error("A versão do item não é compatível com o Grimório RPG.");
  }

  if (!Object.prototype.hasOwnProperty.call(dados, "item")) {
    throw new Error("O arquivo JSON não contém os dados do item.");
  }

  return dominioDoInventario.normalizeItemDefinition(dados.item);
}

function criarItemPendenteDaImportacao(definicao) {
  const idsEmUso = new Set(personagem.inventario.map(function (item) {
    return item.id;
  }));

  return {
    id: dominioDoInventario.createInventoryItemId(undefined, idsEmUso),
    item: definicao,
    rotacao: 0
  };
}

async function importarArquivoDeItem(event) {
  const arquivo = event.target.files[0];
  if (!arquivo) return;

  if (!arquivo.name.toLowerCase().endsWith(".json")) {
    sheetInventoryPlacementStatus.textContent = "Selecione um arquivo de item com extensão .json.";
    return;
  }

  if (arquivo.size > 1024 * 1024) {
    sheetInventoryPlacementStatus.textContent = "O arquivo de item excede o limite de 1 MB.";
    return;
  }

  sheetImportItem.disabled = true;
  sheetImportItem.setAttribute("aria-busy", "true");
  sheetInventoryPlacementStatus.textContent = "Validando item importado...";

  try {
    const conteudo = await arquivo.text();
    const dados = JSON.parse(conteudo);
    const definicao = obterDefinicaoDoItemImportado(dados);
    const itemPendente = criarItemPendenteDaImportacao(definicao);
    const disponibilidade = dominioDoInventario.getInventoryPlacementAvailability(
      personagem.inventario,
      itemPendente,
      { rotation: 0 }
    );

    executarMutacaoDoInventario(function (_inventario, estadoDaInterface) {
      estadoDaInterface.pendingPlacement = itemPendente;
      estadoDaInterface.reorganizingForPending = false;
      estadoDaInterface.movingItemId = null;
      estadoDaInterface.selectedItemId = null;
      estadoDaInterface.hoveredCell = null;
      estadoDaInterface.candidatePosition = disponibilidade.available
        ? { x: disponibilidade.position.x, y: disponibilidade.position.y }
        : null;
      estadoDaInterface.pointerSession = null;
    }, { persistente: false });
  } catch (erro) {
    sheetInventoryPlacementStatus.textContent = erro instanceof SyntaxError
      ? "O arquivo não contém um JSON válido."
      : erro.message || "Não foi possível importar este item.";
  } finally {
    sheetImportItem.disabled = false;
    sheetImportItem.removeAttribute("aria-busy");
  }
}

function limparItemPendenteDoInventario(mensagem) {
  if (!inventoryUIState.pendingPlacement) return;

  executarMutacaoDoInventario(function (_inventario, estadoDaInterface) {
    estadoDaInterface.pendingPlacement = null;
    estadoDaInterface.reorganizingForPending = false;
    estadoDaInterface.movingItemId = null;
    estadoDaInterface.hoveredCell = null;
    estadoDaInterface.candidatePosition = null;
    estadoDaInterface.pointerSession = null;
  }, { persistente: false });

  sheetInventoryPlacementStatus.textContent = mensagem;
}

function cancelarImportacaoDeItem() {
  limparItemPendenteDoInventario("Importação cancelada. Nenhum item foi adicionado à mochila.");
}

function descartarItemImportado() {
  limparItemPendenteDoInventario("Item importado descartado antes de entrar na mochila.");
}

function reorganizarMochilaParaItemPendente() {
  if (!inventoryUIState.pendingPlacement) return;

  const disponibilidade = obterDisponibilidadeDoItemPendente();
  if (disponibilidade.code !== "no-space-available") {
    renderizarInventario();
    return;
  }

  executarMutacaoDoInventario(function (_inventario, estadoDaInterface) {
    estadoDaInterface.reorganizingForPending = true;
    estadoDaInterface.selectedItemId = null;
    estadoDaInterface.movingItemId = null;
    estadoDaInterface.hoveredCell = null;
    estadoDaInterface.candidatePosition = null;
    estadoDaInterface.pointerSession = null;
  }, { persistente: false });
}

function obterPosicaoDaCelulaPeloPonteiro(event) {
  const retangulo = sheetInventoryGrid.getBoundingClientRect();
  if (retangulo.width <= 0 || retangulo.height <= 0) return null;

  return {
    x: Math.floor(((event.clientX - retangulo.left) / retangulo.width) * CONFIGURACAO_DO_INVENTARIO.columns),
    y: Math.floor(((event.clientY - retangulo.top) / retangulo.height) * CONFIGURACAO_DO_INVENTARIO.rows)
  };
}

function definirPosicaoCandidata(posicao, opcoes = {}) {
  if (!posicao) return;
  inventoryUIState.candidatePosition = { x: posicao.x, y: posicao.y };
  inventoryUIState.hoveredCell = { x: posicao.x, y: posicao.y };

  const celulas = sheetInventoryCellLayer.querySelectorAll(".sheet-inventory-cell");
  celulas.forEach(function (celula) {
    const ehDestino = Number(celula.dataset.x) === posicao.x && Number(celula.dataset.y) === posicao.y;
    celula.tabIndex = ehDestino ? 0 : -1;
    if (ehDestino && opcoes.focar === true) celula.focus({ preventScroll: true });
  });
  atualizarFeedbackVisualDoPosicionamento();
}

function recalcularItemPendenteAposReorganizacao(inventario, estadoDaInterface) {
  if (!estadoDaInterface.pendingPlacement) return;
  const disponibilidade = dominioDoInventario.getInventoryPlacementAvailability(
    inventario,
    estadoDaInterface.pendingPlacement,
    { rotation: estadoDaInterface.pendingPlacement.rotacao }
  );

  if (disponibilidade.available) {
    estadoDaInterface.reorganizingForPending = false;
    estadoDaInterface.candidatePosition = {
      x: disponibilidade.position.x,
      y: disponibilidade.position.y
    };
  } else {
    estadoDaInterface.candidatePosition = null;
  }
}

function aplicarFeedbackDeAssentamento(itemId, opcoes = {}) {
  const botao = sheetInventoryItemLayer.querySelector(`[data-inventory-item-id="${CSS.escape(itemId)}"]`);
  if (!botao) return null;

  botao.classList.remove("is-settling");
  void botao.offsetWidth;
  botao.classList.add("is-settling");
  window.setTimeout(function () {
    botao.classList.remove("is-settling");
  }, DURACAO_DE_ENCAIXE_DO_INVENTARIO + 80);
  if (opcoes.focar !== false) botao.focus({ preventScroll: true });
  return botao;
}

function aplicarFeedbackDePosicaoRecusada() {
  const itemId = inventoryUIState.movingItemId || inventoryUIState.selectedItemId;
  const botao = itemId
    ? sheetInventoryItemLayer.querySelector(`[data-inventory-item-id="${CSS.escape(itemId)}"]`)
    : null;
  const alvo = botao || sheetInventoryPreviewLayer.querySelector(".sheet-inventory-preview-footprint");
  if (!alvo) return;
  alvo.classList.remove("is-invalid-return");
  void alvo.offsetWidth;
  alvo.classList.add("is-invalid-return");
  window.setTimeout(function () {
    alvo.classList.remove("is-invalid-return");
  }, DURACAO_DE_RETORNO_DO_INVENTARIO + 40);
}

function confirmarPosicionamentoAtual(opcoes = {}) {
  const item = obterItemEmPosicionamento();
  const resultado = avaliarPosicionamentoAtual();
  const posicao = inventoryUIState.candidatePosition;
  if (!item || !resultado || !posicao) return false;

  if (!resultado.valid) {
    sheetInventoryPlacementStatus.textContent = descreverResultadoDoPosicionamento(resultado);
    aplicarFeedbackDePosicaoRecusada();
    return false;
  }

  const estavaMovendo = Boolean(inventoryUIState.movingItemId);
  const itemId = item.id;
  if (
    estavaMovendo
    && item.posicao.x === posicao.x
    && item.posicao.y === posicao.y
  ) {
    cancelarMovimentoDoInventario();
    sheetInventoryPlacementStatus.textContent = "Movimento cancelado: o item já estava nessa posição.";
    return false;
  }
  executarMutacaoDoInventario(function (inventario, estadoDaInterface) {
    if (estavaMovendo) {
      const indice = inventario.findIndex(function (itemAtual) {
        return itemAtual.id === itemId;
      });
      if (indice < 0) return false;
      inventario[indice] = {
        ...inventario[indice],
        posicao: { x: posicao.x, y: posicao.y }
      };
      estadoDaInterface.movingItemId = null;
      estadoDaInterface.pointerSession = null;
      estadoDaInterface.hoveredCell = null;
      estadoDaInterface.candidatePosition = null;
      recalcularItemPendenteAposReorganizacao(inventario, estadoDaInterface);
      return true;
    }

    inventario.push({
      id: item.id,
      item: item.item,
      posicao: { x: posicao.x, y: posicao.y },
      rotacao: item.rotacao
    });
    estadoDaInterface.pendingPlacement = null;
    estadoDaInterface.reorganizingForPending = false;
    estadoDaInterface.selectedItemId = item.id;
    estadoDaInterface.hoveredCell = null;
    estadoDaInterface.candidatePosition = null;
    estadoDaInterface.pointerSession = null;
    return true;
  });

  aplicarFeedbackDeAssentamento(itemId, { focar: opcoes.focarItem !== false });
  return true;
}

function cancelarMovimentoDoInventario(opcoes = {}) {
  const itemId = inventoryUIState.movingItemId;
  if (!itemId) return;

  executarMutacaoDoInventario(function (_inventario, estadoDaInterface) {
    estadoDaInterface.movingItemId = null;
    estadoDaInterface.hoveredCell = null;
    estadoDaInterface.candidatePosition = null;
    estadoDaInterface.pointerSession = null;
  }, { persistente: false });

  if (opcoes.focarItem !== false) {
    const botao = sheetInventoryItemLayer.querySelector(`[data-inventory-item-id="${CSS.escape(itemId)}"]`);
    botao?.focus({ preventScroll: true });
  }
}

function iniciarModoExplicitoDeMovimento() {
  const item = obterItemDoInventarioPorId(inventoryUIState.selectedItemId);
  if (!item) return;
  if (inventoryUIState.movingItemId === item.id) {
    cancelarMovimentoDoInventario();
    return;
  }

  executarMutacaoDoInventario(function (_inventario, estadoDaInterface) {
    estadoDaInterface.movingItemId = item.id;
    estadoDaInterface.hoveredCell = { x: item.posicao.x, y: item.posicao.y };
    estadoDaInterface.candidatePosition = { x: item.posicao.x, y: item.posicao.y };
    estadoDaInterface.pointerSession = null;
  }, { persistente: false });

  const celulaInicial = sheetInventoryCellLayer.querySelector(
    `[data-x="${item.posicao.x}"][data-y="${item.posicao.y}"]`
  );
  celulaInicial?.focus({ preventScroll: true });
}

function girarItemAtivoDoInventario() {
  const item = obterItemEmPosicionamento() || obterItemDoInventarioPorId(inventoryUIState.selectedItemId);
  if (!item) return;
  const tamanho = item.item.tamanho;
  if (tamanho.largura === tamanho.altura) return;
  const novaRotacao = item.rotacao === 90 ? 0 : 90;

  if (inventoryUIState.pendingPlacement === item) {
    item.rotacao = novaRotacao;
    const disponibilidade = dominioDoInventario.getInventoryPlacementAvailability(personagem.inventario, item, { rotation: novaRotacao });
    inventoryUIState.candidatePosition = disponibilidade.available ? disponibilidade.position : null;
    renderizarInventario();
    return;
  }

  const resultado = dominioDoInventario.canPlaceItem(personagem.inventario, item, item.posicao, {
    rotation: novaRotacao,
    ignoreItemId: item.id
  });
  if (!resultado.valid) {
    sheetInventoryPlacementStatus.textContent = "Não há espaço para girar esta peça aqui. Mova-a para uma área livre e tente novamente.";
    aplicarFeedbackDePosicaoRecusada();
    return;
  }
  executarMutacaoDoInventario(function () {
    item.rotacao = novaRotacao;
    return true;
  });
  aplicarFeedbackDeAssentamento(item.id);
}

function equiparArmaduraSelecionada() {
  const item = obterItemDoInventarioPorId(inventoryUIState.selectedItemId);
  if (!item || (item.item.tipo !== "armadura" && item.item.equipavelEm !== "armadura")) return;
  if (personagem.equipamentos.armadura) {
    sheetInventoryPlacementStatus.textContent = "Desequipe a armadura atual antes de vestir outra.";
    return;
  }
  executarMutacaoDoInventario(function (inventario, estadoDaInterface) {
    const indice = inventario.findIndex(function (entrada) { return entrada.id === item.id; });
    if (indice < 0) return false;
    personagem.equipamentos.armadura = inventario.splice(indice, 1)[0];
    estadoDaInterface.selectedItemId = null;
    return true;
  });
  sheetInventoryPlacementStatus.textContent = `${item.item.nome} equipada.`;
}

function desequiparArmadura() {
  const armadura = personagem.equipamentos?.armadura;
  if (!armadura) return;
  const disponibilidade = dominioDoInventario.getInventoryPlacementAvailability(personagem.inventario, armadura, { rotation: armadura.rotacao });
  if (!disponibilidade.available) {
    sheetInventoryPlacementStatus.textContent = "Não há espaço na mochila para guardar a armadura equipada.";
    return;
  }
  executarMutacaoDoInventario(function (inventario, estadoDaInterface) {
    armadura.posicao = disponibilidade.position;
    inventario.push(armadura);
    personagem.equipamentos.armadura = null;
    estadoDaInterface.selectedItemId = armadura.id;
    return true;
  });
  aplicarFeedbackDeAssentamento(armadura.id);
}

function iniciarArrasteDeItem(event) {
  if (event.button !== 0 || !event.isPrimary) return;
  const botao = event.target.closest("button[data-inventory-item-id]");
  if (!botao) return;
  const item = obterItemDoInventarioPorId(botao.dataset.inventoryItemId);
  if (!item) return;
  if (inventoryUIState.movingItemId && inventoryUIState.movingItemId !== item.id) return;

  const celulaDoPonteiro = obterPosicaoDaCelulaPeloPonteiro(event);
  if (!celulaDoPonteiro) return;
  inventoryUIState.selectedItemId = item.id;
  inventoryUIState.movingItemId = item.id;
  inventoryUIState.candidatePosition = { x: item.posicao.x, y: item.posicao.y };
  inventoryUIState.pointerSession = {
    pointerId: event.pointerId,
    itemId: item.id,
    origin: { x: item.posicao.x, y: item.posicao.y },
    offset: {
      x: celulaDoPonteiro.x - item.posicao.x,
      y: celulaDoPonteiro.y - item.posicao.y
    },
    pointerOffset: {
      x: event.clientX - botao.getBoundingClientRect().left,
      y: event.clientY - botao.getBoundingClientRect().top
    },
    originRect: botao.getBoundingClientRect(),
    startPointer: { x: event.clientX, y: event.clientY },
    latestPointer: { x: event.clientX, y: event.clientY },
    renderedPointer: { x: event.clientX, y: event.clientY },
    tilt: 0,
    proxy: null,
    animationFrame: 0,
    moved: false
  };
  botao.setPointerCapture(event.pointerId);
  atualizarFeedbackVisualDoPosicionamento();
  event.preventDefault();
}

function iniciarArrasteDeItemRecebido(event) {
  if (event.button !== 0 || !event.isPrimary || !inventoryUIState.pendingPlacement) return;
  const cartao = event.target.closest(".sheet-inventory-received__card");
  if (!cartao) return;
  const retangulo = cartao.getBoundingClientRect();
  const dimensoes = dominioDoInventario.getEffectiveDimensions(inventoryUIState.pendingPlacement, inventoryUIState.pendingPlacement.rotacao);
  inventoryUIState.candidatePosition = null;
  inventoryUIState.pointerSession = {
    pointerId: event.pointerId,
    itemId: inventoryUIState.pendingPlacement.id,
    source: "received",
    origin: null,
    offset: { x: Math.floor(dimensoes.largura / 2), y: Math.floor(dimensoes.altura / 2) },
    pointerOffset: { x: Math.min(event.clientX - retangulo.left, retangulo.width / 2), y: Math.min(event.clientY - retangulo.top, retangulo.height / 2) },
    originRect: retangulo,
    startPointer: { x: event.clientX, y: event.clientY },
    latestPointer: { x: event.clientX, y: event.clientY },
    renderedPointer: { x: event.clientX, y: event.clientY },
    tilt: 0,
    proxy: null,
    animationFrame: 0,
    moved: false
  };
  cartao.setPointerCapture(event.pointerId);
  event.preventDefault();
}

function criarProxyVisualDoArraste(sessao) {
  const origem = sessao.source === "received"
    ? sheetInventoryReceived.querySelector(".sheet-inventory-received__card")
    : sheetInventoryItemLayer.querySelector(`[data-inventory-item-id="${CSS.escape(sessao.itemId)}"]`);
  if (!origem) return null;

  let proxy;
  if (sessao.source === "received") {
    const item = inventoryUIState.pendingPlacement;
    const dimensoes = dominioDoInventario.getEffectiveDimensions(item, item.rotacao);
    proxy = criarBotaoDeItemDoInventario({ ...item, posicao: { x: 0, y: 0 } });
    const gridRect = sheetInventoryGrid.getBoundingClientRect();
    sessao.originRect = origem.getBoundingClientRect();
    proxy.style.width = `${(gridRect.width / CONFIGURACAO_DO_INVENTARIO.columns) * dimensoes.largura}px`;
    proxy.style.height = `${(gridRect.height / CONFIGURACAO_DO_INVENTARIO.rows) * dimensoes.altura}px`;
  } else {
    proxy = origem.cloneNode(true);
    proxy.style.width = `${sessao.originRect.width}px`;
    proxy.style.height = `${sessao.originRect.height}px`;
  }
  proxy.removeAttribute("id");
  proxy.removeAttribute("aria-controls");
  proxy.removeAttribute("aria-pressed");
  proxy.removeAttribute("aria-label");
  proxy.removeAttribute("tabindex");
  proxy.setAttribute("aria-hidden", "true");
  proxy.classList.remove("is-selected", "is-dragging", "is-settling", "is-invalid-return");
  proxy.classList.add("sheet-inventory-drag-proxy");
  proxy.style.setProperty("--drag-x", `${sessao.originRect.left}px`);
  proxy.style.setProperty("--drag-y", `${sessao.originRect.top}px`);
  proxy.style.setProperty("--drag-tilt", "0deg");
  document.body.append(proxy);

  origem.classList.add("is-drag-origin");
  sheetInventoryGrid.classList.add("is-dragging-item");
  sessao.proxy = proxy;
  return proxy;
}

function desenharProxyDoArraste(sessao) {
  sessao.animationFrame = 0;
  if (!sessao.proxy) return;

  const deltaX = sessao.latestPointer.x - sessao.renderedPointer.x;
  const inclinacaoAlvo = Math.max(-0.45, Math.min(0.45, deltaX * 0.055));
  sessao.tilt += (inclinacaoAlvo - sessao.tilt) * 0.46;
  sessao.renderedPointer = { ...sessao.latestPointer };
  sessao.proxy.style.setProperty("--drag-x", `${sessao.latestPointer.x - sessao.pointerOffset.x}px`);
  sessao.proxy.style.setProperty("--drag-y", `${sessao.latestPointer.y - sessao.pointerOffset.y}px`);
  sessao.proxy.style.setProperty("--drag-tilt", `${sessao.tilt.toFixed(3)}deg`);
}

function agendarDesenhoDoProxy(sessao, event) {
  sessao.latestPointer = { x: event.clientX, y: event.clientY };
  if (sessao.animationFrame) return;
  sessao.animationFrame = window.requestAnimationFrame(function () {
    desenharProxyDoArraste(sessao);
  });
}

function atualizarArrasteDeItem(event) {
  const sessao = inventoryUIState.pointerSession;
  if (!sessao || sessao.pointerId !== event.pointerId) return;
  const distancia = Math.hypot(
    event.clientX - sessao.startPointer.x,
    event.clientY - sessao.startPointer.y
  );
  if (!sessao.moved && distancia < LIMIAR_DE_ARRASTE_DO_INVENTARIO) return;
  if (!sessao.moved) {
    sessao.moved = true;
    criarProxyVisualDoArraste(sessao);
  }
  agendarDesenhoDoProxy(sessao, event);
  const celula = obterPosicaoDaCelulaPeloPonteiro(event);
  if (!celula) return;
  const candidata = {
    x: celula.x - sessao.offset.x,
    y: celula.y - sessao.offset.y
  };
  definirPosicaoCandidata(candidata);
  event.preventDefault();
}

function removerProxyDoInventario(sessao) {
  if (sessao.animationFrame) window.cancelAnimationFrame(sessao.animationFrame);
  sessao.animationFrame = 0;
  sessao.proxy?.remove();
  sessao.proxy = null;
  document.querySelectorAll(".sheet-inventory-item.is-drag-origin, .sheet-inventory-received__card.is-drag-origin").forEach(function (elemento) {
    elemento.classList.remove("is-drag-origin");
  });
  sheetInventoryGrid.classList.remove("is-dragging-item");
}

function animarProxyAteRetangulo(sessao, retangulo, tipo) {
  const proxy = sessao.proxy;
  if (!proxy || !retangulo) {
    removerProxyDoInventario(sessao);
    return;
  }

  if (sessao.animationFrame) {
    window.cancelAnimationFrame(sessao.animationFrame);
    desenharProxyDoArraste(sessao);
  }
  proxy.classList.add(tipo === "retorno" ? "is-returning" : "is-dropping");
  proxy.style.setProperty("--drag-target-x", `${retangulo.left}px`);
  proxy.style.setProperty("--drag-target-y", `${retangulo.top}px`);
  proxy.style.setProperty("--drag-recoil-x", `${sessao.latestPointer.x >= sessao.startPointer.x ? 5 : -5}px`);
  window.setTimeout(function () {
    removerProxyDoInventario(sessao);
  }, tipo === "retorno" ? DURACAO_DE_RETORNO_DO_INVENTARIO + 24 : DURACAO_DE_ENCAIXE_DO_INVENTARIO + 24);
}

function encerrarArrasteDeItem(event, cancelado) {
  const sessao = inventoryUIState.pointerSession;
  if (!sessao || sessao.pointerId !== event.pointerId) return;
  const deveConfirmar = !cancelado && sessao.moved && avaliarPosicionamentoAtual()?.valid === true;
  inventoryUIState.pointerSession = null;

  if (deveConfirmar) {
    confirmarPosicionamentoAtual({ focarItem: false });
    const destino = sheetInventoryItemLayer.querySelector(
      `[data-inventory-item-id="${CSS.escape(sessao.itemId)}"]`
    );
    animarProxyAteRetangulo(sessao, destino?.getBoundingClientRect(), "encaixe");
    destino?.focus({ preventScroll: true });
  } else {
    const houveMovimento = sessao.moved;
    cancelarMovimentoDoInventario({ focarItem: false });
    if (houveMovimento && !cancelado) {
      sheetInventoryPlacementStatus.textContent = "Movimento recusado. O item permaneceu na posição anterior.";
    }
    if (houveMovimento) {
      animarProxyAteRetangulo(sessao, sessao.originRect, "retorno");
      aplicarFeedbackDePosicaoRecusada();
      window.setTimeout(function () {
        const origem = sheetInventoryItemLayer.querySelector(
          `[data-inventory-item-id="${CSS.escape(sessao.itemId)}"]`
        );
        origem?.focus({ preventScroll: true });
      }, DURACAO_DE_RETORNO_DO_INVENTARIO);
    } else {
      removerProxyDoInventario(sessao);
    }
  }
  event.preventDefault();
}

function abrirConfirmacaoDeDescarte() {
  const item = obterItemDoInventarioPorId(inventoryUIState.selectedItemId);
  if (!item) return;
  inventoryUIState.discardingItemId = item.id;
  inventoryDiscardDescription.textContent = `Descartar ${item.item.nome}? Este item será removido da ficha.`;
  inventoryDiscardDialog.showModal();
  inventoryDiscardCancel.focus({ preventScroll: true });
}

function cancelarDescarteDoInventario() {
  inventoryUIState.discardingItemId = null;
  inventoryDiscardDialog.close();
  sheetDiscardItem.focus({ preventScroll: true });
}

function confirmarDescarteDoInventario() {
  const itemId = inventoryUIState.discardingItemId;
  if (!itemId) return;
  inventoryDiscardDialog.close();
  executarMutacaoDoInventario(function (inventario, estadoDaInterface) {
    const indice = inventario.findIndex(function (item) {
      return item.id === itemId;
    });
    if (indice < 0) return false;
    inventario.splice(indice, 1);
    estadoDaInterface.discardingItemId = null;
    estadoDaInterface.selectedItemId = null;
    estadoDaInterface.movingItemId = null;
    estadoDaInterface.pointerSession = null;
    recalcularItemPendenteAposReorganizacao(inventario, estadoDaInterface);
    return true;
  });
  sheetImportItem.focus({ preventScroll: true });
}

function renderizarFicha() {
  renderizarIdentidadeDaFicha();
  renderizarCombateDaFicha();
  renderizarRecursosDaFicha();
  renderizarAtributosDaFicha();
  renderizarPericiasDaFicha();
  renderizarHabilidadesDaFicha();
  renderizarInventario();
  renderizarVulnerabilidadeDaFicha();
  renderizarEstadoDeSalvamento();
}

function exibirFicha() {
  sheetSaveStatus.textContent = "";
  document.body.classList.add("sheet-is-open");
  creationView.hidden = true;
  landingView.hidden = true;
  characterSheetScreen.hidden = false;
  ativarSecaoDaFicha("summary");
  characterSheetTitle.focus();
}

function abrirFicha() {
  if (!validarAtributosEPericias()) return;

  if (fichaSalvaNaSessao === null) resetarSnapshotsDosAtributosDaFicha();
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

    const versao = dados.versao === undefined || dados.versao === null
      ? 1
      : dados.versao;
    if (typeof versao === "number" && Number.isInteger(versao) && versao > 2) {
      throw new Error("Esta ficha foi criada em uma versão mais recente do Grimório RPG.");
    }

    if (typeof versao !== "number" || !Number.isInteger(versao) || (versao !== 1 && versao !== 2)) {
      throw new Error("A versão desta ficha não é compatível com o Grimório RPG.");
    }

    if (!ehObjetoDeDados(dados.personagem)) {
      throw new Error("O arquivo JSON não contém os dados da ficha.");
    }

    if (!ehObjetoDeDados(dados.personagem.atributos) || !ehObjetoDeDados(dados.personagem.pericias)) {
      throw new Error("O JSON não possui os dados necessários de uma ficha de personagem.");
    }

    return {
      personagem: dados.personagem,
      versao
    };
  }

  const dadosDoPersonagem = dados;

  if (!ehObjetoDeDados(dadosDoPersonagem.atributos) || !ehObjetoDeDados(dadosDoPersonagem.pericias)) {
    throw new Error("O JSON não possui os dados necessários de uma ficha de personagem.");
  }

  return {
    personagem: dadosDoPersonagem,
    versao: 1
  };
}

function aplicarPersonagemImportado(dadosImportados, versaoDaFicha) {
  const dadosNormalizados = JSON.parse(JSON.stringify(MODELO_PERSONAGEM));

  Object.keys(dadosNormalizados).forEach(function (campo) {
    if (!Object.prototype.hasOwnProperty.call(dadosImportados, campo)) return;

    const valorPadrao = dadosNormalizados[campo];
    const valorImportado = dadosImportados[campo];

    if (Array.isArray(valorPadrao)) {
      if (campo === "inventario") {
        dadosNormalizados[campo] = JSON.parse(JSON.stringify(valorImportado));
        return;
      }

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

  prepararDadosIniciaisDaFicha(dadosNormalizados, versaoDaFicha);

  Object.keys(personagem).forEach(function (campo) {
    delete personagem[campo];
  });
  Object.assign(personagem, dadosNormalizados);
  resetarEstadoTransitorioDoInventario();
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
    const fichaImportada = obterPersonagemDoArquivo(dados);

    aplicarPersonagemImportado(fichaImportada.personagem, fichaImportada.versao);
    resetarSnapshotsDosAtributosDaFicha();
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

  if (["summary", "abilities", "inventory"].includes(button.dataset.sheetSection)) {
    ativarSecaoDaFicha(button.dataset.sheetSection);
    return;
  }

  mostrarMensagemDaFicha("Esta seção ainda está em desenvolvimento.");
});
sheetOpenAbilities.addEventListener("click", function () {
  ativarSecaoDaFicha("abilities");
});
sheetOpenInventory.addEventListener("click", function () {
  ativarSecaoDaFicha("inventory");
});
sheetImportItem.addEventListener("click", abrirSeletorDeItemDoInventario);
sheetItemFile.addEventListener("change", importarArquivoDeItem);
sheetReorganizeForItem.addEventListener("click", reorganizarMochilaParaItemPendente);
sheetRotatePendingItem.addEventListener("click", girarItemAtivoDoInventario);
sheetDiscardPendingItem.addEventListener("click", descartarItemImportado);
sheetCancelItemImport.addEventListener("click", cancelarImportacaoDeItem);
sheetInventoryItemLayer.addEventListener("click", function (event) {
  const button = event.target.closest("button[data-inventory-item-id]");
  if (!button) return;
  if (inventoryUIState.movingItemId && inventoryUIState.movingItemId !== button.dataset.inventoryItemId) {
    sheetInventoryPlacementStatus.textContent = "Conclua ou cancele o movimento atual antes de selecionar outro item.";
    return;
  }

  executarMutacaoDoInventario(function (_inventario, estadoDaInterface) {
    estadoDaInterface.selectedItemId = button.dataset.inventoryItemId;
  }, { persistente: false });
});
sheetMoveItem.addEventListener("click", iniciarModoExplicitoDeMovimento);
sheetRotateItem.addEventListener("click", girarItemAtivoDoInventario);
sheetEquipItem.addEventListener("click", equiparArmaduraSelecionada);
sheetInventoryArmorSlot.addEventListener("click", desequiparArmadura);
sheetDiscardItem.addEventListener("click", abrirConfirmacaoDeDescarte);
sheetInventoryMobileNav.addEventListener("click", function (event) {
  const botao = event.target.closest("button[data-inventory-mobile-view]");
  if (!botao) return;
  const alvo = botao.dataset.inventoryMobileView;
  sheetInventoryView.dataset.mobileView = alvo;
  sheetInventoryMobileNav.querySelectorAll("button").forEach(function (item) {
    const ativo = item === botao;
    item.classList.toggle("is-active", ativo);
    item.setAttribute("aria-pressed", String(ativo));
  });
});
inventoryDiscardCancel.addEventListener("click", cancelarDescarteDoInventario);
inventoryDiscardConfirm.addEventListener("click", confirmarDescarteDoInventario);
inventoryDiscardDialog.addEventListener("cancel", function (event) {
  event.preventDefault();
  cancelarDescarteDoInventario();
});
sheetInventoryItemLayer.addEventListener("pointerdown", iniciarArrasteDeItem);
sheetInventoryItemLayer.addEventListener("pointermove", atualizarArrasteDeItem);
sheetInventoryItemLayer.addEventListener("pointerup", function (event) {
  encerrarArrasteDeItem(event, false);
});
sheetInventoryItemLayer.addEventListener("pointercancel", function (event) {
  encerrarArrasteDeItem(event, true);
});
sheetInventoryReceived.addEventListener("pointerdown", iniciarArrasteDeItemRecebido);
sheetInventoryReceived.addEventListener("pointermove", atualizarArrasteDeItem);
sheetInventoryReceived.addEventListener("pointerup", function (event) {
  encerrarArrasteDeItem(event, false);
});
sheetInventoryReceived.addEventListener("pointercancel", function (event) {
  encerrarArrasteDeItem(event, true);
});
sheetInventoryGrid.addEventListener("pointermove", function (event) {
  if (inventoryUIState.pointerSession || !obterItemEmPosicionamento()) return;
  const celula = obterPosicaoDaCelulaPeloPonteiro(event);
  if (celula) definirPosicaoCandidata(celula);
});
sheetInventoryCellLayer.addEventListener("click", function (event) {
  const celula = event.target.closest("button[data-x][data-y]");
  if (!celula || !obterItemEmPosicionamento()) return;
  definirPosicaoCandidata({ x: Number(celula.dataset.x), y: Number(celula.dataset.y) });
  confirmarPosicionamentoAtual();
});
sheetInventoryCellLayer.addEventListener("keydown", function (event) {
  const celula = event.target.closest("button[data-x][data-y]");
  if (!celula || !obterItemEmPosicionamento()) return;

  if (event.key === "Escape") {
    event.preventDefault();
    if (inventoryUIState.movingItemId) cancelarMovimentoDoInventario();
    else cancelarImportacaoDeItem();
    return;
  }
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    definirPosicaoCandidata({ x: Number(celula.dataset.x), y: Number(celula.dataset.y) });
    confirmarPosicionamentoAtual();
    return;
  }
  if (event.key.toLowerCase() === "r") {
    event.preventDefault();
    girarItemAtivoDoInventario();
    return;
  }

  const deslocamentos = {
    ArrowLeft: { x: -1, y: 0 },
    ArrowRight: { x: 1, y: 0 },
    ArrowUp: { x: 0, y: -1 },
    ArrowDown: { x: 0, y: 1 }
  };
  const deslocamento = deslocamentos[event.key];
  if (!deslocamento) return;
  event.preventDefault();
  definirPosicaoCandidata({
    x: Math.max(0, Math.min(CONFIGURACAO_DO_INVENTARIO.columns - 1, Number(celula.dataset.x) + deslocamento.x)),
    y: Math.max(0, Math.min(CONFIGURACAO_DO_INVENTARIO.rows - 1, Number(celula.dataset.y) + deslocamento.y))
  }, { focar: true });
});
sheetAbilitiesSummary.addEventListener("click", function (event) {
  const button = event.target.closest("button[data-ability-id]");
  if (button) ativarSecaoDaFicha("abilities", button.dataset.abilityId);
});
sheetAbilityList.addEventListener("click", function (event) {
  const button = event.target.closest("button[data-ability-id]");
  if (!button) return;
  habilidadeSelecionadaId = button.dataset.abilityId;
  renderizarListaDeHabilidades();
});
sheetAbilityDetails.addEventListener("click", function (event) {
  const button = event.target.closest("button[data-ability-action]");
  if (!button) return;

  const action = button.dataset.abilityAction;
  button.closest("details")?.removeAttribute("open");
  if (action === "decrease-uses") alterarUsosDaHabilidade(habilidadeSelecionadaId, -1);
  if (action === "increase-uses") alterarUsosDaHabilidade(habilidadeSelecionadaId, 1);
  if (action === "decrease-cooldown") alterarRecargaDaHabilidade(habilidadeSelecionadaId, -1);
  if (action === "increase-cooldown") alterarRecargaDaHabilidade(habilidadeSelecionadaId, 1);
  if (action === "change-icon") {
    const habilidade = encontrarHabilidade(habilidadeSelecionadaId);
    if (habilidade) abrirDialogDeIcone(habilidade, "icone");
  }
  if (action === "remove") solicitarRemocaoDaHabilidade();
});
sheetAbilitySearch.addEventListener("input", function () {
  buscaHabilidade = sheetAbilitySearch.value;
  renderizarListaDeHabilidades();
});
sheetAbilityTypeFilter.addEventListener("change", function () {
  filtroTipoHabilidade = sheetAbilityTypeFilter.value;
  renderizarListaDeHabilidades();
});
sheetAbilityStateFilter.addEventListener("change", function () {
  filtroEstadoHabilidade = sheetAbilityStateFilter.value;
  renderizarListaDeHabilidades();
});
sheetImportAbility.addEventListener("click", function () {
  sheetAbilityFile.value = "";
  sheetAbilityFile.click();
});
sheetAbilityFile.addEventListener("change", importarArquivoDeHabilidade);
abilityIconOptions.addEventListener("change", function (event) {
  if (event.target.matches('input[name="ability-icon"]')) {
    iconeHabilidadePendente = event.target.value;
  }
});
abilityImportCancel.addEventListener("click", function () {
  abilityImportDialog.close();
  habilidadePendente = null;
});
abilityImportConfirm.addEventListener("click", confirmarDialogDeHabilidade);
abilityRemoveCancel.addEventListener("click", function () {
  abilityRemoveDialog.close();
});
abilityRemoveConfirm.addEventListener("click", removerHabilidadeSelecionada);
sheetLifeMinus.addEventListener("click", function () { alterarVidaAtual(-1); });
sheetLifePlus.addEventListener("click", function () { alterarVidaAtual(1); });
sheetLifeCurrent.addEventListener("blur", function () {
  definirVidaAtual(sheetLifeCurrent.value);
});
sheetManaMinus.addEventListener("click", function () { alterarManaAtual(-1); });
sheetManaPlus.addEventListener("click", function () { alterarManaAtual(1); });
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
portraitCropRange.addEventListener("input", function () {
  definirZoomDoRecorte(portraitCropRange.value);
});
portraitCropCanvas.addEventListener("pointerdown", iniciarArrasteDoRecorte);
portraitCropCanvas.addEventListener("pointermove", arrastarRecorte);
portraitCropCanvas.addEventListener("pointerup", encerrarArrasteDoRecorte);
portraitCropCanvas.addEventListener("pointercancel", encerrarArrasteDoRecorte);
portraitCropCanvas.addEventListener("keydown", controlarRecortePeloTeclado);
portraitCropCancel.addEventListener("click", fecharEditorDeRecorte);
portraitCropApply.addEventListener("click", aplicarRecorteDoRetrato);
portraitCropDialog.addEventListener("close", function () {
  document.body.classList.remove("portrait-crop-is-open");
  estadoDoRecorteDoRetrato = null;
  ponteiroDoRecorteDoRetrato = null;
  portraitCropCanvas.classList.remove("is-dragging");
});
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
