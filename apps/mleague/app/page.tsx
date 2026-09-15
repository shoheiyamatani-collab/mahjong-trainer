import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink } from "@/components/ExternalLink";
import { siteConfig } from "@/config/site";
import { getTeamThemeStyle } from "@/lib/mleague/teamThemes";

export const metadata: Metadata = {
  title: { absolute: "Mリーグ対局情報" },
  description:
    "Mリーグ2026-27シーズンの最新結果、次回対局日時、対戦チーム、視聴リンク、直近の試合日程を掲載する非公式情報ページです。",
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

type MatchResultEntry = MatchTeam & {
  player: string;
  playerSlug: string;
  rank: 1 | 2 | 3 | 4;
  points: number;
};

type MatchResult = {
  label: string;
  entries: MatchResultEntry[];
};

const nextMatch: UpcomingMatch = {
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
};

const upcomingMatches: UpcomingMatch[] = [
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

const latestResults: MatchResult[] = [
  {
    label: "第1試合",
    entries: [
      {
        rank: 1,
        player: "逢川恵夢",
        playerSlug: "aikawa-megumu",
        points: 58.0,
        name: "EARTH JETS",
        slug: "earth-jets",
        teamId: "team-jets",
      },
      {
        rank: 2,
        player: "仲林圭",
        playerSlug: "nakabayashi-kei",
        points: 3.8,
        name: "U-NEXT Pirates",
        slug: "u-next-pirates",
        teamId: "team-pirates",
      },
      {
        rank: 3,
        player: "日向藍子",
        playerSlug: "hinata-aiko",
        points: -19.5,
        name: "渋谷ABEMAS",
        slug: "shibuya-abemas",
        teamId: "team-abemas",
      },
      {
        rank: 4,
        player: "滝沢和典",
        playerSlug: "takizawa-kazunori",
        points: -42.3,
        name: "KONAMI麻雀格闘倶楽部",
        slug: "konami-mahjong-fight-club",
        teamId: "team-fightclub",
      },
    ],
  },
  {
    label: "第2試合",
    entries: [
      {
        rank: 1,
        player: "朝倉康心",
        playerSlug: "asakura-koshin",
        points: 54.7,
        name: "U-NEXT Pirates",
        slug: "u-next-pirates",
        teamId: "team-pirates",
      },
      {
        rank: 2,
        player: "松本吉弘",
        playerSlug: "matsumoto-yoshihiro",
        points: 7.4,
        name: "渋谷ABEMAS",
        slug: "shibuya-abemas",
        teamId: "team-abemas",
      },
      {
        rank: 3,
        player: "佐々木寿人",
        playerSlug: "sasaki-hisato",
        points: -14.0,
        name: "KONAMI麻雀格闘倶楽部",
        slug: "konami-mahjong-fight-club",
        teamId: "team-fightclub",
      },
      {
        rank: 4,
        player: "三浦智博",
        playerSlug: "miura-tomohiro",
        points: -48.1,
        name: "EARTH JETS",
        slug: "earth-jets",
        teamId: "team-jets",
      },
    ],
  },
];

function formatPoints(points: number) {
  return `${points > 0 ? "+" : ""}${points.toFixed(1)} pt`;
}

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
          <span>02</span>
          <span>M.LEAGUE 2026-27 REGULAR SEASON</span>
          <span>NEXT MATCH</span>
        </div>

        <div className="next-match-board">
          <div className="next-match-heading">
            <span className="eyebrow">NEXT MATCH</span>
            <h1 id="match-info-title">Mリーグ対局情報</h1>
            <p>2026-27シーズン レギュラーシーズン</p>
          </div>

          <div
            className="next-match-date"
            aria-label="2026年9月15日 火曜日 19時開始"
          >
            <span>{nextMatch.date}</span>
            <div>
              <strong>TUE / 火</strong>
              <small>19:00 START</small>
            </div>
          </div>

          <div className="next-match-teams">
            <span className="match-status">MATCH DAY 02</span>
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

      <section className="latest-results" aria-labelledby="latest-results-title">
        <div className="section-heading">
          <div>
            <span className="eyebrow">LATEST RESULTS</span>
            <h2 id="latest-results-title">9月14日の対局結果</h2>
          </div>
          <ExternalLink className="text-link" href="https://m-league.jp/games/">
            Mリーグ公式で結果を見る
          </ExternalLink>
        </div>

        <div className="result-match-grid">
          {latestResults.map((match) => (
            <section className="result-match-card" key={match.label}>
              <h3>{match.label}</h3>
              <ol className="result-entry-list">
                {match.entries.map((entry) => (
                  <li
                    className="result-entry"
                    key={entry.playerSlug}
                    style={getTeamThemeStyle(entry.teamId)}
                  >
                    <span className={`result-rank result-rank-${entry.rank}`}>
                      {entry.rank}
                    </span>
                    <div className="result-player">
                      <Link href={`${siteConfig.routes.players}/${entry.playerSlug}`}>
                        {entry.player}
                      </Link>
                      <Link href={`${siteConfig.routes.teams}/${entry.slug}`}>
                        {entry.name}
                      </Link>
                    </div>
                    <strong
                      className={`result-points ${
                        entry.points > 0 ? "is-positive" : "is-negative"
                      }`}
                    >
                      {formatPoints(entry.points)}
                    </strong>
                  </li>
                ))}
              </ol>
            </section>
          ))}
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
                {String(index + 3).padStart(2, "0")}
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
          Mリーグ公式の試合日程・結果を2026年9月15日に確認しました。対局予定は変更される場合があります。
        </p>
      </section>
    </main>
  );
}
