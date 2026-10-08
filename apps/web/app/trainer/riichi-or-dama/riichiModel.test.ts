import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { addTile, analyzeHandProgress, calculateHandScore, parseHand, tileIndex, validateCounts, type Tile } from "@mahjong-trainer/mahjong-core";
import { getRobotsPolicy, shouldIncludeInSitemap } from "@mahjong-trainer/content-index-policy";
import { tileAssetName } from "../../components/TileFigures";
import { standaloneTrainerDefinitions } from "../trainerCatalog";
import { doraFromIndicator } from "../call-or-pass/callModel";
import { learningGuides } from "../../learn/guides/guideData";
import { knownRiichiCounts, parseRiichiHistory, prepareRiichiQuestion, riichiSessionStats, shuffleRiichiSession, type RiichiQuestion } from "./riichiModel";
import { riichiQuestions } from "./riichiQuestions";

const find = (id: string) => riichiQuestions.find((q) => q.id === id)!;
const prepared = (id: string) => prepareRiichiQuestion(find(id));
const branch = (id: string, action: "riichi" | "dama") => prepared(id).branches.find((b) => b.action === action)!;

describe("Riichi or dama teaching positions", () => {
  it("has 30 unique, legal original positions and 10 questions per difficulty", () => {
    expect(riichiQuestions).toHaveLength(30);
    expect(new Set(riichiQuestions.map((q) => q.id)).size).toBe(30);
    for (const difficulty of ["beginner", "intermediate", "advanced"] as const) {
      const rows = riichiQuestions.filter((q) => q.difficulty === difficulty);
      expect(rows).toHaveLength(10);
      expect(rows.some((q) => q.recommendedAction === "riichi")).toBe(true);
      expect(rows.some((q) => q.recommendedAction === "dama")).toBe(true);
    }
    for (const q of riichiQuestions) {
      const before = JSON.stringify(q);
      const result = prepareRiichiQuestion(q);
      expect(result.hand).toHaveLength(13);
      expect(() => validateCounts(addTile(parseHand(q.hand), q.discard), 14)).not.toThrow();
      expect(() => validateCounts(knownRiichiCounts(q))).not.toThrow();
      expect(result.liveCount).toBeGreaterThan(0);
      expect(result.branches.some((b) => b.action === q.recommendedAction && b.available)).toBe(true);
      expect(JSON.parse(JSON.stringify(result))).toEqual(result);
      expect(JSON.stringify(q)).toBe(before);
      for (const tile of [...result.hand, q.discard, q.doraIndicator]) expect(existsSync(resolve("public/tiles", `${tileAssetName(tile)}-66-90-l-emb.png`))).toBe(true);
    }
  });

  it("uses the existing progress and scoring engines for every wait and method", () => {
    for (const q of riichiQuestions) {
      const result = prepareRiichiQuestion(q);
      const counts = parseHand(q.hand);
      const known = knownRiichiCounts(q);
      const progress = analyzeHandProgress(counts, 0, known);
      expect(result.waits).toEqual(progress.waits);
      expect(result.liveCount).toBe(progress.ukeireCount);
      for (const b of result.branches) for (const wait of b.waits) {
        expect(wait.remaining).toBe(4 - known[tileIndex(wait.tile)]);
        for (const winMethod of ["ron", "tsumo"] as const) {
          const value = wait[winMethod];
          if (!value) continue;
          const won = addTile(counts, wait.tile);
          const expected = calculateHandScore({ counts: won, winningTile: wait.tile, isDealer: q.seatWind === "東", winMethod, roundWind: q.roundWind, seatWind: q.seatWind, riichi: b.action === "riichi", dora: won[tileIndex(doraFromIndicator(q.doraIndicator))] });
          expect(value.totalPoints).toBe(expected.score.totalPoints);
          expect(value.han).toBe(expected.score.han);
          expect(value.fu).toBe(expected.score.fu);
        }
      }
    }
  });

  it("prices both sides of the basic ryanmen accurately without ippatsu or ura", () => {
    expect(prepared("b-ryanmen").waits).toEqual(["3m", "6m"]);
    expect(prepared("b-ryanmen").liveCount).toBe(8);
    for (const wait of branch("b-ryanmen", "dama").waits) {
      expect(wait.ron?.totalPoints).toBe(2000);
      expect(wait.ron?.fu).toBe(30);
      expect(wait.tsumo.totalPoints).toBe(2700);
    }
    for (const wait of branch("b-ryanmen", "riichi").waits) {
      expect(wait.ron?.totalPoints).toBe(3900);
      expect(wait.tsumo.totalPoints).toBe(5200);
    }
  });

  it("does not mistake dora for a yaku and distinguishes ron from closed tsumo", () => {
    const q = { ...find("b-no-yaku"), doraIndicator: "3p" as Tile };
    const data = prepareRiichiQuestion(q);
    const dama = data.branches[1]!;
    expect(dama.waits[0]!.ron).toBeNull();
    expect(dama.waits[0]!.ronBlocked).toBe("役なし");
    expect(dama.waits[0]!.tsumo.yaku.join(" ")).toContain("門前清自摸和");
    expect(data.branches[0]!.waits[0]!.ron).not.toBeNull();
  });

  it("handles partial yakuhai waits separately", () => {
    const waits = branch("b-partial-yaku", "dama").waits;
    expect(waits.find((w) => w.tile === "白")!.ron?.totalPoints).toBe(1300);
    expect(waits.find((w) => w.tile === "8m")!.ronBlocked).toBe("役なし");
    expect(branch("b-partial-yaku", "riichi").waits.every((w) => w.ron)).toBe(true);
  });

  it("prices chiitoitsu, sanshoku, mangan and haneman as stated", () => {
    expect(branch("b-pairs", "dama").waits[0]!.ron?.totalPoints).toBe(1600);
    expect(branch("b-pairs", "riichi").waits[0]!.ron?.totalPoints).toBe(3200);
    expect(branch("m-pairs-dora", "dama").waits[0]!.ron?.totalPoints).toBe(6400);
    expect(branch("m-pairs-dora", "riichi").waits[0]!.ron?.totalPoints).toBe(8000);
    expect(branch("m-sanshoku", "dama").waits[0]!.ron?.totalPoints).toBe(5200);
    expect(branch("m-sanshoku", "riichi").waits[0]!.ron?.totalPoints).toBe(8000);
    expect(branch("m-penchan", "dama").waits[0]!.ron?.totalPoints).toBe(2600);
    expect(branch("m-penchan", "riichi").waits[0]!.ron?.totalPoints).toBe(5200);
    for (const wait of branch("m-mangan", "dama").waits) expect(wait.ron?.totalPoints).toBe(8000);
    for (const wait of branch("m-mangan", "riichi").waits) expect(wait.ron?.totalPoints).toBe(12000);
  });

  it("counts exposed waits and blocks all ron in discard furiten, even on a dead side", () => {
    expect(prepared("m-visible").liveCount).toBe(4);
    const q = { ...find("a-furiten"), rivers: { 南: ["3m" as Tile], 西: ["3m", "3m", "3m"] as Tile[] } };
    const data = prepareRiichiQuestion(q);
    expect(data.liveCount).toBe(4);
    expect(data.furiten).toBe(true);
    expect(data.canRiichi).toBe(true);
    for (const b of data.branches) for (const wait of b.waits) {
      expect(wait.ron).toBeNull();
      expect(wait.ronBlocked).toBe("フリテン");
      expect(wait.tsumo.totalPoints).toBeGreaterThan(0);
    }
  });

  it("validates the explicit good-shape changes in the explanations", () => {
    const kan = parseHand(find("m-early-change").hand); kan[tileIndex("3m")] -= 1; kan[tileIndex("6m")] += 1;
    expect(analyzeHandProgress(kan).waits).toEqual(["4m", "7m"]);
    const furiten = parseHand(find("a-furiten").hand); furiten[tileIndex("4m")] -= 1; furiten[tileIndex("7m")] += 1;
    expect(analyzeHandProgress(furiten).waits).toEqual(["6m"]);
  });

  it("disallows riichi with insufficient points but allows legal furiten riichi", () => {
    expect(prepared("b-not-enough-points").canRiichi).toBe(false);
    expect(branch("b-not-enough-points", "riichi").available).toBe(false);
    expect(branch("b-not-enough-points", "riichi").waits).toEqual([]);
    expect(prepared("a-furiten").canRiichi).toBe(true);
  });

  it("rejects impossible counts, non-tenpai hands and inconsistent point totals", () => {
    const q = find("b-ryanmen");
    expect(() => prepareRiichiQuestion({ ...q, hand: "123m 456p 789s 白白東南" })).toThrow();
    expect(() => prepareRiichiQuestion({ ...q, hand: `${q.hand} 中` })).toThrow();
    expect(() => prepareRiichiQuestion({ ...q, rivers: { 東: ["中", "中", "中", "中"] } })).toThrow();
    expect(() => prepareRiichiQuestion({ ...q, riichiSticks: 1 })).toThrow();
    expect(() => prepareRiichiQuestion({ ...find("b-not-enough-points"), recommendedAction: "riichi" })).toThrow();
  });
});

