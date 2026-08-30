import Link from "next/link";
import { siteConfig } from "../siteConfig";
import { SiteNavigation, type SiteNavItem } from "./SiteNavigation";

const navItems: SiteNavItem[] = [
  {
    label: "麻雀解析ツール",
    href: "/analysis/mahjong-tool",
    activePrefixes: ["/analysis"],
    icon: "analysis",
    kind: "primary",
    tone: "analysis"
  },
  {
    label: "麻雀トレーニング",
    href: "/trainer",
    activePrefixes: ["/trainer", "/training"],
    icon: "training",
    kind: "primary",
    tone: "training"
  },
  { label: "点数計算ツール", href: "/tools", icon: "score", kind: "utility" },
  {
    label: "麻雀のルール",
    href: "/learn",
    icon: "rules",
    kind: "utility",
    visible: siteConfig.features.showRulesNavigation
  },
  { label: "動画で学ぶ", href: "/videos/strategy", activePrefixes: ["/videos"], icon: "video", kind: "utility" },
  {
    label: "Mリーグ厳選切り抜きを見る",
    href: "/videos/mleague-clips",
    visible: siteConfig.features.showMLeagueLinks
  },
  {
    label: siteConfig.externalSites.mLeaguePlayerDirectory.label,
    href: siteConfig.externalSites.mLeaguePlayerDirectory.href,
    external: true,
    visible: siteConfig.features.showMLeagueLinks
  }
];

const footerItems = [
  { label: "麻雀解析ツール", href: "/analysis/mahjong-tool" },
  { label: "麻雀トレーニング", href: "/trainer" },
  { label: "麻雀点数計算ツール", href: "/tools" },
  { label: "動画で学ぶ", href: "/videos/strategy" }
];

function BrandLockup() {
  return (
    <>
      <span className="siteLogoMark siteLogoMarkImage" aria-hidden="true" />
      <span className="siteLogoText">
        <span className="siteLogoTitle"><span className="siteLogoTitleLead">雀</span>フォリオ</span>
        <span className="siteLogoMeta">
          <span className="siteLogoSub">{siteConfig.brand.englishName}</span>
          <span className="siteLogoTagline">{siteConfig.brand.tagline}</span>
        </span>
      </span>
    </>
  );
}

export function Header() {
  return (
    <header className="siteHeader">
      <Link className="siteLogo" href="/">
        <BrandLockup />
      </Link>
      <SiteNavigation items={navItems} />
    </header>
  );
}

export function Footer() {
  return (
    <footer className="siteFooter">
      <div>
        <Link className="siteLogo siteFooterLogo" href="/">
          <BrandLockup />
        </Link>
      </div>
      <nav className="siteFooterLinks" aria-label="フッターリンク">
        {footerItems.map((item) => (
          <Link key={item.label} href={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
    </footer>
  );
}
