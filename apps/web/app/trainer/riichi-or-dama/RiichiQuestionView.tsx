import { TileStrip, tileAssetName } from "../../components/TileFigures";
import { ORASU_SEATS } from "@mahjong-trainer/mahjong-core";
import { callTileName } from "../call-or-pass/CallQuestionView";
import { actionLabels, winds, type PreparedRiichiQuestion, type RiichiValue } from "./riichiModel";
import shared from "../call-or-pass/call.module.css";
import styles from "./riichi.module.css";

function valueText(value: RiichiValue) {
  return value.payments.length === 1 ? `${value.payments[0]!.points.toLocaleString()}点${value.payments[0]!.label === "子全員" ? "オール" : ""}` : `${value.payments[0]!.points.toLocaleString()} / ${value.payments[1]!.points.toLocaleString()}点（子 / 親）`;
}

function Value({ label, value, blocked }: { label: string; value: RiichiValue | null; blocked?: string | null }) {
  return <div><dt>{label}</dt><dd>{value ? <><strong>{valueText(value)}</strong><span>{value.han}翻{value.fu ? ` ${value.fu}符` : ""} · {value.yaku.join("・")}</span></> : <strong className={styles.blocked}>{blocked}でロン不可</strong>}</dd></div>;
}

export function RiichiComparison({ prepared }: { prepared: PreparedRiichiQuestion }) {
  const q = prepared.question;
  return <div>
    <div className={styles.waitSummary}><strong>待ち {prepared.waits.length}種・上限 {prepared.liveCount}枚</strong><TileStrip tiles={prepared.waits.map((tile) => tileAssetName(tile))} compact />{prepared.furiten ? <span className={styles.blocked}>フリテン：どの待ちでもロン不可</span> : null}</div>
    <div className={shared.comparison}>{prepared.branches.map((branch) => <section className={shared.branch} key={branch.action} aria-label={`${actionLabels[branch.action]}の比較`}>
      <h3>{actionLabels[branch.action]}</h3>
      <p className={shared.small}>{branch.action === "riichi" ? "1,000点を供託。原則ツモ切りで、手を変えたりオリたりできません。" : "新しい供託なし。手変わりや守備への切り替えを残せます。"}</p>
      {!branch.available ? <p className={shared.warning}>宣言不可：{prepared.reasons.join(" ")}</p> : <>
        {branch.waits.map((wait) => <section className={styles.waitValue} key={wait.tile}>
          <h4><TileStrip tiles={[tileAssetName(wait.tile)]} compact /><span>{callTileName(wait.tile)}でアガリ <small>上限 {wait.remaining}枚{wait.remaining === 0 ? "・全て見え" : ""}</small></span></h4>
          <dl className={styles.scoreValues}><Value label="ロン" value={wait.ron} blocked={wait.ronBlocked} /><Value label="ツモ" value={wait.tsumo} /></dl>
        </section>)}
        {q.targetRank ? <details className={styles.outcomes}><summary>アガリ後の順位と{q.targetRank}着条件</summary><p className={shared.small}>本場なし。既存の供託{q.riichiSticks}本を加算。自分のリーチ棒は、自分のアガリなら戻ります。同点は条件達成に含めません。</p><table><caption>現在の待ちごとのアガリ結果</caption><thead><tr><th scope="col">アガリ牌</th><th scope="col">方法</th><th scope="col">自分の点棒</th><th scope="col">順位 / 条件</th></tr></thead><tbody>{branch.outcomes.map((outcome) => <tr key={`${outcome.tile}-${outcome.method}`}><td>{callTileName(outcome.tile)}</td><td>{outcome.method}</td><td>{outcome.scores[ORASU_SEATS[winds.indexOf(q.seatWind)]!].toLocaleString()}</td><td>{outcome.rank}着{outcome.tied ? "（同点）" : ""} / {outcome.achieved ? "達成" : "未達"}</td></tr>)}</tbody></table></details> : null}
      </>}
    </section>)}</div>
    <p className={shared.small}>点数は現在の手牌に表ドラのみを加えた値で、一発・裏ドラ・赤ドラ・海底等・本場・供託を含みません。供託は順位比較にだけ加えます。枚数は手牌・打牌候補・表示牌・表示した河を差し引いた上限で、実際の山の残り枚数やアガリ確率ではありません。</p>
  </div>;
}

export function RiichiScores({ prepared }: { prepared: PreparedRiichiQuestion }) {
  const q = prepared.question;
  return <dl className={shared.playerScores} aria-label="点棒状況">{winds.map((wind, i) => <div className={wind === q.seatWind ? shared.self : ""} key={wind}><dt>{wind}家{wind === q.seatWind ? "（自分）" : ""}{q.opponentRiichi === wind ? "・立直" : ""}</dt><dd>{q.scores[i]!.toLocaleString()}</dd></div>)}</dl>;
}
