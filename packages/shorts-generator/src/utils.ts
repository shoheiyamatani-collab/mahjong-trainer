import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import type { Tile } from "@mahjong-trainer/mahjong-core";

const DISPLAY_SUITS = { m: "萬", p: "筒", s: "索" } as const;
const SPEECH_SUITS = { m: "まん", p: "ぴん", s: "そう" } as const;
const SPEECH_NUMBERS = ["", "いー", "りゃん", "さん", "すー", "うー", "ろー", "ちー", "ぱー", "きゅー"];
const HONOR_READINGS: Record<string, string> = {
  東: "とん",
  南: "なん",
  西: "しゃー",
  北: "ぺー",
  白: "はく",
  發: "はつ",
  中: "ちゅん"
};

export function tileDisplay(tile: Tile): string {
  const suffix = tile.at(-1);
  if (suffix === "m" || suffix === "p" || suffix === "s") return `${tile[0]}${DISPLAY_SUITS[suffix]}`;
  return tile;
}

export function tileReading(tile: Tile): string {
  const suffix = tile.at(-1);
  if (suffix === "m" || suffix === "p" || suffix === "s") {
    return `${SPEECH_NUMBERS[Number(tile[0])]}${SPEECH_SUITS[suffix]}`;
  }
  return HONOR_READINGS[tile] ?? tile;
}

export function applyReadings(text: string, readings: Record<string, string>): string {
  return Object.entries(readings)
    .sort(([left], [right]) => right.length - left.length)
    .reduce((value, [term, reading]) => value.replaceAll(term, reading), text);
}

export function createSeededRandom(seedText: string): () => number {
  let state = 2166136261;
  for (const char of seedText) {
    state ^= char.codePointAt(0) ?? 0;
    state = Math.imul(state, 16777619);
  }
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

export function japanDate(value = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(value);
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

export function nowIso(): string {
  return new Date().toISOString();
}

export async function writeJson(path: string, value: unknown): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

export async function readJsonOr<T>(path: string, fallback: T): Promise<T> {
  try {
    return JSON.parse(await readFile(path, "utf8")) as T;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return fallback;
    throw error;
  }
}

export function pad(value: number, length = 3): string {
  return String(value).padStart(length, "0");
}

export function xmlEscape(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&apos;");
}
