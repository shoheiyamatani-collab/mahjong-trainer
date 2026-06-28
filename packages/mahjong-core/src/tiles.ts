export const SUITS = ["m", "p", "s"] as const;
export type Suit = (typeof SUITS)[number];

export const HONORS = ["東", "南", "西", "北", "白", "發", "中"] as const;

export const TILE_NAMES = [
  ...SUITS.flatMap((suit) => Array.from({ length: 9 }, (_, index) => `${index + 1}${suit}`)),
  ...HONORS,
] as const;

export type Tile = (typeof TILE_NAMES)[number];
export type Counts34 = number[];

const TILE_TO_INDEX = new Map<string, number>(TILE_NAMES.map((tile, index) => [tile, index]));
const HONOR_ALIASES = new Map<string, string>([["発", "發"]]);

export function emptyCounts(): Counts34 {
  return Array(34).fill(0);
}

export function tileIndex(tile: string): number {
  const normalized = HONOR_ALIASES.get(tile) ?? tile;
  const index = TILE_TO_INDEX.get(normalized);
  if (index == null) {
    throw new Error(`Unknown tile: ${tile}`);
  }
  return index;
}

export function tileName(index: number): Tile {
  const tile = TILE_NAMES[index];
  if (tile == null) {
    throw new Error(`Unknown tile index: ${index}`);
  }
  return tile;
}

export function countsToTiles(counts: Counts34): Tile[] {
  validateCounts(counts);
  const tiles: Tile[] = [];
  counts.forEach((count, index) => {
    for (let i = 0; i < count; i += 1) {
      tiles.push(tileName(index));
    }
  });
  return tiles;
}

export function parseHand(text: string): Counts34 {
  const counts = emptyCounts();
  let i = 0;
  const value = text.trim();

  while (i < value.length) {
    const char = value[i]!;
    if (/\s/.test(char) || [",", "、", "，", "/", "|"].includes(char)) {
      i += 1;
      continue;
    }

    if (/[0-9]/.test(char)) {
      const digits: string[] = [];
      while (i < value.length && /[0-9]/.test(value[i]!)) {
        const digit = value[i]!;
        if (digit === "0") {
          throw new Error("Red fives / 0 notation are not supported.");
        }
        if (digit < "1" || digit > "9") {
          throw new Error(`Invalid tile rank: ${digit}`);
        }
        digits.push(digit);
        i += 1;
      }
      const suit = value[i] as Suit | undefined;
      if (!suit || !SUITS.includes(suit)) {
        throw new Error("Number tiles must be followed by m, p, or s.");
      }
      i += 1;
      for (const digit of digits) {
        incrementTile(counts, `${digit}${suit}`);
      }
      continue;
    }

    const honor = HONOR_ALIASES.get(char) ?? char;
    if (TILE_TO_INDEX.has(honor)) {
      incrementTile(counts, honor);
      i += 1;
      continue;
    }

    throw new Error(`Cannot parse tile around: ${value.slice(i)}`);
  }

  return counts;
}

export function sortedHandText(counts: Counts34): string {
  return countsToTiles(counts).join(" ");
}

export function validateCounts(counts: Counts34, expectedTotal?: number): void {
  if (counts.length !== 34) {
    throw new Error("A hand must use 34 tile counts.");
  }
  counts.forEach((count, index) => {
    if (count < 0) {
      throw new Error("Tile counts cannot be negative.");
    }
    if (count > 4) {
      throw new Error(`A tile appears more than four times: ${tileName(index)}`);
    }
  });
  if (expectedTotal != null && sumCounts(counts) !== expectedTotal) {
    throw new Error(`Expected ${expectedTotal} tiles, got ${sumCounts(counts)}.`);
  }
}

export function addTile(counts: Counts34, tile: string): Counts34 {
  const next = counts.slice();
  incrementTile(next, tile);
  return next;
}

function incrementTile(counts: Counts34, tile: string): void {
  const index = tileIndex(tile);
  if (counts[index]! >= 4) {
    throw new Error(`${tileName(index)} is already used four times.`);
  }
  counts[index] += 1;
}

export function removeTile(counts: Counts34, tile: string): Counts34 {
  const next = counts.slice();
  const index = tileIndex(tile);
  if (next[index]! <= 0) {
    throw new Error(`${tileName(index)} is not in the hand.`);
  }
  next[index] -= 1;
  return next;
}

export function sumCounts(counts: Counts34): number {
  return counts.reduce((total, count) => total + count, 0);
}
