import { XMLParser, XMLValidator } from "fast-xml-parser";
import { tileName } from "@mahjong-trainer/mahjong-core";
import type { LogSource, ParsedLog, ParsedRound, PlayerSnapshot, ReplayEvent, ReplayMeld, ReplayTile } from "./types";

export const MAX_LOG_BYTES = 8 * 1024 * 1024;
type XmlNode = { [key: string]: unknown; ":@"?: Record<string, string> };
type MutablePlayer = PlayerSnapshot & { phase: 13 | 14; lastDraw: ReplayTile | null; beforeDraw: ReplayTile[] | null; reachPending: boolean; rinshanPending: boolean };
const sorted = (tiles: ReplayTile[]) => tiles.slice().sort((a, b) => a.id - b.id);
const clone = <T>(value: T): T => structuredClone(value);

export function replayTile(id: number, redFives = true): ReplayTile {
  if (!Number.isInteger(id) || id < 0 || id > 135) throw new Error(`牌の個体IDが不正です: ${id}`);
  return { id, tile: tileName(Math.floor(id / 4)), red: redFives && [16, 52, 88].includes(id) };
}

// The bit layout is cross-checked against Tenhou's linked decoder and MahjongRepository's decoder.
export function decodeMeld(value: number, who: number, redFives = true): ReplayMeld {
  if (!Number.isInteger(value) || value < 0 || value > 65535) throw new Error("副露ビット値が不正です");
  const from = (who + (value & 3)) % 4;
  let ids: number[];
  let calledId: number | null;
  let kind: ReplayMeld["kind"];
  if (value & 4) {
    const encoded = value >> 10;
    const start = Math.floor(encoded / 3);
    const base = Math.floor(start / 7) * 9 + start % 7;
    ids = [0, 1, 2].map((offset) => 4 * (base + offset) + ((value >> (3 + offset * 2)) & 3));
    calledId = ids[encoded % 3]!;
    kind = "chi";
    if ((value & 3) !== 3) throw new Error("チーの相手が上家ではありません");
  } else if (value & 24) {
    const encoded = value >> 9;
    const base = Math.floor(encoded / 3) * 4;
    const fourth = (value >> 5) & 3;
    const ponIds = [0, 1, 2, 3].filter((copy) => copy !== fourth).map((copy) => base + copy);
    kind = value & 8 ? "pon" : "kakan";
    ids = kind === "pon" ? ponIds : [...ponIds, base + fourth];
    calledId = kind === "pon" ? ponIds[encoded % 3]! : base + fourth;
    if (from === who) throw new Error("ポン・加槓の相手が不正です");
  } else if (value & 32) {
    throw new Error("抜きドラ（三麻）は未対応です");
  } else {
    const encoded = value >> 8;
    const base = Math.floor(encoded / 4) * 4;
    ids = [base, base + 1, base + 2, base + 3];
    kind = from === who ? "ankan" : "daiminkan";
    calledId = kind === "ankan" ? null : encoded;
  }
  return { kind, from, tiles: ids.map((id) => replayTile(id, redFives)), calledTile: calledId === null ? null : replayTile(calledId, redFives) };
}

