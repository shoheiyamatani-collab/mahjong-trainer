import type { Metadata } from "next";
import { type Counts34 } from "@mahjong-trainer/mahjong-core";
import { StartingHandAnalysisClient } from "./StartingHandAnalysisClient";

export const metadata: Metadata = {
  title: "手役何狙う？チェッカー | 配牌分析",
  description: "13枚の配牌から7つの手役とリーチ戦略を独立シミュレーションし、実戦テンパイスコアを比較します。",
};

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function StartingHandAnalysisPage({ searchParams }: PageProps) {
  const query = await searchParams;
  return (
    <StartingHandAnalysisClient
      initialCounts={parseCounts(single(query.hand))}
      initialTrials={parseInteger(single(query.trials), 1_000, 1, 10_000)}
      initialSeed={parseInteger(single(query.seed), 20260718, 1, 2_147_483_647)}
      initialCacheKey={single(query.cacheKey)}
    />
  );
}

function parseCounts(value: string | undefined): Counts34 | undefined {
  if (!value) return undefined;
  const counts = value.split(",").map(Number);
  if (counts.length !== 34 || counts.some((count) => !Number.isInteger(count) || count < 0 || count > 4)) return undefined;
  return counts.reduce((sum, count) => sum + count, 0) === 13 ? counts : undefined;
}

function single(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function parseInteger(value: string | undefined, fallback: number, min: number, max: number): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= min && parsed <= max ? parsed : fallback;
}
