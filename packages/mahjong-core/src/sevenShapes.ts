import { SUITS, type Suit } from "./tiles";

export type SevenShapeCategory = "三枚使い0個" | "三枚使い1個" | "三枚使い2個" | "四枚使い1個";
export type SevenShapeDifficulty = "basic" | "standard" | "hard";
export type SevenShapeMode = "basic" | "all";

export interface SevenShapePattern {
  id: number;
  category: SevenShapeCategory;
  tiles: number[];
  waits: number[];
  difficulty: SevenShapeDifficulty;
  hint: string;
  explanation: string;
}

export interface SevenShapeQuestion {
  patternId: number;
  category: SevenShapeCategory;
  tiles: number[];
  waits: number[];
  suit: Suit;
  difficulty: SevenShapeDifficulty;
  hint: string;
  explanation: string;
  remainingTiles: Record<number, number>;
}

export const SEVEN_SHAPE_PATTERNS: SevenShapePattern[] = [
  {
    id: 1,
    category: "三枚使い0個",
    tiles: [1, 1, 2, 3, 4, 5, 6],
    waits: [1, 4, 7],
    difficulty: "basic",
    hint: "雀頭候補を固定して、連続形の端と真ん中を確認。",
    explanation: "11を雀頭に見ると23456が残り、1・4・7で2面子1雀頭になります。"
  },
  {
    id: 2,
    category: "三枚使い0個",
    tiles: [1, 2, 3, 4, 5, 6, 7],
    waits: [1, 4, 7],
    difficulty: "basic",
    hint: "長い連続形は、3枚ずつの切り分けをずらして確認。",
    explanation: "1234567は123+456の形と234+567の形を両方見ます。"
  },
  {
    id: 3,
    category: "三枚使い0個",
    tiles: [2, 3, 4, 5, 5, 6, 7],
    waits: [2, 5, 8],
    difficulty: "basic",
    hint: "中央の対子を雀頭に固定する見方と、連続形に混ぜる見方を確認。",
    explanation: "2345567は55を雀頭に見る形と、456を面子にする形が重なります。待ちは2・5・8です。"
  },
  {
    id: 4,
    category: "三枚使い1個",
    tiles: [1, 1, 1, 2, 3, 4, 5],
    waits: [2, 3, 5, 6],
    difficulty: "basic",
    hint: "暗刻を面子にする場合と、雀頭にする場合を両方確認。",
    explanation: "111を面子に見る形と、1を雀頭候補にする形が重なります。"
  },
  {
    id: 5,
    category: "三枚使い1個",
    tiles: [1, 1, 1, 2, 2, 3, 4],
    waits: [2, 3, 5],
    difficulty: "basic",
    hint: "暗刻の横に対子がある形。雀頭の位置を入れ替えて見る。",
    explanation: "111の面子固定だけでなく、22を雀頭にした連続形も確認します。"
  },
  {
    id: 6,
    category: "三枚使い1個",
    tiles: [1, 1, 1, 3, 3, 4, 5],
    waits: [2, 3, 6],
    difficulty: "basic",
    hint: "暗刻とリャンメン、対子候補が絡む形。",
    explanation: "111を面子、33を雀頭に見ると2・6があり、3でも形が完成します。"
  },
  {
    id: 7,
    category: "三枚使い1個",
    tiles: [2, 3, 3, 3, 4, 5, 6],
    waits: [1, 2, 4, 7],
    difficulty: "standard",
    hint: "333を暗刻として使う場合と、3を雀頭にする場合を両方確認。",
    explanation: "2333456は333を面子に固定する見方と、3を雀頭候補にする見方が重なります。"
  },
  {
    id: 8,
    category: "三枚使い1個",
    tiles: [3, 4, 5, 5, 5, 6, 7],
    waits: [2, 5, 8],
    difficulty: "standard",
    hint: "555を暗刻で使う形と、雀頭として使う形を比べる。",
    explanation: "3455567は中央暗刻をどう扱うかで、2・5・8の待ちが見えます。"
  },
  {
    id: 9,
    category: "三枚使い2個",
    tiles: [1, 1, 1, 2, 2, 2, 3],
    waits: [1, 2, 3, 4],
    difficulty: "standard",
    hint: "連続する2つの暗刻を、片方ずつ雀頭候補として見る。",
    explanation: "1112223は111と222のどちらを面子・雀頭にするかで待ちが広がります。"
  },
  {
    id: 10,
    category: "三枚使い2個",
    tiles: [1, 1, 1, 2, 3, 3, 3],
    waits: [1, 2, 3, 4],
    difficulty: "standard",
    hint: "離れた暗刻2つと、間の連続候補を合わせて確認。",
    explanation: "1112333は暗刻2つのどちらかを雀頭にする形と、23の連続候補が絡みます。"
  },
  {
    id: 11,
    category: "三枚使い1個",
    tiles: [3, 3, 3, 4, 5, 5, 6],
    waits: [4, 5, 7],
    difficulty: "basic",
    hint: "暗刻の横に対子がある形。雀頭を固定しすぎない。",
    explanation: "3334556は333を面子にする形と、5を雀頭にする形を両方見ます。"
  },
  {
    id: 12,
    category: "三枚使い1個",
    tiles: [3, 3, 3, 5, 6, 7, 8],
    waits: [4, 5, 8],
    difficulty: "standard",
    hint: "暗刻と離れた連続形を分けて考える。",
    explanation: "3335678は333を固定した形と、3を雀頭にして567・678を見る形が重なります。"
  },
  {
    id: 13,
    category: "三枚使い1個",
    tiles: [3, 3, 3, 4, 4, 5, 5],
    waits: [3, 4, 5, 6],
    difficulty: "standard",
    hint: "暗刻と2つの対子が絡む形。雀頭候補を入れ替える。",
    explanation: "3334455は333を面子にするだけでなく、4・5の対子も雀頭候補になります。"
  },
  {
    id: 14,
    category: "三枚使い1個",
    tiles: [3, 3, 4, 4, 4, 5, 5],
    waits: [3, 4, 5],
    difficulty: "hard",
    hint: "真ん中の暗刻と両側の対子を見る。",
    explanation: "3344455は444を面子にする形と、4を雀頭にする形が重なります。"
  },
  {
    id: 15,
    category: "三枚使い2個",
    tiles: [3, 3, 3, 5, 7, 7, 7],
    waits: [4, 5, 6],
    difficulty: "hard",
    hint: "離れた暗刻2つの間を埋める牌を確認。",
    explanation: "3335777は3と7の暗刻を固定しつつ、中央の5を軸に4・5・6を見ます。"
  },
  {
    id: 16,
    category: "三枚使い1個",
    tiles: [1, 1, 6, 7, 8, 8, 8],
    waits: [1, 5, 8],
    difficulty: "hard",
    hint: "端の対子と離れた暗刻を別々に見る。",
    explanation: "1167888は11の雀頭候補と888の暗刻候補を分けて、1・5・8を確認します。"
  },
  {
    id: 17,
    category: "四枚使い1個",
    tiles: [1, 1, 2, 2, 2, 2, 3],
    waits: [1, 3, 4],
    difficulty: "hard",
    hint: "4枚使いは、暗刻＋1枚にも対子＋対子にも見える。",
    explanation: "2222をどう分けるかで、1・3・4の待ちが残ります。"
  },
  {
    id: 18,
    category: "四枚使い1個",
    tiles: [1, 2, 3, 3, 3, 3, 4],
    waits: [1, 2, 4, 5],
    difficulty: "hard",
    hint: "4枚使いを中心に、左右の順子を確認。",
    explanation: "3333を暗刻＋単独牌としても、対子を含む形としても見ます。"
  },
  {
    id: 19,
    category: "四枚使い1個",
    tiles: [3, 3, 4, 5, 5, 5, 5],
    waits: [3, 4, 6],
    difficulty: "hard",
    hint: "4枚使いを刻子・対子・順子の材料として見比べる。",
    explanation: "3345555は5555を固定せず、5を面子にも雀頭にも使う候補を確認します。"
  }
];

