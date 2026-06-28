import pytest

from mahjong.melds import Meld
from mahjong.score_calculator import HandScoreInput, calculate_hand_score
from mahjong.tiles import parse_hand
from mahjong.yaku import EAST, SOUTH


def _input(
    hand: str,
    *,
    open_melds=(),
    winning_tile: str,
    is_dealer: bool = False,
    win_method: str = "ron",
    round_wind: str = EAST,
    seat_wind: str = SOUTH,
    situational_yaku=(),
    dora: int = 0,
) -> HandScoreInput:
    return HandScoreInput(
        counts=parse_hand(hand).counts,
        open_melds=tuple(open_melds),
        winning_tile=winning_tile,
        is_dealer=is_dealer,
        win_method=win_method,
        round_wind=round_wind,
        seat_wind=seat_wind,
        situational_yaku=tuple(situational_yaku),
        dora=dora,
    )


def test_scores_closed_pinfu_riichi_ron():
    result = calculate_hand_score(
        _input(
            "123m456m234p456p22s",
            winning_tile="4p",
            situational_yaku=("riichi",),
        )
    )

    names = [yaku.name for yaku in result.yaku]

    assert "\u5e73\u548c" in names
    assert result.score.han == 2
    assert result.score.fu == 30
    assert result.score.total_points == 2000


def test_scores_menzen_tsumo_pinfu_as_20_fu_three_han_with_riichi():
    result = calculate_hand_score(
        _input(
            "123m456m234p456p22s",
            winning_tile="4p",
            win_method="tsumo",
            situational_yaku=("riichi",),
        )
    )

    names = [yaku.name for yaku in result.yaku]

    assert "\u5e73\u548c" in names
    assert "\u9580\u524d\u6e05\u81ea\u6478\u548c" in names
    assert result.score.han == 3
    assert result.score.fu == 20
    assert [payment.points for payment in result.score.payments] == [700, 1300]


def test_does_not_add_menzen_tsumo_to_open_tsumo():
    result = calculate_hand_score(
        _input(
            "234m345p66s",
            open_melds=(
                Meld("chi", ("2s", "3s", "4s")),
                Meld("chi", ("5s", "6s", "7s")),
            ),
            winning_tile="6s",
            win_method="tsumo",
        )
    )

    names = [yaku.name for yaku in result.yaku]

    assert "\u65ad\u4e48\u4e5d" in names
    assert "\u9580\u524d\u6e05\u81ea\u6478\u548c" not in names


def test_scores_open_yakuhai_with_dora():
    result = calculate_hand_score(
        _input(
            "123m456p\u767d\u767d",
            open_melds=(
                Meld("pon", ("\u767c", "\u767c", "\u767c")),
                Meld("chi", ("2s", "3s", "4s")),
            ),
            winning_tile="\u767d",
            dora=1,
        )
    )

    assert result.score.han == 2
    assert result.score.fu == 30
    assert result.score.total_points == 2000


def test_scores_open_toitoi_yakuhai():
    result = calculate_hand_score(
        _input(
            "111m\u4e2d\u4e2d",
            open_melds=(
                Meld("pon", ("2p", "2p", "2p")),
                Meld("pon", ("\u767d", "\u767d", "\u767d")),
                Meld("pon", ("\u767c", "\u767c", "\u767c")),
            ),
            winning_tile="\u4e2d",
        )
    )

    names = [yaku.name for yaku in result.yaku]

    assert "\u5bfe\u3005\u548c" in names
    assert names.count("\u5f79\u724c") == 2
    assert result.score.han == 4


def test_chooses_highest_scoring_decomposition():
    result = calculate_hand_score(
        _input(
            "111222333m444p55s",
            winning_tile="5s",
            situational_yaku=("riichi",),
        )
    )

    names = [yaku.name for yaku in result.yaku]

    assert "\u5bfe\u3005\u548c" in names
    assert result.score.han >= 3


def test_rejects_no_yaku_hand():
    with pytest.raises(ValueError):
        calculate_hand_score(_input("123m456m123p999s22s", winning_tile="9s"))


