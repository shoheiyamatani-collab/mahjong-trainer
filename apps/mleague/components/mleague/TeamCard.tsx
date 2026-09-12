import Link from "next/link";
import { ExternalLink } from "@/components/ExternalLink";
import { siteConfig } from "@/config/site";
import { formatVerifiedDate } from "@/lib/mleague/formatDate";
import type { Player, Team } from "@/types/mleague";

type TeamCardProps = {
  team: Team;
  players: Player[];
  index: number;
};

export function TeamCard({ team, players, index }: TeamCardProps) {
  return (
    <article className="team-card">
      <span className="team-index" aria-hidden="true">
        {String(index + 1).padStart(2, "0")}
      </span>
      <h2>{team.name}</h2>
      <p>{team.description}</p>
      <div className="tag-list" aria-label="現在掲載中の所属選手">
        {players.map((player) => (
          <Link
            className="tag team-player-link"
            href={`${siteConfig.routes.players}/${player.slug}`}
            key={player.id}
          >
            {player.name}
          </Link>
        ))}
      </div>
      <p className="verified-date">
        最終確認 {formatVerifiedDate(team.lastVerifiedAt)}
      </p>
      <div className="link-row">
        <Link
          className="button"
          href={`${siteConfig.routes.teams}/${team.slug}`}
        >
          チーム詳細
        </Link>
        <ExternalLink className="button-secondary" href={team.officialWebsiteUrl}>
          公式情報
        </ExternalLink>
      </div>
    </article>
  );
}
