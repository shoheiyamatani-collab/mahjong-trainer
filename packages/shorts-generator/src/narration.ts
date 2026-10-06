import type { NarrationSegment, ResolvedConfig, ShortsProblem, ShortsType } from "./types.js";
import { applyReadings, tileReading } from "./utils.js";

export function createNarration(
  type: ShortsType,
  answerDisplay: string,
  answerReading: string,
  explanation: string,
  spokenExplanation: string,
  config: ResolvedConfig
): NarrationSegment[] {
  const raw: Array<Omit<NarrationSegment, "speechText" | "audioFile"> & { speechText?: string }> = type === "nani-kiru"
    ? [
        { id: "intro", startMs: 1000, displayText: "今日の何切る問題なのだ！" },
        { id: "question", startMs: 4000, displayText: "この手牌、何を切る？" },
        { id: "reveal", startMs: 12000, displayText: "正解は……" },
        { id: "answer", startMs: 13200, displayText: `正解は、${answerDisplay}なのだ！ ${explanation}`, speechText: `${answerReading}なのだ！ ${spokenExplanation}` },
        { id: "cta", startMs: 20500, displayText: "雀フォリオは、プロフィールのリンクから遊べるのだ！" }
      ]
    : [
        { id: "intro", startMs: 1000, displayText: "今日の何待ち問題なのだ！" },
        { id: "question", startMs: 4000, displayText: "この清一色、何待ち？" },
        { id: "reveal", startMs: 12000, displayText: "正解は……" },
        { id: "answer", startMs: 13200, displayText: `正解は、${answerDisplay}待ちなのだ！ ${explanation}`, speechText: `${answerReading}待ちなのだ！ ${spokenExplanation}` },
        { id: "cta", startMs: 20500, displayText: "雀フォリオは、プロフィールのリンクから遊べるのだ！" }
      ];

  return raw.map((segment) => ({
    ...segment,
    speechText: applyReadings(segment.speechText ?? segment.displayText, config.readings),
    audioFile: `audio/${segment.id}.wav`
  }));
}

export function attachNarration(problem: ShortsProblem, config: ResolvedConfig): ShortsProblem {
  const answerReading = problem.answer.map(tileReading).join("、");
  const spokenExplanation = problem.type === "nani-kiru"
    ? `受け入れは${problem.ukeire.length}種${problem.ukeireCount}枚なのだ。受け入れの広さがポイントなのだ！`
    : `全部で${problem.answer.length}種${problem.ukeireCount}枚なのだ。形ごとの待ちを覚えるのだ！`;
  return {
    ...problem,
    answerReading,
    narration: createNarration(problem.type, problem.answerDisplay, answerReading, problem.explanation, spokenExplanation, config)
  };
}

export function narrationText(problem: ShortsProblem): string {
  return problem.narration
    .map((segment) => `[${segment.id}]\n画面: ${segment.displayText}\n音声: ${segment.speechText}`)
    .join("\n\n");
}
