import type { Metadata } from "next";
import { LegalPage } from "../components/LegalPage";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description: "雀フォリオへの情報訂正、不具合報告、掲載・権利関係、広告・提携等に関するお問い合わせ窓口です。",
  alternates: { canonical: "/contact" }
};

const inquiryTypes = ["サイトについて", "情報の訂正", "不具合報告", "掲載・権利関係", "広告・提携", "その他"];

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
        <h2>お問い合わせフォーム</h2>
        <p className="contactStatus" role="status">現在、送信機能を準備しています。このフォームからはまだ送信できません。</p>
        {/* UIのみを提供しています。送信先を導入する際は、このformへ既存の安全な送信処理を接続します。 */}
        <form className="contactForm">
          <label>
            <span>お名前 / ニックネーム</span>
            <input name="name" type="text" autoComplete="name" placeholder="雀フォリオ太郎" />
          </label>
          <label>
            <span>メールアドレス</span>
            <input name="email" type="email" autoComplete="email" placeholder="example@example.com" />
          </label>
          <label>
            <span>お問い合わせ種別</span>
            <select name="category" defaultValue="">
              <option value="" disabled>選択してください</option>
              {inquiryTypes.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
          </label>
          <label>
            <span>お問い合わせ内容</span>
            <textarea name="message" rows={8} placeholder="対象ページのURLや、確認してほしい内容をご記入ください。" />
          </label>
          <button type="button" disabled>送信機能は準備中です</button>
        </form>
      </section>
    </LegalPage>
  );
}
