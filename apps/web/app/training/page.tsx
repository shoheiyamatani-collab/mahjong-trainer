import type { Metadata } from "next";
import { InternalLinkCard, PageHero, SectionTitle, TrainingCard } from "../components/SiteSections";
import { trainingItems } from "../siteData";

export const metadata: Metadata = {
  title: "麻雀の練習問題一覧 | 何切る・待ち当て・清一色",
  description: "麻雀の何切る問題、待ち当て、7枚形、清一色、役判定、点数計算トレーニングの入口をまとめたページです。"
};

export default function TrainingPage() {
  return (
    <main className="siteMain">
      <PageHero
        eyebrow="Training Menu"
        title="麻雀の練習問題一覧"
        description="読んで覚えたことを、手を動かして確認します。未実装の練習は準備中として表示しています。"
        primaryLink={{ label: "既存トレーナーを開く", href: "/trainer" }}
        secondaryLink={{ label: "初心者ロードマップへ戻る", href: "/learn" }}
      />

      <section>
        <SectionTitle title="練習モード" description="今ある機能は既存トレーナーへ、未実装のものは準備中として扱います。" />
        <div className="trainingGrid">
          {trainingItems.map((item) => (
            <TrainingCard item={item} key={item.title} />
          ))}
        </div>
      </section>

      <section>
        <SectionTitle title="練習のあとに" description="間違えた形は、ルールやツールで確認すると定着しやすくなります。" />
        <div className="linkCardGrid">
          <InternalLinkCard title="間違えたらルールを復習する" description="役、待ち、鳴きなど、つまずいた項目に戻ります。" href="/rules" />
          <InternalLinkCard title="点数計算も練習する" description="点数計算ツールで条件を変えながら確認します。" href="/trainer" />
          <InternalLinkCard title="初心者ロードマップに戻る" description="まだ不安な人は、学習順に戻って整理できます。" href="/learn" />
        </div>
      </section>
    </main>
  );
}
