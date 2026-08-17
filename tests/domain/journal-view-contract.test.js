import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = await readFile("js/ui/journal-view.js", "utf8");

test("a view do registro constrói conteúdo seguro e emite apenas intenções", function () {
  assert.doesNotMatch(source, /\.innerHTML\s*=|insertAdjacentHTML|onclick\s*=/);
  assert.match(source, /createElement/);
  assert.match(source, /textContent/);
  assert.match(source, /onSelect/);
  assert.match(source, /aria-current/);
});
