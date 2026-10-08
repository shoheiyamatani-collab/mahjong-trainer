import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Map } from "lucide-react";
import { JsonLd } from "../../components/JsonLd";
import { getSiteUrl } from "../../seoConfig";
import { learningGuides } from "./guideData";
import { GuideLibrary } from "./GuideLibrary";
import { buildGuideLibrary } from "./guideLibraryData";
import styles from "./guideLibrary.module.css";

export const metadata: Metadata = {
  title: "麻雀を学ぶ | 牌効率・何切る・守備・点数計算の実戦ガイド",
  description: "麻雀の5ブロック理論、待ち、何切る、スジ・カベ、鳴き、点数計算を、牌姿つきの記事で順番に学べるガイド集です。",
  alternates: { canonical: "/learn/guides" },
  openGraph: {
    type: "website",
    url: "/learn/guides",
    title: "麻雀を学ぶ | 雀フォリオ",
    description: "牌効率・何切る・守備・点数計算を、牌姿つきの記事で学べます。"
  }
};

export default function LearningGuidesPage() {
  const siteUrl = getSiteUrl();
  const library = buildGuideLibrary(learningGuides);

  return (
    <main className={`siteMain ${styles.page}`}>
      <JsonLd data={[
        {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "麻雀を学ぶ",
          description: metadata.description,
          url: `${siteUrl}/learn/guides`,
          mainEntity: {
            "@type": "ItemList",
            itemListElement: learningGuides.map((guide, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: guide.title,
              url: `${siteUrl}/learn/guides/${guide.slug}`
            }))
          }
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "トップ", item: siteUrl },
            { "@type": "ListItem", position: 2, name: "麻雀を学ぶ", item: `${siteUrl}/learn/guides` }
          ]
        }
      ]} />

      <header className={styles.hero}>
        <nav className={styles.breadcrumb} aria-label="パンくずリスト"><Link href="/">トップ</Link><span aria-hidden="true">›</span><span aria-current="page">麻雀を学ぶ</span></nav>
        <h1>麻雀を学ぶ</h1>
        <p>牌姿で理解して、実戦で使える知識へ。</p>
      </header>

      <GuideLibrary items={library} />

      <section className={styles.footer}>
        <div><h2><Map aria-hidden="true" />最初から順番に学びたい方へ</h2><p>ルールや役から、点数計算まで。初心者ロードマップで基礎をひとつずつ。</p></div>
        <Link href="/learn/roadmap">初心者ロードマップを見る<ArrowRight aria-hidden="true" /></Link>
      </section>
    </main>
  );
}
