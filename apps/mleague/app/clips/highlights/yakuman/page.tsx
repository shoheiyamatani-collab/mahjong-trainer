import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { ClipVideoGrid } from "../ClipVideoGrid";
import { yakumanClips } from "../highlight-clips";

export const metadata: Metadata = {
  title: "役満集",
  description: "Mリーグで生まれた役満の名場面切り抜きを掲載するページです。",
};

export default function YakumanClipsPage() {
  return (
    <main id="main-content" className="page-shell clip-list-page">
      <Link className="pro-back-link" href={siteConfig.routes.highlightClips}>
        ← 名場面カテゴリーへ戻る
      </Link>
      <header className="page-header directory-page-header">
        <h1 className="page-title">役満集</h1>
        <p className="page-lead">
          国士無双・四暗刻・大三元など、記憶に残る役満を{yakumanClips.length}本まとめました。
        </p>
      </header>

      <ClipVideoGrid clips={yakumanClips} ariaLabel="役満動画一覧" numberLabel="YAKUMAN" />
    </main>
  );
}
