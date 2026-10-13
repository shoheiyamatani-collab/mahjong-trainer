import { countsToTiles, parseHand, tileIndex } from "@mahjong-trainer/mahjong-core";
import { TileStrip, getTileName, tileAssetName } from "../../components/TileFigures";
import { CHECKER_SAMPLE_HAND } from "../../tools/toolLearningExamples";
import { getCheckerLearningResults } from "../../tools/toolLearningResults";
import styles from "../../tools/tool-learning.module.css";

export function CheckerWorkedExample() {
  const counts = parseHand(CHECKER_SAMPLE_HAND);
  const results = getCheckerLearningResults();
  const best = results[0]!;
  const after = counts.slice();
  after[tileIndex(best.discard)] = after[tileIndex(best.discard)]! - 1;
  const comparison = results.find((item) => item.discard === "3m")!;
  const wider = results.find((item) => item.discard === "4m")!;
  const handHref = `/analysis/mahjong-tool?hand=${encodeURIComponent(counts.join(","))}#checker-workspace`;
  return <div className={styles.workedExample}>
    <h3>14枚の実例：枚数の前に、シャンテン数をそろえる</h3>
    <p>まず1筒・4筒・3萬を切る候補を予想してから、表と見比べてください。副露なしの学習用牌姿です。</p>
    <div className={styles.hand}><TileStrip tiles={countsToTiles(counts).map((tile) => tileAssetName(tile))} /></div>
    <table className={styles.comparisonTable}>
      <caption>同じ14枚を切り分けた結果</caption>
      <thead><tr><th scope="col">打牌</th><th scope="col">進行</th><th scope="col">受け入れ</th><th scope="col">良形率</th></tr></thead>
      <tbody>{results.map((result) => <tr key={result.discard}>
        <th scope="row">{getTileName(tileAssetName(result.discard))}</th>
        <td>{result.afterDiscardShanten === 1 ? "一向聴" : "二向聴"}</td>
        <td>{result.ukeireTypes}種・{result.ukeireTiles}枚</td>
        <td>{result.isIishanten ? `${Math.round(result.goodShapeRate * 100)}%` : "対象外"}</td>
      </tr>)}</tbody>
    </table>
    <ol className={styles.readingSteps}>
      <li><strong>進行が同じ候補から比べる。</strong> 4萬切りは{wider.ukeireTiles}枚ですが、二向聴に戻ります。一向聴からテンパイする受け入れとは意味が違うため、枚数だけで上位と判断しません。</li>
      <li><strong>1筒切りと4筒切りは、この指標では同率。</strong> 1234筒から234筒、または123筒を残し、萬子・索子の3456の変化を使えます。3萬切りの{comparison.ukeireTiles}枚と比べると、受け入れは{best.ukeireTiles - comparison.ukeireTiles}枚増えます。</li>
      <li><strong>良形率はアガリ率ではない。</strong> 1筒切りでは、テンパイに進む{best.ukeireTiles}枚のうち{best.goodShapeTiles}枚分が、最も広い待ちを選ぶとアガリ牌5枚以上のテンパイになります。{best.goodShapeTiles}÷{best.ukeireTiles}を丸めて{Math.round(best.goodShapeRate * 100)}%。超良形率は9枚以上を基準にした{Math.round(best.superGoodShapeRate * 100)}%です。</li>
    </ol>
    <h4>1筒を切った後の有効牌と枚数</h4>
    <ul className={styles.effectiveTiles} aria-label="1筒切りの有効牌と理論枚数">{best.ukeire.map((tile) => {
      const asset = tileAssetName(tile);
      return <li key={tile}><img src={`/tiles/${asset}-66-90-l-emb.png`} alt={getTileName(asset)} width={66} height={90} /><span>{4 - after[tileIndex(tile)]!}枚</span></li>;
    })}</ul>
    <p>各牌は4枚から手牌で使っている枚数を引いた理論値です。河・副露・ドラ表示牌や他家の所持牌は反映していません。実際の山に54枚あるという意味ではありません。</p>
    <a className={styles.tryLink} href={handHref}>この14枚を牌理チェッカーへ入力する</a>
  </div>;
}
