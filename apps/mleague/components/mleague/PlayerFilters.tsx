"use client";

import { gojuonRows } from "@/lib/mleague/filters";
import type { PlayerFilterValues } from "@/types/mleague";

type FilterOptions = {
  teams: { id: string; name: string }[];
  associations: string[];
  debutSeasons: string[];
};

type PlayerFiltersProps = {
  filters: PlayerFilterValues;
  options: FilterOptions;
  onChange: (next: PlayerFilterValues) => void;
  onReset: () => void;
};

export function PlayerFilters({
  filters,
  options,
  onChange,
  onReset,
}: PlayerFiltersProps) {
  const update = (key: keyof PlayerFilterValues, value: string) =>
    onChange({ ...filters, [key]: value });

  return (
    <section className="filter-panel" id="filters" aria-labelledby="filter-title">
      <div className="section-heading">
        <div>
          <h2 id="filter-title">選手を絞り込む</h2>
          <p>名前・読み・所属情報を組み合わせて検索できます。</p>
        </div>
      </div>
      <div className="filter-grid">
        <div className="field">
          <label htmlFor="player-name">名前で検索</label>
          <input
            id="player-name"
            type="search"
            value={filters.nameQuery}
            onChange={(event) => update("nameQuery", event.target.value)}
            placeholder="例：多井"
            autoComplete="off"
          />
        </div>
        <div className="field">
          <label htmlFor="player-kana">読み仮名で検索</label>
          <input
            id="player-kana"
            type="search"
            value={filters.kanaQuery}
            onChange={(event) => update("kanaQuery", event.target.value)}
            placeholder="例：おおい"
            autoComplete="off"
          />
        </div>
        <div className="field">
          <label htmlFor="player-team">チーム</label>
          <select
            id="player-team"
            value={filters.teamId}
            onChange={(event) => update("teamId", event.target.value)}
          >
            <option value="">すべてのチーム</option>
            {options.teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="player-association">所属プロ団体</label>
          <select
            id="player-association"
            value={filters.association}
            onChange={(event) => update("association", event.target.value)}
          >
            <option value="">すべての所属団体</option>
            {options.associations.map((association) => (
              <option key={association} value={association}>
                {association}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="player-debut">Mリーグ加入シーズン</label>
          <select
            id="player-debut"
            value={filters.debutSeason}
            onChange={(event) => update("debutSeason", event.target.value)}
          >
            <option value="">すべてのシーズン</option>
            {options.debutSeasons.map((season) => (
              <option key={season} value={season}>
                {season}
              </option>
            ))}
          </select>
        </div>
      </div>
      <fieldset className="field gojuon-field">
        <legend>五十音</legend>
        <div className="gojuon-list">
          {gojuonRows.map((row) => (
            <button
              key={row}
              type="button"
              aria-pressed={filters.gojuon === row}
              onClick={() => update("gojuon", filters.gojuon === row ? "" : row)}
            >
              {row}
            </button>
          ))}
        </div>
      </fieldset>
      <div className="filter-actions">
        <button className="button-secondary" type="button" onClick={onReset}>
          条件をリセット
        </button>
      </div>
    </section>
  );
}
