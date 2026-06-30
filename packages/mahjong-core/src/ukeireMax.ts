import { analyzeDiscards, bestDiscardsForReview, type DiscardAnalysis } from "./analyzer";
import { type Counts34, type Tile, countsToTiles, parseHand, tileIndex, validateCounts } from "./tiles";

const NUMBER_TILE_COUNT = 27;
const MIN_BEST_UKEIRE_TYPES = 6;
const DEFAULT_MAX_ATTEMPTS = 1000;

const UKEIRE_MAX_SEEDS = [
  "1223678m3455p899s",
  "456789m126667p35s",
  "5m3333678p455678s",
  "22266679m444457s",
  "117m4555p677899s",
  "24556678m233678p",
  "2333567m4589p456s",
  "111334m7899p3666s",
  "3m4446789p222334s",
  "7m134556788p2234s",
  "467778m223p23678s",
  "5567789m115p1345s",
  "155678m3458889p3s",
  "55999m4557p34567s",
  "13357899m567p678s",
  "234m25p333667899s",
  "5789m224455668p7s",
  "13555m124567p123s",
  "77m223444579p789s",
  "455m34567p112223s"
];

const DIFFICULT_UKEIRE_MAX_SEEDS = [
  "456789m126667p35s",
  "5m3333678p455678s",
  "24556678m233678p",
  "2333567m4589p456s",
  "3m4446789p222334s",
  "467778m223p23678s",
  "5567789m115p1345s",
  "55999m4557p34567s",
  "13357899m567p678s",
  "5789m224455668p7s",
  "13555m124567p123s",
  "77m223444579p789s",
  "455m34567p112223s",
  "566m3455p1113334s",
  "66m67899p123455s",
  "23m788p234566678s",
  "2333m2334468p345s",
  "44m23456p1334789s",
  "255567888m44s777s",
  "4m2345667p578999s"
];

export interface UkeireMaxQuestion {
  counts: Counts34;
  results: DiscardAnalysis[];
  bestDiscards: Tile[];
  bestUkeireTypes: number;
  bestUkeireTiles: number;
}

export type UkeireMaxAnswerState = "correct" | "partial" | "wrong";

export interface DifficultUkeireQuestionConfig {
  noHonors: boolean;
  requireIishanten: boolean;
  allowTiedBest: boolean;
  minBestDiscardCount: number;
  maxBestDiscardCount: number;
  minBestSecondDiff: number;
  maxBestSecondDiff: number;
  nearBestRange: number;
  minNearBestCandidates: number;
  excludeObviousIsolatedBestDiscard: boolean;
  preferMiddleTiles: boolean;
  minMiddleTileRatio: number;
  preferComplexShapes: boolean;
  requireTripletOrNearShape: boolean;
  maxDifficultAttempts: number;
  relaxedMinNearBestCandidates: number;
  relaxedMinMiddleTileRatio: number;
}

export interface DifficultUkeireQuestionEvaluation {
  accepted: boolean;
  rejectReasons: string[];
  ranking: DiscardAnalysis[];
  bestSecondDiff: number | null;
  nearBestCandidateCount: number;
  middleTileRatio: number;
  complexShapeScore: number;
}

export const DIFFICULT_UKEIRE_QUESTION_CONFIG: DifficultUkeireQuestionConfig = {
  noHonors: true,
  requireIishanten: true,
  allowTiedBest: false,
  minBestDiscardCount: 1,
  maxBestDiscardCount: 1,
  minBestSecondDiff: 1,
  maxBestSecondDiff: 4,
  nearBestRange: 5,
  minNearBestCandidates: 3,
  excludeObviousIsolatedBestDiscard: true,
  preferMiddleTiles: true,
  minMiddleTileRatio: 0.6,
  preferComplexShapes: true,
  requireTripletOrNearShape: false,
  maxDifficultAttempts: 80,
  relaxedMinNearBestCandidates: 2,
  relaxedMinMiddleTileRatio: 0.5
};

