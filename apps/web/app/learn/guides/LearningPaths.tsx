import Link from "next/link";
import { ArrowRight, ChevronDown, Compass } from "lucide-react";
import type { LearningGuide } from "./guideData";
import { buildLearningPaths, learningPathDefinitions } from "./learningPathData";
import { LearningPathDisclosure } from "./LearningPathDisclosure";
import styles from "./learningPaths.module.css";

export function LearningPaths({ guides }: { guides: readonly LearningGuide[] }) {
  return <section className={styles.section} aria-labelledby="guide-paths-title">
    <h2 id="guide-paths-title"><Compass aria-hidden="true" />テーマ別の学習ルート</h2>
    <div className={styles.grid}>{buildLearningPaths(guides).map((path) => <LearningPathDisclosure key={path.id} id={`learning-path-${path.id}`} className={styles.path} tone={path.tone}>
      <summary><strong>{path.title}</strong><ChevronDown size={18} aria-hidden="true" /></summary>
      <ol>{path.steps.map((step) => <li key={step.href}><Link href={step.href}>{step.label}{step.kind === "tool" ? <ArrowRight size={16} aria-hidden="true" /> : null}</Link></li>)}</ol>
    </LearningPathDisclosure>)}</div>
  </section>;
}

export function GuideLearningRoute({ guides, slug }: { guides: readonly LearningGuide[]; slug: string }) {
  const activeHref = `/learn/guides/${slug}`;
  const paths = buildLearningPaths(guides).filter((path) => path.steps.some((step) => step.href === activeHref));
  if (!paths.length) return null;
  return <nav className={styles.articleRoute} aria-label="この記事の学習ルート">{paths.map((path) => {
    const index = path.steps.findIndex((step) => step.href === activeHref);
    const previous = path.steps[index - 1];
    const next = path.steps[index + 1];
    return <div key={path.id}>
      <h2>{path.title}<small>{index + 1} / {path.steps.length}</small></h2>
      <div className={styles.neighbors}>{previous ? <Link href={previous.href}><span>前のテーマ</span>{previous.label}</Link> : null}{next ? <Link href={next.href}><span>次のテーマ</span>{next.label}</Link> : null}</div>
      <Link href={`/learn/guides#learning-path-${path.id}`}>学習ルート全体を見る</Link>
    </div>;
  })}</nav>;
}

export function HomeStudyThemes() {
  return <section className={styles.home} aria-labelledby="home-study-themes-title">
    <h2 id="home-study-themes-title">テーマ別に麻雀を学ぶ</h2>
    <nav aria-label="テーマ別の学習ルート">{learningPathDefinitions.map((path) => <Link key={path.id} href={`/learn/guides#learning-path-${path.id}`}><span>{path.title}</span><ArrowRight size={18} aria-hidden="true" /></Link>)}</nav>
  </section>;
}
