"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cities, games, schoolPath, schools, teams } from "@/data/site-data";
import type { SchoolSlug, SportSlug } from "@/domain/models";

const sportLabels: Record<SportSlug, string> = {
  "boys-basketball": "Boys’ Basketball",
  "girls-basketball": "Girls’ Basketball",
};

function routeContext(pathname: string) {
  const legacyMatch = pathname.match(/\/schools\/([^/]+)(?:\/([^/]+))?/);
  if (legacyMatch) return { schoolSlug: legacyMatch[1] as SchoolSlug, sportSlug: legacyMatch[2] as SportSlug | undefined };

  for (const city of Object.values(cities)) {
    const cityMatch = pathname.match(new RegExp(`/${city.slug}/([^/]+)(?:/([^/]+))?`));
    if (cityMatch && city.schoolSlugs.includes(cityMatch[1] as SchoolSlug)) {
      return { schoolSlug: cityMatch[1] as SchoolSlug, sportSlug: cityMatch[2] as SportSlug | undefined };
    }
  }

  const gameId = pathname.match(/\/games\/([^/]+)/)?.[1];
  const game = games.find((item) => item.id === gameId);
  const team = game ? teams.find((item) => item.id === game.teamId) : undefined;
  return { schoolSlug: team?.schoolSlug, sportSlug: team?.sportSlug };
}

export function SchoolNav() {
  const pathname = usePathname();
  const { schoolSlug, sportSlug } = routeContext(pathname);
  return (
    <nav className="coverage-navigation" aria-label="Schools we cover">
      <div className="page-shell coverage-navigation-inner">
        <span className="coverage-label">Schools we cover</span>
        <div className="persistent-school-nav">
          {Object.values(schools).map((school) => (
            <div className="school-selector" key={school.slug} data-active={school.slug === schoolSlug ? "true" : undefined} style={{ "--team-primary": school.colors.primary, "--team-gold": school.colors.gold } as React.CSSProperties}>
              <Link href={schoolPath(school.slug)} aria-current={school.slug === schoolSlug && !sportSlug ? "page" : undefined}>{school.shortName}</Link>
              <details>
                <summary aria-label={`Choose a ${school.shortName} sport`}><span aria-hidden="true">⌄</span></summary>
                <div className="school-sport-menu">
                  <Link href={schoolPath(school.slug)} aria-current={school.slug === schoolSlug && !sportSlug ? "page" : undefined}>All schedules</Link>
                  {school.sports.map((sport) => <Link key={sport} href={schoolPath(school.slug, sport)} aria-current={school.slug === schoolSlug && sport === sportSlug ? "page" : undefined}>{sportLabels[sport]}</Link>)}
                </div>
              </details>
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}
