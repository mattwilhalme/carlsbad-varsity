import Link from "next/link";
import { schools, teams } from "@/data/site-data";
import type { Game } from "@/domain/models";

function formatDate(date: string) { return new Date(`${date}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" }); }

export function HomeGameRail({ games, result = false }: { games: Game[]; result?: boolean }) {
  return <div className="rail-game-list">{games.map((game) => {
    const team = teams.find((item) => item.id === game.teamId)!;
    const school = schools[team.schoolSlug];
    const status = result ? `${game.result} ${game.teamScore}–${game.opponentScore}` : game.time ?? "TBA";
    const homeTeam = game.homeAway === "Away" ? game.opponent : school.shortName;
    const awayTeam = game.homeAway === "Away" ? school.shortName : game.opponent;
    return <Link href={`/games/${game.id}/`} className="rail-game" key={game.id}>
      <time dateTime={game.date}>{formatDate(game.date)}</time>
      <span className="rail-matchup"><strong>{homeTeam} (1-0) vs.</strong><strong>{awayTeam} (1-0)</strong><small>{team.sportName}</small></span>
      <b className={game.result ? `outcome-${game.result.toLowerCase()}` : undefined}>{status}</b>
    </Link>;
  })}</div>;
}
