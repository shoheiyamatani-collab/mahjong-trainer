import Link from "next/link";
import { siteConfig } from "@/config/site";
import { PlatformNavigation } from "../../web/app/components/SiteNavigation";
import { isAdsenseReviewMode } from "@mahjong-trainer/content-index-policy";

export function SiteHeader() {
  return (
    <>
        <PlatformNavigation mleague reviewMode={isAdsenseReviewMode} webBase={process.env.NODE_ENV === "development" ? "http://127.0.0.1:3000" : ""} mleagueHref={process.env.NODE_ENV === "development" ? "http://127.0.0.1:3001/mleague/" : "/mleague/"} />
        <nav className="mleagueSectionNav" aria-label="Mリーグナビゲーション">
          <Link href={siteConfig.routes.home}>対局情報</Link>
          <Link href={siteConfig.routes.calendar}>対局カレンダー</Link>
          <Link href={siteConfig.routes.stats}>今シーズンの成績</Link>
          <Link href={siteConfig.routes.players}>選手について知る</Link>
          <Link href={siteConfig.routes.teams}>チーム</Link>
          <Link href={siteConfig.routes.clips}>Mリーグ切り抜きを見る</Link>
          <Link href={siteConfig.routes.policy}>掲載方針</Link>
        </nav>
    </>
  );
}
