import { cp, mkdir, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { buildMLeague, standaloneOrigin } from "./mleague-publication.mjs";

const origin = standaloneOrigin();
if (!origin) throw new Error("Set MLEAGUE_STANDALONE_URL before building the dedicated Pages project.");

process.env.MLEAGUE_STANDALONE_URL = origin;
delete process.env.ADSENSE_REVIEW_MODE;
buildMLeague();

const app = resolve(import.meta.dirname, "../apps/mleague");
const source = resolve(app, "out");
const output = resolve(app, "pages-out");
const home = await readFile(resolve(source, "index.html"), "utf8");
if (!home.includes(`rel="canonical" href="${origin}/mleague/"`) || home.includes("google-adsense-account")) {
  throw new Error("The standalone export must use its own canonical and omit the AdSense ownership tag.");
}
for (const required of ["calendar/index.html", "stats/index.html", "players/index.html", "teams/index.html", "clips/index.html", "404.html", "_next/static"]) {
  await stat(resolve(source, required));
}
// Copy underneath the existing basePath so Next.js assets and deep links keep working.
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(source, resolve(output, "mleague"), { recursive: true });
await cp(resolve(app, "../web/public/tiles"), resolve(output, "mleague/tiles"), { recursive: true });
await cp(resolve(source, "404.html"), resolve(output, "404.html"));
await writeFile(resolve(output, "_redirects"), "/ /mleague/ 302\n");
const robots = await readFile(resolve(source, "robots.txt"), "utf8");
await writeFile(resolve(output, "robots.txt"), robots);
const sitemap = await readFile(resolve(source, "sitemap.xml"), "utf8");
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
if (urls.some((url) => !url.startsWith(`${origin}/mleague/`))) throw new Error("Wrong origin in M League sitemap.");
const teamPages = await readdir(resolve(source, "teams"), { withFileTypes: true });
if (!teamPages.some((entry) => entry.isDirectory())) throw new Error("No team pages were exported.");
console.log(`M League Pages export ready: ${output} (${urls.length} indexable sitemap URLs)`);
