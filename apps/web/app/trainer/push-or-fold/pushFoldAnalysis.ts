import { analyzeHandProgress, calculateHandScore, calculateOrasuDraw, emptyCounts, evaluateRiichiLegality, DEFAULT_RIICHI_RULE_CONFIG, handProgressShanten, hasReachedOrasuTarget, ORASU_SEATS, rankOrasuScores, tileIndex, tileName, validateCounts, type Counts34, type HandScoreMeld, type OrasuScores } from "@mahjong-trainer/mahjong-core";
import { replayTile } from "@mahjong-trainer/tenhou-analysis/tiles";
import type { ReplayMeld, ReplayTile } from "@mahjong-trainer/tenhou-analysis/types";
import { doraFromIndicator } from "../call-or-pass/callModel";
import { getTileName, tileAssetName } from "../../components/TileFigures";
import { seats, type PreparedPushFoldQuestion, type PushFoldBranch, type PushFoldOutcome, type PushFoldPlayer, type PushFoldQuestion, type PushFoldValue, type SafetyFacts } from "./pushFoldTypes";

export const countsForTiles = (tiles: readonly ReplayTile[]): Counts34 => {
  const counts = emptyCounts();
  for (const tile of tiles) counts[tileIndex(tile.tile)] += 1;
  return counts;
};
export const scoreMelds = (melds: readonly ReplayMeld[]): HandScoreMeld[] => melds.map((meld) => ({ kind: meld.kind === "chi" ? "chi" : "pon", tiles: meld.tiles.map((tile) => tile.tile) }));
export const selfPlayer = (q: PushFoldQuestion) => q.players.find((player) => player.seat === q.seatWind)!;
export const attackers = (q: PushFoldQuestion) => q.players.filter((player) => player.seat !== q.seatWind && (player.riichi || player.attacking));

export function publicPushFoldTiles(q: PushFoldQuestion): ReplayTile[] {
  // A called river tile remains as a record, but its physical ID counts only once.
  return [...new Map([...q.doraIndicators, ...q.players.flatMap((p) => [...p.river.map((r) => r.tile), ...p.melds.flatMap((m) => m.tiles)])].map((tile) => [tile.id, tile])).values()];
}
export function knownPushFoldTiles(q: PushFoldQuestion) { return [...q.hand, ...publicPushFoldTiles(q)]; }

export function safetyFacts(q: PushFoldQuestion, tile: ReplayTile, opponent: PushFoldPlayer): SafetyFacts {
  const known = countsForTiles(knownPushFoldTiles(q));
  const publicCounts = countsForTiles(publicPushFoldTiles(q));
  const index = tileIndex(tile.tile), rank = index % 9;
  const river = new Set(opponent.river.map((r) => r.tile.tile));
  const genbutsu = river.has(tile.tile);
  // Central suji requires both outside tiles (4 needs 1 AND 7, for example).
  const outside = index < 27 ? [index - 3, index + 3].filter((i) => i >= Math.floor(index / 9) * 9 && i < Math.floor(index / 9) * 9 + 9) : [];
  const suji = outside.length > 0 && outside.every((i) => river.has(tileName(i)));
  const paths: number[][] = [];
  if (index < 27 && rank <= 5) paths.push([index + 1, index + 2]);
  if (index < 27 && rank >= 3) paths.push([index - 2, index - 1]);
  const noChance = [...new Set(paths.flatMap((path) => path.filter((i) => known[i] === 4)))].map(tileName);
  const oneChance = [...new Set(paths.flatMap((path) => path.filter((i) => known[i] === 3)))].map(tileName);
  const labels = [genbutsu ? "現物" : "現物ではない", ...(!genbutsu ? suji ? ["スジ"] : index < 27 ? ["無筋"] : [] : []), ...(noChance.length ? ["カベ・ノーチャンス情報"] : []), ...(oneChance.length ? ["ワンチャンス情報"] : []), ...(index >= 27 ? [`字牌・公開${publicCounts[index]}枚`] : [])];
  const kanchan = index < 27 && rank > 0 && rank < 8 && known[index - 1]! < 4 && known[index + 1]! < 4;
  const penchan = index < 27 && (rank === 2 && known[index - 2]! < 4 && known[index - 1]! < 4 || rank === 6 && known[index + 1]! < 4 && known[index + 2]! < 4);
  const possibleWaits = genbutsu ? [] : [
    ...(known[index]! < 4 ? ["単騎"] : []), ...(known[index]! <= 2 ? ["シャンポン"] : []),
    ...(kanchan ? ["カンチャン"] : []), ...(penchan ? ["ペンチャン"] : []),
    ...(!suji && paths.some((path) => path.every((i) => known[i]! < 4)) ? ["両面"] : []),
    ...(!opponent.melds.length && (index >= 27 || rank === 0 || rank === 8) ? ["国士無双"] : [])
  ];
  return { opponent: opponent.seat, genbutsu, suji, noChance, oneChance, publicCopies: publicCounts[index]!, dora: q.doraIndicators.some((indicator) => doraFromIndicator(indicator.tile) === tile.tile), red: tile.red, possibleWaits, labels,
    reason: genbutsu ? `${opponent.seat}家自身の捨て牌にあるため、この相手からはロンされません。` : `${suji ? "スジは両面待ちに限った情報です。" : "この相手の現物ではありません。"}${noChance.length ? "4枚見えは該当する両面経路だけを消します。" : ""}${oneChance.length ? "3枚見えには残り1枚を相手が持つ余地があります。" : ""}単騎・シャンポンなどまで安全とは保証しません。` };
}