describe("All-last exact score settlement", () => {
  it("separates direct ron, other-player ron and tsumo", () => {
    const directDama = branch("a-direct", "dama").outcomes.find((o) => o.method === "東家からロン")!;
    expect(directDama.scores.east).toBe(30000);
    expect(directDama.scores.south).toBe(29000);
    expect(directDama.achieved).toBe(false);
    const directRiichi = branch("a-direct", "riichi").outcomes.find((o) => o.method === "東家からロン")!;
    expect(directRiichi.scores.east).toBe(28100);
    expect(directRiichi.scores.south).toBe(30900);
    expect(directRiichi.achieved).toBe(true);
    expect(branch("a-direct", "riichi").outcomes.find((o) => o.method === "西家からロン")!.achieved).toBe(false);
    expect(branch("a-direct", "riichi").outcomes.find((o) => o.method === "ツモ")!.achieved).toBe(true);
  });

  it("returns the new riichi stick on a self win, without subtracting it twice", () => {
    for (const q of riichiQuestions.filter((q) => q.targetRank)) for (const b of prepareRiichiQuestion(q).branches) for (const outcome of b.outcomes) {
      expect(Object.values(outcome.scores).reduce((a, v) => a + v, 0)).toBe(100000);
    }
    expect(branch("a-follow-goal", "dama").outcomes.find((o) => o.method === "東家からロン")!.scores.south).toBe(28900);
    expect(branch("a-follow-goal", "riichi").outcomes.find((o) => o.method === "東家からロン")!.scores.south).toBe(32700);
  });

  it("checks top maintenance, second place and mangan-versus-haneman conditions", () => {
    expect(branch("a-top", "dama").outcomes.every((o) => o.achieved)).toBe(true);
    expect(branch("a-second", "dama").outcomes.every((o) => o.achieved)).toBe(true);
    expect(branch("a-mangan-enough", "dama").outcomes.every((o) => o.achieved)).toBe(true);
    expect(branch("a-haneman-needed", "dama").outcomes.find((o) => o.method === "西家からロン")!.achieved).toBe(false);
    expect(branch("a-haneman-needed", "riichi").outcomes.every((o) => o.achieved)).toBe(true);
  });
});

