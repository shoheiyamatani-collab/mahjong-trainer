import { AffiliateDisclosure } from "./DisclosureNotices";

type BookRecommendationCopy = {
  heading?: string;
  description?: string;
};

const tileEfficiencyRakutenAffiliateUrl =
  "https://hb.afl.rakuten.co.jp/ichiba/572bea14.af03c695.572bea15.8642e51d/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fbook%2F17420901%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIxMjh4MTI4IiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D";

const tileEfficiencyRakutenAffiliateImageUrl =
  "https://hbb.afl.rakuten.co.jp/hgb/572bea14.af03c695.572bea15.8642e51d/?me_id=1213310&item_id=20885571&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%400_mall%2Fbook%2Fcabinet%2F2485%2F9784839982485.jpg%3F_ex%3D128x128&s=128x128&t=picttext";

export function HirasawaTileEfficiencyBook({
  heading = "動画の内容を、本で体系的に復習する",
  description = "受け入れ、孤立牌、5ブロック、強いイーシャンテンまでを、何切る問題と一緒にじっくり確認できます。動画で分かった基準を、自分の手牌で使える知識にしたい人に向く一冊です。"
}: BookRecommendationCopy) {
  return (
    <section className="videoArticleBook" aria-labelledby="hirasawa-tile-efficiency-book-title">
      <div className="videoArticleBookMain">
        <a
          className="videoArticleBookCover"
          href={tileEfficiencyRakutenAffiliateUrl}
          target="_blank"
          rel="nofollow sponsored noopener"
          aria-label="麻雀・一番やさしい牌効率の教科書を楽天で見る"
        >
          <img src={tileEfficiencyRakutenAffiliateImageUrl} alt="麻雀・一番やさしい牌効率の教科書" />
        </a>
        <div className="videoArticleBookContent">
          <p className="videoArticleSectionLabel">BOOK RECOMMENDATION</p>
          <h2 id="hirasawa-tile-efficiency-book-title">{heading}</h2>
          <p className="videoArticleBookTitle">麻雀・一番やさしい牌効率の教科書 <span>平澤元気 著</span></p>
          <p>{description}</p>
          <a className="videoArticleBookLink" href={tileEfficiencyRakutenAffiliateUrl} target="_blank" rel="nofollow sponsored noopener">
            楽天で見る
          </a>
        </div>
      </div>
      <AffiliateDisclosure className="videoArticleBookDisclosure" />
    </section>
  );
}

const defenseRakutenAffiliateUrl =
  "https://hb.afl.rakuten.co.jp/ichiba/572f1abd.13e761fc.572f1abe.dc2690f8/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Frakutenkobo-ebooks%2F4813d237595c34ae91bf6f3e9b0064b7%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIxMjh4MTI4IiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D";

const defenseRakutenAffiliateImageUrl =
  "https://hbb.afl.rakuten.co.jp/hgb/572f1abd.13e761fc.572f1abe.dc2690f8/?me_id=1278256&item_id=21638847&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%400_mall%2Frakutenkobo-ebooks%2Fcabinet%2F7949%2F2000012037949.jpg%3F_ex%3D128x128&s=128x128&t=picttext";

export function HirasawaDefenseBook() {
  return (
    <section className="videoArticleBook" aria-labelledby="hirasawa-defense-book-title">
      <div className="videoArticleBookMain">
        <a
          className="videoArticleBookCover"
          href={defenseRakutenAffiliateUrl}
          target="_blank"
          rel="nofollow sponsored noopener"
          aria-label="麻雀・守備の基本完全ガイドを楽天で見る"
        >
          <img src={defenseRakutenAffiliateImageUrl} alt="麻雀・守備の基本完全ガイド" />
        </a>
        <div className="videoArticleBookContent">
          <p className="videoArticleSectionLabel">BOOK RECOMMENDATION</p>
          <h2 id="hirasawa-defense-book-title">降りる判断を、本で整理する</h2>
          <p className="videoArticleBookTitle">麻雀・守備の基本完全ガイド <span>平澤元気 著</span></p>
          <p>現物がない場面での比較から、スジ・カベ、安全牌の選び方、押し引きの基本までを順序立てて確認できます。動画の判断基準を、実戦で迷わず使える形にしたい人に向く一冊です。</p>
          <a className="videoArticleBookLink" href={defenseRakutenAffiliateUrl} target="_blank" rel="nofollow sponsored noopener">
            楽天で見る
          </a>
        </div>
      </div>
      <AffiliateDisclosure className="videoArticleBookDisclosure" />
    </section>
  );
}

const clearRainBasicTheoryRakutenAffiliateUrl =
  "https://hb.afl.rakuten.co.jp/ichiba/572bea14.af03c695.572bea15.8642e51d/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fbook%2F17950973%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIxMjh4MTI4IiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D";

