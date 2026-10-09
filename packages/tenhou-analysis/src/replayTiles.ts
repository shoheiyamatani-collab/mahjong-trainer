import { tileName } from "@mahjong-trainer/mahjong-core";
import type { ReplayTile } from "./types";

export function replayTile(id: number, redFives = true): ReplayTile {
  if (!Number.isInteger(id) || id < 0 || id > 135) throw new Error(`牌の個体IDが不正です: ${id}`);
  return { id, tile: tileName(Math.floor(id / 4)), red: redFives && [16, 52, 88].includes(id) };
}
