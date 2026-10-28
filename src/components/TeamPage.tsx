import Image from "next/image";
import Link from "next/link";
import { games, schools, stories } from "@/data/site-data";
import type { Team } from "@/domain/models";

export function TeamPage({ team }: { team: Team }) {
  const school = schools[team.schoolSlug];
  const logoSrc = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${school.logo}`;
  const teamGames = games.filter((game) => game.teamId === team.id);
  const teamStories = stories.filter((story) => story.teamIds.includes(team.id));
  const scheduleSource = teamGames.find((game) => game.sourceUrl)?.sourceUrl;
  const theme = { "--team-primary": school.colors.primary, "--team-gold": school.colors.gold } as React.CSSProperties;

  return (
    <main style={theme}>
      <section className="team-hero">
        <div className="page-shell team-identity">
          <a className={`team-logo ${school.slug === "sage-creek" ? "team-logo-direct" : ""}`} href={school.officialUrl} target="_blank" rel="noreferrer">
            <Image src={logoSrc} alt={`${school.name} athletics logo`} width={430} height={105} priority />
            <span className="visually-hidden">Visit the official {school.name} website</span>
          </a>
          <div>
            <p className="eyebrow">{school.name} · {school.mascot}</p>
            <h1>{team.sportName}</h1>
            <p className="team-meta">{team.level} · {team.season} season</p>
          </div>
        </div>
      </section>

      <nav className="sport-nav" aria-label={`${school.name} sports`}>
        <div className="page-shell sport-links">
          {school.sports.map((slug) => {
            const item = slug === "boys-basketball" ? "Boys’ Basketball" : "Girls’ Basketball";
            return <Link key={slug} href={`/schools/${school.slug}/${slug}/`} aria-current={slug === team.sportSlug ? "page" : undefined}>{item}</Link>;
          })}
        </div>
      </nav>

      <div className="page-shell editorial-grid">
        <section className="schedule section-rule" aria-labelledby="schedule-heading">
          <div className="section-heading"><div><p className="kicker">{team.season}</p><h2 id="schedule-heading">Schedule &amp; results</h2></div><span className="status-label">Verified data only</span></div>
          {teamGames.length ? (
            <>
              <div className="schedule-table-wrap">
                <table className="schedule-table">
                  <thead><tr><th>Date</th><th>Opponent</th><th>Site</th><th>Time</th><th>Result</th></tr></thead>
                  <tbody>{teamGames.map((game) => (
                    <tr key={game.id}>
                      <td data-label="Date"><time dateTime={game.date}>{new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(`${game.date}T00:00:00Z`))}</time></td>
                      <td data-label="Opponent"><strong>{game.opponent}</strong>{game.location && <small>{game.location}</small>}</td>
                      <td data-label="Site"><span className="site-pill">{game.homeAway}</span></td>
                      <td data-label="Time">{game.time}</td>
                      <td data-label="Result"><span className={`result-badge result-${game.result?.toLowerCase()}`}>{game.result}</span><strong className="score-line">{game.teamScore}–{game.opponentScore}</strong></td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
              {scheduleSource && <p className="source-note">Schedule and results source: <a href={scheduleSource} target="_blank" rel="noreferrer">Sage Creek Athletics / Home Campus</a>.</p>}
            </>
          ) : <div className="empty-state"><h3>Schedule coming soon</h3><p>Verified dates, opponents, locations and results will be added here. No demonstration games are being presented as fact.</p></div>}
        </section>

        <aside className="standings section-rule" aria-labelledby="standings-heading">
          <p className="kicker">League table</p>
          <h2 id="standings-heading">Standings</h2>
          <div className="empty-state compact"><h3>Standings coming soon</h3><p>League and overall records will appear when a verified source is connected.</p></div>
        </aside>

        <section className="news section-rule" aria-labelledby="news-heading">
          <p className="kicker">Latest coverage</p>
          <h2 id="news-heading">Recent news</h2>
          <div className="story-grid">
            {teamStories.map((story) => (
              <article className="story-card" key={story.id}>
                <span className="placeholder-badge">Sample layout</span>
                <h3>{story.headline}</h3>
                <p>{story.summary}</p>
                <small>{story.source} · Placeholder, not published reporting</small>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
