from pathlib import Path

from mahjong.problems import load_problems, record_attempt, save_problem
from mahjong.tiles import parse_hand


def test_save_problem_deduplicates_and_records_attempts(tmp_path: Path):
    path = tmp_path / "problems.json"
    counts = parse_hand("123m456m789p11s\u6771\u5357\u4e2d").counts

    first, created_first = save_problem(counts, path)
    second, created_second = save_problem(counts, path)
    record_attempt(first["id"], is_correct=True, path=path)

    problems = load_problems(path)

    assert created_first is True
    assert created_second is False
    assert first["id"] == second["id"]
    assert len(problems) == 1
    assert problems[0]["attempts"] == 1
    assert problems[0]["correct"] == 1
