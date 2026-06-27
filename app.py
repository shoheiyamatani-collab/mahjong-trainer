from __future__ import annotations

import html
import random

import streamlit as st

from mahjong.analyzer import analyze_discards, best_discards_for_review
from mahjong.chinitsu.evaluator import evaluate_wait_answer
from mahjong.chinitsu.generator import (
    generate_wait_question as generate_chinitsu_wait_question,
    hand_key,
)
from mahjong.chinitsu.parser import chinitsu_tiles
from mahjong.chinitsu.question_bank import get_wait_question, question_count
from mahjong.melds import Meld, meld_tile_counts, validate_meld
from mahjong.problems import load_problems, record_attempt, save_problem
from mahjong.score_calculator import HandScoreInput, calculate_hand_score
from mahjong.shanten import normal_shanten
from mahjong.tile_images import tile_image_data_uri, tile_image_path
from mahjong.tiles import TILE_NAMES, counts_to_tiles, parse_hand
from mahjong.yaku import EAST, NORTH, SOUTH, WEST


APP_TITLE = "\u9ebb\u96c0 \u724c\u7406\u30c8\u30ec\u30fc\u30ca\u30fc"
DEFAULT_HAND = ""
WIND_OPTIONS = [EAST, SOUTH, WEST, NORTH]
MELD_KIND_LABELS = {
    "chi": "\u30c1\u30fc",
    "pon": "\u30dd\u30f3",
    "open_kan": "\u660e\u69d3",
    "closed_kan": "\u6697\u69d3",
    "added_kan": "\u52a0\u69d3",
}


st.set_page_config(page_title=APP_TITLE, layout="wide")


def _sorted_hand_text(counts: tuple[int, ...] | list[int]) -> str:
    return " ".join(counts_to_tiles(counts))


def _add_tile_to_input(tile: str) -> None:
    current = st.session_state.get("hand_input", "")
    try:
        parsed = parse_hand(current)
    except ValueError:
        parsed = parse_hand("")
    if sum(parsed.counts) >= 14 or parsed.counts[TILE_NAMES.index(tile)] >= 4:
        return
    counts = list(parsed.counts)
    counts[TILE_NAMES.index(tile)] += 1
    st.session_state.hand_input = _sorted_hand_text(counts)


def _add_tile_to_score_input(tile: str) -> None:
    current = st.session_state.get("score_hand_input", "")
    try:
        parsed = parse_hand(current)
    except ValueError:
        parsed = parse_hand("")
    expected_total = _score_closed_tile_limit()
    visible_counts = _score_visible_counts()
    if sum(parsed.counts) >= expected_total or visible_counts[TILE_NAMES.index(tile)] >= 4:
        return
    counts = list(parsed.counts)
    counts[TILE_NAMES.index(tile)] += 1
    st.session_state.score_hand_input = _sorted_hand_text(counts)
    st.session_state.score_result = None


def _remove_last_tile() -> None:
    try:
        parsed = parse_hand(st.session_state.get("hand_input", ""))
    except ValueError:
        st.session_state.hand_input = ""
        return
    tiles = list(counts_to_tiles(parsed.counts))
    if tiles:
        tiles.pop()
    st.session_state.hand_input = _sorted_hand_text(parse_hand(" ".join(tiles)).counts)


def _remove_tile_from_input(tile: str) -> None:
    try:
        parsed = parse_hand(st.session_state.get("hand_input", ""))
    except ValueError:
        st.session_state.hand_input = ""
        return
    counts = list(parsed.counts)
    index = TILE_NAMES.index(tile)
    if counts[index] == 0:
        return
    counts[index] -= 1
    st.session_state.hand_input = _sorted_hand_text(counts)


def _remove_tile_from_score_input(tile: str) -> None:
    try:
        parsed = parse_hand(st.session_state.get("score_hand_input", ""))
    except ValueError:
        st.session_state.score_hand_input = ""
        return
    counts = list(parsed.counts)
    index = TILE_NAMES.index(tile)
    if counts[index] == 0:
        return
    counts[index] -= 1
    st.session_state.score_hand_input = _sorted_hand_text(counts)
    st.session_state.score_result = None


def _clear_hand() -> None:
    st.session_state.hand_input = ""


def _clear_score_hand() -> None:
    st.session_state.score_hand_input = ""
    st.session_state.score_melds = []
    st.session_state.score_result = None
    st.session_state.score_winning_tile = None
    st.session_state.score_meld_error = None
    st.session_state.score_show_meld_form = False


def _load_sample_hand() -> None:
    st.session_state.hand_input = _sorted_hand_text(parse_hand("345688m1234p3456s").counts)


def _select_review_answer(tile: str) -> None:
    st.session_state.review_answer = tile
    st.session_state.review_checked = False


def _check_review_answer() -> None:
    st.session_state.review_checked = True


def _next_review_problem(problem_count: int) -> None:
    if problem_count == 0:
        return
    current = st.session_state.get("review_index", 0)
    st.session_state.review_index = (current + 1) % problem_count
    st.session_state.review_answer = None
    st.session_state.review_checked = False


def _random_review_problem(problem_count: int) -> None:
    if problem_count == 0:
        return
    st.session_state.review_index = random.randrange(problem_count)
    st.session_state.review_answer = None
    st.session_state.review_checked = False


def _toggle_chinitsu_answer(tile: str) -> None:
    rank = int(tile[0])
    selected = set(st.session_state.get("chinitsu_answer", []))
    if rank in selected:
        selected.remove(rank)
    else:
        selected.add(rank)
    st.session_state.chinitsu_answer = sorted(selected)
    st.session_state.chinitsu_checked = False
    st.session_state.chinitsu_show_answer = False


def _check_chinitsu_answer() -> None:
    st.session_state.chinitsu_checked = True


def _show_chinitsu_answer() -> None:
    st.session_state.chinitsu_show_answer = True


def _reset_chinitsu_answer() -> None:
    st.session_state.chinitsu_answer = []
    st.session_state.chinitsu_checked = False
    st.session_state.chinitsu_show_answer = False


def _next_chinitsu_question() -> None:
    st.session_state.chinitsu_question_index = (
        int(st.session_state.get("chinitsu_question_index", 0)) + 1
    ) % question_count()
    _reset_chinitsu_answer()


def _guarded_next_chinitsu_question() -> None:
    if not st.session_state.get("chinitsu_checked") and not st.session_state.get("chinitsu_show_answer"):
        st.session_state.chinitsu_show_answer = True
        return
    _next_chinitsu_question()


