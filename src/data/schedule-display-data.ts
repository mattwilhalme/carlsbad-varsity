import type { PublicScheduleDisplaySnapshotV1 } from "@/data/article-contract";
import publicContent from "@/data/generated/public-content.v1.json";
import type { Game, SchoolSlug, SportSlug, Team } from "@/domain/models";

const snapshot = (publicContent as { scheduleDisplay: PublicScheduleDisplaySnapshotV1 }).scheduleDisplay;
const display = snapshot.display;
const schoolSlugs = new Set<SchoolSlug>(["carlsbad", "sage-creek"]);
const sportSlugs = new Set<SportSlug>(["boys-basketball", "girls-basketball"]);

function displaySeason(value: string) {
  return value.replace(/(\d{4})-(\d{2})/, "$1–$2");
}

function gameTime(startsAt: string | null, timeTBD: boolean) {
  if (timeTBD || !startsAt) return undefined;
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric", minute: "2-digit", timeZone: "America/Los_Angeles",
  }).format(new Date(startsAt));
}

export const hasPublishedScheduleDisplay = Boolean(display);

export const curatedScheduleSources = (display?.sources || []).flatMap((source) => {
  const schoolSlug = source.team.school?.slug as SchoolSlug | undefined;
  const sportSlug = source.team.sport?.slug as SportSlug | undefined;
  if (!schoolSlug || !sportSlug || !schoolSlugs.has(schoolSlug) || !sportSlugs.has(sportSlug)) return [];
  const season = displaySeason(source.team.season);
  const team: Team = {
    id: `${schoolSlug}-${sportSlug}-${season}`,
    schoolSlug,
    sportSlug,
    sportName: source.team.sport?.name || sportSlug,
    level: "Varsity",
    season,
  };
  const games: Game[] = source.games.map((game) => ({
    id: game.id,
    teamId: team.id,
    schoolSlug,
    sportSlug,
    sportName: team.sportName,
    season,
    date: game.date,
    time: gameTime(game.startsAt, game.timeTBD),
    opponent: game.opponent,
    eventTitle: game.eventTitle || undefined,
    homeAway: game.site === "home" ? "Home" : game.site === "away" ? "Away" : "Neutral",
    location: game.venue || undefined,
    status: game.status,
    updatedAt: game.updatedAt,
    dataStatus: "verified",
    cmsManaged: true,
  }));
  return [{ ...source, team, games }];
});

export const curatedScheduleTeams = curatedScheduleSources.map((source) => source.team);
export const curatedScheduleGames = curatedScheduleSources.flatMap((source) => source.games);

export function getCuratedTeamSchedules(team: Team): Record<string, Game[]> {
  return Object.fromEntries(curatedScheduleSources
    .filter((source) => source.destinations.includes("team-page") && source.team.schoolSlug === team.schoolSlug && source.team.sportSlug === team.sportSlug)
    .map((source) => [source.team.season, source.games]));
}

function localDate(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    year: "numeric", month: "2-digit", day: "2-digit", timeZone: "America/Los_Angeles",
  }).formatToParts(now);
  const value = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value;
  return `${value("year")}-${value("month")}-${value("day")}`;
}

export function getCuratedHomepageGames(now = new Date()) {
  const today = localDate(now);
  const upcoming = curatedScheduleSources
    .filter((source) => source.destinations.includes("homepage-upcoming"))
    .flatMap((source) => source.games)
    .filter((game) => game.date >= today && (game.status === "scheduled" || game.status === "postponed"))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 4);
  const results = curatedScheduleSources
    .filter((source) => source.destinations.includes("homepage-results"))
    .flatMap((source) => source.games)
    .filter((game) => game.status === "final")
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 4);
  return { upcoming, results };
}
