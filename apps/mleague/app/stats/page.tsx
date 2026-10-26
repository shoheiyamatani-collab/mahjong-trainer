import type { Metadata } from "next";
import { getRobotsPolicy } from "@mahjong-trainer/content-index-policy";
import Link from "next/link";
import { ExternalLink } from "@/components/ExternalLink";
import { UnofficialNotice } from "@/components/mleague/UnofficialNotice";
import { siteConfig } from "@/config/site";
import {
  currentSeason,
  currentSeasonPlayerStatsByPlayerId,
  currentSeasonStatsProgressLabel,
  currentSeasonStatsSourceUrl,
  currentSeasonStatsVerifiedAt,
  emptyCurrentSeasonStat,
  type CurrentSeasonPlayerStatLine,
} from "@/data/mleague/currentSeasonStats";
import { getPlayersWithCurrentTeams } from "@/lib/mleague/getPlayers";
import { getPublishedTeams } from "@/lib/mleague/getTeams";
import { getTeamThemeStyle } from "@/lib/mleague/teamThemes";

export const metadata: Metadata = {
  robots: getRobotsPolicy("/mleague/stats"),
  title: `Mリーグ${currentSeason} チーム・個人成績`,
  description:
    `Mリーグ${currentSeason}レギュラーシーズンのチーム順位と個人成績を掲載する非公式ページです。`,
  alternates: { canonical: "/mleague/stats/" },
};

type Ranked<T> = T & { rank: number };

function formatPoints(points: number) {
  return `${points > 0 ? "+" : ""}${points.toFixed(1)}`;
}

function formatAveragePlacement(value: number | null) {
  return value === null ? "—" : value.toFixed(2);
}

function withCompetitionRanks<T>(rows: T[], getScore: (row: T) => number) {
  let previousScore: number | undefined;
  let currentRank = 0;

  return rows.map<Ranked<T>>((row, index) => {
    const score = getScore(row);

    if (previousScore === undefined || score !== previousScore) {
      currentRank = index + 1;
    }

    previousScore = score;
    return { ...row, rank: currentRank };
  });
}

const playerRows = getPlayersWithCurrentTeams().flatMap((player) => {
  if (!player.currentTeam) return [];

  return [
    {
      player,
      team: player.currentTeam,
      stats:
        currentSeasonPlayerStatsByPlayerId[player.id] ?? emptyCurrentSeasonStat,
    },
  ];
});

const rankedPlayers = withCompetitionRanks(
  [...playerRows].sort(
    (a, b) =>
      b.stats.points - a.stats.points ||
      b.stats.matchesPlayed - a.stats.matchesPlayed ||
      a.team.name.localeCompare(b.team.name, "ja") ||
      a.player.displayName.localeCompare(b.player.displayName, "ja"),
  ),
  (row) => row.stats.points,
);

const teamRows = getPublishedTeams().map((team) => {
  const memberStats = playerRows
    .filter((row) => row.team.id === team.id)
    .map((row) => row.stats);
  const matchesPlayed = memberStats.reduce(
    (total, stat) => total + stat.matchesPlayed,
    0,
  );
  const firstPlaceCount = memberStats.reduce(
    (total, stat) => total + stat.firstPlaceCount,
    0,
  );
  const secondPlaceCount = memberStats.reduce(
    (total, stat) => total + stat.secondPlaceCount,
    0,
  );
  const thirdPlaceCount = memberStats.reduce(
    (total, stat) => total + stat.thirdPlaceCount,
    0,
  );
  const fourthPlaceCount = memberStats.reduce(
    (total, stat) => total + stat.fourthPlaceCount,
    0,
  );
  const placementTotal =
    firstPlaceCount +
    secondPlaceCount * 2 +
    thirdPlaceCount * 3 +
    fourthPlaceCount * 4;

  return {
    team,
    matchesPlayed,
    points: Number(
      memberStats.reduce((total, stat) => total + stat.points, 0).toFixed(1),
    ),
    averagePlacement:
      matchesPlayed === 0 ? null : placementTotal / matchesPlayed,
    firstPlaceCount,
    secondPlaceCount,
    thirdPlaceCount,
    fourthPlaceCount,
  };
});

const rankedTeams = withCompetitionRanks(
  [...teamRows].sort(
    (a, b) =>
      b.points - a.points || a.team.name.localeCompare(b.team.name, "ja"),
  ),
  (row) => row.points,
);

function PointValue({ points }: { points: number }) {
  const tone = points > 0 ? "is-positive" : points < 0 ? "is-negative" : "is-neutral";

  return <span className={`season-point-value ${tone}`}>{formatPoints(points)} pt</span>;
}

function PlacementCells({ stats }: { stats: CurrentSeasonPlayerStatLine }) {
  return (
    <>
      <td>{stats.firstPlaceCount}</td>
      <td>{stats.secondPlaceCount}</td>
      <td>{stats.thirdPlaceCount}</td>
      <td>{stats.fourthPlaceCount}</td>
    </>
  );
}

