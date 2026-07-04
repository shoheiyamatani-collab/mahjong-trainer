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
    title: "四連形の端を外す",
    theme: "完全イーシャンテン",
    hand: "2344m2567p122334s",
    choices: ["2m", "3m", "5p"],
    answer: "2m",
    expectedUkeire: 32,
    point: "つながっている牌でも、残す形の強さを比べる。",
    explanation: "2mは2344mの中にあり一見残したくなりますが、ここを外しても3m4mの形は残ります。3mや5pを切ると両面やくっつきの幅が落ちるため、2m切りが一番広くなります。"
  },
  {
    id: "beginner_iishanten_004",
    title: "対子のどちらをほぐすか",
    theme: "対子ほぐし",
    hand: "333m6688p2334567s",
    choices: ["6p", "8p", "2s"],
    answer: "6p",
    expectedUkeire: 36,
    point: "対子が複数あるときは、残った形の受けを比べる。",
    explanation: "6pと8pはどちらも対子ですが、6pを外すと8pの雀頭候補を残しつつ索子の連続形を最大限使えます。8pや2sを切るよりテンパイへ進む牌が多くなります。"
  },
  {
    id: "beginner_iishanten_005",
    title: "暗刻まわりを残す",
    theme: "暗刻まわり",
    hand: "456788p23355578s",
    choices: ["2s", "4p", "7p"],
    answer: "2s",
    expectedUkeire: 23,
    point: "暗刻と連続形が絡む部分は、面子にも雀頭にも見られる。",
    explanation: "555sの周辺に3s7s8sがあり、索子は複数の見方ができます。2sを外すと暗刻まわりと筒子の形を両方残せるため、4pや7pを切るより広くなります。"
  },
  {
    id: "beginner_iishanten_006",
    title: "三面張変化を残す",
    theme: "三面張変化",
    hand: "7889m789p3455899s",
    choices: ["8s", "5s", "8m"],
    answer: "8s",
    expectedUkeire: 34,
    point: "連続形と対子が絡むところは、切った後の変化量を見る。",
    explanation: "8sは899sの中にあり残したく見えますが、5sの対子と345sの形を残した方が強くなります。8mを切ると萬子の伸びが、5sを切ると雀頭候補が弱くなります。"
  },
  {
    id: "beginner_iishanten_007",
    title: "同じ7でも価値が違う",
    theme: "浮き牌比較",
    hand: "5677m12378p12378s",
    choices: ["7m", "7p", "7s"],
    answer: "7m",
    expectedUkeire: 28,
    point: "同じ数字でも、周辺の形によって価値が変わる。",
    explanation: "7mは5677mの中にあり自然に見えますが、筒子と索子の78は両面候補として残したい形です。7mを外すと面子と両面候補のバランスが一番よくなります。"
  },
  {
    id: "beginner_iishanten_008",
    title: "強い形を壊さない",
    theme: "強い形を壊さない",
    hand: "44m123345789p569s",
    choices: ["6s", "5s", "9p"],
    answer: "6s",
    expectedUkeire: 28,
    point: "一見くっつきそうな形でも、全体の面子候補を優先する。",
    explanation: "569sはどれも気になりますが、6sを外すと5s9sを浮き牌として残しながら筒子の完成形を崩しません。5sや9pを切るより、次に進む牌が多くなります。"
  },
  {
    id: "beginner_iishanten_009",
    title: "雀頭候補を残す",
    theme: "雀頭なしイーシャンテン",
    hand: "3334m455679p3455s",
    choices: ["5s", "9p", "4m"],
    answer: "5s",
    expectedUkeire: 27,
    point: "暗刻、対子、連続形が重なる形では雀頭候補の残し方を見る。",
    explanation: "5sは対子で残したくなりますが、この手は333mや455679pにも雀頭候補と面子候補があります。5sを1枚外すと暗刻まわりと筒子の複合形を残せて、受け入れが一番広くなります。"
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
