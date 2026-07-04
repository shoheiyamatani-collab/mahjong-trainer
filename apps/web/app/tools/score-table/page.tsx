import type { Metadata } from "next";
import { InternalLinkCard, PageHero, SectionTitle } from "../../components/SiteSections";

export const metadata: Metadata = {
  title: "麻雀 点数計算表の見方 | 初心者向け早見表",
  description: "麻雀の点数計算表を初心者向けに解説します。子か親か、ロンかツモか、符と翻、平和・七対子・満貫以上の読み方を説明します。"
};

const scoreTables = [
  {
    title: "平和・七対子 早見表",
    description: "初心者はまずこの図から見るのがおすすめです。平和はロン30符、ツモ20符、七対子は25符固定なので、符を細かく数える前でも使いやすい表です。",
    src: "/score-tables/pinfu-chiitoi-quick.png"
  },
  {
    title: "通常の点数 早見表",
    description: "平和・七対子以外や、30符・40符などを確認したいときに使います。子ロン・親ロン・子ツモ・親ツモの欄に分かれているので、アガリ方に合わせて読みます。",
    src: "/score-tables/standard-score-quick.png"
  }
];

const focusCards = [
  {
    title: "平和ロンは30符を見る",
    body: "平和でロンしたときは30符です。たとえば子の2翻なら2000点、3翻なら3900点を見ます。"
  },
  {
    title: "平和ツモは20符を見る",
    body: "平和ツモは20符です。実戦では門前ツモが付くので2翻以上から見ることが多いです。"
  },
  {
    title: "七対子は25符固定",
    body: "七対子は特殊で、符を数えず25符固定です。表では七対子専用の欄を見ます。"
  },
  {
    title: "満貫以上は別枠で見る",
    body: "5翻以上、または高い符と翻の組み合わせは満貫以上になります。満貫以上は符を細かく見ず、満貫・跳満・倍満などの表を見ます。"
  }
];

const paymentCards = [
  {
    title: "子ロン",
    body: "子がロンした点数です。放銃した1人が、表に書かれた点数をそのまま支払います。"
  },
  {
    title: "親ロン",
    body: "親がロンした点数です。親のアガリなので、同じ符・翻でも子ロンより高くなります。"
  },
  {
    title: "子ツモ",
    body: "子がツモした点数です。「700 / 1300」のように、子が払う点 / 親が払う点の順で読みます。"
  },
  {
    title: "親ツモ",
    body: "親がツモした点数です。「1300オール」のように、子3人が全員同じ点数を支払います。"
  }
];

export default function ScoreTablePage() {
  return (
    <main className="siteMain">
      <PageHero
        eyebrow="Score Table Guide"
        title="麻雀 点数計算表の見方"
        description="このページでは、点数表そのものよりも「図のどこを見ればいいか」を解説します。子か親か、ロンかツモか、符、翻の順番で見れば、初心者でも点数表を読みやすくなります。"
        primaryLink={{ label: "点数計算ツールを使う", href: "/tools" }}
        secondaryLink={{ label: "実践でよく見る点数計算へ戻る", href: "/rules/practical-score" }}
      />

      <section>
        <SectionTitle
          title="平和・七対子は専用表で確認しよう"
          description="平和と七対子は初心者がよく見る形です。符の考え方が決まっているので、専用の早見表から覚えると迷いにくくなります。"
        />
        <div className="scoreFocusGrid">
          {focusCards.map((card) => (
            <article className="scoreFocusCard" key={card.title}>
              <h2>{card.title}</h2>
              <p>{card.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle
          title="支払い欄の読み方"
          description="点数表の子ロン・親ロン・子ツモ・親ツモは、誰がいくら払うかを表しています。"
        />
        <div className="scorePaymentGrid">
          {paymentCards.map((card) => (
            <article className="scorePaymentCard" key={card.title}>
              <h2>{card.title}</h2>
              <p>{card.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle
          title="点数表の図解"
          description="上の解説を読んでから図を見ると、どの行と列を使うのかが分かりやすくなります。"
        />
        <div className="scoreTableStack">
          {scoreTables.map((table) => (
            <article className="scoreTableCard" key={table.src}>
              <div className="sectionTitle compactSectionTitle">
                <h2>{table.title}</h2>
                <p>{table.description}</p>
              </div>
              <img src={table.src} alt={table.title} />
            </article>
          ))}
        </div>
      </section>

      <section className="scoreNoticeSection">
        <div className="scoreNoticeCard">
          <h2>7700(※8000)、11600(※12000) の意味</h2>
          <p>
            表の中にある7700(※8000)や11600(※12000)は、切り上げ満貫を採用する場合の点数です。
            通常は7700点・11600点ですが、切り上げ満貫ありなら8000点・12000点として扱います。
          </p>
          <p>Mリーグや多くの雀荘では切り上げ満貫を採用していることがあります。実際に遊ぶときは、その場のルールを確認しましょう。</p>
        </div>
        <div className="scoreNoticeCard">
          <h2>満貫以上は符を細かく見なくてOK</h2>
          <p>
            満貫以上になると、基本的には符を細かく見ずに点数が決まります。
            5翻は満貫、6〜7翻は跳満、8〜10翻は倍満、11〜12翻は三倍満、13翻以上は数え役満として見ます。
          </p>
        </div>
      </section>

      <section>
        <SectionTitle title="点数表のあとに" description="表で確認したら、実際の手牌や条件でも試してみましょう。" />
        <div className="linkCardGrid">
          <InternalLinkCard
            title="点数計算ツールを使う"
            description="麻雀便利ツールから、点数計算ツールや実戦練習に進めます。手牌と条件を変えながら、ロン・ツモの支払いを確認しましょう。"
            href="/tools"
            actionLabel="麻雀便利ツールへ"
          />
        </div>
      </section>
    </main>
  );
}
