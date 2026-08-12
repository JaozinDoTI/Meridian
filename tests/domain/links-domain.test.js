import assert from "node:assert/strict";
import test from "node:test";

await import("../../js/domain/links.js");
const links = globalThis.GrimorioLinksDomain;

test("expõe um namespace congelado com os limites canônicos", function () {
  assert.equal(Object.isFrozen(links), true);
  assert.equal(Object.isFrozen(links.LIMITES), true);
  assert.deepEqual(links.LIMITES, {
    id: 120,
    nome: 100,
    subtitulo: 120,
    descricao: 5000,
    imagem: 1500000
  });
  assert.equal(typeof links.LinksDomainError, "function");
  assert.equal(typeof links.criarIdVinculo, "function");
});

test("normaliza o schema canônico e aplica pessoa como tipo padrão", function () {
  const result = links.normalizarVinculo({
    nome: "  Capitã Maelis  ",
    subtitulo: "  Aliada improvável  ",
    descricao: "  Comanda a guarda.  ",
    imagem: "  ./assets/maelis.webp  ",
    propriedadeExtra: "ignorada"
  }, { criarId: function () { return "vinculo-1"; } });

  assert.deepEqual(result, {
    id: "vinculo-1",
    tipo: "pessoa",
    nome: "Capitã Maelis",
    subtitulo: "Aliada improvável",
    descricao: "Comanda a guarda.",
    imagem: "./assets/maelis.webp"
  });
});

test("aceita somente os quatro tipos canônicos", function () {
  for (const tipo of ["pessoa", "lugar", "evento", "objeto"]) {
    const result = links.normalizarVinculo({ tipo, nome: "Teste" }, {
      criarId: function () { return "id-" + tipo; }
    });
    assert.equal(result.tipo, tipo);
  }

  assert.throws(
    function () { links.normalizarVinculo({ tipo: "criatura", nome: "Teste" }); },
    /tipo.*pessoa.*lugar.*evento.*objeto/i
  );
});

test("valida nome obrigatório e os limites de todos os textos", function () {
  assert.throws(function () { links.normalizarVinculo({ nome: "   " }); }, /nome.*obrigatório/i);
  assert.throws(function () { links.normalizarVinculo({ nome: "n".repeat(101) }); }, /nome.*100/i);
  assert.throws(function () {
    links.normalizarVinculo({ nome: "Nome", subtitulo: "s".repeat(121) });
  }, /subtítulo.*120/i);
  assert.throws(function () {
    links.normalizarVinculo({ nome: "Nome", descricao: "d".repeat(5001) });
  }, /descrição.*5000/i);

  const maxima = links.normalizarVinculo({
    nome: "n".repeat(100),
    subtitulo: "s".repeat(120),
    descricao: "d".repeat(5000)
  }, { criarId: function () { return "limites"; } });
  assert.equal(maxima.nome.length, 100);
  assert.equal(maxima.subtitulo.length, 120);
  assert.equal(maxima.descricao.length, 5000);
});

test("aceita imagens incorporadas raster e caminhos locais ou relativos", function () {
  const imagens = [
    "data:image/png;base64,AAAA",
    "data:image/jpeg;base64,AAAA",
    "data:image/webp;base64,AAAA",
    "assets/retrato.png",
    "./assets/retrato.webp",
    "../retratos/retrato.jpeg",
    "/assets/retrato.png"
  ];

  imagens.forEach(function (imagem, indice) {
    const result = links.normalizarVinculo({ nome: "Imagem", imagem }, {
      criarId: function () { return "imagem-" + indice; }
    });
    assert.equal(result.imagem, imagem);
  });
});

test("rejeita protocolos, caminhos de rede, SVG e HTML em imagens", function () {
  const imagensInseguras = [
    "https://example.com/retrato.png",
    "http://example.com/retrato.png",
    "javascript:alert(1)",
    "blob:https://example.com/id",
    "//cdn.example.com/retrato.png",
    "data:image/svg+xml;base64,PHN2Zz4=",
    "data:text/html;base64,PGgxPk9pPC9oMT4=",
    "assets/retrato.svg",
    "assets/pagina.html",
    "<svg onload=alert(1)></svg>",
    "<img src=x onerror=alert(1)>"
  ];

  imagensInseguras.forEach(function (imagem) {
    assert.throws(
      function () { links.normalizarVinculo({ nome: "Imagem", imagem }); },
      /imagem.*(?:segura|local|PNG|JPEG|WebP)/i,
      imagem
    );
  });
});

test("rejeita imagem acima de 1.500.000 caracteres", function () {
  assert.throws(function () {
    links.normalizarVinculo({ nome: "Imagem", imagem: "a".repeat(1500001) });
  }, /imagem.*1500000/i);
});

