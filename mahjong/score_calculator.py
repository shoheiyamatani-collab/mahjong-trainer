from __future__ import annotations

from dataclasses import dataclass
from typing import Literal

from mahjong.fu import FuContext, FuResult, calculate_standard_fu, chiitoitsu_fu
from mahjong.hand_decomposer import StandardHandDecomposition, decompose_standard_hand_with_melds
from mahjong.melds import Meld, meld_tile_counts, validate_meld
from mahjong.scoring import ScoreInput, ScoreResult, WinMethod, calculate_score
from mahjong.tiles import validate_counts
from mahjong.yaku import YakuContext, YakuResult, detect_standard_yaku


SituationalYaku = Literal["riichi", "double_riichi", "ippatsu", "menzen_tsumo"]


SITUATIONAL_YAKU_LABELS: dict[SituationalYaku, str] = {
    "riichi": "\u30ea\u30fc\u30c1",
    "double_riichi": "\u30c0\u30d6\u30eb\u30ea\u30fc\u30c1",
    "ippatsu": "\u4e00\u767a",
    "menzen_tsumo": "\u9580\u524d\u6e05\u81ea\u6478\u548c",
}


@dataclass(frozen=True)
class HandScoreInput:
    counts: tuple[int, ...]
    open_melds: tuple[Meld, ...]
    winning_tile: str
    is_dealer: bool
    win_method: WinMethod
    round_wind: str
    seat_wind: str
    situational_yaku: tuple[SituationalYaku, ...] = ()
    dora: int = 0
    yakuman_count: int = 0


@dataclass(frozen=True)
class HandScoreResult:
    score: ScoreResult
    fu: FuResult | None
    yaku: tuple[YakuResult, ...]
    decomposition: StandardHandDecomposition | None

    @property
    def han(self) -> int:
        return self.score.han


def calculate_hand_score(hand_input: HandScoreInput) -> HandScoreResult:
    _validate_hand_score_input(hand_input)

    if hand_input.yakuman_count:
        score = calculate_score(
            ScoreInput(
                han=0,
                fu=None,
                is_dealer=hand_input.is_dealer,
                win_method=hand_input.win_method,
                yakuman_count=hand_input.yakuman_count,
            )
        )
        return HandScoreResult(score=score, fu=None, yaku=(), decomposition=None)

    special_result = _score_special_hand(hand_input)
    if special_result is not None:
        return special_result

    decompositions = decompose_standard_hand_with_melds(hand_input.counts, hand_input.open_melds)
    if not decompositions:
        raise ValueError("No standard hand decomposition found.")

    candidates = [_score_decomposition(hand_input, decomposition) for decomposition in decompositions]
    return max(candidates, key=_score_rank)


def _score_special_hand(hand_input: HandScoreInput) -> HandScoreResult | None:
    if hand_input.open_melds:
        return None

    if _is_kokushi(hand_input.counts):
        score = calculate_score(
            ScoreInput(
                han=0,
                fu=None,
                is_dealer=hand_input.is_dealer,
                win_method=hand_input.win_method,
                yakuman_count=1,
            )
        )
        return HandScoreResult(
            score=score,
            fu=None,
            yaku=(YakuResult("\u56fd\u58eb\u7121\u53cc", 0, is_yakuman=True),),
            decomposition=None,
        )

    if _is_chiitoitsu(hand_input.counts):
        yaku = [YakuResult("\u4e03\u5bfe\u5b50", 2)]
        yaku.extend(_situational_yaku_results(hand_input, ()))
        if hand_input.dora:
            yaku.append(YakuResult("\u30c9\u30e9", hand_input.dora))
        han = sum(result.han for result in yaku)
        fu = chiitoitsu_fu()
        score = calculate_score(
            ScoreInput(
                han=han,
                fu=fu.rounded_fu,
                is_dealer=hand_input.is_dealer,
                win_method=hand_input.win_method,
            )
        )
        return HandScoreResult(score=score, fu=fu, yaku=tuple(yaku), decomposition=None)

    return None


