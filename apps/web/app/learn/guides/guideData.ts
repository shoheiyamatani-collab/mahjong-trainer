import { countsToTiles, GOOD_WAIT_THRESHOLD, SUPER_GOOD_WAIT_THRESHOLD, parseHand } from "@mahjong-trainer/mahjong-core";
import { tileAssetName, type TileFigure } from "../../components/TileFigures";
import { CHECKER_SAMPLE_HAND } from "../../tools/toolLearningExamples";
import { getCheckerLearningResults } from "../../tools/toolLearningResults";
import { requestedLearningGuides } from "./requestedGuideData";
import { ruleComparisonGuide } from "./ruleComparisonGuide";
import { practicalLearningGuides } from "./practicalGuideData";
import { comboTheoryGuide } from "./comboTheoryGuide";
import { scoreOrasuCaseStudy } from "./scoreOrasuCaseStudy";
import { availablePracticalGuides } from "./practicalArticles";
import type { StudyCase } from "./practicalArticles/types";

export type LearningGuideSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  table?: { caption: string; headers: string[]; rows: string[][] };
  sources?: { label: string; href: string }[];
  caseStudies?: StudyCase[];
};

export type LearningGuidePracticeItem = {
  prompt: string;
  tiles: string[];
  conditions: string;
  answer: string;
  explanation: string;
};

export type LearningGuidePractice = {
  heading: string;
  description: string;
  items: LearningGuidePracticeItem[];
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
  practice?: LearningGuidePractice;
  additionalTools?: { href: string; label: string; description: string }[];
  editorial?: { createdAt: string; updatedAt: string; publishedAt?: string };
  library?: { category: "decision" | "defense" | "judgment" | "scoring"; keywords: string; level: "初級" | "中級" | "上級"; themes: string[] };
};

const goodShapeExample = getCheckerLearningResults()[0]!;
const goodShapePercent = Math.round(goodShapeExample.goodShapeRate * 100);
const superGoodShapePercent = Math.round(goodShapeExample.superGoodShapeRate * 100);
const checkerExampleHref = `/analysis/mahjong-tool?hand=${encodeURIComponent(parseHand(CHECKER_SAMPLE_HAND).join(","))}#checker-workspace`;

