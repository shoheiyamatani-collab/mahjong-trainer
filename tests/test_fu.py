from mahjong.fu import FuContext, calculate_standard_fu, chiitoitsu_fu
from mahjong.hand_decomposer import decompose_standard_hand, decompose_standard_hand_with_melds
from mahjong.melds import Meld
from mahjong.tiles import parse_hand
from mahjong.yaku import EAST, SOUTH


def _first_decomposition(hand: str):
    return decompose_standard_hand(parse_hand(hand).counts)[0]


def test_pinfu_tsumo_is_20_fu():
    decomposition = _first_decomposition("123m456m234p456p22s")

    result = calculate_standard_fu(
        decomposition,
        FuContext(win_method="tsumo", winning_tile="4p", round_wind=EAST, seat_wind=SOUTH),
    )

    assert result.rounded_fu == 20


def test_closed_pinfu_ron_is_30_fu():
    decomposition = _first_decomposition("123m456m234p456p22s")

    result = calculate_standard_fu(
        decomposition,
        FuContext(win_method="ron", winning_tile="4p", round_wind=EAST, seat_wind=SOUTH),
    )

    assert result.rounded_fu == 30


def test_yakuhai_pair_rounds_to_40_fu_on_closed_ron():
    decomposition = _first_decomposition("123m456m123p456p\u6771\u6771")

    result = calculate_standard_fu(
        decomposition,
        FuContext(win_method="ron", winning_tile="\u6771", round_wind=EAST, seat_wind=SOUTH),
    )

    assert result.total_before_rounding == 34
    assert result.rounded_fu == 40


def test_tanki_kanchan_and_penchan_waits_add_2_fu():
    tanki = calculate_standard_fu(
        _first_decomposition("123m456m123p456p22s"),
        FuContext(win_method="ron", winning_tile="2s", round_wind=EAST, seat_wind=SOUTH),
    )
    kanchan = calculate_standard_fu(
        _first_decomposition("234m456m123p456p22s"),
        FuContext(win_method="ron", winning_tile="3m", round_wind=EAST, seat_wind=SOUTH),
    )
    penchan = calculate_standard_fu(
        _first_decomposition("123m456m123p456p22s"),
        FuContext(win_method="ron", winning_tile="3m", round_wind=EAST, seat_wind=SOUTH),
    )

    assert tanki.rounded_fu == 40
    assert kanchan.rounded_fu == 40
    assert penchan.rounded_fu == 40


def test_triplet_fu_open_closed_and_ron_completed_triplet():
    closed_tsumo = calculate_standard_fu(
        _first_decomposition("111m234m456p789s22p"),
        FuContext(win_method="tsumo", winning_tile="1m", round_wind=EAST, seat_wind=SOUTH),
    )
    ron_completed = calculate_standard_fu(
        _first_decomposition("111m234m456p789s22p"),
        FuContext(win_method="ron", winning_tile="1m", round_wind=EAST, seat_wind=SOUTH),
    )

    assert any(item.label == "\u6697\u523b" and item.fu == 8 for item in closed_tsumo.items)
    assert any(item.label == "\u660e\u523b" and item.fu == 4 for item in ron_completed.items)


def test_open_pon_and_kan_fu():
    decomposition = decompose_standard_hand_with_melds(
        parse_hand("123m456p\u767d\u767d").counts,
        (
            Meld("pon", ("2s", "2s", "2s")),
            Meld("open_kan", ("\u6771", "\u6771", "\u6771", "\u6771")),
        ),
    )[0]

    result = calculate_standard_fu(
        decomposition,
        FuContext(win_method="ron", winning_tile="\u767d", round_wind=EAST, seat_wind=SOUTH),
    )

    assert any(item.label == "\u660e\u523b" and item.fu == 2 for item in result.items)
    assert any(item.label == "\u660e\u69d3" and item.fu == 16 for item in result.items)


def test_closed_kan_fu():
    decomposition = decompose_standard_hand_with_melds(
        parse_hand("123m456p\u767d\u767d").counts,
        (
            Meld("closed_kan", ("2s", "2s", "2s", "2s")),
            Meld("closed_kan", ("\u6771", "\u6771", "\u6771", "\u6771")),
        ),
    )[0]

    result = calculate_standard_fu(
        decomposition,
        FuContext(win_method="tsumo", winning_tile="\u767d", round_wind=EAST, seat_wind=SOUTH),
    )

    assert any(item.label == "\u6697\u69d3" and item.fu == 16 for item in result.items)
    assert any(item.label == "\u6697\u69d3" and item.fu == 32 for item in result.items)


def test_chiitoitsu_is_25_fu():
    result = chiitoitsu_fu()

    assert result.rounded_fu == 25
