import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { countsToTiles, parseHand, tileIndex } from "@mahjong-trainer/mahjong-core";
import { decodeMeld, parseTenhouXml, replayTile } from "../src/parser";
import { analyzeReplayHand, generateTedashiQuestions, questionContentHash } from "../src/questions";
import { generateRequestedQuestion, type RequestedCandidate } from "../src/requested";
import { canPublishQuestion } from "../src/publication";
import { syntheticXml } from "../src/fixtures";
import type { DiscardEvent, LogSource } from "../src/types";

const source: LogSource = { sourceType: "synthetic", logId: "synthetic-test", date: null, url: null };
function physical(text: string, used = new Set<number>()) {
  return countsToTiles(parseHand(text)).map((tile) => { const id = [0, 1, 2, 3].map((copy) => tileIndex(tile) * 4 + copy).find((id) => !used.has(id))!; if (id === undefined) throw new Error("test hand not legal"); used.add(id); return id; });
}
function xml(hands: Array<number[] | null>, actions: string, future: number[] = []) {
  const used = new Set(hands.flatMap((hand) => hand ?? []));
  const reserved = new Set([...used, ...future, 135]);
  const full = hands.map((hand) => hand ?? Array.from({ length: 13 }, () => { const id = Array.from({ length: 136 }, (_, n) => n).find((n) => !reserved.has(n))!; reserved.add(id); return id; }));
  return `<mjloggm ver="2.3"><GO type="169"/><UN n0="DO_NOT_RETAIN"/><INIT seed="0,0,0,1,2,135" ten="250,250,250,250" oya="0" ${full.map((hand, player) => `hai${player}="${hand.join(",")}"`).join(" ")}/>${actions}<RYUUKYOKU/></mjloggm>`;
}
const discards = (input: string) => parseTenhouXml(input, source).rounds[0]!.events.filter((e): e is DiscardEvent => e.type === "discard");

