export type CitySlug = "carlsbad";
export type SchoolSlug = "carlsbad" | "sage-creek";
export type SportSlug = "boys-basketball" | "girls-basketball";

export interface City {
  slug: CitySlug;
  name: string;
  region: string;
  schoolSlugs: SchoolSlug[];
}

export interface School {
  slug: SchoolSlug;
  citySlug: CitySlug;
  name: string;
  shortName: string;
  mascot: string;
  officialUrl: string;
  logo: string;
  colors: { primary: string; gold: string; bright?: string; ink: string };
  sports: SportSlug[];
}

export interface Team {
  id: string;
  schoolSlug: SchoolSlug;
  sportSlug: SportSlug;
  sportName: string;
  level: "Varsity";
  season: "2025" | "2025–26";
}

export type GameSite = "Home" | "Away" | "Neutral";
export type GameStatus = "scheduled" | "final" | "postponed" | "canceled";

export interface PeriodScore {
  period: string;
  teamScore: number;
  opponentScore: number;
}

export interface RelatedCoverage {
  id: string;
  publisher: string;
  headline: string;
  publishedAt?: string;
  url: string;
  imageUrl?: string;
  approvalStatus: "draft" | "approved";
}

export interface Game {
  /** Immutable editorial ID. Never derive this from fields an editor can change. */
  id: string;
  teamId: string;
  date: string;
  time?: string;
  opponent: string;
  opponentShortName?: string;
  opponentLogo?: string;
  homeAway: GameSite;
  location?: string;
  venueAddress?: string;
  status: GameStatus;
  teamScore?: number;
  opponentScore?: number;
  result?: "W" | "L" | "T";
  periodScores?: PeriodScore[];
  overtimeScores?: PeriodScore[];
  relatedCoverage?: RelatedCoverage[];
  storyUrl?: string;
  sourceUrl?: string;
  dataStatus: "placeholder" | "verified";
  deletedAt?: string;
  updatedAt?: string;
}

export interface Story {
  id: string;
  teamIds: string[];
  headline: string;
  summary: string;
  source: string;
  publishedAt?: string;
  articleUrl?: string;
  contentStatus: "placeholder" | "published";
}

export interface EditorialStory {
  slug: string;
  sport: string;
  headline: string;
  dek: string;
  byline: string;
  publishedAt: string;
  image: { src: string; alt: string; credit: string };
  relatedLinks: { label: string; href: string }[];
  body: string[];
  boxScore: {
    periods: string[];
    teams: { name: string; scores: number[]; total: number }[];
  };
}
