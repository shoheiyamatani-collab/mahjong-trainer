import { calculateHandScore, createSeededRandom, emptyCounts, parseHand, tileIndex, tileName, type HandScoreInput, type HandScoreMeld, type Tile } from "../../src";

export const SCORING_CASES_VERSION = "scoring-reference-cases-v2";
export const SCORING_CASES_SEED = "scoring-audit-2026-10-09-v1";
export type ScoringValidationCase = { id: string; input: HandScoreInput };
export type ScoringComparisonOutcome =
  | { status: "rejected"; reason: "no-yaku" | "not-winning" | "invalid-input" }
  | { status: "accepted"; han: number; fu: number | null; yakumanCount: number; totalPoints: number; payments: number[] };

const base = { isDealer: false, winMethod: "ron", roundWind: "東", seatWind: "南" } as const;
const fixed = (id: string, hand: string, winningTile: Tile, patch: Partial<HandScoreInput> = {}): ScoringValidationCase => ({ id, input: { ...base, counts: parseHand(hand), winningTile, ...patch } });
export function curatedScoringCases(): ScoringValidationCase[] {
  return [
    fixed("pinfu", "123456m234456p22s", "4p", { riichi: true }),
    fixed("wait-sequence-alternative", "123345678m123p55s", "3m", { riichi: true }),
    fixed("wait-pair-alternative", "12334533m456p678s", "3m", { riichi: true }),
    fixed("ron-sequence-not-triplet", "222234m444p555s88p", "2m"),
    fixed("open-group-not-winning-group", "345m34555p678s", "3m", { melds: [{ kind: "chi", tiles: ["1m", "2m", "3m"] }], riichi: false }),
    fixed("junchan-closed", "123789m123789p99s", "3p"),
    fixed("junchan-open", "789m123789p99s", "3p", { melds: [{ kind: "chi", tiles: ["1m", "2m", "3m"] }] }),
    fixed("chanta-with-honor", "123789m123789p白白", "3p"),
    fixed("honroutou", "111999m111p999s白白", "白"),
    fixed("honroutou-open", "999m111p999s白白", "9s", { melds: [{ kind: "pon", tiles: ["1m", "1m", "1m"] }] }),
    fixed("no-open-iipeikou", "112233m789p55s", "3m", { melds: [{ kind: "pon", tiles: ["白", "白", "白"] }] }),
    fixed("chiitoitsu-honroutou", "1199m1199p1199s白白", "白"),
    fixed("shousangen", "123m789p白白白發發發中中", "9p"),
    fixed("sanshoku-doukou", "222m222p222s456m88p", "6m"),
    fixed("sankantsu", "123m22p", "3m", { melds: [{ kind: "kan", tiles: ["2s", "2s", "2s", "2s"] }, { kind: "kan", tiles: ["4p", "4p", "4p", "4p"] }, { kind: "ankan", tiles: ["6m", "6m", "6m", "6m"] }] }),
    fixed("suuankou-tsumo", "111m222p333s444s55p", "4s", { winMethod: "tsumo" }),
    fixed("suuankou-tanki", "111m222p333s444s55p", "5p"),
    fixed("suuankou-shanpon-ron-not-yakuman", "111m222p333s444s55p", "4s"),
    fixed("daisangen", "123m55p白白白發發發中中中", "3m"),
    fixed("shousuushii", "東東東南南南西西西北北123m", "3m"),
    fixed("daisuushii-tsuuiisou", "東東東南南南西西西北北北白白", "白"),
    fixed("tsuuiisou-pairs", "東東南南西西北北白白發發中中", "白"),
    fixed("chinroutou", "111999m111p999s11s", "1s"),
    fixed("ryuuiisou", "223344666888s發發", "6s"),
    fixed("chuuren", "11123456789999m", "4m"),
    fixed("kokushi", "19m19p19s東南西北白發中中", "中"),
    fixed("double-kokushi-13-wait", "19m19p19s東南西北白發中中", "中", { doubleYakuman: true }),
    fixed("not-double-kokushi-single-wait", "19m19p19s東南西北白發中中", "1m", { doubleYakuman: true }),
    fixed("double-suuankou-tanki", "111m222p333s444s55p", "5p", { doubleYakuman: true }),
    fixed("double-daisuushii-stack", "東東東南南南西西西北北北白白", "白", { doubleYakuman: true }),
    fixed("double-pure-chuuren", "11123456789999m", "9m", { doubleYakuman: true }),
    fixed("not-double-chuuren", "11123456789999m", "4m", { doubleYakuman: true }),
    fixed("suukantsu-stack", "99s", "9s", { melds: [{ kind: "ankan", tiles: ["1m", "1m", "1m", "1m"] }, { kind: "ankan", tiles: ["9m", "9m", "9m", "9m"] }, { kind: "ankan", tiles: ["1p", "1p", "1p", "1p"] }, { kind: "ankan", tiles: ["9p", "9p", "9p", "9p"] }] }),
    fixed("chiitoitsu", "1133m5577p224466s", "6s"),
    fixed("no-yaku", "345m23445688p789s", "4m"),
    fixed("incomplete", "123456m789p124s東東", "4s"),
    fixed("invalid-ippatsu", "123456m234456p22s", "4p", { ippatsu: true }),
    fixed("invalid-open-riichi", "123456789m22p", "2p", { riichi: true, melds: [{ kind: "pon", tiles: ["白", "白", "白"] }] }),
    fixed("invalid-haitei-ron", "345m23445688p789s", "4m", { haitei: true }),
    fixed("invalid-houtei-tsumo", "345m23445688p789s", "4m", { winMethod: "tsumo", houtei: true }),
    fixed("invalid-rinshan-ron", "345m23445688p789s", "4m", { rinshan: true }),
    fixed("invalid-chankan-tsumo", "345m23445688p789s", "4m", { winMethod: "tsumo", chankan: true }),
    fixed("haitei-open", "345m34555p678s", "3m", { winMethod: "tsumo", haitei: true, melds: [{ kind: "chi", tiles: ["1m", "2m", "3m"] }] }),
    fixed("houtei-open", "345m34555p678s", "3m", { houtei: true, melds: [{ kind: "chi", tiles: ["1m", "2m", "3m"] }] }),
    fixed("rinshan", "234567m222p22s", "2s", { winMethod: "tsumo", rinshan: true, melds: [{ kind: "ankan", tiles: ["1m", "1m", "1m", "1m"] }] }),
    fixed("chankan", "345m23445688p789s", "4m", { chankan: true })
  ];
}

