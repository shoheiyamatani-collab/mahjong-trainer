import { addedVideoGuides } from "./strategy/videoLessonData";

export type VideoGuide = {
  title: string;
  description: string;
  focus: string;
  level: string;
  category: string;
  categoryHref?: string;
  dateLabel: string;
  readingTime: string;
  relatedHref: string;
  relatedLabel: string;
  articleHref?: string;
  youtubeId?: string;
  publisher?: string;
};

export type VideoChannel = {
  slug: "strategy" | "mleague-clips";
  eyebrow: string;
  title: string;
  description: string;
  accent: "blue" | "red";
  heroTiles: string[];
  guides: VideoGuide[];
};

export const strategyCategoryOrder = [
  "牌効率・何切る",
  "役・鳴き・点数",
  "守備・押し引き",
  "読み・実戦判断",
  "上達・振り返り"
] as const;

export type StrategyCategory = (typeof strategyCategoryOrder)[number];

export function getStrategyCategory(category: string): StrategyCategory {
  if (category.includes("読み")) {
    return "読み・実戦判断";
  }

  if (category.includes("守備") || category.includes("安全牌") || category.includes("ベタオリ") || category.includes("手詰まり")) {
    return "守備・押し引き";
  }

  if (category.includes("牌効率") || category.includes("何切る") || category.includes("シャンテン")) {
    return "牌効率・何切る";
  }

  if (category.includes("役") || category.includes("鳴き") || category.includes("点数")) {
    return "役・鳴き・点数";
  }

  return "上達・振り返り";
}

