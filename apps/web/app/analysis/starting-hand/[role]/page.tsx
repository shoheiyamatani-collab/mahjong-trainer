import type { Metadata } from "next";
import { type Counts34 } from "@mahjong-trainer/mahjong-core";
import {
  StartingHandAnalysisClient,
  type AnalysisRoleId,
  type RankingContext,
} from "../StartingHandAnalysisClient";

const ROLE_IDS: AnalysisRoleId[] = [
  "chanta", "flush", "chiitoitsu", "ikkitsuukan", "toitoi", "pinfu", "tanyao", "sanshoku", "riichi",
];

const ROLE_NAMES: Record<AnalysisRoleId, string> = {
  chanta: "チャンタ",
  flush: "染め手",
  chiitoitsu: "七対子",
  ikkitsuukan: "一気通貫",
  toitoi: "対々和",
  pinfu: "平和",
  tanyao: "タンヤオ",
  sanshoku: "三色同順",
  riichi: "リーチ",
};

type PageProps = {
  params: Promise<{ role: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export function generateStaticParams() {
  return ROLE_IDS.map((role) => ({ role }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const role = normalizeRole((await params).role);
  return {
    title: `${ROLE_NAMES[role]}AI単独分析 | 配牌分析`,
    description: `入力した13枚の配牌から${ROLE_NAMES[role]}AIを単独でシミュレーションします。`,
  };
}

export default async function StartingHandRolePage({ params, searchParams }: PageProps) {
  const role = normalizeRole((await params).role);
  const query = await searchParams;
  const initialCounts = parseCounts(single(query.hand));
  const initialTrials = parseInteger(single(query.trials), 1_000, 1, 10_000);
  const initialSeed = parseInteger(single(query.seed), 20260718, 1, 2_147_483_647);
  const rankingContext: RankingContext = {
    rank: parseOptionalNumber(single(query.rank)),
    practicalTenpaiScore: parseOptionalNumber(single(query.practicalTenpaiScore)),
    tenpaiRate: parseOptionalNumber(single(query.tenpaiRate)),
    declarationRate: parseOptionalNumber(single(query.declarationRate)),
    winRate: parseOptionalNumber(single(query.winRate)),
    aiVersion: single(query.aiVersion),
    ruleVersion: single(query.ruleVersion),
  };
  const hasRankingContext = rankingContext.rank != null
    || rankingContext.practicalTenpaiScore != null
    || rankingContext.tenpaiRate != null;
  return (
    <StartingHandAnalysisClient
      initialMode="single"
      initialRoleId={role}
      initialCounts={initialCounts}
      initialTrials={initialTrials}
      initialSeed={initialSeed}
      initialCacheKey={single(query.cacheKey)}
      rankingContext={hasRankingContext ? rankingContext : undefined}
    />
  );
}

function normalizeRole(value: string): AnalysisRoleId {
  return ROLE_IDS.includes(value as AnalysisRoleId) ? value as AnalysisRoleId : "chanta";
}

function parseCounts(value: string | undefined): Counts34 | undefined {
  if (!value) return undefined;
  const counts = value.split(",").map(Number);
  if (counts.length !== 34 || counts.some((count) => !Number.isInteger(count) || count < 0 || count > 4)) return undefined;
  if (counts.reduce((sum, count) => sum + count, 0) !== 13) return undefined;
  return counts;
}

function single(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function parseInteger(value: string | undefined, fallback: number, min: number, max: number): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= min && parsed <= max ? parsed : fallback;
}

function parseOptionalNumber(value: string | undefined): number | undefined {
  if (value == null || value === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}
