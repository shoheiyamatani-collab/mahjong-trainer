import { tileName } from "@mahjong-trainer/mahjong-core";
import { analyzeReplayHand, questionContentHash, replayShanten } from "./questions";
import type { DiscardEvent, ParsedLog, QuestionStep, ReplayEvent, TedashiQuestion } from "./types";

export type RequestedCandidate = { logId: string; referenceUrl: string; round: string; honba: number; player: number; eventSequences: number[]; pattern: string[] };
const stage = (shanten: number) => shanten === 0 ? "テンパイ" : `${shanten}シャンテン`;
export function eventPattern(event: ReplayEvent): string {
  if (event.type === "discard") return `${event.tile.tile}:${event.tsumogiri ? "tsumogiri" : "tedashi"}`;
  if (event.type === "call") return `${(event.meld.calledTile ?? event.meld.tiles[0]!).tile}:${event.meld.kind}`;
  throw new Error("摸打・副露以外は教材の比較ステップにできません");
}

export function buildQuestionSteps(log: ParsedLog, request: RequestedCandidate) {
  if (request.logId !== log.source.logId) throw new Error("指定の牌譜が一致しません");
  const round = log.rounds.find((r) => r.info.round === request.round && r.info.honba === request.honba);
  if (!round) throw new Error("指定の局がありません");
  const events = request.eventSequences.map((sequence) => round.events.find((e) => e.sequence === sequence));
  if (!events.length || events.length !== request.pattern.length || request.eventSequences.some((n, i) => i > 0 && n <= request.eventSequences[i - 1]!) || events.some((e) => !e || !(e.type === "discard" || e.type === "call") || e.player !== request.player)) throw new Error("指定の手順を牌譜で確認できません");
  const ownActions = round.events.filter((e) => (e.type === "call" || e.type === "discard") && e.player === request.player && e.sequence >= request.eventSequences[0]! && e.sequence <= request.eventSequences.at(-1)!);
  if (ownActions.map((e) => e.sequence).join() !== request.eventSequences.join()) throw new Error("途中の自家の打牌・副露を省略できません");
  const steps: QuestionStep[] = events.map((e, index) => {
    if (!e || (e.type !== "discard" && e.type !== "call")) throw new Error("イベントが欠損しています");
    const actualPattern = eventPattern(e);
    if (actualPattern !== request.pattern[index]) throw new Error(`指定の摸打と不一致です: ${e.sequence}`);
    const prior = round.events[round.events.findIndex((item) => item.sequence === e.sequence) - 1]!.snapshots[request.player]!;
    const afterState = e.snapshots[request.player]!;
    const publicTiles = [...round.events.filter((item) => item.sequence <= e.sequence && item.type === "dora").map((item) => item.type === "dora" ? item.tile : null).filter((tile) => tile !== null), round.doraIndicators[0]!, ...e.snapshots.flatMap((p) => [...p.river.map((r) => r.tile), ...p.melds.flatMap((m) => m.tiles)])];
    const handBefore = e.type === "discard" ? e.handBeforeDiscard : e.handBefore;
    const handAfter = e.type === "discard" ? e.handAfterDiscard : e.handAfter;
    return { sequence: e.sequence, type: e.type, turn: e.type === "discard" ? e.turn : afterState.river.length + 1, tile: e.type === "discard" ? e.tile : (e.meld.calledTile ?? e.meld.tiles[0]!), tsumogiri: e.type === "discard" ? e.tsumogiri : null, meld: e.type === "call" ? e.meld : null, handBeforeDraw: e.type === "discard" ? e.handBeforeDraw : null, handBefore, handAfter, meldsBefore: prior.melds, meldsAfter: afterState.melds, before: analyzeReplayHand(handBefore, prior.melds, publicTiles), after: analyzeReplayHand(handAfter, afterState.melds, publicTiles), shantenBeforeDraw: e.type === "discard" && e.handBeforeDraw ? replayShanten(e.handBeforeDraw, prior.melds) : null };
  });
  return { round, events, steps };
}

export function questionSnapshot(log: ParsedLog, request: RequestedCandidate, steps: QuestionStep[], final: DiscardEvent): Pick<TedashiQuestion, "source" | "river" | "focusDiscard" | "actual" | "steps" | "referenceUrl"> {
  const round = log.rounds[final.roundIndex]!;
  const last = steps.at(-1)!;
  const state = final.snapshots[request.player]!;
  const sourceUrl = log.source.url ? new URL(log.source.url) : null;
  sourceUrl?.searchParams.set("tw", String(request.player));
  return {
    source: { ...log.source, url: sourceUrl?.toString() ?? null, platform: "tenhou", table: log.table, round: round.info.round, honba: round.info.honba, seat: tileName(27 + (request.player - round.info.dealer + 4) % 4), player: request.player, turn: final.turn, eventSequence: final.sequence, doraIndicators: final.visibleTiles.filter((tile) => round.doraIndicators.some((d) => d.id === tile.id)) },
    river: state.river, focusDiscard: state.river.at(-1)!,
    actual: { handBeforeDraw: final.handBeforeDraw, handBefore: final.handBeforeDiscard, handAfter: final.handAfterDiscard, drawnTile: final.handBeforeDraw ? final.handBeforeDiscard.find((tile) => !final.handBeforeDraw!.some((old) => old.id === tile.id))! : null, melds: state.melds, before: last.before, after: last.after, shantenBeforeDraw: last.shantenBeforeDraw },
    steps, referenceUrl: request.referenceUrl
  };
}

