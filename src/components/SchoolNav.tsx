"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { games, schools, teams } from "@/data/site-data";
import type { SchoolSlug, SportSlug } from "@/domain/models";

const sportLabels: Record<SportSlug, string> = {
  "boys-basketball": "Boys’ Basketball",
  "girls-basketball": "Girls’ Basketball",
};

function routeContext(pathname: string) {
  const schoolMatch = pathname.match(/\/schools\/([^/]+)(?:\/([^/]+))?/);
  if (schoolMatch) return { schoolSlug: schoolMatch[1] as SchoolSlug, sportSlug: schoolMatch[2] as SportSlug | undefined };

  const gameId = pathname.match(/\/games\/([^/]+)/)?.[1];
  const game = games.find((item) => item.id === gameId);
  const team = game ? teams.find((item) => item.id === game.teamId) : undefined;
  return { schoolSlug: team?.schoolSlug, sportSlug: team?.sportSlug };
}

export function SchoolNav() {
  const pathname = usePathname();
  const { schoolSlug, sportSlug } = routeContext(pathname);
  const activeSchool = schoolSlug ? schools[schoolSlug] : undefined;

  return (
    <div className="coverage-navigation">
      <nav className="coverage-schools" aria-label="Schools we cover">
        <div className="page-shell coverage-schools-inner">
          <span>Schools we cover</span>
          {Object.values(schools).map((school) => (
            <Link key={school.slug} href={`/schools/${school.slug}/`} aria-current={school.slug === schoolSlug ? "page" : undefined}>
              {school.shortName}
            </Link>
          ))}
        </div>
      </nav>
      {activeSchool && (
        <nav className="coverage-sports" aria-label={`${activeSchool.name} sports`} style={{ "--team-primary": activeSchool.colors.primary, "--team-gold": activeSchool.colors.gold } as React.CSSProperties}>
          <div className="page-shell coverage-sports-inner">
            <Link className="school-overview-pill" href={`/schools/${activeSchool.slug}/`} aria-current={!sportSlug ? "page" : undefined}>All schedules</Link>
            {activeSchool.sports.map((sport) => (
              <Link key={sport} href={`/schools/${activeSchool.slug}/${sport}/`} aria-current={sport === sportSlug ? "page" : undefined}>
                {sportLabels[sport]}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
}
