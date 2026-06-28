export type WinMethod = "ron" | "tsumo";
export type LimitName = "normal" | "mangan" | "haneman" | "baiman" | "sanbaiman" | "yakuman";

export interface ScoreInput {
  han: number;
  fu: number | null;
  isDealer: boolean;
  winMethod: WinMethod;
  yakumanCount?: number;
  honba?: number;
  riichiSticks?: number;
}

export interface Payment {
  label: string;
  points: number;
}

export interface ScoreResult {
  totalPoints: number;
  payments: Payment[];
  limitName: LimitName;
  limitLabel: string;
  han: number;
  fu: number | null;
  basePoints: number;
}

const LIMIT_LABELS: Record<LimitName, string> = {
  normal: "通常",
  mangan: "満貫",
  haneman: "跳満",
  baiman: "倍満",
  sanbaiman: "三倍満",
  yakuman: "役満"
};

export function calculateScore(scoreInput: ScoreInput): ScoreResult {
  validateScoreInput(scoreInput);

  const yakumanCount = scoreInput.yakumanCount ?? 0;
  const [limitName, basePoints] = yakumanCount
    ? ["yakuman" as const, 8000 * yakumanCount]
    : basePointsFor(scoreInput.han, scoreInput.fu ?? 0);
  const { payments, total } = paymentsFor({
    basePoints,
    isDealer: scoreInput.isDealer,
    winMethod: scoreInput.winMethod,
    honba: scoreInput.honba ?? 0,
    riichiSticks: scoreInput.riichiSticks ?? 0
  });

  return {
    totalPoints: total,
    payments,
    limitName,
    limitLabel: LIMIT_LABELS[limitName],
    han: scoreInput.han,
    fu: yakumanCount ? null : scoreInput.fu,
    basePoints
  };
}

function basePointsFor(han: number, fu: number): [LimitName, number] {
  if (han >= 13) return ["yakuman", 8000];
  if (han >= 11) return ["sanbaiman", 6000];
  if (han >= 8) return ["baiman", 4000];
  if (han >= 6) return ["haneman", 3000];
  const rawBase = fu * 2 ** (han + 2);
  if (han >= 5 || rawBase >= 2000) return ["mangan", 2000];
  return ["normal", rawBase];
}

function paymentsFor({
  basePoints,
  isDealer,
  winMethod,
  honba,
  riichiSticks
}: {
  basePoints: number;
  isDealer: boolean;
  winMethod: WinMethod;
  honba: number;
  riichiSticks: number;
}): { payments: Payment[]; total: number } {
  const riichiBonus = riichiSticks * 1000;

  if (winMethod === "ron") {
    const multiplier = isDealer ? 6 : 4;
    const points = ceil100(basePoints * multiplier) + honba * 300;
    return { payments: [{ label: "放銃者", points }], total: points + riichiBonus };
  }

  if (isDealer) {
    const payment = ceil100(basePoints * 2) + honba * 100;
    return { payments: [{ label: "子全員", points: payment }], total: payment * 3 + riichiBonus };
  }

  const childPayment = ceil100(basePoints) + honba * 100;
  const dealerPayment = ceil100(basePoints * 2) + honba * 100;
  return {
    payments: [
      { label: "子", points: childPayment },
      { label: "親", points: dealerPayment }
    ],
    total: childPayment * 2 + dealerPayment + riichiBonus
  };
}

function ceil100(value: number): number {
  return Math.ceil(value / 100) * 100;
}

function validateScoreInput(scoreInput: ScoreInput): void {
  if (!["ron", "tsumo"].includes(scoreInput.winMethod)) {
    throw new Error("winMethod must be 'ron' or 'tsumo'.");
  }
  if ((scoreInput.honba ?? 0) < 0) {
    throw new Error("honba cannot be negative.");
  }
  if ((scoreInput.riichiSticks ?? 0) < 0) {
    throw new Error("riichiSticks cannot be negative.");
  }
  const yakumanCount = scoreInput.yakumanCount ?? 0;
  if (yakumanCount < 0) {
    throw new Error("yakumanCount cannot be negative.");
  }
  if (yakumanCount) {
    if (scoreInput.han < 0) {
      throw new Error("han cannot be negative.");
    }
    return;
  }
  if (scoreInput.han <= 0) {
    throw new Error("han must be positive.");
  }
  if (scoreInput.fu == null) {
    throw new Error("fu is required for non-yakuman hands.");
  }
  if (scoreInput.fu < 20) {
    throw new Error("fu must be at least 20.");
  }
  if (scoreInput.fu !== 25 && scoreInput.fu % 10 !== 0) {
    throw new Error("fu must be 25 or a multiple of 10.");
  }
}
