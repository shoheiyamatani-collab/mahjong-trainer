import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterAll, describe, expect, it, vi } from "vitest";
import { makePushFoldQuestion } from "./pushFoldFactory";
import { pushFoldSpecs } from "./pushFoldQuestions";
import { seats } from "./pushFoldTypes";
import { getPushFoldTableSeat, pushFoldRiverRows, PushFoldTable } from "./PushFoldTable";

vi.stubGlobal("React", React);
afterAll(() => vi.unstubAllGlobals());

describe("push-fold table view", () => {
  it.each(seats)("places %s at the bottom and rotates the other seats clockwise", (self) => {
    const index = seats.indexOf(self);
    expect(getPushFoldTableSeat(self, self)).toEqual({ position: "bottom", relative: "自分", rotation: 0 });
    expect(getPushFoldTableSeat(self, seats[(index + 1) % 4]!)).toEqual({ position: "right", relative: "下家", rotation: -90 });
    expect(getPushFoldTableSeat(self, seats[(index + 2) % 4]!)).toEqual({ position: "top", relative: "対面", rotation: 180 });
    expect(getPushFoldTableSeat(self, seats[(index + 3) % 4]!)).toEqual({ position: "left", relative: "上家", rotation: 90 });
  });

  it.each(pushFoldSpecs)("preserves every discard, its order and all melds in $id", (spec) => {
    const { question } = makePushFoldQuestion(spec);
    const before = JSON.stringify(question);
    const html = renderToStaticMarkup(React.createElement(PushFoldTable, { question }));
    const ids = [...html.matchAll(/data-tile-id="(\d+)"/g)].map((match) => Number(match[1]));
    expect(ids).toEqual(question.players.flatMap((player) => player.river.map((discard) => discard.tile.id)));
    expect(JSON.stringify(question)).toBe(before);
    for (const player of question.players) {
      expect(pushFoldRiverRows(player.river).flat()).toEqual(player.river);
      expect(pushFoldRiverRows(player.river).every((row) => row.length <= 6)).toBe(true);
      const position = getPushFoldTableSeat(question.seatWind, player.seat).position;
      expect(html).toContain(`data-table-position="${position}" data-seat="${player.seat}"`);
      expect(html).toContain(`${player.seat}家・${getPushFoldTableSeat(question.seatWind, player.seat).relative}の捨て牌を拡大`);
      for (const meld of player.melds) expect(html).toContain(`${meld.kind === "chi" ? "チー" : "ポン"}・${seats[meld.from]}家から`);
    }
    expect(html.match(/・リーチ宣言/g)?.length ?? 0).toBe(question.players.flatMap((p) => p.river).filter((r) => r.riichi).length * 2);
    expect(html.match(/家が鳴いた牌/g)?.length ?? 0).toBe(question.players.flatMap((p) => p.river).filter((r) => r.calledBy !== null).length * 2);
  });

  it("does not derive table positions from the input array order", () => {
    const { question } = makePushFoldQuestion(pushFoldSpecs[0]!);
    question.players.reverse();
    const html = renderToStaticMarkup(React.createElement(PushFoldTable, { question }));
    for (const player of question.players) {
      expect(html).toContain(`data-table-position="${getPushFoldTableSeat(question.seatWind, player.seat).position}" data-seat="${player.seat}"`);
    }
    expect(pushFoldRiverRows([])).toEqual([]);
  });
});
