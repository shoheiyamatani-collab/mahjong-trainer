import type { OrasuScores, OrasuSeat } from "../orasuCondition";

export const PUSH_FOLD_EVALUATION_VERSION = "push-fold-accounting-1.0.0";
export type EvaluationPolicy = "push" | "fold";
export type EvaluationRules = {
  id: string;
  ronResolution: "head-bump" | "multiple";
  tripleRon: "abort" | "allow";
};
export type EvaluationRoundContext = {
  scores: OrasuScores;
  dealer: OrasuSeat;
  honba: number;
  kyotaku: number;
  existingRiichi: OrasuSeat[];
  rules: EvaluationRules;
};
// A claim must be derived from a validated hand. This ledger does not establish yaku.
export type EvaluationWinClaim = {
  winner: OrasuSeat;
  han: number;
  fu: number | null;
  yakumanCount?: number;
};
export type EvaluationTerminal =
  | { kind: "ron"; from: OrasuSeat; claims: EvaluationWinClaim[] }
  | { kind: "tsumo"; claim: EvaluationWinClaim }
  | { kind: "exhaustive-draw"; tenpai: OrasuSeat[] }
  | { kind: "abortive-draw"; reason: string };
export type EvaluationBranch = {
  // Only accepted declarations. A declaration tile dealt in does NOT pay this deposit.
  acceptedRiichi: OrasuSeat[];
  // An attempted declaration whose tile was immediately dealt in, before acceptance.
  unacceptedDeclaration?: OrasuSeat;
  terminal: EvaluationTerminal;
};
export type EvaluationSettlement = {
  version: typeof PUSH_FOLD_EVALUATION_VERSION;
  scores: OrasuScores;
  deltas: OrasuScores;
  kyotaku: number;
  winners: OrasuSeat[];
  discarder: OrasuSeat | null;
  kind: EvaluationTerminal["kind"];
  dealerContinues: boolean;
  nextHonba: number;
  riichiCosts: OrasuScores;
  winReceipts: OrasuScores;
  winPayments: OrasuScores;
  drawTransfers: OrasuScores;
  kyotakuReceipts: OrasuScores;
};
export type PairedEvaluationTrial = {
  id: string;
  worldId: string;
  push: EvaluationBranch;
  fold: EvaluationBranch;
};
export type PayoffSupport = { lower: number; upper: number };
export type EvaluationExperiment = {
  positionId: string;
  publicStateHash: string;
  opponentModelVersion: string;
  policyVersions: Record<EvaluationPolicy, string>;
  source: "synthetic-fixture" | "simulation";
  seed: string;
  sampling: "iid-fixed-budget";
  plannedTrials: number;
  self: OrasuSeat;
  context: EvaluationRoundContext;
  payoffSupport: Record<EvaluationPolicy, PayoffSupport>;
};
export type RunningMoments = { count: number; mean: number; m2: number };
export type MeanEstimate = {
  samples: number;
  mean: number | null;
  sampleVariance: number | null;
  standardError: number | null;
  interval: { lower: number; upper: number; method: "empirical-bernstein" | "support-only" } | null;
};
export const evaluationOutcomeKinds = ["self-ron", "self-tsumo", "self-deal-in", "other-tsumo", "other-ron", "exhaustive-draw", "abortive-draw"] as const;
export type EvaluationOutcomeKind = typeof evaluationOutcomeKinds[number];
export type ProbabilityEstimate = { events: number; samples: number; rate: number | null; interval95: { lower: number; upper: number } | null };
export type EvaluationPolicySummary = {
  payoff: MeanEstimate;
  outcomes: Record<EvaluationOutcomeKind, ProbabilityEstimate>;
  ledgerMeans: Record<"riichiCost" | "winReceipt" | "winPayment" | "drawTransfer" | "kyotakuReceipt", number | null>;
  meanDealInLoss: number | null;
  endOfRoundRank: Record<1 | 2 | 3 | 4, number>;
  tiedRounds: number;
};
export type EvaluationReport = {
  version: typeof PUSH_FOLD_EVALUATION_VERSION;
  status: "complete" | "incomplete";
  visibility: "research-only";
  experiment: EvaluationExperiment;
  completedPairs: number;
  push: EvaluationPolicySummary;
  fold: EvaluationPolicySummary;
  difference: MeanEstimate;
  monteCarloConclusion: "push-higher" | "fold-higher" | "unresolved";
  assumptions: string[];
};
