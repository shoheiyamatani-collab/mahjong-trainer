import type { Metadata } from "next";
import Link from "next/link";
import { calculateOrasuConditions, formatOrasuCandidate, type OrasuConditionInput } from "@mahjong-trainer/mahjong-core";
import { InternalLinkCard, PageHero, SectionTitle } from "../../components/SiteSections";
import { JsonLd } from "../../components/JsonLd";
import { getSiteUrl } from "../../seoConfig";
import OrasuConditionCalculator from "./OrasuConditionCalculator";
import styles from "./orasu-condition.module.css";

const title = "オーラス条件計算 | 逆転条件・着順条件を自動計算 | 雀フォリオ";
const description = "麻雀のオーラスでトップ・2着以内・ラス回避に必要なロン点、ツモ点を自動計算。本場・供託・親子・直撃相手・同点条件まで点棒移動で判定します。";

export const metadata: Metadata = { title: { absolute: title }, description, alternates: { canonical: "/analysis/orasu-condition" }, openGraph: { title, description, type: "website", url: "/analysis/orasu-condition" } };

const examples: Array<{ title: string; point: string; input: OrasuConditionInput; pick: "east" | "west" | "tsumo" }> = [
  { title: "トップまで3,501点差の子", point: "トップからの直撃なら、相手の失点も同時に効くため条件が軽くなります。", input: { scores: { east: 32000, south: 28500, west: 22000, north: 17500 }, selfSeat: "south", dealerSeat: "east", targetRank: 1, honba: 0, riichiSticks: 0, tiePolicy: "strict" }, pick: "east" },
  { title: "2着順アップは直撃相手が重要", point: "目標の相手からロンできれば、自分の加点と相手の減点を同時に作れます。", input: { scores: { east: 45000, south: 10000, west: 30000, north: 15000 }, selfSeat: "south", dealerSeat: "east", targetRank: 2, honba: 0, riichiSticks: 0, tiePolicy: "strict" }, pick: "west" },
  { title: "本場と供託で条件が変わる", point: "2本場の600点と供託1本の1,000点を、持ち点とは別に精算して判定します。", input: { scores: { east: 32000, south: 28500, west: 22000, north: 17500 }, selfSeat: "south", dealerSeat: "east", targetRank: 1, honba: 2, riichiSticks: 1, tiePolicy: "strict" }, pick: "east" }
];

const faq = [
  { q: "供託は入力した持ち点から引きますか？", a: "引きません。このツールでは入力した4人の持ち点を現在の点棒とし、供託はアガった人へ別途1本1,000点を加算します。" },
  { q: "同点なら目標順位を達成した扱いですか？", a: "大会やサービスで規定が異なるため、「同点では未達」と「同点で達成」を選べます。席順による上位扱いは個別ルールとして確認してください。" },
  { q: "誰からロンしても同じ条件ですか？", a: "同じではありません。放銃者の点数が減るため、順位を競う相手からの直撃ほど条件が軽くなることがあります。" },
  { q: "ウマやオカも計算しますか？", a: "しません。局終了直後の持ち点順位だけを計算します。最終成績の順位点は対局ルールを確認してください。" },
  { q: "役満でも届かない場合はどう表示されますか？", a: "このツールが扱う単独役満までの候補で目標に届かなければ、そのルートは「単独役満でも届かない」と表示します。" }
];

