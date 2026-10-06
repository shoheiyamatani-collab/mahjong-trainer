import { copyFile, mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { buildSoundEffectTracks } from "./audio.js";
import { loadConfig } from "./config.js";
import { youtubeDescription, youtubeTitle } from "./metadata.js";
import { narrationText } from "./narration.js";
import { generateProblem, verifyProblem } from "./problem.js";
import { renderFrames } from "./render.js";
import type { HistoryEntry, ShortsProblem, ShortsType } from "./types.js";
import { japanDate, nowIso, pad, readJsonOr, writeJson } from "./utils.js";
import { renderVideo } from "./video.js";
import { synthesizeNarration } from "./voicevox.js";

interface CliOptions {
  types: ShortsType[];
  count: number;
  date: string;
  sequenceStart?: number;
  noVoice: boolean;
  showQr: boolean;
}

async function main(): Promise<void> {
  const config = await loadConfig();
  const options = parseArgs(process.argv.slice(2), config.video.showQr);
  const historyPath = resolve(config.outputDir, "history.json");
  const history = await readJsonOr<HistoryEntry[]>(historyPath, []);
  const dateDir = resolve(config.outputDir, options.date);
  await mkdir(dateDir, { recursive: true });

  for (const type of options.types) {
    for (let index = 0; index < options.count; index += 1) {
      const sequence = options.sequenceStart === undefined
        ? nextSequence(history, type)
        : options.sequenceStart + index;
      const problem = generateProblem(type, options.date, sequence, history, config);
      verifyProblem(problem);
      const slug = type === "nani-kiru" ? "nanikiru" : "machi";
      const baseName = `${slug}-${pad(sequence)}`;
      const jobDir = resolve(dateDir, baseName);
      await mkdir(jobDir, { recursive: true });
      await writeArtifacts(problem, jobDir, config);
      process.stdout.write(`\n${problem.id}: 問題生成・mahjong-core再検証 OK\n`);

      const voice = await synthesizeNarration(problem, jobDir, config, options.noVoice);
      if (voice.warning) {
        process.stderr.write(`${voice.warning}\n`);
        await mkdir(resolve(jobDir, "audio"), { recursive: true });
        await writeFile(resolve(jobDir, "audio", "VOICEVOX_NOT_GENERATED.txt"), `${voice.warning}\n`, "utf8");
      } else {
        process.stdout.write(`${problem.id}: VOICEVOX音声生成 OK\n`);
      }
      const frames = await renderFrames(problem, jobDir, config, options.showQr);
      process.stdout.write(`${problem.id}: 1080×1920フレーム生成 OK\n`);
      const effectTracks = await buildSoundEffectTracks(jobDir, config);
      const videoPath = resolve(dateDir, `${baseName}.mp4`);
      await renderVideo(frames, [...effectTracks, ...voice.tracks], jobDir, videoPath, config);
      process.stdout.write(`${problem.id}: MP4生成 OK -> ${videoPath}\n`);

      const rootProblemPath = resolve(dateDir, `${baseName}.json`);
      await copyFile(resolve(jobDir, "problem.json"), rootProblemPath);
      await copyFile(resolve(jobDir, "title.txt"), resolve(dateDir, `${baseName}-title.txt`));
      await copyFile(resolve(jobDir, "description.txt"), resolve(dateDir, `${baseName}-description.txt`));
      const videoGeneratedAt = nowIso();
      history.push(historyEntry(problem, videoGeneratedAt));
      await writeJson(historyPath, history);
    }
  }
}

async function writeArtifacts(problem: ShortsProblem, jobDir: string, config: Awaited<ReturnType<typeof loadConfig>>): Promise<void> {
  await writeJson(resolve(jobDir, "problem.json"), problem);
  await writeJson(resolve(jobDir, "narration.json"), problem.narration);
  await writeFile(resolve(jobDir, "narration.txt"), `${narrationText(problem)}\n`, "utf8");
  await writeFile(resolve(jobDir, "title.txt"), `${youtubeTitle(problem)}\n`, "utf8");
  await writeFile(resolve(jobDir, "description.txt"), `${youtubeDescription(problem, config)}\n`, "utf8");
}

function parseArgs(args: string[], defaultShowQr: boolean): CliOptions {
  let requestedType = "nani-kiru";
  let count = 1;
  let date = japanDate();
  let sequenceStart: number | undefined;
  let noVoice = false;
  let showQr = defaultShowQr;
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index]!;
    if (arg === "--type") requestedType = requireValue(args, ++index, arg);
    else if (arg === "--count") count = Number(requireValue(args, ++index, arg));
    else if (arg === "--date") date = requireValue(args, ++index, arg);
    else if (arg === "--sequence") sequenceStart = Number(requireValue(args, ++index, arg));
    else if (arg === "--no-voice") noVoice = true;
    else if (arg === "--no-qr") showQr = false;
    else if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    } else throw new Error(`Unknown option: ${arg}`);
  }
  const allowed = new Set(["nani-kiru", "machi", "daily"]);
  if (!allowed.has(requestedType)) throw new Error("--type must be nani-kiru, machi, or daily.");
  if (!Number.isInteger(count) || count < 1 || count > 100) throw new Error("--count must be an integer from 1 to 100.");
  if (sequenceStart !== undefined && (!Number.isInteger(sequenceStart) || sequenceStart < 1 || sequenceStart > 9999)) {
    throw new Error("--sequence must be an integer from 1 to 9999.");
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error("--date must use YYYY-MM-DD.");
  return {
    types: requestedType === "daily" ? ["nani-kiru", "machi"] : [requestedType as ShortsType],
    count,
    date,
    sequenceStart,
    noVoice,
    showQr
  };
}

function requireValue(args: string[], index: number, option: string): string {
  const value = args[index];
  if (!value || value.startsWith("--")) throw new Error(`${option} requires a value.`);
  return value;
}

function nextSequence(history: HistoryEntry[], type: ShortsType): number {
  return history.filter((entry) => entry.type === type).length + 1;
}

function historyEntry(problem: ShortsProblem, videoGeneratedAt: string): HistoryEntry {
  return {
    id: problem.id,
    type: problem.type,
    hand: problem.hand,
    handKey: problem.handKey,
    answer: problem.answer,
    generatedAt: problem.generatedAt,
    videoGeneratedAt
  };
}

function printHelp(): void {
  process.stdout.write(`雀フォリオ Shorts generator\n\n`);
  process.stdout.write(`pnpm generate:shorts --type nani-kiru [--count 30] [--sequence 1] [--no-voice] [--no-qr]\n`);
  process.stdout.write(`pnpm generate:shorts --type machi [--sequence 1]\n`);
  process.stdout.write(`pnpm generate:shorts:daily\n`);
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.stack ?? error.message : String(error)}\n`);
  process.exitCode = 1;
});