const clearRainBasicTheoryRakutenAffiliateImageUrl =
  "https://hbb.afl.rakuten.co.jp/hgb/572bea14.af03c695.572bea15.8642e51d/?me_id=1213310&item_id=21338431&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%400_mall%2Fbook%2Fcabinet%2F2456%2F9784537222456_1_33.jpg%3F_ex%3D128x128&s=128x128&t=picttext";

export function ClearRainBasicTheoryBook({
  heading = "動画で学んだ判断を、一冊でつなげる",
  description = "手作りの速度と打点、押し引き、リーチ、鳴きの判断までを、初級者が実戦で使いやすい順番で整理できます。動画の4つの基準を、次の対局で使える自分の基準にしたい人に向く一冊です。"
}: BookRecommendationCopy) {
  return (
    <section className="videoArticleBook" aria-labelledby="clear-rain-basic-theory-book-title">
      <div className="videoArticleBookMain">
        <a
          className="videoArticleBookCover"
          href={clearRainBasicTheoryRakutenAffiliateUrl}
          target="_blank"
          rel="nofollow sponsored noopener"
          aria-label="初心者でも上級者に勝てる 麻雀の基本セオリーを楽天で見る"
        >
          <img src={clearRainBasicTheoryRakutenAffiliateImageUrl} alt="初心者でも上級者に勝てる 麻雀の基本セオリー" />
        </a>
        <div className="videoArticleBookContent">
          <p className="videoArticleSectionLabel">BOOK RECOMMENDATION</p>
          <h2 id="clear-rain-basic-theory-book-title">{heading}</h2>
          <p className="videoArticleBookTitle">初心者でも上級者に勝てる 麻雀の基本セオリー <span>クリアレイン 著</span></p>
          <p>{description}</p>
          <a className="videoArticleBookLink" href={clearRainBasicTheoryRakutenAffiliateUrl} target="_blank" rel="nofollow sponsored noopener">
            楽天で見る
          </a>
        </div>
      </div>
      <AffiliateDisclosure className="videoArticleBookDisclosure" />
    </section>
  );
}

const clearRainNanikiruRakutenAffiliateUrl =
  "https://hb.afl.rakuten.co.jp/ichiba/572bea14.af03c695.572bea15.8642e51d/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fbook%2F17889289%2F&link_type=picttext&ut=eyJwYWdlIjoiaXRlbSIsInR5cGUiOiJwaWN0dGV4dCIsInNpemUiOiIxMjh4MTI4IiwibmFtIjoxLCJuYW1wIjoicmlnaHQiLCJjb20iOjEsImNvbXAiOiJkb3duIiwicHJpY2UiOjEsImJvciI6MSwiY29sIjoxLCJiYnRuIjoxLCJwcm9kIjowLCJhbXAiOmZhbHNlfQ%3D%3D";

const clearRainNanikiruRakutenAffiliateImageUrl =
  "https://hbb.afl.rakuten.co.jp/hgb/572bea14.af03c695.572bea15.8642e51d/?me_id=1213310&item_id=21281276&pc=https%3A%2F%2Fthumbnail.image.rakuten.co.jp%2F%400_mall%2Fbook%2Fcabinet%2F2319%2F9784537222319_1_4.jpg%3F_ex%3D128x128&s=128x128&t=picttext";

export function ClearRainNanikiruBook() {
  return (
    <section className="videoArticleBook" aria-labelledby="clear-rain-nanikiru-book-title">
      <div className="videoArticleBookMain">
        <a className="videoArticleBookCover" href={clearRainNanikiruRakutenAffiliateUrl} target="_blank" rel="nofollow sponsored noopener" aria-label="麻雀 勝者になれる「何切る」の教科書を楽天で見る">
          <img src={clearRainNanikiruRakutenAffiliateImageUrl} alt="麻雀 勝者になれる「何切る」の教科書" />
        </a>
        <div className="videoArticleBookContent">
          <p className="videoArticleSectionLabel">BOOK RECOMMENDATION</p>
          <h2 id="clear-rain-nanikiru-book-title">何切るの考え方を、問題で身につける</h2>
          <p className="videoArticleBookTitle">麻雀 勝者になれる「何切る」の教科書 <span>クリアレイン 著</span></p>
          <p>牌効率の基本を、厳選された何切る問題と丁寧な解説で確認できます。動画で分かった「残す形」と「切る理由」を、自分で説明できる判断へ変えたい人に向く一冊です。</p>
          <a className="videoArticleBookLink" href={clearRainNanikiruRakutenAffiliateUrl} target="_blank" rel="nofollow sponsored noopener">楽天で見る</a>
        </div>
      </div>
      <AffiliateDisclosure className="videoArticleBookDisclosure" />
    </section>
  );
}
