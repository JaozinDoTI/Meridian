import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

test("carrega bootstrap e responsabilidades JavaScript fora da raiz", async function () {
  const [html, app, characterState, creation, abilities, inventory, summary] = await Promise.all([
    read("index.html"),
    read("js/app.js"),
    read("js/state/character-state.js"),
    read("js/controllers/creation-controller.js"),
    read("js/controllers/abilities-controller.js"),
    read("js/controllers/inventory-controller.js"),
    read("js/ui/sheet-summary-view.js")
  ]);

  assert.doesNotMatch(html, /src="\.\/script\.js"/);
  assert.doesNotMatch(html, /src="\.\/(?:inventory-domain|attribute-motion|motion-enhancements)\.js"/);
  assert.match(html, /src="\.\/js\/app\.js"/);
  assert.match(app, /addEventListener/);
  assert.doesNotMatch(app, /^(?:async\s+)?function\s+/m);
  assert.match(characterState, /const personagem\s*=/);
  assert.match(creation, /function abrirCriacao/);
  assert.match(abilities, /function renderizarHabilidadesDaFicha/);
  assert.match(inventory, /function renderizarInventario/);
  assert.match(summary, /function renderizarIdentidadeDaFicha/);

  await Promise.all([
    "script.js",
    "inventory-domain.js",
    "attribute-motion.js",
    "motion-enhancements.js"
  ].map((path) => assert.rejects(access(new URL(path, root)))));
});