def _score_decomposition(
    hand_input: HandScoreInput,
    decomposition: StandardHandDecomposition,
) -> HandScoreResult:
    yaku = list(
        detect_standard_yaku(
            decomposition,
            YakuContext(
                round_wind=hand_input.round_wind,
                seat_wind=hand_input.seat_wind,
                winning_tile=hand_input.winning_tile,
            ),
        )
    )
    yaku.extend(_situational_yaku_results(hand_input, decomposition.open_melds))
    if hand_input.dora:
        yaku.append(YakuResult("\u30c9\u30e9", hand_input.dora))

    han = sum(result.han for result in yaku if not result.is_yakuman)
    if han <= 0:
        raise ValueError("No yaku detected.")

    fu = calculate_standard_fu(
        decomposition,
        FuContext(
            win_method=hand_input.win_method,
            winning_tile=hand_input.winning_tile,
            round_wind=hand_input.round_wind,
            seat_wind=hand_input.seat_wind,
        ),
    )
    score = calculate_score(
        ScoreInput(
            han=han,
            fu=fu.rounded_fu,
            is_dealer=hand_input.is_dealer,
            win_method=hand_input.win_method,
        )
    )
    return HandScoreResult(score=score, fu=fu, yaku=tuple(yaku), decomposition=decomposition)


def _situational_yaku_results(
    hand_input: HandScoreInput,
    open_melds: tuple[Meld, ...],
) -> list[YakuResult]:
    if not _is_closed(open_melds):
        disallowed = {"riichi", "double_riichi", "ippatsu", "menzen_tsumo"}
    else:
        disallowed = set()

    results: list[YakuResult] = []
    situational = set(hand_input.situational_yaku)
    is_closed = _is_closed(open_melds)

    if is_closed and hand_input.win_method == "tsumo":
        situational.add("menzen_tsumo")

    if "double_riichi" in situational:
        situational.discard("riichi")

    for key in sorted(situational):
        if key in disallowed:
            continue
        if key == "menzen_tsumo" and hand_input.win_method != "tsumo":
            continue
        results.append(YakuResult(SITUATIONAL_YAKU_LABELS[key], 2 if key == "double_riichi" else 1))

    return results


def _score_rank(result: HandScoreResult) -> tuple[int, int, int]:
    return (result.score.total_points, result.score.han, result.score.fu or 0)


def _is_closed(open_melds: tuple[Meld, ...]) -> bool:
    return not any(meld.is_open for meld in open_melds)


def _validate_hand_score_input(hand_input: HandScoreInput) -> None:
    validate_counts(hand_input.counts)
    for meld in hand_input.open_melds:
        validate_meld(meld)
    meld_counts = meld_tile_counts(hand_input.open_melds)
    over_limit = [
        index
        for index, count in enumerate(hand_input.counts)
        if count + meld_counts[index] > 4
    ]
    if over_limit:
        raise ValueError("A tile appears more than four times across hand and melds.")
    if hand_input.dora < 0:
        raise ValueError("dora cannot be negative.")
    if hand_input.yakuman_count < 0:
        raise ValueError("yakuman_count cannot be negative.")


def _is_chiitoitsu(counts: tuple[int, ...]) -> bool:
    return sum(counts) == 14 and sum(1 for count in counts if count == 2) == 7


def _is_kokushi(counts: tuple[int, ...]) -> bool:
    terminal_and_honor_indexes = {
        0,
        8,
        9,
        17,
        18,
        26,
        27,
        28,
        29,
        30,
        31,
        32,
        33,
    }
    if sum(counts) != 14:
        return False
    if any(counts[index] == 0 for index in terminal_and_honor_indexes):
        return False
    if any(count and index not in terminal_and_honor_indexes for index, count in enumerate(counts)):
        return False
    return any(counts[index] == 2 for index in terminal_and_honor_indexes)
