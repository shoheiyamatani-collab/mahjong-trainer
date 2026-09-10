import { SUITS, tileIndex } from "../tiles";
import { SUIT_LABELS } from "./features";
import type { HandFeatures, StrategyCategory, StrategyEvaluation, StrategyEvidence } from "./types";
import type { HandTargetRankingRoleId } from "../startingHandRanking";

export const STRATEGY_RECOMMENDATION_VERSION = "strategy-recommendation-1.0.0";
// Pedagogical weights, not fitted win probabilities. Keep the formula and limitations in the help page.
export const STRATEGY_SCORE_WEIGHTS = {
  speedScore: 0.22, winRateScore: 0.15, valueScore: 0.1, shapeScore: 0.1,
  flexibilityScore: 0.1, callScore: 0.05, yakuScore: 0.08, suitabilityScore: 0.2,
} as const;
export const normalizeStrategyScore = (value: number) => Math.round(Math.max(0, Math.min(100, value)) * 10) / 10;

export function winRateInterval(wins: number, trials: number): { lower: number; upper: number; error: number } {
  if (trials <= 0) return { lower: 0, upper: 1, error: 1 };
  const p = Math.max(0, Math.min(1, wins / trials));
  const z2 = 1.96 ** 2;
  const center = (p + z2 / (2 * trials)) / (1 + z2 / trials);
  const half = 1.96 * Math.sqrt(p * (1 - p) / trials + z2 / (4 * trials ** 2)) / (1 + z2 / trials);
  return { lower: Math.max(0, center - half), upper: Math.min(1, center + half), error: Math.max(p - (center - half), center + half - p) };
}

interface Candidate {
  id: string; name: string; category: StrategyCategory; role?: HandTargetRankingRoleId;
  suitability: number; distance: number; han: number; shape: number; flexibility: number; call: number;
  loss?: number; penalty?: number; reasons: string[]; cautions: string[]; branch: string;
}

