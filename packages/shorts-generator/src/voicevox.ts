import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import type { AudioTrack, ResolvedConfig, ShortsProblem } from "./types.js";

interface VoicevoxAudioQuery {
  speedScale: number;
  pitchScale: number;
  intonationScale: number;
  volumeScale: number;
  [key: string]: unknown;
}

export interface VoicevoxResult {
  available: boolean;
  tracks: AudioTrack[];
  warning?: string;
}

export async function synthesizeNarration(
  problem: ShortsProblem,
  jobDir: string,
  config: ResolvedConfig,
  noVoice: boolean
): Promise<VoicevoxResult> {
  if (noVoice) return { available: false, tracks: [], warning: "--no-voice によりナレーション生成を省略しました。" };
  try {
    await assertVoicevoxAvailable(config.voicevox.url);
  } catch (error) {
    return {
      available: false,
      tracks: [],
      warning: `VOICEVOX Engineが起動していません (${config.voicevox.url})。VOICEVOXを起動して再実行してください。今回はSEのみで動画を生成します。\n${errorMessage(error)}`
    };
  }

  const tracks: AudioTrack[] = [];
  let previousVoiceEndMs = 0;
  for (const segment of problem.narration) {
    const url = new URL("/audio_query", config.voicevox.url);
    url.searchParams.set("text", segment.speechText);
    url.searchParams.set("speaker", String(config.voicevox.speakerId));
    const queryResponse = await fetch(url, { method: "POST" });
    if (!queryResponse.ok) throw new Error(`VOICEVOX audio_query failed: ${queryResponse.status} ${await queryResponse.text()}`);
    const query = await queryResponse.json() as VoicevoxAudioQuery;
    query.speedScale = config.voicevox.speedScale;
    query.pitchScale = config.voicevox.pitchScale;
    query.intonationScale = config.voicevox.intonationScale;
    query.volumeScale = config.voicevox.volumeScale;

    const synthesisUrl = new URL("/synthesis", config.voicevox.url);
    synthesisUrl.searchParams.set("speaker", String(config.voicevox.speakerId));
    const synthesisResponse = await fetch(synthesisUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(query)
    });
    if (!synthesisResponse.ok) throw new Error(`VOICEVOX synthesis failed: ${synthesisResponse.status} ${await synthesisResponse.text()}`);
    const outputPath = resolve(jobDir, segment.audioFile);
    const audio = Buffer.from(await synthesisResponse.arrayBuffer());
    await mkdir(dirname(outputPath), { recursive: true });
    await writeFile(outputPath, audio);
    const startMs = Math.max(segment.startMs, previousVoiceEndMs + 160);
    const durationMs = waveDurationMs(audio);
    tracks.push({ path: outputPath, startMs, volume: config.audio.volumes.voice });
    previousVoiceEndMs = startMs + durationMs;
  }
  return { available: true, tracks };
}

function waveDurationMs(audio: Buffer): number {
  if (audio.length < 44 || audio.toString("ascii", 0, 4) !== "RIFF" || audio.toString("ascii", 8, 12) !== "WAVE") {
    throw new Error("VOICEVOX synthesis returned an invalid WAV file.");
  }
  let offset = 12;
  let byteRate = 0;
  let dataSize = 0;
  while (offset + 8 <= audio.length) {
    const id = audio.toString("ascii", offset, offset + 4);
    const size = audio.readUInt32LE(offset + 4);
    const dataOffset = offset + 8;
    if (id === "fmt " && size >= 12 && dataOffset + 12 <= audio.length) byteRate = audio.readUInt32LE(dataOffset + 8);
    if (id === "data") {
      dataSize = Math.min(size, audio.length - dataOffset);
      break;
    }
    offset = dataOffset + size + (size % 2);
  }
  if (byteRate <= 0 || dataSize <= 0) throw new Error("VOICEVOX WAV is missing fmt or data chunks.");
  return Math.ceil((dataSize / byteRate) * 1000);
}

async function assertVoicevoxAvailable(baseUrl: string): Promise<void> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2500);
  try {
    const response = await fetch(new URL("/version", baseUrl), { signal: controller.signal });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
  } finally {
    clearTimeout(timeout);
  }
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
