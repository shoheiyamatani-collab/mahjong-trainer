import type { Metadata } from "next";
import Link from "next/link";
import {
  ClearRainBasicTheoryBook,
  ClearRainNanikiruBook,
  HirasawaDefenseBook,
  HirasawaTileEfficiencyBook
} from "../../components/VideoBookRecommendation";
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

export function VideoLessonArticle({ lesson }: { lesson: VideoLesson }) {
  const videoUrl = `https://www.youtube.com/watch?v=${lesson.guide.youtubeId}`;

  return (
    <main className="siteMain videoArticlePage">
      <article>
        <header className="videoArticleHeader">
          <nav aria-label="パンくずリスト">
            <Link href="/">トップ</Link>
            <span>›</span>
            <Link href="/videos/strategy">麻雀を動画で学ぶ</Link>
            <span>›</span>
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
            loading="lazy"
          />
        </div>
        <p className="videoSourceNote">
          動画提供: <a href={videoUrl} target="_blank" rel="noopener noreferrer">{lesson.guide.publisher}の元動画をYouTubeで見る</a>
        </p>

        <aside className="videoArticleSidebar">
          <section className="videoArticleAudience">
            <div>
              <p className="videoArticleSectionLabel">RECOMMENDED FOR</p>
              <h2>この動画はこんな人に向いています</h2>
            </div>
            <ul>
              {lesson.recommendedFor.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </section>

          <section className="videoArticleHighlights">
            <h2>動画を見る時のポイント</h2>
            <ol>
              {lesson.watchPoints.map((point, index) => (
                <li key={point.title}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div><strong>{point.title}</strong><p>{point.description}</p></div>
                </li>
              ))}
            </ol>
          </section>
        </aside>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">OVERVIEW</p>
          <h2>この動画で学べること</h2>
          {lesson.overview.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">KEY POINTS</p>
          <h2>内容の要点</h2>
          <div className="videoPrincipleList">
            {lesson.keyPoints.map((point, index) => (
              <section className="videoPrinciple" key={point.title}>
                <div className="videoPrincipleNumber">{index + 1}</div>
                <div className="videoPrincipleBody">
                  <h3>{point.title}</h3>
                  <p>{point.description}</p>
                </div>
              </section>
            ))}
          </div>
        </section>

        <section className="videoArticleCaution">
          <p className="videoArticleSectionLabel">AT THE TABLE</p>
          <h2>実戦で意識するポイント</h2>
          <ul>
            {lesson.practicalPoints.map((point) => <li key={point}>{point}</li>)}
          </ul>
        </section>

        {lesson.book ? <BookRecommendation book={lesson.book} /> : null}

        <section className="videoArticleNext">
          <p className="videoArticleSectionLabel">RELATED</p>
          <h2>関連する雀フォリオの記事</h2>
          <div>
            {lesson.relatedLinks.map((link) => <Link href={link.href} key={link.href}>{link.label}</Link>)}
          </div>
        </section>

        <section className="videoArticleNext">
          <p className="videoArticleSectionLabel">NEXT STEP</p>
          <h2>次に学ぶおすすめ</h2>
          <div>
            {lesson.nextLinks.map((link) => <Link href={link.href} key={link.href}>{link.label}</Link>)}
          </div>
        </section>
      </article>
    </main>
  );
}

function BookRecommendation({ book }: { book: VideoLessonBook }) {
  if (book === "clear-basic") return <ClearRainBasicTheoryBook />;
  if (book === "clear-nanikiru") return <ClearRainNanikiruBook />;
  if (book === "hirasawa-defense") return <HirasawaDefenseBook />;
  return <HirasawaTileEfficiencyBook />;
}
