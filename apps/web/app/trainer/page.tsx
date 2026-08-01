"use client";

import { useMemo, useReducer, useState } from "react";
import {
  addTile,
  analyzeDiscards,
  bestDiscardsForReview,
  beginnerIishantenProblems,
  buildBeginnerIishantenQuestion,
  buildSevenShapeQuestion,
  chinitsuHandKey,
  chinitsuTile,
  chinitsuTiles,
  calculateHandScore,
  countsToTiles,
  emptyCounts,
  evaluateChinitsuWaitAnswer,
  evaluateSevenShapeAnswer,
  evaluateUkeireMaxAnswer,
  generateChinitsuWaitQuestion,
  generateHardUkeireMaxQuestion,
  generateSevenShapeQuestion,
  nextChinitsuSuit,
  parseHand,
  parseBeginnerIishantenTile,
  SEVEN_SHAPE_PATTERNS,
  normalShanten,
  removeTile,
  sevenShapeQuestionKey,
  sortedHandText,
  sumCounts,
  TILE_NAMES,
  toggleChinitsuRankSelection,
  toggleSevenShapeRankSelection,
  toggleUkeireMaxSelection,
  type ChinitsuWaitQuestion,
  type Counts34,
  type DiscardAnalysis,
  type HandScoreResult,
  type HandScoreMeld,
  type HandScoreMeldKind,
  type ScoreResult,
  type SevenShapeMode,
  type SevenShapeQuestion,
  type Tile,
  type UkeireMaxAnswerState,
  type UkeireMaxQuestion
} from "@mahjong-trainer/mahjong-core";

type Mode = "checker" | "beginnerIishanten" | "ukeireMax" | "scoreQuizBeginner" | "scoreQuizHard" | "scoring" | "chinitsu" | "sevenShape";

interface AppState {
  counts: Counts34;
  textInput: string;
  error: string | null;
}

const PRACTICE_SESSION_SIZE = 10;

interface UkeirePracticeMistake {
  question: UkeireMaxQuestion;
  selected: Tile[];
  result: UkeireMaxAnswerState;
}

interface ChinitsuPracticeMistake {
  question: ChinitsuWaitQuestion;
  selected: number[];
}

interface SevenShapePracticeMistake {
  question: SevenShapeQuestion;
  selected: number[];
}

interface ScoreQuizQuestion {
  id: string;
  title: string;
  lesson: string;
  handText?: string;
  tiles?: Tile[];
  melds?: HandScoreMeld[];
  winningTile: Tile;
  isDealer: boolean;
  winMethod: "ron" | "tsumo";
  roundWind?: Tile;
  seatWind?: Tile;
  riichi?: boolean;
  ippatsu?: boolean;
  dora?: number;
  expectedHan?: number;
  expectedFu?: number | null;
  expectedLimitName?: ScoreResult["limitName"];
  choicePool?: string[];
  explanation: string;
}

interface ScoreQuizMistake {
  question: ScoreQuizQuestion;
  selected: string | null;
  correctAnswer: string;
}

type ScoreMeldInputKind = HandScoreMeldKind;

const SCORE_MELD_OPTIONS: Array<{ kind: ScoreMeldInputKind; label: string }> = [
  { kind: "chi", label: "チー" },
  { kind: "pon", label: "ポン" },
  { kind: "kan", label: "カン" },
  { kind: "ankan", label: "暗カン" }
];

type Action =
  | { type: "add"; tile: Tile }
  | { type: "remove"; tile: Tile }
  | { type: "undo" }
  | { type: "clear" }
  | { type: "sample" }
  | { type: "text"; value: string }
  | { type: "applyText" };

const SAMPLE_HAND = "345688m1234p3456s";
const SCORE_SAMPLE_HAND = "123m456m234p456p22s";
const IMAGE_SUFFIX = "-66-90-l-emb.png";
const HONOR_IMAGE_NUMBERS = new Map<string, number>([
  ["東", 1],
  ["南", 2],
  ["西", 3],
  ["北", 4],
  ["白", 5],
  ["發", 6],
  ["中", 7]
]);

const SCORE_EAST = TILE_NAMES[27]!;
const SCORE_SOUTH = TILE_NAMES[28]!;
const SCORE_WEST = TILE_NAMES[29]!;
const SCORE_WHITE = TILE_NAMES[31]!;

const BEGINNER_SCORE_QUESTIONS: ScoreQuizQuestion[] = [
  {
    id: "pinfu-ron-child",
    title: "平和ロン",
    lesson: "平和はロンだと30符。まずは子の1翻30符を覚える問題です。",
    handText: "123456m22789p345s",
    winningTile: "3s",
    isDealer: false,
    winMethod: "ron",
    explanation: "平和のみ。ロンは門前ロン10符が付いて30符になり、子の1翻30符は1,000点です。"
  },
  {
    id: "pinfu-tsumo-child",
    title: "平和ツモ",
    lesson: "平和ツモは20符。実戦でよく見る子の400・700です。",
    handText: "123789m345p22567s",
    winningTile: "5s",
    isDealer: false,
    winMethod: "tsumo",
    explanation: "平和と門前清自摸和で2翻20符。子の支払いは子400点、親700点です。"
  },
  {
    id: "tanyao-ron-child",
    title: "タンヤオのみ",
    lesson: "平和ではない1翻のロン。40符になりやすい形です。",
    handText: "234345m456678p22s",
    winningTile: "2s",
    isDealer: false,
    winMethod: "ron",
    explanation: "タンヤオのみ。雀頭待ちの2符と門前ロン10符で40符になり、子の1翻40符は1,300点です。"
  },
  {
    id: "yakuhai-open-pon",
    title: "\u5f79\u724c\u30dd\u30f3\uff0b\u4e00\u6c17\u901a\u8cab",
    lesson: "123\u30fb456\u30fb789\u304c\u540c\u3058\u8272\u3067\u305d\u308d\u3046\u3068\u4e00\u6c17\u901a\u8cab\u3067\u3059\u3002\u9cf4\u3044\u3066\u3044\u308b\u5834\u5408\u306f1\u7ffb\u306b\u306a\u308a\u307e\u3059\u3002",
    handText: "123456789m22p",
    melds: [{ kind: "pon", tiles: [SCORE_WHITE, SCORE_WHITE, SCORE_WHITE] }],
    winningTile: "2p",
    isDealer: false,
    winMethod: "ron",
    explanation: "\u767d\u30dd\u30f3\u306e\u5f79\u724c1\u7ffb\u306b\u3001\u842c\u5b50\u306e123\u30fb456\u30fb789\u3067\u4e00\u6c17\u901a\u8cab1\u7ffb\u304c\u4ed8\u304d\u307e\u3059\u3002\u5b50\u306e2\u7ffb30\u7b26\u30ed\u30f3\u306f2,000\u70b9\u3067\u3059\u3002"
  },
  {
    id: "chiitoitsu-child",
    title: "七対子",
    lesson: "七対子は固定25符。二盃口とは複合しません。",
    tiles: ["1m", "1m", "2m", "2m", "3p", "3p", "4p", "4p", "5s", "5s", "6s", "6s", SCORE_EAST, SCORE_EAST],
    winningTile: SCORE_EAST,
    isDealer: false,
    winMethod: "ron",
    roundWind: SCORE_SOUTH,
    seatWind: SCORE_WEST,
    explanation: "七対子は2翻25符固定。子の2翻25符は1,600点です。"
  },
  {
    id: "sanshoku-closed",
    title: "三色同順 門前",
    lesson: "門前三色は2翻。副露すると1翻に下がります。",
    handText: "123456m12355p123s",
    winningTile: "3s",
    isDealer: false,
    winMethod: "ron",
    explanation: "123の三色同順。門前なので2翻、ロンでおおむね40符になり2,600点です。"
  },
  {
    id: "sanshoku-open",
    title: "三色同順 副露",
    lesson: "同じ三色でも、鳴くと1翻に下がることを確認します。",
    handText: "456m12355p123s",
    melds: [{ kind: "chi", tiles: ["1m", "2m", "3m"] }],
    winningTile: "3s",
    isDealer: false,
    winMethod: "ron",
    explanation: "副露三色は1翻。副露ロンの30符で、子の1翻30符は1,000点です。"
  },
  {
    id: "chanta-closed",
    title: "チャンタ 門前",
    lesson: "すべての面子と雀頭に端牌・字牌が絡む形です。",
    handText: "123789m123789p99s",
    winningTile: "3p",
    isDealer: false,
    winMethod: "ron",
    explanation: "門前チャンタは2翻。ペンチャン待ちの符がつきやすく、子の2翻40符は2,600点です。"
  },
  {
    id: "chanta-open",
    title: "チャンタ 副露",
    lesson: "チャンタも副露すると1翻に下がります。",
    handText: "789m123789p99s",
    melds: [{ kind: "chi", tiles: ["1m", "2m", "3m"] }],
    winningTile: "3p",
    isDealer: false,
    winMethod: "ron",
    explanation: "副露チャンタは1翻。副露ロンの30符で、子の1翻30符は1,000点です。"
  },
  {
    id: "honitsu-closed",
    title: "混一色 門前",
    lesson: "一色＋字牌。門前なら3翻、副露なら2翻です。",
    tiles: ["1m", "2m", "3m", "4m", "5m", "6m", "7m", "8m", "9m", SCORE_EAST, SCORE_EAST, SCORE_WHITE, SCORE_WHITE, SCORE_WHITE],
    winningTile: SCORE_WHITE,
    isDealer: false,
    winMethod: "ron",
    roundWind: SCORE_SOUTH,
    seatWind: SCORE_WEST,
    explanation: "混一色3翻＋白1翻。4翻40符は満貫になり、子のロンは8,000点です。"
  },
  {
    id: "honitsu-open",
    title: "混一色 副露",
    lesson: "鳴いた混一色は2翻。役牌と組み合わせて実戦頻出です。",
    tiles: ["1m", "2m", "3m", "4m", "5m", "6m", "7m", "8m", "9m", SCORE_EAST, SCORE_EAST],
    melds: [{ kind: "pon", tiles: [SCORE_WHITE, SCORE_WHITE, SCORE_WHITE] }],
    winningTile: SCORE_EAST,
    isDealer: false,
    winMethod: "ron",
    roundWind: SCORE_SOUTH,
    seatWind: SCORE_WEST,
    explanation: "副露混一色2翻＋白1翻。子の3翻30符は3,900点です。"
  },
  {
    id: "chinitsu-closed",
    title: "清一色 門前",
    lesson: "門前清一色は6翻。満貫を超える代表的な高打点です。",
    handText: "11112345678922m",
    winningTile: "2m",
    isDealer: false,
    winMethod: "ron",
    explanation: "門前清一色は6翻。子のロンは跳満で12,000点です。"
  },
  {
    id: "chinitsu-open",
    title: "清一色 副露",
    lesson: "鳴いた清一色は5翻。それでも満貫以上です。",
    handText: "11145678922m",
    melds: [{ kind: "chi", tiles: ["1m", "2m", "3m"] }],
    winningTile: "2m",
    isDealer: false,
    winMethod: "ron",
    explanation: "副露清一色は5翻。子のロンは満貫で8,000点です。"
  },
  {
    id: "riichi-pinfu-dora",
    title: "リーチ平和ドラ1",
    lesson: "リーチ＋平和＋ドラ1は実戦で最重要の3,900点です。",
    handText: "123789m456p22345s",
    winningTile: "3s",
    isDealer: false,
    winMethod: "ron",
    riichi: true,
    dora: 1,
    explanation: "リーチ、平和、ドラ1で3翻30符。子のロンは3,900点です。"
  },
  {
    id: "dealer-pinfu-ron",
    title: "親の平和ロン",
    lesson: "親は同じ形でも点数が上がります。",
    handText: "123789m23488p456s",
    winningTile: "4s",
    isDealer: true,
    winMethod: "ron",
    explanation: "親の1翻30符ロンは1,500点。子の1,000点との違いを覚えます。"
  },
  {
    id: "dealer-pinfu-tsumo",
    title: "親の平和ツモ",
    lesson: "親のツモは全員から同じ点をもらいます。",
    handText: "55678m123789p234s",
    winningTile: "6m",
    isDealer: true,
    winMethod: "tsumo",
    explanation: "親の平和ツモは2翻20符で700オールです。"
  }
];

