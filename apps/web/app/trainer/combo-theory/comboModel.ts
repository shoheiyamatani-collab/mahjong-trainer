import { calculateTileCombos, comboMetricValue, comboVisibleCountsFromIds, createSeededRandom, emptyCounts, tileIndex, validateComboInput, type ComboInput, type ComboMetric, type ComboModel, type ComboResult } from "@mahjong-trainer/mahjong-core";
import { makePushFoldQuestion } from "../push-or-fold/pushFoldFactory";
import { pushFoldSpecs } from "../push-or-fold/pushFoldQuestions";
import type { PushFoldQuestion } from "../push-or-fold/pushFoldTypes";
import { seats } from "../push-or-fold/pushFoldTypes";

export type ComboDifficulty = "beginner" | "intermediate" | "advanced";
export type ComboMode = "calculation" | "comparison" | "practical";
export const difficultyLabels = { beginner: "初級", intermediate: "中級", advanced: "上級" };
export const modeLabels = { calculation: "コンボ数計算", comparison: "コンボ数比較", practical: "実戦形式", simulator: "シミュレーター" };
export const metricLabels = { ryanmen: "両面コンボ数", bad: "愚形コンボ数（カンチャン＋ペンチャン）", total: "合計コンボ数" };
export const waitLabels = { ryanmen: "両面", kanchan: "カンチャン", penchan: "ペンチャン", shanpon: "シャンポン", tanki: "単騎" };
export type ComboQuestion = {
  version: 1; seed: string; mode: ComboMode; difficulty: ComboDifficulty; input: ComboInput;
  metric: ComboMetric; direction: "min" | "max"; targets: number[]; choices: number[];
  correct: number; results: ComboResult[]; scene?: PushFoldQuestion; opponent?: string;
};
const pick = <T>(items: readonly T[], rng: () => number): T => items[Math.floor(rng() * items.length)]!;
function shuffle<T>(items: T[], rng: () => number) {
  const output = [...items];
  for (let i = output.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [output[i], output[j]] = [output[j]!, output[i]!]; }
  return output;
}
export function buildPracticalComboScene(seed: string, difficulty: ComboDifficulty, attempt = 0) {
  const eligible = pushFoldSpecs.filter(spec => spec.difficulty === difficulty && !spec.selfMeld && !spec.openAttacker && (spec.attackSeats?.length ?? 1) === 1);
  const rng = createSeededRandom(`${seed}:scene:${attempt}`);
  const base = pick(eligible, rng);
  const self = base.seat ?? "南";
  const attackers = base.attackSeats ?? [self === "東" ? "南" : "東"];
  const openAttacker = difficulty !== "beginner" && rng() < .5 ? pick(seats.filter(seat => seat !== self && !attackers.includes(seat)), rng) : undefined;
  return makePushFoldQuestion({ ...base, openAttacker, id: `combo:${seed}:${attempt}` });
}
export function comboSceneInput(scene: PushFoldQuestion): { input: ComboInput; opponent: string } {
  const opponent = scene.players.find(player => player.riichi);
  if (!opponent) throw new Error("比較するリーチ者がいません。");
  const ids = [...scene.hand, ...scene.doraIndicators, ...scene.players.flatMap(player => [...player.river.map(item => item.tile), ...player.melds.flatMap(meld => meld.tiles)])].map(tile => tile.id);
  return { input: { model: "riichi", visibleCounts: comboVisibleCountsFromIds(ids), riichiRiver: comboVisibleCountsFromIds(opponent.river.map(item => item.tile.id)) }, opponent: opponent.seat };
}
export function generateComboQuestion(seed: string, mode: ComboMode, difficulty: ComboDifficulty): ComboQuestion {
  if (!seed.trim() || seed.length > 160 || !Object.hasOwn(modeLabels, mode) || mode === ("simulator" as ComboMode) || !Object.hasOwn(difficultyLabels, difficulty)) throw new Error("問題の条件が不正です。");
  const rng = createSeededRandom(`${seed}:${mode}:${difficulty}:v1`);
  const metric: ComboMetric = difficulty === "beginner" ? "ryanmen" : difficulty === "advanced" ? "total" : pick(["ryanmen", "bad"] as const, rng);
  const direction = rng() < .5 ? "min" : "max";
  for (let attempt = 0; attempt < 80; attempt++) {
    let input: ComboInput; let available: number[]; let scene: PushFoldQuestion | undefined; let opponent: string | undefined;
    if (mode === "practical") {
      try { scene = buildPracticalComboScene(seed, difficulty, attempt).question; } catch { continue; }
      const context = comboSceneInput(scene); input = context.input; opponent = context.opponent;
      available = [...new Set(scene.hand.map(tile => tileIndex(tile.tile)))];
    } else {
      const visibleCounts = emptyCounts(), riichiRiver = emptyCounts();
      const base = Math.floor(rng() * 3) * 9;
      for (let i = 0; i < 9; i++) visibleCounts[base + i] = Math.floor(rng() * (difficulty === "beginner" ? 4 : 5));
      if (difficulty === "advanced") for (let i = 27; i < 34; i++) visibleCounts[i] = Math.floor(rng() * 5);
      const model: ComboModel = difficulty !== "beginner" && rng() < .4 ? "riichi" : "basic";
      if (model === "riichi") for (let i = base; i < base + 9; i++) if (visibleCounts[i]! && rng() < .25) riichiRiver[i] = 1;
      input = { visibleCounts, riichiRiver, model };
      available = Array.from({ length: 9 }, (_, i) => base + i);
      if (difficulty === "advanced") available.push(...Array.from({ length: 7 }, (_, i) => 27 + i));
    }
    const results = available.map(target => calculateTileCombos(target, input));
    if (mode === "calculation") {
      const result = pick(results.filter(row => difficulty !== "beginner" || row.breakdown.ryanmen > 0), rng);
      if (!result) continue;
      const correct = comboMetricValue(result, metric);
      const options = new Set([correct]);
      for (const delta of shuffle([1, 2, 3, 4, 6, 8, -1, -2, -4], rng)) { if (correct + delta >= 0) options.add(correct + delta); if (options.size === 4) break; }
      return { version: 1, seed, mode, difficulty, input, metric, direction, targets: [result.target], choices: shuffle([...options], rng), correct, results: [result] };
    }
    const ordered = shuffle(results, rng);
    let selected = ordered.slice(0, difficulty === "advanced" ? 3 : 2);
    if (selected.length < 2) continue;
    if (difficulty === "advanced" && attempt < 20) {
      const sorted = [...ordered].sort((a, b) => comboMetricValue(a, metric) - comboMetricValue(b, metric));
      const close = sorted.findIndex((row, i) => i + 2 < sorted.length && comboMetricValue(sorted[i + 2]!, metric) - comboMetricValue(row, metric) <= 8 && comboMetricValue(sorted[i + 2]!, metric) !== comboMetricValue(row, metric));
      if (close < 0) continue;
      selected = sorted.slice(close, close + 3);
    }
    const values = selected.map(row => comboMetricValue(row, metric));
    const best = direction === "min" ? Math.min(...values) : Math.max(...values);
    if (values.filter(value => value === best).length !== 1) continue;
    const correct = selected.find(row => comboMetricValue(row, metric) === best)!.target;
    selected = shuffle(selected, rng);
    return { version: 1, seed, mode, difficulty, input, metric, direction, targets: selected.map(row => row.target), choices: selected.map(row => row.target), correct, results: selected, scene, opponent };
  }
  throw new Error("一意に比較できる問題を作れませんでした。seedを変えて再試行してください。");
}