function validateMeld(meld: ReplayMeld, owner: number, q: PushFoldQuestion) {
  if (!["chi", "pon"].includes(meld.kind) || meld.tiles.length !== 3 || !meld.calledTile) throw new Error(`${q.id}: カン・不正副露は対象外`);
  const indexes = meld.tiles.map((tile) => tileIndex(tile.tile)).sort((a, b) => a - b);
  const valid = meld.kind === "pon" ? new Set(indexes).size === 1 : indexes[0]! < 27 && Math.floor(indexes[0]! / 9) === Math.floor(indexes[2]! / 9) && indexes[1] === indexes[0]! + 1 && indexes[2] === indexes[1]! + 1;
  if (!valid || meld.from === owner || !Number.isInteger(meld.from) || meld.from < 0 || meld.from > 3 || (meld.kind === "chi" && meld.from !== (owner + 3) % 4) || !meld.tiles.some((tile) => tile.id === meld.calledTile!.id)) throw new Error(`${q.id}: 副露の形・取得元が不正`);
  const original = q.players[meld.from]!.river.filter((r) => r.tile.id === meld.calledTile!.id && r.calledBy === owner);
  if (original.length !== 1) throw new Error(`${q.id}: 鳴かれた河の記録が不正`);
}

export function validatePushFoldSnapshot(q: PushFoldQuestion): void {
  if (!Object.keys({ distance: 1, value: 1, shape: 1, defense: 1, attacks: 1, conditions: 1, endgame: 1 }).includes(q.category) || !["clear", "lean_push", "lean_fold", "debatable"].includes(q.recommendationStrength) || q.scores.length !== 4) throw new Error(`${q.id}: 分類・判定・点数の構造が不正`);
  if (!q.id || q.version !== 1 || !["beginner", "intermediate", "advanced"].includes(q.difficulty) || q.review.status !== "verified") throw new Error(`${q.id}: 未確認の問題`);
  if (!seats.includes(q.seatWind) || !["東", "南"].includes(q.roundWind) || !Number.isInteger(q.roundNumber) || q.roundNumber < 1 || q.roundNumber > 4 || !Number.isInteger(q.turn) || q.turn < 2 || q.turn > 18) throw new Error(`${q.id}: 局・巡目が不正`);
  if (q.players.length !== 4 || q.players.some((p, i) => p.seat !== seats[i])) throw new Error(`${q.id}: 席が重複または不正`);
  if (q.scores.some((score) => !Number.isInteger(score) || score < 0 || score % 100) || !Number.isInteger(q.riichiSticks) || q.riichiSticks < 0 || q.scores.reduce((a, b) => a + b, 0) + q.riichiSticks * 1000 !== 100000 || !Number.isInteger(q.honba) || q.honba < 0) throw new Error(`${q.id}: 点棒・供託が不正`);
  if (selfPlayer(q).riichi || !attackers(q).length || q.doraIndicators.length !== 1 || !Number.isInteger(q.wallTilesRemaining) || q.wallTilesRemaining < 0 || q.wallTilesRemaining > 69) throw new Error(`${q.id}: 対象外の局面`);
  if (!q.rules.redFives || !q.rules.openTanyao || q.rules.tiePolicy !== "strict" || q.rules.agariYame) throw new Error(`${q.id}: 対象外のルール`);
  validateCounts(countsForTiles(q.hand), 14 - selfPlayer(q).melds.length * 3);
  if (!q.hand.some((tile) => tile.id === q.drawnTileId)) throw new Error(`${q.id}: ツモ牌が手牌にない`);
  const occurrences = new Map<number, string[]>();
  const add = (tile: ReplayTile, location: string) => {
    const canonical = replayTile(tile.id);
    if (canonical.tile !== tile.tile || canonical.red !== tile.red) throw new Error(`${q.id}: 個体IDと赤牌が不一致`);
    occurrences.set(tile.id, [...(occurrences.get(tile.id) ?? []), location]);
  };
  q.hand.forEach((tile) => add(tile, "hand")); q.doraIndicators.forEach((tile) => add(tile, "indicator"));
  q.players.forEach((player, i) => {
    if (player.river.length < 1 || player.river.some((r, j) => r.turn !== j + 1 || r.sequence !== i * 100 + j)) throw new Error(`${q.id}: 河の順序が不正`);
    for (const river of player.river) {
      add(river.tile, `river:${i}`);
      if (river.calledBy !== null && !q.players[river.calledBy]?.melds.some((meld) => meld.from === i && meld.calledTile?.id === river.tile.id)) throw new Error(`${q.id}: 取得元に対応する副露がない`);
    }
    player.melds.forEach((meld) => { validateMeld(meld, i, q); meld.tiles.forEach((tile) => add(tile, `meld:${i}`)); });
    if (player.riichi) {
      const declaration = player.river.find((r) => r.tile.id === player.riichi!.tileId);
      if (player.melds.length || !declaration?.riichi || declaration.calledBy !== null || declaration.turn !== player.riichi.turn || player.river.filter((r) => r.riichi).length !== 1 || player.river.some((r) => r.turn > declaration.turn && !r.tsumogiri)) throw new Error(`${q.id}: 不正なリーチ状態`);
    } else if (player.river.some((r) => r.riichi)) throw new Error(`${q.id}: リーチ宣言の対応がない`);
  });
  for (const [id, places] of occurrences) {
    if (places.length === 1) continue;
    const river = q.players.flatMap((p) => p.river).find((r) => r.tile.id === id);
    if (places.length !== 2 || !places.some((p) => p.startsWith("river:")) || !places.some((p) => p.startsWith("meld:")) || river?.calledBy === null) throw new Error(`${q.id}: 物理牌の二重使用`);
  }
  validateCounts(countsForTiles(knownPushFoldTiles(q)));
  if (q.players.filter((p) => p.riichi).length > q.riichiSticks) throw new Error(`${q.id}: リーチ棒が不足`);
  if (selfPlayer(q).river.length !== q.turn - 1 || q.targetRank && (q.roundWind !== "南" || q.roundNumber !== 4)) throw new Error(`${q.id}: 巡目・着順目標が不正`);
  if (!q.acceptableActions.includes(q.recommendedAction) || q.acceptableActions.some((a) => !["push", "fold"].includes(a)) || q.recommendationStrength === "clear" && q.acceptableActions.length !== 1) throw new Error(`${q.id}: 別解の設定が不正`);
  for (const action of ["push", "fold"] as const) if (!q.discards[action].length || q.discards[action].some((id) => !q.hand.some((tile) => tile.id === id))) throw new Error(`${q.id}: 推奨打牌が手牌にない`);
  if (!q.reasoning.length || !q.changes.length || !q.sources.length || !q.review.method || !q.review.at || !q.valuePlan || [...q.reasoning, ...q.pushBenefits, ...q.pushRisks, ...q.foldBenefits, ...q.foldCosts].some((text) => /放銃率.*\d.*[%％]|相手.*(?:必ず|確定で)テンパイ|相手の待ちは/.test(text))) throw new Error(`${q.id}: 根拠不足または未確認情報の断定`);
}

