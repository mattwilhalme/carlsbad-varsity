import Link from "next/link";
import { schools } from "@/data/site-data";
import { allScheduleTeams } from "@/data/public-schedule-data";
import type { Game } from "@/domain/models";

function formatDate(date: string) { return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`)); }

function gameStatus(game: Game, result: boolean) {
  if (!result) return game.status === "postponed" ? "Postponed" : game.time ?? "TBA";
  if (game.result && game.teamScore !== undefined && game.opponentScore !== undefined) return `${game.result} ${game.teamScore}–${game.opponentScore}`;
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
    const secondTeamPrefix = game.homeAway === "Neutral" ? "" : "At ";
    return <Link href={`/games/${game.id}/`} className="rail-game" key={game.id}>
      <span className="rail-game-meta"><time dateTime={game.date}>{formatDate(game.date)}</time><b className={game.result ? `outcome-${game.result.toLowerCase()}` : undefined}>{status}</b></span>
      <span className="rail-matchup"><strong><span>{awayTeam}</span></strong><strong><span>{secondTeamPrefix}{homeTeam}</span></strong><small>{team.sportName}</small></span>
    </Link>;
  })}</div>;
}
