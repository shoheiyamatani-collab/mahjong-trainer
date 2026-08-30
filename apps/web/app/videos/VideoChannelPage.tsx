import Link from "next/link";
import { ComingSoonBadge } from "../components/Badges";
import { siteConfig } from "../siteConfig";
import { getStrategyCategory, strategyCategoryOrder, type VideoChannel, type VideoGuide } from "./videoData";

export function VideoChannelPage({ channel, strategyAudience }: { channel: VideoChannel; strategyAudience?: "beginner" | "advanced" }) {
  const isStrategy = channel.slug === "strategy";
  const isBeginnerStrategy = isStrategy && strategyAudience === "beginner";
  const categoryLabel = (guide: VideoGuide) => (isStrategy ? getStrategyCategory(guide.category) : guide.category);
  const categories: Array<{ label: string; count: number; href?: string }> = isStrategy
    ? strategyCategoryOrder
        .map((label) => ({ label, count: channel.guides.filter((guide) => categoryLabel(guide) === label).length }))
        .filter((category) => category.count > 0)
    : channel.guides.reduce<Array<{ label: string; count: number; href?: string }>>((items, guide) => {
        const existing = items.find((item) => item.label === guide.category);
        if (existing) {
          existing.count += 1;
          existing.href ??= guide.categoryHref;
        } else {
          items.push({ label: guide.category, count: 1, href: guide.categoryHref });
        }
        return items;
      }, []);

  return (
    <main className={`siteMain videoBlogPage videoChannel-${channel.accent}`}>
      <header className="videoBlogMasthead">
        <div>
          <p className="siteEyebrow">{channel.eyebrow}</p>
          <h1>{isBeginnerStrategy ? "初心者向け動画で麻雀を学ぶ" : channel.title}</h1>
          <p>{isBeginnerStrategy ? "牌効率、何切る、役、点数計算、守備など、麻雀を覚えたばかりの方に役立つ動画を牌図つきで紹介します。" : channel.description}</p>
        </div>
        <div className="videoBlogTiles" aria-hidden="true">
          {channel.heroTiles.map((tile) => (
            <img key={tile} src={`/tiles/${tile}-66-90-l-emb.png`} alt="" />
          ))}
        </div>
      </header>

      <nav className="videoChannelSwitch" aria-label="動画チャンネル">
        <Link className={isStrategy ? "isActive" : ""} href="/videos/strategy">麻雀を動画で学ぶ</Link>
        {siteConfig.features.showMLeagueLinks ? (
          <Link className={isStrategy ? "" : "isActive"} href="/videos/mleague-clips">Mリーグ厳選切り抜きを見る</Link>
        ) : null}
      </nav>

      {isStrategy ? (
        <nav className="strategyAudienceSwitch" aria-label="麻雀学習動画のレベル">
          <Link className={strategyAudience === "beginner" ? "isActive" : ""} href="/videos/strategy/beginner">
            <span>BEGINNER</span>
            <strong>初心者向け動画</strong>
            <small>基本ルールから牌効率・守備まで</small>
          </Link>
          <Link className={strategyAudience === "advanced" ? "isActive" : ""} href="/videos/strategy/advanced">
            <span>INTERMEDIATE +</span>
            <strong>中級者以上向け動画</strong>
            <small>より深い読みと実戦判断</small>
          </Link>
        </nav>
      ) : null}

      <div className="videoBlogLayout">
        <div className="videoBlogFeed">
          <div className="videoPostList" aria-label="動画記事一覧">
            {channel.guides.map((guide, index) => (
              <PostRow categoryLabel={categoryLabel(guide)} guide={guide} index={index + 1} key={guide.title} />
            ))}
          </div>
        </div>

        <aside className="videoBlogSidebar">
          <section>
            <p className="videoSidebarLabel">CATEGORIES</p>
            <h2>カテゴリー</h2>
            <ul>
              {categories.map((category) => (
                <li key={category.label}>
                  {"href" in category && category.href ? <Link href={category.href}>{category.label}</Link> : <span>{category.label}</span>}
                  <b>{category.count}</b>
                </li>
              ))}
            </ul>
          </section>

          <section className="videoBlogAbout">
            <p className="videoSidebarLabel">ABOUT</p>
            <h2>このブログについて</h2>
            <p>おすすめ動画を貼るだけでなく、見るべき局面、面白さ、学べる内容を自分の言葉と牌図で解説します。</p>
          </section>

          <section className="videoBlogRelated">
            <p className="videoSidebarLabel">LEARN MORE</p>
            <h2>動画のあとに</h2>
            <Link href="/analysis/mahjong-tool">麻雀解析ツールを使う</Link>
            <Link href="/trainer">麻雀トレーニングで試す</Link>
            {!isStrategy || siteConfig.features.showMLeagueLinks ? (
              <Link href={isStrategy ? "/videos/mleague-clips" : "/videos/strategy"}>
                {isStrategy ? "Mリーグ動画の記事を見る" : "麻雀戦術の記事を見る"}
              </Link>
            ) : null}
          </section>
        </aside>
      </div>
    </main>
  );
}

function PostRow({ categoryLabel, guide, index }: { categoryLabel: string; guide: VideoGuide; index: number }) {
  return (
    <article className="videoPostRow">
      <VideoPostVisual guide={guide} variant={`row-${index}`} />
      <div className="videoPostRowBody">
        <PostMeta categoryLabel={categoryLabel} guide={guide} />
        <h2>{guide.articleHref ? <Link href={guide.articleHref}>{guide.title}</Link> : guide.title}</h2>
        <p>{guide.description}</p>
        <div className="videoPostFooter">
          <span>{guide.focus}</span>
          {guide.articleHref ? <Link className="videoArticleLink" href={guide.articleHref}>記事を読む</Link> : <span className="videoArticlePending" aria-disabled="true">記事を準備中</span>}
        </div>
      </div>
    </article>
  );
}

function VideoPostVisual({ guide, variant }: { guide: VideoGuide; variant: string }) {
  if (guide.youtubeId) {
    return (
      <div className="videoEmbed">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${guide.youtubeId}`}
          title={guide.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div className={`videoBlogThumbnail videoBlogThumbnail-${variant}`}>
      <span className="videoPlayMark" aria-hidden="true">▶</span>
      <ComingSoonBadge />
      <p>紹介動画を選定中</p>
    </div>
  );
}

function PostMeta({ categoryLabel, guide }: { categoryLabel: string; guide: VideoGuide }) {
  return (
    <div className="videoPostMeta">
      {guide.categoryHref && categoryLabel === guide.category ? <Link href={guide.categoryHref}>{categoryLabel}</Link> : <span>{categoryLabel}</span>}
      <time>{guide.dateLabel}</time>
      <span>{guide.readingTime}</span>
      {guide.publisher ? <span>{guide.publisher}</span> : null}
    </div>
  );
}
