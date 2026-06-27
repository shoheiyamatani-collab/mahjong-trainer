import random
from collections import Counter

import pytest

from mahjong.chinitsu.evaluator import evaluate_wait_answer
from mahjong.chinitsu.generator import (
    analyze_generated_question,
    classify_wait_difficulty,
    generate_chinitsu_hand,
    generate_wait_question,
    hand_key,
    remaining_tiles_for_waits,
    site_sample_wait_question,
)
from mahjong.chinitsu.parser import chinitsu_tiles, parse_chinitsu_hand, to_34_counts
from mahjong.chinitsu.question_bank import get_wait_question, iter_wait_questions, question_count
from mahjong.chinitsu.waits import find_waits_13, is_chinitsu_chiitoitsu
from mahjong.tiles import tile_index


def test_parse_chinitsu_hand_counts_ranks():
    hand = parse_chinitsu_hand("1112345678999", expected_total=13)

    assert hand.counts == (3, 1, 1, 1, 1, 1, 1, 1, 3)
    assert chinitsu_tiles(hand) == (1, 1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 9, 9)


def test_parse_chinitsu_rejects_non_rank_input():
    with pytest.raises(ValueError):
        parse_chinitsu_hand("123m")
    with pytest.raises(ValueError):
        parse_chinitsu_hand("1203")


def test_parse_chinitsu_rejects_more_than_four_same_rank():
    with pytest.raises(ValueError):
        parse_chinitsu_hand("11111")


def test_parse_chinitsu_rejects_wrong_total_when_expected():
    with pytest.raises(ValueError):
        parse_chinitsu_hand("123456789", expected_total=13)


def test_to_34_counts_maps_to_selected_suit():
    hand = parse_chinitsu_hand("123", expected_total=3)

    counts = to_34_counts(hand, suit="p")

    assert counts[tile_index("1p")] == 1
    assert counts[tile_index("2p")] == 1
    assert counts[tile_index("3p")] == 1


def test_find_waits_13_returns_winning_waits():
    hand = parse_chinitsu_hand("1112345678889", expected_total=13)

    assert find_waits_13(hand) == (1, 4, 7, 8, 9)


def test_find_waits_13_includes_chiitoitsu_wait():
    hand = parse_chinitsu_hand("1122334455668", expected_total=13)

    waits = find_waits_13(hand)
    won = parse_chinitsu_hand("11223344556688", expected_total=14)

    assert waits == (8,)
    assert is_chinitsu_chiitoitsu(won)


def test_find_waits_13_excludes_ranks_already_used_four_times():
    hand = parse_chinitsu_hand("1111222233334", expected_total=13)

    waits = find_waits_13(hand)

    assert waits == (4, 5)
    assert 1 not in waits
    assert 2 not in waits
    assert 3 not in waits


def test_evaluate_wait_answer_requires_exact_wait_set():
    assert evaluate_wait_answer((1, 4, 7), (7, 1, 4))
    assert not evaluate_wait_answer((1, 4, 7), (1, 4))
    assert not evaluate_wait_answer((1, 4, 7), (1, 4, 7, 9))


def test_site_sample_wait_question_matches_solved_problem():
    question = site_sample_wait_question()

    assert sum(question.hand.counts) == 13
    assert question.waits
    assert question.waits == find_waits_13(question.hand)


def test_chinitsu_question_bank_has_many_valid_questions():
    assert question_count() == 450

    for question in iter_wait_questions():
        assert sum(question.hand.counts) == 13
        assert question.waits
        assert question.waits == find_waits_13(question.hand)
        assert question.suit in {"m", "p", "s"}


def test_chinitsu_question_bank_balances_suits():
    counts = Counter(question.suit for question in iter_wait_questions())

    assert counts == Counter({"m": 150, "p": 150, "s": 150})


def test_chinitsu_question_bank_avoids_duplicate_shapes():
    keys = [hand_key(question.hand) for question in iter_wait_questions()]

    assert len(keys) == len(set(keys))


def test_chinitsu_question_bank_wraps_index():
    first = get_wait_question(0)
    wrapped = get_wait_question(question_count())

    assert wrapped == first


def test_generated_analysis_rejects_non_13_tiles():
    hand = parse_chinitsu_hand("123456789", expected_total=9)

    with pytest.raises(ValueError):
        analyze_generated_question(hand)


def test_generated_analysis_rejects_five_or_more_same_rank():
    with pytest.raises(ValueError):
        parse_chinitsu_hand("1111123456789")


def test_generated_analysis_returns_wait_metadata():
    hand = parse_chinitsu_hand("1112345567899", expected_total=13)

    question = analyze_generated_question(hand)

    assert chinitsu_tiles(question.hand) == (1, 1, 1, 2, 3, 4, 5, 5, 6, 7, 8, 9, 9)
    assert question.waits == (5, 9)
    assert question.wait_count == 2
    assert question.remaining_tiles == {5: 2, 9: 2}
    assert question.difficulty == "easy"


def test_remaining_tiles_rejects_wait_with_no_tiles_left():
    hand = parse_chinitsu_hand("1111222233334", expected_total=13)

    with pytest.raises(ValueError):
        remaining_tiles_for_waits(hand, (1,))


def test_classify_wait_difficulty_uses_simple_thresholds():
    assert classify_wait_difficulty(1) == "easy"
    assert classify_wait_difficulty(2) == "easy"
    assert classify_wait_difficulty(3) == "normal"
    assert classify_wait_difficulty(4) == "normal"
    assert classify_wait_difficulty(5) == "hard"
    with pytest.raises(ValueError):
        classify_wait_difficulty(0)


def test_generate_chinitsu_hand_returns_valid_13_tile_shape():
    hand = generate_chinitsu_hand(random.Random(1))

    assert sum(hand.counts) == 13
    assert all(0 <= count <= 4 for count in hand.counts)


def test_generate_wait_question_returns_valid_waiting_question():
    question = generate_wait_question(random.Random(5))

    assert sum(question.hand.counts) == 13
    assert all(0 <= count <= 4 for count in question.hand.counts)
    assert question.waits
    assert question.waits == find_waits_13(question.hand)
    assert question.remaining_tiles == remaining_tiles_for_waits(question.hand, question.waits)


def test_generate_wait_question_can_avoid_recent_hand():
    rng = random.Random(10)
    first = generate_wait_question(rng)
    second = generate_wait_question(rng, recent_hands=(hand_key(first.hand),))

    assert hand_key(second.hand) != hand_key(first.hand)
