import { parseHand, tileIndex, countsToTiles } from "@mahjong-trainer/mahjong-core";

// Deliberately fabricated legal tile/event streams; these are not real Tenhou games.
export function syntheticXml(suit: "m" | "p" | "s", start: number, scenario = 0): string {
  const otherSuits = ["m", "p", "s"].filter((s) => s !== suit);
  const focus = `${start + 3}${suit}`;
  const handText = `${start}${start + 1}${start + 2}${start + 3}${suit}123${otherSuits[0]}789${otherSuits[1]}東東白`;
  const used = new Set<number>();
  const take = (index: number) => { const id = [0, 1, 2, 3].map((copy) => index * 4 + copy).find((id) => !used.has(id)); if (id === undefined) throw new Error("fixture tile exhaustion"); used.add(id); return id; };
  const first = countsToTiles(parseHand(handText)).map((tile) => take(tileIndex(tile)));
  const hands = [first, ...[1, 2, 3].map(() => Array.from({ length: 13 }, () => take([24, 28, 30, 31, 32, 33, 0, 8, 9, 17, 18, 26, 4, 13, 22].find((index) => Array.from({ length: 4 }, (_, n) => index * 4 + n).some((id) => !used.has(id)))!)))];
  const indicator = Array.from({ length: 136 }, (_, id) => id).find((id) => !used.has(id))!; used.add(indicator);
  const available = Array.from({ length: 136 }, (_, id) => id).filter((id) => !used.has(id));
  const drawForFocus = available.find((id) => Math.floor(id / 4) === tileIndex("東"))!;
  const drawOrder = [drawForFocus, ...available.filter((id) => id !== drawForFocus)];
  // Put the purposeful hand change at the fourth discard, following three tsumogiri.
  [drawOrder[0], drawOrder[12]] = [drawOrder[12]!, drawOrder[0]!];
  const xml = ['<mjloggm ver="2.3">', '<GO type="169"/>', `<UN n0="TEST_ONLY" n1="TEST_ONLY" n2="TEST_ONLY" n3="TEST_ONLY"/>`, `<INIT seed="${scenario % 12},0,0,1,2,${indicator}" ten="250,250,250,250" oya="0" ${hands.map((hand, player) => `hai${player}="${hand.join(",")}"`).join(" ")}/>`];
  const focusId = first.find((id) => Math.floor(id / 4) === tileIndex(focus))!;
  for (let n = 0; n < 70; n += 1) {
    const player = n % 4; const id = drawOrder[n]!;
    xml.push(`<${"TUVW"[player]}${id}/>`, `<${"DEFG"[player]}${n === 12 ? focusId : id}/>`);
  }
  xml.push('<RYUUKYOKU/>', '</mjloggm>');
  return xml.join("\n");
}
