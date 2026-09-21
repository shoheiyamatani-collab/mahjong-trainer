import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleTileFigures } from "../../../components/TileFigures";
import { JsonLd } from "../../../components/JsonLd";
import { getSiteUrl } from "../../../seoConfig";
import { getLearningGuide, learningGuides } from "../guideData";

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
          { "@type": "ListItem", position: 2, name: "麻雀を学ぶ", item: `${siteUrl}/learn` },
          { "@type": "ListItem", position: 3, name: guide.title, item: articleUrl }
        ] }
      ]} />
      <article className="learningGuideArticle">
        <header className="learningGuideHeader">
          <nav aria-label="パンくずリスト"><Link href="/">トップ</Link><span>›</span><Link href="/learn">麻雀を学ぶ</Link><span>›</span><span>{guide.title}</span></nav>
          <p className="siteEyebrow">MAHJONG PRACTICAL GUIDE</p>
          <h1>{guide.title}</h1>
          <p>{guide.lead}</p>
        </header>

        <section className="articleSection">
          <h2>この記事で分かること</h2>
          <ul className="articleChecklist">{guide.takeaways.map((item) => <li key={item}>{item}</li>)}</ul>
        </section>

        {guide.sections.map((section) => (
          <section className="articleSection" key={section.heading}>
            <h2>{section.heading}</h2>
            {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            {section.bullets ? <ul className="deepDiveList">{section.bullets.map((item) => <li key={item}>{item}</li>)}</ul> : null}
          </section>
        ))}

        <ArticleTileFigures figures={guide.figures} />

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
