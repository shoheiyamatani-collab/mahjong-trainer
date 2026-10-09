import { describe, expect, it } from "vitest";
import { ORASU_SEATS, analyzeHandProgress, handProgressShanten, settlePushFoldRound, tileIndex, type EvaluationRoundContext } from "@mahjong-trainer/mahjong-core";
import { replayTile } from "@mahjong-trainer/tenhou-analysis";
import { countsForTiles, knownPushFoldTiles, preparePushFoldQuestion, publicPushFoldTiles, safetyFacts, validatePushFoldSnapshot } from "./pushFoldAnalysis";
import { makePushFoldQuestion, validatePushFoldAudit } from "./pushFoldFactory";
import { pushFoldSpecs } from "./pushFoldQuestions";
import { getRobotsPolicy, shouldIncludeInSitemap } from "@mahjong-trainer/content-index-policy";
import { standaloneTrainerDefinitions } from "../trainerCatalog";
import { finishPushFoldSession, gradePushFold, pushFoldStats, readPushFoldStorage, selectPushFoldSession } from "./pushFoldSession";

const make = (id: string) => makePushFoldQuestion(pushFoldSpecs.find((s) => s.id.endsWith(id))!);
const prepared = pushFoldSpecs.map((s) => preparePushFoldQuestion(makePushFoldQuestion(s).question));

