import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
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
