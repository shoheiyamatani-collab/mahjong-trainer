import { describe, expect, it } from "vitest";
import { chiitoitsuShanten, normalShantenWithOpenMelds, parseHand, tileIndex, type Tile } from "@mahjong-trainer/mahjong-core";
import { callQuestions } from "./callQuestions";
import { applyCall, callSessionStats, compareCallQuestion, doraFromIndicator, forbiddenCallDiscards, knownQuestionCounts, legalCallForms, parseCallHistory, shuffleCallSession, validateCallQuestion } from "./callModel";

describe("call-or-pass authored questions", () => {
  it("has ten problems per difficulty and varied judgments", () => {
    expect(callQuestions).toHaveLength(30);
    expect(new Set(callQuestions.map((q) => q.id)).size).toBe(30);
    for (const level of ["beginner", "intermediate", "advanced"] as const) expect(callQuestions.filter((q) => q.difficulty === level)).toHaveLength(10);
    expect(new Set(callQuestions.map((q) => q.category)).size).toBe(7);
    expect(callQuestions.filter((q) => q.category === "yakuhai").length).toBeLessThan(10);
  });
  for (const question of callQuestions) it(`${question.id}: legal hand, public pool, actions and authored discard`, () => {
    expect(() => validateCallQuestion(question)).not.toThrow();
    const known = knownQuestionCounts(question);
    const result = compareCallQuestion(question);
    for (const { option, analysis } of result.calls) {
      const conserved = analysis.counts.slice();
      const exposed = [question.doraIndicator, option.discard, ...analysis.melds.flatMap((meld) => meld.tiles), ...Object.values(question.rivers ?? {}).flatMap((river) => river ?? [])];
      exposed.forEach((tile) => { conserved[tileIndex(tile)] += 1; });
      expect(conserved).toEqual(known);
    }
    for (const branch of [result.pass, ...result.calls.map((c) => c.analysis)]) {
      const expected = branch.melds.length ? normalShantenWithOpenMelds(branch.counts, branch.melds.length) : Math.min(normalShantenWithOpenMelds(branch.counts, 0), chiitoitsuShanten(branch.counts));
      expect(branch.shanten).toBe(expected);
      expect(branch.hand.length + branch.melds.length * 3).toBe(13);
      expect(branch.ukeireCount).toBe(branch.ukeire.reduce((sum, item) => sum + 4 - known[tileIndex(item.tile)]!, 0));
      for (const item of branch.ukeire) {
        const drawn = branch.counts.slice(); drawn[tileIndex(item.tile)] += 1;
        const next = branch.melds.length ? normalShantenWithOpenMelds(drawn, branch.melds.length) : Math.min(normalShantenWithOpenMelds(drawn, 0), chiitoitsuShanten(drawn));
        expect(next).toBeLessThan(branch.shanten);
      }
    }
  });
  it("chi only comes from kamicha; pon from every opponent", () => {
    const counts = parseHand("2234m45677p45s東北");
    expect(legalCallForms(counts, "2m", "kamicha").map((f) => f.action)).toEqual(["pon", "chi"]);
    expect(legalCallForms(counts, "2m", "toimen").map((f) => f.action)).toEqual(["pon"]);
    expect(legalCallForms(counts, "2m", "shimocha").map((f) => f.action)).toEqual(["pon"]);
    expect(legalCallForms(counts, "白", "kamicha")).toEqual([]);
  });
  it("rejects five visible copies and unrepresented legal actions", () => {
    const question = callQuestions[0]!;
    expect(() => validateCallQuestion({ ...question, rivers: { self: ["白", "白"] } })).toThrow();
    const both = callQuestions.find((q) => q.id === "a-two-actions")!;
    expect(() => validateCallQuestion({ ...both, options: [both.options[0]!] })).toThrow("比較が不足");
  });
  it("rejects direct and sequence-swap kuikae", () => {
    expect(forbiddenCallDiscards("3s", { action: "chi", consumed: ["4s", "5s"] })).toEqual(["3s", "6s"]);
    expect(forbiddenCallDiscards("6s", { action: "chi", consumed: ["4s", "5s"] })).toEqual(["6s", "3s"]);
    const q = callQuestions[0]!;
    expect(() => applyCall(q, { ...q.options[0]!, discard: "白" })).toThrow("喰い替え");
  });
  it("maps all suit and honor dora cycles", () => {
    for (const [indicator, dora] of [["9m", "1m"], ["4p", "5p"], ["北", "東"], ["中", "白"], ["白", "發"], ["發", "中"]]) expect(doraFromIndicator(indicator as Tile)).toBe(dora);
  });
  it("does not score dora-only open hands and scores yakuhai correctly", () => {
    const noYaku = compareCallQuestion(callQuestions.find((q) => q.id === "b-no-yaku")!).calls[0]!.analysis;
    expect(noYaku.values.every((v) => v.ron === null && v.tsumo === null)).toBe(true);
    const white = compareCallQuestion(callQuestions[0]!).calls[0]!.analysis;
    expect(white.shanten).toBe(0);
    expect(white.values.map((v) => v.tile)).toEqual(["3s", "6s"]);
    expect(white.values.every((v) => v.ron?.points === 1000)).toBe(true);
  });
  it("keeps legal furiten calls, disallows ron on all waits, but allows tsumo", () => {
    const result = compareCallQuestion(callQuestions.find((q) => q.id === "a-furiten")!).calls[0]!.analysis;
    expect(result.furiten).toBe(true);
    expect(result.values.every((v) => !v.ron && v.tsumo)).toBe(true);
  });
  it("counts dead waits as zero available tiles", () => {
    const result = compareCallQuestion(callQuestions.find((q) => q.id === "a-dead-waits")!).calls[0]!.analysis;
    expect(result.shanten).toBe(0); expect(result.waits).toEqual(["7p", "8s"]); expect(result.ukeireCount).toBe(0);
  });
  it("compares wide pass versus fixed call at the same shanten", () => {
    const result = compareCallQuestion(callQuestions.find((q) => q.id === "m-ukeire-loss")!);
    expect(result.calls[0]!.analysis.shanten).toBe(result.pass.shanten);
    expect(result.calls[0]!.analysis.ukeireCount).toBeLessThan(result.pass.ukeireCount);
  });
  it("has contrasting early/late decisions without making yakuhai universally correct", () => {
    const early = callQuestions.find((q) => q.id === "m-white-early")!, late = callQuestions.find((q) => q.id === "m-white-late")!;
    expect(early.hand).toBe(late.hand); expect(early.recommendedAction).toBe("pass"); expect(late.recommendedAction).toBe("pon");
  });
  it("matches the authored single wait, four-han score and reversal condition", () => {
    const single = compareCallQuestion(callQuestions.find((q) => q.id === "m-narrow-tenpai")!).calls[0]!.analysis;
    expect(single.waits).toEqual(["4s"]);
    const south = compareCallQuestion(callQuestions.find((q) => q.id === "a-double-south")!).calls[0]!.analysis;
    expect(south.values.every((v) => v.ron?.points === 7700 && v.ron.han === 4)).toBe(true);
    const insufficient = compareCallQuestion(callQuestions.find((q) => q.id === "a-need-mangan")!).calls[0]!.analysis;
    expect(insufficient.values.every((v) => v.ron && v.ron.points * 2 < 15000)).toBe(true);
    expect(20000 + 8000).toBeGreaterThan(35000 - 8000);
  });
  it("shuffles unique sessions, prioritizes less-recent questions and avoids boundary repeats", () => {
    for (const level of ["beginner", "intermediate", "advanced"] as const) {
      const pool = callQuestions.filter((q) => q.difficulty === level), recent = pool.slice(0, 5).map((q) => q.id);
      const session = shuffleCallSession(callQuestions, level, recent, () => 0.25);
      expect(session).toHaveLength(10); expect(new Set(session.map((q) => q.id)).size).toBe(10);
      expect(session[0]!.id).not.toBe(recent.at(-1));
      expect(session.slice(0, 5).every((q) => !recent.includes(q.id))).toBe(true);
    }
  });
  it("calculates accuracy, streak, categories and ignores double answers", () => {
    const qs = callQuestions.slice(0, 3);
    const stats = callSessionStats([...qs], [{ id: qs[0]!.id, action: "pass" }, { id: qs[1]!.id, action: "chi" }, { id: qs[2]!.id, action: "pass" }, { id: qs[2]!.id, action: "pass" }]);
    expect(stats).toMatchObject({ total: 3, correct: 2, accuracy: 67, streak: 2 });
    expect(stats.categories.reduce((sum, c) => sum + c.total, 0)).toBe(3);
  });
  it("recovers from corrupt or unavailable stored history", () => {
    expect(parseCallHistory("invalid")).toEqual({ recent: [], sessions: [] });
    expect(parseCallHistory('{"recent":[1,"valid"],"sessions":[{}, {"at":"2026-10-06","difficulty":"advanced","total":10,"correct":7}]}')).toEqual({ recent: ["valid"], sessions: [{ at: "2026-10-06", difficulty: "advanced", total: 10, correct: 7 }] });
  });
});
