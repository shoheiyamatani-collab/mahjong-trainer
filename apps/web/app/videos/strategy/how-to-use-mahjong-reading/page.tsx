import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "麻雀の読み方｜捨て牌の違和感と例外から危険度を比べる",
  description: "麻雀中級者向けに、捨て牌読みを待ちの断定ではなく危険度比較へ使う方法を解説。確定情報、手掛かり、推測の違いを牌図で整理します。"
};

const videoUrl = "https://www.youtube.com/watch?v=7alr7PlSN2M";

const tileNames: Record<string, string> = {
  man1: "一萬", man2: "二萬", man3: "三萬", man4: "四萬", man5: "五萬", man6: "六萬", man7: "七萬",
  pin2: "二筒", pin5: "五筒", pin6: "六筒", pin7: "七筒",
  ji1: "東", ji7: "中"
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

export default function HowToUseMahjongReadingPage() {
  return (
    <main className="siteMain videoArticlePage">
      <article>
        <header className="videoArticleHeader">
          <nav aria-label="パンくずリスト">
            <Link href="/">トップ</Link><span>›</span>
            <Link href="/videos/strategy">麻雀を動画で学ぶ</Link><span>›</span>
            <Link href="/videos/strategy/advanced">中級者以上向け</Link><span>›</span>
            <span>麻雀の読み方</span>
          </nav>
          <p className="siteEyebrow">INTERMEDIATE VIDEO GUIDE / 読み・情報整理</p>
          <h1>麻雀の読みは「違和感」と「例外」で考える</h1>
          <p className="videoArticleLead">読みは相手の待ちを一発で当てる技術ではありません。見えている情報から普通の手順を想像し、実際の打牌との違いを見つけ、危険度を少しずつ比較するための技術です。</p>
          <div className="videoArticleByline"><span>紹介動画: 発男道場【麻雀解説ch】</span><time>動画公開日 2026年4月4日</time><span>約11分で読める</span></div>
        </header>

        <div className="videoArticleEmbed">
          <iframe
            src="https://www.youtube-nocookie.com/embed/7alr7PlSN2M"
            title="【麻雀解説】誰でも習得可能？読みを使う時のめちゃくちゃ重要な話をします"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
        <p className="videoSourceNote">動画提供: <a href={videoUrl} target="_blank" rel="noopener noreferrer">発男道場【麻雀解説ch】の元動画をYouTubeで見る</a></p>

        <section className="videoArticleAudience">
          <div><p className="videoArticleSectionLabel">RECOMMENDED FOR</p><h2>この動画はこんな人に向いています</h2></div>
          <ul>
            <li>相手の捨て牌を見ても何を考えればよいか分からない人</li>
            <li>スジを安全牌だと思い込んでしまう人</li>
            <li>読みの例外が多く、使うのを諦めている人</li>
            <li>放銃後の手牌確認を上達につなげたい人</li>
          </ul>
        </section>

        <section className="videoArticleBodySection terminalChoiceBaseline">
          <p className="videoArticleSectionLabel">INFORMATION LEVELS</p>
          <h2>最初に、情報の強さを3段階に分ける</h2>
          <div className="terminalChoiceComparison">
            <div className="isStrong"><span>確定情報</span><TileRow tiles={["man4"]} /><b>その相手の現物</b></div>
            <div><span>強い手掛かり</span><TileRow tiles={["man4", "man2"]} /><b>捨て牌の順番や鳴き</b></div>
            <div><span>弱い推測</span><TileRow tiles={["man1", "man7"]} /><b>スジなどからの比較</b></div>
          </div>
          <div className="strategyKeyMessage"><strong>読みは「安全・危険」を断定するものではありません。</strong>確定情報以外は、複数の候補から比較的通りやすい牌を選ぶために使います。</div>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">STEP 1</p>
          <h2>まず「普通ならどう切るか」を想像する</h2>
          <p>読みの出発点は、相手も基本的な牌効率で手を進めていると仮定することです。孤立牌、弱いターツ、不要になった牌がどの順番で出やすいかを考えます。</p>
          <div className="videoArticleTileBlocks">
            <div><span>一般的に残りやすい複合形</span><TileRow tiles={["man2", "man3", "man4", "man4", "man5"]} /></div>
            <div className="isWeak"><span>役割を失うと出やすい牌</span><TileRow tiles={["ji1"]} /></div>
          </div>
          <div className="strategyActionBox"><b>大切なのは基準を持つこと</b><p>普通の手順を知らなければ、実際の捨て牌が普通なのか、違和感のある手順なのかを比べられません。</p></div>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">STEP 2</p>
          <h2>捨て牌の順番から「なぜ残っていたか」を考える</h2>
          <p>近い数字の牌が時間差で出たときは、後から切られた牌がそれまで何らかの役割を持っていた可能性があります。ただし、ツモによって形が変わっただけの場合もあります。</p>
          <div className="videoArticleTileBlocks">
            <div><span>先に切られた牌</span><TileRow tiles={["man4"]} /></div>
            <div><span>数巡後のリーチ宣言牌</span><TileRow tiles={["man2"]} /></div>
            <div className="isStrong"><span>周辺に複合形があった可能性</span><TileRow tiles={["man1", "man2", "man2", "man3", "man4", "man5"]} /></div>
          </div>
          <div className="strategyActionBox"><b>ここで止めない</b><p>「この待ちはない」と消去する前に、後から3萬を引いた、複合形を整理した、役を残したなどの例外も考えます。</p></div>
          <p className="terminalChoiceCaution"><strong>注意:</strong> 上の牌姿は読み方を示す代表例です。捨て牌の順番だけで相手の手牌や待ちを断定することはできません。</p>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">STEP 3</p>
          <h2>鳴きには、手役と打点の理由が表れやすい</h2>
          <p>鳴いた相手は門前役を使えないため、役牌、染め手、ドラなどの狙いが手牌に残っていることがあります。どの牌を鳴き、何を直後に切ったかをセットで見ます。</p>
          <div className="videoArticleTileBlocks">
            <div className="isStrong"><span>ドラをポンした相手</span><TileRow tiles={["ji7", "ji7", "ji7"]} /></div>
            <div><span>残っているかもしれない複合形</span><TileRow tiles={["pin5", "pin5", "pin6", "pin6", "pin6", "pin7"]} /></div>
            <div className="isWeak"><span>周辺牌は慎重に比較</span><TileRow tiles={["pin7"]} /></div>
          </div>
          <div className="strategyActionBox"><b>確率と打点を一緒に見る</b><p>放銃する確率が低そうでも、高打点が見える相手には損失が大きくなります。通りやすさだけでなく、当たったときの打点も押し引きへ加えます。</p></div>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">EXCEPTIONS</p>
          <h2>読みが外れる代表的な例外を忘れない</h2>
          <div className="videoPrincipleList">
            <section className="videoPrinciple">
              <div className="videoPrincipleNumber">1</div>
              <div className="videoPrincipleBody"><h3>赤牌・ドラ・手役を残した</h3><p>牌効率だけなら先に切る牌でも、打点を作るために手元へ残すことがあります。</p></div>
            </section>
            <section className="videoPrinciple">
              <div className="videoPrincipleNumber">2</div>
              <div className="videoPrincipleBody"><h3>複合形から別の待ちが生まれた</h3><p>単純な両面だけでなく、対子や暗刻が絡むと、捨て牌から想像しにくい待ちが残ります。</p></div>
            </section>
            <section className="videoPrinciple">
              <div className="videoPrincipleNumber">3</div>
              <div className="videoPrincipleBody"><h3>ツモで途中の役割が変わった</h3><p>序盤に不要だった牌と、リーチ直前に不要になった牌は、同じ理由で切られたとは限りません。</p></div>
            </section>
          </div>
        </section>

        <section className="videoArticleCaution terminalChoiceChecklist">
          <p className="videoArticleSectionLabel">READING ORDER</p>
          <h2>実戦で読みを使う順番</h2>
          <ol>
            <li><b>現物などの確定情報を先に確認する</b><span>推測より先に、見落としてはいけない安全牌を探します。</span></li>
            <li><b>普通の手順と実際の手順を比べる</b><span>なぜその牌が後まで残ったのか、違和感を1つ探します。</span></li>
            <li><b>例外を最低1つ考える</b><span>複合形、手役、ドラ、ツモによる変化を候補に戻します。</span></li>
            <li><b>危険度と放銃時の打点を比較する</b><span>待ちを断定せず、押す牌と降りる牌を選ぶ材料にします。</span></li>
          </ol>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">PRACTICE</p>
          <h2>読みは対局後の答え合わせで育てる</h2>
          <p>アガリや流局で相手の手牌が見えたら、すぐ次局へ進まず、自分が想像した手順と実際の形を比べます。「なぜこの牌を残したのか」を1つ確認するだけでも、次に気づける違和感が増えていきます。</p>
          <div className="strategyKeyMessage"><strong>外れた読みは失敗ではなく教材です。</strong>自分が見落とした例外を覚え、次回の危険度比較に加えましょう。</div>
        </section>

        <section className="videoArticleNext">
          <p className="videoArticleSectionLabel">NEXT STEP</p>
          <h2>待ちの形と守備の基本をつなげる</h2>
          <div>
            <Link href="/rules/practical-waits">実戦でよく見る待ち一覧を確認する</Link>
            <Link href="/videos/strategy/reach-declaration-tile-reading">リーチ宣言牌の読みを復習する</Link>
            <Link href="/videos/strategy/suji-kabe-defense-basics">スジとカベの基本を読む</Link>
            <Link href="/videos/strategy/advanced">中級者以上向け動画を見る</Link>
          </div>
        </section>
      </article>
    </main>
  );
}
