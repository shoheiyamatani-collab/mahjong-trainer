import { describe, expect, it } from "vitest";
import { calculateScore } from "../src";

describe("score calculation", () => {
  it("scores child ron", () => {
    const result = calculateScore({ han: 1, fu: 30, isDealer: false, winMethod: "ron" });

    expect(result.limitName).toBe("normal");
    expect(result.totalPoints).toBe(1000);
    expect(result.payments[0]).toEqual({ label: "放銃者", points: 1000 });
  });

  it("scores child and dealer tsumo payments", () => {
    const child = calculateScore({ han: 2, fu: 30, isDealer: false, winMethod: "tsumo" });
    const dealer = calculateScore({ han: 2, fu: 30, isDealer: true, winMethod: "tsumo" });

    expect(child.payments).toEqual([
      { label: "子", points: 500 },
      { label: "親", points: 1000 }
    ]);
    expect(child.totalPoints).toBe(2000);
    expect(dealer.payments).toEqual([{ label: "子全員", points: 1000 }]);
    expect(dealer.totalPoints).toBe(3000);
  });

  it.each([
    [3, 60, "normal", 7700],
    [3, 70, "mangan", 8000],
    [4, 30, "normal", 7700],
    [4, 40, "mangan", 8000],
    [5, 30, "mangan", 8000],
    [6, 30, "haneman", 12000],
    [8, 30, "baiman", 16000],
    [11, 30, "sanbaiman", 24000],
    [13, 30, "yakuman", 32000]
  ])("scores child ron limit boundary %i han %i fu", (han, fu, limitName, total) => {
    const result = calculateScore({ han: Number(han), fu: Number(fu), isDealer: false, winMethod: "ron" });

    expect(result.limitName).toBe(limitName);
    expect(result.totalPoints).toBe(total);
  });

  it("scores single yakuman", () => {
    expect(calculateScore({ han: 0, fu: null, isDealer: false, winMethod: "ron", yakumanCount: 1 }).totalPoints).toBe(32000);
    expect(calculateScore({ han: 0, fu: null, isDealer: true, winMethod: "ron", yakumanCount: 1 }).totalPoints).toBe(48000);
    expect(calculateScore({ han: 0, fu: null, isDealer: false, winMethod: "tsumo", yakumanCount: 1 }).payments.map((payment) => payment.points)).toEqual([8000, 16000]);
    expect(calculateScore({ han: 0, fu: null, isDealer: true, winMethod: "tsumo", yakumanCount: 1 }).payments[0]?.points).toBe(16000);
  });

  it("supports honba and riichi sticks", () => {
    const result = calculateScore({ han: 1, fu: 30, isDealer: false, winMethod: "ron", honba: 2, riichiSticks: 1 });

    expect(result.payments[0]?.points).toBe(1600);
    expect(result.totalPoints).toBe(2600);
  });

  it("rejects invalid fu", () => {
    expect(() => calculateScore({ han: 1, fu: 22, isDealer: false, winMethod: "ron" })).toThrow();
  });
});
