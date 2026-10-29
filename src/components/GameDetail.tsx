import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { MoreCoverage } from "@/components/MoreCoverage";
import { cities, schoolPath, schools, teams } from "@/data/site-data";
import type { Game } from "@/domain/models";

function TeamIdentity({ name, score, winner }: { name: string; score?: number; winner: boolean }) {
  return (
    <div className={`game-team${winner ? " game-winner" : ""}`}>
      <div><strong>{name}</strong>{winner && <span>Winner</span>}</div>
      {score !== undefined && <b>{score}</b>}
    </div>
  );
}

export function GameDetail({ game }: { game: Game }) {
  const team = teams.find((item) => item.id === game.teamId);
  if (!team) return null;
  const school = schools[team.schoolSlug];
  const city = cities[school.citySlug];
  const schoolWon = game.status === "final" && game.teamScore !== undefined && game.opponentScore !== undefined && game.teamScore > game.opponentScore;
  const opponentWon = game.status === "final" && game.teamScore !== undefined && game.opponentScore !== undefined && game.opponentScore > game.teamScore;
  const schoolEntry = { name: school.shortName, score: game.teamScore, winner: schoolWon };
  const opponentEntry = { name: game.opponent, score: game.opponentScore, winner: opponentWon };
  const firstTeam = game.homeAway === "Home" ? opponentEntry : schoolEntry;
  const secondTeam = game.homeAway === "Home" ? schoolEntry : opponentEntry;
  const date = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(`${game.date}T00:00:00Z`));
  const theme = { "--team-primary": school.colors.primary, "--team-gold": school.colors.gold } as React.CSSProperties;
  const correctionSubject = encodeURIComponent(`Correction for ${school.shortName} vs. ${game.opponent} (${game.id})`);
  const scorePeriods = [...(game.periodScores ?? []), ...(game.overtimeScores ?? [])];

  return (
    <main style={theme}>
      <header className="game-hero">
        <div className="page-shell game-hero-inner">
          <Breadcrumbs items={[{ label: "North County Varsity", href: "/" }, { label: city.name, href: `/${city.slug}/` }, { label: school.shortName, href: schoolPath(school.slug) }, { label: team.sportName, href: schoolPath(school.slug, team.sportSlug) }, { label: game.status === "final" ? "Final" : "Game" }]} />
          <Link className="back-link" href={schoolPath(school.slug, team.sportSlug)}>← Back to {team.sportName}</Link>
          <p className="eyebrow">{school.name} · {team.sportName} · {team.level}</p>
          <h1>{game.status === "final" ? "Final" : game.status === "scheduled" ? "Game Preview" : game.status}</h1>
          <p className="game-date-line"><time dateTime={game.date}>{date}</time> · {game.time || "TBD"}</p>
        </div>
      </header>

      <div className="page-shell game-detail-layout">
        <section className="scoreboard" aria-label={`${school.shortName} and ${game.opponent} score`}>
          <TeamIdentity {...firstTeam} />
          <div className="matchup-divider"><span>{game.homeAway === "Neutral" ? "vs." : "at"}</span></div>
          <TeamIdentity {...secondTeam} />
          <p className="game-status"><strong>{game.status === "final" ? "Final" : game.status}</strong>{game.result && ` · ${school.shortName} ${game.result}`}</p>
        </section>

        <div className="game-information">
          <section className="game-section section-rule" aria-labelledby="game-info-heading">
            <p className="kicker">Game information</p>
            <h2 id="game-info-heading">{game.homeAway} game</h2>
            <dl className="game-facts">
              <div><dt>Sport</dt><dd>{team.sportName}</dd></div>
              <div><dt>Level</dt><dd>{team.level}</dd></div>
              <div><dt>Date</dt><dd>{date}</dd></div>
              <div><dt>Time</dt><dd>{game.time || "TBD"}</dd></div>
              <div><dt>Venue</dt><dd>{game.location || "Not provided"}</dd></div>
              {game.venueAddress && <div><dt>Address</dt><dd>{game.venueAddress}</dd></div>}
            </dl>
          </section>

          {scorePeriods.length > 0 && <section className="game-section section-rule" aria-labelledby="scoring-heading">
            <p className="kicker">Scoring detail</p><h2 id="scoring-heading">By period</h2>
            <div className="period-table-wrap"><table className="period-table"><thead><tr><th>Period</th><th>{school.shortName}</th><th>{game.opponent}</th></tr></thead><tbody>{scorePeriods.map((period) => <tr key={period.period}><th>{period.period}</th><td>{period.teamScore}</td><td>{period.opponentScore}</td></tr>)}</tbody></table></div>
          </section>}

          <MoreCoverage entries={game.relatedCoverage} />

          <section className="game-actions" aria-label="Game source and corrections">
            {game.sourceUrl && <a href={game.sourceUrl} target="_blank" rel="noreferrer">Original schedule and result source ↗</a>}
            <a href={`mailto:mwilhalme@gmail.com?subject=${correctionSubject}`}>Report a Correction</a>
          </section>
        </div>
      </div>
    </main>
  );
}
