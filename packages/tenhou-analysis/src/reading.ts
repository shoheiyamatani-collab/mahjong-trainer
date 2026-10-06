import { doraFromIndicator, tileIndex, tileName, type Tile } from "@mahjong-trainer/mahjong-core";
import { buildQuestionSteps, eventPattern, questionSnapshot, type RequestedCandidate } from "./requested";
import { questionContentHash, replayShanten, tileComponents } from "./questions";
import type { DiscardEvent, ParsedLog, QuestionCategory, ReplayEvent, ReplayTile, TedashiQuestion } from "./types";

export type ReadingTopic = Extract<QuestionCategory, "hand-progress" | "tile-neighborhood" | "discard-order" | "taatsu-drop" | "tsumogiri-run" | "call-progress" | "wait-confirmation" | "hand-composition" | "dora-discard">;
export type ReadingTarget = { topic: ReadingTopic; from: number; to: number; expectedFirst: string; expectedLast: string; focusTiles?: Tile[] };
export type ReadingSource = { logId: string; priority: "S" | "A"; referenceUrl: string; targets: ReadingTarget[] };
export class CandidateRejected extends Error {}
const reject = (reason: string): never => { throw new CandidateRejected(reason); };
const stage = (n: number) => n === 0 ? "テンパイ" : n === 1 ? "イーシャンテン" : `${n}シャンテン`;
const tilesText = (tiles: Tile[]) => tiles.length ? tiles.join("・") : "なし";
const ids = (tiles: ReplayTile[]) => tiles.map((t) => t.id).sort((a, b) => a - b).join();
const meldIds = (step: NonNullable<TedashiQuestion["steps"]>[number]) => step.meldsAfter.map((m) => `${m.kind}:${ids(m.tiles)}`).join("|");
const nextStage = (n: number, offset = 1) => (n + offset) % 7;
const uniqueTiles = (tiles: ReplayTile[]) => [...new Set(tiles.map((t) => t.tile))].sort((a, b) => tileIndex(a) - tileIndex(b));
const orderedTiles = (tiles: Tile[]) => tiles.slice().sort((a, b) => tileIndex(a) - tileIndex(b));

function requestFor(log: ParsedLog, source: ReadingSource, target: ReadingTarget): RequestedCandidate {
  if (source.logId !== log.source.logId) throw new Error("教材ソースと牌譜IDが不一致です");
  const round = log.rounds.find((r) => r.events.some((e) => e.sequence === target.from));
  const first = round?.events.find((e) => e.sequence === target.from);
  const last = round?.events.find((e) => e.sequence === target.to);
  if (!round || !first || !last || !(first.type === "call" || first.type === "discard") || last.type !== "discard" || first.player !== last.player || target.to < target.from) throw new Error("教材対象のイベント範囲が不正です");
  if (eventPattern(first) !== target.expectedFirst || eventPattern(last) !== target.expectedLast) throw new Error(`教材アンカーと実牌譜が不一致です: ${source.logId} ${target.from}..${target.to}`);
  const events = round.events.filter((e) => (e.type === "discard" || e.type === "call") && e.player === first.player && e.sequence >= target.from && e.sequence <= target.to);
  return { logId: source.logId, referenceUrl: source.referenceUrl, round: round.info.round, honba: round.info.honba, player: first.player, eventSequences: events.map((e) => e.sequence), pattern: events.map(eventPattern) };
}

