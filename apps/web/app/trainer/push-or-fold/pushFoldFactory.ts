import { analyzeHandProgress, countsToTiles, createSeededRandom, DEFAULT_RIICHI_RULE_CONFIG, evaluateRiichiLegality, parseHand, tileIndex, tileName, validateCounts, type Tile } from "@mahjong-trainer/mahjong-core";
import { replayTile } from "@mahjong-trainer/tenhou-analysis";
import type { ReplayMeld, ReplayTile } from "@mahjong-trainer/tenhou-analysis/types";
import type { CallDifficulty } from "../call-or-pass/callModel";
import { countsForTiles, knownPushFoldTiles, selfPlayer, validatePushFoldSnapshot } from "./pushFoldAnalysis";
import { seats, type PushFoldCategory, type PushFoldPlayer, type PushFoldQuestion, type Wind } from "./pushFoldTypes";

export type PushFoldAudit = { hands: ReplayTile[][]; deadWall: ReplayTile[]; wall: ReplayTile[] };
export type PushFoldSpec = {
  id: string; difficulty: CallDifficulty; category: PushFoldCategory; title: string;
  hand: string; drawn: Tile; push: Tile; fold: Tile[]; shanten: number;
  turn: number; seat?: Wind; round?: "東" | "南"; roundNumber?: number;
  scores?: [number, number, number, number]; honba?: number; indicator?: Tile; redHand?: Tile[];
  attackSeats?: Wind[]; openAttacker?: Wind;
  selfMeld?: { tiles: string; kind: "pon" | "chi"; from: Wind };
  riverFacts?: Partial<Record<Wind, string>>;
  action: PushFoldQuestion["recommendedAction"]; strength?: PushFoldQuestion["recommendationStrength"];
  alternative?: boolean; riichi?: boolean; target?: 1 | 2 | 3;
  context: string; valuePlan: string; reason: string; change: string;
};

export function validatePushFoldAudit(q: PushFoldQuestion, audit: PushFoldAudit) {
  validatePushFoldSnapshot(q);
  if (audit.hands.length !== 4 || audit.deadWall.length !== 13 || audit.wall.length !== q.wallTilesRemaining) throw new Error(`${q.id}: 山・隠れた手牌の枚数が不正`);
  const all = [...knownPushFoldTiles(q), ...audit.hands.flat(), ...audit.deadWall, ...audit.wall];
  if (all.length !== 136 || new Set(all.map((tile) => tile.id)).size !== 136 || all.some((t) => JSON.stringify(replayTile(t.id)) !== JSON.stringify(t))) throw new Error(`${q.id}: 136枚の配分が不正`);
  q.players.forEach((player, i) => {
    if (player.seat === q.seatWind) { if (audit.hands[i]!.length) throw new Error(`${q.id}: 自分の手牌を二重計上`); return; }
    validateCounts(countsForTiles(audit.hands[i]!), 13 - player.melds.length * 3);
    if (player.riichi) {
      const own = player.river.filter((r) => r.turn <= player.riichi!.turn).map((r) => r.tile);
      const known = countsForTiles([...knownPushFoldTiles(q), ...audit.hands[i]!]);
      const legality = evaluateRiichiLegality({ counts: countsForTiles(audit.hands[i]!), ownDiscards: countsForTiles(own), availableCounts: known.map((n) => 4 - n), points: q.scores[i]! + 1000, wallTilesRemaining: q.wallTilesRemaining + (player.river.length - player.riichi.turn) * 4, ruleConfig: { ...DEFAULT_RIICHI_RULE_CONFIG, allowFuritenRiichi: true } });
      if (!legality.legal) throw new Error(`${q.id}: リーチの手牌・持ち点・山が不正`);
    }
  });
}

