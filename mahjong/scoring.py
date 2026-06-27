from __future__ import annotations

from dataclasses import dataclass
from typing import Literal


WinMethod = Literal["ron", "tsumo"]
LimitName = Literal[
    "normal",
    "mangan",
    "haneman",
    "baiman",
    "sanbaiman",
    "yakuman",
]


@dataclass(frozen=True)
class ScoreInput:
    han: int
    fu: int | None
    is_dealer: bool
    win_method: WinMethod
    yakuman_count: int = 0
    honba: int = 0
    riichi_sticks: int = 0


@dataclass(frozen=True)
class Payment:
    label: str
    points: int


@dataclass(frozen=True)
class ScoreResult:
    total_points: int
    payments: tuple[Payment, ...]
    limit_name: LimitName
    limit_label: str
    han: int
    fu: int | None
    base_points: int


LIMIT_LABELS: dict[LimitName, str] = {
    "normal": "\u901a\u5e38",
    "mangan": "\u6e80\u8cab",
    "haneman": "\u8df3\u6e80",
    "baiman": "\u500d\u6e80",
    "sanbaiman": "\u4e09\u500d\u6e80",
    "yakuman": "\u5f79\u6e80",
}


def calculate_score(score_input: ScoreInput) -> ScoreResult:
    _validate_score_input(score_input)

    if score_input.yakuman_count:
        limit_name: LimitName = "yakuman"
        base_points = 8000 * score_input.yakuman_count
    else:
        limit_name, base_points = _base_points(score_input.han, score_input.fu or 0)

    payments, total = _payments(
        base_points=base_points,
        is_dealer=score_input.is_dealer,
        win_method=score_input.win_method,
        honba=score_input.honba,
        riichi_sticks=score_input.riichi_sticks,
    )

    return ScoreResult(
        total_points=total,
        payments=payments,
        limit_name=limit_name,
        limit_label=LIMIT_LABELS[limit_name],
        han=score_input.han,
        fu=score_input.fu,
        base_points=base_points,
    )


def _base_points(han: int, fu: int) -> tuple[LimitName, int]:
    if han >= 13:
        return "yakuman", 8000
    if han >= 11:
        return "sanbaiman", 6000
    if han >= 8:
        return "baiman", 4000
    if han >= 6:
        return "haneman", 3000
    raw_base = fu * (2 ** (han + 2))
    if han >= 5 or raw_base >= 2000:
        return "mangan", 2000
    return "normal", raw_base


def _payments(
    *,
    base_points: int,
    is_dealer: bool,
    win_method: WinMethod,
    honba: int,
    riichi_sticks: int,
) -> tuple[tuple[Payment, ...], int]:
    riichi_bonus = riichi_sticks * 1000

    if win_method == "ron":
        multiplier = 6 if is_dealer else 4
        points = _ceil_100(base_points * multiplier) + (honba * 300)
        return (Payment("\u653e\u9283\u8005", points),), points + riichi_bonus

    if is_dealer:
        payment = _ceil_100(base_points * 2) + (honba * 100)
        return (Payment("\u5b50\u5168\u54e1", payment),), (payment * 3) + riichi_bonus

    child_payment = _ceil_100(base_points) + (honba * 100)
    dealer_payment = _ceil_100(base_points * 2) + (honba * 100)
    return (
        Payment("\u5b50", child_payment),
        Payment("\u89aa", dealer_payment),
    ), (child_payment * 2) + dealer_payment + riichi_bonus


def _ceil_100(value: int) -> int:
    return ((value + 99) // 100) * 100


def _validate_score_input(score_input: ScoreInput) -> None:
    if score_input.win_method not in {"ron", "tsumo"}:
        raise ValueError("win_method must be 'ron' or 'tsumo'.")
    if score_input.honba < 0:
        raise ValueError("honba cannot be negative.")
    if score_input.riichi_sticks < 0:
        raise ValueError("riichi_sticks cannot be negative.")
    if score_input.yakuman_count < 0:
        raise ValueError("yakuman_count cannot be negative.")
    if score_input.yakuman_count:
        if score_input.han < 0:
            raise ValueError("han cannot be negative.")
        return
    if score_input.han <= 0:
        raise ValueError("han must be positive.")
    if score_input.fu is None:
        raise ValueError("fu is required for non-yakuman hands.")
    if score_input.fu < 20:
        raise ValueError("fu must be at least 20.")
    if score_input.fu % 10 != 0 and score_input.fu != 25:
        raise ValueError("fu must be 25 or a multiple of 10.")
