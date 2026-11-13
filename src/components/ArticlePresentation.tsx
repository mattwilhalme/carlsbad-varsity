import Link from "next/link";

import { ArticleBody } from "@/components/ArticleBody";
import { StoryImage } from "@/components/StoryImage";
import type { EditorialStory } from "@/domain/models";

function articleDate(value: string) {
  const date = new Date(value.includes("T") ? value : `${value}T12:00:00`);
  return Number.isNaN(date.valueOf()) ? null : date;
}

export function ArticlePresentation({ preview = false, related = [], story }: {
  preview?: boolean;
  related?: EditorialStory[];
  story: EditorialStory;
}) {
  const date = articleDate(story.publishedAt);
  return <main className="article-page">
    {preview ? <div className="preview-banner" role="status"><strong>Unpublished preview</strong><span>This page is visible only through an authorized preview link.</span></div> : null}
    <article>
      <header className="page-shell article-header"><p className="story-label">{story.sport} · Carlsbad</p><h1>{story.headline}</h1>{story.subheadline ? <p className="article-dek">{story.subheadline}</p> : null}<div className="article-byline"><strong>By {story.byline}</strong>{date ? <time dateTime={story.publishedAt}>{date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</time> : null}</div></header>
      <figure className="page-shell article-hero"><StoryImage src={story.image.src} alt={story.image.alt} width={story.image.width} height={story.image.height} priority sizes="(max-width: 1180px) 100vw, 1180px" />{story.image.credit || story.image.caption ? <figcaption>{story.image.caption}{story.image.caption && story.image.credit ? " · " : ""}{story.image.credit}</figcaption> : null}</figure>
      <div className="page-shell article-layout"><div className="article-body">
        {story.boxScore ? <section className="article-box-score" aria-labelledby="box-score-heading"><p className="rail-kicker">Game Summary</p><h2 id="box-score-heading">Box score</h2><div className="period-table-wrap"><table className="period-table"><thead><tr><th>Team</th>{story.boxScore.periods.map((period) => <th key={period}>{period}</th>)}<th>Final</th></tr></thead><tbody>{story.boxScore.teams.map((team) => <tr key={team.name}><th scope="row">{team.name}</th>{team.scores.map((score, index) => <td key={`${team.name}-${index}`}>{score}</td>)}<td><strong>{team.total}</strong></td></tr>)}</tbody></table></div></section> : null}
        <div className="article-copy"><ArticleBody body={story.body} /></div>
      </div>
        <aside className="article-sidebar">
          {story.standings ? <section className="league-standings" aria-labelledby="standings-heading"><p className="story-label">{story.sport}</p><h2 id="standings-heading">League Standings</h2><table><thead><tr><th>Team</th><th>League</th><th>Overall</th></tr></thead><tbody>{story.standings.map((team) => <tr key={team.team}><th scope="row">{team.team}</th><td>{team.league}</td><td>{team.overall}</td></tr>)}</tbody></table></section> : null}
          {related.length ? <section className="article-related"><h2>More Coverage</h2>{related.map((item) => <Link href={`/articles/${item.slug}/`} key={item.slug}><span>{item.sport}</span><strong>{item.headline}</strong></Link>)}</section> : null}
        </aside>
      </div>
    </article>
  </main>;
}
