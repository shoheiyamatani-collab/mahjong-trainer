import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { ResolvedConfig } from "./types.js";

const SOURCE_DIR = dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = resolve(SOURCE_DIR, "..");
const REPO_ROOT = resolve(PACKAGE_ROOT, "..", "..");

export async function loadConfig(): Promise<ResolvedConfig> {
  const configPath = resolve(PACKAGE_ROOT, "shorts.config.json");
  const readingsPath = resolve(PACKAGE_ROOT, "mahjong-readings.json");
  const raw = JSON.parse(await readFile(configPath, "utf8")) as Omit<ResolvedConfig, "packageRoot" | "repoRoot" | "webPublicDir" | "outputDir" | "audioAssetsDir" | "readings"> & {
    paths: { webPublic: string; output: string; audioAssets: string };
  };
  const readings = JSON.parse(await readFile(readingsPath, "utf8")) as Record<string, string>;

  return {
    packageRoot: PACKAGE_ROOT,
    repoRoot: REPO_ROOT,
    webPublicDir: resolve(REPO_ROOT, raw.paths.webPublic),
    outputDir: resolve(REPO_ROOT, process.env.SHORTS_OUTPUT_DIR ?? raw.paths.output),
    audioAssetsDir: resolve(REPO_ROOT, raw.paths.audioAssets),
    brand: raw.brand,
    site: raw.site,
    video: {
      ...raw.video,
      showQr: process.env.SHORTS_QR === "0" ? false : raw.video.showQr
    },
    voicevox: {
      ...raw.voicevox,
      url: process.env.VOICEVOX_URL ?? raw.voicevox.url,
      speakerId: parseNumberEnv("VOICEVOX_SPEAKER_ID", raw.voicevox.speakerId)
    },
    audio: raw.audio,
    youtube: raw.youtube,
    readings
  };
}

function parseNumberEnv(name: string, fallback: number): number {
  const value = process.env[name];
  if (value == null || value === "") return fallback;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) throw new Error(`${name} must be a number.`);
  return parsed;
}
