import type { Metadata } from "next";
import { getRobotsPolicy } from "@mahjong-trainer/content-index-policy";
import Link from "next/link";
import { ClipVideoGrid } from "@/app/clips/highlights/ClipVideoGrid";
import { latestMatchHighlight } from "@/app/clips/recent-clips";
import { ExternalLink } from "@/components/ExternalLink";
import { siteConfig } from "@/config/site";
import {
  currentSeasonStatsCompletedTablesOnThrough,
  currentSeasonStatsThrough,
  currentSeasonStatsTotalTablesOnThrough,
} from "@/data/mleague/currentSeasonStats";
import {
  regularSeasonSchedule,
  regularSeasonResultsThrough,
  regularSeasonScheduleVerifiedAt,
  type ScheduleTeamId,
} from "@/data/mleague/regularSeasonSchedule";
import { teams } from "@/data/mleague/teams";
import {
  getScheduleDateLabels,
  getUpcomingScheduledMatches,
} from "@/lib/mleague/schedulePresentation";
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

const teamById = new Map(teams.map((team) => [team.id, team]));

function getMatchTeams(teamIds: readonly ScheduleTeamId[]): MatchTeam[] {
  return teamIds.map((teamId) => {
    const team = teamById.get(teamId);
    if (!team) throw new Error(`対局日程に未登録のチームIDがあります: ${teamId}`);
    return { name: team.name, slug: team.slug, teamId: team.id };
  });
}

const upcomingMatches = getUpcomingScheduledMatches(
  regularSeasonSchedule,
  currentSeasonStatsThrough,
  currentSeasonStatsCompletedTablesOnThrough,
  currentSeasonStatsTotalTablesOnThrough,
  4,
  regularSeasonResultsThrough,
).map((match) => ({ ...match, teams: getMatchTeams(match.teams) }));
const nextMatch = upcomingMatches[0];
const nextMatchDateLabels = nextMatch ? getScheduleDateLabels(nextMatch.date) : null;

