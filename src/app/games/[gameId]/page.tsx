import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GameDetail } from "@/components/GameDetail";
import { canonicalUrl, games, schools, teams } from "@/data/site-data";

export function generateStaticParams() {
  return games.map((game) => ({ gameId: game.id }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ gameId: string }> }): Promise<Metadata> {
  const { gameId } = await params;
  const game = games.find((item) => item.id === gameId);
  const team = game ? teams.find((item) => item.id === game.teamId) : undefined;
  if (!game || !team) return {};
  const school = schools[team.schoolSlug];
  return {
    title: `${school.shortName} vs. ${game.opponent} · ${team.sportName}`,
    description: `${game.status === "final" ? "Final score" : "Game details"} for ${school.name} ${team.sportName} against ${game.opponent}.`,
    alternates: { canonical: canonicalUrl(`/games/${game.id}/`) },
  };
}

export default async function GamePage({ params }: { params: Promise<{ gameId: string }> }) {
  const { gameId } = await params;
  const game = games.find((item) => item.id === gameId);
  if (!game) notFound();
  return <GameDetail game={game} />;
}
