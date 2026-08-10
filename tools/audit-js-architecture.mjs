import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";

const html = await readFile(resolve("index.html"), "utf8");
const scriptFiles = [...html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["']/gi)]
  .map(function normalizeScript(match) { return match[1].replace(/^\.\//, ""); })
  .filter(function isLocalApplicationScript(path) { return path.startsWith("js/"); });
const sources = new Map(await Promise.all(scriptFiles.map(async function readScript(file) {
  return [file, await readFile(resolve(file), "utf8")];
})));

const violations = [];
const requiredFiles = [
  "js/app.js",
  "js/domain/character.js",
  "js/domain/abilities.js",
  "js/domain/inventory.js",
  "js/domain/import-export.js",
  "js/state/character-state.js",
  "js/state/ui-state.js",
  "js/controllers/creation-controller.js",
  "js/controllers/sheet-controller.js",
  "js/controllers/abilities-controller.js",
  "js/controllers/inventory-controller.js",
  "js/ui/creation-view.js",
  "js/ui/sheet-navigation.js",
  "js/ui/abilities-view.js",
  "js/ui/inventory-view.js",
  "js/ui/inventory-card.js",
  "js/ui/sheet-summary-view.js",
  "js/motion/creation-motion.js",
  "js/motion/sheet-motion.js",
  "js/motion/inventory-motion.js"
];

requiredFiles.forEach(function requireLoadedFile(file) {
  if (!sources.has(file)) violations.push(`${file}: arquivo canônico não carregado por index.html`);
});

sources.forEach(function inspectLayer(source, file) {
  if (file.startsWith("js/domain/") && /\b(?:document|localStorage|sessionStorage)\b|querySelector|addEventListener/.test(source)) {
    violations.push(`${file}: domínio acessa DOM, eventos ou persistência`);
  }
  if (file.startsWith("js/state/") && /\b(?:document|querySelector|addEventListener)\b/.test(source)) {
    violations.push(`${file}: estado acessa DOM ou eventos`);
  }
});

const appSource = sources.get("js/app.js") || "";
if (/^(?:async\s+)?function\s+[\w$]+/m.test(appSource)) {
  violations.push("js/app.js: bootstrap declara função nomeada");
}
if (!/addEventListener/.test(appSource)) violations.push("js/app.js: bootstrap não conecta eventos");

const unscopedFiles = [...sources.keys()].filter(function isUnscoped(file) {
  return file.startsWith("js/controllers/")
    || file === "js/state/character-state.js"
    || file === "js/ui/dom-bindings.js"
    || file === "js/ui/sheet-summary-view.js";
});
const functions = new Map();
unscopedFiles.forEach(function collectFunctions(file) {
  const source = sources.get(file);
  for (const match of source.matchAll(/^(?:async\s+)?function\s+([\w$]+)/gm)) {
    if (!functions.has(match[1])) functions.set(match[1], []);
    functions.get(match[1]).push(file);
  }
});
const duplicates = [...functions.entries()]
  .filter(function duplicated(entry) { return new Set(entry[1]).size > 1; })
  .map(function toDuplicate(entry) { return { name: entry[0], files: [...new Set(entry[1])] }; });
duplicates.forEach(function reportDuplicate(duplicate) {
  violations.push(`${duplicate.name}: função global duplicada em ${duplicate.files.join(", ")}`);
});

for (const legacyFile of ["script.js", "inventory-domain.js", "attribute-motion.js", "motion-enhancements.js"]) {
  try {
    await access(resolve(legacyFile));
    violations.push(`${legacyFile}: arquivo legado ainda existe na raiz`);
  } catch {
    // Ausência é o contrato esperado.
  }
}

const report = {
  scripts: scriptFiles.length,
  globalFunctions: functions.size,
  duplicateFunctions: duplicates,
  violations
};
if (process.argv.includes("--json")) {
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
} else {
  process.stdout.write(`JS architecture: ${report.scripts} scripts, ${report.globalFunctions} global functions, ${duplicates.length} duplicate, ${violations.length} violation\n`);
}
if (violations.length) process.exitCode = 1;
