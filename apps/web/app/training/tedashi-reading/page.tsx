import type { Metadata } from "next";
import { getRobotsPolicy } from "@mahjong-trainer/content-index-policy";
import { ArticleTileFigures } from "../../components/TileFigures";
import { InternalLinkCard, SectionTitle } from "../../components/SiteSections";
import { JsonLd } from "../../components/JsonLd";
import { getSiteUrl } from "../../seoConfig";
import { TedashiTrainingClient } from "./TedashiTrainingClient";
import { loadTrainingQuestions } from "./data/loadQuestions";
import styles from "./tedashi.module.css";

const title = "手出し・ツモ切りから手牌変化を読む";
const description = "相手の河と手出し・ツモ切りを見て、牌譜で実際に起きた手牌変化を学ぶ麻雀トレーニング。回答後に手牌を公開し、推測と事実の違いを確認します。";
export const metadata: Metadata = { title, description, alternates: { canonical: "/training/tedashi-reading" }, robots: getRobotsPolicy("/training/tedashi-reading"), openGraph: { title, description, type: "website", url: "/training/tedashi-reading" } };
const faq = [
  { q: "河だけで相手の手牌を当てられますか？", a: "当てられません。同じ河になる手牌は複数あります。この練習は牌譜の実例を通じて候補を絞る材料を学ぶもので、透視や確定的な読みを保証しません。" },
  { q: "手出しなら必ず手が進んでいますか？", a: "いいえ。テンパイ維持の待ち替え、同じ種類の牌の入れ替え、安全牌を残す選択などもあります。ツモ前の手牌と打牌後の手牌を比べ、進行度が変わったかを確認します。" },
  { q: "ベタオリや回し打ちが正解になりますか？", a: "本人の意図は正解にしません。手牌の形が崩れた、シャンテン数が戻った、特定の牌を残した、といった事実と、守備へ移った可能性という解釈を分けます。" },
  { q: "問題には実在のプレイヤー名が載りますか？", a: "載りません。問題では局・本場・席・巡目と元牌譜の出典だけを扱い、対局者の名前、段位、レートは保持しません。" }
];

