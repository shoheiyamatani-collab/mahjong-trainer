from mahjong.analyzer import analyze_discards, best_discards, best_discards_for_review
from mahjong.tiles import parse_hand


def test_analyze_discards_prioritizes_ukeire_types_then_tiles():
    counts = parse_hand("123m456m789p11s\u6771\u5357\u4e2d").counts

    results = analyze_discards(counts)
    best = {result.discard for result in best_discards(results)}
    discard_to_result = {result.discard: result for result in results}

    assert best == {"\u6771", "\u5357", "\u4e2d"}
    assert discard_to_result["\u4e2d"].is_iishanten
    assert discard_to_result["\u4e2d"].progress_shanten == 0
    assert discard_to_result["\u4e2d"].ukeire_types == 3
    assert discard_to_result["\u4e2d"].ukeire_tiles == 8
    assert discard_to_result["1s"].is_iishanten is False


def test_review_best_discards_prioritizes_ukeire_tiles_then_good_shape_tiles():
    counts = parse_hand("112345m456p789s\u6771\u5357").counts

    results = analyze_discards(counts)
    best = {result.discard for result in best_discards_for_review(results)}

    assert best == {"\u6771", "\u5357"}


def test_analyze_discards_counts_progress_tiles_from_sanshanten():
    counts = parse_hand("135m246p357s19m19p1s").counts

    results = analyze_discards(counts)
    best = {result.discard for result in best_discards_for_review(results)}
    discard_to_result = {result.discard: result for result in results}

    assert best == {"9m", "9p"}
    assert discard_to_result["9m"].after_discard_shanten == 3
    assert discard_to_result["9m"].progress_shanten == 2
    assert discard_to_result["9m"].ukeire_types == 6
    assert discard_to_result["9m"].ukeire_tiles == 24


def test_analyze_discards_counts_progress_tiles_from_ryanshanten():
    counts = parse_hand("135m246p357s11m22p1s").counts

    results = analyze_discards(counts)
    best = {result.discard for result in best_discards_for_review(results)}
    discard_to_result = {result.discard: result for result in results}

    assert best == {"5m", "6p", "1s", "7s"}
    assert discard_to_result["5m"].after_discard_shanten == 2
    assert discard_to_result["5m"].progress_shanten == 1
    assert discard_to_result["5m"].ukeire_types == 13
    assert discard_to_result["5m"].ukeire_tiles == 45
