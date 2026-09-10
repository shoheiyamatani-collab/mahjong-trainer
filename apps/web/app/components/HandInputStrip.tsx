import type { ReactNode } from "react";
import type { Tile } from "@mahjong-trainer/mahjong-core";
import styles from "./HandInputStrip.module.css";

interface HandInputStripProps {
  tiles: readonly Tile[];
  imageSrc: (tile: Tile) => string;
  onRemove: (tile: Tile) => void;
  disabled?: boolean;
  status?: ReactNode;
}

export function HandInputStrip({ tiles, imageSrc, onRemove, disabled, status }: HandInputStripProps) {
  return (
    <div className={styles.frame}>
      {status !== undefined ? <div className={styles.status}>{status}</div> : null}
      <div className={styles.canvas} role="group" aria-label="入力済みの手牌">
        {/* Reserve every slot, including when empty, so input never moves the palette. */}
        <div className={styles.slots}>
          {Array.from({ length: 14 }, (_, index) => {
            const tile = tiles[index];
            return tile ? (
              <button
                className={styles.tile}
                type="button"
                key={index}
                onClick={() => onRemove(tile)}
                aria-label={`${tile}を外す`}
                disabled={disabled}
              >
                <img src={imageSrc(tile)} alt={tile} width={66} height={90} />
              </button>
            ) : <span className={styles.slot} key={index} aria-hidden="true" />;
          })}
        </div>
        {tiles.length === 0 ? <span className={styles.empty}>牌を追加してください</span> : null}
      </div>
    </div>
  );
}
