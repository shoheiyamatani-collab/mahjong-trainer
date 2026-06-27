from mahjong.hand_decomposer import decompose_standard_hand, decompose_standard_hand_with_melds
from mahjong.melds import Meld
from mahjong.tiles import parse_hand
from mahjong.yaku import EAST, SOUTH, YakuContext, detect_standard_yaku


def _yaku_names(results):
    return [result.name for result in results]


def test_detects_yakuhai_for_dragon_round_and_seat_wind():
    counts = parse_hand("123m456p\u767d\u767d").counts
    melds = (
        Meld("pon", ("\u767c", "\u767c", "\u767c")),
        Meld("pon", (EAST, EAST, EAST)),
    )
    decomposition = decompose_standard_hand_with_melds(counts, melds)[0]

    results = detect_standard_yaku(decomposition, YakuContext(round_wind=EAST, seat_wind=EAST))

    assert _yaku_names(results).count("\u5f79\u724c") == 3


def test_detects_open_tanyao():
    counts = parse_hand("234m345p66s").counts
    melds = (
        Meld("chi", ("2s", "3s", "4s")),
        Meld("chi", ("5s", "6s", "7s")),
    )
    decomposition = decompose_standard_hand_with_melds(counts, melds)[0]

    results = detect_standard_yaku(decomposition, YakuContext(round_wind=EAST, seat_wind=SOUTH))

    assert "\u65ad\u4e48\u4e5d" in _yaku_names(results)


def test_detects_closed_pinfu_with_two_sided_wait():
    decomposition = decompose_standard_hand(parse_hand("123m456m234p456p22s").counts)[0]

    results = detect_standard_yaku(
        decomposition,
        YakuContext(round_wind=EAST, seat_wind=SOUTH, winning_tile="4p"),
    )

    assert "\u5e73\u548c" in _yaku_names(results)


def test_does_not_detect_pinfu_with_closed_wait():
    decomposition = decompose_standard_hand(parse_hand("123m456m234p456p22s").counts)[0]

    results = detect_standard_yaku(
        decomposition,
        YakuContext(round_wind=EAST, seat_wind=SOUTH, winning_tile="5p"),
    )

    assert "\u5e73\u548c" not in _yaku_names(results)


def test_detects_toitoi_with_open_pon_and_kan():
    counts = parse_hand("111m\u4e2d\u4e2d").counts
    melds = (
        Meld("pon", ("2p", "2p", "2p")),
        Meld("open_kan", ("3s", "3s", "3s", "3s")),
        Meld("pon", ("\u767d", "\u767d", "\u767d")),
    )
    decomposition = decompose_standard_hand_with_melds(counts, melds)[0]

    results = detect_standard_yaku(decomposition, YakuContext(round_wind=EAST, seat_wind=SOUTH))

    assert "\u5bfe\u3005\u548c" in _yaku_names(results)


def test_detects_closed_and_open_honitsu_han():
    closed = decompose_standard_hand(parse_hand("123m456m789m\u6771\u6771\u6771\u767d\u767d").counts)[0]
    open_hand = decompose_standard_hand_with_melds(
        parse_hand("123m456m\u6771\u6771").counts,
        (
            Meld("chi", ("7m", "8m", "9m")),
            Meld("pon", ("\u767d", "\u767d", "\u767d")),
        ),
    )[0]

    closed_result = detect_standard_yaku(closed, YakuContext(round_wind=EAST, seat_wind=SOUTH))
    open_result = detect_standard_yaku(open_hand, YakuContext(round_wind=EAST, seat_wind=SOUTH))

    assert next(result.han for result in closed_result if result.name == "\u6df7\u4e00\u8272") == 3
    assert next(result.han for result in open_result if result.name == "\u6df7\u4e00\u8272") == 2


def test_detects_closed_and_open_chinitsu_han():
    closed = decompose_standard_hand(parse_hand("111222333456m99m").counts)[0]
    open_hand = decompose_standard_hand_with_melds(
        parse_hand("111222m99m").counts,
        (
            Meld("chi", ("3m", "4m", "5m")),
            Meld("chi", ("6m", "7m", "8m")),
        ),
    )[0]

    closed_result = detect_standard_yaku(closed, YakuContext(round_wind=EAST, seat_wind=SOUTH))
    open_result = detect_standard_yaku(open_hand, YakuContext(round_wind=EAST, seat_wind=SOUTH))

    assert next(result.han for result in closed_result if result.name == "\u6e05\u4e00\u8272") == 6
    assert next(result.han for result in open_result if result.name == "\u6e05\u4e00\u8272") == 5
