import { analyzeHandProgress, calculateHandScore, countsToTiles, parseHand, tileIndex, tileName, validateCounts, type Counts34, type HandScoreMeld, type Tile } from "@mahjong-trainer/mahjong-core";

export type CallAction = "pon" | "chi" | "pass";
export type CallDifficulty = "beginner" | "intermediate" | "advanced";
export type Opponent = "kamicha" | "toimen" | "shimocha";
export const actionLabels = { pon: "ポン", chi: "チー", pass: "スルー" };
export const difficultyLabels = { beginner: "初級", intermediate: "中級", advanced: "上級" };
export const opponentLabels = { kamicha: "上家", toimen: "対面", shimocha: "下家" };
export const categoryLabels = { yakuhai: "役牌判断", speed: "速度判断", value: "打点判断", noYaku: "役の確認", shape: "形・受け入れ", defense: "守備判断", pairs: "対子手の選択" };
export type CallCategory = keyof typeof categoryLabels;
export type Tradeoff = { merit: string; risk: string; valuePlan: string };
export type CallOption = Tradeoff & { action: "pon" | "chi"; consumed: Tile[]; discard: Tile };
export type CallQuestion = {
  id: string; difficulty: CallDifficulty; category: CallCategory; title: string;
  hand: string; melds?: HandScoreMeld[]; roundWind: Tile; roundNumber: number; seatWind: Tile; turn: number;
  scores: [number, number, number, number]; doraIndicator: Tile;
  offered: Tile; offeredBy: Opponent; rivers?: Partial<Record<Opponent | "self", Tile[]>>;
  riichiBy?: Opponent; riichiSticks?: number; context: string; options: CallOption[]; pass: Tradeoff;
  recommendedAction: CallAction; confidence: "high" | "medium"; explanation: string; checkpoint: string;
};

export function legalCallForms(counts: Counts34, offered: Tile, from: Opponent) {
  const index = tileIndex(offered);
  const forms: Array<{ action: "pon" | "chi"; consumed: Tile[] }> = [];
  if (counts[index]! >= 2) forms.push({ action: "pon", consumed: [offered, offered] });
  if (from === "kamicha" && index < 27) {
    const start = Math.floor(index / 9) * 9;
    for (let first = Math.max(start, index - 2); first <= Math.min(start + 6, index); first += 1) {
      const others = [first, first + 1, first + 2].filter((i) => i !== index);
      if (others.every((i) => counts[i]! > 0)) forms.push({ action: "chi", consumed: others.map(tileName) });
    }
  }
  return forms;
}

export function forbiddenCallDiscards(offered: Tile, option: Pick<CallOption, "action" | "consumed">): Tile[] {
  const forbidden = [offered];
  if (option.action === "chi") {
    const indexes = [...option.consumed, offered].map(tileIndex).sort((a, b) => a - b);
    const index = tileIndex(offered);
    const alternative = index === indexes[0] ? index + 3 : index === indexes[2] ? index - 3 : -1;
    if (alternative >= 0 && alternative < 27 && Math.floor(alternative / 9) === Math.floor(index / 9)) forbidden.push(tileName(alternative));
  }
  return forbidden;
}

export function doraFromIndicator(tile: Tile): Tile {
  const index = tileIndex(tile);
  if (index < 27) return tileName(Math.floor(index / 9) * 9 + (index + 1) % 9);
  if (index < 31) return tileName(27 + (index - 26) % 4);
  return tileName(31 + (index - 30) % 3);
}

export function knownQuestionCounts(question: CallQuestion): Counts34 {
  const counts = parseHand(question.hand);
  const publicTiles = [question.offered, question.doraIndicator, ...(question.melds ?? []).flatMap((meld) => meld.tiles), ...Object.values(question.rivers ?? {}).flatMap((river) => river ?? [])];
  publicTiles.forEach((tile) => { counts[tileIndex(tile)] += 1; });
  return counts;
}

