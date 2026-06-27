from __future__ import annotations

from dataclasses import dataclass
from typing import Literal


ChinitsuDifficulty = Literal["easy", "normal", "hard"]


@dataclass(frozen=True)
class ChinitsuHand:
    counts: tuple[int, ...]


@dataclass(frozen=True)
class ChinitsuWaitQuestion:
    hand: ChinitsuHand
    waits: tuple[int, ...]
    suit: str = "s"


@dataclass(frozen=True)
class ChinitsuGeneratedQuestion:
    hand: ChinitsuHand
    waits: tuple[int, ...]
    remaining_tiles: dict[int, int]
    difficulty: ChinitsuDifficulty

    @property
    def wait_count(self) -> int:
        return len(self.waits)