const HARD_SCORE_CHOICES_RON = ["1,300点", "1,600点", "2,300点", "2,600点", "3,200点", "3,400点", "4,800点", "5,200点", "6,400点", "7,700点", "8,000点"];
const HARD_SCORE_CHOICES_CHILD_TSUMO = ["子400 / 親800", "子500 / 親1,000", "子1,000 / 親2,000", "子1,500 / 親2,900", "子2,000 / 親3,900"];

const HARD_SCORE_BASE_QUESTIONS: ScoreQuizQuestion[] = [
  {
    id: "hard-ankan-terminal-70-child-ron",
    title: "暗カン絡みの70符ロン",
    lesson: "暗カン、門前ロン、単騎待ちが重なった高符問題です。",
    handText: "234567m222p22s",
    melds: [{ kind: "ankan", tiles: ["1m", "1m", "1m", "1m"] }],
    winningTile: "2s",
    isDealer: false,
    winMethod: "ron",
    riichi: true,
    expectedHan: 1,
    expectedFu: 70,
    expectedLimitName: "normal",
    choicePool: HARD_SCORE_CHOICES_RON,
    explanation: "リーチのみ。副底20符、門前ロン10符、暗カン32符、暗刻4符、単騎2符で70符に切り上がります。子の1翻70符は2,300点です。"
  },
  {
    id: "hard-ankan-terminal-70-dealer-ron",
    title: "親の70符ロン",
    lesson: "同じ70符でも親になると支払いが変わります。",
    handText: "234567m222p22s",
    melds: [{ kind: "ankan", tiles: ["1m", "1m", "1m", "1m"] }],
    winningTile: "2s",
    isDealer: true,
    winMethod: "ron",
    riichi: true,
    expectedHan: 1,
    expectedFu: 70,
    expectedLimitName: "normal",
    choicePool: HARD_SCORE_CHOICES_RON,
    explanation: "リーチのみの1翻70符。親ロンは子より高く、3,400点です。"
  },
  {
    id: "hard-ankan-terminal-60-child-tsumo",
    title: "暗カン形のツモ",
    lesson: "ロンでは付く門前ロン10符が、ツモでは付かない点に注意します。",
    handText: "234567m222p22s",
    melds: [{ kind: "ankan", tiles: ["1m", "1m", "1m", "1m"] }],
    winningTile: "2s",
    isDealer: false,
    winMethod: "tsumo",
    riichi: true,
    expectedHan: 2,
    expectedFu: 60,
    expectedLimitName: "normal",
    choicePool: HARD_SCORE_CHOICES_CHILD_TSUMO,
    explanation: "リーチ、門前ツモで2翻。門前ロン10符はなくなり、ツモ符2符が付きます。子の2翻60符ツモは子1,000点、親2,000点です。"
  },
  {
    id: "hard-two-ankan-100-child-ron",
    title: "暗カン2つの100符",
    lesson: "暗カンが2つあると、符が一気に跳ねます。",
    handText: "234m22p678s",
    melds: [
      { kind: "ankan", tiles: ["1m", "1m", "1m", "1m"] },
      { kind: "ankan", tiles: ["9p", "9p", "9p", "9p"] }
    ],
    winningTile: "2p",
    isDealer: false,
    winMethod: "ron",
    riichi: true,
    expectedHan: 1,
    expectedFu: 100,
    expectedLimitName: "normal",
    choicePool: HARD_SCORE_CHOICES_RON,
    explanation: "リーチのみ。暗カン2つと門前ロン、単騎待ちで100符になります。子の1翻100符は3,200点です。"
  },
  {
    id: "hard-two-ankan-100-dealer-ron",
    title: "親の100符ロン",
    lesson: "高符の親ロンは、満貫未満でもかなり高くなります。",
    handText: "234m22p678s",
    melds: [
      { kind: "ankan", tiles: ["1m", "1m", "1m", "1m"] },
      { kind: "ankan", tiles: ["9p", "9p", "9p", "9p"] }
    ],
    winningTile: "2p",
    isDealer: true,
    winMethod: "ron",
    riichi: true,
    expectedHan: 1,
    expectedFu: 100,
    expectedLimitName: "normal",
    choicePool: HARD_SCORE_CHOICES_RON,
    explanation: "親の1翻100符ロンは4,800点です。満貫ではありません。"
  },
  {
    id: "hard-two-ankan-90-child-tsumo",
    title: "暗カン2つのツモ",
    lesson: "ロンとツモで符が同じとは限りません。",
    handText: "234m22p678s",
    melds: [
      { kind: "ankan", tiles: ["1m", "1m", "1m", "1m"] },
      { kind: "ankan", tiles: ["9p", "9p", "9p", "9p"] }
    ],
    winningTile: "2p",
    isDealer: false,
    winMethod: "tsumo",
    riichi: true,
    expectedHan: 2,
    expectedFu: 90,
    expectedLimitName: "normal",
    choicePool: HARD_SCORE_CHOICES_CHILD_TSUMO,
    explanation: "リーチ、門前ツモで2翻90符。子のツモは子1,500点、親2,900点です。"
  },
  {
    id: "hard-open-kan-white-50-ron",
    title: "明カンと役牌の50符",
    lesson: "副露手でもカンが絡むと50符まで上がります。",
    handText: "123p111s22m",
    melds: [
      { kind: "kan", tiles: ["9m", "9m", "9m", "9m"] },
      { kind: "pon", tiles: [SCORE_WHITE, SCORE_WHITE, SCORE_WHITE] }
    ],
    winningTile: "1s",
    isDealer: false,
    winMethod: "ron",
    expectedHan: 1,
    expectedFu: 50,
    expectedLimitName: "normal",
    choicePool: HARD_SCORE_CHOICES_RON,
    explanation: "白の役牌のみで1翻。明カンと刻子符で50符になり、子の1翻50符ロンは1,600点です。"
  },
  {
    id: "hard-open-kan-white-50-tsumo",
    title: "明カン役牌のツモ",
    lesson: "副露手でもツモ符が付く形では支払いが変わります。",
    handText: "123p111s22m",
    melds: [
      { kind: "kan", tiles: ["9m", "9m", "9m", "9m"] },
      { kind: "pon", tiles: [SCORE_WHITE, SCORE_WHITE, SCORE_WHITE] }
    ],
    winningTile: "1s",
    isDealer: false,
    winMethod: "tsumo",
    expectedHan: 1,
    expectedFu: 50,
    expectedLimitName: "normal",
    choicePool: HARD_SCORE_CHOICES_CHILD_TSUMO,
    explanation: "役牌1翻50符。子のツモは子400点、親800点です。"
  },
  {
    id: "hard-open-toitoi-kan-50",
    title: "対々和とカンの50符",
    lesson: "対々和に役牌とカンが絡む、実戦で迷いやすい副露形です。",
    handText: "222m55p",
    melds: [
      { kind: "kan", tiles: ["9m", "9m", "9m", "9m"] },
      { kind: "pon", tiles: ["1s", "1s", "1s"] },
      { kind: "pon", tiles: [SCORE_WHITE, SCORE_WHITE, SCORE_WHITE] }
    ],
    winningTile: "5p",
    isDealer: false,
    winMethod: "ron",
    expectedHan: 3,
    expectedFu: 50,
    expectedLimitName: "normal",
    choicePool: HARD_SCORE_CHOICES_RON,
    explanation: "対々和2翻、白1翻で3翻。50符なので子ロン6,400点です。"
  },
  {
    id: "hard-edge-wait-40-ron",
    title: "辺張で40符に上がるロン",
    lesson: "平和形に見えやすいですが、辺張待ちは待ち符が付きます。",
    handText: "123456m123p45677s",
    winningTile: "3p",
    isDealer: false,
    winMethod: "ron",
    riichi: true,
    expectedHan: 1,
    expectedFu: 40,
    expectedLimitName: "normal",
    choicePool: HARD_SCORE_CHOICES_RON,
    explanation: "リーチのみ。辺張待ち2符と門前ロン10符で40符に切り上がります。子の1翻40符は1,300点です。"
  },
  {
    id: "hard-chanta-40-ron",
    title: "チャンタの40符ロン",
    lesson: "役は見えるが、符を30符で見積もると外しやすい形です。",
    handText: "123789m123789p99s",
    winningTile: "3p",
    isDealer: false,
    winMethod: "ron",
    riichi: true,
    expectedHan: 3,
    expectedFu: 40,
    expectedLimitName: "normal",
    choicePool: HARD_SCORE_CHOICES_RON,
    explanation: "チャンタ2翻、リーチ1翻で3翻。辺張待ち込みで40符となり、子ロン5,200点です。"
  }
];

type NumberSuit = "m" | "p" | "s";

interface HardScoreTileVariant {
  suitMap: Record<NumberSuit, NumberSuit>;
  mirror: boolean;
}

const HARD_SCORE_TILE_VARIANTS: HardScoreTileVariant[] = [
  { suitMap: { m: "m", p: "p", s: "s" }, mirror: false },
  { suitMap: { m: "p", p: "s", s: "m" }, mirror: false },
  { suitMap: { m: "s", p: "m", s: "p" }, mirror: false },
  { suitMap: { m: "p", p: "m", s: "s" }, mirror: false },
  { suitMap: { m: "s", p: "p", s: "m" }, mirror: false },
  { suitMap: { m: "m", p: "s", s: "p" }, mirror: false },
  { suitMap: { m: "m", p: "p", s: "s" }, mirror: true },
  { suitMap: { m: "p", p: "s", s: "m" }, mirror: true },
  { suitMap: { m: "s", p: "m", s: "p" }, mirror: true },
  { suitMap: { m: "p", p: "m", s: "s" }, mirror: true },
  { suitMap: { m: "s", p: "p", s: "m" }, mirror: true },
  { suitMap: { m: "m", p: "s", s: "p" }, mirror: true }
];

const HARD_SCORE_QUESTIONS: ScoreQuizQuestion[] = buildHardScoreQuestions(HARD_SCORE_BASE_QUESTIONS, 100);

function buildHardScoreQuestions(baseQuestions: ScoreQuizQuestion[], total: number): ScoreQuizQuestion[] {
  const questions: ScoreQuizQuestion[] = [];
  let index = 0;
  while (questions.length < total && index < total * 30) {
    const template = baseQuestions[index % baseQuestions.length]!;
    const question = index < baseQuestions.length ? template : hardScoreQuestionVariant(template, index);
    if (isHardScoreQuestionAllowed(question)) questions.push(question);
    index += 1;
  }
  if (questions.length < total) {
    throw new Error(`Could not build ${total} hard score questions.`);
  }
  return questions;
}

function hardScoreQuestionVariant(template: ScoreQuizQuestion, index: number): ScoreQuizQuestion {
  const { expectedHan, expectedFu, expectedLimitName, choicePool, ...base } = template;
  const pattern = Math.floor(index / HARD_SCORE_BASE_QUESTIONS.length);
  const tileVariant = HARD_SCORE_TILE_VARIANTS[index % HARD_SCORE_TILE_VARIANTS.length]!;
  const transformed = transformScoreQuestionTiles(base, tileVariant);
  const isDealer = pattern % 2 === 0 ? !template.isDealer : template.isDealer;
  const dora = pattern % 4 === 0 ? (template.dora ?? 0) + 1 : template.dora;

  return {
    ...transformed,
    id: `${template.id}-deck-${String(index + 1).padStart(3, "0")}`,
    title: `${template.title} ${String(index + 1).padStart(3, "0")}`,
    isDealer,
    dora,
    lesson: template.lesson,
    explanation: template.explanation
  };
}

function transformScoreQuestionTiles(question: Omit<ScoreQuizQuestion, "expectedHan" | "expectedFu" | "expectedLimitName" | "choicePool">, variant: HardScoreTileVariant): Omit<ScoreQuizQuestion, "expectedHan" | "expectedFu" | "expectedLimitName" | "choicePool"> {
  return {
    ...question,
    handText: question.handText ? transformHandText(question.handText, variant) : undefined,
    tiles: question.tiles?.map((tile) => transformTile(tile, variant)),
    melds: question.melds?.map((meld) => ({ ...meld, tiles: sortTiles(meld.tiles.map((tile) => transformTile(tile, variant))) })),
    winningTile: transformTile(question.winningTile, variant)
  };
}

function transformHandText(text: string, variant: HardScoreTileVariant): string {
  return text.replace(/([1-9]+)([mps])/g, (_match, digits: string, suit: NumberSuit) => {
    const transformedDigits = [...digits]
      .map((digit) => variant.mirror ? String(10 - Number(digit)) : digit)
      .sort()
      .join("");
    return `${transformedDigits}${variant.suitMap[suit]}`;
  });
}

