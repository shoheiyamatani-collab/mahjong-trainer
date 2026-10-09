import { createSeededRandom } from "@mahjong-trainer/mahjong-core";
import type { CallDifficulty } from "../call-or-pass/callModel";
import { categoryLabels, type PreparedPushFoldQuestion, type PushFoldAction, type PushFoldQuestion } from "./pushFoldTypes";

export const PUSH_FOLD_STORAGE_KEY = "jongfolio-push-fold-v1";
export type PushFoldAnswer = { id: string; action: PushFoldAction; discardId: number | null };
export type PushFoldHistory = { at: string; level: CallDifficulty; seed: string; ids: string[]; correct: number; scored: number; alternatives: number; discardCorrect: number; discardScored: number };
export type PushFoldStorage = { version: 1; recent: string[]; history: PushFoldHistory[] };
export const emptyPushFoldStorage = (): PushFoldStorage => ({ version: 1, recent: [], history: [] });

export function gradePushFold(q: PushFoldQuestion, action: PushFoldAction) {
  if (q.recommendationStrength === "clear") return action === q.recommendedAction ? "correct" : "incorrect";
  return q.acceptableActions.includes(action) ? action === q.recommendedAction ? "comparison" : "alternative" : "incorrect";
}

export function selectPushFoldSession(items: PreparedPushFoldQuestion[], level: CallDifficulty, seed: string, recent: string[] = []) {
  const random = createSeededRandom(seed);
  const pool = items.filter((item) => item.question.difficulty === level).map((item) => ({ item, tie: random() }));
  const selected: PreparedPushFoldQuestion[] = [], counts = new Map<string, number>();
  while (selected.length < 10 && pool.length) {
    pool.sort((a, b) => (Number(recent.includes(a.item.question.id)) * 100 + (counts.get(a.item.question.category) ?? 0) * 10 + a.tie) - (Number(recent.includes(b.item.question.id)) * 100 + (counts.get(b.item.question.category) ?? 0) * 10 + b.tie));
    const item = pool.shift()!.item;
    selected.push(item); counts.set(item.question.category, (counts.get(item.question.category) ?? 0) + 1);
  }
  return selected;
}

export function pushFoldStats(items: PreparedPushFoldQuestion[], answers: PushFoldAnswer[]) {
  const stats = { correct: 0, scored: 0, streak: 0, alternatives: 0, comparisons: 0, push: { correct: 0, scored: 0 }, fold: { correct: 0, scored: 0 }, discardCorrect: 0, discardScored: 0, categories: Object.keys(categoryLabels).map((category) => ({ category: category as keyof typeof categoryLabels, correct: 0, scored: 0 })) };
  for (const answer of answers) {
    const q = items.find((item) => item.question.id === answer.id)?.question;
    if (!q) continue;
    const grade = gradePushFold(q, answer.action);
    if (q.recommendationStrength === "clear") {
      const correct = Number(grade === "correct"), group = stats.categories.find((c) => c.category === q.category)!;
      stats.scored++; stats.correct += correct; stats[q.recommendedAction].scored++; stats[q.recommendedAction].correct += correct;
      group.scored++; group.correct += correct; stats.streak = correct ? stats.streak + 1 : 0;
    } else {
      stats.alternatives += Number(grade === "alternative"); stats.comparisons++;
    }
    if (answer.discardId !== null) { stats.discardScored++; stats.discardCorrect += Number(q.discards[answer.action].includes(answer.discardId)); }
  }
  return stats;
}
export function scorePercent(correct: number, scored: number) { return scored ? `${Math.round(correct / scored * 100)}%` : "集計対象なし"; }

export function readPushFoldStorage(raw: string | null): PushFoldStorage {
  if (!raw) return emptyPushFoldStorage();
  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object" || !("version" in value) || value.version !== 1 || !("recent" in value) || !Array.isArray(value.recent) || !("history" in value) || !Array.isArray(value.history)) return emptyPushFoldStorage();
    const history = value.history.filter((row): row is PushFoldHistory => {
      if (!row || typeof row !== "object") return false;
      const r = row as Record<string, unknown>;
      return typeof r.at === "string" && Number.isFinite(Date.parse(r.at)) && ["beginner", "intermediate", "advanced"].includes(String(r.level)) && typeof r.seed === "string" && Array.isArray(r.ids) && r.ids.length <= 10 && r.ids.every((id) => typeof id === "string") && ["correct", "scored", "alternatives", "discardCorrect", "discardScored"].every((key) => typeof r[key] === "number" && Number.isInteger(r[key]) && Number(r[key]) >= 0 && Number(r[key]) <= 10) && Number(r.correct) <= Number(r.scored) && Number(r.discardCorrect) <= Number(r.discardScored);
    }).slice(0, 20);
    return { version: 1, recent: value.recent.filter((id): id is string => typeof id === "string").slice(0, 40), history };
  } catch { return emptyPushFoldStorage(); }
}

export function finishPushFoldSession(storage: PushFoldStorage, items: PreparedPushFoldQuestion[], answers: PushFoldAnswer[], seed: string, at: string): PushFoldStorage {
  if (items.length !== 10 || new Set(answers.map((a) => a.id)).size !== 10 || !items.every((item) => answers.some((a) => a.id === item.question.id))) throw new Error("10問すべてに回答してから保存します");
  const stats = pushFoldStats(items, answers);
  return { version: 1, recent: [...new Set([...items.map((item) => item.question.id), ...storage.recent])].slice(0, 40), history: [{ at, level: items[0]!.question.difficulty, seed, ids: items.map((item) => item.question.id), correct: stats.correct, scored: stats.scored, alternatives: stats.alternatives, discardCorrect: stats.discardCorrect, discardScored: stats.discardScored }, ...storage.history].slice(0, 20) };
}
