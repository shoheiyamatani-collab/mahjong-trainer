import { describe, expect, it } from "vitest";
import { calculateTileCombos, comboVisibleCountsFromIds, validateComboInput, type ComboInput } from "../src/comboTheory";
import { createSeededRandom } from "../src/dailyNanikiru";
import { emptyCounts, type Counts34 } from "../src/tiles";

const basic = (): ComboInput => ({ visibleCounts: emptyCounts(), model: "basic" });

// Independent oracle: remove one tile from complete runs, then enumerate physical choices.
function oracle(target: number, input: ComboInput) {
  const totals = { ryanmen: 0, kanchan: 0, penchan: 0, shanpon: 0, tanki: 0 };
  const copies = (tile: number) => Array.from({ length: 4 - input.visibleCounts[tile]! }, (_, i) => i);
  const blocked = (waits: number[]) => input.model === "riichi" && waits.some(tile => (input.riichiRiver?.[tile] ?? 0) > 0);
  if (target < 27) {
    const base = target - target % 9;
    for (let start = 0; start < 7; start++) {
      const run = [base + start, base + start + 1, base + start + 2];
      const omitted = run.indexOf(target);
      if (omitted < 0) continue;
      const pair = run.filter(tile => tile !== target);
      const kind = omitted === 1 ? "kanchan" : (start === 0 && omitted === 2 || start === 6 && omitted === 0) ? "penchan" : "ryanmen";
      const waits = kind === "ryanmen" ? [Math.min(...pair) - 1, Math.max(...pair) + 1] : [target];
      if (!blocked(waits)) for (const a of copies(pair[0]!)) for (const b of copies(pair[1]!)) { void a; void b; totals[kind]++; }
    }
  }
  if (!blocked([target])) {
    for (const a of copies(target)) { totals.tanki++; for (const b of copies(target)) if (a < b) totals.shanpon++; }
  }
  return totals;
}

describe("combo theory counting", () => {
  it("matches the specified fixed values and boundary wait types", () => {
    expect(calculateTileCombos(4, basic()).breakdown.ryanmen).toBe(32);
    expect(calculateTileCombos(7, basic()).breakdown.ryanmen).toBe(16);
    expect(calculateTileCombos(2, basic()).rows.find(row => row.kind === "penchan")?.tiles).toEqual([0, 1]);
    expect(calculateTileCombos(6, basic()).rows.find(row => row.kind === "penchan")?.tiles).toEqual([7, 8]);
    expect(calculateTileCombos(4, basic()).rows.find(row => row.kind === "kanchan")?.tiles).toEqual([3, 5]);
    const input = basic(); input.visibleCounts[2] = 2; input.visibleCounts[3] = 1;
    expect(calculateTileCombos(4, input).breakdown.ryanmen).toBe(22);
  });
  it.each([[0, 6, 4], [1, 3, 3], [2, 1, 2], [3, 0, 1], [4, 0, 0]])("counts visible %i copies with shanpon %i and tanki %i", (visible, shanpon, tanki) => {
    const input = basic(); input.visibleCounts[27] = visible;
    expect(calculateTileCombos(27, input).breakdown).toEqual({ ryanmen: 0, kanchan: 0, penchan: 0, shanpon, tanki });
  });
  it("applies walls without confusing a visible winning tile with a missing taatsu", () => {
    const input = basic(); input.visibleCounts[2] = 4;
    expect(calculateTileCombos(4, input).rows.find(row => row.tiles.join() === "2,3")?.combos).toBe(0);
    input.visibleCounts[4] = 4;
    expect(calculateTileCombos(4, input).breakdown.ryanmen).toBe(16);
  });
  it("applies the other side of ryanmen furiten only in the riichi model", () => {
    const input = basic(); input.visibleCounts[1] = 1; input.riichiRiver = emptyCounts(); input.riichiRiver[1] = 1;
    expect(calculateTileCombos(4, input).breakdown.ryanmen).toBe(32);
    input.model = "riichi";
    expect(calculateTileCombos(4, input).breakdown.ryanmen).toBe(16);
    expect(calculateTileCombos(4, input).rows.find(row => row.tiles.join() === "2,3")?.excluded).toBe("furiten");
    input.riichiRiver = emptyCounts();
    expect(calculateTileCombos(4, input).breakdown.ryanmen).toBe(32);
    input.riichiRiver[4] = 1; input.visibleCounts[4] = 1;
    expect(calculateTileCombos(4, input).total).toBe(0);
  });
  it("can exclude a known shanpon partner while marking an unknown partner conditional", () => {
    const input = basic(); input.model = "riichi"; input.visibleCounts[8] = 1; input.riichiRiver = emptyCounts(); input.riichiRiver[8] = 1;
    expect(calculateTileCombos(4, input).rows.find(row => row.kind === "shanpon")?.conditional).toBe(true);
    input.shanponPartners = { 4: 8 };
    expect(calculateTileCombos(4, input).breakdown.shanpon).toBe(0);
    input.riichiRiver[8] = 0; input.visibleCounts[8] = 3;
    expect(calculateTileCombos(4, input).rows.find(row => row.kind === "shanpon")?.excluded).toBe("partner");
  });
  it("deduplicates called physical tiles and groups red fives with ordinary fives", () => {
    const counts = comboVisibleCountsFromIds([16, 17, 16, 52, 53, 88, 89]);
    expect([counts[4], counts[13], counts[22]]).toEqual([2, 2, 2]);
    expect(counts.reduce((a, b) => a + b, 0)).toBe(6);
  });
  it("rejects invalid inputs rather than producing a numeric result", () => {
    for (const value of [-1, 5, 0.5, NaN, Infinity]) { const input = basic(); input.visibleCounts[0] = value; expect(() => validateComboInput(input)).toThrow(); }
    expect(() => validateComboInput({ model: "basic", visibleCounts: [] })).toThrow();
    expect(() => calculateTileCombos(34, basic())).toThrow();
    expect(() => comboVisibleCountsFromIds([136])).toThrow();
    const invalidPartners: Record<string, number>[] = [{ "04": 8 }, { "4e0": 8 }, { 4: 4 }, { 4: 34 }];
    for (const partners of invalidPartners) expect(() => validateComboInput({ ...basic(), shanponPartners: partners })).toThrow();
    const input = basic(); input.riichiRiver = emptyCounts(); input.riichiRiver[0] = 1;
    expect(() => validateComboInput(input)).toThrow();
  });
  it("agrees with the independent physical-enumeration oracle for every tile and both models", () => {
    const rng = createSeededRandom("combo-independent-audit-v1");
    for (let trial = 0; trial < 500; trial++) {
      const visibleCounts = Array.from({ length: 34 }, () => Math.floor(rng() * 5)) as Counts34;
      const riichiRiver = visibleCounts.map(count => Math.floor(rng() * (count + 1)));
      for (const model of ["basic", "riichi"] as const) for (let target = 0; target < 34; target++) {
        const input = { visibleCounts, riichiRiver, model }, actual = calculateTileCombos(target, input);
        expect(actual.breakdown).toEqual(oracle(target, input));
        expect(actual.total).toBe(Object.values(actual.breakdown).reduce((a, b) => a + b, 0));
        for (const row of actual.rows) { expect(Number.isSafeInteger(row.combos)).toBe(true); expect(row.tiles.every(tile => tile >= 0 && tile < 34)).toBe(true); if (row.kind === "ryanmen") expect(row.waits).toHaveLength(2); }
      }
    }
  });
});
