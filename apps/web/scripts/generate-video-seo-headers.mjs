import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const appRoot = fileURLToPath(new URL("../", import.meta.url));
const outputPath = new URL("../public/_headers", import.meta.url);

const lines = [
  "# Search indexing is controlled by packages/content-index-policy and Next.js Metadata API.",
  "# Do not duplicate INDEX exceptions in Cloudflare response headers."
];

await writeFile(outputPath, `${lines.join("\n").trimEnd()}\n`, "utf8");
console.log(`Generated metadata-only Cloudflare headers file from ${appRoot}.`);
