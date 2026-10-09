import { describe, expect, it } from "vitest";
import {
  ORASU_SEATS, addMoment, createSeededRandom, emptyMoments, estimateMean,
  evaluatePairedPushFold, mergeMoments, settlePushFoldRound,
  type EvaluationBranch, type EvaluationExperiment, type EvaluationRoundContext,
  type EvaluationWinClaim, type OrasuSeat, type PairedEvaluationTrial
} from "../src";

const context = (patch: Partial<EvaluationRoundContext> = {}): EvaluationRoundContext => ({
  scores: { east: 25000, south: 25000, west: 25000, north: 25000 }, dealer: "east",
  honba: 0, kyotaku: 0, existingRiichi: [],
  rules: { id: "fixture-multiple", ronResolution: "multiple", tripleRon: "allow" }, ...patch
});
const claim = (winner: OrasuSeat, han = 4, fu = 30): EvaluationWinClaim => ({ winner, han, fu });
const ron = (from: OrasuSeat, winner: OrasuSeat, acceptedRiichi: OrasuSeat[] = []): EvaluationBranch => ({ acceptedRiichi, terminal: { kind: "ron", from, claims: [claim(winner)] } });
const draw = (tenpai: OrasuSeat[] = [], acceptedRiichi: OrasuSeat[] = []): EvaluationBranch => ({ acceptedRiichi, terminal: { kind: "exhaustive-draw", tenpai } });
const experiment = (plannedTrials = 2): EvaluationExperiment => ({
  positionId: "fixture-1", publicStateHash: "fixture-hash", opponentModelVersion: "synthetic-v1",
  policyVersions: { push: "push-v1", fold: "fold-v1" }, source: "synthetic-fixture", seed: "test-1",
  sampling: "iid-fixed-budget", plannedTrials, self: "south", context: context(),
  payoffSupport: { push: { lower: -50000, upper: 50000 }, fold: { lower: -50000, upper: 50000 } }
});
const pair = (id: string, push: EvaluationBranch, fold: EvaluationBranch): PairedEvaluationTrial => ({ id, worldId: `world-${id}`, push, fold });

