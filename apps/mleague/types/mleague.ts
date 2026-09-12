export type PublicationStatus = "draft" | "published" | "archived";

export type Source = {
  label: string;
  url: string;
  sourceType:
    | "mleague_official"
    | "team_official"
    | "association_official"
    | "player_official"
    | "venue_official"
    | "other";
  checkedAt: string;
};

export type SocialLinks = {
  x?: string;
  instagram?: string;
  youtube?: string;
  website?: string;
  note?: string;
};

export type OfficialAccount = {
  name: string;
  handle: string;
  url: string;
};

export type PlayerVerifiedProfile = {
  birthDate: string | null;
  birthplace: string | null;
  organization: {
    name: string;
    officialUrl: string;
  };
  organizationLeague: {
    name: string;
    season?: string;
    officialUrl: string;
  } | null;
  officialAccounts: {
    x?: OfficialAccount;
    youtube?: OfficialAccount;
  };
  researchReferences?: {
    label: string;
    url: string;
  }[];
};

export type PlayerBook = {
  id: string;
  title: string;
  isbn13: string | null;
  role:
    | "author"
    | "coauthor"
    | "supervisor"
    | "subject"
    | "original_author"
    | "unspecified";
  coauthors?: string[];
  publisher?: string;
  publisherUrl?: string | null;
  releaseDate?: string;
  releaseYear?: number;
  description?: string;
  coverImageUrl?: string | null;
  amazonAffiliateUrl?: string | null;
  rakutenAffiliateUrl?: string | null;
  amazonUrl?: string | null;
  rakutenUrl?: string | null;
  isPublished: boolean;
  needsReview?: boolean;
  reviewNote?: string;
};

export type Achievement = {
  title: string;
  year?: string;
  sourceUrl?: string;
};

export type Player = {
  id: string;
  slug: string;
  name: string;
  nameKana: string;
  displayName: string;
  biography?: string;
  playStyleSummary?: string;
  proAssociation?: string;
  mLeagueDebutSeason?: string;
  nicknames?: string[];
  achievements?: Achievement[];
  officialProfileUrl?: string;
  socialLinks: SocialLinks;
  verifiedProfile?: PlayerVerifiedProfile;
  sources: Source[];
  lastVerifiedAt: string;
  publicationStatus: PublicationStatus;
};

export type Team = {
  id: string;
  slug: string;
  name: string;
  description?: string;
  officialWebsiteUrl?: string;
  sources: Source[];
  lastVerifiedAt: string;
  publicationStatus: PublicationStatus;
};

export type TeamMembership = {
  id: string;
  playerId: string;
  teamId: string;
  startSeason: string;
  endSeason?: string;
  status: "active" | "completed";
  sourceUrl: string;
  verifiedAt: string;
};

export type SeasonResult = {
  id: string;
  playerId: string;
  season: string;
  regularSeasonPoints?: number;
  semiFinalPoints?: number;
  finalPoints?: number;
  matchesPlayed?: number;
  firstPlaceCount?: number;
  secondPlaceCount?: number;
  thirdPlaceCount?: number;
  fourthPlaceCount?: number;
  sourceUrl?: string;
  sourceLabel?: string;
  verifiedAt: string;
};

export type PlayerCareerStats = {
  playerId: string;
  matchesPlayed: number;
  totalPoints: number;
  averagePlacement: number | null;
  firstPlaceCount: number;
  secondPlaceCount: number;
  thirdPlaceCount: number;
  fourthPlaceCount: number;
  topRate: number | null;
  topTwoRate: number | null;
  lastAvoidanceRate: number | null;
  pointsPerMatch: number | null;
  period: string;
  sourceLabel: string;
  verifiedAt: string;
  notes: string[];
};

export type PlayerEvent = {
  id: string;
  slug: string;
  playerIds: string[];
  eventType:
    | "mahjong_guest"
    | "tournament"
    | "talk_event"
    | "public_viewing"
    | "meet_and_greet"
    | "public_match"
    | "other";
  title: string;
  description?: string;
  startAt: string;
  endAt?: string;
  venueName?: string;
  prefecture?: string;
  city?: string;
  publicAttendance: boolean;
  reservationRequired?: boolean;
  officialAnnouncementUrl: string;
  reservationUrl?: string;
  sourceType:
    | "player_official"
    | "venue_official"
    | "team_official"
    | "league_official"
    | "association_official";
  status: "scheduled" | "cancelled" | "completed" | "unconfirmed";
  announcedAt?: string;
  verifiedAt: string;
  publishUntil?: string;
  publicationStatus: PublicationStatus;
};

export type PlayerListItem = Player & {
  currentTeam?: Pick<Team, "id" | "slug" | "name">;
};

export type PlayerFilterValues = {
  nameQuery: string;
  kanaQuery: string;
  teamId: string;
  association: string;
  debutSeason: string;
  gojuon: string;
};
