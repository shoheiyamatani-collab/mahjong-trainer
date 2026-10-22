import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { renderCloudflareHeaders } from "../../../scripts/security-headers.mjs";

const appRoot = fileURLToPath(new URL("../", import.meta.url));
const outputPath = new URL("../public/_headers", import.meta.url);

await writeFile(outputPath, renderCloudflareHeaders(), "utf8");
console.log(`Generated Cloudflare security headers from ${appRoot}; SEO metadata is unchanged.`);