def _toggle_generated_chinitsu_answer(tile: str) -> None:
    rank = int(tile[0])
    selected = set(st.session_state.get("generated_chinitsu_answer", []))
    if rank in selected:
        selected.remove(rank)
    else:
        selected.add(rank)
    st.session_state.generated_chinitsu_answer = sorted(selected)
    st.session_state.generated_chinitsu_checked = False
    st.session_state.generated_chinitsu_show_answer = False


def _reset_generated_chinitsu_answer() -> None:
    st.session_state.generated_chinitsu_answer = []
    st.session_state.generated_chinitsu_checked = False
    st.session_state.generated_chinitsu_show_answer = False


def _check_generated_chinitsu_answer() -> None:
    st.session_state.generated_chinitsu_checked = True


def _show_generated_chinitsu_answer() -> None:
    st.session_state.generated_chinitsu_show_answer = True


def _new_generated_chinitsu_question() -> None:
    history = list(st.session_state.get("generated_chinitsu_history", []))
    question = generate_chinitsu_wait_question(
        recent_hands=history[-8:],
    )
    st.session_state.generated_chinitsu_question = question
    history.append(hand_key(question.hand))
    st.session_state.generated_chinitsu_history = history[-20:]
    _reset_generated_chinitsu_answer()


def _guarded_new_generated_chinitsu_question() -> None:
    if (
        not st.session_state.get("generated_chinitsu_checked")
        and not st.session_state.get("generated_chinitsu_show_answer")
    ):
        st.session_state.generated_chinitsu_show_answer = True
        return
    _new_generated_chinitsu_question()


def _show_tile_row(tiles: list[str] | tuple[str, ...], width: int = 44) -> None:
    if not tiles:
        st.caption("-")
        return
    images = "\n".join(
        f'<img src="{tile_image_data_uri(tile)}" alt="{html.escape(tile)}">'
        for tile in tiles
    )
    st.markdown(
        f"""
        <div class="tile-strip" style="--tile-count:{len(tiles)}; --tile-width:{width}px;">
          {images}
        </div>
        """,
        unsafe_allow_html=True,
    )


def _score_closed_tile_limit() -> int:
    meld_count = len(st.session_state.get("score_melds", []))
    return 2 + (3 * (4 - meld_count))


def _score_melds() -> tuple[Meld, ...]:
    return tuple(
        Meld(meld["kind"], tuple(meld["tiles"]))
        for meld in st.session_state.get("score_melds", [])
    )


def _score_visible_counts(extra_melds: tuple[Meld, ...] = ()) -> list[int]:
    try:
        parsed = parse_hand(st.session_state.get("score_hand_input", ""))
    except ValueError:
        parsed = parse_hand("")
    counts = list(parsed.counts)
    meld_counts = meld_tile_counts((*_score_melds(), *extra_melds))
    return [count + meld_counts[index] for index, count in enumerate(counts)]


def _add_score_meld(kind: str, tiles: tuple[str, ...]) -> None:
    st.session_state.score_meld_error = None
    melds = list(st.session_state.get("score_melds", []))
    if len(melds) >= 4:
        st.session_state.score_meld_error = "\u526f\u9732\u9762\u5b50\u306f4\u3064\u307e\u3067\u3067\u3059\u3002"
        return
    meld = Meld(kind, tiles)
    try:
        validate_meld(meld)
        visible_counts = _score_visible_counts((meld,))
    except ValueError as exc:
        st.session_state.score_meld_error = str(exc)
        return
    if any(count > 4 for count in visible_counts):
        st.session_state.score_meld_error = "\u624b\u724c\u3068\u526f\u9732\u306e\u5408\u8a08\u30674\u679a\u3092\u8d85\u3048\u308b\u724c\u304c\u3042\u308a\u307e\u3059\u3002"
        return
    try:
        parsed = parse_hand(st.session_state.get("score_hand_input", ""))
    except ValueError:
        parsed = parse_hand("")
    next_expected_total = 2 + (3 * (4 - (len(melds) + 1)))
    if sum(parsed.counts) > next_expected_total:
        st.session_state.score_meld_error = "\u526f\u9732\u3092\u8ffd\u52a0\u3059\u308b\u3068\u9589\u3058\u624b\u724c\u306e\u679a\u6570\u304c\u591a\u3059\u304e\u307e\u3059\u3002"
        return
    melds.append({"kind": kind, "tiles": list(tiles)})
    st.session_state.score_melds = melds
    st.session_state.score_result = None
    st.session_state.score_show_meld_form = False


def _remove_score_meld(index: int) -> None:
    melds = list(st.session_state.get("score_melds", []))
    if 0 <= index < len(melds):
        melds.pop(index)
    st.session_state.score_melds = melds
    st.session_state.score_result = None
    st.session_state.score_meld_error = None


def _select_score_winning_tile(tile: str) -> None:
    st.session_state.score_winning_tile = tile
    st.session_state.score_result = None


def _clear_score_result() -> None:
    st.session_state.score_result = None


def _show_score_meld_form() -> None:
    st.session_state.score_show_meld_form = True
    st.session_state.score_meld_error = None


def _hide_score_meld_form() -> None:
    st.session_state.score_show_meld_form = False
    st.session_state.score_meld_error = None


