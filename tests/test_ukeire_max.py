import random

from mahjong.tiles import counts_to_tiles, parse_hand
from mahjong.analyzer import DiscardAnalysis
from mahjong.ukeire_max import (
    MIN_BEST_UKEIRE_TYPES,
    build_ukeire_max_question,
    difficult_ukeire_debug_info,
    evaluate_ukeire_max_answer,
    evaluate_difficult_ukeire_question,
    filter_difficult_ukeire_question,
    generate_ukeire_max_question,
    is_obvious_isolated_tile,
    is_partial_ukeire_max_answer,
    middle_tile_ratio,
    score_complex_shape,
    UkeireMaxQuestion,
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


def test_evaluate_ukeire_max_answer_requires_all_tied_best_discards():
    counts = parse_hand("56m44455677p6789s").counts
    question = build_ukeire_max_question(counts)

    assert question is not None
    assert question.best_discards == ("6s", "9s")
    assert evaluate_ukeire_max_answer(question, ["6s"]) is False
    assert evaluate_ukeire_max_answer(question, ["9s"]) is False
    assert evaluate_ukeire_max_answer(question, ["6s", "9s"]) is True
    assert evaluate_ukeire_max_answer(question, ["6s", "8s", "9s"]) is False
    assert is_partial_ukeire_max_answer(question, ["6s"]) is True
    assert is_partial_ukeire_max_answer(question, ["9s"]) is True
    assert is_partial_ukeire_max_answer(question, ["6s", "9s"]) is False
    assert is_partial_ukeire_max_answer(question, ["6s", "8s", "9s"]) is False


def test_generate_ukeire_max_question_returns_valid_no_honor_question():
    question = generate_ukeire_max_question(rng=random.Random(1))
    tiles = counts_to_tiles(question.counts)

    assert len(tiles) == 14
    assert all(tile[-1] in {"m", "p", "s"} for tile in tiles)
    assert max(question.counts) <= 4
    assert question.best_ukeire_types >= MIN_BEST_UKEIRE_TYPES
    assert min(result.after_discard_shanten for result in question.results) == 1
    assert all(result.after_discard_shanten == 1 for result in question.results if result.discard in question.best_discards)


def test_difficult_filter_accepts_best_second_diff_between_one_and_four():
    question = _synthetic_difficult_question([("5m", 28), ("4m", 26), ("6m", 25)])

    evaluation = evaluate_difficult_ukeire_question(question)

    assert evaluation.accepted is True
    assert evaluation.best_second_diff == 2
    assert evaluation.near_best_candidate_count == 3


def test_difficult_filter_rejects_honor_hands():
    counts = parse_hand("3334445556667m東").counts
    question = _synthetic_difficult_question([("5m", 28), ("4m", 26), ("6m", 25)], counts=counts)

    evaluation = evaluate_difficult_ukeire_question(question)

    assert evaluation.accepted is False
    assert "honors" in evaluation.reject_reasons


def test_difficult_filter_rejects_non_iishanten_discard_candidates():
    question = _synthetic_difficult_question([("5m", 28), ("4m", 26), ("6m", 25)], after_discard_shanten=0)

    evaluation = evaluate_difficult_ukeire_question(question)

    assert evaluation.accepted is False
    assert "not_iishanten_after_discard" in evaluation.reject_reasons


def test_difficult_filter_rejects_best_second_diff_five_or_more():
    question = _synthetic_difficult_question([("5m", 32), ("4m", 26), ("6m", 25)])

    evaluation = evaluate_difficult_ukeire_question(question)

    assert evaluation.accepted is False
    assert "best_second_diff" in evaluation.reject_reasons


def test_difficult_filter_rejects_tied_best_discards():
    question = _synthetic_difficult_question([("5m", 28), ("4m", 28), ("6m", 25)])

    evaluation = evaluate_difficult_ukeire_question(question)

    assert evaluation.accepted is False
    assert "tied_best" in evaluation.reject_reasons


def test_difficult_filter_rejects_when_near_best_candidates_are_too_few():
    question = _synthetic_difficult_question([("5m", 28), ("4m", 26), ("6m", 20)])

    evaluation = evaluate_difficult_ukeire_question(question)

    assert evaluation.accepted is False
    assert "not_enough_near_best_candidates" in evaluation.reject_reasons


def test_difficult_filter_rejects_obvious_isolated_best_discard():
    counts = parse_hand("14445556667777m").counts
    question = _synthetic_difficult_question([("1m", 28), ("4m", 26), ("5m", 25)], counts=counts)

    evaluation = evaluate_difficult_ukeire_question(question)

    assert is_obvious_isolated_tile("1m", counts) is True
    assert evaluation.accepted is False
    assert "obvious_isolated_best_discard" in evaluation.reject_reasons


def test_difficult_filter_prefers_middle_tile_heavy_hands():
    middle_heavy = parse_hand("33344455566677m").counts
    terminal_heavy = parse_hand("11122288899955m").counts

    assert middle_tile_ratio(middle_heavy) >= 0.6
    assert middle_tile_ratio(middle_heavy) > middle_tile_ratio(terminal_heavy)


def test_score_complex_shape_rewards_pairs_triplets_and_connected_shapes():
    complex_counts = parse_hand("3334455667788m").counts
    simple_counts = parse_hand("113579m2468p19s").counts

    assert score_complex_shape(complex_counts) > score_complex_shape(simple_counts)


def test_difficult_debug_info_contains_ranking_and_filter_details():
    question = _synthetic_difficult_question([("5m", 28), ("4m", 26), ("6m", 25)])

    debug_info = difficult_ukeire_debug_info(question)

    assert debug_info["accepted"] is True
    assert debug_info["best_second_diff"] == 2
    assert debug_info["near_best_candidate_count"] == 3
    assert debug_info["ranking"] == [
        {"discard": "5m", "ukeire_types": 6, "ukeire_tiles": 28, "after_discard_shanten": 1},
        {"discard": "4m", "ukeire_types": 6, "ukeire_tiles": 26, "after_discard_shanten": 1},
        {"discard": "6m", "ukeire_types": 6, "ukeire_tiles": 25, "after_discard_shanten": 1},
    ]


def test_generated_ukeire_max_question_prefers_difficult_filter_when_possible():
    question = generate_ukeire_max_question(rng=random.Random(3), max_attempts=20000)

    assert filter_difficult_ukeire_question(question) is True


def _synthetic_difficult_question(
    discards: list[tuple[str, int]],
    *,
    counts: tuple[int, ...] | None = None,
    after_discard_shanten: int = 1,
) -> UkeireMaxQuestion:
    hand_counts = counts or parse_hand("33344455566677m").counts
    results = tuple(_discard_result(discard, tiles, after_discard_shanten) for discard, tiles in discards)
    best_tiles = max(result.ukeire_tiles for result in results)
    return UkeireMaxQuestion(
        counts=hand_counts,
        results=results,
        best_discards=tuple(result.discard for result in results if result.ukeire_tiles == best_tiles),
    )


def _discard_result(discard: str, ukeire_tiles: int, after_discard_shanten: int) -> DiscardAnalysis:
    return DiscardAnalysis(
        discard=discard,
        after_discard_shanten=after_discard_shanten,
        is_iishanten=after_discard_shanten == 1,
        ukeire_types=6,
        ukeire_tiles=ukeire_tiles,
        ukeire=(),
        good_shape_types=0,
        good_shape_tiles=0,
        good_shape_rate=0.0,
        super_good_shape_types=0,
        super_good_shape_tiles=0,
        super_good_shape_rate=0.0,
        tenpai_details=(),
    )
