"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Check, Info, Minus, RotateCcw, Zap } from "lucide-react";
import { TileStrip, tileAssetName } from "../../components/TileFigures";
import { CallHand } from "../call-or-pass/CallQuestionView";
import { doraFromIndicator } from "../call-or-pass/callModel";
import { RiichiComparison, RiichiScores } from "./RiichiQuestionView";
import { actionLabels, categoryLabels, difficultyLabels, parseRiichiHistory, riichiSessionStats, shuffleRiichiSession, type PreparedRiichiQuestion, type RiichiAction, type RiichiAnswer, type RiichiDifficulty, type RiichiHistory } from "./riichiModel";
import shared from "../call-or-pass/call.module.css";
import styles from "./riichi.module.css";

const storageKey = "jongfolio:riichi-or-dama:v1";

export function RiichiTrainingClient({ prepared }: { prepared: PreparedRiichiQuestion[] }) {
  const questions = useMemo(() => prepared.map((item) => item.question), [prepared]);
  const [difficulty, setDifficulty] = useState<RiichiDifficulty>("beginner");
  const [session, setSession] = useState(() => questions.filter((q) => q.difficulty === "beginner").slice(0, 10));
  const [answers, setAnswers] = useState<RiichiAnswer[]>([]);
  const [index, setIndex] = useState(0);
  const [ready, setReady] = useState(false);
  const [finished, setFinished] = useState(false);
  const [saved, setSaved] = useState(false);
  const [history, setHistory] = useState<RiichiHistory>({ recent: [], sessions: [] });
  const historyRef = useRef<RiichiHistory>({ recent: [], sessions: [] });
  const focusRef = useRef<HTMLHeadingElement>(null);
  const gameRef = useRef<HTMLElement>(null);
  const previousIndex = useRef(0);

  useEffect(() => {
    let stored: RiichiHistory;
    try { stored = parseRiichiHistory(localStorage.getItem(storageKey)); } catch { stored = { recent: [], sessions: [] }; }
    historyRef.current = stored; setHistory(stored);
    setSession(shuffleRiichiSession(questions, "beginner", stored.recent)); setReady(true);
  }, [questions]);
  useEffect(() => {
    if (!ready) return;
    if (finished) { focusRef.current?.focus({ preventScroll: true }); focusRef.current?.parentElement?.scrollIntoView({ block: "start" }); return; }
    const id = session[index]?.id;
    if (id && historyRef.current.recent.at(-1) !== id) {
      const next = { ...historyRef.current, recent: [...historyRef.current.recent, id].slice(-20) };
      historyRef.current = next; setHistory(next);
      try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch { /* Storage is optional. */ }
    }
    if (previousIndex.current !== index) { focusRef.current?.focus({ preventScroll: true }); gameRef.current?.scrollIntoView({ block: "start" }); previousIndex.current = index; }
  }, [ready, finished, index, session]);

  const stats = riichiSessionStats(session, answers);
  const q = session[index];
  const data = q ? prepared.find((item) => item.question.id === q.id)! : null;
  const answer = q ? answers.find((item) => item.id === q.id) : null;

  function restart(level: RiichiDifficulty) {
    setDifficulty(level); setSession(shuffleRiichiSession(questions, level, historyRef.current.recent));
    setIndex(0); setAnswers([]); setFinished(false); setSaved(false); previousIndex.current = -1;
  }
  function submit(action: RiichiAction) {
    if (!q || !data || answer || !ready || (action === "riichi" && !data.canRiichi)) return;
    setAnswers((old) => old.some((item) => item.id === q.id) ? old : [...old, { id: q.id, action }]);
  }
  function next() {
    if (!answer) return;
    if (index + 1 < session.length) { setIndex(index + 1); return; }
    const nextHistory: RiichiHistory = { ...historyRef.current, sessions: [...historyRef.current.sessions, { at: new Date().toISOString(), difficulty, correct: stats.matched, total: stats.total }].slice(-20) };
    historyRef.current = nextHistory; setHistory(nextHistory);
    try { localStorage.setItem(storageKey, JSON.stringify(nextHistory)); setSaved(true); } catch { setSaved(false); }
    setFinished(true); previousIndex.current = -1;
  }

  return <div className={`${shared.workspace} ${styles.workspace}`}>
    <div className={shared.toolbar}><div className={shared.levels} role="group" aria-label="難易度">{(["beginner", "intermediate", "advanced"] as const).map((level) => <button key={level} type="button" aria-pressed={difficulty === level} className={difficulty === level ? shared.active : ""} disabled={!ready} onClick={() => restart(level)}>{difficultyLabels[level]}</button>)}</div><button className={shared.restart} type="button" disabled={!ready} title="この難易度で最初からやり直す" aria-label="この難易度で最初からやり直す" onClick={() => restart(difficulty)}><RotateCcw aria-hidden="true" /></button></div>
    <dl className={shared.scoreboard}><div><dt>推奨と一致</dt><dd>{stats.matched} / {stats.total}</dd></div><div><dt>推奨一致率</dt><dd>{stats.accuracy}%</dd></div><div><dt>連続一致</dt><dd>{stats.streak}問</dd></div></dl>
    {finished ? <section className={`panel ${shared.result}`} aria-labelledby="riichi-result"><h2 id="riichi-result" ref={focusRef} tabIndex={-1}>{session.length}問の結果</h2><strong>{stats.matched} / {stats.total}問で推奨と一致</strong><p>推奨一致率 {stats.accuracy}%</p><p className={shared.small}>一致率は教材の推奨との比較です。実戦の唯一の正解や、打ち手の強さを表す数値ではありません。</p><dl className={shared.tradeoffs}>{stats.categories.map((row) => <div key={row.category}><dt>{row.label}</dt><dd>{row.matched} / {row.total}問で一致</dd></div>)}</dl><p className={shared.small}>{saved ? "成績をこの端末に保存しました。" : "この端末では保存できませんでした。画面内の結果は確認できます。"}</p><div className={shared.resultActions}><button type="button" className="primaryCta" onClick={() => restart(difficulty)}><RotateCcw aria-hidden="true" />もう10問</button><Link href="/learn/guides/riichi-or-dama">リーチとダマの解説<ArrowRight aria-hidden="true" /></Link></div><details><summary>今回の回答を復習</summary>{session.map((question) => <section className={shared.review} key={question.id}><h3>{question.title}</h3><p>あなた：{actionLabels[answers.find((a) => a.id === question.id)!.action]} / 推奨：{actionLabels[question.recommendedAction]}{question.confidence === "medium" ? "寄り" : ""}</p><CallHand hand={prepared.find((item) => item.question.id === question.id)!.hand} /><p>{question.explanation}</p><RiichiComparison prepared={prepared.find((item) => item.question.id === question.id)!} /></section>)}</details></section> : q && data ? <section ref={gameRef} className={`panel ${shared.game}`} aria-labelledby="riichi-question-title" data-question-id={q.id}>
      <div className={`panelHeader ${shared.gameHeader}`}><span>問題 {index + 1} / {session.length}</span><span>{categoryLabels[q.category]}</span></div>
      <div className={shared.position}><strong>{q.roundWind}{q.roundNumber}局 · {q.turn}巡目</strong><span>自分：{q.seatWind}家{q.seatWind === "東" ? "（親）" : ""}</span><span>供託 {q.riichiSticks}本</span>{q.targetRank ? <span>目標：{q.targetRank}着以上</span> : null}</div>
      <RiichiScores prepared={data} />
      <p className={shared.context}>{q.context}</p>
      <div className={shared.dora}><div><span>ドラ表示牌</span><TileStrip tiles={[tileAssetName(q.doraIndicator)]} compact /></div><div><span>ドラ</span><TileStrip tiles={[tileAssetName(doraFromIndicator(q.doraIndicator))]} compact /></div></div>
      <div className={shared.questionBody}><h2 id="riichi-question-title" ref={focusRef} tabIndex={-1}>{q.title}</h2><p className={shared.small}>打牌候補を除いた門前の手牌13枚</p><CallHand hand={data.hand} /><div className={styles.candidate}><span>打牌候補</span><TileStrip tiles={[tileAssetName(q.discard)]} /><p>この牌を切ってテンパイを取ります</p></div>
      {q.rivers ? <div className={shared.rivers}><h3>判断に関係する河（抜粋）</h3>{Object.entries(q.rivers).map(([wind, river]) => <div key={wind}><span>{wind}家{wind === q.seatWind ? "（自分）" : ""}{wind === q.opponentRiichi ? "・リーチ" : ""}</span><TileStrip tiles={river!.map((tile) => tileAssetName(tile))} compact /></div>)}</div> : null}
      <p className={styles.decisionTitle}><strong>リーチする？ ダマにする？</strong></p>
      <div className={`${shared.answerActions} ${styles.answers}`} role="group" aria-label="リーチ判断">{(["riichi", "dama"] as const).map((action) => <button key={action} type="button" disabled={!ready || Boolean(answer) || (action === "riichi" && !data.canRiichi)} aria-pressed={answer?.action === action} title={action === "riichi" && !data.canRiichi ? data.reasons.join(" ") : actionLabels[action]} onClick={() => submit(action)}>{action === "riichi" ? <Zap aria-hidden="true" /> : <Minus aria-hidden="true" />}{actionLabels[action]}{action === "riichi" && !data.canRiichi ? "（宣言不可）" : ""}</button>)}</div></div>
      {answer ? <div className={shared.answer}>
        <div className={`${shared.answerStatus} ${answer.action !== q.recommendedAction ? shared.needsReview : ""}`} role="status">{answer.action === q.recommendedAction ? <Check aria-hidden="true" /> : <Info aria-hidden="true" />}<strong>{answer.action === q.recommendedAction ? "推奨と一致" : `あなた：${actionLabels[answer.action]}`}</strong><span>推奨：{actionLabels[q.recommendedAction]}{q.confidence === "medium" ? "寄り" : ""}</span></div>
        <p>{q.explanation}</p>{q.confidence === "medium" ? <p className={shared.small}>条件や重視する目的で判断が分かれます。別の選択が必ず誤りという意味ではなく、期待値の優劣も保証しません。</p> : null}
        <RiichiComparison prepared={data} /><p className={shared.checkpoint}><strong>実戦で見るポイント</strong>{q.checkpoint}</p>
        <div className={shared.resultActions}><button className="primaryCta" type="button" onClick={next}>{index + 1 === session.length ? "結果を見る" : "次の問題"}<ArrowRight aria-hidden="true" /></button><Link href="/learn/guides/riichi-or-dama">判断の基本を復習<ArrowRight aria-hidden="true" /></Link></div>
      </div> : null}
    </section> : null}
    {history.sessions.length ? <details className={shared.history}><summary>この端末の最近の成績</summary><ul>{history.sessions.slice(-5).reverse().map((item, i) => <li key={`${item.at}-${i}`}>{new Date(item.at).toLocaleDateString("ja-JP", { timeZone: "Asia/Tokyo" })} · {difficultyLabels[item.difficulty]} · {item.correct} / {item.total}問で推奨と一致</li>)}</ul></details> : null}
  </div>;
}
