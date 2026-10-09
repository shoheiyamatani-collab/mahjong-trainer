"""Offline oracle; no reference-library code is shipped to the website."""
import importlib.metadata
import json
from pathlib import Path
import sys

reference_path = Path(sys.argv[1]).resolve()
sys.path.insert(0, str(reference_path))
import mahjong
from mahjong.hand_calculating.hand import HandCalculator
from mahjong.hand_calculating.hand_config import HandConfig, OptionalRules
from mahjong.meld import Meld

if not Path(mahjong.__file__).resolve().is_relative_to(reference_path):
    raise RuntimeError("The oracle must come from the isolated reference directory.")
if importlib.metadata.version("mahjong") != "2.0.0":
    raise RuntimeError("The oracle must be mahjong==2.0.0.")

honors = ["東", "南", "西", "北", "白", "發", "中"]


def tile_index(tile):
    if tile in honors:
        return 27 + honors.index(tile)
    return "mps".index(tile[1]) * 9 + int(tile[0]) - 1


def evaluate(case):
    source = case["input"]
    used = [0] * 34

    def allocate(index):
        if used[index] == 4:
            raise ValueError("Physical tile capacity exceeded.")
        value = index * 4 + used[index]
        used[index] += 1
        return value

    closed = [allocate(i) for i, count in enumerate(source["counts"]) for _ in range(count)]
    win_index = tile_index(source["winningTile"])
    win_tile = next(tile for tile in closed if tile // 4 == win_index)
    tiles = list(closed)
    melds = []
    for meld in source.get("melds", []):
        physical = [allocate(tile_index(tile)) for tile in meld["tiles"]]
        tiles.extend(physical)
        kind = {"chi": Meld.CHI, "pon": Meld.PON, "kan": Meld.KAN, "ankan": Meld.KAN}[meld["kind"]]
        melds.append(Meld(meld_type=kind, tiles=physical, opened=meld["kind"] != "ankan"))
    config = HandConfig(
        is_tsumo=source["winMethod"] == "tsumo", player_wind=tile_index(source["seatWind"]),
        round_wind=tile_index(source["roundWind"]), is_riichi=source.get("riichi", False),
        is_daburu_riichi=source.get("doubleRiichi", False), is_ippatsu=source.get("ippatsu", False),
        is_haitei=source.get("haitei", False), is_houtei=source.get("houtei", False),
        is_rinshan=source.get("rinshan", False), is_chankan=source.get("chankan", False),
        tsumi_number=source.get("honba", 0), kyoutaku_number=source.get("riichiSticks", 0),
        options=OptionalRules(has_open_tanyao=True, has_aka_dora=False, has_double_yakuman=source.get("doubleYakuman", False), kiriage=False),
    )
    result = HandCalculator.estimate_hand_value(tiles=tiles, win_tile=win_tile, melds=melds, config=config)
    if result.error:
        reason = {"no_yaku": "no-yaku", "hand_not_winning": "not-winning"}.get(result.error, "invalid-input")
        return {"status": "rejected", "reason": reason}
    cost = result.cost
    main = cost["main"] + cost["main_bonus"]
    additional = cost["additional"] + cost["additional_bonus"]
    payments = [main] if source["winMethod"] == "ron" or source["isDealer"] else [additional, main]
    yakuman = any(yaku.is_yakuman for yaku in result.yaku)
    return {"status": "accepted", "han": 0 if yakuman else result.han, "fu": None if yakuman else result.fu,
            "yakumanCount": result.han // 13 if yakuman else 0, "totalPoints": cost["total"], "payments": payments}


request = json.load(sys.stdin)
output = {"reference": "MahjongRepository/mahjong", "version": "2.0.0", "results": [{"id": case["id"], "expected": evaluate(case)} for case in request["cases"]]}
json.dump(output, sys.stdout, ensure_ascii=False, allow_nan=False)
