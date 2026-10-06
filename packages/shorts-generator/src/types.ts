import type { Tile } from "@mahjong-trainer/mahjong-core";

export type ShortsType = "nani-kiru" | "machi";

export interface NarrationSegment {
  id: "intro" | "question" | "reveal" | "answer" | "cta";
  startMs: number;
  displayText: string;
  speechText: string;
  audioFile: string;
}

export interface ShortsProblem {
  schemaVersion: 1;
  id: string;
  sequence: number;
  date: string;
  type: ShortsType;
  hand: Tile[];
  handKey: string;
  answer: Tile[];
  answerDisplay: string;
  answerReading: string;
  ukeire: Tile[];
  ukeireCount: number;
  explanation: string;
  narration: NarrationSegment[];
  toolPath: string;
  toolUrl: string;
  generatedAt: string;
  verification: {
    engine: "mahjong-core/analyzeDiscards" | "mahjong-core/findChinitsuWaits13";
    verified: true;
  };
}

export interface HistoryEntry {
  id: string;
  type: ShortsType;
  hand: Tile[];
  handKey: string;
  answer: Tile[];
  generatedAt: string;
  videoGeneratedAt: string;
}

export interface ResolvedConfig {
  packageRoot: string;
  repoRoot: string;
  webPublicDir: string;
  outputDir: string;
  audioAssetsDir: string;
  brand: {
    name: string;
    englishName: string;
    tagline: string;
    colors: Record<string, string>;
  };
  site: {
    baseUrl: string;
    routes: Record<ShortsType, string>;
  };
  video: {
    width: number;
    height: number;
    fps: number;
    durationSeconds: number;
    showQr: boolean;
    crf: number;
    preset: string;
  };
  voicevox: {
    url: string;
    speakerId: number;
    speedScale: number;
    pitchScale: number;
    intonationScale: number;
    volumeScale: number;
  };
  audio: {
    volumes: Record<"voice" | "question" | "tick" | "correct" | "soundLogo", number>;
    files: Record<"question" | "tick" | "correct" | "soundLogo", string>;
  };
  youtube: {
    credit: string;
    hashtags: string[];
  };
  readings: Record<string, string>;
}

export interface RenderedFrame {
  path: string;
  durationSeconds: number;
}

export interface AudioTrack {
  path: string;
  startMs: number;
  volume: number;
  durationMs?: number;
  fadeOutMs?: number;
}
