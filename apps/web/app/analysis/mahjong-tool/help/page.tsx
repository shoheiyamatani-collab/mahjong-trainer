import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "../../../components/JsonLd";
import { getSiteUrl } from "../../../seoConfig";

export const metadata: Metadata = {
  title: "牌理チェッカーとは？使い方と結果の見方",
  description: "雀フォリオの牌理チェッカーで比較できるシャンテン数、受け入れ枚数、良形率、超良形率の意味と、実戦での使い方・注意点を説明します。",
  alternates: { canonical: "/analysis/mahjong-tool/help" }
};

const steps = [
  ["14枚の手牌を入力する", "画面の牌を押して手牌を作ります。入力した牌を外すときは、手牌側の牌を押します。"],
  ["打牌候補を比べる", "14枚そろうと、切る牌ごとのシャンテン数、受け入れの種類と枚数が表示されます。"],
  ["形の質まで確認する", "イーシャンテンでは良形率と超良形率も見て、次のツモでどんなテンパイへ進みやすいかを比べます。"],
  ["実戦条件を加えて判断する", "最後にドラ、打点、巡目、安全度、点棒状況を加え、その局で選ぶ一打を決めます。"]
] as const;

export default function MahjongCheckerHelpPage() {
  const siteUrl = getSiteUrl();
  const url = `${siteUrl}/analysis/mahjong-tool/help`;
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      headline: "牌理チェッカーとは？使い方と結果の見方",
      description: metadata.description,
      url,
      inLanguage: "ja-JP",
      about: ["麻雀", "牌効率", "受け入れ", "良形率"]
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "雀フォリオ", item: siteUrl },
        { "@type": "ListItem", position: 2, name: "牌理チェッカー", item: `${siteUrl}/analysis/mahjong-tool` },
        { "@type": "ListItem", position: 3, name: "使い方", item: url }
      ]
    }
  ];

  return (
    <main className="siteMain analysisHelpPage toolHelpPage">
      <JsonLd data={structuredData} />
      <div className="analysisHelpTopline">
        <div>
          <p className="siteEyebrow">Mahjong Checker Help</p>
          <h1>牌理チェッカーとは？</h1>
          <p className="toolHelpLead">切る牌ごとに受け入れと形の質を比べ、感覚だけでは気づきにくい差を見つけるための解析ツールです。</p>
        </div>
        <Link href="/analysis/mahjong-tool">牌理チェッカーを使う</Link>
      </div>

      <nav className="analysisHelpNav" aria-label="ページ内メニュー">
        <a href="#overview">分かること</a>
        <a href="#how-to-use">使い方</a>
        <a href="#results">結果の見方</a>
        <a href="#example">活用例</a>
        <a href="#practice">実戦での扱い</a>
        <a href="#limits">ツールの限界</a>
      </nav>

      <section className="analysisHelpSection" id="overview">
        <h2>牌理チェッカーで分かること</h2>
        <p>14枚の手牌を入力すると、現在のシャンテン数を確認し、切れる牌を候補ごとに比較できます。各候補には、打牌後のシャンテン数、次に引くと手が進む有効牌、その種類数と残り枚数が表示されます。</p>
        <p>イーシャンテンの候補では、テンパイした後に何枚のアガリ牌が残るかも調べています。その結果を良形率・超良形率として表示するため、受け入れ枚数が同じ候補でも「次にどれだけ強い待ちを作りやすいか」まで比較できます。</p>
        <div className="toolHelpSummaryGrid">
          <div><strong>速度</strong><span>シャンテン数と受け入れ枚数</span></div>
          <div><strong>広さ</strong><span>有効牌の種類と内訳</span></div>
          <div><strong>形の質</strong><span>良形率と超良形率</span></div>
        </div>
      </section>

      <section className="analysisHelpSection" id="how-to-use">
        <h2>基本の使い方</h2>
        <ol className="toolHelpSteps">
          {steps.map(([title, description], index) => (
            <li key={title}><span>{index + 1}</span><div><h3>{title}</h3><p>{description}</p></div></li>
          ))}
        </ol>
        <p className="analysisNotice">同じ牌は4枚まで入力できます。牌姿をすぐ試したいときは「サンプル牌姿」、最初から作り直すときは「手牌をクリア」を使います。</p>
      </section>

      <section className="analysisHelpSection" id="results">
        <h2>計算結果の見方</h2>
        <dl className="toolHelpDefinitions">
          <div><dt>打牌</dt><dd>この牌を切った後の結果です。「☆」は、シャンテン数を悪化させず、受け入れ枚数と良形への進みやすさを基準に選ばれた候補です。</dd></div>
          <div><dt>進行</dt><dd>打牌後のシャンテン数です。数字が小さいほどテンパイに近く、聴牌はあと1枚でアガリの状態です。</dd></div>
          <div><dt>牌種類</dt><dd>手を進める有効牌が何種類あるかを表します。種類数が多いほど、複数のツモに対応できます。</dd></div>
          <div><dt>枚数</dt><dd>有効牌が最大何枚残っているかを、入力した手牌で使っている枚数を差し引いて数えます。</dd></div>
          <div><dt>良形率</dt><dd>有効牌を引いたとき、最善の打牌を選ぶと5枚以上のアガリ牌が残るテンパイへ進める割合です。</dd></div>
          <div><dt>超良形率</dt><dd>有効牌を引いたとき、9枚以上のアガリ牌が残る強いテンパイへ進める割合です。</dd></div>
          <div><dt>有効牌</dt><dd>引くことでシャンテン数が1つ以上進む牌です。イーシャンテンなら、表示された牌がテンパイへの受け入れになります。</dd></div>
        </dl>
      </section>

      <section className="analysisHelpSection" id="example">
        <h2>使い方の具体例</h2>
        <p>候補Aが28枚、候補Bが24枚なら、速度だけを見れば候補Aが優勢です。ただし候補Aの良形率が低く、候補Bからは両面テンパイへ進みやすい場合、4枚の差と待ちの質を比べる意味があります。</p>
        <p>おすすめの使い方は、対局後に迷った14枚を再現し、まず自分が選んだ打牌と受け入れ最大の打牌を比べることです。次に有効牌の画像を見て、見落としていたくっつきや複合形を探します。数字を暗記するより、「なぜこの牌を残すと受けが増えるのか」を牌姿で確認すると復習しやすくなります。</p>
        <nav className="toolHelpRelatedLinks" aria-label="牌理チェッカーの関連解説">
          <Link href="/learn/guides/tile-efficiency-and-ukeire">牌効率と受け入れを学ぶ</Link>
          <Link href="/learn/guides/good-shape-rate">良形率の考え方を学ぶ</Link>
          <Link href="/learn/guides/mahjong-checker-examples">牌理チェッカーの活用例を見る</Link>
        </nav>
      </section>

      <section className="analysisHelpSection" id="practice">
        <h2>数値を実戦でどう扱うか</h2>
        <p>受け入れ枚数は、手を早く進めるための土台です。しかし、実戦の一打は受け入れ最大だけで決まりません。高打点の手役やドラを残す価値、終盤の安全度、親番、順位、供託や本場などによって優先順位は変わります。</p>
        <p>序盤の平場では速度と形の比較に使い、打点条件がある局では役やドラを先に確認します。相手からリーチが入っている場面では、牌理上の最善打より安全な牌を選ぶこともあります。「牌理上は何が一番広いか」を確認したうえで、局面の条件を加えるのが基本です。</p>
      </section>

      <section className="analysisHelpSection" id="limits">
        <h2>ツールの限界と注意点</h2>
        <ul>
          <li>入力した14枚の手牌だけを基準にした牌理比較です。河、副露、ドラ表示牌、他家の手牌は自動評価しません。</li>
          <li>残り枚数は、自分の手牌で使っている牌を4枚から差し引いた最大値です。場に見えている牌は別途考慮してください。</li>
          <li>打点、役の確定度、安全度、押し引き、点棒状況を含む期待値計算ではありません。</li>
          <li>良形率は、5枚以上を良形、9枚以上を超良形として数える雀フォリオ独自の比較指標です。実戦の勝率そのものではありません。</li>
        </ul>
      </section>

      <section className="analysisNotice toolHelpFinish">
        <h2>迷った牌姿で試してみる</h2>
        <p>対局で迷った14枚を入力し、候補ごとの受け入れと形の質を比べてみましょう。</p>
        <Link className="analysisBackButton" href="/analysis/mahjong-tool">牌理チェッカーを開く</Link>
      </section>
    </main>
  );
}
