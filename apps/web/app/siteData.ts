export type CardStatus = "available" | "comingSoon";

export type LinkTarget = {
  label: string;
  href?: string;
  status?: CardStatus;
};

export type RoadmapStep = {
  step: number;
  title: string;
  description: string;
  readHref: string;
  practice: LinkTarget;
};

export type TrainingItem = {
  title: string;
  difficulty: "入門" | "基本" | "中級" | "高難度";
  target: string;
  focus: string;
  href?: string;
  status: CardStatus;
};

export type ToolItem = {
  title: string;
  description: string;
  beginnerNote: string;
  href?: string;
  status: CardStatus;
};

export type RuleItem = {
  title: string;
  description: string;
  href?: string;
  status: CardStatus;
};

export type LearnQuiz = {
  question: string;
  choices: string[];
  answer: string;
  explanation: string;
};

export type LearnArticle = {
  slug: string;
  step: number;
  title: string;
  seoTitle: string;
  description: string;
  learnPoints: string[];
  body: string[];
  example: string;
  misconceptions: string[];
  quiz: LearnQuiz;
  relatedPractice: LinkTarget;
  relatedTool: LinkTarget;
};

export const trainerHref = "/trainer";

export const learnArticles: LearnArticle[] = [
  {
    slug: "what-is-mahjong",
    step: 1,
    title: "麻雀は何をするゲームか",
    seoTitle: "麻雀とは？初心者向けにゲームの目的をやさしく解説",
    description: "麻雀初心者向けに、麻雀が何をするゲームなのか、アガリを目指す基本だけに絞って説明します。",
    learnPoints: ["麻雀は牌を入れ替えるゲーム", "アガリ形と役をそろえる", "最初は点数より流れを優先する"],
    body: [
      "麻雀は、手元の牌を少しずつ入れ替えながら、アガリの形を作るゲームです。",
      "自分の番が来たら1枚引き、いらない牌を1枚捨てます。このくり返しで、手を完成に近づけます。",
      "細かい点数や難しい役は最初から覚えなくて大丈夫です。まずは「形を作る」「役を1つ用意する」ことを目標にしましょう。"
    ],
    example: "トランプの役作りに近い感覚です。手札を入れ替えながら、決まった組み合わせを目指します。",
    misconceptions: ["牌を全部覚えないと遊べない", "点数計算ができないと始められない", "アガリ形だけ作れば必ずアガれる"],
    quiz: {
      question: "麻雀で最初に目指すことはどれですか？",
      choices: ["点数を暗算する", "アガリの形と役をそろえる", "相手の牌を全部覚える"],
      answer: "アガリの形と役をそろえる",
      explanation: "初心者はまず、手を完成させる流れと、役が必要なことを覚えれば十分です。"
    },
    relatedPractice: { label: "練習メニューを見る", href: "/training" },
    relatedTool: { label: "受け入れ枚数チェッカーを使う", href: trainerHref }
  },
  {
    slug: "tiles",
    step: 2,
    title: "牌の種類を覚える",
    seoTitle: "麻雀牌の種類を初心者向けに解説",
    description: "萬子、筒子、索子、字牌の違いを、麻雀初心者にも分かる言葉で説明します。",
    learnPoints: ["数牌は3種類ある", "字牌は東南西北と白發中", "最初は見た目で分けられれば十分"],
    body: [
      "麻雀の牌は、大きく分けると数牌と字牌があります。",
      "数牌は、萬子、筒子、索子の3種類です。それぞれ1から9まであります。",
      "字牌は、東・南・西・北・白・發・中です。数字はありませんが、役に関係しやすい大事な牌です。"
    ],
    example: "「3萬」「3筒」「3索」は同じ3でも別の牌です。マークの種類まで見て区別します。",
    misconceptions: ["同じ数字なら全部同じ牌", "字牌は使い道が少ない", "牌の正式名を全部暗記しないと進めない"],
    quiz: {
      question: "数牌に含まれる種類はどれですか？",
      choices: ["萬子・筒子・索子", "東・南・西", "白・發・中"],
      answer: "萬子・筒子・索子",
      explanation: "数牌は3種類あり、それぞれ1から9まであります。"
    },
    relatedPractice: { label: "牌を選ぶ練習へ", href: trainerHref },
    relatedTool: { label: "受け入れ枚数チェッカーを使う", href: trainerHref }
  },
  {
    slug: "draw-and-discard",
    step: 3,
    title: "ツモって捨てる流れを覚える",
    seoTitle: "麻雀のツモと捨て牌の流れを初心者向けに解説",
    description: "麻雀の基本動作である、1枚引いて1枚捨てる流れを初心者向けに説明します。",
    learnPoints: ["自分の番に1枚引く", "手牌から1枚捨てる", "手を完成に近づけるために選ぶ"],
    body: [
      "麻雀の基本は、自分の番に1枚引いて、手元から1枚捨てることです。",
      "引くことをツモ、捨てる牌を捨て牌と呼びます。",
      "どれを捨てるかで、次にアガリやすくなるかが変わります。最初は「仲間が少ない牌」や「使いにくそうな牌」を捨てる感覚で大丈夫です。"
    ],
    example: "手に1萬と9索がぽつんと1枚だけあるなら、ほかの牌とのつながりを見て、使いにくい方を捨てます。",
    misconceptions: ["引いた牌は必ず捨てる", "毎回正解を選ばないと負ける", "字牌は必ず最初に捨てる"],
    quiz: {
      question: "自分の番で基本的に行うことはどれですか？",
      choices: ["2枚引いて1枚捨てる", "1枚引いて1枚捨てる", "手牌を全部入れ替える"],
      answer: "1枚引いて1枚捨てる",
      explanation: "麻雀はこの基本動作をくり返して、手を完成に近づけます。"
    },
    relatedPractice: { label: "何切る問題を解く", href: trainerHref },
    relatedTool: { label: "受け入れ枚数チェッカーを使う", href: trainerHref }
  },
  {
    slug: "meld-and-pair",
    step: 4,
    title: "面子・雀頭を覚える",
    seoTitle: "麻雀の面子と雀頭とは？初心者向けに解説",
    description: "麻雀のアガリ形の土台になる面子と雀頭を、順子・刻子の例でやさしく説明します。",
    learnPoints: ["面子は3枚組", "雀頭は同じ牌2枚", "順子と刻子を見分ける"],
    body: [
      "面子は3枚でできる組み合わせです。代表的なものは、連続した数字の順子と、同じ牌3枚の刻子です。",
      "雀頭は同じ牌2枚の組み合わせです。頭とも呼ばれます。",
      "アガリ形を考えるときは、手牌を3枚組と2枚組に分けて見られるようになると楽になります。"
    ],
    example: "2・3・4萬は順子、東・東・東は刻子、白・白は雀頭です。",
    misconceptions: ["違う種類の2・3・4でも順子になる", "同じ牌2枚は面子である", "字牌でも順子が作れる"],
    quiz: {
      question: "雀頭とはどんな組み合わせですか？",
      choices: ["同じ牌2枚", "連続した数字3枚", "同じ牌4枚"],
      answer: "同じ牌2枚",
      explanation: "雀頭はアガリ形に1組必要な、同じ牌2枚の組み合わせです。"
    },
    relatedPractice: { label: "7枚形 多面待ちを練習する", href: trainerHref },
    relatedTool: { label: "待ち判定ツール", status: "comingSoon" }
  },
  {
    slug: "winning-shape",
    step: 5,
    title: "4面子1雀頭を作るとアガリ形になる",
    seoTitle: "麻雀のアガリ形 4面子1雀頭を初心者向けに解説",
    description: "麻雀の基本的なアガリ形である4面子1雀頭を、初心者向けに短く説明します。",
    learnPoints: ["基本のアガリ形は4面子1雀頭", "合計14枚で完成する", "特殊な形は後回しでよい"],
    body: [
      "麻雀の基本的なアガリ形は、4つの面子と1つの雀頭です。",
      "面子は3枚組なので4つで12枚、雀頭は2枚なので、合計14枚になります。",
      "七対子など例外のアガリ形もありますが、最初は4面子1雀頭だけを覚えれば十分です。"
    ],
    example: "123萬、456萬、234筒、777索、白白のように、3枚組が4つと2枚組が1つあれば基本形です。",
    misconceptions: ["3枚組が5つ必要", "雀頭はなくてもよい", "例外形を先に覚えるべき"],
    quiz: {
      question: "基本のアガリ形に必要な雀頭はいくつですか？",
      choices: ["0組", "1組", "4組"],
      answer: "1組",
      explanation: "基本形は4面子1雀頭です。雀頭は同じ牌2枚の組です。"
    },
    relatedPractice: { label: "待ち当て問題を解く", href: trainerHref },
    relatedTool: { label: "待ち判定ツール", status: "comingSoon" }
  },
  {
    slug: "yaku-required",
    step: 6,
    title: "ただし役がないとアガれない",
    seoTitle: "麻雀は役が必要 初心者が最初に覚えるルール",
    description: "麻雀では形が完成しても役がないとアガれないことを、初心者向けに説明します。",
    learnPoints: ["形だけではアガれない", "役が1つ以上必要", "最初はよく使う役だけ覚える"],
    body: [
      "麻雀では、4面子1雀頭の形ができていても、それだけではアガれないことがあります。",
      "アガるには、役が1つ以上必要です。役は「この条件を満たしたらアガれる」という名前付きの条件です。",
      "最初から全部の役を覚える必要はありません。リーチ、タンヤオ、役牌の3つから始めましょう。"
    ],
    example: "きれいに4面子1雀頭ができていても、役が何もなければロンできません。",
    misconceptions: ["形が完成すれば必ずアガれる", "役を全部覚えないと遊べない", "鳴けばいつでも役がつく"],
    quiz: {
      question: "麻雀でアガるために、基本的に形以外で必要なものは何ですか？",
      choices: ["役", "ドラだけ", "同じ数字の牌"],
      answer: "役",
      explanation: "アガリ形に加えて、役が1つ以上必要です。"
    },
    relatedPractice: { label: "役判定クイズ", status: "comingSoon" },
    relatedTool: { label: "役一覧を見る", href: "/rules" }
  },
  {
    slug: "reach-tanyao-yakuhai",
    step: 7,
    title: "リーチ・タンヤオ・役牌を覚える",
    seoTitle: "麻雀初心者が最初に覚える役 リーチ・タンヤオ・役牌",
    description: "麻雀初心者が最初に覚えたいリーチ、タンヤオ、役牌の条件をやさしく説明します。",
    learnPoints: ["リーチは鳴いていないテンパイで使う", "タンヤオは2から8だけで作る", "役牌は特定の字牌を3枚そろえる"],
    body: [
      "最初に覚える役は、リーチ、タンヤオ、役牌の3つで十分です。",
      "リーチは、鳴いていない状態でテンパイしたときに宣言できる役です。",
      "タンヤオは、1・9・字牌を使わず、2から8の数牌だけで作る役です。役牌は白・發・中や、自分の風、場の風を3枚そろえる役です。"
    ],
    example: "2から8だけで手ができていればタンヤオの可能性があります。白白白があれば役牌の可能性があります。",
    misconceptions: ["リーチは鳴いていてもできる", "タンヤオで1や9を使える", "字牌3枚ならどれでも必ず役牌になる"],
    quiz: {
      question: "タンヤオで使えない牌はどれですか？",
      choices: ["2萬", "5筒", "1索"],
      answer: "1索",
      explanation: "タンヤオは2から8の数牌だけで作る役なので、1・9・字牌は使えません。"
    },
    relatedPractice: { label: "役判定クイズ", status: "comingSoon" },
    relatedTool: { label: "役一覧を見る", href: "/rules" }
  },
  {
    slug: "tsumo-and-ron",
    step: 8,
    title: "ツモ・ロンを覚える",
    seoTitle: "麻雀のツモとロンの違いを初心者向けに解説",
    description: "自分で引いてアガるツモと、相手の捨て牌でアガるロンの違いを説明します。",
    learnPoints: ["ツモは自分で引いてアガる", "ロンは相手の捨て牌でアガる", "支払い方が変わる"],
    body: [
      "ツモは、自分で引いた牌でアガることです。",
      "ロンは、相手が捨てた牌でアガることです。",
      "点数の支払い方は違いますが、初心者のうちは「自分で引いたらツモ、相手の捨て牌ならロン」と覚えれば大丈夫です。"
    ],
    example: "待っていた5筒を自分で引いたらツモ。相手が5筒を捨てて、それでアガれるならロンです。",
    misconceptions: ["ツモもロンも同じ言葉", "ロンは自分の引いた牌で言う", "ツモは役がなくてもアガれる"],
    quiz: {
      question: "相手の捨て牌でアガることを何と呼びますか？",
      choices: ["ツモ", "ロン", "テンパイ"],
      answer: "ロン",
      explanation: "ロンは、相手が捨てた牌でアガることです。"
    },
    relatedPractice: { label: "待ち当て問題を解く", href: trainerHref },
    relatedTool: { label: "点数計算ツールを使う", href: trainerHref }
  },
  {
    slug: "calling",
    step: 9,
    title: "鳴きは役があるときだけ使う",
    seoTitle: "麻雀の鳴きとは？初心者向けに注意点を解説",
    description: "チー、ポン、カンの基本と、初心者が鳴く前に確認したい役の考え方を説明します。",
    learnPoints: ["鳴くと相手の牌を使える", "鳴くとリーチできない", "役が残るか確認する"],
    body: [
      "鳴きは、相手が捨てた牌をもらって面子を作る行動です。チー、ポン、カンがあります。",
      "鳴くと手は早く進みますが、リーチができなくなります。",
      "初心者は、鳴いたあとも役が残るかを確認してから鳴くのがおすすめです。タンヤオや役牌があるときは分かりやすいです。"
    ],
    example: "白白を持っていて、相手が白を捨てたらポンして白白白にできます。これは役牌になる可能性があります。",
    misconceptions: ["鳴くほど必ず強い", "鳴いてもリーチできる", "役がなくても鳴けばアガれる"],
    quiz: {
      question: "鳴いたあとにできなくなる代表的な役はどれですか？",
      choices: ["リーチ", "役牌", "タンヤオ"],
      answer: "リーチ",
      explanation: "リーチは鳴いていない状態でテンパイしたときに宣言できます。"
    },
    relatedPractice: { label: "役判定クイズ", status: "comingSoon" },
    relatedTool: { label: "役一覧を見る", href: "/rules" }
  },
  {
    slug: "tenpai-and-wait",
    step: 10,
    title: "テンパイ・待ちを覚える",
    seoTitle: "麻雀のテンパイとは？待ちの意味を初心者向けに解説",
    description: "あと1枚でアガれるテンパイと、アガリ牌である待ちについて初心者向けに説明します。",
    learnPoints: ["テンパイはあと1枚でアガれる状態", "待ちはアガリに必要な牌", "待ちを見つけるとロンやツモが分かる"],
    body: [
      "テンパイは、あと1枚でアガれる状態です。",
      "そのあと1枚にあたる牌を、待ちと呼びます。",
      "待ちが分かると、相手の捨て牌でロンできるか、自分で引いたときにツモできるかが判断しやすくなります。"
    ],
    example: "2萬と3萬を持っていると、1萬か4萬が来れば順子になります。このように複数の待ちがあることもあります。",
    misconceptions: ["テンパイはすでにアガっている状態", "待ちは必ず1種類だけ", "待ちがあれば役なしでもアガれる"],
    quiz: {
      question: "テンパイとはどんな状態ですか？",
      choices: ["あと1枚でアガれる状態", "点数計算が終わった状態", "鳴いた状態"],
      answer: "あと1枚でアガれる状態",
      explanation: "テンパイになったら、どの牌でアガれるかを考えます。"
    },
    relatedPractice: { label: "待ち当て問題を解く", href: trainerHref },
    relatedTool: { label: "待ち判定ツール", status: "comingSoon" }
  },
  {
    slug: "basic-nanikiru",
    step: 11,
    title: "簡単な何切る・受け入れに進む",
    seoTitle: "麻雀の何切るとは？初心者向けに受け入れを解説",
    description: "初心者向けに、何切る問題と受け入れ枚数の考え方を短く説明します。",
    learnPoints: ["何切るは捨てる牌を選ぶ練習", "受け入れは次にうれしい牌", "最初は広くなる選択を比べる"],
    body: [
      "何切るは、手牌からどの牌を捨てるかを考える練習です。",
      "受け入れは、そのあと引くとうれしい牌の種類や枚数のことです。",
      "初心者は、完璧な正解を探すより、どれを切ると次に進みやすいかを比べるところから始めましょう。"
    ],
    example: "3萬4萬があると2萬や5萬がうれしい牌になります。つながりがある牌を残すと、受け入れが広がりやすくなります。",
    misconceptions: ["何切るには必ず1つだけ正解がある", "字牌は必ず全部残す", "受け入れ枚数だけで毎回決めればよい"],
    quiz: {
      question: "受け入れとは何を表す言葉ですか？",
      choices: ["次に引くとうれしい牌", "相手が捨てた牌", "点数の合計"],
      answer: "次に引くとうれしい牌",
      explanation: "受け入れが広いほど、次に手が進む牌が多いという意味になります。"
    },
    relatedPractice: { label: "何切る問題を解く", href: trainerHref },
    relatedTool: { label: "受け入れ枚数チェッカーを使う", href: trainerHref }
  },
  {
    slug: "score-later",
    step: 12,
    title: "点数計算は後回し",
    seoTitle: "麻雀の点数計算は初心者なら後回しでOK",
    description: "麻雀初心者が点数計算を後回しにしてよい理由と、最初に知っておく範囲を説明します。",
    learnPoints: ["最初は点数を完璧にしなくてよい", "まずは役とアガリを優先する", "慣れたらツールで確認する"],
    body: [
      "点数計算は麻雀の中でも難しい部分です。最初から完璧に覚える必要はありません。",
      "まずは、アガリ形を作ること、役があること、ツモとロンを区別することを優先しましょう。",
      "慣れてきたら、点数計算ツールで条件を変えながら確認すると、少しずつ感覚がつかめます。"
    ],
    example: "最初は「満貫は大きい点数」「親のアガリは高い」くらいの理解でも遊び始められます。",
    misconceptions: ["点数計算できないと麻雀を始められない", "符計算を最初に覚えるべき", "役より点数を先に覚えるべき"],
    quiz: {
      question: "初心者が点数計算より先に覚えたいことはどれですか？",
      choices: ["符の細かい内訳", "役とアガリの基本", "全役の翻数"],
      answer: "役とアガリの基本",
      explanation: "まず遊べるようになるには、形・役・ツモロンの理解が先です。点数は後からで大丈夫です。"
    },
    relatedPractice: { label: "点数計算トレーニング", status: "comingSoon" },
    relatedTool: { label: "点数計算ツールを使う", href: trainerHref }
  }
];

