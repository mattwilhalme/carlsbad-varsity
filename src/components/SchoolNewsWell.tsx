import Link from "next/link";
import { StoryImage } from "@/components/StoryImage";
import { articlePath } from "@/data/editorial-data";
import type { EditorialStory } from "@/domain/models";

export function SchoolNewsWell({ stories }: { stories: EditorialStory[] }) {
  const [featured, ...moreStories] = stories;

  return (
    <section className="school-news section-rule" aria-labelledby="school-news-heading">
      <div className="section-heading school-news-heading">
        <div><p className="kicker">Latest coverage</p><h2 id="school-news-heading">News</h2></div>
      </div>
      {featured ? (
        <>
          <article className={`school-news-lead${featured.image ? "" : " school-news-lead--text-only"}`}>
            {featured.image ? (
              <Link className="school-news-lead-image" href={articlePath(featured)} aria-label={`Read ${featured.headline}`}>
                <StoryImage src={featured.image.src} alt={featured.image.alt} width={featured.image.width} height={featured.image.height} sizes="(max-width: 760px) 100vw, 52vw" />
              </Link>
            ) : null}
            <div>
              <p className="story-label">{featured.sport}</p>
              <h3><Link href={articlePath(featured)}>{featured.headline}</Link></h3>
              <p>{featured.dek}</p>
            </div>
          </article>
          {moreStories.length ? <div className="school-news-stack">{moreStories.map((story) => (
            <article className="school-news-row" key={story.slug}>
              {story.image ? <Link className="school-news-thumb" href={articlePath(story)}><StoryImage src={story.image.src} alt={story.image.alt} width={story.image.width} height={story.image.height} sizes="120px" /></Link> : null}
              <div>
                <h3><Link href={articlePath(story)}>{story.headline}</Link></h3>
                <p>{story.dek}</p>
              </div>
            </article>
          ))}</div> : null}
        </>
      ) : <div className="empty-state compact"><h3>Coverage coming soon</h3><p>Stories about this school will appear here.</p></div>}
    </section>
  );
}
