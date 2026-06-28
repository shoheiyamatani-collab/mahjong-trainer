from __future__ import annotations

import random
import logging
from dataclasses import dataclass
from typing import Sequence

from mahjong.analyzer import DiscardAnalysis, analyze_discards
from mahjong.shanten import normal_shanten
from mahjong.tiles import TILE_NAMES, counts_to_tiles, empty_counts, tile_index, validate_counts


NUMBER_TILE_COUNT = 27
MIN_BEST_UKEIRE_TYPES = 6
MAX_SIMPLE_GAP = 4
LOGGER = logging.getLogger(__name__)


@dataclass(frozen=True)
class DifficultQuestionConfig:
    no_honors: bool = True
    require_iishanten: bool = True
    min_best_second_diff: int = 1
    max_best_second_diff: int = 4
    near_best_range: int = 5
    min_near_best_candidates: int = 3
    exclude_obvious_isolated_best_discard: bool = True
    prefer_middle_tiles: bool = True
    min_middle_tile_ratio: float = 0.6
    prefer_complex_shapes: bool = True
    max_difficult_attempts: int = 12
    relaxed_min_near_best_candidates: int = 2
    relaxed_min_middle_tile_ratio: float = 0.5


@dataclass(frozen=True)
class DifficultQuestionEvaluation:
    accepted: bool
    reject_reasons: tuple[str, ...]
    ranking: tuple[DiscardAnalysis, ...]
    best_second_diff: int | None
    near_best_candidate_count: int
    middle_tile_ratio: float
    complex_shape_score: int


DIFFICULT_QUESTION_CONFIG = DifficultQuestionConfig()


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
    config: DifficultQuestionConfig = DIFFICULT_QUESTION_CONFIG,
) -> UkeireMaxQuestion:
    """Generate a 14-tile no-honor discard problem with iishanten ukeire answers."""
    generator = rng or random
    fallback: UkeireMaxQuestion | None = None
    best_scored: tuple[tuple[float, float], UkeireMaxQuestion] | None = None
    relaxed_fallback: UkeireMaxQuestion | None = None

    for attempt in range(max_attempts):
        counts = _random_no_honor_counts(generator)
        question = build_ukeire_max_question(counts)
        if question is None:
            continue
        if fallback is None:
            fallback = question

        if attempt >= config.max_difficult_attempts:
            if best_scored is not None:
                LOGGER.debug("Falling back to best scored ukeire max question after strict search limit.")
                return best_scored[1]
            if relaxed_fallback is not None:
                LOGGER.debug("Falling back to relaxed difficult ukeire max question after strict search limit.")
                return relaxed_fallback
            LOGGER.debug("Falling back to basic ukeire max question after strict search limit.")
            return fallback

        evaluation = evaluate_difficult_ukeire_question(question, config)
        if relaxed_fallback is None and evaluate_difficult_ukeire_question(question, _relaxed_config(config)).accepted:
            relaxed_fallback = question
        if not evaluation.accepted:
            continue

        score_key = (
            float(evaluation.complex_shape_score if config.prefer_complex_shapes else 0),
            evaluation.middle_tile_ratio if config.prefer_middle_tiles else 0.0,
        )
        if best_scored is None or score_key > best_scored[0]:
            best_scored = (score_key, question)
        if evaluation.complex_shape_score >= 3:
            return question

    if best_scored is not None:
        return best_scored[1]
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


def filter_difficult_ukeire_question(
    question: UkeireMaxQuestion,
    config: DifficultQuestionConfig = DIFFICULT_QUESTION_CONFIG,
) -> bool:
    return evaluate_difficult_ukeire_question(question, config).accepted


def difficult_ukeire_debug_info(
    question: UkeireMaxQuestion,
    config: DifficultQuestionConfig = DIFFICULT_QUESTION_CONFIG,
) -> dict[str, object]:
    evaluation = evaluate_difficult_ukeire_question(question, config)
    return {
        "accepted": evaluation.accepted,
        "reject_reasons": evaluation.reject_reasons,
        "best_second_diff": evaluation.best_second_diff,
        "near_best_candidate_count": evaluation.near_best_candidate_count,
        "middle_tile_ratio": evaluation.middle_tile_ratio,
        "complex_shape_score": evaluation.complex_shape_score,
        "ranking": [
            {
                "discard": result.discard,
                "ukeire_types": result.ukeire_types,
                "ukeire_tiles": result.ukeire_tiles,
                "after_discard_shanten": result.after_discard_shanten,
            }
            for result in evaluation.ranking
        ],
    }


