"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Check, Info, Layers, Minus, RotateCcw } from "lucide-react";
import { TileStrip, tileAssetName } from "../../components/TileFigures";
import { CallComparison, CallHand, callTileName, type PreparedCallQuestion } from "./CallQuestionView";
import { actionLabels, callSessionStats, categoryLabels, difficultyLabels, doraFromIndicator, opponentLabels, parseCallHistory, shuffleCallSession, type CallAction, type CallAnswer, type CallDifficulty, type CallHistory } from "./callModel";
import styles from "./call.module.css";

const storageKey = "jongfolio:call-or-pass:v1";
const winds = ["東", "南", "西", "北"];
const relativeSeat = (seat: string, opponent: string) => winds[(winds.indexOf(seat) + ({ kamicha: 3, toimen: 2, shimocha: 1 }[opponent] ?? 0)) % 4];

export function CallTrainingClient({ prepared }: { prepared: PreparedCallQuestion[] }) {
  const questions = useMemo(() => prepared.map((item) => item.question), [prepared]);
  const [difficulty, setDifficulty] = useState<CallDifficulty>("beginner");
  const [session, setSession] = useState(() => questions.filter((q) => q.difficulty === "beginner"));
  const [answers, setAnswers] = useState<CallAnswer[]>([]);
  const [index, setIndex] = useState(0);
  const [ready, setReady] = useState(false);
  const [finished, setFinished] = useState(false);
  const [saved, setSaved] = useState(false);
  const [history, setHistory] = useState<CallHistory>({ recent: [], sessions: [] });
  const historyRef = useRef<CallHistory>({ recent: [], sessions: [] });
  const focusRef = useRef<HTMLHeadingElement>(null);
  const previousIndex = useRef(0);

  useEffect(() => {
    let stored: CallHistory;
    try { stored = parseCallHistory(localStorage.getItem(storageKey)); } catch { stored = { recent: [], sessions: [] }; }
    historyRef.current = stored; setHistory(stored);
    setSession(shuffleCallSession(questions, "beginner", stored.recent)); setReady(true);
  }, [questions]);
  useEffect(() => {
    if (!ready) return;
    if (finished) { focusRef.current?.focus({ preventScroll: true }); focusRef.current?.scrollIntoView({ block: "start" }); return; }
    const id = session[index]?.id;
    if (id && historyRef.current.recent.at(-1) !== id) {
      const next = { ...historyRef.current, recent: [...historyRef.current.recent, id].slice(-20) };
      historyRef.current = next; setHistory(next);
      try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch { /* Storage is optional. */ }
    }
    if (previousIndex.current !== index) { focusRef.current?.focus({ preventScroll: true }); focusRef.current?.scrollIntoView({ block: "start" }); previousIndex.current = index; }
  }, [ready, finished, index, session]);

  const stats = callSessionStats(session, answers);
  const current = session[index];
  const data = current ? prepared.find((item) => item.question.id === current.id)! : null;
  const answer = current ? answers.find((item) => item.id === current.id) : null;
  const weakest = [...stats.categories].filter((row) => row.correct < row.total).sort((a, b) => a.correct / a.total - b.correct / b.total)[0];

  function restart(level: CallDifficulty) {
    setDifficulty(level); setSession(shuffleCallSession(questions, level, historyRef.current.recent));
    setIndex(0); setAnswers([]); setFinished(false); setSaved(false); previousIndex.current = -1;
  }
  function submit(action: CallAction) {
    if (!current || answer || !ready || (action !== "pass" && !current.options.some((option) => option.action === action))) return;
    setAnswers((old) => old.some((item) => item.id === current.id) ? old : [...old, { id: current.id, action }]);
  }
  function next() {
    if (!answer) return;
    if (index + 1 < session.length) { setIndex(index + 1); return; }
    const nextHistory: CallHistory = { ...historyRef.current, sessions: [...historyRef.current.sessions, { at: new Date().toISOString(), difficulty, correct: stats.correct, total: stats.total }].slice(-20) };
    historyRef.current = nextHistory; setHistory(nextHistory);
    try { localStorage.setItem(storageKey, JSON.stringify(nextHistory)); setSaved(true); } catch { setSaved(false); }
    setFinished(true);
    previousIndex.current = -1;
  }

  return <div className={styles.workspace}>
    <div className={styles.toolbar}><div className={styles.levels} role="group" aria-label="難易度">{(["beginner", "intermediate", "advanced"] as const).map((level) => <button key={level} type="button" aria-pressed={difficulty === level} className={difficulty === level ? styles.active : ""} disabled={!ready} onClick={() => restart(level)}>{difficultyLabels[level]}</button>)}</div><button className={styles.restart} type="button" disabled={!ready} title="この難易度で最初からやり直す" aria-label="この難易度で最初からやり直す" onClick={() => restart(difficulty)}><RotateCcw aria-hidden="true" /></button></div>
    <dl className={styles.scoreboard}><div><dt>正解</dt><dd>{stats.correct} / {stats.total}</dd></div><div><dt>正答率</dt><dd>{stats.accuracy}%</dd></div><div><dt>連続正解</dt><dd>{stats.streak}問</dd></div></dl>
    {finished ? <section className={`panel ${styles.result}`} aria-labelledby="call-result"><h2 id="call-result" ref={focusRef} tabIndex={-1}>10問の結果</h2><strong>{stats.correct} / {stats.total}問正解</strong><p>正答率 {stats.accuracy}%</p><dl className={styles.tradeoffs}>{stats.categories.map((row) => <div key={row.category}><dt>{row.label}</dt><dd>{row.correct} / {row.total}問（{Math.round(row.correct / row.total * 100)}%）</dd></div>)}</dl><p>{weakest ? `${weakest.label}を復習しましょう。鳴いた後の形と、推奨の理由をもう一度比べてください。` : "全問で推奨判断を選べました。別の難易度でも場況と手牌を比べてみましょう。"}</p><p className={styles.small}>{saved ? "成績をこの端末に保存しました。" : "この端末では保存できませんでした。画面内の結果は確認できます。"}</p><div className={styles.resultActions}><button type="button" className="primaryCta" onClick={() => restart(difficulty)}><RotateCcw aria-hidden="true" />もう10問</button><a className="secondaryCta" href="#call-learning">関連学習を見る<ArrowRight aria-hidden="true" /></a></div><details><summary>今回の回答を復習</summary>{session.map((question) => <section className={styles.review} key={question.id}><h3>{question.title}</h3><p>あなた：{actionLabels[answers.find((a) => a.id === question.id)!.action]} / 推奨：{actionLabels[question.recommendedAction]}</p><p>{question.explanation}</p><CallComparison prepared={prepared.find((item) => item.question.id === question.id)!} /></section>)}</details></section> : current && data ? <section className={`panel ${styles.game}`} aria-labelledby="call-question-title" data-question-id={current.id}>
      <div className={`panelHeader ${styles.gameHeader}`}><span>問題 {index + 1} / {session.length}</span><span>{categoryLabels[current.category]}</span></div>
      <div className={styles.position}><strong>{current.roundWind}{current.roundNumber}局 · {current.turn}巡目</strong><span>自分：{current.seatWind}家{current.seatWind === "東" ? "（親）" : ""}</span><span>供託 {current.riichiSticks ?? 0}本</span></div>
      <dl className={styles.playerScores} aria-label="点棒状況">{winds.map((wind, i) => <div className={wind === current.seatWind ? styles.self : ""} key={wind}><dt>{wind}家{wind === current.seatWind ? "（自分）" : ""}{current.riichiBy && wind === relativeSeat(current.seatWind, current.riichiBy) ? "・立直" : ""}</dt><dd>{current.scores[i]!.toLocaleString()}</dd></div>)}</dl>
      <p className={styles.context}>{current.context}</p>
      <div className={styles.dora}><div><span>ドラ表示牌</span><TileStrip tiles={[tileAssetName(current.doraIndicator)]} compact /></div><div><span>ドラ</span><TileStrip tiles={[tileAssetName(doraFromIndicator(current.doraIndicator))]} compact /></div></div>
      <div className={styles.questionBody}><h2 id="call-question-title" ref={focusRef} tabIndex={-1}>この牌を鳴く？</h2><p className={styles.small}>自分の手牌 {data.comparison.pass.hand.length}枚{current.melds?.length ? ` + 副露${current.melds.length}組` : ""}</p><CallHand hand={data.comparison.pass.hand} melds={current.melds} />
      {current.rivers ? <div className={styles.rivers}><h3>判断に関係する河（抜粋）</h3>{Object.entries(current.rivers).map(([who, river]) => <div key={who}><span>{who === "self" ? "自分" : opponentLabels[who as keyof typeof opponentLabels]}{current.riichiBy === who ? "・リーチ" : ""}</span><TileStrip tiles={river!.map((tile) => tileAssetName(tile))} compact /></div>)}</div> : null}
      <div className={styles.offered}><TileStrip tiles={[tileAssetName(current.offered)]} /><p><strong>{opponentLabels[current.offeredBy]}</strong>が<strong>{callTileName(current.offered)}</strong>を切りました</p></div>
      {data.multipleChiForms ? <p className={styles.small}>比較するチー：{[...current.options.find((o) => o.action === "chi")!.consumed, current.offered].sort().map(callTileName).join("・")} / 打牌：{callTileName(current.options.find((o) => o.action === "chi")!.discard)}</p> : null}
      <div className={styles.answerActions} role="group" aria-label="鳴き判断">{(["pon", "chi", "pass"] as const).map((action) => {
        const available = action === "pass" || current.options.some((option) => option.action === action);
        return <button key={action} type="button" disabled={!ready || Boolean(answer) || !available} aria-pressed={answer?.action === action} title={!available ? "この牌・位置からは鳴けません" : actionLabels[action]} onClick={() => submit(action)}>{action === "pass" ? <Minus aria-hidden="true" /> : <Layers aria-hidden="true" />}{actionLabels[action]}</button>;
      })}</div></div>
      {answer ? <div className={styles.answer}>
        <div className={`${styles.answerStatus} ${answer.action !== current.recommendedAction ? styles.needsReview : ""}`} role="status">{answer.action === current.recommendedAction ? <Check aria-hidden="true" /> : <Info aria-hidden="true" />}<strong>{answer.action === current.recommendedAction ? "推奨と一致" : `あなた：${actionLabels[answer.action]}`}</strong><span>推奨：{actionLabels[current.recommendedAction]}{current.confidence === "medium" ? "寄り" : ""}</span></div>
        <p>{current.explanation}</p>{current.confidence === "medium" ? <p className={styles.small}>場況や重視する目的で判断が分かれる問題です。正答率は教材の推奨判断との一致率で、唯一の最善打を保証しません。</p> : null}
        <CallComparison prepared={data} />
        <p className={styles.checkpoint}><strong>実戦で見るポイント</strong>{current.checkpoint}</p>
        <p className={styles.small}>受け入れは手牌・副露・ドラ表示牌・表示した河・今回の捨て牌を差し引いた上限です。省略した河や他家の手牌、実際の山は不明です。点数は裏ドラ・赤ドラ・本場・供託・リーチを加えない現在形の値。未テンパイの打点は見込みで、成立を保証しません。</p>
        <div className={styles.resultActions}><button className="primaryCta" type="button" onClick={next}>{index + 1 === session.length ? "結果を見る" : "次の問題"}<ArrowRight aria-hidden="true" /></button><Link href="/analysis/mahjong-tool">牌理チェッカー<ArrowRight aria-hidden="true" /></Link></div>
      </div> : null}
    </section> : null}
    {history.sessions.length ? <details className={styles.history}><summary>この端末の最近の成績</summary><ul>{history.sessions.slice(-5).reverse().map((item, i) => <li key={`${item.at}-${i}`}>{new Date(item.at).toLocaleDateString("ja-JP", { timeZone: "Asia/Tokyo" })} · {difficultyLabels[item.difficulty]} · {item.correct} / {item.total}問</li>)}</ul></details> : null}
  </div>;
}
