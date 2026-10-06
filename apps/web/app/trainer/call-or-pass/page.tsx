import type { Metadata } from "next";
import Link from "next/link";
import { getRobotsPolicy } from "@mahjong-trainer/content-index-policy";
import { JsonLd } from "../../components/JsonLd";
import { InternalLinkCard, SectionTitle } from "../../components/SiteSections";
import { getSiteUrl } from "../../seoConfig";
import { CallTrainingClient } from "./CallTrainingClient";
import { CallComparison, CallHand, callTileName } from "./CallQuestionView";
import { actionLabels, compareCallQuestion, legalCallForms, validateCallQuestion } from "./callModel";
import { parseHand } from "@mahjong-trainer/mahjong-core";
import { callQuestions, callRepresentativeIds } from "./callQuestions";
import styles from "./call.module.css";

const title = "麻雀 鳴く？鳴かない？トレーニング | ポン・チー判断を練習 | 雀フォリオ";
const description = "鳴くかスルーするかを初級・中級・上級の30問で練習。シャンテン数、受け入れ、役、打点、巡目、守備を実際の牌姿で比較する雀フォリオ独自の麻雀教材です。";
const path = "/trainer/call-or-pass";
export const metadata: Metadata = { title, description, alternates: { canonical: path }, robots: getRobotsPolicy(path), openGraph: { title, description, type: "website", url: path } };

const guideSections = [
  { heading: "役・打牌・待ちの順に確かめる", text: "最初に鳴いた後のアガリ役を確認します。チー・ポンができても、リーチや平和、一盃口は鳴くと使えません。ドラは役の代わりにはならないため、役牌・タンヤオ・三色・一通・ホンイツ・対々和など、どの役を残すのかを先に決めます。次に直後に切る牌を選び、最後に待ちの種類と残り枚数を確認します。形だけのテンパイと、役があってアガれるテンパイを分けることが重要です。" },
  { heading: "速度のメリットと、形を固定するデメリット", text: "鳴きでシャンテンが進めば、次に必要な牌の段階を減らせます。しかし面子を固定することで、門前なら使い直せた連続形が分かれ、受け入れが狭くなることもあります。この教材では鳴いた後に1枚切った手牌と、スルーした13枚相当の手牌を比較します。シャンテンの異なる手を受け入れ枚数だけで順位付けせず、まず進行度、次に待ちと打点の順に見てください。" },
  { heading: "役牌は全てポンすればいい？", text: "役牌ポンは役を確保できる強い手段ですが、全ての場面で唯一の正解ではありません。序盤に門前で高い打点を作れそうな手ならスルーも候補です。逆に巡目が深く、ポンしてもドラなどの打点が残るなら、テンパイを取る価値が上がります。代表例では同じ手牌を3巡目と11巡目で比べます。おすすめは局面の条件を含めた教材上の判断で、実戦の期待値を計算した結果ではありません。" },
  { heading: "鳴いてテンパイなら必ず鳴く？", text: "待ちが1種類しかない、待ち牌が全て見えている、フリテンでロンできない、役なしになる場合にはテンパイという名前だけで鳴きを決めません。オーラスで大きな点数が必要なら、安いテンパイより門前の打点を残す判断があります。一方、子のトップでアガれば終了する局面では、役付きテンパイで局を終える価値があります。直撃とツモで必要な点数が違うため、条件はオーラス条件計算でも確認してください。" },
  { heading: "鳴くと守備力はどう変わる？", text: "カンのない手なら、門前の打牌後は13枚、一副露なら10枚、二副露なら7枚の手牌になります。手牌が短くなると、安全牌を残したり形を組み直したりする選択肢が減ります。ただし、鳴いた直後に現物を切れて役付き両面テンパイになるなら、鳴きが攻守の両方に合うこともあります。鳴くこと自体を危険と決めつけず、直後の打牌と、その後にリーチを受けたときの選択を分けて考えます。" },
  { heading: "このトレーニングのルールと限界", text: "問題は雀フォリオが作成した4人打ちの教材牌姿です。喰いタンあり、喰い替えなし、赤牌・本場なしで統一し、リーチのある問題だけ供託を表示します。チーは上家からのみ、ポンは全ての他家から可能です。ロンが選択肢になる牌姿は対象外です。数値は通常形・七対子・国士の既存シャンテン計算を使い、公開した牌だけを差し引いています。省略された河や隠れた他家の手牌は分からないため、枚数は山の実残数やアガリ確率ではありません。" }
];

