import { comboWaitKinds, tileName, type ComboInput, type ComboResult } from "@mahjong-trainer/mahjong-core";
import { TileStrip, tileAssetName, getTileName } from "../../components/TileFigures";
import { waitLabels } from "./comboModel";
import styles from "./combo.module.css";

export const comboTileName = (index: number) => getTileName(tileAssetName(tileName(index)));
export function ComboTiles({ tiles, compact = false }: { tiles: number[]; compact?: boolean }) {
  return <TileStrip tiles={tiles.map(tile => tileAssetName(tileName(tile)))} compact={compact} />;
}
export function ComboVisibleCounts({ input, targets }: { input: ComboInput; targets: number[] }) {
  const indexes = input.visibleCounts.map((count, i) => ({ count, i })).filter(({ count, i }) => count > 0 || targets.includes(i));
  return <div className={styles.visibleBank} aria-label="牌種別の見えている枚数">{indexes.map(({ count, i }) => <div key={i}><ComboTiles tiles={[i]} compact /><strong>{count}枚</strong>{input.model === "riichi" && (input.riichiRiver?.[i] ?? 0) > 0 ? <small>本人の河 {input.riichiRiver![i]}枚</small> : null}</div>)}<p className={styles.small}>ここにない牌は0枚見え（残り4枚）。赤5も通常の5と合わせて数えます。</p></div>;
}
export function ComboExplanation({ results, input }: { results: ComboResult[]; input: ComboInput }) {
  return <div className={styles.explanations}>{results.map(result => <section className={styles.explanation} key={result.target} aria-label={`${comboTileName(result.target)}の計算内訳`}>
    <h3><ComboTiles tiles={[result.target]} compact />{comboTileName(result.target)}の内訳</h3>
    <dl className={styles.breakdown}>{comboWaitKinds.map(kind => <div key={kind} data-combo-tone={kind === "ryanmen" ? "efficiency" : kind === "kanchan" || kind === "penchan" ? "training" : "waits"}><dt>{waitLabels[kind]}</dt><dd>{result.breakdown[kind]}<small>コンボ</small></dd></div>)}<div className={styles.total}><dt>合計</dt><dd>{result.total}<small>コンボ</small></dd></div></dl>
    <p className={styles.small}>愚形 {result.bad}コンボ ／ 縦待ち {result.vertical}コンボ。単純な合計であり、待ちの出現頻度で重み付けしていません。</p>
    <details className={styles.detail} open><summary>ターツと計算過程・除外理由</summary>{result.rows.map((row, index) => {
      const formula = row.kind === "shanpon" ? `${result.remaining} × (${result.remaining} − 1) ÷ 2` : row.kind === "tanki" ? `${result.remaining}` : row.remaining.join(" × ");
      const discarded = row.waits.filter(tile => (input.riichiRiver?.[tile] ?? 0) > 0).map(comboTileName).join("・");
      return <div className={styles.calculationRow} key={index} data-excluded={Boolean(row.excluded)}>
        <div><strong>{waitLabels[row.kind]}</strong><ComboTiles tiles={row.tiles} compact /><span className={styles.small}>形の待ち：{row.waits.map(comboTileName).join("・")}</span></div>
        <div><strong>{formula} = {row.rawCount}{row.excluded && row.rawCount > 0 ? ` → ${row.combos}` : ""} コンボ</strong>
          <p>{row.excluded === "furiten" ? `本人の河に${discarded}。この待ち全体がフリテンなのでロン用コンボから除外。` : row.excluded === "partner" ? "指定した相方は残り2枚未満。対子を作れません。" : row.excluded === "wall" ? row.kind === "shanpon" ? "対象牌が残り2枚未満なので対子を作れません。" : "必要な牌が足りず、この形は作れません。" : "見えていない物理牌の組み合わせを数えています。"}</p>
          {row.conditional ? <p className={styles.caution}>シャンポンの相方は未指定。別の対子や、その相方によるフリテンまでは証明していない条件付きの数です。</p> : null}
        </div>
      </div>;
    })}</details>
  </section>)}<p className={styles.caution}><strong>コンボ数は放銃率ではありません。</strong> 4面子1雀頭全体の成立、役、他の待ち、同巡・見逃しフリテンはこの局所モデルでは確定しません。七対子・国士・複雑な多面待ちは対象外です。</p></div>;
}
