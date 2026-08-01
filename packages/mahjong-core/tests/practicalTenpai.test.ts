import { describe, expect, it } from "vitest";
import {
  aggregatePracticalTenpaiMetrics,
  calculatePracticalTenpaiTrialScore,
  practicalTenpaiTurnWeight,
  type PracticalTenpaiScoreInput,
} from "../src";

const before = (turn: number): PracticalTenpaiScoreInput => ({
  reachedTargetTenpai: true,
  firstTargetTenpaiTurn: turn,
  firstTargetTenpaiEventOrder: 10,
  firstOpponentRiichiEventOrder: null,
});

const after = (turn: number): PracticalTenpaiScoreInput => ({
  ...before(turn),
  firstOpponentRiichiEventOrder: 5,
});

describe("practical tenpai trial scoring", () => {
  it.each([
    [0, 1], [1, 1], [6, 1], [7, 0.85], [9, 0.85], [10, 0.65], [12, 0.65],
    [13, 0.35], [15, 0.35], [16, 0.15], [18, 0.15],
  ])("uses the configured turn weight at turn %s", (turn, expected) => {
    expect(practicalTenpaiTurnWeight(turn)).toBe(expected);
  });

  it("returns zero for an unreached tenpai", () => {
    expect(calculatePracticalTenpaiTrialScore({
      reachedTargetTenpai: false,
      firstTargetTenpaiTurn: null,
      firstTargetTenpaiEventOrder: null,
      firstOpponentRiichiEventOrder: 2,
    })).toEqual({ turnWeight: 0, situationWeight: 0, trialScore: 0, situation: "NOT_REACHED" });
  });

  it.each([
    [before(8), 0.85, "BEFORE_OPPONENT_RIICHI"],
    [after(8), 0.34, "AFTER_OPPONENT_RIICHI"],
    [before(11), 0.65, "BEFORE_OPPONENT_RIICHI"],
    [after(11), 0.26, "AFTER_OPPONENT_RIICHI"],
    [before(13), 0.35, "BEFORE_OPPONENT_RIICHI"],
    [after(13), 0.14, "AFTER_OPPONENT_RIICHI"],
    [before(16), 0.15, "BEFORE_OPPONENT_RIICHI"],
    [after(16), 0.06, "AFTER_OPPONENT_RIICHI"],
  ] as const)("scores turn and situation weights", (input, expected, situation) => {
    const result = calculatePracticalTenpaiTrialScore(input);
    expect(result.trialScore).toBeCloseTo(expected, 12);
    expect(result.situation).toBe(situation);
  });

  it("uses event order when tenpai and riichi happen in the same turn", () => {
    expect(calculatePracticalTenpaiTrialScore({ ...before(8), firstTargetTenpaiEventOrder: 4, firstOpponentRiichiEventOrder: 5 }).situation)
      .toBe("BEFORE_OPPONENT_RIICHI");
    expect(calculatePracticalTenpaiTrialScore({ ...before(8), firstTargetTenpaiEventOrder: 6, firstOpponentRiichiEventOrder: 5 }).situation)
      .toBe("AFTER_OPPONENT_RIICHI");
  });
});

describe("practical tenpai aggregation", () => {
  it("averages reached and unreached trials into a 0-100 score", () => {
    const metrics = aggregatePracticalTenpaiMetrics([
      before(8), before(11), after(13), {
        reachedTargetTenpai: false,
        firstTargetTenpaiTurn: null,
        firstTargetTenpaiEventOrder: null,
        firstOpponentRiichiEventOrder: null,
      },
    ]);
    expect(metrics.totalPracticalTenpaiTrialScore).toBeCloseTo(1.64, 12);
    expect(metrics.practicalTenpaiScore).toBeCloseTo(41, 12);
  });

  it("calculates cumulative, preemptive, chasing, and distribution rates", () => {
    const metrics = aggregatePracticalTenpaiMetrics([
      before(0), before(7), after(9), before(10), after(12), before(15), after(16), {
        reachedTargetTenpai: false,
        firstTargetTenpaiTurn: null,
        firstTargetTenpaiEventOrder: null,
        firstOpponentRiichiEventOrder: null,
      },
    ]);
    expect(metrics.tenpaiByTurn6Rate).toBe(1 / 8);
    expect(metrics.tenpaiByTurn8Rate).toBe(2 / 8);
    expect(metrics.tenpaiByTurn10Rate).toBe(4 / 8);
    expect(metrics.tenpaiByTurn12Rate).toBe(5 / 8);
    expect(metrics.tenpaiByTurn15Rate).toBe(6 / 8);
    expect(metrics.rawTenpaiRate).toBe(7 / 8);
    expect(metrics.preemptiveTenpaiCount).toBe(4);
    expect(metrics.chasingTenpaiCount).toBe(3);
    expect(metrics.preemptiveTenpaiRate + metrics.chasingTenpaiRate).toBe(metrics.rawTenpaiRate);
  });
});
