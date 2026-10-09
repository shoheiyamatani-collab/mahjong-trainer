import type { Metadata } from "next";
import Link from "next/link";
import { getRobotsPolicy } from "@mahjong-trainer/content-index-policy";
import { ArticleTakeaways, ArticleText } from "../../components/ArticleHighlights";
import { JsonLd } from "../../components/JsonLd";
import { InternalLinkCard, SectionTitle } from "../../components/SiteSections";
import { getSiteUrl } from "../../seoConfig";
import { preparePushFoldQuestion } from "./pushFoldAnalysis";
import { buildPushFoldCorpus } from "./pushFoldQuestions";
import { PushFoldTrainingClient } from "./PushFoldTrainingClient";
import { PushFoldHand, shantenLabel } from "./PushFoldQuestionView";
import { actionLabels } from "./pushFoldTypes";
import shared from "../call-or-pass/call.module.css";

const path = "/trainer/push-or-fold";
const title = "麻雀 押す？オリる？トレーニング | 手牌価値・安全牌・着順を比べる | 雀フォリオ";
const description = "他家のリーチや仕掛けに対し、手牌価値・安全牌・巡目・点棒を比較する麻雀トレーニング。初級・中級・上級60問で、役・受け入れ・現物・スジ・カベ・オーラス条件を復習できます。";
export const metadata: Metadata = { title, description, alternates: { canonical: path }, robots: getRobotsPolicy(path), openGraph: { title, description, type: "website", url: path } };

