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
    sports: ["boys-basketball", "girls-basketball"],
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
  team("sage-creek", "boys-basketball", "Boys’ Basketball", "2025–26"),
  team("sage-creek", "girls-basketball", "Girls’ Basketball", "2025–26"),
];

const BOYS_ID = "sage-creek-boys-basketball-2025–26";
const GIRLS_ID = "sage-creek-girls-basketball-2025–26";
const BOYS_SOURCE = "https://sagecreek.homecampus.com/varsity/basketball-boys/schedule-results";
const GIRLS_SOURCE = "https://sagecreek.homecampus.com/varsity/basketball-girls/schedule-results";

type ScheduleRow = [date: string, time: string, homeAway: "Home" | "Away", opponent: string, location?: string];

function verifiedGames(teamId: string, sourceUrl: string, rows: ScheduleRow[]): Game[] {
  return rows.map(([date, time, homeAway, opponent, location], index) => ({
    id: `${teamId}-${index + 1}`,
    teamId,
    date,
    time,
    opponent,
    homeAway,
    location,
    status: "final",
    sourceUrl,
    dataStatus: "verified",
  }));
}

export const games: Game[] = [
  ...verifiedGames(BOYS_ID, BOYS_SOURCE, [
    ["2025-11-17", "7:00 PM", "Home", "La Jolla"],
    ["2025-11-19", "7:00 PM", "Home", "Army-Navy Academy"],
    ["2025-11-25", "7:00 PM", "Away", "Lincoln/San Diego"],
    ["2025-11-26", "TBA", "Away", "Santa Fe Christian"],
    ["2025-11-28", "TBA", "Away", "Mira Mesa"],
    ["2025-11-29", "TBA", "Away", "Helix"],
    ["2025-12-01", "7:00 PM", "Home", "Steele Canyon"],
    ["2025-12-03", "7:00 PM", "Home", "Santa Fe Christian"],
    ["2025-12-09", "7:00 PM", "Away", "Del Norte"],
    ["2025-12-12", "7:30 PM", "Home", "Poway"],
    ["2025-12-17", "6:30 PM", "Away", "Victory Christian Academy"],
    ["2025-12-19", "7:00 PM", "Away", "Pacific Ridge"],
    ["2025-12-26", "TBA", "Home", "Crawford"],
    ["2025-12-27", "TBA", "Home", "Army-Navy Academy"],
    ["2025-12-29", "TBA", "Home", "Del Norte"],
    ["2025-12-30", "TBA", "Home", "Laguna Creek"],
    ["2026-01-07", "7:00 PM", "Home", "Mission Hills"],
    ["2026-01-09", "7:00 PM", "Home", "Del Lago Academy"],
    ["2026-01-13", "7:00 PM", "Away", "La Costa Canyon"],
    ["2026-01-16", "7:00 PM", "Away", "Rancho Buena Vista"],
    ["2026-01-20", "7:00 PM", "Home", "Torrey Pines"],
    ["2026-01-23", "7:00 PM", "Home", "Carlsbad"],
    ["2026-01-30", "7:00 PM", "Home", "La Costa Canyon"],
    ["2026-02-03", "7:00 PM", "Home", "Rancho Buena Vista"],
    ["2026-02-06", "7:00 PM", "Away", "Torrey Pines"],
    ["2026-02-10", "6:00 PM", "Away", "Saint Augustine"],
    ["2026-02-11", "7:00 PM", "Home", "Tri City Christian"],
    ["2026-02-12", "7:00 PM", "Away", "Carlsbad"],
    ["2026-02-18", "7:00 PM", "Away", "Bonita Vista"],
  ]),
  ...verifiedGames(GIRLS_ID, GIRLS_SOURCE, [
    ["2025-11-18", "7:00 PM", "Away", "Sweetwater"],
    ["2025-11-21", "7:00 PM", "Away", "Escondido"],
    ["2025-11-29", "12:00 PM", "Away", "Imperial"],
    ["2025-12-02", "7:00 PM", "Away", "Mater Dei Catholic"],
    ["2025-12-05", "7:00 PM", "Home", "Grossmont"],
    ["2025-12-06", "TBA", "Away", "Coronado"],
    ["2025-12-09", "6:30 PM", "Home", "Del Norte"],
    ["2025-12-12", "7:00 PM", "Away", "Poway"],
    ["2025-12-13", "7:30 PM", "Away", "La Jolla", "Valley Brave Winter Classic"],
    ["2025-12-17", "7:30 PM", "Home", "Granite Hills", "Valley Brave Winter Classic · El Cajon Valley High School"],
    ["2025-12-19", "6:00 PM", "Home", "El Cajon Valley", "Valley Brave Winter Classic · El Cajon Valley High School"],
    ["2025-12-20", "6:00 PM", "Home", "Rancho Bernardo", "Valley Brave Winter Classic · El Cajon Valley High School"],
    ["2025-12-27", "TBA", "Home", "Ontario", "Holiday Classic Tournament"],
    ["2025-12-29", "TBA", "Home", "Wilson", "Holiday Classic Tournament"],
    ["2025-12-30", "TBA", "Home", "Brea Olinda", "Holiday Classic Tournament"],
    ["2026-01-05", "3:00 PM", "Home", "Canyon Hills", "New Year Classic · Sweetwater High School"],
    ["2026-01-06", "3:00 PM", "Home", "Hilltop", "New Year Classic · Sweetwater High School"],
    ["2026-01-06", "6:30 PM", "Home", "Southwest EC", "New Year Classic · Sweetwater High School"],
    ["2026-01-08", "5:00 PM", "Home", "Santa Fe Christian", "New Year Classic · Sweetwater High School"],
    ["2026-01-10", "5:00 PM", "Away", "Fallbrook"],
    ["2026-01-13", "5:30 PM", "Away", "La Costa Canyon"],
    ["2026-01-16", "5:30 PM", "Away", "Rancho Buena Vista"],
    ["2026-01-20", "5:30 PM", "Home", "Torrey Pines"],
    ["2026-01-23", "5:30 PM", "Home", "Carlsbad"],
    ["2026-01-30", "5:30 PM", "Home", "La Costa Canyon"],
    ["2026-02-03", "5:30 PM", "Home", "Rancho Buena Vista"],
    ["2026-02-06", "5:30 PM", "Away", "Torrey Pines"],
    ["2026-02-12", "5:30 PM", "Away", "Carlsbad"],
    ["2026-02-17", "7:00 PM", "Home", "Del Norte"],
  ]),
];

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
