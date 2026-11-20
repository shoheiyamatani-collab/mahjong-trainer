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
      description="雀フォリオ本体の広告・アフィリエイトの掲載状況と表示方針です。"
    >
      <section>
        <h2>基本方針</h2>
        <p>サイトの運営・維持のために広告を掲載する場合は、学習記事やツールと見分けられるよう、分かりやすい位置に表示します。</p>
      </section>

      <section>
        <h2>アフィリエイトリンクについて</h2>
        <p>現在、雀フォリオ本体では商品紹介のためのアフィリエイトリンクを掲載していません。</p>
        <p>Amazonや楽天市場などへのアフィリエイトリンクを掲載する場合は、リンクの近くに広告であることを明示します。対象のリンクを経由して購入された場合、当サイトが紹介料を受け取ることがあります。</p>
        <p>アフィリエイトリンクを経由したことを理由として、通常より商品価格が高くなるものではありません。</p>
      </section>

      <section>
        <h2>Amazonアソシエイト</h2>
        <p className="amazonAssociateStatement">Amazonのアソシエイトとして、雀フォリオは適格販売により収入を得ています。</p>
      </section>

      <section>
        <h2>Google AdSense</h2>
        <p>現在はサイトの所有権確認用タグを設置していますが、AdSenseの広告は表示していません。広告を掲載する場合は、サイトの承認後に配信します。広告配信や効果測定にはCookieなどが使われる場合があります。</p>
        <p>情報の取り扱いについては<Link href="/privacy">プライバシーポリシー</Link>をご確認ください。</p>
      </section>

      <section>
        <h2>PR案件について</h2>
        <p>将来、金銭報酬、商品提供、サービス提供、その他の経済的利益を受けてコンテンツを制作する場合は、「広告」「PR」「プロモーション」等を記事の分かりやすい位置へ表示します。</p>
      </section>
    </LegalPage>
  );
}
