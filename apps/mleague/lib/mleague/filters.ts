import type { PlayerFilterValues, PlayerListItem } from "@/types/mleague";

export const defaultPlayerFilters: PlayerFilterValues = {
  nameQuery: "",
  kanaQuery: "",
  teamId: "",
  association: "",
  debutSeason: "",
  gojuon: "",
};

export const gojuonRows = ["あ", "か", "さ", "た", "な", "は", "ま", "や", "ら", "わ"];

function toHiragana(value: string) {
  return value.replace(/[ァ-ヶ]/g, (character) =>
    String.fromCharCode(character.charCodeAt(0) - 0x60),
  );
}

function normalize(value: string) {
  return toHiragana(value)
    .normalize("NFKC")
    .toLocaleLowerCase("ja")
    .replace(/[\s　]+/g, "");
}

const rowCharacters: Record<string, string> = {
  あ: "あいうえお",
  か: "かきくけこがぎぐげご",
  さ: "さしすせそざじずぜぞ",
  た: "たちつてとだぢづでど",
  な: "なにぬねの",
  は: "はひふへほばびぶべぼぱぴぷぺぽ",
  ま: "まみむめも",
  や: "やゆよ",
  ら: "らりるれろ",
  わ: "わをん",
};

export function filterPlayers(
  players: PlayerListItem[],
  filters: PlayerFilterValues,
) {
  return players.filter((player) => {
    const searchableProfile = normalize(
      [
        player.name,
        player.displayName,
        player.nameKana,
        player.proAssociation,
        player.currentTeam?.name,
      ]
        .filter(Boolean)
        .join(" "),
    );
    const nameMatches = searchableProfile.includes(normalize(filters.nameQuery));
    const kanaMatches = normalize(player.nameKana).includes(
      normalize(filters.kanaQuery),
    );
    const teamMatches =
      !filters.teamId || player.currentTeam?.id === filters.teamId;
    const associationMatches =
      !filters.association || player.proAssociation === filters.association;
    const debutMatches =
      !filters.debutSeason ||
      player.mLeagueDebutSeason === filters.debutSeason;
    const firstKana = normalize(player.nameKana).charAt(0);
    const gojuonMatches =
      !filters.gojuon || rowCharacters[filters.gojuon]?.includes(firstKana);

    return (
      nameMatches &&
      kanaMatches &&
      teamMatches &&
      associationMatches &&
      debutMatches &&
      gojuonMatches
    );
  });
}