export type ComboSimulatorState = ComboInput & { targets: number[] };
export const initialSimulator = (): ComboSimulatorState => ({ model: "basic", visibleCounts: emptyCounts(), riichiRiver: emptyCounts(), targets: [4, 7] });
export function validateSimulator(state: ComboSimulatorState) {
  validateComboInput(state);
  if (!Array.isArray(state.targets) || state.targets.length < 1 || state.targets.length > 3 || new Set(state.targets).size !== state.targets.length || state.targets.some(tile => !Number.isSafeInteger(tile) || tile < 0 || tile > 33)) throw new Error("対象牌は1〜3種類を重複せず選んでください。");
}
export function encodeComboSimulator(state: ComboSimulatorState): string {
  validateSimulator(state);
  const query = new URLSearchParams({ combo: "1", v: state.visibleCounts.join(","), r: (state.riichiRiver ?? emptyCounts()).join(","), t: state.targets.join(","), model: state.model });
  if (Object.keys(state.shanponPartners ?? {}).length) query.set("partners", JSON.stringify(state.shanponPartners));
  return query.toString();
}
export function decodeComboSimulator(text: string): ComboSimulatorState {
  const query = new URLSearchParams(text);
  if (query.get("combo") !== "1") throw new Error("共有データのバージョンが不正です。");
  const numbers = (key: string) => {
    const value = query.get(key);
    if (!value || !/^\d+(,\d+)*$/.test(value)) throw new Error("共有データの枚数が不正です。");
    return value.split(",").map(Number);
  };
  const partners = query.has("partners") ? JSON.parse(query.get("partners")!) as Record<number, number> : undefined;
  if (query.has("partners") && (!partners || typeof partners !== "object" || Array.isArray(partners))) throw new Error("シャンポンの相方が不正です。");
  const state: ComboSimulatorState = { visibleCounts: numbers("v"), riichiRiver: numbers("r"), targets: numbers("t"), model: query.get("model") as ComboModel, shanponPartners: partners };
  validateSimulator(state); return state;
}

