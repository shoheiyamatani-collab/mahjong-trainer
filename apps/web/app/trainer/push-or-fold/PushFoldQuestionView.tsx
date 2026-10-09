import type { CSSProperties } from "react";
import Link from "next/link";
import type { ReplayTile } from "@mahjong-trainer/tenhou-analysis/types";
import { TileStrip, getTileName, tileAssetName } from "../../components/TileFigures";
import { doraFromIndicator } from "../call-or-pass/callModel";
import { seats, type PreparedPushFoldQuestion, type PushFoldBranch, type PushFoldQuestion, type PushFoldValue } from "./pushFoldTypes";
import shared from "../call-or-pass/call.module.css";
import styles from "./pushFold.module.css";

export const tileLabel = (tile: ReplayTile) => getTileName(tileAssetName(tile.tile, tile.red));
const asset = (tile: ReplayTile) => tileAssetName(tile.tile, tile.red);
export const shantenLabel = (shanten: number) => shanten === 0 ? "テンパイ" : `${shanten}シャンテン`;
export function PhysicalTiles({ tiles, compact = false }: { tiles: ReplayTile[]; compact?: boolean }) { return <TileStrip tiles={tiles.map(asset)} compact={compact} />; }

export function PushFoldHand({ question: q }: { question: PushFoldQuestion }) {
  const self = q.players.find((p) => p.seat === q.seatWind)!;
  const concealed = [...q.hand.filter((tile) => tile.id !== q.drawnTileId), q.hand.find((tile) => tile.id === q.drawnTileId)!];
  const tiles = [...concealed, ...self.melds.flatMap((meld) => meld.tiles)];
  return <><div className={shared.hand} style={{ "--call-tile-count": tiles.length } as CSSProperties} aria-label="ツモ直後の自分の手牌・副露" data-testid="push-fold-hand">
    {tiles.map((tile, i) => <div key={tile.id} className={`${styles.handTile} ${tile.id === q.drawnTileId ? styles.drawn : ""} ${i >= concealed.length && (i - concealed.length) % 3 === 0 ? styles.meldStart : ""}`}><PhysicalTiles tiles={[tile]} /></div>)}
  </div><p className={styles.meldLabel}>枠付き：ツモ牌{self.melds.length ? ` ／ 右端の${self.melds.length * 3}枚：副露（${self.melds.map((m) => `${m.kind === "chi" ? "チー" : "ポン"}・${seats[m.from]}家から`).join("、")}）` : " ／ 門前14枚"}</p></>;
}

export function PushFoldPosition({ prepared: item }: { prepared: PreparedPushFoldQuestion }) {
  const q = item.question;
  return <>
    <div className={shared.position}><strong>{q.roundWind}{q.roundNumber}局 · {q.turn}巡目</strong><span>{q.honba}本場 · 供託{q.riichiSticks}本</span><span>自分：{q.seatWind}家{q.seatWind === "東" ? "（親）" : "（子）"}</span>{q.targetRank ? <span>目標：{q.targetRank}着以上</span> : null}</div>
    <dl className={shared.playerScores}>{q.players.map((p, i) => { const rank = item.ranking.find((r) => r.seat === p.seat)!; return <div key={p.seat} className={p.seat === q.seatWind ? shared.self : ""}><dt>{p.seat}家{p.seat === q.seatWind ? "・自分" : p.seat === "東" ? "・親" : ""} / {rank.rank}位{rank.tied ? "同点" : ""}</dt><dd>{q.scores[i].toLocaleString("ja-JP")}</dd></div>; })}</dl>
    <p className={shared.context}>{q.context}</p>
    <div className={shared.dora}><div><span>ドラ表示牌</span><PhysicalTiles tiles={q.doraIndicators} compact /></div><div><span>ドラ</span><TileStrip tiles={q.doraIndicators.map((t) => tileAssetName(doraFromIndicator(t.tile)))} compact /></div></div>
  </>;
}

export function PushFoldRivers({ question: q }: { question: PushFoldQuestion }) {
  return <div className={styles.riverGrid} aria-label="各家の河と攻撃状態">{q.players.map((p, i) => {
      const relative = ["自分", "下家", "対面", "上家"][(i - seats.indexOf(q.seatWind) + 4) % 4];
      return <section key={p.seat} className={styles.river}><h3>{p.seat}家・{relative}{p.seat === "東" ? "（親）" : ""}<br />{p.riichi ? <strong>リーチ・{p.riichi.turn}打目</strong> : p.attacking ? <strong>副露の攻撃・テンパイ不明</strong> : "リーチなし"}</h3><div className={styles.riverTiles}>{p.river.map((r) => <div key={r.tile.id} className={`${styles.riverTile} ${r.riichi ? styles.declaration : ""} ${r.calledBy !== null ? styles.called : ""}`} title={`${r.turn}打目・${tileLabel(r.tile)}・${r.tsumogiri ? "ツモ切り" : "手出し"}${r.riichi ? "・リーチ宣言" : ""}${r.calledBy !== null ? `・${seats[r.calledBy]}家が鳴いた牌` : ""}`}><PhysicalTiles tiles={[r.tile]} compact /><span>{r.riichi ? "宣言" : r.calledBy !== null ? "鳴" : r.tsumogiri ? "ツ" : "手"}</span></div>)}</div>{p.melds.length ? <div className={shared.effective}><p className={styles.meldLabel}>副露：{p.melds.map((m) => `${m.kind === "chi" ? "チー" : "ポン"}（${seats[m.from]}家から）`).join("、")}</p><PhysicalTiles tiles={p.melds.flatMap((m) => m.tiles)} compact /></div> : null}</section>;
    })}</div>
}

