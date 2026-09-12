import Link from "next/link";
import { siteConfig } from "@/config/site";
import { getTeamThemeStyle } from "@/lib/mleague/teamThemes";
import type { Player, Team } from "@/types/mleague";

type TeamWithCurrentPlayers = Team & {
  currentPlayers: Player[];
};

type TeamPlayerLinksProps = {
  teams: TeamWithCurrentPlayers[];
};

export function TeamPlayerLinks({ teams }: TeamPlayerLinksProps) {
  const populatedTeams = teams.filter((team) => team.currentPlayers.length > 0);

  return (
    <section className="section team-link-section" aria-labelledby="team-link-title">
      <div className="section-heading">
        <div>
          <span className="eyebrow">TEAM LINKS</span>
          <h2 id="team-link-title">チームごとに選手を見る</h2>
          <p>チーム名または選手名を選ぶと、それぞれの詳細ページへ移動します。</p>
        </div>
      </div>
      <nav className="team-link-directory" aria-label="チーム別選手リンク">
        {populatedTeams.map((team, teamIndex) => (
          <article
            className="team-link-card"
            key={team.id}
            style={getTeamThemeStyle(team.id)}
          >
            <div className="team-link-heading">
              <div className="team-link-identity">
                <span className="team-link-code">
                  TEAM {String(teamIndex + 1).padStart(2, "0")}
                </span>
                <h3>
                  <Link href={`${siteConfig.routes.teams}/${team.slug}`}>
                    {team.name}
                  </Link>
                </h3>
              </div>
              <span className="team-player-total">
                <b>{team.currentPlayers.length}</b> PLAYERS
              </span>
            </div>
            <ul className="team-player-links">
              {team.currentPlayers.map((player, playerIndex) => (
                <li key={player.id}>
                  <Link
                    className="team-player-link"
                    href={`${siteConfig.routes.players}/${player.slug}`}
                  >
                    <span className="team-player-index">
                      {String(playerIndex + 1).padStart(2, "0")}
                    </span>
                    <span className="team-player-copy">
                      <strong>{player.displayName}</strong>
                      <small>{player.nameKana}</small>
                    </span>
                    <span className="team-player-arrow" aria-hidden="true">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </nav>
    </section>
  );
}