export default function CallOrPassPage() {
  const prepared = callQuestions.map((question) => { validateCallQuestion(question); return { question, comparison: compareCallQuestion(question), multipleChiForms: legalCallForms(parseHand(question.hand), question.offered, question.offeredBy).filter((form) => form.action === "chi").length > 1 }; });
  const url = `${getSiteUrl()}${path}`;
  return <main className={`shell trainingWorkspacePage ${styles.page}`}>
    <JsonLd data={{ "@context": "https://schema.org", "@type": "WebApplication", name: "鳴く？鳴かない？トレーニング", description, url, applicationCategory: "EducationalApplication", operatingSystem: "Web", inLanguage: "ja" }} />
    <JsonLd data={{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "麻雀トレーニング", item: `${getSiteUrl()}/trainer` }, { "@type": "ListItem", position: 2, name: "鳴く？鳴かない？トレーニング", item: url }] }} />
    <nav className={styles.breadcrumb} aria-label="パンくず"><Link href="/trainer">麻雀トレーニング</Link><span aria-hidden="true">/</span><span>鳴く？鳴かない？</span></nav>
    <header className={`topbar ${styles.header}`}><div><p className="eyebrow">CALL OR PASS</p><h1>鳴く？鳴かない？トレーニング</h1></div><a className="secondaryCta" href="#call-learning">学習ガイド</a></header>
    <CallTrainingClient prepared={prepared} />
    <article className={`trainerLearningContent ${styles.guide}`} id="call-learning">
      <section className="trainerLearningBand"><SectionTitle title="鳴くか迷ったときに見るポイント" description="鳴ける牌だから鳴くのではなく、何を得て何を失うかを比べます。" /><p>役、速度、打点、巡目、点棒、守備の順に整理すると、チー・ポン・スルーを選んだ理由がはっきりします。初級は役とテンパイ、中級は門前の価値と受け入れ、上級は河と点棒まで含めて練習します。判断が分かれる問題には「寄り」を付け、別の選択を一律に誤りとは扱いません。</p></section>
      {guideSections.map((section) => <section className="trainerLearningBand" key={section.heading}><SectionTitle title={section.heading} /><p>{section.text}</p></section>)}
      <section className="trainerLearningBand"><SectionTitle title="5つの牌姿で鳴き判断を比べる" />{callRepresentativeIds.map((id) => {
        const item = prepared.find((q) => q.question.id === id)!;
        const q = item.question;
        return <section className={styles.example} key={id}><h3>{q.title}</h3><p className={styles.small}>{q.roundWind}{q.roundNumber}局 · {q.turn}巡目 · 自分は{q.seatWind}家 · 出た牌：{callTileName(q.offered)}</p><CallHand hand={item.comparison.pass.hand} melds={q.melds} /><p><strong>推奨：{actionLabels[q.recommendedAction]}{q.confidence === "medium" ? "寄り" : ""}</strong></p><p>{q.explanation}</p><details><summary>鳴いた後の形・数値を比べる</summary><CallComparison prepared={item} /></details></section>;
      })}</section>
      <section className="trainerLearningBand"><SectionTitle title="関連学習とツール" /><div className="linkCardGrid"><InternalLinkCard title="鳴いていい手・鳴かない方がいい手" description="役・速度・打点・守備の判断順を復習します。" href="/learn/guides/calling-decision" /><InternalLinkCard title="牌理チェッカー" description="門前の何切る候補と受け入れ・良形率を比較します。" href="/analysis/mahjong-tool" /><InternalLinkCard title="手役の狙いを配牌から比較" description="配牌分析で、どの役へ向かうかを比べます。" href="/analysis/starting-hand" /><InternalLinkCard title="オーラス条件計算" description="直撃・ツモに必要な点数を点棒から確認します。" href="/analysis/orasu-condition" /><InternalLinkCard title="現物・スジ・カベの安全度" description="リーチを受けたときの守備の根拠を整理します。" href="/learn/guides/genbutsu-suji-kabe" /><InternalLinkCard title="初心者ロードマップ" description="ルールや役から順番に学び直せます。" href="/learn/roadmap" /></div></section>
      <section className="trainerLearningBand"><SectionTitle title="ルールの参考" /><p>役の門前条件、食い下がり、フリテン、喰い替えなしの扱いは<a href="https://tenhou.net/man/index.html" target="_blank" rel="noopener noreferrer">天鳳の公式マニュアル</a>を参考にしています。問題の推奨判断は雀フォリオ独自の解説で、天鳳の公式教材ではありません。成績はこのブラウザだけに保存し、外部へ送信しません。</p></section>
    </article>
  </main>;
}
