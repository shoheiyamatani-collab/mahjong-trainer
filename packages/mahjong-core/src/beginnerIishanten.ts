import { analyzeDiscards, type DiscardAnalysis } from "./analyzer";
import { addTile, emptyCounts, type Counts34, type Tile, TILE_NAMES, validateCounts } from "./tiles";

export interface BeginnerIishantenProblem {
  id: string;
  title: string;
  theme: string;
  hand: string;
  choices: string[];
  answer: string;
  expectedUkeire?: number;
  explanation: string;
  point: string;
}

export interface BeginnerIishantenChoiceResult {
  discard: Tile;
  analysis: DiscardAnalysis;
  isAnswer: boolean;
}

export interface BeginnerIishantenQuestion {
  problem: BeginnerIishantenProblem;
  counts: Counts34;
  choices: BeginnerIishantenChoiceResult[];
  answerResult: DiscardAnalysis;
}

const EAST = TILE_NAMES[27]!;
const SOUTH = TILE_NAMES[28]!;
const WEST = TILE_NAMES[29]!;
const NORTH = TILE_NAMES[30]!;
const WHITE = TILE_NAMES[31]!;
const GREEN = TILE_NAMES[32]!;
const RED = TILE_NAMES[33]!;
const Z_TILES = [EAST, SOUTH, WEST, NORTH, WHITE, GREEN, RED] as const;

export const beginnerIishantenProblems: BeginnerIishantenProblem[] = [
  {
    id: "beginner_iishanten_001",
    title: "孤立牌を切って完全イーシャンテンへ",
    theme: "完全イーシャンテン",
    hand: "1239m45678p445s11z",
    choices: ["9m", "4s", "5s"],
    answer: "9m",
    expectedUkeire: 23,
    point: "孤立牌より、両面ターツと雀頭候補を残す。",
    explanation: "9mは他の牌とつながりにくい孤立牌です。4sや5sを切ると索子の対子や両面候補が弱くなります。孤立牌を外して、両面と雀頭候補が残る完全イーシャンテンに取ります。"
  },
  {
    id: "beginner_iishanten_002",
    title: "字牌孤立牌を切って形を残す",
    theme: "完全イーシャンテン",
    hand: "23456m233p678s557z",
    choices: ["7z", "2p", "5z"],
    answer: "7z",
    expectedUkeire: 23,
    point: "まず打牌後に一向聴を保つ。そのうえで受け入れを比べる。",
    explanation: "5zを切ると受け入れ枚数だけは多く見えますが、打牌後に一向聴ではなくなります。この問題では、打牌後に一向聴を保つ選択肢の中で7z切りが一番広くなります。"
  },
  {
    id: "beginner_iishanten_003",
    title: "強い複合形を壊さない",
    theme: "完全イーシャンテン",
    hand: "34567m445p123s557z",
    choices: ["7z", "4m", "4p"],
    answer: "7z",
    expectedUkeire: 23,
    point: "まず一向聴を維持し、強い複合形を壊さない。",
    explanation: "4m切りは受け入れ枚数だけなら多く見えますが、打牌後に一向聴ではありません。34567mや445pの形を残し、孤立している7zを切ると一向聴を保ちながら広く構えられます。"
  },
  {
    id: "beginner_iishanten_004",
    title: "くっつきイーシャンテンの基本",
    theme: "くっつきイーシャンテン",
    hand: "2345m3457p1239s66z",
    choices: ["9s", "7p", "5m"],
    answer: "9s",
    expectedUkeire: 48,
    point: "端の孤立牌より、中張牌の浮き牌を残す。",
    explanation: "2345mや3457pは、引き方によって良形テンパイに変化しやすい形です。9sは端牌で周辺の受けが少ない孤立牌なので、ここを切って中張牌のくっつきを残します。"
  },
  {
    id: "beginner_iishanten_005",
    title: "四連形4567を残す",
    theme: "くっつきイーシャンテン・四連形",
    hand: "4567m2349p678s155z",
    choices: ["1z", "9p", "4m", "7m"],
    answer: "1z",
    expectedUkeire: 41,
    point: "四連形はかなり強い。字牌孤立牌から外す。",
    explanation: "4567mは2mから9mまで広く変化する四連形です。9pも7p・8p・9pで伸びるため、孤立字牌の1zより価値があります。強い数牌の形を残して、1zを切ります。"
  },
  {
    id: "beginner_iishanten_006",
    title: "3567は見た目より強い",
    theme: "くっつきイーシャンテン・三面張変化",
    hand: "3567m2349p678s155z",
    choices: ["1z", "9p", "3m", "7m"],
    answer: "1z",
    expectedUkeire: 35,
    point: "一向聴を維持しながら、3567の良形変化を残す。",
    explanation: "7m切りは受け入れ枚数が多く見えますが、打牌後に一向聴ではありません。1zを切れば一向聴を保ち、3567mの4m引きによる三面張変化も残せます。"
  },
  {
    id: "beginner_iishanten_007",
    title: "3456と8sの両方を残す",
    theme: "くっつきイーシャンテン・浮き牌比較",
    hand: "3456m678p1238s166z",
    choices: ["1z", "8s", "3m", "6m"],
    answer: "1z",
    expectedUkeire: 45,
    point: "数牌の浮き牌は良形テンパイの種になる。",
    explanation: "3456mは四連形で、2mから7mまで広く受けられます。8sも6s・7s・8s・9sでくっつきます。重なり以外の価値が低い1zを切るのが自然です。"
  },
  {
    id: "beginner_iishanten_008",
    title: "四連形と6678を両方残す",
    theme: "くっつきイーシャンテン・強い形を壊さない",
    hand: "4567m234p6678s155z",
    choices: ["1z", "6s", "4m", "7m"],
    answer: "1z",
    expectedUkeire: 50,
    point: "四連形と複合形を残すと受け入れが大きくなる。",
    explanation: "4567mは強い四連形、6678sも対子と連続形が絡む強い形です。6sを切ると索子の伸びが消え、4mや7mを切ると四連形を壊します。1z切りが一番広くなります。"
  },
  {
    id: "beginner_iishanten_009",
    title: "雀頭なしでも両面を残す",
    theme: "雀頭なしイーシャンテン",
    hand: "12378m456p45789s1z",
    choices: ["1z", "7m", "5s"],
    answer: "1z",
    expectedUkeire: 28,
    point: "雀頭がなくても、両面候補を壊さない。",
    explanation: "この手は雀頭がありませんが、78mや45sの両面候補が残っています。7mや5sを切ると面子候補が弱くなります。孤立字牌の1zを切って、雀頭を作る受けと面子を作る受けを残します。"
  },
  {
    id: "beginner_iishanten_010",
    title: "雀頭なしの広い形",
    theme: "雀頭なしイーシャンテン",
    hand: "23456m34578p678s1z",
    choices: ["1z", "2m", "8p"],
    answer: "1z",
    expectedUkeire: 37,
    point: "複合形が多いと、雀頭がなくても受け入れは広い。",
    explanation: "23456mや34578pのような複合形があり、かなり広いイーシャンテンです。2mや8pを切ると強い連続形を壊します。孤立字牌の1zを切って、数牌の複合形を残します。"
  }
];

