import type { HighlightClip } from "./highlights/highlight-clips";

export const latestMatchHighlight: HighlightClip = {
  id: "-Z_P4zVr_v8",
  tag: "9/18 ハイライト",
  title: "9/18 ハイライト｜黒沢咲と堀慎吾がトップ",
  summary:
    "第1試合は黒沢咲が62.5ポイント、第2試合は堀慎吾が51.0ポイントでトップを獲得した9月18日の公式ハイライトです。",
  channel: "M.LEAGUE [プロ麻雀リーグ]",
  url: "https://www.youtube.com/watch?v=-Z_P4zVr_v8",
  date: "2026年9月19日公開",
  competition: "9月18日 Mリーグ公式ハイライト",
};

export const recentClips: readonly HighlightClip[] = [
  latestMatchHighlight,
  {
    id: "CzzyTesP_uk",
    tag: "9/17 ハイライト",
    title: "9/17 ハイライト｜本田朋広の雷電初戦トップ、石井一馬のオーラス逆転",
    summary:
      "本田朋広がTEAM雷電のシーズン初戦をトップで飾り、石井一馬がオーラスで逆転トップを決めた9月17日の公式ハイライトです。",
    channel: "M.LEAGUE [プロ麻雀リーグ]",
    url: "https://www.youtube.com/watch?v=CzzyTesP_uk",
    date: "2026年9月18日公開",
    competition: "9月17日 Mリーグ公式ハイライト",
  },
  {
    id: "PGofTgy9ExA",
    tag: "茅森早香",
    title: "暗カンで裏ドラ4枚全乗り!? 驚愕の倍満で鮮烈な大逆転劇！",
    channel: "M.LEAGUE [プロ麻雀リーグ]",
    url: "https://www.youtube.com/shorts/PGofTgy9ExA",
    isShort: true,
    date: "2026年9月17日公開",
    competition: "9月15日 第2試合 南1局1本場",
  },
  {
    id: "hgqSRDVBa7I",
    tag: "内川幸太郎",
    title: "これぞ“真紅の烈風”な赤牌制覇の一発ツモ！",
    channel: "M.LEAGUE [プロ麻雀リーグ]",
    url: "https://www.youtube.com/shorts/hgqSRDVBa7I",
    isShort: true,
    date: "2026年9月17日公開",
    competition: "9月15日 第2試合 東3局2本場",
  },
  {
    id: "np15pEBIdCg",
    tag: "クセ強な鳴き",
    title: "尻無濱航｜クセ強な鳴きの所作",
    summary:
      "9月15日第1試合・東2局2本場。デビュー戦で話題になった、独特なポンの牌の置き方を収めた公式Shortsです。",
    channel: "M.LEAGUE [プロ麻雀リーグ]",
    url: "https://www.youtube.com/shorts/np15pEBIdCg",
    isShort: true,
    date: "2026年9月16日公開",
    competition: "9月15日 第1試合・東2局2本場",
  },
  {
    id: "CQwcMGPRxs8",
    tag: "9/15 ハイライト",
    title: "9/15 ハイライト｜尻無濱航のデビュー戦、醍醐大の倍満、茅森早香の裏4",
    summary:
      "尻無濱航のデビュー戦、醍醐大の倍満、茅森早香の裏ドラ4枚、内川幸太郎の見どころ局をまとめた公式ハイライトです。",
    channel: "M.LEAGUE [プロ麻雀リーグ]",
    url: "https://www.youtube.com/watch?v=CQwcMGPRxs8",
    date: "2026年9月16日公開",
    competition: "9月15日 Mリーグ公式ハイライト",
  },
  {
    id: "01zIiyDXfwI",
    tag: "9/14 ハイライト",
    title: "9/14 ハイライト｜朝倉康心の復帰戦、逢川恵夢の開幕戦トップ",
    summary:
      "2026-27シーズン開幕日の対局をまとめた公式ハイライト。朝倉康心の復帰戦や、逢川恵夢の開幕戦トップなどを振り返れます。",
    channel: "M.LEAGUE [プロ麻雀リーグ]",
    url: "https://www.youtube.com/watch?v=01zIiyDXfwI",
    date: "2026年9月15日公開",
    competition: "9月14日 開幕日公式ハイライト",
  },
] as const;
