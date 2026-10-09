import type { TileFigure } from "../components/TileFigures";
import type { ToolPreviewScreenshot } from "../components/ToolPreviewImage";

export type TrainerMode =
  | "beginnerIishanten"
  | "ukeireMax"
  | "scoreQuizBeginner"
  | "scoreQuizHard"
  | "chinitsu"
  | "sevenShape";

export type TrainerCategory = "牌効率" | "待ち" | "点数計算" | "実戦判断";

export type TrainerLink = {
  href: string;
  label: string;
  description: string;
};

export type TrainerDefinition = {
  slug: string;
  mode: TrainerMode;
  category: TrainerCategory;
  title: string;
  shortTitle: string;
  eyebrow: string;
  description: string;
  screenshot: ToolPreviewScreenshot;
  level: "初心者" | "中級者" | "上級者";
  focus: string;
  seoTitle: string;
  seoDescription: string;
  skills: string[];
  strategyTitle: string;
  strategy: Array<{ heading: string; paragraphs: string[]; bullets?: string[] }>;
  figures: TileFigure[];
  commonMistakes: string[];
  practicalUse: string;
  relatedArticles: TrainerLink[];
  relatedTools: TrainerLink[];
};

export const standaloneTrainerDefinitions = [{
  slug: "call-or-pass", category: "実戦判断" as const, title: "鳴く？鳴かない？トレーニング",
  level: "初級〜上級", focus: "役・速度・打点・守備から鳴き判断を選ぶ力",
  description: "30の実戦的な牌姿でポン・チー・スルーを選び、鳴いた後の手牌と受け入れ、役、打点を比べます。",
  screenshot: { src: "/tool-screenshots/trainer-call-or-pass.jpg", alt: "鳴くかスルーするかを選ぶ手牌、点棒とポン・チー・スルーの回答ボタン", width: 1280, height: 1100 }
}, {
  slug: "riichi-or-dama", category: "実戦判断" as const, title: "リーチ？ダマ？トレーニング",
  level: "初級〜上級", focus: "役・待ち・打点・点棒からリーチ判断を比べる力",
  description: "30の門前テンパイでリーチかダマを選び、ロン・ツモ点数、手変わり、守備、オーラス条件を比べます。",
  screenshot: { src: "/tool-screenshots/trainer-riichi-or-dama.jpg", alt: "リーチかダマかを選ぶ13枚の手牌、打牌候補と点棒状況", width: 1265, height: 1087 }
}, {
  slug: "push-or-fold", category: "実戦判断" as const, title: "押す？オリる？トレーニング",
  level: "初級〜上級", focus: "手牌価値と失点リスクを、相手ごとの安全情報から比べる力",
  description: "他家のリーチや仕掛けに対して、手牌価値・安全牌・巡目・点棒状況を比べ、押し引きを判断する練習です。",
  screenshot: { src: "/tool-screenshots/trainer-push-or-fold.jpg", alt: "押し引きを選ぶ自分の手牌と4人の河、リーチ状態と点棒状況", width: 1044, height: 1039 }
}];

