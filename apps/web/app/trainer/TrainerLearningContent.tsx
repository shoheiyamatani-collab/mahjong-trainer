import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ArticleTileFigures } from "../components/TileFigures";
import type { ToolPreviewScreenshot } from "../components/ToolPreviewImage";
import { standaloneTrainerDefinitions, trainerDefinitions, type TrainerCategory, type TrainerDefinition } from "./trainerCatalog";
import approvedTedashi from "../training/tedashi-reading/data/approved.json";
import { getToolCatalog, trainingTone, type ToolCatalogItem } from "../toolbox/toolCatalog";
import { ToolCard } from "../components/ToolCard";

const categoryOrder: TrainerCategory[] = ["牌効率", "待ち", "点数計算", "実戦判断"];

const categoryDescriptions: Record<TrainerCategory, string> = {
  牌効率: "切る候補を比べ、シャンテン数と受け入れから手を前へ進める練習です。",
  待ち: "短い形から複雑な一色手まで、アガリ牌を見落とさない力を鍛えます。",
  点数計算: "親子、ロン・ツモ、翻と符を順番に確認し、点数申告へつなげます。",
  実戦判断: "役・速度・打点・守備を比べ、局面に合う選択を練習します。"
};

export function TrainerPortalCard({ slug, href, title, level, description, screenshot }: {
  slug: string;
  href: string;
  title: string;
  level: string;
  description: string;
  screenshot: ToolPreviewScreenshot;
}) {
  const item: ToolCatalogItem = getToolCatalog(true).find(tool => tool.id === slug) ?? { id: slug, title, href, level, description, screenshot, category: "実戦判断", tone: "decisions", training: true, keywords: [] };
  return <ToolCard item={{ ...item, title, href, level }} />;
}

export function TrainerPortal() {
  return (
    <div className="trainerPortal">
      <section className="trainerPortalIntro" aria-labelledby="trainer-portal-title">
        <p className="eyebrow">CHOOSE A PRACTICE</p>
        <h2 id="trainer-portal-title">身につけたい力から選ぶ</h2>
        <p>何切る・待ち・点数・実戦判断。問題を解き、解説と牌図で振り返ります。</p>
      </section>

      <nav className="trainerPortalJumpNav" aria-label="練習分野を選ぶ">
        {categoryOrder.map(category => <Link data-tone={trainingTone[category]} href={`#trainer-category-${category}`} key={category}>{category}</Link>)}
        <Link data-tone="learning" href="#trainer-category-yaku">役とルール</Link>
        <Link href="/toolbox">検索する</Link>
      </nav>

      {categoryOrder.map((category) => {
        const definitions = [...trainerDefinitions, ...standaloneTrainerDefinitions].filter((definition) => definition.category === category);
        return (
          <section className="trainerPortalCategory" data-tone={trainingTone[category]} id={`trainer-category-${category}`} aria-labelledby={`trainer-heading-${category}`} key={category}>
            <header>
              <h2 id={`trainer-heading-${category}`}>{category}</h2>
              <p>{categoryDescriptions[category]}</p>
            </header>
            <div className="trainerPortalGrid">
              {definitions.map((definition) => (
                <TrainerPortalCard key={definition.slug} {...definition} href={`/trainer/${definition.slug}`} />
              ))}
            </div>
          </section>
        );
      })}
      <section className="trainerPortalCategory" data-tone="learning" id="trainer-category-yaku" aria-labelledby="trainer-heading-yaku"><header><h2 id="trainer-heading-yaku">役とルール</h2><p>牌姿と成立条件を比べ、アガれる役を覚えます。</p></header><div className="trainerPortalGrid"><ToolCard item={getToolCatalog().find(item => item.id === "yaku-quiz")!} /></div></section>
      {process.env.NODE_ENV === "development" || approvedTedashi.length > 0 ? <section className="trainerPortalCategory" aria-labelledby="trainer-reading-category"><header><h2 id="trainer-reading-category">捨て牌を読む</h2><p>手出しとツモ切りを見て、牌譜上の手牌変化と比べます。</p></header><div className="trainerPortalGrid"><TrainerPortalCard slug="tedashi-reading" href="/training/tedashi-reading" title="手出し読みトレーニング" level="中級者" description="河から候補を考え、回答後に実際の手牌を確認します。相手の意図を断定せず、事実と読みを分ける練習です。" screenshot={{ src: "/tool-screenshots/tedashi-reading.jpg", alt: "手出し読みトレーニングの河と4択問題（合成テストデータ）", width: 1144, height: 539 }} /></div></section> : null}
    </div>
  );
}

export function TrainerLearningContent({ definition }: { definition: TrainerDefinition }) {
  const otherTrainers = trainerDefinitions
    .filter((item) => item.slug !== definition.slug)
    .sort((left, right) => Number(right.category === definition.category) - Number(left.category === definition.category))
    .slice(0, 3);

  return (
    <article className="trainerLearningContent">
      <section className="trainerLearningBand" aria-labelledby="trainer-learning-title">
        <p className="eyebrow">LEARNING GUIDE</p>
        <h2 id="trainer-learning-title">このトレーニングで身につくこと</h2>
        <ul className="trainerSkillList">
          {definition.skills.map((skill) => <li key={skill}>{skill}</li>)}
        </ul>
      </section>

      <section className="trainerLearningBand" aria-labelledby="trainer-strategy-title">
        <p className="eyebrow">HOW TO THINK</p>
        <h2 id="trainer-strategy-title">{definition.strategyTitle}</h2>
        <div className="trainerStrategyGrid">
          {definition.strategy.map((section, index) => (
            <section key={section.heading}>
              <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <h3>{section.heading}</h3>
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {section.bullets ? <ul>{section.bullets.map((item) => <li key={item}>{item}</li>)}</ul> : null}
            </section>
          ))}
        </div>
      </section>

      <ArticleTileFigures figures={definition.figures} />

      <section className="trainerLearningBand trainerReviewBand" aria-labelledby="trainer-review-title">
        <div>
          <p className="eyebrow">REVIEW</p>
          <h2 id="trainer-review-title">よくある間違い</h2>
          <ul>{definition.commonMistakes.map((mistake) => <li key={mistake}>{mistake}</li>)}</ul>
        </div>
        <div>
          <p className="eyebrow">AT THE TABLE</p>
          <h2>実戦でどう使うか</h2>
          <p>{definition.practicalUse}</p>
        </div>
      </section>

      <section className="trainerLearningBand" aria-labelledby="trainer-related-title">
        <p className="eyebrow">KEEP LEARNING</p>
        <h2 id="trainer-related-title">解説とツールで復習する</h2>
        <div className="trainerRelatedGrid">
          {[...definition.relatedArticles, ...definition.relatedTools].map((item) => (
            <Link href={item.href} key={`${item.href}-${item.label}`}>
              <strong>{item.label}</strong>
              <span>{item.description}</span>
              <ArrowRight aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>

      <nav className="trainerLearningBand trainerNextNav" aria-label="ほかの麻雀トレーニング">
        <p className="eyebrow">NEXT PRACTICE</p>
        <h2>次に取り組むトレーニング</h2>
        <div>
          {otherTrainers.map((item) => <Link href={`/trainer/${item.slug}`} key={item.slug}>{item.shortTitle}</Link>)}
          <Link href="/trainer">すべてのトレーニングを見る</Link>
        </div>
      </nav>
    </article>
  );
}
