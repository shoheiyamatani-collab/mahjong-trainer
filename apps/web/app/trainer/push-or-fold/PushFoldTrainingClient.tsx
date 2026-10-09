"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, Info, RotateCcw, Shield, Swords } from "lucide-react";
import type { CallDifficulty } from "../call-or-pass/callModel";
import { actionLabels, categoryLabels, strengthLabels, type PreparedPushFoldQuestion, type PushFoldAction } from "./pushFoldTypes";
import { emptyPushFoldStorage, finishPushFoldSession, gradePushFold, PUSH_FOLD_STORAGE_KEY, pushFoldStats, readPushFoldStorage, scorePercent, selectPushFoldSession, type PushFoldAnswer, type PushFoldStorage } from "./pushFoldSession";
import { PhysicalTiles, PushFoldExplanation, PushFoldHand, PushFoldPosition, PushFoldRivers, shantenLabel, tileLabel } from "./PushFoldQuestionView";
import shared from "../call-or-pass/call.module.css";
import styles from "./pushFold.module.css";

const levelLabels = { beginner: "初級", intermediate: "中級", advanced: "上級" };
const gradeLabels = { correct: "推奨と一致", incorrect: "要復習", comparison: "推奨と比較する問題", alternative: "妥当な別解" };
const seedNow = () => `${Date.now()}-${globalThis.crypto?.randomUUID?.() ?? "session"}`;

