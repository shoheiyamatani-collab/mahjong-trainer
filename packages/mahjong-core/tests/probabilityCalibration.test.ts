import { describe, expect, it } from "vitest";
import { assertDisjointGamePartitions, evaluateProbabilityCalibration, type ProbabilityObservation } from "../src";

const observation = (id: string, probability: number, observed: boolean): ProbabilityObservation => ({ id, gameId: `game-${id}`, probability, observed });

describe("probability calibration measurements", () => {
  it("measures perfect predictions including p=0 and p=1 without NaN", () => {
    const report = evaluateProbabilityCalibration([observation("1", 1, true), observation("2", 0, false)]);
    expect(report.brierScore).toBe(0); expect(report.logLoss).toBe(0); expect(report.expectedCalibrationError).toBe(0);
    expect(report.bins[0]!.samples).toBe(1); expect(report.bins[9]!.samples).toBe(1);
    expect(JSON.parse(JSON.stringify(report))).toEqual(report);
  });
  it("reports impossible predictions explicitly rather than clipping them invisibly", () => {
    const report = evaluateProbabilityCalibration([observation("1", 0, true), observation("2", 1, false)]);
    expect(report.brierScore).toBe(1); expect(report.logLoss).toBeNull(); expect(report.impossiblePredictions).toBe(2);
  });
  it("calculates known Brier and natural-log loss values", () => {
    const report = evaluateProbabilityCalibration([observation("1", 0.8, true), observation("2", 0.3, false)], 2);
    expect(report.brierScore).toBeCloseTo(0.065);
    expect(report.logLoss).toBeCloseTo(-(Math.log(0.8) + Math.log(0.7)) / 2);
    expect(report.expectedCalibrationError).toBeCloseTo(0.25);
    expect(report.games).toBe(2);
  });
  it("does not confuse 50% outcome frequency with zero prediction error", () => {
    const report = evaluateProbabilityCalibration([observation("1", 0.5, true), observation("2", 0.5, false)]);
    expect(report.expectedCalibrationError).toBe(0); expect(report.brierScore).toBe(0.25);
    expect(report.logLoss).toBeCloseTo(Math.log(2));
  });
  it("returns null for empty bins and an empty data set", () => {
    const report = evaluateProbabilityCalibration([]);
    expect(report.brierScore).toBeNull(); expect(report.expectedCalibrationError).toBeNull();
    expect(report.bins.every((bin) => bin.observedRate === null && bin.meanProbability === null)).toBe(true);
  });
  it.each([NaN, Infinity, -0.1, 1.1])("rejects invalid probability %s", (p) => {
    expect(() => evaluateProbabilityCalibration([observation("1", p, true)])).toThrow();
  });
  it("rejects repeated observations and invalid bins", () => {
    const row = observation("1", 0.1, false);
    expect(() => evaluateProbabilityCalibration([row, row])).toThrow(/unique/);
    expect(() => evaluateProbabilityCalibration([], 0)).toThrow();
    expect(() => evaluateProbabilityCalibration([], 101)).toThrow();
  });
  it("counts games independently of multiple observations per game", () => {
    const report = evaluateProbabilityCalibration([{ ...observation("1", 0.1, false), gameId: "game" }, { ...observation("2", 0.2, false), gameId: "game" }]);
    expect(report.games).toBe(1); expect(report.samples).toBe(2);
  });
  it("accepts disjoint train/calibration/test games and rejects leakage", () => {
    expect(() => assertDisjointGamePartitions({ train: ["a"], calibration: ["b"], test: ["c"] })).not.toThrow();
    expect(() => assertDisjointGamePartitions({ train: ["a"], calibration: ["b"], test: ["a"] })).toThrow(/leaks/);
    expect(() => assertDisjointGamePartitions({ train: ["a", "a"], calibration: [], test: [] })).toThrow(/unique/);
  });
});
