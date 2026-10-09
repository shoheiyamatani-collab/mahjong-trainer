import { ORASU_SEATS, rankOrasuScores } from "../orasuCondition";
import { winRateInterval } from "../recommendation/evaluate";
import { evaluationInteger, evaluationSeats, settlePushFoldRound, validateEvaluationContext } from "./settlement";
import {
  PUSH_FOLD_EVALUATION_VERSION, evaluationOutcomeKinds,
  type EvaluationExperiment, type EvaluationOutcomeKind, type EvaluationPolicySummary,
  type EvaluationReport, type EvaluationSettlement, type MeanEstimate,
  type PairedEvaluationTrial, type PayoffSupport, type RunningMoments
} from "./types";

export const emptyMoments = (): RunningMoments => ({ count: 0, mean: 0, m2: 0 });

function validateMoments(moments: RunningMoments) {
  evaluationInteger(moments.count, "observation count");
  if (!Number.isFinite(moments.mean) || !Number.isFinite(moments.m2) || moments.m2 < 0 || moments.count < 2 && moments.m2 !== 0 || !moments.count && moments.mean !== 0) throw new Error("Invalid running moments.");
}

export function addMoment(previous: RunningMoments, value: number): RunningMoments {
  validateMoments(previous);
  if (!Number.isFinite(value)) throw new Error("Non-finite observation.");
  const count = previous.count + 1, delta = value - previous.mean;
  const mean = previous.mean + delta / count;
  const next = { count, mean, m2: previous.m2 + delta * (value - mean) };
  validateMoments(next);
  return next;
}

export function mergeMoments(a: RunningMoments, b: RunningMoments): RunningMoments {
  validateMoments(a); validateMoments(b);
  if (!a.count) return { ...b };
  if (!b.count) return { ...a };
  const count = a.count + b.count, delta = b.mean - a.mean;
  const next = { count, mean: a.mean + delta * b.count / count, m2: a.m2 + b.m2 + delta ** 2 * a.count * b.count / count };
  validateMoments(next);
  return next;
}

function validateSupport(support: PayoffSupport) {
  if (!Number.isSafeInteger(support.lower) || !Number.isSafeInteger(support.upper) || support.lower > support.upper || !Number.isSafeInteger(support.upper - support.lower)) throw new Error("Invalid a-priori payoff support.");
}

export function estimateMean(moments: RunningMoments, support: PayoffSupport, delta = 0.05, complete = true): MeanEstimate {
  validateSupport(support);
  validateMoments(moments);
  if (moments.count && (moments.mean < support.lower || moments.mean > support.upper)) throw new Error("Mean violates a-priori support.");
  if (!(delta > 0 && delta < 1)) throw new Error("Confidence error must be between zero and one.");
  const n = moments.count, variance = n > 1 ? Math.max(0, moments.m2 / (n - 1)) : null;
  const result: MeanEstimate = {
    samples: n, mean: n ? moments.mean : null, sampleVariance: variance,
    standardError: variance === null ? null : Math.sqrt(variance / n), interval: null
  };
  if (!complete || !n) return result;
  if (n === 1) {
    result.interval = { ...support, method: "support-only" };
    return result;
  }
  // Maurer/Pontil (2009), Theorem 4; union bound gives a two-sided interval.
  const log = Math.log(4 / delta), range = support.upper - support.lower;
  const radius = Math.sqrt(2 * variance! * log / n) + 7 * range * log / (3 * (n - 1));
  result.interval = { lower: Math.max(support.lower, moments.mean - radius), upper: Math.min(support.upper, moments.mean + radius), method: "empirical-bernstein" };
  return result;
}

function classify(result: EvaluationSettlement, self: EvaluationExperiment["self"]): EvaluationOutcomeKind {
  if (result.kind === "exhaustive-draw" || result.kind === "abortive-draw") return result.kind;
  if (result.winners.includes(self)) return result.kind === "ron" ? "self-ron" : "self-tsumo";
  if (result.kind === "tsumo") return "other-tsumo";
  return result.discarder === self ? "self-deal-in" : "other-ron";
}

function createAccumulator() {
  return {
    payoff: emptyMoments(),
    outcomes: Object.fromEntries(evaluationOutcomeKinds.map((kind) => [kind, 0])) as Record<EvaluationOutcomeKind, number>,
    ledger: { riichiCost: 0, winReceipt: 0, winPayment: 0, drawTransfer: 0, kyotakuReceipt: 0 },
    dealInLoss: emptyMoments(), ranks: { 1: 0, 2: 0, 3: 0, 4: 0 }, tiedRounds: 0
  };
}

function accumulate(acc: ReturnType<typeof createAccumulator>, result: EvaluationSettlement, self: EvaluationExperiment["self"], support: PayoffSupport) {
  const value = result.deltas[self];
  if (value < support.lower || value > support.upper) throw new Error("Observed payoff violates a-priori support; do not discard this trial.");
  acc.payoff = addMoment(acc.payoff, value);
  const outcome = classify(result, self);
  acc.outcomes[outcome]++;
  acc.ledger.riichiCost += result.riichiCosts[self];
  acc.ledger.winReceipt += result.winReceipts[self];
  acc.ledger.winPayment += result.winPayments[self];
  acc.ledger.drawTransfer += result.drawTransfers[self];
  acc.ledger.kyotakuReceipt += result.kyotakuReceipts[self];
  if (outcome === "self-deal-in") acc.dealInLoss = addMoment(acc.dealInLoss, result.winPayments[self]);
  const ranking = rankOrasuScores(result.scores).find((entry) => entry.seat === self)!;
  acc.ranks[ranking.rank as 1 | 2 | 3 | 4]++;
  if (ranking.tied) acc.tiedRounds++;
  return value;
}

