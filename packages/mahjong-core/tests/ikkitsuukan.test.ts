import { describe, expect, it } from "vitest";
import {
  analyzeIkkitsuukanDiscards,
  aggregateIkkitsuukanTrials,
  classifyIkkitsuukanWin,
  countOpenIkkitsuukanMelds,
  emptyCounts,
  evaluateIkkitsuukanCandidates,
  evaluateIkkitsuukanProgress,
  ikkitsuukanShanten,
  ikkitsuukanWinningTiles,
  isIkkitsuukanCompatibleMeld,
  isIkkitsuukanComplete,
  lockedIkkitsuukanSuit,
  parseHand,
  runIkkitsuukanSimulation,
  type ChantaTrialResult,
  type IkkitsuukanMeld,
} from "../src";

describe("ikkitsuukan completion decomposition", () => {
  it.each([
    ["123456789m777p東東", "MAN"],
    ["123456789p111s55m", "PIN"],
    ["123456789s777m白白", "SOU"],
  ] as const)("finds a closed %s straight", (hand, suit) => {
    expect(classifyIkkitsuukanWin(parseHand(hand))).toEqual({ type: "IKKITSUUKAN", suit });
  });

  it("finds the straight in any valid decomposition", () => {
    expect(isIkkitsuukanComplete(parseHand("11223345678999m"))).toBe(true);
  });

  it("supports one or all required sequences being open", () => {
    const oneOpen: IkkitsuukanMeld[] = [{ kind: "chi", tiles: ["1m", "2m", "3m"] }];
    const allOpen: IkkitsuukanMeld[] = [
      { kind: "chi", tiles: ["1m", "2m", "3m"] },
      { kind: "chi", tiles: ["4m", "5m", "6m"] },
      { kind: "chi", tiles: ["7m", "8m", "9m"] },
    ];

    expect(isIkkitsuukanComplete(parseHand("456789m777p東東"), oneOpen)).toBe(true);
    expect(isIkkitsuukanComplete(parseHand("777p東東"), allOpen)).toBe(true);
  });

  it("allows the extra meld and pair to use another suit or honors", () => {
    const melds: IkkitsuukanMeld[] = [{ kind: "pon", tiles: ["白", "白", "白"] }];
    expect(isIkkitsuukanComplete(parseHand("123456789m東東"), melds)).toBe(true);
  });

  it.each([
    "123m456p789s777m東東",
    "123456m777p111s東東",
    "123789m777p111s東東",
    "456789m777p111s東東",
    "11223344556677m",
    "123456789m1111p東",
  ])("rejects a non-straight or invalid completion: %s", (hand) => {
    expect(isIkkitsuukanComplete(parseHand(hand))).toBe(false);
  });
});

describe("ikkitsuukan meld slots and suit locking", () => {
  it("locks only after a required sequence call", () => {
    const required: IkkitsuukanMeld[] = [{ kind: "chi", tiles: ["1m", "2m", "3m"] }];
    const honor: IkkitsuukanMeld[] = [{ kind: "pon", tiles: ["白", "白", "白"] }];

    expect(lockedIkkitsuukanSuit(required)).toBe("MAN");
    expect(lockedIkkitsuukanSuit(honor)).toBeNull();
    expect(countOpenIkkitsuukanMelds(required, "MAN")).toEqual({ required: 1, extra: 0 });
  });

  it("rejects conflicting required colors and a second extra meld", () => {
    const conflicting: IkkitsuukanMeld[] = [
      { kind: "chi", tiles: ["1m", "2m", "3m"] },
      { kind: "chi", tiles: ["4p", "5p", "6p"] },
    ];
    const twoExtra: IkkitsuukanMeld[] = [
      { kind: "pon", tiles: ["白", "白", "白"] },
      { kind: "pon", tiles: ["東", "東", "東"] },
    ];

    expect(lockedIkkitsuukanSuit(conflicting)).toBe("CONFLICT");
    expect(evaluateIkkitsuukanCandidates(parseHand("456789m東東"), conflicting)).toHaveLength(0);
    expect(evaluateIkkitsuukanCandidates(parseHand("123456789m"), twoExtra).some((item) => item.possible)).toBe(false);
  });

  it("accepts only calls that leave a valid four-meld slot plan", () => {
    const existing: IkkitsuukanMeld[] = [{ kind: "pon", tiles: ["白", "白", "白"] }];
    expect(isIkkitsuukanCompatibleMeld({ kind: "chi", tiles: ["1m", "2m", "3m"] }, existing)).toBe(true);
    expect(isIkkitsuukanCompatibleMeld({ kind: "pon", tiles: ["東", "東", "東"] }, existing)).toBe(false);
  });
});

