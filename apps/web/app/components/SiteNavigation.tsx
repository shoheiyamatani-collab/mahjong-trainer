"use client";
import { useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { BookOpen, Calculator, Home, Map, Menu, Search, SquarePlay, Target, Trophy, X } from "lucide-react";
import { isFocusWorkspace, platformCategory } from "./navigationModel";

export function PlatformFrame({ children, mleague = false }: { children: ReactNode; mleague?: boolean }) {
  const path = usePathname();
  return <div className="platformFrame" data-category={mleague ? "mleague" : platformCategory(path)} data-focus-workspace={!mleague && isFocusWorkspace(path) ? "true" : undefined}>{children}</div>;
}
export function PlatformNavigation({ reviewMode, webBase = "", mleagueHref = "/mleague", mleague = false }: {
  reviewMode: boolean; webBase?: string; mleagueHref?: string; mleague?: boolean;
}) {
  const path = usePathname();
  const category = mleague ? "mleague" : platformCategory(path);
  const dialog = useRef<HTMLDialogElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const mainItems = [
    { label: "学ぶ", href: `${webBase}/learn/guides`, category: "learning", Icon: BookOpen },
    { label: "練習する", href: `${webBase}/trainer`, category: "training", Icon: Target },
    { label: "解析・計算", href: `${webBase}/toolbox`, category: "analysis", Icon: Calculator },
    ...(!reviewMode || mleague ? [{ label: "Mリーグ", href: mleagueHref, category: "mleague", Icon: Trophy }] : [])
  ];
  const menuItems = [
    ...mainItems.filter(item => item.category !== "mleague"),
    { label: "初心者ロードマップ", href: `${webBase}/learn/roadmap`, category: "learning", Icon: Map },
    { label: "牌理チェッカー", href: `${webBase}/analysis/mahjong-tool`, category: "analysis", Icon: Search },
    { label: "配牌分析", href: `${webBase}/analysis/starting-hand`, category: "analysis", Icon: Search },
    { label: "点数計算ツール", href: `${webBase}/tools`, category: "analysis", Icon: Calculator },
    { label: "オーラス条件計算", href: `${webBase}/analysis/orasu-condition`, category: "analysis", Icon: Calculator },
    { label: "役一覧", href: `${webBase}/rules/yaku`, category: "learning", Icon: BookOpen },
    { label: "麻雀用語辞典", href: `${webBase}/learn/glossary`, category: "learning", Icon: BookOpen },
    { label: "動画で学ぶ", href: `${webBase}/videos/strategy`, category: "learning", Icon: SquarePlay },
    { label: "Mリーグ", href: mleagueHref, category: "mleague", Icon: Trophy }
  ];
  function openMenu() { dialog.current?.showModal(); setMenuOpen(true); }
  function closeMenu() { dialog.current?.close(); setMenuOpen(false); }
  return <>
    <a className="platformSkipLink" href="#platform-main">本文へ移動</a>
    <header className="platformHeader"><div className="platformHeaderInner">
      <a className="platformBrand" href={`${webBase}/`} aria-label="雀フォリオ トップ">
        <span className="platformLogo" aria-hidden="true" style={webBase ? { backgroundImage: `url(${webBase}/brand/janfolio-brand-board.png)` } : undefined} />
        <span><strong>雀フォリオ</strong><small>JONGFOLIO<span className={mleague ? undefined : "platformBrandTagline"}>{mleague ? " / Mリーグ・非公式" : " 麻雀を知る、学ぶ、強くなる。"}</span></small></span>
      </a>
      <nav className="platformDesktopNav" aria-label="サイトナビゲーション">
        {mainItems.map(({ label, href, category: tone, Icon }) => <a href={href} key={href} data-tone={tone} aria-current={category === tone && (mleague || path !== "/") ? "page" : undefined}><Icon aria-hidden="true" />{label}</a>)}
      </nav>
      <div className="platformActions">
        <a className="platformIconButton" href={`${webBase}/toolbox#tool-search`} aria-label="ツールを検索" title="ツールを検索"><Search aria-hidden="true" /></a>
        <button className="platformIconButton" type="button" aria-label="メニューを開く" title="メニュー" aria-haspopup="dialog" aria-expanded={menuOpen} onClick={openMenu}><Menu aria-hidden="true" /></button>
      </div>
    </div></header>
    <dialog ref={dialog} className="platformMenu" aria-labelledby="platform-menu-title" onClose={() => setMenuOpen(false)}>
      <div className="platformMenuHeading"><h2 id="platform-menu-title">メニュー</h2><button type="button" className="platformIconButton" onClick={closeMenu} aria-label="メニューを閉じる" title="閉じる" autoFocus><X aria-hidden="true" /></button></div>
      <nav aria-label="すべてのコンテンツ">{menuItems.map(({ label, href, category: tone, Icon }) => <a key={href} href={href} data-tone={tone} onClick={closeMenu}><Icon aria-hidden="true" />{label}</a>)}</nav>
    </dialog>
    <nav className="platformMobileNav" aria-label="スマホナビゲーション">
      <a href={`${webBase}/`} aria-current={path === "/" && !mleague ? "page" : undefined}><Home aria-hidden="true" />ホーム</a>
      <a href={`${webBase}/learn/guides`} aria-current={category === "learning" ? "page" : undefined}><BookOpen aria-hidden="true" />学ぶ</a>
      <a href={`${webBase}/trainer`} aria-current={category === "training" ? "page" : undefined}><Target aria-hidden="true" />練習</a>
      <a href={`${webBase}/toolbox`} aria-current={category === "analysis" && path !== "/" ? "page" : undefined}><Calculator aria-hidden="true" />ツール</a>
      <button type="button" onClick={openMenu} aria-label="移動メニューを開く" aria-haspopup="dialog"><Menu aria-hidden="true" />メニュー</button>
    </nav>
  </>;
}
