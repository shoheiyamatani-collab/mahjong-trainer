import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "麻雀のペンチャンと孤立牌の優先順位｜残す形の判断基準",
  description: "麻雀中級者向けに、ペンチャンと孤立牌3〜7のどちらを残すか牌図で解説。シャンテン数、最終待ち、タンヤオ、巡目から判断します。"
};

const videoUrl = "https://www.youtube.com/watch?v=BO96oiuZoBA";

const tileNames: Record<string, string> = {
  man1: "一萬", man2: "二萬", man3: "三萬", man4: "四萬", man5: "五萬",
  man6: "六萬", man7: "七萬", man8: "八萬", man9: "九萬",
  pin1: "一筒", pin2: "二筒", pin3: "三筒", pin4: "四筒", pin5: "五筒",
  pin6: "六筒", pin7: "七筒", pin8: "八筒", pin9: "九筒",
  sou1: "一索", sou2: "二索", sou3: "三索", sou4: "四索", sou5: "五索",
  sou6: "六索", sou7: "七索", sou8: "八索", sou9: "九索"
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

export default function PenchanVsIsolatedTilesPage() {
  return (
    <main className="siteMain videoArticlePage">
      <article>
        <header className="videoArticleHeader">
          <nav aria-label="パンくずリスト">
            <Link href="/">トップ</Link><span>›</span>
            <Link href="/videos/strategy">麻雀を動画で学ぶ</Link><span>›</span>
            <Link href="/videos/strategy/advanced">中級者以上向け</Link><span>›</span>
            <span>ペンチャンと孤立牌</span>
          </nav>
          <p className="siteEyebrow">INTERMEDIATE VIDEO GUIDE / 牌効率・ターツ比較</p>
          <h1>ペンチャンと孤立牌3〜7の優先順位</h1>
          <p className="videoArticleLead">ペンチャンは待ちとして弱い一方、あと1枚で面子になります。孤立した3〜7は両面へ育ちやすい一方、面子完成まで通常2手かかります。どちらを残すかは「弱い形か、強い形か」だけでなく、テンパイまでの距離と完成後の価値で決めます。</p>
          <div className="videoArticleByline"><span>紹介動画: 発男道場【麻雀解説ch】</span><time>動画公開日 2026年4月18日</time><span>約11分で読める</span></div>
        </header>

        <div className="videoArticleEmbed">
          <iframe
            src="https://www.youtube-nocookie.com/embed/BO96oiuZoBA"
            title="【麻雀解説】これでもう迷わない！ペンチャンと孤立牌3〜7の選択基準"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
        <p className="videoSourceNote">動画提供: <a href={videoUrl} target="_blank" rel="noopener noreferrer">発男道場【麻雀解説ch】の元動画をYouTubeで見る</a></p>

        <section className="videoArticleAudience">
          <div><p className="videoArticleSectionLabel">RECOMMENDED FOR</p><h2>この動画はこんな人に向いています</h2></div>
          <ul>
            <li>ペンチャンを見つけるとすぐ外してしまう人</li>
            <li>孤立した3〜7をどこまで残すか迷う人</li>
            <li>テンパイ速度と最終待ちを一緒に比較したい人</li>
            <li>タンヤオ変化を手組みに取り入れたい人</li>
          </ul>
        </section>

        <section className="videoArticleBodySection terminalChoiceBaseline">
          <p className="videoArticleSectionLabel">SHAPE BASICS</p>
          <h2>最初に2つの形の役割を分ける</h2>
          <div className="terminalChoiceComparison">
            <div className="isStrong"><span>ペンチャン</span><TileRow tiles={["man1", "man2"]} /><b>三萬1枚で面子が完成</b></div>
            <div><span>孤立した七筒</span><TileRow tiles={["pin7"]} /><b>六筒・八筒で両面の種</b></div>
          </div>
          <div className="strategyKeyMessage"><strong>基本はペンチャンを残します。</strong>ペンチャンは1手で面子になりますが、孤立牌はターツを作ってからさらに1枚必要です。完成までの距離はペンチャンの方が近くなります。</div>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">KEEP PENCHAN</p>
          <h2>ペンチャンを残すとテンパイしやすい</h2>
          <div className="videoArticleTileBlocks">
            <div><span>ペンチャン</span><TileRow tiles={["man1", "man2"]} /></div>
            <div className="isStrong"><span>三萬を引く</span><TileRow tiles={["man1", "man2", "man3"]} /></div>
            <div><span>孤立した七筒</span><TileRow tiles={["pin7"]} /></div>
          </div>
          <p>一二萬は三萬を引くだけで一二三の面子になります。孤立した七筒は、六筒や八筒を引いて両面を作り、さらにもう1枚を引いて面子にする必要があります。特にイーシャンテンでは、この1手の差がテンパイ速度へ大きく影響します。</p>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">KEEP ISOLATED TILE</p>
          <h2>孤立牌3〜7を残すと良形へ育ちやすい</h2>
          <div className="videoArticleTileBlocks">
            <div><span>孤立した七筒</span><TileRow tiles={["pin7"]} /></div>
            <div className="isStrong"><span>六筒を引く</span><TileRow tiles={["pin6", "pin7"]} /></div>
            <div className="isStrong"><span>八筒を引く</span><TileRow tiles={["pin7", "pin8"]} /></div>
            <div><span>対子になる</span><TileRow tiles={["pin7", "pin7"]} /></div>
          </div>
          <p>孤立した3〜7は、左右のどちらへ伸びても両面を作れる牌が多くあります。ペンチャンを2枚とも外せば、手牌に余剰牌を持つ場所も生まれます。そこへ新しい有効牌や安全牌を残せることも、ペンチャン外しの利点です。</p>
          <p className="terminalChoiceCaution"><strong>注意:</strong> 孤立牌を残せば必ず両面になるわけではありません。内側や外側の牌を引いて、カンチャンができる場合もあります。</p>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">ONE SHANTEN</p>
          <h2>イーシャンテンは完成後の価値で決める</h2>
          <div className="terminalChoiceComparison">
            <div className="isStrong"><span>基本</span><TileRow tiles={["man1", "man2"]} /><b>孤立牌を切ってペンチャンを残す</b></div>
            <div className="isWeak"><span>愚形リーのみ</span><TileRow tiles={["man2", "man4"]} /><b>価値の低い待ちが残るなら作り替える</b></div>
          </div>
          <p>基本は孤立牌を切ってイーシャンテンを維持します。ただしペンチャンが入っても、最後に別のカンチャンやペンチャンが残り、リーチのみの愚形テンパイになるなら、そのテンパイ自体の価値は高くありません。序盤ならシャンテン数を戻して、孤立牌の良形変化を見る選択が有力です。</p>
          <div className="strategyActionBox"><b>判断の中心</b><p>「ペンチャンが埋まるか」ではなく、「埋まった後にどんな待ちで、何点の手をテンパイするか」を確認します。</p></div>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">HAND VALUE</p>
          <h2>ドラがあればペンチャン、タンヤオなら孤立牌</h2>
          <div className="videoArticleTileBlocks">
            <div className="isStrong"><span>ドラを持つ手</span><TileRow tiles={["sou5", "sou5"]} /></div>
            <div><span>外したいペンチャン</span><TileRow tiles={["man1", "man2"]} /></div>
            <div className="isStrong"><span>タンヤオの種</span><TileRow tiles={["pin6", "pin7", "pin8"]} /></div>
          </div>
          <p>ドラを持っている手は、愚形でも先にテンパイする価値が上がるため、孤立牌を切ってペンチャンを残しやすくなります。反対に、一九牌を含むペンチャンを外せばタンヤオへ移行できるなら、孤立牌3〜7を残す価値が大きく上がります。</p>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">TWO SHANTEN</p>
          <h2>リャンシャンテンは基本的に孤立牌から切る</h2>
          <div className="videoArticleTileBlocks">
            <div className="isStrong"><span>1手で面子</span><TileRow tiles={["sou8", "sou9"]} /></div>
            <div><span>孤立した三萬</span><TileRow tiles={["man3"]} /></div>
            <div><span>孤立した七筒</span><TileRow tiles={["pin7"]} /></div>
          </div>
          <p>テンパイまでまだ遠いときも、ペンチャンは1手で面子になる利点があります。途中でほかの形が良くなれば、その時点で自然にペンチャンを外せます。そのためリャンシャンテンでは、まず孤立牌を整理する考え方を基本にできます。</p>
          <p>例外はタンヤオへ移行できる手です。一九牌を含むペンチャンを外すことで役と良形変化を同時に狙えるなら、リャンシャンテンでもペンチャン外しが有力になります。</p>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">ROUND</p>
          <h2>巡目が進むほどペンチャンを残す</h2>
          <div className="videoPrincipleList">
            <section className="videoPrinciple">
              <div className="videoPrincipleNumber">1</div>
              <div className="videoPrincipleBody"><h3>序盤は作り替える時間がある</h3><p>5巡目前後なら、愚形リーのみを避けるためにペンチャンを外し、良形変化を待つ余裕があります。</p></div>
            </section>
            <section className="videoPrinciple">
              <div className="videoPrincipleNumber">2</div>
              <div className="videoPrincipleBody"><h3>中盤はテンパイ自体の価値が上がる</h3><p>8巡目以降は流局や他家の先制が近づきます。形が悪くても、1手で面子になるペンチャンを残しやすくなります。</p></div>
            </section>
            <section className="videoPrinciple">
              <div className="videoPrincipleNumber">3</div>
              <div className="videoPrincipleBody"><h3>場に見えている枚数も確認する</h3><p>必要な牌がすでに多く見えているペンチャンは価値が下がります。基本判断の後に、残り枚数で調整します。</p></div>
            </section>
          </div>
        </section>

        <section className="videoArticleCaution terminalChoiceChecklist">
          <p className="videoArticleSectionLabel">CHECK ORDER</p>
          <h2>ペンチャンと孤立牌で迷ったときの確認順</h2>
          <ol>
            <li><b>シャンテン数を確認する</b><span>イーシャンテンかリャンシャンテンかで、テンパイ速度の重みが変わります。</span></li>
            <li><b>ペンチャンが入った後を見る</b><span>良形テンパイか、リーチのみの愚形テンパイかを確認します。</span></li>
            <li><b>タンヤオへ移行できるかを見る</b><span>ペンチャン外しで役が生まれるなら、孤立牌3〜7の価値が上がります。</span></li>
            <li><b>ドラと打点を見る</b><span>打点が十分なら、待ちが悪くてもテンパイ速度を優先できます。</span></li>
            <li><b>巡目と残り枚数を見る</b><span>巡目が深いほど速度を優先し、見えている牌が多い形は評価を下げます。</span></li>
          </ol>
        </section>

        <section className="videoArticleNext">
          <p className="videoArticleSectionLabel">NEXT STEP</p>
          <h2>ターツと孤立牌の価値を比べる</h2>
          <div>
            <Link href="/analysis/mahjong-tool">牌理チェッカーで受け入れを比較する</Link>
            <Link href="/videos/strategy/isolated-terminal-tile-order">孤立牌1・9の優先順位を読む</Link>
            <Link href="/videos/strategy/how-to-handle-four-consecutive-shape">4連形をどこまで残すか読む</Link>
            <Link href="/videos/strategy/advanced">中級者以上向け動画を見る</Link>
          </div>
        </section>
      </article>
    </main>
  );
}
