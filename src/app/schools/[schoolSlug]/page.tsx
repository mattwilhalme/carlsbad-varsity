import Image from "next/image";
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
  const logoSrc = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${school.logo}`;
  return <main><section className="home-hero school-overview" style={{"--team-primary": school.colors.primary, "--team-gold": school.colors.gold} as React.CSSProperties}><div className="page-shell"><p className="kicker">{school.mascot}</p><h1>{school.name}</h1><a className="school-wordmark" href={school.officialUrl} target="_blank" rel="noreferrer"><Image src={logoSrc} alt={`${school.name} athletics wordmark`} width={school.slug === "carlsbad" ? 2000 : 1527} height={school.slug === "carlsbad" ? 161 : 137} priority /><span className="visually-hidden">Visit the official {school.name} website</span></a><p className="dek">Choose a varsity team to view its season hub.</p></div></section><section className="page-shell school-grid"><div className="section-rule"><p className="kicker">Varsity sports</p><h2>Team pages</h2></div>{school.sports.map((slug) => { const label = slug === "boys-basketball" ? "Boys’ Basketball" : "Girls’ Basketball"; return <Link className="school-card" key={slug} href={`/schools/${school.slug}/${slug}/`}><span>2025–26</span><h3>{label}</h3><strong>Open team page →</strong></Link>; })}</section></main>;
}
