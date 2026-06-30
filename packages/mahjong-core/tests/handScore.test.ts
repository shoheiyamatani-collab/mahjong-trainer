import { describe, expect, it } from "vitest";
import { calculateHandScore, parseHand } from "../src";

describe("automatic hand scoring", () => {
  it("scores closed pinfu riichi ron", () => {
    const result = calculateHandScore({
      counts: parseHand("123m456m234p456p22s"),
      winningTile: "4p",
      isDealer: false,
      winMethod: "ron",
      roundWind: "東",
      seatWind: "南",
      riichi: true
    });

    expect(result.yaku.map((yaku) => yaku.name)).toContain("平和");
    expect(result.score.han).toBe(2);
    expect(result.score.fu).toBe(30);
    expect(result.score.totalPoints).toBe(2000);
  });

  it("scores menzen tsumo pinfu as 20 fu", () => {
    const result = calculateHandScore({
      counts: parseHand("123m456m234p456p22s"),
      winningTile: "4p",
      isDealer: false,
      winMethod: "tsumo",
      roundWind: "東",
      seatWind: "南",
      riichi: true
    });

    expect(result.yaku.map((yaku) => yaku.name)).toContain("門前清自摸和");
    expect(result.score.han).toBe(3);
    expect(result.score.fu).toBe(20);
    expect(result.score.payments.map((payment) => payment.points)).toEqual([700, 1300]);
  });

  it("chooses ryanpeikou over chiitoitsu when both shapes exist", () => {
    const result = calculateHandScore({
      counts: parseHand("11223344556677m"),
      winningTile: "7m",
      isDealer: false,
      winMethod: "ron",
      roundWind: "東",
      seatWind: "南"
    });
    const names = result.yaku.map((yaku) => yaku.name);

    expect(names).toContain("二盃口");
    expect(names).toContain("清一色");
    expect(names).not.toContain("七対子");
    expect(result.score.han).toBe(10);
  });

  it("scores chiitoitsu chinitsu when no standard shape exists", () => {
    const result = calculateHandScore({
      counts: parseHand("11223344557788m"),
      winningTile: "8m",
      isDealer: false,
      winMethod: "ron",
      roundWind: "東",
      seatWind: "南"
    });
    const names = result.yaku.map((yaku) => yaku.name);

    expect(names).toContain("七対子");
    expect(names).toContain("清一色");
    expect(result.score.han).toBe(8);
  });

  it("scores kokushi as yakuman", () => {
    const result = calculateHandScore({
      counts: parseHand("19m19p19s東南西北白發中中"),
      winningTile: "中",
      isDealer: false,
      winMethod: "ron",
      roundWind: "東",
      seatWind: "南"
    });

    expect(result.yaku[0]?.name).toBe("国士無双");
    expect(result.score.limitName).toBe("yakuman");
    expect(result.score.totalPoints).toBe(32000);
  });
});
