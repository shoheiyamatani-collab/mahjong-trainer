import { describe, expect, it } from "vitest";
import {
  DEFAULT_TANYAO_RULE_CONFIG,
  aggregateTanyaoTrials,
  analyzeTanyaoDiscards,
  classifyTanyaoWin,
  emptyCounts,
  evaluateTanyaoCallDecision,
  evaluateTanyaoProgress,
  isTanyaoCompatibleMeld,
  parseHand,
  runTanyaoSimulation,
  shouldTanyaoRiichi,
  tanyaoShanten,
  tanyaoWinningTiles,
  tileName,
  type ChantaTrialResult,
  type TanyaoMeld,
} from "../src";

describe("tanyao structural completion", () => {
  it.each([
    ["234345m456p678s55p", "STANDARD"],
    ["222m345m456p678s55p", "STANDARD"],
    ["222m333p444s555m66p", "STANDARD"],
    ["225588m336677p44s", "CHIITOITSU"],
  ] as const)("accepts simple-only standard and chiitoitsu hands: %s", (hand, shape) => {
    expect(classifyTanyaoWin(parseHand(hand))).toMatchObject({ type: "TANYAO", shape });
  });

  it.each([
    "123m345m456p678s55p",
    "234789m456p678s55p",
    "111m345m456p678s55p",
  ])("rejects a completed hand containing a terminal: %s", (hand) => {
    expect(classifyTanyaoWin(parseHand(hand)).type).toBe("NONE");
  });

  it("rejects an honor in the pair and accepts upper-role structures made only of simples", () => {
    const honorPair = parseHand("234345m456p678s");
    honorPair[27] = 2;
    expect(classifyTanyaoWin(honorPair).type).toBe("NONE");
    expect(classifyTanyaoWin(parseHand("222333m444555p66s")).type).toBe("TANYAO");
  });

  it("supports open tanyao and obeys the open-tanyao rule switch", () => {
    const melds: TanyaoMeld[] = [{ kind: "chi", tiles: ["2m", "3m", "4m"] }];
    const concealed = parseHand("345m456p678s55p");
    expect(classifyTanyaoWin(concealed, melds).type).toBe("TANYAO");
    expect(classifyTanyaoWin(concealed, melds, { openTanyao: false }).type).toBe("NONE");
    expect(DEFAULT_TANYAO_RULE_CONFIG.openTanyao).toBe(true);
  });

  it("allows only 234-678 chi and simple-tile pon", () => {
    const chi234: TanyaoMeld = { kind: "chi", tiles: ["2m", "3m", "4m"] };
    const chi678: TanyaoMeld = { kind: "chi", tiles: ["6s", "7s", "8s"] };
    const chi123: TanyaoMeld = { kind: "chi", tiles: ["1m", "2m", "3m"] };
    const chi789: TanyaoMeld = { kind: "chi", tiles: ["7p", "8p", "9p"] };
    const simplePon: TanyaoMeld = { kind: "pon", tiles: ["5p", "5p", "5p"] };
    const terminalPon: TanyaoMeld = { kind: "pon", tiles: ["9s", "9s", "9s"] };
    const honor = tileName(27);
    const honorPon: TanyaoMeld = { kind: "pon", tiles: [honor, honor, honor] };
    expect(isTanyaoCompatibleMeld(chi234)).toBe(true);
    expect(isTanyaoCompatibleMeld(chi678)).toBe(true);
    expect(isTanyaoCompatibleMeld(simplePon)).toBe(true);
    expect(isTanyaoCompatibleMeld(chi123)).toBe(false);
    expect(isTanyaoCompatibleMeld(chi789)).toBe(false);
    expect(isTanyaoCompatibleMeld(terminalPon)).toBe(false);
    expect(isTanyaoCompatibleMeld(honorPon)).toBe(false);
  });
});

