import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TeamPage } from "@/components/TeamPage";
import { canonicalUrl, cities, getTeam, schoolPath, schools, teams } from "@/data/site-data";
import type { CitySlug } from "@/domain/models";

export function generateStaticParams() { return teams.map((team) => ({ citySlug: schools[team.schoolSlug].citySlug, schoolSlug: team.schoolSlug, sportSlug: team.sportSlug })); }
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ citySlug: string; schoolSlug: string; sportSlug: string }> }): Promise<Metadata> {
  const { citySlug, schoolSlug, sportSlug } = await params;
  const team = getTeam(schoolSlug, sportSlug);
  if (!team || schools[team.schoolSlug].citySlug !== citySlug) return {};
  return { title: `${schools[team.schoolSlug].shortName} ${team.sportName}`, description: `${team.season} ${team.sportName} schedule and results for ${schools[team.schoolSlug].name}.`, alternates: { canonical: canonicalUrl(schoolPath(team.schoolSlug, team.sportSlug)) } };
}

export default async function TeamRoute({ params }: { params: Promise<{ citySlug: string; schoolSlug: string; sportSlug: string }> }) {
  const { citySlug, schoolSlug, sportSlug } = await params;
  const city = cities[citySlug as CitySlug];
  const team = getTeam(schoolSlug, sportSlug);
  if (!city || !team || schools[team.schoolSlug].citySlug !== city.slug) notFound();
  return <TeamPage team={team} />;
}
