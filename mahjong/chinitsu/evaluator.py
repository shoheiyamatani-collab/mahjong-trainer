from __future__ import annotations


def evaluate_wait_answer(correct_waits: tuple[int, ...], answer: tuple[int, ...]) -> bool:
    return tuple(sorted(correct_waits)) == tuple(sorted(answer))

