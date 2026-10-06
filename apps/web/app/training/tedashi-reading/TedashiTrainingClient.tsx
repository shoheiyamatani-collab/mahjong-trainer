"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, RotateCcw } from "lucide-react";
import { TileStrip, getTileName, tileAssetName } from "../../components/TileFigures";
import type { HandAnalysis, QuestionStep, ReplayMeld, ReplayTile, TedashiQuestion } from "@mahjong-trainer/tenhou-analysis/types";
import { CATEGORY_LABELS } from "@mahjong-trainer/tenhou-analysis/labels";
import { HandSnapshotImage } from "./HandSnapshotImage";
import styles from "./tedashi.module.css";

const labels = CATEGORY_LABELS;
const meldLabels = { chi: "チー", pon: "ポン", ankan: "暗槓", daiminkan: "大明槓", kakan: "加槓" };
const assets = (tiles: ReplayTile[]) => tiles.map((tile) => tileAssetName(tile.tile, tile.red));
const displayText = (text: string) => text.replace(/[1-9][mps]/g, (tile) => getTileName(tileAssetName(tile as ReplayTile["tile"])));
const stage = (shanten: number) => shanten === 0 ? "テンパイ" : `${shanten}シャンテン`;
const storageKey = "jongfolio:tedashi-reading:results:v1";

function Hand({ tiles, melds, filename }: { tiles: ReplayTile[]; melds: ReplayMeld[]; filename: string }) {
  const fallback = <><TileStrip tiles={assets(tiles)} />{melds.length ? <div className={styles.melds}>{melds.map((meld, index) => <div key={index}><span>{meldLabels[meld.kind]}</span><TileStrip tiles={assets(meld.tiles)} compact /></div>)}</div> : null}</>;
  return <div className={styles.hand}><p className={styles.handCount}>手牌 {tiles.length}枚{melds.length ? ` + 副露 ${melds.length}組` : ""}</p><HandSnapshotImage tiles={tiles} melds={melds} filename={filename} fallback={fallback} /></div>;
}

function Metrics({ analysis, canDraw }: { analysis: HandAnalysis; canDraw: boolean }) {
  const tiles = analysis.tenpai ? analysis.waits : analysis.ukeire;
  return <div className={styles.metrics}><strong>{stage(analysis.shanten)}</strong>{canDraw ? <span>{analysis.tenpai ? "待ち" : "有効牌"} {tiles.length}種・残り{analysis.ukeireCount}枚{analysis.waitKind === "tanki" ? " / 単騎" : ""}</span> : null}{tiles.length ? <TileStrip tiles={tiles.map((tile) => tileAssetName(tile))} compact /> : null}</div>;
}

function StepReveal({ step, questionId }: { step: QuestionStep; questionId: string }) {
  const name = getTileName(tileAssetName(step.tile.tile, step.tile.red));
  const drawn = step.handBeforeDraw ? step.handBefore.find((tile) => !step.handBeforeDraw!.some((old) => old.id === tile.id)) : null;
  const emptyCut = drawn && drawn.tile === step.tile.tile && drawn.id !== step.tile.id;
  const filename = `${questionId}-${step.sequence}`;
  return <section className={styles.step}><h3>{step.turn}巡目：{name} {step.meld ? meldLabels[step.meld.kind] : step.tsumogiri ? "ツモ切り" : "手出し"}{emptyCut ? "（空切り）" : ""}</h3>{drawn ? <p className={styles.small}>ツモ牌：{getTileName(tileAssetName(drawn.tile, drawn.red))}{emptyCut ? "。同じ種類ですが、今引いた個体ではなく、以前から持っていた個体を切っています。" : ""}</p> : null}<div className={styles.handComparison}><div><h4>{step.type === "call" ? "鳴く前" : "打牌直前"}</h4><Hand tiles={step.handBefore} melds={step.meldsBefore} filename={`${filename}-before`} /></div><div><h4>{step.type === "call" ? "鳴いた直後" : "打牌直後"}</h4><Hand tiles={step.handAfter} melds={step.meldsAfter} filename={`${filename}-after`} /><Metrics analysis={step.after} canDraw={step.handAfter.length + step.meldsAfter.length * 3 === 13} /></div></div>{step.handBeforeDraw ? <details><summary>ツモ前の手牌を確認</summary><Hand tiles={step.handBeforeDraw} melds={step.meldsBefore} filename={`${filename}-before-draw`} /></details> : null}{step.shantenBeforeDraw !== null ? <p className={styles.small}>ツモ前の13枚相当：{stage(step.shantenBeforeDraw)} → 打牌後：{stage(step.after.shanten)}</p> : null}</section>;
}