export const trainerDefinitions: readonly TrainerDefinition[] = [
  {
    slug: "ukeire-max",
    screenshot: { src: "/tool-screenshots/trainer-ukeire-max.jpg", alt: "受け入れMAX星人何切るの14枚の手牌と回答ボタン", width: 502, height: 169 },
    mode: "ukeireMax",
    category: "牌効率",
    title: "受け入れMAX星人何切る",
    shortTitle: "受け入れMAX",
    eyebrow: "UKEIRE TRAINING",
    description: "打牌候補ごとの有効牌と残り枚数を比べ、最も広い受け入れを見つける高難度の何切る練習です。",
    level: "上級者",
    focus: "複合形の受け入れを正確に数える力",
    seoTitle: "麻雀 受け入れ枚数トレーニング | 何切るで牌効率を練習 | 雀フォリオ",
    seoDescription: "複雑な何切る問題で、シャンテン数・有効牌・受け入れ枚数を比較する麻雀トレーニングです。牌理チェッカーで答えの根拠も確認できます。",
    skills: ["シャンテン数を落とさない候補を選ぶ", "有効牌の種類と残り枚数を数える", "複合形の隠れた受け入れを見つける"],
    strategyTitle: "受け入れ最大を見つける順番",
    strategy: [
      {
        heading: "最初にシャンテン数をそろえる",
        paragraphs: [
          "受け入れを数える前に、切った後のシャンテン数を確認します。シャンテン数を戻す打牌と維持する打牌は、同じ基準で比べません。",
          "同じ進行度の候補だけが残ったら、次に手が進む牌を有効牌として数えます。自分の手牌で使っている同種牌は、4枚から差し引きます。"
        ]
      },
      {
        heading: "種類数と枚数を分けて見る",
        paragraphs: [
          "有効牌が何種類あるかと、合計で何枚残っているかは別の情報です。両面のように2種類を受ける形でも、自分で同じ牌を多く使っていれば残り枚数は減ります。",
          "複合形では一つの牌が複数のブロックを同時に改善します。見た目だけで数えず、各候補を切った後の形を作り直して確認します。"
        ]
      },
      {
        heading: "受け入れMAXは実戦判断の土台",
        paragraphs: [
          "枚数が最大の打牌は速度面で有力ですが、常に実戦の最善打とは限りません。良形率、ドラ、手役、安全度、巡目、点棒状況は別に評価します。",
          "まず牌理上の最速候補を知り、そこから別の打牌を選ぶなら『打点を残す』『安全牌を持つ』のように理由を言葉にできることが大切です。"
        ]
      }
    ],
    figures: [
      {
        title: "受け入れの数え方を分解する",
        description: "両面とカンチャンを比べると、種類数と最大枚数の違いが見えます。",
        badges: ["種類", "残り枚数"],
        rows: [
          { label: "両面", tiles: ["man4", "man5"], resultLabel: "有効牌", resultTiles: ["man3", "man6"], tone: "answer", note: "見えていなければ2種8枚です。" },
          { label: "カンチャン", tiles: ["pin3", "pin5"], resultLabel: "有効牌", resultTiles: ["pin4"], note: "見えていなければ1種4枚です。" },
          { label: "複合形", tiles: ["sou3", "sou4", "sou5", "sou5", "sou6"], resultLabel: "変化", resultTiles: ["sou2", "sou5", "sou7"], tone: "answer", note: "順子の抜き方を変えると複数の改善牌が見つかります。" }
        ]
      }
    ],
    commonMistakes: ["シャンテン数が悪化する候補まで枚数だけで比べる", "有効牌の種類数だけを見て、手牌で使っている枚数を引かない", "受け入れ最大を場況に関係なく唯一の正解だと考える"],
    practicalUse: "序盤の手組みで迷ったとき、まず速度の基準を作るために使います。対局後は迷った牌姿を牌理チェッカーへ入れ、問題で数えられなかった有効牌を確認すると復習がつながります。",
    relatedArticles: [
      { href: "/learn/guides/tile-efficiency-and-ukeire", label: "牌効率と受け入れの基本", description: "有効牌と残り枚数を数える順番を牌図で復習します。" },
      { href: "/learn/guides/good-shape-rate", label: "良形率の考え方", description: "枚数だけでは分からないテンパイ後の形を学びます。" }
    ],
    relatedTools: [
      { href: "/analysis/mahjong-tool", label: "牌理チェッカー", description: "同じ牌姿を入力して、全候補の受け入れと良形率を比較します。" },
      { href: "/trainer/iishanten", label: "イーシャンテン何切る", description: "候補を絞る基礎から練習したいときに戻ります。" }
    ]
  },
  {
    slug: "iishanten",
    screenshot: { src: "/tool-screenshots/trainer-iishanten.jpg", alt: "イーシャンテン何切るで出題される14枚の手牌", width: 508, height: 267 },
    mode: "beginnerIishanten",
    category: "牌効率",
    title: "イーシャンテン何切る",
    shortTitle: "イーシャンテン何切る",
    eyebrow: "IISHANTEN TRAINING",
    description: "あと1段階でテンパイする手牌から、受け入れと最終形を比べて切る牌を選ぶ入門トレーニングです。",
    level: "初心者",
    focus: "一向聴の候補を順序立てて比べる力",
    seoTitle: "麻雀 イーシャンテン何切る | 受け入れと良形を練習 | 雀フォリオ",
    seoDescription: "イーシャンテンの何切る問題で、シャンテン数、受け入れ枚数、最終形、良形率を順番に比較する初心者向け麻雀トレーニングです。",
    skills: ["イーシャンテンを見分ける", "受け入れと最終形を比べる", "孤立牌とくっつき候補を評価する"],
    strategyTitle: "何切るで迷ったときの比較手順",
    strategy: [
      {
        heading: "一向聴を崩さない候補を探す",
        paragraphs: [
          "イーシャンテンは、あと1段階でテンパイする状態です。最初に、打牌後もイーシャンテンを保てる候補を残します。",
          "完成面子を崩す、雀頭候補をすべて失うなど、明確に遠回りする打牌はこの段階で分けられます。"
        ]
      },
      {
        heading: "受け入れの次に最終形を見る",
        paragraphs: [
          "候補ごとにテンパイする牌を数え、差が小さければテンパイ後の待ちを比べます。両面や三面待ちになりやすい候補は、同じ一向聴でもアガリやすさが上がります。",
          "くっつき一向聴では中央の孤立牌が多くの両面変化を持ちます。見た目が孤立していても、数字の3から7は価値が高いことがあります。"
        ]
      },
      {
        heading: "手役・ドラ・安全度を最後に足す",
        paragraphs: [
          "牌効率上の候補を出した後で、ドラを残せるか、役が消えないか、安全牌を持てるかを確認します。序盤と終盤、平場とオーラスでも優先順位は変わります。",
          "練習では速度を正確に比べる力を身につけ、実戦では局面の条件を上乗せする、と役割を分けると判断が整理できます。"
        ]
      }
    ],
    figures: [
      {
        title: "くっつき候補の価値を見る",
        description: "中央の孤立牌は、両側への変化が多いことを確認します。",
        badges: ["一向聴", "くっつき"],
        rows: [
          { label: "中央の孤立牌", tiles: ["man5"], resultLabel: "主な変化", resultTiles: ["man3", "man4", "man6", "man7"], tone: "answer", note: "両面を作る変化が複数あります。" },
          { label: "端の孤立牌", tiles: ["pin1"], resultLabel: "主な変化", resultTiles: ["pin2", "pin3"], note: "中央牌より変化の方向が限られます。" },
          { label: "良形ターツ", tiles: ["sou5", "sou6"], resultLabel: "有効牌", resultTiles: ["sou4", "sou7"], tone: "answer", note: "最終形が両面になりやすい基本候補です。" }
        ]
      }
    ],
    commonMistakes: ["受け入れ枚数だけを見て、愚形テンパイばかりになる候補を選ぶ", "中央の孤立牌を不要牌だと決めつける", "ドラや手役を優先しすぎてシャンテン数を戻す"],
    practicalUse: "対局中に複数の切りたい牌が見えたら、進行度、受け入れ、最終形の順で比較します。数字の差が小さいときだけ打点や安全度を加えると、考える時間を短くできます。",
    relatedArticles: [
      { href: "/learn/guides/one-shanten-ukeire", label: "イーシャンテンの受け入れ", description: "完全一向聴、ヘッドレス、くっつきの違いを学びます。" },
      { href: "/learn/guides/beginner-nanikiru-mistakes", label: "初心者の何切るミス10選", description: "候補の絞り方で起こりやすい失敗を確認します。" }
    ],
    relatedTools: [
      { href: "/analysis/mahjong-tool", label: "牌理チェッカー", description: "問題と同じ14枚を入れ、候補別の数値を確認できます。" },
      { href: "/trainer/ukeire-max", label: "受け入れMAX", description: "基礎に慣れたら複雑な受け入れ比較へ進みます。" }
    ]
  },
  {
    slug: "seven-tile",
    screenshot: { src: "/tool-screenshots/trainer-seven-tile.jpg", alt: "7枚形トレーニングの問題の牌姿と練習モード", width: 502, height: 280 },
    mode: "sevenShape",
    category: "待ち",
    title: "7枚形 多面待ちトレーニング",
    shortTitle: "7枚形",
    eyebrow: "SEVEN-TILE SHAPES",
    description: "実戦で頻出する7枚の複合形から、すべての待ちを見つけるトレーニングです。",
    level: "中級者",
    focus: "複合形を分解して待ちを漏らさない力",
    seoTitle: "麻雀 7枚形トレーニング | 多面待ちを牌姿で練習 | 雀フォリオ",
    seoDescription: "麻雀の7枚形を使い、順子と雀頭の分け方を変えながら多面待ちを見つけるトレーニングです。頻出形を牌画像で反復できます。",
    skills: ["順子を左右から抜く", "雀頭候補を入れ替える", "頻出する複合形を素早く見抜く"],
    strategyTitle: "7枚形を覚える理由と見つけ方",
    strategy: [
      {
        heading: "7枚は二面子と雀頭を作る最小の複合単位",
        paragraphs: [
          "7枚形では、同じ牌の並びを二つの順子と雀頭に分ける方法が複数あります。一つの分け方だけを見ると、別のアガリ牌を見落とします。",
          "形を丸暗記するだけでなく、左から順子を抜く、右から抜く、対子を雀頭にする、という確認手順を身につけます。"
        ]
      },
      {
        heading: "端から確認して最後に重なりを見る",
        paragraphs: [
          "まず一番小さい数字から3枚を順子として外し、残りが面子と雀頭になる牌を探します。次に一番大きい数字側から同じ作業をします。",
          "同じ牌が2枚以上ある部分は雀頭だけでなく、刻子や二つの順子にまたがる可能性があります。重なった牌を固定しすぎないことが大切です。"
        ]
      }
    ],
    figures: [
      {
        title: "左右から分け直す",
        description: "連続形は一方向だけでなく、反対側からも順子を外します。",
        badges: ["複合形"],
        rows: [
          { label: "連続7枚", tiles: ["man2", "man3", "man4", "man5", "man6", "man7", "man8"], note: "左から234、右から678の両方を起点に分けます。" },
          { label: "対子を含む形", tiles: ["pin3", "pin4", "pin5", "pin5", "pin6", "pin7", "pin8"], note: "5筒を雀頭に固定せず、順子の一部としても見ます。" },
          { label: "端を含む形", tiles: ["sou1", "sou2", "sou3", "sou3", "sou4", "sou5", "sou6"], note: "123を外した残りと、234から見た残りを比べます。" }
        ]
      }
    ],
    commonMistakes: ["最初に見つけた順子の分け方だけで待ちを決める", "同じ牌を必ず雀頭だと固定する", "待ちの種類は合っていても、自分で使っている枚数を数え忘れる"],
    practicalUse: "リーチ前に待ちを確認するときだけでなく、鳴いた後の残り形や一色手の途中形にも使えます。7枚形を小さな単位で見抜けると、長い手牌を一度に分解する負担が減ります。",
    relatedArticles: [
      { href: "/learn/guides/wait-types", label: "待ちの種類", description: "両面・カンチャン・単騎など基本形を復習します。" },
      { href: "/rules/practical-waits", label: "実戦でよく見る待ち", description: "ノベタンや亜両面を牌図で確認します。" }
    ],
    relatedTools: [
      { href: "/trainer/chinitsu", label: "清一色何待ち", description: "7枚形を組み合わせた長い一色手へ進みます。" },
      { href: "/analysis/mahjong-tool", label: "牌理チェッカー", description: "テンパイ前の複合形が持つ有効牌を確認します。" }
    ]
  },
  {
    slug: "chinitsu",
    screenshot: { src: "/tool-screenshots/trainer-chinitsu.jpg", alt: "清一色何待ちトレーニングで出題される13枚の手牌", width: 502, height: 280 },
    mode: "chinitsu",
    category: "待ち",
    title: "清一色何待ちトレーニング",
    shortTitle: "清一色何待ち",
    eyebrow: "CHINITSU WAITS",
    description: "同じ色に集まった長い牌姿を分解し、清一色の待ちを漏れなく選ぶ高難度トレーニングです。",
    level: "上級者",
    focus: "一色手の多面待ちを体系的に見抜く力",
    seoTitle: "麻雀 清一色何待ちトレーニング | 多面待ちを練習 | 雀フォリオ",
    seoDescription: "清一色の複雑な多面待ちを、順子・刻子・雀頭の分け方を変えながら見つける高難度の麻雀トレーニングです。",
    skills: ["面子を固定せずに分け直す", "雀頭候補をすべて試す", "待ち牌を重複なく整理する"],
    strategyTitle: "清一色の待ちを漏らさない確認法",
    strategy: [
      {
        heading: "完成面子に見える部分も固定しない",
        paragraphs: [
          "清一色は同じ色の牌がつながるため、完成して見える順子が別の順子や雀頭にも使われます。最初に見えた面子を外しただけで待ちを確定しないでください。",
          "左端から順子を外す、右端から外す、刻子を先に外す、という複数の分解を試します。"
        ]
      },
      {
        heading: "対子の位置を一つずつ変える",
        paragraphs: [
          "同じ牌が2枚以上ある場所は、すべて雀頭候補です。雀頭を一か所に固定して残りを分解し、成立する待ちを記録したら、次の候補へ移ります。",
          "最後に待ち牌をまとめ、同じ待ちを重複して数えないようにします。実戦では自分が使っている枚数と場に見えている枚数も差し引きます。"
        ]
      }
    ],
    figures: [
      {
        title: "一色手は分解順を変える",
        description: "順子と雀頭の候補が重なる部分を、複数の方向から確認します。",
        badges: ["清一色", "多面待ち"],
        rows: [
          { label: "連続形", tiles: ["pin2", "pin3", "pin4", "pin5", "pin6", "pin7", "pin8"], note: "234、345、456、567、678の重なりを意識します。" },
          { label: "重なり形", tiles: ["pin3", "pin3", "pin4", "pin5", "pin5", "pin6", "pin7"], note: "3筒・5筒のどちらも雀頭候補として分け直します。" },
          { label: "刻子候補", tiles: ["pin1", "pin1", "pin1", "pin2", "pin3", "pin4", "pin5"], note: "111を刻子にする形と、123を順子にする形を比べます。" }
        ]
      }
    ],
    commonMistakes: ["完成して見える順子を外して残りだけで判断する", "最初に見つけた対子を雀頭に固定する", "待ち牌は合っていても残り枚数を4枚のまま数える"],
    practicalUse: "清一色だけでなく、ホンイツの数牌部分や鳴いた後の一色形にも同じ分解法を使えます。時間制限のある対局では、7枚形を小分けに見つけてから全体をつなげると確認が速くなります。",
    relatedArticles: [
      { href: "/rules/chinitsu", label: "清一色の成立条件", description: "役の条件、鳴いた場合の翻数、複合役を確認します。" },
      { href: "/rules/practical-waits", label: "複合待ちの基本", description: "待ちを分解する基本手順を牌図で学びます。" }
    ],
    relatedTools: [
      { href: "/trainer/seven-tile", label: "7枚形トレーニング", description: "清一色の前に短い複合形で分解を練習します。" },
      { href: "/learn/guides/wait-types", label: "待ちの種類を復習", description: "基本5種類の待ちへ戻って確認できます。" }
    ]
  },
  {
    slug: "score",
    screenshot: { src: "/tool-screenshots/trainer-score.jpg", alt: "初心者向け点数計算問題の手牌と親子、ロン・ツモの条件", width: 502, height: 289 },
    mode: "scoreQuizBeginner",
    category: "点数計算",
    title: "点数計算トレーニング",
    shortTitle: "点数計算 基本",
    eyebrow: "SCORE TRAINING",
    description: "親子・ロンツモ・符・翻を確認し、実戦でよく出る点数を牌姿から答える基本トレーニングです。",
    level: "初心者",
    focus: "点数表を正しい順番で引く力",
    seoTitle: "麻雀 点数計算トレーニング | 牌姿から基本問題を練習 | 雀フォリオ",
    seoDescription: "麻雀の点数計算を、親子、ロン・ツモ、符、翻の順に確認しながら牌姿で練習できます。平和・七対子・満貫以上にも対応します。",
    skills: ["親子とロン・ツモを先に確認する", "翻と符を分けて数える", "満貫以上の区切りを判断する"],
    strategyTitle: "点数を迷わず出す確認順",
    strategy: [
      {
        heading: "親子とアガリ方を先に決める",
        paragraphs: [
          "同じ翻と符でも、親か子か、ロンかツモかで支払いが変わります。最初にこの二つを確認し、その後で役とドラから翻数を数えます。",
          "ツモでは子の支払いと親の支払いが分かれます。親のツモは3人が同じ額を支払います。"
        ]
      },
      {
        heading: "符は例外から覚える",
        paragraphs: [
          "平和ツモは20符、七対子は25符固定です。それ以外は副底20符を基準に、門前ロン、ツモ、刻子、待ち、雀頭の符を足して10符単位へ切り上げます。",
          "最初は頻出する30符・40符と、符計算を省略できる満貫以上を優先すると実戦で使いやすくなります。"
        ]
      },
      {
        heading: "5翻以上は満貫以上の名称を見る",
        paragraphs: [
          "5翻は満貫、6・7翻は跳満、8〜10翻は倍満、11・12翻は三倍満です。高翻数では符による細かな差を計算しません。",
          "問題を解いたら、答えだけでなく『子の3翻40符ロン』のように条件を声に出すと、点数表の位置と結びつきます。"
        ]
      }
    ],
    figures: [
      {
        title: "先に見る4つの条件",
        description: "牌姿だけでなく、親子とアガリ方をセットで確認します。",
        badges: ["翻", "符"],
        rows: [
          { label: "平和形", tiles: ["man1", "man2", "man3", "man4", "man5", "man6", "pin2", "pin3", "pin4", "sou4", "sou5", "sou6", "pin8", "pin8"], note: "門前か、ロンかツモかで符を確認します。" },
          { label: "七対子", tiles: ["man1", "man1", "man4", "man4", "pin2", "pin2", "pin7", "pin7", "sou3", "sou3", "sou8", "sou8", "ji1", "ji1"], note: "七対子は25符固定です。" }
        ]
      }
    ],
    commonMistakes: ["符と翻を数える前に親子を確認しない", "平和ツモを30符、七対子を30符として計算する", "満貫以上でも符を細かく計算し続ける"],
    practicalUse: "対局ではアガった直後に、役と翻、親子、ロンツモを短く確認します。迷った点数は早見表で照合し、同じ条件をトレーニングで繰り返すと申告が速くなります。",
    relatedArticles: [
      { href: "/rules/practical-score", label: "実戦でよく見る点数計算", description: "30符・40符と満貫以上の基本を整理します。" },
      { href: "/learn/guides/score-calculation-practice", label: "点数計算20問", description: "固定問題で条件の読み取り方を復習します。" }
    ],
    relatedTools: [
      { href: "/tools/score-table", label: "点数早見表", description: "符と翻から親子・ロンツモの点数を確認します。" },
      { href: "/tools", label: "点数計算ツール", description: "手牌と条件を入力し、役・符・支払いを計算します。" },
      { href: "/trainer/score-hard", label: "点数計算HARD", description: "基本問題に慣れたら高符・カンを含む問題へ進みます。" }
    ]
  },
  {
    slug: "score-hard",
    screenshot: { src: "/tool-screenshots/trainer-score-hard.jpg", alt: "点数計算HARDの手牌、暗カン、和了牌", width: 502, height: 418 },
    mode: "scoreQuizHard",
    category: "点数計算",
    title: "点数計算HARD",
    shortTitle: "点数計算 HARD",
    eyebrow: "ADVANCED SCORE TRAINING",
    description: "通常版を理解した人向けに、暗カン・高符・複雑な待ちを含む点数計算を練習します。",
    level: "上級者",
    focus: "高符や例外形でも計算手順を崩さない力",
    seoTitle: "麻雀 点数計算HARD | 高符・カンを含む難問トレーニング | 雀フォリオ",
    seoDescription: "通常の点数計算を理解した人向けに、暗カン、明カン、高符、待ち符を含む難しい牌姿を練習する麻雀トレーニングです。",
    skills: ["暗刻・明刻・カンの符を区別する", "70符以上の高符を計算する", "ロンとツモで変わる符を見落とさない"],
    strategyTitle: "HARD問題でも崩れない計算手順",
    strategy: [
      {
        heading: "通常版の手順を変えない",
        paragraphs: [
          "難しい牌姿でも、親子、ロンツモ、翻、符の順は同じです。暗カンが見えたからといって、先に符だけを計算し始めると条件を落としやすくなります。",
          "役とドラを数え、満貫以上が確定していれば細かな符計算を省略できます。"
        ]
      },
      {
        heading: "刻子とカンは明暗・中張牌・么九牌を分ける",
        paragraphs: [
          "同じ3枚・4枚でも、明刻より暗刻、中張牌より1・9・字牌の方が符が高くなります。カンは刻子よりさらに符が増えます。",
          "門前ロン10符、ツモ2符、待ち2符、役牌の雀頭2符も最後に足し、10符単位へ切り上げます。"
        ]
      }
    ],
    figures: [
      {
        title: "高符になる部分を見分ける",
        description: "同じ牌の組でも、公開状態と牌の種類で符が変わります。",
        badges: ["高符", "カン"],
        rows: [
          { label: "中張牌の明刻", tiles: ["man5", "man5", "man5"], note: "基本となる低い符の刻子です。" },
          { label: "么九牌の暗刻", tiles: ["ji1", "ji1", "ji1"], tone: "warning", note: "字牌の暗刻は符が大きくなります。" },
          { label: "暗カン", tiles: ["pin9", "pin9", "pin9", "pin9"], tone: "warning", note: "么九牌の暗カンは高符問題の中心になります。" }
        ]
      }
    ],
    commonMistakes: ["暗カンを暗刻と同じ符で数える", "ロンでは門前ロン10符、ツモではツモ2符という違いを落とす", "合計符を10符単位へ切り上げる前に点数表を見る"],
    practicalUse: "競技麻雀や点数申告では、珍しい高符形でも落ち着いて内訳を示せることが重要です。通常版で30符・40符を安定させてから取り組み、間違えた問題はどの符を落としたかまで確認します。",
    relatedArticles: [
      { href: "/rules/practical-score", label: "点数計算の基本", description: "HARDの前に通常の計算順を確認します。" },
      { href: "/rules/yaku", label: "麻雀役一覧", description: "翻数が曖昧な役を一覧で確認します。" }
    ],
    relatedTools: [
      { href: "/tools", label: "点数計算ツール", description: "難しい牌姿の役・翻・符の内訳を確認します。" },
      { href: "/tools/score-table", label: "点数早見表", description: "高符の親子・ロンツモの支払いを照合します。" },
      { href: "/trainer/score", label: "点数計算 基本", description: "通常問題へ戻って計算順を固めます。" }
    ]
  }
] as const;

export function getTrainerDefinition(slug: string): TrainerDefinition | undefined {
  return trainerDefinitions.find((definition) => definition.slug === slug);
}

export function getTrainerDefinitionByMode(mode: TrainerMode): TrainerDefinition {
  return trainerDefinitions.find((definition) => definition.mode === mode)!;
}

export const trainerPathByMode = Object.fromEntries(
  trainerDefinitions.map((definition) => [definition.mode, `/trainer/${definition.slug}`])
) as Record<TrainerMode, string>;
