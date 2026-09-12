import type { Metadata } from "next";
import Link from "next/link";
import { UnofficialNotice } from "@/components/mleague/UnofficialNotice";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "掲載方針｜Mリーグ選手名鑑",
  description: "非公式サイトとしての情報確認、出典、画像、イベント、訂正対応の方針です。",
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
              掲載内容に誤りが確認された場合は、可能な範囲で訂正または削除に対応します。権利者からご連絡があった場合も、内容を確認のうえ対応を検討します。
            </p>
            <Link className="button-secondary" href={siteConfig.routes.correctionRequest}>
              訂正・削除依頼へ
            </Link>
          </section>
          <section className="content-card content-section" id="privacy">
            <h2>プライバシーポリシー</h2>
            <p>
              訂正・削除依頼で入力された連絡先は、依頼内容の確認と返信のためにのみ利用する想定です。現在は送信機能が未実装のため、フォームの入力内容は保存されません。実運用開始前に保存期間、委託先、問い合わせ窓口を確定し、本項を更新します。
            </p>
          </section>
        </div>
        <aside>
          <section className="content-card content-section" id="contact">
            <h2>お問い合わせ</h2>
            <p>
              現在、一般お問い合わせ窓口は準備中です。掲載情報に関するご連絡は訂正・削除依頼ページをご利用ください。
            </p>
          </section>
          <section className="content-card content-section" id="operator">
            <h2>運営者情報</h2>
            <p>
              運営者情報は公開準備中です。公開前に運営主体と連絡先を設定します。
            </p>
          </section>
        </aside>
      </div>
    </main>
  );
}
