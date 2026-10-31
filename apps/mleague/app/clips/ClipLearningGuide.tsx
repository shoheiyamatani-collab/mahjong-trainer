import { UnofficialNotice } from "@/components/mleague/UnofficialNotice";
import { ClipVerifiedExamples } from "./ClipVerifiedExamples";

type Topic = "recent" | "yakuman" | "moments" | "directory";
const topics = {
  recent: {
    title: "結果を見る前に、点数状況を確認する",
    paragraphs: [
      "同じ満貫でも、必要なのがトップ逆転なのか、着順維持なのかで意味が変わります。局、親子、点差、本場・供託を先に確認し、ロンした相手によって着順がどう変わるかを分けて考えてみましょう。",
      "切り抜きには局の途中や結果だけの映像もあります。全員の河や手牌が確認できない場面から、押し引きの正解や放銃率を断定することはできません。条件が分かる範囲だけを使って振り返ります。"
    ],
    links: [{ href: "/analysis/orasu-condition", label: "オーラス条件計算で点差を比較" }, { href: "/learn/guides/orasu-score-conditions", label: "逆転条件の考え方を学ぶ" }]
  },
  yakuman: {
    title: "役満を見るときは、成立条件とアガリ牌を分ける",
    paragraphs: [
      "印象的な役名だけでなく、門前が必要か、どの牌で完成したかを確認すると役の復習になります。たとえば四暗刻は、シャンポン待ちのロンでは最後の刻子が暗刻にならず、単騎待ちのロンとは条件が異なります。",
      "役満が出た結果から、途中の判断まで必ず正しかったとは言えません。狙い続けるために何を切ったか、役満以外のアガリが残っていたかは、実際に確認できる映像の範囲で考えましょう。動画の牌姿を転載せず、役の条件は当サイトの役一覧で復習できます。"
    ],
    links: [{ href: "/rules/yaku", label: "役一覧で成立条件を確認" }, { href: "/tools/help", label: "点数計算の対応ルールを確認" }]
  },
  moments: {
    title: "名場面の結果と、その時点の判断材料を区別する",
    paragraphs: [
      "実況やタイトルが示す見どころと、打ち手が実際に見えていた情報は同じではありません。相手の手牌が開いた後の視点をいったん外し、現物、見えている牌、点数状況だけで候補を比べると守備の復習になります。",
      "当たらなかった一打が常に安全、アガれなかったリーチが常に失敗というわけではありません。なぜ選ぶ候補になったか、逆にどの条件なら選び直すかを自分の言葉にしてから、練習問題で別の局面にも適用できるか確かめてみましょう。"
    ],
    links: [{ href: "/learn/guides/genbutsu-suji-kabe", label: "現物・スジ・カベの違いを復習" }, { href: "/trainer/push-or-fold", label: "押す？オリる？で判断を練習" }]
  },
  directory: {
    title: "動画を麻雀学習につなげる見方",
    paragraphs: [
      "最近の切り抜きは現在の対局を追う入口、役満集は役の成立条件を復習する入口、名場面集は判断材料を振り返る入口です。タイトルや結末だけで戦術を一般化せず、確認できる局・点差・河から一つの疑問を選んで見てみましょう。",
      "ここにある紹介文は動画選びのための掲載メモです。特定局面の計算検証や、選手の意図を証明する解説ではありません。当サイトの学習記事・計算ツールとは区別して掲載しています。"
    ],
    links: [{ href: "/learn/guides", label: "麻雀の学習ガイド" }, { href: "/trainer", label: "トレーニング一覧" }]
  }
} satisfies Record<Topic, { title: string; paragraphs: string[]; links: { href: string; label: string }[] }>;

export function ClipLearningGuide({ topic }: { topic: Topic }) {
  const content = topics[topic];
  return (
    <section className="section" aria-labelledby="clip-learning-title">
      <div className="section-heading"><h2 id="clip-learning-title">{content.title}</h2></div>
      {content.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      {topic === "recent" || topic === "yakuman" ? <ClipVerifiedExamples topic={topic} /> : null}
      <ul>{content.links.map((link) => <li key={link.href}><a className="text-link" href={link.href}>{link.label}</a></li>)}</ul>
      <p className="match-source-note">映像は投稿者のYouTubeで再生します。公開終了・年齢や地域による制限などで再生できない場合があります。掲載内容の訂正は<a href="/contact">お問い合わせ</a>へ、ページURLと該当箇所をお知らせください。</p>
      <UnofficialNotice />
    </section>
  );
}
