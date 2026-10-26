import Link from "next/link";
import { ArrowRight, BarChart3, BookOpenCheck } from "lucide-react";
import { getVideoGuideByArticleHref } from "../videoData";
import { getVideoPracticeLinks } from "./videoPracticeLinks";
import styles from "./VideoPracticeGateway.module.css";

export default function VideoPracticeGateway({ articleHref }: { articleHref: string }) {
  const guide = getVideoGuideByArticleHref(articleHref);
  if (!guide) return null;
  const recommendations = getVideoPracticeLinks(guide);
  const titleId = `practice-${articleHref.split("/").pop()}`;

  return (
    <aside className={styles.gateway} aria-labelledby={titleId} data-video-practice>
      <div className={styles.inner}>
        <header className={styles.intro}>
          <p className={styles.eyebrow}>JONGFOLIO / 復習</p>
          <h2 id={titleId}>自分の判断を練習で確かめる</h2>
          <p>{recommendations.note}</p>
        </header>
        <div className={styles.links}>
          {recommendations.links.map((link) => {
            const Icon = link.tone === "practice" ? BookOpenCheck : BarChart3;
            return (
              <Link className={`${styles.link} ${styles[link.tone]}`} href={link.href} key={link.href}>
                <span className={styles.icon} aria-hidden="true"><Icon /></span>
                <span className={styles.copy}>
                  <small>{link.tone === "practice" ? "練習" : "計算・解説"}</small>
                  <strong>{link.title}</strong>
                  <span>{link.description}</span>
                </span>
                <span className={styles.action}>開く<ArrowRight aria-hidden="true" /></span>
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
