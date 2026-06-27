import random

from mahjong.tiles import counts_to_tiles, parse_hand
from mahjong.ukeire_max import (
    MIN_BEST_UKEIRE_TYPES,
    build_ukeire_max_question,
    evaluate_ukeire_max_answer,
    generate_ukeire_max_question,
)


def test_build_ukeire_max_question_requires_no_honors_and_iishanten_best_answer():
    counts = parse_hand("1455m2345677p678s").counts

    question = build_ukeire_max_question(counts)

    assert question is not None
    assert question.best_discards == ("1m",)
    assert question.best_ukeire_types >= MIN_BEST_UKEIRE_TYPES
    assert all(result.after_discard_shanten == 1 for result in question.results if result.discard in question.best_discards)


def test_build_ukeire_max_question_rejects_honors():
    counts = parse_hand("1455m234567p678s東").counts

    assert build_ukeire_max_question(counts) is None


def test_build_ukeire_max_question_rejects_hands_that_can_discard_to_tenpai():
    counts = parse_hand("11345m55567p4678s").counts

    assert build_ukeire_max_question(counts) is None


def test_evaluate_ukeire_max_answer_accepts_tied_best_discards_only():
    counts = parse_hand("1455m2345677p678s").counts
    question = build_ukeire_max_question(counts)

    assert question is not None
    assert evaluate_ukeire_max_answer(question, "1m") is True
    assert evaluate_ukeire_max_answer(question, "4m") is False


def test_generate_ukeire_max_question_returns_valid_no_honor_question():
    question = generate_ukeire_max_question(rng=random.Random(1))
    tiles = counts_to_tiles(question.counts)

    assert len(tiles) == 14
    assert all(tile[-1] in {"m", "p", "s"} for tile in tiles)
    assert max(question.counts) <= 4
    assert question.best_ukeire_types >= MIN_BEST_UKEIRE_TYPES
    assert min(result.after_discard_shanten for result in question.results) == 1
    assert all(result.after_discard_shanten == 1 for result in question.results if result.discard in question.best_discards)
