import type { Metadata } from "next";
import Link from "next/link";
import { getRobotsPolicy } from "@mahjong-trainer/content-index-policy";
import { JsonLd } from "../../components/JsonLd";
import { ArticleTakeaways, ArticleText, type ArticleEmphasis } from "../../components/ArticleHighlights";
import { InternalLinkCard, SectionTitle } from "../../components/SiteSections";
import { getSiteUrl } from "../../seoConfig";
import { CallHand } from "../call-or-pass/CallQuestionView";
import { RiichiTrainingClient } from "./RiichiTrainingClient";
import { RiichiComparison } from "./RiichiQuestionView";
import { actionLabels, prepareRiichiQuestion } from "./riichiModel";
import { riichiQuestions, riichiRepresentativeIds } from "./riichiQuestions";
import shared from "../call-or-pass/call.module.css";

const path = "/trainer/riichi-or-dama";
const title = "麻雀 リーチ？ダマ？トレーニング | 待ち・打点・点棒で判断を練習 | 雀フォリオ";
const description = "リーチかダマかを初級・中級・上級の30問で練習。実際の13枚の牌姿で役、待ち、ロン・ツモ点数、フリテン、オーラス条件を比較する雀フォリオ独自の麻雀教材です。";
export const metadata: Metadata = { title, description, alternates: { canonical: path }, robots: getRobotsPolicy(path), openGraph: { title, description, type: "website", url: path } };

const sections: { heading: string; paragraphs: string[]; emphasis: ArticleEmphasis[] }[] = [
  {
    heading: "まずダマでロンできるか",
    paragraphs: [
      "ダマはリーチを宣言せずにテンパイを続ける選択です。テンパイしていても役がなければ通常のロンはできません。門前ならツモで役が付きますが、ロンの機会も取りたいならリーチを加える価値があります。",
      "役牌のシャンポンは、役牌を刻子にするアガリと、役牌が雀頭になるアガリで条件が変わります。待ちの全てを同じ役・点数として扱わず、アガリ牌ごとに確認しましょう。"
    ],
    emphasis: [{ text: "役がなければ通常のロンはできません", tone: "caution" }, { text: "アガリ牌ごとに確認しましょう", tone: "key" }]
  },
  {
    heading: "待ちと見えている枚数を比べる",
    paragraphs: [
      "両面なら通常は2種類を待ちますが、必ず8枚残っているわけではありません。自分の手牌、ドラ表示牌、河に見えている牌を4枚から引きます。",
      "ここに出る枚数は、隠れた他家の手牌や省略した河を含めない上限です。枚数が多いほど一般にはアガリの機会を取りやすくなりますが、枚数だけから正確なアガリ率は分かりません。"
    ],
    emphasis: [{ text: "必ず8枚残っているわけではありません", tone: "caution" }, { text: "枚数だけから正確なアガリ率は分かりません", tone: "caution" }]
  },
  {
    heading: "リーチの1翻と、ダマの柔軟性",
    paragraphs: [
      "リーチには1翻の加点があり、一発や裏ドラの可能性もあります。この教材の確定点数には一発・裏ドラを加えません。宣言には1,000点の供託が必要で、原則ツモ切りになり、手変わりを選んだり危険牌に対してオリたりする自由を失います。",
      "ダマなら役がある範囲でロンを待ちつつ、次のツモと場況を見て攻守を切り替えられます。今切る牌が安全でも、その後のツモが全て安全になるわけではありません。"
    ],
    emphasis: [{ text: "手変わりを選んだり危険牌に対してオリたりする自由を失います", tone: "caution" }, { text: "次のツモと場況を見て攻守を切り替えられます", tone: "key" }]
  },
  {
    heading: "同じ手でも巡目と点棒で変わる",
    paragraphs: [
      "序盤の悪い待ちでは具体的な良形変化を待つ考えがあります。一方、終盤は手変わりを待てるツモ回数が減ります。トップ維持、ラス回避、逆転では必要な打点も違います。オーラスでは誰からのロンかとツモを分け、4人の点棒を実際に動かして比較します。",
      "自分がリーチしてアガった場合は自分のリーチ棒が戻るため、毎回アガリ点から1,000点を引くのは誤りです。ただし他家のアガリや流局では戻るとは限りません。"
    ],
    emphasis: [{ text: "誰からのロンかとツモを分け", tone: "key" }, { text: "毎回アガリ点から1,000点を引くのは誤りです", tone: "caution" }]
  },
  {
    heading: "フリテンはリーチしても直らない",
    paragraphs: [
      "形を完成させる牌が自分の捨て牌にあると、現在の待ち全体でロンできません。一方の待ちを捨てている場合、もう一方でもロン不可です。リーチを加えて役ができても、この条件は変わりません。",
      "フリテンリーチは本教材のルールでは可能ですが、ツモに限定されます。ダマで手変わりを選ぶ場合も、新しい待ちと自分の河をもう一度照合してください。見逃しによる同巡内フリテンは別に確認が必要です。"
    ],
    emphasis: [{ text: "一方の待ちを捨てている場合、もう一方でもロン不可です", tone: "caution" }, { text: "新しい待ちと自分の河をもう一度照合してください", tone: "key" }]
  },
  {
    heading: "教材の前提と限界",
    paragraphs: [
      "雀フォリオが作成した4人打ちの門前テンパイ30問です。宣言候補の1枚を切った後に残る13枚を表示し、打牌候補は別に示します。何切るそのものや相手の待ちを当てる問題ではありません。赤牌・カン・本場なし、通常の1翻縛り、持ち点1,000点以上かつツモ巡が残る条件を使います。",
      "河は判断に必要な部分だけで、他家の手牌は未知です。表示した現物以外の宣言牌は、危険と判断する情報がない前提です。数値は既存の待ち・点数計算による確定値、推奨は問題の目的に沿った編集判断です。期待値や相手の心理を推定するAIではありません。成績はこのブラウザだけに保存し、外部へ送信しません。"
    ],
    emphasis: [{ text: "推奨は問題の目的に沿った編集判断です", tone: "key" }, { text: "期待値や相手の心理を推定するAIではありません", tone: "caution" }]
  }
];

