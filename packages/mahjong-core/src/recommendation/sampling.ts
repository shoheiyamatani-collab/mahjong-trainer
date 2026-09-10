import type { HandTargetRankingRoleId } from "../startingHandRanking";
import type { StrategyEvaluation } from "./types";

export const ADAPTIVE_SAMPLING_STAGES = [100, 300, 1000, 3000] as const;
export const ADAPTIVE_SAMPLING_VERSION = "recommendation-adaptive-1.0.0";
export interface AdaptiveSamplingDecision {
  roles: HandTargetRankingRoleId[];
  targetTrials: number | null;
  reason: "clear" | "close" | "limit" | "hand-only";
}

export function selectAdaptiveSampling(
  strategies: readonly StrategyEvaluation[],
  currentStage: number,
  maxTrials = 1000,
): AdaptiveSamplingDecision {
  const next = ADAPTIVE_SAMPLING_STAGES.find((stage) => stage > currentStage && stage <= maxTrials);
  if (!next) return { roles: [], targetTrials: null, reason: "limit" };
  const leader = strategies[0];
  if (!leader) return { roles: [], targetTrials: null, reason: "clear" };
  const bestByRole = new Map<HandTargetRankingRoleId, StrategyEvaluation>();
  for (const strategy of strategies) {
    if (!strategy.sourceRoleId || !strategy.simulation || strategy.simulation.trials <= 0) continue;
    if (!bestByRole.has(strategy.sourceRoleId)) bestByRole.set(strategy.sourceRoleId, strategy);
  }
  const best = [...bestByRole.values()].sort((a, b) => b.overallScore - a.overallScore);
  // Sequential screening, not a statistical proof of the best strategy. The bound is deliberately conservative.
  const error = (strategy: StrategyEvaluation) => 20 * (strategy.simulation?.winRateError ?? 0);
  const contenders = best.filter((strategy) => leader.overallScore - strategy.overallScore <= 4 + error(strategy) + error(leader));
  if (contenders.length === 0 || (contenders.length === 1 && contenders[0]?.id === leader.id)) {
    return { roles: [], targetTrials: null, reason: leader.simulation ? "clear" : "hand-only" };
  }
  const roles = contenders.slice(0, 4).filter((strategy) => strategy.simulation!.trials < next).map((strategy) => strategy.sourceRoleId!);
  return { roles, targetTrials: roles.length ? next : null, reason: roles.length ? "close" : "clear" };
}
