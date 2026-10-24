import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "../components/LegalPage";

export const metadata: Metadata = {
  title: "このサイトについて・運営者情報",
  description: "麻雀学習サイト「雀フォリオ / JONGFOLIO」の目的、主なコンテンツ、情報掲載方針、運営者情報をご案内します。",
  alternates: { canonical: "/about" }
};

export default function AboutPage() {
  return (
    <LegalPage
      eyebrow="About JONGFOLIO"
      title="このサイトについて"
      description="麻雀を知る、学ぶ、強くなる。そのための入口をひとつにつなぐサイトです。"
    >
      <section>
        <h2>雀フォリオについて</h2>
        <dl className="operatorFacts">
          <div><dt>サイト名</dt><dd>雀フォリオ</dd></div>
          <div><dt>英字表記</dt><dd>JONGFOLIO</dd></div>
          <div><dt>URL</dt><dd><a href="https://jongfolio.com">https://jongfolio.com</a></dd></div>
          <div><dt>運営</dt><dd>雀フォリオ運営</dd></div>
        </dl>
        <p>雀フォリオは、「麻雀を知る・学ぶ・練習する」ための情報やツールを提供する麻雀Webサイトです。麻雀を始めたばかりの方から、実戦判断をより深く学びたい方まで、気軽に利用できるサイトを目指しています。</p>
      </section>

      <section>
        <h2>主なコンテンツ</h2>
        <ul>
          <li>麻雀初心者向け学習コンテンツ</li>
          <li>点数計算などの練習ツール</li>
          <li>牌理・何切る等のトレーニング</li>
          <li>麻雀解説記事</li>
          <li>麻雀プロに関する情報</li>
          <li>麻雀学習に役立つYouTube動画紹介</li>
          <li>麻雀プロやYouTube出演者等の関連書籍紹介</li>
        </ul>
      </section>

      <section>
        <h2>情報掲載について</h2>
        <p>可能な限り公式サイト、公式SNS、公式発表等を確認し、掲載情報の正確性を高めるよう努めます。ただし、情報の完全性、正確性、最新性を保証するものではありません。</p>
        <p>誤りや更新が必要な情報を見つけた場合は、対象ページのURLと内容を添えて<Link href="/contact">お問い合わせページ</Link>からご連絡ください。</p>
      </section>

      <section id="calculation-policy">
        <h2>解説・計算結果の作り方</h2>
        <p>学習記事の牌図は、当サイトの牌画像で組み直した教材です。役の成立条件と、実戦でどちらを選ぶかという戦術上の判断は区別して説明します。戦術の推奨は、すべての局面で唯一の正解になるものではありません。</p>
        <dl className="operatorFacts">
          <div><dt>牌理の計算</dt><dd>牌理チェッカーでは打牌後のシャンテン数、有効牌、手牌から計算した理論枚数を比較します。実際の山を知っているわけではなく、受け入れ枚数や良形率はアガリ率ではありません。<Link href="/learn/guides/good-shape-rate">良形率の定義と計算例</Link>も確認できます。</dd></div>
          <div><dt>点数の計算</dt><dd>アガリ牌、門前・副露、親子、場風・自風、ロン・ツモを指定して役と符を計算します。ドラ、本場、供託の有無でも結果が変わります。<Link href="/tools/help#example">入力条件つきの計算例</Link>で同じ結果を再現できます。</dd></div>
          <div><dt>局面判断・推定値</dt><dd>押し引きや手役の評価では、確定した点数計算と、仮定に基づく推定・シミュレーションを混同しないでください。相手の実際の手牌や行動を保証する数値ではなく、画面に示した条件下で比較する学習材料です。</dd></div>
        </dl>
        <p>今回見直したリーチ・タンヤオ・七対子の記事の待ちと点数例は、ツールで使用する計算処理を使った自動テストで確認しています。ただし、これだけで全記事の正確性や、プロによる監修を保証するものではありません。</p>
        <p>実戦では、喰いタン、途中流局、連荘、同点時の順位などのルールを対局先で確認してください。ツールごとの対応範囲は<Link href="/tools/help">ツールの使い方</Link>で案内しています。</p>
      </section>

      <section id="corrections">
        <h2>誤りの訂正とお問い合わせ</h2>
        <p>計算結果や解説に疑問がある場合は、対象ページのURL、手牌、アガリ牌、副露、親子・ロンツモなどの条件と、気になった結果を添えて<Link href="/contact">お問い合わせ</Link>ください。個人情報を含む牌譜や、転載の許可がない画像の送付は避けてください。</p>
        <p>2026年10月24日の教材見直しでは、リーチの牌図にある待ちを五筒のみから二筒・五筒へ訂正し、良形率の解説に判定基準と計算の分母を追記しました。</p>
      </section>

      <section>
        <h2>YouTube動画の紹介について</h2>
        <p>当サイトで紹介するYouTube動画は、原則としてYouTube公式の埋め込み機能等を利用します。動画、映像、音声、名称等に関する権利は、動画投稿者をはじめとする各権利者に帰属します。</p>
        <p>当サイトが動画を掲載・紹介することは、特別な記載がない限り、動画投稿者や出演者との広告契約、公式提携、推薦またはスポンサー関係を意味しません。</p>
      </section>

      <section>
        <h2>運営者情報</h2>
        <p>運営：雀フォリオ運営</p>
        <p>サイトへのご連絡は<Link href="/contact">お問い合わせページ</Link>をご利用ください。</p>
      </section>
    </LegalPage>
  );
}
