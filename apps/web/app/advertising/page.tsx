import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "../components/LegalPage";

export const metadata: Metadata = {
  title: "広告・アフィリエイトについて",
  description: "雀フォリオにおけるGoogle AdSense、Amazonアソシエイト、楽天アフィリエイト、PR記事等の表示方針です。",
  alternates: { canonical: "/advertising" }
};

export default function AdvertisingPage() {
  return (
    <LegalPage
      eyebrow="Advertising Policy"
      title="広告・アフィリエイトについて"
      description="広告や商品紹介を分かりやすく、誤解のない形で掲載するための方針です。"
    >
      <section>
        <h2>基本方針</h2>
        <p>雀フォリオでは、サイトの運営・維持のため、Google AdSense、Amazonアソシエイト、楽天アフィリエイト、その他将来追加する広告・アフィリエイトサービスを利用する場合があります。</p>
        <p>広告やアフィリエイトを含む場合は、利用者がその旨を認識できるよう、記事本文の開始前など分かりやすい位置へ表示します。</p>
      </section>

      <section>
        <h2>アフィリエイトリンクについて</h2>
        <p>記事や商品紹介ページには、Amazonや楽天市場等へのアフィリエイトリンクが含まれる場合があります。利用者がそのリンクを経由して商品を購入すると、当サイトが紹介料を受け取る場合があります。</p>
        <p>アフィリエイトリンクを経由したことを理由として、通常より商品価格が高くなるものではありません。</p>
      </section>

      <section>
        <h2>Amazonアソシエイト</h2>
        <p className="amazonAssociateStatement">Amazonのアソシエイトとして、雀フォリオは適格販売により収入を得ています。</p>
      </section>

      <section>
        <h2>楽天アフィリエイト</h2>
        <p>楽天市場等へのリンクを経由して商品が購入された場合、当サイトが紹介料を受け取る場合があります。</p>
      </section>

      <section>
        <h2>Google AdSense</h2>
        <p>当サイトでは、Google AdSenseによる広告を掲載する場合があります。広告配信および効果測定のため、Cookie等を利用した広告配信が行われることがあります。</p>
        <p>情報の取り扱いについては<Link href="/privacy">プライバシーポリシー</Link>をご確認ください。</p>
      </section>

      <section>
        <h2>書籍紹介について</h2>
        <p>当サイトでは、麻雀プロ、YouTube出演者、麻雀関連著者等が出版した書籍を紹介する場合があります。Amazonや楽天等のリンクがアフィリエイトリンクである場合、購入に応じて当サイトが紹介料を受け取ることがあります。</p>
        <p>書籍の紹介は、特別な記載がない限り、著者、出版社、YouTubeチャンネル、麻雀プロ、所属団体等との広告契約または公式提携を意味しません。</p>
      </section>

      <section>
        <h2>YouTube動画とアフィリエイト</h2>
        <p>YouTube動画を紹介し、その動画投稿者や出演者に関連する書籍等をアフィリエイトで紹介する場合があります。動画紹介とアフィリエイトはそれぞれ独立したものです。</p>
        <p>特別な記載がない限り、チャンネル運営者や出演者から広告料を受け取って動画を紹介しているものではありません。</p>
      </section>

      <section>
        <h2>PR案件について</h2>
        <p>将来、金銭報酬、商品提供、サービス提供、その他の経済的利益を受けてコンテンツを制作する場合は、「広告」「PR」「プロモーション」等を記事の分かりやすい位置へ表示します。</p>
      </section>
    </LegalPage>
  );
}