describe("Tenhou physical-tile replay", () => {
  it("keeps exact before/after snapshots and distinguishes identical-kind tedashi from tsumogiri", () => {
    const hand = physical("4567m123p789s東東白");
    const [discard] = discards(xml([hand, null, null, null], "<T17/><D16/>", [17]));
    expect(discard!.tsumogiri).toBe(false);
    expect(discard!.handBeforeDraw!.map((t) => t.id)).toEqual(hand.slice().sort((a, b) => a - b));
    expect(discard!.handBeforeDiscard).toHaveLength(14);
    expect(discard!.handAfterDiscard).toHaveLength(13);
    expect(discard!.handAfterDiscard.find((t) => t.tile === "5m")?.id).toBe(17);
    expect(discard!.tile.red).toBe(true);
    expect(discard!.handAfterDiscard.find((t) => t.tile === "5m")?.red).toBe(false);
    const tsumo = discards(xml([hand, null, null, null], "<T17/><D17/>", [17]))[0]!;
    expect(tsumo.tsumogiri).toBe(true);
    expect(tsumo.handAfterDiscard.map((t) => t.id)).toEqual(hand.slice().sort((a, b) => a - b));
  });
  it("recognizes red fives only when red rules are enabled", () => {
    expect([16, 52, 88].map((id) => replayTile(id).red)).toEqual([true, true, true]);
    expect(replayTile(16, false).red).toBe(false);
    expect(() => replayTile(136)).toThrow();
  });
  it("restores chi including the called physical tile", () => {
    const used = new Set<number>(); const p0 = physical("4m123p789p123s東東白", used); const p1 = physical("56m789m456p789s北北", used);
    const log = parseTenhouXml(xml([p0, p1, null, null], '<T110/><D12/><N who="1" m="9223"/><E120/>', [110]), source);
    const call = log.rounds[0]!.events.find((e) => e.type === "call")!;
    expect(call.type === "call" && call.meld.tiles.map((t) => t.id)).toEqual([12, 16, 20]);
    expect(call.snapshots[0]!.river[0]!.calledBy).toBe(1);
    expect(call.snapshots[1]!.hand).toHaveLength(11);
    expect(log.rounds[0]!.events.at(-1)!.snapshots[1]!.hand).toHaveLength(10);
  });
  it("handles pon, kakan, rinshan and a new dora without duplication", () => {
    const used = new Set<number>(); const p0 = physical("5p123m789m123s東東白", used); const p1 = physical("55p456m789p789s北北", used);
    const actions = '<T1/><D52/><N who="1" m="20075"/><E120/><V61/><F61/><W65/><G65/><T69/><D69/><U55/><N who="1" m="20083"/><DORA hai="131"/><U73/><E73/>';
    const log = parseTenhouXml(xml([p0, p1, null, null], actions, [1, 55, 61, 65, 69, 73, 131]), source);
    const last = log.rounds[0]!.events.at(-1)!.snapshots[1]!;
    expect(last.melds).toHaveLength(1);
    expect(last.melds[0]!.kind).toBe("kakan");
    expect(last.melds[0]!.tiles.map((t) => t.id).sort()).toEqual([52, 53, 54, 55]);
    expect(last.hand).toHaveLength(10);
    expect(log.rounds[0]!.doraIndicators).toHaveLength(2);
    expect(log.rounds[0]!.events.some((e) => e.type === "draw" && e.rinshan)).toBe(true);
  });
  it("handles ankan and daiminkan", () => {
    const p0 = physical("5555m123p789s東東白");
    const log = parseTenhouXml(xml([p0, null, null, null], '<T0/><N who="0" m="4096"/><T1/><D1/>', [0, 1]), source);
    expect(log.rounds[0]!.events.at(-1)!.snapshots[0]!.melds[0]!.kind).toBe("ankan");
    const used = new Set<number>(); const a = physical("6m123p789p123s東東白", used); const b = physical("666m234m789s北北北白", used);
    const kan = parseTenhouXml(xml([a, b, null, null], '<T0/><D20/><N who="1" m="5123"/><U1/><E1/>', [0, 1]), source);
    expect(kan.rounds[0]!.events.at(-1)!.snapshots[1]!.melds[0]!.kind).toBe("daiminkan");
  });
  it("rolls a robbed kakan back to the original pon without losing the winning physical tile", () => {
    const used = new Set<number>();
    const p0 = physical("5p123m789m123s東東白", used);
    const p1 = physical("55p456m789p789s北北", used);
    const p2 = physical("34p123m789m789s東東", used);
    const actions = '<T133/><D52/><N who="1" m="20075"/><E120/><V61/><F61/><W65/><G65/><T69/><D69/><U55/><N who="1" m="20083"/>';
    const input = xml([p0, p1, p2, null], actions, [133, 55, 61, 65, 69]).replace("<RYUUKYOKU/>", `<AGARI who="2" fromWho="1" machi="55" hai="${[...p2, 55].join(",")}"/>`);
    const events = parseTenhouXml(input, source).rounds[0]!.events;
    const end = events.at(-1)!;
    expect(end.type === "win" && end.chankan).toBe(true);
    expect(end.snapshots[1]!.melds[0]!.kind).toBe("pon");
    expect(end.snapshots[1]!.melds[0]!.tiles).toHaveLength(3);
    expect(end.snapshots[1]!.hand).toHaveLength(10);
    expect(events.some((e) => e.type === "call" && e.meld.kind === "kakan" && e.robbed)).toBe(true);
  });
  it("keeps one river copy for double ron and rejects draws after the win", () => {
    const used = new Set<number>();
    const p1 = physical("123m123p123s789s東", used);
    const p2 = physical("456m456p456s789s東", used);
    const p0 = physical("東234p456p789m白白白", used);
    const input = xml([p0, p1, p2, null], '<T133/><D110/>', [133]).replace("<RYUUKYOKU/>", [p1, p2].map((hand, i) => `<AGARI who="${i + 1}" fromWho="0" machi="110" hai="${[...hand, 110].join(",")}"/>`).join(""));
    const events = parseTenhouXml(input, source).rounds[0]!.events;
    expect(events.filter((e) => e.type === "win")).toHaveLength(2);
    expect(events.at(-1)!.snapshots[0]!.river).toHaveLength(1);
    expect(events.at(-1)!.snapshots[2]!.hand).toHaveLength(13);
    expect(() => parseTenhouXml(input.replace("</mjloggm>", "<U134/></mjloggm>"), source)).toThrow();
  });
  it("tracks riichi declaration and acceptance on the correct discard", () => {
    const hand = physical("4567m123p789s東東白");
    const log = parseTenhouXml(xml([hand, null, null, null], '<T110/><REACH who="0" step="1"/><D24/><REACH who="0" step="2"/>', [110]), source);
    const discard = log.rounds[0]!.events.find((e) => e.type === "discard")!;
    expect(discard.type === "discard" && discard.riichi).toBe(true);
    expect(log.rounds[0]!.events.at(-1)!.snapshots[0]!.riichi).toBe(true);
  });
  it("validates ron and tsumo hands against the terminal hand", () => {
    const winning13 = physical("123m123p123s789s東");
    const base = xml([winning13, null, null, null], "", [109]);
    const tsumo = base.replace("<RYUUKYOKU/>", `<T109/><AGARI who="0" fromWho="0" machi="109" hai="${[...winning13, 109].join(",")}"/>`);
    const log = parseTenhouXml(tsumo, source);
    expect(log.rounds[0]!.events.at(-1)!.type).toBe("win");
    expect(log.rounds[0]!.events.at(-1)!.snapshots[0]!.hand).toHaveLength(14);
    const used = new Set<number>(); const h1 = physical("123m123p123s789s東", used); const h0 = physical("東234p456p789m白白白", used);
    const ron = xml([h0, h1, null, null], '<T131/><D109/>', [131]).replace("<RYUUKYOKU/>", `<AGARI who="1" fromWho="0" machi="109" hai="${[...h1, 109].join(",")}"/>`);
    const end = parseTenhouXml(ron, source).rounds[0]!.events.at(-1)!;
    expect(end.type === "win" && end.method).toBe("ron");
    expect(end.snapshots[1]!.hand).toHaveLength(13);
    expect(() => parseTenhouXml(ron.replace('machi="109"', 'machi="110"'), source)).toThrow();
  });
  it("rejects invalid ownership, draw order, missing ends, three-player logs and unknown events", () => {
    const hand = physical("4567m123p789s東東白");
    const valid = xml([hand, null, null, null], "<T110/><D110/>", [110]);
    expect(() => parseTenhouXml(valid.replace("D110", "D111"), source)).toThrow();
    expect(() => parseTenhouXml(valid.replace("T110", "U110"), source)).toThrow();
    expect(() => parseTenhouXml(valid.replace("<RYUUKYOKU/>", ""), source)).toThrow();
    expect(() => parseTenhouXml(valid.replace('type="169"', 'type="185"'), source)).toThrow();
    expect(() => parseTenhouXml(valid.replace("<RYUUKYOKU/>", "<UNSUPPORTED/><RYUUKYOKU/>"), source)).toThrow();
    expect(() => parseTenhouXml(valid.replace("<T110/>", "<T16/>"), source)).toThrow();
    expect(() => parseTenhouXml('<!DOCTYPE x [<!ENTITY x "x">]>' + valid, source)).toThrow();
  });
  it("starts every new round with fresh hands, rivers and draw IDs; does not retain names", () => {
    const first = syntheticXml("m", 3); const second = syntheticXml("p", 4, 4);
    const combined = first.replace("</mjloggm>", second.slice(second.indexOf("<INIT")));
    const log = parseTenhouXml(combined, source);
    expect(log.rounds).toHaveLength(2);
    expect(log.rounds[1]!.events[0]!.snapshots.every((p) => p.hand.length === 13 && p.river.length === 0)).toBe(true);
    expect(JSON.stringify(log)).not.toContain("TEST_ONLY");
  });
});

