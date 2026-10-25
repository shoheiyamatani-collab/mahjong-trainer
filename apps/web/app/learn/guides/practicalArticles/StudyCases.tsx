import Link from "next/link";
import type { CSSProperties } from "react";
import { ORASU_SEATS, calculateOrasuConditions, calculateOrasuDraw, countsToTiles, formatOrasuCandidate, parseHand } from "@mahjong-trainer/mahjong-core";
import { TileStrip, tileAssetName } from "../../../components/TileFigures";
import { checkerHref, shantenWords, studyDiscardRows, studyProgress, studyScores, tileWords } from "./studyAnalysis";
import type { StudyCase } from "./types";
import styles from "./studyCases.module.css";
import { orasuConditionHref } from "../../../analysis/orasu-condition/sharedCondition";

const seatNames = { east: "東家（親）", south: "南家", west: "西家", north: "北家" };
const points = (value: number) => value.toLocaleString("ja-JP");
const assetHand = (text: string) => countsToTiles(parseHand(text)).map((tile) => tileAssetName(tile));

export function StudyCases({ cases }: { cases: StudyCase[] }) {
  return <div className={styles.cases}>{cases.length >= 5 ? <nav className="articleContents" aria-label="局面の目次"><strong>{cases.length}局面を選ぶ</strong><ol>{cases.map((example) => <li key={example.id}><a href={`#case-${example.id}`}>{example.title}</a></li>)}</ol></nav> : null}{cases.map((example, index) => {
    const orasu = example.orasu ? calculateOrasuConditions(example.orasu) : null;
    const draw = example.orasu && example.drawTenpaiSeats ? calculateOrasuDraw(example.orasu.scores, example.drawTenpaiSeats) : null;
    return <section className={styles.example} id={`case-${example.id}`} key={example.id}>
      <p className={styles.number}>局面 {String(index + 1).padStart(2, "0")}</p>
      <h3>{example.title}</h3><p>{example.situation}</p>
      {example.rivers?.map((river) => <figure className={styles.river} key={river.label}><figcaption>{river.label}</figcaption><div className={styles.riverTiles}>{river.tiles.map((tile, tileNumber) => <div key={`${tile}-${tileNumber}`}><TileStrip tiles={[tileAssetName(tile)]} compact />{river.marks ? <span>{river.marks[tileNumber]}</span> : null}</div>)}</div></figure>)}
      {example.visible ? <figure className={styles.hand}><figcaption>ほかの公開牌（上の河とは重複なし）</figcaption><TileStrip tiles={assetHand(example.visible)} compact /></figure> : null}
      {example.hands?.map((hand) => {
        const rows = studyDiscardRows(example, hand);
        const total = countsToTiles(parseHand(hand.tiles)).length + (hand.melds?.length ?? 0) * 3;
        const progress = total === 13 ? studyProgress(example, hand) : null;
        const scores = studyScores(hand);
        return <div className={styles.handBlock} key={hand.label}>
          <figure className={styles.hand}><figcaption>{hand.label}</figcaption><div className={styles.handScroll} style={{ "--study-hand-tiles": countsToTiles(parseHand(hand.tiles)).length } as CSSProperties}><TileStrip tiles={assetHand(hand.tiles)} /></div>{hand.melds?.map((meld, meldIndex) => <div className={styles.meld} key={meldIndex}><span>{meld.kind === "pon" ? "ポン" : "チー"}</span><TileStrip tiles={meld.tiles.map((tile) => tileAssetName(tile))} compact /></div>)}</figure>
          {progress ? <p className={styles.progress}>進行：<strong>{shantenWords(progress.shanten)}</strong>{progress.shanten === 0 ? <> ／ 待ち：{tileWords(progress.waits)} ／ 見えていない枚数：<strong>{progress.ukeireCount}枚</strong></> : null}</p> : null}
          {rows.length ? <><div className={styles.tableScroll}><table><caption>主な候補と通常手の枚数基準（手牌・捨てた牌・上記の公開牌を差し引く）</caption><thead><tr><th scope="col">切る牌</th><th scope="col">進行</th><th scope="col">枚数</th><th scope="col">有効牌</th>{hand.compareChiitoitsu ? <th scope="col">七対子の進行</th> : null}</tr></thead><tbody>{rows.map((row) => <tr key={row.discard}><th scope="row">{tileWords([row.discard])}{row.isMaximum ? <small> 枚数基準</small> : null}</th><td>{shantenWords(row.afterDiscardShanten)}</td><td>{row.ukeireTiles}枚</td><td>{tileWords(row.ukeire) || "なし"}</td>{hand.compareChiitoitsu ? <td>{shantenWords(row.chiitoitsu)}</td> : null}</tr>)}</tbody></table></div><Link className={styles.toolLink} href={checkerHref(hand.tiles)}>この14枚を牌理チェッカーへ</Link></> : null}
          {rows.length > 0 && (example.visible || example.rivers?.length) ? <p>チェッカーには手牌14枚を渡します。公開牌は上の図に合わせて追加入力すると、この記事と同じ未見枚数を確認できます。</p> : null}
          {scores.length ? <div className={styles.tableScroll}><table><caption>{tileWords([hand.score!.winningTile])}ロンの比較（東場・{hand.score!.dealer ? "親" : "南家"}、ドラ{hand.score!.dora ?? 0}枚、赤・一発・裏ドラ・本場・供託なし）</caption><thead><tr><th scope="col">選択</th><th scope="col">役</th><th scope="col">翻・符</th><th scope="col">ロン点</th></tr></thead><tbody>{scores.map(({ riichi, result }) => <tr key={String(riichi)}><th scope="row">{riichi ? "リーチ" : "ダマ"}</th><td>{result ? result.yaku.map((yaku) => yaku.name).join("・") : "役なし"}</td><td>{result ? `${result.score.han}翻${result.fu?.roundedFu ?? "-"}符` : "-"}</td><td>{result ? `${points(result.score.totalPoints)}点` : "通常のロン不可"}</td></tr>)}</tbody></table></div> : null}
        </div>;
      })}
      {orasu ? <div className={styles.orasu}>
        <p>自分：{seatNames[orasu.input.selfSeat]} ／ 目標：{orasu.input.targetRank}着以内 ／ {orasu.input.honba}本場・供託{orasu.input.riichiSticks}本 ／ {orasu.input.tiePolicy === "strict" ? "同点では未達" : "同点で達成"}</p>
        <dl className={styles.scores}>{ORASU_SEATS.map((seat) => <div key={seat}><dt>{seatNames[seat]}{seat === orasu.input.selfSeat ? "・自分" : ""}</dt><dd>{points(orasu.input.scores[seat])}点</dd></div>)}</dl>
        {draw ? <div className={styles.tableScroll}><table><caption>指定したテンパイ人数で流局した場合の精算（点）</caption><thead><tr><th scope="col">席</th><th scope="col">現在</th><th scope="col">精算後</th><th scope="col">順位</th></tr></thead><tbody>{ORASU_SEATS.map((seat) => { const rank = draw.postRanking.find((row) => row.seat === seat)!; return <tr key={seat}><th scope="row">{seatNames[seat]}{seat === orasu.input.selfSeat ? "・自分" : ""}</th><td>{points(orasu.input.scores[seat])}</td><td>{points(draw.postScores[seat])}</td><td>{rank.rank}位{rank.tied ? "（同点）" : ""}</td></tr>; })}</tbody></table></div> : <div className={styles.tableScroll}><table><caption>目標に届く最低の基本アガリ点と精算後の持ち点</caption><thead><tr><th scope="col">方法</th><th scope="col">必要な基本点</th><th scope="col">自分の精算後</th><th scope="col">放銃者の精算後</th></tr></thead><tbody>{ORASU_SEATS.filter((seat) => seat !== orasu.input.selfSeat).map((seat) => { const condition = orasu.ron[seat]; return <tr key={seat}><th scope="row">{seatNames[seat]}からロン</th><td>{condition ? formatOrasuCandidate(condition.candidate) : orasu.alreadyAchieved ? "既に目標達成" : "該当なし"}</td><td>{condition ? points(condition.postScores[orasu.input.selfSeat]) : "-"}</td><td>{condition ? points(condition.postScores[seat]) : "-"}</td></tr>; })}<tr><th scope="row">ツモ</th><td>{orasu.tsumo ? formatOrasuCandidate(orasu.tsumo.candidate) : orasu.alreadyAchieved ? "既に目標達成" : "該当なし"}</td><td>{orasu.tsumo ? points(orasu.tsumo.postScores[orasu.input.selfSeat]) : "-"}</td><td>全員から支払い</td></tr></tbody></table></div>}
        {draw ? <p>流局：{example.drawTenpaiSeats!.map((seat) => seatNames[seat]).join("・")}がテンパイ。自分の精算後は<strong>{points(draw.postScores[orasu.input.selfSeat])}点</strong>です。</p> : null}
        {!draw ? <p>上限は単独役満まで。「該当なし」は、その候補範囲で目標へ届く点数がないことを表します。</p> : null}
        <Link className={styles.toolLink} href={orasuConditionHref(orasu.input)}>この点棒条件を計算ツールへ</Link>
      </div> : null}
      <dl className={styles.options}>{example.options.map((option) => <div key={option.label}><dt>{option.label}</dt><dd>{option.reason}</dd></div>)}</dl>
      {example.facts ? <><h4>開示された構成例で確認できる事実</h4><ul>{example.facts.map((fact) => <li key={fact}>{fact}</li>)}</ul></> : null}
      <p className={styles.conclusion}><strong>判断の分かれ目</strong>{example.conclusion}</p>
    </section>;
  })}</div>;
}
