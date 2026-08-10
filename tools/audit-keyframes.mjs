import { readFile } from "node:fs/promises";
import { relative, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const appCssPath = resolve("css/app.css");
const appCss = await readFile(appCssPath, "utf8");
const cssFiles = [...appCss.matchAll(/@import\s+url\("([^"]+)"\)/g)]
  .map(function resolveImport(match) {
    const absolutePath = fileURLToPath(new URL(match[1], pathToFileURL(appCssPath)));
    return relative(process.cwd(), absolutePath).replace(/\\/g, "/");
  });

const sources = new Map(await Promise.all(cssFiles.map(async function readSource(file) {
  return [file, await readFile(file, "utf8")];
})));
const definitions = new Map();

sources.forEach(function collectDefinitions(source, file) {
  for (const match of source.matchAll(/@(?:-webkit-)?keyframes\s+([\w-]+)/g)) {
    if (!definitions.has(match[1])) definitions.set(match[1], []);
    definitions.get(match[1]).push(file);
  }
});

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const duplicates = [];
const unused = [];
definitions.forEach(function inspectDefinition(files, name) {
  if (files.length > 1) duplicates.push({ name, files });

  const referenceExpression = new RegExp(`\\b${escapeRegExp(name)}\\b`, "g");
  const occurrences = [...sources.values()].reduce(function countOccurrences(total, source) {
    return total + (source.match(referenceExpression)?.length || 0);
  }, 0);
  if (occurrences <= files.length) unused.push({ name, files });
});

const report = {
  files: cssFiles.length,
  definitions: definitions.size,
  duplicates,
  unused
};

if (process.argv.includes("--json")) {
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
} else {
  process.stdout.write(`Keyframes: ${report.definitions} definitions, ${duplicates.length} duplicate, ${unused.length} without consumer\n`);
}

if (duplicates.length || unused.length) process.exitCode = 1;
