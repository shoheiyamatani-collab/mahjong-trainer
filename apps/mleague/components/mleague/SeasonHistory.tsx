import { ExternalLink } from "@/components/ExternalLink";
import { formatVerifiedDate } from "@/lib/mleague/formatDate";
import type { Team, TeamMembership } from "@/types/mleague";

type SeasonHistoryProps = {
  memberships: TeamMembership[];
  teams: Team[];
};

export function SeasonHistory({ memberships, teams }: SeasonHistoryProps) {
  return (
    <>
      <section className="content-card content-section" aria-labelledby="membership-title">
        <h2 id="membership-title">シーズン別所属履歴</h2>
        {memberships.length > 0 ? (
          <div className="data-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>所属チーム</th>
                  <th>開始</th>
                  <th>終了</th>
                  <th>状態</th>
                  <th>確認</th>
                </tr>
              </thead>
              <tbody>
                {memberships.map((membership) => (
                  <tr key={membership.id}>
                    <td>
                      {teams.find((team) => team.id === membership.teamId)?.name ||
                        "未確認"}
                    </td>
                    <td>{membership.startSeason}</td>
                    <td>{membership.endSeason || "在籍中"}</td>
                    <td>{membership.status === "active" ? "在籍" : "終了"}</td>
                    <td>
                      <ExternalLink href={membership.sourceUrl}>
                        {formatVerifiedDate(membership.verifiedAt)}
                      </ExternalLink>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>所属履歴は準備中です。</p>
        )}
      </section>
    </>
  );
}
