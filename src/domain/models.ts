export type SchoolSlug = "carlsbad" | "sage-creek";
export type SportSlug = "football" | "boys-basketball" | "girls-basketball";

export interface School {
  slug: SchoolSlug;
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

export interface Game {
  id: string;
  teamId: string;
  date: string;
  time?: string;
  opponent: string;
  homeAway: "Home" | "Away";
  location?: string;
  status: "scheduled" | "final";
  teamScore?: number;
  opponentScore?: number;
  storyUrl?: string;
  dataStatus: "placeholder" | "verified";
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
