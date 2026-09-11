import type { Metadata } from "next";
import Link from "next/link";
import { VideoArticleCompactContent } from "../VideoArticleCompactContent";

export const metadata: Metadata = {
  title: "麻雀のベタオリで重要な考え方3選 | オリ打ちを減らす守備",
  description: "複数の現物を切る順番、現物もスジもないときの選び方、放銃パターンの比較を短い要点で解説。ベタオリで振り込むオリ打ちを減らす動画記事です。"
};

const videoUrl = "https://www.youtube.com/watch?v=Y9XXEwNmKcE";

type BetaoriBlock = {
  label: string;
  tiles: string[];
  weak?: boolean;
  strong?: boolean;
};

type BetaoriPrinciple = {
  number: number;
  time: string;
  title: string;
  situation: string;
  decision: string;
  reason: string;
  caution: string;
  href: string;
  blocks: BetaoriBlock[];
};

const principles: BetaoriPrinciple[] = [
  {
    number: 1,
    time: "01:32",
    title: "現物が複数あるなら、将来危険になりやすい牌から切る",
    situation: "現在のリーチ者に通る現物が、手牌に何種類かあります。",
    decision: "ほかの人からリーチされたときに危険になりやすい中張牌の現物を先に切り、全員に通りやすい枯れた字牌を後へ残します。",
    reason: "今の相手に安全でも、次に別の相手がリーチすると安全度は変わります。共通して安全な牌を後の巡目へ残すと、長く降りやすくなります。",
    caution: "他家の仕掛けやドラによって優先順位は変わります。現在のリーチ者だけでなく全員の状況を見ます。",
    href: `${videoUrl}&t=92s`,
    blocks: [
      { label: "今は現物・後で危険候補", tiles: ["man5"], weak: true },
      { label: "場に3枚見え", tiles: ["ji6", "ji6", "ji6"] },
      { label: "手元の白を後へ残す", tiles: ["ji6"], strong: true }
    ]
  },
  {
    number: 2,
    time: "05:39",
    title: "現物もスジもないなら、複数枚持っている牌を比較する",
    situation: "安全と判断できる牌がなく、どれを切っても危険に見えます。",
    decision: "同程度に危険なら、対子や暗刻で持っている牌を候補にします。1枚が通れば、残りの同じ牌でも次の巡目をしのげる可能性が生まれます。",
    reason: "毎巡違う危険牌を勝負すると、そのたびに新しい放銃リスクを負います。同じ牌を複数持っていれば、危険牌を選ぶ回数を減らせます。",
    caution: "複数枚あることだけで安全にはなりません。ドラや中央牌など、明らかに危険度が高い牌は別の候補と比較します。",
    href: `${videoUrl}&t=339s`,
    blocks: [
      { label: "1枚ずつの無スジ", tiles: ["pin4", "sou5", "man6"], weak: true },
      { label: "同程度なら対子を比較", tiles: ["man9", "man9"], strong: true }
    ]
  },
  {
    number: 3,
    time: "08:33",
    title: "スジ・カベの名前ではなく、放銃パターンを数える",
    situation: "スジの牌とカベの外側など、複数の候補が残っています。",
    decision: "両面、カンチャン、ペンチャン、シャンポン、単騎のうち、それぞれ何種類の待ちに当たり得るかを比べます。",
    reason: "スジは両面待ちを否定しますが、ほかの待ちには当たります。カベも見えている枚数や巡目で信頼度が変わるため、名前だけで順位を決めないことが大切です。",
    caution: "待ちの全パターンを対局中に完璧に数える必要はありません。まず両面以外に当たる形があるかを1つ確認します。",
    href: `${videoUrl}&t=513s`,
    blocks: [
      { label: "スジ候補", tiles: ["man1"], strong: true },
      { label: "単騎・シャンポンは残る", tiles: ["man1", "man1"], weak: true },
      { label: "ワンチャンス", tiles: ["pin3", "pin3", "pin3"], weak: true },
      { label: "外側を比較", tiles: ["pin1", "pin2"], strong: true }
    ]
  }
];

