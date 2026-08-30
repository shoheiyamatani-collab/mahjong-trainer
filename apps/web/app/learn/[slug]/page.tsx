import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ComingSoonBadge } from "../../components/Badges";
import { InternalLinkCard, SectionTitle } from "../../components/SiteSections";
import { ArticleTileFigures } from "../../components/TileFigures";
import { getAdjacentLearnArticles, getLearnArticle, learnArticles, type LinkTarget } from "../../siteData";
import { learnDeepDiveBySlug } from "../deepDiveData";
import { learnTileFiguresBySlug } from "../tileFigureData";
import { ArticleQuiz } from "./ArticleQuiz";

type LearnArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return learnArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: LearnArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getLearnArticle(slug);
  if (!article) return {};

  return {
    title: article.seoTitle,
    description: article.description
  };
}

export default async function LearnArticlePage({ params }: LearnArticlePageProps) {
  const { slug } = await params;
  const article = getLearnArticle(slug);
  if (!article) notFound();

  const { previous, next } = getAdjacentLearnArticles(article.slug);
  const tileFigures = learnTileFiguresBySlug[article.slug];
  const deepDiveSections = learnDeepDiveBySlug[article.slug] ?? [];
  const totalSteps = learnArticles.length;

  return (
    <main className="siteMain articleMain learningArticlePage">
      <div className="learningCourseLayout">
        <aside className="learningCourseNav" aria-label="初心者ロードマップ">
          <Link className="learningCourseTitle" href="/learn/roadmap">はじめての麻雀ロードマップ</Link>
          <ol>
            {learnArticles.map((item) => (
              <li className={item.slug === article.slug ? "isCurrent" : undefined} key={item.slug}>
                <Link aria-current={item.slug === article.slug ? "step" : undefined} href={`/learn/${item.slug}`}>
                  <span className="learningCourseNumber">{item.step}</span>
                  <span>{item.title}</span>
                  {item.step < article.step ? <span className="learningCourseCheck" aria-label="読了">✓</span> : null}
                </Link>
              </li>
            ))}
          </ol>
          <div className="learningCourseNote">
            <strong>このロードマップについて</strong>
            <p>麻雀を遊ぶために必要な基礎を、順番にひとつずつ学べます。</p>
          </div>
        </aside>

        <div className="learningLessonMain">
          <header className="learningLessonHeader">
            <div className="learningLessonProgress">
              <span>STEP {article.step} / {totalSteps}</span>
              <div aria-hidden="true"><span style={{ width: `${(article.step / totalSteps) * 100}%` }} /></div>
            </div>
            <p className="learningLessonEyebrow">BEGINNER LESSON</p>
            <h1>{article.title}</h1>
            <p>{article.description}</p>
          </header>

          <article className="articleLayout">
            <div className="articleContent">
          <section className="articleSection">
            <h2>この記事で覚えること</h2>
            <ul className="articleChecklist">
              {article.learnPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </section>

          <section className="articleSection">
            <h2>初心者向けの本文</h2>
            {article.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>

          <section className="articleSection exampleSection">
            <h2>かんたんな例</h2>
            <p>{article.example}</p>
          </section>

          <ArticleTileFigures figures={tileFigures} />

          {deepDiveSections.length ? (
            <section className="articleSection deepDiveSection">
              <h2>もう少し詳しく</h2>
              <div className="deepDiveStack">
                {deepDiveSections.map((section) => (
                  <article className="deepDiveCard" key={section.heading}>
                    <h3>{section.heading}</h3>
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                    {section.bullets?.length ? (
                      <ul className="deepDiveList">
                        {section.bullets.map((bullet) => (
                          <li key={bullet}>{bullet}</li>
                        ))}
                      </ul>
                    ) : null}
                    {section.figures?.length ? (
                      <div className="deepDiveFigureRows">
                        {section.figures.map((figure) => (
                          <div className={`tileFigureRow tone-${figure.tone ?? "normal"}`} key={figure.label}>
                            <div className="tileFigureRowLabel">{figure.label}</div>
                            <div className="articleTileStrip" aria-label={figure.tiles.join("、")}>
                              {figure.tiles.map((tile, index) => (
                                <img key={`${figure.label}-${tile}-${index}`} src={`/tiles/${tile}-66-90-l-emb.png`} alt="" />
                              ))}
                            </div>
                            {figure.resultTiles?.length ? (
                              <>
                                <div className="tileFigureArrow" aria-hidden="true">
                                  →
                                </div>
                                <div className="tileFigureResult">
                                  {figure.resultLabel ? <span>{figure.resultLabel}</span> : null}
                                  <div className="articleTileStrip compact" aria-label={figure.resultTiles.join("、")}>
                                    {figure.resultTiles.map((tile, index) => (
                                      <img key={`${figure.label}-result-${tile}-${index}`} src={`/tiles/${tile}-66-90-l-emb.png`} alt="" />
                                    ))}
                                  </div>
                                </div>
                              </>
                            ) : null}
                            <p className="tileFigureNote">{figure.note}</p>
                          </div>
                        ))}
                      </div>
                    ) : null}
                    {section.callout ? <p className="deepDiveCallout">{section.callout}</p> : null}
                  </article>
                ))}
              </div>
            </section>
          ) : null}

          {article.misconceptions.length ? (
            <section className="articleSection">
              <h2>よくある勘違い</h2>
              <ul className="misconceptionList">
                {article.misconceptions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ) : null}

          <ArticleQuiz quiz={article.quiz} />
            </div>
          </article>

          <nav className="learningLessonPager" aria-label="前後の記事">
            {previous ? <Link href={`/learn/${previous.slug}`}>← {previous.title}</Link> : <Link href="/learn/roadmap">← ロードマップ</Link>}
            {next ? <Link className="isNext" href={`/learn/${next.slug}`}>{next.title} →</Link> : <Link className="isNext" href="/trainer">練習へ進む →</Link>}
          </nav>

          <section className="learningLessonLinks">
            <SectionTitle title="次に読むページ" description="順番に読むと、最低限ゲームを楽しめるところまで進めます。" />
            <div className="linkCardGrid">
              {next ? (
                <InternalLinkCard title={`次に読む：${next.title}`} description={next.description} href={`/learn/${next.slug}`} actionLabel="次の記事を読む" />
              ) : (
                <InternalLinkCard title="麻雀トレーニングへ進む" description="ロードマップを読み終えたら、何切るや待ち当てで手を動かして確認します。" href="/trainer" actionLabel="練習する" />
              )}
              <RelatedLinkCard title="関連する練習問題" target={article.relatedPractice} fallbackHref="/trainer" />
              <RelatedLinkCard title="関連するツール" target={article.relatedTool} fallbackHref="/tools" />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function RelatedLinkCard({ title, target, fallbackHref }: { title: string; target: LinkTarget; fallbackHref: string }) {
  const isComingSoon = target.status === "comingSoon" || !target.href;
  return (
    <article className="internalLinkCard">
      <div>
        <div className="cardTopline">
          <h3>{title}</h3>
          {isComingSoon ? <ComingSoonBadge /> : null}
        </div>
        <p>{target.label}</p>
      </div>
      {isComingSoon ? (
        <span aria-disabled="true">準備中</span>
      ) : (
        <Link href={target.href ?? fallbackHref}>{target.label}</Link>
      )}
    </article>
  );
}