export function PushFoldTrainingClient({ prepared }: { prepared: PreparedPushFoldQuestion[] }) {
  const [level, setLevel] = useState<CallDifficulty>("beginner");
  const [session, setSession] = useState(() => prepared.filter((p) => p.question.difficulty === "beginner").slice(0, 10));
  const [answers, setAnswers] = useState<PushFoldAnswer[]>([]);
  const [index, setIndex] = useState(0), [finished, setFinished] = useState(false), [ready, setReady] = useState(false), [saved, setSaved] = useState(false);
  const [storage, setStorage] = useState<PushFoldStorage>(emptyPushFoldStorage);
  const storageRef = useRef(emptyPushFoldStorage()), seedRef = useRef("initial");
  const gameRef = useRef<HTMLElement>(null), titleRef = useRef<HTMLHeadingElement>(null);
  const answerRef = useRef<HTMLDivElement>(null), previousIndex = useRef(0);
  const item = session[index], q = item?.question, answer = answers.find((a) => a.id === q?.id);
  const stats = pushFoldStats(session, answers);

  useEffect(() => {
    let value: PushFoldStorage;
    try { value = readPushFoldStorage(localStorage.getItem(PUSH_FOLD_STORAGE_KEY)); } catch { value = emptyPushFoldStorage(); }
    storageRef.current = value; setStorage(value); seedRef.current = seedNow();
    setSession(selectPushFoldSession(prepared, "beginner", seedRef.current, value.recent));
    setLevel("beginner"); setAnswers([]); setIndex(0); setFinished(false); setSaved(false); setReady(true);
  }, [prepared]);
  useEffect(() => {
    if (!ready || finished || !q) return;
    const value = { ...storageRef.current, recent: [q.id, ...storageRef.current.recent.filter((id) => id !== q.id)].slice(0, 40) };
    storageRef.current = value; setStorage(value);
    try { localStorage.setItem(PUSH_FOLD_STORAGE_KEY, JSON.stringify(value)); } catch { /* Training works without storage. */ }
    if (previousIndex.current !== index) { titleRef.current?.focus({ preventScroll: true }); gameRef.current?.scrollIntoView({ block: "start" }); previousIndex.current = index; }
  }, [q, index, ready, finished]);
  useEffect(() => { if (answer) answerRef.current?.focus({ preventScroll: true }); }, [answer?.id]);

  function restart(nextLevel: CallDifficulty) {
    seedRef.current = seedNow(); setLevel(nextLevel);
    setSession(selectPushFoldSession(prepared, nextLevel, seedRef.current, storageRef.current.recent));
    setIndex(0); setAnswers([]); setFinished(false); setSaved(false); previousIndex.current = -1;
  }
  function submit(action: PushFoldAction) {
    if (!q || !ready) return;
    setAnswers((old) => old.some((a) => a.id === q.id) ? old : [...old, { id: q.id, action, discardId: null }]);
  }
  function chooseDiscard(id: number) {
    if (!q || !answer || answer.discardId !== null) return;
    setAnswers((old) => old.map((a) => a.id === q.id ? { ...a, discardId: id } : a));
  }
  function next() {
    if (!answer) return;
    if (index + 1 < session.length) { setIndex(index + 1); return; }
    if (!session.every((item) => answers.some((a) => a.id === item.question.id))) return;
    const value = finishPushFoldSession(storageRef.current, session, answers, seedRef.current, new Date().toISOString());
    storageRef.current = value; setStorage(value);
    try { localStorage.setItem(PUSH_FOLD_STORAGE_KEY, JSON.stringify(value)); setSaved(true); } catch { setSaved(false); }
    setFinished(true); previousIndex.current = -1;
    requestAnimationFrame(() => { titleRef.current?.focus({ preventScroll: true }); gameRef.current?.scrollIntoView({ block: "start" }); });
  }
  return <div className={`${shared.workspace} ${styles.workspace}`}>
    <div className={shared.toolbar}><div className={shared.levels} role="group" aria-label="難易度">{(["beginner", "intermediate", "advanced"] as const).map((value) => <button type="button" key={value} disabled={!ready} aria-pressed={level === value} className={level === value ? shared.active : ""} onClick={() => restart(value)}>{levelLabels[value]}</button>)}</div><button type="button" className={shared.restart} disabled={!ready} onClick={() => restart(level)} title="この難易度で最初から" aria-label="この難易度で最初から"><RotateCcw aria-hidden="true" /></button></div>
    <dl className={shared.scoreboard}><div><dt>明確問の一致数</dt><dd>{stats.correct} / {stats.scored}</dd></div><div><dt>明確問の正答率</dt><dd>{scorePercent(stats.correct, stats.scored)}</dd></div><div><dt>連続一致</dt><dd>{stats.streak}問</dd></div></dl>
    <p className={shared.small}>判断が分かれる問題は正答率に含めません。別解と打牌選択は、別々に記録します。</p>
    {finished ? <section ref={gameRef} className={`panel ${shared.result}`} aria-labelledby="push-fold-result"><h2 id="push-fold-result" ref={titleRef} tabIndex={-1}>10問の結果</h2><strong>{scorePercent(stats.correct, stats.scored)}</strong><p>明確問：{stats.correct} / {stats.scored}問で推奨と一致。比較問題：{stats.comparisons}問（妥当な別解{stats.alternatives}問）。</p>
      <dl className={shared.tradeoffs}><div><dt>押す判断（明確問のみ）</dt><dd>{scorePercent(stats.push.correct, stats.push.scored)} · {stats.push.correct} / {stats.push.scored}</dd></div><div><dt>オリる判断（明確問のみ）</dt><dd>{scorePercent(stats.fold.correct, stats.fold.scored)} · {stats.fold.correct} / {stats.fold.scored}</dd></div><div><dt>打牌選択（回答した分のみ）</dt><dd>{scorePercent(stats.discardCorrect, stats.discardScored)} · {stats.discardCorrect} / {stats.discardScored}候補と一致</dd></div></dl>
      <h3>復習したいカテゴリ</h3><ul>{stats.categories.filter((c) => c.scored).map((c) => <li key={c.category}>{categoryLabels[c.category]}：{c.correct} / {c.scored}{c.correct < c.scored ? "・復習候補" : "・一致"}</li>)}</ul><p className={shared.small}>成績は教材の目的に沿った判断との比較で、実戦の期待値や実力を保証する指標ではありません。{saved ? "この端末に保存しました。" : "保存できませんでしたが、画面内の復習は使えます。"}</p>
      <div className={shared.resultActions}><button type="button" className="primaryCta" onClick={() => restart(level)}><RotateCcw aria-hidden="true" />もう10問</button><Link href="/learn/guides/genbutsu-suji-kabe">安全情報を復習</Link></div>
      <details className={styles.more}><summary>間違えた問題・打牌を復習</summary>{session.filter(({ question }) => { const a = answers.find((a) => a.id === question.id)!; return gradePushFold(question, a.action) === "incorrect" || a.discardId !== null && !question.discards[a.action].includes(a.discardId); }).map((p) => <Review key={p.question.id} item={p} answer={answers.find((a) => a.id === p.question.id)!} />)}</details>
      <details className={styles.more}><summary>全10問と別解を復習</summary>{session.map((p) => <Review key={p.question.id} item={p} answer={answers.find((a) => a.id === p.question.id)!} />)}</details>
    </section> : item && q ? <section ref={gameRef} className={`panel ${shared.game} ${styles.workspace}`} aria-labelledby="push-fold-question" data-question-id={q.id}>
      <div className={`panelHeader ${shared.gameHeader}`}><span>問題 {index + 1} / 10</span><span>{categoryLabels[q.category]}</span></div>
      <PushFoldPosition prepared={item} />
      <div className={shared.questionBody}><h2 id="push-fold-question" ref={titleRef} tabIndex={-1}>{q.title}</h2><PushFoldHand question={q} /><div className={shared.metrics}><strong>最小進行度：{shantenLabel(Math.min(...item.branches.map((b) => b.shanten)))}</strong><span>全攻撃者の現物：手元に{item.safeCopies}枚</span><span>残り山{q.wallTilesRemaining}枚</span></div></div><PushFoldRivers question={q} /><div className={shared.questionBody}><p className={shared.small}>4人打ち・赤各1枚・喰いタンあり・カンなし。山枚数は局面の配分値で、自分の残りツモ回数ではありません。同点相手は自分より上として目標判定、アガリやめなし。</p><p className={styles.decision}><strong>この局面、押す？オリる？</strong></p><div className={`${shared.answerActions} ${styles.answers}`} role="group" aria-label="押し引き判断">{(["push", "fold"] as const).map((action) => <button type="button" key={action} disabled={!ready || Boolean(answer)} aria-pressed={answer?.action === action} onClick={() => submit(action)}>{action === "push" ? <Swords aria-hidden="true" /> : <Shield aria-hidden="true" />}{actionLabels[action]}</button>)}</div></div>
      {answer ? <div className={shared.answer}><div ref={answerRef} tabIndex={-1} className={`${shared.answerStatus} ${gradePushFold(q, answer.action) === "incorrect" ? shared.needsReview : ""}`} role="status">{gradePushFold(q, answer.action) === "correct" ? <Check aria-hidden="true" /> : <Info aria-hidden="true" />}<strong>{gradeLabels[gradePushFold(q, answer.action)]}</strong><span>推奨：{actionLabels[q.recommendedAction]} / {strengthLabels[q.recommendationStrength]}</span></div>{q.reasoning.map((reason) => <p key={reason}>{reason}</p>)}{q.recommendationStrength !== "clear" ? <p className={shared.small}>別解：{q.acceptableActions.map((a) => actionLabels[a]).join("・")}。この問題は正答率に含めません。</p> : null}
        <section className={styles.chooser}><h3>{actionLabels[answer.action]}場合、最初に何を切る？（任意）</h3><div className={styles.tiles} role="group" aria-label="打牌選択">{q.hand.map((tile) => <button type="button" key={tile.id} disabled={answer.discardId !== null} aria-label={`${tileLabel(tile)}を切る${tile.id === q.drawnTileId ? "・ツモ牌" : ""}`} aria-pressed={answer.discardId === tile.id} onClick={() => chooseDiscard(tile.id)}><PhysicalTiles tiles={[tile]} /></button>)}</div><p className={styles.status} role="status">{answer.discardId === null ? "打牌を選ばず、次の問題にも進めます。" : q.discards[answer.action].includes(answer.discardId) ? "打牌：教材の候補と一致。押し引き評価とは別に記録します。" : `打牌：候補と比較しましょう。候補は${q.hand.filter((t) => q.discards[answer.action].includes(t.id)).map(tileLabel).filter((v, i, all) => all.indexOf(v) === i).join("・")}です。唯一の合法打牌という意味ではありません。`}</p></section>
        <div className={shared.resultActions}><button type="button" className="primaryCta" onClick={next}>{index === 9 ? "結果を見る" : "次の問題"}<ArrowRight aria-hidden="true" /></button><a href="#push-fold-learning">判断の基本</a></div>
        <PushFoldExplanation prepared={item} selectedId={answer.discardId} />
        <div className={shared.resultActions}><button type="button" className="primaryCta" onClick={next}>{index === 9 ? "結果を見る" : "次の問題"}<ArrowRight aria-hidden="true" /></button></div>
      </div> : null}
    </section> : null}
    {storage.history.length ? <details className={shared.history}><summary>この端末の最近の成績</summary><ul>{storage.history.slice(0, 5).map((row, i) => <li key={`${row.at}-${i}`}>{new Date(row.at).toLocaleDateString("ja-JP", { timeZone: "Asia/Tokyo" })} · {levelLabels[row.level]} · 明確問{row.correct}/{row.scored} · 打牌{row.discardCorrect}/{row.discardScored}</li>)}</ul><button type="button" className={styles.resetHistory} onClick={() => { const value = emptyPushFoldStorage(); storageRef.current = value; setStorage(value); try { localStorage.removeItem(PUSH_FOLD_STORAGE_KEY); } catch { /* Optional storage. */ } }}>このトレーニングの保存履歴を削除</button></details> : null}
  </div>;
}

function Review({ item, answer }: { item: PreparedPushFoldQuestion; answer: PushFoldAnswer }) {
  const q = item.question;
  return <section className={`${shared.review} ${styles.review}`}><h3>{q.title}</h3><p>{gradeLabels[gradePushFold(q, answer.action)]} / あなた：{actionLabels[answer.action]} / 推奨：{actionLabels[q.recommendedAction]}</p><PushFoldHand question={q} />{q.reasoning.map((s) => <p key={s}>{s}</p>)}<details><summary>局面・計算・安全情報を見直す</summary><PushFoldPosition prepared={item} /><PushFoldRivers question={q} /><PushFoldExplanation prepared={item} selectedId={answer.discardId} /></details></section>;
}