const foundationalLearningGuides: LearningGuide[] = [
  {
    slug: "tile-efficiency-and-ukeire",
    title: "牌効率と受け入れの基本",
    seoTitle: "麻雀の牌効率と受け入れとは？数え方と何切るの考え方",
    description: "麻雀の牌効率と受け入れを、シャンテン数、有効牌の種類、残り枚数の順に牌図つきで解説します。",
    lead: "牌効率の意味を理解したら、実際の牌姿で受け入れを数えてみましょう。この実践記事では、シャンテン数を悪化させない候補を残し、有効牌の種類と残り枚数を計算する手順を解説します。用語から確認したい方は「牌効率とは何か」から読むと進めやすくなります。",
    takeaways: ["シャンテン数を先に比べる", "有効牌は種類と残り枚数を分けて数える", "受け入れ最大が常に実戦の最善とは限らない"],
    sections: [
      {
        heading: "実践ではシャンテン数から候補を絞る",
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
    relatedSlugs: ["what-is-tile-efficiency", "good-shape-rate", "mahjong-checker-examples", "visible-tiles-and-ukeire"]
  },
  {
    slug: "good-shape-rate",
    title: "良形率の考え方",
    seoTitle: "麻雀の良形率とは？受け入れ枚数だけでは分からない形の質",
    description: "麻雀の良形率と超良形率の意味を、両面、三面待ち、愚形の違いと受け入れ枚数との使い分けから解説します。",
    lead: "受け入れ枚数が同じでも、その先にできるテンパイの質は同じとは限りません。ここでは、雀フォリオの牌理チェッカーが何を分母にし、どんな待ちを良形と数えるかを、同じ14枚を入力して再現できる例で解説します。",
    takeaways: ["良形率はアガリ率ではなく、有効牌を引いた先の形の指標", `このチェッカーの良形は理論上${GOOD_WAIT_THRESHOLD}枚以上、超良形は${SUPER_GOOD_WAIT_THRESHOLD}枚以上の待ち`, "有効牌の種類数ではなく、引ける理論枚数で重み付けする"],
    sections: [
      {
        heading: "良形率が表しているもの",
        paragraphs: [
          `このチェッカーでは、打牌後が一向聴の候補について、有効牌を1枚引いてから最も待ち枚数の広いテンパイを選びます。その待ちが理論上${GOOD_WAIT_THRESHOLD}枚以上なら良形、${SUPER_GOOD_WAIT_THRESHOLD}枚以上なら超良形として数えます。待ちの名前だけで判定するのではありません。`,
          "分母はテンパイに進む有効牌の理論枚数です。分子は、そのうち良形のテンパイを選べるツモ牌の理論枚数。『良形になるツモの種類÷全有効牌の種類』ではありません。また、二向聴以下の候補はこの一向聴用指標の比較対象ではありません。"
        ]
      },
      {
        heading: "14枚の実例で計算を再現する",
        paragraphs: [
          `下の14枚から1筒を切ると、一向聴で受け入れは${goodShapeExample.ukeireTypes}種・${goodShapeExample.ukeireTiles}枚です。そのうち${goodShapeExample.goodShapeTiles}枚分のツモで良形テンパイを選べるため、${goodShapeExample.goodShapeTiles}÷${goodShapeExample.ukeireTiles}を整数に丸めた${goodShapePercent}%が良形率です。`,
          `超良形になるツモは${goodShapeExample.superGoodShapeTiles}枚分なので、${goodShapeExample.superGoodShapeTiles}÷${goodShapeExample.ukeireTiles}で${superGoodShapePercent}%。これは今から${goodShapePercent}%の確率でアガれる、あるいは次のツモで${goodShapePercent}%の確率でテンパイする、という意味ではありません。`
        ],
        table: {
          caption: "1筒切りの計算内訳（河・副露・ドラ表示牌を含まない理論値）",
          headers: ["項目", "数える対象", "結果"],
          rows: [
            ["受け入れ", "テンパイへ進むツモ", `${goodShapeExample.ukeireTiles}枚`],
            ["良形率", `待ち${GOOD_WAIT_THRESHOLD}枚以上を選べるツモ`, `${goodShapeExample.goodShapeTiles} / ${goodShapeExample.ukeireTiles} → ${goodShapePercent}%`],
            ["超良形率", `待ち${SUPER_GOOD_WAIT_THRESHOLD}枚以上を選べるツモ`, `${goodShapeExample.superGoodShapeTiles} / ${goodShapeExample.ukeireTiles} → ${superGoodShapePercent}%`]
          ]
        }
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
          "この計算は通常の4面子1雀頭を対象にしています。七対子・国士無双の最善手、フリテン、役の有無、他家が持つ牌やツモ順は評価しません。河・副露・ドラ表示牌の見え枚数も反映しないため、画面の枚数を実際の残り山と読み替えないでください。",
          "数値を見る順番を決めておくと便利です。シャンテン数、受け入れ枚数、良形率を確認し、打点と守備を別に比較します。高い良形率は、手を進める判断材料の一つです。"
        ],
        bullets: ["序盤は将来の良形変化を残しやすい", "終盤はテンパイ枚数を優先しやすい", "リーチを受けた後は安全度を最優先することがある"]
      }
    ],
    figures: [
      {
        title: "同じ14枚をチェッカーで確かめる",
        description: "副露なしの14枚です。1筒を切る候補の受け入れと良形率を比べてください。",
        rows: [{ label: "入力する14枚", tiles: countsToTiles(parseHand(CHECKER_SAMPLE_HAND)).map((tile) => tileAssetName(tile)) }],
        link: { href: checkerExampleHref, label: "この14枚を入力して結果を見る" }
      },
      {
        title: "テンパイした後の待ちの質",
        description: "以下は手牌全体ではなく、待ちを作る部分だけの模式図です。残りの面子や使っている同種牌により、手牌全体の待ち枚数は変わります。",
        badges: ["良形", "愚形"],
        rows: [
          { label: "両面待ち", tiles: ["pin4", "pin5"], resultLabel: "待ち", resultTiles: ["pin3", "pin6"], tone: "answer", note: "2種類を待てる基本的な良形です。" },
          { label: "カンチャン", tiles: ["sou3", "sou5"], resultLabel: "待ち", resultTiles: ["sou4"], note: "真ん中1種類だけを待つ形です。" },
          { label: "三面待ち", tiles: ["man2", "man3", "man4", "man5", "man6"], resultLabel: "待ち", resultTiles: ["man1", "man4", "man7"], tone: "answer", note: "3種類を待てるため、両面よりさらに強い形です。" }
        ]
      }
    ],
    toolLink: { href: checkerExampleHref, label: "牌理チェッカーで良形率を見る", description: "この記事と同じ14枚を読み込み、1筒切りの受け入れ・良形率・超良形率を確認できます。" },
    relatedSlugs: ["tile-efficiency-and-ukeire", "wait-types", "riichi-or-dama"]
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
    relatedSlugs: ["good-shape-rate", "mahjong-checker-examples", "furiten-basics"]
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
    relatedSlugs: ["tile-efficiency-and-ukeire", "good-shape-rate", "visible-tiles-and-ukeire"]
  }
];

export const learningGuides: LearningGuide[] = [
  ...foundationalLearningGuides,
  ...requestedLearningGuides,
  ruleComparisonGuide,
  ...practicalLearningGuides,
  comboTheoryGuide,
  scoreOrasuCaseStudy,
  ...availablePracticalGuides()
];

export function getLearningGuide(slug: string) {
  return learningGuides.find((guide) => guide.slug === slug);
}
