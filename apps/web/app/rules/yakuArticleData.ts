import type { TileFigure } from "../components/TileFigures";

export type YakuArticle = {
  slug: string;
  name: string;
  kana: string;
  han: string;
  openNote: string;
  seoTitle: string;
  description: string;
  summary: string;
  conditions: string[];
  figure: TileFigure;
  extraFigures?: TileFigure[];
  beginnerTips: string[];
  mistakes: string[];
  notes?: string[];
  relatedPractice: { label: string; href: string };
  relatedTool: { label: string; href: string };
};

export const yakuArticles: YakuArticle[] = [
  {
    slug: "reach",
    name: "リーチ",
    kana: "立直",
    han: "1翻",
    openNote: "鳴いたら不可",
    seoTitle: "麻雀 リーチとは？初心者向けに条件を牌図つきで解説",
    description: "麻雀のリーチの条件、鳴いていないテンパイ、初心者が見るポイントを牌図つきで解説します。",
    summary: "リーチは、鳴いていない状態でテンパイしたときに宣言できる役です。宣言するだけで1翻になるので、初心者が最初に覚えたい役です。",
    conditions: ["鳴いていない", "あと1枚でアガれるテンパイになっている", "リーチを宣言する"],
    figure: {
      title: "鳴いていないテンパイならリーチできる",
      description: "この形は雀頭の五筒を待っています。鳴いていないなら、リーチを宣言できます。",
      badges: ["1翻", "門前のみ"],
      rows: [
        {
          label: "手牌",
          tiles: ["man2", "man3", "man4", "pin3", "pin4", "pin5", "sou6", "sou7", "sou8", "man6", "man7", "man8", "pin5"],
          resultLabel: "待ち",
          resultTiles: ["pin5"],
          note: "あと五筒でアガリ形になります。"
        }
      ]
    },
    beginnerTips: ["迷ったら、まずリーチできるかを見る", "リーチ後は基本的に手を変えられない", "鳴いた手ではリーチできない"],
    mistakes: ["鳴いたあとでもリーチできると思う", "テンパイしていないのにリーチできると思う", "リーチすれば必ずアガれると思う"],
    relatedPractice: { label: "待ち当て問題を解く", href: "/trainer" },
    relatedTool: { label: "点数表でリーチ後の点数を見る", href: "/tools/score-table" }
  },
  {
    slug: "tanyao",
    name: "タンヤオ",
    kana: "断么九",
    han: "1翻",
    openNote: "鳴いても可が多い",
    seoTitle: "麻雀 タンヤオとは？2〜8だけで作る役を牌図つきで解説",
    description: "麻雀のタンヤオの条件を、1・9・字牌を使わない役として初心者向けに牌図つきで解説します。",
    summary: "タンヤオは、2から8の数牌だけで作る役です。見た目で判断しやすく、鳴いても使えるルールが多いので初心者向きです。",
    conditions: ["1・9を使わない", "字牌を使わない", "2〜8の数牌だけで手を作る"],
    figure: {
      title: "2〜8だけならタンヤオ",
      description: "萬子・筒子・索子の2〜8だけでできています。1・9・字牌がないかを見ましょう。",
      badges: ["1翻", "喰いタン可が多い"],
      rows: [
        {
          label: "タンヤオ例",
          tiles: ["man2", "man3", "man4", "pin3", "pin4", "pin5", "sou4", "sou5", "sou6", "man6", "man7", "man8", "pin5", "pin5"],
          note: "すべて2〜8の数牌です。"
        },
        {
          label: "使えない牌",
          tiles: ["man1", "man9", "ji1"],
          tone: "warning",
          note: "1・9・字牌が入るとタンヤオではありません。"
        }
      ]
    },
    beginnerTips: ["手牌に端の牌や字牌がないか見る", "役牌と違って字牌は使えない"],
    mistakes: ["1や9を1枚だけなら使えると思う", "白・發・中を雀頭にしてもよいと思う"],
    notes: [
      "※喰いタンなしのルールも存在します。競技麻雀や雀荘などではほとんどの場合で喰いタン（鳴いてのタンヤオ）は認められています。"
    ],
    relatedPractice: { label: "何切る問題でタンヤオを意識する", href: "/trainer" },
    relatedTool: { label: "受け入れ枚数チェッカーを使う", href: "/trainer" }
  },
  {
    slug: "yakuhai",
    name: "役牌",
    kana: "やくはい",
    han: "1翻",
    openNote: "鳴いても可",
    seoTitle: "麻雀 役牌とは？白・發・中と風牌を牌図つきで解説",
    description: "麻雀の役牌について、白・發・中、場風、自風を3枚そろえる条件を牌図つきで解説します。",
    summary: "役牌は、白・發・中や、場風・自風を3枚そろえる役です。ポンしても役が残るため、初心者にも分かりやすい役です。",
    conditions: ["白・發・中のどれかを3枚そろえる", "場風か自風を3枚そろえる", "ポンしてもよい"],
    figure: {
      title: "中が3枚あれば役牌",
      description: "この例では中を3枚そろえています。これだけで役牌の1翻になります。",
      badges: ["1翻", "鳴き可"],
      rows: [
        {
          label: "手牌例",
          tiles: ["man2", "man3", "man4", "pin3", "pin4", "pin5", "sou6", "sou7", "sou8", "ji7", "ji7", "ji7", "man5", "man5"]
        },
        {
          label: "役になる部分",
          tiles: ["ji7", "ji7", "ji7"],
          tone: "answer",
          note: "中の刻子が役牌です。"
        },
        {
          label: "三元牌",
          tiles: ["ji6", "ji5", "ji7"],
          note: "白・發・中は常に役牌になります。"
        }
      ]
    },
    extraFigures: [
      {
        title: "場風はその局で全員共通の風",
        description:
          "場風は、今が何場かで決まる全員共通の風です。東場なら全員にとって東が場風、南場なら全員にとって南が場風です。自分の席が何家でも、場風を3枚そろえると役牌になります。",
        badges: ["風牌", "全員共通"],
        rows: [
          {
            label: "東場の場風",
            tiles: ["ji1"],
            tone: "answer",
            note: "東場では、全員にとって東が場風です。"
          },
          {
            label: "東を3枚",
            tiles: ["ji1", "ji1", "ji1"],
            tone: "answer",
            note: "東場なら、自分の席に関係なく東を3枚そろえると場風牌の役牌になります。"
          },
          {
            label: "南場の場風",
            tiles: ["ji2"],
            tone: "answer",
            note: "南場では、全員にとって南が場風です。"
          }
        ]
      },
      {
        title: "自風は自分の席だけの風",
        description:
          "自風は、自分の席に割り当てられた風です。東家なら東、南家なら南、西家なら西、北家なら北が自風です。自風を3枚そろえると、場風でなくても役牌になります。",
        badges: ["風牌", "自分だけ"],
        rows: [
          {
            label: "東家の自風",
            tiles: ["ji1"],
            tone: "answer",
            note: "自分が東家なら、東が自風です。"
          },
          {
            label: "南家の自風",
            tiles: ["ji2"],
            tone: "answer",
            note: "自分が南家なら、南が自風です。"
          },
          {
            label: "自風を3枚",
            tiles: ["ji2", "ji2", "ji2"],
            tone: "answer",
            note: "南家なら、南を3枚そろえると自風牌の役牌になります。"
          },
          {
            label: "役牌にならない例",
            tiles: ["ji3", "ji3", "ji3"],
            tone: "warning",
            note: "東場の南家で西が場風でも自風でもないなら、西を3枚そろえても役牌にはなりません。"
          }
        ]
      }
    ],
    beginnerTips: ["白・發・中を3枚そろえる形から覚える", "東南西北は場風か自風のときだけ役牌になる", "ポンしても役が残るので使いやすい"],
    mistakes: ["どの字牌でも3枚あれば必ず役牌だと思う", "風牌の条件を確認しない", "役牌の雀頭だけで役になると思う"],
    notes: [
      "場風は全員共通、自風は自分だけの風です。同じ東南西北でも、場風でも自風でもない風牌は3枚あっても役牌になりません。"
    ],
    relatedPractice: { label: "役判定クイズを解く", href: "/training/yaku-quiz" },
    relatedTool: { label: "役一覧に戻る", href: "/rules/yaku" }
  },
  {
    slug: "tsumo",
    name: "ツモ",
    kana: "門前清自摸和",
    han: "1翻",
    openNote: "鳴いたら不可",
    seoTitle: "麻雀 ツモとは？門前ツモの役を牌図つきで解説",
    description: "麻雀のツモ、門前清自摸和の条件とロンとの違いを初心者向けに牌図つきで解説します。",
    summary: "ツモは、自分で引いた牌でアガることです。鳴いていない状態なら、門前ツモという1翻の役になります。",
    conditions: ["鳴いていない", "自分で引いた牌でアガる", "最後の牌で手が完成する"],
    figure: {
      title: "自分で引いた牌ならツモ",
      description: "待っていた五萬を自分で引いて手が完成した例です。",
      badges: ["1翻", "門前のみ"],
      rows: [
        {
          label: "待っている手",
          tiles: ["man2", "man3", "man4", "pin3", "pin4", "pin5", "sou6", "sou7", "sou8", "ji7", "ji7", "ji7", "man5"],
          resultLabel: "ツモ牌",
          resultTiles: ["man5"],
          note: "自分で引いた五萬で雀頭が完成します。"
        }
      ]
    },
    beginnerTips: ["自分で引いたらツモ、相手の捨て牌ならロン", "鳴いていると門前ツモの役はつかない"],
    mistakes: ["鳴いていても門前ツモがつくと思う"],
    relatedPractice: { label: "待ち当て問題を解く", href: "/trainer" },
    relatedTool: { label: "初心者向け点数表を見る", href: "/tools/score-table" }
  },
  {
    slug: "pinfu",
    name: "平和",
    kana: "ピンフ",
    han: "1翻",
    openNote: "鳴いたら不可",
    seoTitle: "麻雀 平和とは？初心者向けに条件を牌図つきで解説",
    description: "麻雀の平和の条件、順子4つ、役牌ではない雀頭、両面待ちを牌図つきで初心者向けに解説します。",
    summary: "平和は、順子だけで作り、雀頭が役牌ではなく、両面待ちでアガる役です。よく出る役ですが条件は少し細かめです。",
    conditions: ["鳴いていない", "4つの面子がすべて順子", "雀頭が役牌ではない", "待ちが両面待ち"],
    figure: {
      title: "順子4つと役牌ではない雀頭",
      description: "この例は順子4つと二筒の雀頭です。待ちが両面なら平和になります。",
      badges: ["1翻", "門前のみ"],
      rows: [
        {
          label: "平和例",
          tiles: ["man2", "man3", "man4", "pin3", "pin4", "pin5", "sou4", "sou5", "sou6", "man6", "man7", "man8", "pin2", "pin2"]
        },
        {
          label: "両面の形",
          tiles: ["man6", "man7"],
          resultLabel: "待ち",
          resultTiles: ["man5", "man8"],
          note: "両側で順子になる待ちです。"
        }
      ]
    },
    beginnerTips: ["まず刻子がないかを見る", "雀頭が白・發・中や役牌の風ではないか見る", "待ちが両面かを見る"],
    mistakes: ["順子だけなら必ず平和だと思う", "カンチャン待ちでも平和になると思う", "鳴いても平和になると思う"],
    relatedPractice: { label: "待ち当て問題を解く", href: "/trainer" },
    relatedTool: { label: "平和の点数表を見る", href: "/tools/score-table" }
  },
  {
    slug: "chiitoitsu",
    name: "七対子",
    kana: "チートイツ",
    han: "2翻",
    openNote: "鳴いたら不可",
    seoTitle: "麻雀 七対子とは？7つのペアを牌図つきで解説",
    description: "麻雀の七対子について、同じ牌2枚のペアを7組作る特殊な役として牌図つきで解説します。",
    summary: "七対子は、同じ牌2枚のペアを7組作る役です。基本の4面子1雀頭とは違う、例外のアガリ形です。",
    conditions: ["鳴いていない", "同じ牌2枚のペアが7組ある", "4面子1雀頭ではなくてもよい"],
    figure: {
      title: "ペアが7組あれば七対子",
      description: "牌を2枚ずつに分けて、7組のペアができているかを見ます。",
      badges: ["2翻", "門前のみ"],
      rows: [
        {
          label: "七対子例",
          tiles: ["man2", "man2", "man5", "man5", "man8", "man8", "pin3", "pin3", "pin6", "pin6", "sou4", "sou4", "ji1", "ji1"],
          note: "7種類のペアでできています。"
        }
      ]
    },
    beginnerTips: ["対子が多い手なら七対子を考える", "鳴くと七対子にはならない", "点数表では25符固定として見る"],
    mistakes: ["同じ牌4枚を2ペアとして数えると思う", "ポンしても七対子になると思う", "4面子1雀頭に分けようとして迷う"],
    notes: [
      "※同じ牌4枚を2ペアとして数える、いわゆる四枚使い七対子が認められている場合も稀にあります。特に三人麻雀などで採用されるケースが多いです。四枚使い七対子、アメリカン七対子（アメチ）なんても呼ばれていたりもします。"
    ],
    relatedPractice: { label: "何切る問題で対子手を見る", href: "/trainer" },
    relatedTool: { label: "七対子の点数表を見る", href: "/tools/score-table" }
  },
  {
    slug: "iipeikou",
    name: "一盃口",
    kana: "イーペーコー",
    han: "1翻",
    openNote: "鳴いたら不可",
    seoTitle: "麻雀 一盃口とは？同じ順子2組を牌図つきで解説",
    description: "麻雀の一盃口を、同じ種類・同じ並びの順子2組として初心者向けに牌図つきで解説します。",
    summary: "一盃口は、同じ種類で同じ数字並びの順子を2組作る役です。リーチや平和と一緒に出ることがあります。",
    conditions: ["鳴いていない", "同じ順子が2組ある", "同じ種類・同じ数字並びである"],
    figure: {
      title: "同じ順子が2組ある形",
      description: "この例では二三四萬が2組あります。",
      badges: ["1翻", "門前のみ"],
      rows: [
        {
          label: "一盃口例",
          tiles: ["man2", "man2", "man3", "man3", "man4", "man4", "pin3", "pin4", "pin5", "sou6", "sou7", "sou8", "pin5", "pin5"]
        },
        {
          label: "役になる部分",
          tiles: ["man2", "man3", "man4", "man2", "man3", "man4"],
          tone: "answer",
          note: "同じ順子が2つあります。"
        }
      ]
    },
    beginnerTips: ["同じ並びが2回出ていないか見る", "萬子と筒子の同じ数字では一盃口にならない", "鳴いたら数えない"],
    mistakes: ["違う種類の同じ数字並びでもよいと思う", "鳴いても一盃口になると思う"],
    relatedPractice: { label: "何切る問題で順子を意識する", href: "/trainer" },
    relatedTool: { label: "役一覧に戻る", href: "/rules/yaku" }
  },
  {
    slug: "honitsu",
    name: "混一色",
    kana: "ホンイツ",
    han: "3翻 / 鳴き2翻",
    openNote: "鳴くと1翻下がる",
    seoTitle: "麻雀 混一色とは？一色手を牌図つきで解説",
    description: "麻雀の混一色を、1種類の数牌と字牌だけで作る役として牌図つきで解説します。",
    summary: "混一色は、1種類の数牌と字牌だけで作る役です。役牌と一緒になりやすく、見た目で分かりやすい役です。",
    conditions: ["萬子・筒子・索子のどれか1種類だけ使う", "字牌を使ってもよい", "鳴くと翻数が下がる"],
    figure: {
      title: "萬子と字牌だけの混一色",
      description: "この例では萬子と字牌だけで手ができています。",
      badges: ["3翻", "鳴き2翻"],
      rows: [
        {
          label: "混一色例",
          tiles: ["man2", "man3", "man4", "man5", "man5", "man6", "man7", "man8", "ji1", "ji1", "ji1", "ji7", "ji7", "ji7"]
        },
        {
          label: "混ざると不可",
          tiles: ["pin5"],
          tone: "warning",
          note: "別種類の数牌が入ると混一色ではありません。"
        }
      ]
    },
    beginnerTips: ["1種類の数牌に寄ってきたら意識する", "字牌の役牌とセットで見る", "鳴くと翻数が下がる"],
    mistakes: ["字牌なしでも混一色だと思う", "清一色との違いを混同する"],
    relatedPractice: { label: "清一色待ち当てを練習する", href: "/trainer" },
    relatedTool: { label: "役一覧に戻る", href: "/rules/yaku" }
  },
  {
    slug: "chinitsu",
    name: "清一色",
    kana: "チンイツ",
    han: "6翻 / 鳴き5翻",
    openNote: "鳴くと1翻下がる",
    seoTitle: "麻雀 清一色とは？一種類だけで作る高い役を牌図つきで解説",
    description: "麻雀の清一色を、1種類の数牌だけで作る高い役として牌図つきで初心者向けに解説します。",
    summary: "清一色は、萬子・筒子・索子のどれか1種類だけで作る高い役です。強い役ですが、待ちが複雑になりやすいです。",
    conditions: ["1種類の数牌だけで作る", "字牌を使わない", "鳴くと翻数が下がる"],
    figure: {
      title: "萬子だけで作る清一色",
      description: "この例は萬子だけで手ができています。字牌も他の数牌も使いません。",
      badges: ["6翻", "鳴き5翻"],
      rows: [
        {
          label: "清一色例",
          tiles: ["man1", "man2", "man3", "man2", "man3", "man4", "man5", "man6", "man7", "man6", "man7", "man8", "man9", "man9"]
        }
      ]
    },
    beginnerTips: ["一種類に寄ったら高い手を意識する", "待ちが複雑なので焦らない", "字牌が入ると混一色になる"],
    mistakes: ["字牌が入っても清一色だと思う", "待ちを1種類だけだと思い込む", "鳴いても6翻のままだと思う"],
    relatedPractice: { label: "清一色待ち当てを練習する", href: "/trainer" },
    relatedTool: { label: "待ち判定ツールを見る", href: "/tools" }
  },
  {
    slug: "toitoi",
    name: "対々和",
    kana: "トイトイ",
    han: "2翻",
    openNote: "鳴いても可",
    seoTitle: "麻雀 対々和とは？刻子4つの役を牌図つきで解説",
    description: "麻雀の対々和を、刻子を4つ作る役として牌図つきで初心者向けに解説します。",
    summary: "対々和は、順子を使わず、刻子を4つ作る役です。ポンを使って進めやすい役です。",
    conditions: ["刻子を4つ作る", "順子を使わない", "鳴いてもよい"],
    figure: {
      title: "刻子が4つある形",
      description: "同じ牌3枚の組み合わせを4つ作ると対々和になります。",
      badges: ["2翻", "鳴き可"],
      rows: [
        {
          label: "対々和例",
          tiles: ["man2", "man2", "man2", "pin5", "pin5", "pin5", "sou7", "sou7", "sou7", "ji7", "ji7", "ji7", "man5", "man5"]
        }
      ]
    },
    beginnerTips: ["ポンが多い手で意識する", "順子が入ると対々和ではない", "役牌とセットになると分かりやすい"],
    mistakes: ["刻子が3つでも対々和だと思う", "順子が1つあってもよいと思う", "守りにくさを忘れてポンしすぎる"],
    relatedPractice: { label: "役判定クイズを解く", href: "/training/yaku-quiz" },
    relatedTool: { label: "役一覧に戻る", href: "/rules/yaku" }
  },
  {
    slug: "sanshoku",
    name: "三色同順",
    kana: "サンショク",
    han: "2翻 / 鳴き1翻",
    openNote: "鳴くと1翻下がる",
    seoTitle: "麻雀 三色同順とは？同じ順子を3種類で作る役を牌図つきで解説",
    description: "麻雀の三色同順を、萬子・筒子・索子で同じ数字並びを作る役として牌図つきで解説します。",
    summary: "三色同順は、萬子・筒子・索子で同じ数字並びの順子を作る役です。見つけられると手作りが楽しくなります。",
    conditions: ["萬子・筒子・索子で同じ数字並びの順子を作る", "鳴くと翻数が下がる", "数字がずれると成立しない"],
    figure: {
      title: "二三四が3種類そろう形",
      description: "萬子・筒子・索子で同じ二三四の順子があります。",
      badges: ["2翻", "鳴き1翻"],
      rows: [
        {
          label: "三色同順例",
          tiles: ["man2", "man3", "man4", "pin2", "pin3", "pin4", "sou2", "sou3", "sou4", "man6", "man7", "man8", "pin5", "pin5"]
        },
        {
          label: "役になる部分",
          tiles: ["man2", "man3", "man4", "pin2", "pin3", "pin4", "sou2", "sou3", "sou4"],
          tone: "answer",
          note: "二三四の順子が3種類あります。"
        }
      ]
    },
    beginnerTips: ["2種類そろったら3種類目を意識する", "同じ数字並びか確認する", "鳴くと1翻に下がる"],
    mistakes: ["数字が少しずれてもよいと思う", "同じ種類で3組作っても三色だと思う", "三色同刻と混同する"],
    relatedPractice: { label: "何切る問題で三色を見る", href: "/trainer" },
    relatedTool: { label: "役一覧に戻る", href: "/rules/yaku" }
  }
];

export function getYakuArticle(slug: string): YakuArticle | undefined {
  return yakuArticles.find((article) => article.slug === slug);
}