function analyzeDiscard(q: PushFoldQuestion, discard: ReplayTile): PushFoldBranch {
  const hand = q.hand.filter((tile) => tile.id !== discard.id), counts = countsForTiles(hand);
  const knownTiles = knownPushFoldTiles(q), known = countsForTiles(knownTiles), melds = selfPlayer(q).melds;
  const progress = analyzeHandProgress(counts, melds.length, known);
  const furiten = progress.shanten === 0 && progress.waits.some((tile) => [...selfPlayer(q).river.map((r) => r.tile.tile), discard.tile].includes(tile));
  const legality = evaluateRiichiLegality({ counts, melds: scoreMelds(melds).map((m) => ({ kind: m.kind === "chi" ? "chi" : "pon", tiles: m.tiles })), availableCounts: known.map((count) => 4 - count), ownDiscards: countsForTiles([...selfPlayer(q).river.map((r) => r.tile), discard]), wallTilesRemaining: q.wallTilesRemaining, points: q.scores[seats.indexOf(q.seatWind)], ruleConfig: { ...DEFAULT_RIICHI_RULE_CONFIG, allowFuritenRiichi: true } });
  const allHand = [...hand, ...melds.flatMap((m) => m.tiles)];
  const doras = q.doraIndicators.map((t) => doraFromIndicator(t.tile));
  const dora = allHand.filter((t) => doras.includes(t.tile)).length, redDora = allHand.filter((t) => t.red).length;
  const taken = new Set(knownTiles.map((tile) => tile.id));
  const values = progress.shanten === 0 ? progress.waits.flatMap((tile) => ([false, true] as const).flatMap((red) => {
    const possible = Array.from({ length: 4 }, (_, copy) => replayTile(tileIndex(tile) * 4 + copy)).filter((t) => t.red === red && !taken.has(t.id));
    if (!possible.length) return [];
    const score = (method: "ron" | "tsumo"): PushFoldValue | null => {
      if (method === "ron" && furiten) return null;
      const won = counts.slice(); won[tileIndex(tile)] += 1;
      try {
        const result = calculateHandScore({ counts: won, melds: scoreMelds(melds), winningTile: tile, isDealer: q.seatWind === "東", winMethod: method, roundWind: q.roundWind, seatWind: q.seatWind, riichi: q.declareRiichi && q.discards.push.includes(discard.id), dora: dora + redDora + (doras.includes(tile) ? 1 : 0) + Number(red), honba: q.honba, riichiSticks: 0 });
        return { ...result.score, yaku: result.yaku.map((yaku) => yaku.name) };
      } catch (error) { if (error instanceof Error && error.message === "役がありません。") return null; throw error; }
    };
    return [{ tile, red, remaining: possible.length, ron: score("ron"), tsumo: score("tsumo") }];
  })) : [];
  const safety = attackers(q).map((opponent) => safetyFacts(q, discard, opponent));
  const meldYaku = melds.filter((m) => m.kind === "pon" && ["白", "發", "中", q.seatWind, q.roundWind].includes(m.tiles[0]!.tile)).map((m) => `役牌：${m.tiles[0]!.tile}${m.tiles[0]!.tile === q.seatWind && m.tiles[0]!.tile === q.roundWind ? "（連風牌・2翻）" : "（1翻）"}`);
  return { discard, hand, counts, ...progress, values, furiten, canRiichi: legality.legal, dora, redDora, meldYaku, safety, safeToAll: safety.every((fact) => fact.genbutsu) };
}

