import type { Metadata } from "next";
import Link from "next/link";
import { getRobotsPolicy } from "@mahjong-trainer/content-index-policy";
import { JsonLd } from "../../components/JsonLd";
import { ArticleTakeaways } from "../../components/ArticleHighlights";
import { InternalLinkCard, SectionTitle } from "../../components/SiteSections";
import { getSiteUrl } from "../../seoConfig";
import { comboTheoryFaq } from "../../learn/guides/comboTheoryGuide";
import { ComboTrainingClient } from "./ComboTrainingClient";

const path = "/trainer/combo-theory";
const title = "麻雀 コンボ理論トレーニング | 待ちの組み合わせを計算・比較 | 雀フォリオ";
const description = "両面・カンチャン・ペンチャン・シャンポン・単騎のコンボ数を計算。4モードのseed問題生成、フリテン判定、実戦形式、任意入力シミュレーターで守備の数え方を練習します。";
export const metadata: Metadata = { title, description, alternates: { canonical: path }, robots: getRobotsPolicy(path), openGraph: { title, description, url: path, type: "website" } };

export default function ComboTheoryPage() {
  const url = `${getSiteUrl()}${path}`;
  return <main className="shell trainingWorkspacePage" data-tone="decisions">
    <JsonLd data={{ "@context": "https://schema.org", "@type": "WebApplication", name: "コンボ理論トレーニング", url, description, applicationCategory: "EducationalApplication", operatingSystem: "Web", inLanguage: "ja" }} />
    <JsonLd data={{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "麻雀トレーニング", item: `${getSiteUrl()}/trainer` }, { "@type": "ListItem", position: 2, name: "コンボ理論トレーニング", item: url }] }} />
    <nav aria-label="パンくず" className="platformPopularSearches"><Link href="/trainer">麻雀トレーニング</Link><span>コンボ理論</span></nav>
    <header className="topbar"><div><p className="eyebrow">COMBO THEORY</p><h1>コンボ理論トレーニング</h1><p>待ちの形を数え、スジ・カベ・フリテンの違いを確かめる。</p></div><Link className="secondaryCta" href="/learn/guides/combo-theory">コンボ理論とは？</Link></header>
    <ComboTrainingClient />
    <article className="trainerLearningContent articleReadingBody" id="combo-learning">
      <section className="trainerLearningBand"><SectionTitle title="待ちの組み合わせを見える数で学ぶ" /><p>コンボ数は、見えていない物理牌から局所的な待ちの形を作る選び方の数です。自分の手牌、河、副露、ドラ表示牌を4枚から引き、必要な形が何通り残るかを確認します。牌の危険度を一つの実測放銃率に置き換えるツールではありません。</p></section>
      <ArticleTakeaways items={["両面と愚形、縦待ちを分けて数える", "対リーチでは両面のもう片側の河も見る", "少ないコンボを実戦の唯一の正解とは扱わない"]} />
      <section className="trainerLearningBand"><SectionTitle title="4モードと学ぶ順番" /><ol><li>計算：両面の掛け算から始め、カンチャン・ペンチャン・縦待ちへ進みます。</li><li>比較：指標をそろえ、2〜3牌の数の差を答えます。</li><li>実戦形式：既存の麻雀卓表示から、可視枚数とリーチ者の河を拾います。</li><li>シミュレーター：見えている牌を変え、どの項が減るかを確認します。</li></ol><p>同じseed・モード・難易度なら同じ問題を再現します。実戦形式は検証済みの合成教材を生成し、14枚の自分の手牌、河、副露、ドラ表示牌と隠れた手牌・山を合わせて136枚となることを内部検証しています。実牌譜の転載ではありません。</p></section>
      <section className="trainerLearningBand"><SectionTitle title="計算の前提・フリテンの範囲" /><p>異なる2牌のターツは残り枚数の積、同じ牌の対子はR×(R−1)÷2、単騎はRで数えます。本人の捨て牌によるフリテンは対リーチモデルのみ適用します。他家の河は可視枚数に含めますが、本人のフリテンにはしません。鳴かれた牌は河と副露で二重に数えません。</p><p>シャンポンの別の対子が不明なら条件付きの数です。シミュレーターの相方指定で追加の除外を試せます。通常手の局所形だけを対象にし、七対子・国士無双・複雑な多面待ち、全手牌の成立、役、見逃しフリテン、相手の実際のテンパイ確率は確定しません。</p></section>
      <section className="trainerLearningBand"><SectionTitle title="FAQ" />{comboTheoryFaq.map(row => <details key={row.question}><summary>{row.question}</summary><p>{row.answer}</p></details>)}</section>
      <section className="trainerLearningBand"><SectionTitle title="記事と実戦判断につなげる" /><div className="linkCardGrid"><InternalLinkCard title="コンボ理論の数え方と牌図" href="/learn/guides/combo-theory" description="6つの局所牌図、スジ・カベ、フリテン、計算の限界を確認します。" /><InternalLinkCard title="スジの守備" href="/learn/guides/suji-defense" description="除外できる両面と、残る別の形を区別します。" /><InternalLinkCard title="カベの守備" href="/learn/guides/kabe-defense" description="4枚見えとワンチャンスを比べます。" /><InternalLinkCard title="押す？オリる？" href="/trainer/push-or-fold" description="コンボ数だけでなく、手牌価値・安全牌・点棒状況を確認します。" /></div></section>
    </article>
  </main>;
}
