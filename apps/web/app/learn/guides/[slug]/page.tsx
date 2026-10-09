import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleTileFigures, getTileName } from "../../../components/TileFigures";
import { JsonLd } from "../../../components/JsonLd";
import { ArticleTakeaways, ArticleText } from "../../../components/ArticleHighlights";
import { getSiteUrl } from "../../../seoConfig";
import { getLearningGuide, learningGuides } from "../guideData";
import { guideArticleEmphasis } from "../guideHighlights";

type GuidePageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return learningGuides.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const guide = getLearningGuide((await params).slug);
  if (!guide) return {};
  const canonical = `/learn/guides/${guide.slug}`;
  return {
    title: guide.seoTitle,
    description: guide.description,
    alternates: { canonical },
    openGraph: { type: "article", url: canonical, title: guide.seoTitle, description: guide.description }
  };
}

export default async function GuidePage({ params }: GuidePageProps) {
  const guide = getLearningGuide((await params).slug);
  if (!guide) notFound();
  const siteUrl = getSiteUrl();
  const related = guide.relatedSlugs.map(getLearningGuide).filter((item) => item !== undefined);
  const articleUrl = `${siteUrl}/learn/guides/${guide.slug}`;

  return (
    <main className="siteMain articleMain learningGuidePage">
      <JsonLd data={[
        { "@context": "https://schema.org", "@type": "Article", headline: guide.title, description: guide.description, inLanguage: "ja-JP", mainEntityOfPage: articleUrl, author: { "@id": `${siteUrl}/#organization` }, publisher: { "@id": `${siteUrl}/#organization` } },
        { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
          { "@type": "ListItem", position: 1, name: "トップ", item: siteUrl },
          { "@type": "ListItem", position: 2, name: "麻雀を学ぶ", item: `${siteUrl}/learn/guides` },
          { "@type": "ListItem", position: 3, name: guide.title, item: articleUrl }
        ] }
      ]} />
      <article className="learningGuideArticle">
        <header className="learningGuideHeader">
          <nav aria-label="パンくずリスト"><Link href="/">トップ</Link><span>›</span><Link href="/learn/guides">麻雀を学ぶ</Link><span>›</span><span>{guide.title}</span></nav>
          <p className="siteEyebrow">MAHJONG PRACTICAL GUIDE</p>
          <h1>{guide.title}</h1>
          <p>{guide.lead}</p>
        </header>

        <ArticleTakeaways items={guide.takeaways} />

        {guide.sections.length >= 3 ? <nav className="articleContents" aria-label="この記事の目次"><strong>目次</strong><ol>{guide.sections.map((section, index) => <li key={section.heading}><a href={`#guide-section-${index + 1}`}>{section.heading}</a></li>)}</ol></nav> : null}

        {guide.sections.map((section, index) => (
          <section className="articleSection" id={`guide-section-${index + 1}`} key={section.heading}>
            <h2>{section.heading}</h2>
            {section.paragraphs.map((paragraph) => <p key={paragraph}><ArticleText text={paragraph} emphasis={guideArticleEmphasis[guide.slug]} /></p>)}
            {section.bullets ? <ul className="deepDiveList">{section.bullets.map((item) => <li key={item}>{item}</li>)}</ul> : null}
            {section.table ? <table className="learningGuideComparisonTable">
              <caption>{section.table.caption}</caption>
              <thead><tr>{section.table.headers.map((header) => <th scope="col" key={header}>{header}</th>)}</tr></thead>
              <tbody>{section.table.rows.map((row, index) => <tr key={index}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody>
            </table> : null}
            {section.sources ? <p className="learningGuideSources">出典：{section.sources.map((source, index) => <span key={source.href}>{index ? " ／ " : ""}<a href={source.href} target="_blank" rel="noopener noreferrer">{source.label}</a></span>)}</p> : null}
          </section>
        ))}

        <ArticleTileFigures figures={guide.figures} />

        {guide.practice ? (
          <section className="articleSection learningGuidePractice">
            <p className="siteEyebrow">PRACTICE</p>
            <h2>{guide.practice.heading}</h2>
            <p>{guide.practice.description}</p>
            <div className="learningGuidePracticeGrid">
              {guide.practice.items.map((item) => (
                <article key={item.prompt}>
                  <h3>{item.prompt}</h3>
                  <div className="learningGuidePracticeTiles" style={{ gridTemplateColumns: `repeat(${item.tiles.length}, minmax(0, 34px))` }} aria-label={item.tiles.map(getTileName).join("、")}>
                    {item.tiles.map((tile, index) => (
                      <img key={`${item.prompt}-${tile}-${index}`} src={`/tiles/${tile}-66-90-l-emb.png`} alt={getTileName(tile)} />
                    ))}
                  </div>
                  <p className="learningGuidePracticeConditions">{item.conditions}</p>
                  <details>
                    <summary>答えを見る</summary>
                    <strong>{item.answer}</strong>
                    <p>{item.explanation}</p>
                  </details>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {guide.screenshot ? (
          <figure className="learningGuideScreenshot">
            <img src={guide.screenshot.src} alt={guide.screenshot.alt} />
            <figcaption>{guide.screenshot.caption}</figcaption>
          </figure>
        ) : null}

        <section className="learningGuideToolCta">
          <p className="siteEyebrow">TRY IT</p>
          <h2>{guide.toolLink.label}</h2>
          <p>{guide.toolLink.description}</p>
          <Link href={guide.toolLink.href}>{guide.toolLink.label}</Link>
        </section>

        <section className="learningGuideRelated">
          <p className="siteEyebrow">RELATED GUIDES</p>
          <h2>関連する記事</h2>
          <div>{related.map((item) => <Link href={`/learn/guides/${item.slug}`} key={item.slug}><strong>{item.title}</strong><span>{item.description}</span></Link>)}</div>
        </section>
      </article>
    </main>
  );
}
