import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { memorableClips, yakumanClips } from "./highlight-clips";

export const metadata: Metadata = {
  title: "過去の名場面切り抜き",
  description: "Mリーグの役満集と、それ以外の名場面集を選べるページです。",
};

const highlightCategories = [
  {
    label: "YAKUMAN MOMENTS",
    title: "役満集",
    description: `国士無双・四暗刻・大三元など、役満の名場面を${yakumanClips.length}本掲載しています。`,
    href: siteConfig.routes.yakumanClips,
  },
  {
    label: "CLASSIC MOMENTS",
    title: "名場面集",
    description: `劇的な逆転やビタ止めなど、役満以外の名場面を${memorableClips.length}本掲載しています。`,
    href: siteConfig.routes.memorableClips,
  },
] as const;

export default function HighlightClipsPage() {
  return (
    <main id="main-content" className="page-shell clips-page">
      <Link className="pro-back-link" href={siteConfig.routes.clips}>
        ← 切り抜き一覧へ戻る
      </Link>
      <header className="page-header directory-page-header">
        <h1 className="page-title">過去の名場面切り抜き</h1>
        <p className="page-lead">見たい名場面の種類を選んでください。</p>
      </header>

      <nav className="clip-category-grid" aria-label="過去の名場面カテゴリー">
        {highlightCategories.map((category) => (
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
