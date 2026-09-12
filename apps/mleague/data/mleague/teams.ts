import type { Team } from "@/types/mleague";

const checkedAt = "2026-08-01";

export const teams: Team[] = [
  {
    id: "team-abemas",
    slug: "shibuya-abemas",
    name: "渋谷ABEMAS",
    description:
      "渋谷を拠点のモチーフとする、Mリーグ創設時から参加するチームです。",
    officialWebsiteUrl: "https://m-league.jp/teams/abemas/",
    sources: [
      {
        label: "渋谷ABEMAS チームページ",
        url: "https://m-league.jp/teams/abemas/",
        sourceType: "mleague_official",
        checkedAt,
      },
    ],
    lastVerifiedAt: checkedAt,
    publicationStatus: "published",
  },
  {
    id: "team-fightclub",
    slug: "konami-mahjong-fight-club",
    name: "KONAMI麻雀格闘倶楽部",
    description:
      "麻雀ゲーム『麻雀格闘倶楽部』の名を冠し、Mリーグ創設時から参加するチームです。",
    officialWebsiteUrl: "https://m-league.jp/teams/fightclub/",
    sources: [
      {
        label: "KONAMI麻雀格闘倶楽部 チームページ",
        url: "https://m-league.jp/teams/fightclub/",
        sourceType: "mleague_official",
        checkedAt,
      },
    ],
    lastVerifiedAt: checkedAt,
    publicationStatus: "published",
  },
  {
    id: "team-drivens",
    slug: "akasaka-drivens",
    name: "赤坂ドリブンズ",
    description:
      "赤坂を拠点のモチーフとし、Mリーグ創設時から参加するチームです。",
    officialWebsiteUrl: "https://m-league.jp/teams/drivens/",
    sources: [
      {
        label: "赤坂ドリブンズ チームページ",
        url: "https://m-league.jp/teams/drivens/",
        sourceType: "mleague_official",
        checkedAt,
      },
    ],
    lastVerifiedAt: checkedAt,
    publicationStatus: "published",
  },
  {
    id: "team-furinkazan",
    slug: "ex-furinkazan",
    name: "EX風林火山",
    description:
      "Mリーグ創設時から参加し、風林火山をチーム名に掲げるチームです。",
    officialWebsiteUrl: "https://m-league.jp/teams/furinkazan/",
    sources: [
      {
        label: "EX風林火山 チームページ",
        url: "https://m-league.jp/teams/furinkazan/",
        sourceType: "mleague_official",
        checkedAt,
      },
    ],
    lastVerifiedAt: checkedAt,
    publicationStatus: "published",
  },
  {
    id: "team-phoenix",
    slug: "sega-sammy-phoenix",
    name: "セガサミーフェニックス",
    description:
      "不死鳥のように何度でも羽ばたく姿をチーム名に掲げ、Mリーグ創設時から参加するチームです。",
    officialWebsiteUrl: "https://m-league.jp/teams/phoenix/",
    sources: [
      {
        label: "セガサミーフェニックス チームページ",
        url: "https://m-league.jp/teams/phoenix/",
        sourceType: "mleague_official",
        checkedAt,
      },
    ],
    lastVerifiedAt: checkedAt,
    publicationStatus: "published",
  },
  {
    id: "team-sakuraknights",
    slug: "kadokawa-sakura-knights",
    name: "KADOKAWAサクラナイツ",
    description:
      "桜と騎士をチーム名に掲げ、2019-20シーズンからMリーグに参加するチームです。",
    officialWebsiteUrl: "https://m-league.jp/teams/sakuraknights/",
    sources: [
      {
        label: "KADOKAWAサクラナイツ チームページ",
        url: "https://m-league.jp/teams/sakuraknights/",
        sourceType: "mleague_official",
        checkedAt,
      },
    ],
    lastVerifiedAt: checkedAt,
    publicationStatus: "published",
  },
  {
    id: "team-pirates",
    slug: "u-next-pirates",
    name: "U-NEXT Pirates",
    description:
      "麻雀のプロスポーツ化という大海原へ進むイメージで名付けられた、Mリーグ創設時から参加するチームです。",
    officialWebsiteUrl: "https://m-league.jp/teams/pirates/",
    sources: [
      {
        label: "U-NEXT Pirates チームページ",
        url: "https://m-league.jp/teams/pirates/",
        sourceType: "mleague_official",
        checkedAt,
      },
    ],
    lastVerifiedAt: checkedAt,
    publicationStatus: "published",
  },
  {
    id: "team-raiden",
    slug: "team-raiden",
    name: "TEAM RAIDEN / 雷電",
    description:
      "『雷電の麻雀は面白いんです！』を掲げ、Mリーグ創設時から参加するチームです。",
    officialWebsiteUrl: "https://m-league.jp/teams/raiden/",
    sources: [
      {
        label: "TEAM RAIDEN / 雷電 チームページ",
        url: "https://m-league.jp/teams/raiden/",
        sourceType: "mleague_official",
        checkedAt,
      },
    ],
    lastVerifiedAt: checkedAt,
    publicationStatus: "published",
  },
  {
    id: "team-beast",
    slug: "beast-x",
    name: "BEAST X",
    description:
      "2023-24シーズンからMリーグに参加し、攻めの姿勢を掲げるチームです。",
    officialWebsiteUrl: "https://m-league.jp/teams/beast/",
    sources: [
      {
        label: "BEAST X チームページ",
        url: "https://m-league.jp/teams/beast/",
        sourceType: "mleague_official",
        checkedAt,
      },
    ],
    lastVerifiedAt: checkedAt,
    publicationStatus: "published",
  },
  {
    id: "team-jets",
    slug: "earth-jets",
    name: "EARTH JETS",
    description:
      "2025-26シーズンからMリーグに参加するチームです。",
    officialWebsiteUrl: "https://earth-jets.jp/",
    sources: [
      {
        label: "EARTH JETS 公式サイト",
        url: "https://earth-jets.jp/",
        sourceType: "team_official",
        checkedAt,
      },
      {
        label: "Mリーグ EARTH JETS チームページ",
        url: "https://m-league.jp/teams/jets/",
        sourceType: "mleague_official",
        checkedAt,
      },
    ],
    lastVerifiedAt: checkedAt,
    publicationStatus: "published",
  },
];
