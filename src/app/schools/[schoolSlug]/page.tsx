import { notFound } from "next/navigation";
import { ScheduleList } from "@/components/ScheduleList";
import { games, schools, teams } from "@/data/site-data";
import type { SchoolSlug } from "@/domain/models";

export function generateStaticParams() { return Object.keys(schools).map((schoolSlug) => ({ schoolSlug })); }
export const dynamicParams = false;

export default async function SchoolPage({ params }: { params: Promise<{ schoolSlug: string }> }) {
  const { schoolSlug } = await params;
  const school = schools[schoolSlug as SchoolSlug];
  if (!school) notFound();

  const teamIds = new Set(teams.filter((team) => team.schoolSlug === school.slug).map((team) => team.id));
  const schoolGames = games.filter((game) => teamIds.has(game.teamId)).sort((a, b) => a.date.localeCompare(b.date) || (a.time ?? "").localeCompare(b.time ?? ""));
  const theme = { "--team-primary": school.colors.primary, "--team-gold": school.colors.gold } as React.CSSProperties;

  return (
    <main style={theme}>
      <section className="team-hero">
        <div className="page-shell team-identity">
          <p className="eyebrow">{school.name} · {school.mascot}</p>
          <h1>{school.shortName}</h1>
          <p className="team-meta">All varsity schedules and results</p>
        </div>
      </section>
      <div className="page-shell editorial-grid">
        <section className="schedule section-rule" aria-labelledby="schedule-heading">
          <div className="section-heading"><div><p className="kicker">2025–26</p><h2 id="schedule-heading">Schedule &amp; results</h2></div><span className="status-label">Verified data only</span></div>
          <ScheduleList schedule={schoolGames} school={school} showSport />
        </section>
      </div>
    </main>
  );
}
