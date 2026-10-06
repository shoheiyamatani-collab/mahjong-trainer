import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { loadConfig } from "./config.js";
import { verifyProblem } from "./problem.js";
import type { ShortsProblem } from "./types.js";
import { synthesizeNarration } from "./voicevox.js";

async function main(): Promise<void> {
  const input = process.argv[2];
  if (!input) throw new Error("Usage: pnpm generate:shorts:voice -- path/to/problem.json");
  const problemPath = resolve(process.cwd(), input);
  const problem = JSON.parse(await readFile(problemPath, "utf8")) as ShortsProblem;
  verifyProblem(problem);
  const config = await loadConfig();
  const result = await synthesizeNarration(problem, dirname(problemPath), config, false);
  if (!result.available) throw new Error(result.warning ?? "VOICEVOX narration was not generated.");
  process.stdout.write(`${problem.id}: 正解を再検証し、VOICEVOX音声 ${result.tracks.length} ファイルを再生成しました。\n`);
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.stack ?? error.message : String(error)}\n`);
  process.exitCode = 1;
});