function transformTile(tile: Tile, variant: HardScoreTileVariant): Tile {
  const suit = tile[1] as NumberSuit | undefined;
  if (!suit || !["m", "p", "s"].includes(suit)) return tile;
  const rank = Number(tile[0]);
  const nextRank = variant.mirror ? 10 - rank : rank;
  return `${nextRank}${variant.suitMap[suit]}` as Tile;
}

function isHardScoreQuestionAllowed(question: ScoreQuizQuestion): boolean {
  try {
    const result = scoreQuizResult(question);
    if (result.score.limitName === "yakuman") return false;
    if (result.score.fu === 30) return false;
    return true;
  } catch {
    return false;
  }
}

const initialCounts = parseHand(SAMPLE_HAND);

function reducer(state: AppState, action: Action): AppState {
  try {
    if (action.type === "add") {
      if (sumCounts(state.counts) >= 14) {
        return { ...state, error: "手牌は14枚までです。" };
      }
      const counts = addTile(state.counts, action.tile);
      return syncCounts(counts);
    }
    if (action.type === "remove") {
      const counts = removeTile(state.counts, action.tile);
      return syncCounts(counts);
    }
    if (action.type === "undo") {
      const tiles = countsToTiles(state.counts);
      const last = tiles.at(-1);
      if (!last) return state;
      return syncCounts(removeTile(state.counts, last));
    }
    if (action.type === "clear") {
      return syncCounts(emptyCounts());
    }
    if (action.type === "sample") {
      return syncCounts(parseHand(SAMPLE_HAND));
    }
    if (action.type === "text") {
      return { ...state, textInput: action.value, error: null };
    }
    if (action.type === "applyText") {
      const counts = parseHand(state.textInput);
      if (sumCounts(counts) > 14) {
        return { ...state, error: "手牌は14枚までです。" };
      }
      return syncCounts(counts);
    }
    return state;
  } catch (error) {
    return { ...state, error: error instanceof Error ? error.message : String(error) };
  }
}

function syncCounts(counts: Counts34): AppState {
  return {
    counts,
    textInput: sortedHandText(counts),
    error: null
  };
}

export default function Home() {
  const [mode, setMode] = useState<Mode>("checker");
  const [openModeGroup, setOpenModeGroup] = useState<"analysis" | "practice" | null>(null);
  const [state, dispatch] = useReducer(reducer, syncCounts(initialCounts));
  const activeModeGroup = mode === "checker" || mode === "scoring" ? "analysis" : "practice";
  const selectMode = (nextMode: Mode) => {
    setMode(nextMode);
    setOpenModeGroup(null);
  };

  return (
    <main className="shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Mahjong Trainer</p>
          <h1>麻雀 牌理トレーナー</h1>
        </div>
        <div className="countBadge">{sumCounts(state.counts)} / 14</div>
      </header>

      <nav className="modeSelector" aria-label="モード">
        <div className="modeGroupTabs">
          <button
            className={activeModeGroup === "analysis" ? "modeGroupTab analysis active" : "modeGroupTab analysis"}
            data-open={openModeGroup === "analysis"}
            onClick={() => {
              setMode("checker");
              setOpenModeGroup(openModeGroup === "analysis" ? null : "analysis");
            }}
            type="button"
          >
            解析モード
          </button>
          <button
            className={activeModeGroup === "practice" ? "modeGroupTab practice active" : "modeGroupTab practice"}
            data-open={openModeGroup === "practice"}
            onClick={() => {
              setMode("ukeireMax");
              setOpenModeGroup(openModeGroup === "practice" ? null : "practice");
            }}
            type="button"
          >
            問題演習モード
          </button>
        </div>

        {openModeGroup === "analysis" ? (
          <section className="modeGroup analysisModeGroup" aria-labelledby="analysis-mode-heading">
            <div className="modeGroupTitle" id="analysis-mode-heading">解析ツール</div>
            <div className="segments">
            <ModeButton active={mode === "checker"} onClick={() => selectMode("checker")}>牌理チェッカー</ModeButton>
            <ModeButton active={mode === "scoring"} onClick={() => selectMode("scoring")}>🔰 点数計算チェッカー</ModeButton>
            </div>
          </section>
        ) : null}

        {openModeGroup === "practice" ? (
          <section className="modeGroup practiceModeGroup" aria-labelledby="practice-mode-heading">
            <div className="modeGroupTitle" id="practice-mode-heading">問題演習</div>
            <div className="practiceLevelGroups">
              <div className="practiceLevel beginnerLevel">
                <div className="practiceLevelTitle">初心者向け</div>
                <div className="segments practiceSegments">
                  <ModeButton active={mode === "beginnerIishanten"} onClick={() => selectMode("beginnerIishanten")}>🔰 イーシャンテン何切る</ModeButton>
                  <ModeButton active={mode === "sevenShape"} onClick={() => selectMode("sevenShape")}>🔰 7枚形トレーニング</ModeButton>
                  <ModeButton active={mode === "scoreQuizBeginner"} onClick={() => selectMode("scoreQuizBeginner")}>🔰 点数計算問題</ModeButton>
                </div>
              </div>
              <div className="practiceLevel hardLevel">
                <div className="practiceLevelTitle">高難易度</div>
                <div className="segments practiceSegments">
                  <ModeButton active={mode === "ukeireMax"} onClick={() => selectMode("ukeireMax")}>🔥 受け入れMAX星人何切る</ModeButton>
                  <ModeButton active={mode === "chinitsu"} onClick={() => selectMode("chinitsu")}>🔥 清一色待ち当て</ModeButton>
                  <ModeButton active={mode === "scoreQuizHard"} onClick={() => selectMode("scoreQuizHard")}>🔥 点数計算HARD</ModeButton>
                </div>
              </div>
            </div>
          </section>
        ) : null}
      </nav>

      {mode === "checker" ? <CheckerMode state={state} dispatch={dispatch} /> : null}
      {mode === "beginnerIishanten" ? <BeginnerIishantenMode /> : null}
      {mode === "ukeireMax" ? <UkeireMaxMode /> : null}
      {mode === "chinitsu" ? <ChinitsuMode /> : null}
      {mode === "sevenShape" ? <SevenShapeTrainingMode /> : null}
      {mode === "scoreQuizBeginner" ? <ScoreQuizBeginnerMode /> : null}
      {mode === "scoreQuizHard" ? <ScoreQuizHardMode /> : null}
      {mode === "scoring" ? <ScoringMode /> : null}
    </main>
  );
}

function ModeButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button className={active ? "segment active" : "segment"} onClick={onClick} type="button">
      {children}
    </button>
  );
}

function CheckerMode({ state, dispatch }: { state: AppState; dispatch: React.Dispatch<Action> }) {
  const tiles = countsToTiles(state.counts);
  const handShanten = useMemo(() => {
    if (sumCounts(state.counts) !== 14) return null;
    try {
      return normalShanten(state.counts);
    } catch {
      return null;
    }
  }, [state.counts]);
  const analysis = useMemo(() => {
    if (sumCounts(state.counts) !== 14) return null;
    try {
      const currentShanten = normalShanten(state.counts);
      if (currentShanten === -1) return { results: [], best: new Set<Tile>(), currentShanten };
      const results = analyzeDiscards(state.counts);
      const best = new Set(bestDiscardsForReview(results).map((result) => result.discard));
      return { results, best, currentShanten };
    } catch (error) {
      return { error: error instanceof Error ? error.message : String(error) };
    }
  }, [state.counts]);

  return (
    <section className="modeGrid">
      <section className="panel handPanel">
        <div className="panelHeader">
          <h2>手牌</h2>
          <span>{tiles.length} / 14</span>
        </div>
        {handShanten != null ? <ShantenBadge shanten={handShanten} /> : null}
        <TileStrip tiles={tiles} onTileClick={(tile) => dispatch({ type: "remove", tile })} emptyText="牌を追加してください" />
        <div className="actions">
          <button type="button" onClick={() => dispatch({ type: "undo" })}>一枚戻す</button>
          <button type="button" onClick={() => dispatch({ type: "clear" })}>クリア</button>
          <button type="button" onClick={() => dispatch({ type: "sample" })}>サンプル</button>
        </div>
        {state.error ? <p className="error">{state.error}</p> : null}
      </section>

      <section className="panel palettePanel">
        <div className="panelHeader">
          <h2>牌を追加</h2>
        </div>
        <TilePalette counts={state.counts} onAdd={(tile) => dispatch({ type: "add", tile })} />
      </section>

      <section className="resultsPanel">
        <div className="panelHeader">
          <h2>打牌候補・有効牌比較</h2>
        </div>
        {analysis == null ? (
          <div className="emptyState">14枚の手牌を入力すると、打牌候補を比較します。</div>
        ) : "error" in analysis ? (
          <div className="error">{analysis.error}</div>
        ) : analysis.currentShanten === -1 ? (
          <div className="agariNotice">アガッテルアルヨ…</div>
        ) : (
          <DiscardResults results={analysis.results} best={analysis.best} />
        )}
      </section>
    </section>
  );
}

