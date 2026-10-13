import type { Metadata } from "next";
import Link from "next/link";
import { InternalLinkCard, PageHero, SectionTitle } from "../../components/SiteSections";
import { JsonLd } from "../../components/JsonLd";
import { getSiteUrl } from "../../seoConfig";
import OrasuConditionCalculator from "./OrasuConditionCalculator";
import OrasuWorkedExamples from "./OrasuWorkedExamples";
import styles from "./orasu-condition.module.css";

const title = "オーラス条件計算 | 逆転条件・着順条件を自動計算 | 雀フォリオ";
const description = "麻雀のオーラスでトップ・2着以内・ラス回避に必要なロン点、ツモ点を自動計算。本場・供託・親子・直撃相手・同点条件まで点棒移動で判定します。";

export const metadata: Metadata = { title: { absolute: title }, description, alternates: { canonical: "/analysis/orasu-condition" }, openGraph: { title, description, type: "website", url: "/analysis/orasu-condition" } };

const faq = [
  { q: "供託は入力した持ち点から引きますか？", a: "引きません。このツールでは入力した4人の持ち点を現在の点棒とし、供託はアガった人へ別途1本1,000点を加算します。" },
  { q: "同点なら目標順位を達成した扱いですか？", a: "大会やサービスで規定が異なるため、「同点では未達」と「同点で達成」を選べます。席順による上位扱いは個別ルールとして確認してください。" },
  { q: "誰からロンしても同じ条件ですか？", a: "同じではありません。放銃者の点数が減るため、順位を競う相手からの直撃ほど条件が軽くなることがあります。" },
  { q: "ウマやオカも計算しますか？", a: "しません。局終了直後の持ち点順位だけを計算します。最終成績の順位点は対局ルールを確認してください。" },
  { q: "役満でも届かない場合はどう表示されますか？", a: "このツールが扱う単独役満までの候補で目標に届かなければ、そのルートは「単独役満でも届かない」と表示します。" }
];

