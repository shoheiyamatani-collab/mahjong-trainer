import { describe, expect, it } from "vitest";
import {
  DEFAULT_STRATEGY_SETTINGS, doraFromIndicator, extractHandBlocks, extractHandFeatures,
  evaluateStrategies, kokushiShantenForStrategy, parseHand, recommendStartingHand,
  selectAdaptiveSampling, tileIndex, winRateInterval,
  type StrategyEvaluation, type StrategySettings,
} from "../src";

const settings = { ...DEFAULT_STRATEGY_SETTINGS };
const ranking = (text: string, config: StrategySettings = settings) => recommendStartingHand(parseHand(text), config, {}, false);
const find = (text: string, id: string, config = settings) => ranking(text, config).strategies.find((s) => s.id === id)!;

describe("starting-hand practical recommendations", () => {
  it("prefers a flexible closed route for a middle-tile hand", () => {
    expect(ranking("23456m345p45678s").strategies[0]?.id).toBe("closed");
  });
  it("puts seven pairs near the top with five pairs", () => {
    const result = ranking("1133m5577p99s東白中");
    expect(result.strategies.slice(0, 2).map((s) => s.id)).toContain("chiitoitsu");
    expect(result.features.pairKinds).toBe(5);
  });
  it("rates eight tiles of one suit plus honors highly", () => {
    const result = ranking("12345678p東東白白9m");
    expect(result.strategies.slice(0, 3).map((s) => s.id)).toContain("flush-p");
    expect(result.strategies.find((s) => s.id === "flush-p")!.suitabilityScore).toBeGreaterThan(65);
  });
  it.each(["19m19p19s東南西北白22m", "19m19p19s東南西北白發2m"])("recognizes a realistic kokushi hand: %s", (text) => {
    const result = ranking(text);
    expect(result.strategies[0]?.id).toBe("kokushi");
  });
  it("raises the yakuhai route for a white-dragon pair", () => {
    expect(find("23m45p67s128m東白白9s", "yakuhai").overallScore)
      .toBeGreaterThan(find("23m45p67s128m東白中9s", "yakuhai").overallScore);
  });
  it("treats double east as one tile kind worth two han", () => {
    const hand = "23m45p67s128m白東東9s";
    const doubled = { ...settings, roundWind: "東", seatWind: "東" } as const;
    const features = extractHandFeatures(parseHand(hand), doubled);
    expect(features.yakuhai.filter((seed) => seed.tile === "東")).toEqual([{ tile: "東", count: 2, han: 2, live: 2 }]);
    expect(find(hand, "yakuhai", doubled).overallScore).toBeGreaterThan(find(hand, "yakuhai").overallScore);
  });
  it("finds the actual 456 seeds without confusing other runs", () => {
    const result = ranking("45m46p56s22m8p東南白中");
    const seed = result.features.sanshoku.find((s) => s.start === 4)!;
    expect(seed.tilesBySuit).toEqual([["4m", "5m"], ["4p", "6p"], ["5s", "6s"]]);
    expect(result.strategies.find((s) => s.id === "sanshoku-4")!.suitabilityScore)
      .toBeGreaterThan(result.strategies.find((s) => s.id === "sanshoku-1")!.suitabilityScore);
  });
  it("penalizes forcing a three-color run around outside dora", () => {
    const hand = "45m46p56s223m東南白中";
    const withDora = find(hand, "sanshoku-4", { ...settings, doraIndicator: "1m" });
    expect(withDora.lostDoraCount).toBeGreaterThan(0);
    expect(withDora.commitmentPenalty).toBeGreaterThan(find(hand, "sanshoku-4").commitmentPenalty);
    expect(withDora.overallScore).toBeLessThan(find(hand, "closed", { ...settings, doraIndicator: "1m" }).overallScore);
  });
  it("prefers an ordinary one-shanten hand over speculative yaku", () => {
    const result = ranking("234m567p45s22p78m白");
    expect(result.features.normalShanten).toBe(1);
    expect(result.strategies[0]?.id).toBe("closed");
    expect(result.strategies.find((s) => s.id === "kokushi")?.tier).toBe("追わない");
  });
  it("lowers kokushi suitability when the alternative hand is faster", () => {
    const features = extractHandFeatures(parseHand("19m19p19s東南白2234m"));
    expect(features.terminalHonorKinds).toBe(9);
    const actual = evaluateStrategies(features).find((s) => s.id === "kokushi")!;
    // Nine unique terminals/honors and an extremely fast normal hand cannot coexist in 13 tiles.
    // Exercise the comparison rule independently, rather than inventing a physically impossible fixture.
    const fasterAlternative = evaluateStrategies({ ...features, normalShanten: 1 }).find((s) => s.id === "kokushi")!;
    expect(fasterAlternative.overallScore).toBeLessThan(actual.overallScore);
  });
  it("does not reuse tiles in block counts or count a quad as two pairs", () => {
    const features = extractHandFeatures(parseHand("1111m2233p456s東南"));
    expect(features.pairKinds).toBe(3);
    const blocks = extractHandBlocks(parseHand("2345m"));
    expect(blocks.melds).toBe(1);
    expect(blocks.taatsu).toBe(0);
    expect(blocks.isolated).toBe(1);
  });
  it.each([["9m", "1m"], ["9p", "1p"], ["北", "東"], ["中", "白"], ["白", "發"]])("maps dora indicator %s to %s", (indicator, dora) => {
    expect(doraFromIndicator(indicator)).toBe(dora);
  });
  it("rejects invalid hands, fractional counts, and a fifth visible indicator", () => {
    expect(() => ranking("123m")).toThrow();
    expect(() => ranking("1111m234p567s東南白", { ...settings, doraIndicator: "1m" })).toThrow(/5枚/);
    const invalid = parseHand("123m456p789s11m東南");
    invalid[0] = 1.5;
    expect(() => recommendStartingHand(invalid)).toThrow();
  });
  it("identifies all thirteen kokushi kinds and its pair correctly", () => {
    expect(kokushiShantenForStrategy(parseHand("19m19p19s東南西北白發中"))).toBe(0);
    expect(kokushiShantenForStrategy(parseHand("119m19p19s東南西北白發中"))).toBe(-1);
  });
  it("keeps scores finite, bounded, transparent, and input immutable", () => {
    const hand = parseHand("12345678p東東白白9m");
    const saved = [...hand];
    const result = recommendStartingHand(hand, settings, {}, false);
    expect(hand).toEqual(saved);
    expect(result.strategies.filter((s) => s.id.startsWith("sanshoku-"))).toHaveLength(7);
    expect(result.strategies.filter((s) => s.id.startsWith("flush-"))).toHaveLength(3);
    for (const strategy of result.strategies) {
      expect(strategy.overallScore).toBeGreaterThanOrEqual(0);
      expect(strategy.overallScore).toBeLessThanOrEqual(100);
      expect(strategy.simulation).toBeNull();
      expect(strategy.reasons.length).toBeGreaterThanOrEqual(2);
      expect(strategy.reasons.length).toBeLessThanOrEqual(4);
    }
  });
  it("derives pivot deltas from a legal draw followed by a discard", () => {
    const hand = parseHand("45m46p56s223m東南白中");
    const config = { ...settings, doraIndicator: "白" };
    const result = recommendStartingHand(hand, config);
    const baseline = evaluateStrategies(extractHandFeatures(hand, config));
    expect(result.pivots.length).toBeGreaterThan(0);
    expect(result.pivots.length).toBeLessThanOrEqual(5);
    for (const pivot of result.pivots) {
      const drawn = hand.slice();
      drawn[tileIndex(pivot.tile)] += 1;
      const available = drawn.map((n) => 4 - n);
      available[tileIndex("白")] -= 1;
      drawn[tileIndex(pivot.recommendedDiscard)] -= 1;
      const afterStrategies = evaluateStrategies(extractHandFeatures(drawn, config, available));
      const next = afterStrategies.find((s) => s.id === pivot.strategyId)!;
      const before = baseline.find((s) => s.id === pivot.strategyId)!;
      expect(pivot.scoreDelta).toBeCloseTo(next.overallScore - before.overallScore, 1);
      expect(next.overallScore).toBeGreaterThanOrEqual(baseline[0]!.overallScore - 4);
      expect(next.overallScore).toBeGreaterThanOrEqual(afterStrategies[0]!.overallScore - 9);
      expect(pivot.remaining).toBe(4 - hand[tileIndex(pivot.tile)]! - Number(pivot.tile === "白"));
    }
  });
  it("does not suggest breaking a completed block just to improve a distant flush or ittsu", () => {
    const result = recommendStartingHand(parseHand("12789m19p789s東東白"));
    expect(result.pivots.some((pivot) => pivot.strategyId === "ittsu-m" && pivot.recommendedDiscard === "9s")).toBe(false);
    expect(result.pivots.some((pivot) => pivot.strategyId === "flush-m" && pivot.recommendedDiscard === "7s")).toBe(false);
  });
});

