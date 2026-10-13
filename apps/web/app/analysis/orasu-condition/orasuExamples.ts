import type { OrasuConditionInput, OrasuSeat } from "@mahjong-trainer/mahjong-core";

export interface OrasuLearningExample {
  id: string;
  title: string;
  label: string;
  input: OrasuConditionInput;
  focusSeat: OrasuSeat;
  explanation: string;
}

// The article and calculator presets share inputs; results always use the existing core.
export const orasuExamples: OrasuLearningExample[] = [
  {
    id: "direct-hit",
    label: "直撃とツモ",
    title: "トップと3,500点差。直撃とツモを比べる",
    input: { scores: { east: 32000, south: 28500, west: 22000, north: 17500 }, selfSeat: "south", dealerSeat: "east", targetRank: 1, honba: 0, riichiSticks: 0, tiePolicy: "strict" },
    focusSeat: "east",
    explanation: "トップの東家からのロンは、自分の加点と東家の減点が同時に起こります。一方、西家・北家からのロンでは東家の持ち点は変わりません。下の表で、同じ目標でも必要な点数が変わることを確認してください。"
  },
  {
    id: "second-place",
    label: "4着から2着へ",
    title: "4着から2着へ。直撃相手で条件が変わる",
    input: { scores: { east: 45000, south: 10000, west: 30000, north: 15000 }, selfSeat: "south", dealerSeat: "east", targetRank: 2, honba: 0, riichiSticks: 0, tiePolicy: "strict" },
    focusSeat: "west",
    explanation: "西家から満貫8,000点をロンすると、自分は18,000点、西家は22,000点で、まだ3着です。跳満12,000点なら自分が22,000点、西家が18,000点になり、2着へ上がれます。トップの東家からロンする場合とは必要点が異なります。"
  },
  {
    id: "honba-and-sticks",
    label: "本場と供託",
    title: "2本場・供託1本なら、1,000点の手でも届く",
    input: { scores: { east: 32000, south: 28500, west: 22000, north: 16500 }, selfSeat: "south", dealerSeat: "east", targetRank: 1, honba: 2, riichiSticks: 1, tiePolicy: "strict" },
    focusSeat: "east",
    explanation: "北家がリーチ棒を出した後の持ち点を入力した例です。東家から1,000点でロンすると、2本場の600点を合わせた1,600点を東家が支払い、さらに供託1,000点を受け取ります。供託は東家の失点には含めません。"
  },
  {
    id: "tied-finish",
    label: "同点の扱い",
    title: "同点トップを認めるかで最低条件が変わる",
    input: { scores: { east: 32000, south: 28000, west: 22500, north: 17500 }, selfSeat: "south", dealerSeat: "east", targetRank: 1, honba: 0, riichiSticks: 0, tiePolicy: "allow" },
    focusSeat: "east",
    explanation: "東家から2,000点をロンすると、東家と南家が30,000点で並びます。この例は「同点で達成」です。「同点では未達」に切り替えて再計算し、必要なアガリ点の変化を確かめてください。実際の同点優先規定を代わりに判定する機能ではありません。"
  }
];
