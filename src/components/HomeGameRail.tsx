import Link from "next/link";
import { schools } from "@/data/site-data";
import { allScheduleTeams } from "@/data/public-schedule-data";
import type { Game } from "@/domain/models";

function formatDate(date: string) { return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`)); }

function gameStatus(game: Game, result: boolean) {
  if (!result) return game.status === "postponed" ? "Postponed" : null;
  return "Final";
}

export function HomeGameRail({ games, result = false, emptyMessage }: { games: Game[]; result?: boolean; emptyMessage: string }) {
  if (!games.length) return <p className="rail-empty">{emptyMessage}</p>;
  return <div className="rail-game-list">{games.map((game) => {
    const team = allScheduleTeams.find((item) => item.id === game.teamId);
    if (!team) return null;
    const school = schools[team.schoolSlug];
    const status = gameStatus(game, result);
    const homeTeam = game.homeAway === "Away" ? game.opponent : school.name;
    const awayTeam = game.homeAway === "Away" ? school.name : game.opponent;
    const homeScore = game.homeAway === "Away" ? game.opponentScore : game.teamScore;
    const awayScore = game.homeAway === "Away" ? game.teamScore : game.opponentScore;
    const homeWon = result && homeScore !== undefined && awayScore !== undefined && homeScore > awayScore;
    const awayWon = result && homeScore !== undefined && awayScore !== undefined && awayScore > homeScore;
    const opponentPrefix = game.homeAway === "Away" ? "at " : game.homeAway === "Home" ? "vs. " : "";
    return <Link href={`/games/${game.id}/`} className="rail-game" key={game.id}>
      <span className="rail-game-meta"><time dateTime={game.date}>{formatDate(game.date)}</time>{status && <b className={game.result ? `outcome-${game.result.toLowerCase()}` : undefined}>{status}</b>}</span>
      <span className="rail-matchup">
        {result ? <>
          <strong className={awayWon ? "rail-team-winner" : undefined}><span>{awayTeam}</span>{awayScore !== undefined && <b>{awayScore}</b>}</strong>
          <strong className={homeWon ? "rail-team-winner" : undefined}><span>{homeTeam}</span>{homeScore !== undefined && <b>{homeScore}</b>}</strong>
        </> : <><strong>{school.name}</strong><strong>{opponentPrefix}{game.opponent}</strong></>}
        <small>{team.sportName}</small>
      </span>
    </Link>;
  })}</div>;
}