export default function RiichiOrDamaPage() {
  const prepared = riichiQuestions.map(prepareRiichiQuestion);
  const url = `${getSiteUrl()}${path}`;
  return <main className={`shell trainingWorkspacePage ${shared.page}`}>
    <JsonLd data={{ "@context": "https://schema.org", "@type": "WebApplication", name: "リーチ？ダマ？トレーニング", description, url, applicationCategory: "EducationalApplication", operatingSystem: "Web", inLanguage: "ja" }} />
    <JsonLd data={{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "麻雀トレーニング", item: `${getSiteUrl()}/trainer` }, { "@type": "ListItem", position: 2, name: "リーチ？ダマ？トレーニング", item: url }] }} />
    <nav className={shared.breadcrumb} aria-label="パンくず"><Link href="/trainer">麻雀トレーニング</Link><span aria-hidden="true">/</span><span>リーチ？ダマ？</span></nav>
    <header className={`topbar ${shared.header}`}><div><p className="eyebrow">RIICHI OR DAMA</p><h1>リーチ？ダマ？トレーニング</h1></div><a className="secondaryCta" href="#riichi-learning">学習ガイド</a></header>
    <RiichiTrainingClient prepared={prepared} />
    <article className={`trainerLearningContent articleReadingBody ${shared.guide}`} id="riichi-learning">
      <section className="trainerLearningBand"><SectionTitle title="テンパイから、どうアガリを目指すか" /><p>初級は役と点数、中級は待ち・手変わり・巡目、上級は点棒と相手のリーチまで比べます。1回10問を解いた後に、推奨の理由と実際の点数を復習できます。「リーチ寄り」「ダマ寄り」は唯一の正解ではなく、提示した条件で何を重視するかを学ぶための判断です。</p></section>
      <ArticleTakeaways items={["まずダマの役、次に待ちと点数を確認する", "打点アップと、手変わり・守備の自由を比べる", "フリテンはリーチしても解消しない"]} />
      {sections.map((section) => <section className="trainerLearningBand" key={section.heading}><SectionTitle title={section.heading} />{section.paragraphs.map((paragraph) => <p key={paragraph}><ArticleText text={paragraph} emphasis={section.emphasis} /></p>)}</section>)}
      <section className="trainerLearningBand"><SectionTitle title="5つの牌姿で判断を比べる" />{riichiRepresentativeIds.map((id) => {
        const item = prepared.find((q) => q.question.id === id)!;
        const q = item.question;
        return <section className={shared.example} key={id}><h3>{q.title}</h3><p className={shared.small}>{q.roundWind}{q.roundNumber}局 · {q.turn}巡目 · 自分は{q.seatWind}家 · 打牌候補を除いた13枚</p><CallHand hand={item.hand} /><p><strong>推奨：{actionLabels[q.recommendedAction]}{q.confidence === "medium" ? "寄り" : ""}</strong></p><p>{q.explanation}</p><p className="articleDecisionPoint"><span>判断のポイント</span><strong>{q.checkpoint}</strong></p><details><summary>待ち・ロン・ツモ点数を比べる</summary><RiichiComparison prepared={item} /></details></section>;
      })}</section>
      <section className="trainerLearningBand"><SectionTitle title="解説とツールで復習" /><div className="linkCardGrid"><InternalLinkCard title="リーチかダマかの基本" description="役・待ち・巡目・点棒の判断順を牌図で復習します。" href="/learn/guides/riichi-or-dama" /><InternalLinkCard title="フリテンの基本" description="自分の河と待ち、見逃しの条件を確認します。" href="/learn/guides/furiten-basics" /><InternalLinkCard title="点数計算ツール" description="リーチの有無を変えて、役・翻・符を確かめます。" href="/tools" /><InternalLinkCard title="オーラス条件計算" description="直撃・他家ロン・ツモの必要打点を比べます。" href="/analysis/orasu-condition" /><InternalLinkCard title="ベタオリの基本" description="危険牌を引いたときの守備を復習します。" href="/learn/guides/betaori-basics" /><InternalLinkCard title="鳴く？鳴かない？トレーニング" description="鳴きでも、役・打点・守備を比べます。" href="/trainer/call-or-pass" /></div></section>
      <section className="trainerLearningBand"><SectionTitle title="ルールの参考" /><p>リーチの宣言条件、フリテン、役と符は<a href="https://tenhou.net/man/index.html" target="_blank" rel="noopener noreferrer">天鳳の公式マニュアル</a>と<a href="https://m-league.jp/about/" target="_blank" rel="noopener noreferrer">Mリーグの公式ルール</a>を参照しています。ゲームごとの終局・同点条件は一律ではありません。ここではオーラスの子のアガリで終了し、同点は目標未達とする教材上の比較を使います。問題は両サービスの公式教材・実戦牌譜の転載ではありません。</p></section>
    </article>
  </main>;
}
