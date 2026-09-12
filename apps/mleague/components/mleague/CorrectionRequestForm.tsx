"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export function CorrectionRequestForm() {
  const [status, setStatus] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(
      "送信機能は現在準備中です。入力内容は保存・送信されていません。正式な受付方法の公開までお待ちください。",
    );
  }

  return (
    <form className="correction-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="requester-name">依頼者名</label>
          <input id="requester-name" name="requesterName" required />
        </div>
        <div className="field">
          <label htmlFor="requester-email">連絡先メールアドレス</label>
          <input id="requester-email" name="email" type="email" required />
        </div>
        <div className="field field-full">
          <label htmlFor="target-url">対象ページURL</label>
          <input id="target-url" name="targetUrl" type="url" required />
        </div>
        <div className="field">
          <label htmlFor="target-name">対象の選手またはチーム</label>
          <input id="target-name" name="targetName" required />
        </div>
        <div className="field">
          <label htmlFor="request-type">依頼種別</label>
          <select id="request-type" name="requestType" required defaultValue="">
            <option value="" disabled>
              選択してください
            </option>
            <option value="correction">情報の訂正</option>
            <option value="deletion">情報の削除</option>
            <option value="rights">権利に関する連絡</option>
            <option value="broken-link">リンク切れ</option>
            <option value="other">その他</option>
          </select>
        </div>
        <div className="field field-full">
          <label htmlFor="request-detail">詳細</label>
          <textarea id="request-detail" name="detail" required />
        </div>
        <div className="field field-full">
          <label htmlFor="evidence-url">根拠となる公式URL</label>
          <input id="evidence-url" name="evidenceUrl" type="url" />
          <p className="field-help">
            選手本人・チーム・リーグ・所属団体などの公式発表URLをご記入ください。
          </p>
        </div>
      </div>
      <label className="checkbox-field">
        <input type="checkbox" name="privacyConsent" required />
        <span>
          <Link className="text-link" href={`${siteConfig.routes.policy}#privacy`}>
            プライバシーポリシー
          </Link>
          に同意します
        </span>
      </label>
      <div>
        <button className="button" type="submit">
          入力内容を確認
        </button>
      </div>
      {status ? (
        <p className="form-status" role="status">
          {status}
        </p>
      ) : null}
    </form>
  );
}
