import { calculateScore } from "../scoring";
import { calculateOrasuDraw, ORASU_SEATS, type OrasuScores, type OrasuSeat } from "../orasuCondition";
import { PUSH_FOLD_EVALUATION_VERSION, type EvaluationBranch, type EvaluationRoundContext, type EvaluationSettlement, type EvaluationWinClaim } from "./types";

const zeroScores = (): OrasuScores => ({ east: 0, south: 0, west: 0, north: 0 });
export function evaluationInteger(value: number, label: string, minimum = 0) {
  if (!Number.isSafeInteger(value) || value < minimum) throw new Error(`${label} must be a safe integer >= ${minimum}.`);
}
export function evaluationSeats(value: readonly OrasuSeat[], label: string) {
  if (!Array.isArray(value) || value.some((seat) => !ORASU_SEATS.includes(seat)) || new Set(value).size !== value.length) throw new Error(`${label} contains invalid or repeated seats.`);
}
export function validateEvaluationContext(context: EvaluationRoundContext) {
  evaluationSeats([context.dealer], "dealer");
  if (!context.scores || Object.keys(context.scores).length !== 4 || ORASU_SEATS.some((seat) => !Number.isSafeInteger(context.scores[seat]) || context.scores[seat] % 100)) throw new Error("Scores must contain four 100-point balances.");
  evaluationInteger(context.honba, "honba"); evaluationInteger(context.kyotaku, "kyotaku");
  evaluationSeats(context.existingRiichi, "existingRiichi");
  if (context.existingRiichi.length > context.kyotaku) throw new Error("Existing riichi declarations exceed the pool.");
  if (!context.rules || !context.rules.id || !["head-bump", "multiple"].includes(context.rules.ronResolution) || !["abort", "allow"].includes(context.rules.tripleRon)) throw new Error("Unknown settlement rules.");
  if (!Number.isSafeInteger(context.kyotaku * 1000) || !Number.isSafeInteger(ORASU_SEATS.reduce((sum, seat) => sum + Math.abs(context.scores[seat]), context.kyotaku * 1000))) throw new Error("The point mass exceeds safe precision.");
}
function validateClaim(claim: EvaluationWinClaim) {
  evaluationSeats([claim.winner], "winner");
  evaluationInteger(claim.han, "han"); evaluationInteger(claim.yakumanCount ?? 0, "yakumanCount");
  if (claim.yakumanCount) return;
  if (claim.han === 0) throw new Error("No-yaku claims cannot be settled as wins.");
  if (claim.fu === null || !Number.isSafeInteger(claim.fu) || claim.fu < 20 || claim.fu !== 25 && claim.fu % 10) throw new Error("Invalid fu.");
}

