import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ScheduleList } from "@/components/ScheduleList";
import { cities, games, teams } from "@/data/site-data";
import type { School } from "@/domain/models";

export function SchoolPageView({ school }: { school: School }) {
  const city = cities[school.citySlug];
  const teamIds = new Set(teams.filter((team) => team.schoolSlug === school.slug).map((team) => team.id));
  const schoolGames = games.filter((game) => teamIds.has(game.teamId)).sort((a, b) => a.date.localeCompare(b.date) || (a.time ?? "").localeCompare(b.time ?? ""));
  const theme = { "--team-primary": school.colors.primary, "--team-gold": school.colors.gold } as React.CSSProperties;

  return (
    <main style={theme}>
      <section className="team-hero">
        <div className="page-shell team-identity">
          <Breadcrumbs items={[{ label: "North County Varsity", href: "/" }, { label: city.name, href: `/${city.slug}/` }, { label: school.shortName }]} />
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
