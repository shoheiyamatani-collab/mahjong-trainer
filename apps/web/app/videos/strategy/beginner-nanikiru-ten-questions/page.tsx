import type { Metadata } from "next";
import Link from "next/link";
import { ClearRainNanikiruBook } from "../../../components/VideoBookRecommendation";
import { VideoArticleCompactContent } from "../VideoArticleCompactContent";

export const metadata: Metadata = {
  title: "麻雀初心者が間違えたくない何切る問題10問 | ブロックと対子の数え方",
  description: "麻雀初心者向けの何切る全10問を紹介。浮き牌、6ブロック、カンチャン比較、対子の数、複合ターツの判断を短い要点で分かりやすく整理します。"
};

const videoUrl = "https://www.youtube.com/watch?v=8ZsxOw6-NJs";

const tileNames: Record<string, string> = {
  man2: "二萬", man3: "三萬", man4: "四萬", man5: "五萬", man6: "六萬", man7: "七萬", man8: "八萬", man9: "九萬",
  pin2: "二筒", pin3: "三筒", pin4: "四筒", pin5: "五筒", pin6: "六筒", pin7: "七筒", pin8: "八筒", pin9: "九筒",
  sou1: "一索", sou2: "二索", sou3: "三索", sou4: "四索", sou5: "五索", sou6: "六索", sou7: "七索", sou8: "八索", sou9: "九索",
  ji7: "中"
};

type AnswerGuide = {
  number: number;
  time: string;
  tile: string;
  tileLabel: string;
  title: string;
  reason: string;
};

const answers: AnswerGuide[] = [
  { number: 1, time: "0:41", tile: "ji7", tileLabel: "中", title: "浮き牌から整理する", reason: "面子候補を作れない孤立した牌があるときは、完成に必要なブロックを壊す前に浮き牌から切ります。" },
  { number: 2, time: "1:42", tile: "sou9", tileLabel: "九索", title: "6ブロックなら弱いブロックを外す", reason: "4面子1雀頭に必要なのは基本的に5ブロックです。6つあるなら、両面より弱いペンチャンを整理します。" },
  { number: 3, time: "3:25", tile: "pin8", tileLabel: "八筒", title: "カンチャン同士は変化量で比べる", reason: "どちらも受け入れが1種類なら、周囲の牌を引いて両面へ変化しやすい内側の形を残します。" },
  { number: 4, time: "4:28", tile: "pin6", tileLabel: "六筒", title: "両面を残し、余分な対子を整理する", reason: "対子が2組以上ある手で両面と対子を比べる場合は、受け入れが広い両面を優先します。" },
  { number: 5, time: "5:54", tile: "man2", tileLabel: "二萬", title: "2対子ならカンチャンより対子を残す", reason: "対子を残すと雀頭候補を確保でき、横へ伸びて両面になる変化も期待できます。" },
  { number: 6, time: "7:41", tile: "sou1", tileLabel: "一索", title: "3対子なら対子を1組減らす", reason: "対子が3組あると1組が余りやすくなります。ペンチャンを壊す前に、余分な対子を整理する視点を持ちます。" },
  { number: 7, time: "8:41", tile: "man2", tileLabel: "二萬", title: "5ブロックを壊さず弱い複合ターツを対子にする", reason: "すでに5ブロックあるため、新しくブロックを作るより現在の形を保ち、弱い複合ターツを対子として残します。" },
  { number: 8, time: "10:12", tile: "man6", tileLabel: "六萬", title: "5ブロック3対子では強い複合ターツをターツにする", reason: "対子が余る手では、強い複合ターツを広いターツとして使い、両面の受け入れを残します。" },
  { number: 9, time: "11:21", tile: "sou5", tileLabel: "五索", title: "最終的な待ちの枚数まで比べる", reason: "似た複合形でも、切った後に残る待ちの種類と枚数は異なります。完成形を1手先まで想像します。" },
  { number: 10, time: "12:40", tile: "pin4", tileLabel: "四筒", title: "5ブロック2対子は弱い複合ターツを対子にする", reason: "雀頭候補を確保しながら、弱い複合ターツを整理して強いターツの受け入れを残します。" }
];

