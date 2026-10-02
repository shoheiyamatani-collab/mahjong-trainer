import type { Metadata } from "next";
import { getRobotsPolicy } from "@mahjong-trainer/content-index-policy";
import Link from "next/link";
import { UnofficialNotice } from "@/components/mleague/UnofficialNotice";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "訂正・削除依頼｜Mリーグ選手名鑑",
  description: "掲載情報の訂正、削除、権利、リンク切れに関する正式な連絡方法をご案内します。",
  alternates: { canonical: "/mleague/correction-request/" },
  robots: getRobotsPolicy("/mleague/correction-request"),
};

export default function CorrectionRequestPage() {
  return (
    <main id="main-content" className="page-shell">
      <header className="page-header">
        <span className="eyebrow">CORRECTION REQUEST</span>
        <h1 className="page-title">訂正・削除依頼</h1>
        <p className="page-lead">
          掲載情報の誤り、削除、権利関係、リンク切れに関する連絡方法をご案内します。
        </p>
      </header>
      <UnofficialNotice />
      <section className="content-card content-section section">
        <h2>お問い合わせ窓口</h2>
        <p>
          訂正・削除のご依頼は、雀フォリオ共通のお問い合わせページで受け付けています。
          対象ページのURL、訂正を希望する箇所、確認できる公式情報を添えてご連絡ください。
        </p>
        <p>
          権利者・関係者からのご連絡も、内容を確認したうえで必要な対応を行います。
        </p>
        <div className="link-row">
          <a className="button" href={`${siteConfig.parentUrl}/contact`}>
            お問い合わせページへ
          </a>
          <Link className="text-link" href={siteConfig.routes.policy}>
            掲載方針を確認する
          </Link>
        </div>
      </section>
    </main>
  );
}
