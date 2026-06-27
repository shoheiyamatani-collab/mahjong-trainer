from __future__ import annotations

from dataclasses import dataclass
from typing import Literal

from mahjong.tiles import tile_index


MeldKind = Literal["chi", "pon", "open_kan", "closed_kan", "added_kan"]


@dataclass(frozen=True)
class Meld:
    kind: MeldKind
    tiles: tuple[str, ...]

    @property
    def is_open(self) -> bool:
        return self.kind != "closed_kan"

    @property
    def is_kan(self) -> bool:
        return self.kind in {"open_kan", "closed_kan", "added_kan"}


def validate_meld(meld: Meld) -> None:
    if meld.kind == "chi":
        _validate_chi(meld.tiles)
        return
    if meld.kind == "pon":
        _validate_same_tiles(meld.tiles, 3, "pon")
        return
    if meld.kind in {"open_kan", "closed_kan", "added_kan"}:
        _validate_same_tiles(meld.tiles, 4, meld.kind)
        return
    raise ValueError(f"Unknown meld kind: {meld.kind}")


def meld_tile_counts(melds: tuple[Meld, ...] | list[Meld]) -> list[int]:
    counts = [0] * 34
    for meld in melds:
        validate_meld(meld)
        for tile in meld.tiles:
            counts[tile_index(tile)] += 1
    return counts


def _validate_chi(tiles: tuple[str, ...]) -> None:
    if len(tiles) != 3:
        raise ValueError("chi must have three tiles.")
    indexes = sorted(tile_index(tile) for tile in tiles)
    if any(index >= 27 for index in indexes):
        raise ValueError("chi must use number tiles.")
    if indexes[0] // 9 != indexes[2] // 9:
        raise ValueError("chi tiles must be in the same suit.")
    if indexes != list(range(indexes[0], indexes[0] + 3)):
        raise ValueError("chi tiles must be consecutive.")


def _validate_same_tiles(tiles: tuple[str, ...], expected_count: int, kind: str) -> None:
    if len(tiles) != expected_count:
        raise ValueError(f"{kind} must have {expected_count} tiles.")
    if len(set(tiles)) != 1:
        raise ValueError(f"{kind} tiles must be identical.")
