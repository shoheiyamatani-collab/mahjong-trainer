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
    tiles: [2, 2, 3, 4, 5, 6, 7],
    waits: [2, 5, 8],
    difficulty: "basic",
    hint: "雀頭が端にあるノベタン系として見る。",
    explanation: "22を雀頭に固定すると34567が残り、2・5・8が待ちになります。"
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
    tiles: [2, 2, 2, 3, 4, 5, 6],
    waits: [1, 3, 4, 6, 7],
    difficulty: "standard",
    hint: "暗刻を面子に固定しすぎない。",
    explanation: "222を面子に見る待ちと、2を雀頭に使う待ちが重なります。"
  },
  {
    id: 8,
    category: "三枚使い1個",
    tiles: [2, 3, 3, 3, 4, 5, 6],
    waits: [1, 2, 4, 7],
    difficulty: "standard",
    hint: "333を面子にするか、3を雀頭として使うか確認。",
    explanation: "暗刻を中心に、左右の連続形を別々に切り分けると待ちが見えます。"
  },
  {
    id: 9,
    category: "三枚使い1個",
    tiles: [3, 3, 3, 4, 5, 6, 7],
    waits: [2, 4, 5, 7, 8],
    difficulty: "standard",
    hint: "暗刻の横に伸びた形。端だけでなく中の牌も見る。",
    explanation: "333を固定する見方と、3を雀頭にする見方が合体しています。"
  },
  {
    id: 10,
    category: "三枚使い1個",
    tiles: [3, 4, 4, 4, 5, 6, 7],
    waits: [2, 3, 5, 8],
    difficulty: "standard",
    hint: "真ん中の暗刻は、面子にも雀頭にもなります。",
    explanation: "444の扱いを変えることで、リャンメンとシャンポン風の待ちが重なります。"
  },
  {
    id: 11,
    category: "三枚使い1個",
    tiles: [3, 4, 5, 5, 5, 6, 7],
    waits: [2, 5, 8],
    difficulty: "basic",
    hint: "暗刻が連続形の真ん中にある形。",
    explanation: "555を面子に見ると2・8、5を雀頭に使う見方も残ります。"
  },
  {
    id: 12,
    category: "三枚使い2個",
    tiles: [1, 1, 1, 2, 2, 2, 3],
    waits: [1, 2, 3, 4],
    difficulty: "standard",
    hint: "暗刻が2つ並ぶ形。どちらを雀頭にするかを確認。",
    explanation: "111と222のどちらかを雀頭候補にすると、複数の完成形が見えます。"
  },
  {
    id: 13,
    category: "三枚使い2個",
    tiles: [1, 1, 1, 2, 3, 3, 3],
    waits: [1, 2, 3, 4],
    difficulty: "standard",
    hint: "離れた暗刻2つの間をどう使うか見る。",
    explanation: "111・333のどちらかを雀頭にし、123の順子も候補に入れます。"
  },
  {
    id: 14,
    category: "三枚使い2個",
    tiles: [2, 2, 2, 3, 4, 4, 4],
    waits: [1, 2, 3, 4, 5],
    difficulty: "hard",
    hint: "暗刻2つと真ん中の浮き牌が絡む形。",
    explanation: "222・444の扱いを変えると、1〜5まで広く待ちが広がります。"
  },
  {
    id: 15,
    category: "三枚使い2個",
    tiles: [3, 3, 3, 4, 5, 5, 5],
    waits: [2, 3, 4, 5, 6],
    difficulty: "hard",
    hint: "2つの暗刻の間の連続形に注目。",
    explanation: "333と555を固定するだけでなく、345の順子も考えます。"
  },
  {
    id: 16,
    category: "三枚使い2個",
    tiles: [4, 4, 4, 5, 6, 6, 6],
    waits: [3, 4, 5, 6, 7],
    difficulty: "hard",
    hint: "暗刻2つのどちらを雀頭にしても成立するか確認。",
    explanation: "444・666と456の解釈が重なり、中央の待ちが増えます。"
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
    tiles: [2, 3, 4, 4, 4, 4, 5],
    waits: [2, 3, 5, 6],
    difficulty: "hard",
    hint: "真ん中の4枚使いは、複数の順子候補を作ります。",
    explanation: "4444を固定せず、234・345の順子候補を両方確認します。"
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