export const HARD_UKEIRE_QUESTION_CONFIG: DifficultUkeireQuestionConfig = {
  ...DIFFICULT_UKEIRE_QUESTION_CONFIG,
  allowTiedBest: true,
  minBestDiscardCount: 1,
  maxBestDiscardCount: 3,
  minBestSecondDiff: 0,
  maxBestSecondDiff: 4,
  minNearBestCandidates: 3,
  requireTripletOrNearShape: true,
  maxDifficultAttempts: 260
};

export function buildUkeireMaxQuestion(counts: Counts34): UkeireMaxQuestion | null {
  validateCounts(counts, 14);
  if (hasHonors(counts)) return null;

  const results = analyzeDiscards(counts).filter((result) => result.afterDiscardShanten === 1);
  if (results.length === 0) return null;

  const bestResults = bestDiscardsForReview(results);
  if (bestResults.length === 0) return null;

  const bestUkeireTypes = Math.max(...bestResults.map((result) => result.ukeireTypes));
  const bestUkeireTiles = Math.max(...bestResults.map((result) => result.ukeireTiles));
  if (bestUkeireTypes < MIN_BEST_UKEIRE_TYPES) return null;

  return {
    counts,
    results,
    bestDiscards: bestResults.map((result) => result.discard),
    bestUkeireTypes,
    bestUkeireTiles
  };
}

export function generateUkeireMaxQuestion(
  rng: () => number = Math.random,
  maxAttempts = DEFAULT_MAX_ATTEMPTS,
  config: DifficultUkeireQuestionConfig = DIFFICULT_UKEIRE_QUESTION_CONFIG
): UkeireMaxQuestion {
  for (const seed of shuffledDifficultSeeds(rng)) {
    const question = buildUkeireMaxQuestion(parseHand(seed));
    if (question && evaluateDifficultUkeireQuestion(question, config).accepted) return question;
  }

  let fallback: UkeireMaxQuestion | null = null;
  let relaxedFallback: UkeireMaxQuestion | null = null;
  let bestScored: { key: [number, number]; question: UkeireMaxQuestion } | null = null;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const question = buildUkeireMaxQuestion(randomNumberHand(rng));
    if (!question) continue;
    if (!fallback) fallback = question;

    const evaluation = evaluateDifficultUkeireQuestion(question, config);
    if (!relaxedFallback && evaluateDifficultUkeireQuestion(question, relaxedConfig(config)).accepted) {
      relaxedFallback = question;
    }

    if (evaluation.accepted) {
      const key: [number, number] = [
        config.preferComplexShapes ? evaluation.complexShapeScore : 0,
        config.preferMiddleTiles ? evaluation.middleTileRatio : 0
      ];
      if (!bestScored || key[0] > bestScored.key[0] || (key[0] === bestScored.key[0] && key[1] > bestScored.key[1])) {
        bestScored = { key, question };
      }
      if (evaluation.complexShapeScore >= 3) return question;
    }

    if (attempt >= config.maxDifficultAttempts) {
      if (bestScored) return bestScored.question;
      if (relaxedFallback) return relaxedFallback;
      if (fallback) return fallback;
    }
  }

  for (const seed of shuffledSeeds(rng)) {
    const seeded = buildUkeireMaxQuestion(parseHand(seed));
    if (seeded) return seeded;
  }

  const finalFallback = buildUkeireMaxQuestion(parseHand("1455m2345677p678s"));
  if (!finalFallback) {
    throw new Error("No Ukeire MAX question could be generated.");
  }
  return finalFallback;
}

