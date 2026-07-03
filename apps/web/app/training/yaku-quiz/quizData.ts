export type YakuQuizQuestion = {
  id: string;
  title: string;
  prompt: string;
  context?: string;
  tiles: string[];
  choices: string[];
  answer: string;
  explanation: string;
  relatedRuleHref: string;
};

export const yakuQuizQuestions: YakuQuizQuestion[] = [
  {
    id: "reach",
    title: "門前テンパイで宣言した手",
    prompt: "鳴いていないテンパイで宣言できる役はどれですか？",
    context: "状況: 鳴いていない状態でテンパイし、リーチを宣言しています。",
    tiles: ["man2", "man3", "man4", "pin3", "pin4", "pin5", "sou6", "sou7", "sou8", "man6", "man7", "man8", "pin5", "pin5"],
    choices: ["リーチ", "役牌", "混一色"],
    answer: "リーチ",
    explanation: "鳴いていない状態でテンパイし、リーチを宣言するとリーチという役になります。",
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
    relatedRuleHref: "/rules/yakuhai"
  },
  {
    id: "tsumo",
    title: "自分でアガリ牌を引いた手",
    prompt: "鳴いていない状態で、自分で引いた牌でアガる役はどれですか？",
    context: "状況: 鳴いていない状態で、最後の五萬を自分で引いてアガりました。",
    tiles: ["man2", "man3", "man4", "pin3", "pin4", "pin5", "sou6", "sou7", "sou8", "ji7", "ji7", "ji7", "man5", "man5"],
    choices: ["ツモ", "ロン", "一盃口"],
    answer: "ツモ",
    explanation: "自分で引いた牌でアガることをツモと呼びます。門前なら門前清自摸和という役になります。",
    relatedRuleHref: "/rules/tsumo"
  },
  {
    id: "pinfu",
    title: "順子だけで作った手",
    prompt: "門前で、両面待ちなら狙いやすい役はどれですか？",
    tiles: ["man2", "man3", "man4", "pin3", "pin4", "pin5", "sou4", "sou5", "sou6", "man6", "man7", "man8", "pin2", "pin2"],
    choices: ["平和", "対々和", "役牌"],
    answer: "平和",
    explanation: "順子だけでできていて、雀頭が役牌でなく、両面待ちなら平和を考えます。",
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
    relatedRuleHref: "/rules/chinitsu"
  }
];
