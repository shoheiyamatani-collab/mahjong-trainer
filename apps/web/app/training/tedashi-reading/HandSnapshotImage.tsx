"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Download } from "lucide-react";
import type { ReplayMeld, ReplayTile } from "@mahjong-trainer/tenhou-analysis/types";
import { getTileName, tileAssetName } from "../../components/TileFigures";
import styles from "./tedashi.module.css";

const meldLabels = { chi: "チー", pon: "ポン", ankan: "暗槓", daiminkan: "大明槓", kakan: "加槓" };
const tileImages = new Map<string, Promise<HTMLImageElement>>();
const snapshots = new Map<string, string>();
const padding = 16;
const tileWidth = 56;
const tileHeight = tileWidth * 90 / 66;
const gap = 4;

function loadTile(tile: ReplayTile): Promise<HTMLImageElement> {
  const asset = tileAssetName(tile.tile, tile.red);
  const cached = tileImages.get(asset);
  if (cached) return cached;
  const result = new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => { tileImages.delete(asset); reject(new Error(`Tile image unavailable: ${asset}`)); };
    image.src = `/tiles/${asset}-66-90-l-emb.png`;
  });
  tileImages.set(asset, result);
  return result;
}

function layout(tiles: ReplayTile[], melds: ReplayMeld[]) {
  const rowWidth = (count: number) => count * tileWidth + Math.max(0, count - 1) * gap;
  const groups: Array<{ meld: ReplayMeld; x: number; y: number }> = [];
  const y = padding + (melds.length ? 24 : 0);
  let x = padding + rowWidth(tiles.length);
  for (const meld of melds) {
    if (x > padding) x += 16;
    groups.push({ meld, x, y });
    x += rowWidth(meld.tiles.length);
  }
  return { groups, width: Math.ceil(Math.max(x + padding, tileWidth + padding * 2)), height: Math.ceil(y + tileHeight + padding), y };
}

async function renderSnapshot(tiles: ReplayTile[], melds: ReplayMeld[], key: string) {
  const cached = snapshots.get(key);
  if (cached) return cached;
  await Promise.all([...tiles, ...melds.flatMap((meld) => meld.tiles)].map(loadTile));
  const { groups, width, height, y } = layout(tiles, melds);
  const canvas = document.createElement("canvas");
  canvas.width = width * 2;
  canvas.height = height * 2;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas is unavailable");
  context.scale(2, 2);
  context.fillStyle = "#f4f8f5";
  context.fillRect(0, 0, width, height);
  const drawTiles = async (row: ReplayTile[], x: number, y: number) => {
    const images = await Promise.all(row.map(loadTile));
    images.forEach((image, index) => context.drawImage(image, x + index * (tileWidth + gap), y, tileWidth, tileHeight));
  };
  await drawTiles(tiles, padding, y);
  context.fillStyle = "#315343";
  context.font = "600 17px sans-serif";
  context.textBaseline = "top";
  for (const group of groups) {
    context.fillText(meldLabels[group.meld.kind], group.x, padding);
    await drawTiles(group.meld.tiles, group.x, group.y);
  }
  const result = canvas.toDataURL("image/png");
  if (snapshots.size >= 128) snapshots.delete(snapshots.keys().next().value!);
  snapshots.set(key, result);
  return result;
}

export function HandSnapshotImage({ tiles, melds, filename, fallback }: { tiles: ReplayTile[]; melds: ReplayMeld[]; filename: string; fallback: ReactNode }) {
  const key = JSON.stringify(["single-row", tiles, melds]);
  const [image, setImage] = useState<{ key: string; src: string } | null>(null);
  const src = image?.key === key ? image.src : null;
  useEffect(() => {
    let cancelled = false;
    renderSnapshot(tiles, melds, key).then((result) => {
      if (!cancelled) setImage({ key, src: result });
    }).catch(() => { if (!cancelled) setImage(null); });
    return () => { cancelled = true; };
  }, [key, tiles, melds]);
  const { width, height } = layout(tiles, melds);
  const names = (row: ReplayTile[]) => row.map((tile) => getTileName(tileAssetName(tile.tile, tile.red))).join("、");
  const description = `手牌${tiles.length}枚：${names(tiles)}${melds.map((meld) => `。${meldLabels[meld.kind]}：${names(meld.tiles)}`).join("")}`;
  return <div className={styles.snapshot} style={{ maxWidth: width }}>
    <div className={styles.snapshotSurface} style={{ aspectRatio: `${width} / ${height}` }}>
      {src ? <img className={styles.snapshotImage} src={src} width={width * 2} height={height * 2} alt={description} /> : fallback}
    </div>
    {src ? <a className={styles.snapshotDownload} href={src} download={`${filename}.png`} aria-label="この牌姿をPNG画像で保存" title="この牌姿をPNG画像で保存"><Download size={18} aria-hidden="true" /></a> : null}
  </div>;
}
