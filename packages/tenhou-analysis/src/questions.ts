import { createHash } from "node:crypto";
import { analyzeHandProgress, handProgressShanten, emptyCounts, extractHandBlocks, normalShantenWithOpenMelds, standardHandDecompositions, tileIndex, tileName, type Counts34, type Tile } from "@mahjong-trainer/mahjong-core";
import type { DiscardEvent, HandAnalysis, HandBlock, ParsedLog, ReplayMeld, ReplayTile, TedashiQuestion } from "./types";

export { CATEGORY_LABELS } from "./labels";
const countsOf = (tiles: ReplayTile[]) => { const counts = emptyCounts(); tiles.forEach((tile) => { counts[tileIndex(tile.tile)] += 1; }); return counts; };
export function replayShanten(hand: ReplayTile[], melds: ReplayMeld[] = []): number {
  const counts = countsOf(hand);
  return handProgressShanten(counts, melds.length);
}

export function blockCandidates(counts: Counts34): HandBlock[] {
  const blocks: HandBlock[] = [];
  const add = (kind: HandBlock["kind"], indices: number[]) => blocks.push({ kind, tiles: indices.map(tileName) });
  for (let i = 0; i < 34; i += 1) {
    if (!counts[i]) continue;
    if (counts[i]! >= 3) add("triplet", [i, i, i]);
    if (counts[i]! >= 2) add("pair", [i, i]);
    if (i < 27) {
      if (i % 9 <= 6 && counts[i + 1] && counts[i + 2]) add("sequence", [i, i + 1, i + 2]);
      if (i % 9 <= 7 && counts[i + 1]) add(i % 9 === 0 || i % 9 === 7 ? "penchan" : "ryanmen", [i, i + 1]);
      if (i % 9 <= 6 && counts[i + 2]) add("kanchan", [i, i + 2]);
    }
    if (counts[i] === 1 && (i >= 27 || ![-2, -1, 1, 2].some((offset) => Math.floor((i + offset) / 9) === Math.floor(i / 9) && counts[i + offset]! > 0))) add("isolated", [i]);
  }
  return blocks;
}

// Components include all ranks within two steps, so a retained sequence cannot silently overlap a neighbouring taatsu.
export function tileComponents(hand: ReplayTile[]): ReplayTile[][] {
  const byKind = new Map<number, ReplayTile[]>();
  for (const tile of hand) { const i = tileIndex(tile.tile); const group = byKind.get(i) ?? []; group.push(tile); byKind.set(i, group); }
  const result: ReplayTile[][] = [];
  for (const index of [...byKind.keys()].sort((a, b) => a - b)) {
    const previous = result.at(-1);
    const previousIndex = previous ? tileIndex(previous.at(-1)!.tile) : -100;
    if (index < 27 && previousIndex < 27 && Math.floor(index / 9) === Math.floor(previousIndex / 9) && index - previousIndex <= 2) previous!.push(...byKind.get(index)!);
    else result.push([...byKind.get(index)!]);
  }
  return result;
}

function simpleMeld(component: ReplayTile[]): HandBlock | null {
  if (component.length !== 3) return null;
  const candidates = blockCandidates(countsOf(component)).filter((b) => b.kind === "sequence" || b.kind === "triplet");
  return candidates.length === 1 ? candidates[0]! : null;
}

