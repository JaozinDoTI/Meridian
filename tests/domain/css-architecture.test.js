import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../../${path}`, import.meta.url), "utf8");

test("separa landing, criacao e seus movimentos em autoridades proprias", async function () {
  const [entrypoint, landing, creation, landingMotion, creationMotion] = await Promise.all([
    read("css/app.css"),
    read("css/features/landing.css"),
    read("css/features/character-creation.css"),
    read("css/motion/landing.css"),
    read("css/motion/character-creation.css")
  ]);

  assert.match(entrypoint, /features\/landing\.css/);
  assert.match(entrypoint, /features\/character-creation\.css/);
  assert.match(entrypoint, /motion\/landing\.css/);
  assert.match(entrypoint, /motion\/character-creation\.css/);
  assert.doesNotMatch(landing, /\.creation-(?:screen|body|stage|footer)/);
  assert.match(creation, /\.creation-screen/);
  assert.match(landingMotion, /@keyframes grimoire-glow/);
  assert.match(creationMotion, /@keyframes stage-enter-forward/);
});

test("remove a folha de movimento da raiz e preserva todos os consumidores", async function () {
  const [entrypoint, primitives, sheetMotion] = await Promise.all([
    read("css/app.css"),
    read("css/motion/primitives.css"),
    read("css/motion/sheet.css")
  ]);

  assert.doesNotMatch(entrypoint, /\.\.\/motion\.css/);
  assert.match(entrypoint, /motion\/sheet\.css/);
  assert.match(primitives, /@keyframes attribute-state-sentinel/);
  assert.match(sheetMotion, /@keyframes sheet-resource-feedback/);
  await assert.rejects(access(new URL("../../motion.css", import.meta.url)));
});

test("mantém app.css como entrada única sem camada ou folhas legadas na raiz", async function () {
  const [entrypoint, tokens] = await Promise.all([
    read("css/app.css"),
    read("css/tokens.css")
  ]);

  assert.doesNotMatch(entrypoint, /\blegacy\b/);
  assert.doesNotMatch(entrypoint, /\.\.\/(?:style|character-sheet|inventory|motion)\.css/);
  assert.doesNotMatch(tokens, /\.character-sheet-screen/);

  await Promise.all([
    "style.css",
    "character-sheet.css",
    "inventory.css",
    "motion.css",
    "css/layouts.css"
  ].map(function assertRootStylesheetWasRemoved(path) {
    return assert.rejects(access(new URL(`../../${path}`, import.meta.url)));
  }));
});