const sections = [
  { heading: "押し引きとは", paragraphs: ["押し引きは、自分のアガリを目指す価値と、相手への失点を避ける価値を比較する判断です。押すとは危険を無視して何でも切ることではありません。今の一打が現物なら、安全にテンパイを保ち、次のツモで改めて判断する選択もあります。", "オリると決めた後は、受け入れの最大化より放銃回避を優先します。面子や雀頭を崩してシャンテンが戻っても、守備という目的に沿っていれば、それだけで失敗とはいえません。回し打ちの自由度まで比べたい局面は、押す・オリるの唯一の正解として扱いません。"] },
  { heading: "押し引きを考える5つの基本要素", paragraphs: ["1. 距離：テンパイなら次にアガリ牌を待てます。1シャンテンではテンパイするための進行がまだ必要です。受け入れが多くても、現在のアガリの待ち枚数とは違います。", "2. 手牌価値：成立する役、ドラ・赤、親子、ロン・ツモの違いを確認します。未完成手の候補役や裏ドラを、確定したアガリ点には含めません。", "3. 今切る牌：現物の根拠を相手ごとに照合します。複数リーチなら、片方の現物というだけで押せるとは限りません。", "4. 残りの機会：巡目だけでなく、残り山と次の安全牌も見ます。終盤のテンパイには流局時の価値がありますが、未来の危険牌まで安全になるわけではありません。", "5. 局・点棒・目的：平場の加点と、オーラスのトップ維持・ラス回避は目的が違います。誰からのロンか、ツモか、親の連荘かを分けて実際の点棒を動かします。"] },
  { heading: "現物・スジ・カベの違い", paragraphs: ["現物は対象の相手自身の捨て牌です。その相手は自分の河にある牌でロンできません。Aさんの現物を、Bさんへの安全牌にそのまま流用しないことが大切です。画面にない見逃しや同巡内フリテンは推定しません。", "スジは両面の経路に関する情報です。5筒の両側を否定するには2筒と8筒を両方確認します。一方だけでは反対側の両面が残ります。スジでもカンチャン・単騎などの待ちは残るため、安全の保証ではありません。", "カベは同じ牌が4枚見えて、相手がその牌を使った順子を持てない情報です。3筒が4枚見える場合、2筒をアガリ牌にする該当両面の経路を消せますが、2筒単騎などは別です。3枚見えのワンチャンスでは、残り1枚を相手が持つ余地があります。自分の手牌も見えた枚数に含め、鳴かれた河の牌は副露と二重に数えません。"] },
  { heading: "テンパイとイーシャンテンの違い", paragraphs: ["テンパイは形を完成させる牌を待つ状態です。ただし副露した役なし手は、テンパイでも通常アガれません。ドラだけでは役にならず、流局時の形テンパイとアガリの利益を区別する必要があります。", "1シャンテンは、有効牌を引いて打牌し、その後にアガリを待つ段階が残っています。ここで示す受け入れは、シャンテン数を進める牌の公開情報上の上限です。他家の手牌や王牌の内訳は不明なので、実際の山の残枚数やアガリ率を表しません。", "フリテンのテンパイは待ち全体でロン不可です。役があっても、リーチを加えても、この条件は直りません。ツモできるかはアガリ形と役を別に確認します。"] },
  { heading: "教材の評価ロジックと限界", paragraphs: ["雀フォリオが作成した60の固定教材を難易度別に10問ずつ抽選します。牌の個体IDで136枚を配分し、自分の14枚相当、河と副露の取得元、赤各1枚、点棒と供託、リーチ成立可能な隠れ手の整合性を確認しています。隠れた手牌と山の内訳はブラウザへ渡さず、推奨にも使用しません。", "これは局面スナップショットの検証であり、配牌からの全操作履歴を再生した実牌譜ではありません。手出し・ツモ切り記録から待ちを当てる問題ではなく、リーチ後のツモ切りなどの設定も全履歴の合法性の証明とは扱いません。カン・途中流局・自分が既にリーチ済みの局面は対象外です。", "シャンテン・受け入れ・役・点数・公開枚数は既存の計算で確認します。押し引きの推奨は、教材の目的に沿う編集判断で、期待値の計算結果・公式の最適解・専門家の監修ではありません。スジやカベから架空の放銃確率を生成しません。", "正答率は推奨が明確な教材だけを集計します。押し寄り・オリ寄り・判断が分かれる問題は理由を比較する教材とし、許容別解は誤答に数えません。任意の打牌選択は、選んだ方針の教材候補との一致を別集計します。候補以外がすべて違法または悪手という意味ではありません。", "通常の4人打ち、喰いタンあり、赤各1枚を採用します。供託・本場を含み、流局のノーテン罰符は他家の未知のテンパイ状態を条件別に試算します。目標判定では同点相手を自分より上として数え、親のアガリ・テンパイは連荘とし、アガリやめは使いません。ルールや目的が違う対局へ結論だけを転用しないでください。"] }
];
const faqs = [
  { question: "リーチされたら、必ずオリるのですか？", answer: "必ずではありません。自分の進行度、待ち、役と打点、今切る牌、巡目、点棒の目的を比べます。現物でテンパイを維持する一打と、その後の危険牌まで押す方針も区別します。" },
  { question: "スジやカベがあれば安全ですか？", answer: "現物と同じ安全保証ではありません。特定の両面経路を否定する情報であり、単騎・シャンポン・カンチャンなどは別に残ります。画面では残り得る待ちも表示します。" },
  { question: "オリ寄りの問題で押したら誤答ですか？", answer: "許容別解として設定した選択なら妥当な別解と表示し、通常の誤答と区別します。判断が分かれる問題は正答率の分母にも含めません。" },
  { question: "成績や手牌は外部へ送信されますか？", answer: "このトレーニングの成績は、このブラウザのlocalStorageだけに保存します。保存が使えない環境でも画面上で練習・復習できます。履歴からは保存データを削除できます。" }
];

