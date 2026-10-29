import Link from "next/link";
import { teams } from "@/data/site-data";
import type { Game, School } from "@/domain/models";

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

export function ScheduleList({ schedule, school, showSport = false }: { schedule: Game[]; school: School; showSport?: boolean }) {
  const sources = schedule.reduce<Array<{ url: string; label: string }>>((items, game) => {
    if (!game.sourceUrl || items.some((item) => item.url === game.sourceUrl)) return items;
    const team = teams.find((item) => item.id === game.teamId);
    items.push({ url: game.sourceUrl, label: team?.sportName ?? "Athletics schedule" });
    return items;
  }, []);

  if (!schedule.length) return <div className="empty-state"><h3>Schedule coming soon</h3><p>Verified dates, opponents, locations and results will be added here.</p></div>;

  return (
    <>
      <div className="schedule-list" role="table" aria-label={`${school.name} schedule and results`}>
        <div className="schedule-header" role="row">
          <span role="columnheader">Date / time</span><span role="columnheader">Opponent</span><span role="columnheader">Result / time</span><span aria-hidden="true" />
        </div>
        <div role="rowgroup">{schedule.map((game) => {
          const team = teams.find((item) => item.id === game.teamId);
          const opponentName = game.opponentShortName || game.opponent;
          return (
            <Link className="schedule-row" role="row" key={game.id} href={`/games/${game.id}/`} aria-label={gameAriaLabel(game, school.shortName)}>
              <div className="game-date" role="cell"><time dateTime={game.date}>{new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" }).format(new Date(`${game.date}T00:00:00Z`))}</time><span>{game.time || "TBD"}</span></div>
              <div className="game-opponent" role="cell"><strong title={game.opponent}>{game.homeAway === "Away" ? "At " : game.homeAway === "Neutral" ? "Vs. " : ""}{opponentName}</strong>{showSport && team && <span>{team.sportName}</span>}</div>
              <div className="game-outcome" role="cell">{gameOutcome(game)}</div>
              <span className="row-chevron" aria-hidden="true">›</span>
            </Link>
          );
        })}</div>
      </div>
      {sources.length > 0 && <p className="source-note">Schedule and results source{sources.length > 1 ? "s" : ""}: {sources.map((source, index) => <span key={source.url}>{index > 0 && " · "}<a href={source.url} target="_blank" rel="noreferrer">{source.label}</a></span>)}.</p>}
    </>
  );
}
