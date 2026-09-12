import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "@/components/ExternalLink";
import { siteConfig } from "@/config/site";
import {
  getMemberTitles,
  getSaikouisenMemberBySlug,
  saikouisenMembers,
} from "@/lib/saikouisen/members";

type MahjongProPageProps = {
  params: Promise<{ slug: string }>;
};

const notListed = "公式プロフィールに記載なし";

export function generateStaticParams() {
  return saikouisenMembers.map((member) => ({ slug: member.slug }));
}

export async function generateMetadata({
  params,
}: MahjongProPageProps): Promise<Metadata> {
  const { slug } = await params;
  const member = getSaikouisenMemberBySlug(slug);
  if (!member) return { title: "麻雀プロが見つかりません" };

  return {
    title: `${member.name}｜最高位戦 麻雀プロ名鑑`,
    description: `${member.name}プロの所属リーグ、入会期、誕生日、出身地、タイトル、公式Xを紹介します。`,
  };
}

export default async function MahjongProPage({ params }: MahjongProPageProps) {
  const { slug } = await params;
  const member = getSaikouisenMemberBySlug(slug);
  if (!member) notFound();

  const titles = getMemberTitles(member);

  return (
    <main id="main-content" className="page-shell pro-profile-page">
      <section className="pro-profile-hero">
        <Link className="pro-back-link" href={siteConfig.routes.mahjongPros}>
          ← 麻雀プロ名鑑へ戻る
        </Link>
        <span className="profile-kicker">SAIKOUISEN MEMBER</span>
        <h1 className="page-title">{member.name}</h1>
        <div className="tag-list">
          <span className="tag">{member.organization}</span>
          <span className="tag">{member.league || "所属リーグ記載なし"}</span>
        </div>
      </section>

      <div className="pro-profile-grid section">
        <div className="pro-profile-main">
          <section className="content-card content-section" aria-labelledby="pro-profile-title">
            <h2 id="pro-profile-title">プロフィール</h2>
            <dl className="definition-list pro-profile-definition-list">
              <div>
                <dt>プロ団体</dt>
                <dd>{member.organization}</dd>
              </div>
              <div>
                <dt>所属リーグ</dt>
                <dd>{member.league || notListed}</dd>
              </div>
              <div>
                <dt>入会期</dt>
                <dd>{member.joiningClass || notListed}</dd>
              </div>
              <div>
                <dt>誕生日</dt>
                <dd>{member.birthday || notListed}</dd>
              </div>
              <div>
                <dt>出身地</dt>
                <dd>{member.birthplace || notListed}</dd>
              </div>
            </dl>
          </section>

          {titles.length > 0 ? (
            <section className="content-card content-section" aria-labelledby="pro-titles-title">
              <h2 id="pro-titles-title">所持タイトル・優勝歴</h2>
              <ul className="pro-title-list">
                {titles.map((title, index) => (
                  <li key={`${title}-${index}`}>{title}</li>
                ))}
              </ul>
              <p className="pro-data-note">
                公式プロフィールの「戦績・主な活動」欄から、タイトル・優勝歴に該当する記載を抽出しています。
              </p>
            </section>
          ) : null}
        </div>

        <aside className="pro-profile-aside">
          {member.xUrl ? (
            <section className="content-card content-section">
              <span className="eyebrow">OFFICIAL X</span>
              <h2>公式X</h2>
              <ExternalLink className="pro-social-link" href={member.xUrl}>
                {member.xHandle || "Xを見る"}
              </ExternalLink>
            </section>
          ) : null}

          <section className="content-card content-section">
            <span className="eyebrow">SOURCE</span>
            <h2>出典</h2>
            <p>最高位戦日本プロ麻雀協会の公式会員プロフィールを参照しています。</p>
            <ExternalLink className="text-link" href={member.sourceUrl}>
              公式プロフィールを見る
            </ExternalLink>
          </section>

          <section className="pro-profile-notice">
            <strong>非公式プロフィールページです</strong>
            <p>情報は2026年8月9日に公式サイトで確認しました。</p>
          </section>
        </aside>
      </div>
    </main>
  );
}