def _show_styles() -> None:
    st.markdown(
        """
        <style>
          div[data-testid="stButton"] button:has(img) {
            background: #f7f7f5;
            border: 1px solid rgba(49, 51, 63, 0.16);
            border-radius: 6px;
            height: 88px;
            min-height: 88px;
            padding: 3px;
            width: 66px;
          }
          div[data-testid="stButton"] button:has(img):hover {
            background: #fff3bf;
            border-color: #d8a31c;
            transform: translateY(-1px);
          }
          div[data-testid="stButton"] button img {
            display: block !important;
            height: 78px !important;
            max-height: 78px !important;
            max-width: 57px !important;
            object-fit: contain !important;
            width: 57px !important;
          }
          div[data-testid="stButton"] button p {
            line-height: 0 !important;
            margin: 0 !important;
          }
          div.st-key-tile_palette,
          div.st-key-answer_palette,
          div.st-key-hand_tiles,
          div.st-key-score_palette,
          div.st-key-score_hand_tiles,
          div.st-key-score_winning_tiles,
          div.st-key-chinitsu_hand_tiles,
          div.st-key-chinitsu_answer_palette,
          div.st-key-generated_chinitsu_hand_tiles,
          div.st-key-generated_chinitsu_answer_palette {
            align-items: flex-start !important;
            display: flex !important;
            flex-direction: row !important;
            flex-wrap: wrap !important;
          }
          div[data-testid="stElementContainer"]:has(div[data-testid="stButton"] button img) {
            display: inline-block !important;
            margin: 0 8px 10px 0 !important;
            vertical-align: top !important;
            width: 66px !important;
          }
          div[data-testid="stElementContainer"]:has(.tile-row-break) {
            display: block !important;
            height: 0 !important;
            margin: 0 !important;
            width: 100% !important;
          }
          .answer-result {
            border-radius: 14px;
            box-shadow: 0 12px 28px rgba(0, 0, 0, 0.16);
            font-size: 3.4rem;
            font-weight: 900;
            letter-spacing: 0;
            line-height: 1.08;
            margin: 20px 0;
            padding: 26px 28px;
            text-align: center;
          }
          .answer-correct {
            background: #fff5f5;
            border: 3px solid #fa5252;
            color: #c92a2a;
          }
          .answer-wrong {
            background: #e7f5ff;
            border: 3px solid #1c7ed6;
            color: #0b4f8a;
          }
          .mode-banner {
            border-left: 8px solid #868e96;
            border-radius: 8px;
            margin: 8px 0 18px 0;
            padding: 14px 18px 16px 18px;
          }
          .mode-banner h2 {
            font-size: 1.45rem;
            line-height: 1.25;
            margin: 2px 0 0 0;
          }
          .mode-kicker {
            font-size: 0.86rem;
            font-weight: 700;
            margin: 0;
          }
          .mode-checker {
            background: #ebfbee;
            border-color: #2f9e44;
            color: #1b5e20;
          }
          .mode-review {
            background: #fff4e6;
            border-color: #f08c00;
            color: #7c4a03;
          }
          .mode-scoring {
            background: #e7f5ff;
            border-color: #1c7ed6;
            color: #0b4f8a;
          }
          .mode-chinitsu {
            background: #f3f0ff;
            border-color: #7950f2;
            color: #4c3299;
          }
          div.st-key-tile_palette button:has(img),
          div.st-key-hand_tiles button:has(img) {
            background: #f1fbf4;
            border-color: rgba(47, 158, 68, 0.38);
          }
          div.st-key-tile_palette button:has(img):hover,
          div.st-key-hand_tiles button:has(img):hover {
            background: #d3f9d8;
            border-color: #2f9e44;
          }
          div.st-key-answer_palette button:has(img) {
            background: #fff8ed;
            border-color: rgba(240, 140, 0, 0.38);
          }
          div.st-key-answer_palette button:has(img):hover {
            background: #ffe8cc;
            border-color: #f08c00;
          }
          div.st-key-score_palette button:has(img),
          div.st-key-score_hand_tiles button:has(img),
          div.st-key-score_winning_tiles button:has(img) {
            background: #f0f8ff;
            border-color: rgba(28, 126, 214, 0.38);
          }
          div.st-key-score_palette button:has(img):hover,
          div.st-key-score_hand_tiles button:has(img):hover,
          div.st-key-score_winning_tiles button:has(img):hover {
            background: #d0ebff;
            border-color: #1c7ed6;
          }
          div.st-key-chinitsu_hand_tiles button:has(img),
          div.st-key-chinitsu_answer_palette button:has(img),
          div.st-key-generated_chinitsu_hand_tiles button:has(img),
          div.st-key-generated_chinitsu_answer_palette button:has(img) {
            background: #f8f5ff;
            border-color: rgba(121, 80, 242, 0.38);
          }
          div.st-key-chinitsu_hand_tiles button:has(img):hover,
          div.st-key-chinitsu_answer_palette button:has(img):hover,
          div.st-key-generated_chinitsu_hand_tiles button:has(img):hover,
          div.st-key-generated_chinitsu_answer_palette button:has(img):hover {
            background: #e5dbff;
            border-color: #7950f2;
          }
          .tile-strip {
            align-items: flex-start;
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            gap: 4px;
            margin: 2px 0 8px 0;
            max-width: 100%;
            overflow: hidden;
          }
          .tile-strip img {
            display: block;
            flex: 0 1 auto;
            height: auto;
            min-width: 0;
            object-fit: contain;
            width: min(var(--tile-width, 44px), calc((100vw - 48px) / var(--tile-count, 14)));
          }
          @media (max-width: 640px) {
            div.st-key-hand_tiles,
            div.st-key-score_hand_tiles,
            div.st-key-chinitsu_hand_tiles,
            div.st-key-generated_chinitsu_hand_tiles {
              flex-wrap: nowrap !important;
              gap: 0 !important;
              overflow: hidden !important;
              width: 100% !important;
            }
            div.st-key-hand_tiles div[data-testid="stElementContainer"]:has(div[data-testid="stButton"] button img),
            div.st-key-score_hand_tiles div[data-testid="stElementContainer"]:has(div[data-testid="stButton"] button img),
            div.st-key-chinitsu_hand_tiles div[data-testid="stElementContainer"]:has(div[data-testid="stButton"] button img),
            div.st-key-generated_chinitsu_hand_tiles div[data-testid="stElementContainer"]:has(div[data-testid="stButton"] button img) {
              margin: 0 1px 6px 0 !important;
              width: calc((100vw - 46px) / 14) !important;
            }
            div.st-key-hand_tiles button:has(img),
            div.st-key-score_hand_tiles button:has(img),
            div.st-key-chinitsu_hand_tiles button:has(img),
            div.st-key-generated_chinitsu_hand_tiles button:has(img) {
              border-radius: 4px;
              height: calc((100vw - 46px) / 10.3) !important;
              min-height: calc((100vw - 46px) / 10.3) !important;
              padding: 1px !important;
              width: calc((100vw - 46px) / 14) !important;
            }
            div.st-key-hand_tiles button:has(img) img,
            div.st-key-score_hand_tiles button:has(img) img,
            div.st-key-chinitsu_hand_tiles button:has(img) img,
            div.st-key-generated_chinitsu_hand_tiles button:has(img) img {
              height: calc((100vw - 56px) / 10.8) !important;
              max-height: calc((100vw - 56px) / 10.8) !important;
              max-width: calc((100vw - 56px) / 14) !important;
              width: calc((100vw - 56px) / 14) !important;
            }
          }
          .progress-label {
            color: rgba(49, 51, 63, 0.72);
            font-size: 0.82rem;
            margin-bottom: 6px;
          }
          .shanten-badge {
            align-items: center;
            border: 1px solid #adb5bd;
            border-radius: 999px;
            display: inline-flex;
            font-size: 0.98rem;
            font-weight: 800;
            justify-content: center;
            line-height: 1.15;
            min-height: 34px;
            padding: 7px 12px;
            white-space: nowrap;
          }
          .shanten-tenpai {
            background: #fff0f6;
            border-color: #d6336c;
            color: #a61e4d;
          }
          .shanten-iishanten {
            background: #ebfbee;
            border-color: #2f9e44;
            color: #1b5e20;
          }
          .shanten-ryanshanten {
            background: #e7f5ff;
            border-color: #1c7ed6;
            color: #0b4f8a;
          }
          .shanten-sanshanten {
            background: #f3f0ff;
            border-color: #7950f2;
            color: #4c3299;
          }
          .shanten-other {
            background: #f8f9fa;
            border-color: #868e96;
            color: #495057;
          }
        </style>
        """,
        unsafe_allow_html=True,
    )


