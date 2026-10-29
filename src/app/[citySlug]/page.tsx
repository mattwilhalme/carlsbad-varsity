import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { canonicalUrl, cities, schoolPath, schools } from "@/data/site-data";
import type { CitySlug } from "@/domain/models";

export function generateStaticParams() { return Object.keys(cities).map((citySlug) => ({ citySlug })); }
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ citySlug: string }> }): Promise<Metadata> {
  const { citySlug } = await params;
  const city = cities[citySlug as CitySlug];
  return city ? { title: `${city.name} High School Sports`, description: `Schedules, scores and high school sports coverage for ${city.name}, California.`, alternates: { canonical: canonicalUrl(`/${city.slug}/`) } } : {};
}

export default async function CityPage({ params }: { params: Promise<{ citySlug: string }> }) {
  const { citySlug } = await params;
  const city = cities[citySlug as CitySlug];
  if (!city) notFound();
  return (
    <main>
      <header className="city-hero"><div className="page-shell city-hero-inner"><Breadcrumbs items={[{ label: "North County Varsity", href: "/" }, { label: city.name }]} /><p className="kicker">{city.region}</p><h1>{city.name}</h1><p className="dek">Schedules, scores and coverage for high school teams in {city.name}.</p></div></header>
      <section className="page-shell city-schools" aria-labelledby="city-schools-heading"><div className="section-rule"><p className="kicker">Schools we cover</p><h2 id="city-schools-heading">Choose a school</h2></div><div className="school-grid city-school-grid">{city.schoolSlugs.map((slug) => { const school = schools[slug]; return <Link className="school-card" href={schoolPath(school.slug)} key={school.slug} style={{ "--team-primary": school.colors.primary, "--team-gold": school.colors.gold } as React.CSSProperties}><span>{school.mascot}</span><h3>{school.name}</h3><strong>View schedules →</strong></Link>; })}</div></section>
    </main>
  );
}
