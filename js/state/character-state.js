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
  inventarioStaging: null,
  economia: { ouro: 0, prata: 0 },
  capacidadeInventario: { pesoMaximo: null },
  equipamentos: {
    armadura: null,
    maoPrincipal: null,
    maoSecundaria: null
  }
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
const inventoryUIState = window.GrimorioUIState.createInventoryUIState();
const inventoryDrag = window.GrimorioUIState.createInventoryDragState();

const imagensDeItemComFalha = new Set();

const SIMBOLOS_DE_TIPO_DE_ITEM = Object.freeze({
  consumivel: "\u2697",
  arma: "\u2694",
  armadura: "\u2b21",
  equipamento: "\u2699",
  ferramenta: "\u2692",
  material: "\u25c8",
  outro: "\u2726"
});
const LIMIAR_DE_ARRASTE_DO_INVENTARIO = window.GrimorioInventoryMotion.config.dragThreshold;
let inventoryClickSuppressedUntil = 0;

const CONFIGURACAO_RETRATO = Object.freeze({
  larguraFinal: 640,
  alturaFinal: 800,
  tamanhoMaximoArquivo: 12 * 1024 * 1024,
  qualidadeWebp: 0.88,
  zoomMaximo: 3
});

let etapaAtual = 1;