def _show_mode_header(title: str, kicker: str, tone: str) -> None:
    st.markdown(
        f"""
        <div class="mode-banner mode-{tone}">
          <p class="mode-kicker">{kicker}</p>
          <h2>{title}</h2>
        </div>
        """,
        unsafe_allow_html=True,
    )


def _tile_button(tile: str, key: str, callback, *, disabled: bool = False) -> None:
    label = f"![{tile}]({tile_image_data_uri(tile)})"
    st.button(
        label,
        key=key,
        help=tile,
        on_click=callback,
        args=(tile,),
        width="stretch",
        disabled=disabled,
    )


def _show_tile_button_grid(prefix: str, callback, *, disabled: bool = False) -> None:
    with st.container(key=prefix):
        for start, end in [(0, 9), (9, 18), (18, 27), (27, 34)]:
            for tile in TILE_NAMES[start:end]:
                _tile_button(tile, f"{prefix}-{tile}", callback, disabled=disabled)
            st.markdown('<div class="tile-row-break"></div>', unsafe_allow_html=True)


def _show_tile_palette() -> None:
    _show_tile_button_grid("tile_palette", _add_tile_to_input)


def _show_answer_palette(tiles: list[str], disabled: bool) -> None:
    with st.container(key="answer_palette"):
        for tile in tiles:
            _tile_button(tile, f"answer-{tile}", _select_review_answer, disabled=disabled)


def _show_editable_hand_tiles(tiles: list[str]) -> None:
    if not tiles:
        st.caption("0 / 14")
        return
    with st.container(key="hand_tiles"):
        for index, tile in enumerate(tiles):
            _tile_button(tile, f"hand-remove-{index}-{tile}", _remove_tile_from_input)
    st.caption(f"{len(tiles)} / 14")


def _show_editable_score_hand_tiles(tiles: list[str], expected_total: int) -> None:
    if not tiles:
        st.caption(f"0 / {expected_total}")
        return
    with st.container(key="score_hand_tiles"):
        for index, tile in enumerate(tiles):
            _tile_button(tile, f"score-hand-remove-{index}-{tile}", _remove_tile_from_score_input)
    st.caption(f"{len(tiles)} / {expected_total}")


def _show_score_winning_picker(tiles: list[str]) -> None:
    with st.container(key="score_winning_tiles"):
        for tile in tiles:
            _tile_button(tile, f"score-winning-{tile}", _select_score_winning_tile)


def _shanten_label(shanten: int) -> str:
    labels = {
        -1: "\u548c\u4e86",
        0: "\u8074\u724c",
        1: "\u4e00\u5411\u8074",
        2: "\u4e8c\u5411\u8074",
        3: "\u4e09\u5411\u8074",
    }
    return labels.get(shanten, f"{shanten}\u5411\u8074")


def _shanten_progress_label(after_discard_shanten: int) -> str:
    if after_discard_shanten <= 0:
        return _shanten_label(after_discard_shanten)
    return f"{_shanten_label(after_discard_shanten)}\u2192{_shanten_label(after_discard_shanten - 1)}"


def _shanten_tone(shanten: int) -> str:
    return {
        0: "tenpai",
        1: "iishanten",
        2: "ryanshanten",
        3: "sanshanten",
    }.get(shanten, "other")


def _show_shanten_progress(after_discard_shanten: int) -> None:
    st.markdown(
        f"""
        <div class="progress-label">\u9032\u884c</div>
        <span class="shanten-badge shanten-{_shanten_tone(after_discard_shanten)}">
          {_shanten_progress_label(after_discard_shanten)}
        </span>
        """,
        unsafe_allow_html=True,
    )


def _show_discard_comparison(results, best: set[str]) -> None:
    st.subheader("\u6253\u724c\u5019\u88dc\u30fb\u6709\u52b9\u724c\u6bd4\u8f03")
    if best:
        best_labels = "\u3001".join(sorted(best, key=lambda tile: TILE_NAMES.index(tile)))
        st.success(f"\u6700\u5584\u6253\u724c: {best_labels}")
        _show_tile_row(tuple(sorted(best, key=lambda tile: TILE_NAMES.index(tile))), width=46)
    else:
        st.warning("\u6bd4\u8f03\u3067\u304d\u308b\u6253\u724c\u5019\u88dc\u304c\u3042\u308a\u307e\u305b\u3093\u3002")

    for result in results:
        with st.container(border=True):
            cols = st.columns([0.75, 0.9, 0.85, 0.85, 0.95, 0.95, 3.5])
            with cols[0]:
                st.caption("\u6253\u724c")
                st.image(tile_image_path(result.discard), width=44)
                if result.discard in best:
                    st.markdown("**\u6700\u5584**")
            with cols[1]:
                _show_shanten_progress(result.after_discard_shanten)
            with cols[2]:
                st.metric("\u9032\u3080\u724c\u7a2e\u6570", f"{result.ukeire_types}\u7a2e")
            with cols[3]:
                st.metric("\u9032\u3080\u679a\u6570", f"{result.ukeire_tiles}\u679a")
            with cols[4]:
                good_rate = f"{result.good_shape_rate:.0%}" if result.tenpai_details else "-"
                st.metric("\u826f\u5f62\u7387", good_rate)
            with cols[5]:
                super_rate = f"{result.super_good_shape_rate:.0%}" if result.tenpai_details else "-"
                st.metric("\u8d85\u826f\u5f62\u7387", super_rate)
            with cols[6]:
                st.caption("\u6709\u52b9\u724c")
                if result.ukeire:
                    _show_tile_row(result.ukeire, width=38)
                else:
                    st.caption("\u306a\u3057")
            if result.tenpai_details:
                with st.expander("\u53d7\u5165\u308c\u5225\u306e\u5f85\u3061"):
                    for detail in result.tenpai_details:
                        detail_cols = st.columns([0.45, 0.6, 0.7, 0.9, 3.5])
                        with detail_cols[0]:
                            st.image(tile_image_path(detail.draw), width=34)
                        with detail_cols[1]:
                            st.caption(f"{detail.draw_tiles}\u679a")
                        with detail_cols[2]:
                            st.caption(f"{detail.winning_tiles}\u679a\u5f85\u3061")
                        with detail_cols[3]:
                            labels = []
                            if detail.is_good_shape:
                                labels.append("\u826f\u5f62")
                            if detail.is_super_good_shape:
                                labels.append("\u8d85\u826f\u5f62")
                            st.caption(" / ".join(labels) if labels else "-")
                        with detail_cols[4]:
                            _show_tile_row(detail.winning, width=30)


