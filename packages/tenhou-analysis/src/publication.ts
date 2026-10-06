import { questionContentHash } from "./questions";
import type { TedashiQuestion } from "./types";

export function canPublishQuestion(question: TedashiQuestion): boolean {
  return question.status === "approved"
    && question.source.sourceType === "tenhou"
    && question.source.table === "houou"
    && /^\d{10}gm-[0-9a-f]{4}-[0-9a-f]{4,5}-[0-9a-f]{8}$/.test(question.source.logId)
    && question.analysis.clarityScore >= 80
    && question.qualityFlags.length === 0
    && question.review?.contentHash === question.contentHash
    && Boolean(question.review?.permissionReference.trim())
    && Boolean(question.review?.reviewedAt && Number.isFinite(Date.parse(question.review.reviewedAt)))
    && questionContentHash(question) === question.contentHash;
}

export function approvedQuestions(questions: TedashiQuestion[]): TedashiQuestion[] {
  const ids = new Set<string>();
  return questions.filter((question) => {
    if (!canPublishQuestion(question)) return false;
    if (ids.has(question.id)) throw new Error(`問題IDが重複しています: ${question.id}`);
    ids.add(question.id);
    return true;
  });
}
