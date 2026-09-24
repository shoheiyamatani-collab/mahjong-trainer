import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("../", import.meta.url));
const policyPath = new URL("../app/videos/strategy/videoSeoPolicy.json", import.meta.url);
const outputPath = new URL("../public/_headers", import.meta.url);
const policy = JSON.parse(await readFile(policyPath, "utf8"));

const indexedArticlePaths = policy.indexedArticleSlugs.map((slug) => `/videos/strategy/${slug}`);
const indexablePaths = [...policy.indexableHubPaths, ...indexedArticlePaths];

if (indexedArticlePaths.length < 20 || indexedArticlePaths.length > 30) {
  throw new Error(`Indexed video article count must stay between 20 and 30. Received ${indexedArticlePaths.length}.`);
}

if (new Set(indexablePaths).size !== indexablePaths.length) {
  throw new Error("Video SEO policy contains duplicate paths.");
}

const lines = [
  "# Generated from app/videos/strategy/videoSeoPolicy.json.",
  "# Keep thin video articles available to readers while excluding them from search results.",
  "/videos/strategy/*",
  "  X-Robots-Tag: noindex, follow",
  ""
];

for (const path of indexablePaths) {
  lines.push(path, "  ! X-Robots-Tag", "");
}

await writeFile(outputPath, `${lines.join("\n").trimEnd()}\n`, "utf8");
console.log(`Generated ${fileURLToPath(outputPath)} with ${indexedArticlePaths.length} indexed video articles from ${appRoot}.`);
