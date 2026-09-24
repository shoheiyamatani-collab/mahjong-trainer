import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { recentClips } from "@/app/clips/recent-clips";
import {
  memorableClips,
  yakumanClips,
} from "@/app/clips/highlights/highlight-clips";
import { ExternalLink } from "@/components/ExternalLink";
import { PlayerSources } from "@/components/mleague/PlayerSources";
import { TeamMemberList } from "@/components/mleague/TeamMemberList";
import { UnofficialNotice } from "@/components/mleague/UnofficialNotice";
import { siteConfig } from "@/config/site";
import {
  getTeamEditorialProfile,
  getTeamSeasonSummaries,
  teamHistorySources,
} from "@/data/mleague/teamProfiles";
import { teams } from "@/data/mleague/teams";
import { playerVideoGuides } from "@/data/mleague/videoGuides";
import { formatVerifiedDate } from "@/lib/mleague/formatDate";
import { isCurrentMembership } from "@/lib/mleague/getPlayers";
import { getTeamBySlug } from "@/lib/mleague/getTeamBySlug";
import { getTeamThemeStyle } from "@/lib/mleague/teamThemes";

type TeamPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return teams
    .filter((team) => team.publicationStatus === "published")
    .map((team) => ({ slug: team.slug }));
}

export async function generateMetadata({ params }: TeamPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = getTeamBySlug(slug);
  return result
    ? {
        title: `${result.team.name}｜所属選手・沿革・シーズン成績`,
        description: `${result.team.name}の所属選手、チームの特徴、沿革、シーズン別最終順位、メンバーの加入・退団の変遷を公式情報に基づいて紹介します。`,
      }
    : { title: "チームが見つかりません" };
}

