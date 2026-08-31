import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "../components/LegalPage";
import { legalConfig } from "../legalConfig";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description: "雀フォリオにおける個人情報、Cookie、広告、アクセス解析、YouTube埋め込み等の取り扱い方針です。",
  alternates: { canonical: "/privacy" }
};

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Privacy Policy"
      title="プライバシーポリシー"
      description="雀フォリオにおける利用者情報の取り扱いについてご案内します。"
      showDates
    >
      <section>
        <h2>1. 個人情報の取得について</h2>
        <p>雀フォリオ（以下「当サイト」といいます）では、メールでお問い合わせいただいた際に、送信者名、メールアドレス、お問い合わせ内容を取得する場合があります。</p>
        <p>また、サイトの利用に伴い、Cookie、IPアドレス、ブラウザ情報、閲覧ページ、アクセス日時、その他アクセス解析に必要な情報を自動的に取得する場合があります。</p>
      </section>

      <section>
        <h2>2. 取得した情報の利用目的</h2>
        <p>取得した情報は、次の目的で利用します。</p>
        <ul>
          <li>お問い合わせへの回答および必要な連絡</li>
          <li>サイトの運営、品質向上および機能改善</li>
          <li>不具合の調査および対応</li>
          <li>不正利用の防止およびサイトの安全確保</li>
          <li>利用状況の分析</li>
          <li>広告配信および広告効果の測定</li>
        </ul>
      </section>

      <section>
        <h2>3. Google AdSenseについて</h2>
        <p>当サイトでは、今後Google AdSenseを利用する場合があります。Googleなどの第三者配信事業者は、Cookie等を利用し、利用者による当サイトや他のウェブサイトへの過去のアクセス情報に基づいて広告を配信する場合があります。</p>
        <div className="legalLinkList">
          <a href={legalConfig.externalLinks.googlePrivacyPolicy} target="_blank" rel="noreferrer">Google プライバシーポリシー</a>
          <a href={legalConfig.externalLinks.googleAdsSettings} target="_blank" rel="noreferrer">Google 広告設定</a>
        </div>
      </section>

      <section>
        <h2>4. アフィリエイトについて</h2>
        <p>当サイトでは、Amazonアソシエイト、楽天アフィリエイト、その他将来追加するアフィリエイトサービスを利用する場合があります。リンク先の事業者が、Cookie等を利用してアクセス情報を取得することがあります。</p>
        <p>広告およびアフィリエイトの表示方針は、<Link href="/advertising">広告・アフィリエイトについて</Link>をご確認ください。</p>
      </section>

      <section>
        <h2>5. YouTube埋め込みについて</h2>
        <p>当サイトでは、YouTube動画を紹介し、YouTube公式プレーヤーを埋め込み表示する場合があります。埋め込み動画の閲覧時には、YouTubeまたはGoogleへ、IPアドレス、Cookie情報、閲覧状況等が送信される可能性があります。</p>
      </section>

      <section>
        <h2>6. Cookieについて</h2>
        <p>Cookieは、ウェブサイトが利用者のブラウザへ保存する小さな情報です。当サイトでは、広告配信、アクセス解析、利便性向上のためにCookieを使用する場合があります。</p>
        <p>Cookieはブラウザの設定から無効化できます。ただし、無効化すると一部の機能が正しく動作しない場合があります。</p>
      </section>

      <section>
        <h2>7. 個人情報の第三者提供</h2>
        <p>法令に基づく場合、人の生命・身体・財産の保護に必要な場合などを除き、本人の同意なく個人情報を第三者へ提供しません。</p>
      </section>

      <section>
        <h2>8. 個人情報の管理</h2>
        <p>取得した情報への不正アクセス、紛失、改ざん、漏えい等を防止するため、合理的な安全管理に努めます。</p>
      </section>

      <section>
        <h2>9. ポリシーの変更</h2>
        <p>法令やサービス内容の変更等に応じて、本ポリシーの内容を変更する場合があります。重要な変更がある場合は、当サイト上で分かりやすくお知らせします。</p>
      </section>

      <section>
        <h2>10. お問い合わせ</h2>
        <p>本ポリシーおよび利用者情報の取り扱いに関するご連絡は、<Link href="/contact">お問い合わせページ</Link>からお願いします。</p>
      </section>
    </LegalPage>
  );
}
