import type { HandScoreMeld, Tile } from "@mahjong-trainer/mahjong-core";
import { TileStrip, getTileName, tileAssetName } from "../../components/TileFigures";
import { actionLabels, type CallBranchAnalysis, type CallQuestion, type Tradeoff } from "./callModel";
import styles from "./call.module.css";

export const callTileName = (tile: Tile) => getTileName(tileAssetName(tile));
export const callStage = (shanten: number) => shanten === 0 ? "テンパイ" : `${shanten}シャンテン`;
export type PreparedCallQuestion = { question: CallQuestion; multipleChiForms?: boolean; comparison: { pass: CallBranchAnalysis; calls: Array<{ option: CallQuestion["options"][number]; analysis: CallBranchAnalysis }> } };

export function CallHand({ hand, melds = [] }: { hand: Tile[]; melds?: HandScoreMeld[] }) {
  return <div className={styles.hand}>
    <TileStrip tiles={hand.map((tile) => tileAssetName(tile))} />
    {melds.length ? <div className={styles.melds}>{melds.map((meld, index) => <div key={index}><span>{meld.kind === "pon" ? "ポン" : "チー"}</span><TileStrip tiles={meld.tiles.map((tile) => tileAssetName(tile))} compact /></div>)}</div> : null}
  </div>;
}

function Branch({ title, analysis, tradeoff, discard }: { title: string; analysis: CallBranchAnalysis; tradeoff: Tradeoff; discard?: Tile }) {
  return <section className={styles.branch}>
    <h3>{title}</h3>
    {discard ? <p className={styles.small}>鳴いた後に切る牌：<strong>{callTileName(discard)}</strong></p> : null}
    <CallHand hand={analysis.hand} melds={analysis.melds} />
    <div className={styles.metrics}><strong>{callStage(analysis.shanten)}</strong><span>{analysis.shanten === 0 ? "待ち" : "有効牌"} {analysis.ukeire.length}種・残り上限 {analysis.ukeireCount}枚</span></div>
    {analysis.ukeire.length ? <div className={styles.effective}><TileStrip tiles={analysis.ukeire.map((item) => tileAssetName(item.tile))} compact /><span>{analysis.ukeire.map((item) => `${callTileName(item.tile)}${item.remaining}枚`).join(" / ")}</span></div> : <p className={styles.small}>現在の待ちに残っている牌はありません。</p>}
    {analysis.furiten ? <p className={styles.warning}>フリテン：この待ちでは全ての牌でロンできません。役があればツモは可能です。</p> : null}
    {analysis.values.length ? <dl className={styles.values}>{analysis.values.map((value) => <div key={value.tile}><dt>{callTileName(value.tile)}でアガリ</dt><dd>ロン {value.ron ? `${value.ron.points.toLocaleString()}点（${value.ron.han}翻${value.ron.fu ?? ""}符）` : analysis.furiten ? "不可・フリテン" : "不可・役なし"}<br />ツモ合計 {value.tsumo ? `${value.tsumo.points.toLocaleString()}点` : "不可・役なし"}{value.ron?.yaku.length ? <span className={styles.small}>{value.ron.yaku.join("・")}</span> : null}</dd></div>)}</dl> : null}
    <dl className={styles.tradeoffs}><div><dt>打点の見方</dt><dd>{tradeoff.valuePlan}</dd></div><div><dt>メリット</dt><dd>{tradeoff.merit}</dd></div><div><dt>デメリット</dt><dd>{tradeoff.risk}</dd></div></dl>
  </section>;
}

export function CallComparison({ prepared }: { prepared: PreparedCallQuestion }) {
  return <div className={styles.comparison}>
    {prepared.comparison.calls.map(({ option, analysis }) => <Branch key={option.action} title={`${actionLabels[option.action]}した場合`} analysis={analysis} tradeoff={option} discard={option.discard} />)}
    <Branch title="スルーした場合" analysis={prepared.comparison.pass} tradeoff={prepared.question.pass} />
  </div>;
}
