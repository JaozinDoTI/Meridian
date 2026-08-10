import { readFile } from "node:fs/promises";
import { relative, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const appCssPath = resolve("css/app.css");
const appCss = await readFile(appCssPath, "utf8");
const exceptionDefinitions = JSON.parse(await readFile(resolve("tools/css-ownership-exceptions.json"), "utf8"));
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

function sameFiles(actual, expected) {
  return [...actual].sort().join("\n") === [...expected].sort().join("\n");
}

const matchedExceptions = new Set();
const documented = [];
const unexpected = [];
overlaps.forEach(function classifyOverlap(overlap) {
  const exceptionIndex = exceptionDefinitions.findIndex(function matchesException(exception) {
    return sameFiles(overlap.files, exception.files)
      && new RegExp(exception.selectorPattern).test(overlap.selector);
  });

  if (exceptionIndex === -1) {
    unexpected.push(overlap);
    return;
  }

  matchedExceptions.add(exceptionIndex);
  documented.push({
    ...overlap,
    reason: exceptionDefinitions[exceptionIndex].reason
  });
});

const staleExceptions = exceptionDefinitions.filter(function isStale(_exception, index) {
  return !matchedExceptions.has(index);
});
const report = {
  files: cssFiles.length,
  selectors: ownership.size,
  overlaps: overlaps.length,
  documented,
  unexpected,
  staleExceptions
};
if (process.argv.includes("--json")) {
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
} else {
  process.stdout.write(`CSS ownership: ${report.files} files, ${report.selectors} selectors, ${report.documented.length} documented overlaps, ${report.unexpected.length} unexpected\n`);
}
if (process.argv.includes("--strict") && (unexpected.length || staleExceptions.length)) process.exitCode = 1;
