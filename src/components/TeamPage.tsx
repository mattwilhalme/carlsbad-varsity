import Link from "next/link";
import { games, schools, stories } from "@/data/site-data";
import type { Game, Team } from "@/domain/models";

function gameOutcome(game: Game) {
  if (game.status === "final" && game.result && game.teamScore !== undefined && game.opponentScore !== undefined) {
    return <><strong className={`outcome outcome-${game.result.toLowerCase()}`}>{game.result} {game.teamScore}–{game.opponentScore}</strong><span>Final</span></>;
  }
  if (game.status === "postponed") return <><strong>Postponed</strong><span>New date TBD</span></>;
  if (game.status === "canceled") return <><strong>Canceled</strong><span>Not being played</span></>;
  return <><strong>{game.time || "TBD"}</strong><span>Scheduled</span></>;
}

function gameAriaLabel(game: Game, schoolName: string) {
  const matchup = `${schoolName} ${game.homeAway === "Away" ? "at" : game.homeAway === "Home" ? "versus" : "against"} ${game.opponent}`;
  if (game.status === "final" && game.teamScore !== undefined && game.opponentScore !== undefined) {
    return `${matchup}, final score ${game.teamScore} to ${game.opponentScore}. Open game details.`;
  }
  return `${matchup}, ${game.status}, ${game.time || "time to be determined"}. Open game details.`;
}

export function TeamPage({ team }: { team: Team }) {
  const school = schools[team.schoolSlug];
  const teamGames = games.filter((game) => game.teamId === team.id);
  const teamStories = stories.filter((story) => story.teamIds.includes(team.id) && story.contentStatus === "published");
  const scheduleSource = teamGames.find((game) => game.sourceUrl)?.sourceUrl;
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
              <div className="schedule-list" role="table" aria-label={`${school.name} ${team.sportName} schedule and results`}>
                <div className="schedule-header" role="row">
                  <span role="columnheader">Date / time</span><span role="columnheader">Opponent</span><span role="columnheader">Result / time</span><span aria-hidden="true" />
                </div>
                <div role="rowgroup">{teamGames.map((game) => {
                  const opponentName = game.opponentShortName || game.opponent;
                  return (
                    <Link className="schedule-row" role="row" key={game.id} href={`/games/${game.id}/`} aria-label={gameAriaLabel(game, school.shortName)}>
                      <div className="game-date" role="cell"><time dateTime={game.date}>{new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" }).format(new Date(`${game.date}T00:00:00Z`))}</time><span>{game.time || "TBD"}</span></div>
                      <div className="game-opponent" role="cell"><strong title={game.opponent}>{game.homeAway === "Away" ? "At " : game.homeAway === "Neutral" ? "Vs. " : ""}{opponentName}</strong></div>
                      <div className="game-outcome" role="cell">{gameOutcome(game)}</div>
                      <span className="row-chevron" aria-hidden="true">›</span>
                    </Link>
                  );
                })}</div>
              </div>
              {scheduleSource && <p className="source-note">Schedule and results source: <a href={scheduleSource} target="_blank" rel="noreferrer">Sage Creek Athletics / Home Campus</a>.</p>}
            </>
          ) : <div className="empty-state"><h3>Schedule coming soon</h3><p>Verified dates, opponents, locations and results will be added here. No demonstration games are being presented as fact.</p></div>}
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
