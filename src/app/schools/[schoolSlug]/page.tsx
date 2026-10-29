import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SchoolPageView } from "@/components/SchoolPageView";
import { canonicalUrl, schoolPath, schools } from "@/data/site-data";
import type { SchoolSlug } from "@/domain/models";

export function generateStaticParams() { return Object.keys(schools).map((schoolSlug) => ({ schoolSlug })); }
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ schoolSlug: string }> }): Promise<Metadata> {
  const { schoolSlug } = await params;
  const school = schools[schoolSlug as SchoolSlug];
  return school ? { title: school.name, alternates: { canonical: canonicalUrl(schoolPath(school.slug)) } } : {};
}

export default async function SchoolPage({ params }: { params: Promise<{ schoolSlug: string }> }) {
  const { schoolSlug } = await params;
  const school = schools[schoolSlug as SchoolSlug];
  if (!school) notFound();

  return <SchoolPageView school={school} />;
}
