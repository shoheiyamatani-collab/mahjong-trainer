import { calculateScore, type LimitName, type Payment, type WinMethod } from "./scoring";

export const ORASU_SEATS = ["east", "south", "west", "north"] as const;

export type OrasuSeat = (typeof ORASU_SEATS)[number];
export type OrasuTargetRank = 1 | 2 | 3;
export type OrasuTiePolicy = "strict" | "allow";
export type OrasuScores = Record<OrasuSeat, number>;

export interface OrasuConditionInput {
  scores: OrasuScores;
  selfSeat: OrasuSeat;
  dealerSeat: OrasuSeat;
  targetRank: OrasuTargetRank;
  honba: number;
  riichiSticks: number;
  tiePolicy: OrasuTiePolicy;
}

export interface OrasuRankingRow {
  seat: OrasuSeat;
  score: number;
  rank: number;
  tied: boolean;
}

export interface OrasuScoreCandidate {
  winMethod: WinMethod;
  han: number;
  fu: number | null;
  yakumanCount: number;
  limitName: LimitName;
  limitLabel: string;
  basePayments: Payment[];
  settlementPayments: Payment[];
  baseTotalPoints: number;
  winnerGain: number;
}

export interface OrasuWinningCondition {
  candidate: OrasuScoreCandidate;
  postScores: OrasuScores;
  postRanking: OrasuRankingRow[];
}

export interface OrasuRonCondition extends OrasuWinningCondition {
  fromSeat: OrasuSeat;
}

export interface OrasuConditionResult {
  input: OrasuConditionInput;
  currentRanking: OrasuRankingRow[];
  alreadyAchieved: boolean;
  pointsToTargetLine: number;
  ron: Record<OrasuSeat, OrasuRonCondition | null>;
  tsumo: OrasuWinningCondition | null;
  easiest:
    | { method: "ron"; fromSeat: OrasuSeat; condition: OrasuRonCondition }
    | { method: "tsumo"; condition: OrasuWinningCondition }
    | null;
}

export interface OrasuDrawResult {
  postScores: OrasuScores;
  postRanking: OrasuRankingRow[];
  tenpaiCount: number;
  tenpaiGain: number;
  notenLoss: number;
}

const FU_CANDIDATES = [20, 25, 30, 40, 50, 60, 70, 80, 90, 100, 110] as const;

export function validateOrasuConditionInput(input: OrasuConditionInput): string[] {
  const errors: string[] = [];

  for (const seat of ORASU_SEATS) {
    const score = input.scores[seat];
    if (!Number.isFinite(score)) {
      errors.push(`${seat}の持ち点を入力してください。`);
    } else if (score < 0) {
      errors.push(`${seat}の持ち点は0点以上で入力してください。`);
    } else if (!Number.isInteger(score) || score % 100 !== 0) {
      errors.push(`${seat}の持ち点は100点単位で入力してください。`);
    }
  }

  if (!ORASU_SEATS.includes(input.selfSeat)) errors.push("自分の席を選んでください。");
  if (!ORASU_SEATS.includes(input.dealerSeat)) errors.push("親の席を選んでください。");
  if (![1, 2, 3].includes(input.targetRank)) errors.push("目標順位を選んでください。");
  if (!Number.isInteger(input.honba) || input.honba < 0) errors.push("本場は0以上の整数で入力してください。");
  if (!Number.isInteger(input.riichiSticks) || input.riichiSticks < 0) errors.push("供託は0以上の整数で入力してください。");

  return errors;
}

export function rankOrasuScores(scores: OrasuScores): OrasuRankingRow[] {
  return ORASU_SEATS.map((seat) => {
    const score = scores[seat];
    const rank = 1 + ORASU_SEATS.filter((other) => scores[other] > score).length;
    return {
      seat,
      score,
      rank,
      tied: ORASU_SEATS.some((other) => other !== seat && scores[other] === score)
    };
  }).sort((a, b) => b.score - a.score || ORASU_SEATS.indexOf(a.seat) - ORASU_SEATS.indexOf(b.seat));
}

