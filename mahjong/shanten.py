from __future__ import annotations

from functools import lru_cache


def normal_shanten(counts: tuple[int, ...] | list[int]) -> int:
    """Return shanten number for normal hands only.

    Winning normal hands return -1, tenpai returns 0, and iishanten returns 1.
    Chiitoitsu and kokushi are intentionally excluded so they can be added as
    separate strategies later.
    """
    counts_tuple = tuple(counts)
    if len(counts_tuple) != 34:
        raise ValueError("normal_shanten expects 34 tile counts.")

    best = 8

    for pair_index in [None] + [index for index, count in enumerate(counts_tuple) if count >= 2]:
        working = list(counts_tuple)
        has_pair = 0
        if pair_index is not None:
            working[pair_index] -= 2
            has_pair = 1

        for melds, taatsu in _block_options(tuple(working)):
            capped_taatsu = min(taatsu, 4 - melds)
            best = min(best, 8 - (2 * melds) - capped_taatsu - has_pair)

    return best


@lru_cache(maxsize=None)
def _block_options(counts: tuple[int, ...]) -> frozenset[tuple[int, int]]:
    first = next((index for index, count in enumerate(counts) if count), None)
    if first is None:
        return frozenset({(0, 0)})

    results: set[tuple[int, int]] = set()

    def add_branch(next_counts: list[int], meld_delta: int = 0, taatsu_delta: int = 0) -> None:
        for melds, taatsu in _block_options(tuple(next_counts)):
            results.add((melds + meld_delta, taatsu + taatsu_delta))

    # Ignore this tile as an isolated tile.
    skipped = list(counts)
    skipped[first] -= 1
    add_branch(skipped)

    if counts[first] >= 3:
        triplet = list(counts)
        triplet[first] -= 3
        add_branch(triplet, meld_delta=1)

    if _can_start_sequence(first) and counts[first + 1] and counts[first + 2]:
        sequence = list(counts)
        sequence[first] -= 1
        sequence[first + 1] -= 1
        sequence[first + 2] -= 1
        add_branch(sequence, meld_delta=1)

    if counts[first] >= 2:
        pair_taatsu = list(counts)
        pair_taatsu[first] -= 2
        add_branch(pair_taatsu, taatsu_delta=1)

    if _can_connect(first, 1) and counts[first + 1]:
        adjacent = list(counts)
        adjacent[first] -= 1
        adjacent[first + 1] -= 1
        add_branch(adjacent, taatsu_delta=1)

    if _can_connect(first, 2) and counts[first + 2]:
        closed_wait = list(counts)
        closed_wait[first] -= 1
        closed_wait[first + 2] -= 1
        add_branch(closed_wait, taatsu_delta=1)

    return frozenset(results)


def _can_start_sequence(index: int) -> bool:
    return index < 27 and index % 9 <= 6


def _can_connect(index: int, distance: int) -> bool:
    return index < 27 and (index // 9) == ((index + distance) // 9) and (index % 9) + distance <= 8
