from __future__ import annotations

import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from mahjong.tiles import counts_to_tiles, validate_counts


PROBLEM_STORE = Path("data") / "problems.json"


def problem_id(counts: tuple[int, ...] | list[int]) -> str:
    validate_counts(counts, expected_total=14)
    raw = ",".join(str(count) for count in counts)
    return hashlib.sha256(raw.encode("ascii")).hexdigest()[:16]


def load_problems(path: Path = PROBLEM_STORE) -> list[dict[str, Any]]:
    if not path.exists():
        return []
    with path.open("r", encoding="utf-8") as file:
        data = json.load(file)
    if not isinstance(data, list):
        raise ValueError("Problem store must contain a list.")
    return data


def save_problem(counts: tuple[int, ...] | list[int], path: Path = PROBLEM_STORE) -> tuple[dict[str, Any], bool]:
    validate_counts(counts, expected_total=14)
    problems = load_problems(path)
    pid = problem_id(counts)
    now = _now()

    for problem in problems:
        if problem.get("id") == pid:
            problem["last_saved_at"] = now
            _write_problems(problems, path)
            return problem, False

    problem = {
        "id": pid,
        "counts": list(counts),
        "hand": " ".join(counts_to_tiles(counts)),
        "created_at": now,
        "last_saved_at": now,
        "attempts": 0,
        "correct": 0,
        "last_reviewed_at": None,
    }
    problems.append(problem)
    _write_problems(problems, path)
    return problem, True


def record_attempt(problem_id_value: str, is_correct: bool, path: Path = PROBLEM_STORE) -> None:
    problems = load_problems(path)
    for problem in problems:
        if problem.get("id") == problem_id_value:
            problem["attempts"] = int(problem.get("attempts", 0)) + 1
            problem["correct"] = int(problem.get("correct", 0)) + int(is_correct)
            problem["last_reviewed_at"] = _now()
            _write_problems(problems, path)
            return
    raise ValueError(f"Problem not found: {problem_id_value}")


def _write_problems(problems: list[dict[str, Any]], path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as file:
        json.dump(problems, file, ensure_ascii=False, indent=2)


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()
