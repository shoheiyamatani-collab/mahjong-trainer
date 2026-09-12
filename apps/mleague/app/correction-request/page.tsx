import type { Metadata } from "next";
import { CorrectionRequestForm } from "@/components/mleague/CorrectionRequestForm";
import { UnofficialNotice } from "@/components/mleague/UnofficialNotice";

export const metadata: Metadata = {
  title: "訂正・削除依頼｜Mリーグ選手名鑑",
  description: "掲載情報の訂正、削除、権利、リンク切れに関する連絡フォームです。",
};

export default function CorrectionRequestPage() {
  return (
    <main id="main-content" className="page-shell">
      <header className="page-header">
        <span className="eyebrow">CORRECTION REQUEST</span>
        <h1 className="page-title">訂正・削除依頼</h1>
        <p className="page-lead">
          掲載情報の誤り、削除、権利に関するご連絡、リンク切れをご連絡いただくための画面です。
        </p>
      </header>
      <UnofficialNotice />
      <section className="content-card section">
        <h2>入力フォーム</h2>
        <p>
          現在はUI確認用で、送信機能とバックエンドは未実装です。入力内容は保存されません。
        </p>
        <CorrectionRequestForm />
      </section>
    </main>
  );
}