export function hasReachedOrasuTarget(
  scores: OrasuScores,
  selfSeat: OrasuSeat,
  targetRank: OrasuTargetRank,
  tiePolicy: OrasuTiePolicy
): boolean {
  const selfScore = scores[selfSeat];
  const opponentsAhead = ORASU_SEATS.filter((seat) => {
    if (seat === selfSeat) return false;
    return tiePolicy === "strict" ? scores[seat] >= selfScore : scores[seat] > selfScore;
  }).length;
  return opponentsAhead < targetRank;
}

export function calculateOrasuConditions(input: OrasuConditionInput): OrasuConditionResult {
  const errors = validateOrasuConditionInput(input);
  if (errors.length > 0) throw new Error(errors.join(" "));

  const currentRanking = rankOrasuScores(input.scores);
  const alreadyAchieved = hasReachedOrasuTarget(input.scores, input.selfSeat, input.targetRank, input.tiePolicy);
  const isDealer = input.selfSeat === input.dealerSeat;
  const ronCandidates = generateOrasuScoreCandidates("ron", isDealer, input.honba, input.riichiSticks);
  const tsumoCandidates = generateOrasuScoreCandidates("tsumo", isDealer, input.honba, input.riichiSticks);
  const ron = Object.fromEntries(
    ORASU_SEATS.map((fromSeat) => [
      fromSeat,
      fromSeat === input.selfSeat || alreadyAchieved
        ? null
        : findRonCondition(input, fromSeat, ronCandidates)
    ])
  ) as Record<OrasuSeat, OrasuRonCondition | null>;
  const tsumo = alreadyAchieved ? null : findTsumoCondition(input, tsumoCandidates);
  const availableRon = ORASU_SEATS.flatMap((seat) => (ron[seat] ? [{ seat, condition: ron[seat] }] : []));
  const easiestRon = availableRon.sort(
    (a, b) => a.condition.candidate.baseTotalPoints - b.condition.candidate.baseTotalPoints
  )[0];
  const easiest = selectEasiestCondition(easiestRon, tsumo);

  return {
    input,
    currentRanking,
    alreadyAchieved,
    pointsToTargetLine: calculatePointsToTargetLine(input),
    ron,
    tsumo,
    easiest
  };
}

export function calculateOrasuDraw(
  scores: OrasuScores,
  tenpaiSeats: readonly OrasuSeat[]
): OrasuDrawResult {
  const uniqueTenpai = new Set(tenpaiSeats);
  const tenpaiCount = uniqueTenpai.size;
  const postScores = { ...scores };

  if (tenpaiCount > 0 && tenpaiCount < 4) {
    const tenpaiGain = 3000 / tenpaiCount;
    const notenLoss = 3000 / (4 - tenpaiCount);
    for (const seat of ORASU_SEATS) {
      postScores[seat] += uniqueTenpai.has(seat) ? tenpaiGain : -notenLoss;
    }
    return { postScores, postRanking: rankOrasuScores(postScores), tenpaiCount, tenpaiGain, notenLoss };
  }

  return { postScores, postRanking: rankOrasuScores(postScores), tenpaiCount, tenpaiGain: 0, notenLoss: 0 };
}

export function formatOrasuCandidate(candidate: OrasuScoreCandidate): string {
  if (candidate.winMethod === "ron") {
    return `${candidate.basePayments[0]?.points.toLocaleString("ja-JP")}点ロン`;
  }
  if (candidate.basePayments.length === 1) {
    return `${candidate.basePayments[0]?.points.toLocaleString("ja-JP")}点オール`;
  }
  return `${candidate.basePayments[0]?.points.toLocaleString("ja-JP")}・${candidate.basePayments[1]?.points.toLocaleString("ja-JP")}点ツモ`;
}

function calculatePointsToTargetLine(input: OrasuConditionInput): number {
  const opponentScores = ORASU_SEATS.filter((seat) => seat !== input.selfSeat)
    .map((seat) => input.scores[seat])
    .sort((a, b) => b - a);
  const boundaryScore = opponentScores[input.targetRank - 1] ?? 0;
  const requiredScore = boundaryScore + (input.tiePolicy === "strict" ? 1 : 0);
  return Math.max(0, requiredScore - input.scores[input.selfSeat]);
}

