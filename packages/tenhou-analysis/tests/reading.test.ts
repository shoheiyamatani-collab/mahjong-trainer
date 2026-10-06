import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { syntheticXml } from "../src/fixtures";
import { parseTenhouXml } from "../src/parser";
import { buildQuestionSteps, eventPattern } from "../src/requested";
import { questionContentHash } from "../src/questions";
import { CandidateRejected, collectReadingCandidates, generateReadingQuestion, selectReadingQuestions, type ReadingSource } from "../src/reading";
import { canPublishQuestion } from "../src/publication";
import type { DiscardEvent } from "../src/types";

function fixture() {
  const log = parseTenhouXml(syntheticXml("m", 3), { sourceType: "synthetic", logId: "synthetic-reading", date: null, url: null });
  const source: ReadingSource = { logId: log.source.logId, priority: "S", referenceUrl: "https://example.invalid/synthetic", targets: [] };
  const event = log.rounds[0]!.events.find((e): e is DiscardEvent => e.type === "discard" && !e.tsumogiri)!;
  return { log, source, event };
}

describe("Factual reading candidates", () => {
  it("generates deterministic candidates with four distinct choices and immutable hashes", () => {
    const { log, source } = fixture();
    const a = collectReadingCandidates(log, source);
    const b = collectReadingCandidates(log, source);
    expect(a).toEqual(b);
    expect(a.candidates.length).toBeGreaterThan(0);
    for (const q of a.candidates) {
      expect(new Set(q.choices.map((c) => c.text)).size).toBe(4);
      expect(q.choices.filter((c) => c.id === q.answer)).toHaveLength(1);
      expect(q.contentHash).toBe(questionContentHash(q));
      expect(canPublishQuestion(q)).toBe(false);
    }
  });
  it("uses exact identities to verify a continued tsumogiri hand without asserting tenpai from the river", () => {
    const { log, source } = fixture();
    const q = collectReadingCandidates(log, source).candidates.find((q) => q.analysis.category === "tsumogiri-run")!;
    expect(q.analysis.followingTsumogiri).toBeGreaterThanOrEqual(3);
    const expected = q.steps![0]!.handAfter.map((t) => t.id);
    expect(q.steps!.every((step) => step.handAfter.map((t) => t.id).join() === expected.join())).toBe(true);
    expect(q.analysis.reading).toContain("テンパイかどうかは河だけでは分かりません");
  });
  it("rejects wrong anchors and a region from a different suit", () => {
    const { log, source, event } = fixture();
    const target = { topic: "tile-neighborhood" as const, from: event.sequence, to: event.sequence, expectedFirst: eventPattern(event), expectedLast: eventPattern(event) };
    expect(() => generateReadingQuestion(log, source, { ...target, expectedFirst: "9p:tedashi" })).toThrow("アンカー");
    expect(() => generateReadingQuestion(log, source, { ...target, focusTiles: ["1p"] })).toThrow(CandidateRejected);
  });
  it("rejects omitted intermediate own discards rather than silently joining distant events", () => {
    const { log, source, event } = fixture();
    const later = log.rounds[0]!.events.filter((e): e is DiscardEvent => e.type === "discard" && e.player === event.player && e.sequence > event.sequence)[2]!;
    expect(() => buildQuestionSteps(log, { logId: source.logId, referenceUrl: source.referenceUrl, round: log.rounds[0]!.info.round, honba: 0, player: event.player, eventSequences: [event.sequence, later.sequence], pattern: [eventPattern(event), eventPattern(later)] })).toThrow("省略");
  });
});

const root = fileURLToPath(new URL("../../../", import.meta.url));
const sources = JSON.parse(readFileSync(`${root}data/tenhou/reading-sources.json`, "utf8")) as ReadingSource[];
const available = sources.every((s) => existsSync(`${root}data/tenhou/local/${s.logId}.xml`));
const realLog = (s: ReadingSource) => parseTenhouXml(readFileSync(`${root}data/tenhou/local/${s.logId}.xml`, "utf8"), { sourceType: "tenhou", logId: s.logId, date: null, url: `https://tenhou.net/0/?log=${s.logId}` });

describe.skipIf(!available)("Five additional user-specified logs (private integration)", () => {
  for (const source of sources) it(`verifies the article anchors against complete hands: ${source.logId}`, () => {
    const log = realLog(source);
    expect(log.table).toBe("houou");
    expect(log.rounds.every((r) => r.ended)).toBe(true);
    const questions = source.targets.map((t) => generateReadingQuestion(log, source, t));
    expect(questions.every((q) => q.status === "candidate" && q.analysis.clarityScore >= 80)).toBe(true);
    expect(questions.every((q) => !canPublishQuestion(q))).toBe(true);
    if (source.logId.startsWith("202209")) {
      expect(questions[0]!.actual.shantenBeforeDraw).toBe(2);
      expect(questions[0]!.actual.after.shanten).toBe(1);
      expect(questions[1]!.analysis.summary).toContain("4pが残り");
      expect(questions[3]!.actual.after.shanten).toBe(4);
    }
    if (source.logId.startsWith("202507")) {
      expect(questions[1]!.actual.after.waits).toEqual(["2s", "5s"]);
      expect(questions[4]!.analysis.summary).toContain("6s・7s");
    }
    if (source.logId.startsWith("20200613")) {
      expect(questions[0]!.steps!.find((s) => s.meld?.kind === "chi")!.tile.tile).toBe("4s");
      expect(questions[1]!.actual.after.waits).toEqual(["3m", "6m"]);
      expect(questions[2]!.actual.after.tenpai).toBe(true);
    }
    if (source.logId.startsWith("20200618")) {
      expect(questions[1]!.analysis.followingTsumogiri).toBe(9);
      expect(questions[1]!.actual.after.tenpai).toBe(true);
    }
    if (source.logId.startsWith("202511")) {
      expect(questions[0]!.source.seat).toBe("東");
      expect(questions[0]!.actual.shantenBeforeDraw).toBe(1);
      expect(questions[0]!.actual.after.tenpai).toBe(true);
    }
  });
  it("selects 30 diverse questions, covers every log, and preserves counterexamples without auto-publication", () => {
    const all = sources.flatMap((s) => collectReadingCandidates(realLog(s), s).candidates);
    const selected = selectReadingQuestions(all, sources);
    expect(selected).toHaveLength(30);
    expect(selectReadingQuestions(all.slice().reverse(), sources)).toEqual(selected);
    expect(new Set(selected.map((q) => `${q.source.logId}:${q.source.eventSequence}`)).size).toBe(30);
    expect(new Set(selected.map((q) => q.analysis.category)).size).toBeGreaterThanOrEqual(8);
    for (const source of sources) expect(selected.filter((q) => q.source.logId === source.logId).length).toBeGreaterThanOrEqual(3);
    expect(selected.some((q) => q.analysis.category === "tsumogiri-run" && !q.actual.after.tenpai)).toBe(true);
    expect(selected.every((q) => q.status === "candidate" && q.selection!.score >= 80 && !q.qualityFlags.length && q.contentHash === questionContentHash(q) && !canPublishQuestion(q))).toBe(true);
  }, 30000);
});
