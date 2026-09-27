import { copyFile, mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputRoot = path.join(repositoryRoot, "apps", "web", "out");

async function collectHtmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await collectHtmlFiles(entryPath)));
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      files.push(entryPath);
    }
  }

  return files;
}

let htmlFiles;

try {
  htmlFiles = await collectHtmlFiles(outputRoot);
} catch (error) {
  if (error?.code === "ENOENT") {
    console.log("Static export output is absent; route normalization skipped.");
    process.exit(0);
  }

  throw error;
}

let normalizedCount = 0;

for (const htmlFile of htmlFiles) {
  const relativePath = path.relative(outputRoot, htmlFile);

  if (relativePath === "index.html" || relativePath === "404.html" || path.basename(htmlFile) === "index.html") {
    continue;
  }

  const routeDirectory = htmlFile.slice(0, -".html".length);
  await mkdir(routeDirectory, { recursive: true });
  await copyFile(htmlFile, path.join(routeDirectory, "index.html"));
  normalizedCount += 1;
}

console.log(`Normalized ${normalizedCount} static routes for direct URL access.`);
