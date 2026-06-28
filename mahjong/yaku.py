from __future__ import annotations

from dataclasses import dataclass
from typing import Literal

from mahjong.hand_decomposer import HandGroup, StandardHandDecomposition
from mahjong.melds import Meld
from mahjong.tiles import tile_index


EAST = "\u6771"
SOUTH = "\u5357"
WEST = "\u897f"
NORTH = "\u5317"
WHITE = "\u767d"
GREEN = "\u767c"
RED = "\u4e2d"
DRAGONS = {WHITE, GREEN, RED}
WINDS = {EAST, SOUTH, WEST, NORTH}


@dataclass(frozen=True)
class YakuContext:
    round_wind: str
    seat_wind: str
    winning_tile: str | None = None
    win_method: Literal["ron", "tsumo"] = "ron"


@dataclass(frozen=True)
class YakuResult:
    name: str
    han: int
    is_yakuman: bool = False


def detect_standard_yaku(
    decomposition: StandardHandDecomposition,
    context: YakuContext,
) -> tuple[YakuResult, ...]:
    """Detect MVP yaku for a standard hand decomposition."""
    yaku: list[YakuResult] = []
    all_groups = list(decomposition.melds)
    all_meld_like = [*decomposition.melds, *_melds_to_groups(decomposition.open_melds)]
    all_tiles = _all_tiles(decomposition)
    is_closed = _is_closed(decomposition.open_melds)

    yakuhai_count = _yakuhai_count(all_meld_like, context)
    yaku.extend(YakuResult("\u5f79\u724c", 1) for _ in range(yakuhai_count))

    if all(_is_simple(tile) for tile in all_tiles):
        yaku.append(YakuResult("\u65ad\u4e48\u4e5d", 1))

    if _is_pinfu(decomposition, context):
        yaku.append(YakuResult("\u5e73\u548c", 1))

    if is_closed:
        sequence_pairs = _identical_sequence_pair_count(decomposition.melds)
        if sequence_pairs >= 2:
            yaku.append(YakuResult("\u4e8c\u76c3\u53e3", 3))
        elif sequence_pairs == 1:
            yaku.append(YakuResult("\u4e00\u76c3\u53e3", 1))

    if _has_sanshoku_doujun(all_meld_like):
        yaku.append(YakuResult("\u4e09\u8272\u540c\u9806", 2 if is_closed else 1))

    if _concealed_triplet_count(decomposition, context) >= 3:
        yaku.append(YakuResult("\u4e09\u6697\u523b", 2))

    if all(_is_triplet_like(group) for group in all_meld_like):
        yaku.append(YakuResult("\u5bfe\u3005\u548c", 2))

    flush_suit = _single_number_suit(all_tiles)
    has_honor = any(_is_honor(tile) for tile in all_tiles)
    if flush_suit is not None and has_honor:
        yaku.append(YakuResult("\u6df7\u4e00\u8272", 3 if is_closed else 2))
    elif flush_suit is not None:
        yaku.append(YakuResult("\u6e05\u4e00\u8272", 6 if is_closed else 5))

    return tuple(yaku)


def _yakuhai_count(groups: list[HandGroup], context: YakuContext) -> int:
    count = 0
    for group in groups:
        if not _is_triplet_like(group):
            continue
        tile = group.tiles[0]
        if tile in DRAGONS:
            count += 1
        if tile == context.round_wind:
            count += 1
        if tile == context.seat_wind:
            count += 1
    return count


def _melds_to_groups(melds: tuple[Meld, ...]) -> list[HandGroup]:
    groups: list[HandGroup] = []
    for meld in melds:
        if meld.kind == "chi":
            groups.append(HandGroup("sequence", meld.tiles))
        else:
            groups.append(HandGroup("triplet", meld.tiles))
    return groups


def _all_tiles(decomposition: StandardHandDecomposition) -> tuple[str, ...]:
    tiles: list[str] = []
    for group in decomposition.melds:
        tiles.extend(group.tiles)
    tiles.extend(decomposition.pair.tiles)
    for meld in decomposition.open_melds:
        tiles.extend(meld.tiles)
    return tuple(tiles)


def _is_closed(melds: tuple[Meld, ...]) -> bool:
    return not any(meld.is_open for meld in melds)


def _is_triplet_like(group: HandGroup) -> bool:
    return group.kind == "triplet"


def _identical_sequence_pair_count(groups: tuple[HandGroup, ...]) -> int:
    sequence_counts: dict[tuple[int, int], int] = {}
    for group in groups:
        if group.kind != "sequence":
            continue
        key = _sequence_key(group)
        sequence_counts[key] = sequence_counts.get(key, 0) + 1
    return sum(count // 2 for count in sequence_counts.values())


def _has_sanshoku_doujun(groups: list[HandGroup]) -> bool:
    starts_by_rank: dict[int, set[int]] = {}
    for group in groups:
        if group.kind != "sequence":
            continue
        suit, start_rank = _sequence_key(group)
        starts_by_rank.setdefault(start_rank, set()).add(suit)
    return any(suits == {0, 1, 2} for suits in starts_by_rank.values())


def _concealed_triplet_count(decomposition: StandardHandDecomposition, context: YakuContext) -> int:
    count = 0
    for group in decomposition.melds:
        if group.kind != "triplet":
            continue
        if context.win_method == "ron" and context.winning_tile in group.tiles:
            continue
        count += 1

    for meld in decomposition.open_melds:
        if meld.kind == "closed_kan":
            count += 1

    return count


def _sequence_key(group: HandGroup) -> tuple[int, int]:
    indexes = sorted(tile_index(tile) for tile in group.tiles)
    first = indexes[0]
    return first // 9, first % 9


def _is_pinfu(decomposition: StandardHandDecomposition, context: YakuContext) -> bool:
    if context.winning_tile is None:
        return False
    if decomposition.open_melds:
        return False
    if any(group.kind != "sequence" for group in decomposition.melds):
        return False
    if _is_value_pair(decomposition.pair, context):
        return False
    return _wait_fu(decomposition, context.winning_tile) == 0


def _is_value_pair(pair: HandGroup, context: YakuContext) -> bool:
    tile = pair.tiles[0]
    return tile in DRAGONS or tile == context.round_wind or tile == context.seat_wind


def _wait_fu(decomposition: StandardHandDecomposition, winning_tile: str) -> int:
    if decomposition.pair.tiles[0] == winning_tile:
        return 2

    winning_index = tile_index(winning_tile)
    for group in decomposition.melds:
        if group.kind != "sequence" or winning_tile not in group.tiles:
            continue
        indexes = [tile_index(tile) for tile in group.tiles]
        if indexes[1] == winning_index:
            return 2
        if indexes[0] % 9 == 0 and indexes[2] == winning_index:
            return 2
        if indexes[0] % 9 == 6 and indexes[0] == winning_index:
            return 2

    return 0


def _is_simple(tile: str) -> bool:
    index = tile_index(tile)
    return index < 27 and index % 9 not in {0, 8}


def _is_honor(tile: str) -> bool:
    return tile_index(tile) >= 27


def _single_number_suit(tiles: tuple[str, ...]) -> int | None:
    suits = {tile_index(tile) // 9 for tile in tiles if tile_index(tile) < 27}
    if len(suits) != 1:
        return None
    return next(iter(suits))
