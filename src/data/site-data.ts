import type { Game, School, SchoolSlug, SportSlug, Story, Team } from "@/domain/models";

export const schools: Record<SchoolSlug, School> = {
  carlsbad: {
    slug: "carlsbad",
    name: "Carlsbad High School",
    shortName: "Carlsbad",
    mascot: "Lancers",
    officialUrl: "https://chs.carlsbadusd.net/",
    logo: "/images/carlsbad-athletics.webp",
    colors: { primary: "#4A2E80", gold: "#C5A059", bright: "#FFD700", ink: "#000000" },
    sports: ["boys-basketball", "girls-basketball"],
  },
  "sage-creek": {
    slug: "sage-creek",
    name: "Sage Creek High School",
    shortName: "Sage Creek",
    mascot: "Bobcats",
    officialUrl: "https://schs.carlsbadusd.net/",
    logo: "/images/sage-creek-bobcats.png",
    colors: { primary: "#004400", gold: "#B9A028", ink: "#07110a" },
    sports: ["football", "boys-basketball", "girls-basketball"],
  },
};

const team = (schoolSlug: SchoolSlug, sportSlug: SportSlug, sportName: string, season: Team["season"]): Team => ({
  id: `${schoolSlug}-${sportSlug}-${season}`,
  schoolSlug,
  sportSlug,
  sportName,
  level: "Varsity",
  season,
});

export const teams: Team[] = [
  team("carlsbad", "boys-basketball", "Boys’ Basketball", "2025–26"),
  team("carlsbad", "girls-basketball", "Girls’ Basketball", "2025–26"),
  team("sage-creek", "football", "Football", "2025"),
  team("sage-creek", "boys-basketball", "Boys’ Basketball", "2025–26"),
  team("sage-creek", "girls-basketball", "Girls’ Basketball", "2025–26"),
];

export const games: Game[] = [];

export const stories: Story[] = [
  {
    id: "sample-season-preview",
    teamIds: teams.map((item) => item.id),
    headline: "Season coverage will appear here",
    summary: "This sample card demonstrates how verified Carlsbad Varsity reporting will be presented once publishing begins.",
    source: "Carlsbad Varsity",
    contentStatus: "placeholder",
  },
];

export function getTeam(schoolSlug: string, sportSlug: string) {
  return teams.find((item) => item.schoolSlug === schoolSlug && item.sportSlug === sportSlug);
}
