import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import ffmpegPath from "ffmpeg-static";
import type { AudioTrack, RenderedFrame, ResolvedConfig } from "./types.js";

export async function renderVideo(
  frames: RenderedFrame[],
  audioTracks: AudioTrack[],
  jobDir: string,
  outputPath: string,
  config: ResolvedConfig
): Promise<void> {
  if (!ffmpegPath) throw new Error("FFmpeg binary is unavailable. Run pnpm install again.");
  const workDir = resolve(jobDir, "video-work");
  await mkdir(workDir, { recursive: true });
  await mkdir(dirname(outputPath), { recursive: true });
  const concatPath = resolve(workDir, "frames.txt");
  const silentPath = resolve(workDir, "silent.mp4");
  const mixPath = resolve(jobDir, "audio", "mix.wav");
  const concat = frames.flatMap((frame) => [
    `file '${concatEscape(frame.path)}'`,
    `duration ${frame.durationSeconds}`
  ]);
  concat.push(`file '${concatEscape(frames.at(-1)!.path)}'`);
  await writeFile(concatPath, `${concat.join("\n")}\n`, "utf8");

  await runFfmpeg([
    "-y", "-f", "concat", "-safe", "0", "-i", concatPath,
    "-vf", `fps=${config.video.fps},format=yuv420p`,
    "-c:v", "libx264", "-preset", config.video.preset, "-crf", String(config.video.crf),
    "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-t", String(config.video.durationSeconds),
    silentPath
  ]);

  if (audioTracks.length === 0) {
    await runFfmpeg(["-y", "-i", silentPath, "-c", "copy", outputPath]);
    return;
  }

  await mkdir(dirname(mixPath), { recursive: true });
  const audioInputs = audioTracks.flatMap((track) => ["-i", track.path]);
  const filters = audioTracks.map((track, index) => {
    const durationSeconds = track.durationMs === undefined ? undefined : track.durationMs / 1000;
    const trim = durationSeconds === undefined ? "" : `atrim=duration=${durationSeconds},asetpts=PTS-STARTPTS,`;
    const fade = durationSeconds === undefined || track.fadeOutMs === undefined
      ? ""
      : `afade=t=out:st=${Math.max(0, durationSeconds - track.fadeOutMs / 1000)}:d=${track.fadeOutMs / 1000},`;
    return `[${index}:a]${trim}${fade}volume=${track.volume},adelay=${Math.max(0, Math.round(track.startMs))}:all=1,aresample=48000[a${index}]`;
  });
  filters.push(`${audioTracks.map((_, index) => `[a${index}]`).join("")}amix=inputs=${audioTracks.length}:duration=longest:normalize=0,alimiter=limit=0.95[aout]`);
  await runFfmpeg([
    "-y", ...audioInputs,
    "-filter_complex", filters.join(";"),
    "-map", "[aout]", "-t", String(config.video.durationSeconds),
    "-ar", "48000", "-ac", "2", "-c:a", "pcm_s16le", mixPath
  ]);
  await runFfmpeg([
    "-y", "-i", silentPath, "-i", mixPath,
    "-c:v", "copy", "-c:a", "aac", "-b:a", "192k",
    "-t", String(config.video.durationSeconds), "-movflags", "+faststart", outputPath
  ]);
}

async function runFfmpeg(args: string[]): Promise<void> {
  await new Promise<void>((resolvePromise, reject) => {
    const child = spawn(ffmpegPath!, args, { stdio: ["ignore", "ignore", "pipe"] });
    let stderr = "";
    child.stderr.setEncoding("utf8");
    child.stderr.on("data", (chunk: string) => {
      stderr += chunk;
      if (stderr.length > 24000) stderr = stderr.slice(-24000);
    });
    child.once("error", reject);
    child.once("exit", (code) => {
      if (code === 0) resolvePromise();
      else reject(new Error(`FFmpeg exited with code ${code}.\n${stderr}`));
    });
  });
}

function concatEscape(path: string): string {
  return path.replaceAll("\\", "/").replaceAll("'", "'\\''");
}