describe("tanyao constrained shanten, waits, and policy", () => {
  it("distinguishes completion, live tenpai, and iishanten", () => {
    expect(tanyaoShanten(parseHand("234345m456p678s55p"))).toBe(-1);
    const tenpai = parseHand("23m345m456p678s55p");
    expect(tanyaoShanten(tenpai)).toBe(0);
    expect(tanyaoWinningTiles(tenpai)).toEqual(["4m"]);
    expect(evaluateTanyaoProgress(tenpai)).toMatchObject({ isTenpai: true, waitKindCount: 1 });

    const iishanten = parseHand("23m345m456p67s55p9s");
    expect(tanyaoShanten(iishanten)).toBe(1);
    expect(evaluateTanyaoProgress(iishanten).isIishanten).toBe(true);
  });

  it("finds a simple-only chiitoitsu wait", () => {
    const hand = parseHand("225588m336677p4s");
    expect(tanyaoWinningTiles(hand)).toContain("4s");
    expect(evaluateTanyaoProgress(hand).bestShape).toBe("CHIITOITSU");
  });

  it("does not count a dead target wait as live tenpai", () => {
    const dead = emptyCounts();
    const evaluation = evaluateTanyaoProgress(parseHand("23m345m456p678s55p"), [], dead);
    expect(evaluation.isTenpai).toBe(false);
    expect(evaluation.isPossible).toBe(false);
  });

  it("discards an honor before a completed simple shape", () => {
    const hand = parseHand("23m345m456p678s55p");
    hand[27] = 1;
    const best = analyzeTanyaoDiscards(hand)[0];
    expect(best?.tile).toBe(tileName(27));
    expect(best?.terminalHonorCount).toBe(0);
  });

  it("evaluates the discard after a useful simple-tile pon", () => {
    const before = parseHand("23m345m456p66s55p9s");
    const afterCall = before.slice();
    afterCall[23] -= 2;
    const meld: TanyaoMeld = { kind: "pon", tiles: ["6s", "6s", "6s"] };
    const decision = evaluateTanyaoCallDecision(before, [], afterCall, meld, before.map((count) => 4 - count));
    expect(decision.call).toBe(true);
    expect(decision.afterShanten).toBeLessThan(decision.beforeShanten);
    expect(decision.discardedTile).toBe("9s");
  });

  it("never declares riichi", () => {
    expect(shouldTanyaoRiichi()).toBe(false);
  });
});

describe("tanyao four-player simulation", () => {
  it("aggregates reach order and shape/open details with valid denominators", () => {
    const trials: ChantaTrialResult[] = [
      {
        outcome: "targetWin",
        targetMeldCount: 1,
        targetChiCount: 1,
        targetPonCount: 0,
        winMethod: "ron",
        tanyaoWinShape: "STANDARD",
        tanyaoInitialTerminalHonorCount: 3,
        tanyaoMinimumTerminalHonorCount: 0,
        tanyaoMaximumCompletedSimpleMeldCount: 4,
        tanyaoMaximumSimpleTaatsuCount: 3,
        tanyaoMaximumRyanmenTaatsuCount: 2,
        tanyaoWaitKindCountAtTenpai: 2,
        tanyaoWaitLiveCountAtTenpai: 6,
        tanyaoSkippedNonTargetWinCount: 1,
        progress: {
          reachedTargetIishanten: true,
          reachedTargetTenpai: true,
          reachedTargetWin: true,
          firstIishantenTurn: 2,
          firstTenpaiTurn: 4,
          winTurn: 7,
        },
      },
      {
        outcome: "draw",
        targetMeldCount: 0,
        targetChiCount: 0,
        targetPonCount: 0,
        tanyaoInitialTerminalHonorCount: 5,
        tanyaoMinimumTerminalHonorCount: 1,
        tanyaoMaximumCompletedSimpleMeldCount: 2,
        tanyaoMaximumSimpleTaatsuCount: 4,
        tanyaoMaximumRyanmenTaatsuCount: 3,
        tanyaoSkippedNonTargetWinCount: 0,
        progress: { reachedTargetIishanten: true, reachedTargetTenpai: false, reachedTargetWin: false },
      },
      {
        outcome: "invalid",
        targetMeldCount: 0,
        progress: { reachedTargetIishanten: false, reachedTargetTenpai: false, reachedTargetWin: false },
      },
    ];
    const result = aggregateTanyaoTrials(trials);
    expect(result.validTrials).toBe(2);
    expect(result.winRate).toBeLessThanOrEqual(result.tenpaiRate);
    expect(result.tenpaiRate).toBeLessThanOrEqual(result.iishantenRate);
    expect(result.closedWinCount + result.openWinCount).toBe(result.winCount);
    expect(result.details?.tanyao?.standardWinCount).toBe(1);
    expect(result.details?.tanyao?.chiitoitsuWinCount).toBe(0);
    expect(result.details?.tanyao?.openTanyaoEnabled).toBe(true);
    expect(result.details?.tanyao?.riichiCount).toBe(0);
  });

  it("repeats the shared-table simulation for the same seed", () => {
    const input = {
      initialHand: parseHand("23m345m456p67s55p9s"),
      trials: 2,
      seed: 20260718,
      debug: true,
    };
    const first = runTanyaoSimulation(input);
    expect(first).toEqual(runTanyaoSimulation(input));
    expect(first.validTrials).toBe(2);
    expect(first.invalidTrials).toBe(0);
    expect(first.aiVersion).toMatch(/^tanyao-ai-/);
    expect(first.details?.tanyao?.openTanyaoEnabled).toBe(true);
    expect(first.debugTrials?.[0]?.some((turn) => turn.tanyaoWaits != null)).toBe(true);
  });
});
