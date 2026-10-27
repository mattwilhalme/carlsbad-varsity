import Link from "next/link";
import { schools } from "@/data/site-data";

export default function Home() {
  return <main><section className="home-hero"><div className="page-shell"><p className="kicker">Local teams. Local reporting.</p><h1>Carlsbad sports,<br />covered like news.</h1><p className="dek">Follow varsity teams at Carlsbad and Sage Creek high schools.</p></div></section><section className="page-shell school-grid" aria-labelledby="schools-heading"><div className="section-rule"><p className="kicker">Choose a school</p><h2 id="schools-heading">Your teams</h2></div>{Object.values(schools).map((school) => <Link className="school-card" href={`/schools/${school.slug}/`} key={school.slug} style={{"--team-primary": school.colors.primary, "--team-gold": school.colors.gold} as React.CSSProperties}><span>{school.mascot}</span><h3>{school.name}</h3><p>Schedules, standings and the latest coverage</p><strong>View teams →</strong></Link>)}</section></main>;
}
