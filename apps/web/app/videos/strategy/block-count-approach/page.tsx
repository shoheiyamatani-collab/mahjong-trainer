import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "麻雀はブロック数で打ち方が変わる｜4・5・6ブロックの牌効率",
  description: "麻雀中級者向けに、4・5・6ブロックで打牌方針をどう変えるかを牌図で解説。ブロックを増やす、維持する、弱い形を減らす判断を整理します。"
};

const videoUrl = "https://www.youtube.com/watch?v=-DqvQsmOdew";

const tileNames: Record<string, string> = {
  man2: "二萬", man3: "三萬", man4: "四萬", man6: "六萬", man7: "七萬", man8: "八萬",
  pin2: "二筒", pin3: "三筒", pin4: "四筒", pin5: "五筒", pin6: "六筒", pin7: "七筒",
  sou2: "二索", sou3: "三索", sou4: "四索", sou5: "五索", sou6: "六索",
  ji7: "中"
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

export default function BlockCountApproachPage() {
  return (
    <main className="siteMain videoArticlePage">
      <article>
        <header className="videoArticleHeader">
          <nav aria-label="パンくずリスト">
            <Link href="/">トップ</Link><span>›</span>
            <Link href="/videos/strategy">麻雀を動画で学ぶ</Link><span>›</span>
            <Link href="/videos/strategy/advanced">中級者以上向け</Link><span>›</span>
            <span>ブロック別の打ち方</span>
          </nav>
          <p className="siteEyebrow">INTERMEDIATE VIDEO GUIDE / 牌効率・ブロック数</p>
          <h1>麻雀はブロック数で打ち方が変わる｜4・5・6ブロックの考え方</h1>
          <p className="videoArticleLead">ターツの強さだけを比べても、正しい打牌を選べないことがあります。まず手牌が何ブロックあるかを数え、「増やす・維持する・減らす」のどれが必要かを決めましょう。</p>
          <div className="videoArticleByline"><span>紹介動画: 発男道場【麻雀解説ch】</span><time>動画公開日 2026年4月8日</time><span>約9分で読める</span></div>
        </header>

        <div className="videoArticleEmbed">
          <iframe
            src="https://www.youtube-nocookie.com/embed/-DqvQsmOdew"
            title="【麻雀解説】麻雀はブロックの数で打ち方が変わる！ブロック別のアプローチ方法"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
        <p className="videoSourceNote">動画提供: <a href={videoUrl} target="_blank" rel="noopener noreferrer">発男道場【麻雀解説ch】の元動画をYouTubeで見る</a></p>

        <section className="videoArticleAudience">
          <div><p className="videoArticleSectionLabel">RECOMMENDED FOR</p><h2>この動画はこんな人に向いています</h2></div>
          <ul>
            <li>ターツの強弱は分かるのに何切るで迷う人</li>
            <li>5ブロック理論を実戦で使いたい人</li>
            <li>孤立牌を残す理由を説明できるようになりたい人</li>
            <li>6ブロックから落とす形を選べない人</li>
          </ul>
        </section>

        <section className="videoArticleBodySection terminalChoiceBaseline">
          <p className="videoArticleSectionLabel">THREE DIRECTIONS</p>
          <h2>数えた後の方針は3つだけ</h2>
          <div className="terminalChoiceComparison">
            <div><span>4ブロック</span><TileRow tiles={["pin5"]} /><b>孤立牌から5つ目を作る</b></div>
            <div className="isStrong"><span>5ブロック</span><TileRow tiles={["man2", "man3", "pin3", "pin4", "sou5", "sou6", "ji7", "ji7"]} /><b>今ある5つを維持する</b></div>
            <div><span>6ブロック</span><TileRow tiles={["pin2", "pin4"]} /><b>弱い1ブロックを減らす</b></div>
          </div>
          <div className="strategyKeyMessage"><strong>4なら増やす、5なら守る、6なら減らす。</strong>打牌候補の比較より先に方向を決めると、孤立牌やターツの価値が見えやすくなります。</div>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">4 BLOCKS</p>
          <h2>4ブロックは、孤立牌から5つ目を作る</h2>
          <p>完成に必要な5ブロックへ1つ足りない状態です。中央寄りの孤立牌や複合形を残し、次のツモで新しいターツを作れる可能性を確保します。</p>
          <div className="videoArticleTileBlocks">
            <div><span>面子</span><TileRow tiles={["man2", "man3", "man4"]} /></div>
            <div><span>ターツ</span><TileRow tiles={["pin3", "pin4"]} /></div>
            <div><span>ターツ</span><TileRow tiles={["sou5", "sou6"]} /></div>
            <div><span>頭候補</span><TileRow tiles={["ji7", "ji7"]} /></div>
            <div className="isStrong"><span>5つ目を作る孤立牌</span><TileRow tiles={["man6"]} /></div>
          </div>
          <div className="strategyActionBox"><b>4ブロックの方針</b><p>孤立牌を単に不要と見ず、何を引けば両面や複合形になるかを比較します。特に3〜7の牌は新しいブロックを作りやすい候補です。</p></div>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">5 BLOCKS</p>
          <h2>5ブロックは、必要な形を崩さず維持する</h2>
          <p>アガリに必要なブロック数がそろっています。孤立牌を残すためにターツを壊すと、一時的に4ブロックへ戻り、テンパイまで遠くなることがあります。</p>
          <div className="videoArticleTileBlocks">
            <div><span>面子</span><TileRow tiles={["man2", "man3", "man4"]} /></div>
            <div className="isStrong"><span>両面</span><TileRow tiles={["man7", "man8"]} /></div>
            <div className="isStrong"><span>両面</span><TileRow tiles={["pin3", "pin4"]} /></div>
            <div><span>カンチャン</span><TileRow tiles={["sou4", "sou6"]} /></div>
            <div><span>頭候補</span><TileRow tiles={["ji7", "ji7"]} /></div>
            <div className="isWeak"><span>先に処理する孤立牌</span><TileRow tiles={["pin7"]} /></div>
          </div>
          <div className="strategyActionBox"><b>5ブロックの方針</b><p>必要な5つを維持しながら余分な牌を処理します。ターツ同士を比較するときは、両面、カンチャン、ペンチャンの順だけでなく、対子の数も確認します。</p></div>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">6 BLOCKS</p>
          <h2>6ブロックは、弱い1つを選んで5つへ絞る</h2>
          <p>どこか1ブロックが最終的に余ります。すべてを引っ張るより、受け入れ、良形変化、打点、頭候補の数を比べ、価値の低い形から整理します。</p>
          <div className="videoArticleTileBlocks">
            <div className="isStrong"><span>残したい両面</span><TileRow tiles={["man2", "man3"]} /></div>
            <div className="isStrong"><span>残したい両面</span><TileRow tiles={["man7", "man8"]} /></div>
            <div className="isWeak"><span>比較対象のカンチャン</span><TileRow tiles={["pin2", "pin4"]} /></div>
            <div><span>両面</span><TileRow tiles={["pin6", "pin7"]} /></div>
            <div><span>両面</span><TileRow tiles={["sou2", "sou3"]} /></div>
            <div><span>頭候補</span><TileRow tiles={["sou5", "sou5"]} /></div>
          </div>
          <div className="strategyActionBox"><b>6ブロックの方針</b><p>弱いブロックを1つ落として5つへ絞ります。ただし、対子が1組しかないなら頭候補は残すなど、手牌内での役割を優先します。</p></div>
          <p className="terminalChoiceCaution"><strong>注意:</strong> 両面なら必ず残す、カンチャンなら必ず落とす、とは限りません。ドラ、役、場に見えている枚数、対子の数で価値は変わります。</p>
        </section>

        <section className="videoArticleCaution terminalChoiceChecklist">
          <p className="videoArticleSectionLabel">CHECK ORDER</p>
          <h2>何切るで迷ったときの確認順</h2>
          <ol>
            <li><b>面子・ターツ・対子をブロックに分ける</b><span>複合形は重複して数えず、どの完成形を目指すかを見ます。</span></li>
            <li><b>現在が4・5・6ブロックのどれか数える</b><span>先に増やす、維持する、減らすの方向を決めます。</span></li>
            <li><b>各ブロックの役割を比べる</b><span>受け入れだけでなく、頭候補、打点、鳴きやすさも確認します。</span></li>
            <li><b>場況で基本を調整する</b><span>有効牌が何枚見えているか、ドラや安全度も最後に加えます。</span></li>
          </ol>
        </section>

        <section className="videoArticleNext">
          <p className="videoArticleSectionLabel">NEXT STEP</p>
          <h2>ブロック数と受け入れを実戦で比べる</h2>
          <div>
            <Link href="/analysis/mahjong-tool">牌理チェッカーで受け入れを比較する</Link>
            <Link href="/videos/strategy/intermediate-tile-efficiency-26-rules">中級牌効率の26セオリーを読む</Link>
            <Link href="/videos/strategy/safe-tile-and-floating-tile-decisions">安牌と孤立牌の判断基準を読む</Link>
            <Link href="/videos/strategy/advanced">中級者以上向け動画を見る</Link>
          </div>
        </section>
      </article>
    </main>
  );
}
