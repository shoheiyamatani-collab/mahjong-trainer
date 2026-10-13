import Link from "next/link";
import { CheckerWorkedExample } from "./CheckerWorkedExample";
import styles from "../../tools/tool-learning.module.css";

export function MahjongToolLearningGuide() {
  return (
    <article className="toolLearningGuide">
      <section className="analysisMethodGuide" aria-labelledby="analysis-method-title">
        <p className="eyebrow">HOW TO USE</p>
        <h2 id="analysis-method-title">牌理チェッカーとは？</h2>
        <p>14枚の手牌を入力し、切る牌ごとのシャンテン数、受け入れ牌、山に残る最大枚数、良形率を比較する学習ツールです。答えを丸暗記するのではなく、候補同士の差がどの形から生まれたかを確認するために使います。</p>
        <div className="analysisMethodGrid">
          <section><h3>1. 手牌を入力</h3><p>牌画像を選ぶか、サンプル牌姿を呼び出します。解析には14枚の手牌が必要です。</p></section>
          <section><h3>2. 候補を予想</h3><p>結果を見る前に、自分なら何を切るかを一つか二つ決め、理由も短く言葉にします。</p></section>
          <section><h3>3. 数値と牌を比較</h3><p>進行、牌種類、枚数、良形率、有効牌の内訳を上位候補から順に見ます。</p></section>
        </div>
      </section>

      <section className="toolGuideSection">
        <h2>解析結果の読み方</h2>
        <div className="toolGuideColumns">
          <section><h3>進行</h3><p>打牌後のシャンテン数です。まず現在より悪化しない候補を残し、同じ進行度の中で比較します。</p></section>
          <section><h3>牌種類と枚数</h3><p>手が進む牌の種類数と残り枚数です。種類が多くても、自分で多く使っている牌は残り枚数が減ります。</p></section>
          <section><h3>良形率・超良形率</h3><p>テンパイへ進む有効牌のうち、最も広い待ちを選ぶとアガリ牌が5枚以上・9枚以上残る割合です。枚数で重み付けした比較指標で、アガリ率ではありません。</p></section>
          <section><h3>有効牌</h3><p>実際にどの牌で手が前進するかを表示します。見落としたくっつきや複合受け入れを牌画像で確認できます。</p></section>
        </div>
      </section>

      <section className={`toolGuideSection ${styles.anchor}`} id="checker-learning-example">
        <h2>入力して確かめる、受け入れの比較例</h2>
        <CheckerWorkedExample />
      </section>

      <section className="toolGuideSection">
        <h2>実戦での使い方</h2>
        <p>対局後に迷った14枚を再現し、最初に自分の候補と理由を残します。解析後は1位だけを見るのではなく、上位2候補の有効牌を比較してください。差を作った牌や形を一つ説明できれば、次の似た局面でも判断しやすくなります。</p>
        <p>このツールは手牌の形を比べるもので、実戦の最終判断を自動決定するものではありません。ドラ、打点、巡目、河、他家の仕掛け、点棒状況、安全度は別に加味してください。また、表示枚数は見えている牌をすべて反映した山読みではなく、入力した手牌を基準にした理論上の最大値です。</p>
        <p>対象は、副露のない14枚を4面子1雀頭へ進める通常形の比較です。七対子・国士無双のシャンテン数や、副露を含む手牌はこのチェッカーでは評価しません。赤5は通常の5と同じ形として扱い、ドラの価値は別に判断します。</p>
      </section>

      <section className="toolGuideSection toolGuideFaq" aria-labelledby="tool-faq-title">
        <h2 id="tool-faq-title">よくある質問</h2>
        <details><summary>受け入れ最大の牌を必ず切ればよいですか？</summary><p>いいえ。速度の基準として有力ですが、打点や安全度、良形率を優先する局面では別の候補が実戦的になることがあります。</p></details>
        <details><summary>同率の候補はどちらが正解ですか？</summary><p>シャンテン数と受け入れが同じなら、残る待ちの質、手役、ドラ受け、安全牌の有無を比べます。数値が同じでも役割が違う候補があります。</p></details>
        <details><summary>結果と実戦の選択が違ってもよいですか？</summary><p>牌理上の基準を理解したうえで場況を理由に変えるのは自然です。どの条件を優先したか説明できることが大切です。</p></details>
      </section>

      <nav className="analysisMethodLinks toolGuideLinks" aria-label="牌理チェッカーに関連する学習">
        <Link href="/learn/guides/mahjong-checker-examples">牌理チェッカーの活用例</Link>
        <Link href="/learn/guides/tile-efficiency-and-ukeire">牌効率と受け入れの基本</Link>
        <Link href="/learn/guides/good-shape-rate">良形率の考え方</Link>
        <Link href="/trainer/iishanten">イーシャンテン何切るで練習</Link>
      </nav>
    </article>
  );
}
