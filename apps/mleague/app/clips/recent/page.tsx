import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "最近の切り抜き",
  description: "最近のMリーグ切り抜きを掲載するページです。",
};

export default function RecentClipsPage() {
  return (
    <main id="main-content" className="page-shell clip-list-page">
      <Link className="pro-back-link" href={siteConfig.routes.clips}>
        ← 切り抜き一覧へ戻る
      </Link>
      <header className="page-header directory-page-header">
        <h1 className="page-title">最近の切り抜き</h1>
        <p className="page-lead">直近の対局や話題の場面を、ここに追加していきます。</p>
      </header>
      <section className="clip-empty-state" aria-label="掲載準備中">
        <strong>COMING SOON…</strong>
        <p>切り抜き動画を準備しています。</p>
      </section>
    </main>
  );
}
