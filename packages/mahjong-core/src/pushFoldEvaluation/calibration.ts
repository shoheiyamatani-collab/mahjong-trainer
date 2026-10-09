import { evaluationInteger } from "./settlement";

export type ProbabilityObservation = { id: string; gameId: string; probability: number; observed: boolean };
export type ReliabilityBin = {
  lower: number; upper: number; samples: number;
  meanProbability: number | null; observedRate: number | null;
};
export type ProbabilityCalibrationReport = {
  samples: number; games: number;
  brierScore: number | null;
  logLoss: number | null;
  impossiblePredictions: number;
  expectedCalibrationError: number | null;
  bins: ReliabilityBin[];
};

export function evaluateProbabilityCalibration(observations: readonly ProbabilityObservation[], binCount = 10): ProbabilityCalibrationReport {
  evaluationInteger(binCount, "binCount", 1);
  if (binCount > 100) throw new Error("At most 100 reliability bins are supported.");
  const bins = Array.from({ length: binCount }, (_, i) => ({ lower: i / binCount, upper: (i + 1) / binCount, samples: 0, probabilitySum: 0, positives: 0 }));
  const ids = new Set<string>(), games = new Set<string>();
  let brier = 0, logLoss = 0, impossiblePredictions = 0;
  for (const observation of observations) {
    const { id, gameId, probability: p, observed } = observation;
    if (!id?.trim() || !gameId?.trim() || ids.has(id)) throw new Error("Observations require unique IDs and a game ID.");
    if (!Number.isFinite(p) || p < 0 || p > 1 || typeof observed !== "boolean") throw new Error("Invalid probability or ground-truth outcome.");
    ids.add(id); games.add(gameId);
    const y = Number(observed), likelihood = observed ? p : 1 - p;
    brier += (p - y) ** 2;
    if (!likelihood) impossiblePredictions++;
    else logLoss -= Math.log(likelihood);
    const bin = bins[Math.min(binCount - 1, Math.floor(p * binCount))]!;
    bin.samples++; bin.probabilitySum += p; bin.positives += y;
  }
  const rows = bins.map((bin): ReliabilityBin => ({
    lower: bin.lower, upper: bin.upper, samples: bin.samples,
    meanProbability: bin.samples ? bin.probabilitySum / bin.samples : null,
    observedRate: bin.samples ? bin.positives / bin.samples : null
  }));
  const n = observations.length;
  return {
    samples: n, games: games.size, brierScore: n ? brier / n : null,
    // An impossible prediction has infinite log loss; null keeps the report JSON-safe.
    logLoss: n && !impossiblePredictions ? logLoss / n : null, impossiblePredictions,
    expectedCalibrationError: n ? rows.reduce((sum, bin) => sum + bin.samples / n * Math.abs((bin.meanProbability ?? 0) - (bin.observedRate ?? 0)), 0) : null,
    bins: rows
  };
}

export function assertDisjointGamePartitions(partitions: Record<"train" | "calibration" | "test", readonly string[]>): void {
  const owner = new Map<string, string>();
  for (const [partition, games] of Object.entries(partitions)) {
    const seen = new Set<string>();
    for (const game of games) {
      if (!game?.trim() || seen.has(game)) throw new Error("Partition game IDs must be nonempty and unique.");
      seen.add(game);
      const previous = owner.get(game);
      if (previous) throw new Error(`Game ${game} leaks between ${previous} and ${partition}.`);
      owner.set(game, partition);
    }
  }
}
