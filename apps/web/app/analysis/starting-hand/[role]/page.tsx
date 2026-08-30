import type { Metadata } from "next";
import { Suspense } from "react";
import { StartingHandAnalysisClient, type AnalysisRoleId } from "../StartingHandAnalysisClient";
import { StartingHandQueryClient } from "../StartingHandQueryClient";

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

export default async function StartingHandRolePage({ params }: PageProps) {
  const role = normalizeRole((await params).role);
  return (
    <Suspense fallback={<StartingHandAnalysisClient initialMode="single" initialRoleId={role} />}>
      <StartingHandQueryClient initialMode="single" initialRoleId={role} />
    </Suspense>
  );
}

function normalizeRole(value: string): AnalysisRoleId {
  return ROLE_IDS.includes(value as AnalysisRoleId) ? value as AnalysisRoleId : "chanta";
}
