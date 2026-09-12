import Link from "next/link";
import { siteConfig } from "@/config/site";

export function SiteFooter() {
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
          <Link href={siteConfig.routes.policy}>掲載方針</Link>
          <Link href={siteConfig.routes.correctionRequest}>訂正・削除依頼</Link>
          <Link href={`${siteConfig.routes.policy}#privacy`}>プライバシーポリシー</Link>
          <Link href={`${siteConfig.routes.policy}#contact`}>お問い合わせ</Link>
          <Link href={`${siteConfig.routes.policy}#operator`}>運営者情報</Link>
        </nav>
        <p className="copyright">© {new Date().getFullYear()} {siteConfig.name}</p>
      </div>
    </footer>
  );
}
