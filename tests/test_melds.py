import pytest

from mahjong.melds import Meld, meld_tile_counts, validate_meld
from mahjong.tiles import tile_index


def test_validate_chi_accepts_consecutive_number_tiles():
    validate_meld(Meld("chi", ("3m", "4m", "5m")))


def test_validate_chi_rejects_honors_and_gaps():
    with pytest.raises(ValueError):
        validate_meld(Meld("chi", ("\u6771", "\u5357", "\u897f")))
    with pytest.raises(ValueError):
        validate_meld(Meld("chi", ("3m", "5m", "6m")))


def test_validate_pon_and_kan_require_identical_tiles():
    validate_meld(Meld("pon", ("7p", "7p", "7p")))
    validate_meld(Meld("closed_kan", ("1s", "1s", "1s", "1s")))

    with pytest.raises(ValueError):
        validate_meld(Meld("pon", ("7p", "7p", "8p")))


def test_meld_tile_counts_counts_kan_as_four_tiles():
    counts = meld_tile_counts(
        (
            Meld("chi", ("3m", "4m", "5m")),
            Meld("open_kan", ("\u767d", "\u767d", "\u767d", "\u767d")),
        )
    )

    assert counts[tile_index("3m")] == 1
    assert counts[tile_index("\u767d")] == 4
