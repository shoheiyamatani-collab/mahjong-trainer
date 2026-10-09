"use client";

import { useEffect, useState } from "react";
import { Copy, Link as LinkIcon, Minus, Plus, RotateCcw } from "lucide-react";
import { calculateTileCombos } from "@mahjong-trainer/mahjong-core";
import { ComboExplanation, ComboTiles, comboTileName } from "./ComboExplanation";
import { decodeComboSimulator, encodeComboSimulator, initialSimulator, validateSimulator, type ComboSimulatorState } from "./comboModel";
import styles from "./combo.module.css";

const storageKey = "jongfolio-combo-simulator-v1";
export function ComboSimulator() {
  const [state, setState] = useState(initialSimulator);
  const [suit, setSuit] = useState(0);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [share, setShare] = useState("");
  useEffect(() => {
    try {
      if (new URLSearchParams(location.search).has("combo")) setState(decodeComboSimulator(location.search));
      else { const saved = localStorage.getItem(storageKey); if (saved) setState(decodeComboSimulator(saved)); }
    } catch (cause) { setError(cause instanceof Error ? cause.message : "保存データを読み込めませんでした。"); }
    setReady(true);
  }, []);
  function update(next: ComboSimulatorState) {
    try {
      validateSimulator(next); setState(next); setError(""); setShare(""); setNotice("");
      try { localStorage.setItem(storageKey, encodeComboSimulator(next)); } catch { setNotice("この端末では保存できません。計算は利用できます。"); }
    } catch (cause) { setError(cause instanceof Error ? cause.message : "入力が不正です。"); }
  }
  function step(tile: number, delta: number, river = false) {
    const next = { ...state, visibleCounts: [...state.visibleCounts], riichiRiver: [...state.riichiRiver!] };
    if (river) { next.riichiRiver[tile] = Math.max(0, Math.min(4, next.riichiRiver[tile]! + delta)); next.visibleCounts[tile] = Math.max(next.visibleCounts[tile]!, next.riichiRiver[tile]!); }
    else next.visibleCounts[tile] = Math.max(next.riichiRiver[tile]!, Math.min(4, next.visibleCounts[tile]! + delta));
    update(next);
  }
  function toggle(tile: number) {
    if (state.targets.includes(tile)) { if (state.targets.length > 1) update({ ...state, targets: state.targets.filter(target => target !== tile) }); }
    else if (state.targets.length < 3) update({ ...state, targets: [...state.targets, tile] });
  }
  function makeShare() {
    const url = new URL(location.href); url.search = encodeComboSimulator(state); url.hash = "combo-workspace"; setShare(url.toString()); setNotice("");
  }
  const indexes = Array.from({ length: suit === 3 ? 7 : 9 }, (_, i) => suit * 9 + i);
  const results = !error ? state.targets.map(target => calculateTileCombos(target, state)) : [];
  return <section className={styles.simulator} aria-labelledby="combo-simulator-title">
    <div className={styles.sectionTop}><h2 id="combo-simulator-title">見えている牌から比較</h2><button type="button" className={styles.iconButton} title="入力をリセット" aria-label="入力をリセット" onClick={() => update(initialSimulator())}><RotateCcw aria-hidden="true" /></button></div>
    <div className={styles.segment} role="group" aria-label="計算モデル"><button aria-pressed={state.model === "basic"} onClick={() => update({ ...state, model: "basic" })}>基本モデル</button><button aria-pressed={state.model === "riichi"} onClick={() => update({ ...state, model: "riichi" })}>対リーチモデル</button></div>
    <div className={styles.targets}><span>比較する牌（1〜3種）</span>{state.targets.map(target => <span key={target}><ComboTiles tiles={[target]} compact /><strong>{comboTileName(target)}</strong></span>)}</div>
    <div className={styles.segment} role="group" aria-label="入力する牌の種類">{["萬子", "筒子", "索子", "字牌"].map((label, i) => <button aria-pressed={suit === i} key={label} onClick={() => setSuit(i)}>{label}</button>)}</div>
    <div className={styles.tileInputs}>{indexes.map(tile => <div className={styles.tileInput} key={tile}>
      <button type="button" aria-label={`${comboTileName(tile)}を比較対象に${state.targets.includes(tile) ? "含めない" : "する"}`} aria-pressed={state.targets.includes(tile)} disabled={!ready || (!state.targets.includes(tile) && state.targets.length >= 3) || (state.targets.includes(tile) && state.targets.length === 1)} className={styles.tileTarget} onClick={() => toggle(tile)}><ComboTiles tiles={[tile]} /><span>{comboTileName(tile)}</span></button>
      <div><span>見えている枚数</span><div className={styles.stepper}><button title="1枚減らす" aria-label={`${comboTileName(tile)}の見えている枚数を減らす`} disabled={!ready || state.visibleCounts[tile] === state.riichiRiver![tile]} onClick={() => step(tile, -1)}><Minus aria-hidden="true" /></button><output aria-label={`${comboTileName(tile)}の見えている枚数`}>{state.visibleCounts[tile]}</output><button title="1枚増やす" aria-label={`${comboTileName(tile)}の見えている枚数を増やす`} disabled={!ready || state.visibleCounts[tile] === 4} onClick={() => step(tile, 1)}><Plus aria-hidden="true" /></button></div></div>
      {state.model === "riichi" ? <div className={styles.riverInput}><span>うちリーチ者本人の河</span><div className={styles.stepper}><button title="本人の河を1枚減らす" aria-label={`${comboTileName(tile)}の本人の河の枚数を減らす`} disabled={!ready || state.riichiRiver![tile] === 0} onClick={() => step(tile, -1, true)}><Minus aria-hidden="true" /></button><output>{state.riichiRiver![tile]}</output><button title="本人の河を1枚増やす" aria-label={`${comboTileName(tile)}の本人の河の枚数を増やす`} disabled={!ready || state.riichiRiver![tile] === 4} onClick={() => step(tile, 1, true)}><Plus aria-hidden="true" /></button></div></div> : null}
    </div>)}</div>
    {state.model === "riichi" ? <details className={styles.detail}><summary>シャンポンの相方を指定（任意）</summary>{state.targets.map(target => <label className={styles.partner} key={target}>{comboTileName(target)}の相方<select aria-label={`${comboTileName(target)}のシャンポンの相方`} value={state.shanponPartners?.[target] ?? ""} onChange={event => {
      const partners = { ...state.shanponPartners }; if (event.target.value === "") delete partners[target]; else partners[target] = Number(event.target.value); update({ ...state, shanponPartners: partners });
    }}><option value="">不明（条件付きで数える）</option>{Array.from({ length: 34 }, (_, tile) => tile).filter(tile => tile !== target).map(tile => <option value={tile} key={tile}>{comboTileName(tile)}</option>)}</select></label>)}</details> : null}
    {error ? <p role="alert" className={styles.caution}>{error} 入力をリセットして再試行できます。</p> : <ComboExplanation input={state} results={results} />}
    <div className={styles.actions}><button type="button" className="secondaryCta" disabled={!ready || Boolean(error)} onClick={makeShare}><LinkIcon aria-hidden="true" />共有URLを作成</button></div>
    {share ? <div className={styles.share}><label>共有URL<input readOnly value={share} onFocus={event => event.currentTarget.select()} /></label><button className={styles.iconButton} title="共有URLをコピー" aria-label="共有URLをコピー" onClick={async () => { try { await navigator.clipboard.writeText(share); setNotice("共有URLをコピーしました。"); } catch { setNotice("コピーできませんでした。URL欄から取得できます。"); } }}><Copy aria-hidden="true" /></button></div> : null}
    {notice ? <p role="status" className={styles.small}>{notice}</p> : null}
    <p className={styles.small}>本人の河は見えている総枚数の内数です。鳴かれた捨て牌と副露を二重に足さないでください。状態はこの端末だけに保存します。</p>
  </section>;
}
