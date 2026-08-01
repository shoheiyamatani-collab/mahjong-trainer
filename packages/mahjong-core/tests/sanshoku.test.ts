import { describe, expect, it } from "vitest";
import {
  aggregateSanshokuTrials,
  analyzeSanshokuDiscards,
  classifySanshokuWin,
  countOpenSanshokuMelds,
  emptyCounts,
  evaluateSanshokuCandidates,
  evaluateSanshokuProgress,
  isSanshokuCompatibleMeld,
  isSanshokuComplete,
  parseHand,
  runSanshokuSimulation,
  sanshokuShanten,
  sanshokuWinningTiles,
  shouldSanshokuRiichi,
  type ChantaTrialResult,
  type SanshokuMeld,
  type SanshokuSequenceStart,
} from "../src";

function requiredHand(start: SanshokuSequenceStart): string {
  const sequence = `${start}${start + 1}${start + 2}`;
  return `${sequence}m${sequence}p${sequence}s777m東東`;
}

describe("sanshoku structural completion", () => {
  it.each([1, 2, 3, 4, 5, 6, 7] as SanshokuSequenceStart[])(
    "recognizes %s-start sanshoku",
    (start) => {
      expect(classifySanshokuWin(parseHand(requiredHand(start)))).toMatchObject({
        type: "SANSHOKU",
        sequenceStart: start,
      });
    },
  );

  it("finds a valid sanshoku decomposition among multiple decompositions", () => {
    expect(classifySanshokuWin(parseHand("112233m123p123s77p"))).toMatchObject({
      type: "SANSHOKU",
      sequenceStart: 1,
    });
  });

  it.each([
    "123m234p345s777m東東",
    "123m123p777s777m東東",
    "555m555p555s777m東東",
    "112233m445566p77s",
  ])("rejects mismatched sequences, two suits, triplets, and chiitoitsu: %s", (hand) => {
    expect(isSanshokuComplete(parseHand(hand))).toBe(false);
  });

  it("supports one, two, and three required open sequences", () => {
    const one: SanshokuMeld[] = [{ kind: "chi", tiles: ["3m", "4m", "5m"] }];
    const two: SanshokuMeld[] = [...one, { kind: "chi", tiles: ["3p", "4p", "5p"] }];
    const three: SanshokuMeld[] = [...two, { kind: "chi", tiles: ["3s", "4s", "5s"] }];
    expect(isSanshokuComplete(parseHand("345p345s777m東東"), one)).toBe(true);
    expect(isSanshokuComplete(parseHand("345s777m東東"), two)).toBe(true);
    expect(isSanshokuComplete(parseHand("777m東東"), three)).toBe(true);
    expect(countOpenSanshokuMelds(three, 3)).toEqual({ required: 3, extra: 0 });
  });

  it("supports one extra meld and rejects a second fixed extra meld", () => {
    const whitePon: SanshokuMeld = { kind: "pon", tiles: ["白", "白", "白"] };
    const eastPon: SanshokuMeld = { kind: "pon", tiles: ["東", "東", "東"] };
    expect(isSanshokuComplete(parseHand("345m345p345s東東"), [whitePon])).toBe(true);
    expect(evaluateSanshokuCandidates(parseHand("345m345p345s"), [whitePon, eastPon])
      .some((candidate) => candidate.possible)).toBe(false);
  });

  it("can assign differently numbered open sequences as required plus extra", () => {
    const melds: SanshokuMeld[] = [
      { kind: "chi", tiles: ["3m", "4m", "5m"] },
      { kind: "chi", tiles: ["6p", "7p", "8p"] },
    ];
    expect(isSanshokuComplete(parseHand("345p345s東東"), melds)).toBe(true);
    expect(countOpenSanshokuMelds(melds, 3)).toEqual({ required: 1, extra: 1 });
  });
});