export function generateHardUkeireMaxQuestion(
  rng: () => number = Math.random,
  maxAttempts = DEFAULT_MAX_ATTEMPTS,
  config: DifficultUkeireQuestionConfig = HARD_UKEIRE_QUESTION_CONFIG
): UkeireMaxQuestion {
  for (const seed of shuffledDifficultSeeds(rng)) {
    const question = buildUkeireMaxQuestion(parseHand(seed));
    if (question && evaluateDifficultUkeireQuestion(question, config).accepted) return question;
  }

  let fallback: UkeireMaxQuestion | null = null;
  let relaxedFallback: UkeireMaxQuestion | null = null;
  let bestScored: { key: [number, number, number]; question: UkeireMaxQuestion } | null = null;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const question = buildUkeireMaxQuestion(randomNumberHand(rng));
    if (!question) continue;

    const evaluation = evaluateDifficultUkeireQuestion(question, config);
    if (hasTripletOrNearShape(question.counts) && !fallback) fallback = question;

    const relaxed = evaluateDifficultUkeireQuestion(question, relaxedHardConfig(config));
    if (relaxed.accepted && !relaxedFallback) relaxedFallback = question;

    const score: [number, number, number] = [
      question.bestDiscards.length > 1 ? 2 : 0,
      evaluation.complexShapeScore,
      evaluation.middleTileRatio
    ];
    if (evaluation.accepted) {
      if (!bestScored || compareHardScore(score, bestScored.key) > 0) {
        bestScored = { key: score, question };
      }
      if (question.bestDiscards.length > 1 || evaluation.complexShapeScore >= 5) return question;
    }

    if (attempt >= config.maxDifficultAttempts) {
      if (bestScored) return bestScored.question;
      if (relaxedFallback) return relaxedFallback;
      if (fallback) return fallback;
    }
  }

  return generateUkeireMaxQuestion(rng, maxAttempts, relaxedConfig(config));
}

export function evaluateUkeireMaxAnswer(question: UkeireMaxQuestion, selected: Tile[]): UkeireMaxAnswerState {
  const answer = normalizeSelection(selected);
  const best = normalizeSelection(question.bestDiscards);
  if (answer.length === best.length && answer.every((tile) => best.includes(tile))) {
    return "correct";
  }
  if (answer.length > 0 && answer.length < best.length && answer.every((tile) => best.includes(tile))) {
    return "partial";
  }
  return "wrong";
}

export function toggleUkeireMaxSelection(selected: Tile[], tile: Tile): Tile[] {
  if (selected.includes(tile)) {
    return selected.filter((selectedTile) => selectedTile !== tile);
  }
  return [...selected, tile];
}

function normalizeSelection(tiles: Tile[]): Tile[] {
  return [...new Set(tiles)].sort((a, b) => tileIndex(a) - tileIndex(b));
}

export function evaluateDifficultUkeireQuestion(
  question: UkeireMaxQuestion,
  config: DifficultUkeireQuestionConfig = DIFFICULT_UKEIRE_QUESTION_CONFIG
): DifficultUkeireQuestionEvaluation {
  const ranking = getDiscardUkeireRanking(question.results);
  const middleRatio = middleTileRatio(question.counts);
  const complexScore = scoreComplexShape(question.counts);
  const reasons: string[] = [];

  if (config.noHonors && hasHonors(question.counts)) {
    reasons.push("honors");
  }

  if (config.requireIishanten && ranking.length === 0) {
    reasons.push("not_iishanten_after_discard");
  }

  let bestSecondDiff: number | null = null;
  let nearBestCandidateCount = 0;
  const bestDiscardCount = question.bestDiscards.length;
  if (ranking.length > 0) {
    const bestTiles = ranking[0]!.ukeireTiles;
    nearBestCandidateCount = ranking.filter((result) => bestTiles - result.ukeireTiles <= config.nearBestRange).length;

    if (bestDiscardCount < config.minBestDiscardCount || bestDiscardCount > config.maxBestDiscardCount) {
      reasons.push("best_discard_count");
    }

    if (ranking.length < 2) {
      reasons.push("no_second_candidate");
    } else {
      bestSecondDiff = bestTiles - ranking[1]!.ukeireTiles;
      if (bestSecondDiff === 0 && !config.allowTiedBest) {
        reasons.push("tied_best");
      } else if (!(config.minBestSecondDiff <= bestSecondDiff && bestSecondDiff <= config.maxBestSecondDiff)) {
        reasons.push("best_second_diff");
      }
    }

    if (nearBestCandidateCount < config.minNearBestCandidates) {
      reasons.push("not_enough_near_best_candidates");
    }

    if (config.excludeObviousIsolatedBestDiscard && isObviousIsolatedTile(ranking[0]!.discard, question.counts)) {
      reasons.push("obvious_isolated_best_discard");
    }
  }

  if (config.preferMiddleTiles && middleRatio < config.minMiddleTileRatio) {
    reasons.push("middle_tile_ratio");
  }

  if (config.requireTripletOrNearShape && !hasTripletOrNearShape(question.counts)) {
    reasons.push("not_triplet_or_near_shape");
  }

  return {
    accepted: reasons.length === 0,
    rejectReasons: reasons,
    ranking,
    bestSecondDiff,
    nearBestCandidateCount,
    middleTileRatio: middleRatio,
    complexShapeScore: complexScore
  };
}

