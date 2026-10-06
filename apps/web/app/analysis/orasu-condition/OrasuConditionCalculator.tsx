"use client";

import { Calculator, Minus, Plus, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import {
  ORASU_SEATS,
  calculateOrasuConditions,
  calculateOrasuDraw,
  formatOrasuCandidate,
  rankOrasuScores,
  validateOrasuConditionInput,
  type OrasuConditionInput,
  type OrasuConditionResult,
  type OrasuDrawResult,
  type OrasuRankingRow,
  type OrasuRonCondition,
  type OrasuScores,
  type OrasuSeat,
  type OrasuTargetRank,
  type OrasuTiePolicy,
  type OrasuWinningCondition
} from "@mahjong-trainer/mahjong-core";
import styles from "./orasu-condition.module.css";

const seatLabels: Record<OrasuSeat, string> = { east: "東家", south: "南家", west: "西家", north: "北家" };
const initialScoreInputs: Record<OrasuSeat, string> = { east: "32000", south: "28500", west: "22000", north: "17500" };
type CalculatorTab = "win" | "draw";

export default function OrasuConditionCalculator() {
  const [scoreInputs, setScoreInputs] = useState(initialScoreInputs);
  const [selfSeat, setSelfSeat] = useState<OrasuSeat>("south");
  const [targetRank, setTargetRank] = useState<OrasuTargetRank>(1);
  const [honba, setHonba] = useState(0);
  const [riichiSticks, setRiichiSticks] = useState(0);
  const [tiePolicy, setTiePolicy] = useState<OrasuTiePolicy>("strict");
  const [activeTab, setActiveTab] = useState<CalculatorTab>("win");
  const [tenpaiSeats, setTenpaiSeats] = useState<OrasuSeat[]>(["south"]);
  const [result, setResult] = useState<OrasuConditionResult | null>(null);
  const [drawResult, setDrawResult] = useState<OrasuDrawResult | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const parsedScores = useMemo(() => parseScores(scoreInputs), [scoreInputs]);
  const currentRanking = useMemo(() => (parsedScores ? rankOrasuScores(parsedScores) : null), [parsedScores]);

  function markChanged() {
    setResult(null);
    setDrawResult(null);
    setErrors([]);
  }

  function updateScore(seat: OrasuSeat, value: string) {
    setScoreInputs((current) => ({ ...current, [seat]: value }));
    markChanged();
  }

  function nudgeScore(seat: OrasuSeat, amount: number) {
    const current = Number(scoreInputs[seat]);
    updateScore(seat, String(Math.max(0, (Number.isFinite(current) ? current : 0) + amount)));
  }

  function reset() {
    setScoreInputs(initialScoreInputs);
    setSelfSeat("south");
    setTargetRank(1);
    setHonba(0);
    setRiichiSticks(0);
    setTiePolicy("strict");
    setTenpaiSeats(["south"]);
    setResult(null);
    setDrawResult(null);
    setErrors([]);
  }

  function buildInput(): OrasuConditionInput | null {
    if (!parsedScores) {
      setErrors(["4人全員の持ち点を100点単位で入力してください。"]);
      return null;
    }
    const input: OrasuConditionInput = { scores: parsedScores, selfSeat, dealerSeat: "east", targetRank, honba, riichiSticks, tiePolicy };
    const nextErrors = validateOrasuConditionInput(input);
    setErrors(nextErrors);
    return nextErrors.length === 0 ? input : null;
  }

  function calculateWinConditions() {
    const input = buildInput();
    if (input) setResult(calculateOrasuConditions(input));
  }

  function calculateDrawConditions() {
    const input = buildInput();
    if (input) setDrawResult(calculateOrasuDraw(input.scores, tenpaiSeats));
  }

  function toggleTenpai(seat: OrasuSeat) {
    setTenpaiSeats((current) => current.includes(seat) ? current.filter((item) => item !== seat) : [...current, seat]);
    setDrawResult(null);
  }

  return (
    <section className={styles.calculator} aria-labelledby="orasu-calculator-title">
      <div className={styles.toolHeading}>
        <div>
          <p className={styles.kicker}>ORASU CONDITION CALCULATOR</p>
          <h2 id="orasu-calculator-title">オーラス条件を計算する</h2>
          <p>現在の持ち点と目標順位を入力すると、誰から何点をロンするか、何点をツモするかを実際の点棒移動で判定します。</p>
        </div>
        <button className={styles.resetButton} type="button" onClick={reset}><RotateCcw size={17} aria-hidden="true" />リセット</button>
      </div>

      <div className={styles.scoreGrid}>
        {ORASU_SEATS.map((seat) => (
          <div className={`${styles.scoreField} ${seat === selfSeat ? styles.isSelf : ""}`} key={seat}>
            <label htmlFor={`score-${seat}`}><span>{seatLabels[seat]}{seat === "east" ? "（親）" : ""}</span>{seat === selfSeat ? <strong>自分</strong> : null}</label>
            <div className={styles.scoreInputRow}>
              <input id={`score-${seat}`} type="number" inputMode="numeric" min="0" step="100" value={scoreInputs[seat]} onChange={(event) => updateScore(seat, event.target.value)} />
              <span>点</span>
            </div>
            <div className={styles.nudgeButtons} aria-label={`${seatLabels[seat]}の点数調整`}>
              <button type="button" onClick={() => nudgeScore(seat, -1000)} aria-label={`${seatLabels[seat]}を1000点減らす`}><Minus size={14} aria-hidden="true" />1,000</button>
              <button type="button" onClick={() => nudgeScore(seat, 1000)} aria-label={`${seatLabels[seat]}を1000点増やす`}><Plus size={14} aria-hidden="true" />1,000</button>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.settingsGrid}>
        <fieldset>
          <legend>自分の席</legend>
          <div className={styles.segmented}>
            {ORASU_SEATS.map((seat) => (
              <button className={selfSeat === seat ? styles.isSelected : ""} type="button" aria-pressed={selfSeat === seat} key={seat} onClick={() => { setSelfSeat(seat); markChanged(); }}>
                {seatLabels[seat].replace("家", "")}{seat === "east" ? "（親）" : ""}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend>目標順位</legend>
          <div className={styles.segmented}>
            {([1, 2, 3] as const).map((rank) => (
              <button className={targetRank === rank ? styles.isSelected : ""} type="button" aria-pressed={targetRank === rank} key={rank} onClick={() => { setTargetRank(rank); markChanged(); }}>
                {rank === 1 ? "トップ" : rank === 2 ? "2着以内" : "ラス回避"}
              </button>
            ))}
          </div>
        </fieldset>
        <label className={styles.numberSetting}><span>本場</span><input type="number" min="0" step="1" value={honba} onChange={(event) => { setHonba(Number(event.target.value)); markChanged(); }} /></label>
        <label className={styles.numberSetting}><span>供託（本）</span><input type="number" min="0" step="1" value={riichiSticks} onChange={(event) => { setRiichiSticks(Number(event.target.value)); markChanged(); }} /></label>
        <fieldset className={styles.tieFieldset}>
          <legend>同点の扱い</legend>
          <div className={styles.segmented}>
            <button className={tiePolicy === "strict" ? styles.isSelected : ""} type="button" aria-pressed={tiePolicy === "strict"} onClick={() => { setTiePolicy("strict"); markChanged(); }}>同点では未達</button>
            <button className={tiePolicy === "allow" ? styles.isSelected : ""} type="button" aria-pressed={tiePolicy === "allow"} onClick={() => { setTiePolicy("allow"); markChanged(); }}>同点で達成</button>
          </div>
        </fieldset>
      </div>

      {currentRanking ? <CurrentRanking ranking={currentRanking} selfSeat={selfSeat} /> : null}
      <div className={styles.tabs} role="tablist" aria-label="計算方法">
        <button type="button" role="tab" aria-selected={activeTab === "win"} className={activeTab === "win" ? styles.isActiveTab : ""} onClick={() => setActiveTab("win")}>アガリ条件</button>
        <button type="button" role="tab" aria-selected={activeTab === "draw"} className={activeTab === "draw" ? styles.isActiveTab : ""} onClick={() => setActiveTab("draw")}>流局条件</button>
      </div>

      {errors.length > 0 ? <div className={styles.errorBox} role="alert">{errors.map((error) => <p key={error}>{error}</p>)}</div> : null}
      {activeTab === "win" ? (
        <div role="tabpanel">
          <button className={styles.calculateButton} type="button" onClick={calculateWinConditions}><Calculator size={19} aria-hidden="true" />必要なアガリ点を計算</button>
          {result ? <WinResult result={result} /> : null}
        </div>
      ) : (
        <div className={styles.drawPanel} role="tabpanel">
          <fieldset>
            <legend>テンパイしている人</legend>
            <div className={styles.checkboxGrid}>
              {ORASU_SEATS.map((seat) => <label key={seat}><input type="checkbox" checked={tenpaiSeats.includes(seat)} onChange={() => toggleTenpai(seat)} />{seatLabels[seat]}{seat === selfSeat ? "（自分）" : ""}</label>)}
            </div>
          </fieldset>
          <button className={styles.calculateButton} type="button" onClick={calculateDrawConditions}><Calculator size={19} aria-hidden="true" />流局後の順位を計算</button>
          {drawResult ? <DrawResultView result={drawResult} selfSeat={selfSeat} /> : null}
        </div>
      )}
    </section>
  );
}

function CurrentRanking({ ranking, selfSeat }: { ranking: OrasuRankingRow[]; selfSeat: OrasuSeat }) {
  return <div className={styles.currentRanking}><strong>現在順位</strong><ol>{ranking.map((row) => <li className={row.seat === selfSeat ? styles.selfRank : ""} key={row.seat}><span>{row.rank}位 {seatLabels[row.seat]}{row.seat === selfSeat ? "（自分）" : ""}</span><b>{formatPoints(row.score)}</b></li>)}</ol></div>;
}

function WinResult({ result }: { result: OrasuConditionResult }) {
  const selfSeat = result.input.selfSeat;
  if (result.alreadyAchieved) return <div className={styles.resultArea} aria-live="polite"><div className={styles.successSummary}><strong>すでに目標順位を満たしています</strong><p>入力した同点ルールでは、現在の持ち点で{targetLabel(result.input.targetRank)}です。</p></div></div>;
  return (
    <div className={styles.resultArea} aria-live="polite">
      <div className={styles.resultSummary}><p>目標ラインとの素点差</p><strong>{result.pointsToTargetLine.toLocaleString("ja-JP")}点</strong><span>{result.input.tiePolicy === "strict" ? "同点では未達として計算" : "同点で達成として計算"}</span></div>
      {result.easiest ? <div className={styles.easiestRoute}><span>最少のアガリ点表示</span><strong>{result.easiest.method === "ron" ? `${seatLabels[result.easiest.fromSeat]}から ` : ""}{formatOrasuCandidate(result.easiest.condition.candidate)}</strong></div> : <div className={styles.noRoute}>通常の1回のアガリ（単独役満まで）では目標に届きません。</div>}
      <div className={styles.resultGrid}>
        <section className={styles.resultCard}><h3>ロン条件</h3><p>放銃者の失点まで反映するため、誰からロンするかで必要点が変わります。</p><div className={styles.conditionList}>{ORASU_SEATS.filter((seat) => seat !== selfSeat).map((seat) => <RonConditionRow key={seat} seat={seat} condition={result.ron[seat]} input={result.input} />)}</div></section>
        <section className={styles.resultCard}><h3>ツモ条件</h3><p>親・子それぞれの支払いと、本場・供託を含めた全員の点数移動で判定します。</p>{result.tsumo ? <ConditionDetail heading={formatOrasuCandidate(result.tsumo.candidate)} condition={result.tsumo} input={result.input} /> : <p className={styles.unreachable}>単独役満ツモでも届きません。</p>}</section>
      </div>
      <p className={styles.ruleNote}>供託は現在の4人の持ち点には含めず、アガった人だけに加算します。順位点・オカ・ウマ・同点時の席順優先は計算対象外です。</p>
    </div>
  );
}

function RonConditionRow({ seat, condition, input }: { seat: OrasuSeat; condition: OrasuRonCondition | null; input: OrasuConditionInput }) {
  if (!condition) return <div className={styles.conditionRow}><strong>{seatLabels[seat]}から</strong><span className={styles.unreachable}>単独役満でも届かない</span></div>;
  return <ConditionDetail heading={`${seatLabels[seat]}から ${formatOrasuCandidate(condition.candidate)}`} condition={condition} input={input} />;
}

function ConditionDetail({ heading, condition, input }: { heading: string; condition: OrasuWinningCondition; input: OrasuConditionInput }) {
  const candidate = condition.candidate;
  const basis = candidate.yakumanCount > 0 ? "役満" : candidate.limitName === "normal" ? `${candidate.han}翻${candidate.fu}符の代表例` : `${candidate.limitLabel}（${candidate.han}翻${candidate.fu}符の代表例）`;
  const settlementText = candidate.settlementPayments.map((payment) => `${payment.label} ${formatPoints(payment.points)}`).join(" / ");
  return <details className={styles.conditionDetail}><summary><strong>{heading}</strong><span>内訳を見る</span></summary><div className={styles.detailBody}><p>{basis}</p>{(input.honba > 0 || input.riichiSticks > 0) ? <p>精算時: {settlementText}、供託 {formatPoints(input.riichiSticks * 1000)}を加算</p> : null}<ScoreMovementTable before={input.scores} after={condition.postScores} selfSeat={input.selfSeat} ranking={condition.postRanking} /></div></details>;
}

function DrawResultView({ result, selfSeat }: { result: OrasuDrawResult; selfSeat: OrasuSeat }) {
  return <div className={styles.resultArea} aria-live="polite"><div className={styles.successSummary}><strong>{result.tenpaiCount === 0 || result.tenpaiCount === 4 ? "点数移動なし" : `${result.tenpaiCount}人テンパイの精算`}</strong><p>{result.tenpaiCount === 0 || result.tenpaiCount === 4 ? "全員ノーテンまたは全員テンパイでは、ノーテン罰符の移動はありません。" : `テンパイ者は1人あたり${formatPoints(result.tenpaiGain)}受け取り、ノーテン者は1人あたり${formatPoints(result.notenLoss)}支払います。`}</p></div><ScoreMovementTable before={null} after={result.postScores} selfSeat={selfSeat} ranking={result.postRanking} /></div>;
}

function ScoreMovementTable({ before, after, selfSeat, ranking }: { before: OrasuScores | null; after: OrasuScores; selfSeat: OrasuSeat; ranking: OrasuRankingRow[] }) {
  return <div className={styles.tableScroll}><table className={styles.scoreTable}><thead><tr><th>席</th>{before ? <th>現在</th> : null}<th>精算後</th><th>順位</th></tr></thead><tbody>{ORASU_SEATS.map((seat) => { const row = ranking.find((item) => item.seat === seat); return <tr className={seat === selfSeat ? styles.selfTableRow : ""} key={seat}><th>{seatLabels[seat]}{seat === selfSeat ? "（自分）" : ""}</th>{before ? <td>{formatPoints(before[seat])}</td> : null}<td>{formatPoints(after[seat])}</td><td>{row?.rank}位{row?.tied ? "（同点）" : ""}</td></tr>; })}</tbody></table></div>;
}

function parseScores(inputs: Record<OrasuSeat, string>): OrasuScores | null {
  if (ORASU_SEATS.some((seat) => inputs[seat].trim() === "")) return null;
  const scores = Object.fromEntries(ORASU_SEATS.map((seat) => [seat, Number(inputs[seat])])) as OrasuScores;
  return ORASU_SEATS.every((seat) => Number.isFinite(scores[seat])) ? scores : null;
}
function formatPoints(points: number): string { return `${points.toLocaleString("ja-JP")}点`; }
function targetLabel(rank: OrasuTargetRank): string { return rank === 1 ? "トップ" : rank === 2 ? "2着以内" : "ラス回避"; }