describe("sanshoku candidates, shanten, waits, and policy", () => {
  it("distinguishes completion, live tenpai, and target iishanten", () => {
    expect(sanshokuShanten(parseHand("345m345p345s777m東東"))).toBe(-1);
    const tenpai = parseHand("345m345p34s777m東東");
    expect(sanshokuShanten(tenpai)).toBe(0);
    expect(sanshokuWinningTiles(tenpai)).toEqual(["5s"]);
    expect(evaluateSanshokuProgress(tenpai).isTenpai).toBe(true);

    const iishanten = parseHand("345m345p3s777m東東6s");
    expect(sanshokuShanten(iishanten)).toBe(1);
    expect(evaluateSanshokuProgress(iishanten).isIishanten).toBe(true);
  });

  it("chooses the strongest start from all three suits rather than one completed suit", () => {
    const best = evaluateSanshokuCandidates(parseHand("345m34p35s777p東東5m"))[0];
    expect(best?.sequenceStart).toBe(3);
    expect(best?.minimumSuitProgress).toBe(2);
  });

  it("honors an explicitly locked target start", () => {
    const hand = parseHand("345m34p35s567m56p57s東");
    expect(evaluateSanshokuProgress(hand, [], undefined, 3).bestCandidate?.sequenceStart).toBe(3);
    expect(evaluateSanshokuProgress(hand, [], undefined, 5).bestCandidate?.sequenceStart).toBe(5);
  });

  it("does not count a dead target wait as live tenpai", () => {
    const hand = parseHand("345m345p34s777m東東");
    const evaluation = evaluateSanshokuProgress(hand, [], emptyCounts());
    expect(evaluation.isTenpai).toBe(false);
    expect(evaluation.isPossible).toBe(false);
  });

  it("keeps all three target-suit blocks and discards an unrelated tile", () => {
    const hand = parseHand("345m34p35s777p東東北6m");
    expect(["6m", "北"]).toContain(analyzeSanshokuDiscards(hand)[0]?.tile);
  });

  it("accepts calls only while a four-meld slot plan remains", () => {
    const extra: SanshokuMeld[] = [{ kind: "pon", tiles: ["白", "白", "白"] }];
    expect(isSanshokuCompatibleMeld({ kind: "chi", tiles: ["3m", "4m", "5m"] }, extra, 3)).toBe(true);
    expect(isSanshokuCompatibleMeld({ kind: "pon", tiles: ["東", "東", "東"] }, extra)).toBe(false);
  });

  it("never declares riichi", () => {
    expect(shouldSanshokuRiichi()).toBe(false);
  });
});

describe("sanshoku shared simulation", () => {
  it("aggregates target progress and sequence-start wins over valid trials", () => {
    const trials: ChantaTrialResult[] = [
      {
        outcome: "targetWin",
        targetMeldCount: 1,
        targetChiCount: 1,
        targetPonCount: 0,
        sanshokuWinSequenceStart: 3,
        sanshokuOpenRequiredSequenceCount: 1,
        sanshokuOpenExtraMeldCount: 0,
        sanshokuMaximumCompletedRequiredSequenceCount: 3,
        sanshokuWaitKindCountAtTenpai: 2,
        sanshokuWaitLiveCountAtTenpai: 6,
        sanshokuSkippedNonTargetWinCount: 1,
        winMethod: "ron",
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
        sanshokuOpenRequiredSequenceCount: 0,
        sanshokuOpenExtraMeldCount: 0,
        sanshokuMaximumCompletedRequiredSequenceCount: 2,
        sanshokuWaitKindCountAtTenpai: 1,
        sanshokuWaitLiveCountAtTenpai: 3,
        sanshokuSkippedNonTargetWinCount: 0,
        progress: {
          reachedTargetIishanten: true,
          reachedTargetTenpai: true,
          reachedTargetWin: false,
          firstIishantenTurn: 3,
          firstTenpaiTurn: 6,
        },
      },
      {
        outcome: "invalid",
        targetMeldCount: 0,
        progress: { reachedTargetIishanten: false, reachedTargetTenpai: false, reachedTargetWin: false },
      },
    ];
    const result = aggregateSanshokuTrials(trials);

    expect(result.validTrials).toBe(2);
    expect(result.winRate).toBeLessThanOrEqual(result.tenpaiRate);
    expect(result.tenpaiRate).toBeLessThanOrEqual(result.iishantenRate);
    expect(result.closedWinCount + result.openWinCount).toBe(result.winCount);
    expect(result.details?.sanshoku?.sequence345WinCount).toBe(1);
    expect(result.details?.sanshoku?.averageMaximumCompletedRequiredSequenceCount).toBe(2.5);
    expect(result.details?.sanshoku?.riichiCount).toBe(0);
  });

  it("repeats the shared-table simulation for the same seed", () => {
    const input = {
      initialHand: parseHand("345m34p35s777p東東5m"),
      trials: 2,
      seed: 20260718,
      debug: true,
    };
    const first = runSanshokuSimulation(input);

    expect(first).toEqual(runSanshokuSimulation(input));
    expect(first.validTrials).toBe(2);
    expect(first.invalidTrials).toBe(0);
    expect(first.aiVersion).toMatch(/^sanshoku-ai-/);
    expect(first.debugTrials?.[0]?.some((turn) => turn.sanshokuCandidates != null)).toBe(true);
  });
});
