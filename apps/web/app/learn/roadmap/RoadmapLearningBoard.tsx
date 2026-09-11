"use client";

import { ArrowRight, BookOpenCheck, Check, ChevronRight, Clock3, Map } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export type RoadmapBoardStep = {
  step: number;
  title: string;
  description: string;
  href: string;
  learnPoints: string[];
  tiles: string[];
  tileGroups: { label: string; tiles: string[] }[];
  visualLabel: string;
};

const chapters = [
  { number: 1, title: "基本を知る", steps: [1, 2, 3] },
  { number: 2, title: "アガリを覚える", steps: [4, 5, 6] },
  { number: 3, title: "実戦で使う", steps: [7, 8, 9] },
  { number: 4, title: "次へ進む", steps: [10, 11] }
];

export function RoadmapLearningBoard({ steps }: { steps: RoadmapBoardStep[] }) {
  const [selectedStep, setSelectedStep] = useState(steps[0]?.step ?? 1);
  const selectedIndex = Math.max(steps.findIndex((step) => step.step === selectedStep), 0);
  const selected = steps[selectedIndex];
  const next = steps[selectedIndex + 1];
  const progress = steps.length ? (selected.step / steps.length) * 100 : 0;

  if (!selected) return null;

  return (
    <section className="roadmapBoard" aria-label="初心者ロードマップ学習ボード">
      <aside className="roadmapBoardSidebar">
        <div className="roadmapBoardIdentity">
          <Map aria-hidden="true" />
          <div>
            <h1>初心者ロードマップ</h1>
            <p>11のステップで、麻雀の基本から実戦で使える力まで身につけます。</p>
          </div>
        </div>

        <div className="roadmapBoardProgress" aria-label={`現在地 STEP ${selected.step} / ${steps.length}`}>
          <div>
            <span>現在地</span>
            <strong>{selected.step} / {steps.length}</strong>
          </div>
          <span className="roadmapBoardProgressTrack" aria-hidden="true">
            <span style={{ width: `${progress}%` }} />
          </span>
        </div>

        <label className="roadmapBoardMobileSelect">
          <span>学ぶステップを選ぶ</span>
          <select value={selected.step} onChange={(event) => setSelectedStep(Number(event.target.value))}>
            {steps.map((step) => (
              <option value={step.step} key={step.step}>STEP {padStep(step.step)}　{step.title}</option>
            ))}
          </select>
        </label>

        <nav className="roadmapBoardSyllabus" aria-label="ロードマップのステップ">
          {chapters.map((chapter) => (
            <section className="roadmapBoardChapter" key={chapter.number}>
              <h2><span>第{chapter.number}章</span>{chapter.title}</h2>
              <div>
                {steps.filter((step) => chapter.steps.includes(step.step)).map((step) => (
                  <button
                    className={step.step === selected.step ? "isActive" : ""}
                    type="button"
                    onClick={() => setSelectedStep(step.step)}
                    aria-pressed={step.step === selected.step}
                    key={step.step}
                  >
                    <span>STEP {padStep(step.step)}</span>
                    <strong>{step.title}</strong>
                    <ChevronRight aria-hidden="true" />
                  </button>
                ))}
              </div>
            </section>
          ))}
        </nav>
      </aside>

      <div className="roadmapBoardDetail" aria-live="polite">
        <div className="roadmapBoardBreadcrumb">
          <span>初心者ロードマップ</span>
          <ChevronRight aria-hidden="true" />
          <span>第{chapterForStep(selected.step)}章</span>
          <ChevronRight aria-hidden="true" />
          <strong>STEP {padStep(selected.step)}</strong>
        </div>

        <header className="roadmapBoardLessonHeader">
          <div className="roadmapBoardStepNumber">
            <span>STEP</span>
            <strong>{padStep(selected.step)}</strong>
          </div>
          <div>
            <h2>{selected.title}</h2>
            <p>{selected.description}</p>
          </div>
          <div className="roadmapBoardReadingTime">
            <Clock3 aria-hidden="true" />
            <span>読む目安</span>
            <strong>約3分</strong>
          </div>
        </header>

        <TileStage step={selected} />

        <div className="roadmapBoardLessonBody">
          <article>
            <p className="roadmapBoardEyebrow">LEARNING POINTS</p>
            <h3>このステップで学べること</h3>
            <ul>
              {selected.learnPoints.map((point) => (
                <li key={point}><Check aria-hidden="true" />{point}</li>
              ))}
            </ul>
          </article>

          <aside className="roadmapBoardAction">
            <BookOpenCheck aria-hidden="true" />
            <div>
              <strong>短い解説と確認クイズ</strong>
              <p>読んだあとに1問解いて、理解できたか確かめられます。</p>
            </div>
            <Link href={selected.href}>このステップを読む<ArrowRight aria-hidden="true" /></Link>
          </aside>
        </div>

        {next ? (
          <button className="roadmapBoardNext" type="button" onClick={() => setSelectedStep(next.step)}>
            <span>次のステップ</span>
            <TileStrip tiles={next.tiles.slice(0, 4)} />
            <span className="roadmapBoardNextText">
              <small>STEP {padStep(next.step)}</small>
              <strong>{next.title}</strong>
            </span>
            <ArrowRight aria-hidden="true" />
          </button>
        ) : (
          <div className="roadmapBoardComplete">
            <Check aria-hidden="true" />
            <div><strong>ロードマップの最後まで到達しました</strong><span>各ステップの記事を読み、理解を確かめてみましょう。</span></div>
          </div>
        )}
      </div>
    </section>
  );
}

function TileStage({ step }: { step: RoadmapBoardStep }) {
  return (
    <figure className={`roadmapBoardTileStage${step.tiles.length >= 13 ? " isDense" : ""}`} aria-label={step.visualLabel}>
      <div className="roadmapBoardTileGroups">
        {step.tileGroups.map((group) => (
          <div className="roadmapBoardTileGroup" key={group.label}>
            <TileStrip tiles={group.tiles} />
            <span>{group.label}</span>
          </div>
        ))}
      </div>
      <figcaption>{step.visualLabel}</figcaption>
    </figure>
  );
}

function TileStrip({ tiles }: { tiles: string[] }) {
  return (
    <span className="roadmapBoardTiles" aria-hidden="true">
      {tiles.map((tile, index) => (
        <img key={`${tile}-${index}`} src={`/tiles/${tile}-66-90-l-emb.png`} alt="" />
      ))}
    </span>
  );
}

function padStep(step: number) {
  return String(step).padStart(2, "0");
}

function chapterForStep(step: number) {
  return chapters.find((chapter) => chapter.steps.includes(step))?.number ?? 1;
}