export default function PushOrFoldPage() {
  // Static export fails on any invalid published lesson. Audit hands stay server-side.
  const prepared = buildPushFoldCorpus().map(({ question }) => preparePushFoldQuestion(question));
  const url = `${getSiteUrl()}${path}`;
  return <main data-tone="decisions" className={`shell trainingWorkspacePage ${shared.page}`}>
    <JsonLd data={{ "@context": "https://schema.org", "@type": "WebApplication", name: "押す？オリる？トレーニング", description, url, applicationCategory: "EducationalApplication", operatingSystem: "Web", inLanguage: "ja" }} />
    <JsonLd data={{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "麻雀トレーニング", item: `${getSiteUrl()}/trainer` }, { "@type": "ListItem", position: 2, name: "押す？オリる？", item: url }] }} />
    <JsonLd data={{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) }} />
    <nav className={shared.breadcrumb} aria-label="パンくず"><Link href="/trainer">麻雀トレーニング</Link><span aria-hidden="true">/</span><span>押す？オリる？</span></nav>
    <header className={`topbar ${shared.header}`}><div><p className="eyebrow">PUSH OR FOLD</p><h1>押す？オリる？トレーニング</h1></div><a className="secondaryCta" href="#push-fold-learning">学習ガイド</a></header>
    <PushFoldTrainingClient prepared={prepared} />
    <p><Link href="/trainer/combo-theory">コンボ理論トレーニングで、スジ・カベ・フリテンから待ちの組み合わせを数える</Link></p>
    <article id="push-fold-learning" className={`trainerLearningContent articleReadingBody ${shared.guide}`}>
      <section className="trainerLearningBand"><SectionTitle title="このトレーニングで分かること" /><p>相手の攻撃に対して、手を進める価値と失点を避ける価値を自分で比べる練習です。初級は進行度と役、中級は待ちと安全情報、上級は着順や流局の条件まで扱います。安全牌を選ぶだけの問題とは違い、まず「手を続けるか」を考え、その後に最初の一打を比較します。</p></section>
      <ArticleTakeaways items={["進行度・役と打点・今切る牌・残りの機会・点棒の目的を比べる", "現物は相手ごと。スジ・カベは安全の保証ではない", "計算で確認する事実と、教材上の戦術推奨を分ける"]} />
      {sections.map((section) => <section className="trainerLearningBand" key={section.heading}><SectionTitle title={section.heading} />{section.paragraphs.map((text) => <p key={text}><ArticleText text={text} emphasis={[{ text: "安全の保証ではありません", tone: "caution" }, { text: "全操作履歴を再生した実牌譜ではありません", tone: "caution" }, { text: "教材の目的に沿う編集判断", tone: "key" }, { text: "役なし手は、テンパイでも通常アガれません", tone: "caution" }]} /></p>)}</section>)}
      <section className="trainerLearningBand"><SectionTitle title="実戦での判断例を比べる" />{["beginner-03", "beginner-02", "intermediate-08"].map((id) => {
        const item = prepared.find((p) => p.question.id.endsWith(id))!, q = item.question;
        return <section className={shared.example} key={id}><h3>{q.title}</h3><p className={shared.small}>{q.roundWind}{q.roundNumber}局・{q.turn}巡目・自分は{q.seatWind}家・14枚相当</p><PushFoldHand question={q} /><p><strong>推奨：{actionLabels[q.recommendedAction]}{q.recommendationStrength !== "clear" ? "寄り（別解あり）" : ""}</strong> ／ 押す候補後：{shantenLabel(q.expected.pushShanten)}</p><p>{q.reasoning.join(" ")}</p><p className="articleDecisionPoint"><span>次に確認すること</span><strong>{q.changes.join(" ")}</strong></p></section>;
      })}</section>
      <section className="trainerLearningBand"><SectionTitle title="よくある質問" />{faqs.map((faq) => <details className={shared.example} key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</section>
      <section className="trainerLearningBand"><SectionTitle title="関連記事とトレーニング" /><div className="linkCardGrid"><InternalLinkCard title="ベタオリの基本" href="/learn/guides/betaori-basics" description="守備へ切り替えた後、現物と次巡の安全牌を比べます。" /><InternalLinkCard title="現物・スジ・カベの違い" href="/learn/guides/genbutsu-suji-kabe" description="否定できる待ちと残る危険を牌図で整理します。" /><InternalLinkCard title="牌理チェッカー" href="/analysis/mahjong-tool" description="門前手の進行度と打牌候補を詳しく比較します。" /><InternalLinkCard title="点数計算ツール" href="/tools" description="役・翻・符・親子の点数を確認します。" /><InternalLinkCard title="リーチ？ダマ？" href="/trainer/riichi-or-dama" description="打点アップと、オリる自由を比較します。" /><InternalLinkCard title="鳴く？鳴かない？" href="/trainer/call-or-pass" description="鳴きの役・速度・打点と守備を比べます。" /><InternalLinkCard title="オーラス条件計算" href="/analysis/orasu-condition" description="直撃・ツモ・他家ロンによる必要打点を試算します。" /></div></section>
      <section className="trainerLearningBand"><SectionTitle title="ルールの参考" /><p>役、フリテン、リーチ条件、供託などのルールは<a href="https://tenhou.net/man/index.html">天鳳公式マニュアル</a>と<a href="https://m-league.jp/about/">Mリーグ公式ルール</a>を参照しています。戦術上の押し引き推奨は両サービスの公式判断ではなく、雀フォリオが独自に作成した比較教材です。実測の放銃データや専門家による戦術監修は今後の改善項目です。</p></section>
    </article>
  </main>;
}
