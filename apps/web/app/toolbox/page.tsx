import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, SectionTitle } from "../components/SiteSections";
import { getToolCatalog } from "./toolCatalog";
import { ToolDirectory } from "./ToolDirectory";
import { ToolDirectoryQuery } from "./ToolDirectoryQuery";
import approvedTedashi from "../training/tedashi-reading/data/approved.json";
export const metadata: Metadata = { title: "麻雀ツール・トレーニングを探す", description: "牌理チェッカー、何切る、待ち、点数計算、鳴き、押し引きなど、雀フォリオのツールを検索・分野別に選べます。", alternates: { canonical: "/toolbox" } };
export default function ToolboxPage() {
  const items = getToolCatalog(approvedTedashi.length > 0 || process.env.NODE_ENV === "development");
  return <main className="siteMain">
    <PageHero eyebrow="TOOLBOX" title="ツール・トレーニングを探す" description="調べたいこと、鍛えたい力から選ぶ。" />
    <Suspense fallback={<ToolDirectory items={items} />}><ToolDirectoryQuery items={items} /></Suspense>
    <section className="rulesLearningSequence" aria-labelledby="toolbox-purpose-title">
      <SectionTitle id="toolbox-purpose-title" title="対局の振り返りと、問題練習を使い分ける" description="自分の手牌を確かめるなら解析・計算、繰り返し判断するならトレーニング。同じ点数でも、何を知りたいかによって使う道具が変わります。" />
      <ol>
        <li><span>01</span><div><h3>14枚から何を切るかを比べたい</h3><p>牌理チェッカーで打牌後のシャンテン数・受け入れ枚数・良形率を比較します。枚数が多い候補を知る道具であり、相手への危険度や最終的な収支を自動で断定するものではありません。</p><Link href="/analysis/mahjong-tool">牌理チェッカー</Link><span aria-hidden="true">　</span><Link href="/analysis/mahjong-tool/help">計算結果の読み方</Link></div></li>
        <li><span>02</span><div><h3>アガった手の役・符・支払いを調べたい</h3><p>点数計算には完成形とアガリ牌、親子・ロンツモなどを入力します。翻と符が既に分かるなら早見表で確認できます。必要なアガリ点そのものが分からない場合は、順位条件の計算へ進みます。</p><Link href="/tools">点数計算</Link><span aria-hidden="true">　</span><Link href="/tools/score-table">点数早見表</Link></div></li>
        <li><span>03</span><div><h3>オーラスで何点なら順位が変わるか知りたい</h3><p>4人の持ち点、本場、供託、同点時の扱いをそろえ、ロン相手別・ツモの条件を比較します。必要点を満たす手が実際に作れるかは、役と待ちを別に確認します。</p><Link href="/analysis/orasu-condition">オーラス条件計算</Link><span aria-hidden="true">　</span><Link href="/analysis/orasu-condition#orasu-usage">条件の見方</Link></div></li>
        <li><span>04</span><div><h3>対局中に判断できるよう繰り返し練習したい</h3><p>何切る・待ち・点数・鳴き・押し引きの練習から選びます。答えを覚えるだけでなく、見落とした条件を解説で確認し、関連する学習記事に戻って復習します。</p><Link href="/trainer">分野別に練習を選ぶ</Link><span aria-hidden="true">　</span><Link href="/learn/guides">判断の理由を学ぶ</Link></div></li>
      </ol>
    </section>
  </main>;
}