export function buildBeginnerIishantenQuestion(problem: BeginnerIishantenProblem): BeginnerIishantenQuestion {
  const counts = parseBeginnerIishantenHand(problem.hand);
  validateCounts(counts, 14);

  const analyses = analyzeDiscards(counts);
  const answerTile = parseBeginnerIishantenTile(problem.answer);
  const choices = problem.choices.map((discardText) => {
    const discard = parseBeginnerIishantenTile(discardText);
    const analysis = analyses.find((result) => result.discard === discard);
    if (!analysis) {
      throw new Error(`${problem.id}: choice ${discardText} is not in the hand.`);
    }
    return { discard, analysis, isAnswer: discard === answerTile };
  });

  const answerResult = choices.find((choice) => choice.isAnswer)?.analysis;
  if (!answerResult) {
    throw new Error(`${problem.id}: answer is not included in choices.`);
  }

  return {
    problem,
    counts,
    choices,
    answerResult
  };
}

export function parseBeginnerIishantenHand(text: string): Counts34 {
  const counts = emptyCounts();
  let i = 0;
  const value = text.trim();

  while (i < value.length) {
    if (/\s/.test(value[i]!)) {
      i += 1;
      continue;
    }

    const digits: string[] = [];
    while (i < value.length && /[1-9]/.test(value[i]!)) {
      digits.push(value[i]!);
      i += 1;
    }
    const suit = value[i];
    if (!suit || !["m", "p", "s", "z"].includes(suit)) {
      throw new Error(`Invalid beginner iishanten hand around: ${value.slice(i)}`);
    }
    i += 1;

    for (const digit of digits) {
      const tile = suit === "z" ? zTile(Number(digit)) : `${digit}${suit}` as Tile;
      addTileInPlace(counts, tile);
    }
  }

  return counts;
}

export function parseBeginnerIishantenTile(text: string): Tile {
  const value = text.trim();
  const match = value.match(/^([1-9])([mpsz])$/);
  if (!match) {
    if ((TILE_NAMES as readonly string[]).includes(value)) return value as Tile;
    throw new Error(`Invalid beginner iishanten tile: ${text}`);
  }
  const [, digit, suit] = match;
  return suit === "z" ? zTile(Number(digit)) : `${digit}${suit}` as Tile;
}

export function validateBeginnerIishantenProblem(problem: BeginnerIishantenProblem): void {
  const question = buildBeginnerIishantenQuestion(problem);
  const answer = question.answerResult;
  if (answer.afterDiscardShanten !== 1) {
    throw new Error(`${problem.id}: answer must leave iishanten.`);
  }

  const iishantenChoices = question.choices.filter((choice) => choice.analysis.afterDiscardShanten === 1);
  const bestTiles = Math.max(...iishantenChoices.map((choice) => choice.analysis.ukeireTiles));
  if (answer.ukeireTiles !== bestTiles) {
    throw new Error(`${problem.id}: answer ${problem.answer} is not max ukeire.`);
  }
}

function zTile(rank: number): Tile {
  const tile = Z_TILES[rank - 1];
  if (!tile) throw new Error(`Invalid honor rank: ${rank}z`);
  return tile;
}

function addTileInPlace(counts: Counts34, tile: Tile): void {
  const next = addTile(counts, tile);
  for (let index = 0; index < next.length; index += 1) {
    counts[index] = next[index]!;
  }
}
