import type { Metadata } from "next";
import Link from "next/link";
import { VideoArticleCompactContent } from "../VideoArticleCompactContent";

export const metadata: Metadata = {
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
  return (
    <main className="siteMain videoArticlePage">
      <article>
        <header className="videoArticleHeader">
          <nav aria-label="パンくずリスト"><Link href="/">トップ</Link><span>›</span><Link href="/videos/strategy">麻雀を動画で学ぶ</Link><span>›</span><span>悪い癖のセルフチェック</span></nav>
          <p className="siteEyebrow">VIDEO GUIDE / 振り返り・悪癖改善</p>
          <h1>その打ち方、無意識の癖になっていませんか？</h1>
          <p className="videoArticleLead">麻雀を覚えて対局数が増えると、誰にも指摘されないまま同じ判断を繰り返すことがあります。初心者に多い3つの癖を確認し、次の対局で直す行動を1つ決めましょう。</p>
          <div className="videoArticleByline"><span>紹介動画: 発男道場【麻雀解説ch】</span><time>動画公開日 2024年1月26日</time><span>約3分で読める</span></div>
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
            { title: "まず、当てはまるものを確認する", description: "当てはまる項目があっても問題ありません。" },
            { title: "初心者に多い3つの癖と直し方", description: "自分に当てはまる癖を一つ選び、次の対局で直す行動を決めます。" },
            { title: "次の対局では、1つだけ意識する", description: "3つを一度に直そうとすると、対局中に考えることが増えすぎます。" },
          ]}
        />

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

</article>
    </main>
  );
}