function Tile({ tile, selected = false }: { tile: string; selected?: boolean }) {
  return (
    <span className={selected ? "beginnerNanikiruSelectedTile" : undefined}>
      <img src={`/tiles/${tile}-66-90-l-emb.png`} alt={tileNames[tile] ?? tile} />
    </span>
  );
}

function TileGroup({ tiles, label, weak = false }: { tiles: string[]; label?: string; weak?: boolean }) {
  return (
    <div className={`beginnerNanikiruTileGroup${weak ? " isWeak" : ""}`}>
      {label && <span>{label}</span>}
      <div>{tiles.map((tile, index) => <Tile key={`${tile}-${index}`} tile={tile} />)}</div>
    </div>
  );
}

export default function BeginnerNanikiruTenQuestionsArticlePage() {
  return (
    <main className="siteMain videoArticlePage">
      <article>
        <header className="videoArticleHeader">
          <nav aria-label="パンくずリスト"><Link href="/">トップ</Link><span>›</span><Link href="/videos/strategy">麻雀を動画で学ぶ</Link><span>›</span><span>初心者向け何切る10問</span></nav>
          <p className="siteEyebrow">VIDEO GUIDE / 牌効率・何切る</p>
          <h1>初心者が間違えたくない、何切る問題10問</h1>
          <p className="videoArticleLead">何切るで迷ったとき、いきなり受け入れ枚数を数える必要はありません。まずブロック数、次に対子の数、最後に形の強さを見る。この順番を全10問で身につける動画です。</p>
          <div className="videoArticleByline"><span>紹介動画: クリアレインのアトリエ【麻雀解説】</span><time>動画公開日 2026年4月11日</time><span>約3分で読める</span></div>
        </header>

        <div className="videoArticleEmbed">
          <iframe
            src="https://www.youtube-nocookie.com/embed/8ZsxOw6-NJs"
            title="【麻雀】初心者が絶対に間違えてはいけない何切る問題【全10問】"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen loading="lazy" />
        </div>
        <p className="videoSourceNote">動画提供: <a href={videoUrl} target="_blank" rel="noopener noreferrer">クリアレインのアトリエ【麻雀解説】の元動画をYouTubeで見る</a></p>

        <section className="videoArticleAudience">
                  <div>
                    <p className="videoArticleSectionLabel">RECOMMENDED FOR</p>
                    <h2>この動画はこんな人に向いています</h2>
                  </div>
                  <ul>
                    <li>何切る問題を解き始めたばかりの人</li>
                    <li>両面が大切なのは知っていても、対子をいつ崩すか迷う人</li>
                    <li>5ブロックと6ブロックを数えずに切ってしまう人</li>
                    <li>複合ターツが出ると、何を残せばよいか分からなくなる人</li>
                  </ul>
                </section>

        <VideoArticleCompactContent
          message={"何切るで迷ったとき、いきなり受け入れ枚数を数える必要はありません。"}
          points={[
            { title: "動画を止めて、理由まで声に出してから答えを見る", description: "" },
            { title: "何切るで最初に見る3つ", description: "5ブロックが足りているなら、どの面子候補にも関係していない牌から整理します。" },
            { title: "全10問の答えと覚えるポイント", description: "各問の答えは、見出しを押したときだけ表示されます。" },
          ]}
        />

        <ClearRainNanikiruBook />

        <section className="videoArticleNext">
                  <p className="videoArticleSectionLabel">NEXT STEP</p>
                  <h2>同じ判断を自分の手で試す</h2>
                  <div>
                    <Link href="/trainer">何切る問題を解く</Link>
                    <Link href="/analysis/mahjong-tool">牌理チェッカーで受け入れを比較する</Link>
                    <Link href="/videos/strategy/tile-efficiency-four-rules">牌効率の4法則を動画で学ぶ</Link>
                    <Link href="/videos/strategy/tile-efficiency-essential-theory-quiz">全16問の何切るセオリーへ進む</Link>
                  </div>
                </section>

</article>
    </main>
  );
}