def evaluate_difficult_ukeire_question(
    question: UkeireMaxQuestion,
    config: DifficultQuestionConfig = DIFFICULT_QUESTION_CONFIG,
) -> DifficultQuestionEvaluation:
    counts = tuple(question.counts)
    ranking = get_discard_ukeire_ranking(question.results)
    middle_ratio = middle_tile_ratio(counts)
    complex_score = score_complex_shape(counts)
    reasons: list[str] = []

    if config.no_honors and _has_honors(counts):
        reasons.append("honors")

    if config.require_iishanten and not ranking:
        reasons.append("not_iishanten_after_discard")

    best_second_diff: int | None = None
    near_best_count = 0
    if ranking:
        best_tiles = ranking[0].ukeire_tiles
        near_best_count = sum(1 for result in ranking if best_tiles - result.ukeire_tiles <= config.near_best_range)
        if len(ranking) < 2:
            reasons.append("no_second_candidate")
        else:
            best_second_diff = best_tiles - ranking[1].ukeire_tiles
            if best_second_diff == 0:
                reasons.append("tied_best")
            elif not (config.min_best_second_diff <= best_second_diff <= config.max_best_second_diff):
                reasons.append("best_second_diff")

        if near_best_count < config.min_near_best_candidates:
            reasons.append("not_enough_near_best_candidates")

        if config.exclude_obvious_isolated_best_discard and is_obvious_isolated_tile(ranking[0].discard, counts):
            reasons.append("obvious_isolated_best_discard")

    if config.prefer_middle_tiles and middle_ratio < config.min_middle_tile_ratio:
        reasons.append("middle_tile_ratio")

    return DifficultQuestionEvaluation(
        accepted=not reasons,
        reject_reasons=tuple(reasons),
        ranking=ranking,
        best_second_diff=best_second_diff,
        near_best_candidate_count=near_best_count,
        middle_tile_ratio=middle_ratio,
        complex_shape_score=complex_score,
    )


def get_discard_ukeire_ranking(results: Sequence[DiscardAnalysis]) -> tuple[DiscardAnalysis, ...]:
    iishanten_results = [result for result in results if result.after_discard_shanten == 1]
    return tuple(
        sorted(
            iishanten_results,
            key=lambda result: (-result.ukeire_tiles, -result.ukeire_types, tile_index(result.discard)),
        )
    )


def is_obvious_isolated_tile(tile: str, counts: Sequence[int]) -> bool:
    index = tile_index(tile)
    if index >= NUMBER_TILE_COUNT or counts[index] != 1:
        return False

    suit_start = (index // 9) * 9
    rank = index % 9
    nearby_by_rank = {
        0: (1, 2),
        1: (0, 2, 3),
        7: (5, 6, 8),
        8: (6, 7),
    }
    nearby = nearby_by_rank.get(rank, (rank - 2, rank - 1, rank + 1, rank + 2))
    return all(counts[suit_start + nearby_rank] == 0 for nearby_rank in nearby)


def middle_tile_ratio(counts: Sequence[int]) -> float:
    total = sum(counts)
    if total == 0:
        return 0.0
    middle_tiles = 0
    for index, count in enumerate(counts[:NUMBER_TILE_COUNT]):
        rank = index % 9 + 1
        if 3 <= rank <= 7:
            middle_tiles += count
    return middle_tiles / total


def score_complex_shape(counts: Sequence[int]) -> int:
    score = 0
    suit_counts = counts[:NUMBER_TILE_COUNT]

    pair_count = sum(1 for count in suit_counts if count >= 2)
    triplet_count = sum(1 for count in suit_counts if count >= 3)
    if pair_count >= 2:
        score += pair_count - 1
    score += triplet_count * 2

    for suit_start in range(0, NUMBER_TILE_COUNT, 9):
        suit = list(counts[suit_start : suit_start + 9])
        score += _score_suit_complex_shape(suit)

    return score


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


def _has_honors(counts: Sequence[int]) -> bool:
    return any(counts[index] for index in range(NUMBER_TILE_COUNT, len(TILE_NAMES)))


def _relaxed_config(config: DifficultQuestionConfig) -> DifficultQuestionConfig:
    return DifficultQuestionConfig(
        no_honors=config.no_honors,
        require_iishanten=config.require_iishanten,
        min_best_second_diff=config.min_best_second_diff,
        max_best_second_diff=config.max_best_second_diff + 1,
        near_best_range=config.near_best_range,
        min_near_best_candidates=config.relaxed_min_near_best_candidates,
        exclude_obvious_isolated_best_discard=config.exclude_obvious_isolated_best_discard,
        prefer_middle_tiles=config.prefer_middle_tiles,
        min_middle_tile_ratio=config.relaxed_min_middle_tile_ratio,
        prefer_complex_shapes=config.prefer_complex_shapes,
        max_difficult_attempts=config.max_difficult_attempts,
        relaxed_min_near_best_candidates=config.relaxed_min_near_best_candidates,
        relaxed_min_middle_tile_ratio=config.relaxed_min_middle_tile_ratio,
    )


def _score_suit_complex_shape(suit: list[int]) -> int:
    score = 0

    for rank in range(9):
        if suit[rank] < 3:
            continue
        if rank <= 6 and suit[rank + 1] and suit[rank + 2]:
            score += 2
        if rank >= 2 and suit[rank - 1] and suit[rank - 2]:
            score += 2
        if 0 < rank < 8 and suit[rank - 1] and suit[rank + 1]:
            score += 1

    for rank in range(7):
        if suit[rank] and suit[rank + 1] >= 2 and suit[rank + 2]:
            score += 2
        if suit[rank] >= 2 and suit[rank + 1] >= 2 and suit[rank + 2] >= 2:
            score += 3

    for rank in range(6):
        if suit[rank] and suit[rank + 1] >= 2 and suit[rank + 2] >= 2 and suit[rank + 3]:
            score += 3

    block_length = 0
    for count in suit:
        if count:
            block_length += 1
            if block_length >= 4:
                score += 1
        else:
            block_length = 0

    return score


def question_hand_text(question: UkeireMaxQuestion) -> str:
    return " ".join(counts_to_tiles(question.counts))
