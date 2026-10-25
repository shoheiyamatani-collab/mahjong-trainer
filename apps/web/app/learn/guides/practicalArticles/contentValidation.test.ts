import { describe, expect, it } from "vitest";
import { ORASU_SEATS, addTile, calculateOrasuConditions, countsToTiles, hasReachedOrasuTarget, parseHand, tileIndex, validateCounts } from "@mahjong-trainer/mahjong-core";
import { batch1 } from "./batch1";
import { batch2 } from "./batch2";
import { batch3 } from "./batch3";
import { batch4 } from "./batch4";
import { batch5 } from "./batch5";
import { batch6 } from "./batch6";
import { orasuConditionHref, parseSharedOrasuCondition } from "../../../analysis/orasu-condition/sharedCondition";
import { knownCounts, studyDiscardRows, studyProgress, studyScores, studyShanten } from "./studyAnalysis";

export const articlesUnderTest = [...batch1, ...batch2, ...batch3, ...batch4, ...batch5, ...batch6];

describe("practical article calculation and tile integrity", () => {
  it.each(articlesUnderTest)("validates $number $slug", (article) => {
    expect(article.cases.length).toBeGreaterThanOrEqual(article.number === 1 || article.number === 23 ? 10 : 2);
    for (const example of article.cases) {
      expect(example.options.length).toBeGreaterThanOrEqual(2);
      for (const hand of example.hands ?? []) {
        const counts = parseHand(hand.tiles);
        const total = countsToTiles(counts).length + (hand.melds?.length ?? 0) * 3;
        expect([13, 14], `${example.id}: ${hand.tiles}`).toContain(total);
        validateCounts(knownCounts(example, hand));
        if (hand.discards?.length) {
          expect(total, example.id).toBe(14);
          const rows = studyDiscardRows(example, hand);
          expect(rows.length).toBeGreaterThanOrEqual(hand.discards.length);
          expect(rows.some((row) => row.isMaximum)).toBe(true);
          for (const row of rows) {
            const after = counts.slice(); after[tileIndex(row.discard)]! -= 1;
            const known = knownCounts(example, hand);
            const independentlyCounted = row.ukeire.reduce((sum, tile) => sum + 4 - known[tileIndex(tile)]!, 0);
            expect(row.ukeireTiles, `${example.id}/${row.discard}`).toBe(independentlyCounted);
          }
        }
        if (hand.expectedShanten !== undefined) expect(studyShanten(hand), example.id).toBe(hand.expectedShanten);
        if (hand.expectedWaits) expect(studyProgress(example, hand).waits, example.id).toEqual(hand.expectedWaits);
        if (hand.score) {
          validateCounts(addTile(counts, hand.score.winningTile), 14);
          validateCounts(addTile(knownCounts(example, hand), hand.score.winningTile));
          const scores = studyScores(hand);
          expect(scores[1]!.result, example.id).not.toBeNull();
          if (hand.score.expectedRon) expect(scores.map((score) => score.result?.score.totalPoints ?? null), example.id).toEqual(hand.score.expectedRon);
        }
      }
      for (const river of example.rivers ?? []) if (river.marks) expect(river.marks).toHaveLength(river.tiles.length);
      if (example.orasu) {
        const input = example.orasu;
        expect(Object.values(input.scores).reduce((sum, value) => sum + value, 0) + input.riichiSticks * 1000).toBe(100000);
        const result = calculateOrasuConditions(input);
        expect(result.alreadyAchieved, example.id).toBe(false);
        const shared = parseSharedOrasuCondition(new URL(orasuConditionHref(input), "https://jongfolio.com").searchParams);
        expect(shared, example.id).toEqual(input);
        for (const seat of ORASU_SEATS.filter((seat) => seat !== input.selfSeat)) {
          const ron = result.ron[seat];
          if (!ron) continue;
          const payment = ron!.candidate.baseTotalPoints + input.honba * 300;
          expect(ron!.postScores[input.selfSeat]).toBe(input.scores[input.selfSeat] + payment + input.riichiSticks * 1000);
          expect(ron!.postScores[seat]).toBe(input.scores[seat] - payment);
          expect(hasReachedOrasuTarget(ron!.postScores, input.selfSeat, input.targetRank, input.tiePolicy), example.id).toBe(true);
        }
        expect(result.tsumo, example.id).not.toBeNull();
        expect(hasReachedOrasuTarget(result.tsumo!.postScores, input.selfSeat, input.targetRank, input.tiePolicy)).toBe(true);
      }
      for (const transition of example.transitions ?? []) {
        const before = parseHand(example.hands![transition.from]!.tiles);
        const after = addTile(before, transition.draw);
        validateCounts(after, 14);
        expect(after[tileIndex(transition.discard)]).toBeGreaterThan(0);
        after[tileIndex(transition.discard)]! -= 1;
        expect(after, `${example.id}: chronological tile conservation`).toEqual(parseHand(example.hands![transition.to]!.tiles));
      }
      for (const branch of example.branches ?? []) {
        const before = parseHand(example.hands![branch.from]!.tiles);
        validateCounts(before, 14);
        expect(before[tileIndex(branch.firstDiscard)]).toBeGreaterThan(0);
        before[tileIndex(branch.firstDiscard)]! -= 1;
        const drawn = addTile(before, branch.draw);
        expect(drawn[tileIndex(branch.discard)]).toBeGreaterThan(0);
        drawn[tileIndex(branch.discard)]! -= 1;
        expect(drawn, `${example.id}: branch conservation`).toEqual(parseHand(example.hands![branch.to]!.tiles));
      }
    }
  });

  it("has ten different 14-tile positions in the first article", () => {
    const cases = batch1.find((article) => article.number === 1)!.cases;
    expect(new Set(cases.map((example) => parseHand(example.hands![0]!.tiles).join())).size).toBe(10);
  });

  it("checks the equal-ukeire examples rather than assuming a tie", () => {
    for (const example of batch1.find((article) => article.number === 3)!.cases) {
      const rows = studyDiscardRows(example, example.hands![0]!);
      const selected = rows.filter((row) => example.hands![0]!.discards!.includes(row.discard));
      expect(new Set(selected.map((row) => `${row.afterDiscardShanten}/${row.ukeireTiles}`)).size, example.id).toBe(1);
    }
  });

  it("preserves the 19-tile tie and the subsequent 8-versus-4 wait", () => {
    const example = batch1.find((article) => article.number === 3)!.cases[2]!;
    const rows = studyDiscardRows(example, example.hands![0]!);
    expect(rows.filter((row) => ["5m", "6m"].includes(row.discard)).map((row) => row.ukeireTiles)).toEqual([19, 19]);
    expect(studyProgress(example, example.hands![1]!).ukeireCount).toBe(8);
    expect(studyProgress(example, example.hands![2]!).ukeireCount).toBe(4);
    const thinWait = batch1.find((article) => article.number === 1)!.cases.find((item) => item.id === "u09")!;
    const row = studyDiscardRows(thinWait, thinWait.hands![0]!).find((item) => item.discard === "9m")!;
    expect(row.ukeire).toEqual(["3s"]);
    expect(row.ukeireTiles).toBe(1);
  });
});
