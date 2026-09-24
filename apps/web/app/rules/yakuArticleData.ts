import type { TileFigure } from "../components/TileFigures";

export type RelatedYaku = {
  name: string;
  detail: string;
  href?: string;
};

export type YakuPracticeQuestion = {
  prompt: string;
  choices: string[];
  answer: string;
  explanation: string;
};

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
  openExplanation?: string;
  compatibleYaku?: RelatedYaku[];
  strategy?: string[];
  beginnerTips: string[];
  mistakes: string[];
  notes?: string[];
  practiceQuestion?: YakuPracticeQuestion;
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
    openExplanation: "門前清自摸和は、ポン・チー・明槓をしていない門前の手だけにつく1翻役です。鳴いた手でも自分で牌を引いてアガること自体はできますが、その場合は『ツモというアガり方』であって、門前ツモの1翻は加算されません。",
    compatibleYaku: [
      { name: "リーチ", detail: "門前を維持したままテンパイするため、最も自然に複合します。", href: "/rules/reach" },
      { name: "平和", detail: "順子中心の両面待ちなら、リーチ・ツモ・平和の組み合わせを狙えます。", href: "/rules/pinfu" },
      { name: "一盃口", detail: "同じ順子が2組ある門前手なら、ツモと同時に成立します。", href: "/rules/iipeikou" }
    ],
    strategy: [
      "ツモは手牌の形から狙い分ける役ではなく、門前を保った手が自摸アガリしたときに追加される役です。リーチできる手を無理に鳴かず、打点と守備力を残す選択が結果として門前ツモにつながります。",
      "自摸アガリでは子なら他の3人、親なら子3人が点数を分けて支払います。ロンと支払い方が違うため、同じ翻数でも点数表では『ツモ』の欄を確認します。"
    ],
    beginnerTips: ["自分で引いたらツモ、相手の捨て牌ならロン", "鳴いていると門前ツモの役はつかない", "点数表ではロンとツモの支払い方を分けて確認する"],
    mistakes: ["鳴いていても門前ツモがつくと思う", "自分で引けば、ほかに役がなくても鳴いた手でアガれると思う", "ツモとロンで支払う人数が同じだと思う"],
    practiceQuestion: {
      prompt: "ポンもチーもしていないテンパイから、待っていた五萬を自分で引きました。このアガリにつく役はどれでしょう？",
      choices: ["門前清自摸和", "ロン", "鳴いているので役なし"],
      answer: "門前清自摸和（ツモ）",
      explanation: "門前のまま、自分で引いた牌で手が完成しているため1翻の門前ツモがつきます。相手の捨て牌でアガる場合はロンです。"
    },
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
    openExplanation: "平和は門前限定の1翻役です。チーで順子を作って形がすべて順子になっても平和にはなりません。門前・順子4組・役牌ではない雀頭・両面待ちの4条件を、アガリ牌まで含めて確認します。",
    compatibleYaku: [
      { name: "リーチ", detail: "門前限定同士なので複合しやすく、基本の打点を作れます。", href: "/rules/reach" },
      { name: "ツモ", detail: "門前の両面待ちを自分で引けば、門前ツモも加わります。", href: "/rules/tsumo" },
      { name: "タンヤオ", detail: "1・9・字牌を使わない順子手なら同時に成立しやすい役です。", href: "/rules/tanyao" },
      { name: "一盃口・三色同順", detail: "順子の並びが重なると、さらに翻数を増やせます。", href: "/rules/iipeikou" }
    ],
    strategy: [
      "平和を判定するときは、完成した手を眺めるだけでなく『どの牌でアガったか』を確認します。同じ完成形でも、両面待ちでアガった場合は平和、カンチャン・ペンチャン・単騎待ちなら平和なしになることがあります。",
      "雀頭は白・發・中だけでなく、場風と自風も避ける必要があります。場風と自風が同じ連風牌を雀頭にした場合も平和にはならないため、局と自分の席を毎局確認します。"
    ],
    beginnerTips: ["まず刻子がないかを見る", "雀頭が白・發・中や役牌の風ではないか見る", "最後に待ちが両面かを見る"],
    mistakes: ["順子だけなら必ず平和だと思う", "カンチャン・ペンチャン・単騎待ちでも平和になると思う", "場風や自風の雀頭を見落とす", "鳴いても平和になると思う"],
    practiceQuestion: {
      prompt: "門前で順子が4組あり、待ちは両面です。ただし雀頭が白でした。この手に平和はつくでしょうか？",
      choices: ["平和がつく", "平和はつかない", "ツモなら平和がつく"],
      answer: "平和はつかない",
      explanation: "白は常に役牌です。平和は役牌ではない雀頭が条件なので、待ちが両面でも白を雀頭にした手には成立しません。"
    },
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
    openExplanation: "一盃口は門前限定の1翻役です。同じ順子をチーして2組そろえても成立しません。手牌の6枚を、同じ種類・同じ数字並びの順子2組として分けられることが条件です。",
    compatibleYaku: [
      { name: "リーチ", detail: "門前を保って一盃口を完成させる過程で自然に複合します。", href: "/rules/reach" },
      { name: "平和", detail: "残りも順子、雀頭が役牌以外、待ちが両面なら同時に成立します。", href: "/rules/pinfu" },
      { name: "タンヤオ", detail: "一盃口部分と残りの牌がすべて2〜8なら複合できます。", href: "/rules/tanyao" },
      { name: "清一色", detail: "すべて同じ種類の数牌へ寄せたときも一盃口を残せます。", href: "/rules/chinitsu" }
    ],
    strategy: [
      "一盃口の候補があっても、同じ牌を2枚ずつ固定すると受け入れが狭くなる場合があります。テンパイ速度を落としてまで役を決め打ちせず、リーチや平和と両立できる形を優先します。",
      "完成形は『二二三三四四萬』のように対子が3つ並んで見えることがあります。七対子だけでなく、二三四萬を2組作れる一盃口としても分けられることを覚えておくと見落としが減ります。"
    ],
    beginnerTips: ["同じ並びが2回出ていないか見る", "6枚を同じ順子2組に分けて確認する", "萬子と筒子の同じ数字では一盃口にならない", "鳴いたら数えない"],
    mistakes: ["違う種類の同じ数字並びでもよいと思う", "鳴いても一盃口になると思う", "同じ順子が2組あれば、残りの形に関係なく必ずアガれると思う"],
    practiceQuestion: {
      prompt: "門前の手に二三四萬と二三四筒が1組ずつあります。この2組だけで一盃口は成立するでしょうか？",
      choices: ["成立する", "成立しない", "ツモなら成立する"],
      answer: "成立しない",
      explanation: "一盃口は同じ種類・同じ数字並びの順子が2組必要です。萬子と筒子では種類が違うため成立しません。"
    },
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
    openExplanation: "混一色は鳴いても成立します。ただし門前なら3翻、ポン・チー・明槓をすると2翻に下がります。数牌は萬子・筒子・索子のうち1種類だけにそろえ、字牌を含むことが清一色との違いです。",
    compatibleYaku: [
      { name: "役牌", detail: "同じ色へ寄せる途中で字牌を刻子にすると、速度と役を両立できます。", href: "/rules/yakuhai" },
      { name: "対々和", detail: "字牌や数牌の刻子が多い手では、混一色と対々和を同時に狙えます。", href: "/rules/toitoi" },
      { name: "チャンタ", detail: "すべての面子と雀頭に1・9・字牌が絡む形なら複合します。" },
      { name: "小三元", detail: "三元牌2組を刻子、残り1組を雀頭にすると高打点になります。" }
    ],
    strategy: [
      "配牌で1種類の数牌と字牌が多く、ほかの2種類が少ないときに混一色を検討します。役牌の対子があれば、ポンしても役を確保しながら一色手へ進められます。",
      "一色手は捨て牌から狙いが伝わりやすく、相手に警戒されます。鳴いて2翻へ下がること、必要牌が場に多く見えていないか、手の進み具合に見合う打点かを確認してから仕掛けます。"
    ],
    beginnerTips: ["1種類の数牌に寄ってきたら意識する", "字牌の役牌とセットで見る", "別種類の数牌を早く整理できるか確認する", "鳴くと3翻から2翻に下がる"],
    mistakes: ["字牌がない手も混一色だと思う", "数牌が2種類混ざっていてもよいと思う", "鳴いても3翻のままだと思う", "清一色との違いを混同する"],
    practiceQuestion: {
      prompt: "萬子と字牌だけの手で、白をポンしてアガりました。混一色は何翻として数えるでしょうか？",
      choices: ["3翻", "2翻", "鳴いたので成立しない"],
      answer: "2翻",
      explanation: "混一色は鳴いても成立しますが、門前3翻から1翻下がって2翻になります。白の刻子があれば役牌も複合します。"
    },
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
    openExplanation: "清一色は鳴いても成立する高打点役です。門前なら6翻、ポン・チー・明槓をすると5翻になります。萬子・筒子・索子のどれか1種類だけを使い、字牌が1枚でも入ると清一色ではありません。",
    compatibleYaku: [
      { name: "タンヤオ", detail: "2〜8だけで一色手を完成させれば同時に成立します。", href: "/rules/tanyao" },
      { name: "平和", detail: "門前で順子4組、役牌ではない雀頭、両面待ちなら複合します。", href: "/rules/pinfu" },
      { name: "一盃口", detail: "同じ色の中に同一順子が2組あれば追加できます。", href: "/rules/iipeikou" },
      { name: "対々和", detail: "同じ種類の刻子4組で作れば、高打点の刻子手になります。", href: "/rules/toitoi" }
    ],
    strategy: [
      "清一色は鳴いても5翻あるため、速度を優先して仕掛ける価値があります。一方で捨て牌から狙いが非常に伝わりやすく、必要牌を止められやすい役です。早い段階で手牌の進みと残り枚数を比べます。",
      "同じ種類の牌だけになると、複数の面子分けができて待ちが増える場合があります。見た目だけで待ちを1種類に決めず、アガリ牌ごとに4面子1雀頭へ分けられるか確認します。"
    ],
    beginnerTips: ["一種類に寄ったら高い手を意識する", "字牌が残るなら混一色として考える", "待ちが複雑なので牌を組み替えて確認する", "鳴くと6翻から5翻に下がる"],
    mistakes: ["字牌が入っても清一色だと思う", "別の種類の数牌が1枚だけなら使えると思う", "待ちを1種類だけだと思い込む", "鳴いても6翻のままだと思う"],
    practiceQuestion: {
      prompt: "索子だけで作った手を1回チーしてアガりました。清一色は何翻として数えるでしょうか？",
      choices: ["6翻", "5翻", "鳴いたので成立しない"],
      answer: "5翻",
      explanation: "清一色は鳴いても成立しますが、門前6翻から1翻下がって5翻になります。字牌が入っていないことも確認します。"
    },
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
    openExplanation: "対々和は鳴いても2翻のまま成立します。4つの面子すべてを刻子または槓子にし、残りを雀頭にします。ポンを使って進めやすい一方、順子が1組でも入ると成立しません。",
    compatibleYaku: [
      { name: "役牌", detail: "役牌の対子をポンすると、対々和への速度と1翻を同時に得られます。", href: "/rules/yakuhai" },
      { name: "混一色", detail: "1種類の数牌と字牌の刻子へ寄せると複合できます。", href: "/rules/honitsu" },
      { name: "清一色", detail: "同じ種類の数牌だけで刻子4組を作れば複合します。", href: "/rules/chinitsu" },
      { name: "三暗刻", detail: "自分でそろえた暗刻が3組あれば、鳴いた手でも複合できます。" }
    ],
    strategy: [
      "対々和は、対子が4組前後あり、ポンできる牌が複数あるときに候補になります。対子が2組程度しかない手から無理に目指すと、面子が不足して速度を落としやすくなります。",
      "ポンを重ねるほど手牌が短くなり、安全牌を持ちにくくなります。役牌や混一色が複合する高打点の手、または十分にテンパイが近い手から仕掛けると判断しやすくなります。"
    ],
    beginnerTips: ["対子が4組前後ある手で意識する", "4面子すべてが刻子か槓子か確認する", "役牌とセットになると分かりやすい", "ポン後に安全牌が残るか考える"],
    mistakes: ["刻子が3つでも対々和だと思う", "順子が1つあってもよいと思う", "暗刻だけで作らなければならないと思う", "守りにくさを忘れてポンしすぎる"],
    practiceQuestion: {
      prompt: "完成した手に刻子が3組、順子が1組、雀頭が1組あります。この手に対々和はつくでしょうか？",
      choices: ["対々和がつく", "対々和はつかない", "順子をチーしていなければつく"],
      answer: "対々和はつかない",
      explanation: "対々和は4つの面子すべてが刻子または槓子である必要があります。順子が1組でも入ると成立しません。"
    },
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
    openExplanation: "三色同順は鳴いても成立しますが、門前2翻から1翻へ下がります。萬子・筒子・索子の3種類すべてに、123や456のような同じ数字並びの順子が必要です。",
    compatibleYaku: [
      { name: "平和", detail: "門前で残りも順子、雀頭と待ちの条件を満たせば複合します。", href: "/rules/pinfu" },
      { name: "タンヤオ", detail: "234から678までの三色なら、残りも2〜8へまとめて複合できます。", href: "/rules/tanyao" },
      { name: "リーチ", detail: "門前で三色のテンパイを作れれば、打点を追加できます。", href: "/rules/reach" },
      { name: "チャンタ", detail: "123または789の三色で、すべての面子と雀頭に端牌・字牌が絡めば複合します。" }
    ],
    strategy: [
      "2種類で同じ順子の候補が見えたら、3種類目の受け入れを確認します。ただし三色のためだけに孤立牌を長く抱え、シャンテン数や受け入れを悪化させないことが大切です。",
      "完成する数字並びが1つずれるだけで三色にならないため、アガリ牌によって役の有無が変わることがあります。テンパイ時は『どの牌でアガれば三色になるか』まで確認します。"
    ],
    beginnerTips: ["2種類そろったら3種類目を意識する", "3組すべてが同じ数字並びか確認する", "アガリ牌によって三色がつくか確認する", "鳴くと2翻から1翻に下がる"],
    mistakes: ["数字が少しずれてもよいと思う", "同じ種類で3組作っても三色だと思う", "萬子・筒子・索子のうち2種類だけで成立すると思う", "三色同刻と混同する"],
    practiceQuestion: {
      prompt: "二三四萬・二三四筒・三四五索が完成しています。この3組で三色同順は成立するでしょうか？",
      choices: ["成立する", "成立しない", "門前なら成立する"],
      answer: "成立しない",
      explanation: "萬子と筒子は234ですが、索子だけ345です。3種類すべてが同じ数字並びでなければ三色同順にはなりません。"
    },
    relatedPractice: { label: "何切る問題で三色を見る", href: "/trainer" },
    relatedTool: { label: "役一覧に戻る", href: "/rules/yaku" }
  }
];

export function getYakuArticle(slug: string): YakuArticle | undefined {
  return yakuArticles.find((article) => article.slug === slug);
}