export function generateReadingQuestion(log: ParsedLog, source: ReadingSource, target: ReadingTarget, referenceMatched = true): TedashiQuestion {
  const request = requestFor(log, source, target);
  const { round, steps, events } = buildQuestionSteps(log, request);
  const first = steps[0]!;
  const last = steps.at(-1)!;
  const final = events.at(-1) as DiscardEvent;
  const beforeProgress = first.shantenBeforeDraw ?? first.before.shanten;
  const afterProgress = last.after.shanten;
  let prompt = "";
  let summary = "";
  let alternatives: string[] = [];
  let reading = "河からの推測と、牌譜で復元した事実は別です。この1例だけから所持率やテンパイ確率を出したり、相手の意図を断定したりはできません。";
  let runLength = 0;

  if (target.topic === "hand-progress" || target.topic === "call-progress" || target.topic === "dora-discard") {
    if (target.topic === "call-progress" && (first.type !== "call" || !["chi", "pon"].includes(first.meld?.kind ?? ""))) reject("最初のチー・ポンから比較する範囲を指定してください");
    if ((target.topic === "hand-progress" || target.topic === "dora-discard") && (steps.length !== 1 || !first.handBeforeDraw)) reject("ツモ前と打牌後を比較できる1打を指定してください");
    if (target.topic === "dora-discard" && (final.tsumogiri || !final.visibleTiles.some((t) => round.doraIndicators.some((d) => d.id === t.id) && doraFromIndicator(t.tile) === final.tile.tile))) reject("ドラの手出しではありません");
    const prefix = target.topic === "call-progress" ? "最初の鳴き前" : "最初のツモ前";
    prompt = target.topic === "call-progress" ? "鳴きとその後の手出しで、実際の進行度はどう変わりましたか？" : target.topic === "dora-discard" ? `${final.tile.tile}のドラ手出しで、実際の進行度はどう変わりましたか？` : `${final.tile.tile}手出しの前後で、実際の進行度はどう変わりましたか？`;
    const sentence = (before: number, after: number) => `${prefix}は${stage(before)}、最後の打牌後は${stage(after)}でした。`;
    summary = sentence(beforeProgress, afterProgress);
    alternatives = [sentence(beforeProgress, nextStage(afterProgress)), sentence(nextStage(beforeProgress), afterProgress), sentence(nextStage(beforeProgress), nextStage(afterProgress))];
    if (target.topic === "call-progress") reading = "鳴き後の手出しでは、ツモがなく手牌の枚数が減ります。副露込みの13枚相当で鳴く前と打牌後を比べます。鳴いたという事実だけでは、テンパイや打点は確定しません。";
    if (target.topic === "dora-discard") reading = "ドラの手出しは手牌変化を見直すきっかけになります。ただし、それだけで手が進んだとも、周辺牌が危険になったとも断定できません。回答では実際の進行度だけを比較します。";
  } else if (target.topic === "tile-neighborhood" || target.topic === "discard-order") {
    if (final.tsumogiri || tileIndex(final.tile.tile) >= 27) reject("数牌の手出しではありません");
    const index = tileIndex(final.tile.tile);
    const region = target.focusTiles ? orderedTiles([...new Set(target.focusTiles)]) : Array.from({ length: 9 }, (_, rank) => Math.floor(index / 9) * 9 + rank).filter((n) => Math.abs(n - index) <= 2).map(tileName);
    if (!region.length || region.some((tile) => Math.floor(tileIndex(tile) / 9) !== Math.floor(index / 9))) reject("比較する牌の範囲が不正です");
    const retained = uniqueTiles(last.handAfter.filter((t) => region.includes(t.tile)));
    if (!retained.length) reject("指定した周辺牌が残らないため、今回の周辺牌教材にはしません");
    const missing = region.find((tile) => !retained.includes(tile));
    const wrongSet = missing ? orderedTiles([...retained, missing]) : retained.slice(0, -1);
    const sequence = request.pattern.filter((p) => p.endsWith(":tedashi")).map((p) => p.split(":")[0]).join(" → ");
    prompt = `${target.topic === "discard-order" ? `「${sequence}」の切り順の後、` : `${final.tile.tile}の手出し後、`}${target.focusTiles ? tilesText(region) : "同種・数字差1〜2の同色牌"}のうち、実際に手牌へ残った種類はどれですか？`;
    summary = `${tilesText(retained)}が残り、進行度は${stage(afterProgress)}でした。`;
    alternatives = [`${tilesText(wrongSet)}が残り、進行度は${stage(afterProgress)}でした。`, `${tilesText(retained)}が残り、進行度は${stage(nextStage(afterProgress))}でした。`, `この範囲の牌は残らず、進行度は${stage(afterProgress)}でした。`];
    reading = "周辺牌は同じ色で数字が近い牌です。この問題は実際に残った種類を問うもので、特定の面子・ターツへの分解を決めつけません。逆切りや遅い端牌切りから『必ず周辺を持っている』とは一般化できません。副露に出した牌は、ここでいう手牌の残りには含めません。";
  } else if (target.topic === "taatsu-drop") {
    if (first.type !== "discard" || first.tsumogiri || final.tsumogiri || first.tile.tile === final.tile.tile || !first.handBeforeDraw || steps.some((s) => s.type === "call")) reject("単純なターツ落としではありません");
    const component = tileComponents(first.handBeforeDraw!).find((c) => c.some((t) => t.tile === first.tile.tile));
    const a = tileIndex(first.tile.tile); const b = tileIndex(final.tile.tile);
    if (!component || component.length !== 2 || !component.some((t) => t.tile === final.tile.tile) || a >= 27 || Math.floor(a / 9) !== Math.floor(b / 9) || Math.abs(a - b) > 2 || last.handAfter.some((t) => t.tile === first.tile.tile || t.tile === final.tile.tile)) reject("2枚だけの明確なターツが両方なくなった局面ではありません");
    prompt = `${first.tile.tile} → ${final.tile.tile}の手出しで、実際にどんな形がなくなりましたか？`;
    summary = `最初のツモ前には${first.tile.tile}・${final.tile.tile}の2枚ターツ候補があり、最後の打牌後は両方とも手牌になくなりました。`;
    alternatives = [`最初から${first.tile.tile}だけの孤立牌で、${final.tile.tile}は手牌にありませんでした。`, `最初は${first.tile.tile}の対子で、最後まで対子を残していました。`, `${first.tile.tile}・${final.tile.tile}を使った完成面子を、最後の打牌後も手牌に残していました。`];
    reading = "この例では、ツモ前に独立した2枚形があったことと、最後に両方なくなったことを確認しています。同じ切り順でも、面子や複合形から切り出される場合があるため、河だけでターツ落としとは断定しません。";
  } else if (target.topic === "tsumogiri-run") {
    if (first.type !== "discard" || first.tsumogiri || steps.length < 4 || steps.slice(1).some((s) => s.type !== "discard" || !s.tsumogiri || ids(s.handAfter) !== ids(first.handAfter) || meldIds(s) !== meldIds(first))) reject("手牌が変わらない3回以上の連続ツモ切りではありません");
    runLength = steps.length - 1;
    prompt = `${first.tile.tile}の手出し後、${runLength}回のツモ切りが続きました。この間の実際の手牌は？`;
    const sentence = (n: number) => `手牌の個体は変わらず、${stage(n)}を維持していました。`;
    summary = sentence(afterProgress);
    alternatives = [sentence(nextStage(afterProgress)), sentence(nextStage(afterProgress, 2)), sentence(nextStage(afterProgress, 3))];
    reading = "鳴きやカンが間に入らない連続ツモ切りでは、元の手牌が保たれています。ただし、保たれた手がテンパイかどうかは河だけでは分かりません。テンパイではないままツモ切りが続く実例もあります。";
  } else if (target.topic === "wait-confirmation") {
    if (!last.after.tenpai || !last.after.waits.length) reject("待ちを比較できるテンパイではありません");
    prompt = `${final.riichi ? "リーチ宣言" : "最後の打牌"}後、実際のアガリ牌の種類はどれでしたか？`;
    summary = `${tilesText(last.after.waits)}待ちでした。`;
    const variants = new Set<string>();
    for (let offset = 1; offset < 34 && variants.size < 3; offset += 1) {
      const shifted = orderedTiles(last.after.waits.map((tile) => tileName((tileIndex(tile) + offset) % 34)));
      const sentence = `${tilesText(shifted)}待ちでした。`;
      if (sentence !== summary) variants.add(sentence);
    }
    alternatives = [...variants];
    reading = "これは牌譜で復元した実際の待ちです。リーチ河が似ていても、通常手・七対子・複合待ちなど別の形がありえます。鳴かなかった牌を根拠に待ちを完全に否定したり、この1例から良形率を計算したりはしません。";
  } else if (target.topic === "hand-composition") {
    const kinds = new Set([...last.handAfter, ...last.meldsAfter.flatMap((m) => m.tiles)].map((t) => Math.floor(tileIndex(t.tile) / 9)));
    if (kinds.size !== 2 || !kinds.has(3)) reject("一色と字牌だけの構成ではありません");
    const suit = [...kinds].find((n) => n < 3)!;
    const names = ["萬子", "筒子", "索子"];
    prompt = "最後の手出し後、手牌と副露を合わせた牌の色はどうなっていましたか？";
    summary = `${names[suit]}と字牌だけで構成され、${stage(afterProgress)}でした。`;
    alternatives = [`${names[(suit + 1) % 3]}と字牌だけで構成され、${stage(afterProgress)}でした。`, `${names[(suit + 2) % 3]}と字牌だけで構成され、${stage(afterProgress)}でした。`, `字牌はなく、${names[suit]}だけで構成されていました。`];
    reading = "牌の色が一色と字牌にまとまったという事実と、ホンイツを狙っていたという意図は別です。役が成立するかは完成形で確認します。3→1の切り順だけでホンイツやトイトイを確定することはできません。";
  }
  if (alternatives.length !== 3 || new Set([summary, ...alternatives]).size !== 4) reject("4択が重複しています");
  let score = 70;
  const reasons: string[] = ["個体ID・手牌枚数・前後の進行を復元済み"];
  if (referenceMatched) { score += 20; reasons.push("指定記事・牌譜の注目手順とアンカーを照合"); }
  if (target.topic !== "hand-progress" || beforeProgress !== afterProgress) { score += 10; reasons.push("比較できる手牌変化または連続摸打があります"); }
  if (last.after.tenpai || runLength >= 3) { score += 5; reasons.push("待ち・固定状態を実際の手牌で確認できます"); }
  const isEarly = final.turn < 4 && !steps.some((s) => s.type === "call") && !final.riichi;
  const reviewedRegion = referenceMatched && Boolean(target.focusTiles?.length) && target.topic === "tile-neighborhood";
  if (isEarly) { score -= reviewedRegion ? 10 : 25; reasons.push(reviewedRegion ? "序盤ですが、明示された同色牌の範囲を実牌譜で比較できます" : "序盤のため学習価値を減点"); }
  const qualityFlags: TedashiQuestion["qualityFlags"] = isEarly && !reviewedRegion ? ["tooEarly"] : [];
  const choices = [{ id: "fact", text: summary }, ...alternatives.map((text, i) => ({ id: `alternative-${i + 1}`, text }))];
  const rotate = (target.from + target.to) % 4;
  const question: TedashiQuestion = {
    ...questionSnapshot(log, request, steps, final), id: `${log.source.logId}-${target.topic}-${target.from}-${target.to}${target.focusTiles ? `-${target.focusTiles.join("-")}` : ""}`,
    status: score >= 80 && !qualityFlags.length ? "candidate" : "rejected", difficulty: steps.length > 3 ? "hard" : "normal", qualityFlags,
    analysis: { category: target.topic, clarityScore: 100, summary, reading, focusBlocks: first.before.blocks.filter((b) => b.tiles.includes(first.tile.tile)), retainedMelds: [], followingTsumogiri: runLength, ambiguityReasons: [] },
    prompt, choices: [...choices.slice(rotate), ...choices.slice(0, rotate)], answer: "fact", selection: { score: Math.min(100, score), reasons, priority: source.priority, referenceMatched }, contentHash: ""
  };
  question.contentHash = questionContentHash(question);
  return question;
}

