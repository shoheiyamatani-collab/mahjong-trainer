export const siteConfig = {
  brand: {
    name: "雀フォリオ",
    englishName: "JONGFOLIO",
    tagline: "麻雀を知る、学ぶ、強くなる。"
  },
  features: {
    // trueに戻すと、保管中のMリーグ関連導線をサイト全体へ再掲載できます。
    showMLeagueLinks: false,
    // ルール記事は残したまま、ヘッダーの入口だけを一時的に非表示にします。
    showRulesNavigation: false
  },
  externalSites: {
    mLeaguePlayerDirectory: {
      label: "Mリーグについて知る",
      href:
        process.env.NEXT_PUBLIC_MLEAGUE_DIRECTORY_URL ??
        "https://mleague-player-directory.shohei-yamatani.chatgpt.site/mleague"
    }
  }
} as const;