export function applyCall(question: CallQuestion, option: CallOption) {
  const counts = parseHand(question.hand);
  if (!legalCallForms(counts, question.offered, question.offeredBy).some((form) => form.action === option.action && [...form.consumed].sort().join() === [...option.consumed].sort().join())) throw new Error(`${question.id}: 鳴けない組み合わせ`);
  if (forbiddenCallDiscards(question.offered, option).includes(option.discard)) throw new Error(`${question.id}: 喰い替え`);
  for (const tile of [...option.consumed, option.discard]) {
    counts[tileIndex(tile)] -= 1;
    if (counts[tileIndex(tile)]! < 0) throw new Error(`${question.id}: 手牌にない牌`);
  }
  const meld: HandScoreMeld = { kind: option.action, tiles: [...option.consumed, question.offered].sort((a, b) => tileIndex(a) - tileIndex(b)) };
  return { counts, melds: [...(question.melds ?? []), meld] };
}

function analyzeBranch(question: CallQuestion, counts: Counts34, melds: HandScoreMeld[], ownRiver: Tile[]) {
  const known = knownQuestionCounts(question);
  const progress = analyzeHandProgress(counts, melds.length, known);
  const furiten = progress.shanten === 0 && progress.waits.some((tile) => ownRiver.includes(tile));
  const dora = doraFromIndicator(question.doraIndicator);
  const values = progress.shanten === 0 ? progress.ukeire.map(({ tile, remaining }) => {
    const won = counts.slice(); won[tileIndex(tile)] += 1;
    const doraCount = won[tileIndex(dora)]! + melds.flatMap((meld) => meld.tiles).filter((t) => t === dora).length;
    const score = (winMethod: "ron" | "tsumo") => {
      try {
        const result = calculateHandScore({ counts: won, melds, winningTile: tile, isDealer: question.seatWind === "東", winMethod, seatWind: question.seatWind, roundWind: question.roundWind, dora: doraCount });
        return { points: result.score.totalPoints, han: result.score.han, fu: result.score.fu, yaku: result.yaku.map((yaku) => yaku.name) };
      } catch (error) {
        if (error instanceof Error && /役がありません|和了形または役が見つかりません/.test(error.message)) return null;
        throw error;
      }
    };
    return { tile, remaining, ron: furiten ? null : score("ron"), tsumo: score("tsumo") };
  }) : [];
  return { ...progress, counts, hand: countsToTiles(counts), melds, furiten, values };
}
export type CallBranchAnalysis = ReturnType<typeof analyzeBranch>;

export function compareCallQuestion(question: CallQuestion) {
  return {
    pass: analyzeBranch(question, parseHand(question.hand), question.melds ?? [], question.rivers?.self ?? []),
    calls: question.options.map((option) => {
      const { counts, melds } = applyCall(question, option);
      return { option, analysis: analyzeBranch(question, counts, melds, [...(question.rivers?.self ?? []), option.discard]) };
    })
  };
}

