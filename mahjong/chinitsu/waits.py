from __future__ import annotations

from mahjong.chinitsu.parser import to_34_counts, validate_chinitsu_counts
from mahjong.chinitsu.types import ChinitsuHand
from mahjong.shanten import normal_shanten


def find_waits_13(hand: ChinitsuHand) -> tuple[int, ...]:
    validate_chinitsu_counts(hand.counts, expected_total=13)
    waits: list[int] = []

    for rank_index, count in enumerate(hand.counts):
        if count >= 4:
            continue
        drawn_counts = list(hand.counts)
        drawn_counts[rank_index] += 1
        if is_chinitsu_win(ChinitsuHand(tuple(drawn_counts))):
            waits.append(rank_index + 1)

    return tuple(waits)


def is_chinitsu_win(hand: ChinitsuHand) -> bool:
    validate_chinitsu_counts(hand.counts, expected_total=14)
    if is_chinitsu_chiitoitsu(hand):
        return True
    return normal_shanten(to_34_counts(hand)) == -1


def is_chinitsu_chiitoitsu(hand: ChinitsuHand) -> bool:
    validate_chinitsu_counts(hand.counts, expected_total=14)
    return sum(1 for count in hand.counts if count == 2) == 7

