"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { YakuQuizQuestion } from "./quizData";

const tileNames: Record<string, string> = {
  man1: "一萬",
  man2: "二萬",
  man3: "三萬",
  man4: "四萬",
  man5: "五萬",
  man6: "六萬",
  man7: "七萬",
  man8: "八萬",
  man9: "九萬",
  pin1: "一筒",
  pin2: "二筒",
  pin3: "三筒",
  pin4: "四筒",
  pin5: "五筒",
  pin6: "六筒",
  pin7: "七筒",
  pin8: "八筒",
  pin9: "九筒",
  sou1: "一索",
  sou2: "二索",
  sou3: "三索",
  sou4: "四索",
  sou5: "五索",
  sou6: "六索",
  sou7: "七索",
  sou8: "八索",
  sou9: "九索",
  ji1: "東",
  ji2: "南",
  ji3: "西",
  ji4: "北",
  ji5: "發",
  ji6: "白",
  ji7: "中"
};

export function YakuQuizClient({ questions }: { questions: YakuQuizQuestion[] }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const answeredCount = Object.keys(answers).length;
  const correctCount = useMemo(
    () => questions.filter((question) => answers[question.id] === question.answer).length,
    [answers, questions]
  );
  const wrongQuestions = useMemo(
    () => questions.filter((question) => answers[question.id] != null && answers[question.id] !== question.answer),
    [answers, questions]
  );

  function resetWrongAnswers() {
    setAnswers((current) => {
      const next = { ...current };
      wrongQuestions.forEach((question) => {
        delete next[question.id];
      });
      return next;
    });
  }

  return (
    <section className="yakuQuizShell" aria-label="役判定クイズ">
      <div className="yakuQuizScore">
        <div>
          <span>回答済み</span>
          <strong>{answeredCount} / {questions.length}</strong>
        </div>
        <div>
          <span>正解</span>
          <strong>{correctCount}問</strong>
        </div>
        <div>
          <span>復習</span>
          <strong>{wrongQuestions.length}問</strong>
        </div>
      </div>

      <div className="yakuQuizToolbar">
        <button disabled={wrongQuestions.length === 0} onClick={resetWrongAnswers} type="button">
          間違えた問題だけ解き直す
        </button>
        <button disabled={answeredCount === 0} onClick={() => setAnswers({})} type="button">
          すべてリセット
        </button>
      </div>

      {wrongQuestions.length > 0 ? (
        <aside className="yakuQuizReview" aria-label="復習リスト">
          <div>
            <h2>間違えた役を復習</h2>
            <p>選び間違えた役だけをまとめています。条件を読んでから、同じ問題をもう一度見てみましょう。</p>
          </div>
          <div className="yakuQuizReviewList">
            {wrongQuestions.map((question) => (
              <article key={question.id}>
                <span>{question.title}</span>
                <p>あなたの回答: {answers[question.id]} / 正解: {question.answer}</p>
                <Link href={question.relatedRuleHref}>{question.answer}の条件を読む</Link>
              </article>
            ))}
          </div>
        </aside>
      ) : answeredCount > 0 ? (
        <aside className="yakuQuizReview clear" aria-label="復習リスト">
          <div>
            <h2>ここまで全問正解</h2>
            <p>よく見えています。次は役一覧で似ている役の違いを確認すると、判断がさらに安定します。</p>
          </div>
          <Link href="/rules/yaku">役一覧で似ている役を確認する</Link>
        </aside>
      ) : null}

      <div className="yakuQuizGrid">
        {questions.map((question, index) => {
          const selected = answers[question.id];
          const isCorrect = selected === question.answer;

          return (
            <article className="yakuQuizCard" id={`question-${question.id}`} key={question.id}>
              <div className="yakuQuizHeader">
                <p>Q{index + 1}</p>
                <h2>{question.title}</h2>
              </div>
              {question.context ? <p className="yakuQuizContext">{question.context}</p> : null}
              <TileStrip tiles={question.tiles} />
              <p className="yakuQuizPrompt">{question.prompt}</p>

              <div className="yakuQuizChoices">
                {question.choices.map((choice) => {
                  const stateClass =
                    selected == null
                      ? ""
                      : choice === question.answer
                        ? "is-answer"
                        : selected === choice
                          ? "is-wrong"
                          : "";

                  return (
                    <button
                      className={stateClass}
                      key={choice}
                      onClick={() => setAnswers((current) => ({ ...current, [question.id]: choice }))}
                      type="button"
                    >
                      {choice}
                    </button>
                  );
                })}
              </div>

              {selected ? (
                <div className={isCorrect ? "yakuQuizResult correct" : "yakuQuizResult wrong"}>
                  <strong>{isCorrect ? "正解" : "もう一度確認"}</strong>
                  <p>{question.explanation}</p>
                  <Link href={question.relatedRuleHref}>{question.answer}の条件を読む</Link>
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}

function TileStrip({ tiles }: { tiles: string[] }) {
  return (
    <div className="yakuQuizTileStrip" aria-label={tiles.map((tile) => tileNames[tile] ?? tile).join("、")}>
      {tiles.map((tile, index) => (
        <img key={`${tile}-${index}`} src={`/tiles/${tile}-66-90-l-emb.png`} alt={tileNames[tile] ?? tile} />
      ))}
    </div>
  );
}
