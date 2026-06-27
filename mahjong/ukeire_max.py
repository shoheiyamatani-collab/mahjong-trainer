from __future__ import annotations

import random
from dataclasses import dataclass
from typing import Sequence

from mahjong.analyzer import DiscardAnalysis, analyze_discards
from mahjong.shanten import normal_shanten
from mahjong.tiles import TILE_NAMES, counts_to_tiles, empty_counts, tile_index, validate_counts


NUMBER_TILE_COUNT = 27
MIN_BEST_UKEIRE_TYPES = 6
MAX_SIMPLE_GAP = 4


@dataclass(frozen=True)
class UkeireMaxQuestion:
    counts: tuple[int, ...]
    results: tuple[DiscardAnalysis, ...]
    best_discards: tuple[str, ...]

    @property
    def best_ukeire_tiles(self) -> int:
        return max(result.ukeire_tiles for result in self._best_results)

    @property
    def best_ukeire_types(self) -> int:
        return max(result.ukeire_types for result in self._best_results)

    @property
    def _best_results(self) -> tuple[DiscardAnalysis, ...]:
        best = set(self.best_discards)
        return tuple(result for result in self.results if result.discard in best)


def generate_ukeire_max_question(
    *,
    rng: random.Random | None = None,
    max_attempts: int = 20000,
) -> UkeireMaxQuestion:
    """Generate a 14-tile no-honor discard problem with iishanten ukeire answers."""
    generator = rng or random
    fallback: UkeireMaxQuestion | None = None

    for _ in range(max_attempts):
        counts = _random_no_honor_counts(generator)
        question = build_ukeire_max_question(counts)
        if question is None:
            continue
        if fallback is None:
            fallback = question
        if _has_close_competition(question.results, question.best_discards):
            return question

    if fallback is not None:
        return fallback
    raise RuntimeError("Could not generate a ukeire max question.")


def build_ukeire_max_question(counts: Sequence[int]) -> UkeireMaxQuestion | None:
    validate_counts(counts, expected_total=14)
    if any(counts[index] for index in range(NUMBER_TILE_COUNT, len(TILE_NAMES))):
        return None

    results = tuple(analyze_discards(tuple(counts)))
    if min(result.after_discard_shanten for result in results) != 1:
        return None

    iishanten_results = tuple(result for result in results if result.after_discard_shanten == 1)
    if not iishanten_results:
        return None

    best_ukeire_tiles = max(result.ukeire_tiles for result in iishanten_results)
    best_results = tuple(result for result in iishanten_results if result.ukeire_tiles == best_ukeire_tiles)
    if not best_results:
        return None
    if min(result.ukeire_types for result in best_results) < MIN_BEST_UKEIRE_TYPES:
        return None

    return UkeireMaxQuestion(
        counts=tuple(counts),
        results=results,
        best_discards=tuple(sorted((result.discard for result in best_results), key=tile_index)),
    )


def evaluate_ukeire_max_answer(question: UkeireMaxQuestion, discards: Sequence[str] | str | None) -> bool:
    if discards is None:
        selected: set[str] = set()
    elif isinstance(discards, str):
        selected = {discards}
    else:
        selected = set(discards)
    return selected == set(question.best_discards)


def is_partial_ukeire_max_answer(question: UkeireMaxQuestion, discards: Sequence[str] | str | None) -> bool:
    if discards is None:
        selected: set[str] = set()
    elif isinstance(discards, str):
        selected = {discards}
    else:
        selected = set(discards)
    correct = set(question.best_discards)
    return bool(selected) and selected < correct


def _random_no_honor_counts(generator: random.Random) -> tuple[int, ...]:
    counts = _random_no_honor_iishanten_counts(generator)
    while True:
        index = generator.randrange(NUMBER_TILE_COUNT)
        if counts[index] >= 4:
            continue
        counts[index] += 1
        return tuple(counts)


def _random_no_honor_iishanten_counts(generator: random.Random) -> list[int]:
    while True:
        counts = empty_counts()
        while sum(counts) < 13:
            index = generator.randrange(NUMBER_TILE_COUNT)
            if counts[index] >= 4:
                continue
            counts[index] += 1
        if normal_shanten(tuple(counts)) != 1:
            continue
        if _ukeire_type_count(counts) >= MIN_BEST_UKEIRE_TYPES:
            return counts


def _ukeire_type_count(counts: list[int]) -> int:
    target_shanten = normal_shanten(tuple(counts)) - 1
    ukeire_types = 0
    for index in range(NUMBER_TILE_COUNT):
        if counts[index] >= 4:
            continue
        drawn = counts.copy()
        drawn[index] += 1
        if normal_shanten(tuple(drawn)) <= target_shanten:
            ukeire_types += 1
    return ukeire_types


def _has_close_competition(results: tuple[DiscardAnalysis, ...], best_discards: tuple[str, ...]) -> bool:
    iishanten_results = [result for result in results if result.after_discard_shanten == 1]
    if len(iishanten_results) < 2:
        return False

    best_tiles = max(result.ukeire_tiles for result in iishanten_results)
    competitors = [
        result
        for result in iishanten_results
        if result.discard not in best_discards and best_tiles - result.ukeire_tiles <= MAX_SIMPLE_GAP
    ]
    return bool(competitors)


def question_hand_text(question: UkeireMaxQuestion) -> str:
    return " ".join(counts_to_tiles(question.counts))
