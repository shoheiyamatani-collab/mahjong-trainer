import type { HandScoreInput, Tile } from "@mahjong-trainer/mahjong-core";

export const CHECKER_SAMPLE_HAND = "345688m1234p3456s";
export const SCORE_SAMPLE_HAND = "123m456m234p456p22s";
export const CHECKER_COMPARISON_DISCARDS: Tile[] = ["1p", "4p", "3m", "8m", "4m"];

export interface ScoreLearningExample {
  id: string;
  label: string;
  title: string;
  handText: string;
  input: Omit<HandScoreInput, "counts">;
  explanation: string;
}

const closedRon: Omit<HandScoreInput, "counts"> = {
  winningTile: "4p", isDealer: false, winMethod: "ron", roundWind: "東", seatWind: "南",
  riichi: true, ippatsu: false, dora: 0, honba: 0, riichiSticks: 0
};

export const scoreLearningExamples: ScoreLearningExample[] = [
  {
    id: "pinfu-ron", label: "リーチ・平和のロン", title: "門前ロンの10符を確認する",
    handText: SCORE_SAMPLE_HAND, input: { ...closedRon },
    explanation: "4筒は5・6筒の両面形を完成させる和了牌です。4面子はすべて順子で、雀頭の2索には符が付きません。平和とリーチで2翻、副底20符と門前ロン10符で30符になります。"
  },
  {
    id: "pinfu-tsumo", label: "同じ手のツモ", title: "ロンをツモへ変えると、翻と符が両方変わる",
    handText: SCORE_SAMPLE_HAND, input: { ...closedRon, winMethod: "tsumo" },
    explanation: "手牌・和了牌・リーチは同じです。ツモでは門前清自摸和が1翻加わります。一方、平和ツモは20符のままで、門前ロン10符もツモ2符も加えません。翻が増えても、ロンの符をそのまま使わないことがポイントです。"
  },
  {
    id: "honba-sticks", label: "本場・供託あり", title: "放銃者の支払いと、自分の受け取りを分ける",
    handText: SCORE_SAMPLE_HAND, input: { ...closedRon, honba: 2, riichiSticks: 1 },
    explanation: "2翻30符の子のロン点2,000点に、2本場の600点を加えて放銃者が2,600点を支払います。供託1本の1,000点は卓上から受け取るため、自分の受け取りは3,600点です。供託を放銃者に追加請求するわけではありません。"
  },
  {
    id: "white-pon", label: "白ポンのロン", title: "鳴いた手は、役と明刻の符を確認する",
    handText: "123456m77p234s",
    input: { ...closedRon, winningTile: "4s", riichi: false, melds: [{ kind: "pon", tiles: ["白", "白", "白"] }] },
    explanation: "白のポンで役牌が1翻。鳴いているためリーチ・平和・門前ロン10符は付きません。副底20符に、字牌の明刻4符を加えて24符。10符単位に切り上げた30符で計算します。副露3枚は手牌11枚と分けて入力します。"
  }
];
