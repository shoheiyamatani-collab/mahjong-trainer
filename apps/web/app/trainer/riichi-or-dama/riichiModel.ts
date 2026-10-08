import { addTile, analyzeHandProgress, calculateHandScore, countsToTiles, DEFAULT_RIICHI_RULE_CONFIG, evaluateRiichiLegality, hasReachedOrasuTarget, ORASU_SEATS, parseHand, rankOrasuScores, tileIndex, validateCounts, type Counts34, type HandScoreResult, type OrasuScores, type Tile } from "@mahjong-trainer/mahjong-core";
import { doraFromIndicator, difficultyLabels, parseCallHistory, type CallDifficulty, type CallHistory } from "../call-or-pass/callModel";

export { difficultyLabels };
export const actionLabels = { riichi: "リーチ", dama: "ダマ" };
export const categoryLabels = { yaku: "役の有無", value: "打点の比較", shape: "待ちと手変わり", defense: "攻守の判断", conditions: "オーラス条件", rules: "宣言条件" };
export const winds = ["東", "南", "西", "北"] as const;
export type RiichiAction = keyof typeof actionLabels;
export type RiichiDifficulty = CallDifficulty;
export type RiichiCategory = keyof typeof categoryLabels;
export type RiichiQuestion = {
  id: string; difficulty: RiichiDifficulty; category: RiichiCategory; title: string;
  hand: string; discard: Tile; roundWind: "東" | "南"; roundNumber: number;
  seatWind: typeof winds[number]; turn: number; wallTilesRemaining: number;
  scores: [number, number, number, number]; doraIndicator: Tile;
  rivers?: Partial<Record<typeof winds[number], Tile[]>>;
  opponentRiichi?: typeof winds[number]; riichiSticks: number;
  targetRank?: 1 | 2 | 3;
  context: string; recommendedAction: RiichiAction; confidence: "high" | "medium";
  explanation: string; checkpoint: string;
};
export type RiichiValue = Pick<HandScoreResult["score"], "han" | "fu" | "payments" | "totalPoints"> & { yaku: string[] };
export type RiichiWait = { tile: Tile; remaining: number; ron: RiichiValue | null; ronBlocked: "役なし" | "フリテン" | null; tsumo: RiichiValue };
export type RiichiOutcome = { tile: Tile; method: string; scores: OrasuScores; rank: number; tied: boolean; achieved: boolean };
export type RiichiBranch = { action: RiichiAction; available: boolean; waits: RiichiWait[]; outcomes: RiichiOutcome[] };
export type PreparedRiichiQuestion = { question: RiichiQuestion; hand: Tile[]; waits: Tile[]; liveCount: number; furiten: boolean; canRiichi: boolean; reasons: string[]; branches: RiichiBranch[] };

export function knownRiichiCounts(question: RiichiQuestion): Counts34 {
  const counts = parseHand(question.hand);
  // The declaration candidate is separate from the historical rivers, so count it once.
  for (const tile of [question.discard, question.doraIndicator, ...Object.values(question.rivers ?? {}).flat()]) counts[tileIndex(tile)] += 1;
  validateCounts(counts);
  return counts;
}

function handValue(question: RiichiQuestion, tile: Tile, action: RiichiAction, method: "ron" | "tsumo"): RiichiValue | null {
  const won = addTile(parseHand(question.hand), tile);
  try {
    const result = calculateHandScore({ counts: won, winningTile: tile, isDealer: question.seatWind === "東", winMethod: method, roundWind: question.roundWind, seatWind: question.seatWind, riichi: action === "riichi", dora: won[tileIndex(doraFromIndicator(question.doraIndicator))], honba: 0, riichiSticks: 0 });
    return { ...result.score, yaku: result.yaku.map((yaku) => `${yaku.name}${yaku.han}翻`) };
  } catch (error) {
    if (error instanceof Error && error.message === "役がありません。") return null;
    throw error;
  }
}

function winningOutcomes(question: RiichiQuestion, action: RiichiAction, waits: RiichiWait[]): RiichiOutcome[] {
  if (!question.targetRank) return [];
  const selfIndex = winds.indexOf(question.seatWind);
  const selfSeat = ORASU_SEATS[selfIndex]!;
  const original = Object.fromEntries(ORASU_SEATS.map((seat, i) => [seat, question.scores[i]])) as OrasuScores;
  return waits.filter((wait) => wait.remaining > 0).flatMap((wait) => {
    const methods = ["tsumo", ...ORASU_SEATS.filter((seat) => seat !== selfSeat)] as const;
    return methods.flatMap((method) => {
      const value = method === "tsumo" ? wait.tsumo : wait.ron;
      if (!value) return [];
      const scores = { ...original };
      const deposit = action === "riichi" ? 1000 : 0;
      scores[selfSeat] -= deposit;
      if (method === "tsumo") {
        for (const seat of ORASU_SEATS) {
          if (seat !== selfSeat) scores[seat] -= value.payments[question.seatWind === "東" || seat !== "east" ? 0 : 1]!.points;
        }
      } else scores[method] -= value.payments[0]!.points;
      // A winning player collects their own new stick as well as existing kyotaku.
      scores[selfSeat] += value.totalPoints + deposit + question.riichiSticks * 1000;
      const self = rankOrasuScores(scores).find((row) => row.seat === selfSeat)!;
      return [{ tile: wait.tile, method: method === "tsumo" ? "ツモ" : `${winds[ORASU_SEATS.indexOf(method)]}家からロン`, scores, rank: self.rank, tied: self.tied, achieved: hasReachedOrasuTarget(scores, selfSeat, question.targetRank!, "strict") }];
    });
  });
}