def _checker_mode() -> None:
    _show_mode_header("\u724c\u7406\u30c1\u30a7\u30c3\u30ab\u30fc", "\u53d7\u5165\u308c\u6bd4\u8f03", "checker")
    parsed_for_display = None
    try:
        parsed_for_display = parse_hand(st.session_state.hand_input)
    except ValueError:
        pass

    st.subheader("\u624b\u724c")
    if parsed_for_display:
        _show_editable_hand_tiles(counts_to_tiles(parsed_for_display.counts))
    else:
        _show_editable_hand_tiles([])

    action_cols = st.columns([1, 1, 1, 5])
    with action_cols[0]:
        st.button("\u4e00\u679a\u623b\u3059", on_click=_remove_last_tile, width="stretch")
    with action_cols[1]:
        st.button("\u30af\u30ea\u30a2", on_click=_clear_hand, width="stretch")
    with action_cols[2]:
        st.button("\u30b5\u30f3\u30d7\u30eb", on_click=_load_sample_hand, width="stretch")

    with st.expander("\u6587\u5b57\u5217\u3067\u5165\u529b"):
        st.text_input(
            "\u624b\u724c",
            key="hand_input",
            help="14\u679a\u3092\u5165\u529b\u3057\u3066\u304f\u3060\u3055\u3044\u3002\u4f8b: 123m456m789p11s\u6771\u5357\u4e2d",
        )

    st.subheader("\u724c\u3092\u8ffd\u52a0")
    _show_tile_palette()

    try:
        parsed = parse_hand(st.session_state.hand_input)
        total_tiles = sum(parsed.counts)

        if total_tiles != 14:
            st.info("\u6253\u724c\u6bd4\u8f03\u306b\u306f14\u679a\u306e\u624b\u724c\u3092\u5165\u529b\u3057\u3066\u304f\u3060\u3055\u3044\u3002")
            return

        if normal_shanten(parsed.counts) == -1:
            st.success("\u30a2\u30ac\u30c3\u30c6\u30eb\u30a2\u30eb\u30e8\u2026")
            return

        results = analyze_discards(parsed.counts)
        best = {result.discard for result in best_discards_for_review(results)}

        save_cols = st.columns([1.5, 4])
        with save_cols[0]:
            if st.button("\u3053\u306e\u624b\u724c\u3092\u554f\u984c\u306b\u4fdd\u5b58", width="stretch", disabled=not best):
                _, created = save_problem(parsed.counts)
                if created:
                    st.success("\u554f\u984c\u3068\u3057\u3066\u4fdd\u5b58\u3057\u307e\u3057\u305f\u3002")
                else:
                    st.info("\u3059\u3067\u306b\u4fdd\u5b58\u6e08\u307f\u306e\u624b\u724c\u3067\u3059\u3002")

        _show_discard_comparison(results, best)

    except ValueError as exc:
        st.error(str(exc))


def _review_mode() -> None:
    problems = load_problems()
    if "review_index" not in st.session_state:
        st.session_state.review_index = 0
    if "review_answer" not in st.session_state:
        st.session_state.review_answer = None
    if "review_checked" not in st.session_state:
        st.session_state.review_checked = False

    _show_mode_header("\u5fa9\u7fd2\u30e2\u30fc\u30c9", "\u4f55\u3092\u5207\u308b\u554f\u984c", "review")
    st.write(f"\u4fdd\u5b58\u6e08\u307f\u554f\u984c: **{len(problems)}**")
    if not problems:
        st.info("\u307e\u305a\u306f\u724c\u7406\u30c1\u30a7\u30c3\u30ab\u30fc\u306714\u679a\u306e\u624b\u724c\u3092\u4f5c\u3063\u3066\u3001\u554f\u984c\u3068\u3057\u3066\u4fdd\u5b58\u3057\u3066\u304f\u3060\u3055\u3044\u3002")
        return

    st.session_state.review_index %= len(problems)
    problem = problems[st.session_state.review_index]
    counts = tuple(int(value) for value in problem["counts"])
    results = analyze_discards(counts)
    best_results = best_discards_for_review(results)
    best = {result.discard for result in best_results}
    answer = st.session_state.review_answer
    checked = st.session_state.review_checked

    top_cols = st.columns([1, 1, 1, 4])
    with top_cols[0]:
        st.button("\u6b21\u306e\u554f\u984c", on_click=_next_review_problem, args=(len(problems),), width="stretch")
    with top_cols[1]:
        st.button("\u30e9\u30f3\u30c0\u30e0", on_click=_random_review_problem, args=(len(problems),), width="stretch")
    with top_cols[2]:
        if st.button("\u89e3\u7b54\u3092\u30ea\u30bb\u30c3\u30c8", width="stretch"):
            st.session_state.review_answer = None
            st.session_state.review_checked = False
            st.rerun()

    stat_text = f"{int(problem.get('correct', 0))}/{int(problem.get('attempts', 0))}"
    st.caption(f"ID: {problem['id']} / \u6b63\u89e3\u6570: {stat_text}")
    _show_tile_row(counts_to_tiles(counts), width=50)

    _show_answer_palette(sorted(set(counts_to_tiles(counts)), key=lambda tile: TILE_NAMES.index(tile)), disabled=checked)

    if answer:
        st.write(f"\u9078\u629e\u3057\u305f\u6253\u724c: **{answer}**")
        st.image(tile_image_path(answer), width=50)
        if not checked:
            st.button("\u7b54\u3048\u5408\u308f\u305b", on_click=_check_review_answer, width="stretch")

    if checked and answer:
        is_correct = answer in best
        if st.session_state.get("last_recorded_review") != (problem["id"], answer, is_correct):
            record_attempt(problem["id"], is_correct)
            st.session_state.last_recorded_review = (problem["id"], answer, is_correct)
        if is_correct:
            st.markdown('<div class="answer-result answer-correct">\u3007\u6b63\u89e3\uff01</div>', unsafe_allow_html=True)
        else:
            st.markdown('<div class="answer-result answer-wrong">\u00d7\u4e0d\u6b63\u89e3\u2026</div>', unsafe_allow_html=True)

        best_labels = "\u3001".join(sorted(best, key=lambda tile: TILE_NAMES.index(tile)))
        st.write(f"\u6b63\u89e3: **{best_labels}**")
        _show_tile_row(tuple(sorted(best, key=lambda tile: TILE_NAMES.index(tile))), width=50)
        _show_discard_comparison(results, best)