export const roadmapSteps: RoadmapStep[] = learnArticles.map((article) => ({
  step: article.step,
  title: article.title,
  description: article.description,
  readHref: `/learn/${article.slug}`,
  practice: article.relatedPractice.href
    ? { label: article.relatedPractice.label, href: article.relatedPractice.href }
    : { label: article.relatedPractice.label, href: "/training", status: "comingSoon" }
}));

export const trainingItems: TrainingItem[] = [
  {
    title: "何切る問題",
    difficulty: "基本",
    target: "牌効率を覚えはじめた人",
    focus: "どの牌を切ると受け入れが広いか",
    href: trainerHref,
    status: "available"
  },
  {
    title: "何切る 高難易度",
    difficulty: "高難度",
    target: "基本問題に慣れた人",
    focus: "複雑な形の比較と判断速度",
    href: trainerHref,
    status: "available"
  },
  {
    title: "待ち当て 基本",
    difficulty: "基本",
    target: "テンパイと待ちを覚えたい人",
    focus: "基本形の待ちの見つけ方",
    href: trainerHref,
    status: "available"
  },
  {
    title: "7枚形 多面待ち",
    difficulty: "中級",
    target: "待ちのパターンを増やしたい人",
    focus: "多面待ちの形を見抜く力",
    href: trainerHref,
    status: "available"
  },
  {
    title: "清一色 待ち当て",
    difficulty: "高難度",
    target: "一色手の待ちが苦手な人",
    focus: "清一色の複雑な待ち",
    href: trainerHref,
    status: "available"
  },
  {
    title: "役判定クイズ",
    difficulty: "入門",
    target: "役を覚え始めた人",
    focus: "アガれる役があるかの判断",
    status: "comingSoon"
  },
  {
    title: "点数計算トレーニング",
    difficulty: "中級",
    target: "点数申告に慣れたい人",
    focus: "条件から点数を出す練習",
    status: "comingSoon"
  }
];

