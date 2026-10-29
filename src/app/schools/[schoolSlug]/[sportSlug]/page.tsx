import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TeamPage } from "@/components/TeamPage";
import { canonicalUrl, getTeam, schoolPath, schools, teams } from "@/data/site-data";

export function generateStaticParams() { return teams.map((team) => ({ schoolSlug: team.schoolSlug, sportSlug: team.sportSlug })); }
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ schoolSlug: string; sportSlug: string }> }): Promise<Metadata> {
  const { schoolSlug, sportSlug } = await params;
  const team = getTeam(schoolSlug, sportSlug);
  if (!team) return {};
  return { title: `${schools[team.schoolSlug].shortName} ${team.sportName}`, alternates: { canonical: canonicalUrl(schoolPath(team.schoolSlug, team.sportSlug)) } };
}

export default async function Page({ params }: { params: Promise<{ schoolSlug: string; sportSlug: string }> }) {
  const { schoolSlug, sportSlug } = await params;
  const team = getTeam(schoolSlug, sportSlug);
  if (!team) notFound();
  return <TeamPage team={team} />;
}
