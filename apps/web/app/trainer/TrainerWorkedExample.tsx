import Link from "next/link";
import { countsToTiles, type Counts34, type DiscardAnalysis } from "@mahjong-trainer/mahjong-core";
import { TileStrip, getTileName, tileAssetName } from "../components/TileFigures";
import { getIishantenLesson, getTrainingScoreLesson, getUkeireLesson, getWaitLesson } from "./trainerLessonData";
import toolStyles from "../tools/tool-learning.module.css";
import styles from "./trainer-lessons.module.css";

const name = (tile: string) => getTileName(tileAssetName(tile));
const names = (tiles: string[]) => tiles.map(name).join("・");
const checkerHref = (counts: Counts34) => `/analysis/mahjong-tool?hand=${encodeURIComponent(counts.join(","))}#checker-workspace`;

function LessonHand({ counts }: { counts: Counts34 }) {
  return <div className={toolStyles.hand}><TileStrip tiles={countsToTiles(counts).map((tile) => tileAssetName(tile))} /></div>;
}

function DiscardComparison({ results, caption }: { results: DiscardAnalysis[]; caption: string }) {
  return <table className={toolStyles.comparisonTable}>
    <caption>{caption}</caption>
    <thead><tr><th scope="col">打牌</th><th scope="col">打牌後</th><th scope="col">受け入れ</th></tr></thead>
    <tbody>{results.map((row) => <tr key={row.discard}>
      <th scope="row">{name(row.discard)}</th><td>{row.afterDiscardShanten === 0 ? "テンパイ" : `${row.afterDiscardShanten}向聴`}</td><td>{row.ukeireTypes}種・{row.ukeireTiles}枚</td>
    </tr>)}</tbody>
  </table>;
}

function IishantenExample() {
  const lesson = getIishantenLesson();
  return <>
    <h3>つながっている二萬を、なぜ外せる？</h3>
    <p>既存の入門問題「{lesson.problem.title}」を使います。14枚から、{names(lesson.choices.map((choice) => choice.discard))}の3候補を比べてください。ここでは役・打点・守備を外し、一向聴を保つ受け入れを比較します。</p>
    <LessonHand counts={lesson.counts} />
    <details className={styles.answer}>
      <summary>3候補の比較と理由を見る</summary>
      <DiscardComparison results={lesson.choices.map((choice) => choice.analysis)} caption="同じ14枚・同じ一向聴での比較" />
      <p><strong>{name(lesson.answerResult.discard)}切りが、この3候補では{lesson.answerResult.ukeireTiles}枚で最大です。</strong>{lesson.problem.explanation}</p>
      <p>三萬の対子と五五六七萬を残すことで、雀頭候補と連続形の両方を使えます。「端に見えるから」ではなく、切った後に残る形を比較する例です。</p>
      <Link className={toolStyles.tryLink} href={checkerHref(lesson.counts)}>この14枚を牌理チェッカーで比較する</Link>
    </details>
    <p>復習では、答えを見る前に3候補の有効牌を1種類ずつ書き出してください。正解牌を覚えるより、見落とした受け入れを一つ説明できることを目標にします。</p>
  </>;
}

function UkeireExample() {
  const lesson = getUkeireLesson();
  const selected = ["5m", "4p", "6s", "9s"];
  const results = selected.map((tile) => lesson.results.find((row) => row.discard === tile)!).filter(Boolean);
  const best = lesson.results.find((row) => row.discard === lesson.bestDiscards[0])!;
  return <>
    <h3>受け入れ最大は一つとは限らない</h3>
    <p>次の14枚で、受け入れが最大の打牌をすべて探してください。六索と九索のどちらか一方だけでよいかも考えます。実戦牌譜ではなく、既存の出題ロジックで検証した固定例です。</p>
    <LessonHand counts={lesson.counts} />
    <details className={styles.answer}>
      <summary>複数正解と比較結果を見る</summary>
      <p><strong>最大は{names(lesson.bestDiscards)}の{lesson.bestDiscards.length}候補、受け入れは{lesson.bestUkeireTiles}枚です。</strong>全打牌の中で同じ進行度の候補を比較した結果です。</p>
      <DiscardComparison results={results} caption="4候補を抜粋。最大値は全打牌から計算" />
      <p>六七八九索から六索を切ると七八九索、九索を切ると六七八索が完成面子として残ります。ほかの部分を進める有効牌は同じなので、この指標ではどちらも正解です。</p>
      <p>有効牌は{names(best.ukeire)}。各牌の4枚から打牌後の手牌で使う枚数を引いて合計します。種類数と枚数の両方が同じでも、ドラや安全度の差まで同じとは限りません。</p>
      <Link className={toolStyles.tryLink} href={checkerHref(lesson.counts)}>全候補と有効牌をチェッカーで確かめる</Link>
    </details>
    <p>この例では片方だけを答えると正解を見落としています。練習画面でも、同率の候補がある問題では最大になる牌をすべて選びます。良形率による比較と、受け入れ最大を探す課題も区別してください。</p>
  </>;
}