function valueLabel(value: PushFoldValue | null, tsumo = false) {
  return value ? `${value.yaku.join("・")} / ${value.han}翻${value.fu}符 / ${tsumo ? `${value.payments.map((p) => p.points.toLocaleString("ja-JP")).join("・")}支払い、計` : ""}${value.totalPoints.toLocaleString("ja-JP")}点` : "通常のアガリ不可";
}
function Branch({ item, branch, title }: { item: PreparedPushFoldQuestion; branch: PushFoldBranch; title: string }) {
  const q = item.question;
  return <section className={shared.branch}><h3>{title}：{tileLabel(branch.discard)}を切る</h3><div className={shared.metrics}><strong>{shantenLabel(branch.shanten)}</strong><span>ドラ{branch.dora}・赤{branch.redDora}</span>{q.declareRiichi && q.discards.push.includes(branch.discard.id) ? <strong>リーチする枝</strong> : null}</div><p className={shared.small}>{branch.shanten ? "テンパイまで、さらに有効牌による進行が必要です。アガリ役・点数はまだ確定しません。" : branch.furiten ? "フリテン：待ち全体でロン不可。ツモの役・点数は別に確認します。" : "待ちごとの役・点数を比較します。一発・裏ドラは含めません。"}</p>{branch.meldYaku.map((yaku) => <p key={yaku} className={shared.small}>{yaku}</p>)}
    <div className={shared.effective}><TileStrip tiles={branch.ukeire.map((tile) => tileAssetName(tile.tile))} compact /><span>{branch.shanten === 0 ? "待ち" : "シャンテンを進める有効牌"}：{branch.ukeire.length}種類・見えていない枚数の上限{branch.ukeireCount}枚</span><span>{branch.ukeire.map((t) => `${getTileName(tileAssetName(t.tile))}${t.remaining}枚`).join(" / ") || "残る有効牌なし"}</span></div>
    {branch.values.length ? <dl className={styles.valueRows}>{branch.values.map((wait) => <div key={`${wait.tile}-${wait.red}`}><dt><TileStrip tiles={[tileAssetName(wait.tile, wait.red)]} compact />上限{wait.remaining}枚</dt><dd>ロン：{valueLabel(wait.ron)}<br />ツモ：{valueLabel(wait.tsumo, true)}</dd></div>)}</dl> : branch.shanten === 0 ? <p className={shared.warning}>待ち牌はすべて見えています。新たなアガリ牌を通常の山から引く余地はありません。</p> : null}
  </section>;
}

