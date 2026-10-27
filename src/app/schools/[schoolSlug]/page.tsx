import Link from "next/link";
import { notFound } from "next/navigation";
import { schools } from "@/data/site-data";
import type { SchoolSlug } from "@/domain/models";

export function generateStaticParams() { return Object.keys(schools).map((schoolSlug) => ({ schoolSlug })); }
export const dynamicParams = false;

export default async function SchoolPage({ params }: { params: Promise<{ schoolSlug: string }> }) {
  const { schoolSlug } = await params;
  const school = schools[schoolSlug as SchoolSlug];
  if (!school) notFound();
  return <main><section className="home-hero school-overview" style={{"--team-primary": school.colors.primary, "--team-gold": school.colors.gold} as React.CSSProperties}><div className="page-shell"><p className="kicker">{school.mascot}</p><h1>{school.name}</h1><p className="dek">Choose a varsity team to view its season hub.</p></div></section><section className="page-shell school-grid"><div className="section-rule"><p className="kicker">Varsity sports</p><h2>Team pages</h2></div>{school.sports.map((slug) => { const label = slug === "football" ? "Football" : slug === "boys-basketball" ? "Boys’ Basketball" : "Girls’ Basketball"; return <Link className="school-card" key={slug} href={`/schools/${school.slug}/${slug}/`}><span>{slug === "football" ? "2025" : "2025–26"}</span><h3>{label}</h3><strong>Open team page →</strong></Link>; })}</section></main>;
}