describe("push or fold corpus", () => {
  it.each(pushFoldSpecs)("validates $id", (spec) => {
    const { question } = makePushFoldQuestion(spec);
    const prepared = preparePushFoldQuestion(question);
    expect(prepared.branches.length).toBe(question.hand.length);
    expect(prepared.safeCopies).toBeGreaterThan(0);
    expect(question.hand.length + question.players.find((p) => p.seat === question.seatWind)!.melds.length * 3).toBe(14);
    expect(new Set(knownPushFoldTiles(question).map((t) => t.id)).size).toBe(knownPushFoldTiles(question).length);
    expect(Math.max(...countsForTiles(knownPushFoldTiles(question)))).toBeLessThanOrEqual(4);
    for (const branch of prepared.branches) {
      const progress = analyzeHandProgress(branch.counts, question.players.find((p) => p.seat === question.seatWind)!.melds.length, countsForTiles(knownPushFoldTiles(question)));
      expect(branch.ukeireCount).toBe(progress.ukeireCount);
      expect(branch.ukeire.reduce((sum, tile) => sum + tile.remaining, 0)).toBe(branch.ukeireCount);
    }
    expect(JSON.stringify(prepared)).not.toContain("deadWall");
    if (question.reasoning.some((text) => text.includes("満貫")) && !question.reasoning.some((text) => text.includes("満貫なら"))) {
      const push = prepared.branches.find((b) => b.discard.id === question.discards.push[0])!;
      expect(push.values.every((wait) => wait.ron && wait.ron.totalPoints >= (question.seatWind === "東" ? 12000 : 8000))).toBe(true);
    }
  });
  it("has 20 reviewed, unique questions per level and deterministic snapshots", () => {
    expect(new Set(pushFoldSpecs.map((q) => q.id)).size).toBe(60);
    for (const level of ["beginner", "intermediate", "advanced"]) expect(pushFoldSpecs.filter((q) => q.difficulty === level)).toHaveLength(20);
    expect(make("beginner-01")).toEqual(make("beginner-01"));
  });
  it("is discoverable from the trainer catalogue and stays indexed in review mode", () => {
    expect(standaloneTrainerDefinitions.some((item) => item.slug === "push-or-fold")).toBe(true);
    expect(getRobotsPolicy("/trainer/push-or-fold").index).not.toBe(false);
    expect(shouldIncludeInSitemap("/trainer/push-or-fold")).toBe(true);
  });
  it("matches the described high-value, chiitoitsu, open and roleless hands", () => {
    for (const id of ["beginner-01", "beginner-05", "beginner-07", "intermediate-01", "intermediate-11"]) {
      const item = prepared.find((p) => p.question.id.endsWith(id))!;
      const branch = item.branches.find((b) => b.discard.id === item.question.discards.push[0])!;
      expect(branch.values.filter((w) => !w.red).map((w) => w.ron?.totalPoints)).not.toContain(undefined);
      expect(branch.values.every((w) => w.ron!.totalPoints >= 8000)).toBe(true);
    }
    const pair = prepared.find((p) => p.question.id.endsWith("intermediate-11"))!;
    expect(pair.branches.find((b) => b.discard.id === pair.question.discards.push[0])!.values.every((w) => w.ron?.fu === 25)).toBe(true);
    const noYaku = prepared.find((p) => p.question.id.endsWith("beginner-08"))!;
    expect(noYaku.branches.find((b) => b.discard.id === noYaku.question.discards.push[0])!.values.every((w) => !w.ron && !w.tsumo)).toBe(true);
    expect(prepared.find((p) => p.question.id.endsWith("beginner-07"))!.checkerHref).toBeNull();
  });
  it("scores dealer and honba, returns one's own stick and includes existing sticks", () => {
    const dealer = prepared.find((p) => p.question.id.endsWith("beginner-09"))!;
    expect(dealer.branches.find((b) => b.discard.id === dealer.question.discards.push[0])!.values.every((w) => w.ron!.totalPoints === 12000)).toBe(true);
    const twoHonba = prepared.find((p) => p.question.id.endsWith("advanced-18"))!;
    expect(twoHonba.branches.find((b) => b.discard.id === twoHonba.question.discards.push[0])!.values[0]!.ron!.totalPoints).toBe(2600);
    const end = prepared.find((p) => p.question.id.endsWith("advanced-19"))!;
    for (const outcome of end.outcomes) expect(Object.values(outcome.scores).reduce((a, b) => a + b)).toBe(100000);
    expect(end.outcomes.find((o) => o.label.includes("東家からロン"))!.scores.south - end.question.scores[1]).toBe(10000);
    // Two confirmed riichi players: self-tenpai gets 1,000; own deposit cancels it.
    expect(end.drawCases.find((row) => row.label === "他家2人テンパイの場合")!.pushGain).toBe(0);
    expect(end.drawCases.find((row) => row.label === "他家3人テンパイの場合")!.pushGain).toBe(-1000);
  });
  it("keeps all existing training score examples consistent with the research ledger", () => {
    const winds = ["東", "南", "西", "北"];
    let checkedOutcomes = 0;
    for (const item of prepared) {
      const q = item.question, self = ORASU_SEATS[winds.indexOf(q.seatWind)]!;
      const round: EvaluationRoundContext = {
        scores: Object.fromEntries(ORASU_SEATS.map((seat, i) => [seat, q.scores[i]!])) as EvaluationRoundContext["scores"],
        dealer: "east", honba: q.honba, kyotaku: q.riichiSticks,
        existingRiichi: q.players.filter((player) => player.riichi).map((player) => ORASU_SEATS[winds.indexOf(player.seat)]!),
        rules: { id: "training-single-winner", ronResolution: "head-bump", tripleRon: "abort" }
      };
      const branch = item.branches.find((candidate) => candidate.discard.id === q.discards.push[0])!;
      let outcomeIndex = 0;
      for (const wait of branch.values) for (const from of ORASU_SEATS) {
        const value = from === self ? wait.tsumo : wait.ron;
        if (!value) continue;
        const winClaim = { winner: self, han: value.han, fu: value.fu };
        const result = settlePushFoldRound(round, {
          acceptedRiichi: q.declareRiichi ? [self] : [],
          terminal: from === self ? { kind: "tsumo", claim: winClaim } : { kind: "ron", from, claims: [winClaim] }
        });
        expect(result.deltas[self]).toBe(value.totalPoints + q.riichiSticks * 1000);
        if (q.targetRank) expect(result.scores).toEqual(item.outcomes[outcomeIndex++]!.scores);
        checkedOutcomes++;
      }
    }
    expect(checkedOutcomes).toBeGreaterThan(100);
  });
  it("handles kokushi and invalid audit allocations", () => {
    const spec = { ...pushFoldSpecs[0]!, id: "kokushi-test", hand: "19m19p19s東南西北白發中", drawn: "5p" as const, push: "5p" as const, fold: ["1m" as const], shanten: 0, riichi: false, redHand: [], indicator: "4p" as const };
    const data = makePushFoldQuestion(spec), item = preparePushFoldQuestion(data.question);
    expect(item.branches.find((b) => b.discard.id === data.question.discards.push[0])!.waits).toHaveLength(13);
    const broken = structuredClone(data.audit); broken.wall[0] = broken.deadWall[0]!;
    expect(() => validatePushFoldAudit(data.question, broken)).toThrow();
  });
  it("rejects drafts, duplicated physical tiles, malformed red tiles and false riichi", () => {
    const original = make("beginner-01").question;
    const mutations = [
      (q: typeof original) => { q.review.status = "draft"; },
      (q: typeof original) => { q.hand[1] = q.hand[0]!; },
      (q: typeof original) => { q.hand[0]!.red = !q.hand[0]!.red; },
      (q: typeof original) => { q.players[0]!.river.at(-1)!.tsumogiri = false; },
      (q: typeof original) => { q.players[0]!.riichi!.tileId = q.hand[0]!.id; },
      (q: typeof original) => { q.riichiSticks = 0; },
      (q: typeof original) => { q.discards.push = [135]; },
      (q: typeof original) => { q.reasoning = ["放銃率は12.5％です"]; }
    ];
    for (const mutate of mutations) { const q = structuredClone(original); mutate(q); expect(() => validatePushFoldSnapshot(q)).toThrow(); }
    const call = make("beginner-07").question;
    expect(publicPushFoldTiles(call).length).toBe(call.doraIndicators.length + call.players.reduce((s, p) => s + p.river.length + p.melds.length * 3, 0) - 1);
    call.players[0]!.river[0]!.calledBy = null;
    expect(() => validatePushFoldSnapshot(call)).toThrow();
  });
  it("rejects illegal hidden riichi hands and mistaken shanten explanations", () => {
    const data = make("beginner-01");
    const audit = structuredClone(data.audit); [audit.hands[0]![0], audit.wall[0]] = [audit.wall[0]!, audit.hands[0]![0]!];
    expect(() => validatePushFoldAudit(data.question, audit)).toThrow();
    data.question.expected.pushShanten = 2;
    expect(() => preparePushFoldQuestion(data.question)).toThrow();
  });
  it("applies furiten to every ron wait, not to tsumo", () => {
    const item = prepared.find((p) => p.question.id.endsWith("intermediate-13"))!;
    const branch = item.branches.find((b) => b.discard.id === item.question.discards.push[0])!;
    expect(branch.furiten).toBe(true); expect(branch.values.every((w) => w.ron === null && w.tsumo !== null)).toBe(true);
  });
});

