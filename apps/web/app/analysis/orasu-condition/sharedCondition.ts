import { ORASU_SEATS, validateOrasuConditionInput, type OrasuConditionInput, type OrasuScores, type OrasuSeat, type OrasuTargetRank } from "@mahjong-trainer/mahjong-core";

export function orasuConditionHref(input: OrasuConditionInput) {
  const query = new URLSearchParams({ scores: ORASU_SEATS.map((seat) => input.scores[seat]).join(","), self: input.selfSeat, target: String(input.targetRank), honba: String(input.honba), sticks: String(input.riichiSticks), tie: input.tiePolicy });
  return `/analysis/orasu-condition?${query}#orasu-calculator`;
}

export function parseSharedOrasuCondition(query: URLSearchParams): OrasuConditionInput | null {
  const rawScores = query.get("scores");
  if (!rawScores || !/^\d{1,7}(,\d{1,7}){3}$/.test(rawScores)) return null;
  const values = rawScores.split(",").map(Number);
  const selfSeat = query.get("self") as OrasuSeat;
  const targetRank = Number(query.get("target")) as OrasuTargetRank;
  const honba = Number(query.get("honba"));
  const riichiSticks = Number(query.get("sticks"));
  const tiePolicy = query.get("tie");
  if (tiePolicy !== "strict" && tiePolicy !== "allow") return null;
  const input: OrasuConditionInput = { scores: Object.fromEntries(ORASU_SEATS.map((seat, index) => [seat, values[index]!])) as OrasuScores, selfSeat, dealerSeat: "east", targetRank, honba, riichiSticks, tiePolicy };
  if (validateOrasuConditionInput(input).length || values.some((value) => value > 1000000) || honba > 1000 || riichiSticks > 1000) return null;
  return input;
}
