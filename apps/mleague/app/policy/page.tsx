import type { Metadata } from "next";
import { UnofficialNotice } from "@/components/mleague/UnofficialNotice";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "掲載方針｜Mリーグ選手名鑑",
  description: "非公式サイトとしての情報確認、出典、画像、イベント、訂正対応の方針です。",
  alternates: { canonical: "/mleague/policy/" },
};

export default function PolicyPage() {
  return (
    <main id="main-content" className="page-shell">
      <header className="page-header">
        <span className="eyebrow">EDITORIAL POLICY</span>
        <h1 className="page-title">掲載方針</h1>
        <p className="page-lead">
          情報の正確さと、選手・関係者の権利やプライバシーに配慮して運営します。
        </p>
      </header>
      <UnofficialNotice />

      <div className="profile-grid section">
        <div>
          <section className="content-card content-section">
            <h2>非公式サイトとしての立場</h2>
            <p>
              当サイトは、Mリーグ機構、各チーム、所属団体、選手本人とは関係のない非公式情報サイトです。「公式」「公認」と誤認される表示は行いません。
            </p>
          </section>
          <section className="content-card content-section">
            <h2>画像・ロゴの方針</h2>
            <p>
              Mリーグ公式ロゴ、チーム公式ロゴ、許可を得ていない選手写真や映像のスクリーンショットは使用しません。選手画像部分にはサイト独自の共通プレースホルダーを使用します。
            </p>
          </section>
          <section className="content-card content-section">
            <h2>情報確認と出典</h2>
            <p>
              リーグ、チーム、所属団体、選手本人などによる公式発表をもとに確認し、出典と最終確認日を表示します。元の文章を転載せず、確認できる事実を自サイト向けに要約します。
            </p>
          </section>
          <section className="content-card content-section">
            <h2>イベントとプライバシー</h2>
            <p>
              イベントは一般向けに事前告知された公式情報のみを掲載します。ファンの噂や目撃情報、リアルタイムの位置情報、自宅・移動・宿泊・家族などの個人情報は掲載しません。参加前には、主催者や選手本人による最新の公式情報をご確認ください。
            </p>
          </section>
          <section className="content-card content-section">
            <h2>訂正・削除と権利者対応</h2>
            <p>
              掲載内容に誤りが確認された場合は、可能な範囲で訂正または削除に対応します。権利者・関係者からご連絡があった場合も、対象ページと内容を確認のうえ対応します。
            </p>
            <a className="button-secondary" href={`${siteConfig.parentUrl}/contact`}>
              お問い合わせページへ
            </a>
          </section>
          <section className="content-card content-section" id="privacy">
            <h2>プライバシーポリシー</h2>
            <p>
              お問い合わせで取得する氏名、メールアドレス、内容は、依頼内容の確認と返信のために利用します。Cookie、アクセス解析、広告配信を含む利用者情報の取り扱いは、雀フォリオ共通のプライバシーポリシーに従います。
            </p>
            <a className="text-link" href={`${siteConfig.parentUrl}/privacy`}>
              プライバシーポリシーを確認する
            </a>
          </section>
        </div>
        <aside>
          <section className="content-card content-section" id="contact">
            <h2>お問い合わせ</h2>
            <p>
              掲載情報の訂正・削除、権利関係、リンク切れなどのご連絡は、雀フォリオのお問い合わせ窓口で受け付けています。対象ページのURLと具体的な内容を添えてご連絡ください。
            </p>
            <a className="text-link" href={`${siteConfig.parentUrl}/contact`}>
              contact@jongfolio.comへ問い合わせる
            </a>
          </section>
          <section className="content-card content-section" id="operator">
            <h2>運営者情報</h2>
            <p>運営：雀フォリオ運営</p>
            <p>サイト名：雀フォリオ / JONGFOLIO</p>
            <p>URL：<a className="text-link" href={siteConfig.parentUrl}>{siteConfig.parentUrl}</a></p>
          </section>
        </aside>
      </div>
    </main>
  );
}
