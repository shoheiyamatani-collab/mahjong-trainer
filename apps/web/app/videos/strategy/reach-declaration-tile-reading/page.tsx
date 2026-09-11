import type { Metadata } from "next";
import Link from "next/link";
import { VideoArticleCompactContent } from "../VideoArticleCompactContent";

export const metadata: Metadata = {
  title: "麻雀のリーチ宣言牌から何が分かる？待ちを読む3つの情報",
  description: "リーチ宣言牌が1・9、安全牌、先制リーチ者の現物だった場合に読み取れる情報を初心者向けに解説。待ちの危険度を牌図で比較し、読みを過信しないポイントも紹介します。"
};

const videoUrl = "https://www.youtube.com/watch?v=jc5a_WT9EVU";

type ReadingBlock = {
  label: string;
  tiles: string[];
  weak?: boolean;
  strong?: boolean;
};

type ReadingPattern = {
  number: number;
  time: string;
  title: string;
  summary: string;
  detail: string;
  caution: string;
  href: string;
  blocks: ReadingBlock[];
};

const readingPatterns: ReadingPattern[] = [
  {
    number: 1,
    time: "00:00",
    title: "宣言牌が1・9なら、近くの2・3／7・8に注意する",
    summary: "端牌がテンパイまで手の中に残っていた理由を考える読みです。",
    detail: "1を切ってリーチした場合、直前まで1・2や1・3、1の対子などを持っていた可能性があります。そのため2や3のシャンポン・カンチャンなど、宣言牌の近くに待ちが残る可能性を少し高く見ます。9なら7・8を同じように考えます。",
    caution: "宣言牌の近くが必ず当たりになるわけではありません。両面待ちや他色の待ちも十分あります。",
    href: `${videoUrl}&t=0s`,
    blocks: [
      { label: "宣言牌", tiles: ["man1"], weak: true },
      { label: "注意する候補", tiles: ["man2", "man3"], strong: true },
      { label: "宣言牌", tiles: ["pin9"], weak: true },
      { label: "注意する候補", tiles: ["pin7", "pin8"], strong: true }
    ]
  },
  {
    number: 2,
    time: "05:00",
    title: "安全牌を切ってリーチなら、好形の可能性を考える",
    summary: "テンパイより前から安全牌を手元に残す余裕があったかを見る読みです。",
    detail: "字牌などの安全牌を宣言牌にした場合、手牌の主要部分はその前からまとまり、最後まで安全牌を抱えられた可能性があります。動画では、待ちが両面などの好形である可能性を高く見る考え方を紹介しています。",
    caution: "ドラや手役の都合、打ち手の手順によって例外があります。序盤と終盤でも意味が変わります。",
    href: `${videoUrl}&t=300s`,
    blocks: [
      { label: "安全牌の宣言", tiles: ["ji3"], weak: true },
      { label: "好形の例", tiles: ["sou4", "sou5"] },
      { label: "両面待ち", tiles: ["sou3", "sou6"], strong: true }
    ]
  },
  {
    number: 3,
    time: "13:00",
    title: "追っかけリーチの宣言牌が、先制者の現物だった場合",
    summary: "その牌が手牌の形ではなく、守備用に持っていた牌かもしれないと考えます。",
    detail: "追っかけリーチをした人が、先制リーチ者の現物を宣言牌にした場合、その牌は安全牌として抱えていただけで、待ちの形と関係が薄い可能性があります。このときは宣言牌の周辺だけを強く危険視しない、という読みにつながります。",
    caution: "現物でも手牌の一部だった場合はあります。宣言牌だけで周辺を安全と断定してはいけません。",
    href: `${videoUrl}&t=780s`,
    blocks: [
      { label: "先制者の捨て牌", tiles: ["pin4"], strong: true },
      { label: "追っかけの宣言牌", tiles: ["pin4"], weak: true },
      { label: "形と無関係の可能性", tiles: ["ji1"] }
    ]
  }
];

const tileNames: Record<string, string> = {
  man1: "一萬", man2: "二萬", man3: "三萬",
  pin4: "四筒", pin7: "七筒", pin8: "八筒", pin9: "九筒",
  sou3: "三索", sou4: "四索", sou5: "五索", sou6: "六索",
  ji1: "東", ji3: "西"
};

export default function ReachDeclarationTileReadingArticlePage() {
  return (
    <main className="siteMain videoArticlePage">
      <article>
        <header className="videoArticleHeader">
          <nav aria-label="パンくずリスト"><Link href="/">トップ</Link><span>›</span><Link href="/videos/strategy">麻雀を動画で学ぶ</Link><span>›</span><span>リーチ宣言牌の読み</span></nav>
          <p className="siteEyebrow">VIDEO GUIDE / 守備・捨て牌読み</p>
          <h1>リーチ宣言牌から、何が分かる？</h1>
          <p className="videoArticleLead">リーチで横向きに置かれた牌は、ただの捨て牌ではありません。テンパイする直前まで手の中にあった牌だからこそ、相手の手順や待ちを推測するヒントになります。</p>
          <div className="videoArticleByline"><span>紹介動画: 発男道場【麻雀解説ch】</span><time>動画公開日 2024年6月26日</time><span>約3分で読める</span></div>
        </header>

        <div className="videoArticleEmbed">
          <iframe
            src="https://www.youtube-nocookie.com/embed/jc5a_WT9EVU"
            title="【麻雀解説】リーチ宣言牌だけで分かること（初心者向け）"
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
                    <li>スジとカベを覚え、もう一歩進んだ守備を学びたい人</li>
                    <li>リーチ宣言牌を見ても、現物の確認だけで終わっている人</li>
                    <li>相手がテンパイするまでの手順を想像してみたい人</li>
                    <li>読みを断定ではなく、危険度の比較に使いたい人</li>
                  </ul>
                </section>

        <VideoArticleCompactContent
          message={"リーチで横向きに置かれた牌は、ただの捨て牌ではありません。"}
          points={[
            { title: "宣言牌は「直前まで必要だった牌」かもしれない", description: "リーチ宣言牌は、テンパイした巡目に捨てられた牌です。" },
            { title: "動画で紹介される3つの読み", description: "赤い枠が読みの起点、緑の枠が注目する牌です。" },
            { title: "「読み」は答えではなく、確率を比べる材料", description: "麻雀の捨て牌読みは、相手の手牌を完全に当てる技術ではありません。" },
          ]}
        />

        <section className="videoArticleNext">
                  <p className="videoArticleSectionLabel">NEXT STEP</p>
                  <h2>基本の守備と一緒に復習する</h2>
                  <div>
                    <Link href="/videos/strategy/suji-kabe-defense-basics">スジとカベで安全牌を探す基本に戻る</Link>
                    <Link href="/rules/practical-waits">両面・カンチャン・シャンポン待ちを確認する</Link>
                    <Link href="/videos/strategy/isolated-terminal-tile-order">孤立した1・9の価値と守備へのつながりを見る</Link>
                  </div>
                </section>

</article>
    </main>
  );
}
