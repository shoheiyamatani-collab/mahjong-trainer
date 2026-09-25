import type { Metadata } from "next";
import Link from "next/link";
import {
  Calculator,
  CirclePlay,
  Search,
  Target
} from "lucide-react";
import { generateDailyNanikiru, japanDate } from "@mahjong-trainer/mahjong-core";
import { DailyNanikiruQuestion } from "./components/DailyNanikiruQuestion";
import { siteConfig } from "./siteConfig";

export const metadata: Metadata = {
  title: "雀フォリオ｜麻雀初心者のための学習・練習サイト",
  description: "麻雀初心者がルール、役、待ち、何切る、点数計算を順番に学べる麻雀学習サイトです。練習問題、解析ツール、動画解説をつなげて学べます。",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "/",
    siteName: "雀フォリオ",
    title: "雀フォリオ｜麻雀初心者のための学習・練習サイト",
    description: "麻雀を知る、学ぶ、強くなる。ルール、練習、解析、動画をつなぐ麻雀学習サイトです。"
  }
};

const portalItems = [
  {
    title: "麻雀解析ツール",
    href: "/analysis/mahjong-tool",
    tone: "analysis",
    icon: Search
  },
  {
    title: "麻雀トレーニング",
    href: "/trainer",
    tone: "training",
    icon: Target
  },
  {
    title: "点数計算ツール",
    href: "/tools",
    tone: "score",
    icon: Calculator
  },
  {
    title: "麻雀を動画で学ぶ",
    href: "/videos/strategy",
    tone: "video",
    icon: CirclePlay
  }
] as const;

export default function HomePage() {
  const initialDailyProblem = generateDailyNanikiru(japanDate());

  return (
    <main className="siteMain homePage">
      <section className="homeHero" aria-labelledby="home-title">
        <div className="homeHeroCopy">
          <div className="homeHeroBrandRow">
            <span className="siteLogoMark siteLogoMarkImage homeHeroLogo" aria-hidden="true" />
            <div>
              <p className="homeHeroEnglish">JONGFOLIO</p>
              <p className="homeHeroCategory">MAHJONG LEARNING HUB</p>
            </div>
          </div>
          <h1 id="home-title">雀フォリオ</h1>
          <p className="homeHeroTagline">麻雀を知る、学ぶ、強くなる。</p>
        </div>
        <Link className="homeHeroChecker" href="/analysis/mahjong-tool" aria-label="牌理チェッカーを使う">
          <img
            src="/tool-screenshots/ukeire-checker-hero.png"
            alt="牌理チェッカーで手牌を入力し、打牌候補と有効牌を比較している画面"
          />
        </Link>
      </section>

      <nav className="homeQuickNav" aria-label="雀フォリオの主要コンテンツ">
        {portalItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link className={`homeQuickNav-${item.tone}`} href={item.href} key={item.title}>
              <Icon aria-hidden="true" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <DailyNanikiruQuestion initialProblem={initialDailyProblem} />

      <section className="homeIntroSection" aria-labelledby="home-intro-title">
        <div className="homeSectionHeading">
          <p>ABOUT JONGFOLIO</p>
          <h2 id="home-intro-title">雀フォリオは、初心者から実戦派まで使える麻雀学習サイトです</h2>
          <span>
            ルールや役を覚えるところから、何切る・牌効率・点数計算・対局戦術まで。
            解説を読んで終わりにせず、練習問題と解析ツールを行き来しながら実戦力を伸ばせます。
          </span>
        </div>

        <div className="homeIntroGrid">
          <section className="homeIntroBlock" aria-labelledby="home-audience-title">
            <h3 id="home-audience-title">こんな方におすすめ</h3>
            <ul className="homeAudienceList">
              <li>麻雀のルールや役を基礎から順番に学びたい方</li>
              <li>何切るや点数計算を繰り返し練習したい方</li>
              <li>自分の打牌を数値と牌姿で詳しく振り返りたい方</li>
              <li>Mリーグやプロ雀士の思考から実戦判断を学びたい方</li>
            </ul>
          </section>

          <section className="homeIntroBlock" aria-labelledby="home-features-title">
            <h3 id="home-features-title">雀フォリオでできること</h3>
            <ul className="homeSiteFeatureList">
              <li>
                <Link href="/learn/roadmap">独自解説で基礎から体系的に学ぶ</Link>
                <p>初心者ロードマップ、役一覧、用語辞典で、迷いにくい順番に麻雀の土台を作れます。</p>
              </li>
              <li>
                <Link href="/trainer">練習ツールで実戦力をつける</Link>
                <p>何切るや点数計算を練習し、牌理チェッカーで受け入れ枚数や良形率まで詳しく確認できます。</p>
              </li>
              <li>
                <Link href="/videos/strategy">動画解説で判断の考え方を学ぶ</Link>
                <p>初心者向けの基礎からプロの実戦解説まで、テーマに合う動画と独自の要約を一緒に読めます。</p>
              </li>
              <li>
                {siteConfig.externalSites.mLeaguePlayerDirectory.external ? (
                  <a
                    href={siteConfig.externalSites.mLeaguePlayerDirectory.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Mリーグとプロ雀士を知る
                  </a>
                ) : (
                  <Link href={siteConfig.externalSites.mLeaguePlayerDirectory.href}>Mリーグとプロ雀士を知る</Link>
                )}
                <p>最新対局結果、順位、チーム、選手名鑑をまとめて確認し、プロの成績や歩みを追えます。</p>
              </li>
            </ul>
          </section>
        </div>
      </section>
    </main>
  );
}