const tileNames: Record<string, string> = {
  man1: "一萬", man5: "五萬", man6: "六萬", man9: "九萬",
  pin1: "一筒", pin2: "二筒", pin3: "三筒", pin4: "四筒",
  sou5: "五索", ji6: "白"
};

export default function BetaoriThreePrinciplesArticlePage() {
  return (
    <main className="siteMain videoArticlePage">
      <article>
        <header className="videoArticleHeader">
          <nav aria-label="パンくずリスト"><Link href="/">トップ</Link><span>›</span><Link href="/videos/strategy">麻雀を動画で学ぶ</Link><span>›</span><span>ベタオリの考え方</span></nav>
          <p className="siteEyebrow">VIDEO GUIDE / 守備・ベタオリ</p>
          <h1>降りると決めたら、最後までしっかり降りる</h1>
          <p className="videoArticleLead">ベタオリは、自分のアガリを諦めて放銃を避ける守備です。ただ安全そうな牌を切るだけでなく、数巡先まで安全牌を残す順番を考えることで、降りている途中の放銃を減らせます。</p>
          <div className="videoArticleByline"><span>紹介動画: 発男道場【麻雀解説ch】</span><time>動画公開日 2024年4月13日</time><span>約3分で読める</span></div>
        </header>

        <div className="videoArticleEmbed">
          <iframe
            src="https://www.youtube-nocookie.com/embed/Y9XXEwNmKcE"
            title="【麻雀解説】ベタオリで重要な考え方3選（初心者向け）"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen loading="lazy" />
        </div>
        <p className="videoSourceNote">動画提供: <a href={videoUrl} target="_blank" rel="noopener noreferrer">発男道場【麻雀解説ch】の元動画をYouTubeで見る</a></p>

        <section className="videoArticleAudience">
                  <div>
                    <p className="videoArticleSectionLabel">RECOMMENDED FOR</p>
                    <h2>この動画はこんな人に向いています</h2>
                  </div>
                  <ul>
                    <li>降りると決めたのに、途中で安全牌がなくなって放銃する人</li>
                    <li>現物が複数あるとき、毎回なんとなく1枚を選んでいる人</li>
                    <li>現物もスジもない場面で、何を比較すればよいか知りたい人</li>
                    <li>スジとカベを覚え、さらに実戦的な守備へ進みたい人</li>
                  </ul>
                </section>

        <VideoArticleCompactContent
          message={"ベタオリは、自分のアガリを諦めて放銃を避ける守備です。"}
          points={[
            { title: "ベタオリは「手を崩す打ち方」ではなく、失点を防ぐ選択", description: "アガリを目指していた手牌を崩すのは、もったいなく感じます。" },
            { title: "オリ打ちを減らす3つの考え方", description: "緑の枠は比較したときに残したい・選びたい候補、赤い枠は追加の危険を確認したい候補です。" },
            { title: "ベタオリでも放銃をゼロにはできません", description: "現物が尽きれば、どこかで比較的当たりにくい牌を選ぶ必要があります。" },
          ]}
        />

        <section className="videoArticleNext">
                  <p className="videoArticleSectionLabel">NEXT STEP</p>
                  <h2>守備の基礎と一緒に復習する</h2>
                  <div>
                    <Link href="/videos/strategy/suji-kabe-defense-basics">スジとカベで安全牌を探す</Link>
                    <Link href="/videos/strategy/reach-declaration-tile-reading">リーチ宣言牌からの読みを学ぶ</Link>
                    <Link href="/videos/strategy/common-bad-habits-self-check">中途半端な押し引きがないか確認する</Link>
                    <Link href="/rules/practical-waits">待ちの形と放銃パターンを復習する</Link>
                  </div>
                </section>

</article>
    </main>
  );
}
