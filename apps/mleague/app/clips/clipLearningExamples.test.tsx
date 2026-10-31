import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { addTile, analyzeHandProgress, calculateHandScore, calculateOrasuConditions, calculateScore, countsToTiles, hasReachedOrasuTarget, parseHand, validateCounts, type OrasuScores } from "../../../../packages/mahjong-core/src/index";
import { orasuExamples } from "../../../web/app/analysis/orasu-condition/orasuExamples";
import { getTileName, tileAssetName } from "../../../web/app/components/TileFigures";
import { ClipVerifiedExamples } from "./ClipVerifiedExamples";
import { clipScoreExample, clipSuuankouExample } from "./clipLearningExamples";

describe("independent M League viewing examples", () => {
  it("uses the calculator's actual preset and verifies the target conditions", () => {
    const { rows, href, ...input } = clipScoreExample;
    expect(input).toEqual(orasuExamples.find((example) => example.id === "direct-hit")!.input);
    const result = calculateOrasuConditions(input);
    expect(result.ron.east!.candidate.baseTotalPoints).toBe(2000);
    expect(result.ron.west!.candidate.baseTotalPoints).toBeGreaterThan(2000);
    expect(result.tsumo!.candidate.baseTotalPoints).toBeGreaterThan(2000);
    expect(href).toContain("example=direct-hit");
    expect(rows).toHaveLength(3);
  });

  it.each(clipScoreExample.rows)("$label matches the existing scoring engine", (row) => {
    const score = calculateScore({ han: 2, fu: 30, isDealer: false, winMethod: row.method });
    expect(score.totalPoints).toBe(2000);
    const after: OrasuScores = { ...clipScoreExample.scores };
    after.south += score.totalPoints;
    if (row.method === "ron" && row.fromSeat) after[row.fromSeat] -= score.totalPoints;
    else {
      const dealerPayment = score.payments.find((payment) => payment.label === "親")?.points;
      const childPayment = score.payments.find((payment) => payment.label === "子")?.points;
      expect([dealerPayment, childPayment]).toEqual([1000, 500]);
      after.east -= dealerPayment!;
      after.west -= childPayment!;
      after.north -= childPayment!;
    }
    expect([after.south, after.east]).toEqual([row.south, row.east]);
    expect(Object.values(after).reduce((sum, value) => sum + value, 0)).toBe(100000);
    expect(hasReachedOrasuTarget(after, "south", 1, "strict")).toBe(row.reachesTarget);
  });

  it("a closed shanpon ron is not suuankou, while the same tsumo is", () => {
    const hand = parseHand(clipSuuankouExample.hand);
    validateCounts(hand, 13);
    expect(analyzeHandProgress(hand).waits).toEqual(["白", "中"]);
    expect(clipSuuankouExample.groups.reduce((sum, group) => sum + group.count, 0)).toBe(13);
    expect(clipSuuankouExample.groups.flatMap((group) => Array.from({ length: group.count }, () => group.asset)))
      .toEqual(countsToTiles(hand).map((tile) => tileAssetName(tile)));
    for (const group of clipSuuankouExample.groups) expect(getTileName(group.asset)).toBe(group.name);
    const counts = addTile(hand, clipSuuankouExample.winningTile);
    validateCounts(counts, 14);
    const input = { counts, winningTile: clipSuuankouExample.winningTile, isDealer: false, roundWind: "東" as const, seatWind: "南" as const };
    const ron = calculateHandScore({ ...input, winMethod: "ron" });
    const tsumo = calculateHandScore({ ...input, winMethod: "tsumo" });
    expect(ron.yaku.map((yaku) => yaku.name).sort()).toEqual([...clipSuuankouExample.ronYaku].sort());
    expect(tsumo.yaku.map((yaku) => yaku.name)).toEqual([...clipSuuankouExample.tsumoYaku]);
  });

  it.each(["recent", "yakuman"] as const)("renders %s without relying on a video player", (topic) => {
    const html = renderToStaticMarkup(<ClipVerifiedExamples topic={topic} />);
    expect(html).toContain("雀フォリオ独自");
    expect(html).not.toContain("<iframe");
    if (topic === "recent") expect(html).toContain("実際のMリーグ対局を再現したものではありません");
    else {
      expect(html).toContain("映像からの転載ではありません");
      expect(html.match(/<img /g)).toHaveLength(13);
      expect(html).toContain("/tiles/ji6-66-90-l-emb.png");
    }
  });
});
