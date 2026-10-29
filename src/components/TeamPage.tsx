import { games, schools, stories } from "@/data/site-data";
import { ScheduleList } from "@/components/ScheduleList";
import type { Team } from "@/domain/models";

export function TeamPage({ team }: { team: Team }) {
  const school = schools[team.schoolSlug];
  const teamGames = games.filter((game) => game.teamId === team.id);
  const teamStories = stories.filter((story) => story.teamIds.includes(team.id) && story.contentStatus === "published");
  const theme = { "--team-primary": school.colors.primary, "--team-gold": school.colors.gold } as React.CSSProperties;

  return (
    <main style={theme}>
      <section className="team-hero">
        <div className="page-shell team-identity">
          <div>
            <p className="eyebrow">{school.name} · {school.mascot}</p>
            <h1>{team.sportName}</h1>
            <p className="team-meta">{team.level} · {team.season} season</p>
          </div>
        </div>
      </section>

      <div className="page-shell editorial-grid">
        <section className="schedule section-rule" aria-labelledby="schedule-heading">
          <div className="section-heading"><div><p className="kicker">{team.season}</p><h2 id="schedule-heading">Schedule &amp; results</h2></div><span className="status-label">Verified data only</span></div>
          <ScheduleList schedule={teamGames} school={school} />
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
