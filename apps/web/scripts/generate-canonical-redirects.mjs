import { appendFile, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { canonicalRouteRedirects } from "../../../scripts/static-publication.mjs";

if (process.env.CF_PAGES !== "1") {
  console.log("Cloudflare canonical redirects skipped outside Pages builds.");
  process.exit(0);
}

const output = resolve(import.meta.dirname, "../out");
const sitemap = await readFile(resolve(output, "sitemap.xml"), "utf8");
const canonicalUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/gi)].map((match) => match[1]);
const origin = canonicalUrls.length
  ? new URL(canonicalUrls[0]).origin
  : new URL(process.env.SITE_URL || "https://jongfolio.com").origin;
const redirects = canonicalRouteRedirects(canonicalUrls, origin);

if (redirects) await appendFile(resolve(output, "_redirects"), `\n${redirects}\n`);
console.log(`Generated canonical trailing-slash redirects: ${redirects ? redirects.split("\n").length : 0}`);