export function prepareRiichiQuestion(question: RiichiQuestion): PreparedRiichiQuestion {
  const counts = parseHand(question.hand);
  validateCounts(counts, 13);
  if (!winds.includes(question.seatWind) || !["東", "南"].includes(question.roundWind) || !Number.isInteger(question.roundNumber) || question.roundNumber < 1 || question.roundNumber > 4) throw new Error(`${question.id}: invalid position`);
  if (!Number.isInteger(question.turn) || question.turn < 1 || question.turn > 18 || question.wallTilesRemaining < 4) throw new Error(`${question.id}: invalid remaining turns`);
  if (question.scores.some((score) => !Number.isInteger(score) || score < 0 || score % 100 !== 0) || !Number.isInteger(question.riichiSticks) || question.riichiSticks < 0 || question.scores.reduce((a, b) => a + b, 0) + question.riichiSticks * 1000 !== 100000) throw new Error(`${question.id}: invalid point totals`);
  if (question.opponentRiichi && (question.opponentRiichi === question.seatWind || question.riichiSticks < 1)) throw new Error(`${question.id}: invalid opponent riichi`);
  if (question.targetRank && (question.roundWind !== "南" || question.roundNumber !== 4)) throw new Error(`${question.id}: target rank outside all-last`);
  const known = knownRiichiCounts(question);
  const progress = analyzeHandProgress(counts, 0, known);
  if (progress.shanten !== 0 || progress.ukeireCount <= 0) throw new Error(`${question.id}: not a live tenpai hand`);
  const own = parseHand([...(question.rivers?.[question.seatWind] ?? []), question.discard].join(" "));
  // Use all shape waits, including exhausted waits, to detect discard furiten.
  const furiten = progress.waits.some((tile) => own[tileIndex(tile)] > 0);
  const legality = evaluateRiichiLegality({ counts, availableCounts: known.map((count) => 4 - count), ownDiscards: own, wallTilesRemaining: question.wallTilesRemaining, points: question.scores[winds.indexOf(question.seatWind)], ruleConfig: { ...DEFAULT_RIICHI_RULE_CONFIG, allowFuritenRiichi: true } });
  const branches = (["riichi", "dama"] as const).map((action): RiichiBranch => {
    const available = action === "dama" || legality.legal;
    const waits = available ? progress.waits.map((tile): RiichiWait => {
      const ron = handValue(question, tile, action, "ron");
      const tsumo = handValue(question, tile, action, "tsumo");
      if (!tsumo) throw new Error(`${question.id}: missing closed tsumo yaku`);
      return { tile, remaining: 4 - known[tileIndex(tile)]!, ron: furiten ? null : ron, ronBlocked: furiten ? "フリテン" : !ron ? "役なし" : null, tsumo };
    }) : [];
    return { action, available, waits, outcomes: winningOutcomes(question, action, waits) };
  });
  if (question.recommendedAction === "riichi" && !legality.legal) throw new Error(`${question.id}: illegal recommendation`);
  return { question, hand: countsToTiles(counts), waits: progress.waits, liveCount: progress.ukeireCount, furiten, canRiichi: legality.legal, reasons: legality.reasons, branches };
}

export type RiichiAnswer = { id: string; action: RiichiAction };
export function riichiSessionStats(questions: readonly RiichiQuestion[], answers: readonly RiichiAnswer[]) {
  const counted = questions.flatMap((q) => { const answer = answers.find((a) => a.id === q.id); return answer ? [{ q, matched: answer.action === q.recommendedAction }] : []; });
  const matched = counted.filter((row) => row.matched).length;
  let streak = 0;
  for (const row of [...counted].reverse()) { if (!row.matched) break; streak += 1; }
  return { total: counted.length, matched, accuracy: counted.length ? Math.round(matched / counted.length * 100) : 0, streak, categories: Object.entries(categoryLabels).flatMap(([category, label]) => { const rows = counted.filter(({ q }) => q.category === category); return rows.length ? [{ category, label, total: rows.length, matched: rows.filter((r) => r.matched).length }] : []; }) };
}

export function shuffleRiichiSession(questions: readonly RiichiQuestion[], level: RiichiDifficulty, recent: string[] = [], random = Math.random): RiichiQuestion[] {
  const shuffled = questions.filter((q) => q.difficulty === level);
  for (let i = shuffled.length - 1; i > 0; i -= 1) { const j = Math.floor(random() * (i + 1)); [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!]; }
  const seen = new Set(recent.slice(-5));
  const ordered = [...shuffled.filter((q) => !seen.has(q.id)), ...shuffled.filter((q) => seen.has(q.id))];
  if (ordered.length > 1 && ordered[0]!.id === recent.at(-1)) [ordered[0], ordered[1]] = [ordered[1]!, ordered[0]!];
  return ordered.slice(0, 10);
}

export type RiichiHistory = CallHistory;
export const parseRiichiHistory = parseCallHistory;
