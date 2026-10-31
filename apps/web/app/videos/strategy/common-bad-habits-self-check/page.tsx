import VideoPracticeGateway from "../VideoPracticeGateway";
import { VideoReadingTime } from "../VideoReadingTime";
import type { Metadata } from "next";
import { getRobotsPolicy } from "@mahjong-trainer/content-index-policy";
import Link from "next/link";
import { VideoArticleCompactContent } from "../VideoArticleCompactContent";
import { TileStrip } from "../../../components/TileFigures";
import { getWaitReviewExample, NO_YAKU_REVIEW_HAND, SUJI_COUNTEREXAMPLE_HAND } from "../videoReviewExamples";
import reviewStyles from "../video-review.module.css";

export const metadata: Metadata = {
  alternates: { canonical: "/videos/strategy/common-bad-habits-self-check" },
  robots: getRobotsPolicy("/videos/strategy/common-bad-habits-self-check"),
  title: "麻雀初心者に多い悪い癖3選 | 気づかない打ち方をセルフチェック",
  description: "リーチへの中途半端な対応、役なしダマテン、生牌の字牌を残しすぎる癖を動画と短い要点で解説。次の対局で直す行動をセルフチェックできます。"
};

const videoUrl = "https://www.youtube.com/watch?v=HH56Dvq8n8A";

type HabitBlock = {
  label: string;
  tiles: string[];
  weak?: boolean;
  strong?: boolean;
};

type Habit = {
  number: number;
  time: string;
  title: string;
  commonAction: string;
  why: string;
  correction: string;
  caution: string;
  href: string;
  blocks: HabitBlock[];
};

const habits: Habit[] = [
  {
    number: 1,
    time: "01:00",
    title: "リーチに対して、中途半端に手を崩す",
    commonAction: "危険牌は切りたくないけれどアガリも諦めきれず、なんとなくスジを切りながら手牌を少しずつ崩していませんか。",
    why: "自分のアガリやテンパイの可能性を失ったのに、相手には放銃する危険が残ります。攻撃と守備の両方で目的が曖昧になりやすい打ち方です。",
    correction: "まず押すか降りるかを決めます。降りるなら相手の現物を優先し、押すなら手牌価値と危険度を比べて必要な牌を選びます。",
    caution: "実戦では回し打ちが有効な場面もあります。初心者はまず、目的を言葉にできる打牌を目指しましょう。",
    href: `${videoUrl}&t=60s`,
    blocks: [
      { label: "相手のリーチ", tiles: ["man5"], weak: true },
      { label: "現物で降りる", tiles: ["pin4"], strong: true },
      { label: "なんとなくスジ", tiles: ["man2", "man8"], weak: true }
    ]
  },
  {
    number: 2,
    time: "04:52",
    title: "役がないのにダマテンにする",
    commonAction: "テンパイした安心感から、役があるか確認せずにリーチをかけないまま進めていませんか。",
    why: "門前の役なしテンパイは、相手の捨て牌ではロンできません。待ち牌が出ても見逃すことになり、せっかくの先制テンパイを生かせません。",
    correction: "役がなければリーチを基本候補にします。待ちや打点を改善したい理由が明確なら、テンパイを外して手替わりを待つ選択と比べます。",
    caution: "自分で待ち牌をツモれば門前清自摸和がつきますが、ロンできる役はありません。",
    href: `${videoUrl}&t=292s`,
    blocks: [
      { label: "面子", tiles: ["man2", "man3", "man4"] },
      { label: "面子", tiles: ["man5", "man6", "man7"] },
      { label: "面子", tiles: ["pin2", "pin3", "pin4"] },
      { label: "両面", tiles: ["sou3", "sou4"] },
      { label: "雀頭", tiles: ["ji5", "ji5"] },
      { label: "待ち牌", tiles: ["sou2", "sou5"], strong: true }
    ]
  },
  {
    number: 3,
    time: "06:58",
    title: "生牌の字牌を、終盤まで残しすぎる",
    commonAction: "他家にポンされるのが嫌で、場に1枚も見えていない字牌をずっと手元へ置いていませんか。",
    why: "序盤は比較的切りやすかった字牌でも、誰かがテンパイする終盤には単騎・シャンポン・役牌の当たり候補になります。切るタイミングを失うと、自分の手を進める邪魔にもなります。",
    correction: "自分の手が早く、字牌を使う予定が薄ければ序盤に整理します。鳴かれる可能性だけでなく、後で危険牌として残る可能性も比べます。",
    caution: "手が遅く安全牌を持ちたい場面や、役牌として使える場面では残す価値があります。毎回すぐ切るという意味ではありません。",
    href: `${videoUrl}&t=418s`,
    blocks: [
      { label: "場に見えていない生牌", tiles: ["ji6"], weak: true },
      { label: "終盤の危険候補", tiles: ["ji6", "ji6"], weak: true },
      { label: "序盤に整理を検討", tiles: ["ji6"], strong: true }
    ]
  }
];