describe("push/fold point ledger", () => {
  it("settles child ron with honba and one pool award", () => {
    const result = settlePushFoldRound(context({ honba: 2, kyotaku: 3, existingRiichi: ["west"] }), ron("east", "south"));
    expect(result.deltas).toEqual({ east: -8300, south: 11300, west: 0, north: 0 });
    expect(result.winReceipts.south).toBe(8300);
    expect(result.kyotakuReceipts.south).toBe(3000);
    expect(result.kyotaku).toBe(0);
    expect(result.dealerContinues).toBe(false);
    expect(result.nextHonba).toBe(0);
  });
  it("settles dealer ron and continues the dealer", () => {
    const result = settlePushFoldRound(context({ honba: 1 }), ron("south", "east"));
    expect(result.deltas.east).toBe(11900);
    expect(result.deltas.south).toBe(-11900);
    expect(result.dealerContinues).toBe(true);
    expect(result.nextHonba).toBe(2);
  });
  it("uses the configured dealer, not necessarily east, for child tsumo", () => {
    const result = settlePushFoldRound(context({ dealer: "west", honba: 1 }), { acceptedRiichi: [], terminal: { kind: "tsumo", claim: claim("south") } });
    expect(result.deltas).toEqual({ east: -2100, south: 8200, west: -4000, north: -2100 });
    expect(result.nextHonba).toBe(0);
  });
  it("settles dealer tsumo equally among three opponents", () => {
    const result = settlePushFoldRound(context({ dealer: "north", honba: 2 }), { acceptedRiichi: [], terminal: { kind: "tsumo", claim: claim("north") } });
    expect(result.deltas).toEqual({ east: -4100, south: -4100, west: -4100, north: 12300 });
    expect(result.nextHonba).toBe(3);
  });
  it("returns an accepted own stick on self win without inventing an extra 1000 points", () => {
    const result = settlePushFoldRound(context({ kyotaku: 2 }), ron("west", "south", ["south"]));
    expect(result.riichiCosts.south).toBe(1000);
    expect(result.kyotakuReceipts.south).toBe(3000);
    expect(result.deltas.south).toBe(9700);
  });
  it("includes an earlier accepted riichi deposit when that player later deals in", () => {
    const result = settlePushFoldRound(context(), ron("south", "west", ["south"]));
    expect(result.deltas.south).toBe(-8700);
    expect(result.deltas.west).toBe(8700);
  });
  it("does not charge an unaccepted declaration tile dealt in", () => {
    const result = settlePushFoldRound(context(), { ...ron("south", "west"), unacceptedDeclaration: "south" });
    expect(result.deltas.south).toBe(-7700);
    expect(result.riichiCosts.south).toBe(0);
  });
  it("rejects inconsistent pending declaration metadata", () => {
    expect(() => settlePushFoldRound(context(), { ...ron("south", "west", ["south"]), unacceptedDeclaration: "south" })).toThrow(/unaccepted/);
    expect(() => settlePushFoldRound(context(), { ...ron("south", "west"), unacceptedDeclaration: "east" })).toThrow(/unaccepted/);
    expect(() => settlePushFoldRound(context(), { ...draw(), unacceptedDeclaration: "south" })).toThrow(/unaccepted/);
  });
  it("carries accepted deposits through an exhaustive draw", () => {
    const result = settlePushFoldRound(context({ honba: 2, kyotaku: 1 }), draw(["south"], ["south", "west"]));
    expect(result.deltas).toEqual({ east: -1000, south: 2000, west: -2000, north: -1000 });
    expect(result.kyotaku).toBe(3);
    expect(result.nextHonba).toBe(3);
    expect(result.dealerContinues).toBe(false);
  });
  it.each(Array.from({ length: 16 }, (_, mask) => mask))("conserves points in exhaustive tenpai mask %i", (mask) => {
    const tenpai = ORASU_SEATS.filter((_, index) => mask & (1 << index));
    const result = settlePushFoldRound(context(), draw(tenpai));
    expect(Object.values(result.deltas).reduce((a, b) => a + b, 0)).toBe(0);
    expect(result.dealerContinues).toBe(tenpai.includes("east"));
    const n = tenpai.length;
    for (const seat of ORASU_SEATS) expect(result.drawTransfers[seat]).toBe(n === 0 || n === 4 ? 0 : tenpai.includes(seat) ? 3000 / n : -3000 / (4 - n));
  });
  it("gives a multiple-ron pool only to the closest winner in cyclic order", () => {
    const result = settlePushFoldRound(context({ honba: 1, kyotaku: 2 }), { acceptedRiichi: [], terminal: { kind: "ron", from: "west", claims: [claim("south"), claim("north")] } });
    expect(result.winners).toEqual(["north", "south"]);
    expect(result.deltas).toEqual({ east: 0, south: 8000, west: -16000, north: 10000 });
    expect(result.kyotakuReceipts.south).toBe(0);
  });
  it("resolves head bump before paying the second winner", () => {
    const result = settlePushFoldRound(context({ rules: { id: "head-bump", ronResolution: "head-bump", tripleRon: "allow" }, kyotaku: 1 }), { acceptedRiichi: [], terminal: { kind: "ron", from: "north", claims: [claim("south"), claim("east")] } });
    expect(result.winners).toEqual(["east"]);
    expect(result.deltas).toEqual({ east: 12600, south: 0, west: 0, north: -11600 });
  });
  it("aborts triple ron and carries the pool under that configured rule", () => {
    const result = settlePushFoldRound(context({ rules: { id: "triple-abort", ronResolution: "head-bump", tripleRon: "abort" }, kyotaku: 1 }), { acceptedRiichi: [], terminal: { kind: "ron", from: "north", claims: [claim("south"), claim("east"), claim("west")] } });
    expect(result.kind).toBe("abortive-draw"); expect(result.winners).toEqual([]);
    expect(result.kyotaku).toBe(1); expect(result.dealerContinues).toBe(true);
    expect(Object.values(result.deltas)).toEqual([0, 0, 0, 0]);
  });
  it("settles triple ron when configured to allow it", () => {
    const result = settlePushFoldRound(context({ kyotaku: 2 }), { acceptedRiichi: [], terminal: { kind: "ron", from: "north", claims: [claim("west"), claim("east"), claim("south")] } });
    expect(result.deltas.north).toBe(-27000);
    expect(result.kyotakuReceipts.east).toBe(2000);
    expect(result.dealerContinues).toBe(true);
  });
  it("settles explicit yakuman with the existing scorer", () => {
    const result = settlePushFoldRound(context(), { acceptedRiichi: [], terminal: { kind: "ron", from: "east", claims: [{ winner: "south", han: 0, fu: null, yakumanCount: 2 }] } });
    expect(result.deltas.south).toBe(64000);
    expect(result.scores.east).toBe(-39000);
  });
  it("does not mutate context or branches", () => {
    const input = context(), branch = ron("west", "south", ["south"]), copy = structuredClone({ input, branch });
    settlePushFoldRound(input, branch); expect({ input, branch }).toEqual(copy);
  });
  it.each([NaN, Infinity, -1, 0.5])("rejects invalid honba %s", (honba) => {
    expect(() => settlePushFoldRound(context({ honba }), draw())).toThrow();
  });
  it("rejects invalid score increments, seats, claims and deposits", () => {
    const input = context(); input.scores.south = 25001;
    expect(() => settlePushFoldRound(input, draw())).toThrow(/100-point/);
    expect(() => settlePushFoldRound(context(), draw(["south", "south"]))).toThrow(/repeated/);
    expect(() => settlePushFoldRound(context(), ron("south", "south"))).toThrow(/discarder/);
    expect(() => settlePushFoldRound(context(), { acceptedRiichi: [], terminal: { kind: "ron", from: "east", claims: [] } })).toThrow();
    expect(() => settlePushFoldRound(context(), { acceptedRiichi: [], terminal: { kind: "tsumo", claim: claim("south", 0) } })).toThrow(/No-yaku/);
    expect(() => settlePushFoldRound(context(), { acceptedRiichi: [], terminal: { kind: "tsumo", claim: claim("south", 2, 23) } })).toThrow(/fu/);
    expect(() => settlePushFoldRound(context({ kyotaku: 1, existingRiichi: ["south"] }), draw([], ["south"]))).toThrow(/duplicated/);
    const broke = context(); broke.scores.south = 900;
    expect(() => settlePushFoldRound(broke, draw([], ["south"]))).toThrow(/unaffordable/);
    expect(() => settlePushFoldRound(context({ existingRiichi: ["south"] }), draw())).toThrow(/pool/);
    expect(() => settlePushFoldRound(context({ kyotaku: Number.MAX_SAFE_INTEGER }), draw())).toThrow(/precision/);
    expect(() => settlePushFoldRound(context({ honba: Number.MAX_SAFE_INTEGER }), draw())).toThrow(/nextHonba/);
  });
  it("conserves point mass and ledger entries over 1000 deterministic mixed outcomes", () => {
    const random = createSeededRandom("settlement-properties-v1");
    for (let i = 0; i < 1000; i++) {
      const dealer = ORASU_SEATS[Math.floor(random() * 4)]!, winner = ORASU_SEATS[Math.floor(random() * 4)]!;
      const from = ORASU_SEATS[(ORASU_SEATS.indexOf(winner) + 1 + Math.floor(random() * 3)) % 4]!;
      const input = context({ dealer, honba: Math.floor(random() * 6), kyotaku: Math.floor(random() * 5) });
      const winClaim = claim(winner, 1 + Math.floor(random() * 12), 30 + 10 * Math.floor(random() * 8));
      const terminal: EvaluationBranch["terminal"] = i % 4 === 0 ? { kind: "tsumo", claim: winClaim } : i % 4 === 1 ? { kind: "ron", from, claims: [winClaim] } : i % 4 === 2 ? { kind: "exhaustive-draw", tenpai: ORASU_SEATS.filter(() => random() > 0.5) } : { kind: "abortive-draw", reason: "synthetic-abort" };
      const result = settlePushFoldRound(input, { acceptedRiichi: random() > 0.5 ? ["south"] : [], terminal });
      expect(Object.values(result.scores).reduce((a, b) => a + b, result.kyotaku * 1000)).toBe(100000 + input.kyotaku * 1000);
      for (const seat of ORASU_SEATS) expect(result.deltas[seat]).toBe(-result.riichiCosts[seat] + result.winReceipts[seat] - result.winPayments[seat] + result.drawTransfers[seat] + result.kyotakuReceipts[seat]);
    }
  });
});