function WaitExample({ slug }: { slug: "seven-tile" | "chinitsu" }) {
  const lesson = getWaitLesson(slug);
  return <>
    <h3>{slug === "seven-tile" ? "2345678萬を、13枚の手牌で確かめる" : "雀頭を固定すると、清一色の待ちを見落とす"}</h3>
    <p>{slug === "seven-tile" ? "七枚形に、一二三筒と七八九索の完成面子を添えた13枚です。七枚形はアガリ牌を加えた8枚で、2面子と雀頭に分かれます。" : "筒子だけの13枚です。対子に見える部分を雀頭と決めつけず、1筒から9筒を1枚ずつ加えたときに4面子1雀頭になるかを確かめてください。"}</p>
    <LessonHand counts={lesson.counts} />
    <details className={styles.answer}>
      <summary>待ちと、完成する分け方を見る</summary>
      <p><strong>待ちは{names(lesson.waits)}、{lesson.waits.length}種・理論{lesson.ukeireCount}枚です。</strong>各待ちに対する面子分解の一例を示します。雀頭は最後の組です。</p>
      <div className={styles.proofs}>{lesson.proofs.map((proof) => <section key={proof.tile}>
        <h4>{name(proof.tile)}で完成・理論{proof.remaining}枚</h4>
        <div className={styles.groups} aria-label={`${name(proof.tile)}を加えた14枚の面子分解`}>
          {[...proof.decomposition.melds.map((meld) => meld.tiles), proof.decomposition.pair.tiles].map((tiles, index) => <div key={index}><span>{index === 4 ? "雀頭" : "面子"}</span><TileStrip tiles={tiles.map((tile) => tileAssetName(tile))} compact /></div>)}
        </div>
      </section>)}</div>
    </details>
    <p>枚数は手牌だけを基準にした理論値です。河や副露に見えた牌はさらに差し引きます。また、形が完成する待ちでも、自分の河や見逃しによるフリテンなどでロンできない場合があります。この例は形の練習で、実戦のロン可否やアガリ率を判定するものではありません。</p>
    <p>答えを確認したら、待ちを一つ隠して、その牌で完成する面子と雀頭を自分で分け直してみましょう。</p>
  </>;
}

function ScoreExample({ slug }: { slug: "score" | "score-hard" }) {
  const examples = getTrainingScoreLesson(slug);
  const first = examples[0]!;
  return <>
    <h3>{slug === "score" ? "同じ完成形でも、アガリ牌で点数は変わる" : "同じ九筒4枚でも、暗カンと明カンで符は変わる"}</h3>
    <p>東場・南家（子）のロン。ドラ・一発・本場・供託はすべてなし、リーチ{first.input.riichi ? "あり" : "なし"}。{slug === "score" ? "三萬でロンした場合と、三筒でロンした場合を比べてください。" : "三索でロンした場合です。九筒のカンの公開状態だけを変えて比べてください。"}</p>
    <p>和了牌を含む{slug === "score" ? "手牌14枚" : "手牌11枚（別枠のカン4枚と合わせて15枚）"}</p>
    <LessonHand counts={first.counts} />
    {first.input.melds?.map((meld, index) => <div key={index}><p>九筒のカン4枚</p><TileStrip tiles={meld.tiles.map((tile) => tileAssetName(tile))} compact /></div>)}
    <details className={styles.answer}>
      <summary>役・符・支払いの違いを見る</summary>
      {examples.map((example) => <section className={styles.scoreCase} key={example.id}>
        <h4>{example.label}</h4>
        <p>{example.explanation}</p>
        <dl className={toolStyles.resultList}>
          <div><dt>役と翻</dt><dd>{example.result.yaku.map((yaku) => `${yaku.name}${yaku.han}翻`).join("・")}</dd></div>
          <div><dt>符の内訳</dt><dd>{example.result.fu?.items.map((item) => `${item.label}${item.fu}符`).join(" ＋ ")} → {example.result.fu?.roundedFu}符</dd></div>
          <div><dt>子のロン</dt><dd><strong>{example.result.score.totalPoints.toLocaleString("ja-JP")}点</strong></dd></div>
        </dl>
        <Link className={toolStyles.tryLink} href={`/tools?example=${example.id}#score-workspace`}>{example.label}の条件を計算器へ読み込む</Link>
      </section>)}
    </details>
    <p>{slug === "score" ? "完成した14枚を見るだけでは待ち符と平和を判定できません。問題を解くときは、最後にアガった牌を先に確認しましょう。" : "カンが一つあるため実際の牌は15枚ですが、計算ではカンを1面子として数えます。門前ロンの10符も変わるので、カンの16符差だけを引く計算にはなりません。"}</p>
  </>;
}

export function TrainerWorkedExample({ slug }: { slug: string }) {
  const example = slug === "iishanten" ? <IishantenExample />
    : slug === "ukeire-max" ? <UkeireExample />
    : slug === "seven-tile" || slug === "chinitsu" ? <WaitExample slug={slug} />
    : slug === "score" || slug === "score-hard" ? <ScoreExample slug={slug} /> : null;
  if (!example) return null;
  return <section className={`trainerLearningBand ${styles.lesson}`} id="training-worked-example" aria-labelledby="training-worked-title">
    <h2 id="training-worked-title">固定例で解き方を確かめる</h2>
    {example}
    <p className={styles.method}>数値と面子分解は既存の牌理・点数計算処理で算出しています。<Link href="/about#calculation-policy">計算の前提と訂正方針</Link></p>
  </section>;
}
