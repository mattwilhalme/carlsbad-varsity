import type { EditorialStory } from "@/domain/models";
import type { PublicContentBundleV1 } from "@/data/article-contract";
import publicContent from "@/data/generated/public-content.v1.json";
import { publicArticleToStory } from "@/data/public-article-mapper";

const publicContentSnapshot = publicContent as PublicContentBundleV1;
const cmsStories: EditorialStory[] = publicContentSnapshot.articles.articles.map(publicArticleToStory);

export const publishedStories = [...cmsStories].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

const cmsById = new Map(cmsStories.map((story) => [story.id?.replace(/^cms:/, ""), story]));
const configuredStories = publicContentSnapshot.homepage.homepage?.stories.flatMap((entry): EditorialStory[] => {
  const story = cmsById.get(entry.articleId);
  if (!story) return [];
  return [{
    ...story,
    headline: entry.headline,
    dek: entry.summary,
    homepageRole: entry.role,
    kicker: entry.kicker || undefined,
    image: entry.thumbnail
      ? {
          src: entry.thumbnail.url,
          alt: entry.thumbnail.alt,
          credit: entry.thumbnail.credit || entry.thumbnail.caption || "",
          caption: entry.thumbnail.caption,
          width: entry.thumbnail.width,
          height: entry.thumbnail.height,
        }
      : story.image,
    readDowns: entry.readDowns.map((item) => ({ label: item.headline, href: `/articles/${item.slug}/` })),
  }];
}) ?? [];

// A published Homepage is authoritative even when it intentionally contains no stories.
// Before a Homepage has been published, the newest published articles remain the fallback.
export const homepageStories = publicContentSnapshot.homepage.homepage === null
  ? publishedStories
  : configuredStories;
export const leadStory = homepageStories.find((story) => story.homepageRole === "lead") ?? homepageStories[0];
export const secondaryStories = leadStory
  ? homepageStories.filter((story) => story.slug !== leadStory.slug)
  : [];

export function getEditorialStory(slug: string) { return publishedStories.find((story) => story.slug === slug); }
export function articlePath(story: EditorialStory) { return `/articles/${story.slug}/`; }