export function analyzeReplayHand(hand: ReplayTile[], melds: ReplayMeld[], visible: ReplayTile[]): HandAnalysis {
  const counts = countsOf(hand);
  const blocks = blockCandidates(counts);
  const shanten = replayShanten(hand, melds);
  const known = new Map([...hand, ...melds.flatMap((meld) => meld.tiles), ...visible].map((tile) => [tile.id, tile]));
  const knownCounts = countsOf([...known.values()]);
  const progress = analyzeHandProgress(counts, melds.length, knownCounts);
  const ukeire = progress.ukeire.map((item) => item.tile);
  const waits = progress.waits;
  // Reuse the existing disjoint block evaluator for structural statistics, not a second shanten engine.
  const structural = extractHandBlocks(counts);
  if (structural.melds > 4) throw new Error("手牌ブロックが不正です");
  let waitKind: HandAnalysis["waitKind"] = shanten === 0 ? "other" : null;
  if (shanten === 0 && waits.length === 1 && counts[tileIndex(waits[0]!)] === 1) {
    const won = counts.slice(); won[tileIndex(waits[0]!)] += 1;
    const decompositions = standardHandDecompositions(won, melds.map((meld) => ({ kind: meld.kind === "daiminkan" || meld.kind === "kakan" ? "kan" : meld.kind, tiles: meld.tiles.map((tile) => tile.tile) })));
    if (decompositions.length && decompositions.every((d) => d.pair.tiles[0] === waits[0])) waitKind = "tanki";
  }
  return { shanten, normalShanten: normalShantenWithOpenMelds(counts, melds.length), tenpai: shanten === 0, waits, waitKind, blocks, blockStructure: structural, meldCandidates: blocks.filter((b) => ["sequence", "triplet"].includes(b.kind)), taatsuCandidates: blocks.filter((b) => ["ryanmen", "penchan", "kanchan"].includes(b.kind)), headCandidates: blocks.filter((b) => b.kind === "pair").map((b) => b.tiles[0]!), isolated: blocks.filter((b) => b.kind === "isolated").map((b) => b.tiles[0]!), ukeire, ukeireCount: ukeire.reduce((sum, tile) => sum + 4 - knownCounts[tileIndex(tile)]!, 0), ukeireBasis: "own-hand-and-public-tiles" };
}

export function questionContentHash(question: Omit<TedashiQuestion, "contentHash"> | TedashiQuestion): string {
  const { status: _status, review: _review, contentHash: _hash, ...content } = question as TedashiQuestion;
  return createHash("sha256").update(JSON.stringify(content)).digest("hex");
}