export const toolItems: ToolItem[] = [
  {
    title: "点数計算ツール",
    description: "手牌と条件を入れて、ロン・ツモの支払いを確認できます。",
    beginnerNote: "最初はリーチ、ツモ、親か子かだけを変えて試すと覚えやすいです。",
    href: trainerHref,
    status: "available"
  },
  {
    title: "符計算サポート",
    description: "符の内訳を見ながら点数計算を確認するための補助ツールです。",
    beginnerNote: "符は後回しで大丈夫。点数に慣れてから使う想定です。",
    status: "comingSoon"
  },
  {
    title: "待ち判定ツール",
    description: "テンパイ形から、どの牌でアガれるかを確認できます。",
    beginnerNote: "待ち当て問題で迷った形を復習する入口です。",
    status: "comingSoon"
  },
  {
    title: "受け入れ枚数チェッカー",
    description: "何を切ると次に進める牌が多いかを比較できます。",
    beginnerNote: "何切るの答え合わせに使うと、理由まで理解しやすくなります。",
    href: trainerHref,
    status: "available"
  },
  {
    title: "役一覧",
    description: "よく使う役から順番に確認できる一覧ページです。",
    beginnerNote: "まずはリーチ、タンヤオ、役牌だけで問題ありません。",
    href: "/rules",
    status: "available"
  },
  {
    title: "初心者向け点数表",
    description: "細かい計算をする前に、よく出る点数を確認できます。",
    beginnerNote: "満貫、親満、子のロンなど、実戦で出やすい形から覚えます。",
    status: "comingSoon"
  }
];

