from __future__ import annotations

from dataclasses import dataclass
from typing import Literal

from mahjong.hand_decomposer import HandGroup, StandardHandDecomposition
from mahjong.melds import Meld
from mahjong.tiles import tile_index
from mahjong.yaku import DRAGONS, EAST, NORTH, SOUTH, WEST


WinMethod = Literal["ron", "tsumo"]


@dataclass(frozen=True)
class FuContext:
    win_method: WinMethod
    winning_tile: str
    round_wind: str
    seat_wind: str


@dataclass(frozen=True)
class FuItem:
    label: str
    fu: int


@dataclass(frozen=True)
class FuResult:
    total_before_rounding: int
    rounded_fu: int
    items: tuple[FuItem, ...]


def calculate_standard_fu(
    decomposition: StandardHandDecomposition,
    context: FuContext,
) -> FuResult:
    """Calculate fu for a standard 4-meld-1-pair hand."""
    _validate_context(context)
    items: list[FuItem] = [FuItem("\u526f\u5e9520\u7b26", 20)]
    is_closed = not any(meld.is_open for meld in decomposition.open_melds)

    if is_closed and context.win_method == "ron":
        items.append(FuItem("\u9580\u524d\u30ed\u30f310\u7b26", 10))

    pair_fu = _pair_fu(decomposition.pair, context)
    if pair_fu:
        items.append(FuItem("\u5f79\u724c\u96c0\u982d", pair_fu))

    wait_fu = _wait_fu(decomposition, context)
    if wait_fu:
        items.append(FuItem("\u5f85\u3061\u7b26", wait_fu))

    items.extend(_closed_meld_fu_items(decomposition, context, wait_fu > 0))
    items.extend(_open_meld_fu_items(decomposition.open_melds))

    pinfu_shape = _is_pinfu_shape(decomposition, context)
    if context.win_method == "tsumo" and not pinfu_shape:
        items.append(FuItem("\u30c4\u30e22\u7b26", 2))

    total = sum(item.fu for item in items)
    rounded = 20 if context.win_method == "tsumo" and pinfu_shape else _round_fu(total)
    if context.win_method == "ron" and rounded == 20:
        rounded = 30

    return FuResult(total_before_rounding=total, rounded_fu=rounded, items=tuple(items))


def chiitoitsu_fu() -> FuResult:
    return FuResult(
        total_before_rounding=25,
        rounded_fu=25,
        items=(FuItem("\u4e03\u5bfe\u5b5025\u7b26", 25),),
    )


def _pair_fu(pair: HandGroup, context: FuContext) -> int:
    tile = pair.tiles[0]
    fu = 0
    if tile in DRAGONS:
        fu += 2
    if tile == context.round_wind:
        fu += 2
    if tile == context.seat_wind:
        fu += 2
    return fu


def _wait_fu(decomposition: StandardHandDecomposition, context: FuContext) -> int:
    if decomposition.pair.tiles[0] == context.winning_tile:
        return 2

    for group in decomposition.melds:
        if group.kind != "sequence" or context.winning_tile not in group.tiles:
            continue
        indexes = [tile_index(tile) for tile in group.tiles]
        winning_index = tile_index(context.winning_tile)
        if indexes[1] == winning_index:
            return 2
        if indexes[0] % 9 == 0 and indexes[2] == winning_index:
            return 2
        if indexes[0] % 9 == 6 and indexes[0] == winning_index:
            return 2

    return 0


def _closed_meld_fu_items(
    decomposition: StandardHandDecomposition,
    context: FuContext,
    has_wait_fu: bool,
) -> list[FuItem]:
    items: list[FuItem] = []
    for group in decomposition.melds:
        if group.kind != "triplet":
            continue
        is_open_triplet_by_ron = (
            context.win_method == "ron"
            and context.winning_tile in group.tiles
            and not has_wait_fu
        )
        fu = _triplet_fu(group.tiles[0], is_open=is_open_triplet_by_ron)
        label = "\u660e\u523b" if is_open_triplet_by_ron else "\u6697\u523b"
        items.append(FuItem(label, fu))
    return items


def _open_meld_fu_items(melds: tuple[Meld, ...]) -> list[FuItem]:
    items: list[FuItem] = []
    for meld in melds:
        if meld.kind == "chi":
            continue
        if meld.kind == "pon":
            items.append(FuItem("\u660e\u523b", _triplet_fu(meld.tiles[0], is_open=True)))
        elif meld.kind in {"open_kan", "added_kan"}:
            items.append(FuItem("\u660e\u69d3", _kan_fu(meld.tiles[0], is_open=True)))
        elif meld.kind == "closed_kan":
            items.append(FuItem("\u6697\u69d3", _kan_fu(meld.tiles[0], is_open=False)))
    return items


def _triplet_fu(tile: str, *, is_open: bool) -> int:
    if _is_terminal_or_honor(tile):
        return 4 if is_open else 8
    return 2 if is_open else 4


def _kan_fu(tile: str, *, is_open: bool) -> int:
    if _is_terminal_or_honor(tile):
        return 16 if is_open else 32
    return 8 if is_open else 16


def _is_pinfu_shape(decomposition: StandardHandDecomposition, context: FuContext) -> bool:
    if decomposition.open_melds:
        return False
    if any(group.kind != "sequence" for group in decomposition.melds):
        return False
    if _pair_fu(decomposition.pair, context) != 0:
        return False
    return _wait_fu(decomposition, context) == 0


def _is_terminal_or_honor(tile: str) -> bool:
    index = tile_index(tile)
    return index >= 27 or index % 9 in {0, 8}


def _round_fu(value: int) -> int:
    return ((value + 9) // 10) * 10


def _validate_context(context: FuContext) -> None:
    if context.win_method not in {"ron", "tsumo"}:
        raise ValueError("win_method must be 'ron' or 'tsumo'.")
    valid_winds = {EAST, SOUTH, WEST, NORTH}
    if context.round_wind not in valid_winds:
        raise ValueError("round_wind must be a wind tile.")
    if context.seat_wind not in valid_winds:
        raise ValueError("seat_wind must be a wind tile.")