describe("safety facts, not deal-in probabilities", () => {
  it("checks genbutsu per opponent", () => {
    const q = make("intermediate-08").question, tile = q.hand.find((t) => t.tile === "5p")!;
    expect(safetyFacts(q, tile, q.players[0]!).genbutsu).toBe(true);
    expect(safetyFacts(q, tile, q.players[2]!).genbutsu).toBe(false);
  });
  it("requires both sides for central suji and leaves other wait types", () => {
    const q = make("intermediate-03").question;
    const fact = safetyFacts(q, q.hand.find((t) => t.tile === "5p")!, q.players[0]!);
    expect(fact.suji).toBe(true); expect(fact.possibleWaits).toContain("カンチャン"); expect(fact.possibleWaits).not.toContain("両面");
    const half = make("intermediate-19").question;
    expect(safetyFacts(half, half.hand.find((t) => t.tile === "4p")!, half.players[0]!).suji).toBe(false);
  });
  it("distinguishes 4 visible and 3 visible walls, leaving tanki", () => {
    const q = make("intermediate-05").question;
    const fact = safetyFacts(q, q.hand.find((t) => t.tile === "2p")!, q.players[0]!);
    expect(fact.noChance).toContain("3p"); expect(fact.possibleWaits).not.toContain("両面"); expect(fact.possibleWaits).toContain("単騎");
    const one = make("intermediate-06").question;
    expect(safetyFacts(one, one.hand.find((t) => t.tile === "2p")!, one.players[0]!).oneChance).toContain("3p");
  });
  it("exposes honor public counts, red and dora separately", () => {
    const q = make("beginner-07").question;
    const red = q.hand.find((t) => t.red)!;
    expect(safetyFacts(q, red, q.players[0]!).red).toBe(true);
    const white = replayTile(tileIndex("白") * 4);
    const fact = safetyFacts(q, white, q.players[0]!);
    expect(fact.publicCopies).toBe(3); expect(fact.dora).toBe(true); expect(fact.possibleWaits).not.toContain("シャンポン");
    expect(JSON.stringify(fact)).not.toContain("probability");
  });
});

describe("sessions, separate scores and versioned storage", () => {
  it("selects reproducibly, avoids duplicates/recent questions and balances categories", () => {
    for (const level of ["beginner", "intermediate", "advanced"] as const) {
      const a = selectPushFoldSession(prepared, level, "a");
      expect(a).toHaveLength(10); expect(new Set(a.map((q) => q.question.id)).size).toBe(10);
      expect(a).toEqual(selectPushFoldSession(prepared, level, "a"));
      const b = selectPushFoldSession(prepared, level, "b", a.map((q) => q.question.id));
      expect(b.some((q) => a.some((previous) => previous.question.id === q.question.id))).toBe(false);
      expect(new Set(a.map((q) => q.question.category)).size).toBeGreaterThanOrEqual(4);
    }
  });
  it("does not count reasonable alternatives as errors or inflate accuracy", () => {
    const item = prepared.find((p) => p.question.id.endsWith("intermediate-01"))!;
    expect(gradePushFold(item.question, "fold")).toBe("alternative");
    const stats = pushFoldStats([item], [{ id: item.question.id, action: "fold", discardId: item.question.discards.fold[0]! }]);
    expect(stats.scored).toBe(0); expect(stats.alternatives).toBe(1); expect(stats.discardCorrect).toBe(1);
  });
  it("separates push/fold and discard grades, restores only valid bounded history", () => {
    const items = selectPushFoldSession(prepared, "beginner", "history");
    const answers = items.map(({ question: q }) => ({ id: q.id, action: q.recommendedAction, discardId: q.discards[q.recommendedAction][0]! }));
    const storage = finishPushFoldSession(readPushFoldStorage(null), items, answers, "history", "2026-10-08T12:00:00Z");
    expect(() => finishPushFoldSession(storage, items, answers.slice(0, 9), "history", "2026-10-08T12:00:00Z")).toThrow();
    expect(storage.history[0]?.correct).toBe(10); expect(storage.history[0]?.discardCorrect).toBe(10);
    expect(readPushFoldStorage(JSON.stringify(storage))).toEqual(storage);
    expect(readPushFoldStorage("broken").history).toEqual([]); expect(readPushFoldStorage('{"version":2}').history).toEqual([]);
    const other = { ...answers[0]!, discardId: -1 };
    const result = pushFoldStats(items, [other]); expect(result.correct).toBe(1); expect(result.discardCorrect).toBe(0);
  });
});
