import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ArticleTileFigures } from "../components/TileFigures";
import { ToolPreviewImage } from "../components/ToolPreviewImage";
import { standaloneTrainerDefinitions, trainerDefinitions, type TrainerCategory, type TrainerDefinition } from "./trainerCatalog";
import approvedTedashi from "../training/tedashi-reading/data/approved.json";

const categoryOrder: TrainerCategory[] = ["牌効率", "待ち", "点数計算", "実戦判断"];

const categoryDescriptions: Record<TrainerCategory, string> = {
  牌効率: "切る候補を比べ、シャンテン数と受け入れから手を前へ進める練習です。",
  待ち: "短い形から複雑な一色手まで、アガリ牌を見落とさない力を鍛えます。",
  点数計算: "親子、ロン・ツモ、翻と符を順番に確認し、点数申告へつなげます。",
  実戦判断: "役・速度・打点・守備を比べ、局面に合う選択を練習します。"
};

export function TrainerPortal() {
  return (
    <div className="trainerPortal">
      <section className="trainerPortalIntro" aria-labelledby="trainer-portal-title">
        <p className="eyebrow">CHOOSE A PRACTICE</p>
        <h2 id="trainer-portal-title">身につけたい力から選ぶ</h2>
        <p>問題を解いた後は、正解だけでなく判断手順と牌図を確認できます。基礎から始める場合は、各分野の初心者向けから進めてください。</p>
      </section>

      {categoryOrder.map((category) => {
        const definitions = [...trainerDefinitions, ...standaloneTrainerDefinitions].filter((definition) => definition.category === category);
        return (
          <section className="trainerPortalCategory" aria-labelledby={`trainer-category-${category}`} key={category}>
            <header>
              <h2 id={`trainer-category-${category}`}>{category}</h2>
              <p>{categoryDescriptions[category]}</p>
            </header>
            <div className="trainerPortalGrid">
              {definitions.map((definition) => (
                <article className="trainerPortalCard" key={definition.slug}>
                  <ToolPreviewImage
                    screenshot={definition.screenshot}
                    href={`/trainer/${definition.slug}`}
                    label={`${definition.title}を開く`}
                  />
                  <div className="trainerPortalMeta">
                    <span>{definition.level}</span>
                    <span>{definition.focus}</span>
                  </div>
                  <h3>{definition.title}</h3>
                  <p>{definition.description}</p>
                  <Link href={`/trainer/${definition.slug}`}>
                    このトレーニングを始める
                    <ArrowRight aria-hidden="true" />
                  </Link>
                </article>
              ))}
            </div>
          </section>
        );
      })}
      {process.env.NODE_ENV === "development" || approvedTedashi.length > 0 ? <section className="trainerPortalCategory" aria-labelledby="trainer-reading-category"><header><h2 id="trainer-reading-category">捨て牌を読む</h2><p>手出しとツモ切りを見て、牌譜上の手牌変化と比べます。</p></header><div className="trainerPortalGrid"><article className="trainerPortalCard"><ToolPreviewImage screenshot={{ src: "/tool-screenshots/tedashi-reading.jpg", alt: "手出し読みトレーニングの河と4択問題（合成テストデータ）", width: 1144, height: 539 }} href="/training/tedashi-reading" label="手出し読みトレーニングを開く" /><div className="trainerPortalMeta"><span>中級者</span><span>手出し・ツモ切りと実際の手牌変化</span></div><h3>手出し読みトレーニング</h3><p>河から候補を考え、回答後に実際の手牌を確認します。相手の意図を断定せず、事実と読みを分ける練習です。</p><Link href="/training/tedashi-reading">このトレーニングを始める<ArrowRight aria-hidden="true" /></Link></article></div></section> : null}
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
