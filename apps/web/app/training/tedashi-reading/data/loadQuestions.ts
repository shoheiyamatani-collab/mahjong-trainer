import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { approvedQuestions } from "@mahjong-trainer/tenhou-analysis/publication";
import type { TedashiQuestion } from "@mahjong-trainer/tenhou-analysis/types";
import published from "./approved.json";
import synthetic from "./synthetic.json";

export function loadTrainingQuestions(): { questions: TedashiQuestion[]; mode: "published" | "local-review" | "synthetic" } {
  const approved = approvedQuestions(published as TedashiQuestion[]);
  if (process.env.NODE_ENV !== "development") return { questions: approved, mode: "published" };
  if (process.env.TEDASHI_SYNTHETIC_PREVIEW === "true") return { questions: synthetic as TedashiQuestion[], mode: "synthetic" };
  const localJson = (filename: string): TedashiQuestion[] => {
    try { return JSON.parse(readFileSync(resolve(process.cwd(), "../../data/generated", filename), "utf8")) as TedashiQuestion[]; }
    catch (error) { if ((error as NodeJS.ErrnoException).code === "ENOENT") return []; throw error; }
  };
  const requested = localJson("requested-questions.json");
  const reading = localJson("reading-questions.json").filter((q) => q.source.sourceType === "tenhou" && q.status === "candidate" && q.analysis.clarityScore >= 80 && !q.qualityFlags.length && (q.selection?.score ?? 0) >= 80);
  if (reading.length) {
    const seen = new Set<string>();
    return { questions: [...reading, ...requested].filter((q) => { if (seen.has(q.id)) return false; seen.add(q.id); return true; }), mode: "local-review" };
  }
  const automatic = localJson("tedashi-training.json").filter((q) => q.status === "candidate" && q.analysis.clarityScore >= 80 && q.qualityFlags.length === 0);
  const excluded = new Set(requested.map((q) => `${q.source.logId}:${q.source.eventSequence}`));
  const unique = [...requested, ...automatic.filter((q) => !excluded.has(`${q.source.logId}:${q.source.eventSequence}`))];
  if (unique.length) return { questions: unique.slice(0, 10), mode: "local-review" };
  if (approved.length) return { questions: approved, mode: "published" };
  return { questions: synthetic as TedashiQuestion[], mode: "synthetic" };
}
