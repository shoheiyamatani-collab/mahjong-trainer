import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink } from "@/components/ExternalLink";
import { UnofficialNotice } from "@/components/mleague/UnofficialNotice";
import { siteConfig } from "@/config/site";
import { currentSeasonStatsThrough } from "@/data/mleague/currentSeasonStats";
import {
  regularSeasonSchedule,
  regularSeasonScheduleSourceUrl,
  regularSeasonScheduleVerifiedAt,
  type RegularSeasonMatchDay,
  type ScheduleTeamId,
} from "@/data/mleague/regularSeasonSchedule";
import { teams } from "@/data/mleague/teams";
import { getTeamThemeStyle } from "@/lib/mleague/teamThemes";

export const metadata: Metadata = {
  title: "Mリーグ対局カレンダー｜2026-27シーズン",
  description:
    "Mリーグ2026-27レギュラーシーズンの対局日と対戦チームを月別カレンダーで確認できます。",
  alternates: { canonical: `${siteConfig.basePath}/calendar/` },
};

const calendarMonths = [
  { year: 2026, month: 9 },
  { year: 2026, month: 10 },
  { year: 2026, month: 11 },
  { year: 2026, month: 12 },
  { year: 2027, month: 1 },
  { year: 2027, month: 2 },
  { year: 2027, month: 3 },
] as const;

const weekdays = ["日", "月", "火", "水", "木", "金", "土"] as const;
const scheduleByDate: ReadonlyMap<string, RegularSeasonMatchDay> = new Map(
  regularSeasonSchedule.map((matchDay) => [matchDay.date, matchDay]),
);
const teamById = new Map(teams.map((team) => [team.id, team]));
const firstUpcomingDate = regularSeasonSchedule.find(
  (matchDay) => matchDay.date > currentSeasonStatsThrough,
)?.date;

const shortTeamNames: Record<ScheduleTeamId, string> = {
  "team-abemas": "ABEMAS",
  "team-fightclub": "麻雀格闘倶楽部",
  "team-drivens": "ドリブンズ",
  "team-furinkazan": "風林火山",
  "team-phoenix": "フェニックス",
  "team-sakuraknights": "サクラナイツ",
  "team-pirates": "Pirates",
  "team-raiden": "雷電",
  "team-beast": "BEAST X",
  "team-jets": "JETS",
};