export const ruleItems: RuleItem[] = [
  {
    title: "麻雀の基本ルール",
    description: "ツモって捨てる流れ、アガリ形、局の進み方をまとめる予定です。",
    href: "/learn/what-is-mahjong",
    status: "available"
  },
  {
    title: "役一覧",
    description: "初心者が先に覚えたい役から順番に整理する予定です。",
    status: "comingSoon"
  },
  {
    title: "リーチ",
    description: "門前テンパイで宣言できる、最初に覚えたい役です。",
    href: "/learn/reach-tanyao-yakuhai",
    status: "available"
  },
  {
    title: "タンヤオ",
    description: "2から8の数牌だけで作る、使いやすい基本役です。",
    href: "/learn/reach-tanyao-yakuhai",
    status: "available"
  },
  {
    title: "役牌",
    description: "三元牌や自風・場風を3枚そろえる役です。",
    href: "/learn/reach-tanyao-yakuhai",
    status: "available"
  },
  {
    title: "ツモとロン",
    description: "自分で引くアガリと、相手の捨て牌でアガる違いを解説します。",
    href: "/learn/tsumo-and-ron",
    status: "available"
  },
  {
    title: "鳴き",
    description: "チー・ポン・カンの使いどころと注意点をまとめます。",
    href: "/learn/calling",
    status: "available"
  },
  {
    title: "テンパイと待ち",
    description: "あと1枚の状態と、待ち牌の探し方を解説します。",
    href: "/learn/tenpai-and-wait",
    status: "available"
  },
  {
    title: "点数計算",
    description: "翻、符、親子、ロン・ツモの基本を少しずつ学べる入口です。",
    href: "/learn/score-later",
    status: "available"
  },
  {
    title: "符計算",
    description: "符の考え方を、初心者がつまずきやすい順に整理します。",
    status: "comingSoon"
  }
];

export function getLearnArticle(slug: string): LearnArticle | undefined {
  return learnArticles.find((article) => article.slug === slug);
}

export function getAdjacentLearnArticles(slug: string) {
  const index = learnArticles.findIndex((article) => article.slug === slug);
  return {
    previous: index > 0 ? learnArticles[index - 1] : undefined,
    next: index >= 0 && index < learnArticles.length - 1 ? learnArticles[index + 1] : undefined
  };
}
