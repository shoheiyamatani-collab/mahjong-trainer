import { cp, mkdir, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { collectPrimarySiteLinks, primarySiteRedirects, videoStandaloneOrigin } from "./video-publication.mjs";
import { canonicalRouteRedirects } from "./static-publication.mjs";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const ts = require("typescript");
require.extensions[".ts"] = (module, filename) => {
  const source = readFileSync(filename, "utf8");
  module._compile(ts.transpile(source, { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }), filename);
};
const origin = videoStandaloneOrigin();
if (!origin) throw new Error("Set VIDEO_STANDALONE_URL before building the dedicated video Pages project.");
if (process.env.CF_PAGES !== "1") throw new Error("CF_PAGES=1 is required for the standalone video export.");

const primaryOrigin = new URL(process.env.PRIMARY_SITE_URL || "https://jongfolio.com").origin;
const buildEnv = {
  ...process.env,
  SITE_URL: origin,
  VIDEO_STANDALONE_URL: origin,
  VIDEO_STANDALONE_BUILD: "true",
  MLEAGUE_STANDALONE_URL: process.env.MLEAGUE_STANDALONE_URL || "https://jongfolio-mleague.pages.dev"
};
delete buildEnv.ADSENSE_REVIEW_MODE;

const build = spawnSync("pnpm build:web", { cwd: repositoryRoot, env: buildEnv, shell: true, stdio: "inherit" });
if (build.error) throw build.error;
if (build.status !== 0) throw new Error("Video standalone Next.js export failed.");

const web = path.join(repositoryRoot, "apps", "web");
const source = path.join(web, "out");
const output = path.join(repositoryRoot, "apps", "videos", "pages-out");
const videoSource = path.join(source, "videos", "strategy");
await stat(path.join(videoSource, "index.html"));
const videoLandingHtml = path.join(source, "videos", "strategy.html");
await stat(videoLandingHtml);

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(path.join(web, "public"), output, { recursive: true });
await rm(path.join(output, "ads.txt"), { force: true });
await rm(path.join(output, "_redirects"), { force: true });
await cp(path.join(source, "_next"), path.join(output, "_next"), { recursive: true });
await cp(videoSource, path.join(output, "videos", "strategy"), { recursive: true });
await cp(videoLandingHtml, path.join(output, "videos", "strategy.html"));
const landingHtml = await readFile(path.join(output, "videos", "strategy.html"), "utf8");
const landingCanonical = landingHtml.match(/<link\b[^>]*rel=["'][^"']*canonical[^"']*["'][^>]*href=["']([^"']+)["']/i)?.[1];
if (landingCanonical !== `${origin}/videos/strategy`) {
  throw new Error(`The slashless video landing route must use its canonical HTML file: ${landingCanonical ?? "missing canonical"}`);
}
for (const file of ["404.html", "robots.txt", "sitemap.xml"]) {
  await cp(path.join(source, file), path.join(output, file));
}

async function collectHtml(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collectHtml(entryPath));
    else if (entry.isFile() && entry.name.endsWith(".html")) files.push(entryPath);
  }
  return files;
}

const videoHtml = await collectHtml(path.join(output, "videos", "strategy"));
const notFoundPath = path.join(output, "404.html");
const htmlFiles = [...videoHtml, notFoundPath];
const mainRoutes = new Set();
const canonicalRoutes = new Set();
for (const htmlFile of htmlFiles) {
  const html = await readFile(htmlFile, "utf8");
  if (html.includes("google-adsense-account") || /adsbygoogle|ca-pub-7962600450986425|pub-7962600450986425/i.test(html)) {
    throw new Error(`AdSense identifiers must not be published on the video domain: ${path.relative(output, htmlFile)}`);
  }
  const canonical = html.match(/<link\b[^>]*rel=["'][^"']*canonical[^"']*["'][^>]*href=["']([^"']+)["']/i)?.[1];
    if (canonical && htmlFile !== notFoundPath) {
    const canonicalUrl = new URL(canonical, origin);
    if (canonicalUrl.origin !== origin || !canonicalUrl.pathname.startsWith("/videos/strategy")) {
      throw new Error(`Video page canonical points outside its dedicated origin: ${canonicalUrl.href}`);
    }
    canonicalRoutes.add(canonicalUrl.pathname.replace(/\/$/, "") || "/");
  }
  for (const route of collectPrimarySiteLinks(html, origin)) mainRoutes.add(route);
}

const { advancedStrategyChannel, proStrategyChannel, videoChannels } = require("../apps/web/app/videos/videoData.ts");
const expectedCanonicalRoutes = new Set([
  "/videos/strategy",
  "/videos/strategy/advanced",
  "/videos/strategy/advanced/calling-read",
  "/videos/strategy/beginner",
  "/videos/strategy/pro",
  ...[videoChannels.strategy, advancedStrategyChannel, proStrategyChannel]
    .flatMap((channel) => channel.guides.map((guide) => guide.articleHref).filter(Boolean))
].map((route) => route.replace(/\/$/, "")));
if (canonicalRoutes.size !== expectedCanonicalRoutes.size || [...expectedCanonicalRoutes].some((route) => !canonicalRoutes.has(route))) {
  throw new Error(`Video route export does not match source data (${canonicalRoutes.size}/${expectedCanonicalRoutes.size} canonical URLs).`);
}

const sitemap = await readFile(path.join(output, "sitemap.xml"), "utf8");
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
for (const sitemapUrl of sitemapUrls) {
  if (!sitemapUrl.startsWith(`${origin}/videos/strategy`)) throw new Error(`Unexpected URL in video sitemap: ${sitemapUrl}`);
}

const redirects = [
  canonicalRouteRedirects([...canonicalRoutes].map((route) => new URL(route, origin).href), origin),
  "/ /videos/strategy 302",
  primarySiteRedirects([...mainRoutes], primaryOrigin)
].filter(Boolean).join("\n");
await writeFile(path.join(output, "_redirects"), `${redirects}\n`, "utf8");

if (await stat(path.join(output, "ads.txt")).then(() => true).catch(() => false)) {
  throw new Error("ads.txt must not be present on the video domain.");
}
const robots = await readFile(path.join(output, "robots.txt"), "utf8");
if (!robots.includes(`${origin}/sitemap.xml`)) throw new Error("The standalone robots.txt must reference its own sitemap.");

console.log(`Standalone video export ready: ${output} (${canonicalRoutes.size} routes, ${sitemapUrls.length} indexable sitemap URLs, ${mainRoutes.size} return-link routes)`);