function winningOutcomes(q: PushFoldQuestion, branch: PushFoldBranch): PushFoldOutcome[] {
  if (!q.targetRank) return [];
  const selfSeat = ORASU_SEATS[seats.indexOf(q.seatWind)]!;
  return branch.values.flatMap((wait) => ORASU_SEATS.flatMap((from) => {
    const isTsumo = from === selfSeat, value = isTsumo ? wait.tsumo : wait.ron;
    if (!value) return [];
    const scores = Object.fromEntries(ORASU_SEATS.map((seat, i) => [seat, q.scores[i]])) as OrasuScores;
    const deposit = q.declareRiichi ? 1000 : 0;
    scores[selfSeat] -= deposit;
    if (isTsumo) {
      for (const seat of ORASU_SEATS) if (seat !== selfSeat) scores[seat] -= value.payments[q.seatWind === "東" || seat !== "east" ? 0 : 1]!.points;
    } else scores[from] -= value.payments[0]!.points;
    scores[selfSeat] += value.totalPoints + q.riichiSticks * 1000 + deposit;
    const current = rankOrasuScores(scores).find((row) => row.seat === selfSeat)!;
    return [{ label: `${getTileName(tileAssetName(wait.tile, wait.red))}で${isTsumo ? "ツモ" : `${seats[ORASU_SEATS.indexOf(from)]}家からロン`}`, scores, rank: current.rank, tied: current.tied, achieved: hasReachedOrasuTarget(scores, selfSeat, q.targetRank!, q.rules.tiePolicy), dealerContinues: selfSeat === "east" }];
  }));
}