export const videoChannels: Record<VideoChannel["slug"], VideoChannel> = {
  strategy: {
    slug: "strategy",
    eyebrow: "Mahjong Video Lessons",
    title: "麻雀を動画で学ぶ",
    description: "牌効率、押し引き、点数計算などの戦術動画を、初心者が見るべきポイントと一緒に紹介します。",
    accent: "blue",
    heroTiles: ["man2", "man3", "man4", "pin4", "pin5", "pin6"],
    guides: [
      {
        title: "初心者でも上級者に勝つ確率を上げる4つの基本",
        description: "麻雀の運を味方につけるために、手作り・押し引き・リーチ・鳴きで先に覚えたい判断基準をまとめた動画を紹介します。",
        focus: "速さと打点のバランス、ノーテン時の押し引き、基本のリーチ判断、鳴いてよい手の見分け方に注目です。",
        level: "初心者〜中級者",
        category: "実戦判断・勝ち方",
        dateLabel: "2023年4月8日",
        readingTime: "約9分で読める",
        relatedHref: "/trainer",
        relatedLabel: "実戦問題で判断を試す",
        articleHref: "/videos/strategy/beginner-win-chance-basics",
        youtubeId: "Rgs6FHdKXvU",
        publisher: "クリアレインのアトリエ【麻雀解説】"
      },
      {
        title: "役を4つのグループで覚える初心者向け入門",
        description: "41個前後ある麻雀の役を丸暗記せず、使う牌、面子の形、見た目の規則性、アガり方という4つのイメージで整理する動画です。",
        focus: "タンヤオとチャンタ、混一色と清一色、対々和と平和など、似た役を関連づけて覚える考え方に注目です。",
        level: "役を覚え始めた人",
        category: "役・覚え方",
        dateLabel: "2023年6月16日",
        readingTime: "約11分で読める",
        relatedHref: "/rules/yaku",
        relatedLabel: "役一覧を牌姿で確認する",
        articleHref: "/videos/strategy/yaku-grouping-memory-guide",
        youtubeId: "-5MwWWHqvWI",
        publisher: "平澤元気麻雀ch"
      },
      {
        title: "初心者がやってはいけない3つの何切る",
        description: "唯一の対子、完成した面子、孤立牌があるときのターツを切らず、シャンテン数を戻さない基本を学ぶ動画です。",
        focus: "役や安全牌を優先する前に、4面子1雀頭へ最短で近づく形を守り、大きな牌効率のミスを防ぐ点に注目です。",
        level: "牌効率を初めて学ぶ人",
        category: "牌効率・シャンテン数",
        dateLabel: "2022年11月30日",
        readingTime: "約9分で読める",
        relatedHref: "/trainer",
        relatedLabel: "何切る問題で確認する",
        articleHref: "/videos/strategy/three-shanten-mistakes-beginners-avoid",
        youtubeId: "dIuGoO2CGtI",
        publisher: "平澤元気麻雀ch"
      },
      {
        title: "受け入れと手変わりの違いを正しく覚える",
        description: "受け入れを『引いたら嬉しい牌』ではなく『シャンテン数が進む牌』として理解し、形が良くなる手変わりと区別する動画です。",
        focus: "テンパイ・一向聴・二向聴以下を見分け、リーチボタンが出る前にテンパイする牌を予測する練習に注目です。",
        level: "牌効率を学び始める人",
        category: "牌効率・受け入れ",
        dateLabel: "2026年7月29日",
        readingTime: "約12分で読める",
        relatedHref: "/analysis/mahjong-tool",
        relatedLabel: "牌理チェッカーで確認する",
        articleHref: "/videos/strategy/ukeire-vs-shape-change-basics",
        youtubeId: "UvwfxpDK2zw",
        publisher: "平澤元気麻雀ch"
      },
      {
        title: "牌効率は変化より受け入れを優先する",
        description: "引いて嬉しい牌を受け入れと変化に分け、何切るではシャンテン数が直接進む枚数を先に比べる動画です。",
        focus: "899萬・北北の8枚受けと35索の4枚受け＋良形変化を比べ、両面を作ること自体を目的にしない点に注目です。",
        level: "受け入れを覚えた初心者",
        category: "牌効率・受け入れと変化",
        dateLabel: "2022年12月3日",
        readingTime: "約9分で読める",
        relatedHref: "/analysis/mahjong-tool",
        relatedLabel: "牌理チェッカーで比較する",
        articleHref: "/videos/strategy/prioritize-ukeire-over-shape-change",
        youtubeId: "GJ91P8Tbhh0",
        publisher: "平澤元気麻雀ch"
      },
      {
        title: "麻雀初心者のための牌効率・完全入門",
        description: "シャンテン数、受け入れ、孤立牌の切り順、5ブロック理論、強いイーシャンテンまでを1本で学べる総合講座です。",
        focus: "序盤・中盤・イーシャンテンで見る場所を切り替え、受け入れを細かく数えなくても最速テンパイへ近づく手順に注目です。",
        level: "牌効率を基礎から学びたい人",
        category: "牌効率・総合入門",
        dateLabel: "2023年3月18日",
        readingTime: "約15分で読める",
        relatedHref: "/analysis/mahjong-tool",
        relatedLabel: "牌理チェッカーで確認する",
        articleHref: "/videos/strategy/tile-efficiency-complete-beginner-guide",
        youtubeId: "Q05otKQCgeU",
        publisher: "平澤元気麻雀ch"
      },
      {
        title: "麻雀初心者が覚えたい牌効率の4法則",
        description: "対子候補とブロックの数を基準に、何を切ればテンパイへ近づきやすいかを学べる動画を紹介します。",
        focus: "対子を2組残す考え方と、6ブロックを5ブロックに整理する判断に注目です。",
        level: "初心者〜中級者",
        category: "牌効率",
        dateLabel: "2024年1月9日",
        readingTime: "約7分で読める",
        relatedHref: "/trainer",
        relatedLabel: "何切る問題で試す",
        articleHref: "/videos/strategy/tile-efficiency-four-rules",
        youtubeId: "q3LPfokscno",
        publisher: "発男道場【麻雀解説ch】"
      },
      {
        title: "初心者が先に覚えたい重要な牌の形7選",
        description: "四連形、中ぶくれ、両面カンチャン、完全イーシャンテンなど、手牌に残すとアガリへ近づきやすい7つの形を学ぶ動画です。",
        focus: "形の名前だけでなく、何を引くと受け入れが増えるか、どの牌を切ると形の強さを残せるかに注目です。",
        level: "麻雀を始めた人",
        category: "牌効率・重要形",
        dateLabel: "2022年3月2日",
        readingTime: "約10分で読める",
        relatedHref: "/analysis/mahjong-tool",
        relatedLabel: "受け入れを比較する",
        articleHref: "/videos/strategy/seven-important-shapes-to-memorize",
        youtubeId: "BkzUkNwDXjY",
        publisher: "平澤元気麻雀ch"
      },
      {
        title: "アガリ率を上げる、初心者が覚えたい強い形7選",
        description: "四連形、中ぶくれ、一枚飛びなど、面子へ伸びやすい7つの形を動画と牌図で見分けられるようにします。",
        focus: "形の名前を暗記するだけでなく、次に何を引くと両面や面子ができるのかを一つずつ確認します。",
        level: "麻雀を始めた人",
        category: "牌効率・強い形",
        dateLabel: "2026年5月30日",
        readingTime: "約10分で読める",
        relatedHref: "/analysis/mahjong-tool",
        relatedLabel: "受け入れを比較する",
        articleHref: "/videos/strategy/seven-strong-shapes-for-winning",
        youtubeId: "_wZjkrqSeoA",
        publisher: "クリアレインのアトリエ【麻雀解説】"
      },
      {
        title: "面子を作りやすい重要な形7選",
        description: "四連形や中ぶくれ、リャンカンなど、残しておくと面子へ発展しやすい7つの形を牌図で学べる動画を紹介します。",
        focus: "形そのものの暗記ではなく、何を引くと順子や両面が増えるのかを比べながら見ます。",
        level: "初心者〜中級者",
        category: "牌効率・複合形",
        dateLabel: "2023年7月29日",
        readingTime: "約10分で読める",
        relatedHref: "/analysis/mahjong-tool",
        relatedLabel: "受け入れを比較する",
        articleHref: "/videos/strategy/seven-meld-building-shapes",
        youtubeId: "56xlttqbiOY",
        publisher: "クリアレインのアトリエ【麻雀解説】"
      },
      {
        title: "初心者が間違えたくない何切る問題10問",
        description: "浮き牌、6ブロック、対子の数、複合ターツなど、麻雀初心者が押さえたい何切るの基本を全10問で学ぶ動画を紹介します。",
        focus: "正解牌の暗記ではなく、ブロック数と対子の数を最初に数えてから候補を比べる手順に注目です。",
        level: "何切るを始めた人",
        category: "初心者・何切る",
        dateLabel: "2026年4月11日",
        readingTime: "約9分で読める",
        relatedHref: "/trainer",
        relatedLabel: "何切る問題で試す",
        articleHref: "/videos/strategy/beginner-nanikiru-ten-questions",
        youtubeId: "8ZsxOw6-NJs",
        publisher: "クリアレインのアトリエ【麻雀解説】"
      },
      {
        title: "1・9を適当に切らないための孤立牌の優先順位",
        description: "同じように見える孤立した1・9にも、周囲の牌によって残す価値の差があります。切り順を4段階で学べる動画を紹介します。",
        focus: "1・4・7の受け入れの重複と、1・5からリャンカンへ変化する可能性に注目です。",
        level: "初心者〜中級者",
        category: "牌効率・孤立牌",
        dateLabel: "2024年2月7日",
        readingTime: "約7分で読める",
        relatedHref: "/analysis/mahjong-tool",
        relatedLabel: "受け入れを比較する",
        articleHref: "/videos/strategy/isolated-terminal-tile-order",
        youtubeId: "vESIZaYYJL4",
        publisher: "発男道場【麻雀解説ch】"
      },
      {
        title: "攻守で変わる字牌の捨て順",
        description: "役牌とオタ風、攻める手と守りを意識する手で、字牌をどの順番に切るかを学ぶ動画です。",
        focus: "字牌を一律に端から切らず、役になる価値、場に見えている枚数、将来の安全度を分けて比べます。",
        level: "初心者〜中級者",
        category: "牌効率・字牌",
        dateLabel: "2026年7月4日",
        readingTime: "約8分で読める",
        relatedHref: "/rules/yakuhai",
        relatedLabel: "役牌の条件を確認する",
        articleHref: "/videos/strategy/honor-tile-discard-order",
        youtubeId: "HVNhilfOmP0",
        publisher: "クリアレインのアトリエ【麻雀解説】"
      },
      {
        title: "全16問で学ぶ、脱初心者の何切るセオリー",
        description: "牌効率の重要な考え方を、全16問の何切る問題を解きながら身につける動画を紹介します。",
        focus: "動画を止めて自分の一打を決め、ブロック数・対子・二度受け・孤立牌を根拠に答えを比べます。",
        level: "初心者〜中級者",
        category: "牌効率・何切る",
        dateLabel: "2024年10月5日",
        readingTime: "約8分で読める",
        relatedHref: "/trainer",
        relatedLabel: "何切る問題で試す",
        articleHref: "/videos/strategy/tile-efficiency-essential-theory-quiz",
        youtubeId: "55ZkWcsgpcs",
        publisher: "発男道場【麻雀解説ch】"
      },
      {
        title: "基本役の次に覚えたい、打点を伸ばす10役",
        description: "アガれるようになった初心者が次に覚えたい、一盃口・三色同順・混一色など10役を動画と14枚の牌姿で紹介します。",
        focus: "役名の暗記だけでなく、配牌や手牌の途中で役の種を見つけ、打点を伸ばす考え方に注目です。",
        level: "基本役を覚えた人",
        category: "役・打点",
        dateLabel: "2022年1月22日",
        readingTime: "約12分で読める",
        relatedHref: "/rules/yaku",
        relatedLabel: "役一覧で牌姿を確認する",
        articleHref: "/videos/strategy/important-yaku-for-higher-scores",
        youtubeId: "XOTTtJaRGQs",
        publisher: "クリアレインのアトリエ【麻雀解説】"
      },
      {
        title: "初心者がまず覚えたい、鳴きの3つのセオリー",
        description: "役牌・役が確定している愚形・鳴けばテンパイの3場面から、ポンやチーを使う基本基準を学ぶ動画です。",
        focus: "例外の暗記よりも、まずアガリまでの速度を上げる鳴きを選び、鳴いた後に役が残るかを確認する点に注目です。",
        level: "鳴きを覚え始めた人",
        category: "鳴き・基本判断",
        dateLabel: "2021年3月3日",
        readingTime: "約9分で読める",
        relatedHref: "/learn/calling",
        relatedLabel: "鳴きの基本を復習する",
        articleHref: "/videos/strategy/beginner-calling-theory",
        youtubeId: "KkjFCbiGrY0",
        publisher: "平澤元気麻雀ch"
      },
      {
        title: "待ちを良くする何鳴く問題10問",
        description: "テンパイ後にどの牌をチー・ポンすると、カンチャンや単騎から両面・多面待ちへ変えられるかを学ぶ問題動画です。",
        focus: "現在の待ちの近くにある牌、複数の面子分解、鳴いた後の実際の残り枚数を順番に確認します。",
        level: "基本を覚えた人",
        category: "鳴き・待ち選択",
        dateLabel: "2026年8月8日",
        readingTime: "約10分で読める",
        relatedHref: "/rules/practical-waits",
        relatedLabel: "待ちの形を復習する",
        articleHref: "/videos/strategy/calling-to-improve-wait-quiz",
        youtubeId: "7Cy92lt82N8",
        publisher: "クリアレインのアトリエ【麻雀解説】"
      },
      addedVideoGuides.multiSidedWaits,
      addedVideoGuides.riichiQuiz,
      {
        title: "鳴いてテンパイした後も手を良くする",
        description: "副露してテンパイした後も、さらに鳴いて打点を上げたり、待ちを広げたりできるケースを学ぶ動画です。",
        focus: "テンパイしたら止まらず、三色・一気通貫・赤牌などの打点変化と、カンチャンから両面への待ち変化を探します。",
        level: "基本を覚えた人",
        category: "鳴き・テンパイ後",
        dateLabel: "2024年6月1日",
        readingTime: "約9分で読める",
        relatedHref: "/analysis/mahjong-tool",
        relatedLabel: "待ちと受け入れを確認する",
        articleHref: "/videos/strategy/after-calling-tenpai",
        youtubeId: "E6kwxNECnXI",
        publisher: "発男道場【麻雀解説ch】"
      },
      {
        title: "副露率の数字に振り回されない鳴きの考え方",
        description: "自分の副露率だけを見て鳴きすぎ・鳴かなすぎと決めず、速度、打点、守備、相手の対応から個々の鳴きを振り返る動画です。",
        focus: "副露率に唯一の正解はないことと、成績画面の割合ではなく、実際の牌譜で一つずつ鳴きの損得を確認する点に注目です。",
        level: "鳴きを使い始めた人",
        category: "鳴き・成績分析",
        dateLabel: "2019年6月21日",
        readingTime: "約10分で読める",
        relatedHref: "/learn/calling",
        relatedLabel: "鳴きの基本を復習する",
        articleHref: "/videos/strategy/how-to-read-fuuro-rate",
        youtubeId: "Fm-GacaIVIc",
        publisher: "平澤元気麻雀ch"
      },
      {
        title: "安牌がないときに使うスジとカベの基本",
        description: "現物が手元にないとき、相手の捨て牌と見えている牌から比較的当たりにくい牌を探す守備動画を紹介します。",
        focus: "スジが否定できるのは両面待ちであることと、ノーチャンスとワンチャンスの差に注目です。",
        level: "初心者〜中級者",
        category: "守備・安全牌",
        dateLabel: "2023年9月29日",
        readingTime: "約8分で読める",
        relatedHref: "/rules/practical-waits",
        relatedLabel: "待ちの形を復習する",
        articleHref: "/videos/strategy/suji-kabe-defense-basics",
        youtubeId: "q5XfdejdsE8",
        publisher: "発男道場【麻雀解説ch】"
      },
      {
        title: "現物がないときに放銃を減らすベタオリ技術",
        description: "リーチを受けて現物がないとき、異なる危険牌を何種類も切らず、対子・暗刻や序盤の外側を比較して放銃率を抑える動画です。",
        focus: "降りると決めた後に切る筋の種類を増やさないことと、序盤に切られた牌の外側を安全牌ではなく比較材料として扱う点に注目です。",
        level: "守備を覚え始めた人",
        category: "守備・手詰まり",
        dateLabel: "2019年7月18日",
        readingTime: "約10分で読める",
        relatedHref: "/videos/strategy/suji-kabe-defense-basics",
        relatedLabel: "スジとカベを復習する",
        articleHref: "/videos/strategy/no-safe-tile-defense-techniques",
        youtubeId: "nzHCKuMuUJE",
        publisher: "平澤元気麻雀ch"
      },
      {
        title: "オリ打ちを減らすベタオリの重要な考え方3選",
        description: "降りると決めた後、複数の現物や無スジからどの牌を選べば放銃しにくいかを学ぶ守備動画を紹介します。",
        focus: "現物を切る順番、複数枚ある危険牌、当たり得る待ちの種類を比較する考え方に注目です。",
        level: "基本を覚えた人",
        category: "守備・ベタオリ",
        dateLabel: "2024年4月13日",
        readingTime: "約9分で読める",
        relatedHref: "/videos/strategy/suji-kabe-defense-basics",
        relatedLabel: "スジとカベを復習する",
        articleHref: "/videos/strategy/betaori-three-principles",
        youtubeId: "Y9XXEwNmKcE",
        publisher: "発男道場【麻雀解説ch】"
      },
      addedVideoGuides.betaoriPractice,
      {
        title: "気づかないうちにやっている麻雀の悪い癖3選",
        description: "覚えたての頃に身につきやすい、押し引き・役なしダマテン・生牌の字牌に関する3つの癖を見直す動画を紹介します。",
        focus: "当てはまる項目を責めるのではなく、次の対局で直す行動を1つ決めるための記事です。",
        level: "初心者〜中級者",
        category: "振り返り・悪癖改善",
        dateLabel: "2024年1月26日",
        readingTime: "約8分で読める",
        relatedHref: "/trainer",
        relatedLabel: "問題で判断を練習する",
        articleHref: "/videos/strategy/common-bad-habits-self-check",
        youtubeId: "HH56Dvq8n8A",
        publisher: "発男道場【麻雀解説ch】"
      },
      {
        title: "符計算を暗記する前に覚える点数計算の簡単な方法",
        description: "よく出るアガリを20・30・40符に分け、親子・ロンツモ・翻数から点数表を引く方法を学ぶ動画を紹介します。",
        focus: "門前ツモ、門前ロン、鳴きの3つに分け、平和かどうかを見る簡単な分類が中心です。",
        level: "点数計算を始める人",
        category: "点数計算・符",
        dateLabel: "2020年6月20日",
        readingTime: "約8分で読める",
        relatedHref: "/tools/score-table",
        relatedLabel: "点数早見表を見る",
        articleHref: "/videos/strategy/easy-score-calculation-without-fu",
        youtubeId: "_b8l94mF8P0",
        publisher: "クリアレインのアトリエ【麻雀解説】"
      },
      {
        title: "実戦でよく出る点数計算問題10問",
        description: "平和のロン・ツモ、平和なし、副露、七対子、満貫、40符・50符を10問で確認する点数計算動画です。",
        focus: "翻数を数え、ロンかツモか、門前か副露か、平和があるかの順に点数表を選ぶ練習をします。",
        level: "点数計算を練習する人",
        category: "点数計算・問題",
        dateLabel: "2026年5月16日",
        readingTime: "約10分で読める",
        relatedHref: "/tools/score-table",
        relatedLabel: "点数早見表を使う",
        articleHref: "/videos/strategy/practical-score-calculation-quiz",
        youtubeId: "pDTj3jixyY4",
        publisher: "クリアレインのアトリエ【麻雀解説】"
      },
      addedVideoGuides.discardReadingFundamentals,
      {
        title: "リーチ宣言牌から読み取れる3つの情報",
        description: "宣言牌が1・9、安全牌、先制リーチ者の現物だった場合に、待ちや手組みをどう推測できるか学ぶ動画を紹介します。",
        focus: "宣言牌は確定情報ではなく、待ちの危険度を比較する補助材料として使う点が重要です。",
        level: "基本を覚えた人",
        category: "守備・捨て牌読み",
        dateLabel: "2024年6月26日",
        readingTime: "約8分で読める",
        relatedHref: "/videos/strategy/suji-kabe-defense-basics",
        relatedLabel: "スジとカベを復習する",
        articleHref: "/videos/strategy/reach-declaration-tile-reading",
        youtubeId: "jc5a_WT9EVU",
        publisher: "発男道場【麻雀解説ch】"
      }
    ]
  },
  "mleague-clips": {
    slug: "mleague-clips",
    eyebrow: "M.LEAGUE Selected Clips",
    title: "Mリーグ厳選切り抜きを見る",
    description: "Mリーグ関連の公開動画から、対局の流れや選手の判断が伝わる一本を選び、見るべき局面と一緒に紹介します。",
    accent: "red",
    heroTiles: ["ji1", "ji2", "ji3", "ji4", "ji5", "ji7"],
    guides: [
      {
        title: "逆転につながった一局",
        description: "点数状況を踏まえた手作りや、終盤の押し引きが勝負を動かした動画を紹介します。",
        focus: "何局・何巡目を見るべきかを記事内で明記します。",
        level: "対局を楽しみたい人",
        category: "名局",
        dateLabel: "公開準備中",
        readingTime: "7分で読める",
        relatedHref: "/rules/practical-score",
        relatedLabel: "実戦の点数を確認する"
      },
      {
        title: "選手の個性が見える対局",
        description: "攻撃、守備、鳴きなど、Mリーガーの打ち筋が分かりやすく表れた動画を紹介します。",
        focus: "選手名、対戦相手、注目したい判断を整理します。",
        level: "Mリーグをもっと知りたい人",
        category: "選手・対局",
        dateLabel: "公開準備中",
        readingTime: "6分で読める",
        relatedHref: "/trainer",
        relatedLabel: "同じ形を練習する"
      },
      {
        title: "初心者に見てほしい名場面",
        description: "ルールを覚えたばかりでも状況を追いやすく、麻雀の面白さが伝わる動画を集めます。",
        focus: "専門用語を補足し、初めて見る人にも流れが分かる記事にします。",
        level: "Mリーグ初心者",
        category: "初心者向け",
        dateLabel: "公開準備中",
        readingTime: "5分で読める",
        relatedHref: "/learn",
        relatedLabel: "麻雀の基本を確認する"
      }
    ]
  }
};