const latestResults: MatchResult[] = [
  {
    label: "A卓・第1試合",
    entries: [
      {
        rank: 1,
        player: "園田賢",
        playerSlug: "sonoda-ken",
        points: 86.7,
        name: "赤坂ドリブンズ",
        slug: "akasaka-drivens",
        teamId: "team-drivens",
      },
      {
        rank: 2,
        player: "瑞原明奈",
        playerSlug: "mizuhara-akina",
        points: -0.2,
        name: "U-NEXT Pirates",
        slug: "u-next-pirates",
        teamId: "team-pirates",
      },
      {
        rank: 3,
        player: "二階堂亜樹",
        playerSlug: "nikaido-aki",
        points: -31.1,
        name: "EX風林火山",
        slug: "ex-furinkazan",
        teamId: "team-furinkazan",
      },
      {
        rank: 4,
        player: "萩原聖人",
        playerSlug: "hagiwara-masato",
        points: -55.4,
        name: "TEAM RAIDEN / 雷電",
        slug: "team-raiden",
        teamId: "team-raiden",
      },
    ],
  },
  {
    label: "A卓・第2試合",
    entries: [
      {
        rank: 1,
        player: "仲林圭",
        playerSlug: "nakabayashi-kei",
        points: 56.7,
        name: "U-NEXT Pirates",
        slug: "u-next-pirates",
        teamId: "team-pirates",
      },
      {
        rank: 2,
        player: "渡辺太",
        playerSlug: "watanabe-futoshi",
        points: 8.7,
        name: "赤坂ドリブンズ",
        slug: "akasaka-drivens",
        teamId: "team-drivens",
      },
      {
        rank: 3,
        player: "瀬戸熊直樹",
        playerSlug: "setokuma-naoki",
        points: -32.7,
        name: "TEAM RAIDEN / 雷電",
        slug: "team-raiden",
        teamId: "team-raiden",
      },
      {
        rank: 4,
        player: "内川幸太郎",
        playerSlug: "uchikawa-kotaro",
        points: -32.7,
        name: "EX風林火山",
        slug: "ex-furinkazan",
        teamId: "team-furinkazan",
      },
    ],
  },
  {
    label: "B卓・第1試合",
    entries: [
      {
        rank: 1,
        player: "HIRO柴田",
        playerSlug: "hiro-shibata",
        points: 60.9,
        name: "EARTH JETS",
        slug: "earth-jets",
        teamId: "team-jets",
      },
      {
        rank: 2,
        player: "松本吉弘",
        playerSlug: "matsumoto-yoshihiro",
        points: 3,
        name: "渋谷ABEMAS",
        slug: "shibuya-abemas",
        teamId: "team-abemas",
      },
      {
        rank: 3,
        player: "尻無濱航",
        playerSlug: "shirinashihama-wataru",
        points: -20.7,
        name: "KADOKAWAサクラナイツ",
        slug: "kadokawa-sakura-knights",
        teamId: "team-sakuraknights",
      },
      {
        rank: 4,
        player: "鈴木大介",
        playerSlug: "suzuki-daisuke",
        points: -43.2,
        name: "BEAST X",
        slug: "beast-x",
        teamId: "team-beast",
      },
    ],
  },
  {
    label: "B卓・第2試合",
    entries: [
      {
        rank: 1,
        player: "堀慎吾",
        playerSlug: "hori-shingo",
        points: 58,
        name: "KADOKAWAサクラナイツ",
        slug: "kadokawa-sakura-knights",
        teamId: "team-sakuraknights",
      },
      {
        rank: 2,
        player: "松本吉弘",
        playerSlug: "matsumoto-yoshihiro",
        points: 9.4,
        name: "渋谷ABEMAS",
        slug: "shibuya-abemas",
        teamId: "team-abemas",
      },
      {
        rank: 3,
        player: "逢川恵夢",
        playerSlug: "aikawa-megumu",
        points: -22.4,
        name: "EARTH JETS",
        slug: "earth-jets",
        teamId: "team-jets",
      },
      {
        rank: 4,
        player: "下石戟",
        playerSlug: "shimoishi-geki",
        points: -45,
        name: "BEAST X",
        slug: "beast-x",
        teamId: "team-beast",
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

          {nextMatch && nextMatchDateLabels ? (
            <>
              <div
                className="next-match-date"
                aria-label={`${nextMatch.date} ${nextMatchDateLabels.weekdayFullJa} 19時開始 ${nextMatch.tableLabel}`}
              >
                <span>{nextMatchDateLabels.shortDate}</span>
                <div>
                  <strong>{nextMatchDateLabels.weekdayEn} / {nextMatchDateLabels.weekdayJa}</strong>
                  <small>19:00 START</small>
                </div>
              </div>

              <div className="next-match-teams">
                <span className="match-status">MATCH {nextMatch.matchNumber} / {nextMatch.tableLabel}</span>
                <ul>
                  {nextMatch.teams.map((team) => (
                    <TeamLink team={team} key={team.teamId} />
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <p className="next-match-teams">次回の対局予定は、公式日程の更新後に掲載します。</p>
          )}

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
            <h2 id="latest-results-title">10月26日の対局結果</h2>
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

      <section className="section" aria-labelledby="watch-and-learn-title">
        <div className="section-heading"><h2 id="watch-and-learn-title">観戦を、自分の判断の復習につなげる</h2></div>
        <p>対局結果は結果の記録、成績は対象期間の集計、切り抜きは投稿者が選んだ場面です。どれも一打の正しさを単独で証明する資料ではありません。点差や巡目を確認し、自分なら何を比較するかを決めてから見ると、学習テーマを見つけやすくなります。</p>
        <ul>
          <li>得点が分からないときは<a className="text-link" href="/tools/score-table">点数早見表</a>で親子・ロン・ツモの違いを確認する。</li>
          <li>逆転に必要な条件は<a className="text-link" href="/analysis/orasu-condition">オーラス条件計算</a>で比較する。連荘やチームの最終順位点は別途ルールを確認する。</li>
          <li>危険牌が気になったら<a className="text-link" href="/learn/guides/genbutsu-suji-kabe">現物・スジ・カベ</a>を復習し、相手の手牌を見た後の印象と分ける。</li>
        </ul>
        <p className="match-source-note">雀フォリオ運営による非公式情報です。公式データと当サイトの補足を区別し、情報の扱いは<Link className="text-link" href={siteConfig.routes.policy}>掲載・訂正方針</Link>にまとめています。</p>
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
          {upcomingMatches.map((match) => {
            const dateLabels = getScheduleDateLabels(match.date);
            return (
              <li className="upcoming-match-card" key={`${match.date}-${match.tableIndex}`}>
                <span className="upcoming-match-number">{String(match.matchNumber).padStart(2, "0")}</span>
                <div className="upcoming-match-date">
                  <strong>{dateLabels.shortDate}</strong>
                  <span>{dateLabels.weekdayJa}・{match.tableLabel}</span>
                </div>
                <ul className="upcoming-team-list">
                  {match.teams.map((team) => (
                    <TeamLink team={team} key={team.teamId} />
                  ))}
                </ul>
              </li>
            );
          })}
        </ol>

        <p className="match-source-note">
          Mリーグ公式の日程・結果を{regularSeasonScheduleVerifiedAt.replaceAll("-", ".")}に確認しました。対局予定は変更される場合があります。
        </p>
      </section>
    </main>
  );
}
