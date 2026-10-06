import {
  analyzeDiscards,
  bestDailyDiscards,
  chinitsuHandKey,
  chinitsuTiles,
  findChinitsuWaits13,
  generateChinitsuWaitQuestion,
  generateDailyNanikiru,
  tileIndex,
  type ChinitsuWaitQuestion,
  type Tile
} from "@mahjong-trainer/mahjong-core";
import { attachNarration } from "./narration.js";
import type { HistoryEntry, ResolvedConfig, ShortsProblem, ShortsType } from "./types.js";
import { createSeededRandom, nowIso, pad, tileDisplay } from "./utils.js";

export function generateProblem(
  type: ShortsType,
  date: string,
  sequence: number,
  history: HistoryEntry[],
  config: ResolvedConfig
): ShortsProblem {
  const rng = createSeededRandom(`${date}:${type}:${sequence}`);
  const generatedAt = nowIso();
  const slug = type === "nani-kiru" ? "nanikiru" : "machi";
  const id = `${date}-${slug}-${pad(sequence)}`;
  const toolPath = config.site.routes[type];
  const toolUrl = new URL(toolPath, config.site.baseUrl).toString();
  const recentHands = history.filter((entry) => entry.type === type).map((entry) => entry.handKey);

  const base = type === "nani-kiru"
    ? createNanikiru(id, sequence, date, generatedAt, config.site.baseUrl)
    : createMachi(id, sequence, date, generatedAt, toolPath, toolUrl, rng, recentHands);
  return attachNarration(base, config);
}

function createNanikiru(
  id: string,
  sequence: number,
  date: string,
  generatedAt: string,
  siteBaseUrl: string
): ShortsProblem {
  const question = generateDailyNanikiru(date);
  const toolPath = question.checkerPath;
  const toolUrl = new URL(toolPath, siteBaseUrl).toString();

  return {
    schemaVersion: 1,
    id,
    sequence,
    date,
    type: "nani-kiru",
    hand: question.hand,
    handKey: question.handKey,
    answer: question.bestDiscards,
    answerDisplay: question.bestDiscards.map(tileDisplay).join("・"),
    answerReading: "",
    ukeire: question.bestUkeire,
    ukeireCount: question.bestUkeireTiles,
    explanation: question.explanation,
    narration: [],
    toolPath,
    toolUrl,
    generatedAt,
    verification: { engine: "mahjong-core/analyzeDiscards", verified: true }
  };
}

function createMachi(
  id: string,
  sequence: number,
  date: string,
  generatedAt: string,
  toolPath: string,
  toolUrl: string,
  rng: () => number,
  recentHands: string[]
): ShortsProblem {
  const suits = ["m", "p", "s"] as const;
  const suit = suits[Math.floor(rng() * suits.length)]!;
  const excluded = recentHands.slice();
  let question: ChinitsuWaitQuestion | null = null;
  for (let attempt = 0; attempt < 120; attempt += 1) {
    const candidate = generateChinitsuWaitQuestion(rng, suit, excluded, 10000);
    if (candidate.waits.length >= 2 && candidate.waits.length <= 5) {
      question = candidate;
      break;
    }
    excluded.push(chinitsuHandKey(candidate.counts));
  }
  question ??= generateChinitsuWaitQuestion(rng, suit, excluded, 10000);
  const verifiedWaits = findChinitsuWaits13(question.counts);
  if (verifiedWaits.join(",") !== question.waits.join(",")) throw new Error("Chinitsu wait verification failed.");
  const answer = verifiedWaits.map((rank) => `${rank}${question.suit}` as Tile);
  const remaining = verifiedWaits.reduce((sum, rank) => sum + (question.remainingTiles[rank] ?? 0), 0);

  return {
    schemaVersion: 1,
    id,
    sequence,
    date,
    type: "machi",
    hand: chinitsuTiles(question.counts, question.suit),
    handKey: chinitsuHandKey(question.counts),
    answer,
    answerDisplay: answer.map(tileDisplay).join("・"),
    answerReading: "",
    ukeire: answer,
    ukeireCount: remaining,
    explanation: `全部で${answer.length}種${remaining}枚なのだ！`,
    narration: [],
    toolPath,
    toolUrl,
    generatedAt,
    verification: { engine: "mahjong-core/findChinitsuWaits13", verified: true }
  };
}

export function verifyProblem(problem: ShortsProblem): void {
  if (problem.type === "nani-kiru") {
    const counts = Array(34).fill(0);
    for (const tile of problem.hand) counts[tileIndex(tile)] += 1;
    const results = analyzeDiscards(counts, { includeTenpaiDetails: false });
    const verifiedAnswers = bestDailyDiscards(results).map((result) => result.discard).sort((left, right) => tileIndex(left) - tileIndex(right));
    const serializedAnswers = problem.answer.slice().sort((left, right) => tileIndex(left) - tileIndex(right));
    const result = results.find((candidate) => candidate.discard === problem.answer[0]);
    if (verifiedAnswers.join(",") !== serializedAnswers.join(",") || !result || result.ukeireTiles !== problem.ukeireCount || result.ukeire.join(",") !== problem.ukeire.join(",")) {
      throw new Error(`${problem.id}: serialized nani-kiru answer does not match mahjong-core.`);
    }
    return;
  }
  const counts = Array(9).fill(0);
  for (const tile of problem.hand) counts[Number(tile[0]) - 1] += 1;
  const waits = findChinitsuWaits13(counts).map((rank) => `${rank}${problem.hand[0]!.at(-1)}`);
  if (waits.join(",") !== problem.answer.join(",")) {
    throw new Error(`${problem.id}: serialized machi answer does not match mahjong-core.`);
  }
}