function UkeireMaxMode() {
  const [question, setQuestion] = useState<UkeireMaxQuestion>(() => generateUkeireQuestion([]));
  const [selected, setSelected] = useState<Tile[]>([]);
  const [checked, setChecked] = useState(false);
  const [recentQuestionKeys, setRecentQuestionKeys] = useState<string[]>([]);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [mistakes, setMistakes] = useState<UkeirePracticeMistake[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [reviewIndex, setReviewIndex] = useState<number | null>(null);
  const selectedSet = useMemo(() => new Set(selected), [selected]);
  const result = checked ? evaluateUkeireMaxAnswer(question, selected) : null;
  const best = useMemo(() => new Set(question.bestDiscards), [question]);

  function toggle(tile: Tile) {
    if (checked) return;
    setSelected((current) => toggleUkeireMaxSelection(current, tile));
  }

  function resetSession() {
    setQuestion(generateUkeireQuestion(recentQuestionKeys));
    setSelected([]);
    setChecked(false);
    setAnsweredCount(0);
    setCorrectCount(0);
    setMistakes([]);
    setShowResult(false);
    setReviewIndex(null);
  }

  function finishCurrentQuestion() {
    const currentResult = evaluateUkeireMaxAnswer(question, selected);
    const nextAnsweredCount = answeredCount + 1;
    const nextCorrectCount = correctCount + (currentResult === "correct" ? 1 : 0);
    const nextMistakes =
      currentResult === "correct" ? mistakes : [...mistakes, { question, selected: [...selected], result: currentResult }];

    setAnsweredCount(nextAnsweredCount);
    setCorrectCount(nextCorrectCount);
    setMistakes(nextMistakes);

    if (nextAnsweredCount >= PRACTICE_SESSION_SIZE) {
      setShowResult(true);
      setReviewIndex(null);
      return;
    }

    const recent = [...recentQuestionKeys, ukeireQuestionKey(question)].slice(-12);
    setQuestion(generateUkeireQuestion(recent));
    setRecentQuestionKeys(recent);
    setSelected([]);
    setChecked(false);
  }

  function nextQuestion() {
    if (!checked) {
      setChecked(true);
      return;
    }
    finishCurrentQuestion();
  }

  if (showResult) {
    return (
      <PracticeResultPanel
        correctCount={correctCount}
        mistakes={mistakes}
        onReviewMistakes={() => setReviewIndex(0)}
        onReset={resetSession}
        renderReview={(mistake, index) => (
          <UkeireMistakeReview
            mistake={mistake}
            index={index}
            total={mistakes.length}
            onNext={() => setReviewIndex((current) => (current == null ? 0 : Math.min(current + 1, mistakes.length - 1)))}
            onPrevious={() => setReviewIndex((current) => (current == null ? 0 : Math.max(current - 1, 0)))}
          />
        )}
        reviewIndex={reviewIndex}
      />
    );
  }

  return (
    <section className="modeGrid ukeireMaxMode">
      <section className="panel handPanel">
        <div className="panelHeader">
          <h2>🔥 受け入れMAX星人何切る</h2>
        </div>
        <ProblemTileStrip counts={question.counts} selected={selectedSet} onTileClick={toggle} />
        <div className="actions">
          <button disabled={selected.length === 0} onClick={() => setChecked(true)} type="button">決定</button>
          <button onClick={nextQuestion} type="button">{checked ? "次の問題" : "答え合わせ"}</button>
        </div>
      </section>

      <section className="panel selectedPanel">
        <div className="panelHeader">
          <h2>選択中の牌</h2>
        </div>
        <TileStrip tiles={selected} emptyText="問題の牌をクリックして選んでください" />
        {result ? <AnswerResult result={result} /> : null}
        {checked ? (
          <div className="answerDetail">
            <div className="smallLabel">正解打牌</div>
            <TileStrip tiles={question.bestDiscards} />
            <p>最大受け入れ: {question.bestUkeireTypes}種 / {question.bestUkeireTiles}枚</p>
            <p>{answeredCount + 1} / {PRACTICE_SESSION_SIZE}問目</p>
          </div>
        ) : null}
      </section>

      <section className="resultsPanel">
        <div className="panelHeader">
          <h2>打牌候補・有効牌比較</h2>
        </div>
        {checked ? (
          <DiscardResults results={question.results} best={best} />
        ) : (
          <div className="emptyState">答え合わせ後に、各打牌候補の受け入れを確認できます。</div>
        )}
      </section>
    </section>
  );
}

function generateUkeireQuestion(recentKeys: string[]): UkeireMaxQuestion {
  let fallback = generateHardUkeireMaxQuestion();
  for (let attempt = 0; attempt < 24; attempt += 1) {
    const question = generateHardUkeireMaxQuestion();
    if (!recentKeys.includes(ukeireQuestionKey(question))) return question;
    fallback = question;
  }
  return fallback;
}

function ukeireQuestionKey(question: UkeireMaxQuestion): string {
  return sortedHandText(question.counts);
}

function PracticeResultPanel<T>({
  correctCount,
  mistakes,
  onReset,
  onReviewMistakes,
  renderReview,
  reviewIndex,
  totalCount = PRACTICE_SESSION_SIZE,
  resultDescription,
  resetLabel = "もう一度10問"
}: {
  correctCount: number;
  mistakes: T[];
  onReset: () => void;
  onReviewMistakes: () => void;
  renderReview: (mistake: T, index: number) => React.ReactNode;
  reviewIndex: number | null;
  totalCount?: number;
  resultDescription?: string;
  resetLabel?: string;
}) {
  const reviewMistake = reviewIndex == null ? null : mistakes[reviewIndex] ?? null;
  return (
    <section className="modeGrid practiceResultMode">
      <section className="panel selectedPanel">
        <div className="panelHeader">
          <h2>リザルト</h2>
        </div>
        <div className="resultCard">
          <div className="smallLabel">今回の成績</div>
          <div className="resultScore">{correctCount} / {totalCount}</div>
          <p>{resultDescription ?? "10問終了です。間違えた問題は答えを表示した状態で確認できます。"}</p>
        </div>
        <div className="actions">
          <button disabled={mistakes.length === 0} onClick={onReviewMistakes} type="button">間違えた問題を確認</button>
          <button onClick={onReset} type="button">{resetLabel}</button>
        </div>
      </section>

      {reviewMistake ? renderReview(reviewMistake, reviewIndex ?? 0) : (
        <section className="panel selectedPanel">
          <div className="emptyState">
            {mistakes.length === 0 ? "全問正解です。" : "間違えた問題を確認を押すと、復習を始められます。"}
          </div>
        </section>
      )}
    </section>
  );
}

function UkeireMistakeReview({
  mistake,
  index,
  total,
  onNext,
  onPrevious
}: {
  mistake: UkeirePracticeMistake;
  index: number;
  total: number;
  onNext: () => void;
  onPrevious: () => void;
}) {
  const best = useMemo(() => new Set(mistake.question.bestDiscards), [mistake.question]);
  return (
    <>
      <section className="panel handPanel">
        <div className="panelHeader">
          <h2>間違えた問題 {index + 1} / {total}</h2>
        </div>
        <TileStrip tiles={countsToTiles(mistake.question.counts)} />
        <div className="answerDetail compactAnswerDetail">
          <div className="smallLabel">選択打牌</div>
          <TileStrip tiles={mistake.selected} emptyText="未選択" />
          <AnswerResult result={mistake.result} />
          <div className="smallLabel">正解打牌</div>
          <TileStrip tiles={mistake.question.bestDiscards} />
        </div>
        <div className="actions">
          <button disabled={index === 0} onClick={onPrevious} type="button">前の問題</button>
          <button disabled={index >= total - 1} onClick={onNext} type="button">次の問題</button>
        </div>
      </section>
      <section className="resultsPanel">
        <div className="panelHeader">
          <h2>打牌候補・有効牌比較</h2>
        </div>
        <DiscardResults results={mistake.question.results} best={best} />
      </section>
    </>
  );
}

function BeginnerIishantenMode() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<Tile | null>(null);
  const [checked, setChecked] = useState(false);
  const problem = beginnerIishantenProblems[questionIndex]!;
  const question = useMemo(() => buildBeginnerIishantenQuestion(problem), [problem]);
  const correctTile = useMemo(() => parseBeginnerIishantenTile(problem.answer), [problem]);
  const selectedResult = selected ? question.choices.find((choice) => choice.discard === selected) ?? null : null;
  const isCorrect = checked && selected === correctTile;

  function selectDiscard(tile: Tile) {
    if (checked) return;
    setSelected(tile);
  }

  function nextQuestion() {
    if (!checked) {
      setChecked(true);
      return;
    }
    setQuestionIndex((current) => (current + 1) % beginnerIishantenProblems.length);
    setSelected(null);
    setChecked(false);
  }

  return (
    <section className="modeGrid beginnerIishantenMode">
      <section className="panel handPanel learningPanel">
        <div className="panelHeader">
          <h2>🔰 イーシャンテン何切る</h2>
          <span>{questionIndex + 1} / {beginnerIishantenProblems.length}</span>
        </div>
        <div className="questionCard">
          <div className="smallLabel">問題</div>
          <h3>どの牌を切りますか？</h3>
          <p>手牌を見て、次に進みやすい打牌を選んでください。</p>
        </div>
        <TileStrip tiles={countsToTiles(question.counts)} />
      </section>

      <section className="panel selectedPanel">
        <div className="panelHeader">
          <h2>打牌選択</h2>
        </div>
        <div className="beginnerChoiceGrid">
          {question.choices.map((choice) => (
            <button
              className={selected === choice.discard ? "tileButton selected" : "tileButton"}
              disabled={checked}
              key={choice.discard}
              onClick={() => selectDiscard(choice.discard)}
              title={choice.discard}
              type="button"
            >
              <TileImage tile={choice.discard} />
            </button>
          ))}
        </div>
        <div className="answerDetail compactAnswerDetail">
          <div className="smallLabel">選択中</div>
          <TileStrip tiles={selected ? [selected] : []} emptyText="切る牌を選んでください" />
        </div>
        <div className="actions">
          <button disabled={selected == null || checked} onClick={() => setChecked(true)} type="button">決定</button>
          <button onClick={nextQuestion} type="button">{checked ? "次の問題" : "答え合わせ"}</button>
        </div>
        {checked ? <AnswerResult result={isCorrect ? "correct" : "wrong"} /> : null}
        {checked ? (
          <div className="answerDetail">
            <div className="answerCompare">
              <div>
                <div className="smallLabel">正解打牌</div>
                <TileStrip tiles={[correctTile]} />
              </div>
              <div>
                <div className="smallLabel">自分の選択</div>
                <TileStrip tiles={selected ? [selected] : []} emptyText="未選択" />
              </div>
            </div>
            <div className="answerDetail compactAnswerDetail">
              <div className="smallLabel">この問題のテーマ</div>
              <h3>{problem.title}</h3>
              <p>{problem.theme}</p>
            </div>
            <div className="explanationBox">{problem.point}</div>
            <div className="explanationBox">{problem.explanation}</div>
          </div>
        ) : null}
      </section>

      <section className="resultsPanel">
        <div className="panelHeader">
          <h2>受け入れ比較</h2>
        </div>
        {checked ? (
          <div className="beginnerComparisonList">
            {question.choices.map((choice) => {
              const isAnswer = choice.discard === correctTile;
              const isSelected = selectedResult?.discard === choice.discard;
              return (
                <article
                  className={isAnswer ? "beginnerComparisonRow best" : isSelected ? "beginnerComparisonRow selected" : "beginnerComparisonRow"}
                  key={choice.discard}
                >
                  <div>
                    <div className="smallLabel">{isAnswer ? "打牌☆" : "打牌"}</div>
                    <TileImage tile={choice.discard} />
                  </div>
                  <Stat label="向聴" value={choice.analysis.afterDiscardShanten === 0 ? "聴牌" : `${choice.analysis.afterDiscardShanten}向聴`} />
                  <Stat label="牌種類" value={`${choice.analysis.ukeireTypes}種`} />
                  <Stat label="枚数" value={`${choice.analysis.ukeireTiles}枚`} />
                  <div className="ukeireCell">
                    <div className="smallLabel">{choice.analysis.afterDiscardShanten === 0 ? "待ち牌" : "有効牌"}</div>
                    <TileStrip tiles={choice.analysis.ukeire} emptyText="なし" />
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="emptyState">答え合わせ後に、候補ごとの受け入れを表示します。</div>
        )}
      </section>
    </section>
  );
}

function ChinitsuMode() {
  const [question, setQuestion] = useState<ChinitsuWaitQuestion>(() => generateChinitsuWaitQuestion(Math.random, "m"));
  const [selected, setSelected] = useState<number[]>([]);
  const [checked, setChecked] = useState(false);
  const [recentKeys, setRecentKeys] = useState<string[]>([]);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [mistakes, setMistakes] = useState<ChinitsuPracticeMistake[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [reviewIndex, setReviewIndex] = useState<number | null>(null);
  const isCorrect = checked ? evaluateChinitsuWaitAnswer(question.waits, selected) : false;

  function toggle(rank: number) {
    if (checked) return;
    setSelected((current) => toggleChinitsuRankSelection(current, rank));
  }

  function moveToNextQuestion() {
    const recent = [...recentKeys, chinitsuHandKey(question.counts)].slice(-80);
    const next = generateChinitsuWaitQuestion(Math.random, nextChinitsuSuit(question.suit), recent);
    setRecentKeys(recent);
    setQuestion(next);
    setSelected([]);
    setChecked(false);
  }

  function resetSession() {
    setQuestion(generateChinitsuWaitQuestion(Math.random, nextChinitsuSuit(question.suit), recentKeys));
    setSelected([]);
    setChecked(false);
    setAnsweredCount(0);
    setCorrectCount(0);
    setMistakes([]);
    setShowResult(false);
    setReviewIndex(null);
  }

  function finishCurrentQuestion() {
    const correct = evaluateChinitsuWaitAnswer(question.waits, selected);
    const nextAnsweredCount = answeredCount + 1;
    const nextCorrectCount = correctCount + (correct ? 1 : 0);
    const nextMistakes = correct ? mistakes : [...mistakes, { question, selected: [...selected] }];

    setAnsweredCount(nextAnsweredCount);
    setCorrectCount(nextCorrectCount);
    setMistakes(nextMistakes);

    if (nextAnsweredCount >= PRACTICE_SESSION_SIZE) {
      setShowResult(true);
      setReviewIndex(null);
      return;
    }

    moveToNextQuestion();
  }

  function nextQuestion() {
    if (!checked) {
      setChecked(true);
      return;
    }

    finishCurrentQuestion();
  }

  if (showResult) {
    return (
      <PracticeResultPanel
        correctCount={correctCount}
        mistakes={mistakes}
        onReviewMistakes={() => setReviewIndex(0)}
        onReset={resetSession}
        renderReview={(mistake, index) => (
          <ChinitsuMistakeReview
            mistake={mistake}
            index={index}
            total={mistakes.length}
            onNext={() => setReviewIndex((current) => (current == null ? 0 : Math.min(current + 1, mistakes.length - 1)))}
            onPrevious={() => setReviewIndex((current) => (current == null ? 0 : Math.max(current - 1, 0)))}
          />
        )}
        reviewIndex={reviewIndex}
      />
    );
  }

  return (
    <section className="modeGrid chinitsuMode">
      <section className="panel handPanel">
        <div className="panelHeader">
          <h2>清一色待ち当て特訓</h2>
        </div>
        <TileStrip tiles={chinitsuTiles(question.counts, question.suit)} />
      </section>

      <section className="panel selectedPanel">
        <div className="panelHeader">
          <h2>待ち牌選択</h2>
        </div>
        <RankAnswerPalette suit={question.suit} selected={selected} disabled={checked} onToggle={toggle} />
        <div className="answerDetail compactAnswerDetail">
          <div className="smallLabel">選択中</div>
          <TileStrip tiles={selected.map((rank) => chinitsuTile(rank, question.suit))} emptyText="1〜9から待ち牌を選んでください" />
        </div>
        <div className="actions">
          <button disabled={selected.length === 0 || checked} onClick={() => setChecked(true)} type="button">決定</button>
          <button onClick={nextQuestion} type="button">{checked ? "次の問題" : "答え合わせ"}</button>
        </div>
        {checked ? <AnswerResult result={isCorrect ? "correct" : "wrong"} /> : null}
        {checked ? (
          <div className="answerDetail">
            <div className="smallLabel">正解</div>
            <TileStrip tiles={question.waits.map((rank) => chinitsuTile(rank, question.suit))} />
            <p>{question.waits.length}種 / {question.waits.reduce((sum, rank) => sum + (question.remainingTiles[rank] ?? 0), 0)}枚</p>
            <p>{answeredCount + 1} / {PRACTICE_SESSION_SIZE}問目</p>
          </div>
        ) : null}
      </section>
    </section>
  );
}

function ChinitsuMistakeReview({
  mistake,
  index,
  total,
  onNext,
  onPrevious
}: {
  mistake: ChinitsuPracticeMistake;
  index: number;
  total: number;
  onNext: () => void;
  onPrevious: () => void;
}) {
  return (
    <section className="panel selectedPanel">
      <div className="panelHeader">
        <h2>間違えた問題 {index + 1} / {total}</h2>
      </div>
      <div className="answerDetail compactAnswerDetail">
        <div className="smallLabel">問題</div>
        <TileStrip tiles={chinitsuTiles(mistake.question.counts, mistake.question.suit)} />
        <div className="smallLabel">選択した待ち牌</div>
        <TileStrip tiles={mistake.selected.map((rank) => chinitsuTile(rank, mistake.question.suit))} emptyText="未選択" />
        <AnswerResult result="wrong" />
        <div className="smallLabel">正解の待ち牌</div>
        <TileStrip tiles={mistake.question.waits.map((rank) => chinitsuTile(rank, mistake.question.suit))} />
        <p>
          {mistake.question.waits.length}種 /{" "}
          {mistake.question.waits.reduce((sum, rank) => sum + (mistake.question.remainingTiles[rank] ?? 0), 0)}枚
        </p>
      </div>
      <div className="actions">
        <button disabled={index === 0} onClick={onPrevious} type="button">前の問題</button>
        <button disabled={index >= total - 1} onClick={onNext} type="button">次の問題</button>
      </div>
    </section>
  );
}

function SevenShapeTrainingMode() {
  const [trainingMode, setTrainingMode] = useState<SevenShapeMode>("basic");
  const [question, setQuestion] = useState<SevenShapeQuestion>(() => generateSevenShapeQuestion("basic"));
  const [selected, setSelected] = useState<number[]>([]);
  const [checked, setChecked] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [recentKeys, setRecentKeys] = useState<string[]>([]);
  const [courseScore, setCourseScore] = useState(0);
  const [courseMistakes, setCourseMistakes] = useState<SevenShapePracticeMistake[]>([]);
  const [courseFinished, setCourseFinished] = useState(false);
  const [reviewIndex, setReviewIndex] = useState<number | null>(null);
  const isCorrect = checked ? evaluateSevenShapeAnswer(question.waits, selected) : false;
  const isAllCourse = trainingMode === "all";
  const hardPatternCount = SEVEN_SHAPE_PATTERNS.filter((pattern) => pattern.difficulty === "hard").length;
  const hardMistakeCount = courseMistakes.filter((mistake) => mistake.question.difficulty === "hard").length;

  function changeTrainingMode(nextMode: SevenShapeMode) {
    const next = nextMode === "all" ? buildSevenShapeQuestion(1) : generateSevenShapeQuestion("basic");
    setTrainingMode(nextMode);
    setQuestion(next);
    setSelected([]);
    setChecked(false);
    setShowHint(false);
    setRecentKeys([]);
    setCourseScore(0);
    setCourseMistakes([]);
    setCourseFinished(false);
    setReviewIndex(null);
  }

  function toggle(rank: number) {
    if (checked) return;
    setSelected((current) => toggleSevenShapeRankSelection(current, rank));
  }

  function nextQuestion() {
    if (isAllCourse) {
      const nextPatternId = Math.min(question.patternId + 1, 19);
      setQuestion(buildSevenShapeQuestion(nextPatternId));
      setSelected([]);
      setChecked(false);
      setShowHint(false);
      return;
    }

    const recent = [...recentKeys, sevenShapeQuestionKey(question)].slice(-12);
    const next = generateSevenShapeQuestion(trainingMode, Math.random, recent);
    setRecentKeys(recent);
    setQuestion(next);
    setSelected([]);
    setChecked(false);
    setShowHint(false);
  }

  function submitAnswer() {
    if (selected.length === 0 || checked) return;
    const correct = evaluateSevenShapeAnswer(question.waits, selected);
    if (isAllCourse) {
      setCourseScore((current) => current + (correct ? 1 : 0));
      if (!correct) {
        setCourseMistakes((current) => [...current, { question, selected: [...selected] }]);
      }
      if (question.patternId === 19) {
        setCourseFinished(true);
      }
    }
    setChecked(true);
  }

  function restartAllCourse() {
    setQuestion(buildSevenShapeQuestion(1));
    setSelected([]);
    setChecked(false);
    setShowHint(false);
    setCourseScore(0);
    setCourseMistakes([]);
    setCourseFinished(false);
    setReviewIndex(null);
  }

  if (isAllCourse && courseFinished) {
    return (
      <PracticeResultPanel
        correctCount={courseScore}
        mistakes={courseMistakes}
        onReviewMistakes={() => setReviewIndex(0)}
        onReset={restartAllCourse}
        renderReview={(mistake, index) => (
          <SevenShapeMistakeReview
            mistake={mistake}
            index={index}
            total={courseMistakes.length}
            onNext={() => setReviewIndex((current) => (current == null ? 0 : Math.min(current + 1, courseMistakes.length - 1)))}
            onPrevious={() => setReviewIndex((current) => (current == null ? 0 : Math.max(current - 1, 0)))}
          />
        )}
        reviewIndex={reviewIndex}
        totalCount={19}
        resultDescription={`全19パターン終了です。難問は ${hardPatternCount - hardMistakeCount} / ${hardPatternCount} 問正解でした。間違えた問題は答えと解説を表示した状態で確認できます。`}
        resetLabel="もう一度19問"
      />
    );
  }

  return (
    <section className="modeGrid sevenShapeMode">
      <section className="panel handPanel learningPanel">
        <div className="panelHeader">
          <h2>🔰 7枚形トレーニング</h2>
          {isAllCourse ? <span>{question.patternId} / 19</span> : null}
        </div>
        <p className="modeLead">メンチン・多面待ちの基礎になる7枚形を覚える練習です</p>
        <SegmentPair
          leftLabel="基本モード"
          rightLabel="全19パターン"
          rightActive={trainingMode === "all"}
          onLeft={() => changeTrainingMode("basic")}
          onRight={() => changeTrainingMode("all")}
        />
        {isAllCourse ? (
          <div className="questionMeta singleMeta">
            <Stat label="問題番号" value={`${question.patternId}/19`} />
          </div>
        ) : null}
        <TileStrip tiles={question.tiles.map((rank) => chinitsuTile(rank, question.suit))} />
      </section>

      <section className="panel selectedPanel">
        <div className="panelHeader">
          <h2>待ち牌選択</h2>
        </div>
        <RankAnswerPalette suit={question.suit} selected={selected} disabled={checked} onToggle={toggle} />
        <div className="answerDetail compactAnswerDetail">
          <div className="smallLabel">選択中</div>
          <TileStrip tiles={selected.map((rank) => chinitsuTile(rank, question.suit))} emptyText="1〜9から待ち牌を選んでください" />
        </div>
        <div className="actions">
          <button disabled={checked} onClick={() => setShowHint((current) => !current)} type="button">ヒントを見る</button>
          <button disabled={selected.length === 0 || checked} onClick={submitAnswer} type="button">決定</button>
          {checked ? <button onClick={nextQuestion} type="button">{courseFinished ? "もう一度" : "次の問題"}</button> : null}
        </div>
        {showHint ? <div className="hintBox">{question.hint}</div> : null}
        {checked ? <AnswerResult result={isCorrect ? "correct" : "wrong"} /> : null}
        {checked ? (
          <div className="answerDetail">
            <div className="answerCompare">
              <div>
                <div className="smallLabel">正解の待ち牌</div>
                <TileStrip tiles={question.waits.map((rank) => chinitsuTile(rank, question.suit))} />
                <p>{question.waits.length}種 / {question.waits.reduce((sum, rank) => sum + (question.remainingTiles[rank] ?? 0), 0)}枚</p>
              </div>
              <div>
                <div className="smallLabel">自分の選択</div>
                <TileStrip tiles={selected.map((rank) => chinitsuTile(rank, question.suit))} emptyText="未選択" />
              </div>
            </div>
            <div className="explanationBox">{question.explanation}</div>
          </div>
        ) : null}
      </section>
    </section>
  );
}

function SevenShapeMistakeReview({
  mistake,
  index,
  total,
  onNext,
  onPrevious
}: {
  mistake: SevenShapePracticeMistake;
  index: number;
  total: number;
  onNext: () => void;
  onPrevious: () => void;
}) {
  return (
    <section className="panel selectedPanel">
      <div className="panelHeader">
        <h2>間違えた問題 {index + 1} / {total}</h2>
      </div>
      <div className="questionMeta singleMeta">
        <Stat label="問題番号" value={`${mistake.question.patternId}/19`} />
        <Stat label="難度" value={mistake.question.difficulty} />
      </div>
      <div className="answerDetail compactAnswerDetail">
        <div className="smallLabel">問題</div>
        <TileStrip tiles={mistake.question.tiles.map((rank) => chinitsuTile(rank, mistake.question.suit))} />
        <div className="smallLabel">選択した待ち牌</div>
        <TileStrip tiles={mistake.selected.map((rank) => chinitsuTile(rank, mistake.question.suit))} emptyText="未選択" />
        <AnswerResult result="wrong" />
        <div className="smallLabel">正解の待ち牌</div>
        <TileStrip tiles={mistake.question.waits.map((rank) => chinitsuTile(rank, mistake.question.suit))} />
        <p>
          {mistake.question.waits.length}種 /{" "}
          {mistake.question.waits.reduce((sum, rank) => sum + (mistake.question.remainingTiles[rank] ?? 0), 0)}枚
        </p>
        <div className="explanationBox">{mistake.question.explanation}</div>
      </div>
      <div className="actions">
        <button disabled={index === 0} onClick={onPrevious} type="button">前の問題</button>
        <button disabled={index >= total - 1} onClick={onNext} type="button">次の問題</button>
      </div>
    </section>
  );
}

interface ScoreQuizPracticeModeProps {
  questions: ScoreQuizQuestion[];
  title: string;
  resultTitle: string;
  resultDescription: string;
  showQuestionTitle?: boolean;
  showAnswerExplanation?: boolean;
  allowRevealWithoutSelection?: boolean;
}

function ScoreQuizBeginnerMode() {
  return (
    <ScoreQuizPracticeMode
      questions={BEGINNER_SCORE_QUESTIONS}
      title="🔰 点数計算問題"
      resultTitle="🔰 点数計算問題 リザルト"
      resultDescription="初心者モードの固定問題を完走しました。平和、鳴き、染め手、七対子の点数感を確認できます。"
      showQuestionTitle={false}
      allowRevealWithoutSelection={true}
    />
  );
}

function ScoreQuizHardMode() {
  return (
    <ScoreQuizPracticeMode
      questions={HARD_SCORE_QUESTIONS}
      title="🔥 点数計算HARD"
      resultTitle="🔥 点数計算HARD リザルト"
      resultDescription="HARDモードを完走しました。高符、カン絡み、ロンとツモの符差を重点的に確認できます。"
      showAnswerExplanation={false}
      showQuestionTitle={false}
    />
  );
}

function ScoreQuizPracticeMode({
  questions,
  title,
  resultTitle,
  resultDescription,
  showQuestionTitle = true,
  showAnswerExplanation = true,
  allowRevealWithoutSelection = false
}: ScoreQuizPracticeModeProps) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [mistakes, setMistakes] = useState<ScoreQuizMistake[]>([]);
  const [finished, setFinished] = useState(false);

  const question = questions[questionIndex]!;
  const scoreResult = useMemo(() => scoreQuizResult(question), [question]);
  const correctAnswer = scoreQuizReadableAnswerLabel(scoreResult.score, question);
  const choices = useMemo(() => scoreQuizChoices(correctAnswer, question), [correctAnswer, question]);
  const isCorrect = checked && selected === correctAnswer;

  function submitAnswer() {
    if (checked) return;
    if (!selected) {
      if (allowRevealWithoutSelection) {
        setChecked(true);
      }
      return;
    }
    const correct = selected === correctAnswer;
    setChecked(true);
    if (correct) {
      setCorrectCount((current) => current + 1);
    } else {
      setMistakes((current) => [...current, { question, selected, correctAnswer }]);
    }
  }

  function nextQuestion() {
    if (!checked) {
      submitAnswer();
      return;
    }
    if (questionIndex >= questions.length - 1) {
      setFinished(true);
      return;
    }
    setQuestionIndex((current) => current + 1);
    setSelected(null);
    setChecked(false);
  }

  function resetQuiz() {
    setQuestionIndex(0);
    setSelected(null);
    setChecked(false);
    setCorrectCount(0);
    setMistakes([]);
    setFinished(false);
  }

  if (finished) {
    return (
      <section className="modeGrid scoreQuizMode">
        <section className="panel selectedPanel">
          <div className="panelHeader">
            <h2>{resultTitle}</h2>
          </div>
          <div className="resultCard">
            <div className="smallLabel">今回の成績</div>
            <div className="resultScore">{correctCount} / {questions.length}</div>
            <p>{resultDescription}</p>
          </div>
          <div className="actions">
            <button onClick={resetQuiz} type="button">最初からもう一度</button>
          </div>
        </section>

        <section className="panel selectedPanel">
          <div className="panelHeader">
            <h2>間違えた問題</h2>
          </div>
          {mistakes.length ? (
            <div className="scoreQuizMistakes">
              {mistakes.map((mistake) => (
                <article className="answerDetail compactAnswerDetail" key={mistake.question.id}>
                  <div className="smallLabel">{mistake.question.title}</div>
                  <TileStrip tiles={scoreQuizVisibleHandTiles(mistake.question)} />
                  <p>選択: {mistake.selected ?? "未選択"} / 正解: {mistake.correctAnswer}</p>
                  <p>{mistake.question.explanation}</p>
                </article>
              ))}
            </div>
          ) : (
            <div className="emptyState">全問正解です。</div>
          )}
        </section>
      </section>
    );
  }

  return (
    <section className="modeGrid scoreQuizMode">
      <section className="panel handPanel">
        <div className="panelHeader">
          <h2>{title}</h2>
          <span>{questionIndex + 1} / {questions.length}</span>
        </div>
        {showQuestionTitle ? (
          <div className="questionTitleBlock">
            <div className="smallLabel">{question.title}</div>
          </div>
        ) : null}
        <ScoreQuizConditionBadges question={question} />
        <div className="smallLabel">手牌</div>
        <TileStrip tiles={scoreQuizVisibleHandTiles(question)} />
        {question.melds?.length ? (
          <>
            <div className="smallLabel">副露</div>
            <MeldList melds={question.melds} />
          </>
        ) : null}
        <div className="answerDetail compactAnswerDetail">
          <div className="smallLabel">和了牌</div>
          <TileStrip tiles={[question.winningTile]} />
        </div>
      </section>

      <section className="panel selectedPanel">
        <div className="panelHeader">
          <h2>条件</h2>
        </div>
        <div className="questionMeta scoreQuizMeta">
          <Stat label="親子" value={question.isDealer ? "親" : "子"} />
          <Stat label="和了" value={question.winMethod === "ron" ? "ロン" : "ツモ"} />
          <Stat label="リーチ" value={question.riichi ? "あり" : "なし"} />
          <Stat label="ドラ" value={`${question.dora ?? 0}`} />
        </div>
        <div className="scoreQuizSelectHeading">点数を選択</div>
        <div className="scoreQuizChoices">
          {choices.map((choice) => (
            <button
              className={selected === choice ? "scoreQuizChoice selected" : "scoreQuizChoice"}
              disabled={checked}
              key={choice}
              onClick={() => setSelected(choice)}
              type="button"
            >
              {choice}
            </button>
          ))}
        </div>
        <div className="actions">
          <button disabled={!selected || checked} onClick={submitAnswer} type="button">決定</button>
          <button disabled={!allowRevealWithoutSelection && !selected && !checked} onClick={nextQuestion} type="button">
            {checked ? "次の問題" : allowRevealWithoutSelection ? "回答を見る" : "答え合わせ"}
          </button>
        </div>
        {checked && selected ? <AnswerResult result={isCorrect ? "correct" : "wrong"} /> : null}
        {checked ? (
          <div className="answerDetail">
            <div className="answerCompare">
              <div>
                <div className="smallLabel">正解</div>
                <div className="scoreAnswerText">{correctAnswer}</div>
              </div>
              <div>
                <div className="smallLabel">自分の回答</div>
                <div className="scoreAnswerText">{selected ?? "未選択"}</div>
              </div>
            </div>
            <HandScoreResultCard result={scoreResult} />
            {showAnswerExplanation ? (
              <>
                <div className="explanationBox">{question.lesson}</div>
                <div className="explanationBox">{question.explanation}</div>
              </>
            ) : null}
          </div>
        ) : null}
      </section>
    </section>
  );
}

function ScoreQuizConditionBadges({ question }: { question: ScoreQuizQuestion }) {
  const dora = question.dora ?? 0;
  return (
    <div className="scoreQuizConditions">
      <span className={question.isDealer ? "dealerBadge" : "childBadge"}>{question.isDealer ? "\u89aa" : "\u5b50"}</span>
      <span className={question.winMethod === "ron" ? "ronBadge" : "tsumoBadge"}>{question.winMethod === "ron" ? "\u30ed\u30f3" : "\u30c4\u30e2"}</span>
      <span className={question.riichi ? "riichiBadge" : undefined}>{question.riichi ? "リーチ" : "リーチなし"}</span>
      <span className={dora > 0 ? "doraBadge" : undefined}>ドラ {dora}</span>
    </div>
  );
}

function scoreQuizResult(question: ScoreQuizQuestion): HandScoreResult {
  const result = calculateHandScore({
    counts: scoreQuizCounts(question),
    melds: question.melds ?? [],
    winningTile: question.winningTile,
    isDealer: question.isDealer,
    winMethod: question.winMethod,
    roundWind: question.roundWind ?? SCORE_EAST,
    seatWind: question.seatWind ?? (question.isDealer ? SCORE_EAST : SCORE_SOUTH),
    riichi: question.riichi ?? false,
    ippatsu: question.ippatsu ?? false,
    dora: question.dora ?? 0
  });
  validateScoreQuizExpected(question, result);
  return result;
}

function validateScoreQuizExpected(question: ScoreQuizQuestion, result: HandScoreResult): void {
  if (question.expectedHan != null && result.score.han !== question.expectedHan) {
    throw new Error(`${question.id}: expected ${question.expectedHan} han, got ${result.score.han}.`);
  }
  if (question.expectedFu !== undefined && result.score.fu !== question.expectedFu) {
    throw new Error(`${question.id}: expected ${question.expectedFu} fu, got ${result.score.fu}.`);
  }
  if (question.expectedLimitName && result.score.limitName !== question.expectedLimitName) {
    throw new Error(`${question.id}: expected ${question.expectedLimitName}, got ${result.score.limitName}.`);
  }
}

function scoreQuizCounts(question: ScoreQuizQuestion): Counts34 {
  if (question.handText) return parseHand(question.handText);
  const counts = emptyCounts();
  for (const tile of question.tiles ?? []) {
    counts[TILE_NAMES.indexOf(tile)]! += 1;
  }
  return counts;
}

function scoreQuizTiles(question: ScoreQuizQuestion): Tile[] {
  return countsToTiles(scoreQuizCounts(question));
}

function scoreQuizVisibleHandTiles(question: ScoreQuizQuestion): Tile[] {
  const tiles = scoreQuizTiles(question);
  const winningIndex = tiles.indexOf(question.winningTile);
  if (winningIndex < 0) return tiles;
  return [...tiles.slice(0, winningIndex), ...tiles.slice(winningIndex + 1)];
}

function scoreQuizAnswerLabel(score: ScoreResult, question: ScoreQuizQuestion): string {
  if (question.winMethod === "ron") return `${score.totalPoints.toLocaleString()}点`;
  if (question.isDealer) return `${score.payments[0]!.points.toLocaleString()}オール`;
  return `子${score.payments[0]!.points.toLocaleString()} / 親${score.payments[1]!.points.toLocaleString()}`;
}

function scoreQuizReadableAnswerLabel(score: ScoreResult, question: ScoreQuizQuestion): string {
  if (question.winMethod === "ron") return `${score.totalPoints.toLocaleString()}点`;
  if (question.isDealer) return `${score.payments[0]!.points.toLocaleString()}オール`;
  return `子${score.payments[0]!.points.toLocaleString()} / 親${score.payments[1]!.points.toLocaleString()}`;
}

function scoreQuizChoices(correctAnswer: string, question: ScoreQuizQuestion): string[] {
  const pool = scoreQuizChoicePool(question);
  const uniquePool = Array.from(new Set([...pool, correctAnswer]));
  const correctIndex = uniquePool.indexOf(correctAnswer);
  const start = Math.min(Math.max(correctIndex - 1, 0), Math.max(uniquePool.length - 4, 0));
  const choices = uniquePool.slice(start, start + 4);
  if (!choices.includes(correctAnswer)) choices[choices.length - 1] = correctAnswer;
  return rotateChoices(Array.from(new Set(choices)), question.id);
}

function scoreQuizChoicePool(question: ScoreQuizQuestion): string[] {
  if (question.choicePool) return question.choicePool;
  if (question.winMethod === "ron") {
    return ["1,000点", "1,300点", "1,500点", "1,600点", "2,000点", "2,600点", "3,900点", "5,200点", "7,700点", "8,000点", "12,000点"];
  }
  if (question.isDealer) {
    return ["500オール", "700オール", "1,000オール", "1,300オール", "2,000オール", "4,000オール"];
  }
  return ["子300 / 親500", "子400 / 親700", "子500 / 親1,000", "子700 / 親1,300", "子1,000 / 親2,000", "子2,000 / 親4,000"];
  if (question.winMethod === "ron") {
    return ["1,000点", "1,300点", "1,500点", "1,600点", "2,000点", "2,600点", "3,900点", "5,200点", "7,700点", "8,000点", "12,000点"];
  }
  if (question.isDealer) {
    return ["500オール", "700オール", "1,000オール", "1,300オール", "2,000オール", "4,000オール"];
  }
  return ["子300 / 親500", "子400 / 親700", "子500 / 親1,000", "子700 / 親1,300", "子1,000 / 親2,000", "子2,000 / 親4,000"];
}

function rotateChoices(choices: string[], seed: string): string[] {
  if (choices.length === 0) return choices;
  const offset = [...seed].reduce((sum, char) => sum + char.charCodeAt(0), 0) % choices.length;
  return [...choices.slice(offset), ...choices.slice(0, offset)];
}

function ScoringMode() {
  const [counts, setCounts] = useState<Counts34>(() => parseHand(SCORE_SAMPLE_HAND));
  const [melds, setMelds] = useState<HandScoreMeld[]>([]);
  const [meldKind, setMeldKind] = useState<ScoreMeldInputKind>("pon");
  const [chiTiles, setChiTiles] = useState<Tile[]>([]);
  const [winningTile, setWinningTile] = useState<Tile | null>("4p");
  const [isDealer, setIsDealer] = useState(false);
  const [winMethod, setWinMethod] = useState<"ron" | "tsumo">("ron");
  const [roundWind, setRoundWind] = useState<Tile>("東");
  const [seatWind, setSeatWind] = useState<Tile>("南");
  const [riichi, setRiichi] = useState(true);
  const [ippatsu, setIppatsu] = useState(false);
  const [dora, setDora] = useState(0);
  const [honba, setHonba] = useState(0);
  const [riichiSticks, setRiichiSticks] = useState(0);

  const tiles = countsToTiles(counts);
  const winningOptions = tiles;
  const closedHandTarget = Math.max(2, 14 - melds.length * 3);
  const kanCount = melds.filter((meld) => meld.kind === "kan" || meld.kind === "ankan").length;
  const totalDisplayedTiles = sumCounts(counts) + melds.reduce((sum, meld) => sum + meld.tiles.length, 0);
  const totalDisplayTarget = 14 + kanCount;
  const isClosedForOptions = melds.every((meld) => meld.kind === "ankan");

  const result = useMemo(() => {
    if (sumCounts(counts) !== closedHandTarget) {
      return { error: `手牌は${closedHandTarget}枚にしてください。副露込みの表示枚数は${totalDisplayTarget}枚です。` };
    }
    if (!winningTile) {
      return { error: "和了牌を選択してください。" };
    }
    try {
      return {
        value: calculateHandScore({
          counts,
          melds,
          winningTile,
          isDealer,
          winMethod,
          roundWind,
          seatWind,
          riichi: isClosedForOptions ? riichi : false,
          ippatsu: isClosedForOptions ? ippatsu : false,
          dora,
          honba,
          riichiSticks
        })
      };
    } catch (error) {
      return { error: error instanceof Error ? error.message : String(error) };
    }
  }, [closedHandTarget, counts, dora, honba, ippatsu, isClosedForOptions, isDealer, melds, riichi, riichiSticks, roundWind, seatWind, totalDisplayTarget, winMethod, winningTile]);

  function addScoreTile(tile: Tile) {
    if (sumCounts(counts) >= closedHandTarget) return;
    if (totalTileCount(counts, melds, tile) >= 4) return;
    setCounts((current) => addTile(current, tile));
  }

  function removeScoreTile(tile: Tile) {
    const next = removeTile(counts, tile);
    setCounts(next);
    if (winningTile === tile && !countsToTiles(next).includes(tile)) {
      setWinningTile(null);
    }
  }

  function clearScoreHand() {
    setCounts(emptyCounts());
    setMelds([]);
    setChiTiles([]);
    setWinningTile(null);
  }

  function sampleScoreHand() {
    setCounts(parseHand(SCORE_SAMPLE_HAND));
    setMelds([]);
    setChiTiles([]);
    setWinningTile("4p");
    setRiichi(true);
    setWinMethod("ron");
  }

  function changeScoreMeldKind(kind: ScoreMeldInputKind) {
    setMeldKind(kind);
    setChiTiles([]);
  }

  function addScoreMeld(tile: Tile) {
    if (melds.length >= 4) return;
    const meld = buildScoreMeld(meldKind, tile);
    if (!meld) return;
    if (!canAddMeld(counts, melds, meld)) return;
    const nextMelds = [...melds, meld];
    setMelds(nextMelds);
    if (meld.kind !== "ankan") {
      setRiichi(false);
      setIppatsu(false);
    }
  }

  function toggleScoreChiTile(tile: Tile) {
    const index = TILE_NAMES.indexOf(tile);
    if (index < 0 || index >= 27) return;
    if (totalTileCount(counts, melds, tile) >= 4 && !chiTiles.includes(tile)) return;
    setChiTiles((current) => {
      if (current.includes(tile)) return current.filter((selectedTile) => selectedTile !== tile);
      if (current.length >= 3) return current;
      return sortTiles([...current, tile]);
    });
  }

  function addScoreChiMeld() {
    if (melds.length >= 4) return;
    const meld = buildChiMeldFromTiles(chiTiles);
    if (!meld) return;
    if (!canAddMeld(scoreTotalCounts(counts, melds), [], meld)) return;
    setMelds((current) => [...current, meld]);
    setChiTiles([]);
    setRiichi(false);
    setIppatsu(false);
  }

  function removeScoreMeld(index: number) {
    setMelds((current) => current.filter((_, meldIndex) => meldIndex !== index));
  }

  return (
    <section className="modeGrid scoringMode">
      <section className="panel handPanel">
        <div className="panelHeader">
          <h2>🔰 点数計算チェッカー</h2>
          <span>{totalDisplayedTiles} / {totalDisplayTarget}</span>
        </div>
        <div className="smallLabel">手牌 {sumCounts(counts)} / {closedHandTarget}</div>
        <TileStrip tiles={tiles} onTileClick={removeScoreTile} emptyText="牌を追加してください" />
        <div className="smallLabel">副露</div>
        <MeldList melds={melds} onRemove={removeScoreMeld} />
        <div className="actions">
          <button onClick={clearScoreHand} type="button">クリア</button>
          <button onClick={sampleScoreHand} type="button">サンプル</button>
        </div>
        <div className="panelHeader compactHeader">
          <h2>牌を追加</h2>
        </div>
        <TilePalette counts={scoreTotalCounts(counts, melds)} onAdd={addScoreTile} />
        <div className="panelHeader compactHeader">
          <h2>副露を追加</h2>
        </div>
        <MeldKindPicker value={meldKind} onChange={changeScoreMeldKind} />
        {meldKind === "chi" ? (
          <ChiMeldInput
            counts={scoreTotalCounts(counts, melds)}
            selected={chiTiles}
            onToggle={toggleScoreChiTile}
            onClear={() => setChiTiles([])}
            onAdd={addScoreChiMeld}
          />
        ) : (
          <MeldPalette counts={scoreTotalCounts(counts, melds)} kind={meldKind} onAdd={addScoreMeld} />
        )}
      </section>

      <section className="panel selectedPanel">
        <div className="panelHeader">
          <h2>条件</h2>
        </div>
        <div className="answerDetail compactAnswerDetail">
          <div className="smallLabel">和了牌</div>
          <WinningTilePicker tiles={winningOptions} selected={winningTile} onSelect={setWinningTile} />
          <div className="selectedWinningTilePreview">
            <div className="smallLabel">選択中の和了牌</div>
            <TileStrip tiles={winningTile ? [winningTile] : []} emptyText="未選択" />
          </div>
        </div>
        <SegmentPair
          leftLabel="子"
          rightLabel="親"
          rightActive={isDealer}
          onLeft={() => setIsDealer(false)}
          onRight={() => setIsDealer(true)}
        />
        <SegmentPair
          leftLabel="ロン"
          rightLabel="ツモ"
          rightActive={winMethod === "tsumo"}
          onLeft={() => setWinMethod("ron")}
          onRight={() => setWinMethod("tsumo")}
        />
        <div className="scoreToggles">
          <label><input checked={isClosedForOptions && riichi} disabled={!isClosedForOptions} onChange={(event) => setRiichi(event.target.checked)} type="checkbox" /> リーチ</label>
          <label><input checked={isClosedForOptions && ippatsu} disabled={!isClosedForOptions} onChange={(event) => setIppatsu(event.target.checked)} type="checkbox" /> 一発</label>
        </div>
        <div className="scoreInputs">
          <WindField label="場風" value={roundWind} onChange={setRoundWind} />
          <WindField label="自風" value={seatWind} onChange={setSeatWind} />
          <NumberField label="ドラ" min={0} value={dora} onChange={setDora} />
          <NumberField label="本場" min={0} value={honba} onChange={setHonba} />
          <NumberField label="供託" min={0} value={riichiSticks} onChange={setRiichiSticks} />
        </div>
      </section>

      <section className="panel selectedPanel scoreResultPanel">
        <div className="panelHeader">
          <h2>結果</h2>
        </div>
        {"error" in result ? <div className="error">{result.error}</div> : <HandScoreResultCard result={result.value} />}
      </section>
    </section>
  );
}

function SegmentPair({
  leftLabel,
  rightLabel,
  rightActive,
  onLeft,
  onRight
}: {
  leftLabel: string;
  rightLabel: string;
  rightActive: boolean;
  onLeft: () => void;
  onRight: () => void;
}) {
  return (
    <div className="scoreSegments">
      <button className={!rightActive ? "scoreSegment active" : "scoreSegment"} onClick={onLeft} type="button">{leftLabel}</button>
      <button className={rightActive ? "scoreSegment active" : "scoreSegment"} onClick={onRight} type="button">{rightLabel}</button>
    </div>
  );
}

function MeldKindPicker({ value, onChange }: { value: ScoreMeldInputKind; onChange: (kind: ScoreMeldInputKind) => void }) {
  return (
    <div className="scoreSegments meldKindSegments">
      {SCORE_MELD_OPTIONS.map((option) => (
        <button
          className={value === option.kind ? "scoreSegment active" : "scoreSegment"}
          key={option.kind}
          onClick={() => onChange(option.kind)}
          type="button"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function ChiMeldInput({
  counts,
  selected,
  onToggle,
  onClear,
  onAdd
}: {
  counts: Counts34;
  selected: Tile[];
  onToggle: (tile: Tile) => void;
  onClear: () => void;
  onAdd: () => void;
}) {
  const rows = [TILE_NAMES.slice(0, 9), TILE_NAMES.slice(9, 18), TILE_NAMES.slice(18, 27)];
  const chiMeld = buildChiMeldFromTiles(selected);
  const canAdd = !!chiMeld && canAddMeld(counts, [], chiMeld);

  return (
    <div className="chiMeldInput">
      <div className="chiMeldPreview">
        <div>
          <div className="smallLabel">選択中のチー</div>
          <TileStrip tiles={selected} emptyText="同じ色の連続する3枚を選んでください" />
        </div>
        <div className="chiMeldActions">
          <button disabled={selected.length === 0} onClick={onClear} type="button">選び直す</button>
          <button disabled={!canAdd} onClick={onAdd} type="button">チーを追加</button>
        </div>
      </div>
      <div className="paletteRows meldPaletteRows">
        {rows.map((row, rowIndex) => (
          <div className="paletteRow" key={rowIndex}>
            {row.map((tile) => {
              const selectedTile = selected.includes(tile);
              const disabled = !selectedTile && (selected.length >= 3 || (counts[TILE_NAMES.indexOf(tile)] ?? 0) >= 4);
              return (
                <button
                  className={selectedTile ? "tileButton selected" : "tileButton"}
                  disabled={disabled}
                  key={tile}
                  onClick={() => onToggle(tile)}
                  title={tile}
                  type="button"
                >
                  <TileImage tile={tile} />
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function MeldPalette({ counts, kind, onAdd }: { counts: Counts34; kind: ScoreMeldInputKind; onAdd: (tile: Tile) => void }) {
  const rows = [TILE_NAMES.slice(0, 9), TILE_NAMES.slice(9, 18), TILE_NAMES.slice(18, 27), TILE_NAMES.slice(27)];
  return (
    <div className="paletteRows meldPaletteRows">
      {rows.map((row, rowIndex) => (
        <div className="paletteRow" key={rowIndex}>
          {row.map((tile) => {
            const meld = buildScoreMeld(kind, tile);
            const disabled = !meld || !canAddMeld(counts, [], meld);
            return (
              <button className="tileButton" disabled={disabled} key={tile} onClick={() => onAdd(tile)} title={tile} type="button">
                <TileImage tile={tile} />
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function MeldList({ melds, onRemove }: { melds: HandScoreMeld[]; onRemove?: (index: number) => void }) {
  if (melds.length === 0) {
    return <div className="emptyStrip">副露なし</div>;
  }
  return (
    <div className="meldList">
      {melds.map((meld, index) => (
        <div className="meldCard" key={`${meld.kind}-${index}-${meld.tiles.join("")}`}>
          <div>
            <div className="smallLabel">{meldKindLabel(meld.kind)}</div>
            <MeldTiles meld={meld} />
          </div>
          {onRemove ? <button onClick={() => onRemove(index)} type="button">削除</button> : null}
        </div>
      ))}
    </div>
  );
}

function MeldTiles({ meld }: { meld: HandScoreMeld }) {
  const sidewaysIndex = meld.kind === "ankan" ? -1 : meld.kind === "pon" ? 1 : meld.tiles.length - 1;
  return (
    <div className={`meldTiles ${meld.kind}`}>
      {meld.tiles.map((tile, index) =>
        meld.kind === "ankan" && (index === 1 || index === 2) ? (
          <span aria-label="伏せ牌" className="faceDownTile" key={`${tile}-${index}`} />
        ) : index === sidewaysIndex ? (
          <span className="sidewaysMeldTile" key={`${tile}-${index}`}>
            <TileImage tile={tile} />
          </span>
        ) : (
          <TileImage key={`${tile}-${index}`} tile={tile} />
        )
      )}
    </div>
  );
}

function meldKindLabel(kind: HandScoreMeldKind): string {
  if (kind === "chi") return "チー";
  if (kind === "pon") return "ポン";
  if (kind === "kan") return "カン";
  return "暗カン";
}

function buildScoreMeld(kind: ScoreMeldInputKind, tile: Tile): HandScoreMeld | null {
  const index = TILE_NAMES.indexOf(tile);
  if (kind === "chi") {
    if (index < 0 || index >= 27 || index % 9 > 6) return null;
    return { kind, tiles: [tile, TILE_NAMES[index + 1]!, TILE_NAMES[index + 2]!] };
  }
  const size = kind === "pon" ? 3 : 4;
  return { kind, tiles: Array(size).fill(tile) as Tile[] };
}

function buildChiMeldFromTiles(tiles: Tile[]): HandScoreMeld | null {
  if (tiles.length !== 3) return null;
  const sorted = sortTiles(tiles);
  const indexes = sorted.map((tile) => TILE_NAMES.indexOf(tile));
  if (indexes.some((index) => index < 0 || index >= 27)) return null;
  const suit = Math.floor(indexes[0]! / 9);
  if (!indexes.every((index) => Math.floor(index / 9) === suit)) return null;
  if (indexes[1] !== indexes[0]! + 1 || indexes[2] !== indexes[1]! + 1) return null;
  return { kind: "chi", tiles: sorted };
}

function sortTiles(tiles: Tile[]): Tile[] {
  return [...tiles].sort((left, right) => TILE_NAMES.indexOf(left) - TILE_NAMES.indexOf(right));
}

function scoreTotalCounts(counts: Counts34, melds: HandScoreMeld[]): Counts34 {
  const totals = counts.slice();
  for (const meld of melds) {
    for (const tile of meld.tiles) totals[TILE_NAMES.indexOf(tile)]! += 1;
  }
  return totals;
}

function totalTileCount(counts: Counts34, melds: HandScoreMeld[], tile: Tile): number {
  return scoreTotalCounts(counts, melds)[TILE_NAMES.indexOf(tile)] ?? 0;
}

function canAddMeld(counts: Counts34, melds: HandScoreMeld[], meld: HandScoreMeld): boolean {
  const totals = scoreTotalCounts(counts, melds);
  for (const tile of meld.tiles) {
    const index = TILE_NAMES.indexOf(tile);
    totals[index]! += 1;
    if (totals[index]! > 4) return false;
  }
  return true;
}

function NumberField({
  label,
  value,
  min,
  step = 1,
  disabled,
  onChange
}: {
  label: string;
  value: number;
  min: number;
  step?: number;
  disabled?: boolean;
  onChange: (value: number) => void;
}) {
  return (
    <label className="numberField">
      <span>{label}</span>
      <input
        disabled={disabled}
        min={min}
        onChange={(event) => onChange(Number(event.target.value))}
        step={step}
        type="number"
        value={value}
      />
    </label>
  );
}

function ScoreResultCard({ result }: { result: ScoreResult }) {
  return (
    <div className="scoreCard">
      <div>
        <div className="smallLabel">点数</div>
        <div className="scoreTotal">{result.totalPoints.toLocaleString()}点</div>
      </div>
      <div className="scoreMeta">
        <Stat label="区分" value={result.limitLabel} />
        <Stat label="翻 / 符" value={result.fu == null ? `${result.han}翻 / 役満` : `${result.han}翻 / ${result.fu}符`} />
      </div>
      <div className="paymentList">
        {result.payments.map((payment) => (
          <div className="paymentRow" key={payment.label}>
            <span>{payment.label}</span>
            <strong>{payment.points.toLocaleString()}点</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

function HandScoreResultCard({ result }: { result: HandScoreResult }) {
  return (
    <div className="scoreResultStack">
      <ScoreResultCard result={result.score} />
      <div className="answerDetail">
        <div className="smallLabel">役</div>
        <div className="yakuList">
          {result.yaku.length ? result.yaku.map((yaku, index) => (
            <div className="paymentRow" key={`${yaku.name}-${index}`}>
              <span>{yaku.name}</span>
              <strong>{yaku.isYakuman ? "役満" : `${yaku.han}翻`}</strong>
            </div>
          )) : <p>役満数指定</p>}
        </div>
      </div>
      {result.fu ? (
        <div className="answerDetail">
          <div className="smallLabel">符</div>
          <p>{result.fu.totalBeforeRounding}符 → {result.fu.roundedFu}符</p>
          <div className="yakuList">
            {result.fu.items.map((item) => (
              <div className="paymentRow" key={item.label}>
                <span>{item.label}</span>
                <strong>{item.fu}符</strong>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function WinningTilePicker({ tiles, selected, onSelect }: { tiles: Tile[]; selected: Tile | null; onSelect: (tile: Tile) => void }) {
  if (tiles.length === 0) {
    return <div className="emptyState">手牌を入力してください</div>;
  }
  return (
    <div className="tileStrip">
      {tiles.map((tile, index) => (
        <button className={selected === tile ? "stripTileButton selected" : "stripTileButton"} key={`${tile}-${index}`} onClick={() => onSelect(tile)} type="button">
          <TileImage tile={tile} />
        </button>
      ))}
    </div>
  );
}

function WindField({ label, value, onChange }: { label: string; value: Tile; onChange: (tile: Tile) => void }) {
  return (
    <label className="numberField">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value as Tile)}>
        {(["東", "南", "西", "北"] as Tile[]).map((wind) => (
          <option key={wind} value={wind}>{wind}</option>
        ))}
      </select>
    </label>
  );
}

function RankAnswerPalette({
  suit,
  selected,
  disabled,
  onToggle
}: {
  suit: "m" | "p" | "s";
  selected: number[];
  disabled: boolean;
  onToggle: (rank: number) => void;
}) {
  const selectedSet = new Set(selected);
  return (
    <div className="chinitsuAnswerPalette">
      {Array.from({ length: 9 }, (_, index) => index + 1).map((rank) => (
        <button
          className={selectedSet.has(rank) ? "tileButton selected" : "tileButton"}
          disabled={disabled}
          key={rank}
          onClick={() => onToggle(rank)}
          title={`${rank}${suit}`}
          type="button"
        >
          <TileImage tile={chinitsuTile(rank, suit)} />
        </button>
      ))}
    </div>
  );
}

function ProblemTileStrip({ counts, selected, onTileClick }: { counts: Counts34; selected: Set<Tile>; onTileClick: (tile: Tile) => void }) {
  const tiles = countsToTiles(counts);
  return (
    <div className="tileStrip problemTileStrip" style={{ "--tile-count": tiles.length } as React.CSSProperties}>
      {tiles.map((tile, index) => (
        <button
          className={selected.has(tile) ? "stripTileButton selected" : "stripTileButton"}
          key={`${tile}-${index}`}
          onClick={() => onTileClick(tile)}
          type="button"
        >
          <TileImage tile={tile} />
        </button>
      ))}
    </div>
  );
}

function AnswerResult({ result }: { result: "correct" | "partial" | "wrong" }) {
  if (result === "correct") {
    return (
      <div className="answerResult answerCorrect">
        <span className="answerSymbol">○</span> 正解！
      </div>
    );
  }
  if (result === "partial") {
    return (
      <div className="answerResult answerPartial">
        <span className="answerSymbol">△</span> もう一歩！
      </div>
    );
  }
  return (
    <div className="answerResult answerWrong">
      <span className="answerSymbol">×</span> 不正解…
    </div>
  );
}

function TilePalette({ counts, onAdd }: { counts: Counts34; onAdd: (tile: Tile) => void }) {
  const rows = [TILE_NAMES.slice(0, 9), TILE_NAMES.slice(9, 18), TILE_NAMES.slice(18, 27), TILE_NAMES.slice(27)];
  return (
    <div className="paletteRows">
      {rows.map((row, rowIndex) => (
        <div className="paletteRow" key={rowIndex}>
          {row.map((tile) => (
            <button
              className="tileButton"
              disabled={counts[TILE_NAMES.indexOf(tile)] >= 4}
              key={tile}
              onClick={() => onAdd(tile)}
              title={tile}
              type="button"
            >
              <TileImage tile={tile} />
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

function TileStrip({ tiles, onTileClick, emptyText }: { tiles: Tile[]; onTileClick?: (tile: Tile) => void; emptyText?: string }) {
  if (tiles.length === 0) {
    return <div className="emptyStrip">{emptyText ?? "-"}</div>;
  }
  return (
    <div className="tileStrip" style={{ "--tile-count": tiles.length } as React.CSSProperties}>
      {tiles.map((tile, index) =>
        onTileClick ? (
          <button className="stripTileButton" key={`${tile}-${index}`} onClick={() => onTileClick(tile)} type="button">
            <TileImage tile={tile} />
          </button>
        ) : (
          <TileImage key={`${tile}-${index}`} tile={tile} />
        )
      )}
    </div>
  );
}

function ShantenBadge({ shanten }: { shanten: number }) {
  const label = shantenLabel(shanten);
  return <div className={`shantenBadge ${shantenClassName(shanten)}`}>{label}</div>;
}

function shantenLabel(shanten: number): string {
  if (shanten < 0) return "アガッテルアルヨ…";
  if (shanten === 0) return "聴牌";
  if (shanten === 1) return "一向聴";
  if (shanten === 2) return "二向聴";
  if (shanten === 3) return "三向聴";
  return `${shanten}向聴`;
}

function shantenClassName(shanten: number): string {
  if (shanten < 0) return "shantenAgari";
  if (shanten === 0) return "shantenTenpai";
  if (shanten === 1) return "shantenIishanten";
  if (shanten === 2) return "shantenRyan";
  return "shantenOther";
}

function DiscardResults({ results, best }: { results: DiscardAnalysis[]; best: Set<Tile> }) {
  return (
    <div className="discardList">
      {results.map((result) => {
        const isBest = best.has(result.discard);
        const goodRate = result.tenpaiDetails.length ? formatPercent(result.goodShapeRate) : "-";
        const superRate = result.tenpaiDetails.length ? formatPercent(result.superGoodShapeRate) : "-";
        return (
          <article className={isBest ? "discardCard best" : "discardCard"} key={result.discard}>
            <div className="discardGrid">
              <div>
                <div className="smallLabel">{isBest ? "打牌☆" : "打牌"}</div>
                <TileImage tile={result.discard} />
              </div>
              <div>
                <div className="smallLabel">進行</div>
                <ShantenBadge shanten={result.afterDiscardShanten} />
              </div>
              <Stat label="牌種類" value={`${result.ukeireTypes}種`} />
              <Stat label="枚数" value={`${result.ukeireTiles}枚`} />
              <Stat className={result.goodShapeRate >= 1 ? "redText" : undefined} label="良系率" value={goodRate} />
              <Stat className={result.superGoodShapeRate >= 0.01 ? "greenText" : undefined} label="超良系率" value={superRate} />
              <div className="ukeireCell">
                <div className="smallLabel">{result.afterDiscardShanten === 0 ? "待ち牌" : "有効牌"}</div>
                <TileStrip tiles={result.ukeire} />
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function Stat({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div>
      <div className="smallLabel">{label}</div>
      <div className={className ? `statValue ${className}` : "statValue"}>{value}</div>
    </div>
  );
}

function PlaceholderMode({ mode }: { mode: Mode }) {
  const labels: Record<Mode, string> = {
    checker: "牌理チェッカー",
    beginnerIishanten: "🔰 イーシャンテン何切る",
    ukeireMax: "🔥 受け入れMAX星人何切る",
    scoreQuizBeginner: "🔰 点数計算問題",
    scoreQuizHard: "🔥 点数計算HARD",
    scoring: "🔰 点数計算チェッカー",
    chinitsu: "🔥 清一色待ち当て",
    sevenShape: "🔰 7枚形トレーニング"
  };
  return (
    <section className="panel placeholder">
      <h2>{labels[mode]}</h2>
      <p>Next.js版ではまず牌理チェッカーを移植済みです。このモードは次の段階で移植します。</p>
    </section>
  );
}

function TileImage({ tile }: { tile: Tile }) {
  return <img alt={tile} src={tileImageSrc(tile)} />;
}

function tileImageSrc(tile: Tile): string {
  if (tile.endsWith("m")) return `/tiles/man${tile[0]}${IMAGE_SUFFIX}`;
  if (tile.endsWith("p")) return `/tiles/pin${tile[0]}${IMAGE_SUFFIX}`;
  if (tile.endsWith("s")) return `/tiles/sou${tile[0]}${IMAGE_SUFFIX}`;
  return `/tiles/ji${HONOR_IMAGE_NUMBERS.get(tile) ?? 1}${IMAGE_SUFFIX}`;
}

function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`;
}
