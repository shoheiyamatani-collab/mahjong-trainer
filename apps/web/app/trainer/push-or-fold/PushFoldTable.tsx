"use client";

import React, { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { X, ZoomIn } from "lucide-react";
import type { RiverTile } from "@mahjong-trainer/tenhou-analysis/types";
import { TileStrip, getTileName, tileAssetName } from "../../components/TileFigures";
import { seats, type PushFoldPlayer, type PushFoldQuestion, type Wind } from "./pushFoldTypes";
import styles from "./pushFold.module.css";

const tableSeats = [
  { position: "bottom", relative: "自分", rotation: 0 },
  { position: "right", relative: "下家", rotation: -90 },
  { position: "top", relative: "対面", rotation: 180 },
  { position: "left", relative: "上家", rotation: 90 }
] as const;

export function getPushFoldTableSeat(self: Wind, seat: Wind) {
  return tableSeats[(seats.indexOf(seat) - seats.indexOf(self) + 4) % 4]!;
}

export function pushFoldRiverRows(river: RiverTile[]) {
  return Array.from({ length: Math.ceil(river.length / 6) }, (_, row) => river.slice(row * 6, row * 6 + 6));
}

function attackLabel(player: PushFoldPlayer) {
  return player.riichi ? `リーチ・${player.riichi.turn}打目` : player.attacking ? "副露の攻撃" : "リーチなし";
}

function RiverTiles({ player, expanded = false }: { player: PushFoldPlayer; expanded?: boolean }) {
  return <div className={styles.tableRiverBank} data-testid={`table-river-${player.seat}`}>
    {pushFoldRiverRows(player.river).map((row, index) => <ol className={styles.riverRow} key={index} aria-label={`${player.seat}家・${index + 1}段目`}>
      {row.map((discard) => {
        const name = getTileName(tileAssetName(discard.tile.tile, discard.tile.red));
        const called = discard.calledBy !== null;
        const label = `${discard.turn}打目・${name}・${discard.tsumogiri ? "ツモ切り" : "手出し"}${discard.riichi ? "・リーチ宣言" : ""}${called ? `・${seats[discard.calledBy!]}家が鳴いた牌` : ""}`;
        return <li key={discard.tile.id} className={`${styles.riverTile} ${discard.riichi ? styles.declaration : ""} ${called ? styles.called : ""}`} title={label} aria-label={label} data-tile-id={discard.tile.id}>
          <div className={styles.riverTileFace}>
            {called && !expanded ? <span className={styles.calledSlot} aria-hidden="true">鳴</span> : <TileStrip tiles={[tileAssetName(discard.tile.tile, discard.tile.red)]} compact />}
          </div>
          <span className={styles.riverTileType} aria-hidden="true">{discard.riichi ? "立" : called ? "鳴" : discard.tsumogiri ? "ツ" : "手"}</span>
        </li>;
      })}
    </ol>)}
    {!player.river.length ? <span className={styles.emptyRiver}>捨て牌なし</span> : null}
  </div>;
}

function PlayerMelds({ player }: { player: PushFoldPlayer }) {
  return <>{player.melds.map((meld, index) => <div className={styles.tableMeld} key={index}>
    <span>{meld.kind === "chi" ? "チー" : "ポン"}・{seats[meld.from]}家から</span>
    <TileStrip tiles={meld.tiles.map((tile) => tileAssetName(tile.tile, tile.red))} compact />
  </div>)}</>;
}

export function PushFoldTable({ question: q }: { question: PushFoldQuestion }) {
  const [selectedSeat, setSelectedSeat] = useState<Wind | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const dialogId = useId();
  const selected = q.players.find((player) => player.seat === selectedSeat);
  const rows = Math.max(3, ...q.players.map((player) => Math.ceil(player.river.length / 6)));
  useEffect(() => {
    if (selectedSeat && dialogRef.current && !dialogRef.current.open) dialogRef.current.showModal();
  }, [selectedSeat]);

  return <figure className={styles.tableFigure} aria-label="麻雀卓・各家の捨て牌と攻撃状態">
    <div className={styles.tableContainer}>
      <div className={styles.tableSurface} style={{ "--river-rows": rows } as CSSProperties} data-testid="push-fold-table">
        <div className={styles.tableCenter} aria-label="局の情報">
          <strong>{q.roundWind}{q.roundNumber}局</strong><span>{q.turn}巡目</span>
          <small>{q.honba}本場<br />供託{q.riichiSticks}本</small>
        </div>
        {q.players.map((player) => {
          const seat = getPushFoldTableSeat(q.seatWind, player.seat);
          return <section key={player.seat} className={styles.tableSeat} data-table-position={seat.position} data-seat={player.seat} style={{ "--river-angle": `${seat.rotation}deg` } as CSSProperties} aria-label={`${player.seat}家・${seat.relative}の河`}>
            <header className={styles.tablePlayerHeader}>
              <div><h3><span>{player.seat}家・{seat.relative}</span>{player.seat === "東" ? <small>親</small> : null}</h3><p className={player.riichi || player.attacking ? styles.tableAttack : ""}>{attackLabel(player)}</p></div>
              <button type="button" className={styles.riverZoomButton} aria-label={`${player.seat}家・${seat.relative}の捨て牌を拡大`} title={`${player.seat}家の捨て牌を拡大`} onClick={() => setSelectedSeat(player.seat)}><ZoomIn aria-hidden="true" /></button>
            </header>
            <div className={styles.tableRiverFrame}><RiverTiles player={player} /></div>
          </section>;
        })}
      </div>
    </div>
    <figcaption className={styles.tableLegend}><span><b>手</b>手出し</span><span><b>ツ</b>ツモ切り</span><span><b>立</b>リーチ宣言</span><span><b>鳴</b>鳴かれた牌</span></figcaption>
    {q.players.some((player) => player.melds.length) ? <div className={styles.tableMelds} aria-label="各家の副露">{q.players.filter((player) => player.melds.length).map((player) => <div key={player.seat}><strong>{player.seat}家・{getPushFoldTableSeat(q.seatWind, player.seat).relative}</strong><PlayerMelds player={player} /></div>)}</div> : null}
    <dialog className={styles.tableDialog} ref={dialogRef} aria-labelledby={`${dialogId}-title`} onClose={() => setSelectedSeat(null)} onKeyDown={(event) => {
      if (event.key !== "Tab") return;
      const controls = [...event.currentTarget.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input, select, textarea, [tabindex="0"]')];
      const first = controls[0], last = controls.at(-1);
      if (event.shiftKey && document.activeElement === first || !event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        (event.shiftKey ? last : first)?.focus();
      }
    }} onClick={(event) => {
      const bounds = event.currentTarget.getBoundingClientRect();
      if (event.target === event.currentTarget && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialogRef.current?.close();
    }}>
      {selected ? <><header className={styles.dialogHeader}><div><h2 id={`${dialogId}-title`}>{selected.seat}家・{getPushFoldTableSeat(q.seatWind, selected.seat).relative}{selected.seat === "東" ? "（親）" : ""}</h2><p>{attackLabel(selected)}{selected.attacking && !selected.riichi ? "・テンパイ不明" : ""}</p></div><button type="button" onClick={() => dialogRef.current?.close()} aria-label="閉じる" title="閉じる"><X aria-hidden="true" /></button></header>
        <div className={styles.zoomRiver}><RiverTiles player={selected} expanded /></div><div className={styles.zoomMelds}><PlayerMelds player={selected} /></div>
      </> : null}
    </dialog>
  </figure>;
}