export function getDiscardUkeireRanking(results: DiscardAnalysis[]): DiscardAnalysis[] {
  return results
    .filter((result) => result.afterDiscardShanten === 1)
    .slice()
    .sort((a, b) => b.ukeireTiles - a.ukeireTiles || b.ukeireTypes - a.ukeireTypes || tileIndex(a.discard) - tileIndex(b.discard));
}

export function filterDifficultUkeireQuestion(
  question: UkeireMaxQuestion,
  config: DifficultUkeireQuestionConfig = DIFFICULT_UKEIRE_QUESTION_CONFIG
): boolean {
  return evaluateDifficultUkeireQuestion(question, config).accepted;
}

export function difficultUkeireDebugInfo(question: UkeireMaxQuestion, config = DIFFICULT_UKEIRE_QUESTION_CONFIG) {
  const evaluation = evaluateDifficultUkeireQuestion(question, config);
  return {
    accepted: evaluation.accepted,
    rejectReasons: evaluation.rejectReasons,
    bestSecondDiff: evaluation.bestSecondDiff,
    nearBestCandidateCount: evaluation.nearBestCandidateCount,
    middleTileRatio: evaluation.middleTileRatio,
    complexShapeScore: evaluation.complexShapeScore,
    ranking: evaluation.ranking.map((result) => ({
      discard: result.discard,
      ukeireTypes: result.ukeireTypes,
      ukeireTiles: result.ukeireTiles,
      afterDiscardShanten: result.afterDiscardShanten
    }))
  };
}

export function isObviousIsolatedTile(tile: Tile, counts: Counts34): boolean {
  const index = tileIndex(tile);
  if (index >= NUMBER_TILE_COUNT || counts[index] !== 1) return false;

  const suitStart = Math.floor(index / 9) * 9;
  const rank = index % 9;
  const nearbyByRank = new Map<number, number[]>([
    [0, [1, 2]],
    [1, [0, 2, 3]],
    [7, [5, 6, 8]],
    [8, [6, 7]]
  ]);
  const nearby = nearbyByRank.get(rank) ?? [rank - 2, rank - 1, rank + 1, rank + 2];
  return nearby.every((nearbyRank) => counts[suitStart + nearbyRank] === 0);
}

export function middleTileRatio(counts: Counts34): number {
  const total = counts.reduce((sum, count) => sum + count, 0);
  if (total === 0) return 0;
  let middleTiles = 0;
  counts.slice(0, NUMBER_TILE_COUNT).forEach((count, index) => {
    const rank = (index % 9) + 1;
    if (3 <= rank && rank <= 7) middleTiles += count;
  });
  return middleTiles / total;
}

export function scoreComplexShape(counts: Counts34): number {
  const suitCounts = counts.slice(0, NUMBER_TILE_COUNT);
  const pairCount = suitCounts.filter((count) => count >= 2).length;
  const tripletCount = suitCounts.filter((count) => count >= 3).length;
  let score = pairCount >= 2 ? pairCount - 1 : 0;
  score += tripletCount * 2;

  for (let suitStart = 0; suitStart < NUMBER_TILE_COUNT; suitStart += 9) {
    score += scoreSuitComplexShape(counts.slice(suitStart, suitStart + 9));
  }
  return score;
}

