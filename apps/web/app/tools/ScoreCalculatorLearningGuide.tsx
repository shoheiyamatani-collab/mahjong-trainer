import Link from "next/link";
import { ScoreWorkedExamples } from "./ScoreWorkedExamples";
import styles from "./tool-learning.module.css";

export function ScoreCalculatorLearningGuide() {
  return (
    <section className={`scoreLearningGuide ${styles.anchor}`} id="score-learning" aria-labelledby="score-learning-title">
      <header className="scoreLearningHeader">
        <p className="siteEyebrow">CALCULATION GUIDE</p>
        <h2 id="score-learning-title">点数は「役・翻 → 符 → 支払い」の順で読む</h2>
        <p>入力した結果を丸暗記するのではなく、どの条件が点数を作ったかを分けて確認します。</p>
      </header>

      <ol className="scoreLearningSteps">
        <li><strong>1. 和了形と和了牌</strong><span>完成した14枚と、最後にロン・ツモした牌を指定します。待ち方や符の判定に関わります。</span></li>
        <li><strong>2. 役と翻を確認</strong><span>役の名前と翻数を見ます。ドラは翻を増やしますが、ドラだけではアガれません。</span></li>
        <li><strong>3. 符と支払いを見る</strong><span>符の内訳を確かめてから、親子・ロンツモ別の支払いへ進みます。</span></li>
      </ol>

      <ScoreWorkedExamples />

      <aside className="scoreLearningCaution">
        <strong>実戦での注意</strong>
        <p>計算結果は入力した牌姿とルール条件に対する点数です。赤ドラはドラ枚数に含め、見えていない裏ドラは確定値として加えません。対局ごとの採用ルールも確認してください。</p>
      </aside>
      <div className="toolGuideSection">
        <h2>自分のアガリを、条件をそろえて復習する</h2>
        <p>対局後の牌姿を再現したら、役と符を先に予想してから結果を見ます。次に「ロンをツモへ」「本場0を2へ」のように条件を一つずつ変えて、増えた役・符・支払いを確かめてください。オーラスの必要点と比べる場合は、供託込みの受け取りと手のアガリ点を区別します。</p>
        <p>4人打ちの日本のリーチ麻雀を対象とし、役・符・親子・本場・供託を計算します。責任払い、複数人の同時ロン、3人打ちのツモ払い、ローカル役は入力できません。計算器に入力欄のない海底・河底・嶺上開花・槍槓などの特殊条件も、この画面からは指定できません。</p>
      </div>

      <nav className="scoreLearningLinks" aria-label="点数計算の学習リンク">
        <Link href="/tools/help">入力方法と符の内訳を詳しく見る</Link>
        <Link href="/learn/guides/score-orasu-case-study">アガリ点とオーラス条件を照合する実例</Link>
        <Link href="/tools/score-table">点数早見表で代表点を確認</Link>
        <Link href="/trainer/score">牌姿問題で点数計算を練習</Link>
        <Link href="/analysis/orasu-condition">オーラスの必要点と比べる</Link>
      </nav>
    </section>
  );
}
