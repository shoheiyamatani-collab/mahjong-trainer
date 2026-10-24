import Link from "next/link";
import { learnArticles } from "../../siteData";
import { roadmapChapters } from "./roadmapStructure";

export function RoadmapSyllabus() {
  return (
    <section className="roadmapSyllabus" id="roadmap-syllabus" aria-labelledby="roadmap-syllabus-title">
      <header>
        <p className="siteEyebrow">LEARNING SYLLABUS</p>
        <h2 id="roadmap-syllabus-title">11ステップの学習内容</h2>
        <p>牌の名前と基本動作から始め、アガリ形、役、待ちを確認して、何切ると点数計算へ進みます。各ステップの記事には確認クイズと練習・ツールへのリンクがあります。</p>
      </header>
      <div className="roadmapSyllabusChapters">
        {roadmapChapters.map((chapter) => (
          <section className="roadmapSyllabusChapter" key={chapter.number} aria-labelledby={`roadmap-chapter-${chapter.number}`}>
            <h3 id={`roadmap-chapter-${chapter.number}`}><span>第{chapter.number}章</span>{chapter.title}</h3>
            <ol>
              {learnArticles.filter((article) => chapter.steps.includes(article.step)).map((article) => (
                <li key={article.slug} data-roadmap-step={article.step}>
                  <Link href={`/learn/${article.slug}`}>
                    <span>STEP {String(article.step).padStart(2, "0")}</span>
                    <strong>{article.title}</strong>
                  </Link>
                  <p>{article.description}</p>
                  <p className="roadmapSyllabusPoints"><strong>学ぶこと：</strong>{article.learnPoints.join("・")}</p>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </section>
  );
}
