import type { HandScoreMeld, OrasuConditionInput, Tile } from "@mahjong-trainer/mahjong-core";
import type { LearningGuideSection } from "../guideData";

export type StudyHand = {
  label: string;
  tiles: string;
  melds?: HandScoreMeld[];
  discards?: Tile[];
  compareChiitoitsu?: boolean;
  expectedShanten?: number;
  expectedWaits?: Tile[];
  score?: { winningTile: Tile; dora?: number; dealer?: boolean; expectedRon?: [number | null, number] };
};

export type StudyCase = {
  id: string;
  title: string;
  situation: string;
  hands?: StudyHand[];
  rivers?: { label: string; tiles: Tile[]; marks?: ("手" | "ツ" | "リーチ")[] }[];
  visible?: string;
  orasu?: OrasuConditionInput;
  drawTenpaiSeats?: ("east" | "south" | "west" | "north")[];
  transitions?: { from: number; to: number; draw: Tile; discard: Tile }[];
  branches?: { from: number; to: number; firstDiscard: Tile; draw: Tile; discard: Tile }[];
  options: { label: string; reason: string }[];
  facts?: string[];
  conclusion: string;
};

export type PracticalArticleSpec = {
  number: number;
  priority: "S" | "A" | "B";
  slug: string;
  title: string;
  description: string;
  lead: string;
  category: "decision" | "defense" | "scoring";
  keywords: string;
  distinction: string;
  points: string[];
  sections: LearningGuideSection[];
  cases: StudyCase[];
  mistakes: string[];
  application: string[];
  limit: string;
  tools: { href: string; label: string; description: string }[];
  related: string[];
};
