import { notFound } from "next/navigation";
import { TeamPage } from "@/components/TeamPage";
import { getTeam, teams } from "@/data/site-data";

export function generateStaticParams() { return teams.map((team) => ({ schoolSlug: team.schoolSlug, sportSlug: team.sportSlug })); }
export const dynamicParams = false;

export default async function Page({ params }: { params: Promise<{ schoolSlug: string; sportSlug: string }> }) {
  const { schoolSlug, sportSlug } = await params;
  const team = getTeam(schoolSlug, sportSlug);
  if (!team) notFound();
  return <TeamPage team={team} />;
}
