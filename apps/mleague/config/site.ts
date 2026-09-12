const siteOrigin =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://jongfolio.com";

const basePath = "/mleague";

export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "Mリーグ対局情報",
  siteOrigin,
  homeUrl: process.env.NEXT_PUBLIC_SITE_HOME_URL || `${siteOrigin}${basePath}`,
  mahjongAppUrl: process.env.NEXT_PUBLIC_MAHJONG_APP_URL || "",
  basePath,
  routes: {
    home: "/",
    players: "/players",
    mahjongPros: "/pros",
    clips: "/clips",
    recentClips: "/clips/recent",
    highlightClips: "/clips/highlights",
    teams: "/teams",
    events: "/events",
    policy: "/policy",
    correctionRequest: "/correction-request",
  },
} as const;
