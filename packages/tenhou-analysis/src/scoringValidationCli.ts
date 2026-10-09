import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { HAND_SCORE_VERSION } from "@mahjong-trainer/mahjong-core";
import { SCORING_CASES_SEED, SCORING_CASES_VERSION, coreScoringOutcome, curatedScoringCases, generatedScoringCases, type ScoringComparisonOutcome } from "../../mahjong-core/tests/support/scoringReferenceCases";

function validExpected(value: unknown): value is ScoringComparisonOutcome {
  if (!value || typeof value !== "object") return false;
  const row = value as Record<string, unknown>;
  if (row.status === "rejected") return ["no-yaku", "not-winning", "invalid-input"].includes(String(row.reason));
  return row.status === "accepted" && [row.han, row.yakumanCount, row.totalPoints].every((field) => typeof field === "number" && Number.isSafeInteger(field) && field >= 0)
    && (row.fu === null || typeof row.fu === "number" && Number.isSafeInteger(row.fu) && row.fu >= 20)
    && Array.isArray(row.payments) && row.payments.length > 0 && row.payments.every((field) => typeof field === "number" && Number.isSafeInteger(field) && field > 0);
}

async function main() {
  const options = new Map<string, string>(), args = process.argv.slice(2);
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i]!, value = args[i + 1];
    if (!["--python", "--reference", "--output", "--count", "--oracle"].includes(key) || options.has(key) || !value || value.startsWith("--")) throw new Error("Usage: research:scoring --python PYTHON --reference PATH --output PATH [--count 2000] [--oracle PATH]");
    options.set(key, value);
  }
  const root = fileURLToPath(new URL("../../../", import.meta.url));
  const count = Number(options.get("--count") ?? "2000");
  if (!Number.isSafeInteger(count) || count < 1 || count > 100000) throw new Error("Invalid case count.");
  const cases = [...curatedScoringCases(), ...generatedScoringCases(count)];
  const python = options.get("--python") ?? process.env.SCORING_REFERENCE_PYTHON ?? "python";
  const result = spawnSync(python, [resolve(root, "research/scoring/reference.py"), resolve(options.get("--reference") ?? resolve(root, "work/scoring-reference"))], { input: JSON.stringify({ cases }), encoding: "utf8", maxBuffer: 64 * 1024 * 1024, env: { ...process.env, PYTHONIOENCODING: "utf-8" } });
  if (result.error || result.status !== 0) throw new Error(`Reference execution failed: ${result.error?.message ?? result.stderr}`);
  const oracle = JSON.parse(result.stdout) as { reference: string; version: string; results: { id: string; expected: unknown }[] };
  if (oracle.reference !== "MahjongRepository/mahjong" || oracle.version !== "2.0.0" || !Array.isArray(oracle.results) || oracle.results.length !== cases.length || oracle.results.some((row, i) => row.id !== cases[i]!.id || !validExpected(row.expected))) throw new Error("Invalid oracle response.");
  const failures = cases.flatMap((test, i) => {
    const expected = oracle.results[i]!.expected, actual = coreScoringOutcome(test.input);
    return JSON.stringify(expected) === JSON.stringify(actual) ? [] : [{ ...test, expected, actual }];
  });
  const accepted = oracle.results.filter((row) => validExpected(row.expected) && row.expected.status === "accepted").length;
  const report = { source: "synthetic-winning-hand-audit", coreScorerVersion: HAND_SCORE_VERSION, casesVersion: SCORING_CASES_VERSION, seed: SCORING_CASES_SEED, reference: oracle.reference, referenceVersion: oracle.version,
    rules: "open-tanyao; no-red; optional double-yakuman variants per case; multiple-yakuman stacks; kazoe-yakuman; no-kiriage", total: cases.length, matched: cases.length - failures.length, failed: failures.length,
    acceptedByReference: accepted, rejectedByReference: cases.length - accepted,
    corpusSha256: createHash("sha256").update(JSON.stringify(cases)).digest("hex"), failures };
  const output = resolve(options.get("--output") ?? resolve(root, "outputs/scoring-validation/report.json"));
  await mkdir(dirname(output), { recursive: true }); await writeFile(output, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  const oracleOutput = options.get("--oracle");
  if (oracleOutput) {
    if (failures.length) throw new Error("Refusing to bless an oracle corpus while mismatches remain.");
    const target = resolve(oracleOutput);
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, `${JSON.stringify({ casesVersion: SCORING_CASES_VERSION, seed: SCORING_CASES_SEED, corpusSha256: report.corpusSha256, ...oracle }, null, 2)}\n`, "utf8");
  }
  console.log(JSON.stringify({ total: report.total, matched: report.matched, failed: report.failed, acceptedByReference: accepted, rejectedByReference: report.rejectedByReference, output, examples: failures.slice(0, 12).map((failure) => ({ id: failure.id, expected: failure.expected, actual: failure.actual })) }, null, 2));
  if (failures.length) process.exitCode = 1;
}
main().catch((error: unknown) => { console.error(error instanceof Error ? error.message : String(error)); process.exitCode = 1; });
