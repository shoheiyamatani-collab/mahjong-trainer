const mLeagueDirectoryUrl =
  process.env.NEXT_PUBLIC_MLEAGUE_DIRECTORY_URL ??
  (process.env.NODE_ENV === "development"
    ? "http://localhost:3001/mleague"
    : "https://mleague-player-directory.shohei-yamatani.chatgpt.site/mleague");

export const siteConfig = {
  brand: {
    name: "雀フォリオ",
    englishName: "JONGFOLIO",
    tagline: "麻雀を知る、学ぶ、強くなる。"
  },
  features: {
    // Mリーグ動画は保管したまま、必要になるまで導線を非表示にします。
    showMLeagueLinks: false,
    // 対局情報サイトは環境変数が未設定の公開環境でも既定URLへ案内します。
    showMLeagueDirectoryLink: Boolean(mLeagueDirectoryUrl),
    // ルール記事は残したまま、ヘッダーの入口だけを一時的に非表示にします。
    showRulesNavigation: false
  },
  externalSites: {
    mLeaguePlayerDirectory: {
      label: "Mリーグについて知る",
      href: mLeagueDirectoryUrl
    }
  }
} as const;
