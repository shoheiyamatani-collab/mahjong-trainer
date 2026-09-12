import type { CSSProperties } from "react";

type TeamTheme = {
  accent: string;
  accentStrong: string;
  secondary: string;
  soft: string;
  softAlt: string;
  secondarySoft: string;
  ink: string;
  onAccent: string;
};

type TeamThemeStyle = CSSProperties & {
  "--team-accent": string;
  "--team-accent-strong": string;
  "--team-secondary": string;
  "--team-soft": string;
  "--team-soft-alt": string;
  "--team-secondary-soft": string;
  "--team-ink": string;
  "--team-on-accent": string;
};

const defaultTheme: TeamTheme = {
  accent: "#26ae98",
  accentStrong: "#0a685c",
  secondary: "#74d4c3",
  soft: "#daf4ee",
  softAlt: "#f5fcfa",
  secondarySoft: "#e9f8f5",
  ink: "#07594f",
  onAccent: "#ffffff",
};

// Main and supporting colors are sampled from the official team logo assets
// displayed at https://m-league.jp/teams/.
export const teamThemes: Record<string, TeamTheme> = {
  "team-abemas": {
    accent: "#bfa566",
    accentStrong: "#806b36",
    secondary: "#231815",
    soft: "#f5eeda",
    softAlt: "#fbf8f0",
    secondarySoft: "#ebe7e4",
    ink: "#55451f",
    onAccent: "#ffffff",
  },
  "team-fightclub": {
    accent: "#231815",
    accentStrong: "#231815",
    secondary: "#847873",
    soft: "#ece9e7",
    softAlt: "#faf8f6",
    secondarySoft: "#f1efed",
    ink: "#231815",
    onAccent: "#ffffff",
  },
  "team-drivens": {
    accent: "#b71a35",
    accentStrong: "#7b0f20",
    secondary: "#cedb27",
    soft: "#fbe3e7",
    softAlt: "#f8f9dd",
    secondarySoft: "#f2f5bf",
    ink: "#63101f",
    onAccent: "#ffffff",
  },
  "team-furinkazan": {
    accent: "#d61718",
    accentStrong: "#8e1011",
    secondary: "#231815",
    soft: "#fbe1e1",
    softAlt: "#f7f3f1",
    secondarySoft: "#e9e5e3",
    ink: "#6d1112",
    onAccent: "#ffffff",
  },
  "team-phoenix": {
    accent: "#e62519",
    accentStrong: "#a21a13",
    secondary: "#f4e62b",
    soft: "#fce5e1",
    softAlt: "#fffbdc",
    secondarySoft: "#fff8be",
    ink: "#752019",
    onAccent: "#ffffff",
  },
  "team-sakuraknights": {
    accent: "#ef92ae",
    accentStrong: "#9f3e60",
    secondary: "#231815",
    soft: "#fbe6ec",
    softAlt: "#faf6f7",
    secondarySoft: "#ebe7e5",
    ink: "#5d2a3a",
    onAccent: "#ffffff",
  },
  "team-pirates": {
    accent: "#008fd0",
    accentStrong: "#00699a",
    secondary: "#fde1c4",
    soft: "#dff3fc",
    softAlt: "#fff2e5",
    secondarySoft: "#ffead5",
    ink: "#075b82",
    onAccent: "#ffffff",
  },
  "team-raiden": {
    accent: "#fff000",
    accentStrong: "#756800",
    secondary: "#231815",
    soft: "#fffacb",
    softAlt: "#f7f4e9",
    secondarySoft: "#e8e4e1",
    ink: "#443c00",
    onAccent: "#ffffff",
  },
  "team-beast": {
    accent: "#144324",
    accentStrong: "#0b2d18",
    secondary: "#aa933d",
    soft: "#dfebe3",
    softAlt: "#f4efd8",
    secondarySoft: "#eee6c4",
    ink: "#11371f",
    onAccent: "#ffffff",
  },
  "team-jets": {
    accent: "#e60012",
    accentStrong: "#a8000d",
    secondary: "#006835",
    soft: "#ffe4e5",
    softAlt: "#eff8f3",
    secondarySoft: "#dcefe5",
    ink: "#761018",
    onAccent: "#ffffff",
  },
};

export function getTeamThemeStyle(teamId?: string): TeamThemeStyle {
  const theme = (teamId && teamThemes[teamId]) || defaultTheme;

  return {
    "--team-accent": theme.accent,
    "--team-accent-strong": theme.accentStrong,
    "--team-secondary": theme.secondary,
    "--team-soft": theme.soft,
    "--team-soft-alt": theme.softAlt,
    "--team-secondary-soft": theme.secondarySoft,
    "--team-ink": theme.ink,
    "--team-on-accent": theme.onAccent,
  };
}
