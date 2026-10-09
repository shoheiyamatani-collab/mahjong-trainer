import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import oracle from "./fixtures/scoringOracle.json";
import { SCORING_CASES_SEED, SCORING_CASES_VERSION, coreScoringOutcome, curatedScoringCases, generatedScoringCases } from "./support/scoringReferenceCases";

const cases = [...curatedScoringCases(), ...generatedScoringCases(2000)];

describe("independent hand-score oracle", () => {
  it("pins the reference version and exact input corpus", () => {
    expect(oracle.reference).toBe("MahjongRepository/mahjong"); expect(oracle.version).toBe("2.0.0");
    expect(oracle.casesVersion).toBe(SCORING_CASES_VERSION); expect(oracle.seed).toBe(SCORING_CASES_SEED);
    expect(createHash("sha256").update(JSON.stringify(cases)).digest("hex")).toBe(oracle.corpusSha256);
  });
  it("matches han, fu, yakuman multiplicity, total and payer amounts across 2046 independent cases", () => {
    expect(cases).toHaveLength(2046); expect(oracle.results).toHaveLength(cases.length);
    for (const [index, test] of cases.entries()) {
      const row = oracle.results[index]!;
      expect(row.id).toBe(test.id);
      expect(coreScoringOutcome(test.input), test.id).toEqual(row.expected);
    }
  });
  it("does not mutate caller input when enumerating winning-tile assignments", () => {
    const original = structuredClone(cases);
    for (const test of cases) coreScoringOutcome(test.input);
    expect(cases).toEqual(original);
  });
});