def _scoring_mode() -> None:
    if "score_hand_input" not in st.session_state:
        st.session_state.score_hand_input = ""
    if "score_melds" not in st.session_state:
        st.session_state.score_melds = []
    if "score_result" not in st.session_state:
        st.session_state.score_result = None
    if "score_winning_tile" not in st.session_state:
        st.session_state.score_winning_tile = None
    if "score_meld_error" not in st.session_state:
        st.session_state.score_meld_error = None
    if "score_show_meld_form" not in st.session_state:
        st.session_state.score_show_meld_form = False

    _show_mode_header("\u70b9\u6570\u8a08\u7b97", "\u548c\u4e86\u70b9\u8a08\u7b97", "scoring")
    expected_total = _score_closed_tile_limit()
    try:
        parsed = parse_hand(st.session_state.score_hand_input)
    except ValueError as exc:
        parsed = parse_hand("")
        st.error(str(exc))

    st.caption("\u526f\u9732\u3057\u3066\u3044\u306a\u3044\u624b\u724c")
    _show_editable_score_hand_tiles(counts_to_tiles(parsed.counts), expected_total)

    cols = st.columns([1, 5])
    with cols[0]:
        st.button("\u30af\u30ea\u30a2", on_click=_clear_score_hand, width="stretch")

    with st.expander("\u6587\u5b57\u5217\u3067\u5165\u529b"):
        st.text_input("\u624b\u724c", key="score_hand_input", on_change=_clear_score_result)

    st.caption("\u624b\u724c\u306b\u8ffd\u52a0")
    _show_tile_button_grid("score_palette", _add_tile_to_score_input)

    _show_meld_editor()
    _show_score_inputs(parsed)


def _show_meld_editor() -> None:
    st.subheader("\u526f\u9732\u9762\u5b50")
    melds = st.session_state.get("score_melds", [])
    if st.session_state.get("score_meld_error"):
        st.error(st.session_state.score_meld_error)
    if melds:
        for index, meld in enumerate(melds):
            cols = st.columns([0.8, 3, 1])
            with cols[0]:
                st.write(MELD_KIND_LABELS[meld["kind"]])
            with cols[1]:
                _show_tile_row(tuple(meld["tiles"]), width=38)
            with cols[2]:
                if st.button("\u524a\u9664", key=f"remove-meld-{index}", width="stretch"):
                    _remove_score_meld(index)
                    st.rerun()
    else:
        st.caption("\u526f\u9732\u306a\u3057")

    if len(melds) >= 4:
        st.info("\u526f\u9732\u9762\u5b50\u306f4\u3064\u307e\u3067\u3067\u3059\u3002")
        return

    if not st.session_state.get("score_show_meld_form", False):
        st.button("\u526f\u9732\u3092\u8ffd\u52a0", on_click=_show_score_meld_form, width="stretch")
        return

    kind_label = st.selectbox("\u9762\u5b50\u7a2e\u5225", list(MELD_KIND_LABELS.values()))
    kind = next(key for key, value in MELD_KIND_LABELS.items() if value == kind_label)
    if kind == "chi":
        start_options = [f"{rank}{suit}" for suit in ("m", "p", "s") for rank in range(1, 8)]
        start_tile = st.selectbox("\u30c1\u30fc\u306e\u958b\u59cb\u724c", start_options)
        rank = int(start_tile[0])
        suit = start_tile[1]
        tiles = (f"{rank}{suit}", f"{rank + 1}{suit}", f"{rank + 2}{suit}")
    else:
        tile = st.selectbox("\u724c", TILE_NAMES)
        tile_count = 4 if kind in {"open_kan", "closed_kan", "added_kan"} else 3
        tiles = tuple([tile] * tile_count)

    _show_tile_row(tiles, width=38)
    action_cols = st.columns([1, 1])
    with action_cols[0]:
        add_clicked = st.button("\u526f\u9732\u306b\u8ffd\u52a0", width="stretch")
    with action_cols[1]:
        st.button("\u30ad\u30e3\u30f3\u30bb\u30eb", on_click=_hide_score_meld_form, width="stretch")

    if add_clicked:
        _add_score_meld(kind, tiles)
        st.rerun()


def _show_score_inputs(parsed) -> None:
    st.subheader("\u548c\u4e86\u60c5\u5831")
    closed_tiles = counts_to_tiles(parsed.counts)
    expected_total = _score_closed_tile_limit()
    missing: list[str] = []
    if len(closed_tiles) != expected_total:
        missing.append(f"\u624b\u724c\u3092{expected_total}\u679a\u306b\u3057\u3066\u304f\u3060\u3055\u3044")

    winning_options = sorted(set(closed_tiles), key=lambda tile: TILE_NAMES.index(tile))
    if winning_options:
        selected_tile = st.session_state.get("score_winning_tile")
        if selected_tile not in winning_options:
            selected_tile = winning_options[0]
            st.session_state.score_winning_tile = selected_tile
        winning_tile = selected_tile
        st.caption("\u548c\u4e86\u724c")
        st.image(tile_image_path(winning_tile), width=48)
        _show_score_winning_picker(winning_options)
    else:
        winning_tile = None
        missing.append("\u548c\u4e86\u724c\u5019\u88dc\u304c\u3042\u308a\u307e\u305b\u3093")

    col1, col2 = st.columns(2)
    with col1:
        dealer_label = st.radio("\u89aa / \u5b50", ["\u5b50", "\u89aa"], horizontal=True)
    with col2:
        win_method_label = st.radio("\u548c\u4e86", ["\u30ed\u30f3", "\u30c4\u30e2"], horizontal=True)

    col3, col4, col5 = st.columns(3)
    with col3:
        round_wind = st.selectbox("\u5834\u98a8", WIND_OPTIONS)
    with col4:
        seat_wind = st.selectbox("\u81ea\u98a8", WIND_OPTIONS, index=1)
    with col5:
        dora = st.number_input("\u30c9\u30e9\u679a\u6570", min_value=0, max_value=20, value=0, step=1)

    st.caption("\u72b6\u6cc1\u5f79")
    c1, c2, c3 = st.columns(3)
    situational: list[str] = []
    with c1:
        if st.checkbox("\u30ea\u30fc\u30c1"):
            situational.append("riichi")
    with c2:
        if st.checkbox("\u30c0\u30d6\u30eb\u30ea\u30fc\u30c1"):
            situational.append("double_riichi")
    with c3:
        if st.checkbox("\u4e00\u767a"):
            situational.append("ippatsu")

    if missing:
        for message in missing:
            st.warning(message)
        return

    if st.button("\u70b9\u6570\u3092\u8a08\u7b97", width="stretch"):
        try:
            result = calculate_hand_score(
                HandScoreInput(
                    counts=parsed.counts,
                    open_melds=_score_melds(),
                    winning_tile=winning_tile,
                    is_dealer=dealer_label == "\u89aa",
                    win_method="tsumo" if win_method_label == "\u30c4\u30e2" else "ron",
                    round_wind=round_wind,
                    seat_wind=seat_wind,
                    situational_yaku=tuple(situational),
                    dora=int(dora),
                )
            )
            st.session_state.score_result = result
        except ValueError as exc:
            st.session_state.score_result = None
            st.error(str(exc))

    if st.session_state.score_result is not None:
        _show_score_result(st.session_state.score_result)


