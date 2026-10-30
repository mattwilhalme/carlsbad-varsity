import Link from "next/link";
import { schools, teams } from "@/data/site-data";
import type { Game } from "@/domain/models";

function formatDate(date: string) { return new Date(`${date}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" }); }

function opponentSchoolName(name: string) {
  return /(?:School|Academy|Christian|Prep)$/i.test(name) ? name : `${name} High School`;
}

export function HomeGameRail({ games, result = false }: { games: Game[]; result?: boolean }) {
  return <div className="rail-game-list">{games.map((game) => {
    const team = teams.find((item) => item.id === game.teamId)!;
    const school = schools[team.schoolSlug];
    const status = result ? `${game.result} ${game.teamScore}–${game.opponentScore}` : game.time ?? "TBA";
    const homeTeam = game.homeAway === "Away" ? opponentSchoolName(game.opponent) : school.name;
    const awayTeam = game.homeAway === "Away" ? school.name : opponentSchoolName(game.opponent);
    return <Link href={`/games/${game.id}/`} className="rail-game" key={game.id}>
      <span className="rail-game-meta"><time dateTime={game.date}>{formatDate(game.date)}</time><b className={game.result ? `outcome-${game.result.toLowerCase()}` : undefined}>{status}</b></span>
      <span className="rail-matchup"><strong><span>{homeTeam}</span><em>(1-0) vs.</em></strong><strong><span>{awayTeam}</span><em>(1-0)</em></strong><small>{team.sportName}</small></span>
    </Link>;
  })}</div>;
}
