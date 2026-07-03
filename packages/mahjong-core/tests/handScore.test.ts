import { describe, expect, it } from "vitest";
import { calculateHandScore, parseHand, TILE_NAMES, type HandScoreMeld } from "../src";

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

  it("scores an open pon as an exposed meld", () => {
    const white = TILE_NAMES[31]!;
    const melds: HandScoreMeld[] = [{ kind: "pon", tiles: [white, white, white] }];
    const result = calculateHandScore({
      counts: parseHand("123456789m22p"),
      melds,
      winningTile: "2p",
      isDealer: false,
      winMethod: "ron",
      roundWind: TILE_NAMES[27]!,
      seatWind: TILE_NAMES[28]!,
      riichi: true
    });

    expect(result.score.han).toBe(1);
    expect(result.score.fu).toBe(30);
    expect(result.score.totalPoints).toBe(1000);
  });

  it("keeps closed status and fu for an ankan", () => {
    const melds: HandScoreMeld[] = [{ kind: "ankan", tiles: ["1m", "1m", "1m", "1m"] }];
    const result = calculateHandScore({
      counts: parseHand("234567m222p22s"),
      melds,
      winningTile: "2s",
      isDealer: false,
      winMethod: "ron",
      roundWind: TILE_NAMES[27]!,
      seatWind: TILE_NAMES[28]!,
      riichi: true
    });

    expect(result.score.han).toBe(1);
    expect(result.score.fu).toBe(70);
    expect(result.score.totalPoints).toBe(2300);
  });

  it("scores closed chanta", () => {
    const result = calculateHandScore({
      counts: parseHand("123789m123789p99s"),
      winningTile: "3p",
      isDealer: false,
      winMethod: "ron",
      roundWind: TILE_NAMES[27]!,
      seatWind: TILE_NAMES[28]!
    });

    expect(result.yaku.some((yaku) => yaku.name === "混全帯么九")).toBe(true);
    expect(result.score.han).toBe(2);
    expect(result.score.fu).toBe(40);
    expect(result.score.totalPoints).toBe(2600);
  });

  it("scores open chanta with reduced han", () => {
    const melds: HandScoreMeld[] = [{ kind: "chi", tiles: ["1m", "2m", "3m"] }];
    const result = calculateHandScore({
      counts: parseHand("789m123789p99s"),
      melds,
      winningTile: "3p",
      isDealer: false,
      winMethod: "ron",
      roundWind: TILE_NAMES[27]!,
      seatWind: TILE_NAMES[28]!
    });

    expect(result.yaku.some((yaku) => yaku.name === "混全帯么九")).toBe(true);
    expect(result.score.han).toBe(1);
    expect(result.score.fu).toBe(30);
    expect(result.score.totalPoints).toBe(1000);
  });
});
