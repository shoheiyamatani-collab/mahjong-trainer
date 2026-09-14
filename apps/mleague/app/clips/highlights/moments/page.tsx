import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { ClipVideoGrid } from "../ClipVideoGrid";
import { memorableClips } from "../highlight-clips";

export const metadata: Metadata = {
  title: "名場面集",
  description: "Mリーグの劇的な逆転や印象的な対局の切り抜きを掲載するページです。",
};

export default function MemorableClipsPage() {
  return (
    <main id="main-content" className="page-shell clip-list-page">
      <Link className="pro-back-link" href={siteConfig.routes.highlightClips}>
        ← 名場面カテゴリーへ戻る
      </Link>
      <header className="page-header directory-page-header">
        <h1 className="page-title">名場面集</h1>
        <p className="page-lead">
          劇的な逆転やビタ止めなど、役満以外の名場面を{memorableClips.length}本まとめました。
        </p>
      </header>

      <ClipVideoGrid
        clips={memorableClips}
        ariaLabel="役満以外の名場面動画一覧"
        numberLabel="MOMENT"
      />
    </main>
  );
}
