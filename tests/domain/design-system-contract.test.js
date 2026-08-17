import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../../${path}`, import.meta.url), "utf8");

const requiredTokens = [
  "font-weight-regular",
  "font-weight-medium",
  "font-weight-semibold",
  "font-weight-bold",
  "line-height-display",
  "line-height-title",
  "line-height-heading",
  "line-height-body",
  "line-height-control",
  "line-height-caption",
  "text-display",
  "text-page-title",
  "text-section-title",
  "text-heading",
  "text-body-lg",
  "text-body",
  "text-control",
  "text-control-sm",
  "text-label",
  "text-caption",
  "text-kpi",
  "control-height-compact",
  "control-height-sm",
  "control-height",
  "control-height-touch",
  "control-padding-x-sm",
  "control-padding-x",
  "control-padding-x-lg",
  "control-gap",
  "control-radius",
  "control-border",
  "button-font-size",
  "button-font-weight",
  "button-letter-spacing",
  "select-font-size",
  "select-font-weight",
  "icon-size-xs",
  "icon-size-sm",
  "icon-size-md",
  "icon-size-lg",
  "state-hover-surface",
  "state-pressed-surface",
  "state-selected-surface",
  "state-disabled-opacity"
];

test("tokens.css é a autoridade da escala visual semântica", async function () {
  const tokens = await read("css/tokens.css");

  requiredTokens.forEach(function assertTokenExists(token) {
    assert.match(tokens, new RegExp(`--${token}\\s*:`), `token ausente: --${token}`);
  });

  assert.match(tokens, /--control-height-compact:\s*28px/);
  assert.match(tokens, /--control-height-sm:\s*32px/);
  assert.match(tokens, /--control-height:\s*40px/);
  assert.match(tokens, /--control-height-touch:\s*44px/);
  assert.match(tokens, /--icon-size-(?:xs|sm|md|lg):\s*(?:12|16|20|24)px/g);
});

test("foundations expõem a hierarquia tipográfica e estados globais seguros", async function () {
  const foundations = await read("css/foundations.css");

  assert.match(foundations, /button,\s*input,\s*select,\s*textarea/);
  assert.match(foundations, /\.ui-page-title/);
  assert.match(foundations, /\.ui-section-title/);
  assert.match(foundations, /\.ui-kpi/);
  assert.match(foundations, /:where\(button, input, select, textarea\):disabled/);
});

test("primitives de botão e campo consomem tokens canônicos", async function () {
  const [components, index] = await Promise.all([
    read("css/components.css"),
    read("index.html")
  ]);

  assert.match(components, /\.ui-button\s*\{[^}]*min-height:\s*var\(--control-height\)/s);
  assert.match(components, /\.ui-button\s*\{[^}]*border-radius:\s*var\(--control-radius\)/s);
  assert.match(components, /\.ui-button--compact/);
  assert.match(components, /\.ui-button--ghost/);
  assert.match(components, /\.ui-button--icon/);
  assert.match(components, /\.ui-field-control/);
  assert.match(components, /\.ui-select/);
  assert.match(components, /\.ui-select\s*\{[^}]*appearance:\s*none/s);
  assert.match(components, /\.ui-select\s*\{[^}]*background-image:/s);
  assert.match(components, /\.ui-select\s*\{[^}]*var\(--select-font-size\)/s);
  assert.match(components, /\.sheet-primary-action\s*\{[^}]*var\(--button-font-size\)/s);
  assert.match(components, /\.sheet-primary-action\s*\{[^}]*min-height:\s*var\(--control-height-sm\)/s);
  assert.equal((index.match(/<select[^>]*class="ui-select"/g) || []).length, 5);
});

test("controles equivalentes das features usam a mesma família de tokens", async function () {
  const [abilities, creation, inventory, journal] = await Promise.all([
    read("css/features/abilities.css"),
    read("css/features/character-creation.css"),
    read("css/features/inventory.css"),
    read("css/features/journal.css")
  ]);

  assert.match(abilities, /\.abilities-select \.ui-select\s*\{[^}]*min-height:\s*var\(--control-height\)/s);
  assert.doesNotMatch(abilities, /\.abilities-select \.ui-select\s*\{[^}]*font:/s);
  assert.match(creation, /\.form-field input\s*\{[^}]*height:\s*var\(--control-height\)/s);
  assert.match(creation, /\.wine-button\s*\{[^}]*height:\s*var\(--control-height\)/s);
  assert.match(inventory, /\.inventory-receive-action\s*\{[^}]*min-height:\s*var\(--control-height\)/s);
  assert.match(journal, /\.journal-toolbar \.ui-select\s*\{[^}]*min-height:\s*var\(--control-height-touch\)/s);
  assert.match(journal, /\.journal-field \.ui-select\s*\{[^}]*min-height:\s*var\(--control-height\)/s);
});

test("auditoria do design system produz inventário reproduzível", async function () {
  const [packageJsonSource, audit] = await Promise.all([
    read("package.json"),
    read("tools/audit-design-system.mjs")
  ]);
  const packageJson = JSON.parse(packageJsonSource);
  assert.equal(packageJson.scripts["check:design-system"], "node tools/audit-design-system.mjs --strict");
  assert.match(audit, /inventoryProperty/);
  assert.match(audit, /canonicalContracts/);
  assert.match(audit, /\.abilities-select \\.ui-select/);
  assert.match(audit, /\.journal-toolbar \\.ui-select/);
  assert.match(audit, /canonicalViolations/);
  assert.match(audit, /--json/);
  assert.match(audit, /--strict/);
});
