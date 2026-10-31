import { clipScoreExample, clipSuuankouExample } from "./clipLearningExamples";
import styles from "./clip-learning-examples.module.css";

export function ClipVerifiedExamples({ topic }: { topic: "recent" | "yakuman" }) {
  if (topic === "recent") return (
    <div className={styles.example} aria-labelledby="clip-score-example-title">
      <p className={styles.label}>雀フォリオ独自の計算例</p>
      <h3 id="clip-score-example-title">同じ2,000点でも、誰からアガるかで順位が変わる</h3>
      <p>東家32,000点、南家（自分）28,500点、西家22,000点、北家17,500点。自分は子、0本場・供託なしで、このアガリで終局した場合のトップ逆転を比べます。実際のMリーグ対局を再現したものではありません。</p>
      <table className={styles.table}>
        <caption>2翻30符・自分の加点はすべて2,000点</caption>
        <thead><tr><th scope="col">アガリ方</th><th scope="col">アガリ後の持ち点</th><th scope="col">トップ逆転</th></tr></thead>
        <tbody>{clipScoreExample.rows.map((row) => (
          <tr key={row.label}><th scope="row">{row.label}</th><td>自分 {row.south.toLocaleString("ja-JP")}点<br />東家 {row.east.toLocaleString("ja-JP")}点</td><td>{row.reachesTarget ? "達成" : "未達"}</td></tr>
        ))}</tbody>
      </table>
      <p>直撃は自分の加点と相手の減点が同時に起きます。ツモでは東家の減点は1,000点だけなので、この2,000点の手では届きません。表は最低必要点の一覧ではなく、同じ加点を比較する例です。</p>
      <p>本場・供託・同点優先、親の連荘や次局があるかは別に確認します。シリーズ全体のチームポイントや選手の意図まで、この点差だけで判断することはできません。</p>
      <a className="text-link" href={clipScoreExample.href}>同じ持ち点をオーラス条件計算で比較する</a>
    </div>
  );

  return (
    <div className={styles.example} aria-labelledby="clip-yaku-example-title">
      <p className={styles.label}>雀フォリオ独自の牌姿例</p>
      <h3 id="clip-yaku-example-title">シャンポン待ちの四暗刻は、ロンとツモで違う</h3>
      <p>次の13枚は、門前・副露なしのテンパイ例です。映像からの転載ではありません。白と中が待ちで、アガリ牌を中にそろえて比較します。</p>
      <div className={styles.hand} role="group" aria-label="門前の13枚。二萬3枚、五筒3枚、七索3枚、白2枚、中2枚。白・中待ち">
        {clipSuuankouExample.groups.flatMap((group) => Array.from({ length: group.count }, (_, index) => (
          <img key={`${group.asset}-${index}`} src={`/tiles/${group.asset}-66-90-l-emb.png`} alt={group.name} loading="lazy" width="66" height="90" />
        )))}
      </div>
      <dl className={styles.comparison}>
        <div><dt>中をロン</dt><dd>中の刻子は暗刻に数えません。{clipSuuankouExample.ronYaku.join("・")}が成立しますが、四暗刻にはなりません。</dd></div>
        <div><dt>中をツモ</dt><dd>中も暗刻として完成し、{clipSuuankouExample.tsumoYaku.join("・")}になります。</dd></div>
      </dl>
      <p>リーチ・ドラ・本場などは含めない比較です。単騎待ちでロンする場合は別の条件になるため、「門前の刻子が多ければ何でも四暗刻」と覚えないようにしましょう。これは一般的な役の成立例で、特定の対局の解説や全ルールの例外を扱うものではありません。</p>
      <a className="text-link" href="/rules/yaku#yakuman">役一覧で四暗刻の条件を確認する</a>
    </div>
  );
}
