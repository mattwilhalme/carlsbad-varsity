import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SchoolNewsWell } from "@/components/SchoolNewsWell";
import { SchoolSchedule } from "@/components/SchoolSchedule";
import { getSchoolStories } from "@/data/editorial-data";
import { curatedScheduleSources } from "@/data/schedule-display-data";
import { cities, games, teams } from "@/data/site-data";
import type { School } from "@/domain/models";

export function SchoolPageView({ school }: { school: School }) {
  const city = cities[school.citySlug];
  const activeSources = curatedScheduleSources.filter((source) => source.destinations.includes("team-page") && source.team.schoolSlug === school.slug);
  const activeSeasons = new Map<string, typeof games>();
  for (const source of activeSources) activeSeasons.set(source.team.season, [...(activeSeasons.get(source.team.season) || []), ...source.games]);
  const activeSeasonNames = new Set(activeSeasons.keys());
  const schoolTeams = teams.filter((team) => team.schoolSlug === school.slug);
  const legacySeasons = new Map<string, typeof games>();
  for (const team of schoolTeams) {
    if (activeSeasonNames.has(team.season)) continue;
    const teamGames = games.filter((game) => game.teamId === team.id);
    if (teamGames.length) legacySeasons.set(team.season, [...(legacySeasons.get(team.season) || []), ...teamGames]);
  }
  const sortGames = (items: typeof games) => [...items].sort((a, b) => a.date.localeCompare(b.date) || (a.time ?? "").localeCompare(b.time ?? ""));
  const seasons = [
    ...[...activeSeasons].map(([season, seasonGames]) => ({ season, games: sortGames(seasonGames), archived: false })),
    ...[...legacySeasons].map(([season, seasonGames]) => ({ season, games: sortGames(seasonGames), archived: true })),
  ].sort((a, b) => Number(a.archived) - Number(b.archived) || b.season.localeCompare(a.season));
  const stories = getSchoolStories(school.slug);
  const theme = { "--team-primary": school.colors.primary, "--team-gold": school.colors.gold } as React.CSSProperties;

  return (
    <main style={theme}>
      <section className="team-hero">
        <div className="page-shell team-identity">
          <Breadcrumbs items={[{ label: "North County Varsity", href: "/" }, { label: city.name, href: `/${city.slug}/` }, { label: school.shortName }]} />
          <p className="eyebrow">{school.name} · {school.mascot}</p>
          <h1>{school.shortName}</h1>
        </div>
      </section>
      <div className="page-shell school-page-grid">
        <SchoolNewsWell stories={stories} />
        <SchoolSchedule school={school} seasons={seasons} />
      </div>
    </main>
  );
}