export function validateCallQuestion(question: CallQuestion): void {
  const count = 13 - (question.melds?.length ?? 0) * 3;
  for (const meld of question.melds ?? []) {
    const indexes = meld.tiles.map(tileIndex).sort((a, b) => a - b);
    const valid = meld.kind === "pon" ? new Set(indexes).size === 1 : meld.kind === "chi" && indexes[0]! < 27 && Math.floor(indexes[0]! / 9) === Math.floor(indexes[2]! / 9) && indexes[1] === indexes[0]! + 1 && indexes[2] === indexes[1]! + 1;
    if (meld.tiles.length !== 3 || !valid) throw new Error(`${question.id}: 既存副露が不正`);
  }
  validateCounts(parseHand(question.hand), count);
  validateCounts(knownQuestionCounts(question));
  if (!["東", "南", "西", "北"].includes(question.seatWind) || !["東", "南"].includes(question.roundWind)) throw new Error(`${question.id}: 風が不正`);
  if (question.scores.reduce((a, b) => a + b, 0) + (question.riichiSticks ?? 0) * 1000 !== 100000 || question.turn < 1 || question.turn > 18) throw new Error(`${question.id}: 局面条件が不正`);
  const forms = legalCallForms(parseHand(question.hand), question.offered, question.offeredBy);
  const actions = new Set(forms.map((form) => form.action));
  if (!actions.size || question.options.length !== actions.size || new Set(question.options.map((o) => o.action)).size !== actions.size || !question.options.every((o) => actions.has(o.action))) throw new Error(`${question.id}: 合法な鳴きの比較が不足`);
  if (question.recommendedAction !== "pass" && !actions.has(question.recommendedAction)) throw new Error(`${question.id}: 推奨が不正`);
  if (question.difficulty === "beginner" && question.confidence !== "high") throw new Error(`${question.id}: 初級は明確な問題のみ`);
  for (const option of question.options) {
    const applied = applyCall(question, option);
    validateCounts(applied.counts, count - 3);
  }
  const pass = compareCallQuestion(question).pass;
  if (pass.waits.includes(question.offered)) throw new Error(`${question.id}: ロン判断を含む問題は対象外`);
  if (!question.explanation || !question.checkpoint) throw new Error(`${question.id}: 解説不足`);
}

export type CallAnswer = { id: string; action: CallAction };
export function callSessionStats(questions: CallQuestion[], answers: CallAnswer[]) {
  const valid = answers.filter((a, i) => questions.some((q) => q.id === a.id) && answers.findIndex((other) => other.id === a.id) === i);
  const correct = (a: CallAnswer) => questions.find((q) => q.id === a.id)!.recommendedAction === a.action;
  let streak = 0;
  for (const answer of valid) streak = correct(answer) ? streak + 1 : 0;
  const total = valid.length, count = valid.filter(correct).length;
  const categories = Object.entries(categoryLabels).flatMap(([category, label]) => {
    const rows = valid.filter((a) => questions.find((q) => q.id === a.id)!.category === category);
    return rows.length ? [{ category: category as CallCategory, label, total: rows.length, correct: rows.filter(correct).length }] : [];
  });
  return { total, correct: count, accuracy: total ? Math.round(count / total * 100) : 0, streak, categories };
}

export function shuffleCallSession(questions: readonly CallQuestion[], difficulty: CallDifficulty, recent: string[] = [], random = Math.random): CallQuestion[] {
  const pool = questions.filter((q) => q.difficulty === difficulty);
  for (let i = pool.length - 1; i > 0; i -= 1) { const j = Math.floor(random() * (i + 1)); [pool[i], pool[j]] = [pool[j]!, pool[i]!]; }
  const seen = new Set(recent.slice(-5));
  const result = [...pool.filter((q) => !seen.has(q.id)), ...pool.filter((q) => seen.has(q.id))].slice(0, 10);
  if (result.length > 1 && result[0]!.id === recent.at(-1)) [result[0], result[1]] = [result[1]!, result[0]!];
  return result;
}

export type CallHistory = { recent: string[]; sessions: Array<{ at: string; difficulty: CallDifficulty; correct: number; total: number }> };
export function parseCallHistory(raw: string | null): CallHistory {
  try {
    const value: unknown = JSON.parse(raw ?? "null");
    if (!value || typeof value !== "object") throw new Error();
    const data = value as Partial<CallHistory>;
    return { recent: Array.isArray(data.recent) ? data.recent.filter((id) => typeof id === "string").slice(-20) : [], sessions: Array.isArray(data.sessions) ? data.sessions.filter((s) => s && typeof s.at === "string" && ["beginner", "intermediate", "advanced"].includes(s.difficulty) && Number.isInteger(s.correct) && Number.isInteger(s.total) && s.total > 0 && s.total <= 10 && s.correct >= 0 && s.correct <= s.total).slice(-20) : [] };
  } catch { return { recent: [], sessions: [] }; }
}