describe("adaptive recommendation sampling", () => {
  const candidates = (scores: number[], trials = 100): StrategyEvaluation[] => scores.map((overallScore, i) => ({
    ...ranking("23456m345p45678s").strategies[0]!, id: `role-${i}`, overallScore,
    sourceRoleId: (["riichi", "sanshoku", "flush", "tanyao", "chanta"] as const)[i],
    simulation: { trials, winRate: 0.2, tenpaiRate: 0.5, winRateError: 0.08, confidence: "低" },
  }));
  it("stops after the first batch for a clear leader", () => {
    expect(selectAdaptiveSampling(candidates([80, 50, 30]), 100).roles).toEqual([]);
  });
  it("uses 100, 300, 1000, and optionally 3000 without exceeding the limit", () => {
    expect(selectAdaptiveSampling(candidates([72, 70, 30]), 100).targetTrials).toBe(300);
    expect(selectAdaptiveSampling(candidates([72, 70], 300), 300).targetTrials).toBe(1000);
    expect(selectAdaptiveSampling(candidates([72, 70], 1000), 1000).targetTrials).toBeNull();
    expect(selectAdaptiveSampling(candidates([72, 70], 1000), 1000, 3000).targetTrials).toBe(3000);
    expect(selectAdaptiveSampling(candidates([72, 70], 3000), 3000, 3000).targetTrials).toBeNull();
  });
  it("bounds simultaneous refinements and does not duplicate the same role family", () => {
    const list = candidates([72, 71, 70, 69, 68]);
    list.splice(1, 0, { ...list[0]!, id: "another-variant", overallScore: 71.5 });
    expect(selectAdaptiveSampling(list, 100).roles).toHaveLength(4);
    expect(new Set(selectAdaptiveSampling(list, 100).roles).size).toBe(4);
  });
  it("does not claim zero uncertainty for zero wins", () => {
    expect(winRateInterval(0, 100).upper).toBeGreaterThan(0);
    expect(winRateInterval(20, 1000).error).toBeLessThan(winRateInterval(2, 100).error);
    expect(winRateInterval(0, 0).error).toBe(1);
  });
});