describe("Sessions, history and integration", () => {
  it("shuffles without duplicates, excludes other difficulties and avoids the last question first", () => {
    const recent = riichiQuestions.filter((q) => q.difficulty === "beginner").map((q) => q.id);
    const session = shuffleRiichiSession(riichiQuestions, "beginner", recent, () => 0.5);
    expect(session).toHaveLength(10);
    expect(new Set(session.map((q) => q.id)).size).toBe(10);
    expect(session.every((q) => q.difficulty === "beginner")).toBe(true);
    expect(session[0]!.id).not.toBe(recent.at(-1));
  });

  it("calculates recommendation agreement without double-counting responses", () => {
    const qs: RiichiQuestion[] = [find("b-ryanmen"), find("b-top-high"), find("b-pinfu")];
    const stats = riichiSessionStats(qs, [{ id: qs[0]!.id, action: "dama" }, { id: qs[1]!.id, action: "dama" }, { id: qs[2]!.id, action: "riichi" }, { id: qs[2]!.id, action: "riichi" }, { id: "unknown", action: "dama" }]);
    expect(stats.total).toBe(3); expect(stats.matched).toBe(2); expect(stats.accuracy).toBe(67); expect(stats.streak).toBe(2);
    expect(riichiSessionStats(qs, []).accuracy).toBe(0);
  });

  it("reuses bounded history parsing and recovers from corrupt storage", () => {
    expect(parseRiichiHistory("bad-json")).toEqual({ recent: [], sessions: [] });
    expect(parseRiichiHistory(null)).toEqual({ recent: [], sessions: [] });
    const raw = { recent: Array.from({ length: 30 }, (_, i) => String(i)), sessions: [{ at: "2026-10-08T00:00:00Z", difficulty: "advanced", correct: 6, total: 10 }, { at: "", difficulty: "unknown", correct: 20, total: 10 }] };
    expect(parseRiichiHistory(JSON.stringify(raw)).recent).toHaveLength(20);
    expect(parseRiichiHistory(JSON.stringify(raw)).sessions).toHaveLength(1);
  });

  it("is linked from the portal and guide and stays indexed in review mode", () => {
    expect(standaloneTrainerDefinitions.some((q) => q.slug === "riichi-or-dama")).toBe(true);
    expect(learningGuides.find((g) => g.slug === "riichi-or-dama")!.toolLink.href).toBe("/trainer/riichi-or-dama");
    expect(getRobotsPolicy("/trainer/riichi-or-dama").index).not.toBe(false);
    expect(shouldIncludeInSitemap("/trainer/riichi-or-dama")).toBe(true);
  });
});