export type ComboAttempt = { seed: string; mode: ComboMode; difficulty: ComboDifficulty; correct: boolean; answer: number; at: string };
export type ComboHistory = { version: 1; attempts: ComboAttempt[] };
export const emptyComboHistory = (): ComboHistory => ({ version: 1, attempts: [] });
export function readComboHistory(text: string | null): ComboHistory {
  if (!text) return emptyComboHistory();
  try {
    const parsed = JSON.parse(text) as ComboHistory;
    if (parsed.version !== 1 || !Array.isArray(parsed.attempts)) return emptyComboHistory();
    return { version: 1, attempts: parsed.attempts.filter(row => row && typeof row.seed === "string" && row.seed.length <= 160 && row.mode !== ("simulator" as ComboMode) && Object.hasOwn(modeLabels, row.mode) && Object.hasOwn(difficultyLabels, row.difficulty) && typeof row.correct === "boolean" && Number.isSafeInteger(row.answer) && row.answer >= 0 && typeof row.at === "string" && Number.isFinite(Date.parse(row.at))).slice(-1000) };
  } catch { return emptyComboHistory(); }
}
export function comboHistoryStats(history: ComboHistory, mode?: ComboMode, difficulty?: ComboDifficulty) {
  const attempts = history.attempts.filter(row => (!mode || row.mode === mode) && (!difficulty || row.difficulty === difficulty));
  const correct = attempts.filter(row => row.correct).length;
  let streak = 0; for (let i = attempts.length - 1; i >= 0 && attempts[i]!.correct; i--) streak++;
  return { total: attempts.length, correct, accuracy: attempts.length ? Math.round(correct / attempts.length * 100) : 0, streak };
}
export function comboMistakes(history: ComboHistory): ComboAttempt[] {
  const latest = new Map<string, ComboAttempt>();
  for (const row of history.attempts) latest.set(`${row.mode}:${row.difficulty}:${row.seed}`, row);
  return [...latest.values()].filter(row => !row.correct).slice(-30).reverse();
}