function blockText(block: HandBlock): string { return block.tiles.join("・"); }
export function generateTedashiQuestions(log: ParsedLog): TedashiQuestion[] {
  const questions: TedashiQuestion[] = [];
  for (const round of log.rounds) {
    const discards = round.events.filter((event): event is DiscardEvent => event.type === "discard");
    for (const event of discards) {
      if (event.tsumogiri || !event.handBeforeDraw) continue;
      const state = event.snapshots[event.player]!;
      const melds = state.melds;
      const before = analyzeReplayHand(event.handBeforeDiscard, melds, event.visibleTiles);
      const after = analyzeReplayHand(event.handAfterDiscard, melds, event.visibleTiles);
      const shantenBeforeDraw = replayShanten(event.handBeforeDraw, melds);
      const affected = tileComponents(event.handBeforeDiscard).find((c) => c.some((tile) => tile.id === event.tile.id))!;
      const retained = simpleMeld(affected.filter((tile) => tile.id !== event.tile.id));
      const newMelds = tileComponents(event.handAfterDiscard).map(simpleMeld).filter((b): b is HandBlock => b !== null).filter((block) => {
        const beforeCounts = countsOf(event.handBeforeDraw!);
        for (const tile of block.tiles) { beforeCounts[tileIndex(tile)] -= 1; }
        return beforeCounts.some((n) => n < 0);
      });
      const drawn = event.handBeforeDiscard.find((tile) => !event.handBeforeDraw!.some((old) => old.id === tile.id));
      if (!drawn) continue;
      let category: TedashiQuestion["analysis"]["category"];
      let summary: string;
      if (retained && affected.length === 4) {
        category = "meld-retained"; summary = `${event.tile.tile}を手出しし、${blockText(retained)}の完成面子候補が残りました。`;
      } else if (after.shanten === 0 && shantenBeforeDraw > 0) {
        category = "tenpai-progress"; summary = `${drawn.tile}をツモして${event.tile.tile}を手出しし、${shantenBeforeDraw}シャンテンからテンパイへ進みました。`;
      } else if (newMelds.length === 1) {
        category = "meld-completed"; summary = `${drawn.tile}のツモにより${blockText(newMelds[0]!)}の完成面子候補ができ、${event.tile.tile}を手出ししました。`;
      } else if (affected.length === 1 && tileIndex(event.tile.tile) < 27 && event.turn >= 4) {
        category = "isolated-removed"; summary = `手牌内で対子やターツにつながっていなかった${event.tile.tile}を手出しし、ツモ牌${drawn.tile}が手牌に残りました。`;
      } else continue;
      const reasons: string[] = [];
      const checked = category === "meld-retained" ? [affected.filter((t) => t.id !== event.tile.id)] : tileComponents(event.handAfterDiscard);
      if (checked.some((c) => blockCandidates(countsOf(c)).filter((b) => ["sequence", "triplet"].includes(b.kind)).length > 1)) reasons.push("重なり合う複数の完成面子候補があります");
      if (melds.length) reasons.push("副露・カンを含む局面はMVPの出題対象外です");
      const qualityFlags: TedashiQuestion["qualityFlags"] = [];
      if (reasons.some((r) => r.includes("重なり"))) qualityFlags.push("ambiguousShape");
      if (melds.length) qualityFlags.push("complexCall");
      if (event.turn < 4) qualityFlags.push("tooEarly");
      if (category === "isolated-removed" && event.turn < 6) qualityFlags.push("lowLearningValue");
      let followingTsumogiri = 0;
      for (const next of discards.filter((d) => d.player === event.player && d.sequence > event.sequence)) {
        if (!next.tsumogiri || next.snapshots[event.player]!.melds.length !== melds.length || next.handAfterDiscard.map((t) => t.id).join() !== event.handAfterDiscard.map((t) => t.id).join()) break;
        followingTsumogiri += 1;
      }
      const clarityScore = Math.max(0, 100 - (qualityFlags.includes("ambiguousShape") ? 50 : 0) - (qualityFlags.includes("complexCall") ? 40 : 0) - (qualityFlags.includes("tooEarly") ? 25 : 0) - (qualityFlags.includes("lowLearningValue") ? 25 : 0));
      const id = `${log.source.logId}-r${round.info.index}-p${event.player}-e${event.sequence}`;
      const choices = [
        { id: "fact", text: summary },
        { id: "tsumogiri", text: `${event.tile.tile}はツモ切りで、ツモ前の手牌はそのまま残った。` },
        { id: "draw-removed", text: `今回ツモした${drawn.tile}の個体が手牌から取り除かれた。` },
        { id: "fourteen", text: "打牌直後も門前の手牌は14枚のままだった。" }
      ];
      const offset = [...id].reduce((sum, char) => sum + char.charCodeAt(0), 0) % 4;
      const rotated = [...choices.slice(offset), ...choices.slice(0, offset)];
      const focusDiscard = state.river.at(-1)!;
      const question: TedashiQuestion = {
        id, status: clarityScore >= 80 && qualityFlags.length === 0 ? "candidate" : "rejected",
        source: { ...log.source, platform: "tenhou", table: log.table, round: round.info.round, honba: round.info.honba, seat: tileName(27 + (event.player - round.info.dealer + 4) % 4), player: event.player, turn: event.turn, eventSequence: event.sequence, doraIndicators: event.visibleTiles.filter((t) => round.doraIndicators.some((d) => d.id === t.id)) },
        river: structuredClone(state.river), focusDiscard: structuredClone(focusDiscard),
        actual: { handBeforeDraw: event.handBeforeDraw, handBefore: event.handBeforeDiscard, handAfter: event.handAfterDiscard, drawnTile: drawn, melds, before, after, shantenBeforeDraw },
        analysis: { category, clarityScore, summary, reading: followingTsumogiri ? `この手出しの後、同じ手牌のまま${followingTsumogiri}回ツモ切りが続いたことを牌譜で確認できます。実戦では手牌が見えないため、最後の手出しは候補を絞る材料として使い、形や待ちを断定しません。` : "手出しでは、ツモした個体を残し、以前から持っていた個体を切っています。どの形が残ったかは河だけでは決まらず、複数の候補を考える必要があります。", focusBlocks: before.blocks.filter((b) => b.tiles.includes(event.tile.tile)), retainedMelds: retained ? [retained] : [], followingTsumogiri, ambiguityReasons: reasons },
        difficulty: category === "tenpai-progress" ? "normal" : "easy", qualityFlags,
        prompt: `この${event.tile.tile}の手出しによって、実際の手牌では何が起きていましたか？`, choices: rotated, answer: "fact", contentHash: ""
      };
      question.contentHash = questionContentHash(question);
      questions.push(question);
    }
  }
  return questions;
}
