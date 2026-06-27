import pytest

from mahjong.tiles import parse_hand, tile_index


def test_parse_compact_and_honor_aliases():
    parsed = parse_hand("123m456p789s\u6771\u5357\u897f\u5317\u767d\u767a\u4e2d")

    assert sum(parsed.counts) == 16
    assert parsed.counts[tile_index("1m")] == 1
    assert parsed.counts[tile_index("\u767c")] == 1


def test_parse_rejects_more_than_four_tiles():
    with pytest.raises(ValueError):
        parse_hand("11111m")
