import Link from "next/link";
import { learningGuides } from "../learn/guides/guideData";
import { relatedPracticeArticles } from "../learn/guides/learningConnections";
import styles from "../learn/guides/learningPaths.module.css";

export function RelatedPracticeArticles({ toolHref }: { toolHref: string }) {
  const guides = relatedPracticeArticles(learningGuides, toolHref);
  if (!guides.length) return null;
  return <section className={styles.related} aria-label="この判断を詳しく学ぶ">
    <h2>この判断を詳しく学ぶ</h2>
    <ul>{guides.map((guide) => <li key={guide.slug}><Link href={`/learn/guides/${guide.slug}`}>{guide.title}</Link><p>{guide.description}</p></li>)}</ul>
  </section>;
}
