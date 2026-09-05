import type { Metadata } from "next";
import Link from "next/link";
import { HirasawaTileEfficiencyBook } from "../../../components/VideoBookRecommendation";

export const metadata: Metadata = {
  title: "麻雀初心者がやってはいけない何切る3選｜シャンテン数の基本",
  description: "麻雀初心者向けに、唯一の対子、完成面子、孤立牌があるときのターツを切るとシャンテン数が戻る理由を牌姿で解説します。"
};

const videoUrl = "https://www.youtube.com/watch?v=dIuGoO2CGtI";
const tileNames: Record<string, string> = {
  man1: "一萬", man2: "二萬", man3: "三萬", man4: "四萬", man5: "五萬", man6: "六萬", man7: "七萬",
  pin1: "一筒", pin2: "二筒", pin3: "三筒", pin4: "四筒", pin5: "五筒", pin6: "六筒", pin7: "七筒", pin8: "八筒", pin9: "九筒",
  sou3: "三索", sou4: "四索", sou5: "五索", sou6: "六索", ji3: "西", ji4: "北"
};

function TileRow({ tiles }: { tiles: string[] }) {
  return (
    <div className={tiles.length >= 10 ? "videoArticleFullHand" : undefined}>
      {tiles.map((tile, index) => (
        <img key={`${tile}-${index}`} src={`/tiles/${tile}-66-90-l-emb.png`} alt={tileNames[tile]} />
      ))}
    </div>
  );
}

