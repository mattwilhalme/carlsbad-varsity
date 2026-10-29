import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SchoolPageView } from "@/components/SchoolPageView";
import { canonicalUrl, cities, schoolPath, schools } from "@/data/site-data";
import type { CitySlug, SchoolSlug } from "@/domain/models";

export function generateStaticParams() { return Object.values(schools).map((school) => ({ citySlug: school.citySlug, schoolSlug: school.slug })); }
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ citySlug: string; schoolSlug: string }> }): Promise<Metadata> {
  const { citySlug, schoolSlug } = await params;
  const school = schools[schoolSlug as SchoolSlug];
  return school?.citySlug === citySlug ? { title: school.name, description: `${school.name} varsity schedules, scores and coverage.`, alternates: { canonical: canonicalUrl(schoolPath(school.slug)) } } : {};
}

export default async function SchoolPage({ params }: { params: Promise<{ citySlug: string; schoolSlug: string }> }) {
  const { citySlug, schoolSlug } = await params;
  const city = cities[citySlug as CitySlug];
  const school = schools[schoolSlug as SchoolSlug];
  if (!city || !school || school.citySlug !== city.slug) notFound();
  return <SchoolPageView school={school} />;
}