def test_scores_chiitoitsu_with_dora():
    result = calculate_hand_score(
        _input(
            "1122m3344p5566s\u6771\u6771",
            winning_tile="\u6771",
            dora=1,
        )
    )

    names = [yaku.name for yaku in result.yaku]

    assert "\u4e03\u5bfe\u5b50" in names
    assert "\u30c9\u30e9" in names
    assert result.score.han == 3
    assert result.score.fu == 25
    assert result.score.total_points == 3200


def test_scores_ryanpeikou_over_chiitoitsu_for_mixed_suit_pairs():
    result = calculate_hand_score(
        _input(
            "112233m445566p77s",
            winning_tile="7s",
            dora=1,
        )
    )

    names = [yaku.name for yaku in result.yaku]

    assert "\u4e8c\u76c3\u53e3" in names
    assert "\u4e03\u5bfe\u5b50" not in names
    assert "\u30c9\u30e9" in names
    assert result.score.han == 4


def test_scores_chiitoitsu_chinitsu_when_no_standard_shape_exists():
    result = calculate_hand_score(
        _input(
            "11223344557788m",
            winning_tile="8m",
        )
    )

    names = [yaku.name for yaku in result.yaku]

    assert "\u4e03\u5bfe\u5b50" in names
    assert "\u6e05\u4e00\u8272" in names
    assert result.score.han == 8


def test_scores_ryanpeikou_over_chiitoitsu_when_both_shapes_exist():
    result = calculate_hand_score(
        _input(
            "11223344556677m",
            winning_tile="7m",
        )
    )

    names = [yaku.name for yaku in result.yaku]

    assert "\u4e8c\u76c3\u53e3" in names
    assert "\u6e05\u4e00\u8272" in names
    assert "\u4e03\u5bfe\u5b50" not in names
    assert "\u4e00\u76c3\u53e3" not in names
    assert result.score.han == 10


def test_scores_closed_chinitsu_in_score_calculator():
    result = calculate_hand_score(
        _input(
            "11122233345699m",
            winning_tile="6m",
        )
    )

    names = [yaku.name for yaku in result.yaku]

    assert "\u6e05\u4e00\u8272" in names
    assert result.score.han >= 6


def test_scores_pinfu_iipeikou_sanshoku_high_value_decomposition():
    result = calculate_hand_score(
        _input(
            "112233m123p123s55p",
            winning_tile="1s",
        )
    )

    names = [yaku.name for yaku in result.yaku]

    assert "\u5e73\u548c" in names
    assert "\u4e00\u76c3\u53e3" in names
    assert "\u4e09\u8272\u540c\u9806" in names
    assert result.score.han == 4


def test_scores_sanankou_for_tsumo_triplets():
    result = calculate_hand_score(
        _input(
            "111222333m456p55s",
            winning_tile="3m",
            win_method="tsumo",
        )
    )

    names = [yaku.name for yaku in result.yaku]

    assert "\u4e09\u6697\u523b" in names


def test_ron_on_triplet_does_not_count_that_triplet_for_sanankou():
    result = calculate_hand_score(
        _input(
            "111222333m456p55s",
            winning_tile="3m",
            win_method="ron",
        )
    )

    names = [yaku.name for yaku in result.yaku]

    assert "\u4e09\u6697\u523b" not in names


def test_scores_kokushi_as_single_yakuman():
    result = calculate_hand_score(
        _input(
            "19m19p19s\u6771\u5357\u897f\u5317\u767d\u767c\u4e2d\u4e2d",
            winning_tile="\u4e2d",
        )
    )

    assert result.yaku[0].name == "\u56fd\u58eb\u7121\u53cc"
    assert result.yaku[0].is_yakuman
    assert result.score.limit_name == "yakuman"
    assert result.score.total_points == 32000


def test_special_hands_cannot_use_open_melds():
    with pytest.raises(ValueError):
        calculate_hand_score(
            _input(
                "112233m445566p77s",
                open_melds=(Meld("pon", ("1s", "1s", "1s")),),
                winning_tile="7s",
            )
        )


def test_rejects_more_than_four_visible_tiles_across_hand_and_melds():
    with pytest.raises(ValueError):
        calculate_hand_score(
            _input(
                "111m123p456p\u767d\u767d",
                open_melds=(Meld("pon", ("1m", "1m", "1m")),),
                winning_tile="\u767d",
            )
        )