export function evaluateStrategies(features: HandFeatures, evidence: StrategyEvidence = {}): StrategyEvaluation[] {
  const f = features;
  const n = f.normalShanten;
  const ordinaryDistance = Math.min(n, f.chiitoitsuShanten);
  const baseShape = normalizeStrategyScore(30 + f.blocks.ryanmen * 19 + f.blocks.sequences * 7 - f.blocks.penchan * 6 - f.blocks.kanchan * 3);
  const baseFlex = normalizeStrategyScore(45 + f.fiveBlockCoverage * 6 + f.blocks.ryanmen * 7 - f.blocks.isolated * 3);
  const candidates: Candidate[] = [];
  const add = (candidate: Candidate) => candidates.push(candidate);
  const hasNonValueHead = f.counts.some((count, i) => count >= 2 && !f.yakuhai.some((seed) => tileIndex(seed.tile) === i));
  const pinfuNatural = f.blocks.ryanmen >= 1 && f.blocks.sequences >= 1 && f.tripletKinds === 0 && hasNonValueHead;
  const iipeikouPotential = Math.min(1, f.iipeikouSeeds);
  add({
    id: "closed", name: f.terminalHonorCount <= 2 ? "門前リーチ・タンヤオ" : "門前リーチ・良形", category: "closed", role: "riichi",
    suitability: 82 - n * 7 + f.blocks.ryanmen * 4 + Math.min(8, f.normalUkeire / 6) + f.doraCount * 4 - Math.max(0, n - f.chiitoitsuShanten) * 12,
    distance: n, han: 1 + Number(f.terminalHonorCount <= 2) + Number(pinfuNatural) * 0.5 + iipeikouPotential * 0.5 + f.doraCount,
    shape: baseShape, flexibility: baseFlex, call: 0,
    reasons: [`通常手は${shantenLabel(n)}、受け入れは最大${f.normalUkeire}枚です。`, `両面候補${f.blocks.ryanmen}組と完成順子${f.blocks.sequences}組を利用できます。`,
      ...(f.doraCount > 0 ? [`ドラ${f.doraCount}枚を手役に縛られず使えます。`] : []),
      ...(pinfuNatural ? ["良形リーチを目指す過程で平和も自然についてきやすい形です。"] : []),
      ...(iipeikouPotential ? ["同色の連続した対子があり、一盃口も自然に残せる種があります。"] : [])],
    cautions: f.yakuhai.some((seed) => seed.count === 2) ? ["役牌を雀頭にすると平和は付かないため、平和を前提にしません。"] : ["両面の種は完成形ではないため、ツモに合わせて残すブロックを選びます。"],
    branch: "三色や一通が整えば手役を加え、整わなければ受け入れを優先してリーチへ進めます。",
  });
  const yakuhaiStrength = f.yakuhai.reduce((sum, seed) => sum + (seed.count >= 3 ? 52 : seed.count === 2 ? (seed.live > 0 ? 37 : 12) : seed.count === 1 && seed.live > 0 ? 8 : 0) * (1 + 0.25 * (seed.han - 1)), 0);
  const strongValue = f.yakuhai.filter((seed) => seed.count >= 2);
  add({
    id: "yakuhai", name: strongValue.length ? `${strongValue.map((seed) => seed.tile).join("・")}から役牌速攻` : "役牌速攻", category: "yakuhai",
    suitability: yakuhaiStrength + (strongValue.length ? 30 - n * 3 + f.doraCount * 6 : 0),
    distance: n + (f.valueTripletKinds ? 0 : f.valuePairKinds ? 0.5 : 2),
    han: Math.max(1, ...strongValue.map((seed) => seed.han)) + f.doraCount, shape: baseShape, flexibility: 86, call: Math.min(100, yakuhaiStrength * 1.4),
    penalty: strongValue.length ? 0 : 14,
    reasons: [...(strongValue.length ? strongValue.map((seed) => `${seed.tile}が${seed.count >= 3 ? "暗刻" : "対子"}。${seed.han === 2 ? "場風と自風を兼ね、刻子なら2翻です。" : "刻子にできれば役が確保できます。"}`)
      : [f.valueHonorCount ? `役牌を${f.valueHonorCount}枚持ち、重なりから鳴く分岐があります。` : "現時点では役牌がなく、重なりを待つ必要があります。"]),
      `通常手は${shantenLabel(n)}で、ドラ${f.doraCount}枚を残す進行も比較できます。`],
    cautions: ["鳴くと門前リーチ・平和・七対子は使えなくなります。", ...(strongValue.some((seed) => seed.count === 2 && seed.live === 0) ? ["役牌の残り牌がなく、対子を刻子にする経路がありません。"] : [])],
    branch: f.pairKinds >= 3 ? "役牌ポンで進めるなら対々和、鳴かず対子が増えるなら七対子も比較します。" : "役牌をポンできても、残る面子が進むか確認してから鳴きます。",
  });
  for (const seed of f.sanshoku) {
    const missing = 9 - seed.coverage;
    const distance = Math.max(n, missing - 1);
    const ranks = `${seed.start}${seed.start + 1}${seed.start + 2}`;
    // Nine mandatory tiles leave only five slots for the other meld and head.
    const outsideTiles = 13 - seed.tilesBySuit.flat().reduce((sum, tile) => sum + f.counts[tileIndex(tile)]!, 0);
    const doraInRun = f.dora != null && tileIndex(f.dora) < 27 && tileIndex(f.dora) % 9 >= seed.start - 1 && tileIndex(f.dora) % 9 <= seed.start + 1;
    const loss = doraInRun ? 0 : f.doraCount * Math.min(1, Math.max(0, outsideTiles - 5) / 4);
    add({
      id: `sanshoku-${seed.start}`, name: `${ranks}三色`, category: "sequences", role: "sanshoku",
      suitability: seed.coverage * 9 + seed.weakestSuitCount * 8 - 28,
      distance, han: 2 + f.doraCount - loss, shape: baseShape - missing * 3, flexibility: baseFlex - missing * 6, call: seed.completeSuitCount * 14 + seed.weakestSuitCount * 10,
      loss, penalty: Math.max(0, distance - n) * 9 + (n <= 1 ? missing * 4 : missing * 2),
      reasons: [`三色に必要な9種のうち${seed.coverage}種があり、${seed.completeSuitCount}色の順子が完成しています。`,
        seed.tilesBySuit.map((tiles, i) => `${SUIT_LABELS[i]} ${tiles.map((tile) => tile[0]).join("") || "なし"}`).join(" / ")],
      cautions: [seed.weakestSuitCount < 2 ? "種が薄い色があり、今から三色に固定すると速度を落としやすい形です。" : "足りない牌を待ちすぎず、通常手の受け入れも残します。", ...(loss > 0 ? ["必須9枚の外側にドラがあり、残り面子と雀頭の枠を圧迫します。"] : [])],
      branch: "3色の順子が自然に整えば三色へ。先に良形テンパイができれば門前リーチへ戻せます。",
    });
  }
  for (const [suitIndex, seed] of f.ittsu.entries()) {
    const missing = 9 - seed.coverage;
    const distance = Math.max(n, missing - 1);
    add({
      id: `ittsu-${seed.suit}`, name: `${SUIT_LABELS[suitIndex]}一通`, category: "sequences", role: "ikkitsuukan",
      suitability: seed.coverage * 11 + seed.completedSequences * 5 - 35, distance, han: 2 + f.doraCount,
      shape: baseShape - missing * 3, flexibility: baseFlex - missing * 5, call: seed.completedSequences * 15 + seed.coverage * 3,
      penalty: Math.max(0, distance - n) * 9 + (n <= 1 ? missing * 4 : missing * 2),
      reasons: [`${SUIT_LABELS[suitIndex]}の1〜9のうち${seed.coverage}種を持っています。`, `123・456・789のうち${seed.completedSequences}組が揃っています。`],
      cautions: ["一通は鳴くと2翻から1翻。揃っていない区間を無理に待たない方針です。"],
      branch: "一通が遠くなったら、完成順子を通常手の面子として使えます。",
    });
    const offSuit = 13 - f.suitCounts[suitIndex]! - f.honorCount;
    const naturalPairHonors = f.counts.slice(27).filter((count) => count >= 2).length;
    const loss = f.dora != null && tileIndex(f.dora) < 27 && Math.floor(tileIndex(f.dora) / 9) !== suitIndex ? f.doraCount : 0;
    const distanceFlush = Math.max(n, offSuit - 1);
    add({
      id: `flush-${SUITS[suitIndex]}`, name: `${SUIT_LABELS[suitIndex]}${f.honorCount ? "ホンイツ" : "チンイツ"}`, category: "flush", role: "flush",
      suitability: f.suitCounts[suitIndex]! * 9 + naturalPairHonors * 8 + f.valuePairKinds * 4 - offSuit * 3,
      distance: distanceFlush, han: (f.honorCount ? 3 : 6) + f.doraCount - loss,
      shape: Math.min(90, 35 + f.suitCounts[suitIndex]! * 4), flexibility: 80 - offSuit * 5,
      call: 30 + f.suitCounts[suitIndex]! * 3 + naturalPairHonors * 10,
      loss, penalty: offSuit * (n <= 1 ? 8 : 2) + Math.max(0, distanceFlush - n) * 5,
      reasons: [`${SUIT_LABELS[suitIndex]}${f.suitCounts[suitIndex]}枚と字牌${f.honorCount}枚を利用できます。`, `他色を${offSuit}枚処理する必要があり、字牌の対子・暗刻は${naturalPairHonors}種類です。`],
      cautions: ["数牌を鳴くと色を変えにくくなります。", ...(n <= 1 && offSuit >= 2 ? ["通常手が速いため、染めるための手戻りを低く評価しています。"] : []), ...(loss > 0 ? [`染めるとドラ${loss}枚が使えなくなります。`] : [])],
      branch: "狙う色が増えれば染め手へ。他色の良形が伸びたら、副露前なら通常手へ戻せます。",
    });
  }
  add({
    id: "chiitoitsu", name: "七対子", category: "pairs", role: "chiitoitsu",
    suitability: f.pairKinds * 15 + Math.max(0, n - f.chiitoitsuShanten) * 10 - f.tripletKinds * 4,
    distance: f.chiitoitsuShanten, han: 2 + f.doraCount, shape: 30, flexibility: 48 + f.valuePairKinds * 9 + (f.pairKinds >= 4 ? 10 : 0), call: 0,
    penalty: Math.max(0, f.chiitoitsuShanten - n) * 8,
    reasons: [`対子候補は${f.pairKinds}種類、七対子は${shantenLabel(f.chiitoitsuShanten)}です。`, "同じ牌の3枚目・4枚目は別の対子に数えていません。"],
    cautions: ["待ちは単騎になり、鳴くと七対子は成立しません。"],
    branch: f.valuePairKinds ? "役牌の対子を鳴いて通常手・対々和へ進むルートも残っています。" : "対子が刻子に育つなら対々和、連続形が伸びるなら通常手も再評価します。",
  });
  const tripletDistance = Math.max(0, 8 - f.tripletKinds * 2 - Math.min(5 - f.tripletKinds, f.pairKinds - f.tripletKinds));
  add({
    id: "toitoi", name: f.valuePairKinds || f.valueTripletKinds ? "役牌・対々和" : "対々和・三暗刻", category: "pairs", role: "toitoi",
    suitability: f.pairKinds * 11 + f.tripletKinds * 14 + f.valuePairKinds * 6, distance: tripletDistance, han: 2 + Number(f.valuePairKinds > 0) + f.doraCount,
    shape: 38, flexibility: 50 + f.valuePairKinds * 8, call: f.pairKinds * 15,
    penalty: Math.max(0, tripletDistance - ordinaryDistance) * 7,
    reasons: [`対子候補${f.pairKinds}種類と暗刻${f.tripletKinds}組を利用できます。`, "対子を刻子へ育てても、最後の雀頭1組は必要です。"],
    cautions: ["鳴くと七対子へ戻れず、すべての対子をポンできるわけではありません。"],
    branch: "対子が増えるなら七対子、ポンで面子が進むなら対々和を再評価します。",
  });
  const outsideDistance = Math.max(n, Math.ceil((13 - f.terminalHonorCount - f.outsideSeedCount * 2) / 2));
  add({
    id: "outside", name: f.honorCount ? "チャンタ・混老頭の種" : "純チャンの種", category: "outside", role: "chanta",
    suitability: f.terminalHonorCount * 5 + f.outsideSeedCount * 12 + f.tripletKinds * 3 - 15,
    distance: outsideDistance, han: f.honorCount ? 2 : 3, shape: 25, flexibility: 35 + f.valuePairKinds * 8, call: f.outsideSeedCount * 12 + f.valuePairKinds * 15,
    penalty: Math.max(0, outsideDistance - ordinaryDistance) * 8 + (n <= 1 ? 10 : 0),
    loss: f.dora != null && tileIndex(f.dora) < 27 && tileIndex(f.dora) % 9 >= 3 && tileIndex(f.dora) % 9 <= 5 ? f.doraCount : 0,
    reasons: [`1・9・字牌が${f.terminalHonorCount}枚、123・789の種が${f.outsideSeedCount}区間あります。`, "端牌・字牌を面子と雀頭に絡める構想です。"],
    cautions: ["辺張や単騎になりやすく、中張牌の良形を壊すなら手役を固定しません。", "混老頭は対々和・七対子の分岐として扱い、チャンタの成功率へは含めません。"],
    branch: "役牌が重なれば役牌速攻へ、対子が増えれば混老頭を含む対子手も比較します。",
  });
  const kokushiFit = ({ 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 2, 7: 8, 8: 29, 9: 51, 10: 79, 11: 96, 12: 100, 13: 100 } as Record<number, number>)[f.terminalHonorKinds]!;
  add({
    id: "kokushi", name: "国士無双", category: "kokushi",
    suitability: kokushiFit + Number(f.terminalHonorPair) * 4 - Math.max(0, f.kokushiShanten - ordinaryDistance) * 15,
    distance: f.kokushiShanten, han: 13, shape: 12, flexibility: 10, call: 0,
    penalty: (13 - f.terminalHonorKinds) * 2 + Math.max(0, f.kokushiShanten - ordinaryDistance) * 8 + (ordinaryDistance <= 1 ? 22 : 0),
    reasons: [`么九牌13種のうち${f.terminalHonorKinds}種、国士は${shantenLabel(f.kokushiShanten)}です。`, f.terminalHonorPair ? "么九牌の対子があり、雀頭候補を確保しています。" : "雀頭になる么九牌の重なりも必要です。"],
    cautions: ["鳴けず、通常手へ戻る自由度が小さい構想です。", "役満の価値は高いものの、成功率はこの配牌評価だけでは推定しません。"],
    branch: "不足する么九牌が増えるなら継続し、中張牌が伸びても国士への手戻りと通常手の速度を比較します。",
  });
  return candidates.map((candidate): StrategyEvaluation => {
    const suitable = normalizeStrategyScore(candidate.suitability);
    const result = candidate.role ? evidence[candidate.role] : undefined;
    const measured = result && result.validTrials > 0 ? result : undefined;
    const naturalSpeed = normalizeStrategyScore(100 - Math.max(0, candidate.distance) * 15);
    const speed = measured ? naturalSpeed * 0.6 + measured.tenpaiByTurn12Rate * 100 * 0.4 : naturalSpeed;
    // Missing simulation evidence is labelled hand-only; it is never represented as an observed rate.
    const ease = measured ? measured.winRate * 100 * 0.5 + suitable * 0.5 : suitable * 0.8;
    const axes = {
      speedScore: normalizeStrategyScore(speed), winRateScore: normalizeStrategyScore(ease),
      valueScore: normalizeStrategyScore(candidate.han * 15), shapeScore: normalizeStrategyScore(candidate.shape),
      flexibilityScore: normalizeStrategyScore(candidate.flexibility), callScore: normalizeStrategyScore(candidate.call),
      yakuScore: normalizeStrategyScore(measured ? suitable * 0.6 + measured.tenpaiRate * 40 : suitable), suitabilityScore: suitable,
    };
    const penalty = Math.max(0, candidate.penalty ?? 0) + (candidate.loss ?? 0) * 10;
    const total = Object.entries(STRATEGY_SCORE_WEIGHTS).reduce((sum, [axis, weight]) => sum + axes[axis as keyof typeof axes] * weight, 0);
    // Low compatibility must not be rescued by theoretical yakuman value or unrelated family simulations.
    const overallScore = normalizeStrategyScore(Math.min(total - penalty, suitable + 18));
    return {
      id: candidate.id, name: candidate.name, category: candidate.category, tier: "サブ", overallScore, ...axes,
      estimatedTargetShanten: candidate.distance, commitmentPenalty: normalizeStrategyScore(penalty), lostDoraCount: candidate.loss ?? 0,
      sourceRoleId: candidate.role, evidenceScope: measured ? "family" : "hand",
      reasons: candidate.reasons.slice(0, 4), cautions: candidate.cautions, branch: candidate.branch,
      simulation: measured ? {
        trials: measured.validTrials, winRate: measured.winRate, tenpaiRate: measured.tenpaiRate,
        winRateError: winRateInterval(measured.winCount, measured.validTrials).error,
        confidence: measured.validTrials >= 1000 ? "高" : measured.validTrials >= 300 ? "中" : "低",
      } : null,
    };
  }).sort((a, b) => b.overallScore - a.overallScore || a.id.localeCompare(b.id));
}

export function shantenLabel(shanten: number): string {
  return shanten < 0 ? "和了形" : shanten === 0 ? "聴牌" : `${shanten}向聴`;
}
