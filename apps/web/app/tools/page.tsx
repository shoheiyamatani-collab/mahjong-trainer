import type { Metadata } from "next";
import { CategoryCard, InternalLinkCard, PageHero, SectionTitle } from "../components/SiteSections";
import { toolItems } from "../siteData";

export const metadata: Metadata = {
  title: "麻雀の便利ツール一覧 | 点数計算・受け入れ・役一覧",
  description: "麻雀の点数計算ツール、符計算サポート、待ち判定、受け入れ枚数チェッカー、役一覧、初心者向け点数表の入口です。"
};

export default function ToolsPage() {
  return (
    <main className="siteMain">
      <PageHero
        eyebrow="Tools"
        title="麻雀の便利ツール一覧"
        description="問題で迷った形や、対局中に分からなくなりやすい点数・役・待ちを確認するための入口です。"
        primaryLink={{ label: "点数計算ツールを開く", href: "/trainer" }}
        secondaryLink={{ label: "実戦問題で練習する", href: "/training" }}
      />

      <section>
        <SectionTitle title="調べる・確認する" description="未実装のツールは、クリックできない準備中カードにしています。" />
        <div className="categoryGrid toolGrid">
          {toolItems.map((item, index) => (
            <CategoryCard
              key={item.title}
              title={item.title}
              description={`${item.description} ${item.beginnerNote}`}
              href={item.href}
              status={item.status}
              actionLabel={item.status === "available" ? `${item.title}を使う` : "準備中"}
              tone={index % 3 === 0 ? "green" : index % 3 === 1 ? "yellow" : "blue"}
            />
          ))}
        </div>
      </section>

      <section>
        <SectionTitle title="ツールから学習へ" description="調べて終わりではなく、関連する練習に戻れる導線を置いています。" />
        <div className="linkCardGrid">
          <InternalLinkCard title="点数計算を覚える" description="点数は最後で大丈夫。まずはツールで結果を見ながら慣れます。" href="/learn" />
          <InternalLinkCard title="役一覧を確認する" description="リーチ、タンヤオ、役牌など、よく使う役から確認します。" href="/rules" />
          <InternalLinkCard title="実戦問題で練習する" description="何切るや待ち当てに戻って、理解した形をもう一度解きます。" href="/training" />
        </div>
      </section>
    </main>
  );
}
