import Link from "next/link";
import { games, schools, stories, teams } from "@/data/site-data";
import type { Game, SportSlug } from "@/domain/models";

const sportLabels: Record<SportSlug, string> = {
  "boys-basketball": "Boys’ Basketball",
  "girls-basketball": "Girls’ Basketball",
};

function pacificDateKey() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const value = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value;
  return `${value("year")}-${value("month")}-${value("day")}`;
}

function gameContext(game: Game) {
  const team = teams.find((item) => item.id === game.teamId)!;
  return { team, school: schools[team.schoolSlug] };
}

function GameRow({ game }: { game: Game }) {
  const { team, school } = gameContext(game);
  const date = new Date(`${game.date}T12:00:00`);
  const result = game.status === "final" ? `${game.result} ${game.teamScore}–${game.opponentScore}` : game.time ?? "TBA";
  return (
    <Link className="home-game-row" href={`/games/${game.id}/`} aria-label={`${school.shortName} ${team.sportName} ${game.homeAway.toLowerCase()} against ${game.opponent}, ${result}`}>
      <time dateTime={game.date}><strong>{date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</strong><span>{date.toLocaleDateString("en-US", { weekday: "short" })}</span></time>
      <span className="home-game-team"><strong>{school.shortName}</strong><small>{team.sportName}</small></span>
      <span className="site-code" title={game.homeAway}>{game.homeAway.charAt(0)}</span>
      <span className="home-game-opponent">{game.opponent}</span>
      <strong className={game.result ? `outcome-${game.result.toLowerCase()}` : undefined}>{result}</strong>
      <span className="row-chevron" aria-hidden="true">›</span>
    </Link>
  );
}

export default function Home() {
  const today = pacificDateKey();
  const scheduled = games.filter((game) => game.status === "scheduled" && game.date >= today).sort((a, b) => a.date.localeCompare(b.date));
  const nextDate = scheduled[0]?.date;
  const displayDate = scheduled.some((game) => game.date === today) ? today : nextDate;
  const featuredGames = scheduled.filter((game) => game.date === displayDate);
  const recentResults = games.filter((game) => game.status === "final" && game.date <= today).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6);
  const publishedStories = stories.filter((story) => story.contentStatus === "published");

  return (
    <main>
      <section className="home-intro"><div className="page-shell"><p className="kicker">Carlsbad high school sports</p><h1>Scores and schedules.<br />Right when you need them.</h1></div></section>
      <section className="page-shell home-dashboard" aria-label="Carlsbad Varsity dashboard">
        <div className="school-selectors" aria-label="Choose a school or team">
          {Object.values(schools).map((school) => (
            <div className="school-selector" key={school.slug} style={{ "--team-primary": school.colors.primary, "--team-gold": school.colors.gold } as React.CSSProperties}>
              <Link href={`/schools/${school.slug}/`}>{school.shortName}</Link>
              <details><summary aria-label={`Choose a ${school.shortName} sport`}><span aria-hidden="true">⌄</span></summary><div className="school-sport-menu">{school.sports.map((sport) => <Link key={sport} href={`/schools/${school.slug}/${sport}/`}>{sportLabels[sport]}</Link>)}</div></details>
            </div>
          ))}
        </div>
        <section className="home-section" aria-labelledby="schedule-heading">
          <div className="home-section-heading"><div><p className="kicker">Schedule</p><h2 id="schedule-heading">{featuredGames.length && displayDate === today ? "Today’s games" : featuredGames.length ? "Next game day" : "No upcoming games"}</h2></div>{displayDate && <time dateTime={displayDate}>{new Date(`${displayDate}T12:00:00`).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</time>}</div>
          {featuredGames.length ? <div className="home-game-list">{featuredGames.map((game) => <GameRow game={game} key={game.id} />)}</div> : <p className="home-empty">No future games are currently published. New schedules will appear here once verified.</p>}
        </section>
        {recentResults.length > 0 && <section className="home-section" aria-labelledby="results-heading"><div className="home-section-heading"><div><p className="kicker">Final scores</p><h2 id="results-heading">Recent results</h2></div></div><div className="home-game-list">{recentResults.map((game) => <GameRow game={game} key={game.id} />)}</div></section>}
        {publishedStories.length > 0 && <section className="home-section" aria-labelledby="coverage-heading"><div className="home-section-heading"><div><p className="kicker">Reporting</p><h2 id="coverage-heading">Latest coverage</h2></div></div><div className="story-grid">{publishedStories.map((story) => <article className="story-card" key={story.id}><p className="eyebrow">{story.source}</p><h3>{story.articleUrl ? <a href={story.articleUrl}>{story.headline}</a> : story.headline}</h3><p>{story.summary}</p></article>)}</div></section>}
      </section>
    </main>
  );
}