describe("Candidate quality and publication gate", () => {
  it("counts visible ukeire once and never evaluates a 15th tile from a 14-tile hand", () => {
    const hand = physical("123m123p123s789s東").map((id) => replayTile(id));
    const analysis = analyzeReplayHand(hand, [], [replayTile(111), replayTile(111)]);
    expect(analysis.ukeire).toEqual(["東"]);
    expect(analysis.ukeireCount).toBe(2);
    expect(analysis.waitKind).toBe("tanki");
    expect(analyzeReplayHand([...hand, replayTile(109)], [], []).ukeire).toEqual([]);
    expect(analysis.blockStructure.melds).toBe(4);
    const exhausted = analyzeReplayHand(hand, [], [109, 110, 111].map((id) => replayTile(id)));
    expect(exhausted.waits).toEqual(["東"]);
    expect(exhausted.ukeireCount).toBe(0);
    expect(exhausted.waitKind).toBe("tanki");
  });
  it("generates 12 distinct deterministic synthetic candidates from legal complete event streams", () => {
    const questions = (["m", "p", "s"] as const).flatMap((suit) => [2, 3, 4, 5].flatMap((start) => generateTedashiQuestions(parseTenhouXml(syntheticXml(suit, start), { ...source, logId: `synthetic-${suit}-${start}` })).filter((q) => q.status === "candidate")));
    expect(questions).toHaveLength(12);
    expect(new Set(questions.map((q) => q.id)).size).toBe(12);
    for (const q of questions) { expect(q.analysis.clarityScore).toBeGreaterThanOrEqual(80); expect(q.actual.handBefore).toHaveLength(14); expect(q.actual.handAfter).toHaveLength(13); expect(q.choices.filter((c) => c.id === q.answer)).toHaveLength(1); expect(q.contentHash).toBe(questionContentHash(q)); expect(canPublishQuestion(q)).toBe(false); }
  });
  it("never turns overlapping 344556 into a clear single structural answer", () => {
    const hand = physical("344556m123p78s東白");
    const log = parseTenhouXml(xml([hand, null, null, null], '<T92/><D108/>', [92]), source);
    const questions = generateTedashiQuestions(log);
    expect(questions.some((q) => q.status === "candidate")).toBe(false);
    expect(questions.some((q) => q.qualityFlags.includes("ambiguousShape"))).toBe(true);
  });
  it("requires real source, human review, permission reference and unchanged content to publish", () => {
    const q = generateTedashiQuestions(parseTenhouXml(syntheticXml("m", 3), source)).find((q) => q.status === "candidate")!;
    q.source.sourceType = "tenhou"; q.source.logId = "2018031609gm-00a9-0000-fe2e9a07"; q.contentHash = questionContentHash(q); q.status = "approved";
    expect(canPublishQuestion(q)).toBe(false);
    q.review = { contentHash: q.contentHash, reviewedAt: "2026-10-06T00:00:00.000Z", permissionReference: "TEST ONLY: not an actual permission" };
    expect(canPublishQuestion(q)).toBe(true);
    q.analysis.summary = "changed"; expect(canPublishQuestion(q)).toBe(false);
  });
});