def _show_score_result(result) -> None:
    st.subheader("\u8a08\u7b97\u7d50\u679c")
    with st.container(border=True):
        cols = st.columns([1, 1, 1])
        with cols[0]:
            st.metric("\u70b9\u6570", f"{result.score.total_points}\u70b9")
        with cols[1]:
            fu_text = "-" if result.score.fu is None else f"{result.score.fu}\u7b26"
            st.metric("\u7ffb\u30fb\u7b26", f"{result.score.han}\u7ffb {fu_text}")
        with cols[2]:
            st.metric("\u533a\u5206", result.score.limit_label)

        st.caption("\u652f\u6255\u3044\u5185\u8a33")
        for payment in result.score.payments:
            st.write(f"**{payment.label}**: {payment.points}\u70b9")

        st.caption("\u5f79")
        if result.yaku:
            for yaku in result.yaku:
                value = "\u5f79\u6e80" if yaku.is_yakuman else f"{yaku.han}\u7ffb"
                st.write(f"- {yaku.name}: {value}")
        else:
            st.write("-")


def _chinitsu_tile_name(rank: int, suit: str = "s") -> str:
    return f"{rank}{suit}"


def _show_chinitsu_tile_row(ranks: tuple[int, ...], width: int = 48, suit: str = "s") -> None:
    if not ranks:
        st.caption("-")
        return
    _show_tile_row(tuple(_chinitsu_tile_name(rank, suit) for rank in ranks), width=width)


def _show_chinitsu_answer_palette(suit: str = "s", disabled: bool = False) -> None:
    with st.container(key="chinitsu_answer_palette"):
        for rank in range(1, 10):
            _tile_button(
                _chinitsu_tile_name(rank, suit),
                f"chinitsu-answer-{rank}",
                _toggle_chinitsu_answer,
                disabled=disabled,
            )


def _show_generated_chinitsu_answer_palette(suit: str, disabled: bool = False) -> None:
    with st.container(key="generated_chinitsu_answer_palette"):
        for rank in range(1, 10):
            _tile_button(
                _chinitsu_tile_name(rank, suit),
                f"generated-chinitsu-answer-{rank}",
                _toggle_generated_chinitsu_answer,
                disabled=disabled,
            )


def _chinitsu_mode() -> None:
    if "chinitsu_question_index" not in st.session_state:
        st.session_state.chinitsu_question_index = 0
    if "chinitsu_answer" not in st.session_state:
        st.session_state.chinitsu_answer = []
    if "chinitsu_checked" not in st.session_state:
        st.session_state.chinitsu_checked = False
    if "chinitsu_show_answer" not in st.session_state:
        st.session_state.chinitsu_show_answer = False

    total_questions = question_count()
    question_index = int(st.session_state.chinitsu_question_index) % total_questions
    question = get_wait_question(question_index)
    suit = question.suit
    correct_waits = question.waits
    selected = tuple(st.session_state.chinitsu_answer)
    checked = bool(st.session_state.chinitsu_checked)
    show_answer = bool(st.session_state.chinitsu_show_answer)

    _show_mode_header("\u6e05\u4e00\u8272\u5f85\u3061\u5f53\u3066\u7279\u8a13", "\u7df4\u7fd2\u30e2\u30fc\u30c9", "chinitsu")
    st.caption("\u5f85\u3061\u724c\u3092\u3059\u3079\u3066\u9078\u3093\u3067\u304f\u3060\u3055\u3044\u3002")
    st.caption(f"\u7b2c{question_index + 1}\u554f / {total_questions}\u554f")

    st.subheader("\u554f\u984c")
    with st.container(key="chinitsu_hand_tiles"):
        for index, rank in enumerate(chinitsu_tiles(question.hand)):
            _tile_button(
                _chinitsu_tile_name(rank, suit),
                f"chinitsu-hand-{question_index}-{index}-{rank}",
                lambda tile: None,
                disabled=True,
            )

    st.subheader("\u5f85\u3061\u724c")
    _show_chinitsu_answer_palette(suit=suit, disabled=False)

    st.caption("\u9078\u629e\u4e2d")
    _show_chinitsu_tile_row(selected, width=42, suit=suit)

    action_cols = st.columns([1, 1, 1, 1, 4])
    with action_cols[0]:
        st.button("\u6c7a\u5b9a", on_click=_check_chinitsu_answer, width="stretch", disabled=not selected)
    with action_cols[1]:
        st.button("\u7b54\u3048\u3092\u898b\u308b", on_click=_show_chinitsu_answer, width="stretch")
    with action_cols[2]:
        st.button("\u30ea\u30bb\u30c3\u30c8", on_click=_reset_chinitsu_answer, width="stretch")
    with action_cols[3]:
        st.button("\u6b21\u306e\u554f\u984c", on_click=_guarded_next_chinitsu_question, width="stretch")

    if checked:
        is_correct = evaluate_wait_answer(correct_waits, selected)
        if is_correct:
            st.markdown('<div class="answer-result answer-correct">\u3007\u6b63\u89e3\uff01</div>', unsafe_allow_html=True)
        else:
            st.markdown('<div class="answer-result answer-wrong">\u00d7\u4e0d\u6b63\u89e3\u2026</div>', unsafe_allow_html=True)

    if checked or show_answer:
        st.write("\u6b63\u89e3")
        _show_chinitsu_tile_row(correct_waits, width=46, suit=suit)
        if checked and evaluate_wait_answer(correct_waits, selected):
            st.button("\u6b21\u3078", on_click=_next_chinitsu_question, width="stretch")


