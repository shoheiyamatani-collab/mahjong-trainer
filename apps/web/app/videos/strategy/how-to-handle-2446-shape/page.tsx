import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "麻雀の2446は何を切る？｜複合形の扱いと判断基準",
  description: "麻雀中級者向けに、2446から2・4・6のどれを切るか牌図で解説。ピンフ、両面変化、ポン、最終待ち、巡目による選択を比較します。"
};

const videoUrl = "https://www.youtube.com/watch?v=7XSu0hGAfeI";

const tileNames: Record<string, string> = {
  man1: "一萬", man2: "二萬", man3: "三萬", man4: "四萬", man5: "五萬", man6: "六萬", man7: "七萬", man8: "八萬",
  pin2: "二筒", pin3: "三筒", pin4: "四筒", pin5: "五筒", pin6: "六筒", pin7: "七筒",
  sou3: "三索", sou4: "四索", sou5: "五索", sou6: "六索", sou7: "七索"
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

export default function Handle2446ShapePage() {
  return (
    <main className="siteMain videoArticlePage">
      <article>
        <header className="videoArticleHeader">
          <nav aria-label="パンくずリスト">
            <Link href="/">トップ</Link><span>›</span>
            <Link href="/videos/strategy">麻雀を動画で学ぶ</Link><span>›</span>
            <Link href="/videos/strategy/advanced">中級者以上向け</Link><span>›</span>
            <span>2446の扱い</span>
          </nav>
          <p className="siteEyebrow">INTERMEDIATE VIDEO GUIDE / 牌効率・複合形</p>
          <h1>複合形2446は何を切る？</h1>
          <p className="videoArticleLead">二四四六萬は、リャンカンと対子が重なった4枚形です。四萬を切ってカンチャン2つを残すか、二萬を切って四萬の対子を残すか、六萬を切って中間を取るか。手牌の役と巡目によって選択が変わります。</p>
          <div className="videoArticleByline"><span>紹介動画: 発男道場【麻雀解説ch】</span><time>動画公開日 2025年9月20日</time><span>約11分で読める</span></div>
        </header>

        <div className="videoArticleEmbed">
          <iframe
            src="https://www.youtube-nocookie.com/embed/7XSu0hGAfeI"
            title="【麻雀解説】意外と知らない？2446を扱う時のポイント！"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
        <p className="videoSourceNote">動画提供: <a href={videoUrl} target="_blank" rel="noopener noreferrer">発男道場【麻雀解説ch】の元動画をYouTubeで見る</a></p>

        <section className="videoArticleAudience">
          <div><p className="videoArticleSectionLabel">RECOMMENDED FOR</p><h2>この動画はこんな人に向いています</h2></div>
          <ul>
            <li>2446から何となく四萬を切っている人</li>
            <li>ピンフと両面変化のどちらを優先するか迷う人</li>
            <li>ポンできる対子を残す条件を知りたい人</li>
            <li>序盤と中盤で複合形の扱いを変えたい人</li>
          </ul>
        </section>

        <section className="videoArticleBodySection terminalChoiceBaseline">
          <p className="videoArticleSectionLabel">SHAPE BASICS</p>
          <h2>2446は3つの切り方がある</h2>
          <div className="videoArticleTileBlocks">
            <div className="isStrong"><span>元の形</span><TileRow tiles={["man2", "man4", "man4", "man6"]} /></div>
            <div><span>四萬切り</span><TileRow tiles={["man2", "man4", "man6"]} /></div>
            <div><span>二萬切り</span><TileRow tiles={["man4", "man4", "man6"]} /></div>
            <div><span>六萬切り</span><TileRow tiles={["man2", "man4", "man4"]} /></div>
          </div>
          <div className="strategyKeyMessage"><strong>最初に見るのは三萬・五萬を引いた後の役です。</strong>どちらを引いてもピンフが確定する手なら四萬切り、ピンフにならない手なら二萬切りを基本にすると整理しやすくなります。</div>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">CUT 4</p>
          <h2>四萬切りはピンフを最大限に見る</h2>
          <div className="videoArticleTileBlocks">
            <div><span>四萬を1枚切る</span><TileRow tiles={["man2", "man4", "man6"]} /></div>
            <div className="isStrong"><span>三萬を引く</span><TileRow tiles={["man2", "man3", "man4"]} /></div>
            <div className="isStrong"><span>五萬を引く</span><TileRow tiles={["man4", "man5", "man6"]} /></div>
          </div>
          <p>四萬を切ると、三萬・五萬の合計8枚で順子ができます。手牌のほかの部分に雀頭と両面がそろい、どちらを引いてもピンフになるなら、この8枚をまっすぐ受ける価値が高くなります。五萬が赤なら、赤五萬の受け入れも残せます。</p>
          <p className="terminalChoiceCaution"><strong>弱点:</strong> 四萬の対子を崩すためポンできず、二萬切りと比べると将来の両面変化が少なくなります。</p>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">CUT 2</p>
          <h2>二萬切りは両面変化とポンを残す</h2>
          <div className="videoArticleTileBlocks">
            <div><span>二萬を切る</span><TileRow tiles={["man4", "man4", "man6"]} /></div>
            <div className="isStrong"><span>五萬で両面</span><TileRow tiles={["man4", "man4", "man5", "man6"]} /></div>
            <div className="isStrong"><span>七萬で両面</span><TileRow tiles={["man4", "man4", "man6", "man7"]} /></div>
            <div><span>四萬をポンできる</span><TileRow tiles={["man4", "man4", "man4"]} /></div>
          </div>
          <p>二萬を切れば四萬の対子が残り、四萬をポンして手を進められます。五萬・七萬などで両面へ育つ変化も広く、ピンフがつかない手や、タンヤオ・役牌などで鳴ける手では有力です。</p>
          <p className="terminalChoiceCaution"><strong>弱点:</strong> ピンフになる受け入れは四萬切りより減ります。愚形テンパイになった場合、先切りによる出やすさも期待しにくく、四萬と六萬が守備で切りづらくなることがあります。</p>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">CUT 6</p>
          <h2>六萬切りは2つの選択の中間</h2>
          <div className="videoArticleTileBlocks">
            <div><span>六萬を切る</span><TileRow tiles={["man2", "man4", "man4"]} /></div>
            <div><span>三萬を引く</span><TileRow tiles={["man2", "man3", "man4", "man4"]} /></div>
            <div className="isStrong"><span>四萬をポンできる</span><TileRow tiles={["man4", "man4", "man4"]} /></div>
          </div>
          <p>六萬切りは四萬の対子を残しながら、二萬切りよりもピンフ側へ寄せる中間的な選択です。赤五萬の受けを失い、両面変化も二萬切りより減るため、序盤は第一候補になりにくい一方、中盤では最終待ちや守備を優先して候補に上がります。</p>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">HAND PLAN</p>
          <h2>ピンフか、鳴いて進める手かを先に決める</h2>
          <div className="terminalChoiceComparison">
            <div className="isStrong"><span>ピンフを狙う</span><TileRow tiles={["pin3", "pin4", "pin5", "sou4", "sou5"]} /><b>四萬切りで三・五萬を受ける</b></div>
            <div><span>鳴ける手</span><TileRow tiles={["pin4", "pin5", "pin6", "sou5", "sou6", "sou7"]} /><b>二萬切りで四萬のポンを残す</b></div>
          </div>
          <p>門前でピンフがつけば打点や待ちが良くなる手は四萬切りへ寄せます。すでにタンヤオや役牌があり、鳴いても十分な打点がある手は、ピンフより速度が重要です。この場合は四萬のポンを残す二萬切り、または六萬切りが優位になります。</p>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">ROUND</p>
          <h2>巡目が進むと変化より現在の強さを取る</h2>
          <div className="videoPrincipleList">
            <section className="videoPrinciple">
              <div className="videoPrincipleNumber">1</div>
              <div className="videoPrincipleBody"><h3>序盤は二萬切りの変化を生かす</h3><p>両面や三面張へ育つ時間があるため、ピンフがない手では二萬切りの広い変化が有効です。</p></div>
            </section>
            <section className="videoPrinciple">
              <div className="videoPrincipleNumber">2</div>
              <div className="videoPrincipleBody"><h3>中盤は六萬切りも有力になる</h3><p>変化を待つ時間が減ると、二萬切り後に愚形が残る弱点や、危険牌を複数抱える守備面が重くなります。</p></div>
            </section>
            <section className="videoPrinciple">
              <div className="videoPrincipleNumber">3</div>
              <div className="videoPrincipleBody"><h3>瞬間の受け入れと最終待ちを比べる</h3><p>10巡目前後では、将来の変化よりテンパイ枚数とアガリやすい待ちを優先する場面が増えます。</p></div>
            </section>
          </div>
        </section>

        <section className="videoArticleCaution terminalChoiceChecklist">
          <p className="videoArticleSectionLabel">CHECK ORDER</p>
          <h2>2446で迷ったときの確認順</h2>
          <ol>
            <li><b>三萬・五萬を引いた後の役を見る</b><span>両方でピンフが確定するなら四萬切りを基準にします。</span></li>
            <li><b>鳴ける手か確認する</b><span>タンヤオ・役牌・十分なドラがあれば四萬のポンを残します。</span></li>
            <li><b>雀頭がほかにあるかを見る</b><span>対子を崩した後も雀頭が足りるか確認します。</span></li>
            <li><b>巡目を見る</b><span>序盤は変化、中盤以降は瞬間の受け入れと最終待ちを重視します。</span></li>
            <li><b>赤五萬と守備力を確認する</b><span>赤の受け入れと、後で切りにくい牌を何枚抱えるかも比較します。</span></li>
          </ol>
        </section>

        <section className="videoArticleNext">
          <p className="videoArticleSectionLabel">NEXT STEP</p>
          <h2>複合形を続けて比較する</h2>
          <div>
            <Link href="/analysis/mahjong-tool">牌理チェッカーで受け入れを比較する</Link>
            <Link href="/videos/strategy/how-to-handle-35677">複合形35677の扱いを読む</Link>
            <Link href="/videos/strategy/ryankan-vs-aryanmen-shape">リャンカンと亜両面を比較する</Link>
            <Link href="/videos/strategy/advanced">中級者以上向け動画を見る</Link>
          </div>
        </section>
      </article>
    </main>
  );
}
