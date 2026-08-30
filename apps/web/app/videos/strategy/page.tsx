import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "../../siteConfig";
import { advancedStrategyChannel, videoChannels } from "../videoData";

const featuredChannels = [
  {
    name: "発男道場【麻雀解説ch】",
    publisher: "発男道場【麻雀解説ch】",
    description: "牌効率、何切る、守備、読みなど、実戦で使える判断手順を学べる動画を中心に紹介しています。",
    href: "https://www.youtube.com/@hatsuodojo"
  },
  {
    name: "クリアレインのアトリエ【麻雀解説】",
    publisher: "クリアレインのアトリエ【麻雀解説】",
    description: "初心者向けの何切る、役、点数計算など、問題と牌姿で基礎を確認できる動画を紹介しています。",
    href: "https://www.youtube.com/@clearrain001"
  },
  {
    name: "平澤元気麻雀ch",
    publisher: "平澤元気麻雀ch",
    description: "牌効率、鳴き、守備など、麻雀戦術を基礎から体系的に学べる動画を紹介しています。",
    href: "https://www.youtube.com/channel/UCwhNnYUXoyQGe0snQnYF2BQ"
  }
] as const;

export const metadata: Metadata = {
  title: "麻雀を動画で学ぶ | 初心者・中級者向け動画記事",
  description: "麻雀の学習動画を初心者向けと中級者以上向けに分けて紹介します。動画の見どころを牌図と解説つきで確認できます。"
};

export default function StrategyVideoPage() {
  const channel = videoChannels.strategy;
  const publishedGuides = [...channel.guides, ...advancedStrategyChannel.guides];

  return (
    <main className="siteMain videoBlogPage videoChannel-blue strategyAudienceHub">
      <header className="videoBlogMasthead">
        <div>
          <p className="siteEyebrow">{channel.eyebrow}</p>
          <h1>{channel.title}</h1>
          <p>自分のレベルに合う入口を選び、動画と牌図つきの記事で麻雀を学べます。</p>
        </div>
        <div className="videoBlogTiles" aria-hidden="true">
          {channel.heroTiles.map((tile) => <img key={tile} src={`/tiles/${tile}-66-90-l-emb.png`} alt="" />)}
        </div>
      </header>

      <nav className="videoChannelSwitch" aria-label="動画チャンネル">
        <Link className="isActive" href="/videos/strategy">麻雀を動画で学ぶ</Link>
        {siteConfig.features.showMLeagueLinks ? <Link href="/videos/mleague-clips">Mリーグ厳選切り抜きを見る</Link> : null}
      </nav>

      <section className="strategyAudienceIntro">
        <p className="videoBlogSectionLabel">CHOOSE YOUR LEVEL</p>
        <h2>レベルに合わせて動画を選ぶ</h2>
        <p>これまで掲載した動画は、麻雀を覚えたばかりの方が順番に学べる「初心者向け動画」にまとめています。</p>
      </section>

      <div className="strategyAudienceLinks">
        <Link href="/videos/strategy/beginner" className="strategyAudienceLink isBeginner">
          <div className="strategyAudienceLinkCopy">
            <span>BEGINNER</span>
            <h2>初心者向け動画</h2>
            <p>牌効率、何切る、役、点数計算、ベタオリなど、最初に身につけたい内容を動画と牌図で学びます。</p>
            <strong>{channel.guides.length}本の記事を見る</strong>
          </div>
          <div className="strategyAudienceVisual strategyAudienceVisualTypography">
            <img src="/images/videos/mahjong-beginner-typography.webp" alt="はじめる。麻雀。ルール・役・点数計算を基礎から学ぶ初心者向け案内" />
          </div>
        </Link>

        <Link href="/videos/strategy/advanced" className="strategyAudienceLink isAdvanced">
          <div className="strategyAudienceLinkCopy">
            <span>INTERMEDIATE +</span>
            <h2>中級者以上向け動画</h2>
            <p>より深い牌効率、押し引き、読み、手順比較など、実戦判断を掘り下げる動画をこれからまとめます。</p>
            <strong>{advancedStrategyChannel.guides.length}本の記事を見る</strong>
          </div>
          <div className="strategyAudienceVisual strategyAudienceVisualTypography">
            <img src="/images/videos/mahjong-intermediate-typography.webp" alt="読む・押す・引くを深く学ぶ中級者以上向け案内" />
          </div>
        </Link>
      </div>

      <section className="videoPublisherSection" aria-labelledby="video-publishers-title">
        <div className="videoPublisherHeading">
          <p className="videoBlogSectionLabel">FEATURED CHANNELS</p>
          <h2 id="video-publishers-title">掲載している麻雀チャンネル</h2>
          <p>雀フォリオでは、次の3チャンネルが公開している動画をYouTube公式プレーヤーで紹介し、見るポイントや学べる内容を独自にまとめています。</p>
        </div>
        <div className="videoPublisherGrid">
          {featuredChannels.map((featuredChannel, index) => {
            const articleCount = publishedGuides.filter((guide) => guide.publisher === featuredChannel.publisher).length;

            return (
              <article className="videoPublisherCard" key={featuredChannel.name}>
                <div className="videoPublisherNumber" aria-hidden="true">{String(index + 1).padStart(2, "0")}</div>
                <div>
                  <h3>{featuredChannel.name}</h3>
                  <p>{featuredChannel.description}</p>
                </div>
                <div className="videoPublisherFooter">
                  <span>{articleCount}本の記事を掲載</span>
                  <Link href={featuredChannel.href} target="_blank" rel="noreferrer">公式YouTubeを見る</Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
