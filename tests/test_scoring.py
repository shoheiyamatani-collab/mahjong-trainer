import pytest

from mahjong.scoring import ScoreInput, calculate_score


def test_child_ron_1_han_30_fu():
    result = calculate_score(ScoreInput(han=1, fu=30, is_dealer=False, win_method="ron"))

    assert result.limit_name == "normal"
    assert result.total_points == 1000
    assert result.payments[0].points == 1000


def test_child_ron_3_han_40_fu():
    result = calculate_score(ScoreInput(han=3, fu=40, is_dealer=False, win_method="ron"))

    assert result.total_points == 5200


def test_dealer_ron_3_han_40_fu():
    result = calculate_score(ScoreInput(han=3, fu=40, is_dealer=True, win_method="ron"))

    assert result.total_points == 7700


def test_child_tsumo_2_han_30_fu():
    result = calculate_score(ScoreInput(han=2, fu=30, is_dealer=False, win_method="tsumo"))

    assert [(payment.label, payment.points) for payment in result.payments] == [
        ("\u5b50", 500),
        ("\u89aa", 1000),
    ]
    assert result.total_points == 2000


def test_dealer_tsumo_2_han_30_fu():
    result = calculate_score(ScoreInput(han=2, fu=30, is_dealer=True, win_method="tsumo"))

    assert result.payments == (result.payments[0],)
    assert result.payments[0].label == "\u5b50\u5168\u54e1"
    assert result.payments[0].points == 1000
    assert result.total_points == 3000


@pytest.mark.parametrize(
    ("han", "fu", "limit_name", "total"),
    [
        (3, 60, "normal", 7700),
        (3, 70, "mangan", 8000),
        (4, 30, "normal", 7700),
        (4, 40, "mangan", 8000),
        (5, 30, "mangan", 8000),
        (6, 30, "haneman", 12000),
        (8, 30, "baiman", 16000),
        (11, 30, "sanbaiman", 24000),
        (13, 30, "yakuman", 32000),
    ],
)
def test_child_ron_limit_boundaries(han, fu, limit_name, total):
    result = calculate_score(ScoreInput(han=han, fu=fu, is_dealer=False, win_method="ron"))

    assert result.limit_name == limit_name
    assert result.total_points == total


def test_single_yakuman_payments():
    child_ron = calculate_score(ScoreInput(han=0, fu=None, is_dealer=False, win_method="ron", yakuman_count=1))
    dealer_ron = calculate_score(ScoreInput(han=0, fu=None, is_dealer=True, win_method="ron", yakuman_count=1))
    child_tsumo = calculate_score(ScoreInput(han=0, fu=None, is_dealer=False, win_method="tsumo", yakuman_count=1))
    dealer_tsumo = calculate_score(ScoreInput(han=0, fu=None, is_dealer=True, win_method="tsumo", yakuman_count=1))

    assert child_ron.total_points == 32000
    assert dealer_ron.total_points == 48000
    assert [payment.points for payment in child_tsumo.payments] == [8000, 16000]
    assert dealer_tsumo.payments[0].points == 16000


def test_honba_and_riichi_sticks_are_extensible_inputs():
    result = calculate_score(
        ScoreInput(han=1, fu=30, is_dealer=False, win_method="ron", honba=2, riichi_sticks=1)
    )

    assert result.payments[0].points == 1600
    assert result.total_points == 2600


def test_rejects_invalid_fu_for_non_yakuman():
    with pytest.raises(ValueError):
        calculate_score(ScoreInput(han=1, fu=22, is_dealer=False, win_method="ron"))
