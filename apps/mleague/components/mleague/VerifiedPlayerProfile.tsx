import Link from "next/link";
import { FaXTwitter, FaYoutube } from "react-icons/fa6";
import { ExternalLink } from "@/components/ExternalLink";
import { siteConfig } from "@/config/site";
import { teams } from "@/data/mleague/teams";
import {
  getAmazonBookLink,
  getRakutenBookLink,
} from "@/lib/mleague/affiliateLinks";
import { formatVerifiedDate } from "@/lib/mleague/formatDate";
import { getCurrentMembership } from "@/lib/mleague/getPlayers";
import { getTeamThemeStyle } from "@/lib/mleague/teamThemes";
import type {
  Player,
  PlayerBook,
  PlayerCareerStats,
  SeasonResult,
} from "@/types/mleague";
import { BookCard } from "./BookCard";
import { MLeagueStats } from "./MLeagueStats";
import { PlayerSources } from "./PlayerSources";

function formatBirthDate(value: string | null) {
  if (!value) return "非公開";
  const [year, month, day] = value.split("-").map(Number);
  return `${year}年${month}月${day}日`;
}

export function VerifiedPlayerProfile({
  player,
  books,
  careerStats,
  seasonResults,
}: {
  player: Player;
  books: PlayerBook[];
  careerStats?: PlayerCareerStats;
  seasonResults: SeasonResult[];
}) {
  const profile = player.verifiedProfile;
  if (!profile) return null;

  const currentMembership = getCurrentMembership(player.id);
  const currentTeam = currentMembership
    ? teams.find((team) => team.id === currentMembership.teamId)
    : undefined;
  const publishedBooks = books.filter((book) => book.isPublished);
  const hasAmazonAffiliateLink = publishedBooks.some(
    (book) => getAmazonBookLink(book).sponsored,
  );
  const hasAffiliateLink =
    hasAmazonAffiliateLink ||
    publishedBooks.some((book) => getRakutenBookLink(book).sponsored);
  const officialAccounts = [
    profile.officialAccounts.x
      ? { platform: "X", ...profile.officialAccounts.x }
      : undefined,
    profile.officialAccounts.youtube
      ? { platform: "YouTube", ...profile.officialAccounts.youtube }
      : undefined,
  ].filter((account) => account !== undefined);

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
            <span className="tag">{profile.organization.name}</span>
            <span className="tag profile-team-tag">
              {currentTeam?.name || "所属未確認"}
            </span>
          </div>
        </div>
      </section>

      <div className="verified-profile section">
        <section className="content-card content-section" aria-labelledby="profile-data-title">
          <h2 id="profile-data-title">プロフィール</h2>
          <dl className="definition-list profile-definition-list">
            <div>
              <dt>生年月日</dt>
              <dd>{formatBirthDate(profile.birthDate)}</dd>
            </div>
            <div>
              <dt>出身地</dt>
              <dd>{profile.birthplace || "未確認"}</dd>
            </div>
            <div>
              <dt>所属プロ団体</dt>
              <dd>
                <ExternalLink className="text-link" href={profile.organization.officialUrl}>
                  {profile.organization.name}
                </ExternalLink>
              </dd>
            </div>
            {profile.organizationLeague ? (
              <div>
                <dt>所属リーグ</dt>
                <dd>
                  <ExternalLink
                    className="text-link"
                    href={profile.organizationLeague.officialUrl}
                  >
                    {profile.organizationLeague.season
                      ? `${profile.organizationLeague.season} ${profile.organizationLeague.name}`
                      : profile.organizationLeague.name}
                  </ExternalLink>
                </dd>
              </div>
            ) : null}
            <div>
              <dt>Mリーグ所属</dt>
              <dd>
                {currentTeam?.officialWebsiteUrl ? (
                  <ExternalLink className="text-link" href={currentTeam.officialWebsiteUrl}>
                    {currentTeam.name}
                  </ExternalLink>
                ) : (
                  currentTeam?.name || "未確認"
                )}
              </dd>
            </div>
          </dl>
        </section>

        <MLeagueStats stats={careerStats} results={seasonResults} />

        <section className="content-card content-section" aria-labelledby="official-accounts-title">
          <h2 id="official-accounts-title">公式アカウント</h2>
          <div className="official-account-grid">
            {officialAccounts.map((account) => (
              <ExternalLink
                key={account.platform}
                className={`official-account-card official-account-card-${account.platform.toLowerCase()}`}
                href={account.url}
              >
                <span className="official-account-platform">
                  <span className="official-account-icon" aria-hidden="true">
                    {account.platform === "X" ? <FaXTwitter /> : <FaYoutube />}
                  </span>
                  <span>{account.platform}</span>
                </span>
                <strong>{account.name}</strong>
                <span>{account.handle}</span>
              </ExternalLink>
            ))}
          </div>
        </section>

        {publishedBooks.length > 0 ? (
          <section className="content-section" aria-labelledby="books-title">
            <div className="section-heading books-heading">
              <div>
                <h2 id="books-title">出版書籍</h2>
                <p>公開確認済みの著書・共著・監修書を掲載しています。</p>
              </div>
              <span className="book-count">{publishedBooks.length}冊</span>
            </div>
            <div className="book-grid">
              {publishedBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
            {hasAffiliateLink ? (
              <p className="book-affiliate-disclosure book-section-affiliate-disclosure">
                商品リンクにはアフィリエイト広告が含まれます。
                {hasAmazonAffiliateLink
                  ? " Amazonのアソシエイトとして、当サイトは適格販売により収入を得ています。"
                  : ""}
              </p>
            ) : null}
          </section>
        ) : null}

        <PlayerSources sources={player.sources} />

        <section className="content-card profile-verification" aria-labelledby="verification-title">
          <div>
            <h2 id="verification-title">確認情報</h2>
            <p className="verified-date">
              最終確認 {formatVerifiedDate(player.lastVerifiedAt)}
            </p>
          </div>
          <Link
            className="button-secondary"
            href={`${siteConfig.routes.correctionRequest}?target=${encodeURIComponent(player.name)}`}
          >
            情報の訂正を依頼
          </Link>
        </section>
      </div>
    </>
  );
}
