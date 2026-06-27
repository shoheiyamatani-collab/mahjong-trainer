from __future__ import annotations

import random

from mahjong.chinitsu.generator import generate_wait_question, hand_key
from mahjong.chinitsu.types import ChinitsuWaitQuestion


QUESTION_BANK_SEED = 2026062701
QUESTIONS_PER_SUIT = 150
QUESTION_SUITS = ("m", "p", "s")


def _build_wait_questions() -> tuple[ChinitsuWaitQuestion, ...]:
    rng = random.Random(QUESTION_BANK_SEED)
    used_hand_keys: set[str] = set()
    questions: list[ChinitsuWaitQuestion] = []

    for round_index in range(QUESTIONS_PER_SUIT):
        for suit in QUESTION_SUITS:
            generated = generate_wait_question(rng, recent_hands=used_hand_keys)
            key = hand_key(generated.hand)
            used_hand_keys.add(key)
            questions.append(
                ChinitsuWaitQuestion(
                    hand=generated.hand,
                    waits=generated.waits,
                    suit=suit,
                )
            )

    return tuple(questions)


CHINITSU_WAIT_QUESTIONS: tuple[ChinitsuWaitQuestion, ...] = _build_wait_questions()


def question_count() -> int:
    return len(CHINITSU_WAIT_QUESTIONS)


def get_wait_question(index: int) -> ChinitsuWaitQuestion:
    if not CHINITSU_WAIT_QUESTIONS:
        raise ValueError("Chinitsu question bank is empty.")
    return CHINITSU_WAIT_QUESTIONS[index % len(CHINITSU_WAIT_QUESTIONS)]


def iter_wait_questions() -> tuple[ChinitsuWaitQuestion, ...]:
    return CHINITSU_WAIT_QUESTIONS
