import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const workspaceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputRoot = path.resolve(workspaceRoot, "apps/web/out");
const isReviewMode = process.env.ADSENSE_REVIEW_MODE === "true";

const policyPath = path.resolve(workspaceRoot, "packages/content-index-policy/src/publicationPolicy.json");
const { reviewModeNoindexRoutePrefixes } = JSON.parse(await readFile(policyPath, "utf8"));

async function collectHtmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collectHtmlFiles(entryPath));
    else if (entry.isFile() && entry.name.endsWith(".html")) files.push(entryPath);
  }
  return files;
}

function hasNoindexRobots(html) {
  return /<meta\b[^>]*name=["'](?:robots|googlebot)["'][^>]*content=["'][^"']*\bnoindex\b/i.test(html);
}

if (!isReviewMode) {
  console.log("AdSense Review Mode is off; no route files were removed or rewritten.");
  process.exit(0);
}

for (const routePrefix of reviewModeNoindexRoutePrefixes) {
  const normalizedPrefix = routePrefix.replace(/^\/+|\/+$/g, "");
  const target = path.resolve(outputRoot, normalizedPrefix);
  const relative = path.relative(outputRoot, target);

  if (!normalizedPrefix || relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`Refusing to inspect a path outside static output: ${target}`);
  }
  if (target !== path.resolve(outputRoot, normalizedPrefix)) {
    throw new Error(`Unexpected static output target: ${target}`);
  }

  await access(target);
  const htmlFiles = await collectHtmlFiles(target);
  if (htmlFiles.length === 0) throw new Error(`審査モード対象のHTML出力がありません: ${routePrefix}`);

  const indexablePages = [];
  for (let index = 0; index < htmlFiles.length; index += 96) {
    const batch = htmlFiles.slice(index, index + 96);
    const results = await Promise.all(batch.map(async (htmlFile) => ({
      htmlFile,
      indexable: !hasNoindexRobots(await readFile(htmlFile, "utf8"))
    })));
    indexablePages.push(...results.filter((result) => result.indexable).map((result) => result.htmlFile));
  }
  if (indexablePages.length) {
    throw new Error(`審査モード対象URLにnoindexがありません: ${indexablePages.map((file) => path.relative(outputRoot, file)).join(", ")}`);
  }
  console.log(`審査モード対象をnoindexで保持しました: ${routePrefix} (${htmlFiles.length} HTML pages)`);
}
