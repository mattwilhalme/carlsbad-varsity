import Image from "next/image";
import Link from "next/link";
import { HomeGameRail } from "@/components/HomeGameRail";
import { SchoolNav } from "@/components/SchoolNav";
import { articlePath, leadStory, secondaryStories } from "@/data/editorial-data";
import { games } from "@/data/site-data";

export default function Home() {
  const upcomingGames = games.filter((game) => game.status === "scheduled").sort((a, b) => a.date.localeCompare(b.date)).slice(0, 4);
  const recentResults = games.filter((game) => game.status === "final").sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4);
  return <main className="editorial-home">
    <SchoolNav placement="home" />
    <div className="page-shell homepage-rule"><p>Independent coverage of Carlsbad and North County high school sports</p></div>
    <div className="page-shell homepage-layout">
      <section className="homepage-news" aria-labelledby="top-stories-heading">
        <h1 id="top-stories-heading" className="visually-hidden">North County Varsity stories</h1>
        <article className="lead-story">
          <div className="lead-story-copy"><h2><Link href={articlePath(leadStory)}>{leadStory.headline}</Link></h2><p className="story-dek">{leadStory.dek}</p></div>
          <Link className="lead-story-image" href={articlePath(leadStory)} aria-label={`Read ${leadStory.headline}`}><Image src={leadStory.image.src} alt={leadStory.image.alt} width={1800} height={1024} priority sizes="(max-width: 800px) 100vw, 54vw" /></Link>
        </article>
        <div className="secondary-story-grid">{secondaryStories.map((story) => <article className="secondary-story" key={story.slug}>
          <Link className="secondary-story-image" href={articlePath(story)}><Image src={story.image.src} alt={story.image.alt} width={1800} height={1024} sizes="(max-width: 800px) 100vw, 32vw" /></Link><p className="story-label">{story.sport}</p><h2><Link href={articlePath(story)}>{story.headline}</Link></h2><p className="story-dek">{story.dek}</p>
        </article>)}</div>
      </section>
      <aside className="homepage-rail" aria-label="Games and results">
        <section id="upcoming-games" className="rail-section" aria-labelledby="calendar-heading"><p id="calendar-heading" className="rail-kicker">On the Calendar</p><HomeGameRail games={upcomingGames} /></section>
        <section id="recent-results" className="rail-section" aria-labelledby="scores-heading"><p id="scores-heading" className="rail-kicker">Final Scores</p><HomeGameRail games={recentResults} result /></section>
      </aside>
    </div>
  </main>;
}
