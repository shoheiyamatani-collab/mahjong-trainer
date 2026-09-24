import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "../../../components/JsonLd";
import { getSiteUrl } from "../../../seoConfig";

export const metadata: Metadata = {
  title: "受け入れMAX星人何切るとは？遊び方と復習方法",
  description: "イーシャンテンから最大受け入れの打牌を選ぶ受け入れMAX星人何切るの遊び方、結果の読み方、牌効率の練習に生かす方法を説明します。",
  alternates: { canonical: "/trainer/ukeire-max/help" }
};

export default function UkeireMaxHelpPage() {
  const siteUrl = getSiteUrl();
  const url = `${siteUrl}/trainer/ukeire-max/help`;
  return (
    <main className="siteMain analysisHelpPage toolHelpPage">
      <JsonLd data={[
        { "@context": "https://schema.org", "@type": "TechArticle", headline: "受け入れMAX星人何切るとは？遊び方と復習方法", description: metadata.description, url, inLanguage: "ja-JP", about: ["麻雀", "何切る", "受け入れ", "牌効率"] },
        { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
          { "@type": "ListItem", position: 1, name: "雀フォリオ", item: siteUrl },
          { "@type": "ListItem", position: 2, name: "麻雀トレーニング", item: `${siteUrl}/trainer` },
          { "@type": "ListItem", position: 3, name: "受け入れMAX星人何切る", item: `${siteUrl}/trainer#ukeire-max` },
          { "@type": "ListItem", position: 4, name: "遊び方", item: url }
        ] }
      ]} />
      <div className="analysisHelpTopline">
        <div>
          <p className="siteEyebrow">Ukeire Max Help</p>
          <h1>受け入れMAX星人何切るとは？</h1>
          <p className="toolHelpLead">複数の打牌候補が見えるイーシャンテンから、受け入れが最大になる牌を選ぶ高難易度の何切る練習です。</p>
        </div>
        <Link href="/trainer#ukeire-max">トレーニングを始める</Link>
      </div>

      <nav className="analysisHelpNav" aria-label="ページ内メニュー">
        <a href="#overview">練習できること</a><a href="#how-to-use">遊び方</a><a href="#answer">答えの見方</a>
        <a href="#review">復習方法</a><a href="#practice">実戦への応用</a><a href="#limits">注意点</a>
      </nav>

      <section className="analysisHelpSection" id="overview">
        <h2>このトレーニングで練習できること</h2>
        <p>出題されるのは、数牌だけで構成された14枚のイーシャンテンです。単純な孤立牌処理ではなく、複合形や暗刻が絡み、受け入れが近い候補を比べる問題を中心にしています。</p>
        <p>正解は、シャンテン数を保った打牌の中から、受け入れ枚数と形の質を比較して選ばれます。複数の打牌が同じ条件で最善になる問題では、正解牌をすべて選ぶ形式です。</p>
        <div className="toolHelpSummaryGrid">
          <div><strong>10問練習</strong><span>1セットで判断を反復</span></div>
          <div><strong>複数選択</strong><span>同率の正解にも対応</span></div>
          <div><strong>全候補比較</strong><span>答え合わせ後に内訳を表示</span></div>
        </div>
      </section>

      <section className="analysisHelpSection" id="how-to-use">
        <h2>遊び方</h2>
        <ol className="toolHelpSteps">
          <li><span>1</span><div><h3>切りたい牌を選ぶ</h3><p>問題の14枚から、最も受け入れが広いと思う牌を押します。同じ牌をもう一度押すと選択を外せます。</p></div></li>
          <li><span>2</span><div><h3>複数正解も考える</h3><p>同率の最善打がありそうなら複数の牌を選びます。部分的に合っている場合は「一部正解」として判定されます。</p></div></li>
          <li><span>3</span><div><h3>決定して答え合わせする</h3><p>決定後に正解打牌と最大受け入れの種類・枚数、各打牌候補の比較が表示されます。</p></div></li>
          <li><span>4</span><div><h3>10問後に間違いを復習する</h3><p>セット終了後は、間違えた問題だけを答え付きで見直せます。</p></div></li>
        </ol>
      </section>

      <section className="analysisHelpSection" id="answer">
        <h2>答え合わせの見方</h2>
        <dl className="toolHelpDefinitions">
          <div><dt>正解打牌</dt><dd>最善条件を満たす打牌です。複数表示された場合は、そのすべてが同率の正解です。</dd></div>
          <div><dt>最大受け入れ</dt><dd>正解打牌を切った後、テンパイへ進む有効牌の種類数と最大残り枚数です。</dd></div>
          <div><dt>打牌候補・有効牌比較</dt><dd>それぞれの牌を切った後の受け入れ、良形率、超良形率、有効牌の内訳を並べています。</dd></div>
          <div><dt>一部正解</dt><dd>複数ある正解のうち一部だけを選んだ状態です。ほかに同じ価値の打牌がないか確認します。</dd></div>
        </dl>
      </section>

      <section className="analysisHelpSection" id="review">
        <h2>牌効率を身につける復習方法</h2>
        <p>正誤だけを見るのではなく、まず自分の候補と正解の受け入れ枚数の差を確認します。次に有効牌の画像を見て、自分が数えられなかった受けを探します。特に、暗刻を崩した後に増える受けや、連続形が重なっている部分は見落としやすいポイントです。</p>
        <p>間違えた問題は、正解牌を暗記するのではなく「どの形を一まとまりとして見れば数えやすかったか」を言葉にします。その後、同じ牌姿を牌理チェッカーへ入力して全候補を見比べると、1問を深く復習できます。</p>
        <nav className="toolHelpRelatedLinks" aria-label="受け入れMAX星人の関連ページ">
          <Link href="/analysis/mahjong-tool">牌理チェッカーで自由な牌姿を調べる</Link>
          <Link href="/learn/guides/tile-efficiency-and-ukeire">牌効率と受け入れを学ぶ</Link>
          <Link href="/learn/guides/wait-types">待ちの種類を学ぶ</Link>
        </nav>
      </section>

      <section className="analysisHelpSection" id="practice">
        <h2>実戦でどう使うか</h2>
        <p>受け入れ最大の打牌を素早く見つけられると、序盤の手組みで迷う時間を減らせます。まずはシャンテン数を落とさない候補を探し、次に有効牌の種類と枚数を数える習慣を作ります。</p>
        <p>実戦では、受け入れ最大が常に最終回答ではありません。ドラや手役を残して打点を作る、終盤に安全牌を持つ、親の連荘を優先するなど、局面の目的に合わせて数枚の差を受け入れる判断もあります。トレーニングは「牌理上の基準」を速く出すために使います。</p>
      </section>

      <section className="analysisHelpSection" id="limits">
        <h2>問題の範囲と注意点</h2>
        <ul>
          <li>数牌だけのイーシャンテンを扱う高難易度モードです。字牌を含む手牌は出題しません。</li>
          <li>ドラ、赤ドラ、役、巡目、河、安全度、点棒状況は問題条件に含みません。</li>
          <li>正解は牌理上の受け入れ比較です。実戦の期待値や着順期待値を直接示すものではありません。</li>
          <li>同率の正解が複数ある場合は、すべて選ぶと完全正解になります。</li>
        </ul>
      </section>

      <section className="analysisNotice toolHelpFinish">
        <h2>10問で受け入れを数える</h2>
        <p>迷った理由まで確認しながら、最大受け入れを見抜く練習を始めましょう。</p>
        <Link className="analysisBackButton" href="/trainer#ukeire-max">受け入れMAX星人何切るを開く</Link>
      </section>
    </main>
  );
}