export default function OrasuConditionPage() {
  const siteUrl = getSiteUrl();
  const structuredData = [
    { "@context": "https://schema.org", "@type": "WebApplication", name: "オーラス条件計算", url: `${siteUrl}/analysis/orasu-condition`, description, applicationCategory: "GameApplication", operatingSystem: "Web browser", offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" } },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "トップ", item: siteUrl }, { "@type": "ListItem", position: 2, name: "麻雀ツール", item: `${siteUrl}/tools` }, { "@type": "ListItem", position: 3, name: "オーラス条件計算", item: `${siteUrl}/analysis/orasu-condition` }] },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((item) => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } })) }
  ];

  return (
    <main className={`siteMain ${styles.learningPage}`}>
      <JsonLd data={structuredData} />
      <nav className="breadcrumbs" aria-label="パンくずリスト"><Link href="/">トップ</Link><span aria-hidden="true">›</span><Link href="/tools">麻雀ツール</Link><span aria-hidden="true">›</span><span>オーラス条件計算</span></nav>
      <PageHero eyebrow="ORASU CONDITION" title="オーラス条件計算" description="トップ・連対・ラス回避に必要なロン点とツモ点を、4人の点棒移動から計算します。直撃相手、本場、供託、親子の違いも反映します。" />
      <nav className={styles.guideNav} aria-label="オーラス条件計算の案内"><a href="#orasu-calculator">計算する</a><a href="#orasu-usage">入力方法</a><a href="#orasu-examples">4つの計算例</a><a href="#orasu-practice">実戦での活用</a><a href="#orasu-limits">対応範囲</a></nav>
      <OrasuConditionCalculator />

      <section><SectionTitle title="オーラス条件計算とは" description="最終局で「何点をアガれば何着になれるか」を確認するための計算です。" /><div className={styles.learningText}><p>単純な点差だけを見ると、直撃で相手の点数も減ることや、ツモで3人の支払い額が異なることを見落としがちです。このツールは、実際の麻雀点数から4人全員の精算後スコアを作り、目標順位へ届く最小の合法点を探します。</p><p>結果は「ロン条件」と「ツモ条件」に分けています。ロンは放銃者ごとに表示されるため、トップからの直撃だけ条件が軽い場面もそのまま確認できます。</p></div></section>
      <section id="orasu-usage"><SectionTitle title="入力は、今ある点棒と卓上の供託を分ける" /><ol className={styles.usageSteps}>
        <li><strong>4人の現在の持ち点を100点単位で入力。</strong> この局の東家が親です。起家ではなく、現在の自風に合わせて入力し、自分の席を選びます。リーチ棒を出した人は、すでに1,000点を引いた持ち点にします。</li>
        <li><strong>目標・本場・供託を設定。</strong> トップ、2着以内、ラス回避から選びます。供託は卓上にあるリーチ棒の本数で、アガリ時に別途受け取ります。本場と供託を混同しないでください。</li>
        <li><strong>同点の扱いを確認して計算。</strong> 同点で目標達成になるかは対局規定次第です。分からない場合は両方を試し、結果が変わるか確認します。</li>
        <li><strong>ロン相手・ツモ・精算後の順位を確認。</strong> 「内訳を見る」で4人の点棒移動を開けます。流局を調べる場合は「流局条件」で全員のテンパイ・ノーテンを指定します。</li>
      </ol></section>
      <section><SectionTitle title="結果の見方" description="点数表示だけでなく、内訳を開いて精算後の順位まで確認してください。" /><div className={styles.explanationGrid}><article><h3>ロン条件</h3><p>「東家から2,000点ロン」のように、放銃者ごとの最低条件を表示します。直撃では自分が増え、相手が同額減ります。</p></article><article><h3>ツモ条件</h3><p>子なら「子の支払い・親の支払い」、親なら「オール」で表示します。本場は各支払いへ100点ずつ加わります。</p></article><article><h3>同点条件</h3><p>同点を未達とするか、達成とするかを切り替えられます。大会ごとの上位者決定ルールは別途確認が必要です。</p></article></div></section>
      <section id="orasu-examples"><SectionTitle title="入力して確かめる、4つの計算例" description="本文の数値も、上の計算器と同じ点数・順位判定処理で算出しています。架空の点棒状況による学習例で、実戦牌譜の引用ではありません。" /><OrasuWorkedExamples /></section>
      <section id="orasu-practice"><SectionTitle title="実戦では「必要点」と「自分の手の点数」を照合する" /><div className={styles.learningText}>
        <p>まずロン相手ごとの条件とツモ条件を控え、次に<Link href="/tools">点数計算ツール</Link>で自分の手のアガリ点を確かめます。条件計算の最低点は、今の手牌で必ず作れる点数ではありません。たとえば3,600点という表示が出ても、自分の手が30符なら同じ点数になるとは限りません。翻・符を含めて比較します。</p>
        <p>例1ならトップ直撃と、それ以外からのロンで条件が異なります。「直撃なら届くが、脇からは足りない」と分かれば、対局後に鳴きやリーチの選択を振り返る基準になります。ただし、アガリやすさ・放銃率・裏ドラはこの計算に含みません。必要点が低いルートが、そのまま最善の戦術とは限りません。</p>
        <p>まず計算例を開き、結果を見ずに「直撃・脇ロン・ツモのどれが軽いか」を予想してください。次に本場だけ、同点設定だけを変えて再計算すると、条件が動いた理由を切り分けられます。点数の読み替えに迷う場合は<Link href="/trainer/score">点数計算トレーニング</Link>、リーチ判断と結び付けたい場合は<Link href="/trainer/riichi-or-dama">リーチ？ダマ？トレーニング</Link>で練習できます。</p>
      </div></section>
      <section id="orasu-limits"><SectionTitle title="対応ルールと、この計算だけでは分からないこと" description="競技・アプリごとの最終順位規定は、対局ルールを優先してください。" /><div className={styles.learningText}><p>4人打ちの親・子のロン／ツモを対象とし、1本場はロン300点、ツモ各100点、供託1本は1,000点として精算します。アガリ候補は単独役満まで。流局はテンパイ者とノーテン者の間で合計3,000点を精算します。3人打ちや独自の点数表には対応しません。</p><p>判定するのは、その精算直後に目標の持ち点順位へ届くかどうかです。親の連荘・アガリやめ・西入・終了点の規定までは判定しないため、目標達成の表示が対局終了や最終順位を保証するものではありません。負の持ち点は入力対象外です。</p></div><ul className={styles.limitList}><li>ウマ、オカ、順位点を含む最終スコア</li><li>同点時の起家・席順・前局順位による優先</li><li>ダブロン、トリプルロン、流し満貫などの特殊精算</li><li>複数役満やローカル役による点数</li><li>現在の手牌で成立する役・符や、実現できる打点</li><li>アガリ率・放銃率を含む期待値や押し引きの正解</li></ul></section>
      <section><SectionTitle title="よくある質問" /><div className={styles.faqList}>{faq.map((item) => <details key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>)}</div></section>
      <section><SectionTitle title="関連する麻雀ツールと学習" description="点数そのものの確認や、実戦でよく使う点数パターンの復習はこちらです。" /><div className="linkCardGrid"><InternalLinkCard title="麻雀点数計算ツール" description="手牌、役、符、翻からアガリ点を確認します。" href="/tools" actionLabel="点数計算へ" /><InternalLinkCard title="点数早見表" description="親・子、ロン・ツモの代表点を一覧で確認します。" href="/tools/score-table" actionLabel="早見表へ" /><InternalLinkCard title="点数計算トレーニング" description="問題を解きながら点数計算を練習します。" href="/trainer/score" actionLabel="練習する" /><InternalLinkCard title="実践でよく見る点数計算" description="平和、副露、七対子など頻出パターンを牌姿で学びます。" href="/rules/practical-score" actionLabel="記事を読む" /></div></section>
    </main>
  );
}
