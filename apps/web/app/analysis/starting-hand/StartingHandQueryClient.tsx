"use client";

import { useSearchParams } from "next/navigation";
import { TILE_NAMES, DEFAULT_STRATEGY_SETTINGS, type Counts34, type Wind } from "@mahjong-trainer/mahjong-core";
import {
  StartingHandAnalysisClient,
  type AnalysisRoleId,
  type RankingQuality,
  type RankingContext
} from "./StartingHandAnalysisClient";

type StartingHandQueryClientProps = {
  initialMode?: "ranking" | "single";
  initialRoleId?: AnalysisRoleId;
};

export function StartingHandQueryClient({ initialMode, initialRoleId }: StartingHandQueryClientProps) {
  const searchParams = useSearchParams();
  const rankingContext: RankingContext = {
    rank: parseOptionalNumber(searchParams.get("rank")),
    practicalTenpaiScore: parseOptionalNumber(searchParams.get("practicalTenpaiScore")),
    tenpaiRate: parseOptionalNumber(searchParams.get("tenpaiRate")),
    declarationRate: parseOptionalNumber(searchParams.get("declarationRate")),
    winRate: parseOptionalNumber(searchParams.get("winRate")),
    aiVersion: searchParams.get("aiVersion") ?? undefined,
    ruleVersion: searchParams.get("ruleVersion") ?? undefined
  };
  const hasRankingContext = rankingContext.rank != null
    || rankingContext.practicalTenpaiScore != null
    || rankingContext.tenpaiRate != null;

  return (
    <StartingHandAnalysisClient
      initialMode={initialMode}
      initialRoleId={initialRoleId}
      initialCounts={parseCounts(searchParams.get("hand"))}
      initialTrials={parseInteger(searchParams.get("trials"), initialMode === "single" ? 1_000 : 100, 1, 10_000)}
      initialSeed={parseInteger(searchParams.get("seed"), 20260718, 1, 2_147_483_647)}
      initialCacheKey={searchParams.get("cacheKey") ?? undefined}
      initialRankingQuality={parseRankingQuality(searchParams.get("quality"))}
      initialLowLoadMode={searchParams.get("lowLoad") === "1"}
      initialStrategySettings={{
        roundWind: parseWind(searchParams.get("roundWind"), DEFAULT_STRATEGY_SETTINGS.roundWind),
        seatWind: parseWind(searchParams.get("seatWind"), DEFAULT_STRATEGY_SETTINGS.seatWind),
        doraIndicator: TILE_NAMES.find((tile) => tile === searchParams.get("doraIndicator")) ?? null,
      }}
      initialMaxAdaptiveTrials={searchParams.get("maxAdaptiveTrials") === "3000" ? 3000 : 1000}
      autoRun={searchParams.get("autoRun") === "1"}
      dedicatedAnalysisTab={searchParams.get("analysisTab") === "1"}
      rankingContext={hasRankingContext ? rankingContext : undefined}
    />
  );
}

function parseCounts(value: string | null): Counts34 | undefined {
  if (!value) return undefined;
  const counts = value.split(",").map(Number);
  if (counts.length !== 34 || counts.some((count) => !Number.isInteger(count) || count < 0 || count > 4)) return undefined;
  return counts.reduce((sum, count) => sum + count, 0) === 13 ? counts : undefined;
}

function parseInteger(value: string | null, fallback: number, min: number, max: number): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= min && parsed <= max ? parsed : fallback;
}

function parseOptionalNumber(value: string | null): number | undefined {
  if (value == null || value === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function parseRankingQuality(value: string | null): RankingQuality | undefined {
  return value === "fast" || value === "adaptive" || value === "full" ? value : undefined;
}

function parseWind(value: string | null, fallback: Wind): Wind {
  return value === "東" || value === "南" || value === "西" || value === "北" ? value : fallback;
}