const tileNames: Record<string, string> = {
  man2: "二萬", man3: "三萬", man4: "四萬", man5: "五萬", man6: "六萬", man7: "七萬", man8: "八萬",
  pin2: "二筒", pin3: "三筒", pin4: "四筒",
  sou2: "二索", sou3: "三索", sou4: "四索", sou5: "五索",
  ji5: "發", ji6: "白"
};

const checklist = [
  "リーチを受けたとき、押す理由・降りる理由を決めずに牌を選ぶことがある",
  "降りると決めたのに、現物より先にスジを切ることがある",
  "テンパイしたら、役の有無を確認せずダマテンにすることがある",
  "役なしテンパイでロンできないことを忘れることがある",
  "鳴かれるのが嫌で、生牌の字牌を終盤まで抱えることがある",
  "字牌をいつ切るか、自分の手の速度と比べていない"
];

export default function CommonBadHabitsSelfCheckArticlePage() {
  const noYaku = getWaitReviewExample(NO_YAKU_REVIEW_HAND);
  const suji = getWaitReviewExample(SUJI_COUNTEREXAMPLE_HAND);
  return (
    <main className="siteMain videoArticlePage">
      <article>
        <header className="videoArticleHeader">
          <nav aria-label="パンくずリスト"><Link href="/">トップ</Link><span>›</span><Link href="/videos/strategy">麻雀を動画で学ぶ</Link><span>›</span><span>悪い癖のセルフチェック</span></nav>
          <p className="siteEyebrow">VIDEO GUIDE / 振り返り・悪癖改善</p>
          <h1>その打ち方、無意識の癖になっていませんか？</h1>
          <p className="videoArticleLead">麻雀を覚えて対局数が増えると、誰にも指摘されないまま同じ判断を繰り返すことがあります。初心者に多い3つの癖を確認し、次の対局で直す行動を1つ決めましょう。</p>
          <div className="videoArticleByline"><span>紹介動画: 発男道場【麻雀解説ch】</span><time>動画公開日 2024年1月26日</time><VideoReadingTime articleHref="/videos/strategy/common-bad-habits-self-check" /></div>
        </header>

        <div className="videoArticleEmbed">
          <iframe
            src="https://www.youtube-nocookie.com/embed/HH56Dvq8n8A"
            title="【麻雀解説】すぐ直して！勝てない人の悪癖（初心者向け）"
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
                    <li>ルールは分かるようになったのに、なかなか成績が安定しない人</li>
                    <li>普段、自分の打牌を指摘してもらえる機会が少ない人</li>
                    <li>リーチ対応や字牌の切り時を感覚だけで決めている人</li>
                    <li>牌譜検討で何を振り返ればよいか分からない人</li>
                  </ul>
                </section>

        <VideoArticleCompactContent
          message={"麻雀を覚えて対局数が増えると、誰にも指摘されないまま同じ判断を繰り返すことがあります。"}
          points={[
            { title: "降りるなら、現物とスジを分ける", description: "ロンされない現物と、待ちの一部を絞るスジは同じ情報ではありません。" },
            { title: "テンパイしたら、役の有無を確認する", description: "形が完成する牌でも、役なしのままではロンできません。" },
            { title: "生牌の字牌は、使う理由を考えて残す", description: "鳴かれたくないという理由だけで抱えず、役牌や守備に使えるか、自分の速度と合わせて考えます。" },
          ]}
        />

        <section className="videoArticleBodySection" aria-labelledby="habits-review-title">
          <h2 id="habits-review-title">3つの癖を、次の一打で直すには</h2>
          <p>元動画の公式説明欄にある3テーマをもとに、雀フォリオが復習手順を補足しています。具体的な判断条件は局面によって変わり、動画内の全局面を検証したという意味ではありません。</p>
          <div className="videoPrincipleList">{habits.map((habit) => (
            <section className="videoPrinciple" key={habit.number}>
              <div className="videoPrincipleNumber">{habit.number}</div>
              <div className="videoPrincipleBody"><h3>{habit.title}</h3><p>{habit.commonAction}</p><p>{habit.correction}</p><p>{habit.caution}</p><a href={habit.href} target="_blank" rel="noopener noreferrer">元動画 {habit.time}の章へ</a></div>
            </section>
          ))}</div>
        </section>

        <section className="videoArticleBodySection" aria-labelledby="no-yaku-review-title">
          <p className="videoArticleSectionLabel">JONGFOLIO / 独自の検証例</p>
          <h2 id="no-yaku-review-title">テンパイでも、役がなければロンできない</h2>
          <p>以下は動画とは別に用意した門前の13枚です。東場・南家、リーチ・ドラ・一発・海底などの状況役なしで確認します。</p>
          <div className={reviewStyles.hand}><TileStrip tiles={noYaku.tiles} /></div>
          <p>待ちは2索・5索です。雀頭が白なので平和はつかず、字牌があるためタンヤオもありません。この手には他の役もなく、そのままではどちらでもロンできません。</p>
          <p>リーチできる条件を満たして宣言すればリーチが役になり、リーチなしでも自分で引けば門前清自摸和がつきます。ただし「役なしなら必ずリーチ」とは限らず、巡目・待ち・相手の攻撃・点差を見て、リーチ、手変わり、撤退を比べます。</p>
          <div className="toolGuideLinks"><Link href="/trainer/riichi-or-dama">リーチ？ダマ？で条件を比べる</Link><Link href="/learn/guides/riichi-or-dama">リーチとダマの判断の解説へ</Link></div>
        </section>

        <section className="videoArticleBodySection" aria-labelledby="suji-review-title">
          <p className="videoArticleSectionLabel">JONGFOLIO / 独自の反例</p>
          <h2 id="suji-review-title">5萬が現物でも、スジの2萬は現物ではない</h2>
          <p>相手が5萬を捨ててリーチした状況を考えます。次の13枚は、その情報と両立する相手の手牌の一例です。実際の動画の手牌を示すものではありません。</p>
          <div className={reviewStyles.hand}><TileStrip tiles={suji.tiles} /></div>
          <p>この形は2萬・5筒のシャンポン待ちです。5萬が相手の捨て牌でも、2萬にはロンされます。スジが主に両面待ちを考える手掛かりであり、シャンポンや単騎まで否定する情報ではないことが分かります。</p>
          <p>その相手にロンされない現物と、待ちの一部を絞るスジは分けて扱います。現物でも別の相手には安全とは限りません。ここで示した反例から、2萬の具体的な放銃率を計算できるわけでもありません。</p>
          <div className="toolGuideLinks"><Link href="/learn/guides/genbutsu-suji-kabe">現物・スジ・カベの違いを復習する</Link><Link href="/trainer/push-or-fold">押す？オリる？で判断を練習する</Link></div>
        </section>

        <section className="videoArticleNext">
                  <p className="videoArticleSectionLabel">NEXT STEP</p>
                  <h2>苦手だった項目を復習する</h2>
                  <div>
                    <Link href="/videos/strategy/betaori-three-principles">ベタオリの切る順番を詳しく学ぶ</Link>
                    <Link href="/videos/strategy/suji-kabe-defense-basics">スジとカベで安全牌を探す</Link>
                    <Link href="/videos/strategy/tile-efficiency-four-rules">牌効率の4法則で手作りを復習する</Link>
                    <Link href="/rules/yaku">役一覧でアガれる条件を確認する</Link>
                    <Link href="/trainer">麻雀トレーニングで判断を試す</Link>
                  </div>
                </section>

        <VideoPracticeGateway articleHref="/videos/strategy/common-bad-habits-self-check" />

</article>
    </main>
  );
}
