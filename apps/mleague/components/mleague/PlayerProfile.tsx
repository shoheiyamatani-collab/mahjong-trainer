import Link from "next/link";
import { ExternalLink } from "@/components/ExternalLink";
import { siteConfig } from "@/config/site";
import { teams } from "@/data/mleague/teams";
import { formatVerifiedDate } from "@/lib/mleague/formatDate";
import { getCurrentMembership } from "@/lib/mleague/getPlayers";
import { getTeamThemeStyle } from "@/lib/mleague/teamThemes";
import type {
  Player,
  PlayerBook,
  PlayerCareerStats,
  SeasonResult,
  TeamMembership,
} from "@/types/mleague";
import { MLeagueStats } from "./MLeagueStats";
import { PlayerSources } from "./PlayerSources";
import { SeasonHistory } from "./SeasonHistory";
import { VerifiedPlayerProfile } from "./VerifiedPlayerProfile";

type PlayerProfileProps = {
  player: Player;
  memberships: TeamMembership[];
  careerStats?: PlayerCareerStats;
  seasonResults: SeasonResult[];
  books: PlayerBook[];
};

export function PlayerProfile({
  player,
  memberships,
  careerStats,
  seasonResults,
  books,
}: PlayerProfileProps) {
  if (player.verifiedProfile) {
    return (
      <VerifiedPlayerProfile
        player={player}
        books={books}
        careerStats={careerStats}
        seasonResults={seasonResults}
      />
    );
  }

  const currentMembership = getCurrentMembership(player.id);
  const currentTeam = currentMembership
    ? teams.find((team) => team.id === currentMembership.teamId)
    : undefined;
  const socialLinks = Object.entries(player.socialLinks).filter(([, value]) => value);

  return (
    <>
      <section
        className="profile-hero profile-hero-without-avatar"
        style={getTeamThemeStyle(currentTeam?.id)}
      >
        <div>
          <span className="profile-kicker">PLAYER PROFILE</span>
          <p className="player-name-kana">{player.nameKana}</p>
          <h1 className="page-title">{player.displayName}</h1>
          <div className="tag-list">
            <span className="tag profile-team-tag">
              {currentTeam?.name || "所属未確認"}
            </span>
            <span className="tag">{player.proAssociation || "所属団体未確認"}</span>
            <span className="tag">
              Mリーグ {player.mLeagueDebutSeason || "加入時期未確認"}
            </span>
          </div>
        </div>
      </section>

      <div className="profile-grid section">
        <div>
          <section className="content-card content-section">
            <h2>人物紹介</h2>
            <p>{player.biography || "確認済みの紹介文を準備中です。"}</p>
          </section>
          <section className="content-card content-section">
            <h2>主なタイトル・実績</h2>
            {player.achievements?.length ? (
              <ul className="plain-list">
                {player.achievements.map((achievement) => (
                  <li key={`${achievement.title}-${achievement.year || ""}`}>
                    {achievement.title}
                    {achievement.year ? `（${achievement.year}年）` : ""}
                  </li>
                ))}
              </ul>
            ) : (
              <p>確認済みの情報を準備中です。</p>
            )}
          </section>
          <section className="content-card content-section">
            <h2>打ち筋や特徴</h2>
            <p>{player.playStyleSummary || "準備中"}</p>
            <p className="verified-date">
              根拠の確認できない評価や、断定的な人物評は掲載しません。
            </p>
          </section>
          <MLeagueStats stats={careerStats} results={seasonResults} />
          <SeasonHistory memberships={memberships} teams={teams} />
          <PlayerSources sources={player.sources} />
        </div>

        <aside>
          <section className="content-card">
            <h2>公式リンク</h2>
            <ul className="plain-list">
              {player.officialProfileUrl ? (
                <li>
                  <ExternalLink className="text-link" href={player.officialProfileUrl}>
                    公式プロフィール
                  </ExternalLink>
                </li>
              ) : null}
              {socialLinks.map(([label, href]) => (
                <li key={label}>
                  <ExternalLink className="text-link" href={href}>
                    {label === "x" ? "X" : label}
                  </ExternalLink>
                </li>
              ))}
              {!player.officialProfileUrl && socialLinks.length === 0 ? (
                <li>確認済みリンクは準備中です。</li>
              ) : null}
            </ul>
          </section>
          <section className="content-card">
            <h2>確認情報</h2>
            <p className="verified-date">
              最終確認 {formatVerifiedDate(player.lastVerifiedAt)}
            </p>
            <Link
              className="button-secondary"
              href={`${siteConfig.routes.correctionRequest}?target=${encodeURIComponent(player.name)}`}
            >
              情報の訂正を依頼
            </Link>
          </section>
          <section className="content-card">
            <h2>出演イベント</h2>
            <p>
              公式発表を確認できるゲスト・大会・トークイベント情報を、今後掲載予定です。
            </p>
            <Link className="text-link" href={siteConfig.routes.events}>
              イベント掲載方針を見る
            </Link>
          </section>
        </aside>
      </div>
    </>
  );
}