export function collectReadingCandidates(log: ParsedLog, source: ReadingSource) {
  const candidates = new Map<string, TedashiQuestion>();
  const rejected: Array<{ topic: ReadingTopic; from: number; to: number; reason: string }> = [];
  function attempt(target: ReadingTarget, referenceMatched: boolean) {
    try { const q = generateReadingQuestion(log, source, target, referenceMatched); if (!candidates.has(q.id)) candidates.set(q.id, q); }
    catch (error) { if (!(error instanceof CandidateRejected)) throw error; rejected.push({ topic: target.topic, from: target.from, to: target.to, reason: error.message }); }
  }
  source.targets.forEach((target) => attempt(target, true));
  for (const round of log.rounds) {
    for (const player of [0, 1, 2, 3]) {
      const actions = round.events.filter((e): e is Extract<ReplayEvent, { type: "call" | "discard" }> => (e.type === "call" || e.type === "discard") && e.player === player);
      const target = (topic: ReadingTopic, first: typeof actions[number], last = first): ReadingTarget => ({ topic, from: first.sequence, to: last.sequence, expectedFirst: eventPattern(first), expectedLast: eventPattern(last) });
      for (const [index, event] of actions.entries()) {
        const next = actions[index + 1];
        if (event.type === "call") { if (["chi", "pon"].includes(event.meld.kind) && next?.type === "discard") attempt(target("call-progress", event, next), false); continue; }
        if (event.riichi) attempt(target("wait-confirmation", event), false);
        if (event.tsumogiri) continue;
        if (event.handBeforeDraw && event.turn >= 4 && tileIndex(event.tile.tile) < 27 && replayShanten(event.handBeforeDraw, event.snapshots[player]!.melds) !== replayShanten(event.handAfterDiscard, event.snapshots[player]!.melds)) attempt(target("hand-progress", event), false);
        if (event.turn >= 4 && tileIndex(event.tile.tile) < 27) { attempt(target("tile-neighborhood", event), false); attempt(target("hand-composition", event), false); }
        if (event.visibleTiles.some((t) => round.doraIndicators.some((d) => d.id === t.id) && doraFromIndicator(t.tile) === event.tile.tile)) attempt(target("dora-discard", event), false);
        if (replayShanten(event.handAfterDiscard, event.snapshots[player]!.melds) === 0 && (event.handBeforeDraw && replayShanten(event.handBeforeDraw, event.snapshots[player]!.melds) > 0 || event.handBeforeDraw === null)) attempt(target("wait-confirmation", event), false);
        const following = actions.slice(index + 1, index + 6);
        const run: DiscardEvent[] = [];
        for (const item of following) { if (item.type !== "discard" || !item.tsumogiri) break; run.push(item); }
        if (run.length >= 3) attempt(target("tsumogiri-run", event, run.at(-1)!), false);
        const laterTedashi = following.find((item) => item.type === "discard" && !item.tsumogiri);
        if (laterTedashi?.type === "discard" && laterTedashi.turn - event.turn <= 3 && !following.slice(0, following.indexOf(laterTedashi)).some((item) => item.type === "call")) attempt(target("taatsu-drop", event, laterTedashi), false);
      }
    }
  }
  return { candidates: [...candidates.values()], rejected };
}

