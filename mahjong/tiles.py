from __future__ import annotations

from dataclasses import dataclass


SUITS = ("m", "p", "s")
HONORS = (
    "\u6771",
    "\u5357",
    "\u897f",
    "\u5317",
    "\u767d",
    "\u767c",
    "\u4e2d",
)
TILE_NAMES = tuple(
    [f"{rank}{suit}" for suit in SUITS for rank in range(1, 10)] + list(HONORS)
)
TILE_TO_INDEX = {tile: index for index, tile in enumerate(TILE_NAMES)}
INDEX_TO_TILE = {index: tile for index, tile in enumerate(TILE_NAMES)}
HONOR_ALIASES = {
    "\u6771": "\u6771",
    "\u5357": "\u5357",
    "\u897f": "\u897f",
    "\u5317": "\u5317",
    "\u767d": "\u767d",
    "\u767c": "\u767c",
    "\u767a": "\u767c",
    "\u4e2d": "\u4e2d",
}


@dataclass(frozen=True)
class ParsedHand:
    counts: tuple[int, ...]
    tiles: tuple[str, ...]


def empty_counts() -> list[int]:
    return [0] * 34


def tile_index(tile: str) -> int:
    normalized = HONOR_ALIASES.get(tile, tile)
    if normalized not in TILE_TO_INDEX:
        raise ValueError(f"Unknown tile: {tile}")
    return TILE_TO_INDEX[normalized]


def tile_name(index: int) -> str:
    return INDEX_TO_TILE[index]


def counts_to_tiles(counts: tuple[int, ...] | list[int]) -> list[str]:
    tiles: list[str] = []
    for index, count in enumerate(counts):
        tiles.extend([tile_name(index)] * count)
    return tiles


def format_counts(counts: tuple[int, ...] | list[int]) -> str:
    return " ".join(counts_to_tiles(counts))


def parse_hand(text: str) -> ParsedHand:
    """Parse separated or compact tile notation into 34 tile counts.

    Supported examples:
    - 1m,2m,3m,East honor,Green dragon
    - 123m 456p 789s honors
    - 123m456p789s followed by honor characters
    """
    counts = empty_counts()
    tiles: list[str] = []
    i = 0
    value = text.strip()

    while i < len(value):
        char = value[i]
        if char.isspace() or char in ",\u3001\uff0c/|":
            i += 1
            continue

        if char.isdigit():
            digits: list[str] = []
            while i < len(value) and value[i].isdigit():
                digit = value[i]
                if digit == "0":
                    raise ValueError("Red fives / 0 notation are not supported.")
                if digit < "1" or digit > "9":
                    raise ValueError(f"Invalid tile rank: {digit}")
                digits.append(digit)
                i += 1
            if i >= len(value) or value[i] not in SUITS:
                raise ValueError("Number tiles must be followed by m, p, or s.")
            suit = value[i]
            i += 1
            for digit in digits:
                _add_tile(counts, tiles, f"{digit}{suit}")
            continue

        if char in HONOR_ALIASES:
            _add_tile(counts, tiles, HONOR_ALIASES[char])
            i += 1
            continue

        raise ValueError(f"Cannot parse tile around: {value[i:]}")

    return ParsedHand(tuple(counts), tuple(tiles))


def validate_counts(counts: tuple[int, ...] | list[int], expected_total: int | None = None) -> None:
    if len(counts) != 34:
        raise ValueError("A hand must use 34 tile counts.")
    if any(count < 0 for count in counts):
        raise ValueError("Tile counts cannot be negative.")
    over_limit = [tile_name(index) for index, count in enumerate(counts) if count > 4]
    if over_limit:
        raise ValueError(f"A tile appears more than four times: {', '.join(over_limit)}")
    if expected_total is not None and sum(counts) != expected_total:
        raise ValueError(f"Expected {expected_total} tiles, got {sum(counts)}.")


def _add_tile(counts: list[int], tiles: list[str], tile: str) -> None:
    index = tile_index(tile)
    counts[index] += 1
    if counts[index] > 4:
        raise ValueError(f"A tile appears more than four times: {tile}")
    tiles.append(tile)
