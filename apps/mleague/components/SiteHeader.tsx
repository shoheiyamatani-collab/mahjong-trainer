import Link from "next/link";
import { siteConfig } from "@/config/site";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" href={siteConfig.routes.home}>
          <span className="brand-mark" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </span>
          <span className="brand-copy">
            <small>M.LEAGUE DATA HUB</small>
            <span>
              {siteConfig.name} <span className="unofficial-badge">非公式</span>
            </span>
          </span>
        </Link>
        <nav className="site-nav" aria-label="主要ナビゲーション">
          <a className="jongfolio-home-link" href="/">
            ← 雀フォリオへ戻る
          </a>
          <Link href={siteConfig.routes.home}>対局情報</Link>
          <Link href={siteConfig.routes.players}>選手について知る</Link>
          <Link href={siteConfig.routes.clips}>Mリーグ切り抜きを見る</Link>
          <Link href={siteConfig.routes.policy}>掲載方針</Link>
        </nav>
      </div>
    </header>
  );
}
