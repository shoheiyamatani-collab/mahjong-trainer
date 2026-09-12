import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Mリーグ切り抜きを見る",
  description: "最近のMリーグ切り抜きと、過去の名場面切り抜きを選べるページです。",
};

const clipCategories = [
  {
    label: "NEW CLIPS",
    title: "最近の切り抜き",
    description: "直近の対局や話題になった場面の切り抜きをまとめます。",
    href: siteConfig.routes.recentClips,
  },
  {
    label: "CLASSIC MOMENTS",
    title: "過去の名場面切り抜き",
    description: "もう一度見たい名勝負や印象的な場面の切り抜きをまとめます。",
    href: siteConfig.routes.highlightClips,
  },
] as const;

export default function ClipsPage() {
  return (
    <main id="main-content" className="page-shell clips-page">
      <header className="page-header directory-page-header">
        <h1 className="page-title">Mリーグ切り抜きを見る</h1>
        <p className="page-lead">見たい切り抜きの種類を選んでください。</p>
      </header>

      <nav className="clip-category-grid" aria-label="切り抜きカテゴリー">
        {clipCategories.map((category) => (
          <Link className="clip-category-card" href={category.href} key={category.href}>
            <span>{category.label}</span>
            <strong>{category.title}</strong>
            <p>{category.description}</p>
            <b aria-hidden="true">見る →</b>
          </Link>
        ))}
      </nav>
    </main>
  );
}
