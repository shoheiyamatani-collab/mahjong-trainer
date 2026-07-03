import type { Metadata } from "next";
import { InternalLinkCard, PageHero, SectionTitle } from "../../components/SiteSections";
import { YakuQuizClient } from "./YakuQuizClient";
import { yakuQuizQuestions } from "./quizData";

export const metadata: Metadata = {
  title: "麻雀 役判定クイズ | 牌姿を見て基本役を確認",
  description:
    "麻雀初心者向けに、牌姿を見てリーチ・タンヤオ・役牌・平和・七対子などの基本役を判定する練習ページです。牌画像つきで役の条件を復習できます。"
};

export default function YakuQuizPage() {
  return (
    <main className="siteMain">
      <PageHero
        eyebrow="Yaku Quiz"
        title="役判定クイズ"
        description="牌姿を見て、どの役が成立しているかを選ぶ練習です。基本役11問を解きながら、間違えた役だけをすぐ復習できます。"
        primaryLink={{ label: "役一覧で復習する", href: "/rules/yaku" }}
        secondaryLink={{ label: "初心者ロードマップへ戻る", href: "/learn" }}
      />

      <section>
        <SectionTitle
          title="牌姿を見て役を選ぶ"
          description="細かい点数や複合役はいったん後回しで大丈夫です。まずは、牌の並びから代表的な役を見つける感覚を作ります。"
        />
        <YakuQuizClient questions={yakuQuizQuestions} />
      </section>

      <section>
        <SectionTitle title="間違えたらここで復習" description="クイズで迷った役は、条件を読み直してからもう一度牌姿を見てみましょう。" />
        <div className="linkCardGrid">
          <InternalLinkCard title="役一覧を見る" description="リーチ、タンヤオ、役牌などの基本役を牌画像つきで確認できます。" href="/rules/yaku" actionLabel="役一覧へ" />
          <InternalLinkCard title="タンヤオを覚える" description="1・9・字牌を使わない役。初心者が最初に見つけやすい役です。" href="/rules/tanyao" actionLabel="タンヤオの条件を読む" />
          <InternalLinkCard title="待ち当て問題を解く" description="役とあわせて、どの牌でアガれるかを見る練習に進めます。" href="/trainer" actionLabel="練習を開く" />
        </div>
      </section>
    </main>
  );
}