export function generatedScoringCases(count = 2000, seed = SCORING_CASES_SEED): ScoringValidationCase[] {
  const random = createSeededRandom(seed), cases: ScoringValidationCase[] = [];
  const integer = (max: number) => Math.floor(random() * max);
  while (cases.length < count) {
    const counts = emptyCounts(), melds: HandScoreMeld[] = [];
    const pair = integer(34); counts[pair] = 2;
    for (let i = 0; i < 4; i++) {
      const kind = integer(10), start = kind < 6 ? integer(3) * 9 + integer(7) : integer(34);
      const tiles = kind < 6 ? [tileName(start), tileName(start + 1), tileName(start + 2)] : Array.from({ length: kind === 9 ? 4 : 3 }, () => tileName(start));
      if (random() < 0.28 || kind === 9) melds.push({ kind: kind < 6 ? "chi" : kind === 9 ? random() < 0.5 ? "kan" : "ankan" : "pon", tiles });
      else for (const tile of tiles) counts[tileIndex(tile)]++;
    }
    const total = counts.slice(); for (const meld of melds) for (const tile of meld.tiles) total[tileIndex(tile)]++;
    if (total.some((copies) => copies > 4)) continue;
    const closed = melds.every((meld) => meld.kind === "ankan"), isDealer = random() < 0.25;
    const possible = counts.flatMap((copies, index) => copies ? [tileName(index)] : []);
    const riichi = closed && random() < 0.55, doubleRiichi = riichi && random() < 0.1;
    cases.push({ id: `generated-${cases.length}`, input: {
      counts, melds, winningTile: possible[integer(possible.length)]!, isDealer,
      winMethod: random() < 0.5 ? "ron" : "tsumo", roundWind: random() < 0.5 ? "東" : "南", seatWind: isDealer ? "東" : ("南西北"[integer(3)] as Tile),
      riichi, doubleRiichi, ippatsu: riichi && random() < 0.2, honba: integer(4), riichiSticks: integer(4)
    } });
  }
  return cases;
}

export function coreScoringOutcome(input: HandScoreInput): ScoringComparisonOutcome {
  try {
    const result = calculateHandScore(input);
    return { status: "accepted", han: result.score.han, fu: result.score.fu,
      yakumanCount: result.score.fu === null ? result.score.basePoints / 8000 : 0,
      totalPoints: result.score.totalPoints, payments: result.score.payments.map((payment) => payment.points) };
  } catch (error) {
    if (!(error instanceof Error)) throw error;
    return { status: "rejected", reason: error.message === "役がありません。" ? "no-yaku" : error.message === "和了形または役が見つかりません。" ? "not-winning" : "invalid-input" };
  }
}
