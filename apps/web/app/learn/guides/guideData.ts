import type { TileFigure } from "../../components/TileFigures";

export type LearningGuideSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type LearningGuide = {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  lead: string;
  takeaways: string[];
  sections: LearningGuideSection[];
  figures: TileFigure[];
  toolLink: { href: string; label: string; description: string };
  relatedSlugs: string[];
  screenshot?: { src: string; alt: string; caption: string };
};

export const learningGuides: LearningGuide[] = [
  {
    slug: "tile-efficiency-and-ukeire",
    title: "牌効率と受け入れの基本",
    seoTitle: "麻雀の牌効率と受け入れとは？数え方と何切るの考え方",
    description: "麻雀の牌効率と受け入れを、シャンテン数、有効牌の種類、残り枚数の順に牌図つきで解説します。",
    lead: "牌効率は、アガリへ近づく選択を比べるための土台です。まずシャンテン数を悪化させず、そのうえで次に手が進む牌を数えると、何切るの候補を整理しやすくなります。",
    takeaways: ["シャンテン数を先に比べる", "有効牌は種類と残り枚数を分けて数える", "受け入れ最大が常に実戦の最善とは限らない"],
    sections: [
      {
        heading: "牌効率はアガリまでの距離を縮める考え方",
        paragraphs: [
          "牌効率では、現在の手牌がアガリから何段階離れているかをシャンテン数で確認します。打牌後のシャンテン数が同じ候補同士なら、次にシャンテン数を進める牌が多い方を比べます。",
          "大切なのは、いきなり受け入れ枚数だけを見ないことです。受け入れが多く見えても、シャンテン数を戻してしまう打牌なら、通常は比較の土俵が異なります。"
        ]
      },
      {
        heading: "受け入れは種類と枚数で見る",
        paragraphs: [
          "有効牌の種類は『何種類の牌で前進するか』、受け入れ枚数は『その牌が最大何枚残っているか』です。同じ牌を自分で使っていれば、その分だけ残り枚数は減ります。",
          "たとえば4萬5萬は3萬と6萬の2種類を受けます。どちらも手牌や河に見えていなければ最大8枚ですが、3萬を2枚使っていれば最大6枚です。実戦では場に見えている牌も差し引きます。"
        ]
      },
      {
        heading: "牌効率から外れる判断もある",
        paragraphs: [
          "受け入れ最大は有力な基準ですが、ドラを使い切る、役を残す、安全牌を持つ、放銃を避けるといった目的で別の候補を選ぶことがあります。",
          "まず牌理上の基準を知り、その基準から外れる理由を説明できるようにすることが上達につながります。牌効率は答えを固定するものではなく、判断の出発点です。"
        ],
        bullets: ["序盤は速度と打点の伸びを比較する", "他家から攻撃が入ったら安全度も加える", "オーラスは必要な点数と着順を優先する"]
      }
    ],
    figures: [
      {
        title: "両面とペンチャンの受け入れを比べる",
        description: "どちらもあと1枚で順子になりますが、有効牌の種類と最大枚数が違います。",
        badges: ["受け入れ比較"],
        rows: [
          { label: "両面形", tiles: ["man4", "man5"], resultLabel: "有効牌", resultTiles: ["man3", "man6"], tone: "answer", note: "3萬・6萬の2種、見えていなければ最大8枚です。" },
          { label: "ペンチャン", tiles: ["sou1", "sou2"], resultLabel: "有効牌", resultTiles: ["sou3"], note: "3索の1種、見えていなければ最大4枚です。" }
        ]
      }
    ],
    toolLink: { href: "/analysis/mahjong-tool", label: "牌理チェッカーで受け入れを比較する", description: "14枚の手牌を入力し、打牌候補ごとの有効牌と残り枚数を確認できます。" },
    relatedSlugs: ["good-shape-rate", "mahjong-checker-examples"]
  },
  {
    slug: "good-shape-rate",
    title: "良形率の考え方",
    seoTitle: "麻雀の良形率とは？受け入れ枚数だけでは分からない形の質",
    description: "麻雀の良形率と超良形率の意味を、両面、三面待ち、愚形の違いと受け入れ枚数との使い分けから解説します。",
    lead: "受け入れ枚数が同じでも、その先にできるテンパイの質は同じとは限りません。良形率を見ると、次の一手で両面以上のアガりやすい待ちへ進める可能性を比較できます。",
    takeaways: ["良形率はテンパイ後のアガりやすさを見る補助指標", "受け入れ枚数と良形率は別々に比較する", "巡目や打点によって重視する割合が変わる"],
    sections: [
      {
        heading: "良形率が表しているもの",
        paragraphs: [
          "良形率は、有効牌を引いてテンパイしたときに、両面などのアガりやすい待ちになる割合です。雀フォリオの牌理チェッカーでは、受け入れ枚数だけでは区別しにくい『テンパイの質』を比較するために表示しています。",
          "両面は基本的に2種類・最大8枚を待てます。カンチャンやペンチャンは1種類・最大4枚です。同じテンパイでも、残り枚数と変化の多さに差があります。"
        ]
      },
      {
        heading: "受け入れ枚数との使い分け",
        paragraphs: [
          "最初に、シャンテン数を維持できる候補を確認します。次に受け入れ枚数で速度を比べ、差が小さいときに良形率を見ると判断しやすくなります。",
          "受け入れが少し少なくても、ほとんどが良形テンパイになる候補を選ぶ価値はあります。反対に、終盤でまずテンパイを取りたいなら、形の質より枚数を優先する場面もあります。"
        ]
      },
      {
        heading: "良形率だけで決めない",
        paragraphs: [
          "良形率は未来の形を数値にした目安であり、打点や安全度までは表しません。ドラを切る候補、役が消える候補、安全牌を失う候補は別に評価します。",
          "数値を見る順番を決めておくと便利です。シャンテン数、受け入れ枚数、良形率、打点と守備の順に確認すれば、数字に引っ張られすぎずに比較できます。"
        ],
        bullets: ["序盤は将来の良形変化を残しやすい", "終盤はテンパイ枚数を優先しやすい", "リーチを受けた後は安全度を最優先することがある"]
      }
    ],
    figures: [
      {
        title: "テンパイした後の待ちの質",
        description: "両面とカンチャンでは、アガリ牌の種類と最大枚数が異なります。",
        badges: ["良形", "愚形"],
        rows: [
          { label: "両面待ち", tiles: ["pin4", "pin5"], resultLabel: "待ち", resultTiles: ["pin3", "pin6"], tone: "answer", note: "2種類を待てる基本的な良形です。" },
          { label: "カンチャン", tiles: ["sou3", "sou5"], resultLabel: "待ち", resultTiles: ["sou4"], note: "真ん中1種類だけを待つ形です。" },
          { label: "三面待ち", tiles: ["man2", "man3", "man4", "man5", "man6"], resultLabel: "待ち", resultTiles: ["man1", "man4", "man7"], tone: "answer", note: "3種類を待てるため、両面よりさらに強い形です。" }
        ]
      }
    ],
    toolLink: { href: "/analysis/mahjong-tool", label: "牌理チェッカーで良形率を見る", description: "候補ごとの受け入れ枚数と良形率を同じ画面で比較できます。" },
    relatedSlugs: ["tile-efficiency-and-ukeire", "wait-types"]
  },
  {
    slug: "wait-types",
    title: "麻雀の待ちの種類",
    seoTitle: "麻雀の待ちの種類一覧｜両面・カンチャン・ペンチャン・シャンポン・単騎",
    description: "麻雀の基本的な待ち5種類を、牌図、最大枚数、見分け方とともに初心者向けに解説します。",
    lead: "テンパイしたときは、どの牌でアガれるかだけでなく、どの形が未完成なのかを見ると待ちを見落としにくくなります。まずは両面、カンチャン、ペンチャン、シャンポン、単騎の5種類を押さえます。",
    takeaways: ["待ちは未完成部分から探す", "同じ手牌が複数の待ち方を持つことがある", "自分で使っている牌と場に見えている牌を差し引く"],
    sections: [
      {
        heading: "順子を完成させる3つの待ち",
        paragraphs: [
          "両面待ちは連続する2枚の両側を待つ形です。最大8枚あり、最も基本的な良形です。カンチャンは数字の間、ペンチャンは1・2で3、または8・9で7を待ちます。",
          "カンチャンとペンチャンは基本的に1種類・最大4枚です。ただし、別の部分との組み合わせによって複数の待ちが生まれることがあります。"
        ]
      },
      {
        heading: "同じ牌をそろえる2つの待ち",
        paragraphs: [
          "シャンポン待ちは2つの対子のどちらかが刻子になるのを待ちます。待ちは2種類ですが、自分で各2枚を使っているため最大4枚です。",
          "単騎待ちは雀頭になる1枚を待つ形です。基本は1種類・最大3枚です。単騎は手変わりが多く、場況に合わせて待ちを選びやすい特徴があります。"
        ]
      },
      {
        heading: "複合形では分け方を変えて確認する",
        paragraphs: [
          "5枚以上が連続した形では、順子と雀頭の分け方が複数あります。一つの分け方だけで待ちを決めると、三面待ちやノベタンを見落とします。",
          "端から順子を抜く、反対側から抜く、同じ牌を雀頭として見る、という順番で確認すると見つけやすくなります。"
        ],
        bullets: ["まず完成している面子を外す", "残った部分を左から分ける", "右からも分け直す", "最後に雀頭の位置を変える"]
      }
    ],
    figures: [
      {
        title: "基本の5つの待ち",
        description: "未完成部分とアガリ牌を並べて見比べます。",
        badges: ["待ち一覧"],
        rows: [
          { label: "両面", tiles: ["man4", "man5"], resultLabel: "待ち", resultTiles: ["man3", "man6"], tone: "answer", note: "両側の2種類です。" },
          { label: "カンチャン", tiles: ["pin3", "pin5"], resultLabel: "待ち", resultTiles: ["pin4"], note: "間の1種類です。" },
          { label: "ペンチャン", tiles: ["sou1", "sou2"], resultLabel: "待ち", resultTiles: ["sou3"], note: "端を完成させる1種類です。" },
          { label: "シャンポン", tiles: ["ji1", "ji1", "ji7", "ji7"], resultLabel: "待ち", resultTiles: ["ji1", "ji7"], note: "どちらかの対子を刻子にします。" },
          { label: "単騎", tiles: ["pin5"], resultLabel: "待ち", resultTiles: ["pin5"], note: "雀頭になる同じ牌を待ちます。" }
        ]
      }
    ],
    toolLink: { href: "/rules/practical-waits", label: "実戦でよく見る複合待ちも確認する", description: "ノベタン、亜両面、三面待ちなど、実戦で迷いやすい形を牌図で確認できます。" },
    relatedSlugs: ["good-shape-rate", "mahjong-checker-examples"]
  },
  {
    slug: "mahjong-checker-examples",
    title: "牌理チェッカーの活用例",
    seoTitle: "麻雀牌理チェッカーの使い方｜何切るを受け入れ・良形率で比較",
    description: "雀フォリオの牌理チェッカーを使い、何切るの候補を受け入れ枚数、良形率、有効牌から検証する方法を解説します。",
    lead: "牌理チェッカーは正解だけを受け取る道具ではありません。自分の候補を決めてから数値を比較し、予想と違った理由を牌の形に戻して確認すると、次の対局でも使える学びになります。",
    takeaways: ["先に自分の打牌候補と理由を決める", "シャンテン数・受け入れ・良形率の順に見る", "数値の差を牌姿に戻して説明する"],
    sections: [
      {
        heading: "1. 14枚の手牌を入力する",
        paragraphs: [
          "対局で迷った牌姿や練習したい14枚を入力します。同じ牌は4枚までです。入力が14枚になると、切る牌ごとの比較結果が表示されます。",
          "解析する前に、自分なら何を切るかを一つか二つ決めます。理由も『受け入れが広そう』『両面が残りそう』のように短く言葉にしておきます。"
        ]
      },
      {
        heading: "2. 候補を順番に比較する",
        paragraphs: [
          "最初に進行欄を見て、シャンテン数を悪化させる候補を分けます。次に牌種類と枚数で速度を比べ、差が小さければ良形率と超良形率を見ます。",
          "有効牌の画像を開くと、どの部分が受け入れの差を作っているか確認できます。数字だけで終わらせず、両面、くっつき、複合形のどれが残ったのかを探します。"
        ]
      },
      {
        heading: "3. 実戦条件を最後に足す",
        paragraphs: [
          "チェッカーは手牌の形を比較する道具です。ドラ、河、他家の仕掛け、巡目、点棒状況によって実戦の選択は変わります。牌理上の候補を確認した後に、局面の条件を足してください。",
          "復習では、最善候補を暗記するより『なぜ自分の候補は受け入れが減ったのか』を確認します。見落とした有効牌を一つ覚えるだけでも、次に似た形が出たときの判断が速くなります。"
        ],
        bullets: ["結果を見る前に候補を決める", "上位2候補の有効牌を見比べる", "差を作った形を一つ言葉にする", "局面条件で結論が変わるか考える"]
      }
    ],
    figures: [
      {
        title: "解析前に形の強さを予想する",
        description: "両面、カンチャン、孤立牌など、受け入れを作っている部分を先に探します。",
        badges: ["活用手順"],
        rows: [
          { label: "比較したい形", tiles: ["man4", "man5", "pin3", "pin5", "sou2"], note: "4萬5萬の両面、3筒5筒のカンチャン、孤立2索がそれぞれどの変化を持つか予想します。" },
          { label: "両面の有効牌", tiles: ["man4", "man5"], resultLabel: "有効牌", resultTiles: ["man3", "man6"], tone: "answer", note: "結果画面では、候補ごとにこの内訳を確認します。" }
        ],
        link: { href: "/analysis/mahjong-tool", label: "この考え方で牌理チェッカーを使う" }
      }
    ],
    screenshot: { src: "/tool-screenshots/ukeire-checker-comparison.png", alt: "牌理チェッカーで打牌候補ごとの受け入れ枚数と良形率を比較している画面", caption: "打牌候補ごとに、進行、牌種類、枚数、良形率、有効牌を比較できます。" },
    toolLink: { href: "/analysis/mahjong-tool", label: "牌理チェッカーを開く", description: "サンプル牌姿から試すことも、自分の14枚を入力して比較することもできます。" },
    relatedSlugs: ["tile-efficiency-and-ukeire", "good-shape-rate"]
  }
];

export function getLearningGuide(slug: string) {
  return learningGuides.find((guide) => guide.slug === slug);
}