export default function OrasuConditionPage() {
  const siteUrl = getSiteUrl();
  const exampleResults = examples.map((example) => ({ ...example, result: calculateOrasuConditions(example.input) }));
  const structuredData = [
    { "@context": "https://schema.org", "@type": "WebApplication", name: "オーラス条件計算", url: `${siteUrl}/analysis/orasu-condition`, description, applicationCategory: "GameApplication", operatingSystem: "Web browser", offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" } },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "トップ", item: siteUrl }, { "@type": "ListItem", position: 2, name: "麻雀ツール", item: `${siteUrl}/tools` }, { "@type": "ListItem", position: 3, name: "オーラス条件計算", item: `${siteUrl}/analysis/orasu-condition` }] },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((item) => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } })) }
  ];

  return (
    <main className="siteMain">
      <JsonLd data={structuredData} />
      <nav className="breadcrumbs" aria-label="パンくずリスト"><Link href="/">トップ</Link><span aria-hidden="true">›</span><Link href="/tools">麻雀ツール</Link><span aria-hidden="true">›</span><span>オーラス条件計算</span></nav>
      <PageHero eyebrow="ORASU CONDITION" title="オーラス条件計算" description="トップ・連対・ラス回避に必要なロン点とツモ点を、4人の点棒移動から計算します。直撃相手、本場、供託、親子の違いも反映します。" />
      <OrasuConditionCalculator />

      <section><SectionTitle title="オーラス条件計算とは" description="最終局で「何点をアガれば何着になれるか」を確認するための計算です。" /><div className={styles.learningText}><p>単純な点差だけを見ると、直撃で相手の点数も減ることや、ツモで3人の支払い額が異なることを見落としがちです。このツールは、実際の麻雀点数から4人全員の精算後スコアを作り、目標順位へ届く最小の合法点を探します。</p><p>結果は「ロン条件」と「ツモ条件」に分けています。ロンは放銃者ごとに表示されるため、トップからの直撃だけ条件が軽い場面もそのまま確認できます。</p></div></section>
      <section><SectionTitle title="結果の見方" description="点数表示だけでなく、内訳を開いて精算後の順位まで確認してください。" /><div className={styles.explanationGrid}><article><h3>ロン条件</h3><p>「東家から2,000点ロン」のように、放銃者ごとの最低条件を表示します。直撃では自分が増え、相手が同額減ります。</p></article><article><h3>ツモ条件</h3><p>子なら「子の支払い・親の支払い」、親なら「オール」で表示します。本場は各支払いへ100点ずつ加わります。</p></article><article><h3>同点条件</h3><p>同点を未達とするか、達成とするかを切り替えられます。大会ごとの上位者決定ルールは別途確認が必要です。</p></article></div></section>
      <section><SectionTitle title="計算例" description="直撃相手、本場、供託によって条件が変わる代表例です。" /><div className={styles.exampleGrid}>{exampleResults.map((example) => { const condition = example.pick === "tsumo" ? example.result.tsumo : example.result.ron[example.pick]; return <article key={example.title}><p className={styles.kicker}>EXAMPLE</p><h3>{example.title}</h3><strong>{condition ? formatOrasuCandidate(condition.candidate) : "単独役満でも届かない"}</strong><p>{example.point}</p></article>; })}</div></section>
      <section><SectionTitle title="このツールで計算しないもの" description="競技・アプリごとの最終順位規定は、対局ルールを優先してください。" /><ul className={styles.limitList}><li>ウマ、オカ、順位点を含む最終スコア</li><li>同点時の起家・席順・前局順位による優先</li><li>ダブロン、トリプルロン、流し満貫などの特殊精算</li><li>複数役満やローカル役による点数</li></ul></section>
      <section><SectionTitle title="よくある質問" /><div className={styles.faqList}>{faq.map((item) => <details key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>)}</div></section>
      <section><SectionTitle title="関連する麻雀ツールと学習" description="点数そのものの確認や、実戦でよく使う点数パターンの復習はこちらです。" /><div className="linkCardGrid"><InternalLinkCard title="麻雀点数計算ツール" description="手牌、役、符、翻からアガリ点を確認します。" href="/tools" actionLabel="点数計算へ" /><InternalLinkCard title="点数早見表" description="親・子、ロン・ツモの代表点を一覧で確認します。" href="/tools/score-table" actionLabel="早見表へ" /><InternalLinkCard title="点数計算トレーニング" description="問題を解きながら点数計算を練習します。" href="/trainer/score" actionLabel="練習する" /><InternalLinkCard title="実践でよく見る点数計算" description="平和、副露、七対子など頻出パターンを牌姿で学びます。" href="/rules/practical-score" actionLabel="記事を読む" /></div></section>
    </main>
  );
}
