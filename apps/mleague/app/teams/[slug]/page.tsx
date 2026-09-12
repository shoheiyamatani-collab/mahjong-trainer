import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "@/components/ExternalLink";
import { PlayerSources } from "@/components/mleague/PlayerSources";
import { TeamMemberList } from "@/components/mleague/TeamMemberList";
import { UnofficialNotice } from "@/components/mleague/UnofficialNotice";
import { siteConfig } from "@/config/site";
import { teams } from "@/data/mleague/teams";
import { formatVerifiedDate } from "@/lib/mleague/formatDate";
import { getTeamBySlug } from "@/lib/mleague/getTeamBySlug";

type TeamPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return teams
    .filter((team) => team.publicationStatus === "published")
    .map((team) => ({ slug: team.slug }));
}

export async function generateMetadata({ params }: TeamPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = getTeamBySlug(slug);
  return result
    ? {
        title: `${result.team.name}の所属選手一覧｜Mリーグ選手名鑑`,
        description: `${result.team.name}の現在・過去・シーズン別所属選手と公式情報へのリンクを掲載しています。`,
      }
    : { title: "チームが見つかりません" };
}

export default async function TeamPage({ params }: TeamPageProps) {
  const { slug } = await params;
  const result = getTeamBySlug(slug);
  if (!result) notFound();

  const seasons = Array.from(
    new Set(result.memberships.map((membership) => membership.startSeason)),
  ).sort();

  return (
    <main id="main-content" className="page-shell">
      <header className="page-header">
        <span className="eyebrow">TEAM PROFILE</span>
        <h1 className="page-title">{result.team.name}</h1>
        <p className="page-lead">{result.team.description || "説明を準備中です。"}</p>
        <div className="link-row">
          <ExternalLink className="button" href={result.team.officialWebsiteUrl}>
            公式情報を確認
          </ExternalLink>
          <Link className="button-secondary" href={siteConfig.routes.teams}>
            チーム一覧へ
          </Link>
        </div>
      </header>
      <UnofficialNotice />

      <section className="section">
        <TeamMemberList
          players={result.players}
          memberships={result.memberships}
        />
      </section>

      <section className="content-card content-section section">
        <h2>シーズン別の所属選手</h2>
        {seasons.map((season) => {
          const memberIds = new Set(
            result.memberships
              .filter((membership) => membership.startSeason === season)
              .map((membership) => membership.playerId),
          );
          return (
            <div key={season}>
              <h3>{season} 加入・所属開始</h3>
              <div className="tag-list">
                {result.players
                  .filter((player) => memberIds.has(player.id))
                  .map((player) => (
                    <span className="tag" key={player.id}>
                      {player.name}
                    </span>
                  ))}
              </div>
            </div>
          );
        })}
      </section>

      <PlayerSources sources={result.team.sources} />
      <p className="verified-date">
        チーム情報の最終確認 {formatVerifiedDate(result.team.lastVerifiedAt)}
      </p>
    </main>
  );
}