export function generateRequestedQuestion(log: ParsedLog, request: RequestedCandidate): TedashiQuestion {
  const { events, steps } = buildQuestionSteps(log, request);
  const final = events.at(-1) as DiscardEvent;
  if (final.type !== "discard" || final.tsumogiri) throw new Error("最終の注目打牌は手出しを指定してください");
  const last = steps.at(-1)!;
  const initial = steps[0]!;
  const hasCall = steps.some((s) => s.type === "call");
  const allTenpai = steps.every((s) => s.after.tenpai);
  const category = hasCall ? "call-progress" : allTenpai ? "tenpai-maintained" : steps.some((s) => s.shantenBeforeDraw !== null && s.after.shanten > s.shantenBeforeDraw) ? "shape-retreat" : "tenpai-progress";
  let summary: string;
  if (allTenpai) summary = steps.map((s) => `${s.tile.tile}${s.tsumogiri ? "ツモ切り" : "手出し"}後は${s.after.waits.join("・")}${s.after.waitKind === "tanki" ? "単騎" : "待ち"}のテンパイ`).join(" → ") + "でした。";
  else if (hasCall) summary = `最初の${initial.tile.tile}手出し後は${stage(initial.after.shanten)}。その後の${steps.find((s) => s.meld)?.tile.tile}ポンと${final.tile.tile}切りで、${stage(last.after.shanten)}へ変化しました。`;
  else summary = `各打牌後の進行度は${steps.map((s) => stage(s.after.shanten)).join(" → ")}でした。${category === "shape-retreat" ? "シャンテン数が戻った手出しがありました。" : "ツモ前と打牌後を同じ枚数条件で比べています。"}`;
  const correct = { id: "fact", text: summary };
  const alternatives = allTenpai ? [
    { id: "wait-unchanged", text: initial.after.waits.join() === last.after.waits.join() ? "途中のツモ切りによってテンパイが崩れ、最後の手出しで再びテンパイした。" : `最初から最後まで、${initial.after.waits.join("・")}の同じ待ちを維持していた。` },
    { id: "not-tenpai", text: "最初の手出し後はイーシャンテンで、最後の手出しによって初めてテンパイした。" },
    { id: "retreated", text: "最初はテンパイだったが、最後の手出しでテンパイを崩してイーシャンテンに戻った。" }
  ] : hasCall ? [
    { id: "tenpai-before-call", text: "最初の手出し後からテンパイしており、ポン後も待ち牌は変わらなかった。" },
    { id: "call-no-progress", text: `最初の手出し後も、ポンと最後の打牌の後も${stage(initial.after.shanten)}だった。` },
    { id: "retreated-by-call", text: "ポンする前はテンパイだったが、ポンと最後の打牌の後はイーシャンテンに戻った。" }
  ] : [
    { id: "steady-progress", text: "打牌後は2シャンテン → イーシャンテン → テンパイと、毎巡進んでいた。" },
    { id: "unchanged-progress", text: `すべての打牌後で${stage(initial.after.shanten)}を維持していた。` },
    { id: "tenpai-throughout", text: "すべての打牌後でテンパイしており、待ち牌だけを変えていた。" }
  ];
  const options = [correct, ...alternatives];
  const offset = final.sequence % options.length;
  const choices = [...options.slice(offset), ...options.slice(0, offset)];
  const question: TedashiQuestion = { ...questionSnapshot(log, request, steps, final), id: `${log.source.logId}-series-${final.sequence}`, status: "candidate", analysis: { category, clarityScore: 100, summary, reading: "これは牌譜で確認した手牌・待ち・シャンテン数の変化です。ベタオリや回し打ちを意図したかは牌譜だけでは断定できません。実戦の河では、手牌進行と守備を複数の候補として考えます。", focusBlocks: [], retainedMelds: [], followingTsumogiri: 0, ambiguityReasons: [] }, difficulty: "normal", qualityFlags: [], prompt: `「${request.pattern.map((p) => p.replace(":tedashi", "手出し").replace(":tsumogiri", "ツモ切り").replace(":pon", "ポン")).join(" → ")}」。実際に起きていた変化はどれですか？`, choices, answer: "fact", contentHash: "" };
  question.contentHash = questionContentHash(question);
  return question;
}
