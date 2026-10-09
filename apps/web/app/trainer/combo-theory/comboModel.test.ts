import { describe, expect, it } from "vitest";
import { calculateTileCombos, comboMetricValue, comboVisibleCountsFromIds, tileIndex } from "@mahjong-trainer/mahjong-core";
import { validatePushFoldAudit } from "../push-or-fold/pushFoldFactory";
import { buildPracticalComboScene, comboHistoryStats, comboMistakes, decodeComboSimulator, encodeComboSimulator, generateComboQuestion, initialSimulator, readComboHistory } from "./comboModel";

describe("combo questions", () => {
  it("reproduces every mode and difficulty from its seed", () => {
    for (const mode of ["calculation", "comparison", "practical"] as const) for (const difficulty of ["beginner", "intermediate", "advanced"] as const) expect(generateComboQuestion("repeat-2026", mode, difficulty)).toEqual(generateComboQuestion("repeat-2026", mode, difficulty));
  });
  it("audits 1800 generated problems with unique answers and unchanged calculations", () => {
    let calledQuestions = 0, wallQuestions = 0, furitenQuestions = 0;
    let calledFixture = "";
    for (let seed = 0; seed < 200; seed++) for (const mode of ["calculation", "comparison", "practical"] as const) for (const difficulty of ["beginner", "intermediate", "advanced"] as const) {
      const q = generateComboQuestion(`audit-${seed}`, mode, difficulty);
      if (q.scene?.players.some(player => player.melds.length)) { calledQuestions++; calledFixture ||= `${q.seed}:${difficulty}`; }
      if (q.input.visibleCounts.filter(count => count === 4).length >= 2) wallQuestions++;
      if (q.results.some(result => result.rows.some(row => row.excluded === "furiten"))) furitenQuestions++;
      expect(new Set(q.choices).size).toBe(q.choices.length);
      expect(q.choices).toContain(q.correct);
      expect(q.results).toEqual(q.targets.map(target => calculateTileCombos(target, q.input)));
      if (mode === "calculation") expect(q.correct).toBe(comboMetricValue(q.results[0]!, q.metric));
      else {
        const values = q.results.map(result => comboMetricValue(result, q.metric));
        const best = q.direction === "min" ? Math.min(...values) : Math.max(...values);
        expect(q.results.filter(result => comboMetricValue(result, q.metric) === best)).toHaveLength(1);
        expect(q.correct).toBe(q.results.find(result => comboMetricValue(result, q.metric) === best)!.target);
      }
      if (q.scene) { expect(q.scene.hand).toHaveLength(14); expect(q.scene.hand.map(t => Math.floor(t.id / 4))).toEqual(q.scene.hand.map(t => tileIndex(t.tile))); expect(q.scene.players.find(p => p.seat === q.scene!.seatWind)?.melds).toHaveLength(0); }
    }
    expect(calledQuestions).toBeGreaterThan(50);
    expect(wallQuestions).toBeGreaterThan(100);
    expect(furitenQuestions).toBeGreaterThan(100);
    console.info("Combo question coverage", { calledQuestions, wallQuestions, furitenQuestions, calledFixture });
  });
  it("preserves all 136 physical tiles and legal hidden riichi hands", () => {
    let calledScenes = 0;
    for (let seed = 0; seed < 100; seed++) for (const difficulty of ["beginner", "intermediate", "advanced"] as const) {
      const { question, audit } = buildPracticalComboScene(`physical-${seed}`, difficulty);
      expect(() => validatePushFoldAudit(question, audit)).not.toThrow();
      if (question.players.some(player => player.melds.length)) {
        calledScenes++;
        const ids = [...question.hand, ...question.doraIndicators, ...question.players.flatMap(player => [...player.river.map(row => row.tile), ...player.melds.flatMap(meld => meld.tiles)])].map(tile => tile.id);
        expect(ids.length).toBeGreaterThan(new Set(ids).size);
        expect(comboVisibleCountsFromIds(ids).reduce((a, b) => a + b, 0)).toBe(new Set(ids).size);
      }
      expect(JSON.stringify(generateComboQuestion(`physical-${seed}`, "practical", difficulty))).not.toContain('"audit"');
    }
    expect(calledScenes).toBeGreaterThan(50);
  });
});
describe("combo saved state", () => {
  it("round-trips shared inputs and rejects malformed or inconsistent counts", () => {
    const state = initialSimulator(); state.visibleCounts[4] = 2; state.model = "riichi"; state.riichiRiver![4] = 1; state.shanponPartners = { 4: 8 };
    expect(decodeComboSimulator(encodeComboSimulator(state))).toEqual(state);
    for (const text of ["", "combo=2", encodeComboSimulator(state).replace("v=0", "v=5"), encodeComboSimulator(state).replace("t=4%2C7", "t=4%2C4"), encodeComboSimulator(state).replace("model=riichi", "model=other")]) expect(() => decodeComboSimulator(text)).toThrow();
    expect(() => decodeComboSimulator(encodeComboSimulator(state).replace(/partners=[^&]+/, "partners=null"))).toThrow();
  });
  it("handles corrupt storage and removes corrected mistakes from the review queue", () => {
    expect(readComboHistory("invalid").attempts).toEqual([]);
    const row = { seed: "review", mode: "calculation" as const, difficulty: "beginner" as const, correct: false, answer: 0, at: "2026-10-10T00:00:00Z" };
    const history = { version: 1 as const, attempts: [row, { ...row, seed: "another", correct: true }, { ...row, correct: true }] };
    expect(comboHistoryStats(history)).toEqual({ total: 3, correct: 2, accuracy: 67, streak: 2 });
    expect(comboMistakes(history)).toHaveLength(0);
    expect(comboHistoryStats(history, "comparison").total).toBe(0);
  });
});
