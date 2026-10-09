import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowRight } from "lucide-react";
import { ArticleTileFigures } from "../components/TileFigures";
import { ToolPreviewImage, type ToolPreviewScreenshot } from "../components/ToolPreviewImage";
import { standaloneTrainerDefinitions, trainerDefinitions, type TrainerCategory, type TrainerDefinition } from "./trainerCatalog";
import approvedTedashi from "../training/tedashi-reading/data/approved.json";

const categoryOrder: TrainerCategory[] = ["牌効率", "待ち", "点数計算", "実戦判断"];

const categoryDescriptions: Record<TrainerCategory, string> = {
  牌効率: "切る候補を比べ、シャンテン数と受け入れから手を前へ進める練習です。",
  待ち: "短い形から複雑な一色手まで、アガリ牌を見落とさない力を鍛えます。",
  点数計算: "親子、ロン・ツモ、翻と符を順番に確認し、点数申告へつなげます。",
  実戦判断: "役・速度・打点・守備を比べ、局面に合う選択を練習します。"
};

const trainerCardPresentation: Record<string, {
  accent: string;
  tint: string;
  summary: string;
  crop: NonNullable<ToolPreviewScreenshot["crop"]>;
}> = {
  "ukeire-max": { accent: "#7049a4", tint: "#f7f3fb", summary: "打牌ごとの有効牌を比べ、受け入れ最大の一打を選びます。", crop: { x: 14, y: 42, width: 160, height: 100 } },
  iishanten: { accent: "#177356", tint: "#f0f9f4", summary: "テンパイまであと一歩。受け入れと良形を比べる何切るです。", crop: { x: 15, y: 145, width: 160, height: 100 } },
  "seven-tile": { accent: "#276fa5", tint: "#f0f7fc", summary: "7枚の複合形から、すべての待ち牌を選びます。", crop: { x: 10, y: 130, width: 180, height: 112.5 } },
  chinitsu: { accent: "#0e7b88", tint: "#eef9fa", summary: "清一色の13枚を分解し、多面待ちを見つけます。", crop: { x: 10, y: 12, width: 160, height: 100 } },
  score: { accent: "#91600a", tint: "#fff9eb", summary: "翻・符を数え、親子とロン・ツモの点数を答えます。", crop: { x: 10, y: 44, width: 200, height: 125 } },
  "score-hard": { accent: "#b25122", tint: "#fff4ee", summary: "カン・高符・複雑な待ちを含む点数計算に挑戦します。", crop: { x: 10, y: 108, width: 200, height: 125 } },
  "call-or-pass": { accent: "#5a7420", tint: "#f6f9ed", summary: "ポン・チー・スルーを選び、役・速度・打点を比べます。", crop: { x: 135, y: 737, width: 260, height: 162.5 } },
  "riichi-or-dama": { accent: "#a43c74", tint: "#fcf1f7", summary: "待ち・打点・点棒状況から、リーチかダマかを判断します。", crop: { x: 125, y: 730, width: 256, height: 160 } },
  "push-or-fold": { accent: "#b13640", tint: "#fff2f3", summary: "手牌価値と相手の河を見て、押すかオリるかを判断します。", crop: { x: 25, y: 335, width: 256, height: 160 } },
  "tedashi-reading": { accent: "#52687a", tint: "#f3f6f8", summary: "手出し・ツモ切りから、牌譜上の手牌変化を読みます。", crop: { x: 0, y: 50, width: 288, height: 180 } }
};

export function TrainerPortalCard({ slug, href, title, level, description, screenshot }: {
  slug: string;
  href: string;
  title: string;
  level: string;
  description: string;
  screenshot: ToolPreviewScreenshot;
}) {
  const presentation = trainerCardPresentation[slug];
  return (
    <article className="trainerPortalCard" data-trainer={slug} style={presentation ? {
      "--trainer-card-accent": presentation.accent,
      "--trainer-card-tint": presentation.tint
    } as CSSProperties : undefined}>
      <Link className="trainerPortalCardLink" href={href} aria-label={`${title}を始める`}>
        <header className="trainerPortalCardHeader">
          <h3>{title}</h3>
          <span>{level}</span>
        </header>
        <div className="trainerPortalCardPreview">
          <ToolPreviewImage screenshot={presentation ? { ...screenshot, alt: `${title}の問題画面の一部`, crop: presentation.crop } : screenshot} />
          <p>{presentation?.summary ?? description}</p>
        </div>
        <span className="trainerPortalCardAction">練習する<ArrowRight aria-hidden="true" /></span>
      </Link>
    </article>
  );
}

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
                <TrainerPortalCard key={definition.slug} {...definition} href={`/trainer/${definition.slug}`} />
              ))}
            </div>
          </section>
        );
      })}
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
