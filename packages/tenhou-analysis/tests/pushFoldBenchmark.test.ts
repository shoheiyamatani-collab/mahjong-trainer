import { describe, expect, it } from "vitest";
import { runSyntheticPushFoldBenchmark, syntheticPushFoldWorlds } from "../src/syntheticPushFoldBenchmark";

describe("offline synthetic push/fold benchmark", () => {
  it("reproduces the exact same report with the same seed", () => {
    expect(runSyntheticPushFoldBenchmark(100, "one")).toEqual(runSyntheticPushFoldBenchmark(100, "one"));
    expect(runSyntheticPushFoldBenchmark(100, "one").report).not.toEqual(runSyntheticPushFoldBenchmark(100, "two").report);
  });
  it("labels the source and never masquerades as measured Mahjong rates", () => {
    const result = runSyntheticPushFoldBenchmark(100);
    expect(result.warning).toContain("not real deal-in rates");
    expect(result.report.visibility).toBe("research-only"); expect(result.report.experiment.source).toBe("synthetic-fixture");
    expect(syntheticPushFoldWorlds.reduce((sum, world) => sum + world.weight, 0)).toBeCloseTo(1);
  });
  it("matches analytically calculated toy means with fixed-budget Monte Carlo intervals", () => {
    const baseline = runSyntheticPushFoldBenchmark(10000);
    // Independent arithmetic for the authored fixture's eight point outcomes.
    expect(baseline.analyticPointMeans.push).toBeCloseTo(0.14 * 8700 + 0.08 * 8900 - 0.16 * 8700 - 0.16 * 4900 - 0.12 * 3000 - 0.16 * 1000 + 0.10 * 500 - 0.08 * 1000);
    expect(baseline.analyticPointMeans.fold).toBeCloseTo(-0.08 * 3900 - 0.16 * 2000 - 0.16 * 3900 - 0.12 * 2000 - 0.10 * 1000);
    for (const policy of ["push", "fold"] as const) {
      const interval = baseline.report[policy].payoff.interval!;
      expect(interval.lower).toBeLessThanOrEqual(baseline.analyticPointMeans[policy]);
      expect(interval.upper).toBeGreaterThanOrEqual(baseline.analyticPointMeans[policy]);
    }
    expect(baseline.report.difference.interval!.lower).toBeLessThanOrEqual(baseline.analyticPointMeans.difference);
    expect(baseline.report.difference.interval!.upper).toBeGreaterThanOrEqual(baseline.analyticPointMeans.difference);
    expect(JSON.parse(JSON.stringify(baseline))).toEqual(baseline);
  });
  it.each([0, 1, 100001, NaN, 5.5])("rejects unsafe trial count %s", (count) => {
    expect(() => runSyntheticPushFoldBenchmark(count)).toThrow();
  });
});
