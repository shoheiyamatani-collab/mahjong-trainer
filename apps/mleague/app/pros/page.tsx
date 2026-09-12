import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import {
  getSaikouisenMemberGroups,
  saikouisenMembers,
} from "@/lib/saikouisen/members";

export const metadata: Metadata = {
  title: "最高位戦 麻雀プロ名鑑",
  description:
    "最高位戦日本プロ麻雀協会の会員プロフィールを、入会期ごとに確認できる非公式名鑑です。",
};

export default function MahjongProsPage() {
  const groups = getSaikouisenMemberGroups();

  return (
    <main id="main-content" className="page-shell pro-directory-page">
      <header className="page-header directory-page-header">
        <h1 className="page-title">最高位戦 麻雀プロ名鑑</h1>
        <p className="page-lead">
          最高位戦日本プロ麻雀協会の公式プロフィールをもとに、所属リーグや入会期などを紹介します。
        </p>
      </header>

      <section className="pro-directory-summary" aria-label="掲載情報">
        <strong>{saikouisenMembers.length.toLocaleString("ja-JP")}名掲載</strong>
        <span>公式サイトに記載のない項目は「記載なし」と表示します。</span>
      </section>

      <div className="pro-class-list">
        {groups.map((group) => (
          <section className="pro-class-group" key={group.joiningClass}>
            <div className="pro-class-heading">
              <h2>{group.joiningClass}</h2>
              <span>{group.members.length}名</span>
            </div>
            <ul className="pro-member-links">
              {group.members.map((member) => (
                <li key={member.slug}>
                  <Link href={`${siteConfig.routes.mahjongPros}/${member.slug}`}>
                    <strong>{member.name}</strong>
                    <span>{member.league || "所属リーグ記載なし"}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
