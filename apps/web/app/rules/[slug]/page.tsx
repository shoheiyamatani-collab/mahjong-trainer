import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleTileFigures } from "../../components/TileFigures";
import { InternalLinkCard, PageHero, SectionTitle } from "../../components/SiteSections";
import { getYakuArticle, yakuArticles } from "../yakuArticleData";

type YakuArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return yakuArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: YakuArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getYakuArticle(slug);
  if (!article) return {};

  return {
    title: article.seoTitle,
    description: article.description,
    alternates: { canonical: `/rules/${article.slug}` }
  };
}

export default async function YakuArticlePage({ params }: YakuArticlePageProps) {
  const { slug } = await params;
  const article = getYakuArticle(slug);
  if (!article) notFound();

  return (
    <main className="siteMain articleMain">
      <PageHero
        eyebrow={`${article.han} / ${article.openNote}`}
        title={`${article.name}（${article.kana}）`}
        description={article.description}
        primaryLink={{ label: "役一覧へ戻る", href: "/rules/yaku" }}
        secondaryLink={{ label: "練習する", href: article.relatedPractice.href }}
      />

      <article className="articleLayout">
        <aside className="articleAside" aria-label="この記事の位置">
          <div className="articleStepBadge">役解説</div>
          <Link className="textLink" href="/rules/yaku">役一覧へ戻る</Link>
          <Link className="textLink" href="/learn/yaku-required">役の考え方を復習する</Link>
        </aside>

        <div className="articleContent">
          <section className="articleSection">
            <h2>{article.name}とは</h2>
            <p>{article.summary}</p>
          </section>

          <section className="articleSection">
            <h2>成立条件</h2>
            <ul className="articleChecklist">
              {article.conditions.map((condition) => (
                <li key={condition}>{condition}</li>
              ))}
            </ul>
          </section>

          <ArticleTileFigures figures={[article.figure, ...(article.extraFigures ?? [])]} />

          {article.openExplanation ? (
            <section className="articleSection yakuOpenSection">
              <h2>鳴いても成立する？</h2>
              <div className="yakuOpenAnswer">
                <strong className={article.openNote.includes("不可") ? "is-closed-only" : "is-openable"}>
                  {article.openNote}
                </strong>
                <p>{article.openExplanation}</p>
              </div>
            </section>
          ) : null}

          {article.compatibleYaku?.length ? (
            <section className="articleSection">
              <h2>複合しやすい役</h2>
              <p>この役だけで考えず、手牌の形に合う役を重ねると打点を伸ばせます。</p>
              <ul className="yakuCombinationList">
                {article.compatibleYaku.map((related) => (
                  <li key={related.name}>
                    {related.href ? (
                      <Link href={related.href}>{related.name}</Link>
                    ) : (
                      <strong>{related.name}</strong>
                    )}
                    <span>{related.detail}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {article.strategy?.length ? (
            <section className="articleSection">
              <h2>実戦での考え方</h2>
              {article.strategy.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
          ) : null}

          <section className="articleSection">
            <h2>初心者が見るポイント</h2>
            <ul className="misconceptionList">
              {article.beginnerTips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </section>

          <section className="articleSection">
            <h2>よくある間違い</h2>
            <ul className="misconceptionList">
              {article.mistakes.map((mistake) => (
                <li key={mistake}>{mistake}</li>
              ))}
            </ul>
            {article.notes?.length ? (
              <div className="articleNoteList">
                {article.notes.map((note) => (
                  <p key={note}>{note}</p>
                ))}
              </div>
            ) : null}
          </section>

          {article.practiceQuestion ? (
            <section className="articleSection yakuPracticeSection">
              <span className="yakuPracticeLabel">PRACTICE</span>
              <h2>実戦問題</h2>
              <p className="quizQuestion">{article.practiceQuestion.prompt}</p>
              <ol className="quizChoices">
                {article.practiceQuestion.choices.map((choice) => (
                  <li key={choice}>{choice}</li>
                ))}
              </ol>
              <details className="yakuPracticeAnswer">
                <summary>答えを見る</summary>
                <strong>{article.practiceQuestion.answer}</strong>
                <p>{article.practiceQuestion.explanation}</p>
              </details>
            </section>
          ) : null}
        </div>
      </article>

      <section>
        <SectionTitle title="次に進む" description="役の条件を見たら、問題やツールで同じ形を確認しましょう。" />
        <div className="linkCardGrid">
          <InternalLinkCard title="役一覧へ戻る" description="ほかの役も牌図つきで確認できます。" href="/rules/yaku" actionLabel="一覧を見る" />
          <InternalLinkCard title={article.relatedPractice.label} description="実戦形式の問題で、役や待ちを確認します。" href={article.relatedPractice.href} actionLabel="練習する" />
          <InternalLinkCard title={article.relatedTool.label} description="点数表や便利ツールで、覚えた役を復習します。" href={article.relatedTool.href} actionLabel="確認する" />
        </div>
      </section>
    </main>
  );
}
