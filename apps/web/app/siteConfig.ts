export const siteConfig = {
  externalSites: {
    mLeaguePlayerDirectory: {
      label: "Mリーグ選手名鑑",
      href:
        process.env.NEXT_PUBLIC_MLEAGUE_DIRECTORY_URL ??
        "https://mleague-player-directory.shohei-yamatani.chatgpt.site/mleague"
    }
  }
} as const;
