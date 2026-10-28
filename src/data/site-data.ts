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

type ScheduleRow = [id: string, date: string, time: string, homeAway: "Home" | "Away", opponent: string, teamScore: number, opponentScore: number, location?: string];

function verifiedGames(teamId: string, sourceUrl: string, rows: ScheduleRow[]): Game[] {
  return rows.map(([id, date, time, homeAway, opponent, teamScore, opponentScore, location]) => ({
    id,
    teamId,
    date,
    time,
    opponent,
    homeAway,
    location,
    status: "final",
    teamScore,
    opponentScore,
    result: teamScore > opponentScore ? "W" : teamScore < opponentScore ? "L" : "T",
    sourceUrl,
    dataStatus: "verified",
  }));
}

export const games: Game[] = [
  ...verifiedGames(BOYS_ID, BOYS_SOURCE, [
    ["sc-bbb-2025-001", "2025-11-17", "7:00 PM", "Home", "La Jolla", 51, 44],
    ["sc-bbb-2025-002", "2025-11-19", "7:00 PM", "Home", "Army-Navy Academy", 71, 61],
    ["sc-bbb-2025-003", "2025-11-25", "7:00 PM", "Away", "Lincoln/San Diego", 50, 27],
    ["sc-bbb-2025-004", "2025-11-26", "TBA", "Away", "Santa Fe Christian", 58, 65],
    ["sc-bbb-2025-005", "2025-11-28", "TBA", "Away", "Mira Mesa", 64, 72],
    ["sc-bbb-2025-006", "2025-11-29", "TBA", "Away", "Helix", 47, 60],
    ["sc-bbb-2025-007", "2025-12-01", "7:00 PM", "Home", "Steele Canyon", 61, 30],
    ["sc-bbb-2025-008", "2025-12-03", "7:00 PM", "Home", "Santa Fe Christian", 43, 73],
    ["sc-bbb-2025-009", "2025-12-09", "7:00 PM", "Away", "Del Norte", 56, 48],
    ["sc-bbb-2025-010", "2025-12-12", "7:30 PM", "Home", "Poway", 49, 65],
    ["sc-bbb-2025-011", "2025-12-17", "6:30 PM", "Away", "Victory Christian Academy", 39, 81],
    ["sc-bbb-2025-012", "2025-12-19", "7:00 PM", "Away", "Pacific Ridge", 71, 60],
    ["sc-bbb-2025-013", "2025-12-26", "TBA", "Home", "Crawford", 79, 57],
    ["sc-bbb-2025-014", "2025-12-27", "TBA", "Home", "Army-Navy Academy", 50, 51],
    ["sc-bbb-2025-015", "2025-12-29", "TBA", "Home", "Del Norte", 59, 72],
    ["sc-bbb-2025-016", "2025-12-30", "TBA", "Home", "Laguna Creek", 60, 62],
    ["sc-bbb-2025-017", "2026-01-07", "7:00 PM", "Home", "Mission Hills", 50, 56],
    ["sc-bbb-2025-018", "2026-01-09", "7:00 PM", "Home", "Del Lago Academy", 76, 50],
    ["sc-bbb-2025-019", "2026-01-13", "7:00 PM", "Away", "La Costa Canyon", 63, 70],
    ["sc-bbb-2025-020", "2026-01-16", "7:00 PM", "Away", "Rancho Buena Vista", 65, 71],
    ["sc-bbb-2025-021", "2026-01-20", "7:00 PM", "Home", "Torrey Pines", 41, 75],
    ["sc-bbb-2025-022", "2026-01-23", "7:00 PM", "Home", "Carlsbad", 53, 58],
    ["sc-bbb-2025-023", "2026-01-30", "7:00 PM", "Home", "La Costa Canyon", 42, 61],
    ["sc-bbb-2025-024", "2026-02-03", "7:00 PM", "Home", "Rancho Buena Vista", 49, 55],
    ["sc-bbb-2025-025", "2026-02-06", "7:00 PM", "Away", "Torrey Pines", 49, 73],
    ["sc-bbb-2025-026", "2026-02-10", "6:00 PM", "Away", "Saint Augustine", 43, 41],
    ["sc-bbb-2025-027", "2026-02-11", "7:00 PM", "Home", "Tri City Christian", 42, 39],
    ["sc-bbb-2025-028", "2026-02-12", "7:00 PM", "Away", "Carlsbad", 69, 77],
    ["sc-bbb-2025-029", "2026-02-18", "7:00 PM", "Away", "Bonita Vista", 50, 64],
  ]),
  ...verifiedGames(GIRLS_ID, GIRLS_SOURCE, [
    ["sc-gbb-2025-001", "2025-11-18", "7:00 PM", "Away", "Sweetwater", 64, 8],
    ["sc-gbb-2025-002", "2025-11-21", "7:00 PM", "Away", "Escondido", 42, 34],
    ["sc-gbb-2025-003", "2025-11-29", "12:00 PM", "Away", "Imperial", 29, 47],
    ["sc-gbb-2025-004", "2025-12-02", "7:00 PM", "Away", "Mater Dei Catholic", 29, 68],
    ["sc-gbb-2025-005", "2025-12-05", "7:00 PM", "Home", "Grossmont", 44, 49],
    ["sc-gbb-2025-006", "2025-12-06", "TBA", "Away", "Coronado", 72, 11],
    ["sc-gbb-2025-007", "2025-12-09", "6:30 PM", "Home", "Del Norte", 44, 37],
    ["sc-gbb-2025-008", "2025-12-12", "7:00 PM", "Away", "Poway", 47, 31],
    ["sc-gbb-2025-009", "2025-12-13", "7:30 PM", "Away", "La Jolla", 64, 30, "Valley Brave Winter Classic"],
    ["sc-gbb-2025-010", "2025-12-17", "7:30 PM", "Home", "Granite Hills", 55, 27, "Valley Brave Winter Classic · El Cajon Valley High School"],
    ["sc-gbb-2025-011", "2025-12-19", "6:00 PM", "Home", "El Cajon Valley", 49, 36, "Valley Brave Winter Classic · El Cajon Valley High School"],
    ["sc-gbb-2025-012", "2025-12-20", "6:00 PM", "Home", "Rancho Bernardo", 26, 46, "Valley Brave Winter Classic · El Cajon Valley High School"],
    ["sc-gbb-2025-013", "2025-12-27", "TBA", "Home", "Ontario", 34, 40, "Holiday Classic Tournament"],
    ["sc-gbb-2025-014", "2025-12-29", "TBA", "Home", "Wilson", 56, 72, "Holiday Classic Tournament"],
    ["sc-gbb-2025-015", "2025-12-30", "TBA", "Home", "Brea Olinda", 31, 32, "Holiday Classic Tournament"],
    ["sc-gbb-2025-016", "2026-01-05", "3:00 PM", "Home", "Canyon Hills", 40, 43, "New Year Classic · Sweetwater High School"],
    ["sc-gbb-2025-017", "2026-01-06", "3:00 PM", "Home", "Hilltop", 48, 22, "New Year Classic · Sweetwater High School"],
    ["sc-gbb-2025-018", "2026-01-06", "6:30 PM", "Home", "Southwest EC", 57, 22, "New Year Classic · Sweetwater High School"],
    ["sc-gbb-2025-019", "2026-01-08", "5:00 PM", "Home", "Santa Fe Christian", 36, 41, "New Year Classic · Sweetwater High School"],
    ["sc-gbb-2025-020", "2026-01-10", "5:00 PM", "Away", "Fallbrook", 41, 49],
    ["sc-gbb-2025-021", "2026-01-13", "5:30 PM", "Away", "La Costa Canyon", 18, 52],
    ["sc-gbb-2025-022", "2026-01-16", "5:30 PM", "Away", "Rancho Buena Vista", 39, 44],
    ["sc-gbb-2025-023", "2026-01-20", "5:30 PM", "Home", "Torrey Pines", 37, 56],
    ["sc-gbb-2025-024", "2026-01-23", "5:30 PM", "Home", "Carlsbad", 28, 75],
    ["sc-gbb-2025-025", "2026-01-30", "5:30 PM", "Home", "La Costa Canyon", 31, 57],
    ["sc-gbb-2025-026", "2026-02-03", "5:30 PM", "Home", "Rancho Buena Vista", 41, 39],
    ["sc-gbb-2025-027", "2026-02-06", "5:30 PM", "Away", "Torrey Pines", 40, 64],
    ["sc-gbb-2025-028", "2026-02-12", "5:30 PM", "Away", "Carlsbad", 26, 53],
    ["sc-gbb-2025-029", "2026-02-17", "7:00 PM", "Home", "Del Norte", 61, 44],
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