export function parseTenhouXml(xml: string, source: LogSource): ParsedLog {
  if (Buffer.byteLength(xml, "utf8") > MAX_LOG_BYTES) throw new Error("牌譜は8MB以下にしてください");
  if (/<!DOCTYPE|<!ENTITY/i.test(xml)) throw new Error("DTD・外部エンティティは読み込みません");
  const valid = XMLValidator.validate(xml);
  if (valid !== true) throw new Error(`XMLが不正です: ${valid.err.msg}`);
  const tree = new XMLParser({ preserveOrder: true, ignoreAttributes: false, attributeNamePrefix: "", parseAttributeValue: false, parseTagValue: false }).parse(xml) as XmlNode[];
  const roots = tree.filter((node) => !Object.keys(node)[0]?.startsWith("?"));
  if (roots.length !== 1 || !Array.isArray(roots[0]?.mjloggm) || roots[0]?.[":@"]?.ver !== "2.3") throw new Error("完全なmjloggm ver=2.3のXMLが必要です");
  const nodes = roots[0].mjloggm as XmlNode[];
  let gameType: number | null = null;
  let red = true;
  let current: ParsedRound | null = null;
  let players: MutablePlayer[] = [];
  let lastDiscard: { player: number; id: number } | null = null;
  let pendingKan: { player: number; before: ReplayTile[]; meldsBefore: ReplayMeld[]; event: Extract<ReplayEvent, { type: "call" }>; robbedId: number | null } | null = null;
  let terminalTiles: ReplayTile[] = [];
  let nextPlayer = 0;
  const seen = new Set<number>();
  const result: ParsedLog = { version: "2.3", source: clone(source), table: "other", redFives: true, rounds: [] };
  const integer = (attrs: Record<string, string>, name: string, min = 0, max = Number.MAX_SAFE_INTEGER) => {
    const raw = attrs[name];
    if (raw == null || !/^\d+$/.test(raw)) throw new Error(`属性${name}が不正です`);
    const n = Number(raw);
    if (!Number.isSafeInteger(n) || n < min || n > max) throw new Error(`属性${name}が範囲外です`);
    return n;
  };
  const ids = (raw: string | undefined) => {
    if (!raw || !/^\d+(,\d+)*$/.test(raw)) throw new Error("配牌・手牌が欠損しています");
    return raw.split(",").map((s) => replayTile(Number(s), red));
  };
  const snapshot = () => players.map(({ player, hand, melds, river, riichi }) => clone({ player, hand: sorted(hand), melds, river, riichi }));
  const reserve = (tile: ReplayTile) => {
    if (seen.has(tile.id)) throw new Error(`同じ個体IDを2回取得しています: ${tile.id}`);
    seen.add(tile.id);
  };
  const remove = (player: MutablePlayer, tile: ReplayTile) => {
    const index = player.hand.findIndex((item) => item.id === tile.id);
    if (index < 0) throw new Error(`手牌にない牌が使用されました: player=${player.player}, id=${tile.id}`);
    player.hand.splice(index, 1);
  };
  const validate = () => {
    const locations = [...terminalTiles, ...(current?.doraIndicators ?? [])];
    for (const p of players) {
      if (p.hand.length + p.melds.length * 3 !== p.phase) throw new Error(`手牌枚数が不整合です: player=${p.player}`);
      if (p.melds.length > 4) throw new Error("副露が5組以上あります");
      locations.push(...p.hand, ...p.melds.flatMap((meld) => meld.tiles), ...p.river.filter((tile) => tile.calledBy === null).map((tile) => tile.tile));
    }
    const located = new Set(locations.map((tile) => tile.id));
    if (located.size !== locations.length || located.size !== seen.size || [...seen].some((id) => !located.has(id))) throw new Error("牌の重複・消失を検出しました");
  };
  const sameIds = (left: ReplayTile[], right: ReplayTile[]) => sorted(left).map((t) => t.id).join(",") === sorted(right).map((t) => t.id).join(",");

  for (let sequence = 0; sequence < nodes.length; sequence += 1) {
    const node = nodes[sequence]!;
    const tag = Object.keys(node).find((key) => key !== ":@")!;
    const attrs = node[":@"] ?? {};
    if (["UN", "SHUFFLE", "TAIKYOKU", "BYE", "PROF"].includes(tag)) continue;
    if (tag === "GO") {
      if (gameType !== null || current) throw new Error("GOの位置が不正です");
      gameType = integer(attrs, "type", 0, 65535);
      if (gameType & 16) throw new Error("四麻のみ対応しています");
      red = !(gameType & 2);
      result.redFives = red;
      result.table = (gameType & 160) === 160 ? "houou" : "other";
      continue;
    }
    if (tag === "INIT") {
      if (gameType === null || (current && !current.ended)) throw new Error("GOまたは前局の終局が欠損しています");
      seen.clear(); terminalTiles = []; lastDiscard = null; pendingKan = null;
      if (!/^\d+(,\d+){5}$/.test(attrs.seed ?? "")) throw new Error("INIT seedが不正です");
      const seed = attrs.seed!.split(",").map(Number);
      if (seed.some((n) => !Number.isSafeInteger(n)) || seed[0]! > 15 || seed[5]! > 135) throw new Error("INIT seedが不正です");
      const dealer = integer(attrs, "oya", 0, 3);
      nextPlayer = dealer;
      const scores = (attrs.ten ?? "").split(",").map(Number);
      if (scores.length !== 4 || scores.some((score) => !Number.isFinite(score))) throw new Error("四人の点数が必要です");
      const roundWind = tileName(27 + Math.floor(seed[0]! / 4));
      players = [0, 1, 2, 3].map((player) => {
        const hand = ids(attrs[`hai${player}`]);
        if (hand.length !== 13) throw new Error("局開始は各プレイヤー13枚が必要です");
        hand.forEach(reserve);
        return { player, hand, melds: [], river: [], riichi: false, phase: 13, lastDraw: null, beforeDraw: null, reachPending: false, rinshanPending: false };
      });
      const indicator = replayTile(seed[5]!, red); reserve(indicator);
      current = { info: { index: result.rounds.length, round: `${roundWind}${seed[0]! % 4 + 1}局`, roundWind, dealer, honba: seed[1]!, riichiSticks: seed[2]!, scores: scores.map((score) => score * 100) }, doraIndicators: [indicator], events: [], ended: false };
      result.rounds.push(current);
      validate();
      current.events.push({ type: "init", sequence, roundIndex: current.info.index, snapshots: snapshot(), initialHands: snapshot().map((p) => p.hand) });
      continue;
    }
    if (!current) throw new Error(`INITより前のイベントです: ${tag}`);
    if (current.ended && tag !== "AGARI") throw new Error(`終局後のイベントです: ${tag}`);
    const base = { sequence, roundIndex: current.info.index };
    let event: Omit<ReplayEvent, "snapshots">;
    const draw = /^[TUVW](\d+)$/.exec(tag);
    const discard = /^[DEFGdefg](\d+)$/.exec(tag);
    if (draw) {
      const player = tag.charCodeAt(0) - 84;
      const p = players[player]!;
      if (p.phase !== 13 || nextPlayer !== player || players.some((other) => other.phase === 14)) throw new Error("ツモ順序が不正です");
      const tile = replayTile(Number(draw[1]), red); reserve(tile);
      p.beforeDraw = sorted(p.hand); p.lastDraw = tile; p.hand.push(tile); p.phase = 14;
      event = { ...base, type: "draw", player, tile, turn: p.river.length + 1, handBefore: clone(p.beforeDraw), handAfter: sorted(p.hand), rinshan: p.rinshanPending } as ReplayEvent;
      p.rinshanPending = false; pendingKan = null; lastDiscard = null;
    } else if (discard) {
      const player = tag.toUpperCase().charCodeAt(0) - 68;
      const p = players[player]!;
      if (p.phase !== 14 || p.rinshanPending || nextPlayer !== player) throw new Error("ツモ・チー・ポンのない打牌です");
      const tile = replayTile(Number(discard[1]), red);
      const tsumogiri = p.lastDraw?.id === tile.id;
      const handBeforeDiscard = sorted(p.hand);
      remove(p, tile); p.phase = 13;
      const river = { tile, turn: p.river.length + 1, sequence, tsumogiri, riichi: p.reachPending, calledBy: null };
      p.river.push(river); p.reachPending = false;
      const visible = [...current.doraIndicators, ...players.flatMap((other) => [...other.river.map((item) => item.tile), ...other.melds.flatMap((meld) => meld.tiles)])];
      event = { ...base, type: "discard", player, tile, turn: river.turn, tsumogiri, riichi: river.riichi, handBeforeDraw: clone(p.beforeDraw), handBeforeDiscard, handAfterDiscard: sorted(p.hand), visibleTiles: [...new Map(visible.map((t) => [t.id, t])).values()] } as ReplayEvent;
      p.lastDraw = null; p.beforeDraw = null; lastDiscard = { player, id: tile.id }; pendingKan = null;
      nextPlayer = (player + 1) % 4;
    } else if (tag === "N") {
      const player = integer(attrs, "who", 0, 3);
      const p = players[player]!;
      const meld = decodeMeld(integer(attrs, "m", 0, 65535), player, red);
      const before = sorted(p.hand); const meldsBefore = clone(p.melds);
      if (["chi", "pon", "daiminkan"].includes(meld.kind)) {
        if (p.phase !== 13 || !lastDiscard || lastDiscard.player !== meld.from || lastDiscard.id !== meld.calledTile?.id) throw new Error("副露と直前の捨て牌が一致しません");
        const called = players[meld.from]!.river.at(-1)!;
        if (called.calledBy !== null) throw new Error("捨て牌が既に鳴かれています");
        for (const tile of meld.tiles) if (tile.id !== meld.calledTile!.id) remove(p, tile);
        called.calledBy = player; p.melds.push(meld);
        p.phase = meld.kind === "daiminkan" ? 13 : 14;
      } else if (meld.kind === "ankan") {
        if (p.phase !== 14) throw new Error("暗槓の前にツモがありません");
        meld.tiles.forEach((tile) => remove(p, tile)); p.melds.push(meld); p.phase = 13;
      } else {
        const old = p.melds.findIndex((m) => m.kind === "pon" && m.tiles[0]!.tile === meld.tiles[0]!.tile);
        if (p.phase !== 14 || old < 0) throw new Error("加槓に対応するポンまたはツモがありません");
        const added = meld.calledTile!;
        if (!sameIds(meld.tiles.filter((t) => t.id !== added.id), p.melds[old]!.tiles)) throw new Error("加槓の個体IDがポンと一致しません");
        remove(p, added);
        p.melds[old] = { ...meld, calledTile: p.melds[old]!.calledTile }; p.phase = 13;
      }
      p.rinshanPending = ["ankan", "daiminkan", "kakan"].includes(meld.kind);
      p.lastDraw = null; p.beforeDraw = null; lastDiscard = null;
      nextPlayer = player;
      const callEvent = { ...base, type: "call" as const, player, meld, handBefore: before, handAfter: sorted(p.hand), robbed: false, snapshots: [] };
      event = callEvent;
      pendingKan = ["ankan", "kakan"].includes(meld.kind) ? { player, before, meldsBefore, event: callEvent, robbedId: meld.kind === "kakan" ? meld.calledTile!.id : null } : null;
    } else if (tag === "REACH") {
      const player = integer(attrs, "who", 0, 3); const step = integer(attrs, "step", 1, 2) as 1 | 2;
      const p = players[player]!;
      if (step === 1) { if (p.phase !== 14 || p.riichi) throw new Error("リーチ宣言の状態が不正です"); p.reachPending = true; }
      else { if (!p.river.at(-1)?.riichi || p.riichi) throw new Error("リーチ成立の状態が不正です"); p.riichi = true; }
      event = { ...base, type: "reach", player, step } as ReplayEvent;
    } else if (tag === "DORA") {
      const tile = replayTile(integer(attrs, "hai", 0, 135), red); reserve(tile); current.doraIndicators.push(tile);
      event = { ...base, type: "dora", tile } as ReplayEvent;
    } else if (tag === "AGARI") {
      const player = integer(attrs, "who", 0, 3); const from = integer(attrs, "fromWho", 0, 3);
      const tile = replayTile(integer(attrs, "machi", 0, 135), red);
      const method = player === from ? "tsumo" : "ron";
      const previousWins = current.events.filter((e) => e.type === "win");
      if (current.ended && (!previousWins.length || method !== "ron" || previousWins.some((e) => e.type === "win" && (e.method !== "ron" || e.player === player || e.from !== from || e.tile.id !== tile.id)))) throw new Error("終局後に別の和了が発生しています");
      const chankan = method === "ron" && pendingKan?.player === from && (pendingKan.robbedId === null || pendingKan.robbedId === tile.id);
      if (method === "tsumo" && (players[player]!.phase !== 14 || players[player]!.lastDraw?.id !== tile.id)) throw new Error("ツモ和了牌が直前のツモと一致しません");
      if (method === "ron" && !chankan && (!lastDiscard || lastDiscard.player !== from || lastDiscard.id !== tile.id)) throw new Error("ロン牌が直前の打牌と一致しません");
      if (chankan && pendingKan && !pendingKan.event.robbed) {
        const p = players[from]!;
        p.hand = pendingKan.before.filter((t) => t.id !== tile.id); p.melds = clone(pendingKan.meldsBefore); p.phase = 13; p.rinshanPending = false;
        terminalTiles.push(tile); pendingKan.event.robbed = true;
      }
      const winningHand = method === "tsumo" ? sorted(players[player]!.hand) : sorted([...players[player]!.hand, tile]);
      if (!sameIds(ids(attrs.hai), winningHand)) throw new Error("終局の手牌が復元結果と一致しません");
      event = { ...base, type: "win", player, from, method, tile, winningHand, chankan: Boolean(chankan) } as ReplayEvent; current.ended = true;
    } else if (tag === "RYUUKYOKU") {
      for (const p of players) if (attrs[`hai${p.player}`] && !sameIds(ids(attrs[`hai${p.player}`]), p.hand)) throw new Error("流局時の公開手牌が復元結果と一致しません");
      event = { ...base, type: "draw-game", reason: attrs.type ?? "exhaustive" } as ReplayEvent; current.ended = true;
    } else {
      throw new Error(`未対応イベントのため解析を中止します: ${tag}`);
    }
    validate();
    (event as ReplayEvent).snapshots = snapshot();
    current.events.push(event as ReplayEvent);
  }
  if (!result.rounds.length || result.rounds.some((round) => !round.ended)) throw new Error("局開始または終局が欠損しています");
  return result;
}
