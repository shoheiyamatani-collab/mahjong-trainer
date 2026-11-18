import { appendFile, rm, stat } from "node:fs/promises";
import { resolve } from "node:path";
import { buildMLeague, migrationRedirects, standaloneOrigin } from "./mleague-publication.mjs";

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