export const advancedStrategyChannel: VideoChannel = {
  slug: "strategy",
  eyebrow: "Intermediate Mahjong Video Lessons",
  title: "中級者以上向け動画",
  description: "基礎を身につけた方へ向けて、牌効率・押し引き・読み・手順比較など、実戦判断を深く学べる動画を紹介します。",
  accent: "blue",
  heroTiles: ["man1", "man3", "man4", "man5", "man6", "man8"],
  guides: [
    {
      title: "中級レベルの牌効率を身につける26のセオリー",
      description: "打点判断、5ブロック理論、孤立牌、二度受け、対子選択、ドラのスライドまで、中級者が何切るで使う26の判断基準をまとめた動画です。",
      focus: "正解牌を暗記するのではなく、受け入れ・打点・守備・裏目の損失を同時に比較する考え方に注目です。",
      level: "中級者以上",
      category: "牌効率・何切る",
      dateLabel: "2025年2月26日",
      readingTime: "約13分で読める",
      relatedHref: "/analysis/mahjong-tool",
      relatedLabel: "牌理チェッカーで比較する",
      articleHref: "/videos/strategy/intermediate-tile-efficiency-26-rules",
      youtubeId: "7zl8NwudR5g",
      publisher: "発男道場【麻雀解説ch】"
    },
    addedVideoGuides.tileEfficiencyExceptions,
    addedVideoGuides.threeDimensionalNanikiru,
    {
      title: "孤立牌2・8より1・9を残す3つのケース",
      description: "通常は2・8の方が強いという基本を踏まえ、安全度、鳴き、複合形によって1・9の価値が逆転する条件を学ぶ動画です。",
      focus: "牌単体の受け入れだけでなく、手牌の完成度・鳴きやすさ・将来の安全牌という3つの視点に注目です。",
      level: "中級者以上",
      category: "牌効率・孤立牌",
      dateLabel: "2025年2月22日",
      readingTime: "約8分で読める",
      relatedHref: "/analysis/mahjong-tool",
      relatedLabel: "牌理チェッカーで比較する",
      articleHref: "/videos/strategy/when-terminal-is-better-than-28",
      youtubeId: "mah_grITelQ",
      publisher: "発男道場【麻雀解説ch】"
    },
    {
      title: "1シャンテンを取る？4枚形と孤立牌の比較",
      description: "4枚形を残して一向聴に取るか、孤立牌を残して二向聴へ戻すか。5つの形から良形テンパイへの変化を比べる動画です。",
      focus: "シャンテン数だけでなく、次にテンパイしたときの待ちが愚形に固定されるか、孤立牌から良形へ変化できるかに注目です。",
      level: "中級者以上",
      category: "牌効率・シャンテン戻し",
      dateLabel: "2026年8月12日",
      readingTime: "約9分で読める",
      relatedHref: "/analysis/mahjong-tool",
      relatedLabel: "牌理チェッカーで比較する",
      articleHref: "/videos/strategy/four-tile-shape-vs-floating-tile",
      youtubeId: "ugikTxXHVP4",
      publisher: "発男道場【麻雀解説ch】"
    },
    {
      title: "中級者が勘違いしやすい安牌と孤立牌の2基準",
      description: "安牌はいつ持つべきか、孤立牌はなぜ残すのか。手牌価値とブロック数から、よくある勘違いを修正する動画です。",
      focus: "先制できそうかだけで安牌を決めず、押し返す価値があるかを見ること。孤立牌はターツ不足を補うために残すことに注目です。",
      level: "中級者以上",
      category: "守備・牌効率",
      dateLabel: "2026年8月8日",
      readingTime: "約9分で読める",
      relatedHref: "/analysis/mahjong-tool",
      relatedLabel: "牌理チェッカーで比較する",
      articleHref: "/videos/strategy/safe-tile-and-floating-tile-decisions",
      youtubeId: "QN7fXjs2PaY",
      publisher: "発男道場【麻雀解説ch】"
    },
    addedVideoGuides.clearRainBadHand,
    addedVideoGuides.hirasawaBadHand,
    {
      title: "複合形35677は3切り？7切り？",
      description: "頭候補、鳴き、打点、くっつきの強さから、35677を5677と3567のどちらへ整理するか学ぶ動画です。",
      focus: "基本の3切りと、7切りへ変わる条件を分け、別の不要牌を切って形を残す選択まで比較します。",
      level: "中級者以上",
      category: "牌効率・複合形",
      dateLabel: "2025年12月13日",
      readingTime: "約9分で読める",
      relatedHref: "/analysis/mahjong-tool",
      relatedLabel: "牌理チェッカーで比較する",
      articleHref: "/videos/strategy/how-to-handle-35677",
      youtubeId: "gtyJ5zhvinE",
      publisher: "発男道場【麻雀解説ch】"
    },
    {
      title: "4・5・6ブロックで変える牌効率の考え方",
      description: "手牌のブロック数を数え、4ブロックなら増やす、5ブロックなら維持する、6ブロックなら弱い形を減らす考え方を学ぶ動画です。",
      focus: "同じ孤立牌やターツでも、現在のブロック数によって価値が変わる点を、3つの方針に分けて整理します。",
      level: "中級者以上",
      category: "牌効率・ブロック数",
      dateLabel: "2026年4月8日",
      readingTime: "約9分で読める",
      relatedHref: "/analysis/mahjong-tool",
      relatedLabel: "牌理チェッカーで比較する",
      articleHref: "/videos/strategy/block-count-approach",
      youtubeId: "-DqvQsmOdew",
      publisher: "発男道場【麻雀解説ch】"
    },
    {
      title: "麻雀の読みは「違和感」と「例外」で考える",
      description: "捨て牌の順番や鳴きから通常の手順を想像し、そこから外れる違和感と例外を探して危険度を比較する読みの動画です。",
      focus: "読みを待ちの断定に使わず、確定情報・手掛かり・推測を分けて、押し引きの判断材料にする考え方に注目です。",
      level: "中級者以上",
      category: "読み・情報整理",
      dateLabel: "2026年4月4日",
      readingTime: "約11分で読める",
      relatedHref: "/rules/practical-waits",
      relatedLabel: "待ちの形を確認する",
      articleHref: "/videos/strategy/how-to-use-mahjong-reading",
      youtubeId: "7alr7PlSN2M",
      publisher: "発男道場【麻雀解説ch】"
    },
    addedVideoGuides.blockStructureReading,
    {
      title: "ベタオリで切る牌の優先順位",
      description: "スジ、序盤の外側、ワンチャンス、モロひっかけ、無スジを比較し、ベタオリ時にどの牌から切るかを学ぶ動画です。",
      focus: "安全牌の枚数だけで決めず、まず危険度の種類と数字を比較し、同程度なら将来の安全牌枚数を考える順番に注目です。",
      level: "中級者以上",
      category: "守備・ベタオリ",
      dateLabel: "2026年5月13日",
      readingTime: "約10分で読める",
      relatedHref: "/videos/strategy/suji-kabe-defense-basics",
      relatedLabel: "スジとカベを復習する",
      articleHref: "/videos/strategy/betaori-priority-order",
      youtubeId: "nSVatsm2P84",
      publisher: "発男道場【麻雀解説ch】"
    },
    addedVideoGuides.pushFoldQuiz,
    addedVideoGuides.betaoriRiskTest,
    addedVideoGuides.mawashiUchi,
    {
      title: "3トイツ形を効率よくさばく方法",
      description: "3組ある対子をどのように2組へ整理するか、5ブロックと6ブロックで異なる判断基準を学ぶ動画です。",
      focus: "対子を崩した後の両面変化、5ブロックへの整理、鳴ける手や複合形に対子が埋まっている例外に注目です。",
      level: "中級者以上",
      category: "牌効率・対子",
      dateLabel: "2024年7月24日",
      readingTime: "約10分で読める",
      relatedHref: "/analysis/mahjong-tool",
      relatedLabel: "牌理チェッカーで比較する",
      articleHref: "/videos/strategy/three-pairs-shape-efficiency",
      youtubeId: "pC_TSiQBezw",
      publisher: "発男道場【麻雀解説ch】"
    },
    {
      title: "リャンカンと亜両面がある牌姿の選び方",
      description: "リャンカンと亜両面が同時にある手牌で、どちらを残すと受け入れと良形率が高くなるかを学ぶ動画です。",
      focus: "135の2種類8枚受けと、2234の片側が対子によって減っている点を比べ、亜両面を過大評価しない判断に注目です。",
      level: "中級者以上",
      category: "牌効率・ターツ比較",
      dateLabel: "2026年1月14日",
      readingTime: "約9分で読める",
      relatedHref: "/analysis/mahjong-tool",
      relatedLabel: "牌理チェッカーで比較する",
      articleHref: "/videos/strategy/ryankan-vs-aryanmen-shape",
      youtubeId: "51U41w4pn2E",
      publisher: "発男道場【麻雀解説ch】"
    },
    {
      title: "4連形はどこまで残す？判断の基準",
      description: "3456のような4連形を、受け入れを減らしてでも残す場面と、速度を優先して崩す場面に分けて学ぶ動画です。",
      focus: "4連形を名前だけで残さず、最終待ちの良さ、巡目、ドラ、ほかのターツとの比較で価値を判断する点に注目です。",
      level: "中級者以上",
      category: "牌効率・4連形",
      dateLabel: "2026年5月9日",
      readingTime: "約11分で読める",
      relatedHref: "/analysis/mahjong-tool",
      relatedLabel: "牌理チェッカーで比較する",
      articleHref: "/videos/strategy/how-to-handle-four-consecutive-shape",
      youtubeId: "OEy1gpsVuQo",
      publisher: "発男道場【麻雀解説ch】"
    },
    {
      title: "ペンチャンと孤立牌3〜7の優先順位",
      description: "ペンチャンを残してテンパイ速度を取るか、孤立牌3〜7を残して良形変化を見るかを、シャンテン数と打点から学ぶ動画です。",
      focus: "基本はペンチャン残し。愚形リーのみ、タンヤオ変化、巡目の3条件でペンチャンを外す判断に注目です。",
      level: "中級者以上",
      category: "牌効率・ターツ比較",
      dateLabel: "2026年4月18日",
      readingTime: "約11分で読める",
      relatedHref: "/analysis/mahjong-tool",
      relatedLabel: "牌理チェッカーで比較する",
      articleHref: "/videos/strategy/penchan-vs-isolated-tiles-priority",
      youtubeId: "BO96oiuZoBA",
      publisher: "発男道場【麻雀解説ch】"
    },
    {
      title: "チー出しまたぎを読む3つの条件",
      description: "鳴いた直後に手から切られた牌のまたぎスジが、比較的通りやすくなる3つの状況を学ぶ鳴き読み動画です。",
      focus: "直前の見逃し、固定した両面との矛盾、安全牌を先に切った手順から、両面待ちの可能性を下げる考え方に注目です。",
      level: "中級者以上",
      category: "鳴き読み",
      categoryHref: "/videos/strategy/advanced/calling-read",
      dateLabel: "2025年3月15日",
      readingTime: "約11分で読める",
      relatedHref: "/rules/practical-waits",
      relatedLabel: "待ちの形を確認する",
      articleHref: "/videos/strategy/calling-read-chi-discard-matagi",
      youtubeId: "3CY4e9PVNy0",
      publisher: "発男道場【麻雀解説ch】"
    },
    {
      title: "固定した両面チーから読む待ち候補",
      description: "あらかじめ固定した両面をチーした相手について、鳴いた直後の手出しから通りやすい両面を探す鳴き読み動画です。",
      focus: "手出し牌が鳴き面子のフォロー牌かを確認し、またぎ以外の両面と、まだ残るシャンポン・カンチャンを分けます。",
      level: "中級者以上",
      category: "鳴き読み",
      categoryHref: "/videos/strategy/advanced/calling-read",
      dateLabel: "2025年10月8日",
      readingTime: "約11分で読める",
      relatedHref: "/rules/practical-waits",
      relatedLabel: "待ちの形を確認する",
      articleHref: "/videos/strategy/calling-read-fixed-ryanmen-chi",
      youtubeId: "OYK0xrdF2no",
      publisher: "発男道場【麻雀解説ch】"
    },
    {
      title: "まず覚えたい鳴き読み2つの重要パターン",
      description: "鳴き読みを何から始めるか迷う人へ、実戦で使いやすい2つの切り順読みを牌図と確認手順で学ぶ動画です。",
      focus: "安全牌を先に切った後のチー出しと、直前に同じ牌が切られたのにポンしなかった情報から、両面待ちの可能性を比較します。",
      level: "中級者以上",
      category: "鳴き読み",
      categoryHref: "/videos/strategy/advanced/calling-read",
      dateLabel: "2026年7月18日",
      readingTime: "約12分で読める",
      relatedHref: "/rules/practical-waits",
      relatedLabel: "待ちの形を確認する",
      articleHref: "/videos/strategy/calling-read-two-essential-patterns",
      youtubeId: "DrQ_50D4kaY",
      publisher: "発男道場【麻雀解説ch】"
    },
    {
      title: "複合形2446は何を切る？",
      description: "2446から2・4・6のどれを切るか、ピンフ、両面変化、ポン、最終待ち、巡目を比較して学ぶ動画です。",
      focus: "3・5を引いたときにピンフが確定するなら4切り、確定しないなら2切りを基本に、鳴きと巡目で調整します。",
      level: "中級者以上",
      category: "牌効率・複合形",
      dateLabel: "2025年9月20日",
      readingTime: "約11分で読める",
      relatedHref: "/analysis/mahjong-tool",
      relatedLabel: "牌理チェッカーで比較する",
      articleHref: "/videos/strategy/how-to-handle-2446-shape",
      youtubeId: "7XSu0hGAfeI",
      publisher: "発男道場【麻雀解説ch】"
    },
    addedVideoGuides.readingQuiz
  ]
};
