import type { Metadata } from "next";
import { getRobotsPolicy } from "@mahjong-trainer/content-index-policy";
import Link from "next/link";
import { ClipVideoGrid } from "@/app/clips/highlights/ClipVideoGrid";
import { latestMatchHighlight } from "@/app/clips/recent-clips";
import { ExternalLink } from "@/components/ExternalLink";
import { siteConfig } from "@/config/site";
import { getTeamThemeStyle } from "@/lib/mleague/teamThemes";

export const metadata: Metadata = {
  robots: getRobotsPolicy("/mleague"),
  title: { absolute: "Mリーグ対局情報｜雀フォリオ" },
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

function getHighlightHeading(tag: string) {
  const date = tag.match(/^(\d{1,2})\/(\d{1,2})\s+ハイライト$/);

  return date
    ? `${Number(date[1])}月${Number(date[2])}日のハイライト`
    : tag;
}

const latestHighlightHeading = getHighlightHeading(latestMatchHighlight.tag);

const nextMatch: UpcomingMatch = {
  "date": "10.12",
  "day": "月",
  "teams": [
    {
      "name": "EARTH JETS",
      "slug": "earth-jets",
      "teamId": "team-jets"
    },
    {
      "name": "KADOKAWAサクラナイツ",
      "slug": "kadokawa-sakura-knights",
      "teamId": "team-sakuraknights"
    },
    {
      "name": "セガサミーフェニックス",
      "slug": "sega-sammy-phoenix",
      "teamId": "team-phoenix"
    },
    {
      "name": "BEAST X",
      "slug": "beast-x",
      "teamId": "team-beast"
    }
  ]
};

const upcomingMatches: UpcomingMatch[] = [
  {
    "date": "10.12",
    "day": "月・B卓",
    "teams": [
      {
        "name": "赤坂ドリブンズ",
        "slug": "akasaka-drivens",
        "teamId": "team-drivens"
      },
      {
        "name": "KONAMI麻雀格闘倶楽部",
        "slug": "konami-mahjong-fight-club",
        "teamId": "team-fightclub"
      },
      {
        "name": "渋谷ABEMAS",
        "slug": "shibuya-abemas",
        "teamId": "team-abemas"
      },
      {
        "name": "TEAM RAIDEN / 雷電",
        "slug": "team-raiden",
        "teamId": "team-raiden"
      }
    ]
  },
  {
    "date": "10.13",
    "day": "火・A卓",
    "teams": [
      {
        "name": "EX風林火山",
        "slug": "ex-furinkazan",
        "teamId": "team-furinkazan"
      },
      {
        "name": "KONAMI麻雀格闘倶楽部",
        "slug": "konami-mahjong-fight-club",
        "teamId": "team-fightclub"
      },
      {
        "name": "セガサミーフェニックス",
        "slug": "sega-sammy-phoenix",
        "teamId": "team-phoenix"
      },
      {
        "name": "U-NEXT Pirates",
        "slug": "u-next-pirates",
        "teamId": "team-pirates"
      }
    ]
  },
  {
    "date": "10.13",
    "day": "火・B卓",
    "teams": [
      {
        "name": "KADOKAWAサクラナイツ",
        "slug": "kadokawa-sakura-knights",
        "teamId": "team-sakuraknights"
      },
      {
        "name": "渋谷ABEMAS",
        "slug": "shibuya-abemas",
        "teamId": "team-abemas"
      },
      {
        "name": "TEAM RAIDEN / 雷電",
        "slug": "team-raiden",
        "teamId": "team-raiden"
      },
      {
        "name": "BEAST X",
        "slug": "beast-x",
        "teamId": "team-beast"
      }
    ]
  }
];

const latestResults: MatchResult[] = [
  {
    "label": "A卓・第1試合",
    "entries": [
      {
        "rank": 1,
        "player": "鈴木大介",
        "playerSlug": "suzuki-daisuke",
        "points": 84.7,
        "name": "BEAST X",
        "slug": "beast-x",
        "teamId": "team-beast"
      },
      {
        "rank": 2,
        "player": "松本吉弘",
        "playerSlug": "matsumoto-yoshihiro",
        "points": 2.5,
        "name": "渋谷ABEMAS",
        "slug": "shibuya-abemas",
        "teamId": "team-abemas"
      },
      {
        "rank": 3,
        "player": "瑞原明奈",
        "playerSlug": "mizuhara-akina",
        "points": -32.3,
        "name": "U-NEXT Pirates",
        "slug": "u-next-pirates",
        "teamId": "team-pirates"
      },
      {
        "rank": 4,
        "player": "内川幸太郎",
        "playerSlug": "uchikawa-kotaro",
        "points": -54.9,
        "name": "EX風林火山",
        "slug": "ex-furinkazan",
        "teamId": "team-furinkazan"
      }
    ]
  },
  {
    "label": "A卓・第2試合",
    "entries": [
      {
        "rank": 1,
        "player": "鈴木優",
        "playerSlug": "suzuki-yu",
        "points": 74.2,
        "name": "U-NEXT Pirates",
        "slug": "u-next-pirates",
        "teamId": "team-pirates"
      },
      {
        "rank": 2,
        "player": "下石戟",
        "playerSlug": "shimoishi-geki",
        "points": 4.8,
        "name": "BEAST X",
        "slug": "beast-x",
        "teamId": "team-beast"
      },
      {
        "rank": 3,
        "player": "二階堂亜樹",
        "playerSlug": "nikaido-aki",
        "points": -21.2,
        "name": "EX風林火山",
        "slug": "ex-furinkazan",
        "teamId": "team-furinkazan"
      },
      {
        "rank": 4,
        "player": "多井隆晴",
        "playerSlug": "oi-takaharu",
        "points": -57.8,
        "name": "渋谷ABEMAS",
        "slug": "shibuya-abemas",
        "teamId": "team-abemas"
      }
    ]
  },
  {
    "label": "B卓・第1試合",
    "entries": [
      {
        "rank": 1,
        "player": "岡田紗佳",
        "playerSlug": "okada-sayaka",
        "points": 57.5,
        "name": "KADOKAWAサクラナイツ",
        "slug": "kadokawa-sakura-knights",
        "teamId": "team-sakuraknights"
      },
      {
        "rank": 2,
        "player": "伊達朱里紗",
        "playerSlug": "date-arisa",
        "points": 14.2,
        "name": "KONAMI麻雀格闘倶楽部",
        "slug": "konami-mahjong-fight-club",
        "teamId": "team-fightclub"
      },
      {
        "rank": 3,
        "player": "竹内元太",
        "playerSlug": "takeuchi-genta",
        "points": -15.6,
        "name": "セガサミーフェニックス",
        "slug": "sega-sammy-phoenix",
        "teamId": "team-phoenix"
      },
      {
        "rank": 4,
        "player": "萩原聖人",
        "playerSlug": "hagiwara-masato",
        "points": -56.1,
        "name": "TEAM RAIDEN / 雷電",
        "slug": "team-raiden",
        "teamId": "team-raiden"
      }
    ]
  },
  {
    "label": "B卓・第2試合",
    "entries": [
      {
        "rank": 1,
        "player": "本田朋広",
        "playerSlug": "honda-tomohiro",
        "points": 52.7,
        "name": "TEAM RAIDEN / 雷電",
        "slug": "team-raiden",
        "teamId": "team-raiden"
      },
      {
        "rank": 2,
        "player": "醍醐大",
        "playerSlug": "daigo-hiroshi",
        "points": 7.8,
        "name": "セガサミーフェニックス",
        "slug": "sega-sammy-phoenix",
        "teamId": "team-phoenix"
      },
      {
        "rank": 3,
        "player": "滝沢和典",
        "playerSlug": "takizawa-kazunori",
        "points": -13.8,
        "name": "KONAMI麻雀格闘倶楽部",
        "slug": "konami-mahjong-fight-club",
        "teamId": "team-fightclub"
      },
      {
        "rank": 4,
        "player": "阿久津翔太",
        "playerSlug": "akutsu-shota",
        "points": -46.7,
        "name": "KADOKAWAサクラナイツ",
        "slug": "kadokawa-sakura-knights",
        "teamId": "team-sakuraknights"
      }
    ]
  }
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
          <span>03</span>
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
            aria-label="2026年10月12日 月曜日 19時開始 A卓"
          >
            <span>{nextMatch.date}</span>
            <div>
              <strong>MON / 月</strong>
              <small>19:00 START</small>
            </div>
          </div>

          <div className="next-match-teams">
            <span className="match-status">MATCH DAY 29 / A卓</span>
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
            <Link className="button-secondary" href={siteConfig.routes.stats}>
              今シーズンの成績を見る
            </Link>
            <Link className="button-secondary" href={siteConfig.routes.calendar}>
              対局カレンダーを見る
            </Link>
          </div>
        </div>
      </section>

      <section className="latest-results" aria-labelledby="latest-results-title">
        <div className="section-heading">
          <div>
            <span className="eyebrow">LATEST RESULTS</span>
            <h2 id="latest-results-title">10月9日の対局結果</h2>
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

      <section className="home-match-highlight" aria-labelledby="home-match-highlight-title">
        <div className="section-heading">
          <div>
            <span className="eyebrow">LATEST MATCH HIGHLIGHT</span>
            <h2 id="home-match-highlight-title">{latestHighlightHeading}</h2>
          </div>
          <Link className="text-link" href={siteConfig.routes.recentClips}>
            最近の切り抜きを見る
          </Link>
        </div>

        <ClipVideoGrid
          clips={[latestMatchHighlight]}
          ariaLabel={`${latestHighlightHeading}公式動画`}
          numberLabel="HIGHLIGHT"
        />
      </section>

      <section className="upcoming-schedule" aria-labelledby="upcoming-title">
        <div className="section-heading">
          <div>
            <span className="eyebrow">UPCOMING MATCHES</span>
            <h2 id="upcoming-title">直近の対戦予定</h2>
          </div>
          <Link className="text-link" href={siteConfig.routes.calendar}>
            対局カレンダーで全日程を見る
          </Link>
        </div>

        <ol className="upcoming-match-list">
          {upcomingMatches.map((match, index) => (
            <li className="upcoming-match-card" key={`${match.date}-${match.day}`}>
              <span className="upcoming-match-number">
                {String(index + 30).padStart(2, "0")}
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
          Mリーグ公式の試合日程・結果を2026年10月11日に確認しました。対局予定は変更される場合があります。
        </p>
      </section>
    </main>
  );
}
