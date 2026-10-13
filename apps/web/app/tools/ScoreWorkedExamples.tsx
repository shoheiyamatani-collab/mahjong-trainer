import { countsToTiles, parseHand, removeTile } from "@mahjong-trainer/mahjong-core";
import { TileStrip, getTileName, tileAssetName } from "../components/TileFigures";
import { getScoreLearningResults } from "./toolLearningResults";
import styles from "./tool-learning.module.css";

export function ScoreWorkedExamples() {
  return <div className={styles.scoreExamples}>{getScoreLearningResults().map((example, index) => {
    const { input, result } = example;
    const hand = countsToTiles(removeTile(parseHand(example.handText), input.winningTile));
    const winningAsset = tileAssetName(input.winningTile);
    return <article className={styles.workedExample} key={example.id}>
      <p className={styles.kicker}>計算例 {index + 1} ・ {example.label}</p>
      <h3>{example.title}</h3>
      <p>東場・南家（子）、{input.winMethod === "ron" ? "ロン" : "ツモ"}、リーチ{input.riichi ? "あり" : "なし"}・一発なし、ドラ0、{input.honba}本場・供託{input.riichiSticks}本。</p>
      <div className={styles.pose}>
        <div><strong>和了前の{hand.length}枚</strong><div className={styles.hand}><TileStrip tiles={hand.map((tile) => tileAssetName(tile))} /></div></div>
        {input.melds?.map((meld, meldIndex) => <div key={meldIndex}><strong>副露：白のポン</strong><TileStrip tiles={meld.tiles.map((tile) => tileAssetName(tile))} /></div>)}
        <div><strong>和了牌：{getTileName(winningAsset)}</strong><TileStrip tiles={[winningAsset]} /></div>
      </div>
      <p>{example.explanation}</p>
      <dl className={styles.resultList}>
        <div><dt>役と翻</dt><dd>{result.yaku.map((yaku) => `${yaku.name}${yaku.han}翻`).join("・")} ／ 計{result.score.han}翻</dd></div>
        <div><dt>符</dt><dd>{result.fu?.items.map((item) => `${item.label}：${item.fu}符`).join(" ＋ ")} → {result.fu?.roundedFu}符</dd></div>
        <div><dt>支払い</dt><dd>{result.score.payments.map((payment) => `${payment.label} ${payment.points.toLocaleString("ja-JP")}点`).join(" ／ ")}{input.winMethod === "tsumo" ? "（子は2人分）" : ""}</dd></div>
        <div><dt>受け取り合計</dt><dd><strong>{result.score.totalPoints.toLocaleString("ja-JP")}点</strong>{input.riichiSticks ? "（供託込み）" : ""}</dd></div>
      </dl>
      <a className={styles.tryLink} href={`/tools?example=${example.id}#score-workspace`}>計算例{index + 1}を点数計算へ読み込む</a>
    </article>;
  })}</div>;
}
