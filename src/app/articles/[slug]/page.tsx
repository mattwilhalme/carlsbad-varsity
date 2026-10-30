import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { articlePath, editorialStories, getEditorialStory } from "@/data/editorial-data";

export function generateStaticParams() { return editorialStories.map((story) => ({ slug: story.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const story = getEditorialStory(slug);
  return story ? { title: story.headline, description: story.dek } : {};
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const story = getEditorialStory(slug);
  if (!story) notFound();
  const related = editorialStories.filter((item) => item.slug !== story.slug);
  return <main className="article-page"><article>
    <header className="page-shell article-header"><p className="story-label">{story.sport} · Carlsbad</p><h1>{story.headline}</h1><p className="article-dek">{story.dek}</p><div className="article-byline"><strong>By {story.byline}</strong><time dateTime={story.publishedAt}>{new Date(`${story.publishedAt}T12:00:00`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</time></div></header>
    <figure className="page-shell article-hero"><Image src={story.image.src} alt={story.image.alt} width={1800} height={1024} priority sizes="(max-width: 1180px) 100vw, 1180px" /><figcaption>{story.image.credit}</figcaption></figure>
    <div className="page-shell article-layout"><div className="article-body">
      <section className="article-box-score" aria-labelledby="box-score-heading"><p className="rail-kicker">Game Summary</p><h2 id="box-score-heading">Box score</h2><div className="period-table-wrap"><table className="period-table"><thead><tr><th>Team</th>{story.boxScore.periods.map((period) => <th key={period}>{period}</th>)}<th>Final</th></tr></thead><tbody>{story.boxScore.teams.map((team) => <tr key={team.name}><th scope="row">{team.name}</th>{team.scores.map((score, index) => <td key={`${team.name}-${index}`}>{score}</td>)}<td><strong>{team.total}</strong></td></tr>)}</tbody></table></div></section>
      <div className="article-copy">{story.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
    </div>
      <aside className="article-sidebar">
        <section className="league-standings" aria-labelledby="standings-heading"><p className="story-label">{story.sport}</p><h2 id="standings-heading">League Standings</h2><table><thead><tr><th>Team</th><th>League</th><th>Overall</th></tr></thead><tbody>{story.standings.map((team) => <tr key={team.team}><th scope="row">{team.team}</th><td>{team.league}</td><td>{team.overall}</td></tr>)}</tbody></table></section>
        <section className="article-related"><h2>More Coverage</h2>{related.map((item) => <Link href={articlePath(item)} key={item.slug}><span>{item.sport}</span><strong>{item.headline}</strong></Link>)}</section>
      </aside>
    </div>
  </article></main>;
}