export function getSevenShapePatterns(mode: SevenShapeMode = "basic"): SevenShapePattern[] {
  if (mode === "basic") return SEVEN_SHAPE_PATTERNS.filter((pattern) => pattern.id <= 16);
  return SEVEN_SHAPE_PATTERNS.slice();
}

export function generateSevenShapeQuestion(
  mode: SevenShapeMode = "basic",
  rng: () => number = Math.random,
  recentKeys: string[] = [],
  suit: Suit = randomSuit(rng),
  maxAttempts = 200
): SevenShapeQuestion {
  const pool = getSevenShapePatterns(mode);
  const recent = new Set(recentKeys);
  let fallback: SevenShapeQuestion | null = null;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const pattern = pool[Math.floor(rng() * pool.length)]!;
    const question = toQuestion(pattern, pattern.tiles, pattern.waits, suit);
    if (!fallback) fallback = question;
    if (!recent.has(sevenShapeQuestionKey(question))) return question;
  }

  if (fallback) return fallback;
  throw new Error("Could not generate a seven-shape question.");
}

export function buildSevenShapeQuestion(patternId: number, suit: Suit = randomSuit(Math.random)): SevenShapeQuestion {
  const pattern = SEVEN_SHAPE_PATTERNS.find((candidate) => candidate.id === patternId);
  if (!pattern) {
    throw new Error(`Seven-shape pattern ${patternId} was not found.`);
  }
  return toQuestion(pattern, pattern.tiles, pattern.waits, suit);
}

