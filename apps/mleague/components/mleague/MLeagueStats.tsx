import { formatVerifiedDate } from "@/lib/mleague/formatDate";
import type { PlayerCareerStats, SeasonResult } from "@/types/mleague";

const allSeasons = [
  "2025-26",
  "2024-25",
  "2023-24",
  "2022-23",
  "2021-22",
  "2020-21",
  "2019-20",
  "2018-19",
];

function formatPoints(value: number, fractionDigits = 1) {
  const amount = new Intl.NumberFormat("ja-JP", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);

  return `${value > 0 ? "+" : ""}${amount}`;
}

function formatRate(value: number | null) {
  return value === null ? "—" : `${value.toFixed(1)}%`;
}

function getPointTone(value: number) {
  if (value > 0) return "is-positive";
  if (value < 0) return "is-negative";
  return "is-neutral";
}

type MLeagueStatsProps = {
  stats?: PlayerCareerStats;
  results: SeasonResult[];
};

export function MLeagueStats({ stats, results }: MLeagueStatsProps) {
  if (!stats) return null;

  const resultsBySeason = new Map(results.map((result) => [result.season, result]));

  return (
    <section
      className="content-card content-section mleague-stats"
      aria-labelledby="mleague-stats-title"
    >
      <div className="mleague-stats-heading">
        <div>
          <span className="eyebrow">REGULAR SEASON</span>
          <h2 id="mleague-stats-title">Mリーグ成績</h2>
        </div>
        <span className="mleague-stats-period">{stats.period}</span>
      </div>

      <div className="career-scoreboard">
        <div className="career-points">
          <span>通算ポイント</span>
          <strong className={getPointTone(stats.totalPoints)}>
            {formatPoints(stats.totalPoints)}
            <small> pt</small>
          </strong>
        </div>
        <dl className="career-primary-stats">
          <div>
            <dt>半荘数</dt>
            <dd>{stats.matchesPlayed}</dd>
          </div>
          <div>
            <dt>平均着順</dt>
            <dd>{stats.averagePlacement?.toFixed(3) ?? "—"}</dd>
          </div>
          <div>
            <dt>pt / 半荘</dt>
            <dd className={getPointTone(stats.pointsPerMatch ?? 0)}>
              {stats.pointsPerMatch === null
                ? "—"
                : formatPoints(stats.pointsPerMatch, 2)}
            </dd>
          </div>
        </dl>
      </div>

      <dl className="career-detail-grid">
        <div><dt>1着</dt><dd>{stats.firstPlaceCount}回</dd></div>
        <div><dt>2着</dt><dd>{stats.secondPlaceCount}回</dd></div>
        <div><dt>3着</dt><dd>{stats.thirdPlaceCount}回</dd></div>
        <div><dt>4着</dt><dd>{stats.fourthPlaceCount}回</dd></div>
        <div><dt>TOP率</dt><dd>{formatRate(stats.topRate)}</dd></div>
        <div><dt>連対率</dt><dd>{formatRate(stats.topTwoRate)}</dd></div>
        <div><dt>ラス回避率</dt><dd>{formatRate(stats.lastAvoidanceRate)}</dd></div>
      </dl>

      <div className="season-stats-heading">
        <h3>シーズン別成績</h3>
        <span>新しいシーズンから表示</span>
      </div>
      <div className="data-table-wrap performance-table-wrap">
        <table className="data-table performance-table">
          <thead>
            <tr>
              <th>シーズン</th>
              <th>半荘数</th>
              <th>ポイント</th>
            </tr>
          </thead>
          <tbody>
            {allSeasons.map((season) => {
              const result = resultsBySeason.get(season);

              return (
                <tr key={season}>
                  <td>{season}</td>
                  <td>{result?.matchesPlayed ?? "—"}</td>
                  <td className={result ? getPointTone(result.regularSeasonPoints ?? 0) : undefined}>
                    {result?.regularSeasonPoints === undefined
                      ? "出場なし"
                      : `${formatPoints(result.regularSeasonPoints)} pt`}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {stats.notes.length > 0 ? (
        <ul className="mleague-stats-notes">
          {stats.notes.map((note) => <li key={note}>{note}</li>)}
        </ul>
      ) : null}
      <p className="mleague-stats-source">
        出典：{stats.sourceLabel} ／ 資料確認 {formatVerifiedDate(stats.verifiedAt)}
      </p>
    </section>
  );
}
