export type VideoLessonBook = "clear-basic" | "clear-nanikiru" | "hirasawa-defense" | "hirasawa-efficiency";

export type VideoLessonLink = {
  href: string;
  label: string;
};

export type VideoLessonPoint = {
  title: string;
  description: string;
};

export type VideoLessonGuide = {
  title: string;
  description: string;
  focus: string;
  level: string;
  category: string;
  dateLabel: string;
  readingTime: string;
  relatedHref: string;
  relatedLabel: string;
  articleHref: string;
  youtubeId: string;
  publisher: string;
};

export type VideoLesson = {
  slug: string;
  guide: Omit<VideoLessonGuide, "articleHref">;
  youtubeTitle: string;
  videoDuration: string;
  lead: string;
  recommendedFor: string[];
  watchPoints: VideoLessonPoint[];
  overview: string[];
  keyPoints: VideoLessonPoint[];
  practicalPoints: string[];
  relatedLinks: VideoLessonLink[];
  nextLinks: VideoLessonLink[];
  book?: VideoLessonBook;
};

export const addedVideoLessons = {
  betaoriPractice: {
    slug: "betaori-practice-ten-questions",
    guide: {
      title: "ベタオリ実戦問題10問｜安全牌を正しく選べる？",
      description: "スジ・カベ・現物を覚えた後に、実際の手牌からより安全な牌を選ぶ手順を10問で確認する動画です。",
      focus: "正解だけを覚えず、現物、見えている枚数、待ちの種類を順に比べる判断過程に注目です。",
      level: "守備の基本を覚えた初心者",
      category: "守備・ベタオリ問題",
      dateLabel: "2026年4月18日",
      readingTime: "約8分で読める",
      relatedHref: "/videos/strategy/betaori-three-principles",
      relatedLabel: "ベタオリの基本を復習する",
      youtubeId: "lS3gls6NlTA",
      publisher: "クリアレインのアトリエ【麻雀解説】"
    },
    youtubeTitle: "【麻雀】初心者が絶対に間違えてはいけないベタオリ問題【全10問】",
    videoDuration: "16分03秒",
    lead: "守備の用語を知っていても、複数の候補から実際に一枚を選ぶ場面では迷いがちです。動画を止めて理由まで考え、知識を実戦判断へつなげます。",
    recommendedFor: ["現物・スジ・カベを一通り覚えた人", "安全牌の候補が複数あると迷う人", "ベタオリ問題で守備力を確認したい人"],
    watchPoints: [
      { title: "切る前に候補を並べる", description: "最初に現物があるかを確認し、その後に比較材料を増やします。" },
      { title: "安全と比較的安全を分ける", description: "スジやカベを現物と同じ確定情報として扱わないことが大切です。" },
      { title: "理由を言葉にする", description: "答え合わせでは、選んだ牌より判断の順番に注目します。" }
    ],
    overview: ["この動画は、ベタオリ時の安全牌選びを全10問の問題形式で確認する教材です。記事では各問の答えを転載せず、動画を見る前後に使える判断手順を整理します。", "一問ごとに動画を止め、自分なら何を切るか、その牌がほかの候補より安全だと考えた根拠まで決めてから再生すると効果的です。"],
    keyPoints: [
      { title: "現物を最初に探す", description: "ロンされないことが確定している牌が手元にあるかを先に確認します。" },
      { title: "見えている情報を足す", description: "スジ、カベ、同じ牌の見え枚数を使い、候補の危険度を比較します。" },
      { title: "次巡まで考える", description: "一枚だけ通すのではなく、降り切るための安全牌が何枚残るかも見ます。" }
    ],
    practicalPoints: ["相手のリーチ後は、まず現物を声に出さず頭の中で列挙する", "スジ・カベは安全牌ではなく比較材料として使う", "答えが外れた問題は、見落とした情報を一つだけメモする"],
    relatedLinks: [
      { href: "/videos/strategy/suji-kabe-defense-basics", label: "安牌がないときに使うスジとカベの基本" },
      { href: "/videos/strategy/betaori-three-principles", label: "オリ打ちを減らすベタオリの重要な考え方3選" }
    ],
    nextLinks: [
      { href: "/videos/strategy/push-fold-judgment-ten-questions", label: "押し引き判断問題10問へ進む" },
      { href: "/videos/strategy/betaori-risk-test-intermediate", label: "中級ベタオリ危険度テストへ進む" }
    ],
    book: "clear-basic"
  },
  pushFoldQuiz: {
    slug: "push-fold-judgment-ten-questions",
    guide: {
      title: "押す？降りる？押し引き判断問題10問",
      description: "手牌価値、待ち、巡目、相手の攻撃を合わせて、押すか降りるかを10問で考える実戦判断動画です。",
      focus: "危険牌かどうかだけでなく、自分の打点やアガリやすさを含めて判断する点に注目です。",
      level: "守備から押し引きへ進む人",
      category: "守備・押し引き問題",
      dateLabel: "2026年4月25日",
      readingTime: "約8分で読める",
      relatedHref: "/videos/strategy/betaori-practice-ten-questions",
      relatedLabel: "ベタオリ問題を先に解く",
      youtubeId: "J1GvTYpcUIA",
      publisher: "クリアレインのアトリエ【麻雀解説】"
    },
    youtubeTitle: "【麻雀】初心者が絶対に間違えてはいけない押し引き判断問題【全10問】",
    videoDuration: "12分18秒",
    lead: "押し引きは、危険牌を知るだけでは決まりません。自分の手がどれだけアガリに近く価値があるかを相手の攻撃と比べる入口を、問題形式で確認します。",
    recommendedFor: ["ベタオリはできるが降りすぎてしまう人", "テンパイすると何でも押してしまう人", "巡目や打点を判断に加えたい人"],
    watchPoints: [
      { title: "自分の手牌価値を見る", description: "シャンテン数、待ち、打点を先に整理してから危険度を比べます。" },
      { title: "相手の攻撃をそろえて見る", description: "リーチか副露か、巡目や打点の手掛かりがあるかを確認します。" },
      { title: "二択に急がない", description: "押す・降りるの間に、比較的安全な牌で進める選択がないかも見ます。" }
    ],
    overview: ["全10問を通して、押し引き判断に必要な情報の集め方を確認できます。記事では正解を並べず、動画を解くときのチェック項目に絞ります。", "毎問、自分の手牌、相手の状況、局面の順に理由を作ってから答えを見ると、結果だけに引っ張られにくくなります。"],
    keyPoints: [
      { title: "手牌価値", description: "テンパイか、待ちは良いか、打点があるかを確認します。" },
      { title: "危険度", description: "切る候補が相手にどれくらい当たり得るかを比較します。" },
      { title: "局面", description: "巡目、点数状況、親か子かで必要なリスクは変わります。" }
    ],
    practicalPoints: ["押す理由と降りる理由を一つずつ挙げてから決める", "テンパイという事実だけで押さず、待ちと打点を見る", "迷った問題は、どの情報があれば判断が変わるか考える"],
    relatedLinks: [
      { href: "/videos/strategy/betaori-practice-ten-questions", label: "ベタオリ実戦問題10問" },
      { href: "/videos/strategy/betaori-priority-order", label: "ベタオリで切る牌の優先順位" }
    ],
    nextLinks: [
      { href: "/videos/strategy/betaori-risk-test-intermediate", label: "守備力中級レベルのテストへ" },
      { href: "/videos/strategy/mawashi-uchi-counterattack", label: "回し打ちで反撃する考え方へ" }
    ],
    book: "clear-basic"
  },
  riichiQuiz: {
    slug: "riichi-judgment-ten-questions",
    guide: {
      title: "リーチ判断問題10問｜リーチとダマを考える入口",
      description: "テンパイした後に、待ち・打点・手変わりなどを見てリーチするかを10問で考える初心者向け動画です。",
      focus: "テンパイしたら自動的にリーチせず、宣言するメリットと残す選択を比べる点に注目です。",
      level: "テンパイと待ちを覚えた初心者",
      category: "実戦判断・リーチ問題",
      dateLabel: "2026年5月2日",
      readingTime: "約8分で読める",
      relatedHref: "/videos/strategy/multi-sided-waits-23-patterns",
      relatedLabel: "多面待ちを先に確認する",
      youtubeId: "4mMG9TKG_vI",
      publisher: "クリアレインのアトリエ【麻雀解説】"
    },
    youtubeTitle: "【麻雀】初心者が絶対に間違えてはいけないリーチ判断問題【全10問】",
    videoDuration: "15分17秒",
    lead: "リーチは強力ですが、テンパイしたすべての手で同じ結論になるわけではありません。問題を解きながら、宣言前に見る情報を増やします。",
    recommendedFor: ["テンパイするとすぐリーチボタンを押す人", "リーチとダマの違いを実戦で考えたい人", "待ちや打点を判断材料にしたい人"],
    watchPoints: [
      { title: "待ちを確認する", description: "良形か愚形か、残り枚数をどう見積もるかに注目します。" },
      { title: "打点の変化を見る", description: "リーチによる得点上昇と、ダマでもアガれる条件を分けます。" },
      { title: "手変わりを比べる", description: "待ちや打点が良くなる変化を待つ価値があるかを考えます。" }
    ],
    overview: ["この動画は、リーチ判断を全10問で確認する問題形式の教材です。記事では各問の正解を公開せず、判断を組み立てる入口をまとめます。", "動画を止めたら、リーチの利点、ダマの利点、結論を一つずつ言葉にしてから答えを確認してみましょう。"],
    keyPoints: [
      { title: "アガリやすさ", description: "待ちの種類や場に見えている牌から、アガリまでの距離を考えます。" },
      { title: "打点", description: "リーチで増える価値と、現在すでにある役・ドラを比べます。" },
      { title: "局面", description: "巡目や点数状況によって、速度と打点の優先度は変わります。" }
    ],
    practicalPoints: ["リーチボタンが出ても、待ちと打点を確認してから押す", "ダマを選ぶときは、何を待って手を変えるのか決める", "結果ではなく宣言時点で見えていた情報で振り返る"],
    relatedLinks: [
      { href: "/videos/strategy/multi-sided-waits-23-patterns", label: "初級者が覚えたい多面待ち23選" },
      { href: "/rules/practical-waits", label: "実戦でよく見る待ちを牌図で確認する" }
    ],
    nextLinks: [
      { href: "/trainer", label: "待ち当て問題で形を確認する" },
      { href: "/videos/strategy/beginner-win-chance-basics", label: "初心者が覚えたいリーチの基本へ" }
    ],
    book: "clear-basic"
  },
  clearRainBadHand: {
    slug: "playing-bad-starting-hands",
    guide: {
      title: "配牌やツモが悪いときの手組み｜局へどう参加する？",
      description: "配牌やツモに恵まれない局で、速度だけに頼らず手牌価値と安全度を整える考え方を学ぶ動画です。",
      focus: "最速テンパイ以外に、安全牌、局への参加度、手牌価値をどう残すかに注目です。",
      level: "牌効率の基本を覚えた人",
      category: "実戦判断・悪配牌",
      dateLabel: "2026年6月6日",
      readingTime: "約8分で読める",
      relatedHref: "/videos/strategy/playing-weak-starting-hands",
      relatedLabel: "別の解説で悪配牌を学ぶ",
      youtubeId: "QVTVQFaLTtA",
      publisher: "クリアレインのアトリエ【麻雀解説】"
    },
    youtubeTitle: "【麻雀】配牌やツモが悪いのに勝てる人のズルい打ち方",
    videoDuration: "13分57秒",
    lead: "毎局アガリに向かえる配牌が来るわけではありません。悪い配牌を無理に最速で進めるのではなく、局の中でどんな価値を残すかを考える教材です。",
    recommendedFor: ["配牌が悪いとすぐ諦めてしまう人", "遠い手でも受け入れ枚数だけを追ってしまう人", "安全牌や手役を含めた手組みへ進みたい人"],
    watchPoints: [
      { title: "局への参加度", description: "アガリだけでなく、鳴きや守備を含めてどこまで局に関わるかを見ます。" },
      { title: "手牌価値", description: "速度が遅いときほど、打点や手役の見込みを確認します。" },
      { title: "安全度", description: "将来の他家の攻撃に備え、手元に残す牌の役割を考えます。" }
    ],
    overview: ["悪配牌の局では、受け入れ最大の一打がそのまま最善になるとは限りません。動画を通して、速度以外の価値をどう手牌へ残すかを考えます。", "記事では個別の手順を再現せず、視聴中に確認したい観点と、見終えた後の振り返り方を整理します。"],
    keyPoints: [
      { title: "アガリまでの距離", description: "現在のシャンテン数と、使いやすいブロックがいくつあるかを見ます。" },
      { title: "変化の方向", description: "手役や打点へ伸びる牌と、守備に使える牌を区別します。" },
      { title: "他家との関係", description: "自分だけでなく、先行している相手の速度も判断材料にします。" }
    ],
    practicalPoints: ["悪配牌では、最初に完成までの距離を把握する", "速度を失うなら、打点・守備・鳴きやすさのどれを得るか決める", "アガれなかった局も、不要な放銃を避けられたかまで振り返る"],
    relatedLinks: [
      { href: "/videos/strategy/playing-weak-starting-hands", label: "上級者が考える配牌が悪いときの打ち方" },
      { href: "/videos/strategy/safe-tile-and-floating-tile-decisions", label: "安牌と孤立牌の考え方" }
    ],
    nextLinks: [
      { href: "/videos/strategy/when-not-to-follow-tile-efficiency", label: "牌効率通りに打たない判断へ" },
      { href: "/analysis/starting-hand", label: "配牌から狙いやすい方針を比べる" }
    ],
    book: "clear-basic"
  },
  multiSidedWaits: {
    slug: "multi-sided-waits-23-patterns",
    guide: {
      title: "初級者が覚えたい多面待ち23選｜アガリ牌を逃さない",
      description: "複数のアガリ牌が生まれる代表的な多面待ちを知り、テンパイ時に待ちを見落とさないための動画です。",
      focus: "形を丸暗記するだけでなく、順子と雀頭の分け方を変えて待ちを探す点に注目です。",
      level: "基本の待ちを覚えた初心者",
      category: "牌効率・多面待ち",
      dateLabel: "2026年6月13日",
      readingTime: "約9分で読める",
      relatedHref: "/rules/practical-waits",
      relatedLabel: "待ちの形を牌図で復習する",
      youtubeId: "Pc6M8jcyW-Y",
      publisher: "クリアレインのアトリエ【麻雀解説】"
    },
    youtubeTitle: "【麻雀】知らないとあがりを逃す！初級者が絶対に覚えるべき多面待ち【23選】",
    videoDuration: "12分38秒",
    lead: "多面待ちは、同じ牌の並びを一通りにしか分けないと見落とします。代表形を動画で確認し、順子と雀頭を組み替えてアガリ牌を探す習慣を作ります。",
    recommendedFor: ["両面・カンチャン・シャンポンは分かる人", "テンパイしたのに待ちを一部見落とす人", "清一色待ち当てへ進みたい人"],
    watchPoints: [
      { title: "形を分け直す", description: "左から一度だけ区切らず、雀頭の候補を変えて見ます。" },
      { title: "端の牌まで確認する", description: "中央の両面だけでなく、離れた牌が待ちに加わらないか探します。" },
      { title: "実際の残り枚数を見る", description: "待ちの種類と、場に見えている枚数を分けて考えます。" }
    ],
    overview: ["動画では、初級者が覚えておきたい多面待ちを23パターンで確認できます。記事側では全パターンを複製せず、待ちを探すための見方を補助します。", "一つの形を見たら動画を止め、アガリ牌をすべて挙げてから解説を見ると、待ち判定の速度を鍛えられます。"],
    keyPoints: [
      { title: "雀頭候補を変える", description: "同じ2枚を雀頭と決めつけず、別の分解を試します。" },
      { title: "順子の取り方を変える", description: "長く連なった数牌は、始点をずらして順子を作り直します。" },
      { title: "待ちを一覧にする", description: "見つけた牌を頭の中で並べ、重複や見落としを確認します。" }
    ],
    practicalPoints: ["テンパイしたら、ロン表示に頼る前に待ちを予想する", "一色に牌が集まったら、雀頭候補をすべて試す", "動画視聴後は清一色待ち当てで別の形を練習する"],
    relatedLinks: [
      { href: "/rules/practical-waits", label: "実戦でよく見る待ちの形" },
      { href: "/videos/strategy/calling-to-improve-wait-quiz", label: "待ちを良くする何鳴く問題10問" }
    ],
    nextLinks: [
      { href: "/videos/strategy/riichi-judgment-ten-questions", label: "待ちを確認してリーチ判断問題へ" },
      { href: "/trainer", label: "清一色待ち当てを練習する" }
    ],
    book: "clear-nanikiru"
  },
  betaoriRiskTest: {
    slug: "betaori-risk-test-intermediate",
    guide: {
      title: "ベタオリ危険度判別テスト｜守備力の中級レベルを診断",
      description: "安全牌候補の危険度を比較し、ベタオリの知識を中級レベルで使えるか確認する診断動画です。",
      focus: "スジなどの名前だけで選ばず、当たり得る待ちと見えている情報を組み合わせる点に注目です。",
      level: "ベタオリを実戦で使っている人",
      category: "守備・ベタオリ問題",
      dateLabel: "2021年9月12日",
      readingTime: "約8分で読める",
      relatedHref: "/videos/strategy/betaori-practice-ten-questions",
      relatedLabel: "初心者向けベタオリ問題を解く",
      youtubeId: "DgkquRvSakg",
      publisher: "平澤元気麻雀ch"
    },
    youtubeTitle: "【麻雀講座】守備力中級レベルを診断するベタオリ危険度判別テスト",
    videoDuration: "12分43秒",
    lead: "守備知識を覚えた後は、複数の候補を同じ基準で比較できるかが重要です。中級レベルのテストで、曖昧な部分を見つけます。",
    recommendedFor: ["初心者向けベタオリ問題を解いた人", "スジ同士の比較で迷う人", "自分の守備の弱点を診断したい人"],
    watchPoints: [
      { title: "先に自分で順位をつける", description: "動画を進める前に、安全そうな順に候補を並べます。" },
      { title: "待ちの種類を数える", description: "どの候補が何種類の待ちに当たり得るかを考えます。" },
      { title: "苦手な条件を見つける", description: "点数よりも、判断を誤った理由を分類します。" }
    ],
    overview: ["中級者向けの危険度判別テストとして、ベタオリ時の候補比較を確認できます。記事では問題と正解を転載せず、受験前後の見方を整理します。", "全問の正解数だけで終わらせず、スジ、カベ、序盤の外側など、迷った分類を復習先として記録すると実戦へつながります。"],
    keyPoints: [
      { title: "確定情報", description: "現物や場に4枚見えている牌など、動かない情報を先に置きます。" },
      { title: "危険度の比較", description: "候補ごとに残る待ちの種類を比べます。" },
      { title: "降り切る手順", description: "次巡以降の安全牌枚数まで含めて順番を考えます。" }
    ],
    practicalPoints: ["各問で候補の安全順位まで決める", "間違えた問題は知識不足か見落としかを分ける", "実戦では一枚通った後の現物更新も忘れない"],
    relatedLinks: [
      { href: "/videos/strategy/betaori-practice-ten-questions", label: "ベタオリ実戦問題10問" },
      { href: "/videos/strategy/betaori-priority-order", label: "ベタオリで切る牌の優先順位" }
    ],
    nextLinks: [
      { href: "/videos/strategy/mawashi-uchi-counterattack", label: "回し打ちで反撃する考え方へ" },
      { href: "/videos/strategy/push-fold-judgment-ten-questions", label: "押し引き判断を復習する" }
    ],
    book: "hirasawa-defense"
  },
  blockStructureReading: {
    slug: "discard-block-structure-reading",
    guide: {
      title: "捨て牌のブロック構成読み｜相手の手牌をどう推測する？",
      description: "河の切り順から、相手がどのようなブロックを残したかを考える捨て牌読みの動画です。",
      focus: "待ちを断定せず、通常の手組みで残りやすい形と切られ方の違和感を比較する点に注目です。",
      level: "読みの基礎を覚えた中級者",
      category: "読み・ブロック構成",
      dateLabel: "2021年2月24日",
      readingTime: "約9分で読める",
      relatedHref: "/videos/strategy/discard-reading-fundamentals",
      relatedLabel: "捨て牌読みの入口を確認する",
      youtubeId: "n3bu_Y_thiM",
      publisher: "平澤元気麻雀ch"
    },
    youtubeTitle: "【麻雀講座】上級者はみんな意識している捨牌の読み方「ブロック構成読み」について解説",
    videoDuration: "20分50秒",
    lead: "スジやカベが牌の安全度を見る知識なのに対し、ブロック構成読みは河から相手の手牌進行を想像する考え方です。読みを断定ではなく比較に使います。",
    recommendedFor: ["捨て牌読みの基本的な目的を理解した人", "河を見ても安全牌以外の情報を拾えない人", "相手の手組みを推測する入口が欲しい人"],
    watchPoints: [
      { title: "普通の手順を想像する", description: "牌効率通りならどのブロックを残しやすいかを基準にします。" },
      { title: "切り順の違和感を見る", description: "早く切られた牌と後から切られた牌の役割の違いを考えます。" },
      { title: "候補を狭めすぎない", description: "一つの待ちを決め打ちせず、複数の構成を残します。" }
    ],
    overview: ["ブロック構成読みは、相手がどの面子候補を残して進めたかを河から考える方法です。安全牌探しとは目的を分け、相手の手牌像を粗く捉えるために使います。", "読みには例外があるため、動画を見るときは断定の技ではなく、可能性の高低を更新する考え方として受け取るのが大切です。"],
    keyPoints: [
      { title: "基準となる牌効率", description: "一般的な手組みを知るほど、河の不自然さを見つけやすくなります。" },
      { title: "手出しとツモ切り", description: "手牌から選ばれた牌かどうかは、推測の重みを変えます。" },
      { title: "ほかの情報との統合", description: "副露、ドラ、巡目と組み合わせて読みの確度を調整します。" }
    ],
    practicalPoints: ["一局につき一人だけ河の切り順を追う", "読んだ候補と実際の手牌を牌譜で比べる", "外れたときは例外だった理由を探し、読み自体を断定に変えない"],
    relatedLinks: [
      { href: "/videos/strategy/discard-reading-fundamentals", label: "捨て牌読みの根本的な考え方" },
      { href: "/videos/strategy/how-to-use-mahjong-reading", label: "読みを違和感と例外で考える" }
    ],
    nextLinks: [
      { href: "/videos/strategy/discard-reading-ten-question-test", label: "読み知識の総合10問へ" },
      { href: "/videos/strategy/reach-declaration-tile-reading", label: "リーチ宣言牌の読みへ" }
    ],
    book: "hirasawa-defense"
  },
  hirasawaBadHand: {
    slug: "playing-weak-starting-hands",
    guide: {
      title: "配牌が悪いときの打ち方｜上級者が残す手牌価値",
      description: "遠い配牌から、手役、鳴きやすさ、安全度を含めて手牌の方針を作る考え方を学ぶ動画です。",
      focus: "受け入れだけで手を進めず、その局で狙う価値と撤退しやすさを両立する点に注目です。",
      level: "牌効率の先を学ぶ中級者",
      category: "実戦判断・悪配牌",
      dateLabel: "2022年11月16日",
      readingTime: "約8分で読める",
      relatedHref: "/videos/strategy/playing-bad-starting-hands",
      relatedLabel: "別の解説で悪配牌を学ぶ",
      youtubeId: "VDaUVgKqFbk",
      publisher: "平澤元気麻雀ch"
    },
    youtubeTitle: "上級者だけが知っている配牌が悪いときの打ち方【麻雀講座】",
    videoDuration: "12分23秒",
    lead: "悪い配牌では、最短テンパイだけを追ってもアガリまで届かないことがあります。速度、打点、守備のどこに価値を残すかを考えます。",
    recommendedFor: ["遠い配牌の方針を決められない人", "配牌が悪いときに字牌から機械的に切る人", "手役と守備を含めた手組みを学びたい人"],
    watchPoints: [
      { title: "完成までの距離", description: "有効なブロック数とシャンテン数を確認します。" },
      { title: "残す価値の種類", description: "打点、鳴きやすさ、安全度のどれを得る選択かを見ます。" },
      { title: "方針の切り替え", description: "ツモや他家の動きによって、参加と撤退を変えるタイミングに注目します。" }
    ],
    overview: ["配牌が悪い局でも、手牌には打点候補、守備牌、鳴きやすい形など複数の役割があります。どれを残すか決めることで、ただ遅いだけの手牌から方針のある手牌へ変えます。", "同じ悪配牌テーマでも解説者によって整理の仕方は異なります。関連動画と見比べ、共通する観点と自分が使いやすい基準を探せます。"],
    keyPoints: [
      { title: "速度を測る", description: "アガリまで遠いなら、受け入れ一辺倒の価値は下がります。" },
      { title: "打点の種を探す", description: "役牌、染め手など、局へ参加する理由があるかを見ます。" },
      { title: "撤退余地を残す", description: "他家が先行したときに使える牌を持つ価値を考えます。" }
    ],
    practicalPoints: ["最初の数巡で、速度・打点・守備の優先順位を仮決めする", "ツモが方針に合わなければ固執せず更新する", "同テーマの2本を見比べ、自分の判断語彙を増やす"],
    relatedLinks: [
      { href: "/videos/strategy/playing-bad-starting-hands", label: "配牌やツモが悪いときの手組み" },
      { href: "/videos/strategy/safe-tile-and-floating-tile-decisions", label: "安牌と孤立牌の2基準" }
    ],
    nextLinks: [
      { href: "/videos/strategy/when-not-to-follow-tile-efficiency", label: "牌効率通りに打たない判断へ" },
      { href: "/analysis/starting-hand", label: "配牌の狙いを解析で比べる" }
    ],
    book: "hirasawa-efficiency"
  },
  mawashiUchi: {
    slug: "mawashi-uchi-counterattack",
    guide: {
      title: "回し打ちで反撃するコツ｜ベタオリの次の守備判断",
      description: "安全度を保ちながら手を進め、押し返せる形へ戻る回し打ちの考え方を学ぶ動画です。",
      focus: "押すか完全に降りるかの二択にせず、安全な手順と手牌復活の可能性を比べる点に注目です。",
      level: "押し引きの基礎を覚えた中級者",
      category: "守備・回し打ち",
      dateLabel: "2026年8月19日",
      readingTime: "約8分で読める",
      relatedHref: "/videos/strategy/push-fold-judgment-ten-questions",
      relatedLabel: "押し引き判断を先に確認する",
      youtubeId: "Y0R_YGQnB90",
      publisher: "平澤元気麻雀ch"
    },
    youtubeTitle: "思考停止でベタオリしていませんか？回し打ちで反撃するコツを解説",
    videoDuration: "14分55秒",
    lead: "回し打ちは、危険牌を避けながら手牌のアガリ可能性を残す選択です。完全に降りる場面との違いを意識し、反撃できる条件を学びます。",
    recommendedFor: ["ベタオリすると手をすべて壊してしまう人", "押すか降りるかの二択で考えている人", "安全度と手牌価値を同時に見たい人"],
    watchPoints: [
      { title: "安全な進行牌を探す", description: "通しやすく、同時に手牌を前へ進める牌があるかを見ます。" },
      { title: "復活条件を確認する", description: "どのツモなら押し返せる手になるかを具体的に考えます。" },
      { title: "完全撤退と分ける", description: "手牌価値が足りない局面では、回し打ちに固執しないことも大切です。" }
    ],
    overview: ["回し打ちは、放銃リスクを抑えつつアガリの可能性を残す中間的な選択です。安全牌を切るだけでなく、その後の手牌がどう変わるかまで見ます。", "記事では個別局面の正解を固定せず、動画を見るときに比較したい安全度、手牌価値、復活条件を整理します。"],
    keyPoints: [
      { title: "安全度", description: "まず今切る牌の危険度が許容できるかを確認します。" },
      { title: "手牌維持", description: "面子や好形を壊しすぎずに進められるかを見ます。" },
      { title: "反撃可能性", description: "次の有効牌でテンパイや押し返せる形になるかを考えます。" }
    ],
    practicalPoints: ["相手の攻撃を受けたら、押す・回す・降りるの3案を作る", "回し打ちを選ぶなら、押し返すツモを具体化する", "安全牌が尽きる前に、完全撤退へ切り替える条件も決める"],
    relatedLinks: [
      { href: "/videos/strategy/push-fold-judgment-ten-questions", label: "押し引き判断問題10問" },
      { href: "/videos/strategy/betaori-risk-test-intermediate", label: "ベタオリ危険度判別テスト" }
    ],
    nextLinks: [
      { href: "/trainer", label: "実戦問題で判断を試す" },
      { href: "/videos/strategy/advanced", label: "中級者向け動画を続けて見る" }
    ],
    book: "hirasawa-defense"
  },
  threeDimensionalNanikiru: {
    slug: "three-dimensional-nanikiru",
    guide: {
      title: "立体何切るとは？牌効率の次に覚えたい実戦判断",
      description: "自分の手牌だけでなく、巡目、河、安全牌、点数状況などを含めて打牌を考える立体何切るの動画です。",
      focus: "受け入れ最大を出発点にしながら、場に見える情報で一打の価値がどう変わるかに注目です。",
      level: "牌効率と何切るを学んだ中級者",
      category: "牌効率・立体何切る",
      dateLabel: "2025年4月16日",
      readingTime: "約9分で読める",
      relatedHref: "/videos/strategy/when-not-to-follow-tile-efficiency",
      relatedLabel: "牌効率通りに打たない条件を学ぶ",
      youtubeId: "bcsPq4REzHs",
      publisher: "発男道場【麻雀解説ch】"
    },
    youtubeTitle: "【麻雀解説】牌効率の次のステップ「立体何切る」のポイント・考え方",
    videoDuration: "9分49秒",
    lead: "平面的な何切るが手牌の形を比べる練習なら、立体何切るは卓上の情報まで含めて一打を考える練習です。牌効率を実戦判断へ広げます。",
    recommendedFor: ["牌理だけなら何切るを解ける人", "実戦になると正解が変わる理由を知りたい人", "場況・安全牌・点数状況を打牌へ加えたい人"],
    watchPoints: [
      { title: "基準の一打を作る", description: "まず手牌だけを見た牌効率上の候補を確認します。" },
      { title: "卓上情報で補正する", description: "巡目、見えている牌、河、安全度で候補の価値を動かします。" },
      { title: "局の目的を考える", description: "アガリ、形式テンパイ、失点回避など、その局で必要な結果を見ます。" }
    ],
    overview: ["立体何切るでは、手牌の受け入れだけでなく、場に見えている牌、巡目、安全牌、他家の河、最終形、鳴き、形式テンパイ、点数状況などを判断材料にします。", "すべてを一度に完璧に見るのではなく、牌効率上の基準を作ってから、局面に関係する情報を一つずつ加えると整理しやすくなります。"],
    keyPoints: [
      { title: "手牌の基準", description: "受け入れ、良形率、打点から候補を作ります。" },
      { title: "場況の補正", description: "見えている枚数や他家の河で有効牌の価値を見直します。" },
      { title: "局面の目的", description: "点数状況と巡目から、速度・打点・安全度の優先順位を決めます。" }
    ],
    practicalPoints: ["最初に手牌だけの候補を決め、その後に場況で変わるか確認する", "考慮した情報を増やしすぎず、結論を変えた要因を一つ特定する", "牌譜検討では受け入れ枚数と実戦上の目的を別々に振り返る"],
    relatedLinks: [
      { href: "/videos/strategy/intermediate-tile-efficiency-26-rules", label: "中級牌効率26のセオリー" },
      { href: "/videos/strategy/when-not-to-follow-tile-efficiency", label: "牌効率通りに打つ時・打たない時" }
    ],
    nextLinks: [
      { href: "/analysis/mahjong-tool", label: "牌理チェッカーで受け入れと良形率を比べる" },
      { href: "/videos/strategy/advanced", label: "中級者向け動画を続けて見る" }
    ]
  },
  tileEfficiencyExceptions: {
    slug: "when-not-to-follow-tile-efficiency",
    guide: {
      title: "牌効率通りに打つ時・打たない時｜受け入れMAXの先へ",
      description: "受け入れ枚数を基本にしつつ、最終形、打点、巡目、手役、守備力で別の一打を選ぶ考え方を学ぶ動画です。",
      focus: "受け入れMAXを否定するのではなく、どの条件がそろうと判断を変えるのかに注目です。",
      level: "牌効率の基本を使える中級者",
      category: "牌効率・実戦判断",
      dateLabel: "2025年11月12日",
      readingTime: "約9分で読める",
      relatedHref: "/videos/strategy/intermediate-tile-efficiency-26-rules",
      relatedLabel: "中級牌効率を先に確認する",
      youtubeId: "o3GBbZZHZVQ",
      publisher: "発男道場【麻雀解説ch】"
    },
    youtubeTitle: "【麻雀解説】めちゃくちゃ重要！牌効率通りに打つ時と打たない時",
    videoDuration: "15分14秒",
    lead: "受け入れ枚数は重要な基準ですが、それだけで実戦の一打が決まるわけではありません。基本を保ちながら、判断を変える条件を整理します。",
    recommendedFor: ["受け入れ最大の牌は選べる人", "牌理結果と実戦の選択が違うと混乱する人", "良形率・打点・守備を比較したい人"],
    watchPoints: [
      { title: "まず牌効率の基準を見る", description: "比較の出発点として、シャンテン数と受け入れを確認します。" },
      { title: "何を得る例外かを見る", description: "良形、打点、手役、安全度のどれを優先した選択かを分けます。" },
      { title: "条件を言語化する", description: "感覚で外すのではなく、結論を変えた情報に注目します。" }
    ],
    overview: ["牌効率通りに打つとは、テンパイまでの速度や受け入れを重要な基準にすることです。一方、実戦では最終形、良形率、打点、巡目、手役、場況、守備力が判断を変えることがあります。", "動画の主張を必要以上に広げず、記事では『受け入れ最大から外すなら、何を得るのか』という視聴時の問いを中心に置きます。"],
    keyPoints: [
      { title: "速度", description: "シャンテン数と受け入れ枚数がどれだけ変わるかを見ます。" },
      { title: "アガリの質", description: "最終待ちの良さや打点がどれだけ改善するかを比べます。" },
      { title: "局面への適合", description: "巡目、点数状況、守備力に合う選択かを確認します。" }
    ],
    practicalPoints: ["受け入れ最大の候補を必ず一度確認する", "別の牌を選ぶなら、速度と交換して得る価値を一つ言う", "牌理チェッカーでは枚数だけでなく良形率や打点変化も見る"],
    relatedLinks: [
      { href: "/videos/strategy/tile-efficiency-complete-beginner-guide", label: "麻雀初心者の牌効率・完全入門" },
      { href: "/videos/strategy/intermediate-tile-efficiency-26-rules", label: "中級牌効率26のセオリー" }
    ],
    nextLinks: [
      { href: "/videos/strategy/three-dimensional-nanikiru", label: "立体何切るへ進む" },
      { href: "/analysis/mahjong-tool", label: "牌理チェッカーで候補を比較する" }
    ]
  },
  readingQuiz: {
    slug: "discard-reading-ten-question-test",
    guide: {
      title: "捨て牌読み総合問題10問｜知識を実戦判断へ",
      description: "個別に覚えた捨て牌読みの知識を集め、全10問で使い分ける総合問題動画です。",
      focus: "一つの読みで断定せず、複数の手掛かりを組み合わせて可能性を比較する点に注目です。",
      level: "読みの個別知識を学んだ中級者",
      category: "読み・総合問題",
      dateLabel: "2026年2月11日",
      readingTime: "約9分で読める",
      relatedHref: "/videos/strategy/discard-block-structure-reading",
      relatedLabel: "ブロック構成読みを先に学ぶ",
      youtubeId: "zYXvGvfkHb8",
      publisher: "発男道場【麻雀解説ch】"
    },
    youtubeTitle: "【厳選10問】数々の読み知識を集約！これを見れば読みのレベルが格段に上がります",
    videoDuration: "19分40秒",
    lead: "読みの知識は、名前を覚えるだけでは実戦で使えません。全10問を通して、どの情報を拾い、どう重みづけするかを確認します。",
    recommendedFor: ["読みの基礎記事を一通り見た人", "知識はあるが実戦で使う順番が分からない人", "総合問題で読みの現在地を確認したい人"],
    watchPoints: [
      { title: "根拠を複数挙げる", description: "一つの手掛かりだけで結論を決めないようにします。" },
      { title: "確定と推測を分ける", description: "見えている情報と、そこから考えた可能性を区別します。" },
      { title: "判断への使い方を見る", description: "読んだ結果を押し引きや危険度比較へどうつなげるかに注目します。" }
    ],
    overview: ["この動画は、複数の読み知識を全10問で確認する総合問題です。記事を読むだけで答えが分からないよう、問題・牌姿・正解は転載していません。", "動画を止めて候補と根拠をメモし、答え合わせ後に『見落とした情報』『重く見すぎた情報』を一つずつ確認すると復習しやすくなります。"],
    keyPoints: [
      { title: "情報収集", description: "河、手出し・ツモ切り、副露、巡目から材料を集めます。" },
      { title: "仮説比較", description: "一つに断定せず、複数の手牌像を並べます。" },
      { title: "実戦判断", description: "読みの確度に応じて、押し引きや切る牌を調整します。" }
    ],
    practicalPoints: ["各問で結論より先に根拠を二つ挙げる", "正解した問題も偶然でないか説明し直す", "牌譜検討で相手の実際の手牌と自分の仮説を比べる"],
    relatedLinks: [
      { href: "/videos/strategy/discard-reading-fundamentals", label: "捨て牌読みの根本的な考え方" },
      { href: "/videos/strategy/discard-block-structure-reading", label: "ブロック構成読み" },
      { href: "/videos/strategy/calling-read-two-essential-patterns", label: "鳴き読み2つの重要パターン" }
    ],
    nextLinks: [
      { href: "/videos/strategy/advanced/calling-read", label: "鳴き読みの動画を続けて見る" },
      { href: "/trainer", label: "実戦問題で判断を試す" }
    ]
  },
  discardReadingFundamentals: {
    slug: "discard-reading-fundamentals",
    guide: {
      title: "捨て牌読みとは？初心者が最初に知りたい考え方",
      description: "細かな読み技術を暗記する前に、河から何を考え、読みをどう実戦判断へ使うかを学ぶ入門動画です。",
      focus: "待ちを当てる技ではなく、見えている情報から可能性の高低を比べる考え方に注目です。",
      level: "捨て牌読みに初めて触れる人",
      category: "読み・捨て牌読み入門",
      dateLabel: "2024年3月8日",
      readingTime: "約8分で読める",
      relatedHref: "/videos/strategy/reach-declaration-tile-reading",
      relatedLabel: "リーチ宣言牌の読みへ進む",
      youtubeId: "Z31rs6-SHq0",
      publisher: "発男道場【麻雀解説ch】"
    },
    youtubeTitle: "【麻雀解説】捨て牌読みの根本的な考え方（初心者向け）",
    videoDuration: "10分30秒",
    lead: "捨て牌読みは、相手の待ちをぴたりと当てるためだけのものではありません。見えている情報から可能性を比較し、自分の判断を少し良くするための入口です。",
    recommendedFor: ["河を見ても現物しか分からない人", "読みは上級者だけの技術だと思っている人", "細かな読み技術を覚える前に目的を知りたい人"],
    watchPoints: [
      { title: "何のために読むか", description: "待ち当てではなく、危険度や相手の進行を比べる目的を確認します。" },
      { title: "確定情報を土台にする", description: "捨て牌、鳴き、巡目など実際に見える情報から始めます。" },
      { title: "例外を残す", description: "読みと違う手順もあるため、断定しない姿勢に注目します。" }
    ],
    overview: ["捨て牌読みの根本は、相手の手牌を完全に当てることではなく、見えている情報から可能性を比較することです。読みの結果は、危険牌の順位や押し引きを調整する材料になります。", "初心者は個別テクニックを増やす前に、確定情報、手掛かり、推測を分ける習慣を作ると、読みすぎによる決め打ちを防げます。"],
    keyPoints: [
      { title: "確定情報", description: "河、副露、ドラ、巡目など、全員に見えている事実です。" },
      { title: "手掛かり", description: "切り順や手出しから、通常の手順との差を探します。" },
      { title: "判断材料", description: "読みは単独の結論ではなく、安全度や押し引きを補助します。" }
    ],
    practicalPoints: ["一局につき一つだけ読みの手掛かりを探す", "読んだ内容を確定情報と推測に分ける", "対局後に牌譜で確認し、当たり外れより根拠を振り返る"],
    relatedLinks: [
      { href: "/videos/strategy/reach-declaration-tile-reading", label: "リーチ宣言牌から読み取れる3つの情報" },
      { href: "/videos/strategy/how-to-use-mahjong-reading", label: "読みは違和感と例外で考える" }
    ],
    nextLinks: [
      { href: "/videos/strategy/discard-block-structure-reading", label: "ブロック構成読みへ進む" },
      { href: "/videos/strategy/discard-reading-ten-question-test", label: "読みの総合問題を見る" }
    ]
  }
} satisfies Record<string, VideoLesson>;

