import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "麻雀の3トイツはどうさばく？対子を2組へ整理する牌効率",
  description: "麻雀中級者向けに、3トイツ形で崩す対子の選び方を牌図で解説。5ブロック、6ブロック、鳴ける手、複合形の例外を整理します。"
};

const videoUrl = "https://www.youtube.com/watch?v=pC_TSiQBezw";

const tileNames: Record<string, string> = {
  man1: "一萬", man2: "二萬", man3: "三萬", man4: "四萬", man5: "五萬", man6: "六萬", man7: "七萬",
  pin2: "二筒", pin3: "三筒", pin4: "四筒", pin5: "五筒", pin6: "六筒", pin7: "七筒",
  sou4: "四索", sou5: "五索", sou6: "六索", sou7: "七索", sou8: "八索", sou9: "九索",
  ji5: "發", ji7: "中"
};

function TileRow({ tiles }: { tiles: string[] }) {
  return (
    <div>
      {tiles.map((tile, index) => (
        <img key={`${tile}-${index}`} src={`/tiles/${tile}-66-90-l-emb.png`} alt={tileNames[tile] ?? tile} />
      ))}
    </div>
  );
}

export default function ThreePairsShapeEfficiencyPage() {
  return (
    <main className="siteMain videoArticlePage">
      <article>
        <header className="videoArticleHeader">
          <nav aria-label="パンくずリスト">
            <Link href="/">トップ</Link><span>›</span>
            <Link href="/videos/strategy">麻雀を動画で学ぶ</Link><span>›</span>
            <Link href="/videos/strategy/advanced">中級者以上向け</Link><span>›</span>
            <span>3トイツのさばき方</span>
          </nav>
          <p className="siteEyebrow">INTERMEDIATE VIDEO GUIDE / 牌効率・対子</p>
          <h1>3トイツ形を効率よくさばく方法</h1>
          <p className="videoArticleLead">通常のアガリ形に必要な雀頭は1組です。対子が3組あるときは、ただ弱い対子を壊すのではなく、ブロック数と、1枚を外した後の変化を比べて整理します。</p>
          <div className="videoArticleByline"><span>紹介動画: 発男道場【麻雀解説ch】</span><time>動画公開日 2024年7月24日</time><span>約10分で読める</span></div>
        </header>

        <div className="videoArticleEmbed">
          <iframe
            src="https://www.youtube-nocookie.com/embed/pC_TSiQBezw"
            title="【麻雀解説】3トイツ形をさばく牌効率の重要ポイント"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
        <p className="videoSourceNote">動画提供: <a href={videoUrl} target="_blank" rel="noopener noreferrer">発男道場【麻雀解説ch】の元動画をYouTubeで見る</a></p>

        <section className="videoArticleAudience">
          <div><p className="videoArticleSectionLabel">RECOMMENDED FOR</p><h2>この動画はこんな人に向いています</h2></div>
          <ul>
            <li>3トイツになると、どの対子を崩すか迷う人</li>
            <li>対子をすべて残して手が重くなりやすい人</li>
            <li>5ブロックと6ブロックの判断を使い分けたい人</li>
            <li>鳴きを考える手で対子を残す条件を知りたい人</li>
          </ul>
        </section>

        <section className="videoArticleBodySection terminalChoiceBaseline">
          <p className="videoArticleSectionLabel">BASIC RULE</p>
          <h2>基本は3トイツを2トイツへ整理する</h2>
          <div className="terminalChoiceComparison">
            <div><span>整理前</span><TileRow tiles={["man1", "man1", "pin5", "pin5", "sou8", "sou8"]} /><b>対子が3組</b></div>
            <div className="isStrong"><span>整理後</span><TileRow tiles={["man1", "man1", "pin5", "sou8", "sou8"]} /><b>1枚を外して対子を2組に</b></div>
          </div>
          <div className="strategyKeyMessage"><strong>残す対子を決めるより、「外した1枚がその後どう変化するか」を見ます。</strong>中央の数牌なら、隣の牌を引いて両面ターツへ変わる可能性があります。</div>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">FIVE BLOCKS</p>
          <h2>5ブロックでは、崩した後の両面変化を比べる</h2>
          <p>必要な5ブロックがそろっている手では、対子を1枚外した後も5ブロックを維持しながら、将来の良形変化が多くなる方を選びます。</p>
          <div className="videoArticleTileBlocks">
            <div><span>残す対子</span><TileRow tiles={["man1", "man1"]} /></div>
            <div className="isWeak"><span>1枚外す対子</span><TileRow tiles={["pin5", "pin5"]} /></div>
            <div><span>残す対子</span><TileRow tiles={["sou8", "sou8"]} /></div>
            <div className="isStrong"><span>残った五筒の変化</span><TileRow tiles={["pin3", "pin4", "pin5", "pin6", "pin7"]} /></div>
          </div>
          <div className="strategyActionBox"><b>5ブロックの選び方</b><p>対子の片方を切った後、残った牌へ何を引けば両面になるかを比較します。中央の牌は複数の両面変化を作りやすい候補です。</p></div>
          <p className="terminalChoiceCaution"><strong>注意:</strong> 上の牌図は判断基準を示す代表例です。役、ドラ、場に見えている枚数があれば、残す対子は変わります。</p>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">SIX BLOCKS</p>
          <h2>6ブロックでは、切ると5ブロックになる対子を選ぶ</h2>
          <p>6ブロックの手では、最終的に1ブロックが余ります。3トイツのうち、独立した対子を1枚外して、その対子をブロック候補から外せる形を探します。</p>
          <div className="videoArticleTileBlocks">
            <div><span>両面1</span><TileRow tiles={["man2", "man3"]} /></div>
            <div><span>両面2</span><TileRow tiles={["man6", "man7"]} /></div>
            <div><span>対子1</span><TileRow tiles={["pin2", "pin2"]} /></div>
            <div><span>対子2</span><TileRow tiles={["sou5", "sou5"]} /></div>
            <div className="isWeak"><span>余分な独立対子</span><TileRow tiles={["sou9", "sou9"]} /></div>
            <div><span>別のターツ</span><TileRow tiles={["pin6", "pin7"]} /></div>
          </div>
          <div className="strategyActionBox"><b>6ブロックの選び方</b><p>対子を崩した結果、手牌全体が5ブロックへ整理される場所を選びます。ほかのターツとつながっている対子を先に壊すと、複合形の変化まで失うことがあります。</p></div>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">EXCEPTION 1</p>
          <h2>鳴ける手では3トイツを残す価値がある</h2>
          <p>役牌やドラをポンして進められる手では、対子がそのまま面子候補になります。門前だけで進める手より、3組の対子を持つ速度低下が小さくなる場合があります。</p>
          <div className="videoArticleTileBlocks">
            <div className="isStrong"><span>ポンできる役牌</span><TileRow tiles={["ji7", "ji7"]} /></div>
            <div className="isStrong"><span>もう一つの役牌</span><TileRow tiles={["ji5", "ji5"]} /></div>
            <div><span>雀頭候補</span><TileRow tiles={["pin5", "pin5"]} /></div>
          </div>
          <div className="strategyKeyMessage"><strong>鳴いた後に役が残るかを先に確認します。</strong>ポンできるから残すのではなく、鳴いてアガれる手かどうかが条件です。</div>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">EXCEPTION 2</p>
          <h2>対子が複合形に埋まっているなら急いで崩さない</h2>
          <p>見た目は対子でも、前後の牌と一緒に順子や両面を作れる形があります。この場合は「独立した3トイツ」と同じように数えず、複合形全体の受け入れを確認します。</p>
          <div className="videoArticleTileBlocks">
            <div className="isStrong"><span>対子を含む4枚形</span><TileRow tiles={["man2", "man3", "man3", "man4"]} /></div>
            <div className="isStrong"><span>対子を含む4枚形</span><TileRow tiles={["pin5", "pin6", "pin6", "pin7"]} /></div>
            <div><span>独立対子</span><TileRow tiles={["sou8", "sou8"]} /></div>
          </div>
          <p>2334や5667は、対子だけでなく順子と両面ターツの両方を見られる形です。独立対子よりも先の変化が多いため、単純な対子の数だけで切らないようにします。</p>
        </section>

        <section className="videoArticleCaution terminalChoiceChecklist">
          <p className="videoArticleSectionLabel">CHECK ORDER</p>
          <h2>3トイツで迷ったときの確認順</h2>
          <ol>
            <li><b>七対子を本線にする手か</b><span>3トイツだけなら通常手が本線になりやすく、4組以上や場況で七対子を比較します。</span></li>
            <li><b>現在は5ブロックか6ブロックか</b><span>5なら良形変化、6なら5ブロックへ整理できる場所を見ます。</span></li>
            <li><b>対子が独立しているか</b><span>2334のような複合形に入る対子は、急いで崩しません。</span></li>
            <li><b>鳴いて役が残るか</b><span>役牌などをポンできる手なら、対子を面子候補として残す価値があります。</span></li>
            <li><b>外した後の両面変化を比べる</b><span>残る1枚が中央寄りで、複数方向へ伸びる形を優先します。</span></li>
          </ol>
        </section>

        <section className="videoArticleNext">
          <p className="videoArticleSectionLabel">NEXT STEP</p>
          <h2>対子とブロック数を実戦で比較する</h2>
          <div>
            <Link href="/analysis/mahjong-tool">牌理チェッカーで受け入れを比較する</Link>
            <Link href="/videos/strategy/block-count-approach">4・5・6ブロックの考え方を読む</Link>
            <Link href="/videos/strategy/tile-efficiency-four-rules">牌効率の4法則を復習する</Link>
            <Link href="/videos/strategy/advanced">中級者以上向け動画を見る</Link>
          </div>
        </section>
      </article>
    </main>
  );
}
