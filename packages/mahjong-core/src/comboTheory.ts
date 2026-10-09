import { emptyCounts, tileName, type Counts34 } from "./tiles";

export const COMBO_VERSION = 1;
export const comboWaitKinds = ["ryanmen", "kanchan", "penchan", "shanpon", "tanki"] as const;
export type ComboWaitKind = typeof comboWaitKinds[number];
export type ComboModel = "basic" | "riichi";
export type ComboMetric = "ryanmen" | "bad" | "total";
export type ComboInput = {
  visibleCounts: Counts34;
  model: ComboModel;
  riichiRiver?: Counts34;
  shanponPartners?: Record<number, number>;
};
export type ComboRow = {
  kind: ComboWaitKind; tiles: number[]; waits: number[]; remaining: number[];
  rawCount: number; combos: number; excluded: "wall" | "furiten" | "partner" | null;
  conditional: boolean;
};
export type ComboResult = {
  target: number; remaining: number; model: ComboModel; rows: ComboRow[];
  breakdown: Record<ComboWaitKind, number>; bad: number; vertical: number; total: number;
};

export function validateComboCounts(counts: Counts34): void {
  if (!Array.isArray(counts) || counts.length !== 34) throw new Error("枚数は34牌種で指定してください。");
  for (let i = 0; i < 34; i++) {
    if (!Number.isSafeInteger(counts[i]) || counts[i]! < 0 || counts[i]! > 4) throw new Error(`${tileName(i)}の枚数は0〜4の整数にしてください。`);
  }
}
function validateIndex(index: number) {
  if (!Number.isSafeInteger(index) || index < 0 || index > 33) throw new Error("牌種は0〜33で指定してください。");
}
export function validateComboInput(input: ComboInput): void {
  validateComboCounts(input.visibleCounts);
  if (input.model !== "basic" && input.model !== "riichi") throw new Error("計算モデルが不正です。");
  const river = input.riichiRiver ?? emptyCounts();
  validateComboCounts(river);
  for (let i = 0; i < 34; i++) if (river[i]! > input.visibleCounts[i]!) throw new Error("リーチ者の河も見えている枚数に含めてください。");
  if (input.shanponPartners !== undefined && (!input.shanponPartners || typeof input.shanponPartners !== "object" || Array.isArray(input.shanponPartners))) throw new Error("シャンポンの相方は牌種ごとに指定してください。");
  for (const [target, partner] of Object.entries(input.shanponPartners ?? {})) {
    if (String(Number(target)) !== target) throw new Error("シャンポンの対象牌種が不正です。");
    validateIndex(Number(target)); validateIndex(partner);
    if (Number(target) === partner) throw new Error("シャンポンの相方は別の牌種にしてください。");
  }
}

// Called discards can occur in both a river and a meld. Their physical ID counts once.
export function comboVisibleCountsFromIds(ids: readonly number[]): Counts34 {
  const counts = emptyCounts();
  const seen = new Set<number>();
  for (const id of ids) {
    if (!Number.isSafeInteger(id) || id < 0 || id > 135) throw new Error("物理牌IDは0〜135で指定してください。");
    if (!seen.has(id)) { counts[Math.floor(id / 4)]!++; seen.add(id); }
  }
  return counts;
}

export function calculateTileCombos(target: number, input: ComboInput): ComboResult {
  validateIndex(target); validateComboInput(input);
  const river = input.riichiRiver ?? emptyCounts();
  const remaining = input.visibleCounts.map(count => 4 - count);
  const rows: ComboRow[] = [];
  function add(kind: ComboWaitKind, tiles: number[], waits: number[], rawCount: number, conditional = false, partnerBlocked = false) {
    const furiten = input.model === "riichi" && waits.some(tile => river[tile]! > 0);
    const excluded = furiten ? "furiten" : partnerBlocked ? "partner" : rawCount === 0 ? "wall" : null;
    rows.push({ kind, tiles, waits, remaining: tiles.map(tile => remaining[tile]!), rawCount, combos: excluded ? 0 : rawCount, excluded, conditional });
  }
  if (target < 27) {
    const base = Math.floor(target / 9) * 9;
    // Enumerate legal two-tile shapes in one suit, never across boundaries.
    for (let a = 0; a < 9; a++) for (let b = a + 1; b < Math.min(9, a + 3); b++) {
      let kind: ComboWaitKind; let waits: number[];
      if (b - a === 2) { kind = "kanchan"; waits = [base + a + 1]; }
      else if (a === 0) { kind = "penchan"; waits = [base + 2]; }
      else if (a === 7) { kind = "penchan"; waits = [base + 6]; }
      else { kind = "ryanmen"; waits = [base + a - 1, base + b + 1]; }
      if (waits.includes(target)) add(kind, [base + a, base + b], waits, remaining[base + a]! * remaining[base + b]!);
    }
  }
  const r = remaining[target]!;
  const partner = input.shanponPartners?.[target];
  add("shanpon", [target, target], partner === undefined ? [target] : [target, partner], r * (r - 1) / 2, partner === undefined, partner !== undefined && remaining[partner]! < 2);
  add("tanki", [target], [target], r);
  const breakdown = Object.fromEntries(comboWaitKinds.map(kind => [kind, rows.filter(row => row.kind === kind).reduce((sum, row) => sum + row.combos, 0)])) as Record<ComboWaitKind, number>;
  const bad = breakdown.kanchan + breakdown.penchan, vertical = breakdown.shanpon + breakdown.tanki;
  return { target, remaining: r, model: input.model, rows, breakdown, bad, vertical, total: breakdown.ryanmen + bad + vertical };
}
export function comboMetricValue(result: ComboResult, metric: ComboMetric): number {
  return metric === "ryanmen" ? result.breakdown.ryanmen : metric === "bad" ? result.bad : result.total;
}
