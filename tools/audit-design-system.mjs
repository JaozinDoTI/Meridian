import { readFile } from "node:fs/promises";
import { relative, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const entrypoint = resolve("css/app.css");
const appCss = await readFile(entrypoint, "utf8");
const files = [...appCss.matchAll(/@import\s+url\("([^"]+)"\)/g)].map(function resolveImport(match) {
  return relative(process.cwd(), fileURLToPath(new URL(match[1], pathToFileURL(entrypoint)))).replace(/\\/g, "/");
});

const sources = new Map(await Promise.all(files.map(async function readSource(file) {
  return [file, await readFile(file, "utf8")];
})));

const properties = ["font-size", "font-weight", "line-height", "height", "min-height", "padding", "gap", "border-radius", "border"];

function inventoryProperty(property) {
  const values = [];
  const expression = new RegExp(`(?:^|[;{])\\s*${property}\\s*:\\s*([^;}{]+)`, "gmi");
  sources.forEach(function collect(source, file) {
    if (file === "css/tokens.css") return;
    for (const match of source.matchAll(expression)) values.push(match[1].trim());
  });
  const frequencies = new Map();
  values.forEach(function count(value) { frequencies.set(value, (frequencies.get(value) || 0) + 1); });
  return {
    total: values.length,
    distinct: frequencies.size,
    literal: values.filter(function isLiteral(value) { return /(?:^|\s|\()\d+(?:\.\d+)?px\b/.test(value); }).length,
    top: [...frequencies.entries()]
      .sort(function byFrequency(a, b) { return b[1] - a[1] || a[0].localeCompare(b[0]); })
      .slice(0, 12)
      .map(function toEntry([value, count]) { return { value, count }; })
  };
}

const inventory = Object.fromEntries(properties.map(function toInventory(property) {
  return [property.replace(/-([a-z])/g, function camel(_match, letter) { return letter.toUpperCase(); }), inventoryProperty(property)];
}));

const controlValues = [];
sources.forEach(function collectControlValues(source, file) {
  if (file === "css/tokens.css") return;
  for (const match of source.matchAll(/(?:height|min-height)\s*:\s*([^;}{]+)/g)) {
    const value = match[1].trim();
    if (/var\(--control-height|(?:2[6-9]|3\d|4[0-8])px/.test(value)) controlValues.push(value);
  }
});
inventory.controlHeight = {
  total: controlValues.length,
  distinct: new Set(controlValues).size,
  literal: controlValues.filter(function isLiteral(value) { return /px/.test(value) && !/var\(/.test(value); }).length
};

const canonicalContracts = [
  ["css/components.css", /\.ui-button\s*\{[^}]*min-height:\s*var\(--control-height\)/s, ".ui-button deve usar --control-height"],
  ["css/components.css", /\.sheet-primary-action\s*\{[^}]*min-height:\s*var\(--control-height-sm\)/s, ".sheet-primary-action deve usar --control-height-sm"],
  ["css/features/abilities.css", /\.abilities-select \.ui-select\s*\{[^}]*min-height:\s*var\(--control-height\)/s, "select de Habilidades deve usar --control-height"],
  ["css/features/character-creation.css", /\.form-field input\s*\{[^}]*height:\s*var\(--control-height\)/s, "input da criação deve usar --control-height"],
  ["css/features/character-creation.css", /\.wine-button\s*\{[^}]*height:\s*var\(--control-height\)/s, ".wine-button deve usar --control-height"],
  ["css/features/inventory.css", /\.inventory-receive-action\s*\{[^}]*min-height:\s*var\(--control-height\)/s, "ação de recebimento deve usar --control-height"],
  ["css/features/journal.css", /\.journal-toolbar \.ui-select\s*\{[^}]*min-height:\s*var\(--control-height-touch\)/s, "select do Registro deve usar --control-height-touch"]
];

const canonicalViolations = canonicalContracts.flatMap(function validate([file, pattern, message]) {
  return pattern.test(sources.get(file) || "") ? [] : [{ file, message }];
});

const report = {
  files: files.length,
  inventory,
  canonicalViolations
};

if (process.argv.includes("--json")) {
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
} else {
  process.stdout.write(`Design system: ${report.files} arquivos, ${inventory.fontSize.distinct} tamanhos tipográficos, ${inventory.controlHeight.distinct} alturas de controle, ${canonicalViolations.length} violações canônicas\n`);
}

if (process.argv.includes("--strict") && canonicalViolations.length) process.exitCode = 1;
