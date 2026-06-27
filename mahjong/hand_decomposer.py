from __future__ import annotations

from dataclasses import dataclass
from typing import Literal

from mahjong.melds import Meld
from mahjong.tiles import tile_name, validate_counts


GroupKind = Literal["sequence", "triplet", "pair"]


@dataclass(frozen=True)
class HandGroup:
    kind: GroupKind
    tiles: tuple[str, ...]


@dataclass(frozen=True)
class StandardHandDecomposition:
    melds: tuple[HandGroup, ...]
    pair: HandGroup
    open_melds: tuple[Meld, ...] = ()


def decompose_standard_hand(counts: tuple[int, ...] | list[int]) -> list[StandardHandDecomposition]:
    """Return all 4-meld-1-pair decompositions for a closed 14-tile hand."""
    return decompose_standard_hand_with_melds(counts, ())


def decompose_standard_hand_with_melds(
    counts: tuple[int, ...] | list[int],
    open_melds: tuple[Meld, ...] | list[Meld],
) -> list[StandardHandDecomposition]:
    """Return all standard-hand decompositions with declared open/kan melds."""
    melds_tuple = tuple(open_melds)
    _validate_meld_count(melds_tuple)
    required_closed_melds = 4 - len(melds_tuple)
    expected_total = 2 + (required_closed_melds * 3)
    validate_counts(counts, expected_total=expected_total)
    counts_list = list(counts)
    decompositions: list[StandardHandDecomposition] = []

    for pair_index, count in enumerate(counts_list):
        if count < 2:
            continue
        working = counts_list.copy()
        working[pair_index] -= 2
        pair = HandGroup("pair", (tile_name(pair_index), tile_name(pair_index)))
        for melds in _decompose_melds(working, required_closed_melds):
            decompositions.append(StandardHandDecomposition(tuple(melds), pair, melds_tuple))

    return _unique_decompositions(decompositions)


def _decompose_melds(counts: list[int], required_melds: int) -> list[list[HandGroup]]:
    if required_melds == 0:
        return [[]] if all(count == 0 for count in counts) else []

    first = next((index for index, count in enumerate(counts) if count), None)
    if first is None:
        return [[]] if required_melds == 0 else []

    results: list[list[HandGroup]] = []

    if counts[first] >= 3:
        counts[first] -= 3
        triplet = HandGroup("triplet", (tile_name(first), tile_name(first), tile_name(first)))
        for rest in _decompose_melds(counts, required_melds - 1):
            results.append([triplet, *rest])
        counts[first] += 3

    if _can_start_sequence(first) and counts[first + 1] > 0 and counts[first + 2] > 0:
        counts[first] -= 1
        counts[first + 1] -= 1
        counts[first + 2] -= 1
        sequence = HandGroup("sequence", (tile_name(first), tile_name(first + 1), tile_name(first + 2)))
        for rest in _decompose_melds(counts, required_melds - 1):
            results.append([sequence, *rest])
        counts[first] += 1
        counts[first + 1] += 1
        counts[first + 2] += 1

    return results


def _can_start_sequence(index: int) -> bool:
    return index < 27 and index % 9 <= 6


def _unique_decompositions(
    decompositions: list[StandardHandDecomposition],
) -> list[StandardHandDecomposition]:
    seen: set[tuple[tuple[str, tuple[str, ...]], ...]] = set()
    unique: list[StandardHandDecomposition] = []

    for decomposition in decompositions:
        key_parts = [(decomposition.pair.kind, decomposition.pair.tiles)]
        key_parts.extend(
            ("open", (meld.kind, meld.tiles))
            for meld in decomposition.open_melds
        )
        key_parts.extend(sorted((group.kind, group.tiles) for group in decomposition.melds))
        key = tuple(key_parts)
        if key in seen:
            continue
        seen.add(key)
        unique.append(
            StandardHandDecomposition(
                tuple(sorted(decomposition.melds, key=lambda group: group.tiles)),
                decomposition.pair,
                decomposition.open_melds,
            )
        )

    return unique


def _validate_meld_count(open_melds: tuple[Meld, ...]) -> None:
    if len(open_melds) > 4:
        raise ValueError("A standard hand can have at most four melds.")
