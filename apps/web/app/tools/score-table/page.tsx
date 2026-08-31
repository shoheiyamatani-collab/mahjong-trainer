import type { Metadata } from "next";
import Link from "next/link";
import { Calculator, CircleHelp, TableProperties } from "lucide-react";
import { InternalLinkCard, SectionTitle } from "../../components/SiteSections";

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

const readingSteps = [
  { label: "立場", title: "子か親か", description: "まず自分が子か親かを確認します。親は子より点数が高くなります。" },
  { label: "アガリ方", title: "ロンかツモか", description: "ロンは1人から、ツモは3人から受け取るため、見る欄が変わります。" },
  { label: "手の形", title: "符を確認", description: "平和、七対子、鳴いた手など、手の形から使う符の行を選びます。" },
  { label: "役の数", title: "翻を確認", description: "役とドラの翻数を合計し、符の行と交わる点数を見ます。" }
];

export default function ScoreTablePage() {
  return (
    <main className="shell appWorkspace scoreWorkspacePage scoreTableGuidePage">
      <header className="topbar scoreTableGuideHeader">
        <div>
          <p className="eyebrow">Mahjong Score Table</p>
          <h1>麻雀 点数早見表</h1>
          <p>子か親か、ロンかツモか、符、翻の順番で確認すると、初心者でも点数表を迷わず読めます。</p>
        </div>
        <Link className="scoreTableToolLink" href="/tools">
          <Calculator aria-hidden="true" />
          点数計算ツールを使う
        </Link>
      </header>

      <section className="scoreReadingPanel" aria-labelledby="score-reading-title">
        <div className="scorePanelHeading">
          <span className="scorePanelIcon" aria-hidden="true"><CircleHelp /></span>
          <div>
            <p>HOW TO READ</p>
            <h2 id="score-reading-title">点数表を見る順番</h2>
          </div>
        </div>
        <ol className="scoreReadingSteps">
          {readingSteps.map((step, index) => (
            <li key={step.title}>
              <span className="scoreStepNumber">{index + 1}</span>
              <div>
                <small>{step.label}</small>
                <strong>{step.title}</strong>
                <p>{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="scoreTableSection" aria-labelledby="score-tables-title">
        <div className="scorePanelHeading scoreTableSectionHeading">
          <span className="scorePanelIcon" aria-hidden="true"><TableProperties /></span>
          <div>
            <p>SCORE TABLES</p>
            <h2 id="score-tables-title">点数早見表</h2>
          </div>
        </div>
        <div className="scoreTableStack">
          {scoreTables.map((table, index) => (
            <article className="scoreTableCard" key={table.src}>
              <div className="scoreTableCardHeader">
                <span>TABLE {String(index + 1).padStart(2, "0")}</span>
                <h3>{table.title}</h3>
                <p>{table.description}</p>
              </div>
              <div className="scoreTableImageFrame">
                <img src={table.src} alt={table.title} />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="scoreNoticeBlock">
        <SectionTitle title="覚えておきたい補足" description="点数表を見るときに迷いやすい表記を、先に確認しておきましょう。" />
        <div className="scoreNoticeSection">
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
        </div>
      </section>

      <section className="scoreTableNextSection">
        <SectionTitle title="点数表のあとに" description="表で確認したら、実際の手牌や条件でも試してみましょう。" />
        <div className="linkCardGrid scoreTableNextLinks">
          <InternalLinkCard
            title="点数計算ツールを使う"
            description="麻雀点数計算ツールで手牌と条件を変えながら、ロン・ツモの支払いを確認しましょう。"
            href="/tools"
            actionLabel="麻雀点数計算ツール🔰へ"
          />
          <InternalLinkCard
            title="実践でよく見る点数計算"
            description="平和・七対子・副露など、実戦で出やすい形を牌姿つきで確認できます。"
            href="/rules/practical-score"
            actionLabel="牌姿で確認する"
          />
        </div>
        <div className="scoreToolPreviewGrid">
          <figure className="scoreToolPreview">
            <img src="/tool-screenshots/score-calculator-input.png" alt="点数計算ツールで牌姿と条件を入力している画面" />
            <figcaption>牌姿と条件を入力して確認できます。</figcaption>
          </figure>
          <figure className="scoreToolPreview">
            <img src="/tool-screenshots/score-calculator-result.png" alt="点数計算ツールで点数結果を確認している画面" />
            <figcaption>ロン・ツモの支払いと役・符を確認できます。</figcaption>
          </figure>
        </div>
      </section>
    </main>
  );
}