function generateOrasuScoreCandidates(
  winMethod: WinMethod,
  isDealer: boolean,
  honba: number,
  riichiSticks: number
): OrasuScoreCandidate[] {
  const definitions: Array<{ han: number; fu: number | null; yakumanCount: number }> = [
    { han: 0, fu: null, yakumanCount: 1 }
  ];

  for (let han = 1; han <= 13; han += 1) {
    for (const fu of FU_CANDIDATES) {
      if (!isPlausibleScoreShape(winMethod, han, fu)) continue;
      definitions.push({ han, fu, yakumanCount: 0 });
    }
  }

  const unique = new Map<string, OrasuScoreCandidate>();
  for (const definition of definitions) {
    const base = calculateScore({
      ...definition,
      isDealer,
      winMethod,
      honba: 0,
      riichiSticks: 0
    });
    const settlement = calculateScore({
      ...definition,
      isDealer,
      winMethod,
      honba,
      riichiSticks
    });
    const key = base.payments.map((payment) => `${payment.label}:${payment.points}`).join("|");
    if (unique.has(key)) continue;
    unique.set(key, {
      winMethod,
      han: definition.han,
      fu: definition.fu,
      yakumanCount: definition.yakumanCount,
      limitName: base.limitName,
      limitLabel: base.limitLabel,
      basePayments: base.payments,
      settlementPayments: settlement.payments,
      baseTotalPoints: base.totalPoints,
      winnerGain: settlement.totalPoints
    });
  }

  return Array.from(unique.values()).sort((a, b) => a.baseTotalPoints - b.baseTotalPoints);
}

function isPlausibleScoreShape(winMethod: WinMethod, han: number, fu: number): boolean {
  if (fu === 20) return winMethod === "tsumo" && han >= 2;
  if (fu === 25) return han >= (winMethod === "tsumo" ? 3 : 2);
  return true;
}

function findRonCondition(
  input: OrasuConditionInput,
  fromSeat: OrasuSeat,
  candidates: readonly OrasuScoreCandidate[]
): OrasuRonCondition | null {
  for (const candidate of candidates) {
    const payment = candidate.settlementPayments[0]?.points ?? 0;
    const postScores = { ...input.scores };
    postScores[input.selfSeat] += payment + input.riichiSticks * 1000;
    postScores[fromSeat] -= payment;
    if (hasReachedOrasuTarget(postScores, input.selfSeat, input.targetRank, input.tiePolicy)) {
      return { fromSeat, candidate, postScores, postRanking: rankOrasuScores(postScores) };
    }
  }
  return null;
}

function findTsumoCondition(
  input: OrasuConditionInput,
  candidates: readonly OrasuScoreCandidate[]
): OrasuWinningCondition | null {
  const selfIsDealer = input.selfSeat === input.dealerSeat;
  for (const candidate of candidates) {
    const postScores = { ...input.scores };
    for (const seat of ORASU_SEATS) {
      if (seat === input.selfSeat) continue;
      const payment = selfIsDealer
        ? candidate.settlementPayments[0]?.points ?? 0
        : seat === input.dealerSeat
          ? candidate.settlementPayments.find((item) => item.label === "親")?.points ?? 0
          : candidate.settlementPayments.find((item) => item.label === "子")?.points ?? 0;
      postScores[seat] -= payment;
    }
    postScores[input.selfSeat] += candidate.winnerGain;
    if (hasReachedOrasuTarget(postScores, input.selfSeat, input.targetRank, input.tiePolicy)) {
      return { candidate, postScores, postRanking: rankOrasuScores(postScores) };
    }
  }
  return null;
}

function selectEasiestCondition(
  easiestRon: { seat: OrasuSeat; condition: OrasuRonCondition } | undefined,
  tsumo: OrasuWinningCondition | null
): OrasuConditionResult["easiest"] {
  if (!easiestRon && !tsumo) return null;
  if (!easiestRon && tsumo) return { method: "tsumo", condition: tsumo };
  if (easiestRon && !tsumo) return { method: "ron", fromSeat: easiestRon.seat, condition: easiestRon.condition };
  if (tsumo && easiestRon && tsumo.candidate.baseTotalPoints < easiestRon.condition.candidate.baseTotalPoints) {
    return { method: "tsumo", condition: tsumo };
  }
  return { method: "ron", fromSeat: easiestRon!.seat, condition: easiestRon!.condition };
}