export function hasTripletOrNearShape(counts: Counts34): boolean {
  if (counts.slice(0, NUMBER_TILE_COUNT).some((count) => count >= 3)) return true;

  for (let suitStart = 0; suitStart < NUMBER_TILE_COUNT; suitStart += 9) {
    const occupied = counts
      .slice(suitStart, suitStart + 9)
      .map((count, index) => count > 0 ? index : -1)
      .filter((index) => index >= 0);
    if (occupied.length < 3) continue;

    let componentLength = 1;
    let hasAdjacentOrOneGap = false;
    for (let i = 1; i < occupied.length; i += 1) {
      const gap = occupied[i]! - occupied[i - 1]!;
      if (gap <= 2) {
        componentLength += 1;
        if (gap <= 2) hasAdjacentOrOneGap = true;
        if (componentLength >= 5 && hasAdjacentOrOneGap) return true;
      } else {
        componentLength = 1;
        hasAdjacentOrOneGap = false;
      }
    }
  }

  return false;
}

function hasHonors(counts: Counts34): boolean {
  return counts.slice(NUMBER_TILE_COUNT).some((count) => count > 0);
}

function randomNumberHand(rng: () => number): Counts34 {
  const counts = Array(34).fill(0);
  while (countsToTiles(counts).length < 14) {
    const index = Math.floor(rng() * NUMBER_TILE_COUNT);
    if (counts[index] >= 4) continue;
    counts[index] += 1;
  }
  return counts;
}

function shuffledDifficultSeeds(rng: () => number): string[] {
  return shuffleStrings(DIFFICULT_UKEIRE_MAX_SEEDS, rng);
}

function relaxedConfig(config: DifficultUkeireQuestionConfig): DifficultUkeireQuestionConfig {
  return {
    ...config,
    maxBestSecondDiff: config.maxBestSecondDiff + 1,
    minNearBestCandidates: config.relaxedMinNearBestCandidates,
    minMiddleTileRatio: config.relaxedMinMiddleTileRatio
  };
}

function relaxedHardConfig(config: DifficultUkeireQuestionConfig): DifficultUkeireQuestionConfig {
  return {
    ...relaxedConfig(config),
    minBestSecondDiff: 0,
    requireTripletOrNearShape: config.requireTripletOrNearShape,
    maxBestDiscardCount: Math.max(config.maxBestDiscardCount, 3)
  };
}

function compareHardScore(left: [number, number, number], right: [number, number, number]): number {
  for (let index = 0; index < left.length; index += 1) {
    if (left[index]! !== right[index]!) return left[index]! - right[index]!;
  }
  return 0;
}

function scoreSuitComplexShape(suit: number[]): number {
  let score = 0;

  for (let rank = 0; rank < 9; rank += 1) {
    if (suit[rank]! < 3) continue;
    if (rank <= 6 && suit[rank + 1]! > 0 && suit[rank + 2]! > 0) score += 2;
    if (rank >= 2 && suit[rank - 1]! > 0 && suit[rank - 2]! > 0) score += 2;
    if (rank > 0 && rank < 8 && suit[rank - 1]! > 0 && suit[rank + 1]! > 0) score += 1;
  }

  for (let rank = 0; rank <= 6; rank += 1) {
    if (suit[rank]! > 0 && suit[rank + 1]! >= 2 && suit[rank + 2]! > 0) score += 2;
    if (suit[rank]! >= 2 && suit[rank + 1]! >= 2 && suit[rank + 2]! >= 2) score += 3;
  }

  for (let rank = 0; rank <= 5; rank += 1) {
    if (suit[rank]! > 0 && suit[rank + 1]! >= 2 && suit[rank + 2]! >= 2 && suit[rank + 3]! > 0) score += 3;
  }

  let blockLength = 0;
  for (const count of suit) {
    if (count > 0) {
      blockLength += 1;
      if (blockLength >= 4) score += 1;
    } else {
      blockLength = 0;
    }
  }

  return score;
}

function shuffledSeeds(rng: () => number): string[] {
  return shuffleStrings(UKEIRE_MAX_SEEDS, rng);
}

function shuffleStrings(values: string[], rng: () => number): string[] {
  const seeds = values.slice();
  for (let i = seeds.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [seeds[i], seeds[j]] = [seeds[j]!, seeds[i]!];
  }
  return seeds;
}
