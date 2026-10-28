import { notFound } from "next/navigation";
import { GameDetail } from "@/components/GameDetail";
import { games } from "@/data/site-data";

export function generateStaticParams() {
  return games.map((game) => ({ gameId: game.id }));
}

export const dynamicParams = false;

export default async function GamePage({ params }: { params: Promise<{ gameId: string }> }) {
  const { gameId } = await params;
  const game = games.find((item) => item.id === gameId);
  if (!game) notFound();
  return <GameDetail game={game} />;
}
