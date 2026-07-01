import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ComingSoonBadge } from "../../components/Badges";
import { InternalLinkCard, PageHero, SectionTitle } from "../../components/SiteSections";
import { getAdjacentLearnArticles, getLearnArticle, learnArticles, type LinkTarget } from "../../siteData";

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

  return (
    <main className="siteMain articleMain">
      <PageHero
        eyebrow={`STEP ${article.step}`}
        title={article.title}
        description={article.description}
        primaryLink={next ? { label: "次の記事を読む", href: `/learn/${next.slug}` } : { label: "練習メニューを見る", href: "/training" }}
        secondaryLink={{ label: "ロードマップへ戻る", href: "/learn" }}
      />

      <article className="articleLayout">
        <aside className="articleAside" aria-label="この記事の位置">
          <div className="articleStepBadge">STEP {article.step} / 12</div>
          <Link className="textLink" href="/learn">ロードマップへ戻る</Link>
        </aside>

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

          <section className="articleSection">
            <h2>よくある勘違い</h2>
            <ul className="misconceptionList">
              {article.misconceptions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="articleSection quizCard">
            <h2>1問だけ確認クイズ</h2>
            <p className="quizQuestion">{article.quiz.question}</p>
            <ol className="quizChoices">
              {article.quiz.choices.map((choice) => (
                <li key={choice}>{choice}</li>
              ))}
            </ol>
            <div className="quizAnswer">
              <span>答え</span>
              <strong>{article.quiz.answer}</strong>
            </div>
            <p>{article.quiz.explanation}</p>
          </section>
        </div>
      </article>

      <section>
        <SectionTitle title="次に読むページ" description="順番に読むと、最低限ゲームを楽しめるところまで進めます。" />
        <div className="linkCardGrid">
          {next ? (
            <InternalLinkCard title={`次に読む：${next.title}`} description={next.description} href={`/learn/${next.slug}`} actionLabel="次の記事を読む" />
          ) : (
            <InternalLinkCard title="練習メニューへ進む" description="ロードマップを読み終えたら、何切るや待ち当てで手を動かして確認します。" href="/training" actionLabel="練習する" />
          )}
          {previous ? (
            <InternalLinkCard title={`前の記事に戻る：${previous.title}`} description={previous.description} href={`/learn/${previous.slug}`} actionLabel="前の記事へ戻る" />
          ) : (
            <InternalLinkCard title="ロードマップに戻る" description="12ステップの全体像をもう一度確認できます。" href="/learn" actionLabel="一覧を見る" />
          )}
          <RelatedLinkCard title="関連する練習問題" target={article.relatedPractice} fallbackHref="/training" />
          <RelatedLinkCard title="関連するツール" target={article.relatedTool} fallbackHref="/tools" />
        </div>
      </section>
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