export function TedashiTrainingClient({ questions, mode }: { questions: TedashiQuestion[]; mode: "published" | "local-review" | "synthetic" }) {
  const [setIndex, setSetIndex] = useState(0);
  const count = Math.ceil(questions.length / 10);
  const selectedSet = Math.min(setIndex, Math.max(0, count - 1));
  const session = useMemo(() => questions.slice(selectedSet * 10, selectedSet * 10 + 10), [questions, selectedSet]);
  return <>
    {count > 1 ? <div className={styles.setControl}><label htmlFor="tedashi-question-set">問題セット</label><select id="tedashi-question-set" value={selectedSet} onChange={(event) => setSetIndex(Number(event.target.value))}>{Array.from({ length: count }, (_, index) => <option key={index} value={index}>第{index + 1}セット（{index * 10 + 1}〜{Math.min((index + 1) * 10, questions.length)}問）</option>)}</select><span>全{questions.length}問</span></div> : null}
    <QuestionSession key={`${mode}:${selectedSet}:${session[0]?.contentHash ?? "empty"}`} questions={session} mode={mode} />
  </>;
}

function QuestionSession({ questions, mode }: { questions: TedashiQuestion[]; mode: "published" | "local-review" | "synthetic" }) {
  const session = questions.slice(0, 10);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const sessionId = useRef<string | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const previousIndex = useRef(index);
  useEffect(() => {
    if (previousIndex.current === index) return;
    previousIndex.current = index;
    heading.current?.focus({ preventScroll: true });
    heading.current?.scrollIntoView({ block: "start", behavior: "instant" });
  }, [index]);
  const question = session[index];
  const answered = question && answers[question.id] !== undefined;
  const correctCount = session.filter((q) => answers[q.id] === q.answer).length;
  const categoryResults = useMemo(() => Object.entries(labels).flatMap(([category, label]) => { const relevant = session.filter((q) => q.analysis.category === category); return relevant.length ? [{ label, total: relevant.length, correct: relevant.filter((q) => answers[q.id] === q.answer).length }] : []; }), [answers, questions]);
  function finish() {
    if (!sessionId.current) sessionId.current = `${Date.now()}-${session[0]!.id}`;
    try {
      const previous: unknown = JSON.parse(localStorage.getItem(storageKey) ?? "[]");
      const history = Array.isArray(previous) ? previous.filter((row) => row && typeof row.id === "string" && Number.isInteger(row.correct) && Number.isInteger(row.total)).slice(-19) : [];
      const result = { id: sessionId.current, at: new Date().toISOString(), correct: correctCount, total: session.length, mode, categories: categoryResults };
      localStorage.setItem(storageKey, JSON.stringify([...history.filter((row) => row.id !== result.id), result])); setSaved(true);
    } catch { setSaved(false); }
    setIndex(session.length);
  }
  function restart() { setAnswers({}); setIndex(0); setSelected(null); setSaved(false); sessionId.current = null; }
  if (!session.length) return <section className={styles.empty}><h2>公開用の問題を検品中です</h2><p>利用確認と検品が完了した実牌譜問題から公開します。下の解説は閲覧できます。</p></section>;
  if (!question) return <section className={styles.result} aria-labelledby="tedashi-result-title"><h2 id="tedashi-result-title" ref={heading} tabIndex={-1}>トレーニング結果</h2><strong className={styles.resultScore}>{correctCount} / {session.length}問正解</strong><p>正答率 {Math.round(correctCount / session.length * 100)}%</p><dl>{categoryResults.map((row) => <div key={row.label}><dt>{row.label}</dt><dd>{row.correct} / {row.total}</dd></div>)}</dl><p className={styles.small}>{saved ? "この端末に成績を保存しました。" : "この端末では成績を保存できませんでした。"}{mode !== "published" ? "未公開問題の成績は本番と区別して保存されます。" : ""}</p><button className="primaryCta" type="button" onClick={restart}><RotateCcw aria-hidden="true" />もう一度練習する</button></section>;
  const focus = new Set(question.steps?.filter((s) => s.type === "discard").map((s) => s.sequence) ?? [question.focusDiscard.sequence]);
  const revealedSteps: QuestionStep[] = question.steps ?? [{ sequence: question.source.eventSequence, type: "discard", turn: question.source.turn, tile: question.focusDiscard.tile, tsumogiri: false, meld: null, handBeforeDraw: question.actual.handBeforeDraw, handBefore: question.actual.handBefore, handAfter: question.actual.handAfter, meldsBefore: question.actual.melds, meldsAfter: question.actual.melds, before: question.actual.before, after: question.actual.after, shantenBeforeDraw: question.actual.shantenBeforeDraw }];
  return <section className={styles.training} aria-labelledby="tedashi-question-title">
    {mode !== "published" ? <p className={styles.notice}>{mode === "synthetic" ? "合成テスト問題 · 天鳳の実牌譜ではありません" : "ローカル検品モード · 実牌譜の未公開候補です"}</p> : null}
    <div className={styles.progress}><strong>問題 {index + 1} / {session.length}</strong><span>{labels[question.analysis.category]}</span><span>正解 {correctCount}問</span></div>
    <div className={styles.source}><span>{question.source.sourceType === "synthetic" ? "合成テストデータ" : "天鳳 鳳凰卓"}</span><span>{question.source.round} {question.source.honba}本場 / {question.source.seat}家 / {question.source.turn}巡目</span></div>
    <h2 id="tedashi-question-title" ref={heading} tabIndex={-1}>注目する手出し</h2>
    <ol className={styles.river} aria-label="相手の捨て牌：手は手出し、ツモはツモ切り">{question.river.map((item) => {
      const name = getTileName(tileAssetName(item.tile.tile, item.tile.red));
      return <li className={focus.has(item.sequence) ? styles.focusTile : ""} key={item.sequence} aria-label={`${item.turn}巡目 ${name} ${item.tsumogiri ? "ツモ切り" : "手出し"}${item.riichi ? " リーチ宣言" : ""}${focus.has(item.sequence) ? " 注目" : ""}`}><span className={styles.riverTile}><img className={item.riichi ? styles.riichiTile : ""} src={`/tiles/${tileAssetName(item.tile.tile, item.tile.red)}-66-90-l-emb.png`} alt={name} /></span><span>{item.tsumogiri ? "ツモ" : "手"}{item.riichi ? "・立直" : ""}</span>{focus.has(item.sequence) ? <strong>注目</strong> : null}</li>;
    })}</ol>
    <p className={styles.prompt}>{displayText(question.prompt)}</p>
    <fieldset className={styles.choices} disabled={Boolean(answered)}><legend className={styles.srOnly}>回答を1つ選ぶ</legend>{question.choices.map((choice, choiceIndex) => <label className={`${styles.choice} ${selected === choice.id ? styles.selected : ""} ${answered && question.answer === choice.id ? styles.correct : ""}`} key={choice.id}><input type="radio" name={`answer-${question.id}`} value={choice.id} checked={selected === choice.id} onChange={() => setSelected(choice.id)} /><span className={styles.choiceLetter}>{"ABCD"[choiceIndex]}</span><span>{displayText(choice.text)}</span></label>)}</fieldset>
    {!answered ? <button className="primaryCta" type="button" disabled={!selected} onClick={() => selected && setAnswers((current) => ({ ...current, [question.id]: selected }))}>回答する</button> : <>
      <div className={styles.answerStatus} role="status"><strong>{answers[question.id] === question.answer ? "正解" : "不正解：実際の手牌を確認しましょう"}</strong></div>
      <div className={styles.explanation}><h2>実際の手牌</h2>{revealedSteps.map((step) => <StepReveal key={step.sequence} step={step} questionId={question.id} />)}<h3>実際に起きた変化</h3><p>{displayText(question.analysis.summary)}</p><h3>捨て牌から何が読める？</h3><p>{displayText(question.analysis.reading)}</p><aside className={styles.caution}>この解説は実際の牌譜で起きた手牌変化を元にしています。対局者本人の思考や意図を断定するものではありません。{mode === "synthetic" ? "この問題は動作確認用の合成データです。" : ""}</aside><p className={styles.small}>受け入れ枚数は手牌・河・副露・ドラ表示牌から数えています。相手の隠された手牌や実際の山を使用した枚数ではありません。</p>{question.source.url ? <a href={question.source.url} target="_blank" rel="noopener noreferrer">元牌譜を天鳳で確認する</a> : null}</div>
      <button className="primaryCta" type="button" onClick={() => { if (index === session.length - 1) finish(); else { setIndex(index + 1); setSelected(null); } }}>{index === session.length - 1 ? "結果を見る" : "次の問題"}<ArrowRight aria-hidden="true" /></button>
    </>}
  </section>;
}
