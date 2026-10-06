import { access, mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { AudioTrack, ResolvedConfig } from "./types.js";

const SAMPLE_RATE = 44100;

interface ResolvedEffect {
  path: string;
  configured: boolean;
}

export async function buildSoundEffectTracks(jobDir: string, config: ResolvedConfig): Promise<AudioTrack[]> {
  const outputDir = resolve(jobDir, "audio", "effects");
  await mkdir(outputDir, { recursive: true });
  const question = await resolveEffect("question", outputDir, config);
  const tick = await resolveEffect("tick", outputDir, config);
  const correct = await resolveEffect("correct", outputDir, config);
  const tracks: AudioTrack[] = [
    {
      path: question.path,
      startMs: 0,
      volume: config.audio.volumes.question,
      durationMs: 1000,
      fadeOutMs: 120
    },
    {
      path: correct.path,
      startMs: 12800,
      volume: config.audio.volumes.correct,
      durationMs: 1200,
      fadeOutMs: 120
    }
  ];
  if (tick.configured) {
    tracks.push({
      path: tick.path,
      startMs: 4000,
      volume: config.audio.volumes.tick,
      durationMs: 8000,
      fadeOutMs: 100
    });
  } else {
    for (let second = 4; second < 12; second += 1) {
      tracks.push({ path: tick.path, startMs: second * 1000, volume: config.audio.volumes.tick });
    }
  }
  const soundLogo = resolve(config.audioAssetsDir, config.audio.files.soundLogo);
  if (await exists(soundLogo)) tracks.push({ path: soundLogo, startMs: 23800, volume: config.audio.volumes.soundLogo });
  return tracks;
}

async function resolveEffect(name: "question" | "tick" | "correct", outputDir: string, config: ResolvedConfig): Promise<ResolvedEffect> {
  const configured = resolve(config.audioAssetsDir, config.audio.files[name]);
  if (await exists(configured)) return { path: configured, configured: true };
  const generated = resolve(outputDir, `${name}.wav`);
  const samples = name === "tick"
    ? toneSequence([{ frequency: 1380, duration: 0.055, gain: 0.75 }])
    : name === "question"
      ? toneSequence([
          { frequency: 523.25, duration: 0.15, gain: 0.55 },
          { frequency: 659.25, duration: 0.15, gain: 0.58 },
          { frequency: 783.99, duration: 0.26, gain: 0.62 }
        ])
      : toneSequence([
          { frequency: 659.25, duration: 0.12, gain: 0.48 },
          { frequency: 783.99, duration: 0.12, gain: 0.52 },
          { frequency: 1046.5, duration: 0.34, gain: 0.58 }
        ]);
  await writeFile(generated, pcm16Wave(samples, SAMPLE_RATE));
  return { path: generated, configured: false };
}

function toneSequence(parts: Array<{ frequency: number; duration: number; gain: number }>): Float32Array {
  const silence = Math.floor(SAMPLE_RATE * 0.02);
  const total = parts.reduce((sum, part) => sum + Math.floor(SAMPLE_RATE * part.duration) + silence, 0);
  const samples = new Float32Array(total);
  let offset = 0;
  for (const part of parts) {
    const length = Math.floor(SAMPLE_RATE * part.duration);
    for (let index = 0; index < length; index += 1) {
      const attack = Math.min(1, index / (SAMPLE_RATE * 0.008));
      const release = Math.min(1, (length - index) / (SAMPLE_RATE * 0.045));
      samples[offset + index] = Math.sin((2 * Math.PI * part.frequency * index) / SAMPLE_RATE) * part.gain * attack * release;
    }
    offset += length + silence;
  }
  return samples;
}

function pcm16Wave(samples: Float32Array, sampleRate: number): Buffer {
  const buffer = Buffer.alloc(44 + samples.length * 2);
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + samples.length * 2, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(samples.length * 2, 40);
  samples.forEach((sample, index) => buffer.writeInt16LE(Math.round(Math.max(-1, Math.min(1, sample)) * 32767), 44 + index * 2));
  return buffer;
}

async function exists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}
