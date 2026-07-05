"use client";

import { useState } from "react";
import type { LearnQuiz } from "../../siteData";

const tileNames: Record<string, string> = {
  man1: "一萬",
  man5: "五萬",
  man9: "九萬",
  pin1: "一筒",
  pin5: "五筒",
  pin9: "九筒",
  sou1: "一索",
  sou5: "五索",
  sou9: "九索",
  ji1: "東",
  ji2: "南",
  ji3: "西",
  ji5: "發",
  ji6: "白",
  ji7: "中"
};

export function ArticleQuiz({ quiz }: { quiz: LearnQuiz }) {
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const isAnswered = selectedChoice !== null;
  const isCorrect = selectedChoice === quiz.answer;

  return (
    <section className="articleSection quizCard">
      <h2>1問だけ確認クイズ</h2>
      <p className="quizQuestion">{quiz.question}</p>
      <ol className="quizChoices interactiveQuizChoices">
        {quiz.choices.map((choice) => {
          const isSelected = selectedChoice === choice;
          const isAnswer = quiz.answer === choice;
          const stateClass = isAnswered && isSelected ? (isCorrect ? "isCorrect" : "isWrong") : isAnswered && isAnswer ? "isAnswer" : "";

          return (
            <li key={choice}>
              <button className={`quizChoiceButton ${stateClass}`} type="button" onClick={() => setSelectedChoice(choice)}>
                <span>{choice}</span>
                {quiz.choiceTiles?.[choice]?.length ? <QuizChoiceTiles tiles={quiz.choiceTiles[choice]} /> : null}
              </button>
            </li>
          );
        })}
      </ol>

      {isAnswered ? (
        <div className={isCorrect ? "quizAnswer isCorrect" : "quizAnswer isWrong"}>
          <span>{isCorrect ? "正解" : "もう一度確認"}</span>
          <strong>{quiz.answer}</strong>
          <p>{quiz.explanation}</p>
        </div>
      ) : (
        <p className="quizHint">選択肢を押すと答えと解説が表示されます。</p>
      )}
    </section>
  );
}

function QuizChoiceTiles({ tiles }: { tiles: string[] }) {
  return (
    <div className="quizChoiceTiles" aria-label={tiles.map((tile) => tileNames[tile] ?? tile).join("、")}>
      {tiles.map((tile, index) => (
        <img key={`${tile}-${index}`} src={`/tiles/${tile}-66-90-l-emb.png`} alt={tileNames[tile] ?? tile} />
      ))}
    </div>
  );
}
