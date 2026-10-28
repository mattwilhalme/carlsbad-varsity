import Image from "next/image";
import Link from "next/link";
import { games, schools, stories } from "@/data/site-data";
import type { Game, GameSite, Team } from "@/domain/models";

const siteCode: Record<GameSite, string> = { Home: "H", Away: "A", Neutral: "N" };

function opponentInitials(name: string) {
  return name.split(/[\s/-]+/).filter(Boolean).slice(0, 2).map((word) => word[0]).join("").toUpperCase();
}

function gameOutcome(game: Game) {
  if (game.status === "final" && game.result && game.teamScore !== undefined && game.opponentScore !== undefined) {
    return <><strong className={`outcome outcome-${game.result.toLowerCase()}`}>{game.result} {game.teamScore}–{game.opponentScore}</strong><span>Final</span></>;
  }
  if (game.status === "postponed") return <><strong>Postponed</strong><span>New date TBD</span></>;
  if (game.status === "canceled") return <><strong>Canceled</strong><span>Not being played</span></>;
  return <><strong>{game.time || "TBD"}</strong><span>Scheduled</span></>;
}

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
              <div className="schedule-list" role="table" aria-label={`${school.name} ${team.sportName} schedule and results`}>
                <div className="schedule-header" role="row">
                  <span role="columnheader">Date / time</span><span role="columnheader">Opponent</span><span role="columnheader">Result / time</span><span role="columnheader">Details</span>
                </div>
                <div role="rowgroup">{teamGames.map((game) => {
                  const opponentName = game.opponentShortName || game.opponent;
                  return (
                    <div className="schedule-row" role="row" key={game.id}>
                      <div className="game-date" role="cell"><time dateTime={game.date}>{new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" }).format(new Date(`${game.date}T00:00:00Z`))}</time><span>{game.time || "TBD"}</span></div>
                      <div className="game-opponent" role="cell"><abbr className="site-code" title={game.homeAway} aria-label={game.homeAway}>{siteCode[game.homeAway]}</abbr><span className="opponent-mark" aria-hidden="true">{opponentInitials(opponentName)}</span><strong title={game.opponent}>{opponentName}</strong></div>
                      <div className="game-outcome" role="cell">{gameOutcome(game)}</div>
                      <div className="game-details" role="cell"><span>{game.location || game.homeAway}</span><small>{game.dataStatus === "verified" ? "Verified" : "Unverified"}</small></div>
                    </div>
                  );
                })}</div>
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
