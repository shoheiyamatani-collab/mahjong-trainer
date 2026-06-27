from __future__ import annotations

import random
from collections.abc import Iterable

from mahjong.chinitsu.parser import chinitsu_tiles, validate_chinitsu_counts
from mahjong.chinitsu.types import (
    ChinitsuDifficulty,
    ChinitsuGeneratedQuestion,
    ChinitsuHand,
    ChinitsuWaitQuestion,
)
from mahjong.chinitsu.waits import find_waits_13


def hand_key(hand: ChinitsuHand) -> str:
    return "".join(str(rank) for rank in chinitsu_tiles(hand))


def generate_chinitsu_hand(rng: random.Random | None = None) -> ChinitsuHand:
    rng = rng or random
    wall = [rank for rank in range(1, 10) for _ in range(4)]
    tiles = rng.sample(wall, 13)
    counts = tuple(tiles.count(rank) for rank in range(1, 10))
    validate_chinitsu_counts(counts, expected_total=13)
    return ChinitsuHand(counts)


def remaining_tiles_for_waits(hand: ChinitsuHand, waits: Iterable[int]) -> dict[int, int]:
    validate_chinitsu_counts(hand.counts, expected_total=13)
    remaining: dict[int, int] = {}
    for rank in waits:
        if rank < 1 or rank > 9:
            raise ValueError("wait ranks must be between 1 and 9.")
        left = 4 - hand.counts[rank - 1]
        if left <= 0:
            raise ValueError(f"rank {rank} has no remaining tiles.")
        remaining[rank] = left
    return remaining


def classify_wait_difficulty(wait_count: int) -> ChinitsuDifficulty:
    if wait_count <= 0:
        raise ValueError("wait_count must be positive.")
    if wait_count <= 2:
        return "easy"
    if wait_count <= 4:
        return "normal"
    return "hard"


def analyze_generated_question(hand: ChinitsuHand) -> ChinitsuGeneratedQuestion:
    validate_chinitsu_counts(hand.counts, expected_total=13)
    waits = find_waits_13(hand)
    if not waits:
        raise ValueError("Generated chinitsu questions must have at least one wait.")
    return ChinitsuGeneratedQuestion(
        hand=hand,
        waits=waits,
        remaining_tiles=remaining_tiles_for_waits(hand, waits),
        difficulty=classify_wait_difficulty(len(waits)),
    )


def generate_wait_question(
    rng: random.Random | None = None,
    *,
    difficulty: ChinitsuDifficulty | None = None,
    recent_hands: Iterable[str | ChinitsuHand] = (),
    max_attempts: int = 10_000,
) -> ChinitsuGeneratedQuestion:
    rng = rng or random
    recent_keys = {
        value if isinstance(value, str) else hand_key(value)
        for value in recent_hands
    }

    fallback: ChinitsuGeneratedQuestion | None = None
    for _ in range(max_attempts):
        hand = generate_chinitsu_hand(rng)
        try:
            question = analyze_generated_question(hand)
        except ValueError:
            continue
        if difficulty is not None and question.difficulty != difficulty:
            continue
        if fallback is None:
            fallback = question
        if hand_key(question.hand) not in recent_keys:
            return question

    if fallback is not None:
        return fallback
    raise RuntimeError("Could not generate a valid chinitsu wait question.")


def generate_wait_question_stub() -> ChinitsuWaitQuestion:
    raise NotImplementedError("Chinitsu wait question generation will be added later.")


def site_sample_wait_question() -> ChinitsuWaitQuestion:
    question = generate_wait_question(random.Random(20260627))
    return ChinitsuWaitQuestion(hand=question.hand, waits=question.waits)
