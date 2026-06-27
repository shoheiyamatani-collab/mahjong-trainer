from mahjong.shanten import normal_shanten
from mahjong.tiles import parse_hand


def test_normal_shanten_complete_hand():
    counts = parse_hand("123m123p123s789s\u6771\u6771").counts

    assert normal_shanten(counts) == -1


def test_normal_shanten_tenpai_hand():
    counts = parse_hand("123m123p123s789s\u6771").counts

    assert normal_shanten(counts) == 0


def test_normal_shanten_iishanten_hand():
    counts = parse_hand("123m456m789p11s\u6771\u5357").counts

    assert normal_shanten(counts) == 1
