import type { Metadata } from "next";
import { getRobotsPolicy } from "@mahjong-trainer/content-index-policy";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { ClipVideoGrid } from "../highlights/ClipVideoGrid";
import { recentClips } from "../recent-clips";
import { ClipLearningGuide } from "../ClipLearningGuide";

export const metadata: Metadata = {
  robots: getRobotsPolicy("/mleague/clips/recent"),
  title: "最近の切り抜き",
  description: "最近のMリーグ切り抜きを掲載するページです。",
  alternates: { canonical: "/mleague/clips/recent/" },
};

export default function RecentClipsPage() {
  return (
    <main id="main-content" className="page-shell clip-list-page">
      <Link className="pro-back-link" href={siteConfig.routes.clips}>
        ← 切り抜き一覧へ戻る
      </Link>
      <header className="page-header directory-page-header">
        <h1 className="page-title">最近の切り抜き</h1>
        <p className="page-lead">
          Mリーグ公式YouTubeから、直近の対局や話題の場面を新しい順に掲載しています。
        </p>
      </header>
      <ClipVideoGrid clips={recentClips} ariaLabel="最近の切り抜き動画一覧" numberLabel="NEW" />
      <p className="match-source-note">
        掲載中の最新動画の公開日：{recentClips[0]?.date ?? "元動画でご確認ください"}。対局日と動画の公開日は異なる場合があります。これは動画の常時再生を保証する確認日ではありません。
      </p>
      <ClipLearningGuide topic="recent" />
    </main>
  );
}
