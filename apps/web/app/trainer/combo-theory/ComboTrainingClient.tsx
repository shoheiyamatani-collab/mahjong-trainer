"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowRight, BookOpen, Calculator, Check, GitCompareArrows, LayoutGrid, SlidersHorizontal, X } from "lucide-react";
import { comboMetricValue, tileIndex } from "@mahjong-trainer/mahjong-core";
import { TileStrip, tileAssetName } from "../../components/TileFigures";
import { PushFoldTable } from "../push-or-fold/PushFoldTable";
import { ComboExplanation, ComboTiles, ComboVisibleCounts, comboTileName } from "./ComboExplanation";
import { ComboSimulator } from "./ComboSimulator";
import { comboHistoryStats, comboMistakes, difficultyLabels, emptyComboHistory, generateComboQuestion, metricLabels, modeLabels, readComboHistory, type ComboAttempt, type ComboDifficulty, type ComboHistory, type ComboMode } from "./comboModel";
import styles from "./combo.module.css";

const storageKey = "jongfolio-combo-history-v1";
const modes = ["calculation", "comparison", "practical", "simulator"] as const;
const icons = { calculation: Calculator, comparison: GitCompareArrows, practical: LayoutGrid, simulator: SlidersHorizontal };
export function ComboTrainingClient() {
  const [mode, setMode] = useState<ComboMode | "simulator">("calculation");
  const [difficulty, setDifficulty] = useState<ComboDifficulty>("beginner");
  const [question, setQuestion] = useState(() => generateComboQuestion("combo-start-v1", "calculation", "beginner"));
  const [answer, setAnswer] = useState<number | null>(null);
  const [format, setFormat] = useState("choice");
  const [numeric, setNumeric] = useState("");
  const [draftSeed, setDraftSeed] = useState("combo-start-v1");
  const [history, setHistory] = useState<ComboHistory>(emptyComboHistory);
  const [review, setReview] = useState<ComboAttempt[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [storageNotice, setStorageNotice] = useState("");
  const historyRef = useRef(history), answeredRef = useRef(false), counter = useRef(0);
  const titleRef = useRef<HTMLHeadingElement>(null), gameRef = useRef<HTMLElement>(null);
  const focusNext = useRef(false);
  useEffect(() => {
    try { const saved = readComboHistory(localStorage.getItem(storageKey)); historyRef.current = saved; setHistory(saved); } catch { setStorageNotice("この端末では成績を保存できません。"); }
    if (new URLSearchParams(location.search).has("combo")) setMode("simulator");
    setReady(true);
  }, []);
  useEffect(() => { if (focusNext.current) { titleRef.current?.focus({ preventScroll: true }); gameRef.current?.scrollIntoView({ block: "start" }); focusNext.current = false; } }, [question]);
  const stats = comboHistoryStats(history), mistakes = comboMistakes(history);
  function load(nextMode: ComboMode, level: ComboDifficulty, seed: string, focus = true) {
    try {
      const q = generateComboQuestion(seed, nextMode, level); focusNext.current = focus; setQuestion(q); setMode(nextMode); setDifficulty(level); setDraftSeed(seed); setAnswer(null); answeredRef.current = false; setNumeric(""); setError("");
      return true;
    } catch (cause) { setError(cause instanceof Error ? cause.message : "問題を作れませんでした。"); return false; }
  }
  function chooseMode(next: typeof modes[number]) {
    setReview([]);
    if (next === "simulator") { setMode(next); setError(""); } else load(next, difficulty, `combo-${next}-${difficulty}`, false);
  }
  function submit(value: number) {
    if (!ready || answeredRef.current || mode === "simulator") return;
    if (!Number.isSafeInteger(value) || value < 0 || value > 1000) { setError("0以上の整数で回答してください。"); return; }
    answeredRef.current = true; setAnswer(value); setError("");
    const attempt: ComboAttempt = { seed: question.seed, mode: question.mode, difficulty: question.difficulty, answer: value, correct: value === question.correct, at: new Date().toISOString() };
    const next: ComboHistory = { version: 1, attempts: [...historyRef.current.attempts, attempt].slice(-1000) };
    historyRef.current = next; setHistory(next);
    try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch { setStorageNotice("保存できませんでした。画面内の成績は利用できます。"); }
  }
  function next() {
    if (review.length > 1) { const row = review[1]!; setReview(review.slice(1)); load(row.mode, row.difficulty, row.seed); }
    else { setReview([]); load(question.mode, difficulty, `combo-${Date.now()}-${counter.current++}`); }
  }
  const q = question;
  return <div id="combo-workspace" className={styles.workspace}>
    <div className={styles.modes} role="group" aria-label="トレーニングモード">{modes.map(value => { const Icon = icons[value]; return <button key={value} aria-pressed={mode === value} onClick={() => chooseMode(value)}><Icon aria-hidden="true" /><span>{modeLabels[value]}</span></button>; })}</div>
    <p className={styles.modelWarning}><strong>コンボ数 ≠ 放銃率</strong><span>見えていない牌から作れる待ちの局所的な組み合わせ数を比較します。</span></p>
    {mode === "simulator" ? <ComboSimulator /> : <>
      <div className={styles.toolbar}><div className={styles.segment} role="group" aria-label="難易度">{(["beginner", "intermediate", "advanced"] as const).map(level => <button key={level} disabled={!ready} aria-pressed={difficulty === level} onClick={() => { setReview([]); load(mode, level, `combo-${mode}-${level}`, false); }}>{difficultyLabels[level]}</button>)}</div>{mode === "calculation" ? <label>回答形式<select value={format} onChange={event => setFormat(event.target.value)}><option value="choice">4択</option><option value="number">数字入力</option></select></label> : null}</div>
      <p className={styles.small}>初級：両面 ／ 中級：両面または愚形 ／ 上級：5種類の合計</p>
      <dl className={styles.scoreboard}><div><dt>解答数</dt><dd>{stats.total}</dd></div><div><dt>正解数</dt><dd>{stats.correct}</dd></div><div><dt>正答率</dt><dd>{stats.accuracy}%</dd></div><div><dt>連続正解</dt><dd>{stats.streak}</dd></div></dl>
      <section ref={gameRef} className={styles.game} aria-labelledby="combo-question-title" data-question-seed={q.seed}>
        <header className={styles.gameHeader}><span>{modeLabels[q.mode]}・{difficultyLabels[q.difficulty]}</span><span>{q.input.model === "basic" ? "基本モデル" : "対リーチモデル"}{review.length ? "・復習" : ""}</span></header>
        {q.scene ? <div className={styles.scene}><p><strong>{q.opponent}家のリーチに対して比較</strong> · {q.scene.turn}巡目</p><p className={styles.small}>合成教材のツモ後・打牌前です。押し引きや最善打牌を当てる問題ではありません。</p><div className={styles.sceneDora}><span>ドラ表示牌</span><TileStrip tiles={q.scene.doraIndicators.map(tile => tileAssetName(tile.tile, tile.red))} compact /></div><h3>自分の14枚</h3><div className={styles.physicalHand} style={{ "--combo-hand-count": q.scene.hand.length } as CSSProperties}><TileStrip tiles={[...q.scene.hand].sort((a, b) => tileIndex(a.tile) - tileIndex(b.tile) || a.id - b.id).map(tile => tileAssetName(tile.tile, tile.red))} /></div><PushFoldTable question={q.scene} /></div> : null}
        <div className={styles.questionBody}>
          <h2 tabIndex={-1} ref={titleRef} id="combo-question-title">{q.mode === "calculation" ? `${comboTileName(q.targets[0]!)}の${metricLabels[q.metric]}は？` : `${metricLabels[q.metric]}が${q.direction === "min" ? "少ない" : "多い"}牌は？`}</h2>
          <p>{q.input.model === "riichi" ? `${q.opponent ? `${q.opponent}家` : "リーチ者"}本人の河によるフリテンを除きます。` : "フリテンは加味せず、見えている枚数だけで数えます。"}</p>
          {q.mode === "calculation" ? <div className={styles.targetTile}><ComboTiles tiles={q.targets} /></div> : null}
          <details className={styles.detail} open={!q.scene}><summary>見えている枚数を確認</summary><ComboVisibleCounts input={q.input} targets={q.targets} /></details>
          {q.mode === "calculation" && format === "number" ? <form className={styles.numericForm} onSubmit={event => { event.preventDefault(); if (!/^\d+$/.test(numeric)) setError("0以上の整数で回答してください。"); else submit(Number(numeric)); }}><label>コンボ数<input inputMode="numeric" autoComplete="off" type="text" value={numeric} disabled={answer !== null || !ready} onChange={event => setNumeric(event.target.value)} /></label><button type="submit" className="primaryCta" disabled={answer !== null || !ready}>回答する<Check aria-hidden="true" /></button></form> : <div className={styles.choices} role="group" aria-label="回答候補">{q.choices.map(value => <button key={value} type="button" disabled={answer !== null || !ready} aria-pressed={answer === value} onClick={() => submit(value)}>{q.mode === "calculation" ? <><strong>{value}</strong><span>コンボ</span></> : <><ComboTiles tiles={[value]} /><strong>{comboTileName(value)}</strong></>}</button>)}</div>}
          {error ? <p role="alert" className={styles.caution}>{error}</p> : null}
        </div>
        {answer !== null ? <div className={styles.answer}><div className={styles.answerStatus} data-correct={answer === q.correct} role="status">{answer === q.correct ? <Check aria-hidden="true" /> : <X aria-hidden="true" />}<strong>{answer === q.correct ? "正解" : "不正解"}</strong><span>正解：{q.mode === "calculation" ? `${q.correct}コンボ` : comboTileName(q.correct)}</span></div>
          {q.mode !== "calculation" ? <p>{q.results.map(result => `${comboTileName(result.target)}：${comboMetricValue(result, q.metric)}コンボ`).join(" ／ ")}</p> : null}
          <ComboExplanation results={q.results} input={q.input} /><p className={styles.checkpoint}><strong>この問題のポイント</strong>{q.input.model === "riichi" ? "現物だけでなく、両面のもう片側が本人の河にある形も除外します。他家の河は可視枚数には含めますが、本人のフリテンには使いません。" : "ターツに必要な2牌の残り枚数を掛けます。シャンポンは同じ牌の対子なので、順序を区別せず2枚を選びます。"}</p>
          <div className={styles.actions}><button className="primaryCta" onClick={next}>次の問題<ArrowRight aria-hidden="true" /></button><Link href="/learn/guides/combo-theory">コンボ理論の解説<BookOpen aria-hidden="true" /></Link></div>
        </div> : null}
      </section>
      <details className={styles.detail}><summary>問題のseedを確認・指定</summary><form className={styles.seedForm} onSubmit={event => { event.preventDefault(); setReview([]); load(mode, difficulty, draftSeed.trim()); }}><label>再現seed<input value={draftSeed} maxLength={160} onChange={event => setDraftSeed(event.target.value)} /></label><button className="secondaryCta" type="submit">このseedで出題</button></form><p className={styles.small}>現在：{q.seed} ／ 計算モデルv1</p></details>
      <details className={styles.detail}><summary>この端末の成績・間違えた問題</summary><p className={styles.small}>直近1,000回答。実戦の強さや放銃率を表す数値ではありません。</p><div className={styles.statsGroups}><section><h3>難易度別</h3>{(["beginner", "intermediate", "advanced"] as const).map(level => { const row = comboHistoryStats(history, undefined, level); return <p key={level}>{difficultyLabels[level]}：{row.correct} / {row.total}問（{row.total ? `${row.accuracy}%` : "未回答"}）</p>; })}</section><section><h3>モード別</h3>{(["calculation", "comparison", "practical"] as const).map(value => { const row = comboHistoryStats(history, value); return <p key={value}>{modeLabels[value]}：{row.correct} / {row.total}問（{row.total ? `${row.accuracy}%` : "未回答"}）</p>; })}</section></div>
        {mistakes.length ? <><button className="secondaryCta" onClick={() => { const row = mistakes[0]!; setReview(mistakes); load(row.mode, row.difficulty, row.seed); }}>間違えた{mistakes.length}問を復習</button><ul className={styles.reviewList}>{mistakes.map(row => <li key={`${row.mode}-${row.difficulty}-${row.seed}`}><button onClick={() => { setReview([row]); load(row.mode, row.difficulty, row.seed); }}>{modeLabels[row.mode]}・{difficultyLabels[row.difficulty]}<span>{row.seed}</span></button></li>)}</ul></> : <p>未復習の間違いはありません。</p>}
      </details>
      {storageNotice ? <p className={styles.small} role="status">{storageNotice}</p> : null}
    </>}
  </div>;
}
