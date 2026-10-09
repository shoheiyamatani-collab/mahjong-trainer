import Link from "next/link";
import { siteConfig } from "@/config/site";

export function SiteFooter() {
  const webBase = process.env.NODE_ENV === "development" ? "http://127.0.0.1:3000" : "";
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-notice">
          <strong>非公式情報サイトについて</strong>
          <p>
            当サイトは、Mリーグおよび所属チーム、選手、所属団体とは関係のない非公式情報サイトです。
          </p>
          <p>
            掲載情報は公式発表をもとに確認していますが、内容の完全性や最新性を保証するものではありません。
          </p>
          <p>
            イベントへ参加する際は、必ず主催者や選手本人による最新の公式情報をご確認ください。
          </p>
        </div>
        <nav className="footer-links" aria-label="フッターナビゲーション">
          <a href={`${webBase}/`}>雀フォリオ トップ</a>
          <a href={`${webBase}/videos/strategy`}>麻雀を動画で学ぶ</a>
          <a href={`${webBase}/trainer`}>麻雀トレーニング</a>
          <Link href={siteConfig.routes.policy}>掲載方針</Link>
          <Link href={siteConfig.routes.correctionRequest}>訂正・削除依頼</Link>
          <a href={`${webBase}/privacy`}>プライバシーポリシー</a>
          <a href={`${webBase}/terms`}>利用規約</a>
          <a href={`${webBase}/contact`}>お問い合わせ</a>
          <a href={`${webBase}/about`}>運営者情報</a>
        </nav>
        <p className="copyright">© {new Date().getFullYear()} 雀フォリオ / JONGFOLIO</p>
      </div>
    </footer>
  );
}
