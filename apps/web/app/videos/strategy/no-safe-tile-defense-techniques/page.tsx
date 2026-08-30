import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "現物がないときのベタオリ | 麻雀初心者の放銃を減らす方法",
  description: "相手のリーチに現物がないとき、対子・暗刻を使って切る危険牌の種類を抑える方法と、序盤に切られた牌の外側を比較する守備の考え方を牌図で解説します。"
};

const videoUrl = "https://www.youtube.com/watch?v=nzHCKuMuUJE";

const tileNames: Record<string, string> = {
  man1: "一萬", man2: "二萬", man3: "三萬", man4: "四萬", man5: "五萬", man6: "六萬", man7: "七萬", man8: "八萬", man9: "九萬",
  pin1: "一筒", pin2: "二筒", pin3: "三筒", pin4: "四筒", pin5: "五筒", pin6: "六筒", pin7: "七筒", pin8: "八筒", pin9: "九筒",
  sou1: "一索", sou2: "二索", sou3: "三索", sou4: "四索", sou5: "五索", sou6: "六索", sou7: "七索", sou8: "八索", sou9: "九索",
  ji1: "東", ji2: "南", ji3: "西", ji4: "北", ji5: "白", ji6: "發", ji7: "中"
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

export default function NoSafeTileDefenseTechniquesPage() {
  return (
    <main className="siteMain videoArticlePage">
      <article>
        <header className="videoArticleHeader">
          <nav aria-label="パンくずリスト"><Link href="/">トップ</Link><span>›</span><Link href="/videos/strategy">麻雀を動画で学ぶ</Link><span>›</span><span>現物がないときのベタオリ</span></nav>
          <p className="siteEyebrow">VIDEO GUIDE / 守備・手詰まり</p>
          <h1>現物がなくても押さない。放銃を減らすベタオリの考え方</h1>
          <p className="videoArticleLead">リーチを受けたのに現物が1枚もないと、「もう押すしかない」と考えがちです。しかし、完全に安全な牌がなくても危険度を比べ、数巡しのぐ打ち方はあります。</p>
          <div className="videoArticleByline"><span>紹介動画: 平澤元気麻雀ch</span><time>動画公開日 2019年7月18日</time><span>約10分で読める</span></div>
        </header>

        <div className="videoArticleEmbed">
          <iframe
            src="https://www.youtube-nocookie.com/embed/nzHCKuMuUJE"
            title="99％の初心者が知らない麻雀で振り込みを減らすテクニック"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
        <p className="videoSourceNote">動画提供: <a href={videoUrl} target="_blank" rel="noopener noreferrer">平澤元気麻雀chの元動画をYouTubeで見る</a></p>

        <section className="videoArticleAudience">
          <div><p className="videoArticleSectionLabel">RECOMMENDED FOR</p><h2>この動画はこんな人に向いています</h2></div>
          <ul>
            <li>現物がないと、降りるのを諦めて押してしまう人</li>
            <li>ベタオリ中に毎巡違う危険牌を切ってしまう人</li>
            <li>対子や暗刻を守備に使う考え方を知りたい人</li>
            <li>序盤の捨て牌から比較的ましな候補を探したい人</li>
          </ul>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">BEFORE CHOOSING</p>
          <h2>最初に「押すか、降りるか」を決める</h2>
          <p>現物がないことは、押してよい理由にはなりません。自分の手が遠くて価値も低いなら、まず降りる方針を決めます。その後で、手牌の中から比較的放銃しにくい順番を探します。</p>
          <div className="strategyKeyMessage"><strong>初心者の目安:</strong> リーチを受けた時点で二向聴以下なら、まずベタオリを検討します。テンパイや高打点の一向聴では、点数状況も含めて押し引きを考えます。</div>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">TECHNIQUE 1</p>
          <h2>異なる危険牌を何種類も切らない</h2>
          <p>安全度が同程度なら、毎巡違う牌を切るより、同じ牌の対子や暗刻を落とす方が危険判定の回数を抑えられます。最初の1枚が通れば、同じ相手に対して残りは現物になります。</p>
          <div className="videoArticleTileBlocks">
            <div className="isWeak"><span>毎巡違う牌を切る</span><TileRow tiles={["man5", "pin6", "sou4"]} /></div>
            <div className="isStrong"><span>同じ牌を続けて切る</span><TileRow tiles={["pin9", "pin9", "pin9"]} /></div>
          </div>
          <div className="strategyActionBox"><b>重要な考え方</b><p>「1枚ごとの危険度」だけでなく、ベタオリ完了までに何種類の危険牌を通す必要があるかを見ます。</p></div>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">PAIR AND TRIPLET</p>
          <h2>対子・暗刻は数巡しのぐ候補になる</h2>
          <p>同じ牌を2枚または3枚持っていると、その1種類を通すだけで複数巡をしのげます。特に端牌の対子・暗刻と、中央の無スジを複数種類切る選択では、前者が候補になりやすくなります。</p>
          <div className="videoArticleTileBlocks">
            <div className="isStrong"><span>対子落としで2巡</span><TileRow tiles={["sou1", "sou1"]} /></div>
            <div className="isStrong"><span>暗刻落としで3巡</span><TileRow tiles={["man9", "man9", "man9"]} /></div>
          </div>
          <p><strong>ただし、最初の1枚は安全とは限りません。</strong>対子・暗刻だから無条件で切るのではなく、スジ、カベ、場に見えている枚数、数字の位置を比較して候補を選びます。</p>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">TECHNIQUE 2</p>
          <h2>序盤に切られた牌の外側を比較する</h2>
          <p>相手がごく序盤に2萬を切っている場合、その外側の1萬は、中央の無スジより比較的ましな候補になることがあります。早い巡目ほど、外側の牌が手牌でつながっていなかった可能性を考えられるためです。</p>
          <div className="videoArticleTileBlocks">
            <div><span>相手が序盤に切った牌</span><TileRow tiles={["man2"]} /></div>
            <div className="isStrong"><span>外側として比べる候補</span><TileRow tiles={["man1"]} /></div>
            <div className="isWeak"><span>中央の無スジ</span><TileRow tiles={["pin4", "sou5"]} /></div>
          </div>
          <div className="strategyActionBox"><b>見る順番</b><p>何巡目に切られたか、ツモ切りか手出しか、相手が早めにターツを固定する打ち手かを確認します。</p></div>
        </section>

        <section className="videoArticleCaution">
          <p className="videoArticleSectionLabel">CAUTION</p>
          <h2>「序盤の外側」は安全牌ではない</h2>
          <p>223から2を先に切って23を固定する打ち方もあるため、序盤の2が捨てられていても1が当たるケースはあります。現物や明確なスジ・カベがあるなら、そちらを優先します。</p>
          <p>また、同じ牌が一人のリーチ者に通っても、別の相手には安全とは限りません。複数人から攻められているときは、それぞれの捨て牌を確認します。</p>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">CHECK ORDER</p>
          <h2>現物がないときの確認順</h2>
          <ol>
            <li><strong>本当に降りる局面かを決める</strong></li>
            <li><strong>スジ・カベ・場に4枚見えている牌を探す</strong></li>
            <li><strong>同じ牌の対子・暗刻で数巡しのげないか見る</strong></li>
            <li><strong>序盤の外側などを最後の比較材料にする</strong></li>
          </ol>
        </section>

        <section className="videoArticleNext">
          <p className="videoArticleSectionLabel">NEXT STEP</p>
          <h2>守備の基本と組み合わせる</h2>
          <div>
            <Link href="/videos/strategy/suji-kabe-defense-basics">スジとカベの基本を復習する</Link>
            <Link href="/videos/strategy/betaori-three-principles">ベタオリの重要な考え方3選を見る</Link>
            <Link href="/rules/practical-waits">待ちの形から危険度を考える</Link>
            <Link href="/trainer">実戦問題で判断を練習する</Link>
          </div>
        </section>
      </article>
    </main>
  );
}