def _generated_chinitsu_mode() -> None:
    if "generated_chinitsu_answer" not in st.session_state:
        st.session_state.generated_chinitsu_answer = []
    if "generated_chinitsu_checked" not in st.session_state:
        st.session_state.generated_chinitsu_checked = False
    if "generated_chinitsu_show_answer" not in st.session_state:
        st.session_state.generated_chinitsu_show_answer = False
    if "generated_chinitsu_history" not in st.session_state:
        st.session_state.generated_chinitsu_history = []
    if "generated_chinitsu_question" not in st.session_state:
        st.session_state.generated_chinitsu_question = None

    _show_mode_header("\u6e05\u4e00\u8272\u5f85\u3061\u30c8\u30ec\u30fc\u30cb\u30f3\u30b0", "\u81ea\u52d5\u751f\u6210", "chinitsu")

    suit_label = st.radio(
        "\u8868\u793a",
        ["\u842c\u5b50", "\u7b52\u5b50", "\u7d22\u5b50"],
        index=2,
        horizontal=True,
        key="generated_chinitsu_suit_label",
    )
    suit = {"\u842c\u5b50": "m", "\u7b52\u5b50": "p", "\u7d22\u5b50": "s"}[suit_label]

    if st.session_state.generated_chinitsu_question is None:
        _new_generated_chinitsu_question()

    question = st.session_state.generated_chinitsu_question
    selected = tuple(st.session_state.generated_chinitsu_answer)
    checked = bool(st.session_state.generated_chinitsu_checked)
    show_answer = bool(st.session_state.generated_chinitsu_show_answer)

    st.caption("\u81ea\u52d5\u751f\u6210\u3057\u305f13\u679a\u306e\u5f85\u3061\u724c\u3092\u3059\u3079\u3066\u9078\u3093\u3067\u304f\u3060\u3055\u3044\u3002")
    st.subheader("\u554f\u984c")
    with st.container(key="generated_chinitsu_hand_tiles"):
        key_prefix = hand_key(question.hand)
        for index, rank in enumerate(chinitsu_tiles(question.hand)):
            _tile_button(
                _chinitsu_tile_name(rank, suit),
                f"generated-chinitsu-hand-{key_prefix}-{index}-{rank}",
                lambda tile: None,
                disabled=True,
            )

    st.subheader("\u5f85\u3061\u724c")
    _show_generated_chinitsu_answer_palette(suit)

    st.caption("\u9078\u629e\u4e2d")
    _show_chinitsu_tile_row(selected, width=42, suit=suit)

    action_cols = st.columns([1, 1, 1, 1, 4])
    with action_cols[0]:
        st.button(
            "\u6c7a\u5b9a",
            on_click=_check_generated_chinitsu_answer,
            width="stretch",
            disabled=not selected,
        )
    with action_cols[1]:
        st.button("\u7b54\u3048\u3092\u898b\u308b", on_click=_show_generated_chinitsu_answer, width="stretch")
    with action_cols[2]:
        st.button("\u30ea\u30bb\u30c3\u30c8", on_click=_reset_generated_chinitsu_answer, width="stretch")
    with action_cols[3]:
        st.button("\u6b21\u306e\u554f\u984c", on_click=_guarded_new_generated_chinitsu_question, width="stretch")

    if checked:
        is_correct = evaluate_wait_answer(question.waits, selected)
        if is_correct:
            st.markdown('<div class="answer-result answer-correct">\u3007\u6b63\u89e3\uff01</div>', unsafe_allow_html=True)
        else:
            st.markdown('<div class="answer-result answer-wrong">\u00d7\u4e0d\u6b63\u89e3\u2026</div>', unsafe_allow_html=True)

    if checked or show_answer:
        st.write("\u6b63\u89e3")
        _show_chinitsu_tile_row(question.waits, width=46, suit=suit)

        stat_cols = st.columns(2)
        with stat_cols[0]:
            st.metric("\u5f85\u3061\u7a2e\u985e\u6570", f"{question.wait_count}\u7a2e")
        with stat_cols[1]:
            st.metric("\u6b8b\u308a\u679a\u6570", f"{sum(question.remaining_tiles.values())}\u679a")

        st.caption("\u5f85\u3061\u5225\u306e\u6b8b\u308a\u679a\u6570")
        for rank in question.waits:
            cols = st.columns([0.25, 0.7, 5])
            with cols[0]:
                st.image(tile_image_path(_chinitsu_tile_name(rank, suit)), width=34)
            with cols[1]:
                st.write(f"{question.remaining_tiles[rank]}\u679a")

        if checked and evaluate_wait_answer(question.waits, selected):
            st.button("\u6b21\u3078", on_click=_new_generated_chinitsu_question, width="stretch")


if "hand_input" not in st.session_state:
    st.session_state.hand_input = DEFAULT_HAND
if "score_hand_input" not in st.session_state:
    st.session_state.score_hand_input = ""
if "score_melds" not in st.session_state:
    st.session_state.score_melds = []
if "score_result" not in st.session_state:
    st.session_state.score_result = None
if "score_winning_tile" not in st.session_state:
    st.session_state.score_winning_tile = None
if "score_meld_error" not in st.session_state:
    st.session_state.score_meld_error = None
if "score_show_meld_form" not in st.session_state:
    st.session_state.score_show_meld_form = False
if "chinitsu_question_index" not in st.session_state:
    st.session_state.chinitsu_question_index = 0
if "chinitsu_answer" not in st.session_state:
    st.session_state.chinitsu_answer = []
if "chinitsu_checked" not in st.session_state:
    st.session_state.chinitsu_checked = False
if "chinitsu_show_answer" not in st.session_state:
    st.session_state.chinitsu_show_answer = False
if "generated_chinitsu_answer" not in st.session_state:
    st.session_state.generated_chinitsu_answer = []
if "generated_chinitsu_checked" not in st.session_state:
    st.session_state.generated_chinitsu_checked = False
if "generated_chinitsu_show_answer" not in st.session_state:
    st.session_state.generated_chinitsu_show_answer = False
if "generated_chinitsu_history" not in st.session_state:
    st.session_state.generated_chinitsu_history = []
if "generated_chinitsu_question" not in st.session_state:
    st.session_state.generated_chinitsu_question = None

_show_styles()
st.title(APP_TITLE)

mode = st.radio(
    "\u30e2\u30fc\u30c9",
    [
        "\u724c\u7406\u30c1\u30a7\u30c3\u30ab\u30fc",
        "\u5fa9\u7fd2\u30e2\u30fc\u30c9",
        "\u70b9\u6570\u8a08\u7b97",
        "\u6e05\u4e00\u8272\u5f85\u3061\u5f53\u3066",
        "\u6e05\u4e00\u8272\u81ea\u52d5\u751f\u6210",
    ],
    horizontal=True,
)

if mode == "\u724c\u7406\u30c1\u30a7\u30c3\u30ab\u30fc":
    _checker_mode()
elif mode == "\u5fa9\u7fd2\u30e2\u30fc\u30c9":
    _review_mode()
elif mode == "\u70b9\u6570\u8a08\u7b97":
    _scoring_mode()
elif mode == "\u6e05\u4e00\u8272\u5f85\u3061\u5f53\u3066":
    _chinitsu_mode()
else:
    _generated_chinitsu_mode()
