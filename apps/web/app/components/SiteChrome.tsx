import Link from "next/link";
import { isAdsenseReviewMode } from "@mahjong-trainer/content-index-policy";
import { siteConfig } from "../siteConfig";
import { PlatformNavigation } from "./SiteNavigation";


const footerContentItems: { label: string; href: string; external?: boolean }[] = [
  { label: "ツール・トレーニングを探す", href: "/toolbox" },
  { label: "麻雀解析ツール", href: "/analysis/mahjong-tool" },
  { label: "麻雀トレーニング", href: "/trainer" },
  { label: "麻雀点数計算ツール", href: "/tools" },
  { label: "麻雀を学ぶ", href: "/learn/guides" },
  { label: "動画で学ぶ", href: "/videos/strategy" },
  {
    label: siteConfig.externalSites.mLeaguePlayerDirectory.label,
    href: siteConfig.externalSites.mLeaguePlayerDirectory.href,
    external: siteConfig.externalSites.mLeaguePlayerDirectory.external
  }
];

const footerInformationItems = [
  { label: "このサイトについて", href: "/about" },
  { label: "お問い合わせ", href: "/contact" },
  { label: "プライバシーポリシー", href: "/privacy" },
  { label: "利用規約", href: "/terms" },
  { label: "広告・アフィリエイトについて", href: "/advertising" }
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
  return <PlatformNavigation reviewMode={isAdsenseReviewMode} mleagueHref={siteConfig.externalSites.mLeaguePlayerDirectory.href} />;
}

export function Footer() {
  return (
    <footer className="siteFooter">
      <div className="siteFooterBrand">
        <Link className="siteLogo siteFooterLogo" href="/">
          <BrandLockup />
        </Link>
      </div>
      <div className="siteFooterNavGroups">
        <div>
          <p className="siteFooterNavTitle">コンテンツ</p>
          <nav className="siteFooterLinks" aria-label="主要コンテンツ">
            {footerContentItems.map((item) => item.external ? (
              <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer">{item.label}</a>
            ) : (
              <Link key={item.label} href={item.href}>{item.label}</Link>
            ))}
          </nav>
        </div>
        <div>
          <p className="siteFooterNavTitle">運営情報</p>
          <nav className="siteFooterLinks" aria-label="運営情報">
            {footerInformationItems.map((item) => (
              <Link key={item.label} href={item.href}>{item.label}</Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
