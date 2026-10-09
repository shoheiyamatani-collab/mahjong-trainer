import {
  createSeededRandom, evaluatePairedPushFold, settlePushFoldRound,
  type EvaluationBranch, type EvaluationExperiment, type PairedEvaluationTrial
} from "@mahjong-trainer/mahjong-core";

const ron = (from: "east" | "south", winner: "south" | "west" | "north"): EvaluationBranch => ({ acceptedRiichi: [], terminal: { kind: "ron", from, claims: [{ winner, han: 4, fu: 30 }] } });
const tsumo = (winner: "east" | "south" | "west"): EvaluationBranch => ({ acceptedRiichi: [], terminal: { kind: "tsumo", claim: { winner, han: 4, fu: 30 } } });
const draw = (): EvaluationBranch => ({ acceptedRiichi: [], terminal: { kind: "exhaustive-draw", tenpai: [] } });

// Toy event probabilities, deliberately authored; they are NOT observed Mahjong rates.
export const syntheticPushFoldWorlds = [
  { weight: 0.14, push: ron("east", "south"), fold: draw() },
  { weight: 0.08, push: tsumo("south"), fold: tsumo("east") },
  { weight: 0.16, push: ron("south", "west"), fold: tsumo("west") },
  { weight: 0.16, push: tsumo("east"), fold: tsumo("east") },
  { weight: 0.12, push: tsumo("west"), fold: tsumo("west") },
  { weight: 0.16, push: ron("east", "north"), fold: ron("east", "north") },
  { weight: 0.10, push: { acceptedRiichi: [], terminal: { kind: "exhaustive-draw", tenpai: ["south", "east"] } } as EvaluationBranch, fold: { acceptedRiichi: [], terminal: { kind: "exhaustive-draw", tenpai: ["east"] } } as EvaluationBranch },
  { weight: 0.08, push: { acceptedRiichi: [], terminal: { kind: "abortive-draw", reason: "synthetic-fixture" } } as EvaluationBranch, fold: draw() }
];

export function runSyntheticPushFoldBenchmark(plannedTrials = 10000, seed = "push-fold-fixture-v1") {
  if (!Number.isSafeInteger(plannedTrials) || plannedTrials < 2 || plannedTrials > 100000) throw new Error("Fixture trials must be an integer from 2 to 100000.");
  if (!seed.trim()) throw new Error("A nonempty seed is required.");
  const experiment: EvaluationExperiment = {
    positionId: "synthetic-accounting-only", publicStateHash: "synthetic-no-tile-state",
    opponentModelVersion: "authored-toy-events-v1", policyVersions: { push: "authored-push-v1", fold: "authored-fold-v1" },
    source: "synthetic-fixture", seed, sampling: "iid-fixed-budget", plannedTrials, self: "south",
    context: {
      scores: { east: 25000, south: 25000, west: 25000, north: 25000 }, dealer: "east", honba: 0, kyotaku: 1, existingRiichi: ["east"],
      rules: { id: "synthetic-multiple-ron-v1", ronResolution: "multiple", tripleRon: "allow" }
    },
    payoffSupport: { push: { lower: -50000, upper: 50000 }, fold: { lower: -50000, upper: 50000 } }
  };
  const random = createSeededRandom(seed), trials: PairedEvaluationTrial[] = [];
  for (let i = 0; i < plannedTrials; i++) {
    const u = random(); let cumulative = 0;
    const world = syntheticPushFoldWorlds.find((candidate) => { cumulative += candidate.weight; return u < cumulative; }) ?? syntheticPushFoldWorlds.at(-1)!;
    trials.push({ id: `trial-${i}`, worldId: `${seed}:world-${i}`, push: { ...world.push, acceptedRiichi: ["south"] }, fold: world.fold });
  }
  const analyticPointMeans = { push: 0, fold: 0, difference: 0 };
  for (const world of syntheticPushFoldWorlds) {
    analyticPointMeans.push += world.weight * settlePushFoldRound(experiment.context, { ...world.push, acceptedRiichi: ["south"] }).deltas.south;
    analyticPointMeans.fold += world.weight * settlePushFoldRound(experiment.context, world.fold).deltas.south;
  }
  analyticPointMeans.difference = analyticPointMeans.push - analyticPointMeans.fold;
  return {
    warning: "SYNTHETIC FIXTURE ONLY. These authored probabilities are not real deal-in rates or validated Mahjong EV. No tiles, opponent inference, or game rollout are modeled.",
    worldWeights: syntheticPushFoldWorlds.map((world) => world.weight), analyticPointMeans,
    report: evaluatePairedPushFold(experiment, trials)
  };
}