function dateKey(year: number, month: number, day: number) {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function getMonthCells(year: number, month: number) {
  const leadingBlankCount = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();

  return [
    ...Array.from({ length: leadingBlankCount }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];
}

function TeamChip({ teamId }: { teamId: ScheduleTeamId }) {
  const team = teamById.get(teamId);
  if (!team) return null;

  return (
    <li style={getTeamThemeStyle(teamId)}>
      <Link
        href={`${siteConfig.routes.teams}/${team.slug}`}
        aria-label={`${team.name}のチームページを見る`}
        title={team.name}
      >
        <span aria-hidden="true" />
        {shortTeamNames[teamId]}
      </Link>
    </li>
  );
}

export default function MatchCalendarPage() {
  return (
    <main id="main-content" className="page-shell match-calendar-page">
      <header className="page-header match-calendar-header">
        <span className="eyebrow">2026-27 REGULAR SEASON</span>
        <h1 className="page-title">Mリーグ対局カレンダー</h1>
        <p className="page-lead">
          対局日と参加チームを月別に確認できます。同日に2卓ある日は、A卓・B卓を分けて掲載しています。
        </p>
        <div className="match-calendar-summary" aria-label="カレンダー概要">
          <div>
            <strong>{regularSeasonSchedule.length}</strong>
            <span>対局日</span>
          </div>
          <div>
            <strong>19:00</strong>
            <span>原則開始</span>
          </div>
          <div>
            <strong>9月–3月</strong>
            <span>掲載期間</span>
          </div>
        </div>
      </header>

      <UnofficialNotice />

      <nav className="calendar-month-nav" aria-label="月を選ぶ">
        {calendarMonths.map(({ year, month }) => (
          <a href={`#calendar-${year}-${month}`} key={`${year}-${month}`}>
            <small>{year}</small>
            <strong>{month}月</strong>
          </a>
        ))}
      </nav>

      <div className="calendar-legend" aria-label="表示の説明">
        <span><i className="is-next" />次回対局</span>
        <span><i className="is-upcoming" />今後の対局</span>
        <span><i className="is-finished" />終了した対局</span>
      </div>

      <div className="match-calendar-months">
        {calendarMonths.map(({ year, month }) => {
          const monthCells = getMonthCells(year, month);

          return (
            <section
              className="match-calendar-month"
              id={`calendar-${year}-${month}`}
              key={`${year}-${month}`}
              aria-labelledby={`calendar-title-${year}-${month}`}
            >
              <div className="calendar-month-heading">
                <div>
                  <span>{year}</span>
                  <h2 id={`calendar-title-${year}-${month}`}>{month}月</h2>
                </div>
                <span>MON / TUE / THU / FRI</span>
              </div>

              <div className="calendar-grid-wrap" tabIndex={0}>
                <div className="calendar-grid">
                  {weekdays.map((weekday, index) => (
                    <div
                      className={`calendar-weekday calendar-weekday-${index}`}
                      key={weekday}
                    >
                      {weekday}
                    </div>
                  ))}

                  {monthCells.map((day, cellIndex) => {
                    if (day === null) {
                      return <div className="calendar-day is-blank" key={`blank-${cellIndex}`} />;
                    }

                    const key = dateKey(year, month, day);
                    const matchDay = scheduleByDate.get(key);
                    const isFinished = key <= currentSeasonStatsThrough;
                    const isNext = key === firstUpcomingDate;
                    const dayOfWeek = new Date(Date.UTC(year, month - 1, day)).getUTCDay();

                    return (
                      <article
                        className={`calendar-day calendar-day-${dayOfWeek}${
                          matchDay ? " has-match" : ""
                        }${isFinished && matchDay ? " is-finished" : ""}${
                          isNext ? " is-next" : ""
                        }`}
                        key={key}
                      >
                        <div className="calendar-day-heading">
                          <time dateTime={key}>{day}</time>
                          {matchDay ? (
                            <span>{isNext ? "NEXT" : isFinished ? "終了" : "19:00"}</span>
                          ) : null}
                        </div>

                        {matchDay ? (
                          <div className="calendar-match-tables">
                            {matchDay.tables.map((table, tableIndex) => (
                              <section
                                className="calendar-match-table"
                                key={`${key}-${tableIndex}`}
                                aria-label={`${month}月${day}日 ${
                                  matchDay.tables.length > 1
                                    ? `${tableIndex === 0 ? "A" : "B"}卓`
                                    : "対局"
                                }`}
                              >
                                <b>
                                  {matchDay.tables.length > 1
                                    ? `${tableIndex === 0 ? "A" : "B"}卓`
                                    : "対局"}
                                </b>
                                <ul>
                                  {table.map((teamId) => (
                                    <TeamChip teamId={teamId} key={teamId} />
                                  ))}
                                </ul>
                              </section>
                            ))}
                          </div>
                        ) : (
                          <span className="calendar-no-match">—</span>
                        )}
                      </article>
                    );
                  })}
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <aside className="calendar-source" aria-label="日程の出典">
        <div>
          <strong>日程データ</strong>
          <p>
            Mリーグ公式サイトを
            {regularSeasonScheduleVerifiedAt.replaceAll("-", ".")}に確認。日程は変更される場合があります。
          </p>
        </div>
        <div className="calendar-source-links">
          <ExternalLink className="text-link" href={regularSeasonScheduleSourceUrl}>
            Mリーグ公式日程
          </ExternalLink>
          <ExternalLink className="text-link" href="https://abema.tv/now-on-air/mahjong">
            ABEMA麻雀チャンネル
          </ExternalLink>
        </div>
      </aside>
    </main>
  );
}
