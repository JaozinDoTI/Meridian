import { readFile } from "node:fs/promises";

const html = await readFile("index.html", "utf8");
const appCss = await readFile("css/app.css", "utf8");
const failures = [];
const dynamicIds = new Set([
  "human-bonus-group-error",
  "human-affinity-group-error",
  "variant-group-error",
  "quimeric-attribute-group-error"
]);

const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(function collectId(match) { return match[1]; });
const localScripts = [...html.matchAll(/<script\s+src="(\.\/[^"?]+)(?:\?[^"#]*)?"/g)]
  .map(function collectScript(match) { return match[1].replace(/^\.\//, ""); });
const script = (await Promise.all(localScripts.map(async function readScript(file) {
  try {
    return await readFile(file, "utf8");
  } catch (_error) {
    failures.push("Script local ausente: " + file);
    return "";
  }
}))).join("\n");
const idCounts = new Map();
ids.forEach(function countId(id) { idCounts.set(id, (idCounts.get(id) || 0) + 1); });
for (const [id, count] of idCounts) {
  if (count !== 1) failures.push(`ID duplicado: ${id} (${count})`);
}

const literalIdQueries = [...script.matchAll(/querySelector\(["']#([^"']+)["']\)/g)]
  .map(function collectQuery(match) { return match[1]; });
for (const id of new Set(literalIdQueries)) {
  if (!idCounts.has(id) && !dynamicIds.has(id)) failures.push(`querySelector sem elemento: #${id}`);
}

const availableSections = [...html.matchAll(/data-sheet-section="(summary|abilities|inventory)"/g)];
const futureSections = [...html.matchAll(/data-sheet-future="true"/g)];
if (availableSections.length !== 3) failures.push(`Seções disponíveis: ${availableSections.length}, esperado 3`);
if (futureSections.length !== 4) failures.push(`Seções futuras: ${futureSections.length}, esperado 4`);

const cssImports = [...appCss.matchAll(/@import\s+url\("([^"]+)"\)/g)]
  .map(function collectImport(match) { return match[1]; });
for (const importPath of cssImports) {
  const resolved = new URL(importPath, new URL("file:///" + process.cwd().replace(/\\/g, "/") + "/css/app.css"));
  try { await readFile(resolved); } catch (_error) { failures.push(`Import CSS ausente: ${importPath}`); }
}

if (failures.length) {
  failures.forEach(function reportFailure(failure) { process.stderr.write(`- ${failure}\n`); });
  process.exitCode = 1;
} else {
  process.stdout.write(`DOM contracts OK: ${ids.length} IDs, ${literalIdQueries.length} queries (${dynamicIds.size} dynamic), ${localScripts.length} scripts\n`);
}