describe("statistical evaluation", () => {
  it("calculates and merges stable sample moments", () => {
    const whole = [1, 2, 3, 4].reduce(addMoment, emptyMoments());
    const merged = mergeMoments([1, 2].reduce(addMoment, emptyMoments()), [3, 4].reduce(addMoment, emptyMoments()));
    expect(whole).toEqual({ count: 4, mean: 2.5, m2: 5 }); expect(merged).toEqual(whole);
    expect(estimateMean(whole, { lower: 0, upper: 5 }).sampleVariance).toBeCloseTo(5 / 3);
    expect(mergeMoments(emptyMoments(), whole)).toEqual(whole);
    expect(mergeMoments(whole, emptyMoments())).toEqual(whole);
    expect(() => addMoment(whole, Infinity)).toThrow();
  });
  it("keeps null estimates without data and uses full support for one sample", () => {
    expect(estimateMean(emptyMoments(), { lower: -10, upper: 10 })).toMatchObject({ mean: null, standardError: null, interval: null });
    expect(estimateMean(addMoment(emptyMoments(), 1), { lower: -10, upper: 10 })).toMatchObject({ standardError: null, interval: { lower: -10, upper: 10, method: "support-only" } });
  });
  it("retains nonzero uncertainty even with zero observed variance", () => {
    const moments = Array.from({ length: 100 }, () => 5).reduce(addMoment, emptyMoments());
    const estimate = estimateMean(moments, { lower: 0, upper: 10 });
    expect(estimate.interval!.lower).toBeLessThan(5); expect(estimate.interval!.upper).toBeGreaterThan(5);
    const radius = 7 * 10 * Math.log(80) / (3 * 99);
    expect(estimate.interval!.lower).toBeCloseTo(5 - radius);
  });
  it("does not issue intervals or conclusions at an optional intermediate stop", () => {
    const report = evaluatePairedPushFold(experiment(10), [pair("1", ron("east", "south"), ron("south", "west"))]);
    expect(report.status).toBe("incomplete"); expect(report.difference.interval).toBeNull();
    expect(report.push.outcomes["self-ron"].interval95).toBeNull(); expect(report.monteCarloConclusion).toBe("unresolved");
  });
  it("computes EV, deposit costs and paired differences from settlements", () => {
    const report = evaluatePairedPushFold(experiment(), [pair("1", ron("east", "south", ["south"]), draw()), pair("2", ron("south", "west", ["south"]), draw())]);
    expect(report.push.payoff.mean).toBe(-500); expect(report.fold.payoff.mean).toBe(0); expect(report.difference.mean).toBe(-500);
    expect(report.push.ledgerMeans).toEqual({ riichiCost: 1000, winReceipt: 3850, winPayment: 3850, drawTransfer: 0, kyotakuReceipt: 500 });
    expect(report.push.meanDealInLoss).toBe(7700);
    expect(report.push.outcomes["self-deal-in"].rate).toBe(0.5);
    expect(report.push.outcomes["self-ron"].interval95!.lower).toBeGreaterThan(0);
    expect(report.visibility).toBe("research-only");
    expect(JSON.parse(JSON.stringify(report))).toEqual(report);
  });
  it("uses paired variance rather than incorrectly summing independent variances", () => {
    const report = evaluatePairedPushFold(experiment(), [pair("1", ron("east", "south"), ron("east", "south")), pair("2", ron("south", "west"), ron("south", "west"))]);
    expect(report.push.payoff.sampleVariance).toBeGreaterThan(0); expect(report.difference.sampleVariance).toBe(0);
    expect(report.difference.interval!.upper).toBeGreaterThan(0);
  });
  it("classifies all terminal outcomes and counts tied end-of-round ranks", () => {
    const branches: EvaluationBranch[] = [ron("east", "south"), { acceptedRiichi: [], terminal: { kind: "tsumo", claim: claim("south") } }, ron("south", "west"), { acceptedRiichi: [], terminal: { kind: "tsumo", claim: claim("west") } }, ron("east", "west"), draw(), { acceptedRiichi: [], terminal: { kind: "abortive-draw", reason: "fixture" } }];
    const report = evaluatePairedPushFold(experiment(7), branches.map((branch, index) => pair(String(index), branch, branch)));
    expect(Object.values(report.push.outcomes).map((entry) => entry.events)).toEqual([1, 1, 1, 1, 1, 1, 1]);
    expect(Object.values(report.push.endOfRoundRank).reduce((a, b) => a + b)).toBe(7);
    expect(report.push.tiedRounds).toBeGreaterThanOrEqual(2);
  });
  it("can resolve a conditional Monte Carlo difference with a predeclared fixed budget", () => {
    const input = experiment(10000);
    const trials = Array.from({ length: input.plannedTrials }, (_, i) => pair(String(i), ron("east", "south"), draw()));
    expect(evaluatePairedPushFold(input, trials).monteCarloConclusion).toBe("push-higher");
    expect(evaluatePairedPushFold(input, trials.map((trial) => ({ ...trial, push: trial.fold, fold: trial.push }))).monteCarloConclusion).toBe("fold-higher");
  });
  it("rejects duplicate trials/worlds, budget excess and out-of-support observations", () => {
    const trial = pair("1", draw(), draw());
    expect(() => evaluatePairedPushFold(experiment(), [trial, trial])).toThrow(/unique/);
    expect(() => evaluatePairedPushFold(experiment(), [trial, { ...trial, id: "2" }])).toThrow(/unique/);
    expect(() => evaluatePairedPushFold(experiment(1), [trial, pair("2", draw(), draw())])).toThrow(/budget/);
    const input = experiment(1); input.payoffSupport.push = { lower: 0, upper: 100 };
    expect(() => evaluatePairedPushFold(input, [pair("1", ron("south", "west"), draw())])).toThrow(/support/);
  });
  it("rejects invalid experiment metadata and support", () => {
    expect(() => evaluatePairedPushFold({ ...experiment(), seed: "" }, [])).toThrow(/metadata/);
    expect(() => evaluatePairedPushFold(experiment(0), [])).toThrow();
    expect(() => estimateMean(emptyMoments(), { lower: 10, upper: 0 })).toThrow(/support/);
    expect(() => estimateMean(emptyMoments(), { lower: 0, upper: 10 }, 1)).toThrow(/Confidence/);
    expect(() => estimateMean({ count: 1, mean: 1, m2: -1 }, { lower: 0, upper: 10 })).toThrow(/moments/);
    expect(() => estimateMean({ count: 1, mean: 11, m2: 0 }, { lower: 0, upper: 10 })).toThrow(/support/);
  });
});
