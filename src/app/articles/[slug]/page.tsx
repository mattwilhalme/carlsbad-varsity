import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticlePresentation } from "@/components/ArticlePresentation";
import { getEditorialStory, publishedStories } from "@/data/editorial-data";

const emptyExportSlug = "__no-published-articles__";

export function generateStaticParams() {
  return publishedStories.length
    ? publishedStories.map((story) => ({ slug: story.slug }))
    : [{ slug: emptyExportSlug }];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const story = getEditorialStory(slug);
  return story ? { title: story.headline, description: story.dek } : {};
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const story = getEditorialStory(slug);
  if (!story) notFound();
  const related = publishedStories.filter((item) => item.slug !== story.slug).slice(0, 4);
  return <ArticlePresentation story={story} related={related} />;
}
