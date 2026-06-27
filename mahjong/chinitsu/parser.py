from __future__ import annotations

from mahjong.chinitsu.types import ChinitsuHand


SUIT_OFFSETS = {
    "m": 0,
    "p": 9,
    "s": 18,
}


def parse_chinitsu_hand(text: str, expected_total: int | None = None) -> ChinitsuHand:
    counts = [0] * 9
    value = text.strip()

    for char in value:
        if char.isspace() or char in ",\u3001\uff0c/|":
            continue
        if char < "1" or char > "9":
            raise ValueError(f"Chinitsu hands must use only ranks 1-9: {char}")
        counts[int(char) - 1] += 1
        if counts[int(char) - 1] > 4:
            raise ValueError(f"A rank appears more than four times: {char}")

    validate_chinitsu_counts(counts, expected_total=expected_total)
    return ChinitsuHand(tuple(counts))


def validate_chinitsu_counts(
    counts: tuple[int, ...] | list[int],
    expected_total: int | None = None,
) -> None:
    if len(counts) != 9:
        raise ValueError("A chinitsu hand must use 9 rank counts.")
    if any(count < 0 for count in counts):
        raise ValueError("Rank counts cannot be negative.")
    over_limit = [str(index + 1) for index, count in enumerate(counts) if count > 4]
    if over_limit:
        raise ValueError(f"A rank appears more than four times: {', '.join(over_limit)}")
    if expected_total is not None and sum(counts) != expected_total:
        raise ValueError(f"Expected {expected_total} tiles, got {sum(counts)}.")


def chinitsu_tiles(hand: ChinitsuHand) -> tuple[int, ...]:
    validate_chinitsu_counts(hand.counts)
    tiles: list[int] = []
    for index, count in enumerate(hand.counts):
        tiles.extend([index + 1] * count)
    return tuple(tiles)


def to_34_counts(hand: ChinitsuHand, suit: str = "m") -> tuple[int, ...]:
    validate_chinitsu_counts(hand.counts)
    if suit not in SUIT_OFFSETS:
        raise ValueError("suit must be one of: m, p, s.")
    counts = [0] * 34
    offset = SUIT_OFFSETS[suit]
    for index, count in enumerate(hand.counts):
        counts[offset + index] = count
    return tuple(counts)
