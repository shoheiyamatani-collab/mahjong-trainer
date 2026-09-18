import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { JsonLd } from "../../components/JsonLd";
import { getSiteUrl } from "../../seoConfig";
import {
  ClearRainBasicTheoryBook,
  ClearRainNanikiruBook,
  HirasawaDefenseBook,
  HirasawaTileEfficiencyBook
} from "../../components/VideoBookRecommendation";
import { VideoArticleCompactContent } from "./VideoArticleCompactContent";
import type { VideoLesson, VideoLessonBook } from "./videoLessonData";

export function createVideoLessonMetadata(lesson: VideoLesson): Metadata {
  const canonical = `/videos/strategy/${lesson.slug}`;

  return {
    title: lesson.guide.title,
    description: lesson.guide.description,
    alternates: { canonical },
    openGraph: {
      type: "article",
      url: canonical,
      siteName: "雀フォリオ",
      title: lesson.guide.title,
      description: lesson.guide.description
    }
  };
}

export function VideoLessonArticle({
  lesson,
  parent,
  bookRecommendation
}: {
  lesson: VideoLesson;
  parent?: { href: string; label: string };
  bookRecommendation?: ReactNode;
}) {
  const videoUrl = `https://www.youtube.com/watch?v=${lesson.guide.youtubeId}`;
  const articlePath = `/videos/strategy/${lesson.slug}`;
  const siteUrl = getSiteUrl();
  const publishedAt = toIsoDate(lesson.guide.dateLabel);
  const videoStructuredData = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: lesson.youtubeTitle,
    description: lesson.guide.description,
    thumbnailUrl: [`https://i.ytimg.com/vi/${lesson.guide.youtubeId}/maxresdefault.jpg`],
    ...(publishedAt ? { uploadDate: publishedAt } : {}),
    embedUrl: `https://www.youtube-nocookie.com/embed/${lesson.guide.youtubeId}`,
    contentUrl: videoUrl,
    inLanguage: "ja-JP",
    isFamilyFriendly: true,
    mainEntityOfPage: `${siteUrl}${articlePath}`,
    publisher: { "@id": `${siteUrl}/#organization` }
  };
  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "トップ", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "麻雀を動画で学ぶ", item: `${siteUrl}/videos/strategy` },
      ...(parent ? [{ "@type": "ListItem", position: 3, name: parent.label, item: `${siteUrl}${parent.href}` }] : []),
      { "@type": "ListItem", position: parent ? 4 : 3, name: lesson.guide.title, item: `${siteUrl}${articlePath}` }
    ]
  };
  const relatedLinks = [...lesson.nextLinks, ...lesson.relatedLinks]
    .filter((link, index, links) => links.findIndex((candidate) => candidate.href === link.href) === index)
    .slice(0, 4);

  return (
    <main className="siteMain videoArticlePage">
      <JsonLd data={[videoStructuredData, breadcrumbStructuredData]} />
      <article>
        <header className="videoArticleHeader">
          <nav aria-label="パンくずリスト">
            <Link href="/">トップ</Link>
            <span>›</span>
            <Link href="/videos/strategy">麻雀を動画で学ぶ</Link>
            <span>›</span>
            {parent ? (
              <>
                <Link href={parent.href}>{parent.label}</Link>
                <span>›</span>
              </>
            ) : null}
            <span>{lesson.guide.category}</span>
          </nav>
          <p className="siteEyebrow">VIDEO GUIDE / {lesson.guide.category}</p>
          <h1>{lesson.guide.title}</h1>
          <p className="videoArticleLead">{lesson.lead}</p>
          <div className="videoArticleByline">
            <span>学習レベル: {lesson.guide.level}</span>
            <span>紹介動画: {lesson.guide.publisher}</span>
            <time>動画公開日 {lesson.guide.dateLabel}</time>
            <span>動画 {lesson.videoDuration}</span>
          </div>
        </header>

        <div className="videoArticleEmbed">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${lesson.guide.youtubeId}`}
            title={lesson.youtubeTitle}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="eager"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
        <p className="videoSourceNote">
          動画提供: <a href={videoUrl} target="_blank" rel="noopener noreferrer">{lesson.guide.publisher}の元動画をYouTubeで見る</a>
        </p>

        <section className="videoArticleAudience">
          <div>
            <p className="videoArticleSectionLabel">RECOMMENDED FOR</p>
            <h2>この動画はこんな人に向いています</h2>
          </div>
          <ul>
            {lesson.recommendedFor.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </section>

        <VideoArticleCompactContent message={lesson.overview[0]} points={lesson.keyPoints} />

        {bookRecommendation}
        {lesson.book ? <BookRecommendation book={lesson.book} /> : null}

        <section className="videoArticleNext">
          <p className="videoArticleSectionLabel">NEXT STEP</p>
          <h2>関連する練習・解説へ進む</h2>
          <div>
            {relatedLinks.map((link) => <Link href={link.href} key={link.href}>{link.label}</Link>)}
          </div>
        </section>
      </article>
    </main>
  );
}

function toIsoDate(dateLabel: string) {
  const match = dateLabel.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
  if (!match) return undefined;
  return `${match[1]}-${match[2].padStart(2, "0")}-${match[3].padStart(2, "0")}`;
}

function BookRecommendation({ book }: { book: VideoLessonBook }) {
  if (book === "clear-basic") return <ClearRainBasicTheoryBook />;
  if (book === "clear-nanikiru") return <ClearRainNanikiruBook />;
  if (book === "hirasawa-defense") return <HirasawaDefenseBook />;
  return <HirasawaTileEfficiencyBook />;
}
