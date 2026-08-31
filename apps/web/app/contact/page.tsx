import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { LegalPage } from "../components/LegalPage";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description: "雀フォリオへの情報訂正、不具合報告、掲載・権利関係、広告・提携等に関するお問い合わせ窓口です。",
  alternates: { canonical: "/contact" }
};

export default function ContactPage() {
  return (
    <LegalPage
      eyebrow="Contact"
      title="お問い合わせ"
      description="掲載情報やサイト機能に関するご連絡を受け付けるための窓口です。"
    >
      <section>
        <h2>お問い合わせいただける内容</h2>
        <p>次のようなご連絡を受け付けています。</p>
        <ul className="legalColumnList">
          <li>サイト掲載情報の誤り</li>
          <li>麻雀ツールの不具合</li>
          <li>YouTube動画の掲載・紹介</li>
          <li>著作権・肖像権等の権利関係</li>
          <li>掲載内容の修正・削除</li>
          <li>広告・アフィリエイト</li>
          <li>サイトへの意見・要望</li>
          <li>その他</li>
        </ul>
        <div className="legalCallout">
          <strong>権利者・関係者の皆さまへ</strong>
          <p>YouTube動画、書籍、人物情報等について、修正または削除のご希望がある場合は内容を確認のうえ対応します。対象ページのURLとご希望の内容をお知らせください。</p>
        </div>
      </section>

      <section>
        <h2>メールで問い合わせる</h2>
        <p>下のボタンからメールを作成できます。内容を確認し、必要に応じて返信します。</p>
        <div className="contactEmailPanel">
          <span className="contactEmailIcon" aria-hidden="true"><Mail /></span>
          <div className="contactEmailContent">
            <span>お問い合わせ窓口</span>
            <a className="contactEmailAddress" href="mailto:contact@jongfolio.com">contact@jongfolio.com</a>
            <a
              className="contactEmailButton"
              href="mailto:contact@jongfolio.com?subject=%E9%9B%80%E3%83%95%E3%82%A9%E3%83%AA%E3%82%AA%E3%81%B8%E3%81%AE%E3%81%8A%E5%95%8F%E3%81%84%E5%90%88%E3%82%8F%E3%81%9B"
            >
              <Mail aria-hidden="true" />
              メールを作成する
            </a>
          </div>
        </div>
        <div className="contactEmailNotes">
          <strong>メールにご記載ください</strong>
          <ul>
            <li>お問い合わせの種類と具体的な内容</li>
            <li>対象となるページのURL</li>
            <li>不具合の場合は、ご利用の端末やブラウザ</li>
          </ul>
        </div>
      </section>
    </LegalPage>
  );
}
