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

const ownership = new Map();
for (const file of cssFiles) {
  const source = await readFile(file, "utf8");
  const selectors = source.match(/(?:^|})\s*([^@{}][^{}]*)\{/gm) || [];
  selectors.forEach(function recordSelector(raw) {
    const selectorBlock = raw.replace(/^}\s*/, "").replace(/\{$/, "").trim();
    selectorBlock.split(",").map(function normalize(selector) {
      return selector.replace(/\s+/g, " ").trim();
    }).filter(function isSelector(selector) {
      return selector
        && !selector.startsWith("@")
        && !/^(?:from|to|\d+(?:\.\d+)?%)$/.test(selector);
    }).forEach(function addOwner(selector) {
      if (!ownership.has(selector)) ownership.set(selector, new Set());
      ownership.get(selector).add(file);
    });
  });
}

const overlaps = [...ownership.entries()]
  .filter(function hasMultipleOwners(entry) { return entry[1].size > 1; })
  .map(function toReport(entry) { return { selector: entry[0], files: [...entry[1]] }; })
  .sort(function sortBySelector(a, b) { return a.selector.localeCompare(b.selector); });

const report = { files: cssFiles.length, selectors: ownership.size, overlaps };
if (process.argv.includes("--json")) {
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
} else {
  process.stdout.write(`CSS ownership baseline: ${report.files} files, ${report.selectors} selectors, ${report.overlaps.length} cross-file overlaps\n`);
}
if (process.argv.includes("--strict") && overlaps.length) process.exitCode = 1;
