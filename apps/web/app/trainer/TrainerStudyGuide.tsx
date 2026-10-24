import Link from "next/link";
import styles from "./trainer-lessons.module.css";

const paths = [
  { problem: "役が分からずアガれない", practice: ["役判定クイズ", "/training/yaku-quiz"], review: ["役一覧で条件を確認", "/rules/yaku"] },
  { problem: "一向聴で何を切るか迷う", practice: ["イーシャンテン何切る", "/trainer/iishanten"], review: ["同じ14枚を牌理チェッカーへ", "/analysis/mahjong-tool"] },
  { problem: "待ちを一つ見落とす", practice: ["7枚形 多面待ち", "/trainer/seven-tile"], review: ["待ちの分解を復習", "/rules/practical-waits"] },
  { problem: "点数を申告できない", practice: ["点数計算 基本", "/trainer/score"], review: ["役・符の内訳を計算器で確認", "/tools"] },
  { problem: "鳴くと役や打点が分からなくなる", practice: ["鳴く？鳴かない？", "/trainer/call-or-pass"], review: ["鳴き判断の記事を読む", "/learn/guides/calling-decision"] }
];

export function TrainerStudyGuide() {
  return <section className={`trainerLearningBand ${styles.lesson}`} id="training-study-guide" aria-labelledby="training-study-title">
    <h2 id="training-study-title">何から練習し、どう復習する？</h2>
    <p>麻雀の練習では、速く答える力と、理由を説明する力を分けて確かめます。まだ役や待ちが曖昧なら基礎問題から、受け入れを数えられるなら複合形の比較へ進みましょう。難しい問題を解くこと自体が目標ではありません。</p>
    <table className={styles.studyTable}>
      <caption>いまのつまずきから選ぶ、練習と復習の組み合わせ</caption>
      <thead><tr><th scope="col">いまのつまずき</th><th scope="col">取り組む練習</th><th scope="col">答え合わせの後</th></tr></thead>
      <tbody>{paths.map((path) => <tr key={path.problem}>
        <th scope="row">{path.problem}</th>
        <td><Link href={path.practice[1]!}>{path.practice[0]}</Link></td>
        <td><Link href={path.review[1]!}>{path.review[0]}</Link></td>
      </tr>)}</tbody>
    </table>
    <h3>まずは5問、間違いを一つの原因に分ける</h3>
    <ol>
      <li><strong>答える前に理由を一言。</strong>「この対子を雀頭に残す」「門前ロンの10符を足す」のように、自分が見た条件を言葉にします。</li>
      <li><strong>答えではなく差を確認。</strong>待ちの見落とし、残り枚数、役の条件、符の加算など、どこで結果が変わったかを確認します。</li>
      <li><strong>同じ形を解き直す。</strong>固定例の解説を閉じてもう一度考え、理由を説明できたら次の問題へ進みます。各トレーニング下部の「固定例で解き方を確かめる」も使えます。</li>
    </ol>
    <h3>問題の正解と実戦の最善打は同じとは限らない</h3>
    <p>牌効率問題は主にシャンテン数や受け入れ、待ち問題はアガリ形、点数問題は指定したルール条件を確かめます。実戦ではドラ、安全度、巡目、点棒を加えて判断してください。鳴き・リーチ・押し引きの推奨も、画面に示す前提に対する比較であり、実際の相手の手牌や勝率を保証するものではありません。</p>
    <p>計算値と推定の違いは<Link href="/about#calculation-policy">計算の前提と訂正方針</Link>で説明しています。操作に慣れていない方は<Link href="/learn/roadmap">初心者ロードマップ</Link>から役と待ちの基本へ戻れます。</p>
  </section>;
}
