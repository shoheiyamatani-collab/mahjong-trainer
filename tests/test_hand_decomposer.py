import pytest

from mahjong.hand_decomposer import decompose_standard_hand, decompose_standard_hand_with_melds
from mahjong.melds import Meld
from mahjong.tiles import parse_hand


def test_decompose_standard_hand_sequences_and_pair():
    counts = parse_hand("123m456m123p456p\u6771\u6771").counts

    decompositions = decompose_standard_hand(counts)

    assert len(decompositions) == 1
    assert decompositions[0].pair.tiles == ("\u6771", "\u6771")
    assert [group.kind for group in decompositions[0].melds] == [
        "sequence",
        "sequence",
        "sequence",
        "sequence",
    ]


def test_decompose_standard_hand_triplets():
    counts = parse_hand("111m222p333s\u6771\u6771\u6771\u767d\u767d").counts

    decompositions = decompose_standard_hand(counts)

    assert len(decompositions) == 1
    assert decompositions[0].pair.tiles == ("\u767d", "\u767d")
    assert all(group.kind == "triplet" for group in decompositions[0].melds)


def test_decompose_standard_hand_lists_multiple_candidates():
    counts = parse_hand("111222333m444p55s").counts

    decompositions = decompose_standard_hand(counts)
    meld_shapes = {
        tuple(group.kind for group in decomposition.melds)
        for decomposition in decompositions
    }

    assert len(decompositions) == 2
    assert {decomposition.pair.tiles for decomposition in decompositions} == {("5s", "5s")}
    assert ("triplet", "triplet", "triplet", "triplet") in meld_shapes
    assert ("sequence", "sequence", "sequence", "triplet") in meld_shapes


def test_decompose_standard_hand_returns_empty_for_chiitoitsu():
    counts = parse_hand("11m22m33p44p55s66s\u6771\u6771").counts

    assert decompose_standard_hand(counts) == []


def test_decompose_standard_hand_requires_14_tiles():
    counts = parse_hand("123m456m123p456p\u6771").counts

    with pytest.raises(ValueError):
        decompose_standard_hand(counts)


def test_decompose_standard_hand_with_open_chi():
    counts = parse_hand("456m123p456p\u6771\u6771").counts
    melds = (Meld("chi", ("1m", "2m", "3m")),)

    decompositions = decompose_standard_hand_with_melds(counts, melds)

    assert len(decompositions) == 1
    assert decompositions[0].open_melds == melds
    assert len(decompositions[0].melds) == 3
    assert decompositions[0].pair.tiles == ("\u6771", "\u6771")


def test_decompose_standard_hand_with_open_pon_and_closed_kan():
    counts = parse_hand("123m456p\u6771\u6771").counts
    melds = (
        Meld("pon", ("5s", "5s", "5s")),
        Meld("closed_kan", ("\u767d", "\u767d", "\u767d", "\u767d")),
    )

    decompositions = decompose_standard_hand_with_melds(counts, melds)

    assert len(decompositions) == 1
    assert decompositions[0].open_melds == melds
    assert [group.tiles for group in decompositions[0].melds] == [
        ("1m", "2m", "3m"),
        ("4p", "5p", "6p"),
    ]


def test_decompose_standard_hand_with_four_open_melds_needs_pair_only():
    counts = parse_hand("\u4e2d\u4e2d").counts
    melds = (
        Meld("chi", ("1m", "2m", "3m")),
        Meld("chi", ("4m", "5m", "6m")),
        Meld("pon", ("7p", "7p", "7p")),
        Meld("open_kan", ("9s", "9s", "9s", "9s")),
    )

    decompositions = decompose_standard_hand_with_melds(counts, melds)

    assert len(decompositions) == 1
    assert decompositions[0].melds == ()
    assert decompositions[0].pair.tiles == ("\u4e2d", "\u4e2d")


def test_decompose_standard_hand_rejects_too_many_melds():
    counts = parse_hand("\u4e2d\u4e2d").counts
    melds = tuple(Meld("pon", ("1m", "1m", "1m")) for _ in range(5))

    with pytest.raises(ValueError):
        decompose_standard_hand_with_melds(counts, melds)
