from __future__ import annotations

import base64
from functools import lru_cache
from pathlib import Path


IMAGE_DIR = Path(__file__).resolve().parent / "pai_illustration"
IMAGE_SUFFIX = "-66-90-l-emb.png"
HONOR_IMAGE_NUMBERS = {
    "\u6771": 1,
    "\u5357": 2,
    "\u897f": 3,
    "\u5317": 4,
    "\u767d": 5,
    "\u767c": 6,
    "\u4e2d": 7,
}


def tile_image_path(tile: str) -> Path:
    """Return the illustration path for a 34-type tile name."""
    stem = _image_stem(tile)
    path = IMAGE_DIR / f"{stem}{IMAGE_SUFFIX}"
    if not path.exists():
        raise FileNotFoundError(f"No tile illustration found for {tile}: {path}")
    return path


def tile_image_paths(tiles: list[str] | tuple[str, ...]) -> list[Path]:
    return [tile_image_path(tile) for tile in tiles]


@lru_cache(maxsize=34)
def tile_image_data_uri(tile: str) -> str:
    image_bytes = tile_image_path(tile).read_bytes()
    encoded = base64.b64encode(image_bytes).decode("ascii")
    return f"data:image/png;base64,{encoded}"


def _image_stem(tile: str) -> str:
    if tile.endswith("m"):
        return f"man{tile[0]}"
    if tile.endswith("p"):
        return f"pin{tile[0]}"
    if tile.endswith("s"):
        return f"sou{tile[0]}"

    normalized = _normalize_honor(tile)
    if normalized in HONOR_IMAGE_NUMBERS:
        return f"ji{HONOR_IMAGE_NUMBERS[normalized]}"

    raise ValueError(f"Unknown tile for image mapping: {tile}")


def _normalize_honor(tile: str) -> str:
    # Reuse the parser's normalization rules without exposing its alias table.
    return "\u767c" if tile == "\u767a" else tile
