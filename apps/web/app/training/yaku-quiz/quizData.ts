import type { HandScoreInput } from "@mahjong-trainer/mahjong-core";

export type YakuQuizQuestion = {
  id: string;
  title: string;
  prompt: string;
  context?: string;
  tiles: string[];
  choices: string[];
  answer: string;
  explanation: string;
  condition: Pick<HandScoreInput, "winningTile" | "winMethod" | "riichi">;
  choiceFeedback: Record<string, string>;
  relatedRuleHref: string;
};

export const yakuQuizQuestions: YakuQuizQuestion[] = [
  {
    id: "reach",
    title: "門前テンパイからリーチしてアガった手",
    prompt: "門前テンパイでの宣言によって加わった役はどれですか？",
    context: "リーチ成立後に五筒でロンした完成形14枚です。宣言時の13枚ではありません。",
    tiles: ["man2", "man3", "man4", "pin3", "pin4", "pin5", "sou6", "sou7", "sou8", "man6", "man7", "man8", "pin5", "pin5"],
    choices: ["リーチ", "役牌", "混一色"],
    answer: "リーチ",
    explanation: "鳴いていない状態でテンパイし、リーチを宣言するとリーチという役になります。",
    condition: { winningTile: "5p", winMethod: "ron", riichi: true },
    choiceFeedback: { "役牌": "役牌にできる字牌の刻子はありません。リーチは手の形ではなく、門前テンパイからの宣言で成立します。", "混一色": "萬子・筒子・索子の3種類を使っているため、一色手ではありません。" },
    relatedRuleHref: "/rules/reach"
  },
  {
    id: "tanyao",
    title: "1・9・字牌がない手",
    prompt: "この手でいちばん分かりやすい役はどれですか？",
    tiles: ["man2", "man3", "man4", "pin3", "pin4", "pin5", "sou4", "sou5", "sou6", "man6", "man7", "man8", "pin5", "pin5"],
    choices: ["タンヤオ", "役牌", "七対子"],
    answer: "タンヤオ",
    explanation: "1・9・字牌を使わず、2から8の数牌だけでできているのでタンヤオです。",
    condition: { winningTile: "6s", winMethod: "ron", riichi: false },
    choiceFeedback: { "役牌": "字牌が1枚もないため、役牌の刻子はありません。", "七対子": "7種類を2枚ずつ持つ形ではなく、順子4組と雀頭に分かれます。" },
    relatedRuleHref: "/rules/tanyao"
  },
  {
    id: "yakuhai",
    title: "中を3枚そろえた手",
    prompt: "この手で成立している役はどれですか？",
    tiles: ["man2", "man3", "man4", "pin3", "pin4", "pin5", "sou6", "sou7", "sou8", "ji7", "ji7", "ji7", "man5", "man5"],
    choices: ["役牌", "平和", "一盃口"],
    answer: "役牌",
    explanation: "白・發・中は三元牌です。中を3枚そろえると役牌になります。",
    condition: { winningTile: "5m", winMethod: "ron", riichi: false },
    choiceFeedback: { "平和": "中の刻子があり、四つの順子で作る平和の条件を満たしません。", "一盃口": "同じ種類・同じ数字並びの順子2組はありません。" },
    relatedRuleHref: "/rules/yakuhai"
  },
  {
    id: "tsumo",
    title: "自分でアガリ牌を引いた手",
    prompt: "鳴いていない状態で、自分で引いた牌でアガる役はどれですか？",
    context: "待っていた五萬を自分で引き、雀頭を完成させました。",
    tiles: ["man2", "man3", "man4", "pin3", "pin4", "pin5", "sou6", "sou7", "sou8", "ji7", "ji7", "ji7", "man5", "man5"],
    choices: ["ツモ", "ロン", "一盃口"],
    answer: "ツモ",
    explanation: "自分で引いた牌でアガることをツモと呼びます。門前なら門前清自摸和という役になります。",
    condition: { winningTile: "5m", winMethod: "tsumo", riichi: false },
    choiceFeedback: { "ロン": "ロンは相手の捨て牌などでアガる方法で、役の名前ではありません。ここでは自分で引いています。", "一盃口": "同じ順子2組はありません。門前ツモと一盃口は別々の条件で判定します。" },
    relatedRuleHref: "/rules/tsumo"
  },
  {
    id: "pinfu",
    title: "順子だけで作った手",
    prompt: "四つの順子・役牌ではない雀頭・両面待ちで成立する役はどれですか？",
    tiles: ["man2", "man3", "man4", "pin3", "pin4", "pin5", "sou4", "sou5", "sou6", "man6", "man7", "man8", "pin2", "pin2"],
    choices: ["平和", "対々和", "役牌"],
    answer: "平和",
    explanation: "順子だけでできていて、雀頭が役牌でなく、両面待ちなら平和を考えます。",
    condition: { winningTile: "6s", winMethod: "ron", riichi: false },
    choiceFeedback: { "対々和": "四つの面子がすべて順子です。対々和は刻子または槓子4組が必要です。", "役牌": "雀頭は二筒で、字牌の刻子はありません。四五索に六索でアガる両面の形を確認します。" },
    relatedRuleHref: "/rules/pinfu"
  },
  {
    id: "chiitoitsu",
    title: "同じ牌のペアが7組",
    prompt: "この特殊なアガリ形の名前はどれですか？",
    tiles: ["man2", "man2", "man5", "man5", "man8", "man8", "pin3", "pin3", "pin6", "pin6", "sou4", "sou4", "ji1", "ji1"],
    choices: ["七対子", "一盃口", "三色同順"],
    answer: "七対子",
    explanation: "同じ牌2枚のペアが7組ある形は七対子です。4面子1雀頭とは別のアガリ形です。",
    condition: { winningTile: "東", winMethod: "ron", riichi: false },
    choiceFeedback: { "一盃口": "同じ順子2組ではなく、異なる7種類の対子です。", "三色同順": "萬子・筒子・索子で同じ数字並びの順子を3組作っていません。" },
    relatedRuleHref: "/rules/chiitoitsu"
  },
  {
    id: "iipeikou",
    title: "同じ順子が2組ある手",
    prompt: "同じ種類・同じ並びの順子が2組ある役はどれですか？",
    tiles: ["man2", "man3", "man4", "man2", "man3", "man4", "pin3", "pin4", "pin5", "sou6", "sou7", "sou8", "pin5", "pin5"],
    choices: ["一盃口", "三色同順", "対々和"],
    answer: "一盃口",
    explanation: "同じ種類で同じ数字並びの順子が2組あると一盃口です。鳴くと成立しません。",
    condition: { winningTile: "8s", winMethod: "ron", riichi: false },
    choiceFeedback: { "三色同順": "二三四は萬子に2組あり、筒子・索子で同じ二三四がそろっているわけではありません。", "対々和": "二三四萬を2組の順子に分けます。刻子4組ではありません。" },
    relatedRuleHref: "/rules/iipeikou"
  },
  {
    id: "toitoi",
    title: "刻子が多い手",
    prompt: "順子を使わず、刻子を4つ作る役はどれですか？",
    tiles: ["man2", "man2", "man2", "pin5", "pin5", "pin5", "sou7", "sou7", "sou7", "ji7", "ji7", "ji7", "man5", "man5"],
    choices: ["対々和", "清一色", "リーチ"],
    answer: "対々和",
    explanation: "同じ牌3枚の刻子を4つ作ると対々和です。鳴いても成立します。",
    condition: { winningTile: "7s", winMethod: "ron", riichi: false },
    choiceFeedback: { "清一色": "3種類の数牌と字牌の中を使っています。一種類の数牌だけの清一色ではありません。", "リーチ": "リーチを宣言していない条件なので、門前でアガってもリーチは加わりません。" },
    relatedRuleHref: "/rules/toitoi"
  },
  {
    id: "sanshoku",
    title: "3種類で同じ順子を作る手",
    prompt: "萬子・筒子・索子で同じ数字並びの順子を作る役はどれですか？",
    tiles: ["man2", "man3", "man4", "pin2", "pin3", "pin4", "sou2", "sou3", "sou4", "man6", "man7", "man8", "pin5", "pin5"],
    choices: ["三色同順", "一盃口", "混一色"],
    answer: "三色同順",
    explanation: "萬子・筒子・索子で同じ数字並びの順子を作ると三色同順です。",
    condition: { winningTile: "4s", winMethod: "ron", riichi: false },
    choiceFeedback: { "一盃口": "二三四の数字は同じでも種類が異なります。一盃口は同じ種類の順子2組です。", "混一色": "3種類の数牌を使っているため、一種類の数牌と字牌で作る混一色ではありません。" },
    relatedRuleHref: "/rules/sanshoku"
  },
  {
    id: "honitsu",
    title: "一種類の数牌と字牌だけ",
    prompt: "萬子と字牌だけでできているこの手は、どの役を考えますか？",
    tiles: ["man2", "man3", "man4", "man6", "man7", "man8", "man5", "man5", "ji1", "ji1", "ji1", "ji7", "ji7", "ji7"],
    choices: ["混一色", "タンヤオ", "平和"],
    answer: "混一色",
    explanation: "一種類の数牌と字牌だけで作る役は混一色です。字牌がなく、一種類の数牌だけなら清一色です。",
    condition: { winningTile: "8m", winMethod: "ron", riichi: false },
    choiceFeedback: { "タンヤオ": "東と中の字牌を使っているため、2〜8だけのタンヤオではありません。", "平和": "東・中の刻子があり、四つの順子という条件を満たしません。" },
    relatedRuleHref: "/rules/honitsu"
  },
  {
    id: "chinitsu",
    title: "一種類の数牌だけ",
    prompt: "字牌も他の種類の数牌も使わない、この手の役はどれですか？",
    tiles: ["man1", "man2", "man3", "man2", "man3", "man4", "man5", "man6", "man7", "man6", "man7", "man8", "man9", "man9"],
    choices: ["清一色", "混一色", "七対子"],
    answer: "清一色",
    explanation: "一種類の数牌だけで作る役は清一色です。字牌が入ると混一色になります。",
    condition: { winningTile: "8m", winMethod: "ron", riichi: false },
    choiceFeedback: { "混一色": "字牌を含まず萬子だけなので、混一色ではなく清一色です。", "七対子": "7種類を2枚ずつ持つ形ではありません。数牌の種類と、アガリ形を分けて確認します。" },
    relatedRuleHref: "/rules/chinitsu"
  }
];