export function settlePushFoldRound(context: EvaluationRoundContext, branch: EvaluationBranch): EvaluationSettlement {
  validateEvaluationContext(context);
  evaluationSeats(branch.acceptedRiichi, "acceptedRiichi");
  if (branch.unacceptedDeclaration !== undefined) {
    evaluationSeats([branch.unacceptedDeclaration], "unacceptedDeclaration");
    if (branch.terminal.kind !== "ron" || branch.terminal.from !== branch.unacceptedDeclaration || branch.acceptedRiichi.includes(branch.unacceptedDeclaration) || context.existingRiichi.includes(branch.unacceptedDeclaration)) throw new Error("An unaccepted declaration must be the immediate ron discard, not an accepted riichi.");
  }
  const result: EvaluationSettlement = {
    version: PUSH_FOLD_EVALUATION_VERSION, scores: { ...context.scores }, deltas: zeroScores(), kyotaku: context.kyotaku,
    winners: [], discarder: null, kind: branch.terminal.kind, dealerContinues: false, nextHonba: 0,
    riichiCosts: zeroScores(), winReceipts: zeroScores(), winPayments: zeroScores(), drawTransfers: zeroScores(), kyotakuReceipts: zeroScores()
  };
  for (const seat of branch.acceptedRiichi) {
    if (context.existingRiichi.includes(seat) || result.scores[seat] < 1000) throw new Error("Riichi deposit is duplicated or unaffordable.");
    result.scores[seat] -= 1000; result.riichiCosts[seat] = 1000; result.kyotaku++;
  }
  const transferWin = (from: OrasuSeat, to: OrasuSeat, points: number) => {
    evaluationInteger(points, "payment", 100);
    if (points % 100) throw new Error("Payments must use 100-point units.");
    result.scores[from] -= points; result.scores[to] += points;
    if (!Number.isSafeInteger(result.scores[from]) || !Number.isSafeInteger(result.scores[to])) throw new Error("Settlement exceeds safe precision.");
    result.winPayments[from] += points; result.winReceipts[to] += points;
  };
  const awardPool = (winner: OrasuSeat) => {
    const points = result.kyotaku * 1000;
    result.scores[winner] += points; result.kyotakuReceipts[winner] = points; result.kyotaku = 0;
  };
  const terminal = branch.terminal;
  if (terminal.kind === "ron") {
    evaluationSeats([terminal.from], "discarder");
    if (!terminal.claims.length || terminal.claims.length > 3) throw new Error("Ron requires 1-3 claims.");
    evaluationSeats(terminal.claims.map((claim) => claim.winner), "ron winners");
    terminal.claims.forEach(validateClaim);
    if (terminal.claims.some((claim) => claim.winner === terminal.from)) throw new Error("A ron winner cannot be the discarder.");
    const order = [...terminal.claims].sort((a, b) => (ORASU_SEATS.indexOf(a.winner) - ORASU_SEATS.indexOf(terminal.from) + 4) % 4 - (ORASU_SEATS.indexOf(b.winner) - ORASU_SEATS.indexOf(terminal.from) + 4) % 4);
    if (order.length === 3 && context.rules.tripleRon === "abort") {
      result.kind = "abortive-draw"; result.dealerContinues = true; result.nextHonba = context.honba + 1;
    } else {
      const awarded = context.rules.ronResolution === "head-bump" ? order.slice(0, 1) : order;
      for (const claim of awarded) {
        const score = calculateScore({ ...claim, isDealer: claim.winner === context.dealer, winMethod: "ron", honba: context.honba, riichiSticks: 0 });
        transferWin(terminal.from, claim.winner, score.payments[0]!.points);
      }
      result.winners = awarded.map((claim) => claim.winner); result.discarder = terminal.from;
      awardPool(awarded[0]!.winner);
      result.dealerContinues = result.winners.includes(context.dealer); result.nextHonba = result.dealerContinues ? context.honba + 1 : 0;
    }
  } else if (terminal.kind === "tsumo") {
    validateClaim(terminal.claim);
    const claim = terminal.claim, dealerWin = claim.winner === context.dealer;
    const score = calculateScore({ ...claim, isDealer: dealerWin, winMethod: "tsumo", honba: context.honba, riichiSticks: 0 });
    for (const from of ORASU_SEATS) if (from !== claim.winner) transferWin(from, claim.winner, score.payments[dealerWin || from !== context.dealer ? 0 : 1]!.points);
    result.winners = [claim.winner]; awardPool(claim.winner);
    result.dealerContinues = dealerWin; result.nextHonba = dealerWin ? context.honba + 1 : 0;
  } else if (terminal.kind === "exhaustive-draw") {
    evaluationSeats(terminal.tenpai, "tenpai");
    const draw = calculateOrasuDraw(result.scores, terminal.tenpai);
    for (const seat of ORASU_SEATS) result.drawTransfers[seat] = draw.postScores[seat] - result.scores[seat];
    result.scores = draw.postScores; result.dealerContinues = terminal.tenpai.includes(context.dealer); result.nextHonba = context.honba + 1;
  } else if (terminal.kind === "abortive-draw" && typeof terminal.reason === "string" && terminal.reason.trim()) {
    result.dealerContinues = true; result.nextHonba = context.honba + 1;
  } else throw new Error("Unsupported terminal event.");
  evaluationInteger(result.nextHonba, "nextHonba"); evaluationInteger(result.kyotaku, "remaining kyotaku");
  for (const seat of ORASU_SEATS) {
    result.deltas[seat] = result.scores[seat] - context.scores[seat];
    if (!Number.isSafeInteger(result.scores[seat]) || !Number.isSafeInteger(result.deltas[seat])) throw new Error("Settlement exceeds safe precision.");
    const accounted = -result.riichiCosts[seat] + result.winReceipts[seat] - result.winPayments[seat] + result.drawTransfers[seat] + result.kyotakuReceipts[seat];
    if (accounted !== result.deltas[seat]) throw new Error("Unaccounted point transfer.");
  }
  const beforeMass = ORASU_SEATS.reduce((sum, seat) => sum + context.scores[seat], context.kyotaku * 1000);
  const afterMass = ORASU_SEATS.reduce((sum, seat) => sum + result.scores[seat], result.kyotaku * 1000);
  if (beforeMass !== afterMass) throw new Error("Points plus kyotaku were not conserved.");
  return result;
}
