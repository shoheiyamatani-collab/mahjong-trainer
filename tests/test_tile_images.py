from mahjong.tile_images import tile_image_path
from mahjong.tiles import TILE_NAMES


def test_tile_image_paths_exist_for_all_34_tiles():
    missing = [tile for tile in TILE_NAMES if not tile_image_path(tile).exists()]

    assert missing == []