test("a normalização individual gera ID novo e não confia no ID recebido", function () {
  const result = links.normalizarVinculo({ id: "id-importado", nome: "Oráculo" }, {
    criarId: function () { return "id-interno"; }
  });

  assert.equal(result.id, "id-interno");
});

test("a coleção preserva o primeiro ID válido e regenera ausentes ou duplicados", function () {
  const ids = ["id-regenerado-1", "id-regenerado-2"];
  const result = links.normalizarColecaoVinculos([
    { id: "  id-estavel  ", tipo: "pessoa", nome: "Primeiro" },
    { id: "id-estavel", tipo: "lugar", nome: "Duplicado" },
    { tipo: "evento", nome: "Sem ID" }
  ], {
    criarId: function () { return ids.shift(); }
  });

  assert.deepEqual(result.map(function (vinculo) { return vinculo.id; }), [
    "id-estavel",
    "id-regenerado-1",
    "id-regenerado-2"
  ]);
});

test("considera válido apenas ID textual não vazio com até 120 caracteres", function () {
  const result = links.normalizarColecaoVinculos([
    { id: "x".repeat(120), nome: "Máximo" },
    { id: "x".repeat(121), nome: "Longo" },
    { id: "   ", nome: "Vazio" }
  ], {
    criarId: (function () {
      let sequencia = 0;
      return function () {
        sequencia += 1;
        return "novo-" + sequencia;
      };
    })()
  });

  assert.equal(result[0].id.length, 120);
  assert.deepEqual(result.slice(1).map(function (item) { return item.id; }), ["novo-1", "novo-2"]);
});

test("aceita coleção ausente, mas rejeita coleção presente não-array e entrada sem nome", function () {
  assert.deepEqual(links.normalizarColecaoVinculos(undefined), []);
  assert.throws(function () { links.normalizarColecaoVinculos({}); }, /coleção.*lista|lista.*coleção/i);
  assert.throws(function () {
    links.normalizarColecaoVinculos([{ tipo: "pessoa" }]);
  }, /nome.*obrigatório/i);
});

test("cria envelope individual canônico sem ID ou propriedades extras", function () {
  const envelope = links.criarEnvelopeVinculo({
    id: "privado",
    type: "lugar",
    name: "  Torre Silente  ",
    subtitle: "  Ruína arcana  ",
    description: "  Evitada pelos viajantes.  ",
    image: "assets/torre.webp",
    extra: true
  });

  assert.deepEqual(envelope, {
    tipo: "grimorio-vinculo",
    schemaVersion: 1,
    vinculo: {
      tipo: "lugar",
      nome: "Torre Silente",
      subtitulo: "Ruína arcana",
      descricao: "Evitada pelos viajantes.",
      imagem: "assets/torre.webp"
    }
  });
  assert.deepEqual(Object.keys(envelope), ["tipo", "schemaVersion", "vinculo"]);
  assert.deepEqual(Object.keys(envelope.vinculo), ["tipo", "nome", "subtitulo", "descricao", "imagem"]);
});

test("lê apenas aliases explícitos e sempre atribui um ID interno novo", function () {
  const result = links.lerEnvelopeVinculo({
    type: "grimorio-vinculo",
    versao: 1,
    link: {
      id: "id-do-arquivo",
      type: "evento",
      name: "  Eclipse Rubro  ",
      subtitle: "  Presságio  ",
      description: "  O céu escureceu.  ",
      image: "./assets/eclipse.png",
      unknown: "ignorado"
    },
    id: "também-ignorado",
    extra: true
  }, {
    criarId: function () { return "id-receptor"; },
    preservarId: true
  });

  assert.deepEqual(result, {
    id: "id-receptor",
    tipo: "evento",
    nome: "Eclipse Rubro",
    subtitulo: "Presságio",
    descricao: "O céu escureceu.",
    imagem: "./assets/eclipse.png"
  });
});

test("rejeita versão futura, tipo errado e estruturas inválidas do envelope", function () {
  assert.throws(function () { links.lerEnvelopeVinculo(null); }, /envelope.*objeto/i);
  assert.throws(function () {
    links.lerEnvelopeVinculo({ tipo: "grimorio-item", schemaVersion: 1, vinculo: { nome: "Item" } });
  }, /tipo.*grimorio-vinculo/i);
  assert.throws(function () {
    links.lerEnvelopeVinculo({ tipo: "grimorio-vinculo", schemaVersion: 2, vinculo: { nome: "Futuro" } });
  }, /versão.*(?:futura|compatível)/i);
  assert.throws(function () {
    links.lerEnvelopeVinculo({ tipo: "grimorio-vinculo", schemaVersion: 1, vinculo: [] });
  }, /vínculo.*objeto/i);
  assert.throws(function () {
    links.lerEnvelopeVinculo({ tipo: "grimorio-vinculo", schemaVersion: 1, vinculo: {} });
  }, /nome.*obrigatório/i);
});