const local = fileURLToPath(new URL("../../../data/tenhou/local/", import.meta.url));
const manifest = JSON.parse(readFileSync(fileURLToPath(new URL("../../../data/tenhou/requested-candidates.json", import.meta.url)), "utf8")) as RequestedCandidate[];
describe.skipIf(!manifest.every((item) => existsSync(`${local}${item.logId}.xml`)))("Three user-provided real logs (private local integration)", () => {
  for (const item of manifest) it(`reconstructs every event and verifies requested sequence: ${item.logId}`, () => {
    const log = parseTenhouXml(readFileSync(`${local}${item.logId}.xml`, "utf8"), { sourceType: "tenhou", logId: item.logId, date: null, url: null });
    expect(log.table).toBe("houou");
    expect(log.rounds.every((round) => round.ended)).toBe(true);
    const q = generateRequestedQuestion(log, item);
    expect(q.steps).toHaveLength(item.pattern.length);
    expect(q.analysis.clarityScore).toBe(100);
    expect(q.status).toBe("candidate");
    expect(canPublishQuestion(q)).toBe(false);
    if (item.logId.startsWith("2018")) { expect(q.steps!.map((s) => s.after.shanten)).toEqual([0, 0, 0]); expect(q.steps!.map((s) => s.after.ukeire)).toEqual([["8p"], ["8p"], ["8m"]]); expect(q.steps!.every((s) => s.after.waitKind === "tanki")).toBe(true); }
    if (item.logId.startsWith("2025")) expect(q.steps!.map((s) => s.after.shanten)).toEqual([2, 3, 2]);
    if (item.logId.startsWith("2020")) { expect(q.actual.after.shanten).toBe(0); expect(q.actual.after.ukeire).toEqual(["1m", "4m"]); expect(q.steps!.filter((s) => s.tsumogiri === true)).toHaveLength(2); }
  });
});
