export const PRACTICAL_TENPAI_SCORING_VERSION = "practical-tenpai-v1";

export const PRACTICAL_TENPAI_TURN_WEIGHTS = [
  { minTurn: 0, maxTurn: 6, weight: 1 },
  { minTurn: 7, maxTurn: 9, weight: 0.85 },
  { minTurn: 10, maxTurn: 12, weight: 0.65 },
  { minTurn: 13, maxTurn: 15, weight: 0.35 },
  { minTurn: 16, maxTurn: Number.POSITIVE_INFINITY, weight: 0.15 },
] as const;

export const PRACTICAL_TENPAI_SITUATION_WEIGHTS = {
  BEFORE_OPPONENT_RIICHI: 1,
  AFTER_OPPONENT_RIICHI: 0.4,
  NOT_REACHED: 0,
} as const;

export type PracticalTenpaiSituation = keyof typeof PRACTICAL_TENPAI_SITUATION_WEIGHTS;

export interface PracticalTenpaiScoreInput {
  reachedTargetTenpai: boolean;
  firstTargetTenpaiTurn: number | null;
  firstTargetTenpaiEventOrder: number | null;
  firstOpponentRiichiEventOrder: number | null;
}

export interface PracticalTenpaiScoreResult {
  turnWeight: number;
  situationWeight: number;
  trialScore: number;
  situation: PracticalTenpaiSituation;
}

export interface PracticalTenpaiTurnDistribution {
  throughTurn6Rate: number;
  turn7To9Rate: number;
  turn10To12Rate: number;
  turn13To15Rate: number;
  turn16PlusRate: number;
  notReachedRate: number;
}

export interface PracticalTenpaiTurnDistributionCounts {
  throughTurn6Count: number;
  turn7To9Count: number;
  turn10To12Count: number;
  turn13To15Count: number;
  turn16PlusCount: number;
  notReachedCount: number;
}

export interface PracticalTenpaiMetrics {
  practicalTenpaiScore: number;
  rawTenpaiRate: number;
  tenpaiByTurn6Count: number;
  tenpaiByTurn6Rate: number;
  tenpaiByTurn8Count: number;
  tenpaiByTurn8Rate: number;
  tenpaiByTurn10Count: number;
  tenpaiByTurn10Rate: number;
  tenpaiByTurn12Count: number;
  tenpaiByTurn12Rate: number;
  tenpaiByTurn15Count: number;
  tenpaiByTurn15Rate: number;
  preemptiveTenpaiCount: number;
  preemptiveTenpaiRate: number;
  chasingTenpaiCount: number;
  chasingTenpaiRate: number;
  averageFirstTenpaiTurn: number | null;
  totalPracticalTenpaiTrialScore: number;
  totalPracticalTenpaiScoreUnits: number;
  practicalTenpaiScoringVersion: string;
  tenpaiTurnDistribution: PracticalTenpaiTurnDistribution;
  tenpaiTurnDistributionCounts: PracticalTenpaiTurnDistributionCounts;
}

export function practicalTenpaiTurnWeight(turn: number | null): number {
  if (turn == null || !Number.isFinite(turn) || turn < 0) return 0;
  return PRACTICAL_TENPAI_TURN_WEIGHTS.find((range) => turn >= range.minTurn && turn <= range.maxTurn)?.weight ?? 0;
}

export function classifyTenpaiSituation(
  reachedTargetTenpai: boolean,
  firstTargetTenpaiEventOrder: number | null,
  firstOpponentRiichiEventOrder: number | null,
): PracticalTenpaiSituation {
  if (!reachedTargetTenpai) return "NOT_REACHED";
  if (firstTargetTenpaiEventOrder == null) {
    return firstOpponentRiichiEventOrder == null ? "BEFORE_OPPONENT_RIICHI" : "AFTER_OPPONENT_RIICHI";
  }
  if (firstOpponentRiichiEventOrder == null || firstTargetTenpaiEventOrder < firstOpponentRiichiEventOrder) {
    return "BEFORE_OPPONENT_RIICHI";
  }
  return "AFTER_OPPONENT_RIICHI";
}

export function calculatePracticalTenpaiTrialScore(
  input: PracticalTenpaiScoreInput,
): PracticalTenpaiScoreResult {
  const situation = classifyTenpaiSituation(
    input.reachedTargetTenpai,
    input.firstTargetTenpaiEventOrder,
    input.firstOpponentRiichiEventOrder,
  );
  const turnWeight = situation === "NOT_REACHED" ? 0 : practicalTenpaiTurnWeight(input.firstTargetTenpaiTurn);
  const situationWeight = PRACTICAL_TENPAI_SITUATION_WEIGHTS[situation];
  return { turnWeight, situationWeight, trialScore: turnWeight * situationWeight, situation };
}