export function PushFoldExplanation({ prepared: item, selectedId }: { prepared: PreparedPushFoldQuestion; selectedId?: number | null }) {
  const q = item.question, push = item.branches.find((b) => b.discard.id === q.discards.push[0])!, fold = item.branches.find((b) => b.discard.id === q.discards.fold[0])!;
  const selected = selectedId !== null && selectedId !== undefined ? item.branches.find((b) => b.discard.id === selectedId) : null;
  const candidates = [...new Map([push, fold, ...(selected ? [selected] : [])].map((b) => [b.discard.id, b])).values()];
  return <>
    <p>{q.valuePlan}</p><div className={shared.comparison}><Branch item={item} branch={push} title="押す候補" /><Branch item={item} branch={fold} title="守備の最初の候補" /></div>
    {selected && ![push.discard.id, fold.discard.id].includes(selected.discard.id) ? <Branch item={item} branch={selected} title="あなたの打牌" /> : null}
    <p className={shared.warning}>枚数は自分の手牌・全員の河・副露・ドラ表示牌を差し引いた上限です。相手の手牌・王牌・残りの山の内訳は不明で、アガリ率・放銃率ではありません。</p>
    <h3>相手の攻撃で分かること</h3><ul className={styles.attackText}>{q.players.filter((p) => p.riichi || p.attacking).map((p) => <li key={p.seat}><strong>{p.seat}家{p.seat === "東" ? "（親）" : "（子）"}</strong>：{p.riichi ? "リーチしているためテンパイ。待ち・役・ドラ・最終打点は不明です。" : "中のポンに役牌1翻があり、2副露しています。テンパイや最終打点は未確定です。"}</li>)}</ul>
    <table className={styles.safety}><caption>打牌候補の安全情報：相手ごとに照合</caption><thead><tr><th scope="col">打牌</th><th scope="col">相手</th><th scope="col">根拠・残る待ち</th></tr></thead><tbody>{candidates.flatMap((b) => b.safety.map((fact) => <tr key={`${b.discard.id}-${fact.opponent}`}><td><PhysicalTiles tiles={[b.discard]} compact /></td><td>{fact.opponent}家</td><td><strong>{fact.labels.join(" / ")}{fact.dora ? " / ドラ" : ""}{fact.red ? " / 赤" : ""}</strong><small>{fact.reason}</small>{fact.noChance.length ? <small>4枚見え：{fact.noChance.map((t) => getTileName(tileAssetName(t))).join("、")}</small> : null}{fact.oneChance.length ? <small>3枚見え：{fact.oneChance.map((t) => getTileName(tileAssetName(t))).join("、")}</small> : null}<small>残り得る待ち：{fact.possibleWaits.join("・") || "この相手からのロンなし"}</small></td></tr>))}</tbody></table>
    <div className={shared.comparison}><section className={shared.branch}><h3>押すメリット・負担</h3>{[...q.pushBenefits, ...q.pushRisks].map((s) => <p key={s}>{s}</p>)}</section><section className={shared.branch}><h3>オリるメリット・負担</h3>{[...q.foldBenefits, ...q.foldCosts].map((s) => <p key={s}>{s}</p>)}</section></div>
    <p className={shared.checkpoint}><strong>判断が変わる条件</strong>{q.changes.join(" ")}</p>
    {q.turn >= 14 || q.targetRank ? <details className={styles.more}><summary>流局時の点棒を条件別に比較</summary><p className={shared.small}>今の押す候補の形を維持した場合と、完全にオリてノーテンになった場合の比較です。他家の未知の手はテンパイ・ノーテンを両方試算します。供託は次局へ持ち越し。押す枝でリーチする場合は1,000点を出し、流局時は戻らない分も差し引きます。流局まで形を保てる保証はありません。</p><ul>{[...new Map(item.drawCases.map((c) => [JSON.stringify(c), c])).values()].map((row, i) => <li key={i}>{row.label}：形を維持 {row.pushGain > 0 ? "+" : ""}{row.pushGain}点 / ノーテン {row.foldLoss > 0 ? "+" : ""}{row.foldLoss}点</li>)}</ul><p className={shared.small}>親がテンパイなら連荘。同点相手を自分より上として目標判定し、親のアガリや流局だけで半荘終了とは断定しません。</p></details> : null}
    {item.outcomes.length ? <details className={styles.more}><summary>アガリ牌・出所ごとの着順条件</summary><p className={shared.small}>本場・供託を含み、自分のリーチ棒はアガリ時に返却。同点相手は自分より上として目標判定。親アガリでは連荘とし、アガリやめを採用しません。</p><ul>{item.outcomes.map((outcome, i) => <li key={i}>{outcome.label}：{outcome.rank}位{outcome.tied ? "同点" : ""} / {outcome.achieved ? "目標到達" : "目標未達"}{outcome.dealerContinues ? "・親の連荘" : ""}</li>)}</ul></details> : null}
    <details className={styles.more}><summary>全打牌のシャンテン・受け入れを確認</summary><ul>{item.branches.filter((b, i, all) => all.findIndex((other) => other.discard.tile === b.discard.tile && other.discard.red === b.discard.red) === i).map((b) => <li key={b.discard.id}>{tileLabel(b.discard)}：{shantenLabel(b.shanten)}・上限{b.ukeireCount}枚{b.safeToAll ? "・攻撃者全員の現物" : ""}</li>)}</ul></details>
    <div className={shared.resultActions}>{item.checkerHref ? <Link href={item.checkerHref}>この手牌を牌理チェッカーへ</Link> : <Link href="/tools">副露手の役・点数を計算</Link>}<Link href="/trainer/riichi-or-dama">リーチ？ダマ？</Link><Link href="/learn/guides/betaori-basics">ベタオリの基本</Link><Link href="/analysis/orasu-condition">オーラス条件計算</Link></div>
    <details className={styles.more}><summary>教材の検証方法と参考資料</summary><p className={shared.small}>{q.review.method}（{q.review.at}）。推奨は雀フォリオの編集判断で、公式の戦術解や専門家監修ではありません。</p><ul>{q.sources.map((source) => <li key={source}><a href={source}>{source.startsWith("/") ? "関連学習記事" : source.includes("tenhou") ? "天鳳公式ルール" : "Mリーグ公式ルール"}</a></li>)}</ul></details>
  </>;
}
