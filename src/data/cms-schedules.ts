import type { Game, GameSite, GameStatus, Team } from "@/domain/models";

interface CMSGame {
  id: string;
  date: string;
  time?: string;
  opponent: string;
  eventTitle?: string;
  homeAway: GameSite;
  location?: string;
  status: GameStatus;
  sourceUrl?: string;
  updatedAt?: string;
}

interface CMSSeason {
  season: string;
  games: CMSGame[];
}

interface CMSResponse {
  seasons?: CMSSeason[];
}

const cmsUrl = process.env.CMS_PUBLIC_URL || "https://north-county-press.onrender.com";

function displaySeason(value: string) {
  return value.replace(/(\d{4})-(\d{2})/, "$1–$2");
}

export async function getCMSSchedule(team: Team): Promise<Record<string, Game[]>> {
  const endpoint = new URL("/api/public-schedules", cmsUrl);
  endpoint.searchParams.set("school", team.schoolSlug);
  endpoint.searchParams.set("sport", team.sportSlug);

  try {
    const response = await fetch(endpoint, { cache: "force-cache" });
    if (!response.ok) throw new Error(`CMS schedule request returned ${response.status}`);
    const data = (await response.json()) as CMSResponse;

    return Object.fromEntries((data.seasons || []).map((season) => {
      const label = displaySeason(season.season);
      const teamId = `${team.schoolSlug}-${team.sportSlug}-${label}`;
      return [label, season.games.map((game) => ({
        ...game,
        teamId,
        dataStatus: "verified" as const,
        cmsManaged: true,
      }))];
    }));
  } catch (error) {
    console.warn(`Unable to load CMS schedule for ${team.id}:`, error);
    return {};
  }
}
