import { spawnSync } from "node:child_process";

export function standaloneOrigin(value = process.env.MLEAGUE_STANDALONE_URL) {
  if (!value) return null;

  const url = new URL(value);
  if (url.href !== `${url.origin}/` || url.protocol !== "https:" || !/^[a-z0-9-]+\.pages\.dev$/.test(url.hostname) || url.port) {
    throw new Error("MLEAGUE_STANDALONE_URL must be the HTTPS production origin of the new Pages project.");
  }
  return url.origin;
}

export function buildMLeague() {
  const result = spawnSync("pnpm build:mleague", { shell: true, stdio: "inherit" });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error("M League build failed.");
}

export function migrationRedirects(origin) {
  return [
    `/mleague ${origin}/mleague/ 301`,
    `/mleague/* ${origin}/mleague/:splat 301`,
    `/videos/mleague-clips ${origin}/mleague/clips/ 301`,
    `/videos/mleague-clips/ ${origin}/mleague/clips/ 301`,
  ].join("\n");
}