export function selectReadingQuestions(candidates: TedashiQuestion[], sources: ReadingSource[], limit = 30): TedashiQuestion[] {
  const sourceOrder = new Map(sources.map((s, i) => [s.logId, i]));
  const ready = candidates.filter((q) => sourceOrder.has(q.source.logId) && q.status === "candidate" && q.analysis.clarityScore >= 80 && !q.qualityFlags.length && (q.selection?.score ?? 0) >= 80);
  const ranked = ready.slice().sort((a, b) => Number(Boolean(b.selection?.referenceMatched)) - Number(Boolean(a.selection?.referenceMatched)) || b.selection!.score - a.selection!.score || a.source.eventSequence - b.source.eventSequence || a.id.localeCompare(b.id));
  const selected: TedashiQuestion[] = [];
  const endpoints = new Set<string>();
  const topicCounts = new Map<QuestionCategory, number>();
  const sourceCounts = new Map<string, number>();
  const roundCounts = new Map<string, number>();
  function add(q: TedashiQuestion) {
    const endpoint = `${q.source.logId}:${q.source.eventSequence}`;
    const round = `${q.source.logId}:${q.source.round}:${q.source.honba}`;
    if (selected.length >= limit || endpoints.has(endpoint) || (topicCounts.get(q.analysis.category) ?? 0) >= 6 || (sourceCounts.get(q.source.logId) ?? 0) >= (q.selection!.priority === "S" ? 8 : 5) || !q.selection?.referenceMatched && (roundCounts.get(round) ?? 0) >= 3) return false;
    selected.push(q); endpoints.add(endpoint);
    topicCounts.set(q.analysis.category, (topicCounts.get(q.analysis.category) ?? 0) + 1);
    sourceCounts.set(q.source.logId, (sourceCounts.get(q.source.logId) ?? 0) + 1);
    roundCounts.set(round, (roundCounts.get(round) ?? 0) + 1);
    return true;
  }
  // Cover each supplied log before filling by quality, while limiting repeated topics and endpoints.
  for (const source of sources) for (const q of ranked.filter((q) => q.source.logId === source.logId)) { add(q); if ((sourceCounts.get(source.logId) ?? 0) >= 3) break; }
  for (const q of ranked) add(q);
  return selected.sort((a, b) => sourceOrder.get(a.source.logId)! - sourceOrder.get(b.source.logId)! || a.source.eventSequence - b.source.eventSequence);
}