function toGuide(lesson: VideoLesson): VideoLessonGuide {
  return {
    ...lesson.guide,
    articleHref: `/videos/strategy/${lesson.slug}`
  };
}

export const addedVideoGuides = {
  betaoriPractice: toGuide(addedVideoLessons.betaoriPractice),
  pushFoldQuiz: toGuide(addedVideoLessons.pushFoldQuiz),
  riichiQuiz: toGuide(addedVideoLessons.riichiQuiz),
  clearRainBadHand: toGuide(addedVideoLessons.clearRainBadHand),
  multiSidedWaits: toGuide(addedVideoLessons.multiSidedWaits),
  betaoriRiskTest: toGuide(addedVideoLessons.betaoriRiskTest),
  blockStructureReading: toGuide(addedVideoLessons.blockStructureReading),
  hirasawaBadHand: toGuide(addedVideoLessons.hirasawaBadHand),
  mawashiUchi: toGuide(addedVideoLessons.mawashiUchi),
  threeDimensionalNanikiru: toGuide(addedVideoLessons.threeDimensionalNanikiru),
  tileEfficiencyExceptions: toGuide(addedVideoLessons.tileEfficiencyExceptions),
  readingQuiz: toGuide(addedVideoLessons.readingQuiz),
  discardReadingFundamentals: toGuide(addedVideoLessons.discardReadingFundamentals)
};