export default function ThreeShantenMistakesBeginnersAvoidPage() {
  return (
    <main className="siteMain videoArticlePage shantenMistakesPage">
      <article>
        <header className="videoArticleHeader">
          <nav aria-label="パンくずリスト"><Link href="/">トップ</Link><span>›</span><Link href="/videos/strategy">麻雀を動画で学ぶ</Link><span>›</span><Link href="/videos/strategy/beginner">初心者向け</Link><span>›</span><span>シャンテン数を戻さない3原則</span></nav>
          <p className="siteEyebrow">BEGINNER VIDEO GUIDE / シャンテン数</p>
          <h1>初心者がやってはいけない3つの何切る</h1>
          <p className="videoArticleLead">高い役や安全牌を意識する前に、まずアガリから遠ざかる一打を避けることが大切です。この動画は、シャンテン数が分からなくても使える3つのチェックポイントを問題形式で解説しています。</p>
          <div className="videoArticleByline"><span>紹介動画: 平澤元気麻雀ch</span><time>動画公開日 2022年11月30日</time><span>約9分で読める</span></div>
        </header>

        <div className="videoArticleEmbed"><iframe src="https://www.youtube-nocookie.com/embed/dIuGoO2CGtI" title="麻雀初心者が避けたい3つの何切る" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /></div>
        <p className="videoSourceNote">動画提供: <a href={videoUrl} target="_blank" rel="noopener noreferrer">元動画をYouTubeで見る</a></p>

        <section className="videoArticleAudience">
          <div><p className="videoArticleSectionLabel">RECOMMENDED FOR</p><h2>この動画はこんな人に向いています</h2></div>
          <ul><li>両面なら何でも残した方がよいと思っている人</li><li>役を狙って完成した面子を壊してしまう人</li><li>安全牌を残すためにターツを切ることが多い人</li><li>自分の手が何シャンテンかまだ数えにくい人</li></ul>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">CORE RULE</p><h2>シャンテン数を戻す打牌を避ける</h2>
          <div className="videoPrincipleList">
            <div className="videoPrinciple"><span className="videoPrincipleNumber">1</span><div className="videoPrincipleBody"><h3>唯一の対子を切らない</h3><p>雀頭の候補がなくなり、もう一度同じ牌を重ねる手間が増えます。</p></div></div>
            <div className="videoPrinciple"><span className="videoPrincipleNumber">2</span><div className="videoPrincipleBody"><h3>完成した面子を切らない</h3><p>4つ必要な面子を自分から減らすため、アガリ形の完成が遅くなります。</p></div></div>
            <div className="videoPrinciple"><span className="videoPrincipleNumber">3</span><div className="videoPrincipleBody"><h3>孤立牌があるのにターツを切らない</h3><p>面子の種を壊す前に、つながりのない1枚を整理するのが基本です。</p></div></div>
          </div>
          <div className="strategyKeyMessage"><strong>シャンテン数とは:</strong> テンパイまで最低あと何回、手を進める必要があるかを表す数字です。数字が小さいほどアガリに近い状態です。</div>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">NG 1 / PAIR</p><h2>唯一の対子は雀頭の予約席</h2>
          <div className="videoArticleTileBlocks">
            <div className="fullHandBlock"><span>唯一の対子がある13枚</span><TileRow tiles={["pin1", "pin2", "pin3", "pin4", "pin5", "pin6", "man6", "man7", "sou4", "sou5", "pin9", "pin9", "ji4"]} /></div>
            <div className="isStrong"><span>雀頭候補</span><TileRow tiles={["pin9", "pin9"]} /></div>
            <div className="isWeak"><span>ここから1枚切ると対子が消える</span><TileRow tiles={["pin9"]} /></div>
          </div>
          <p>アガリには4面子だけでなく、同じ牌2枚の雀頭が必要です。唯一の対子から1枚切ると、残った1枚にもう一度同じ牌を引かなければ雀頭へ戻せません。</p>
          <p>両面は強い形ですが、雀頭をなくしてまで全部残すのは逆効果です。手の中に対子がひとつしかないなら、まず残す癖をつけます。</p>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">NG 2 / COMPLETED MELD</p><h2>役のために完成面子を壊さない</h2>
          <div className="videoArticleTileBlocks">
            <div className="isStrong"><span>すでに完成している二三四萬</span><TileRow tiles={["man2", "man3", "man4"]} /></div>
            <div><span>同じ色が多い部分</span><TileRow tiles={["pin1", "pin2", "pin3", "pin4", "pin5", "pin6", "pin8", "pin8"]} /></div>
            <div className="isWeak"><span>混一色を見て萬子を壊す</span><TileRow tiles={["man2"]} /></div>
          </div>
          <p>一色手が見えても、完成した面子を壊さなければ作れない役は、初心者のうちは無理に追わない方が安定します。役を高くする代わりに、完成済みの1ブロックを作り直すことになるからです。</p>
          <div className="strategyActionBox"><strong>優先順位</strong><p>まず4面子1雀頭を完成させる速度を守り、その形を壊さず狙える役を探します。</p></div>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">NG 3 / ISOLATED TILE</p><h2>孤立牌が残っているならターツを守る</h2>
          <div className="videoArticleTileBlocks">
            <div className="fullHandBlock"><span>孤立した西がある13枚</span><TileRow tiles={["man1", "man2", "man3", "pin4", "pin5", "pin6", "man4", "man6", "pin3", "pin5", "pin7", "sou5", "ji3"]} /></div>
            <div className="isStrong"><span>先に整理する孤立牌</span><TileRow tiles={["ji3"]} /></div>
            <div className="isWeak"><span>残したいカンチャン</span><TileRow tiles={["man4", "man6"]} /></div>
            <div className="isWeak"><span>残したいリャンカン</span><TileRow tiles={["pin3", "pin5", "pin7"]} /></div>
          </div>
          <p>孤立した西や索子が残っているのに、46萬や357筒を先に切ると、面子になりやすい候補を自分から減らします。ドラや赤牌を残したい気持ちがあっても、まず手を進める基本では孤立牌から整理します。</p>
          <p>唯一の対子や完成面子ほど絶対的ではなく、巡目・打点・安全度による例外はあります。それでも、最初に大きなミスを減らす基準として有効です。</p>
        </section>

        <section className="videoArticleCaution terminalChoiceChecklist">
          <p className="videoArticleSectionLabel">QUICK CHECK</p><h2>シャンテン数を数えられないときの確認順</h2>
          <ol><li><b>唯一の対子を探す</b><span>ひとつしかなければ雀頭候補として残します。</span></li><li><b>完成した3枚組を分ける</b><span>順子と刻子は、攻める手では基本的に崩しません。</span></li><li><b>2枚・3枚の面子候補を探す</b><span>孤立牌があるなら、候補を壊す前に孤立牌を整理します。</span></li></ol>
        </section>

        <section className="videoArticleBodySection">
          <p className="videoArticleSectionLabel">ADVANCED NOTE</p><h2>シャンテン戻しは、戻ることを理解して行う応用技術</h2>
          <p>上級者は打点、待ち、安全度を上げるため、あえてシャンテン数を戻す場合があります。ただし、それはアガリまで遅くなるリスクと、得られるリターンを比べた判断です。</p>
          <p>まずは最短で進める打牌を選べるようにすることが先です。基本の選択が分かれば、後から例外を見ても混乱しにくくなります。</p>
        </section>

        <HirasawaTileEfficiencyBook />

        <section className="videoArticleNext">
          <p className="videoArticleSectionLabel">NEXT STEP</p><h2>受け入れの考え方へ進む</h2>
          <div><Link href="/videos/strategy/ukeire-vs-shape-change-basics">受け入れと手変わりの違いを覚える</Link><Link href="/videos/strategy/prioritize-ukeire-over-shape-change">変化より受け入れを優先する理由を見る</Link><Link href="/trainer">何切る問題で確認する</Link></div>
        </section>
      </article>
    </main>
  );
}