export function findSevenShapeWaits(tiles: number[]): number[] {
  validateSevenShapeTiles(tiles);
  const counts = toRankCounts(tiles);
  const waits: number[] = [];
  for (let rank = 1; rank <= 9; rank += 1) {
    if (counts[rank - 1]! >= 4) continue;
    const drawn = counts.slice();
    drawn[rank - 1] += 1;
    if (canFormTwoMeldsAndPair(drawn)) waits.push(rank);
  }
  return waits;
}

export function evaluateSevenShapeAnswer(correctWaits: number[], answer: number[]): boolean {
  return normalizeRanks(correctWaits).join(",") === normalizeRanks(answer).join(",");
}

export function toggleSevenShapeRankSelection(selected: number[], rank: number): number[] {
  if (selected.includes(rank)) {
    return selected.filter((selectedRank) => selectedRank !== rank);
  }
  return normalizeRanks([...selected, rank]);
}

export function sevenShapeQuestionKey(question: SevenShapeQuestion): string {
  return `${question.patternId}:${question.tiles.join("")}`;
}

export function validateSevenShapePattern(pattern: SevenShapePattern): void {
  validateSevenShapeTiles(pattern.tiles);
  const calculated = findSevenShapeWaits(pattern.tiles);
  if (calculated.join(",") !== normalizeRanks(pattern.waits).join(",")) {
    throw new Error(`Seven-shape pattern ${pattern.id} has invalid waits.`);
  }
  if (pattern.id < 1 || pattern.id > 19) {
    throw new Error("Seven-shape pattern id must be between 1 and 19.");
  }
}

export function validateSevenShapeTiles(tiles: number[]): void {
  if (tiles.length !== 7) {
    throw new Error(`Seven-shape hands must contain 7 tiles, got ${tiles.length}.`);
  }
  const counts = toRankCounts(tiles);
  counts.forEach((count, index) => {
    if (count > 4) {
      throw new Error(`Rank ${index + 1} appears more than four times.`);
    }
  });
}

function toQuestion(pattern: SevenShapePattern, tiles: number[], waits: number[], suit: Suit): SevenShapeQuestion {
  return {
    patternId: pattern.id,
    category: pattern.category,
    tiles: tiles.slice(),
    waits: waits.slice(),
    suit,
    difficulty: pattern.difficulty,
    hint: pattern.hint,
    explanation: pattern.explanation,
    remainingTiles: remainingTilesForSevenShapeWaits(tiles, waits)
  };
}

function remainingTilesForSevenShapeWaits(tiles: number[], waits: number[]): Record<number, number> {
  const counts = toRankCounts(tiles);
  const remaining: Record<number, number> = {};
  for (const rank of waits) {
    remaining[rank] = 4 - counts[rank - 1]!;
  }
  return remaining;
}

function canFormTwoMeldsAndPair(counts: number[]): boolean {
  if (counts.reduce((sum, count) => sum + count, 0) !== 8) return false;

  function search(current: number[], melds: number, hasPair: boolean): boolean {
    const remaining = current.reduce((sum, count) => sum + count, 0);
    if (remaining === 0) return melds === 2 && hasPair;

    if (melds < 2) {
      for (let index = 0; index < 9; index += 1) {
        if (current[index]! >= 3) {
          current[index] -= 3;
          if (search(current, melds + 1, hasPair)) return true;
          current[index] += 3;
        }
      }

      for (let index = 0; index <= 6; index += 1) {
        if (current[index]! > 0 && current[index + 1]! > 0 && current[index + 2]! > 0) {
          current[index] -= 1;
          current[index + 1] -= 1;
          current[index + 2] -= 1;
          if (search(current, melds + 1, hasPair)) return true;
          current[index] += 1;
          current[index + 1] += 1;
          current[index + 2] += 1;
        }
      }
    }

    if (!hasPair) {
      for (let index = 0; index < 9; index += 1) {
        if (current[index]! >= 2) {
          current[index] -= 2;
          if (search(current, melds, true)) return true;
          current[index] += 2;
        }
      }
    }

    return false;
  }

  return search(counts.slice(), 0, false);
}

function toRankCounts(tiles: number[]): number[] {
  const counts = Array(9).fill(0);
  for (const rank of tiles) {
    if (!Number.isInteger(rank) || rank < 1 || rank > 9) {
      throw new Error(`Seven-shape ranks must be between 1 and 9: ${rank}`);
    }
    counts[rank - 1] += 1;
  }
  return counts;
}

function normalizeRanks(ranks: number[]): number[] {
  return [...new Set(ranks)].sort((a, b) => a - b);
}

function randomSuit(rng: () => number): Suit {
  return SUITS[Math.floor(rng() * SUITS.length)]!;
}