export function aggregatePracticalTenpaiMetrics(
  inputs: readonly PracticalTenpaiScoreInput[],
): PracticalTenpaiMetrics {
  const validTrials = inputs.length;
  const rate = (count: number) => validTrials === 0 ? 0 : count / validTrials;
  const reached = inputs.filter((input) => input.reachedTargetTenpai && input.firstTargetTenpaiTurn != null);
  const scores = inputs.map(calculatePracticalTenpaiTrialScore);
  const byTurn = (turn: number) => reached.filter((input) => input.firstTargetTenpaiTurn! <= turn).length;
  const preemptiveTenpaiCount = scores.filter((score) => score.situation === "BEFORE_OPPONENT_RIICHI").length;
  const chasingTenpaiCount = scores.filter((score) => score.situation === "AFTER_OPPONENT_RIICHI").length;
  const totalPracticalTenpaiScoreUnits = scores.reduce(
    (sum, score) => sum + Math.round(score.trialScore * 100),
    0,
  );
  const totalPracticalTenpaiTrialScore = totalPracticalTenpaiScoreUnits / 100;
  const turn6 = byTurn(6);
  const turn8 = byTurn(8);
  const turn10 = byTurn(10);
  const turn12 = byTurn(12);
  const turn15 = byTurn(15);
  const turn7To9 = reached.filter((input) => input.firstTargetTenpaiTurn! >= 7 && input.firstTargetTenpaiTurn! <= 9).length;
  const turn10To12 = reached.filter((input) => input.firstTargetTenpaiTurn! >= 10 && input.firstTargetTenpaiTurn! <= 12).length;
  const turn13To15 = reached.filter((input) => input.firstTargetTenpaiTurn! >= 13 && input.firstTargetTenpaiTurn! <= 15).length;
  const turn16Plus = reached.filter((input) => input.firstTargetTenpaiTurn! >= 16).length;
  const result: PracticalTenpaiMetrics = {
    practicalTenpaiScore: validTrials === 0 ? 0 : totalPracticalTenpaiScoreUnits / validTrials,
    rawTenpaiRate: rate(reached.length),
    tenpaiByTurn6Count: turn6,
    tenpaiByTurn6Rate: rate(turn6),
    tenpaiByTurn8Count: turn8,
    tenpaiByTurn8Rate: rate(turn8),
    tenpaiByTurn10Count: turn10,
    tenpaiByTurn10Rate: rate(turn10),
    tenpaiByTurn12Count: turn12,
    tenpaiByTurn12Rate: rate(turn12),
    tenpaiByTurn15Count: turn15,
    tenpaiByTurn15Rate: rate(turn15),
    preemptiveTenpaiCount,
    preemptiveTenpaiRate: rate(preemptiveTenpaiCount),
    chasingTenpaiCount,
    chasingTenpaiRate: rate(chasingTenpaiCount),
    averageFirstTenpaiTurn: reached.length === 0
      ? null
      : reached.reduce((sum, input) => sum + input.firstTargetTenpaiTurn!, 0) / reached.length,
    totalPracticalTenpaiTrialScore,
    totalPracticalTenpaiScoreUnits,
    practicalTenpaiScoringVersion: PRACTICAL_TENPAI_SCORING_VERSION,
    tenpaiTurnDistribution: {
      throughTurn6Rate: rate(turn6),
      turn7To9Rate: rate(turn7To9),
      turn10To12Rate: rate(turn10To12),
      turn13To15Rate: rate(turn13To15),
      turn16PlusRate: rate(turn16Plus),
      notReachedRate: rate(validTrials - reached.length),
    },
    tenpaiTurnDistributionCounts: {
      throughTurn6Count: turn6,
      turn7To9Count: turn7To9,
      turn10To12Count: turn10To12,
      turn13To15Count: turn13To15,
      turn16PlusCount: turn16Plus,
      notReachedCount: validTrials - reached.length,
    },
  };
  assertPracticalTenpaiMetrics(result);
  return result;
}

export function assertPracticalTenpaiMetrics(metrics: PracticalTenpaiMetrics): void {
  const rates = [
    metrics.tenpaiByTurn6Rate,
    metrics.tenpaiByTurn8Rate,
    metrics.tenpaiByTurn10Rate,
    metrics.tenpaiByTurn12Rate,
    metrics.tenpaiByTurn15Rate,
    metrics.rawTenpaiRate,
  ];
  if (rates.some((rate, index) => index > 0 && rate + Number.EPSILON < rates[index - 1]!)) {
    throw new Error("Practical tenpai reach rates must be monotonic.");
  }
  if (Math.abs(metrics.preemptiveTenpaiRate + metrics.chasingTenpaiRate - metrics.rawTenpaiRate) > 1e-12) {
    throw new Error("Preemptive and chasing tenpai rates must add up to the raw tenpai rate.");
  }
  if (metrics.practicalTenpaiScore < 0 || metrics.practicalTenpaiScore > 100 + Number.EPSILON) {
    throw new Error("Practical tenpai score must be between 0 and 100.");
  }
}
