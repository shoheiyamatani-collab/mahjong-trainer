import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { performance } from "node:perf_hooks";
import { runSyntheticPushFoldBenchmark } from "./syntheticPushFoldBenchmark";

async function main() {
  const options = new Map<string, string>();
  const args = process.argv.slice(2);
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i]!, value = args[i + 1];
    if (!["--trials", "--seed", "--output"].includes(key) || options.has(key) || !value || value.startsWith("--")) throw new Error("Usage: research:push-fold [--trials 10000] [--seed TEXT] [--output PATH]");
    options.set(key, value);
  }
  const trialsText = options.get("--trials") ?? "10000";
  if (!/^\d+$/.test(trialsText)) throw new Error("--trials must be an integer.");
  const start = performance.now();
  const baseline = runSyntheticPushFoldBenchmark(Number(trialsText), options.get("--seed") ?? "push-fold-fixture-v1");
  const output = { ...baseline, resultSha256: createHash("sha256").update(JSON.stringify(baseline)).digest("hex"), elapsedMs: performance.now() - start };
  console.log("人工データによる計算基盤の検証です。実戦の放銃率・期待値ではありません。");
  console.log(JSON.stringify({ pairs: output.report.completedPairs, elapsedMs: Math.round(output.elapsedMs), analyticPointMeans: output.analyticPointMeans, sampledPointMeans: { push: output.report.push.payoff.mean, fold: output.report.fold.payoff.mean, difference: output.report.difference.mean }, resultSha256: output.resultSha256 }, null, 2));
  const path = options.get("--output");
  if (path) {
    const target = resolve(path);
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, `${JSON.stringify(output, null, 2)}\n`, "utf8");
    console.log(`Report: ${target}`);
  }
}

main().catch((error: unknown) => { console.error(error instanceof Error ? error.message : String(error)); process.exitCode = 1; });
