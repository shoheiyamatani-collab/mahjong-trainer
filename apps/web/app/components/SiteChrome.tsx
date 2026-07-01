import Link from "next/link";

const navItems = [
  { label: "はじめて学ぶ", href: "/learn" },
  { label: "練習する", href: "/training" },
  { label: "ツール", href: "/tools" },
  { label: "ルール一覧", href: "/rules" }
];

const footerItems = [
  { label: "初心者ロードマップ", href: "/learn" },
  { label: "点数計算ツール", href: "/trainer" },
  { label: "何切る問題", href: "/trainer" },
  { label: "待ち当て問題", href: "/trainer" },
  { label: "役一覧", href: "/rules" }
];

export function Header() {
  return (
    <header className="siteHeader">
      <Link className="siteLogo" href="/">
        <span className="siteLogoMark" aria-hidden="true">麻</span>
        <span>
          <span className="siteLogoTitle">麻雀トレーナー</span>
          <span className="siteLogoSub">学ぶ・解く・調べる</span>
        </span>
      </Link>
      <nav className="siteNav" aria-label="サイト内ナビゲーション">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="siteFooter">
      <div>
        <p className="siteFooterTitle">麻雀トレーナー</p>
        <p className="siteFooterText">迷ったら、ルールを読み直してから同じ形をもう一度練習できます。</p>
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
