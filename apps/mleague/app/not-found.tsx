import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function NotFound() {
  return (
    <main id="main-content" className="page-shell">
      <div className="empty-state">
        <span className="eyebrow">404</span>
        <h1 className="page-title">ページが見つかりません</h1>
        <p>URLが変更されたか、掲載前・掲載終了の情報である可能性があります。</p>
        <Link className="button" href={siteConfig.routes.home}>
          名鑑トップへ戻る
        </Link>
      </div>
    </main>
  );
}
