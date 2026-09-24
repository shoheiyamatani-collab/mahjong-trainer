import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "../../components/JsonLd";
import { getSiteUrl } from "../../seoConfig";

export const metadata: Metadata = {
  title: "麻雀点数計算ツールとは？入力方法と結果の見方",
  description: "手牌・副露・和了条件を入力して役、翻、符、ロン・ツモの支払いを確認する麻雀点数計算ツールの使い方と注意点を説明します。",
  alternates: { canonical: "/tools/help" }
};

const steps = [
  ["手牌を入力する", "牌を押して手牌を作ります。鳴いている場合は、チー・ポン・カン・暗カンを副露欄へ追加します。"],
  ["和了牌を選ぶ", "入力した手牌の中から、最後にロンまたはツモした牌を選びます。待ち方の符を判定するために必要です。"],
  ["和了条件を設定する", "親・子、ロン・ツモ、場風、自風、リーチ、一発、ドラ、本場、供託を実際の局面に合わせます。"],
  ["役・翻・符と支払いを見る", "結果欄で点数、満貫などの区分、役の内訳、符の内訳、支払う人ごとの点数を確認します。"]
] as const;

export default function ScoreCalculatorHelpPage() {
  const siteUrl = getSiteUrl();
  const url = `${siteUrl}/tools/help`;
  return (
    <main className="siteMain analysisHelpPage toolHelpPage">
      <JsonLd data={[
        { "@context": "https://schema.org", "@type": "TechArticle", headline: "麻雀点数計算ツールとは？入力方法と結果の見方", description: metadata.description, url, inLanguage: "ja-JP", about: ["麻雀", "点数計算", "符計算", "翻数"] },
        { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
          { "@type": "ListItem", position: 1, name: "雀フォリオ", item: siteUrl },
          { "@type": "ListItem", position: 2, name: "麻雀点数計算ツール", item: `${siteUrl}/tools` },
          { "@type": "ListItem", position: 3, name: "使い方", item: url }
        ] }
      ]} />
      <div className="analysisHelpTopline">
        <div>
          <p className="siteEyebrow">Score Calculator Help</p>
          <h1>麻雀点数計算ツールとは？</h1>
          <p className="toolHelpLead">アガリ形と条件を入力し、役・翻・符からロンとツモの支払いまでを順番に確認できるツールです。</p>
        </div>
        <Link href="/tools">点数計算ツールを使う</Link>
      </div>

      <nav className="analysisHelpNav" aria-label="ページ内メニュー">
        <a href="#overview">計算できること</a><a href="#how-to-use">入力手順</a><a href="#results">結果の見方</a>
        <a href="#example">具体例</a><a href="#practice">覚え方</a><a href="#limits">対応範囲</a>
      </nav>

      <section className="analysisHelpSection" id="overview">
        <h2>このツールで計算できること</h2>
        <p>門前の手だけでなく、チー・ポン・カン・暗カンを含むアガリ形を入力できます。親か子か、ロンかツモか、場風・自風、リーチや一発、ドラ、本場、供託を指定すると、成立する役と翻数、符、最終的な支払いをまとめて表示します。</p>
        <div className="toolHelpSummaryGrid">
          <div><strong>役と翻</strong><span>成立した役を内訳で確認</span></div>
          <div><strong>符</strong><span>待ち・面子・アガリ方を分解</span></div>
          <div><strong>支払い</strong><span>ロン・ツモ、親・子を反映</span></div>
        </div>
      </section>

      <section className="analysisHelpSection" id="how-to-use">
        <h2>入力から計算までの手順</h2>
        <ol className="toolHelpSteps">
          {steps.map(([title, description], index) => <li key={title}><span>{index + 1}</span><div><h3>{title}</h3><p>{description}</p></div></li>)}
        </ol>
        <p className="analysisNotice">和了牌は必ず選択してください。同じ完成形でも、どの牌でアガったかによって単騎・嵌張・辺張などの待ちの符が変わることがあります。</p>
      </section>

      <section className="analysisHelpSection" id="results">
        <h2>計算結果の見方</h2>
        <dl className="toolHelpDefinitions">
          <div><dt>点数</dt><dd>本場と供託を反映した受け取り点の合計です。ツモでは、支払う人ごとの点数も表示します。</dd></div>
          <div><dt>区分</dt><dd>通常計算、満貫、跳満、倍満、三倍満、役満のどこに当たるかを示します。</dd></div>
          <div><dt>翻</dt><dd>成立した役とドラの合計です。役の欄では、どの役が何翻として数えられたかを確認できます。</dd></div>
          <div><dt>符</dt><dd>副底、門前ロン、ツモ、雀頭、面子、待ち方などの内訳と、切り上げ前・切り上げ後の符を表示します。</dd></div>
          <div><dt>支払い</dt><dd>ロンなら放銃者の支払い、子のツモなら親と子、親のツモなら子全員の支払いを分けて表示します。</dd></div>
        </dl>
      </section>

      <section className="analysisHelpSection" id="example">
        <h2>使い方の具体例</h2>
        <p>たとえば、子の門前手でリーチをかけてロンした場合は、手牌と和了牌を入力し、「子」「ロン」「リーチ」を選びます。場風と自風を合わせ、ドラがあれば枚数を入力すると、役・翻・符とロン点が表示されます。</p>
        <p>結果を見るときは、最終点だけで終わらせず「どの役が付いたか」「符はどこで増えたか」を確認してください。同じ牌姿でロンをツモへ切り替えたり、親と子を切り替えたりすると、支払いの違いを比較できます。</p>
        <nav className="toolHelpRelatedLinks" aria-label="点数計算の関連ページ">
          <Link href="/tools/score-table">点数早見表を見る</Link>
          <Link href="/rules/practical-score">実戦でよく見る点数計算を学ぶ</Link>
          <Link href="/trainer#score-beginner">点数計算問題を解く</Link>
        </nav>
      </section>

      <section className="analysisHelpSection" id="practice">
        <h2>数値を実戦でどう覚えるか</h2>
        <p>最初からすべての符と点数を暗記する必要はありません。まずは自分のアガリを入力して、役と翻を自力で予想してから答え合わせします。次に符の内訳を見て、待ちや暗刻・明刻で増えた部分を確認します。</p>
        <p>よく出る30符・40符の点数を早見表で覚え、迷った形だけツールで分解すると効率的です。点数計算問題と組み合わせれば、入力して確認する段階から、牌姿を見て答える段階へ進めます。</p>
      </section>

      <section className="analysisHelpSection" id="limits">
        <h2>対応範囲と注意点</h2>
        <ul>
          <li>一般的な日本のリーチ麻雀の役・符・点数計算を対象にしています。</li>
          <li>赤ドラは専用牌として区別せず、ドラ欄へ合計枚数を入力します。</li>
          <li>責任払い、流し満貫、ダブル役満の扱いなど、採用ルールによって結果が変わる特殊条件は対局ルールを優先してください。</li>
          <li>入力した完成形と条件を計算するツールです。見えていない裏ドラや、対局中の最適な押し引きは判定しません。</li>
        </ul>
      </section>

      <section className="analysisNotice toolHelpFinish">
        <h2>実際のアガリを入力する</h2>
        <p>牌姿と条件を再現し、最終点だけでなく役と符の内訳まで確認してみましょう。</p>
        <Link className="analysisBackButton" href="/tools">点数計算ツールを開く</Link>
      </section>
    </main>
  );
}
