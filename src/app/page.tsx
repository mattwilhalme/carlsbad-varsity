import Link from "next/link";
import { HomeGameRail } from "@/components/HomeGameRail";
import { SchoolNav } from "@/components/SchoolNav";
import { StoryImage } from "@/components/StoryImage";
import { articlePath, leadStory, secondaryStories } from "@/data/editorial-data";
import { games } from "@/data/site-data";
import { getCuratedHomepageGames, hasPublishedScheduleDisplay } from "@/data/schedule-display-data";

export default function Home() {
  const curatedGames = getCuratedHomepageGames();
  const verifiedGames = games.filter((game) => game.dataStatus === "verified");
  const upcomingGames = hasPublishedScheduleDisplay ? curatedGames.upcoming : verifiedGames.filter((game) => game.status === "scheduled").sort((a, b) => a.date.localeCompare(b.date)).slice(0, 4);
  const recentResults = hasPublishedScheduleDisplay ? curatedGames.results : verifiedGames.filter((game) => game.status === "final").sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4);
  return <main className="editorial-home">
    <SchoolNav placement="home" />
    <div className="page-shell homepage-rule"><p>Independent high school sports coverage of North County San Diego</p></div>
    <div className="page-shell homepage-layout">
      <section className="homepage-news" aria-labelledby="top-stories-heading">
        <h1 id="top-stories-heading" className="visually-hidden">North County Varsity stories</h1>
        {leadStory ? <><article className={`lead-story${leadStory.image ? "" : " lead-story--text-only"}`}>
          <div className="lead-story-copy">{leadStory.kicker ? <p className="story-label">{leadStory.kicker}</p> : null}<h2><Link href={articlePath(leadStory)}>{leadStory.headline}</Link></h2><p className="story-dek">{leadStory.dek}</p>{leadStory.readDowns?.length ? <div className="read-down">{leadStory.readDowns.map((item) => <Link href={item.href} key={item.href}>{item.label}</Link>)}</div> : null}</div>
          {leadStory.image ? <Link className="lead-story-image" href={articlePath(leadStory)} aria-label={`Read ${leadStory.headline}`}><StoryImage src={leadStory.image.src} alt={leadStory.image.alt} width={leadStory.image.width} height={leadStory.image.height} priority sizes="(max-width: 800px) 100vw, 54vw" /></Link> : null}
        </article>
        <div className="secondary-story-grid">{secondaryStories.map((story) => <article className="secondary-story" data-role={story.homepageRole} key={story.slug}>
          {story.image ? <Link className="secondary-story-image" href={articlePath(story)}><StoryImage src={story.image.src} alt={story.image.alt} width={story.image.width} height={story.image.height} sizes="(max-width: 800px) 100vw, 32vw" /></Link> : null}<p className="story-label">{story.kicker || story.sport}</p><h2><Link href={articlePath(story)}>{story.headline}</Link></h2><p className="story-dek">{story.dek}</p>{story.readDowns?.length ? <div className="read-down">{story.readDowns.map((item) => <Link href={item.href} key={item.href}>{item.label}</Link>)}</div> : null}
        </article>)}</div></> : <div className="homepage-empty"><h2>No stories published yet</h2><p>North County Varsity coverage will appear here when it is published.</p></div>}
      </section>
      <aside className="homepage-rail" aria-label="Games and results">
        <section id="upcoming-games" className="rail-section" aria-labelledby="calendar-heading"><p id="calendar-heading" className="rail-kicker">On the Calendar</p><HomeGameRail games={upcomingGames} emptyMessage="No upcoming games selected." /></section>
        <section id="recent-results" className="rail-section" aria-labelledby="scores-heading"><p id="scores-heading" className="rail-kicker">Final Scores</p><HomeGameRail games={recentResults} result emptyMessage="No final scores selected." /></section>
      </aside>
    </div>
  </main>;
}
