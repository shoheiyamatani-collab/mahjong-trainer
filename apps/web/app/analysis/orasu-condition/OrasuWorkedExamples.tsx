import { ORASU_SEATS, calculateOrasuConditions, formatOrasuCandidate } from "@mahjong-trainer/mahjong-core";
import { orasuExamples } from "./orasuExamples";
import styles from "./orasu-condition.module.css";

const labels = { east: "東家（親）", south: "南家（自分）", west: "西家", north: "北家" };
const points = (value: number) => value.toLocaleString("ja-JP");

export default function OrasuWorkedExamples() {
  return <div className={styles.workedExamples}>{orasuExamples.map((example, index) => {
    const result = calculateOrasuConditions(example.input);
    const focus = result.ron[example.focusSeat];
    if (!focus) throw new Error(`Learning example has no winning route: ${example.id}`);
    return <article key={example.id} id={`example-${example.id}`}>
      <p className={styles.kicker}>計算例 {index + 1}</p>
      <h3>{example.title}</h3>
      <p>自分は南家。目標は{example.input.targetRank === 1 ? "トップ" : "2着以内"}、{example.input.honba}本場・供託{example.input.riichiSticks}本、{example.input.tiePolicy === "strict" ? "同点では未達" : "同点で達成"}。</p>
      <p>{example.explanation}</p>
      <div className={styles.exampleColumns}>
        <table className={styles.exampleTable}>
          <caption>{labels[example.focusSeat]}からロンした場合の点棒移動（点）</caption>
          <thead><tr><th scope="col">席</th><th scope="col">入力</th><th scope="col">精算後</th></tr></thead>
          <tbody>{ORASU_SEATS.map((seat) => <tr key={seat} className={seat === example.input.selfSeat ? styles.selfTableRow : undefined}>
            <th scope="row">{labels[seat]}</th><td>{points(example.input.scores[seat])}</td><td>{points(focus.postScores[seat])}</td>
          </tr>)}</tbody>
        </table>
        <dl className={styles.exampleRoutes}>
          {ORASU_SEATS.filter((seat) => seat !== example.input.selfSeat).map((seat) => <div key={seat}>
            <dt>{labels[seat]}から</dt><dd>{result.ron[seat] ? formatOrasuCandidate(result.ron[seat]!.candidate) : "単独役満でも届かない"}</dd>
          </div>)}
          <div><dt>ツモなら</dt><dd>{result.tsumo ? formatOrasuCandidate(result.tsumo.candidate) : "単独役満でも届かない"}</dd></div>
        </dl>
      </div>
      <p className={styles.exampleConclusion}><strong>南家の精算後は{points(focus.postScores.south)}点。</strong>
        {example.input.tiePolicy === "allow" && focus.postRanking.find((row) => row.seat === "south")?.tied ? "同点を認める設定で目標達成です。" : `目標の${example.input.targetRank === 1 ? "トップ" : "2着以内"}に届きます。`}
        アガリ点表示は本場・供託を除いた点数です。</p>
      <a className={styles.exampleLink} href={`?example=${example.id}#orasu-calculator`}>計算例{index + 1}を入力して試す</a>
    </article>;
  })}</div>;
}
