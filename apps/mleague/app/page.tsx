import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink } from "@/components/ExternalLink";
import { siteConfig } from "@/config/site";
import { getTeamThemeStyle } from "@/lib/mleague/teamThemes";

export const metadata: Metadata = {
  title: { absolute: "Mリーグ対局情報" },
  description:
    "Mリーグ2026-27シーズンの次回対局日時、対戦チーム、視聴リンク、直近の試合日程を掲載する非公式情報ページです。",
  alternates: { canonical: siteConfig.homeUrl },
  openGraph: { url: siteConfig.homeUrl },
};

type MatchTeam = {
  name: string;
  slug: string;
  teamId: string;
};

type UpcomingMatch = {
  date: string;
  day: string;
  teams: MatchTeam[];
};

const nextMatch: UpcomingMatch = {
  date: "9.14",
  day: "月",
  teams: [
    { name: "EARTH JETS", slug: "earth-jets", teamId: "team-jets" },
    {
      name: "KONAMI麻雀格闘倶楽部",
      slug: "konami-mahjong-fight-club",
      teamId: "team-fightclub",
    },
    { name: "渋谷ABEMAS", slug: "shibuya-abemas", teamId: "team-abemas" },
    { name: "U-NEXT Pirates", slug: "u-next-pirates", teamId: "team-pirates" },
  ],
};

const upcomingMatches: UpcomingMatch[] = [
  {
    date: "9.15",
    day: "火",
    teams: [
      { name: "赤坂ドリブンズ", slug: "akasaka-drivens", teamId: "team-drivens" },
      { name: "EX風林火山", slug: "ex-furinkazan", teamId: "team-furinkazan" },
      {
        name: "KADOKAWAサクラナイツ",
        slug: "kadokawa-sakura-knights",
        teamId: "team-sakuraknights",
      },
      {
        name: "セガサミーフェニックス",
        slug: "sega-sammy-phoenix",
        teamId: "team-phoenix",
      },
    ],
  },
  {
    date: "9.17",
    day: "木",
    teams: [
      { name: "EARTH JETS", slug: "earth-jets", teamId: "team-jets" },
      { name: "赤坂ドリブンズ", slug: "akasaka-drivens", teamId: "team-drivens" },
      { name: "TEAM RAIDEN / 雷電", slug: "team-raiden", teamId: "team-raiden" },
      { name: "BEAST X", slug: "beast-x", teamId: "team-beast" },
    ],
  },
  {
    date: "9.18",
    day: "金",
    teams: [
      {
        name: "KADOKAWAサクラナイツ",
        slug: "kadokawa-sakura-knights",
        teamId: "team-sakuraknights",
      },
      {
        name: "KONAMI麻雀格闘倶楽部",
        slug: "konami-mahjong-fight-club",
        teamId: "team-fightclub",
      },
      { name: "TEAM RAIDEN / 雷電", slug: "team-raiden", teamId: "team-raiden" },
      { name: "U-NEXT Pirates", slug: "u-next-pirates", teamId: "team-pirates" },
    ],
  },
];

function TeamLink({ team }: { team: MatchTeam }) {
  return (
    <li style={getTeamThemeStyle(team.teamId)}>
      <Link href={`${siteConfig.routes.teams}/${team.slug}`}>
        <span aria-hidden="true" />
        {team.name}
      </Link>
    </li>
  );
}

export default function MatchInformationPage() {
  return (
    <main id="main-content" className="page-shell match-info-home">
      <section
        className="match-info-hero match-info-hero-live"
        aria-labelledby="match-info-title"
      >
        <div className="broadcast-rail" aria-hidden="true">
          <span>01</span>
          <span>M.LEAGUE 2026-27 REGULAR SEASON</span>
          <span>SCHEDULED</span>
        </div>

        <div className="next-match-board">
          <div className="next-match-heading">
            <span className="eyebrow">NEXT MATCH</span>
            <h1 id="match-info-title">Mリーグ対局情報</h1>
            <p>2026-27シーズン 開幕戦</p>
          </div>

          <div
            className="next-match-date"
            aria-label="2026年9月14日 月曜日 19時開始"
          >
            <span>{nextMatch.date}</span>
            <div>
              <strong>MON / 月</strong>
              <small>19:00 START</small>
            </div>
          </div>

          <div className="next-match-teams">
            <span className="match-status">MATCH DAY 01</span>
            <ul>
              {nextMatch.teams.map((team) => (
                <TeamLink team={team} key={team.teamId} />
              ))}
            </ul>
          </div>

          <div className="next-match-actions">
            <ExternalLink
              className="button match-watch-button"
              href="https://abema.tv/now-on-air/mahjong"
            >
              ABEMA麻雀チャンネルで視聴
            </ExternalLink>
            <Link className="button-secondary" href={siteConfig.routes.players}>
              選手について知る
            </Link>
          </div>
        </div>
      </section>

      <section className="upcoming-schedule" aria-labelledby="upcoming-title">
        <div className="section-heading">
          <div>
            <span className="eyebrow">UPCOMING MATCHES</span>
            <h2 id="upcoming-title">直近の対戦予定</h2>
          </div>
          <ExternalLink className="text-link" href="https://m-league.jp/games/">
            公式サイトで全日程を見る
          </ExternalLink>
        </div>

        <ol className="upcoming-match-list">
          {upcomingMatches.map((match, index) => (
            <li className="upcoming-match-card" key={match.date}>
              <span className="upcoming-match-number">
                {String(index + 2).padStart(2, "0")}
              </span>
              <div className="upcoming-match-date">
                <strong>{match.date}</strong>
                <span>{match.day}</span>
              </div>
              <ul className="upcoming-team-list">
                {match.teams.map((team) => (
                  <TeamLink team={team} key={team.teamId} />
                ))}
              </ul>
            </li>
          ))}
        </ol>

        <p className="match-source-note">
          Mリーグ公式の試合日程・開幕戦発表を2026年9月11日に確認しました。出場選手は公式発表後に更新します。
        </p>
      </section>
    </main>
  );
}
