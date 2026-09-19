export const glossaryCategories = [
  "牌・手牌",
  "形・待ち",
  "進行・行動",
  "点数・ルール",
  "実戦・戦術"
] as const;

export type GlossaryCategory = (typeof glossaryCategories)[number];

export type GlossaryTerm = {
  slug: string;
  term: string;
  reading: string;
  category: GlossaryCategory;
  definition: string;
  beginnerNote?: string;
  aliases?: string[];
  related?: { label: string; href: string };
};

export const glossaryTerms: GlossaryTerm[] = [
  {
    slug: "tehai",
    term: "手牌",
    reading: "てはい",
    category: "牌・手牌",
    definition: "自分の前に並べて持っている牌のこと。通常は13枚で、自分の番に1枚引いて14枚にしてから1枚捨てます。",
    related: { label: "ツモって捨てる流れ", href: "/learn/draw-and-discard" }
  },
  {
    slug: "haipai",
    term: "配牌",
    reading: "はいぱい",
    category: "牌・手牌",
    definition: "局の最初に配られる手牌のこと。親は14枚、子は13枚から始まります。"
  },
  {
    slug: "suupai",
    term: "数牌",
    reading: "すうぱい",
    category: "牌・手牌",
    definition: "1から9までの数字がある牌の総称。萬子・筒子・索子の3種類があります。",
    related: { label: "牌の種類を覚える", href: "/learn/tiles" }
  },
  {
    slug: "manzu",
    term: "萬子",
    reading: "まんず・わんず",
    category: "牌・手牌",
    definition: "漢数字と「萬」が書かれた数牌。1萬から9萬まであります。",
    aliases: ["マンズ"]
  },
  {
    slug: "pinzu",
    term: "筒子",
    reading: "ぴんず",
    category: "牌・手牌",
    definition: "丸い模様で数を表す数牌。1筒から9筒まであります。",
    aliases: ["ピンズ"]
  },
  {
    slug: "souzu",
    term: "索子",
    reading: "そうず",
    category: "牌・手牌",
    definition: "竹のような模様で数を表す数牌。1索から9索まであります。",
    aliases: ["ソーズ"]
  },
  {
    slug: "jihai",
    term: "字牌",
    reading: "じはい",
    category: "牌・手牌",
    definition: "東・南・西・北・白・發・中の7種類の牌。数字がなく、順子にはできません。"
  },
  {
    slug: "kazehai",
    term: "風牌",
    reading: "かぜはい・ふうぱい",
    category: "牌・手牌",
    definition: "東・南・西・北の4種類の字牌。その局の場風や自分の自風を3枚そろえると役牌になります。",
    aliases: ["四風牌"]
  },
  {
    slug: "sangenpai",
    term: "三元牌",
    reading: "さんげんぱい",
    category: "牌・手牌",
    definition: "白・發・中の3種類の字牌。どの局でも同じ牌を3枚そろえると役牌になります。",
    related: { label: "役牌を確認する", href: "/rules/yakuhai" }
  },
  {
    slug: "yaochuuhai",
    term: "么九牌",
    reading: "やおちゅうはい",
    category: "牌・手牌",
    definition: "1・9の数牌と字牌を合わせた呼び方。タンヤオでは使わず、チャンタや混老頭などで使います。",
    aliases: ["ヤオチュー牌"]
  },
  {
    slug: "routouhai",
    term: "老頭牌",
    reading: "ろうとうはい",
    category: "牌・手牌",
    definition: "数牌の1と9のこと。字牌は含みません。"
  },
  {
    slug: "chunchanpai",
    term: "中張牌",
    reading: "ちゅんちゃんぱい",
    category: "牌・手牌",
    definition: "数牌の2から8までのこと。タンヤオは中張牌だけで作る役です。"
  },
  {
    slug: "dora",
    term: "ドラ",
    reading: "どら",
    category: "牌・手牌",
    definition: "アガったときに1枚につき1翻加算される牌。ドラだけでは役にならないため、別の役が必要です。",
    beginnerNote: "表示牌そのものではなく、基本的には表示牌の次の牌がドラです。"
  },
  {
    slug: "akadora",
    term: "赤ドラ",
    reading: "あかどら",
    category: "牌・手牌",
    definition: "赤く塗られた5萬・5筒・5索などの牌。手牌にあるだけでドラとして数えます。",
    aliases: ["赤牌", "赤5"]
  },
  {
    slug: "uradora",
    term: "裏ドラ",
    reading: "うらどら",
    category: "牌・手牌",
    definition: "リーチしてアガったときだけ確認できる追加のドラ。通常のドラ表示牌の下にある牌を使います。"
  },
  {
    slug: "mentsu",
    term: "面子",
    reading: "めんつ",
    category: "形・待ち",
    definition: "順子・刻子・槓子のような、アガリ形を作る3枚または4枚の組み合わせです。",
    related: { label: "面子・雀頭を覚える", href: "/learn/meld-and-pair" }
  },
  {
    slug: "shuntsu",
    term: "順子",
    reading: "しゅんつ",
    category: "形・待ち",
    definition: "同じ種類の数牌で作る連続した3枚。たとえば3・4・5萬です。字牌では作れません。"
  },
  {
    slug: "koutsu",
    term: "刻子",
    reading: "こうつ",
    category: "形・待ち",
    definition: "同じ牌を3枚そろえた組み合わせ。ポンで作ったものも刻子です。"
  },
  {
    slug: "kantsu",
    term: "槓子",
    reading: "かんつ",
    category: "形・待ち",
    definition: "同じ牌を4枚そろえてカンした組み合わせ。アガリ形では1面子として扱います。"
  },
  {
    slug: "jantou",
    term: "雀頭",
    reading: "じゃんとう",
    category: "形・待ち",
    definition: "同じ牌2枚の組み合わせ。基本のアガリ形では1組必要です。",
    aliases: ["頭"]
  },
  {
    slug: "toitsu",
    term: "対子",
    reading: "といつ",
    category: "形・待ち",
    definition: "同じ牌が2枚ある形。雀頭の候補になり、七対子では7組集めます。",
    aliases: ["ペア"]
  },
  {
    slug: "taatsu",
    term: "塔子",
    reading: "たーつ",
    category: "形・待ち",
    definition: "あと1枚で順子になる2枚組。両面・嵌張・辺張の3種類が基本です。",
    aliases: ["ターツ"]
  },
  {
    slug: "ryanmen",
    term: "両面待ち",
    reading: "りゃんめんまち",
    category: "形・待ち",
    definition: "連続した2枚の両側を待つ形。3・4なら2と5を待ち、一般にアガリやすい良形です。",
    aliases: ["両面"]
  },
  {
    slug: "kanchan",
    term: "嵌張待ち",
    reading: "かんちゃんまち",
    category: "形・待ち",
    definition: "1枚飛ばしの2枚の間を待つ形。3・5なら4を待ちます。",
    aliases: ["カンチャン"]
  },
  {
    slug: "penchan",
    term: "辺張待ち",
    reading: "ぺんちゃんまち",
    category: "形・待ち",
    definition: "1・2で3、または8・9で7を待つ端の形。待ちは1種類です。",
    aliases: ["ペンチャン"]
  },
  {
    slug: "shanpon",
    term: "双碰待ち",
    reading: "しゃんぽんまち",
    category: "形・待ち",
    definition: "対子が2組あり、どちらかを刻子にする待ち。たとえば東東と白白なら東か白を待ちます。",
    aliases: ["シャンポン"]
  },
  {
    slug: "tanki",
    term: "単騎待ち",
    reading: "たんきまち",
    category: "形・待ち",
    definition: "雀頭になる同じ牌を1枚待つ形。待ち牌を変えやすいのが特徴です。",
    aliases: ["単騎"]
  },
  {
    slug: "nobetan",
    term: "ノベタン",
    reading: "のべたん",
    category: "形・待ち",
    definition: "連続した4枚から雀頭候補を待つ形。たとえば2・3・4・5なら2か5の単騎待ちとして見ます。"
  },
  {
    slug: "shanten",
    term: "シャンテン数",
    reading: "しゃんてんすう",
    category: "形・待ち",
    definition: "アガリまでに最低何回、手を進める必要があるかを示す数字。0ならテンパイ、1ならイーシャンテンです。",
    aliases: ["向聴数"]
  },
  {
    slug: "iishanten",
    term: "イーシャンテン",
    reading: "いーしゃんてん",
    category: "形・待ち",
    definition: "あと1回手が進めばテンパイになる状態。アガリまでは最短であと2枚です。",
    aliases: ["一向聴"]
  },
  {
    slug: "tenpai",
    term: "テンパイ",
    reading: "てんぱい",
    category: "形・待ち",
    definition: "あと1枚でアガリ形になる状態。リーチをかけるには、基本的に門前でテンパイしている必要があります。",
    related: { label: "テンパイと待ちを覚える", href: "/learn/tenpai-and-wait" }
  },
  {
    slug: "noten",
    term: "ノーテン",
    reading: "のーてん",
    category: "形・待ち",
    definition: "テンパイしていない状態。流局時には、テンパイしている人との間でノーテン罰符を精算することがあります。"
  },
  {
    slug: "machi",
    term: "待ち",
    reading: "まち",
    category: "形・待ち",
    definition: "テンパイ時に、引くか誰かが捨てるとアガリ形になる牌のこと。",
    aliases: ["待ち牌"],
    related: { label: "実践でよく見る待ち", href: "/rules/practical-waits" }
  },
  {
    slug: "ukeire",
    term: "受け入れ",
    reading: "うけいれ",
    category: "形・待ち",
    definition: "引くとシャンテン数が進む牌の種類や残り枚数。広いほど次に手が進みやすくなります。",
    aliases: ["有効牌"],
    related: { label: "牌理チェッカーで比べる", href: "/analysis/mahjong-tool" }
  },
  {
    slug: "furiten",
    term: "フリテン",
    reading: "ふりてん",
    category: "形・待ち",
    definition: "自分の待ち牌をすでに自分で捨てているなどの理由で、ロンできない状態。ツモならアガれます。",
    beginnerNote: "複数待ちでは、待ちのうち1種類でも自分の河にあると全体がフリテンになります。"
  },
  {
    slug: "ryoukei",
    term: "良形",
    reading: "りょうけい",
    category: "形・待ち",
    definition: "受け入れや待ちが広い、アガリやすい形の呼び方。代表例は両面待ちです。",
    related: { label: "牌理チェッカーで良形率を見る", href: "/analysis/mahjong-tool" }
  },
  {
    slug: "gukei",
    term: "愚形",
    reading: "ぐけい",
    category: "形・待ち",
    definition: "待ちが狭い形の呼び方。嵌張・辺張・単騎などを指すことが多い言葉です。"
  },
  {
    slug: "tsumo",
    term: "ツモ",
    reading: "つも",
    category: "進行・行動",
    definition: "山から牌を1枚引くこと。または、自分で引いた牌でアガる「ツモアガリ」を短く呼ぶ言葉です。",
    related: { label: "ツモとロンの違い", href: "/learn/tsumo-and-ron" }
  },
  {
    slug: "dahai",
    term: "打牌",
    reading: "だはい",
    category: "進行・行動",
    definition: "手牌から1枚を選んで捨てること。捨てた牌そのものは捨て牌と呼びます。"
  },
  {
    slug: "kawa",
    term: "河",
    reading: "かわ・ほー",
    category: "進行・行動",
    definition: "各プレイヤーが捨てた牌を順番に並べる場所。相手の狙いや安全牌を読む手掛かりになります。",
    aliases: ["捨て牌"]
  },
  {
    slug: "naki",
    term: "鳴き",
    reading: "なき",
    category: "進行・行動",
    definition: "ほかの人の捨て牌を使って、チー・ポン・カンをすること。手は早くなりますが、リーチできなくなります。",
    aliases: ["副露"],
    related: { label: "鳴きの注意点を読む", href: "/learn/calling" }
  },
  {
    slug: "chi",
    term: "チー",
    reading: "ちー",
    category: "進行・行動",
    definition: "自分の左隣の人が捨てた牌を使い、順子を作る鳴き。数牌でだけ行えます。"
  },
  {
    slug: "pon",
    term: "ポン",
    reading: "ぽん",
    category: "進行・行動",
    definition: "誰かが捨てた牌と手牌の同じ牌2枚を合わせ、刻子を作る鳴きです。"
  },
  {
    slug: "kan",
    term: "カン",
    reading: "かん",
    category: "進行・行動",
    definition: "同じ牌4枚を槓子にする行動。新しいドラ表示牌が増え、嶺上牌を1枚引きます。"
  },
  {
    slug: "ankan",
    term: "暗槓",
    reading: "あんかん",
    category: "進行・行動",
    definition: "自分で同じ牌4枚を集めて行うカン。一般的なルールでは門前の状態を保ちます。"
  },
  {
    slug: "minkan",
    term: "明槓",
    reading: "みんかん",
    category: "進行・行動",
    definition: "牌を公開して行うカンの総称。他家の捨て牌で4枚にする大明槓と、ポンした牌に1枚加える加槓があります。"
  },
  {
    slug: "kakan",
    term: "加槓",
    reading: "かかん",
    category: "進行・行動",
    definition: "すでにポンしている刻子に、同じ牌を1枚加えて行うカン。",
    aliases: ["小明槓"]
  },
  {
    slug: "menzen",
    term: "門前",
    reading: "めんぜん",
    category: "進行・行動",
    definition: "チー・ポン・明槓をしていない状態。リーチや門前ツモなど、門前限定の役を使えます。"
  },
  {
    slug: "riichi",
    term: "リーチ",
    reading: "りーち",
    category: "進行・行動",
    definition: "門前でテンパイしたとき、1000点棒を出して宣言する役。宣言後は基本的に手牌を変えられません。",
    related: { label: "リーチの役を確認する", href: "/rules/reach" }
  },
  {
    slug: "ron",
    term: "ロン",
    reading: "ろん",
    category: "進行・行動",
    definition: "ほかの人が捨てた牌でアガること。放銃した1人が点数を支払います。",
    related: { label: "ツモとロンの違い", href: "/learn/tsumo-and-ron" }
  },
  {
    slug: "ryuukyoku",
    term: "流局",
    reading: "りゅうきょく",
    category: "進行・行動",
    definition: "誰もアガらないまま山の牌がなくなり、その局が終わること。通常はテンパイ・ノーテンを確認します。"
  },
  {
    slug: "te-dashi",
    term: "手出し",
    reading: "てだし",
    category: "進行・行動",
    definition: "ツモった牌ではなく、もともと手牌にあった牌を捨てること。手牌の構成が変わった手掛かりになります。"
  },
  {
    slug: "tsumogiri",
    term: "ツモ切り",
    reading: "つもぎり",
    category: "進行・行動",
    definition: "その巡目に引いた牌を、そのまま捨てること。"
  },
  {
    slug: "yaku",
    term: "役",
    reading: "やく",
    category: "点数・ルール",
    definition: "アガるために必要な、牌の形や状況に付けられた条件。役が1つ以上なければ基本的にアガれません。",
    related: { label: "麻雀役一覧を見る", href: "/rules/yaku" }
  },
  {
    slug: "han",
    term: "翻",
    reading: "はん・ふぁん",
    category: "点数・ルール",
    definition: "役やドラの価値を表す単位。翻数が増えるほど、基本的に点数が高くなります。",
    aliases: ["飜"]
  },
  {
    slug: "fu",
    term: "符",
    reading: "ふ",
    category: "点数・ルール",
    definition: "面子の種類、待ち方、アガリ方などから計算する点数の単位。翻と組み合わせて点数を決めます。",
    related: { label: "点数計算の基本を読む", href: "/rules/practical-score" }
  },
  {
    slug: "mangan",
    term: "満貫",
    reading: "まんがん",
    category: "点数・ルール",
    definition: "基本点が上限に達した点数区分。一般的に5翻、または条件を満たした3翻・4翻の手が該当します。"
  },
  {
    slug: "haneman",
    term: "跳満",
    reading: "はねまん",
    category: "点数・ルール",
    definition: "6翻または7翻のアガリにつく点数区分。"
  },
  {
    slug: "baiman",
    term: "倍満",
    reading: "ばいまん",
    category: "点数・ルール",
    definition: "8翻から10翻のアガリにつく点数区分。"
  },
  {
    slug: "sanbaiman",
    term: "三倍満",
    reading: "さんばいまん",
    category: "点数・ルール",
    definition: "11翻または12翻のアガリにつく点数区分。"
  },
  {
    slug: "yakuman",
    term: "役満",
    reading: "やくまん",
    category: "点数・ルール",
    definition: "国士無双や大三元など、通常の翻数計算とは別枠の非常に高い役。",
    related: { label: "役満を牌姿で見る", href: "/rules/yaku#yakuman" }
  },
  {
    slug: "oya",
    term: "親",
    reading: "おや",
    category: "点数・ルール",
    definition: "各局で東家を担当するプレイヤー。子よりアガリ点が高く、ツモられたときの支払いも大きくなります。"
  },
  {
    slug: "ko",
    term: "子",
    reading: "こ",
    category: "点数・ルール",
    definition: "親以外の3人のプレイヤー。南家・西家・北家が該当します。"
  },
  {
    slug: "bakaze",
    term: "場風",
    reading: "ばかぜ",
    category: "点数・ルール",
    definition: "現在の場を表す風。東場なら東、南場なら南を3枚そろえると全員に役がつきます。"
  },
  {
    slug: "jikaze",
    term: "自風",
    reading: "じかぜ",
    category: "点数・ルール",
    definition: "その局で自分に割り当てられた風。自風牌を3枚そろえると役牌になります。",
    aliases: ["門風"]
  },
  {
    slug: "renchan",
    term: "連荘",
    reading: "れんちゃん",
    category: "点数・ルール",
    definition: "親がアガる、またはルールに定められた条件を満たし、次の局も同じ人が親を続けること。"
  },
  {
    slug: "honba",
    term: "本場",
    reading: "ほんば",
    category: "点数・ルール",
    definition: "連荘や流局が続いた回数を表すもの。増えるとアガリ時の支払いに追加点が加わります。"
  },
  {
    slug: "kyoutaku",
    term: "供託",
    reading: "きょうたく",
    category: "点数・ルール",
    definition: "リーチ宣言などで卓上に出された1000点棒。次にアガった人が受け取るのが一般的です。"
  },
  {
    slug: "kyoku",
    term: "局",
    reading: "きょく",
    category: "点数・ルール",
    definition: "配牌から誰かのアガリ、または流局までの1回のゲーム単位。東1局、東2局のように数えます。"
  },
  {
    slug: "hanchan",
    term: "半荘",
    reading: "はんちゃん",
    category: "点数・ルール",
    definition: "東場と南場を行う一般的な対局形式。通常は東1局から南4局まで進みます。"
  },
  {
    slug: "tonpuusen",
    term: "東風戦",
    reading: "とんぷうせん",
    category: "点数・ルール",
    definition: "東場だけを行う短い対局形式。通常は東1局から東4局まで進みます。"
  },
  {
    slug: "oorasu",
    term: "オーラス",
    reading: "おーらす",
    category: "点数・ルール",
    definition: "予定されている最後の局。半荘なら通常は南4局、東風戦なら東4局です。"
  },
  {
    slug: "pai-kouritsu",
    term: "牌効率",
    reading: "はいこうりつ",
    category: "実戦・戦術",
    definition: "より早く、受け入れを広くしてテンパイへ近づくための牌の残し方・切り方の考え方です。",
    related: { label: "牌理チェッカーを使う", href: "/analysis/mahjong-tool" }
  },
  {
    slug: "nanikiru",
    term: "何切る",
    reading: "なにきる",
    category: "実戦・戦術",
    definition: "手牌からどの牌を捨てるかを考える問題や判断。受け入れ、打点、安全度などを比べます。",
    related: { label: "何切るの基本を読む", href: "/learn/basic-nanikiru" }
  },
  {
    slug: "oshi-hiki",
    term: "押し引き",
    reading: "おしひき",
    category: "実戦・戦術",
    definition: "自分のアガリを目指して危険牌を押すか、相手への放銃を避けて降りるかを決める判断です。"
  },
  {
    slug: "betaori",
    term: "ベタオリ",
    reading: "べたおり",
    category: "実戦・戦術",
    definition: "自分のアガリをほぼ諦め、安全な牌を優先して相手への放銃を避ける打ち方です。",
    aliases: ["オリ"]
  },
  {
    slug: "anzenpai",
    term: "安全牌",
    reading: "あんぜんぱい",
    category: "実戦・戦術",
    definition: "特定の相手にロンされにくい、またはロンされないと判断できる牌。状況によって安全度は変わります。",
    aliases: ["安牌"]
  },
  {
    slug: "genbutsu",
    term: "現物",
    reading: "げんぶつ",
    category: "実戦・戦術",
    definition: "相手がすでに自分で捨てている牌。フリテンのルールにより、その相手にはロンされない牌です。"
  },
  {
    slug: "suji",
    term: "スジ",
    reading: "すじ",
    category: "実戦・戦術",
    definition: "両面待ちの関係を使って危険度を考える守備の手掛かり。1-4-7、2-5-8、3-6-9が組になります。",
    beginnerNote: "現物とは違い、スジでも当たることはあります。"
  },
  {
    slug: "kabe",
    term: "壁",
    reading: "かべ",
    category: "実戦・戦術",
    definition: "同じ牌が4枚すべて見えているなどの情報から、作れない順子を推測して安全度を考える方法です。",
    aliases: ["ノーチャンス"]
  },
  {
    slug: "houchuu",
    term: "放銃",
    reading: "ほうじゅう",
    category: "実戦・戦術",
    definition: "自分が捨てた牌で他家にロンされること。振り込みとも呼ばれます。",
    aliases: ["振り込み"]
  },
  {
    slug: "damaten",
    term: "ダマテン",
    reading: "だまてん",
    category: "実戦・戦術",
    definition: "門前でテンパイしてもリーチを宣言せずに構えること。リーチなしでも成立する役が必要です。",
    aliases: ["闇聴"]
  },
  {
    slug: "takame",
    term: "高目",
    reading: "たかめ",
    category: "実戦・戦術",
    definition: "複数の待ち牌のうち、アガったときの点数が高くなる牌。反対は安目です。"
  },
  {
    slug: "yasume",
    term: "安目",
    reading: "やすめ",
    category: "実戦・戦術",
    definition: "複数の待ち牌のうち、アガったときの点数が低くなる牌。反対は高目です。"
  },
  {
    slug: "junme",
    term: "巡目",
    reading: "じゅんめ",
    category: "実戦・戦術",
    definition: "対局が何周進んだかを表す目安。序盤・中盤・終盤の判断に使います。"
  },
  {
    slug: "senkousei",
    term: "先制リーチ",
    reading: "せんせいりーち",
    category: "実戦・戦術",
    definition: "まだ誰もリーチしていない状況で、自分が最初にかけるリーチです。"
  },
  {
    slug: "oikkake-riichi",
    term: "追っかけリーチ",
    reading: "おっかけりーち",
    category: "実戦・戦術",
    definition: "すでにリーチしている相手がいる状況で、あとから自分もリーチすることです。"
  }
];