export default async function TeamPage({ params }: TeamPageProps) {
  const { slug } = await params;
  const result = getTeamBySlug(slug);
  if (!result) notFound();

  const profile = getTeamEditorialProfile(result.team.id);
  if (!profile) notFound();

  const seasonSummaries = getTeamSeasonSummaries(result.team.id);
  const latestSeason = seasonSummaries.at(-1);
  const sources = [...result.team.sources, ...teamHistorySources].filter(
    (source, index, allSources) =>
      allSources.findIndex((candidate) => candidate.url === source.url) === index,
  );
  const currentPlayerIds = new Set(
    result.memberships.filter(isCurrentMembership).map((membership) => membership.playerId),
  );
  const currentPlayers = result.players.filter((player) => currentPlayerIds.has(player.id));
  const teamVideoGuides = currentPlayers.flatMap((player) =>
    (playerVideoGuides[player.slug] ?? []).map((guide) => ({
      ...guide,
      playerName: player.displayName,
    })),
  );
  const normalizeName = (value: string) => value.replace(/\s/g, "");
  const currentPlayerNames = currentPlayers.map((player) => normalizeName(player.displayName));
  const teamHighlights = [...recentClips, ...yakumanClips, ...memorableClips]
    .filter((clip, index, clips) => clips.findIndex((candidate) => candidate.id === clip.id) === index)
    .filter((clip) => {
      const searchableText = normalizeName(
        `${clip.title} ${clip.summary ?? ""} ${clip.competition ?? ""}`,
      );
      return currentPlayerNames.some((playerName) => searchableText.includes(playerName));
    })
    .slice(0, 4);

  return (
    <main
      id="main-content"
      className="page-shell team-profile-page"
      style={getTeamThemeStyle(result.team.id)}
    >
      <header className="page-header">
        <span className="eyebrow">TEAM PROFILE</span>
        <h1 className="page-title">{result.team.name}</h1>
        <p className="page-lead">{result.team.description || "説明を準備中です。"}</p>
        <div className="link-row">
          <ExternalLink className="button" href={result.team.officialWebsiteUrl}>
            公式情報を確認
          </ExternalLink>
          <Link className="button-secondary" href={siteConfig.routes.teams}>
            チーム一覧へ
          </Link>
        </div>
      </header>
      <UnofficialNotice />

      <section className="content-card content-section section team-overview" aria-labelledby="team-overview-title">
        <div className="team-section-heading">
          <span className="eyebrow">TEAM GUIDE</span>
          <h2 id="team-overview-title">{result.team.name}とは</h2>
        </div>
        <dl className="team-fact-grid">
          <div>
            <dt>参戦</dt>
            <dd>{profile.foundedSeason}シーズン</dd>
          </div>
          <div>
            <dt>オーナー</dt>
            <dd>{profile.owner}</dd>
          </div>
          <div>
            <dt>優勝</dt>
            <dd>
              {profile.championshipSeasons.length > 0
                ? `${profile.championshipSeasons.length}回`
                : "未達成"}
            </dd>
          </div>
          <div>
            <dt>直近の最終順位</dt>
            <dd>
              {latestSeason
                ? `${latestSeason.season} ${latestSeason.finalRank}位`
                : "記録なし"}
            </dd>
          </div>
        </dl>
        <div className="team-editorial-copy">
          {profile.characteristics.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="section">
        <TeamMemberList
          players={result.players}
          memberships={result.memberships}
        />
      </section>

      <section className="content-card content-section section" aria-labelledby="team-season-review-title">
        <div className="team-section-heading">
          <span className="eyebrow">SEASON FOCUS</span>
          <h2 id="team-season-review-title">注目シーズンを振り返る</h2>
        </div>
        <p>
          順位表だけでは分かりにくい転機を、チーム編成や前後の結果と合わせて振り返ります。
        </p>
        <div className="team-season-review-grid">
          {profile.seasonReviews.map((review) => (
            <article key={`${review.season}-${review.title}`} className="team-season-review">
              <span>{review.season}</span>
              <h3>{review.title}</h3>
              <p>{review.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="content-card content-section section" aria-labelledby="team-results-title">
        <div className="team-section-heading">
          <span className="eyebrow">SEASON RESULTS</span>
          <h2 id="team-results-title">シーズン別成績</h2>
        </div>
        <p>
          各シーズンのレギュラー、セミファイナル、ファイナルを通した最終順位です。
          ステージ途中の順位ではなく、公式発表のシーズン最終結果を掲載しています。
        </p>
        <div className="data-table-wrap team-results-table-wrap">
          <table className="data-table team-results-table">
            <caption>{result.team.name}のシーズン別最終成績</caption>
            <thead>
              <tr>
                <th scope="col">シーズン</th>
                <th scope="col">最終順位</th>
                <th scope="col">到達ステージ</th>
              </tr>
            </thead>
            <tbody>
              {seasonSummaries.map((season) => (
                <tr key={season.season}>
                  <th scope="row">{season.season}</th>
                  <td>
                    <strong>{season.finalRank}位</strong>
                    <span className="team-rank-total"> / {season.teamCount}チーム</span>
                  </td>
                  <td>{season.resultLabel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="team-history-grid section">
        <section className="content-card content-section" aria-labelledby="team-history-title">
          <div className="team-section-heading">
            <span className="eyebrow">HISTORY</span>
            <h2 id="team-history-title">チームの沿革</h2>
          </div>
          <ol className="team-timeline">
            {profile.milestones.map((milestone) => (
              <li key={`${milestone.season}-${milestone.title}`}>
                <span className="team-timeline-season">{milestone.season}</span>
                <div>
                  <h3>{milestone.title}</h3>
                  <p>{milestone.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="content-card content-section" aria-labelledby="team-roster-title">
          <div className="team-section-heading">
            <span className="eyebrow">ROSTER HISTORY</span>
            <h2 id="team-roster-title">所属選手の変遷</h2>
          </div>
          <ol className="team-timeline">
            {profile.rosterChanges.map((change) => (
              <li key={`${change.season}-${change.title}`}>
                <span className="team-timeline-season">{change.season}</span>
                <div>
                  <h3>{change.title}</h3>
                  <p>{change.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>

      {teamVideoGuides.length > 0 || teamHighlights.length > 0 ? (
        <section className="content-card content-section section" aria-labelledby="team-watch-title">
          <div className="team-section-heading">
            <span className="eyebrow">WATCH THE TEAM</span>
            <h2 id="team-watch-title">所属プロの思考と対局を見る</h2>
          </div>
          <p>
            選手自身の実戦解説と公式ハイライトを、現在の所属メンバーに合わせてまとめています。
            成績と動画を行き来すると、数字だけでは見えない判断や打ち筋を確認できます。
          </p>
          <div className="team-media-columns">
            {teamVideoGuides.length > 0 ? (
              <div className="team-media-group">
                <h3>プロの実戦解説</h3>
                <ul className="team-media-list">
                  {teamVideoGuides.map((guide) => (
                    <li key={guide.href}>
                      <span>{guide.playerName}</span>
                      <a href={guide.href}>{guide.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {teamHighlights.length > 0 ? (
              <div className="team-media-group">
                <h3>代表的な対局・ハイライト</h3>
                <ul className="team-media-list">
                  {teamHighlights.map((clip) => (
                    <li key={clip.id}>
                      <span>{clip.tag}</span>
                      <ExternalLink href={clip.url}>{clip.title}</ExternalLink>
                      <small>{clip.channel}</small>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      <section className="content-card content-section section" aria-labelledby="team-related-title">
        <div className="team-section-heading">
          <span className="eyebrow">KEEP EXPLORING</span>
          <h2 id="team-related-title">成績と対局をさらに見る</h2>
        </div>
        <p>
          チームの順位だけでなく、所属選手の個人成績や最近の対局動画も合わせて見ると、
          シーズンごとの変化をより具体的に追えます。
        </p>
        <nav className="team-related-links" aria-label={`${result.team.name}の関連ページ`}>
          <Link href={siteConfig.routes.stats}>今季のチーム・個人成績</Link>
          <Link href={siteConfig.routes.players}>所属選手から探す</Link>
          <Link href={siteConfig.routes.calendar}>試合日程を見る</Link>
          <Link href={siteConfig.routes.highlightClips}>ハイライト動画を見る</Link>
        </nav>
      </section>

      <PlayerSources sources={sources} />
      <p className="verified-date">
        チーム情報の最終確認 {formatVerifiedDate(result.team.lastVerifiedAt)}
      </p>
    </main>
  );
}