export default function CurrentSeasonStatsPage() {
  return (
    <main id="main-content" className="page-shell season-ranking-page">
      <header className="page-header directory-page-header season-ranking-header">
        <span className="eyebrow">REGULAR SEASON STANDINGS</span>
        <h1 className="page-title">今シーズンの成績</h1>
        <p className="page-lead">
          Mリーグ{currentSeason} レギュラーシーズンのチーム順位と個人成績です。
        </p>
      </header>

      <UnofficialNotice />

      <section className="section season-team-standings" aria-labelledby="team-standing-title">
        <div className="section-heading season-ranking-heading">
          <div>
            <span className="eyebrow">TEAM STANDINGS</span>
            <h2 id="team-standing-title">チーム成績</h2>
            <p>チーム名から、所属選手の一覧とチーム情報を確認できます。</p>
          </div>
        </div>

        <ol className="season-team-ranking-list">
          {rankedTeams.map((row) => (
            <li
              className="season-team-ranking-card"
              key={row.team.id}
              style={getTeamThemeStyle(row.team.id)}
            >
              <span className="season-ranking-position">
                <b>{row.rank}</b>
                <small>RANK</small>
              </span>
              <div className="season-team-ranking-main">
                <Link href={`${siteConfig.routes.teams}/${row.team.slug}`}>
                  {row.team.name}
                </Link>
                <span>{row.matchesPlayed}試合</span>
              </div>
              <PointValue points={row.points} />
              <dl className="season-team-ranking-detail">
                <div>
                  <dt>平均着順</dt>
                  <dd>{formatAveragePlacement(row.averagePlacement)}</dd>
                </div>
                <div>
                  <dt>1着</dt>
                  <dd>{row.firstPlaceCount}</dd>
                </div>
                <div>
                  <dt>2着</dt>
                  <dd>{row.secondPlaceCount}</dd>
                </div>
                <div>
                  <dt>3着</dt>
                  <dd>{row.thirdPlaceCount}</dd>
                </div>
                <div>
                  <dt>4着</dt>
                  <dd>{row.fourthPlaceCount}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ol>
      </section>

      <section className="section season-player-standings" aria-labelledby="player-standing-title">
        <div className="section-heading season-ranking-heading">
          <div>
            <span className="eyebrow">PLAYER STANDINGS</span>
            <h2 id="player-standing-title">個人成績</h2>
            <p>選手名を選ぶと、その選手のプロフィール・通算成績ページへ移動します。</p>
          </div>
        </div>

        <div className="season-player-table-wrap">
          <table className="season-player-table">
            <caption className="sr-only">
              Mリーグ{currentSeason}レギュラーシーズン個人成績
            </caption>
            <thead>
              <tr>
                <th scope="col">順位</th>
                <th scope="col">選手</th>
                <th scope="col">ポイント</th>
                <th scope="col">試合</th>
                <th scope="col">平均着順</th>
                <th scope="col">1着</th>
                <th scope="col">2着</th>
                <th scope="col">3着</th>
                <th scope="col">4着</th>
              </tr>
            </thead>
            <tbody>
              {rankedPlayers.map((row) => (
                <tr
                  key={row.player.id}
                  style={getTeamThemeStyle(row.team.id)}
                >
                  <td className="season-player-rank">{row.rank}</td>
                  <th scope="row">
                    <Link
                      className="season-player-link"
                      href={`${siteConfig.routes.players}/${row.player.slug}`}
                    >
                      <span aria-hidden="true" />
                      <span>
                        <strong>{row.player.displayName}</strong>
                        <small>{row.team.name}</small>
                      </span>
                    </Link>
                  </th>
                  <td>
                    <PointValue points={row.stats.points} />
                  </td>
                  <td>{row.stats.matchesPlayed}</td>
                  <td>{formatAveragePlacement(row.stats.averagePlacement)}</td>
                  <PlacementCells stats={row.stats} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="section" aria-labelledby="stats-reading-title">
        <div className="section-heading"><h2 id="stats-reading-title">成績を比較するときの読み方</h2></div>
        <p>このページはレギュラーシーズンの掲載データを集計しています。チームの半荘数・ポイント・着順回数は所属選手の値を合算し、平均着順は「1着回数＋2着回数×2＋3着回数×3＋4着回数×4」を半荘数で割っています。平均着順の単純平均ではありません。</p>
        <p>ポイント順位と平均着順は別の指標です。同じ着順でも素点でポイントが変わり、半荘数の少ない選手は数試合の影響を強く受けます。ここから選手の実力、放銃率、将来の勝率を断定することはできません。セミファイナル・ファイナルや別ルールの成績を混ぜず、同じ対象期間で比べてください。</p>
        <p>順位が必要点数にどうつながるかは<a className="text-link" href="/learn/guides/orasu-score-conditions">オーラスの逆転条件</a>で学び、<a className="text-link" href="/analysis/orasu-condition">条件計算ツール</a>で点差を入力して比較できます。ツールはMリーグの公式成績を再現する集計器ではありません。</p>
      </section>

      <aside className="season-ranking-source" aria-label="成績データの出典">
        <div>
          <strong>更新基準</strong>
          <p>
            {currentSeasonStatsProgressLabel}／
            {currentSeasonStatsVerifiedAt.replaceAll("-", ".")} 確認
          </p>
        </div>
        <ExternalLink className="text-link" href={currentSeasonStatsSourceUrl}>
          Mリーグ公式の成績表を見る
        </ExternalLink>
      </aside>
    </main>
  );
}
