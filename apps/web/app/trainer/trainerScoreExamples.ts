import type { ScoreLearningExample } from "../tools/toolLearningExamples";

const conditions = {
  isDealer: false, winMethod: "ron" as const, roundWind: "東" as const, seatWind: "南" as const,
  riichi: false, ippatsu: false, dora: 0, honba: 0, riichiSticks: 0
};

// Lesson presets reuse the calculator's existing input and scoring path.
export const trainerScoreExamples: ScoreLearningExample[] = [
  {
    id: "training-score-edge", label: "三萬でロン", title: "ペンチャンでアガった場合",
    handText: "123678m34566p345s",
    input: { ...conditions, winningTile: "3m", riichi: true },
    explanation: "三萬は一二萬のペンチャンを完成させます。順子4組でも平和は付かず、副底20符＋門前ロン10符＋ペンチャン2符を切り上げます。"
  },
  {
    id: "training-score-ryanmen", label: "三筒でロン", title: "同じ完成形でも、両面でアガった場合",
    handText: "123678m34566p345s",
    input: { ...conditions, winningTile: "3p", riichi: true },
    explanation: "三筒は四五筒の両面を完成させます。雀頭も役牌ではないので平和が付きます。リーチに平和1翻が加わり、副底20符＋門前ロン10符の30符です。"
  },
  {
    id: "training-score-ankan", label: "九筒を暗カン", title: "門前を保った暗カンの符",
    handText: "23455p123s白白白",
    input: { ...conditions, winningTile: "3s", melds: [{ kind: "ankan", tiles: ["9p", "9p", "9p", "9p"] }] },
    explanation: "役は白の役牌1翻。九筒の暗カンは32符、白の暗刻は8符、一二索から三索ロンのペンチャンは2符。門前なのでロン10符も加えます。"
  },
  {
    id: "training-score-open-kan", label: "九筒を明カン", title: "公開したカンでは、門前ロンの符も変わる",
    handText: "23455p123s白白白",
    input: { ...conditions, winningTile: "3s", melds: [{ kind: "kan", tiles: ["9p", "9p", "9p", "9p"] }] },
    explanation: "役牌1翻は同じです。九筒の明カンは16符となり、白の暗刻8符とペンチャン2符を加えます。鳴いているので門前ロン10符は付きません。"
  }
];
