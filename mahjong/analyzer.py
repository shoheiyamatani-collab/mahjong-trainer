from __future__ import annotations

from dataclasses import dataclass

from mahjong.shanten import normal_shanten
from mahjong.tiles import tile_name, tile_index, validate_counts


GOOD_WAIT_THRESHOLD = 5
SUPER_GOOD_WAIT_THRESHOLD = 9


@dataclass(frozen=True)
class TenpaiDetail:
    draw: str
    draw_tiles: int
    winning_types: int
    winning_tiles: int
    winning: tuple[str, ...]
    tenpai_discards: tuple[str, ...]

    @property
    def is_good_shape(self) -> bool:
        return self.winning_tiles >= GOOD_WAIT_THRESHOLD

    @property
    def is_super_good_shape(self) -> bool:
        return self.winning_tiles >= SUPER_GOOD_WAIT_THRESHOLD


@dataclass(frozen=True)
class DiscardAnalysis:
    discard: str
    after_discard_shanten: int
    is_iishanten: bool
    ukeire_types: int
    ukeire_tiles: int
    ukeire: tuple[str, ...]
    good_shape_types: int
    good_shape_tiles: int
    good_shape_rate: float
    super_good_shape_types: int
    super_good_shape_tiles: int
    super_good_shape_rate: float
    tenpai_details: tuple[TenpaiDetail, ...]

    @property
    def sort_key(self) -> tuple[int, int, int]:
        return (-self.after_discard_shanten, self.ukeire_types, self.ukeire_tiles)

    @property
    def progress_shanten(self) -> int:
        return self.after_discard_shanten - 1


def analyze_discards(counts: tuple[int, ...] | list[int]) -> list[DiscardAnalysis]:
    """Compare all unique discard candidates for a 14-tile hand."""
    validate_counts(counts, expected_total=14)
    counts_list = list(counts)
    results: list[DiscardAnalysis] = []

    for discard_index, count in enumerate(counts_list):
        if count == 0:
            continue

        after_discard = counts_list.copy()
        after_discard[discard_index] -= 1
        shanten = normal_shanten(tuple(after_discard))
        ukeire = _calculate_ukeire(after_discard, shanten)
        tenpai_details = _calculate_tenpai_details(after_discard, ukeire) if shanten == 1 else ()
        good_shape_tiles = sum(detail.draw_tiles for detail in tenpai_details if detail.is_good_shape)
        super_good_shape_tiles = sum(detail.draw_tiles for detail in tenpai_details if detail.is_super_good_shape)
        ukeire_tiles = sum(4 - after_discard[tile_index(tile)] for tile in ukeire)

        results.append(
            DiscardAnalysis(
                discard=tile_name(discard_index),
                after_discard_shanten=shanten,
                is_iishanten=shanten == 1,
                ukeire_types=len(ukeire),
                ukeire_tiles=ukeire_tiles,
                ukeire=ukeire,
                good_shape_types=sum(1 for detail in tenpai_details if detail.is_good_shape),
                good_shape_tiles=good_shape_tiles,
                good_shape_rate=_safe_rate(good_shape_tiles, ukeire_tiles),
                super_good_shape_types=sum(1 for detail in tenpai_details if detail.is_super_good_shape),
                super_good_shape_tiles=super_good_shape_tiles,
                super_good_shape_rate=_safe_rate(super_good_shape_tiles, ukeire_tiles),
                tenpai_details=tenpai_details,
            )
        )

    return sorted(results, key=lambda item: item.sort_key, reverse=True)


def best_discards(results: list[DiscardAnalysis]) -> list[DiscardAnalysis]:
    eligible = _best_shanten_results(results)
    if not eligible:
        return []
    best_key = max((result.ukeire_types, result.ukeire_tiles) for result in eligible)
    return [result for result in eligible if (result.ukeire_types, result.ukeire_tiles) == best_key]


def best_discards_for_review(results: list[DiscardAnalysis]) -> list[DiscardAnalysis]:
    """Return correct answers for review mode.

    Review mode prioritizes physical ukeire tile count. If the ukeire tile
    count ties, the higher good-shape tile count wins. Equal good-shape count
    remains a multi-answer correct result.
    """
    eligible = _best_shanten_results(results)
    if not eligible:
        return []
    best_key = max((result.ukeire_tiles, result.good_shape_tiles) for result in eligible)
    return [result for result in eligible if (result.ukeire_tiles, result.good_shape_tiles) == best_key]


def _best_shanten_results(results: list[DiscardAnalysis]) -> list[DiscardAnalysis]:
    if not results:
        return []
    best_shanten = min(result.after_discard_shanten for result in results)
    return [result for result in results if result.after_discard_shanten == best_shanten]


def _calculate_ukeire(after_discard: list[int], shanten: int) -> tuple[str, ...]:
    target_shanten = shanten - 1
    ukeire: list[str] = []
    for draw_index in range(34):
        if after_discard[draw_index] >= 4:
            continue
        drawn = after_discard.copy()
        drawn[draw_index] += 1
        if normal_shanten(tuple(drawn)) <= target_shanten:
            ukeire.append(tile_name(draw_index))
    return tuple(ukeire)


def _calculate_tenpai_details(after_discard: list[int], ukeire: tuple[str, ...]) -> tuple[TenpaiDetail, ...]:
    details: list[TenpaiDetail] = []
    for draw in ukeire:
        draw_index = tile_index(draw)
        drawn = after_discard.copy()
        drawn[draw_index] += 1

        best_winning: tuple[str, ...] = ()
        best_discards: list[str] = []
        best_winning_tiles = -1

        for discard_index, count in enumerate(drawn):
            if count == 0:
                continue
            tenpai = drawn.copy()
            tenpai[discard_index] -= 1
            if normal_shanten(tuple(tenpai)) != 0:
                continue

            winning = _calculate_winning_tiles(tenpai)
            winning_tiles = sum(4 - tenpai[tile_index(tile)] for tile in winning)
            if winning_tiles > best_winning_tiles:
                best_winning = winning
                best_discards = [tile_name(discard_index)]
                best_winning_tiles = winning_tiles
            elif winning_tiles == best_winning_tiles:
                best_discards.append(tile_name(discard_index))

        details.append(
            TenpaiDetail(
                draw=draw,
                draw_tiles=4 - after_discard[draw_index],
                winning_types=len(best_winning),
                winning_tiles=max(best_winning_tiles, 0),
                winning=best_winning,
                tenpai_discards=tuple(best_discards),
            )
        )

    return tuple(details)


def _calculate_winning_tiles(tenpai: list[int]) -> tuple[str, ...]:
    winning: list[str] = []
    for draw_index in range(34):
        if tenpai[draw_index] >= 4:
            continue
        won = tenpai.copy()
        won[draw_index] += 1
        if normal_shanten(tuple(won)) == -1:
            winning.append(tile_name(draw_index))
    return tuple(winning)


def _safe_rate(numerator: int, denominator: int) -> float:
    if denominator == 0:
        return 0.0
    return numerator / denominator