export default function TedashiReadingPage() {
  const { questions, mode } = loadTrainingQuestions();
  const url = `${getSiteUrl()}/training/tedashi-reading`;
  return <main className={`shell trainingWorkspacePage ${styles.page}`}>
    <JsonLd data={{ "@context": "https://schema.org", "@type": "WebApplication", name: "手出し読みトレーニング", description, url, applicationCategory: "EducationalApplication", operatingSystem: "Web", inLanguage: "ja" }} />
    <JsonLd data={{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "麻雀トレーニング", item: `${getSiteUrl()}/trainer` }, { "@type": "ListItem", position: 2, name: "手出し読みトレーニング", item: url }] }} />
    <header className={`topbar ${styles.header}`}><div><p className="eyebrow">TEDASHI READING</p><h1>{title}</h1><p>河から候補を考え、回答後に実際の手牌と照らし合わせます。</p></div><a className="secondaryCta" href="#tedashi-guide">学習ガイド</a></header>
    <TedashiTrainingClient questions={questions} mode={mode} />
    <article className={`trainerLearningContent ${styles.guide}`} id="tedashi-guide">
      <section className="trainerLearningBand"><SectionTitle title="このトレーニングで分かること" /><p>手出しの前後でどの牌が残ったのか、ツモ切りの間に手牌が変わらなかったのかを、実際の牌譜と比較して学びます。正解は対局者の思考ではなく、復元した手牌・待ち・シャンテン数です。序盤の孤立字牌切りや、形の解釈が曖昧な局面を大量に出すのではなく、検品した例から取り組みます。</p></section>
      <section className="trainerLearningBand"><SectionTitle title="手出しとツモ切りとは" /><div className="toolGuideColumns"><section><h3>手出し</h3><p>以前から持っていた牌の個体を切ることです。引いた牌と同じ種類の牌を切っても、別の個体なら手出し（空切り）になります。見た目の数字だけでは区別できません。</p></section><section><h3>ツモ切り</h3><p>今引いた牌の個体をそのまま切ることです。鳴きやカンが間に入らなければ、ツモ前の手牌が残ります。河では牌の下の「手」「ツモ」を確認してください。</p></section></div></section>
      <section className="trainerLearningBand"><SectionTitle title="なぜ最後の手出しを見るのか" /><p>手出しの後にツモ切りが続くと、その間は同じ手牌が保たれていたことが牌譜から分かります。ただし、最後の手出しが必ずテンパイ打牌とは限りません。テンパイを維持した待ち替えや、安全牌との入れ替えもあるため、過去の手出し、鳴き、巡目を合わせて複数の候補を残します。</p></section>
      <section className="trainerLearningBand"><SectionTitle title="面子固定とは" /><p>ここでは「手出し後に完成面子候補が残った変化」を便宜的に面子固定と呼びます。4567から7を切れば456が残りますが、その人が456を固定する意図だったとは断定できません。344556のような重なり合う形を、ひとつの面子に決めつけないことが大切です。</p></section>
      <ArticleTileFigures figures={[{ title: "4枚形から完成面子候補が残る例", description: "これは説明用に作った合成例で、実在の天鳳牌譜ではありません。ツモ牌の東を残し、7萬を手出ししています。", rows: [{ label: "打牌直前・14枚", tiles: ["man4", "man5", "man6", "man7", "pin1", "pin2", "pin3", "sou7", "sou8", "sou9", "ji1", "ji1", "ji1", "ji6"] }, { label: "打牌直後・13枚", tiles: ["man4", "man5", "man6", "pin1", "pin2", "pin3", "sou7", "sou8", "sou9", "ji1", "ji1", "ji1", "ji6"], tone: "answer", note: "456萬が残ったことは事実です。相手の意図や、その後も必ず残すことまでは分かりません。" }] }]} />
      <section className="trainerLearningBand"><SectionTitle title="実戦例の見比べ方" /><p>まず河だけを見て、自分の候補をひとつ考えます。回答後は打牌直前と直後の手牌、そしてツモ前の13枚相当の進行度を比較します。副露がある場合は手牌が7枚や10枚になるため、副露を含めて確認します。14枚から1枚切る前後だけではシャンテンが進んだか分かりにくく、ツモ前と打牌後を同じ枚数条件で比べることが重要です。</p></section>
      <section className="trainerLearningBand"><SectionTitle title="この読みの限界" /><ul><li>河だけから相手の手牌を完全に当てることはできません。</li><li>同じ手出しでも、手牌進行・待ち替え・守備など複数の事情があります。</li><li>受け入れは見えている牌による枚数で、山の正確な残数ではありません。</li><li>牌譜で形が崩れたことと、本人がベタオリを決めたことは同じではありません。</li><li>この教材は学習補助であり、実戦の安全度や押し引きを保証しません。</li></ul></section>
      <section className="trainerLearningBand"><SectionTitle title="よくある質問" /><div className="toolGuideFaq">{faq.map((item) => <details key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>)}</div></section>
      <section className="trainerLearningBand"><SectionTitle title="関連学習" /><div className="linkCardGrid"><InternalLinkCard title="現物・スジ・カベの安全度" description="手牌読みだけに頼らず、守備の根拠を比べます。" href="/learn/guides/genbutsu-suji-kabe" /><InternalLinkCard title="待ちの種類" description="両面、カンチャン、単騎などを復習します。" href="/learn/guides/wait-types" /><InternalLinkCard title="牌理チェッカー" description="自分の手牌の受け入れと良形率を比較します。" href="/analysis/mahjong-tool" /></div></section>
      <nav className="trainerLearningBand trainerNextNav" aria-label="関連トレーニング"><SectionTitle title="関連トレーニング" /><div><a href="/trainer/iishanten">イーシャンテン何切る</a><a href="/trainer/seven-tile">7枚形の待ち</a><a href="/trainer">すべての麻雀トレーニング</a></div></nav>
    </article>
  </main>;
}
