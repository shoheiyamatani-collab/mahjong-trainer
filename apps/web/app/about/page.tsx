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
