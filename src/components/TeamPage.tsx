import { Breadcrumbs } from "@/components/Breadcrumbs";
import { cities, games, schoolPath, schools, stories } from "@/data/site-data";
import { SeasonSchedule } from "@/components/SeasonSchedule";
import type { Game, Team } from "@/domain/models";

export function TeamPage({ cmsSchedules, team }: { cmsSchedules: Record<string, Game[]>; team: Team }) {
  const school = schools[team.schoolSlug];
  const city = cities[school.citySlug];
  const teamGames = games.filter((game) => game.teamId === team.id);
  const schedules = {
    ...cmsSchedules,
    [team.season]: [...teamGames, ...(cmsSchedules[team.season] || [])],
  };
  const currentSeason = Object.keys(schedules).sort((a, b) => b.localeCompare(a))[0] || team.season;
  const teamStories = stories.filter((story) => story.teamIds.includes(team.id) && story.contentStatus === "published");
  const theme = { "--team-primary": school.colors.primary, "--team-gold": school.colors.gold } as React.CSSProperties;

  return (
    <main style={theme}>
      <section className="team-hero">
        <div className="page-shell team-identity">
          <div>
            <Breadcrumbs items={[{ label: "North County Varsity", href: "/" }, { label: city.name, href: `/${city.slug}/` }, { label: school.shortName, href: schoolPath(school.slug) }, { label: team.sportName }]} />
            <p className="eyebrow">{school.name} · {school.mascot}</p>
            <h1>{team.sportName}</h1>
            <p className="team-meta">{team.level} · {currentSeason} season</p>
          </div>
        </div>
      </section>

      <div className="page-shell editorial-grid">
        <section className="schedule section-rule" aria-labelledby="schedule-heading">
          <SeasonSchedule schedules={schedules} school={school} />
        </section>

        {teamStories.length > 0 && <section className="news section-rule" aria-labelledby="news-heading">
          <p className="kicker">Latest coverage</p>
          <h2 id="news-heading">Recent news</h2>
          <div className="story-grid">
            {teamStories.map((story) => (
              <article className="story-card" key={story.id}>
                <h3>{story.headline}</h3>
                <p>{story.summary}</p>
                <small>{story.source}</small>
              </article>
            ))}
          </div>
        </section>}
      </div>
    </main>
  );
}
