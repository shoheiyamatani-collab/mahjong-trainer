from mahjong.analyzer import analyze_discards
from mahjong.tiles import parse_hand


def test_tenpai_quality_counts_good_and_super_good_waits_by_physical_tiles():
    counts = parse_hand("112345m456p789s\u6771\u5357").counts
    result = {item.discard: item for item in analyze_discards(counts)}["\u6771"]

    assert result.ukeire_tiles == 25
    assert result.good_shape_tiles == 15
    assert result.good_shape_rate == 15 / 25
    assert result.super_good_shape_tiles == 6
    assert result.super_good_shape_rate == 6 / 25


def test_tenpai_detail_uses_best_tenpai_discard_after_ukeire_draw():
    counts = parse_hand("112345m456p789s\u6771\u5357").counts
    result = {item.discard: item for item in analyze_discards(counts)}["\u6771"]
    details = {detail.draw: detail for detail in result.tenpai_details}

    assert details["1m"].winning_tiles == 13
    assert details["6m"].winning_tiles == 9
    assert details["6m"].is_super_good_shape
    assert details["3m"].winning_tiles == 5
    assert details["3m"].is_good_shape
