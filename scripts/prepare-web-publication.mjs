import { appendFile, readFile, rm, stat } from "node:fs/promises";
import { resolve } from "node:path";
import { buildMLeague, migrationRedirects, standaloneOrigin } from "./mleague-publication.mjs";
import { videoMigrationRedirects, videoStandaloneOrigin } from "./video-publication.mjs";
import { canonicalRouteRedirects } from "./static-publication.mjs";

const origin = standaloneOrigin();
if (!origin) {
  buildMLeague();
  await import("./merge-mleague-output.mjs");
} else {
  if (process.env.CF_PAGES !== "1") throw new Error("CF_PAGES=1 is required for the split web export.");
  const output = resolve(import.meta.dirname, "../apps/web/out");
  await stat(resolve(output, "index.html"));
  // Remove the legacy placeholder from the export only; preserve its source.
  await rm(resolve(output, "videos/mleague-clips"), { recursive: true, force: true });
  await rm(resolve(output, "videos/mleague-clips.html"), { force: true });
  await rm(resolve(output, "videos/mleague-clips.txt"), { force: true });
  await appendFile(resolve(output, "_redirects"), `\n${migrationRedirects(origin)}\n`);
}

const videoOrigin = videoStandaloneOrigin();
if (videoOrigin) {
  if (process.env.CF_PAGES !== "1") throw new Error("CF_PAGES=1 is required when the video section is hosted separately.");
  const output = resolve(import.meta.dirname, "../apps/web/out");
  await stat(resolve(output, "index.html"));
  for (const suffix of ["", ".html", ".txt"]) {
    await rm(resolve(output, `videos/strategy${suffix}`), { recursive: true, force: true });
  }
  await appendFile(resolve(output, "_redirects"), `\n${videoMigrationRedirects(videoOrigin)}\n`);
}

if (process.env.CF_PAGES === "1") {
  const output = resolve(import.meta.dirname, "../apps/web/out");
  const sitemap = await readFile(resolve(output, "sitemap.xml"), "utf8");
  const canonicalUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/gi)].map((match) => match[1]);
  const origin = canonicalUrls.length ? new URL(canonicalUrls[0]).origin : new URL(process.env.SITE_URL || "https://jongfolio.com").origin;
  const redirects = canonicalRouteRedirects(canonicalUrls, origin);
  if (redirects) await appendFile(resolve(output, "_redirects"), `\n${redirects}\n`);
}
