import Link from "next/link";
import { ArrowRight, BookOpen, Calculator, Search, SquarePlay, Target, Trophy } from "lucide-react";
import { isAdsenseReviewMode } from "@mahjong-trainer/content-index-policy";
import { siteConfig } from "../siteConfig";
import { getToolCatalog } from "../toolbox/toolCatalog";
import { ToolCard } from "./ToolCard";

const catalog = getToolCatalog();
export function HomeLearningHub() {
  const categories = [
    { title: "解析する", description: "手牌の選択を数値で比べる", href: "/analysis/mahjong-tool", tone: "analysis", Icon: Search },
    { title: "練習する", description: "何切る・待ち・判断を鍛える", href: "/trainer", tone: "training", Icon: Target },
    { title: "学ぶ", description: "基礎から戦術まで順番に", href: "/learn/guides", tone: "learning", Icon: BookOpen },
    isAdsenseReviewMode ? { title: "計算する", description: "役・符・翻から点数を確認", href: "/tools", tone: "analysis", Icon: Calculator } : { title: "Mリーグ", description: "対局・選手・チームを知る", href: siteConfig.externalSites.mLeaguePlayerDirectory.href, tone: "mleague", Icon: Trophy }
  ];
  return <>
    <section className="platformHomeHero" aria-labelledby="home-title">
      <h1 id="home-title">雀フォリオ</h1>
      <p className="platformHomeTagline">麻雀を、もっと強く。</p>
      <p className="platformHomeLead">学んで、練習して、実戦で活かす。</p>
      <form className="platformSearchForm" action="/toolbox" method="get" role="search">
        <Search aria-hidden="true" /><label className="platformSrOnly" htmlFor="home-tool-query">ツール・トレーニングを検索</label>
        <input id="home-tool-query" name="q" type="search" placeholder="何切る・点数・牌理を探す" />
        <button type="submit" aria-label="検索する" title="検索する"><ArrowRight aria-hidden="true" /></button>
      </form>
      <div className="platformPopularSearches"><Link href="/analysis/mahjong-tool">牌理チェッカー</Link><Link href="/trainer/iishanten">何切る</Link><Link href="/tools">点数計算</Link></div>
    </section>
    <nav className="platformCategoryGrid" aria-label="目的から選ぶ">{categories.map(({ title, description, href, tone, Icon }) => <a className="platformCategoryCard" key={title} href={href} data-tone={tone}><Icon aria-hidden="true" /><h2>{title}</h2><p>{description}</p></a>)}</nav>
    <section data-tone="analysis" aria-labelledby="home-frequent-heading"><div className="platformSectionHeading"><h2 id="home-frequent-heading">よく使うツール</h2><Link href="/toolbox">ツールを探す<ArrowRight size={18} aria-hidden="true" /></Link></div><div className="toolCardGrid">{["checker", "calculator", "orasu"].map(id => <ToolCard item={catalog.find(item => item.id === id)!} key={id} />)}</div></section>
    <section data-tone="training" aria-labelledby="home-training-heading"><div className="platformSectionHeading"><h2 id="home-training-heading">実戦につながる練習</h2><Link href="/trainer">すべてのトレーニングを見る<ArrowRight size={18} aria-hidden="true" /></Link></div><div className="toolCardGrid">{["iishanten", "seven-tile", "push-or-fold"].map(id => <ToolCard item={catalog.find(item => item.id === id)!} key={id} />)}</div></section>
  </>;
}
export function HomeLearningPaths() {
  return <>
    <section className="platformRoadmapBand" data-tone="learning" aria-labelledby="home-roadmap-heading">
      <div className="platformSectionHeading"><h2 id="home-roadmap-heading">はじめての麻雀、ここから。</h2><Link href="/learn/roadmap">初心者ロードマップ<ArrowRight size={18} aria-hidden="true" /></Link></div>
      <p>牌の種類からアガリの形、役、待ち、点数計算へ。11ステップで土台を作ります。</p>
      <ol className="platformRoadmapSteps"><li>ルールを知る</li><li>役と待ちを覚える</li><li>何切るを試す</li><li>点数を確認する</li></ol>
      <div className="platformHomeRelated"><Link className="platformCategoryCard" href="/learn/guides" data-tone="learning"><BookOpen aria-hidden="true" /><h3>麻雀を学ぶ</h3><p>牌効率・守備・実戦判断を牌図で学ぶ。</p></Link><Link className="platformCategoryCard" href="/rules/yaku" data-tone="learning"><BookOpen aria-hidden="true" /><h3>麻雀役一覧</h3><p>成立条件・翻数・鳴けるかを確認。</p></Link><Link className="platformCategoryCard" href="/learn/glossary" data-tone="learning"><BookOpen aria-hidden="true" /><h3>麻雀用語辞典</h3><p>知らない言葉をすぐに調べる。</p></Link></div>
    </section>
    {isAdsenseReviewMode ? <nav className="platformPopularSearches" aria-label="動画とMリーグ"><Link href="/videos/strategy">動画で学ぶ</Link><a href={siteConfig.externalSites.mLeaguePlayerDirectory.href}>Mリーグの対局・選手情報</a></nav> : <section data-tone="learning" aria-labelledby="home-more-heading">
      <div className="platformSectionHeading"><h2 id="home-more-heading">学びを広げる</h2></div>
      <div className="platformHomeRelated">
        <Link className="platformCategoryCard" href="/learn/guides" data-tone="learning"><BookOpen aria-hidden="true" /><h3>戦術・学習記事</h3><p>牌図と比較例で実戦の判断を整理。</p></Link>
        <Link className="platformCategoryCard" href="/videos/strategy" data-tone="learning"><SquarePlay aria-hidden="true" /><h3>動画で学ぶ</h3><p>基礎解説からプロの実戦思考まで。</p></Link>
        <a className="platformCategoryCard" href={siteConfig.externalSites.mLeaguePlayerDirectory.href} data-tone="mleague"><Trophy aria-hidden="true" /><h3>Mリーグ</h3><p>対局情報・選手・チームの記録を見る。</p></a>
      </div>
    </section>}
  </>;
}