describe("ikkitsuukan shanten, live waits, and discards", () => {
  it("uses a constrained shanten distinct from ordinary completion", () => {
    expect(ikkitsuukanShanten(parseHand("123456789m777p東東"))).toBe(-1);
    expect(ikkitsuukanShanten(parseHand("123456789m777p東"))).toBe(0);
    expect(ikkitsuukanShanten(parseHand("1234567m777p東東5s"))).toBe(1);
  });

  it("selects the structurally strongest suit rather than raw total tile count", () => {
    const best = evaluateIkkitsuukanCandidates(parseHand("12345678m11p22p3p"))[0];
    expect(best?.suit).toBe("MAN");
    expect(best?.completedRequiredSequenceCount).toBe(2);
  });

  it("counts only live target waits", () => {
    const hand = parseHand("123456789m777p東");
    expect(ikkitsuukanWinningTiles(hand)).toEqual(["東"]);
    expect(evaluateIkkitsuukanProgress(hand).isTenpai).toBe(true);
    expect(evaluateIkkitsuukanProgress(hand, [], emptyCounts()).isTenpai).toBe(false);
  });

  it("keeps only the high tile when another ordinary wait loses the straight", () => {
    const hand = parseHand("12345678m777p東東");
    expect(ikkitsuukanWinningTiles(hand)).toEqual(["9m"]);
  });

  it("recognizes an open live target wait", () => {
    const melds: IkkitsuukanMeld[] = [{ kind: "chi", tiles: ["1m", "2m", "3m"] }];
    const hand = parseHand("45678m777p東東");
    expect(ikkitsuukanWinningTiles(hand, melds)).toEqual(["9m"]);
    expect(evaluateIkkitsuukanProgress(hand, melds).isTenpai).toBe(true);
  });

  it("keeps the required straight and removes an unrelated tile", () => {
    const choices = analyzeIkkitsuukanDiscards(parseHand("12345678m777p東東5s"));
    expect(choices[0]?.tile).toBe("5s");
    expect(choices[0]?.bestSuit).toBe("MAN");
  });
});

describe("ikkitsuukan four-player simulation", () => {
  it("aggregates suit and open-meld details with valid-trial denominators", () => {
    const trials: ChantaTrialResult[] = [
      {
        outcome: "targetWin",
        targetMeldCount: 1,
        winMethod: "ron",
        ikkitsuukanWinSuit: "MAN",
        openRequiredSequenceCount: 1,
        openExtraMeldCount: 0,
        maximumCompletedRequiredSequenceCount: 3,
        progress: {
          reachedTargetIishanten: true,
          reachedTargetTenpai: true,
          reachedTargetWin: true,
          firstIishantenTurn: 2,
          firstTenpaiTurn: 4,
          winTurn: 6,
        },
      },
      {
        outcome: "draw",
        targetMeldCount: 0,
        openRequiredSequenceCount: 0,
        openExtraMeldCount: 0,
        maximumCompletedRequiredSequenceCount: 2,
        progress: { reachedTargetIishanten: true, reachedTargetTenpai: false, reachedTargetWin: false },
      },
      {
        outcome: "invalid",
        targetMeldCount: 0,
        progress: { reachedTargetIishanten: false, reachedTargetTenpai: false, reachedTargetWin: false },
      },
    ];
    const result = aggregateIkkitsuukanTrials(trials);

    expect(result.validTrials).toBe(2);
    expect(result.winRate).toBe(0.5);
    expect(result.winRate).toBeLessThanOrEqual(result.tenpaiRate);
    expect(result.tenpaiRate).toBeLessThanOrEqual(result.iishantenRate);
    expect(result.closedWinCount + result.openWinCount).toBe(result.winCount);
    expect(result.details?.ikkitsuukan?.manSuitWinCount).toBe(1);
    expect(result.details?.ikkitsuukan?.averageMaximumCompletedRequiredSequenceCount).toBe(2.5);
  });

  it("repeats the shared-table simulation for the same seed", () => {
    const input = {
      initialHand: parseHand("12345678m112p3s白"),
      trials: 2,
      seed: 20260718,
      debug: true,
    };
    const first = runIkkitsuukanSimulation(input);

    expect(first).toEqual(runIkkitsuukanSimulation(input));
    expect(first.validTrials).toBe(2);
    expect(first.invalidTrials).toBe(0);
    expect(first.aiVersion).toMatch(/^ikkitsuukan-ai-/);
    expect(first.debugTrials?.[0]?.some((turn) => turn.ikkitsuukanCandidates != null)).toBe(true);
  });
});