export function preparePushFoldQuestion(q: PushFoldQuestion): PreparedPushFoldQuestion {
  validatePushFoldSnapshot(q);
  if (handProgressShanten(countsForTiles(q.hand), selfPlayer(q).melds.length) < 0) throw new Error(`${q.id}: アガリ形は出題しない`);
  const branches = q.hand.map((tile) => analyzeDiscard(q, tile));
  const push = branches.find((branch) => branch.discard.id === q.discards.push[0])!;
  if (q.discards.push.some((id) => branches.find((b) => b.discard.id === id)!.shanten !== q.expected.pushShanten)) throw new Error(`${q.id}: 解説のシャンテン数が不一致`);
  if (q.expected.waits && [...push.waits].sort().join() !== [...q.expected.waits].sort().join()) throw new Error(`${q.id}: 解説の待ちが不一致`);
  const ron = push.values.flatMap((wait) => wait.ron ? [wait.ron.totalPoints] : []);
  if (q.expected.minimumRon !== undefined && (!ron.length || Math.min(...ron) !== q.expected.minimumRon) || q.expected.maximumRon !== undefined && (!ron.length || Math.max(...ron) !== q.expected.maximumRon)) throw new Error(`${q.id}: 解説の打点が不一致`);
  if (q.declareRiichi && q.discards.push.some((id) => !branches.find((b) => b.discard.id === id)!.canRiichi)) throw new Error(`${q.id}: 押す枝のリーチが不正`);
  if (q.discards.fold.some((id) => !branches.find((b) => b.discard.id === id)!.safeToAll)) throw new Error(`${q.id}: オリる候補が攻撃者全員の現物ではない`);
  const scores = Object.fromEntries(ORASU_SEATS.map((seat, i) => [seat, q.scores[i]])) as OrasuScores;
  const selfSeat = ORASU_SEATS[seats.indexOf(q.seatWind)]!;
  const confirmed = q.players.filter((p) => p.riichi).map((p) => ORASU_SEATS[seats.indexOf(p.seat)]!);
  const unknown = ORASU_SEATS.filter((seat) => seat !== selfSeat && !confirmed.includes(seat));
  const drawCases = Array.from({ length: 2 ** unknown.length }, (_, mask) => {
    const tenpai = [...confirmed, ...unknown.filter((_, i) => mask & (1 << i))];
    const pushedScores = { ...scores, [selfSeat]: scores[selfSeat] - (q.declareRiichi ? 1000 : 0) };
    const pushed = calculateOrasuDraw(pushedScores, [...tenpai, ...(push.shanten === 0 ? [selfSeat] : [])]);
    const folded = calculateOrasuDraw(scores, tenpai);
    return { label: `他家${tenpai.length}人テンパイの場合`, pushGain: pushed.postScores[selfSeat] - scores[selfSeat], foldLoss: folded.postScores[selfSeat] - scores[selfSeat], pushRank: pushed.postRanking.find((r) => r.seat === selfSeat)!.rank, foldRank: folded.postRanking.find((r) => r.seat === selfSeat)!.rank };
  });
  return { question: q, branches, ranking: rankOrasuScores(scores).map((r) => ({ ...r, seat: seats[ORASU_SEATS.indexOf(r.seat)]! })), safeCopies: branches.filter((b) => b.safeToAll).length, outcomes: winningOutcomes(q, push), drawCases,
    checkerHref: selfPlayer(q).melds.length ? null : `/analysis/mahjong-tool?${new URLSearchParams({ hand: countsForTiles(q.hand).join(",") })}` };
}
