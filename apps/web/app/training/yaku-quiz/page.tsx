import type { Metadata } from "next";
import { InternalLinkCard, PageHero, SectionTitle } from "../../components/SiteSections";
import { YakuQuizClient } from "./YakuQuizClient";
import { yakuQuizQuestions } from "./quizData";

export const metadata: Metadata = {
  title: "麻雀 役判定クイズ | 牌姿を見て基本役を確認",
  description:
    "麻雀初心者向けに、牌姿を見てリーチ・タンヤオ・役牌・平和・七対子などの基本役を判定する練習ページです。牌画像つきで役の条件を復習できます。",
  alternates: { canonical: "/training/yaku-quiz" }
};

export default function YakuQuizPage() {
  return (
    <main className="siteMain">
      <PageHero
        eyebrow="Yaku Quiz"
        title="役判定クイズ"
        description="牌姿を見て、どの役が成立しているかを選ぶ練習です。基本役11問を解きながら、間違えた役だけをすぐ復習できます。"
        primaryLink={{ label: "役一覧で復習する", href: "/rules/yaku" }}
        secondaryLink={{ label: "初心者ロードマップへ戻る", href: "/learn/roadmap" }}
      />

      <section>
        <SectionTitle
          title="牌姿を見て役を選ぶ"
        description="各問はアガリ後の14枚です。東場・南家、門前、一発・ドラ・本場・供託なしを共通条件に、指定したアガリ牌とリーチの有無を見て答えます。最初のツモによる天和・地和など、特別な状況は扱いません。"
        />
        <p>3つの選択肢から、問いに合う役を一つ選びます。表示する正解は「この手の役がそれだけ」という意味ではなく、タンヤオ・平和などが同時に成立する手も含みます。間違えた選択肢との違いを確認してから、解き直しましょう。</p>
        <YakuQuizClient questions={yakuQuizQuestions} />
      </section>

      <section>
        <SectionTitle title="実戦では、形・鳴き・アガリ牌の順に確認" description="順子か刻子かを見つけ、門前限定の役なら鳴いていないことを確認します。平和など待ち方が条件になる役は、最後にアガリ牌も照合しましょう。" />
        <p>このクイズは基本役を見つける練習で、全役の網羅や点数・フリテン・アガリ可否の総合判定ではありません。実際の点数は、役をすべて拾ったうえで符やドラを加えて確認します。問題の役は、点数計算ツールと共通の判定処理でも検証しています。</p>
        <div className="linkCardGrid">
          <InternalLinkCard title="役一覧を見る" description="リーチ、タンヤオ、役牌などの基本役を牌画像つきで確認できます。" href="/rules/yaku" actionLabel="役一覧へ" />
          <InternalLinkCard title="タンヤオを覚える" description="1・9・字牌を使わない役。初心者が最初に見つけやすい役です。" href="/rules/tanyao" actionLabel="タンヤオの条件を読む" />
          <InternalLinkCard title="待ち当て問題を解く" description="役とあわせて、どの牌でアガれるかを見る練習に進めます。" href="/trainer" actionLabel="練習を開く" />
        </div>
      </section>
    </main>
  );
}