function summarize(acc: ReturnType<typeof createAccumulator>, support: PayoffSupport, complete: boolean): EvaluationPolicySummary {
  const n = acc.payoff.count;
  return {
    // Split the 5% error budget among the two means and their paired difference.
    payoff: estimateMean(acc.payoff, support, 0.05 / 3, complete),
    outcomes: Object.fromEntries(evaluationOutcomeKinds.map((kind) => {
      const events = acc.outcomes[kind], interval = complete && n ? winRateInterval(events, n) : null;
      return [kind, { events, samples: n, rate: n ? events / n : null, interval95: interval ? { lower: interval.lower, upper: interval.upper } : null }];
    })) as EvaluationPolicySummary["outcomes"],
    ledgerMeans: Object.fromEntries(Object.entries(acc.ledger).map(([key, sum]) => [key, n ? sum / n : null])) as EvaluationPolicySummary["ledgerMeans"],
    meanDealInLoss: acc.dealInLoss.count ? acc.dealInLoss.mean : null,
    endOfRoundRank: { ...acc.ranks }, tiedRounds: acc.tiedRounds
  };
}

export function evaluatePairedPushFold(experiment: EvaluationExperiment, trials: readonly PairedEvaluationTrial[]): EvaluationReport {
  validateEvaluationContext(experiment.context);
  evaluationSeats([experiment.self], "self");
  evaluationInteger(experiment.plannedTrials, "plannedTrials", 1);
  if (experiment.sampling !== "iid-fixed-budget" || !["synthetic-fixture", "simulation"].includes(experiment.source)) throw new Error("Unsupported sampling or source.");
  for (const value of [experiment.positionId, experiment.publicStateHash, experiment.opponentModelVersion, experiment.seed, experiment.policyVersions.push, experiment.policyVersions.fold]) if (typeof value !== "string" || !value.trim()) throw new Error("Reproducibility metadata is required.");
  validateSupport(experiment.payoffSupport.push); validateSupport(experiment.payoffSupport.fold);
  if (trials.length > experiment.plannedTrials) throw new Error("Fixed sample budget exceeded.");
  const ids = new Set<string>(), worlds = new Set<string>();
  const push = createAccumulator(), fold = createAccumulator();
  let differences = emptyMoments();
  for (const trial of trials) {
    if (!trial.id?.trim() || !trial.worldId?.trim() || ids.has(trial.id) || worlds.has(trial.worldId)) throw new Error("Trial and world IDs must be nonempty and unique.");
    ids.add(trial.id); worlds.add(trial.worldId);
    // The same starting state and world pair must drive both branches upstream.
    const pushValue = accumulate(push, settlePushFoldRound(experiment.context, trial.push), experiment.self, experiment.payoffSupport.push);
    const foldValue = accumulate(fold, settlePushFoldRound(experiment.context, trial.fold), experiment.self, experiment.payoffSupport.fold);
    differences = addMoment(differences, pushValue - foldValue);
  }
  const complete = trials.length === experiment.plannedTrials;
  const differenceSupport = { lower: experiment.payoffSupport.push.lower - experiment.payoffSupport.fold.upper, upper: experiment.payoffSupport.push.upper - experiment.payoffSupport.fold.lower };
  const difference = estimateMean(differences, differenceSupport, 0.05 / 3, complete);
  return {
    version: PUSH_FOLD_EVALUATION_VERSION, status: complete ? "complete" : "incomplete", visibility: "research-only",
    experiment: structuredClone(experiment), completedPairs: trials.length,
    push: summarize(push, experiment.payoffSupport.push, complete), fold: summarize(fold, experiment.payoffSupport.fold, complete), difference,
    monteCarloConclusion: difference.interval && difference.interval.lower > 0 ? "push-higher" : difference.interval && difference.interval.upper < 0 ? "fold-higher" : "unresolved",
    assumptions: [
      "This is end-of-round point EV conditional on the supplied model, not final-placement utility or a validated strategy recommendation.",
      "Each pair must share one independently sampled latent world. Unique IDs alone cannot establish correct pairing or IID sampling.",
      "Mean intervals share a 95% family confidence budget, assuming fixed-budget IID samples and externally justified payoff support.",
      "Outcome intervals are marginal approximate 95% Wilson intervals, not simultaneous guarantees.",
      "Sampling intervals do not cover model bias, hidden-state inference error, or policy selection on these same samples.",
      "Mean deal-in loss excludes riichi deposits; the payoff ledger includes all accepted deposits and pool receipts.",
      "Ranks describe this round only; equal scores share rank, and ties are counted separately.",
      "Hand legality, yaku detection and rule-profile scoring must be validated before a win claim reaches this ledger."
    ]
  };
}