export function makePushFoldQuestion(spec: PushFoldSpec): { question: PushFoldQuestion; audit: PushFoldAudit } {
  const random = createSeededRandom(spec.id);
  const remaining = new Set(Array.from({ length: 136 }, (_, id) => id));
  const reservedWaits = new Set<number>();
  const available = (tile: Tile) => [...remaining].filter((id) => Math.floor(id / 4) === tileIndex(tile));
  const take = (tile: Tile, red = false) => {
    const id = available(tile).find((id) => replayTile(id).red === red);
    if (id === undefined) throw new Error(`${spec.id}: 牌不足 ${tile}${red ? "赤" : ""}`);
    remaining.delete(id); return replayTile(id);
  };
  const takeId = (id: number) => { if (!remaining.delete(id)) throw new Error(`${spec.id}: 個体の重複`); return replayTile(id); };
  const selfSeat = spec.seat ?? "南", selfIndex = seats.indexOf(selfSeat);
  const attackSeats = spec.attackSeats ?? [selfSeat === "東" ? "南" : "東"];
  const players: PushFoldPlayer[] = seats.map((seat) => ({ seat, river: [], melds: [], riichi: null, attacking: attackSeats.includes(seat) }));
  const self = players[selfIndex]!;
  const redWanted = [...(spec.redHand ?? [])];
  const hand = countsToTiles(parseHand(spec.hand)).map((tile) => { const redIndex = redWanted.indexOf(tile); if (redIndex >= 0) redWanted.splice(redIndex, 1); return take(tile, redIndex >= 0); });
  if (redWanted.length) throw new Error(`${spec.id}: 赤牌が手牌にない`);
  const drawn = take(spec.drawn); hand.push(drawn);
  const indicator = take(spec.indicator ?? "白");
  const addRiver = (playerIndex: number, tile: ReplayTile, calledBy: number | null = null) => {
    const player = players[playerIndex]!, j = player.river.length;
    player.river.push({ tile, turn: j + 1, sequence: playerIndex * 100 + j, tsumogiri: false, riichi: false, calledBy });
  };
  const addMeld = (owner: number, definition: { tiles: string; kind: "pon" | "chi"; from: Wind }) => {
    const from = seats.indexOf(definition.from);
    const tiles = countsToTiles(parseHand(definition.tiles)).map((tile) => take(tile));
    const called = tiles[0]!;
    players[owner]!.melds.push({ kind: definition.kind, tiles, calledTile: called, from });
    addRiver(from, called, owner);
  };
  if (spec.selfMeld) addMeld(selfIndex, spec.selfMeld);
  if (spec.openAttacker) {
    const owner = seats.indexOf(spec.openAttacker);
    addMeld(owner, { tiles: "中中中", kind: "pon", from: seats[(owner + 3) % 4]! });
    addMeld(owner, { tiles: "999p", kind: "pon", from: seats[(owner + 1) % 4]! });
  }
  // Deliberately supplied facts drive the safety lesson; filler never determines an answer.
  players.forEach((player, i) => {
    const facts = countsToTiles(parseHand(spec.riverFacts?.[player.seat] ?? ""));
    if (attackSeats.includes(player.seat)) for (const safe of spec.fold) if (!facts.includes(safe) && !player.river.some((r) => r.tile.tile === safe)) facts.push(safe);
    for (const tile of facts) addRiver(i, take(tile));
  });
  const pushTile = hand.find((tile) => tile.tile === spec.push && !tile.red) ?? hand.find((tile) => tile.tile === spec.push);
  if (!pushTile) throw new Error(`${spec.id}: 押す牌がない`);
  const pushHand = hand.filter((tile) => tile.id !== pushTile.id);
  const progress = analyzeHandProgress(countsForTiles(pushHand), self.melds.length);
  const shuffle = <T>(items: T[]) => {
    for (let i = items.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [items[i], items[j]] = [items[j]!, items[i]!]; } return items;
  };
  const witness = (): ReplayTile[] => {
    const counts = Array.from({ length: 34 }, (_, i) => available(tileName(i)).filter((id) => !reservedWaits.has(id)).length);
    const groups = shuffle([...Array.from({ length: 34 }, (_, i) => [i, i, i]), ...Array.from({ length: 21 }, (_, i) => { const first = Math.floor(i / 7) * 9 + i % 7; return [first, first + 1, first + 2]; })]);
    let visits = 0;
    const search = (selected: number[], depth: number): number[] | null => {
      if (++visits > 3000) return null;
      if (depth === 4) {
        const single = shuffle(Array.from({ length: 34 }, (_, i) => i)).find((i) => counts[i]! >= 2);
        return single === undefined ? null : [...selected, single];
      }
      for (const group of groups) {
        const demand = group.reduce<Record<number, number>>((map, i) => ({ ...map, [i]: (map[i] ?? 0) + 1 }), {});
        if (!Object.entries(demand).every(([i, n]) => counts[Number(i)]! >= n)) continue;
        group.forEach((i) => counts[i]!--);
        const found = search([...selected, ...group], depth + 1);
        if (found) return found;
        group.forEach((i) => counts[i]!++);
      }
      return null;
    };
    const indexes = search([], 0);
    if (!indexes) throw new Error(`${spec.id}: リーチ検証用の合法テンパイが作れない`);
    const tiles = indexes.map((index) => takeId(available(tileName(index)).find((id) => !reservedWaits.has(id))!));
    const wait = tileName(indexes[indexes.length - 1]!);
    const live = available(wait).find((id) => !reservedWaits.has(id));
    if (live === undefined) throw new Error(`${spec.id}: リーチの待ち牌が不足`);
    reservedWaits.add(live);
    return tiles;
  };
  const auditHands = players.map((player) => player.seat === selfSeat ? [] : attackSeats.includes(player.seat) && player.seat !== spec.openAttacker ? witness() : []);
  players.forEach((player, i) => {
    if (player.seat === selfSeat || auditHands[i]!.length) return;
    auditHands[i] = shuffle([...remaining].filter((id) => !reservedWaits.has(id))).slice(0, 13 - player.melds.length * 3).map(takeId);
  });
  players.forEach((player, i) => {
    const targetCount = spec.turn - (i < selfIndex ? 0 : 1);
    if (player.river.length > targetCount) throw new Error(`${spec.id}: 河が巡目を超える`);
    const banned = new Set([...progress.waits, spec.push]);
    while (player.river.length < targetCount) {
      const candidates = shuffle([...remaining]).filter((id) => !reservedWaits.has(id) && !banned.has(replayTile(id).tile));
      const id = candidates[0];
      if (id === undefined) throw new Error(`${spec.id}: 河の教材用牌が不足`);
      addRiver(i, takeId(id));
    }
    if (attackSeats.includes(player.seat) && player.seat !== spec.openAttacker) {
      const index = Math.min(4, player.river.length - 2);
      const declaration = player.river[index]!;
      if (declaration.calledBy !== null) throw new Error(`${spec.id}: 宣言牌は鳴かれない設定`);
      declaration.riichi = true;
      player.riichi = { tileId: declaration.tile.id, turn: declaration.turn };
      player.river.filter((r) => r.turn > declaration.turn).forEach((r) => { r.tsumogiri = true; });
    }
  });
  const riichiSticks = players.filter((p) => p.riichi).length;
  const scores = (spec.scores ?? [25000, 25000, 25000, 25000]).map((score, i) => score - (players[i]!.riichi ? 1000 : 0)) as PushFoldQuestion["scores"];
  const unused = shuffle([...remaining]);
  if (unused.length < 13) throw new Error(`${spec.id}: 王牌が不足`);
  const audit: PushFoldAudit = { hands: auditHands, deadWall: unused.slice(0, 13).map((id) => replayTile(id)), wall: unused.slice(13).map((id) => replayTile(id)) };
  const question: PushFoldQuestion = {
    id: spec.id, version: 1, difficulty: spec.difficulty, category: spec.category, title: spec.title,
    roundWind: spec.round ?? "東", roundNumber: spec.roundNumber ?? 2, honba: spec.honba ?? 0, turn: spec.turn,
    riichiSticks, seatWind: selfSeat, scores, hand, drawnTileId: drawn.id, doraIndicators: [indicator], players, wallTilesRemaining: audit.wall.length,
    rules: { redFives: true, openTanyao: true, tiePolicy: "strict", agariYame: false },
    recommendedAction: spec.action, recommendationStrength: spec.strength ?? "clear", acceptableActions: spec.alternative ? ["push", "fold"] : [spec.action],
    discards: { push: hand.filter((t) => t.tile === spec.push && (t.red === pushTile.red)).map((t) => t.id), fold: hand.filter((t) => spec.fold.includes(t.tile)).map((t) => t.id) },
    declareRiichi: spec.riichi ?? false, targetRank: spec.target, context: spec.context, valuePlan: spec.valuePlan,
    reasoning: [spec.reason], changes: [spec.change],
    pushBenefits: [spec.selfMeld?.kind === "chi" && spec.hand === "45m234p78988s" ? "形のテンパイを維持し、流局時のノーテン支払いを避ける選択です。通常のアガリ役はありません。" : spec.shanten === 0 ? "候補を切ればテンパイを保ち、表示した役・待ちでアガリを狙えます。" : "候補を切って受け入れを残し、手を進める選択です。"],
    pushRisks: ["現在の一打の安全情報と、その後の危険牌を別々に確認します。無筋やスジに放銃の可能性は残ります。"],
    foldBenefits: ["示した現物候補は、今回攻撃している相手全員に対してロンされない牌です。"],
    foldCosts: ["手を崩すとアガリ機会を減らします。流局時のノーテン支払いと親の連荘も別に確認します。"],
    sources: ["https://tenhou.net/man/index.html", "https://m-league.jp/about/", "/learn/guides/betaori-basics", "/learn/guides/genbutsu-suji-kabe"],
    review: { status: "verified", method: "136枚の配分・リーチ成立可能性・計算を自動検証。公開情報だけによる推奨理由を編集確認。全手順の牌譜再生や外部プロ監修ではありません。", at: "2026-10-08" },
    expected: { pushShanten: spec.shanten }
  };
  validatePushFoldAudit(question, audit);
  return { question, audit };
}
